import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { VehicleCard } from "@/components/VehicleCard";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata={title:'Moje konto'};
export default async function AccountPage(){const user=await requireUser();const favorites=await db.favorite.findMany({where:{userId:user.id},include:{vehicle:true},orderBy:{createdAt:'desc'}});return <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Moje konto</span><h2>Cześć, {user.name.split(' ')[0]}</h2><p className="section-lead">Tutaj znajdziesz zapisane pojazdy. Oferty aktualizują się wraz ze zmianą statusu w panelu administratora.</p></div><LogoutButton/></div>{user.role==='ADMIN'&&<div className="note" style={{marginBottom:22}}>Masz uprawnienia administratora. Panel zarządzania znajduje się pod adresem <b>/admin</b>.</div>}{favorites.length?<div className="card-grid">{favorites.map(f=><VehicleCard key={f.vehicleId} vehicle={f.vehicle}/>)}</div>:<div className="empty">Nie masz jeszcze zapisanych ofert. Kliknij „Zapisz pojazd” na karcie samochodu.</div>}</div></section>}
