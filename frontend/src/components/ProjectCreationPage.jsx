import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ActivityList from "./ActivityList";
import GlobalModal from "./GlobalModal";
import { projectService } from "@/services/api";
import useWizardStore from "@/store/useWizardStore";
import { notify } from "./GlobalToast";

const ProjectCreationPage = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: "",
    goal: "",
    industry: "saas",
    visibility: "private",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const { setProject, fetchSteps } = useWizardStore();
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    setOpenConfirm(true);
  };

  const startWizard = async () => {
    try {
      setLoading(true);
      // cria projeto real
      const response = await projectService.createProject({
        nome: form.name,
        descricao: form.goal,
      });
      const projectId = response?.data?.project?.id || response?.project?.id;
      if (projectId) {
        setProject(projectId);
        await fetchSteps(projectId);
      }
      notify.success("Projeto criado. Iniciando wizard.");
      onNavigate?.("contexto-problema");
    } catch (error) {
      notify.error("Nao foi possivel criar o projeto. Use wizard demo.");
      onNavigate?.("contexto-problema");
    } finally {
      setLoading(false);
      setOpenConfirm(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Novo projeto</p>
          <h2 className="text-2xl font-bold text-gray-900">Crie um projeto com IA</h2>
          <p className="text-sm text-gray-600">O assistente guiará você pelas 13 etapas do wizard.</p>
        </div>
        <Button onClick={handleCreate} disabled={!form.name}>
          Iniciar wizard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome do projeto</label>
              <Input
                className="mt-2"
                placeholder="Ex: Plataforma GenesiX AI"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Industria</label>
              <Select value={form.industry} onValueChange={(v) => handleChange("industry", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="health">Saude</SelectItem>
                  <SelectItem value="education">Educacao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Objetivo</label>
            <Input
              className="mt-2"
              placeholder="Ex: Validar proposta de valor e features MVP"
              value={form.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Visibilidade</label>
            <Select value={form.visibility} onValueChange={(v) => handleChange("visibility", v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privado</SelectItem>
                <SelectItem value="team">Time</SelectItem>
                <SelectItem value="public">Publico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate?.("dashboard")}>
              Voltar
            </Button>
            <Button onClick={handleCreate} disabled={!form.name || loading}>
              {loading ? "Criando..." : "Continuar"}
            </Button>
          </div>
        </div>
        <ActivityList
          title="Checklist de criação"
          items={[
            { id: "c1", title: "Definir nome", description: "Escolha um nome claro para o time.", timestamp: "Agora", actor: "Você" },
            { id: "c2", title: "Selecionar industria", description: "Isso impacta sugestões de IA.", timestamp: "Agora", actor: "IA" },
            { id: "c3", title: "Confirmar visibilidade", description: "Controle quem verá o projeto.", timestamp: "Agora", actor: "Sistema" },
          ]}
        />
      </div>

      <GlobalModal
        open={openConfirm}
        title="Pronto para iniciar o wizard?"
        description="Vamos criar a estrutura e levar você para a Etapa 1."
        onClose={() => setOpenConfirm(false)}
        actions={[
          { label: "Cancelar", variant: "outline", onClick: () => setOpenConfirm(false) },
          { label: "Comecar", onClick: startWizard },
        ]}
      >
        <p className="text-sm text-gray-700">
          Um ID de projeto será gerado e você poderá retomar o fluxo a qualquer momento.
        </p>
      </GlobalModal>
    </div>
  );
};

export default ProjectCreationPage;
