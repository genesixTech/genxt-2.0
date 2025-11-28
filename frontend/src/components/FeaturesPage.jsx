import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Listar funcionalidades levantadas até agora" },
  { id: 2, text: "Aplicar método de priorização (MoSCoW, RICE...)" },
  { id: 3, text: "Definir escopo do MVP" },
  { id: 4, text: "Criar backlog inicial com critérios claros" },
];

const insights = [
  {
    icon: "trend",
    title: "Conexão com métricas",
    description:
      "Priorize funcionalidades que impactem diretamente a métrica de sucesso definida no discovery.",
  },
  {
    icon: "lightbulb",
    title: "MVP enxuto",
    description:
      "Agrupe features por objetivo e enxugue o MVP para validar a proposta de valor o quanto antes.",
  },
];

const documents = [
  { name: "Backlog Prioritário - V1.xlsx" },
  { name: "Mapa de Funcionalidades - V1.md" },
];

const infoBlocks = [
  {
    icon: "lightbulb",
    title: "Critérios sugeridos",
    items: [
      { label: "Impacto", value: "Quanto contribui para o objetivo?" },
      { label: "Esforço", value: "Complexidade técnica / custo" },
      { label: "Urgência", value: "Dependências ou datas críticas" },
    ],
  },
];

const theme = {
  gradientFrom: "#f0fdf4",
  gradientTo: "#bbf7d0",
  tagColor: "text-emerald-600",
  accent: "bg-emerald-500",
  border: "border-emerald-100",
  iconBg: "from-emerald-500 to-green-500",
  iconColor: "text-white",
  headerIcon: "lightbulb",
};

const FeaturesPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="Funcionalidades e Priorização"
    description="Organize e priorize o conjunto de funcionalidades que entregarão valor ao usuário."
    placeholder="Liste e detalhe as funcionalidades, critérios de priorização e resultados esperados..."
    iaMessage="Vamos priorizar funcionalidades. Quais problemas cada feature resolve e qual critério você quer aplicar nesta etapa?"
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default FeaturesPage;
