import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  Calendar,
  Lightbulb,
  Wand2,
  Search,
  Users,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Layers,
  GitBranch,
  Target,
  Palette,
  Rocket,
  BookOpen,
  Settings,
} from "lucide-react";

const Dashboard = ({ onNavigate, onOpenWizard, stepsProgress = [] }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const totalSteps = stepsProgress.length || 13;
  const completedSteps = stepsProgress.filter(
    (s) => s.status === "completed" || (s.progresso || 0) >= 100,
  ).length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  const kpis = [
    {
      id: 1,
      title: "Relatorios Gerados",
      value: 12,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Validacoes Concluidas",
      value: 8,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Tempo ate MVP",
      value: "14 dias",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      id: 4,
      title: "Docs da IA",
      value: 15,
      icon: Lightbulb,
      color: "text-purple-600",
    },
  ];

  const steps = stepsProgress && stepsProgress.length
    ? stepsProgress.map((s) => ({
        id: s.step_key,
        title: s.step_key,
        description: "",
        icon: Search,
        status: s.status,
        progress: s.progresso || 0,
        time: "",
        lastActivity: "",
        tasks: "",
        iconColor: "bg-blue-100 text-blue-600",
      }))
    : [
        {
          id: "contexto-problema",
          title: "Contexto e Problema",
          description: "Identificacao inicial do problema e da oportunidade de mercado.",
          icon: Search,
          status: "completed",
          progress: 100,
          time: "1-2 dias",
          lastActivity: "Analise de problema concluida",
          tasks: "8/8 tarefas",
          iconColor: "bg-purple-100 text-purple-600",
        },
        {
          id: "discovery",
          title: "Analisando o Mercado",
          description: "Exploracao do problema, analise do mercado e tendencias, benchmarks",
          icon: Lightbulb,
          status: "in-progress",
          progress: 65,
          time: "2-3 dias",
          lastActivity: "Pesquisa de mercado em andamento",
          tasks: "5/8 tarefas",
          iconColor: "bg-blue-100 text-blue-600",
        },
        {
          id: "swot-csd",
          title: "SWOT & CSD",
          description: "Construcao da matriz SWOT e CSD para analise estrategica",
          icon: BarChart3,
          status: "completed",
          progress: 100,
          time: "1-2 dias",
          lastActivity: "Matriz SWOT finalizada",
          tasks: "6/6 tarefas",
          iconColor: "bg-green-100 text-green-600",
        },
        {
          id: "personas",
          title: "Personas",
          description: "Definicao de perfis de usuarios-alvo e suas caracteristicas",
          icon: Users,
          status: "pending",
          progress: 0,
          time: "3-5 dias",
          lastActivity: "Aguardando inicio",
          tasks: "0/4 tarefas",
          iconColor: "bg-orange-100 text-orange-600",
        },
        {
          id: "pesquisa-usuarios",
          title: "Pesquisa com Usuarios",
          description: "Criacao, aplicacao e analise de pesquisas com usuarios",
          icon: MessageSquare,
          status: "pending",
          progress: 0,
          time: "3-5 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/5 tarefas",
          iconColor: "bg-blue-100 text-blue-600",
        },
        {
          id: "validacao-hipoteses",
          title: "Validacao de Hipoteses",
          description: "Planejamento e execucao dos experimentos de validacao",
          icon: CheckSquare,
          status: "pending",
          progress: 0,
          time: "2-4 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/6 tarefas",
          iconColor: "bg-green-100 text-green-600",
        },
        {
          id: "features-priorizacao",
          title: "Features e Priorizacao",
          description: "Definicao das funcionalidades e priorizacao",
          icon: Layers,
          status: "pending",
          progress: 0,
          time: "2-3 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/6 tarefas",
          iconColor: "bg-purple-100 text-purple-600",
        },
        {
          id: "user-stories-fluxos",
          title: "User Stories e Fluxos",
          description: "Construcao das user stories e dos fluxos principais",
          icon: GitBranch,
          status: "pending",
          progress: 0,
          time: "2-3 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/5 tarefas",
          iconColor: "bg-pink-100 text-pink-600",
        },
        {
          id: "criterios-metricas",
          title: "Criterios e Metricas",
          description: "Definicao de KPIs e criterios de sucesso",
          icon: Target,
          status: "pending",
          progress: 0,
          time: "1-2 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/4 tarefas",
          iconColor: "bg-blue-100 text-blue-600",
        },
        {
          id: "roadmap-backlog",
          title: "Roadmap e Backlog",
          description: "Organizacao do roadmap e backlog",
          icon: Calendar,
          status: "pending",
          progress: 0,
          time: "2-3 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/5 tarefas",
          iconColor: "bg-orange-100 text-orange-600",
        },
        {
          id: "prototipo",
          title: "Prototipo",
          description: "Criacao de prototipo e testes de usabilidade",
          icon: Palette,
          status: "pending",
          progress: 0,
          time: "3-5 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/4 tarefas",
          iconColor: "bg-purple-100 text-purple-600",
        },
        {
          id: "prd-final",
          title: "PRD Final",
          description: "Finalizacao do documento de requisitos",
          icon: FileText,
          status: "pending",
          progress: 0,
          time: "2-4 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/3 tarefas",
          iconColor: "bg-blue-100 text-blue-600",
        },
        {
          id: "lancamento",
          title: "Lancamento",
          description: "Plano de lancamento e go-to-market",
          icon: Rocket,
          status: "pending",
          progress: 0,
          time: "2-3 dias",
          lastActivity: "Nao iniciado",
          tasks: "0/3 tarefas",
          iconColor: "bg-green-100 text-green-600",
        },
      ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Visao geral dos seus projetos e progresso</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onNavigate?.("documents")}>Documentos</Button>
          <Button variant="outline" onClick={() => onNavigate?.("analytics")}>Analytics</Button>
          <Button className="flex items-center gap-2" onClick={onOpenWizard}>
            <Wand2 className="w-4 h-4" />
            Abrir Wizard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.id} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
                </div>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progresso do Wizard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={overallProgress} className="h-2" />
            <span className="text-sm font-medium text-gray-700">{overallProgress}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Etapas do Wizard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="p-3 rounded-xl border border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={step.progress} className="h-2 w-32" />
                    <Badge variant="outline" className="text-xs capitalize">{step.status}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Acessos Rapidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <Button variant="outline" className="w-full" onClick={() => onNavigate?.("documents")}>
                <FileText className="w-4 h-4 mr-2" /> Documentos
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onNavigate?.("analytics")}>
                <BarChart3 className="w-4 h-4 mr-2" /> Analytics
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onNavigate?.("settings")}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onNavigate?.("documents")}>
                <BookOpen className="w-4 h-4 mr-2" /> Templates
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Proximas tarefas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Revisar discovery</span>
                <Badge variant="secondary">Hoje</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Atualizar PRD</span>
                <Badge variant="secondary">Amanha</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Preparar teste</span>
                <Badge variant="secondary">Esta semana</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
