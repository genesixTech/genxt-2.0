const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  tema: {
    type: DataTypes.ENUM('claro', 'escuro', 'auto'),
    defaultValue: 'claro',
  },
  idioma: {
    type: DataTypes.ENUM('pt-BR', 'en-US', 'es-ES'),
    defaultValue: 'pt-BR',
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'America/Sao_Paulo',
  },
  formato_data: {
    type: DataTypes.ENUM('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'),
    defaultValue: 'DD/MM/YYYY',
  },
  formato_hora: {
    type: DataTypes.ENUM('12h', '24h'),
    defaultValue: '24h',
  },
  notificacoes: {
    type: DataTypes.JSONB,
    defaultValue: {
      email: {
        novos_comentarios: true,
        convites_colaboracao: true,
        atualizacoes_projeto: true,
        lembretes_prazo: true,
        newsletter: false,
        promocoes: false,
      },
      push: {
        novos_comentarios: true,
        convites_colaboracao: true,
        atualizacoes_projeto: false,
        lembretes_prazo: true,
      },
      in_app: {
        novos_comentarios: true,
        convites_colaboracao: true,
        atualizacoes_projeto: true,
        lembretes_prazo: true,
        dicas_ia: true,
      },
    },
  },
  privacidade: {
    type: DataTypes.JSONB,
    defaultValue: {
      perfil_publico: false,
      mostrar_projetos_publicos: false,
      permitir_indexacao: false,
      compartilhar_analytics: false,
    },
  },
  preferencias_ia: {
    type: DataTypes.JSONB,
    defaultValue: {
      nivel_detalhamento: 'medio', // basico, medio, detalhado
      tom_comunicacao: 'profissional', // casual, profissional, tecnico
      frequencia_sugestoes: 'normal', // baixa, normal, alta
      auto_gerar_documentos: false,
      salvar_historico_prompts: true,
    },
  },
  integracao: {
    type: DataTypes.JSONB,
    defaultValue: {
      google_drive: {
        ativo: false,
        pasta_sincronizacao: null,
        auto_backup: false,
      },
      slack: {
        ativo: false,
        webhook_url: null,
        canal_notificacoes: null,
      },
      trello: {
        ativo: false,
        board_id: null,
        auto_criar_cards: false,
      },
    },
  },
  dashboard: {
    type: DataTypes.JSONB,
    defaultValue: {
      widgets_visiveis: [
        'projetos_recentes',
        'progresso_geral',
        'tarefas_pendentes',
        'colaboradores_ativos',
      ],
      layout: 'grid', // grid, lista
      densidade: 'normal', // compacta, normal, espaçosa
    },
  },
  backup: {
    type: DataTypes.JSONB,
    defaultValue: {
      auto_backup: true,
      frequencia: 'semanal', // diario, semanal, mensal
      incluir_anexos: true,
      formato_exportacao: 'json', // json, pdf, markdown
    },
  },
}, {
  tableName: 'settings',
  indexes: [
    {
      unique: true,
      fields: ['user_id'],
    },
  ],
});

// Métodos de instância
Settings.prototype.atualizarNotificacao = function(tipo, categoria, valor) {
  if (!this.notificacoes[tipo]) {
    this.notificacoes[tipo] = {};
  }
  this.notificacoes[tipo][categoria] = valor;
  this.changed('notificacoes', true);
  return this.save();
};

Settings.prototype.atualizarPrivacidade = function(configuracao, valor) {
  this.privacidade[configuracao] = valor;
  this.changed('privacidade', true);
  return this.save();
};

Settings.prototype.atualizarPreferenciasIA = function(configuracao, valor) {
  this.preferencias_ia[configuracao] = valor;
  this.changed('preferencias_ia', true);
  return this.save();
};

Settings.prototype.ativarIntegracao = function(servico, configuracoes) {
  this.integracao[servico] = {
    ...this.integracao[servico],
    ativo: true,
    ...configuracoes,
  };
  this.changed('integracao', true);
  return this.save();
};

Settings.prototype.desativarIntegracao = function(servico) {
  this.integracao[servico].ativo = false;
  this.changed('integracao', true);
  return this.save();
};

Settings.prototype.atualizarDashboard = function(configuracoes) {
  this.dashboard = {
    ...this.dashboard,
    ...configuracoes,
  };
  this.changed('dashboard', true);
  return this.save();
};

module.exports = Settings;
