import Link from "next/link";

const ORIGINAL_LOGO = "https://coolcars.pl/cdn/shop/files/cool-cars-logo.png?v=1751463577&width=380";

export function Footer(){
  return <footer id="kontakt" className="footer">
    <div className="container">
      <div className="footer-brand-row">
        <div>
          <div className="brand brand-logo footer-logo"><img src={ORIGINAL_LOGO} alt="COOL CARS" /></div>
          <p>CoolCars specjalizuje się w sprzedaży pojazdów i rozwiązań chłodniczych dla firm oraz klientów indywidualnych.</p>
        </div>
        <div className="footer-catalog">
          <h4>Katalog</h4>
          <div className="footer-links"><Link href="/samochody">Wszystkie pojazdy</Link><Link href="/samochody?category=Samochody+dostawcze">Samochody dostawcze</Link><Link href="/samochody?category=Ciężarówki+%3E+3%2C5+t">Ciężarówki</Link><Link href="/samochody?category=Samochody+osobowe">Samochody osobowe</Link><Link href="/samochody?category=Kontenery+chłodnicze">Kontenery chłodnicze</Link></div>
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
