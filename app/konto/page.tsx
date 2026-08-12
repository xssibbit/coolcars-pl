import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";
import { VehicleCard } from "@/components/VehicleCard";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AccountPage(){
  const [user,locale]=await Promise.all([requireUser(),getLocale()]); const en=locale==='en';
  const favorites=await db.favorite.findMany({where:{userId:user.id},include:{vehicle:true},orderBy:{createdAt:'desc'}});
  return <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">{en?'My account':'Moje konto'}</span><h2>{en?'Hi':'Cześć'}, {user.name.split(' ')[0]}</h2><p className="section-lead">{en?'Your saved vehicles are shown here and their status updates automatically when the offer changes.':'Tutaj znajdziesz zapisane pojazdy. Oferty aktualizują się wraz ze zmianą statusu w panelu administratora.'}</p></div><LogoutButton locale={locale}/></div>{user.role==='ADMIN'&&<div className="note" style={{marginBottom:22}}>{en?'You have administrator access. The management panel is available at ':'Masz uprawnienia administratora. Panel zarządzania znajduje się pod adresem '}<b>/admin</b>.</div>}{favorites.length?<div className="card-grid">{favorites.map(f=><VehicleCard key={f.vehicleId} vehicle={f.vehicle} locale={locale}/>)}</div>:<div className="empty">{en?'You have no saved vehicles yet. Use “Save vehicle” on a listing.':'Nie masz jeszcze zapisanych ofert. Kliknij „Zapisz pojazd” na karcie samochodu.'}</div>}</div></section>;
}
