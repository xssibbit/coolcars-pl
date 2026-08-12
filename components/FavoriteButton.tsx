"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";
export function FavoriteButton({ vehicleId, initial, loggedIn, locale="pl" }: { vehicleId:string; initial:boolean; loggedIn:boolean; locale?:Locale }) {
  const [active,setActive]=useState(initial); const router=useRouter(); const en=locale==='en';
  return <button className={active?"btn btn-accent":"btn btn-ghost"} style={{width:'100%'}} onClick={async()=>{
    if(!loggedIn){router.push('/login');return;}
    const res=await fetch(`/api/favorites/${vehicleId}`,{method:active?'DELETE':'POST'});
    if(res.ok)setActive(!active);
  }}><Icon name="heart"/> {active?(en?'Saved':'W zapisanych'):(en?'Save vehicle':'Zapisz pojazd')}</button>
}
