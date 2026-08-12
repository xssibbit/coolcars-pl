"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";
import { Icon } from "@/components/Icons";
import { trackVehicleEvent } from "@/lib/analytics-client";
import type { Locale } from "@/lib/i18n";

type QuickVehicle = {
  id:string; slug:string; title:string; brand:string; year:number; mileage:number; priceNet:number; vatRate:number;
  fuel:string; transmission:string; location:string;
};

export function QuickViewButton({vehicle,images,locale="pl",loggedIn=false,initialFavorite=false}:{vehicle:QuickVehicle;images:string[];locale?:Locale;loggedIn?:boolean;initialFavorite?:boolean}){
  const en=locale==='en';
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
  const safe=images.filter(Boolean).slice(0,5);
  useEffect(()=>{
    if(!open)return;
    const y=window.scrollY;
    document.body.style.position='fixed';document.body.style.top=`-${y}px`;document.body.style.width='100%';
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',key);
    return()=>{window.removeEventListener('keydown',key);const top=document.body.style.top;document.body.style.position='';document.body.style.top='';document.body.style.width='';window.scrollTo(0,Math.abs(parseInt(top||'0',10)));};
  },[open]);
  return <>
    <button type="button" className="vehicle-action-btn quick-view-trigger" onClick={()=>{setActive(0);setOpen(true);trackVehicleEvent('QUICK_VIEW',vehicle.id)}} aria-label={en?'Quick view':'Szybki podgląd'} title={en?'Quick view':'Szybki podgląd'}><Icon name="eye" size={18}/></button>
    {open&&<div className="quick-view-modal" role="dialog" aria-modal="true" aria-label={en?'Vehicle quick view':'Szybki podgląd pojazdu'}>
      <button type="button" className="quick-view-backdrop" onClick={()=>setOpen(false)} aria-label={en?'Close':'Zamknij'}/>
      <div className="quick-view-panel">
        <button type="button" className="quick-view-close" onClick={()=>setOpen(false)} aria-label={en?'Close':'Zamknij'}>×</button>
        <div className="quick-view-media">
          {safe.length?<><img className="quick-view-main-image" src={safe[active]} alt={vehicle.title}/>{safe.length>1&&<div className="quick-view-thumbs">{safe.map((src,i)=><button type="button" key={src+i} className={i===active?'active':''} onClick={()=>setActive(i)}><img src={src} alt=""/></button>)}</div>}</>:<div className="quick-view-placeholder"><strong>COOL CARS</strong><span>{en?'Photos coming soon':'Zdjęcia wkrótce'}</span></div>}
        </div>
        <div className="quick-view-copy">
          <div className="card-kicker">{vehicle.brand} · {vehicle.location}</div>
          <h2>{vehicle.title}</h2>
          <div className="quick-view-price">{formatPln(vehicle.priceNet)} <small>{en?'net':'netto'}</small></div>
          <div className="detail-price-gross">{formatPln(grossFromNet(vehicle.priceNet,vehicle.vatRate))} {en?'gross':'brutto'}</div>
          <div className="quick-view-specs">
            <span><Icon name="calendar" size={16}/><b>{vehicle.year}</b></span>
            <span><Icon name="gauge" size={16}/><b>{formatKm(vehicle.mileage)}</b></span>
            <span><Icon name="fuel" size={16}/><b>{vehicle.fuel}</b></span>
            <span><Icon name="settings" size={16}/><b>{vehicle.transmission}</b></span>
          </div>
          <div className="quick-view-actions"><FavoriteButton vehicleId={vehicle.id} initial={initialFavorite} loggedIn={loggedIn} locale={locale}/><CompareButton vehicleId={vehicle.id} locale={locale}/></div>
          <Link className="btn btn-accent quick-view-full" href={`/samochody/${vehicle.slug}`} onClick={()=>setOpen(false)}>{en?'View full listing':'Zobacz pełną ofertę'} <Icon name="arrow" size={17}/></Link>
        </div>
      </div>
    </div>}
  </>;
}
