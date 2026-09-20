import { createClient } from "@/lib/supabase-server";
import EmergencyCard from "@/components/EmergencyCard";
import { ShieldOff, Phone, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmergencyViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, blood_group, is_active")
    .eq("public_id", params.id)
    .maybeSingle();

  if (!profile) {
    return (
      <Notice
        title="Card not found"
        body="This ResQCard link doesn't match an active profile. Double-check the QR code or link."
      />
    );
  }

  if (!profile.is_active) {
    return (
      <Notice
        title="This ResQCard has been deactivated"
        body="The owner has turned off public access to this card, most likely because it was lost or replaced."
        icon={<ShieldOff size={28} className="text-alert" />}
      />
    );
  }

  const { data: info } = await supabase
    .from("emergency_information")
    .select("allergies, medications, conditions, emergency_contact_name, emergency_contact_phone")
    .eq("user_id", profile.user_id)
    .maybeSingle();

  // Log this view. Fire-and-forget: a logging failure should never block
  // someone from seeing emergency information.
  await supabase.from("access_logs").insert({ profile_id: profile.id, access_type: "emergency_view" });

  return (
    <main className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-md">
        <p className="mb-4 text-center font-display text-sm font-semibold uppercase tracking-wide text-alert-dark">
          🚨 Emergency information
        </p>

        <EmergencyCard
          fullName={profile.full_name}
          bloodGroup={profile.blood_group}
          allergies={info?.allergies}
          medications={info?.medications}
          conditions={info?.conditions}
          emergencyContactName={info?.emergency_contact_name}
          emergencyContactPhone={info?.emergency_contact_phone}
        />

        {info?.emergency_contact_phone && (
          <a href={`tel:${info.emergency_contact_phone}`} className="btn-primary mt-4 w-full py-3 text-base">
            <Phone size={18} />
            Call emergency contact
          </a>
        )}

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Info size={14} className="mt-0.5 shrink-0" />
          Information provided by the card owner. Verify with healthcare professionals where
          appropriate. This access has been logged for the owner's security.
        </p>
      </div>
    </main>
  );
}

function Notice({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="max-w-sm text-center">
        {icon}
        <h1 className="mt-3 font-display text-xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">{body}</p>
      </div>
    </main>
  );
}
