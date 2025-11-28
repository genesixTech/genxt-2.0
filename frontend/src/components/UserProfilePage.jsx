import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  User,
  Mail,
  Lock,
  Globe,
  Clock,
  CreditCard,
  Bell,
  Moon,
  Sun,
  Shield,
  Smartphone,
  FileText,
  HelpCircle,
  MessageCircle,
  Trash2,
  Edit,
  Camera,
  Github,
  Linkedin,
  Chrome,
  Key,
  MapPin,
  Calendar,
  Award,
  Star,
  Target,
  Zap,
  Plus,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Dados do usuário
  const [userData, setUserData] = useState({
    name: "Maria Silva",
    email: "maria.silva@empresa.com",
    role: "Product Manager & Founder",
    avatar: "",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    plan: "Pro",
    planStartDate: "2024-01-15",
    planEndDate: "2025-01-15",
  });

  // Configurações de notificação
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    slack: false,
    discord: false,
  });

  // Integrações
  const [integrations, setIntegrations] = useState({
    notion: true,
    jira: false,
    trello: true,
    confluence: false,
  });

  // Projetos do usuário
  const userProjects = [
    {
      name: "App de Delivery",
      status: "ativo",
      progress: 65,
      lastUpdate: "2 horas atrás",
    },
    {
      name: "SaaS B2B",
      status: "em edição",
      progress: 40,
      lastUpdate: "1 dia atrás",
    },
    {
      name: "E-commerce Fashion",
      status: "finalizado",
      progress: 100,
      lastUpdate: "1 semana atrás",
    },
  ];

  // Badges conquistadas
  const userBadges = [
    { name: "Primeiro Projeto Criado", icon: "🎯", earned: true },
    { name: "Validador de Hipóteses", icon: "✅", earned: true },
    { name: "Explorador de Benchmarks", icon: "🔍", earned: false },
    { name: "Mestre da Documentação", icon: "📚", earned: true },
  ];

  // Dispositivos ativos
  const activeDevices = [
    {
      device: "MacBook Pro",
      location: "São Paulo, BR",
      lastAccess: "2 min atrás",
      current: true,
    },
    {
      device: "iPhone 14",
      location: "São Paulo, BR",
      lastAccess: "1 hora atrás",
      current: false,
    },
    {
      device: "Chrome - Windows",
      location: "São Paulo, BR",
      lastAccess: "2 dias atrás",
      current: false,
    },
  ];

  // Histórico de pagamentos
  const paymentHistory = [
    { date: "2024-01-15", amount: "R$ 97,00", plan: "Pro", status: "Pago" },
    { date: "2023-12-15", amount: "R$ 97,00", plan: "Pro", status: "Pago" },
    { date: "2023-11-15", amount: "R$ 97,00", plan: "Pro", status: "Pago" },
  ];

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Trial":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Starter":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pro":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Enterprise":
        return "bg-gold-100 text-gold-800 border-gold-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 border-green-200";
      case "em edição":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "finalizado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header do Perfil */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="text-2xl bg-purple-600 text-white">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                <Badge
                  variant="outline"
                  className={getPlanColor(userData.plan)}
                >
                  {userData.plan}
                </Badge>
              </div>
              <p className="text-lg text-gray-600 mb-3">{userData.role}</p>

              {/* Mensagem personalizada por plano */}
              {userData.plan === "Pro" && (
                <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-3">
                  <p className="text-purple-800 font-medium">
                    🔥 Você está no plano Pro! Continue criando e surpreenda
                    seus investidores.
                  </p>
                </div>
              )}

              {/* Mini dashboard */}
              <div className="grid grid-cols-3 gap-4">
                {userProjects.slice(0, 3).map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {project.name}
                    </p>
                    <Progress value={project.progress} className="h-2 mb-1" />
                    <p className="text-xs text-gray-500">
                      {project.progress}% concluído
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={userData.name}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  value={userData.email}
                  disabled
                  className="bg-gray-50"
                />
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value="••••••••••"
                    disabled={!isEditing}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </div>

            <div>
              <Label>Redes Sociais Conectadas</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Chrome className="w-4 h-4" />
                  Google
                  <Check className="w-3 h-3 text-green-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                  <X className="w-3 h-3 text-red-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                  <Check className="w-3 h-3 text-green-600" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Idioma</Label>
                <select
                  id="language"
                  className="w-full p-2 border border-gray-200 rounded-md"
                  value={userData.language}
                  disabled={!isEditing}
                >
                  <option value="pt-BR">Português (BR)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <Label htmlFor="timezone">Fuso Horário</Label>
                <select
                  id="timezone"
                  className="w-full p-2 border border-gray-200 rounded-md"
                  value={userData.timezone}
                  disabled={!isEditing}
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plano & Assinatura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Plano & Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Plano {userData.plan}</p>
                <p className="text-sm text-gray-600">R$ 97,00/mês</p>
              </div>
              <Badge variant="outline" className={getPlanColor(userData.plan)}>
                Ativo
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Início</p>
                <p className="font-medium">
                  {new Date(userData.planStartDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Renovação</p>
                <p className="font-medium">
                  {new Date(userData.planEndDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              Gerenciar Assinatura
            </Button>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                Upgrade para Enterprise
              </h4>
              <p className="text-sm text-purple-700 mb-3">
                Desbloqueie recursos avançados, integrações ilimitadas e suporte
                prioritário.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Ver Diferenciais
              </Button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Histórico de Pagamentos</h4>
              <div className="space-y-2">
                {paymentHistory.slice(0, 3).map((payment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      {new Date(payment.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span>{payment.amount}</span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações da Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-600" />
              Configurações da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Notificações</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>Email</span>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span>In-app</span>
                  </div>
                  <Switch
                    checked={notifications.inApp}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, inApp: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                    <span>Slack</span>
                  </div>
                  <Switch
                    checked={notifications.slack}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, slack: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span>Modo Escuro</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div>
              <h4 className="font-semibold mb-3">Integrações</h4>
              <div className="space-y-3">
                {Object.entries(integrations).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key}</span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setIntegrations({ ...integrations, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  value="gx_••••••••••••••••••••••••••••••••"
                  disabled
                  className="bg-gray-50"
                />
                <Button variant="outline" size="sm">
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Área de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação em Duas Etapas</p>
                <p className="text-sm text-gray-600">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-3">Dispositivos Ativos</h4>
              <div className="space-y-3">
                {activeDevices.map((device, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">{device.device}</p>
                        <p className="text-xs text-gray-600">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {device.location} • {device.lastAccess}
                        </p>
                      </div>
                    </div>
                    {device.current ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        Atual
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Desconectar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Encerrar Todas as Sessões
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos & Projetos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Documentos & Projetos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Projeto
            </Button>

            <div className="space-y-3">
              {userProjects.map((project, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge
                      variant="outline"
                      className={getStatusColor(project.status)}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <Progress value={project.progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{project.progress}% concluído</span>
                    <span>{project.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gamificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {userBadges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-center ${
                    badge.earned
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-medium">{badge.name}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                Próxima Conquista
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                Complete mais 2 validações de hipóteses para desbloquear
                "Explorador de Benchmarks"
              </p>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suporte & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            Suporte & Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQs
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat de Suporte
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Sugerir Melhoria
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rodapé */}
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-gray-900">
                Política de Privacidade
              </a>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
