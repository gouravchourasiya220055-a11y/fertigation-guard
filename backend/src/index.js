import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import {
  insertTelemetry,
  insertEvent,
  insertFlush,
  getTelemetryHistory,
  getEvents,
  getFlushHistory,
  getPumpActivity,
} from './db.js';
import { CROP_PRESETS, findCrop } from './crops.js';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// In-memory state (latest device snapshot + pending commands)
let liveStatus = {
  deviceId: null,
  ph: 0,
  ec: 0,
  phValid: true,
  ecValid: true,
  mode: 'AUTO',
  phase: 'IDLE',
  crop: 'Tomato',
  targetPh: 6.2,
  targetEc: 2.3,
  phTolerance: 0.2,
  ecTolerance: 0.15,
  flushSec: 20,
  doseDelayMs: 10000,
  waterPump: false,
  basePump: false,
  fertPump: false,
  flushValve: false,
  stirrer: false,
  tankLevelOk: true,
  lastSeen: null,
  online: false,
};

const pendingCommands = {};
let lastPhase = 'IDLE';
let flushStartedAt = null;

function broadcast(wss, data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((c) => {
    if (c.readyState === 1) c.send(msg);
  });
}

function checkAlerts(status) {
  const alerts = [];
  if (status.ph < status.targetPh - status.phTolerance) {
    alerts.push({ type: 'ph_low', message: `pH low: ${status.ph.toFixed(2)} (target ${status.targetPh})`, severity: 'warning' });
  }
  if (status.ph > status.targetPh + status.phTolerance) {
    alerts.push({ type: 'ph_high', message: `pH high: ${status.ph.toFixed(2)} (target ${status.targetPh})`, severity: 'warning' });
  }
  if (status.ec < status.targetEc - status.ecTolerance) {
    alerts.push({ type: 'ec_low', message: `EC low: ${status.ec.toFixed(2)} mS/cm`, severity: 'warning' });
  }
  if (status.ec > status.targetEc + status.ecTolerance) {
    alerts.push({ type: 'ec_high', message: `EC high: ${status.ec.toFixed(2)} mS/cm`, severity: 'warning' });
  }
  if (!status.phValid) {
    alerts.push({ type: 'sensor_failure', message: 'pH sensor reading invalid', severity: 'error' });
  }
  if (!status.ecValid) {
    alerts.push({ type: 'sensor_failure', message: 'EC/TDS sensor reading invalid', severity: 'error' });
  }
  if (!status.tankLevelOk) {
    alerts.push({ type: 'tank_low', message: 'Tank level low', severity: 'warning' });
  }
  return alerts;
}

function setupRoutes(app, wss) {
  app.get('/api/health', (_, res) => res.json({ ok: true }));

  app.get('/api/status', (_, res) => {
    const online = liveStatus.lastSeen && Date.now() - liveStatus.lastSeen < 15000;
    res.json({ ...liveStatus, online });
  });

  app.post('/api/telemetry', (req, res) => {
    const b = req.body;
    liveStatus = {
      ...liveStatus,
      deviceId: b.deviceId || liveStatus.deviceId,
      ph: b.ph ?? liveStatus.ph,
      ec: b.ec ?? liveStatus.ec,
      phValid: b.phValid ?? true,
      ecValid: b.ecValid ?? true,
      mode: b.mode || liveStatus.mode,
      phase: b.phase || liveStatus.phase,
      crop: b.crop || liveStatus.crop,
      targetPh: b.targetPh ?? liveStatus.targetPh,
      targetEc: b.targetEc ?? liveStatus.targetEc,
      waterPump: !!b.waterPump,
      basePump: !!b.basePump,
      fertPump: !!b.fertPump,
      flushValve: !!b.flushValve,
      stirrer: !!b.stirrer,
      tankLevelOk: b.tankLevelOk ?? true,
      lastSeen: Date.now(),
      online: true,
    };

    insertTelemetry({
      deviceId: liveStatus.deviceId || 'unknown',
      ts: Date.now(),
      ph: liveStatus.ph,
      ec: liveStatus.ec,
      mode: liveStatus.mode,
      phase: liveStatus.phase,
      crop: liveStatus.crop,
      waterPump: liveStatus.waterPump ? 1 : 0,
      basePump: liveStatus.basePump ? 1 : 0,
      fertPump: liveStatus.fertPump ? 1 : 0,
      flushValve: liveStatus.flushValve ? 1 : 0,
    });

    if (liveStatus.phase === 'FLUSH' && lastPhase !== 'FLUSH') {
      flushStartedAt = Date.now();
    }
    if (lastPhase === 'FLUSH' && liveStatus.phase !== 'FLUSH' && flushStartedAt) {
      const dur = Math.round((Date.now() - flushStartedAt) / 1000);
      insertFlush(liveStatus.crop, dur);
      insertEvent('flush_completed', `Flush completed (${dur}s) for ${liveStatus.crop}`, 'info');
      flushStartedAt = null;
    }
    lastPhase = liveStatus.phase;

    const alerts = checkAlerts(liveStatus);
    alerts.forEach((a) => insertEvent(a.type, a.message, a.severity));

    broadcast(wss, { type: 'status', data: liveStatus });
    if (alerts.length) broadcast(wss, { type: 'alerts', data: alerts });

    res.json({ ok: true });
  });

  app.get('/api/device/commands', (req, res) => {
    const deviceId = req.query.deviceId || 'esp32-fertigation-1';
    const cmd = pendingCommands[deviceId] || {};
    pendingCommands[deviceId] = null;
    res.json(cmd);
  });

  app.post('/api/commands', (req, res) => {
    const deviceId = req.body.deviceId || 'esp32-fertigation-1';
    pendingCommands[deviceId] = { ...req.body, ts: Date.now() };

    if (req.body.mode) liveStatus.mode = req.body.mode;
    if (req.body.crop) {
      const preset = findCrop(req.body.crop.name || req.body.crop);
      if (preset) {
        liveStatus.crop = preset.name;
        liveStatus.targetPh = preset.targetPh;
        liveStatus.targetEc = preset.targetEc;
        liveStatus.phTolerance = preset.phTolerance;
        liveStatus.ecTolerance = preset.ecTolerance;
        liveStatus.flushSec = preset.flushSec;
        liveStatus.doseDelayMs = preset.doseDelayMs;
      }
    }

    broadcast(wss, { type: 'command', data: req.body });
    res.json({ ok: true });
  });

  app.get('/api/crops', (_, res) => res.json(CROP_PRESETS));

  app.post('/api/crops/select', (req, res) => {
    const preset = findCrop(req.body.cropId || req.body.name);
    if (!preset) return res.status(404).json({ error: 'Crop not found' });

    const deviceId = req.body.deviceId || 'esp32-fertigation-1';
    pendingCommands[deviceId] = {
      crop: preset,
      ts: Date.now(),
    };

    liveStatus.crop = preset.name;
    liveStatus.targetPh = preset.targetPh;
    liveStatus.targetEc = preset.targetEc;
    liveStatus.phTolerance = preset.phTolerance;
    liveStatus.ecTolerance = preset.ecTolerance;
    liveStatus.flushSec = preset.flushSec;
    liveStatus.doseDelayMs = preset.doseDelayMs;

    insertEvent('crop_selected', `Crop set to ${preset.name}`, 'info');
    broadcast(wss, { type: 'status', data: liveStatus });
    res.json(preset);
  });

  app.get('/api/history/telemetry', (req, res) => {
    const hours = parseInt(req.query.hours || '24', 10);
    res.json(getTelemetryHistory(hours));
  });

  app.get('/api/history/events', (req, res) => {
    res.json(getEvents(parseInt(req.query.limit || '50', 10)));
  });

  app.get('/api/history/flush', (req, res) => {
    res.json(getFlushHistory());
  });

  app.get('/api/history/pumps', (req, res) => {
    const hours = parseInt(req.query.hours || '24', 10);
    res.json(getPumpActivity(hours));
  });
}

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'status', data: liveStatus }));
});

setupRoutes(app, wss);

// Mark offline if no telemetry
setInterval(() => {
  if (liveStatus.lastSeen && Date.now() - liveStatus.lastSeen > 15000) {
    liveStatus.online = false;
    broadcast(wss, { type: 'status', data: liveStatus });
  }
}, 5000);

server.listen(PORT, () => {
  console.log(`Fertigation Guard API on http://localhost:${PORT}`);
  console.log(`WebSocket ws://localhost:${PORT}/ws`);
});
