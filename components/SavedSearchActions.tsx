"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function SaveSearchButton({query,name,loggedIn,locale="pl"}:{query:string;name:string;loggedIn:boolean;locale?:Locale}){
  const en=locale==="en";const router=useRouter();const [state,setState]=useState<"idle"|"saving"|"saved"|"error">("idle");
  return <button type="button" className={`save-search-btn ${state==="saved"?"saved":""}`} disabled={state==="saving"} onClick={async()=>{
    if(!loggedIn){router.push(`/login?next=${encodeURIComponent(`/samochody?${query}`)}`);return;}
    setState("saving");
    const res=await fetch("/api/saved-searches",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,name})}).catch(()=>null);
    setState(res?.ok?"saved":"error");
  }}>{state==="saving"?(en?"Saving...":"Zapisywanie..."):state==="saved"?(en?"Search saved ✓":"Wyszukiwanie zapisane ✓"):state==="error"?(en?"Try again":"Spróbuj ponownie"):(en?"Save search":"Zapisz wyszukiwanie")}</button>;
}

export function RemoveSavedSearchButton({id,locale="pl"}:{id:string;locale?:Locale}){
  const en=locale==="en";const router=useRouter();const [busy,setBusy]=useState(false);
  return <button type="button" className="saved-search-remove" disabled={busy} onClick={async()=>{setBusy(true);const res=await fetch(`/api/saved-searches/${id}`,{method:"DELETE"}).catch(()=>null);if(res?.ok)router.refresh();else setBusy(false)}}>{busy?"…":(en?"Remove":"Usuń")}</button>;
}
