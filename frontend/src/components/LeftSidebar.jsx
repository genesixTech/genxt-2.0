import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitBranch,
  Layers,
  Lightbulb,
  MessageSquare,
  Palette,
  Rocket,
  Search,
  Settings,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line no-unused-vars
const LeftSidebar = ({ activeStep, onStepChange, stepsProgress = [] }) => {
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    {
      id: "contexto-problema",
      title: "Contexto e Problema",
      icon: Search,
    },
    {
      id: "discovery",
      title: "Discovery",
      icon: Lightbulb,
    },
    {
      id: "swot-csd",
      title: "SWOT & CSD",
      icon: BarChart3,
    },
    {
      id: "personas",
      title: "Personas",
      icon: Users,
    },
    {
      id: "pesquisa-usuarios",
      title: "Pesquisa de Usuários",
      icon: MessageSquare,
    },
    {
      id: "validacao-hipoteses",
      title: "Teste de Hipóteses",
      icon: CheckSquare,
    },
    {
      id: "features-priorizacao",
      title: "Funcionalidades",
      icon: Layers,
    },
    {
      id: "user-stories-fluxos",
      title: "User Stories & Fluxos",
      icon: GitBranch,
    },
    {
      id: "criterios-metricas",
      title: "Critérios e Métricas",
      icon: Target,
    },
    {
      id: "roadmap-backlog",
      title: "Roadmap & Backlog",
      icon: Calendar,
    },
    {
      id: "prototipo",
      title: "Protótipo",
      icon: Palette,
    },
    {
      id: "prd-final",
      title: "PRD Final",
      icon: FileText,
    },
    {
      id: "lancamento",
      title: "Lançamento",
      icon: Rocket,
    },
  ];

  const completedSteps = steps.filter((step) => {
    const progressEntry = stepsProgress.find((p) => p.step_key === step.id);
    return progressEntry ? progressEntry.status === "completed" || progressEntry.progresso >= 100 : false;
  }).length;
  const totalSteps = steps.length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "⌛";
      default:
        return "▶️";
    }
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 transition-all duration-300 z-30 ${
        collapsed ? "w-16" : "w-66"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header da Sidebar */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Fluxo do Projeto
                </h2>
                <p className="text-xs text-gray-500">Progresso Geral</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              {collapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-3 h-3" />
              )}
            </Button>
          </div>

          {!collapsed && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {overallProgress}%
                </span>
                <span className="text-xs text-gray-500">
                  {completedSteps}/{totalSteps}
                </span>
              </div>
              <Progress value={overallProgress} className="h-1.5" />
            </div>
          )}
        </div>

        {/* Lista de Etapas */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-1">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const progressEntry = stepsProgress.find((p) => p.step_key === step.id);
              const status = progressEntry?.status || "pending";
              const progress = progressEntry?.progresso || 0;

              return (
                <Button
                  key={step.id}
                  variant="ghost"
                  onClick={() => onStepChange?.(step.id)}
                  className={`w-full justify-start p-2 mb-1 h-auto text-sm cursor-pointer ${
                    isActive ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-2 w-full">
                    {/* Ícone e Status */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "in-progress"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {!collapsed && index < steps.length - 1 && (
                        <div className="w-px h-6 bg-gray-200 mt-1" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    {!collapsed && (
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-medium text-sm mr-2 text-gray-900">
                            {step.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(status)}`}
                          >
                            {getStatusIcon(status)}
                          </Badge>
                        </div>
                        {progress > 0 && (
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={progress}
                              className="h-1 flex-1"
                            />
                            <span className="text-xs text-gray-500">
                              {progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Footer da Sidebar */}
        {!collapsed && (
          <div className="p-3 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 text-sm"
            >
              <BookOpen className="w-3.5 h-3.5 mr-2" />
              Documentação
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
