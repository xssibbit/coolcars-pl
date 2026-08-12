import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";
import { VehicleCard } from "@/components/VehicleCard";
import { LogoutButton } from "@/components/LogoutButton";
import { AccountRecentlyViewed } from "@/components/AccountRecentlyViewed";
import { RemoveSavedSearchButton } from "@/components/SavedSearchActions";

const statusPl:{[k:string]:string}={NEW:"Nowe",CONTACTED:"Kontakt wykonany",INTERESTED:"Zainteresowany",NEGOTIATION:"Negocjacje",WON:"Zakończone",LOST:"Zamknięte"};
const statusEn:{[k:string]:string}={NEW:"New",CONTACTED:"Contacted",INTERESTED:"Interested",NEGOTIATION:"Negotiation",WON:"Completed",LOST:"Closed"};

export default async function AccountPage(){
  const [user,locale]=await Promise.all([requireUser(),getLocale()]); const en=locale==='en';
  const [favorites,inquiries,savedSearches]=await Promise.all([
    db.favorite.findMany({where:{userId:user.id},include:{vehicle:{include:{images:{orderBy:{sortOrder:'asc'}}}}},orderBy:{createdAt:'desc'}}),
    db.inquiry.findMany({where:{userId:user.id},include:{vehicle:{select:{title:true,slug:true,stockNumber:true}}},orderBy:{createdAt:'desc'},take:20}),
    db.savedSearch.findMany({where:{userId:user.id},orderBy:{updatedAt:'desc'}}),
  ]);
  const statuses=en?statusEn:statusPl;
  return <section className="section account-v2"><div className="container">
    <div className="account-hero"><div><span className="eyebrow">{en?'My account':'Moje konto'}</span><h1>{en?'Hi':'Cześć'}, {user.name.split(' ')[0]}</h1><p>{en?'Your vehicles, enquiries and saved searches in one place.':'Twoje samochody, zapytania i zapisane wyszukiwania w jednym miejscu.'}</p></div><LogoutButton locale={locale}/></div>
    {user.role==='ADMIN'&&<div className="note account-admin-note">{en?'You have administrator access. Open ':'Masz uprawnienia administratora. Otwórz '}<Link href="/admin"><b>{en?'Admin panel':'Panel administratora'}</b></Link>.</div>}
    <nav className="account-tabs" aria-label={en?'Account sections':'Sekcje konta'}><a href="#ulubione">{en?'Saved':'Ulubione'} <b>{favorites.length}</b></a><a href="#zapytania">{en?'Enquiries':'Zapytania'} <b>{inquiries.length}</b></a><a href="#ostatnie">{en?'Recently viewed':'Ostatnio oglądane'}</a><a href="#wyszukiwania">{en?'Saved searches':'Wyszukiwania'} <b>{savedSearches.length}</b></a></nav>
    <div className="account-summary-grid"><div><span>{en?'Saved vehicles':'Ulubione pojazdy'}</span><strong>{favorites.length}</strong></div><div><span>{en?'Your enquiries':'Twoje zapytania'}</span><strong>{inquiries.length}</strong></div><div><span>{en?'Saved searches':'Zapisane wyszukiwania'}</span><strong>{savedSearches.length}</strong></div></div>

    <section id="ulubione" className="account-section"><div className="account-section-head"><div><span className="eyebrow">{en?'Shortlist':'Twoja lista'}</span><h2>{en?'Saved vehicles':'Ulubione'}</h2></div><Link className="btn btn-ghost" href="/samochody">{en?'Browse vehicles':'Przeglądaj samochody'}</Link></div>{favorites.length?<div className="card-grid account-favorites-grid">{favorites.map(f=><VehicleCard key={f.vehicleId} vehicle={f.vehicle} locale={locale} loggedIn initialFavorite imageUrls={f.vehicle.images.map(i=>i.url)}/>)}</div>:<div className="empty">{en?'You have no saved vehicles yet.':'Nie masz jeszcze zapisanych ofert.'}</div>}</section>

    <section id="zapytania" className="account-section"><div className="account-section-head"><div><span className="eyebrow">{en?'Contact history':'Historia kontaktu'}</span><h2>{en?'My enquiries':'Moje zapytania'}</h2></div></div>{inquiries.length?<div className="account-inquiry-list">{inquiries.map(x=><Link href={`/samochody/${x.vehicle.slug}`} key={x.id} className="account-inquiry-row"><div><small>{x.vehicle.stockNumber}</small><strong>{x.vehicle.title}</strong><span>{new Intl.DateTimeFormat(en?'en-GB':'pl-PL',{day:'2-digit',month:'short',year:'numeric'}).format(x.createdAt)}</span></div><div><span className={`account-inquiry-status status-${x.status.toLowerCase()}`}>{statuses[x.status]}</span><small>{en?'View vehicle':'Zobacz pojazd'} →</small></div></Link>)}</div>:<div className="account-empty-mini">{en?'You have not sent any enquiries yet.':'Nie wysłałeś jeszcze żadnego zapytania.'}</div>}</section>

    <section id="ostatnie" className="account-section"><div className="account-section-head"><div><span className="eyebrow">{en?'History':'Historia'}</span><h2>{en?'Recently viewed':'Ostatnio oglądane'}</h2></div></div><AccountRecentlyViewed locale={locale}/></section>

    <section id="wyszukiwania" className="account-section"><div className="account-section-head"><div><span className="eyebrow">{en?'Find faster':'Wracaj szybciej'}</span><h2>{en?'Saved searches':'Zapisane wyszukiwania'}</h2></div></div>{savedSearches.length?<div className="saved-search-list">{savedSearches.map(search=><div className="saved-search-row" key={search.id}><Link href={`/samochody${search.query?`?${search.query}`:''}`}><strong>{search.name}</strong><small>{en?'Open current results':'Otwórz aktualne wyniki'} →</small></Link><RemoveSavedSearchButton id={search.id} locale={locale}/></div>)}</div>:<div className="account-empty-mini">{en?'Save a set of filters in the vehicle catalog and it will appear here.':'Zapisz zestaw filtrów w katalogu, a pojawi się tutaj.'}</div>}</section>
  </div></section>;
}
