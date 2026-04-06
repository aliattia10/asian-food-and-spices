import type { UnitOfMeasure } from '@/lib/parseProductUnit';
import { parseUnitString } from '@/lib/parseProductUnit';
import { parseCsvProductName, parseLegacyProductName } from '@/lib/parseProductName';
import { legacyProductsRaw, type LegacyProductRow } from '@/data/legacy-products';
import csvCatalog from '@/data/csv-catalog.json';

export interface Product {
  id: string;
  name: string;
  nameFr: string;
  /** Short display name (product only, no brand/size/country). */
  shortName: string;
  shortNameFr: string;
  /** Display string for quantity/unit (e.g. "5 kg", "per kg"). Kept for backward compatibility. */
  unit: string;
  /** Numeric quantity when applicable (e.g. 5 for "5 kg", 425 for "425 g"). */
  quantity: number | null;
  /** Unit of measure: kg, g, ml, L, bunch, unit, sticks, other. */
  unit_of_measure: UnitOfMeasure;
  /** Optional size variant (e.g. "small", "large") for bottles/packs. */
  size_variant?: string | null;
  /** True when price is per unit (e.g. "per kg", "per bunch"). */
  is_per_unit: boolean;
  price: number;
  category: string;
  categoryFr: string;
  image: string;
  brand?: string;
  /** Box/case quantity for wholesale (e.g. 12 in "12x300g"). null for non-box items. */
  boxQuantity?: number | null;
  /** Per-unit size in a box (e.g. "300g" in "12x300g"). */
  boxUnitSize?: string | null;
}

type ProductRaw = Omit<Product, 'quantity' | 'unit_of_measure' | 'size_variant' | 'is_per_unit' | 'shortName' | 'shortNameFr' | 'boxQuantity' | 'boxUnitSize'>;

export interface CsvCatalogRow extends LegacyProductRow {
  imageFilename: string;
}

const COUNTRY_BRAND_FILTER = new Set([
  'thaïlande', 'thailand', 'chine', 'china', 'japon', 'japan',
  'italie', 'italy', 'vietnam', 'inde', 'india', 'corée', 'korea',
  'indonésie', 'indonesia', 'philippines', 'malaisie', 'malaysia',
  'taiwan', 'taïwan', 'sri lanka', 'pakistan', 'bangladesh', 'superfino',
]);

function cleanBrand(brand: string | undefined): string | undefined {
  if (!brand) return undefined;
  if (COUNTRY_BRAND_FILTER.has(brand.toLowerCase().trim())) return undefined;
  return brand;
}

/** Enriches products with quantity, unit_of_measure, size_variant from the unit string + parsed names. */
function withParsedUnits(items: ProductRaw[]): Product[] {
  return items.map((item) => {
    const parsed = parseUnitString(item.unit);
    const sanitizedBrand = cleanBrand(item.brand);
    const isCsv = item.id.startsWith('csv-');
    const parsedNameEn = isCsv
      ? parseCsvProductName(item.name, sanitizedBrand)
      : parseLegacyProductName(item.name, sanitizedBrand);
    const parsedNameFr = isCsv
      ? parseCsvProductName(item.nameFr, sanitizedBrand)
      : parseLegacyProductName(item.nameFr, sanitizedBrand);

    return {
      ...item,
      shortName: parsedNameEn.shortName,
      shortNameFr: parsedNameFr.shortName,
      quantity: parsed.quantity,
      unit_of_measure: parsed.unit_of_measure,
      size_variant: parsed.size_variant ?? undefined,
      is_per_unit: parsed.is_per_unit,
      unit: parsed.display,
      brand: sanitizedBrand || cleanBrand(parsedNameEn.brand) || undefined,
      boxQuantity: parsedNameEn.boxQuantity ?? parsedNameFr.boxQuantity ?? undefined,
      boxUnitSize: parsedNameEn.boxUnitSize ?? parsedNameFr.boxUnitSize ?? undefined,
    };
  });
}

export interface Category {
  id: string;
  name: string;
  nameFr: string;
  count: number;
}

function basenameFromImage(imagePath: string): string {
  const parts = imagePath.split('/');
  return parts[parts.length - 1] || imagePath;
}

/**
 * Legacy shop items keep their English/French names when a CSV row uses the same image file.
 * Unmatched CSV rows are appended (French catalog descriptions + CHF prices from CSV).
 */
function mergeLegacyWithCsv(
  legacy: LegacyProductRow[],
  csvRows: CsvCatalogRow[],
): ProductRaw[] {
  const byId = new Map<string, ProductRaw>();
  for (const l of legacy) {
    byId.set(l.id, { ...l });
  }

  const legacyIdByImage = new Map<string, string>();
  for (const l of legacy) {
    const key = basenameFromImage(l.image).toLowerCase();
    if (!legacyIdByImage.has(key)) legacyIdByImage.set(key, l.id);
  }

  /** Only the first CSV row per legacy image updates the hand-picked English listing. */
  const legacyImageAlreadyMerged = new Set<string>();

  for (const row of csvRows) {
    const imgPath = row.image.startsWith('/') ? row.image : `/product_images/${row.image}`;
    const key = row.imageFilename.toLowerCase();
    const legId = legacyIdByImage.get(key);
    if (legId && !legacyImageAlreadyMerged.has(key)) {
      legacyImageAlreadyMerged.add(key);
      const cur = byId.get(legId)!;
      byId.set(legId, {
        ...cur,
        price: row.price > 0 ? row.price : cur.price,
        unit: row.unit && row.unit !== '1 unit' ? row.unit : cur.unit,
        image: imgPath,
        brand: row.brand ?? cur.brand,
      });
    } else {
      byId.set(row.id, {
        id: row.id,
        name: row.name,
        nameFr: row.nameFr,
        unit: row.unit,
        price: row.price,
        category: row.category,
        categoryFr: row.categoryFr,
        image: imgPath,
        brand: row.brand,
      });
    }
  }

  return Array.from(byId.values());
}

const CATEGORY_ORDER = [
  'Fresh Seafood & Fish',
  'Butcher',
  'Rice & Grains',
  'Pantry & Canned Goods',
  'Fresh Produce',
  'Frozen & Misc',
  'Beverages',
  'Grocery',
];

function slugCategoryId(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'category';
}

function buildCategories(productList: Product[]): Category[] {
  const agg = new Map<string, { nameFr: string; count: number }>();
  for (const p of productList) {
    const ex = agg.get(p.category);
    if (ex) ex.count += 1;
    else agg.set(p.category, { nameFr: p.categoryFr, count: 1 });
  }

  const entries = [...agg.entries()];
  entries.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a[0]);
    const ib = CATEGORY_ORDER.indexOf(b[0]);
    if (ia === -1 && ib === -1) return a[0].localeCompare(b[0]);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return entries.map(([name, { nameFr, count }]) => ({
    id: slugCategoryId(name),
    name,
    nameFr,
    count,
  }));
}

const csvRows = csvCatalog as CsvCatalogRow[];
const productsRaw: ProductRaw[] = mergeLegacyWithCsv(legacyProductsRaw, csvRows);

export const products: Product[] = withParsedUnits(productsRaw);
export const categories: Category[] = buildCategories(products);
