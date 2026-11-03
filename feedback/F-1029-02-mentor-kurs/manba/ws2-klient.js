// klient.js — o'quvchi ilovasidagi mobil/src/ulanish.ts (m12-dars-04-done) qoidasi, telefon o'rniga terminalda.
// OYIN=<id> berilsa — «O'yin» ekrani ochiq: Backend'ga oyin-ochildi yuboriladi, «Hozir ko'ryapti» chiqadi.
// Ishga tushirish: TOKEN=<token> OYIN=3 node klient.js   (to'xtatish — Ctrl+C)
const { io } = require('socket.io-client');

const API = process.env.API || 'http://localhost:3000';
const TOKEN = process.env.TOKEN;
const OYIN = process.env.OYIN ? Number(process.env.OYIN) : null;
const ulanish = io(API, { auth: { token: TOKEN } });

const t0 = Date.now();
const yoz = (matn) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s  ${matn}`);
let marta = 0;

async function qaytaSora(sabab) {
  const javob = await fetch(API + '/oyinlar', { headers: { Authorization: 'Bearer ' + TOKEN } });
  const o = (await javob.json()).find((x) => x.id === (OYIN || 1));
  yoz(`GET /oyinlar (${sabab}) → ${o.maydon}: ${o.qoshilgan} / ${o.kerak}`);
}

ulanish.on('connect', () => {
  yoz('ulangan');
  ulanish.on('oyin-ozgardi', async (hodisa) => {
    marta++;
    yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)} — tinglovchi ishladi (${marta})`);
    await qaytaSora('hodisa kelgach');
  });
});
ulanish.on('disconnect', (sabab) => yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (disconnect: ${sabab})`));
ulanish.on('korayotganlar-ozgardi', (m) => yoz(`Hozir ko'ryapti: ${m.soni}`));

// «O'yin» ekrani ochildi — ilova ochilgandagi birinchi ulanishda bir marta
if (OYIN) ulanish.once('connect', () => ulanish.emit('oyin-ochildi', { oyinId: OYIN }));
