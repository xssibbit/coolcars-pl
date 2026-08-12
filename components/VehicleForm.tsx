"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

type VehicleImage = { id: string; url: string; sortOrder?: number };
type V = {
  id?: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  priceNet: number;
  vatRate: number;
  stockNumber: string;
  category: string;
  fuel: string;
  transmission: string;
  powerHp: number | null;
  engineCapacity: number | null;
  dmc: number | null;
  payload: number | null;
  location: string;
  description: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "DRAFT";
  featured: boolean;
  image: string;
  images?: VehicleImage[];
};

const defaults: V = {
  title: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  mileage: 0,
  priceNet: 0,
  vatRate: 23,
  stockNumber: "",
  category: "Samochody dostawcze",
  fuel: "Diesel",
  transmission: "Manualna",
  powerHp: null,
  engineCapacity: null,
  dmc: null,
  payload: null,
  location: "Tarczyn",
  description: "",
  status: "AVAILABLE",
  featured: false,
  image: "/vehicles/truck-1.svg",
  images: [],
};

async function prepareImage(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1800;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("compression"))), "image/jpeg", 0.86),
    );
    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 8 * 1024 * 1024) return file;
    throw new Error(`Nie można przetworzyć pliku ${file.name}. Użyj JPG, PNG lub WEBP.`);
  }
}

export function VehicleForm({ vehicle }: { vehicle?: V }) {
  const data = vehicle ?? defaults;
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>(data.images ?? []);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  async function uploadPhotos(vehicleId: string) {
    for (let i = 0; i < files.length; i += 1) {
      const prepared = await prepareImage(files[i]);
      const safeName = prepared.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      await upload(`vehicles/${vehicleId}/${Date.now()}-${i}-${safeName}`, prepared, {
        access: "public",
        handleUploadUrl: "/api/admin/uploads",
        clientPayload: JSON.stringify({ vehicleId }),
      });
    }
  }

  async function checkPhotoStorage() {
    const response = await fetch("/api/admin/uploads", { method: "GET", cache: "no-store" });
    const json = await response.json().catch(() => ({}));
    return response.ok && json.blobConfigured === true;
  }

  async function removeImage(imageId: string) {
    if (!vehicle?.id) return;
    setRemoving(imageId);
    const response = await fetch(`/api/admin/vehicles/${vehicle.id}/images/${imageId}`, { method: "DELETE" });
    setRemoving(null);
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      setError(json.error || "Nie udało się usunąć zdjęcia");
      return;
    }
    setExistingImages((current) => current.filter((image) => image.id !== imageId));
    router.refresh();
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (files.length) {
      try {
        const storageReady = await checkPhotoStorage();
        if (!storageReady) {
          setLoading(false);
          setError("Magazyn zdjęć Vercel Blob nie jest połączony z projektem. Połącz Blob z projektem coolcars-pl i wykonaj nowy deployment.");
          return;
        }
      } catch {
        setLoading(false);
        setError("Nie udało się sprawdzić magazynu zdjęć. Spróbuj ponownie za chwilę.");
        return;
      }
    }

    const fd = new FormData(e.currentTarget);
    const nullable = (key: string) => {
      const value = String(fd.get(key) || "").trim();
      return value ? Number(value) : null;
    };
    const payload = {
      title: fd.get("title"),
      brand: fd.get("brand"),
      model: fd.get("model"),
      year: Number(fd.get("year")),
      mileage: Number(fd.get("mileage")),
      priceNet: Number(fd.get("priceNet")),
      vatRate: Number(fd.get("vatRate")),
      stockNumber: fd.get("stockNumber"),
      category: fd.get("category"),
      fuel: fd.get("fuel"),
      transmission: fd.get("transmission"),
      powerHp: nullable("powerHp"),
      engineCapacity: nullable("engineCapacity"),
      dmc: nullable("dmc"),
      payload: nullable("payload"),
      location: fd.get("location"),
      description: fd.get("description"),
      status: fd.get("status"),
      featured: fd.get("featured") === "on",
      image: data.image || "/vehicles/truck-1.svg",
    };

    const url = vehicle?.id ? `/api/admin/vehicles/${vehicle.id}` : "/api/admin/vehicles";
    const response = await fetch(url, {
      method: vehicle?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLoading(false);
      setError(json.error || "Nie udało się zapisać");
      return;
    }

    const savedId = vehicle?.id || json.id;
    try {
      if (savedId && files.length) await uploadPhotos(savedId);
    } catch (uploadError) {
      setLoading(false);
      setError(uploadError instanceof Error ? `Pojazd zapisany, ale zdjęcie nie zostało wysłane: ${uploadError.message}` : "Pojazd zapisany, ale nie udało się wysłać zdjęć.");
      return;
    }

    setLoading(false);
    router.push("/admin/pojazdy");
    router.refresh();
  }

  const f = (label: string, name: keyof V, type = "text", extra: Record<string, unknown> = {}) => (
    <div className="field"><label>{label}</label><input className="input" name={name} type={type} defaultValue={(data[name] ?? "") as string | number} {...extra}/></div>
  );

  return <form className="admin-form" onSubmit={submit}>
    <div className="form-grid">
      <div className="full">{f("Tytuł oferty", "title", "text", { required: true })}</div>
      {f("Marka", "brand", "text", { required: true })}
      {f("Model", "model", "text", { required: true })}
      {f("Rok produkcji", "year", "number", { required: true, min: 1980 })}
      {f("Przebieg (km)", "mileage", "number", { required: true, min: 0 })}
      {f("Cena netto (PLN)", "priceNet", "number", { required: true, min: 0 })}
      {f("VAT (%)", "vatRate", "number", { required: true, min: 0 })}
      {f("Numer oferty", "stockNumber", "text", { required: true })}
      <div className="field"><label>Kategoria</label><select className="select" name="category" defaultValue={data.category}><option>Samochody dostawcze</option><option>Ciężarówki &gt; 3,5 t</option><option>Furgony</option><option>Samochody osobowe</option><option>Kontenery chłodnicze</option></select></div>
      <div className="field"><label>Paliwo</label><select className="select" name="fuel" defaultValue={data.fuel}><option>Diesel</option><option>Benzyna</option><option>Hybryda</option><option>Elektryczny</option><option>CNG</option></select></div>
      <div className="field"><label>Skrzynia</label><select className="select" name="transmission" defaultValue={data.transmission}><option>Manualna</option><option>Automatyczna</option></select></div>
      {f("Moc (KM)", "powerHp", "number", { min: 0 })}
      {f("Pojemność (cm³)", "engineCapacity", "number", { min: 0 })}
      {f("DMC (kg)", "dmc", "number", { min: 0 })}
      {f("Ładowność (kg)", "payload", "number", { min: 0 })}
      {f("Lokalizacja", "location", "text", { required: true })}
      <div className="field"><label>Status</label><select className="select" name="status" defaultValue={data.status}><option value="AVAILABLE">Dostępny</option><option value="RESERVED">Rezerwacja</option><option value="SOLD">Sprzedany</option><option value="DRAFT">Szkic</option></select></div>

      <div className="field full photo-upload">
        <label>Zdjęcia pojazdu</label>
        <label className="photo-drop">
          <strong>Dodaj zdjęcia z komputera</strong>
          <span>Możesz wybrać kilka naraz. Zdjęcia zostaną zoptymalizowane przed wysłaniem.</span>
          <input type="file" accept="image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))}/>
        </label>
        {!!existingImages.length && <div className="photo-grid">
          {existingImages.map((image, index) => <div className="photo-item" key={image.id}>
            <img src={image.url} alt={`Zdjęcie ${index + 1}`}/>
            {index === 0 && <span className="photo-primary">Główne</span>}
            <button type="button" className="photo-remove" disabled={removing === image.id} onClick={() => removeImage(image.id)}>{removing === image.id ? "..." : "Usuń"}</button>
          </div>)}
        </div>}
        {!!previews.length && <div className="photo-grid photo-grid-new">
          {previews.map((src, index) => <div className="photo-item" key={src}><img src={src} alt={`Nowe zdjęcie ${index + 1}`}/><span className="photo-new">Nowe</span></div>)}
        </div>}
        <small>Pierwsze dodane zdjęcie będzie zdjęciem głównym oferty.</small>
      </div>

      <div className="field full"><label>Opis</label><textarea className="textarea" name="description" defaultValue={data.description} required minLength={20}/></div>
      <label className="check full"><input type="checkbox" name="featured" defaultChecked={data.featured}/> Pokaż jako ofertę polecaną na stronie głównej</label>
    </div>
    {error && <div className="form-error">{error}</div>}
    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
      <button className="btn btn-accent" disabled={loading}>{loading ? (files.length ? "Zapisywanie i wysyłanie zdjęć..." : "Zapisywanie...") : "Zapisz pojazd"}</button>
      <button className="btn btn-ghost" type="button" onClick={() => router.back()}>Anuluj</button>
    </div>
  </form>;
}
