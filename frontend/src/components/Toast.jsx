import { useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

let toastId = 0;
let addToastFn = null;

export const toast = {
  success: (message) => addToastFn?.({ type: "success", message }),
  error: (message) => addToastFn?.({ type: "error", message }),
  info: (message) => addToastFn?.({ type: "info", message }),
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  addToastFn = ({ type, message }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  const config = {
    success: { bg: "bg-green-600 dark:bg-green-700", Icon: CheckCircle },
    error: { bg: "bg-red-600 dark:bg-red-700", Icon: XCircle },
    info: { bg: "bg-blue-600 dark:bg-blue-700", Icon: Info },
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3" aria-live="polite" role="status">
      {toasts.map((t) => {
        const { bg, Icon } = config[t.type] || config.info;
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-white shadow-lg animate-slide-in ${bg}`}
            style={{ minWidth: "280px", maxWidth: "420px" }}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 text-white/70 hover:text-white"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
