"use client";

import { I18nProvider } from "@/lib/i18n-context";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
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
    </I18nProvider>
  );
}

// Need to import theme for the footer
import { theme } from "@/config/theme";