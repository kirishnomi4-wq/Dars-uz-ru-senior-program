// WebSocket-2 v2: «tarmoq uzildi» — panel bilan server orasidagi TCP proksi (panel boshqa kompyuterda, server Render'da bo'lgan holat modeli).
// ISHLATISH: node ws2v2-proksi.cjs <tinglash-port> <server-port> · SIGUSR2 — kesish/tiklash (kesilganda ochiq ulanishlar uziladi,
// yangilari qabul qilinmaydi — Wi-Fi o'chgandagi kabi; server esa ishlab turadi).
const net = require('net');
const [lp, sp] = process.argv.slice(2).map(Number);
const t = () => new Date().toTimeString().slice(0, 8);
const socks = new Set();
let srv = null;
const yoq = () => {
  srv = net.createServer((c) => {
    const u = net.connect(sp, 'localhost');
    socks.add(c); socks.add(u);
    c.pipe(u); u.pipe(c);
    const yop = () => { c.destroy(); u.destroy(); socks.delete(c); socks.delete(u); };
    c.on('error', yop); u.on('error', yop); c.on('close', yop); u.on('close', yop);
  }).listen(lp, () => console.log(`${t()} proksi ${lp} → ${sp}: tarmoq bor`));
};
yoq();
process.on('SIGUSR2', () => {
  if (srv) { srv.close(); srv = null; for (const s of socks) s.destroy(); socks.clear(); console.log(`${t()} proksi: TARMOQ UZILDI`); }
  else yoq();
});
process.on('SIGTERM', () => process.exit(0));
// tarmoq uzilganda ochiq narsa qolmaydi — jarayon o'zi tugamasin (04.11: shusiz 2-signal kelmay qoldi)
setInterval(() => {}, 1 << 30);
