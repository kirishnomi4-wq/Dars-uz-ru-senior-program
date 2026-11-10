// AI nusxalaridagi xom WebSocket'ga ulanadigan sinov klienti (ws paketi — nusxaning o'z node_modules'idan).
// ISHLATISH (cwd = AI nusxasi): node <bu-fayl> <ws-url> <soniya>
const path = require('path');
const WebSocket = require(path.join(process.cwd(), 'node_modules', 'ws'));
const [url, sec] = process.argv.slice(2);
const t = () => new Date().toTimeString().slice(0, 8);
console.log(`${t()} ulanmoqda… ${url}`);
const ws = new WebSocket(url);
ws.on('open', () => console.log(`${t()} open`));
ws.on('message', (d) => {
  // ikki format: AI-2 { type, order | orders } · AI-1 { event, data: { kind, order } | { orders } }
  const m = JSON.parse(String(d));
  const type = m.type || (m.data && m.data.kind ? `${m.event}/${m.data.kind}` : m.event);
  const o = m.order || (m.data && m.data.order);
  const list = m.orders || (m.data && m.data.orders);
  const short = o ? JSON.stringify(o) : list ? `orders: ${list.length} ta` : '';
  console.log(`${t()} xabar ${type} ${short}`.slice(0, 400));
});
ws.on('close', (code, reason) => console.log(`${t()} close ${code} ${String(reason)}`));
ws.on('error', (e) => console.log(`${t()} error ${e.message}`));
setTimeout(() => process.exit(0), Number(sec || 6) * 1000);
