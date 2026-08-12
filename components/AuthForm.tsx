"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
export function AuthForm({mode,locale='pl'}:{mode:'login'|'register';locale?:Locale}){
 const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter(); const en=locale==='en';
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');const data=Object.fromEntries(new FormData(e.currentTarget).entries());const r=await fetch(`/api/auth/${mode}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const j=await r.json().catch(()=>({}));setLoading(false);if(!r.ok){setError(j.error||(en?'Something went wrong':'Wystąpił błąd'));return;}router.push(j.redirect||'/konto');router.refresh();}
 return <form onSubmit={submit}>{mode==='register'&&<div className="field"><label>{en?'Full name':'Imię i nazwisko'}</label><input className="input" name="name" required minLength={2}/></div>}<div className="field"><label>E-mail</label><input className="input" type="email" name="email" required/></div><div className="field"><label>{en?'Password':'Hasło'}</label><input className="input" type="password" name="password" required minLength={8}/></div>{error&&<div className="form-error">{error}</div>}<button disabled={loading} className="btn btn-primary">{loading?(en?'Please wait...':'Proszę czekać...'):mode==='login'?(en?'Sign in':'Zaloguj się'):(en?'Create account':'Utwórz konto')}</button></form>
}
