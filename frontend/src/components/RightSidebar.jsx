import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Clock,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  Target,
  FileText,
  User,
  Bot,
} from "lucide-react";
import { useState } from "react";

const RightSidebar = ({ collapsed, onToggle }) => {
  const [activeTab, setActiveTab] = useState("insights");
  const [newComment, setNewComment] = useState("");

  const insights = [
    {
      id: 1,
      type: "trend",
      title: "Tendência de Mercado",
      description:
        "O mercado de IA está crescendo 23% ao ano. Considere focar em automação.",
      confidence: 85,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "opportunity",
      title: "Oportunidade Identificada",
      description: "Lacuna no mercado para soluções B2B de pequeno porte.",
      confidence: 92,
      icon: Target,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "risk",
      title: "Risco Potencial",
      description:
        "Concorrência forte no segmento enterprise. Considere nicho específico.",
      confidence: 78,
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ];

  const history = [
    {
      id: 1,
      action: "created",
      item: "Análise de problema",
      user: "IA Assistant",
      timestamp: "2 min atrás",
      icon: Bot,
    },
    {
      id: 2,
      action: "approved",
      item: "Documento de contexto",
      user: "João Silva",
      timestamp: "5 min atrás",
      icon: User,
    },
    {
      id: 3,
      action: "edited",
      item: "Matriz SWOT",
      user: "Maria Santos",
      timestamp: "1h atrás",
      icon: User,
    },
    {
      id: 4,
      action: "generated",
      item: "Relatório de Discovery",
      user: "IA Assistant",
      timestamp: "2h atrás",
      icon: Bot,
    },
  ];

  const comments = [
    {
      id: 1,
      user: "João Silva",
      content:
        "Excelente análise do problema. Sugiro focar mais no segmento B2B.",
      timestamp: "10 min atrás",
      avatar: "JS",
    },
    {
      id: 2,
      user: "Maria Santos",
      content:
        "Concordo com a abordagem. Podemos adicionar mais dados sobre concorrência?",
      timestamp: "25 min atrás",
      avatar: "MS",
    },
    {
      id: 3,
      user: "IA Assistant",
      content:
        "Baseado na análise, recomendo priorizar validação com usuários reais.",
      timestamp: "1h atrás",
      avatar: "AI",
    },
  ];

  const tabs = [
    { id: "insights", icon: Lightbulb },
    { id: "history", icon: Clock },
    { id: "comments", icon: MessageCircle },
  ];

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "text-green-600";
      case "approved":
        return "text-blue-600";
      case "edited":
        return "text-orange-600";
      case "generated":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case "created":
        return "criou";
      case "approved":
        return "aprovou";
      case "edited":
        return "editou";
      case "generated":
        return "gerou";
      default:
        return action;
    }
  };

  return (
    <aside
      className={`fixed right-1 top-16 bottom-0 bg-white border-l border-gray-100 transition-all duration-300 z-30 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          {!collapsed && (
            <h2 className="text-base font-semibold text-gray-900">
              Painel Lateral
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            {collapsed ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {!collapsed && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-2 rounded-none border-b-2 text-x ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon style={{ width: "20px", height: "20px" }} />
                  </Button>
                );
              })}
            </div>

            {/* Conteúdo das Tabs */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "insights" && (
                <div className="p-3 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Insights da IA
                  </h3>
                  {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                      <div
                        key={insight.id}
                        className="p-2 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-start space-x-2">
                          <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 mb-0.5">
                              {insight.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-1">
                              {insight.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {insight.confidence}% confiança
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {insight.type === "trend"
                                  ? "Análise de Mercado"
                                  : insight.type === "opportunity"
                                    ? "Pesquisa Competitiva"
                                    : "Análise SWOT"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "history" && (
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Histórico de Atividades
                  </h3>
                  <div className="space-y-2">
                    {history.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-start space-x-2 p-1 hover:bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              item.icon === Bot
                                ? "bg-purple-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                item.icon === Bot
                                  ? "text-purple-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{item.user}</span>
                              <span
                                className={`mx-0.5 ${getActionColor(item.action)}`}
                              >
                                {getActionText(item.action)}
                              </span>
                              <span className="text-gray-600">{item.item}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="p-3 flex flex-col h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Comentários
                  </h3>

                  <div className="flex-1 space-y-2 mb-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start space-x-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {comment.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-sm font-medium text-gray-900 mb-0.5">
                              {comment.user}
                            </p>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {comment.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <Textarea
                      placeholder="Adicionar comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-1 text-sm"
                      rows={2}
                    />
                    <Button size="sm" className="w-full text-sm">
                      Enviar Comentário
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
