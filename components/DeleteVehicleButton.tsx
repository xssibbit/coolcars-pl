"use client";
import { useState } from "react"; import { useRouter } from "next/navigation"; import { Icon } from "@/components/Icons";
export function DeleteVehicleButton({id}:{id:string}){const [busy,setBusy]=useState(false);const router=useRouter();return <button className="icon-btn" disabled={busy} title="Usuń" onClick={async()=>{if(!confirm('Usunąć ten pojazd?'))return;setBusy(true);const r=await fetch(`/api/admin/vehicles/${id}`,{method:'DELETE'});setBusy(false);if(r.ok)router.refresh();else alert('Nie udało się usunąć pojazdu.');}}><Icon name="trash" size={15}/></button>}
