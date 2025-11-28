import React, { useEffect, useState } from "react";
import DocumentEditor from "./DocumentEditor";
import GlobalLoader from "./GlobalLoader";
import { notify } from "./GlobalToast";
import { documentService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, FileText, Download, Eye, Share2, Clock, User, BarChart3, TrendingUp } from "lucide-react";

const FALLBACK_DOCUMENTS = [
  {
    id: 1,
    name: "Analise de Mercado",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2 dias atras",
    author: "Maria Silva",
    description: "Analise completa do mercado atual, incluindo tamanho, segmentacao e oportunidades de crescimento.",
    content: {
      summary: "Este documento apresenta uma analise abrangente do mercado-alvo, identificando oportunidades e desafios para o desenvolvimento do produto.",
      keyFindings: [
        "Mercado em crescimento de 15% ao ano",
        "Segmento premium com menor concorrencia",
        "Demanda crescente por solucoes digitais",
        "Oportunidade de first-mover advantage",
      ],
      sections: [
        { title: "Tamanho do Mercado", pages: "1-5" },
        { title: "Analise Competitiva", pages: "6-12" },
        { title: "Segmentacao", pages: "13-18" },
        { title: "Oportunidades", pages: "19-24" },
      ],
    },
  },
];

const normalizeContent = (payload = {}) => ({
  summary: payload.summary || "",
  keyFindings: payload.keyFindings || [],
  sections: payload.sections || [],
});

const DocumentDetailPage1 = ({ onBack, documentId }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const handleSave = async (doc) => {
    if (!selectedDocument?.id) return;
    setSaving(true);
    try {
      await documentService.updateDocument(selectedDocument.id, {
        titulo: doc.title || selectedDocument.name,
        conteudo_estruturado: doc.content,
      });
      await loadDocument(selectedDocument.id);
      await loadVersions(selectedDocument.id);
      notify.success("Documento salvo");
    } catch (error) {
      notify.error("Erro ao salvar documento");
    } finally {
      setSaving(false);
    }
  };

  const loadVersions = async (id) => {
    try {
      setLoadingVersions(true);
      const response = await documentService.getDocumentVersions(id);
      const list = response?.data?.versions || response?.versions || [];
      setVersions(list);
    } catch (error) {
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  };

  const loadDocument = async (id) => {
    const localDoc = FALLBACK_DOCUMENTS.find((d) => d.id === id);
    if (localDoc) {
      setSelectedDocument({ ...localDoc, content: normalizeContent(localDoc.content) });
    }
    try {
      const resp = await documentService.getDocument(id);
      const doc = resp?.data?.document || resp?.document;
      if (doc) {
        setSelectedDocument({
          id: doc.id,
          name: doc.titulo || doc.name || Documento ,
          type: doc.formato || doc.type || "markdown",
          size: doc.tamanho || doc.size || "",
          lastModified: doc.updated_at || doc.lastModified || "",
          createdAt: doc.created_at,
          author: doc.aprovador?.nome || doc.autor || doc.author || "",
          description: doc.descricao || doc.description || "",
          content: normalizeContent(doc.conteudo_estruturado || doc.content),
        });
      }
    } catch (error) {
      // fallback permanece
    }
  };

  const handleRestore = async (version) => {
    if (!selectedDocument?.id) return;
    try {
      setLoadingVersions(true);
      await documentService.restoreVersion(selectedDocument.id, version);
      notify.success("Versao restaurada");
      await loadVersions(selectedDocument.id);
    } catch (error) {
      notify.error("Erro ao restaurar versao");
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem("current_document_id");
    const effectiveId = documentId || (storedId ? Number(storedId) : null) || FALLBACK_DOCUMENTS[0].id;
    loadDocument(effectiveId);
    loadVersions(effectiveId);
  }, [documentId]);

  if (!selectedDocument) {
    return <GlobalLoader label="Carregando documento..." fullscreen />;
  }

  const content = normalizeContent(selectedDocument.content);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Documentos
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedDocument.name}</h1>
            <p className="text-gray-600">{selectedDocument.description}</p>
            {selectedDocument.lastModified && (
              <p className="text-xs text-gray-500">Atualizado: {new Date(selectedDocument.lastModified).toLocaleString()}</p>
            )}
            {selectedDocument.createdAt && (
              <p className="text-xs text-gray-500">Criado: {new Date(selectedDocument.createdAt).toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Versoes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loadingVersions && <GlobalLoader label="Carregando versoes..." />}
          {!loadingVersions && versions.length === 0 && <p className="text-sm text-gray-600">Nenhuma versao registrada.</p>}
          {versions.map((v) => (
            <div key={v.id || v.version} className="flex items-center justify-between p-2 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">Versao {v.version}</p>
                <p className="text-xs text-gray-500">{v.created_at || v.updated_at || ""}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleRestore(v.version)}>
                Restaurar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-semibold">{selectedDocument.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Tamanho</p>
                <p className="font-semibold">{selectedDocument.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Modificado</p>
                <p className="font-semibold">{selectedDocument.lastModified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Autor</p>
                <p className="font-semibold">{selectedDocument.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{content.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Principais Descobertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-blue-800">{finding}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estrutura do Documento</CardTitle>
          <CardDescription>Secoes e referencia rapida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.sections.map((section, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </div>
                <Badge variant="secondary">Paginas {section.pages}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        {saving && <GlobalLoader label="Salvando..." />}
        <DocumentEditor
          document={{
            title: selectedDocument.name,
            content,
            updatedAt: Date.now(),
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default DocumentDetailPage1;
