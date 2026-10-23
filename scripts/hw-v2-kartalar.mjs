// ============================================================================
//  hw-v2-kartalar (F-1023-03, 23.10.2026) — 101 dars oxiridagi «Uyga vazifa» kartasiga LMS'dagi v2 shartlarini qo'yadi.
//
//  Manba: uyga-vazifa-v2/lms/paket.json (21.10 da LMS'ga yuklangan 101 vazifa, uz + ru).
//  Vazifa → dars: id «M-N» = LMS moduli M, CRM'dagi o'rni N. LMS_REESTR.json (modul, tartib) orqali topiladi;
//  3- va 4-modulda CRM'da bo'sh «03» qatori bor — N ≥ 3 da reestr tartibi N + 1 (nomlar bilan tekshirilgan, 23.10).
//
//  Har darsga: import { UygaVazifaKarta } + `const HW_V2 = {...}` (shu darsning vazifasi) va karta joyi almashadi:
//    A  {hwOpen && <div className="card hw …">…</div>}   → {hwOpen && <UygaVazifaKarta v={HW_V2} tr={tr} />}
//    B  uyga={<div className="card hw …">…</div>}         → uyga={<UygaVazifaKarta v={HW_V2} tr={tr} />}
//    D  const HwCard = ({ keyingi }) => (…);             → shu nomli komponent yangi kartani chizadi (keyingi saqlanadi)
//    E  const HwKarta = () => (…);  (ichida «Keyingi dars») → yangi karta + o'sha «Keyingi dars» qatori
//       uyga={null}                                       → uyga={<UygaVazifaKarta … />}
//    F  kartasiz va tugmasiz yakun (next-lesson oldidan)    → <UygaVazifaKarta … tugma />
//    G  <QYakun …> uyga'siz                               → uyga={<UygaVazifaKarta … />} (tugmani QYakun chizadi)
//  Ishlatilmay qolgan eski ma'lumot konstantalari (HOMEWORK, HW_QADAM, …) o'chiriladi.
//
//  Ishlatish: node scripts/hw-v2-kartalar.mjs            — quruq yurish (hisobot, hech narsa yozilmaydi)
//             node scripts/hw-v2-kartalar.mjs --yoz      — yozish
//  Qayta yurgizish xavfsiz: HW_V2 bor darsda faqat konstanta yangilanadi.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);
const YOZ = process.argv.includes('--yoz');
const paket = JSON.parse(readFileSync('uyga-vazifa-v2/lms/paket.json', 'utf8')).vazifalar;
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const byPos = {};
for (const [lid, d] of Object.entries(reestr)) byPos[`${d.modul}-${d.tartib}`] = { lid, ...d };

const IMPORT = "import { UygaVazifaKarta } from '../qolip/UygaVazifaKarta.jsx'; // F-1023-03: uyga vazifa v2 kartasi";
const KARTA = '<UygaVazifaKarta v={HW_V2} tr={tr} />';

// <div …> elementining oxirini topadi (ichma-ich div'lar sanaladi). start — «<div» indeksi.
function divOxiri(s, start) {
  const re = /<div\b[^>]*?(\/?)>|<\/div>/g; re.lastIndex = start; let d = 0, m;
  while ((m = re.exec(s))) {
    if (m[0].startsWith('</')) { d--; if (d === 0) return re.lastIndex; }
    else if (m[1] !== '/') d++;
    else if (d === 0) return re.lastIndex;
  }
  return -1;
}
// «const NOM = » dan boshlanib ustun-0 dagi «);» / «};» / «];» qatorigacha (yoki bir qatorli «…;»)
function konstOraligi(s, nom) {
  const m = new RegExp(`^const ${nom} = `, 'm').exec(s); if (!m) return null;
  const a = m.index; const birQator = s.slice(a, s.indexOf('\n', a));
  if (/;\s*(\/\/.*)?$/.test(birQator) && !/[([{]\s*$/.test(birQator.replace(/\/\/.*$/, ''))) return [a, s.indexOf('\n', a) + 1];
  const re = /^[)}\]];[^\n]*\n/gm; re.lastIndex = a; const e = re.exec(s); if (!e) return null;
  return [a, e.index + e[0].length];
}
const ishlatiladi = (s, nom) => (s.match(new RegExp(`\\b${nom}\\b`, 'g')) || []).length > 1; // e'londan tashqari

function hwObj(id, v) {
  const o = { id, tur: v.tur, nom: { uz: v.nomUz, ru: v.nomRu } };
  if (v.tur === 'test') { o.matn = null; o.n = v.uz.savollar.length; if (v.ru.savollar.length !== o.n) throw new Error(`${id}: uz/ru savollar soni farq`); }
  else { o.matn = { uz: v.uz.matn, ru: v.ru.matn }; if (!o.matn.uz || !o.matn.ru) throw new Error(`${id}: matn bo'sh`); }
  return o;
}

const hisobot = [];
let xato = 0;
for (const [id, v] of Object.entries(paket)) {
  const [m, n] = id.split('-').map(Number);
  const d = byPos[`${m}-${(m === 3 || m === 4) && n >= 3 ? n + 1 : n}`];
  if (!d) { hisobot.push(`✗ ${id}: reestrda dars topilmadi`); xato++; continue; }
  let s = readFileSync(d.src, 'utf8'); const asl = s; const qadam = [];
  const konst = `// F-1023-03: uyga vazifa — LMS'dagi «${v.nomUz}» bilan bir xil (uyga-vazifa-v2/lms/paket.json, ${id}). scripts/hw-v2-kartalar.mjs yozadi.\nconst HW_V2 = ${JSON.stringify(hwObj(id, v))};\n`;

  if (/^const HW_V2 = /m.test(s)) {
    s = s.replace(/^\/\/ F-1023-03: uyga vazifa — [^\n]*\nconst HW_V2 = [^\n]*\n/m, konst); qadam.push('HW_V2 yangilandi');
  } else {
    // import + konstanta: oxirgi import qatoridan keyin
    // faqat fayl boshidagi import bloki: birinchi kod qatoridan keyingi «import» — dars ichidagi kod-namuna (23.10: ReactRouterPractice'da shu yerga tushgan)
    const kodBosh = s.search(/^(const|let|var|function|export|class) /m);
    const imps = [...s.matchAll(/^import [^\n]*\n/gm)].filter((x) => kodBosh < 0 || x.index < kodBosh); if (!imps.length) { hisobot.push(`✗ ${id}: import yo'q`); xato++; continue; }
    const at = imps[imps.length - 1].index + imps[imps.length - 1][0].length;
    s = s.slice(0, at) + IMPORT + '\n' + konst + s.slice(at);
    let tur = null;
    let mA = /\{(?:!isMentorL && )?hwOpen && (<div className="card hwk? )/.exec(s);
    let mB = /uyga=\{(<div className="card hwk? )/.exec(s);
    if (mA || mB) {
      const mm = mA || mB; tur = mA ? 'A' : 'B';
      const st = mm.index + mm[0].length - mm[1].length; const en = divOxiri(s, st);
      if (en < 0 || s.slice(en, en + 1) !== '}') { hisobot.push(`✗ ${id} ${d.src}: ${tur} karta oxiri topilmadi`); xato++; continue; }
      qadam.push(`${tur}: eski karta ${s.slice(st, en).split('\n').length} qator → yangi`);
      s = s.slice(0, st) + KARTA + s.slice(en);
    } else if (/^const HwCard = \(\{ keyingi \}\) => /m.test(s) && /uyga=\{<HwCard\b/.test(s)) {
      tur = 'D'; const r = konstOraligi(s, 'HwCard');
      qadam.push(`D: HwCard ${s.slice(r[0], r[1]).split('\n').length - 1} qator → yangi`);
      s = s.slice(0, r[0]) + 'const HwCard = ({ keyingi }) => <UygaVazifaKarta v={HW_V2} tr={tr} keyingi={keyingi} />;\n' + s.slice(r[1]);
    } else if (/^const HwKarta = \(\) => /m.test(s) && /uyga=\{<HwKarta \/>\}/.test(s)) {
      tur = 'E'; const r = konstOraligi(s, 'HwKarta'); const tana = s.slice(r[0], r[1]);
      const k = /<p className="[^"]*keyingi[^"]*">\{(tr\(\{[\s\S]*?\}\))\}<\/p>/.exec(tana);
      if (!k) { hisobot.push(`✗ ${id} ${d.src}: E «keyingi» qatori topilmadi`); xato++; continue; }
      qadam.push(`E: HwKarta ${tana.split('\n').length - 1} qator → yangi + keyingi`);
      s = s.slice(0, r[0]) + `const HwKarta = () => <UygaVazifaKarta v={HW_V2} tr={tr} keyingi={${k[1]}} />;\n` + s.slice(r[1]);
    } else if (/uyga=\{null\}/.test(s)) {
      tur = 'E0'; s = s.replace(/uyga=\{null\}/, `uyga={${KARTA}}`); qadam.push('E0: uyga={null} → karta');
    } else if (/<QYakun til=\{__lang\}/.test(s) && !/<QYakun[^>]*\buyga=/.test(s)) {
      tur = 'G'; if ((s.match(/<QYakun til=\{__lang\}/g) || []).length !== 1) { hisobot.push(`✗ ${id}: QYakun bir nechta`); xato++; continue; }
      s = s.replace(/<QYakun til=\{__lang\}/, `<QYakun til={__lang} uyga={${KARTA}}`); qadam.push('G: QYakun uyga= qo\'shildi');
    } else if ((s.match(/<p className="next-lesson fade-up d4">/g) || []).length === 1 && /\.hw-big \{/.test(s)) {
      tur = 'F'; s = s.replace(/(\n(\s*))(<p className="next-lesson fade-up d4">)/, '$1<UygaVazifaKarta v={HW_V2} tr={tr} tugma />$1$3'); qadam.push('F: tugma + karta (next-lesson oldidan)');
    } else { hisobot.push(`✗ ${id} ${d.src}: naqsh topilmadi`); xato++; continue; }
    // ishlatilmay qolgan eski ma'lumot konstantalari
    for (const nom of ['HOMEWORK', 'HW_QADAM', 'HW_KARTA', 'UYGA', 'HW_BANDLAR', 'HW_BAND', 'HW_ITEMS']) {
      if (!new RegExp(`^const ${nom} = `, 'm').test(s) || ishlatiladi(s, nom)) continue;
      const r = konstOraligi(s, nom); if (!r) { qadam.push(`! ${nom} oraliq topilmadi — qoldi`); continue; }
      s = s.slice(0, r[0]) + s.slice(r[1]); qadam.push(`−${nom}`);
    }
  }
  if (s !== asl && YOZ) writeFileSync(d.src, s);
  hisobot.push(`✓ ${id.padEnd(5)} ${d.key.padEnd(7)} ${d.src.replace('src/', '').padEnd(46)} ${qadam.join(' · ')}`);
}
console.log(hisobot.join('\n'));
console.log(`\n${YOZ ? 'YOZILDI' : 'QURUQ YURISH'} · ${Object.keys(paket).length} vazifa · xato ${xato}`);
process.exit(xato ? 1 : 0);
