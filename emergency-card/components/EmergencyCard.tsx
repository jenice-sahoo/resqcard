import { Droplet, ShieldAlert, Pill, Stethoscope, Phone } from "lucide-react";

type Props = {
  fullName: string;
  bloodGroup?: string | null;
  allergies?: string | null;
  medications?: string | null;
  conditions?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
};

function Row({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex gap-3 border-b border-line py-3.5 last:border-0">
      <Icon size={18} className="mt-0.5 shrink-0 text-alert-dark" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 text-[15px] text-ink">{value?.trim() || "Not provided"}</p>
      </div>
    </div>
  );
}

export default function EmergencyCard({
  fullName,
  bloodGroup,
  allergies,
  medications,
  conditions,
  emergencyContactName,
  emergencyContactPhone,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="bg-alert px-6 py-4 text-white">
        <p className="text-xs font-medium uppercase tracking-wide text-alert-light">Emergency information</p>
        <p className="font-display text-xl font-semibold">{fullName}</p>
      </div>
      <div className="px-6">
        <Row icon={Droplet} label="Blood group" value={bloodGroup} />
        <Row icon={ShieldAlert} label="Allergies" value={allergies} />
        <Row icon={Pill} label="Medications" value={medications} />
        <Row icon={Stethoscope} label="Medical conditions" value={conditions} />
        <Row
          icon={Phone}
          label="Emergency contact"
          value={
            emergencyContactName
              ? `${emergencyContactName}${emergencyContactPhone ? " — " + emergencyContactPhone : ""}`
              : null
          }
        />
      </div>
    </div>
  );
}
