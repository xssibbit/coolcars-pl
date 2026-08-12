import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import { formatPln } from "@/lib/format";

export const metadata={title:'Admin 2.0 — CoolCars'};
type Search=Promise<Record<string,string|string[]|undefined>>;
const one=(v:string|string[]|undefined)=>Array.isArray(v)?v[0]:v;

export default async function AdminPage({searchParams}:{searchParams:Search}){
  await requireAdmin();
  const sp=await searchParams;
  const days=one(sp.range)==='7'?7:30;
  const from=new Date(Date.now()-(days-1)*86400000);from.setHours(0,0,0,0);
  const todayEnd=new Date();todayEnd.setHours(23,59,59,999);

  const [events,total,available,sold,newLeads,dueFollowups,favoriteGroups,vehicles]=await Promise.all([
    db.analyticsEvent.findMany({where:{createdAt:{gte:from}},select:{type:true,vehicleId:true,visitorId:true,createdAt:true}}),
    db.vehicle.count(),
    db.vehicle.count({where:{status:'AVAILABLE'}}),
    db.vehicle.count({where:{status:'SOLD'}}),
    db.inquiry.count({where:{status:'NEW'}}),
    db.inquiry.count({where:{nextFollowUp:{lte:todayEnd},status:{notIn:['WON','LOST']}}}),
    db.favorite.groupBy({by:['vehicleId'],_count:{_all:true}}),
    db.vehicle.findMany({select:{id:true,title:true,stockNumber:true,status:true,priceNet:true}}),
  ]);

  const count=(type:string)=>events.filter(e=>e.type===type).length;
  const views=count('VIEW'),calls=count('CALL'),inquiries=count('INQUIRY'),favorites=count('FAVORITE'),compares=count('COMPARE'),quickViews=count('QUICK_VIEW');
  const uniqueVisitors=new Set(events.filter(e=>e.type==='VIEW'&&e.visitorId).map(e=>e.visitorId)).size;
  const conversion=views?((inquiries/views)*100):0;

  const daysList=Array.from({length:days},(_,i)=>{const d=new Date(from);d.setDate(from.getDate()+i);return d});
  const dayKey=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const daily=daysList.map(date=>{
    const key=dayKey(date);const rows=events.filter(e=>dayKey(e.createdAt)===key);
    return {date,views:rows.filter(e=>e.type==='VIEW').length,leads:rows.filter(e=>e.type==='INQUIRY').length,calls:rows.filter(e=>e.type==='CALL').length};
  });
  const chartMax=Math.max(1,...daily.map(d=>d.views+d.leads+d.calls));

  const favMap=new Map(favoriteGroups.map(x=>[x.vehicleId,x._count._all]));
  const performance=vehicles.map(v=>{
    const ev=events.filter(e=>e.vehicleId===v.id);
    const m={views:ev.filter(e=>e.type==='VIEW').length,calls:ev.filter(e=>e.type==='CALL').length,inquiries:ev.filter(e=>e.type==='INQUIRY').length,favorites:ev.filter(e=>e.type==='FAVORITE').length,compares:ev.filter(e=>e.type==='COMPARE').length,quick:ev.filter(e=>e.type==='QUICK_VIEW').length};
    const score=m.views+m.quick*2+m.compares*3+m.favorites*4+m.calls*6+m.inquiries*10;
    return {...v,...m,currentFavorites:favMap.get(v.id)||0,score};
  }).filter(v=>v.score>0).sort((a,b)=>b.score-a.score).slice(0,8);

  return <AdminShell>
    <div className="admin-page-head analytics-head">
      <div><span className="admin-eyebrow">Admin 2.0</span><h1>Pulpit sprzedaży</h1><p className="dashboard-sub">Rzeczywiste zachowanie użytkowników, leady i kondycja aktualnej oferty.</p></div>
      <div className="range-switch"><Link className={days===7?'active':''} href="/admin?range=7">7 dni</Link><Link className={days===30?'active':''} href="/admin?range=30">30 dni</Link></div>
    </div>

    <div className="analytics-kpis">
      <div className="analytics-kpi primary"><span>Wyświetlenia ofert</span><strong>{views}</strong><small>{uniqueVisitors} unikalnych odwiedzających</small></div>
      <div className="analytics-kpi"><span>Zapytania</span><strong>{inquiries}</strong><small>Konwersja {conversion.toFixed(1)}%</small></div>
      <div className="analytics-kpi"><span>Kliknięcia telefonu</span><strong>{calls}</strong><small>Intencja bezpośredniego kontaktu</small></div>
      <div className="analytics-kpi"><span>Akcje zainteresowania</span><strong>{favorites+compares+quickViews}</strong><small>{favorites} zapisów · {compares} porównań · {quickViews} quick view</small></div>
    </div>

    <div className="admin-signal-row">
      <Link href="/admin/zapytania" className="admin-signal urgent"><span>Nowe leady</span><strong>{newLeads}</strong><small>Wymagają pierwszego kontaktu</small></Link>
      <Link href="/admin/zapytania" className="admin-signal"><span>Follow-up do dziś</span><strong>{dueFollowups}</strong><small>Zaplanowane kontakty do wykonania</small></Link>
      <div className="admin-signal"><span>Dostępne pojazdy</span><strong>{available}</strong><small>{total} wszystkich · {sold} sprzedanych</small></div>
    </div>

    <section className="panel analytics-panel" id="analytics">
      <div className="panel-head"><div><span className="admin-eyebrow">Aktywność</span><h2>Ruch i kontakty — {days} dni</h2></div><div className="chart-legend"><span><i className="legend-view"/>Wyświetlenia</span><span><i className="legend-call"/>Telefon</span><span><i className="legend-lead"/>Zapytania</span></div></div>
      <div className={`analytics-chart days-${days}`}>
        {daily.map((d,i)=>{
          const totalDay=d.views+d.calls+d.leads;
          const h=Math.max(totalDay?8:2,(totalDay/chartMax)*100);
          return <div className="chart-day" key={dayKey(d.date)} title={`${new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'2-digit'}).format(d.date)} · ${d.views} wyświetleń · ${d.calls} telefonów · ${d.leads} zapytań`}>
            <div className="chart-stack" style={{height:`${h}%`}}>{totalDay>0&&<><span className="chart-views" style={{flexGrow:Math.max(1,d.views)}}/><span className="chart-calls" style={{flexGrow:d.calls}}/><span className="chart-leads" style={{flexGrow:d.leads}}/></>}</div>
            {(days===7||i%5===0||i===daily.length-1)&&<small>{new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'2-digit'}).format(d.date)}</small>}
          </div>
        })}
      </div>
    </section>

    <section className="panel top-vehicles-panel">
      <div className="panel-head"><div><span className="admin-eyebrow">Performance</span><h2>Najbardziej angażujące oferty</h2></div><Link href="/admin/pojazdy" className="btn btn-ghost">Zarządzaj pojazdami</Link></div>
      {performance.length?<div className="table-wrap"><table className="performance-table"><thead><tr><th>Oferta</th><th>Wyświetlenia</th><th>Telefon</th><th>Leady</th><th>Porównania</th><th>Ulubione teraz</th><th>Cena netto</th></tr></thead><tbody>{performance.map(v=><tr key={v.id}><td><div className="table-title">{v.stockNumber} · {v.title}</div><span className="mini-status">{v.status}</span></td><td><b>{v.views}</b></td><td>{v.calls}</td><td>{v.inquiries}</td><td>{v.compares}</td><td>{v.currentFavorites}</td><td>{formatPln(v.priceNet)}</td></tr>)}</tbody></table></div>:<div className="analytics-empty">Analityka właśnie została uruchomiona. Dane o najpopularniejszych ofertach pojawią się po pierwszych wizytach użytkowników.</div>}
    </section>
  </AdminShell>
}
