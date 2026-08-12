import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { FavoriteButton } from "@/components/FavoriteButton";
import { InquiryForm } from "@/components/InquiryForm";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { VehicleGallery } from "@/components/VehicleGallery";

export default async function VehicleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const en = locale === "en";
  const vehicle = await db.vehicle.findUnique({
    where: { slug },
    include: {
      favorites: { where: { userId: user?.id ?? "__guest__" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!vehicle || vehicle.status === "DRAFT") notFound();

  const isFav = !!user && vehicle.favorites.length > 0;
  const statusClass = vehicle.status === "RESERVED" ? "reserved" : vehicle.status === "SOLD" ? "sold" : "";
  const statusLabel = vehicle.status === "AVAILABLE" ? (en ? "Available" : "Dostępny") : vehicle.status === "RESERVED" ? (en ? "Reserved" : "Zarezerwowany") : vehicle.status === "SOLD" ? (en ? "Sold" : "Sprzedany") : (en ? "Preparing" : "W przygotowaniu");
  const specs = en ? [
    ["Year", String(vehicle.year)], ["Mileage", formatKm(vehicle.mileage)], ["Fuel", vehicle.fuel], ["Transmission", vehicle.transmission], ["Power", vehicle.powerHp ? `${vehicle.powerHp} HP` : "—"], ["Engine", vehicle.engineCapacity ? `${vehicle.engineCapacity} cm³` : "—"], ["GVW", vehicle.dmc ? `${vehicle.dmc} kg` : "—"], ["Payload", vehicle.payload ? `${vehicle.payload} kg` : "—"], ["Location", vehicle.location], ["Stock number", vehicle.stockNumber],
  ] : [
    ["Rok produkcji", String(vehicle.year)], ["Przebieg", formatKm(vehicle.mileage)], ["Paliwo", vehicle.fuel], ["Skrzynia", vehicle.transmission], ["Moc", vehicle.powerHp ? `${vehicle.powerHp} KM` : "—"], ["Pojemność", vehicle.engineCapacity ? `${vehicle.engineCapacity} cm³` : "—"], ["DMC", vehicle.dmc ? `${vehicle.dmc} kg` : "—"], ["Ładowność", vehicle.payload ? `${vehicle.payload} kg` : "—"], ["Lokalizacja", vehicle.location], ["Nr oferty", vehicle.stockNumber],
  ];
  const gallery = vehicle.images.length ? vehicle.images.map((image) => image.url) : [vehicle.image];

  return <section className="section-tight"><div className="container detail-grid">
    <div>
      <VehicleGallery images={gallery} title={vehicle.title}/>
      <div className="spec-table">{specs.map(([key, value]) => <div className="spec-cell" key={key}><small>{key}</small><strong>{value}</strong></div>)}</div>
      <div className="content-card"><h2>{en ? "Vehicle description" : "Opis pojazdu"}</h2><p>{vehicle.description}</p></div>
      <FinanceCalculator grossPrice={grossFromNet(vehicle.priceNet, vehicle.vatRate)} locale={locale}/>
    </div>
    <aside className="detail-card">
      <span className={`status ${statusClass}`}>{statusLabel}</span>
      <div className="card-kicker" style={{ marginTop: 18 }}>{vehicle.category} · {vehicle.stockNumber}</div>
      <h1 className="detail-title">{vehicle.title}</h1>
      <div className="detail-price">{formatPln(vehicle.priceNet)} {en ? "net" : "netto"}</div>
      <div className="detail-price-gross">{formatPln(grossFromNet(vehicle.priceNet, vehicle.vatRate))} {en ? "gross" : "brutto"} · VAT {vehicle.vatRate}%</div>
      <div style={{ display: "grid", gap: 10 }}>
        <FavoriteButton vehicleId={vehicle.id} initial={isFav} loggedIn={!!user} locale={locale}/>
        <a className="btn btn-primary" href="#zapytanie">{en ? "Ask about this vehicle" : "Zapytaj o ofertę"}</a>
      </div>
      <div id="zapytanie" style={{ borderTop: "1px solid #eef0f2", marginTop: 24, paddingTop: 22 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 12px" }}>{en ? "Quick contact" : "Szybki kontakt"}</h2>
        <InquiryForm vehicleId={vehicle.id} defaultName={user?.name} defaultEmail={user?.email} locale={locale}/>
      </div>
    </aside>
  </div></section>;
}
