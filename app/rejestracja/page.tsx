import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { getLocale } from "@/lib/i18n";

type Search=Promise<Record<string,string|string[]|undefined>>;
const one=(v:string|string[]|undefined)=>Array.isArray(v)?v[0]:v;

export default async function Register({searchParams}:{searchParams:Search}){
  const [locale,sp]=await Promise.all([getLocale(),searchParams]); const en=locale==='en';const next=one(sp.next);
  const loginHref=next?`/login?next=${encodeURIComponent(next)}`:'/login';
  return <div className="auth-shell"><div className="auth-card"><span className="eyebrow">{en?'New account':'Nowe konto'}</span><h1>{en?'Save the vehicles you like':'Zapisuj oferty'}</h1><p>{en?'Create an account and keep interesting vehicles in one place.':'Utwórz konto i dodawaj interesujące samochody do swojej listy.'}</p><AuthForm mode="register" locale={locale} next={next}/><p style={{textAlign:'center',fontSize:14}}>{en?'Already have an account? ':'Masz już konto? '}<Link href={loginHref} style={{fontWeight:800,color:'#3158c9'}}>{en?'Sign in':'Zaloguj się'}</Link></p></div></div>;
}
