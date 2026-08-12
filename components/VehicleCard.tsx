import Link from "next/link";
import type { Vehicle } from "@prisma/client";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

export function VehicleCard({ vehicle, locale = "pl" }: { vehicle: Vehicle; locale?: Locale }) {
  const en = locale === "en";
  const label = vehicle.status === "AVAILABLE" ? (en ? "Available" : "Dostępny") : vehicle.status === "RESERVED" ? (en ? "Reserved" : "Rezerwacja") : vehicle.status === "SOLD" ? (en ? "Sold" : "Sprzedany") : (en ? "Preparing" : "W przygotowaniu");
  return <article className="vehicle-card">
    <Link href={`/samochody/${vehicle.slug}`} className="vehicle-image-wrap">
      <img className="vehicle-image" src={vehicle.image} alt={vehicle.title}/>
      <span className="badge">{label}</span>
    </Link>
    <div className="card-body">
      <div className="card-kicker">{vehicle.brand} · {vehicle.stockNumber}</div>
      <Link href={`/samochody/${vehicle.slug}`}><div className="card-title">{vehicle.title}</div></Link>
      <div className="spec-row vehicle-meta-row">
        <span className="spec-pill vehicle-meta-item"><Icon name="calendar" size={14}/><span>{vehicle.year}</span></span>
        <span className="spec-pill vehicle-meta-item"><Icon name="gauge" size={14}/><span>{formatKm(vehicle.mileage)}</span></span>
        <span className="spec-pill vehicle-meta-item"><Icon name="fuel" size={14}/><span>{vehicle.fuel}</span></span>
      </div>
      <div className="price-row">
        <div className="price vehicle-price-block">
          <span className="vehicle-price-icon"><Icon name="tag" size={16}/></span>
          <div><strong>{formatPln(vehicle.priceNet)}</strong><small>{en ? "Net" : "Netto"} · {formatPln(grossFromNet(vehicle.priceNet, vehicle.vatRate))} {en ? "gross" : "brutto"}</small></div>
        </div>
        <Link className="arrow-link" href={`/samochody/${vehicle.slug}`} aria-label={`${en ? "View" : "Zobacz"} ${vehicle.title}`}><Icon name="arrow"/></Link>
      </div>
    </div>
  </article>;
}
