import Link from "next/link";
import { ShieldCheck, Zap, Lock, ScanLine } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg font-semibold text-ink">ResQCard</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted hover:text-ink">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-muted">
          <ScanLine size={14} className="text-alert" />
          Scan → information, immediately
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Your critical health information, available when it matters most.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          One QR code. No app to install, no account to create. A first responder scans your
          ResQCard and sees exactly what they need — nothing more.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">
            Create your ResQCard
          </Link>
          <Link href="/login" className="btn-outline px-6 py-3 text-base">
            I already have one
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 sm:grid-cols-3">
          <div>
            <Lock className="mb-3 text-trust" size={22} />
            <h3 className="font-medium text-ink">Privacy by design</h3>
            <p className="mt-1.5 text-sm text-muted">
              Your QR points to a secure profile — it never carries your medical data itself.
              Update it any time without printing a new card.
            </p>
          </div>
          <div>
            <Zap className="mb-3 text-trust" size={22} />
            <h3 className="font-medium text-ink">Instant emergency view</h3>
            <p className="mt-1.5 text-sm text-muted">
              Allergies, medications, conditions, and an emergency contact — visible in one scan,
              with no login required.
            </p>
          </div>
          <div>
            <ShieldCheck className="mb-3 text-trust" size={22} />
            <h3 className="font-medium text-ink">Every access logged</h3>
            <p className="mt-1.5 text-sm text-muted">
              You'll always know when your card was viewed. Deactivate it in one tap if it's ever
              lost.
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs text-muted">
        Secure · Fast · Accessible — built for the moments that can't wait.
      </footer>
    </main>
  );
}
