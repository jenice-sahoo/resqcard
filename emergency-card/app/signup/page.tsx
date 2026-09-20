"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Create the profile row right away so the card exists even before the
    // user finishes verifying their email (Supabase can be configured either way).
    if (data.user) {
      await supabase.from("profiles").upsert(
        { user_id: data.user.id, full_name: fullName },
        { onConflict: "user_id" }
      );
    }

    setLoading(false);

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Check your email</h1>
          <p className="mt-2 text-sm text-muted">
            We sent a confirmation link to {email}. Verify it, then log in to set up your card.
          </p>
          <Link href="/login" className="btn-primary mt-6 inline-flex">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg font-semibold text-ink">
          ResQCard
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Create your ResQCard</h1>
        <p className="mt-1 text-sm text-muted">Takes under a minute to set up.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input required className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-alert-dark">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have a card?{" "}
          <Link href="/login" className="font-medium text-trust hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
