import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";

export function SearchForm({ brands = [], locale = "pl" }: { brands?: string[]; locale?: Locale }) {
  const en = locale === "en";
  return <form action="/samochody" className="search-box marketplace-search">
    <div className="search-heading"><strong>{en ? "Find your vehicle" : "Znajdź swój samochód"}</strong><span>{en ? "Filter the current CoolCars inventory" : "Przeszukaj aktualną ofertę CoolCars"}</span></div>
    <div className="field"><label htmlFor="q">{en ? "Search" : "Szukaj"}</label><input className="input" id="q" name="q" placeholder={en ? "e.g. Iveco Daily, refrigerated..." : "np. Iveco Daily, chłodnia..."}/></div>
    <div className="field"><label htmlFor="brand">{en ? "Make" : "Marka"}</label><select className="select" id="brand" name="brand"><option value="">{en ? "All makes" : "Wszystkie marki"}</option>{brands.map(b=><option key={b}>{b}</option>)}</select></div>
    <div className="field"><label htmlFor="category">{en ? "Vehicle type" : "Typ pojazdu"}</label><select className="select" id="category" name="category"><option value="">{en ? "All types" : "Wszystkie typy"}</option><option value="Samochody dostawcze">{en ? "Commercial vehicles" : "Samochody dostawcze"}</option><option value="Ciężarówki > 3,5 t">{en ? "Trucks > 3.5 t" : "Ciężarówki > 3,5 t"}</option><option value="Furgony">{en ? "Vans" : "Furgony"}</option><option value="Samochody osobowe">{en ? "Passenger cars" : "Samochody osobowe"}</option></select></div>
    <div className="field compact-field"><label htmlFor="yearFrom">{en ? "Year from" : "Rok od"}</label><input className="input" id="yearFrom" type="number" name="yearFrom" placeholder="2020" min="1990" max="2030"/></div>
    <div className="field compact-field"><label htmlFor="maxPrice">{en ? "Net price up to" : "Cena netto do"}</label><input className="input" id="maxPrice" type="number" name="maxPrice" placeholder="150000" min="0"/></div>
    <button className="btn btn-accent search-submit" type="submit"><Icon name="search"/> {en ? "Search" : "Szukaj"}</button>
  </form>
}
