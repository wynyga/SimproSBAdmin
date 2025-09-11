// utils/formatRupiah.ts
export function formatRupiah(value: number | string): string {
  if (!value && value !== 0) return "Rp 0";

  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // tanpa desimal
  }).format(number);
}
