import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import DeactivateToggle from "@/components/DeactivateToggle";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account and your card's availability.</p>

        <div className="mt-6 space-y-4">
          <DeactivateToggle isActive={profile?.is_active ?? true} />

          <div className="card">
            <h3 className="font-medium text-ink">Account</h3>
            <p className="mt-1 text-sm text-muted">Signed in as {user.email}</p>
          </div>

          <div className="card border-dashed">
            <h3 className="font-medium text-ink">Coming next</h3>
            <p className="mt-1 text-sm text-muted">
              Family &amp; caregiver access, multilingual cards, and NFC support are on the
              roadmap — see the project README for the full plan.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
