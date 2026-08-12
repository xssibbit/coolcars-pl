"use client";

import { useState } from "react";

export function VehicleGallery({ images, title }: { images: string[]; title: string }) {
  const safeImages = images.length ? images : ["/vehicles/truck-1.svg"];
  const [active, setActive] = useState(0);

  return <div className="vehicle-gallery">
    <div className="detail-image vehicle-gallery-main">
      <img src={safeImages[active]} alt={`${title} — zdjęcie ${active + 1}`}/>
    </div>
    {safeImages.length > 1 && <div className="vehicle-thumbs">
      {safeImages.map((src, index) => <button
        type="button"
        className={`vehicle-thumb ${index === active ? "active" : ""}`}
        key={`${src}-${index}`}
        onClick={() => setActive(index)}
        aria-label={`Pokaż zdjęcie ${index + 1}`}
      ><img src={src} alt=""/></button>)}
    </div>}
  </div>;
}
