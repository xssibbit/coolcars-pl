import Link from "next/link";
export function Footer(){
  return <footer id="kontakt" className="footer"><div className="container footer-grid">
    <div><div className="brand"><span className="brand-mark">C</span><span>CoolCars</span></div><p>Nowoczesny katalog samochodów i pojazdów użytkowych dla klientów w Polsce. Transparentne ceny, sprawdzone pojazdy i szybki kontakt.</p></div>
    <div><h4>Oferta</h4><div className="footer-links"><Link href="/samochody">Wszystkie pojazdy</Link><Link href="/samochody?category=Samochody+dostawcze">Dostawcze</Link><Link href="/samochody?category=Ciężarówki+%3E+3%2C5+t">Ciężarówki</Link></div></div>
    <div><h4>Obsługa</h4><div className="footer-links"><a href="mailto:sprzedaz@coolcars.pl">sprzedaz@coolcars.pl</a><a href="tel:+48220000000">+48 22 000 00 00</a><span>Pon–Pt 8:00–18:00</span></div></div>
    <div><h4>Informacje</h4><div className="footer-links"><span>Finansowanie</span><span>Serwis</span><span>Polityka prywatności</span></div></div>
  </div></footer>
}
