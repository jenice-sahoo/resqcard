import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: info }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("emergency_information").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit your profile</h1>
        <p className="mt-1 text-sm text-muted">
          Only the fields under "Emergency information" are ever shown on your public card.
        </p>
        <div className="mt-8">
          <ProfileForm
            userId={user.id}
            initial={{
              fullName: profile?.full_name ?? (user.user_metadata?.full_name || ""),
              bloodGroup: profile?.blood_group ?? "",
              dateOfBirth: profile?.date_of_birth ?? "",
              allergies: info?.allergies ?? "",
              medications: info?.medications ?? "",
              conditions: info?.conditions ?? "",
              emergencyNotes: info?.emergency_notes ?? "",
              emergencyContactName: info?.emergency_contact_name ?? "",
              emergencyContactPhone: info?.emergency_contact_phone ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
