const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100],
    },
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      'rascunho',
      'em_andamento',
      'pausado',
      'concluido',
      'arquivado'
    ),
    defaultValue: 'rascunho',
  },
  etapa_atual: {
    type: DataTypes.ENUM(
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
      'lancamento'
    ),
    defaultValue: 'contexto-problema',
  },
  progresso_geral: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  data_inicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  data_conclusao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  prazo_estimado: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cor_tema: {
    type: DataTypes.STRING,
    defaultValue: '#1d5cfb',
    validate: {
      is: /^#[0-9A-F]{6}$/i,
    },
  },
  publico: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  template_usado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metadados: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'projects',
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['etapa_atual'],
    },
    {
      fields: ['data_inicio'],
    },
  ],
});

// Métodos de instância
Project.prototype.avancarEtapa = function() {
  const etapas = [
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
    'lancamento'
  ];
  
  const indiceAtual = etapas.indexOf(this.etapa_atual);
  if (indiceAtual < etapas.length - 1) {
    this.etapa_atual = etapas[indiceAtual + 1];
    this.progresso_geral = Math.round(((indiceAtual + 1) / etapas.length) * 100);
  }
  
  if (this.etapa_atual === 'lancamento' && this.progresso_geral === 100) {
    this.status = 'concluido';
    this.data_conclusao = new Date();
  }
  
  return this.save();
};

Project.prototype.calcularProgresso = function() {
  const etapas = [
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
    'lancamento'
  ];
  
  const indiceAtual = etapas.indexOf(this.etapa_atual);
  this.progresso_geral = Math.round((indiceAtual / etapas.length) * 100);
  return this.save();
};

module.exports = Project;
