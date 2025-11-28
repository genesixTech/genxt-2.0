import { Clock3, Dot, User } from "lucide-react";

const ActivityList = ({ items = [], title = "Atividades recentes" }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <Clock3 className="w-4 h-4 text-gray-400" />
    </div>
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-gray-500">Nenhuma atividade registrada.</p>
      )}
      {items.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold">
            {activity.initials || "GX"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{activity.title}</span>
              <Dot className="w-4 h-4 text-gray-300" />
              <span className="text-xs text-gray-500">{activity.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600">{activity.description}</p>
            {activity.actor && (
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{activity.actor}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ActivityList;
