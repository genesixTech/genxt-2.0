import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AutoSaveIndicator from "./AutoSaveIndicator";
import { notify } from "./GlobalToast";

const initialSections = [
  { id: "summary", label: "Resumo executivo", placeholder: "Digite o resumo..." },
  { id: "problem", label: "Problema e contexto", placeholder: "Descreva o problema..." },
  { id: "solution", label: "Solucao proposta", placeholder: "Descreva a solucao..." },
  { id: "next", label: "Proximos passos", placeholder: "Liste os proximos passos..." },
];

const DocumentEditor = ({
  document,
  onChange,
  onSave,
  loading = false,
  sections = initialSections,
}) => {
  const [localDoc, setLocalDoc] = useState(
    document || { title: "", content: {}, updatedAt: Date.now() },
  );
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setLocalDoc(document || { title: "", content: {}, updatedAt: Date.now() });
  }, [document]);

  const handleFieldChange = (field, value) => {
    const updated = { ...localDoc, [field]: value, updatedAt: Date.now() };
    setLocalDoc(updated);
    onChange?.(updated);
    setStatus("saving");
  };

  const handleSectionChange = (sectionId, value) => {
    const updated = {
      ...localDoc,
      content: { ...(localDoc.content || {}), [sectionId]: value },
      updatedAt: Date.now(),
    };
    setLocalDoc(updated);
    onChange?.(updated);
    setStatus("saving");
  };

  const handleSave = async () => {
    try {
      setStatus("saving");
      await onSave?.(localDoc);
      setStatus("saved");
      notify.success("Documento salvo");
    } catch (error) {
      setStatus("error");
      notify.error(error?.message || "Erro ao salvar documento");
    }
  };

  useEffect(() => {
    if (status !== "saving") return;
    const timeout = setTimeout(() => {
      handleSave();
    }, 1200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            value={localDoc.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Nome do documento"
            className="text-lg font-semibold h-11"
            aria-label="Titulo do documento"
          />
        </div>
        <div className="flex items-center gap-2">
          <AutoSaveIndicator status={status} updatedAt={localDoc.updatedAt} />
          <Button onClick={handleSave} disabled={loading || status === "saving"}>
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900">{section.label}</h4>
              <span className="text-xs text-gray-400 uppercase">Secao</span>
            </div>
            <textarea
              className="w-full min-h-[120px] resize-y rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder={section.placeholder}
              value={localDoc.content?.[section.id] || ""}
              onChange={(e) => handleSectionChange(section.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentEditor;
