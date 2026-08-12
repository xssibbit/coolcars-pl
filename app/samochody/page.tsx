import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { VehicleCard } from "@/components/VehicleCard";
import { Icon } from "@/components/Icons";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : (v ?? "");

export default async function VehiclesPage({ searchParams }: { searchParams: Search }) {
  const [locale,user] = await Promise.all([getLocale(),getCurrentUser()]); const en = locale === "en";
  const sp = await searchParams;
  const q=one(sp.q).trim(), brand=one(sp.brand), model=one(sp.model), category=one(sp.category), transmission=one(sp.transmission), fuel=one(sp.fuel), location=one(sp.location), sort=one(sp.sort)||'recommended';
  const yearFrom=Number(one(sp.yearFrom))||undefined, minPrice=Number(one(sp.minPrice))||undefined, maxPrice=Number(one(sp.maxPrice))||undefined, mileageMax=Number(one(sp.mileageMax))||undefined;
  const where:any={status:{not:"DRAFT"}};
  if(q) where.OR=[{title:{contains:q,mode:'insensitive'}},{brand:{contains:q,mode:'insensitive'}},{model:{contains:q,mode:'insensitive'}},{stockNumber:{contains:q,mode:'insensitive'}}];
  if(brand) where.brand=brand; if(model) where.model=model; if(category) where.category=category; if(transmission) where.transmission=transmission; if(fuel) where.fuel=fuel; if(location) where.location=location;
  if(yearFrom) where.year={gte:yearFrom}; if(mileageMax) where.mileage={lte:mileageMax};
  if(minPrice||maxPrice) where.priceNet={...(minPrice?{gte:minPrice}:{}),...(maxPrice?{lte:maxPrice}:{})};
  const orderBy:any = sort==='priceAsc'?[{priceNet:'asc'}]:sort==='priceDesc'?[{priceNet:'desc'}]:sort==='yearDesc'?[{year:'desc'},{createdAt:'desc'}]:sort==='mileageAsc'?[{mileage:'asc'}]:sort==='newest'?[{createdAt:'desc'}]:[{featured:'desc'},{createdAt:'desc'}];

  const [vehicles,brands,models,transmissions,fuels,locations]=await Promise.all([
    db.vehicle.findMany({where,orderBy,include:{favorites:{where:{userId:user?.id??'__guest__'}}}}),
    db.vehicle.findMany({select:{brand:true},distinct:['brand'],orderBy:{brand:'asc'}}),
    db.vehicle.findMany({select:{model:true},distinct:['model'],orderBy:{model:'asc'}}),
    db.vehicle.findMany({select:{transmission:true},distinct:['transmission'],orderBy:{transmission:'asc'}}),
    db.vehicle.findMany({select:{fuel:true},distinct:['fuel'],orderBy:{fuel:'asc'}}),
    db.vehicle.findMany({select:{location:true},distinct:['location'],orderBy:{location:'asc'}}),
  ]);
  const sortLabel:{[k:string]:string}={recommended:en?'Recommended':'Polecane',newest:en?'Newest':'Najnowsze',priceAsc:en?'Price: low to high':'Cena: od najniższej',priceDesc:en?'Price: high to low':'Cena: od najwyższej',yearDesc:en?'Newest year':'Rok: najnowsze',mileageAsc:en?'Lowest mileage':'Najmniejszy przebieg'};

  return <><section className="page-hero"><div className="container"><span className="eyebrow">{en?"Inventory":"Katalog"}</span><h1>{en?"Vehicles available now":"Samochody dostępne od ręki"}</h1><p>{en?"Filter the current inventory by the parameters that matter. Every listing shows net and gross price and the current vehicle status.":"Filtruj ofertę po najważniejszych parametrach. Każda karta pokazuje cenę netto i brutto oraz aktualny status pojazdu."}</p></div></section>
  <section className="section-tight"><div className="container catalog-layout">
    <form className="filter-panel advanced-filter-panel" action="/samochody"><div className="filter-heading"><h3>{en?"Filters":"Filtry"}</h3><a href="/samochody">{en?'Reset':'Wyczyść'}</a></div>
      <div className="field filter-search"><label>{en?"Search":"Szukaj"}</label><input className="input" name="q" defaultValue={q} placeholder={en?"Make, model, stock number":"Marka, model, nr oferty"}/></div>
      <div className="field"><label>{en?"Make":"Marka"}</label><select className="select" name="brand" defaultValue={brand}><option value="">{en?"All":"Wszystkie"}</option>{brands.map(x=><option key={x.brand}>{x.brand}</option>)}</select></div>
      <div className="field"><label>{en?"Model":"Model"}</label><select className="select" name="model" defaultValue={model}><option value="">{en?"All models":"Wszystkie modele"}</option>{models.map(x=><option key={x.model}>{x.model}</option>)}</select></div>
      <div className="field"><label>{en?"Category":"Kategoria"}</label><select className="select" name="category" defaultValue={category}><option value="">{en?"All":"Wszystkie"}</option><option value="Samochody dostawcze">{en?"Commercial vehicles":"Samochody dostawcze"}</option><option value="Ciężarówki > 3,5 t">{en?"Trucks > 3.5 t":"Ciężarówki > 3,5 t"}</option><option value="Furgony">{en?"Vans":"Furgony"}</option><option value="Samochody osobowe">{en?"Passenger cars":"Samochody osobowe"}</option></select></div>
      <div className="field"><label>{en?"Year from":"Rok od"}</label><input className="input" type="number" name="yearFrom" defaultValue={yearFrom} placeholder="2019"/></div>
      <div className="field"><label>{en?"Mileage up to":"Przebieg do"}</label><input className="input" type="number" name="mileageMax" defaultValue={mileageMax} placeholder="250000"/></div>
      <div className="field"><label>{en?"Net price from":"Cena netto od"}</label><input className="input" type="number" name="minPrice" defaultValue={minPrice} placeholder="50000"/></div>
      <div className="field"><label>{en?"Net price up to":"Cena netto do"}</label><input className="input" type="number" name="maxPrice" defaultValue={maxPrice} placeholder="150000"/></div>
      <div className="field"><label>{en?"Transmission":"Skrzynia"}</label><select className="select" name="transmission" defaultValue={transmission}><option value="">{en?'All':'Wszystkie'}</option>{transmissions.map(x=><option key={x.transmission}>{x.transmission}</option>)}</select></div>
      <div className="field"><label>{en?"Fuel":"Paliwo"}</label><select className="select" name="fuel" defaultValue={fuel}><option value="">{en?'All':'Wszystkie'}</option>{fuels.map(x=><option key={x.fuel}>{x.fuel}</option>)}</select></div>
      <div className="field"><label>{en?"Location":"Lokalizacja"}</label><select className="select" name="location" defaultValue={location}><option value="">{en?'All':'Wszystkie'}</option>{locations.map(x=><option key={x.location}>{x.location}</option>)}</select></div>
      <div className="field"><label>{en?"Sort":"Sortowanie"}</label><select className="select" name="sort" defaultValue={sort}><option value="recommended">{en?'Recommended':'Polecane'}</option><option value="newest">{en?'Newest':'Najnowsze'}</option><option value="priceAsc">{en?'Price: low to high':'Cena: od najniższej'}</option><option value="priceDesc">{en?'Price: high to low':'Cena: od najwyższej'}</option><option value="yearDesc">{en?'Newest year':'Rok: najnowsze'}</option><option value="mileageAsc">{en?'Lowest mileage':'Najmniejszy przebieg'}</option></select></div>
      <button className="btn btn-primary filter-submit" type="submit"><Icon name="search"/> {en?"Show results":"Pokaż wyniki"}</button>
    </form>
    <div><div className="result-bar"><span><b>{vehicles.length}</b> {en?"vehicles":"pojazdów"}</span><span>{en?'Sort':'Sortowanie'}: <b>{sortLabel[sort]??sortLabel.recommended}</b></span></div>{vehicles.length?<div className="card-grid catalog-card-grid">{vehicles.map(v=><VehicleCard key={v.id} vehicle={v} locale={locale} loggedIn={!!user} initialFavorite={v.favorites.length>0}/>)}</div>:<div className="empty">{en?"No vehicles match these filters. Change the criteria and try again.":"Nie znaleźliśmy pojazdów dla tych filtrów. Zmień kryteria i spróbuj ponownie."}</div>}</div>
  </div></section></>;
}
