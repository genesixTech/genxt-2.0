import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../assets/Genesix-logo.png";

const Header = ({ onNavigate, onOpenNotification, onLogout, user, activePage }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const basic =
    "text-base font-medium size rounded-none pb-1 hover:text-blue-500 hover:bg-transparent";

  const active =
    "text-base font-medium size rounded-none pb-1 text-blue-500 bg-transparent border-b-2 border-blue-500";

  const [selected, setSelected] = useState("dashboard");

  useEffect(() => {
    if (activePage) {
      setSelected(activePage);
    }
  }, [activePage]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo e TÃ­tulo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center">
            <img src={logo} alt="" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">GenesiX</h1>
            <p className="text-xs text-gray-500">
              Plataforma de CriaÃ§Ã£o de Produtos
            </p>
          </div>
        </div>

        {/* Navegacao Central */}
        <nav className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("dashboard");
              onNavigate?.("dashboard");
            }}
            className={selected === "dashboard" ? active : basic}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("onboarding");
              onNavigate?.("onboarding");
            }}
            className={selected === "onboarding" ? active : basic}
          >
            Onboarding
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("documents");
              onNavigate?.("documents");
            }}
            className={selected === "documents" ? active : basic}
          >
            Documentos
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("collaboration");
              onNavigate?.("collaboration");
            }}
            className={selected === "collaboration" ? active : basic}
          >
            Colaboracao
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("analytics");
              onNavigate?.("analytics");
            }}
            className={selected === "analytics" ? active : basic}
          >
            Analytics
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("ai");
              onNavigate?.("ai");
            }}
            className={selected === "ai" ? active : basic}
          >
            IA
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("plans");
              onNavigate?.("plans");
            }}
            className={selected === "plans" ? active : basic}
          >
            Planos
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected("billing");
              onNavigate?.("billing");
            }}
            className={selected === "billing" ? active : basic}
          >
            Billing
          </Button>
        </nav>

        {/* Ãrea de Busca e AÃ§Ãµes */}
        <div className="flex items-center space-x-5">
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-48 bg-gray-50 border-gray-200 focus:bg-white rounded-lg text-sm"
            />
          </div>

          {/* BotÃµes de AÃ§Ã£o */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={onOpenNotification}
          >
            <Bell style={{ width: "20px", height: "20px" }} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => onNavigate?.("settings")}
          >
            <Settings style={{ width: "20px", height: "20px" }} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => onNavigate?.("profile")}
          >
            <User style={{ width: "20px", height: "20px" }} />
          </Button>

          {/* Menu do usuÃ¡rio */}
          {user && (
            <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.nome?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.nome || 'UsuÃ¡rio'}
                </span>
              </div>
              {onLogout && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 text-xs"
                  onClick={onLogout}
                >
                  Sair
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


