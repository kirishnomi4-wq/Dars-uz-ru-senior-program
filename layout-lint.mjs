// layout-lint.mjs — 📐 LAYOUT DARVOZASI (147-qonun, F-0912-03 · 2026-09-12)
//
// NIMA UCHUN. «So'z qisilib qolgan · yopishib qolgan · chiqib ketgan» sinfini hech bir
// mavjud darvoza KO'RMAYDI: esbuild ✓ · lint:jsx ✓ · lint:dark ✓ · lint:til ✓ bo'lsa ham
// ekran buzuq bo'lishi mumkin. Buzilish faqat CHIZILGANDAN keyin bor — demak brauzerda
// o'lchanadi. Bu asbob `_clip-audit.mjs` (F-0802-16) avlodi: o'sha ikki detektor saqlandi,
// ikkitasi qo'shildi va uchta nuqson tuzatildi (pastda).
//
// TO'RT DETEKTOR
//   A qirqilish  — `overflow: hidden` idishda OQIMDAGI matn tubidan oshgan
//   B ustma-ust  — ikki quti IKKALA o'q bo'yicha kesishgan
//   C chiqish    — matn o'z qutisidan chiqqan (matn tugunlari `Range` bilan o'lchanadi)
//   D yopilish   — absolyut qatlam matnning >8% ini yopgan (⛶ tugmasi kabi)
//
// ASL ASBOBDA TUZATILGAN UCH NUQSON (aks holda o'lchov YOLG'ON aytadi):
//   1. Ekranlar soni `N / M` ning BIRINCHI mosligidan olinardi — nishon-hisoblagichi
//      (🏅 0/4) o'qilib, 18 ekranlik dars 4 ekrani bilan «toza» deb baholanardi.
//      Endi eng KATTA maxraj olinadi.
//   2. Ustma-ust `a.bottom > b.top` deb o'lchanardi — bitta qatordagi yonma-yon
//      <b>/<span> lar ham shunga tushardi (28 yolg'on signal). Endi ikki o'q kesishishi.
//   3. Chrome yo'li Windows'ga qadab qo'yilgandi — Linux'da umuman ishlamasdi.
//
// KALIBROVKA (yolg'onsiz ro'yxatgina ishlatiladi — kalibrovkasiz m1-01 da 30 ta yolg'on):
//   · shaffof qatlam (halqa-konturi, chiziq chizadigan svg) matnni YOPA OLMAYDI
//   · ekran yarmidan ko'pini yopadigan modal (nishon-bayrami) ATAYLAB yopadi
//   · `backface-visibility: hidden` yuz (flashcard orqasi) — 3D aylanish
//   · `overflow-x: auto/scroll` — ataylab skroll, nuqson emas
//
// DETERMINIZM. Kirish-animatsiyasi tugamasdan o'lchansa blok o'z joyida bo'lmaydi va
// yolg'on ustma-ust chiqadi. O'lchovdan oldin `document.getAnimations()` tugashi kutiladi.
//
// O'ZINI SINAYDI. `--selftest` ataylab toshiruvchi CSS kiritadi; detektor uni TUTMASA,
// «toza» hukmiga ishonib bo'lmaydi.
//
// ISHLATISH (vite ishlab turishi shart: `npx vite --port 5300`):
//   npm run lint:layout -- --keys m1-03                  # bitta dars (~20 s)
//   npm run lint:layout -- --keys m1-03 --selftest       # detektor tirikmi
//   npm run lint:layout -- --lang ru --mode mentor       # butun ro'yxat, boshqa kombinatsiya
//   CHROME=/usr/bin/chromium npm run lint:layout         # boshqa brauzer
//   npm run lint:layout -- --vp 1280x773,1366x768        # bir nechta ekran o'lchami
//   npm run lint:layout -- --interact 0                  # faqat boshlang'ich holat (tez)
// Darvozaga qo'yilmagan sabab: vite kerak va daqiqalar ketadi — `npm run gates` tez
// qolishi kerak. Bu modul yakunida va relizdan oldin yuritiladi (MODUL_TUR bandi).
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const BASE = process.env.LESSON_URL || 'http://localhost:5300';
const NL = String.fromCharCode(10);
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const MODES = arg('mode', 'self').split(',');
// Bir nechta ekran o'lchami: dars `--lz` bilan masshtablanadi, ya'ni layout HAR o'lchamda
// boshqacha. 1280x773 — sinf kompyuteri; 1366x768 — eng keng tarqalgan arzon noutbuk.
const VPS = arg('vp', '1280x773,1366x768').split(',').map((v) => v.split('x').map(Number));
const PAR = Number(arg('par', 4));
const MAXSCR = Number(arg('maxscr', 99));
// Ekran ochilgandan keyin nechta interaktiv element bosiladi (0 — bosilmaydi).
// Har bosishdan keyin qayta o'lchanadi: «tuzatilgandan keyingi» holatlar shunday tutiladi.
const INTERACT = Number(arg('interact', 6));
// --selftest: ataylab toshiruvchi CSS kiritiladi. Detektor buni TUTISHI shart —
// aks holda «toza» degan natijaga ishonib bo'lmaydi (o'lchov o'lik bo'lishi mumkin).
const SELFTEST = argv.includes('--selftest');
const LANG = arg('lang', 'uz');   // rus matni o'zbekchadan uzun — toshish aynan ru'da chiqadi

const app = readFileSync('src/App.jsx', 'utf8');
// 🔴 `comp:` YO'Q yozuvlar dars EMAS (m1-13 «Demo Day» kabi, 138 dan 29 ta) — ular
// hech qachon `.lesson-root` chizmaydi va auditni 20 s timeout bilan yiqitadi.
const ALL_KEYS = [...app.matchAll(/\{ key: '([a-z0-9-]+)'[^}]*\}/g)]
  .filter((m) => /comp:/.test(m[0])).map((m) => m[1]);
const KEYS = arg('keys', '') ? arg('keys').split(',') : ALL_KEYS;
// 🔴 DARS-ID RO'YXATI IKKI MANBADAN (F-0912-10). `_lessonids.txt` QO'LDA yuritiladi va
// eskiradi: `pm-m3d5-v1` (m3-05) unda yo'q edi — audit «Darsga qo'shilish» darvozasidan
// o'ta olmay, darsning BIR ekranini ko'rib «toza» degan. Ro'yxat endi manbadan ham
// to'ldiriladi (`lessonId: '...'`), ya'ni yangi dars qo'shilsa o'zi kiradi.
// `src/eski`, `src/2-moodull eski` — ko'rik-nusxalari, ular hisobga olinmaydi.
const idsFromSrc = () => {
  const out = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (/eski/i.test(e.name)) continue; walk(dir + '/' + e.name); continue; }
      if (!e.name.endsWith('.jsx')) continue;
      for (const m of readFileSync(dir + '/' + e.name, 'utf8').matchAll(/lessonId: '([^']+)'/g)) out.add(m[1]);
    }
  };
  try { walk('src'); } catch {}
  return [...out];
};
const LESSON_IDS = [...new Set([
  ...readFileSync('_lessonids.txt', 'utf8').split(NL).map((s) => s.trim()).filter(Boolean),
  ...idsFromSrc(),
])];

const MEASURE = () => {
  const out = { clip: [], overlap: [], hover: [], cover: [], below: [] };
  const root = document.querySelector('.lesson-root');
  if (!root) return out;
  const nameOf = (el) => {
    const c = (typeof el.className === 'string' && el.className.trim())
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return (el.tagName.toLowerCase() + c).slice(0, 52);
  };
  const vis = (el, cs) => !(cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0');
  // 🔴 HARAKATDAGI BEZAK O'LCHANMAYDI. Cheksiz (`infinite`) animatsiya bilan yuruvchi
  // element ATAYLAB joyida turmaydi — uning qo'shnisi bilan kesishuvi layout nuqsoni EMAS.
  // Dalil: m1-01 s8 da `.dc-arrow` (dc-flow, 0,85 s infinite) qo'shni `.dc-dns` chipi ustidan
  // o'tadi — o'lchov qaysi lahzada tushishiga qarab goh chiqadi, goh chiqmaydi.
  // Ota-element ham sanaladi: undagi transform bolalarini ham qimirlatadi.
  const moving = new Set();
  for (const a of document.getAnimations()) {
    if (a.playState !== 'running') continue;
    let it = 1; try { it = a.effect.getTiming().iterations; } catch { continue; }
    if (it !== Infinity) continue;
    const t = a.effect && a.effect.target; if (t) moving.add(t);
  }
  const isMoving = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) if (moving.has(n)) return true; return false; };
  // 🔴 AYLANTIRILGAN ELEMENT O'LCHANMAYDI (F-0912-09, 2026-09-12).
  // `getBoundingClientRect()` doim O'QQA PARALLEL to'rtburchak qaytaradi. Element burilgan
  // bo'lsa, bu to'rtburchak uning haqiqiy egallagan joyidan KATTA bo'ladi — burchaklari
  // qo'shnisiga kirib turadi. Ya'ni «ustma-ust» geometriyaning o'zidan chiqadi, ekranda esa
  // hech narsa buzilmagan. Ikki dalil (2-modul auditi):
  //   · m2-07 s5/s8 — `.tz-beam` qiyaladigan tarozi (`rotate(±4deg)`) qo'shni kartaga 8px kiradi
  //   · m2-09 s5/s12/s15 — «SAYT» sarlavhasi `rotate(1.4deg)`: bu ATAYLAB qiyshiq qoralama
  //     (sabog'ning o'zi — «uslubni aytmasangiz, AI shunday chiqaradi»), nuqson emas
  // Ota-element ham sanaladi: burilgan ota bolalarini ham buradi.
  // 2D matritsa `matrix(a,b,c,d,e,f)` — sof siljish/masshtabda b va c NOL; burilish yoki
  // qiyshaytirish ularni noldan chiqaradi. `matrix3d` da ular 2- va 5-o'rinda turadi.
  const rotatedOne = (cs) => {
    const t = cs.transform;
    if (!t || t === 'none') return false;
    const n = t.slice(t.indexOf('(') + 1, -1).split(',').map(parseFloat);
    if (t.startsWith('matrix3d') && n.length >= 6) return Math.abs(n[1]) > 0.001 || Math.abs(n[4]) > 0.001;
    if (n.length >= 4) return Math.abs(n[1]) > 0.001 || Math.abs(n[2]) > 0.001;
    return false;
  };
  const isRotated = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) if (rotatedOne(getComputedStyle(n))) return true; return false; };

  // ---- A) VERTIKAL QIRQILISH (asl o'lchov, F-0802-16 kalibrovkasi bilan)
  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (!vis(el, cs)) continue;
    if (!(cs.overflowY === 'hidden' || cs.overflow === 'hidden')) continue;
    const box = el.getBoundingClientRect();
    if (box.height < 24) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    const limit = box.bottom - (parseFloat(cs.paddingBottom) || 0);
    let worst = 0, who = '';
    for (const kid of el.children) {
      const ks = getComputedStyle(kid);
      if (ks.position === 'absolute' || ks.position === 'fixed') continue;
      if (!vis(kid, ks) || kid.getAttribute('aria-hidden') === 'true') continue;
      // 🔴 BURILGAN ELEMENT A DETEKTORIDA HAM O'LCHANMAYDI (F-0912-16, 7-modul auditi).
      // Kalibrovka-2 buni B/C/D ga qo'ygan edi, A esa chetda qolgan. Dalil: m7-01 s0 —
      // «QABUL QILINDINGIZ» muhri `rotate(-8deg)`, chegara-qutisi 166px (haqiqiy balandligi
      // ~45px): burilgan keng elementning o'qqa parallel qutisi shuncha shishadi va
      // «16px qirqildi» degan yolg'on chiqadi. Muhr — ataylab qiyshaytirilgan bezak.
      if (isRotated(kid)) continue;
      const kt = (kid.innerText || '').trim(); if (!kt) continue;
      const kb = kid.getBoundingClientRect(); if (kb.height < 6) continue;
      const over = kb.bottom - limit;
      if (over > worst) { worst = over; who = kt.slice(0, 44).replace(/\s+/g, ' '); }
    }
    if (worst > 6) out.clip.push({ el: nameOf(el), cut: Math.round(worst), txt: who });
  }

  // ---- B) USTMA-UST — har qatlamdagi OQIMDAGI bolalar.
  // 🔴 To'g'ri ta'rif: ikki quti IKKALA o'q bo'yicha kesishsa. Faqat `a.bottom > b.top`
  // ni olish yolg'on signal berardi — bitta qatordagi yonma-yon `<b>`/`<span>` lar ham
  // shu shartga tushadi (ular X bo'yicha kesishmaydi, ya'ni ustma-ust EMAS).
  // Inline elementlar umuman sanalmaydi: ular qator ichida oqadi, blok-oqim emas.
  const BLOCKY = new Set(['block', 'flex', 'grid', 'list-item', 'table', 'flow-root']);
  for (const par of root.querySelectorAll('.screen, .screen *')) {
    const ps = getComputedStyle(par);
    if (!vis(par, ps)) continue;
    const kids = [...par.children].filter((k) => {
      const ks = getComputedStyle(k);
      if (ks.position === 'absolute' || ks.position === 'fixed') return false; // bezak qatlami
      if (!BLOCKY.has(ks.display)) return false;                               // inline — qator ichida
      if (!vis(k, ks) || k.getAttribute('aria-hidden') === 'true') return false;
      if (isMoving(k)) return false;                                         // harakatdagi bezak
      if (isRotated(k)) return false;                                        // burilgan — chegarasi yolg'on
      // 🔴 SO'NIB KETAYOTGAN ELEMENT O'LCHANMAYDI (F-0912-11, 4-modul auditi).
      // Animatsiya `both` bilan tugasa, element OXIRGI kadrda qotadi. «Xafa mijoz»
      // 26px chetga suriladi va `opacity: 0.25` ga tushadi — ya'ni KETYAPTI, ko'rinmas
      // holga kelgan. Uning qo'shnisi bilan 22px kesishuvi — sahnaning o'zi, nuqson emas.
      if ((parseFloat(ks.opacity) || 1) < 0.35) return false;
      const b = k.getBoundingClientRect();
      return b.height > 2 && b.width > 2 && (k.innerText || '').trim().length > 0;
    });
    // 🔴 BITTA GRID KATAKCHASI — ATAYLAB ustma-ust (F-0912-10, 3-modul auditi).
    // `grid-area: 1 / 1` ikkovini bitta katakka qo'yish — almashuv naqshi: biri so'nadi,
    // ikkinchisi chiqadi (`PmUserStoryLesson` s1: `silo-lbl` so'nadi → `silo-fill` qoladi).
    // Muallif ularni ONGLI ravishda ustma-ust qo'ygan; geometriya esa «14px kesishdi» deydi.
    const gridCell = (k) => {
      const g = getComputedStyle(k);
      return `${g.gridRowStart}|${g.gridRowEnd}|${g.gridColumnStart}|${g.gridColumnEnd}`;
    };
    const isGrid = ps.display === 'grid' || ps.display === 'inline-grid';
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
        const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        if (!(dy > 1 && dx > 1)) continue;
        if (isGrid && gridCell(kids[i]) === gridCell(kids[j])) continue;   // bitta katak — ataylab
        // 🔴 MANFIY CHEKINISH BILAN ULANGAN SHAKL (F-0912-10). `margin-top: -2px` ikki
        // bo'lakni bir-biriga YOPISHTIRADI (voronka tanasi + nayi: `cm-body`/`cm-chute`).
        // Bu chizmaning o'zi — 2px «kesishuv» hech qanday matnni yemaydi.
        const ma = getComputedStyle(kids[i]), mb = getComputedStyle(kids[j]);
        const negJoin = [ma.marginTop, ma.marginBottom, mb.marginTop, mb.marginBottom]
          .some((v) => parseFloat(v) < 0);
        if (dy <= 3 && negJoin) continue;
        out.overlap.push({ a: nameOf(kids[i]), b: nameOf(kids[j]), px: Math.round(dy) });
      }
    }
  }

  // ---- C) MATN IDISHIDAN CHIQADI (gorizontal) — eng aniq usul.
  // 🔴 `scrollWidth > clientWidth` YOLG'ON signal beradi: bezak qatlamlari (nishon-bayrami
  // `acu-*`, aylanuvchi halqalar) transform bilan chizilади va o'lchovni buzadi.
  // Shuning uchun elementning O'ZINING matn tugunlari Range bilan o'lchanadi va uning
  // kontent-qutisi bilan solishtiriladi: bu aynan o'quvchi ko'radigan narsa.
  const rng = document.createRange();
  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (!vis(el, cs)) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;   // ataylab skroll
    if (isMoving(el)) continue;                                           // harakatdagi bezak
    if (isRotated(el)) continue;                                          // burilgan — quti o'qqa parallel emas
    const texts = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!texts.length) continue;
    // 🔴 KO'P QATORGA O'RALGAN INLINE ELEMENT O'LCHANMAYDI (F-0912-09).
    // O'ralgan inline uchun `getBoundingClientRect()` qator-bo'laklarning BIRLASHMASINI
    // beradi: chap chekka — eng chapdagi bo'lakdan, o'ng chekka — eng o'ngdagisidan.
    // Gorizontal `padding` esa faqat BIRINCHI bo'lakning chapiga va OXIRGI bo'lakning
    // o'ngiga qo'yiladi. Quyidagi hisob paddingni birlashmadan ayiradi — ya'ni padding
    // bo'lmagan chekkadan ham ayiradi — va aynan padding qiymaticha soxta «chiqish» beradi.
    // Dalil: m2-09 s3 — `<span>` «tugma va kartalar», ikki qator, `padding: 0 5px` → over = 5.
    // Xavfsiz: o'ralgan matn ta'rifiga ko'ra o'z birlashma-qutisidan chiqa OLMAYDI (o'ralgan
    // bo'lsa — demak sig'gan), shuning uchun bu yerda haqiqiy nuqson yo'qolmaydi.
    if (cs.display === 'inline' && el.getClientRects().length > 1) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 20) continue;
    const L = box.left + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.paddingLeft) || 0);
    const R = box.right - (parseFloat(cs.borderRightWidth) || 0) - (parseFloat(cs.paddingRight) || 0);
    let maxR = -Infinity, minL = Infinity;
    for (const t of texts) {
      rng.selectNodeContents(t);
      for (const r of rng.getClientRects()) { if (r.width < 0.5) continue; maxR = Math.max(maxR, r.right); minL = Math.min(minL, r.left); }
    }
    if (maxR === -Infinity) continue;
    let over = Math.round(Math.max(maxR - R, L - minL));
    if (over <= 2) continue;
    // 🔴 O'LCHOV — SIYOH BO'YICHA, BO'SHLIQ BO'YICHA EMAS (F-0912-11, 4-modul auditi).
    // `white-space: pre-wrap` qator sinadigan joydagi bo'shliqni SAQLAYDI va u quti
    // tashqarisiga osilib qoladi — CSS shunday ishlaydi, ko'zga hech narsa ko'rinmaydi
    // (bo'shliqda siyoh yo'q). Dalil: m4-13 s11 — 12px monoshriftda «chiqish» aynan 7px,
    // ya'ni BITTA bo'shliq eni. Shubha tug'ilgandagina (over > 2) belgima-belgi qayta
    // o'lchanadi va bo'sh belgilar tashlab yuboriladi — qimmat hisob faqat shu yerda.
    let inkR = -Infinity, inkL = Infinity;
    for (const t of texts) {
      const str = t.textContent;
      for (let i = 0; i < str.length; i++) {
        if (!str[i].trim()) continue;                       // bo'shliq/yangi qator — siyoh emas
        rng.setStart(t, i); rng.setEnd(t, i + 1);
        for (const r of rng.getClientRects()) {
          if (r.width < 0.5) continue;
          inkR = Math.max(inkR, r.right); inkL = Math.min(inkL, r.left);
        }
      }
    }
    if (inkR === -Infinity) continue;
    over = Math.round(Math.max(inkR - R, L - inkL));
    if (over <= 2) continue;
    // qirqilganmi yoki tashqariga chiqqanmi — yuqoridagi eng yaqin kesuvchi ota bo'yicha
    let clipper = null;
    for (let a = el; a && a !== root; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (as.overflowX === 'hidden' || as.overflow === 'hidden') { clipper = nameOf(a); break; }
    }
    // ATAYLAB QISQARTIRISH: `text-overflow: ellipsis` + `nowrap` — muallifning ongli
    // qarori (yonida `title` tooltip yoki nusxalash tugmasi bo'ladi). Nuqson sifatida
    // ko'rsatilsa ro'yxat ishonchsiz bo'ladi, shuning uchun alohida bo'limga ajratiladi.
    const onPurpose = cs.textOverflow === 'ellipsis' && cs.whiteSpace === 'nowrap';
    out.hover.push({
      el: nameOf(el), over, w: Math.round(box.width), ws: cs.whiteSpace, onPurpose,
      ow: cs.overflowWrap, clip: clipper, txt: (el.innerText || '').trim().slice(0, 44).replace(/\s+/g, ' '),
    });
  }

  // ---- D) BOSHQARUV MATN USTIDA (YANGI) — absolyut joylashgan tugma/belgi matnni yopgan.
  // Bu sinfni A/B/C ning uchalasi ham KO'RMAYDI: matn o'z qutisidan chiqmagan, idish
  // kesmagan, blok-oqimda ustma-ust yo'q — ustiga boshqa QATLAM tushgan.
  // Dalil: m1-03 s6 — «0 / 4 ko'rilgan» yozuvini ⛶ tugmasi yopib turibdi (uz ham, ru ham).
  // KALIBROVKA (yolg'on signallarni kesish):
  //  · MODAL — ekranning yarmidan ko'pini yopadigan qatlam (nishon-bayrami `acu-overlay`,
  //    kompilyator qobig'i) ATAYLAB hamma narsani yopadi. Bunday qatlam ochiq bo'lsa,
  //    D o'lchovi umuman o'tkazib yuboriladi: ostidagi matn yopilgani nuqson emas.
  //  · FLIP — `backface-visibility: hidden` bo'lgan yuz (flashcard orqasi) old yuzni
  //    yopishi — 3D aylanishning o'zi, nuqson emas.
  const VPA = innerWidth * innerHeight;
  const area = (b) => Math.max(0, Math.min(b.right, innerWidth) - Math.max(b.left, 0))
                    * Math.max(0, Math.min(b.bottom, innerHeight) - Math.max(b.top, 0));
  const layers = [...root.querySelectorAll('*')].filter((el) => {
    const cs = getComputedStyle(el);
    return (cs.position === 'absolute' || cs.position === 'fixed') && vis(el, cs);
  });
  const modalOpen = layers.some((el) => area(el.getBoundingClientRect()) > VPA * 0.5);
  const floats = modalOpen ? [] : layers.filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.position === 'sticky') return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (cs.pointerEvents === 'none') return false;                  // haqiqiy bezak — bosilmaydi
    if (cs.backfaceVisibility === 'hidden') return false;           // 3D aylanuvchi yuz
    if (isMoving(el)) return false;                                 // harakatdagi bezak
    if (isRotated(el)) return false;                                // burilgan — chegarasi haqiqiy joyidan katta
    // 🔴 FAQAT SHAFFOF BO'LMAGAN qatlam matnni yashira oladi. Halqa-chizig'i (`jr-ring-circle`),
    // ulanish chizig'i chizadigan `svg`, kontur-ramka — geometrik jihatdan matn ustida turadi,
    // lekin ORTIDAN ko'rinadi. Ularni sanash 30 ta yolg'on signal berardi (m1-01 o'lchovi).
    const bg = cs.backgroundColor || '';
    const al = bg.startsWith('rgba') ? parseFloat(bg.split(',')[3]) : (bg === 'transparent' ? 0 : 1);
    const opaque = (al > 0.25) || cs.backgroundImage !== 'none';
    if (!opaque) return false;
    if (el.closest('[style*="backface"], .fc-face, .fc-card')) return false;
    const b = el.getBoundingClientRect();
    if (area(b) > VPA * 0.25) return false;                         // katta panel — qoplama emas
    // 🔴 IDISHNING O'Z PARDASI (F-0912-10, 3-modul auditi). Qatlam O'Z idishini deyarli
    // to'liq yopsa — bu tasodifiy boshqaruv emas, ATAYLAB qo'yilgan HOLAT-pardasi:
    // yuklanish pardasi (`reload-cover`, «sahifa qayta yuklanmoqda» — darsning sabog'i)
    // yoki rentgen qatlami (`xray-ov`, kartaning ichini ko'rsatadi). Ostidagi matn
    // yopilgani — o'sha holatning MA'NOSI. Tasodifiy qoplama (⛶ tugmasi) esa idishning
    // burchagini egallaydi, 92% ini emas — shuning uchun bu qoida haqiqiy nuqsonni yashirmaydi.
    const op = el.offsetParent;
    if (op && op !== document.body && op !== document.documentElement) {
      const ob = op.getBoundingClientRect();
      if (area(ob) > 0 && area(b) > area(ob) * 0.92) return false;
      // 🔴 TORTMA/PANEL (F-0912-11, 4-modul auditi): qatlam idishning BUTUN bo'yiga
      // (yoki butun eniga) cho'zilib, yarmidan ko'pini egallasa — bu chetdan chiqadigan
      // PANEL (telefon maketidagi yon menyu `drawer`: `top:0; height:100%; width:82%`).
      // Panel ostini yopishi — uning ishi. Tasodifiy qoplama (⛶ tugmasi) esa ikkala
      // o'lchamda ham kichik: burchakni egallaydi, butun qirrani emas.
      const fullY = b.height > ob.height * 0.97, fullX = b.width > ob.width * 0.97;
      if ((fullY || fullX) && area(b) > area(ob) * 0.5) return false;
    }
    return b.width > 6 && b.height > 6;
  });
  for (const f of floats) {
    const fb = f.getBoundingClientRect();
    const fz = +getComputedStyle(f).zIndex || 0;
    for (const el of root.querySelectorAll('*')) {
      if (f === el || f.contains(el) || el.contains(f)) continue;
      const cs = getComputedStyle(el);
      if (!vis(el, cs)) continue;
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;   // oqimdagi matn bilan solishtiramiz
      if (el.closest('[aria-hidden="true"]')) continue;
      const texts = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
      if (!texts.length) continue;
      // KO'RINMAS MATN (§34 kalibrovkasi, 2026-09-14): otasi `opacity:0` yoki nol balandlikda qirqilgan —
      // matn tugunining koordinatasi joyida qoladi, lekin ko'zga ko'rinmaydi. Dalil: m4a-03 s10 — yig'ilgan
      // Mentor matni (max-height:0, opacity:0) ustiga taxta sarlavhasidagi agent tugmasi «61% yopdi» deyilgan.
      let hidden = false;
      for (let n = el; n && n !== root; n = n.parentElement) {
        const ns = getComputedStyle(n);
        if (+ns.opacity === 0) { hidden = true; break; }
        if (/(hidden|clip)/.test(ns.overflowY + ' ' + ns.overflow) && n.getBoundingClientRect().height < 1) { hidden = true; break; }
      }
      if (hidden) continue;
      if (isMoving(el)) continue;                                             // harakatdagi sprayt
      if (isRotated(el)) continue;                                            // burilgan matn — rect yolg'on
      // 🔴 CHIZILISH TARTIBI. Faqat `z-index` ni solishtirish YETMAYDI: teng bo'lsa
      // (ikkalasi ham `auto`) DOM'da KEYIN turgani ustida chiziladi. Dalil: dinozavr
      // o'yinida `.rg-sky` (fon, absolute, inset:0) geometrik jihatdan 🍖 ustida turadi,
      // lekin DOM'da undan OLDIN keladi — demak fon pastda, go'sht ko'rinadi.
      // Matnning o'z qatlami — eng yaqin pozitsiyalangan otasi (yo'q bo'lsa oqimda, pastda).
      let ts = null;
      for (let n = el; n && n !== root; n = n.parentElement) { if (getComputedStyle(n).position !== 'static') { ts = n; break; } }
      const tz = ts ? (+getComputedStyle(ts).zIndex || 0) : -1;
      if (tz > fz) continue;                                                  // matn tepada
      if (tz === fz && ts && (f.compareDocumentPosition(ts) & Node.DOCUMENT_POSITION_FOLLOWING)) continue; // matn DOM'da keyin — ustida
      let worst = 0, snippet = '';
      for (const t of texts) {
        rng.selectNodeContents(t);
        for (const r of rng.getClientRects()) {
          if (r.width < 1 || r.height < 1) continue;
          const dx = Math.min(r.right, fb.right) - Math.max(r.left, fb.left);
          const dy = Math.min(r.bottom, fb.bottom) - Math.max(r.top, fb.top);
          if (dx > 1 && dy > 1) {
            const share = (dx * dy) / (r.width * r.height);
            if (share > worst) { worst = share; snippet = t.textContent.trim().slice(0, 40); }
          }
        }
      }
      if (worst > 0.08) out.cover.push({ over: nameOf(f), txt0: nameOf(el), pct: Math.round(worst * 100), txt: snippet });
    }
  }

  // ---- E) PASTKI CHIZIQDAN TUSHADI (F-0913-02, KATTA §34, 147-qonun (e)).
  // A–D matn O'Z qutisidan chiqishini o'lchaydi. Kontent butunlay navigatsiya chizig'i
  // ostiga tushsa (izoh qutisi, yuborish tugmasi, 5-qadam) — hech biri ko'rmaydi: matn
  // qutisida, lekin quti ekrandan pastda. 109-darslik audit shu sababli GitHub darslarini
  // «toza» degan (m4c-03 s17: tugma 158px pastda).
  // O'lchov: `.screen` ichidagi eng pastki KO'RINADIGAN element − `.stage-content` pastki cheti.
  // 🔴 `scrollHeight − clientHeight` ishlatilmaydi: pastki chekinishni to'liq qo'shmaydi.
  // KALIBROVKA:
  //  · ota-element qirqishi (overflow) bilan cheklangan pastki chegara olinadi;
  //  · yopiq `<details>` tanasi — koordinatasi pastda, lekin ko'rinmaydi (m1-09 s3: 265px yolg'on);
  //  · `fixed`, ko'rinmas, `aria-hidden`, bosilmaydigan absolyut bezak sanalmaydi;
  //  · bayram/takrorlash oynasi ochiq bo'lsa o'lchanmaydi (u butun ekranni ataylab yopadi).
  const sc = document.querySelector('.stage-content');
  if (sc && !document.querySelector('.acu-overlay, .rc-overlay')) {
    const clipLine = sc.getBoundingClientRect().bottom;
    // 🔴 KALIBROVKA-7 — CHIZIQNI FAQAT KO'RINADIGAN NARSA BELGILAYDI (§34, uz sivirmasi).
    // Bo'sh o'rovchi `div` (fon/chegara/soya/matnsiz) ekranda hech narsa chizmaydi, lekin
    // `min-height` yoki kelajak kontent uchun joy tutib turadi. Dalil: m1-05 s7 — ekranda
    // hammasi sig'adi, asbob esa 298px bo'sh `div` ni «pastga tushgan» degan.
    const painted = (el, cs) => {
      if (/^(img|svg|canvas|video|input|textarea|select|button|progress)$/i.test(el.tagName)) return true;
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return true;
      const bg = cs.backgroundColor || '';
      const bgA = bg.startsWith('rgba') ? parseFloat(bg.split(',')[3]) : (bg === 'transparent' || !bg ? 0 : 1);
      if (bgA > 0.05 || cs.backgroundImage !== 'none') return true;
      if (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== 'none') return true;
      if (cs.boxShadow && cs.boxShadow !== 'none') return true;
      return false;
    };
    let low = -Infinity, who = '';
    for (const el of sc.querySelectorAll('.screen *')) {
      const cs = getComputedStyle(el);
      if (!vis(el, cs) || cs.position === 'fixed') continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (el.closest('details:not([open]) > :not(summary)')) continue;
      if (cs.position === 'absolute' && cs.pointerEvents === 'none') continue;
      if (!painted(el, cs)) continue;
      const b = el.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      let bottom = b.bottom, top = b.top, hidden = false;
      for (let a = el.parentElement; a && a !== sc; a = a.parentElement) {
        const as = getComputedStyle(a);
        if (as.opacity === '0' || as.visibility === 'hidden') { hidden = true; break; }   // shaffof ota ichida — ko'rinmaydi
        if (/(hidden|clip|auto|scroll)/.test(as.overflowY + ' ' + as.overflow)) { const r = a.getBoundingClientRect(); bottom = Math.min(bottom, r.bottom); top = Math.max(top, r.top); }
      }
      if (hidden || bottom <= top) continue;
      if (bottom > low) { low = bottom; who = nameOf(el) + ' «' + (el.innerText || '').trim().slice(0, 36).replace(/\s+/g, ' ') + '»'; }
    }
    const cut = Math.round(low - clipLine);
    if (cut > 4) out.below.push({ cut, who });
  }

  return out;
};

// 🔴 DETERMINIZM: CHEKLI animatsiyalar OXIRIGACHA kutiladi, cheksizlari (takrorlanuvchi
// bezak — pulsatsiya, aylanish) kutilmaydi — ular hech qachon tugamaydi.
// Ilgari qat'iy 900/1200 ms shift qo'yilgandi: `ip-typing` (0.9 s, kechikish bilan
// boshlanadi) tugamasdan o'lchanib, m1-01 s7 da +144px YOLG'ON toshish bergan edi
// (o'lchandi: 900 ms da kenglik 0, 2000 ms da 168px va toshish yo'q).
const settle = (page) => page.evaluate(() => Promise.race([
  Promise.allSettled(document.getAnimations()
    .filter((a) => a.playState === 'running' && (a.effect?.getTiming?.().iterations ?? 1) !== Infinity)
    .map((a) => a.finished)),
  new Promise((r) => setTimeout(r, 3000)),
])).catch(() => {});

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
async function auditLesson(key, mode, vp) {
  const [VW, VH] = vp;
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([ids, md, lg]) => {
    try {
      localStorage.setItem('cc_lang', lg);
      ids.forEach((id) => localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: md })));
    } catch {}
  }, [LESSON_IDS, mode, LANG]);
  const page = await ctx.newPage();
  const errs = []; const findings = []; let walked = 0; let realFound = false; let clicks = 0; let totalScr = 0;
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 70)));
  try {
    await page.goto(`${BASE}/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.lesson-root', { timeout: 20000 });
    await page.waitForTimeout(450);
    const info = await page.evaluate(() => {
      // 🔴 Darsda BIR NECHTA «N / M» bor: ekran-hisoblagichi (15 / 18) va nishon-hisoblagichi
      // (🏅 0/4). Birinchisini olish 18 o'rniga 4 berardi — audit darsning 4/18 qismini
      // ko'rib «toza» derdi. Eng KATTA maxrajni olamiz: ekranlar soni doim eng kattasi.
      const txt = document.querySelector('.lesson-root')?.innerText || '';
      let total = 0;
      // 🔴 AVVAL EKRAN HISOBLAGICHINING O'ZI (§34, m2-05). Ekran hisoblagichi ikki xonali
      // «01 / 19» (`padStart(2,'0')`). «Eng katta maxraj» ekranning ICHIDAGI hisoblagichga
      // aldanadi: m2-05 1-ekranida «0 / 30» xabar-hisoblagichi bor → total=30, `progRead`
      // esa `p.total !== total` bo'lsa yozuvni JIMGINA rad etadi → har ekran o'rniga 1-ekran
      // o'lchanadi va «toza» chiqadi. Faqat hisoblagich topilmasa eski usul ishlaydi.
      for (const el of document.querySelectorAll('.lesson-root *')) {
        if (el.children.length) continue;
        const mm = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || '');
        if (mm) { total = +mm[2]; break; }
      }
      if (!total) for (const m of txt.matchAll(/(\d+)\s*\/\s*(\d+)/g)) total = Math.max(total, +m[2]);
      let lid = null;
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } }
      return { total, lid };
    });
    let lid = info.lid;
    if (!lid) {
      await page.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash/ }).first().click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(400);
      lid = await page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; });
    }
    const total = Math.min(info.total || 1, MAXSCR);
    totalScr = info.total || 1;
    for (let s = 0; s < total; s++) {
      if (lid) {
        await page.evaluate(([id, sc, tt]) => { localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })); }, [lid, s, total]);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
        // 🔴 NAVIGATSIYA TASDIG'I (§34): hisoblagich so'ralgan ekranni ko'rsatmasa — o'lchov
        // BOSHQA ekranni o'lchayapti. Jim «toza» o'rniga ogohlantirish yoziladi.
        await page.waitForTimeout(150);
        const shown = await page.evaluate(() => { for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const mm = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (mm) return +mm[1]; } return null; });
        if (shown !== null && shown !== s + 1) errs.push(`NAV: s${s} so'raldi, ekranda ${shown}`);
      }
      // E uchun: sarlavha 900px pastga cho'ziladi — kontent pastki chiziqdan tushishi SHART.
      if (SELFTEST) await page.addStyleTag({ content: '.body,.h-title,.ta-h{white-space:nowrap!important;overflow:visible!important} .h-title{padding-bottom:900px!important}' });
      // 🔴 DETERMINIZM: kirish-animatsiyasi (`fade-up` — translateY) tugamasdan o'lchansa,
      // blok o'z joyida bo'lmaydi va YOLG'ON ustma-ust chiqadi (`pre.code-box.fade-up /
      // div.frame-dash` ikki yurgizishdan faqat bittasida chiqqan edi). Qat'iy kutish
      // o'rniga animatsiyalarning O'ZI tugashi kutiladi; cheksizlari uchun 1,2 s shift.
      await settle(page);
      await page.waitForTimeout(120);
      walked++;
      // 🔴 O'LCHOV DOIM TINCH KADRDA. Bosish elementni ko'rinishga tortadi va kontentni
      // suradi; surilgan matn har qanday `fixed` qatlam (jonli lavha) ostiga kelib qoladi —
      // bu SKROLL holati, layout nuqsoni EMAS. Dalil: bosishdan keyin `div.live-badge`
      // dars matnini yopadi deb 33 ta topilma chiqdi, 0-qadamda esa bittasi ham yo'q.
      // Dars bir ekranga sig'ishi shart (60-qonun), demak tinch kadr — to'g'ri o'lchov nuqtasi.
      const rest = () => page.evaluate(() => {
        const sc = document.querySelector('.stage-content'); if (sc) sc.scrollTop = 0;
        window.scrollTo(0, 0);
      }).catch(() => {});
      // 🔴 TASDIQ-QARASH: topilma IKKINCHI o'lchovda ham turishi SHART. Bir marta ko'rilgan
      // narsa o'tkinchi bo'lishi mumkin (kechikkan transition, tortilib ketgan skroll,
      // tugamagan reflow). Dalil: m1-03 s3 da `live-badge → mentor-msg` chiqdi, geometriya
      // esa lavha y 2..30, matn y 162..236 — kesishmaydi. Ikki qarash shuni kesadi.
      const sig = { clip: (x) => 'c|' + x.el + '|' + x.txt, overlap: (x) => 'o|' + x.a + '|' + x.b,
                    hover: (x) => 'h|' + x.el + '|' + x.txt, cover: (x) => 'v|' + x.over + '|' + x.txt0 + '|' + x.txt,
                    below: (x) => 'e|' + x.who };
      const KINDS = ['clip', 'overlap', 'hover', 'cover', 'below'];
      const any = (m) => KINDS.some((k) => m[k].length);
      const take = async (step, panel = false) => {
        await rest();
        const m1 = await page.evaluate(MEASURE);
        if (!any(m1)) return;
        await page.waitForTimeout(350);
        await rest();
        const m2 = await page.evaluate(MEASURE);
        const m = {};
        for (const k of KINDS) {
          const seen = new Set(m2[k].map(sig[k]));
          m[k] = m1[k].filter((x) => seen.has(sig[k](x)));
        }
        if (!any(m)) return;
        // Oxirgi ekran (yakun) ataylab uzun va skroll qilinadi — alohida bo'lim, chiqish kodini yiqitmaydi.
        const last = s === totalScr - 1;
        for (const x of m.below) { x.last = last; x.panel = panel; }
        findings.push({ screen: s, step, ...m });
        if (m.hover.some((h) => !h.onPurpose) || m.clip.length || m.overlap.length || m.cover.length || m.below.some((x) => !x.last && !x.panel)) realFound = true;
      };
      await take(0);
      // INTERAKTIV HOLATLAR: o'quvchi bosadigan elementlar ketma-ket bosiladi va har
      // bosishdan keyin qayta o'lchanadi. Shunday qilib «xato topildi», «tuzatildi» kabi
      // holatlar ham ko'riladi — ular boshlang'ich o'lchovda umuman ko'rinmaydi.
      // To'xtash shartlari: bosiladigan element qolmadi · ekran almashdi (navigatsiya) ·
      // kompilyator ochildi (u alohida dunyo, bu audit uni o'lchamaydi).
      for (let step = 1; step <= INTERACT; step++) {
        const before = await page.evaluate(() => (document.querySelector('.lesson-root')?.innerText || '').slice(0, 80));
        const hit = await page.evaluate(() => {
          const scr = document.querySelector('.screen'); if (!scr) return null;
          const cand = [...scr.querySelectorAll('*')].filter((el) => {
            if (el.dataset.ccHit) return false;
            if (getComputedStyle(el).cursor !== 'pointer') return false;
            if (el.closest('.stage-nav') || el.classList.contains('zoom-btn')) return false;
            // Mentor ekran boshiga bir marta: yig'ilganda React yangi «▾» yozuvini chizadi —
            // belgisiz tugun qayta tanlanib, asbob haqiqiy tugmalarga yetmay qolardi (sahifa har ekranda qayta yuklanadi)
            if (document.body.dataset.ccMentorDone && el.closest('.mentor')) return false;
            const b = el.getBoundingClientRect();
            return b.width > 8 && b.height > 8 && b.top >= 0 && b.bottom <= innerHeight + 200;
          });
          if (!cand.length) return null;
          const el = cand[0]; el.dataset.ccHit = '1';
          // <summary> — akkordeon: o'lchovdan keyin qayta yopiladi (quyida), aks holda ochiq
          // panel keyingi hamma holatni «pastga tushgan» qilib, haqiqiy nuqsonni yashiradi.
          const isSum = el.tagName === 'SUMMARY';
          if (isSum) el.dataset.ccOpen = '1';
          // YIG'ILGAN MENTOR (§34 kalibrovkasi, 2026-09-14): «ko'rsatmani ochish ▾» — o'quvchi o'zi
          // ochadigan panel. Isbot (m4a-03 ru s13): asbob uni 2- va 4-qadamda qayta ochib, 84px
          // «nuqson» yozgan; yig'ilgan holatda haqiqiy qoldiq 36px edi. Butun daraxt bir marta bosiladi.
          const mentorEl = el.closest('.mentor.is-collapsed');
          if (mentorEl) document.body.dataset.ccMentorDone = '1';
          try { (mentorEl || el).click(); } catch { return null; }
          return (isSum ? 'SUMMARY|' : mentorEl ? 'MENTOR|' : '') + (el.innerText || el.className || 'element').trim().slice(0, 30);
        });
        if (!hit) break;
        clicks++;
        await settle(page);
        await page.waitForTimeout(90);
        const open = await page.evaluate(() => !!document.querySelector('.hc-root'));
        if (open) break;                                   // kompilyator ochildi — chiqamiz
        const after = await page.evaluate(() => (document.querySelector('.lesson-root')?.innerText || '').slice(0, 80));
        const isPanel = hit.startsWith('SUMMARY|') || hit.startsWith('MENTOR|');
        await take(step, isPanel);
        if (hit.startsWith('MENTOR|')) {
          // Qayta yig'ish: kontent maydonining bo'sh joyiga bosish (Stage onContentClick)
          await page.evaluate(() => { const c = document.querySelector('.stage-content'); if (c) c.click(); });
          await settle(page);
          continue;
        }
        // 🔴 OCHILGAN PANEL YOPILADI (F-0913-02 kalibrovkasi). m1-09 s3: asbob 🛟 panelini ochib,
        // keyingi 5 holatning hammasida «253px pastga tushdi» degan — sababi bitta ochiq panel.
        if (isPanel) {
          await page.evaluate(() => { const d = document.querySelector('[data-cc-open="1"]'); if (d) { d.removeAttribute('data-cc-open'); d.click(); } });
          await settle(page);
        }
        if (after !== before && /\d+\s*\/\s*\d+/.test(after) === false) break;
      }
      // 🔴 HAR VARIANT (F-0913-02). Yuqoridagi yurish BIRINCHI tugmani bosadi — test ekranida
      // bu ko'pincha to'g'ri javob, ya'ni XATO javob holati (izoh + «Qisqa takrorlash»)
      // hech qachon o'lchanmagan. Ekran qayta ochilib, 2–4-variant bittadan bosiladi.
      if (lid && INTERACT > 0) {
        const OPT = '.screen button[class*="option"]:not([disabled])';
        const reopen = async () => {
          await page.evaluate(([id, sc, tt]) => { localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })); }, [lid, s, total]);
          await page.reload({ waitUntil: 'domcontentloaded' });
          await page.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
          await settle(page); await page.waitForTimeout(120);
        };
        await reopen();
        const nOpt = Math.min(await page.locator(OPT).count(), 4);
        for (let k = 1; k < nOpt; k++) {
          if (k > 1) await reopen();
          const ok = await page.locator(OPT).nth(k).click({ timeout: 2000 }).then(() => true).catch(() => false);
          if (!ok) continue;
          clicks++;
          await settle(page);
          await page.waitForTimeout(400);
          for (let i = 0; i < 12; i++) { if (!(await page.evaluate(() => !!document.querySelector('.acu-overlay')))) break; await page.waitForTimeout(500); }
          await take('v' + k);
        }
      }
      if (!lid) break;
    }
  } catch (e) { errs.push('NAV: ' + String(e.message).slice(0, 60)); }
  await ctx.close();
  return { key, mode, screens: walked, total: totalScr, clicks, realFound, findings, errs: [...new Set(errs)] };
}

// --resume: natija fayli bor bo'lsa, o'lchangan (dars × rejim × ekran) o'tkazib yuboriladi.
// Sabab (§34): 109-darslik yurish xotira bosimida ikki marta o'ldirildi — har safar noldan boshlanardi.
const results = [];
const done = new Set();
if (argv.includes('--resume')) {
  try {
    for (const r of JSON.parse(readFileSync(arg('out', '_layout-audit.json'), 'utf8'))) { results.push(r); done.add(`${r.vp}|${r.mode}|${r.key}`); }
    console.log(`resume: ${results.length} yozuv o'qildi`);
  } catch { console.log('resume: oldingi fayl yo\'q — boshidan'); }
}
for (const vp of VPS) {
for (const mode of MODES) {
  for (let i = 0; i < KEYS.length; i += PAR) {
    const batch = KEYS.slice(i, i + PAR).filter((k) => !done.has(`${vp.join('x')}|${mode}|${k}`));
    if (!batch.length) continue;
    const r = await Promise.all(batch.map((k) => auditLesson(k, mode, vp).then((x) => ({ ...x, vp: vp.join('x') }))));
    results.push(...r);
    // 🔴 Har guruhdan keyin diskka (F-0913-02): xotira tanqisligida jarayon o'ldirilsa, o'lchangan
    // qism yo'qolmasin — ruscha 109-darslik yurish shu sababli bir marta butunlay yo'qolgan.
    writeFileSync(arg('out', '_layout-audit.json'), JSON.stringify(results, null, 1));
    const bad = r.filter((x) => x.findings.length);
    process.stdout.write(`${vp.join('x')} ${mode} [${Math.min(i + PAR, KEYS.length)}/${KEYS.length}] ` + (bad.length ? `NUQSON: ${bad.map((x) => x.key).join(',')}` : 'toza') + NL);
  }
}
}
await browser.close();
writeFileSync(arg('out', '_layout-audit.json'), JSON.stringify(results, null, 1));

const bad = results.filter((r) => r.findings.length);
const tally = (pick, keyf) => { const m = {}; for (const r of bad) for (const f of r.findings) for (const x of pick(f)) { const k = keyf(x); (m[k] ||= { n: 0, files: new Set() }); m[k].n++; m[k].files.add(r.key); } return m; };
const show = (title, m) => {
  const rows = Object.entries(m).sort((a, b) => b[1].files.size - a[1].files.size || b[1].n - a[1].n);
  if (!rows.length) return;
  console.log(NL + '--- ' + title + ' ---');
  for (const [k, v] of rows.slice(0, 25)) console.log(`  ${String(v.files.size).padStart(3)} dars · ${String(v.n).padStart(4)} holat   ${k}`);
};
console.log(NL + '===== NATIJA =====');
console.log(`til: ${LANG} · rejim: ${MODES.join(',')} · ekran: ${VPS.map((v) => v.join('x')).join(' ')} · interaktiv qadam: ${INTERACT}`);
console.log(`tekshirildi: ${results.length} (dars x rejim) · nuqsonli: ${bad.length}`);
console.log(`yurilgan ekranlar: ${results.reduce((a, r) => a + r.screens, 0)} · interaktiv bosish: ${results.reduce((a, r) => a + (r.clicks || 0), 0)}`);
// 🔴 Bosish soni 0 bo'lsa — interaktiv o'lchov JIM ishlamayapti va «toza» hukmi yarim.
if (INTERACT > 0 && results.reduce((a, r) => a + (r.clicks || 0), 0) === 0) console.log('  \u26a0 interaktiv qadam yoqilgan, lekin BIRORTA bosish bo\'lmadi — o\'lchov yarim!');
for (const r of results) if (r.screens <= 1) console.log(`  ⚠ ${r.key}: faqat ${r.screens} ekran (lessonId topilmadi?)`);
show('MATN QUTISIDAN CHIQQAN (sinf)', tally((f) => f.hover.filter((x) => !x.onPurpose), (x) => x.el));
show('ATAYLAB QISQARTIRILGAN — ellipsis (qaror foydalanuvchida)', tally((f) => f.hover.filter((x) => x.onPurpose), (x) => x.el));
show('VERTIKAL QIRQILISH (sinf)', tally((f) => f.clip, (x) => x.el));
show('USTMA-UST (juftlik)', tally((f) => f.overlap, (x) => `${x.a} / ${x.b}`));
show('BOSHQARUV MATNNI YOPGAN', tally((f) => f.cover, (x) => `${x.over}  →  ${x.txt0}`));
// E: har topilma ekran/holat bilan — sinf emas, JOY kerak (tuzatish ekranma-ekran).
const belowKind = (y) => (y.last ? 'last' : y.panel ? 'panel' : 'real');
const belowRows = (want) => { const rows = []; for (const r of bad) for (const f of r.findings) for (const x of (f.below || []).filter((y) => belowKind(y) === want)) rows.push(`  ${r.key} s${f.screen} ${f.step} · ${r.mode} ${r.vp || ''} · ${x.cut}px · ${x.who}`); return rows; };
for (const [title, want] of [['PASTKI CHIZIQDAN TUSHGAN (E)', 'real'], ["O'QUVCHI OCHGAN PANEL pastga tushadi (E, yiqitmaydi — qaror foydalanuvchida)", 'panel'], ['YAKUN EKRANI — ataylab skroll (E, yiqitmaydi)', 'last']]) {
  const rows = belowRows(want); if (!rows.length) continue;
  console.log(NL + '--- ' + title + ' --- ' + rows.length + ' holat');
  for (const x of rows.slice(0, 60)) console.log(x);
}
const errd = results.filter((r) => r.errs.length);
if (errd.length) { console.log(NL + `⚠️ sahifa-xatolari: ${errd.length}`); for (const r of errd.slice(0, 6)) console.log(`   ${r.key}: ${r.errs[0]}`); }

// Chiqish kodi: ATAYLAB qisqartirish yiqitmaydi — faqat haqiqiy nuqson.
process.exit(results.some((r) => r.realFound) ? 1 : 0);
