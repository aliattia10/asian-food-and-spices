import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'server', 'data');

function accountsPath() {
  return process.env.AWS_EXECUTION_ENV
    ? path.join('/tmp', 'business-accounts.json')
    : path.join(DATA_DIR, 'business-accounts.json');
}

function load() {
  try {
    const raw = fs.readFileSync(accountsPath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function save(accounts) {
  const p = accountsPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(accounts, null, 2), 'utf8');
}

export function registerBusiness(profile) {
  const accounts = load();
  const key = profile.email.toLowerCase().trim();
  if (accounts[key]) {
    return { error: 'already_exists', account: accounts[key] };
  }
  const account = {
    ...profile,
    email: key,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  accounts[key] = account;
  save(accounts);
  return { account };
}

export function getBusinessAccount(email) {
  const accounts = load();
  return accounts[email.toLowerCase().trim()] || null;
}

export function loginBusiness(email) {
  const account = getBusinessAccount(email);
  if (!account) return { error: 'not_found' };
  if (account.status === 'pending') return { error: 'pending_verification' };
  if (account.status === 'rejected') return { error: 'rejected' };
  return { account };
}

export function verifyBusiness(email, approve) {
  const accounts = load();
  const key = email.toLowerCase().trim();
  if (!accounts[key]) return { error: 'not_found' };
  accounts[key].status = approve ? 'verified' : 'rejected';
  accounts[key].verifiedAt = new Date().toISOString();
  save(accounts);
  return { account: accounts[key] };
}

export function listBusinessAccounts() {
  return load();
}
