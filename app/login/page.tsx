import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { getLocale } from "@/lib/i18n";

type Search=Promise<Record<string,string|string[]|undefined>>;
const one=(v:string|string[]|undefined)=>Array.isArray(v)?v[0]:v;

export default async function Login({searchParams}:{searchParams:Search}) {
  const [locale,sp]=await Promise.all([getLocale(),searchParams]); const en = locale === "en";const next=one(sp.next);
  const registerHref=next?`/rejestracja?next=${encodeURIComponent(next)}`:'/rejestracja';
  return <div className="auth-shell"><div className="auth-card"><span className="eyebrow">{en ? "Customer account" : "Konto klienta"}</span><h1>{en ? "Welcome back" : "Witaj ponownie"}</h1><p>{en ? "Sign in to save vehicles and return to the offers that interest you." : "Zaloguj się, aby zapisywać pojazdy i wracać do interesujących ofert."}</p><AuthForm mode="login" locale={locale} next={next}/><p style={{ textAlign: "center", fontSize: 14 }}>{en ? "No account yet? " : "Nie masz konta? "}<Link href={registerHref} style={{ fontWeight: 800, color: "#3158c9" }}>{en ? "Create one" : "Zarejestruj się"}</Link></p></div></div>;
}
