import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { formatKm, formatPln, grossFromNet } from "@/lib/format";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";
import { InquiryForm } from "@/components/InquiryForm";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { VehicleGallery } from "@/components/VehicleGallery";
import { VehicleCard } from "@/components/VehicleCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { VehicleViewTracker, TrackedCallLink } from "@/components/VehicleAnalytics";
import { VehicleContactActions } from "@/components/VehicleContactActions";
import { Icon } from "@/components/Icons";

const isRealImage=(url:string)=>!!url&&!url.startsWith('/vehicles/');

export default async function VehicleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const en = locale === "en";
  const vehicle = await db.vehicle.findUnique({where:{slug},include:{favorites:{where:{userId:user?.id??"__guest__"}},images:{orderBy:{sortOrder:"asc"}}}});
  if (!vehicle || vehicle.status === "DRAFT") notFound();

  const similar=await db.vehicle.findMany({where:{id:{not:vehicle.id},status:{not:"DRAFT"},OR:[{category:vehicle.category},{brand:vehicle.brand}]},take:3,orderBy:[{featured:'desc'},{createdAt:'desc'}],include:{favorites:{where:{userId:user?.id??'__guest__'}},images:{orderBy:{sortOrder:'asc'}}}});
  const isFav = !!user && vehicle.favorites.length > 0;
  const statusClass = vehicle.status === "RESERVED" ? "reserved" : vehicle.status === "SOLD" ? "sold" : "";
  const statusLabel = vehicle.status === "AVAILABLE" ? (en ? "Available" : "Dostępny") : vehicle.status === "RESERVED" ? (en ? "Reserved" : "Zarezerwowany") : vehicle.status === "SOLD" ? (en ? "Sold" : "Sprzedany") : (en ? "Preparing" : "W przygotowaniu");
  const specs = en ? [["Year",String(vehicle.year)],["Mileage",formatKm(vehicle.mileage)],["Fuel",vehicle.fuel],["Transmission",vehicle.transmission],["Power",vehicle.powerHp?`${vehicle.powerHp} HP`:"—"],["Engine",vehicle.engineCapacity?`${vehicle.engineCapacity} cm³`:"—"],["GVW",vehicle.dmc?`${vehicle.dmc} kg`:"—"],["Payload",vehicle.payload?`${vehicle.payload} kg`:"—"],["Location",vehicle.location],["Stock number",vehicle.stockNumber]] : [["Rok produkcji",String(vehicle.year)],["Przebieg",formatKm(vehicle.mileage)],["Paliwo",vehicle.fuel],["Skrzynia",vehicle.transmission],["Moc",vehicle.powerHp?`${vehicle.powerHp} KM`:"—"],["Pojemność",vehicle.engineCapacity?`${vehicle.engineCapacity} cm³`:"—"],["DMC",vehicle.dmc?`${vehicle.dmc} kg`:"—"],["Ładowność",vehicle.payload?`${vehicle.payload} kg`:"—"],["Lokalizacja",vehicle.location],["Nr oferty",vehicle.stockNumber]];
  const gallery = vehicle.images.length ? vehicle.images.map(image=>image.url) : [vehicle.image];
  const realGallery=gallery.filter(isRealImage); const mainImage=realGallery[0]; const gross=grossFromNet(vehicle.priceNet,vehicle.vatRate);

  return <>
    <VehicleViewTracker vehicleId={vehicle.id}/>
    <section className="vehicle-detail-hero"><div className="container">
      <div className="detail-breadcrumb"><Link href="/samochody">{en?'Vehicles':'Samochody'}</Link><span>›</span><Link href={`/samochody?brand=${encodeURIComponent(vehicle.brand)}`}>{vehicle.brand}</Link><span>›</span><b>{vehicle.model}</b></div>
      <div className="detail-heading-mobile"><div><span className={`status ${statusClass}`}>{statusLabel}</span><h1>{vehicle.title}</h1></div><strong>{formatPln(vehicle.priceNet)} <small>{en?'net':'netto'}</small></strong></div>
      <div className="detail-grid premium-detail-grid">
        <div className="detail-main-column">
          <VehicleGallery images={gallery} title={vehicle.title} locale={locale}/>
          <div className="detail-key-specs"><span><Icon name="calendar"/><small>{en?'Year':'Rok'}</small><b>{vehicle.year}</b></span><span><Icon name="gauge"/><small>{en?'Mileage':'Przebieg'}</small><b>{formatKm(vehicle.mileage)}</b></span><span><Icon name="settings"/><small>{en?'Transmission':'Skrzynia'}</small><b>{vehicle.transmission}</b></span><span><Icon name="pin"/><small>{en?'Location':'Lokalizacja'}</small><b>{vehicle.location}</b></span></div>
          <div className="spec-table premium-spec-table">{specs.map(([key,value])=><div className="spec-cell" key={key}><small>{key}</small><strong>{value}</strong></div>)}</div>
          <div className="content-card vehicle-description-card"><span className="eyebrow">{en?'Details':'Szczegóły'}</span><h2>{en?'Vehicle description':'Opis pojazdu'}</h2><p>{vehicle.description}</p></div>
          <FinanceCalculator grossPrice={gross} locale={locale}/>
        </div>
        <aside className="detail-card premium-detail-card">
          <span className={`status ${statusClass}`}>{statusLabel}</span>
          <div className="card-kicker">{vehicle.category} · {vehicle.stockNumber}</div>
          <h1 className="detail-title">{vehicle.title}</h1>
          <div className="detail-price">{formatPln(vehicle.priceNet)} <small>{en?"net":"netto"}</small></div>
          <div className="detail-price-gross">{formatPln(gross)} {en?"gross":"brutto"} · VAT {vehicle.vatRate}%</div>
          <div className="detail-mini-specs"><span><Icon name="calendar" size={15}/>{vehicle.year}</span><span><Icon name="gauge" size={15}/>{formatKm(vehicle.mileage)}</span><span><Icon name="pin" size={15}/>{vehicle.location}</span></div>
          <div className="detail-action-grid"><FavoriteButton vehicleId={vehicle.id} initial={isFav} loggedIn={!!user} locale={locale}/><CompareButton vehicleId={vehicle.id} locale={locale}/><a className="btn btn-primary detail-inquiry-btn" href="#zapytanie">{en?"Ask about this vehicle":"Zapytaj o ofertę"}</a><TrackedCallLink vehicleId={vehicle.id} className="btn btn-ghost detail-call-btn"><Icon name="phone" size={17}/>{en?'Call advisor':'Zadzwoń do doradcy'}</TrackedCallLink></div>
          <VehicleContactActions vehicleId={vehicle.id} title={vehicle.title} stockNumber={vehicle.stockNumber} defaultName={user?.name} locale={locale}/>
          <div className="vehicle-trust-box"><div><Icon name="check"/><span><strong>{en?'Clear vehicle data':'Czytelne dane pojazdu'}</strong><small>{en?'Key specifications in one place':'Najważniejsze parametry w jednym miejscu'}</small></span></div><div><Icon name="tag"/><span><strong>{en?'Net and gross price':'Cena netto i brutto'}</strong><small>VAT {vehicle.vatRate}%</small></span></div><div><Icon name="finance"/><span><strong>{en?'Financing support':'Możliwość finansowania'}</strong><small>{en?'Ask for an individual simulation':'Poproś o indywidualną symulację'}</small></span></div><div><Icon name="truck"/><span><strong>{en?'Export support':'Wsparcie eksportowe'}</strong><small>{en?'Direct contact with our team':'Bezpośredni kontakt z zespołem'}</small></span></div></div>
          <div id="zapytanie" className="detail-inquiry-section"><h2>{en?"Quick contact":"Szybki kontakt"}</h2><InquiryForm vehicleId={vehicle.id} defaultName={user?.name} defaultEmail={user?.email} locale={locale}/></div>
        </aside>
      </div>
    </div></section>

    {similar.length>0&&<section className="section similar-section"><div className="container"><div className="section-head"><div><span className="eyebrow">{en?'You may also like':'Może Cię zainteresować'}</span><h2>{en?'Similar vehicles':'Podobne pojazdy'}</h2></div><Link href={`/samochody?category=${encodeURIComponent(vehicle.category)}`} className="btn btn-ghost">{en?'See more':'Zobacz więcej'} <Icon name="arrow" size={16}/></Link></div><div className="card-grid similar-grid">{similar.map(v=><VehicleCard key={v.id} vehicle={v} locale={locale} loggedIn={!!user} initialFavorite={v.favorites.length>0} imageUrls={v.images.map(i=>i.url)}/>)}</div></div></section>}

    <RecentlyViewed vehicle={{id:vehicle.id,slug:vehicle.slug,title:vehicle.title,brand:vehicle.brand,image:mainImage,priceNet:vehicle.priceNet,year:vehicle.year,mileage:vehicle.mileage}} locale={locale}/>

    <div className="mobile-vehicle-cta"><div><small>{en?'Net price':'Cena netto'}</small><strong>{formatPln(vehicle.priceNet)}</strong></div><TrackedCallLink vehicleId={vehicle.id} className="mobile-call-btn"><Icon name="phone" size={18}/><span>{en?'Call':'Zadzwoń'}</span></TrackedCallLink><VehicleContactActions vehicleId={vehicle.id} title={vehicle.title} stockNumber={vehicle.stockNumber} defaultName={user?.name} locale={locale} compact/><a className="mobile-inquiry-btn" href="#zapytanie">{en?'Ask':'Zapytaj'}</a></div>
  </>;
}
