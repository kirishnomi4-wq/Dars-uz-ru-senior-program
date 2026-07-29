import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';

// ============================================================
//  KOD COMPILATOR (HtmlCompiler) — ILGARI ./HtmlCompiler.jsx EDI,
//  endi LMS uchun shu faylga BIRLASHTIRILDI (bitta JSX). Nomlar
//  to'qnashmasligi uchun ichki T->HC_T, CODE->HC_CODE deb o'zgartirildi.
// ============================================================

// ============================================================
//  KOD COMPILATOR — mustaqil, qayta ishlatiladigan praktika ekrani
//  index.html + style.css + script.js — uchta fayl, tab bilan.
//  Chap yarmida kod editor (tablar), o'ng yarmida jonli natija (iframe).
//  Tepada shart + tekshiruvlar. Hammasi bajarilsa "Davom etish" yonadi.
//
//  TEKSHIRUV — HAQIQIY TAHLIL (regex emas):
//    • HTML  → DOMParser bilan real DOM: teg bor + ichi bo'sh emas + nesting
//    • CSS   → stylesheet parse: qaysi selektorga qaysi xossa/qiymat yozilgan
//    • JS    → manba (source) namunalari
//  Har shart muvaffaqiyatsiz bo'lsa — aniq MASLAHAT ko'rsatadi.
//
//  LMSga tayyor kontrakt (o'zgarmaydi):
//    <HtmlCompiler task={...} starterCode="..." onContinue={fn} onBack={fn} />
//  Kelajakda CSS/JS darslarida ham shu komponent ishlatiladi — task.files
//  orqali qaysi fayllar ko'rinishini va shartlarni belgilaysiz.
// ============================================================

const HC_T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4D26', accent2: '#FF8A3D', accentSoft: '#FFEDE5',
  success: '#0FA968', successSoft: '#E4F7EE', warn: '#9A5400', shadowBase: '58, 53, 48', line: '#E9E6DF',
};
const HC_CODE = { bg: '#0E1525', text: '#E7EAF2', gutter: '#1C2740' };

// ============================================================
//  TEKSHIRUV YORDAMCHILARI (builders)
//  Har biri ctx (kontekst) qabul qiladigan funksiya qaytaradi.
//  Funksiya:  true  → shart bajarildi
//             "..."  → bajarilmadi, qaytgan matn = o'quvchiga maslahat
//
//  ctx ichida nimalar bor:
//    ctx.html / ctx.css / ctx.js  — xom (raw) manba matnlar
//    ctx.doc                       — o'quvchi HTML'idan qurilgan real DOM
//    ctx.$  / ctx.$$               — doc bo'yicha querySelector / All
//    ctx.cssRules                  — [{selector, props:{...}}] — parslangan CSS
// ============================================================
const norm = (s) => (s || '').trim();

// JS izohlarini olib tashlaymiz — izoh ichidagi matn `js` shartini ALDAB
// o'tmasligi uchun (masalan starterdagi "// console.log ..." izohi).
// Oddiy yondashuv (blok + satr izohi) — o'quv praktikalari uchun yetarli.
const stripJsComments = (src) =>
  (src || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // /* ... */
    .replace(/\/\/[^\n]*/g, ' ');      // // ...

const checks = {
  // Teg/selektor mavjudmi? (hint — string yoki {uz,ru}; tr() check ishga tushganda chaqiriladi)
  has: (sel, hint) => (x) =>
    x.$(sel) ? true : tr(hint ?? { uz: `\`${sel}\` topilmadi`, ru: `\`${sel}\` не найден` }),

  // Mavjud VA ichida bo'sh bo'lmagan matn bormi?
  text: (sel, hint) => (x) => {
    const el = x.$(sel);
    if (!el) return tr(hint ?? { uz: `\`${sel}\` topilmadi`, ru: `\`${sel}\` не найден` });
    return norm(el.textContent) ? true : tr(hint ?? { uz: `\`${sel}\` bor, lekin ichi bo'sh — matn yozing`, ru: `\`${sel}\` есть, но внутри пусто — напишите текст` });
  },

  // Atribut bormi va bo'sh emasmi? (yoki equals bilan aniq qiymat)
  attr: (sel, attr, hint, equals) => (x) => {
    const el = x.$(sel);
    if (!el) return tr(hint ?? { uz: `\`${sel}\` topilmadi`, ru: `\`${sel}\` не найден` });
    const v = el.getAttribute(attr);
    if (v == null || !norm(v)) return tr(hint ?? { uz: `\`${sel}\` da \`${attr}="..."\` to'ldiring`, ru: `заполните \`${attr}="..."\` у \`${sel}\`` });
    if (equals != null && norm(v) !== norm(equals)) return tr(hint ?? { uz: `\`${sel}\` da \`${attr}\` qiymati \`${equals}\` bo'lsin`, ru: `у \`${sel}\` значение \`${attr}\` должно быть \`${equals}\`` });
    return true;
  },

  // Bir nechta atribut — hammasi bo'sh bo'lmasligi kerak
  attrs: (sel, attrList, hint) => (x) => {
    const el = x.$(sel);
    if (!el) return tr(hint ?? { uz: `\`${sel}\` topilmadi`, ru: `\`${sel}\` не найден` });
    const miss = attrList.filter((a) => !norm(el.getAttribute(a) || ''));
    return miss.length ? tr(hint ?? { uz: `\`${sel}\` da \`${miss.join('` va `')}\` to'ldiring`, ru: `заполните \`${miss.join('` и `')}\` у \`${sel}\`` }) : true;
  },

  // child element parent ichidami?
  nested: (parent, child, hint) => (x) =>
    x.$(`${parent} ${child}`) ? true : tr(hint ?? { uz: `\`${child}\` ni \`${parent}\` ichiga joylang`, ru: `поместите \`${child}\` внутрь \`${parent}\`` }),

  // Kamida n ta bormi?
  count: (sel, n, hint) => (x) =>
    x.$$(sel).length >= n ? true : tr(hint ?? { uz: `Kamida ${n} ta \`${sel}\` kerak`, ru: `Нужно минимум ${n} \`${sel}\`` }),

  // CSS: selektorga shu xossa yozilganmi?
  cssProp: (selector, prop, hint) => (x) => {
    const hit = x.cssRules.some(
      (r) => r.selector.split(',').map(norm).includes(norm(selector)) && norm(r.props[prop])
    );
    return hit ? true : tr(hint ?? { uz: `\`${selector}\` uchun \`${prop}\` xossasini yozing`, ru: `для \`${selector}\` задайте свойство \`${prop}\`` });
  },

  // CSS: selektorga shu xossa AYNAN shu qiymat bilan yozilganmi?
  cssValue: (selector, prop, val, hint) => (x) => {
    const hit = x.cssRules.some(
      (r) => r.selector.split(',').map(norm).includes(norm(selector)) && norm(r.props[prop]) === norm(val)
    );
    return hit ? true : tr(hint ?? { uz: `\`${selector}\` da \`${prop}: ${val}\` yozing`, ru: `в \`${selector}\` напишите \`${prop}: ${val}\`` });
  },

  // JS: manbada namuna (regex) bormi? (izohlar hisobga olinmaydi)
  js: (re, hint) => (x) =>
    re.test(stripJsComments(x.js)) ? true : tr(hint ?? { uz: `Skriptda kerakli qism topilmadi`, ru: `В скрипте не найден нужный фрагмент` }),

  // To'liq erkin tekshiruv: (ctx) => true | "maslahat"
  custom: (fn) => fn,

  // ── RUNTIME tekshiruvlar (kod iframe'da ishlatiladi) ──
  // Bular funksiya emas, "probe" obyekti qaytaradi — komponent ularni
  // iframe ichida ishlatib, natijani postMessage orqali oladi.

  // console.log chiqishida shu qiymat bormi?
  logs: (value, hint) => ({ __runtime: 'log_includes', value: String(value), hint }),

  // JS ifoda (masalan global o'zgaruvchi yoki typeof) shu qiymatga tengmi?
  evalEquals: (expr, expected, hint) => ({ __runtime: 'eval_equals', expr, expected: String(expected), hint }),

  // clickSel bosilgach, readSel matni expected'ni o'z ichiga oladimi?
  domAfterClick: (clickSel, readSel, expected, hint) =>
    ({ __runtime: 'click_text', clickSel, readSel, expected: String(expected), hint }),

  // ALMASHISH (toggle): clickSel ni ikki marta bosamiz.
  //   boshida readSel matni = textA, 1-bosishdan keyin = textB,
  //   2-bosishdan keyin yana = textA. Hammasi to'g'ri bo'lsa — haqiqiy toggle.
  toggle: (clickSel, readSel, textA, textB, hint) =>
    ({ __runtime: 'toggle', clickSel, readSel, textA: String(textA), textB: String(textB), hint }),
};

// ============================================================
//  DEKLARATIV SHARTLAR — oddiy data → check (tarjimon)
//  Dars yaratuvchi `C.has('form')` kabi kod yozmasdan, faqat data
//  bilan shart bera oladi: { tag: 'form', attrs: ['action'] }.
//  Istalgan teg/atribut ishlaydi — backend kerak emas, hammasi darsda.
//  Qo'llab-quvvatlanadigan kalitlar:
//    HTML:  { tag, text }                       → teg bor + ichi bo'sh emas
//           { tag, attr, equals? }              → atribut bor (yoki aniq qiymat)
//           { tag, attrs: ['src','alt'] }       → bir nechta atribut
//           { tag, child: 'input' }             → child teg ichidami (nested)
//           { tag, count: 3 }                   → kamida n ta
//    CSS:   { css: { sel, prop, value? } }      → xossa (yoki aniq qiymat)
//    JS:    { js: /addEventListener/ }          → manbada namuna
//    Runtime: { logs: 5 }                       → console.log chiqishi
//             { eval: 'typeof f', equals: 'function' }
//             { click: '#btn', read: '#out', expect: 'Salom' }
//  Har bir kalitga ixtiyoriy `hint` (maslahat matni) qo'shsa bo'ladi.
// ============================================================
function specToCheck(s) {
  const hint = s.hint;
  if (s.css) {
    const { sel, prop, value } = s.css;
    return value != null ? checks.cssValue(sel, prop, value, hint) : checks.cssProp(sel, prop, hint);
  }
  if (s.js) return checks.js(s.js instanceof RegExp ? s.js : new RegExp(s.js), hint);
  if (s.logs !== undefined) return checks.logs(s.logs, hint);
  if (s.eval !== undefined) return checks.evalEquals(s.eval, s.equals, hint);
  if (s.toggle) return checks.toggle(s.toggle, s.read || s.toggle, s.a, s.b, hint);
  if (s.click) return checks.domAfterClick(s.click, s.read, s.expect, hint);
  const sel = s.tag || s.sel;
  if (sel) {
    if (s.child || s.nested) return checks.nested(sel, s.child || s.nested, hint);
    if (s.count != null) return checks.count(sel, s.count, hint);
    if (Array.isArray(s.attrs)) return checks.attrs(sel, s.attrs, hint);
    if (s.attr) return checks.attr(sel, s.attr, hint, s.equals);
    if (s.text) return checks.text(sel, hint);
    return checks.has(sel, hint);
  }
  // Tanib bo'lmadi — yiqilmaydi, shunchaki bajarilmagan bo'lib qoladi
  return () => tr(hint ?? { uz: 'shart aniqlanmadi', ru: 'условие не распознано' });
}

// Deklarativ shartdan o'qiladigan label avtomatik yasaymiz (label berilmasa)
function buildLabel(s) {
  if (s.css) return `CSS: ${s.css.sel} { ${s.css.prop}${s.css.value != null ? `: ${s.css.value}` : ''} }`;
  if (s.logs !== undefined) return { uz: `konsolda «${s.logs}»`, ru: `в консоли «${s.logs}»` };
  if (s.toggle) return `${s.a} ⇄ ${s.b}`;
  if (s.click) return { uz: `bosilsa «${s.expect}»`, ru: `по клику «${s.expect}»` };
  if (s.eval !== undefined) return `${s.eval} = ${s.equals}`;
  if (s.js) return { uz: 'JS namunasi', ru: 'фрагмент JS' };
  const sel = s.tag || s.sel;
  if (sel) {
    if (s.child || s.nested) return { uz: `<${sel}> ichida <${s.child || s.nested}>`, ru: `<${s.child || s.nested}> внутри <${sel}>` };
    if (Array.isArray(s.attrs)) return `<${sel}> — ${s.attrs.join(', ')}`;
    if (s.attr) return `<${sel}> — ${s.attr}`;
    if (s.count != null) return { uz: `kamida ${s.count} ta <${sel}>`, ru: `минимум ${s.count} <${sel}>` };
    if (s.text) return { uz: `<${sel}> (matn bilan)`, ru: `<${sel}> (с текстом)` };
    return `<${sel}>`;
  }
  return { uz: 'shart', ru: 'условие' };
}

// Shartni to'liq { id, label, check } shakliga keltiramiz.
// Eski uslub (check: C.has(...) / runtime obyekt / re:/.../) — tegmaymiz,
// faqat yetishmasa id/label to'ldiramiz. Deklarativ data bo'lsa — tarjima qilamiz.
function normalizeReq(req, i = 0) {
  const ready = typeof req.check === 'function' || (req.check && req.check.__runtime) || req.re;
  if (ready) return { id: req.id ?? `r${i}`, label: req.label ?? '', ...req };
  const check = specToCheck(req);
  const id = req.id ?? `${req.tag || req.sel || 'r'}${i}`;
  return { ...req, id, label: req.label ?? buildLabel(req), check };
}

// ============================================================
//  STANDART SHART (komponent yakka ishga tushganda)
// ============================================================
const DEFAULT_FILES = [
  { name: 'index.html', lang: 'html', starter: `<!-- Bu yerga yozing -->
` },
];

const DEFAULT_TASK = {
  eyebrow: { uz: 'Praktika', ru: 'Практика' },
  title: { uz: "O'z sahifangizni quring", ru: 'Соберите свою страницу' },
  brief: {
    uz: "Quyidagi shartlarni bajaring. Har biri bajarilganda yashil ✓ yonadi. Hammasi yashil bo'lsa — “Davom etish” ochiladi.",
    ru: 'Выполните условия ниже. За каждое выполненное загорается зелёная ✓. Когда всё зелёное — откроется «Продолжить».',
  },
  requirements: [
    { id: 'h1', label: { uz: '<h1> sarlavha (matn bilan)', ru: '<h1> заголовок (с текстом)' }, check: checks.text('h1', { uz: "`<h1>` ichiga sarlavha matnini yozing", ru: 'Напишите текст заголовка внутри `<h1>`' }) },
    { id: 'p', label: { uz: '<p> — matn (paragraf)', ru: '<p> — текст (абзац)' }, check: checks.text('p', { uz: "`<p>` ichiga bir-ikki gap yozing", ru: 'Напишите пару предложений внутри `<p>`' }) },
    { id: 'img', label: { uz: '<img> — src va alt bilan', ru: '<img> — с src и alt' }, check: checks.attrs('img', ['src', 'alt'], { uz: "`<img>` da `src` va `alt` ikkalasini to'ldiring", ru: 'Заполните у `<img>` оба атрибута: `src` и `alt`' }) },
  ],
};

// ============================================================
//  CSS'ni xavfsiz parslash — vaqtinchalik <style> orqali,
//  qiymatlarni oddiy obyektga ko'chirib olamiz (DOM'dan ajratamiz).
// ============================================================
function parseCss(css) {
  if (!css || !css.trim() || typeof document === 'undefined') return [];
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
  let rules = [];
  try {
    rules = [...(el.sheet?.cssRules || [])]
      .filter((r) => r.style) // faqat style qoidalari (media/keyframes emas)
      .map((r) => {
        const props = {};
        for (let i = 0; i < r.style.length; i++) {
          const p = r.style[i];
          props[p] = r.style.getPropertyValue(p);
        }
        // 🔴 QISQA XOSSALAR: CSSOM ularni longhandga yoyadi (padding→4 tomon, margin→4,
        // gap→row-gap/column-gap...) — enumeratsiyada faqat longhand chiqadi, cssProp('.card','padding')
        // topa olmaydi. Qisqa xossani ham qo'shamiz.
        ['gap', 'margin', 'padding', 'border', 'flex', 'background', 'font', 'inset',
         'place-items', 'place-content', 'border-radius', 'flex-flow', 'list-style',
         'transition', 'overflow'].forEach((sh) => {
          if (props[sh] == null) { const v = r.style.getPropertyValue(sh); if (v) props[sh] = v; }
        });
        return { selector: r.selectorText || '', props };
      });
  } catch { /* parse xatosi — bo'sh qaytadi */ }
  el.remove();
  return rules;
}

// ============================================================
//  HTML LINTER — sintaksis tekshiruvi (DOMParser kechirimchi,
//  bu esa qattiqqo'l). Yopilmagan teg, yopish typo'si, yopilmagan
//  tirnoq/izoh, noto'g'ri ichma-ichlikni ushlaydi.
//  Qaytaradi: [{ line, msg }]
// ============================================================
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Yopish tegi IXTIYORIY bo'lgan elementlar (HTML brauzer o'zi yopadi).
// Bularni "yopilmagan" deb xato chiqarmaymiz — aks holda <li>, ketma-ket
// <p> kabi to'g'ri kod noto'g'ri qizil bo'lardi.
const OPTIONAL_CLOSE = new Set(['li', 'p', 'td', 'th', 'tr', 'dt', 'dd', 'option', 'thead', 'tbody', 'tfoot']);
const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul',
]);
// Yangi ochuvchi teg (open) stack tepasidagi (top) ixtiyoriy tegni yopadimi?
function closesOnOpen(open, top) {
  if (top === 'li') return open === 'li';
  if (top === 'p') return open === 'p' || BLOCK_TAGS.has(open);
  if (top === 'option') return open === 'option';
  if (top === 'td' || top === 'th') return open === 'td' || open === 'th' || open === 'tr';
  if (top === 'tr') return open === 'tr';
  if (top === 'dt' || top === 'dd') return open === 'dt' || open === 'dd';
  if (top === 'thead' || top === 'tbody' || top === 'tfoot') return open === 'tbody' || open === 'tfoot' || open === 'thead';
  return false;
}

function lintHtml(src) {
  const errors = [];
  if (!src) return errors;
  const stack = []; // { name, line }
  const n = src.length;
  let i = 0, line = 1, col = 1;
  const here = () => ({ line, col });
  const step = () => { if (src[i] === '\n') { line++; col = 1; } else { col++; } i++; };
  const skipTo = (idx) => { while (i < idx && i < n) step(); };

  while (i < n) {
    if (src[i] !== '<') { step(); continue; }
    const next = src[i + 1];

    // Izoh
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) { errors.push({ ...here(), msg: tr({ uz: 'Izoh yopilmagan (`-->` yetishmayapti)', ru: 'Комментарий не закрыт (не хватает `-->`)' }) }); break; }
      skipTo(end + 3); continue;
    }
    // <!doctype ...> yoki deklaratsiya
    if (next === '!') {
      const end = src.indexOf('>', i);
      if (end === -1) { errors.push({ ...here(), msg: tr({ uz: '`<! ... >` yopilmagan', ru: '`<! ... >` не закрыт' }) }); break; }
      skipTo(end + 1); continue;
    }
    // Yopuvchi teg </...>
    if (next === '/') {
      const start = here();
      let j = i + 2, name = '';
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) { name += src[j]; j++; }
      while (j < n && src[j] !== '>') j++;
      if (j >= n) { errors.push({ line: start.line, msg: tr({ uz: `Yopuvchi teg \`</${name}>\` to'liq emas (\`>\` yetishmayapti)`, ru: `Закрывающий тег \`</${name}>\` неполный (не хватает \`>\`)` }) }); break; }
      const lname = name.toLowerCase();
      // Ixtiyoriy yopiladigan teglarni jimgina yopamiz (masalan </ul> ochiq <li>'ni yopadi)
      while (
        stack.length &&
        OPTIONAL_CLOSE.has(stack[stack.length - 1].name) &&
        stack[stack.length - 1].name !== lname &&
        stack.some((s, idx) => s.name === lname && idx < stack.length - 1)
      ) {
        stack.pop();
      }
      if (stack.length === 0) {
        errors.push({ line: start.line, msg: tr({ uz: `Ortiqcha yopuvchi teg \`</${name}>\` — mos ochuvchi yo'q`, ru: `Лишний закрывающий тег \`</${name}>\` — нет парного открывающего` }) });
      } else {
        const top = stack[stack.length - 1];
        if (top.name === lname) {
          stack.pop();
        } else {
          const idx = stack.map((s) => s.name).lastIndexOf(lname);
          if (idx === -1) {
            errors.push({ line: start.line, msg: tr({ uz: `\`</${name}>\` mos ochuvchi tegga ega emas (xato yoki typo)`, ru: `У \`</${name}>\` нет парного открывающего тега (ошибка или опечатка)` }) });
          } else {
            errors.push({ line: top.line, msg: tr({ uz: `\`<${top.name}>\` yopilmagan — \`</${top.name}>\` kutilgan, \`</${name}>\` keldi`, ru: `\`<${top.name}>\` не закрыт — ожидался \`</${top.name}>\`, а пришёл \`</${name}>\`` }) });
            stack.length = idx;
          }
        }
      }
      skipTo(j + 1); continue;
    }
    // Ochuvchi teg <...>
    if (/[a-zA-Z]/.test(next || '')) {
      const start = here();
      let j = i + 1, name = '';
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) { name += src[j]; j++; }
      let selfClose = false, closed = false, quote = null, strayLt = false;
      while (j < n) {
        const c = src[j];
        if (quote) { if (c === quote) quote = null; j++; continue; }
        if (c === '"' || c === "'") { quote = c; j++; continue; }
        if (c === '<') { strayLt = true; break; }
        if (c === '/' && src[j + 1] === '>') { selfClose = true; closed = true; j += 2; break; }
        if (c === '>') { closed = true; j++; break; }
        j++;
      }
      if (quote && j >= n) { errors.push({ line: start.line, msg: tr({ uz: `\`<${name}>\` ichida tirnoq (${quote}) yopilmagan`, ru: `Кавычка (${quote}) внутри \`<${name}>\` не закрыта` }) }); break; }
      if (strayLt) {
        errors.push({ line: start.line, msg: tr({ uz: `\`<${name}\` tegi \`>\` bilan yopilmagan`, ru: `Тег \`<${name}\` не закрыт символом \`>\`` }) });
        skipTo(j); continue; // '<' dan qayta boshlaymiz
      }
      if (!closed && j >= n) { errors.push({ line: start.line, msg: tr({ uz: `\`<${name}\` tegi \`>\` bilan yopilmagan`, ru: `Тег \`<${name}\` не закрыт символом \`>\`` }) }); break; }
      const lname = name.toLowerCase();
      // Ochuvchi teg stack tepasidagi ixtiyoriy tegni yopsa — jimgina yopamiz
      while (stack.length && closesOnOpen(lname, stack[stack.length - 1].name)) stack.pop();
      if (!selfClose && !VOID_TAGS.has(lname)) stack.push({ name: lname, line: start.line });
      skipTo(j); continue;
    }
    // '<' dan keyin harf/`/`/`!` emas → matn deb qaraladi (brauzer ham shunday)
    step();
  }
  // Oxirida ochiq qolgan teglar (ixtiyoriy yopiladiganlardan tashqari)
  for (const t of stack) {
    if (OPTIONAL_CLOSE.has(t.name)) continue;
    errors.push({ line: t.line, msg: tr({ uz: `\`<${t.name}>\` ochiq qoldi — \`</${t.name}>\` bilan yoping`, ru: `\`<${t.name}>\` остался открытым — закройте его \`</${t.name}>\`` }) });
  }
  return errors;
}

// Bitta shartni ishga tushiramiz → { ok, hint }
function runOne(req, ctx) {
  try {
    // Runtime probe — bu yerda emas, iframe'da tekshiriladi (placeholder)
    if (req.check && req.check.__runtime) {
      return { ok: false, hint: tr({ uz: 'ishga tushirilmoqda…', ru: 'запускается…' }), runtime: true };
    }
    if (typeof req.check === 'function') {
      const r = req.check(ctx);
      if (r === true) return { ok: true, hint: null };
      return { ok: false, hint: typeof r === 'string' ? r : (tr(req.hint) || null) };
    }
    // Eski uslub: regex (orqaga moslik). Izohlarni olib tashlab tekshiramiz.
    if (req.re) {
      const ok = req.re.test((ctx.html || '').replace(/<!--[\s\S]*?-->/g, ''));
      return { ok, hint: ok ? null : (tr(req.hint) || null) };
    }
    return { ok: false, hint: null };
  } catch {
    return { ok: false, hint: tr({ uz: 'tekshirishda xatolik', ru: 'ошибка при проверке' }) };
  }
}

// ============================================================
//  RUNTIME HARNESS — iframe ichida ishlaydigan kod.
//  console.log'ni ushlaydi, probe'larni bajaradi, natijani
//  postMessage bilan ota-oynaga (parent) yuboradi. Xavfsiz:
//  sandbox buzilmaydi, faqat bool natijalar uzatiladi.
// ============================================================
const CONSOLE_CAPTURE = `<script>
window.__logs=[];
(function(){var _l=console.log;console.log=function(){
  for(var i=0;i<arguments.length;i++){var a=arguments[i];
    try{window.__logs.push(typeof a==='object'?JSON.stringify(a):String(a));}catch(e){window.__logs.push(String(a));}}
  try{_l.apply(console,arguments);}catch(e){}
};})();
<\/script>`;

// KO'RINADIGAN konsol uchun: console.log/info/warn/error va xatolarni
// ota-oynaga (parent) postMessage bilan uzatadi → UI'da chiqaramiz.
// nonce — eski va yangi natijalar aralashmasligi uchun.
const CONSOLE_FORWARD = (nonce) => `<script>
(function(){
  var N=${JSON.stringify(nonce)};
  function fmt(a){try{return typeof a==='object'?JSON.stringify(a):String(a);}catch(e){return String(a);}}
  function send(level,args){
    var parts=[];for(var i=0;i<args.length;i++)parts.push(fmt(args[i]));
    try{parent.postMessage({__hcConsole:true,nonce:N,level:level,text:parts.join(' ')},'*');}catch(e){}
  }
  ['log','info','warn','error'].forEach(function(m){
    var _o=console[m]?console[m].bind(console):function(){};
    console[m]=function(){send(m,arguments);try{_o.apply(null,arguments);}catch(e){}};
  });
  window.addEventListener('error',function(e){send('error',[e.message]);});
})();
<\/script>`;

const buildHarness = (probes, nonce) => `<script>
(function(){
  function runProbes(){
    var P=${JSON.stringify(probes)};
    var logs=window.__logs||[];
    var joined=logs.join(' ');
    var out={};
    for(var k=0;k<P.length;k++){
      var p=P[k],ok=false;
      try{
        if(p.type==='log_includes'){
          var v=String(p.value).trim();
          ok=joined.indexOf(v)!==-1||logs.some(function(l){return String(l).trim().indexOf(v)!==-1;});
        }else if(p.type==='eval_equals'){
          var r; try{r=eval(p.expr);}catch(e){r=undefined;}
          ok=String(r)===String(p.expected);
        }else if(p.type==='click_text'){
          var exp=String(p.expected);
          var t0=document.querySelector(p.readSel);
          var before=t0?t0.textContent:'';
          var b=document.querySelector(p.clickSel);
          if(b){try{b.click();}catch(e){}}
          var t1=document.querySelector(p.readSel);
          var after=t1?t1.textContent:'';
          // Matn bosishdan KEYIN paydo bo'lishi kerak (oldin bo'lmagan) — JS'siz o'tmaydi
          ok=after.indexOf(exp)!==-1 && before.indexOf(exp)===-1;
        }else if(p.type==='toggle'){
          var A=String(p.textA).toLowerCase().trim();
          var B=String(p.textB).toLowerCase().trim();
          var rd=function(){var e=document.querySelector(p.readSel);return (e?e.textContent:'').toLowerCase();};
          var b2=document.querySelector(p.clickSel);
          var s0=rd();
          var startOk=s0.indexOf(A)!==-1 && s0.indexOf(B)===-1; // boshida A
          if(b2){try{b2.click();}catch(e){}}
          var s1=rd();
          var firstOk=s1.indexOf(B)!==-1 && s1.indexOf(A)===-1; // 1-bosish -> B
          if(b2){try{b2.click();}catch(e){}}
          var s2=rd();
          var secondOk=s2.indexOf(A)!==-1 && s2.indexOf(B)===-1; // 2-bosish -> A
          ok=startOk && firstOk && secondOk;
        }
      }catch(e){ok=false;}
      out[p.id]=ok;
    }
    try{parent.postMessage({__hcReport:true,nonce:${JSON.stringify(nonce)},results:out},'*');}catch(e){}
  }
  // 'load' hodisasidan keyin ishga tushiramiz — o'quvchi handler'ni
  // window.onload / addEventListener('load') ichida ulagan bo'lsa ham ulgursin.
  function start(){ setTimeout(runProbes, 50); }
  if(document.readyState==='complete') start();
  else window.addEventListener('load', start);
})();
<\/script>`;

// Foydalanuvchi 3 faylini bitta jonli HTML hujjatga birlashtiramiz
const baseStyle = `
  *{box-sizing:border-box}
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;color:#13141A;line-height:1.6;background:#fff}
  h1{font-family:Georgia,serif;margin:0 0 12px;letter-spacing:-.01em}
  img{max-width:100%;border-radius:12px;display:block;margin:10px 0}
  p{margin:0 0 12px}
  li:empty{display:none}`;

const wrapDoc = (html, css, js, opts = {}) => `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_blank">
<style>${baseStyle}
${css || ''}</style>
${opts.capture ? CONSOLE_CAPTURE : ''}
${opts.consoleNonce != null ? CONSOLE_FORWARD(opts.consoleNonce) : ''}
</head>
<body>
${html || ''}
<script>${js || ''}<\/script>
${opts.harness || ''}
</body>
</html>`;

function HtmlCompiler({
  task = DEFAULT_TASK,
  starterCode,            // eski kontrakt: bitta HTML fayl uchun starter
  onContinue,
  onBack,
}) {
  // Shartlarni bir marta normalizatsiya: deklarativ data ham, eski C.has(...)
  // uslubi ham bir xil { id, label, check } shaklga keladi. Quyidagi butun
  // kod (runtimeProbes, results, merged, render) o'zgarmaydi.
  const reqs = useMemo(
    () => (task.requirements || []).map((r, i) => normalizeReq(r, i)),
    [task.requirements]
  );

  // Fayllar: task.files bo'lsa o'shani, bo'lmasa eski yakka HTML faylni ishlatamiz
  const files = useMemo(() => {
    if (task.files && task.files.length) return task.files;
    const single = { ...DEFAULT_FILES[0], starter: tr({ uz: DEFAULT_FILES[0].starter, ru: '<!-- Пишите здесь -->\n' }) };
    if (starterCode != null) single.starter = tr(starterCode);
    return [single];
  }, [task.files, starterCode]);

  const [codes, setCodes] = useState(() =>
    Object.fromEntries(files.map((f) => [f.name, f.starter ?? '']))
  );
  const [active, setActive] = useState(files[0].name);
  const taRef = useRef(null);

  // Til bo'yicha matnni olish (birlashtirilgan preview uchun)
  const byLang = (lang) => {
    const f = files.find((ff) => ff.lang === lang);
    return f ? (codes[f.name] ?? '') : '';
  };
  const html = byLang('html'), css = byLang('css'), js = byLang('js');

  // Runtime shartlar (iframe'da ishlatib tekshiriladi)
  const runtimeProbes = useMemo(
    () => reqs.filter((r) => r.check && r.check.__runtime)
      .map((r) => ({ id: r.id, type: r.check.__runtime, ...r.check })),
    [reqs]
  );
  const hasRuntime = runtimeProbes.length > 0;
  const nonceRef = useRef(0);
  const [runtimeResults, setRuntimeResults] = useState({});

  // ── KO'RINADIGAN KONSOL — JS fayli bo'lsa ko'rsatamiz (console.log natijasi) ──
  const showConsole = useMemo(() => files.some((f) => f.lang === 'js'), [files]);
  const consoleNonceRef = useRef(0);
  const [consoleLines, setConsoleLines] = useState([]);

  // Ko'rinadigan preview — HECH QACHON tekshiruv tomonidan o'zgartirilmaydi
  const [doc, setDoc] = useState(() => wrapDoc(html, css, js));
  // Tekshiruv hujjati — alohida YASHIRIN iframe'da ishlaydi (tugmani bosadi,
  // DOMni o'zgartiradi — lekin foydalanuvchi buni ko'rmaydi)
  const [checkDoc, setCheckDoc] = useState('');
  // Jonli natijani debounce bilan yangilaymiz (har bosishda emas)
  useEffect(() => {
    const id = setTimeout(() => {
      const cn = showConsole ? ++consoleNonceRef.current : null;
      if (showConsole) setConsoleLines([]); // yangi ishga tushishda konsol tozalanadi
      setDoc(wrapDoc(html, css, js, cn != null ? { consoleNonce: cn } : {}));
      if (hasRuntime) {
        const nonce = ++nonceRef.current;
        setRuntimeResults({}); // kutish holatiga qaytaramiz
        setCheckDoc(wrapDoc(html, css, js, { capture: true, harness: buildHarness(runtimeProbes, nonce) }));
      }
    }, 300);
    return () => clearTimeout(id);
  }, [html, css, js, hasRuntime, runtimeProbes, showConsole]);

  // iframe'dan kelgan runtime natijalarni qabul qilamiz (faqat oxirgi nonce)
  useEffect(() => {
    if (!hasRuntime) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcReport && d.nonce === nonceRef.current) {
        setRuntimeResults(d.results || {});
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasRuntime]);

  // Preview iframe'dan kelgan console.log xabarlarini yig'amiz (faqat oxirgi nonce)
  useEffect(() => {
    if (!showConsole) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcConsole && d.nonce === consoleNonceRef.current) {
        setConsoleLines((prev) => (prev.length >= 200 ? prev : [...prev, { level: d.level, text: d.text }]));
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [showConsole]);

  // ── TEKSHIRUV: real tahlil, sinxron, xavfsiz (iframe'ga tegmaydi) ──
  const results = useMemo(() => {
    const parsed = new DOMParser().parseFromString(html || '', 'text/html');
    const ctx = {
      html, css, js,
      doc: parsed,
      $: (s) => { try { return parsed.querySelector(s); } catch { return null; } },
      $$: (s) => { try { return [...parsed.querySelectorAll(s)]; } catch { return []; } },
      cssRules: parseCss(css),
    };
    return reqs.map((r) => runOne(r, ctx));
  }, [html, css, js, reqs]);

  // ── SINTAKSIS: HTML linter (DOMParser ushlamaydigan xatolarni tutadi) ──
  const htmlErrors = useMemo(() => lintHtml(html), [html]);
  const hasSyntaxError = htmlErrors.length > 0;

  // Sinxron + runtime natijalarni birlashtiramiz
  const merged = reqs.map((r, i) => {
    if (r.check && r.check.__runtime) {
      const got = runtimeResults[r.id];
      if (got === undefined) return { ok: false, hint: tr({ uz: 'ishga tushirilmoqda…', ru: 'запускается…' }) };
      return { ok: !!got, hint: got ? null : (tr(r.check.hint) || tr({ uz: 'natija kutilgancha emas', ru: 'результат не такой, как ожидалось' })) };
    }
    return results[i];
  });

  const passedCount = merged.filter((r) => r.ok).length;
  const allPassed = reqs.length > 0 && passedCount === reqs.length && !hasSyntaxError;
  const firstHint = merged.find((r) => !r.ok && r.hint)?.hint;

  const setActiveCode = (val) => setCodes((prev) => ({ ...prev, [active]: val }));

  // Tab tugmasi 2 bo'sh joy qo'shsin
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const s = el.selectionStart, en = el.selectionEnd;
      const cur = codes[active] ?? '';
      const next = cur.slice(0, s) + '  ' + cur.slice(en);
      setActiveCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };

  const runNow = () => {
    const cn = showConsole ? ++consoleNonceRef.current : null;
    if (showConsole) setConsoleLines([]);
    setDoc(wrapDoc(html, css, js, cn != null ? { consoleNonce: cn } : {}));
  };
  const reset = () => setCodes(Object.fromEntries(files.map((f) => [f.name, f.starter ?? ''])));

  return (
    <div className="hc-root">
      <StyleTag />

      {/* ── Tepa: shart (markazda) ── */}
      <header className="hc-top">
        {task.eyebrow && <span className="hc-eyebrow">{tr(task.eyebrow)}</span>}
        <h1 className="hc-title">{tr(task.title)}</h1>
        {task.brief && <p className="hc-brief">{tr(task.brief)}</p>}
        <div className="hc-checklist">
          <span className="hc-count">{passedCount}/{reqs.length}</span>
          {reqs.map((r, i) => (
            <span key={r.id} className={`hc-chip ${merged[i]?.ok ? 'ok' : ''}`} title={merged[i]?.hint || ''}>
              <span className="hc-dot">{merged[i]?.ok ? '✓' : i + 1}</span>
              {tr(r.label)}
            </span>
          ))}
        </div>
        {hasSyntaxError ? (
          <div className="hc-errors">
            {htmlErrors.slice(0, 3).map((e, k) => (
              <span key={k} className="hc-err">⚠ {tr({ uz: 'Sintaksis · qator', ru: 'Синтаксис · строка' })} {e.line}: {e.msg}</span>
            ))}
            {htmlErrors.length > 3 && <span className="hc-err">{tr({ uz: `… va yana ${htmlErrors.length - 3} ta xato`, ru: `… и ещё ${htmlErrors.length - 3} ошибок` })}</span>}
          </div>
        ) : (!allPassed && firstHint && (
          <p className="hc-hint">💡 {firstHint}</p>
        ))}
      </header>

      {/* ── O'rta: editor | natija ── */}
      <main className="hc-split">
        <section className="hc-pane hc-editor-pane">
          <div className="hc-pane-bar hc-tabs-bar">
            <span className="hc-dots"><i /><i /><i /></span>
            <div className="hc-tabs">
              {files.map((f) => (
                <button
                  key={f.name}
                  className={`hc-tab ${active === f.name ? 'active' : ''}`}
                  onClick={() => setActive(f.name)}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <button className="hc-mini" onClick={runNow} title={tr({ uz: 'Ishga tushirish', ru: 'Запустить' })}>▶ {tr({ uz: 'Ishga tushirish', ru: 'Запустить' })}</button>
          </div>
          <textarea
            ref={taRef}
            className="hc-code"
            value={codes[active] ?? ''}
            onChange={(e) => setActiveCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={tr({ uz: 'Kodingizni shu yerga yozing…', ru: 'Пишите свой код здесь…' })}
          />
        </section>

        <section className="hc-pane hc-preview-pane">
          <div className="hc-pane-bar">
            <span className="hc-pane-name">📺 {tr({ uz: 'Natija', ru: 'Результат' })}</span>
            <span className="hc-live">{tr({ uz: 'jonli', ru: 'live' })}</span>
          </div>
          <iframe
            className="hc-frame"
            title="natija"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            srcDoc={doc}
          />
          {showConsole && (
            <div className="hc-console">
              <div className="hc-console-bar">
                <span className="hc-console-title">🖥️ Console</span>
                {consoleLines.length > 0 && (
                  <button className="hc-console-clear" onClick={() => setConsoleLines([])}>{tr({ uz: 'tozalash', ru: 'очистить' })}</button>
                )}
              </div>
              <div className="hc-console-body">
                {consoleLines.length === 0 ? (
                  <div className="hc-console-empty">{tr({ uz: 'console.log(...) natijasi shu yerda chiqadi', ru: 'результат console.log(...) появится здесь' })}</div>
                ) : (
                  consoleLines.map((l, i) => (
                    <div key={i} className={`hc-console-line lvl-${l.level}`}>
                      <span className="hc-console-caret">›</span>
                      <span className="hc-console-text">{l.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Yashirin tekshiruv iframe'i — probe'lar shu yerda ishlaydi (tugmani
          bosadi, DOMni o'zgartiradi), foydalanuvchi ko'radigan preview esa toza qoladi */}
      {hasRuntime && (
        <iframe
          aria-hidden="true"
          tabIndex={-1}
          title="tekshiruv"
          sandbox="allow-scripts"
          srcDoc={checkDoc}
          style={{ position: 'fixed', left: '-9999px', top: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none', border: 'none' }}
        />
      )}

      {/* ── Past: harakatlar ── */}
      <footer className="hc-bottom">
        {onBack && <button className="hc-ghost" onClick={onBack}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>}
        <button className="hc-ghost" onClick={reset}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button>
        <div className="hc-status">
          {allPassed
            ? <span className="hc-ok-msg">✓ {tr({ uz: 'Barcha shartlar bajarildi!', ru: 'Все условия выполнены!' })}</span>
            : <span className="hc-wait-msg">{tr({ uz: "Shartlarni bajaring — natija o'ngda ko'rinadi", ru: 'Выполняйте условия — результат виден справа' })}</span>}
        </div>
        <button
          className="hc-next"
          disabled={!allPassed}
          onClick={() => allPassed && onContinue && onContinue({ codes, code: html })}
        >
          {tr({ uz: 'Davom etish', ru: 'Продолжить' })} →
        </button>
      </footer>
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
      .hc-root,.hc-root *{box-sizing:border-box}
      .hc-root{font-family:'Manrope',system-ui,sans-serif;color:${HC_T.ink};background:
        radial-gradient(120% 80% at 50% -10%, ${HC_T.accentSoft} 0%, rgba(255,237,229,0) 46%),
        ${HC_T.bg};
        height:100dvh;display:flex;flex-direction:column;justify-content:center;gap:clamp(12px,1.8vw,18px);padding:clamp(16px,2.4vw,30px);overflow:hidden;-webkit-font-smoothing:antialiased;width:100%;max-width:1160px;margin:0 auto}

      .hc-top{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
      .hc-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:800;color:${HC_T.accent};display:inline-flex;align-items:center;gap:7px}
      .hc-eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.accent}}
      .hc-title{font-family:Georgia,serif;font-size:clamp(22px,3vw,32px);margin:0;color:${HC_T.ink};font-weight:600;letter-spacing:-.015em;line-height:1.12}
      .hc-brief{margin:0;color:${HC_T.ink2};font-size:clamp(13px,1.5vw,15px);line-height:1.55;max-width:60ch}

      .hc-checklist{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:6px}
      .hc-count{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;color:#fff;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});padding:6px 11px;border-radius:99px;box-shadow:0 6px 16px -6px rgba(255,77,38,.5)}
      .hc-chip{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:${HC_T.ink2};background:${HC_T.paper};padding:6px 14px 6px 7px;border-radius:99px;border:1px solid ${HC_T.line};box-shadow:0 1px 2px rgba(${HC_T.shadowBase},.04);transition:all .22s ease;cursor:default}
      .hc-chip.ok{color:${HC_T.ink};font-weight:600;border-color:${HC_T.success}40;background:${HC_T.successSoft}}
      .hc-dot{flex-shrink:0;width:21px;height:21px;border-radius:50%;background:${HC_T.bg};color:${HC_T.ink3};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;transition:all .25s}
      .hc-chip.ok .hc-dot{background:${HC_T.success};color:#fff;box-shadow:0 3px 8px -2px ${HC_T.success}88}
      .hc-hint{margin:3px 0 0;font-size:13px;color:${HC_T.warn};background:#FFF6EA;border:1px solid #F4DFBC;padding:8px 15px;border-radius:11px;max-width:60ch;line-height:1.5}
      .hc-errors{display:flex;flex-direction:column;gap:5px;align-items:center;margin:3px 0 0}
      .hc-err{font-size:12.5px;color:#C01024;background:#FDECEC;border:1px solid #F6CFCF;padding:7px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace;max-width:74ch;line-height:1.5}

      .hc-split{flex:none;height:62vh;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,1.6vw,18px)}
      .hc-pane{display:flex;flex-direction:column;min-height:0;border-radius:18px;overflow:hidden;background:${HC_T.paper};box-shadow:0 1px 0 ${HC_T.line},0 18px 40px -22px rgba(${HC_T.shadowBase},.35)}
      .hc-pane-bar{display:flex;align-items:center;gap:10px;padding:10px 15px;font-size:12px;font-weight:600;color:${HC_T.ink2}}
      .hc-editor-pane .hc-pane-bar{background:${HC_CODE.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane .hc-pane-bar{background:${HC_T.paper};border-bottom:1px solid ${HC_T.line}}
      .hc-dots{display:inline-flex;gap:6px;flex-shrink:0}
      .hc-dots i{width:11px;height:11px;border-radius:50%;background:#3A4760;display:block}
      .hc-dots i:nth-child(1){background:#ff5f56}.hc-dots i:nth-child(2){background:#ffbd2e}.hc-dots i:nth-child(3){background:#27c93f}
      .hc-pane-name{font-family:'JetBrains Mono',monospace;font-weight:700}
      .hc-live{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${HC_T.success};background:${HC_T.successSoft};padding:4px 9px;border-radius:99px;font-weight:800;display:inline-flex;align-items:center;gap:6px}
      .hc-live::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.success};animation:hc-pulse 1.8s infinite}
      @keyframes hc-pulse{0%{box-shadow:0 0 0 0 ${HC_T.success}66}70%{box-shadow:0 0 0 6px ${HC_T.success}00}100%{box-shadow:0 0 0 0 ${HC_T.success}00}}

      .hc-tabs{display:flex;gap:4px;overflow:hidden}
      .hc-tab{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;padding:6px 13px;border-radius:9px;cursor:pointer;transition:all .15s;white-space:nowrap}
      .hc-tab:hover{color:#cfe0ff;background:rgba(255,255,255,.06)}
      .hc-tab.active{color:#fff;background:rgba(255,255,255,.14);box-shadow:inset 0 -2px 0 ${HC_T.accent}}
      .hc-mini{margin-left:auto;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:9px;padding:6px 13px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;transition:all .18s;flex-shrink:0;box-shadow:0 6px 14px -6px rgba(255,77,38,.6)}
      .hc-mini:hover{transform:translateY(-1px);box-shadow:0 9px 18px -6px rgba(255,77,38,.7)}
      .hc-mini:active{transform:translateY(0)}

      .hc-code{flex:1;min-height:0;resize:none;border:none;outline:none;background:${HC_CODE.bg};color:${HC_CODE.text};font-family:'JetBrains Mono',monospace;font-size:14px;line-height:1.7;padding:18px 20px;tab-size:2;white-space:pre;overflow:auto;caret-color:${HC_T.accent2}}
      .hc-code::placeholder{color:#5B6B86}
      .hc-code::selection{background:${HC_T.accent}55}

      .hc-frame{flex:1;min-height:0;width:100%;border:none;background:#fff}

      .hc-console{flex-shrink:0;height:34%;min-height:96px;display:flex;flex-direction:column;background:${HC_CODE.bg};border-top:1px solid rgba(255,255,255,.07)}
      .hc-console-bar{display:flex;align-items:center;gap:8px;padding:7px 14px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7E92B4;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-console-title{font-family:'JetBrains Mono',monospace}
      .hc-console-clear{margin-left:auto;background:rgba(255,255,255,.08);color:#cfe0ff;border:none;border-radius:7px;padding:4px 10px;font-size:10.5px;font-weight:600;cursor:pointer;text-transform:none;letter-spacing:0;font-family:'Manrope',sans-serif;transition:all .15s}
      .hc-console-clear:hover{background:${HC_T.accent};color:#fff}
      .hc-console-body{flex:1;min-height:0;overflow:auto;padding:6px 0;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.6}
      .hc-console-empty{color:#5B6B86;padding:4px 15px;font-style:italic}
      .hc-console-line{display:flex;gap:8px;padding:2px 15px;color:#E7EAF2;border-bottom:1px solid rgba(255,255,255,.03);white-space:pre-wrap;word-break:break-word}
      .hc-console-caret{color:#27c93f;flex-shrink:0;font-weight:700}
      .hc-console-line.lvl-warn{color:#FFD380;background:rgba(255,189,46,.08)}
      .hc-console-line.lvl-error{color:#ff8a7a;background:rgba(255,95,86,.1)}
      .hc-console-line.lvl-error .hc-console-caret{color:#ff5f56}

      .hc-bottom{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
      .hc-ghost{background:transparent;border:1px solid transparent;color:${HC_T.ink2};font-family:'Manrope',sans-serif;font-weight:600;font-size:14px;cursor:pointer;padding:11px 17px;border-radius:12px;transition:all .15s}
      .hc-ghost:hover{background:${HC_T.paper};color:${HC_T.ink};border-color:${HC_T.line};box-shadow:0 6px 16px -10px rgba(${HC_T.shadowBase},.3)}
      .hc-status{margin-left:auto}
      .hc-ok-msg{color:${HC_T.success};font-weight:700;font-size:14px}
      .hc-wait-msg{color:${HC_T.ink3};font-size:13px}
      .hc-next{background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:13px;font-family:'Manrope',sans-serif;font-weight:800;font-size:15px;cursor:pointer;padding:13px 30px;box-shadow:0 10px 24px -8px rgba(255,77,38,.6);transition:all .2s}
      .hc-next:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 32px -8px rgba(255,77,38,.7)}
      .hc-next:active:not(:disabled){transform:translateY(0)}
      .hc-next:disabled{background:#D7D8DE;color:#fff;cursor:not-allowed;box-shadow:none}

      @media (max-width:820px){
        .hc-split{grid-template-columns:1fr;grid-template-rows:1fr 1fr}
        .hc-checklist{width:100%}
      }
    `}</style>
  );
}

// Dars shartlarida ishlatiladigan qisqa alias (ilgari `checks as C`)
const C = checks;


// ============================================================
// VS CODE DARSI — PLATFORM STANDARD v15 (Notion: design_system + platform_contract + infrastructure_v1)
// Arxitektura va asosiy dizayn — Notiondan. 17 ekran bizning kontentimiz.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// Eslatma: ekran-spetsifik widget bezaklari page-by-page bosqichida yakuniy sayqal oladi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', link: '#1a56db',
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };


// ============================================================
// JONLI DARS (live) — Kahoot uslubida: PIN, mentor, o'quvchilar, jonli test.
// InternetLesson/PmLesson1 bilan bir xil infra. O'chirish: LIVE_SUPABASE_URL='' .
// ============================================================
const LIVE_SUPABASE_URL = 'https://dwoubexcexzsinogojiu.supabase.co';
const LIVE_SUPABASE_KEY = 'sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX';
const LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
// LIVE_STALE_MS = 180s (60s EMAS): Chrome fon-tabda setInterval'ni ~1 daqiqagacha bo'g'adi —
// mentor boshqa oynaga o'tsa 60s oynada «o'lik» deb topilib, butun sinf-darvoza ochilib ketardi (F-0726-01).
const LIVE_POLL_MS = 2500, LIVE_POLL_MAX_MS = 15000, LIVE_HEARTBEAT_MS = 10000, LIVE_STALE_MS = 180000;
const LT = { bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', success: '#1F7A4D' };
const _liveHdr = { apikey: LIVE_SUPABASE_KEY, Authorization: `Bearer ${LIVE_SUPABASE_KEY}` };
async function liveRpc(fn, body) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { ..._liveHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  if (!r.ok) {
    let msg = '';
    try { msg = JSON.parse(await r.text()).message || ''; } catch {}
    throw new Error(msg || `${fn}: ${r.status}`);
  }
  const t = await r.text(); return t ? JSON.parse(t) : null;
}
async function liveGet(pin) {
  // select=* — cur_screen (phase11) migratsiyasi hali bajarilmagan bazada ham sinmasin
  // (live_sessions'da sir YO'Q: token session_secrets'da, kalitlar quiz_keys'da).
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=*`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  const rows = await r.json(); return (rows && rows[0]) || null;

}
const _lsKey = (id) => `liveSession:${id}`;
const liveRead = (id) => { try { return JSON.parse(localStorage.getItem(_lsKey(id)) || 'null'); } catch { return null; } };
const liveStore = (id, o) => { try { localStorage.setItem(_lsKey(id), JSON.stringify(o)); } catch {} };
const liveClear = (id) => { try { localStorage.removeItem(_lsKey(id)); } catch {} };
const fmtPin = (p) => (p ? String(p).replace(/(\d{3})(\d{3})/, '$1 $2') : '');
// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit): Internet darsida yozgan ismi shu yerda ham chiqadi
const LIVE_NICK_KEY = 'liveNickname';
const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch {} };
// Statistika uchun jadval o'qish (RLS: select ochiq, yozish faqat RPC)
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
const livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
// screenIdx berilmasa — faqat DARS javoblari (<100); Mustahkamlash javoblari 100+ indekslarda
const liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? '&screen_idx=lt.100' : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
const liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);
// Praktika-tugadi signali: o'quvchi kod mashqini bajarib bo'lgach 500+screenIdx ga yoziladi.
// 500+ diapazon — DARS testlari (<100) va Mustahkamlash/quiz (100+, aniq indeks bilan
// o'qiladi) bilan to'qnashmaydi; faqat mentorning praktika paneli aniq indeks bilan o'qiydi.
const PRACTICE_DONE_BASE = 500;

const LiveGateCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun

function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef(answerKey); keyRef.current = answerKey; // javob kaliti — mentor darsni ochganda serverga avto-yuklanadi (SQL shart emas)
  const initRef = useRef(undefined);
  if (initRef.current === undefined) initRef.current = LIVE_ENABLED ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState(() => {
    if (!LIVE_ENABLED) return 'self';
    if (init?.mode === 'self') return 'self';
    if (init?.mode === 'student') return 'student';
    if (init?.mode === 'mentor') return 'mentor';
    return 'choosing';
  });
  const [pin, setPin] = useState(init?.pin || null);
  const tokenRef = useRef(init?.token || null);
  const playerRef = useRef(init?.playerId ? { id: init.playerId, token: init.playerToken } : null);
  const nickRef = useRef(init?.nickname || '');
  const [mentorScreen, setMentorScreen] = useState(init?.lastScreen || 0);
  // mentorMax — sinf ENG UZOQ borgan nuqta (faqat o'sadi). DARVOZA mentorScreen (cur) bilan,
  // TEST-JAVOBINI OCHISH esa mentorMax bilan ishlaydi: mentor orqaga qaytsa allaqachon
  // ochilgan javob qayta yashirinib qolmasin (F-0726-02).
  const [mentorMax, setMentorMax] = useState(init?.maxScreen ?? init?.lastScreen ?? 0);
  const [status, setStatus] = useState('live');
  const [mentorAlive, setMentorAlive] = useState(true);
  const [connected, setConnected] = useState(true);
  const [ended, setEnded] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [busy, setBusy] = useState(false);
  const [quiz, setQuiz] = useState({ state: 'off', q: -1 }); // Mustahkamlash holati (serverdan)
  const [revealScreen, setRevealScreen] = useState(-1); // Kahoot-reveal: mentor natijasini ochgan ekran (serverdan)
  const lastSeenRef = useRef(Date.now());
  const lastUpdatedRef = useRef(null);
  // Darvoza mentorning HOZIRGI ekraniga qaraydi (phase11 cur_screen); eski bazada max_screen'ga tushadi.
  const mentorScreenOf = (row) => (typeof row.cur_screen === 'number' ? row.cur_screen : row.max_screen);
  const syncQuiz = useCallback((row) => {
    const qs = row?.quiz_state || 'off', qq = row?.quiz_q ?? -1;
    setQuiz(p => (p.state === qs && p.q === qq) ? p : { state: qs, q: qq });
    const rv = row?.reveal_screen ?? -1;
    setRevealScreen(p => p === rv ? p : rv);
  }, []);

  // O'QUVCHI: visibility-aware + backoff polling
  useEffect(() => {
    if (mode !== 'student' || !pin) return;
    let on = true, timer = null, delay = LIVE_POLL_MS;
    const schedule = () => { if (on) timer = setTimeout(tick, delay); };
    const tick = async () => {
      if (typeof document !== 'undefined' && document.hidden) { schedule(); return; }
      try {
        const row = await liveGet(pin);
        if (!on) return;
        delay = LIVE_POLL_MS; setConnected(true);
        if (!row) { setStatus(p => p === 'ended' ? p : 'ended'); schedule(); return; }
        const mScr = mentorScreenOf(row);
        const mMax = Math.max(row.max_screen ?? 0, mScr);
        setMentorScreen(p => p === mScr ? p : mScr);
        setMentorMax(p => (mMax > p ? mMax : p)); // klient tomonda ham monoton — hech qachon kamaymaydi
        setStatus(p => p === row.status ? p : row.status);
        syncQuiz(row);
        if (row.updated_at !== lastUpdatedRef.current) { lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now(); liveStore(lessonId, { mode: 'student', pin, lastScreen: mScr, maxScreen: mMax, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current }); }
        const alive = Date.now() - lastSeenRef.current < LIVE_STALE_MS;
        setMentorAlive(p => p === alive ? p : alive);
      } catch { if (!on) return; setConnected(false); delay = Math.min(delay * 2, LIVE_POLL_MAX_MS); }
      schedule();
    };
    tick();
    const onVis = () => { if (!document.hidden) { clearTimeout(timer); delay = LIVE_POLL_MS; tick(); } };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => { on = false; clearTimeout(timer); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis); };
  }, [mode, pin, lessonId]); // eslint-disable-line

  // MENTOR: heartbeat + o'lik sessiya tekshiruvi
  useEffect(() => {
    if (mode !== 'mentor' || !pin) return;
    let on = true;
    liveGet(pin).then(row => {
      if (!on) return;
      if (!row || row.status === 'ended') { liveClear(lessonId); setPin(null); tokenRef.current = null; setMode('choosing'); setEnded(false); return; }
      syncQuiz(row); // mentor sahifani yangilagan bo'lsa — quiz holati tiklanadi
    }).catch(() => {});
    const beat = () => { liveRpc('session_heartbeat', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); };
    beat(); // darhol — o'quvchilar 10s kutmasin
    const id = setInterval(beat, LIVE_HEARTBEAT_MS);
    // Fon-tabdan qaytganda darhol urish: Chrome fon-taymerlarni bo'g'adi (LIVE_STALE_MS izohi)
    const onVis = () => { if (typeof document !== 'undefined' && !document.hidden) beat(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => { on = false; clearInterval(id); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis); };
  }, [mode, pin, lessonId]); // eslint-disable-line

  const startMentor = useCallback(async (mentorCode) => {
    setBusy(true); setJoinError('');
    try {
      const res = await liveRpc('create_session', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim() });
      const row = Array.isArray(res) ? res[0] : res;
      if (!row?.pin) throw new Error('no pin');
      tokenRef.current = row.token; setPin(row.pin); setMode('mentor'); setEnded(false);
      liveStore(lessonId, { mode: 'mentor', pin: row.pin, token: row.token });
      // Javob kalitini serverga avto-yuklash (mentor-kod bilan) — server-baholash uchun SHART.
      // Busiz server javoblarni kalitsiz baholaydi va hammasini «xato» deb hisoblaydi (podium 0/5).
      if (keyRef.current) liveRpc('set_quiz_keys', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim(), p_keys: keyRef.current }).catch(() => {});
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Неверный код ментора или ошибка соединения.' })); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: 'Введите код полностью.' })); return; }
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите своё имя (минимум 2 буквы).' })); return; }
    setBusy(true); setJoinError('');
    try {
      const row = await liveGet(p);
      if (!row) { setJoinError(tr({ uz: 'Bunday kod topilmadi.', ru: 'Такой код не найден.' })); setBusy(false); return; }
      if (row.lesson_id && row.lesson_id !== lessonId) { setJoinError(tr({ uz: 'Bu kod boshqa darsga tegishli.', ru: 'Этот код от другого урока.' })); setBusy(false); return; }
      if (row.status !== 'live') { setJoinError(tr({ uz: 'Bu dars allaqachon yakunlangan.', ru: 'Этот урок уже завершён.' })); setBusy(false); return; }
      const res = await liveRpc('join_session', { p_pin: p, p_nickname: nick });
      const player = Array.isArray(res) ? res[0] : res;
      if (!player?.player_id) throw new Error('no player');
      playerRef.current = { id: player.player_id, token: player.token };
      nickRef.current = nick; nickStore(nick);
      lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now();
      const jScr = mentorScreenOf(row), jMax = Math.max(row.max_screen ?? 0, jScr);
      setPin(p); setMentorScreen(jScr); setMentorMax(jMax); setStatus(row.status); setMode('student');
      liveStore(lessonId, { mode: 'student', pin: p, lastScreen: jScr, maxScreen: jMax, playerId: player.player_id, playerToken: player.token, nickname: nick });
    } catch (e) {
      // Serverdan kelgan o'zbekcha xabarlarni (ism band va h.k.) o'zini ko'rsatamiz
      const m = String(e?.message || '');
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : tr({ uz: "Ulanib bo'lmadi. Internetni tekshiring.", ru: 'Не удалось подключиться. Проверьте интернет.' }));
    }
    finally { setBusy(false); }
  }, [lessonId]);

  const selfStudy = useCallback(() => { setMode('self'); liveStore(lessonId, { mode: 'self' }); }, [lessonId]);
  const reportScreen = useCallback((idx) => { if (mode === 'mentor' && pin) liveRpc('advance_session', { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {}); }, [mode, pin]);
  const endSession = useCallback(() => { if (mode === 'mentor' && pin) { liveRpc('end_session', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); setEnded(true); } }, [mode, pin]);

  // O'quvchi javobini serverga yozish — birinchi javob qotadi (server unique).
  // Tarmoq uzilsa 3 martagacha qayta uriniladi (javob yo'qolmasin).
  const submitAnswer = useCallback((screenIdx, questionId, picked, correct, elapsedMs) => {
    if (mode !== 'student' || !pin || !playerRef.current) return;
    const body = {
      p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token,
      p_screen: screenIdx, p_question_id: questionId || '', p_picked: picked,
      p_correct: !!correct, p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0))
    };
    const attempt = (n) => { liveRpc('submit_answer', body).catch(() => { if (n < 3) setTimeout(() => attempt(n + 1), 3000 * (n + 1)); }); };
    attempt(0);
  }, [mode, pin]);

  // Mustahkamlash boshqaruvi (faqat mentor): 'lobby' | 'q' | 'r' | 'done'
  const quizControl = useCallback(async (state, q) => {
    if (mode !== 'mentor' || !pin) throw new Error('mentor emas');
    await liveRpc('quiz_control', { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);

  // Kahoot-reveal (faqat mentor): «Natijani ochish» — to'g'ri javob barcha
  // o'quvchilar ekranida ham birdan ochiladi (o'quvchi polling orqali oladi)
  const mentorReveal = useCallback((screenIdx) => {
    if (mode !== 'mentor' || !pin) return;
    setRevealScreen(screenIdx); // optimistik — proyektorda darhol
    liveRpc('reveal_screen', { p_pin: pin, p_token: tokenRef.current, p_screen: screenIdx }).catch(() => {});
  }, [mode, pin]);

  return { mode, pin, mentorScreen, mentorMax, status, mentorAlive, connected, ended, joinError, busy, startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, quiz, quizControl, revealScreen, mentorReveal, playerId: playerRef.current?.id || null, nickname: nickRef.current };
}

const _liveBtnPri = { background: LT.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 16, fontWeight: 700, cursor: 'pointer' };
const _liveBadgeS = { position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: '0 2px 10px rgba(58,53,48,0.12)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', maxWidth: '92vw' };
const _liveDot = (c) => ({ width: 8, height: 8, borderRadius: 99, background: c, display: 'inline-block' });

function LiveBigCode({ pin, onClose }) {
  const digits = String(pin || '').split('');
  const overlay = { position: 'fixed', inset: 0, zIndex: 10000, background: LT.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)', textAlign: 'center' };
  const box = { background: LT.paper, color: LT.ink, borderRadius: 'clamp(10px,1.6vw,18px)', fontFamily: 'monospace', fontWeight: 800, lineHeight: 1, fontSize: 'clamp(48px,13vw,150px)', padding: 'clamp(10px,2vw,28px) clamp(12px,2.2vw,30px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' };
  return (
    <div style={overlay}>
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>{tr({ uz: "Jonli darsga qo'shilish", ru: 'Подключение к живому уроку' })}</div>
      <div style={{ display: 'flex', gap: 'clamp(6px,1.4vw,16px)', justifyContent: 'center', flexWrap: 'wrap' }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: '#fff' }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>{tr({ uz: 'Darsni boshlash', ru: 'Начать урок' })} →</button>
    </div>
  );
}

function LiveGate({ live, title = 'Jonli dars' }) {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(() => nickRead()); // oldingi darsda yozgan ismi tayyor chiqadi
  const [mentorCode, setMentorCode] = useState('');
  const [role, setRole] = useState('student');
  const card = { position: 'relative', width: '100%', maxWidth: 420, background: LT.paper, borderRadius: 20, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 10px 40px -12px rgba(58,53,48,0.22)', display: 'flex', flexDirection: 'column', gap: 18 };
  const wrap = { minHeight: 'calc(100dvh / var(--lz, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const link = { background: 'none', border: 'none', color: LT.ink3, fontSize: 13, cursor: 'pointer', alignSelf: 'center' };
  if (role === 'mentor') {
    return (<div style={wrap}><div style={card}>
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>🧑‍🏫 {tr({ uz: 'Mentor kirishi', ru: 'Вход для ментора' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor kodini kiriting.', ru: 'Введите код ментора.' })}</p></div>
      <input value={mentorCode} onChange={e => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: 'Mentor kodi', ru: 'Код ментора' })} onKeyDown={e => { if (e.key === 'Enter') live.startMentor(mentorCode); }} style={{ width: '100%', padding: '14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверяем…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Подключиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
    <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: '100%', padding: '16px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', outline: 'none' }} />
    <input value={nick} onChange={e => setNick(e.target.value)} maxLength={24} placeholder={tr({ uz: 'Ismingiz (masalan: Ali)', ru: 'Ваше имя (например: Али)' })} onKeyDown={e => { if (e.key === 'Enter') live.joinStudent(code, nick); }} style={{ width: '100%', padding: '13px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Ulanmoqda…', ru: 'Подключаемся…' }) : tr({ uz: "Qo'shilish →", ru: 'Присоединиться →' })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
    <button onClick={() => { setRole('mentor'); setCode(''); }} title="Mentor" aria-label="Mentor" style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>);
}

function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
  // Katta PIN ekrani AVTOMATIK ochilmaydi — dars oq holda, onboarding bilan ochiladi.
  // Mentor kodni ko'rsatmoqchi bo'lganda «📺 Ko'rsatish» tugmasini bosadi (pastda).
  // Mentor: qo'shilgan o'quvchilar soni (har 6s yangilanadi)
  useEffect(() => {
    if (live.mode !== 'mentor' || !live.pin || live.ended) return;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await livePlayers(live.pin); if (on) setNPlayers(rows.length); } catch {}
      if (on) t = setTimeout(tick, 6000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.mode, live.pin, live.ended]);
  if (live.mode === 'mentor') {
    if (live.ended) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> 🔓 {tr({ uz: "O'quvchilar erkin qilindi", ru: 'Ученики отпущены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div data-tour="live" className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📺 {tr({ uz: "Ko'rsatish", ru: 'Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Дальше они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>🔓 {tr({ uz: 'Erkin qilish', ru: 'Отпустить' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 🔓 {tr({ uz: "Erkin rejim — o'zingiz davom eting", ru: 'Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> ⚠️ {tr({ uz: 'Mentor uzildi — erkin rejim', ru: 'Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> 🔄 {tr({ uz: 'Qayta ulanmoqda…', ru: 'Переподключаемся…' })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: 'Mentor:', ru: 'Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string') return node;
    if (React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return node[lang];
    return node.uz ?? node.ru ?? '';
  }, [lang]);
};
// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

class AudioEngine {
  constructor() {
    this.queue = []; this.currentIdx = 0; this.isPlaying = false;
    this.currentUtterance = null; this.onStateChange = null; this.waitingFor = null;
    this.voicesByLang = { ru: null, uz: null }; this.voicesReady = false; this.currentLang = 'uz';
    this.initVoices();
  }
  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      this.voicesByLang.ru = v.find(x => x.lang.startsWith('ru')) || v[0];
      this.voicesByLang.uz = v.find(x => x.lang.startsWith('uz')) || v.find(x => x.lang.startsWith('ru')) || v[0];
      this.voicesReady = true;
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = load;
  }
  setLang(l) { this.currentLang = l; }
  getVoice() { return this.voicesByLang[this.currentLang] || this.voicesByLang.ru || null; }
  hasUz() { if (typeof window === 'undefined' || !window.speechSynthesis) return false; return window.speechSynthesis.getVoices().some(v => v.lang.startsWith('uz')); }
  loadQueue(s) { this.stop(); this.queue = s; this.currentIdx = 0; this.waitingFor = null; }
  playSegment(seg) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(seg.text);
    const useUz = this.currentLang === 'uz' && this.hasUz();
    u.lang = useUz ? 'uz-UZ' : 'ru-RU'; u.rate = 0.95; u.pitch = 1.0;
    const v = this.getVoice(); if (v) u.voice = v;
    u.onstart = () => { this.isPlaying = true; if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: seg.id }); };
    u.onend = () => { this.isPlaying = false; this.currentUtterance = null; if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null }); this.handleEnd(seg); };
    u.onerror = () => { this.isPlaying = false; this.currentUtterance = null; if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null }); };
    this.currentUtterance = u; /* AUDIOSIZ: ovoz o'chirildi (kontekst saqlandi) */
  }
  handleEnd(seg) { if (seg.waits_for) { this.waitingFor = seg.waits_for; if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: seg.waits_for }); } else { this.currentIdx++; this.playNext(); } }
  playNext() { if (this.currentIdx >= this.queue.length) return; this.playSegment(this.queue[this.currentIdx]); }
  start() { this.currentIdx = 0; this.waitingFor = null; this.playNext(); }
  triggerEvent(type, target) { if (!this.waitingFor) return; const m = this.waitingFor.type === type && (this.waitingFor.target === target || !this.waitingFor.target); if (m) { this.waitingFor = null; this.currentIdx++; this.playNext(); } }
  pushOneOff(text) { if (!text) return; this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: 'manual', waits_for: null }); this.currentIdx = this.queue.length - 1; this.playNext(); }
  replay() { if (this.currentIdx > 0) this.currentIdx--; this.waitingFor = null; this.playNext(); }
  stop() { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); this.isPlaying = false; this.currentUtterance = null; if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null }); }
}
let audioEngineInstance = null;
const getAudioEngine = () => { if (typeof window === 'undefined') return null; if (!audioEngineInstance) audioEngineInstance = new AudioEngine(); return audioEngineInstance; };

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);
  const segmentsRef = useRef(segments);
  const key = segments ? JSON.stringify(segments) : '';
  const prevKey = useRef(key);
  if (prevKey.current !== key) { segmentsRef.current = segments; prevKey.current = key; }
  const stable = segmentsRef.current;
  useEffect(() => {
    const engine = getAudioEngine(); if (!engine) return;
    engineRef.current = engine; engine.setLang(lang);
    engine.onStateChange = (s) => setState(p => ({ ...p, ...s }));
    if (stable && stable.length > 0 && !state.muted) {
      engine.loadQueue(stable);
      const t = setTimeout(() => engine.start(), 300);
      return () => { clearTimeout(t); engine.stop(); };
    }
    return () => { if (engine) engine.stop(); };
    // eslint-disable-next-line
  }, [stable, lang]);
  const triggerEvent = useCallback((type, target) => { if (engineRef.current) engineRef.current.triggerEvent(type, target); }, []);
  const replay = useCallback(() => { if (engineRef.current) engineRef.current.replay(); }, []);
  const toggleMute = useCallback(() => { setState(p => { const m = !p.muted; if (m && engineRef.current) engineRef.current.stop(); return { ...p, muted: m }; }); }, []);
  return { ...state, triggerEvent, replay, toggleMute };
}

// AUDIOSIZ: AudioIndicator (ovoz/replay tugmalari) olib tashlandi — ovoz o'chirilgan, ikonka kerak emas.


const LESSON_META = { lessonId: 'vscode-start-01-v1', lessonTitle: { uz: 'VS Code — professional start', ru: 'VS Code — профессиональный старт' } };
const SCREEN_META = [
  { id: 's0',   type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },        // 0  Professionallar qayerda kod yozadi?
  { id: 's1',   type: 'rule',        template: 'custom',   scored: false, scope: null },          // 1  Maqsad: jonli vizitka-card + ism
  { id: 's2',   type: 'exploration', template: 'custom',   scored: false, scope: null },          // 2  QADAM 1 — VS Code o'rnatish (checklist)
  { id: 's3',   type: 'exploration', template: 'custom',   scored: false, scope: null },          // 3  QADAM 2 — interfeys-ekskursiya (hotspot)
  { id: 's4',   type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },// 4  TEST 1 — Explorer
  { id: 's5',   type: 'exploration', template: 'custom',   scored: false, scope: null },          // 5  QADAM 3 — papka + fayllar (checklist)
  { id: 's6',   type: 'exploration', template: 'custom',   scored: false, scope: null },          // 6  Emmet: ! + Tab + skelet drag
  { id: 's7',   type: 'exploration', template: 'custom',   scored: false, scope: null },          // 7  QADAM 4 — Live Server / Go Live (checklist) → praktika
  { id: 's8',   type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },// 8  TEST 2 — Go Live nima qiladi
  { id: 's9',   type: 'exploration', template: 'custom',   scored: false, scope: null },          // 9  QADAM 5 — card HTML → praktika
  { id: 's10',  type: 'exploration', template: 'custom',   scored: false, scope: null },          // 10 QADAM 6 — card CSS → praktika
  { id: 's11',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },// 11 TEST 3 — link/stylesheet
  { id: 's12',  type: 'exploration', template: 'custom',   scored: false, scope: null },          // 12 Shortcut sandiqchasi
  { id: 's13',  type: 'test',        template: 'custom',   scored: true,  scope: 'final' },       // 13 YAKUNIY yozma — Go Live
  { id: 's14',  type: 'case',        template: 'custom',   scored: false, scope: null },          // 14 FINAL — jonli card tasdig'i + tantana
  { id: 's15b', type: 'stats',       template: 'custom',   scored: false, scope: null },          // 15 Podium
  { id: 'sflash', type: 'review',    template: 'custom',   scored: false, scope: null },          // 16 Flashcards
  { id: 's16',  type: 'summary',     template: 'custom',   scored: false, scope: null }           // 17 Yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const CodeBox = ({ children }) => <pre className="code-box">{children}</pre>;
const Tg = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const Sr = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Preview = ({ children, title = 'preview.html', minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH }}>{children}</div></div>
);
const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// 🏅 Yuqori paneldagi nishon hisoblagichi — doim ko'rinadi, yangi olinganda pulslaydi, bosilsa ro'yxat chiqadi
function AchCounter() {
  const earned = useContext(AchCtx);
  const gate = useContext(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef(count);
  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (count > prevRef.current) { setBump(true); const t = setTimeout(() => setBump(false), 800); prevRef.current = count; return () => clearTimeout(t); }
    prevRef.current = count;
  }, [count]);
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // 🔴 mentor proyektorida nishon YO'Q (hooklardan KEYIN)
  return (
    <div className="ach-cnt-wrap">
      <button data-tour="ach" className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Badges" title="Badges">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{a.name}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768); // mobil: Mentor yig'ilish rejimi
  const collapseOn = isNarrow && !mentorStatic; // ba'zi sahifalarda Mentor yig'ilmaydi
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const [mForced, setMForced] = useState(false); // ekran majburan yopishi mumkin (desktopda ham)
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); setMForced(false); }, [screen]); // har ekranda Mentor ochiq holatdan boshlanadi
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest('.mentor')) return; // Mentorning o'ziga tegsa — yig'maymiz
    setMCollapsed(true);
  };
  const onContentScroll = () => {
    if (!collapseOn || mCollapsed) return;
    const el = contentRef.current;
    if (el && el.scrollTop > 6) setMCollapsed(true);
  };
  return (
    <MentorCtx.Provider value={{ enabled: collapseOn, collapsed: mCollapsed, setCollapsed, forced: mForced, setForced: setMForced }}>
      <div className="stage">
        <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
          <div data-tour="progress" className="progress-track"><div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }} /></div>
          <div className="chrome">
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} className={`stage-content ${narrow ? 'narrow' : ''}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>
  );
};
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</button>;
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const lbl = label != null ? tr(label) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return <button data-tour="next" className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};

const FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (show) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => { setVisible(true); setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 350); })); }
    else { setVisible(false); const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}><div className={neutral ? 'frame-wait' : isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div></div>;
};


// ===== 📖 QAYTA TUSHUNTIRISH (recap) — jonli darsda mentor past natijada ochadi =====
const RECAP_NEED_PCT = 60;   // shundan past — qayta tushuntirish TAVSIYA etiladi
const RECAP_GOOD_PCT = 75;   // shundan yuqori — sinf o'zlashtirdi, bemalol davom
const RECAP_MIN_ANSWERS = 3; // foizga ishonch uchun kamida shuncha javob kerak
// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — test natijasi past chiqsa mentor proyektorda
// ochib, og'zaki qayta tushuntiradi (server sinxronsiz — o'quvchilar qulflangan,
// proyektorga qaraydi). Xato qilgan o'quvchi o'z qurilmasida ham ochishi mumkin.
// Kalitlar — scored test ekranlarining indekslari (4, 6, 10, 13).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// RECAPS — har scored test uchun «Qayta tushuntirish» kartalari (kalit = ekran indeksi: 4, 8, 11, 13)
const RECAPS = {
  // idx 4 — s4: «Fayllar ro'yxatini qaysi qism ko'rsatadi?» (nazariya: VS Code oynasi)
  4: {
    title: { uz: 'VS Code oynasi', ru: 'Окно VS Code' }, cards: [
      { ic: '🗂️', h: { uz: "Explorer — fayllar ro'yxati", ru: 'Explorer — список файлов' },
        body: {
          uz: <>Chapdagi panel <b>Explorer</b> deyiladi — loyihangizdagi <b>barcha fayllar</b> shu yerda ro'yxat bo'lib turadi: <b className="mono">index.html</b>, <b className="mono">style.css</b> va boshqalar. Faylni bossangiz — muharrirda ochiladi.</>,
          ru: <>Панель слева называется <b>Explorer</b> — здесь списком лежат <b>все файлы</b> вашего проекта: <b className="mono">index.html</b>, <b className="mono">style.css</b> и другие. Нажмёте на файл — он откроется в редакторе.</>,
        },
        vis: <RcFlow items={['Explorer', 'index.html', 'style.css']} sep="·" />,
        ask: { uz: "style.css faylini ochish uchun qaysi panelga qaraymiz?", ru: 'В какую панель мы смотрим, чтобы открыть style.css?' } },
      { ic: '📝', h: { uz: 'Muharrir — kod yoziladigan maydon', ru: 'Редактор — поле, где пишется код' },
        body: {
          uz: <>O'rtadagi katta qora maydon — <b>muharrir</b>. Kod aynan shu yerga yoziladi. Har ochilgan fayl tepada o'z <b>varag'i (tab)</b> bilan turadi — varaqlar orasida bir bosishda o'tasiz.</>,
          ru: <>Большое тёмное поле в центре — <b>редактор</b>. Код пишется именно здесь. Каждый открытый файл держит сверху свою <b>вкладку (tab)</b> — между вкладками вы переходите одним нажатием.</>,
        },
        vis: <RcFlow items={[{ uz: '🗂️ Fayl', ru: '🗂️ Файл' }, { uz: '📝 Muharrir', ru: '📝 Редактор' }, { uz: '⌨️ Kod', ru: '⌨️ Код' }]} /> },
      { ic: '🧩', h: { uz: 'Extensions — kengaytmalar do\'koni', ru: 'Extensions — магазин расширений' },
        body: {
          uz: <>Chap ustundagi kubiklar belgisi — <b>Extensions</b> (kengaytmalar). Bu VS Code'ga yangi imkoniyat qo'shadigan <b>mini-dasturlar</b> do'koni. Jonli server — <b>Live Server</b> ham aynan shu yerdan o'rnatiladi.</>,
          ru: <>Значок из кубиков в левой колонке — <b>Extensions</b> (расширения). Это магазин <b>мини-программ</b>, которые добавляют VS Code новые возможности. Живой сервер — <b>Live Server</b> — ставится именно отсюда.</>,
        },
        vis: <RcFlow items={['Extensions', 'Live Server', 'Go Live']} />,
        ask: { uz: "Live Server'ni qaysi bo'limdan o'rnatamiz?", ru: 'Из какого раздела мы ставим Live Server?' } },
    ]
  },
  // idx 8 — s8: «Go Live bosilganda nima bo'ladi?» (nazariya: jonli server, 127.0.0.1:5500)
  8: {
    title: { uz: 'Jonli server', ru: 'Живой сервер' }, cards: [
      { ic: '⚡', h: { uz: 'Go Live — sahifa brauzerda jonlanadi', ru: 'Go Live — страница оживает в браузере' },
        body: {
          uz: <>Pastki <b>ko'k chiziqdagi</b> «Go Live» tugmasi bosilganda Live Server ishga tushadi va sahifangiz brauzerda <b className="mono">127.0.0.1:5500</b> manzilida ochiladi. Fayl shunchaki ochilmaydi — <b>jonli server</b> orqali ko'rsatiladi.</>,
          ru: <>Когда вы нажимаете «Go Live» на нижней <b>синей полосе</b>, запускается Live Server, и страница открывается в браузере по адресу <b className="mono">127.0.0.1:5500</b>. Файл не просто открывается — его показывает <b>живой сервер</b>.</>,
        },
        vis: <RcFlow items={['Go Live', { uz: '🌐 Brauzer', ru: '🌐 Браузер' }, '127.0.0.1:5500']} /> },
      { ic: '🏠', h: { uz: '127.0.0.1 — «mening kompyuterim»', ru: '127.0.0.1 — «мой компьютер»' },
        body: {
          uz: <><b className="mono">127.0.0.1</b> — bu internet emas: har bir kompyuterda bu manzil <b>o'zini</b> bildiradi. <b className="mono">5500</b> esa — <b>port</b>, ya'ni server ishlatadigan eshik raqami. Demak, sahifani hozircha <b>faqat siz</b> ko'rasiz.</>,
          ru: <><b className="mono">127.0.0.1</b> — это не интернет: на любом компьютере этот адрес означает <b>«я сам»</b>. А <b className="mono">5500</b> — это <b>порт</b>, номер двери, через которую работает сервер. Значит, страницу пока видите <b>только вы</b>.</>,
        },
        vis: <RcFlow items={[{ uz: '🏠 O\'z kompyuteringiz', ru: '🏠 Ваш компьютер' }, { uz: '🚪 5500 — port', ru: '🚪 5500 — порт' }]} sep="·" />,
        ask: { uz: "Sinfdoshingiz o'z telefonida shu manzilni ochsa, sizning sahifangizni ko'radimi?", ru: 'Если одноклассник откроет этот адрес на своём телефоне, увидит ли он вашу страницу?' } },
      { ic: '💾', h: { uz: "Ctrl+S — saqlang, brauzer o'zi yangilanadi", ru: 'Ctrl+S — сохраните, браузер обновится сам' },
        body: {
          uz: <>Jonli serverning sehri: kodni o'zgartirib <b className="mono">Ctrl+S</b> bilan saqlasangiz, brauzer sahifani <b>o'zi yangilaydi</b> — hech narsani qayta ochish shart emas. Yozdingiz → saqladingiz → ko'rdingiz.</>,
          ru: <>Магия живого сервера: измените код и сохраните его через <b className="mono">Ctrl+S</b> — браузер <b>сам обновит</b> страницу, ничего заново открывать не нужно. Написали → сохранили → увидели.</>,
        },
        vis: <RcFlow items={[{ uz: '⌨️ Yozish', ru: '⌨️ Пишем' }, 'Ctrl+S', { uz: '🔄 Yangilanadi', ru: '🔄 Обновилось' }]} /> },
    ]
  },
  // idx 11 — s11: «style.css sahifaga qanday ulanadi?» (nazariya: link tegi, card tuzilishi)
  11: {
    title: { uz: 'HTML va CSS ulanishi', ru: 'Связь HTML и CSS' }, cards: [
      { ic: '🔗', h: { uz: "<link> — ikki fayl orasidagi ko'prik", ru: '<link> — мост между двумя файлами' },
        body: {
          uz: <>Bezaklar alohida faylda — <b className="mono">style.css</b>'da yashaydi. Sahifa uni ko'rishi uchun <b className="mono">&lt;head&gt;</b> ichiga bitta qator yoziladi: <b className="mono">&lt;link rel="stylesheet" href="style.css"&gt;</b>. Shu qator — ko'prik.</>,
          ru: <>Оформление живёт в отдельном файле — <b className="mono">style.css</b>. Чтобы страница его увидела, внутрь <b className="mono">&lt;head&gt;</b> пишется одна строка: <b className="mono">&lt;link rel="stylesheet" href="style.css"&gt;</b>. Эта строка — мост.</>,
        },
        vis: <RcFlow items={['index.html', '<link>', 'style.css']} />,
        ask: { uz: "Bu qator head'ga yoziladimi yoki body'gami?", ru: 'Эта строка пишется в head или в body?' } },
      { ic: '🎨', h: { uz: 'HTML — suyak, CSS — libos', ru: 'HTML — скелет, CSS — одежда' },
        body: {
          uz: <><b>HTML</b> sahifada nima borligini aytadi: card, ism, kasb. <b>CSS</b> esa u qanday ko'rinishini: rangi, burchagi, soyasi. Link uzilsa — card yana oddiy qora matnga qaytadi.</>,
          ru: <><b>HTML</b> говорит, что есть на странице: карточка, имя, профессия. А <b>CSS</b> — как это выглядит: цвет, углы, тень. Порвётся связь — карточка снова станет простым чёрным текстом.</>,
        },
        vis: <RcFlow items={[{ uz: 'HTML — tuzilish', ru: 'HTML — структура' }, { uz: "CSS — ko'rinish", ru: 'CSS — внешний вид' }]} sep="·" /> },
      { ic: '🎯', h: { uz: 'class — CSS uchun nishon', ru: 'class — мишень для CSS' },
        body: {
          uz: <>HTML'da <b className="mono">&lt;div class="card"&gt;</b> deb yozdik. CSS'da esa <b className="mono">.card</b> selektori aynan shu qutini <b>topib</b>, bezak beradi. Nomlar mos bo'lmasa — bezak ishlamaydi.</>,
          ru: <>В HTML мы написали <b className="mono">&lt;div class="card"&gt;</b>. А селектор <b className="mono">.card</b> в CSS <b>находит</b> именно эту коробку и оформляет её. Не совпадут имена — оформление не сработает.</>,
        },
        vis: <RcFlow items={['class="card"', '.card { ... }']} />,
        ask: { uz: "CSS'da .card deb yozsak, HTML'da nima turishi kerak?", ru: 'Если в CSS мы пишем .card, что должно стоять в HTML?' } },
    ]
  },
  // idx 13 — s13 (yakuniy yozma): «Go Live» — butun ish sikli
  13: {
    title: { uz: 'Bir bosishda jonli sahifa', ru: 'Живая страница в одно нажатие' }, cards: [
      { ic: '⚡', h: { uz: 'Tugma nomi — Go Live', ru: 'Кнопка называется Go Live' },
        body: {
          uz: <>VS Code oynasining eng pastida <b>ko'k chiziq</b> bor. O'ng burchagida — <b className="mono">Go Live</b> yozuvi. Bir bosish — va Live Server sahifangizni brauzerda ochadi.</>,
          ru: <>В самом низу окна VS Code есть <b>синяя полоса</b>. В её правом углу — надпись <b className="mono">Go Live</b>. Одно нажатие — и Live Server открывает вашу страницу в браузере.</>,
        },
        vis: <RcFlow items={[{ uz: "🖱️ Go Live bosildi", ru: '🖱️ Нажали Go Live' }, { uz: '🌐 Sahifa ochildi', ru: '🌐 Страница открылась' }]} /> },
      { ic: '📖', h: { uz: "Manzilni endi o'qiy olasiz", ru: 'Теперь вы умеете читать адрес' },
        body: {
          uz: <><b className="mono">127.0.0.1:5500/index.html</b> — bu «<b>mening kompyuterim</b>, <b>5500-eshik</b>, <b>index.html</b> fayli» degani. Har bo'lagining ma'nosini bilasiz — bu endi sirli raqamlar emas.</>,
          ru: <><b className="mono">127.0.0.1:5500/index.html</b> — это значит: «<b>мой компьютер</b>, <b>дверь 5500</b>, файл <b>index.html</b>». Вы знаете смысл каждой части — это больше не загадочные цифры.</>,
        },
        vis: <RcFlow items={['127.0.0.1', ':5500', '/index.html']} sep="·" /> },
      { ic: '🔁', h: { uz: "Ustaning ish sikli", ru: 'Рабочий цикл мастера' },
        body: {
          uz: <>Endi siz professional kabi ishlaysiz: kodni <b>o'zgartirasiz</b> → <b className="mono">Ctrl+S</b> bilan <b>saqlaysiz</b> → brauzerda natijani <b>ko'rasiz</b>. Shu uch qadam — har kunlik ish usuli.</>,
          ru: <>Теперь вы работаете как профессионал: <b>меняете</b> код → <b>сохраняете</b> через <b className="mono">Ctrl+S</b> → <b>видите</b> результат в браузере. Эти три шага — ежедневный рабочий приём.</>,
        },
        vis: <RcFlow items={[{ uz: "O'zgartirish", ru: 'Изменить' }, { uz: 'Saqlash', ru: 'Сохранить' }, { uz: "Ko'rish", ru: 'Увидеть' }]} />,
        ask: { uz: "Card rangini o'zgartirdik — brauzerda ko'rish uchun nima bosamiz?", ru: 'Мы поменяли цвет карточки — что нажать, чтобы увидеть это в браузере?' } },
    ]
  },
};

// Overlay — ekran ustida (indekslarga tegmaydi)
// Overlay — ekran USTIDA ochiladi (indekslarga tegmaydi), slayd-slayd o'tiladi.
function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setI(p => Math.min(p + 1, rc.cards.length - 1));
      else if (e.key === 'ArrowLeft') setI(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, rc]);
  if (!rc) return null;
  const card = rc.cards[i];
  const last = i === rc.cards.length - 1;
  return (
    <div className="rc-overlay">
      <div className="rc-head">
        <span className="rc-tag">📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr({ uz: 'Oldingi', ru: 'Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>✓ {tr({ uz: 'Tushunarli — davom etamiz', ru: 'Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi', ru: 'Дальше' })} →</button>}
      </div>
    </div>
  );
}

// ===== MENTOR STATISTIKASI (jonli test paneli — InternetLesson bilan bir xil) =====
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A']; // A B C D — brend-neytral
// `...` bilan belgilangan kod atamalarini (teg, atribut) matndan ajratib chip qilib ko'rsatadi.
// Savol, variant va izoh satrlarida ishlatiladi: "Matnni `strong` qalin qiladi" → strong chipda.
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState({ players: null, rows: [] });
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on) setData({ players, rows: answers });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, screenIdx]);
  if (data.players === null) return null;
  const total = data.players.length;
  const answered = data.rows.length;
  // «To'g'ri» sanog'ini ustunlar bilan BIR XIL mantiqdan olamiz (picked === correctIdx),
  // serverdagi eskirishi mumkin bo'lgan `a.correct` boolean'iga tayanmaymiz — aks holda
  // pastdagi ustun «to'g'ri javobda 1 o'quvchi», yuqoridagi sanoq esa «1 xato» deb zid chiqadi.
  const ok = data.rows.filter(a => a.picked === correctIdx).length;
  const bad = answered - ok;
  const allIn = total > 0 && answered >= total;
  const struggling = answered >= 2 && bad > ok;
  const answeredIds = new Set(data.rows.map(r => r.player_id));
  const waiting = data.players.filter(p => !answeredIds.has(p.id));
  const maxN = Math.max(1, ...options.map((_, i) => data.rows.filter(a => a.picked === i).length));
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">📊 {tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>🔓 {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri", ru: 'верно' })} ✅</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato', ru: 'ошибка' })} ❌</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })} ⏳</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi', ru: 'ответили' })} 📨</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })} ⏳</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">🙈 {tr({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число ✅/❌ скрыто — по кнопке «Открыть результат» всё появится одновременно и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} уч. · ${pct}%` }) : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered > 0 && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = answered < RECAP_MIN_ANSWERS ? 'few' : pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr({ uz: 'Kutilmoqda:', ru: 'Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: 'Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

// ===== MENTOR YOZMA-ISH PANELI — s6 (amaliyot) va s15 (yakuniy g'oya) uchun =====
// O'quvchining yozgan MATNI serverga bormaydi (jadval sxemasi) — faqat «tugatdi»
// belgisi boradi. Mentor kim tugatgani/kim yozayotganini jonli ko'radi.
function MentorWorkStats({ live, screenIdx, taskLabel }) {
  const [data, setData] = useState({ players: null, rows: [] });
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on) setData({ players, rows: answers });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, screenIdx]);
  if (data.players === null) return null;
  const total = data.players.length;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">✍️ {tr(taskLabel)}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
      {total > 0 && (
        <div className="mstats-waitrow">
          {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
        </div>
      )}
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar yozib tugatishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученики допишут, здесь появится значок ✓…' })}</p>}
    </div>
  );
}

// ===== MENTOR PRAKTIKA PANELI — jonli darsda kod mashqi uchun =====
// Oqim: mentor "Davom etish" bosadi → o'quvchilar OCHILADI va o'z qurilmasida mashqni
// yozadi; mentor bu panelda kim tugatganini JONLI kuzatadi. Ko'pchilik tugagach —
// mentor «🖊 Doskada yozib ko'rsatish» bilan AYNAN shu mashqni proyektorda yozib beradi.
// Shunday qilib: avval o'quvchilar mustaqil yozadi, keyin mentor birga yechib tushuntiradi.
function MentorPracticeOverlay({ entry, live, onClose }) {
  const [view, setView] = useState('watch'); // 'watch' | 'demo'
  const [data, setData] = useState({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, doneIdx)]);
        if (on) setData({ players, rows });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, doneIdx]);

  if (view === 'demo') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
        <HtmlCompiler task={entry.task} starterCode={tr(entry.starter)} onContinue={() => setView('watch')} onBack={() => setView('watch')} />
      </div>
    );
  }

  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr({ uz: 'Amaliyot · jonli', ru: 'Практика · live' })}</div>
        <h2 className="mp-title">{tr(entry.task.title)}</h2>
        <p className="mp-brief">{tr(entry.task.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">1 · {tr({ uz: "O'quvchilar o'z qurilmasida yozmoqda", ru: 'Ученики пишут на своих устройствах' })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">2 · {tr({ uz: "Mentor doskada yozib ko'rsatadi", ru: 'Ментор показывает решение на доске' })}</span>
        </div>
        {data.players === null ? (
          <p className="mstats-wait">{tr({ uz: 'Ulanish…', ru: 'Подключение…' })}</p>
        ) : (
          <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr({ uz: 'Praktikani tugatdi', ru: 'Закончили практику' })}</span>
              <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
            {total > 0 && (
              <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
              </div>
            )}
            {total === 0 && <p className="mstats-wait">{tr({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: 'Ученики ещё не подключились — как только они начнут практику, здесь появится ✓…' })}</p>}
          </div>
        )}
        <div className="mp-actions">
          <button className="mp-demo" onClick={() => setView('demo')}>🖊 {tr({ uz: "Doskada yozib ko'rsatish", ru: 'Показать решение на доске' })}</button>
          <button className="mp-next" onClick={onClose}>{tr({ uz: 'Keyingi mavzuga', ru: 'К следующей теме' })} →</button>
        </div>
        <p className="mp-tip">💡 {tr({ uz: "Ko'pchilik tugatgach, aynan shu mashqni doskada birga yozing — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: 'Когда закончит большинство, напишите это же упражнение вместе на доске — так ученики проверят себя, а тема закрепится.' })}</p>
      </div>
    </div>
  );
}

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — statistikani kuzatadi, «Natijani ochish»
  // bosganda to'g'ri javob + izoh katta ekranda ochiladi, shundan keyin davom etadi.
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  // 📖 Qayta tushuntirish (recap) — natija past chiqsa mentor ochadi; o'quvchi xato qilsa o'zi ham ochishi mumkin
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  // «Natijani ochish» — proyektorda ham, BARCHA o'quvchilar ekranida ham birdan ochiladi (Kahoot reveal)
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  // Mentor sahifani yangilagan bo'lsa — reveal holati serverdan tiklanadi
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotirib qo'yamiz
    const optTexts = options.map(o => tr(o)); // payload'ga doim string yoziladi ({uz,ru} obyekt emas)
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham sir saqlanadi —
  // faqat «javob qabul qilindi» ko'rinadi. Mentor «Natijani ochish»ni bosganda
  // (reveal_screen) yoki keyingi sahifaga o'tganda / dars tugaganda hammada birdan ochiladi.
  // Erkin rejimda (ended / mentor uzilgan / self) natija darhol ko'rinadi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ {tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, думайте перед кликом!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha hammasi neytral — proyektorda sir saqlanadi
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; } // faqat neytral belgi — to'g'ri/xato hali sir
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: 'clamp(12px,1.8vw,16px) clamp(14px,2.2vw,20px)', fontSize: 'clamp(14px,1.7vw,16px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? fmtCode(tr({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` }))
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(tr({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` }))
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(tr(isMentorLive
              ? explainCorrect
              : waiting
                ? { uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас вы узнаете верный ответ.' }
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default)))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 {tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + '40'} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'верных ответов' })}</div></div>
    </div>
  );
}

// ===== MENTOR (nomsiz ustoz ovozi — intro/izoh shu orqali; audio matni = shu matn) =====
// Stage (Provider) ichida turib, `when` true bo'lganda Mentorni majburan yopadi
// (desktopda ham). `when` false bo'lsa — ochiq holatga qaytaradi.
const MentorAutoClose = ({ when }) => {
  const ctx = useContext(MentorCtx) || {};
  const setForced = ctx.setForced;
  useEffect(() => { if (setForced) setForced(!!when); }, [when, setForced]);
  return null;
};

const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';
const Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
  // forced = ekran (masalan Xulosa) majburan yopgan — desktopda ham ishlaydi
  const enabled = !!ctx.enabled || !!ctx.forced;
  const collapsed = (!!ctx.enabled && ctx.collapsed) || !!ctx.forced;
  const expand = (e) => { e.stopPropagation(); if (ctx.forced && ctx.setForced) ctx.setForced(false); if (ctx.setCollapsed) ctx.setCollapsed(false); };
  return (
    <div data-tour="mentor" className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
      <div className="mentor-ava" aria-hidden="true"><img src={MENTOR_IMG} alt="" /></div>
      <div className="mentor-col">
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish", ru: 'открыть подсказку' })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// Animatsiyani katta ekranda ko'rish uchun o'rovchi — ⛶ tugma, holat saqlanadi
const Zoomable = ({ children }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [big]);
  return (
    <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${big ? 'zoom-on' : ''}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// 🧲 Qayta ishlatiladigan DRAG&DROP — bo'laklarni to'g'ri TARTIBDA joylash (sudrab yoki bosib).
// Boshqa darsga: faqat `items` (to'g'ri tartibda) va `hints` almashtiriladi.
function DragDropOrder({ items, hints, onSolved }) {
  const order = items.map(x => x.id);
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  // YAGONA holat — pool va slots birga (setState ichida setState YO'Q → StrictMode'da dublikat bo'lmaydi)
  const [st, setSt] = useState(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef([]);
  const full = slots.every(s => s !== null);
  const solved = slots.every((s, i) => s === order[i]);
  const wrong = full && !solved;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  const place = (id, from, slotIdx) => setSt(({ pool, slots }) => {
    const ns = slots.slice(); const occ = ns[slotIdx];
    if (typeof from === 'number') ns[from] = null;
    ns[slotIdx] = id;
    let np = from === 'pool' ? pool.filter(x => x !== id) : pool.slice();
    if (occ) np = [...np, occ];
    return { pool: np, slots: ns };
  });
  const toPool = (slotIdx) => setSt(({ pool, slots }) => {
    const id = slots[slotIdx]; if (!id) return { pool, slots };
    const ns = slots.slice(); ns[slotIdx] = null;
    return { pool: [...pool, id], slots: ns };
  });
  const tap = (id) => setSt(({ pool, slots }) => {
    const e = slots.findIndex(s => s === null); if (e < 0) return { pool, slots };
    const ns = slots.slice(); ns[e] = id;
    return { pool: pool.filter(x => x !== id), slots: ns };
  });
  // Sudrash — asl chip elementini DOM transform bilan suramiz (state yo'q → pirillamaydi;
  // transform lokal → `position:fixed` muammosi yo'q, ekran pastida chiqmaydi).
  const down = (ev, id, from) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '9999'; el.style.willChange = 'transform';
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (moved) el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`;
    };
    const finish = (el2) => { el2.style.zIndex = ''; el2.style.willChange = ''; el2.style.transform = ''; el2.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      if (!moved) { finish(el); if (from === 'pool') tap(id); else toPool(from); return; }
      let t = -1;
      slotRefs.current.forEach((elm, i) => { if (!elm) return; const r = elm.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) t = i; });
      if (t >= 0) { finish(el); place(id, from, t); }
      else if (typeof from === 'number') { finish(el); toPool(from); }
      else { el.style.transition = 'transform .2s cubic-bezier(.34,1.3,.4,1)'; el.style.transform = ''; setTimeout(() => finish(el), 210); } // pool'ga qaytadi
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="dd fade-up">
      <div className="dd-slots">
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className="dd-slotn">{i + 1}</span>
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{byId[sid].label}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и расставьте заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{byId[id].label}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr({ uz: "To'g'ri! Skelet aynan shu tartibda.", ru: 'Верно! Скелет именно в таком порядке.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">⚠️ {tr({ uz: 'Tartib xato — qayta joylang.', ru: 'Порядок неверный — расставьте заново.' })}</div>}
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash + spaced recall).
// Boshqa darsga: faqat `cards` ({ front, back, note }) almashtiriladi.
const VSCODE_FLASHCARDS = [
  { front: { uz: 'Kodni qaysi dasturda yozamiz?', ru: 'В какой программе мы пишем код?' }, back: 'VS Code', note: { uz: 'bepul, code.visualstudio.com saytidan olinadi', ru: 'бесплатный, берётся с сайта code.visualstudio.com' } },
  { front: { uz: "Fayllar ro'yxatini qaysi panelda ko'rasiz?", ru: 'В какой панели вы видите список файлов?' }, back: 'Explorer', note: { uz: 'chapda turadi; fayl bossangiz — ochiladi', ru: 'слева; нажмёте на файл — он откроется' } },
  { front: { uz: "VS Code'ga yangi imkoniyat qo'shadigan mini-dastur qanday ataladi?", ru: 'Как называется мини-программа, добавляющая VS Code новые возможности?' }, back: { uz: 'Extension (kengaytma)', ru: 'Extension (расширение)' }, note: { uz: 'kubiklar belgisidagi Extensions bo\'limidan o\'rnatiladi', ru: 'ставится из раздела Extensions со значком кубиков' } },
  { front: { uz: 'Sahifani brauzerda jonli ochadigan kengaytma qaysi?', ru: 'Какое расширение живо открывает страницу в браузере?' }, back: 'Live Server', note: { uz: "pastki ko'k chiziqdagi Go Live tugmasi bilan ishga tushadi", ru: 'запускается кнопкой Go Live на нижней синей полосе' } },
  { front: { uz: 'Qaysi manzil «mening kompyuterim» degani?', ru: 'Какой адрес означает «мой компьютер»?' }, back: '127.0.0.1', note: { uz: 'sahifani hozircha faqat siz ko\'rasiz — bu internet emas', ru: 'страницу пока видите только вы — это не интернет' } },
  { front: { uz: '127.0.0.1:5500 manzilidagi 5500 raqami nima?', ru: 'Что такое число 5500 в адресе 127.0.0.1:5500?' }, back: { uz: 'Port', ru: 'Порт' }, note: { uz: 'server ishlatadigan eshik raqami', ru: 'номер двери, через которую работает сервер' } },
  { front: { uz: "Bo'sh HTML faylda tayyor skeletni nima bilan chiqarasiz?", ru: 'Чем вы выводите готовый скелет в пустом HTML-файле?' }, back: '! + Tab', note: { uz: "Emmet yordamchisi butun shablonni o'zi yozadi", ru: 'помощник Emmet сам пишет весь шаблон' } },
  { front: { uz: 'Faylni saqlash uchun qaysi tugmalarni bosasiz?', ru: 'Какие клавиши вы нажимаете, чтобы сохранить файл?' }, back: 'Ctrl + S', note: { uz: "saqlaganingizdan keyin brauzer o'zi yangilanadi", ru: 'после сохранения браузер обновляется сам' } },
  { front: { uz: 'Xato yozib qo\'ysangiz, orqaga qaytadigan tugmalar qaysi?', ru: 'Какие клавиши возвращают назад, если вы ошиблись?' }, back: 'Ctrl + Z', note: { uz: "oxirgi harakatni bekor qiladi — xatodan qo'rqmang", ru: 'отменяет последнее действие — не бойтесь ошибок' } },
  { front: { uz: 'Brauzer loyihadan birinchi qaysi faylni ochadi?', ru: 'Какой файл проекта браузер открывает первым?' }, back: 'index.html', note: { uz: 'har loyihada shunday bitta asosiy fayl bo\'ladi', ru: 'в каждом проекте один такой главный файл' } },
  { front: { uz: 'Ranglar va bezaklar qaysi faylga yoziladi?', ru: 'В какой файл пишутся цвета и оформление?' }, back: 'style.css', note: { uz: "HTML'ga <link> qatori bilan ulanadi", ru: 'подключается к HTML строкой <link>' } },
  { front: { uz: "CSS faylni sahifaga qaysi teg ulaydi?", ru: 'Какой тег подключает CSS-файл к странице?' }, back: '<link>', note: { uz: 'head ichiga yoziladi: rel="stylesheet" href="style.css"', ru: 'пишется внутрь head: rel="stylesheet" href="style.css"' } },
];
function Flashcards({ cards }) {
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null); // 'knew' | 'again' — karta uchib chiqish animatsiyasi (Quizlet uslubi)
  const swapRef = useRef(0);                    // har almashishda karta remount bo'lib, kirish animatsiyasi o'ynaydi
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? 'knew' : 'again');
    setTimeout(() => {
      setExiting(null); setFlipped(false); swapRef.current++;
      if (removed) setKnown(k => k + 1);
      setQueue(q => { const [first, ...rest] = q; return removed ? rest : [...rest, first]; });
    }, 420);
  };
  const knew = () => advance(true);
  const again = () => advance(false);
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: "Javobni o'ylang", ru: 'Подумайте над ответом' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
          <div className="fc-face fc-back"><span className="fc-tag">{tr(card.back)}</span>{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: "Kartani bosing — javobni ko'rasiz", ru: 'Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// ============================================================
//  VS CODE DARSI — YORDAMCHI KOMPONENTLAR (mockup'lar, checklist)
// ============================================================

// Card'dagi ism — qurilma bo'ylab saqlanadi (dars davomida hamma ekran o'qiydi)
const CARD_NAME_KEY = 'vscCardName';
const cardNameRead = () => { try { return localStorage.getItem(CARD_NAME_KEY) || ''; } catch { return ''; } };
const cardNameStore = (n) => { try { localStorage.setItem(CARD_NAME_KEY, n); } catch {} };
const useCardName = () => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  return cardNameRead() || (live && live.nickname) || 'Boburjon';
};

// VS Code palitrasi (dark-theme mockup)
const VSC = { bg: '#1E1E1E', side: '#252526', act: '#333333', line: '#3C3C3C', text: '#D4D4D4', dim: '#858585', blue: '#007ACC', tag: '#569CD6', attr: '#9CDCFE', str: '#CE9178', kw: '#C586C0' };

// Activity bar ikonkalari (soddalashtirilgan SVG)
const VscIc = ({ k }) => {
  const P = {
    files: <><rect x="5" y="3" width="10" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="9" y="7" width="10" height="13" rx="1.5" fill="#00000000" stroke="currentColor" strokeWidth="1.7" /></>,
    search: <><circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M14.5 14.5 19 19" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></>,
    git: <><circle cx="7" cy="6" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="7" cy="17" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="16" cy="11" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M7 8.5v6M9.2 7.2c3.4.6 5 1.6 4.7 2.4" fill="none" stroke="currentColor" strokeWidth="1.5" /></>,
    ext: <><rect x="4" y="11" width="6" height="6" rx="1" fill="currentColor" /><rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" /><rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" /><rect x="13" y="2.6" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
  };
  return <svg viewBox="0 0 22 22" width="17" height="17" aria-hidden="true">{P[k]}</svg>;
};

// Explorer fayl qatori
const VscFile = ({ name, on, css }) => (
  <div className={`vsc-file ${on ? 'on' : ''}`}>
    <span className="vsc-fic" style={{ color: css ? '#519ABA' : '#E37933' }}>{css ? '#' : '<>'}</span>
    <span>{name}</span>
  </div>
);

// VS Code oynasi (moslashuvchan mockup): act — faol ikonka indeksi, side — chap panel,
// main — muharrir maydoni, panel — pastki panel (terminal), status — pastki ko'k chiziq o'ng tomoni
const VscShell = ({ title = 'Visual Studio Code', act = 0, side, main, panel, statusRight, statusPulse }) => (
  <div className="vsc">
    <div className="vsc-tbar"><span className="bb-dots"><i /><i /><i /></span><span className="vsc-title">{title}</span></div>
    <div className="vsc-body">
      <div className="vsc-act">
        {['files', 'search', 'git', 'ext'].map((k, i) => <span key={k} className={`vsc-actic ${i === act ? 'on' : ''}`}><VscIc k={k} /></span>)}
      </div>
      {side != null && <div className="vsc-side">{side}</div>}
      <div className="vsc-mainwrap">
        <div className="vsc-main">{main}</div>
        {panel}
      </div>
    </div>
    <div className="vsc-status">
      <span className="vsc-st-l">⑂ main</span>
      <span className={`vsc-st-r ${statusPulse ? 'pulse' : ''}`}>{statusRight}</span>
    </div>
  </div>
);

// Muharrir kod qatori (raqam bilan)
const VL = ({ n, ind = 0, children }) => (
  <div className="vsc-ln"><span className="vsc-lnum">{n}</span><span className="vsc-lcode" style={{ paddingLeft: ind * 14 }}>{children}</span></div>
);
const Vt = ({ children }) => <span style={{ color: VSC.tag }}>{children}</span>;
const Va = ({ children }) => <span style={{ color: VSC.attr }}>{children}</span>;
const Vs = ({ children }) => <span style={{ color: VSC.str }}>{children}</span>;

// Brauzer oynasi mockup'i (127.0.0.1:5500)
const BrowserWin = ({ url = '127.0.0.1:5500/index.html', tab, children, minH }) => (
  <div className="brw">
    <div className="brw-top">
      <span className="bb-dots"><i /><i /><i /></span>
      <span className="brw-tab">{tab || 'index.html'}</span>
    </div>
    <div className="brw-addr"><span className="brw-lock">🔒</span><span className="brw-url">{url}</span><span className="brw-go">↻</span></div>
    <div className="brw-body" style={minH ? { minHeight: minH } : undefined}>{children}</div>
  </div>
);

// Vizitka-card preview. flags — qaysi bezaklar qo'llangan (s10 bosqichma-bosqich yig'adi).
// plain — hali CSS'siz oddiy HTML ko'rinishi. anim — s1 dagi «o'zi yig'iladi» effekti.
const VCard = ({ name = 'Boburjon', prof = 'Mr.iot', flags, plain, anim }) => {
  const f = flags || { bg: true, center: true, radius: true, shadow: true };
  if (plain) {
    return (
      <div className="vcard-plainwrap">
        <div className="vcard-plainlogo">&lt;/&gt;</div>
        <h2 className="vcard-plainname">{name}</h2>
        <p className="vcard-plainprof">{prof}</p>
      </div>
    );
  }
  const st = {
    background: f.bg ? '#3FAE2A' : 'transparent',
    borderRadius: f.radius ? 18 : 0,
    margin: f.center ? '0 auto' : '0',
    boxShadow: f.shadow ? '0 14px 34px -10px rgba(20,60,15,0.45)' : 'none',
    border: f.bg ? 'none' : '1.5px dashed #A7A6A2',
  };
  return (
    <div className={`vcard-stage ${anim ? 'vc-anim' : ''}`}>
      <div className="vcard" style={st}>
        <div className="vcard-logo vc-a1">&lt;/&gt;</div>
        <div className="vcard-name vc-a2" style={{ color: f.bg ? '#1E7BD7' : '#0E0E10' }}>{name}</div>
        <div className="vcard-prof vc-a3" style={{ color: f.bg ? '#14301a' : '#5A5A60' }}>{prof}</div>
      </div>
    </div>
  );
};

// ✅ «Bajardim»-checklist — real kompyuterda bajariladigan qadamlar uchun.
// Avto-tekshirib bo'lmaydi: o'quvchi har qadamni o'zi belgilaydi; hammasi belgilangach
// «tugatdim» signali serverga boradi — mentor jonli panelda kim bajarganini ko'radi.
function StepChecklist({ screen, storedAnswer, onAnswer, steps, taskLabel }) {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === 'mentor');
  const [done, setDone] = useState(() => new Set(storedAnswer?.doneIds || (storedAnswer?.correct ? steps.map(s => s.id) : [])));
  const sentRef = useRef(!!(storedAnswer && storedAnswer.correct));
  const allDone = done.size >= steps.length;
  const toggle = (id) => {
    if (isMentorLive) return; // mentor belgilamaydi — o'quvchilarni kuzatadi
    const n = new Set(done);
    if (n.has(id)) n.delete(id); else n.add(id);
    setDone(n);
    const all = n.size >= steps.length;
    onAnswer(screen, { correct: all, doneIds: [...n], picked: n.size, stage: 'checklist', screenIdx: screen });
    if (all && !sentRef.current) {
      sentRef.current = true;
      if (live && live.mode === 'student') live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, 0, true, 0);
    }
  };
  return (
    <div className="clk fade-up delay-2">
      <div className="clk-head">
        <span className="clk-lbl">✅ {tr({ uz: 'Kompyuteringizda bajaring', ru: 'Выполните на своём компьютере' })}</span>
        <span className={`clk-count ${allDone ? 'ok' : ''}`}>{done.size}/{steps.length}</span>
      </div>
      {steps.map((s, i) => {
        const on = done.has(s.id);
        return (
          <div key={s.id} className={`clk-row ${on ? 'on' : ''}`}>
            <span className="clk-num">{on ? '✓' : i + 1}</span>
            <span className="clk-txt">
              <span className="clk-t">{fmtCode(tr(s.t))}</span>
              {s.d && <span className="clk-d">{fmtCode(tr(s.d))}</span>}
            </span>
            <button className={`clk-btn ${on ? 'on' : ''}`} onClick={() => toggle(s.id)} disabled={isMentorLive}>
              {on ? tr({ uz: '✓ Bajarildi', ru: '✓ Готово' }) : tr({ uz: 'Bajardim', ru: 'Сделал(а)' })}
            </button>
          </div>
        );
      })}
      {allDone && !isMentorLive && <p className="clk-done fade-step">🎉 {tr({ uz: "Zo'r! Hamma qadam bajarildi — davom etamiz.", ru: 'Отлично! Все шаги выполнены — продолжаем.' })}</p>}
      {isMentorLive && <MentorWorkStats live={live} screenIdx={screen} taskLabel={taskLabel} />}
    </div>
  );
}

// ============================================================
//  EKRAN 0 — HOOK: «Professionallar qayerda kod yozadi?»
// ============================================================
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: 's0', text: "Shu paytgacha kodni dars ichidagi maydonchada yozdik. Sizningcha, haqiqiy dasturchilar kodni qayerda yozadi? Variantlardan birini tanlang.", trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: 'a', label: { uz: "Word'da yozib, keyin saytga aylantiradi", ru: 'Пишут в Word, потом превращают в сайт' } },
    { id: 'b', label: { uz: 'Maxsus kod-muharrir dasturda yozadi', ru: 'Пишут в специальном редакторе кода' } },
    { id: 'c', label: { uz: "To'g'ridan-to'g'ri brauzerning ichida yozadi", ru: 'Пишут прямо внутри браузера' } },
  ];
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); audio.triggerEvent('option_picked'); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 780 }}>{tr({ uz: <>Professionallar kodni <span className="italic" style={{ color: T.accent }}>qayerda</span> yozadi?</>, ru: <>Где профессионалы <span className="italic" style={{ color: T.accent }}>пишут</span> код?</> })}</h1>
        <Mentor>{tr({ uz: <>Shu paytgacha kodni <b style={{ color: T.ink }}>dars ichidagi maydonchada</b> yozdik — bu o'quv velosipedi edi. Bugun haqiqiy mashinaga o'tiramiz. Avval o'zingiz o'ylab ko'ring: haqiqiy dasturchilar kodni qayerda yozadi?</>, ru: <>До этого мы писали код <b style={{ color: T.ink }}>в поле внутри урока</b> — это был учебный велосипед. Сегодня пересаживаемся на настоящую машину. Сначала подумайте сами: где пишут код настоящие разработчики?</> })}</Mentor>
        <Split>
          <Col>
            <p className="eyebrow fade-up delay-1" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha qaysi biri?', ru: 'Как вы думаете, где?' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr(o.label)}</span>
                  </button>
                );
              })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Javob — <b>maxsus kod-muharrir</b>. Uning nomi <b>VS Code</b>: har 4 dasturchidan 3 tasi aynan shunda yozadi. Bugun u sizning kompyuteringizga ham o'rnatiladi.</>, ru: <>Ответ — <b>специальный редактор кода</b>. Его имя — <b>VS Code</b>: трое из четырёх разработчиков пишут именно в нём. Сегодня он появится и на вашем компьютере.</> })}</p>}
          </Col>
          <Col>
            <p className="flow-label fade-up delay-1">{tr({ uz: picked !== null ? 'Mana u — VS Code' : 'Sirli qurol…', ru: picked !== null ? 'Вот он — VS Code' : 'Загадочный инструмент…' })}</p>
            <div className={`fade-up delay-2 ${picked === null ? 'vsc-teaser' : 'demo-swap'}`} key={picked === null ? 'blur' : 'open'}>
              <VscShell
                side={<><div className="vsc-sidehead">{tr({ uz: 'MY-SITE', ru: 'MY-SITE' })}</div><VscFile name="index.html" on /><VscFile name="style.css" css /></>}
                main={<>
                  <div className="vsc-tabs"><span className="vsc-tab on"><span style={{ color: '#E37933' }}>{'<>'}</span> index.html</span></div>
                  <div className="vsc-code">
                    <VL n={1}><Vt>&lt;h1&gt;</Vt><span style={{ color: VSC.text }}>Salom, dunyo!</span><Vt>&lt;/h1&gt;</Vt></VL>
                    <VL n={2}><Vt>&lt;p&gt;</Vt><span style={{ color: VSC.text }}>{tr({ uz: 'Mening birinchi loyiham', ru: 'Мой первый проект' })}</span><Vt>&lt;/p&gt;</Vt></VL>
                    <VL n={3}><span className="vsc-caret" /></VL>
                  </div>
                </>}
                statusRight={<>⚡ Go Live</>}
              />
            </div>
            {picked === null && <p className="mono small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center' }}>{tr({ uz: '↑ javob tanlasangiz — ochiladi', ru: '↑ выберите ответ — и он откроется' })}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 1 — MAQSAD: jonli vizitka-card + ism
// ============================================================
const ScreenGoal = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's1', text: "Ishonasizmi — dars oxirida o'z kompyuteringizda, jonli serverda, mana shunday vizitka-card turadi. Ismingizni yozing — card sizniki bo'lsin. Unga 6 qadamda yetib boramiz.", trigger: 'on_mount', waits_for: null }]);
  const [nm, setNm] = useState(() => cardNameRead());
  const shown = nm.trim() || 'Boburjon';
  const setName = (v) => { setNm(v); cardNameStore(v.trim()); };
  const STEPS = [
    { text: { uz: "VS Code'ni yuklab o'rnatamiz", ru: 'Скачиваем и ставим VS Code' }, tag: 'code.visualstudio.com' },
    { text: { uz: 'Oynasi bilan tanishamiz', ru: 'Знакомимся с окном' }, tag: 'Explorer · Extensions' },
    { text: { uz: 'Papka ochib, fayllar yaratamiz', ru: 'Открываем папку, создаём файлы' }, tag: 'index.html · style.css' },
    { text: { uz: 'Jonli serverni yoqamiz', ru: 'Включаем живой сервер' }, tag: 'Go Live' },
    { text: { uz: 'Card HTML\u2019ini yig\u2019amiz', ru: 'Собираем HTML карточки' }, tag: 'div.card' },
    { text: { uz: "Card'ga stil beramiz", ru: 'Оформляем карточку' }, tag: 'style.css' },
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Natija — dars oxirida kompyuteringizda shunday bo'ladi", ru: 'Результат — в конце урока на вашем компьютере будет так' })}</p>
      <BrowserWin tab="Mening cardim" minH={230}>
        <VCard name={shown} prof="Mr.iot" anim />
      </BrowserWin>
      <label className="vc-namelab fade-up delay-2">
        <span>{tr({ uz: '✍️ Ismingizni yozing — card sizniki:', ru: '✍️ Напишите своё имя — карточка ваша:' })}</span>
        <input className="text-input" style={{ maxWidth: 260 }} value={nm} onChange={(e) => setName(e.target.value)} placeholder="Boburjon" maxLength={20} />
      </label>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: '6 qadam', ru: '6 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (
          <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}>
            <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="step-body">
              <span className="step-text">{tr(s.text)}</span>
              {s.tag && <span className="step-tag">{s.tag}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Bugun kompyuteringiz <span className="italic" style={{ color: T.accent }}>ustaxonaga</span> aylanadi.</>, ru: <>Сегодня ваш компьютер станет <span className="italic" style={{ color: T.accent }}>мастерской</span>.</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>Ishonasizmi — dars oxirida <b style={{ color: T.ink }}>o'z kompyuteringizda</b>, jonli serverda, mana shunday <b style={{ color: T.ink }}>vizitka-card</b> turadi. Ismingizni yozing — card sizniki bo'lsin. Unga <b style={{ color: T.ink }}>6 qadamda</b> yetib boramiz.</>, ru: <>Поверите ли — к концу урока <b style={{ color: T.ink }}>на вашем компьютере</b>, на живом сервере, будет стоять вот такая <b style={{ color: T.ink }}>карточка-визитка</b>. Напишите своё имя — пусть карточка будет вашей. Дойдём до неё за <b style={{ color: T.ink }}>6 шагов</b>.</> })}</Mentor>
        {!isNarrow ? (
          <Split>{PreviewBlock}{StepsBlock}</Split>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>📋 {tr({ uz: "Bugungi 6 qadamni ko'rish", ru: 'Посмотреть 6 шагов на сегодня' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Natijani ko'rish", ru: 'Посмотреть результат' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 2 — QADAM 1: VS Code'ni o'rnatish (checklist)
// ============================================================
const ScreenInstall = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's2', text: "VS Code — bepul dastur. Brauzerda code.visualstudio.com saytini ochasiz, ko'k Download tugmasini bosasiz, yuklangan faylni ochib Next, keyin Install bilan o'rnatasiz. Har qadamni bajargach, ro'yxatda Bajardim tugmasini belgilang.", trigger: 'on_mount', waits_for: null }]);
  const [view, setView] = useState(0);
  const VIEWS = [
    { id: 0, chip: { uz: '1 · Sayt', ru: '1 · Сайт' } },
    { id: 1, chip: { uz: '2 · Yuklash', ru: '2 · Скачать' } },
    { id: 2, chip: { uz: "3 · O'rnatish", ru: '3 · Установка' } },
  ];
  const STEPS = [
    { id: 'open', t: { uz: 'Brauzerda `code.visualstudio.com` saytini oching', ru: 'Откройте в браузере сайт `code.visualstudio.com`' }, d: { uz: "Manzilni qo'lda yozing — bu rasmiy, bepul sayt", ru: 'Наберите адрес вручную — это официальный бесплатный сайт' } },
    { id: 'download', t: { uz: "Ko'k «Download for Windows» tugmasini bosing", ru: 'Нажмите синюю кнопку «Download for Windows»' }, d: { uz: 'Fayl (~100 MB) yuklanishini kuting', ru: 'Подождите, пока скачается файл (~100 МБ)' } },
    { id: 'install', t: { uz: 'Yuklangan faylni ochib, o\u2019rnating', ru: 'Откройте скачанный файл и установите' }, d: { uz: '«I accept the agreement» belgilang → Next → Next → Install', ru: 'Отметьте «I accept the agreement» → Next → Next → Install' } },
    { id: 'launch', t: { uz: "VS Code'ni oching — to'q rangli oyna chiqdi", ru: 'Откройте VS Code — появилось тёмное окно' }, d: { uz: 'Ish stolida (Desktopda) ko\u2019k belgi paydo bo\u2019ladi', ru: 'На рабочем столе появится синий значок' } },
  ];
  return (
    <Stage eyebrow={tr({ uz: "1-qadam · O'rnatish", ru: '1-й шаг · Установка' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !(storedAnswer && storedAnswer.correct)} label={_isMentorLive || (storedAnswer && storedAnswer.correct) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Qadamlarni belgilang', ru: 'Отметьте шаги' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>VS Code'ni <span className="italic" style={{ color: T.accent }}>qayerdan</span> olamiz?</>, ru: <>Откуда <span className="italic" style={{ color: T.accent }}>взять</span> VS Code?</> })}</h2></div>
        <Mentor>{tr({ uz: <>VS Code — <b style={{ color: T.ink }}>bepul</b> dastur. Chapdagi 3 ko'rinishni birma-bir ko'rib chiqing, keyin har qadamni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> bajarib, «Bajardim»ni belgilang. Kompyuter hozir yonida bo'lmasa — ro'yxatni eslab qoling, uyda aynan shu tartibda o'rnatasiz.</>, ru: <>VS Code — <b style={{ color: T.ink }}>бесплатная</b> программа. Просмотрите три вида слева по очереди, затем выполните каждый шаг <b style={{ color: T.ink }}>на своём компьютере</b> и отмечайте «Сделал(а)». Если компьютера рядом нет — запомните список и установите дома в том же порядке.</> })}</Mentor>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {VIEWS.map(v => <button key={v.id} className={`chip ${view === v.id ? 'chip-on' : ''}`} onClick={() => setView(v.id)}>{tr(v.chip)}</button>)}
            </div>
            <div className="demo-swap" key={view}>
              {view === 0 && (
                <BrowserWin url="code.visualstudio.com" tab="Visual Studio Code" minH={190}>
                  <div className="inst-site">
                    <div className="inst-logo">{'</>'}</div>
                    <p className="inst-h">Visual Studio Code</p>
                    <p className="inst-sub">{tr({ uz: 'Free. Built on open source. Runs everywhere.', ru: 'Free. Built on open source. Runs everywhere.' })}</p>
                    <span className="inst-dl">⬇ Download for Windows</span>
                  </div>
                </BrowserWin>
              )}
              {view === 1 && (
                <BrowserWin url="code.visualstudio.com" tab="Visual Studio Code" minH={190}>
                  <div className="inst-site">
                    <span className="inst-dl on">⬇ Download for Windows</span>
                    <div className="inst-dlrow">
                      <span className="inst-dlfile">📦 VSCodeUserSetup-x64.exe</span>
                      <span className="inst-dlbar"><i /></span>
                    </div>
                    <p className="inst-sub">{tr({ uz: "Fayl brauzerning pastida yoki «Yuklanmalar» papkasida ko'rinadi", ru: 'Файл появится внизу браузера или в папке «Загрузки»' })}</p>
                  </div>
                </BrowserWin>
              )}
              {view === 2 && (
                <div className="inst-setup">
                  <div className="inst-setbar">Setup — Visual Studio Code</div>
                  <div className="inst-setbody">
                    <p className="inst-setrow">☑ I accept the agreement</p>
                    <p className="inst-setrow">☑ Create a desktop icon</p>
                    <div className="inst-setbtns"><span>Back</span><span className="on">Install</span><span>Cancel</span></div>
                    <p className="inst-sub" style={{ marginTop: 8 }}>{tr({ uz: 'Bir daqiqadan so\u2019ng — tayyor!', ru: 'Через минуту — готово!' })}</p>
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col>
            <StepChecklist screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} steps={STEPS} taskLabel={tr({ uz: "VS Code o'rnatish", ru: 'Установка VS Code' })} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 3 — QADAM 2: interfeys-ekskursiya (interaktiv hotspot)
// ============================================================
const ScreenTour = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's3', text: "Bu — sizning yangi ish stolingiz. Oynaning 4 qismini birma-bir bosib chiqing: fayllar paneli, muharrir, kengaytmalar va terminal. Har birini bossangiz, nima ekanini tushuntiraman.", trigger: 'on_mount', waits_for: null }]);
  const HOTS = {
    explorer: { name: { uz: 'Explorer — fayllar paneli', ru: 'Explorer — панель файлов' }, ic: '🗂️',
      body: { uz: <>Loyihangizdagi <b>barcha fayllar ro'yxati</b>. Xuddi papka oynasi kabi: faylni bossangiz — muharrirda ochiladi. Tepadagi birinchi ikonka shu panelni ochib-yopadi.</>, ru: <>Список <b>всех файлов</b> вашего проекта. Как окно папки: нажмёте на файл — он откроется в редакторе. Первая иконка сверху открывает и закрывает эту панель.</> } },
    editor: { name: { uz: 'Muharrir — kod maydoni', ru: 'Редактор — поле кода' }, ic: '📝',
      body: { uz: <>Eng katta maydon — kod <b>aynan shu yerga yoziladi</b>. Har ochilgan fayl tepada o'z varag'i (tab) bilan turadi. Qator raqamlari chapda — xato qidirishda juda asqotadi.</>, ru: <>Самое большое поле — код <b>пишется именно здесь</b>. Каждый открытый файл держит сверху свою вкладку (tab). Номера строк слева — очень помогают искать ошибки.</> } },
    ext: { name: { uz: 'Extensions — kengaytmalar', ru: 'Extensions — расширения' }, ic: '🧩',
      body: { uz: <>Kubiklar belgisi — <b>kengaytmalar do'koni</b>. Kengaytma (extension) — VS Code'ga yangi imkoniyat qo'shadigan mini-dastur. Birozdan keyin shu yerdan <b>Live Server</b>'ni o'rnatamiz.</>, ru: <>Значок из кубиков — <b>магазин расширений</b>. Расширение (extension) — мини-программа, добавляющая VS Code новую возможность. Чуть позже мы поставим отсюда <b>Live Server</b>.</> } },
    term: { name: { uz: 'Terminal — buyruq oynasi', ru: 'Terminal — окно команд' }, ic: '⌨️',
      body: { uz: <>Pastdagi panel — <b>terminal</b>: kompyuterga yozma buyruq beriladigan joy. Hozircha shunchaki tanishib qo'ying — tez orada juda kerak bo'ladi.</>, ru: <>Нижняя панель — <b>терминал</b>: место, где компьютеру дают письменные команды. Пока просто познакомьтесь — совсем скоро он очень пригодится.</> } },
  };
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(() => new Set(storedAnswer?.seenIds || (storedAnswer?.correct ? Object.keys(HOTS) : [])));
  const sentRef = useRef(!!(storedAnswer && storedAnswer.correct));
  const allSeen = seen.size >= 4;
  const tap = (k) => {
    setActive(k);
    const n = new Set(seen); n.add(k); setSeen(n);
    const all = n.size >= 4;
    onAnswer(screen, { correct: all, seenIds: [...n], picked: n.size, stage: 'exploration', screenIdx: screen });
    if (all && !sentRef.current) sentRef.current = true;
  };
  return (
    <Stage eyebrow={tr({ uz: '2-qadam · Tanishuv', ru: '2-й шаг · Знакомство' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !allSeen} label={_isMentorLive || allSeen ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: '4 qismni bosib chiqing', ru: 'Нажмите на 4 части' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>VS Code ichida <span className="italic" style={{ color: T.accent }}>nima bor</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>внутри</span> VS Code?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu — sizning yangi ish stolingiz. Oynaning <b style={{ color: T.ink }}>4 qismini</b> birma-bir bosib chiqing — har birining vazifasini aytib beraman.</>, ru: <>Это ваш новый рабочий стол. Нажмите по очереди на <b style={{ color: T.ink }}>4 части</b> окна — расскажу, для чего каждая.</> })}</Mentor>
        <p className="sk-tapguide fade-up delay-1">👆 {tr({ uz: <>Oynaning qismlarini <b>bosing</b></>, ru: <>Нажимайте на части окна</> })}<span className="sk-tapcount">{seen.size}/4</span></p>
        <Split>
          <Col>
            <div className="vsc fade-up delay-1">
              <div className="vsc-tbar"><span className="bb-dots"><i /><i /><i /></span><span className="vsc-title">my-site — Visual Studio Code</span></div>
              <div className="vsc-body">
                <div className="vsc-act">
                  <span className={`vsc-actic on vsc-hot ${seen.has('explorer') ? 'seen' : ''}`} onClick={() => tap('explorer')} role="button"><VscIc k="files" /></span>
                  <span className="vsc-actic"><VscIc k="search" /></span>
                  <span className="vsc-actic"><VscIc k="git" /></span>
                  <span className={`vsc-actic vsc-hot ${seen.has('ext') ? 'seen' : ''} ${active === 'ext' ? 'hoton' : ''}`} onClick={() => tap('ext')} role="button"><VscIc k="ext" />{seen.has('ext') && <b className="vsc-seenmark">✓</b>}</span>
                </div>
                <div className={`vsc-side vsc-hot ${seen.has('explorer') ? 'seen' : ''} ${active === 'explorer' ? 'hoton' : ''}`} onClick={() => tap('explorer')} role="button">
                  <div className="vsc-sidehead">MY-SITE {seen.has('explorer') && <b className="vsc-seenmark">✓</b>}</div>
                  <VscFile name="index.html" on />
                  <VscFile name="style.css" css />
                </div>
                <div className="vsc-mainwrap">
                  <div className={`vsc-main vsc-hot ${seen.has('editor') ? 'seen' : ''} ${active === 'editor' ? 'hoton' : ''}`} onClick={() => tap('editor')} role="button">
                    <div className="vsc-tabs"><span className="vsc-tab on"><span style={{ color: '#E37933' }}>{'<>'}</span> index.html</span><span className="vsc-tab"><span style={{ color: '#519ABA' }}>#</span> style.css</span>{seen.has('editor') && <b className="vsc-seenmark" style={{ marginLeft: 'auto' }}>✓</b>}</div>
                    <div className="vsc-code">
                      <VL n={1}><Vt>&lt;h1&gt;</Vt><span style={{ color: VSC.text }}>Salom!</span><Vt>&lt;/h1&gt;</Vt></VL>
                      <VL n={2}><span className="vsc-caret" /></VL>
                    </div>
                  </div>
                  <div className={`vsc-panel vsc-hot ${seen.has('term') ? 'seen' : ''} ${active === 'term' ? 'hoton' : ''}`} onClick={() => tap('term')} role="button">
                    <span className="vsc-panelh">TERMINAL {seen.has('term') && <b className="vsc-seenmark">✓</b>}</span>
                    <span className="vsc-prompt">PS C:\my-site&gt; <span className="vsc-caret" /></span>
                  </div>
                </div>
              </div>
              <div className="vsc-status"><span className="vsc-st-l">⑂ main</span><span className="vsc-st-r">⚡ Go Live</span></div>
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <div className="sk-tagbig"><span style={{ fontSize: 22 }}>{HOTS[active].ic}</span><span className="sk-wordbadge">{tr(HOTS[active].name)}</span></div>
                <p className="body" style={{ marginTop: 8 }}>{tr(HOTS[active].body)}</p>
              </div>
            ) : (
              <div className="hint fade-up delay-2">{tr({ uz: "Chapdagi oynaning istalgan qismini bosing — shu yerda tushuntirish chiqadi.", ru: 'Нажмите на любую часть окна слева — здесь появится объяснение.' })}</div>
            )}
            {allSeen && (
              <div className="frame-success fade-step">
                <p className="body" style={{ margin: 0 }}>{tr({ uz: <>Ajoyib — <b>4 qismning hammasini</b> bilib oldingiz! Endi bu oyna siz uchun begona emas.</>, ru: <>Отлично — вы узнали <b>все 4 части</b>! Теперь это окно для вас не чужое.</> })}</p>
              </div>
            )}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 4 — TEST 1 (scored): Explorer
// ============================================================
const ScreenTest1 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    audioText="Loyihangizdagi fayllar ro'yxatini VS Code'ning qaysi qismi ko'rsatadi? To'g'ri variantni tanlang."
    questionText="Loyihadagi fayllar ro'yxatini VS Code'ning qaysi qismi ko'rsatadi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Oynani eslang', ru: 'Вспомните окно' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: "Loyihadagi fayllar ro'yxatini VS Code'ning qaysi qismi ko'rsatadi?", ru: 'Какая часть VS Code показывает список файлов проекта?' })}</h2></>}
    options={[
      { uz: "Terminal — pastdagi buyruq oynasi", ru: 'Terminal — окно команд внизу' },
      { uz: "Explorer — chapdagi fayllar paneli", ru: 'Explorer — панель файлов слева' },
      { uz: "Extensions — kengaytmalar bo'limi", ru: 'Extensions — раздел расширений' },
      { uz: "Status bar — pastki ko'k chiziq", ru: 'Status bar — нижняя синяя полоса' },
    ]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri. Explorer — chapdagi panel: loyihangizdagi barcha fayllar shu yerda, faylni bossangiz muharrirda ochiladi.", ru: 'Верно. Explorer — панель слева: там все файлы проекта, нажмёте на файл — он откроется в редакторе.' })}
    explainWrong={{
      0: tr({ uz: "Terminal — kompyuterga yozma buyruq beriladigan oyna. Fayllar ro'yxatini Explorer ko'rsatadi.", ru: 'Terminal — окно для письменных команд компьютеру. Список файлов показывает Explorer.' }),
      2: tr({ uz: "Extensions — kengaytmalar do'koni, u yerdan yangi imkoniyat o'rnatiladi. Fayllar ro'yxati — Explorer'da.", ru: 'Extensions — магазин расширений, оттуда ставят новые возможности. Список файлов — в Explorer.' }),
      3: tr({ uz: "Status bar — pastki ko'k chiziq, u yerda Go Live tugmasi turadi. Fayllar ro'yxati — Explorer'da.", ru: 'Status bar — нижняя синяя полоса, там живёт кнопка Go Live. Список файлов — в Explorer.' }),
      default: tr({ uz: "Fayllar ro'yxatini chapdagi Explorer paneli ko'rsatadi.", ru: 'Список файлов показывает панель Explorer слева.' }),
    }} />
);

// ============================================================
//  EKRAN 5 — QADAM 3: papka ochish + fayllar yaratish (checklist)
// ============================================================
const ScreenFolder = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's5', text: "Har loyiha — alohida papka. Avval Desktopda my-site papkasini yaratasiz, keyin VS Code'da File, Open Folder orqali ochasiz. Explorer'da New File belgisi bilan index.html va style.css fayllarini yaratasiz. Har qadamni bajarib, Bajardim tugmasini belgilang.", trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { id: 'folder', t: { uz: 'Desktopda yangi papka yarating: `my-site`', ru: 'Создайте на рабочем столе новую папку: `my-site`' }, d: { uz: "Papka nomi — inglizcha, bo'sh joysiz (professional odat)", ru: 'Имя папки — английское, без пробелов (профессиональная привычка)' } },
    { id: 'open', t: { uz: "VS Code'da: File → Open Folder → `my-site`", ru: 'В VS Code: File → Open Folder → `my-site`' }, d: { uz: '«Trust the authors» so\u2019rasa — «Yes» bosing', ru: 'Если спросит «Trust the authors» — нажмите «Yes»' } },
    { id: 'html', t: { uz: "Explorer'da 📄 New File → `index.html`", ru: 'В Explorer: 📄 New File → `index.html`' }, d: { uz: "Nomini AYNAN shunday yozing — brauzer avval shu faylni qidiradi", ru: 'Напишите имя ТОЧНО так — браузер ищет именно этот файл первым' } },
    { id: 'css', t: { uz: 'Yana 📄 New File → `style.css`', ru: 'Ещё раз 📄 New File → `style.css`' }, d: { uz: "Hozircha ikkalasi ham bo'sh — shunday bo'lishi kerak", ru: 'Пока оба файла пустые — так и должно быть' } },
  ];
  return (
    <Stage eyebrow={tr({ uz: '3-qadam · Loyiha', ru: '3-й шаг · Проект' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !(storedAnswer && storedAnswer.correct)} label={_isMentorLive || (storedAnswer && storedAnswer.correct) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Qadamlarni belgilang', ru: 'Отметьте шаги' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi <span className="italic" style={{ color: T.accent }}>loyihangizni</span> ochamiz.</>, ru: <>Открываем ваш первый <span className="italic" style={{ color: T.accent }}>проект</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Professional qoida: <b style={{ color: T.ink }}>har loyiha — alohida papka</b>. Papkani VS Code'da ochsangiz, u chapda — Explorer'da ko'rinadi. Ichiga ikkita fayl yaratamiz: <b style={{ color: T.ink }}>index.html</b> (sahifa) va <b style={{ color: T.ink }}>style.css</b> (bezaklar).</>, ru: <>Профессиональное правило: <b style={{ color: T.ink }}>каждый проект — отдельная папка</b>. Откроете папку в VS Code — она появится слева, в Explorer. Внутри создадим два файла: <b style={{ color: T.ink }}>index.html</b> (страница) и <b style={{ color: T.ink }}>style.css</b> (оформление).</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label fade-up delay-1">{tr({ uz: "Natijada Explorer shunday ko'rinadi", ru: 'В итоге Explorer будет выглядеть так' })}</p>
            <div className="fade-up delay-1">
              <VscShell
                title="my-site — Visual Studio Code"
                side={<>
                  <div className="vsc-sidehead">MY-SITE <span className="vsc-newfile" title="New File">📄+</span></div>
                  <VscFile name="index.html" on />
                  <VscFile name="style.css" css />
                </>}
                main={<>
                  <div className="vsc-tabs"><span className="vsc-tab on"><span style={{ color: '#E37933' }}>{'<>'}</span> index.html</span></div>
                  <div className="vsc-code">
                    <VL n={1}><span className="vsc-caret" /><span style={{ color: VSC.dim, fontStyle: 'italic', marginLeft: 8 }}>{tr({ uz: "bo'sh — keyingi qadamda to'ldiramiz", ru: 'пусто — заполним на следующем шаге' })}</span></VL>
                  </div>
                </>}
                statusRight={<>⚡ Go Live</>}
              />
            </div>
            <div className="hl-note fade-up delay-2"><p className="body" style={{ margin: 0 }}>{fmtCode(tr({ uz: "💡 `index.html` — loyihaning bosh sahifasi. Brauzer papkani ochganda birinchi bo'lib aynan `index.html`ni qidiradi — shuning uchun nomi o'zgarmas.", ru: '💡 `index.html` — главная страница проекта. Открывая папку, браузер первым делом ищет именно `index.html` — поэтому имя неизменно.' }))}</p></div>
          </Col>
          <Col>
            <StepChecklist screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} steps={STEPS} taskLabel={tr({ uz: 'Papka va fayllar', ru: 'Папка и файлы' })} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 6 — EMMET: «!» + Tab sehri + skeletni yig'ish (drag)
// ============================================================
const EMMET_PIECES = [
  { id: 'doctype', label: '<!DOCTYPE html>' },
  { id: 'html', label: '<html>' },
  { id: 'head', label: '<head>' },
  { id: 'body', label: '<body>' },
];
const ScreenEmmet = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's6', text: "Endi sehrni ko'ring: bo'sh index.html'da undov belgisini yozib, Tab tugmasini bossangiz — VS Code butun HTML shablonni o'zi yozib beradi. Bu yordamchining nomi Emmet. Sehrni ishga tushiring, keyin shablon bo'laklarini o'zingiz to'g'ri tartibda joylang.", trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 2 : 0); // 0 — bo'sh, 1 — «!» yozildi, 2 — shablon ochildi
  const [solved, setSolved] = useState(!!(storedAnswer && storedAnswer.correct));
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const play = () => {
    setPhase(1);
    timerRef.current = setTimeout(() => setPhase(2), 900);
  };
  const onSolved = () => {
    if (solved) return;
    setSolved(true);
    onAnswer(screen, { correct: true, picked: 'emmet', stage: 'exploration', screenIdx: screen });
  };
  const TPL = [
    [1, 0, <><Vt>&lt;!DOCTYPE </Vt><Va>html</Va><Vt>&gt;</Vt></>],
    [2, 0, <><Vt>&lt;html </Vt><Va>lang</Va>=<Vs>"en"</Vs><Vt>&gt;</Vt></>],
    [3, 1, <Vt>&lt;head&gt;</Vt>],
    [4, 2, <><Vt>&lt;meta </Vt><Va>charset</Va>=<Vs>"UTF-8"</Vs><Vt>&gt;</Vt></>],
    [5, 2, <><Vt>&lt;title&gt;</Vt><span style={{ color: VSC.text }}>Document</span><Vt>&lt;/title&gt;</Vt></>],
    [6, 1, <Vt>&lt;/head&gt;</Vt>],
    [7, 1, <Vt>&lt;body&gt;</Vt>],
    [8, 2, <span className="vsc-caret" />],
    [9, 1, <Vt>&lt;/body&gt;</Vt>],
    [10, 0, <Vt>&lt;/html&gt;</Vt>],
  ];
  return (
    <Stage eyebrow={tr({ uz: '3-qadam · Shablon', ru: '3-й шаг · Шаблон' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !solved} label={_isMentorLive || solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Skeletni yig'ing", ru: 'Соберите скелет' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="mono" style={{ color: T.accent }}>!</span> + Tab — bitta belgi, <span className="italic" style={{ color: T.accent }}>butun shablon</span>?</>, ru: <><span className="mono" style={{ color: T.accent }}>!</span> + Tab — один символ, <span className="italic" style={{ color: T.accent }}>целый шаблон</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Skeletni har safar qo'lda yozish shart emas. VS Code ichida <b style={{ color: T.ink }}>Emmet</b> degan yordamchi bor: bo'sh index.html'da <b className="mono" style={{ color: T.ink }}>!</b> yozib <b style={{ color: T.ink }}>Tab</b> bossangiz — butun HTML shablon o'zi yoziladi. Avval sehrni ko'ring, keyin bo'laklarni o'zingiz tartibga soling — shablonda nima borligini bilishingiz kerak.</>, ru: <>Не обязательно каждый раз писать скелет вручную. Внутри VS Code живёт помощник <b style={{ color: T.ink }}>Emmet</b>: напишите в пустом index.html <b className="mono" style={{ color: T.ink }}>!</b> и нажмите <b style={{ color: T.ink }}>Tab</b> — весь HTML-шаблон напишется сам. Сначала посмотрите магию, потом расставьте части сами — вы должны знать, что внутри шаблона.</> })}</Mentor>
        <Split>
          <Col>
            <div className="fade-up delay-1">
              <VscShell
                title="my-site — Visual Studio Code"
                side={<><div className="vsc-sidehead">MY-SITE</div><VscFile name="index.html" on /><VscFile name="style.css" css /></>}
                main={<>
                  <div className="vsc-tabs"><span className="vsc-tab on"><span style={{ color: '#E37933' }}>{'<>'}</span> index.html</span></div>
                  <div className="vsc-code" key={phase}>
                    {phase === 0 && <VL n={1}><span className="vsc-caret" /></VL>}
                    {phase === 1 && <VL n={1}><span style={{ color: VSC.attr, fontWeight: 700 }}>!</span><span className="vsc-caret" /><span className="em-tabhint">Tab ⇥</span></VL>}
                    {phase === 2 && TPL.map(([n, ind, jsx], i) => (
                      <div key={n} className="fade-step" style={{ animationDelay: `${i * 0.06}s` }}><VL n={n} ind={ind}>{jsx}</VL></div>
                    ))}
                  </div>
                </>}
                statusRight={<>⚡ Go Live</>}
              />
            </div>
            <div className="br-controls fade-up delay-2">
              {phase === 0 && <button className="btn" onClick={play}>✨ {tr({ uz: "Sehrni ko'rish", ru: 'Посмотреть магию' })}</button>}
              {phase === 2 && <button className="btn-ghost" onClick={() => { setPhase(0); }}>↻ {tr({ uz: "Yana bir bor ko'rish", ru: 'Посмотреть ещё раз' })}</button>}
              {phase === 2 && <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>✓ {tr({ uz: '10 qator — 1 soniyada!', ru: '10 строк — за 1 секунду!' })}</span>}
            </div>
          </Col>
          <Col>
            {phase < 2 ? (
              <div className="hint fade-up delay-2">{tr({ uz: "Avval chapdagi «Sehrni ko'rish» tugmasini bosing — shablon ochilgach, bu yerda mashq chiqadi.", ru: 'Сначала нажмите «Посмотреть магию» слева — когда шаблон раскроется, здесь появится упражнение.' })}</div>
            ) : (
              <div className="sk-buildbox">
                <p className="flow-label" style={{ marginBottom: 8 }}>{tr({ uz: "Endi o'zingiz: shablon bo'laklarini TO'G'RI tartibda joylang", ru: 'Теперь сами: расставьте части шаблона в ВЕРНОМ порядке' })}</p>
                <DragDropOrder items={EMMET_PIECES} hints={[{ uz: "1 — sahifa turi e'loni", ru: '1 — объявление типа страницы' }, { uz: '2 — butun sahifa qobig\u2019i', ru: '2 — оболочка всей страницы' }, { uz: "3 — ko'rinmas qism (sozlamalar)", ru: '3 — невидимая часть (настройки)' }, { uz: "4 — ko'rinadigan qism (kontent)", ru: '4 — видимая часть (контент)' }]} onSolved={onSolved} />
                {solved && <div className="frame-success fade-step" style={{ marginTop: 10 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Esladingiz! Emmet ham aynan shu tartibda yozadi: kod <b>body</b> ichiga — kursor turgan joyga yoziladi.</>, ru: <>Вспомнили! Emmet пишет именно в этом порядке: код пишется внутрь <b>body</b> — туда, где стоит курсор.</> })}</p></div>}
              </div>
            )}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 7 — QADAM 4: Live Server + Go Live + 127.0.0.1 (checklist)
// ============================================================
const ScreenLive = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's7', text: "Endi eng shirin qadam. Extensions bo'limidan Live Server kengaytmasini o'rnatasiz. Keyin pastdagi Go Live tugmasini bossangiz, sahifangiz brauzerda 127 nol nol bir manzilda ochiladi. Bu — o'z kompyuteringizning manzili, sahifani hozircha faqat siz ko'rasiz. Uch ko'rinishni ko'rib chiqib, qadamlarni kompyuteringizda bajaring.", trigger: 'on_mount', waits_for: null }]);
  const nm = useCardName();
  const [view, setView] = useState(0);
  const [viewed, setViewed] = useState(() => new Set([0]));
  const go = (v) => { setView(v); setViewed(prev => { const n = new Set(prev); n.add(v); return n; }); };
  const VIEWS = [
    { chip: { uz: '1 · Kengaytma', ru: '1 · Расширение' } },
    { chip: { uz: '2 · Go Live', ru: '2 · Go Live' } },
    { chip: { uz: '3 · Jonli natija', ru: '3 · Живой результат' } },
  ];
  const STEPS = [
    { id: 'ext', t: { uz: "Extensions'da `Live Server`ni topib, Install bosing", ru: 'Найдите в Extensions `Live Server` и нажмите Install' }, d: { uz: 'Kubiklar belgisi → qidiruvga yozing → birinchi natija', ru: 'Значок кубиков → введите в поиск → первый результат' } },
    { id: 'golive', t: { uz: "index.html ochiq holda pastdagi «Go Live»ni bosing", ru: 'Откройте index.html и нажмите «Go Live» внизу' }, d: { uz: "Pastki ko'k chiziqning o'ng burchagida", ru: 'В правом углу нижней синей полосы' } },
    { id: 'browser', t: { uz: 'Brauzerda `127.0.0.1:5500` ochilganini ko\u2019ring', ru: 'Убедитесь, что в браузере открылся `127.0.0.1:5500`' }, d: { uz: "Sahifa hozircha bo'sh-oppoq — bu normal", ru: 'Страница пока белая и пустая — это нормально' } },
    { id: 'h1', t: { uz: "`<h1>` bilan ismingizni yozib, `Ctrl+S` bosing", ru: 'Напишите своё имя в `<h1>` и нажмите `Ctrl+S`' }, d: { uz: "Brauzerga qarang — sahifa O'ZI yangilandi!", ru: 'Посмотрите на браузер — страница обновилась САМА!' } },
  ];
  return (
    <Stage eyebrow={tr({ uz: '4-qadam · Jonli server', ru: '4-й шаг · Живой сервер' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !(storedAnswer && storedAnswer.correct)} label={_isMentorLive || (storedAnswer && storedAnswer.correct) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Qadamlarni belgilang', ru: 'Отметьте шаги' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sahifangiz <span className="italic" style={{ color: T.accent }}>jonlanadi</span> — Go Live!</>, ru: <>Ваша страница <span className="italic" style={{ color: T.accent }}>оживает</span> — Go Live!</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi eng shirin qadam. <b style={{ color: T.ink }}>Live Server</b> — sahifani <b style={{ color: T.ink }}>jonli serverda</b> ochib beradigan kengaytma: kodni saqlashingiz bilan brauzer o'zi yangilanadi. Uch ko'rinishni ko'rib chiqing, keyin kompyuteringizda bajaring.</>, ru: <>Теперь самый вкусный шаг. <b style={{ color: T.ink }}>Live Server</b> — расширение, открывающее страницу на <b style={{ color: T.ink }}>живом сервере</b>: сохраните код — и браузер обновится сам. Просмотрите три вида, затем выполните на своём компьютере.</> })}</Mentor>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {VIEWS.map((v, i) => <button key={i} className={`chip ${view === i ? 'chip-on' : ''}`} onClick={() => go(i)}>{viewed.has(i) && i !== view ? '✓ ' : ''}{tr(v.chip)}</button>)}
            </div>
            <div className="demo-swap" key={view}>
              {view === 0 && (
                <VscShell act={3}
                  side={<>
                    <div className="vsc-sidehead">EXTENSIONS</div>
                    <div className="vsc-extsearch">🔍 live server</div>
                    <div className="vsc-extrow on">
                      <span className="vsc-extic">📡</span>
                      <span className="vsc-extinfo"><b>Live Server</b><i>Ritwick Dey · ⭐ 4.5</i></span>
                      <span className="vsc-extbtn">Install</span>
                    </div>
                    <div className="vsc-extrow"><span className="vsc-extic">🎨</span><span className="vsc-extinfo"><b>Prettier</b><i>{tr({ uz: 'keyinroq kerak', ru: 'пригодится позже' })}</i></span></div>
                  </>}
                  main={<div className="vsc-code" style={{ paddingTop: 20 }}><p className="vsc-note">{tr({ uz: "← Qidiruvdan toping va Install tugmasini bosing", ru: '← Найдите в поиске и нажмите Install' })}</p></div>}
                  statusRight={<>…</>}
                />
              )}
              {view === 1 && (
                <VscShell
                  title="my-site — Visual Studio Code"
                  side={<><div className="vsc-sidehead">MY-SITE</div><VscFile name="index.html" on /><VscFile name="style.css" css /></>}
                  main={<>
                    <div className="vsc-tabs"><span className="vsc-tab on"><span style={{ color: '#E37933' }}>{'<>'}</span> index.html</span></div>
                    <div className="vsc-code">
                      <VL n={7} ind={1}><Vt>&lt;body&gt;</Vt></VL>
                      <VL n={8} ind={2}><Vt>&lt;h1&gt;</Vt><span style={{ color: VSC.text }}>{tr({ uz: `Salom, men — ${nm}!`, ru: `Привет, я — ${nm}!` })}</span><Vt>&lt;/h1&gt;</Vt></VL>
                      <VL n={9} ind={1}><Vt>&lt;/body&gt;</Vt></VL>
                    </div>
                  </>}
                  statusRight={<>⚡ Go Live</>} statusPulse
                />
              )}
              {view === 2 && (
                <BrowserWin url="127.0.0.1:5500/index.html" tab={tr({ uz: 'Mening sahifam', ru: 'Моя страница' })} minH={170}>
                  <h1 className="pv-h1" style={{ padding: '18px 20px' }}>{tr({ uz: `Salom, men — ${nm}!`, ru: `Привет, я — ${nm}!` })}</h1>
                </BrowserWin>
              )}
            </div>
            {view === 1 && <p className="mono small fade-step" style={{ color: T.accent, fontWeight: 700, textAlign: 'right' }}>↑ {tr({ uz: "mana shu tugma — pastki ko'k chiziqda", ru: 'вот эта кнопка — на нижней синей полосе' })}</p>}
            {view === 2 && (
              <div className="frame-soft fade-step">
                <p className="body" style={{ margin: 0 }}>{fmtCode(tr({ uz: "🏠 `127.0.0.1` — «mening kompyuterim» degan manzil: internet emas, o'zingizniki. `5500` — port, ya'ni server ishlatadigan eshik raqami. Demak, bu sahifani hozircha faqat SIZ ko'rasiz.", ru: '🏠 `127.0.0.1` — адрес «мой компьютер»: это не интернет, а ваш собственный компьютер. `5500` — порт, номер двери сервера. Значит, эту страницу пока видите только ВЫ.' }))}</p>
              </div>
            )}
          </Col>
          <Col>
            <StepChecklist screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} steps={STEPS} taskLabel={tr({ uz: 'Live Server + Go Live', ru: 'Live Server + Go Live' })} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 8 — TEST 2 (scored): Go Live nima qiladi
// ============================================================
const ScreenTest2 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    audioText="Pastdagi Go Live tugmasi bosilganda nima bo'ladi? To'g'ri variantni tanlang."
    questionText="Pastdagi «Go Live» tugmasi bosilganda nima bo'ladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Jonli server', ru: 'Живой сервер' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: 'Pastdagi «Go Live» tugmasi bosilganda nima bo\u2019ladi?', ru: 'Что происходит, когда вы нажимаете «Go Live» внизу?' })}</h2></>}
    options={[
      { uz: "Kod internetga chiqadi — hamma ko'ra oladi", ru: 'Код попадает в интернет — увидят все' },
      { uz: 'VS Code kodni tekshirib, xatolarni topadi', ru: 'VS Code проверяет код и находит ошибки' },
      { uz: "Sahifa `127.0.0.1:5500` da jonli ochiladi", ru: 'Страница живо открывается на `127.0.0.1:5500`' },
      { uz: 'Fayl avtomatik saqlanib, yopiladi', ru: 'Файл автоматически сохраняется и закрывается' },
    ]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri. Go Live jonli serverni yoqadi: sahifa brauzerda 127.0.0.1:5500 manzilida ochiladi va har saqlashda o'zi yangilanadi.", ru: 'Верно. Go Live включает живой сервер: страница открывается в браузере на 127.0.0.1:5500 и сама обновляется при каждом сохранении.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — 127.0.0.1 faqat o'z kompyuteringiz. Internetga chiqarish alohida qadam, unga hali yetamiz.", ru: 'Нет — 127.0.0.1 это только ваш компьютер. Публикация в интернете — отдельный шаг, до него ещё дойдём.' }),
      1: tr({ uz: 'Xatolarni tekshirish — boshqa vositalar ishi. Go Live sahifani jonli serverda ochadi.', ru: 'Проверка ошибок — работа других инструментов. Go Live открывает страницу на живом сервере.' }),
      3: tr({ uz: 'Saqlash — Ctrl+S ishi. Go Live esa sahifani brauzerda jonli ochadi.', ru: 'Сохранение — работа Ctrl+S. А Go Live живо открывает страницу в браузере.' }),
      default: tr({ uz: 'Go Live sahifani 127.0.0.1:5500 manzilida jonli ochadi.', ru: 'Go Live живо открывает страницу на адресе 127.0.0.1:5500.' }),
    }} />
);

// ============================================================
//  EKRAN 9 — QADAM 5: card HTML-skeleti (bosib o'rganish → praktika)
// ============================================================
const ScreenCardHtml = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's9', text: "Endi vizitka-cardning suyagini yig'amiz. Card uch bo'lakdan iborat: logo maydoni, ism va kasb — hammasi div class card qutisida. Style css esa link tegi bilan ulanadi. Uch bo'lakni bosib o'rganing, keyin praktikada o'zingiz yig'asiz.", trigger: 'on_mount', waits_for: null }]);
  const nm = useCardName();
  const PARTS = {
    link: { name: { uz: "<link> — ko'prik", ru: '<link> — мост' }, ic: '🔗',
      body: { uz: <>Bu qator <b className="mono">head</b> ichida turadi va sahifani <b className="mono">style.css</b> bilan bog'laydi. U bo'lmasa — bezaklar sahifaga yetib bormaydi.</>, ru: <>Эта строка стоит внутри <b className="mono">head</b> и связывает страницу со <b className="mono">style.css</b>. Без неё оформление до страницы не дойдёт.</> } },
    card: { name: { uz: '<div class="card"> — quti', ru: '<div class="card"> — коробка' }, ic: '📦',
      body: { uz: <><b className="mono">div</b> — bo'laklarni guruhlab turadigan ko'rinmas quti. <b className="mono">class="card"</b> — qutining nomi: CSS keyin shu nom orqali uni topib, bezak beradi.</>, ru: <><b className="mono">div</b> — невидимая коробка, группирующая части. <b className="mono">class="card"</b> — имя коробки: CSS потом найдёт её по этому имени и оформит.</> } },
    inner: { name: { uz: "Ichki 3 bo'lak", ru: '3 части внутри' }, ic: '🧱',
      body: { uz: <>Quti ichida: <b className="mono">div class="logo"</b> — oq logo-maydon, <b className="mono">h2</b> — ismingiz, <b className="mono">p</b> — kasbingiz. Tartib muhim: logo tepada, ism o'rtada, kasb pastda.</>, ru: <>Внутри коробки: <b className="mono">div class="logo"</b> — белое поле логотипа, <b className="mono">h2</b> — ваше имя, <b className="mono">p</b> — профессия. Порядок важен: логотип сверху, имя в середине, профессия внизу.</> } },
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(() => new Set(storedAnswer?.seenIds || (storedAnswer?.correct ? Object.keys(PARTS) : [])));
  const allSeen = seen.size >= 3;
  const tap = (k) => {
    setActive(k);
    const n = new Set(seen); n.add(k); setSeen(n);
    onAnswer(screen, { correct: n.size >= 3, seenIds: [...n], picked: n.size, stage: 'exploration', screenIdx: screen });
  };
  return (
    <Stage eyebrow={tr({ uz: '5-qadam · Card HTML', ru: '5-й шаг · HTML карточки' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !allSeen} label={_isMentorLive || allSeen ? tr({ uz: 'Praktikaga →', ru: 'К практике →' }) : tr({ uz: "3 bo'lakni bosib o'rganing", ru: 'Изучите 3 части' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Card'ning <span className="italic" style={{ color: T.accent }}>suyagini</span> yig'amiz.</>, ru: <>Собираем <span className="italic" style={{ color: T.accent }}>скелет</span> карточки.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Vizitka-card — uch bo'lak: <b style={{ color: T.ink }}>logo</b>, <b style={{ color: T.ink }}>ism</b>, <b style={{ color: T.ink }}>kasb</b>. Hammasi bitta qutida. Kodda <b style={{ color: T.ink }}>3 belgilangan bo'lakni</b> bosib o'rganing — keyin praktikada o'zingiz yig'asiz.</>, ru: <>Карточка-визитка — три части: <b style={{ color: T.ink }}>логотип</b>, <b style={{ color: T.ink }}>имя</b>, <b style={{ color: T.ink }}>профессия</b>. Всё в одной коробке. Нажмите на <b style={{ color: T.ink }}>3 выделенные части</b> в коде и изучите их — потом соберёте сами в практике.</> })}</Mentor>
        <p className="sk-tapguide fade-up delay-1">👆 {tr({ uz: <>Koddagi yorqin bo'laklarni <b>bosing</b></>, ru: <>Нажимайте на яркие части кода</> })}<span className="sk-tapcount">{seen.size}/3</span></p>
        <Split>
          <Col>
            <div className="code-box fade-up delay-1" style={{ fontSize: 'clamp(12px,1.5vw,13.5px)' }}>
              <div><Tg>&lt;head&gt;</Tg></div>
              <div>{'  '}<span className={`ck cd-hot ${seen.has('link') ? 'cd-seen' : ''} ${active === 'link' ? 'active' : ''}`} onClick={() => tap('link')}><Tg>&lt;link </Tg><At>rel</At>=<Sr>"stylesheet"</Sr> <At>href</At>=<Sr>"style.css"</Sr><Tg>&gt;</Tg></span></div>
              <div><Tg>&lt;/head&gt;</Tg></div>
              <div><Tg>&lt;body&gt;</Tg></div>
              <div>{'  '}<span className={`ck cd-hot ${seen.has('card') ? 'cd-seen' : ''} ${active === 'card' ? 'active' : ''}`} onClick={() => tap('card')}><Tg>&lt;div </Tg><At>class</At>=<Sr>"card"</Sr><Tg>&gt;</Tg></span></div>
              <div style={{ display: 'inline' }}>
                <span className={`ck cd-hot ${seen.has('inner') ? 'cd-seen' : ''} ${active === 'inner' ? 'active' : ''}`} onClick={() => tap('inner')}>
                  {'    '}<Tg>&lt;div </Tg><At>class</At>=<Sr>"logo"</Sr><Tg>&gt;</Tg>&lt;/&gt;<Tg>&lt;/div&gt;</Tg>{'\n'}
                  {'    '}<Tg>&lt;h2&gt;</Tg>{nm}<Tg>&lt;/h2&gt;</Tg>{'\n'}
                  {'    '}<Tg>&lt;p&gt;</Tg>Mr.iot<Tg>&lt;/p&gt;</Tg>
                </span>
              </div>
              <div>{'  '}<Tg>&lt;/div&gt;</Tg></div>
              <div><Tg>&lt;/body&gt;</Tg></div>
            </div>
            {active && (
              <div className="sk-info fade-step" key={active}>
                <div className="sk-tagbig"><span style={{ fontSize: 20 }}>{PARTS[active].ic}</span><span className="sk-wordbadge">{tr(PARTS[active].name)}</span></div>
                <p className="body" style={{ marginTop: 8 }}>{tr(PARTS[active].body)}</p>
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label fade-up delay-2">{tr({ uz: "Hozircha shunday ko'rinadi (style.css bo'sh)", ru: 'Пока выглядит так (style.css пуст)' })}</p>
            <BrowserWin url="127.0.0.1:5500/index.html" minH={190}>
              <VCard name={nm} prof="Mr.iot" plain />
            </BrowserWin>
            <div className="hl-note fade-up delay-3"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Oddiy va rangsiz — chunki <b className="mono">style.css</b> hali bo'sh. Keyingi qadamda unga jon kiritamiz. 😉</>, ru: <>Просто и бесцветно — потому что <b className="mono">style.css</b> пока пуст. На следующем шаге вдохнём в неё жизнь. 😉</> })}</p></div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 10 — QADAM 6: card'ga CSS (interaktiv bezash → praktika)
// ============================================================
const ScreenCardCss = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's10', text: "Endi eng qiziq joyi — card'ga jon kiritamiz. To'rtta bezakni birma-bir yoqib ko'ring: yashil fon, markazlash, yumaloq burchak va soya. Har birini yoqqaningizda kod ham, natija ham o'zgaradi. Keyin praktikada o'zingiz yozasiz.", trigger: 'on_mount', waits_for: null }]);
  const nm = useCardName();
  const STEPS = [
    { id: 'bg', chip: { uz: '1 · Yashil fon', ru: '1 · Зелёный фон' }, css: 'background: #3FAE2A;', d: { uz: 'rang — yashil oiladan', ru: 'цвет — из зелёной семьи' } },
    { id: 'center', chip: { uz: '2 · Markazda', ru: '2 · По центру' }, css: 'width: 260px;  margin: 40px auto;', d: { uz: 'auto — ikki yon teng', ru: 'auto — поровну с двух сторон' } },
    { id: 'radius', chip: { uz: '3 · Yumaloq burchak', ru: '3 · Скруглённые углы' }, css: 'border-radius: 18px;', d: { uz: 'qirralar yumshaydi', ru: 'края смягчаются' } },
    { id: 'shadow', chip: { uz: '4 · Soya', ru: '4 · Тень' }, css: 'box-shadow: 0 14px 34px rgba(0,0,0,0.25);', d: { uz: 'card «ko\u2019tarilib» turadi', ru: 'карточка «приподнимается»' } },
  ];
  const [on, setOn] = useState(() => new Set(storedAnswer?.onIds || (storedAnswer?.correct ? STEPS.map(s => s.id) : [])));
  const allOn = on.size >= STEPS.length;
  const toggle = (id) => {
    const n = new Set(on);
    if (n.has(id)) n.delete(id); else n.add(id);
    setOn(n);
    onAnswer(screen, { correct: n.size >= STEPS.length, onIds: [...n], picked: n.size, stage: 'exploration', screenIdx: screen });
  };
  const flags = { bg: on.has('bg'), center: on.has('center'), radius: on.has('radius'), shadow: on.has('shadow') };
  return (
    <Stage eyebrow={tr({ uz: '6-qadam · Card CSS', ru: '6-й шаг · CSS карточки' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !allOn} label={_isMentorLive || allOn ? tr({ uz: 'Praktikaga →', ru: 'К практике →' }) : tr({ uz: '4 bezakni yoqing', ru: 'Включите 4 оформления' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Card'ga <span className="italic" style={{ color: T.accent }}>jon</span> kiritamiz.</>, ru: <>Вдыхаем в карточку <span className="italic" style={{ color: T.accent }}>жизнь</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>To'rt bezakni <b style={{ color: T.ink }}>birma-bir yoqib</b> ko'ring — har bosishda chapda CSS qatori qo'shiladi, o'ngda card o'zgaradi. Qaysi qator nimani berayotganini o'z ko'zingiz bilan ko'rasiz.</>, ru: <>Включите четыре оформления <b style={{ color: T.ink }}>по одному</b> — с каждым нажатием слева добавится строка CSS, а справа изменится карточка. Своими глазами увидите, что даёт каждая строка.</> })}</Mentor>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STEPS.map(s => (
                <button key={s.id} className={`chip ${on.has(s.id) ? 'chip-on' : ''}`} onClick={() => toggle(s.id)}>{on.has(s.id) ? '✓ ' : ''}{tr(s.chip)}</button>
              ))}
            </div>
            <div className="code-box fade-up delay-1" style={{ fontSize: 'clamp(12.5px,1.6vw,14px)' }}>
              <div><span style={{ color: '#D7BA7D' }}>.card</span> {'{'}</div>
              {STEPS.filter(s => on.has(s.id)).map(s => (
                <div key={s.id} className="fade-step">{'  '}<span style={{ color: CODE.attr }}>{s.css.split(':')[0]}</span>:<span style={{ color: CODE.str }}>{s.css.split(':').slice(1).join(':').replace(';', '')};</span> <span className="cm">{'/* '}{tr(s.d)}{' */'}</span></div>
              ))}
              {on.size === 0 && <div className="cm">{'  /* '}{tr({ uz: "bezaklarni tepadan yoqing…", ru: 'включайте оформления сверху…' })}{' */'}</div>}
              <div>{'}'}</div>
            </div>
            {allOn && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Mana bu — <b>rasmdagi card</b>! Endi praktikada shu 4 qatorni o'zingiz yozasiz, keyin VS Code'dagi style.css'ga ham ko'chirasiz.</>, ru: <>Вот она — <b>карточка с образца</b>! Теперь в практике вы напишете эти 4 строки сами, а потом перенесёте их в свой style.css в VS Code.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label fade-up delay-2">{tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</p>
            <BrowserWin url="127.0.0.1:5500/index.html" minH={230}>
              <VCard name={nm} prof="Mr.iot" flags={flags} />
            </BrowserWin>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 11 — TEST 3 (scored): CSS qanday ulanadi
// ============================================================
const ScreenTest3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    audioText="style.css'dagi bezaklar sahifaga qaysi qator orqali ulanadi? To'g'ri variantni tanlang."
    questionText="style.css'dagi bezaklar sahifaga qaysi qator orqali ulanadi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Ikki fayl do\u2019stligi', ru: 'Дружба двух файлов' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: "style.css'dagi bezaklar sahifaga qaysi qator orqali ulanadi?", ru: 'Через какую строку оформление из style.css подключается к странице?' })}</h2></>}
    options={[
      { uz: '`<link rel="stylesheet" href="style.css">` — `head` ichida', ru: '`<link rel="stylesheet" href="style.css">` — внутри `head`' },
      { uz: '`<style src="style.css">` — `body` ichida', ru: '`<style src="style.css">` — внутри `body`' },
      { uz: '`<css file="style.css">` — `head` ichida', ru: '`<css file="style.css">` — внутри `head`' },
      { uz: '`<script href="style.css">` — `body` oxirida', ru: '`<script href="style.css">` — в конце `body`' },
    ]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri. `link` tegi head ichida turadi: `rel=\"stylesheet\"` — «bu bezak fayli», `href` — fayl manzili. Shu ko'prik orqali CSS sahifaga yetib boradi.", ru: 'Верно. Тег `link` стоит внутри head: `rel="stylesheet"` — «это файл оформления», `href` — адрес файла. По этому мосту CSS доходит до страницы.' })}
    explainWrong={{
      1: tr({ uz: "`style` tegida `src` atributi ishlamaydi. CSS faylni `head` ichidagi `link` tegi ulaydi.", ru: 'У тега `style` атрибут `src` не работает. CSS-файл подключает тег `link` внутри `head`.' }),
      2: tr({ uz: "`css` degan teg mavjud emas. CSS faylni `link` tegi ulaydi.", ru: 'Тега `css` не существует. CSS-файл подключает тег `link`.' }),
      3: tr({ uz: "`script` — JavaScript uchun. CSS faylni `head` ichidagi `link` tegi ulaydi.", ru: '`script` — для JavaScript. CSS-файл подключает тег `link` внутри `head`.' }),
      default: tr({ uz: "CSS faylni `head` ichidagi `link` tegi ulaydi.", ru: 'CSS-файл подключает тег `link` внутри `head`.' }),
    }} />
);

// ============================================================
//  EKRAN 12 — SHORTCUT SANDIQCHASI (interaktiv keycap'lar)
// ============================================================
const ScreenKeys = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's12', text: "Ustalar sichqonchaga kam tegadi — tugmalar birikmasi bilan tez ishlaydi. To'rtta sehrli birikma bor: har birini bosib, nima qilishini ko'ring.", trigger: 'on_mount', waits_for: null }]);
  const KEYS = [
    { id: 'save', keys: ['Ctrl', 'S'], name: { uz: 'Saqlash', ru: 'Сохранить' }, d: { uz: "Eng muhimi! Har o'zgarishdan keyin bosing — Live Server brauzerni darhol yangilaydi.", ru: 'Самое важное! Нажимайте после каждого изменения — Live Server сразу обновит браузер.' } },
    { id: 'undo', keys: ['Ctrl', 'Z'], name: { uz: 'Bekor qilish', ru: 'Отменить' }, d: { uz: "Xato qildingizmi? Bir bosish — oxirgi harakat orqaga qaytadi. Xatodan qo'rqmang!", ru: 'Ошиблись? Одно нажатие — последнее действие откатится. Не бойтесь ошибок!' } },
    { id: 'format', keys: ['Alt', 'Shift', 'F'], name: { uz: 'Kodni tekislash', ru: 'Выровнять код' }, d: { uz: "Chalkash chekinishlarni VS Code o'zi tartibga solib beradi — kod chiroyli bo'ladi.", ru: 'VS Code сам приведёт сбитые отступы в порядок — код станет красивым.' } },
    { id: 'comment', keys: ['Ctrl', '/'], name: { uz: 'Izohga aylantirish', ru: 'Сделать комментарием' }, d: { uz: "Qatorni vaqtincha «o'chirib» qo'yadi: kod turadi, lekin ishlamaydi.", ru: 'Временно «выключает» строку: код остаётся, но не работает.' } },
  ];
  const [pressed, setPressed] = useState(() => new Set(storedAnswer?.pressedIds || (storedAnswer?.correct ? KEYS.map(k => k.id) : [])));
  const [active, setActive] = useState(null);
  const allPressed = pressed.size >= KEYS.length;
  const tap = (id) => {
    setActive(id);
    const n = new Set(pressed); n.add(id); setPressed(n);
    onAnswer(screen, { correct: n.size >= KEYS.length, pressedIds: [...n], picked: n.size, stage: 'exploration', screenIdx: screen });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Bonus · Tezkor tugmalar', ru: 'Бонус · Горячие клавиши' })} screen={screen} audioState={audio} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !allPressed} label={_isMentorLive || allPressed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: '4 birikmani bosing', ru: 'Нажмите 4 сочетания' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ustalar <span className="italic" style={{ color: T.accent }}>sandiqchasi</span> — 4 sehrli birikma.</>, ru: <><span className="italic" style={{ color: T.accent }}>Сундучок</span> мастеров — 4 волшебных сочетания.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ustalar sichqonchaga kam tegadi — <b style={{ color: T.ink }}>tugmalar birikmasi</b> bilan tez ishlaydi. Har birini <b style={{ color: T.ink }}>bosib</b>, nima qilishini ko'ring.</>, ru: <>Мастера редко трогают мышь — они работают быстро <b style={{ color: T.ink }}>сочетаниями клавиш</b>. <b style={{ color: T.ink }}>Нажмите</b> на каждое и посмотрите, что оно делает.</> })}</Mentor>
        <p className="sk-tapguide fade-up delay-1">👆 {tr({ uz: <>Birikmalarni <b>bosing</b></>, ru: <>Нажимайте на сочетания</> })}<span className="sk-tapcount">{pressed.size}/4</span></p>
        <div className="kcap-grid fade-up delay-1">
          {KEYS.map(k => (
            <button key={k.id} className={`kcap-card ${pressed.has(k.id) ? 'seen' : ''} ${active === k.id ? 'on' : ''}`} onClick={() => tap(k.id)}>
              <span className="kcap-keys">{k.keys.map((kk, i) => <React.Fragment key={i}><span className="kcap">{kk}</span>{i < k.keys.length - 1 && <b>+</b>}</React.Fragment>)}</span>
              <span className="kcap-name">{pressed.has(k.id) ? '✓ ' : ''}{tr(k.name)}</span>
            </button>
          ))}
        </div>
        {active && (
          <div className="sk-info fade-step" key={active}>
            <p className="body" style={{ margin: 0 }}><b>{tr(KEYS.find(k => k.id === active).name)}:</b> {tr(KEYS.find(k => k.id === active).d)}</p>
          </div>
        )}
        {allPressed && (
          <div className="frame-success fade-up">
            <p className="body" style={{ margin: 0 }}>{tr({ uz: <>🌐 <b>Haqiqiy hayotda sinang:</b> VS Code'da card faylingizni ochib, chekinishlarni ataylab buzing-da, <b className="mono">Alt+Shift+F</b> bosing — kod o'zi tekislanadi. Keyin <b className="mono">Ctrl+S</b> — brauzer yangilanadi.</>, ru: <>🌐 <b>Попробуйте вживую:</b> откройте файл карточки в VS Code, нарочно собейте отступы и нажмите <b className="mono">Alt+Shift+F</b> — код выровняется сам. Потом <b className="mono">Ctrl+S</b> — браузер обновится.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 13 — YAKUNIY YOZMA TEST (scored, final): Go Live
// ============================================================
const ScreenFinalTest = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's13', text: "Yakuniy savol. VS Code'ning pastki ko'k chizig'idagi qaysi tugma sahifangizni brauzerda jonli ochadi? Nomini pastdagi katakka yozing.", trigger: 'on_mount', waits_for: null }]);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === 'mentor');
  const normv = (v) => (v || '').toLowerCase().replace(/[^a-z]/g, '');
  const [val, setVal] = useState(storedAnswer?.studentAnswer ?? '');
  const correct = normv(val) === 'golive';
  const touched = val.trim().length > 0;
  useEffect(() => {
    if (correct && storedAnswer === undefined) {
      onAnswer(screen, { stage: 'final', screenIdx: screen, picked: val, question: "Jonli serverni yoqadigan tugma nomi?", correctAnswer: 'Go Live', studentAnswer: val, correct: true });
    }
  }, [correct]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy sinov', ru: 'Финальная проверка' })} screen={screen} audioState={audio} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !correct} label={isMentorLive ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (correct ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Tugma nomini yozing', ru: 'Напишите имя кнопки' }))} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>yozib</span> ko'ring.</>, ru: <>Теперь напишите <span className="italic" style={{ color: T.accent }}>сами</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yakuniy savol: VS Code'ning pastki ko'k chizig'idagi <b style={{ color: T.ink }}>qaysi tugma</b> sahifangizni brauzerda jonli ochadi? Nomini pastdagi katakka yozing.</>, ru: <>Финальный вопрос: <b style={{ color: T.ink }}>какая кнопка</b> на нижней синей полосе VS Code живо открывает вашу страницу в браузере? Напишите её имя в поле ниже.</> })}</Mentor>
        <div className="ft-statwrap fade-up delay-1">
          <div className="vsc-status ft-stat">
            <span className="vsc-st-l">⑂ main</span>
            <span className="vsc-st-r">{correct ? <>⚡ Go Live</> : <>⚡ <span className="ft-blank">— ? —</span></>}</span>
          </div>
          {!correct ? (
            <div className="ft-inputrow">
              <input className="text-input" style={{ maxWidth: 260 }} value={val} onChange={e => setVal(e.target.value)} placeholder={tr({ uz: 'tugma nomi…', ru: 'имя кнопки…' })} spellCheck={false} disabled={isMentorLive} />
              <p className="yz-hint">{touched ? tr({ uz: "Deyarli! Ikki inglizcha so'z: «jonli holatga o't» degan ma'noda.", ru: 'Почти! Два английских слова — в смысле «переходи в живой режим».' }) : tr({ uz: "Maslahat: ikki so'z, birinchisi — «Go»", ru: 'Подсказка: два слова, первое — «Go»' })}</p>
            </div>
          ) : (
            <div className="fade-step">
              <BrowserWin url="127.0.0.1:5500/index.html" minH={90}>
                <p className="yz-ok" style={{ padding: '14px 18px', margin: 0 }}>✓ {tr({ uz: "To'g'ri — Go Live! Sahifa jonli serverda ochildi.", ru: 'Верно — Go Live! Страница открылась на живом сервере.' })}</p>
              </BrowserWin>
            </div>
          )}
        </div>
        {isMentorLive && <MentorWorkStats live={live} screenIdx={screen} taskLabel={tr({ uz: '«Go Live» yozish (yakuniy)', ru: 'Написать «Go Live» (финал)' })} />}
      </div>
    </Stage>
  );
};

// ============================================================
//  EKRAN 14 — FINAL: «kompyuterimda jonli card» + tantana
// ============================================================
const ScreenFinale = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's14', text: "Qarang — bugun bosib o'tgan yo'lingiz: VS Code o'rnatildi, loyiha ochildi, jonli server ishladi va o'z cardingiz tayyor bo'ldi. Card kompyuteringizda jonli turgan bo'lsa, katta yashil tugmani bosing!", trigger: 'on_mount', waits_for: null }]);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === 'mentor');
  const nm = useCardName();
  const [confirmed, setConfirmed] = useState(!!(storedAnswer && storedAnswer.correct));
  const confirm = () => {
    if (confirmed) return;
    setConfirmed(true);
    onAnswer(screen, { correct: true, picked: 'live-card', stage: 'case', screenIdx: screen });
    if (live && live.mode === 'student') live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, 0, true, 0);
  };
  const DONE = [
    { uz: "VS Code — kompyuteringizda o'rnatilgan", ru: 'VS Code установлен на вашем компьютере' },
    { uz: 'my-site loyihasi: index.html + style.css', ru: 'Проект my-site: index.html + style.css' },
    { uz: '`!` + Tab — shablon bir soniyada', ru: '`!` + Tab — шаблон за секунду' },
    { uz: 'Go Live — jonli server 127.0.0.1:5500', ru: 'Go Live — живой сервер 127.0.0.1:5500' },
    { uz: "O'z ismingiz yozilgan yashil vizitka-card", ru: 'Зелёная карточка-визитка с вашим именем' },
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Marra', ru: 'Финиш' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={isMentorLive ? false : !confirmed} label={confirmed || isMentorLive ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Cardni tasdiqlang', ru: 'Подтвердите карточку' })} onClick={onNext} /></>}>
      <div className="screen">
        {confirmed && <Confetti />}
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qarang — hammasi <span className="italic" style={{ color: T.accent }}>sizning qo'lingizda</span>.</>, ru: <>Смотрите — всё это <span className="italic" style={{ color: T.accent }}>в ваших руках</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana bugun bosib o'tgan yo'lingiz. Card kompyuteringizda <b style={{ color: T.ink }}>jonli turgan</b> bo'lsa — katta yashil tugmani bosing. Keyin uni rangini o'zgartirib, <b className="mono" style={{ color: T.ink }}>Ctrl+S</b> bosib ko'ring: brauzer ko'z oldingizda yangilanadi.</>, ru: <>Вот путь, который вы прошли сегодня. Если карточка <b style={{ color: T.ink }}>живо стоит</b> на вашем компьютере — нажмите большую зелёную кнопку. Потом попробуйте поменять её цвет и нажать <b className="mono" style={{ color: T.ink }}>Ctrl+S</b>: браузер обновится у вас на глазах.</> })}</Mentor>
        <Split>
          <Col>
            <ul className="recipe-list fade-up delay-1">
              {DONE.map((d, i) => (
                <li key={i} className="on"><span className="recipe-num">✓</span><span className="recipe-text">{fmtCode(tr(d))}</span></li>
              ))}
            </ul>
            {!confirmed && !isMentorLive ? (
              <button className="btn fade-up delay-2" style={{ background: T.success, alignSelf: 'flex-start', fontSize: 'clamp(14px,1.8vw,16px)' }} onClick={confirm}>✓ {tr({ uz: 'Card kompyuterimda jonli turibdi!', ru: 'Карточка живо стоит на моём компьютере!' })}</button>
            ) : !isMentorLive && (
              <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>🎉 <b>Tabriklaymiz!</b> Bu — brauzer-maydonchadan professional ustaxonaga o'tgan kuningiz. Endi har darsda shu qurollar bilan ishlaymiz.</>, ru: <>🎉 <b>Поздравляем!</b> Это день, когда вы пересели с учебной площадки в профессиональную мастерскую. Теперь на каждом уроке работаем этими инструментами.</> })}</p></div>
            )}
            {isMentorLive && <MentorWorkStats live={live} screenIdx={screen} taskLabel={tr({ uz: 'Jonli cardni tasdiqlash', ru: 'Подтверждение живой карточки' })} />}
          </Col>
          <Col>
            <p className="flow-label fade-up delay-2">{tr({ uz: 'Sizning natijangiz', ru: 'Ваш результат' })}</p>
            <BrowserWin url="127.0.0.1:5500/index.html" tab={tr({ uz: 'Mening cardim', ru: 'Моя карточка' })} minH={230}>
              <VCard name={nm} prof="Mr.iot" anim={confirmed} />
            </BrowserWin>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== EKRAN — FLASHCARDS (takrorlash; jonlida faqat mentorga) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: "Darsni yakunlashdan oldin bugungi atamalarni tez takrorlaymiz. Har kartada bitta vazifa — javobni o'ylang, keyin kartani bosib tekshiring.", trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Atamalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим термины</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugungi atamalarni takrorlaymiz. Har kartada bitta vazifa — javobni o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед завершением урока повторим сегодняшние термины. На каждой карточке — задание: подумайте над ответом, потом нажмите на карточку и проверьте. Оцените себя кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={VSCODE_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== EKRAN — YAKUN (summary) =====
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (_live && _live.quiz && _live.quiz.state) || 'off';
  const isStudentL = _live && _live.mode === 'student';
  const isMentorL = _live && _live.mode === 'mentor';
  const classOver = !!(_live && (_live.status === 'ended' || !_live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const audio = useAudio([{ id: 's16', text: "Dars yakunlandi. Endi kompyuteringizda professional ustaxona bor: VS Code, jonli server va o'z cardingiz. Asosiyni eslab qoling: har loyiha — alohida papka, Go Live — jonli ko'rish, Ctrl+S — saqlash.", trigger: 'on_mount', waits_for: null }]);
  const RECAP = [
    tr({ uz: "VS Code'ni o'rnatish va sozlash", ru: 'Устанавливать и настраивать VS Code' }),
    tr({ uz: 'Loyiha papkasi va fayllar yaratish', ru: 'Создавать папку проекта и файлы' }),
    tr({ uz: '! + Tab bilan tayyor shablon olish', ru: 'Получать готовый шаблон через ! + Tab' }),
    tr({ uz: "Live Server bilan sahifani jonli ko'rish", ru: 'Живо смотреть страницу через Live Server' }),
    tr({ uz: 'Vizitka-card yasab, CSS bilan bezash', ru: 'Делать карточку-визитку и оформлять её CSS' }),
  ];
  const HOMEWORK = [
    { b: tr({ uz: "Hobbi ro'yxati", ru: 'Список хобби' }), t: tr({ uz: "— card ichiga `ul`/`li` bilan 3 ta hobbi", ru: '— 3 хобби внутри карточки через `ul`/`li`' }) },
    { b: tr({ uz: 'Havola', ru: 'Ссылка' }), t: tr({ uz: "— Telegram yoki sevimli saytingizga `a href`", ru: '— `a href` на Telegram или любимый сайт' }) },
    { b: tr({ uz: 'Rang tajribasi', ru: 'Эксперимент с цветом' }), t: tr({ uz: "— fonni boshqa rangga o'zgartirib ko'ring", ru: '— попробуйте другой цвет фона' }) },
    { b: tr({ uz: 'Sahifa nomi', ru: 'Имя страницы' }), t: tr({ uz: "— `title` ichiga ismingizni yozing", ru: '— напишите своё имя в `title`' }) },
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Keyingi dars →', ru: 'Следующий урок →' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi sizda <span className="italic" style={{ color: T.accent }}>professional qurol</span> bor.</>, ru: <>Теперь у вас есть <span className="italic" style={{ color: T.accent }}>профессиональный инструмент</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Kompyuteringizda VS Code, jonli server va o'z cardingiz ishlab turibdi.", ru: 'Поздравляем! На вашем компьютере работают VS Code, живой сервер и ваша карточка.' }) : tr({ uz: "Yaxshi harakat! Bir-ikki joyni mustahkamlash uchun darsni qayta ko'ring.", ru: 'Хорошая попытка! Пересмотрите урок, чтобы закрепить пару мест.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark
            stats={false}
            disabled={studentWait}
            liveOn={studentLive}
            onClick={studentWait ? undefined : openArena}
            hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined}
          />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы умеете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Cardingizni VS Code'da boyiting:", ru: 'Обогатите свою карточку в VS Code:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{fmtCode(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Har o'zgarishdan keyin Ctrl+S bosing — brauzer o'zi yangilanadi. Tayyor bo'lsa keyingi darsga cardingiz bilan keling — mentor jonli ko'radi.", ru: 'После каждого изменения нажимайте Ctrl+S — браузер обновится сам. Когда будет готово, приходите на следующий урок со своей карточкой — ментор посмотрит вживую.' })}</p></div>
        </div>
        {/* 🏠 UYGA VAZIFA — amaliy topshiriq kompilyatorda bajariladi. Mentor proyektorida
            KO'RSATILMAYDI: uy ishi shaxsiy (sahna ↔ daftar tamoyili). */}
        {!isMentorL && onHomework && (
          <div className="hw-big-wrap fade-up d4">
            <button className="hw-big" onClick={onHomework}>
              <span className="hw-big-shine" aria-hidden="true" />
              <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
              <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni boshlash →', ru: 'Начать практическое задание →' })}</span>
            </button>
          </div>
        )}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz', ru: 'Ваши значки' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};

// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = {
  4: { uz: 'Explorer — fayllar paneli', ru: 'Explorer — панель файлов' },
  8: { uz: 'Go Live nima qiladi', ru: 'Что делает Go Live' },
  11: { uz: 'CSS ulanishi (link)', ru: 'Подключение CSS (link)' },
  13: { uz: '«Go Live» yozish (yakuniy)', ru: 'Написать «Go Live» (финал)' },
};

const Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, '#FFD380', '#FF7755', '#7DD181'];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 44 }).map((_, i) => {
        const left = (i * 2.31 + (i % 7) * 4) % 100;
        const size = 6 + (i % 4) * 2;
        return (
          <span key={i} className="confetti-bit" style={{
            left: `${left}%`, background: COLORS[i % COLORS.length],
            width: size, height: size * 1.5,
            animationDelay: `${(i % 11) * 0.16}s`,
            animationDuration: `${2.4 + (i % 6) * 0.45}s`,
            borderRadius: i % 2 ? '2px' : '50%'
          }} />
        );
      })}
    </div>
  );
};

const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!isLive || !livePin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [p, a] = await Promise.all([livePlayers(livePin), liveAnswers(livePin)]);
        if (on) { setPlayers(p); setRows(a); setLoaded(true); }
      } catch {}
      if (on) t = setTimeout(tick, 3000); // kech qo'shilganlar ham jonli ko'rinadi
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, livePin]);

  const totalQ = SCORED_IDX.length;
  const board = players.map(p => {
    // FAQAT baholanadigan testlar hisoblanadi — checklist/praktika «tugatdi» belgilari
    // reytingga aralashmasin (u faqat MentorWorkStats uchun yoziladi)
    const mine = rows.filter(a => a.player_id === p.id && SCORED_IDX.includes(a.screen_idx));
    const okCount = mine.filter(a => a.correct).length;
    const time = mine.reduce((s, a) => s + (a.elapsed_ms || 0), 0);
    return { id: p.id, nickname: p.nickname, okCount, time };
  }).sort((x, y) => y.okCount - x.okCount || x.time - y.time);
  const fmtT = (ms) => `${(ms / 1000).toFixed(1)}s`;
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter(i => answers[i]?.correct).length;

  return (
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
        ) : (
          <>
            <Confetti />
            {/* Podium — 2-1-3 tartibida (o'rtada g'olib, balandroq) */}
            <div className="pod-stage fade-up">
              {[1, 0, 2].map(rank => {
                const b = top3[rank];
                return (
                  <div key={rank} className={`pod-col pod-${rank + 1} ${b && live.playerId === b.id ? 'me' : ''}`}>
                    <span className="pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : '—'}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ} · {fmtT(b.time)}</span>}
                    <div className="pod-bar" />
                  </div>
                );
              })}
            </div>
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr({ uz: "To'liq reyting", ru: 'Полный рейтинг' })}</div>
              <div className="pod-list">
                {board.map((b, i) => (
                  <div key={b.id} className={`pod-row ${live.playerId === b.id ? 'me' : ''}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map(q => { const a = rows.find(r => r.player_id === b.id && r.screen_idx === q); return <span key={q} className={`pod-dot ${a ? (a.correct ? 'ok' : 'bad') : ''}`} title={tr(Q_LABELS[q])} />; })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Savollar bo'yicha — qaysi mavzu qiyin bo'ldi */}
            <div className="card fade-up d2">
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr({ uz: "Savollar bo'yicha", ru: 'По вопросам' })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map(q => {
                  const qa = rows.filter(r => r.screen_idx === q);
                  const okN = qa.filter(r => r.correct).length;
                  const pct = qa.length ? Math.round((okN / qa.length) * 100) : 0;
                  const hard = qa.length >= 2 && pct < 50;
                  return (
                    <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{tr(Q_LABELS[q]) || `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы со значком ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== ⚡ CODESTRIKE (CoddyCamp jonli test arenasi) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];

// Arena foni: suzuvchi kod tokenlari — bugungi dars atamalari (VS Code muhiti)
const QZ_BG_SHAPES = [
  { ch: 'VS',      l: 6,  t: 18, s: 40, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'Go Live', l: 80, t: 12, s: 30, c: 'rgba(120,235,175,0.14)', d: 23, dl: 1.5 },
  { ch: '!',       l: 9,  t: 74, s: 34, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: '.css',    l: 78, t: 70, s: 28, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: 'Ctrl+S',  l: 44, t: 86, s: 26, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '5500',    l: 66, t: 24, s: 22, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: 'Tab',     l: 24, t: 36, s: 26, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: '</>',     l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: '.html',   l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Dunyodagi dasturchilar eng ko'p ishlatadigan kod-muharrir qaysi?", ru: 'Каким редактором кода пользуется больше всего разработчиков в мире?' }, opts: ['Word', 'VS Code', 'Photoshop', 'Paint'], correct: 1 },
  { q: { uz: 'VS Code qaysi saytdan yuklab olinadi?', ru: 'С какого сайта скачивается VS Code?' }, opts: ['`code.visualstudio.com`', '`vscode-download.net`', '`microsoft-code.uz`', '`get-vscode.org`'], correct: 0 },
  { q: { uz: "Loyihadagi fayllar ro'yxati ko'rinadigan chap panel qanday ataladi?", ru: 'Как называется левая панель со списком файлов проекта?' }, opts: [{ uz: 'Terminal', ru: 'Terminal' }, { uz: 'Extensions', ru: 'Extensions' }, { uz: 'Explorer', ru: 'Explorer' }, { uz: 'Status bar', ru: 'Status bar' }], correct: 2 },
  { q: { uz: 'Live Server nima?', ru: 'Что такое Live Server?' }, opts: [{ uz: 'Rasm tahrirlaydigan vosita', ru: 'Инструмент для правки картинок' }, { uz: 'Kod saqlaydigan xotira turi', ru: 'Вид памяти для хранения кода' }, { uz: "Shrift o'rnatadigan dastur", ru: 'Программа для установки шрифтов' }, { uz: 'Sahifani jonli ochadigan kengaytma', ru: 'Расширение, открывающее страницу вживую' }], correct: 3 },
  { q: { uz: '«Go Live» tugmasi VS Code oynasining qayerida turadi?', ru: 'Где в окне VS Code находится кнопка «Go Live»?' }, opts: [{ uz: 'Yuqoridagi menyu qatorida', ru: 'В строке меню сверху' }, { uz: "Pastki ko'k chiziqda (status bar)", ru: 'На нижней синей полосе (status bar)' }, { uz: 'Explorer panelining ichida', ru: 'Внутри панели Explorer' }, { uz: "Sichqoncha o'ng tugma menyusida", ru: 'В меню правой кнопки мыши' }], correct: 1 },
  { q: { uz: '`127.0.0.1` manzili nimani bildiradi?', ru: 'Что означает адрес `127.0.0.1`?' }, opts: [{ uz: 'Internetdagi katta serverni', ru: 'Большой сервер в интернете' }, { uz: "Google'ning bosh sahifasini", ru: 'Главную страницу Google' }, { uz: "O'z kompyuteringizni", ru: 'Ваш собственный компьютер' }, { uz: 'Uydagi Wi-Fi routerni', ru: 'Домашний Wi-Fi роутер' }], correct: 2 },
  { q: { uz: '`127.0.0.1:5500` dagi 5500 raqami nima?', ru: 'Что за число 5500 в `127.0.0.1:5500`?' }, opts: [{ uz: 'Port — server eshigining raqami', ru: 'Порт — номер двери сервера' }, { uz: 'Sahifadagi belgilar soni', ru: 'Число символов на странице' }, { uz: 'Koddagi qatorlar soni', ru: 'Число строк в коде' }, { uz: 'Kirish uchun parol raqami', ru: 'Числовой пароль для входа' }], correct: 0 },
  { q: { uz: "Bo'sh index.html'da tayyor HTML shablonni nima chiqaradi?", ru: 'Что выдаёт готовый HTML-шаблон в пустом index.html?' }, opts: ['`?` + Enter', '`#` + Space', '`*` + Shift', '`!` + Tab'], correct: 3 },
  { q: { uz: '`Ctrl + S` birikmasi nima qiladi?', ru: 'Что делает сочетание `Ctrl + S`?' }, opts: [{ uz: 'Faylni saqlaydi', ru: 'Сохраняет файл' }, { uz: "Faylni o'chiradi", ru: 'Удаляет файл' }, { uz: 'Yangi fayl ochadi', ru: 'Открывает новый файл' }, { uz: 'Kodni nusxalaydi', ru: 'Копирует код' }], correct: 0 },
  { q: { uz: "Yangi kengaytma (extension) qayerdan o'rnatiladi?", ru: 'Откуда устанавливается новое расширение (extension)?' }, opts: [{ uz: 'Explorer panelidan', ru: 'Из панели Explorer' }, { uz: 'Terminal oynasidan', ru: 'Из окна терминала' }, { uz: "Status bar'dagi tugmadan", ru: 'С кнопки на status bar' }, { uz: "Extensions bo'limidan", ru: 'Из раздела Extensions' }], correct: 3 },
  { q: { uz: 'style.css sahifaga qaysi teg bilan ulanadi?', ru: 'Каким тегом style.css подключается к странице?' }, opts: ['`<style src="style.css">`', '`<link rel="stylesheet">`', '`<css href="style.css">`', '`<script src="style.css">`'], correct: 1 },
  { q: { uz: "Loyiha papkasi VS Code'da qanday ochiladi?", ru: 'Как открыть папку проекта в VS Code?' }, opts: ['Edit → Copy Folder', 'View → Show Folder', 'File → Open Folder', 'Help → Load Folder'], correct: 2 },
];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
// Bitta o'yinchining barcha javoblaridan yakuniy hisob (hamma klientda bir xil chiqadi)
const quizScore = (rows) => {
  const byQ = {};
  rows.forEach(r => { byQ[r.screen_idx - QUIZ_BASE_IDX] = r; });
  let pts = 0, streak = 0, maxStreak = 0, ok = 0;
  for (let i = 0; i < QUIZ_BANK.length; i++) {
    const a = byQ[i];
    if (a && a.correct) { streak++; maxStreak = Math.max(maxStreak, streak); ok++; pts += quizPts(a.elapsed_ms) + (streak >= 2 ? 100 : 0); }
    else streak = 0;
  }
  return { pts, ok, maxStreak };
};

// Aylana taymer — vaqt kamaygani sari yashil → sariq → qizil
function QzTimer({ remaining }) {
  const R = 26, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, remaining / QUIZ_MS));
  const sec = Math.ceil(remaining / 1000);
  const col = remaining > 10000 ? '#2BD97C' : remaining > 5000 ? '#FFC94D' : '#FF5A5A';
  return (
    <div className={`qz-timer ${remaining <= 5000 && remaining > 0 ? 'urgent' : ''}`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.4s' }} />
      </svg>
      <span className="qz-timer-n" style={{ color: col }}>{sec}</span>
    </div>
  );
}

// ⚡ CodeStrike chaqmoq mascot (brend belgisi)
const QzBolt = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="qz-bolt">
    <defs><linearGradient id="qzbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#FF4F28" /></linearGradient></defs>
    <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#qzbg)" />
    <path d="M56 12 L28 54 L45 54 L38 88 L72 40 L53 40 Z" fill="#fff" stroke="#E23A16" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="76" cy="24" r="3.5" fill="#FFD9A8" /><circle cx="22" cy="72" r="2.6" fill="#FFD9A8" /><circle cx="80" cy="66" r="2.2" fill="#FFD9A8" />
  </svg>
);

// ⚡ Neon chaqmoq (kapsula yon belgilari) — uchqunlari hover'da sachraydi
const CsNeonBolt = ({ flip }) => (
  <span className={`csn-boltwrap ${flip ? 'flip' : ''}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>
);

// ⚡ CODE STRIKE — neon-kapsula (CTA'da bosiladi, lobbyda brend-lavha).
// Ichida DARSNING O'Z QZ_BG_SHAPES tokenlari suzadi — har dars kapsulaga o'z «DNK»sini beradi.
// Holatlar: oddiy (yonib turadi) · cs-off (mentor kutilmoqda, xira) · cs-live (jonli ochiq, LIVE nuqta).
const CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true); // portal-zaryad: cho'qqisida arena ochiladi, flash arena ustida so'nadi
    setTimeout(onClick, 430);
    setTimeout(() => setCharge(false), 900);
  };
  return (
    <div
      className={`cs-cap ${clickable ? 'cs-clickable' : ''} ${disabled ? 'cs-off' : ''} ${liveOn ? 'cs-live' : ''} ${charge ? 'cs-charging' : ''}`}
      {...(clickable ? { role: 'button', tabIndex: 0, onClick: fire, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } } } : {})}
    >
      <span className="cs-ring" aria-hidden="true" />
      <div className="cs-sky" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className={`cs-tok ${i % 2 ? 'back' : 'front'}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, '--d': `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{s.ch}</span>
        ))}
        {[[14, 30, 24], [38, 66, 15], [57, 20, 27], [76, 60, 18], [88, 36, 13]].map(([l, t, w], i) => (
          <i key={i} className="cs-dash" style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `-${i * 1.7}s` }} />
        ))}
        <span className="cs-thunder" />
      </div>
      <div className="cs-row">
        {bolt && <CsNeonBolt />}
        <div className="cs-word" data-text="CODE STRIKE" aria-label="CodeStrike">CODE STRIKE</div>
        {bolt && <CsNeonBolt flip />}
      </div>
      {stats && (
        <div className="cs-hud">
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr({ uz: 'SAVOL', ru: 'ВОПРОСОВ' })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1000}</b> {tr({ uz: 'SONIYA', ru: 'СЕКУНД' })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">🏆 {tr({ uz: 'PODIUM', ru: 'ПОДИУМ' })}</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + kod tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['Go Live', '!', 'Tab', 'Ctrl+S', '.html', '.css', '127.0.0.1', '5500'];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: TOK[i % TOK.length], r: (Math.random() - .5) * .5 });
    const draw = (tm) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of em) { p.y -= (.15 + p.z * .35) * DPR; p.x += Math.sin(tm / 1400 + p.ph) * p.sw * DPR * .35; if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; } }
      ctx.lineWidth = 1 * DPR;
      for (let a = 0; a < em.length; a++) for (let b = a + 1; b < em.length; b++) { const dx = em[a].x - em[b].x, dy = em[a].y - em[b].y, d = Math.sqrt(dx * dx + dy * dy), mx = 95 * DPR; if (d < mx) { ctx.strokeStyle = 'rgba(150,95,255,' + (.11 * (1 - d / mx)) + ')'; ctx.beginPath(); ctx.moveTo(em[a].x, em[a].y); ctx.lineTo(em[b].x, em[b].y); ctx.stroke(); } }
      for (const p of em) { const s = (1.3 + p.z * 2.2) * DPR, tw = .22 + p.z * .3 + Math.sin(tm / 600 + p.ph) * .1; ctx.fillStyle = 'rgba(205,175,255,' + tw + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 6.29); ctx.fill(); }
      for (const t of toks) { t.x += t.vx * DPR; t.y -= (.08 + t.z * .12) * DPR; if (t.y < -34) t.y = H + 34; if (t.x < -50) t.x = W + 50; if (t.x > W + 50) t.x = -50; ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.r * .12); ctx.font = '700 ' + ((13 + t.z * 22) * DPR) + 'px "JetBrains Mono",monospace'; ctx.fillStyle = 'rgba(190,150,255,' + (.05 + t.z * .07) + ')'; ctx.textAlign = 'center'; ctx.fillText(t.t, 0, 0); ctx.restore(); }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="qz-fx" aria-hidden="true" />;
}

function QuizArena({ live, onClose, startSolo }) {
  const isMentor = live.mode === 'mentor';
  const isStudent = live.mode === 'student';
  // solo: self rejim YOKI mashq (dars tugagach o'quvchi uyda qayta ishlashi) —
  // taymer/savollar bir xil, lekin serverga yozilmaydi, faqat o'z natijasi ko'rinadi
  const [soloMode, setSoloMode] = useState(!!startSolo);
  const solo = soloMode || (!isMentor && !isStudent);
  const soloRef = useRef(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState('lobby'); // lobby | q | reveal | done
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({}); // {qi: {picked, correct, elapsed}}
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false); // jonli dars tugadi — qutqaruv banneri
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // O'quvchi sahifani yangilagan bo'lsa — o'z javoblarini serverdan tiklaymiz
  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

  // Jonli sinxron: 1.2s polling — savol/natija/yakun fazalari serverdan keladi.
  useEffect(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return; // mashqqa o'tildi — server bilan ishlamaymiz
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || 'off', q = row.quiz_q ?? -1;
          if (st === 'q' && q !== seenQRef.current) {
            seenQRef.current = q; qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700); // polling kechikish kompensatsiyasi
            setQi(q); setRemaining(deadlineRef.current - Date.now()); setPhase('q'); setAnsweredN(0);
          } else if (st === 'r') {
            if (q !== seenQRef.current) { seenQRef.current = q; setQi(q); } // kech kirgan ham natijani ko'radi
            setPhase(p => p === 'done' ? p : 'reveal');
          }
          else if (st === 'done') { setPhase('done'); }
        }
        // Fetch-fazani SERVER holatidan hisoblaymiz — reveal'ga o'tgan ZAHOTI natijalar yuklanadi
        const st1 = row ? (row.quiz_state || 'off') : null;
        const ph = st1 === 'r' ? 'reveal' : st1 === 'done' ? 'done' : st1 === 'lobby' ? 'lobby' : st1 === 'q' ? 'q' : phaseRef.current;
        if (on) setClassEnded(!row || row.status === 'ended');
        // phaseRef sharti — himoya: lokal reveal (taymer tugagan), server hali 'q' bo'lsa ham natijalar yuklanadi
        if (ph === 'lobby' || ph === 'reveal' || ph === 'done' || phaseRef.current === 'reveal') {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on) { setPlayers(pl); setQRows(qa); }
        } else if (ph === 'q' && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on) { setPlayers(pl); setAnsweredN(qa.length); }
        }
      } catch {}
      if (on) t = setTimeout(tick, 1200);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, []); // eslint-disable-line

  // Taymer — 100ms aniqlikda; vaqt tugasa javob ochiladi.
  // MENTOR: serverni ham 'r' ga o'tkazamiz — aks holda server 'q'ligicha qolib,
  // poll natijalarni yuklamaydi va hisoblagichlar/TOP-5 nolda qotib qolardi.
  useEffect(() => {
    if (phase !== 'q') return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase('reveal');
        if (isMentor && !soloRef.current) ctrl('r', seenQRef.current); // Kahoot: vaqt tugadi — natija hammaga ochiladi
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]); // eslint-disable-line

  // Mentor boshqaruvi (optimistik lokal o'tish + server)
  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === 'q') { seenQRef.current = q; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(q); setRemaining(QUIZ_MS); setPhase('q'); setAnsweredN(0); }
      else if (state === 'r' || state === 'done') {
        setPhase(state === 'r' ? 'reveal' : 'done');
        // Natijalarni DARHOL yuklaymiz — hisoblagichlar bo'sh turmaydi
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => { setPlayers(pl); setQRows(qa); }).catch(() => {});
      }
    } catch {}
  };
  // Solo boshqaruvi
  const soloStart = (i) => { seenQRef.current = i; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(i); setRemaining(QUIZ_MS); setPhase('q'); };
  const soloNext = () => { const n = qi + 1; if (n >= QUIZ_BANK.length) setPhase('done'); else soloStart(n); };
  const soloReplay = () => { setMyAnswers({}); soloStart(0); };
  // Jonli test tugagach «qayta ishlash» — mashq rejimiga o'tish (serverga yozilmaydi)
  const startPractice = () => { setSoloMode(true); setMyAnswers({}); soloStart(0); };

  const answer = (i) => {
    if (phase !== 'q' || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers(m => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase('reveal'); // yolg'iz o'yinda javob darhol ochiladi
  };

  // Joriy streak (shu savolgacha ketma-ket to'g'ri)
  const streakUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0); };

  // Reyting (jonli) / solo hisob
  const board = players.map(p => { const s = quizScore(qRows.filter(r => r.player_id === p.id)); return { id: p.id, nickname: p.nickname, ...s }; }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: 'me', screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);

  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  // Hisoblagichlar: server qatorlari + O'Z javobim hali kelmagan bo'lsa lokal qo'shiladi
  const counts = Q ? Q.opts.map((_, i) => {
    if (solo) return myAnswers[qi]?.picked === i ? 1 : 0;
    let n = qRows.filter(r => r.screen_idx === QUIZ_BASE_IDX + qi && r.picked === i).length;
    const mine = myAnswers[qi];
    if (mine && mine.picked === i && live.playerId && !qRows.some(r => r.player_id === live.playerId && r.screen_idx === QUIZ_BASE_IDX + qi)) n++;
    return n;
  }) : [];
  const lastQ = qi >= QUIZ_BANK.length - 1;
  const my = qi >= 0 ? myAnswers[qi] : null;

  // Mentor test o'rtasida ✕ bossa — ogohlantiramiz: sinf arenada kutib qoladi.
  const closeArena = () => {
    if (isMentor && !solo && phase !== 'done') {
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {/* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */}
      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>⚠️ {tr({ uz: "Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: 'Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Ждите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr({ uz: 'Boshlash', ru: 'Начать' })}</button>}
        </div>
      )}

      {/* ===== SAVOL ===== */}
      {phase === 'q' && Q && (
        <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor
              ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span>
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : ' '}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(tr(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const pickedThis = my && my.picked === i;
              return (
                <button key={i} className={`qz-tile ${my ? (pickedThis ? 'picked' : 'faded') : ''}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>
              );
            })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr({ uz: 'Javob qabul qilindi — natijani kuting…', ru: 'Ответ принят — ждите результат…' })}</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr({ uz: 'Hamma javob berdi!', ru: 'Все ответили!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>⏹ {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>
            </div>
          )}
        </div>
      )}

      {/* ===== NATIJA (reveal) ===== */}
      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr({ uz: 'natija', ru: 'результат' })}</span>
          </div>
          <h2 className="qz-q">{fmtCode(tr(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const win = i === Q.correct;
              const pickedThis = my && my.picked === i;
              return (
                <div key={i} className={`qz-tile rv ${win ? 'win' : 'lose'} ${pickedThis ? 'picked' : ''}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  <span className="qz-cnt">{win ? '✓ ' : ''}{counts[i]}</span>
                </div>
              );
            })}
          </div>
          {!isMentor && (
            <div className={`qz-res ${my?.correct ? 'good' : 'bad'}`}>
              {my?.correct
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">🏆 {tr({ uz: 'TOP-5', ru: 'ТОП-5' })}</div>
              {board.slice(0, 5).map((b, i) => (
                <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>
              ))}
            </div>
          )}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : ctrl('q', qi + 1)}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {/* ===== YAKUN — PODIUM ===== */}
      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: 'clamp(20px,3.4vw,30px)' }}>{tr({ uz: 'Test yakunlandi!', ru: 'Тест завершён!' })} 🎉</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ''}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верных${soloScore.maxStreak >= 2 ? ` · лучший стрик 🔥x${soloScore.maxStreak}` : ''}` })}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr({ uz: 'Qayta ishlash', ru: 'Пройти ещё раз' })}</button>
            </div>
          ) : (
            <>
              <div className="qz-pod">
                {[1, 0, 2].map(rank => {
                  const b = board[rank];
                  return (
                    <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? 'me' : ''}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : '—'}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: 'ball', ru: 'баллов' })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => (
                  <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>
                ))}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  PRAKTIKA — KOD COMPILATOR (Htmllesson1 bilan bir xil mexanizm)
//  Har praktika PRACTICE_AFTER[screenIdx] orqali shu ekrandan KEYIN ochiladi.
//  Indekslar — screens[] massividagi o'rin:
//    7 = s7 (Live Server + h1 ism) · 9 = s9 (card HTML) · 10 = s10 (card CSS)
// ============================================================

// — P1: ism sahifasi (s7 — Live Server'da h1 yozildi — endi shu yerda ball uchun) —
const TASK_NAME = {
  eyebrow: { uz: 'Praktika · birinchi sahifa', ru: 'Практика · первая страница' },
  title: { uz: "VS Code'da qilganingizni qaytaring", ru: 'Повторите то, что сделали в VS Code' },
  brief: {
    uz: "Hozirgina VS Code'da h1 ichiga ismingizni yozdingiz. Endi xuddi shuni shu yerda ham yozing — jonli ball olasiz. Har shart bajarilganda yashil ✓ yonadi.",
    ru: 'Только что вы написали своё имя внутри h1 в VS Code. Теперь напишите то же самое здесь — получите живой балл. За каждое условие загорается зелёная ✓.',
  },
  requirements: [
    { id: 'h1', label: { uz: '<h1> — ismingiz (matn bilan)', ru: '<h1> — ваше имя (с текстом)' }, check: C.text('h1', { uz: "`<h1>` ichiga ismingizni yozing", ru: 'Напишите своё имя внутри `<h1>`' }) },
    { id: 'p', label: { uz: "<p> — o'zingiz haqingizda bir gap", ru: '<p> — одно предложение о себе' }, check: C.text('p', { uz: "`<h1>` ostiga `<p>` bilan bir gap qo'shing", ru: 'Добавьте под `<h1>` одно предложение в `<p>`' }) },
  ],
};
const STARTER_NAME = {
  uz: `<!-- Bu yerga yozing -->
`,
  ru: `<!-- Пишите здесь -->
`,
};

// — P2: card HTML-skeleti (s9 — Card'ning suyagi — dan keyin) —
const TASK_CARD = {
  eyebrow: { uz: 'Praktika · card HTML', ru: 'Практика · HTML карточки' },
  title: { uz: "Vizitka-card suyagini yig'ing", ru: 'Соберите скелет карточки-визитки' },
  brief: {
    uz: "Card uch bo'lakdan iborat: logo maydoni, ism va kasb — hammasi bitta qutida. Yig'ib bo'lgach, xuddi shu kodni VS Code'dagi index.html'ingizga ham yozing.",
    ru: 'Карточка состоит из трёх частей: поле логотипа, имя и профессия — всё в одной коробке. Когда соберёте, напишите этот же код и в своём index.html в VS Code.',
  },
  requirements: [
    { id: 'card', label: { uz: '<div class="card"> — quti', ru: '<div class="card"> — коробка' }, check: C.has('.card', { uz: '`<div class="card">` qutisini oching va yoping', ru: 'Откройте и закройте коробку `<div class="card">`' }) },
    { id: 'logo', label: { uz: 'quti ichida <div class="logo">', ru: 'внутри коробки <div class="logo">' }, check: C.nested('.card', '.logo', { uz: "`.card` ichiga `<div class=\"logo\">&lt;/&gt;</div>` maydonini joylang", ru: 'Поместите внутрь `.card` поле `<div class="logo">&lt;/&gt;</div>`' }) },
    { id: 'h2', label: { uz: 'quti ichida <h2> — ism', ru: 'внутри коробки <h2> — имя' }, check: C.nested('.card', 'h2', { uz: "`.card` ichiga `<h2>` bilan ismingizni yozing", ru: 'Напишите внутри `.card` своё имя в `<h2>`' }) },
    { id: 'prof', label: { uz: 'quti ichida <p> — kasb', ru: 'внутри коробки <p> — профессия' }, check: C.nested('.card', 'p', { uz: "`.card` ichiga `<p>` bilan kasbingizni yozing (masalan: Frontend developer)", ru: 'Напишите внутри `.card` профессию в `<p>` (например: Frontend developer)' }) },
  ],
};
const STARTER_CARD = {
  uz: `<!-- Bu yerga yozing -->
`,
  ru: `<!-- Пишите здесь -->
`,
};

// — P3: card CSS (s10 — Card'ga jon kiritamiz — dan keyin; 2 fayl) —
// Yashil oila tekshiruvi: aniq rang majburlanmaydi — nomida "green" bo'lsa yoki
// hex/rgb qiymatida yashil ulushi eng katta bo'lsa o'tadi (topilmasa — xossa bo'lsa yetadi).
const isGreenish = (v) => {
  const s = (v || '').toLowerCase();
  if (!s) return false;
  if (s.includes('green')) return true;
  const hex = s.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return g > r && g > b;
  }
  const rgb = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) { const r = +rgb[1], g = +rgb[2], b = +rgb[3]; return g > r && g > b; }
  return true; // o'qiy olmadik (masalan gradient) — qattiq majburlamaymiz
};
const TASK_STYLE = {
  eyebrow: { uz: 'Praktika · card CSS', ru: 'Практика · CSS карточки' },
  title: { uz: "Card'ga stil bering — natija rasmdagidek", ru: 'Оформите карточку — результат как на образце' },
  brief: {
    uz: "index.html tayyor — unga tegmang. style.css'da .card selektoriga 4 ta bezak yozing. Tayyor bo'lgach, xuddi shu CSS'ni VS Code'dagi style.css'ga ham yozing — Ctrl+S bosishingiz bilan brauzeringiz yangilanadi!",
    ru: 'index.html готов — его не трогайте. В style.css напишите 4 оформления для селектора .card. Когда получится, напишите этот же CSS и в своём style.css в VS Code — нажмёте Ctrl+S, и браузер обновится!',
  },
  files: [
    {
      name: 'index.html', lang: 'html', starter: `<div class="card">
  <div class="logo" style="background:#fff; border-radius:14px; padding:18px; text-align:center; font-weight:800; font-size:26px; color:#3FAE2A; font-family:Arial">&lt;/&gt;</div>
  <h2 style="text-align:center; color:#1E7BD7; margin:14px 0 4px">Boburjon</h2>
  <p style="text-align:center; color:#14301a; margin:0">Mr.iot</p>
</div>
`,
    },
    {
      name: 'style.css', lang: 'css', starter: `/* Bu yerga yozing */
`,
    },
  ],
  requirements: [
    { id: 'bg', label: { uz: '.card — yashil fon (background)', ru: '.card — зелёный фон (background)' }, check: C.custom((x) => {
      const rule = x.cssRules.find(r => r.selector.split(',').map(s => s.trim()).includes('.card'));
      if (!rule) return tr({ uz: "style.css'da `.card { ... }` qoidasini oching", ru: 'Откройте правило `.card { ... }` в style.css' });
      const v = rule.props['background'] || rule.props['background-color'];
      if (!v) return tr({ uz: "`.card` ichiga `background` xossasini yozing", ru: 'Напишите свойство `background` внутри `.card`' });
      return isGreenish(v) ? true : tr({ uz: "Rang yashil oilasidan bo'lsin — masalan `#3FAE2A`", ru: 'Возьмите цвет из зелёной семьи — например `#3FAE2A`' });
    }) },
    { id: 'radius', label: { uz: '.card — yumaloq burchak (border-radius)', ru: '.card — скруглённые углы (border-radius)' }, check: C.cssProp('.card', 'border-radius', { uz: "`.card` ga `border-radius` yozing — masalan `18px`", ru: 'Задайте `.card` свойство `border-radius` — например `18px`' }) },
    { id: 'center', label: { uz: '.card — markazda (width + margin auto)', ru: '.card — по центру (width + margin auto)' }, check: C.custom((x) => {
      const rule = x.cssRules.find(r => r.selector.split(',').map(s => s.trim()).includes('.card'));
      if (!rule) return tr({ uz: "style.css'da `.card { ... }` qoidasini oching", ru: 'Откройте правило `.card { ... }` в style.css' });
      if (!rule.props['width']) return tr({ uz: "Avval `width` bering — masalan `260px`", ru: 'Сначала задайте `width` — например `260px`' });
      const m = [rule.props['margin'], rule.props['margin-left'], rule.props['margin-right']].filter(Boolean).join(' ');
      return m.includes('auto') ? true : tr({ uz: "Markazlash uchun `margin: 40px auto` yozing", ru: 'Для центрирования напишите `margin: 40px auto`' });
    }) },
    { id: 'shadow', label: { uz: '.card — soya (box-shadow)', ru: '.card — тень (box-shadow)' }, check: C.cssProp('.card', 'box-shadow', { uz: "`.card` ga `box-shadow` yozing — masalan `0 10px 30px rgba(0,0,0,0.18)`", ru: 'Задайте `.card` свойство `box-shadow` — например `0 10px 30px rgba(0,0,0,0.18)`' }) },
  ],
};

// Praktika handoff xaritasi: shu ekran INDEKSIDAN keyin qaysi praktika chaqiriladi.
const PRACTICE_AFTER = {
  // 🔴 9.4: AYNAN 3 praktika-compiler (Ism sahifasi + Card HTML + Card CSS).
  7:  { task: TASK_NAME,  starter: STARTER_NAME }, // 1) h1 + p (Live Server qadamidan keyin)
  9:  { task: TASK_CARD,  starter: STARTER_CARD }, // 2) Card HTML-skeleti
  10: { task: TASK_STYLE, starter: null },         // 3) Card CSS (2 fayl — files ichida)
};

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi real bosqichlar uchun =====
const ACHIEVEMENTS = {
  installed:  { icon: '🧰', name: 'Geared Up!',   desc: { uz: "VS Code'ni kompyuteringizga o'rnatdingiz", ru: 'Вы установили VS Code на свой компьютер' } },
  pilot:      { icon: '🧭', name: 'Cockpit Pro!', desc: { uz: "VS Code oynasining 4 qismini o'rganib chiqdingiz", ru: 'Вы изучили 4 части окна VS Code' } },
  cardmaster: { icon: '🪪', name: 'Card Wizard!', desc: { uz: "Vizitka-cardni yasab, unga stil berdingiz", ru: 'Вы сделали карточку-визитку и оформили её' } },
  graduate:   { icon: '🏆', name: 'Level Up!',    desc: { uz: "VS Code darsini to'liq yakunladingiz", ru: 'Вы полностью прошли урок VS Code' } },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi).
// cardmaster — praktikada (runPractice: card CSS tugaganda), graduate — yakuniy ekranda.
const ACH_TRIGGERS = { s2: 'installed', s3: 'pilot' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar, zarba to'lqini
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">{ach.icon}<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="acu-spark" style={{ '--a': `${i * (360 / 14)}deg`, animationDelay: `${0.18 + (i % 5) * 0.05}s` }}>✦</span>
          ))}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{ach.name}</span>
          {ach.desc && <span className="acu-desc">{tr(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
      </div>
    </div>
  );
}
// Navbatda bittasi ko'rsatiladi (to'liq-ekran bayram) — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

// ============================================================ LESSON ROOT — ({ lang, onFinished, onPractice })

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). s13 = -1 (yakuniy yozma).
const INLINE_KEYS = { s4: 1, s8: 2, s11: 0, s13: -1 };

export default function VsCodeLesson({ lang: langProp, onFinished, onPractice }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const [practice, setPractice] = useState(null);   // lokal overlay: { task, starter, done } yoki null
  const [mentorPractice, setMentorPractice] = useState(null); // jonli darsda mentor praktika paneli: { task, starter, fromScreen }
  const startTimeRef = useRef(Date.now());
  // 🏅 Nishonlar
  const earnedRef = useRef(new Set());
  const [earned, setEarned] = useState(() => new Set());
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts(t => [...t, { id, k: ++achKeyRef.current }]);
  }, []);

  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy
  // takrorlash uchun); jonli o'quvchidan yashirin — sakrab o'tiladi. Mentor darsni
  // «Erkin qilish» qilgach (yoki uzilsa / yakka o'qishda) o'quvchilarga ham ochiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () =>
    live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const advance = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  // Praktikani ishga tushiradi: production'da onPractice (LMS), lokalda overlay.
  // fromScreen — praktika QAYSI ekrandan keyin ochilgani; tugatilganda mentor paneli
  // uchun «tugatdim» signali serverga yoziladi (o'quvchi jonli darsda bo'lsa).
  const runPractice = (entry, fromScreen) => {
    const done = () => {
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
      if (fromScreen === 10) earn('cardmaster'); // 🏅 card CSS praktikasi tugadi — Card Wizard!
      setPractice(null); advance();
    };
    if (typeof onPractice === 'function') {
      Promise.resolve(onPractice(entry.task)).then(done); // production: LMS compilatori
    } else {
      setPractice({ ...entry, done }); // lokal: overlay compilatori
    }
  };
  // "Davom etish" bosilganda: shu ekrandan keyin praktika bo'lsa — compilatorni ochadi,
  // bajarilgach keyingi ekranga o'tadi. Aks holda oddiy o'tadi.
  // 🏠 UYGA VAZIFA PRAKTIKASI (yakun-sahifadagi tugma) — yakuniy topshiriq.
  // Dars-ichi mashqidan farqi: keyingi ekranga O'TKAZMAYDI (oxirgi sahifa) va serverga
  // «bajardim» signali YUBORMAYDI — bu uy ishi, sinf ishi emas.
  const openHomeworkPractice = () => {
    const entry = { task: TASK_STYLE, starter: null };
    if (typeof onPractice === 'function') Promise.resolve(onPractice(entry.task)).catch(() => {});
    else setPractice({ ...entry, done: () => setPractice(null) });
  };
  const next = () => {
    const entry = PRACTICE_AFTER[screen];
    if (!entry) { advance(); return; }
    // 🔴 DARS-ICHI PRAKTIKASI FAQAT JONLI DARSDA (2026-07-29): mashq faqat o'quvchi mentorga
    // ULANGAN va sessiya davom etayotganda ochiladi. Mentor «Erkin qilish»ni bossa, uzilib qolsa
    // yoki bola mustaqil o'qiyotgan bo'lsa — mashq OCHILMAYDI, u yakun-sahifadagi «Uyga vazifa»
    // tugmasi orqali bajaradi.
    if (!(live && (live.mode === 'mentor' || (live.mode === 'student' && live.status !== 'ended' && live.mentorAlive)))) { advance(); return; }
    if (live && live.mode === 'mentor') {
      // Jonli mentor: avval o'quvchilarni OCHAMIZ (advance → ular praktikani o'z
      // qurilmasida yozadi), so'ng mentor panelida kim tugatganini kuzatadi va
      // «Doskada yozib ko'rsatish» bilan aynan shu mashqni proyektorda yechib beradi.
      setMentorPractice({ ...entry, fromScreen: screen });
      advance();
    } else {
      runPractice(entry, screen); // o'quvchi / self: mashqni o'zi bajaradi
    }
  };
  const prev = () => setScreen(s => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon
  };
  const reset = () => { setAnswers({}); setScreen(0); setPractice(null); setMentorPractice(null); startTimeRef.current = Date.now(); };

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => {
    if (screen === TOTAL_SCREENS - 1) earn('graduate');
  }, [screen]); // eslint-disable-line

  const finishLesson = () => {
    live.endSession();
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? answers[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? answers[i] : null)).filter(Boolean);
    const finalCorrect = finalAnswers.filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [ScreenHook, ScreenGoal, ScreenInstall, ScreenTour, ScreenTest1, ScreenFolder, ScreenEmmet, ScreenLive, ScreenTest2, ScreenCardHtml, ScreenCardCss, ScreenTest3, ScreenKeys, ScreenFinalTest, ScreenFinale, ScreenPodium, ScreenFlashcards, ScreenSummary];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        .bp-body ul { list-style-type: disc; list-style-position: outside; padding-left: 24px; }
        .bp-body ol { list-style-type: decimal; list-style-position: outside; padding-left: 24px; }
        .bp-body li { display: list-item; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        /* Kattalashtirish (zoom) — animatsiyani katta ekranda ko'rish */
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .hl-sync { border-radius: 4px; padding: 0 2px; animation: hl-sync 0.6s ease; }
        @keyframes hl-sync { 0% { background: ${T.accent}; color: #fff; } 55% { background: ${T.accentSoft}; color: ${T.accent}; } 100% { background: transparent; color: inherit; } }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR v15 (soyalar) === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === OPSIYALAR v15 === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .text-input, .prompt-input { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,16px); font-weight: 500; padding: 11px 13px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.ink}; outline: none; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.2s; }
        .text-input:focus, .prompt-input:focus { box-shadow: 0 10px 22px -6px rgba(255,79,40,0.3), 0 0 0 1px rgba(255,79,40,0.2); }
        .prompt-input { font-family: 'Manrope'; }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.55; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .code-box .tg, .t-tag { color: ${CODE.tag}; }
        .ck.active .t-tag { color: #fff; }
        .t-cm, .cm { color: ${CODE.comment}; font-style: italic; }
        .t-title { color: ${CODE.comment}; font-style: italic; opacity: 0.85; }
        .at { color: ${CODE.attr}; } .st { color: ${CODE.str}; } .tx { color: ${CODE.text}; }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .lead { margin: 0; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE v15 (sticky header, 936px) === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }

        /* === FRAME v15 === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-ok { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: 12px 15px; }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === PROBLEM REVEAL === */
        .pr { display: flex; flex-direction: column; gap: 12px; }
        .mu-block { display: flex; flex-direction: column; gap: 14px; transition: opacity 0.35s, transform 0.35s; }
        .mu-block.leave { opacity: 0; transform: translateY(-8px); }
        .ps-line { display: flex; gap: 10px; align-items: flex-start; }
        .ps-badge { flex-shrink: 0; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 9px; border-radius: 6px; margin-top: 2px; }
        .ps-q { background: ${T.accentSoft}; color: ${T.accent}; }
        .ps-a { background: ${T.successSoft}; color: ${T.success}; }
        .ps-text { font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink}; }
        .solve-btn { align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); padding: 10px 18px; border-radius: 10px; border: none; background: ${T.ink}; color: ${T.bg}; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 16px -5px rgba(${T.shadowBase},0.3); }
        .solve-btn:hover:not(:disabled) { background: ${T.accent}; }
        .ye-solved, .ye-stack { display: flex; flex-direction: column; gap: 12px; }
        .mu-mini { opacity: 0.7; }
        .idea { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 6px 0; }
        .happy { font-size: 30px; animation: pop 0.5s ease-out; } .idea-bulb { font-size: 22px; animation: pop 0.5s ease-out 0.1s both; }
        @keyframes pop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .pr-answer { animation: fade-step 0.4s ease-out; }

        .demo-swap { animation: fade-step 0.3s ease-out; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }
        .dest { display: flex; align-items: center; gap: 14px; background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 14px 18px; }
        .dest-emoji { font-size: 28px; } .dest-title { font-weight: 700; color: ${T.ink}; margin: 0; font-size: clamp(15px,1.8vw,17px); } .dest-sub { color: ${T.ink2}; margin: 2px 0 0; font-size: clamp(13px,1.5vw,14px); }

        /* === RECIPE === */
        .recipe-list { display: flex; flex-direction: column; list-style: none; }
        .recipe-list li { display: flex; align-items: center; gap: 13px; padding: 11px 2px; border-bottom: 1px solid rgba(167,166,162,0.22); transition: all 0.3s; }
        .recipe-list li:last-child { border-bottom: none; }
        .recipe-num { width: 22px; height: 22px; border-radius: 50%; box-shadow: inset 0 0 0 2px ${T.ink3}; background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; flex-shrink: 0; transition: all 0.3s; }
        .recipe-list li.on .recipe-num { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.success}; }
        .recipe-text { font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }

        /* === FLOW ARROW === */
        .flow-arrow { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 0; }
        .flow-track { width: 2px; height: 10px; background: ${T.ink3}; position: relative; overflow: hidden; border-radius: 2px; }
        .flow-bead { position: absolute; top: -8px; left: -1px; width: 4px; height: 8px; background: ${T.accent}; border-radius: 2px; animation: bead 1.4s linear infinite; }
        @keyframes bead { from { top: -8px; } to { top: 18px; } }
        .flow-chevron { color: ${T.accent}; font-size: 11px; animation: chev 1.4s ease-in-out infinite; }
        @keyframes chev { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .brauzer-step { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 12px; padding: 9px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s; }
        .brauzer-icon { font-size: 20px; } .brauzer-h { font-weight: 700; color: ${T.ink}; margin: 0; font-size: 14px; } .brauzer-sub { color: ${T.ink2}; margin: 1px 0 0; font-size: 12px; font-family: 'JetBrains Mono'; }

        /* === PROFILE CARD === */
        .profile-card { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; padding: 2px 0; animation: fade-step 0.3s; }
        .pf-ava { width: 44px; height: 44px; border-radius: 50%; background: ${T.accent}; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
        .pf-name { font-family: 'Georgia, serif'; font-size: clamp(16px,2.2vw,19px); color: ${T.ink}; margin: 0; }
        .pf-bio { color: ${T.ink2}; margin: 0; font-size: 12.5px; }
        .pf-btn { margin-top: 3px; background: ${T.accent}; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; cursor: default; }
        /* ===== BRAUZER MASHINASI (Screen3) ===== */
        .br-code { display: flex; flex-direction: column; gap: 3px; white-space: normal; }
        .br-line { display: flex; align-items: center; gap: 6px; padding: 3px 7px; border-radius: 6px; border-left: 3px solid transparent; opacity: 0.5; transition: opacity 0.3s ease, background 0.3s ease, border-color 0.3s ease; }
        .br-line.read { opacity: 1; }
        .br-line.now { opacity: 1; background: rgba(255,79,40,0.18); border-left-color: ${T.accent}; }
        .br-caret { width: 9px; flex-shrink: 0; color: ${T.accent}; font-weight: 700; }
        .br-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 90px; height: 100%; text-align: center; color: ${T.ink3}; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12px,1.6vw,13.5px); line-height: 1.4; }
        .br-el { animation: br-pop 0.42s cubic-bezier(.34,1.4,.5,1); }
        @keyframes br-pop { 0% { opacity: 0; transform: translateY(9px) scale(0.82); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .br-controls { display: flex; align-items: center; gap: 10px; margin-top: 2px; }
        .br-status { margin: 4px 0 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.6vw,14px); color: ${T.success}; background: ${T.successSoft}; padding: 9px 13px; border-radius: 11px; animation: fade-step 0.35s ease-out; }

        /* === BSKEL (skeleton anatomy) === */
        .bskel { display: flex; flex-direction: column; gap: 0; }
        .bskel-doctype, .bskel-html, .bskel-tab, .bskel-page { cursor: pointer; transition: all 0.2s; position: relative; }
        .bskel-doctype { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; padding: 6px 10px; border-radius: 8px 8px 0 0; background: ${T.bg}; }
        .bskel-html { border: 2px solid ${T.ink3}; border-radius: 0 8px 12px 12px; padding: 18px 10px 10px; background: ${T.paper}; }
        .bskel-htmllabel { position: absolute; top: -1px; left: 10px; transform: translateY(-50%); font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink2}; background: ${T.paper}; padding: 0 6px; }
        .bskel-win { border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18); }
        .bskel-tab { background: #f0eee8; padding: 8px 10px; display: flex; align-items: center; gap: 8px; }
        .bskel-dots { display: flex; gap: 4px; } .bskel-dots i { width: 8px; height: 8px; border-radius: 50%; background: ${T.ink3}; }
        .bskel-tabpill { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: #fff; padding: 3px 9px; border-radius: 5px; }
        .bskel-zone { margin-left: auto; font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; }
        .bskel-page { background: #fff; padding: 16px; min-height: 80px; }
        .bskel-ptitle { font-family: 'Georgia, serif'; font-size: 18px; color: ${T.ink}; margin: 0 0 4px; } .bskel-ptext { font-family: 'Georgia, serif'; color: ${T.ink2}; margin: 0; font-size: 13px; }
        .bskel-zone-b { position: absolute; bottom: 6px; right: 10px; }
        .sk-tapguide { margin: 0 0 8px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.7vw,14px); color: ${T.ink2}; }
        .sk-tapguide b { color: ${T.ink}; }
        .sk-tapcount { background: ${T.accent}; color: #fff; border-radius: 99px; padding: 2px 9px; font-weight: 800; margin-left: 6px; font-size: 12px; font-family: 'Manrope'; }
        @keyframes tap-hint { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255,79,40,0); } 50% { box-shadow: inset 0 0 0 2px rgba(255,79,40,0.45); } }
        .bskel-doctype:not(.seen), .bskel-tab:not(.seen), .bskel-page:not(.seen) { animation: tap-hint 1.8s ease-in-out infinite; }
        .bskel-html:not(.seen) .bskel-htmllabel { animation: tap-hint 1.8s ease-in-out infinite; border-radius: 6px; }
        .bskel-doctype.seen::after { content: '✓'; float: right; color: ${T.success}; font-weight: 700; }
        .bskel-html.seen .bskel-htmllabel::after { content: ' ✓'; color: ${T.success}; font-weight: 700; }
        .bskel-tab.seen .bskel-zone::before, .bskel-page.seen .bskel-zone-b::before { content: '✓ '; color: ${T.success}; font-weight: 700; }
        .bskel-doctype.active, .bskel-html.active, .bskel-tab.active, .bskel-page.active { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .bskel-tab.active, .bskel-page.active { background: ${T.accentSoft}; }
        .ck { cursor: pointer; border-radius: 4px; transition: all 0.15s; padding: 0 2px; }
        .ck:hover { background: rgba(255,255,255,0.08); }
        .ck.active { background: ${T.accent}; }
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-chip { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 4px 9px; border-radius: 6px; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }

        /* === HUG (teg o'raydi) === */
        .hug-wrap { display: flex; justify-content: center; padding: 10px 0; }
        .hug { display: flex; align-items: stretch; gap: 0; transition: gap 0.4s; }
        .hug.on { gap: 4px; }
        .hug-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 14px; cursor: pointer; border-radius: 10px; transition: all 0.2s; }
        .hug-tag { background: ${CODE.bg}; } .hug-content { background: ${T.accentSoft}; }
        .hug-item.active { box-shadow: 0 0 0 2px ${T.accent}; }
        .hug-code { font-family: 'JetBrains Mono'; font-weight: 700; font-size: clamp(15px,2vw,18px); }
        .hug-tag .hug-code { color: ${CODE.tag}; } .hug-content .hug-code { color: ${T.accent}; }
        .hug-slash { color: ${CODE.attr}; }
        .hug-lbl { font-family: 'JetBrains Mono'; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink3}; }
        .role-line { background: ${T.paper}; border-radius: 10px; padding: 12px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .pv-h1 { font-family: 'Georgia, serif'; font-weight: 700; font-size: clamp(22px,3vw,30px); color: ${T.ink}; margin: 0; animation: tb-pvpop 0.5s cubic-bezier(.34,1.4,.5,1); }

        /* === 🧲 DRAG&DROP (reusable) === */
        .sk-buildbox { display: flex; flex-direction: column; animation: sk-swapin 0.5s cubic-bezier(.34,1.3,.4,1); }
        @keyframes sk-swapin { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: none; } }
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 56px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-slots, .dd-pool { position: relative; }
        .dd-pool { z-index: 1; } /* sudralgan pool chip slotlar ustida ko'rinsin */
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: #E24848; font-size: 13.5px; }

        /* === 🐞 DEBUG CHALLENGE (reusable) === */
        .dbg-box { display: flex; flex-direction: column; border-top: 1.5px dashed ${T.line}; padding-top: 12px; margin-top: 6px; animation: sk-swapin 0.5s cubic-bezier(.34,1.3,.4,1); }
        .dbg { display: flex; flex-direction: column; gap: 10px; }
        .dbg-code { background: ${CODE.bg}; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.4); overflow-x: auto; }
        .dbg-line { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px,1.8vw,15px); color: ${CODE.text}; padding: 8px 12px; border-radius: 9px; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, border-color .15s; white-space: nowrap; }
        .dbg-line:hover { background: rgba(255,255,255,0.06); }
        .dbg-line.wrong { border-color: #E24848; background: rgba(226,72,72,0.16); animation: dd-shake .4s; }
        .dbg-line.fixed { border-color: ${T.success}; background: rgba(18,169,104,0.16); cursor: default; }
        .dbg-ln { color: ${CODE.comment}; font-size: 12px; min-width: 16px; text-align: right; flex-shrink: 0; }
        .dbg-txt { flex: 1; }
        .dbg-badge { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.success}; background: rgba(18,169,104,0.2); border-radius: 99px; padding: 3px 9px; flex-shrink: 0; }
        .dbg-hint { margin: 0; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .dbg-ok { font-weight: 700; color: ${T.success}; font-size: 14px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 14px; }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { display: flex; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 480px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        /* Quizlet uslubi: karta rangli muhr bilan chapga (✗ qizil) / o'ngga (✓ yashil) uchib ketadi */
        .fc-fly { position: relative; animation: fc-in 0.3s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
        .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
        .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
        @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
        @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
        .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
        .fc-fly.out-knew::after { content: '✓'; background: ${T.success}; box-shadow: 0 10px 26px -8px ${T.success}; }
        .fc-fly.out-again::after { content: '✗'; background: ${T.accent}; box-shadow: 0 10px 26px -8px ${T.accent}; }
        @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
        .fc-card { position: relative; height: clamp(160px,26vw,188px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(30px,6vw,46px); letter-spacing: -0.02em; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 ACHIEVEMENTS === */
        /* ===== 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI ===== */
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          background: radial-gradient(circle at 50% 42%, rgba(20,14,6,0.34) 0%, rgba(10,8,14,0.72) 62%, rgba(8,6,12,0.86) 100%);
          animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
        @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acu-bg-out { to { opacity: 0; } }
        /* Aylanuvchi nur burjlari (butun ekran) */
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        /* Markaziy yorug'lik */
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        /* Zarba to'lqini (halqa) */
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
        /* Sahna (medal + matn) */
        .acu-stage { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,3vw,22px); animation: acu-bg-in 0.3s ease-out; }
        .acu-medal-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
        .acu-medal { position: relative; width: clamp(112px,26vw,152px); height: clamp(112px,26vw,152px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(54px,13vw,74px); overflow: hidden;
          background: radial-gradient(circle at 38% 30%, #FFF0BE 0%, #FFD35A 42%, #F5A623 72%, #E4870C 100%);
          box-shadow: 0 0 70px 12px rgba(255,201,77,0.55), 0 22px 54px -12px rgba(0,0,0,0.55), inset 0 -9px 18px rgba(140,70,0,0.28), inset 0 7px 14px rgba(255,255,255,0.6);
          animation: acu-medal-pop 0.7s cubic-bezier(.28,1.5,.4,1) both, acu-float 2.6s ease-in-out 0.7s infinite; }
        @keyframes acu-medal-pop { 0% { transform: scale(0) rotate(-40deg); } 55% { transform: scale(1.18) rotate(10deg); } 75% { transform: scale(0.94) rotate(-3deg); } 100% { transform: scale(1) rotate(0); } }
        @keyframes acu-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        .acu-shine { position: absolute; top: 0; bottom: 0; left: -70%; width: 45%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent); transform: skewX(-18deg); animation: acu-shine-sweep 1.1s ease 0.5s 2; }
        @keyframes acu-shine-sweep { to { left: 130%; } }
        .acu-spark { position: absolute; top: 50%; left: 50%; font-size: clamp(14px,2.6vw,20px); color: #FFE9A8; text-shadow: 0 0 8px rgba(255,201,77,0.9); pointer-events: none; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; animation: acu-spark-burst 1s ease-out both; }
        @keyframes acu-spark-burst { 0% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(clamp(-130px,-24vw,-96px)) scale(1); opacity: 0; } }
        .acu-txt { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
        .acu-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 900; font-size: clamp(12px,1.8vw,14px); letter-spacing: 0.2em; text-transform: uppercase; color: #FFD35A; text-shadow: 0 2px 12px rgba(0,0,0,0.5); animation: acu-rise 0.5s ease-out 0.35s both; }
        .acu-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(26px,5.5vw,42px); color: #fff; line-height: 1.1; text-shadow: 0 3px 22px rgba(0,0,0,0.55); animation: acu-rise 0.55s cubic-bezier(.3,1.2,.4,1) 0.45s both; }
        .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
        @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
        @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        /* Yuqori paneldagi nishon hisoblagichi */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }


        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* === LADDER (sarlavhalar) === */
        .ladder { display: flex; flex-direction: column; gap: 6px; }
        .hl-row { display: flex; align-items: center; gap: 13px; padding: 9px 14px; border-radius: 10px; cursor: pointer; transition: all 0.18s; background: ${T.paper}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.12); }
        .hl-row:hover { box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.2); }
        .hl-row.on { box-shadow: 0 0 0 2px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.25); background: ${T.accentSoft}; }
        .hl-chip { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 3px 8px; border-radius: 5px; flex-shrink: 0; }
        .hl-text { font-family: 'Georgia, serif'; font-weight: 700; color: ${T.ink}; line-height: 1; }
        .hl-tag { margin-left: auto; font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; background: ${T.accentSoft}; padding: 3px 9px; border-radius: 99px; }
        /* narvon zinapoya bo'lib, navbatma-navbat tushadi */
        .hl-stair { animation: rung-drop 0.5s cubic-bezier(.34,1.35,.5,1) backwards; }
        @keyframes rung-drop { 0% { opacity: 0; transform: translateY(-16px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .hl-bar { width: 4px; align-self: stretch; border-radius: 99px; background: ${T.accent}; flex-shrink: 0; }
        .hl-note { background: ${T.paper}; border-radius: 10px; padding: 12px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s; }
        .hl-note .nb { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.accent}; }
        .hl-hint { padding: 10px 2px; }

        /* === MCARD (matn) === */
        /* ===== Telegram muhiti ↔ Veb-sayt (HTML teg) (Screen9) ===== */
        .cmp-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: stretch; }
        .cmp-side { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 14px; padding: 13px 14px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
        .cmp-hd { font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.5vw,13px); }
        .cmp-hd-tg { color: #5288C1; }
        .cmp-hd-html { color: ${CODE.tag}; }
        .cmp-vs { align-self: center; font-family: 'Manrope'; font-weight: 800; font-size: 24px; color: ${T.ink3}; padding: 0 2px; }
        /* Telegram oynasi */
        .tgc-window { border-radius: 13px; overflow: hidden; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.25); display: flex; flex-direction: column; }
        .tgc-head { background: #5288C1; display: flex; align-items: center; gap: 10px; padding: 9px 13px; }
        .tgc-ava { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .tgc-name { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: #fff; margin: 0; }
        .tgc-status { font-family: 'Manrope'; font-size: 11px; color: rgba(255,255,255,0.82); margin: 1px 0 0; }
        .tgc-body { background: #D9E2EC; padding: 13px 12px; display: flex; flex-direction: column; gap: 8px; min-height: 92px; }
        .tgc-row { display: flex; }
        .tgc-row.in { justify-content: flex-start; } .tgc-row.out { justify-content: flex-end; }
        .tgc-bubble { position: relative; max-width: 85%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-size: clamp(13px,1.8vw,14.5px); line-height: 1.6; color: #16202A; box-shadow: 0 1px 2px rgba(0,0,0,0.12); }
        .tgc-bubble.in { background: #fff; border-bottom-left-radius: 5px; }
        .tgc-bubble.out { background: #E4F7CF; border-bottom-right-radius: 5px; animation: tgc-fly 0.45s cubic-bezier(.34,1.35,.5,1); }
        @keyframes tgc-fly { 0% { opacity: 0; transform: translateY(16px) scale(0.88); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .tgc-time { font-size: 10px; color: #5DA86A; margin-left: 6px; float: right; position: relative; top: 5px; }
        .tgc-composer { display: flex; align-items: center; gap: 9px; background: #fff; padding: 8px 10px; }
        .tgc-cic { font-size: 18px; flex-shrink: 0; }
        .tgc-input { flex: 1; min-width: 0; font-family: 'Manrope'; font-size: clamp(13px,1.8vw,14.5px); color: #16202A; line-height: 2.1; }
        .tgc-send { width: 38px; height: 38px; flex-shrink: 0; border: none; border-radius: 50%; background: #5288C1; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(82,136,193,0.6); transition: transform 0.15s ease; }
        .tgc-send:hover { transform: scale(1.08); }
        .tgc-send:active { transform: scale(0.94); }
        .tgc-send svg { width: 19px; height: 19px; margin-left: 1px; }
        .tgc-hint { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; text-align: center; margin: 0; }
        /* belgilanadigan so'z + format menyusi */
        .tgm-word { position: relative; display: inline-block; cursor: pointer; padding: 0 2px; border-radius: 3px; transition: background 0.15s ease; }
        .tgm-word:hover { background: rgba(82,136,193,0.16); }
        .tgm-word.sel { background: #A8D3FF; }
        .tgm-word.sel::before, .tgm-word.sel::after { content: ''; position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #2F86E0; }
        .tgm-word.sel::before { left: -3px; top: -5px; } .tgm-word.sel::after { right: -3px; bottom: -5px; }
        .tgm-word.bold { font-weight: 800; color: #000; animation: tgm-pop 0.4s cubic-bezier(.34,1.5,.5,1); }
        .tgm-word.ital { font-style: italic; animation: tgm-pop 0.4s cubic-bezier(.34,1.5,.5,1); }
        @keyframes tgm-pop { 0% { transform: scale(1); } 45% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .tgm-menu { position: absolute; bottom: calc(100% + 9px); left: 50%; transform: translateX(-50%); display: flex; gap: 2px; background: #2B3A4A; border-radius: 9px; padding: 3px; box-shadow: 0 8px 18px -5px rgba(0,0,0,0.45); z-index: 6; animation: tgm-menuin 0.16s ease-out; }
        .tgm-menu::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: #2B3A4A; }
        .tgm-menu button { width: 32px; height: 30px; border: none; background: transparent; color: #fff; font-family: 'Georgia, serif'; font-size: 16px; border-radius: 7px; cursor: pointer; transition: background 0.15s ease; }
        .tgm-menu button:hover { background: rgba(255,255,255,0.14); }
        .tgm-menu button.on { background: #5288C1; }
        @keyframes tgm-menuin { 0% { opacity: 0; transform: translateX(-50%) translateY(5px) scale(0.9); } 100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        /* Veb-sayt tomoni */
        .cmp-siteview { padding: 14px 16px; background: #fff; }
        .cmp-siteview p { font-family: 'Georgia, serif'; font-size: clamp(14px,2vw,16px); color: ${T.ink}; margin: 0; line-height: 1.6; }
        .rw-b { font-weight: 800; } .rw-i { font-style: italic; }
        .cmp-codeblock { display: flex; flex-direction: column; gap: 6px; margin-top: 9px; padding-top: 11px; border-top: 1.5px dashed ${T.line}; }
        .cmp-codelbl { font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: ${T.ink3}; }
        .cmp-code { margin: 0; font-size: clamp(12px,1.6vw,13.5px) !important; }
        .cmp-leg { margin: 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(11.5px,1.5vw,13px); color: ${T.ink2}; line-height: 1.5; }
        .cmp-leg-tag { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${CODE.tag}; }
        .cmp-merge { text-align: center; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.8vw,15px); line-height: 1.5; color: ${T.ink}; background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 13px; padding: 13px 16px; transition: box-shadow 0.3s ease; }
        .cmp-merge.done { box-shadow: inset 0 0 0 2px ${T.success}55; }
        @media (max-width: 760px) {
          .cmp-grid { grid-template-columns: 1fr; }
          .cmp-vs { transform: rotate(90deg); }
        }

        /* === WHEN / LISTS === */
        .when { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 10px; padding: 11px 15px; }
        .site-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid ${T.ink3}40; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .site-brand { display: inline-flex; align-items: center; gap: 8px; } .site-logo { width: 22px; height: 22px; border-radius: 6px; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; } .site-name { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; font-size: 14px; }
        .site-nav { display: inline-flex; gap: 11px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink2}; }
        .site-sec { } .site-h3 { font-family: 'Georgia, serif'; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0 0 8px; }
        .site-list { font-family: 'Georgia, serif'; color: ${T.ink}; font-size: clamp(14px,1.8vw,16px); }
        .site-list ul, .site-list ol { padding-left: 24px; } .site-list li { display: list-item; margin: 3px 0; }
        /* ===== ul vs ol yonma-yon farq (Screen10) ===== */
        .cmp2-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; align-items: start; }
        .cmp2-card { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 13px; padding: 12px 13px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
        .cmp2-hd { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.7vw,15px); color: ${T.ink}; }
        .cmp2-chip { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 2px 7px; border-radius: 5px; }
        .cmp2-order { align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.03em; padding: 3px 10px; border-radius: 99px; }
        .cmp2-order.no { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .cmp2-order.yes { color: ${T.accent}; background: ${T.accentSoft}; }
        .cmp2-pvlbl { display: block; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em; color: ${T.ink3}; margin-bottom: 5px; }
        /* sayt = rangli, brendli klassik saytcha */
        .cmp2-bp { border-radius: 10px; overflow: hidden; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.22), inset 0 0 0 1px ${T.line}; }
        .cmp2-site { background: #fff; }
        .cmp2-top { display: flex; align-items: center; gap: 8px; padding: 8px 11px; }
        .cmp2-site.shop .cmp2-top { background: linear-gradient(135deg, #2FA84F, #46C46A); }
        .cmp2-site.lemon .cmp2-top { background: linear-gradient(135deg, #F2A60C, #FFC93C); }
        .cmp2-logo { width: 22px; height: 22px; border-radius: 7px; background: rgba(255,255,255,0.28); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
        .cmp2-brand { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: #fff; }
        .cmp2-nav { margin-left: auto; display: flex; gap: 10px; font-family: 'Manrope'; font-weight: 600; font-size: 10px; color: rgba(255,255,255,0.92); }
        .cmp2-body { padding: 11px 13px 13px; }
        .cmp2-site-h { font-family: 'Georgia, serif'; font-weight: 700; font-size: clamp(14px,1.9vw,16px); color: ${T.ink}; margin: 0 0 9px; }
        /* klassik ro'yxat — kartochkasiz, oddiy qatorlar */
        .cmp2-site-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .cmp2-site-list li { display: flex; align-items: center; gap: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13.5px,1.8vw,15px); color: ${T.ink}; opacity: 0; }
        .cmp2-site-list.play li { animation: li-build 0.45s cubic-bezier(.34,1.4,.5,1) both; }
        @keyframes li-build { 0% { opacity: 0; transform: translateY(-9px) scale(0.92); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .cmp2-replaywrap { display: flex; justify-content: center; }
        .cmp2-replay { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; background: transparent; border: none; border-radius: 9px; padding: 7px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.15s ease; }
        .cmp2-replay:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}; color: ${T.accent}; }
        .cmp2-site-list.ul li::before { content: ''; width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .cmp2-site.shop .cmp2-site-list.ul li::before { background: #2FA84F; }
        .cmp2-site-list.ol { counter-reset: step; }
        .cmp2-site-list.ol li::before { counter-increment: step; content: counter(step); width: 22px; height: 22px; border-radius: 50%; color: #fff; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cmp2-site.lemon .cmp2-site-list.ol li::before { background: #F2A60C; }
        .cmp2-codewrap { margin-top: 8px; padding-top: 11px; border-top: 1.5px dashed ${T.line}; }
        .cmp2-code { margin: 0; font-size: clamp(11px,1.4vw,12.5px) !important; }
        .cmp2-concl { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: 11px 15px; }
        .cmp2-concl p { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.7vw,14px); line-height: 1.5; color: ${T.ink}; }
        @media (max-width: 620px) { .cmp2-grid { grid-template-columns: 1fr; } }

        /* === WEB (graf) === */
        .web { position: relative; height: 150px; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .web-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .web-node { position: absolute; transform: translate(-50%,-50%); font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink}; background: ${T.bg}; padding: 5px 10px; border-radius: 99px; cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.25); }
        .web-node:hover { transform: translate(-50%,-50%) scale(1.06); }
        .web-node-off { opacity: 0.38; cursor: default; box-shadow: none; }
        .web-node-off:hover { transform: translate(-50%,-50%); }
        .web-node.on { background: ${T.accent}; color: #fff; animation: node-pop 0.4s ease; }
        @keyframes node-pop { 0% { transform: translate(-50%,-50%) scale(1); } 45% { transform: translate(-50%,-50%) scale(1.22); } 100% { transform: translate(-50%,-50%) scale(1); } }
        .web-travel { position: absolute; width: 13px; height: 13px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 12px 3px ${T.accent}; pointer-events: none; z-index: 4; animation: web-fly 0.48s cubic-bezier(.4,0,.25,1) forwards; }
        @keyframes web-fly { 0% { left: var(--fx); top: var(--fy); opacity: 0; transform: translate(-50%,-50%) scale(0.4); } 16% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 84% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { left: var(--tx); top: var(--ty); opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .web-cap { font-size: clamp(12px,1.5vw,13px); color: ${T.ink2}; margin: 0; line-height: 1.5; }

        .bp-url { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; animation: fade-step 0.3s; } .lock { color: ${T.success}; font-size: 8px; }
        .pg-in { animation: pg-in 0.35s ease-out; } @keyframes pg-in { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
        .site-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; flex-wrap: wrap; gap: 4px; }
        .site-wordmark { font-family: 'Georgia, serif'; font-weight: 700; color: ${T.ink}; font-size: 14px; } .site-tag { font-size: 10px; color: ${T.ink3}; font-family: 'JetBrains Mono'; }
        .pg-h1 { font-family: 'Georgia, serif'; font-size: clamp(20px,2.8vw,26px); color: ${T.ink}; margin: 0 0 7px; } .pg-body { font-family: 'Georgia, serif'; color: ${T.ink2}; font-size: clamp(13px,1.7vw,15px); line-height: 1.55; margin: 0 0 12px; }
        .pg-divider { height: 1px; background: ${T.ink3}30; margin: 0 0 12px; }
        .pg-linklabel { font-family: 'Manrope'; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.ink3}; margin: 0 0 8px; }
        .pg-links { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
        .pg-a { font-family: 'Georgia, serif'; color: ${T.link}; text-decoration: underline; cursor: pointer; font-size: clamp(13px,1.7vw,15px); display: inline-flex; align-items: center; gap: 5px; transition: gap 0.2s; } .pg-a:hover { gap: 9px; } .arr { font-size: 12px; }
        .pg-foot { font-size: 10px; color: ${T.ink3}; margin: 0; font-family: 'Manrope'; }

        .codecard { background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s ease-out forwards; }
        .codecard-top { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; margin: 0 0 8px; display: flex; align-items: center; gap: 7px; } .dotf { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .codeblock { background: ${CODE.bg}; border-radius: 8px; padding: 11px 13px; margin: 0; font-family: 'JetBrains Mono'; font-size: 12px; line-height: 1.6; display: flex; flex-direction: column; } .codeblock .ln { white-space: pre-wrap; word-break: break-word; } .codeblock .tg { color: ${CODE.tag}; }
        .codecap { font-size: 12px; color: ${T.ink2}; margin: 8px 0 0; } .mn { font-family: 'JetBrains Mono'; color: ${T.accent}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 4px 7px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); } .ai-line .tg { color: ${CODE.tag}; }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === BUILDER === */
        .prompt-row { display: flex; gap: 8px; }
        .prompt-btn { flex-shrink: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; padding: 0 18px; border-radius: 12px; border: none; background: ${T.accent}; color: #fff; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); } .prompt-btn:hover:not(:disabled) { box-shadow: 0 10px 22px -5px rgba(255,79,40,0.55); } .prompt-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 7px 12px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; } .gt { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.accent}; }
        .gen-line { color: ${CODE.attr}; } .gen-line::after { content: '…'; animation: blink 1s steps(3) infinite; } @keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        .el-in { animation: fade-step 0.35s ease-out; }

        /* === YOZISH (Screen7) === */
        .yz-card { background: ${T.paper}; border-radius: 14px; padding: 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 10px; }
        .yz-line { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-family: 'JetBrains Mono'; font-size: clamp(15px,2vw,18px); }
        .yz-code { color: ${T.ink}; } .yz-code .t-tag { color: ${CODE.tag}; } .yz-done { animation: fade-step 0.3s; }
        .yz-input { font-family: 'JetBrains Mono'; font-size: clamp(15px,2vw,18px); padding: 5px 10px; border: none; border-radius: 8px; background: ${T.bg}; color: ${T.ink}; outline: none; width: 150px; box-shadow: inset 0 0 0 1.5px ${T.accent}40; } .yz-input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .yz-hint { font-size: 12.5px; color: ${T.ink2}; margin: 0; } .yz-ok { font-size: 13px; color: ${T.success}; font-weight: 600; margin: 0; animation: fade-step 0.3s; } .yz-placeholder { color: ${T.ink3}; font-style: italic; margin: 0; font-family: 'Georgia, serif'; }

        /* === YAKUN (Screen16) === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        /* 🏠 UYGA VAZIFA — amaliy topshiriqqa chorlaydigan kapsula (darsning O'Z rangida) */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, ${T.accent}66, ${T.accent}00 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: none; border-radius: 22px; cursor: pointer; background: linear-gradient(160deg, ${T.accent} 0%, ${T.accent} 52%, ${T.ink} 100%); color: #fff; animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 18px 40px -14px ${T.accent}99, 0 0 0 0 ${T.accent}59; } 50% { box-shadow: 0 20px 48px -14px ${T.accent}bb, 0 0 0 11px ${T.accent}00; } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }
        /* ============ v16 QO'SHIMCHA CSS ============ */
        /* SCREEN 2 — Hayotdan misol (2-bosqich) */
        .frame-col { display: flex; flex-direction: column; gap: 14px; }
        .savo { gap: 12px; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }
        .pz-head { display: flex; align-items: flex-start; gap: 12px; }
        .pz-emoji { font-size: 26px; line-height: 1; flex-shrink: 0; }
        .pz-title { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.accent}; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 3px; }
        .pz-sub { font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; line-height: 1.45; margin: 0; }
        /* ===== DINOZAVRNI DASTURLASH O'YINI ===== */
        .rg-scene { position: relative; height: clamp(174px,38.5vw,216px); border-radius: 14px; overflow: hidden; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rg-sky { position: absolute; inset: 0; background: linear-gradient(180deg,#EAF4FB 0%, #F5F9FC 58%); }
        .rg-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 24%; background: linear-gradient(180deg,#DAC79F,#C8AF80); box-shadow: inset 0 2px 0 #E9DAB8; }
        .rg-cell { position: absolute; bottom: 16%; width: 6px; height: 6px; border-radius: 50%; background: rgba(80,60,20,0.18); transform: translateX(-50%); }
        .rg-cactus { position: absolute; bottom: 24%; transform: translateX(-50%); font-size: clamp(24px,5.6vw,36px); line-height: 1; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.18)); z-index: 1; }
        .rg-goal { position: absolute; bottom: 24%; transform: translateX(-50%); font-size: clamp(26px,6vw,38px); line-height: 1; }
        .rg-meat { display: inline-block; animation: rg-bobgoal 1.5s ease-in-out infinite; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.18)); }
        @keyframes rg-bobgoal { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        /* dino yetib kelganda go'shtni "yeydi" — yo'qoladi (uyilib qolmaydi) */
        .rg-meat.eaten { animation: rg-eaten 0.5s ease forwards; }
        @keyframes rg-eaten { 0% { transform: scale(1) rotate(0); opacity: 1; } 55% { transform: scale(1.3) rotate(14deg); opacity: 1; } 100% { transform: scale(0) rotate(45deg); opacity: 0; } }
        .rg-dino { position: absolute; bottom: 24%; transform: translateX(-50%); transition: left 0.55s cubic-bezier(.45,.05,.35,1); z-index: 2; }
        .rg-dino-in { display: inline-block; }
        .rg-dino-face { display: inline-block; transform: scaleX(-1); font-size: clamp(30px,7vw,44px); line-height: 1; filter: drop-shadow(0 3px 3px rgba(0,0,0,0.22)); }
        .rg-dino.running .rg-dino-in:not(.jump) { animation: rg-run 0.32s ease-in-out infinite; }
        @keyframes rg-run { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .rg-dino-in.jump { animation: rg-jump 0.6s cubic-bezier(.3,.05,.3,1); }
        @keyframes rg-jump { 0% { transform: translateY(0); } 45% { transform: translateY(-44px); } 100% { transform: translateY(0); } }
        .rg-dino.win .rg-dino-in { animation: rg-cheer 0.6s ease; }
        @keyframes rg-cheer { 0%,100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-16px) scale(1.12); } 60% { transform: translateY(0) scale(1); } 80% { transform: translateY(-7px); } }
        .rg-dino.fail-cactus .rg-dino-in { animation: rg-shake 0.45s ease; }
        @keyframes rg-shake { 0%,100% { transform: translateX(0) rotate(0); } 20% { transform: translateX(-5px) rotate(-10deg); } 60% { transform: translateX(5px) rotate(10deg); } }
        .rg-burst { position: absolute; left: 50%; top: -20px; transform: translateX(-50%); font-size: clamp(22px,5vw,30px); z-index: 3; animation: rg-pop 0.55s ease; pointer-events: none; }
        @keyframes rg-pop { 0% { opacity: 0; transform: translateX(-50%) scale(0.3); } 50% { opacity: 1; transform: translateX(-50%) scale(1.25); } 100% { opacity: 1; transform: translateX(-50%) scale(1); } }
        /* g'alaba: dino ustida ko'tarilib o'chuvchi 😋 */
        .rg-yum { position: absolute; left: 50%; top: -24px; transform: translateX(-50%); font-size: clamp(18px,4vw,24px); z-index: 3; pointer-events: none; animation: rg-yum 1s ease forwards; }
        @keyframes rg-yum { 0% { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.5); } 25% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } 75% { opacity: 1; transform: translateX(-50%) translateY(-14px) scale(1); } 100% { opacity: 0; transform: translateX(-50%) translateY(-28px) scale(1); } }
        /* g'alaba konfettisi — butun sahna bo'ylab tushadi */
        .rg-confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 4; }
        .rg-confetti i { position: absolute; top: -12px; width: 8px; height: 12px; border-radius: 2px; opacity: 0; animation: rg-fall 1.15s ease-in forwards; }
        @keyframes rg-fall { 0% { transform: translateY(-12px) rotate(0); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(160px) rotate(460deg); opacity: 0; } }

        /* DASTUR — kod tahriri ko'rinishi */
        .rg-code { border-radius: 12px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.28); }
        .rg-code-bar { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .rg-dot { width: 9px; height: 9px; border-radius: 50%; background: #4a5568; }
        .rg-dot:nth-child(1) { background: #FF5F57; } .rg-dot:nth-child(2) { background: #FEBC2E; } .rg-dot:nth-child(3) { background: #28C840; }
        .rg-code-name { margin-left: 8px; font-family: 'JetBrains Mono'; font-size: 11px; color: ${CODE.comment}; }
        .rg-code-body { padding: 9px 10px; display: flex; flex-direction: column; gap: 2px; min-height: 92px; }
        .rg-code-empty { font-family: 'JetBrains Mono'; font-size: 12.5px; color: ${CODE.comment}; padding: 6px 8px; }
        .rg-line { display: flex; align-items: center; gap: 10px; padding: 4px 8px; border-radius: 6px; border-left: 3px solid transparent; transition: background 0.25s ease, border-color 0.25s ease; }
        .rg-line.now { background: rgba(255,79,40,0.18); border-left-color: ${T.accent}; }
        .rg-ln { font-family: 'JetBrains Mono'; font-size: 11px; color: ${CODE.comment}; width: 14px; text-align: right; flex-shrink: 0; }
        .rg-call { font-family: 'JetBrains Mono'; font-size: 13.5px; }
        .rg-fn { color: ${CODE.tag}; font-weight: 600; }
        .rg-paren { color: ${CODE.punct}; }
        .rg-cmt { font-family: 'JetBrains Mono'; font-size: 11px; color: ${CODE.comment}; margin-left: auto; }
        .rg-line.now .rg-cmt { color: ${CODE.text}; }

        /* Buyruq tugmalari (control pad) */
        .rg-pad { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .rg-key { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 15px; color: ${T.ink}; border: none; border-radius: 12px; padding: 11px 20px; cursor: pointer; transition: transform 0.13s ease, box-shadow 0.13s ease, opacity 0.2s ease; }
        .rg-key-ic { font-size: 19px; line-height: 1; }
        .rg-key-yur { background: linear-gradient(180deg,#EAF7EE,#DAEFE2); box-shadow: 0 5px 14px -6px rgba(15,140,90,0.45), inset 0 0 0 1.5px #C2E6D2; }
        .rg-key-jump { background: linear-gradient(180deg,#FFEDE5,#FFDFD2); box-shadow: 0 5px 14px -6px rgba(255,79,40,0.42), inset 0 0 0 1.5px #FFCDBA; }
        .rg-key:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 9px 20px -7px rgba(${T.shadowBase},0.32); }
        .rg-key:active:not(:disabled) { transform: translateY(0); }
        .rg-key:disabled { opacity: 0.5; cursor: default; }
        .rg-legend { font-family: 'Manrope'; font-weight: 500; font-size: clamp(11.5px,1.5vw,13px); color: ${T.ink3}; margin-left: 4px; }
        .rg-legend b { color: ${T.ink2}; font-weight: 700; }
        .rg-run-row { display: flex; align-items: center; gap: 10px; }
        .rg-mini { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; background: transparent; border: none; border-radius: 10px; padding: 9px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.15s ease; }
        .rg-mini:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.ink3}; }
        .rg-mini:disabled { opacity: 0.45; cursor: default; }

        .rg-msg { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.7vw,14.5px); line-height: 1.45; padding: 10px 14px; border-radius: 11px; animation: fade-step 0.32s ease-out; }
        .rg-msg.idle { color: ${T.ink2}; background: ${T.bg}; }
        .rg-msg.ok { color: ${T.success}; background: ${T.successSoft}; }
        .rg-msg.bad { color: ${T.accent}; background: ${T.accentSoft}; }

        /* Yashil xulosa */
        .rg-xulosa { display: flex; align-items: flex-start; gap: 13px; background: ${T.successSoft}; border-radius: 14px; padding: 15px 17px; box-shadow: inset 0 0 0 1.5px rgba(15,140,90,0.22); }
        .rg-xulosa-ic { font-size: 24px; line-height: 1; flex-shrink: 0; }
        .rg-xulosa .xh { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.success}; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 4px; }
        .rg-xulosa .xb { font-family: 'Manrope'; font-size: clamp(13.5px,1.8vw,15px); color: ${T.ink}; line-height: 1.5; margin: 0; }
        /* SCREEN 6 — Teg (qo'shtirnoq modeli) */
        .pv-plain { font-family: 'Georgia, serif'; font-size: 14px; color: ${T.ink3}; margin: 0; }
        .tegbuild-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 0 16px; }
        .tegbuild { display: flex; align-items: center; justify-content: center; gap: 5px; min-height: 84px; }
        .tegbuild.on { gap: 4px; }
        .tb-chip { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 13px 16px; border-radius: 11px; transition: transform 0.6s cubic-bezier(.34,1.45,.4,1), opacity 0.45s ease, box-shadow 0.3s ease; cursor: default; }
        .tegbuild.on .tb-chip { cursor: pointer; }
        .tb-tag { background: ${CODE.bg}; } .tb-content { background: ${T.accentSoft}; }
        .tb-code { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px,2.4vw,20px); }
        .tb-tag .tb-code { color: ${CODE.tag}; } .tb-content .tb-code { color: ${T.accent}; }
        .tb-slash { color: ${CODE.attr}; display: inline-block; }
        .tegbuild.on .tb-slash { animation: slashpulse 1.3s ease-in-out 0.7s 2; }
        @keyframes slashpulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.5); } }
        .tb-lbl { font-family: 'JetBrains Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink3}; transition: opacity 0.3s 0.4s; }
        /* teglar navbatma-navbat (chap, keyin o'ng) sakrab kelib qamraydi */
        .tb-open { transition-delay: 0.04s; }
        .tb-close { transition-delay: 0.18s; }
        .tb-open.hide { transform: translateX(-96px) scale(0.55) rotate(-9deg); opacity: 0; }
        .tb-close.hide { transform: translateX(96px) scale(0.55) rotate(9deg); opacity: 0; }
        .tegbuild:not(.on) .tb-tag .tb-lbl { opacity: 0; }
        .tb-chip.active { box-shadow: 0 0 0 2px ${T.accent}; }
        /* kontent qamrab olinganda sakraydi va apelsin yonadi */
        .tegbuild.on .tb-content { animation: tb-capture 0.6s cubic-bezier(.34,1.45,.5,1) 0.46s; }
        @keyframes tb-capture { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,79,40,0); } 45% { transform: scale(1.15); box-shadow: 0 0 0 6px rgba(255,79,40,0.3); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .tb-bracket { display: flex; flex-direction: column; align-items: center; gap: 4px; opacity: 0; transition: opacity 0.3s 0.6s; }
        .tegbuild-wrap.on .tb-bracket { opacity: 1; }
        .tb-brace { width: 150px; max-width: 70%; height: 9px; border: 1.5px solid ${T.ink3}; border-top: none; border-radius: 0 0 9px 9px; transform: scaleX(0); transform-origin: center; transition: transform 0.45s cubic-bezier(.34,1.2,.5,1) 0.6s; }
        .tegbuild-wrap.on .tb-brace { transform: scaleX(1); }
        .tb-brace-lbl { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; }
        @keyframes tb-pvpop { 0% { opacity: 0; transform: scale(0.6); } 60% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
        .slash-callout { display: flex; align-items: center; gap: 13px; background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .slash-big { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 30px; color: ${T.accent}; line-height: 1; flex-shrink: 0; }
        /* SCREEN 8 — Sarlavhalar (gazeta -> teglar qo'nadi) */
        .news-card { display: flex; flex-direction: column; }
        .news-line { display: flex; align-items: center; gap: 12px; padding: 9px 10px; margin: 0 -10px; border-radius: 10px; transition: background 0.4s ease; }
        .news-card.tagged .news-line { background: ${T.bg}; }
        .news-card.tagged .news-headline { background: ${T.accentSoft}; }
        .news-line > h3, .news-line > p { flex: 1; min-width: 0; }
        .tag-badge { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 4px 9px; border-radius: 6px; opacity: 0; transform: translateX(10px) scale(0.9); transition: opacity 0.4s ease, transform 0.45s cubic-bezier(.34,1.25,.4,1); }
        .news-card.tagged .tag-badge { opacity: 1; transform: none; }
        .tag-badge.accent { color: #fff; background: ${T.accent}; box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); }
        .tag-badge.soft { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.ink3}55; }
        .news-hint { font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; margin: 12px 0 0; }
        /* Avtoscroll */
        .stage-content { scroll-behavior: smooth; }
        /* MOBIL: yig'iladigan Mentor (skrollni kamaytirish) */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }


        /* ===================== JONLI DARS CSS (InternetLesson bilan bir xil) ===================== */
        /* Konfetti */
        /* === Konfetti (yakun bayrami) === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall {
          0% { transform: translateY(-24px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          55% { transform: translateY(48vh) translateX(22px) rotate(320deg); }
          100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.ink}; color: #fff; border: none; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: rgba(1,154,203,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink3}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Mentor praktika paneli (jonli) */
        .mp-overlay { position: fixed; inset: 0; z-index: 2000; background: ${T.bg}; display: flex; align-items: center; justify-content: center; padding: clamp(16px,3vw,34px); overflow: auto; }
        .mp-card { width: 100%; max-width: 640px; background: ${T.paper}; border-radius: 22px; padding: clamp(22px,3.4vw,36px); box-shadow: 0 24px 60px -24px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 14px; animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .mp-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; }
        .mp-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(22px,3.2vw,30px); color: ${T.ink}; margin: 0; line-height: 1.15; }
        .mp-brief { margin: 0; font-size: clamp(13.5px,1.8vw,15px); line-height: 1.55; color: ${T.ink2}; }
        .mp-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 2px 0 4px; }
        .mp-step { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.06); border-radius: 99px; padding: 6px 13px; }
        .mp-step.cur { color: ${T.success}; background: ${T.successSoft}; }
        .mp-arr { color: ${T.ink3}; font-weight: 700; }
        .mp-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .mp-demo { flex: 1; min-width: 200px; padding: 14px 20px; border: none; border-radius: 14px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s; }
        .mp-demo:hover { transform: translateY(-2px); }
        .mp-next { flex: 1; min-width: 160px; padding: 14px 20px; border: 1.5px solid rgba(${T.shadowBase},0.16); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .mp-next:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .mp-tip { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink3}; }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) — proyektorga katta shrift === */
        .rc-overlay { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
        .rc-head { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .rc-tag { font-weight: 800; font-size: clamp(11px,1.4vw,13px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 6px 14px; white-space: nowrap; }
        .rc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.4vw,22px); color: ${T.ink}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rc-x { background: ${T.paper}; border: none; border-radius: 10px; width: 36px; height: 36px; font-size: 15px; color: ${T.ink2}; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .rc-x:hover { color: ${T.accent}; }
        .rc-card { flex: 1; width: 100%; max-width: 880px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: clamp(10px,2.2vw,20px); padding: clamp(16px,3vw,28px) 0; animation: fade-step 0.35s ease-out; }
        .rc-ic { font-size: clamp(44px,8vw,76px); line-height: 1; }
        .rc-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4.6vw,44px); color: ${T.ink}; line-height: 1.12; max-width: 800px; margin: 0; }
        .rc-body { font-size: clamp(15px,2.4vw,21px); line-height: 1.55; color: ${T.ink2}; max-width: 720px; margin: 0; }
        .rc-body b { color: ${T.ink}; }
        .rc-vis { margin-top: clamp(4px,1vw,10px); display: flex; justify-content: center; width: 100%; }
        .rc-flow { display: flex; align-items: center; justify-content: center; gap: clamp(6px,1.4vw,12px); flex-wrap: wrap; }
        .rc-chip { font-weight: 700; font-size: clamp(13px,2vw,18px); background: ${T.paper}; color: ${T.ink}; border-radius: 12px; padding: clamp(8px,1.4vw,13px) clamp(12px,2vw,18px); box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2); white-space: nowrap; }
        .rc-arr { font-size: clamp(15px,2.2vw,22px); color: ${T.accent}; font-weight: 800; }
        .rc-ask { font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 18px; max-width: 660px; }
        .rc-nav { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; padding-top: 8px; }
        .rc-dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.ink}; color: ${T.bg}; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

        /* === ⚔️ CTA (yakun sahifasida) === */
        /* ===== ⚡ CODESTRIKE — CTA (dars ichida) ===== */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #FFF3EA, #FFE7DC); border: 1px solid #F3D9CC; border-radius: 20px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 16px 40px -18px rgba(255,79,40,0.28); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #121826; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: #525A6B; }
        .qz-cta-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: #E9E6DF; color: #98A0B4; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); } 50% { transform: scale(1.06); box-shadow: 0 16px 34px -6px rgba(255,79,40,0.9); } }

        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        /* Neon yonish-sekvensi: sahifa ochilganda vivyeska lip-lip etib yonadi */
        @keyframes cs-ignite {
          0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; }
          32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; }
          38% { opacity: 1; filter: none; }
          44% { opacity: .38; filter: saturate(.4) brightness(.65); }
          51% { opacity: 1; filter: none; }
          57% { opacity: .55; filter: saturate(.5) brightness(.75); }
          66%, 100% { opacity: 1; filter: none; } }
        @keyframes cs-breathe {
          0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); }
          50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }

        /* Kontur bo'ylab yuguruvchi tok-chizig'i */
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }

        /* Dars-DNK: suzuvchi tokenlar + tezlik-chiziqlar + yashin-flash */
        .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; line-height: 1; user-select: none;
          color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4);
          animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
        .cs-tok.back { color: rgba(150,115,240,.16); filter: blur(.6px); }
        @keyframes cs-float { 0%,100% { transform: translate(0,0) rotate(-5deg); } 50% { transform: translate(16px,-14px) rotate(5deg); } }
        .cs-dash { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(190,150,255,.55), transparent); animation: cs-dash-run 5.5s linear infinite; }
        @keyframes cs-dash-run { 0% { transform: translateX(-46px); opacity: 0; } 14% { opacity: .85; } 86% { opacity: .85; } 100% { transform: translateX(76px); opacity: 0; } }
        .cs-thunder { position: absolute; inset: 0; opacity: 0; background: radial-gradient(62% 95% at 50% 0%, rgba(222,192,255,.55), transparent 64%); animation: cs-thunder 6.4s linear infinite; }
        @keyframes cs-thunder { 0%, 90.5%, 100% { opacity: 0; } 91.4% { opacity: .5; } 92.3% { opacity: .07; } 93.4% { opacity: .38; } 95% { opacity: 0; } }

        /* Yon chaqmoqlar + hover-uchqunlar */
        .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
        .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
        /* Chaqmoqlar TIK turadi (aks/burilish yo'q) va TEZLIK RAMZIday chaqib turadi: yarq-yarq razryad + mikro-silkinish, navbatma-navbat */
        .csn-bolt { width: clamp(30px,4.6vw,54px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
        .csn-boltwrap.flip .csn-bolt { animation-delay: 1s; }
        @keyframes cs-bolt-strike {
          0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); }
          5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); }
          9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); }
          13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); }
          20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
        .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
        .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
        .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
        .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
        .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
        @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }

        /* Wordmark: oq→siyohrang neon, qiya-sport uslub */
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic;
          font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em;
          background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: cs-wglow 2.8s ease-in-out infinite; }
        .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none;
          background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
        @keyframes cs-wglow {
          0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); }
          50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
        @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
        .cs-clickable:hover .cs-word { animation-duration: 1.4s; }

        /* HUD-chiziq: turnir-tablo uslubidagi neon-pilyulalar */
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
        .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
        .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
        .cs-hud-dot { color: rgba(190,150,255,.6); }

        .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
        .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
        @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }

        /* Holatlar: xira kutish · jonli LIVE · bosish-portal */
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none;
          background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%);
          animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }

        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); backdrop-filter: blur(6px); transition: transform 0.25s, color 0.2s, background 0.2s; }
        .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
        .qz-logo { font-size: clamp(44px,8vw,72px); line-height: 1; }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
        .qz-sub b { color: #F2ECFF; }
        .qz-dimtxt { color: #8C86A8; font-family: 'Manrope'; font-size: 14px; font-style: italic; }
        .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
        .qz-pchip { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(186,140,255,0.34); color: #F2ECFF; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; box-shadow: 0 0 18px rgba(124,58,237,0.2); animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px rgba(255,79,40,0.45); }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px rgba(255,79,40,0.6), inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
        .qz-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .qz-btn:disabled { opacity: 0.5; cursor: default; }
        .qz-btn.big { font-size: clamp(16px,2.2vw,19px); padding: clamp(15px,2vw,18px) clamp(32px,4vw,46px); }
        .qz-btn.ghost { background: linear-gradient(170deg,#7C3AED,#5B21B6); color: #F2ECFF; border: 1px solid rgba(186,140,255,0.5); box-shadow: 0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
        .qz-btn.ghost:hover:not(:disabled) { box-shadow: 0 0 34px rgba(140,72,255,0.6), inset 0 1px 0 rgba(255,255,255,0.2); }
        .qz-waitmsg { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #3CE88E; text-align: center; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-qview { max-width: 880px; }
        .qz-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .qz-count { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: #B9A8E6; }
        .qz-count b { color: #F2ECFF; font-size: 1.25em; }
        .qz-ansn { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: #FF7A4D; min-width: 64px; text-align: right; text-shadow: 0 0 12px rgba(255,90,44,0.4); }
        .qz-timer { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .qz-timer-n { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
        .qz-timer.urgent { animation: qz-shake 0.5s ease-in-out infinite; }
        @keyframes qz-shake { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #F2ECFF; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.34); border-radius: 20px; padding: clamp(18px,2.8vw,28px) clamp(18px,3vw,30px); width: 100%; box-shadow: 0 0 34px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.06); backdrop-filter: blur(8px); text-wrap: balance; }
        .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(11px,1.6vw,15px); width: 100%; }
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } .qz-wm { font-size: clamp(24px,7vw,34px); } }
        .qz-tile { --gl: 255,255,255; position: relative; display: flex; align-items: center; gap: 14px; border: none; border-radius: 18px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 66px; color: #fff; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(0,0,0,0.55), 0 0 26px -4px rgba(var(--gl),0.42), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -4px 0 rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(0,0,0,0.24); transition: transform 0.14s, opacity 0.3s, box-shadow 0.14s, filter 0.2s; }
        .qz-grid .qz-tile:nth-child(1) { --gl: 255,90,44; }
        .qz-grid .qz-tile:nth-child(2) { --gl: 15,166,214; }
        .qz-grid .qz-tile:nth-child(3) { --gl: 245,166,35; }
        .qz-grid .qz-tile:nth-child(4) { --gl: 34,160,92; }
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); box-shadow: 0 18px 34px -12px rgba(0,0,0,0.6), 0 0 40px -2px rgba(var(--gl),0.6), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -4px 0 rgba(0,0,0,0.24), inset 0 0 0 1.5px rgba(0,0,0,0.26); }
        .qz-tile:active:not(:disabled):not(.rv) { transform: translateY(2px) scale(0.985); }
        .qz-tile:disabled { cursor: default; }
        .qz-shape { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.22); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: clamp(16px,2.2vw,20px); color: #fff; flex-shrink: 0; }
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
        .qz-tile.faded { filter: saturate(0.5); opacity: 0.4; }
        .qz-tile.picked { outline: 3px solid #fff; box-shadow: 0 0 0 4px rgba(255,255,255,0.4), 0 14px 26px -12px rgba(0,0,0,0.4); animation: qz-pop 0.3s; }
        .qz-pbadge { position: absolute; top: -9px; right: -7px; width: 27px; height: 27px; border-radius: 50%; background: #fff; color: #12A968; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 12px rgba(0,0,0,0.28); }
        .qz-tile.rv.win { outline: 4px solid #fff; box-shadow: 0 0 0 5px rgba(43,217,124,0.45), 0 0 60px rgba(43,217,124,0.7), 0 14px 30px -12px rgba(0,0,0,0.5); animation: qz-pop 0.4s; }
        .qz-tile.rv.lose { filter: saturate(0.45); opacity: 0.4; }
        .qz-cnt { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.2vw,19px); color: #fff; background: rgba(0,0,0,0.22); border-radius: 99px; padding: 4px 13px; flex-shrink: 0; margin-left: auto; font-variant-numeric: tabular-nums; }
        .qz-mrow { display: flex; align-items: center; gap: 14px; }
        .qz-allin { font-family: 'Manrope'; font-weight: 700; font-size: 15px; color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); animation: qz-pop 0.4s; }
        .qz-res { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; justify-content: center; border-radius: 16px; padding: 14px 26px; animation: qz-pop 0.45s cubic-bezier(.34,1.5,.4,1); }
        .qz-res.good { background: rgba(43,217,124,0.15); outline: 1.5px solid rgba(43,217,124,0.5); box-shadow: 0 0 30px rgba(43,217,124,0.28); }
        .qz-res.bad { background: rgba(255,90,90,0.14); outline: 1.5px solid rgba(255,90,90,0.42); box-shadow: 0 0 30px rgba(255,90,90,0.22); }
        .qz-res-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,4.4vw,40px); color: #3CE88E; line-height: 1; text-shadow: 0 0 20px rgba(60,232,142,0.45); font-variant-numeric: tabular-nums; }
        .qz-res-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #F2ECFF; }
        .qz-res-rank { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: #B9A8E6; width: 100%; text-align: center; }
        .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.32); border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 0 32px rgba(124,58,237,0.25); backdrop-filter: blur(8px); }
        .qz-board.wide { max-width: 640px; max-height: 260px; overflow: auto; }
        .qz-board-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.1em; color: #FF7A4D; margin-bottom: 3px; text-transform: uppercase; text-shadow: 0 0 12px rgba(255,90,44,0.4); }
        .qz-brow { display: flex; align-items: center; gap: 10px; padding: 8px 11px; border-radius: 11px; background: rgba(255,255,255,0.05); }
        .qz-brow.me { background: linear-gradient(90deg,rgba(43,217,124,0.26),rgba(43,217,124,0.06)); outline: 1.5px solid rgba(43,217,124,0.55); }
        .qz-brank { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: #F2ECFF; background: rgba(255,255,255,0.18); border-radius: 8px; min-width: 23px; height: 23px; display: flex; align-items: center; justify-content: center; }
        .qz-brow:first-of-type .qz-brank { background: #FFCE3D; color: #1B0F3F; box-shadow: 0 0 14px rgba(255,206,61,0.5); }
        .qz-brow.me .qz-brank { background: #2BD97C; color: #0B2417; }
        .qz-bname { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #F2ECFF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-bstreak { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: #FF9A5D; }
        .qz-bok { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: #B9A8E6; }
        .qz-bpts { font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: #FF7A4D; min-width: 52px; text-align: right; font-variant-numeric: tabular-nums; text-shadow: 0 0 10px rgba(255,90,44,0.35); }
        .qz-pod { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2.4vw,24px); padding-top: 18px; }
        .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
        .qz-crown { position: absolute; top: -30px; font-size: 28px; animation: qz-float-sm 2s ease-in-out infinite; }
        @keyframes qz-float-sm { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(4deg); } }
        .qz-pod-medal { font-size: clamp(30px,5vw,46px); line-height: 1; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.4)); }
        .qz-pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,2vw,18px); color: #F2ECFF; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-pod-pts { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.5vw,13px); color: #B9A8E6; font-variant-numeric: tabular-nums; }
        .qz-pod-bar { width: 100%; border-radius: 14px 14px 0 0; box-shadow: inset 0 2px 0 rgba(255,255,255,0.45); animation: qz-rise 0.9s cubic-bezier(.3,1.2,.4,1); transform-origin: bottom; }
        @keyframes qz-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .qz-pod-col.p1 .qz-pod-bar { height: clamp(96px,14vw,156px); background: linear-gradient(180deg, #FFDE6B, #F5A623); box-shadow: inset 0 2px 0 rgba(255,255,255,0.55), 0 0 54px rgba(245,166,35,0.55); }
        .qz-pod-col.p2 .qz-pod-bar { height: clamp(66px,10vw,110px); background: linear-gradient(180deg, #E4E7EE, #A2A8B4); box-shadow: inset 0 2px 0 rgba(255,255,255,0.55), 0 0 30px rgba(214,217,224,0.35); }
        .qz-pod-col.p3 .qz-pod-bar { height: clamp(48px,7vw,82px); background: linear-gradient(180deg, #F4C08F, #CB8149); box-shadow: inset 0 2px 0 rgba(255,255,255,0.4), 0 0 30px rgba(237,177,131,0.35); }
        .qz-pod-col.me .qz-pod-name { color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: #B9A8E6; }
        .qz-mypl b { color: #3CE88E; }
        .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FF7A4D; text-shadow: 0 0 40px rgba(255,90,44,0.55); font-variant-numeric: tabular-nums; }
        .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(27,15,63,0.86); border: 1px solid rgba(186,140,255,0.4); border-radius: 16px; padding: 10px 16px; color: #F2ECFF; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; box-shadow: 0 0 34px rgba(124,58,237,0.35); backdrop-filter: blur(10px); }

        /* === 🏆 PODIUM / STATISTIKA SAHIFASI === */
        .pod-stage { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2vw,20px); padding-top: 8px; }
        .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.success}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.success}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }
        .pod-qstats { display: flex; flex-direction: column; gap: 8px; }
        .qstat-row { display: flex; align-items: center; gap: 10px; }
        .qstat-lbl { min-width: clamp(120px,22vw,190px); font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .qstat-n { min-width: 40px; text-align: right; font-size: 12px; color: ${T.ink2}; }
        .pm-pop { animation: pmPop 0.5s cubic-bezier(.34,1.55,.5,1); }
        @keyframes pmPop { 0% { transform: scale(0.9); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        .pm-match { animation: pmMatch 0.55s cubic-bezier(.34,1.5,.5,1); }
        @keyframes pmMatch { 0% { transform: scale(1); } 35% { transform: scale(1.06); box-shadow: 0 0 0 5px rgba(31,122,77,0.16); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(31,122,77,0); } }
        .pm-shake { animation: shake 0.4s ease; }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
        /* kod atamasi chipi — savol/variant/izohlarda oddiy matndan ajralib turadi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
      `}</style>
      <style>{`
        /* ===== 🖥️ VS CODE MOCKUP (dark-theme) ===== */
        .vsc { border-radius: 13px; overflow: hidden; background: ${VSC.bg}; box-shadow: 0 14px 34px -10px rgba(${T.shadowBase},0.35); font-family: 'JetBrains Mono', monospace; }
        .vsc-tbar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .vsc-title { font-size: 10.5px; color: #9d9d9d; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .vsc-body { display: flex; align-items: stretch; min-height: 150px; }
        .vsc-act { background: ${VSC.act}; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 0; width: 40px; flex-shrink: 0; }
        .vsc-actic { position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #858585; border-left: 2px solid transparent; border-radius: 6px; }
        .vsc-actic.on { color: #fff; border-left-color: #fff; }
        .vsc-side { position: relative; background: ${VSC.side}; width: clamp(96px,15vw,150px); flex-shrink: 0; padding: 8px 6px; display: flex; flex-direction: column; gap: 2px; }
        .vsc-sidehead { font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; color: #BBBBBB; padding: 2px 6px 6px; display: flex; align-items: center; gap: 6px; }
        .vsc-newfile { margin-left: auto; font-size: 9px; color: #cccccc; background: rgba(255,255,255,0.09); border-radius: 4px; padding: 1px 4px; }
        .vsc-file { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #CCCCCC; padding: 3px 7px; border-radius: 5px; }
        .vsc-file.on { background: rgba(255,255,255,0.09); color: #fff; }
        .vsc-fic { font-size: 9.5px; font-weight: 700; }
        .vsc-mainwrap { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .vsc-main { position: relative; flex: 1; display: flex; flex-direction: column; background: ${VSC.bg}; }
        .vsc-tabs { display: flex; align-items: center; background: ${VSC.side}; }
        .vsc-tab { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; color: #969696; padding: 6px 12px; border-right: 1px solid ${VSC.bg}; }
        .vsc-tab.on { background: ${VSC.bg}; color: #fff; box-shadow: inset 0 1.5px 0 #007ACC; }
        .vsc-code { padding: 8px 4px; display: flex; flex-direction: column; gap: 1px; overflow-x: auto; }
        .vsc-ln { display: flex; align-items: center; gap: 10px; font-size: clamp(10.5px,1.4vw,12.5px); line-height: 1.7; white-space: nowrap; }
        .vsc-lnum { min-width: 20px; text-align: right; color: #6e7681; font-size: 10px; flex-shrink: 0; user-select: none; }
        .vsc-lcode { color: ${VSC.text}; }
        .vsc-note { font-family: 'Manrope', sans-serif; font-size: 12px; color: #9d9d9d; padding: 10px 14px; margin: 0; }
        .vsc-caret { display: inline-block; width: 2px; height: 1em; background: #AEAFAD; vertical-align: text-bottom; animation: vsc-blink 1s steps(1) infinite; }
        @keyframes vsc-blink { 50% { opacity: 0; } }
        .vsc-panel { background: #181818; border-top: 1px solid ${VSC.line}; padding: 7px 12px; display: flex; flex-direction: column; gap: 3px; position: relative; }
        .vsc-panelh { font-size: 9px; font-weight: 700; letter-spacing: 0.09em; color: #BBBBBB; }
        .vsc-prompt { font-size: 11px; color: #CCCCCC; }
        .vsc-status { background: ${VSC.blue}; display: flex; align-items: center; justify-content: space-between; padding: 4px 12px; }
        .vsc-st-l, .vsc-st-r { font-size: 10.5px; color: #fff; font-weight: 600; }
        .vsc-st-r.pulse { animation: vsc-golive 1.4s ease-in-out infinite; border-radius: 6px; padding: 1px 7px; }
        @keyframes vsc-golive { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); background: rgba(255,255,255,0.0); } 50% { box-shadow: 0 0 0 3px rgba(255,255,255,0.35); background: rgba(255,255,255,0.22); } }
        .vsc-teaser { filter: blur(3px) saturate(0.7); opacity: 0.75; pointer-events: none; transition: filter 0.4s; }
        /* hotspot rejimi (s3) */
        .vsc-hot { cursor: pointer; transition: box-shadow 0.2s, background 0.2s; }
        .vsc-hot:not(.seen) { animation: tap-hint 1.8s ease-in-out infinite; }
        .vsc-hot.hoton { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .vsc-seenmark { color: #3CE88E; font-weight: 800; margin-left: 4px; }
        /* Extensions paneli */
        .vsc-extsearch { font-size: 10.5px; color: #9d9d9d; background: #3C3C3C; border-radius: 5px; padding: 4px 8px; margin: 0 2px 6px; }
        .vsc-extrow { display: flex; align-items: center; gap: 7px; padding: 5px 6px; border-radius: 6px; }
        .vsc-extrow.on { background: rgba(0,122,204,0.22); }
        .vsc-extic { font-size: 15px; }
        .vsc-extinfo { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .vsc-extinfo b { font-size: 10.5px; color: #fff; font-weight: 700; }
        .vsc-extinfo i { font-size: 8.5px; color: #9d9d9d; font-style: normal; }
        .vsc-extbtn { font-size: 9px; font-weight: 700; color: #fff; background: #0E639C; border-radius: 4px; padding: 2px 7px; animation: tap-hint 1.8s ease-in-out infinite; }
        .em-tabhint { margin-left: 12px; font-size: 10px; font-weight: 700; color: #1E1E1E; background: #FFD380; border-radius: 5px; padding: 2px 8px; animation: dl-pulse 1.1s ease-in-out infinite; }

        /* ===== 🌐 BRAUZER MOCKUP ===== */
        .brw { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.22); }
        .brw-top { background: #DEE1E6; padding: 7px 11px 0; display: flex; align-items: flex-end; gap: 9px; }
        .brw-top .bb-dots { margin-bottom: 7px; }
        .brw-tab { font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink}; background: #F6F4EF; border-radius: 8px 8px 0 0; padding: 5px 14px; }
        .brw-addr { background: #F6F4EF; display: flex; align-items: center; gap: 8px; padding: 6px 11px; border-bottom: 1px solid #E4E1DA; }
        .brw-lock { font-size: 10px; }
        .brw-url { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 600; color: ${T.ink}; background: #fff; border-radius: 99px; padding: 4px 12px; box-shadow: inset 0 0 0 1px #E4E1DA; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .brw-go { font-size: 12px; color: ${T.ink2}; }
        .brw-body { background: #fff; }

        /* ===== 🪪 VIZITKA-CARD PREVIEW ===== */
        .vcard-stage { background: #EDEBE0; padding: clamp(18px,3vw,30px) 16px; }
        .vcard { width: min(240px, 82%); padding: 18px 16px; transition: background 0.35s, border-radius 0.35s, box-shadow 0.35s, margin 0.35s; }
        .vcard-logo { background: #fff; border-radius: 14px; padding: clamp(12px,2vw,18px); text-align: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(20px,3vw,26px); color: #3FAE2A; }
        .vcard-name { text-align: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,2.2vw,19px); margin-top: 13px; }
        .vcard-prof { text-align: center; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(11.5px,1.6vw,13.5px); margin-top: 3px; }
        .vcard-plainwrap { padding: 16px 18px; }
        .vcard-plainlogo { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 20px; color: ${T.ink2}; border: 1.5px dashed ${T.ink3}; border-radius: 6px; padding: 8px 12px; }
        .vcard-plainname { font-family: 'Georgia, serif'; font-size: clamp(18px,2.6vw,24px); color: ${T.ink}; margin: 10px 0 2px; }
        .vcard-plainprof { font-family: 'Georgia, serif'; color: ${T.ink2}; margin: 0; font-size: clamp(13px,1.8vw,15px); }
        .vc-namelab { display: flex; flex-direction: column; gap: 7px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); color: ${T.ink2}; }
        /* «o'zi yig'iladi» animatsiyasi (s1, s14) */
        .vc-anim .vcard { animation: vc-pop 0.55s cubic-bezier(.34,1.35,.5,1) both; }
        .vc-anim .vc-a1 { animation: vc-rise 0.5s ease-out 0.35s both; }
        .vc-anim .vc-a2 { animation: vc-rise 0.5s ease-out 0.6s both; }
        .vc-anim .vc-a3 { animation: vc-rise 0.5s ease-out 0.8s both; }
        @keyframes vc-pop { 0% { opacity: 0; transform: translateY(18px) scale(0.9); } 100% { opacity: 1; transform: none; } }
        @keyframes vc-rise { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: none; } }

        /* ===== ✅ «BAJARDIM»-CHECKLIST ===== */
        .clk { display: flex; flex-direction: column; gap: 8px; }
        .clk-head { display: flex; align-items: center; justify-content: space-between; }
        .clk-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink2}; letter-spacing: 0.02em; }
        .clk-count { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 3px 11px; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); }
        .clk-count.ok { color: #fff; background: ${T.success}; }
        .clk-row { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 13px; padding: 11px 13px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.2s, background 0.2s; }
        .clk-row.on { background: ${T.successSoft}; box-shadow: 0 5px 14px -6px rgba(31,122,77,0.25); }
        .clk-num { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: ${T.ink2}; box-shadow: inset 0 0 0 2px ${T.ink3}; }
        .clk-row.on .clk-num { color: #fff; background: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .clk-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .clk-t { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.6vw,14px); color: ${T.ink}; line-height: 1.35; }
        .clk-d { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; line-height: 1.35; }
        .clk-btn { flex-shrink: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(11px,1.4vw,12.5px); border: none; border-radius: 99px; padding: 7px 13px; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.ink3}66; transition: all 0.18s; }
        .clk-btn:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${T.success}; }
        .clk-btn.on { background: ${T.success}; color: #fff; box-shadow: 0 5px 12px -4px rgba(31,122,77,0.5); }
        .clk-btn:disabled { opacity: 0.55; cursor: default; }
        .clk-done { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.6vw,14px); color: ${T.success}; }

        /* ===== 📥 O'RNATISH MOCKUP'LARI (s2) ===== */
        .inst-site { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 18px 16px; text-align: center; }
        .inst-logo { width: 44px; height: 44px; border-radius: 11px; background: linear-gradient(135deg,#2A9FE8,#0065A9); color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 17px; }
        .inst-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,2vw,18px); color: #1B1B1F; margin: 0; }
        .inst-sub { font-family: 'Manrope', sans-serif; font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; margin: 0; }
        .inst-dl { display: inline-block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.6vw,14px); color: #fff; background: #0078D4; border-radius: 8px; padding: 9px 18px; box-shadow: 0 8px 18px -6px rgba(0,120,212,0.55); animation: tap-hint 1.8s ease-in-out infinite; }
        .inst-dl.on { animation: none; opacity: 0.85; }
        .inst-dlrow { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 340px; margin-top: 6px; }
        .inst-dlfile { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink}; background: #F1EFE8; border-radius: 7px; padding: 6px 10px; white-space: nowrap; }
        .inst-dlbar { flex: 1; height: 7px; border-radius: 99px; background: #E4E1DA; overflow: hidden; }
        .inst-dlbar i { display: block; height: 100%; width: 70%; border-radius: 99px; background: #0078D4; animation: inst-load 1.6s ease-in-out infinite; }
        @keyframes inst-load { 0% { width: 12%; } 60% { width: 82%; } 100% { width: 95%; } }
        .inst-setup { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.22); }
        .inst-setbar { background: #E9E7E0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: ${T.ink}; padding: 8px 13px; }
        .inst-setbody { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
        .inst-setrow { font-family: 'Manrope', sans-serif; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; margin: 0; }
        .inst-setbtns { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
        .inst-setbtns span { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: #F1EFE8; border-radius: 7px; padding: 6px 16px; }
        .inst-setbtns span.on { color: #fff; background: #0078D4; animation: tap-hint 1.8s ease-in-out infinite; }

        /* ===== ⌨️ SHORTCUT KEYCAP'LAR (s12) ===== */
        .kcap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 11px; }
        @media (max-width: 560px) { .kcap-grid { grid-template-columns: 1fr; } }
        .kcap-card { display: flex; flex-direction: column; align-items: center; gap: 10px; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(14px,2.2vw,20px); cursor: pointer; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.18); transition: transform 0.15s, box-shadow 0.2s; }
        .kcap-card:hover { transform: translateY(-2px); }
        .kcap-card:not(.seen) { animation: tap-hint 1.8s ease-in-out infinite; }
        .kcap-card.on { box-shadow: 0 0 0 2px ${T.accent}, 0 10px 24px -8px rgba(255,79,40,0.3); }
        .kcap-card.seen .kcap-name { color: ${T.success}; }
        .kcap-keys { display: flex; align-items: center; gap: 6px; }
        .kcap-keys b { color: ${T.ink3}; font-family: 'Manrope', sans-serif; }
        .kcap { display: inline-flex; align-items: center; justify-content: center; min-width: 34px; padding: 7px 10px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,1.6vw,14px); color: ${T.ink}; background: linear-gradient(180deg,#FFFFFF,#EDEAE2); border-radius: 8px; box-shadow: 0 3px 0 #CFCBC1, 0 5px 10px -4px rgba(${T.shadowBase},0.3); }
        .kcap-card:active .kcap { transform: translateY(2px); box-shadow: 0 1px 0 #CFCBC1; }
        .kcap-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.6vw,14px); color: ${T.ink2}; }

        /* ===== 🧲 KOD-HOTSPOT (s9) + YOZMA FINAL (s13) ===== */
        .cd-hot { display: inline-block; border-radius: 6px; padding: 1px 4px; }
        .cd-hot:not(.cd-seen) { animation: tap-hint 1.8s ease-in-out infinite; }
        .cd-hot.cd-seen { box-shadow: inset 0 0 0 1.5px rgba(60,232,142,0.5); }
        .ft-statwrap { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }
        .ft-stat { border-radius: 9px; padding: 8px 14px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.3); }
        .ft-blank { display: inline-block; min-width: 74px; text-align: center; background: rgba(255,255,255,0.25); border-radius: 5px; letter-spacing: 0.12em; }
        .ft-inputrow { display: flex; flex-direction: column; gap: 8px; }
        .yz-hint { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink2}; font-style: italic; }
        .yz-ok { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,15px); color: ${T.success}; }

        @media (prefers-reduced-motion: reduce) {
          .vsc-caret, .vsc-st-r.pulse, .vsc-hot:not(.seen), .vsc-extbtn, .em-tabhint, .inst-dl, .inst-dlbar i, .inst-setbtns span.on,
          .kcap-card:not(.seen), .cd-hot:not(.cd-seen), .vc-anim .vcard, .vc-anim .vc-a1, .vc-anim .vc-a2, .vc-anim .vc-a3 { animation: none !important; opacity: 1; }
        }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: '1-Modul', ru: 'Модуль 1' })} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>
          )}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
      {/* Lokal praktika overlay (LMS compilatorining o'rnini bosadi — test rejimi).
          Production'da onPractice berilsa, bu overlay umuman ochilmaydi. */}
      {practice && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
          <HtmlCompiler
            task={practice.task}
            starterCode={practice.starter ? tr(practice.starter) : undefined}
            onContinue={practice.done}
            onBack={() => setPractice(null)}
          />
        </div>
      )}
      {/* Jonli darsda mentor praktika paneli — o'quvchilar yozadi, keyin mentor doskada ko'rsatadi */}
      {mentorPractice && (
        <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => setMentorPractice(null)} />
      )}
    </LangContext.Provider>
  );
}
