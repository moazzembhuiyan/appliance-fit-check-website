const VULGAR_FRACTIONS = {
  "¼": " 1/4",
  "½": " 1/2",
  "¾": " 3/4",
  "⅐": " 1/7",
  "⅑": " 1/9",
  "⅒": " 1/10",
  "⅓": " 1/3",
  "⅔": " 2/3",
  "⅕": " 1/5",
  "⅖": " 2/5",
  "⅗": " 3/5",
  "⅘": " 4/5",
  "⅙": " 1/6",
  "⅚": " 5/6",
  "⅛": " 1/8",
  "⅜": " 3/8",
  "⅝": " 5/8",
  "⅞": " 7/8",
};

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

export function parseInches(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;

  const input = value
    .trim()
    .replace(/[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, (fraction) => VULGAR_FRACTIONS[fraction])
    .replace(/(?:inches|inch|in|["″])\s*$/i, "")
    .trim();

  const mixed = input.match(/^(\d+)\s+(?:(\d+)\s*\/\s*(\d+))$/)
    ?? input.match(/^(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const [, whole, numerator, denominator] = mixed;
    const divisor = Number(denominator);
    if (!divisor) return Number.NaN;
    return Number(whole) + Number(numerator) / divisor;
  }

  const fraction = input.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const divisor = Number(fraction[2]);
    if (!divisor) return Number.NaN;
    return Number(fraction[1]) / divisor;
  }

  if (!/^\d+(?:[.,]\d+)?$/.test(input)) return Number.NaN;
  return Number(input.replace(",", "."));
}

export function formatFraction(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";

  const rounded = Math.round(Math.abs(numeric) * 1_000_000);
  const whole = Math.floor(rounded / 1_000_000);
  let numerator = rounded % 1_000_000;
  if (!numerator) return `${numeric < 0 ? "-" : ""}${whole}`;

  let denominator = 1_000_000;
  while (numerator % 10 === 0) {
    numerator /= 10;
    denominator /= 10;
  }
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;

  const sign = numeric < 0 ? "-" : "";
  const fraction = `${numerator}/${denominator}`;
  return whole ? `${sign}${whole} ${fraction}` : `${sign}${fraction}`;
}

export function formatInches(value) {
  return `${formatFraction(value)} in`;
}
