"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
export function FavoriteButton({ vehicleId, initial, loggedIn }: { vehicleId:string; initial:boolean; loggedIn:boolean }) {
  const [active,setActive]=useState(initial); const router=useRouter();
  return <button className={active?"btn btn-accent":"btn btn-ghost"} style={{width:'100%'}} onClick={async()=>{
    if(!loggedIn){router.push('/login');return;}
    const res=await fetch(`/api/favorites/${vehicleId}`,{method:active?'DELETE':'POST'});
    if(res.ok)setActive(!active);
  }}><Icon name="heart"/> {active?'W zapisanych':'Zapisz pojazd'}</button>
}
