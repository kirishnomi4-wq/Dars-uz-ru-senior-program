// ============================================================
//  UMUMIY MODUL — LMS TASHQI-MODUL (avto-yig'ilgan, QO'LDA TAHRIRLAMANG)
//  Manba:   src/compilator/HtmlCompiler.jsx
//  Nashr:   2026-08-17
//  Mazmun:  sof ESM, JSX YO'Q, faqat `react` import qilinadi.
//  Eksport: default (kompilyator) · checks · HC_NASHR
//  Qayta yig'ish:  node scripts/build-shared-module.mjs
// ============================================================
// scripts/.react-shim.tmp.mjs
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, isValidElement } from "react";

// src/compilator/HtmlCompiler.jsx
var __lang = "uz";
var tr = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var useMedia = (q) => {
  const [on, setOn] = useState(() => typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(q);
    const upd = () => setOn(mq.matches);
    upd();
    if (mq.addEventListener) {
      mq.addEventListener("change", upd);
      return () => mq.removeEventListener("change", upd);
    }
    mq.addListener(upd);
    return () => mq.removeListener(upd);
  }, [q]);
  return on;
};
var TOUCH_KEYS = {
  html: ["<", ">", "/", '"', "=", "#", "-"],
  css: ["{", "}", ":", ";", ".", "#", "-"],
  js: ["(", ")", "{", "}", ";", "=", '"']
};
var codesRead = (k) => {
  try {
    const v = JSON.parse(localStorage.getItem(k) || "null");
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
};
var codesWrite = (k, codes) => {
  try {
    localStorage.setItem(k, JSON.stringify({ codes, savedAt: Date.now() }));
  } catch {
  }
};
var HC_T = {
  bg: "#F6F4EF",
  ink: "#0E0E10",
  ink2: "#5A5A60",
  ink3: "#A7A6A2",
  paper: "#FFFFFF",
  accent: "#FF4D26",
  accent2: "#FF8A3D",
  accentSoft: "#FFEDE5",
  success: "#0FA968",
  successSoft: "#E4F7EE",
  warn: "#9A5400",
  shadowBase: "58, 53, 48",
  line: "#E9E6DF"
};
var HC_CODE = {
  bg: "#0E1525",
  text: "#E7EAF2",
  gutter: "#1C2740",
  tag: "#FF7755",
  attr: "#FFD380",
  str: "#7DD181",
  comment: "#6B7585",
  punct: "#9FB4D8",
  num: "#C9A9FF"
};
var esc = (s) => String(s).replace(/[&<>]/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;");
var tok = (cls, s) => s ? '<i class="t-' + cls + '">' + esc(s) + "</i>" : "";
var NAME_CH = /[a-zA-Z0-9:_-]/;
function hlHtml(src) {
  let out = "", i = 0;
  const n = src.length;
  while (i < n) {
    const lt = src.indexOf("<", i);
    if (lt === -1) {
      out += esc(src.slice(i));
      break;
    }
    out += esc(src.slice(i, lt));
    if (src.startsWith("<!--", lt)) {
      const e = src.indexOf("-->", lt + 4);
      const end = e === -1 ? n : e + 3;
      out += tok("comment", src.slice(lt, end));
      i = end;
      continue;
    }
    if (src[lt + 1] === "!") {
      const e = src.indexOf(">", lt);
      const end = e === -1 ? n : e + 1;
      out += tok("comment", src.slice(lt, end));
      i = end;
      continue;
    }
    const isClose = src[lt + 1] === "/";
    const ns = lt + (isClose ? 2 : 1);
    let j = ns;
    while (j < n && NAME_CH.test(src[j])) j++;
    if (j === ns) {
      out += esc("<");
      i = lt + 1;
      continue;
    }
    out += tok("punct", isClose ? "</" : "<") + tok("tag", src.slice(ns, j));
    while (j < n && src[j] !== ">" && src[j] !== "<") {
      const c = src[j];
      if (/\s/.test(c)) {
        out += esc(c);
        j++;
        continue;
      }
      if (c === "=" || c === "/") {
        out += tok("punct", c);
        j++;
        continue;
      }
      if (c === '"' || c === "'") {
        let k2 = j + 1;
        while (k2 < n && src[k2] !== c) k2++;
        const end = Math.min(k2 + 1, n);
        out += tok("str", src.slice(j, end));
        j = end;
        continue;
      }
      let k = j;
      while (k < n && NAME_CH.test(src[k])) k++;
      if (k === j) {
        out += esc(c);
        j++;
        continue;
      }
      out += tok("attr", src.slice(j, k));
      j = k;
    }
    if (src[j] === ">") {
      out += tok("punct", ">");
      j++;
    }
    i = j;
  }
  return out;
}
function hlCss(src) {
  let out = "", i = 0, inBlock = false, afterColon = false;
  const n = src.length;
  while (i < n) {
    if (src.startsWith("/*", i)) {
      const e = src.indexOf("*/", i + 2);
      const end = e === -1 ? n : e + 2;
      out += tok("comment", src.slice(i, end));
      i = end;
      continue;
    }
    const c = src[i];
    if (c === "{") {
      out += tok("punct", c);
      inBlock = true;
      afterColon = false;
      i++;
      continue;
    }
    if (c === "}") {
      out += tok("punct", c);
      inBlock = false;
      afterColon = false;
      i++;
      continue;
    }
    if (c === ";") {
      out += tok("punct", c);
      afterColon = false;
      i++;
      continue;
    }
    if (c === ":" && inBlock) {
      out += tok("punct", c);
      afterColon = true;
      i++;
      continue;
    }
    let j = i;
    while (j < n && !"{};".includes(src[j]) && !(src[j] === ":" && inBlock) && !src.startsWith("/*", j)) j++;
    const chunk = src.slice(i, j);
    const lead = /^\s*/.exec(chunk)[0];
    const body = chunk.slice(lead.length);
    out += esc(lead) + (!inBlock ? tok("tag", body) : afterColon ? tok("str", body) : tok("attr", body));
    i = j;
  }
  return out;
}
var JS_KW = /* @__PURE__ */ new Set(["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "break", "continue", "new", "class", "extends", "typeof", "instanceof", "null", "undefined", "true", "false", "this", "import", "export", "from", "async", "await", "try", "catch", "finally", "throw", "switch", "case", "default", "of", "in"]);
function hlJs(src) {
  let out = "", i = 0;
  const n = src.length;
  while (i < n) {
    if (src.startsWith("//", i)) {
      let e = src.indexOf("\n", i);
      if (e === -1) e = n;
      out += tok("comment", src.slice(i, e));
      i = e;
      continue;
    }
    if (src.startsWith("/*", i)) {
      const e = src.indexOf("*/", i + 2);
      const end = e === -1 ? n : e + 2;
      out += tok("comment", src.slice(i, end));
      i = end;
      continue;
    }
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < n && src[j] !== c) {
        if (src[j] === String.fromCharCode(92)) j++;
        j++;
      }
      out += tok("str", src.slice(i, Math.min(j + 1, n)));
      i = Math.min(j + 1, n);
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < n && /[\w$]/.test(src[j])) j++;
      const w = src.slice(i, j);
      out += JS_KW.has(w) ? tok("tag", w) : esc(w);
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[\d.]/.test(src[j])) j++;
      out += tok("num", src.slice(i, j));
      i = j;
      continue;
    }
    out += esc(c);
    i++;
  }
  return out;
}
var HL_MAX = 2e4;
var highlight = (src, lang) => {
  if (!src) return "";
  if (src.length > HL_MAX) return esc(src);
  try {
    return lang === "css" ? hlCss(src) : lang === "js" ? hlJs(src) : hlHtml(src);
  } catch {
    return esc(src);
  }
};
function parseNodes(src) {
  const nodes = [];
  let i = 0;
  const n = src.length;
  const pushText = (s) => {
    if (s) nodes.push({ t: "text", raw: s });
  };
  while (i < n) {
    const lt = src.indexOf("<", i);
    if (lt === -1) {
      pushText(src.slice(i));
      break;
    }
    pushText(src.slice(i, lt));
    if (src.startsWith("<!--", lt)) {
      const e = src.indexOf("-->", lt + 4);
      if (e === -1) return null;
      nodes.push({ t: "comment", raw: src.slice(lt, e + 3) });
      i = e + 3;
      continue;
    }
    if (src[lt + 1] === "!") {
      const e = src.indexOf(">", lt);
      if (e === -1) return null;
      nodes.push({ t: "doctype", raw: src.slice(lt, e + 1) });
      i = e + 1;
      continue;
    }
    let j = lt + 1, q = null;
    while (j < n) {
      const c = src[j];
      if (q) {
        if (c === q) q = null;
      } else if (c === '"' || c === "'") q = c;
      else if (c === ">") break;
      else if (c === "<") return null;
      j++;
    }
    if (j >= n) return null;
    const raw = src.slice(lt, j + 1);
    const m = /^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(raw);
    if (!m) return null;
    const name = m[1].toLowerCase();
    const close = raw[1] === "/";
    const self = /\/\s*>$/.test(raw) || VOID_TAGS.has(name);
    nodes.push({ t: close ? "close" : self ? "self" : "open", name, raw });
    i = j + 1;
  }
  return nodes;
}
var domFingerprint = (nodes) => nodes.map((x) => x.t === "text" ? "T:" + x.raw.replace(/\s+/g, " ").trim() : x.t === "comment" || x.t === "doctype" ? x.t + ":" + x.raw.replace(/\s+/g, " ") : x.t + ":" + x.name + ":" + x.raw.replace(/\s+/g, " ")).filter((s) => s !== "T:").join("|");
function formatHtml(src) {
  if (!src || !src.trim()) return null;
  if (/<(pre|textarea)\b/i.test(src)) return null;
  const nodes = parseNodes(src);
  if (!nodes) return null;
  const IND = "  ";
  const out = [];
  let depth = 0;
  for (let k = 0; k < nodes.length; k++) {
    const nd = nodes[k];
    if (nd.t === "text") {
      const txt = nd.raw.replace(/\s+/g, " ").trim();
      if (txt) out.push(IND.repeat(depth) + txt);
      continue;
    }
    if (nd.t === "close") {
      depth = Math.max(0, depth - 1);
      out.push(IND.repeat(depth) + nd.raw);
      continue;
    }
    if (nd.t === "open") {
      const a = nodes[k + 1], b = nodes[k + 2];
      if (a && b && a.t === "text" && b.t === "close" && b.name === nd.name) {
        const txt = a.raw.replace(/\s+/g, " ").trim();
        const line = nd.raw + txt + b.raw;
        if (!txt.includes("\n") && (IND.repeat(depth) + line).length <= 100) {
          out.push(IND.repeat(depth) + line);
          k += 2;
          continue;
        }
      }
      out.push(IND.repeat(depth) + nd.raw);
      depth++;
      continue;
    }
    out.push(IND.repeat(depth) + nd.raw);
  }
  const res = out.join("\n");
  const back = parseNodes(res);
  if (!back || domFingerprint(back) !== domFingerprint(nodes)) return null;
  return res;
}
var TAG_MENU = [
  { t: "h1", d: { uz: "eng katta sarlavha", ru: "самый большой заголовок" } },
  { t: "h2", d: { uz: "bo'lim sarlavhasi", ru: "заголовок раздела" } },
  { t: "h3", d: { uz: "kichik sarlavha", ru: "малый заголовок" } },
  { t: "p", d: { uz: "matn xatboshisi", ru: "абзац текста" } },
  { t: "a", d: { uz: "havola", ru: "ссылка" } },
  { t: "img", d: { uz: "rasm", ru: "картинка" } },
  { t: "ul", d: { uz: "ro'yxat", ru: "список" } },
  { t: "ol", d: { uz: "raqamli ro'yxat", ru: "нумерованный список" } },
  { t: "li", d: { uz: "ro'yxat bandi", ru: "пункт списка" } },
  { t: "header", d: { uz: "sahifa boshi", ru: "шапка страницы" } },
  { t: "nav", d: { uz: "menyu", ru: "меню" } },
  { t: "section", d: { uz: "bo'lim", ru: "раздел" } },
  { t: "footer", d: { uz: "sahifa pasti", ru: "подвал страницы" } },
  { t: "div", d: { uz: "oddiy quti", ru: "обычный блок" } },
  { t: "span", d: { uz: "matn ichidagi bo'lak", ru: "кусочек внутри текста" } },
  { t: "strong", d: { uz: "qalin matn", ru: "жирный текст" } },
  { t: "em", d: { uz: "qiya matn", ru: "наклонный текст" } },
  { t: "br", d: { uz: "qator uzish", ru: "перенос строки" } },
  { t: "button", d: { uz: "tugma", ru: "кнопка" } }
];
var ATTR_MENU = {
  a: [{ a: "href", d: { uz: "qayerga olib boradi", ru: "куда ведёт" } }],
  img: [{ a: "src", d: { uz: "rasm manzili", ru: "адрес картинки" } }, { a: "alt", d: { uz: "rasm o'rnidagi matn", ru: "текст вместо картинки" } }],
  input: [{ a: "type", d: { uz: "maydon turi", ru: "тип поля" } }, { a: "placeholder", d: { uz: "xira maslahat", ru: "подсказка" } }],
  "*": [{ a: "class", d: { uz: "CSS uchun nom", ru: "имя для CSS" } }, { a: "id", d: { uz: "yagona nom", ru: "уникальное имя" } }]
};
var SNIPPETS = {
  ul: { body: "<ul>\n  <li></li>\n  <li></li>\n</ul>", caret: 11 },
  ol: { body: "<ol>\n  <li></li>\n  <li></li>\n</ol>", caret: 11 },
  a: { body: '<a href=""></a>', caret: 9 },
  img: { body: '<img src="" alt="">', caret: 10 }
};
var norm = (s) => (s || "").trim();
var __cssNormEl = null;
var cssNorm = (prop, val) => {
  const raw = String(val ?? "").trim();
  if (typeof document === "undefined") return raw;
  try {
    if (!__cssNormEl) __cssNormEl = document.createElement("div");
    __cssNormEl.style.cssText = "";
    __cssNormEl.style.setProperty(prop, raw);
    return __cssNormEl.style.getPropertyValue(prop) || raw;
  } catch {
    return raw;
  }
};
var __cssColorEl = null;
var cssColorEq = (prop, a, b) => {
  if (!/(^|-)color$/.test(prop) || typeof document === "undefined" || !document.body) return false;
  try {
    if (!__cssColorEl) {
      __cssColorEl = document.createElement("i");
      __cssColorEl.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden";
    }
    if (!__cssColorEl.isConnected) document.body.appendChild(__cssColorEl);
    const comp = (v) => {
      __cssColorEl.style.setProperty(prop, "");
      __cssColorEl.style.setProperty(prop, String(v ?? "").trim());
      if (!__cssColorEl.style.getPropertyValue(prop)) return null;
      return getComputedStyle(__cssColorEl).getPropertyValue(prop);
    };
    const ca = comp(a), cb = comp(b);
    __cssColorEl.style.setProperty(prop, "");
    return !!ca && ca === cb;
  } catch {
    return false;
  }
};
var stripJsComments = (src) => (src || "").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
var checks = {
  // Teg/selektor mavjudmi?
  has: (sel, hint) => (x) => x.$(sel) ? true : tr(hint ?? { uz: `\`${sel}\` topilmadi`, ru: `\`${sel}\` не найден` }),
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
    const miss = attrList.filter((a) => !norm(el.getAttribute(a) || ""));
    return miss.length ? tr(hint ?? { uz: `\`${sel}\` da \`${miss.join("` va `")}\` to'ldiring`, ru: `заполните \`${miss.join("` и `")}\` у \`${sel}\`` }) : true;
  },
  // child element parent ichidami?
  nested: (parent, child, hint) => (x) => x.$(`${parent} ${child}`) ? true : tr(hint ?? { uz: `\`${child}\` ni \`${parent}\` ichiga joylang`, ru: `поместите \`${child}\` внутрь \`${parent}\`` }),
  // Kamida n ta bormi?
  count: (sel, n, hint) => (x) => x.$$(sel).length >= n ? true : tr(hint ?? { uz: `Kamida ${n} ta \`${sel}\` kerak`, ru: `Нужно минимум ${n} \`${sel}\`` }),
  // CSS: selektorga shu xossa yozilganmi?
  cssProp: (selector, prop, hint) => (x) => {
    const hit = x.cssRules.some(
      (r) => r.selector.split(",").map(norm).includes(norm(selector)) && norm(r.props[prop])
    );
    return hit ? true : tr(hint ?? { uz: `\`${selector}\` uchun \`${prop}\` xossasini yozing`, ru: `для \`${selector}\` задайте свойство \`${prop}\`` });
  },
  // CSS: selektorga shu xossa AYNAN shu qiymat bilan yozilganmi?
  // K-C-01: o'quvchi qiymati CSSOM'dan NORMALLASHGAN holda keladi (`#ff0000`→`rgb(255, 0, 0)`,
  // `0`→`0px`, `flex:1`→`1 1 0%`), kutilgan qiymat esa xom matn edi — hech qachon mos kelmasdi.
  // Endi kutilgan qiymat ham O'SHA CSSOM orqali o'tkaziladi (cssNorm), keyin solishtiriladi.
  cssValue: (selector, prop, val, hint) => (x) => {
    const want = cssNorm(prop, val);
    const hit = x.cssRules.some(
      (r) => r.selector.split(",").map(norm).includes(norm(selector)) && (norm(r.props[prop]) === norm(String(val ?? "")) || norm(r.props[prop]).toLowerCase() === want.toLowerCase() || cssColorEq(prop, r.props[prop], val))
    );
    return hit ? true : tr(hint ?? { uz: `\`${selector}\` da \`${prop}: ${val}\` yozing`, ru: `в \`${selector}\` напишите \`${prop}: ${val}\`` });
  },
  // JS: manbada namuna (regex) bormi? (izohlar hisobga olinmaydi)
  js: (re, hint) => (x) => re.test(stripJsComments(x.js)) ? true : tr(hint ?? { uz: `Skriptda kerakli qism topilmadi`, ru: `В скрипте не найден нужный фрагмент` }),
  // To'liq erkin tekshiruv: (ctx) => true | "maslahat"
  custom: (fn) => fn,
  // ── RUNTIME tekshiruvlar (kod iframe'da ishlatiladi) ──
  // Bular funksiya emas, "probe" obyekti qaytaradi — komponent ularni
  // iframe ichida ishlatib, natijani postMessage orqali oladi.
  // console.log chiqishida shu qiymat bormi?
  logs: (value, hint) => ({ __runtime: "log_includes", value: String(value), hint }),
  // JS ifoda (masalan global o'zgaruvchi yoki typeof) shu qiymatga tengmi?
  evalEquals: (expr, expected, hint) => ({ __runtime: "eval_equals", expr, expected: String(expected), hint }),
  // clickSel bosilgach, readSel matni expected'ni o'z ichiga oladimi?
  domAfterClick: (clickSel, readSel, expected, hint) => ({ __runtime: "click_text", clickSel, readSel, expected: String(expected), hint }),
  // ALMASHISH (toggle): clickSel ni ikki marta bosamiz.
  //   boshida readSel matni = textA, 1-bosishdan keyin = textB,
  //   2-bosishdan keyin yana = textA. Hammasi to'g'ri bo'lsa — haqiqiy toggle.
  toggle: (clickSel, readSel, textA, textB, hint) => ({ __runtime: "toggle", clickSel, readSel, textA: String(textA), textB: String(textB), hint })
};
function specToCheck(s) {
  const hint = s.hint;
  if (s.css) {
    const { sel: sel2, prop, value } = s.css;
    return value != null ? checks.cssValue(sel2, prop, value, hint) : checks.cssProp(sel2, prop, hint);
  }
  if (s.js) return checks.js(s.js instanceof RegExp ? s.js : new RegExp(s.js), hint);
  if (s.logs !== void 0) return checks.logs(s.logs, hint);
  if (s.eval !== void 0) return checks.evalEquals(s.eval, s.equals, hint);
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
  return () => tr(hint ?? { uz: "shart aniqlanmadi", ru: "условие не распознано" });
}
function buildLabel(s) {
  if (s.css) return `CSS: ${s.css.sel} { ${s.css.prop}${s.css.value != null ? `: ${s.css.value}` : ""} }`;
  if (s.logs !== void 0) return { uz: `konsolda «${s.logs}»`, ru: `в консоли «${s.logs}»` };
  if (s.toggle) return `${s.a} ⇄ ${s.b}`;
  if (s.click) return { uz: `bosilsa «${s.expect}»`, ru: `по клику «${s.expect}»` };
  if (s.eval !== void 0) return `${s.eval} = ${s.equals}`;
  if (s.js) return { uz: "JS namunasi", ru: "фрагмент JS" };
  const sel = s.tag || s.sel;
  if (sel) {
    if (s.child || s.nested) return { uz: `<${sel}> ichida <${s.child || s.nested}>`, ru: `<${s.child || s.nested}> внутри <${sel}>` };
    if (Array.isArray(s.attrs)) return `<${sel}> — ${s.attrs.join(", ")}`;
    if (s.attr) return `<${sel}> — ${s.attr}`;
    if (s.count != null) return { uz: `kamida ${s.count} ta <${sel}>`, ru: `минимум ${s.count} <${sel}>` };
    if (s.text) return { uz: `<${sel}> (matn bilan)`, ru: `<${sel}> (с текстом)` };
    return `<${sel}>`;
  }
  return { uz: "shart", ru: "условие" };
}
function normalizeReq(req, i = 0) {
  const ready = typeof req.check === "function" || req.check && req.check.__runtime || req.re;
  if (ready) return { id: req.id ?? `r${i}`, label: req.label ?? "", ...req };
  const check = specToCheck(req);
  const id = req.id ?? `${req.tag || req.sel || "r"}${i}`;
  return { ...req, id, label: req.label ?? buildLabel(req), check };
}
var DEFAULT_FILES = [
  { name: "index.html", lang: "html", starter: { uz: "<!-- Bu yerga yozing -->\n", ru: "<!-- Пишите здесь -->\n" } }
];
var DEFAULT_TASK = {
  eyebrow: { uz: "Praktika", ru: "Практика" },
  title: { uz: "O'z sahifangizni quring", ru: "Соберите свою страницу" },
  brief: {
    uz: "Quyidagi shartlarni bajaring. Har biri bajarilganda yashil ✓ yonadi. Hammasi yashil bo'lsa — “Davom etish” ochiladi.",
    ru: "Выполните условия ниже. За каждое выполненное загорается зелёная ✓. Когда всё зелёное — откроется «Продолжить»."
  },
  requirements: [
    { id: "h1", label: { uz: "<h1> sarlavha (matn bilan)", ru: "<h1> заголовок (с текстом)" }, check: checks.text("h1", { uz: "`<h1>` ichiga sarlavha matnini yozing", ru: "Напишите текст заголовка внутри `<h1>`" }) },
    { id: "p", label: { uz: "<p> — matn (paragraf)", ru: "<p> — текст (абзац)" }, check: checks.text("p", { uz: "`<p>` ichiga bir-ikki gap yozing", ru: "Напишите пару предложений внутри `<p>`" }) },
    { id: "img", label: { uz: "<img> — src va alt bilan", ru: "<img> — с src и alt" }, check: checks.attrs("img", ["src", "alt"], { uz: "`<img>` da `src` va `alt` ikkalasini to'ldiring", ru: "Заполните у `<img>` оба атрибута: `src` и `alt`" }) }
  ]
};
function parseCss(css) {
  if (!css || !css.trim() || typeof document === "undefined") return [];
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
  let rules = [];
  try {
    rules = [...el.sheet?.cssRules || []].filter((r) => r.style).map((r) => {
      const props = {};
      for (let i = 0; i < r.style.length; i++) {
        const p = r.style[i];
        props[p] = r.style.getPropertyValue(p);
      }
      [
        "gap",
        "margin",
        "padding",
        "border",
        "flex",
        "background",
        "font",
        "inset",
        "place-items",
        "place-content",
        "border-radius",
        "flex-flow",
        "list-style",
        "transition",
        "overflow",
        "grid-template",
        "gridArea"
      ].forEach((sh) => {
        if (props[sh] == null) {
          const v = r.style.getPropertyValue(sh);
          if (v) props[sh] = v;
        }
      });
      return { selector: r.selectorText || "", props };
    });
  } catch {
  }
  el.remove();
  return rules;
}
var VOID_TAGS = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var OPTIONAL_CLOSE = /* @__PURE__ */ new Set(["li", "p", "td", "th", "tr", "dt", "dd", "option", "thead", "tbody", "tfoot"]);
var BLOCK_TAGS = /* @__PURE__ */ new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "details",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "main",
  "menu",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "ul"
]);
function closesOnOpen(open, top) {
  if (top === "li") return open === "li";
  if (top === "p") return open === "p" || BLOCK_TAGS.has(open);
  if (top === "option") return open === "option";
  if (top === "td" || top === "th") return open === "td" || open === "th" || open === "tr";
  if (top === "tr") return open === "tr";
  if (top === "dt" || top === "dd") return open === "dt" || open === "dd";
  if (top === "thead" || top === "tbody" || top === "tfoot") return open === "tbody" || open === "tfoot" || open === "thead";
  return false;
}
var TEXT_TAGS = /* @__PURE__ */ new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "span",
  "strong",
  "em",
  "b",
  "i",
  "button",
  "li",
  "label",
  "title",
  "td",
  "th",
  "figcaption",
  "blockquote"
]);
var inTextTag = (src) => {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)(?:"[^"]*"|'[^']*'|[^<>"'])*?(\/?)>/g;
  const st = [];
  let m;
  while (m = re.exec(src)) {
    const name = m[2].toLowerCase();
    if (m[1]) {
      const i = st.lastIndexOf(name);
      if (i !== -1) st.length = i;
    } else if (!m[3] && !VOID_TAGS.has(name)) {
      while (st.length && closesOnOpen(name, st[st.length - 1])) st.pop();
      st.push(name);
    }
  }
  return st.length > 0 && TEXT_TAGS.has(st[st.length - 1]);
};
var LINT_DELAY_MS = 700;
function lintHtml(src) {
  const errors = [];
  if (!src) return errors;
  const stack = [];
  const n = src.length;
  let i = 0, line = 1, col = 1;
  const here = () => ({ line, col });
  const step = () => {
    if (src[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
    i++;
  };
  const skipTo = (idx) => {
    while (i < idx && i < n) step();
  };
  while (i < n) {
    if (src[i] !== "<") {
      step();
      continue;
    }
    const next = src[i + 1];
    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      if (end === -1) {
        errors.push({ ...here(), atEnd: true, msg: tr({ uz: "Izoh yopilmagan (`-->` yetishmayapti)", ru: "Комментарий не закрыт (не хватает `-->`)" }) });
        break;
      }
      skipTo(end + 3);
      continue;
    }
    if (next === "!") {
      const end = src.indexOf(">", i);
      if (end === -1) {
        errors.push({ ...here(), atEnd: true, msg: tr({ uz: "`<! ... >` yopilmagan", ru: "`<! ... >` не закрыт" }) });
        break;
      }
      skipTo(end + 1);
      continue;
    }
    if (next === "/") {
      const start = here();
      let j = i + 2, name = "";
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) {
        name += src[j];
        j++;
      }
      while (j < n && src[j] !== ">") j++;
      if (j >= n) {
        errors.push({ line: start.line, atEnd: true, msg: tr({ uz: `Yopuvchi teg \`</${name}>\` to'liq emas (\`>\` yetishmayapti)`, ru: `Закрывающий тег \`</${name}>\` неполный (не хватает \`>\`)` }) });
        break;
      }
      const lname = name.toLowerCase();
      while (stack.length && OPTIONAL_CLOSE.has(stack[stack.length - 1].name) && stack[stack.length - 1].name !== lname && stack.some((s, idx) => s.name === lname && idx < stack.length - 1)) {
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
      skipTo(j + 1);
      continue;
    }
    if (/[a-zA-Z]/.test(next || "")) {
      const start = here();
      let j = i + 1, name = "";
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) {
        name += src[j];
        j++;
      }
      let selfClose = false, closed = false, quote = null, strayLt = false;
      while (j < n) {
        const c = src[j];
        if (quote) {
          if (c === quote) quote = null;
          j++;
          continue;
        }
        if (c === '"' || c === "'") {
          quote = c;
          j++;
          continue;
        }
        if (c === "<") {
          strayLt = true;
          break;
        }
        if (c === "/" && src[j + 1] === ">") {
          selfClose = true;
          closed = true;
          j += 2;
          break;
        }
        if (c === ">") {
          closed = true;
          j++;
          break;
        }
        j++;
      }
      if (quote && j >= n) {
        errors.push({ line: start.line, atEnd: true, msg: tr({ uz: `\`<${name}>\` ichida tirnoq (${quote}) yopilmagan`, ru: `Кавычка (${quote}) внутри \`<${name}>\` не закрыта` }) });
        break;
      }
      if (strayLt) {
        errors.push({ line: start.line, msg: tr({ uz: `\`<${name}\` tegi \`>\` bilan yopilmagan`, ru: `Тег \`<${name}\` не закрыт символом \`>\`` }) });
        skipTo(j);
        continue;
      }
      if (!closed && j >= n) {
        errors.push({ line: start.line, atEnd: true, msg: tr({ uz: `\`<${name}\` tegi \`>\` bilan yopilmagan`, ru: `Тег \`<${name}\` не закрыт символом \`>\`` }) });
        break;
      }
      const lname = name.toLowerCase();
      while (stack.length && closesOnOpen(lname, stack[stack.length - 1].name)) stack.pop();
      if (!selfClose && !VOID_TAGS.has(lname)) stack.push({ name: lname, line: start.line });
      skipTo(j);
      continue;
    }
    step();
  }
  for (const t of stack) {
    if (OPTIONAL_CLOSE.has(t.name)) continue;
    errors.push({ line: t.line, msg: tr({ uz: `\`<${t.name}>\` ochiq qoldi — \`</${t.name}>\` bilan yoping`, ru: `\`<${t.name}>\` остался открытым — закройте его \`</${t.name}>\`` }) });
  }
  return errors;
}
function runOne(req, ctx) {
  try {
    if (req.check && req.check.__runtime) {
      return { ok: false, hint: tr({ uz: "ishga tushirilmoqda…", ru: "запускается…" }), runtime: true };
    }
    if (typeof req.check === "function") {
      const r = req.check(ctx);
      if (r === true) return { ok: true, hint: null };
      return { ok: false, hint: typeof r === "string" ? r : tr(req.hint) || null };
    }
    if (req.re) {
      const ok = req.re.test((ctx.html || "").replace(/<!--[\s\S]*?-->/g, ""));
      return { ok, hint: ok ? null : tr(req.hint) || null };
    }
    return { ok: false, hint: null };
  } catch {
    return { ok: false, hint: tr({ uz: "tekshirishda xatolik", ru: "ошибка при проверке" }) };
  }
}
var CONSOLE_CAPTURE = `<script>
window.__logs=[];
(function(){var _l=console.log;console.log=function(){
  for(var i=0;i<arguments.length;i++){var a=arguments[i];
    try{window.__logs.push(typeof a==='object'?JSON.stringify(a):String(a));}catch(e){window.__logs.push(String(a));}}
  try{_l.apply(console,arguments);}catch(e){}
};})();
<\/script>`;
var CONSOLE_FORWARD = (nonce) => `<script>
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
var buildHarness = (probes, nonce) => `<script>
(function(){
  // K-C-02: token (nonce) faqat shu skriptda — element DOM'dan olib tashlanadi, o'quvchining
  // kechiktirilgan kodi uni o'qiy olmasin (document.scripts / outerHTML orqali).
  try{var _cs=document.currentScript;if(_cs)_cs.parentNode.removeChild(_cs);}catch(e){}
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
var baseStyle = `
  *{box-sizing:border-box}
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;color:#13141A;line-height:1.6;background:#fff}
  h1{font-family:Georgia,serif;margin:0 0 12px;letter-spacing:-.01em}
  img{max-width:100%;border-radius:12px;display:block;margin:10px 0}
  p{margin:0 0 12px}
  li:empty{display:none}
  .hc-imgfb{display:flex;flex-direction:column;gap:2px;border:2px dashed #D8D3C8;border-radius:12px;padding:16px 18px;margin:10px 0;background:#FAF8F4;color:#5A5A60;font-size:14px}
  .hc-imgfb-i{font-size:26px;line-height:1}
  .hc-imgfb-t{font-weight:700;color:#0E0E10}
  .hc-imgfb-h{font-size:12.5px;color:#8A8880}
  .hc-imgfb code{font-family:ui-monospace,Menlo,Consolas,monospace;background:#EFEBE3;padding:1px 5px;border-radius:5px}`;
var IMG_FALLBACK = `<script>
document.addEventListener('error',function(e){
  var el=e.target;
  if(!el||el.tagName!=='IMG'||el.dataset.hcFb)return;
  el.dataset.hcFb='1';el.style.display='none';
  var alt=(el.getAttribute('alt')||'').trim();
  var b=document.createElement('div');
  b.className='hc-imgfb';
  b.innerHTML='<span class="hc-imgfb-i">\\uD83D\\uDDBC</span>'
    +'<span class="hc-imgfb-t"></span>'
    +'<span class="hc-imgfb-h">rasm topilmadi — <code>src</code> manzilini tekshiring</span>';
  b.querySelector('.hc-imgfb-t').textContent = alt || 'alt matni yozilmagan';
  if(el.parentNode)el.parentNode.insertBefore(b,el.nextSibling);
},true);
<\/script>`;
var wrapDoc = (html, css, js, opts = {}) => `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_blank">
<style>${baseStyle}
${opts.previewCss || ""}
${css || ""}</style>
${opts.capture ? CONSOLE_CAPTURE : ""}
${opts.consoleNonce != null ? CONSOLE_FORWARD(opts.consoleNonce) : ""}
${opts.capture ? "" : IMG_FALLBACK}
</head>
<body>
${html || ""}
<script>${js || ""}<\/script>
${opts.harness || ""}
${opts.doneNonce != null ? `<script>try{parent.postMessage({__hcDone:true,nonce:${JSON.stringify(opts.doneNonce)}},'*')}catch(e){}<\/script>` : ""}
</body>
</html>`;
function HtmlCompiler({
  task = DEFAULT_TASK,
  starterCode,
  // eski kontrakt: bitta HTML fayl uchun starter
  onContinue,
  onBack,
  storageKey,
  // F-0801-01: berilsa — yozilgan kod shu kalitda saqlanadi
  lang = "uz"
  // 'uz' | 'ru' — modul dars kontekstidan tashqarida ishlaydi
}) {
  __lang = lang === "ru" ? "ru" : "uz";
  const reqs = useMemo(
    () => (task.requirements || []).map((r, i) => normalizeReq(r, i)),
    [task.requirements]
  );
  const files = useMemo(() => {
    if (task.files && task.files.length) return task.files;
    const single = { ...DEFAULT_FILES[0] };
    if (starterCode != null) single.starter = starterCode;
    return [single];
  }, [task.files, starterCode]);
  const [codes, setCodes] = useState(() => {
    const fresh = Object.fromEntries(files.map((f) => [f.name, tr(f.starter) ?? ""]));
    if (!storageKey) return fresh;
    const s = codesRead(storageKey);
    if (!s || !s.codes) return fresh;
    const names = Object.keys(fresh);
    if (names.length !== Object.keys(s.codes).length || !names.every((n) => n in s.codes)) return fresh;
    return { ...fresh, ...s.codes };
  });
  useEffect(() => {
    if (!storageKey) return;
    const id = setTimeout(() => codesWrite(storageKey, codes), 400);
    return () => clearTimeout(id);
  }, [codes, storageKey]);
  const [active, setActive] = useState(files[0].name);
  const taRef = useRef(null);
  const byLang = (lang2) => {
    const f = files.find((ff) => ff.lang === lang2);
    return f ? codes[f.name] ?? "" : "";
  };
  const html = byLang("html"), css = byLang("css"), js = byLang("js");
  const runtimeProbes = useMemo(
    () => reqs.filter((r) => r.check && r.check.__runtime).map((r) => ({ id: r.id, type: r.check.__runtime, ...r.check })),
    [reqs]
  );
  const hasRuntime = runtimeProbes.length > 0;
  const nonceRef = useRef("");
  const gotReportRef = useRef(null);
  const [runtimeResults, setRuntimeResults] = useState({});
  const previewFrameRef = useRef(null);
  const checkFrameRef = useRef(null);
  const fromFrame = (e, ref) => !!(ref.current && e.source && e.source === ref.current.contentWindow);
  const showConsole = useMemo(() => files.some((f) => f.lang === "js"), [files]);
  const consoleNonceRef = useRef(0);
  const [consoleLines, setConsoleLines] = useState([]);
  const mkDoc = (extra = {}) => wrapDoc(html, css, js, { previewCss: task.previewCss, ...extra });
  const [doc, setDoc] = useState(() => wrapDoc(html, css, js, { previewCss: task.previewCss }));
  const [checkDoc, setCheckDoc] = useState("");
  const HUNG_MS = 5e3;
  const HUNG_MSG = tr({
    uz: "⏱ Kod juda uzoq ishladi — sikl tugamayapti (cheksiz sikl?). Shartni tekshiring: sanagich o'zgaryaptimi (masalan i++)?",
    ru: "⏱ Код работал слишком долго — цикл не заканчивается (бесконечный цикл?). Проверьте условие: меняется ли счётчик (например i++)?"
  });
  const [frameGen, setFrameGen] = useState(0);
  const [framesOff, setFramesOff] = useState(false);
  const [hung, setHung] = useState(false);
  const doneNonceRef = useRef(0);
  const pendingRef = useRef({});
  const dogRef = useRef(null);
  const killedForRef = useRef(null);
  const armDog = () => {
    clearTimeout(dogRef.current);
    dogRef.current = setTimeout(() => {
      const p = pendingRef.current;
      if (p.doc == null && p.check == null) return;
      const sigKill = `${p.doc}/${p.check}`;
      setHung(true);
      pendingRef.current = {};
      setFramesOff(true);
      if (killedForRef.current === sigKill) return;
      killedForRef.current = sigKill;
      setTimeout(() => {
        setFrameGen((g) => g + 1);
        setFramesOff(false);
        pendingRef.current = { ...p };
        armDog();
      }, 120);
    }, HUNG_MS);
  };
  const expect = (which, nonce) => {
    pendingRef.current = { ...pendingRef.current, [which]: nonce };
    armDog();
  };
  const settle = (which, nonce) => {
    if (pendingRef.current[which] !== nonce) return;
    pendingRef.current = { ...pendingRef.current, [which]: null };
    const p = pendingRef.current;
    if (p.doc == null && p.check == null) {
      clearTimeout(dogRef.current);
      setHung(false);
    }
  };
  useEffect(() => () => clearTimeout(dogRef.current), []);
  const manualRun = showConsole;
  const sig = `${html}\0${css}\0${js}`;
  const lastRunRef = useRef(null);
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setHung(false);
      setFramesOff(false);
      if (!manualRun) {
        const dn = ++doneNonceRef.current;
        setDoc(mkDoc({ doneNonce: dn }));
        expect("doc", dn);
      } else if (lastRunRef.current === null) {
        const cn = ++consoleNonceRef.current;
        const dn = ++doneNonceRef.current;
        setConsoleLines([]);
        setDoc(mkDoc({ consoleNonce: cn, doneNonce: dn }));
        expect("doc", dn);
        lastRunRef.current = sig;
        setStale(false);
      } else {
        setStale(lastRunRef.current !== sig);
      }
      if (hasRuntime) {
        const nonce = nonceRef.current = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
        gotReportRef.current = null;
        setRuntimeResults({});
        setCheckDoc(mkDoc({ capture: true, harness: buildHarness(runtimeProbes, nonce) }));
        expect("check", nonce);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [sig, html, css, js, hasRuntime, runtimeProbes, manualRun]);
  useEffect(() => {
    if (!hasRuntime) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcReport && d.nonce === nonceRef.current && fromFrame(e, checkFrameRef) && gotReportRef.current !== d.nonce) {
        gotReportRef.current = d.nonce;
        setRuntimeResults(d.results || {});
        settle("check", d.nonce);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [hasRuntime]);
  useEffect(() => {
    const onDone = (e) => {
      const d = e.data;
      if (d && d.__hcDone && d.nonce === doneNonceRef.current && fromFrame(e, previewFrameRef)) settle("doc", d.nonce);
    };
    window.addEventListener("message", onDone);
    return () => window.removeEventListener("message", onDone);
  }, []);
  useEffect(() => {
    if (!showConsole) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcConsole && d.nonce === consoleNonceRef.current && fromFrame(e, previewFrameRef)) {
        setConsoleLines((prev) => prev.length >= 200 ? prev : [...prev, { level: d.level, text: d.text }]);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [showConsole]);
  const results = useMemo(() => {
    const parsed = new DOMParser().parseFromString(html || "", "text/html");
    const ctx = {
      html,
      css,
      js,
      doc: parsed,
      $: (s) => {
        try {
          return parsed.querySelector(s);
        } catch {
          return null;
        }
      },
      $$: (s) => {
        try {
          return [...parsed.querySelectorAll(s)];
        } catch {
          return [];
        }
      },
      cssRules: parseCss(css)
    };
    return reqs.map((r) => runOne(r, ctx));
  }, [html, css, js, reqs]);
  const [lintSrc, setLintSrc] = useState(html);
  useEffect(() => {
    const id = setTimeout(() => setLintSrc(html), LINT_DELAY_MS);
    return () => clearTimeout(id);
  }, [html]);
  const htmlErrors = useMemo(() => lintHtml(lintSrc), [lintSrc]);
  const [tailTyping, setTailTyping] = useState(false);
  const hasSyntaxError = htmlErrors.length > 0;
  const merged = reqs.map((r, i) => {
    if (r.check && r.check.__runtime) {
      const got = runtimeResults[r.id];
      if (got === void 0) return { ok: false, hint: hung ? HUNG_MSG : tr({ uz: "ishga tushirilmoqda…", ru: "запускается…" }) };
      return { ok: !!got, hint: got ? null : tr(r.check.hint) || tr({ uz: "natija kutilgancha emas", ru: "результат не такой, как ожидалось" }) };
    }
    return results[i];
  });
  const passedCount = merged.filter((r) => r.ok).length;
  const allPassed = reqs.length > 0 && passedCount === reqs.length && !hasSyntaxError;
  const firstHint = merged.find((r) => !r.ok && r.hint)?.hint;
  const blockedBySyntax = reqs.length > 0 && passedCount === reqs.length && hasSyntaxError;
  const shownErrors = useMemo(
    () => tailTyping && !blockedBySyntax ? htmlErrors.filter((e) => !e.atEnd) : htmlErrors,
    [htmlErrors, tailTyping, blockedBySyntax]
  );
  const setActiveCode = (val) => setCodes((prev) => ({ ...prev, [active]: val }));
  const caretRef = useRef(null);
  useLayoutEffect(() => {
    const c = caretRef.current;
    if (c == null) return;
    caretRef.current = null;
    const el = taRef.current;
    if (el && document.activeElement === el) el.setSelectionRange(c, c);
  });
  const put = (el, text, caret) => {
    el.focus();
    document.execCommand("insertText", false, text);
    if (caret != null) {
      el.setSelectionRange(caret, caret);
      caretRef.current = caret;
    }
  };
  const syncTail = () => {
    const el = taRef.current;
    setTailTyping(!!el && document.activeElement === el && el.selectionStart === el.selectionEnd && el.selectionStart === el.value.length);
  };
  const activeLang = (files.find((f) => f.name === active) || {}).lang || "html";
  const narrow = useMedia("(max-width: 860px)");
  const touch = useMedia("(pointer: coarse)");
  const [pane, setPane] = useState("code");
  const hlRef = useRef(null);
  const boxRef = useRef(null);
  const charWRef = useRef(0);
  const prevRef = useRef("");
  const busyRef = useRef(false);
  const curLineRef = useRef(null);
  const updateCurLine = () => {
    const el = taRef.current, d = curLineRef.current;
    if (!el || !d) return;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || 24;
    const padT = parseFloat(cs.paddingTop) || 0;
    const row = el.value.slice(0, el.selectionStart).split("\n").length - 1;
    d.style.top = padT + row * lh - el.scrollTop + "px";
    d.style.height = lh + "px";
    d.style.opacity = document.activeElement === el && el.selectionStart === el.selectionEnd ? "1" : "0";
  };
  const [caretPos, setCaretPos] = useState({ ln: 1, col: 1 });
  const updateCaretUi = () => {
    updateCurLine();
    const el = taRef.current;
    if (!el) return;
    const before = el.value.slice(0, el.selectionStart);
    const ln = before.split("\n").length;
    const col = before.length - before.lastIndexOf("\n");
    setCaretPos((p) => p.ln === ln && p.col === col ? p : { ln, col });
  };
  const [fontSize, setFontSize] = useState(() => {
    try {
      const n = parseInt(localStorage.getItem("hcFont"), 10);
      return n >= 12 && n <= 20 ? n : 14;
    } catch {
      return 14;
    }
  });
  const bumpFont = (d) => setFontSize((f) => Math.max(12, Math.min(20, f + d)));
  useEffect(() => {
    try {
      localStorage.setItem("hcFont", String(fontSize));
    } catch {
    }
    charWRef.current = 0;
    updateCurLine();
  }, [fontSize]);
  const splitRef = useRef(null);
  const [split, setSplit] = useState(() => {
    try {
      const n = parseFloat(localStorage.getItem("hcSplit"));
      return n >= 0.3 && n <= 0.7 ? n : 0.5;
    } catch {
      return 0.5;
    }
  });
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("hcSplit", String(split));
    } catch {
    }
  }, [split]);
  const dragStart = (e) => {
    const box = splitRef.current;
    if (!box) return;
    e.preventDefault();
    setDragging(true);
    const move = (ev) => {
      const r = box.getBoundingClientRect();
      if (!r.width) return;
      setSplit(Math.max(0.3, Math.min(0.7, (ev.clientX - r.left) / r.width)));
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  useEffect(() => {
    const id = requestAnimationFrame(updateCaretUi);
    return () => cancelAnimationFrame(id);
  }, [active]);
  const [menu, setMenu] = useState(null);
  const menuListRef = useRef(null);
  useLayoutEffect(() => {
    const box = menuListRef.current;
    if (!box || !menu) return;
    const row = box.children[menu.idx];
    if (!row) return;
    const top = row.offsetTop, bot = top + row.offsetHeight;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (bot > box.scrollTop + box.clientHeight) box.scrollTop = bot - box.clientHeight;
  }, [menu]);
  const syncScroll = (e) => {
    const t = e.target;
    if (gutRef.current) gutRef.current.scrollTop = t.scrollTop;
    if (hlRef.current) {
      hlRef.current.scrollTop = t.scrollTop;
      hlRef.current.scrollLeft = t.scrollLeft;
    }
    updateCurLine();
  };
  const caretXY = () => {
    const el = taRef.current, box = boxRef.current;
    if (!el || !box) return { x: 0, y: 0 };
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || 24;
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padT = parseFloat(cs.paddingTop) || 0;
    let cw = charWRef.current;
    if (!cw) {
      const probe = document.createElement("span");
      probe.textContent = "M".repeat(50);
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-family:${cs.fontFamily};font-size:${cs.fontSize};font-feature-settings:"liga" 0,"calt" 0`;
      box.appendChild(probe);
      cw = probe.getBoundingClientRect().width / 50;
      probe.remove();
      charWRef.current = cw;
    }
    const before = el.value.slice(0, el.selectionStart);
    const row = before.split("\n").length - 1;
    const col = before.length - (before.lastIndexOf("\n") + 1);
    let x = padL + col * cw - el.scrollLeft;
    let y = padT + (row + 1) * lh - el.scrollTop;
    const MW = 246, MH = 250;
    x = Math.max(4, Math.min(x, Math.max(4, box.clientWidth - MW - 6)));
    const above = y + MH > box.clientHeight && y > MH;
    if (above) y -= lh;
    return { x, y, above };
  };
  const editSeqRef = useRef(0);
  const escAtRef = useRef({ at: -1, seq: -1 });
  const refreshMenu = () => {
    const el = taRef.current;
    if (!el || activeLang !== "html" || document.activeElement !== el) return setMenu(null);
    const v = el.value, s = el.selectionStart;
    if (s !== el.selectionEnd) return setMenu(null);
    if (escAtRef.current.at === s && escAtRef.current.seq === editSeqRef.current) return setMenu(null);
    const open = (next) => setMenu((prev) => prev && prev.kind === next.kind && prev.from === next.from && prev.items.length === next.items.length ? { ...next, idx: Math.min(prev.idx, next.items.length - 1) } : next);
    const before = v.slice(0, s);
    const mTag = /<([a-zA-Z][a-zA-Z0-9-]*)?$/.exec(before);
    if (mTag && before[mTag.index + 1] !== "/") {
      const pref = (mTag[1] || "").toLowerCase();
      const items = TAG_MENU.filter((x) => x.t.startsWith(pref));
      if (!items.length) return setMenu(null);
      return open({ kind: "tag", items, idx: 0, from: mTag.index, ...caretXY() });
    }
    const mAttr = /<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^<>"'])*)\s([a-zA-Z-]*)$/.exec(before);
    if (mAttr) {
      const tag = mAttr[1].toLowerCase(), pref = (mAttr[3] || "").toLowerCase(), had = mAttr[2];
      const pool = [...ATTR_MENU[tag] || [], ...ATTR_MENU["*"]];
      const items = pool.filter((x) => x.a.startsWith(pref) && !new RegExp("(^|\\s)" + x.a + "\\s*=").test(had));
      if (!items.length) return setMenu(null);
      return open({ kind: "attr", items, idx: 0, from: s - pref.length, ...caretXY() });
    }
    const ls = before.lastIndexOf("\n") + 1;
    const mBare = /^[ \t]*([a-zA-Z][a-zA-Z0-9-]*)$/.exec(before.slice(ls));
    if (mBare && !v.slice(s).split("\n")[0].trim() && !inTextTag(before.slice(0, ls))) {
      const pref = mBare[1].toLowerCase();
      const items = TAG_MENU.filter((x) => x.t.startsWith(pref));
      if (!items.length) return setMenu(null);
      return open({ kind: "tag", items, idx: 0, from: s - mBare[1].length, ...caretXY() });
    }
    setMenu(null);
  };
  const acceptMenu = (item) => {
    const el = taRef.current;
    if (!el || !menu) return;
    const s = el.selectionStart;
    el.setSelectionRange(menu.from, s);
    if (menu.kind === "attr") {
      put(el, item.a + '=""', menu.from + item.a.length + 2);
      setMenu(null);
      return;
    }
    const name = item.t, v = el.value;
    const ls = v.lastIndexOf("\n", menu.from - 1) + 1;
    const ind = (/^[ \t]*/.exec(v.slice(ls, menu.from)) || [""])[0];
    const sn = SNIPPETS[name];
    let body, caretOff;
    if (sn) {
      body = sn.body.split("\n").join("\n" + ind);
      caretOff = sn.body.slice(0, sn.caret).split("\n").join("\n" + ind).length;
    } else if (VOID_TAGS.has(name)) {
      body = `<${name}>`;
      caretOff = body.length;
    } else {
      body = `<${name}></${name}>`;
      caretOff = name.length + 2;
    }
    put(el, body, menu.from + caretOff);
    setMenu(null);
  };
  const maybeLinkedRename = (el, prev, next) => {
    if (activeLang !== "html" || !prev || prev === next) return;
    const s = el.selectionStart;
    const m = /<([a-zA-Z][a-zA-Z0-9-]*)$/.exec(next.slice(0, s));
    if (!m) return;
    const tagStart = m.index, nu = m[1];
    const mo = /^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(prev.slice(tagStart));
    if (!mo) return;
    const old = mo[1];
    if (old === nu || VOID_TAGS.has(old.toLowerCase())) return;
    const gt = next.indexOf(">", s);
    if (gt === -1) return;
    let depth = 1, i = gt + 1;
    const openRe = new RegExp("<" + old + "(?=[\\s/>])", "gi");
    const closeStr = "</" + old + ">";
    while (i < next.length) {
      const c = next.toLowerCase().indexOf(closeStr.toLowerCase(), i);
      if (c === -1) return;
      openRe.lastIndex = i;
      let opens = 0, mm;
      while ((mm = openRe.exec(next)) && mm.index < c) opens++;
      depth += opens - 1;
      if (depth === 0) {
        el.setSelectionRange(c, c + closeStr.length);
        document.execCommand("insertText", false, "</" + nu + ">");
        el.setSelectionRange(s, s);
        caretRef.current = s;
        return;
      }
      i = c + closeStr.length;
    }
  };
  const onChangeCode = (e) => {
    const el = e.target;
    if (!busyRef.current) {
      busyRef.current = true;
      try {
        maybeLinkedRename(el, prevRef.current, el.value);
      } catch {
      } finally {
        busyRef.current = false;
      }
    }
    setActiveCode(el.value);
    prevRef.current = el.value;
    editSeqRef.current += 1;
    syncTail();
    refreshMenu();
    updateCaretUi();
  };
  const onKeyDown = (e) => {
    const el = e.target;
    const v = el.value, s = el.selectionStart, en = el.selectionEnd;
    const oneCaret = s === en;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const line = v.slice(lineStart, s);
    if (menu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMenu((m) => ({ ...m, idx: (m.idx + 1) % m.items.length }));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMenu((m) => ({ ...m, idx: (m.idx - 1 + m.items.length) % m.items.length }));
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey || e.key === "Tab") {
        e.preventDefault();
        acceptMenu(menu.items[menu.idx]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        escAtRef.current = { at: s, seq: editSeqRef.current };
        setMenu(null);
        return;
      }
    }
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key === "/") {
      e.preventDefault();
      const from = v.lastIndexOf("\n", s - 1) + 1;
      const endSel = en > s && v[en - 1] === "\n" ? en - 1 : en;
      const nl = v.indexOf("\n", endSel);
      const to = nl === -1 ? v.length : nl;
      const rows = v.slice(from, to).split("\n");
      const C = activeLang === "js" ? { re: /^(\s*)\/\/ ?/, o: "// ", c: "" } : activeLang === "css" ? { re: /^(\s*)\/\*\s?/, ce: /\s?\*\/\s*$/, o: "/* ", c: " */" } : { re: /^(\s*)<!--\s?/, ce: /\s?-->\s*$/, o: "<!-- ", c: " -->" };
      const filled = rows.filter((r) => r.trim());
      const allOn = filled.length > 0 && filled.every((r) => C.re.test(r) && (!C.ce || C.ce.test(r)));
      const out = rows.map((r) => {
        if (!r.trim()) return r;
        if (allOn) {
          const x = r.replace(C.re, "$1");
          return C.ce ? x.replace(C.ce, "") : x;
        }
        const m = /^(\s*)([\s\S]*)$/.exec(r);
        return m[1] + C.o + m[2] + C.c;
      }).join("\n");
      el.setSelectionRange(from, to);
      document.execCommand("insertText", false, out);
      const caret = from + out.length;
      el.setSelectionRange(caret, caret);
      caretRef.current = caret;
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const sn = oneCaret && activeLang === "html" ? SNIPPETS[line.trim().toLowerCase()] : null;
      if (sn && /^[ \t]*[a-z0-9]+$/i.test(line)) {
        const ind = (/^[ \t]*/.exec(line) || [""])[0];
        const body = sn.body.split("\n").join("\n" + ind);
        el.setSelectionRange(lineStart, s);
        document.execCommand("insertText", false, ind + body);
        const caret = lineStart + ind.length + sn.caret;
        el.setSelectionRange(caret, caret);
        caretRef.current = caret;
        return;
      }
      if (e.shiftKey) {
        const back = /^ {1,2}/.exec(v.slice(lineStart, lineStart + 2));
        if (!back) return;
        const caret = Math.max(lineStart, s - back[0].length);
        el.setSelectionRange(lineStart, lineStart + back[0].length);
        document.execCommand("delete");
        el.setSelectionRange(caret, caret);
      } else {
        put(el, "  ", s + 2);
      }
      return;
    }
    if (e.key === "Enter" && oneCaret) {
      const ind = (/^[ \t]*/.exec(line) || [""])[0];
      const opensTag = /<[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?>$/.test(line.trimEnd());
      const closesNext = /^<\//.test(v.slice(s));
      const lastCh = line.trimEnd().slice(-1);
      const braceWrap = activeLang !== "html" && lastCh === "{" && v[s] === "}";
      const braceOpen = activeLang !== "html" && lastCh === "{";
      e.preventDefault();
      if (opensTag && closesNext || braceWrap) put(el, `
${ind}  
${ind}`, s + 1 + ind.length + 2);
      else if (braceOpen) put(el, `
${ind}  `, s + 1 + ind.length + 2);
      else put(el, `
${ind}`, s + 1 + ind.length);
      return;
    }
    if (e.key === ">" && oneCaret && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const typedClose = /<\/([a-zA-Z][a-zA-Z0-9-]*)$/.exec(v.slice(0, s));
      if (typedClose) {
        const pair = `</${typedClose[1]}>`;
        if (v.slice(s).startsWith(pair)) {
          e.preventDefault();
          const from = s - typedClose[0].length;
          el.setSelectionRange(from, s);
          document.execCommand("delete");
          const caret = from + pair.length;
          el.setSelectionRange(caret, caret);
          caretRef.current = caret;
        }
        return;
      }
      const lt = v.lastIndexOf("<", s - 1);
      if (lt === -1) return;
      const inner = v.slice(lt + 1, s);
      if (!/^[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?$/.test(inner)) return;
      if (/\/\s*$/.test(inner)) return;
      const name = /^[a-zA-Z][a-zA-Z0-9-]*/.exec(inner)[0].toLowerCase();
      if (VOID_TAGS.has(name)) return;
      if (v.slice(s).startsWith(`</${name}>`)) return;
      e.preventDefault();
      put(el, `></${name}>`, s + 1);
      return;
    }
    if (e.key === '"' && oneCaret && activeLang === "html" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (v[s] === '"') {
        e.preventDefault();
        el.setSelectionRange(s + 1, s + 1);
        syncTail();
        return;
      }
      const lt = v.lastIndexOf("<", s - 1), gt = v.lastIndexOf(">", s - 1);
      if (lt === -1 || gt > lt) return;
      e.preventDefault();
      put(el, '""', s + 1);
      return;
    }
    const codey = activeLang !== "html";
    const plain = !e.ctrlKey && !e.metaKey && !e.altKey;
    const pairs = { "{": "}", "(": ")", "[": "]" };
    const quotes = activeLang === "js" ? ['"', "'", "`"] : activeLang === "css" ? ['"', "'"] : [];
    if (plain && !oneCaret && codey && (pairs[e.key] || quotes.includes(e.key))) {
      e.preventDefault();
      put(el, e.key + v.slice(s, en) + (pairs[e.key] || e.key), en + 2);
      return;
    }
    if (plain && oneCaret && codey) {
      if ((e.key === ")" || e.key === "]" || e.key === "}" || quotes.includes(e.key)) && v[s] === e.key) {
        e.preventDefault();
        el.setSelectionRange(s + 1, s + 1);
        syncTail();
        return;
      }
      if (pairs[e.key]) {
        e.preventDefault();
        put(el, e.key + pairs[e.key], s + 1);
        return;
      }
      if (quotes.includes(e.key) && !/[A-Za-z0-9_'"`]/.test(v[s - 1] || "") && !/[A-Za-z0-9_]/.test(v[s] || "")) {
        e.preventDefault();
        put(el, e.key + e.key, s + 1);
        return;
      }
    }
    if (e.key === "Backspace" && oneCaret && s > 0 && ["()", "[]", "{}", '""', "''", "``"].includes(v.slice(s - 1, s + 1))) {
      e.preventDefault();
      el.setSelectionRange(s - 1, s + 1);
      document.execCommand("delete");
      return;
    }
  };
  const gutRef = useRef(null);
  const lineCount = ((codes[active] ?? "").match(/\n/g) || []).length + 1;
  const lineNos = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1).join("\n"), [lineCount]);
  const syncGutter = (e) => {
    if (gutRef.current) gutRef.current.scrollTop = e.target.scrollTop;
  };
  const [fmtNote, setFmtNote] = useState("");
  const note = (m) => {
    setFmtNote(m);
    setTimeout(() => setFmtNote(""), 2400);
  };
  const prettify = () => {
    const el = taRef.current;
    if (!el) return;
    const cur = codes[active] ?? "";
    const out = formatHtml(cur);
    if (out == null) return note(tr({ uz: "Avval sintaksis xatosini tuzating", ru: "Сначала исправьте синтаксис" }));
    if (out === cur) return note(tr({ uz: "Kod allaqachon chiroyli 👍", ru: "Код уже аккуратный 👍" }));
    el.focus();
    el.setSelectionRange(0, cur.length);
    document.execCommand("insertText", false, out);
    el.setSelectionRange(0, 0);
    caretRef.current = 0;
  };
  const jumpToLine = (ln) => {
    const el = taRef.current;
    if (!el || !ln) return;
    const lines = (codes[active] ?? "").split("\n");
    let pos = 0;
    for (let i = 0; i < Math.min(ln - 1, lines.length); i++) pos += lines[i].length + 1;
    el.focus();
    el.setSelectionRange(pos, pos);
    caretRef.current = pos;
  };
  const runNow = () => {
    const cn = showConsole ? ++consoleNonceRef.current : null;
    if (showConsole) setConsoleLines([]);
    const dn = ++doneNonceRef.current;
    setHung(false);
    setFramesOff(false);
    killedForRef.current = null;
    setDoc(mkDoc(cn != null ? { consoleNonce: cn, doneNonce: dn } : { doneNonce: dn }));
    expect("doc", dn);
    lastRunRef.current = sig;
    setStale(false);
    if (narrow) setPane("result");
  };
  const [resetArmed, setResetArmed] = useState(false);
  const armTimerRef = useRef(null);
  const snapRef = useRef(null);
  const [canRestore, setCanRestore] = useState(false);
  const restoreTimerRef = useRef(null);
  const disarm = () => {
    clearTimeout(armTimerRef.current);
    armTimerRef.current = null;
    setResetArmed(false);
  };
  useEffect(() => () => {
    clearTimeout(armTimerRef.current);
    clearTimeout(restoreTimerRef.current);
  }, []);
  const reset = () => {
    if (!resetArmed) {
      setResetArmed(true);
      clearTimeout(armTimerRef.current);
      armTimerRef.current = setTimeout(() => {
        armTimerRef.current = null;
        setResetArmed(false);
      }, 4e3);
      return;
    }
    disarm();
    snapRef.current = codes;
    setCodes(Object.fromEntries(files.map((f) => [f.name, tr(f.starter) ?? ""])));
    setCanRestore(true);
    clearTimeout(restoreTimerRef.current);
    restoreTimerRef.current = setTimeout(() => setCanRestore(false), 8e3);
  };
  const restore = () => {
    if (!snapRef.current) return;
    setCodes(snapRef.current);
    snapRef.current = null;
    setCanRestore(false);
    clearTimeout(restoreTimerRef.current);
  };
  let statusMsg;
  if (canRestore) {
    statusMsg = /* @__PURE__ */ React.createElement("span", { className: "hc-wait-msg" }, tr({ uz: "Kod tozalandi.", ru: "Код очищен." }), " ", /* @__PURE__ */ React.createElement("button", { type: "button", className: "hc-undo", onClick: restore }, "↶ ", tr({ uz: "Qaytarish", ru: "Вернуть" })));
  } else if (resetArmed) {
    statusMsg = /* @__PURE__ */ React.createElement("span", { className: "hc-warn-msg" }, "⚠ ", tr({ uz: "Butun kod o'chadi — tugmani yana bosing", ru: "Весь код сотрётся — нажмите кнопку ещё раз" }));
  } else if (allPassed) {
    statusMsg = /* @__PURE__ */ React.createElement("span", { className: "hc-ok-msg" }, "✓ ", tr({ uz: "Barcha shartlar bajarildi!", ru: "Все условия выполнены!" }));
  } else if (blockedBySyntax) {
    statusMsg = /* @__PURE__ */ React.createElement("span", { className: "hc-wait-msg" }, "✓ ", tr({ uz: "Shartlar bajarildi — sintaksis xatosi qoldi (yuqorida)", ru: "Условия выполнены — остался синтаксис (см. выше)" }));
  } else {
    statusMsg = /* @__PURE__ */ React.createElement("span", { className: "hc-wait-msg" }, narrow ? tr({ uz: "Shartlarni bajaring — «Natija» tabida ko'rinadi", ru: "Выполняйте условия — смотрите во вкладке «Результат»" }) : tr({ uz: "Shartlarni bajaring — natija o'ngda ko'rinadi", ru: "Выполняйте условия — результат виден справа" }));
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `hc-root${dragging ? " dragging" : ""}`,
      style: { "--hcfs": fontSize + "px", "--hcL": split.toFixed(3) + "fr", "--hcR": (1 - split).toFixed(3) + "fr" }
    },
    /* @__PURE__ */ React.createElement(StyleTag, null),
    /* @__PURE__ */ React.createElement("header", { className: "hc-top" }, task.eyebrow && /* @__PURE__ */ React.createElement("span", { className: "hc-eyebrow" }, tr(task.eyebrow)), /* @__PURE__ */ React.createElement("h1", { className: "hc-title" }, tr(task.title)), task.brief && /* @__PURE__ */ React.createElement("p", { className: "hc-brief" }, tr(task.brief)), /* @__PURE__ */ React.createElement("div", { className: "hc-checklist" }, /* @__PURE__ */ React.createElement("span", { className: "hc-count" }, passedCount, "/", reqs.length), reqs.map((r, i) => /* @__PURE__ */ React.createElement("span", { key: r.id, className: `hc-chip ${merged[i]?.ok ? "ok" : ""}`, title: merged[i]?.hint || "" }, /* @__PURE__ */ React.createElement("span", { className: "hc-dot" }, merged[i]?.ok ? "✓" : i + 1), tr(r.label)))), /* @__PURE__ */ React.createElement("div", { className: "hc-msg" }, fmtNote ? /* @__PURE__ */ React.createElement("p", { className: "hc-note" }, fmtNote) : shownErrors.length > 0 ? /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "hc-err",
        onClick: () => jumpToLine(shownErrors[0].line),
        title: tr({ uz: "Bosing — kursor shu qatorga tushadi", ru: "Нажмите — курсор перейдёт на эту строку" })
      },
      "⚠ ",
      tr({ uz: "Qator", ru: "Строка" }),
      " ",
      shownErrors[0].line,
      ": ",
      shownErrors[0].msg,
      shownErrors.length > 1 && /* @__PURE__ */ React.createElement("b", { className: "hc-err-more" }, " +", shownErrors.length - 1)
    ) : !allPassed && firstHint && /* @__PURE__ */ React.createElement("p", { className: "hc-hint" }, "💡 ", firstHint))),
    narrow && /* @__PURE__ */ React.createElement("div", { className: "hc-panetabs", role: "tablist" }, /* @__PURE__ */ React.createElement("button", { type: "button", role: "tab", "aria-selected": pane === "code", className: pane === "code" ? "on" : "", onClick: () => setPane("code") }, "⌨ ", tr({ uz: "Kod", ru: "Код" })), /* @__PURE__ */ React.createElement("button", { type: "button", role: "tab", "aria-selected": pane === "result", className: pane === "result" ? "on" : "", onClick: () => setPane("result") }, "📺 ", tr({ uz: "Natija", ru: "Результат" }))),
    /* @__PURE__ */ React.createElement("main", { ref: splitRef, className: `hc-split${narrow ? ` tabbed pane-${pane}` : ""}` }, /* @__PURE__ */ React.createElement("section", { className: "hc-pane hc-editor-pane" }, /* @__PURE__ */ React.createElement("div", { className: "hc-pane-bar hc-tabs-bar" }, /* @__PURE__ */ React.createElement("span", { className: "hc-dots" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("div", { className: "hc-tabs" }, files.map((f) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f.name,
        className: `hc-tab ${active === f.name ? "active" : ""}`,
        onClick: () => setActive(f.name)
      },
      f.name
    ))), /* @__PURE__ */ React.createElement("div", { className: "hc-tools" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "hc-ic",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => {
          taRef.current?.focus();
          document.execCommand("undo");
        },
        title: tr({ uz: "Orqaga qaytarish (Ctrl+Z)", ru: "Отменить (Ctrl+Z)" }),
        "aria-label": tr({ uz: "Orqaga qaytarish", ru: "Отменить" })
      },
      "↶"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "hc-ic",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => {
          taRef.current?.focus();
          document.execCommand("redo");
        },
        title: tr({ uz: "Qaytarilganni tiklash (Ctrl+Y)", ru: "Вернуть (Ctrl+Y)" }),
        "aria-label": tr({ uz: "Tiklash", ru: "Вернуть" })
      },
      "↷"
    ), activeLang === "html" && /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "hc-ic wide",
        onMouseDown: (e) => e.preventDefault(),
        onClick: prettify,
        title: tr({ uz: "Kodni chiroyli chekintiradi", ru: "Аккуратно расставит отступы" })
      },
      "✨ ",
      tr({ uz: "Chiroyli", ru: "Красиво" })
    )), /* @__PURE__ */ React.createElement("button", { className: "hc-mini", onClick: runNow, title: tr({ uz: "Ishga tushirish", ru: "Запустить" }) }, "▶ ", tr({ uz: "Ishga tushirish", ru: "Запустить" }))), /* @__PURE__ */ React.createElement("div", { className: "hc-editor-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "hc-gutter", ref: gutRef, "aria-hidden": "true" }, lineNos), /* @__PURE__ */ React.createElement("div", { className: "hc-code-box", ref: boxRef }, /* @__PURE__ */ React.createElement(
      "pre",
      {
        className: "hc-hl",
        ref: hlRef,
        "aria-hidden": "true",
        dangerouslySetInnerHTML: { __html: highlight(codes[active] ?? "", activeLang) + "\n" }
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "hc-curline", ref: curLineRef, "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        ref: taRef,
        className: "hc-code",
        value: codes[active] ?? "",
        onChange: onChangeCode,
        onKeyDown,
        onKeyUp: () => {
          syncTail();
          refreshMenu();
          updateCaretUi();
        },
        onSelect: () => {
          syncTail();
          refreshMenu();
          updateCaretUi();
        },
        onFocus: () => {
          syncTail();
          updateCaretUi();
        },
        onBlur: () => {
          setTailTyping(false);
          setMenu(null);
          updateCurLine();
        },
        onScroll: syncScroll,
        spellCheck: false,
        autoCapitalize: "off",
        autoCorrect: "off",
        placeholder: tr(files.find((f) => f.name === active)?.placeholder ?? task.placeholder ?? { uz: "Kodingizni shu yerga yozing…", ru: "Пишите свой код здесь…" })
      }
    ), menu && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `hc-menu${menu.above ? " up" : ""}`,
        style: { left: menu.x, top: menu.y },
        role: "listbox",
        onMouseDown: (e) => e.preventDefault()
      },
      /* @__PURE__ */ React.createElement("div", { className: "hc-menu-list", ref: menuListRef }, menu.items.map((it, i) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: it.t || it.a,
          role: "option",
          "aria-selected": i === menu.idx,
          className: `hc-menu-row ${i === menu.idx ? "on" : ""}`,
          onClick: () => acceptMenu(it)
        },
        /* @__PURE__ */ React.createElement("span", { className: "hc-menu-k" }, menu.kind === "tag" ? `<${it.t}>` : it.a),
        /* @__PURE__ */ React.createElement("span", { className: "hc-menu-d" }, tr(it.d))
      ))),
      /* @__PURE__ */ React.createElement("span", { className: "hc-menu-tip" }, touch ? tr({ uz: "Bosib tanlang", ru: "Нажмите, чтобы выбрать" }) : tr({ uz: "Enter — tanlash · Esc — yopish", ru: "Enter — выбрать · Esc — закрыть" }))
    ))), touch && /* @__PURE__ */ React.createElement("div", { className: "hc-keys" }, (TOUCH_KEYS[activeLang] || TOUCH_KEYS.html).map((ch) => /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        key: ch,
        className: "hc-key",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => {
          const el = taRef.current;
          if (el) put(el, ch, el.selectionStart + ch.length);
        }
      },
      ch
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "hc-key wide",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => {
          const el = taRef.current;
          if (el) put(el, "  ", el.selectionStart + 2);
        },
        title: tr({ uz: "Ichkariga surish", ru: "Отступ" })
      },
      "⇥"
    )), !narrow && /* @__PURE__ */ React.createElement("div", { className: "hc-statusbar" }, /* @__PURE__ */ React.createElement("span", { className: "hc-sb-file" }, active), /* @__PURE__ */ React.createElement("span", { className: "hc-sb-lang" }, activeLang), /* @__PURE__ */ React.createElement("div", { className: "hc-sb-font" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "hc-sb-btn",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => bumpFont(-1),
        title: tr({ uz: "Shriftni kichraytirish", ru: "Уменьшить шрифт" }),
        "aria-label": tr({ uz: "Shriftni kichraytirish", ru: "Уменьшить шрифт" })
      },
      "A−"
    ), /* @__PURE__ */ React.createElement("span", { className: "hc-sb-fs" }, fontSize), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "hc-sb-btn",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => bumpFont(1),
        title: tr({ uz: "Shriftni kattalashtirish", ru: "Увеличить шрифт" }),
        "aria-label": tr({ uz: "Shriftni kattalashtirish", ru: "Увеличить шрифт" })
      },
      "A+"
    )), /* @__PURE__ */ React.createElement("span", { className: "hc-sb-pos" }, tr({ uz: "Qator", ru: "Строка" }), " ", caretPos.ln, ", ", tr({ uz: "Ustun", ru: "Столбец" }), " ", caretPos.col))), !narrow && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "hc-divider",
        role: "separator",
        "aria-orientation": "vertical",
        onPointerDown: dragStart,
        onDoubleClick: () => setSplit(0.5),
        title: tr({ uz: "Sudrang — panellar kengligi o'zgaradi · 2 marta bosish — teng", ru: "Тяните — изменится ширина панелей · двойной клик — поровну" })
      },
      /* @__PURE__ */ React.createElement("i", null)
    ), /* @__PURE__ */ React.createElement("section", { className: "hc-pane hc-preview-pane" }, /* @__PURE__ */ React.createElement("div", { className: "hc-pane-bar" }, task.previewUrl ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "hc-dots" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("span", { className: "hc-url" }, /* @__PURE__ */ React.createElement("span", { className: "hc-lock" }, "●"), tr(task.previewUrl))) : /* @__PURE__ */ React.createElement("span", { className: "hc-pane-name" }, "📺 ", tr({ uz: "Natija", ru: "Результат" })), stale ? /* @__PURE__ */ React.createElement("span", { className: "hc-stale" }, tr({ uz: "eskirdi · ▶ bosing", ru: "устарело · нажмите ▶" })) : /* @__PURE__ */ React.createElement("span", { className: "hc-live" }, tr({ uz: "jonli", ru: "live" }))), !framesOff && /* @__PURE__ */ React.createElement(
      "iframe",
      {
        key: frameGen,
        ref: previewFrameRef,
        className: "hc-frame",
        title: "natija",
        sandbox: "allow-scripts allow-popups allow-popups-to-escape-sandbox",
        srcDoc: doc
      }
    ), hung && /* @__PURE__ */ React.createElement("div", { className: "hc-hung", role: "alert" }, HUNG_MSG), showConsole && /* @__PURE__ */ React.createElement("div", { className: "hc-console" }, /* @__PURE__ */ React.createElement("div", { className: "hc-console-bar" }, /* @__PURE__ */ React.createElement("span", { className: "hc-console-title" }, "🖥️ Console"), consoleLines.length > 0 && /* @__PURE__ */ React.createElement("button", { className: "hc-console-clear", onClick: () => setConsoleLines([]) }, tr({ uz: "tozalash", ru: "очистить" }))), /* @__PURE__ */ React.createElement("div", { className: "hc-console-body" }, consoleLines.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "hc-console-empty" }, tr({ uz: "console.log(...) natijasi shu yerda chiqadi", ru: "результат console.log(...) появится здесь" })) : consoleLines.map((l, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `hc-console-line lvl-${l.level}` }, /* @__PURE__ */ React.createElement("span", { className: "hc-console-caret" }, "›"), /* @__PURE__ */ React.createElement("span", { className: "hc-console-text" }, l.text))))))),
    hasRuntime && !framesOff && /* @__PURE__ */ React.createElement(
      "iframe",
      {
        key: frameGen,
        ref: checkFrameRef,
        "aria-hidden": "true",
        tabIndex: -1,
        title: "tekshiruv",
        sandbox: "allow-scripts",
        srcDoc: checkDoc,
        style: { position: "fixed", left: "-9999px", top: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none", border: "none" }
      }
    ),
    /* @__PURE__ */ React.createElement("footer", { className: "hc-bottom" }, onBack && /* @__PURE__ */ React.createElement("button", { className: "hc-ghost", onClick: onBack }, "← ", tr({ uz: "Orqaga", ru: "Назад" })), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `hc-ghost${resetArmed ? " armed" : ""}`,
        onClick: reset,
        onBlur: disarm,
        title: tr({ uz: "Kodni boshlang'ich holatga qaytaradi", ru: "Вернуть код к начальному виду" })
      },
      resetArmed ? `⚠ ${tr({ uz: "Rostdanmi?", ru: "Точно?" })}` : tr({ uz: "Qaytadan", ru: "Заново" })
    ), /* @__PURE__ */ React.createElement("div", { className: "hc-status" }, statusMsg), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "hc-next",
        disabled: !allPassed,
        title: allPassed ? "" : blockedBySyntax ? tr({ uz: "Sintaksis xatosi tuzatilsa ochiladi", ru: "Откроется после исправления синтаксиса" }) : tr({ uz: "Barcha shartlar bajarilsa ochiladi", ru: "Откроется, когда все условия выполнены" }),
        onClick: () => allPassed && onContinue && onContinue({ codes, code: html })
      },
      tr({ uz: "Davom etish", ru: "Продолжить" }),
      " →"
    ))
  );
}
function StyleTag() {
  return /* @__PURE__ */ React.createElement("style", null, `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
      .hc-root,.hc-root *{box-sizing:border-box}
      .hc-root{font-family:'Manrope',system-ui,sans-serif;color:${HC_T.ink};background:
        radial-gradient(120% 80% at 50% -10%, ${HC_T.accentSoft} 0%, rgba(255,237,229,0) 46%),
        ${HC_T.bg};
        /* Keng ekranda dars bilan bir xil masshtab (--lz), lekin balandlik zoomga BO'LINADI —
           aks holda 100dvh zoomga ko'payib, kompilyatorning pasti ekrandan chiqib ketadi (F-0808-02). */
        zoom:var(--lz,1);height:calc(100dvh / var(--lz,1));
        /* F-0813-01: 1160px «kichkina ramka» e'tirozi — desktopda +50% kengaytirildi.
           Balandlik TEGILMAGAN (100dvh o'zgarishsiz); kichik ekranda width:100% cap. */
        display:flex;flex-direction:column;justify-content:center;gap:clamp(12px,1.8vw,18px);padding:clamp(16px,2.4vw,30px);overflow:hidden;-webkit-font-smoothing:antialiased;width:100%;max-width:1740px;margin:0 auto}

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
      /* F-0808-02: qat'iy balandlik — xabar paydo bo'lganda/yo'qolganda muharrir SAKRAMAYDI */
      .hc-msg{height:40px;width:100%;display:flex;align-items:center;justify-content:center;margin-top:3px;overflow:hidden}
      .hc-hint.hc-hint{margin:0;font-size:13px;color:${HC_T.warn};background:#FFF6EA;border:1px solid #F4DFBC;padding:8px 15px;border-radius:11px;max-width:76ch;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .hc-err{font-size:12.5px;color:#C01024;background:#FDECEC;border:1px solid #F6CFCF;padding:7px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace;max-width:76ch;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;text-align:left}
      .hc-err:hover{background:#FBDFDF;border-color:#EEB8B8}
      .hc-err-more{margin-left:8px;background:#C01024;color:#fff;border-radius:99px;padding:1px 7px;font-size:11px}

      /* F-0813-01: 3 ustun — editor | sudraluvchi chegara | natija. Ulush --hcL/--hcR
         o'zgaruvchilarida (30–70%), sudralganda JS yangilaydi, tanlov eslab qolinadi. */
      .hc-split{flex:none;height:calc(62dvh / var(--lz,1));min-height:0;display:grid;grid-template-columns:minmax(0,var(--hcL,1fr)) 12px minmax(0,var(--hcR,1fr));gap:clamp(3px,.4vw,5px)}
      .hc-pane{display:flex;flex-direction:column;min-height:0;border-radius:18px;overflow:hidden;background:${HC_T.paper};box-shadow:0 1px 0 ${HC_T.line},0 18px 40px -22px rgba(${HC_T.shadowBase},.35)}
      .hc-pane-bar{display:flex;align-items:center;gap:10px;padding:10px 15px;font-size:12px;font-weight:600;color:${HC_T.ink2}}
      .hc-editor-pane .hc-pane-bar{background:${HC_CODE.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane .hc-pane-bar{background:${HC_T.paper};border-bottom:1px solid ${HC_T.line}}
      .hc-dots{display:inline-flex;gap:6px;flex-shrink:0}
      .hc-dots i{width:11px;height:11px;border-radius:50%;background:#3A4760;display:block}
      .hc-dots i:nth-child(1){background:#ff5f56}.hc-dots i:nth-child(2){background:#ffbd2e}.hc-dots i:nth-child(3){background:#27c93f}
      .hc-pane-name{font-family:'JetBrains Mono',monospace;font-weight:700}
      /* Soxta brauzer manzil-qatori — task.previewUrl berilganda (F-0809-05) */
      .hc-url{font-family:'JetBrains Mono',monospace;font-size:11px;color:${HC_T.ink2};display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
      .hc-lock{color:${HC_T.success};font-size:8px;flex-shrink:0}
      .hc-live{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${HC_T.success};background:${HC_T.successSoft};padding:4px 9px;border-radius:99px;font-weight:800;display:inline-flex;align-items:center;gap:6px}
      .hc-live::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.success};animation:hc-pulse 1.8s infinite}
      /* Kod o'zgardi, natija hali eski (F-0809-03) */
      .hc-stale{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${HC_T.warn};background:#FFF3E0;padding:4px 9px;border-radius:99px;font-weight:800;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
      .hc-stale::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.warn}}
      @keyframes hc-pulse{0%{box-shadow:0 0 0 0 ${HC_T.success}66}70%{box-shadow:0 0 0 6px ${HC_T.success}00}100%{box-shadow:0 0 0 0 ${HC_T.success}00}}

      .hc-tabs{display:flex;gap:4px;overflow:hidden}
      .hc-tab{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;padding:6px 13px;border-radius:9px;cursor:pointer;transition:all .15s;white-space:nowrap}
      .hc-tab:hover{color:#cfe0ff;background:rgba(255,255,255,.06)}
      .hc-tab.active{color:#fff;background:rgba(255,255,255,.14);box-shadow:inset 0 -2px 0 ${HC_T.accent}}
      .hc-mini{margin-left:auto;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:9px;padding:6px 13px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;transition:all .18s;flex-shrink:0;box-shadow:0 6px 14px -6px rgba(255,77,38,.6)}
      .hc-mini:hover{transform:translateY(-1px);box-shadow:0 9px 18px -6px rgba(255,77,38,.7)}
      .hc-mini:active{transform:translateY(0)}

      .hc-editor-wrap{flex:1;min-height:0;display:flex;background:${HC_CODE.bg};overflow:hidden}
      .hc-gutter{flex:0 0 auto;padding:18px 10px 18px 16px;font-family:'JetBrains Mono',monospace;font-size:var(--hcfs,14px);line-height:1.7;color:#41527A;text-align:right;white-space:pre;user-select:none;overflow:hidden;pointer-events:none}
      /* overflow:hidden — joriy-qator chizig'i surilganda quti tashqarisiga chiqmasin */
      .hc-code-box{position:relative;flex:1;min-width:0;min-height:0;overflow:hidden}

      /* 🔴 RANG QATLAMI: quyidagi UCHTA xossa .hc-hl va .hc-code da AYNAN bir xil
         bo'lishi shart (shrift, o'lcham, qator balandligi, chekinish, white-space) —
         bitta piksel farq qilsa, harflar kursordan siljib ketadi. */
      .hc-hl,.hc-code{position:absolute;inset:0;margin:0;border:none;
        font-family:'JetBrains Mono',monospace;font-size:var(--hcfs,14px);line-height:1.7;letter-spacing:0;
        padding:18px 20px 18px 12px;tab-size:2;white-space:pre;overflow:auto}
      .hc-hl{color:${HC_CODE.text};background:${HC_CODE.bg};pointer-events:none;overflow:hidden;z-index:0}
      .hc-code{resize:none;outline:none;background:transparent;color:transparent;caret-color:${HC_T.accent2};z-index:1}
      .hc-code::placeholder{color:#5B6B86}
      /* yarim-shaffof: tanlangan matn ostidagi rangli harflar ko'rinib tursin */
      .hc-code::selection{background:rgba(255,138,61,.34)}
      .hc-hl i{font-style:normal}
      .hc-hl .t-tag{color:${HC_CODE.tag}}
      .hc-hl .t-attr{color:${HC_CODE.attr}}
      .hc-hl .t-str{color:${HC_CODE.str}}
      .hc-hl .t-comment{color:${HC_CODE.comment};font-style:italic}
      .hc-hl .t-punct{color:${HC_CODE.punct}}
      .hc-hl .t-num{color:${HC_CODE.num}}

      /* Taklif-ro'yxati (teg va atribut) */
      .hc-menu{position:absolute;z-index:5;min-width:230px;max-width:330px;background:#16213A;border:1px solid #2C3C5E;border-radius:12px;padding:5px;box-shadow:0 18px 40px -12px rgba(0,0,0,.6);display:flex;flex-direction:column;gap:1px}
      /* ~8 qator ko'rinadi, qolgani suriladi; yorliq pastda QOTIB turadi */
      .hc-menu-list{display:flex;flex-direction:column;gap:1px;max-height:248px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#3A4C70 transparent}
      .hc-menu-list::-webkit-scrollbar{width:8px}
      .hc-menu-list::-webkit-scrollbar-thumb{background:#3A4C70;border-radius:99px}
      .hc-menu-row{display:flex;align-items:baseline;gap:9px;width:100%;text-align:left;background:transparent;border:none;border-radius:8px;padding:7px 10px;cursor:pointer;color:#C9D6EE;font-family:'Manrope',sans-serif}
      .hc-menu-row:hover{background:rgba(255,255,255,.07)}
      .hc-menu-row.on{background:${HC_T.accent}2E;outline:1px solid ${HC_T.accent}77}
      .hc-menu-k{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${HC_CODE.tag};white-space:nowrap;font-feature-settings:"liga" 0,"calt" 0}
      .hc-menu-d{font-size:12px;color:#8FA2C4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .hc-menu-tip{padding:5px 10px 3px;font-size:10.5px;color:#61759B;font-family:'Manrope',sans-serif;border-top:1px solid #26344F;margin-top:2px}

      /* Muharrir tugmachalari: ↶ ↷ ✨ */
      .hc-tools{display:flex;align-items:center;gap:4px;margin-left:10px;flex-shrink:0}
      .hc-ic{background:rgba(255,255,255,.07);color:#B9C8E4;border:none;border-radius:8px;min-width:28px;height:26px;padding:0 7px;font-size:14px;line-height:1;cursor:pointer;transition:all .15s;font-family:'Manrope',sans-serif}
      .hc-ic.wide{font-size:11.5px;font-weight:700;padding:0 10px}
      .hc-ic:hover{background:rgba(255,255,255,.16);color:#fff}
      .hc-note{margin:0;font-size:13px;font-weight:600;color:${HC_T.ink2};background:${HC_T.paper};border:1px solid ${HC_T.line};padding:8px 15px;border-radius:11px;white-space:nowrap}
      @media (max-width:720px){ .hc-ic.wide{font-size:0;padding:0 8px} .hc-ic.wide::after{content:"✨";font-size:13px} }

      /* 🔴 F-0808-02 LIGATURA: JetBrains Mono izoh-ochilishini chap strelka deb, izoh-yopilishini
         o'ng strelka deb chizadi; yopuvchi-teg boshi va o'zi-yopiluvchi teg oxiri bir-biriga
         qo'shilib ketadi. HTML o'rganayotgan bola o'zi yozgan belgini ko'rmay qoladi.
         Shuning uchun barcha kod-matnda ligatura O'CHIRILGAN.
         DIQQAT: font-variant-ligatures QO'SHILMAYDI — u qo'shilsa Chrome bu qatorni e'tiborsiz qoldiradi. */
      .hc-code,.hc-hl,.hc-gutter,.hc-err,.hc-count,.hc-pane-name,.hc-tab,.hc-console-title,.hc-console-body{font-feature-settings:"liga" 0,"calt" 0}

      .hc-frame{flex:1;min-height:0;width:100%;border:none;background:#fff}
      .hc-hung{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:14px;line-height:1.55;font-weight:700;color:#9A2A0F;background:#FFF1EC;border-top:2px solid ${HC_T.accent}}

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
      /* «Qaytadan» ogohlantirish holati (F-0809-03) */
      .hc-ghost.armed{color:#C01024;border-color:#F6CFCF;background:#FDECEC;font-weight:800}
      .hc-ghost.armed:hover{background:#FBDFDF;border-color:#EEB8B8;color:#C01024}
      .hc-warn-msg{color:#C01024;font-size:13px;font-weight:700}
      .hc-undo{background:${HC_T.ink};color:#fff;border:none;border-radius:9px;padding:5px 12px;font-family:'Manrope',sans-serif;font-weight:800;font-size:12.5px;cursor:pointer;margin-left:4px}
      .hc-undo:hover{background:${HC_T.accent}}
      .hc-next{background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:13px;font-family:'Manrope',sans-serif;font-weight:800;font-size:15px;cursor:pointer;padding:13px 30px;box-shadow:0 10px 24px -8px rgba(255,77,38,.6);transition:all .2s}
      .hc-next:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 32px -8px rgba(255,77,38,.7)}
      .hc-next:active:not(:disabled){transform:translateY(0)}
      .hc-next:disabled{background:#D7D8DE;color:#fff;cursor:not-allowed;box-shadow:none}

      /* ============================================================
         F-0813-01 — VS CODE QULAYLIKLARI
         Joriy qator · holat-qatori · shrift o'lchami · sudraluvchi chegara
         ============================================================ */
      /* Joriy qator — DOM'da .hc-hl DAN KEYIN turadi (hl foni to'q va shaffof emas,
         shuning uchun tartib muhim); matn maydoni (z-index:1) baribir ustida. */
      .hc-curline{position:absolute;left:0;right:0;top:0;height:0;background:rgba(148,180,255,.08);pointer-events:none;opacity:0;transition:opacity .2s}

      .hc-statusbar{flex-shrink:0;display:flex;align-items:center;gap:14px;padding:3px 14px;background:${HC_CODE.bg};border-top:1px solid rgba(255,255,255,.07);color:#7E92B4;font-size:11px;font-family:'JetBrains Mono',monospace;user-select:none;font-feature-settings:"liga" 0,"calt" 0}
      .hc-sb-file{color:#A7B6D6;font-weight:700}
      .hc-sb-lang{text-transform:uppercase;letter-spacing:.08em;color:#61759B}
      .hc-sb-pos{margin-left:auto;white-space:nowrap}
      .hc-sb-font{display:flex;align-items:center;gap:3px}
      .hc-sb-fs{min-width:20px;text-align:center;color:#A7B6D6}
      .hc-sb-btn{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;cursor:pointer;border-radius:6px;padding:2px 7px;transition:all .15s}
      .hc-sb-btn:hover{background:rgba(255,255,255,.12);color:#fff}

      .hc-divider{cursor:col-resize;display:flex;align-items:center;justify-content:center;touch-action:none;border-radius:8px;transition:background .15s}
      .hc-divider:hover{background:rgba(0,0,0,.04)}
      .hc-divider i{width:4px;height:46px;border-radius:99px;background:${HC_T.line};transition:all .15s}
      .hc-divider:hover i{background:${HC_T.accent};height:70px}
      .hc-root.dragging .hc-divider i{background:${HC_T.accent};height:70px}
      .hc-root.dragging{cursor:col-resize;user-select:none}
      /* Sudrash payti iframe sichqonchani «yutmasin» — aks holda chegara qo'ldan chiqadi */
      .hc-root.dragging .hc-frame{pointer-events:none}

      /* ============================================================
         3-BOSQICH — PLANSHET VA TELEFON
         Ikki mustaqil o'lchov:
           1) tabbed sinfi (JS, 860px gacha) — muharrir/natija tab bilan almashadi
           2) pointer:coarse so'rovi (CSS) — barmoq bilan ishlanadigan ekran
         Sichqonchali keng ekranga bu qoidalarning BIRORTASI ham tegmaydi.
         ============================================================ */
      .hc-panetabs{display:flex;gap:6px;justify-content:center;width:100%}
      .hc-panetabs button{flex:1;max-width:200px;background:${HC_T.paper};border:1px solid ${HC_T.line};color:${HC_T.ink2};
        font-family:'Manrope',sans-serif;font-weight:700;font-size:13px;padding:9px 12px;border-radius:11px;cursor:pointer;transition:all .15s}
      .hc-panetabs button.on{background:${HC_T.ink};color:#fff;border-color:${HC_T.ink}}

      /* Tab rejimi: bitta panel to'liq balandlikda */
      .hc-split.tabbed{grid-template-columns:1fr;grid-template-rows:1fr;flex:1;height:auto;min-height:0}
      .hc-split.tabbed .hc-pane{display:none}
      .hc-split.tabbed.pane-code .hc-editor-pane{display:flex}
      .hc-split.tabbed.pane-result .hc-preview-pane{display:flex}

      /* Barmoq uchun belgi qatori */
      .hc-keys{flex-shrink:0;display:flex;gap:5px;padding:6px 8px;background:#121C30;border-top:1px solid rgba(255,255,255,.07);overflow-x:auto}
      /* flex 1 1 auto — tor telefonda tugmalar QISQARADI, oxirgisi qirqilib qolmaydi */
      .hc-key{flex:1 1 auto;min-width:34px;max-width:76px;height:38px;background:rgba(255,255,255,.09);color:#DCE6F7;border:none;border-radius:9px;
        font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;cursor:pointer;font-feature-settings:"liga" 0,"calt" 0}
      .hc-key:active{background:${HC_T.accent};color:#fff}
      .hc-key.wide{font-size:15px}

      /* Ro'yxat pastga sig'masa — kursordan TEPAGA chiqadi */
      .hc-menu.up{transform:translateY(-100%)}

      @media (max-width:860px){
        .hc-root{justify-content:flex-start;padding:10px 12px;gap:8px}
        .hc-statusbar{display:none}
        .hc-title{font-size:clamp(17px,4.6vw,23px)}
        .hc-brief{font-size:12.5px;line-height:1.4}
        .hc-checklist{width:100%;flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;padding-bottom:3px;gap:6px}
        .hc-chip{flex-shrink:0}
        .hc-msg{height:34px}
        .hc-bottom{gap:8px}
        .hc-status{order:3;width:100%;text-align:center}
      }
      @media (max-width:520px){
        /* Telefonda shart-matni o'rniga chiplar qoladi — ular baribir shartni aytadi */
        .hc-brief{display:none}
        .hc-panetabs button{font-size:12.5px;padding:8px 10px}
        .hc-ghost{padding:10px 12px;font-size:12.5px}
      }
      /* Barmoq bilan bosiladigan nishonlar kattaroq */
      @media (pointer: coarse){
        .hc-tab{padding:9px 14px;font-size:13px}
        .hc-ic{min-width:38px;height:36px;font-size:17px}
        .hc-mini{padding:9px 15px;font-size:13px}
        .hc-menu-row{padding:11px 12px}
        .hc-menu{min-width:246px}
        .hc-ghost,.hc-next{padding:12px 18px}
        .hc-panetabs button{padding:11px 12px}
      }
    `);
}
var HtmlCompiler_default = HtmlCompiler;
export {
  checks,
  HtmlCompiler_default as default,
  formatHtml,
  highlight
};

export const HC_NASHR = '2026-08-17';

