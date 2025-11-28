import { create } from "zustand";
import { projectService } from "@/services/api";
import { notify } from "@/components/GlobalToast";

const initialState = {
  currentProjectId: null,
  steps: [],
  loading: false,
  savingStepId: null,
  error: null,
};

export const useWizardStore = create((set, get) => ({
  ...initialState,

  setProject(projectId) {
    set({ currentProjectId: projectId });
  },

  async fetchSteps(projectId) {
    try {
      set({ loading: true, error: null });
      const response = await projectService.getProjectSteps(projectId);
      const steps = response?.data?.steps || response?.steps || [];
      set({ steps, currentProjectId: projectId });
    } catch (error) {
      set({ error: error.message || "Erro ao carregar etapas" });
      notify.error("Erro ao carregar etapas do projeto");
    } finally {
      set({ loading: false });
    }
  },

  async saveStep(stepId, payload) {
    const projectId = get().currentProjectId;
    if (!projectId || !stepId) return;
    try {
      set({ savingStepId: stepId, error: null });
      const response = await projectService.saveProjectStep(projectId, stepId, payload);
      const updated = response?.data?.step || response?.step;
      if (updated) {
        set((state) => ({
          steps: state.steps.map((s) => (s.id === stepId ? { ...s, ...updated } : s)),
        }));
      }
      notify.success("Etapa salva");
    } catch (error) {
      set({ error: error.message || "Erro ao salvar etapa" });
      notify.error("Erro ao salvar etapa");
    } finally {
      set({ savingStepId: null });
    }
  },

  reset() {
    set(initialState);
  },
}));

export default useWizardStore;
