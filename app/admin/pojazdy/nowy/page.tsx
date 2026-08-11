import { requireAdmin } from "@/lib/auth"; import { AdminShell } from "@/components/AdminShell"; import { VehicleForm } from "@/components/VehicleForm";
export const metadata={title:'Dodaj pojazd — Admin'};
export default async function NewVehicle(){await requireAdmin();return <AdminShell><h1>Nowy pojazd</h1><p className="dashboard-sub">Po zapisaniu pojazd pojawi się w katalogu, jeśli status nie jest ustawiony na „Szkic”.</p><VehicleForm/></AdminShell>}
