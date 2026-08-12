import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { getLocale } from "@/lib/i18n";

export default async function Login() {
  const locale = await getLocale(); const en = locale === "en";
  return <div className="auth-shell"><div className="auth-card"><span className="eyebrow">{en ? "Customer account" : "Konto klienta"}</span><h1>{en ? "Welcome back" : "Witaj ponownie"}</h1><p>{en ? "Sign in to save vehicles and return to the offers that interest you." : "Zaloguj się, aby zapisywać pojazdy i wracać do interesujących ofert."}</p><AuthForm mode="login" locale={locale}/><p style={{ textAlign: "center", fontSize: 14 }}>{en ? "No account yet? " : "Nie masz konta? "}<Link href="/rejestracja" style={{ fontWeight: 800, color: "#3158c9" }}>{en ? "Create one" : "Zarejestruj się"}</Link></p></div></div>;
}
