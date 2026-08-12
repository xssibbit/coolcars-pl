import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { VehicleCard } from "@/components/VehicleCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogScrollRestorer } from "@/components/CatalogScrollRestorer";
import { SaveSearchButton } from "@/components/SavedSearchActions";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : (v ?? "");

export default async function VehiclesPage({ searchParams }: { searchParams: Search }) {
  const [locale,user] = await Promise.all([getLocale(),getCurrentUser()]); const en = locale === "en";
  const sp = await searchParams;
  const current={
    q:one(sp.q).trim(),brand:one(sp.brand),model:one(sp.model),category:one(sp.category),yearFrom:one(sp.yearFrom),mileageMax:one(sp.mileageMax),minPrice:one(sp.minPrice),maxPrice:one(sp.maxPrice),transmission:one(sp.transmission),fuel:one(sp.fuel),location:one(sp.location),sort:one(sp.sort)||"recommended",
  };
  const view: "grid"|"list"=one(sp.view)==="list"?"list":"grid";
  const where:any={status:{not:"DRAFT"}};
  if(current.q) where.OR=[{title:{contains:current.q,mode:'insensitive'}},{brand:{contains:current.q,mode:'insensitive'}},{model:{contains:current.q,mode:'insensitive'}},{stockNumber:{contains:current.q,mode:'insensitive'}}];
  if(current.brand) where.brand=current.brand;if(current.model) where.model=current.model;if(current.category) where.category=current.category;if(current.transmission) where.transmission=current.transmission;if(current.fuel) where.fuel=current.fuel;if(current.location) where.location=current.location;
  const yearFrom=Number(current.yearFrom)||undefined,mileageMax=Number(current.mileageMax)||undefined,minPrice=Number(current.minPrice)||undefined,maxPrice=Number(current.maxPrice)||undefined;
  if(yearFrom)where.year={gte:yearFrom};if(mileageMax)where.mileage={lte:mileageMax};if(minPrice||maxPrice)where.priceNet={...(minPrice?{gte:minPrice}:{}),...(maxPrice?{lte:maxPrice}:{})};
  const orderBy:any=current.sort==='priceAsc'?[{priceNet:'asc'}]:current.sort==='priceDesc'?[{priceNet:'desc'}]:current.sort==='yearDesc'?[{year:'desc'},{createdAt:'desc'}]:current.sort==='mileageAsc'?[{mileage:'asc'}]:current.sort==='newest'?[{createdAt:'desc'}]:[{featured:'desc'},{createdAt:'desc'}];

  const [vehicles,inventory]=await Promise.all([
    db.vehicle.findMany({where,orderBy,include:{favorites:{where:{userId:user?.id??'__guest__'}},images:{orderBy:{sortOrder:'asc'}}}}),
    db.vehicle.findMany({where:{status:{not:'DRAFT'}},select:{title:true,stockNumber:true,brand:true,model:true,category:true,year:true,mileage:true,priceNet:true,transmission:true,fuel:true,location:true}}),
  ]);

  const params=new URLSearchParams();
  Object.entries(current).forEach(([k,v])=>{if(v&&!(k==='sort'&&v==='recommended'))params.set(k,v)});if(view==='list')params.set('view','list');
  const setHref=(key:string,value?:string)=>{const p=new URLSearchParams(params.toString());if(value)p.set(key,value);else p.delete(key);return `/samochody${p.toString()?`?${p}`:''}`};
  const chipData=[
    ['q',current.q,current.q?`“${current.q}”`:''],['brand',current.brand,current.brand],['model',current.model,current.model],['category',current.category,current.category],
    ['yearFrom',current.yearFrom,current.yearFrom?(en?`from ${current.yearFrom}`:`od ${current.yearFrom}`):''],['mileageMax',current.mileageMax,current.mileageMax?(en?`mileage ≤ ${Number(current.mileageMax).toLocaleString('pl-PL')}`:`przebieg ≤ ${Number(current.mileageMax).toLocaleString('pl-PL')}`):''],
    ['minPrice',current.minPrice,current.minPrice?(en?`from ${Number(current.minPrice).toLocaleString('pl-PL')} PLN`:`od ${Number(current.minPrice).toLocaleString('pl-PL')} zł`):''],['maxPrice',current.maxPrice,current.maxPrice?(en?`to ${Number(current.maxPrice).toLocaleString('pl-PL')} PLN`:`do ${Number(current.maxPrice).toLocaleString('pl-PL')} zł`):''],
    ['transmission',current.transmission,current.transmission],['fuel',current.fuel,current.fuel],['location',current.location,current.location],
  ].filter((x):x is string[]=>Boolean(x[1]));
  const searchParamsOnly=new URLSearchParams(params.toString());searchParamsOnly.delete('view');
  const savedName=[current.brand,current.model,current.category,current.yearFrom?(en?`from ${current.yearFrom}`:`od ${current.yearFrom}`):'',current.maxPrice?(en?`to ${Number(current.maxPrice).toLocaleString('pl-PL')} PLN`:`do ${Number(current.maxPrice).toLocaleString('pl-PL')} zł`):''].filter(Boolean).slice(0,4).join(' · ')||(en?'My vehicle search':'Moje wyszukiwanie');
  const sortLabel:{[k:string]:string}={recommended:en?'Recommended':'Polecane',newest:en?'Newest':'Najnowsze',priceAsc:en?'Price: low to high':'Cena: od najniższej',priceDesc:en?'Price: high to low':'Cena: od najwyższej',yearDesc:en?'Newest year':'Rok: najnowsze',mileageAsc:en?'Lowest mileage':'Najmniejszy przebieg'};

  return <>
    <CatalogScrollRestorer/>
    <section className="page-hero catalog-page-hero"><div className="container"><span className="eyebrow">{en?"Inventory":"Katalog"}</span><h1>{en?"Vehicles available now":"Samochody dostępne od ręki"}</h1><p>{en?"Find the right vehicle quickly. Filters, comparison and saved searches keep your place while you browse.":"Znajdź właściwy pojazd szybciej. Filtry, porównanie i zapisane wyszukiwania zachowują Twój kontekst podczas przeglądania."}</p></div></section>
    <section className="section-tight"><div className="container catalog-layout ux-catalog-layout">
      <CatalogFilters inventory={inventory} current={current} locale={locale} view={view}/>
      <div className="catalog-results">
        <div className="catalog-results-top">
          <div className="result-bar"><span><b>{vehicles.length}</b> {en?"vehicles":"pojazdów"}</span><span>{en?'Sort':'Sortowanie'}: <b>{sortLabel[current.sort]??sortLabel.recommended}</b></span></div>
          <div className="desktop-catalog-actions">
            {chipData.length>0&&<SaveSearchButton query={searchParamsOnly.toString()} name={savedName} loggedIn={!!user} locale={locale}/>}            
            <div className="catalog-view-switch desktop" role="group" aria-label={en?'View':'Widok'}><Link className={view==='grid'?'active':''} href={setHref('view','grid')}>▦ {en?'Cards':'Karty'}</Link><Link className={view==='list'?'active':''} href={setHref('view','list')}>☰ {en?'List':'Lista'}</Link></div>
          </div>
        </div>
        {chipData.length>0&&<div className="active-filter-chips">{chipData.map(([key,,label])=><Link href={setHref(key)} key={key}>{label}<span>×</span></Link>)}<Link className="clear-all-chip" href="/samochody">{en?'Clear all':'Wyczyść wszystko'}</Link></div>}
        {vehicles.length?<div className={`card-grid catalog-card-grid ${view==='list'?'catalog-list-view':''}`}>{vehicles.map(v=><VehicleCard key={v.id} vehicle={v} locale={locale} loggedIn={!!user} initialFavorite={v.favorites.length>0} imageUrls={v.images.map(i=>i.url)}/>)}</div>:<div className="empty catalog-empty"><strong>{en?"No exact matches":"Brak dokładnych wyników"}</strong><span>{en?"Remove one of the filters or reset the search to see the full inventory.":"Usuń jeden z filtrów albo wyczyść wyszukiwanie, aby zobaczyć pełną ofertę."}</span><Link className="btn btn-primary" href="/samochody">{en?'Show all vehicles':'Pokaż wszystkie pojazdy'}</Link></div>}
      </div>
    </div></section>
  </>;
}
