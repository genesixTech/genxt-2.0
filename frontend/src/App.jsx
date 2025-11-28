import { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import Dashboard from "./components/Dashboard";
import Wizard from "./components/Wizard.jsx";
import StepPage from "./components/StepPage";
import DocumentsPage from "./components/DocumentsPage";
import DocumentDetailPage1 from "./components/DocumentDetailPage1";
import DocumentDetailPage2 from "./components/DocumentDetailPage2";
import DocumentDetailPage3 from "./components/DocumentDetailPage3";
import CollaboratorsPage from "./components/CollaboratorsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import UserProfilePage from "./components/UserProfilePage";
import NotificationOverlay from "./components/NotificationOverlay";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import OnboardingPage from "./components/OnboardingPage";
import ProjectCreationPage from "./components/ProjectCreationPage";
import AIPage from "./components/AIPage";
import PlansPage from "./components/PlansPage";
import BillingPage from "./components/BillingPage";
import WorkspaceManagementPage from "./components/WorkspaceManagementPage";
import HelpPage from "./components/HelpPage";
import SWOTCSDPage from "./components/SWOTCSDPage";
import PersonasPage from "./components/PersonasPage";
import UserResearchPage from "./components/UserResearchPage";
import HypothesisTestingPage from "./components/HypothesisTestingPage";
import FeaturesPage from "./components/FeaturesPage";
import UserStoriesFlowsPage from "./components/UserStoriesFlowsPage";
import CriteriaMetricsPage from "./components/CriteriaMetricsPage";
import RoadmapBacklogPage from "./components/RoadmapBacklogPage";
import PrototypePage from "./components/PrototypePage";
import PRDFinalPage from "./components/PRDFinalPage";
import LaunchPage from "./components/LaunchPage";
import GlobalToast from "./components/GlobalToast";
import useWizardStore from "./store/useWizardStore";
import { projectService } from "./services/api";

const stepData = {
  "contexto-problema": {
    id: "contexto-problema",
    title: "Contexto e Problema",
    description: "Identificacao inicial do problema e da oportunidade de mercado.",
    iaMessage:
      "E disse a IA: que haja contexto!\n\nPara comecarmos, conte o problema que seu produto busca resolver e o contexto atual do mercado. Qual a dor principal do usuario?",
    placeholder: "Descreva o problema e o contexto...",
    tasks: [
      { id: 1, text: "Definir o problema central" },
      { id: 2, text: "Analisar o cenario atual do mercado" },
      { id: 3, text: "Identificar a dor principal do usuario" },
      { id: 4, text: "Pesquisar solucoes existentes" },
    ],
  },
  discovery: {
    id: "discovery",
    title: "Discovery",
    description: "Exploracao do problema e levantamento de hipoteses iniciais.",
    iaMessage:
      "Hora do Discovery!\n\nAgora que entendemos o problema, vamos explorar oportunidades. Quais sao as hipoteses iniciais para a solucao? Quais funcionalidades voce imagina?",
    placeholder: "Compartilhe suas hipoteses e ideias de funcionalidades...",
    tasks: [
      { id: 1, text: "Levantar hipoteses de solucao" },
      { id: 2, text: "Brainstorm de funcionalidades" },
      { id: 3, text: "Mapear stakeholders" },
      { id: 4, text: "Definir escopo inicial" },
    ],
  },
  "swot-csd": {
    id: "swot-csd",
    title: "SWOT e CSD",
    component: SWOTCSDPage,
    description: "Analise de forcas, fraquezas, oportunidades, ameacas e Matriz CSD (certezas, suposicoes, duvidas).",
    iaMessage:
      "Analise Estrategica!\n\nVamos consolidar o entendimento do projeto com uma analise SWOT e a Matriz CSD. Quais sao os pontos fortes e fracos do produto? O que e certeza, suposicao e duvida?",
    placeholder: "Preencha a analise SWOT e a Matriz CSD...",
  },
  personas: {
    id: "personas",
    title: "Personas",
    component: PersonasPage,
    description: "Criacao de personas para representar os usuarios-alvo.",
    iaMessage:
      "Conheca seu usuario!\n\nDescreva suas personas: quem sao, objetivos, frustracoes e como o produto se encaixa na vida delas.",
    placeholder: "Crie suas personas...",
  },
  "pesquisa-usuarios": {
    id: "pesquisa-usuarios",
    title: "Pesquisa de Usuario",
    component: UserResearchPage,
    description: "Planejamento e execucao da pesquisa de usuario.",
    iaMessage:
      "Pesquisa em acao!\n\nQuais metodos de pesquisa voce usara? Quais perguntas precisa responder para validar hipoteses?",
    placeholder: "Planeje sua pesquisa...",
  },
  "validacao-hipoteses": {
    id: "validacao-hipoteses",
    title: "Teste de Hipoteses",
    component: HypothesisTestingPage,
    description: "Definicao e teste das hipoteses de solucao.",
    iaMessage:
      "Hora de testar!\n\nQuais hipoteses voce vai testar? Como vai medir sucesso ou fracasso de cada teste?",
    placeholder: "Defina seus testes de hipoteses...",
  },
  "features-priorizacao": {
    id: "features-priorizacao",
    title: "Funcionalidades e Priorizacao",
    component: FeaturesPage,
    description: "Definicao e priorizacao das funcionalidades do produto.",
    iaMessage:
      "O que o produto faz?\n\nListe e priorize funcionalidades. Use metodos como MoSCoW ou Kano. Quais sao as essenciais (Must Have)?",
    placeholder: "Liste e priorize as funcionalidades...",
  },
  "user-stories-fluxos": {
    id: "user-stories-fluxos",
    title: "User Stories e Fluxos",
    component: UserStoriesFlowsPage,
    description: "Criacao de user stories e mapeamento dos fluxos de usuario.",
    iaMessage:
      "Como o usuario interage?\n\nEscreva user stories em \"Como [tipo de usuario], eu quero [objetivo], para [beneficio]\". Mapeie os fluxos principais.",
    placeholder: "Crie as user stories e os fluxos...",
  },
  "criterios-metricas": {
    id: "criterios-metricas",
    title: "Criterios e Metricas",
    component: CriteriaMetricsPage,
    description: "Definicao dos criterios de sucesso e metricas (KPIs).",
    iaMessage:
      "O que e sucesso?\n\nDefina criterios de sucesso para o lancamento e as metricas (KPIs) que usara para medir desempenho.",
    placeholder: "Defina criterios e metricas...",
  },
  "roadmap-backlog": {
    id: "roadmap-backlog",
    title: "Roadmap e Backlog",
    component: RoadmapBacklogPage,
    description: "Criacao do roadmap e do backlog do produto.",
    iaMessage:
      "Onde vamos?\n\nOrganize as funcionalidades no roadmap (curto, medio e longo prazo) e detalhe o backlog para as proximas iteracoes.",
    placeholder: "Crie o roadmap e o backlog...",
  },
  prototipo: {
    id: "prototipo",
    title: "Prototipo",
    component: PrototypePage,
    description: "Criacao e teste do prototipo de alta fidelidade.",
    iaMessage:
      "Maos a obra!\n\nDescreva o prototipo. Quais sao as telas principais? Quais ferramentas usou? Quais foram os resultados dos testes de usabilidade?",
    placeholder: "Descreva o prototipo e os testes...",
  },
  "prd-final": {
    id: "prd-final",
    title: "PRD Final",
    component: PRDFinalPage,
    description: "Documento de requisitos de produto (PRD) finalizado.",
    iaMessage:
      "O documento mestre!\n\nRevise e finalize o PRD. Ele deve conter todas as informacoes necessarias para o time de desenvolvimento.",
    placeholder: "Finalize o PRD...",
  },
  lancamento: {
    id: "lancamento",
    title: "Lancamento",
    component: LaunchPage,
    description: "Plano de lancamento e estrategia Go-to-Market.",
    iaMessage:
      "Pronto para o mundo!\n\nQual e o plano de lancamento? Qual a estrategia de marketing e vendas? Como vai medir o sucesso apos o lancamento?",
    placeholder: "Crie o plano de lancamento...",
  },
  // Adicionar dados para outras etapas aqui
};
// Componente principal da aplicaÃ§Ã£o
function AppContent() {
  const { isAuthenticated, isLoading, user, login, register, logout } = useAuth();
  const { steps: wizardSteps, fetchSteps, setProject, currentProjectId } = useWizardStore();
  const PUBLIC_PAGES = ["login", "register", "forgot-password"];
  const WIZARD_IDS = [
    "contexto-problema",
    "discovery",
    "swot-csd",
    "personas",
    "pesquisa-usuarios",
    "validacao-hipoteses",
    "features-priorizacao",
    "user-stories-fluxos",
    "criterios-metricas",
    "roadmap-backlog",
    "prototipo",
    "prd-final",
    "lancamento",
  ];
  const getInitialPage = () => {
    if (typeof window === "undefined") {
      return "login";
    }
    const initialHash = window.location.hash.replace("#", "");
    return initialHash || "login";
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasLoadedSteps, setHasLoadedSteps] = useState(false);

  // Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", ""); // Remove o #
      const targetPage = hash || (isAuthenticated ? "dashboard" : "login");
      const isPublicPage = PUBLIC_PAGES.includes(targetPage);

      if (!isAuthenticated && !isPublicPage) {
        setActivePage("login");
        if (window.location.hash !== "#login") {
          window.location.hash = "login";
        }
        return;
      }

      setActivePage(targetPage);
    };

    // Verificar hash inicial
    handleHashChange();

    // Escutar mudanÃ§as no hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Redirecionar para login se nÃ£o autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_PAGES.includes(activePage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  // Quando autenticar, levar usuÃ¡rio para o dashboard caso esteja em pÃ¡ginas pÃºblicas
  useEffect(() => {
    if (!isLoading && isAuthenticated && PUBLIC_PAGES.includes(activePage)) {
      setActivePage("dashboard");
      if (typeof window !== "undefined") {
        window.location.hash = "dashboard";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  // Carregar progresso do wizard ao autenticar (primeiro projeto)
  useEffect(() => {
    const loadDefaultProject = async () => {
      try {
        const response = await projectService.getProjects();
        const firstProject = response?.data?.data?.[0] || response?.data?.projects?.[0];
        if (firstProject?.id) {
          setProject(firstProject.id);
          await fetchSteps(firstProject.id);
        }
      } catch (error) {
        // Fallback silencioso; manter fluxo
      } finally {
        setHasLoadedSteps(true);
      }
    };

    if (isAuthenticated && !hasLoadedSteps) {
      loadDefaultProject();
    }
  }, [isAuthenticated, hasLoadedSteps, fetchSteps, setProject]);

  const handleNavigate = (page) => {
    const targetPage = page || (isAuthenticated ? "dashboard" : "login");
    if (!isAuthenticated && !PUBLIC_PAGES.includes(targetPage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
      return;
    }

    // Prepara projeto default para wizard
    if (WIZARD_IDS.includes(targetPage)) {
      const projectId = currentProjectId || "demo-project-id";
      setProject(projectId);
      if (!wizardSteps.length) {
        fetchSteps(projectId);
      }
    }

    setActivePage(targetPage);
    if (typeof window !== "undefined") {
      window.location.hash = targetPage;
    }
  };

  const handleToggleRightSidebar = () => {
    setIsRightSidebarCollapsed(!isRightSidebarCollapsed);
  };

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  const handleOpenNotification = () => {
    setIsNotificationOpen(true);
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      handleNavigate('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      handleNavigate('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    await logout();
    handleNavigate('login');
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">GenesiX</h2>
          <p className="text-gray-600">Carregando sua experiÃªncia...</p>
        </div>
      </div>
    );
  }

  // PÃ¡ginas de autenticaÃ§Ã£o (sem layout principal)
  if (['login', 'register', 'forgot-password'].includes(activePage)) {
    return (
      <div>
        {activePage === 'login' && (
          <LoginPage 
            onNavigate={handleNavigate} 
            onLogin={handleLogin}
          />
        )}
        {activePage === 'register' && (
          <RegisterPage 
            onNavigate={handleNavigate} 
            onRegister={handleRegister}
          />
        )}
        {activePage === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleNavigate} />
        )}
      </div>
    );
  }

  // Layout principal da aplicaÃ§Ã£o (apenas para usuÃ¡rios autenticados)
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Header
        onNavigate={handleNavigate}
        onOpenNotification={handleOpenNotification}
        onLogout={handleLogout}
        user={user}
        activePage={activePage}
      />

      <LeftSidebar
        activeStep={activePage}
        onStepChange={handleNavigate}
        stepsProgress={wizardSteps}
      />

      {isNotificationOpen && (
        <NotificationOverlay
          isOpen={handleOpenNotification}
          onClose={handleCloseNotification}
        />
      )}

      <main
        className={`flex-1 overflow-auto pt-16 transition-all duration-300 ${isRightSidebarCollapsed ? "mr-16" : "mr-64"} ml-64`}
      >
        {activePage === "dashboard" && (
          <Dashboard
            onNavigate={handleNavigate}
            onOpenWizard={handleOpenWizard}
            stepsProgress={wizardSteps}
          />
        )}
        {activePage === "onboarding" && (
          <OnboardingPage onNavigate={handleNavigate} />
        )}
        {activePage === "project-create" && (
          <ProjectCreationPage onNavigate={handleNavigate} />
        )}
        {activePage === "ai" && <AIPage />}
        {activePage === "plans" && <PlansPage />}
        {activePage === "billing" && <BillingPage />}
        {activePage === "workspace" && <WorkspaceManagementPage />}
        {activePage === "help" && <HelpPage />}
        {activePage === "documents" && <DocumentsPage />}
        {activePage === "documents-step-1" && (
          <DocumentDetailPage1 onBack={() => handleNavigate("documents")} />
        )}
        {activePage === "documents-step-2" && (
          <DocumentDetailPage2 onBack={() => handleNavigate("documents")} />
        )}
        {activePage === "documents-step-3" && (
          <DocumentDetailPage3 onBack={() => handleNavigate("documents")} />
        )}
        {activePage === "collaboration" && <CollaboratorsPage />}
        {activePage === "analytics" && <AnalyticsPage />}
        {activePage === "profile" && <UserProfilePage />}
        {activePage === "settings" && <SettingsPage />}
        {activePage === "contexto-problema" && (
          <StepPage
            stepData={stepData["contexto-problema"]}
            onAdvanceStep={() => handleNavigate("discovery")}
            projectId={currentProjectId || "demo-project-id"}
          />
        )}
        {activePage === "discovery" && (
          <StepPage
            stepData={stepData["discovery"]}
            onAdvanceStep={() => handleNavigate("swot-csd")}
            projectId={currentProjectId || "demo-project-id"}
          />
        )}
        {activePage === "swot-csd" && <SWOTCSDPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("personas")} />}
        {activePage === "personas" && <PersonasPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("pesquisa-usuarios")} />}
        {activePage === "pesquisa-usuarios" && <UserResearchPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("validacao-hipoteses")} />}
        {activePage === "validacao-hipoteses" && <HypothesisTestingPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("features-priorizacao")} />}
        {activePage === "features-priorizacao" && <FeaturesPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("user-stories-fluxos")} />}
        {activePage === "user-stories-fluxos" && <UserStoriesFlowsPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("criterios-metricas")} />}
        {activePage === "criterios-metricas" && <CriteriaMetricsPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("roadmap-backlog")} />}
        {activePage === "roadmap-backlog" && <RoadmapBacklogPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("prototipo")} />}
        {activePage === "prototipo" && <PrototypePage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("prd-final")} />}
        {activePage === "prd-final" && <PRDFinalPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("lancamento")} />}
        {activePage === "lancamento" && <LaunchPage projectId={currentProjectId || "demo-project-id"} onAdvanceStep={() => handleNavigate("dashboard")} />}
      </main>

      <RightSidebar
        collapsed={isRightSidebarCollapsed}
        onToggle={handleToggleRightSidebar}
      />
      {isWizardOpen && <Wizard onClose={handleCloseWizard} />}
    </div>
  );
}

// Componente App com Provider
function App() {
  return (
    <AuthProvider>
      <GlobalToast />
      <AppContent />
    </AuthProvider>
  );
}

export default App;




