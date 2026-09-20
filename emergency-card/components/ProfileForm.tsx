"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

type Initial = {
  fullName: string;
  bloodGroup: string;
  dateOfBirth: string;
  allergies: string;
  medications: string;
  conditions: string;
  emergencyNotes: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

export default function ProfileForm({ userId, initial }: { userId: string; initial: Initial }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  function update<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        full_name: form.fullName,
        blood_group: form.bloodGroup || null,
        date_of_birth: form.dateOfBirth || null,
      },
      { onConflict: "user_id" }
    );

    const { error: infoError } = await supabase.from("emergency_information").upsert(
      {
        user_id: userId,
        allergies: form.allergies || null,
        medications: form.medications || null,
        conditions: form.conditions || null,
        emergency_notes: form.emergencyNotes || null,
        emergency_contact_name: form.emergencyContactName || null,
        emergency_contact_phone: form.emergencyContactPhone || null,
      },
      { onConflict: "user_id" }
    );

    setSaving(false);

    if (profileError || infoError) {
      setMessage((profileError || infoError)?.message ?? "Something went wrong. Try again.");
      return;
    }

    setMessage("Saved.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="card space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink">Identity</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Blood group</label>
            <select
              className="input"
              value={form.bloodGroup}
              onChange={(e) => update("bloodGroup", e.target.value)}
            >
              <option value="">Select</option>
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date of birth</label>
            <input
              type="date"
              className="input"
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink">
          Emergency information <span className="font-sans text-sm font-normal text-muted">— shown to anyone who scans your card</span>
        </h2>
        <div>
          <label className="label">Allergies</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Penicillin, peanuts..."
            value={form.allergies}
            onChange={(e) => update("allergies", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Current medications</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Metformin 500mg, twice daily"
            value={form.medications}
            onChange={(e) => update("medications", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Medical conditions</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Type 1 diabetes, asthma"
            value={form.conditions}
            onChange={(e) => update("conditions", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Notes for responders</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Anything else a first responder should know"
            value={form.emergencyNotes}
            onChange={(e) => update("emergencyNotes", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Emergency contact name</label>
            <input
              className="input"
              value={form.emergencyContactName}
              onChange={(e) => update("emergencyContactName", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Emergency contact phone</label>
            <input
              className="input"
              type="tel"
              value={form.emergencyContactPhone}
              onChange={(e) => update("emergencyContactPhone", e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 size={16} className="animate-spin" />}
          Save changes
        </button>
        {message && <p className="text-sm text-muted">{message}</p>}
      </div>
    </form>
  );
}
