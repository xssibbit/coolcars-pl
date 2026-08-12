import Link from "next/link";
import { db } from "@/lib/db";
import { getLocale, localeTag } from "@/lib/i18n";
import { SearchForm } from "@/components/SearchForm";
import { VehicleCard } from "@/components/VehicleCard";
import { Icon } from "@/components/Icons";

export default async function Home() {
  const locale = await getLocale();
  const en = locale === "en";
  const [featured, brandRows, availableCount] = await Promise.all([
    db.vehicle.findMany({ where: { featured: true, status: { not: "DRAFT" } }, take: 6, orderBy: { createdAt: "desc" } }),
    db.vehicle.findMany({ select: { brand: true }, distinct: ["brand"], orderBy: { brand: "asc" } }),
    db.vehicle.count({ where: { status: "AVAILABLE" } }),
  ]);
  const brands = brandRows.map(x => x.brand);
  const heroVehicle = featured[0];
  const heroPrice = heroVehicle ? new Intl.NumberFormat(localeTag(locale), { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(heroVehicle.priceNet) : null;
  const categories = en ? [
    { title: "Commercial vehicles", meta: "Vans, refrigerated bodies and conversions", query: "Samochody dostawcze" },
    { title: "Trucks", meta: "Vehicles over 3.5 t", query: "Ciężarówki > 3,5 t" },
    { title: "Vans", meta: "Urban and regional transport", query: "Furgony" },
    { title: "Passenger cars", meta: "For business and everyday driving", query: "Samochody osobowe" },
  ] : [
    { title: "Samochody dostawcze", meta: "Vany, chłodnie i zabudowy", query: "Samochody dostawcze" },
    { title: "Ciężarówki", meta: "Pojazdy powyżej 3,5 t", query: "Ciężarówki > 3,5 t" },
    { title: "Furgony", meta: "Transport miejski i regionalny", query: "Furgony" },
    { title: "Samochody osobowe", meta: "Auta do firmy i na co dzień", query: "Samochody osobowe" },
  ];

  return <>
    <section className="market-hero">
      <div className="container">
        <div className="market-hero-grid">
          <div className="market-hero-copy">
            <span className="eyebrow">COOL CARS · {en ? "Verified inventory" : "Sprawdzona oferta"}</span>
            <h1>{en ? "Your next vehicle. Without the guesswork." : "Twój następny samochód. Bez zgadywania."}</h1>
            <p>{en ? "Passenger cars, commercial vehicles and trucks with clear specifications, net and gross pricing and direct contact with our team." : "Samochody osobowe, dostawcze i ciężarowe z czytelnymi parametrami, ceną netto i brutto oraz bezpośrednim kontaktem z naszym zespołem."}</p>
            <div className="market-hero-actions">
              <Link href="/samochody" className="btn btn-accent">{en ? "Browse vehicles" : "Przeglądaj ofertę"} <Icon name="arrow"/></Link>
              <a href="#kontakt" className="text-link">{en ? "Talk to an advisor" : "Porozmawiaj z doradcą"} <Icon name="arrow" size={16}/></a>
            </div>
            <div className="market-stats">
              <div><strong>{availableCount}</strong><span>{en ? "available now" : "dostępnych teraz"}</span></div>
              <div><strong>{brands.length}</strong><span>{en ? "makes in stock" : "marek w ofercie"}</span></div>
              <div><strong>3</strong><span>{en ? "sales locations" : "lokalizacje sprzedaży"}</span></div>
            </div>
          </div>
          <div className="market-hero-visual">
            <div className="hero-photo-shell"><img src={heroVehicle?.image || "/vehicles/truck-3.svg"} alt={heroVehicle?.title || "CoolCars vehicle"}/></div>
            {heroVehicle && <Link href={`/samochody/${heroVehicle.slug}`} className="hero-offer-card">
              <span>{en ? "Featured offer" : "Wyróżniona oferta"}</span>
              <strong>{heroVehicle.title}</strong>
              <div className="hero-offer-meta"><b>{heroPrice} {en ? "net" : "netto"}</b><small>{heroVehicle.year} · {heroVehicle.mileage.toLocaleString(localeTag(locale))} km</small></div>
            </Link>}
          </div>
        </div>
        <SearchForm brands={brands} locale={locale}/>
        <div className="quick-searches">
          <span>{en ? "Quick search:" : "Szybki wybór:"}</span>
          <Link href="/samochody?category=Samochody+dostawcze">{en ? "Commercial" : "Dostawcze"}</Link>
          <Link href="/samochody?category=Ciężarówki+%3E+3%2C5+t">{en ? "Trucks" : "Ciężarówki"}</Link>
          <Link href="/samochody?category=Furgony">{en ? "Vans" : "Furgony"}</Link>
          <Link href="/samochody?yearFrom=2022">{en ? "2022 and newer" : "Od 2022"}</Link>
          <Link href="/samochody?maxPrice=100000">{en ? "Up to 100k PLN net" : "Do 100 tys. netto"}</Link>
        </div>
      </div>
    </section>

    <section className="brand-strip-section"><div className="container"><div className="brand-strip-label">{en ? "Makes currently in stock" : "Marki aktualnie w ofercie"}</div><div className="brand-strip">{brands.slice(0,10).map(brand => <Link key={brand} href={`/samochody?brand=${encodeURIComponent(brand)}`}>{brand}</Link>)}</div></div></section>

    <section id="kategorie" className="section section-soft">
      <div className="container">
        <div className="section-head"><div><span className="eyebrow">{en ? "Browse" : "Oferta"}</span><h2>{en ? "Choose a vehicle type" : "Wybierz segment"}</h2></div><p className="section-lead">{en ? "Start with the type of vehicle, then narrow the results by make, year, mileage and net price." : "Zacznij od rodzaju pojazdu, a później zawęź wyniki po marce, roku, przebiegu i cenie netto."}</p></div>
        <div className="category-list">{categories.map((item, index) => <Link key={item.query} href={`/samochody?category=${encodeURIComponent(item.query)}`} className="category-row"><span className="category-index">0{index + 1}</span><div><strong>{item.title}</strong><span>{item.meta}</span></div><span className="category-arrow"><Icon name="arrow" size={17}/></span></Link>)}</div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-head"><div><span className="eyebrow">{en ? "Selected" : "Polecane"}</span><h2>{en ? "Vehicles worth a closer look" : "Samochody warte uwagi"}</h2></div><Link className="btn btn-ghost" href="/samochody">{en ? "View all" : "Pełna oferta"} <Icon name="arrow"/></Link></div>
        <div className="card-grid">{featured.slice(0,6).map(v => <VehicleCard key={v.id} vehicle={v} locale={locale}/>)}</div>
      </div>
    </section>

    <section id="dlaczego-my" className="section premium-service-section">
      <div className="container premium-service-grid">
        <div className="premium-service-copy"><span className="eyebrow">{en ? "Why CoolCars" : "Dlaczego CoolCars"}</span><h2>{en ? "A simpler way to buy the right vehicle." : "Prostszy sposób na zakup właściwego auta."}</h2><p>{en ? "We combine marketplace-style search with direct dealership service. You see the important details online and can speak to a person when you need a decision." : "Łączymy wygodę wyszukiwania jak na dużym portalu z bezpośrednią obsługą dealera. Najważniejsze dane widzisz online, a kiedy potrzebujesz decyzji — rozmawiasz z człowiekiem."}</p><Link href="/samochody" className="btn btn-primary">{en ? "Explore inventory" : "Zobacz ofertę"}</Link></div>
        <div className="premium-service-points">
          <div><b>01</b><strong>{en ? "Transparent pricing" : "Czytelna cena"}</strong><p>{en ? "Net, gross and VAT visible without searching through the description." : "Netto, brutto i VAT widoczne bez szukania w opisie."}</p></div>
          <div><b>02</b><strong>{en ? "Useful specifications" : "Konkretne parametry"}</strong><p>{en ? "Mileage, year, payload, DMC, transmission and location in one place." : "Przebieg, rok, ładowność, DMC, skrzynia i lokalizacja w jednym miejscu."}</p></div>
          <div><b>03</b><strong>{en ? "Financing support" : "Wsparcie finansowania"}</strong><p>{en ? "Ask about leasing or credit together with the selected vehicle." : "Zapytaj o leasing lub kredyt razem z wybranym pojazdem."}</p></div>
        </div>
      </div>
    </section>
  </>;
}
