import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Icon } from "@/components/Icons";

const ORIGINAL_LOGO = "https://coolcars.pl/cdn/shop/files/cool-cars-logo.png?v=1751463577&width=380";

export async function Header() {
  const user = await getCurrentUser();
  return <header className="site-header">
    <div className="container header-inner">
      <Link className="brand brand-logo" href="/" aria-label="Cool Cars">
        <img src={ORIGINAL_LOGO} alt="COOL CARS" />
      </Link>
      <nav className="nav" aria-label="Główna nawigacja">
        <Link href="/samochody">Samochody</Link>
        <Link href="/#kategorie">Kategorie</Link>
        <Link href="/#dlaczego-my">Dlaczego my</Link>
        <Link href="/#kontakt">Kontakt</Link>
      </nav>
      <div className="header-actions">
        {user ? <>
          {user.role === "ADMIN" && <Link className="btn btn-ghost" href="/admin">Panel admina</Link>}
          <Link className="btn btn-primary" href="/konto"><Icon name="user"/> {user.name.split(" ")[0]}</Link>
        </> : <>
          <Link className="btn btn-ghost" href="/login">Zaloguj się</Link>
          <Link className="btn btn-primary" href="/rejestracja"><Icon name="user"/> Konto</Link>
        </>}
      </div>
    </div>
  </header>
}
