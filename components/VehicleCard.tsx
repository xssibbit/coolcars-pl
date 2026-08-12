import Link from "next/link";
import type { Vehicle } from "@prisma/client";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { Icon } from "@/components/Icons";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";
import { QuickViewButton } from "@/components/QuickViewButton";
import type { Locale } from "@/lib/i18n";

const isRealImage=(url:string)=>!!url && !url.startsWith('/vehicles/');

export function VehicleCard({ vehicle, locale = "pl", loggedIn=false, initialFavorite=false, imageUrl, imageUrls=[] }: { vehicle: Vehicle; locale?: Locale; loggedIn?:boolean; initialFavorite?:boolean; imageUrl?:string; imageUrls?:string[] }) {
  const en = locale === "en";
  const label = vehicle.status === "AVAILABLE" ? (en ? "Available" : "Dostępny") : vehicle.status === "RESERVED" ? (en ? "Reserved" : "Rezerwacja") : vehicle.status === "SOLD" ? (en ? "Sold" : "Sprzedany") : (en ? "Preparing" : "W przygotowaniu");
  const realImages=[...imageUrls.filter(isRealImage),...(isRealImage(imageUrl||'')?[imageUrl!]:[]),...(isRealImage(vehicle.image)?[vehicle.image]:[])].filter((x,i,a)=>a.indexOf(x)===i);
  const cardImage=realImages[0];
  return <article className="vehicle-card">
    <div className="vehicle-media-shell">
      <Link href={`/samochody/${vehicle.slug}`} className="vehicle-image-wrap">
        {cardImage?<img className="vehicle-image" src={cardImage} alt={vehicle.title}/>:<div className="vehicle-image-placeholder"><strong>COOL CARS</strong><span>{en?'Photos coming soon':'Zdjęcia wkrótce'}</span></div>}
        <span className="badge">{label}</span>
        {realImages.length>0&&<span className="vehicle-photo-count"><Icon name="camera" size={13}/>{realImages.length}</span>}
      </Link>
      <div className="vehicle-card-actions">
        <FavoriteButton vehicleId={vehicle.id} initial={initialFavorite} loggedIn={loggedIn} locale={locale} compact/>
        <CompareButton vehicleId={vehicle.id} locale={locale} compact/>
        <QuickViewButton vehicle={{id:vehicle.id,slug:vehicle.slug,title:vehicle.title,brand:vehicle.brand,year:vehicle.year,mileage:vehicle.mileage,priceNet:vehicle.priceNet,vatRate:vehicle.vatRate,fuel:vehicle.fuel,transmission:vehicle.transmission,location:vehicle.location}} images={realImages} locale={locale} loggedIn={loggedIn} initialFavorite={initialFavorite}/>
      </div>
    </div>
    <div className="card-body">
      <div className="card-kicker">{vehicle.brand} · {vehicle.stockNumber}</div>
      <Link href={`/samochody/${vehicle.slug}`}><div className="card-title">{vehicle.title}</div></Link>
      <div className="spec-row vehicle-meta-row">
        <span className="spec-pill vehicle-meta-item"><Icon name="calendar" size={14}/><span>{vehicle.year}</span></span>
        <span className="spec-pill vehicle-meta-item"><Icon name="gauge" size={14}/><span>{formatKm(vehicle.mileage)}</span></span>
        <span className="spec-pill vehicle-meta-item"><Icon name="fuel" size={14}/><span>{vehicle.fuel}</span></span>
      </div>
      <div className="price-row">
        <div className="price vehicle-price-block"><span className="vehicle-price-icon"><Icon name="tag" size={16}/></span><div><strong>{formatPln(vehicle.priceNet)}</strong><small>{en ? "Net" : "Netto"} · {formatPln(grossFromNet(vehicle.priceNet, vehicle.vatRate))} {en ? "gross" : "brutto"}</small></div></div>
        <Link className="arrow-link" href={`/samochody/${vehicle.slug}`} aria-label={`${en ? "View" : "Zobacz"} ${vehicle.title}`}><Icon name="arrow"/></Link>
      </div>
    </div>
  </article>;
}
