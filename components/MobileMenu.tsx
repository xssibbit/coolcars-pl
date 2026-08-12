"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const close = () => setOpen(false);

  const drawer = open ? <div className="mobile-menu-layer">
    <button
      className="mobile-menu-backdrop"
      type="button"
      aria-label={en ? "Close menu" : "Zamknij menu"}
      onClick={close}
    />
    <aside
      className="mobile-menu-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={en ? "Mobile navigation" : "Nawigacja mobilna"}
    >
      <div className="mobile-menu-drawer-head">
        <strong>COOL CARS</strong>
        <button
          ref={closeButtonRef}
          type="button"
          className="mobile-menu-close"
          onClick={close}
          aria-label={en ? "Close menu" : "Zamknij menu"}
        >×</button>
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

      <a className="mobile-menu-phone" href="tel:+48884367888" onClick={close}>+48 884 367 888</a>
    </aside>
  </div> : null;

  return <div className="mobile-menu-root">
    <button
      className={`mobile-menu-toggle ${open ? "active" : ""}`}
      type="button"
      aria-label={open ? (en ? "Close menu" : "Zamknij menu") : (en ? "Open menu" : "Otwórz menu")}
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
    >
      <span />
      <span />
      <span />
    </button>
    {mounted && drawer ? createPortal(drawer, document.body) : null}
  </div>;
}
