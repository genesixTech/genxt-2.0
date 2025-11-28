const express = require('express');
const { User, UserProfile, Settings, Project } = require('../models');
const { 
  authenticateToken, 
  checkOwnership,
  requireCompleteProfile 
} = require('../middleware/auth');
const { 
  validateUpdateProfile,
  validateDetailedProfile,
  validateUserId,
  validatePagination,
  validateSearch,
  validateAvatar
} = require('../utils/validators');
const { 
  handleValidationErrors, 
  successResponse, 
  errorResponse,
  formatProperName,
  paginate,
  formatPaginatedResponse
} = require('../utils/helpers');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/users/:id - Obter dados de um usuário específico
router.get('/:id', validateUserId, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });

    if (!user) {
      return errorResponse(res, 'Usuário não encontrado', 404);
    }

    // Remover dados sensíveis se não for o próprio usuário
    const isOwnProfile = req.userId && req.userId === user.id;
    
    if (!isOwnProfile) {
      // Retornar apenas dados públicos
      const publicData = {
        id: user.id,
        nome: user.nome,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        profile: user.profile ? {
          area_atuacao: user.profile.area_atuacao,
          bio: user.profile.bio,
          linkedin_url: user.profile.linkedin_url,
          github_url: user.profile.github_url,
          website_url: user.profile.website_url,
        } : null,
      };

      return successResponse(res, { user: publicData }, 'Dados públicos do usuário obtidos com sucesso');
    }

    successResponse(res, { user }, 'Dados do usuário obtidos com sucesso');

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// PUT /api/users/:id - Atualizar dados básicos do usuário
router.put('/:id', 
  authenticateToken,
  validateUserId,
  validateUpdateProfile,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email } = req.body;

      // Verificar se é o próprio usuário
      if (req.userId !== id) {
        return errorResponse(res, 'Você só pode atualizar seu próprio perfil', 403);
      }

      const user = await User.findByPk(id);
      if (!user) {
        return errorResponse(res, 'Usuário não encontrado', 404);
      }

      // Verificar se email já está em uso por outro usuário
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ 
          where: { 
            email: email.toLowerCase(),
            id: { [Op.ne]: id }
          }
        });
        
        if (existingUser) {
          return errorResponse(res, 'Este email já está em uso por outro usuário', 409);
        }
      }

      // Atualizar dados
      const updateData = {};
      if (nome) updateData.nome = formatProperName(nome);
      if (email) updateData.email = email.toLowerCase();

      await user.update(updateData);

      // Buscar usuário atualizado
      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      successResponse(res, { user: updatedUser }, '✨ Perfil atualizado com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// PUT /api/users/:id/profile - Atualizar perfil detalhado
router.put('/:id/profile',
  authenticateToken,
  validateUserId,
  validateDetailedProfile,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se é o próprio usuário
      if (req.userId !== id) {
        return errorResponse(res, 'Você só pode atualizar seu próprio perfil', 403);
      }

      const user = await User.findByPk(id, {
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      if (!user) {
        return errorResponse(res, 'Usuário não encontrado', 404);
      }

      // Atualizar perfil
      const profileData = {
        area_atuacao: req.body.area_atuacao,
        tamanho_empresa: req.body.tamanho_empresa,
        nivel_conhecimento: req.body.nivel_conhecimento,
        objetivo_principal: req.body.objetivo_principal,
        whatsapp: req.body.whatsapp,
        origem_conhecimento: req.body.origem_conhecimento,
        bio: req.body.bio,
        linkedin_url: req.body.linkedin_url,
        github_url: req.body.github_url,
        website_url: req.body.website_url,
      };

      // Remover campos undefined
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) {
          delete profileData[key];
        }
      });

      if (user.profile) {
        await user.profile.update(profileData);
      } else {
        await UserProfile.create({
          user_id: id,
          ...profileData,
        });
      }

      // Buscar usuário atualizado
      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      const isComplete = updatedUser.profile?.perfil_completo;
      const message = isComplete 
        ? '🎉 Perfil completo atualizado! Agora você pode aproveitar todas as funcionalidades.'
        : '✨ Perfil atualizado com sucesso!';

      successResponse(res, { user: updatedUser }, message);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// PUT /api/users/:id/avatar - Atualizar avatar
router.put('/:id/avatar',
  authenticateToken,
  validateUserId,
  validateAvatar,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { avatar_url } = req.body;

      // Verificar se é o próprio usuário
      if (req.userId !== id) {
        return errorResponse(res, 'Você só pode atualizar seu próprio avatar', 403);
      }

      const user = await User.findByPk(id);
      if (!user) {
        return errorResponse(res, 'Usuário não encontrado', 404);
      }

      await user.update({ avatar_url });

      successResponse(res, { avatar_url }, '📸 Avatar atualizado com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// DELETE /api/users/:id - Excluir conta do usuário
router.delete('/:id', 
  authenticateToken,
  validateUserId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se é o próprio usuário
      if (req.userId !== id) {
        return errorResponse(res, 'Você só pode excluir sua própria conta', 403);
      }

      const user = await User.findByPk(id);
      if (!user) {
        return errorResponse(res, 'Usuário não encontrado', 404);
      }

      // Soft delete - apenas desativar a conta
      await user.update({ ativo: false });

      // Em uma implementação completa, você poderia:
      // 1. Anonimizar dados pessoais
      // 2. Transferir projetos para outros usuários
      // 3. Enviar email de confirmação
      // 4. Implementar período de carência para reativação

      successResponse(res, null, '😢 Conta desativada com sucesso. Sentiremos sua falta!');

    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/users/:id/projects - Listar projetos do usuário
router.get('/:id/projects',
  validateUserId,
  validatePagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const { limit: limitNum, offset } = paginate(page, limit);

      // Verificar se usuário existe
      const user = await User.findByPk(id);
      if (!user) {
        return errorResponse(res, 'Usuário não encontrado', 404);
      }

      // Verificar se é o próprio usuário ou se os projetos são públicos
      const isOwnProfile = req.userId && req.userId === id;
      const whereClause = { user_id: id };
      
      if (!isOwnProfile) {
        whereClause.publico = true;
      }

      const { count, rows: projects } = await Project.findAndCountAll({
        where: whereClause,
        limit: limitNum,
        offset,
        order: [['created_at', 'DESC']],
      });

      const paginatedResponse = formatPaginatedResponse(projects, page, limit, count);

      successResponse(res, paginatedResponse, 'Projetos obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao buscar projetos do usuário:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/users/search - Buscar usuários
router.get('/search',
  validateSearch,
  validatePagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { q, page = 1, limit = 10, sort = 'created_at', order = 'desc' } = req.query;
      const { limit: limitNum, offset } = paginate(page, limit);

      let whereClause = { ativo: true };

      if (q) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { nome: { [Op.iLike]: `%${q}%` } },
            { email: { [Op.iLike]: `%${q}%` } },
          ],
        };
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: UserProfile,
            as: 'profile',
            attributes: ['area_atuacao', 'bio'],
          },
        ],
        attributes: ['id', 'nome', 'avatar_url', 'created_at'], // Apenas dados públicos
        limit: limitNum,
        offset,
        order: [[sort, order.toUpperCase()]],
      });

      const paginatedResponse = formatPaginatedResponse(users, page, limit, count);

      successResponse(res, paginatedResponse, 'Busca realizada com sucesso');

    } catch (error) {
      console.error('Erro na busca de usuários:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

// GET /api/users/:id/stats - Estatísticas do usuário
router.get('/:id/stats',
  validateUserId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se usuário existe
      const user = await User.findByPk(id);
      if (!user) {
        return errorResponse(res, 'Usuário não encontrado', 404);
      }

      // Verificar se é o próprio usuário
      const isOwnProfile = req.userId && req.userId === id;
      
      if (!isOwnProfile) {
        return errorResponse(res, 'Você só pode ver suas próprias estatísticas', 403);
      }

      // Buscar estatísticas
      const totalProjetos = await Project.count({ where: { user_id: id } });
      const projetosAtivos = await Project.count({ 
        where: { user_id: id, status: 'em_andamento' } 
      });
      const projetosConcluidos = await Project.count({ 
        where: { user_id: id, status: 'concluido' } 
      });

      const stats = {
        total_projetos: totalProjetos,
        projetos_ativos: projetosAtivos,
        projetos_concluidos: projetosConcluidos,
        taxa_conclusao: totalProjetos > 0 ? Math.round((projetosConcluidos / totalProjetos) * 100) : 0,
        membro_desde: user.created_at,
        ultimo_acesso: user.ultimo_login,
      };

      successResponse(res, { stats }, 'Estatísticas obtidas com sucesso');

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      errorResponse(res, 'Erro interno do servidor', 500);
    }
  }
);

module.exports = router;
