import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import QRCode from "@/components/QRCode";
import AccessLog from "@/components/AccessLog";
import { CheckCircle2, CircleAlert } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: info }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("emergency_information").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  let logs: any[] = [];
  if (profile) {
    const { data } = await supabase
      .from("access_logs")
      .select("id, accessed_at, access_type")
      .eq("profile_id", profile.id)
      .order("accessed_at", { ascending: false })
      .limit(5);
    logs = data ?? [];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const emergencyUrl = profile ? `${siteUrl}/emergency/${profile.public_id}` : "";

  const fieldsComplete = [
    profile?.blood_group,
    info?.allergies || info?.medications || info?.conditions,
    info?.emergency_contact_name,
  ].filter(Boolean).length;

  const firstName = (profile?.full_name || user.user_metadata?.full_name || "there").split(" ")[0];

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Good to see you, {firstName}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              {profile?.is_active ? (
                <>
                  <CheckCircle2 size={15} className="text-trust" /> Your card is active
                </>
              ) : (
                <>
                  <CircleAlert size={15} className="text-alert" /> Your card is deactivated
                </>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/profile" className="btn-outline">
              Edit profile
            </Link>
            <Link href="/qr" className="btn-primary">
              View my QR
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center gap-3 md:items-start">
            {profile ? (
              <QRCode url={emergencyUrl} size={190} />
            ) : (
              <div className="card flex h-[220px] w-[220px] items-center justify-center text-center text-sm text-muted">
                Complete your profile to generate a QR
              </div>
            )}
            <p className="text-xs text-muted">Scans open this card's public emergency view.</p>
          </div>

          <div className="card">
            <h2 className="font-display text-lg font-semibold text-ink">Emergency profile</h2>
            <p className="mt-1 text-sm text-muted">{fieldsComplete}/3 key sections filled in</p>
            <div className="mt-4 space-y-2.5 text-sm">
              <ProfileCheck label="Blood group" done={!!profile?.blood_group} />
              <ProfileCheck
                label="Allergies / medications / conditions"
                done={!!(info?.allergies || info?.medications || info?.conditions)}
              />
              <ProfileCheck label="Emergency contact" done={!!info?.emergency_contact_name} />
            </div>
            {fieldsComplete < 3 && (
              <Link href="/profile" className="mt-4 inline-block text-sm font-medium text-trust hover:underline">
                Finish setting up your card →
              </Link>
            )}
          </div>
        </div>

        <div className="card mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Recent access</h2>
            <Link href="/access-logs" className="text-sm font-medium text-trust hover:underline">
              View all
            </Link>
          </div>
          <AccessLog logs={logs} />
        </div>
      </div>
    </main>
  );
}

function ProfileCheck({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
          done ? "bg-trust text-white" : "border border-line text-transparent"
        }`}
      >
        ✓
      </span>
      <span className={done ? "text-ink" : "text-muted"}>{label}</span>
    </div>
  );
}
