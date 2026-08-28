import type { Metadata } from "next";
import Dashboard from "./dashboard";

export const metadata: Metadata = {
  title: "PoloACT Growth",
  robots: { index: false, follow: false },
};

export default function GrowthPage() {
  return (
    <main className="gx-page">
      <Dashboard />
    </main>
  );
}
