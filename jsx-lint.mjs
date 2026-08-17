// jsx-lint — DARS FAYLLARIDAGI "JIM" BUZILISHLAR detektori.
//
// Nega kerak: esbuild va `vite build` faqat SINTAKSISNI tekshiradi. Quyidagi xatolar
// sintaktik jihatdan to'g'ri qoladi, lekin darslik BRAUZERDA oq ekran beradi —
// ya'ni ikkala mavjud darvozadan ham o'tib ketadi (F-0802-15 dalili).
//
// 1) CSS-ichida-backtik: dars CSS'i <style>{`…`}</style> template-literalida yashaydi.
//    Izohga `.mt-chip` kabi backtikli yozuv qo'yilsa — satr ERTA yopiladi, qolgani JS
//    sifatida o'qiladi va `ReferenceError: chip is not defined` bo'ladi.
// 2) Bir-qatorli funksiya ichida `//` izoh: `const upd = () => { const z = …; setProperty(…); };`
//    ga `//` qo'shilsa, qatorning QOLGANI kommentga aylanadi (F-0802-14 dalili) —
//    bunisini esbuild tutadi, lekin faqat qavs buzilsa; ba'zan jim o'tadi.
//
// Ishlatish: `npm run lint:jsx` (barcha darslar) yoki `node jsx-lint.mjs <fayl…>`

import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m', B = '\x1b[1m', R = '\x1b[0m';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.jsx')) out.push(p);
  }
  return out;
}

const args = process.argv.slice(2);
const files = args.length ? args : walk('src');

// Darsning CSS bloklari. IKKI shakl bor va ikkalasi ham tekshirilishi shart:
//   (1) <style>{`…`}</style>            — 118 darsda
//   (2) <style>{LESSON_CSS}</style>     — CSS alohida `const X = \`…\`` da (1 darsda)
// 2026-08-03 (F-0803-29): 2-shakl butunlay tekshirilmay qolgan edi — FullSystemProjectLesson
// da CSS izohiga backtik tushdi, esbuild JIM o'tdi (backtiklar juft edi), darslik esa
// brauzerda «note is not defined» bilan qulab tushdi. Ya'ni bu shakl ham ko'rilishi kerak.
function cssBlocks(src) {
  const out = [];
  const OPEN = '<style>{`', CLOSE = '`}</style>';
  let i = 0;
  while ((i = src.indexOf(OPEN, i)) !== -1) {
    const st = i + OPEN.length, en = src.indexOf(CLOSE, st);
    if (en === -1) { out.push({ start: st, body: src.slice(st), unclosed: true }); break; }
    out.push({ start: st, body: src.slice(st, en) });
    i = en + CLOSE.length;
  }
  for (const m of src.matchAll(/<style>\{([A-Za-z_$][\w$]*)\}<\/style>/g)) {
    const decl = new RegExp(`(?:const|let|var)\\s+${m[1]}\\s*=\\s*\``).exec(src);
    if (!decl) continue;
    const st = decl.index + decl[0].length;
    // ⚠️ Yopuvchi backtikni «birinchi uchragan backtik» deb olish MUMKIN EMAS: aynan
    // qidirayotgan xatomiz — izohga tushib qolgan ADASHGAN backtik — o'shanda yopuvchi
    // deb qabul qilinadi va tanadan tashqarida qolib, darvoza jim o'tadi.
    // Shuning uchun e'lon oxiri `;` bilan anchorlanadi: `const X = \`…\`;`
    const endRe = /`\s*;/g; endRe.lastIndex = st;
    const em = endRe.exec(src);
    const en = em ? em.index : -1;
    out.push({ start: st, body: src.slice(st, en === -1 ? src.length : en), unclosed: en === -1 });
  }
  return out;
}

let errors = 0;
const report = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const hits = [];

  // ---- 1) CSS bloki ichida qo'shimcha backtik (ikkala shakl ham) ----
  const BLOCKS = cssBlocks(src);
  for (const blk of BLOCKS) {
    if (blk.unclosed) {
      hits.push({ line: src.slice(0, blk.start).split('\n').length, msg: 'CSS bloki YOPILMAGAN — yopuvchi backtik topilmadi' });
      continue;
    }
    if (!blk.body.includes('`')) continue;
    const before = src.slice(0, blk.start).split('\n').length;
    blk.body.split('\n').forEach((ln, k) => {
      if (ln.includes('`')) hits.push({ line: before + k, msg: `CSS ichida backtik — template-literal erta yopiladi: ${ln.trim().slice(0, 70)}` });
    });
  }

  // ---- 2) bir-qatorli funksiya tanasi ichida `//` izoh ----
  // Naqsh: `=> {` … `//` … va O'SHA qatorda keyin `}` yopilishi kutiladi.
  // ⚠️ Qator-ichidagi satr-literallari hisobga olinadi: kod-namunalaridagi "http://…" va
  // qo'shtirnoq ichidagi "=> {" yolg'on-ijobiy bermasin (F-0802-15 kalibrovkasi).
  const scanOutsideStrings = (ln) => {
    const marks = { arrow: -1, cmt: -1, close: -1 };
    let q = null;
    for (let i = 0; i < ln.length; i++) {
      const ch = ln[i];
      if (q) { if (ch === '\\') i++; else if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { q = ch; continue; }
      if (marks.arrow === -1 && ch === '=' && ln.slice(i, i + 4) === '=> {') { marks.arrow = i; i += 3; continue; }
      if (marks.arrow === -1) continue;
      if (marks.cmt === -1 && ch === '/' && ln[i + 1] === '/' && ln[i - 1] !== ':') marks.cmt = i;
      if (marks.close === -1 && ch === '}') marks.close = i;
    }
    return marks;
  };
  src.split('\n').forEach((ln, k) => {
    const { arrow, cmt, close } = scanOutsideStrings(ln);
    if (arrow === -1 || cmt === -1) return;
    if (close === -1) return;      // ko'p qatorli funksiya — xavf yo'q
    if (close < cmt) return;       // tana izohdan OLDIN yopilgan — xavfsiz
    hits.push({ line: k + 1, msg: `bir-qatorli funksiya ichida // izoh — qatorning qolgani o'chadi: ${ln.trim().slice(0, 70)}` });
  });

  // ---- 3) DARS TUZILMASI (F-0803-06). Qonun hujjatda yozilgani yetmasligi 2026-08-02/03 da
  // to'rt marta isbotlandi (60-qonun 6 faylda, 54-qonun 2 faylda qolib ketgan edi) — shuning
  // uchun tuzilma-qoidalari shu yerda MEXANIK tekshiriladi.
  const metaBlock = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src);
  if (metaBlock) {
    const body = metaBlock[1];
    const lineOf = (idx) => src.slice(0, metaBlock.index + idx).split('\n').length;
    // (a) CodeStrike alohida ekran BO'LMAYDI — u har doim YAKUN sahifasida
    const ar = /type: 'arena'/.exec(body);
    if (ar) hits.push({ line: lineOf(ar.index), msg: "SCREEN_META da alohida 'arena' ekrani — CodeStrike YAKUN sahifasi ichida bo'ladi (P0 PmUserStory / PmLesson2 etaloni)" });
    // (b) uy-vazifa IKKI joyda bo'lmaydi: alohida ekran + yakun-kartasi = dublikat
    const hw = /type: 'homework'/.exec(body);
    const hwInSummary = /className="card hw |hw-big-t/.test(src);
    if (hw && hwInSummary) hits.push({ line: lineOf(hw.index), msg: "uy-vazifa IKKI joyda: alohida 'homework' ekrani + YAKUN sahifasidagi karta — bittasi olib tashlanadi (etalon: yakun ichida)" });
    // (c) SCREEN_META va screens[] uzunligi teng (indeks-siljish bug-sinfi)
    const scr = /const screens = \[([^\]]*)\]/.exec(src);
    if (scr) {
      const nMeta = (body.match(/id: '/g) || []).length;
      const nScr = scr[1].split(',').filter(x => x.trim()).length;
      if (nMeta !== nScr) hits.push({ line: src.slice(0, scr.index).split('\n').length, msg: `SCREEN_META (${nMeta}) va screens[] (${nScr}) uzunligi TENG EMAS — ekran-siljishi` });
    }
  }
  // 🔴 (c2) ANIQLANMAGAN `tr()` — bir tilli darsga ikki tilli kod qo'shilsa, esbuild JIM
  // o'tadi, brauzerda esa `tr is not defined` → OQ EKRAN (F-0803-08 dalili: 19 fayl).
  if (/\btr\(/.test(src) && !/\btr\s*=\s*\(|function tr\s*\(/.test(src) && !/import[^\n]*\btr\b/.test(src)) {
    const m = /\btr\(/.exec(src);
    hits.push({ line: src.slice(0, m.index).split('\n').length, msg: 'tr() ishlatilgan, lekin faylda aniqlanmagan/import qilinmagan — brauzerda «tr is not defined» (oq ekran)' });
  }

  // (d) YAKUN TARTIBI (PmLesson2 etaloni, F-0803-08): «Endi siz bilasiz» va uy-vazifa
  // yonma-yon `split` da TURMAYDI — recap to'liq enli, undan keyin kapsula-tugma.
  const hwCard = /<div className="card hw fade-up d4">/.exec(src);
  if (hwCard) {
    const head = src.lastIndexOf('<div className="split">', hwCard.index);
    if (head !== -1 && src.slice(head, hwCard.index).length < 2200)
      hits.push({ line: src.slice(0, hwCard.index).split('\n').length, msg: "YAKUN tartibi: uy-vazifa kartasi recap bilan `split` da yonma-yon — recap to'liq enli, uy-vazifa esa `hw-big` kapsulasi ostida bo'ladi (PmLesson2 etaloni)" });
  }
  // (e) 54-qonun: YAKUN hero'sida h-sub tasalli-qatori bo'lmaydi (sarlavha o'zi yetadi)
  const hsub = /className="body h-sub fade-up d2">\s*\{(?:PASSED|tr\(PASSED)/.exec(src);
  if (hsub) hits.push({ line: src.slice(0, hsub.index).split('\n').length, msg: "54-qonun: YAKUN hero'sidagi h-sub qatori («Yaxshi harakat…» / «Tabriklaymiz…») olib tashlanadi — sarlavha o'zi yetadi" });

  // ---- 4) IKKI ANIMATSIYA-KLASS BITTA ELEMENTDA (F-0803-22) ----
  // CSS'da `animation` — SHORTHAND: ikkita klass uni yozsa, keyingisi oldingisini butunlay
  // yengadi (birlashtirmaydi). `fade-up` (opacity:0 + forwards) puls-klass bilan uchrashsa,
  // element ABADIY ko'rinmas qoladi — esbuild ham, konsol ham jim (PmLesson5 s2 dalili).
  {
    let css = BLOCKS.map(b => b.body).join('\n');
    css = css.replace(/\/\*[\s\S]*?\*\//g, ' ');   // CSS izohlari selektor-tahlilini buzmasin
    // `animation:` shorthand yozadigan bitta-klassli selektorlar + e'lon tartibi.
    // ⚠️ Faqat «KO'RINMAS QOLISH» holati xato: klass `opacity:0` qo'yib, uni O'Z animatsiyasi
    // (forwards/both) bilan ochadi — «reveal-klass». Boshqa animatsiya-klass ustidan yozsa,
    // opacity 0 da qolib element yo'qoladi. `cs-off` kabi animatsiyani ATAYIN to'xtatuvchi
    // klasslar (opacity:0 siz) — yolg'on-signal, ular ustidan yozishi normal.
    const animCls = new Map();    // nom → { order, reveal }
    const combined = new Set();   // `.a.b { … }` — muallif to'qnashuvni ATAYIN hal qilgan
    let order = 0;
    // Har qoida: oxirgi qavsdan keyingi matn = selektor. Ketma-ket qoidalar (`A{}B{}`)
    // ham tutilsin — shuning uchun oldingi ajratgich TALAB QILINMAYDI (F-0803-22 kalibrovkasi).
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1], decl = m[2];
      const am = /(?:^|[;\s])animation\s*:\s*([^;}]+)/.exec(decl);
      if (!am) continue;
      if (/^\s*none\b/.test(am[1])) continue;   // `animation: none` — bekor qilish (reduced-motion), to'qnashuv emas
      order++;
      const reveal = /opacity\s*:\s*0\s*[;}]/.test(decl) && /\b(forwards|both)\b/.test(decl);
      for (const one of sel.split(',')) {
        const s0 = one.trim();
        const solo = /^\.([A-Za-z0-9_-]+)$/.exec(s0);
        if (solo) {
          const prev = animCls.get(solo[1]);
          animCls.set(solo[1], { order, reveal: reveal || !!prev?.reveal });
          continue;
        }
        const pair = /^\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(s0);
        if (pair) combined.add([pair[1], pair[2]].sort().join('.'));
      }
    }
    if ([...animCls.values()].some(v => v.reveal)) {
      src.split('\n').forEach((ln, k) => {
        for (const m of ln.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
          const raw = (m[1] || m[2] || '');
          // shablon-ifodalarni (${…}) olib tashlaymiz: ular ichida shartli klass bo'lishi mumkin,
          // lekin ularni ham nomlari bo'yicha qo'shib qo'yamiz
          const names = raw.replace(/\$\{/g, ' ').replace(/[}'"?:]/g, ' ').split(/\s+/).filter(Boolean);
          const found = [...new Set(names.filter(n => animCls.has(n)))];
          if (found.length < 2) continue;
          for (const rv of found) {
            const R0 = animCls.get(rv);
            if (!R0.reveal) continue;                       // faqat «ochuvchi» klass xavfli
            for (const other of found) {
              if (other === rv || animCls.get(other).order <= R0.order) continue;  // keyin e'lon qilingani yengadi
              if (combined.has([rv, other].sort().join('.'))) continue;            // juft e'lon bor — hal qilingan
              hits.push({ line: k + 1, msg: `.${rv} (opacity:0 + forwards) ustidan .${other} yozadi — 'animation' shorthand almashadi, element ABADIY KO'RINMAS qoladi. Chiqish-animatsiyasini o'rovchi <div>ga bering yoki '.${rv}.${other}' juft e'lonini yozing` });
            }
          }
        }
      });
    }
  }

  // ---- 5) `<p>` RESETI BITTA-KLASSLI QOIDANI YENGADI (F-0803-27) ----
  // Har darsda reset bor: `.lesson-root p { margin: 0; padding: 0 }`. Uning aniqligi
  // (0,1,1) — klass + teg. Bitta klassli `.xyz { padding: … }` esa (0,1,0), ya'ni KUCHSIZ.
  // Natija: <p className="xyz"> da padding JIMGINA o'chadi, ammo fon/burchak/rang qoladi —
  // blok «yarim buzuq» ko'rinadi (matn chetga yopishadi, pill yassilanadi, burchaklar
  // kesiladi). esbuild ham, brauzer konsoli ham jim. Dalil: PmLesson4 `.oc-pain` —
  // padding 9/12 → 0, karta ichidagi amber chiziq chetdan chetga yopishib qolgan edi.
  // Yechim: selektorni kuchaytiring — `.xyz.xyz { … }` (aynan o'sha elementlar, aniqlik 0,2,0)
  // yoki ota-klass bilan `.karta .xyz { … }`.
  // ⚠️ Faqat PADDING tekshiriladi: `margin` yo'qolishi ham bor, lekin u 2–11px oralig'ida
  // va butun mahsulot shu holatda sozlangan — uni ommaviy «tiriltirish» alohida ish
  // (F-0803-27 tashxisi: 111 faylda 369 ta margin-qoida).
  {
    const css = BLOCKS.map(b => b.body).join('\n');
    const hasReset =/\.lesson-root[^{]*\bp\b[^{]*\{[^}]*(?:margin|padding)\s*:\s*0/.test(css.replace(/\/\*[\s\S]*?\*\//g, ' '));
    if (hasReset) {
      const pCls = new Set();
      for (const m of src.matchAll(/<p\s+[^>]*className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
        const raw = (m[1] || m[2] || '').replace(/\$\{[^}]*\}/g, ' ');
        for (const c of raw.split(/\s+/)) if (c) pCls.add(c);
      }
      if (pCls.size) {
        const nonZero = (v) => v && !/^(?:0(?:px|em|rem|%)?\s*)+$/.test(v.trim());
        // ⚠️ CSS — JS shablon-satri: `color: ${T.ink}` ichidagi jingalak qavslar qoida-tanasini
        // bo'lib yuboradi va `[^{}]*` hech nima topolmaydi. Shuning uchun avval ${…} ni
        // oddiy tokenga almashtiramiz (shusiz darvoza JIM o'tib ketardi — 2026-08-03 kalibrovkasi).
        const cssNoCmt = css.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\$\{[^}]*\}/g, 'VAL');
        // ⚠️ Selektor qoida BOSHIDA turishi shart. Aks holda `.rel-box .mono { … }` kabi
        // avlod-selektorlari yolg'on-signal beradi — ular allaqachon (0,2,0) va resetdan
        // kuchli. Shuning uchun oldidan faqat qator-boshi, `,`, `;` yoki `}` bo'lishi mumkin.
        for (const m of cssNoCmt.matchAll(/(?:^|[;}]|,)\s*\.([A-Za-z][\w-]*)\s*\{([^{}]*)\}/gm)) {
          const name = m[1], decl = m[2];
          if (!pCls.has(name)) continue;
          const pv = (/(?:^|;)\s*padding\s*:\s*([^;]+)/.exec(decl) || [])[1];
          if (!nonZero(pv)) continue;
          // qator-raqami AYNAN qoidaniki bo'lsin (klassning birinchi uchrashuvi emas)
          const ruleRe = new RegExp(`(^|[\\s,;}])\\.${name.replace(/[-]/g, '\\-')}\\s*\\{`, 'm');
          const from = BLOCKS.length ? BLOCKS[0].start : 0;
          const rm = ruleRe.exec(src.slice(from));
          const at = rm ? from + rm.index + rm[1].length : -1;
          hits.push({ line: at === -1 ? 1 : src.slice(0, at).split('\n').length,
            msg: `.${name} <p> ga qo'yiladi, lekin '.lesson-root p' reseti (aniqlik 0,1,1) uning padding'ini (${pv.trim()}) JIMGINA o'chiradi — selektorni '.${name}.${name}' qiling (F-0803-27)` });
        }
      }
    }
  }

  // ---- 4) REGEX-LITERAL ICHIDA BOSHQARUV-BELGI (0x00–0x1F) — 2026-08-17 ov-bandi ----
  // `\b` (so'z-chegara) yozilganda muharrir/heredoc/vosita escape'ni HAQIQIY 0x08 (backspace)
  // belgiga aylantirishi mumkin: `/\breturn\b/` ko'zga bir xil ko'rinadi, lekin hech qachon mos
  // kelmaydi — JsFunctions TASK_KVADRAT shu sabab yakunlanmasdi; K-C-06 tuzatishida ham ikki
  // marta takrorlandi. esbuild/vite buni ko'rmaydi (sintaktik to'g'ri). Faqat regex-literal
  // (`/…/flags`) va `new RegExp('…')` ichi tekshiriladi — string-ajratkichlar (`join('\x01')`
  // kabi) bu bandga kirmaydi.
  const CTRL = /[\x00-\x08\x0b\x0c\x0e-\x1f]/;
  const REGEX_LIT = /(^|[=(,:;!&|?{}\[\s]|return\s|typeof\s)\/(?![/*])((?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^\\/\n\[])+)\/[a-z]*/g;
  const NEW_RE = /new RegExp\(\s*(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  src.split('\n').forEach((ln, k) => {
    if (!CTRL.test(ln)) return;
    const show = (body) => body.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, (c) => `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`).slice(0, 60);
    for (const m of ln.matchAll(REGEX_LIT)) if (CTRL.test(m[2])) hits.push({ line: k + 1, msg: `regex-literal ichida boshqaruv-belgi (haqiqiy 0x08 kabi) — \\b/\\x escape buzilgan, shart hech qachon mos kelmaydi: /${show(m[2])}/` });
    for (const m of ln.matchAll(NEW_RE)) if (CTRL.test(m[2])) hits.push({ line: k + 1, msg: `new RegExp('…') ichida boshqaruv-belgi — escape buzilgan: '${show(m[2])}'` });
  });

  if (hits.length) {
    errors += hits.length;
    report.push({ file, hits });
  }
}

console.log(`${B}\nJSX-LINT — ${files.length} fayl tekshirildi${R}`);
if (!errors) {
  console.log(`${GRN}✓ TOZA — hech qanday topilma yo'q.${R}\n`);
  process.exit(0);
}
console.log(`${RED}🔴 error: ${errors}${R} · fayllar: ${report.length}\n`);
for (const { file, hits } of report) {
  console.log(`${B}${file}${R}  ${RED}🔴${hits.length}${R}`);
  for (const h of hits) console.log(`  ${RED}🔴${R} ${file}:${h.line} → ${h.msg}`);
}
console.log('');
process.exit(1);
