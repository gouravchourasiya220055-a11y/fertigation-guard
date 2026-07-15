const API = '/api';

export async function fetchStatus() {
  const r = await fetch(`${API}/status`);
  return r.json();
}

export async function fetchCrops() {
  const r = await fetch(`${API}/crops`);
  return r.json();
}

export async function selectCrop(cropId) {
  const r = await fetch(`${API}/crops/select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cropId }),
  });
  return r.json();
}

export async function sendCommand(body) {
  const r = await fetch(`${API}/commands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function fetchTelemetryHistory(hours = 24) {
  const r = await fetch(`${API}/history/telemetry?hours=${hours}`);
  return r.json();
}

export async function fetchEvents(limit = 50) {
  const r = await fetch(`${API}/history/events?limit=${limit}`);
  return r.json();
}

export async function fetchFlushHistory() {
  const r = await fetch(`${API}/history/flush`);
  return r.json();
}

export async function postTelemetry(data) {
  await fetch(`${API}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function connectWebSocket(onMessage) {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${proto}://${window.location.host}/ws`);
  ws.onmessage = (e) => {
    try {
      onMessage(JSON.parse(e.data));
    } catch (_) {}
  };
  ws.onclose = () => setTimeout(() => connectWebSocket(onMessage), 3000);
  return ws;
}
