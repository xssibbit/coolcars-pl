export function formatPln(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number) {
  return `${new Intl.NumberFormat("pl-PL").format(value)} km`;
}

export function grossFromNet(net: number, vatRate: number) {
  return Math.round(net * (1 + vatRate / 100));
}
