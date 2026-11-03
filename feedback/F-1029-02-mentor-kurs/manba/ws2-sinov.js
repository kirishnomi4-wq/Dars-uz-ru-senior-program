// WebSocket-2 mentor darsi — o'quvchi loyihasi maydon-jamoa'dagi uch xatoni haqiqiy Backend bilan qayta yaratish (F-1029-02, 01.11 avtopilot).
// Backend — HAQIQIY (m12-dars-04-done; m12-dars-05 da Backend o'zgarmagan, faqat ilova). Ilova (Expo) o'rniga — Node socket.io-client,
// mobil/src/ulanish.ts ning ikki versiyasi aynan takrorlanadi:
//   eski  = m12-dars-04-done: oyin-ozgardi tinglovchisi connect ICHIDA; connect da qayta so'rash yo'q; xonaga qayta kirish yo'q
//   yangi = m12-dars-05-done: tinglovchi connect dan TASHQARIDA; connect da qayta so'raydi va ochiq o'yin xonasiga qayta kiradi
// «Internet uzildi» — klient bilan Backend orasidagi TCP proksi (3001 → 3000) kesiladi; «yangi versiya» — Backend jarayoni qayta ishga tushiriladi.
// ISHLATISH: BE=<backend papka> node ws2-sinov.js <tayyorla|uzilish|versiya|xona> [eski|yangi]
const { io } = require('socket.io-client');
const net = require('net');
const { spawn } = require('child_process');
const fs = require('fs');

const API = 'http://localhost:3000', PROXY = 'http://localhost:3001';
const BE = process.env.BE, TOK = process.env.TOKFILE;
const [, , SENARIY, REJIM = 'eski'] = process.argv;
const t0 = Date.now();
const vaqt = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(5) + 's';
const log = (s) => console.log(`${vaqt()}  ${s}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Backend jarayoni ---
let be = null;
function beStart() {
  return new Promise((ok, no) => {
    be = spawn('node', ['dist/main.js'], { cwd: BE, env: { ...process.env, NO_COLOR: '1' } });
    const t = setTimeout(() => no(new Error('Backend 20 s da yonmadi')), 20000);
    be.stdout.on('data', (d) => { if (/successfully started/.test(String(d))) { clearTimeout(t); ok(); } });
    be.stderr.on('data', (d) => process.stderr.write(d));
  });
}
function beStop() { return new Promise((ok) => { if (!be) return ok(); be.once('exit', () => ok()); be.kill('SIGTERM'); be = null; }); }

// --- TCP proksi: «internet» ---
let proksi = null; const ulanishlar = new Set();
function internetBor() {
  return new Promise((ok) => {
    proksi = net.createServer((c) => {
      const b = net.connect(3000, '127.0.0.1');
      ulanishlar.add(c); ulanishlar.add(b); c.pipe(b); b.pipe(c);
      const yop = () => { c.destroy(); b.destroy(); ulanishlar.delete(c); ulanishlar.delete(b); };
      c.on('error', yop); b.on('error', yop); c.on('close', yop); b.on('close', yop);
    });
    proksi.listen(3001, '127.0.0.1', ok);
  });
}
function internetYoq() { return new Promise((ok) => { for (const c of ulanishlar) c.destroy(); ulanishlar.clear(); proksi.close(() => ok()); }); }

// --- HTTP ---
const J = { 'Content-Type': 'application/json' };
const sora = async (token) => (await fetch(API + '/oyinlar', { headers: { Authorization: 'Bearer ' + token } })).json();
const qoshil = async (token, id) => { const r = await fetch(`${API}/oyinlar/${id}/qoshilish`, { method: 'POST', headers: { Authorization: 'Bearer ' + token } }); return r.status; };

// --- Ilova: ulanish.ts ning ikki versiyasi (React'siz) ---
function ilova(nom, token, rejim, oyinId, url = API) {
  const st = { son: null, tinglovchi: 0, ochiq: null, xato: false };
  const u = io(url, { auth: { token } });
  const qaytaSora = async (sabab) => {
    const o = (await sora(token)).find((x) => x.id === oyinId);
    st.son = `${o.qoshilgan} / ${o.kerak}`;
    log(`[${nom}] GET /oyinlar (${sabab}) → ${o.maydon}: ${st.son}`);
  };
  const tinglovchi = async (d) => {
    st.tinglovchi++;
    log(`[${nom}] oyin-ozgardi ${JSON.stringify(d)} — tinglovchi ishladi (${st.tinglovchi})`);
    await qaytaSora('hodisa kelgach');
  };
  u.on('connect', () => {
    st.xato = false;
    log(`[${nom}] ulangan`);
    if (rejim === 'eski') {
      u.on('oyin-ozgardi', tinglovchi); // m12-dars-04-done: tinglovchi connect ichida
    } else {
      qaytaSora('qayta ulanganda'); // m12-dars-05-done: uzilish paytidagi hodisa kelmaydi — qayta so'raladi
      if (st.ochiq !== null) u.emit('oyin-ochildi', { oyinId: st.ochiq }); // ochiq o'yin xonasiga qayta kirish
    }
  });
  if (rejim === 'yangi') u.on('oyin-ozgardi', tinglovchi); // tinglovchi bir marta — connect dan tashqarida
  u.on('disconnect', (r) => log(`[${nom}] ${u.active ? 'ulanmoqda' : 'ulanmagan'}  (disconnect: ${r})`));
  u.on('connect_error', (e) => { if (!st.xato) log(`[${nom}] ulanmoqda  (connect_error: ${e.message}) …`); st.xato = true; });
  u.on('korayotganlar-ozgardi', (d) => log(`[${nom}] Hozir ko'ryapti: ${d.soni}  (korayotganlar-ozgardi ${JSON.stringify(d)})`));
  const och = (id) => { st.ochiq = id; u.emit('oyin-ochildi', { oyinId: id }); };
  const ulanguncha = async () => { for (let i = 0; i < 100 && !u.connected; i++) await sleep(100); };
  return { u, st, och, qaytaSora, ulanguncha };
}

// --- Tayyorlash: akkauntlar ---
async function tayyorla() {
  await beStart();
  const t = {};
  const odamlar = [['Ali', '01'], ['Vali', '02'], ['Sardor', '03'], ['Jasur', '04'], ['Bekzod', '05'], ['Aziz', '06'], ['Doston', '07']];
  for (const [ism, n] of odamlar) {
    const telefon = `+998 90 000 00 ${n}`;
    await fetch(API + '/royxat', { method: 'POST', headers: J, body: JSON.stringify({ ism, telefon, parol: 'parol123' }) });
    t[ism] = (await (await fetch(API + '/kirish', { method: 'POST', headers: J, body: JSON.stringify({ telefon, parol: 'parol123' }) })).json()).token;
  }
  fs.writeFileSync(TOK, JSON.stringify(t));
  await beStop();
}

// O'yin: hali bo'sh joy ko'p bo'lgani (har sinovda bitta odam qo'shiladi)
const oyinTanla = async (token, bosh = 3) => (await sora(token)).filter((o) => o.kerak - o.qoshilgan >= bosh).sort((a, b) => a.id - b.id)[0];

(async () => {
  if (SENARIY === 'tayyorla') { await tayyorla(); process.exit(0); }
  const T = JSON.parse(fs.readFileSync(TOK, 'utf8'));
  const qoshiluvchi = { uzilish: { eski: 'Sardor', yangi: 'Jasur' }, versiya: { eski: 'Bekzod', yangi: 'Aziz' } }[SENARIY]?.[REJIM];
  await beStart();
  const O = await oyinTanla(T.Ali, SENARIY === 'xona' ? 0 : 3); // xonada hech kim qo'shilmaydi — istalgan o'yin
  console.log(`# ilova: ulanish.ts — ${REJIM === 'eski' ? 'm12-dars-04-done (agent «bajardim» degan holat)' : 'm12-dars-05-done (tuzatilgan)'} · o'yin ${O.id} «${O.maydon}»`);

  if (SENARIY === 'uzilish') {
    // 1-urinish: internetni uzish. Uzilish paytida boshqa odam qo'shiladi.
    await internetBor();
    const A = ilova('Ali', T.Ali, REJIM, O.id, PROXY);
    await A.ulanguncha();
    if (REJIM === 'eski') await A.qaytaSora("ekran ochildi"); else await sleep(300);
    await sleep(800);
    log('--- internet uzildi ---'); await internetYoq();
    await sleep(1500);
    log(`[${qoshiluvchi}] POST /oyinlar/${O.id}/qoshilish → ${await qoshil(T[qoshiluvchi], O.id)}`);
    await sleep(1500);
    log('--- internet qaytdi ---'); await internetBor();
    await A.ulanguncha(); await sleep(1500);
    const b = (await sora(T.Ali)).find((x) => x.id === O.id);
    log(`NATIJA: Ali ekranida ${A.st.son} · Backend'da ${b.qoshilgan} / ${b.kerak}`);
    A.u.close(); await internetYoq();
  }

  if (SENARIY === 'versiya') {
    // 3-urinish (a): Backend'ning yangi versiyasi — keyin bitta o'zgarish
    const A = ilova('Ali', T.Ali, REJIM, O.id);
    await A.ulanguncha();
    if (REJIM === 'eski') await A.qaytaSora('ekran ochildi'); else await sleep(300);
    await sleep(800);
    log('--- Backend yangi versiyasi: qayta ishga tushirildi ---'); await beStop(); await beStart();
    await A.ulanguncha(); await sleep(1000);
    log(`[${qoshiluvchi}] POST /oyinlar/${O.id}/qoshilish → ${await qoshil(T[qoshiluvchi], O.id)}`);
    await sleep(1500);
    log(`NATIJA: bitta o'zgarish — Ali'da tinglovchi ${A.st.tinglovchi} marta ishladi`);
    A.u.close();
  }

  if (SENARIY === 'xona') {
    // 3-urinish (b): Backend'ning yangi versiyasi — keyin ikkinchi telefon o'yinni ochadi
    const A = ilova('Ali', T.Ali, REJIM, O.id);
    await A.ulanguncha(); await sleep(300);
    log(`[Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: ${O.id} }`); A.och(O.id);
    await sleep(1000);
    log('--- Backend yangi versiyasi: qayta ishga tushirildi ---'); await beStop(); await beStart();
    await A.ulanguncha(); await sleep(1000);
    const V = ilova('Vali', T.Vali, 'yangi', O.id);
    await V.ulanguncha(); await sleep(300);
    log(`[Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: ${O.id} }`); V.och(O.id);
    await sleep(1500);
    log("NATIJA: ikkala telefonda shu o'yin ochiq — kutilgan «Hozir ko'ryapti: 2»");
    A.u.close(); V.u.close();
  }
  await sleep(300); await beStop(); process.exit(0);
})().catch(async (e) => { console.error(e); await beStop(); process.exit(1); });
