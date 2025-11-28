import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Organizar roadmap por horizontes (curto, médio, longo prazo)" },
  { id: 2, text: "Atualizar backlog com prioridades recentes" },
  { id: 3, text: "Mapear dependências e capacidades" },
  { id: 4, text: "Definir próximas entregas do MVP" },
];

const insights = [
  {
    icon: "trend",
    title: "Sequência orientada a valor",
    description:
      "Agrupe iniciativas por objetivos de negócio para facilitar o alinhamento com stakeholders.",
  },
  {
    icon: "message",
    title: "Comunicação clara",
    description:
      "Atualize o backlog com contextos e links úteis para acelerar o entendimento do time.",
  },
];

const documents = [
  { name: "Roadmap Visual - V1.png" },
  { name: "Backlog Mestre - V2.xlsx" },
];

const infoBlocks = [
  {
    icon: "target",
    title: "Horizontes",
    items: [
      { label: "Curto Prazo", value: "MVP e próximos sprints" },
      { label: "Médio Prazo", value: "Escala e novas integrações" },
      { label: "Longo Prazo", value: "Visão estratégica" },
    ],
  },
];

const theme = {
  gradientFrom: "#fffbeb",
  gradientTo: "#fde68a",
  tagColor: "text-amber-600",
  accent: "bg-amber-500",
  border: "border-amber-100",
  iconBg: "from-amber-500 to-yellow-500",
  iconColor: "text-white",
  headerIcon: "target",
};

const RoadmapBacklogPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="Roadmap & Backlog"
    description="Planeje entregas, alinhe expectativas e mantenha o backlog organizado."
    placeholder="Explique como está estruturado o roadmap e quais itens entram no backlog..."
    iaMessage="Conte quais iniciativas precisam entrar no roadmap agora. Como elas se conectam ao backlog e ao progresso do MVP?"
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default RoadmapBacklogPage;
