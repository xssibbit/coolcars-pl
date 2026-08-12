"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import { trackVehicleEvent } from "@/lib/analytics-client";
import type { Locale } from "@/lib/i18n";

const KEY = "coolcars_compare";
const readIds = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]") as string[]; } catch { return []; } };

export function CompareButton({ vehicleId, locale="pl", compact=false }: { vehicleId:string; locale?:Locale; compact?:boolean }) {
  const [active,setActive]=useState(false); const en=locale==='en';
  useEffect(()=>{ setActive(readIds().includes(vehicleId)); },[vehicleId]);
  const label=active?(en?'Remove from comparison':'Usuń z porównania'):(en?'Compare':'Porównaj');
  return <button type="button" className={compact?`vehicle-action-btn ${active?'active':''}`:`btn btn-ghost compare-detail-btn ${active?'active':''}`} aria-label={label} title={label} onClick={(e)=>{
    e.preventDefault(); e.stopPropagation();
    let ids=readIds();
    const wasActive=ids.includes(vehicleId);
    if(wasActive) ids=ids.filter(id=>id!==vehicleId);
    else { if(ids.length>=3) ids=ids.slice(1); ids=[...ids,vehicleId]; trackVehicleEvent('COMPARE',vehicleId); }
    localStorage.setItem(KEY,JSON.stringify(ids)); setActive(ids.includes(vehicleId));
    window.dispatchEvent(new CustomEvent('coolcars:compare',{detail:ids}));
  }}><Icon name="compare" size={compact?18:18}/>{compact?null:<> {label}</>}</button>;
}
