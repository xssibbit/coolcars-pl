"use client";

import { useEffect } from "react";
import { trackVehicleEvent } from "@/lib/analytics-client";

export function VehicleViewTracker({ vehicleId }: { vehicleId: string }) {
  useEffect(() => {
    trackVehicleEvent("VIEW", vehicleId);
  }, [vehicleId]);
  return null;
}

export function TrackedCallLink({
  vehicleId,
  className,
  children,
}: {
  vehicleId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="tel:+48884367888"
      className={className}
      onClick={() => trackVehicleEvent("CALL", vehicleId)}
    >
      {children}
    </a>
  );
}
