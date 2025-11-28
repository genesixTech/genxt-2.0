import React, { useState } from "react";
import {
  Bell,
  Globe,
  Layout,
  CreditCard,
  Plug,
  Folder,
  Shield,
  Save,
  X,
  Check,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("Conta & Segurança");
  const [theme, setTheme] = useState("automatic");
  const [language, setLanguage] = useState("pt-br");
  const [layout, setLayout] = useState("compact");
  const [notifications, setNotifications] = useState({
    push: true,
    emailSummary: false,
    criticalAlerts: true,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const sections = [
    { name: "Conta & Segurança", icon: <Shield className="w-5 h-5" /> },
    { name: "Preferências", icon: <Layout className="w-5 h-5" /> },
    {
      name: "Assinatura & Pagamento",
      icon: <CreditCard className="w-5 h-5" />,
    },
    { name: "Integrações", icon: <Plug className="w-5 h-5" /> },
    { name: "Projetos & Dados", icon: <Folder className="w-5 h-5" /> },
  ];

  const integrations = [
    {
      name: "Notion",
      connected: true,
      icon: "https://www.notion.so/images/logo-32.png",
    },
    {
      name: "Jira",
      connected: false,
      icon: "https://wac-cdn.atlassian.com/dam/jcr:e1a74247-4f9e-400e-86f7-417d4719706e/Jira%20Icon%20RGB.svg",
    },
    {
      name: "Trello",
      connected: true,
      icon: "https://cdn.icon-icons.com/icons/2428/PNG/512/trello_logo_black_icon_147139.png",
    },
    {
      name: "Confluence",
      connected: false,
      icon: "https://wac-cdn.atlassian.com/dam/jcr:e1a74247-4f9e-400e-86f7-417d4719706e/Jira%20Icon%20RGB.svg",
    }, // Using Jira icon as placeholder
    {
      name: "Slack",
      connected: true,
      icon: "https://a.slack-edge.com/8089d/marketing/img/icons/icon_slack_hash_256.png",
    },
    {
      name: "Discord",
      connected: false,
      icon: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49f11d9e79ceec77_icon_clyde_white_RGB.png",
    },
    {
      name: "Figma",
      connected: true,
      icon: "https://cdn.icon-icons.com/icons/2428/PNG/512/figma_logo_icon_147288.png",
    },
  ];

  const devices = [
    {
      id: 1,
      name: "MacBook Pro",
      location: "São Paulo, BR",
      time: "2 min atrás",
      current: true,
    },
    {
      id: 2,
      name: "iPhone 14",
      location: "São Paulo, BR",
      time: "1 hora atrás",
      current: false,
    },
    {
      id: 3,
      name: "Chrome - Windows",
      location: "São Paulo, BR",
      time: "2 dias atrás",
      current: false,
    },
  ];

  const userProjects = [
    {
      id: 1,
      name: "App de Delivery",
      status: "ativo",
      progress: 65,
      lastActivity: "2 horas atrás",
    },
    {
      id: 2,
      name: "SaaS B2B",
      status: "em edição",
      progress: 40,
      lastActivity: "1 dia atrás",
    },
    {
      id: 3,
      name: "E-commerce Fashion",
      status: "finalizado",
      progress: 100,
      lastActivity: "1 semana atrás",
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "Conta & Segurança":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Autenticação em Duas Etapas (2FA)</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Adicione uma camada extra de segurança à sua conta.
                  </p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Ativos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {device.name}{" "}
                        {device.current && (
                          <Badge className="ml-2">Atual</Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {device.location} • {device.time}
                      </p>
                    </div>
                    {!device.current && (
                      <Button variant="outline" size="sm">
                        Desconectar
                      </Button>
                    )}
                  </div>
                ))}
                <Separator />
                <Button variant="destructive" className="w-full">
                  Encerrar Todas as Sessões
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Excluir Conta</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Esta ação é irreversível e removerá todos os seus dados.
                </p>
                <Button variant="destructive">Excluir Conta</Button>
              </CardContent>
            </Card>
          </div>
        );
      case "Preferências":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar Tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro 🌞</SelectItem>
                    <SelectItem value="dark">Escuro 🌙</SelectItem>
                    <SelectItem value="automatic">Automático 💻</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Tema atualizado com sucesso.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Idioma</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar Idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-br">Português (BR)</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  🌐 Idioma alterado com sucesso.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout da Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar Layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacto</SelectItem>
                    <SelectItem value="comfortable">Confortável</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  📐 Layout atualizado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Ativar notificações push
                  </p>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(e) =>
                      setNotifications({ ...notifications, push: e })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Receber resumo diário por email
                  </p>
                  <Switch
                    checked={notifications.emailSummary}
                    onCheckedChange={(e) =>
                      setNotifications({ ...notifications, emailSummary: e })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Alertas críticos (sempre ativos)
                  </p>
                  <Switch
                    checked={notifications.criticalAlerts}
                    onCheckedChange={(e) =>
                      setNotifications({ ...notifications, criticalAlerts: e })
                    }
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  🔔 Preferências de notificação salvas.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "Assinatura & Pagamento":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Plano Pro</p>
                    <p className="text-sm text-gray-500">R$ 97,00/mês</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Ativo</Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Renovação:</span>
                  <span>20/10/2025</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Gerenciar Plano
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  🚀 Com o Plano Pro, você desbloqueia todo o poder da IA
                  multiagente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Faturas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Fatura #202410 - Outubro</p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Fatura #202409 - Setembro</p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Fatura #202408 - Agosto</p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "Integrações":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conectar com Outras Ferramentas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={integration.icon}
                        alt={integration.name}
                        className="w-6 h-6"
                      />
                      <p className="font-medium">{integration.name}</p>
                    </div>
                    {integration.connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Desconectar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-500 border-green-200 hover:bg-green-50"
                      >
                        Conectar
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chaves de API Personalizadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  Gerar Nova Chave
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  ✅ Conectado com sucesso.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "Projetos & Dados":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Workspaces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Nome do novo workspace"
                    className="flex-grow mr-2"
                  />
                  <Button>Criar</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <span>Workspace Padrão</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Renomear
                      </Button>
                      <Button variant="destructive" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <span>Workspace de Testes</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Renomear
                      </Button>
                      <Button variant="destructive" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportar Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Exportar Relatórios
                  (PDF)
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Exportar Backlog (CSV)
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Exportar Protótipos
                  (ZIP)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Importar Projetos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" /> Importar via JSON
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" /> Importar via CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-8 pt-16">
      <h1 className="text-3xl font-bold mb-2">Configurações</h1>
      <p className="text-gray-600 mb-8">
        "Personalize, gerencie e integre o GenesiX ao seu jeito"
      </p>

      <div className="flex space-x-8">
        <div className="w-64 flex-shrink-0">
          <Card className="p-4 space-y-2">
            {sections.map((section) => (
              <Button
                key={section.name}
                variant="ghost"
                className={`w-full justify-start gap-2 ${activeSection === section.name ? "bg-gray-100 text-purple-600" : "text-gray-700"}`}
                onClick={() => setActiveSection(section.name)}
              >
                {section.icon}
                {section.name}
                {activeSection === section.name && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Button>
            ))}
          </Card>
        </div>

        <div className="flex-1">{renderSection()}</div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
          <Save className="w-5 h-5 mr-2" /> Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
