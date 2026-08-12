import { cookies } from "next/headers";

export type Locale = "pl" | "en";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("coolcars_locale")?.value === "en" ? "en" : "pl";
}

export const localeTag = (locale: Locale) => locale === "en" ? "en-GB" : "pl-PL";
