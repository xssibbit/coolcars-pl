import Link from "next/link";
import { db } from "@/lib/db";
import { SearchForm } from "@/components/SearchForm";
import { VehicleCard } from "@/components/VehicleCard";
import { Icon } from "@/components/Icons";

const categories = [
  { title: "Samochody dostawcze", meta: "Vany, chłodnie i zabudowy", query: "Samochody dostawcze" },
  { title: "Ciężarówki", meta: "Pojazdy powyżej 3,5 t", query: "Ciężarówki > 3,5 t" },
  { title: "Furgony", meta: "Transport miejski i regionalny", query: "Furgony" },
  { title: "Samochody osobowe", meta: "Auta do firmy i na co dzień", query: "Samochody osobowe" },
];

export default async function Home() {
  const [featured, brandRows] = await Promise.all([
    db.vehicle.findMany({ where: { featured: true, status: { not: "DRAFT" } }, take: 6, orderBy: { createdAt: "desc" } }),
    db.vehicle.findMany({ select: { brand: true }, distinct: ["brand"], orderBy: { brand: "asc" } }),
  ]);
  const brands = brandRows.map(x => x.brand);
  const heroVehicle = featured[0];
  const heroPrice = heroVehicle
    ? new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(heroVehicle.priceNet)
    : null;

  return <>
    <section className="hero">
      <div className="container">
        <div className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">COOL CARS · Tarczyn</span>
            <h1>Samochody gotowe do pracy.</h1>
            <p>Sprzedajemy samochody osobowe, dostawcze i ciężarowe. Pokazujemy konkretne dane, cenę netto i brutto oraz faktyczny status pojazdu — bez zbędnego marketingu.</p>
            <div className="hero-actions">
              <Link href="/samochody" className="btn btn-accent">Zobacz samochody <Icon name="arrow"/></Link>
              <a href="#kontakt" className="btn btn-ghost">Kontakt</a>
            </div>
          </div>
          <div className="hero-media">
            <img src={heroVehicle?.image || "/vehicles/truck-3.svg"} alt={heroVehicle?.title || "Samochód z oferty CoolCars"}/>
            {heroVehicle && <div className="hero-media-caption">
              <span>Aktualnie w ofercie</span>
              <strong>{heroVehicle.title}</strong>
              <small>{heroPrice} netto · {heroVehicle.year} · {heroVehicle.mileage.toLocaleString("pl-PL")} km</small>
            </div>}
          </div>
        </div>
        <SearchForm brands={brands}/>
      </div>
    </section>

    <section id="kategorie" className="section section-soft">
      <div className="container">
        <div className="section-head">
          <div><span className="eyebrow">Oferta</span><h2>Wybierz segment</h2></div>
          <p className="section-lead">Nie komplikujemy katalogu. Wybierz typ pojazdu, a później zawęź wyniki po marce, roku, cenie i przebiegu.</p>
        </div>
        <div className="category-list">
          {categories.map((item, index) => <Link key={item.query} href={`/samochody?category=${encodeURIComponent(item.query)}`} className="category-row">
            <span className="category-index">0{index + 1}</span>
            <div><strong>{item.title}</strong><span style={{display:"block", marginTop:5}}>{item.meta}</span></div>
            <span className="category-arrow"><Icon name="arrow" size={17}/></span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><span className="eyebrow">Dostępne teraz</span><h2>Wybrane samochody</h2></div>
          <Link className="btn btn-ghost" href="/samochody">Pełna oferta <Icon name="arrow"/></Link>
        </div>
        <div className="card-grid">{featured.map(v => <VehicleCard key={v.id} vehicle={v}/>)}</div>
      </div>
    </section>

    <section id="dlaczego-my" className="section section-soft">
      <div className="container editorial">
        <div className="editorial-copy">
          <span className="eyebrow">Jak sprzedajemy</span>
          <h2>Najpierw samochód. Potem decyzja.</h2>
          <p>Oferta ma pomóc szybko ocenić, czy dany pojazd pasuje do Twojej pracy lub firmy. Dlatego ważniejsze od efektownych haseł są dla nas czytelne parametry, zdjęcia i możliwość szybkiego kontaktu.</p>
          <Link href="/samochody" className="btn btn-primary" style={{marginTop:12}}>Przejdź do katalogu</Link>
        </div>
        <div className="editorial-list">
          <div className="editorial-point"><span className="editorial-point-number">01</span><div><strong>Czytelne dane pojazdu</strong><p>Rok produkcji, przebieg, DMC, ładowność, paliwo, skrzynia biegów i lokalizacja w jednym miejscu.</p></div></div>
          <div className="editorial-point"><span className="editorial-point-number">02</span><div><strong>Cena netto i brutto</strong><p>Od razu widzisz wartość zakupu bez przeliczania VAT i szukania ceny w opisie ogłoszenia.</p></div></div>
          <div className="editorial-point"><span className="editorial-point-number">03</span><div><strong>Finansowanie i szybki kontakt</strong><p>Możesz wysłać zapytanie o konkretny samochód oraz porozmawiać o leasingu lub kredycie.</p></div></div>
        </div>
      </div>
    </section>
  </>;
}
