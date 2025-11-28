const { User, Project, Document, ProjectStep, DocumentVersion } = require('../models');
const { ensureDevUser } = require('../middleware/auth');

const STEPS = [
  'contexto-problema',
  'discovery',
  'swot-csd',
  'personas',
  'pesquisa-usuarios',
  'validacao-hipoteses',
  'features-priorizacao',
  'user-stories-fluxos',
  'criterios-metricas',
  'roadmap-backlog',
  'prototipo',
  'prd-final',
  'lancamento',
];

const seedDevData = async () => {
  const user = await ensureDevUser();

  let project = await Project.findOne({ where: { user_id: user.id } });
  if (!project) {
    project = await Project.create({
      user_id: user.id,
      nome: 'Projeto Demo',
      descricao: 'Projeto gerado automaticamente para desenvolvimento',
      etapa_atual: 'discovery',
      progresso_geral: 15,
      status: 'em_andamento',
    });
  }

  for (const step of STEPS) {
    const existingStep = await ProjectStep.findOne({ where: { project_id: project.id, step_key: step } });
    if (!existingStep) {
      await ProjectStep.create({
        project_id: project.id,
        step_key: step,
        status: step === 'contexto-problema' ? 'completed' : 'in_progress',
        progresso: step === 'contexto-problema' ? 100 : 30,
        conteudo: { summary: `Conteudo demo para ${step}` },
      });
    }
  }

  const createDocIfMissing = async (etapa, idx) => {
    let doc = await Document.findOne({ where: { project_id: project.id, etapa } });
    if (!doc) {
      doc = await Document.create({
        project_id: project.id,
        titulo: `Documento ${idx + 1} - ${etapa}`,
        etapa,
        conteudo_estruturado: {
          summary: `Resumo demo para ${etapa}`,
          keyFindings: ['Ponto A', 'Ponto B'],
          sections: [{ title: 'Introducao', pages: '1-2' }],
        },
        formato: 'markdown',
        status: 'rascunho',
        versao: 1,
      });
      await DocumentVersion.create({
        document_id: doc.id,
        version: 1,
        conteudo_estruturado: doc.conteudo_estruturado,
      });
    }
  };

  await createDocIfMissing('contexto-problema', 0);
  await createDocIfMissing('discovery', 1);
  await createDocIfMissing('roadmap-backlog', 9);

  return { user, project };
};

module.exports = { seedDevData, STEPS };
