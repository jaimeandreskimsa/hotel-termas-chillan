import { GuestProvider } from "@/components/GuestProvider";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <GuestProvider>{children}</GuestProvider>;
}
