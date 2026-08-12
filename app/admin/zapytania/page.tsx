import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import { AdminCRMBoard } from "@/components/AdminCRMBoard";

export const metadata={title:'CRM i zapytania — Admin'};

export default async function Inquiries(){
  await requireAdmin();
  const rows=await db.inquiry.findMany({
    include:{vehicle:{select:{title:true,stockNumber:true}}},
    orderBy:[{nextFollowUp:'asc'},{createdAt:'desc'}],
  });
  const initial=rows.map(x=>({
    id:x.id,name:x.name,email:x.email,phone:x.phone,message:x.message,status:x.status,adminNote:x.adminNote,
    nextFollowUp:x.nextFollowUp?.toISOString()??null,createdAt:x.createdAt.toISOString(),vehicle:x.vehicle,
  }));
  return <AdminShell>
    <div className="admin-page-head"><div><span className="admin-eyebrow">Sales CRM</span><h1>Leady i zapytania</h1><p className="dashboard-sub">Przeciągaj leady między etapami, zapisuj ustalenia i planuj następny kontakt.</p></div></div>
    <AdminCRMBoard initial={initial}/>
  </AdminShell>
}
