const express = require('express');
const { body, param, query } = require('express-validator');
const { Op } = require('sequelize');
const { Document, Project, Collaborator, DocumentVersion, User } = require('../models');
const { authenticateToken, requireCompleteProfile } = require('../middleware/auth');
const {
  handleValidationErrors,
  successResponse,
  errorResponse,
  paginate,
  formatPaginatedResponse,
  sanitizeInput,
} = require('../utils/helpers');

const router = express.Router();

const STEP_KEYS = [
  'contexto-problema',
  'discovery',
  'swot-csd',
  'personas',
  'pesquisa-usuarios',
  'validacao-hipoteses',
  'features-priorizacao',
  'user-stories-fluxos',
  'criterios-metricas',
  'roadmap-backlog',
  'prototipo',
  'prd-final',
  'lancamento',
];

const validateCreateDocument = [
  body('project_id').isUUID().withMessage('ID do projeto deve ser um UUID valido'),
  body('titulo').trim().isLength({ min: 3, max: 200 }).withMessage('Titulo deve ter entre 3 e 200 caracteres'),
  body('etapa').isIn(STEP_KEYS).withMessage('Etapa invalida'),
  body('conteudo').optional().isLength({ max: 50000 }).withMessage('Conteudo muito longo (max 50.000 caracteres)'),
  body('formato').optional().isIn(['markdown', 'html', 'json', 'pdf']).withMessage('Formato invalido'),
  body('tags').optional().isArray().withMessage('Tags devem ser um array'),
  body('tags.*').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Cada tag deve ter entre 1 e 50 caracteres'),
];

const validateUpdateDocument = [
  body('titulo').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Titulo deve ter entre 3 e 200 caracteres'),
  body('conteudo').optional().isLength({ max: 50000 }).withMessage('Conteudo muito longo (max 50.000 caracteres)'),
  body('status').optional().isIn(['rascunho', 'em_revisao', 'aprovado', 'arquivado']).withMessage('Status invalido'),
  body('tags').optional().isArray().withMessage('Tags devem ser um array'),
];

const checkProjectPermission = async (req, res, next) => {
  try {
    const projectId = req.body.project_id || req.params.project_id || req.projectId;
    const userId = req.userId;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return errorResponse(res, 'Projeto nao encontrado', 404);
    }
    if (project.user_id === userId) {
      req.project = project;
      req.userRole = 'owner';
      return next();
    }
    const collaboration = await Collaborator.findOne({
      where: { project_id: projectId, user_id: userId, status: 'ativo' },
    });
    if (!collaboration) {
      return errorResponse(res, 'Voce nao tem permissao para acessar este projeto', 403);
    }
    req.project = project;
    req.collaboration = collaboration;
    req.userRole = collaboration.role;
    return next();
  } catch (error) {
    console.error('Erro ao verificar permissao do projeto:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
};

const checkDocumentPermission = (action = 'read') => {
  return async (req, res, next) => {
    try {
      const documentId = req.params.id || req.params.document_id;
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
                required: false,
              },
            ],
          },
        ],
      });
      if (!document) return errorResponse(res, 'Documento nao encontrado', 404);
      const project = document.project;
      const isOwner = project.user_id === userId;
      const collaboration = project.collaborators?.[0];
      if (!isOwner && !collaboration) return errorResponse(res, 'Voce nao tem permissao', 403);
      if (!isOwner && collaboration) {
        const permissions = collaboration.permissoes || {};
        if (action === 'create' && !permissions.pode_criar_documentos) return errorResponse(res, 'Sem permissao', 403);
        if (action === 'edit' && !permissions.pode_editar_documentos) return errorResponse(res, 'Sem permissao', 403);
        if (action === 'delete' && !permissions.pode_excluir_documentos) return errorResponse(res, 'Sem permissao', 403);
      }
      req.document = document;
      req.project = project;
      req.userRole = isOwner ? 'owner' : collaboration?.role;
      return next();
    } catch (error) {
      console.error('Erro ao verificar permissao do documento:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  };
};

router.get(
  '/',
  authenticateToken,
  query('project_id').optional().isUUID().withMessage('ID do projeto invalido'),
  query('etapa').optional().isIn(STEP_KEYS).withMessage('Etapa invalida'),
  query('status').optional().isIn(['rascunho', 'em_revisao', 'aprovado', 'arquivado']).withMessage('Status invalido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { project_id, etapa, status, page = 1, limit = 10, search } = req.query;
      const { limit: limitNum, offset } = paginate(page, limit);
      const userId = req.userId;
      const ownedProjects = await Project.findAll({ where: { user_id: userId }, attributes: ['id'] });
      const collabs = await Collaborator.findAll({
        where: { user_id: userId, status: 'ativo' },
        attributes: ['project_id'],
      });
      const projectIds = [...ownedProjects.map((p) => p.id), ...collabs.map((c) => c.project_id)];
      if (!projectIds.length) {
        return successResponse(res, formatPaginatedResponse([], page, limit, 0), 'Nenhum documento encontrado');
      }
      const whereClause = { project_id: { [Op.in]: projectIds } };
      if (project_id) whereClause.project_id = project_id;
      if (etapa) whereClause.etapa = etapa;
      if (status) whereClause.status = status;
      if (search) {
        whereClause[Op.or] = [
          { titulo: { [Op.like]: `%${search}%` } },
          { conteudo: { [Op.like]: `%${search}%` } },
        ];
      }
      const { count, rows } = await Document.findAndCountAll({
        where: whereClause,
        include: [
          { model: Project, as: 'project', attributes: ['id', 'nome', 'user_id'] },
          { model: User, as: 'aprovador', attributes: ['id', 'nome', 'email'] },
        ],
        limit: limitNum,
        offset,
        order: [['updated_at', 'DESC']],
      });
      return successResponse(
        res,
        formatPaginatedResponse(rows, page, limit, count),
        'Documentos obtidos com sucesso',
      );
    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.post(
  '/',
  authenticateToken,
  requireCompleteProfile,
  validateCreateDocument,
  handleValidationErrors,
  checkProjectPermission,
  async (req, res) => {
    try {
      const { project_id, titulo, etapa, conteudo, formato = 'markdown', tags = [], conteudo_estruturado = {} } =
        req.body;
      const existing = await Document.findOne({ where: { project_id, etapa } });
      if (existing) {
        return errorResponse(res, `Ja existe um documento para a etapa "${etapa}".`, 409);
      }
      const document = await Document.create({
        project_id,
        titulo: sanitizeInput(titulo),
        etapa,
        conteudo: sanitizeInput(conteudo),
        conteudo_estruturado,
        formato,
        tags: tags.map(sanitizeInput),
        gerado_por_ia: false,
        status: 'rascunho',
      });
      const withProject = await Document.findByPk(document.id, {
        include: [{ model: Project, as: 'project', attributes: ['id', 'nome'] }],
      });
      return successResponse(res, { document: withProject }, 'Documento criado com sucesso', 201);
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.get(
  '/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento invalido'),
  handleValidationErrors,
  checkDocumentPermission('read'),
  async (req, res) => {
    try {
      const document = await Document.findByPk(req.document.id, {
        include: [
          { model: Project, as: 'project', attributes: ['id', 'nome'] },
          { model: User, as: 'aprovador', attributes: ['id', 'nome', 'email'] },
        ],
      });
      return successResponse(res, { document }, 'Documento obtido com sucesso');
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.put(
  '/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento invalido'),
  validateUpdateDocument,
  handleValidationErrors,
  checkDocumentPermission('edit'),
  async (req, res) => {
    try {
      const doc = req.document;
      const { titulo, conteudo, status, tags, conteudo_estruturado, feedback_usuario } = req.body;
      const updateData = {};
      if (titulo) updateData.titulo = sanitizeInput(titulo);
      if (conteudo !== undefined) updateData.conteudo = sanitizeInput(conteudo);
      if (status) updateData.status = status;
      if (tags) updateData.tags = tags.map(sanitizeInput);
      if (conteudo_estruturado) updateData.conteudo_estruturado = conteudo_estruturado;
      if (feedback_usuario) updateData.feedback_usuario = sanitizeInput(feedback_usuario);
      if (status === 'aprovado') {
        updateData.aprovado_por = req.userId;
        updateData.data_aprovacao = new Date();
      }
      const hasContentChange = conteudo !== undefined || conteudo_estruturado !== undefined;
      if (hasContentChange) {
        await DocumentVersion.create({
          document_id: doc.id,
          version: (doc.versao || 1) + 1,
          conteudo: conteudo ?? doc.conteudo,
          conteudo_estruturado: conteudo_estruturado ?? doc.conteudo_estruturado,
          criado_por: req.userId,
        });
        updateData.versao = (doc.versao || 1) + 1;
      }
      await doc.update(updateData);
      const updated = await Document.findByPk(doc.id, {
        include: [
          { model: Project, as: 'project', attributes: ['id', 'nome'] },
          { model: User, as: 'aprovador', attributes: ['id', 'nome', 'email'] },
        ],
      });
      const message = status === 'aprovado' ? 'Documento aprovado' : 'Documento atualizado';
      return successResponse(res, { document: updated }, message);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.delete(
  '/:id',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento invalido'),
  handleValidationErrors,
  checkDocumentPermission('delete'),
  async (req, res) => {
    try {
      await req.document.destroy();
      return successResponse(res, null, 'Documento excluido com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.post(
  '/:id/approve',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento invalido'),
  handleValidationErrors,
  checkDocumentPermission('edit'),
  async (req, res) => {
    try {
      const document = req.document;
      await document.aprovar(req.userId);
      return successResponse(res, { document }, 'Documento aprovado.');
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.get(
  '/project/:project_id',
  authenticateToken,
  param('project_id').isUUID().withMessage('ID do projeto invalido'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { project_id } = req.params;
      const userId = req.userId;
      const project = await Project.findByPk(project_id);
      if (!project) return errorResponse(res, 'Projeto nao encontrado', 404);
      const isOwner = project.user_id === userId;
      const collaboration = await Collaborator.findOne({
        where: { project_id, user_id: userId, status: 'ativo' },
      });
      if (!isOwner && !collaboration) return errorResponse(res, 'Sem permissao', 403);
      const documents = await Document.findAll({
        where: { project_id },
        order: [
          ['etapa', 'ASC'],
          ['created_at', 'DESC'],
        ],
      });
      return successResponse(res, { documents }, 'Documentos do projeto obtidos com sucesso');
    } catch (error) {
      console.error('Erro ao buscar documentos do projeto:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.get(
  '/:id/versions',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento invalido'),
  handleValidationErrors,
  checkDocumentPermission('read'),
  async (req, res) => {
    try {
      const versions = await DocumentVersion.findAll({
        where: { document_id: req.document.id },
        order: [['version', 'DESC']],
      });
      return successResponse(res, { versions }, 'Versoes obtidas com sucesso');
    } catch (error) {
      console.error('Erro ao listar versoes:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

router.post(
  '/:id/restore',
  authenticateToken,
  param('id').isUUID().withMessage('ID do documento invalido'),
  handleValidationErrors,
  checkDocumentPermission('edit'),
  body('version').isInt({ min: 1 }).withMessage('Versao invalida'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { version } = req.body;
      const doc = req.document;
      const versionRecord = await DocumentVersion.findOne({
        where: { document_id: doc.id, version },
      });
      if (!versionRecord) return errorResponse(res, 'Versao nao encontrada', 404);
      doc.conteudo = versionRecord.conteudo;
      doc.conteudo_estruturado = versionRecord.conteudo_estruturado;
      doc.versao = versionRecord.version;
      await doc.save();
      return successResponse(res, { document: doc }, 'Versao restaurada');
    } catch (error) {
      console.error('Erro ao restaurar versao:', error);
      return errorResponse(res, 'Erro interno do servidor', 500);
    }
  },
);

module.exports = router;
