import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Upload,
  Send,
  Lightbulb,
  Search,
  Users,
  BarChart3,
  MessageSquare,
  CheckCircle,
  Edit,
  RefreshCcw,
  Wand2,
} from "lucide-react";

const Wizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    {
      id: "contexto-problema",
      title: "Contexto e Problema",
      iaMessage:
        "E disse a IA: que haja contexto! ✨\n\nPara começarmos, me conte sobre o problema que seu produto busca resolver e o contexto atual do mercado. Qual a dor principal do seu usuário?",
      placeholder: "Descreva o problema e o contexto...",
    },
    {
      id: "discovery",
      title: "Discovery",
      iaMessage:
        "Hora do Discovery! 🔍\n\nAgora que entendemos o problema, vamos explorar as oportunidades. Quais são as hipóteses iniciais que você tem para a solução? Quais funcionalidades você imagina?",
      placeholder: "Compartilhe suas hipóteses e ideias de funcionalidades...",
    },
    {
      id: "swot-csd",
      title: "SWOT & CSD",
      iaMessage:
        "Análise Estratégica em ação! 📊\n\nPara aprofundar, quais são os pontos fortes, fracos, oportunidades e ameaças (SWOT) do seu projeto? E quais são suas certezas, suposições e dúvidas (CSD)?",
      placeholder: "Liste seus pontos SWOT e CSD...",
    },
    {
      id: "personas",
      title: "Personas",
      iaMessage:
        "Conhecendo seu público! 🧑‍🤝‍🧑\n\nDescreva seu usuário ideal. Quais são suas características demográficas, comportamentais, necessidades e objetivos? Se tiver, envie arquétipos ou dados de pesquisa.",
      placeholder: "Descreva suas personas...",
    },
    {
      id: "pesquisa-usuarios",
      title: "Pesquisa com Usuários",
      iaMessage:
        "A voz do usuário! 🗣️\n\nQuais foram os principais insights da sua pesquisa com usuários? Quais perguntas foram feitas e quais foram as respostas mais relevantes? Se tiver, anexe relatórios ou transcrições.",
      placeholder: "Compartilhe os resultados da pesquisa com usuários...",
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  useEffect(() => {
    // Simula a mensagem inicial da IA para a etapa atual
    setMessages([
      {
        id: "ia-intro",
        sender: "IA",
        text: currentStepData.iaMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setGeneratedDocument(null);
  }, [currentStep, currentStepData.iaMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsGenerating(true);

    // Simula a resposta da IA e geração de documento
    setTimeout(() => {
      const iaResponse = {
        id: Date.now() + 1,
        sender: "IA",
        text: `Perfeito! Analisei suas informações sobre ${currentStepData.title}. Vou gerar um documento detalhado...`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, iaResponse]);

      setTimeout(() => {
        setGeneratedDocument({
          title: `Relatório de ${currentStepData.title}`,
          content: `## Relatório de ${currentStepData.title}\n\nBaseado nas suas informações:\n\n**Problema:** ${newMessage.text}\n\n**Análise da IA:**\n\n*   Identificamos que o problema principal reside na falta de uma ferramenta centralizada para gestão de projetos de IA.\n*   O contexto de mercado aponta para uma crescente demanda por soluções que integrem IA no ciclo de vida do produto.\n*   Recomendamos focar na usabilidade e na integração com ferramentas existentes.\n\n**Próximos Passos Sugeridos:**\n\n1.  Validar as hipóteses com usuários reais.\n2.  Realizar um benchmark de ferramentas similares.\n3.  Definir métricas claras de sucesso.\n\nEste documento está pronto para ser revisado e aprovado.`, // Conteúdo simulado
          status: "pending",
        });
        setIsGenerating(false);
      }, 2000); // Simula tempo de geração da IA
    }, 1500); // Simula tempo de resposta da IA
  };

  const handleApproveDocument = () => {
    setGeneratedDocument((prev) => ({ ...prev, status: "approved" }));
    setTimeout(() => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        alert("Todas as etapas do Wizard foram concluídas!");
        onClose();
      }
    }, 1000);
  };

  const handleEditDocument = () => {
    alert("Funcionalidade de edição em desenvolvimento!");
  };

  const handleRejectDocument = () => {
    setGeneratedDocument(null);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        sender: "IA",
        text: "Entendido. Por favor, forneça mais informações ou revise as anteriores para que eu possa refazer o documento.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setGeneratedDocument(null); // Limpa o documento gerado ao avançar
    } else {
      alert("Todas as etapas do Wizard foram concluídas!");
      onClose();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setGeneratedDocument(null); // Limpa o documento gerado ao voltar
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header do Wizard */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Wand2 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Wizard de Criação</h2>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Etapa {currentStep} de {steps.length}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-gray-200 h-2">
        <Progress value={progress} className="h-full bg-purple-500" />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Área de Chat */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="flex-1 space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      msg.sender === "user" ? "bg-blue-500" : "bg-purple-500"
                    }`}
                  >
                    {msg.sender === "user" ? "VC" : "IA"}
                  </div>
                  <div
                    className={`p-3 rounded-lg shadow-sm ${msg.sender === "user" ? "bg-blue-50 text-blue-900" : "bg-gray-100 text-gray-800"}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-xs text-gray-500 block mt-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[70%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white text-sm font-bold">
                    IA
                  </div>
                  <div className="p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-4 h-4 animate-pulse text-purple-600" />
                      <span className="text-sm">IA pensando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {generatedDocument && (
            <Card className="mt-4 shadow-lg border-green-500">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-green-700 mb-2">
                  Documento Gerado
                </h3>
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {generatedDocument.content}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleApproveDocument}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
                  </Button>
                  <Button onClick={handleEditDocument} variant="outline">
                    <Edit className="w-4 h-4 mr-2" /> Editar
                  </Button>
                  <Button onClick={handleRejectDocument} variant="destructive">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Rejeitar e Refazer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input e Upload */}
          <div className="flex items-center space-x-2 p-4 border-t border-gray-200">
            <Button variant="outline" size="icon">
              <Upload className="w-5 h-5" />
            </Button>
            <Textarea
              placeholder={currentStepData.placeholder}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 resize-none text-sm"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navegação Lateral (opcional, para etapas maiores) */}
        {/* <div className="w-64 border-l border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Etapas</h3>
          <ul>
            {steps.map((step, index) => (
              <li key={step.id} className={`mb-2 ${index + 1 === currentStep ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                {index + 1}. {step.title}
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* Footer de Navegação */}
      <div className="flex justify-between p-4 border-t border-gray-200">
        <Button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          variant="outline"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={
            currentStep === steps.length ||
            generatedDocument?.status !== "approved"
          }
        >
          Próxima Etapa
        </Button>
      </div>
    </div>
  );
};

export default Wizard;
