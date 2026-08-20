"use client";

import { I18nProvider } from "@/lib/i18n-context";
import { GuestProvider } from "@/lib/guest-context";
import Navbar from "@/components/Navbar";
import GuestNameModal from "@/components/GuestNameModal";
import { theme } from "@/config/theme";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <GuestProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer
          className="py-6 text-center text-sm"
          style={{
            backgroundColor: theme.colors.bgDark,
            color: theme.colors.textOnDark,
          }}
        >
          {theme.wedding.couple} · {theme.wedding.date}
        </footer>
        <GuestNameModal />
      </GuestProvider>
    </I18nProvider>
  );
}