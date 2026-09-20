"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LayoutGrid, UserRound, QrCode, History, Settings, LogOut } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/qr", label: "My QR", icon: QrCode },
  { href: "/access-logs", label: "Access log", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-display text-lg font-semibold text-ink">
          ResQCard
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded px-3 py-2 text-sm transition-colors ${
                  active ? "bg-trust-light text-trust-dark" : "text-muted hover:text-ink"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleSignOut} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  );
}
