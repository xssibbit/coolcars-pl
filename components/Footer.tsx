import Link from "next/link";
import { getLocale } from "@/lib/i18n";

const ORIGINAL_LOGO = "https://coolcars.pl/cdn/shop/files/cool-cars-logo.png?v=1751463577&width=380";

export async function Footer(){
  const locale = await getLocale();
  const en = locale === "en";
  return <footer id="kontakt" className="footer">
    <div className="container">
      <div className="footer-brand-row">
        <div>
          <div className="brand brand-logo footer-logo"><img src={ORIGINAL_LOGO} alt="COOL CARS" /></div>
          <p>{en ? "CoolCars specialises in passenger, commercial and heavy vehicles, including refrigerated transport solutions for companies and private customers." : "CoolCars specjalizuje się w sprzedaży samochodów osobowych, dostawczych i ciężarowych oraz rozwiązaniach chłodniczych dla firm i klientów indywidualnych."}</p>
        </div>
        <div className="footer-catalog">
          <h4>{en ? "Vehicles" : "Katalog"}</h4>
          <div className="footer-links"><Link href="/samochody">{en ? "All vehicles" : "Wszystkie pojazdy"}</Link><Link href="/samochody?category=Samochody+dostawcze">{en ? "Commercial vehicles" : "Samochody dostawcze"}</Link><Link href="/samochody?category=Ciężarówki+%3E+3%2C5+t">{en ? "Trucks" : "Ciężarówki"}</Link><Link href="/samochody?category=Samochody+osobowe">{en ? "Passenger cars" : "Samochody osobowe"}</Link><Link href="/samochody?category=Kontenery+chłodnicze">{en ? "Refrigerated bodies" : "Kontenery chłodnicze"}</Link></div>
        </div>
      </div>

      <div className="contact-grid">
        <div className="contact-card"><span className="contact-country">Polska</span><strong>05-555 Tarczyn</strong><span>Aleja Krakowska 7</span><a href="tel:+48884367888">+48 884 367 888</a></div>
        <div className="contact-card"><span className="contact-country">Germany</span><strong>42651 Solingen</strong><span>Stöcken 65</span><a href="tel:+48512112888">+48 512 112 888</a></div>
        <div className="contact-card"><span className="contact-country">Ukraine</span><strong>Lutsk</strong><span>M. Skoryka str. 2B</span><a href="tel:+48512112888">+48 512 112 888</a></div>
      </div>

      <div className="footer-bottom"><span>© 2026 COOL CARS</span><span>Polska · Germany · Ukraine</span></div>
    </div>
  </footer>
}
