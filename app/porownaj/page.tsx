import Link from "next/link";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { Icon } from "@/components/Icons";

type Search=Promise<Record<string,string|string[]|undefined>>;
const one=(v:string|string[]|undefined)=>Array.isArray(v)?v[0]:(v??"");
const isReal=(url:string)=>!!url && !url.startsWith('/vehicles/');

export default async function ComparePage({searchParams}:{searchParams:Search}){
  const locale=await getLocale(); const en=locale==='en'; const sp=await searchParams;
  const ids=one(sp.ids).split(',').map(x=>x.trim()).filter(Boolean).slice(0,3);
  const rows=ids.length?await db.vehicle.findMany({where:{id:{in:ids},status:{not:'DRAFT'}},include:{images:{orderBy:{sortOrder:'asc'}}}}):[];
  const vehicles=ids.map(id=>rows.find(v=>v.id===id)).filter(Boolean) as typeof rows;
  const specs=[
    [en?'Year':'Rok',(v:any)=>String(v.year)],
    [en?'Mileage':'Przebieg',(v:any)=>formatKm(v.mileage)],
    [en?'Fuel':'Paliwo',(v:any)=>v.fuel],
    [en?'Transmission':'Skrzynia',(v:any)=>v.transmission],
    [en?'Power':'Moc',(v:any)=>v.powerHp?`${v.powerHp} ${en?'HP':'KM'}`:'—'],
    [en?'GVW':'DMC',(v:any)=>v.dmc?`${v.dmc} kg`:'—'],
    [en?'Payload':'Ładowność',(v:any)=>v.payload?`${v.payload} kg`:'—'],
    [en?'Location':'Lokalizacja',(v:any)=>v.location],
  ] as const;
  return <section className="section-tight"><div className="container compare-page">
    <div className="section-head"><div><span className="eyebrow">{en?'Comparison':'Porównanie'}</span><h1>{en?'Compare vehicles':'Porównaj pojazdy'}</h1></div><Link className="btn btn-ghost" href="/samochody"><Icon name="arrow"/> {en?'Back to inventory':'Wróć do katalogu'}</Link></div>
    {!vehicles.length?<div className="empty">{en?'Select vehicles in the inventory to compare them here.':'Wybierz pojazdy w katalogu, aby porównać je tutaj.'}</div>:<div className="compare-table-wrap"><div className="compare-table" style={{'--compare-count':vehicles.length} as React.CSSProperties}>
      <div className="compare-label compare-head-label">{en?'Vehicle':'Pojazd'}</div>{vehicles.map(v=>{const img=[...v.images.map(i=>i.url),v.image].find(isReal);return <div className="compare-vehicle-head" key={v.id}>{img?<img src={img} alt={v.title}/>:<div className="compare-no-photo">COOL CARS<span>{en?'Photo coming soon':'Zdjęcie wkrótce'}</span></div>}<strong>{v.title}</strong><b>{formatPln(v.priceNet)} {en?'net':'netto'}</b><small>{formatPln(grossFromNet(v.priceNet,v.vatRate))} {en?'gross':'brutto'}</small><Link href={`/samochody/${v.slug}`}>{en?'View offer':'Zobacz ofertę'} <Icon name="arrow" size={15}/></Link></div>})}
      {specs.map(([label,get])=><div className="compare-row" key={label}><div className="compare-label">{label}</div>{vehicles.map(v=><div key={v.id} className="compare-value">{get(v)}</div>)}</div>)}
    </div></div>}
  </div></section>;
}
