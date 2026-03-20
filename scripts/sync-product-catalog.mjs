/**
 * Reads product_catalog CSV + copies images into public/product_images,
 * writes src/data/csv-catalog.json for the app merge step.
 *
 * Usage:
 *   node scripts/sync-product-catalog.mjs
 *   node scripts/sync-product-catalog.mjs --csv "C:\path\file.csv" --images "C:\path\product_images_all"
 *
 * Defaults:
 *   CSV:    %USERPROFILE%\Downloads\product_catalog_820.csv
 *   Images: <repo>/product_images_all  (falls back to product_images_v2)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function parseArgs() {
  const a = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--csv' && a[i + 1]) {
      out.csv = a[++i];
    } else if (a[i] === '--images' && a[i + 1]) {
      out.images = a[++i];
    }
  }
  return out;
}

/** Minimal RFC4180-style parser (handles quoted fields with ""). */
function parseCsv(text) {
  const rows = [];
  let i = 0;
  const len = text.length;
  while (i < len) {
    const row = [];
    while (i < len) {
      if (text[i] === '"') {
        i++;
        let cell = '';
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              cell += '"';
              i += 2;
            } else {
              i++;
              break;
            }
          } else {
            cell += text[i++];
          }
        }
        row.push(cell);
      } else {
        let cell = '';
        while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          cell += text[i++];
        }
        row.push(cell);
      }
      if (text[i] === '\r') i++;
      if (text[i] === '\n') {
        i++;
        break;
      }
      if (text[i] === ',') i++;
    }
    if (row.length && row.some((c) => c !== '')) rows.push(row);
  }
  return rows;
}

function parsePrice(v) {
  if (v == null || String(v).trim() === '') return 0;
  const n = parseFloat(String(v).replace(',', '.'));
  if (Number.isNaN(n)) return 0;
  if (n < 0 || n === -1 || n <= -100) return 0;
  return Math.round(n * 100) / 100;
}

function stripLeadingSkuCode(productName) {
  // CSV "Product Name" often starts with a SKU like "01094 ..." or "03130 ...".
  // We keep the rest as the display name.
  return String(productName || '').replace(/^\s*\d{3,6}\s+/, '').trim();
}

function inferCategory(name) {
  const n = name.toLowerCase();
  if (
    /riz|basmati|sella|vermicel|vermicelle|nouille|nouilles|farine|tempura|semoule|tapioca|flake rice|ponni|matta|sushi|biryani|haricot sec|lentil|lentille|graines de sésame|mélange de farine/.test(
      n,
    )
  ) {
    return ['Rice & Grains', 'Riz & Céréales'];
  }
  if (
    /bière|beer|boisson|jus |eau de jeune|lychee|lyche|goyave|aloé|aloe|passion|tamarin|canne à sucre|tsingtao|chang |foco |okf /.test(
      n,
    )
  ) {
    return ['Beverages', 'Boissons'];
  }
  if (
    /mouton|agneau|boeuf|bœuf|poulet|halal|porc|saucisse|gigot|oxtail|queue de boeuf|veau|canard/.test(n) &&
    !/maquereau|mackerel|fish ball/.test(n)
  ) {
    return ['Butcher', 'Boucherie'];
  }
  if (
    /poisson|fish|crevette|gambas|crabe|calamar|panga|tilapia|mackerel|maquereau|thon|tuna|saumon|barramundi|seer|pomfret|hos[o]?|iqf fish|cuttle|squid|shrimp|prawn/.test(
      n,
    )
  ) {
    return ['Fresh Seafood & Fish', 'Poissons & Fruits de Mer Frais'];
  }
  if (
    /sauce |lait.*coco|pâte de curry|vinaigre|sambal|mayonnaise|condensed|curry |huile |aroy|chaokoh|nestlé|lait concentré|corned|custard|haricot|pois chiche|champignon|pousse de bambou|glutamate|msg|pâte de |marinade |hoi sin|teriyaki|soja |custard|condensed|corned beef|beans|lentils en boîte/.test(
      n,
    )
  ) {
    return ['Pantry & Canned Goods', 'Épicerie & Conserves'];
  }
  if (/gel|lotion|baume|encens|shampoo|hair |vaseline|crème capillaire|skala|johnson|tiger balm|hem /.test(n)) {
    return ['Frozen & Misc', 'Surgelés & Divers'];
  }
  if (
    /gyoza|paratha|roti |frozen|surgel|iqf|ravioli|boulette|spring roll|nems|wonton|pâte.*print|feuilles|fish ball|roti paratha|dim sum/.test(
      n,
    )
  ) {
    return ['Frozen & Misc', 'Surgelés & Divers'];
  }
  if (
    /œuf|oeuf|egg|tomate|aubergine|mangue|banane|coriandre|légume|fruit frais|pasteque|gingembre racine|pak choi|okra|rambutan|mangosteen/.test(
      n,
    )
  ) {
    return ['Fresh Produce', 'Fruits & Légumes Frais'];
  }
  return ['Grocery', 'Épicerie'];
}

function guessUnit(productName, notes) {
  const text = `${productName} ${notes || ''}`.toLowerCase();
  if (/price per kilo|\/kilo|pa\/uv.*kilo|per kg|prix unitaire.*chf\/kg/.test(text)) return 'per kg';
  if (/1\/2 mouton|demi mouton/.test(productName.toLowerCase())) return 'per kg';
  const m = productName.match(/(\d+)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(kg|g|gr|ml|l)\b/i);
  if (m) {
    const q = parseFloat(m[2]);
    let u = m[3].toLowerCase();
    if (u === 'gr') u = 'g';
    if (u === 'l') return `${q} L`;
    return `${q} ${u}`;
  }
  return '1 unit';
}

function parseMoneyFromNotes(notes) {
  const s = String(notes || '');
  const n = (s || '').match(/([0-9]+(?:[.,][0-9]+)?)/);
  if (!n) return null;
  const v = parseFloat(n[1].replace(',', '.'));
  if (Number.isNaN(v)) return null;
  return Math.round(v * 100) / 100;
}

function extractPerUnitPriceFromNotes(unit, notes) {
  if (!notes) return null;
  const text = String(notes).toLowerCase();

  // Most important case: price per kilo.
  if (unit === 'per kg') {
    // "Price unitaire: 1.53 CHF/kg"
    let m = text.match(/prix unitaire[^0-9]*([0-9]+(?:[.,][0-9]+)?)\s*chf\s*\/\s*kg/i);
    if (!m) m = text.match(/price per unit[^0-9]*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*kilo/i);
    if (!m) m = text.match(/pa\/uv[^0-9]*le[^0-9]*([0-9]+(?:[.,][0-9]+)?)\s*kilo/i);
    if (!m) m = text.match(/unit price[^0-9]*([0-9]+(?:[.,][0-9]+)?)\s*kilo/i);
    if (m) {
      const v = parseFloat(m[1].replace(',', '.'));
      if (!Number.isNaN(v)) return Math.round(v * 100) / 100;
    }
  }

  return null;
}

function canonicalDisplayName(name) {
  // Many CSV names end with origin after the last comma.
  // For dedupe we keep the part before the first comma.
  const s = String(name || '').trim();
  const idx = s.indexOf(',');
  return (idx >= 0 ? s.slice(0, idx) : s).trim();
}

function extractBrand(name) {
  const m = name.match(/,\s*([A-Z0-9][A-Za-z0-9\s&.-]{1,40})$/);
  if (m) {
    const tail = m[1].trim();
    if (tail.length > 2 && tail.length < 36) return tail;
  }
  return undefined;
}

function normalizeKey(s) {
  // Keep unicode letters/digits so non-Latin filenames (e.g. Tamil) can still match.
  // Also strip diacritics by removing combining marks.
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}.]+/gu, '');
}

function normalizeAsciiKey(s) {
  // Keep only ASCII letters/digits; helpful for matching mojibake filenames
  // against CSV names with non-Latin scripts.
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9.]+/g, '');
}

/** Fix UTF-8 text that was mis-decoded as Latin-1 (common in Windows filenames). */
function fixMojibakeUtf8(s) {
  // Handle common mis-decoding sequences found in `product_images_v2` filenames
  // (e.g. "Tha├»lande" should be "Thaïlande", "hu├«tre" -> "huître").
  const map = {
    '├»': 'ï',
    '├«': 'î',
    '├ó': 'â',
    '├¿': 'è',
    '├Ç': 'à',
    '├ê': 'è',
    '├ä': 'é',
    '├ë': 'é',
    '├®': 'é',
    '├£': 'ü',
    '├╗': 'û',
    '├¡': 'ï',
    '├│': 'o',
    '├┤': 'ô',
  };
  let out = String(s || '');
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);

  if (!/Ã|Â/.test(out)) return out;
  try {
    const t = Buffer.from(out, 'latin1').toString('utf8');
    if (!t.includes('\ufffd') && t.length > 0) return t;
  } catch {
    /* ignore */
  }
  return out;
}

function buildImageLookup(imageDir) {
  const mapNorm = new Map();
  const mapExactNfc = new Map();
  const mapExactNfd = new Map();
  const mapAscii = new Map();
  if (!fs.existsSync(imageDir)) return { mapNorm, mapExactNfc, mapExactNfd };
  for (const ent of fs.readdirSync(imageDir, { withFileTypes: true })) {
    if (!ent.isFile()) continue;
    const fixed = fixMojibakeUtf8(ent.name);
    for (const variant of new Set([ent.name, fixed])) {
      const key = normalizeKey(variant);
      if (!mapNorm.has(key)) mapNorm.set(key, ent.name);

      const asciiKey = normalizeAsciiKey(variant);
      if (asciiKey && !mapAscii.has(asciiKey)) mapAscii.set(asciiKey, ent.name);
    }
    const nfc = ent.name.normalize('NFC');
    const nfd = ent.name.normalize('NFD');
    if (!mapExactNfc.has(nfc)) mapExactNfc.set(nfc, ent.name);
    if (!mapExactNfd.has(nfd)) mapExactNfd.set(nfd, ent.name);
  }
  return { mapNorm, mapExactNfc, mapExactNfd, mapAscii };
}

function resolveSourceFile(imageDir, lookup, filename) {
  const direct = path.join(imageDir, filename);
  if (fs.existsSync(direct)) return direct;
  const variants = new Set([filename, fixMojibakeUtf8(filename)]);
  for (const v of variants) {
    const nfc = v.normalize('NFC');
    const nfd = v.normalize('NFD');
    const foundExact = lookup.mapExactNfc.get(nfc) || lookup.mapExactNfd.get(nfd);
    if (foundExact) return path.join(imageDir, foundExact);
  }
  for (const v of variants) {
    const key = normalizeKey(v);
    const found = lookup.mapNorm.get(key);
    if (found) return path.join(imageDir, found);
  }
  // Last resort: match based on ASCII-only key.
  for (const v of variants) {
    const asciiKey = normalizeAsciiKey(v);
    if (!asciiKey) continue;
    const found = lookup.mapAscii?.get(asciiKey);
    if (found) return path.join(imageDir, found);
  }

  // Very last resort: token match using ASCII-only words (handles cases where
  // the non-Latin part is mojibake and can't be reliably normalized).
  const candidates = fs.existsSync(imageDir)
    ? fs.readdirSync(imageDir, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name)
    : [];
  if (candidates.length) {
    const extToken = path.extname(filename).slice(1).toLowerCase();
    for (const v of variants) {
      const words = (v.match(/[A-Za-z0-9]+/g) || []).map((w) => w.toLowerCase()).filter(Boolean);
      if (words.length < 2) continue;
      const prefix = words[0];
      const suffix = words[words.length - 1] === extToken ? words[words.length - 2] : words[words.length - 1];
      if (!prefix || !suffix) continue;
      for (const cand of candidates) {
        const candWords = (cand.match(/[A-Za-z0-9]+/g) || []).map((w) => w.toLowerCase());
        if (candWords.includes(prefix) && candWords.includes(suffix)) {
          return path.join(imageDir, cand);
        }
      }
    }
  }
  return null;
}

function main() {
  const args = parseArgs();
  const csvPath =
    args.csv || path.join(os.homedir(), 'Downloads', 'product_catalog_820.csv');
  let imageDir = args.images || path.join(ROOT, 'product_images_all');
  if (!fs.existsSync(imageDir)) {
    const fallback = path.join(ROOT, 'product_images_v2');
    if (fs.existsSync(fallback)) {
      console.warn(`Using fallback image folder: ${fallback}`);
      imageDir = fallback;
    }
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found: ${csvPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(imageDir)) {
    console.error(`Image folder not found: ${imageDir}`);
    console.error('Create product_images_all or pass --images');
    process.exit(1);
  }

  let raw = fs.readFileSync(csvPath, 'utf8');
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const table = parseCsv(raw);
  if (table.length < 2) {
    console.error('CSV has no data rows');
    process.exit(1);
  }

  const header = table[0].map((h) => h.trim());
  const idx = {
    name: header.indexOf('Product Name'),
    image: header.indexOf('Image Filename'),
    retail: header.indexOf('Retail Price (CHF)'),
    pro: header.indexOf('Pro Price (CHF)'),
    purchase: header.indexOf('Purchase Price (CHF)'),
    notes: header.indexOf('Notes / Quality'),
  };
  if (idx.name < 0 || idx.image < 0) {
    console.error('Unexpected CSV header', header);
    process.exit(1);
  }

  const publicDir = path.join(ROOT, 'public', 'product_images');
  fs.mkdirSync(publicDir, { recursive: true });

  const lookup = buildImageLookup(imageDir);
  const rowsByKey = new Map(); // dedupe key -> row
  let rows = [];
  let copied = 0;
  let missing = 0;

  for (let r = 1; r < table.length; r++) {
    const line = table[r];
    if (line.length < 2) continue;
    const rawProductName = (line[idx.name] || '').trim();
    const productName = stripLeadingSkuCode(rawProductName);
    const imageFilename = (line[idx.image] || '').trim();
    if (!productName || !imageFilename) continue;

    const notes = idx.notes >= 0 ? (line[idx.notes] || '').trim() : '';
    // Priority:
    // 1) Retail price (shelf price)
    // 2) Pro price (if retail is missing)
    // 3) Purchase price (if only purchase is present in the CSV)
    let price = idx.retail >= 0 ? parsePrice(line[idx.retail]) : 0;
    if (price <= 0 && idx.pro >= 0) price = parsePrice(line[idx.pro]);
    if (price <= 0 && idx.purchase >= 0) price = parsePrice(line[idx.purchase]);

    const [category, categoryFr] = inferCategory(productName);
    const unit = guessUnit(productName, notes);
    // If the UI will display "per kg", prefer extracting the per-kg number from notes
    // (CSV also contains carton/total prices which are not per-kg).
    if (unit === 'per kg') {
      const perKg = extractPerUnitPriceFromNotes(unit, notes);
      if (perKg != null && perKg > 0) price = perKg;
    }

    const brand = extractBrand(productName);

    const src = resolveSourceFile(imageDir, lookup, imageFilename);
    if (src) {
      const dest = path.join(publicDir, path.basename(imageFilename));
      try {
        fs.copyFileSync(src, dest);
        copied++;
      } catch (e) {
        console.warn(`Copy failed: ${imageFilename}`, e.message);
        missing++;
      }
    } else {
      console.warn(`Missing image file: ${imageFilename}`);
      missing++;
    }

    const key = `${canonicalDisplayName(productName)}|${unit}`;
    const candidate = {
      // Temporary; we will re-number after dedupe.
      id: `csv-${r - 1}`,
      imageFilename,
      name: productName,
      nameFr: productName,
      unit,
      price,
      category,
      categoryFr,
      image: `/product_images/${imageFilename}`,
      ...(brand ? { brand } : {}),
    };

    // Deduplicate: keep the best (usually the per-kg/unit number, i.e. smallest sensible price).
    if (!rowsByKey.has(key)) {
      rowsByKey.set(key, candidate);
    } else {
      const existing = rowsByKey.get(key);
      const candidatePer = String(candidate.unit || '').startsWith('per ');
      const existingPer = String(existing.unit || '').startsWith('per ');

      // If either is "per ...", keep the one with the smaller sensible price.
      if (candidatePer || existingPer) {
        if (candidate.price > 0 && (existing.price <= 0 || candidate.price < existing.price)) {
          rowsByKey.set(key, candidate);
        }
      } else {
        // Otherwise keep the latest candidate (covers different pack sizes).
        rowsByKey.set(key, candidate);
      }
    }
  }

  rows = Array.from(rowsByKey.values());
  // Re-number ids to keep routes stable-ish for deduped rows.
  rows = rows.map((row, i) => ({ ...row, id: `csv-${i}` }));

  const outPath = path.join(ROOT, 'src', 'data', 'csv-catalog.json');
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');

  console.log(`Wrote ${rows.length} rows -> ${outPath}`);
  console.log(`Copied ${copied} images to public/product_images (${missing} missing/failed)`);
}

main();
