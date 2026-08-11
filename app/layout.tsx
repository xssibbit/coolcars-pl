import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "CoolCars | Samochody używane", template: "%s | CoolCars" },
  description: "Sprawdzone samochody osobowe, dostawcze i ciężarowe. Przejrzyste ceny netto i brutto, finansowanie oraz szybki kontakt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl"><body><Header/><main>{children}</main><Footer/></body></html>;
}
