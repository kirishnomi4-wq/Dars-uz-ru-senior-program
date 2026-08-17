// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/PmLesson4.jsx
//          src/compilator/HtmlCompiler.jsx
//  Qayta yig'ish:  npm run build:lms
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/PmLesson4.jsx
import React, { useState as useState2, useEffect as useEffect2, useRef as useRef2, useCallback, useMemo as useMemo2, createContext, useContext, useState, useEffect, useLayoutEffect, useRef, useMemo, isValidElement } from "react";

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
  cssValue: (selector, prop, val, hint) => (x) => {
    const hit = x.cssRules.some(
      (r) => r.selector.split(",").map(norm).includes(norm(selector)) && norm(r.props[prop]) === norm(val)
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
  const nonceRef = useRef(0);
  const [runtimeResults, setRuntimeResults] = useState({});
  const showConsole = useMemo(() => files.some((f) => f.lang === "js"), [files]);
  const consoleNonceRef = useRef(0);
  const [consoleLines, setConsoleLines] = useState([]);
  const mkDoc = (extra = {}) => wrapDoc(html, css, js, { previewCss: task.previewCss, ...extra });
  const [doc, setDoc] = useState(() => wrapDoc(html, css, js, { previewCss: task.previewCss }));
  const [checkDoc, setCheckDoc] = useState("");
  const manualRun = showConsole;
  const sig = `${html}\0${css}\0${js}`;
  const lastRunRef = useRef(null);
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      if (!manualRun) {
        setDoc(mkDoc());
      } else if (lastRunRef.current === null) {
        const cn = ++consoleNonceRef.current;
        setConsoleLines([]);
        setDoc(mkDoc({ consoleNonce: cn }));
        lastRunRef.current = sig;
        setStale(false);
      } else {
        setStale(lastRunRef.current !== sig);
      }
      if (hasRuntime) {
        const nonce = ++nonceRef.current;
        setRuntimeResults({});
        setCheckDoc(mkDoc({ capture: true, harness: buildHarness(runtimeProbes, nonce) }));
      }
    }, 300);
    return () => clearTimeout(id);
  }, [sig, html, css, js, hasRuntime, runtimeProbes, manualRun]);
  useEffect(() => {
    if (!hasRuntime) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcReport && d.nonce === nonceRef.current) {
        setRuntimeResults(d.results || {});
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [hasRuntime]);
  useEffect(() => {
    if (!showConsole) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcConsole && d.nonce === consoleNonceRef.current) {
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
      if (got === void 0) return { ok: false, hint: tr({ uz: "ishga tushirilmoqda…", ru: "запускается…" }) };
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
    setDoc(mkDoc(cn != null ? { consoleNonce: cn } : {}));
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
    statusMsg = <span className="hc-wait-msg">{tr({ uz: "Kod tozalandi.", ru: "Код очищен." })}{" "}
        <button type="button" className="hc-undo" onClick={restore}>↶ {tr({ uz: "Qaytarish", ru: "Вернуть" })}</button>
      </span>;
  } else if (resetArmed) {
    statusMsg = <span className="hc-warn-msg">⚠ {tr({ uz: "Butun kod o'chadi — tugmani yana bosing", ru: "Весь код сотрётся — нажмите кнопку ещё раз" })}</span>;
  } else if (allPassed) {
    statusMsg = <span className="hc-ok-msg">✓ {tr({ uz: "Barcha shartlar bajarildi!", ru: "Все условия выполнены!" })}</span>;
  } else if (blockedBySyntax) {
    statusMsg = <span className="hc-wait-msg">✓ {tr({ uz: "Shartlar bajarildi — sintaksis xatosi qoldi (yuqorida)", ru: "Условия выполнены — остался синтаксис (см. выше)" })}</span>;
  } else {
    statusMsg = <span className="hc-wait-msg">{narrow ? tr({ uz: "Shartlarni bajaring — «Natija» tabida ko'rinadi", ru: "Выполняйте условия — смотрите во вкладке «Результат»" }) : tr({ uz: "Shartlarni bajaring — natija o'ngda ko'rinadi", ru: "Выполняйте условия — результат виден справа" })}</span>;
  }
  return <div
    className={`hc-root${dragging ? " dragging" : ""}`}
    style={{ "--hcfs": fontSize + "px", "--hcL": split.toFixed(3) + "fr", "--hcR": (1 - split).toFixed(3) + "fr" }}
  >
      <StyleTag />

      {
    /* ── Tepa: shart (markazda) ── */
  }
      <header className="hc-top">
        {task.eyebrow && <span className="hc-eyebrow">{tr(task.eyebrow)}</span>}
        <h1 className="hc-title">{tr(task.title)}</h1>
        {task.brief && <p className="hc-brief">{tr(task.brief)}</p>}
        <div className="hc-checklist">
          <span className="hc-count">{passedCount}/{reqs.length}</span>
          {reqs.map((r, i) => <span key={r.id} className={`hc-chip ${merged[i]?.ok ? "ok" : ""}`} title={merged[i]?.hint || ""}>
              <span className="hc-dot">{merged[i]?.ok ? "✓" : i + 1}</span>
              {tr(r.label)}
            </span>)}
        </div>
        {
    /* Xabar maydoni — BALANDLIGI QOTIRILGAN va bitta qator.
       Avval xato paneli 1↔3 qatorga o'zgarardi va `.hc-root` markazlashtirgani uchun
       butun muharrir har bosishda 29px sakrardi (F-0808-02). Endi sakramaydi.
       Bir vaqtda BITTA xato: 13 yoshli bolaga uchta qizil qator — shovqin. */
  }
        <div className="hc-msg">
          {fmtNote ? <p className="hc-note">{fmtNote}</p> : shownErrors.length > 0 ? <button
    type="button"
    className="hc-err"
    onClick={() => jumpToLine(shownErrors[0].line)}
    title={tr({ uz: "Bosing — kursor shu qatorga tushadi", ru: "Нажмите — курсор перейдёт на эту строку" })}
  >
              ⚠ {tr({ uz: "Qator", ru: "Строка" })} {shownErrors[0].line}: {shownErrors[0].msg}
              {shownErrors.length > 1 && <b className="hc-err-more"> +{shownErrors.length - 1}</b>}
            </button> : !allPassed && firstHint && <p className="hc-hint">💡 {firstHint}</p>}
        </div>
      </header>

      {
    /* Tor ekranda: muharrir va natija tab bilan almashadi (yonma-yon sig'maydi) */
  }
      {narrow && <div className="hc-panetabs" role="tablist">
          <button type="button" role="tab" aria-selected={pane === "code"} className={pane === "code" ? "on" : ""} onClick={() => setPane("code")}>
            ⌨ {tr({ uz: "Kod", ru: "Код" })}
          </button>
          <button type="button" role="tab" aria-selected={pane === "result"} className={pane === "result" ? "on" : ""} onClick={() => setPane("result")}>
            📺 {tr({ uz: "Natija", ru: "Результат" })}
          </button>
        </div>}

      {
    /* ── O'rta: editor | natija ── */
  }
      <main ref={splitRef} className={`hc-split${narrow ? ` tabbed pane-${pane}` : ""}`}>
        <section className="hc-pane hc-editor-pane">
          <div className="hc-pane-bar hc-tabs-bar">
            <span className="hc-dots"><i /><i /><i /></span>
            <div className="hc-tabs">
              {files.map((f) => <button
    key={f.name}
    className={`hc-tab ${active === f.name ? "active" : ""}`}
    onClick={() => setActive(f.name)}
  >
                  {f.name}
                </button>)}
            </div>
            <div className="hc-tools">
              <button
    className="hc-ic"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => {
      taRef.current?.focus();
      document.execCommand("undo");
    }}
    title={tr({ uz: "Orqaga qaytarish (Ctrl+Z)", ru: "Отменить (Ctrl+Z)" })}
    aria-label={tr({ uz: "Orqaga qaytarish", ru: "Отменить" })}
  >↶</button>
              <button
    className="hc-ic"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => {
      taRef.current?.focus();
      document.execCommand("redo");
    }}
    title={tr({ uz: "Qaytarilganni tiklash (Ctrl+Y)", ru: "Вернуть (Ctrl+Y)" })}
    aria-label={tr({ uz: "Tiklash", ru: "Вернуть" })}
  >↷</button>
              {activeLang === "html" && <button
    className="hc-ic wide"
    onMouseDown={(e) => e.preventDefault()}
    onClick={prettify}
    title={tr({ uz: "Kodni chiroyli chekintiradi", ru: "Аккуратно расставит отступы" })}
  >✨ {tr({ uz: "Chiroyli", ru: "Красиво" })}</button>}
            </div>
            <button className="hc-mini" onClick={runNow} title={tr({ uz: "Ishga tushirish", ru: "Запустить" })}>▶ {tr({ uz: "Ishga tushirish", ru: "Запустить" })}</button>
          </div>
          <div className="hc-editor-wrap">
            <div className="hc-gutter" ref={gutRef} aria-hidden="true">{lineNos}</div>
            <div className="hc-code-box" ref={boxRef}>
              {
    /* Rang qatlami matn maydoni ORTIDA turadi; matn maydonining o'z matni shaffof */
  }
              <pre
    className="hc-hl"
    ref={hlRef}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: highlight(codes[active] ?? "", activeLang) + "\n" }}
  />
              {
    /* F-0813-01: joriy qator xira yoritiladi — bola qayerdaligini ko'radi */
  }
              <div className="hc-curline" ref={curLineRef} aria-hidden="true" />
              <textarea
    ref={taRef}
    className="hc-code"
    value={codes[active] ?? ""}
    onChange={onChangeCode}
    onKeyDown={onKeyDown}
    onKeyUp={() => {
      syncTail();
      refreshMenu();
      updateCaretUi();
    }}
    onSelect={() => {
      syncTail();
      refreshMenu();
      updateCaretUi();
    }}
    onFocus={() => {
      syncTail();
      updateCaretUi();
    }}
    onBlur={() => {
      setTailTyping(false);
      setMenu(null);
      updateCurLine();
    }}
    onScroll={syncScroll}
    spellCheck={false}
    autoCapitalize="off"
    autoCorrect="off"
    placeholder={tr(files.find((f) => f.name === active)?.placeholder ?? task.placeholder ?? { uz: "Kodingizni shu yerga yozing…", ru: "Пишите свой код здесь…" })}
  />
              {menu && <div
    className={`hc-menu${menu.above ? " up" : ""}`}
    style={{ left: menu.x, top: menu.y }}
    role="listbox"
    onMouseDown={(e) => e.preventDefault()}
  >
                  {
    /* HAMMA mos band chiqadi, ~8 tasi ko'rinadi va ichida suriladi
       (F-0809-03): ilgari `slice(0,8)` edi, lekin strelka HAMMA band
       bo'ylab yurardi — 9-bandga o'tilganda tanlangan qator ko'rinmay
       qolardi va Enter kutilmagan tegni qo'yardi. */
  }
                  <div className="hc-menu-list" ref={menuListRef}>
                    {menu.items.map((it, i) => <button
    key={it.t || it.a}
    role="option"
    aria-selected={i === menu.idx}
    className={`hc-menu-row ${i === menu.idx ? "on" : ""}`}
    onClick={() => acceptMenu(it)}
  >
                        <span className="hc-menu-k">{menu.kind === "tag" ? `<${it.t}>` : it.a}</span>
                        <span className="hc-menu-d">{tr(it.d)}</span>
                      </button>)}
                  </div>
                  <span className="hc-menu-tip">{touch ? tr({ uz: "Bosib tanlang", ru: "Нажмите, чтобы выбрать" }) : tr({ uz: "Enter — tanlash · Esc — yopish", ru: "Enter — выбрать · Esc — закрыть" })}</span>
                </div>}
            </div>
          </div>
          {
    /* Barmoq bilan yoziladigan klaviaturada `<` `>` `/` `"` chuqurda yashiringan —
       shu qator ularni bir bosishga chiqaradi. Sichqonchali qurilmada ko'rinmaydi. */
  }
          {touch && <div className="hc-keys">
              {(TOUCH_KEYS[activeLang] || TOUCH_KEYS.html).map((ch) => <button
    type="button"
    key={ch}
    className="hc-key"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => {
      const el = taRef.current;
      if (el) put(el, ch, el.selectionStart + ch.length);
    }}
  >{ch}</button>)}
              <button
    type="button"
    className="hc-key wide"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => {
      const el = taRef.current;
      if (el) put(el, "  ", el.selectionStart + 2);
    }}
    title={tr({ uz: "Ichkariga surish", ru: "Отступ" })}
  >⇥</button>
            </div>}
          {
    /* F-0813-01: VS Code uslubidagi holat-qatori — fayl · til · shrift · Qator/Ustun */
  }
          {!narrow && <div className="hc-statusbar">
              <span className="hc-sb-file">{active}</span>
              <span className="hc-sb-lang">{activeLang}</span>
              <div className="hc-sb-font">
                <button
    type="button"
    className="hc-sb-btn"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => bumpFont(-1)}
    title={tr({ uz: "Shriftni kichraytirish", ru: "Уменьшить шрифт" })}
    aria-label={tr({ uz: "Shriftni kichraytirish", ru: "Уменьшить шрифт" })}
  >A−</button>
                <span className="hc-sb-fs">{fontSize}</span>
                <button
    type="button"
    className="hc-sb-btn"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => bumpFont(1)}
    title={tr({ uz: "Shriftni kattalashtirish", ru: "Увеличить шрифт" })}
    aria-label={tr({ uz: "Shriftni kattalashtirish", ru: "Увеличить шрифт" })}
  >A+</button>
              </div>
              <span className="hc-sb-pos">{tr({ uz: "Qator", ru: "Строка" })} {caretPos.ln}, {tr({ uz: "Ustun", ru: "Столбец" })} {caretPos.col}</span>
            </div>}
        </section>

        {
    /* F-0813-01: chegara — sudrab Editor/Natija ulushi o'zgaradi, 2 bosish — teng */
  }
        {!narrow && <div
    className="hc-divider"
    role="separator"
    aria-orientation="vertical"
    onPointerDown={dragStart}
    onDoubleClick={() => setSplit(0.5)}
    title={tr({ uz: "Sudrang — panellar kengligi o'zgaradi · 2 marta bosish — teng", ru: "Тяните — изменится ширина панелей · двойной клик — поровну" })}
  >
            <i />
          </div>}

        <section className="hc-pane hc-preview-pane">
          <div className="hc-pane-bar">
            {
    /* `task.previewUrl` berilsa — natija paneli SOXTA BRAUZER oynasiga aylanadi
       (manzil qatori bilan). PM darslarining o'zagi shu: bola o'zi yozgan
       sahifani «haqiqiy sayt» sifatida ko'radi (F-0809-05, PM shc-* dan). */
  }
            {task.previewUrl ? <>
                <span className="hc-dots"><i /><i /><i /></span>
                <span className="hc-url"><span className="hc-lock">●</span>{tr(task.previewUrl)}</span>
              </> : <span className="hc-pane-name">📺 {tr({ uz: "Natija", ru: "Результат" })}</span>}
            {
    /* Kod o'zgargan, lekin hali ishga tushirilmagan bo'lsa — ochiq aytiladi */
  }
            {stale ? <span className="hc-stale">{tr({ uz: "eskirdi · ▶ bosing", ru: "устарело · нажмите ▶" })}</span> : <span className="hc-live">{tr({ uz: "jonli", ru: "live" })}</span>}
          </div>
          <iframe
    className="hc-frame"
    title="natija"
    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
    srcDoc={doc}
  />
          {showConsole && <div className="hc-console">
              <div className="hc-console-bar">
                <span className="hc-console-title">🖥️ Console</span>
                {consoleLines.length > 0 && <button className="hc-console-clear" onClick={() => setConsoleLines([])}>{tr({ uz: "tozalash", ru: "очистить" })}</button>}
              </div>
              <div className="hc-console-body">
                {consoleLines.length === 0 ? <div className="hc-console-empty">{tr({ uz: "console.log(...) natijasi shu yerda chiqadi", ru: "результат console.log(...) появится здесь" })}</div> : consoleLines.map((l, i) => <div key={i} className={`hc-console-line lvl-${l.level}`}>
                      <span className="hc-console-caret">›</span>
                      <span className="hc-console-text">{l.text}</span>
                    </div>)}
              </div>
            </div>}
        </section>
      </main>

      {
    /* Yashirin tekshiruv iframe'i — probe'lar shu yerda ishlaydi (tugmani
       bosadi, DOMni o'zgartiradi), foydalanuvchi ko'radigan preview esa toza qoladi */
  }
      {hasRuntime && <iframe
    aria-hidden="true"
    tabIndex={-1}
    title="tekshiruv"
    sandbox="allow-scripts"
    srcDoc={checkDoc}
    style={{ position: "fixed", left: "-9999px", top: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none", border: "none" }}
  />}

      {
    /* ── Past: harakatlar ── */
  }
      <footer className="hc-bottom">
        {onBack && <button className="hc-ghost" onClick={onBack}>← {tr({ uz: "Orqaga", ru: "Назад" })}</button>}
        {
    /* Yorliq QISQA qoladi — pastki panel kengligi sakramasin; tushuntirish yonda */
  }
        <button
    className={`hc-ghost${resetArmed ? " armed" : ""}`}
    onClick={reset}
    onBlur={disarm}
    title={tr({ uz: "Kodni boshlang'ich holatga qaytaradi", ru: "Вернуть код к начальному виду" })}
  >
          {resetArmed ? `⚠ ${tr({ uz: "Rostdanmi?", ru: "Точно?" })}` : tr({ uz: "Qaytadan", ru: "Заново" })}
        </button>
        <div className="hc-status">{statusMsg}</div>
        <button
    className="hc-next"
    disabled={!allPassed}
    title={allPassed ? "" : blockedBySyntax ? tr({ uz: "Sintaksis xatosi tuzatilsa ochiladi", ru: "Откроется после исправления синтаксиса" }) : tr({ uz: "Barcha shartlar bajarilsa ochiladi", ru: "Откроется, когда все условия выполнены" })}
    onClick={() => allPassed && onContinue && onContinue({ codes, code: html })}
  >
          {tr({ uz: "Davom etish", ru: "Продолжить" })} →
        </button>
      </footer>
    </div>;
}
function StyleTag() {
  return <style>{`
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
    `}</style>;
}
var HtmlCompiler_default = HtmlCompiler;

// src/2-Modull/PmLesson4.jsx
var T = {
  bg: "#F2F0FA",
  ink: "#1B1630",
  ink2: "#565073",
  ink3: "#9C97B4",
  paper: "#FFFFFF",
  accent: "#5B3DE6",
  accentSoft: "#EBE5FD",
  accentVivid: "#6E4BFF",
  success: "#12A968",
  successSoft: "#E4F5EC",
  blue: "#0E86C4",
  blueSoft: "#E1F3FB",
  link: "#5B3DE6",
  line: "#E7E3F4",
  err: "#E5484D",
  errSoft: "#FCE7E8",
  // 🟠 Amber — PM slot-semantikasi (P0 bilan bir xil qiymatlar). Bu darsda amber = QIYINCHILIK,
  // yashil (success) = IMKONIYAT. Ikkovi s1·s2·s4·s8·s10·s11·yakunda AYNAN shu juftlikda qoladi.
  amber: "#E8A13A",
  amberInk: "#B77A16",
  amberSoft: "#FBEED6",
  shadowBase: "40, 34, 82"
};
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
var LIVE_SUPABASE_URL = "https://dwoubexcexzsinogojiu.supabase.co";
var LIVE_SUPABASE_KEY = "sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX";
var LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
var LIVE_POLL_MS = 2500;
var LIVE_POLL_MAX_MS = 15e3;
var LIVE_HEARTBEAT_MS = 1e4;
var LIVE_STALE_MS = 18e4;
var LT = { bg: "#F2F0FA", ink: "#1B1630", ink2: "#565073", ink3: "#9C97B4", paper: "#FFFFFF", accent: "#5B3DE6", accentSoft: "#EBE5FD", success: "#12A968" };
var _liveHdr = { apikey: LIVE_SUPABASE_KEY, Authorization: `Bearer ${LIVE_SUPABASE_KEY}` };
async function liveRpc(fn, body) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { ..._liveHdr, "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  if (!r.ok) {
    let msg = "";
    try {
      msg = JSON.parse(await r.text()).message || "";
    } catch {
    }
    throw new Error(msg || `${fn}: ${r.status}`);
  }
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
async function liveGet(pin) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=*`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  const rows = await r.json();
  return rows && rows[0] || null;
}
var _lsKey = (id) => `liveSession:${id}`;
var liveRead = (id) => {
  try {
    return JSON.parse(localStorage.getItem(_lsKey(id)) || "null");
  } catch {
    return null;
  }
};
var liveStore = (id, o) => {
  try {
    localStorage.setItem(_lsKey(id), JSON.stringify(o));
  } catch {
  }
};
var liveClear = (id) => {
  try {
    localStorage.removeItem(_lsKey(id));
  } catch {
  }
};
var fmtPin = (p) => p ? String(p).replace(/(\d{3})(\d{3})/, "$1 $2") : "";
var PROG_TTL_MS = 6 * 60 * 60 * 1e3;
var _progKey = (id) => `ccProgress:${id}`;
var progRead = (id, total) => {
  try {
    const p = JSON.parse(localStorage.getItem(_progKey(id)) || "null");
    if (!p || p.total !== total || Date.now() - (p.savedAt || 0) > PROG_TTL_MS) return null;
    return p;
  } catch {
    return null;
  }
};
var progWrite = (id, o) => {
  try {
    localStorage.setItem(_progKey(id), JSON.stringify(o));
  } catch {
  }
};
var progClear = (id) => {
  try {
    localStorage.removeItem(_progKey(id));
  } catch {
  }
};
var LIVE_NICK_KEY = "liveNickname";
var nickRead = () => {
  try {
    return localStorage.getItem(LIVE_NICK_KEY) || "";
  } catch {
    return "";
  }
};
var nickStore = (n) => {
  try {
    localStorage.setItem(LIVE_NICK_KEY, n);
  } catch {
  }
};
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
var livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
var liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? "&screen_idx=lt.100" : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
var LiveGateCtx = createContext(null);
function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef2(answerKey);
  keyRef.current = answerKey;
  const initRef = useRef2(void 0);
  if (initRef.current === void 0) initRef.current = LIVE_ENABLED ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState2(() => {
    if (!LIVE_ENABLED) return "self";
    if (init?.mode === "self") return "self";
    if (init?.mode === "student") return "student";
    if (init?.mode === "mentor") return "mentor";
    return "choosing";
  });
  const [pin, setPin] = useState2(init?.pin || null);
  const tokenRef = useRef2(init?.token || null);
  const playerRef = useRef2(init?.playerId ? { id: init.playerId, token: init.playerToken } : null);
  const nickRef = useRef2(init?.nickname || "");
  const [mentorScreen, setMentorScreen] = useState2(init?.lastScreen || 0);
  const [mentorMax, setMentorMax] = useState2(init?.maxScreen ?? init?.lastScreen ?? 0);
  const [status, setStatus] = useState2("live");
  const [mentorAlive, setMentorAlive] = useState2(true);
  const [connected, setConnected] = useState2(true);
  const [ended, setEnded] = useState2(false);
  const [joinError, setJoinError] = useState2("");
  const [busy, setBusy] = useState2(false);
  const [quiz, setQuiz] = useState2({ state: "off", q: -1 });
  const [revealScreen, setRevealScreen] = useState2(-1);
  const lastSeenRef = useRef2(Date.now());
  const lastUpdatedRef = useRef2(null);
  const mentorScreenOf = (row) => typeof row.cur_screen === "number" ? row.cur_screen : row.max_screen;
  const syncQuiz = useCallback((row) => {
    const qs = row?.quiz_state || "off", qq = row?.quiz_q ?? -1;
    setQuiz((p) => p.state === qs && p.q === qq ? p : { state: qs, q: qq });
    const rv = row?.reveal_screen ?? -1;
    setRevealScreen((p) => p === rv ? p : rv);
  }, []);
  useEffect2(() => {
    if (mode !== "student" || !pin) return;
    let on = true, timer = null, delay = LIVE_POLL_MS;
    const schedule = () => {
      if (on) timer = setTimeout(tick, delay);
    };
    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) {
        schedule();
        return;
      }
      try {
        const row = await liveGet(pin);
        if (!on) return;
        delay = LIVE_POLL_MS;
        setConnected(true);
        if (!row) {
          setStatus((p) => p === "ended" ? p : "ended");
          schedule();
          return;
        }
        const mScr = mentorScreenOf(row);
        const mMax = Math.max(row.max_screen ?? 0, mScr);
        setMentorScreen((p) => p === mScr ? p : mScr);
        setMentorMax((p) => mMax > p ? mMax : p);
        setStatus((p) => p === row.status ? p : row.status);
        syncQuiz(row);
        if (row.updated_at !== lastUpdatedRef.current) {
          lastUpdatedRef.current = row.updated_at;
          lastSeenRef.current = Date.now();
          liveStore(lessonId, { mode: "student", pin, lastScreen: mScr, maxScreen: mMax, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current });
        }
        const alive = Date.now() - lastSeenRef.current < LIVE_STALE_MS;
        setMentorAlive((p) => p === alive ? p : alive);
      } catch {
        if (!on) return;
        setConnected(false);
        delay = Math.min(delay * 2, LIVE_POLL_MAX_MS);
      }
      schedule();
    };
    tick();
    const onVis = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        delay = LIVE_POLL_MS;
        tick();
      }
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      on = false;
      clearTimeout(timer);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, pin, lessonId]);
  useEffect2(() => {
    if (mode !== "mentor" || !pin) return;
    let on = true;
    liveGet(pin).then((row) => {
      if (!on) return;
      if (!row || row.status === "ended") {
        liveClear(lessonId);
        setPin(null);
        tokenRef.current = null;
        setMode("choosing");
        setEnded(false);
        return;
      }
      syncQuiz(row);
    }).catch(() => {
    });
    const beat = () => {
      liveRpc("session_heartbeat", { p_pin: pin, p_token: tokenRef.current }).catch(() => {
      });
    };
    beat();
    const id = setInterval(beat, LIVE_HEARTBEAT_MS);
    const onVis = () => {
      if (typeof document !== "undefined" && !document.hidden) beat();
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      on = false;
      clearInterval(id);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, pin, lessonId]);
  const startMentor = useCallback(async (mentorCode) => {
    setBusy(true);
    setJoinError("");
    try {
      const res = await liveRpc("create_session", { p_lesson_id: lessonId, p_mentor_code: (mentorCode || "").trim() });
      const row = Array.isArray(res) ? res[0] : res;
      if (!row?.pin) throw new Error("no pin");
      tokenRef.current = row.token;
      setPin(row.pin);
      setMode("mentor");
      setEnded(false);
      liveStore(lessonId, { mode: "mentor", pin: row.pin, token: row.token });
      if (keyRef.current) liveRpc("set_quiz_keys", { p_lesson_id: lessonId, p_mentor_code: (mentorCode || "").trim(), p_keys: keyRef.current }).catch(() => {
      });
    } catch {
      setJoinError(tr2({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: "Неверный код наставника или ошибка подключения." }));
    } finally {
      setBusy(false);
    }
  }, [lessonId]);
  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || "").replace(/\D/g, "");
    const nick = (rawNick || "").trim();
    if (p.length < 4) {
      setJoinError(tr2({ uz: "Kodni to'liq kiriting.", ru: "Введите код полностью." }));
      return;
    }
    if (nick.length < 2) {
      setJoinError(tr2({ uz: "Ismingizni kiriting (kamida 2 harf).", ru: "Введите имя (минимум 2 буквы)." }));
      return;
    }
    setBusy(true);
    setJoinError("");
    try {
      const row = await liveGet(p);
      if (!row) {
        setJoinError(tr2({ uz: "Bunday kod topilmadi.", ru: "Такой код не найден." }));
        setBusy(false);
        return;
      }
      if (row.lesson_id && row.lesson_id !== lessonId) {
        setJoinError(tr2({ uz: "Bu kod boshqa darsga tegishli.", ru: "Этот код от другого урока." }));
        setBusy(false);
        return;
      }
      if (row.status !== "live") {
        setJoinError(tr2({ uz: "Bu dars allaqachon yakunlangan.", ru: "Этот урок уже завершён." }));
        setBusy(false);
        return;
      }
      const res = await liveRpc("join_session", { p_pin: p, p_nickname: nick });
      const player = Array.isArray(res) ? res[0] : res;
      if (!player?.player_id) throw new Error("no player");
      playerRef.current = { id: player.player_id, token: player.token };
      nickRef.current = nick;
      nickStore(nick);
      lastUpdatedRef.current = row.updated_at;
      lastSeenRef.current = Date.now();
      const jScr = mentorScreenOf(row), jMax = Math.max(row.max_screen ?? 0, jScr);
      setPin(p);
      setMentorScreen(jScr);
      setMentorMax(jMax);
      setStatus(row.status);
      setMode("student");
      liveStore(lessonId, { mode: "student", pin: p, lastScreen: jScr, maxScreen: jMax, playerId: player.player_id, playerToken: player.token, nickname: nick });
    } catch (e) {
      const m = String(e?.message || "");
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : tr2({ uz: "Ulanib bo'lmadi. Internetni tekshiring.", ru: "Не удалось подключиться. Проверьте интернет." }));
    } finally {
      setBusy(false);
    }
  }, [lessonId]);
  const selfStudy = useCallback(() => {
    setMode("self");
    liveStore(lessonId, { mode: "self" });
  }, [lessonId]);
  const reportScreen = useCallback((idx) => {
    if (mode === "mentor" && pin) liveRpc("advance_session", { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {
    });
  }, [mode, pin]);
  const endSession = useCallback(() => {
    if (mode === "mentor" && pin) {
      liveRpc("end_session", { p_pin: pin, p_token: tokenRef.current }).catch(() => {
      });
      setEnded(true);
    }
  }, [mode, pin]);
  const submitAnswer = useCallback((screenIdx, questionId, picked, correct, elapsedMs) => {
    if (mode !== "student" || !pin || !playerRef.current) return;
    const body = {
      p_pin: pin,
      p_player_id: playerRef.current.id,
      p_token: playerRef.current.token,
      p_screen: screenIdx,
      p_question_id: questionId || "",
      p_picked: picked,
      p_correct: !!correct,
      p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0))
    };
    const attempt = (n) => {
      liveRpc("submit_answer", body).catch(() => {
        if (n < 3) setTimeout(() => attempt(n + 1), 3e3 * (n + 1));
      });
    };
    attempt(0);
  }, [mode, pin]);
  const quizControl = useCallback(async (state, q) => {
    if (mode !== "mentor" || !pin) throw new Error("mentor emas");
    await liveRpc("quiz_control", { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);
  const mentorReveal = useCallback((screenIdx) => {
    if (mode !== "mentor" || !pin) return;
    setRevealScreen(screenIdx);
    liveRpc("reveal_screen", { p_pin: pin, p_token: tokenRef.current, p_screen: screenIdx }).catch(() => {
    });
  }, [mode, pin]);
  return { mode, pin, mentorScreen, mentorMax, status, mentorAlive, connected, ended, joinError, busy, startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, quiz, quizControl, revealScreen, mentorReveal, playerId: playerRef.current?.id || null, nickname: nickRef.current };
}
var _liveBtnPri = { background: LT.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer" };
var _liveBadgeS = { position: "fixed", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: "0 2px 10px rgba(58,53,48,0.12)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", maxWidth: "92vw" };
var _liveDot = (c) => ({ width: 8, height: 8, borderRadius: 99, background: c, display: "inline-block" });
function LiveBigCode({ pin, onClose }) {
  const digits = String(pin || "").split("");
  const overlay = { position: "fixed", inset: 0, zIndex: 1e4, background: LT.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,40px)", textAlign: "center" };
  const box = { background: LT.paper, color: LT.ink, borderRadius: "clamp(10px,1.6vw,18px)", fontFamily: "monospace", fontWeight: 800, lineHeight: 1, fontSize: "clamp(48px,13vw,150px)", padding: "clamp(10px,2vw,28px) clamp(12px,2.2vw,30px)", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" };
  return <div style={overlay}>
      <div style={{ fontSize: "clamp(13px,2vw,18px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: LT.accent, marginBottom: "clamp(14px,3vw,28px)" }}>{tr2({ uz: "Jonli darsga qo'shilish", ru: "Подключение к живому уроку" })}</div>
      <div style={{ display: "flex", gap: "clamp(6px,1.4vw,16px)", justifyContent: "center", flexWrap: "wrap" }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: "#fff", opacity: 0.85, fontSize: "clamp(15px,2.2vw,22px)", maxWidth: 640, margin: "clamp(20px,4vw,36px) 0 0", lineHeight: 1.5 }}>{tr2({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: "#fff" }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: "#fff" }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: "clamp(22px,4vw,40px)", background: LT.accent, color: "#fff", border: "none", borderRadius: 14, padding: "clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)", fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 700, cursor: "pointer" }}>{tr2({ uz: "Darsni boshlash →", ru: "Начать урок →" })}</button>
    </div>;
}
function LiveGate({ live, title }) {
  const gateTitle = title || { uz: "Jonli dars", ru: "Живой урок" };
  const [code, setCode] = useState2("");
  const [nick, setNick] = useState2(() => nickRead());
  const [mentorCode, setMentorCode] = useState2("");
  const [role, setRole] = useState2("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  if (role === "mentor") {
    return <div style={wrap}><div style={card}>
      <div style={{ textAlign: "center" }}><h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "0 0 4px" }}>{tr2({ uz: "🧑‍🏫 Mentor kirishi", ru: "🧑‍🏫 Вход для ментора" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor kodini kiriting.", ru: "Введите код ментора." })}</p></div>
      <input value={mentorCode} onChange={(e) => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr2({ uz: "Mentor kodi", ru: "Код ментора" })} onKeyDown={(e) => {
      if (e.key === "Enter") live.startMentor(mentorCode);
    }} style={{ width: "100%", padding: "14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: "center", outline: "none" }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr2({ uz: "Tekshirilmoqda…", ru: "Проверяем…" }) : tr2({ uz: "Kirish →", ru: "Войти →" })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
      <button onClick={() => {
      setRole("student");
      setMentorCode("");
    }} style={link}>{tr2({ uz: "← Orqaga", ru: "← Назад" })}</button>
    </div></div>;
  }
  return <div style={wrap}><div style={card}>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr2(gateTitle)}</div><h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Darsga qo'shilish", ru: "Подключиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от ментора и своё имя." })}</p></div>
    <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: "100%", padding: "16px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em", textAlign: "center", outline: "none" }} />
    <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={24} placeholder={tr2({ uz: "Ismingiz (masalan: Ali)", ru: "Ваше имя (например: Али)" })} onKeyDown={(e) => {
    if (e.key === "Enter") live.joinStudent(code, nick);
  }} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: "center", outline: "none" }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr2({ uz: "Ulanmoqda…", ru: "Подключаемся…" }) : tr2({ uz: "Qo'shilish →", ru: "Присоединиться →" })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
    <button onClick={() => {
    setRole("mentor");
    setCode("");
  }} title="Mentor" aria-label="Mentor" style={{ position: "absolute", bottom: 10, right: 12, background: "none", border: "none", fontSize: 16, opacity: 0.3, cursor: "pointer", lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>;
}
function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState2(false);
  const [nPlayers, setNPlayers] = useState2(null);
  useEffect2(() => {
    if (live.mode !== "mentor" || !live.pin || live.ended) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const rows = await livePlayers(live.pin);
        if (on) setNPlayers(rows.length);
      } catch {
      }
      if (on) t = setTimeout(tick, 6e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live.mode, live.pin, live.ended]);
  if (live.mode === "mentor") {
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr2({ uz: "🔓 O'quvchilar erkin qilindi", ru: "🔓 Ученики переведены в свободный режим" })}</div>;
    return <>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr2({ uz: "Kod:", ru: "Код:" })} <b style={{ fontFamily: "monospace", letterSpacing: "0.08em" }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr2({ uz: "Kodni katta ko'rsatish", ru: "Показать код крупно" })} style={{ marginLeft: 6, background: LT.ink, color: "#fff", border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr2({ uz: "📺 Ko'rsatish", ru: "📺 Показать" })}</button>
        <button onClick={() => {
      if (window.confirm(tr2({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: "Перевести учеников в свободный режим? Дальше они пойдут сами." }))) live.endSession();
    }} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr2({ uz: "🔓 Erkin qilish", ru: "🔓 Свободный режим" })}</button>
      </div>
    </>;
  }
  if (live.mode === "student") {
    if (live.status === "ended") return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr2({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: "🔓 Свободный режим — идите дальше сами" })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr2({ uz: "⚠️ Mentor uzildi — erkin rejim", ru: "⚠️ Ментор отключился — свободный режим" })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot("#FFD380")} /> {tr2({ uz: "🔄 Qayta ulanmoqda…", ru: "🔄 Переподключаемся…" })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr2({ uz: "👨‍🏫 Mentor:", ru: "👨‍🏫 Ментор:" })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}
var LangContext = createContext("uz");
var MentorCtx = createContext(null);
var useLang = () => useContext(LangContext);
var __lang2 = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[__lang2] ?? node.uz ?? node.ru ?? "";
};
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState2(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect2(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}
var AudioEngine = class {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.currentUtterance = null;
    this.onStateChange = null;
    this.waitingFor = null;
    this.voicesByLang = { ru: null, uz: null };
    this.voicesReady = false;
    this.currentLang = "uz";
    this.initVoices();
  }
  initVoices() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      this.voicesByLang.ru = v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesByLang.uz = v.find((x) => x.lang.startsWith("uz")) || v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesReady = true;
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== void 0) window.speechSynthesis.onvoiceschanged = load;
  }
  setLang(l) {
    this.currentLang = l;
  }
  getVoice() {
    return this.voicesByLang[this.currentLang] || this.voicesByLang.ru || null;
  }
  hasUz() {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    return window.speechSynthesis.getVoices().some((v) => v.lang.startsWith("uz"));
  }
  loadQueue(s) {
    this.stop();
    this.queue = s;
    this.currentIdx = 0;
    this.waitingFor = null;
  }
  playSegment(seg) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(seg.text);
    const useUz = this.currentLang === "uz" && this.hasUz();
    u.lang = useUz ? "uz-UZ" : "ru-RU";
    u.rate = 0.95;
    u.pitch = 1;
    const v = this.getVoice();
    if (v) u.voice = v;
    u.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: seg.id });
    };
    u.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleEnd(seg);
    };
    u.onerror = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
    };
    this.currentUtterance = u;
  }
  handleEnd(seg) {
    if (seg.waits_for) {
      this.waitingFor = seg.waits_for;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: seg.waits_for });
    } else {
      this.currentIdx++;
      this.playNext();
    }
  }
  playNext() {
    if (this.currentIdx >= this.queue.length) return;
    this.playSegment(this.queue[this.currentIdx]);
  }
  start() {
    this.currentIdx = 0;
    this.waitingFor = null;
    this.playNext();
  }
  triggerEvent(type, target) {
    if (!this.waitingFor) return;
    const m = this.waitingFor.type === type && (this.waitingFor.target === target || !this.waitingFor.target);
    if (m) {
      this.waitingFor = null;
      this.currentIdx++;
      this.playNext();
    }
  }
  pushOneOff(text) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: "manual", waits_for: null });
    this.currentIdx = this.queue.length - 1;
    this.playNext();
  }
  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }
  stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    this.isPlaying = false;
    this.currentUtterance = null;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
  }
};
var audioEngineInstance = null;
var getAudioEngine = () => {
  if (typeof window === "undefined") return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};
function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState2({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef2(null);
  const segmentsRef = useRef2(segments);
  const key = segments ? JSON.stringify(segments) : "";
  const prevKey = useRef2(key);
  if (prevKey.current !== key) {
    segmentsRef.current = segments;
    prevKey.current = key;
  }
  const stable = segmentsRef.current;
  useEffect2(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.onStateChange = (s) => setState((p) => ({ ...p, ...s }));
    if (stable && stable.length > 0 && !state.muted) {
      engine.loadQueue(stable);
      const t = setTimeout(() => engine.start(), 300);
      return () => {
        clearTimeout(t);
        engine.stop();
      };
    }
    return () => {
      if (engine) engine.stop();
    };
  }, [stable, lang]);
  const triggerEvent = useCallback((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const replay = useCallback(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback(() => {
    setState((p) => {
      const m = !p.muted;
      if (m && engineRef.current) engineRef.current.stop();
      return { ...p, muted: m };
    });
  }, []);
  return { ...state, triggerEvent, replay, toggleMute };
}
var sv = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
var Ico = {
  problem: (s = 22) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>,
  solution: (s = 22) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>,
  arrow: (s = 22) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={1.9}><path d="M4 12h14" /><path d="M13 6l6 6-6 6" /></svg>,
  check: (s = 18) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>
};
var LESSON_META = { lessonId: "pm-m2d2-v1", lessonTitle: { uz: "Muammodan yechimga", ru: "От проблемы к решению" } };
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s2", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s3", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s4", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s5", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "case", template: "custom", scored: false, scope: null },
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s8", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s10", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s11", type: "koding", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "final" },
  { id: "s13", type: "reflection", template: "custom", scored: false, scope: null },
  // F-0803-04 — YAKUN-TUZILMASI ETALONGA QAYTARILDI (PmLesson2 · P0 PmUserStory):
  // koding → G'OLIBLAR (podium) → FLASHCARD → YAKUN (CodeStrike + uyga vazifa BIR sahifada).
  // Ilgari uy-vazifa (s14) va arena (s16) alohida ekran edi va flashcard arenadan KEYIN qolgan —
  // ikkovi ham summary ichiga qaytarildi. `id` lar ATAYLAB o'zgartirilmadi: ular jonli-server
  // yozuvlariga (submitAnswer) kalit bo'ladi; raqam-uzilishi (s14/s16 yo'q) faqat kosmetik.
  { id: "s15", type: "stats", template: "custom", scored: false, scope: null },
  { id: "s17", type: "flashcard", template: "custom", scored: false, scope: null },
  { id: "s18", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var AchCtx = createContext(null);
var ACHIEVEMENTS = {
  pairFinder: { icon: "🔎", name: "Pair Finder!", desc: { uz: "Imkoniyatlarni qiyinchiliklarga bog'ladingiz", ru: "Вы связали возможности с трудностями" } },
  matchMaster: { icon: "🧲", name: "Match Master!", desc: { uz: "Uchala imkoniyatni o'z qiyinchiligiga qo'ydingiz", ru: "Вы поставили все три возможности к своей трудности" } },
  cardWriter: { icon: "📝", name: "Card Writer!", desc: { uz: "Uchta juftlik-kartangizni yozib bo'ldingiz", ru: "Вы дописали все три карточки-пары" } },
  pageMaker: { icon: "🧱", name: "Page Maker!", desc: { uz: "Juftliklarni ko'rsatadigan kodni yozdingiz", ru: "Вы написали код, который показывает пары" } }
};
var ACH_TRIGGERS = { s2: "pairFinder", s4: "matchMaster", s8: "cardWriter", s11: "pageMaker" };
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
function AchCounter() {
  const earned = useContext(AchCtx);
  const gate = useContext(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef2(count);
  const [bump, setBump] = useState2(false);
  const [open, setOpen] = useState2(false);
  useEffect2(() => {
    if (count > prevRef.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 800);
      prevRef.current = count;
      return () => clearTimeout(t);
    }
    prevRef.current = count;
  }, [count]);
  if (gate && gate.live && gate.live.mode === "mentor") return null;
  return <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? "bump" : ""} ${count > 0 ? "has" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Badges" title="Badges">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(earned && earned.has(id));
    return <div key={id} className={`ach-pop-row ${got ? "got" : ""}`}><span className="ach-pop-ic">{got ? a.icon : "🔒"}</span><span className="ach-pop-nm">{a.name}</span></div>;
  })}
        </div>}
    </div>;
}
var Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState2(false);
  const contentRef = useRef2(null);
  useEffect2(() => {
    setMCollapsed(false);
  }, [screen]);
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) {
      const el = contentRef.current;
      requestAnimationFrame(() => {
        if (el) el.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest(".mentor")) return;
    setMCollapsed(true);
  };
  const onContentScroll = () => {
    if (!collapseOn || mCollapsed) return;
    const el = contentRef.current;
    if (el && el.scrollTop > 6) setMCollapsed(true);
  };
  return <MentorCtx.Provider value={{ enabled: collapseOn, collapsed: mCollapsed, setCollapsed }}>
      <div className="stage">
        <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
          <div className="progress-track"><div className="progress-bar" style={{ width: `${(screen + 1) / totalScreens * 100}%` }} /></div>
          <div className="chrome">
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {
    /* AUDIOSIZ: ovoz tugmasi (AudioIndicator) ko'rsatilmaydi — ovoz allaqachon o'chirilgan */
  }
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, "0")} / {String(totalScreens).padStart(2, "0")}</div>
            </div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} onScroll={onContentScroll} className={`stage-content ${narrow ? "narrow" : ""}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>;
};
var NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Orqaga", ru: "Назад" })}</button>;
var TURN_HINT_MS = 2600;
function useTurnHint(active) {
  const [on, setOn] = useState2(false);
  useEffect2(() => {
    if (!active) {
      setOn(false);
      return;
    }
    setOn(false);
    const t = setTimeout(() => setOn(true), TURN_HINT_MS);
    return () => clearTimeout(t);
  }, [active]);
  return on;
}
var TURN_STEP_MS = 1300;
var TURN_PAUSE_MS = 3200;
function useTurnWalk(pending, enabled = true) {
  const key = pending.join("");
  const [lit, setLit] = useState2(null);
  useEffect2(() => {
    setLit(null);
    if (!enabled || pending.length === 0) return;
    let on = true, t = null, i = 0;
    if (pending.length === 1) {
      t = setTimeout(() => {
        if (on) setLit(pending[0]);
      }, TURN_HINT_MS);
      return () => {
        on = false;
        clearTimeout(t);
      };
    }
    const stepIn = () => {
      if (!on) return;
      setLit(pending[i]);
      t = setTimeout(() => {
        if (!on) return;
        setLit(null);
        i = (i + 1) % pending.length;
        t = setTimeout(stepIn, i === 0 ? TURN_PAUSE_MS : 140);
      }, TURN_STEP_MS);
    };
    t = setTimeout(stepIn, TURN_HINT_MS);
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [key, enabled]);
  return lit;
}
var turnCls = (lit, k, walking) => lit === k ? walking ? " turn-ring turn-step" : " turn-ring" : "";
var NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  const nextLabel = label || { uz: "Davom etish", ru: "Продолжить" };
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2(nextLabel)}</button>;
};
var FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState2(show);
  const [visible, setVisible] = useState2(false);
  const ref = useRef2(null);
  useEffect2(() => {
    if (show) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => {
          if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 350);
      }));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? "visible" : ""}`}><div className={neutral ? "frame-wait" : isCorrect ? "frame-success" : "frame-soft"}>{children}</div></div>;
};
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>;
var RECAPS = {
  3: {
    title: { uz: "Imkoniyat qayerdan boshlanadi", ru: "С чего начинается возможность" },
    cards: [
      { ic: "🎯", h: { uz: "Avval savol, keyin ish", ru: "Сначала вопрос, потом работа" }, body: { uz: "Har imkoniyat bitta savoldan boshlanadi: bu kimning qaysi qiyinchiligini yo'qotadi? Javob topilmasa, imkoniyat ro'yxatga kirmaydi.", ru: "Каждая возможность начинается с одного вопроса: чью и какую трудность она убирает? Если ответа нет — возможность в список не попадает." }, vis: { uz: <RcFlow items={["Imkoniyat", "qaysi qiyinchilik?", "ro'yxatga kiradi"]} />, ru: <RcFlow items={["Возможность", "какая трудность?", "попадает в список"]} /> }, ask: { uz: "Fon musiqasi kimning qaysi qiyinchiligini yo'qotadi?", ru: "Чью и какую трудность убирает фоновая музыка?" } }
    ]
  },
  5: {
    title: { uz: "Egasiz imkoniyat", ru: "Возможность без хозяина" },
    cards: [
      { ic: "❓", h: { uz: "Nega bir kartaga joy topilmadi", ru: "Почему одной карточке не нашлось места" }, body: { uz: "Sudrash mashqida uch qiyinchilikka uch javob topildi. To'rtinchi kartaga qiyinchilik topilmadi — shuning uchun u joysiz qoldi.", ru: "В упражнении с перетаскиванием у трёх трудностей нашлись три ответа. Для четвёртой карточки трудности не нашлось — поэтому она осталась без места." }, ask: { uz: "To'rtinchi kartani qanday o'zgartirsak, unga ham qiyinchilik topiladi?", ru: "Как изменить четвёртую карточку, чтобы и ей нашлась трудность?" } }
    ]
  },
  9: {
    title: { uz: "Juftlik qanday yoziladi", ru: "Как пишется пара" },
    cards: [
      { ic: "↔️", h: { uz: "Chap tomon va o'ng tomon", ru: "Левая сторона и правая" }, body: { uz: "Chapda — odamning qiyinchiligi, o'ngda — sayt nima qilishi. O'ng tomon harakat bilan yoziladi va chap tomonni to'g'ridan-to'g'ri yo'qotadi.", ru: "Слева — трудность человека, справа — что делает сайт. Правая сторона пишется действием и напрямую убирает левую." }, vis: { uz: <RcFlow items={["Qiyinchilik", "imkoniyat", "harakat bilan"]} />, ru: <RcFlow items={["Трудность", "возможность", "через действие"]} /> } }
    ]
  },
  12: {
    title: { uz: "Yangi so'rov kelganda", ru: "Когда приходит новая просьба" },
    cards: [
      { ic: "🙋", h: { uz: "So'rov hali imkoniyat emas", ru: "Просьба — ещё не возможность" }, body: { uz: "So'rov hali imkoniyat emas. Avval u qaysi qiyinchilikka javob berishi so'raladi, keyin ro'yxatga kiritiladi.", ru: "Просьба — ещё не возможность. Сначала спрашивают, на какую трудность она отвечает, и только потом вносят в список." }, ask: { uz: "Kinoteatr egasi yangi narsa so'rasa, birinchi savolingiz qanday bo'ladi?", ru: "Если владелец кинотеатра просит что-то новое — каким будет ваш первый вопрос?" } }
    ]
  }
};
function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState2(0);
  useEffect2(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setI((p) => Math.min(p + 1, rc.cards.length - 1));
      else if (e.key === "ArrowLeft") setI((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, rc]);
  if (!rc) return null;
  const card = rc.cards[i];
  const last = i === rc.cards.length - 1;
  return <div className="rc-overlay">
      <div className="rc-head">
        <span className="rc-tag">{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Объясняем заново" })}</span>
        <span className="rc-title">{tr2(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr2(card.h)}</h2>
        <p className="rc-body">{tr2(card.body)}</p>
        {card.vis && <div className="rc-vis">{tr2(card.vis)}</div>}
        {card.ask && <div className="rc-ask">{tr2({ uz: "🗣️ Sinfga savol:", ru: "🗣️ Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — идём дальше" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Следующая →" })}</button>}
      </div>
    </div>;
}
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState2({ players: null, rows: [] });
  useEffect2(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on) setData({ players, rows: answers });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live.pin, screenIdx]);
  if (data.players === null) return null;
  const total = data.players.length;
  const answered = data.rows.length;
  const ok = data.rows.filter((a) => a.picked === correctIdx).length;
  const bad = answered - ok;
  const allIn = total > 0 && answered >= total;
  const struggling = answered >= 2 && bad > ok;
  const answeredIds = new Set(data.rows.map((r) => r.player_id));
  const waiting = data.players.filter((p) => !answeredIds.has(p.id));
  const maxN = Math.max(1, ...options.map((_, i) => data.rows.filter((a) => a.picked === i).length));
  return <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">{tr2({ uz: "📊 Jonli natija", ru: "📊 Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Ответили все" }) : tr2({ uz: <>Javob berdi: <b>{answered}</b> / {total}</>, ru: <>Ответили: <b>{answered}</b> / {total}</> })}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>{tr2({ uz: "🔓 Natijani ochish", ru: "🔓 Открыть результат" })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(answered / total * 100) : 0}%` }} /></div>
      {reveal ? <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr2({ uz: "to'g'ri ✅", ru: "верно ✅" })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr2({ uz: "xato ❌", ru: "ошибка ❌" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ждём ⏳" })}</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr2({ uz: "javob berdi 📨", ru: "ответили 📨" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ждём ⏳" })}</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и сколько ✅/❌ — скрыто. Нажмёте «Открыть результат» — откроется сразу и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? tr2({ uz: `${n} o'quvchi · ${pct}%`, ru: `учеников: ${n} · ${pct}%` }) : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема осталась классу непонятной. Перед тем как идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish — ", ru: "📖 Объяснить заново — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ Верно <b>{pct}%</b> — класс тему освоил. Спокойно идите дальше!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr2({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:`, ru: `Ответивших мало (${answered}) — по проценту выводы делать сложно. Оцените сами:` })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish — ", ru: "📖 Объяснить заново — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить заново." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь вживую…" })}</p>}
    </div>;
}
var PRACTICE_BASE = 500;
var MentorPracticeStats = ({ live, screen, label }) => {
  const statLabel = label || { uz: "👀 Kim bajardi", ru: "👀 Кто выполнил" };
  const [data, setData] = useState2({ players: null, doneIds: /* @__PURE__ */ new Set() });
  useEffect2(() => {
    if (!live || live.mode !== "mentor" || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players2, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players: players2, doneIds: new Set(rows.map((r) => r.player_id)) });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== "mentor") return null;
  const players = data.players || [];
  const doers = players.filter((p) => data.doneIds.has(p.id));
  const waiting = players.filter((p) => !data.doneIds.has(p.id));
  return <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr2(statLabel)} — {doers.length}/{players.length}</div>
      {data.players === null ? <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: "italic" }}>{tr2({ uz: "Yuklanmoqda…", ru: "Загружаем…" })}</p> : players.length === 0 ? <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: "italic" }}>{tr2({ uz: "Hali hech kim qo'shilmagan.", ru: "Пока никто не подключился." })}</p> : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {doers.map((p) => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success, fontWeight: 700 }}>✓ {p.nickname}</span>)}
          {waiting.map((p) => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>✏️ {p.nickname}</span>)}
        </div>}
    </div>;
};
var StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState2(null);
  useEffect2(() => {
    if (!live || live.mode !== "student" || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ total: players.length, done: new Set(rows.map((r) => r.player_id)).size });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== "student" || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return <div className="done-mini fade-up" style={{ alignSelf: "flex-start" }}>
      {tr2({ uz: <>👥 Sinfda: <b>{data.done}</b> bajardi</>, ru: <>👥 В классе: выполнили <b>{data.done}</b></> })}{doing > 0 && <span className="dm-sub">{tr2({ uz: `· ✏️ ${doing} hali bajarmoqda`, ru: `· ✏️ ещё выполняют: ${doing}` })}</span>}
    </div>;
};
var uzOf = (x) => x && typeof x === "object" && !React.isValidElement(x) ? x.uz ?? "" : x;
var ouz = (arr) => Array.isArray(arr) ? arr.map(uzOf) : arr;
var QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: "on_mount", waits_for: { type: "option_picked" } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef2(Date.now());
  const [picked, setPicked] = useState2(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState2(storedAnswer ? storedAnswer.solved ?? storedAnswer.picked === correctIdx : false);
  const firstCorrectRef = useRef2(storedAnswer ? storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null : null);
  const [mReveal, setMReveal] = useState2(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState2(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => {
    setMReveal(true);
    if (live) live.mentorReveal(screen);
    if (storedAnswer === void 0) onAnswer(screen, { mentorRevealed: true });
  };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect2(() => {
    if (isMentorLive && liveRevealScreen === screen) setMReveal(true);
  }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: uzOf(questionText), options: ouz(options), correctIndex: correctIdx, correctAnswer: uzOf(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: uzOf(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: uzOf(questionText), options: ouz(options), correctIndex: correctIdx, correctAnswer: uzOf(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: uzOf(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (audioText) {
      audio.triggerEvent("option_picked");
      if (!audio.muted) setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) e.pushOneOff(isCorrect ? audioOk || "To'g'ri." : audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.");
      }, 300);
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval natijani oching", ru: "Сначала откройте результат" } : solved ? { uz: "Davom etish", ru: "Продолжить" } : oneShot ? { uz: "Javob tanlang", ru: "Выберите ответ" } : { uz: "To'g'ri javobni toping", ru: "Найдите верный ответ" }} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "safe center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{tr2(question)}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, жмите обдуманно!" })}</p>}
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {options.map((opt, i) => {
    let cls = "option";
    if (isMentorLive) {
      if (mReveal) {
        if (i === correctIdx) cls += " option-correct";
        else cls += " option-wrong";
      }
    } else if (solved) {
      if (waiting) {
        if (i === picked) cls += " option-wait";
      } else {
        if (i === correctIdx) cls += " option-correct";
        else cls += " option-wrong";
        if (wrongLocked && i === picked) cls += " option-picked-wrong";
      }
    } else if (i === picked) cls += " option-picked-wrong";
    const showGreenLetter = isMentorLive ? mReveal && i === correctIdx : solved && revealed && i === correctIdx;
    return <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: "clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)", fontSize: "clamp(15px,1.85vw,17px)", display: "flex", alignItems: "center", gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr2(opt))}</span>
              </button>;
  })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : solved && !wrongLocked} neutral={waiting}>
          <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: waiting ? T.blue : isMentorLive || solved && !wrongLocked ? T.success : T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isMentorLive ? tr2({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${uzOf(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx] && options[correctIdx].ru || uzOf(options[correctIdx])}` }) : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? tr2({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${uzOf(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx] && options[correctIdx].ru || uzOf(options[correctIdx])}` }) : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? tr2(explainCorrect) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете верный ответ." }) : wrongLocked ? tr2(explainWrong[picked] ?? explainWrong.default) : solved ? tr2(explainCorrect) : tr2(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
       Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */
  }
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Короткое повторение — посмотреть тему ещё раз" })}</button>}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>;
};
function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState2(C);
  useEffect2(() => {
    const t = setTimeout(() => setOff(C * (1 - PCT)), 200);
    return () => clearTimeout(t);
  }, [C, PCT]);
  return <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + "40"} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr2({ uz: "to'g'ri javob", ru: "верных ответов" })}</div></div>
    </div>;
}
var Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
  const enabled = !!ctx.enabled;
  const collapsed = enabled && ctx.collapsed;
  const expand = (e) => {
    e.stopPropagation();
    if (ctx.setCollapsed) ctx.setCollapsed(false);
  };
  return <div className={`mentor fade-up ${enabled ? "mentor-mob" : ""} ${collapsed ? "is-collapsed" : ""}`} onClick={collapsed ? expand : void 0} role={collapsed ? "button" : void 0}>
      <div className="mentor-ava" aria-hidden="true">
        <img src={MENTOR_IMG} alt="" />
      </div>
      <div className="mentor-col">
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue">{tr2({ uz: " · ko'rsatmani ochish ▾", ru: " · раскрыть указание ▾" })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var Q = ({ children, max = 760 }) => <h2 className="title h-ask fade-up" style={{ maxWidth: max }}>{children}</h2>;
var MentorCollapseScroll = ({ targetRef }) => {
  const ctx = useContext(MentorCtx) || {};
  const prev = useRef2(false);
  useEffect2(() => {
    if (ctx.enabled && ctx.collapsed && !prev.current && targetRef && targetRef.current) {
      const el = targetRef.current;
      setTimeout(() => {
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 420);
    }
    prev.current = !!ctx.collapsed;
  }, [ctx.collapsed, ctx.enabled, targetRef]);
  return null;
};
var MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState2(false);
  if (!live || live.mode !== "mentor") return null;
  if (!open) return <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr2({ uz: "Mentorga eslatma — bosib oching", ru: "Заметка ментору — нажмите, чтобы открыть" })}>{tr2({ uz: "📋 Eslatma", ru: "📋 Заметка" })}</button>;
  return <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr2({ uz: "Yopish uchun bosing", ru: "Нажмите, чтобы закрыть" })}>
      <span className="mnote-lbl">{tr2({ uz: "🧑‍🏫 Mentorga eslatma", ru: "🧑‍🏫 Заметка ментору" })}<span className="mnote-x">{tr2({ uz: "✕ yopish", ru: "✕ закрыть" })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>;
};
var HOOK_KEY = "pm-m2d2-hook-choice";
var PICKED_KEY = "pm-m2d2-picked";
var FEATURES_KEY = "pm-m2d2-features";
var REFLECT_KEY = "pm-m2d2-reflection";
var M1_CARDS_KEY = "pm-m1d2-cards";
var lsRead = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || "null");
  } catch {
    return null;
  }
};
var lsWrite = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
  }
};
var readFeatures = () => {
  const a = lsRead(FEATURES_KEY);
  return Array.isArray(a) ? a.filter((c) => c && c.qiyinchilik && c.imkoniyat) : [];
};
var FALLBACK_PAINS = [
  { uz: "Do'stlar qaysi film qachon boshlanishini bilmaydi", ru: "Друзья не знают, когда начинается фильм" },
  { uz: "Zalda bo'sh joy bormi — bilmasdan boradi", ru: "Идут, не зная, есть ли в зале свободные места" },
  { uz: "Chiptani qayerdan olishni bilmaydi", ru: "Не знает, где взять билет" }
];
var HOOK_LISTS = [
  {
    id: "A",
    name: { uz: "A-sayt", ru: "Сайт А" },
    items: [
      { ic: "🎵", t: { uz: "baland fon musiqasi", ru: "громкая фоновая музыка" } },
      { ic: "🔄", t: { uz: "aylanadigan katta logotip", ru: "большой вращающийся логотип" } },
      { ic: "✨", t: { uz: "miltillaydigan animatsiya", ru: "мигающая анимация" } },
      { ic: "📜", t: { uz: "5 sahifalik «biz haqimizda»", ru: "«о нас» на 5 страниц" } }
    ]
  },
  {
    id: "B",
    name: { uz: "B-sayt", ru: "Сайт Б" },
    items: [
      { ic: "🕒", t: { uz: "seans jadvali", ru: "расписание сеансов" } },
      { ic: "💺", t: { uz: "zal xaritasi", ru: "карта зала" } },
      { ic: "⭐", t: { uz: "bugungi mashhur filmlar", ru: "популярные фильмы сегодня" } },
      { ic: "🎟", t: { uz: "onlayn chipta", ru: "билет онлайн" } }
    ]
  }
];
var HOOK_PAYOFF = [
  { feat: { uz: "Seans jadvali", ru: "Расписание сеансов" }, q: { uz: "«Film qachon boshlanadi?»", ru: "«Когда начинается фильм?»" } },
  { feat: { uz: "Zal xaritasi", ru: "Карта зала" }, q: { uz: "«Bo'sh joy bormi?»", ru: "«Есть ли свободные места?»" } },
  { feat: { uz: "Mashhur filmlar", ru: "Популярные фильмы" }, q: { uz: "«Qaysi filmni tanlasam?»", ru: "«Какой фильм выбрать?»" } },
  { feat: { uz: "Onlayn chipta", ru: "Билет онлайн" }, q: { uz: "«Chiptani qayerdan olaman?»", ru: "«Где взять билет?»" } }
];
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [pick, setPick] = useState2(() => storedAnswer && storedAnswer.pick || null);
  const choose = (id) => {
    if (pick) return;
    setPick(id);
    lsWrite(HOOK_KEY, id);
    onAnswer(screen, { stage: "hook", screenIdx: screen, pick: id, picked: true });
  };
  const waveOn = useTurnHint(!pick);
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Начало" })} screen={screen} navContent={<><span /><NavNext disabled={!pick} label={pick ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Bitta ro'yxatni tanlang", ru: "Выберите один список" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qaysi sayt <span className="italic" style={{ color: T.accent }}>ko'proq chipta</span> sotadi?</>, ru: <>Какой сайт продаст <span className="italic" style={{ color: T.accent }}>больше билетов</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Tasavvur qiling: bitta kinoteatr uchun ikkita turli sayt tayyorlandi. Quyida har birida nima borligi yozilgan — o'qing va sizningcha ko'proq chipta sotadiganini tanlang.</>, ru: <>Представьте: для одного кинотеатра сделали два разных сайта. Ниже написано, что есть на каждом — прочитайте и выберите тот, который, по-вашему, продаст больше билетов.</> })}</Mentor>
        <div className="hk-row fade-up delay-1">
          {HOOK_LISTS.map((l, i) => <button key={l.id} className={`hk-card ${pick === l.id ? "picked" : ""} ${pick && pick !== l.id ? "dim" : ""}${!pick && waveOn ? " turn-ring" : ""}`} disabled={!!pick} onClick={() => choose(l.id)}>
              <span className="hk-name">{tr2(l.name)}</span>
              <span className="hk-items">
                {l.items.map((it, k) => <span key={k} className="hk-it"><i>{it.ic}</i>{tr2(it.t)}</span>)}
              </span>
              <span className="hk-vote">{pick === l.id ? tr2({ uz: "✓ Sizning ovozingiz", ru: "✓ Ваш голос" }) : tr2({ uz: "Shuni tanlayman", ru: "Выбираю этот" })}</span>
            </button>)}
        </div>
        {pick && <div className="frame-soft fade-step">
            <p className="body" style={{ margin: "0 0 9px" }}>{tr2({ uz: <>B-saytdagi <b style={{ color: T.ink }}>har bir band</b> odamning bitta savoliga javob beradi:</>, ru: <>Каждый пункт сайта Б отвечает на <b style={{ color: T.ink }}>один вопрос</b> человека:</> })}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {HOOK_PAYOFF.map((p, i) => <p key={i} className="body" style={{ margin: 0, color: T.ink2 }}><b style={{ color: T.ink }}>{tr2(p.feat)}</b> → {tr2(p.q)}</p>)}
            </div>
            <p className="body" style={{ margin: "9px 0 0" }}>{tr2({ uz: <>A-saytdagilar esa hech qanday savolga javob bermaydi.</>, ru: <>А пункты сайта А не отвечают ни на один вопрос.</> })}</p>
          </div>}
        <MentorNote>{tr2({ uz: "Ovozlar bo'linib ketsa muhokamani cho'zmang — payoff-qator o'zi ochadi. «A» degan o'quvchiga qarshi chiqmang: uning tanlovi keys ekranida qaytariladi.", ru: "Если голоса разделились, не затягивайте обсуждение — строка-ответ откроется сама. Не спорьте с теми, кто выбрал «А»: их выбор вернётся на экране с кейсом." })}</MentorNote>
      </div>
    </Stage>;
};
var DEMO_PAIRS = [
  { pain: { uz: "Film qachon boshlanishini bilmaydi", ru: "Не знает, когда начинается фильм" }, feat: { uz: "Seans jadvali sahifaning tepasida turadi", ru: "Расписание сеансов стоит наверху страницы" } },
  { pain: { uz: "Zalda bo'sh joy bormi — bilmaydi", ru: "Не знает, есть ли в зале свободные места" }, feat: { uz: "Zal xaritasi bo'sh joylarni ko'rsatadi", ru: "Карта зала показывает свободные места" } },
  { pain: { uz: "Film qiziq bo'ladimi — bilmaydi", ru: "Не знает, будет ли фильм интересным" }, feat: { uz: "Treyler saytning o'zida ochiladi", ru: "Трейлер открывается прямо на сайте" } }
];
var Screen1 = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Boshlaymiz →", ru: "Начинаем →" }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
      <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Dars oxirida saytning har bandi <span className="italic" style={{ color: T.accent }}>kimga kerakligini</span> yozib olasiz</>, ru: <>К концу урока вы запишете, <span className="italic" style={{ color: T.accent }}>кому нужен</span> каждый пункт сайта</> })}</h2></div>
      <Mentor>{tr2({ uz: <>Sayt beradigan har bir aniq foyda — <b style={{ color: T.ink }}>imkoniyat</b> (feature) deyiladi. Bugun har imkoniyatni o'z qiyinchiligiga qo'shib yozasiz — quyida namunasi o'z-o'zidan yozilib chiqadi.</>, ru: <>Каждая конкретная польза, которую даёт сайт, называется <b style={{ color: T.ink }}>возможность</b> (feature). Сегодня вы запишете каждую возможность вместе с её трудностью — образец ниже напишется сам.</> })}</Mentor>
      <div className="jl fade-up delay-1">
        {DEMO_PAIRS.map((p, i) => <div key={i} className="jl-row" style={{ "--rd": `${0.25 + i * 0.55}s` }}>
            <span className="jl-n">{i + 1}</span>
            <span className="jl-pain" style={{ "--fd": `${0.45 + i * 0.55}s` }}>{tr2(p.pain)}</span>
            <span className="jl-link" style={{ "--fd": `${0.75 + i * 0.55}s` }} aria-hidden="true">↔</span>
            <span className="jl-feat" style={{ "--fd": `${0.9 + i * 0.55}s` }}>{tr2(p.feat)}</span>
          </div>)}
      </div>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">{tr2({ uz: "Dars oxirida sizning uch juftligingiz ham shunday yozilgan bo'ladi.", ru: "К концу урока ваши три пары будут записаны точно так же." })}</p></div>
    </div>
  </Stage>;
var OPEN_CARDS = [
  { id: "jadval", ic: "🕒", t: { uz: "Seans jadvali", ru: "Расписание сеансов" }, pain: { uz: "Do'stlar qaysi film qachon boshlanishini bilmaydi", ru: "Друзья не знают, когда начинается фильм" }, empty: false },
  { id: "joylar", ic: "💺", t: { uz: "Zal xaritasi", ru: "Карта зала" }, pain: { uz: "Zalda bo'sh joy bormi — bilmasdan boradi", ru: "Идут, не зная, есть ли в зале свободные места" }, empty: false },
  { id: "chipta", ic: "🎟", t: { uz: "Onlayn chipta", ru: "Билет онлайн" }, pain: { uz: "Chiptani qayerdan olishni bilmaydi", ru: "Не знает, где взять билет" }, empty: false },
  { id: "musiqa", ic: "🎵", t: { uz: "Fon musiqasi", ru: "Фоновая музыка" }, pain: { uz: "Hech kimning qiyinchiligini yo'qotmaydi", ru: "Не убирает ничью трудность" }, empty: true }
];
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [open, setOpen] = useState2({});
  const [seen, setSeen] = useState2(() => storedAnswer && storedAnswer.seen || []);
  const allSeen = seen.length >= OPEN_CARDS.length;
  const toggle = (id) => {
    setOpen((p) => ({ ...p, [id]: !p[id] }));
    setSeen((p) => p.includes(id) ? p : [...p, id]);
  };
  useEffect2(() => {
    if (allSeen && storedAnswer === void 0) onAnswer(screen, { stage: "exploration", screenIdx: screen, seen, correct: true, picked: true });
  }, [allSeen]);
  const pending = OPEN_CARDS.filter((c) => !seen.includes(c.id)).map((c) => c.id);
  const lit = useTurnWalk(pending, !allSeen);
  return <Stage eyebrow={tr2({ uz: "Qaysi qiyinchilikka", ru: "К какой трудности" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen} label={allSeen ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `Kartalarni oching (${seen.length}/4)`, ru: `Откройте карточки (${seen.length}/4)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bu imkoniyat kimning <span className="italic" style={{ color: T.accent }}>qaysi qiyinchiligini</span> yo'qotadi?</>, ru: <>Чью и <span className="italic" style={{ color: T.accent }}>какую трудность</span> убирает эта возможность?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Kinoteatr saytiga to'rtta imkoniyat taklif qilindi. Har birini bosing — ostida u qaysi qiyinchilikni yo'qotishi ochiladi.</>, ru: <>Сайту кинотеатра предложили четыре возможности. Нажмите на каждую — под ней откроется, какую трудность она убирает.</> })}</Mentor>
        <div className="oc-grid fade-up delay-1">
          {OPEN_CARDS.map((c) => <div key={c.id} className={`oc ${open[c.id] ? "on" : ""} ${seen.includes(c.id) ? "seen" : ""}`}>
              <button className={`oc-top${turnCls(lit, c.id, pending.length > 1)}`} onClick={() => toggle(c.id)} aria-expanded={!!open[c.id]}>
                <span className="oc-ic">{c.ic}</span>
                <span className="oc-t">{tr2(c.t)}</span>
                <span className="oc-arw">{open[c.id] ? "▾" : "▸"}</span>
              </button>
              {open[c.id] && <p className={`oc-pain ${c.empty ? "empty" : ""} fade-step`}>{c.empty ? "— " : "↳ "}{tr2(c.pain)}</p>}
            </div>)}
        </div>
        {allSeen && <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0 }}>{tr2({ uz: <>Har imkoniyat bitta qiyinchilikning javobi bo'ladi. Javobi yo'q imkoniyat — ro'yxatdan chiqadi.</>, ru: <>Каждая возможность — это ответ на одну трудность. Возможность без ответа выпадает из списка.</> })}</p>
          </div>}
      </div>
    </Stage>;
};
var Screen3 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Задание · вопрос 1" })}
  question={<Q>{tr2({ uz: <>🎵 Saytga fon musiqasi qo'shmoqchisiz. Avval <span className="italic" style={{ color: T.accent }}>qaysi savolga</span> javob berish kerak?</>, ru: <>🎵 Вы хотите добавить на сайт фоновую музыку. На <span className="italic" style={{ color: T.accent }}>какой вопрос</span> нужно ответить сначала?</> })}</Q>}
  questionText={{ uz: "Fon musiqasi qo'shishdan oldin qaysi savolga javob berish kerak?", ru: "На какой вопрос нужно ответить, прежде чем добавить фоновую музыку?" }}
  options={[
    { uz: "Uni yasash necha kun oladi?", ru: "Сколько дней займёт её сделать?" },
    { uz: "Sahifaning qaysi joyida turadi?", ru: "В каком месте страницы она будет стоять?" },
    { uz: "Bu kimning qaysi qiyinchiligini yo'qotadi?", ru: "Чью и какую трудность это убирает?" },
    { uz: "Boshqa saytlarda bunday imkoniyat bormi?", ru: "Есть ли такая возможность на других сайтах?" }
  ]}
  correctIdx={2}
  explainCorrect={{ uz: "To'g'ri! Har imkoniyat bitta qiyinchilikning javobi bo'ladi. Javobi topilmasa, imkoniyat ro'yxatdan chiqadi.", ru: "Верно! Каждая возможность — ответ на одну трудность. Если ответа нет, возможность выпадает из списка." }}
  explainWrong={{
    0: { uz: "Vaqtni hisoblash — kerakli ish, lekin u KEYIN keladi. Avval bu imkoniyat umuman kerakmi degan savolga javob topiladi.", ru: "Считать сроки нужно, но это идёт ПОТОМ. Сначала находят ответ на вопрос, нужна ли эта возможность вообще." },
    1: { uz: "Joylashuvni o'ylash to'g'ri — lekin kerak bo'lmagan narsaning joyi ham kerak bo'lmaydi.", ru: "Думать о расположении правильно — но у ненужной вещи и место окажется ненужным." },
    3: { uz: "Boshqalarga qarash foydali — lekin ularning qiyinchiligi sizning mijozingiznikidan boshqa bo'lishi mumkin.", ru: "Смотреть на других полезно — но их трудности могут отличаться от трудностей вашего клиента." },
    default: { uz: "Yana bir bor o'ylab ko'ring: imkoniyat qaysi savoldan boshlanadi?", ru: "Подумайте ещё раз: с какого вопроса начинается возможность?" }
  }}
/>;
var MATCH_ROWS = [
  { id: "r1", need: "jadval", t: { uz: "Film qachon boshlanishi bilinmaydi", ru: "Не понять, когда начинается фильм" } },
  { id: "r2", need: "joylar", t: { uz: "Zalda bo'sh joy bormi — bilinmaydi", ru: "Не понять, есть ли в зале свободные места" } },
  { id: "r3", need: "chipta", t: { uz: "Chiptani qayerdan olish noma'lum", ru: "Неизвестно, где взять билет" } }
];
var MATCH_CARDS = [
  { id: "jadval", ic: "🕒", t: { uz: "Seans jadvali", ru: "Расписание сеансов" }, d: { uz: "Qaysi film qaysi soatda", ru: "Какой фильм в какое время" } },
  { id: "joylar", ic: "💺", t: { uz: "Zal xaritasi", ru: "Карта зала" }, d: { uz: "Zal sxemasi: band va bo'sh o'rindiqlar", ru: "Схема зала: занятые и свободные места" } },
  { id: "chipta", ic: "🎟", t: { uz: "Onlayn chipta", ru: "Билет онлайн" }, d: { uz: "To'lov saytning o'zida", ru: "Оплата прямо на сайте" } },
  { id: "logo", ic: "🔄", t: { uz: "Aylanadigan logotip", ru: "Вращающийся логотип" }, d: { uz: "Sahifa tepasida aylanib turadi", ru: "Крутится наверху страницы" } }
];
var Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [place, setPlace] = useState2(() => storedAnswer && storedAnswer.place || {});
  const [held, setHeld] = useState2(null);
  const [shake, setShake] = useState2(null);
  const used = new Set(Object.values(place));
  const pool = MATCH_CARDS.filter((c) => !used.has(c.id));
  const doneAll = MATCH_ROWS.every((r) => place[r.id] === r.need);
  useEffect2(() => {
    if (doneAll && storedAnswer === void 0) onAnswer(screen, { stage: "exploration", screenIdx: screen, place, correct: true, picked: true });
  }, [doneAll]);
  const drop = (rowId) => {
    if (!held) return;
    const row = MATCH_ROWS.find((r) => r.id === rowId);
    if (row.need !== held || place[rowId]) {
      setShake(rowId);
      setTimeout(() => setShake(null), 460);
      return;
    }
    setPlace((p) => ({ ...p, [rowId]: held }));
    setHeld(null);
  };
  const takeBack = (id) => {
    setPlace((p) => {
      const n = { ...p };
      Object.keys(n).forEach((k) => {
        if (n[k] === id) delete n[k];
      });
      return n;
    });
    setHeld(null);
  };
  const litCard = useTurnWalk(pool.map((c) => c.id), !held && !doneAll && pool.length > 0);
  return <Stage eyebrow={tr2({ uz: "Juftlash", ru: "Соединяем" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!doneAll} label={doneAll ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `Kartalarni qo'ying (${Object.keys(place).length}/3)`, ru: `Расставьте карточки (${Object.keys(place).length}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har imkoniyatni <span className="italic" style={{ color: T.accent }}>o'z qiyinchiligiga</span> qo'ying.</>, ru: <>Поставьте каждую возможность <span className="italic" style={{ color: T.accent }}>к своей трудности</span>.</> })}</h2></div>
        <div className={`mt-wrap fade-up delay-1${held ? " holding" : ""}`}>
          <div className="mt-rows">
            {MATCH_ROWS.map((r) => {
    const got = place[r.id];
    const card = got && MATCH_CARDS.find((c) => c.id === got);
    return <div key={r.id} className={`mt-row ${got ? "filled" : ""} ${shake === r.id ? "shake" : ""}`} onClick={() => drop(r.id)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
      e.preventDefault();
      drop(r.id);
    }}>
                  <span className="mt-pain">{tr2(r.t)}</span>
                  <span className="mt-slot">
                    {card ? <span className="mt-chip in" onClick={(e) => {
      e.stopPropagation();
      takeBack(card.id);
    }}><i>{card.ic}</i>{tr2(card.t)}</span> : <span className="mt-empty">{tr2({ uz: "bu yerga qo'ying", ru: "поставьте сюда" })}</span>}
                  </span>
                </div>;
  })}
          </div>
          <div className="mt-pool">
            <span className="mt-pool-lbl">{tr2({ uz: "Imkoniyat kartalari", ru: "Карточки возможностей" })}</span>
            {pool.map((c) => <button key={c.id} draggable onDragStart={() => setHeld(c.id)} className={`mt-card ${held === c.id ? "held" : ""}${turnCls(litCard, c.id, pool.length > 1)}`} onClick={() => setHeld(held === c.id ? null : c.id)}>
                <span className="mt-card-ic">{c.ic}</span>
                <span className="mt-card-tx"><span className="mt-card-t">{tr2(c.t)}</span><span className="mt-card-d">{tr2(c.d)}</span></span>
              </button>)}
          </div>
        </div>
        {doneAll && <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0 }}>{tr2({ uz: <>«Aylanadigan logotip»ga joy topilmadi — u hech qanday qiyinchilikka javob bermaydi.</>, ru: <>Для «вращающегося логотипа» места не нашлось — он не отвечает ни на одну трудность.</> })}</p>
          </div>}
        {
    /* Juftlik-muhokamasi MENTOR eslatmasiga ko'chirildi (F-0802-13): o'quvchi ekranida
       blok qo'shmaydi, jonli darsdagi og'zaki mashq esa saqlanadi. */
  }
        <MentorNote>{tr2({ uz: "Hammasi joylashgach so'rang: to'rtinchi kartani qanday o'zgartirsak, u ham biror qiyinchilikka javob bo'ladi? Juftlikda bir gapda aytishsin.", ru: "Когда всё расставлено, спросите: как изменить четвёртую карточку, чтобы и она отвечала на трудность? Пусть скажут в парах одним предложением." })}</MentorNote>
      </div>
    </Stage>;
};
var Screen5 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Задание · вопрос 2" })}
  question={<Q>{tr2({ uz: <>🔄 «Aylanadigan logotip» kartasiga <span className="italic" style={{ color: T.accent }}>joy topilmadi</span>. Nima uchun?</>, ru: <>🔄 Для карточки «вращающийся логотип» <span className="italic" style={{ color: T.accent }}>места не нашлось</span>. Почему?</> })}</Q>}
  questionText={{ uz: "«Aylanadigan logotip» kartasiga nima uchun joy topilmadi?", ru: "Почему для карточки «вращающийся логотип» не нашлось места?" }}
  options={[
    { uz: "Uni yasash qiyin", ru: "Её сложно сделать" },
    { uz: "U hech qanday qiyinchilikni yo'qotmaydi", ru: "Она не убирает никакую трудность" },
    { uz: "Bunday logotip boshqa saytlarda ham bor", ru: "Такой логотип есть и на других сайтах" },
    { uz: "Uni telefonda ko'rish noqulay", ru: "Её неудобно смотреть на телефоне" }
  ]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! Uch qiyinchilikning har biriga o'z javobi bor edi, bu kartaga esa qiyinchilik topilmadi.", ru: "Верно! У каждой из трёх трудностей был свой ответ, а для этой карточки трудности не нашлось." }}
  explainWrong={{
    0: { uz: "Qiyinlik haqiqatan hisobga olinadi — lekin bu karta qiyinligi uchun emas, egasi topilmagani uchun qoldi.", ru: "Сложность действительно учитывают — но эта карточка осталась не из-за сложности, а потому что не нашлось хозяина." },
    2: { uz: "Takrorlanish o'ziga qarab e'tirozga sabab emas: takrorlangan imkoniyat ham qiyinchilikni yo'qotsa, qoladi.", ru: "Повторение само по себе не повод для возражения: повторяющаяся возможность остаётся, если убирает трудность." },
    3: { uz: "Telefonda qanday ko'rinishi muhim savol — lekin karta telefon uchun emas, egasizligi uchun joysiz qoldi.", ru: "Как это выглядит на телефоне — важный вопрос, но карточка осталась без места не из-за телефона, а из-за отсутствия хозяина." },
    default: { uz: "Eslang: karta nima uchun hech qaysi qatorga tushmadi?", ru: "Вспомните: почему карточка не подошла ни к одной строке?" }
  }}
/>;
var K_SLIDES = [
  {
    ic: "📱",
    h: { uz: "Uzumgacha xarid qanday bo'lgan", ru: "Как покупали до Uzum" },
    body: { uz: <>Uzumgacha odamlar Telegram va Instagram guruhlaridan xarid qilardi. Sotuvchi rasm qo'yardi, xaridor yozardi — keyin narsani qanday olib ketish <b>o'zining ishi</b> edi.</>, ru: <>До Uzum люди покупали в группах Telegram и Instagram. Продавец выкладывал фото, покупатель писал — а как забрать вещь, было <b>его собственной задачей</b>.</> }
  },
  {
    ic: "🏗",
    h: { uz: "U birinchi navbatda nimani qurdi", ru: "Что он построил в первую очередь" },
    body: { uz: <>Uzum faqat sayt qurmadi. U <b>o'z mashinalarini, topshirish punktlarini va ertasi kuni yetkazib berish xizmatini</b> qurdi. Chunki odamlarning eng katta qiyinchiligi tanlash emas — olgan narsasi qo'liga qanday yetib kelishi edi.</>, ru: <>Uzum построил не только сайт. Он построил <b>свои машины, пункты выдачи и доставку на следующий день</b>. Потому что самой большой трудностью людей был не выбор, а то, как купленное доберётся до их рук.</> },
    predict: {
      ask: { uz: "Uzum 2022-yil oktyabrda ochildi. Sizningcha, u birinchi navbatda nimani qurdi?", ru: "Uzum открылся в октябре 2022 года. Как думаете, что он построил в первую очередь?" },
      chips: [
        { ic: "🖥", t: { uz: "Faqat sayt", ru: "Только сайт" } },
        { ic: "💳", t: { uz: "Sayt va to'lov tizimi", ru: "Сайт и систему оплаты" } },
        { ic: "🚚", t: { uz: "Sayt, to'lov va o'z yetkazib berish xizmati", ru: "Сайт, оплату и свою доставку" } }
      ],
      ans: 2,
      miss: { uz: "Adashdingiz — asl javob uchinchisi: Uzum o'z yetkazib berish xizmatini ham qurdi.", ru: "Не угадали — верный ответ третий: Uzum построил и свою службу доставки." }
    }
  },
  {
    ic: "📈",
    h: { uz: "Bugun undan qancha odam foydalanadi", ru: "Сколько людей пользуется им сегодня" },
    body: { uz: <>2025-yilda oyiga <b>~17 million odam</b> foydalanadi. 2024-yil martda Uzum mamlakatning birinchi «unicorn»i bo'ldi — bu 1 milliard dollardan yuqori baholangan kompaniya degani (2024-yilda 1,16 mlrd, 2025-yilda 1,5 mlrd).</>, ru: <>В 2025 году им пользуются <b>~17 миллионов человек в месяц</b>. В марте 2024 года Uzum стал первым «единорогом» страны — так называют компанию, оценённую дороже 1 миллиарда долларов (1,16 млрд в 2024-м, 1,5 млрд в 2025-м).</> },
    predict: {
      ask: { uz: "Bugun Uzumdan oyiga qancha odam foydalanadi?", ru: "Сколько человек в месяц пользуется Uzum сегодня?" },
      chips: [
        { ic: "1️⃣", t: { uz: "~1 million", ru: "~1 миллион" } },
        { ic: "5️⃣", t: { uz: "~5 million", ru: "~5 миллионов" } },
        { ic: "🔟", t: { uz: "~17 million", ru: "~17 миллионов" } }
      ],
      ans: 2,
      miss: { uz: "Asl javob — oyiga ~17 million odam (2025-yil).", ru: "Верный ответ — ~17 миллионов человек в месяц (2025 год)." }
    }
  }
];
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === "mentor");
  const [i, setI] = useState2(0);
  const [bets, setBets] = useState2({});
  const last = i === K_SLIDES.length - 1;
  const c = K_SLIDES[i];
  const bet = c.predict ? bets[i] : void 0;
  const betPending = !!(c.predict && bet === void 0);
  const betHint = useTurnHint(betPending && !isMentorK);
  useEffect2(() => {
    if (last && !betPending && storedAnswer === void 0) onAnswer(screen, { stage: "case", screenIdx: screen, correct: true, picked: true });
  }, [last, betPending]);
  return <Stage eyebrow={tr2({ uz: "Keys 🛒", ru: "Кейс 🛒" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={betPending && !isMentorK} label={betPending && !isMentorK ? { uz: "Avval taxminingizni belgilang", ru: "Сначала отметьте свою догадку" } : last ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `Keyingi bosqich (${i + 1}/${K_SLIDES.length})`, ru: `Следующий шаг (${i + 1}/${K_SLIDES.length})` }} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zbekistonda <span className="italic" style={{ color: T.accent }}>internet-magazin</span> qanday boshlangan?</>, ru: <>Как в Узбекистане начинался <span className="italic" style={{ color: T.accent }}>интернет-магазин</span>?</> })}</h2></div>
        {
    /* F-0812-04 — MENTOR REJIMIDA JAVOB OLDINDAN OCHILMAYDI (44-qonun oilasi).
       Ilgari mentorda bashorat-bloki va slayd (javob matni bilan) BIR VAQTDA chiqardi,
       chiplar esa `disabled` edi — ya'ni proyektorda savol bilan javob yonma-yon turardi
       va bashorat butun sinf uchun ma'nosini yo'qotardi. Endi mentor ham o'quvchidek
       BOSIB ochadi. Mentor-bypass (31-qonun) saqlanadi: NavNext mentorda qulflanmaydi. */
  }
        {c.predict && bet === void 0 ? <div className="kp-bet fade-step" key={`b${i}`}>
            <span className="k-slide-eyebrow">{tr2({ uz: "🎲 Avval o'zingiz belgilab ko'ring", ru: "🎲 Сначала отметьте сами" })}</span>
            <h3 className="k-slide-h">{tr2(c.predict.ask)}</h3>
            <div className="kp-chips">
              {c.predict.chips.map((ch, k) => <button key={k} className={`kp-chip${!isMentorK && betHint ? " turn-ring" : ""}`} onClick={() => setBets((p) => ({ ...p, [i]: k }))}>
                  <span className="kp-ic">{ch.ic}</span>{tr2(ch.t)}
                </button>)}
            </div>
          </div> : null}
        {(!c.predict || bet !== void 0) && <div className={`k-slide fade-step ${c.predict ? "revealed" : ""}`} key={`s${i}`}>
            <span className="k-slide-eyebrow">{tr2({ uz: `Uzum voqeasi · ${i + 1} / ${K_SLIDES.length}`, ru: `История Uzum · ${i + 1} / ${K_SLIDES.length}` })}</span>
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{tr2(c.h)}</h3>
            <p className="k-slide-body">{tr2(c.body)}</p>
            {c.predict && bet !== void 0 && !isMentorK && <span className={`kp-res ${bet === c.predict.ans ? "hit" : "miss"}`}>{bet === c.predict.ans ? tr2({ uz: "🎯 Topdingiz!", ru: "🎯 Угадали!" }) : tr2(c.predict.miss)}</span>}
          </div>}
        <div className="k-dots">{K_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} />)}</div>
        {last && !betPending && <div className="frame-soft fade-step">
            <p className="body" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{tr2({ uz: "Uzum ham eng og'ir qiyinchilikdan boshlagan. Sizning juftlik-kartangizdagi imkoniyat ham aynan bitta qiyinchilikka qarasin.", ru: "Uzum тоже начал с самой тяжёлой трудности. Пусть и возможность в вашей карточке-паре смотрит ровно на одну трудность." })}</p>
          </div>}
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const own = useMemo2(() => {
    const a = lsRead(M1_CARDS_KEY);
    return Array.isArray(a) ? a.map((c) => c && typeof c.muammo === "string" ? c.muammo.trim() : "").filter((x) => x.length > 3).slice(0, 6) : [];
  }, []);
  const rows = useMemo2(() => [...own.map((t, i) => ({ key: `o${i}`, text: t, own: true })), ...FALLBACK_PAINS.map((p, i) => ({ key: `f${i}`, text: p, own: false }))], [own]);
  const [sel, setSel] = useState2(() => storedAnswer && storedAnswer.sel || []);
  const enough = sel.length >= 3;
  const toggle = (key) => setSel((p) => p.includes(key) ? p.filter((x) => x !== key) : p.length >= 3 ? p : [...p, key]);
  useEffect2(() => {
    if (enough) {
      const picked = sel.map((k) => {
        const r = rows.find((x) => x.key === k);
        return r ? tr2(r.text) : "";
      }).filter(Boolean);
      lsWrite(PICKED_KEY, picked);
      if (storedAnswer === void 0) onAnswer(screen, { stage: "exploration", screenIdx: screen, sel, correct: true, picked: true });
    }
  }, [enough, sel]);
  return <Stage eyebrow={tr2({ uz: "Qiyinchiliklaringiz", ru: "Ваши трудности" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!enough} label={enough ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `Uchtasini belgilang (${sel.length}/3)`, ru: `Отметьте три (${sel.length}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Ishga oladigan <span className="italic" style={{ color: T.accent }}>uch qiyinchilikni</span> belgilang.</>, ru: <>Отметьте <span className="italic" style={{ color: T.accent }}>три трудности</span>, с которыми будете работать.</> })}</h2></div>
        {
    /* F-0802-17: Mentor ish-buyrug'ini TAKRORLAMAYDI (u sarlavhada) — u faqat ro'yxat
       QAYERDAN kelganini va keyin nima bo'lishini aytadi. Ilgari zaxira-tarmoq
       «Sizda saqlangan yozuv topilmadi» deb boshlanardi — o'quvchiga bu tizim-xatosidek
       eshitilardi (foydalanuvchi: «bu backend xatosiga o'xshaydi»). */
  }
        <Mentor>{own.length > 0 ? tr2({ uz: <>Quyida — o'tgan darsda o'zingiz yozgan qiyinchiliklar. Keyingi ekranda ularga imkoniyat yozasiz.</>, ru: <>Ниже — трудности, которые вы записали на прошлом уроке. На следующем экране напишете к ним возможности.</> }) : tr2({ uz: <>Boshlash uchun kinoteatr misolidan foydalanamiz — quyidagilar sizga tanish. Keyingi ekranda ularga imkoniyat yozasiz.</>, ru: <>Для начала возьмём пример с кинотеатром — эти трудности вам знакомы. На следующем экране напишете к ним возможности.</> })}</Mentor>
        <div className="pk-list fade-up delay-1">
          {rows.map((r) => <button key={r.key} className={`pk-row ${sel.includes(r.key) ? "on" : ""}`} onClick={() => toggle(r.key)}>
              <span className="pk-box">{sel.includes(r.key) ? "✓" : ""}</span>
              <span className="pk-t">{tr2(r.text)}</span>
              {r.own && <span className="pk-tag">{tr2({ uz: "sizniki", ru: "ваша" })}</span>}
            </button>)}
        </div>
        {
    /* Progress — instruksiya EMAS, holat. Tugagach yashilga o'tadi (ish bitdi belgisi;
       amber/yashil kontent-semantikasiga tegmaydi — bu jarayon belgisi). F-0802-17 */
  }
        <div className={`pk-count fade-up delay-2${enough ? " full" : ""}`}>
          <span className="pk-count-ic">{enough ? "✓" : "○"}</span>
          <span><b className="pk-count-n">{sel.length}</b> / 3 {tr2({ uz: "tanlandi", ru: "выбрано" })}</span>
        </div>
      </div>
    </Stage>;
};
var FLAT_UZ = /(chiroyli|go'zal|zamonaviy|qulay|yoqimli)/i;
var FLAT_RU = /(красив|современ|удобн|приятн)/i;
var isFlat = (t) => FLAT_UZ.test(t) || FLAT_RU.test(t);
var DECOR_UZ = /(musiq|logotip|animatsi|rang|fon\b|bayram|effekt|chiroy|dizayn)/i;
var DECOR_RU = /(музык|логотип|анимац|цвет|фон\b|праздни|эффект|красив|дизайн)/i;
var isDecor = (t) => DECOR_UZ.test(t) || DECOR_RU.test(t);
var ScreenWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const picked = useMemo2(() => {
    const a = lsRead(PICKED_KEY);
    return Array.isArray(a) ? a : [];
  }, []);
  const [st, setSt] = useState2(() => {
    const saved2 = readFeatures().slice(0, 3);
    return { saved: saved2, draft: { qiyinchilik: "", imkoniyat: "" }, editIdx: -1, done: !!(storedAnswer && storedAnswer.solved) || saved2.length >= 3 };
  });
  const { saved, draft, editIdx, done } = st;
  const [focused, setFocused] = useState2(false);
  const step = editIdx >= 0 ? editIdx : saved.length;
  useEffect2(() => {
    if (editIdx >= 0) return;
    if (draft.qiyinchilik === "" && picked[saved.length]) setSt((p) => ({ ...p, draft: { ...p.draft, qiyinchilik: picked[saved.length] } }));
  }, [saved.length, editIdx]);
  useEffect2(() => {
    if (done && storedAnswer === void 0 && saved.length >= 3) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "features", cards: saved, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
  }, []);
  const q = (draft.qiyinchilik || "").trim(), f = (draft.imkoniyat || "").trim();
  const canSave = q.length >= 3 && f.length >= 3;
  const others = saved.filter((_, i) => i !== editIdx);
  const fb = !canSave ? null : f.toLowerCase() === q.toLowerCase() ? { bad: true, uz: "Imkoniyat qiyinchilikni takrorlab qo'ydi. Sayt NIMA QILISHINI yozing.", ru: "Возможность повторила трудность. Напишите, ЧТО ДЕЛАЕТ сайт." } : isDecor(f) ? { bad: true, uz: "Bu qaysi qiyinchilikni yo'qotadi? Chapdagi qatorni o'qing va shunga javob bo'ladigan narsani yozing.", ru: "Какую трудность это убирает? Прочитайте строку слева и напишите то, что на неё отвечает." } : isFlat(f) && f.length < 45 ? { bad: true, uz: "Bu sayt qanday ko'rinishini aytadi. Sayt nima qilishini yozing — masalan: ko'rsatadi, saqlaydi, yuboradi.", ru: "Это говорит, как выглядит сайт. Напишите, что сайт делает — например: показывает, сохраняет, отправляет." } : others.some((c) => (c.qiyinchilik || "").trim().toLowerCase() === q.toLowerCase()) ? { bad: true, uz: "Bu qiyinchilik ro'yxatda bor. Boshqasini oling — uch juftlik uch xil qiyinchilikka tegishli.", ru: "Эта трудность уже в списке. Возьмите другую — три пары относятся к трём разным трудностям." } : f.length <= 10 ? { bad: true, uz: "Juda qisqa — sayt nima qilishini bir gapda yozing.", ru: "Слишком коротко — напишите одним предложением, что делает сайт." } : { bad: false, uz: "Yaxshi — bu imkoniyat chapdagi qiyinchilikka javob beradi. Saqlang.", ru: "Хорошо — эта возможность отвечает на трудность слева. Сохраняйте." };
  const saveDraft = () => {
    if (!canSave) return;
    const card = { qiyinchilik: q, imkoniyat: f };
    const cards = editIdx >= 0 ? saved.map((c, i) => i === editIdx ? card : c) : [...saved, card];
    lsWrite(FEATURES_KEY, cards);
    const finished = cards.length >= 3;
    if (finished && !done) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "features", cards, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
    setSt({ saved: cards, draft: { qiyinchilik: "", imkoniyat: "" }, editIdx: -1, done: done || finished });
  };
  const editCard = (i) => setSt((p) => ({ ...p, draft: { ...p.saved[i] }, editIdx: i }));
  const setD = (patch) => setSt((p) => ({ ...p, draft: { ...p.draft, ...patch } }));
  const allSaved = saved.length >= 3;
  const showEditor = !allSaved || editIdx >= 0;
  const pend = ["qiyinchilik", "imkoniyat"].filter((k) => !(draft[k] || "").trim());
  const litField = useTurnWalk(pend, showEditor && !focused && !isMentor);
  const saveTurn = useTurnHint(showEditor && canSave && !isMentor);
  return <Stage eyebrow={tr2({ uz: "Ustaxona ✍️", ru: "Мастерская ✍️" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `✍️ ${saved.length}/3 — juftlikni yozib saqlang`, ru: `✍️ ${saved.length}/3 — запишите и сохраните пару` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>{["Birinchi", "Ikkinchi", "Uchinchi"][Math.min(step, 2)]} <span className="italic" style={{ color: T.accent }}>juftlikni</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>{["первую", "вторую", "третью"][Math.min(step, 2)]} пару</span>.</> })}</h2></div>
        {
    /* F-0803-01: Mentor FAQAT birinchi juftlikda — u uch marta bir xil gapni aytardi
       va o'quvchi uni ikkinchi safar o'qimasdi (106c: takror ko'rsatma = shovqin). */
  }
        {step === 0 && editIdx < 0 && <Mentor>{tr2({ uz: <>Belgilagan qiyinchiligingiz chapda turibdi — uni yo'qotadigan imkoniyatni yozing.</>, ru: <>Отмеченная вами трудность стоит слева — напишите возможность, которая её убирает.</> })}</Mentor>}
        {
    /* F-0803-01 — PROGRESS: «1—2—3» chizig'i barcha qadamni teng ko'rsatardi va o'quvchi
       qayerdaligi bilinmasdi. Endi uch holat uch xil: BAJARILGAN (yashil ✓) ·
       HOZIRGI (binafsha, to'ldirilgan) · KUTAYOTGAN (xira). Ulovchi chiziqlar
       olib tashlandi — holat-rangi ularsiz ham «yana bittasi qoldi» deb aytadi. */
  }
        <div className="jw-steps fade-up" aria-label={tr2({ uz: `${saved.length}/3 juftlik yozildi`, ru: `Записано пар: ${saved.length}/3` })}>
          {[0, 1, 2].map((i) => <span key={i} className={`jws ${saved[i] ? "on" : i === step && showEditor ? "cur" : "wait"}`}>
              <i className="jws-n">{saved[i] ? "✓" : i + 1}</i>
              <em className="jws-t">{tr2({ uz: `${i + 1}-juftlik`, ru: `Пара ${i + 1}` })}</em>
            </span>)}
        </div>
        {showEditor && <div className="swed fade-up" key={editIdx >= 0 ? `e${editIdx}` : `n${saved.length}`}>
            <span className="swed-tag">{editIdx >= 0 ? tr2({ uz: `✎ ${editIdx + 1}-juftlikni tahrirlash`, ru: `✎ Правка пары ${editIdx + 1}` }) : tr2({ uz: `✨ ${step + 1}-juftlik`, ru: `✨ Пара ${step + 1}` })}</span>
            <div className="pf-edit">
              <label className={`smini-f pain ${q.length >= 3 ? "on" : ""}${turnCls(litField, "qiyinchilik", pend.length > 1)}`}>
                <span>{tr2({ uz: "QIYINCHILIK", ru: "ТРУДНОСТЬ" })}</span>
                <input value={draft.qiyinchilik} onChange={(e) => setD({ qiyinchilik: e.target.value })} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={tr2({ uz: "Odamga nimasi qiyin?", ru: "Что человеку трудно?" })} />
              </label>
              <span className={`pf-link ${canSave ? "on" : ""}`} aria-hidden="true">↔</span>
              <label className={`smini-f feat ${f.length >= 3 ? "on" : ""}${turnCls(litField, "imkoniyat", pend.length > 1)}`}>
                <span>{tr2({ uz: "IMKONIYAT", ru: "ВОЗМОЖНОСТЬ" })}</span>
                {
    /* Namuna-akkordeoni olib tashlandi (F-0803-01): misol aynan YOZILADIGAN
       joyda, placeholder ichida turadi — alohida blok talab qilmaydi. */
  }
                <input value={draft.imkoniyat} onChange={(e) => setD({ imkoniyat: e.target.value })} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={tr2({ uz: "Masalan: film vaqtini ko'rsatadi", ru: "Например: показывает время фильма" })} />
              </label>
            </div>
            {fb && <p className={`swed-fb ${fb.bad ? "bad" : "ok"}`}>{fb.bad ? "🤔" : "✅"} {tr2(fb)}</p>}
            <div className="swed-btns">
              {editIdx >= 0 && <button className="btn-ghost" onClick={() => setSt((p) => ({ ...p, draft: { qiyinchilik: "", imkoniyat: "" }, editIdx: -1 }))}>{tr2({ uz: "Bekor qilish", ru: "Отменить" })}</button>}
              {
    /* Saqlash tugmasi FAQAT ikkala maydon to'lganda chiqadi (F-0803-01): ilgari u
       doim katta va o'chiq turib ko'zni tortardi, ish esa formada edi. */
  }
              {canSave && <button className={`swed-save${saveTurn ? " turn-ring" : ""}`} onClick={saveDraft}>{tr2({ uz: "✓ Saqlash", ru: "✓ Сохранить" })}</button>}
            </div>
          </div>}
        {saved.length > 0 && <div className="svd full fade-step">
            {saved.map((c, i) => <div key={i} className={`svd-card ${editIdx === i ? "editing" : ""}`}>
                <div className="svd-top">
                  <span className="svd-num">✓ {i + 1}</span>
                  <button className="svd-edit" onClick={() => editCard(i)} aria-label={tr2({ uz: `${i + 1}-juftlikni tahrirlash`, ru: `Править пару ${i + 1}` })}>{tr2({ uz: "✎ Tahrirlash", ru: "✎ Править" })}</button>
                </div>
                <p className="svd-sent"><b style={{ color: T.amberInk }}>{c.qiyinchilik}</b> ↔ <b style={{ color: T.success }}>{c.imkoniyat}</b></p>
              </div>)}
          </div>}
        {allSaved && <div className="done-mini fade-step">{tr2({ uz: "✅ Uch juftlik tayyor", ru: "✅ Три пары готовы" })} <span className="dm-sub">{tr2({ uz: "— tahrirlash uchun ✎ belgisidan foydalaning", ru: "— для правки используйте значок ✎" })}</span></div>}
        {
    /* F-0803-01 — OLIB TASHLANDI (106c): uchta qoida ro'yxati (.chk) va ostidagi
       «Bitta savolga javob bering…» ipuchasi. Ikkovi ham hujjat-uslubidagi ko'rsatma
       edi; endi o'sha bilim o'z vaqtida — yozayotganda, javob-qatorida beriladi. */
  }
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "✍️ Uch juftlikni yozib bo'lganlar", ru: "✍️ Кто записал три пары" }} />
        <MentorNote>{tr2({ uz: "Bu amaliyotni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq. Baholash-mezoni: har kartada bitta qiyinchilik va bitta imkoniyat, imkoniyat harakat bilan yozilgan, uch karta uch xil qiyinchilikka tegishli.", ru: "Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто. Критерий проверки: в каждой карточке одна трудность и одна возможность, возможность записана действием, три карточки — о трёх разных трудностях." })}</MentorNote>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Задание · вопрос 3" })}
  question={<Q>{tr2({ uz: <>Qaysi juftlik <span className="italic" style={{ color: T.accent }}>to'g'ri</span> yozilgan?</>, ru: <>Какая пара записана <span className="italic" style={{ color: T.accent }}>верно</span>?</> })}</Q>}
  questionText={{ uz: "Qaysi juftlik to'g'ri yozilgan?", ru: "Какая пара записана верно?" }}
  options={[
    { uz: "Zalda joy bormi bilinmaydi — sayt chiroyli bo'lsin", ru: "Непонятно, есть ли места в зале — пусть сайт будет красивым" },
    { uz: "Film qachon boshlanishini bilmaydi — seans jadvali sahifaning tepasida turadi", ru: "Не знает, когда начинается фильм — расписание сеансов стоит наверху страницы" },
    { uz: "Chiptani qayerdan olishni bilmaydi — sayt tez ochiladi", ru: "Не знает, где взять билет — сайт быстро открывается" },
    { uz: "Film qiziqmi bilmaydi — film haqida ko'proq ma'lumot beriladi", ru: "Не знает, интересен ли фильм — даётся больше информации о фильме" }
  ]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! O'ng tomon sayt nima qilishini aytadi va chap tomondagi qiyinchilikni to'g'ridan-to'g'ri yo'qotadi.", ru: "Верно! Правая сторона говорит, что делает сайт, и напрямую убирает трудность слева." }}
  explainWrong={{
    0: { uz: "Qiyinchilik aniq yozilgan, bu yaxshi. Lekin o'ng tomon sayt nima QILISHINI aytmaydi: chiroylilik bo'sh joylarni ko'rsatmaydi.", ru: "Трудность записана конкретно — это хорошо. Но правая сторона не говорит, что сайт ДЕЛАЕТ: красота не показывает свободные места." },
    2: { uz: "Qiyinchilik hayotdan olingan, to'g'ri. Lekin saytning tez ochilishi chiptani qayerdan olishni aytmaydi — javob boshqa narsaga tegib ketgan.", ru: "Трудность взята из жизни, верно. Но быстрая загрузка сайта не говорит, где взять билет — ответ попал не туда." },
    3: { uz: "Yo'nalish to'g'ri tanlangan. Lekin «ko'proq ma'lumot» aniq emas: odam saytga kirib nimani ko'rishi yozilmagan.", ru: "Направление выбрано верно. Но «больше информации» неконкретно: не написано, что человек увидит, зайдя на сайт." },
    default: { uz: "O'ng tomonga qarang: u sayt nima qilishini harakat bilan aytyaptimi?", ru: "Посмотрите на правую сторону: говорит ли она действием, что делает сайт?" }
  }}
/>;
var CLEAN_ITEMS = [
  { id: "jadval", ic: "🕒", t: { uz: "Seans jadvali", ru: "Расписание сеансов" }, pain: { uz: "Film qachon boshlanishini bilmaydi", ru: "Не знает, когда начинается фильм" }, extra: false },
  { id: "chipta", ic: "🎟", t: { uz: "Onlayn chipta", ru: "Билет онлайн" }, pain: { uz: "Chiptani qayerdan olishni bilmaydi", ru: "Не знает, где взять билет" }, extra: false },
  // F-0803-02: ortiqcha bandning izohi BITTA qisqa hukm — uzun tushuntirish va muhokama-savoli
  // olib tashlandi (ular MentorNote'ga ko'chdi). O'quvchi bir qarashda javobni oladi.
  { id: "zamonaviy", ic: "⭐", t: { uz: "Sayt zamonaviy ko'rinsin", ru: "Пусть сайт выглядит современно" }, pain: { uz: "Qaysi qiyinchilikni yo'qotishi yozilmagan", ru: "Не написано, какую трудность это убирает" }, extra: true },
  { id: "joylar", ic: "💺", t: { uz: "Zal xaritasi", ru: "Карта зала" }, pain: { uz: "Zalda bo'sh joy bormi — bilinmaydi", ru: "Непонятно, есть ли в зале свободные места" }, extra: false },
  { id: "bayram", ic: "🎉", t: { uz: "Bosh sahifada bayram ta'siri", ru: "Праздничный эффект на главной" }, pain: { uz: "Hech qanday qiyinchilikni yo'qotmaydi", ru: "Не убирает ни одной трудности" }, extra: true }
];
var ScreenClean = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const [open, setOpen] = useState2({});
  const [seen, setSeen] = useState2(() => storedAnswer && storedAnswer.seen || []);
  const [shelf, setShelf] = useState2(() => storedAnswer && storedAnswer.shelf || []);
  const [warn, setWarn] = useState2(null);
  const doneAll = CLEAN_ITEMS.filter((i) => i.extra).every((i) => shelf.includes(i.id));
  const toggle = (id) => {
    setOpen((p) => ({ ...p, [id]: !p[id] }));
    setSeen((p) => p.includes(id) ? p : [...p, id]);
  };
  const toShelf = (it) => {
    if (!it.extra) {
      setWarn(it.id);
      setTimeout(() => setWarn(null), 2600);
      return;
    }
    setShelf((s) => s.includes(it.id) ? s : [...s, it.id]);
  };
  useEffect2(() => {
    if (doneAll && storedAnswer === void 0) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "clean", shelf, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
  }, [doneAll]);
  const pending = CLEAN_ITEMS.filter((i) => !seen.includes(i.id)).map((i) => i.id);
  const lit = useTurnWalk(pending, pending.length > 0 && !isMentor);
  return <Stage eyebrow={tr2({ uz: "Ortiqchasini toping", ru: "Найдите лишнее" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!doneAll && !isMentor} label={doneAll || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `Keraksizini toping (${shelf.length}/2)`, ru: `Найдите ненужные (${shelf.length}/2)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qiyinchiligi <span className="italic" style={{ color: T.accent }}>yo'q bandni</span> toping.</>, ru: <>Найдите пункт <span className="italic" style={{ color: T.accent }}>без трудности</span>.</> })}</h2></div>
        {
    /* F-0802-17: bu ekranda Mentor umuman yo'q edi, o'rniga IKKITA ipucha turardi
       (biri sahna + «bosing», ikkinchisi usul). Bittaga birlashtirildi: sahna + USUL.
       «Har bandni bosing» olib tashlandi — bosish o'z affordansidan ko'rinadi. */
  }
        <Mentor>{tr2({ uz: <>Har bir bandga bitta savol bering: <b style={{ color: T.ink }}>bu odamni nimadan qutqaradi?</b> Javob topilmasa — u kerak emas.</>, ru: <>Задайте каждому пункту один вопрос: <b style={{ color: T.ink }}>от чего это избавляет человека?</b> Если ответа нет — он не нужен.</> })}</Mentor>
        <div className="cl-list fade-up delay-1">
          {CLEAN_ITEMS.filter((it) => !shelf.includes(it.id)).map((it) => <div key={it.id} className={`cl-item ${open[it.id] ? "on" : ""} ${seen.includes(it.id) && !it.extra ? "ok" : ""}`}>
              <button className={`cl-top${turnCls(lit, it.id, pending.length > 1)}`} onClick={() => toggle(it.id)} aria-expanded={!!open[it.id]}>
                <span className="cl-ic">{it.ic}</span>
                <span className="cl-t">{tr2(it.t)}</span>
                {seen.includes(it.id) && !it.extra && <span className="cl-ok">✓</span>}
                <span className="cl-arw">{open[it.id] ? "▾" : "▸"}</span>
              </button>
              {
    /* F-0803-02 — OCHILGANDA IKKI NARSA: bitta hukm + bitta harakat.
       Ilgari bu yerda hukm + tugma + uzun izoh (cl-note) birga chiqardi va
       o'quvchi «foydalimi yoki yo'qmi?» degan javobni darrov ololmasdi. */
  }
              {open[it.id] && <div className="cl-body fade-step">
                  <p className={`cl-pain ${it.extra ? "none" : ""}`}>{it.extra ? "❌ " : "↳ "}{tr2(it.pain)}</p>
                  <button className="cl-shelf-btn" onClick={() => toShelf(it)}>{tr2({ uz: "🗑 Bu kerak emas", ru: "🗑 Это не нужно" })}</button>
                  {warn === it.id && <p className="cl-warn">{tr2({ uz: "Bu bandning qiyinchiligi bor — u ro'yxatda qoladi.", ru: "У этого пункта есть трудность — он остаётся в списке." })}</p>}
                </div>}
            </div>)}
        </div>
        {
    /* F-0803-02: «Javon» → «Keraksizlar». «Javon» metaforasini o'quvchi izohsiz
       tushunmasdi; «Keraksizlar» nomning O'ZI nima uchun ekanini aytadi. */
  }
        <div className="cl-shelf">
          <span className="cl-shelf-lbl">{tr2({ uz: "🗑 Keraksizlar", ru: "🗑 Ненужные" })}</span>
          {shelf.map((id) => {
    const it = CLEAN_ITEMS.find((x) => x.id === id);
    return <span key={id} className="cl-chip">{it.ic} {tr2(it.t)}</span>;
  })}
          {shelf.length === 0 && <span className="cl-shelf-empty">{tr2({ uz: "hozircha bo'sh", ru: "пока пусто" })}</span>}
        </div>
        {doneAll && <div className="done-mini fade-step">{tr2({ uz: "✅ 3 ta foydali band qoldi", ru: "✅ Осталось 3 полезных пункта" })}</div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "🗑 Ro'yxatni tozalaganlar", ru: "🗑 Кто очистил список" }} />
        <MentorNote>{tr2({ uz: "Bu mashqni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq. Tuzoqqa tushish xato emas — aynan shu lahza dars mavzusi, ovoz chiqarib muhokama qiling. «Zamonaviy ko'rinsin» chiqqanda so'rang: buni qanday qilib aniq bitta qiyinchilikka bog'lasa bo'ladi?", ru: "Это упражнение выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто. Попасться в ловушку — не ошибка: именно этот момент и есть тема урока, обсудите вслух." })}</MentorNote>
      </div>
    </Stage>;
};
var KOD_CONDS = [
  { id: "c1", label: { uz: "Ro'yxatda 3 ta band", ru: "В списке 3 пункта" } },
  { id: "c2", label: { uz: "Har bandda qalin nom", ru: "В каждом пункте жирное имя" } },
  { id: "c3", label: { uz: "Tiredan keyin qiyinchilik", ru: "После тире — трудность" } }
];
var DASH_RE = /[—–-]/;
function checkList(html) {
  const res = { c1: false, c2: false, c3: false, hints: {} };
  if (typeof DOMParser === "undefined") return res;
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const items = Array.from(doc.body.querySelectorAll("li"));
  const txt = (el) => el && el.textContent ? el.textContent.replace(/\s+/g, " ").trim() : "";
  if (items.length < 3) res.hints.c1 = tr2({ uz: "Yangi band ochish uchun <li> yozing, matnni yozing, </li> bilan yoping.", ru: "Чтобы открыть новый пункт, напишите <li>, затем текст и закройте </li>." });
  else res.c1 = true;
  const noBold = items.filter((li) => {
    const b = li.querySelector("b");
    return !b || txt(b).length < 2;
  });
  if (items.length === 0) res.hints.c2 = tr2({ uz: "Avval bandlarni yozing, keyin ularning ichiga <b> qo'shasiz.", ru: "Сначала напишите пункты, потом добавите внутрь <b>." });
  else if (noBold.length > 0) res.hints.c2 = tr2({ uz: "Imkoniyat nomini <b> va </b> orasiga yozing — u sahifada qalin chiqadi.", ru: "Название возможности напишите между <b> и </b> — на странице оно станет жирным." });
  else res.c2 = true;
  const noTail = items.filter((li) => {
    const t = txt(li);
    const m = t.split(DASH_RE);
    return m.length < 2 || m[m.length - 1].trim().length < 8;
  });
  if (items.length === 0) res.hints.c3 = tr2({ uz: "Bandlar yozilgach, har birida tiredan keyin qiyinchilikni yozasiz.", ru: "Когда пункты написаны, в каждом после тире напишете трудность." });
  else if (noTail.length > 0) res.hints.c3 = tr2({ uz: "Tiredan keyin bu imkoniyat qaysi qiyinchilikni yo'qotishini yozing.", ru: "После тире напишите, какую трудность убирает эта возможность." });
  else res.c3 = true;
  return res;
}
var KOD_PREVIEW_CSS = `
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FBFAFE;color:#1B1630;line-height:1.55;padding:18px 20px}
  h2{margin:0 0 12px;font-size:19px;font-family:Georgia,serif;color:#5B3DE6}
  ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:9px}
  li{font-size:14px;color:#565073;overflow-wrap:anywhere}
  li b{color:#1B1630}
  h2,li,p{overflow-wrap:anywhere;min-width:0}
`;
var kodStarter = () => {
  const f = readFeatures();
  const first = f[0];
  const feat = first ? first.imkoniyat : tr2({ uz: "Seans jadvali", ru: "Расписание сеансов" });
  const pain = first ? first.qiyinchilik : tr2({ uz: "film qachon boshlanishini bilmaydi", ru: "не знает, когда начинается фильм" });
  return `${tr2({ uz: "<h2>Kinoteatr sayti nima beradi</h2>", ru: "<h2>Что даёт сайт кинотеатра</h2>" })}

<ul>
  <li><b>${feat}</b> — ${pain}</li>
  ${tr2({ uz: "<!-- ← Bu joyga yana ikki band yozasiz -->", ru: "<!-- ← Сюда напишете ещё два пункта -->" })}
</ul>`;
};
var KODING_KEY = "pm-m2d2-koding";
var readKoding = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KODING_KEY) || "null");
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
};
var writeKodingOpen = (open) => {
  try {
    const p = readKoding() || {};
    localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open }));
  } catch {
  }
};
var _listSrc = null;
var _listRes = null;
var listOf = (html) => {
  if (html !== _listSrc) {
    _listSrc = html;
    _listRes = checkList(html || "");
  }
  return _listRes;
};
var KOD_TASK = {
  eyebrow: { uz: "Koding · juftliklar ro'yxati", ru: "Кодинг · список пар" },
  title: { uz: "Juftliklaringizni sahifada ko'rsating", ru: "Покажите свои пары на странице" },
  brief: { uz: <>Ro'yxatga yana <b>ikkita band</b> qo'shing. Har bandda imkoniyat nomi <span className="mono">&lt;b&gt;</span> va <span className="mono">&lt;/b&gt;</span> orasida turadi, tiredan keyin esa o'sha imkoniyat yo'qotadigan qiyinchilik yoziladi.</>, ru: <>Добавьте в список ещё <b>два пункта</b>. В каждом название возможности стоит между <span className="mono">&lt;b&gt;</span> и <span className="mono">&lt;/b&gt;</span>, а после тире пишется трудность, которую эта возможность убирает.</> },
  previewUrl: "kino.uz",
  previewCss: KOD_PREVIEW_CSS,
  requirements: KOD_CONDS.map((c) => ({
    id: c.id,
    label: c.label,
    check: checks.custom((x) => {
      const r = listOf(x.html);
      return r[c.id] ? true : r.hints[c.id] || false;
    })
  }))
};
var ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const isSelf = !live || live.mode === "self";
  const workRef = useRef2(null);
  const [open, setOpen] = useState2(() => {
    const s = readKoding();
    return !!(s && s.open);
  });
  const mine = useMemo2(() => readFeatures(), []);
  const [st, setSt] = useState2(() => {
    const saved = readKoding();
    return { code: storedAnswer && storedAnswer.code || saved && saved.code || kodStarter(), done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done) };
  });
  const { code, done } = st;
  const openHint = useTurnHint(!done && !open && !isMentor);
  useEffect2(() => {
    if (done && storedAnswer === void 0) {
      onAnswer(screen, { stage: "koding", screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "koding", 0, true, 0);
    }
  }, []);
  const finishPractice = ({ code: newCode }) => {
    setOpen(false);
    setSt({ code: newCode, done: true });
    try {
      localStorage.setItem(KODING_KEY, JSON.stringify({ code: newCode, done: true, open: false }));
    } catch {
    }
    if (!done) {
      onAnswer(screen, { stage: "koding", screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "koding", 0, true, 0);
    }
  };
  return <Stage eyebrow={tr2({ uz: "Koding · 🛠 kompilyator", ru: "Кодинг · 🛠 компилятор" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval kompilyatorda yozing", ru: "Сначала напишите в компиляторе" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Endi juftliklaringizni <span className="italic" style={{ color: T.accent }}>sahifada</span> ko'rsatamiz.</>, ru: <>Теперь покажем ваши пары <span className="italic" style={{ color: T.accent }}>на странице</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Pastdagi <b style={{ color: T.ink }}>«🛠 Kompilyatorni ochish»</b> tugmasini bosing. Kodni yozadigan va natijani darhol ko'rsatadigan oyna ochiladi.</>, ru: <>Нажмите кнопку <b style={{ color: T.ink }}>«🛠 Открыть компилятор»</b> ниже. Откроется окно, где пишут код и сразу видят результат.</> })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div className="stq fade-up delay-1" ref={workRef}>
          <div className="stq-code">
            <span className="stq-code-bar"><span className="bb-dots"><i /><i /><i /></span>index.html</span>
            <code className="stq-code-body">
              <span className="stq-l t">&lt;ul&gt;</span>
              <span className="stq-l dim">   &lt;li&gt;&lt;b&gt;{tr2({ uz: "imkoniyat", ru: "возможность" })}&lt;/b&gt; — {tr2({ uz: "qiyinchilik", ru: "трудность" })}&lt;/li&gt;</span>
              <span className="stq-l t">&lt;/ul&gt;</span>
            </code>
          </div>
          <span className="stq-arrow" aria-hidden="true">➜</span>
          <div className="stq-page">
            <div className="stq-pbar"><span className="bb-dots"><i /><i /><i /></span><span className="stq-purl"><span className="lock">●</span>kino.uz</span></div>
            <div className="stq-mine">
              <span className="stq-mine-lbl">{tr2({ uz: "📒 Bular — o'z juftliklaringiz", ru: "📒 Это — ваши пары" })}</span>
              {(mine.length > 0 ? mine : [{ qiyinchilik: tr2({ uz: "film qachon boshlanishini bilmaydi", ru: "не знает, когда начинается фильм" }), imkoniyat: tr2({ uz: "Seans jadvali", ru: "Расписание сеансов" }) }]).map((c, i) => <span key={i} className="stq-mine-row"><b>{c.imkoniyat}</b> — {c.qiyinchilik}</span>)}
            </div>
          </div>
        </div>
        <div className="stq-cta fade-up delay-2">
          <button className={`kod-launch-btn${openHint ? " turn-ring" : ""}`} onClick={() => {
    setOpen(true);
    writeKodingOpen(true);
  }}>{done ? tr2({ uz: "↻ Kompilyatorni qayta ochish", ru: "↻ Открыть компилятор заново" }) : tr2({ uz: "🛠 Kompilyatorni ochish", ru: "🛠 Открыть компилятор" })}</button>
          {done && <span className="stq-cta-sub">{tr2({ uz: "Bajarildi — xohlasangiz kodni yana sayqallang", ru: "Выполнено — при желании доработайте код" })}</span>}
          {!done && isSelf && <button className="stq-skip" onClick={onNext}>{tr2({ uz: "✓ Bu mashqni sinfda bajarganman — davom etish →", ru: "✓ Это задание я выполнил в классе — продолжить →" })}</button>}
        </div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: "center" }}>{tr2({ uz: "✅ Ishladi!", ru: "✅ Получилось!" })} <span className="dm-sub">{tr2({ uz: "— sahifadagi har bir band bitta qiyinchilikning javobi. Kod yozilishidan oldin ana shu juftlik yoziladi.", ru: "— каждый пункт страницы отвечает на одну трудность. Эта пара пишется раньше кода." })}</span></div>}
        {
    /* Ixtiyoriy qo'shimcha topshiriq MENTOR eslatmasiga ko'chirildi (F-0802-17):
       u vazifani bajarish uchun zarur emas, o'quvchi ekranida esa blok egallardi. */
  }
        <MentorNote>{tr2({ uz: "Ulgurgan o'quvchilarga ayting: to'rtinchi bandni ham qo'shishsin — uyda yozadigan juftligi uchun.", ru: "Тем, кто успел, скажите: пусть добавят и четвёртый пункт — для пары, которую напишут дома." })}</MentorNote>
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "🛠 Kodni yozib bo'lganlar", ru: "🛠 Кто уже написал код" }} />
        <MentorNote>{tr2({ uz: "Kodni VS Code'da emas, shu oynada yozadi — 10 daqiqa yetadi. Ulgurmagan o'quvchi uyga vazifada tugatadi, unga qisqa variant beriladi.", ru: "Код пишут не в VS Code, а в этом окне — 10 минут достаточно. Кто не успел, дописывает в домашнем задании по короткому варианту." })}</MentorNote>
      </div>
      {
    /* Kod-saqlov kompilyatorning O'ZIDA (`:code`) — dars kaliti `done`/`open` uchun qoladi */
  }
      {open && <HtmlCompiler_default
    lang={__lang2}
    task={KOD_TASK}
    starterCode={code || kodStarter()}
    storageKey={`${KODING_KEY}:code`}
    onContinue={finishPractice}
    onBack={() => {
      setOpen(false);
      writeKodingOpen(false);
    }}
  />}
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  scope="final"
  eyebrow={tr2({ uz: "Yakuniy savol", ru: "Итоговый вопрос" })}
  question={<Q>{tr2({ uz: <>Kinoteatr egasi: «Saytga o'yin qo'shaylik» dedi. <span className="italic" style={{ color: T.accent }}>Birinchi</span> nima qilasiz?</>, ru: <>Владелец кинотеатра сказал: «Давайте добавим на сайт игру». Что сделаете <span className="italic" style={{ color: T.accent }}>первым</span>?</> })}</Q>}
  questionText={{ uz: "Kinoteatr egasi o'yin qo'shishni so'radi. Birinchi nima qilasiz?", ru: "Владелец кинотеатра попросил добавить игру. Что сделаете первым?" }}
  options={[
    { uz: "O'yin kimning qaysi qiyinchiligini yo'qotishini so'rayman", ru: "Спрошу, чью и какую трудность убирает эта игра" },
    { uz: "Darhol qo'shaman — egasi shunday xohladi", ru: "Сразу добавлю — хозяин так захотел" },
    { uz: "Keyinroq qilamiz deb aytaman", ru: "Скажу, что сделаем позже" },
    { uz: "Boshqa kinoteatr saytlarida o'yin bor-yo'qligini tekshiraman", ru: "Проверю, есть ли игра на других сайтах кинотеатров" }
  ]}
  correctIdx={0}
  explainCorrect={{ uz: "To'g'ri! Har imkoniyat shu savoldan boshlanadi. Javob topilsa — o'yin ro'yxatga kiradi, topilmasa — keraksizlarga.", ru: "Верно! Каждая возможность начинается с этого вопроса. Ответ найдётся — игра попадёт в список, нет — в ненужные." }}
  explainWrong={{
    1: { uz: "Egasining so'zini eshitish shart, bu to'g'ri. Lekin so'rov hali imkoniyat emas: u qaysi qiyinchilikka javob berishi hali noma'lum.", ru: "Выслушать хозяина обязательно, это верно. Но просьба — ещё не возможность: пока неизвестно, на какую трудность она отвечает." },
    2: { uz: "Ishni tartibga solish kerak, bu rost. Lekin kechiktirish savolga javob bermaydi — o'yin keyin ham egasiz qoladi.", ru: "Наводить порядок в работе нужно, это правда. Но отсрочка не отвечает на вопрос — игра и потом останется без хозяина." },
    3: { uz: "Boshqalarni ko'rish foydali odat. Lekin ularda borligi sizning mijozingizga kerakligini isbotlamaydi.", ru: "Смотреть на других — полезная привычка. Но то, что игра есть у них, не доказывает, что она нужна вашему клиенту." },
    default: { uz: "Har imkoniyat qaysi savoldan boshlanishini eslang.", ru: "Вспомните, с какого вопроса начинается каждая возможность." }
  }}
/>;
var CLASS_ASKS = [
  { uz: "Kimning uch juftligi ham tayyor?", ru: "У кого готовы все три пары?" },
  { uz: "Kimda keraksizlarga chiqqan band bor?", ru: "У кого есть пункт, ушедший в ненужные?" },
  { uz: "Kim uyda yana bitta juftlik yozmoqchi?", ru: "Кто дома напишет ещё одну пару?" }
];
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const [txt, setTxt] = useState2(() => storedAnswer && storedAnswer.text || (typeof localStorage !== "undefined" ? localStorage.getItem(REFLECT_KEY) || "" : ""));
  const ok = txt.trim().length >= 12;
  useEffect2(() => {
    try {
      localStorage.setItem(REFLECT_KEY, txt);
    } catch {
    }
    if (ok && storedAnswer === void 0) onAnswer(screen, { stage: "reflection", screenIdx: screen, text: txt, picked: true });
  }, [txt, ok]);
  return <Stage eyebrow={tr2({ uz: "Yakuniy so'z", ru: "Заключительное слово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ok && !isMentor} label={ok || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Bir qator yozing", ru: "Напишите одну строку" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta juftligingizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете назвать одну свою пару <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Ekranga qaramasdan sherigingizga ayting: qanday qiyinchilik va uni qaysi imkoniyat yo'qotadi? So'ng shu gapni bir qatorga yozing.</>, ru: <>Не глядя на экран, скажите соседу: какая трудность и какая возможность её убирает? Потом запишите эту фразу одной строкой.</> })}</Mentor>
        {
    /* F-0803-03 — 106e (ko'rsatma → vazifa → javob): «① Sherigingizga ayting» kartasi
       olib tashlandi — Mentor buni allaqachon aytadi; «③ Sinf bilan: qo'l ko'taring»
       esa mentor ish-tartibi, o'quvchi ekranida joyi yo'q → MentorNote'ga. Qoladigan
       yagona VAZIFA — yozish maydoni. */
  }
        <div className="rf-write fade-up delay-1">
          <textarea className="rf-area" value={txt} onChange={(e) => setTxt(e.target.value)} rows={3} placeholder={tr2({ uz: "Qiyinchilik ↔ uni yo'qotadigan imkoniyat", ru: "Трудность ↔ возможность, которая её убирает" })} />
          <span className="rf-cnt">{ok ? tr2({ uz: "✓ Yozildi", ru: "✓ Записано" }) : tr2({ uz: "kamida bir gap", ru: "хотя бы одно предложение" })}</span>
        </div>
        {
    /* 🎯 «Aha» lahzasi — dars aynan shu gap bilan yopiladi. Faqat o'quvchi YOZGANDAN
       keyin chiqadi: bu mukofot, ko'rsatma emas (106e ning uchinchi zarbi). */
  }
        {ok && <div className="rf-aha fade-step">
            <p className="rf-aha-t">{tr2({ uz: "🎉 Ajoyib! Endi siz imkoniyatni emas, qiyinchilikni o'ylaydigan bo'ldingiz.", ru: "🎉 Отлично! Теперь вы думаете не о возможности, а о трудности." })}</p>
            <p className="rf-aha-r">{tr2({ uz: <><b>🎯 Bugungi qoida:</b> har bir imkoniyat bitta qiyinchilikni yo'qotishi kerak.</>, ru: <><b>🎯 Правило дня:</b> каждая возможность должна убирать одну трудность.</> })}</p>
          </div>}
        <MentorNote>{tr2({ uz: "Sinfning uchdan biri «imkoniyat» o'rniga «sayt chiroyli bo'lsin» desa — kartalar ekranidagi fon musiqasini qayta ko'rsating, boshqa misolga o'tmang. Yakunda qo'l ko'tartiring: " + CLASS_ASKS.map((a) => a.uz).join(" · "), ru: "Если треть класса вместо возможности говорит «пусть сайт будет красивым» — снова покажите фоновую музыку с экрана карточек, на другой пример не переходите. В конце попросите поднять руку: " + CLASS_ASKS.map((a) => a.ru).join(" · ") })}</MentorNote>
      </div>
    </Stage>;
};
var HW_TOKENS = [
  { t: { uz: "juftlik", ru: "пара" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "qiyinchilik", ru: "трудность" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "imkoniyat", ru: "возможность" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "keraksiz", ru: "ненужное" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
var HW_ROWS = [
  { b: { uz: "Nechta", ru: "Сколько" }, t: { uz: "2 ta yangi juftlik", ru: "2 новые пары" } },
  { b: { uz: "Qayerdan", ru: "Откуда" }, t: { uz: "bugun keraksizlarga chiqqan bandlardan", ru: "из пунктов, ушедших сегодня в ненужные" } },
  { b: { uz: "Qayerga", ru: "Куда" }, t: { uz: "shu darsning ustaxona ekraniga", ru: "на экран мастерской этого урока" } }
];
var HW_STEPS = [
  { uz: "Keraksizlarga chiqqan bandni oling va uni kim uchun kerakli qilishini o'ylang.", ru: "Возьмите пункт, ушедший в ненужные, и подумайте, кому его сделать нужным." },
  { uz: "Shu odamning qiyinchiligini bir gapda yozing.", ru: "Запишите трудность этого человека одним предложением." },
  { uz: "Uni yo'qotadigan imkoniyatni yozing va saqlang.", ru: "Напишите возможность, которая её убирает, и сохраните." }
];
var Q_LABELS = {
  3: { uz: "Imkoniyat qaysi savoldan boshlanadi", ru: "С какого вопроса начинается возможность" },
  5: { uz: "Egasiz imkoniyat", ru: "Возможность без хозяина" },
  9: { uz: "Juftlik qanday yoziladi", ru: "Как пишется пара" },
  12: { uz: "Yangi so'rov kelganda (yakuniy)", ru: "Когда приходит новая просьба (итог)" }
};
var INLINE_KEYS = { s3: 2, s5: 1, s9: 1, s12: 0, s8: -1, s10: -1, s11: -1 };
var Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, "#FFD380", "#FF7755", "#7DD181"];
  return <div className="confetti" aria-hidden="true">
      {Array.from({ length: 44 }).map((_, i) => {
    const left = (i * 2.31 + i % 7 * 4) % 100;
    const size = 6 + i % 4 * 2;
    return <span key={i} className="confetti-bit" style={{
      left: `${left}%`,
      background: COLORS[i % COLORS.length],
      width: size,
      height: size * 1.5,
      animationDelay: `${i % 11 * 0.16}s`,
      animationDuration: `${2.4 + i % 6 * 0.45}s`,
      borderRadius: i % 2 ? "2px" : "50%"
    }} />;
  })}
    </div>;
};
var ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState2([]);
  const [rows, setRows] = useState2([]);
  const [loaded, setLoaded] = useState2(false);
  useEffect2(() => {
    if (!isLive || !livePin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [p, a] = await Promise.all([livePlayers(livePin), liveAnswers(livePin)]);
        if (on) {
          setPlayers(p);
          setRows(a);
          setLoaded(true);
        }
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [isLive, livePin]);
  const totalQ = SCORED_IDX.length;
  const board = players.map((p) => {
    const mine = rows.filter((a) => a.player_id === p.id && SCORED_IDX.includes(a.screen_idx));
    const okCount = mine.filter((a) => a.correct).length;
    const time = mine.reduce((s, a) => s + (a.elapsed_ms || 0), 0);
    return { id: p.id, nickname: p.nickname, okCount, time };
  }).sort((x, y) => y.okCount - x.okCount || x.time - y.time);
  const fmtT = (ms) => `${(ms / 1e3).toFixed(1)}s`;
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex((b) => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  return <Stage eyebrow={tr2({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши <span className="italic" style={{ color: T.accent }}>победители</span> сегодня</> }) : tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>результат</span> сегодня</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — пьедестал 🥇🥈🥉." })}</p></div>
          </div> : !loaded ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Загружаем результаты…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
            <Confetti />
            {
    /* Podium — 2-1-3 tartibida (o'rtada g'olib, balandroq) */
  }
            <div className="pod-stage fade-up">
              {[1, 0, 2].map((rank) => {
    const b = top3[rank];
    return <div key={rank} className={`pod-col pod-${rank + 1} ${b && live.playerId === b.id ? "me" : ""}`}>
                    <span className="pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : "—"}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ} · {fmtT(b.time)}</span>}
                    <div className="pod-bar" />
                  </div>;
  })}
            </div>
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> (верно: {board[myIdx].okCount}/{totalQ})</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏆 To'liq reyting", ru: "🏆 Полный рейтинг" })}</div>
              <div className="pod-list">
                {board.map((b, i) => <div key={b.id} className={`pod-row ${live.playerId === b.id ? "me" : ""}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map((q) => {
    const a = rows.find((r) => r.player_id === b.id && r.screen_idx === q);
    return <span key={q} className={`pod-dot ${a ? a.correct ? "ok" : "bad" : ""}`} title={tr2(Q_LABELS[q])} />;
  })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>)}
              </div>
            </div>
            {
    /* 📊 «Savollar bo'yicha» kartasi ATAYLAB YO'Q (etalon qarori — 90-qonun):
       proyektorda butun sinf oldida «0/4» ko'rsatish ochiq mag'lubiyat-tablosi bo'ladi.
       Mentor bu ma'lumotni dars PAYTIDA MentorTestStats orqali oladi — o'z joyida. */
  }
          </>}
      </div>
    </Stage>;
};
var QUIZ_MS = 15e3;
var QZ_BG_SHAPES = [
  { ch: "🎟", l: 6, t: 18, s: 40, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: { uz: "juftlik", ru: "пара" }, l: 84, t: 12, s: 30, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: "💺", l: 9, t: 74, s: 38, c: "rgba(255,110,70,0.15)", d: 27, dl: 0.8 },
  { ch: { uz: "imkoniyat", ru: "возможность" }, l: 74, t: 70, s: 24, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: "🗑", l: 46, t: 86, s: 28, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "🕒", l: 66, t: 24, s: 34, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: { uz: "qiyinchilik", ru: "трудность" }, l: 22, t: 36, s: 24, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: { uz: "sayt", ru: "сайт" }, l: 92, t: 46, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: "↔", l: 2, t: 46, s: 22, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "Imkoniyat (feature) nima?", ru: "Что такое возможность (feature)?" }, opts: [{ uz: "Saytning rangi va shrifti", ru: "Цвет и шрифт сайта" }, { uz: "Sayt beradigan bitta aniq foyda-ish", ru: "Одна конкретная польза, которую даёт сайт" }, { uz: "Saytning internetdagi manzili", ru: "Адрес сайта в интернете" }, { uz: "Saytni ochadigan dastur", ru: "Программа, которая открывает сайт" }], correct: 1 },
  { q: { uz: "Har imkoniyat qaysi savolga javob beradi?", ru: "На какой вопрос отвечает каждая возможность?" }, opts: [{ uz: "Uni necha kunda yasaymiz?", ru: "За сколько дней мы её сделаем?" }, { uz: "U sahifaning qaysi joyida turadi?", ru: "В каком месте страницы она стоит?" }, { uz: "U kimning qaysi qiyinchiligini yo'qotadi?", ru: "Чью и какую трудность она убирает?" }, { uz: "U qancha turadi?", ru: "Сколько она стоит?" }], correct: 2 },
  { q: { uz: "Hech qanday qiyinchilikka bog'lanmagan imkoniyat nima bo'ladi?", ru: "Что происходит с возможностью, не связанной ни с одной трудностью?" }, opts: [{ uz: "Ro'yxatdan chiqariladi", ru: "Её убирают из списка" }, { uz: "Eng oxirida qilinadi", ru: "Её делают в самом конце" }, { uz: "Ikki marta tekshiriladi", ru: "Её проверяют дважды" }, { uz: "Boshqa saytga beriladi", ru: "Её отдают другому сайту" }], correct: 0 },
  { q: { uz: "Juftlik-karta nechta bo'lakdan iborat?", ru: "Из скольких частей состоит карточка-пара?" }, opts: [{ uz: "Bittadan", ru: "Из одной" }, { uz: "Uchtadan", ru: "Из трёх" }, { uz: "To'rttadan", ru: "Из четырёх" }, { uz: "Ikkitadan", ru: "Из двух" }], correct: 3 },
  { q: { uz: "«Sayt chiroyli bo'lsin» — bu nimaning javobi?", ru: "«Пусть сайт будет красивым» — ответ на что?" }, opts: [{ uz: "Seans vaqti noma'lumligining", ru: "На неизвестность времени сеанса" }, { uz: "Hech qanday qiyinchilikning javobi emas", ru: "Это ответ ни на одну трудность" }, { uz: "Chipta qayerdan olinishining", ru: "На то, где взять билет" }, { uz: "Zalda joy bor-yo'qligining", ru: "На то, есть ли места в зале" }], correct: 1 },
  { q: { uz: "Imkoniyat qanday yozilsa to'g'ri bo'ladi?", ru: "Как правильно записать возможность?" }, opts: [{ uz: "Sayt nima qilishini aytadigan harakat bilan", ru: "Действием, которое говорит, что делает сайт" }, { uz: "Bitta sifat bilan", ru: "Одним прилагательным" }, { uz: "Kinoteatr nomi bilan", ru: "Названием кинотеатра" }, { uz: "Sana bilan", ru: "Датой" }], correct: 0 },
  { q: { uz: "Uzum ishni nimadan boshlagan?", ru: "С чего начал Uzum?" }, opts: [{ uz: "Reklama roliklaridan", ru: "С рекламных роликов" }, { uz: "Chiroyli bosh sahifadan", ru: "С красивой главной страницы" }, { uz: "O'z yetkazib berish xizmatidan", ru: "Со своей службы доставки" }, { uz: "Chegirmalardan", ru: "Со скидок" }], correct: 2 },
  { q: { uz: "Uzumgacha odamlar asosan qayerdan xarid qilardi?", ru: "Где в основном покупали до Uzum?" }, opts: [{ uz: "Telegram va Instagram guruhlaridan", ru: "В группах Telegram и Instagram" }, { uz: "Faqat bozordan", ru: "Только на базаре" }, { uz: "Chet el saytlaridan", ru: "На зарубежных сайтах" }, { uz: "Gazeta e'lonlaridan", ru: "По объявлениям в газете" }], correct: 0 },
  { q: { uz: "Uzum qachon mamlakatning birinchi «unicorn»i bo'ldi?", ru: "Когда Uzum стал первым «единорогом» страны?" }, opts: [{ uz: "2022-yil oktyabrda", ru: "В октябре 2022 года" }, { uz: "2023-yil yanvarda", ru: "В январе 2023 года" }, { uz: "2025-yil dekabrda", ru: "В декабре 2025 года" }, { uz: "2024-yil martda", ru: "В марте 2024 года" }], correct: 3 },
  { q: { uz: "«Unicorn» degani nima?", ru: "Что означает «единорог»?" }, opts: [{ uz: "Eng ko'p ishchisi bor kompaniya", ru: "Компания с самым большим числом работников" }, { uz: "1 milliard dollardan yuqori baholangan kompaniya", ru: "Компания, оценённая дороже 1 миллиарда долларов" }, { uz: "Eng eski kompaniya", ru: "Самая старая компания" }, { uz: "Faqat internetda ishlaydigan kompaniya", ru: "Компания, работающая только в интернете" }], correct: 1 },
  { q: { uz: "Kinoteatr egasi yangi imkoniyat so'radi. Birinchi nima qilinadi?", ru: "Владелец кинотеатра попросил новую возможность. Что делают первым?" }, opts: [{ uz: "Darhol qo'shiladi", ru: "Сразу добавляют" }, { uz: "Narxi hisoblanadi", ru: "Считают стоимость" }, { uz: "Qaysi qiyinchilikni yo'qotishi so'raladi", ru: "Спрашивают, какую трудность она убирает" }, { uz: "Boshqa saytlar ko'riladi", ru: "Смотрят другие сайты" }], correct: 2 },
  { q: { uz: "Juftlik HTML ro'yxatida qanday yoziladi?", ru: "Как пара записывается в HTML-списке?" }, opts: [{ uz: "Sarlavha tegi ichida, bitta so'z bilan", ru: "Внутри тега заголовка, одним словом" }, { uz: "Rasm tegi bilan", ru: "Тегом картинки" }, { uz: "Havola tegi ichida", ru: "Внутри тега ссылки" }, { uz: "Bir bandda: qalin imkoniyat nomi, tiredan keyin qiyinchilik", ru: "В одном пункте: жирное название возможности, после тире — трудность" }], correct: 3 }
];
var FC_CODE_WORDS = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
var FC_VOCAB = /* @__PURE__ */ new Set(["let", "const", "var", "string", "number", "boolean", "true", "false", "null", "undefined", "function", "return", "for", "while", "if", "else"]);
var fcIsCode = (s) => {
  if (FC_VOCAB.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
var fcTier = (s) => s.length <= 8 ? "t1" : s.length <= 16 ? "t2" : s.length <= 32 ? "t3" : "t4";
var fcAnswer = (raw) => {
  const s = String(raw ?? "");
  const oneToken = !/\s/.test(s) && fcIsCode(s);
  const cls = `fc-tag ${fcTier(s)} ${oneToken ? "mono-all" : "prose"}`;
  if (oneToken) return <span className={cls}>{s}</span>;
  const parts = s.split(FC_CODE_WORDS);
  return <span className={cls}>
      {parts.map((p, i) => i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p)}
    </span>;
};
function Flashcards({ cards }) {
  const [queue, setQueue] = useState2(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState2(false);
  const [known, setKnown] = useState2(0);
  const [exiting, setExiting] = useState2(null);
  const swapRef = useRef2(0);
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? "knew" : "again");
    setTimeout(() => {
      setExiting(null);
      setFlipped(false);
      swapRef.current++;
      if (removed) setKnown((k) => k + 1);
      setQueue((q) => {
        const [first, ...rest] = q;
        return removed ? rest : [...rest, first];
      });
    }, 420);
  };
  const knew = () => advance(true);
  const again = () => advance(false);
  const restart = () => {
    setQueue(cards.map((_, i) => i));
    setKnown(0);
    setFlipped(false);
  };
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr2({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{tr2({ uz: `${total}/${total} karta takrorlandi`, ru: `Повторено карточек: ${total}/${total}` })}</p><button className="fc-btn ghost" onClick={restart}>{tr2({ uz: "↻ Qaytadan takrorlash", ru: "↻ Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda", ru: "↻ Учу" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr2(card.front)}</span><span className="fc-cue">{tr2({ uz: "Javobni o'ylang 🤔", ru: "Подумайте над ответом 🤔" })} <span className="fc-tap">{tr2({ uz: "bosing", ru: "нажмите" })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr2(card.back))}{card.note && <span className="fc-note">{tr2(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr2({ uz: "✗ Takrorlash", ru: "✗ Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })}</button></div> : <p className="fc-hint">{tr2({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: "👆 Нажмите на карточку — увидите ответ" })}</p>}
    </div>;
}
var PM4_FLASHCARDS = [
  { front: { uz: "Imkoniyat (feature) nima?", ru: "Что такое возможность (feature)?" }, back: { uz: "Sayt beradigan bitta aniq foyda-ish", ru: "Одна конкретная польза, которую даёт сайт" }, note: { uz: "kinoteatr saytida — «Seans jadvali»", ru: "на сайте кинотеатра — «Расписание сеансов»" } },
  { front: { uz: "Har imkoniyat qaysi savolga javob berishi kerak?", ru: "На какой вопрос должна отвечать каждая возможность?" }, back: { uz: "«Bu kimning qaysi qiyinchiligini yo'qotadi?»", ru: "«Чью и какую трудность это убирает?»" }, note: { uz: "har juftlik shu savol bilan tekshiriladi", ru: "каждая пара проверяется этим вопросом" } },
  { front: { uz: "Qiyinchiligi topilmagan imkoniyat nima bo'ladi?", ru: "Что происходит с возможностью без трудности?" }, back: { uz: "Ro'yxatdan chiqariladi", ru: "Её убирают из списка" }, note: { uz: "u hech kimga foyda bermaydi", ru: "она никому не приносит пользы" } },
  { front: { uz: "Juftlik-karta nimalardan iborat?", ru: "Из чего состоит карточка-пара?" }, back: { uz: "Ikki bo'lakdan: qiyinchilik va uni yo'qotadigan imkoniyat", ru: "Из двух частей: трудность и возможность, которая её убирает" }, note: { uz: "«film qachon boshlanishini bilmaydi» ↔ «Seans jadvali»", ru: "«не знает, когда начинается фильм» ↔ «Расписание сеансов»" } },
  { front: { uz: "Imkoniyat sifat bilan yozilsa nima bo'ladi?", ru: "Что будет, если записать возможность прилагательным?" }, back: { uz: "Sayt nima qilishi noma'lum qoladi", ru: "Останется неизвестным, что делает сайт" }, note: { uz: "shuning uchun harakat bilan yoziladi", ru: "поэтому её пишут действием" } },
  { front: { uz: "Bitta qiyinchilikka nechta imkoniyatdan boshlanadi?", ru: "Со скольких возможностей начинают одну трудность?" }, back: { uz: "Bittadan", ru: "С одной" }, note: { uz: "har imkoniyat o'z qiyinchiligiga qaraydi", ru: "каждая возможность смотрит на свою трудность" } },
  { front: { uz: "Uzum ishni nimadan boshlagan?", ru: "С чего начал Uzum?" }, back: { uz: "O'z yetkazib berish xizmatidan", ru: "Со своей службы доставки" }, note: { uz: "mashinalar va topshirish punktlari", ru: "машины и пункты выдачи" } },
  { front: { uz: "Nima uchun Uzum yetkazib berishdan boshlagan?", ru: "Почему Uzum начал с доставки?" }, back: { uz: "Eng katta qiyinchilik shu edi", ru: "Это была самая большая трудность" }, note: { uz: "olgan narsasi qo'liga qanday yetib kelishi", ru: "как купленное доберётся до рук" } },
  { front: { uz: "«Unicorn» nima degani?", ru: "Что означает «единорог»?" }, back: { uz: "1 milliard dollardan yuqori baholangan kompaniya", ru: "Компания, оценённая дороже 1 миллиарда долларов" }, note: { uz: "Uzum — mamlakatning birinchisi, 2024-yil mart", ru: "Uzum — первый в стране, март 2024 года" } },
  { front: { uz: "Kinoteatr egasi yangi imkoniyat so'rasa, birinchi nima qilinadi?", ru: "Если владелец кинотеатра просит новую возможность — что первым?" }, back: { uz: "Qaysi qiyinchilikni yo'qotishi so'raladi", ru: "Спрашивают, какую трудность она убирает" }, note: { uz: "javob topilmasa, imkoniyat kutib turadi", ru: "нет ответа — возможность подождёт" } },
  { front: { uz: "Juftlik sahifada qanday ko'rsatiladi?", ru: "Как пара показывается на странице?" }, back: { uz: "Ro'yxat bandi bilan", ru: "Пунктом списка" }, note: { uz: "qalin imkoniyat nomi, tiredan keyin qiyinchilik", ru: "жирное название возможности, после тире — трудность" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect2(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: "Yakunlash →", ru: "Завершить →" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PM4_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var RECAP_LINES = [
  { uz: "Har bir imkoniyat bitta qiyinchilikning javobi bo'ladi.", ru: "Каждая возможность — это ответ на одну трудность." },
  { uz: "Qiyinchiligi topilmagan imkoniyat ro'yxatdan chiqariladi.", ru: "Возможность, для которой не нашлось трудности, убирается из списка." },
  { uz: "Imkoniyat sayt nima qilishini aytadigan harakat bilan yoziladi.", ru: "Возможность пишется действием, которое говорит, что делает сайт." },
  { uz: "Eng katta internet-magazinlar ham eng og'ir qiyinchilikdan boshlagan.", ru: "Даже самые большие интернет-магазины начинали с самой тяжёлой трудности." }
];
var ScreenSummary = ({ screen, answers, onReset, onPrev, onFinish }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorL = !!(live && live.mode === "mentor");
  const isLiveLesson = !!(live && (live.mode === "mentor" || live.mode === "student" && live.status !== "ended"));
  const correct = SCORED_IDX.filter((i) => answers[i] && answers[i].correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const earned = useContext(AchCtx);
  const achTotal = Object.keys(ACHIEVEMENTS).length;
  const achGot = earned ? earned.size : 0;
  const [arena, setArena] = useState2(false);
  const [arenaSolo, setArenaSolo] = useState2(false);
  const quizSt = live && live.quiz && live.quiz.state || "off";
  const isStudentL = !!(live && live.mode === "student");
  const classOver = !!(live && (live.status === "ended" || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== "done";
  const studentLive = isStudentL && !studentSolo && quizSt !== "off";
  const studentWait = isStudentL && !studentSolo && quizSt === "off";
  const openArena = async () => {
    if (isMentorL && quizSt === "off") {
      try {
        await live.quizControl("lobby", -1);
      } catch (_e) {
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const [openHw, setOpenHw] = useState2(false);
  const [charge, setCharge] = useState2(false);
  const fire = () => {
    if (charge || openHw) return;
    setCharge(true);
    setTimeout(() => {
      setOpenHw(true);
      setCharge(false);
    }, 500);
  };
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash", ru: "Завершить" })}</button></>}>
      <div className="screen">
        <div className="hero">
          <div className="hero-l">
            <span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> {tr2({ uz: "Juftlik-kartalaringiz tayyor", ru: "Ваши карточки-пары готовы" })}</span>
            <h2 className="title h-title fade-up d1">{isLiveLesson ? tr2({ uz: <>Bugun har imkoniyatni <span className="italic" style={{ color: T.accent }}>o'z qiyinchiligiga</span> qo'shishni o'rgandik.</>, ru: <>Сегодня мы научились ставить каждую возможность <span className="italic" style={{ color: T.accent }}>к своей трудности</span>.</> }) : tr2({ uz: <>Endi siz har imkoniyatni <span className="italic" style={{ color: T.accent }}>o'z qiyinchiligiga</span> qo'sha olasiz.</>, ru: <>Теперь вы можете ставить каждую возможность <span className="italic" style={{ color: T.accent }}>к своей трудности</span>.</> })}</h2>
            {
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        {
    /* ⚔️ CodeStrike — yakun sahifasining birinchi harakati (P0 naqshi) */
  }
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : void 0} />
        </div>
        {
    /* F-0803-07 — YAKUN TARTIBI PmLesson2 ETALONIGA TENGLASHTIRILDI:
       hero → CodeStrike → «Endi siz bilasiz» (to'liq enli) → «Uyga vazifa» kapsulasi.
       «📒 Juftliklaringiz» kartasi OLIB TASHLANDI (foydalanuvchi qarori): o'quvchi o'z
       juftliklarini ustaxona va sahifa-ekranlarida allaqachon ko'rgan — yakunda takror. */
  }
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: "inline-flex" }}>{Ico.check(15)}</span> {tr2({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP_LINES.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: "inline-flex" }}>{Ico.check(15)}</span><span>{tr2(r)}</span></li>)}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${charge ? "charging" : ""}`} onClick={fire}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, "--d": `${k.d}s` }}>{tr2(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr2({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span>
            <span className="hw-big-s">{tr2({ uz: "Amaliy topshiriqni bajarish →", ru: "Выполнить практическое задание →" })}</span>
          </button>
        </div>
        {openHw && <div className="card hw fade-step">
            <ul>{HW_ROWS.map((r, i) => <li key={i}><b>{tr2(r.b)}:</b> <span className="t">{tr2(r.t)}</span></li>)}</ul>
            <ol className="hw-steps">{HW_STEPS.map((s, i) => <li key={i}><span className="hw-n">{i + 1}</span>{tr2(s)}</li>)}</ol>
            <p className="hw-note">{tr2({ uz: "Qisqa variant: kodingni tugating (uchala shart ✓) va ustaxonaga bitta yangi juftlik qo'shing.", ru: "Короткий вариант: допишите код (все три условия ✓) и добавьте в мастерскую одну новую пару." })}</p>
          </div>}
        {!isMentorL && <div className="card ach-coll fade-up d4">
          <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz", ru: "🏅 Ваши награды" })} — {achGot}/{achTotal}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(earned && earned.has(id));
    return <div key={id} className={`ach-badge ${got ? "got" : "locked"}`} title={tr2(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : "🔒"}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr2(a.desc)}</span>}
              </div>;
  })}
          </div>
        </div>}
      </div>
    </Stage>;
};
function AchCelebrate({ ach, onDone }) {
  useEffect2(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr2({ uz: `Yangi nishon: ${ach.name}`, ru: `Новая награда: ${ach.name}` })}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">{ach.icon}<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="acu-spark" style={{ "--a": `${i * (360 / 14)}deg`, animationDelay: `${0.18 + i % 5 * 0.05}s` }}>✦</span>)}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{ach.name}</span>
          {ach.desc && <span className="acu-desc">{tr2(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr2({ uz: "bosib davom eting", ru: "нажмите, чтобы продолжить" })}</span>
      </div>
    </div>;
}
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}
var CsNeonBolt = ({ flip }) => <span className={`csn-boltwrap ${flip ? "flip" : ""}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>;
var CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState2(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true);
    setTimeout(onClick, 430);
    setTimeout(() => setCharge(false), 900);
  };
  return <div
    className={`cs-cap ${clickable ? "cs-clickable" : ""} ${disabled ? "cs-off" : ""} ${liveOn ? "cs-live" : ""} ${charge ? "cs-charging" : ""}`}
    {...clickable ? { role: "button", tabIndex: 0, onClick: fire, onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fire();
      }
    } } : {}}
  >
      <span className="cs-ring" aria-hidden="true" />
      <div className="cs-sky" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className={`cs-tok ${i % 2 ? "back" : "front"}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, "--d": `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{tr2(s.ch)}</span>)}
        {[[14, 30, 24], [38, 66, 15], [57, 20, 27], [76, 60, 18], [88, 36, 13]].map(([l, t, w], i) => <i key={i} className="cs-dash" style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `-${i * 1.7}s` }} />)}
        <span className="cs-thunder" />
      </div>
      <div className="cs-row">
        {bolt && <CsNeonBolt />}
        <div className="cs-word" data-text="CODE STRIKE" aria-label="CodeStrike">CODE STRIKE</div>
        {bolt && <CsNeonBolt flip />}
      </div>
      {stats && <div className="cs-hud">
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr2({ uz: "SAVOL", ru: "ВОПРОСОВ" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1e3}</b> {tr2({ uz: "SONIYA", ru: "СЕКУНД" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>;
};
function PmLesson4({ lang: langProp, onFinished }) {
  const lang = langProp || "uz";
  __lang2 = lang;
  const savedRef = useRef2(void 0);
  if (savedRef.current === void 0) {
    const p = progRead(LESSON_META.lessonId, TOTAL_SCREENS);
    if (p) {
      const li = LIVE_ENABLED ? liveRead(LESSON_META.lessonId) : null;
      if (li && li.mode === "student" && typeof li.lastScreen === "number")
        p.screen = Math.min(p.screen || 0, Math.max(0, li.lastScreen - 1));
    }
    savedRef.current = p;
  }
  const saved = savedRef.current;
  const [screen, setScreen] = useState2(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState2(() => saved && saved.answers || {});
  const startTimeRef = useRef2(saved && saved.startedAt || Date.now());
  const earnedRef = useRef2(new Set(saved && saved.earned || []));
  const [earned, setEarned] = useState2(() => new Set(saved && saved.earned || []));
  const [achToasts, setAchToasts] = useState2([]);
  const achKeyRef = useRef2(0);
  const earn = useCallback((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  useEffect2(() => {
    const upd = () => {
      const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1e3)));
      document.documentElement.style.setProperty("--lz", String(Math.round(z * 1e3) / 1e3));
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  const FLASH_IDX = SCREEN_META.findIndex((m) => m.id === "s17");
  const flashHidden = () => live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const next = () => setScreen((s) => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  const prev = () => setScreen((s) => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers((a) => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === "final" && _m.template !== "MCScreen" && data && data.correct && live.mode === "student") live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => {
    progClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    startTimeRef.current = Date.now();
  };
  useEffect2(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect2(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const scoredMeta = SCREEN_META.filter((s) => s.scored);
    const finalMeta = scoredMeta.filter((s) => s.scope === "final");
    const scoredAnswers = SCREEN_META.map((s, i) => s.scored ? answers[i] : null).filter(Boolean);
    const correctAnswers = scoredAnswers.filter((a) => a.correct).length;
    const finalCorrect = SCREEN_META.map((s, i) => s.scored && s.scope === "final" ? answers[i] : null).filter(Boolean).filter((a) => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null,
      livePin: live.pin || null,
      liveMode: live.mode,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1e3),
      totalQuestions: scoredMeta.length,
      correctAnswers,
      scorePercent: scoredMeta.length ? Math.round(correctAnswers / scoredMeta.length * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false,
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === "function") onFinished(payload);
  };
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenWorkshop, Screen9, ScreenClean, ScreenCoding, Screen12, Screen13, ScreenPodium, ScreenFlashcards, ScreenSummary];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* F-0803-07 — uyga vazifa KAPSULASI PmLesson2 etalonidan qaytarildi
           (foydalanuvchi qarori: yakun tartibi PmLesson2 day bo'lsin). */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        /* 1) Tashqi aura — kapsula orqasidagi nafas oluvchi binafsha nur-gardish */
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        /* 2) Suzuvchi xira tokenlar — dars so'zlari kapsula osmonida */
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        /* 3) Zaryad-effekt — bosilganda kapsula yorishib "otiladi" */
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
        .hw-cta-note { margin: 9px 0 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; }

        /* MOBIL: yig'iladigan Mentor */
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
        .mstats-reveal:hover { background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
        .mstats-reveal.ready { background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
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
        .mstats-chip.ansc { background: rgba(14,134,196,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
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
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }

        /* ===== 🛠 KODING — praktika-panel, aylantirish-vizual va TO'LIQ-EKRAN KOMPILYATOR ===== */
        /* 🔓 Takrorlash-yo'li: JIM matn-havola. Ataylab tugma EMAS va ataylab xira —
           asosiy harakat (kompilyatorni ochish) bilan raqobatlashmasin, faqat kerak
           bo'lganga ko'rinsin. Hoverda aniqlashadi. */
        .stq-skip { margin-top: 2px; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
        .stq-skip:hover { color: ${T.accent}; }

        /* Aylantirish-vizual: teg-skelet ➜ yig'ilgan sahifa (bu darsning O'Z ko'rinishi) */
        .stq { display: flex; align-items: center; gap: clamp(10px,1.8vw,18px); }
        @media (max-width: 760px) { .stq { flex-direction: column; align-items: stretch; } .stq-arrow { transform: rotate(90deg); align-self: center; } }
        .stq-code { flex: 1; min-width: 0; border-radius: 14px; overflow: hidden; background: #10141F; box-shadow: 0 12px 28px -12px rgba(${T.shadowBase},0.4); }
        .stq-code-bar { display: flex; align-items: center; gap: 8px; background: #141C2B; padding: 8px 13px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #7E92B4; }
        .stq-code-body { display: flex; flex-direction: column; padding: clamp(12px,1.8vw,18px) clamp(14px,2vw,20px); font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.4vw,13.5px); line-height: 1.75; }
        .stq-l { white-space: pre; }
        .stq-l.t { color: #FFD8A8; } .stq-l.m { color: #A9C7FF; } .stq-l.f { color: #B6F0C8; } .stq-l.dim { color: #6C7A94; }
        .stq-arrow { font-size: clamp(20px,2.8vw,28px); color: ${T.accent}; flex-shrink: 0; }
        .stq-page { flex: 1; min-width: 0; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; display: flex; flex-direction: column; }
        .stq-pbar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .stq-purl { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; }
        .stq-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .stq-cta-sub { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-align: center; }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }

        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid ${T.amber}; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(${T.shadowBase},0.08); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line || T.ink3 + "33"}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        /* === 🔔 NAVBAT-PULSI (88-qonun · 1-C bo'lim) — etalondan aynan ko'chirildi === */
        .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
        /* Tugmadan boshqa elementlar uchun (chip, karta, zona): halqa ALOHIDA qatlamda chiziladi —
           elementning o'z soyasi/foniga tegmaydi va layout'ni surmaydi (pointer-events yo'q). */
        .turn-ring { position: relative; }
        .turn-ring::after {
          content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
          border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
        }
        @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
        /* Navbat TO'LQINI: bir guruh variant birma-bir yonadi. Kechikishlar shunday tanlanganki,
           istalgan lahzada FAQAT BITTASI ko'rinadi (har biri ~0.4s, kechikish 0.7s). Cheklangan
           (4 aylanish) — sekin o'qiydigan o'quvchi peripheral harakatdan charchamasin. */
        .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
        @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
        .turn-wave.w2::after { animation-delay: 0.7s; }
        .turn-wave.w3::after { animation-delay: 1.4s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }

        /* === KNOPKALAR === */
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FBFAFE; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }


        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(${T.shadowBase},0.16); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(${T.shadowBase},0.16); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }

        /* Kod-oyna / brauzer-oynachasi svetoforchasi (s11 · kompilyator) */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .lock { color: ${T.success}; font-size: 8px; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; } .ta-bulb { } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { display: inline-flex; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; flex-shrink: 0; margin-top: 1px; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

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
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(${T.shadowBase},0.22); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
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

        /* ===== ⚡ CODESTRIKE — CTA (yakun sahifasida) ===== */
        /* CodeStrike CTA konteyneri (ko'rinishni .cs-cta neon-kapsulasi beradi) */
        .qz-cta { display: flex; flex-wrap: wrap; }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(91,61,230,0.14) 0%, rgba(91,61,230,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
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
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(91,61,230,0.32)); }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
        .qz-sub b { color: #F2ECFF; }
        .qz-dimtxt { color: #8C86A8; font-family: 'Manrope'; font-size: 14px; font-style: italic; }
        .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
        .qz-pchip { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(186,140,255,0.34); color: #F2ECFF; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; box-shadow: 0 0 18px rgba(124,58,237,0.2); animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#5B3DE6); color: #fff; border-color: transparent; box-shadow: 0 0 22px rgba(91,61,230,0.45); }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#5B3DE6); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px rgba(91,61,230,0.6), inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
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
        .pod-col.me .pod-name { color: ${T.accent}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.accent}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.accentSoft}; outline: 1.5px solid ${T.accent}55; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.success}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }
        /* pod-qstats/qstat-* CSS ATAYLAB YO'Q — 90-qonun (10-B): karta bilan birga qoldiqsiz olib tashlandi. */


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(14,134,196,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(14,134,196,0.22); }

        /* === .qcode kod-chip (backtick) — CHIP STILI → Dizayn === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(${T.shadowBase},0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode, .qz-opt .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* === 🃏 FLASHCARDS (3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        .fc-fly { position: relative; animation: fc-in 0.3s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
        .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
        .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
        @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
        @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
        .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
        .fc-fly.out-knew::after { content: '✓'; background: ${T.success}; box-shadow: 0 10px 26px -8px ${T.success}; }
        .fc-fly.out-again::after { content: '✗'; background: ${T.accent}; box-shadow: 0 10px 26px -8px ${T.accent}; }
        @keyframes fc-stamp { from { transform: translate(-50%,-50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
        .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
        .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
        .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
        .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; min-height: 48px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 NISHON — yuqori panel hisoblagichi + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        /* === Jonli-dars xabari — sekundar UI, xira (11.15) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          background: radial-gradient(circle at 50% 42%, rgba(20,14,6,0.34) 0%, rgba(10,8,14,0.72) 62%, rgba(8,6,12,0.86) 100%);
          animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
        @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acu-bg-out { to { opacity: 0; } }
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
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

        /* Summary — 🏅 nishonlar kolleksiyasi */


        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Kapsula IXCHAM: so'z kattaligi o'zgarmaydi, faqat ichki bo'shliq qisqaradi (P0 qarori). */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
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

        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } .fc-fly, .acu-medal, .acu-rays { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }

        /* === K11 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(${T.shadowBase},0.22); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .kp-bet::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: repeating-linear-gradient(90deg, ${T.accent} 0 14px, ${T.accentSoft} 14px 22px); }
        .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); padding: 12px 18px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
        .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
        /* press-holat: bosilganda ichkariga cho'kadi (tap affordance) */
        .kp-chip:active { transform: translateY(0) scale(0.94); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .kp-ic { font-size: 19px; }
        /* taxmin natijasi: topdi = yashil · topmadi = NEYTRAL indigo (qizil EMAS — bu ball emas, o'yin) */
        .kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
        .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
        /* reveal: yumshoq indigo glow-to'lqin */
        .k-slide.revealed { animation: fade-step 0.3s ease-out, kp-glow 0.9s ease-out; }
        @keyframes kp-glow { 0% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 0 rgba(91,61,230,0.4); } 70% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 16px rgba(91,61,230,0); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover, .kp-chip:active { transition: none; transform: none; } .k-slide.revealed, .kp-res { animation: none; } }

        /* === USTAXONA: maydon-uslublari (smini-f/swcard-fields — muharrirda ishlatiladi) === */
        @keyframes card-fill-pop { 0% { transform: scale(1); } 40% { transform: scale(1.012) translateY(-2px); } 100% { transform: scale(1); } }
        .smini-f { display: flex; flex-direction: column; gap: 4px; }
        .smini-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .smini-f input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; }
        .smini-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .smini-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        /* === USTAXONA v3: bittalab-muharrir (swed) + saqlanganlar-daftari (svd) === */
        /* JTBD-portlar (F-0727-58): havodagi 1-2-3 indikator + rangli inputlar */
        .jw-steps { display: flex; align-items: flex-start; justify-content: center; gap: 12px; padding: 2px 0 4px; }
        .jws { display: inline-flex; flex-direction: column; align-items: center; gap: 5px; min-width: 80px; }
        .jws-n { width: clamp(38px,4.6vw,44px); height: clamp(38px,4.6vw,44px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(15px,1.8vw,18px); font-style: normal; color: ${T.ink3}; border: 2px dashed ${T.ink3}55; background: ${T.paper}; transition: all 0.3s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .jws-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(10.5px,1.3vw,12px); font-style: normal; color: ${T.ink3}; max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .jws.cur .jws-n { border-style: solid; border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; animation: jws-pulse 1.6s ease-in-out infinite; }
        .jws.cur .jws-t { color: ${T.accent}; }
        @keyframes jws-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
        /* Navbat maydonlarda yurayotganda qadam-indikatori tinch turadi (88-qonun (a): lahzada bitta) */
        .jw-steps.turn-quiet .jws.cur .jws-n { animation: none; }
        .jws.on .jws-n { border-style: solid; border-color: ${T.success}; background: ${T.success}; color: #fff; }
        .jws.on .jws-t { color: ${T.success}; }
        /* KUTAYOTGAN qadam ataylab xira — ko'z HOZIRGI qadamga boradi (F-0803-01) */
        .jws.wait { opacity: 0.45; }
        .svd.full { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        @media (prefers-reduced-motion: reduce) { .jws.cur .jws-n { animation: none; } }
        .swed { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; gap: 13px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.2); border-left: 5px solid ${T.accent}; }
        .swed-tag { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 99px; color: ${T.accent}; background: ${T.accentSoft}; }
        /* Gap-slotlari formula-konstruktor (s3) ranglarida: bo'sh = xira-punktir, to'lgan = o'z rangi */
        /* F-0803-01 — YOZUVGA JAVOB: xato (binafsha, savol) va tasdiq (yashil) bir joyda,
           forma OSTIDA — o'quvchi yozgan zahoti javob o'sha yerdan chiqadi. */
        /* klass ikki marta — F-0803-27, sabab «.oc-pain.oc-pain» izohida */
        .swed-fb.swed-fb { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; line-height: 1.45; border-radius: 10px; padding: 10px 13px; }
        .swed-fb.bad { color: ${T.accent}; background: ${T.accentSoft}; }
        .swed-fb.ok { color: ${T.success}; background: ${T.successSoft}; }
        .swed-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
        .swed-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .swed-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .svd { background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 16px; padding: 15px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.16); }
        .svd-card { background: ${T.successSoft}; border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 6px; box-shadow: inset 0 0 0 1.5px ${T.success}44; animation: card-fill-pop 0.42s cubic-bezier(.34,1.5,.4,1); }
        .svd-card.editing { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        @media (prefers-reduced-motion: reduce) { .svd-card { animation: none; } }
        .svd-top { display: flex; align-items: center; gap: 8px; }
        .svd-num { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.success}; }
        .svd-edit { margin-left: auto; background: ${T.paper}; border: none; border-radius: 8px; padding: 0 10px; height: 28px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; white-space: nowrap; color: ${T.ink2}; cursor: pointer; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); transition: color 0.15s, transform 0.15s; }
        .svd-edit:hover { color: ${T.accent}; transform: scale(1.08); }
        .svd-sent { font-size: 13.5px; color: ${T.ink2}; line-height: 1.45; margin: 0; overflow-wrap: anywhere; }
        .svd-sent b { color: ${T.ink}; font-weight: 600; }
        /* === TEKSHIRUVCHI STOLI: bitta katta namuna-karta → hukm → sabab-chip → xulosa-strip === */

        /* === 🧑‍🏫 MENTORGA ESLATMA (proyektor-sir) === */
        .mnote { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        .lp-mstats { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }

        /* === s0 HOOK — ikki ro'yxat yonma-yon === */
        .hk-row { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px,2vw,20px); }
        @media (max-width: 700px) { .hk-row { grid-template-columns: 1fr; } }
        .hk-card { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(15px,2.4vw,22px); cursor: pointer; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.22); transition: transform 0.18s, box-shadow 0.18s, opacity 0.25s; min-width: 0; }
        .hk-card:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 16px 32px -12px rgba(${T.shadowBase},0.3); }
        .hk-card:disabled { cursor: default; }
        .hk-card.picked { box-shadow: inset 0 0 0 2.5px ${T.accent}, 0 14px 30px -12px rgba(91,61,230,0.4); }
        .hk-card.dim { opacity: 0.5; }
        .hk-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2vw,18px); color: ${T.ink}; }
        .hk-items { display: flex; flex-direction: column; gap: 7px; width: 100%; min-width: 0; }
        .hk-it { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
        .hk-it i { font-style: normal; font-size: 16px; }
        .hk-vote { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 13px; }
        .hk-card.picked .hk-vote { color: #fff; background: ${T.accent}; }

        /* === s1 JUFTLIK-LENTA — natija-preview o'z-o'zidan yoziladi === */
        .jl { display: flex; flex-direction: column; gap: 10px; }
        .jl-row { display: grid; grid-template-columns: auto minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 10px; background: ${T.paper}; border-radius: 14px; padding: 12px 15px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); opacity: 0; animation: jl-in 0.45s cubic-bezier(.2,.7,.2,1) forwards; animation-delay: var(--rd, 0.2s); min-width: 0; }
        @keyframes jl-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .jl-n { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .jl-pain, .jl-feat { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.6vw,14.5px); border-radius: 10px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; opacity: 0; animation: jl-fill 0.5s cubic-bezier(.3,1.4,.45,1) forwards; animation-delay: var(--fd, 0.5s); }
        .jl-pain { color: ${T.amberInk}; background: ${T.amberSoft}; }
        .jl-feat { color: ${T.success}; background: ${T.successSoft}; }
        .jl-link { font-size: 17px; color: ${T.ink3}; opacity: 0; animation: jl-fill 0.4s ease forwards; animation-delay: var(--fd, 0.7s); }
        @keyframes jl-fill { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
        @media (max-width: 700px) { .jl-row { grid-template-columns: auto minmax(0,1fr); } .jl-link { display: none; } }
        @media (prefers-reduced-motion: reduce) { .jl-row, .jl-pain, .jl-feat, .jl-link { animation: none; opacity: 1; transform: none; } }

        /* === s2 OCHILADIGAN KARTALAR === */
        .oc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 700px) { .oc-grid { grid-template-columns: 1fr; } }
        .oc { background: ${T.paper}; border-radius: 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); overflow: hidden; min-width: 0; }
        .oc.seen { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 8px 20px -10px rgba(${T.shadowBase},0.2); }
        .oc-top { position: relative; width: 100%; display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 13px 15px; cursor: pointer; text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; }
        .oc-ic { font-size: 19px; }
        .oc-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .oc-arw { color: ${T.ink3}; font-size: 13px; transition: transform 0.25s ease; }
        .oc.on .oc-arw { transform: rotate(0deg); }
        .oc-top:hover { background: ${T.accentSoft}55; }
        .oc-top:active { transform: scale(0.99); }
        /* Ochilgan matn — QIYINCHILIK, shuning uchun amber (s1/s4/s8 bilan bir xil rang). */
        /* 🔴 F-0803-27 — KLASS IKKI MARTA YOZILGANI ATAYLAB (o'chirmang!): bu <p> elementi,
           yuqoridagi «.lesson-root p { margin:0; padding:0 }» reseti esa aniqligi bo'yicha
           (0,1,1) — bitta klassli qoidadan (0,1,0) KUCHLI. Ya'ni bir marta yozilsa, brauzer
           bu yerdagi margin/padding'ni JIMGINA o'chiradi (fon va burchak qoladi — shuning
           uchun blok «yarim buzuq» ko'rinadi). «.oc-pain.oc-pain» — aniqlik (0,2,0), aynan
           o'sha elementlarni tanlaydi, lekin resetdan ustun turadi. */
        .oc-pain.oc-pain { margin: 0 15px 14px; padding: 9px 12px; border-radius: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.amberInk}; background: ${T.amberSoft}; min-width: 0; overflow-wrap: anywhere; }
        /* Javobi yo'q imkoniyat: fon sahifa foni bilan bir xil bo'lsa, matn kartadan
           tashqarida suzganday ko'rinardi (F-0803-27) — endi ingichka uzuq ramka bilan. */
        .oc-pain.empty { color: ${T.ink3}; background: transparent; border: 1.5px dashed ${T.ink3}66; font-style: italic; }

        /* === s4 JUFTLASH (sudrab-ulash) === */
        .mt-wrap { display: flex; flex-direction: column; gap: 12px; }
        .mt-rows { display: flex; flex-direction: column; gap: 9px; }
        .mt-row { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: center; background: ${T.paper}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); cursor: pointer; min-width: 0; }
        .mt-row.filled { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 8px 20px -10px rgba(${T.shadowBase},0.18); cursor: default; }
        .mt-row.shake { animation: mt-shake 0.42s; }
        @keyframes mt-shake { 0%,100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .mt-pain { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.amberInk}; background: ${T.amberSoft}; border-radius: 10px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; }
        .mt-slot { display: flex; min-width: 0; }
        .mt-empty { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; border: 1.5px dashed ${T.ink3}66; border-radius: 10px; padding: 9px 12px; width: 100%; text-align: center; }
        .mt-pool { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; background: ${T.bg}; border-radius: 14px; padding: 12px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .mt-pool-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; width: 100%; }
        .mt-chip { position: relative; display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 99px; padding: 10px 16px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; overflow-wrap: anywhere; }
        .mt-chip i { font-style: normal; font-size: 16px; }
        /* F-0802-13 — SUDRALADIGAN KARTA: chip emas, ushlanadigan karta (katta ikona + nom + tavsif).
           Qatorga tushgach .mt-chip.in ga aylanadi — kichrayishi «joyiga o'tirdi» degan javob. */
        .mt-card { display: flex; align-items: center; gap: 12px; text-align: left; font-family: 'Manrope', sans-serif; background: ${T.paper}; border: none; border-radius: 14px; padding: 12px 15px; cursor: pointer; flex: 1 1 230px; min-width: 0; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 8px 20px -10px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; position: relative; }
        .mt-card:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.line}, 0 14px 26px -10px rgba(${T.shadowBase},0.3); }
        .mt-card-ic { font-size: 30px; line-height: 1; flex-shrink: 0; }
        .mt-card-tx { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .mt-card-t { font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; }
        .mt-card-d { font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.35; color: ${T.ink3}; overflow-wrap: anywhere; }
        .mt-card.held { background: ${T.accent}; box-shadow: 0 12px 26px -8px rgba(91,61,230,0.55); animation: mt-held 1.5s ease-in-out infinite; }
        .mt-card.held .mt-card-t { color: #fff; }
        .mt-card.held .mt-card-d { color: #FFFFFFCC; }
        .mt-chip:hover { transform: translateY(-2px); }
        .mt-chip.held { background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55); animation: mt-held 1.5s ease-in-out infinite; }
        @keyframes mt-held { 0%,100% { box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55), 0 0 0 0 rgba(91,61,230,0.35); } 60% { box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55), 0 0 0 8px rgba(91,61,230,0); } }
        /* Qo'yilgan karta = IMKONIYAT (yashil) + snap-pop */
        .mt-chip.in { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: mt-snap 0.36s cubic-bezier(.34,1.5,.4,1); }
        @keyframes mt-snap { 0% { transform: scale(0.82); } 60% { transform: scale(1.06); } 100% { transform: none; } }
        /* Drop-zona affordance: karta qo'lda turganda faqat bo'sh zonalar yorishadi */
        .mt-wrap.holding .mt-row:not(.filled) { box-shadow: inset 0 0 0 1.5px ${T.accent}55, 0 8px 20px -10px rgba(91,61,230,0.35); animation: mt-zone 1.7s ease-in-out infinite; }
        @keyframes mt-zone { 0%,100% { filter: none; } 55% { filter: brightness(1.03) saturate(1.06); } }

        /* === s7 TANLASH-RO'YXATI === */
        .pk-list { display: flex; flex-direction: column; gap: 8px; }
        /* F-0802-17 — TANLOV SEZILARLI BO'LSIN: butun qator bosiladi (u allaqachon <button>),
           tanlangach fon + halqa + ko'tarilish birga o'zgaradi va belgi «chiqib» keladi.
           Rang ATAYLAB binafsha (accent) — yashil bu darsda IMKONIYAT ma'nosini bildiradi
           (12-qatordagi amber/yashil semantikasi), qiyinchilikka yopishtirib bo'lmaydi. */
        .pk-row { display: flex; align-items: center; gap: 11px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 13px 15px; cursor: pointer; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.2); font-family: 'Manrope'; font-weight: 600; font-size: clamp(13.5px,1.7vw,15.5px); line-height: 1.4; color: ${T.ink}; min-width: 0; transition: background 0.2s, box-shadow 0.2s, transform 0.2s; }
        .pk-row:hover:not(.on) { background: #FBFAFE; transform: translateY(-1px); }
        .pk-row.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 24px -12px rgba(91,61,230,0.45); transform: translateY(-1px); }
        .pk-box { width: 24px; height: 24px; flex-shrink: 0; border-radius: 8px; border: 1.5px solid ${T.ink3}66; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: #fff; transition: background 0.18s, border-color 0.18s; }
        .pk-row.on .pk-box { background: ${T.accent}; border-color: ${T.accent}; animation: pk-pop 0.34s cubic-bezier(.34,1.56,.4,1); }
        @keyframes pk-pop { 0% { transform: scale(0.55); } 62% { transform: scale(1.18); } 100% { transform: none; } }
        .pk-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .pk-tag { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 99px; padding: 3px 9px; }
        .pk-count { align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 8px 17px; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: color 0.25s, background 0.25s, box-shadow 0.25s; }
        .pk-count-ic { font-size: 15px; color: ${T.ink3}; }
        .pk-count-n { font-size: clamp(16px,2vw,19px); color: ${T.accent}; }
        .pk-count.full { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .pk-count.full .pk-count-ic, .pk-count.full .pk-count-n { color: ${T.success}; }

        /* === s8 USTAXONA: juftlik-muharrir === */
        .pf-edit { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); gap: 10px; align-items: end; }
        @media (max-width: 620px) { .pf-edit { grid-template-columns: 1fr; } .pf-link { justify-self: center; } }
        .pf-link { font-size: 19px; color: ${T.ink3}; padding-bottom: 9px; transition: color 0.25s, transform 0.25s; }
        .pf-link.on { color: ${T.success}; transform: scale(1.15); }
        .smini-f.pain span { color: ${T.amberInk}; } .smini-f.feat span { color: ${T.success}; }
        .smini-f.pain input { box-shadow: inset 0 0 0 1.5px ${T.amber}66; }
        .smini-f.feat input { box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .smini-f.pain input:focus { box-shadow: inset 0 0 0 2px ${T.amber}; }
        .smini-f.feat input:focus { box-shadow: inset 0 0 0 2px ${T.success}; }

        /* === s10 RO'YXAT-TOZALASH === */
        .cl-list { display: flex; flex-direction: column; gap: 9px; }
        .cl-item { background: ${T.paper}; border-radius: 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); overflow: hidden; min-width: 0; }
        .cl-item.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 8px 20px -10px rgba(${T.shadowBase},0.2); }
        .cl-top { position: relative; width: 100%; display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 13px 15px; cursor: pointer; text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; }
        .cl-ic { font-size: 19px; }
        .cl-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .cl-ok { color: ${T.success}; font-weight: 900; }
        .cl-arw { color: ${T.ink3}; font-size: 13px; transition: transform 0.25s ease; }
        .cl-top:hover { background: ${T.accentSoft}55; }
        .cl-top:active { transform: scale(0.99); }
        .cl-ok { animation: mt-snap 0.36s cubic-bezier(.34,1.5,.4,1); }
        .cl-body { display: flex; flex-direction: column; gap: 9px; padding: 0 15px 14px; }
        /* Ochilgan matn — QIYINCHILIK (amber, s1/s4/s8 bilan bir xil). Qiyinchiligi yo'q band — xira-neytral. */
        /* klass ikki marta — F-0803-27, sabab «.oc-pain.oc-pain» izohida */
        .cl-pain.cl-pain { margin: 0; padding: 9px 12px; border-radius: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.amberInk}; background: ${T.amberSoft}; min-width: 0; overflow-wrap: anywhere; }
        .cl-pain.none { color: ${T.ink3}; background: transparent; border: 1.5px dashed ${T.ink3}66; font-style: italic; }
        .cl-shelf-btn { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 99px; padding: 7px 15px; cursor: pointer; transition: transform 0.16s, box-shadow 0.16s; }
        .cl-shelf-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px -6px rgba(91,61,230,0.4); }
        /* Maslahat/eslatma — indigo: amber bu darsda FAQAT qiyinchilik, qizil FAQAT haqiqiy xato. */
        .cl-warn.cl-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 8px 11px; animation: fade-step 0.28s ease-out; }
        .cl-shelf { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; border: 1.5px dashed ${T.ink3}66; border-radius: 14px; padding: 12px 14px; }
        .cl-shelf-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; width: 100%; }
        .cl-shelf-empty { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        .cl-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 8px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; overflow-wrap: anywhere; }

        /* === s11 KODING: o'z juftliklari preview === */
        .stq-mine { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; }
        .stq-mine-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.accent}; }
        /* Juftlik-rangi s1/s4/s8/s10 bilan bir xil: imkoniyat = yashil, qiyinchilik = amber */
        .stq-mine-row { font-family: 'Manrope'; font-weight: 500; font-size: 12.5px; line-height: 1.45; color: ${T.amberInk}; min-width: 0; overflow-wrap: anywhere; }
        .stq-mine-row b { color: ${T.success}; font-weight: 700; }

        /* === s13 YAKUNIY SO'Z === */
        .rf-write { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); min-width: 0; }
        .rf-area { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 10px; padding: 11px 13px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; resize: vertical; width: 100%; min-width: 0; }
        .rf-area:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .rf-cnt { font-family: 'JetBrains Mono'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; }
        /* F-0803-03 — «AHA» LAHZASI: dars yozgandan KEYIN bitta qoida bilan yopiladi.
           Bu yagona joyda ekran hissiyot beradi — shuning uchun u boshqa bloklardan
           kattaroq va iliqroq (aksent-gradient), lekin ATIGI ikki qator. */
        .rf-aha { display: flex; flex-direction: column; gap: 8px; border-radius: 16px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,24px); background: linear-gradient(135deg, ${T.accentSoft} 0%, ${T.successSoft} 100%); box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .rf-aha-t { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.1vw,21px); line-height: 1.3; color: ${T.ink}; }
        .rf-aha-r { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink2}; }

        /* === s14 UYGA VAZIFA — qadamlar === */
        .hw-steps { list-style: none; display: flex; flex-direction: column; gap: 8px; margin: 12px 0 0; }
        .hw-steps li { display: flex; align-items: flex-start; gap: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; line-height: 1.45; min-width: 0; overflow-wrap: anywhere; }
        .hw-n { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }

        /* === HARAKATNI KAMAYTIRISH (prefers-reduced-motion) — bu darsning O'Z ekranlari: s2, s4, s8, s10, s11 ===
           Har og'ir harakat shu yerda o'chadi; ekran-kirish fade'lari ham tinchlanadi. */
        @media (prefers-reduced-motion: reduce) {
          .fade-up, .fade-step { animation: none !important; opacity: 1 !important; transform: none !important; }
          .mt-chip.held, .mt-card.held, .mt-chip.in, .mt-row.shake, .pk-row.on .pk-box, .cl-ok,
          .mt-wrap.holding .mt-row:not(.filled) { animation: none !important; }
          .mt-chip, .mt-chip:hover, .mt-card, .mt-card:hover, .mt-row, .oc-top, .oc-top:active, .cl-top, .cl-top:active,
          .cl-shelf-btn, .cl-shelf-btn:hover, .hk-card, .hk-card:hover, .pk-row, .pf-link,
          .oc-arw, .cl-arw, .swed-save, .swed-save:hover, .kod-launch-btn, .kod-launch-btn:hover,
          .svd-edit, .svd-edit:hover, .rc-open, .rc-open-mini { transition: none !important; transform: none !important; }
          .jws.cur .jws-n, .swed-save, .mstats-reveal.ready { animation: none !important; }
          .oc-pain, .cl-pain, .cl-warn, .done-mini { animation: none !important; }
        }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
          <div className="lesson-root">
            {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "2-Modul", ru: "Модуль 2" }} /> : <>
                <Current screen={screen} storedAnswer={answers[screen]} answers={answers} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
                <LiveBadge live={live} total={TOTAL_SCREENS} />
                {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
              </>}
          </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}
export {
  PmLesson4 as default
};
