import type { Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const viewport: Viewport = {
  themeColor: "#1B4332",
  width: "device-width",
  initialScale: 1,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
