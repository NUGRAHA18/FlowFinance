import { Loader2 } from "lucide-react";

export default function LoadingButton({
  loading = false,
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base = "flex items-center justify-center gap-2 rounded-xl py-3 px-6 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-md",
    secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
    amber: "bg-amber-500 text-white hover:bg-amber-600 shadow-md",
    blue: "bg-blue-500 text-white hover:bg-blue-600 shadow-md",
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
