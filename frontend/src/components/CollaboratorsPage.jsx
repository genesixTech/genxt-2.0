import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Users,
  UserPlus,
  Settings,
  Mail,
  Activity,
  Shield,
  Edit,
  Trash2,
  Clock,
  Crown,
  Eye,
} from "lucide-react";
import { collaboratorService } from "@/services/api";
import useWizardStore from "@/store/useWizardStore";
import GlobalLoader from "./GlobalLoader";
import { notify } from "./GlobalToast";

const fallbackCollaborators = [
  { id: "local-1", nome: "Colaborador Demo", email: "demo@genesix.local", role: "Product", status: "ativo", permissoes: { pode_editar_documentos: true, pode_convidar_colaboradores: true }, avatar: null },
];

const permissionList = [
  { key: "pode_editar_documentos", label: "Editar Docs" },
  { key: "pode_criar_documentos", label: "Criar Docs" },
  { key: "pode_excluir_documentos", label: "Excluir Docs" },
  { key: "pode_convidar_colaboradores", label: "Convidar" },
  { key: "pode_gerenciar_projeto", label: "Gerenciar Projeto" },
  { key: "pode_ver_analytics", label: "Ver Analytics" },
];

const CollaboratorsPage = () => {
  const { currentProjectId } = useWizardStore();
  const [collaborators, setCollaborators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissionsTarget, setPermissionsTarget] = useState(null);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "editor" });
  const [loading, setLoading] = useState(false);

  const loadCollaborators = async () => {
    if (!currentProjectId) {
      setCollaborators(fallbackCollaborators);
      return;
    }
    try {
      setLoading(true);
      const resp = await collaboratorService.getCollaborators(currentProjectId);
      const list = resp?.data?.collaborators || resp?.collaborators || [];
      setCollaborators(list.length ? list : fallbackCollaborators);
    } catch (error) {
      setCollaborators(fallbackCollaborators);
      notify.error("Nao foi possivel carregar colaboradores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollaborators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjectId]);

  const handleInvite = async () => {
    if (!inviteForm.email) return;
    try {
      setLoading(true);
      await collaboratorService.inviteCollaborator({
        project_id: currentProjectId,
        email: inviteForm.email,
        role: inviteForm.role,
      });
      notify.success("Convite enviado");
      setShowInviteModal(false);
      setInviteForm({ email: "", role: "editor" });
      loadCollaborators();
    } catch (error) {
      notify.error("Erro ao convidar colaborador");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (permKey) => {
    if (!permissionsTarget?.id || !currentProjectId) return;
    const perms = permissionsTarget.permissoes || {};
    const updated = { ...perms, [permKey]: !perms[permKey] };
    try {
      setLoading(true);
      await collaboratorService.updateCollaborator(permissionsTarget.id, {
        permissoes: updated,
      });
      notify.success("Permissoes atualizadas");
      setPermissionsTarget({ ...permissionsTarget, permissoes: updated });
      loadCollaborators();
    } catch (error) {
      notify.error("Erro ao atualizar permissoes");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (collabId) => {
    if (!collabId) return;
    try {
      setLoading(true);
      await collaboratorService.removeCollaborator(collabId);
      notify.success("Colaborador removido");
      setShowPermissionsModal(false);
      setSelected(null);
      loadCollaborators();
    } catch (error) {
      notify.error("Erro ao remover colaborador");
    } finally {
      setLoading(false);
    }
  };

  const totalCollaborators = collaborators.length;
  const onlineCollaborators = collaborators.filter((c) => c.status === "online" || c.status === "ativo").length;
  const adminCollaborators = collaborators.filter((c) => c.permissoes?.pode_gerenciar_projeto).length;

  const permissionBadges = (perms) =>
    permissionList.filter((p) => perms?.[p.key]).map((p) => p.label);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Colaboradores
          </h1>
          <p className="text-gray-600 mt-1">Gerencie sua equipe e convites do projeto</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Users className="w-4 h-4 mr-1" />
            {totalCollaborators} membros
          </Badge>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Convidar
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <GlobalLoader label="Sincronizando equipe..." />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{totalCollaborators}</p>
              <p className="text-sm text-blue-600">Total de Membros</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700">{onlineCollaborators}</p>
              <p className="text-sm text-green-600">Ativos/Online</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Crown className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-700">{adminCollaborators}</p>
              <p className="text-sm text-red-600">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-700">Pronto</p>
              <p className="text-sm text-purple-600">Permissoes ativas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map((collab) => {
          const initials = collab.nome
            ? collab.nome.split(" ").map((n) => n[0]).join("")
            : collab.email?.[0] || "?";
          const perms = permissionBadges(collab.permissoes);
          return (
            <Card
              key={collab.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-gray-200 hover:border-blue-300"
              onClick={() => setSelected(collab)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {collab.nome || collab.email}
                      </h3>
                      <p className="text-sm text-gray-600">{collab.role || "Colaborador"}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPermissionsTarget(collab);
                      setShowPermissionsModal(true);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Status: {collab.status || "ativo"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {perms.length === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Ver
                      </Badge>
                    )}
                    {perms.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Convidar Colaborador
            </DialogTitle>
            <DialogDescription>Envie um convite para um novo membro se juntar ao projeto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="colaborador@empresa.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Funcao</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value) => setInviteForm((f) => ({ ...f, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500" onClick={handleInvite}>
                Enviar Convite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gerenciar Permissoes
            </DialogTitle>
            <DialogDescription>
              {permissionsTarget && `Gerencie as permissoes de ${permissionsTarget.nome || permissionsTarget.email}`}
            </DialogDescription>
          </DialogHeader>
          {permissionsTarget && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {(permissionsTarget.nome || permissionsTarget.email || "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{permissionsTarget.nome || permissionsTarget.email}</p>
                  <p className="text-sm text-gray-600">{permissionsTarget.role || "Colaborador"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Permissoes</Label>
                <div className="flex flex-wrap gap-2">
                  {permissionList.map((perm) => {
                    const active = permissionsTarget.permissoes?.[perm.key];
                    return (
                      <Badge
                        key={perm.key}
                        variant={active ? "default" : "outline"}
                        className="text-xs cursor-pointer"
                        onClick={() => handlePermissionToggle(perm.key)}
                      >
                        {perm.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="destructive" onClick={() => handleRemove(permissionsTarget.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaboratorsPage;
