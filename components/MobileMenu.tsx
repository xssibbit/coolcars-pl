"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function MobileMenu({
  en,
  loggedIn,
  isAdmin,
  userName,
}: {
  en: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
  userName?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return <div className="mobile-menu-root">
    <button
      className={`mobile-menu-toggle ${open ? "active" : ""}`}
      type="button"
      aria-label={en ? "Open menu" : "Otwórz menu"}
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
    >
      <span />
      <span />
      <span />
    </button>

    {open && <div className="mobile-menu-layer">
      <button className="mobile-menu-backdrop" type="button" aria-label={en ? "Close menu" : "Zamknij menu"} onClick={close} />
      <aside className="mobile-menu-drawer" aria-label={en ? "Mobile navigation" : "Nawigacja mobilna"}>
        <div className="mobile-menu-drawer-head">
          <strong>COOL CARS</strong>
          <button type="button" className="mobile-menu-close" onClick={close} aria-label={en ? "Close menu" : "Zamknij menu"}>×</button>
        </div>
        <nav className="mobile-menu-links">
          <Link onClick={close} href="/samochody">{en ? "Vehicles" : "Samochody"}<span>›</span></Link>
          <Link onClick={close} href="/#kategorie">{en ? "Categories" : "Kategorie"}<span>›</span></Link>
          <Link onClick={close} href="/#dlaczego-my">{en ? "Why CoolCars" : "Dlaczego my"}<span>›</span></Link>
          <Link onClick={close} href="/#kontakt">{en ? "Contact" : "Kontakt"}<span>›</span></Link>
        </nav>
        <div className="mobile-menu-account">
          {loggedIn ? <>
            {isAdmin && <Link onClick={close} className="btn btn-ghost" href="/admin">{en ? "Admin panel" : "Panel admina"}</Link>}
            <Link onClick={close} className="btn btn-primary" href="/konto">{userName || (en ? "My account" : "Moje konto")}</Link>
          </> : <>
            <Link onClick={close} className="btn btn-ghost" href="/login">{en ? "Sign in" : "Zaloguj się"}</Link>
            <Link onClick={close} className="btn btn-primary" href="/rejestracja">{en ? "Create account" : "Załóż konto"}</Link>
          </>}
        </div>
        <a className="mobile-menu-phone" href="tel:+48884367888">+48 884 367 888</a>
      </aside>
    </div>}
  </div>;
}
