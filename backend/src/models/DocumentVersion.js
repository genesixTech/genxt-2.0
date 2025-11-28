const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DocumentVersion = sequelize.define('DocumentVersion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  version: {
    type: DataTypes.INTEGER,
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
  criado_por: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'document_versions',
  indexes: [
    { fields: ['document_id'] },
    { fields: ['version'] },
  ],
});

module.exports = DocumentVersion;
