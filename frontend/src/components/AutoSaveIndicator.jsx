const statusConfig = {
  idle: { text: "Pronto para salvar", color: "text-gray-500", dot: "bg-gray-300" },
  saving: { text: "Salvando...", color: "text-blue-600", dot: "bg-blue-500 animate-pulse" },
  saved: { text: "Salvo", color: "text-green-600", dot: "bg-green-500" },
  error: { text: "Erro ao salvar", color: "text-red-600", dot: "bg-red-500" },
};

const AutoSaveIndicator = ({ status = "idle", updatedAt }) => {
  const cfg = statusConfig[status] || statusConfig.idle;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 border border-gray-100">
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
      <span className={`text-xs font-medium ${cfg.color}`}>{cfg.text}</span>
      {updatedAt && (
        <span className="text-[11px] text-gray-500">
          {new Date(updatedAt).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
