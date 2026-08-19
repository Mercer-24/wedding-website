import type { Metadata } from "next";
import { theme } from "@/config/theme";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: `${theme.wedding.couple} — Wedding`,
  description: "Wedding website with photo challenges",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <head>
        <style>{`
          :root {
            --color-primary: ${theme.colors.primary};
            --color-primary-light: ${theme.colors.primaryLight};
            --color-primary-dark: ${theme.colors.primaryDark};
            --color-accent: ${theme.colors.accent};
            --color-accent-light: ${theme.colors.accentLight};
            --color-bg-primary: ${theme.colors.bgPrimary};
            --color-bg-secondary: ${theme.colors.bgSecondary};
            --color-bg-dark: ${theme.colors.bgDark};
            --color-text-primary: ${theme.colors.textPrimary};
            --color-text-secondary: ${theme.colors.textSecondary};
            --color-text-on-primary: ${theme.colors.textOnPrimary};
            --color-text-on-dark: ${theme.colors.textOnDark};
            --color-border: ${theme.colors.border};
            --color-border-light: ${theme.colors.borderLight};
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: theme.colors.bgPrimary, color: theme.colors.textPrimary }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}