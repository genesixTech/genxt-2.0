import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Consolidar visão, objetivos e métricas" },
  { id: 2, text: "Descrever requisitos funcionais e não funcionais" },
  { id: 3, text: "Listar dependências e riscos conhecidos" },
  { id: 4, text: "Revisar com stakeholders chave" },
];

const insights = [
  {
    icon: "lightbulb",
    title: "Documento vivo",
    description:
      "Trate o PRD como uma fonte única de verdade. Atualize sempre que surgirem mudanças relevantes.",
  },
  {
    icon: "trend",
    title: "Contexto gera alinhamento",
    description:
      "Inclua links para pesquisas, protótipos e métricas para reduzir dúvidas durante o desenvolvimento.",
  },
];

const documents = [
  { name: "PRD - V1.docx" },
  { name: "Resumo Executivo - V1.pdf" },
];

const infoBlocks = [
  {
    icon: "file",
    title: "Sessões do PRD",
    items: [
      { label: "Visão", value: "Contexto, público, objetivo" },
      { label: "Requisitos", value: "Funcionais + não funcionais" },
      { label: "Riscos", value: "Premissas, dependências, incertezas" },
    ],
  },
];

const theme = {
  gradientFrom: "#ede9fe",
  gradientTo: "#ddd6fe",
  tagColor: "text-purple-600",
  accent: "bg-purple-500",
  border: "border-purple-100",
  iconBg: "from-purple-500 to-indigo-500",
  iconColor: "text-white",
  headerIcon: "file",
};

const PRDFinalPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="PRD Final"
    description="Finalize o documento de requisitos com todas as decisões e artefatos relevantes."
    placeholder="Liste requisitos, critérios de aceite e contexto do PRD..."
    iaMessage="Vamos consolidar o PRD. Quais requisitos, premissas e decisões precisam ficar registrados nesta versão final?"
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default PRDFinalPage;
