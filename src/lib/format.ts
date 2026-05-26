type Displayable = string | number | boolean;

export const formatMeters = (v: Displayable) => `${parseFloat(String(v))} m`;
export const formatDegrees = (v: Displayable) => `${v}°`;
export const formatBoolean = (v: Displayable) => (v ? "Ja" : "Nein");
export const formatSquareMeters = (v: Displayable) =>
  `${parseFloat(String(v))} m²`;
export const formatCurrency = (v: Displayable) =>
  `${Number(v).toLocaleString("de-DE")} €`;
