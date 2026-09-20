import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResQCard — Your critical health information, when every second matters",
  description:
    "A privacy-first emergency health profile. Scan the card, see only what's needed to help.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
