const express = require('express');
const { body, param, query } = require('express-validator');
const { Project, ProjectStep, Document } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const {
  handleValidationErrors,
  successResponse,
  errorResponse,
  paginate,
  formatPaginatedResponse,
} = require('../utils/helpers');

const router = express.Router();

const stepKeys = [
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

// Validação de criação de projeto
const validateProjectPayload = [
  body('nome').isLength({ min: 3, max: 100 }),
  body('descricao').optional().isLength({ max: 5000 }),
];

// Create project
router.post(
  '/',
  authenticateToken,
  validateProjectPayload,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { nome, descricao } = req.body;
      const project = await Project.create({
        nome,
        descricao,
        user_id: req.user.id,
      });

      // seed steps
      await ProjectStep.bulkCreate(
        stepKeys.map((key, idx) => ({
          project_id: project.id,
          step_key: key,
          status: idx === 0 ? 'in_progress' : 'pending',
          progresso: idx === 0 ? 10 : 0,
        })),
      );

      successResponse(res, { project }, 'Projeto criado', 201);
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao criar projeto', 500);
    }
  },
);

// List projects
router.get(
  '/',
  authenticateToken,
  [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 })],
  handleValidationErrors,
  async (req, res) => {
    try {
      const pagination = paginate(req.query);
      const { rows, count } = await Project.findAndCountAll({
        where: { user_id: req.user.id },
        include: [{ model: ProjectStep, as: 'steps' }, { model: Document, as: 'documents' }],
        limit: pagination.limit,
        offset: pagination.offset,
        order: [['createdAt', 'DESC']],
      });

      successResponse(res, formatPaginatedResponse(rows, count, pagination));
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao listar projetos', 500);
    }
  },
);

// Get project by id
router.get(
  '/:id',
  authenticateToken,
  [param('id').isUUID()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const project = await Project.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        include: [{ model: ProjectStep, as: 'steps' }, { model: Document, as: 'documents' }],
      });
      if (!project) return errorResponse(res, 'Projeto não encontrado', 404);

      successResponse(res, { project });
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao buscar projeto', 500);
    }
  },
);

// Update project
router.put(
  '/:id',
  authenticateToken,
  [
    param('id').isUUID(),
    body('nome').optional().isLength({ min: 3, max: 100 }),
    body('descricao').optional().isLength({ max: 5000 }),
    body('etapa_atual').optional().isString(),
    body('progresso_geral').optional().isInt({ min: 0, max: 100 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!project) return errorResponse(res, 'Projeto não encontrado', 404);

      await project.update({
        nome: req.body.nome ?? project.nome,
        descricao: req.body.descricao ?? project.descricao,
        etapa_atual: req.body.etapa_atual ?? project.etapa_atual,
        progresso_geral: req.body.progresso_geral ?? project.progresso_geral,
      });

      successResponse(res, { project }, 'Projeto atualizado');
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao atualizar projeto', 500);
    }
  },
);

// Delete project
router.delete(
  '/:id',
  authenticateToken,
  [param('id').isUUID()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!project) return errorResponse(res, 'Projeto não encontrado', 404);
      await project.destroy();
      successResponse(res, null, 'Projeto excluído');
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao excluir projeto', 500);
    }
  },
);

// List steps
router.get(
  '/:id/steps',
  authenticateToken,
  [param('id').isUUID()],
  handleValidationErrors,
  async (req, res) => {
    try {
      const steps = await ProjectStep.findAll({ where: { project_id: req.params.id } });
      successResponse(res, { steps });
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao listar etapas', 500);
    }
  },
);

// Save step
router.put(
  '/:id/steps/:stepId',
  authenticateToken,
  [param('id').isUUID(), param('stepId').isUUID(), body('conteudo').optional(), body('status').optional().isIn(['pending', 'in_progress', 'completed'])],
  handleValidationErrors,
  async (req, res) => {
    try {
      const step = await ProjectStep.findOne({
        where: { id: req.params.stepId, project_id: req.params.id },
      });
      if (!step) return errorResponse(res, 'Etapa não encontrada', 404);

      await step.update({
        conteudo: req.body.conteudo ?? step.conteudo,
        progresso: req.body.progresso ?? step.progresso,
        status: req.body.status ?? step.status,
        ultima_atualizacao: new Date(),
      });

      successResponse(res, { step }, 'Etapa salva');
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Erro ao salvar etapa', 500);
    }
  },
);

module.exports = router;
