import Link from "next/link";
import type { Vehicle } from "@prisma/client";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { Icon } from "@/components/Icons";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const label = vehicle.status === "AVAILABLE" ? "Dostępny" : vehicle.status === "RESERVED" ? "Rezerwacja" : vehicle.status === "SOLD" ? "Sprzedany" : "W przygotowaniu";
  return <article className="vehicle-card">
    <Link href={`/samochody/${vehicle.slug}`} className="vehicle-image-wrap">
      <img className="vehicle-image" src={vehicle.image} alt={vehicle.title}/>
      <span className="badge">{label}</span>
    </Link>
    <div className="card-body">
      <div className="card-kicker">{vehicle.brand} · {vehicle.stockNumber}</div>
      <Link href={`/samochody/${vehicle.slug}`}><div className="card-title">{vehicle.title}</div></Link>
      <div className="spec-row"><span className="spec-pill">{vehicle.year}</span><span className="spec-pill">{formatKm(vehicle.mileage)}</span><span className="spec-pill">{vehicle.fuel}</span></div>
      <div className="price-row"><div className="price"><strong>{formatPln(vehicle.priceNet)}</strong><small>Netto · {formatPln(grossFromNet(vehicle.priceNet, vehicle.vatRate))} brutto</small></div><Link className="arrow-link" href={`/samochody/${vehicle.slug}`} aria-label={`Zobacz ${vehicle.title}`}><Icon name="arrow"/></Link></div>
    </div>
  </article>
}
