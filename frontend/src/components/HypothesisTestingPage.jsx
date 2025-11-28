import AIChatWizard from "./AIChatWizard";

const tasks = [
  { id: 1, text: "Listar hipóteses priorizadas" },
  { id: 2, text: "Definir métricas de sucesso para cada hipótese" },
  { id: 3, text: "Selecionar experimentos e ferramentas" },
  { id: 4, text: "Executar testes e registrar aprendizados" },
];

const insights = [
  {
    icon: "target",
    title: "Clareza nos resultados",
    description:
      "Associe cada hipótese a uma métrica quantitativa para facilitar a tomada de decisão.",
  },
  {
    icon: "alert",
    title: "Falhas são dados",
    description:
      "Hipóteses invalidadas também geram valor. Documente o porquê para evitar retrabalho futuro.",
  },
];

const documents = [
  { name: "Planilha de Testes - V2.xlsx" },
  { name: "Relatório de Experimentos - V1.pdf" },
];

const infoBlocks = [
  {
    icon: "target",
    title: "Template de Hipótese",
    items: [
      { label: "Suposição", value: "Acreditamos que..." },
      { label: "Métrica", value: "Será comprovado quando..." },
      { label: "Experimento", value: "Vamos testar fazendo..." },
    ],
  },
];

const theme = {
  gradientFrom: "#fef3f2",
  gradientTo: "#fecdd3",
  tagColor: "text-rose-600",
  accent: "bg-rose-500",
  border: "border-rose-100",
  iconBg: "from-rose-500 to-red-500",
  iconColor: "text-white",
  headerIcon: "target",
};

const HypothesisTestingPage = ({ onAdvanceStep }) => (
  <AIChatWizard
    title="Teste de Hipóteses"
    description="Organize os experimentos, registre resultados e evolua o produto baseado em dados."
    placeholder="Descreva a hipótese, o experimento e qual métrica comprova o resultado..."
    iaMessage="Quais hipóteses você quer validar nesta etapa? Conte a suposição, a métrica que comprova e o experimento desejado."
    tasks={tasks}
    insights={insights}
    documents={documents}
    infoBlocks={infoBlocks}
    theme={theme}
    onAdvanceStep={onAdvanceStep}
  />
);

export default HypothesisTestingPage;
