import { db } from "@/lib/db";
import { VehicleCard } from "@/components/VehicleCard";
import { Icon } from "@/components/Icons";

export const metadata = { title: "Samochody" };

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : (v ?? "");

export default async function VehiclesPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const q = one(sp.q).trim(); const brand = one(sp.brand); const category = one(sp.category); const yearFrom = Number(one(sp.yearFrom)) || undefined; const maxPrice = Number(one(sp.maxPrice)) || undefined;
  const where: any = { status: { not: "DRAFT" } };
  if (q) where.OR = [{title:{contains:q}},{brand:{contains:q}},{model:{contains:q}},{stockNumber:{contains:q}}];
  if (brand) where.brand = brand;
  if (category) where.category = category;
  if (yearFrom) where.year = { gte: yearFrom };
  if (maxPrice) where.priceNet = { lte: maxPrice };

  const [vehicles, brands] = await Promise.all([
    db.vehicle.findMany({ where, orderBy:[{featured:'desc'},{createdAt:'desc'}] }),
    db.vehicle.findMany({ select:{brand:true}, distinct:['brand'], orderBy:{brand:'asc'} }),
  ]);

  return <><section className="page-hero"><div className="container"><span className="eyebrow">Katalog</span><h1>Samochody dostępne od ręki</h1><p>Filtruj ofertę po najważniejszych parametrach. Każda karta pokazuje cenę netto i brutto oraz aktualny status pojazdu.</p></div></section>
  <section className="section-tight"><div className="container catalog-layout">
    <form className="filter-panel" action="/samochody"><h3>Filtry</h3>
      <div className="field"><label>Szukaj</label><input className="input" name="q" defaultValue={q} placeholder="Marka, model, nr oferty"/></div>
      <div className="field"><label>Marka</label><select className="select" name="brand" defaultValue={brand}><option value="">Wszystkie</option>{brands.map(x=><option key={x.brand}>{x.brand}</option>)}</select></div>
      <div className="field"><label>Kategoria</label><select className="select" name="category" defaultValue={category}><option value="">Wszystkie</option><option>Samochody dostawcze</option><option>Ciężarówki &gt; 3,5 t</option><option>Furgony</option><option>Samochody osobowe</option></select></div>
      <div className="field"><label>Rok od</label><input className="input" type="number" name="yearFrom" defaultValue={yearFrom} placeholder="2019"/></div>
      <div className="field"><label>Cena netto do</label><input className="input" type="number" name="maxPrice" defaultValue={maxPrice} placeholder="150000"/></div>
      <button className="btn btn-primary" style={{width:'100%'}} type="submit"><Icon name="search"/> Pokaż wyniki</button>
    </form>
    <div><div className="result-bar"><span><b>{vehicles.length}</b> pojazdów</span><span>Sortowanie: polecane</span></div>{vehicles.length ? <div className="card-grid" style={{gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}>{vehicles.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div> : <div className="empty">Nie znaleźliśmy pojazdów dla tych filtrów. Zmień kryteria i spróbuj ponownie.</div>}</div>
  </div></section></>;
}
