import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { appendOrder } from './orders-store.mjs';
import {
  registerBusiness,
  loginBusiness,
  getBusinessAccount,
  verifyBusiness,
  listBusinessAccounts,
} from './business-store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MIN_RETAIL_ORDER_CHF = 50;

let productMap = null;

function catalogPaths() {
  return [
    path.join(ROOT, 'netlify', 'functions', 'data', 'products.json'),
    path.join(ROOT, 'dist', 'products.json'),
    path.join(ROOT, 'public', 'products.json'),
  ];
}

function loadProductMap() {
  if (productMap) return productMap;
  for (const p of catalogPaths()) {
    if (fs.existsSync(p)) {
      const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
      productMap = new Map(raw.map((x) => [x.id, x]));
      return productMap;
    }
  }
  throw new Error(
    'products.json not found — run: npm run export:products (and npm run copy:products-netlify before Netlify build)',
  );
}

function getProductMap() {
  return loadProductMap();
}

/** In-memory carts (use Redis/DB in production). */
const carts = new Map();

function cartLineItems(cartId) {
  const cmap = carts.get(cartId);
  if (!cmap) return [];
  const map = getProductMap();
  const items = [];
  for (const [productId, quantity] of cmap.entries()) {
    if (quantity <= 0) continue;
    const product = map.get(productId);
    if (!product) continue;
    items.push({ product, quantity });
  }
  return items;
}

function sumSubtotal(items) {
  return items.reduce((s, i) => s + i.product.price * i.quantity, 0);
}

function buildCartResponse(cartId) {
  const items = cartLineItems(cartId);
  const sub = sumSubtotal(items);
  return { items, subtotal: Math.round(sub * 100) / 100 };
}

export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_, res) => {
    res.json({ ok: true });
  });

  app.get('/api/products', (_, res) => {
    try {
      const map = getProductMap();
      res.json([...map.values()]);
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  app.post('/api/cart/session', (_, res) => {
    const cartId = randomUUID();
    carts.set(cartId, new Map());
    res.json({ cartId });
  });

  app.get('/api/cart', (req, res) => {
    const cartId = req.headers['x-cart-id'];
    if (!cartId || typeof cartId !== 'string' || !carts.has(cartId)) {
      return res.status(400).json({ error: 'Missing or invalid X-Cart-Id' });
    }
    try {
      res.json(buildCartResponse(cartId));
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  app.post('/api/cart/items', (req, res) => {
    const cartId = req.headers['x-cart-id'];
    if (!cartId || typeof cartId !== 'string' || !carts.has(cartId)) {
      return res.status(400).json({ error: 'Missing or invalid X-Cart-Id' });
    }
    const { productId, quantity } = req.body || {};
    if (!productId || typeof quantity !== 'number' || quantity < 0 || !Number.isFinite(quantity)) {
      return res.status(400).json({ error: 'Invalid body' });
    }
    try {
      const map = getProductMap();
      if (!map.has(productId)) {
        return res.status(404).json({ error: 'Unknown product' });
      }
      const cmap = carts.get(cartId);
      const product = map.get(productId);
      const isPerKilo = product.is_per_unit && product.unit_of_measure === 'kg';
      const q = isPerKilo ? Math.round(quantity * 1000) / 1000 : Math.floor(quantity);
      if (q <= 0) cmap.delete(productId);
      else cmap.set(productId, q);
      res.json(buildCartResponse(cartId));
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  app.post('/api/cart/sync', (req, res) => {
    const cartId = req.headers['x-cart-id'];
    if (!cartId || typeof cartId !== 'string' || !carts.has(cartId)) {
      return res.status(400).json({ error: 'Missing or invalid X-Cart-Id' });
    }
    const { items } = req.body || {};
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid body' });
    }
    try {
      const pmap = getProductMap();
      const cmap = carts.get(cartId);
      cmap.clear();
      for (const row of items) {
        if (!row || typeof row.productId !== 'string' || typeof row.quantity !== 'number') continue;
        const q = Math.floor(row.quantity);
        if (q <= 0 || !pmap.has(row.productId)) continue;
        cmap.set(row.productId, q);
      }
      res.json(buildCartResponse(cartId));
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  app.delete('/api/cart/items/:productId', (req, res) => {
    const cartId = req.headers['x-cart-id'];
    if (!cartId || typeof cartId !== 'string' || !carts.has(cartId)) {
      return res.status(400).json({ error: 'Missing or invalid X-Cart-Id' });
    }
    try {
      carts.get(cartId).delete(req.params.productId);
      res.json(buildCartResponse(cartId));
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  app.delete('/api/cart', (req, res) => {
    const cartId = req.headers['x-cart-id'];
    if (!cartId || typeof cartId !== 'string' || !carts.has(cartId)) {
      return res.status(400).json({ error: 'Missing or invalid X-Cart-Id' });
    }
    try {
      carts.get(cartId).clear();
      res.json(buildCartResponse(cartId));
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  // ===== Business account endpoints =====

  app.post('/api/business/register', (req, res) => {
    const { businessName, businessIdentification, swissBusinessNumber, country, email, password } =
      req.body || {};
    if (!businessName || !swissBusinessNumber || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = registerBusiness({
      businessName,
      businessIdentification: businessIdentification || '',
      swissBusinessNumber,
      country: country || 'Switzerland',
      email,
      password,
    });
    if (result.error === 'already_exists') {
      return res.status(409).json({ error: 'already_exists' });
    }
    res.json({ status: result.account.status });
  });

  app.post('/api/business/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    const account = getBusinessAccount(email);
    if (!account) {
      return res.status(404).json({ error: 'not_found' });
    }
    if (account.password !== password) {
      return res.status(401).json({ error: 'invalid_password' });
    }
    if (account.status === 'pending') {
      return res.status(403).json({ error: 'pending_verification', status: 'pending' });
    }
    if (account.status === 'rejected') {
      return res.status(403).json({ error: 'rejected', status: 'rejected' });
    }
    const { password: _pw, ...safeAccount } = account;
    res.json({ account: safeAccount });
  });

  app.get('/api/business/accounts', (_req, res) => {
    const all = listBusinessAccounts();
    const list = Object.values(all).map(({ password: _pw, ...rest }) => rest);
    res.json(list);
  });

  app.post('/api/business/verify', (req, res) => {
    const { email, approve } = req.body || {};
    if (!email || typeof approve !== 'boolean') {
      return res.status(400).json({ error: 'Invalid body' });
    }
    const result = verifyBusiness(email, approve);
    if (result.error) return res.status(404).json({ error: result.error });
    const { password: _pw, ...safe } = result.account;
    res.json({ account: safe });
  });

  app.post('/api/orders', (req, res) => {
    const cartId = req.headers['x-cart-id'];
    if (!cartId || typeof cartId !== 'string' || !carts.has(cartId)) {
      return res.status(400).json({ error: 'Missing or invalid X-Cart-Id' });
    }
    try {
      const body = req.body || {};
      const customerType = body.customerType === 'business' ? 'business' : 'retail';
      const items = cartLineItems(cartId);
      if (items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
      const total = sumSubtotal(items);
      if (customerType === 'retail' && total < MIN_RETAIL_ORDER_CHF) {
        return res.status(400).json({
          error: 'Minimum order not met',
          minimumRetailOrderChf: MIN_RETAIL_ORDER_CHF,
        });
      }
      const order = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        customerType,
        total: Math.round(total * 100) / 100,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          unitPrice: i.product.price,
          lineTotal: Math.round(i.product.price * i.quantity * 100) / 100,
        })),
        customer: {
          firstName: String(body.firstName || ''),
          lastName: String(body.lastName || ''),
          email: String(body.email || ''),
          phone: String(body.phone || ''),
          deliveryOption: body.deliveryOption === 'pickup' ? 'pickup' : 'delivery',
          address: String(body.address || ''),
          city: String(body.city || ''),
          postalCode: String(body.postalCode || ''),
        },
      };
      appendOrder(order);
      carts.get(cartId).clear();
      res.json({ orderId: order.id, total: order.total });
    } catch (e) {
      res.status(503).json({ error: String(e?.message || e) });
    }
  });

  return app;
}
