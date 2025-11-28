import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, FileText, Download, Eye, Share2, Clock, User, Activity, Shield, Star } from "lucide-react";
import DocumentEditor from "./DocumentEditor";
import { documentService } from "@/services/api";
import GlobalLoader from "./GlobalLoader";
import { notify } from "./GlobalToast";

const FALLBACK_DOCUMENT = {
  id: 1,
  name: "Relatorio de Lancamento",
  type: "PDF",
  size: "1.7 MB",
  lastModified: "1 dia atras",
  author: "Bruna Alves",
  description: "Relatorio final de go-to-market e lancamento.",
  content: {
    summary: "Resumo do plano de lancamento, canais e KPIs.",
    keyFindings: ["Canais organicos + pago", "Metas de conversao", "Checklist de readiness"],
    sections: [
      { title: "Estrategia", pages: "1-3" },
      { title: "Canais", pages: "4-5" },
      { title: "KPIs", pages: "6-7" },
    ],
  },
};

const normalizeContent = (payload = {}) => ({
  summary: payload.summary || "",
  keyFindings: payload.keyFindings || [],
  sections: payload.sections || [],
});

const DocumentDetailPage3 = ({ onBack, documentId }) => {
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
      const resp = await documentService.getDocumentVersions(id);
      const list = resp?.data?.versions || resp?.versions || [];
      setVersions(list);
    } catch (error) {
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  };

  const loadDocument = async (id) => {
    const localDoc = FALLBACK_DOCUMENT;
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
      // fallback
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
    const effectiveId = documentId || (storedId ? Number(storedId) : null) || FALLBACK_DOCUMENT.id;
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-semibold">{selectedDocument.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge>Rascunho</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Ultima atualizacao</p>
                <p className="font-semibold">{selectedDocument.lastModified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Metricas</CardTitle>
            <CardDescription>Indicadores do documento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <p className="text-sm">Versoes: {versions.length || 1}</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <p className="text-sm">Revisao de compliance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autores e revisores</CardTitle>
            <CardDescription>Principais contribuidores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <p className="text-sm">{selectedDocument.author}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <p className="text-sm">Avaliacao: 4.9/5</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentDetailPage3;
