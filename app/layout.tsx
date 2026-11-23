import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import "./globals.css";
import { getTheme } from "@/lib/supabase";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const sora = Sora({
  variable: "--font-body",
  subsets: ["latin"],
});

// The theme is read from Supabase per request, so nothing is prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lumière Glow Serum — Wake Up to Brighter, Glowing Skin",
  description:
    "A lightweight daily glow serum with Vitamin C, Hyaluronic Acid and Rosehip Oil. Launch price Rs 1,499 with Cash on Delivery.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The active theme is chosen in the admin panel and stored in Supabase,
  // so it is read fresh on every request.
  const theme = await getTheme();

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${fraunces.variable} ${sora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
