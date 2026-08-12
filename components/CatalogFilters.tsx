"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

type InventoryItem={
  title:string;stockNumber:string;brand:string;model:string;category:string;year:number;mileage:number;priceNet:number;transmission:string;fuel:string;location:string;
};
type Filters={q:string;brand:string;model:string;category:string;yearFrom:string;mileageMax:string;minPrice:string;maxPrice:string;transmission:string;fuel:string;location:string;sort:string};

type Props={inventory:InventoryItem[];current:Filters;locale?:Locale;view:"grid"|"list"};

const categories=["Samochody dostawcze","Ciężarówki > 3,5 t","Furgony","Samochody osobowe"];
const number=(v:string)=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:undefined};

function unique(values:string[]){return [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pl"));}
function matches(v:InventoryItem,f:Filters){
  const q=f.q.trim().toLowerCase();
  if(q&&!`${v.title} ${v.brand} ${v.model} ${v.stockNumber}`.toLowerCase().includes(q))return false;
  if(f.brand&&v.brand!==f.brand)return false;if(f.model&&v.model!==f.model)return false;if(f.category&&v.category!==f.category)return false;
  const year=number(f.yearFrom),mileage=number(f.mileageMax),min=number(f.minPrice),max=number(f.maxPrice);
  if(year&&v.year<year)return false;if(mileage&&v.mileage>mileage)return false;if(min&&v.priceNet<min)return false;if(max&&v.priceNet>max)return false;
  if(f.transmission&&v.transmission!==f.transmission)return false;if(f.fuel&&v.fuel!==f.fuel)return false;if(f.location&&v.location!==f.location)return false;
  return true;
}

export function CatalogFilters({inventory,current,locale="pl",view}:Props){
  const en=locale==="en";const router=useRouter();const searchParams=useSearchParams();
  const [open,setOpen]=useState(false);const [filters,setFilters]=useState(current);
  useEffect(()=>setFilters(current),[current.q,current.brand,current.model,current.category,current.yearFrom,current.mileageMax,current.minPrice,current.maxPrice,current.transmission,current.fuel,current.location,current.sort]);
  useEffect(()=>{if(!open)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=old}},[open]);

  const brands=useMemo(()=>unique(inventory.map(v=>v.brand)),[inventory]);
  const models=useMemo(()=>unique(inventory.filter(v=>!filters.brand||v.brand===filters.brand).map(v=>v.model)),[inventory,filters.brand]);
  const transmissions=useMemo(()=>unique(inventory.map(v=>v.transmission)),[inventory]);
  const fuels=useMemo(()=>unique(inventory.map(v=>v.fuel)),[inventory]);
  const locations=useMemo(()=>unique(inventory.map(v=>v.location)),[inventory]);
  const liveCount=useMemo(()=>inventory.filter(v=>matches(v,filters)).length,[inventory,filters]);
  const appliedCount=[current.q,current.brand,current.model,current.category,current.yearFrom,current.mileageMax,current.minPrice,current.maxPrice,current.transmission,current.fuel,current.location].filter(Boolean).length;

  function set<K extends keyof Filters>(key:K,value:Filters[K]){
    setFilters(prev=>{
      const next={...prev,[key]:value};
      if(key==="brand"&&!inventory.some(v=>v.brand===String(value)&&v.model===prev.model))next.model="";
      return next;
    });
  }
  function changeQuery(key:string,value:string){
    const p=new URLSearchParams(searchParams.toString());if(value)p.set(key,value);else p.delete(key);router.push(`/samochody?${p.toString()}`,{scroll:false});
  }

  const sortLabel=filters.sort==="newest"?(en?"Newest":"Najnowsze"):filters.sort==="priceAsc"?(en?"Lowest price":"Najniższa cena"):filters.sort==="priceDesc"?(en?"Highest price":"Najwyższa cena"):filters.sort==="yearDesc"?(en?"Newest year":"Najnowszy rok"):filters.sort==="mileageAsc"?(en?"Lowest mileage":"Najmniejszy przebieg"):(en?"Recommended":"Polecane");

  return <>
    <div className="catalog-mobile-toolbar">
      <button type="button" className="catalog-filter-open" onClick={()=>setOpen(true)}><Icon name="filter" size={17}/>{en?"Filters":"Filtry"}{appliedCount>0&&<b>{appliedCount}</b>}</button>
      <button type="button" className="catalog-sort-open" onClick={()=>setOpen(true)}>{en?"Sort":"Sortuj"}: <b>{sortLabel}</b></button>
      <div className="catalog-view-switch" role="group" aria-label={en?"View":"Widok"}>
        <button type="button" className={view==="grid"?"active":""} onClick={()=>changeQuery("view","grid")} aria-label={en?"Grid":"Karty"}>▦</button>
        <button type="button" className={view==="list"?"active":""} onClick={()=>changeQuery("view","list")} aria-label={en?"List":"Lista"}>☰</button>
      </div>
    </div>

    {open&&<button type="button" className="catalog-filter-backdrop" aria-label={en?"Close filters":"Zamknij filtry"} onClick={()=>setOpen(false)}/>}    
    <form className={`filter-panel advanced-filter-panel ux-filter-panel ${open?"mobile-open":""}`} action="/samochody" onSubmit={()=>setOpen(false)}>
      <input type="hidden" name="view" value={view}/>
      <div className="filter-heading"><div><small>{en?"Find a vehicle":"Znajdź pojazd"}</small><h3>{en?"Filters":"Filtry"}</h3></div><div className="filter-head-actions"><a href="/samochody">{en?"Reset":"Wyczyść"}</a><button type="button" className="filter-mobile-close" onClick={()=>setOpen(false)}>×</button></div></div>
      <div className="filter-scroll-area">
        <div className="field filter-search"><label>{en?"Search":"Szukaj"}</label><input className="input" name="q" value={filters.q} onChange={e=>set("q",e.target.value)} placeholder={en?"Make, model, stock number":"Marka, model, nr oferty"}/></div>
        <div className="filter-two-cols">
          <div className="field"><label>{en?"Make":"Marka"}</label><select className="select" name="brand" value={filters.brand} onChange={e=>set("brand",e.target.value)}><option value="">{en?"All":"Wszystkie"}</option>{brands.map(x=><option key={x}>{x}</option>)}</select></div>
          <div className="field"><label>{en?"Model":"Model"}</label><select className="select" name="model" value={filters.model} onChange={e=>set("model",e.target.value)}><option value="">{en?"All models":"Wszystkie modele"}</option>{models.map(x=><option key={x}>{x}</option>)}</select></div>
        </div>
        <div className="field"><label>{en?"Category":"Kategoria"}</label><select className="select" name="category" value={filters.category} onChange={e=>set("category",e.target.value)}><option value="">{en?"All":"Wszystkie"}</option>{categories.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
        <div className="filter-two-cols">
          <div className="field"><label>{en?"Year from":"Rok od"}</label><input className="input" type="number" inputMode="numeric" name="yearFrom" value={filters.yearFrom} onChange={e=>set("yearFrom",e.target.value)} placeholder="2019"/></div>
          <div className="field"><label>{en?"Mileage up to":"Przebieg do"}</label><input className="input" type="number" inputMode="numeric" name="mileageMax" value={filters.mileageMax} onChange={e=>set("mileageMax",e.target.value)} placeholder="250000"/></div>
        </div>
        <div className="filter-two-cols">
          <div className="field"><label>{en?"Net price from":"Cena netto od"}</label><input className="input" type="number" inputMode="numeric" name="minPrice" value={filters.minPrice} onChange={e=>set("minPrice",e.target.value)} placeholder="50000"/></div>
          <div className="field"><label>{en?"Net price up to":"Cena netto do"}</label><input className="input" type="number" inputMode="numeric" name="maxPrice" value={filters.maxPrice} onChange={e=>set("maxPrice",e.target.value)} placeholder="150000"/></div>
        </div>
        <div className="field"><label>{en?"Transmission":"Skrzynia"}</label><select className="select" name="transmission" value={filters.transmission} onChange={e=>set("transmission",e.target.value)}><option value="">{en?"All":"Wszystkie"}</option>{transmissions.map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="filter-two-cols">
          <div className="field"><label>{en?"Fuel":"Paliwo"}</label><select className="select" name="fuel" value={filters.fuel} onChange={e=>set("fuel",e.target.value)}><option value="">{en?"All":"Wszystkie"}</option>{fuels.map(x=><option key={x}>{x}</option>)}</select></div>
          <div className="field"><label>{en?"Location":"Lokalizacja"}</label><select className="select" name="location" value={filters.location} onChange={e=>set("location",e.target.value)}><option value="">{en?"All":"Wszystkie"}</option>{locations.map(x=><option key={x}>{x}</option>)}</select></div>
        </div>
        <div className="field"><label>{en?"Sort":"Sortowanie"}</label><select className="select" name="sort" value={filters.sort} onChange={e=>set("sort",e.target.value)}><option value="recommended">{en?"Recommended":"Polecane"}</option><option value="newest">{en?"Newest":"Najnowsze"}</option><option value="priceAsc">{en?"Price: low to high":"Cena: od najniższej"}</option><option value="priceDesc">{en?"Price: high to low":"Cena: od najwyższej"}</option><option value="yearDesc">{en?"Newest year":"Rok: najnowsze"}</option><option value="mileageAsc">{en?"Lowest mileage":"Najmniejszy przebieg"}</option></select></div>
      </div>
      <div className="filter-submit-dock"><button className="btn btn-primary filter-submit" type="submit"><Icon name="search"/> {en?`Show ${liveCount} vehicles`:`Pokaż ${liveCount} pojazdów`}</button></div>
    </form>
  </>;
}
