import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const defaultStore = {
  telemetry: [],
  events: [],
  flush_history: [],
};

function load() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (_) {}
  return structuredClone(defaultStore);
}

function save(store) {
  fs.writeFileSync(dbPath, JSON.stringify(store, null, 2));
}

let store = load();

export function insertTelemetry(row) {
  store.telemetry.push({
    device_id: row.deviceId,
    ts: row.ts,
    ph: row.ph,
    ec: row.ec,
    mode: row.mode,
    phase: row.phase,
    crop: row.crop,
    water_pump: row.waterPump,
    base_pump: row.basePump,
    fert_pump: row.fertPump,
    flush_valve: row.flushValve,
  });
  // Keep last 5000 readings
  if (store.telemetry.length > 5000) {
    store.telemetry = store.telemetry.slice(-5000);
  }
  save(store);
}

export function insertEvent(type, message, severity = 'info') {
  store.events.unshift({
    id: Date.now(),
    ts: Date.now(),
    type,
    message,
    severity,
  });
  if (store.events.length > 500) store.events = store.events.slice(0, 500);
  save(store);
}

export function insertFlush(crop, durationSec) {
  store.flush_history.unshift({
    id: Date.now(),
    ts: Date.now(),
    duration_sec: durationSec,
    crop,
  });
  if (store.flush_history.length > 200) store.flush_history = store.flush_history.slice(0, 200);
  save(store);
}

export function getTelemetryHistory(hours = 24) {
  const since = Date.now() - hours * 3600 * 1000;
  return store.telemetry
    .filter((t) => t.ts >= since)
    .sort((a, b) => a.ts - b.ts);
}

export function getEvents(limit = 50) {
  return store.events.slice(0, limit);
}

export function getFlushHistory(limit = 30) {
  return store.flush_history.slice(0, limit);
}

export function getPumpActivity(hours = 24) {
  const since = Date.now() - hours * 3600 * 1000;
  return store.telemetry
    .filter((t) => t.ts >= since)
    .map((t) => ({
      ts: t.ts,
      water_pump: t.water_pump,
      base_pump: t.base_pump,
      fert_pump: t.fert_pump,
      flush_valve: t.flush_valve,
    }));
}
