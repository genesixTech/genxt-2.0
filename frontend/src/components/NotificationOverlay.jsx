import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  FileText,
  Settings,
  CreditCard,
  Headphones,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const notificationsData = [
  {
    id: 1,
    type: "Projetos",
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    message: "Seu relatório de Discovery está pronto para revisão.",
    read: false,
    action: { label: "Abrir", link: "#documents-step-1" },
  },
  {
    id: 2,
    type: "Sistema",
    icon: <Settings className="w-4 h-4 text-gray-500" />,
    message: "Novo recurso: Integração com Confluence já disponível.",
    read: false,
    action: { label: "Saiba Mais", link: "#settings" },
  },
  {
    id: 3,
    type: "Assinatura",
    icon: <CreditCard className="w-4 h-4 text-green-500" />,
    message:
      "Seu trial expira em 2 dias – faça o upgrade para continuar seu projeto.",
    read: false,
    action: { label: "Gerenciar Plano", link: "#profile" },
  },
  {
    id: 4,
    type: "Suporte",
    icon: <Headphones className="w-4 h-4 text-purple-500" />,
    message: "Sua solicitação #112 foi respondida pelo time de suporte.",
    read: true,
    action: { label: "Abrir Chamado", link: "#support" },
  },
  {
    id: 5,
    type: "Projetos",
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    message: "A matriz SWOT foi atualizada com novos insights.",
    read: false,
    action: { label: "Editar", link: "#documents-step-2" },
  },
  {
    id: 6,
    type: "Sistema",
    icon: <Settings className="w-4 h-4 text-gray-500" />,
    message: "O GenesiX agora suporta exportação direta para Jira.",
    read: true,
    action: { label: "Saiba Mais", link: "#settings" },
  },
  {
    id: 7,
    type: "Assinatura",
    icon: <CreditCard className="w-4 h-4 text-green-500" />,
    message: "Pagamento confirmado: Plano Pro ativo até 20/10/2025.",
    read: true,
    action: { label: "Gerenciar Plano", link: "#profile" },
  },
  {
    id: 8,
    type: "Projetos",
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    message: "Protótipo em Figma gerado com sucesso – clique para visualizar.",
    read: false,
    action: { label: "Visualizar", link: "#documents-step-3" },
  },
];

const NotificationOverlay = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("Todas");

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "Todas") return true;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 z-50 flex justify-end"
      onClick={onClose}
    >
      <Card
        className="w-140 h-full bg-white shadow-lg rounded-l-lg flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-600" />
            Notificações
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {filter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["Todas", "Projetos", "Sistema", "Assinatura", "Suporte"].map(
                  (cat) => (
                    <DropdownMenuItem key={cat} onClick={() => setFilter(cat)}>
                      {cat}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Nenhuma notificação encontrada para esta categoria.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-lg border 
                  ${notif.read ? "bg-gray-50 border-gray-200" : "bg-purple-50 border-purple-200 relative"}
                `}
              >
                {!notif.read && (
                  <span className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                )}
                <div className="flex-shrink-0 mt-1">{notif.icon}</div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${notif.read ? "text-gray-700" : "font-medium text-gray-900"}`}
                  >
                    {notif.message}
                  </p>
                  {notif.action && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-purple-600 hover:text-purple-800"
                      onClick={() => {
                        window.location.hash = notif.action.link;
                        onClose();
                      }}
                    >
                      {notif.action.label}{" "}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
                <div className="flex-shrink-0 flex flex-col gap-1">
                  {!notif.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <div className="p-4 border-t flex justify-between items-center">
          <Button
            variant="link"
            size="sm"
            className="text-purple-600 hover:text-purple-800"
          >
            Ver todas as notificações <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationOverlay;
