import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Mapear forças e fraquezas do produto" },
  { id: 2, text: "Identificar oportunidades e ameaças externas" },
  { id: 3, text: "Preencher a matriz CSD (certezas, suposições, dúvidas)" },
  { id: 4, text: "Priorizar riscos e definir ações de mitigação" },
];

const insights = [
  {
    icon: "trend",
    title: "Análise interna e externa",
    description:
      "A IA recomenda equilibrar os achados de mercado com evidências internas para manter estratégia coerente.",
  },
  {
    icon: "alert",
    title: "Riscos priorizados",
    description:
      "Registre as ameaças com maior impacto e defina hipóteses para validá-las rapidamente com o time.",
  },
];

const documents = [
  { name: "Matriz SWOT - V1.docx" },
  { name: "Registro CSD - V1.md" },
];

const infoBlocks = [
  {
    icon: "trend",
    title: "Elementos de SWOT",
    items: [
      { label: "Forças", value: "Vantagens internas e diferenciais" },
      { label: "Fraquezas", value: "Pontos a evoluir para competir melhor" },
      { label: "Oportunidades", value: "Movimentos externos favoráveis" },
      { label: "Ameaças", value: "Riscos de mercado ou concorrentes" },
    ],
  },
  {
    icon: "alert",
    title: "Matriz CSD",
    items: [
      { label: "Certezas", value: "O que já está validado" },
      { label: "Suposições", value: "Hipóteses a confirmar" },
      { label: "Dúvidas", value: "Perguntas abertas para investigação" },
    ],
  },
];

const theme = {
  gradientFrom: "#fef3c7",
  gradientTo: "#fde68a",
  tagColor: "text-amber-600",
  accent: "bg-amber-500",
  border: "border-amber-100",
  iconBg: "from-amber-500 to-orange-500",
  iconColor: "text-white",
  headerIcon: "trend",
};

const SWOTCSDPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="SWOT & CSD"
    description="Analise o cenário interno e externo para alinhar a visão estratégica."
    placeholder="Compartilhe os principais pontos da sua matriz SWOT e CSD..."
    iaMessage="Vamos consolidar as forças, fraquezas, oportunidades e ameaças do seu produto. Quais aprendizados você já tem e o que ainda precisa descobrir?"
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default SWOTCSDPage;
