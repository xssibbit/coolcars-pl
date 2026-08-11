import { Icon } from "@/components/Icons";
export function SearchForm({ brands = [] }: { brands?: string[] }) {
  return <form action="/samochody" className="search-box">
    <div className="field"><label htmlFor="q">Czego szukasz?</label><input className="input" id="q" name="q" placeholder="np. Iveco Daily, chłodnia..."/></div>
    <div className="field"><label htmlFor="brand">Marka</label><select className="select" id="brand" name="brand"><option value="">Wszystkie marki</option>{brands.map(b=><option key={b}>{b}</option>)}</select></div>
    <div className="field"><label htmlFor="category">Typ pojazdu</label><select className="select" id="category" name="category"><option value="">Wszystkie typy</option><option>Samochody dostawcze</option><option>Ciężarówki &gt; 3,5 t</option><option>Furgony</option><option>Samochody osobowe</option></select></div>
    <button className="btn btn-accent" type="submit"><Icon name="search"/> Szukaj</button>
  </form>
}
