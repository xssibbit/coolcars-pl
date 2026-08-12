import Link from "next/link";
import { db } from "@/lib/db";
import { SearchForm } from "@/components/SearchForm";
import { VehicleCard } from "@/components/VehicleCard";
import { Icon } from "@/components/Icons";

export default async function Home() {
  const [featured, brandRows] = await Promise.all([
    db.vehicle.findMany({ where: { featured: true, status: { not: "DRAFT" } }, take: 6, orderBy: { createdAt: "desc" } }),
    db.vehicle.findMany({ select: { brand: true }, distinct: ["brand"], orderBy: { brand: "asc" } }),
  ]);
  const brands = brandRows.map(x => x.brand);

  return <>
    <section className="hero">
      <div className="container">
        <div className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">COOL CARS · Selected vehicles</span>
            <h1>Pojazdy bez kompromisów.</h1>
            <p>Wyselekcjonowane samochody osobowe, dostawcze i ciężarowe. Sprawdzona oferta, przejrzyste ceny netto i brutto oraz finansowanie dopasowane do Twoich potrzeb.</p>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Link href="/samochody" className="btn btn-accent">Zobacz ofertę <Icon name="arrow"/></Link><a href="#kontakt" className="btn btn-ghost">Skontaktuj się</a></div>
          </div>
          <img className="hero-truck" src="/vehicles/truck-3.svg" alt="Samochód ciężarowy w ofercie CoolCars"/>
          <div className="hero-stats"><div className="hero-stat"><strong>Sprawdzony wybór</strong><span>Stan techniczny i dokumentacja pojazdu</span></div><div className="hero-stat"><strong>Jasna cena</strong><span>Netto i brutto bez ukrytych kosztów</span></div><div className="hero-stat"><strong>Finansowanie</strong><span>Leasing i kredyt dopasowany do firmy</span></div></div>
        </div>
        <SearchForm brands={brands}/>
      </div>
    </section>

    <section id="kategorie" className="section"><div className="container">
      <div className="section-head"><div><span className="eyebrow">Kategorie</span><h2>Znajdź właściwy pojazd</h2></div><p className="section-lead">Szybkie wejście do najpopularniejszych segmentów. Filtry katalogu pozwalają zawęzić wyniki po marce, roku, cenie i przebiegu.</p></div>
      <div className="category-grid">
        {[['Samochody dostawcze','Dostawcze','Van'],['Ciężarówki > 3,5 t','Ciężarówki','Truck'],['Furgony','Furgony','Cargo'],['Samochody osobowe','Osobowe','Car']].map(([query,title,tag])=><Link key={query} href={`/samochody?category=${encodeURIComponent(query)}`} className="category-card"><span className="category-icon"><Icon name="truck" size={22}/></span><div><div className="card-kicker">{tag}</div><strong>{title}</strong></div></Link>)}
      </div>
    </div></section>

    <section className="section" style={{paddingTop:10}}><div className="container">
      <div className="section-head"><div><span className="eyebrow">Polecane</span><h2>Wybrane samochody</h2></div><Link className="btn btn-ghost" href="/samochody">Cały katalog <Icon name="arrow"/></Link></div>
      <div className="card-grid">{featured.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div>
    </div></section>

    <section id="dlaczego-my" className="section"><div className="container">
      <div className="trust-strip">
        <div className="trust-item"><Icon name="shield" size={25}/><b>Sprawdzony stan</b><span>Przed publikacją weryfikujemy podstawowe dane techniczne i dokumenty.</span></div>
        <div className="trust-item"><Icon name="check" size={25}/><b>Transparentna oferta</b><span>Rok, przebieg, DMC, wyposażenie i status pojazdu w jednym miejscu.</span></div>
        <div className="trust-item"><Icon name="finance" size={25}/><b>Leasing i kredyt</b><span>Możliwość przekazania zapytania o finansowanie razem z wybranym pojazdem.</span></div>
        <div className="trust-item"><Icon name="truck" size={25}/><b>Dla firm i klientów</b><span>Oferta dopasowana zarówno do transportu, jak i codziennej jazdy.</span></div>
      </div>
    </div></section>
  </>;
}
