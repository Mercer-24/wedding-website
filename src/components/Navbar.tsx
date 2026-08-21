"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { images } from "@/config/images";
import { locales, localeLabels } from "@/config/i18n";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/config/i18n";

export default function Navbar() {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/photo-challenge", label: t("nav.photoChallenge") },
    { href: "/schedule", label: t("nav.schedule") },
    { href: "/wedding-photos", label: t("nav.weddingPhotos") },
  ];

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: `${theme.colors.bgPrimary}ee`,
        borderColor: theme.colors.borderLight,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Couple Name */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold"
            style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
          >
            <Image
              src={images.logo}
              alt={theme.wedding.couple}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
            {theme.wedding.couple}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  color:
                    pathname === link.href
                      ? theme.colors.primary
                      : theme.colors.textSecondary,
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center gap-1 ml-4 border-l pl-4" style={{ borderColor: theme.colors.borderLight }}>
              {locales.map((loc: Locale) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className="px-2 py-1 text-xs rounded transition-colors"
                  style={{
                    backgroundColor: locale === loc ? theme.colors.primary : "transparent",
                    color: locale === loc ? theme.colors.textOnPrimary : theme.colors.textSecondary,
                  }}
                >
                  {localeLabels[loc]}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: theme.colors.textPrimary }}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t" style={{ borderColor: theme.colors.borderLight }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium"
                style={{
                  color:
                    pathname === link.href
                      ? theme.colors.primary
                      : theme.colors.textSecondary,
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1 mt-2 pt-2 border-t" style={{ borderColor: theme.colors.borderLight }}>
              {locales.map((loc: Locale) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 text-xs rounded"
                  style={{
                    backgroundColor: locale === loc ? theme.colors.primary : "transparent",
                    color: locale === loc ? theme.colors.textOnPrimary : theme.colors.textSecondary,
                  }}
                >
                  {localeLabels[loc]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}