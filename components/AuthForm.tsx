"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export function AuthForm({mode}:{mode:'login'|'register'}){
 const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');const data=Object.fromEntries(new FormData(e.currentTarget).entries());const r=await fetch(`/api/auth/${mode}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const j=await r.json().catch(()=>({}));setLoading(false);if(!r.ok){setError(j.error||'Wystąpił błąd');return;}router.push(j.redirect||'/konto');router.refresh();}
 return <form onSubmit={submit}>{mode==='register'&&<div className="field"><label>Imię i nazwisko</label><input className="input" name="name" required minLength={2}/></div>}<div className="field"><label>E-mail</label><input className="input" type="email" name="email" required/></div><div className="field"><label>Hasło</label><input className="input" type="password" name="password" required minLength={8}/></div>{error&&<div className="form-error">{error}</div>}<button disabled={loading} className="btn btn-primary">{loading?'Proszę czekać...':mode==='login'?'Zaloguj się':'Utwórz konto'}</button></form>
}
