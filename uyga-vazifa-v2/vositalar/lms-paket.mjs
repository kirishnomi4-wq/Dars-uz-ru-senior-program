// LMS yuklash paketi: 101 vazifa → lms/paket.json (har vazifa uchun uz + ru band(lar)i, LMS formasiga tayyor).
// Manbalar: src/hw-qa2/data.js (uz kartalar, gen-hw-qa2 yig'adi) · data/ru/m*.json (ru kartalar) · data/testlar(.ru).json ·
// compiler/<id>/{meta.json,starter/,ru/} · lms/xarita.json (LMS dars va uyga vazifa id'lari).
// Band turlari (foydalanuvchi qarori 21.10): T → 5 ta «Test (one option)» · C / C+A → «Kompilyator» (+ AI agent) ·
// faqat link → «Text» · fayl yoki skrinshot bor → bitta «Fayl yuklash». Mentor ro'yxati matn oxirida («Nima tekshiriladi:»).
// Testdagi «why» izohi yuklanmaydi. Ishlatish: node vositalar/lms-paket.mjs
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { MODULLAR } = await import(path.join(ROOT, '../src/hw-qa2/data.js'));
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const XARITA = J('lms/xarita.json').kartalar;
const RU = Object.assign({}, ...fs.readdirSync(path.join(ROOT, 'data/ru')).filter(f => /^m[\d-]+\.json$/.test(f)).map(f => J('data/ru/' + f)));
const TEST = { uz: J('data/testlar.json'), ru: J('data/testlar.ru.json') };
// Starter'dagi rasm o'rinbosarlari — QA saytidagi barqaror manzil (o'quvchi src'ga shuni yozadi)
const ASSET = { 'assets/futbol.png': 'https://coddycamp-uyga-vazifa-v2.vercel.app/rasm/assets/futbol.png', 'assets/logo.png': 'https://coddycamp-uyga-vazifa-v2.vercel.app/rasm/assets/logo.png' };
const L = {
  uz: { nom: 'Uyga vazifa: ', tek: 'Nima tekshiriladi:', rasm: 'Rasm manzili', logo: 'Logotip manzili' },
  ru: { nom: 'Домашнее задание: ', tek: 'Что проверяется:', rasm: 'Адрес картинки', logo: 'Адрес логотипа' },
};
// QA ma'lumotida sarlavhaning « — N-qism» qismi tushib qolgan (gen-hw-qa2 « — » dan kesadi) — LMS'da ikki vazifa bir xil nomli bo'lmasin
const QISM = { '9-7': [' — 1-qism', ' — часть 1'], '9-9': [' — 2-qism', ' — часть 2'], '10-8': [' — 1-qism', ' — часть 1'], '10-9': [' — 2-qism va code review', ' — часть 2 и code review'] };
const tozala = s => s.replace(/`([^`]*)`/g, '$1'); // LMS matni oddiy matn — markdown backtick ko'rinib qolmasin

function matn(til, k, qoshimcha = []) {
  const q = [tozala(k.kirish), '', ...k.qadamlar.map((s, i) => `${i + 1}. ${tozala(s)}`)];
  if (qoshimcha.length) q.push('', ...qoshimcha);
  if (k.mentor?.length) q.push('', L[til].tek, ...k.mentor.map(s => '— ' + tozala(s)));
  return q.join('\n');
}
function rasmYol(til, f) { // ru rasmi bo'lsa — o'sha, yo'q bo'lsa uz rasmi (tilga bog'liq emas)
  if (!f) return null;
  const ru = path.join('rasm/ru', f);
  return til === 'ru' && fs.existsSync(path.join(ROOT, ru)) ? ru : path.join('rasm', f);
}

const paket = { _izoh: "AVTO (vositalar/lms-paket.mjs). Har vazifa: LMS id'lari + uz/ru bandlar. Rasm yo'li uyga-vazifa-v2/ ga nisbatan.", vazifalar: {} };
const xato = [];
const nomlar = new Set();
for (const m of MODULLAR) for (const d of m.darslar.filter(d => d.kartaNom)) {
  const x = XARITA[d.id]; if (!x) { xato.push(d.id + ': xaritada yo\'q'); continue; }
  const r = RU[d.id]; if (!r) { xato.push(d.id + ': ru karta yo\'q'); continue; }
  const q = QISM[d.id] || ['', ''];
  const k = { uz: { kartaNom: d.kartaNom + q[0], ...d.oquvchiga, mentor: d.mentor }, ru: { ...r, kartaNom: r.kartaNom + q[1] } };
  const tur = d.tur === 'T' ? 'test' : d.tur === 'C' || d.tur === 'CA' ? 'compiler' : d.topshirish.every(t => t === 'link') ? 'text' : 'file';
  const v = { id: d.id, ...x, tur, nomUz: L.uz.nom + k.uz.kartaNom, nomRu: L.ru.nom + k.ru.kartaNom, uz: null, ru: null };
  for (const til of ['uz', 'ru']) {
    if (tur === 'test') {
      const s = TEST[til][d.id]; if (!s) { xato.push(`${d.id}/${til}: test yo'q`); continue; }
      v[til] = { savollar: s.map(q => ({ q: tozala(q.q) + (q.kod ? '\n\n' + q.kod : ''), v: q.v.map(tozala), h: q.h.map(tozala), t: q.t, rasm: rasmYol(til, q.rasm) })) };
      if (s.some(q => q.v.length !== 4 || q.h.length !== 4 || !(q.t >= 0 && q.t < 4))) xato.push(`${d.id}/${til}: test shakli`);
    } else if (tur === 'compiler') {
      const dir = path.join(ROOT, 'compiler', d.id, til === 'ru' ? 'ru' : '');
      const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
      const starter = {};
      for (const f of fs.readdirSync(path.join(dir, 'starter'))) starter[{ '.html': 'html', '.css': 'css', '.js': 'js' }[path.extname(f)]] = fs.readFileSync(path.join(dir, 'starter', f), 'utf8');
      const qo = [];
      if (meta.rasm_manzili && d.id === '2-5') qo.push(`${L[til].logo}: ${ASSET[meta.rasm_manzili]}`);
      else if (meta.rasm_manzili) qo.push(`${L[til].rasm}: ${ASSET[meta.rasm_manzili]}`);
      v[til] = { matn: matn(til, k[til], qo), rasm: rasmYol(til, meta.rasm), prompt: meta.rubrika, kod: meta.tur, agent: d.tur === 'CA', starter };
      if (!meta.rubrika) xato.push(`${d.id}/${til}: rubrika yo'q`);
      if (meta.tur.some(t => !(t in starter)) && !(meta.tur.length === 1)) xato.push(`${d.id}/${til}: starter fayli yetishmaydi (${meta.tur} / ${Object.keys(starter)})`);
    } else {
      v[til] = { sarlavha: k[til].kartaNom, matn: matn(til, k[til]) };
    }
    if (v[til] && /[`]/.test(JSON.stringify(v[til]).replace(/"starter":\{.*?\}/s, ''))) xato.push(`${d.id}/${til}: backtick qoldi`);
  }
  if (nomlar.has(v.nomUz) || nomlar.has(v.nomRu)) xato.push(d.id + ': nom takrorlanadi — ' + v.nomUz); nomlar.add(v.nomUz); nomlar.add(v.nomRu);
  paket.vazifalar[d.id] = v;
}
for (const v of Object.values(paket.vazifalar)) for (const til of ['uz', 'ru']) for (const f of [v[til]?.rasm, ...(v[til]?.savollar || []).map(q => q.rasm)].filter(Boolean))
  if (!fs.existsSync(path.join(ROOT, f))) xato.push(`${v.id}/${til}: rasm topilmadi ${f}`);
fs.writeFileSync(path.join(ROOT, 'lms/paket.json'), JSON.stringify(paket, null, 1) + '\n');
const V = Object.values(paket.vazifalar), sana = t => V.filter(v => v.tur === t).length;
console.log(`${V.length} vazifa · test ${sana('test')} · compiler ${sana('compiler')} · text ${sana('text')} · file ${sana('file')} · tahrir ${V.filter(v => v.uv).length} · yangi ${V.filter(v => !v.uv).length}`);
console.log(xato.length ? '✗ ' + xato.join('\n✗ ') : '✓ xato yo\'q');
process.exit(xato.length ? 1 : 0);
