/**
 * Parses product names to extract:
 * - short name (just the product description)
 * - brand
 * - box info (NxSize for wholesale packaging)
 */

export interface ParsedProductName {
  shortName: string;
  brand: string | null;
  boxQuantity: number | null;
  boxUnitSize: string | null;
}

const BOX_PATTERN = /\b(\d+)\s*x\s*(\d+(?:[.,]\d+)?)\s*(kg|g|gr|ml|cl|L)\b/i;

const COUNTRY_NAMES = new Set([
  'thaïlande', 'thailand', 'chine', 'china', 'japon', 'japan',
  'italie', 'italy', 'vietnam', 'inde', 'india', 'corée', 'korea',
  'indonésie', 'indonesia', 'philippines', 'malaisie', 'malaysia',
  'taiwan', 'taïwan', 'sri lanka', 'pakistan', 'bangladesh', 'superfino',
]);

function isCountryName(s: string): boolean {
  return COUNTRY_NAMES.has(s.trim().toLowerCase());
}

function stripTrailingCountry(name: string): string {
  let cleaned = name.trim();
  for (const country of COUNTRY_NAMES) {
    const re = new RegExp(`,\\s*${escapeRegex(country)}\\s*$`, 'i');
    if (re.test(cleaned)) {
      cleaned = cleaned.replace(re, '').trim();
    }
  }
  return cleaned;
}

function extractBoxInfo(name: string): {
  boxQuantity: number | null;
  boxUnitSize: string | null;
  nameWithoutBox: string;
} {
  const match = name.match(BOX_PATTERN);
  if (!match) return { boxQuantity: null, boxUnitSize: null, nameWithoutBox: name };
  const qty = parseInt(match[1], 10);
  const size = match[2].replace(',', '.');
  const unit = match[3].toLowerCase() === 'gr' ? 'g' : match[3];
  return {
    boxQuantity: qty,
    boxUnitSize: `${size}${unit}`,
    nameWithoutBox: name.replace(BOX_PATTERN, '').replace(/\s{2,}/g, ' ').trim(),
  };
}

const ALL_CAPS_WORD = /\b[A-Z][A-Z.''-]+\b/g;

function extractBrandFromName(nameAfterBox: string, existingBrand?: string): {
  shortName: string;
  brand: string | null;
} {
  const validExistingBrand =
    existingBrand &&
    existingBrand.length > 1 &&
    !isCountryName(existingBrand);

  if (validExistingBrand) {
    const brandRe = new RegExp(`\\b${escapeRegex(existingBrand!)}\\b,?\\s*`, 'i');
    const cleaned = nameAfterBox.replace(brandRe, '').replace(/\s{2,}/g, ' ').replace(/,\s*$/, '').trim();
    return { shortName: cleaned || nameAfterBox, brand: existingBrand! };
  }

  const parts = nameAfterBox.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    const capsMatches = nameAfterBox.match(ALL_CAPS_WORD);
    if (capsMatches) {
      const brand = capsMatches.filter(w => w.length >= 2 && !isCountryName(w));
      if (brand.length > 0) {
        const brandStr = brand.join(' ');
        const cleaned = nameAfterBox
          .replace(new RegExp(brand.map(escapeRegex).join('\\s*'), 'g'), '')
          .replace(/\s{2,}/g, ' ')
          .replace(/,\s*$/, '')
          .trim();
        if (cleaned.length > 2) {
          return { shortName: cleaned, brand: titleCase(brandStr) };
        }
      }
    }
    return { shortName: nameAfterBox, brand: null };
  }

  const mainPart = parts[0];
  const rest = parts.slice(1);

  const capsInMain = mainPart.match(ALL_CAPS_WORD);
  if (capsInMain) {
    const brandWords = capsInMain.filter(w => w.length >= 2 && !isCountryName(w));
    if (brandWords.length > 0) {
      const brandStr = brandWords.join(' ');
      let cleaned = mainPart;
      for (const bw of brandWords) {
        cleaned = cleaned.replace(new RegExp(`\\b${escapeRegex(bw)}\\b,?\\s*`, 'g'), '');
      }
      cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/,\s*$/, '').trim();
      if (cleaned.length > 2) {
        return { shortName: cleaned, brand: titleCase(brandStr) };
      }
    }
  }

  const lastNonCountry = [...rest].reverse().find(p => !isCountryName(p));
  if (lastNonCountry) {
    const allCaps = /^[A-Z\s.''-]+$/.test(lastNonCountry);
    if (allCaps && lastNonCountry.length >= 2 && lastNonCountry.length < 30) {
      return { shortName: mainPart, brand: titleCase(lastNonCountry) };
    }
  }

  return { shortName: mainPart, brand: null };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SMALL_WORDS = new Set(['de', 'du', 'le', 'la', 'les', 'des', 'et', 'en', 'au', 'aux', 'the', 'and', 'of', 'for', 'in', 'on', 'at', 'by']);

function titleCase(s: string): string {
  const words = s.split(/\s+/);
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      if (w.length <= 3 && /^[A-Z]+$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function cleanFinalName(name: string): string {
  return name
    .replace(/,\s*,/g, ',')
    .replace(/,\s*$/, '')
    .replace(/^\s*,/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function parseCsvProductName(
  name: string,
  existingBrand?: string,
): ParsedProductName {
  const noCountry = stripTrailingCountry(name);
  const { boxQuantity, boxUnitSize, nameWithoutBox } = extractBoxInfo(noCountry);
  const { shortName, brand } = extractBrandFromName(nameWithoutBox, existingBrand);

  return {
    shortName: cleanFinalName(shortName) || name,
    brand,
    boxQuantity,
    boxUnitSize,
  };
}

export function parseLegacyProductName(
  name: string,
  brand?: string,
): ParsedProductName {
  const { boxQuantity, boxUnitSize } = extractBoxInfo(name);
  let shortName = name;

  if (brand) {
    const brandRe = new RegExp(`\\b${escapeRegex(brand)}\\b\\s*`, 'i');
    const stripped = shortName.replace(brandRe, '').replace(/\s{2,}/g, ' ').trim();
    if (stripped.length > 2) shortName = stripped;
  }

  return {
    shortName: cleanFinalName(shortName) || name,
    brand: brand || null,
    boxQuantity,
    boxUnitSize,
  };
}
