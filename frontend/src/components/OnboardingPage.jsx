import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ActivityList from "./ActivityList";

const steps = [
  { id: 1, title: "Configure o workspace", description: "Defina nome, identidade e preferências do time." },
  { id: 2, title: "Conecte o time", description: "Convide colaboradores e atribua permissões." },
  { id: 3, title: "Inicie um projeto", description: "Use o assistente para criar sua primeira jornada." },
];

const OnboardingPage = ({ onNavigate }) => {
  const [workspaceName, setWorkspaceName] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Onboarding</p>
          <h2 className="text-2xl font-bold text-gray-900">Bem-vindo(a) à GenesiX</h2>
          <p className="text-sm text-gray-600">Complete os passos abaixo para começar a criar produtos com IA.</p>
        </div>
        <Button onClick={() => onNavigate?.("project-create")}>Criar projeto agora</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div key={step.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">Passo {step.id}</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold">
                {step.id}
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Configurar workspace</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 font-medium">Nome do workspace</label>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Ex: Squad Aurora"
                className="mt-2"
                aria-label="Nome do workspace"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onNavigate?.("workspace")} variant="outline">
                Ir para workspace
              </Button>
              <Button onClick={() => onNavigate?.("project-create")}>Avançar para projetos</Button>
            </div>
          </div>
        </div>
        <ActivityList
          title="Primeiras ações sugeridas"
          items={[
            { id: "a1", title: "Convide o time", description: "Adicione as pessoas que vão colaborar nos projetos.", timestamp: "Hoje", actor: "Sistema" },
            { id: "a2", title: "Explore templates", description: "Use a IA para gerar estruturas iniciais.", timestamp: "Hoje", actor: "GenesiX" },
          ]}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
