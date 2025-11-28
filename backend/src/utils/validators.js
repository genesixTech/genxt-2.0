const { body, param, query } = require('express-validator');

// Validadores para registro de usuÃ¡rio
const validateRegister = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[\p{L}\s]+$/u)
    .withMessage('Nome deve conter apenas letras e espaços'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Email deve ter um formato vÃ¡lido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email muito longo'),

  body('senha')
    .isLength({ min: 8, max: 128 })
    .withMessage('Senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos: 1 letra minÃºscula, 1 maiÃºscula e 1 nÃºmero'),

  body('confirmar_senha')
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error('ConfirmaÃ§Ã£o de senha nÃ£o confere');
      }
      return true;
    }),
];

// Validadores para login
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email deve ter um formato vÃ¡lido')
    .normalizeEmail(),

  body('senha')
    .notEmpty()
    .withMessage('Senha Ã© obrigatÃ³ria'),
];

// Validadores para atualizaÃ§Ã£o de perfil bÃ¡sico
const validateUpdateProfile = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[\p{L}\s]+$/u)
    .withMessage('Nome deve conter apenas letras e espaços'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email deve ter um formato vÃ¡lido')
    .normalizeEmail(),
];

// Validadores para perfil detalhado
const validateDetailedProfile = [
  body('area_atuacao')
    .optional()
    .isIn([
      'tecnologia', 'marketing', 'vendas', 'produto', 'design',
      'financeiro', 'recursos_humanos', 'operacoes', 'consultoria',
      'educacao', 'saude', 'outros'
    ])
    .withMessage('Ãrea de atuaÃ§Ã£o invÃ¡lida'),

  body('tamanho_empresa')
    .optional()
    .isIn([
      'freelancer', 'startup_1_10', 'pequena_11_50', 'media_51_200',
      'grande_201_1000', 'corporacao_1000_plus'
    ])
    .withMessage('Tamanho da empresa invÃ¡lido'),

  body('nivel_conhecimento')
    .optional()
    .isIn(['iniciante', 'intermediario', 'avancado', 'especialista'])
    .withMessage('NÃ­vel de conhecimento invÃ¡lido'),

  body('objetivo_principal')
    .optional()
    .isIn([
      'criar_primeiro_produto', 'melhorar_produto_existente', 'validar_ideia',
      'estruturar_processo', 'capacitar_equipe', 'consultoria_clientes', 'outros'
    ])
    .withMessage('Objetivo principal invÃ¡lido'),

  body('whatsapp')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('WhatsApp deve ter um formato vÃ¡lido'),

  body('origem_conhecimento')
    .optional()
    .isIn([
      'google', 'linkedin', 'instagram', 'youtube', 'indicacao',
      'evento', 'blog', 'podcast', 'outros'
    ])
    .withMessage('Origem de conhecimento invÃ¡lida'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio deve ter no mÃ¡ximo 500 caracteres'),

  body('linkedin_url')
    .optional()
    .isURL()
    .withMessage('URL do LinkedIn invÃ¡lida'),

  body('github_url')
    .optional()
    .isURL()
    .withMessage('URL do GitHub invÃ¡lida'),

  body('website_url')
    .optional()
    .isURL()
    .withMessage('URL do website invÃ¡lida'),
];

// Validadores para mudanÃ§a de senha
const validateChangePassword = [
  body('senha_atual')
    .notEmpty()
    .withMessage('Senha atual Ã© obrigatÃ³ria'),

  body('nova_senha')
    .isLength({ min: 8, max: 128 })
    .withMessage('Nova senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter pelo menos: 1 letra minÃºscula, 1 maiÃºscula e 1 nÃºmero'),

  body('confirmar_nova_senha')
    .custom((value, { req }) => {
      if (value !== req.body.nova_senha) {
        throw new Error('ConfirmaÃ§Ã£o da nova senha nÃ£o confere');
      }
      return true;
    }),
];

// Validadores para reset de senha
const validateResetPassword = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email deve ter um formato vÃ¡lido')
    .normalizeEmail(),
];

const validateConfirmResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Token Ã© obrigatÃ³rio')
    .isLength({ min: 32, max: 128 })
    .withMessage('Token invÃ¡lido'),

  body('nova_senha')
    .isLength({ min: 8, max: 128 })
    .withMessage('Nova senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter pelo menos: 1 letra minÃºscula, 1 maiÃºscula e 1 nÃºmero'),

  body('confirmar_nova_senha')
    .custom((value, { req }) => {
      if (value !== req.body.nova_senha) {
        throw new Error('ConfirmaÃ§Ã£o da nova senha nÃ£o confere');
      }
      return true;
    }),
];

// Validadores para parÃ¢metros de URL
const validateUserId = [
  param('id')
    .isUUID()
    .withMessage('ID do usuÃ¡rio deve ser um UUID vÃ¡lido'),
];

// Validadores para paginaÃ§Ã£o
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('PÃ¡gina deve ser um nÃºmero inteiro maior que 0'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um nÃºmero entre 1 e 100'),
];

// Validadores para busca
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),

  query('sort')
    .optional()
    .isIn(['created_at', 'updated_at', 'nome', 'email'])
    .withMessage('Campo de ordenaÃ§Ã£o invÃ¡lido'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordem deve ser "asc" ou "desc"'),
];

// Validadores para upload de avatar
const validateAvatar = [
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('URL do avatar invÃ¡lida'),
];

// Validador customizado para verificar se email jÃ¡ existe
const checkEmailExists = async (email, { req }) => {
  const { User } = require('../models');
  
  const existingUser = await User.findOne({ 
    where: { email },
    paranoid: false // Incluir usuÃ¡rios soft-deleted
  });
  
  // Se estÃ¡ atualizando o prÃ³prio email, permitir
  if (existingUser && req.user && existingUser.id === req.user.id) {
    return true;
  }
  
  if (existingUser) {
    throw new Error('Este email jÃ¡ estÃ¡ em uso');
  }
  
  return true;
};

// Validador para verificar se usuÃ¡rio existe
const checkUserExists = async (userId) => {
  const { User } = require('../models');
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('UsuÃ¡rio nÃ£o encontrado');
  }
  
  return true;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateDetailedProfile,
  validateChangePassword,
  validateResetPassword,
  validateConfirmResetPassword,
  validateUserId,
  validatePagination,
  validateSearch,
  validateAvatar,
  checkEmailExists,
  checkUserExists,
};




