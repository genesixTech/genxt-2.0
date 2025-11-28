import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const GlobalModal = ({ open, title, description, onClose, children, actions }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar modal">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">{children}</div>

        {actions?.length > 0 && (
          <div className="mt-6 flex justify-end gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || "default"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default GlobalModal;
