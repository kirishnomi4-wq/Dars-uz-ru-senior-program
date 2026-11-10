// WebSocket-2 v2: connectionStateRecovery tajribasi uchun klient — OrderBotNest node_modules'dagi socket.io-client (cwd = loyiha).
// ISHLATISH: node ws2v2-recovery-klient.cjs <url> <token> <soniya>. Har connect'da socket.recovered ko'rsatiladi.
const path = require('path');
const { io } = require(path.join(process.cwd(), 'node_modules', 'socket.io-client'));
const [url, token, sek] = process.argv.slice(2);
const t = () => new Date().toTimeString().slice(0, 8);
const s = io(url, { auth: { token } });
s.on('connect', () => console.log(`${t()} connect · recovered=${s.recovered} · id ${s.id.slice(0, 6)}…`));
s.on('disconnect', (r) => console.log(`${t()} disconnect: ${r}`));
s.on('connect_error', (e) => console.log(`${t()} connect_error: ${e.message}`));
s.on('order-changed', (p) => console.log(`${t()} order-changed ${JSON.stringify(p)}`));
setTimeout(() => process.exit(0), Number(sek) * 1000);
