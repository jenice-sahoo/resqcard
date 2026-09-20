import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import QRCode from "@/components/QRCode";
import { Printer } from "lucide-react";

export default async function QrPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("public_id, full_name, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/profile");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const emergencyUrl = `${siteUrl}/emergency/${profile.public_id}`;

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto max-w-xl px-6 py-10 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Your ResQCard</h1>
        <p className="mt-1 text-sm text-muted">
          Print this, save it to your phone's wallpaper, or put it on a keychain.
        </p>

        {!profile.is_active && (
          <p className="mt-4 rounded border border-alert/30 bg-alert-light px-4 py-2 text-sm text-alert-dark">
            This card is currently deactivated — scanning it will show a deactivated notice.
            Reactivate it from Settings.
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <QRCode url={emergencyUrl} size={260} />
        </div>

        <p className="mt-4 break-all font-mono text-xs text-muted">{emergencyUrl}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-outline">
            <Printer size={16} /> Print card
          </button>
          <Link href={emergencyUrl} target="_blank" className="btn-primary">
            Preview emergency view
          </Link>
        </div>
      </div>
    </main>
  );
}
