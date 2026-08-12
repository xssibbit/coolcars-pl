import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { Icon } from "@/components/Icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const ORIGINAL_LOGO = "https://coolcars.pl/cdn/shop/files/cool-cars-logo.png?v=1751463577&width=380";

export async function Header() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const en = locale === "en";
  return <>
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-contact"><span>Tarczyn, Aleja Krakowska 7</span><a href="tel:+48884367888">+48 884 367 888</a></div>
        <div className="topbar-right"><span>{en ? "Vehicle sales · financing · export" : "Sprzedaż pojazdów · finansowanie · eksport"}</span><LanguageSwitcher locale={locale}/></div>
      </div>
    </div>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand brand-logo" href="/" aria-label="Cool Cars"><img src={ORIGINAL_LOGO} alt="COOL CARS" /></Link>
        <nav className="nav" aria-label={en ? "Main navigation" : "Główna nawigacja"}>
          <Link href="/samochody">{en ? "Vehicles" : "Samochody"}</Link>
          <Link href="/#kategorie">{en ? "Categories" : "Kategorie"}</Link>
          <Link href="/#dlaczego-my">{en ? "Why CoolCars" : "Dlaczego my"}</Link>
          <Link href="/#kontakt">{en ? "Contact" : "Kontakt"}</Link>
        </nav>
        <div className="header-actions">
          {user ? <>
            {user.role === "ADMIN" && <Link className="btn btn-ghost" href="/admin">{en ? "Admin" : "Panel admina"}</Link>}
            <Link className="btn btn-primary" href="/konto"><Icon name="user"/> {user.name.split(" ")[0]}</Link>
          </> : <>
            <Link className="btn btn-ghost" href="/login">{en ? "Sign in" : "Zaloguj się"}</Link>
            <Link className="btn btn-primary" href="/rejestracja"><Icon name="user"/> {en ? "Account" : "Konto"}</Link>
          </>}
        </div>
      </div>
    </header>
  </>;
}
