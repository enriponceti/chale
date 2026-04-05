export function toDateOnly(value: Date | string) {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

export function toTimeValue(value: string) {
  return new Date(`1970-01-01T${value}:00.000Z`);
}

export function fromTimeValue(value: Date | string) {
  if (typeof value === "string") {
    return value.slice(11, 16);
  }

  return value.toISOString().slice(11, 16);
}
