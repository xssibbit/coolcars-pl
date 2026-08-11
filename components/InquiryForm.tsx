"use client";
import { FormEvent, useState } from "react";
export function InquiryForm({ vehicleId, defaultName='', defaultEmail='' }: { vehicleId:string; defaultName?:string; defaultEmail?:string }) {
  const [state,setState]=useState<'idle'|'sending'|'ok'|'error'>('idle');
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setState('sending');const form=new FormData(e.currentTarget);const payload=Object.fromEntries(form.entries());const r=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,vehicleId})});setState(r.ok?'ok':'error'); if(r.ok)e.currentTarget.reset();}
  return <form onSubmit={submit}>
    <div className="field"><label>Imię i nazwisko</label><input required className="input" name="name" defaultValue={defaultName}/></div>
    <div className="field"><label>E-mail</label><input required type="email" className="input" name="email" defaultValue={defaultEmail}/></div>
    <div className="field"><label>Telefon</label><input className="input" name="phone" placeholder="+48 ..."/></div>
    <div className="field"><label>Wiadomość</label><textarea required className="textarea" name="message" defaultValue="Proszę o kontakt w sprawie tego pojazdu."/></div>
    <button disabled={state==='sending'} className="btn btn-accent" style={{width:'100%'}}>{state==='sending'?'Wysyłanie...':'Zapytaj o samochód'}</button>
    {state==='ok'&&<div className="form-success">Dziękujemy. Zapytanie zostało zapisane.</div>}{state==='error'&&<div className="form-error">Nie udało się wysłać formularza.</div>}
  </form>
}
