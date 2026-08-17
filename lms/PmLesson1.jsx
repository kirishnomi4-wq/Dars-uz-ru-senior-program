// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/1-Modull/PmLesson1.jsx
//          src/compilator/HtmlCompiler.jsx
//  Qayta yig'ish:  npm run build:lms
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/1-Modull/PmLesson1.jsx
import React, { useState as useState2, useEffect as useEffect2, useRef as useRef2, useCallback, createContext, useContext, useState, useEffect, useLayoutEffect, useRef, useMemo, isValidElement } from "react";

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

// src/1-Modull/PmLesson1.jsx
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
  shadowBase: "40, 34, 82"
};
var AMBER = "#E8A13A";
var AMBER_SOFT = "rgba(232,161,58,0.14)";
var AMBER_INK = "#8F5F12";
var SLOT = { kim: "#0E86C4", muammo: AMBER_INK, yechim: "#12A968" };
var G = "'Source Serif 4', Georgia, serif";
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
var liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);
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
      setJoinError(tr2({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: "Неверный код ментора или ошибка соединения." }));
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
      setJoinError(tr2({ uz: "Ismingizni kiriting (kamida 2 harf).", ru: "Введите своё имя (минимум 2 буквы)." }));
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
var _liveBadgeS = { position: "fixed", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: "0 2px 10px rgba(40,34,82,0.12)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", maxWidth: "92vw" };
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
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(40,34,82,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  if (role === "mentor") {
    return <div style={wrap}><div style={card}>
      <div style={{ textAlign: "center" }}><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "0 0 4px" }}>{tr2({ uz: "🧑‍🏫 Mentor kirishi", ru: "🧑‍🏫 Вход для ментора" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor kodini kiriting.", ru: "Введите код ментора." })}</p></div>
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
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr2(gateTitle)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Darsga qo'shilish", ru: "Подключиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от ментора и своё имя." })}</p></div>
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
var AchCtx = createContext(null);
var __lang2 = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[__lang2] ?? node.uz ?? node.ru ?? "";
};
var uzOf = (x) => x && typeof x === "object" && !React.isValidElement(x) ? x.uz ?? "" : x;
var ouz = (arr) => Array.isArray(arr) ? arr.map(uzOf) : arr;
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
var sv = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
var Ico = {
  // Faqat ISHLATILADIGAN ikonkalar (brend-ikonkalar o'chirilgan ekranlar bilan birga olib tashlandi)
  user: (s = 22) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3.2-5.8 7-5.8s7 2.2 7 5.8" /></svg>,
  problem: (s = 22) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>,
  solution: (s = 22) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>,
  check: (s = 18) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>
};
var LESSON_META = { lessonId: "pm-m1d2-v1", lessonTitle: { uz: "Kim mening foydalanuvchim?", ru: "Кто мой пользователь?" } };
var DEMO_KEY = "ccDemoDay";
var demoRead = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || "null");
  } catch {
    return null;
  }
};
var demoWrite = (patch) => {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify({ ...demoRead() || {}, ...patch, savedAt: Date.now() }));
  } catch {
  }
};
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s2", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s3", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s4", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "skeys", type: "case", template: "custom", scored: false, scope: null },
  { id: "s5b", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s8", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "koding", type: "koding", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "sproj", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var Q_LABELS = {
  4: { uz: "1 — Sayt kim uchun", ru: "1 — Для кого сайт" },
  6: { uz: "2 — Hamma uchun", ru: "2 — «Для всех»" },
  9: { uz: "3 — Birinchi savol", ru: "3 — Первый вопрос" },
  11: { uz: "4 — To'liq karta", ru: "4 — Полная карточка" },
  13: { uz: "5 — O'z tanlovingiz ✍️", ru: "5 — Ваш выбор ✍️" }
};
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
var Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : void 0}>{children}</div>;
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
            <div className="chrome-left eyebrow"><span className="dot" /><span>{tr2(eyebrow)}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
  const key = pending.join("");
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
var NavNext = ({ disabled, label, onClick, optionalLive, turnBusy }) => {
  const nextLabel = label || { uz: "Davom etish", ru: "Продолжить" };
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  const isOff = (freeRide ? false : disabled) || locked;
  const hint = useTurnHint(!isOff && !turnBusy);
  return <button className={`btn-white-accent${hint ? " turn-hint" : ""}`} disabled={isOff} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2(nextLabel)}</button>;
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
  // idx 4 — s4: «Sayt birinchi navbatda nima uchun yaratiladi?» (nazariya: s2 kim uchun + s3 hamma uchun)
  4: {
    title: { uz: "Sayt aniq odamlar uchun ochiladi", ru: "Сайт делают для конкретных людей" },
    cards: [
      {
        ic: "🎯",
        h: { uz: "Har bir sayt aniq odamlar guruhi uchun ishlaydi", ru: "Каждый сайт работает для конкретной группы людей" },
        body: { uz: <>Video sayti — bo'sh vaqtida qiziqarli narsa izlaydiganlar uchun. Xabar ilovasi — uzoqdagi yaqinlari bilan gaplashadiganlar uchun. Bu guruh saytning <b>auditoriyasi</b> deyiladi.</>, ru: <>Видеосайт — для тех, кто ищет интересное в свободное время. Мессенджер — для тех, кто общается с далёкими близкими. Эта группа называется <b>аудиторией</b> сайта.</> },
        vis: { uz: <RcFlow items={["👥 Aniq odamlar", "🌐 Sayt", "😊 Ular qaytib keladi"]} />, ru: <RcFlow items={["👥 Конкретные люди", "🌐 Сайт", "😊 Они возвращаются"]} /> },
        ask: { uz: "Sevimli saytingiz kimlar uchun qilingan deb o'ylaysiz?", ru: "Как думаете, для кого сделан ваш любимый сайт?" }
      },
      {
        ic: "🌯",
        h: { uz: "Lavash do'koni kartasi ham shunday boshlanadi", ru: "Карточка лавашной начинается так же" },
        body: { uz: <>KIM — tanaffusda lavash oladigan maktab o'quvchilari. Sayt ularga aniq gapiradi: <b>oldindan buyurtma qiling, navbatsiz oling</b>.</>, ru: <>КТО — школьники, которые берут лаваш на перемене. Сайт говорит им прямо: <b>закажите заранее, заберите без очереди</b>.</> },
        vis: { uz: <RcFlow items={["🎒 O'quvchi", "📱 Oldindan buyurtma", "🌯 Navbatsiz"]} />, ru: <RcFlow items={["🎒 Школьник", "📱 Заказ заранее", "🌯 Без очереди"]} /> },
        ask: { uz: "Lavash do'koni saytiga yana kimlar kirishi mumkin?", ru: "Кто ещё может зайти на сайт лавашной?" }
      },
      {
        ic: "🏆",
        h: { uz: "Mashhurlik — natija, sabab emas", ru: "Популярность — результат, а не причина" },
        body: { uz: <>Avval aniq odamlarning qiyinchiligi hal qilinadi, keyin ular o'zi kelaveradi. <b>Tartibni almashtirib bo'lmaydi.</b></>, ru: <>Сначала решают трудность конкретных людей — потом они приходят сами. <b>Порядок поменять нельзя.</b></> },
        vis: { uz: <RcFlow items={["✅ Qiyinchilik hal bo'ldi", "👥 Odamlar keldi", "⭐ Mashhurlik"]} />, ru: <RcFlow items={["✅ Трудность решена", "👥 Люди пришли", "⭐ Популярность"]} /> },
        ask: { uz: "Sevimli ilovangiz nima uchun mashhur bo'lgan deb o'ylaysiz?", ru: "Как думаете, почему ваше любимое приложение стало популярным?" }
      }
    ]
  },
  // idx 6 — s5b: «Hamma uchun sayt nega kam ishlaydi?» (nazariya: s3 sahna + keys)
  6: {
    title: { uz: "«Hamma uchun» — hech kim uchun", ru: "«Для всех» — значит ни для кого" },
    cards: [
      {
        ic: "🤷",
        h: { uz: "«Hamma uchun» sayt hech kimga aniq gapirmaydi", ru: "Сайт «для всех» ни с кем не говорит прямо" },
        body: { uz: <>Hammaga birdek yoqadigan sayt bo'lmaydi: bir xil gap o'quvchiga ham, ofis xodimiga ham to'g'ri kelmaydi — ikkisi ham <b>saytdan chiqib ketadi</b>.</>, ru: <>Сайта, который нравится всем одинаково, не бывает: одни и те же слова не подходят ни школьнику, ни офисному работнику — оба <b>уходят с сайта</b>.</> },
        vis: { uz: <RcFlow items={["🎒 o'quvchiga — oldindan buyurtma", "🧑‍💼 ofisga — doimiy tushlik"]} sep="·" />, ru: <RcFlow items={["🎒 школьнику — заказ заранее", "🧑‍💼 офису — постоянный обед"]} sep="·" /> },
        ask: { uz: "Hamma sinfdoshingizga birdek yoqadigan bitta o'yin bormi?", ru: "Есть игра, которая нравится всем вашим одноклассникам одинаково?" }
      },
      {
        ic: "🔍",
        h: { uz: "Tor auditoriya — kamchilik emas, kuch", ru: "Узкая аудитория — не слабость, а сила" },
        body: { uz: <>«Tanaffusda lavash oladigan o'quvchilar» — endi saytda nima yozishni aniq bilasiz: <b>menyu, narx, oldindan buyurtma</b>.</>, ru: <>«Школьники, которые берут лаваш на перемене» — и вы точно знаете, что писать на сайте: <b>меню, цена, заказ заранее</b>.</> },
        vis: { uz: <RcFlow items={["KIM aniq", "MUAMMO aniq", "YECHIM ham aniq"]} />, ru: <RcFlow items={["КТО ясно", "ПРОБЛЕМА ясна", "РЕШЕНИЕ тоже ясно"]} /> },
        ask: { uz: "O'zingiz izlagan narsani «hamma uchun» saytdan topish osonmi?", ru: "Легко ли найти нужное вам на сайте «для всех»?" }
      },
      {
        ic: "🌍",
        h: { uz: "Eng katta sayt ham tor auditoriyadan boshlangan", ru: "Даже самый большой сайт начинался с узкой аудитории" },
        body: { uz: <>Facebook boshida faqat <b>bitta universitet</b> talabalari uchun ochiq bo'lgan. Dunyoga ochilish — keyingi qadam bo'lgan.</>, ru: <>Facebook сначала был открыт только для студентов <b>одного университета</b>. Выход на весь мир — это уже следующий шаг.</> },
        vis: { uz: <RcFlow items={["🏫 Bitta universitet", "🔗 Boshqa universitetlar", "🌍 Butun dunyo"]} />, ru: <RcFlow items={["🏫 Один университет", "🔗 Другие университеты", "🌍 Весь мир"]} /> },
        ask: { uz: "Faqat sizning sinfingiz uchun qilingan sayt nimasi bilan boshqacha bo'lardi?", ru: "Чем отличался бы сайт, сделанный только для вашего класса?" }
      }
    ]
  },
  // idx 9 — s9: «PM birinchi qaysi savolni beradi?» (nazariya: s6 ustaxona + s8 foydalanuvchi ko'zi)
  9: {
    title: { uz: "Birinchi savol — KIM", ru: "Первый вопрос — КТО" },
    cards: [
      {
        ic: "🧑‍💼",
        h: { uz: "Avval so'raladi: KIM va qanday MUAMMO?", ru: "Сначала спрашивают: КТО и какая ПРОБЛЕМА?" },
        body: { uz: <>Dizayn, nom, narx — bularning hammasi <b>keyin</b>. KIM va MUAMMO aniq bo'lsa, qolgan javoblar o'z-o'zidan kelib chiqadi.</>, ru: <>Дизайн, название, цена — всё это <b>потом</b>. Когда КТО и ПРОБЛЕМА ясны, остальные ответы приходят сами.</> },
        vis: { uz: <RcFlow items={["1️⃣ KIM?", "2️⃣ MUAMMO?", "3️⃣ YECHIM?"]} />, ru: <RcFlow items={["1️⃣ КТО?", "2️⃣ ПРОБЛЕМА?", "3️⃣ РЕШЕНИЕ?"]} /> },
        ask: { uz: "Yangi ilova o'ylab topsangiz, birinchi qaysi savolga javob berasiz?", ru: "Если придумаете новое приложение, на какой вопрос ответите первым?" }
      },
      {
        ic: "📇",
        h: { uz: "Uch javob — bitta karta", ru: "Три ответа — одна карточка" },
        body: { uz: <><b>KIM</b> — tanaffusda shoshgan o'quvchi → <b>MUAMMO</b> — navbatga ulgurmaydi → <b>YECHIM</b> — oldindan buyurtma sahifasi. Har javob keyingisini ochadi.</>, ru: <><b>КТО</b> — школьник, который спешит на перемене → <b>ПРОБЛЕМА</b> — не успевает отстоять очередь → <b>РЕШЕНИЕ</b> — страница заказа заранее. Каждый ответ открывает следующий.</> },
        vis: { uz: <RcFlow items={["🎒 O'quvchi", "❓ Navbatga ulgurmaydi", "📱 Oldindan buyurtma"]} />, ru: <RcFlow items={["🎒 Школьник", "❓ Не успевает в очереди", "📱 Заказ заранее"]} /> },
        ask: { uz: "Sinfdoshingiz «sayt qilmoqchiman» desa, unga birinchi nima deysiz?", ru: "Одноклассник говорит: «Хочу сделать сайт». Что скажете первым?" }
      },
      {
        ic: "👀",
        h: { uz: "Har odam o'z narsasini izlaydi", ru: "Каждый ищет своё" },
        body: { uz: <>Bitta saytda o'quvchi <b>oldindan buyurtmaga</b>, sotuvchi <b>kelgan buyurtmalarga</b>, doimiy xaridor <b>oxirgi buyurtmaga</b> qaraydi. Shuning uchun kartada eng muhim guruh tanlanadi.</>, ru: <>На одном сайте школьник смотрит на <b>заказ заранее</b>, продавец — на <b>поступившие заказы</b>, постоянный покупатель — на <b>последний заказ</b>. Поэтому в карточке выбирают самую важную группу.</> },
        vis: { uz: <RcFlow items={["🎒 oldindan buyurtma", "🧑‍🍳 buyurtmalar", "🧑‍💼 oxirgi buyurtma"]} sep="·" />, ru: <RcFlow items={["🎒 заказ заранее", "🧑‍🍳 заказы", "🧑‍💼 последний заказ"]} sep="·" /> },
        ask: { uz: "Bitta ilovada siz va onangiz bir xil narsaga qaraysizmi?", ru: "В одном приложении вы и ваша мама смотрите на одно и то же?" }
      }
    ]
  },
  // idx 11 — s12: «Qaysi karta TO'LIQ?» (nazariya: s11 yig'ish)
  11: {
    title: { uz: "To'liq karta", ru: "Полная карточка" },
    cards: [
      {
        ic: "🧩",
        h: { uz: "To'liq karta — KIM, MUAMMO va YECHIM birga", ru: "Полная карточка — КТО, ПРОБЛЕМА и РЕШЕНИЕ вместе" },
        body: { uz: <>Uch bo'lakning bittasi yetishmasa, karta to'liq emas: nima qurishni ham, kimga kerakligini ham bilmaysiz.</>, ru: <>Если не хватает одной из трёх частей, карточка неполная: непонятно ни что строить, ни кому это нужно.</> },
        vis: { uz: <RcFlow items={["👤 KIM", "❓ MUAMMO", "💡 YECHIM"]} sep="+" />, ru: <RcFlow items={["👤 КТО", "❓ ПРОБЛЕМА", "💡 РЕШЕНИЕ"]} sep="+" /> },
        ask: { uz: "Kartadan MUAMMO qatorini olib tashlasak, nima qoladi?", ru: "Что останется, если убрать из карточки строку ПРОБЛЕМА?" }
      },
      {
        ic: "⚖️",
        h: { uz: "Yechim aynan O'SHA qiyinchilikni hal qilsin", ru: "Решение должно закрывать ИМЕННО ту трудность" },
        body: { uz: <>Navbatda turishga vaqti yo'q o'quvchiga — oldindan buyurtma. Yechim boshqa odamniki bo'lsa, <b>hech kimga foydasi tegmaydi</b>.</>, ru: <>Школьнику, у которого нет времени стоять в очереди, — заказ заранее. Если решение чужое, <b>пользы не будет никому</b>.</> },
        vis: { uz: <RcFlow items={["🎒 Vaqti yo'q", "📱 Oldindan buyurtma"]} />, ru: <RcFlow items={["🎒 Нет времени", "📱 Заказ заранее"]} /> },
        ask: { uz: "Sizning yechimingiz do'stingizning qiyinchiligiga to'g'ri keladimi?", ru: "Подходит ли ваше решение к трудности вашего друга?" }
      },
      {
        ic: "🔍",
        h: { uz: "To'liq bo'lmagan kartani bir savol ochib beradi", ru: "Неполную карточку выдаёт один вопрос" },
        body: { uz: <>«Juda chiroyli sayt qilamiz» — KIM uchun? Qaysi MUAMMOga? Javob yo'q — demak bu hali karta emas, faqat istak.</>, ru: <>«Сделаем очень красивый сайт» — для КОГО? К какой ПРОБЛЕМЕ? Ответа нет — значит это ещё не карточка, а просто желание.</> },
        vis: { uz: <RcFlow items={["💭 Istak", "❓ 3 savol", "✅ Karta"]} />, ru: <RcFlow items={["💭 Желание", "❓ 3 вопроса", "✅ Карточка"]} /> },
        ask: { uz: "«O'quvchilar uchun hamma narsa bo'lgan sayt» — bu kartada nima yetishmayapti?", ru: "«Сайт для школьников, где есть всё» — чего не хватает в этой карточке?" }
      }
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
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code key={i} className="qcode">{p}</code> : p) : s;
var QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval natijani oching", ru: "Сначала откройте результат" } : solved ? { uz: "Davom etish", ru: "Продолжить" } : oneShot ? { uz: "Javob tanlang", ru: "Выберите ответ" } : { uz: "To'g'ri javobni toping", ru: "Найдите верный ответ" }} onClick={onNext} /></>}>
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
            {isMentorLive ? fmtCode(tr2({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${uzOf(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx] && options[correctIdx].ru || uzOf(options[correctIdx])}` })) : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? fmtCode(tr2({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${uzOf(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx] && options[correctIdx].ru || uzOf(options[correctIdx])}` })) : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
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
var MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  if (!live || live.mode !== "mentor") return null;
  return <details className="mnote-d"><summary>{tr2({ uz: "📋 Eslatma — faqat sizga", ru: "📋 Заметка — только для вас" })}</summary><p>{tr2(children)}</p></details>;
};
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
      <div className="mentor-ava" aria-hidden="true"><img src={MENTOR_IMG} alt="" /></div>
      <div className="mentor-col">
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue">{tr2({ uz: " · ko'rsatmani ochish ▾", ru: " · раскрыть указание ▾" })}</span>}</span>
        <div className="mentor-msg body">{tr2(children)}</div>
      </div>
    </div>;
};
var Preview = ({ url, children, minH }) => <div className="bp-window fade-up delay-1">
    <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-url"><span className="lock">●</span>{url}</span></div>
    <div className="bp-body" style={{ minHeight: minH }}>{children}</div>
  </div>;
var SiteMock = ({ logo = "S", color = T.accent, name, headline, sub, rows, cta }) => {
  const nm = tr2(name) || tr2({ uz: "Sayt", ru: "Сайт" }), hl = tr2(headline), sb = tr2(sub), ct = tr2(cta);
  return <div className="pg-in" key={String(nm) + String(hl || "")}>
    <div className="site-header"><span className="site-brand"><span className="site-logo" style={{ background: color }}>{logo}</span><span className="site-name">{nm}</span></span><span className="site-nav"><span>{tr2({ uz: "Asosiy", ru: "Главная" })}</span><span>{tr2({ uz: "Haqida", ru: "О нас" })}</span></span></div>
    {hl && <h3 className="site-h3" style={{ marginTop: 2 }}>{hl}</h3>}
    {sb && <p style={{ fontFamily: G, color: T.ink2, fontSize: "clamp(12.5px,1.6vw,14px)", lineHeight: 1.5, margin: "0 0 12px" }}>{sb}</p>}
    {rows && <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 13px" }}>{rows.map((r, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 38, height: 28, borderRadius: 6, background: T.bg, flexShrink: 0, boxShadow: `inset 0 0 0 1px ${T.ink3}30` }} /><span style={{ fontFamily: G, fontSize: 13.5, color: T.ink }}>{tr2(r)}</span></div>)}</div>}
    {ct && <span style={{ display: "inline-block", background: color, color: "#fff", fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, padding: "9px 18px", borderRadius: 9 }}>{ct}</span>}
  </div>;
};
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
var Zoomable = ({ children }) => {
  const [big, setBig] = useState2(false);
  useEffect2(() => {
    if (!big) return;
    const onKey = (e) => {
      if (e.key === "Escape") setBig(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [big]);
  return <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${big ? "zoom-on" : ""}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr2({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr2({ uz: "Kattalashtirish", ru: "Увеличить" })} title={big ? tr2({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr2({ uz: "Kattalashtirish", ru: "Увеличить" })}>{big ? "✕" : "⛶"}</button>
        {children}
      </div>
    </>;
};
var CARDS_KEY = "pm-m1d2-cards";
var readCards = () => {
  try {
    const a = JSON.parse(localStorage.getItem(CARDS_KEY) || "null");
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
};
var writeCards = (arr) => {
  try {
    localStorage.setItem(CARDS_KEY, JSON.stringify(arr));
  } catch {
  }
};
var cardFull = (c) => !!(c && (c.kim || "").trim().length >= 3 && (c.muammo || "").trim().length >= 6 && (c.yechim || "").trim().length >= 6);
var readFullCards = () => readCards().filter(cardFull);
var HOOK_CHOICE_KEY = "pm-m1d2-hook-choice";
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState2(storedAnswer?.picked ?? null);
  const PEOPLE = [
    { ic: "🎒", n: { uz: "Maktab o'quvchisi", ru: "Школьник" }, s: { uz: "tanaffusda lavash oladi", ru: "берёт лаваш на перемене" } },
    { ic: "🧑‍💼", n: { uz: "Ofis xodimi", ru: "Офисный работник" }, s: { uz: "har kuni tushlik oladi", ru: "каждый день берёт обед" } },
    { ic: "🙋", n: { uz: "Yangi mijoz", ru: "Новый клиент" }, s: { uz: "narxlarni surishtiradi", ru: "расспрашивает про цены" } },
    { ic: "🚚", n: { uz: "Uzoq shahardagi odam", ru: "Человек из другого города" }, s: { uz: "bu do'konga kelmaydi", ru: "сюда не приходит" } }
  ];
  const OPTS = [
    { id: "a", label: { uz: "Butun shahar aholisi", ru: "Все жители города" } },
    { id: "b", label: { uz: "Bu do'kondan har kuni ovqat oladigan odamlar", ru: "Те, кто каждый день покупает здесь еду" } },
    { id: "c", label: { uz: "Internetdagi hamma odam", ru: "Все люди в интернете" } }
  ];
  const voteTurn = useTurnHint(picked === null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    try {
      localStorage.setItem(HOOK_CHOICE_KEY, JSON.stringify({ id: v, label: (OPTS.find((o) => o.id === v) || {}).label || "" }));
    } catch {
    }
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
  };
  return <Stage eyebrow={{ uz: "Kirish", ru: "Введение" }} screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null} disabled={picked === null} label={picked === null ? { uz: "Avval javobingizni belgilang", ru: "Сначала отметьте свой ответ" } : { uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr2({ uz: <>Maktab yonidagi lavash do'koni sayt ochsa — unga <span className="italic" style={{ color: T.accent }}>kim kiradi</span>?</>, ru: <>Лавашная у школы открыла сайт — <span className="italic" style={{ color: T.accent }}>кто на него зайдёт</span>?</> })}</h1>
        <Mentor>{{ uz: <>Maktabingiz yonidagi lavash do'koni o'z saytini ochmoqchi — lekin sayt kim uchun ochilishi hali noma'lum. Pastdagi uch javobdan <b style={{ color: T.ink }}>bittasini</b> tanlang.</>, ru: <>Лавашная рядом с вашей школой хочет открыть свой сайт — но для кого он, пока неясно. Выберите <b style={{ color: T.ink }}>один</b> из трёх ответов ниже.</> }}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr2({ uz: "Eshik oldidan kim o'tadi", ru: "Кто проходит мимо двери" })}</p>
            <div className="hk-street fade-up delay-1">
              <span className="hk-flow" aria-hidden="true"><i /><i /><i /></span>
              <span className="hk-shop">{tr2({ uz: "🌯 Lavash do'koni", ru: "🌯 Лавашная" })}</span>
              {PEOPLE.map((o, i) => <div key={i} className={"hk-person" + (i === PEOPLE.length - 1 ? " away" : "")} style={{ animationDelay: 0.15 + i * 0.18 + "s" }}>
                  <span className="hk-face">{o.ic}</span>
                  <span className="hk-col"><b>{tr2(o.n)}</b><em>{tr2(o.s)}</em></span>
                </div>)}
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Sizningcha, sayt kim uchun ochiladi?", ru: "Как вы думаете, для кого открывают сайт?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o, i) => {
    const on = picked === o.id;
    return <button key={o.id} className={"hook-option " + (on ? "on" : "") + (voteTurn ? " turn-ring turn-wave w" + (i + 1) : "")} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr2(o.label)}</span>
                  </button>;
  })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr2({ uz: "Javobingiz yozildi — sinfda ovozlar turlicha bo'ladi. Kimniki to'g'ri ekanini birozdan keyin birga bilib olamiz.", ru: "Ваш ответ записан — в классе голоса разойдутся. Чуть позже вместе узнаем, кто был прав." })}</p>}
          </Col>
        </Split>
        <MentorNote>{{ uz: "To'g'ri javobni AYTMANG — «birozdan keyin birga bilib olamiz». Bu ekranda 2 daqiqadan oshirmang.", ru: "НЕ называйте верный ответ — «чуть позже узнаем вместе». На этом экране не задерживайтесь дольше 2 минут." }}</MentorNote>
      </div>
    </Stage>;
};
var DEMO_CARD = [
  { k: { uz: "KIM", ru: "КТО" }, v: { uz: "Tanaffusda lavash oladigan maktab o'quvchilari", ru: "Школьники, которые берут лаваш на перемене" }, c: "kim" },
  { k: { uz: "MUAMMO", ru: "ПРОБЛЕМА" }, v: { uz: "Navbat uzun — 15 daqiqalik tanaffusga ulgurishmaydi", ru: "Очередь длинная — за 15 минут перемены не успеть" }, c: "muammo" },
  { k: { uz: "YECHIM", ru: "РЕШЕНИЕ" }, v: { uz: "Oldindan buyurtma qilib, kelib olib ketish sahifasi", ru: "Страница: заказать заранее и забрать" }, c: "yechim" }
];
var Screen1 = ({ screen, onNext, onPrev }) => {
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const [step, setStep] = useState2(reduced ? DEMO_CARD.length + 1 : 0);
  const timers = useRef2([]);
  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduced) {
      setStep(DEMO_CARD.length + 1);
      return;
    }
    setStep(0);
    for (let i = 1; i <= DEMO_CARD.length + 1; i++) timers.current.push(setTimeout(() => setStep(i), 520 + (i - 1) * 900));
  }, [reduced]);
  useEffect2(() => {
    play();
    return () => timers.current.forEach(clearTimeout);
  }, [play]);
  const done = step > DEMO_CARD.length;
  const COL = SLOT;
  return <Stage eyebrow={{ uz: "Maqsad", ru: "Цель" }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Boshlaymiz →", ru: "Начнём →" }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Dars oxirida <span className="italic" style={{ color: T.accent }}>kim uchun</span> sayt qilishni bilib olasiz</>, ru: <>К концу урока вы поймёте, <span className="italic" style={{ color: T.accent }}>для кого</span> делать сайт</> })}</h2></div>
        <Mentor>{{ uz: <>Uchta savolga javob topasiz: KIM? MUAMMO? YECHIM? Uchalasi bitta yozuvga yig'iladi — <b style={{ color: T.ink }}>shu yozuv auditoriya-karta deyiladi</b>. Quyida namunasi o'z-o'zidan yozilib chiqadi.</>, ru: <>Вы найдёте ответы на три вопроса: КТО? ПРОБЛЕМА? РЕШЕНИЕ? Все три собираются в одну запись — <b style={{ color: T.ink }}>она называется карточкой аудитории</b>. Ниже образец напишется сам.</> }}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr2({ uz: "Namuna: lavash do'koni kartasi", ru: "Образец: карточка лавашной" })}</p>
            <div className={"acard fade-up" + (done ? " ready" : "")}>
              {done && <span className="acard-stamp">{tr2({ uz: "KARTA TAYYOR ✓", ru: "КАРТОЧКА ГОТОВА ✓" })}</span>}
              <span className="acard-title">{tr2({ uz: "🌯 Maktab yonidagi lavash do'koni", ru: "🌯 Лавашная рядом со школой" })}</span>
              {DEMO_CARD.map((r, i) => <div key={i} className={"acard-row" + (step > i ? " on" : "")} style={{ borderLeftColor: step > i ? COL[r.c] : "transparent" }}>
                  <span className="mono acard-k" style={{ color: step > i ? COL[r.c] : T.ink3 }}>{tr2(r.k)}</span>
                  <span className="acard-v">{step > i ? tr2(r.v) : <em className="acard-wait">{tr2({ uz: "yozilmoqda…", ru: "пишется…" })}</em>}</span>
                </div>)}
            </div>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={play} disabled={!done && !reduced}>{done ? tr2({ uz: "↻ Yana ko'rish", ru: "↻ Посмотреть ещё раз" }) : tr2({ uz: "Yozilmoqda…", ru: "Пишется…" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Bugungi yo'l", ru: "Сегодняшний путь" })}</p>
            <ol className="roadmap">
              {[{ uz: "Auditoriya nima ekanini bilamiz", ru: "Узнаем, что такое аудитория" }, { uz: "Mashhur saytlar kimga ishlashini ko'ramiz", ru: "Посмотрим, для кого работают известные сайты" }, { uz: "O'z kartangizni yozasiz", ru: "Напишете свою карточку" }, { uz: "Kartani sahifada jonli ko'rsatasiz", ru: "Покажете карточку живьём на странице" }].map((t, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: 0.08 + i * 0.06 + "s" }}>
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="step-body"><span className="step-text">{tr2(t)}</span></span>
                </li>)}
            </ol>
          </Col>
        </Split>
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const SITES = {
    video: { ic: "🎬", name: { uz: "Video sayti", ru: "Видеосайт" }, url: "video.uz", mock: { logo: "V", color: "#E0559A", name: { uz: "Video", ru: "Видео" }, headline: { uz: "Bugun nima ko'ramiz?", ru: "Что посмотрим сегодня?" }, rows: [{ uz: "Dasturlash darsi · 12 daq", ru: "Урок программирования · 12 мин" }, { uz: "Sayohat lavhasi · 8 daq", ru: "Ролик о путешествии · 8 мин" }], cta: { uz: "Ko'rish", ru: "Смотреть" } }, kim: { uz: "Bo'sh vaqtida qiziqarli narsa izlaydigan odamlar", ru: "Люди, которые ищут интересное в свободное время" }, nega: { uz: "Shuning uchun bosh sahifada tavsiya qilingan videolar turadi.", ru: "Поэтому на главной странице стоят рекомендованные видео." } },
    xabar: { ic: "💬", name: { uz: "Xabar ilovasi", ru: "Мессенджер" }, url: "xabar.uz", mock: { logo: "X", color: "#0E86C4", name: { uz: "Xabar", ru: "Сообщения" }, headline: { uz: "Suhbatlar", ru: "Чаты" }, rows: [{ uz: "Ona — Salom, qalaysan?", ru: "Мама — Привет, как дела?" }, { uz: "Sinfdosh — Bugun chiqamizmi?", ru: "Одноклассник — Сегодня выйдем?" }], cta: { uz: "Yozish", ru: "Написать" } }, kim: { uz: "Uzoqdagi yaqinlari bilan gaplashadigan odamlar", ru: "Люди, которые общаются с далёкими близкими" }, nega: { uz: "Shuning uchun birinchi ekranda suhbatlar ro'yxati turadi.", ru: "Поэтому на первом экране стоит список чатов." } },
    taksi: { ic: "🚕", name: { uz: "Taksi ilovasi", ru: "Приложение такси" }, url: "taksi.uz", mock: { logo: "T", color: "#FFB300", name: { uz: "Taksi", ru: "Такси" }, headline: { uz: "Mashina chaqiring", ru: "Вызовите машину" }, sub: { uz: "Narx oldindan ma'lum: 18 000 so'm.", ru: "Цена известна заранее: 18 000 сум." }, cta: { uz: "Chaqirish", ru: "Вызвать" } }, kim: { uz: "Shahar ichida tez borishi kerak bo'lgan odamlar", ru: "Люди, которым нужно быстро добраться по городу" }, nega: { uz: "Shuning uchun eng katta tugma — «Chaqirish».", ru: "Поэтому самая большая кнопка — «Вызвать»." } }
  };
  const KEYS = ["video", "xabar", "taksi"];
  const [active, setActive] = useState2(null);
  const [seen, setSeen] = useState2(/* @__PURE__ */ new Set());
  const done = seen.size >= KEYS.length;
  const tap = (k) => {
    setActive((a) => a === k ? null : k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const pend2 = KEYS.filter((k) => !seen.has(k));
  const lit2 = useTurnWalk(pend2);
  const cur = active ? SITES[active] : null;
  return <Stage eyebrow={{ uz: "Har sayt — o'z odamlari", ru: "У каждого сайта — свои люди" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: seen.size + "/" + KEYS.length + " saytni oching", ru: "Откройте сайты: " + seen.size + "/" + KEYS.length }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har bir sayt aniq <span className="italic" style={{ color: T.accent }}>kimlar uchun</span> qilingan?</>, ru: <>А каждый сайт сделан <span className="italic" style={{ color: T.accent }}>для кого именно</span>?</> })}</h2></div>
        <Mentor>{{ uz: <>Mashhur saytlar ham lavash do'koni kabi aniq odamlar guruhi uchun ishlaydi. Uchta saytni <b style={{ color: T.ink }}>birma-bir bosing</b> — har birida sayt kimlar uchun qilingani ochiladi.</>, ru: <>Известные сайты, как и лавашная, работают для конкретной группы людей. Нажмите на три сайта <b style={{ color: T.ink }}>по очереди</b> — в каждом откроется, для кого он сделан.</> }}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Saytni tanlang", ru: "Выберите сайт" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {KEYS.map((k) => <button key={k} className={turnCls(lit2, k, pend2.length > 1).trim()} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 11, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 13, padding: "13px 15px", background: T.paper, boxShadow: active === k ? "inset 0 0 0 2px " + T.accent + ", 0 8px 20px -7px rgba(91,61,230,0.22)" : "0 6px 16px -8px rgba(" + T.shadowBase + ",0.16)", transition: "all 0.18s" }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{SITES[k].ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: T.ink }}>{tr2(SITES[k].name)}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success, display: "inline-flex" }}>{Ico.check(14)}</span>}
                </button>)}
            </div>
            {cur ? <div className="sk-info fade-step" key={active}>
                <p className="flow-label" style={{ margin: "0 0 4px" }}>{tr2({ uz: "Bu sayt kimlar uchun", ru: "Для кого этот сайт" })}</p>
                <p className="body" style={{ color: T.ink, margin: 0 }}>{tr2(cur.kim)}</p>
                <p className="small" style={{ color: T.ink2, margin: "6px 0 0" }}>{tr2(cur.nega)}</p>
              </div> : <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Saytni bosing — u kimlar uchun qilingani shu yerda ochiladi.", ru: "Нажмите на сайт — здесь откроется, для кого он сделан." })}</p>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Uchchalasida ham javob aniq: sayt <b>aniq odamlar guruhi</b> uchun qilingan. Bu guruh — saytning <b>auditoriyasi</b>.</>, ru: <>Во всех трёх ответ ясен: сайт сделан для <b>конкретной группы людей</b>. Эта группа — <b>аудитория</b> сайта.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sayt shu odamlarga shunday ko'rinadi", ru: "Вот каким сайт видят эти люди" })}</p>
            {cur ? <Preview url={cur.url} minH={188}><SiteMock {...cur.mock} /></Preview> : <div className="frame-dash" style={{ minHeight: 188, display: "flex", alignItems: "center", justifyContent: "center" }}><p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Chapdan sayt tanlang", ru: "Выберите сайт слева" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [wide, setWide] = useState2(false);
  const [touched, setTouched] = useState2(false);
  const done = touched;
  const toggle = () => {
    setWide((g) => !g);
    setTouched(true);
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const sceneTurn = useTurnHint(!touched);
  return <Stage eyebrow={{ uz: "Aniq odam — kuch", ru: "Конкретный человек — это сила" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval ikkinchi holatni ko'ring", ru: "Сначала посмотрите второе состояние" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Lavash do'koni sayti <span className="italic" style={{ color: T.accent }}>hamma uchun</span> bo'lsa nima bo'ladi?</>, ru: <>Что будет, если сайт лавашной сделать <span className="italic" style={{ color: T.accent }}>для всех</span>?</> })}</h2></div>
        <Mentor>{{ uz: <>Karta aniq odamlar guruhiga yozilsa, sayt o'sha odamlarga aniq gapiradi. Pastdagi <b style={{ color: T.ink }}>«✂️ Kartani "hamma uchun"ga almashtirish»</b> tugmasini bosing — saytga nima bo'lishini ko'rasiz.</>, ru: <>Если карточка написана для конкретной группы, сайт говорит с этими людьми прямо. Нажмите кнопку <b style={{ color: T.ink }}>«✂️ Заменить карточку на "для всех"»</b> — увидите, что станет с сайтом.</> }}</Mentor>
        <Zoomable>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="s3-scene fade-up delay-1">
          <div className="s3-node">
            <span className="s3-face" key={wide ? "w" : "n"}>{wide ? "🤷" : "🎒"}</span>
            <span className="conn-lbl">{wide ? tr2({ uz: "Hamma", ru: "Все" }) : tr2({ uz: "O'quvchi", ru: "Школьник" })}</span>
            <span className="conn-sub">{wide ? tr2({ uz: "kim uchunligi aniq emas", ru: "непонятно, для кого" }) : tr2({ uz: "tanaffusda lavash oladi", ru: "берёт лаваш на перемене" })}</span>
          </div>
          <div className={"s3-link " + (wide ? "cut" : "")}>
            {!wide && <><span className="s3-dot" /><span className="s3-dot d2" /><span className="s3-dot d3" /></>}
            <span className="s3-wire" />
            {wide && <span className="s3-scissors">✂️</span>}
          </div>
          <div className={"s3-site " + (wide ? "off" : "")}>
            <div className="bp-window">
              <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-url"><span className="lock">●</span>lavash.uz</span></div>
              <div className="bp-body" style={{ minHeight: 92 }}>
                <SiteMock logo="L" color={T.accent} name={{ uz: "Lavash do'koni", ru: "Лавашная" }} headline={wide ? { uz: "Hamma uchun har xil mahsulotlar", ru: "Разные товары для всех" } : { uz: "Oldindan buyurtma — tanaffusda navbatsiz oling", ru: "Заказ заранее — заберите на перемене без очереди" }} cta={wide ? { uz: "Ko'rish", ru: "Смотреть" } : { uz: "Buyurtma berish", ru: "Заказать" }} />
              </div>
            </div>
            <span className={"s3-visit " + (wide ? "zero" : "")} key={wide ? "z" : "v"}>{wide ? tr2({ uz: "👥 Kirgan odam o'zi izlaganini topmadi va chiqib ketdi", ru: "👥 Зашедший не нашёл нужного и ушёл" }) : tr2({ uz: "👥 O'quvchilar har kuni oldindan buyurtma qilib turadi", ru: "👥 Школьники каждый день заказывают заранее" })}</span>
          </div>
        </div>
        <button className={"btn" + (sceneTurn ? " turn-ring" : "")} onClick={toggle} style={{ alignSelf: "flex-start" }}>{wide ? tr2({ uz: "↩ Aniq odamlarga qaytarish", ru: "↩ Вернуть конкретных людей" }) : tr2({ uz: "✂️ Kartani «hamma uchun»ga almashtirish", ru: "✂️ Заменить карточку на «для всех»" })}</button>
        {done && (wide ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>«Hamma uchun» yozilgan sayt <b>hech kimga aniq gapirmaydi</b>: kirgan odam o'zi izlaganini topmaydi va saytdan chiqib ketadi.</>, ru: <>Сайт с надписью «для всех» <b>ни с кем не говорит прямо</b>: зашедший не находит нужного и уходит.</> })}</p></div> : <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Aniq odamlar guruhi qaytdi — sayt yana aniq gapirmoqda: <b>nima bor</b>, <b>narxi qancha</b>, <b>qanday buyurtma qilinadi</b>.</>, ru: <>Конкретная группа вернулась — сайт снова говорит прямо: <b>что есть</b>, <b>сколько стоит</b>, <b>как заказать</b>.</> })}</p></div>)}
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 1-savol", ru: "Задание · вопрос 1" }}
  questionText="Sayt birinchi navbatda nima uchun yaratiladi?"
  question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Sayt birinchi navbatda <span className="italic" style={{ color: T.accent }}>nima uchun</span> yaratiladi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="italic" style={{ color: T.accent }}>Ради чего</span> в первую очередь создают сайт?</h2></> }}
  options={[{ uz: "Ko'p odam kirib, mashhur bo'lishi uchun", ru: "Чтобы заходило много людей и он стал популярным" }, { uz: "Egasiga pul topib berishi uchun", ru: "Чтобы приносить деньги владельцу" }, { uz: "Kimningdir aniq muammosini yechish uchun", ru: "Чтобы решить конкретную проблему конкретных людей" }, { uz: "Zamonaviy va chiroyli ko'rinishi uchun", ru: "Чтобы выглядеть современно и красиво" }]}
  correctIdx={2}
  explainCorrect={{ uz: "To'g'ri! Hammasi muammodan boshlanadi. Muammo yaxshi yechilsa — odamlar o'zi kirib keladi, mashhurlik ham, pul ham shundan keyin keladi.", ru: "Верно! Всё начинается с проблемы. Если проблема решена хорошо, люди приходят сами — а популярность и деньги приходят уже после." }}
  explainWrong={{
    0: { uz: "Mashhurlik — natija, sabab emas. Odamlar saytga muammosini yechgani uchun kiradi, shundan keyingina u mashhur bo'ladi.", ru: "Популярность — результат, а не причина. Люди заходят на сайт, чтобы решить свою проблему, и только потом он становится популярным." },
    1: { uz: "Pul ham natija: sayt odamlarga foyda berganidagina pul topadi. Avval — muammo yechimi, keyin daromad.", ru: "Деньги — тоже результат: сайт зарабатывает, только если приносит людям пользу. Сначала решение проблемы, потом доход." },
    3: { uz: "Chiroyli dizayn kerak, lekin u yechimga xizmat qiladi. Muammoni yechmasa, eng chiroyli saytga ham hech kim qaytib kirmaydi.", ru: "Красивый дизайн нужен, но он служит решению. Если проблема не решена, на самый красивый сайт никто не вернётся." },
    default: { uz: "Sayt avvalo kimningdir aniq muammosini yechish uchun yaratiladi — qolgani shundan kelib chiqadi.", ru: "Сайт создают прежде всего ради решения конкретной проблемы конкретных людей — остальное вытекает отсюда." }
  }}
/>;
var K_SLIDES = [
  { ic: "🏫", t: { uz: "2004-yil. Bir universitet talabasi oddiy sayt ochdi — u faqat o'z universiteti uchun edi.", ru: "2004 год. Студент одного университета открыл простой сайт — только для своего университета." } },
  { bet: true, ask: { uz: "Sizningcha, bu sayt boshida kimlar uchun ochilgan edi?", ru: "Как вы думаете, для кого этот сайт открыли вначале?" }, opts: [{ uz: "Bitta universitet talabalari uchun", ru: "Для студентов одного университета" }, { uz: "Amerikadagi barcha talabalar uchun", ru: "Для всех студентов Америки" }, { uz: "Butun dunyo uchun", ru: "Для всего мира" }], right: 0 },
  { ic: "🎓", t: { uz: "Avval sayt faqat Garvard universiteti talabalari uchun ochiq edi. Boshqalar ro'yxatdan o'ta olmasdi.", ru: "Сначала сайт был открыт только для студентов Гарварда. Остальные не могли зарегистрироваться." } },
  { ic: "🔗", t: { uz: "Keyin boshqa universitetlar ham qo'shildi. Saytdan foydalanadiganlar ko'paydi.", ru: "Потом подключились другие университеты. Пользователей стало больше." } },
  { ic: "🌍", t: { uz: "Oradan ikki yil o'tib, sayt butun dunyoga ochildi. Bugun uni Facebook nomi bilan bilamiz.", ru: "Через два года сайт открылся всему миру. Сегодня мы знаем его под именем Facebook." } }
];
var ScreenKeys = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const [i, setI] = useState2(0);
  const [bet, setBet] = useState2(null);
  const last = i >= K_SLIDES.length - 1;
  const cur = K_SLIDES[i];
  const betOpen = !!cur.bet && bet === null;
  const done = last;
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const nextTurn = useTurnHint(!last && !betOpen);
  const betTurn = useTurnHint(betOpen);
  return <Stage eyebrow={{ uz: "📊 Haqiqiy misol · Facebook", ru: "📊 Реальный пример · Facebook" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!last} disabled={!last && !isMentor} label={last || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval voqeani oxirigacha oching", ru: "Сначала откройте историю до конца" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bugungi eng katta ijtimoiy tarmoq avval <span className="italic" style={{ color: T.accent }}>kimlar uchun</span> ishlagan?</>, ru: <>А для кого сначала работала <span className="italic" style={{ color: T.accent }}>крупнейшая соцсеть</span> наших дней?</> })}</h2></div>
        <Mentor>{{ uz: <>Biznesdagi mashhur voqea: dunyodagi eng katta ijtimoiy tarmoq qanday boshlangan? Slaydlarni <b style={{ color: T.ink }}>birma-bir</b> oching.</>, ru: <>Известная история из бизнеса: как начиналась крупнейшая соцсеть мира? Открывайте слайды <b style={{ color: T.ink }}>по одному</b>.</> }}</Mentor>
        <div className="k-slide fade-up" key={i}>
          <span className="k-count">{i + 1} / {K_SLIDES.length}</span>
          {cur.bet ? <div className="k-bet">
              <span className="k-bet-lbl">{tr2({ uz: "🎲 Avval o'zingiz belgilab ko'ring", ru: "🎲 Сначала отметьте свой вариант" })}</span>
              <p className="k-ask">{tr2(cur.ask)}</p>
              <div className="k-chips">
                {cur.opts.map((o, k) => <button key={k} className={"k-chip " + (bet === k ? "on" : "") + (betTurn ? " turn-ring turn-wave w" + (k + 1) : "")} disabled={bet !== null} onClick={() => setBet(k)}>{tr2(o)}</button>)}
              </div>
              {bet !== null && <p className={"k-res " + (bet === cur.right ? "ok" : "")}>
                  {bet === cur.right ? tr2({ uz: "🎯 Topdingiz! ", ru: "🎯 Угадали! " }) : tr2({ uz: "Adashdingiz — asl javob: ", ru: "Не угадали — верный ответ: " })}
                  <b>{tr2(cur.opts[cur.right])}</b>
                </p>}
            </div> : <div className="k-body">
              <span className="k-ic">{cur.ic}</span>
              <p className="k-t">{tr2(cur.t)}</p>
            </div>}
          <div className="k-nav">
            <button className="btn-soft" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущий" })}</button>
            <span className="k-dots">{K_SLIDES.map((_, k) => <span key={k} className={"k-dot " + (k === i ? "cur" : k < i ? "fill" : "")} />)}</span>
            {!last && <button className={"btn" + (nextTurn ? " turn-ring" : "")} disabled={betOpen && !isMentor} onClick={() => setI(i + 1)}>{betOpen && !isMentor ? tr2({ uz: "Avval taxminingizni belgilang", ru: "Сначала отметьте свою догадку" }) : tr2({ uz: "Keyingisi →", ru: "Следующий →" })}</button>}
          </div>
        </div>
        {last && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Facebook ham avval <b>juda aniq bir guruh</b> uchun yaratilgan. Sizning auditoriya kartangizdagi «KIM» ham shunday aniq bo'lsin.</>, ru: <>Facebook тоже начинался для <b>очень конкретной группы</b>. Пусть «КТО» в вашей карточке аудитории будет таким же конкретным.</> })}</p></div>}
        <MentorNote>{{ uz: "Bashorat ballanmaydi — ovozlarni sanab, «kim topdi?» deb qisqa muhokama qiling. Bu ekranga 4 daqiqadan ko'p vaqt ketmasin.", ru: "Догадка не идёт в баллы — посчитайте голоса и коротко обсудите: «кто угадал?». На этот экран — не больше 4 минут." }}</MentorNote>
      </div>
    </Stage>;
};
var Screen5b = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 2-savol", ru: "Задание · вопрос 2" }}
  questionText="'Hamma uchun' qilingan sayt nega kam ishlaydi?"
  question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>"Hamma uchun" sayt nega <span className="italic" style={{ color: T.accent }}>kam</span> ishlaydi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Почему сайт «для всех» работает <span className="italic" style={{ color: T.accent }}>плохо</span>?</h2></> }}
  options={[{ uz: "Hammaga yoqadigan sayt qurish juda ko'p pulga tushadi", ru: "Сайт, который нравится всем, слишком дорого строить" }, { uz: "Hamma narsa bor, lekin hech kim o'zi izlaganini topolmaydi", ru: "Есть всё, но никто не находит того, что искал" }, { uz: "Ko'p odam bir vaqtda kirganidan sayt sekinlashib qoladi", ru: "Из-за наплыва посетителей сайт начинает тормозить" }, { uz: "Reklama qilinmasa, uni hech kim ko'rmay va bilmay qoladi", ru: "Без рекламы его никто не увидит и не узнает" }]}
  correctIdx={1}
  explainCorrect={{ uz: "Aniq topdingiz! Hammaga gapirgan sayt hech kimga aniq gapirmaydi. Tanaffusga shoshgan o'quvchiga ham, katta buyurtma qidirgan ofis xodimiga ham bir xil gapirsangiz — ikkisi ham kerakli narsasini topolmaydi.", ru: "Точно! Сайт, который говорит со всеми, ни с кем не говорит прямо. Если одинаково обращаться и к школьнику, спешащему на перемене, и к офисному работнику с большим заказом, — нужного не найдёт ни тот, ни другой." }}
  explainWrong={{
    0: { uz: "Pul haqida o'ylash to'g'ri, lekin gap unda emas: eng katta kompaniyalar ham «hamma uchun» sayt qilolmagan. Aniq odam tanlanmasa, nimani yaxshilashni ham bilib bo'lmaydi.", ru: "Про деньги думать правильно, но дело не в них: даже крупнейшие компании не смогли сделать сайт «для всех». Если не выбран конкретный человек, непонятно и что улучшать." },
    2: { uz: "Sekinlik — texnik masala, uni tuzatsa bo'ladi. «Hamma uchun» saytning qiyinchiligi boshqa: unga odam umuman kam kiradi.", ru: "Медленная работа — техническая задача, её можно починить. Трудность сайта «для всех» в другом: на него вообще мало кто заходит." },
    3: { uz: "Reklama saytni tanitadi — bu rost. Lekin kirgan odam o'ziga keraklisini topmasa, bir kirib, qaytib kelmaydi.", ru: "Реклама делает сайт известным — это правда. Но если зашедший не найдёт нужного, он зайдёт один раз и не вернётся." },
    default: { uz: "Aniq odam tanlanmagan — shuning uchun hech kim aynan o'zi izlaganini topa olmaydi.", ru: "Конкретный человек не выбран — поэтому никто не находит именно того, что искал." }
  }}
/>;
var WFIELDS = [
  { k: "kim", label: { uz: "KIM", ru: "КТО" }, color: "kim", ph: "masalan: tanaffusda lavash oladigan o'quvchilar", hint: { uz: "aniq guruh — yoshi yoki qiziqishi bilan", ru: "конкретная группа — по возрасту или интересу" } },
  { k: "muammo", label: { uz: "MUAMMO", ru: "ПРОБЛЕМА" }, color: "muammo", ph: "masalan: navbat uzun — tanaffusga ulgurishmaydi", hint: { uz: "bitta aniq qiyinchilik", ru: "одна конкретная трудность" } },
  { k: "yechim", label: { uz: "YECHIM", ru: "РЕШЕНИЕ" }, color: "yechim", ph: "masalan: oldindan buyurtma qilish sahifasi", hint: { uz: "sayt buni qanday hal qiladi", ru: "как сайт это решает" } }
];
var emptyCard = () => ({ kim: "", muammo: "", yechim: "" });
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const workRef = useRef2(null);
  const [st, setSt] = useState2(() => {
    const saved2 = (storedAnswer?.cards || readFullCards()).filter(cardFull).slice(0, 2);
    return { saved: saved2, draft: emptyCard(), editIdx: -1, done: !!(storedAnswer && storedAnswer.solved) || saved2.length >= 1 };
  });
  const { saved, draft, editIdx, done } = st;
  useEffect2(() => {
    if (done && storedAnswer === void 0 && saved.length >= 1) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "audience-card", cards: saved, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
  }, []);
  const val = (k) => (draft[k] || "").trim();
  const okKim = val("kim").length >= 3, okMu = val("muammo").length >= 6, okYe = val("yechim").length >= 6;
  const full = okKim && okMu && okYe;
  const wideKim = /^(hamma|barcha|hammasi|hech kim|все|всё|вся|всем|всех|любой|каждый|люди)/i.test(val("kim"));
  const canSave = full && !wideKim;
  const saveHint = !full ? null : wideKim ? { uz: "«Hamma» — bu hali auditoriya emas. Saytingizni birinchi bo'lib ochadigan aniq guruhni yozing: ular kimlar?", ru: "«Все» — это ещё не аудитория. Напишите конкретную группу, которая первой откроет ваш сайт: кто они?" } : null;
  const editing = editIdx >= 0;
  const showEditor = !done || editing || saved.length === 0;
  const filledN = [okKim, okMu, okYe].filter(Boolean).length;
  const saveDraft = () => {
    if (!canSave) return;
    const cards = editing ? saved.map((c, i) => i === editIdx ? { ...draft } : c) : [...saved, { ...draft }].slice(0, 2);
    writeCards(cards);
    if (!done) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "audience-card", cards, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
    setSt({ saved: cards, draft: emptyCard(), editIdx: -1, done: true });
  };
  const editCard = (i) => setSt((prev) => ({ ...prev, draft: { ...prev.saved[i] }, editIdx: i }));
  const setD = (patch) => setSt((prev) => ({ ...prev, draft: { ...prev.draft, ...patch } }));
  const [fieldFocus, setFieldFocus] = useState2(false);
  const pendFields = WFIELDS.map((f) => f.k).filter((k) => !(draft[k] || "").trim());
  const litField = useTurnWalk(pendFields, showEditor && !fieldFocus && !isMentor);
  const saveTurn = useTurnHint(showEditor && canSave);
  const turnBusy = showEditor && !isMentor && (pendFields.length > 0 || canSave);
  const lockLabel = !okKim ? { uz: "① Avval KIM — aniq guruhni yozing", ru: "① Сначала КТО — напишите конкретную группу" } : !okMu ? { uz: "② Endi MUAMMO — bitta aniq qiyinchilik", ru: "② Теперь ПРОБЛЕМА — одна конкретная трудность" } : !okYe ? { uz: "③ Endi YECHIM — sayt buni qanday hal qiladi", ru: "③ Теперь РЕШЕНИЕ — как сайт это решает" } : { uz: "✓ Saqlash tugmasini bosing", ru: "✓ Нажмите кнопку «Сохранить»" };
  const COL = SLOT;
  return <Stage eyebrow={{ uz: "Mustaqil ish · auditoriya-karta ✍️", ru: "Самостоятельная работа · карточка аудитории ✍️" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={turnBusy} disabled={!done && !isMentor} label={done || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : lockLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'z saytingiz uchun <span className="italic" style={{ color: T.accent }}>auditoriya-karta</span> yozing</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>карточку аудитории</span> для своего сайта</> })}</h2></div>
        <Mentor>{{ uz: <>Avval uchala qatorni to'ldiring, so'ng <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing — kartangiz o'ngdagi «📇 Kartalarim» ro'yxatiga o'tadi va dars oxirigacha siz bilan qoladi.</>, ru: <>Сначала заполните все три строки, затем нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b> — карточка перейдёт в список «📇 Мои карточки» справа и останется с вами до конца урока.</> }}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        {
    /* Havodagi qadam-indikator (80a): fonsiz doiralar, yozilgani yashil ✓ */
  }
        <div className={"jw-steps fade-up" + (turnBusy ? " turn-quiet" : "")} aria-label={tr2({ uz: filledN + "/3 maydon to'ldi", ru: "Заполнено полей: " + filledN + "/3" })}>
          {WFIELDS.map((f, i) => {
    const okF = i === 0 ? okKim : i === 1 ? okMu : okYe;
    const cur = !okF && pendFields[0] === f.k;
    return <React.Fragment key={f.k}>
                {i > 0 && <span className={"jws-line " + (okF ? "on" : "")} aria-hidden="true" />}
                <span className={"jws " + (okF ? "on" : cur ? "cur" : "")}>
                  <i className="jws-n">{okF ? "✓" : i + 1}</i>
                  <em className="jws-t">{tr2(f.label)}</em>
                </span>
              </React.Fragment>;
  })}
        </div>
        <div className="split" ref={workRef}>
          <Col>
            {showEditor ? <div className="swed fade-up" key={editing ? "e" + editIdx : "n" + saved.length}>
                {editing && <span className="swed-tag">{tr2({ uz: "✎ Kartani tahrirlash", ru: "✎ Редактировать карточку" })}</span>}
                <p className="swed-sent">{tr2({
    uz: <>Saytimga <b className={"ss-slot kim " + (draft.kim ? "on" : "")}>{draft.kim || "KIM"}</b> kiradi, ular <b className={"ss-slot muammo " + (draft.muammo ? "on" : "")}>{draft.muammo || "MUAMMO"}</b> bilan keladi, saytim <b className={"ss-slot yechim " + (draft.yechim ? "on" : "")}>{draft.yechim || "YECHIM"}</b> beradi.</>,
    ru: <>На мой сайт заходит <b className={"ss-slot kim " + (draft.kim ? "on" : "")}>{draft.kim || "КТО"}</b>, приходит с тем, что <b className={"ss-slot muammo " + (draft.muammo ? "on" : "")}>{draft.muammo || "ПРОБЛЕМА"}</b>, а мой сайт даёт <b className={"ss-slot yechim " + (draft.yechim ? "on" : "")}>{draft.yechim || "РЕШЕНИЕ"}</b>.</>
  })}</p>
                <div className="swcard-fields">
                  {WFIELDS.map((f) => {
    const okF = f.k === "kim" ? okKim : f.k === "muammo" ? okMu : okYe;
    return <label key={f.k} className={"smini-f " + f.k + (okF ? " on" : "") + turnCls(litField, f.k, pendFields.length > 1)} style={{ borderLeftColor: okF ? COL[f.color] : void 0 }}>
                        <span style={{ color: COL[f.color] }}>{tr2(f.label)}</span>
                        <input value={draft[f.k]} onChange={(e) => setD({ [f.k]: e.target.value })} onFocus={() => setFieldFocus(true)} onBlur={() => setFieldFocus(false)} placeholder={tr2(f.hint)} />
                      </label>;
  })}
                </div>
                {saveHint && <p className="swed-hint">💡 {tr2(saveHint)}</p>}
                <div className="swed-btns">
                  {editing && <button className="btn-ghost" onClick={() => setSt((prev) => ({ ...prev, draft: emptyCard(), editIdx: -1 }))}>{tr2({ uz: "Bekor qilish", ru: "Отмена" })}</button>}
                  {!full && <span className="swed-cnt">{tr2({ uz: `${filledN}/3 maydon to'ldi`, ru: `Заполнено полей: ${filledN}/3` })}</span>}
                  <button className={"swed-save" + (saveTurn ? " turn-ring" : "")} disabled={!canSave} onClick={saveDraft}>{tr2({ uz: "✓ Saqlash", ru: "✓ Сохранить" })}</button>
                </div>
              </div> : <div className="done-mini fade-step">{tr2({ uz: "✅ Kartangiz saqlandi", ru: "✅ Ваша карточка сохранена" })} <span className="dm-sub">{tr2({ uz: "— tahrirlash uchun ✎ belgisidan foydalaning", ru: "— чтобы поправить, нажмите ✎" })}</span></div>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "📇 Kartalarim", ru: "📇 Мои карточки" })}</p>
            {saved.length === 0 ? <div className="frame-dash" style={{ padding: "16px 18px" }}><p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Kartangiz saqlangach shu yerda ko'rinadi.", ru: "Карточка появится здесь после сохранения." })}</p></div> : <div className="svd full fade-step">
                {saved.map((c, i) => <div key={i} className={"svd-card " + (editIdx === i ? "editing" : "")}>
                    <div className="svd-top">
                      <span className="svd-num">✓ {i + 1}</span>
                      <button className="svd-edit" onClick={() => editCard(i)} aria-label={tr2({ uz: i + 1 + "-kartani tahrirlash", ru: "Редактировать карточку " + (i + 1) })}>{tr2({ uz: "✎ Tahrirlash", ru: "✎ Редактировать" })}</button>
                    </div>
                    <p className="svd-sent"><b style={{ color: SLOT.kim }}>{c.kim}</b> — <b style={{ color: SLOT.muammo }}>{c.muammo}</b>. <b style={{ color: SLOT.yechim }}>{tr2({ uz: "Yechim:", ru: "Решение:" })}</b> {c.yechim}</p>
                  </div>)}
              </div>}
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "✍️ Kartani yozib bo'lganlar", ru: "✍️ Кто написал карточку" }} />
        <MentorNote>{{ uz: "Jonli darsda bu ishni o'quvchilar bajaradi — siz kuzatasiz, «Davom etish» siz uchun ochiq. Frontal tushuntirmang: «hamma uchun» deb yozganlarni lavash do'koni misoliga qaytaring. Qabul: uchala maydon to'ldirilgan bo'lsa.", ru: "На живом уроке эту работу делают ученики — вы наблюдаете, «Продолжить» для вас открыто. Не объясняйте фронтально: тех, кто написал «для всех», возвращайте к примеру с лавашной. Принимаем, если заполнены все три поля." }}</MentorNote>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const USERS = {
    sotuvchi: { ic: "🧑‍🍳", name: { uz: "Sotuvchi (lavash ustasi)", ru: "Продавец (мастер лаваша)" }, want: { uz: "Kelgan buyurtmalarni adashtirmasdan qabul qilish va nechta lavash tayyorlashni oldindan bilish.", ru: "Принимать заказы ничего не перепутав и заранее знать, сколько лавашей готовить." }, look: { uz: "Sotuvchi birinchi bo'lib BUYURTMALAR ro'yxatiga qaraydi", ru: "Продавец первым делом смотрит на список ЗАКАЗОВ" } },
    oquvchi: { ic: "🎒", name: { uz: "O'quvchi (xaridor)", ru: "Школьник (покупатель)" }, want: { uz: "Navbatda turmasdan, tanaffusga ulgurib lavash olib ketish.", ru: "Забрать лаваш без очереди и успеть за перемену." }, look: { uz: "O'quvchi birinchi bo'lib OLDINDAN BUYURTMAGA qaraydi", ru: "Школьник первым делом смотрит на ЗАКАЗ ЗАРАНЕЕ" } },
    ofis: { ic: "🧑‍💼", name: { uz: "Doimiy xaridor (ofis xodimi)", ru: "Постоянный покупатель (офисный работник)" }, want: { uz: "Har kuni bir xil buyurtmani bir bosishda berish.", ru: "Каждый день делать один и тот же заказ в одно нажатие." }, look: { uz: "Doimiy xaridor birinchi bo'lib OXIRGI BUYURTMAGA qaraydi", ru: "Постоянный покупатель первым делом смотрит на ПОСЛЕДНИЙ ЗАКАЗ" } }
  };
  const ORDER = ["oquvchi", "sotuvchi", "ofis"];
  const [active, setActive] = useState2(null);
  const [seen, setSeen] = useState2(/* @__PURE__ */ new Set());
  const done = seen.size >= ORDER.length;
  const tap = (k) => {
    setActive((a) => a === k ? null : k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const pend8 = ORDER.filter((k) => !seen.has(k));
  const lit8 = useTurnWalk(pend8);
  return <Stage eyebrow={{ uz: "Har xil odam — har xil ehtiyoj", ru: "Разные люди — разные потребности" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: seen.size + "/" + ORDER.length + " odamni ko'ring", ru: "Посмотрите людей: " + seen.size + "/" + ORDER.length }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta saytga kirgan hamma <span className="italic" style={{ color: T.accent }}>bir xil</span> narsani qidiradimi?</>, ru: <>Все, кто зашёл на один сайт, ищут <span className="italic" style={{ color: T.accent }}>одно и то же</span>?</> })}</h2></div>
        <Mentor>{{ uz: <>Lavash do'koni saytiga uch xil odam kiradi. Har biri boshqa narsani qidiradi. Ularni <b style={{ color: T.ink }}>birma-bir bosing</b> va saytni ularning o'rnida ko'ring.</>, ru: <>На сайт лавашной заходят три разных человека. Каждый ищет своё. Нажмите на них <b style={{ color: T.ink }}>по очереди</b> и посмотрите на сайт их глазами.</> }}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {ORDER.map((k) => <button key={k} className={turnCls(lit8, k, pend8.length > 1).trim()} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 12, padding: "13px 15px", background: T.paper, boxShadow: active === k ? "inset 0 0 0 2px " + T.accent + ", 0 8px 20px -6px rgba(91,61,230,0.22)" : "0 6px 16px -7px rgba(" + T.shadowBase + ",0.16)", transition: "all 0.18s" }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{USERS[k].ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: T.ink }}>{tr2(USERS[k].name)}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success, display: "inline-flex" }}>{Ico.check(14)}</span>}
                </button>)}
            </div>
            {active && <div className="sk-info fade-step" key={active + "w"}>
                <p className="flow-label" style={{ margin: "0 0 4px" }}>{USERS[active].ic} {tr2({ uz: <>{tr2(USERS[active].name)} nimani xohlaydi?</>, ru: <>Чего хочет {tr2(USERS[active].name)}?</> })}</p>
                <p className="body" style={{ color: T.ink, margin: 0 }}>{tr2(USERS[active].want)}</p>
              </div>}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bir saytga turli odamlar kirishi mumkin. Ammo auditoriya kartasida <b>eng muhim guruh</b> tanlanadi.</>, ru: <>На один сайт могут заходить разные люди. Но в карточке аудитории выбирают <b>самую важную группу</b>.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{active ? "👀 " + tr2(USERS[active].look) : tr2({ uz: "Sayt — hozircha oddiy ko'rinishda", ru: "Сайт — пока в обычном виде" })}</p>
            <div className="bp-window fade-up delay-1">
              <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-url"><span className="lock">●</span>lavash.uz</span></div>
              <div className="bp-body" style={{ minHeight: 168 }}>
                <div className="pg-in" key={active || "none"}>
                  <div className="site-header"><span className="site-brand"><span className="site-logo" style={{ background: "#C97B2D" }}>L</span><span className="site-name">{tr2({ uz: "Lavash do'koni", ru: "Лавашная" })}</span></span><span className="site-nav"><span>{tr2({ uz: "Menyu", ru: "Меню" })}</span><span>{tr2({ uz: "Aloqa", ru: "Контакты" })}</span></span></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className={"eye-row " + (active === "oquvchi" ? "hot" : "")}>{tr2({ uz: <>📱 Oldindan buyurtma: <b>tayyor bo'lganda xabar keladi</b></>, ru: <>📱 Заказ заранее: <b>придёт сообщение, когда будет готово</b></> })}<span className="eye-cta" style={{ background: active === "oquvchi" ? T.accent : T.ink3 }}>{tr2({ uz: "Buyurtma berish", ru: "Заказать" })}</span></div>
                    <div className={"eye-row " + (active === "sotuvchi" ? "hot" : "")}>{tr2({ uz: <>📋 Bugungi buyurtmalar: <b>7 ta</b> — 3 tasi yangi</>, ru: <>📋 Заказы на сегодня: <b>7</b> — из них 3 новых</> })}</div>
                    <div className={"eye-row " + (active === "ofis" ? "hot" : "")}>{tr2({ uz: <>🔁 Oxirgi buyurtma: <b>bir bosishda takrorlash</b></>, ru: <>🔁 Последний заказ: <b>повторить одним нажатием</b></> })}</div>
                  </div>
                </div>
              </div>
            </div>
            {!active && <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Chapdan odamni tanlang — u qaraydigan qator saytda yonadi.", ru: "Выберите человека слева — строка, на которую он смотрит, подсветится." })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 3-savol", ru: "Задание · вопрос 3" }}
  questionText="Do'stingizga birinchi qaysi savolni berasiz?"
  question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>Vaziyatni yeching</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Do'stingiz: «Zo'r sayt qilmoqchiman, lekin <span className="italic" style={{ color: T.accent }}>nimadan boshlashni</span> bilmayapman» — deydi. Unga birinchi qaysi savolni berasiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Разберите ситуацию</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Друг говорит: «Хочу сделать классный сайт, но не знаю, <span className="italic" style={{ color: T.accent }}>с чего начать</span>». Какой вопрос зададите ему первым?</h2></> }}
  options={[{ uz: "«Sayt qanday zamonaviy dizaynda va rangda bo'ladi?»", ru: "«Какой у сайта будет современный дизайн и цвет?»" }, { uz: "«Saytga qancha pul, vaqt va odam kuchi sarflanadi?»", ru: "«Сколько денег, времени и людей уйдёт на сайт?»" }, { uz: "«Sayt aniq kimga kerak va qanday muammosini yechadi?»", ru: "«Кому именно нужен сайт и какую его проблему он решает?»" }, { uz: "«Saytga qanday zo'r va yodda qoladigan nom topamiz?»", ru: "«Какое классное и запоминающееся имя придумаем сайту?»" }]}
  correctIdx={2}
  explainCorrect={{ uz: "Barakalla! Mahsulot menejeri ham aynan shu savoldan boshlaydi: KIM va MUAMMO aniq bo'lsa, dizayn ham, nom ham, hatto qancha vaqt ketishi ham o'z-o'zidan ayon bo'ladi.", ru: "Молодец! Продакт-менеджер начинает ровно с этого вопроса: когда ясны КТО и ПРОБЛЕМА, дизайн, название и даже сроки становятся понятны сами собой." }}
  explainWrong={{
    0: { uz: "Dizayn haqida so'rash to'g'ri — lekin keyinroq: kim uchunligini bilmasangiz, qanday dizayn yoqishini ham bilolmaysiz.", ru: "Про дизайн спросить правильно — но позже: не зная, для кого сайт, не поймёшь, какой дизайн понравится." },
    1: { uz: "Muhim savol, lekin birinchisi emas: nima qurilishini bilmasdan turib qancha vaqt va pul ketishini hisoblab bo'lmaydi.", ru: "Важный вопрос, но не первый: не зная, что строим, нельзя посчитать время и деньги." },
    3: { uz: "Nom kerak, ammo u eng oxirgi bezak. Avval sayt kimga va qanday muammo bilan kerakligi aniqlanadi.", ru: "Название нужно, но это самый последний штрих. Сначала выясняют, кому сайт нужен и с какой проблемой." },
    default: { uz: "Birinchi savol doim bitta: sayt aniq KIMGA kerak va qanday MUAMMONI yechadi?", ru: "Первый вопрос всегда один: КОМУ именно нужен сайт и какую ПРОБЛЕМУ он решает?" }
  }}
/>;
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate11 = useContext(LiveGateCtx) || {};
  const live11 = gate11.live;
  const isMentor11 = !!(live11 && live11.mode === "mentor");
  const GROUPS = {
    mijoz: { kim: { uz: "Birinchi marta kelgan yangi mijoz", ru: "Новый клиент, пришедший впервые" }, muammo: { uz: "Menyuda nima borligini va narxini bilmaydi", ru: "Не знает, что в меню и сколько это стоит" }, yechim: { uz: "Menyu va narxlarni rasm bilan ko'rsatadigan sahifa", ru: "Страница с меню и ценами в картинках" } },
    oquvchi: { kim: { uz: "Tanaffusda shoshgan maktab o'quvchisi", ru: "Школьник, который спешит на перемене" }, muammo: { uz: "Navbat uzun — tanaffusga ulgurmaydi", ru: "Очередь длинная — не успевает за перемену" }, yechim: { uz: "Oldindan buyurtma qilib, kelib olib ketish sahifasi", ru: "Страница: заказать заранее и забрать" } },
    ofis: { kim: { uz: "Har kuni tushlik oladigan ofis xodimi", ru: "Офисный работник, который каждый день берёт обед" }, muammo: { uz: "Har safar telefon qilib buyurtma berishga to'g'ri keladi", ru: "Каждый раз приходится звонить, чтобы заказать" }, yechim: { uz: "Doimiy tushlik-buyurtmani bir marta yozib qo'yadigan sahifa", ru: "Страница, где постоянный обед-заказ записывают один раз" } }
  };
  const ROWS = [
    { key: "kim", label: { uz: "KIM", ru: "КТО" }, ic: Ico.user(18), color: SLOT.kim, order: ["mijoz", "oquvchi", "ofis"] },
    { key: "muammo", label: { uz: "MUAMMO", ru: "ПРОБЛЕМА" }, ic: Ico.problem(18), color: SLOT.muammo, order: ["oquvchi", "ofis", "mijoz"] },
    { key: "yechim", label: { uz: "YECHIM", ru: "РЕШЕНИЕ" }, ic: Ico.solution(18), color: SLOT.yechim, order: ["ofis", "mijoz", "oquvchi"] }
  ];
  const AVA = { mijoz: "🙋", oquvchi: "🎒", ofis: "🧑‍💼" };
  const keys = ["kim", "muammo", "yechim"];
  const restored = !!(storedAnswer && storedAnswer.correct && GROUPS[storedAnswer.group]);
  const g0 = restored ? storedAnswer.group : null;
  const restoredRef = useRef2(restored);
  const [pick, setPick] = useState2({ kim: g0, muammo: g0, yechim: g0 });
  const [confirmed, setConfirmed] = useState2({ kim: restored, muammo: restored, yechim: restored });
  const step = !confirmed.kim ? "kim" : !confirmed.muammo ? "muammo" : !confirmed.yechim ? "yechim" : "done";
  const set = (k, g) => setPick((prev) => ({ ...prev, [k]: prev[k] === g ? null : g }));
  const META = { kim: ROWS[0], muammo: ROWS[1], yechim: ROWS[2] };
  const low = (s) => s ? s[0].toLowerCase() + s.slice(1) : "";
  const [state, setState] = useState2(restored ? "convert" : "idle");
  const timer = useRef2(null);
  useEffect2(() => () => clearTimeout(timer.current), []);
  const firstRun = useRef2(true);
  useEffect2(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    clearTimeout(timer.current);
    setState((s) => s === "convert" ? s : "idle");
  }, [pick.kim, pick.muammo, pick.yechim]);
  useEffect2(() => {
    if (confirmed.kim || pick.kim === null) return;
    const t = setTimeout(() => setConfirmed((c) => ({ ...c, kim: true })), 550);
    return () => clearTimeout(t);
  }, [pick.kim, confirmed.kim]);
  const showToOwner = () => {
    if (step !== "muammo" && step !== "yechim" || !pick[step]) return;
    clearTimeout(timer.current);
    setState("showing");
    timer.current = setTimeout(() => {
      if (step === "muammo") {
        if (pick.muammo !== pick.kim) {
          setState("reject-p");
          return;
        }
        setState("recognize");
        timer.current = setTimeout(() => {
          setConfirmed((c) => ({ ...c, muammo: true }));
          setState("idle");
        }, 1400);
      } else {
        if (pick.yechim !== pick.kim) {
          setState("reject-s");
          return;
        }
        setConfirmed((c) => ({ ...c, yechim: true }));
        setState("convert");
      }
    }, 850);
  };
  const busy = state === "showing" || state === "recognize";
  const converted = state === "convert";
  const leaving = state === "reject-p" || state === "reject-s";
  const reopen = (k) => {
    if (converted) return;
    clearTimeout(timer.current);
    setState("idle");
    setPick((p) => ({ ...p, [k]: null }));
    setConfirmed((c) => {
      const n = { ...c };
      keys.slice(keys.indexOf(k)).forEach((kk) => {
        n[kk] = false;
      });
      return n;
    });
  };
  useEffect2(() => {
    if (converted && storedAnswer === void 0) {
      onAnswer(screen, { correct: true, group: pick.kim });
      if (live11 && live11.mode === "student") live11.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
  }, [converted]);
  const BUBBLE = {
    mijoz: {
      showing: { uz: "…", ru: "…" },
      recognize: { uz: "Ha, aynan! Menyuda nima bor, narxi qancha — bilmayman.", ru: "Да, точно! Я не знаю, что в меню и сколько стоит." },
      convert: { uz: "Zo'r! Endi kelishdan oldin menyu va narxni ko'rib olaman!", ru: "Отлично! Теперь я посмотрю меню и цены ещё до прихода!" },
      "reject-p": { uz: "Menda bunday qiyinchilik yo'q — mening tashvishim boshqa…", ru: "У меня нет такой трудности — меня беспокоит другое…" },
      "reject-s": { uz: "Qiyinchiligim shu, ammo bu sahifa menga yordam bermaydi…", ru: "Трудность моя, но эта страница мне не помогает…" }
    },
    oquvchi: {
      showing: { uz: "…", ru: "…" },
      recognize: { uz: "Xuddi men! Tanaffus qisqa — navbatga ulgurmayman.", ru: "Это про меня! Перемена короткая — я не успеваю в очереди." },
      convert: { uz: "Buni kutgandim! Endi oldindan buyurtma qilib, olib ketaveraman!", ru: "Я этого ждал! Теперь закажу заранее и просто заберу!" },
      "reject-p": { uz: "Bu mening qiyinchiligim emas…", ru: "Это не моя трудность…" },
      "reject-s": { uz: "Qiyinchiligim to'g'ri, lekin bundan menga foyda yo'q…", ru: "Трудность верная, но пользы мне от этого нет…" }
    },
    ofis: {
      showing: { uz: "…", ru: "…" },
      recognize: { uz: "Ha, bu men! Har kuni telefon qilib buyurtma beraman.", ru: "Да, это я! Каждый день звоню, чтобы заказать." },
      convert: { uz: "Aynan menga kerak — bir marta yozib qo'yaman va tinchiyman!", ru: "Это как раз для меня — запишу один раз и забуду про заботу!" },
      "reject-p": { uz: "Menda bunday qiyinchilik yo'q…", ru: "У меня нет такой трудности…" },
      "reject-s": { uz: "To'g'ri, lekin bu menga to'g'ri kelmaydi…", ru: "Верно, но мне это не подходит…" }
    }
  };
  const showTurn = useTurnHint((step === "muammo" || step === "yechim") && !!pick[step] && state === "idle");
  const btnLabel = converted ? { uz: "✓ Qabul qildi", ru: "✓ Принял" } : busy ? { uz: "Ko'rmoqda…", ru: "Смотрит…" } : !pick[step] ? step === "muammo" ? { uz: "② Avval muammoni tanlang", ru: "② Сначала выберите проблему" } : { uz: "③ Avval yechimni tanlang", ru: "③ Сначала выберите решение" } : leaving ? { uz: "↻ Qayta ko'rsatish", ru: "↻ Показать ещё раз" } : { uz: "👀 Egasiga ko'rsating", ru: "👀 Покажите владельцу" };
  const navLabel = converted || isMentor11 ? { uz: "Davom etish", ru: "Продолжить" } : step === "kim" ? { uz: "① Avval KIMni tanlang", ru: "① Сначала выберите КТО" } : step === "muammo" ? { uz: "② Muammoni tanlab, egasiga ko'rsating", ru: "② Выберите проблему и покажите владельцу" } : { uz: "③ Yechimni tanlab, egasiga ko'rsating", ru: "③ Выберите решение и покажите владельцу" };
  return <Stage eyebrow={{ uz: "Kartani yig'ing", ru: "Соберите карточку" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!converted} disabled={!converted && !isMentor11} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta odamni tanlang va <span className="italic" style={{ color: T.accent }}>kartasini</span> yig'ing.</>, ru: <>Выберите одного человека и соберите <span className="italic" style={{ color: T.accent }}>его карточку</span>.</> })}</h2></div>
        <Mentor key={step}>{step === "kim" ? { uz: <>Karta bo'lak-bo'lak yig'iladi. Avval <b style={{ color: SLOT.kim }}>KIM</b>ni tanlang — sayt kimga kerak? Istalgan odamni tanlashingiz mumkin, ammo keyingi bo'laklar <b style={{ color: T.ink }}>aynan shu odamga</b> mos bo'lishi shart.</>, ru: <>Карточка собирается по частям. Сначала выберите <b style={{ color: SLOT.kim }}>КТО</b> — кому нужен сайт? Человека можно взять любого, но следующие части обязаны подойти <b style={{ color: T.ink }}>именно ему</b>.</> } : step === "muammo" ? { uz: <><b style={{ color: SLOT.kim }}>{tr2(GROUPS[pick.kim].kim)}</b> — tanlandi. Endi uchta muammodan aynan <b style={{ color: T.ink }}>shu odamnikini</b> toping-da, <b style={{ color: T.ink }}>«👀 Egasiga ko'rsating»</b>ni bosing: to'g'ri yoki noto'g'ri ekanini u o'zi aytadi.</>, ru: <><b style={{ color: SLOT.kim }}>{tr2(GROUPS[pick.kim].kim)}</b> — выбран. Теперь из трёх проблем найдите <b style={{ color: T.ink }}>именно его</b> и нажмите <b style={{ color: T.ink }}>«👀 Покажите владельцу»</b>: верно или нет, он скажет сам.</> } : step === "yechim" ? { uz: <>Muammo tanildi! Oxirgi bo'lak: <b style={{ color: SLOT.yechim }}>YECHIM</b> aynan o'sha qiyinchilikni hal qilsin. Tanlang-da, yana egasiga ko'rsating.</>, ru: <>Проблему узнали! Последняя часть: <b style={{ color: SLOT.yechim }}>РЕШЕНИЕ</b> должно закрывать именно эту трудность. Выберите и снова покажите владельцу.</> } : { uz: <>Karta to'liq — egasi qabul qildi! Uchala bo'lak bitta odamniki bo'lgani uchun ishladi. Haqiqiy g'oya ham xuddi shunday tekshiriladi.</>, ru: <>Карточка полная — владелец её принял! Сработало потому, что все три части про одного человека. Настоящую идею проверяют точно так же.</> }}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            {ROWS.map((r, ri) => {
    const isDone = confirmed[r.key];
    const isActive = step === r.key;
    if (isDone) return <div key={`${r.key}-done`} className="g11-donerow el-in" style={{ borderLeftColor: r.color }}>
                  <span className="g11-done-ic" style={{ background: r.color }}>{Ico.check(12)}</span>
                  <span className="mono g11-done-lbl" style={{ color: r.color }}>{tr2(r.label)}</span>
                  <span className="g11-done-val">{r.key === "kim" && <span aria-hidden="true">{AVA[pick.kim]} </span>}{tr2(GROUPS[pick[r.key]][r.key])}</span>
                  {!converted && <button className="g11-redo" onClick={() => reopen(r.key)} aria-label={tr2({ uz: `${tr2(r.label)}ni o'zgartirish`, ru: `Изменить: ${tr2(r.label)}` })}>↻</button>}
                </div>;
    if (!isActive) return <div key={`${r.key}-lock`} className="g11-lockrow">
                  <span className="g11-num" style={{ background: `${T.ink3}66` }}>{ri + 1}</span>
                  <span>{tr2(r.label)}{tr2({ uz: " — keyingi qadam", ru: " — следующий шаг" })}</span>
                </div>;
    return <div key={`${r.key}-act`} className={`g11-group fade-up ${pick[r.key] === null ? "g11-live" : ""}`}>
                  <p className="g11-glabel" style={{ color: r.color }}><span className="g11-num" style={{ background: r.color }}>{ri + 1}</span>{tr2({ uz: <>{tr2(r.label)}ni tanlang</>, ru: <>Выберите {tr2(r.label)}</> })}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {r.order.map((g) => {
      const sel = pick[r.key] === g;
      return <button
        key={g}
        className={`g11-opt ${sel ? "sel" : ""}`}
        onClick={() => set(r.key, g)}
        style={sel ? { background: r.color, color: "#fff", boxShadow: `0 8px 18px -7px ${r.color}` } : void 0}
      >
                          <span className="g11-tick" style={{ borderColor: sel ? "rgba(255,255,255,0.9)" : `${r.color}55`, color: "#fff" }}>{sel && Ico.check(12)}</span>
                          <span style={{ flex: 1 }}>{tr2(GROUPS[g][r.key])}</span>
                        </button>;
    })}
                  </div>
                </div>;
  })}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Yig'ilayotgan karta", ru: "Собираемая карточка" })}</p>
            <div className={`algo-build pm-ticket ${converted ? "pm-match" : ""}`} style={{ minHeight: 150, gap: 9 }}>
              {keys.map((k) => {
    const g = pick[k];
    return <div key={k} className={`g11-slot ${g ? "filled" : ""}`} style={g ? { borderLeftColor: META[k].color } : void 0}>
                    <span className="mono g11-slabel" style={{ color: g ? META[k].color : T.ink3 }}>{tr2(META[k].label)}</span>
                    {g ? <span key={g} className="g11-val el-in">
                        <span style={{ color: META[k].color, display: "inline-flex", flexShrink: 0 }}>{META[k].ic}</span>
                        {tr2(GROUPS[g][k])}
                      </span> : <span className="g11-empty">{tr2({ uz: "tanlanmagan…", ru: "не выбрано…" })}</span>}
                  </div>;
  })}
            </div>
            {
    /* 👀 Egasiga ko'rsatish — qahramon-reaksiya, endi har bosqichda (muammo, so'ng yechim) */
  }
            {(step === "muammo" || step === "yechim" || converted) && <button className={`pm-show-btn ${converted ? "done" : ""}${showTurn ? " turn-ring" : ""}`} disabled={converted || !pick[step] || busy} onClick={showToOwner}>{tr2(btnLabel)}</button>}
            {state !== "idle" && pick.kim && <div className={`pm-react ${converted ? "ok" : leaving ? "no" : "read"} fade-step`} key={state + pick.kim}>
                <span className={`pm-ava ${leaving ? "leaving" : ""} ${converted || state === "recognize" ? "happy" : ""} ${state === "showing" ? "reading" : ""}`} aria-hidden="true">{AVA[pick.kim]}</span>
                <div className="pm-bubble">
                  <span className="pm-who">{tr2(GROUPS[pick.kim].kim)}</span>
                  <span className={`pm-say ${state === "showing" ? "thinking" : ""}`}>{tr2(BUBBLE[pick.kim][state])}</span>
                  {
    /* «tanildi» bosqich-indikatori — yechimni o'qib chiqish paytini to'lish bilan ko'rsatadi */
  }
                  {state === "recognize" && <span className="pm-reading" aria-hidden="true"><i className="pm-reading-fill" /></span>}
                </div>
              </div>}
            {converted && !restoredRef.current && <Confetti />}
            {converted && <div className="frame-success fade-step pm-match" key={pick.kim}>
                <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: T.success, textTransform: "uppercase", letterSpacing: "0.08em" }}>{tr2({ uz: "Egasiga mos g'oya!", ru: "Идея подошла владельцу!" })}</p>
                <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr2(GROUPS[pick.kim].kim)}</b> — {low(tr2(GROUPS[pick.kim].muammo))}. <span style={{ color: SLOT.yechim, fontWeight: 600 }}>{tr2({ uz: "Yechim:", ru: "Решение:" })}</span> {low(tr2(GROUPS[pick.kim].yechim))}.</p>
              </div>}
            {leaving && <div className="frame-warn fade-step pm-shake" key={"no" + pick.kim + pick.muammo + pick.yechim}>
                <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: AMBER_INK, textTransform: "uppercase", letterSpacing: "0.08em" }}>{tr2({ uz: "Egasiga mos kelmadi", ru: "Владельцу не подошло" })}</p>
                <p className="body" style={{ margin: 0, color: T.ink }}>{state === "reject-p" ? tr2({ uz: <>Bu <b>muammo</b> tanlagan odamniki emas. <b>Muammoni</b> almashtirib, yana ko'rsating.</>, ru: <>Эта <b>проблема</b> не того человека, которого вы выбрали. Поменяйте <b>проблему</b> и покажите снова.</> }) : tr2({ uz: <>Muammosi to'g'ri, lekin <b>yechim</b> uni yechmaydi. <b>Yechimni</b> almashtirib, yana ko'rsating.</>, ru: <>Проблема верная, но <b>решение</b> её не закрывает. Поменяйте <b>решение</b> и покажите снова.</> })}</p>
              </div>}
          </Col>
        </div>
        </Zoomable>
        <MentorPracticeStats live={live11} screen={screen} label={{ uz: "🧩 Kartani yig'ib bo'lganlar", ru: "🧩 Кто собрал карточку" }} />
        <MentorNote>{{ uz: "Jonli darsda bu mashqni o'quvchilar bajaradi — siz kuzatasiz, «Davom etish» siz uchun ochiq. Rad javobidan keyin so'rang: yechim aynan o'sha qiyinchilikni hal qilyaptimi?", ru: "На живом уроке это задание делают ученики — вы наблюдаете, «Продолжить» для вас открыто. После отказа спросите: закрывает ли решение именно эту трудность?" }}</MentorNote>
      </div>
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 4-savol", ru: "Задание · вопрос 4" }}
  questionText="Qaysi g'oya TO'LIQ (kim + muammo + yechim bor)?"
  question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>Mahsulot menejeri ko'zi bilan tekshiring</p><h2 className="title h-ask" style={{ marginTop: 8 }}>To'rtta g'oyadan qaysi biri <span className="italic" style={{ color: T.accent }}>to'liq</span> — KIM + MUAMMO + YECHIM uchchalasi ham bormi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Проверьте глазами продакт-менеджера</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Какая из четырёх идей <span className="italic" style={{ color: T.accent }}>полная</span> — есть все три части: КТО + ПРОБЛЕМА + РЕШЕНИЕ?</h2></> }}
  options={[{ uz: "«Juda chiroyli, zamonaviy va tez sport sayti qilib beramiz»", ru: "«Сделаем очень красивый, современный и быстрый спортивный сайт»" }, { uz: "«O'quvchilar uchun sayt — unda mumkin bo'lgan hamma narsa bo'ladi»", ru: "«Сайт для школьников — на нём будет вообще всё, что можно»" }, { uz: "«Avtobus kutgan o'quvchiga — u qachon kelishini ko'rsatadigan sayt»", ru: "«Школьнику на остановке — сайт, который показывает, когда придёт автобус»" }, { uz: "«Lavash buyurtma qilinadigan qulay sayt — maktabdagi hamma uchun»", ru: "«Удобный сайт для заказа лаваша — для всех в школе»" }]}
  correctIdx={2}
  explainCorrect={{ uz: "Aniq topdingiz! KIM — avtobus kutadigan o'quvchilar, MUAMMO — qachon kelishi noma'lum, YECHIM — vaqtni ko'rsatadigan sayt. Uchchalasi joyida — qurish mumkin!", ru: "Точно! КТО — школьники, ждущие автобус; ПРОБЛЕМА — неизвестно, когда он придёт; РЕШЕНИЕ — сайт, который показывает время. Все три на месте — можно строить!" }}
  explainWrong={{
    0: { uz: "Chiroyli va tez bo'lishi — yomon istak emas. Lekin sport sayti KIMGA kerakligi ham, qanday MUAMMOni yechishi ham aytilmagan.", ru: "Красиво и быстро — неплохое желание. Но не сказано ни КОМУ нужен спортивный сайт, ни какую ПРОБЛЕМУ он решает." },
    1: { uz: "KIM to'g'ri ko'rsatilgan — o'quvchilar. Lekin MUAMMO yozilmagan, «hamma narsa» esa YECHIM emas: nimadan boshlashni bilib bo'lmaydi.", ru: "КТО указан верно — школьники. Но ПРОБЛЕМА не написана, а «всё, что можно» — это не РЕШЕНИЕ: непонятно, с чего начинать." },
    3: { uz: "YECHIM aniq — buyurtma sayti. Lekin «maktabdagi hamma» aniq guruh emas, MUAMMO esa umuman yozilmagan.", ru: "РЕШЕНИЕ ясное — сайт заказа. Но «все в школе» — это не конкретная группа, а ПРОБЛЕМА вообще не написана." },
    default: { uz: "To'liq g'oyada uchchala javob bo'ladi: aniq KIM + aniq MUAMMO + aniq YECHIM.", ru: "В полной идее есть все три ответа: конкретный КТО + конкретная ПРОБЛЕМА + конкретное РЕШЕНИЕ." }
  }}
/>;
var KODING_KEY = "pm-m1d2-koding";
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
var KOD_START_UZ = [
  "<h1>Mening saytim</h1>",
  "<p>Kimga: [KIM]</p>",
  "<p>Qanday muammoga: [MUAMMO]</p>",
  "<p>Qanday yechim: [YECHIM]</p>"
].join("\n");
var KOD_START_RU = [
  "<h1>Мой сайт</h1>",
  "<p>Кому: [КТО]</p>",
  "<p>Какая проблема: [ПРОБЛЕМА]</p>",
  "<p>Какое решение: [РЕШЕНИЕ]</p>"
].join("\n");
var kodStart = () => __lang2 === "ru" ? KOD_START_RU : KOD_START_UZ;
var KOD_CONDS = [
  { id: "kim", label: { uz: "[KIM] almashtirildi", ru: "[КТО] заменено" }, mark: { uz: "Kimga:", ru: "Кому:" }, ph: { uz: "[KIM]", ru: "[КТО]" }, hint: { uz: "Kodda «Kimga:» qatoridagi [KIM] so'zini o'chirib, saytingiz kim uchun ekanini yozing.", ru: "В коде в строке «Кому:» удалите слово [КТО] и напишите, для кого ваш сайт." } },
  { id: "muammo", label: { uz: "[MUAMMO] almashtirildi", ru: "[ПРОБЛЕМА] заменено" }, mark: { uz: "Qanday muammoga:", ru: "Какая проблема:" }, ph: { uz: "[MUAMMO]", ru: "[ПРОБЛЕМА]" }, hint: { uz: "Kodda «Qanday muammoga:» qatoridagi [MUAMMO] so'zini o'chirib, ularning qanday qiyinchiligi borligini yozing.", ru: "В коде в строке «Какая проблема:» удалите слово [ПРОБЛЕМА] и напишите, какая у них трудность." } },
  { id: "yechim", label: { uz: "[YECHIM] almashtirildi", ru: "[РЕШЕНИЕ] заменено" }, mark: { uz: "Qanday yechim:", ru: "Какое решение:" }, ph: { uz: "[YECHIM]", ru: "[РЕШЕНИЕ]" }, hint: { uz: "Kodda «Qanday yechim:» qatoridagi [YECHIM] so'zini o'chirib, saytingiz buni qanday hal qilishini yozing.", ru: "В коде в строке «Какое решение:» удалите слово [РЕШЕНИЕ] и напишите, как ваш сайт это решает." } }
];
var checkKarta = (src) => {
  const res = { hints: {} };
  const lines = src.split(/\r?\n/);
  KOD_CONDS.forEach((c) => {
    let line = "", mark = tr2(c.mark), ph = tr2(c.ph);
    for (const [m, p] of [[c.mark.uz, c.ph.uz], [c.mark.ru, c.ph.ru]]) {
      const l = lines.find((x) => x.indexOf(m) >= 0);
      if (l) {
        line = l;
        mark = m;
        ph = p;
        break;
      }
    }
    const after = line ? line.slice(line.indexOf(mark) + mark.length).replace(/<\/?[a-z0-9]+>/gi, "").trim() : "";
    const ok = !!line && line.indexOf(ph) < 0 && after.length >= 3;
    res[c.id] = ok;
    if (!ok) res.hints[c.id] = !line ? tr2({ uz: "«" + tr2(c.mark) + "» qatori o'chib ketibdi — «Qaytadan» bilan tayyor sahifani qaytaring.", ru: "Строка «" + tr2(c.mark) + "» пропала — верните готовую страницу кнопкой «Заново»." }) : tr2(c.hint);
  });
  return res;
};
var _kartaSrc = null;
var _kartaRes = null;
var kartaOf = (src) => {
  if (src !== _kartaSrc) {
    _kartaSrc = src;
    _kartaRes = checkKarta(src || "");
  }
  return _kartaRes;
};
var KOD_PREVIEW_CSS = `
  body{font-family:Manrope,system-ui,sans-serif;margin:0;padding:22px;color:#1B1630;background:#FBFAFE;line-height:1.5}
  h1{font-family:Georgia,serif;font-size:26px;margin:0 0 14px;color:#5B3DE6}
  p{margin:0 0 10px;font-size:15px;background:#fff;border-left:4px solid #D8CEFA;border-radius:10px;padding:10px 13px;overflow-wrap:anywhere}
`;
var KOD_TASK = {
  eyebrow: { uz: "Koding · auditoriya-karta", ru: "Кодинг · карточка аудитории" },
  title: { uz: "Kartangizni sahifada ko'rsatadigan kod", ru: "Код, который показывает вашу карточку на странице" },
  brief: { uz: <>Sahifa tayyor turibdi. Kvadrat qavs [ ] ichidagi uchta vaqtincha yozuvni — <b>[KIM]</b>, <b>[MUAMMO]</b>, <b>[YECHIM]</b> — kartangizdagi javoblaringizga almashtiring. Qolgan belgilarga tegmang: o'ngdagi sahifa darhol o'zgarib boradi.</>, ru: <>Страница уже готова. Замените три временные надписи в квадратных скобках [ ] — <b>[КТО]</b>, <b>[ПРОБЛЕМА]</b>, <b>[РЕШЕНИЕ]</b> — на ответы из своей карточки. Остальные знаки не трогайте: страница справа меняется сразу.</> },
  previewUrl: "mening-saytim.uz",
  previewCss: KOD_PREVIEW_CSS,
  requirements: KOD_CONDS.map((c) => ({
    id: c.id,
    label: c.label,
    check: checks.custom((x) => {
      const r = kartaOf(x.html);
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
  const [st, setSt] = useState2(() => {
    const saved = readKoding();
    return { code: storedAnswer?.code || saved && saved.code || kodStart(), done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done) };
  });
  const { code, done } = st;
  const [myCard] = useState2(() => readFullCards()[0] || null);
  const openHint = useTurnHint(!done && !open);
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
  return <Stage eyebrow={{ uz: "Koding · 🛠 kompilyator", ru: "Кодинг · 🛠 компилятор" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval kompilyatorda almashtiring", ru: "Сначала замените в компиляторе" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Endi kartangizni <span className="italic" style={{ color: T.accent }}>sahifada</span> ko'rsatamiz.</>, ru: <>Теперь покажем вашу карточку <span className="italic" style={{ color: T.accent }}>на странице</span>.</> })}</h2></div>
        <Mentor>{{ uz: <>Sahifangiz tayyor, faqat uch joyda <b style={{ color: T.ink }}>[KIM]</b>, [MUAMMO], [YECHIM] deb vaqtincha yozib qo'yilgan. Pastdagi «🛠 Kompilyatorni ochish» tugmasini bosing. Kodni yozadigan va natijani darhol ko'rsatadigan oyna ochiladi.</>, ru: <>Страница готова, только в трёх местах временно написано <b style={{ color: T.ink }}>[КТО]</b>, [ПРОБЛЕМА], [РЕШЕНИЕ]. Нажмите кнопку «🛠 Открыть компилятор» ниже. Откроется окно, где пишут код и сразу видят результат.</> }}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        {
    /* 50-qonun: aylantirish-vizual — vaqtincha yozuvlar ➜ o'quvchining O'Z kartasi */
  }
        <div className="stq fade-up delay-1" ref={workRef}>
          <div className="stq-code">
            <span className="stq-code-bar"><span className="bb-dots"><i /><i /><i /></span>index.html</span>
            <code className="stq-code-body">
              <span className="stq-l t">{tr2({ uz: "Kimga: [KIM]", ru: "Кому: [КТО]" })}</span>
              <span className="stq-l m">{tr2({ uz: "Qanday muammoga: [MUAMMO]", ru: "Какая проблема: [ПРОБЛЕМА]" })}</span>
              <span className="stq-l f">{tr2({ uz: "Qanday yechim: [YECHIM]", ru: "Какое решение: [РЕШЕНИЕ]" })}</span>
              <span className="stq-l dim">{tr2({ uz: "← Bu joylarni siz to'ldirasiz", ru: "← Эти места заполняете вы" })}</span>
            </code>
          </div>
          <span className="stq-arrow" aria-hidden="true">➜</span>
          <div className="stq-page">
            <div className="stq-pbar"><span className="bb-dots"><i /><i /><i /></span><span className="stq-purl"><span className="lock">●</span>mening-saytim.uz</span></div>
            <div className="stq-mid">
              <span className="stq-tag">{tr2({ uz: "kartangiz", ru: "ваша карточка" })}</span>
              <p className="kdx-line"><b style={{ color: SLOT.kim }}>{tr2({ uz: "Kimga:", ru: "Кому:" })}</b> {myCard ? myCard.kim : tr2({ uz: "tanaffusda lavash oladigan o'quvchilar", ru: "школьники, которые берут лаваш на перемене" })}</p>
              <p className="kdx-line"><b style={{ color: SLOT.muammo }}>{tr2({ uz: "Qanday muammoga:", ru: "Какая проблема:" })}</b> {myCard ? myCard.muammo : tr2({ uz: "navbat uzun — tanaffusga ulgurishmaydi", ru: "очередь длинная — не успевают за перемену" })}</p>
              <p className="kdx-line"><b style={{ color: SLOT.yechim }}>{tr2({ uz: "Qanday yechim:", ru: "Какое решение:" })}</b> {myCard ? myCard.yechim : tr2({ uz: "oldindan buyurtma qilish sahifasi", ru: "страница заказа заранее" })}</p>
            </div>
          </div>
        </div>
        <div className="stq-cta fade-up delay-2">
          <button className={"kod-launch-btn" + (openHint ? " turn-ring" : "")} onClick={() => {
    setOpen(true);
    writeKodingOpen(true);
  }}>{done ? tr2({ uz: "↻ Kompilyatorni qayta ochish", ru: "↻ Открыть компилятор снова" }) : tr2({ uz: "🛠 Kompilyatorni ochish", ru: "🛠 Открыть компилятор" })}</button>
          {done && <span className="stq-cta-sub">{tr2({ uz: "Bajarildi — xohlasangiz matnni yana tuzatishingiz mumkin", ru: "Выполнено — при желании текст можно ещё поправить" })}</span>}
          {
    /* 89-qonun: takrorlash-yo'li — FAQAT erkin rejimda va FAQAT bajarilmagan holatda.
       Faqat eshikni ochadi: nishon bermaydi, saqlanmaydi, serverga signal yubormaydi. */
  }
          {!done && isSelf && <button className="stq-skip" onClick={onNext}>{tr2({ uz: "✓ Bu mashqni sinfda bajarganman — davom etish →", ru: "✓ Это задание я делал в классе — продолжить →" })}</button>}
        </div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: "center" }}>{tr2({ uz: "✅ Ishladi!", ru: "✅ Получилось!" })} <span className="dm-sub">{tr2({ uz: "— sahifada endi sizning kartangiz turibdi", ru: "— теперь на странице стоит ваша карточка" })}</span></div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "🛠 Almashtirib bo'lganlar", ru: "🛠 Кто заменил" }} />
        <MentorNote>{{ uz: "Teglarni tushuntirib o'tirmang — bu keyingi darsning ishi. 10 daqiqada ulgurmaganlar uyda tugatadi. «Davom etish» siz uchun ochiq.", ru: "Теги не объясняйте — это дело следующего урока. Кто не успел за 10 минут, доделает дома. «Продолжить» для вас открыто." }}</MentorNote>
      </div>
      {
    /* Kod-saqlov kompilyatorning O'ZIDA (`:code`) — dars kaliti `done`/`open` uchun qoladi */
  }
      {open && <HtmlCompiler_default
    lang={__lang2}
    task={KOD_TASK}
    starterCode={code || kodStart()}
    storageKey={`${KODING_KEY}:code`}
    onContinue={finishPractice}
    onBack={() => {
      setOpen(false);
      writeKodingOpen(false);
    }}
  />}
    </Stage>;
};
var REFLECT_KEY = "pm-m1d2-reflect";
function PairTimer({ onStage, muted }) {
  const [st, setSt] = useState2({ running: false, left: 60, done: false });
  const stage = st.running ? "running" : st.done ? "done" : "idle";
  useEffect2(() => {
    if (onStage) onStage(stage);
  }, [stage]);
  const startTurn = useTurnHint(!st.running && !st.done && !muted);
  useEffect2(() => {
    if (!st.running) return;
    if (st.left <= 0) {
      setSt({ running: false, left: 60, done: true });
      return;
    }
    const t = setTimeout(() => setSt((p) => ({ ...p, left: p.left - 1 })), 1e3);
    return () => clearTimeout(t);
  }, [st.running, st.left]);
  const isA = st.left > 30;
  const phaseLeft = isA ? st.left - 30 : st.left;
  const R = 34, C = 2 * Math.PI * R, frac = phaseLeft / 30;
  return <div className="pair-timer">
      {st.running ? <div className="pair-live">
          <div className={"pair-ring " + (isA ? "a" : "b")}>
            <svg width="82" height="82" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r={R} fill="none" stroke={T.line} strokeWidth="7" />
              <circle cx="44" cy="44" r={R} fill="none" stroke={isA ? T.accent : T.success} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 44 44)" style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div className="pair-ring-mid"><span className={"pair-ring-who " + (isA ? "" : "b")}>{isA ? "A" : "B"}</span><span className="pair-ring-sec">{phaseLeft}s</span></div>
          </div>
          <div className="pair-live-txt">
            <span className="pair-now">{tr2({ uz: <>Hozir <span className={"pair-who " + (isA ? "" : "b")}>{isA ? "A" : "B"}</span> gapiradi</>, ru: <>Сейчас говорит <span className={"pair-who " + (isA ? "" : "b")}>{isA ? "A" : "B"}</span></> })}</span>
            <span className="pair-next">{isA ? tr2({ uz: "keyin — B navbati", ru: "потом — очередь B" }) : tr2({ uz: "oxirgi navbat", ru: "последняя очередь" })}</span>
          </div>
        </div> : <p className="pair-now" style={{ margin: 0 }}>{st.done ? tr2({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: "✓ Время вышло — вы оба высказались. Молодцы!" }) : tr2({ uz: "Har biringizga 30 soniyadan — avval A, keyin B.", ru: "По 30 секунд каждому — сначала A, потом B." })}</p>}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? "btn-soft" : "pair-start" + (startTurn ? "" : " calm")} onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? tr2({ uz: "↻ Yana 1 daqiqa", ru: "↻ Ещё 1 минута" }) : tr2({ uz: "▶ 1 daqiqani boshlash", ru: "▶ Запустить 1 минуту" })}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>{tr2({ uz: "⏹ To'xtatish", ru: "⏹ Остановить" })}</button>}
      </div>
    </div>;
}
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const mountTs = useRef2(Date.now());
  const [text, setText] = useState2(() => storedAnswer?.text || (() => {
    try {
      return localStorage.getItem(REFLECT_KEY) || "";
    } catch {
      return "";
    }
  })());
  const save = (v) => {
    setText(v);
    try {
      localStorage.setItem(REFLECT_KEY, v);
    } catch {
    }
  };
  const written = text.trim().length >= 10;
  const [pairStage, setPairStage] = useState2("idle");
  const [reflFocus, setReflFocus] = useState2(false);
  const inputTurn = useTurnHint(pairStage === "done" && !written && !reflFocus);
  const prevOk = useRef2(false);
  useEffect2(() => {
    if (written && !prevOk.current) {
      prevOk.current = true;
      onAnswer(screen, { stage: "final", screenIdx: screen, text, correct: true });
      if (live && live.mode === "student") live.submitAnswer(screen, "s15", 0, true, Date.now() - mountTs.current);
    }
  }, [written]);
  return <Stage eyebrow={{ uz: "Mustahkamlash · 2 qadam", ru: "Закрепление · 2 шага" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} disabled={!written && !isMentor} label={written || isMentor ? { uz: "Davom etish", ru: "Продолжить" } : pairStage === "done" ? { uz: "② Endi bir qator yozing", ru: "② Теперь напишите одну строку" } : { uz: "① Avval sherigingizga ayting", ru: "① Сначала расскажите напарнику" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Saytingiz kim uchun ekanini <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете <span className="italic" style={{ color: T.accent }}>наизусть</span> сказать, для кого ваш сайт?</> })}</h2></div>
        <Mentor>{{ uz: <>Yoddan aytilgan gap eng yaxshi esda qoladi. Ekranga qaramasdan ayting: <b style={{ color: T.ink }}>saytingiz kim uchun</b> va nega aynan shu odamlarni tanladingiz?</>, ru: <>Сказанное наизусть запоминается лучше всего. Не глядя на экран, скажите: <b style={{ color: T.ink }}>для кого ваш сайт</b> и почему вы выбрали именно этих людей?</> }}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr2({ uz: "🗣 Sherigingizga ayting: kimni tanladingiz va nega", ru: "🗣 Расскажите напарнику: кого выбрали и почему" })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr2({ uz: "✍️ Endi bir qator yozing", ru: "✍️ Теперь напишите одну строку" })}</span></div></div>
            <span className={"turn-wrap" + (inputTurn ? " turn-ring" : "")}>
              <input className="reflect-input" value={text} onChange={(e) => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr2({ uz: "Men ... ni tanladim, chunki ...", ru: "Я выбрал ..., потому что ..." })} maxLength={160} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr2({ uz: "✓ Yozildi!", ru: "✓ Записано!" })}</p>}
          </div>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "🗣 Yozib bo'lganlar", ru: "🗣 Кто написал" }} />
        <MentorNote>{{ uz: "Sinfning uchdan biridan ko'pi «nega»ni ayta olmasa — lavash do'koni misolini qayta tushuntiring.", ru: "Если больше трети класса не может объяснить «почему» — объясните пример с лавашной заново." }}</MentorNote>
      </div>
    </Stage>;
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
  return <Stage eyebrow={{ uz: "Natijalar", ru: "Результаты" }} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши <span className="italic" style={{ color: T.accent }}>победители</span> сегодня</> }) : tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>результат</span> сегодня</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — пьедестал 🥇🥈🥉." })}</p></div>
          </div> : !loaded ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Загружаем результаты…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu darsga hali hech kim qo'shilmagan.", ru: "К этому уроку пока никто не подключился." })}</p></div> : <>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> (верно {board[myIdx].okCount}/{totalQ})</> })}</p>}
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
    /* 📊 «Savollar bo'yicha» kartasi ATAYLAB YO'Q (90b-qonun): proyektorda butun
       sinf oldida «0/4» ko'rsatish mag'lubiyat-tablosi bo'ladi. Mentor bu ma'lumotni
       dars PAYTIDA MentorTestStats orqali oladi — o'z joyida. */
  }
          </>}
      </div>
    </Stage>;
};
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: { uz: "KIM", ru: "КТО" }, l: 5, t: 16, s: 30, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: { uz: "MUAMMO", ru: "ПРОБЛЕМА" }, l: 82, t: 12, s: 26, c: "rgba(255,110,70,0.15)", d: 23, dl: 1.5 },
  { ch: { uz: "YECHIM", ru: "РЕШЕНИЕ" }, l: 9, t: 74, s: 26, c: "rgba(120,235,175,0.13)", d: 27, dl: 0.8 },
  { ch: "🎯", l: 78, t: 70, s: 30, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: "💡", l: 46, t: 86, s: 30, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: { uz: "KIM?", ru: "КТО?" }, l: 66, t: 24, s: 24, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: { uz: "nega?", ru: "зачем?" }, l: 24, t: 34, s: 22, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "👤", l: 90, t: 46, s: 24, c: "rgba(203,173,255,0.10)", d: 24, dl: 1.3 },
  { ch: "+", l: 2, t: 46, s: 26, c: "rgba(203,173,255,0.14)", d: 26, dl: 2.6 }
];
var INLINE_KEYS = { s4: 2, s5b: 1, s9: 2, s12: 2, s6: -1, s15: -1 };
var QUIZ_BANK = [
  { q: { uz: "Sayt ENG AVVAL nima uchun yaratiladi?", ru: "Ради чего сайт создают В ПЕРВУЮ ОЧЕРЕДЬ?" }, opts: [{ uz: "Ko'proq odam kirib mashhur bo'lishi uchun", ru: "Чтобы заходило больше людей и он стал популярным" }, { uz: "Egasiga ko'proq pul topib berishi uchun", ru: "Чтобы приносить владельцу больше денег" }, { uz: "Aniq odamning muammosini yechish uchun", ru: "Чтобы решить проблему конкретного человека" }, { uz: "Zamonaviy va chiroyli ko'rinishi uchun", ru: "Чтобы выглядеть современно и красиво" }], correct: 2 },
  { q: { uz: "«Hamma uchun» qilingan sayt aslida…", ru: "Сайт, сделанный «для всех», на деле…" }, opts: [{ uz: "hech kim uchun bo'lib qoladi", ru: "оказывается ни для кого" }, { uz: "eng ko'p odamni o'ziga yig'adi", ru: "собирает больше всего людей" }, { uz: "eng tez va ravon ishlaydi", ru: "работает быстрее и глаже всех" }, { uz: "eng ko'p pul ishlab topadi", ru: "зарабатывает больше всех денег" }], correct: 0 },
  { q: { uz: "Mahsulot menejeri birinchi bo'lib nimani aniqlaydi?", ru: "Что продакт-менеджер выясняет первым?" }, opts: [{ uz: "Sayt dizayni qanday bo'lishi kerakligini", ru: "Каким должен быть дизайн сайта" }, { uz: "KIM va uning qanday MUAMMOSI borligini", ru: "КТО он и какая у него ПРОБЛЕМА" }, { uz: "Saytga qanday zo'r nom topish kerakligini", ru: "Какое классное имя придумать сайту" }, { uz: "Saytga qancha pul va vaqt ketishini", ru: "Сколько денег и времени уйдёт на сайт" }], correct: 1 },
  { q: { uz: "Sayt hech kimning muammosini yechmasa, nima bo'ladi?", ru: "Что будет, если сайт не решает ничьей проблемы?" }, opts: [{ uz: "Sayt tezroq ochiladigan bo'ladi", ru: "Сайт станет открываться быстрее" }, { uz: "Sayt xuddi shunday ishlayveradi", ru: "Сайт будет работать как ни в чём не бывало" }, { uz: "Saytga reklama ko'proq keladi", ru: "На сайт придёт больше рекламы" }, { uz: "Unga hech kim kirmay qo'yadi", ru: "На него перестанут заходить" }], correct: 3 },
  { q: { uz: "To'liq g'oyada qaysi uch javob bo'ladi?", ru: "Какие три ответа есть в полной идее?" }, opts: [{ uz: "KIM + MUAMMO + YECHIM", ru: "КТО + ПРОБЛЕМА + РЕШЕНИЕ" }, { uz: "NOM + RANG + TUGMA", ru: "ИМЯ + ЦВЕТ + КНОПКА" }, { uz: "DIZAYN + REKLAMA + PUL", ru: "ДИЗАЙН + РЕКЛАМА + ДЕНЬГИ" }, { uz: "SAYT + ILOVA + O'YIN", ru: "САЙТ + ПРИЛОЖЕНИЕ + ИГРА" }], correct: 0 },
  { q: { uz: "Lavash do'koni saytiga kirgan O'QUVCHI birinchi nimaga qaraydi?", ru: "На что первым делом смотрит ШКОЛЬНИК на сайте лавашной?" }, opts: [{ uz: "Kelgan buyurtmalar ro'yxatiga", ru: "На список поступивших заказов" }, { uz: "Doimiy buyurtma shartlariga", ru: "На условия постоянного заказа" }, { uz: "Oldindan buyurtma tugmasiga", ru: "На кнопку заказа заранее" }, { uz: "Saytning rangi va bezagiga", ru: "На цвет и оформление сайта" }], correct: 2 },
  { q: { uz: "Mashhurlik va pul — bu…", ru: "Популярность и деньги — это…" }, opts: [{ uz: "muammo yechilganidan keyingi NATIJA", ru: "РЕЗУЛЬТАТ после решённой проблемы" }, { uz: "saytning eng birinchi maqsadi", ru: "самая первая цель сайта" }, { uz: "faqat reklamaga bog'liq bo'lgan narsa", ru: "то, что зависит только от рекламы" }, { uz: "faqat omad va tasodifga bog'liq narsa", ru: "то, что зависит только от удачи и случая" }], correct: 0 },
  { q: { uz: "Qaysi biri ishlashga arziydigan REAL muammo?", ru: "Что из этого — НАСТОЯЩАЯ проблема, над которой стоит работать?" }, opts: [{ uz: "«Saytni chiroyli ko'k rangga bo'yash kerak»", ru: "«Надо покрасить сайт в красивый синий»" }, { uz: "«Saytga zo'r va yodda qoladigan nom kerak»", ru: "«Сайту нужно классное запоминающееся имя»" }, { uz: "«Saytga yana ko'proq tugma qo'shish kerak»", ru: "«Надо добавить на сайт ещё больше кнопок»" }, { uz: "«Bekatda avtobusni qancha kutish noma'lum»", ru: "«На остановке неизвестно, сколько ждать автобус»" }], correct: 3 },
  { q: { uz: "Do'stingiz g'oyasida MUAMMO katagi bo'sh. Bu nimani bildiradi?", ru: "В идее друга клетка ПРОБЛЕМА пустая. О чём это говорит?" }, opts: [{ uz: "G'oya baribir to'liq va tayyor", ru: "Идея всё равно полная и готовая" }, { uz: "Sayt nima uchun kerakligi noma'lum", ru: "Непонятно, зачем нужен сайт" }, { uz: "Faqat dizayn qismi yetishmayapti", ru: "Не хватает только части с дизайном" }, { uz: "Faqat yaxshi nom yetishmayapti", ru: "Не хватает только хорошего имени" }], correct: 1 },
  { q: { uz: "Bitta saytga kiradigan har xil odamlar (o'quvchi, sotuvchi, ofis xodimi)…", ru: "Разные люди на одном сайте (школьник, продавец, офисный работник)…" }, opts: [{ uz: "hammasi bir xil narsani izlaydi", ru: "все ищут одно и то же" }, { uz: "faqat dizaynga qaraydi", ru: "смотрят только на дизайн" }, { uz: "har biri O'ZINIKINI izlaydi", ru: "каждый ищет СВОЁ" }, { uz: "faqat narxga qaraydi", ru: "смотрят только на цену" }], correct: 2 },
  { q: { uz: "Yechim qanday bo'lishi SHART?", ru: "Каким РЕШЕНИЕ обязано быть?" }, opts: [{ uz: "Iloji boricha kattaroq", ru: "Как можно более крупным" }, { uz: "Aynan o'sha muammoga mos", ru: "Подходящим именно к той проблеме" }, { uz: "Hammaga birdek yoqadigan", ru: "Нравящимся всем одинаково" }, { uz: "Eng zamonaviy uslubda", ru: "В самом современном стиле" }], correct: 1 },
  { q: { uz: "«Tanaffusda shoshgan o'quvchilar uchun lavashni oldindan buyurtma qilish» — bu g'oyada nima aniq?", ru: "«Заказ лаваша заранее для школьников, которые спешат на перемене» — что в этой идее ясно?" }, opts: [{ uz: "Faqat YECHIM qismi aniq", ru: "Ясна только часть РЕШЕНИЕ" }, { uz: "Faqat KIM aniq, qolgani yo'q", ru: "Ясно только КТО, остальное нет" }, { uz: "Hech narsa umuman aniq emas", ru: "Вообще ничего не ясно" }, { uz: "KIM ham, MUAMMO ham, YECHIM ham", ru: "И КТО, и ПРОБЛЕМА, и РЕШЕНИЕ" }], correct: 3 }
];
var quizPts = (elapsedMs) => elapsedMs <= 500 ? 1e3 : Math.max(0, Math.round(1e3 * (1 - Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS / 2)));
var quizScore = (rows) => {
  const byQ = {};
  rows.forEach((r) => {
    byQ[r.screen_idx - QUIZ_BASE_IDX] = r;
  });
  let pts = 0, streak = 0, maxStreak = 0, ok = 0;
  for (let i = 0; i < QUIZ_BANK.length; i++) {
    const a = byQ[i];
    if (a && a.correct) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      ok++;
      pts += quizPts(a.elapsed_ms) + (streak >= 2 ? 100 : 0);
    } else streak = 0;
  }
  return { pts, ok, maxStreak };
};
function QzTimer({ remaining }) {
  const R = 26, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, remaining / QUIZ_MS));
  const sec = Math.ceil(remaining / 1e3);
  const col = remaining > 1e4 ? "#2BD97C" : remaining > 5e3 ? "#FFC94D" : "#FF5A5A";
  return <div className={`qz-timer ${remaining <= 5e3 && remaining > 0 ? "urgent" : ""}`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 0.12s linear, stroke 0.4s" }} />
      </svg>
      <span className="qz-timer-n" style={{ color: col }}>{sec}</span>
    </div>;
}
var QzBolt = ({ size = 72 }) => <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="qz-bolt">
    <defs><linearGradient id="qzbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#FF4F28" /></linearGradient></defs>
    <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#qzbg)" />
    <path d="M56 12 L28 54 L45 54 L38 88 L72 40 L53 40 Z" fill="#fff" stroke="#E23A16" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="76" cy="24" r="3.5" fill="#FFD9A8" /><circle cx="22" cy="72" r="2.6" fill="#FFD9A8" /><circle cx="80" cy="66" r="2.2" fill="#FFD9A8" />
  </svg>;
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
function QzFX() {
  const ref = useRef2(null);
  useEffect2(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const ctx = cv.getContext("2d");
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => {
      W = cv.width = Math.max(1, cv.offsetWidth * DPR);
      H = cv.height = Math.max(1, cv.offsetHeight * DPR);
    };
    size();
    window.addEventListener("resize", size);
    const TOK = __lang2 === "ru" ? ["КТО", "ПРОБЛЕМА", "РЕШЕНИЕ", "🎯", "💡", "👤", "зачем?", "+"] : ["KIM", "MUAMMO", "YECHIM", "🎯", "💡", "👤", "nega?", "+"];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.28, sw: 0.3 + Math.random() * 0.6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: 0.4 + Math.random() * 0.9, vx: (Math.random() - 0.5) * 0.16, t: TOK[i % TOK.length], r: (Math.random() - 0.5) * 0.5 });
    const draw = (tm) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of em) {
        p.y -= (0.15 + p.z * 0.35) * DPR;
        p.x += Math.sin(tm / 1400 + p.ph) * p.sw * DPR * 0.35;
        if (p.y < -12) {
          p.y = H + 12;
          p.x = Math.random() * W;
        }
      }
      ctx.lineWidth = 1 * DPR;
      for (let a = 0; a < em.length; a++) for (let b = a + 1; b < em.length; b++) {
        const dx = em[a].x - em[b].x, dy = em[a].y - em[b].y, d = Math.sqrt(dx * dx + dy * dy), mx = 95 * DPR;
        if (d < mx) {
          ctx.strokeStyle = "rgba(150,95,255," + 0.11 * (1 - d / mx) + ")";
          ctx.beginPath();
          ctx.moveTo(em[a].x, em[a].y);
          ctx.lineTo(em[b].x, em[b].y);
          ctx.stroke();
        }
      }
      for (const p of em) {
        const s = (1.3 + p.z * 2.2) * DPR, tw = 0.22 + p.z * 0.3 + Math.sin(tm / 600 + p.ph) * 0.1;
        ctx.fillStyle = "rgba(205,175,255," + tw + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, 6.29);
        ctx.fill();
      }
      for (const t of toks) {
        t.x += t.vx * DPR;
        t.y -= (0.08 + t.z * 0.12) * DPR;
        if (t.y < -34) t.y = H + 34;
        if (t.x < -50) t.x = W + 50;
        if (t.x > W + 50) t.x = -50;
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.r * 0.12);
        ctx.font = "700 " + (13 + t.z * 22) * DPR + 'px "JetBrains Mono",monospace';
        ctx.fillStyle = "rgba(190,150,255," + (0.05 + t.z * 0.07) + ")";
        ctx.textAlign = "center";
        ctx.fillText(t.t, 0, 0);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);
  return <canvas ref={ref} className="qz-fx" aria-hidden="true" />;
}
function QuizArena({ live, onClose, startSolo }) {
  const isMentor = live.mode === "mentor";
  const isStudent = live.mode === "student";
  const [soloMode, setSoloMode] = useState2(!!startSolo);
  const solo = soloMode || !isMentor && !isStudent;
  const soloRef = useRef2(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState2("lobby");
  const [qi, setQi] = useState2(-1);
  const [remaining, setRemaining] = useState2(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState2({});
  const [players, setPlayers] = useState2([]);
  const [qRows, setQRows] = useState2([]);
  const [answeredN, setAnsweredN] = useState2(0);
  const [classEnded, setClassEnded] = useState2(false);
  const seenQRef = useRef2(-1);
  const qStartRef = useRef2(0);
  const deadlineRef = useRef2(0);
  const phaseRef = useRef2(phase);
  phaseRef.current = phase;
  useEffect2(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then((rows) => {
      const mine = {};
      rows.filter((r) => r.player_id === live.playerId).forEach((r) => {
        mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms };
      });
      setMyAnswers((m) => ({ ...mine, ...m }));
    }).catch(() => {
    });
  }, []);
  useEffect2(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return;
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || "off", q = row.quiz_q ?? -1;
          if (st === "q" && q !== seenQRef.current) {
            seenQRef.current = q;
            qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700);
            setQi(q);
            setRemaining(deadlineRef.current - Date.now());
            setPhase("q");
            setAnsweredN(0);
          } else if (st === "r") {
            if (q !== seenQRef.current) {
              seenQRef.current = q;
              setQi(q);
            }
            setPhase((p) => p === "done" ? p : "reveal");
          } else if (st === "done") {
            setPhase("done");
          }
        }
        const st1 = row ? row.quiz_state || "off" : null;
        const ph = st1 === "r" ? "reveal" : st1 === "done" ? "done" : st1 === "lobby" ? "lobby" : st1 === "q" ? "q" : phaseRef.current;
        if (on) setClassEnded(!row || row.status === "ended");
        if (ph === "lobby" || ph === "reveal" || ph === "done" || phaseRef.current === "reveal") {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on) {
            setPlayers(pl);
            setQRows(qa);
          }
        } else if (ph === "q" && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on) {
            setPlayers(pl);
            setAnsweredN(qa.length);
          }
        }
      } catch {
      }
      if (on) t = setTimeout(tick, 1200);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, []);
  useEffect2(() => {
    if (phase !== "q") return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase("reveal");
        if (isMentor && !soloRef.current) ctrl("r", seenQRef.current);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]);
  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === "q") {
        seenQRef.current = q;
        qStartRef.current = Date.now();
        deadlineRef.current = Date.now() + QUIZ_MS;
        setQi(q);
        setRemaining(QUIZ_MS);
        setPhase("q");
        setAnsweredN(0);
      } else if (state === "r" || state === "done") {
        setPhase(state === "r" ? "reveal" : "done");
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => {
          setPlayers(pl);
          setQRows(qa);
        }).catch(() => {
        });
      }
    } catch {
    }
  };
  const soloStart = (i) => {
    seenQRef.current = i;
    qStartRef.current = Date.now();
    deadlineRef.current = Date.now() + QUIZ_MS;
    setQi(i);
    setRemaining(QUIZ_MS);
    setPhase("q");
  };
  const soloNext = () => {
    const n = qi + 1;
    if (n >= QUIZ_BANK.length) setPhase("done");
    else soloStart(n);
  };
  const soloReplay = () => {
    setMyAnswers({});
    soloStart(0);
  };
  const startPractice = () => {
    setSoloMode(true);
    setMyAnswers({});
    soloStart(0);
  };
  const answer = (i) => {
    if (phase !== "q" || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers((m) => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase("reveal");
  };
  const streakUpTo = (k) => {
    let s = 0;
    for (let i = 0; i <= k; i++) {
      if (myAnswers[i]?.correct) s++;
      else s = 0;
    }
    return s;
  };
  const myPtsFor = (k) => {
    const a = myAnswers[k];
    if (!a || !a.correct) return 0;
    return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0);
  };
  const board = players.map((p) => {
    const s = quizScore(qRows.filter((r) => r.player_id === p.id));
    return { id: p.id, nickname: p.nickname, ...s };
  }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex((b) => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: "me", screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);
  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  const counts = Q ? Q.opts.map((_, i) => {
    if (solo) return myAnswers[qi]?.picked === i ? 1 : 0;
    let n = qRows.filter((r) => r.screen_idx === QUIZ_BASE_IDX + qi && r.picked === i).length;
    const mine = myAnswers[qi];
    if (mine && mine.picked === i && live.playerId && !qRows.some((r) => r.player_id === live.playerId && r.screen_idx === QUIZ_BASE_IDX + qi)) n++;
    return n;
  }) : [];
  const lastQ = qi >= QUIZ_BANK.length - 1;
  const my = qi >= 0 ? myAnswers[qi] : null;
  const closeArena = () => {
    if (isMentor && !solo && phase !== "done") {
      if (!window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом кнопкой «Продолжить» вы вернётесь ровно на это место.\n\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr2(s.ch)}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {
    /* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */
  }
      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме тренировки" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ, тем больше баллов. Ответы подряд дают 🔥 бонус!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr2({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr2({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Подождите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr2({ uz: "▶ Boshlash", ru: "▶ Начать" })}</button>}
        </div>}

      {
    /* ===== SAVOL ===== */
  }
      {phase === "q" && Q && <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr2({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span> : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : " "}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(tr2(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const pickedThis = my && my.picked === i;
    return <button key={i} className={`qz-tile ${my ? pickedThis ? "picked" : "faded" : ""}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr2(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>;
  })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">{tr2({ uz: "✔ Javob qabul qilindi — natijani kuting…", ru: "✔ Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr2({ uz: "✓ Hamma javob berdi!", ru: "✓ Ответили все!" })}</span>}
              <button className="qz-btn" onClick={() => ctrl("r", qi)}>{tr2({ uz: "⏹ Natijani ochish", ru: "⏹ Открыть результат" })}</button>
            </div>}
        </div>}

      {
    /* ===== NATIJA (reveal) ===== */
  }
      {phase === "reveal" && Q && <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr2({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr2({ uz: "natija", ru: "результат" })}</span>
          </div>
          <h2 className="qz-q">{fmtCode(tr2(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const win = i === Q.correct;
    const pickedThis = my && my.picked === i;
    return <div key={i} className={`qz-tile rv ${win ? "win" : "lose"} ${pickedThis ? "picked" : ""}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr2(o))}</span>
                  <span className="qz-cnt">{win ? "✓ " : ""}{counts[i]}</span>
                </div>;
  })}
          </div>
          {!isMentor && <div className={`qz-res ${my?.correct ? "good" : "bad"}`}>
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? tr2({ uz: ` · 🔥 ketma-ket ${streakUpTo(qi)} ta`, ru: ` · 🔥 подряд ${streakUpTo(qi)}` }) : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz.", ru: "Ошиблись — 0 баллов. Возьмёте на следующем." }) : tr2({ uz: "Vaqt tugadi — 0 ball. Keyingi savolda ulguring.", ru: "Время вышло — 0 баллов. Успейте на следующем вопросе." })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>}
          {!solo && <div className="qz-board">
              <div className="qz-board-h">🏆 TOP-5</div>
              {board.slice(0, 5).map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>)}
            </div>}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : ctrl("q", qi + 1)}>{lastQ ? tr2({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr2({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr2({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr2({ uz: "Keyingi →", ru: "Дальше →" })}</button>}
        </div>}

      {
    /* ===== YAKUN — PODIUM ===== */
  }
      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: "clamp(20px,3.4vw,30px)" }}>{tr2({ uz: "🏆 Test yakunlandi!", ru: "🏆 Тест завершён!" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri`, ru: `баллов · верно ${soloScore.ok}/${QUIZ_BANK.length}` })}{soloScore.maxStreak >= 2 ? tr2({ uz: ` · eng uzun ketma-ketlik 🔥 ${soloScore.maxStreak} ta`, ru: ` · лучшая серия 🔥 ${soloScore.maxStreak}` }) : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr2({ uz: "↻ Qayta ishlash", ru: "↻ Пройти заново" })}</button>
            </div> : <>
              <div className="qz-pod">
                {[1, 0, 2].map((rank) => {
    const b = board[rank];
    return <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? "me" : ""}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : "—"}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr2({ uz: "ball", ru: "б." })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>;
  })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr2({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест заново — тренировка (в таблицу не идёт)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
var HW_TOKENS = [
  { t: { uz: "KIM", ru: "КТО" }, l: 5, tp: 16, s: 12, d: 6.5 },
  { t: { uz: "MUAMMO", ru: "ПРОБЛЕМА" }, l: 78, tp: 12, s: 11, d: 7.5 },
  { t: { uz: "YECHIM", ru: "РЕШЕНИЕ" }, l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: "auditoriya", ru: "аудитория" }, l: 64, tp: 76, s: 12, d: 6 },
  { t: { uz: "karta", ru: "карточка" }, l: 86, tp: 52, s: 10, d: 9 },
  { t: { uz: "lavash", ru: "лаваш" }, l: 34, tp: 8, s: 10, d: 7 },
  { t: "👥", l: 3, tp: 44, s: 13, d: 8.5 }
];
var IDEA_BANK = [
  { id: "togarak", ic: "🏫", muammo: { uz: "To'garak jadvali faqat devorda — uydan ko'rib bo'lmaydi", ru: "Расписание кружка только на стене — из дома не посмотришь" }, yechim: { uz: "Jadval va manzil sayti", ru: "Сайт с расписанием и адресом" } },
  { id: "dokon", ic: "🛒", muammo: { uz: "Mahalla do'konida nima bor-yo'qligini borib ko'rmaguncha bilib bo'lmaydi", ru: "Что есть в магазине у дома — не узнаешь, пока не сходишь" }, yechim: { uz: "Menyu va narxlar sayti", ru: "Сайт с меню и ценами" } },
  { id: "seksiya", ic: "⚽", muammo: { uz: "Sport seksiyasining vaqti va narxini telefon qilib so'rashga to'g'ri keladi", ru: "Время и цену секции приходится узнавать по телефону" }, yechim: { uz: "Mashg'ulot vaqtlari sayti", ru: "Сайт с расписанием тренировок" } },
  { id: "kitob", ic: "📚", muammo: { uz: "Sinfda kimda qaysi kitob borligini hech kim bilmaydi", ru: "Никто не знает, у кого в классе какая книга" }, yechim: { uz: "Kitob almashinuv ro'yxati sayti", ru: "Сайт со списком обмена книгами" } }
];
var ScreenProject = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const saved = demoRead();
  const [sel, setSel] = useState2(saved ? saved.manba : null);
  const [ownM, setOwnM] = useState2(saved && saved.manba === "ozim" ? saved.muammo : "");
  const [ownY, setOwnY] = useState2(saved && saved.manba === "ozim" ? saved.yechim : "");
  const ownOk = ownM.trim().length >= 8 && ownY.trim().length >= 4;
  const done = sel === "ozim" ? ownOk : !!sel;
  const pickBank = (b) => {
    setSel(b.id);
    demoWrite({ muammo: tr2(b.muammo), yechim: tr2(b.yechim), manba: b.id, holat: "tanlangan" });
  };
  const pickOwn = () => setSel("ozim");
  useEffect2(() => {
    if (sel === "ozim" && ownOk) demoWrite({ muammo: ownM.trim(), yechim: ownY.trim(), manba: "ozim", holat: "tanlangan" });
  }, [ownM, ownY, sel]);
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: sel, stage: "practice", screenIdx: screen });
  }, [done]);
  const navLabel = done ? { uz: "Davom etish", ru: "Продолжить" } : sel === "ozim" ? { uz: "Muammo va yechimni yozing", ru: "Впишите проблему и решение" } : { uz: "Muammoni tanlang", ru: "Выберите проблему" };
  return <Stage eyebrow={{ uz: "Demo Day loyihasi", ru: "Проект Demo Day" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Demo Day'da <span className="italic" style={{ color: T.accent }}>qaysi muammoni</span> yechasiz?</>, ru: <>Какую проблему вы решите на <span className="italic" style={{ color: T.accent }}>Demo Day</span>?</> })}</h2></div>
        <Mentor>{{ uz: <>Modul oxirida Demo Day bo'ladi — sahnada <b style={{ color: T.ink }}>o'z saytingizni</b> ko'rsatasiz. Atrofingizdagi bitta muammoni hozir tanlab qo'ying: saytingiz shunga yechim bo'ladi.</>, ru: <>В конце модуля будет Demo Day — вы покажете <b style={{ color: T.ink }}>свой сайт</b> со сцены. Выберите одну проблему вокруг себя прямо сейчас: ваш сайт станет её решением.</> }}</Mentor>
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 680 }}>
          {
    /* Bank 2 ustunda — 720px oynada hamma karta va «Saqlandi» qatori skrollsiz ko'rinsin (110-B) */
  }
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 8 }}>
            {IDEA_BANK.map((b) => {
    const on = sel === b.id;
    return <button key={b.id} className={"hook-option " + (on ? "on" : "")} onClick={() => pickBank(b)}>
                  <span className="radio">{on && <span className="radio-dot" />}</span>
                  <span>{b.ic} {tr2(b.muammo)} <span style={{ color: on ? void 0 : T.ink2 }}>→ {tr2(b.yechim)}</span></span>
                </button>;
  })}
            <button className={"hook-option " + (sel === "ozim" ? "on" : "")} onClick={pickOwn}>
              <span className="radio">{sel === "ozim" && <span className="radio-dot" />}</span>
              <span>✍️ {tr2({ uz: "O'z g'oyam bor", ru: "У меня своя идея" })}</span>
            </button>
          </div>
          {sel === "ozim" && <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 6 }}>
              <input className="reflect-input" value={ownM} onChange={(e) => setOwnM(e.target.value)} placeholder={tr2({ uz: "Qaysi muammo? (masalan: seksiya vaqtini hech kim bilmaydi)", ru: "Какая проблема? (например: никто не знает время секции)" })} />
              <input className="reflect-input" value={ownY} onChange={(e) => setOwnY(e.target.value)} placeholder={tr2({ uz: "Sayt nima qiladi? (masalan: vaqtlar jadvali sayti)", ru: "Что сделает сайт? (например: сайт с расписанием)" })} />
            </div>}
        </div>
        {done && <div className="frame-success fade-step" style={{ maxWidth: 640 }}><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Saqlandi. VS Code darsida mentor aynan shu loyihangizni so'raydi.</>, ru: <>Сохранено. На уроке VS Code ментор спросит именно про этот ваш проект.</> })}</p></div>}
      </div>
    </Stage>;
};
var PM_FLASHCARDS = [
  { front: { uz: "Saytning auditoriyasi — bu kimlar?", ru: "Аудитория сайта — это кто?" }, back: { uz: "Saytdan foyda oladigan aniq odamlar guruhi", ru: "Конкретная группа людей, которой сайт полезен" }, note: { uz: "«hamma» emas — aniq guruh", ru: "не «все» — конкретная группа" } },
  { front: { uz: "«Hamma uchun» qilingan sayt aslida kim uchun bo'lib qoladi?", ru: "Для кого на деле оказывается сайт «для всех»?" }, back: { uz: "Hech kim uchun", ru: "Ни для кого" }, note: { uz: "hech kim o'zi izlaganini topmaydi", ru: "никто не находит того, что искал" } },
  { front: { uz: "Auditoriya-karta 3 ta savolga javob beradi. Qaysilar?", ru: "Карточка аудитории отвечает на 3 вопроса. На какие?" }, back: { uz: "KIM, MUAMMO, YECHIM", ru: "КТО, ПРОБЛЕМА, РЕШЕНИЕ" }, note: { uz: "bittasi yetishmasa — karta to'liq emas", ru: "не хватает одного — карточка неполная" } },
  { front: { uz: "KIM qatoriga nima yoziladi?", ru: "Что пишут в строке КТО?" }, back: { uz: "Saytdan birinchi bo'lib foydalanadigan aniq odamlar guruhi", ru: "Конкретная группа людей, которая первой начнёт пользоваться сайтом" }, note: { uz: "yoshi, kasbi yoki qiziqishi bilan aniqlanadi", ru: "определяется возрастом, профессией или интересом" } },
  { front: { uz: "MUAMMO qatoriga nima yoziladi?", ru: "Что пишут в строке ПРОБЛЕМА?" }, back: { uz: "Bitta aniq qiyinchilik", ru: "Одна конкретная трудность" }, note: { uz: "sayt aynan shu qiyinchilikni yechadi", ru: "сайт решает именно эту трудность" } },
  { front: { uz: "Facebook boshida kimlar uchun ochilgan edi?", ru: "Для кого Facebook открыли вначале?" }, back: { uz: "Faqat bitta universitet talabalari uchun", ru: "Только для студентов одного университета" }, note: { uz: "tor auditoriya — kuchli boshlanish", ru: "узкая аудитория — сильное начало" } },
  { front: { uz: "Bir xil saytga kirgan odamlar nimaga qaraydi?", ru: "На что смотрят люди, зашедшие на один и тот же сайт?" }, back: { uz: "Har kim o'ziga kerak bo'lgan narsani qidiradi", ru: "Каждый ищет то, что нужно именно ему" }, note: { uz: "shuning uchun avval asosiy auditoriya tanlanadi", ru: "поэтому сначала выбирают основную аудиторию" } },
  { front: { uz: "Kuchli sayt nimadan boshlanadi?", ru: "С чего начинается сильный сайт?" }, back: { uz: "Kichik va aniq auditoriyadan", ru: "С небольшой и конкретной аудитории" }, note: { uz: "Facebook ham shunday boshlagan", ru: "Facebook начинал так же" } },
  { front: { uz: "YECHIM qatoriga nima yoziladi?", ru: "Что пишут в строке РЕШЕНИЕ?" }, back: { uz: "Sayt o'sha muammoni qanday yechishi", ru: "Как сайт решает эту проблему" }, note: { uz: "shoshgan o'quvchi uchun — oldindan buyurtma sahifasi", ru: "для спешащего ученика — страница предзаказа" } },
  { front: { uz: "Sayt hech kimning muammosini yechmasa, nima bo'ladi?", ru: "Что будет, если сайт не решает ничьей проблемы?" }, back: { uz: "Unga hech kim kirmay qo'yadi", ru: "На него перестанут заходить" }, note: { uz: "sayt kimningdir aniq qiyinchiligi uchun quriladi", ru: "сайт строят под чью-то конкретную трудность" } }
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
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr2({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{tr2({ uz: `${total}/${total} atama yodlandi`, ru: `Выучено понятий: ${total}/${total}` })}</p><button className="fc-btn ghost" onClick={restart}>{tr2({ uz: "↻ Qaytadan takrorlash", ru: "↻ Повторить заново" })}</button></div>;
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
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect2(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={{ uz: "Takrorlash", ru: "Повторение" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: "Yakunlash →", ru: "Завершить →" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PM_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [arena, setArena] = useState2(false);
  const [arenaSolo, setArenaSolo] = useState2(false);
  const quizSt = live && live.quiz && live.quiz.state || "off";
  const isStudentL = live && live.mode === "student";
  const isMentorL = live && live.mode === "mentor";
  const classOver = !!(live && (live.status === "ended" || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== "done";
  const studentLive = isStudentL && !studentSolo && quizSt !== "off";
  const studentWait = isStudentL && !studentSolo && quizSt === "off";
  const openArena = async () => {
    if (isMentorL && quizSt === "off") {
      try {
        await live.quizControl("lobby", -1);
      } catch {
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const RECAP = [
    { uz: "Auditoriya — saytdan foyda oladigan aniq odamlar guruhi", ru: "Аудитория — конкретная группа людей, которой сайт полезен" },
    { uz: "«Hamma uchun» qilingan sayt odatda hech kimga mos kelmaydi", ru: "Сайт «для всех» обычно не подходит никому" },
    { uz: "Eng katta saytlar ham kichik va aniq auditoriyadan boshlagan", ru: "Даже крупнейшие сайты начинали с маленькой и конкретной аудитории" },
    { uz: "Auditoriya-karta uch javobdan yig'iladi: KIM, MUAMMO, YECHIM", ru: "Карточка аудитории собирается из трёх ответов: КТО, ПРОБЛЕМА, РЕШЕНИЕ" }
  ];
  const [hwNote, setHwNote] = useState2(false);
  const [hwCharge, setHwCharge] = useState2(false);
  const fireHw = () => {
    if (hwCharge) return;
    setHwCharge(true);
    setTimeout(() => {
      setHwNote(true);
      setHwCharge(false);
    }, 500);
  };
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={{ uz: "Tayyor", ru: "Готово" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash", ru: "Завершить" })}</button></>}>
      <div className="screen">
        {PASSED && <Confetti />}
        {
    /* 54-qonun: sarlavha ostidagi h-sub paragrafi YO'Q · 90a: ScoreRing mentorda ko'rinmaydi */
  }
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> {tr2({ uz: "Dars tugadi", ru: "Урок окончен" })}</span><h2 className="title h-title fade-up d1">{isMentorL ? tr2({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>auditoriya-karta</span> tuzishni o'rgandik.</>, ru: <>Сегодня мы научились составлять <span className="italic" style={{ color: T.accent }}>карточку аудитории</span>.</> }) : tr2({ uz: <>Endi siz <span className="italic" style={{ color: T.accent }}>auditoriya-karta</span> tuza olasiz.</>, ru: <>Теперь вы умеете составлять <span className="italic" style={{ color: T.accent }}>карточку аудитории</span>.</> })}</h2></div>{!isMentorL && <ScoreRing correct={correct} total={total} />}</div>
        {
    /* ⚡ CodeStrike — mustahkamlash arenasi CTA */
  }
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark
    stats={false}
    liveOn={studentLive}
    disabled={studentWait}
    onClick={studentWait ? void 0 : openArena}
    hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : studentSolo ? tr2({ uz: "📖 Testni o'zim ishlash", ru: "📖 Пройти тест самому" }) : studentLive ? quizSt === "done" ? tr2({ uz: "🏆 Natijalarni ko'rish", ru: "🏆 Посмотреть результаты" }) : tr2({ uz: "🔥 Testga kirish!", ru: "🔥 Войти в тест!" }) : isMentorL ? quizSt === "off" ? tr2({ uz: "Testni ochish", ru: "Открыть тест" }) : tr2({ uz: "Davom ettirish", ru: "Продолжить" }) : tr2({ uz: "Testni ishlash", ru: "Пройти тест" })}
  />
        </div>
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: "inline-flex" }}>{Ico.check(15)}</span> {tr2({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: "inline-flex" }}>{Ico.check(15)}</span><span>{tr2(r)}</span></li>)}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? "charging" : ""}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, "--d": `${k.d}s` }}>{tr2(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr2({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span>
            <span className="hw-big-s">{tr2({ uz: "Amaliy topshiriqni bajarish →", ru: "Выполнить практическое задание →" })}</span>
          </button>
        </div>
        {hwNote && <p className="hw-cta-note fade-step" style={{ textAlign: "center" }}>{tr2({ uz: "Amaliy vazifa — auditoriya-kartangizni 2 ta tanishingizga ko'rsatib, «Siz shunday saytga kirarmidingiz?» deb so'rang. Javoblarini eshitgach, KIM va MUAMMO qatorlarini aniqroq qilib qayta yozing.", ru: "Задание — покажите свою карточку аудитории двум знакомым и спросите: «Вы зашли бы на такой сайт?». Услышав ответы, перепишите строки КТО и ПРОБЛЕМА точнее." })}</p>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz", ru: "🏅 Ваши награды" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(achievements && achievements.has(id));
    return <div key={id} className={`ach-badge ${got ? "got" : "locked"}`} title={tr2(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : "🔒"}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr2(a.desc)}</span>}
              </div>;
  })}
          </div>
        </div>}
      </div>
      {arena && <QuizArena live={live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
    </Stage>;
};
var ACHIEVEMENTS = {
  audience: { icon: "🎯", name: "Audience Found!", desc: { uz: "O'z auditoriya-kartangizni yozdingiz", ru: "Вы написали свою карточку аудитории" } },
  thinker: { icon: "🧠", name: "Product Mind!", desc: { uz: "Mahsulot menejeridek to'g'ri javob berdingiz", ru: "Вы ответили верно, как продакт-менеджер" } },
  builder: { icon: "💡", name: "Full Card!", desc: { uz: "KIM + MUAMMO + YECHIM — kartani to'liq yig'dingiz", ru: "КТО + ПРОБЛЕМА + РЕШЕНИЕ — вы собрали карточку полностью" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "Mahsulot menejeri darsini to'liq yakunladingiz", ru: "Вы полностью прошли урок продакт-менеджера" } }
};
var ACH_TRIGGERS = { s6: "audience", s9: "thinker", s11: "builder" };
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
function PmLesson1({ lang: langProp, onFinished }) {
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
  const startTimeRef = useRef2(saved?.startedAt || Date.now());
  const earnedRef = useRef2(new Set(saved?.earned || []));
  const [earned, setEarned] = useState2(() => new Set(saved?.earned || []));
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
  const FLASH_IDX = SCREEN_META.findIndex((m) => m.id === "sflash");
  const flashHidden = () => live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const advance = () => setScreen((s) => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  const next = () => advance();
  const prev = () => setScreen((s) => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers((a) => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
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
  useEffect2(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen]);
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, ScreenKeys, Screen5b, Screen6, Screen8, Screen9, Screen11, Screen12, ScreenCoding, Screen15, ScreenPodium, ScreenFlashcards, ScreenProject, Screen16];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        /* Keng ekran etaloni (--lz JS'da hisoblanadi): ≥1920px oynada proportsional kattalashadi */
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
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
        /* Harakat-diyeta (60-qonun): kirish-animatsiyalari o'chirilganda kontent SHU ZAHOTI ko'rinadi,
           takrorlanuvchi (infinite) harakatlar esa butunlay to'xtaydi. */
        @media (prefers-reduced-motion: reduce) {
          .fade-up, .fade-step, .pg-in, .zoom-on, .zoom-backdrop, .step-card, .el-in, .sk-info { animation: none !important; opacity: 1 !important; transform: none !important; }
          .zoom-on { transform: translate(-50%,-50%) !important; }
          .s3-dot { display: none; }
          .s3-scissors, .eye-row.hot, .mstats-reveal.ready, .g11-live .g11-num, .g11-opt.sel,
          .qz-crown, .qz-timer.urgent, .qz-pod-bar, .fc-pill, .pm-match, .pm-shake { animation: none !important; }
        }

        /* === pm animatsiya yaxshilashlari === */
        /* Reja (s1): formula oxirida sayt paydo bo'ladi */
        /* Muammo — o'zak (s3): odam ↔ sayt sahna, kiruvchilar oqimi, qirqilgan ip */
        .s3-scene { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.6vw,24px); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); flex-wrap: wrap; }
        .s3-node { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; min-width: 118px; }
        .s3-face { font-size: 46px; line-height: 1; animation: pmPop 0.45s cubic-bezier(.34,1.55,.5,1); }
        .s3-link { position: relative; flex: 1; min-width: 90px; height: 26px; display: flex; align-items: center; }
        .s3-wire { width: 100%; height: 3px; border-radius: 2px; background: ${T.accent}; transition: all 0.3s; }
        .s3-link.cut .s3-wire { background: transparent; border-top: 2.5px dashed ${T.ink3}; height: 0; }
        .s3-scissors { position: absolute; left: 50%; top: 50%; font-size: 20px; animation: pm-snip 0.55s cubic-bezier(.34,1.5,.5,1) forwards; }
        @keyframes pm-snip { 0% { transform: translate(-50%,-50%) scale(0) rotate(-40deg); } 60% { transform: translate(-50%,-50%) scale(1.35) rotate(12deg); } 100% { transform: translate(-50%,-50%) scale(1) rotate(0); } }
        .s3-dot { position: absolute; top: 50%; width: 9px; height: 9px; margin-top: -4.5px; border-radius: 99px; background: ${T.accent}; box-shadow: 0 0 7px rgba(91,61,230,0.6); animation: s3-flow 1.7s linear infinite; }
        .s3-dot.d2 { animation-delay: 0.55s; } .s3-dot.d3 { animation-delay: 1.15s; }
        @keyframes s3-flow { 0% { left: 0; opacity: 0; } 12% { opacity: 1; } 86% { opacity: 1; } 100% { left: calc(100% - 9px); opacity: 0; } }
        .s3-site { flex: 1.35; min-width: 235px; display: flex; flex-direction: column; gap: 7px; transition: filter 0.5s ease, opacity 0.5s ease; }
        .s3-site.off { filter: grayscale(1); opacity: 0.45; }
        .s3-visit { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.success}; animation: fade-step 0.4s ease; }
        .s3-visit.zero { color: ${T.ink3}; }
        /* Amaliyot (s6): kartalar ro'yxati */
        /* Har xil odam (s8): saytga «uning ko'zi bilan» qarash */
        .eye-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 10px 12px; transition: all 0.3s ease; }
        .eye-row.hot { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; animation: eye-pulse 1.3s ease-in-out infinite; }
        @keyframes eye-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 0 rgba(91,61,230,0.25); } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 6px rgba(91,61,230,0); } }
        .eye-cta { margin-left: auto; color: #fff; font-weight: 700; font-size: 11.5px; border-radius: 8px; padding: 5px 11px; transition: background 0.3s; }
        /* Ulash o'yini (s10): ko'priklar */
        @keyframes bridge-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        /* Muhr (s11, s13): MOS ✓ / MOS EMAS / TO'LIQ ✓ */
        .pm-ticket { position: relative; }
        @keyframes pm-stamp { 0% { transform: rotate(-8deg) scale(2.4); opacity: 0; } 55% { transform: rotate(-8deg) scale(0.94); opacity: 1; } 100% { transform: rotate(-8deg) scale(1); opacity: 1; } }
        /* 👀 «Egasiga ko'rsat» — tugma + qahramon reaksiyasi (holat-mashina skeleti; harakat sifati Animatsiya, rang Dizayn) */
        .pm-show-btn { align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; border: none; border-radius: 12px; padding: 11px 20px; cursor: pointer; color: #fff; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); box-shadow: 0 10px 24px -10px rgba(91,61,230,0.6); transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s; }
        .pm-show-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .pm-show-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
        .pm-show-btn.done { background: ${T.success}; box-shadow: 0 10px 24px -10px ${T.success}; }
        .pm-react { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 8px 22px -12px rgba(${T.shadowBase},0.28); border: 1.5px solid ${T.line}; }
        .pm-react.ok { border-color: ${T.success}66; background: ${T.successSoft}; }
        .pm-react.no { border-color: ${T.accent}66; background: ${T.accentSoft}; }
        .pm-ava { font-size: 34px; line-height: 1; flex-shrink: 0; transition: transform 0.3s ease; }
        .pm-ava.happy { animation: pm-ava-hop 0.6s ease; }
        .pm-ava.reading { animation: pm-ava-read 1.1s ease-in-out infinite; }
        .pm-ava.leaving { animation: pm-ava-leave 0.7s ease forwards; }
        @keyframes pm-ava-hop { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-8px) scale(1.08); } }
        @keyframes pm-ava-read { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes pm-ava-leave { 0% { transform: translateX(0) rotate(0); opacity: 1; } 35% { transform: translateX(-4px) rotate(-6deg) scaleX(-1); opacity: 1; } 100% { transform: translateX(32px) rotate(9deg) scaleX(-1); opacity: 0.25; } }
        .pm-bubble { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .pm-who { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .pm-say { font-family: 'Source Serif 4', serif; font-style: italic; font-size: clamp(14px,1.9vw,16px); color: ${T.ink}; line-height: 1.4; }
        /* «…» o'qiyapti — fikr-pufak nuqtalari ketma-ket lipillaydi */
        .pm-say.thinking { letter-spacing: 0.25em; animation: pm-think 1.1s steps(1,end) infinite; }
        @keyframes pm-think { 0% { opacity: 0.35; } 33% { opacity: 0.7; } 66%,100% { opacity: 1; } }
        /* «tanildi» bosqich-indikatori — yechimni o'qish davomida to'ladi */
        .pm-reading { display: block; height: 4px; margin-top: 6px; border-radius: 99px; background: ${T.success}22; overflow: hidden; }
        .pm-reading-fill { display: block; height: 100%; width: 100%; border-radius: 99px; background: ${T.success}; transform-origin: left; transform: scaleX(0); animation: pm-reading-fill 1.05s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes pm-reading-fill { to { transform: scaleX(1); } }
        .pm-react.ok .pm-say { color: ${T.success}; }
        .pm-react.no .pm-say { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .pm-ava.happy, .pm-ava.reading, .pm-ava.leaving, .pm-say.thinking { animation: none; } .pm-reading-fill { animation: none; transform: scaleX(1); } }
        .g11-live .g11-num { animation: dl-pulse 1s ease-in-out infinite; }
        /* Kamchilik top (s13): bo'sh katak pulsatsiyasi + status chiplar */
        /* Qoida (s14): misollar karuseli */

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
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: ${AMBER_SOFT}; border-left: 4px solid ${AMBER}; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(156,151,180,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
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
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(156,151,180,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
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

        /* ===== ⚡ CODESTRIKE — CTA (dars ichida) ===== */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Kutish-holatida ham kapsula IXCHAM: so'z kattaligi o'zgarmaydi, faqat bo'sh joy qisqaradi
           («Mentorni kuting»dan keyin ortiqcha joy qolmasin — P0 etaloni) */
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
        @keyframes pmPop { 0% { transform: scale(0.9); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        .pm-match { animation: pmMatch 0.55s cubic-bezier(.34,1.5,.5,1); }
        @keyframes pmMatch { 0% { transform: scale(1); } 35% { transform: scale(1.06); box-shadow: 0 0 0 5px rgba(18,169,104,0.16); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(18,169,104,0); } }
        .pm-shake { animation: shake 0.4s ease; }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(91,61,230,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FBFAFE; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }
        /* Kahoot-reveal: javob qotdi, natija hali sir — neytral ko'k belgi (to'g'ri/xato sezdirmaydi) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(14,134,196,0.3) !important; }

        /* kod atamalari — chip ko'rinishi (savol/variant/izohlarda) */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(40,34,82,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* live-badge — sekundar UI, kerak bo'lguncha xira (11.15) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(40,34,82,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }


        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; line-height: 1; }
        .mentor-ava img { width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .hook-option:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(156,151,180,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(156,151,180,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }
        .frame-warn { background: ${AMBER_SOFT}; border-left: 4px solid ${AMBER}; border-radius: 12px; padding: 12px 15px; }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(14,134,196,0.22); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === BRAUZER MAKETI (HTML darslar dizayni) === */
        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); }
        .bp-bar { background: ${T.bg}; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-url { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; } .lock { color: ${T.success}; font-size: 8px; }
        .bp-body { padding: clamp(13px,2.2vw,18px); }
        .pg-in { animation: pg-in 0.38s cubic-bezier(.2,.7,.2,1); } @keyframes pg-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .site-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid ${T.ink3}40; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .site-brand { display: inline-flex; align-items: center; gap: 8px; } .site-logo { width: 24px; height: 24px; border-radius: 6px; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; } .site-name { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; font-size: 14px; }
        .site-nav { display: inline-flex; gap: 12px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink2}; }
        .site-h3 { font-family: 'Georgia, serif'; font-size: clamp(16px,2.2vw,21px); color: ${T.ink}; margin: 0 0 8px; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar bir-birining ustiga chiqib ketardi (klinika 11/17 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        /* === ROADMAP === */
        /* Reja (2-page) — muammo → 3 savol → yechim animatsiyasi */
        /* G'oya tug'iladi (Screen7) — mantiqiy zanjir bog'lovchisi */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 16px 18px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); animation: fade-step 0.34s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === CONN === */
        .conn-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .conn-sub { font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; text-align: center; }
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

        /* === ALGO BUILD === */
        .algo-build { background: ${T.paper}; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        /* G'oya yig'ish (Screen11) — toza tanlov + slotlar */
        .g11-group { display: flex; flex-direction: column; gap: 7px; }
        .g11-glabel { display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0; }
        .g11-num { width: 18px; height: 18px; border-radius: 50%; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
        .g11-opt { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; border: none; border-radius: 11px; padding: 12px 14px; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.6vw,14.5px); color: ${T.ink}; background: ${T.paper}; cursor: pointer; transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease; box-shadow: 0 5px 14px -8px rgba(${T.shadowBase},0.18); }
        .g11-opt:hover:not(.sel) { transform: translateY(-1px); box-shadow: 0 10px 20px -9px rgba(${T.shadowBase},0.26); }
        .g11-opt.sel { animation: pmPop 0.4s cubic-bezier(.34,1.5,.5,1); }
        /* Affordance: faol qatorda tanlanmagan kartalar «meni bos» deb pulsatsiya qiladi (tanlagach — qator to'lib, keyingisiga o'tadi) */
        @keyframes tap-hint { 0%, 100% { box-shadow: 0 5px 14px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 5px 14px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 2px rgba(91,61,230,0.4); } }
        .g11-live .g11-opt:not(.sel) { animation: tap-hint 1.9s ease-in-out infinite; }
        .g11-live .g11-opt:not(.sel):hover { animation: none; }
        @media (prefers-reduced-motion: reduce) { .g11-live .g11-opt:not(.sel) { animation: none; } }
        .g11-tick { width: 19px; height: 19px; border-radius: 50%; border: 2px solid; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; transition: all 0.16s; }
        .g11-slot { display: flex; align-items: center; gap: 11px; padding: 13px 14px; border-radius: 10px; background: ${T.bg}; border-left: 3px solid ${T.ink3}40; min-height: 48px; transition: border-color 0.3s ease, background 0.3s ease; }
        .g11-slot.filled { background: ${T.paper}; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); }
        .g11-slabel { font-size: 10px; text-transform: uppercase; min-width: 52px; font-weight: 700; letter-spacing: 0.04em; transition: color 0.3s; }
        .g11-val { display: flex; align-items: center; gap: 8px; flex: 1; font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; font-weight: 500; }
        .g11-empty { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink3}; font-style: italic; }
        /* F-0731-01: bosqichli ochilish — tasdiqlangan qator (yig'ilgan), qulflangan qator (keyingi qadam) */
        .g11-donerow { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 11px; background: ${T.paper}; border-left: 3px solid; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); }
        .g11-done-ic { width: 19px; height: 19px; border-radius: 50%; color: #fff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .g11-done-lbl { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; min-width: 52px; }
        .g11-done-val { flex: 1; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 600; color: ${T.ink}; }
        .g11-redo { border: none; background: ${T.bg}; color: ${T.ink3}; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; font-size: 13px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; }
        .g11-redo:hover { background: ${T.accentSoft}; color: ${T.accent}; }
        .g11-lockrow { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 11px; border: 1.5px dashed ${T.line}; color: ${T.ink3}; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.75; }
        /* Qoida (Screen14) — vizual formula */

        /* === AI CARD === */

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

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
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
        @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
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

        /* === 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI === */
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
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }

        /* ============ 🔔 NAVBAT-PULSI (88-qonun · 1-C.8) — PmLesson2'dan ko'chirildi ============ */
        @keyframes turn-hint {
          0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
          50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
        }
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
        /* ============ 🛠 KODING: aylantirish-vizual + to'liq-ekran kompilyator (PmLesson2) ============ */
        .lp-mstats { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); min-width: 0; overflow-wrap: anywhere; }
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
        .stq-mid { position: relative; padding: 16px 14px 14px; display: flex; flex-direction: column; gap: 9px; background: #FBFAFE; }
        .stq-tag { position: absolute; top: 5px; right: 10px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .stq-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .stq-cta-sub { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-align: center; }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }
        .kdx-line.kdx-line { margin: 0 0 7px; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink}; background: #fff; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
        /* ============ 💻 UYGA VAZIFA — neon-kapsula (PmLesson2) ============ */
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
        /* ============ ✍️ USTAXONA: qadam-indikator + muharrir + kartalar-ro'yxati (P0) ============ */
        .swcard-fields { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        @media (max-width: 620px) { .swcard-fields { grid-template-columns: 1fr; } }
        .smini-f { display: flex; flex-direction: column; gap: 4px; }
        .smini-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .smini-f.kim span { color: ${SLOT.kim}; } .smini-f.muammo span { color: ${SLOT.muammo}; } .smini-f.yechim span { color: ${SLOT.yechim}; }
        .smini-f input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; }
        .smini-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .smini-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        /* === USTAXONA v3: bittalab-muharrir (swed) + saqlanganlar-ro'yxati (svd) === */
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
        .jws-line { flex: 0 1 110px; height: 3px; border-radius: 99px; background: ${T.line}; margin-top: clamp(18px,2.2vw,21px); transition: background 0.4s; }
        .jws-line.on { background: ${T.success}; }
        .svd.full { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .smini-f.kim input { box-shadow: inset 0 0 0 1.5px ${SLOT.kim}55; }
        .smini-f.muammo input { box-shadow: inset 0 0 0 1.5px ${AMBER}66; }
        .smini-f.yechim input { box-shadow: inset 0 0 0 1.5px ${SLOT.yechim}55; }
        .smini-f.kim input:focus { box-shadow: inset 0 0 0 2px ${SLOT.kim}; }
        .smini-f.muammo input:focus { box-shadow: inset 0 0 0 2px ${AMBER}; }
        .smini-f.yechim input:focus { box-shadow: inset 0 0 0 2px ${SLOT.yechim}; }
        .smini-f.kim.on input { box-shadow: inset 0 0 0 1.5px ${SLOT.kim}; }
        .smini-f.muammo.on input { box-shadow: inset 0 0 0 1.5px ${AMBER}; }
        .smini-f.yechim.on input { box-shadow: inset 0 0 0 1.5px ${SLOT.yechim}; }
        @media (prefers-reduced-motion: reduce) { .jws.cur .jws-n { animation: none; } }
        .swed { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; gap: 13px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.2); border-left: 5px solid ${T.accent}; }
        .swed-tag { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 99px; color: ${T.accent}; background: ${T.accentSoft}; }
        .swed-sent { font-family: Georgia, serif; font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.6; margin: 0; overflow-wrap: anywhere; }
        /* Gap-slotlari formula-konstruktor (s3) ranglarida: bo'sh = xira-punktir, to'lgan = o'z rangi */
        .ss-slot { font-weight: 700; color: ${T.ink3}; font-style: italic; border-bottom: 2px dashed ${T.ink3}66; padding: 0 2px; transition: color 0.2s; }
        .ss-slot.on { font-style: normal; border-bottom-style: solid; }
        .ss-slot.kim.on { color: ${SLOT.kim}; border-bottom-color: ${SLOT.kim}55; }
        .ss-slot.muammo.on { color: ${SLOT.muammo}; border-bottom-color: ${AMBER}; }
        .ss-slot.yechim.on { color: ${SLOT.yechim}; border-bottom-color: ${SLOT.yechim}55; }
        .swed-hint.swed-hint { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .swed-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
        .swed-cnt { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 12px; color: ${T.ink3}; }
        .swed-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .swed-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .swed-save:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.55; box-shadow: none; cursor: not-allowed; transform: none; }
        .svd { background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 16px; padding: 15px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.16); }
        .svd-n { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: ${T.ink3}; }
        .svd-n.ok { color: ${T.success}; }
        .svd-card { background: ${T.successSoft}; border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 6px; box-shadow: inset 0 0 0 1.5px ${T.success}44; animation: card-fill-pop 0.42s cubic-bezier(.34,1.5,.4,1); }
        .svd-card.editing { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        @media (prefers-reduced-motion: reduce) { .svd-card { animation: none; } }
        .svd-top { display: flex; align-items: center; gap: 8px; }
        .svd-num { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.success}; }
        .svd-edit { margin-left: auto; background: ${T.paper}; border: none; border-radius: 8px; padding: 0 10px; height: 28px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; white-space: nowrap; color: ${T.ink2}; cursor: pointer; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); transition: color 0.15s, transform 0.15s; }
        .svd-edit:hover { color: ${T.accent}; transform: scale(1.08); }
        .svd-sent { font-size: 13.5px; color: ${T.ink2}; line-height: 1.45; margin: 0; overflow-wrap: anywhere; }
        .svd-sent b { color: ${T.ink}; font-weight: 600; }
        .turn-wrap { display: block; position: relative; }
        .turn-wrap > .reflect-input { width: 100%; }
        .smini-f.turn-ring::after { inset: -4px; border-radius: 12px; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        /* ============ 🗣 MUSTAHKAMLASH: juftlik-taymer + bir qatorlik yozuv (P0) ============ */
        .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step.wide { grid-column: 1 / -1; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .rcp-s { display: block; font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; margin-top: 2px; line-height: 1.4; }
        .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
        .pair-now { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; line-height: 1.45; }
        .pair-who { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; vertical-align: middle; }
        .pair-who.b { background: ${T.success}; }
        .pair-live { display: flex; align-items: center; gap: 15px; }
        .pair-ring { position: relative; width: 82px; height: 82px; flex-shrink: 0; }
        .pair-ring-mid { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
        .pair-ring-who { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 14px; }
        .pair-ring-who.b { background: ${T.success}; }
        .pair-ring-sec { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; color: ${T.ink}; font-variant-numeric: tabular-nums; margin-top: 2px; }
        .pair-live-txt { display: flex; flex-direction: column; gap: 3px; }
        .pair-next { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        .pair-timer-btns { display: flex; gap: 8px; }
        /* F-0727-43: boshlash-tugmasi pulsli CTA — o'quvchi uni sezmasdan o'tib ketmasin */
        .pair-start { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 12px 22px; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); color: #fff; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); animation: pair-start-pulse 1.6s ease-in-out infinite; transition: transform 0.15s; }
        .pair-start:hover { transform: translateY(-2px); }
        @keyframes pair-start-pulse { 0%, 100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5), 0 0 0 0 rgba(110,75,255,0.45); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.6), 0 0 0 12px rgba(110,75,255,0); } }
        .pair-start.calm { animation: none; }
        @media (prefers-reduced-motion: reduce) { .pair-start { animation: none; } }
        .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .reflect-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }

        /* ============ 📋 PROYEKTOR-SIR: MentorNote (default yopiq chip) ============ */
        .mnote-d { align-self: flex-start; min-width: 0; }
        .mnote-d summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 99px; padding: 6px 13px; user-select: none; transition: box-shadow 0.15s; }
        .mnote-d summary::-webkit-details-marker { display: none; }
        .mnote-d summary:hover { box-shadow: 0 4px 12px -6px rgba(14,134,196,0.4); }
        .mnote-d[open] summary { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        .mnote-d p { margin: 0; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 0 11px 11px 11px; padding: 9px 13px; max-width: 460px; min-width: 0; overflow-wrap: anywhere; }

        /* ============ 🌯 HOOK imzo-sahna: lavash do'koni eshigi oldidagi oqim ============ */
        .hk-street { position: relative; display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.2vw,20px) clamp(14px,2.2vw,20px) clamp(14px,2.2vw,20px) clamp(24px,3vw,32px); box-shadow: 0 8px 22px -9px rgba(${T.shadowBase},0.16); overflow: hidden; }
        /* Ko'cha-yo'lagi: eshik tomon oqib turgan odamlar oqimi (chapdagi vertikal yo'l) */
        .hk-flow { position: absolute; left: clamp(11px,1.5vw,15px); top: 14px; bottom: 14px; width: 3px; border-radius: 99px; background: ${T.line}; overflow: hidden; }
        .hk-flow i { position: absolute; left: -2.5px; width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); animation: hk-flow 2.6s linear infinite; }
        .hk-flow i:nth-child(2) { animation-delay: 0.85s; } .hk-flow i:nth-child(3) { animation-delay: 1.7s; }
        @keyframes hk-flow { 0% { top: -8px; opacity: 0; } 14% { opacity: 1; } 82% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .hk-shop { align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 6px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .hk-person { position: relative; display: flex; align-items: center; gap: 11px; background: ${T.bg}; border-radius: 12px; padding: 10px 13px; min-width: 0; opacity: 0; animation: hk-arrive 0.55s cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes hk-arrive { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: none; } }
        /* Eshikdan kirmaydigan odam: xira, punktir, o'ng tomonga «o'tib ketgan» */
        .hk-person.away { background: transparent; box-shadow: inset 0 0 0 1.5px ${T.line}; opacity: 0.55; }
        .hk-person.away .hk-face { filter: grayscale(1); }
        .hk-person.away::after { content: '→'; margin-left: auto; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.ink3}; animation: hk-pass 2.4s ease-in-out infinite; }
        @keyframes hk-pass { 0%,100% { transform: translateX(0); opacity: 0.45; } 50% { transform: translateX(6px); opacity: 0.9; } }
        .hk-face { font-size: 26px; line-height: 1; flex-shrink: 0; }
        .hk-col { display: flex; flex-direction: column; gap: 1px; min-width: 0; overflow-wrap: anywhere; }
        .hk-col b { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .hk-col em { font-family: 'Manrope', sans-serif; font-style: normal; font-size: 12px; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .hk-person { opacity: 1; animation: none; transform: none; } .hk-person.away { opacity: 0.55; } .hk-flow i, .hk-person.away::after { animation: none; } .hk-flow i { display: none; } }

        /* ============ 📇 MAQSAD-PREVIEW: auditoriya-karta o'z-o'zidan yozilib chiqadi ============ */
        .acard { position: relative; background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; gap: 9px; box-shadow: 0 12px 30px -12px rgba(${T.shadowBase},0.22); border-left: 5px solid ${T.accent}; min-width: 0; }
        .acard.ready { box-shadow: 0 12px 30px -12px rgba(18,169,104,0.3); border-left-color: ${T.success}; }
        .acard-title { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.ink2}; }
        .acard-row { display: flex; flex-direction: column; gap: 2px; background: ${T.bg}; border-left: 3px solid transparent; border-radius: 10px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; transition: border-color 0.35s ease, background 0.35s ease; }
        .acard-row.on { background: ${T.paper}; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.25); animation: acard-write 0.45s cubic-bezier(.2,.7,.2,1); }
        @keyframes acard-write { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        .acard-k { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; }
        .acard-v { font-family: 'Manrope', sans-serif; font-size: 13.5px; color: ${T.ink}; line-height: 1.45; }
        .acard-wait { color: ${T.ink3}; font-style: italic; }
        /* Yozuv-kursori: karta hozir shu qatorni yozayotganini ko'rsatadi */
        .acard-wait::after { content: '▌'; margin-left: 2px; color: ${T.accent}; animation: acard-caret 0.9s steps(1) infinite; }
        @keyframes acard-caret { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        .acard-stamp { position: absolute; top: 10px; right: 12px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; color: ${T.success}; border: 2.5px solid ${T.success}; border-radius: 8px; padding: 4px 10px; transform: rotate(-7deg); background: rgba(255,255,255,0.9); animation: pm-stamp 0.5s cubic-bezier(.34,1.6,.5,1); }
        @media (prefers-reduced-motion: reduce) { .acard-row.on, .acard-stamp, .acard-wait::after { animation: none; } }

        /* ============ 🌍 KEYS-SLAYD (bosqichma-bosqich + bashorat, ball yo'q) ============ */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,3.4vw,32px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; min-width: 0; }
        /* Tepa-lenta bezak emas: darsning uch javobi tartibida — KIM (ko'k) → MUAMMO (amber) → YECHIM (yashil) */
        .k-slide::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${SLOT.kim} 0%, ${SLOT.kim} 30%, ${AMBER} 38%, ${AMBER} 62%, ${SLOT.yechim} 70%, ${SLOT.yechim} 100%); }
        .k-count { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11.5px; color: ${T.ink3}; }
        .k-body { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .k-ic { font-size: clamp(38px,6vw,58px); line-height: 1; }
        .k-t { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; line-height: 1.5; max-width: 620px; margin: 0; overflow-wrap: anywhere; }
        .k-bet { display: flex; flex-direction: column; align-items: center; gap: 11px; }
        .k-bet-lbl { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 13px; }
        .k-ask { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }
        .k-chips { display: flex; flex-wrap: wrap; gap: 9px; justify-content: center; }
        .k-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); border: none; border-radius: 99px; padding: 11px 17px; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.16s; }
        .k-chip:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        .k-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .k-chip:disabled { cursor: default; }
        .k-res { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; background: ${T.bg}; border-radius: 12px; padding: 9px 14px; animation: fade-step 0.3s ease-out; min-width: 0; overflow-wrap: anywhere; }
        .k-res.ok { color: ${T.success}; background: ${T.successSoft}; }
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .k-dots { display: inline-flex; gap: 6px; }
        .k-dot { width: 8px; height: 8px; border-radius: 99px; background: ${T.line}; }
        .k-dot.fill { background: ${T.accent}66; }
        .k-dot.cur { background: ${T.accent}; transform: scale(1.25); }
        @media (prefers-reduced-motion: reduce) { .k-res { animation: none; } }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "Mahsulot menejeri darsi", ru: "Урок продакт-менеджера" }} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}
export {
  PmLesson1 as default
};
