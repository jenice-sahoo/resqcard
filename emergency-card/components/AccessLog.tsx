import { Eye } from "lucide-react";

type Log = { id: string; accessed_at: string; access_type: string };

export default function AccessLog({ logs }: { logs: Log[] }) {
  if (logs.length === 0) {
    return (
      <p className="py-6 text-sm text-muted">
        No one has viewed your emergency card yet. Scans will show up here the moment they happen.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {logs.map((log) => (
        <li key={log.id} className="flex items-center gap-3 py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-trust-light text-trust-dark">
            <Eye size={15} />
          </span>
          <div>
            <p className="text-sm text-ink">Emergency view accessed</p>
            <p className="text-xs text-muted">
              {new Date(log.accessed_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
