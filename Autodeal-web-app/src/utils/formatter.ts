export function formatPrice(value : any) {
  if (value === null || value === undefined) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value : any) {
  return `${new Intl.NumberFormat("en-IN").format(value || 0)} km`;
}
