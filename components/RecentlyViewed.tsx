"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatKm, formatPln } from "@/lib/format";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

type RecentVehicle={id:string;slug:string;title:string;brand:string;image?:string;priceNet:number;year:number;mileage:number};
const KEY='coolcars_recently_viewed_v1';

export function RecentlyViewed({vehicle,locale='pl'}:{vehicle:RecentVehicle;locale?:Locale}){
  const en=locale==='en'; const [items,setItems]=useState<RecentVehicle[]>([]);
  useEffect(()=>{
    try{
      const stored=JSON.parse(localStorage.getItem(KEY)||'[]') as RecentVehicle[];
      const previous=stored.filter(x=>x.id!==vehicle.id).slice(0,4);
      setItems(previous);
      localStorage.setItem(KEY,JSON.stringify([vehicle,...previous].slice(0,5)));
    }catch{localStorage.setItem(KEY,JSON.stringify([vehicle]));}
  },[vehicle.id]);
  if(!items.length)return null;
  return <section className="section recent-section"><div className="container">
    <div className="section-head"><div><span className="eyebrow">{en?'History':'Historia'}</span><h2>{en?'Recently viewed':'Ostatnio oglądane'}</h2></div></div>
    <div className="recent-track">{items.map(item=><Link key={item.id} href={`/samochody/${item.slug}`} className="recent-card">
      <div className="recent-image">{item.image?<img src={item.image} alt={item.title}/>:<div className="vehicle-image-placeholder"><strong>COOL CARS</strong></div>}</div>
      <div className="recent-copy"><span>{item.brand}</span><strong>{item.title}</strong><div><small><Icon name="calendar" size={13}/>{item.year}</small><small><Icon name="gauge" size={13}/>{formatKm(item.mileage)}</small></div><b>{formatPln(item.priceNet)} {en?'net':'netto'}</b></div>
    </Link>)}</div>
  </div></section>;
}
