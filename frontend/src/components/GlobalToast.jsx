import { Toaster, toast } from "sonner";

export const notify = {
  success: (message, options) => toast.success(message, options),
  info: (message, options) => toast.info(message, options),
  warning: (message, options) => toast.warning(message, options),
  error: (message, options) => toast.error(message, options),
};

const GlobalToast = () => (
  <Toaster
    position="top-right"
    richColors
    closeButton
    toastOptions={{
      style: {
        fontSize: "14px",
        padding: "12px 14px",
        borderRadius: "12px",
      },
    }}
  />
);

export default GlobalToast;
