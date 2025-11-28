const { sequelize } = require('../config/database');

// Importar todos os modelos
const User = require('./User');
const UserProfile = require('./UserProfile');
const Project = require('./Project');
const Document = require('./Document');
const Collaborator = require('./Collaborator');
const Settings = require('./Settings');
const ProjectStep = require('./ProjectStep');
const DocumentVersion = require('./DocumentVersion');

// Definir associações
// User -> UserProfile (1:1)
User.hasOne(UserProfile, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE',
});
UserProfile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User -> Projects (1:N)
User.hasMany(Project, {
  foreignKey: 'user_id',
  as: 'projects',
  onDelete: 'CASCADE',
});
Project.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'owner',
});

// Project -> Documents (1:N)
Project.hasMany(Document, {
  foreignKey: 'project_id',
  as: 'documents',
  onDelete: 'CASCADE',
});
Document.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// Project -> ProjectStep (1:N)
Project.hasMany(ProjectStep, {
  foreignKey: 'project_id',
  as: 'steps',
  onDelete: 'CASCADE',
});
ProjectStep.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// Document -> Versions (1:N)
Document.hasMany(DocumentVersion, {
  foreignKey: 'document_id',
  as: 'versions',
  onDelete: 'CASCADE',
});
DocumentVersion.belongsTo(Document, {
  foreignKey: 'document_id',
  as: 'document',
});

// Project -> Collaborators (1:N)
Project.hasMany(Collaborator, {
  foreignKey: 'project_id',
  as: 'collaborators',
  onDelete: 'CASCADE',
});
Collaborator.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// User -> Collaborators (1:N) - usuário que foi convidado
User.hasMany(Collaborator, {
  foreignKey: 'user_id',
  as: 'collaborations',
  onDelete: 'SET NULL',
});
Collaborator.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User -> Collaborators (1:N) - usuário que fez o convite
User.hasMany(Collaborator, {
  foreignKey: 'convidado_por',
  as: 'convites_enviados',
  onDelete: 'CASCADE',
});
Collaborator.belongsTo(User, {
  foreignKey: 'convidado_por',
  as: 'convidador',
});

// User -> Documents (1:N) - documentos aprovados pelo usuário
User.hasMany(Document, {
  foreignKey: 'aprovado_por',
  as: 'documentos_aprovados',
  onDelete: 'SET NULL',
});
Document.belongsTo(User, {
  foreignKey: 'aprovado_por',
  as: 'aprovador',
});

// User -> Settings (1:1)
User.hasOne(Settings, {
  foreignKey: 'user_id',
  as: 'settings',
  onDelete: 'CASCADE',
});
Settings.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Exportar modelos e sequelize
module.exports = {
  sequelize,
  User,
  UserProfile,
  Project,
  Document,
  Collaborator,
  ProjectStep,
  DocumentVersion,
  Settings,
};

// Função para sincronizar banco de dados
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Banco de dados sincronizado com sucesso.');
    
    if (force) {
      console.log('⚠️  Todas as tabelas foram recriadas (dados perdidos).');
    }
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error.message);
    throw error;
  }
};

module.exports.syncDatabase = syncDatabase;
