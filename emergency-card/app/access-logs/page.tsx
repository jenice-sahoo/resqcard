import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import AccessLog from "@/components/AccessLog";

export default async function AccessLogsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let logs: any[] = [];
  if (profile) {
    const { data } = await supabase
      .from("access_logs")
      .select("id, accessed_at, access_type")
      .eq("profile_id", profile.id)
      .order("accessed_at", { ascending: false })
      .limit(100);
    logs = data ?? [];
  }

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Access log</h1>
        <p className="mt-1 text-sm text-muted">
          Every time your emergency card is opened, it shows up here — that's your accountability
          trail.
        </p>
        <div className="card mt-6">
          <AccessLog logs={logs} />
        </div>
      </div>
    </main>
  );
}
