export function formatRp(value) {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  if (Math.abs(n) >= 1000) return `Rp ${Math.round(n / 1000)}rb`;
  return `Rp ${Math.round(n).toLocaleString("id-ID")}`;
}

export function formatRpFull(value) {
  return `Rp ${Math.round(Number(value) || 0).toLocaleString("id-ID")}`;
}

export function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function toPercent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}
