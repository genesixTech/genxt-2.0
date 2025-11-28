const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectStep = sequelize.define('ProjectStep', {
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
  step_key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
  },
  progresso: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  conteudo: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  ultima_atualizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'project_steps',
  indexes: [
    { fields: ['project_id'] },
    { fields: ['step_key'] },
  ],
});

module.exports = ProjectStep;
