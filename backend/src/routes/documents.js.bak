const express = require('express');
const { Document, Project, User, Collaborator } = require('../models');
const { authenticateToken, requireCompleteProfile } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { 
  handleValidationErrors, 
  successResponse, 
  errorResponse,
  paginate,
  formatPaginatedResponse,
  sanitizeInput
} = require('../utils/helpers');
const { Op } = require('sequelize');

const router = express.Router();

// Validadores para documentos
const validateCreateDocument = [
  body('project_id')
    .isUUID()
    .withMessage('ID do projeto deve ser um UUID válido'),
  
  body('titulo')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Título deve ter entre 3 e 200 caracteres'),
  
  body('etapa')
    .isIn([
      'contexto-problema', 'discovery', 'swot-csd', 'personas',
      'pesquisa-usuarios', 'validacao-hipoteses', 'features-priorizacao',
      'user-stories-fluxos', 'criterios-metricas', 'roadmap-backlog',
      'prototipo', 'prd-final', 'lancamento'
    ])
    .withMessage('Etapa inválida'),
  
  body('conteudo')
    .optional()
    .isLength({ max: 50000 })
    .withMessage('Conteúdo muito longo (máximo 50.000 caracteres)'),
  
  body('formato')
    .optional()
    .isIn(['markdown', 'html', 'json', 'pdf'])
    .withMessage('Formato inválido'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cada tag deve ter entre 1 e 50 caracteres'),
];

const validateUpdateDocument = [
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Título deve ter entre 3 e 200 caracteres'),
  
  body('conteudo')
    .optional()
    .isLength({ max: 50000 })
    .withMessage('Conteúdo muito longo (máximo 50.000 caracteres)'),
  
  body('status')
    .optional()
    .isIn(['rascunho', 'em_revisao', 'aprovado', 'arquivado'])
    .withMessage('Status inválido'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array'),
];

// Middleware para verificar permissão no projeto
const checkProjectPermission = async (req, res, next) => {
  try {
    const projectId = req.body.project_id || req.params.project_id;
    const userId = req.userId;

    // Verificar se o projeto existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      return errorResponse(res, 'Projeto não encontrado', 404);
    }

    // Verificar se é o dono do projeto
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
    console.error('Erro ao verificar permissão do projeto:', error);
    errorResponse(res, 'Erro interno do servidor', 500);
  }
};

// Middleware para verificar permissão no documento
const checkDocumentPermission = (action = 'read') => {
  return async (req, res, next) => {
    try {
      const documentId = req.params.id;
      const userId = req.userId;

      const document = await Document.findByPk(documentId, {
        include: [
          {
            model: Project,
            as: 'project',
            include: [
              {
                model: Collaborator,
                as: 'collaborators',
                where: { user_id: userId, status: 'ativo' },
                required: false
              }
            ]
          }
        ]
      });

      if (!document) {
        return errorResponse(res, 'Documento não encontrado', 404);
      }

      const project = document.project;
      const isOwner = project.user_id === userId;
      const collaboration = project.collaborators?.[0];

      if (!isOwner && !collaboration) {
        return errorResponse(res, 'Você não tem permissão para acessar este documento', 403);
      }

      // Verificar permissões específicas para a ação
      if (!isOwner && collaboration) {
        const permissions = collaboration.permissoes;
        
        switch (action) {
          case 'create':
            if (!permissions.pode_criar_documentos) {
              return errorResponse(res, 'Você não tem permissão para criar documentos', 403);
            }
            break;
          case 'edit':
            if (!permissions.pode_editar_documentos) {
              return errorResponse(res, 'Você não tem permissão para editar documentos', 403);
            }
            break;
          case 'delete':
            if (!permissions.pode_excluir_documentos) {
              return errorResponse(res, 'Você não tem permissão para excluir documentos', 403);
            }
            break;
        }
      }

      req.document = document;
      req.project = project;
      req.userRole = isOwner ? 'owner' : collaboration.role;
      next();

    } catch (error) {
      console.error('Erro ao verificar permissão do documento:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  };
};

// GET /api/documents - Listar documentos do usuário
router.get('/', 
  authenticateToken,
  query('project_id').optional().isUUID().withMessage('ID do projeto inválido'),
  query('etapa').optional().isIn([
    'contexto-problema', 'discovery', 'swot-csd', 'personas',
    'pesquisa-usuarios', 'validacao-hipoteses', 'features-priorizacao',
    'user-stories-fluxos', 'criterios-metricas', 'roadmap-backlog',
    'prototipo', 'prd-final', 'lancamento'
  ]).withMessage('Etapa inválida'),
  query('status').optional().isIn(['rascunho', 'em_revisao', 'aprovado', 'arquivado']).withMessage('Status inválido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { project_id, etapa, status, page = 1, limit = 10, search } = req.query;
      const { limit: limitNum, offset } = paginate(page, limit);
      const userId = req.userId;

      // Buscar projetos do usuário e colaborações
      const userProjects = await Project.findAll({
        where: { user_id: userId },
        attributes: ['id']
      });

      const collaborations = await Collaborator.findAll({
        where: { user_id: userId, status: 'ativo' },
        attributes: ['project_id']
      });

      const projectIds = [
        ...userProjects.map(p => p.id),
        ...collaborations.map(c => c.project_id)
      ];

      if (projectIds.length === 0) {
        return successResponse(res, formatPaginatedResponse([], page, limit, 0), 'Nenhum documento encontrado');
      }

      // Construir filtros
      let whereClause = {
        project_id: { [Op.in]: projectIds }
      };

      if (project_id) whereClause.project_id = project_id;
      if (etapa) whereClause.etapa = etapa;
      if (status) whereClause.status = status;
      if (search) {
        whereClause[Op.or] = [
          { titulo: { [Op.iLike]: `%${search}%` } },
          { conteudo: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: documents } = await Document.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome', 'user_id']
          }
        ],
        limit: limitNum,
        offset,
        order: [['updated_at', 'DESC']]
      });

      const paginatedResponse = formatPaginatedResponse(documents, page, limit, count);
      successResponse(res, paginatedResponse, 'Documentos obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// POST /api/documents - Criar novo documento
router.post('/',
  authenticateToken,
  requireCompleteProfile,
  validateCreateDocument,
  handleValidationErrors,
  checkProjectPermission,
  async (req, res) => {
    try {
      const { project_id, titulo, etapa, conteudo, formato = 'markdown', tags = [], conteudo_estruturado = {} } = req.body;

      // Verificar se já existe documento para esta etapa
      const existingDocument = await Document.findOne({
        where: { project_id, etapa }
      });

      if (existingDocument) {
        return errorResponse(res, `Já existe um documento para a etapa "${etapa}". Use a atualização ou crie uma nova versão.`, 409);
      }

      const document = await Document.create({
        project_id,
        titulo: sanitizeInput(titulo),
        etapa,
        conteudo: sanitizeInput(conteudo),
        conteudo_estruturado,
        formato,
        tags: tags.map(tag => sanitizeInput(tag)),
        gerado_por_ia: false,
        status: 'rascunho'
      });

      const documentWithProject = await Document.findByPk(document.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome']
          }
        ]
      });

      successResponse(res, { document: documentWithProject }, '📝 Documento criado com sucesso! Sua criação está tomando forma.', 201);

    } catch (error) {
      console.error('Erro ao criar documento:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/documents/:id - Obter documento específico
router.get('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento inválido'),
  handleValidationErrors,
  checkDocumentPermission('read'),
  async (req, res) => {
    try {
      const document = req.document;
      successResponse(res, { document }, 'Documento obtido com sucesso');

    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// PUT /api/documents/:id - Atualizar documento
router.put('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento inválido'),
  validateUpdateDocument,
  handleValidationErrors,
  checkDocumentPermission('edit'),
  async (req, res) => {
    try {
      const document = req.document;
      const { titulo, conteudo, status, tags, conteudo_estruturado, feedback_usuario } = req.body;

      const updateData = {};
      if (titulo) updateData.titulo = sanitizeInput(titulo);
      if (conteudo !== undefined) updateData.conteudo = sanitizeInput(conteudo);
      if (status) updateData.status = status;
      if (tags) updateData.tags = tags.map(tag => sanitizeInput(tag));
      if (conteudo_estruturado) updateData.conteudo_estruturado = conteudo_estruturado;
      if (feedback_usuario) updateData.feedback_usuario = sanitizeInput(feedback_usuario);

      await document.update(updateData);

      const updatedDocument = await Document.findByPk(document.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'nome']
          }
        ]
      });

      const message = status === 'aprovado' 
        ? '✅ Documento aprovado! Sua criação está evoluindo perfeitamente.'
        : '📝 Documento atualizado com sucesso!';

      successResponse(res, { document: updatedDocument }, message);

    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// DELETE /api/documents/:id - Excluir documento
router.delete('/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento inválido'),
  handleValidationErrors,
  checkDocumentPermission('delete'),
  async (req, res) => {
    try {
      const document = req.document;
      await document.destroy();

      successResponse(res, null, '🗑️ Documento excluído com sucesso.');

    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// POST /api/documents/:id/approve - Aprovar documento
router.post('/:id/approve',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento inválido'),
  handleValidationErrors,
  checkDocumentPermission('edit'),
  async (req, res) => {
    try {
      const document = req.document;
      const userId = req.userId;

      await document.aprovar(userId);

      successResponse(res, { document }, '✅ Documento aprovado! Sua criação está evoluindo perfeitamente.');

    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/documents/project/:project_id - Listar documentos de um projeto específico
router.get('/project/:project_id',
  authenticateToken,
  param('project_id').isUUID().withMessage('ID do projeto inválido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { project_id } = req.params;
      const userId = req.userId;

      // Verificar permissão no projeto
      const project = await Project.findByPk(project_id);
      if (!project) {
        return errorResponse(res, 'Projeto não encontrado', 404);
      }

      const isOwner = project.user_id === userId;
      const collaboration = await Collaborator.findOne({
        where: { project_id, user_id: userId, status: 'ativo' }
      });

      if (!isOwner && !collaboration) {
        return errorResponse(res, 'Você não tem permissão para acessar este projeto', 403);
      }

      const documents = await Document.findAll({
        where: { project_id },
        order: [['etapa', 'ASC'], ['created_at', 'DESC']]
      });

      successResponse(res, { documents }, 'Documentos do projeto obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao buscar documentos do projeto:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

module.exports = router;
