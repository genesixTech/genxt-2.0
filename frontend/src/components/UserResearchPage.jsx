import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Definir objetivos da pesquisa" },
  { id: 2, text: "Selecionar participantes representativos" },
  { id: 3, text: "Preparar roteiro e hipóteses" },
  { id: 4, text: "Conduzir entrevistas/testes" },
  { id: 5, text: "Organizar achados e próximos passos" },
];

const insights = [
  {
    icon: "trend",
    title: "Priorize hipóteses",
    description:
      "Organize as hipóteses a validar por impacto e esforço para acelerar a tomada de decisão.",
  },
  {
    icon: "message",
    title: "Evidências qualitativas",
    description:
      "Grave citações que representem as dores dos usuários para reforçar alinhamento com o time.",
  },
];

const documents = [
  { name: "Plano de Pesquisa - V1.docx" },
  { name: "Resumo de Insights - V1.md" },
];

const infoBlocks = [
  {
    icon: "message",
    title: "Planejamento de Pesquisa",
    items: [
      { label: "Objetivo", value: "Qual aprendizado você busca?" },
      { label: "Método", value: "Entrevistas, survey, teste..." },
      { label: "Participantes", value: "Quem representa seu usuário?" },
    ],
  },
];

const theme = {
  gradientFrom: "#e0f2fe",
  gradientTo: "#bae6fd",
  tagColor: "text-sky-600",
  accent: "bg-sky-500",
  border: "border-sky-100",
  iconBg: "from-sky-500 to-blue-500",
  iconColor: "text-white",
  headerIcon: "message",
};

const UserResearchPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="Pesquisa com Usuários"
    description="Planeje, execute e sintetize pesquisas qualitativas e quantitativas."
    placeholder="Descreva objetivos, perguntas-chave, método e públicos prioritários..."
    iaMessage="Vamos planejar a pesquisa com usuários. Quais comportamentos ou validações você precisa observar nesta etapa?"
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default UserResearchPage;
