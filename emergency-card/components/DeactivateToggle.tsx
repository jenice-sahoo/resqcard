"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldOff, ShieldCheck, Loader2 } from "lucide-react";

export default function DeactivateToggle({ isActive }: { isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch("/api/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="card flex items-center justify-between gap-4">
      <div>
        <h3 className="font-medium text-ink">{isActive ? "Deactivate card" : "Reactivate card"}</h3>
        <p className="mt-1 text-sm text-muted">
          {isActive
            ? "Lost your card, or want to pause access? Scanning it will show a deactivated notice instead of your information."
            : "Your card is currently deactivated. Turn it back on to make your emergency view accessible again."}
        </p>
      </div>
      <button onClick={toggle} disabled={loading} className={isActive ? "btn-alert shrink-0" : "btn-primary shrink-0"}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : isActive ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
        {isActive ? "Deactivate" : "Reactivate"}
      </button>
    </div>
  );
}
