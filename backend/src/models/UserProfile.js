const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
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
  area_atuacao: {
    type: DataTypes.ENUM(
      'tecnologia',
      'marketing',
      'vendas',
      'produto',
      'design',
      'financeiro',
      'recursos_humanos',
      'operacoes',
      'consultoria',
      'educacao',
      'saude',
      'outros'
    ),
    allowNull: true,
  },
  tamanho_empresa: {
    type: DataTypes.ENUM(
      'freelancer',
      'startup_1_10',
      'pequena_11_50',
      'media_51_200',
      'grande_201_1000',
      'corporacao_1000_plus'
    ),
    allowNull: true,
  },
  nivel_conhecimento: {
    type: DataTypes.ENUM(
      'iniciante',
      'intermediario',
      'avancado',
      'especialista'
    ),
    allowNull: true,
  },
  objetivo_principal: {
    type: DataTypes.ENUM(
      'criar_primeiro_produto',
      'melhorar_produto_existente',
      'validar_ideia',
      'estruturar_processo',
      'capacitar_equipe',
      'consultoria_clientes',
      'outros'
    ),
    allowNull: true,
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[\+]?[1-9][\d]{0,15}$/,
    },
  },
  origem_conhecimento: {
    type: DataTypes.ENUM(
      'google',
      'linkedin',
      'instagram',
      'youtube',
      'indicacao',
      'evento',
      'blog',
      'podcast',
      'outros'
    ),
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500],
    },
  },
  linkedin_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  github_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  website_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  perfil_completo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'user_profiles',
  indexes: [
    {
      unique: true,
      fields: ['user_id'],
    },
  ],
});

// Hook para verificar se o perfil está completo
UserProfile.beforeSave(async (profile) => {
  const camposObrigatorios = [
    'area_atuacao',
    'tamanho_empresa',
    'nivel_conhecimento',
    'objetivo_principal',
    'origem_conhecimento'
  ];
  
  const completo = camposObrigatorios.every(campo => profile[campo] !== null);
  profile.perfil_completo = completo;
});

module.exports = UserProfile;
