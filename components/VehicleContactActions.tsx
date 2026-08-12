"use client";

import { FormEvent, useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import { getAttribution, trackVehicleEvent } from "@/lib/analytics-client";
import type { Locale } from "@/lib/i18n";

export function VehicleContactActions({vehicleId,title,stockNumber,defaultName="",locale="pl",compact=false}:{vehicleId:string;title:string;stockNumber:string;defaultName?:string;locale?:Locale;compact?:boolean}){
  const en=locale==="en";const [callback,setCallback]=useState(false);const [sent,setSent]=useState(false);const [sending,setSending]=useState(false);const [shareState,setShareState]=useState<"idle"|"copied">("idle");
  const message=en?`Hello, I am interested in ${title}, stock ${stockNumber}.`:`Dzień dobry, interesuje mnie ${title}, nr oferty ${stockNumber}.`;
  const whatsapp=`https://wa.me/48884367888?text=${encodeURIComponent(message)}`;

  useEffect(()=>{if(!callback)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setCallback(false)};window.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",key)}},[callback]);

  async function share(){
    const data={title,text:message,url:window.location.href};
    try{
      if(navigator.share){await navigator.share(data);trackVehicleEvent("SHARE",vehicleId);return;}
      await navigator.clipboard.writeText(window.location.href);setShareState("copied");trackVehicleEvent("SHARE",vehicleId);setTimeout(()=>setShareState("idle"),1800);
    }catch{}
  }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setSending(true);const form=new FormData(e.currentTarget);const name=String(form.get("name")||"").trim(),phone=String(form.get("phone")||"").trim();
    const res=await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vehicleId,name,phone,email:null,message:en?"Please call me back about this vehicle.":"Prośba o telefon zwrotny w sprawie pojazdu.",...getAttribution()})}).catch(()=>null);
    setSending(false);if(res?.ok){trackVehicleEvent("CALLBACK",vehicleId);setSent(true)}
  }

  return <>
    <div className={compact?"vehicle-contact-actions compact":"vehicle-contact-actions"}>
      <a className="vehicle-contact-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" onClick={()=>trackVehicleEvent("WHATSAPP",vehicleId)}><Icon name="message" size={17}/><span>{compact?(en?"WhatsApp":"WhatsApp"):(en?"Write on WhatsApp":"Napisz na WhatsApp")}</span></a>
      {!compact&&<button type="button" className="vehicle-contact-callback" onClick={()=>{setSent(false);setCallback(true)}}><Icon name="phone" size={17}/>{en?"Request a callback":"Oddzwońcie do mnie"}</button>}
      <button type="button" className="vehicle-contact-share" onClick={share}><Icon name="share" size={17}/>{compact?null:<span>{shareState==="copied"?(en?"Copied":"Skopiowano"):(en?"Share":"Udostępnij")}</span>}</button>
    </div>
    {callback&&<div className="callback-modal" role="dialog" aria-modal="true" aria-label={en?"Request a callback":"Prośba o kontakt"}>
      <button type="button" className="callback-backdrop" onClick={()=>setCallback(false)} aria-label={en?"Close":"Zamknij"}/>
      <div className="callback-card">
        <button type="button" className="callback-close" onClick={()=>setCallback(false)}>×</button>
        <span className="eyebrow">{en?"Fast contact":"Szybki kontakt"}</span>
        <h3>{sent?(en?"Request sent":"Prośba wysłana"):(en?"We can call you back":"Możemy do Ciebie oddzwonić")}</h3>
        {sent?<><p>{en?"A CoolCars advisor received your request.":"Doradca CoolCars otrzymał Twoją prośbę o kontakt."}</p><button type="button" className="btn btn-primary" onClick={()=>setCallback(false)}>{en?"Close":"Zamknij"}</button></>:<form onSubmit={submit}>
          <p>{en?"Leave your name and phone number. No long form is required.":"Zostaw imię i numer telefonu. Bez długiego formularza."}</p>
          <label>{en?"Name":"Imię"}<input className="input" name="name" defaultValue={defaultName} required minLength={2}/></label>
          <label>{en?"Phone":"Telefon"}<input className="input" name="phone" type="tel" inputMode="tel" placeholder="+48 ..." required minLength={7}/></label>
          <button className="btn btn-accent" disabled={sending}>{sending?(en?"Sending...":"Wysyłanie..."):(en?"Call me back":"Oddzwońcie do mnie")}</button>
          <small>{en?"Your request will be visible to the sales team in CRM.":"Prośba trafi bezpośrednio do zespołu sprzedaży w CRM."}</small>
        </form>}
      </div>
    </div>}
  </>;
}
