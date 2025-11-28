const { User, UserProfile, Project } = require('../models');
const bcrypt = require('bcryptjs');

const seedProd = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@genesix.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      nome: 'Admin',
      email,
      senha_hash: await bcrypt.hash(password, 10),
      ativo: true,
      plano: 'enterprise',
    });
    await UserProfile.create({
      user_id: user.id,
      area_atuacao: 'Produto',
      tamanho_empresa: 'startup',
      nivel_conhecimento: 'avancado',
      objetivo_principal: 'go-live',
      origem_conhecimento: 'prod-seed',
      perfil_completo: true,
    });
    await Project.create({
      user_id: user.id,
      nome: 'Projeto Inicial',
      descricao: 'Projeto criado pelo seed de producao',
      status: 'rascunho',
      etapa_atual: 'contexto-problema',
      progresso_geral: 0,
    });
  }
  return user;
};

module.exports = { seedProd };
