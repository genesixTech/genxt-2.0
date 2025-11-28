import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ShieldCheck, Plus } from "lucide-react";
import { useState } from "react";
import ActivityList from "./ActivityList";

const membersSeed = [
  { id: "m1", name: "Alice", role: "Owner", permission: "Admin" },
  { id: "m2", name: "Bruno", role: "PM", permission: "Editor" },
  { id: "m3", name: "Carla", role: "Designer", permission: "Viewer" },
];

const WorkspaceManagementPage = () => {
  const [members, setMembers] = useState(membersSeed);
  const [invite, setInvite] = useState("");

  const handleInvite = () => {
    if (!invite) return;
    setMembers((prev) => [...prev, { id: invite, name: invite, role: "Convidado", permission: "Viewer" }]);
    setInvite("");
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Workspace</p>
          <h2 className="text-2xl font-bold text-gray-900">Gestão do workspace</h2>
          <p className="text-sm text-gray-600">Controle equipes, permissões e governança.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <ShieldCheck className="w-4 h-4" />
          Políticas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <h3 className="text-base font-semibold text-gray-900">Membros</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                placeholder="email@empresa.com"
                className="w-56"
              />
              <Button onClick={handleInvite} className="gap-1">
                <Plus className="w-4 h-4" />
                Convidar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {member.permission}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ActivityList
          title="Movimentações"
          items={[
            { id: "w1", title: "Permissão alterada", description: "Bruno virou editor", timestamp: "Hoje", actor: "Alice" },
            { id: "w2", title: "Convite enviado", description: "carla@empresa.com", timestamp: "Ontem", actor: "Sistema" },
          ]}
        />
      </div>
    </div>
  );
};

export default WorkspaceManagementPage;
