// Drizzle reports a Postgres `numeric` column as a string to keep arbitrary
// precision. The domain types declare numbers, so every export coerces here.
export const toNumber = (v: string | null): number | null =>
  v === null ? null : Number(v);
