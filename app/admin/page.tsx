import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin — Lumière Glow Serum",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <div className="container">
        <AdminPanel />
      </div>
    </main>
  );
}
