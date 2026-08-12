"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatKm, formatPln } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

type Recent={id:string;slug:string;title:string;brand:string;image?:string;priceNet:number;year:number;mileage:number};
const KEY="coolcars_recently_viewed_v1";

export function AccountRecentlyViewed({locale="pl"}:{locale?:Locale}){
  const en=locale==="en";const [items,setItems]=useState<Recent[]>([]);
  useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{}},[]);
  if(!items.length)return <div className="account-empty-mini">{en?"No recently viewed vehicles yet.":"Brak ostatnio oglądanych pojazdów."}</div>;
  return <div className="account-recent-grid">{items.map(item=><Link key={item.id} href={`/samochody/${item.slug}`} className="account-recent-card">
    <div>{item.image?<img src={item.image} alt={item.title} loading="lazy" decoding="async"/>:<span className="recent-placeholder">COOL CARS</span>}</div>
    <section><small>{item.brand}</small><strong>{item.title}</strong><span>{item.year} · {formatKm(item.mileage)}</span><b>{formatPln(item.priceNet)} {en?'net':'netto'}</b></section>
  </Link>)}</div>;
}
