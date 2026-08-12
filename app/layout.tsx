import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return locale === "en" ? {
    title: { default: "CoolCars | Used vehicles", template: "%s | CoolCars" },
    description: "Passenger, commercial and heavy vehicles with transparent net and gross pricing, financing and fast contact.",
  } : {
    title: { default: "CoolCars | Samochody używane", template: "%s | CoolCars" },
    description: "Sprawdzone samochody osobowe, dostawcze i ciężarowe. Przejrzyste ceny netto i brutto, finansowanie oraz szybki kontakt.",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return <html lang={locale}><body><Header/><main>{children}</main><Footer/></body></html>;
}
