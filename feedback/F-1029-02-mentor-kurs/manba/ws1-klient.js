// klient.js — o'quvchi ilovasidagi mobil/src/ulanish.ts qoidasi, telefon o'rniga terminalda.
// connect → ulangan · uzilish yoki xato → socket.io o'zi urinyaptimi (active)? ulanmoqda : ulanmagan
// Ishga tushirish: TOKEN=<token> node klient.js   (to'xtatish — Ctrl+C)
const { io } = require('socket.io-client');

const ulanish = io(process.env.API || 'http://localhost:3000', { auth: { token: process.env.TOKEN } });

const t0 = Date.now();
const yoz = (matn) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s  ${matn}`);
const uzilishdanKeyin = (sabab) =>
  yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (${sabab} · active=${ulanish.active})`);

ulanish.on('connect', () => yoz('ulangan  (connect)'));
ulanish.on('disconnect', (sabab) => uzilishdanKeyin(`disconnect: ${sabab}`));
ulanish.on('connect_error', (xato) => uzilishdanKeyin(`connect_error: ${xato.message}`));
ulanish.on('oyin-ozgardi', (hodisa) => yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)}`));
