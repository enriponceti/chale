export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateRange(checkin: string, checkout: string) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  });

  const start = formatter.format(new Date(`${checkin}T00:00:00`));
  const end = formatter.format(new Date(`${checkout}T00:00:00`));
  return `${start} - ${end}`;
}

export function capitalize(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
