const express = require('express');
const { Settings, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { 
  handleValidationErrors, 
  successResponse, 
  errorResponse
} = require('../utils/helpers');

const router = express.Router();

// Validadores para configurações
const validateSettings = [
  body('tema')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Tema deve ser light, dark ou auto'),
  
  body('idioma')
    .optional()
    .isIn(['pt-BR', 'en-US', 'es-ES'])
    .withMessage('Idioma inválido'),
  
  body('timezone')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Timezone inválido'),
  
  body('notificacoes_email')
    .optional()
    .isBoolean()
    .withMessage('Notificações por email deve ser true ou false'),
  
  body('notificacoes_push')
    .optional()
    .isBoolean()
    .withMessage('Notificações push deve ser true ou false'),
  
  body('notificacoes_colaboracao')
    .optional()
    .isBoolean()
    .withMessage('Notificações de colaboração deve ser true ou false'),
  
  body('notificacoes_marketing')
    .optional()
    .isBoolean()
    .withMessage('Notificações de marketing deve ser true ou false'),
  
  body('auto_save')
    .optional()
    .isBoolean()
    .withMessage('Auto save deve ser true ou false'),
  
  body('auto_save_interval')
    .optional()
    .isInt({ min: 30, max: 600 })
    .withMessage('Intervalo de auto save deve ser entre 30 e 600 segundos'),
  
  body('layout_sidebar')
    .optional()
    .isIn(['collapsed', 'expanded', 'auto'])
    .withMessage('Layout da sidebar inválido'),
  
  body('densidade_interface')
    .optional()
    .isIn(['compact', 'comfortable', 'spacious'])
    .withMessage('Densidade da interface inválida'),
  
  body('mostrar_dicas')
    .optional()
    .isBoolean()
    .withMessage('Mostrar dicas deve ser true ou false'),
  
  body('analytics_usage')
    .optional()
    .isBoolean()
    .withMessage('Analytics de uso deve ser true ou false'),
  
  body('configuracoes_personalizadas')
    .optional()
    .isObject()
    .withMessage('Configurações personalizadas devem ser um objeto'),
];

// GET /api/settings - Obter configurações do usuário
router.get('/',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.userId;

      let settings = await Settings.findOne({
        where: { user_id: userId }
      });

      // Se não existir configurações, criar com valores padrão
      if (!settings) {
        settings = await Settings.create({
          user_id: userId
        });
      }

      successResponse(res, { settings }, 'Configurações obtidas com sucesso');

    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// PUT /api/settings - Atualizar configurações do usuário
router.put('/',
  authenticateToken,
  validateSettings,
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.userId;
      const updateData = req.body;

      // Buscar ou criar configurações
      let settings = await Settings.findOne({
        where: { user_id: userId }
      });

      if (!settings) {
        settings = await Settings.create({
          user_id: userId,
          ...updateData
        });
      } else {
        await settings.update(updateData);
      }

      // Buscar configurações atualizadas
      const updatedSettings = await Settings.findOne({
        where: { user_id: userId }
      });

      successResponse(res, { settings: updatedSettings }, '⚙️ Configurações atualizadas com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// PATCH /api/settings/:key - Atualizar configuração específica
router.patch('/:key',
  authenticateToken,
  param('key').isIn([
    'tema', 'idioma', 'timezone', 'notificacoes_email', 'notificacoes_push',
    'notificacoes_colaboracao', 'notificacoes_marketing', 'auto_save',
    'auto_save_interval', 'layout_sidebar', 'densidade_interface',
    'mostrar_dicas', 'analytics_usage'
  ]).withMessage('Chave de configuração inválida'),
  body('value').exists().withMessage('Valor é obrigatório'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.userId;
      const { key } = req.params;
      const { value } = req.body;

      // Validações específicas por tipo de configuração
      const validations = {
        tema: (val) => ['light', 'dark', 'auto'].includes(val),
        idioma: (val) => ['pt-BR', 'en-US', 'es-ES'].includes(val),
        timezone: (val) => typeof val === 'string' && val.length > 0,
        notificacoes_email: (val) => typeof val === 'boolean',
        notificacoes_push: (val) => typeof val === 'boolean',
        notificacoes_colaboracao: (val) => typeof val === 'boolean',
        notificacoes_marketing: (val) => typeof val === 'boolean',
        auto_save: (val) => typeof val === 'boolean',
        auto_save_interval: (val) => Number.isInteger(val) && val >= 30 && val <= 600,
        layout_sidebar: (val) => ['collapsed', 'expanded', 'auto'].includes(val),
        densidade_interface: (val) => ['compact', 'comfortable', 'spacious'].includes(val),
        mostrar_dicas: (val) => typeof val === 'boolean',
        analytics_usage: (val) => typeof val === 'boolean',
      };

      if (!validations[key](value)) {
        return errorResponse(res, `Valor inválido para a configuração "${key}"`, 400);
      }

      // Buscar ou criar configurações
      let settings = await Settings.findOne({
        where: { user_id: userId }
      });

      if (!settings) {
        settings = await Settings.create({
          user_id: userId,
          [key]: value
        });
      } else {
        await settings.update({ [key]: value });
      }

      successResponse(res, { 
        [key]: value 
      }, `⚙️ Configuração "${key}" atualizada com sucesso!`);

    } catch (error) {
      console.error('Erro ao atualizar configuração específica:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// POST /api/settings/reset - Resetar configurações para padrão
router.post('/reset',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.userId;

      // Buscar configurações existentes
      let settings = await Settings.findOne({
        where: { user_id: userId }
      });

      if (!settings) {
        // Criar com valores padrão
        settings = await Settings.create({
          user_id: userId
        });
      } else {
        // Resetar para valores padrão
        await settings.update({
          tema: 'light',
          idioma: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notificacoes_email: true,
          notificacoes_push: true,
          notificacoes_colaboracao: true,
          notificacoes_marketing: false,
          auto_save: true,
          auto_save_interval: 60,
          layout_sidebar: 'expanded',
          densidade_interface: 'comfortable',
          mostrar_dicas: true,
          analytics_usage: true,
          configuracoes_personalizadas: {}
        });
      }

      successResponse(res, { settings }, '🔄 Configurações resetadas para os valores padrão!');

    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/settings/defaults - Obter configurações padrão
router.get('/defaults',
  async (req, res) => {
    try {
      const defaultSettings = {
        tema: 'light',
        idioma: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notificacoes_email: true,
        notificacoes_push: true,
        notificacoes_colaboracao: true,
        notificacoes_marketing: false,
        auto_save: true,
        auto_save_interval: 60,
        layout_sidebar: 'expanded',
        densidade_interface: 'comfortable',
        mostrar_dicas: true,
        analytics_usage: true,
        configuracoes_personalizadas: {}
      };

      successResponse(res, { defaults: defaultSettings }, 'Configurações padrão obtidas com sucesso');

    } catch (error) {
      console.error('Erro ao buscar configurações padrão:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

module.exports = router;
