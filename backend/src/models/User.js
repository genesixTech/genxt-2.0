const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha_hash: {
    type: DataTypes.STRING,
    allowNull: true, // Pode ser null para usuários OAuth
  },
  provider: {
    type: DataTypes.ENUM('local', 'google', 'github', 'linkedin'),
    defaultValue: 'local',
  },
  provider_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
    {
      fields: ['provider', 'provider_id'],
    },
  ],
});

// Hooks para hash da senha
User.beforeCreate(async (user) => {
  if (user.senha_hash) {
    const salt = await bcrypt.genSalt(12);
    user.senha_hash = await bcrypt.hash(user.senha_hash, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('senha_hash') && user.senha_hash) {
    const salt = await bcrypt.genSalt(12);
    user.senha_hash = await bcrypt.hash(user.senha_hash, salt);
  }
});

// Métodos de instância
User.prototype.verificarSenha = async function(senha) {
  if (!this.senha_hash) return false;
  return await bcrypt.compare(senha, this.senha_hash);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.senha_hash;
  return values;
};

module.exports = User;
