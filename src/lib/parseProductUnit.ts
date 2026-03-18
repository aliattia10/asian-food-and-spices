/**
 * Parses product unit strings (e.g. "5 kg", "per kg", "425 g") into
 * quantity, unit_of_measure, and optional size_variant.
 */

export type UnitOfMeasure =
  | 'kg'
  | 'g'
  | 'ml'
  | 'L'
  | 'bunch'
  | 'unit'
  | 'sticks'
  | 'other';

export interface ParsedUnit {
  quantity: number | null;
  unit_of_measure: UnitOfMeasure;
  unit_of_measure_raw: string;
  size_variant: string | null;
  is_per_unit: boolean;
  display: string;
}

function normalizeUnit(raw: string): UnitOfMeasure {
  const r = raw.toLowerCase().replace(/s$/, ''); // sticks -> stick
  if (r === 'l' || r === 'litre' || r === 'liter') return 'L';
  if (r === 'stick') return 'sticks';
  if (r === 'bunches') return 'bunch';
  if (r === 'units') return 'unit';
  if (['kg', 'g', 'ml', 'bunch', 'unit', 'sticks'].includes(r)) return r as UnitOfMeasure;
  return 'other';
}

/**
 * Parse a unit string into structured fields.
 */
export function parseUnitString(unitStr: string): ParsedUnit {
  const s = (unitStr || '').trim();
  const isPer = /^per\s+/i.test(s);
  const rest = s.replace(/^per\s+/i, '').trim();

  const parts = rest.split(/\s+/);
  let quantity: number | null = null;
  let unitToken = rest;

  if (parts.length >= 1) {
    const num = parseFloat(parts[0]);
    if (!Number.isNaN(num)) {
      quantity = num;
      unitToken = parts.slice(1).join(' ') || parts[0];
      if (parts.length === 1 && quantity != null) unitToken = ''; // e.g. "5" alone
    }
  }

  const unit_of_measure = unitToken ? normalizeUnit(unitToken) : 'other';
  const unit_of_measure_raw = unitToken || (quantity != null ? '' : rest);

  let display: string;
  if (isPer) display = unitToken ? `per ${unitToken}` : s;
  else if (quantity != null && unitToken) display = `${quantity} ${unitToken}`;
  else if (quantity != null && unit_of_measure !== 'other') display = `${quantity} ${unit_of_measure}`;
  else display = s || '—';

  let size_variant: string | null = null;
  if (unit_of_measure === 'L' && quantity === 1) size_variant = 'large';
  else if (unit_of_measure === 'ml' && quantity != null && quantity >= 700) size_variant = 'large';
  else if (unit_of_measure === 'ml' && quantity != null && quantity <= 400) size_variant = 'small';

  return {
    quantity,
    unit_of_measure,
    unit_of_measure_raw: unitToken || String(quantity ?? ''),
    size_variant,
    is_per_unit: isPer,
    display,
  };
}

/**
 * Format quantity + unit for display from structured data.
 */
export function formatQuantityAndUnit(
  quantity: number | null,
  unit_of_measure: string,
  is_per_unit?: boolean
): string {
  if (is_per_unit) return `per ${unit_of_measure}`;
  if (quantity != null && unit_of_measure) return `${quantity} ${unit_of_measure}`;
  if (unit_of_measure) return unit_of_measure;
  return '—';
}

/** Product-like shape for display helper */
export interface ProductQuantityDisplay {
  unit: string;
  quantity?: number | null;
  unit_of_measure?: string;
  is_per_unit?: boolean;
}

/**
 * Returns a short, readable quantity/unit label for the product (e.g. "5 kg", "per kg", "425 g").
 * Use product.unit when it's already populated from parsing; this helps when you only have raw fields.
 */
export function getProductQuantityDisplay(product: ProductQuantityDisplay): string {
  if (product.unit) return product.unit;
  return formatQuantityAndUnit(
    product.quantity ?? null,
    product.unit_of_measure ?? 'other',
    product.is_per_unit
  );
}
