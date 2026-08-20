// dark-lint — OG'IR/QORA ELEMENT detektori (F-0819-56).
//
// Nega kerak: dars fayllarida «qora tugma» muammosi klass nomi bilan qidirilsa
// TOPILMAYDI. Ikki sabab bor va ikkalasi ham amalda kuydirgan:
//
//  1) KLASS EMAS, XOSSA. `.btn` dan tashqari `.lp-done-btn`, `.mstats-reveal`,
//     `.rc-btn` da ham aynan shu quyuq fon turadi. Klass ro'yxati bilan qidirish
//     ularni ko'rmaydi — qidirish `background` XOSSASI bo'yicha borishi kerak.
//
//  2) TOKEN ICHIDAGI QAVS. Dars CSS'i <style>{`…`}</style> ichida yashaydi va
//     ranglar `${T.ink}` ko'rinishida yoziladi. Qoida tanasini /\{([^}]*)\}/ bilan
//     olsangiz — `${T.ink}` ning YOPUVCHI qavsi qoidani yarim o'qitadi va token
//     orqali berilgan BARCHA quyuq fonlar ko'rinmay qoladi.
//     => Skanlashdan OLDIN tokenlar haqiqiy qiymatga almashtiriladi.
//
// Yana bir naqsh: JSX tomondan `className="btn fade-step"` kabi QO'SHIMCHA klassli
// yozuvlar. `className="btn"` ni qidirish ularni o'tkazib yuboradi.
//
//  3) INLINE STYLE. Qoida CSS'da emas, JSX ichida turishi mumkin:
//     `<span className="ai-badge" style={{ background: T.ink }}>`. CSS'ni skanlash
//     buni KO'RMAYDI — klass o'zi (.ai-badge) toza bo'lsa ham, inline uni bosib
//     ketadi. Shuning uchun `style={{ ... background: ... }}` alohida qidiriladi.
//     (F-0820-57 — m3-06 da aynan shu naqsh detektordan o'tib ketgan edi.)
//
// Ishlatish: `npm run lint:dark` (barcha darslar) yoki `node dark-lint.mjs <fayl…>`

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

// Yorqinlik chegarasi: bundan quyuq fon «og'ir element» hisoblanadi.
const DARK = 0.22;

// Ataylab quyuq bo'lishi KERAK bo'lgan joylar — signal berilmaydi.
const ALLOW = [
  /^\.(vsc|code-box|ai-code|dbg-code|term|cm-body)/,   // muharrir · kod oynalari
  /^\.(qz-|cs-|csn-|hw-big|pod-)/,                     // arena · CODE STRIKE · podium
  // .codechip — matn OQIMI ichidagi kod bo'lagi (`<Code>fetch</Code>`), BOSILMAYDI.
  // Detektorning CTRL_SEL naqshidagi «chip» uni tugma deb o'ylaydi. Uslubi .code-box
  // bilan bir xil (CODE.bg) va u allaqachon istisnoda — juftini ham qo'shamiz (F-0820-63).
  /^\.codechip/,
  // .cq-b — muharrir-qatori: VS Code fonidagi (#1E1E1E) bosiladigan kod satri.
  // m3-08 `.dbg-line` oilasi (u ham `dbg-code` orqali istisnoda). Quyuq fon bu yerda
  // TAQLID: o'quvchi kodni muharrirdagidek ko'rishi kerak (F-0820-86).
  /^\.cq-b/,
  /:hover|:focus|:active/,                             // holat-ranglari
];

// MEZON: quyuq fonning O'ZI muammo emas — telefon maketi, Minecraft qasri, kod-yorlig'i
// ataylab quyuq bo'ladi. Muammo — quyuq INTERAKTIV element (tugma/chip): u sahifadagi
// eng og'ir dog' bo'lib, diqqatni kontentdan tortib oladi va boshqa tugmalardan
// ajralib qoladi. Shuning uchun signal faqat qoida BOSILADIGAN bo'lsa beriladi.
const CTRL_SEL = /btn|chip|cta|tab\b|reveal|toggle|control|pill/i;
const isControl = (sel, body) => CTRL_SEL.test(sel) || /cursor:\s*pointer/.test(body);

// MODIFIKATOR-QOIDALAR (F-0820-73). Bosiladigan element ko'pincha IKKI qoidaga bo'linadi:
// asosiysida XULQ (cursor: pointer), modifikatorida esa HOLAT-RANGI —
//     .navlink    { background: #F6F4EF; cursor: pointer; }
//     .navlink.on { background: #0E0E10; color: #fff; }        <- quyuq fon SHU YERDA
// Modifikator tanasida «cursor» yo'q va klass nomi CTRL_SEL ga tushmasa, skaner uni
// «bosilmaydigan bezak» deb o'tkazib yuborardi. Endi modifikator baholanganda ASOSIY
// qoidaning tanasi ham hisobga olinadi. Ro'yxat klass-nomiga emas, UMUMIY holat-
// qo'shimchalariga tayanadi — bironta darsning o'z klassi bu yerga yozilmaydi.
const MODIF = /\.(on|off|active|selected|current|open|checked|done|ready|is-[a-z0-9-]+)$/i;
const baseSel = (sel) => {
  const s0 = String(sel).trim();
  const cut = s0.replace(MODIF, '');
  return cut !== s0 && /[.#]/.test(cut) ? cut : null;
};

// Tokenlar HAR FAYLNING O'Z palitrasidan o'qiladi — qattiq kodlanmaydi.
// Sabab: PM darslari binafsha palitrada (T.accent = #5B3DE6), texnik darslar
// to'q sariqda (#FF4F28). Qattiq kodlangan qiymat PM faylida noto'g'ri natija beradi.
function readTokens(src) {
  const t = {};
  for (const obj of ['T', 'CODE', 'LT']) {
    const i = src.indexOf(`const ${obj} = {`);
    if (i < 0) continue;
    const body = src.slice(i, src.indexOf('};', i));
    for (const m of body.matchAll(/(\w+)\s*:\s*'(#[0-9A-Fa-f]{3,8})'/g)) t[`\${${obj}.${m[1]}}`] = m[2];
  }
  return t;
}

// CSS dars faylida IKKI xil joyda yashaydi:
//   a) <style>{`…`}</style> ichida to'g'ridan-to'g'ri (texnik darslar)
//   b) `const CSS_BASE = \`…\`` kabi konstantalarda (PM darslari)
// Ikkalasi ham yig'iladi — aks holda PM darslarida skaner BO'SH natija beradi.
function collectCss(src) {
  let css = '';
  const a = src.indexOf('<style>{'), b = src.indexOf('`}</style>');
  if (a >= 0 && b > a) css += src.slice(a, b);
  for (const m of src.matchAll(/const\s+(CSS_[A-Z_]+)\s*=\s*`/g)) {
    const s0 = m.index + m[0].length;
    const s1 = src.indexOf('`;', s0);
    if (s1 > s0) css += '\n' + src.slice(s0, s1);
  }
  return css;
}

// Semantik ranglar — quyuq bo'lsa ham ma'no tashiydi. Ular ATAYLAB quyuq: rangning o'zi
// xabar tashiydi, shuning uchun accent qoidasiga bo'ysundirilmaydi (F-0820-01, m3-07):
//   #1F7A4D · #17603C — muvaffaqiyat (yashil) · #E03E1B — accent:hover
//   #C2362B — T.danger: «Ha, o'chirilsin» kabi qaytarib bo'lmaydigan amal tugmasi.
//       Accentga o'tkazilsa xavf-signali o'chadi — bu yerda rang bezak emas, ogohlantirish.
//   #B45309 — CRUD nishon-to'rtligining U (Update) harfi: C=yashil · R=moviy · U=amber · D=qizil.
//       Nishon tugma emas — bosiladigan kartaning ichidagi belgi, rangi ma'no kodi.
const SEMANTIC = new Set(['#1F7A4D', '#17603C', '#E03E1B', '#C2362B', '#B45309']);

function lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function scan(file) {
  const src = readFileSync(file, 'utf8');
  const a = src.indexOf('<style>{'), b = src.indexOf('`}</style>');
  const TOKENS = readTokens(src);
  const out = [];

  // ── 1-NAQSH · XOSSA bo'yicha (tokenlar AVVAL almashtiriladi) ──
  {
    let css = collectCss(src);
    for (const [k, v] of Object.entries(TOKENS)) css = css.split(k).join(v);
    css = css.replace(/\$\{[^}]*\}/g, '#888888');   // qolgan tokenlar — neytral

    const RULES = [...css.matchAll(/^[ \t]*([.#][^{\n]+?)\s*\{([^}]*)\}/gm)]
      .map(r => ({ sel: r[1].trim(), body: r[2] }));
    const BODY = new Map();
    for (const r of RULES) BODY.set(r.sel, (BODY.get(r.sel) || '') + ';' + r.body);

    for (const m of RULES) {
      const sel = m.sel;
      const bg = m.body.match(/background(?:-color)?:\s*([^;]+)/);
      if (!bg) continue;
      const hex = (bg[1].match(/#[0-9A-Fa-f]{6}/) || [])[0];
      if (!hex) continue;
      const L = lum(hex);
      if (L >= DARK) continue;
      if (SEMANTIC.has(hex.toUpperCase())) continue;
      // Darsning O'Z urg'u rangi «qora» emas — PM darslarida u binafsha (#5B3DE6),
      // yorqinligi past bo'lsa ham bu qoidaning O'ZI, buzilish emas.
      const own = [TOKENS['${T.accent}'], TOKENS['${T.accentVivid}'], TOKENS['${T.success}'], TOKENS['${T.blue}']]
        .filter(Boolean).map(x => x.toUpperCase());
      if (own.includes(hex.toUpperCase())) continue;
      if (ALLOW.some(re => re.test(sel))) continue;
      const _bs = baseSel(sel);
      const _body = m.body + (_bs ? (BODY.get(_bs) || '') : '');
      if (!isControl(_bs ? sel + ' ' + _bs : sel, _body)) continue;   // bosilmaydigan bezak/maket
      out.push({ kind: 'fon', sel, hex, L: L.toFixed(3) });
    }
  }

  // ── 1b-NAQSH · INLINE style={{ background: ... }} (CSS skaneri ko'rmaydi) ──
  {
    const jsxAll = a >= 0 ? src.slice(0, a) + src.slice(b) : src;
    for (const m of jsxAll.matchAll(/style=\{\{([^}]*background[^}]*)\}\}/g)) {
      const decl = m[1];
      const bgm = decl.match(/background(?:Color)?:\s*([^,}]+)/);
      if (!bgm) continue;
      let val = bgm[1].trim();
      // T.ink / CODE.bg kabi token-havolalar -> haqiqiy qiymat
      const tok = val.match(/^(T|CODE|LT)\.(\w+)$/);
      if (tok) val = TOKENS['${' + tok[1] + '.' + tok[2] + '}'] || val;
      const hex = (String(val).match(/#[0-9A-Fa-f]{6}/) || [])[0];
      if (!hex) continue;
      const L = lum(hex);
      if (L >= DARK) continue;
      if (SEMANTIC.has(hex.toUpperCase())) continue;
      const own = [TOKENS['${T.accent}'], TOKENS['${T.accentVivid}'], TOKENS['${T.success}'], TOKENS['${T.blue}']]
        .filter(Boolean).map(x => x.toUpperCase());
      if (own.includes(hex.toUpperCase())) continue;
      // atrofdagi className -> ALLOW ro'yxatiga solishtirish uchun
      const before = jsxAll.slice(Math.max(0, m.index - 160), m.index);
      // JONLI SESSIYA INFRA (P0 dan AYNAN, 122 faylda bir xil, FAQAT mentorga ko'rinadi):
      // bu yerdagi quyuq fonlar dars-kontenti emas, umumiy komponent. Bitta darsda
      // tuzatilmaydi -> KATTA_TOZALASH 1-bandi. Signal bermaymiz, aks holda darvoza
      // hech qachon 0 bo'lmaydi.
      const wide = jsxAll.slice(Math.max(0, m.index - 700), m.index);
      if (/live-badge|_liveBadgeS|LiveBigCode|_liveDot|setBigOpen/.test(wide)) continue;

      // E'LON QILINGAN ISTISNO (F-0820-78). Ba'zi quyuq yuza ATAYLAB quyuq bo'ladi va
      // ma'no tashiydi — masalan darsning bir martalik yakuniy «ma'no-cho'qqisi» lavhasi
      // (DARS_ETALON 127-qonun istisnosi). Bunday joyni hex-oq ro'yxatga qo'shish XATO:
      // #0E0E10 ni SEMANTIC ga solsak, butun detektor ishdan chiqadi. Shuning uchun
      // istisno ELEMENTNING O'ZIDA e'lon qilinadi:
      //     <div data-dark-ok="ma'no-cho'qqisi" style={{ background: T.ink }}>
      // Muallif niyatini YOZIB qoldiradi, skaner esa faqat shu qatorni o'tkazadi.
      if (/data-dark-ok/.test(before) || /data-dark-ok/.test(jsxAll.slice(m.index, m.index + 200))) continue;
      const cls = (before.match(/className=["`{][^"`>}]{0,80}$/) || [''])[0];
      if (ALLOW.some(re => re.test('.' + cls.replace(/^className=["`{]/, '').trim().split(/\s+/)[0]))) continue;
      const line = jsxAll.slice(0, m.index).split(String.fromCharCode(10)).length;
      out.push({ kind: 'fon', sel: `inline :${line} ${cls.slice(-34)}`.trim(), hex, L: L.toFixed(3) });
    }
  }

  // ── 2-NAQSH · KLASS qismiy moslik (JSX tomondan) ──
  const jsx = a >= 0 ? src.slice(0, a) + src.slice(b) : src;
  for (const m of jsx.matchAll(/className=[{"`]([^"`>}]{0,80})/g)) {
    const v = m[1];
    if (!/\bbtn\b|[a-z-]btn|btn[a-z-]/.test(v)) continue;
    if (/btn-ghost|btn-soft|btn-white-accent|zoom-btn|qz-btn|fc-btn|rolike-btn|rostar-btn/.test(v)) continue;
    out.push({ kind: 'btn', sel: v.trim().slice(0, 46) });
  }
  return out;
}

function walk(d, acc = []) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { if (e !== 'node_modules') walk(p, acc); }
    else if (e.endsWith('.jsx')) acc.push(p);
  }
  return acc;
}

const args = process.argv.slice(2);
const files = args.length ? args : walk('src');
let total = 0;
console.log(`${B}\nDARK-LINT — og'ir/qora element detektori · ${files.length} fayl${R}`);
for (const f of files) {
  let hits; try { hits = scan(f); } catch { continue; }
  const fon = hits.filter(h => h.kind === 'fon');
  if (!fon.length) continue;
  total += fon.length;
  console.log(`\n${B}${f}${R}  ${RED}${fon.length}${R}`);
  fon.forEach(h => console.log(`  ${RED}●${R} ${h.sel.padEnd(30)} ${h.hex}  L=${h.L}  ${DIM}— accent qoidasiga bo'ysundirilsinmi?${R}`));
  const btn = [...new Set(hits.filter(h => h.kind === 'btn').map(h => h.sel))];
  if (btn.length) console.log(`  ${DIM}btn-oilasi (qismiy moslik): ${btn.join(' · ')}${R}`);
}
console.log(total ? `\n${RED}${B}Jami: ${total} ta og'ir element${R}\n` : `\n${GRN}✓ TOZA — kutilmagan quyuq fon yo'q.${R}\n`);
