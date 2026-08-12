import Link from "next/link";
import type { Locale } from "@/lib/i18n";

const logoSources: Record<string, string> = {
  Fiat: "https://cdn.simpleicons.org/fiat?viewbox=auto",
  Iveco: "https://cdn.simpleicons.org/iveco?viewbox=auto",
  "Mercedes-Benz": "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/mercedes-benz/default.svg",
  Renault: "https://cdn.simpleicons.org/renault?viewbox=auto",
  Toyota: "https://cdn.simpleicons.org/toyota?viewbox=auto",
  Volvo: "https://cdn.simpleicons.org/volvo?viewbox=auto",
};

function brandLogoUrl(brand: string) {
  return logoSources[brand] ?? `https://cdn.simpleicons.org/${brand.toLowerCase().replace(/[^a-z0-9]/g, "")}?viewbox=auto`;
}

export function BrandCarousel({ brands, locale = "pl" }: { brands: string[]; locale?: Locale }) {
  const en = locale === "en";
  const visibleBrands = brands.filter((brand) => logoSources[brand]);
  const items = visibleBrands.length ? visibleBrands : brands;

  return <section className="brand-carousel-section" aria-label={en ? "Vehicle makes currently in stock" : "Marki samochodów aktualnie w ofercie"}>
    <div className="container brand-carousel-heading">
      <span className="eyebrow">{en ? "Makes currently in stock" : "Marki aktualnie w ofercie"}</span>
      <span className="brand-carousel-hint">{en ? "Choose a make" : "Wybierz markę"}</span>
    </div>

    <div className="brand-marquee">
      <div className="brand-marquee-fade brand-marquee-fade-left" aria-hidden="true" />
      <div className="brand-marquee-fade brand-marquee-fade-right" aria-hidden="true" />
      <div className="brand-marquee-track">
        {[0, 1].map((group) => <div className="brand-marquee-group" key={group} aria-hidden={group === 1 ? "true" : undefined}>
          {items.map((brand) => <Link
            key={`${group}-${brand}`}
            href={`/samochody?brand=${encodeURIComponent(brand)}`}
            className={`brand-logo-card brand-${brand.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            aria-label={`${en ? "Show" : "Pokaż"} ${brand}`}
          >
            <span className="brand-logo-visual">
              <img src={brandLogoUrl(brand)} alt="" loading="lazy" />
            </span>
            <strong>{brand}</strong>
          </Link>)}
        </div>)}
      </div>
    </div>
  </section>;
}
