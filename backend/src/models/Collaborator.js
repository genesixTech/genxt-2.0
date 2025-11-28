const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Collaborator = sequelize.define('Collaborator', {
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: true, // Pode ser null se o usuário ainda não se cadastrou
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM(
      'owner',
      'admin',
      'editor',
      'viewer',
      'comentarista'
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pendente',
      'ativo',
      'inativo',
      'removido'
    ),
    defaultValue: 'pendente',
  },
  convite_token: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  convite_expira_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  data_convite: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  data_aceite: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  convidado_por: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  permissoes: {
    type: DataTypes.JSONB,
    defaultValue: {
      pode_editar_documentos: false,
      pode_criar_documentos: false,
      pode_excluir_documentos: false,
      pode_convidar_colaboradores: false,
      pode_gerenciar_projeto: false,
      pode_ver_analytics: false,
    },
  },
  ultimo_acesso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notificacoes_ativas: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'collaborators',
  indexes: [
    {
      fields: ['project_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['email'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['convite_token'],
    },
    {
      unique: true,
      fields: ['project_id', 'email'],
    },
  ],
});

// Hooks
Collaborator.beforeCreate(async (collaborator) => {
  // Definir permissões baseadas no role
  const permissoesPorRole = {
    owner: {
      pode_editar_documentos: true,
      pode_criar_documentos: true,
      pode_excluir_documentos: true,
      pode_convidar_colaboradores: true,
      pode_gerenciar_projeto: true,
      pode_ver_analytics: true,
    },
    admin: {
      pode_editar_documentos: true,
      pode_criar_documentos: true,
      pode_excluir_documentos: true,
      pode_convidar_colaboradores: true,
      pode_gerenciar_projeto: false,
      pode_ver_analytics: true,
    },
    editor: {
      pode_editar_documentos: true,
      pode_criar_documentos: true,
      pode_excluir_documentos: false,
      pode_convidar_colaboradores: false,
      pode_gerenciar_projeto: false,
      pode_ver_analytics: false,
    },
    viewer: {
      pode_editar_documentos: false,
      pode_criar_documentos: false,
      pode_excluir_documentos: false,
      pode_convidar_colaboradores: false,
      pode_gerenciar_projeto: false,
      pode_ver_analytics: false,
    },
    comentarista: {
      pode_editar_documentos: false,
      pode_criar_documentos: false,
      pode_excluir_documentos: false,
      pode_convidar_colaboradores: false,
      pode_gerenciar_projeto: false,
      pode_ver_analytics: false,
    },
  };
  
  collaborator.permissoes = {
    ...collaborator.permissoes,
    ...permissoesPorRole[collaborator.role],
  };
  
  // Gerar token de convite se necessário
  if (collaborator.status === 'pendente' && !collaborator.convite_token) {
    collaborator.convite_token = require('crypto').randomBytes(32).toString('hex');
    collaborator.convite_expira_em = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
  }
});

// Métodos de instância
Collaborator.prototype.aceitar = function(userId) {
  this.status = 'ativo';
  this.user_id = userId;
  this.data_aceite = new Date();
  this.convite_token = null;
  this.convite_expira_em = null;
  return this.save();
};

Collaborator.prototype.reenviarConvite = function() {
  this.convite_token = require('crypto').randomBytes(32).toString('hex');
  this.convite_expira_em = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  this.data_convite = new Date();
  return this.save();
};

Collaborator.prototype.atualizarPermissoes = function(novasPermissoes) {
  this.permissoes = {
    ...this.permissoes,
    ...novasPermissoes,
  };
  return this.save();
};

Collaborator.prototype.registrarAcesso = function() {
  this.ultimo_acesso = new Date();
  return this.save();
};

module.exports = Collaborator;
