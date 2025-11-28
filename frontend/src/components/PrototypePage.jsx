import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Escolher fidelidade e ferramentas do protótipo" },
  { id: 2, text: "Construir fluxos principais do MVP" },
  { id: 3, text: "Rodar testes rápidos de usabilidade" },
  { id: 4, text: "Registrar aprendizados para ajustes" },
];

const insights = [
  {
    icon: "lightbulb",
    title: "Teste cedo",
    description:
      "Mesmo protótipos simples ajudam a expor problemas de navegação e copy antes de investir em desenvolvimento.",
  },
  {
    icon: "target",
    title: "Alinhe feedbacks",
    description:
      "Relacionar feedbacks às hipóteses do discovery ajuda a priorizar ajustes críticos.",
  },
];

const documents = [
  { name: "Link do Protótipo - V1" },
  { name: "Relatório de Testes - V1.pdf" },
];

const infoBlocks = [
  {
    icon: "lightbulb",
    title: "Checklist do Protótipo",
    items: [
      { label: "Fidelidade", value: "Baixa, média ou alta?" },
      { label: "Ferramenta", value: "Figma, Maze, ProtoPie etc." },
      { label: "Testes", value: "Quantos usuários testaram?" },
    ],
  },
];

const theme = {
  gradientFrom: "#fdf2f8",
  gradientTo: "#fbcfe8",
  tagColor: "text-rose-500",
  accent: "bg-rose-500",
  border: "border-rose-100",
  iconBg: "from-rose-500 to-fuchsia-500",
  iconColor: "text-white",
  headerIcon: "lightbulb",
};

const PrototypePage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="Protótipo"
    description="Crie protótipos navegáveis, valide fluxo e registre aprendizados."
    placeholder="Conte quais fluxos foram prototipados e quais resultados surgiram nos testes..."
    iaMessage="Descreva o escopo do protótipo, ferramentas usadas e aprendizados de usabilidade para ajustarmos o documento da etapa."
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default PrototypePage;
