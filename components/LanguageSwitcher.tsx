"use client";

import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `coolcars_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return <div className="language-switch" aria-label="Language selector">
    <button type="button" className={locale === "pl" ? "active" : ""} onClick={() => setLocale("pl")} aria-pressed={locale === "pl"}>PL</button>
    <span>/</span>
    <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
  </div>;
}
