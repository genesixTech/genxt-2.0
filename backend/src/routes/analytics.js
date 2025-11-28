const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');
const { User, Project, Document, Collaborator } = require('../models');

const router = express.Router();

router.use(authenticateToken);

// Helper: projetos acessíveis (dono ou colaborador ativo)
const getAccessibleProjectIds = async (userId) => {
  const owned = await Project.findAll({ where: { user_id: userId }, attributes: ['id'], raw: true });
  const collabs = await Collaborator.findAll({
    where: { user_id: userId, status: 'ativo' },
    attributes: ['project_id'],
    raw: true,
  });
  const ids = new Set([...owned.map((p) => p.id), ...collabs.map((c) => c.project_id)]);
  return Array.from(ids);
};

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;
    const periodDays = parseInt(req.query.period || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const projectIds = await getAccessibleProjectIds(userId);
    if (!projectIds.length) {
      return res.json({ success: true, data: { overview: {}, charts: {}, trends: {} } });
    }

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalDocuments,
      approvedDocuments,
      totalCollaborations,
      recentActivity,
      projectsWithProgress,
      documentsByStep,
      dailyActivity,
    ] = await Promise.all([
      Project.count({ where: { id: { [Op.in]: projectIds } } }),
      Project.count({
        where: { id: { [Op.in]: projectIds }, status: { [Op.in]: ['rascunho', 'em_andamento', 'ativo'] } },
      }),
      Project.count({ where: { id: { [Op.in]: projectIds }, status: 'concluido' } }),
      Document.count({ where: { project_id: { [Op.in]: projectIds } } }),
      Document.count({ where: { project_id: { [Op.in]: projectIds }, status: 'aprovado' } }),
      Collaborator.count({ where: { project_id: { [Op.in]: projectIds }, status: 'ativo' } }),
      Document.count({
        where: { project_id: { [Op.in]: projectIds }, created_at: { [Op.gte]: startDate } },
      }),
      Project.findAll({
        where: { id: { [Op.in]: projectIds } },
        attributes: ['progresso_geral'],
        raw: true,
      }),
      Document.findAll({
        where: { project_id: { [Op.in]: projectIds } },
        attributes: ['etapa', [fn('COUNT', col('id')), 'count']],
        group: ['etapa'],
        raw: true,
      }),
      Document.findAll({
        where: { project_id: { [Op.in]: projectIds }, created_at: { [Op.gte]: startDate } },
        attributes: [
          [fn('DATE', col('created_at')), 'date'],
          [fn('COUNT', col('id')), 'count'],
        ],
        group: [literal('DATE(created_at)')],
        order: [[literal('DATE(created_at)'), 'ASC']],
        raw: true,
      }),
    ]);

    const averageProgress =
      projectsWithProgress.length > 0
        ? Math.round(
            projectsWithProgress.reduce((sum, p) => sum + (p.progresso_geral || 0), 0) / projectsWithProgress.length,
          )
        : 0;

    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    const approvalRate = totalDocuments > 0 ? Math.round((approvedDocuments / totalDocuments) * 100) : 0;

    res.json({
      success: true,
      data: {
        period: periodDays,
        overview: {
          total_projects: totalProjects,
          active_projects: activeProjects,
          completed_projects: completedProjects,
          total_documents: totalDocuments,
          approved_documents: approvedDocuments,
          total_collaborations: totalCollaborations,
          recent_activity: recentActivity,
          average_progress: averageProgress,
          completion_rate: completionRate,
          approval_rate: approvalRate,
        },
        charts: {
          documents_by_step: documentsByStep,
          daily_activity: dailyActivity,
        },
        trends: {
          new_collaborations: totalCollaborations,
          documents_created: recentActivity,
          projects_completed: completedProjects,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar analytics do dashboard:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar analytics.' });
  }
});

// GET /api/analytics/projects/:id
router.get('/projects/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const project = await Project.findOne({
      where: { id: projectId },
      include: [{ model: Collaborator, as: 'collaborators', required: false }],
    });
    if (!project || (project.user_id !== userId && !project.collaborators?.find((c) => c.user_id === userId))) {
      return res.status(404).json({ success: false, message: 'Projeto nao encontrado ou sem acesso.' });
    }

    const [totalDocuments, documentsByStatus, documentsByStep, collaborators, timeline, completionStats] = await Promise.all(
      [
        Document.count({ where: { project_id: projectId } }),
        Document.findAll({
          where: { project_id: projectId },
          attributes: ['status', [fn('COUNT', col('id')), 'count']],
          group: ['status'],
          raw: true,
        }),
        Document.findAll({
          where: { project_id: projectId },
          attributes: ['etapa', [fn('COUNT', col('id')), 'count']],
          group: ['etapa'],
          raw: true,
        }),
        Collaborator.findAll({
          where: { project_id: projectId, status: 'ativo' },
          include: [{ model: User, attributes: ['nome', 'email', 'avatar_url'] }],
        }),
        Document.findAll({
          where: { project_id: projectId },
          attributes: ['titulo', 'etapa', 'status', 'created_at'],
          order: [['created_at', 'DESC']],
          limit: 20,
          raw: true,
        }),
        Document.findAll({
          where: { project_id: projectId },
          attributes: ['etapa', 'status', [fn('COUNT', col('id')), 'count']],
          group: ['etapa', 'status'],
          raw: true,
        }),
      ],
    );

    const stepProgress = {};
    completionStats.forEach((stat) => {
      const step = stat.etapa;
      stepProgress[step] = stepProgress[step] || { total: 0, approved: 0 };
      stepProgress[step].total += parseInt(stat.count, 10);
      if (stat.status === 'aprovado') stepProgress[step].approved += parseInt(stat.count, 10);
    });
    Object.keys(stepProgress).forEach((step) => {
      const d = stepProgress[step];
      d.percentage = d.total > 0 ? Math.round((d.approved / d.total) * 100) : 0;
    });

    res.json({
      success: true,
      data: {
        project: {
          id: project.id,
          nome: project.nome,
          status: project.status,
          progresso: project.progresso_geral,
          etapa_atual: project.etapa_atual,
          created_at: project.created_at,
        },
        metrics: {
          total_documents: totalDocuments,
          total_collaborators: collaborators.length,
          documents_by_status: documentsByStatus,
          documents_by_step: documentsByStep,
          step_progress: stepProgress,
        },
        collaborators: collaborators.map((c) => ({
          id: c.id,
          role: c.role,
          user: c.User,
          joined_at: c.created_at,
        })),
        activity: {
          timeline,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar analytics do projeto:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar analytics do projeto.' });
  }
});

// GET /api/analytics/documents
router.get('/documents', async (req, res) => {
  try {
    const userId = req.user.id;
    const periodDays = parseInt(req.query.period || '30', 10);
    const step = req.query.step;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const projectIds = await getAccessibleProjectIds(userId);
    if (!projectIds.length) {
      return res.json({ success: true, data: {} });
    }

    const whereClause = {
      project_id: { [Op.in]: projectIds },
      created_at: { [Op.gte]: startDate },
    };
    if (step) whereClause.etapa = step;

    const [totalDocuments, documentsByStatus, documentsByStep, documentsByFormat, averageVersions, recentDocuments] =
      await Promise.all([
        Document.count({ where: whereClause }),
        Document.findAll({
          where: whereClause,
          attributes: ['status', [fn('COUNT', col('id')), 'count']],
          group: ['status'],
          raw: true,
        }),
        Document.findAll({
          where: whereClause,
          attributes: ['etapa', [fn('COUNT', col('id')), 'count']],
          group: ['etapa'],
          raw: true,
        }),
        Document.findAll({
          where: whereClause,
          attributes: ['formato', [fn('COUNT', col('id')), 'count']],
          group: ['formato'],
          raw: true,
        }),
        Document.findAll({
          where: { project_id: { [Op.in]: projectIds } },
          attributes: [[fn('AVG', col('versao')), 'avg_version']],
          raw: true,
        }),
        Document.findAll({
          where: whereClause,
          include: [{ model: Project, attributes: ['nome'] }],
          order: [['created_at', 'DESC']],
          limit: 10,
        }),
      ]);

    const dailyProductivity = await Document.findAll({
      where: whereClause,
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [literal('DATE(created_at)')],
      order: [[literal('DATE(created_at)'), 'ASC']],
      raw: true,
    });

    const tagsUsage = await Document.findAll({
      where: { project_id: { [Op.in]: projectIds }, tags: { [Op.not]: null } },
      attributes: ['tags'],
      raw: true,
    });
    const tagCounts = {};
    tagsUsage.forEach((doc) => {
      if (Array.isArray(doc.tags)) {
        doc.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    res.json({
      success: true,
      data: {
        period: periodDays,
        overview: {
          total_documents: totalDocuments,
          average_versions: averageVersions[0]?.avg_version
            ? Math.round(parseFloat(averageVersions[0].avg_version) * 100) / 100
            : 1,
        },
        distribution: {
          by_status: documentsByStatus,
          by_step: documentsByStep,
          by_format: documentsByFormat,
        },
        productivity: {
          daily_activity: dailyProductivity,
          top_tags: topTags,
        },
        recent_documents: recentDocuments.map((doc) => ({
          id: doc.id,
          titulo: doc.titulo,
          etapa: doc.etapa,
          status: doc.status,
          versao: doc.versao,
          project_name: doc.Project?.nome,
          created_at: doc.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar analytics de documentos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar analytics de documentos.' });
  }
});

// GET /api/analytics/collaboration
router.get('/collaboration', async (req, res) => {
  try {
    const userId = req.user.id;
    const periodDays = parseInt(req.query.period || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const projectIds = await getAccessibleProjectIds(userId);

    const [projectsOwned, collaborationsActive, invitesSent, invitesReceived, collaboratorsByRole, recentCollaborations] =
      await Promise.all([
        Project.count({ where: { user_id: userId } }),
        Collaborator.count({ where: { project_id: { [Op.in]: projectIds }, status: 'ativo' } }),
        Collaborator.count({ where: { convidado_por: userId, created_at: { [Op.gte]: startDate } } }),
        Collaborator.count({ where: { user_id: userId, created_at: { [Op.gte]: startDate } } }),
        Collaborator.findAll({
          where: { project_id: { [Op.in]: projectIds }, status: 'ativo' },
          attributes: ['role', [fn('COUNT', col('id')), 'count']],
          group: ['role'],
          raw: true,
        }),
        Collaborator.findAll({
          where: {
            [Op.or]: [{ user_id: userId }, { convidado_por: userId }],
            created_at: { [Op.gte]: startDate },
          },
          include: [
            { model: User, attributes: ['nome', 'email', 'avatar_url'] },
            { model: Project, attributes: ['nome'] },
          ],
          order: [['created_at', 'DESC']],
          limit: 10,
        }),
      ]);

    const totalInvitesSent = await Collaborator.count({ where: { convidado_por: userId } });
    const acceptedInvites = await Collaborator.count({ where: { convidado_por: userId, status: 'ativo' } });
    const acceptanceRate = totalInvitesSent > 0 ? Math.round((acceptedInvites / totalInvitesSent) * 100) : 0;

    res.json({
      success: true,
      data: {
        period: periodDays,
        overview: {
          projects_owned: projectsOwned,
          active_collaborations: collaborationsActive,
          invites_sent: invitesSent,
          invites_received: invitesReceived,
          acceptance_rate: acceptanceRate,
        },
        distribution: { collaborators_by_role: collaboratorsByRole },
        activity: {
          recent_collaborations: recentCollaborations.map((c) => ({
            id: c.id,
            role: c.role,
            status: c.status,
            user: c.User,
            project: c.Project,
            created_at: c.created_at,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar analytics de colaboracao:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar analytics de colaboracao.' });
  }
});

// GET /api/analytics/timeline
router.get('/timeline', async (req, res) => {
  try {
    const userId = req.user.id;
    const periodDays = parseInt(req.query.period || '30', 10);
    const limitNum = parseInt(req.query.limit || '20', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const projectIds = await getAccessibleProjectIds(userId);

    const [documentActivities, projectActivities, collaborationActivities] = await Promise.all([
      Document.findAll({
        where: { project_id: { [Op.in]: projectIds }, created_at: { [Op.gte]: startDate } },
        include: [{ model: Project, attributes: ['nome'] }],
        attributes: ['id', 'titulo', 'etapa', 'status', 'created_at', 'updated_at'],
        order: [['created_at', 'DESC']],
        raw: true,
      }),
      Project.findAll({
        where: { id: { [Op.in]: projectIds }, created_at: { [Op.gte]: startDate } },
        attributes: ['id', 'nome', 'status', 'created_at', 'updated_at'],
        order: [['created_at', 'DESC']],
        raw: true,
      }),
      Collaborator.findAll({
        where: {
          project_id: { [Op.in]: projectIds },
          created_at: { [Op.gte]: startDate },
        },
        include: [
          { model: User, attributes: ['nome', 'email'], required: false },
          { model: Project, attributes: ['nome'], required: false },
        ],
        attributes: ['id', 'role', 'status', 'created_at', 'user_id', 'convidado_por'],
        order: [['created_at', 'DESC']],
        raw: true,
      }),
    ]);

    const timeline = [];

    documentActivities.forEach((doc) => {
      timeline.push({
        id: `doc_${doc.id}`,
        type: 'document',
        action: 'created',
        title: `Documento criado: ${doc.titulo}`,
        description: `Etapa: ${doc.etapa} | Status: ${doc.status}`,
        project_name: doc['Project.nome'],
        timestamp: doc.created_at,
      });
      if (doc.updated_at && doc.updated_at > doc.created_at) {
        timeline.push({
          id: `doc_update_${doc.id}`,
          type: 'document',
          action: 'updated',
          title: `Documento atualizado: ${doc.titulo}`,
          description: `Etapa: ${doc.etapa} | Status: ${doc.status}`,
          project_name: doc['Project.nome'],
          timestamp: doc.updated_at,
        });
      }
    });

    projectActivities.forEach((project) => {
      timeline.push({
        id: `project_${project.id}`,
        type: 'project',
        action: 'created',
        title: `Projeto criado: ${project.nome}`,
        description: `Status: ${project.status}`,
        project_name: project.nome,
        timestamp: project.created_at,
      });
    });

    collaborationActivities.forEach((collab) => {
      timeline.push({
        id: `collab_${collab.id}`,
        type: 'collaboration',
        action: collab.convidado_por === userId ? 'invited' : 'joined',
        title:
          collab.convidado_por === userId
            ? `Colaborador convidado: ${collab['User.nome'] || collab.email || 'Colaborador'}`
            : `Convite/entrada em: ${collab['Project.nome']}`,
        description: `Role: ${collab.role} | Status: ${collab.status}`,
        project_name: collab['Project.nome'],
        timestamp: collab.created_at,
      });
    });

    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limited = timeline.slice(0, limitNum);

    res.json({
      success: true,
      data: {
        period: periodDays,
        timeline: limited,
        stats: {
          total_activities: timeline.length,
          documents_created: timeline.filter((t) => t.type === 'document' && t.action === 'created').length,
          documents_updated: timeline.filter((t) => t.type === 'document' && t.action === 'updated').length,
          projects_created: timeline.filter((t) => t.type === 'project').length,
          collaborations: timeline.filter((t) => t.type === 'collaboration').length,
        },
        pagination: {
          total: timeline.length,
          showing: limited.length,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar timeline:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar timeline.' });
  }
});

module.exports = router;
