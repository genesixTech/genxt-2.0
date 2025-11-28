const GlobalLoader = ({ label = "Carregando...", fullscreen = false }) => {
  const content = (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/90 rounded-full shadow-lg border border-gray-100">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );

  if (!fullscreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      {content}
    </div>
  );
};

export default GlobalLoader;
