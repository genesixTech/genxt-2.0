import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Definir estratégia de go-to-market" },
  { id: 2, text: "Planejar comunicação e materiais de lançamento" },
  { id: 3, text: "Organizar suporte e monitoramento pós-lançamento" },
  { id: 4, text: "Estabelecer metas e indicadores de pós-lançamento" },
];

const insights = [
  {
    icon: "trend",
    title: "Momento da verdade",
    description:
      "Prepare canais de comunicação, treinamento interno e monitoramento em tempo real para reagir rápido aos primeiros usuários.",
  },
  {
    icon: "alert",
    title: "Planos de contingência",
    description:
      "Liste riscos e planos de ação caso algo dê errado durante o lançamento para evitar surpresas.",
  },
];

const documents = [
  { name: "Plano de Lançamento - V1.pptx" },
  { name: "Checklist Pós-Lançamento - V1.md" },
];

const infoBlocks = [
  {
    icon: "message",
    title: "Checklist do lançamento",
    items: [
      { label: "Canais", value: "Email, social, comunidade..." },
      { label: "Mensagens", value: "O que será comunicado" },
      { label: "Pós-lançamento", value: "Suporte, monitoramento, métricas" },
    ],
  },
];

const theme = {
  gradientFrom: "#cffafe",
  gradientTo: "#a5f3fc",
  tagColor: "text-cyan-600",
  accent: "bg-cyan-500",
  border: "border-cyan-100",
  iconBg: "from-cyan-500 to-blue-500",
  iconColor: "text-white",
  headerIcon: "message",
};

const LaunchPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="Lançamento"
    description="Planeje a estratégia, comunicação e acompanhamento do go-to-market."
    placeholder="Descreva canais, cronograma e indicadores do lançamento..."
    iaMessage="Quais são os elementos essenciais do seu go-to-market? Compartilhe mensagens-chave, canais e expectativas de resultados."
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default LaunchPage;
