import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import { VehicleForm } from "@/components/VehicleForm";

export const metadata = { title: "Edytuj pojazd — Admin" };

export default async function EditVehicle({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const vehicle = await db.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!vehicle) notFound();

  return <AdminShell>
    <h1>Edytuj pojazd</h1>
    <p className="dashboard-sub">{vehicle.stockNumber} · {vehicle.title}</p>
    <VehicleForm vehicle={{ ...vehicle, status: vehicle.status }} />
  </AdminShell>;
}
