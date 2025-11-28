const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const useSqlite = process.env.DB_DIALECT === 'sqlite' || process.env.USE_SQLITE === '1';

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200],
    },
  },
  etapa: {
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
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  conteudo_estruturado: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  formato: {
    type: DataTypes.ENUM('markdown', 'html', 'json', 'pdf'),
    defaultValue: 'markdown',
  },
  status: {
    type: DataTypes.ENUM('rascunho', 'em_revisao', 'aprovado', 'arquivado'),
    defaultValue: 'rascunho',
  },
  versao: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  gerado_por_ia: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  prompt_ia: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  feedback_usuario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tags: {
    type: useSqlite ? DataTypes.JSON : DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  anexos: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  metadados: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  data_aprovacao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  aprovado_por: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'documents',
  indexes: [
    {
      fields: ['project_id'],
    },
    {
      fields: ['etapa'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['gerado_por_ia'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

// Hooks
Document.beforeUpdate(async (document) => {
  if (document.changed('status') && document.status === 'aprovado') {
    document.data_aprovacao = new Date();
  }
});

// Métodos de instância
Document.prototype.aprovar = function(userId) {
  this.status = 'aprovado';
  this.data_aprovacao = new Date();
  this.aprovado_por = userId;
  return this.save();
};

Document.prototype.criarNovaVersao = function(novoConteudo) {
  this.versao += 1;
  this.conteudo = novoConteudo;
  this.status = 'rascunho';
  this.data_aprovacao = null;
  this.aprovado_por = null;
  return this.save();
};

Document.prototype.adicionarTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return Promise.resolve(this);
};

Document.prototype.removerTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

module.exports = Document;
