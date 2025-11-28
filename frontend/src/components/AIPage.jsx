import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sparkles, Rocket, Bot } from "lucide-react";
import ActivityList from "./ActivityList";

const AIPage = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">IA Playground</p>
          <h2 className="text-2xl font-bold text-gray-900">Estrutura pronta para multiagentes</h2>
          <p className="text-sm text-gray-600">Envie prompts, conecte agentes e orquestre execuções.</p>
        </div>
        <Button variant="outline">Configurar providers</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Assistente de Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva o que precisa gerar..."
            />
            <Button className="w-full" disabled={!prompt}>
              Enviar para IA
            </Button>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700 min-h-[140px]">
              Respostas e logs de agentes aparecerão aqui.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="w-4 h-4 text-purple-500" />
                Agentes conectados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Ideação</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Ativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pesquisa</span>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Standby</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Entrega</span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Off</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Rocket className="w-4 h-4 text-blue-500" />
                Playbooks rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Gerar user stories", "Planejar entrevistas", "Criar PRD", "Checklist de lançamento"].map(
                (item) => (
                  <Button key={item} variant="outline" className="w-full justify-start text-sm">
                    {item}
                  </Button>
                ),
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ActivityList
        title="Logs de agentes"
        items={[
          { id: "l1", title: "Ideação", description: "Gerou 5 features priorizadas", timestamp: "Há 2m", actor: "Agente" },
          { id: "l2", title: "Pesquisa", description: "Sugestão de perguntas de entrevista", timestamp: "Há 5m", actor: "Agente" },
        ]}
      />
    </div>
  );
};

export default AIPage;
