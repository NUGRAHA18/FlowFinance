import { useEffect, useState } from "react";

let toastId = 0;
let addToastFn = null;

// Fungsi global untuk trigger toast dari mana saja
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

  const getStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
        return "bg-blue-600";
      default:
        return "bg-gray-800";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "\u2713";
      case "error":
        return "\u2717";
      case "info":
        return "i";
      default:
        return "";
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-white shadow-lg animate-slide-in ${getStyle(t.type)}`}
          style={{ minWidth: "300px", maxWidth: "450px" }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            {getIcon(t.type)}
          </span>
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-2 text-white/70 hover:text-white text-lg leading-none"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
