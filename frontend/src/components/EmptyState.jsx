import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Belum ada data",
  description = "Mulai dengan menambahkan data pertamamu.",
  actionLabel,
  actionLink,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-gray-700">
        <Icon className="h-8 w-8 text-primary-400 dark:text-primary-300" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
