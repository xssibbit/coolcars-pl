"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

const KEY="coolcars_compare";
const readIds=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]") as string[]}catch{return[]}};

export function CompareBar({ locale="pl" }: { locale?:Locale }) {
  const [ids,setIds]=useState<string[]>([]); const en=locale==='en';
  useEffect(()=>{
    const sync=()=>setIds(readIds()); sync();
    window.addEventListener('storage',sync);
    window.addEventListener('coolcars:compare',sync as EventListener);
    return()=>{window.removeEventListener('storage',sync);window.removeEventListener('coolcars:compare',sync as EventListener)};
  },[]);
  if(!ids.length) return null;
  return <div className="compare-bar" role="status">
    <div><Icon name="compare" size={18}/><strong>{en?`${ids.length} selected`:`Wybrano: ${ids.length}`}</strong><span>{en?'Up to 3 vehicles':'Maks. 3 pojazdy'}</span></div>
    <div className="compare-bar-actions">
      <button type="button" onClick={()=>{localStorage.removeItem(KEY);setIds([]);window.dispatchEvent(new Event('coolcars:compare'));}}>{en?'Clear':'Wyczyść'}</button>
      <Link href={`/porownaj?ids=${encodeURIComponent(ids.join(','))}`} className="btn btn-primary">{en?'Compare':'Porównaj'} <Icon name="arrow" size={16}/></Link>
    </div>
  </div>;
}
