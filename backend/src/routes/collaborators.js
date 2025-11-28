const express = require('express');
const { Collaborator, Project, User, UserProfile } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { 
  handleValidationErrors, 
  successResponse, 
  errorResponse,
  generateRandomToken,
  isValidEmail,
  paginate,
  formatPaginatedResponse
} = require('../utils/helpers');
const { Op } = require('sequelize');

const router = express.Router();

// Validadores para colaboradores
const validateInviteCollaborator = [
  body('project_id')
    .isUUID()
    .withMessage('ID do projeto deve ser um UUID válido'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),
  
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('role')
    .isIn(['admin', 'editor', 'viewer', 'comentarista'])
    .withMessage('Role inválido'),
  
  body('permissoes')
    .optional()
    .isObject()
    .withMessage('Permissões devem ser um objeto'),
];

const validateUpdateCollaborator = [
  body('role')
    .optional()
    .isIn(['admin', 'editor', 'viewer', 'comentarista'])
    .withMessage('Role inválido'),
  
  body('permissoes')
    .optional()
    .isObject()
    .withMessage('Permissões devem ser um objeto'),
  
  body('status')
    .optional()
    .isIn(['pendente', 'ativo', 'inativo'])
    .withMessage('Status inválido'),
];

// Middleware para verificar se é dono do projeto ou admin
const checkProjectOwnership = async (req, res, next) => {
  try {
    const projectId = req.body.project_id || req.params.project_id;
    const userId = req.userId;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return errorResponse(res, 'Projeto não encontrado', 404);
    }

    // Verificar se é o dono
    if (project.user_id === userId) {
      req.project = project;
      req.userRole = 'owner';
      return next();
    }

    // Verificar se é admin do projeto
    const collaboration = await Collaborator.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
        role: 'admin',
        status: 'ativo'
      }
    });

    if (!collaboration) {
      return errorResponse(res, 'Você não tem permissão para gerenciar colaboradores deste projeto', 403);
    }

    req.project = project;
    req.collaboration = collaboration;
    req.userRole = 'admin';
    next();

  } catch (error) {
    console.error('Erro ao verificar propriedade do projeto:', error);
    errorResponse(res, 'Erro interno do servidor', 500);
  }
};

// Middleware para verificar acesso ao projeto
const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.project_id;
    const userId = req.userId;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return errorResponse(res, 'Projeto não encontrado', 404);
    }

    // Verificar se é o dono
    if (project.user_id === userId) {
      req.project = project;
      req.userRole = 'owner';
      return next();
    }

    // Verificar se é colaborador
    const collaboration = await Collaborator.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
        status: 'ativo'
      }
    });

    if (!collaboration) {
      return errorResponse(res, 'Você não tem permissão para acessar este projeto', 403);
    }

    req.project = project;
    req.collaboration = collaboration;
    req.userRole = collaboration.role;
    next();

  } catch (error) {
    console.error('Erro ao verificar acesso ao projeto:', error);
    errorResponse(res, 'Erro interno do servidor', 500);
  }
};

// GET /api/collaborators/:project_id - Listar colaboradores do projeto
router.get('/:project_id',
  authenticateToken,
  param('project_id').isUUID().withMessage('ID do projeto inválido'),
  handleValidationErrors,
  checkProjectAccess,
  async (req, res) => {
    try {
      const { project_id } = req.params;
      const { page = 1, limit = 10, status, role } = req.query;
      const { limit: limitNum, offset } = paginate(page, limit);

      let whereClause = { project_id };
      if (status) whereClause.status = status;
      if (role) whereClause.role = role;

      const { count, rows: collaborators } = await Collaborator.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'email', 'avatar_url'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['area_atuacao', 'bio']
              }
            ],
            required: false
          },
          {
            model: User,
            as: 'convidador',
            attributes: ['id', 'nome']
          }
        ],
        limit: limitNum,
        offset,
        order: [['created_at', 'DESC']]
      });

      const paginatedResponse = formatPaginatedResponse(collaborators, page, limit, count);
      successResponse(res, paginatedResponse, 'Colaboradores obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao listar colaboradores:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// POST /api/collaborators - Convidar colaborador
router.post('/',
  authenticateToken,
  validateInviteCollaborator,
  handleValidationErrors,
  checkProjectOwnership,
  async (req, res) => {
    try {
      const { project_id, email, nome, role, permissoes } = req.body;
      const userId = req.userId;

      // Verificar se já existe colaborador com este email
      const existingCollaborator = await Collaborator.findOne({
        where: { project_id, email }
      });

      if (existingCollaborator) {
        if (existingCollaborator.status === 'ativo') {
          return errorResponse(res, 'Este usuário já é colaborador do projeto', 409);
        } else if (existingCollaborator.status === 'pendente') {
          return errorResponse(res, 'Já existe um convite pendente para este email', 409);
        }
      }

      // Verificar se o email é do próprio dono
      const project = req.project;
      const owner = await User.findByPk(project.user_id);
      if (owner.email === email.toLowerCase()) {
        return errorResponse(res, 'Você não pode convidar a si mesmo como colaborador', 400);
      }

      // Buscar usuário existente
      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });

      const collaborator = await Collaborator.create({
        project_id,
        user_id: existingUser ? existingUser.id : null,
        email: email.toLowerCase(),
        nome: nome || null,
        role,
        status: 'pendente',
        convidado_por: userId,
        convite_token: generateRandomToken(),
        convite_expira_em: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        permissoes: permissoes || undefined, // Será definido pelo hook do modelo
      });

      // Buscar colaborador completo
      const collaboratorWithDetails = await Collaborator.findByPk(collaborator.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'email', 'avatar_url'],
            required: false
          },
          {
            model: User,
            as: 'convidador',
            attributes: ['id', 'nome']
          },
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome']
          }
        ]
      });

      // TODO: Enviar email de convite
      // await sendCollaborationInviteEmail(collaborator);

      const message = existingUser 
        ? `🤝 Convite enviado para ${existingUser.nome}! Eles receberão uma notificação.`
        : `📧 Convite enviado para ${email}! Eles precisarão se cadastrar para colaborar.`;

      successResponse(res, { 
        collaborator: collaboratorWithDetails,
        invite_url: `${process.env.FRONTEND_URL}/invite/${collaborator.convite_token}`
      }, message, 201);

    } catch (error) {
      console.error('Erro ao convidar colaborador:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// PUT /api/collaborators/:id - Atualizar colaborador
router.put('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do colaborador inválido'),
  validateUpdateCollaborator,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role, permissoes, status } = req.body;
      const userId = req.userId;

      const collaborator = await Collaborator.findByPk(id, {
        include: [
          {
            model: Project,
            as: 'project'
          }
        ]
      });

      if (!collaborator) {
        return errorResponse(res, 'Colaborador não encontrado', 404);
      }

      const project = collaborator.project;

      // Verificar permissão para atualizar
      const isOwner = project.user_id === userId;
      const isAdmin = await Collaborator.findOne({
        where: {
          project_id: project.id,
          user_id: userId,
          role: 'admin',
          status: 'ativo'
        }
      });

      if (!isOwner && !isAdmin) {
        return errorResponse(res, 'Você não tem permissão para atualizar este colaborador', 403);
      }

      // Não permitir que admin altere o owner ou outros admins (apenas owner pode)
      if (!isOwner && (collaborator.role === 'admin' || role === 'admin')) {
        return errorResponse(res, 'Apenas o dono do projeto pode gerenciar administradores', 403);
      }

      const updateData = {};
      if (role) updateData.role = role;
      if (status) updateData.status = status;
      if (permissoes) {
        updateData.permissoes = {
          ...collaborator.permissoes,
          ...permissoes
        };
      }

      await collaborator.update(updateData);

      const updatedCollaborator = await Collaborator.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'email', 'avatar_url'],
            required: false
          }
        ]
      });

      successResponse(res, { collaborator: updatedCollaborator }, '✨ Colaborador atualizado com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// DELETE /api/collaborators/:id - Remover colaborador
router.delete('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do colaborador inválido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const collaborator = await Collaborator.findByPk(id, {
        include: [
          {
            model: Project,
            as: 'project'
          }
        ]
      });

      if (!collaborator) {
        return errorResponse(res, 'Colaborador não encontrado', 404);
      }

      const project = collaborator.project;

      // Verificar permissão para remover
      const isOwner = project.user_id === userId;
      const isAdmin = await Collaborator.findOne({
        where: {
          project_id: project.id,
          user_id: userId,
          role: 'admin',
          status: 'ativo'
        }
      });
      const isSelf = collaborator.user_id === userId;

      if (!isOwner && !isAdmin && !isSelf) {
        return errorResponse(res, 'Você não tem permissão para remover este colaborador', 403);
      }

      // Não permitir que admin remova outros admins (apenas owner pode)
      if (!isOwner && !isSelf && collaborator.role === 'admin') {
        return errorResponse(res, 'Apenas o dono do projeto pode remover administradores', 403);
      }

      await collaborator.update({ status: 'removido' });

      const message = isSelf 
        ? '👋 Você saiu do projeto com sucesso.'
        : '🗑️ Colaborador removido com sucesso.';

      successResponse(res, null, message);

    } catch (error) {
      console.error('Erro ao remover colaborador:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// POST /api/collaborators/accept/:token - Aceitar convite
router.post('/accept/:token',
  authenticateToken,
  param('token').isLength({ min: 32, max: 128 }).withMessage('Token inválido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token } = req.params;
      const userId = req.userId;

      const collaborator = await Collaborator.findOne({
        where: {
          convite_token: token,
          status: 'pendente'
        },
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome']
          }
        ]
      });

      if (!collaborator) {
        return errorResponse(res, 'Convite não encontrado ou já utilizado', 404);
      }

      // Verificar se o convite não expirou
      if (collaborator.convite_expira_em < new Date()) {
        return errorResponse(res, 'Este convite expirou. Solicite um novo convite.', 400);
      }

      // Verificar se o email do usuário logado confere
      const user = await User.findByPk(userId);
      if (user.email !== collaborator.email) {
        return errorResponse(res, 'Este convite não é para o seu email', 400);
      }

      await collaborator.aceitar(userId);

      const updatedCollaborator = await Collaborator.findByPk(collaborator.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome']
          }
        ]
      });

      successResponse(res, { 
        collaborator: updatedCollaborator 
      }, `🎉 Bem-vindo ao projeto "${collaborator.project.nome}"! Agora você pode colaborar na criação.`);

    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/collaborators/invite/:token - Obter detalhes do convite
router.get('/invite/:token',
  param('token').isLength({ min: 32, max: 128 }).withMessage('Token inválido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token } = req.params;

      const collaborator = await Collaborator.findOne({
        where: {
          convite_token: token,
          status: 'pendente'
        },
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome', 'descricao'],
            include: [
              {
                model: User,
                as: 'owner',
                attributes: ['id', 'nome', 'avatar_url']
              }
            ]
          },
          {
            model: User,
            as: 'convidador',
            attributes: ['id', 'nome']
          }
        ]
      });

      if (!collaborator) {
        return errorResponse(res, 'Convite não encontrado ou já utilizado', 404);
      }

      // Verificar se o convite não expirou
      if (collaborator.convite_expira_em < new Date()) {
        return errorResponse(res, 'Este convite expirou', 400);
      }

      // Retornar apenas informações públicas
      const inviteDetails = {
        email: collaborator.email,
        role: collaborator.role,
        project: collaborator.project,
        convidador: collaborator.convidador,
        data_convite: collaborator.data_convite,
        expira_em: collaborator.convite_expira_em
      };

      successResponse(res, { invite: inviteDetails }, 'Detalhes do convite obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao buscar detalhes do convite:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/collaborators/my-collaborations - Listar colaborações do usuário
router.get('/my-collaborations',
  authenticateToken,
  query('status').optional().isIn(['pendente', 'ativo', 'inativo']).withMessage('Status inválido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.userId;
      const { status, page = 1, limit = 10 } = req.query;
      const { limit: limitNum, offset } = paginate(page, limit);

      let whereClause = { user_id: userId };
      if (status) whereClause.status = status;

      const { count, rows: collaborations } = await Collaborator.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome', 'descricao', 'status', 'etapa_atual'],
            include: [
              {
                model: User,
                as: 'owner',
                attributes: ['id', 'nome', 'avatar_url']
              }
            ]
          }
        ],
        limit: limitNum,
        offset,
        order: [['created_at', 'DESC']]
      });

      const paginatedResponse = formatPaginatedResponse(collaborations, page, limit, count);
      successResponse(res, paginatedResponse, 'Suas colaborações obtidas com sucesso');

    } catch (error) {
      console.error('Erro ao buscar colaborações:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

module.exports = router;
