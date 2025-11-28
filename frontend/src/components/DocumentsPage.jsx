import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  Palette,
  Code,
  TestTube,
  Rocket,
  TrendingUp,
  Shield,
  CheckCircle,
  Star,
  MessageSquare,
  Layers,
  GitBranch,
  Calendar,
} from "lucide-react";
import { documentService } from "@/services/api";
import { notify } from "./GlobalToast";
import GlobalLoader from "./GlobalLoader";

const DocumentsPage = ({ onNavigate, projectId }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [showCrossReference, setShowCrossReference] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoading(true);
        const params = projectId ? { project_id: projectId } : {};
        const response = await documentService.getDocuments(params);
        const list = response?.data?.data || response?.data || [];
        setDocs(list);
      } catch (error) {
        notify.error("Nao foi possivel carregar documentos.");
      } finally {
        setLoading(false);
      }
    };
    loadDocs();
  }, [projectId]);

  const documentSteps = useMemo(() => {
    if (docs.length) {
      const grouped = docs.reduce((acc, doc) => {
        const key = doc.etapa || "outros";
        if (!acc[key]) acc[key] = [];
        acc[key].push(doc);
        return acc;
      }, {});

      const mapIcon = {
        "contexto-problema": Target,
        discovery: Lightbulb,
        "swot-csd": BarChart3,
        personas: Users,
        "pesquisa-usuarios": MessageSquare,
        "validacao-hipoteses": TestTube,
        "features-priorizacao": Layers,
        "user-stories-fluxos": GitBranch,
        "criterios-metricas": Target,
        "roadmap-backlog": Calendar,
        prototipo: Palette,
        "prd-final": FileText,
        lancamento: Rocket,
      };

      return Object.entries(grouped).map(([etapa, documents]) => ({
        id: etapa,
        title: etapa,
        icon: mapIcon[etapa] || FileText,
        color: "from-blue-500 to-purple-600",
        documentCount: documents.length,
        documents: documents.map((d, index) => ({
          id: d.id || index + 1,
          name: d.titulo,
          type: d.formato || "markdown",
          size: d.tamanho || "",
          lastModified: d.updated_at || "",
          route: d.route,
        })),
      }));
    }

    return [
      {
        id: 1,
        title: "Definicao do Problema",
        icon: Target,
        color: "from-blue-500 to-purple-600",
        documentCount: 3,
        documents: [
          { name: "Analise de Mercado", type: "PDF", size: "2.4 MB", lastModified: "2 dias atras" },
          { name: "Personas de Usuario", type: "DOCX", size: "1.8 MB", lastModified: "3 dias atras" },
          { name: "Mapa de Jornada", type: "PDF", size: "3.2 MB", lastModified: "1 dia atras" },
        ],
      },
      {
        id: 2,
        title: "Mercado",
        icon: BarChart3,
        color: "from-green-500 to-teal-600",
        documentCount: 4,
        documents: [
          { name: "Relatorio de Concorrencia", type: "PDF", size: "4.1 MB", lastModified: "1 dia atras" },
          { name: "Analise SWOT", type: "DOCX", size: "1.2 MB", lastModified: "2 dias atras" },
          { name: "Pesquisa de Tendencias", type: "PDF", size: "2.8 MB", lastModified: "3 dias atras" },
          { name: "Dados de Mercado", type: "XLSX", size: "5.6 MB", lastModified: "1 dia atras" },
        ],
      },
    ];
  }, [docs]);

  const totalDocuments = documentSteps.reduce(
    (sum, step) => sum + step.documentCount,
    0,
  );

  const routeForDoc = (doc, step) => {
    if (doc?.route) return doc.route;
    const order = [
      "contexto-problema",
      "discovery",
      "swot-csd",
      "personas",
      "pesquisa-usuarios",
      "validacao-hipoteses",
      "features-priorizacao",
      "user-stories-fluxos",
      "criterios-metricas",
      "roadmap-backlog",
      "prototipo",
      "prd-final",
      "lancamento",
    ];
    const idx = order.indexOf(step?.id);
    if (idx >= 0) {
      if (idx < 4) return "documents-step-1";
      if (idx < 8) return "documents-step-2";
      return "documents-step-3";
    }
    return "documents-step-1";
  };

  const handleOpenDocument = (doc, step) => {
    if (doc?.id) {
      sessionStorage.setItem("current_document_id", String(doc.id));
    }
    onNavigate?.(routeForDoc(doc, step));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Documentos
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Workspace de Documentos</h1>
          <p className="text-sm text-gray-600">
            Explore, edite e acompanhe documentos gerados ao longo do wizard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowCrossReference(!showCrossReference)}>
            {showCrossReference ? "Ocultar Cross-Reference" : "Mostrar Cross-Reference"}
          </Button>
          <Button onClick={() => onNavigate?.("project-create")}>Novo Projeto</Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <GlobalLoader label="Carregando documentos..." />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{totalDocuments}</p>
                <p className="text-sm text-blue-600">Documentos Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {
                    documentSteps.filter((step) => step.documentCount > 0)
                      .length
                  }
                </p>
                <p className="text-sm text-green-600">Etapas com Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-700">3</p>
                <p className="text-sm text-yellow-600">Paginas Detalhadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">AI</p>
                <p className="text-sm text-purple-600">Wizard Disponivel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-reference */}
      {showCrossReference && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Cross-Reference de Documentos
              </h2>
              <p className="text-sm text-gray-600">
                Encontre conexoes e dependencias entre documentos de diferentes etapas
              </p>
            </div>
            <Button variant="outline" size="sm">
              Exportar CSV
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <Card className="border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Dependencias</CardTitle>
                <CardDescription>Documentos que referenciam outros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p>Roadmap - referencia Personas</p>
                <p>PRD - referencia Hipoteses</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Links</CardTitle>
                <CardDescription>Conexoes entre etapas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p>Discovery → Personas</p>
                <p>Personas → Features</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
                <CardDescription>Checks e pendencias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p>Documentos: {totalDocuments}</p>
                <p>Etapas cobertas: {documentSteps.length}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Grid de Cards de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documentSteps.map((step) => {
          const IconComponent = step.icon;
          return (
            <Card
              key={step.id}
              className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {step.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        {step.documentCount} documentos
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {step.documentCount} itens
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {step.documents.map((doc, index) => (
                  <div
                    key={`${doc.name}-${index}`}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition cursor-pointer"
                    onClick={() => {
                      setSelectedStep(step.id);
                      handleOpenDocument(doc, step);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{doc.size}</span>
                      <span>{doc.lastModified}</span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600"
                  onClick={() => {
                    const firstDoc = step.documents[0];
                    if (firstDoc) {
                      handleOpenDocument(firstDoc, step);
                    } else {
                      onNavigate?.("documents-step-1");
                    }
                  }}
                >
                  Ver detalhes
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secao de Destaques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Templates IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>Resumo executivo, PRD, Roadmap e mais.</p>
            <div className="flex gap-2">
              <Badge variant="outline">PRD</Badge>
              <Badge variant="outline">Discovery</Badge>
              <Badge variant="outline">Personas</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Atalhos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm text-gray-700">
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onNavigate?.("documents-step-1")}>
              Documento 1
            </Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onNavigate?.("documents-step-2")}>
              Documento 2
            </Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onNavigate?.("documents-step-3")}>
              Documento 3
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsPage;

