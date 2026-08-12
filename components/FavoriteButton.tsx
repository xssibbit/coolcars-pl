"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

export function FavoriteButton({ vehicleId, initial, loggedIn, locale="pl", compact=false }: { vehicleId:string; initial:boolean; loggedIn:boolean; locale?:Locale; compact?:boolean }) {
  const [active,setActive]=useState(initial); const router=useRouter(); const en=locale==='en';
  const label=active?(en?'Saved':'W zapisanych'):(en?'Save vehicle':'Zapisz pojazd');
  return <button
    type="button"
    className={compact?`vehicle-action-btn ${active?'active':''}`:(active?"btn btn-accent":"btn btn-ghost")}
    style={compact?undefined:{width:'100%'}}
    aria-label={label}
    title={label}
    onClick={async(e)=>{
      e.preventDefault(); e.stopPropagation();
      if(!loggedIn){router.push('/login');return;}
      const res=await fetch(`/api/favorites/${vehicleId}`,{method:active?'DELETE':'POST'});
      if(res.ok)setActive(!active);
    }}
  ><Icon name="heart" size={compact?18:18}/>{compact?null:<> {label}</>}</button>
}
