import { GuestProvider } from "@/components/GuestProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import PageTransition from "@/components/PageTransition";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <GuestProvider>
        <PageTransition>{children}</PageTransition>
      </GuestProvider>
    </LanguageProvider>
  );
}
