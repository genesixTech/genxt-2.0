const { validationResult } = require('express-validator');
const crypto = require('crypto');

// FunÃ§Ã£o para tratar erros de validaÃ§Ã£o
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    console.warn('Validation errors:', formattedErrors);

    return res.status(400).json({
      error: 'Dados invÃ¡lidos',
      message: 'ðŸš€ Quase lÃ¡! SÃ³ falta corrigir alguns campos para continuar a jornada de criaÃ§Ã£o.',
      details: formattedErrors,
    });
  }
  
  next();
};

// FunÃ§Ã£o para gerar resposta de sucesso padronizada
const successResponse = (res, data, message = 'OperaÃ§Ã£o realizada com sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// FunÃ§Ã£o para gerar resposta de erro padronizada
const errorResponse = (res, message, statusCode = 400, details = null) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

// FunÃ§Ã£o para gerar token aleatÃ³rio
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// FunÃ§Ã£o para validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// FunÃ§Ã£o para validar forÃ§a da senha
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Senha deve ter pelo menos ${minLength} caracteres`);
  }

  if (!hasUpperCase) {
    errors.push('Senha deve conter pelo menos uma letra maiÃºscula');
  }

  if (!hasLowerCase) {
    errors.push('Senha deve conter pelo menos uma letra minÃºscula');
  }

  if (!hasNumbers) {
    errors.push('Senha deve conter pelo menos um nÃºmero');
  }

  if (!hasSpecialChar) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  };
};

// FunÃ§Ã£o para calcular forÃ§a da senha (0-100)
const calculatePasswordStrength = (password) => {
  let score = 0;

  // Comprimento
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Complexidade
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  // Variedade
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 10;

  return Math.min(score, 100);
};

// FunÃ§Ã£o para sanitizar dados de entrada
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres HTML bÃ¡sicos
    .substring(0, 1000); // Limita tamanho
};

// FunÃ§Ã£o para formatar nome prÃ³prio
const formatProperName = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// FunÃ§Ã£o para gerar slug a partir de texto
const generateSlug = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substitui espaÃ§os por hÃ­fens
    .replace(/^-+|-+$/g, ''); // Remove hÃ­fens do inÃ­cio e fim
};

// FunÃ§Ã£o para paginar resultados
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

// FunÃ§Ã£o para formatar resposta paginada
const formatPaginatedResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total_items: total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  };
};

// FunÃ§Ã£o para delay (Ãºtil para rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// FunÃ§Ã£o para mascarar dados sensÃ­veis em logs
const maskSensitiveData = (data) => {
  const sensitiveFields = ['password', 'senha', 'token', 'secret', 'key'];
  const masked = { ...data };
  
  Object.keys(masked).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***masked***';
    }
  });
  
  return masked;
};

// FunÃ§Ã£o para validar CPF (brasileiro)
const isValidCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') return false;
  
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  return remainder === parseInt(cpf.charAt(10));
};

// FunÃ§Ã£o para formatar telefone brasileiro
const formatPhoneBR = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

// FunÃ§Ã£o para gerar cores aleatÃ³rias para projetos
const generateProjectColor = () => {
  const colors = [
    '#1d5cfb', '#807ffb', '#5b54fb', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0891b2'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = {
  handleValidationErrors,
  successResponse,
  errorResponse,
  generateRandomToken,
  isValidEmail,
  validatePasswordStrength,
  calculatePasswordStrength,
  sanitizeInput,
  formatProperName,
  generateSlug,
  paginate,
  formatPaginatedResponse,
  delay,
  maskSensitiveData,
  isValidCPF,
  formatPhoneBR,
  generateProjectColor,
};




