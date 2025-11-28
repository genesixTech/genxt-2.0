import { useEffect } from "react";
import AIChatWizard from "./AIChatWizard";
import useWizardStore from "../store/useWizardStore";
import { projectService } from "@/services/api";

const THEME_PRESETS = {
  "contexto-problema": {
    gradientFrom: "#e0f2fe",
    gradientTo: "#bae6fd",
    headerIcon: "lightbulb",
    iconBg: "from-sky-500 to-blue-500",
  },
  discovery: {
    gradientFrom: "#ede9fe",
    gradientTo: "#ddd6fe",
    headerIcon: "trend",
    iconBg: "from-indigo-500 to-purple-500",
  },
};

const INFO_PRESETS = {
  "contexto-problema": [
    {
      icon: "lightbulb",
      title: "Checklist de Contexto",
      items: [
        { label: "Mercado", value: "Segmento, publico e oportunidade" },
        { label: "Problema", value: "Dor observada e impacto" },
        { label: "Evidencias", value: "Dados, pesquisas e entrevistas" },
      ],
    },
  ],
  discovery: [
    {
      icon: "trend",
      title: "Hipoteses iniciais",
      items: [
        { label: "Suposicao", value: "O que acreditamos ser verdade" },
        { label: "Confirmacao", value: "Dados que precisamos coletar" },
        { label: "Risco", value: "O que acontece se estiver errado" },
      ],
    },
  ],
};

const StepPage = ({ stepData, onAdvanceStep, projectId }) => {
  const { setProject, fetchSteps, saveStep, steps, currentProjectId } = useWizardStore();

  useEffect(() => {
    if (projectId) {
      setProject(projectId);
      fetchSteps(projectId);
    }
  }, [projectId, setProject, fetchSteps]);

  const computeOverallProgress = () => {
    const total = steps.length || 13;
    const completed = steps.filter((s) => s.status === "completed" || (s.progresso || 0) >= 100).length;
    return Math.round((completed / total) * 100);
  };

  const updateProjectProgress = async (project) => {
    try {
      await projectService.updateProject(project, {
        etapa_atual: stepData.id,
        progresso_geral: computeOverallProgress(),
      });
    } catch (error) {
      // fallback silencioso para nao quebrar o fluxo
    }
  };

  const handleSaveStep = (payload) => {
    const project = projectId || currentProjectId;
    if (!project) return;
    const stepRecord = steps.find((s) => s.step_key === stepData.id);
    if (stepRecord?.id) {
      saveStep(stepRecord.id, {
        conteudo: payload,
        status: "in_progress",
        progresso: Math.min(100, (payload?.content?.length || 10) % 100),
      });
      updateProjectProgress(project);
    }
  };

  const handleAdvance = async () => {
    const project = projectId || currentProjectId;
    if (project) {
      await updateProjectProgress(project);
    }
    onAdvanceStep?.();
  };

  const theme = stepData.theme || THEME_PRESETS[stepData.id];
  const infoBlocks = stepData.infoBlocks || INFO_PRESETS[stepData.id];

  return (
    <AIChatWizard
      title={stepData.title}
      description={stepData.description}
      placeholder={stepData.placeholder}
      iaMessage={stepData.iaMessage}
      tasks={stepData.tasks}
      insights={stepData.insights}
      documents={stepData.documents}
      infoBlocks={infoBlocks}
      theme={theme}
      onAdvanceStep={handleAdvance}
      onSaveStep={handleSaveStep}
    />
  );
};

export default StepPage;
