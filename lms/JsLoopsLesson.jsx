// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/JsLoopsLesson.jsx
//          src/compilator/HtmlCompiler.jsx
//  Qayta yig'ish:  npm run build:lms
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/JsLoopsLesson.jsx
import React, { useState as useState2, useEffect as useEffect2, useRef as useRef2, useMemo as useMemo2, useCallback, createContext, useContext, useState, useEffect, useLayoutEffect, useRef, useMemo, isValidElement } from "react";

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

// src/2-Modull/JsLoopsLesson.jsx
var T = {
  bg: "#F6F4EF",
  ink: "#0E0E10",
  ink2: "#5A5A60",
  ink3: "#A7A6A2",
  paper: "#FFFFFF",
  accent: "#FF4F28",
  accentSoft: "#FFE8E1",
  accentVivid: "#FF4F28",
  success: "#1F7A4D",
  successSoft: "#E3F0E8",
  blue: "#019ACB",
  blueSoft: "#E2F4FA",
  link: "#1a56db",
  sun: "#C77A00",
  sunSoft: "#FBEBC8",
  shadowBase: "58, 53, 48",
  line: "#E9E6DF"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
var __lang2 = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[__lang2] ?? node.uz ?? node.ru ?? "";
};
var LIVE_SUPABASE_URL = "https://dwoubexcexzsinogojiu.supabase.co";
var LIVE_SUPABASE_KEY = "sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX";
var LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
var LIVE_POLL_MS = 2500;
var LIVE_POLL_MAX_MS = 15e3;
var LIVE_HEARTBEAT_MS = 1e4;
var LIVE_STALE_MS = 18e4;
var LT = { bg: "#F6F4EF", ink: "#0E0E10", ink2: "#5A5A60", ink3: "#A7A6A2", paper: "#FFFFFF", accent: "#FF4F28", accentSoft: "#FFE8E1", success: "#1F7A4D" };
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
var _pracKey = (id) => `ccPractice:${id}`;
var pracRead = (id) => {
  try {
    const v = JSON.parse(localStorage.getItem(_pracKey(id)) || "null");
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
};
var pracWrite = (id, o) => {
  try {
    localStorage.setItem(_pracKey(id), JSON.stringify(o));
  } catch {
  }
};
var pracClear = (id) => {
  try {
    localStorage.removeItem(_pracKey(id));
  } catch {
  }
};
var codeKeyOf = (id, kind) => `ccCode:${id}:${kind}`;
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
      <button onClick={onClose} style={{ marginTop: "clamp(22px,4vw,40px)", background: LT.accent, color: "#fff", border: "none", borderRadius: 14, padding: "clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)", fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 700, cursor: "pointer" }}>{tr2({ uz: "Darsni boshlash", ru: "Начать урок" })} →</button>
    </div>;
}
function LiveGate({ live, title = { uz: "Jonli dars", ru: "Живой урок" } }) {
  const [code, setCode] = useState2("");
  const [nick, setNick] = useState2(() => nickRead());
  const [mentorCode, setMentorCode] = useState2("");
  const [role, setRole] = useState2("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  if (role === "mentor") {
    return <div style={wrap}><div style={card}>
      <div style={{ textAlign: "center" }}><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "0 0 4px" }}>🧑‍🏫 {tr2({ uz: "Mentor kirishi", ru: "Вход для ментора" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor kodini kiriting.", ru: "Введите код ментора." })}</p></div>
      <input value={mentorCode} onChange={(e) => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr2({ uz: "Mentor kodi", ru: "Код ментора" })} onKeyDown={(e) => {
      if (e.key === "Enter") live.startMentor(mentorCode);
    }} style={{ width: "100%", padding: "14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: "center", outline: "none" }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr2({ uz: "Tekshirilmoqda…", ru: "Проверяем…" }) : tr2({ uz: "Kirish →", ru: "Войти →" })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
      <button onClick={() => {
      setRole("student");
      setMentorCode("");
    }} style={link}>← {tr2({ uz: "Orqaga", ru: "Назад" })}</button>
    </div></div>;
  }
  return <div style={wrap}><div style={card}>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr2(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Darsga qo'shilish", ru: "Подключиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от ментора и своё имя." })}</p></div>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> 🔓 {tr2({ uz: "O'quvchilar erkin qilindi", ru: "Ученики отпущены в свободный режим" })}</div>;
    return <>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr2({ uz: "Kod:", ru: "Код:" })} <b style={{ fontFamily: "monospace", letterSpacing: "0.08em" }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr2({ uz: "Kodni katta ko'rsatish", ru: "Показать код крупно" })} style={{ marginLeft: 6, background: LT.ink, color: "#fff", border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>📺 {tr2({ uz: "Ko'rsatish", ru: "Показать" })}</button>
        <button onClick={() => {
      if (window.confirm(tr2({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: "Отпустить учеников? Дальше они продолжат самостоятельно." }))) live.endSession();
    }} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>🔓 {tr2({ uz: "Erkin qilish", ru: "Отпустить" })}</button>
      </div>
    </>;
  }
  if (live.mode === "student") {
    if (live.status === "ended") return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 🔓 {tr2({ uz: "Erkin rejim — o'zingiz davom eting", ru: "Свободный режим — продолжайте сами" })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> ⚠️ {tr2({ uz: "Mentor uzildi — erkin rejim", ru: "Ментор отключился — свободный режим" })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot("#FFD380")} /> 🔄 {tr2({ uz: "Qayta ulanmoqda…", ru: "Переподключаемся…" })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr2({ uz: "Mentor:", ru: "Ментор:" })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}
var LangContext = createContext("uz");
var MentorCtx = createContext(null);
var AchCtx = createContext(null);
var PRACTICE_DONE_BASE = 500;
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
var KW = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
var NUM = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
var STR = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var FN = ({ children }) => <span style={{ color: CODE.punct }}>{children}</span>;
var CM = ({ children }) => <span style={{ color: CODE.comment }}>{children}</span>;
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
var LESSON_META = { lessonId: "js-loops-01-v18", lessonTitle: { uz: "JavaScript — Sikllar (for, while)", ru: "JavaScript — Циклы (for, while)" } };
var HW_TOKENS = [
  { t: { uz: "amaliyot", ru: "практика" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "loyiha", ru: "проект" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "mashq", ru: "упражнение" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "natija", ru: "результат" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s2", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s3", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s4", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s5", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s5b", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s8", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s10", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s13", type: "case", template: "custom", scored: false, scope: null },
  { id: "s14", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcard", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
var Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : void 0}>{children}</div>;
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
  const setCollapsed = (v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) {
      const el = contentRef.current;
      requestAnimationFrame(() => {
        if (el) el.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  };
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
var NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  const lbl = label != null ? tr2(label) : tr2({ uz: "Davom etish", ru: "Продолжить" });
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : lbl}</button>;
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
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr2(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>;
var RECAPS = {
  // s4 — "for siklida 'i++' nima vazifani bajaradi?" (to'g'ri: Har aylanishdan keyin i ni 1 ga oshiradi — qadam)
  4: {
    title: { uz: "i++ — sikl qadami", ru: "i++ — шаг цикла" },
    cards: [
      {
        ic: "👣",
        h: { uz: "i++ — bu bir qadam oldinga", ru: "i++ — это один шаг вперёд" },
        body: { uz: <>for siklining oxiridagi <b>i++</b> — bu <b>qadam</b>. Har aylanishdan so'ng u <b>i ni 1 ga oshiradi</b>. Xuddi konveyer har aylanishda bir quti oldinga surilgandek.</>, ru: <>В конце цикла for стоит <b>i++</b> — это <b>шаг</b>. После каждой итерации он <b>увеличивает i на 1</b>. Как конвейер, который за каждый оборот продвигает коробку вперёд.</> },
        vis: <RcFlow items={["i = 0", "i++", "i = 1", "i++", "i = 2"]} />,
        ask: { uz: "Konveyer bir marta aylansa, sanagich nechtaga oshadi?", ru: "Если конвейер сделает один оборот, на сколько вырастет счётчик?" }
      },
      {
        ic: "🔁",
        h: { uz: "For siklining 3 qismi", ru: "Три части цикла for" },
        body: { uz: <>for da uch qism bor: <b>boshlanish</b> (i = 0), <b>shart</b> (i qachongacha?) va <b>qadam</b> (i++). i++ aynan uchinchisi — sanoqni oldinga suradi, shu tufayli sikl bir kun to'xtaydi.</>, ru: <>У for три части: <b>старт</b> (i = 0), <b>условие</b> (до какого i?) и <b>шаг</b> (i++). i++ — именно третья: она двигает счёт вперёд, поэтому цикл однажды остановится.</> },
        vis: <RcFlow items={[{ uz: "boshlanish", ru: "старт" }, { uz: "shart", ru: "условие" }, { uz: "qadam i++", ru: "шаг i++" }]} sep="·" />
      },
      {
        ic: "⏭️",
        h: { uz: "To'xtatmaydi, oshiradi", ru: "Не останавливает, а увеличивает" },
        body: { uz: <>i++ siklni <b>to'xtatmaydi</b> va massiv ham yaratmaydi — u faqat <b>i ni bittaga oshiradi</b>. Agar i++ bo'lmasa, i o'zgarmay qolib, sikl <b>cheksiz</b> aylanaverardi.</>, ru: <>i++ цикл <b>не останавливает</b> и массив не создаёт — он лишь <b>увеличивает i на единицу</b>. Без i++ значение i не менялось бы, и цикл крутился бы <b>бесконечно</b>.</> }
      }
    ]
  },
  // s5b — "for (let i = 1; i <= 3; i++) console.log(i) — qaysi sonlar chiqadi?" (to'g'ri: 1, 2, 3)
  6: {
    title: { uz: "1, 2, 3 chiqadi", ru: "Выведется 1, 2, 3" },
    cards: [
      {
        ic: "🔢",
        h: { uz: "i ni birma-bir sanaymiz", ru: "Считаем i по одному" },
        body: { uz: <>i <b>1</b> dan boshlanadi, har qadamda <b>1 ga oshadi</b> va <b>i &lt;= 3</b> to'g'ri turgan ekan aylanaveradi. Shuning uchun konsolga <b>1, 2, 3</b> chiqadi.</>, ru: <>i начинается с <b>1</b>, на каждом шаге <b>растёт на 1</b> и крутится, пока <b>i &lt;= 3</b> истинно. Поэтому в консоль выйдут <b>1, 2, 3</b>.</> },
        vis: <RcFlow items={["1", "2", "3"]} />,
        ask: { uz: "i = 4 bo'lganda i <= 3 sharti rostmi? Sikl davom etadimi?", ru: "При i = 4 условие i <= 3 истинно? Цикл продолжится?" }
      },
      {
        ic: "🛑",
        h: { uz: "3 da to'xtaydi, 4 chiqmaydi", ru: "На 3 остановится, 4 не выйдет" },
        body: { uz: <>i = 3 da <b>3 &lt;= 3</b> hali rost — 3 chiqadi. Keyin i = 4 bo'ladi va <b>4 &lt;= 3</b> yolg'on — sikl to'xtaydi. Shu bois <b>4 chiqmaydi</b>. Belgi <b>&lt;=</b> bo'lgani uchun 3 ham qamraladi.</>, ru: <>При i = 3 условие <b>3 &lt;= 3</b> ещё истинно — 3 печатается. Потом i = 4, а <b>4 &lt;= 3</b> уже ложь — цикл останавливается. Поэтому <b>4 не выводится</b>. Благодаря знаку <b>&lt;=</b> тройка тоже попадает.</> },
        vis: <RcFlow items={[{ uz: "3 <= 3 rost", ru: "3 <= 3 истина" }, { uz: "chop: 3", ru: "печать: 3" }, { uz: "4 <= 3 yolg'on", ru: "4 <= 3 ложь" }, "stop"]} />
      },
      {
        ic: "🧭",
        h: { uz: "Teskari emas — oldinga", ru: "Не назад — вперёд" },
        body: { uz: <>Sonlar <b>1 dan 3 ga qarab</b> oshib boradi (i++ oshiradi), shu bois javob <b>3, 2, 1</b> emas. Boshlanish nuqtasi (1) va qadam yo'nalishi (oshirish) tartibni belgilaydi.</>, ru: <>Числа растут <b>от 1 к 3</b> (i++ увеличивает), поэтому ответ не <b>3, 2, 1</b>. Стартовая точка (1) и направление шага (вверх) задают порядок.</> }
      }
    ]
  },
  // s9 — "mevalar = ['olma','banan','uzum']. mevalar[0] nima?" (to'g'ri: "olma")
  10: {
    title: { uz: "Sanoq 0 dan boshlanadi", ru: "Счёт начинается с 0" },
    cards: [
      {
        ic: "🍎",
        h: { uz: "[0] — birinchi element", ru: "[0] — первый элемент" },
        body: { uz: <>Massivda sanoq <b>1 dan emas, 0 dan</b> boshlanadi. Shuning uchun <b>mevalar[0]</b> — bu <b>birinchi</b> meva, ya'ni <b>"olma"</b>. Banan esa mevalar[1].</>, ru: <>В массиве счёт начинается <b>не с 1, а с 0</b>. Поэтому <b>mevalar[0]</b> — это <b>первый</b> фрукт, то есть <b>"olma"</b>. А банан — mevalar[1].</> },
        vis: <RcFlow items={["[0] olma", "[1] banan", "[2] uzum"]} sep="·" />,
        ask: { uz: 'Unda "uzum" ni chaqirish uchun qaysi indeksni yozamiz?', ru: 'А какой индекс напишем, чтобы получить "uzum"?' }
      },
      {
        ic: "🏢",
        h: { uz: "Kundalik misol — qavat 0", ru: "Пример из жизни — этаж 0" },
        body: { uz: <>Ba'zi liftlarda birinchi qavat <b>0</b> deb belgilanadi. Massiv ham xuddi shunday: <b>0-o'rin = birinchisi</b>. Indeks — bu qutining tartib raqami, u nolabosh.</>, ru: <>В некоторых лифтах первый этаж обозначен как <b>0</b>. Массив устроен так же: <b>место 0 = первое</b>. Индекс — это номер коробки, и он начинается с нуля.</> },
        vis: <RcFlow items={[{ uz: "0 = 1-o'rin", ru: "0 = 1-е место" }, { uz: "1 = 2-o'rin", ru: "1 = 2-е место" }]} sep="·" />
      },
      {
        ic: "⚠️",
        h: { uz: "Oxirgisi length dan 1 kam", ru: "Последний на 1 меньше length" },
        body: { uz: <>3 ta meva bo'lsa, indekslar <b>0, 1, 2</b> — oxirgisi <b>uzum = [2]</b>, [3] esa yo'q. Ya'ni oxirgi indeks har doim <b>uzunlikdan bitta kam</b> bo'ladi.</>, ru: <>Если фруктов 3, индексы — <b>0, 1, 2</b>: последний <b>uzum = [2]</b>, а [3] не существует. То есть последний индекс всегда <b>на единицу меньше длины</b>.</> }
      }
    ]
  },
  // s12 — "5 ta nom bor massiv. for (i=0; i<dostlar.length; i++) necha marta ishlaydi?" (to'g'ri: 5 marta)
  13: {
    title: { uz: ".length — necha marta?", ru: ".length — сколько раз?" },
    cards: [
      {
        ic: "🔁",
        h: { uz: "Har element uchun bir marta", ru: "По разу на каждый элемент" },
        body: { uz: <>Sikl massivning <b>har bir elementi</b> uchun bir marta aylanadi. 5 ta nom bo'lsa — sikl <b>5 marta</b> ishlaydi. <b>dostlar.length</b> esa aynan «5» ni beradi.</>, ru: <>Цикл делает по одной итерации <b>на каждый элемент</b> массива. Если имён 5 — цикл сработает <b>5 раз</b>. А <b>dostlar.length</b> как раз даёт «5».</> },
        vis: <RcFlow items={["i=0", "i=1", "i=2", "i=3", "i=4"]} />,
        ask: { uz: "5 ta do'stga xabar yuborsangiz, «yubor» tugmasini necha marta bosasiz?", ru: "Если отправить сообщение 5 друзьям, сколько раз нажмёте «отправить»?" }
      },
      {
        ic: "📏",
        h: { uz: ".length — elementlar soni", ru: ".length — число элементов" },
        body: { uz: <><b>.length</b> massivda nechta element borligini aytadi. i <b>0 dan boshlanib</b>, i &lt; 5 to'g'ri turganicha yuradi: 0, 1, 2, 3, 4 — bu <b>rosa 5 ta</b> qadam.</>, ru: <><b>.length</b> говорит, сколько элементов в массиве. i идёт <b>с 0</b>, пока i &lt; 5 истинно: 0, 1, 2, 3, 4 — это <b>ровно 5</b> шагов.</> },
        vis: <RcFlow items={["0,1,2,3,4", { uz: "5 ta qadam", ru: "5 шагов" }]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "Nega 4 emas, 6 emas?", ru: "Почему не 4 и не 6?" },
        body: { uz: <>Sanoq 0 dan boshlangani uchun 0..4 — 5 ta qadamni beradi (4 emas). <b>i &lt; length</b> belgisi (kichik, teng emas) 5-indeksga o'tkazmaydi, shu bois <b>6 marta ham emas</b>.</>, ru: <>Счёт начинается с 0, поэтому 0..4 — это 5 шагов (а не 4). Знак <b>i &lt; length</b> (строго меньше) не пускает к индексу 5, поэтому и <b>не 6 раз</b>.</> }
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
        <span className="rc-tag">📖 {tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })}</span>
        <span className="rc-title">{tr2(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr2(card.h)}</h2>
        <p className="rc-body">{tr2(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr2({ uz: "Sinfga savol:", ru: "Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr2({ uz: "Oldingi", ru: "Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>✓ {tr2({ uz: "Tushunarli — davom etamiz", ru: "Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi", ru: "Дальше" })} →</button>}
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
        <span className="mstats-lbl">📊 {tr2({ uz: "Jonli natija", ru: "Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr2({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>🔓 {tr2({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(answered / total * 100) : 0}%` }} /></div>
      {reveal ? <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr2({ uz: "to'g'ri ✅", ru: "верно ✅" })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr2({ uz: "xato ❌", ru: "неверно ❌" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ожидаем ⏳" })}</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr2({ uz: "javob berdi 📨", ru: "ответили 📨" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda ⏳", ru: "ожидаем ⏳" })}</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">🙈 {tr2({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "Кто что выбрал и число ✅/❌ скрыто — по кнопке «Открыть результат» всё появится одновременно и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? tr2({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} уч. · ${pct}%` }) : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr2({ uz: "Qisqa takrorlash", ru: "Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr2({ uz: "Kutilmoqda:", ru: "Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr2({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: "Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var getAudioEngine = () => null;
function useAudio() {
  return { isPlaying: false, currentSegment: null, waitingFor: null, muted: true, triggerEvent: () => {
  }, replay: () => {
  }, toggleMute: () => {
  }, stop: () => {
  } };
}
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
    const optTexts = options.map((o) => tr2(o));
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
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
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите верный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "safe center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>⚡ {tr2({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, думайте перед кликом!" })}</p>}
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
            {isMentorLive ? fmtCode(tr2({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr2(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr2(options[correctIdx])}` })) : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? fmtCode(tr2({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr2(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr2(options[correctIdx])}` })) : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(tr2(isMentorLive ? explainCorrect : waiting ? { uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас вы узнаете верный ответ." } : wrongLocked ? explainWrong[picked] ?? explainWrong.default : solved ? explainCorrect : explainWrong[picked] ?? explainWrong.default))}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
       Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */
  }
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 {tr2({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
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
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
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
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> · {tr2({ uz: "ko'rsatmani ochish", ru: "открыть подсказку" })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var Terminal = ({ lines, empty = { uz: "// natija shu yerda chiqadi…", ru: "// результат появится здесь…" }, title = "console" }) => <div className="term">
    <div className="term-bar"><span className="term-dot" style={{ background: "#FF5F56" }} /><span className="term-dot" style={{ background: "#FFBD2E" }} /><span className="term-dot" style={{ background: "#27C93F" }} /><span className="term-title">{tr2(title)}</span></div>
    <div className="term-body">
      {lines.length === 0 ? <p className="term-empty">{tr2(empty)}</p> : lines.map((l, i) => <div key={i} className="term-line"><span className="term-arrow">›</span><span>{l}</span></div>)}
    </div>
  </div>;
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
var SiklZavodi = ({ count = 0, max = 5, init = "i = 1", cond = "i <= 5", step = "i++", load = null, cheksiz = false, whileMode = false, done = false, onStep, onAuto, manual = false, compact = false }) => {
  const n = Math.max(0, count);
  const zeroBased = /=\s*0/.test(init);
  const boxes = Array.from({ length: n }, (_, k) => load ? load[k] ?? "?" : zeroBased ? k : k + 1);
  const overflow = cheksiz && n >= max + 3;
  const idle = (n === 0 || done && !cheksiz) && !overflow;
  return <div className={`zavod ${overflow ? "zavod-cheksiz" : ""} ${done && !cheksiz ? "zavod-done" : ""} ${compact ? "zavod-sm" : ""} ${idle ? "zv-idle" : ""}`}>
      <div className="zavod-levers">
        <div className="zv-lever zv-init"><span className="zv-lbl">{tr2({ uz: "Boshlanish", ru: "Старт" })}</span><span className="zv-code">{init}</span></div>
        <div className="zv-lever zv-cond"><span className="zv-lbl">{whileMode ? tr2({ uz: "👀 Tekshiruvchi", ru: "👀 Проверяющий" }) : tr2({ uz: "Shart", ru: "Условие" })}</span><span className="zv-code">{cond}</span></div>
        <div className="zv-lever zv-step"><span className="zv-lbl">{tr2({ uz: "Qadam", ru: "Шаг" })}</span><span className="zv-code">{step}</span></div>
      </div>
      <div className="zavod-body">
        <div className="zavod-tablo">
          <span className="zv-tablo-lbl">i</span>
          <span className="zv-tablo-num" key={n}>{n || "·"}</span>
        </div>
        <div className="zavod-belt" aria-hidden="true">
          <span className="zv-belt-arrow">›</span><span className="zv-belt-arrow">›</span><span className="zv-belt-arrow">›</span>
        </div>
        {manual && <div className="zavod-controls">
            {onStep && <button className="btn-soft" onClick={onStep} disabled={done || overflow}>🔧 {tr2({ uz: "Bir marta aylantirish", ru: "Прокрутить один раз" })}</button>}
            {onAuto && <button className="zv-start" onClick={onAuto} disabled={done || overflow}>⚡ {tr2({ uz: "AUTO — hammasini", ru: "AUTO — всё сразу" })}</button>}
          </div>}
      </div>
      <div className="zavod-bin">
        {boxes.length === 0 ? <span className="zv-bin-empty">{tr2({ uz: "// yashik hali bo'sh", ru: "// ящик пока пуст" })}</span> : boxes.map((b, k) => <span key={k} className="zv-box" style={{ animationDelay: `${Math.min(k * 0.025, 0.32)}s` }}>{load ? "🎁" : "📦"}<b>{String(b)}</b></span>)}
      </div>
      {overflow ? <div className="zavod-alert">⚠️ {tr2({ uz: "CHEKSIZ! — qadam shartga yaqinlashmayapti, mashina to'xtamayapti", ru: "БЕСКОНЕЧНО! — шаг не приближает к условию, машина не останавливается" })}</div> : done && <div className="zavod-ding">🔔 {tr2({ uz: "Tayyor! — shart buzildi, sikl to'xtadi", ru: "Готово! — условие нарушилось, цикл остановился" })}</div>}
    </div>;
};
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const NEED = 30;
  const [count, setCount] = useState2(0);
  const [picked, setPicked] = useState2(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: "a", label: { uz: "Bittalab — 1000 marta qo'lda yozaman", ru: "По одному — напишу вручную 1000 раз" } },
    { id: "b", label: { uz: "Sikl bilan — bir marta yozib, takrorlataman", ru: "Циклом — напишу один раз и заставлю повторять" } },
    { id: "c", label: { uz: "Umuman yozmayman", ru: "Вообще не буду писать" } }
  ];
  const write = () => setCount((c) => Math.min(c + 1, NEED));
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
  };
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 780 }}>{tr2({ uz: <>30 ta do'stingizga bir xil xabarni <span className="italic" style={{ color: T.accent }}>bittalab</span> yozasizmi?</>, ru: <>Будете писать 30 друзьям одно и то же <span className="italic" style={{ color: T.accent }}>по одному</span>?</> })}</h1>
        <Mentor>{tr2({ uz: <>Tasavvur qiling: bayramda 30 ta sinfdoshingizga <b style={{ color: T.ink }}>"Bayram muborak!"</b> deb yozmoqchisiz. Bittalab yozsangiz — qo'lingiz charchaydi. Tugmani bir necha marta bosing-chi, qancha zerikarli ekanini his qiling.</>, ru: <>Представьте: на праздник вы хотите написать 30 одноклассникам <b style={{ color: T.ink }}>«С праздником!»</b>. Писать по одному — рука устанет. Понажимайте кнопку несколько раз и почувствуйте, насколько это скучно.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr2({ uz: "Qo'lda yuborilgan xabarlar", ru: "Сообщения, отправленные вручную" })}</p>
            <div className="msg-list fade-up delay-1">
              {count === 0 ? <p style={{ color: T.ink3, fontStyle: "italic", margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{tr2({ uz: "// hali bittasi ham yuborilmadi", ru: "// пока не отправлено ни одного" })}</p> : Array.from({ length: count }).map((_, i) => <div key={i} className="msg-line el-in"><span className="msg-ok">✅</span><span>{tr2({ uz: `Do'st #${i + 1} — "Bayram muborak!"`, ru: `Друг #${i + 1} — «С праздником!»` })}</span></div>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button className={`btn ${count >= 20 ? "btn-tired" : ""}`} onClick={write} disabled={count >= NEED} style={{ alignSelf: "flex-start" }}>{count >= NEED ? tr2({ uz: "😮‍💨 Charchadim…", ru: "😮‍💨 Я устал…" }) : tr2({ uz: "✍️ Yana bittasini yozish", ru: "✍️ Написать ещё одно" })}</button>
              <span className="mono small" style={{ color: T.ink3 }}>{count} / {NEED}</span>
            </div>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "Charchoq darajasi", ru: "Уровень усталости" })} <span className="face-pop" key={count === 0 ? 0 : count < 12 ? 1 : count < 21 ? 2 : count < 30 ? 3 : 4} style={{ fontSize: 15 }}>{count < 12 ? "🙂" : count < 21 ? "😐" : count < 30 ? "😓" : "😮‍💨"}</span></span>
                <span className="mono small" style={{ color: count < NEED * 0.5 ? T.success : count < NEED * 0.8 ? "#C77800" : T.accent }}>{Math.round(count / NEED * 100)}%</span>
              </div>
              <div className="fatigue"><div className="fatigue-bar" style={{ width: `${count / NEED * 100}%`, color: count < NEED * 0.5 ? T.success : count < NEED * 0.8 ? "#E6A100" : T.accent, background: count < NEED * 0.5 ? T.success : count < NEED * 0.8 ? "#E6A100" : T.accent }} /></div>
            </div>
            {count >= 5 && count < NEED && <p className="hook-ack fade-step">{tr2({ uz: <>Hali <b>{NEED - count} ta</b> qoldi… va bu atigi 30 ta. 1000 ta bo'lsa-chi? 😅</>, ru: <>Осталось ещё <b>{NEED - count}</b>… и это всего 30. А если 1000? 😅</> })}</p>}
            <div className="fade-up delay-2"><SiklZavodi count={count} max={NEED} init="i = 1" cond={`i <= ${NEED}`} step="i++" load={Array.from({ length: NEED }, (_, k) => k + 1)} manual onAuto={() => setCount(NEED)} done={count >= NEED} compact /></div>
            {count >= NEED && <p className="hook-ack fade-step">{tr2({ uz: <>⚡ Bir zarbada 30 tasi tayyor! Mana <b>sikl</b> — mehnatni kompyuterga o'tkazadi.</>, ru: <>⚡ Одним махом готовы все 30! Вот что такое <b>цикл</b> — он перекладывает труд на компьютер.</> })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Dasturchi 1000 ta xabarni qanday yozadi?", ru: "Как программист напишет 1000 сообщений?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr2(o.label)}</span>
                  </button>;
  })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr2({ uz: <>To'g'ri yo'l — <b>sikl</b>! Bir marta yozasiz, kompyuter uni 1000 marta takrorlaydi. Bugun shuni o'rganamiz.</>, ru: <>Верный путь — <b>цикл</b>! Вы пишете один раз, а компьютер повторит 1000 раз. Этому сегодня и научимся.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "Sikl nima? — takrorlash", ru: "Что такое цикл? — повторение" }, tag: "" },
    { text: { uz: "for sikli — 3 qism", ru: "Цикл for — 3 части" }, tag: { uz: "boshlanish · shart · qadam", ru: "старт · условие · шаг" } },
    { text: { uz: "while sikli — shart bajarilguncha", ru: "Цикл while — пока верно условие" }, tag: "" },
    { text: { uz: "Massiv — qiymatlar ro'yxati", ru: "Массив — список значений" }, tag: "[0], [1], [2]" },
    { text: { uz: "Massivni aylanib chiqish — sikl + massiv", ru: "Обход массива — цикл + массив" }, tag: "" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState2(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 2 katta vosita", ru: "Два больших инструмента дня" })}</p>
      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="frame" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
          <span className="ic-spin" style={{ fontSize: 32 }}>🔁</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: "clamp(16px,2.2vw,19px)" }}>{tr2({ uz: "SIKL", ru: "ЦИКЛ" })}</p><p className="body" style={{ margin: "2px 0 0", color: T.ink2 }}>{tr2({ uz: "Bir amalni ko'p marta takrorlaydi (for, while)", ru: "Повторяет действие много раз (for, while)" })}</p></div>
        </div>
        <div className="frame" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
          <span className="ic-float" style={{ fontSize: 32 }}>📚</span>
          <div style={{ flex: 1 }}><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: "clamp(16px,2.2vw,19px)" }}>{tr2({ uz: "MASSIV", ru: "МАССИВ" })}</p><p className="body" style={{ margin: "2px 0 0", color: T.ink2 }}>{tr2({ uz: "Bitta o'zgaruvchida qiymatlar ro'yxati", ru: "Список значений в одной переменной" })}</p>
            <div className="mini-arr">{[0, 1, 2].map((i) => <span key={i} className="mini-cell" style={{ animationDelay: `${i * 0.45}s` }}>{i}</span>)}</div>
          </div>
        </div>
      </div>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>→ {tr2({ uz: "ikkalasini birga ishlatsak — haqiqiy kuch!", ru: "вместе они — настоящая сила!" })}</p>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr2({ uz: "5 qadam", ru: "5 шагов" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{tr2(s.text)}</span>{s.tag && <span className="step-tag">{tr2(s.tag)}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr2({ uz: <><span className="italic" style={{ color: T.accent }}>Dangasa</span> dasturchi bo'lishni o'rganamiz!</>, ru: <>Учимся быть <span className="italic" style={{ color: T.accent }}>ленивым</span> программистом!</> })}</h2>
        </div>
        <Mentor>{tr2({ uz: <>Yaxshi dasturchi <b style={{ color: T.ink }}>takrorlashni yoqtirmaydi</b>. Bir ishni 100 marta yozish o'rniga, u <b style={{ color: T.ink }}>siklga</b> "100 marta takrorla" deydi. Bugun ikkita vositani ochamiz — <b style={{ color: T.ink }}>sikl</b> va <b style={{ color: T.ink }}>massiv</b> — 5 ta qadamda.</>, ru: <>Хороший программист <b style={{ color: T.ink }}>не любит повторяться</b>. Вместо того чтобы писать одно и то же 100 раз, он говорит <b style={{ color: T.ink }}>циклу</b>: «повтори 100 раз». Сегодня откроем два инструмента — <b style={{ color: T.ink }}>цикл</b> и <b style={{ color: T.ink }}>массив</b> — за 5 шагов.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>📋 {tr2({ uz: "Bugungi 5 qadamni ko'rish", ru: "Посмотреть 5 шагов урока" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>↩ {tr2({ uz: "Vositalarni ko'rish", ru: "Посмотреть инструменты" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [mode, setMode] = useState2("manual");
  const [seen, setSeen] = useState2(/* @__PURE__ */ new Set(["manual"]));
  const done = seen.size >= 2;
  const set = (m) => {
    setMode(m);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(m);
      return n;
    });
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Sikl nima", ru: "Что такое цикл" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Ikkala usulni ko'ring", ru: "Посмотрите оба способа" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta ishni <span className="italic" style={{ color: T.accent }}>5 marta</span> — qanday yozamiz?</>, ru: <>Одно действие <span className="italic" style={{ color: T.accent }}>5 раз</span> — как это написать?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>"Salom" so'zini 5 marta chop etmoqchimiz. <b style={{ color: T.ink }}>Siklsiz</b> — har birini alohida yozasiz (5 qator). <b style={{ color: T.ink }}>Sikl bilan</b> — bir marta yozib, "5 marta takrorla" deysiz. Ikkala tugmani bosib solishtiring.</>, ru: <>Хотим напечатать слово «Salom» 5 раз. <b style={{ color: T.ink }}>Без цикла</b> — пишете каждое отдельно (5 строк). <b style={{ color: T.ink }}>С циклом</b> — пишете один раз и говорите «повтори 5 раз». Нажмите обе кнопки и сравните.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${mode === "manual" ? "chip-on" : ""}`} onClick={() => set("manual")}>😕 {tr2({ uz: "Siklsiz", ru: "Без цикла" })}</button>
              <button className={`chip ${mode === "loop" ? "chip-on" : ""}`} onClick={() => set("loop")}>🔁 {tr2({ uz: "Sikl bilan", ru: "С циклом" })}</button>
            </div>
            <div className="codebox demo-swap" key={mode}>
              {mode === "manual" ? <>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><CM>{tr2({ uz: "// 5 qator… 100 marta bo'lsa-chi?", ru: "// 5 строк… а если надо 100 раз?" })}</CM></div>
                </> : <>
                  <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>5</NUM>; i++) {"{"}</div>
                  <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div>{"}"}</div>
                  <div><CM>{tr2({ uz: "// 1 qator → 5 marta. 100 marta ham shu!", ru: "// 1 строка → 5 раз. И для 100 — та же!" })}</CM></div>
                </>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Natija (ikkalasida bir xil)", ru: "Результат (одинаковый в обоих)" })}</p>
            <Terminal lines={Array.from({ length: 5 }, () => tr2({ uz: "Salom", ru: "Привет" }))} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Natija aynan bir xil! Lekin <b>sikl</b> bilan kod qisqa, o'zgartirishi oson. Mana shuning uchun sikl kerak.</>, ru: <>✓ Результат абсолютно одинаковый! Но с <b>циклом</b> код короче и его легко менять. Вот зачем нужен цикл.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const N = 5;
  const [out, setOut] = useState2(storedAnswer ? Array.from({ length: N }, (_, i) => i + 1) : []);
  const [iVal, setIVal] = useState2(storedAnswer ? N : 0);
  const [running, setRunning] = useState2(false);
  const [part, setPart] = useState2(null);
  const timer = useRef2(null);
  const done = out.length >= N;
  const PARTS = {
    init: { color: T.blue, num: "1", name: { uz: "Boshlanish", ru: "Старт" }, code: "let i = 1", stair: { uz: "Konveyer qaysi sondan boshlaydi", ru: "С какого числа конвейер стартует" }, desc: { uz: "Sanagich qaysi sondan boshlanadi. Bu yerda i = 1 — birinchi quti.", ru: "С какого числа начинается счётчик. Здесь i = 1 — первая коробка." } },
    cond: { color: T.sun, num: "2", name: { uz: "Shart", ru: "Условие" }, code: "i <= 5", stair: { uz: "Konveyer qachongacha aylanadi", ru: "До каких пор конвейер крутится" }, desc: { uz: "Qachongacha davom etadi. i 5 dan oshmaguncha sikl ishlaydi; shart buzilsa — to'xtaydi.", ru: "Пока цикл продолжается: он работает, пока i не превысит 5; условие нарушилось — стоп." } },
    step: { color: T.success, num: "3", name: { uz: "Qadam", ru: "Шаг" }, code: "i++", stair: { uz: "Har aylanishda sanagich qancha oshadi", ru: "На сколько счётчик растёт за оборот" }, desc: { uz: "Har aylanishdan keyin i qanday o'zgaradi. i++ — i ga +1 (bir quti oldinga).", ru: "Как меняется i после каждой итерации. i++ — это +1 к i (одна коробка вперёд)." } }
  };
  useEffect2(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setOut([]);
    setIVal(0);
    setRunning(true);
    const tick = (i) => {
      setIVal(i);
      setOut((prev) => [...prev, i]);
      if (i < N) timer.current = setTimeout(() => tick(i + 1), 620);
      else setRunning(false);
    };
    timer.current = setTimeout(() => tick(1), 350);
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "for sikli", ru: "Цикл for" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval ishga tushiring", ru: "Сначала запустите" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Kompyuter 1 dan 5 gacha <span className="italic" style={{ color: T.accent }}>qanday</span> ko'tariladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> компьютер поднимается от 1 до 5?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>for — bu uch dastakli konveyer: <b style={{ color: T.blue }}>qaysi sondan boshlansin</b>, <b style={{ color: T.sun }}>qachongacha aylansin</b>, va <b style={{ color: T.success }}>har safar sanagich qancha oshsin</b>. Mana shu 3 sozlama qavs ichida turadi. Rangli qismlarni <b style={{ color: T.ink }}>bosib</b> bilib oling, so'ng "Ishga tushir"ni bosing.</>, ru: <>for — конвейер с тремя рычагами: <b style={{ color: T.blue }}>с какого числа начать</b>, <b style={{ color: T.sun }}>до каких пор крутиться</b> и <b style={{ color: T.success }}>на сколько увеличивать счётчик</b>. Эти 3 настройки стоят в скобках. <b style={{ color: T.ink }}>Нажмите</b> на цветные части, чтобы разобраться, а потом — «Запустить».</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1" style={{ fontSize: "clamp(13px,1.8vw,15px)" }}>
              <div>
                <KW>for</KW> (
                <span className="for-pt for-init" onClick={() => setPart("init")} style={{ cursor: "pointer", outline: part === "init" ? `2px solid ${T.blue}` : "none" }}>let i = 1</span>;{" "}
                <span className="for-pt for-cond" onClick={() => setPart("cond")} style={{ cursor: "pointer", outline: part === "cond" ? `2px solid ${T.sun}` : "none" }}>i &lt;= 5</span>;{" "}
                <span className="for-pt for-step" onClick={() => setPart("step")} style={{ cursor: "pointer", outline: part === "step" ? `2px solid ${T.success}` : "none" }}>i++</span>) {"{"}
              </div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Salom"', ru: '"Привет"' })}</STR>, i)</div>
              <div>{"}"}</div>
            </div>
            {part ? <div className="sk-info fade-step" key={part}>
                <span className="sk-tagbig"><span className="lg-dot" style={{ background: PARTS[part].color, width: 14, height: 14 }} /><span className="sk-wordbadge" style={{ color: PARTS[part].color, background: PARTS[part].color + "22" }}>{PARTS[part].num}. {tr2(PARTS[part].name)}</span><span className="mono" style={{ color: T.ink2 }}>{PARTS[part].code}</span></span>
                <p className="body" style={{ color: T.ink, margin: "10px 0 0" }}>⚙️ <b>{tr2(PARTS[part].stair)}.</b> {tr2(PARTS[part].desc)}</p>
              </div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>👆 {tr2({ uz: "Koddagi 3 ta rangli qismni bosing", ru: "Нажмите на 3 цветные части кода" })}</p></div>}
          </Col>
          <Col>
            <div className="fade-up delay-1"><SiklZavodi count={iVal} max={N} init="i = 1" cond="i <= 5" step="i++" done={done} /></div>
            <Terminal lines={out.map((v) => `${tr2({ uz: "Salom", ru: "Привет" })} ${v}`)} empty={{ uz: "// ▶ ishga tushiring", ru: "// ▶ запустите" }} />
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: "flex-start" }}>{running ? tr2({ uz: "Bajarilmoqda…", ru: "Выполняется…" }) : done ? tr2({ uz: "↻ Yana ishga tushir", ru: "↻ Запустить ещё раз" }) : tr2({ uz: "▶ Ishga tushir", ru: "▶ Запустить" })}</button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ i 1→2→3→4→5 bo'ldi, har safar bir marta ishladi. i = 6 bo'lganda shart (<span className="mono">i &lt;= 5</span>) buzildi — sikl to'xtadi.</>, ru: <>✓ i прошёл 1→2→3→4→5, каждый раз срабатывая по одному. При i = 6 условие (<span className="mono">i &lt;= 5</span>) нарушилось — цикл остановился.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Практика · вопрос 1" })}
  questionText="for siklida 'i++' nima vazifani bajaradi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>for siklidagi <span className="mono" style={{ color: T.accent }}>i++</span> nima qiladi?</>, ru: <>Что делает <span className="mono" style={{ color: T.accent }}>i++</span> в цикле for?</> })}</h2></>}
  options={[{ uz: "Siklni boshlang'ich qiymatini belgilaydi", ru: "Задаёт начальное значение цикла" }, { uz: "Har aylanishdan keyin i ni 1 ga oshiradi", ru: "После каждой итерации увеличивает i на 1" }, { uz: "Siklni butunlay to'xtatib qo'yadi", ru: "Полностью останавливает цикл" }, { uz: "Yangi massiv yaratadi", ru: "Создаёт новый массив" }]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! i++ — bu qadam. Har bir aylanishdan so'ng i qiymati 1 ga oshadi va shart qaytadan tekshiriladi.", ru: "Верно! i++ — это шаг. После каждой итерации значение i растёт на 1, и условие проверяется снова." }}
  explainWrong={{
    0: { uz: "Yo'q — boshlang'ich qiymat «let i = 1» qismi. i++ esa qadam — har safar i ni o'zgartiradi.", ru: "Нет — начальное значение задаёт часть «let i = 1». А i++ — шаг: он меняет i каждый раз." },
    2: { uz: "Yo'q — siklni shart to'xtatadi (i <= 5 buzilganda). i++ esa i ni oshiradi.", ru: "Нет — цикл останавливает условие (когда i <= 5 нарушится). А i++ увеличивает i." },
    3: { uz: "Yo'q — massiv boshqa narsa. i++ faqat i ni 1 ga oshiradi.", ru: "Нет — массив тут ни при чём. i++ лишь увеличивает i на 1." },
    default: { uz: "i++ — qadam: har aylanishdan keyin i ni 1 ga oshiradi.", ru: "i++ — шаг: после каждой итерации увеличивает i на 1." }
  }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [end, setEnd] = useState2(5);
  const [step, setStep] = useState2(1);
  const [seen, setSeen] = useState2(/* @__PURE__ */ new Set(["5-1"]));
  const done = seen.size >= 2;
  const mark = (e, s) => setSeen((prev) => {
    const n = new Set(prev);
    n.add(`${e}-${s}`);
    return n;
  });
  const setE = (e) => {
    setEnd(e);
    mark(e, step);
  };
  const setS = (s) => {
    setStep(s);
    mark(end, s);
  };
  const nums = [];
  for (let i = 1; i <= end; i += step) nums.push(i);
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Siklni boshqarish", ru: "Управление циклом" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Parametrni o'zgartiring", ru: "Измените параметр" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Siklni <span className="italic" style={{ color: T.accent }}>o'zingiz</span> boshqarib ko'ring</>, ru: <>Попробуйте управлять циклом <span className="italic" style={{ color: T.accent }}>сами</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>3 qismni o'zgartirsangiz — sikl boshqacha ishlaydi. <b style={{ color: T.ink }}>Shart</b>ni o'zgartiring (qachongacha) yoki <b style={{ color: T.ink }}>qadam</b>ni (qancha sakraydi). Pastdagi natija darhol o'zgaradi.</>, ru: <>Поменяете эти части — цикл заработает иначе. Измените <b style={{ color: T.ink }}>условие</b> (до каких пор) или <b style={{ color: T.ink }}>шаг</b> (на сколько прыгать). Результат внизу изменится сразу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Shart — i qachongacha?", ru: "Условие — до какого i?" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {[5, 8, 12].map((e) => <button key={e} className={`chip ${end === e ? "chip-on" : ""}`} onClick={() => setE(e)}>i &lt;= {e}</button>)}
            </div>
            <p className="flow-label" style={{ marginTop: 4 }}>{tr2({ uz: "Qadam — qancha sakraydi?", ru: "Шаг — на сколько прыгает?" })}</p>
            <div className="fade-up delay-2" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${step === 1 ? "chip-on" : ""}`} onClick={() => setS(1)}>i++ {tr2({ uz: "(bir-bir)", ru: "(по одному)" })}</button>
              <button className={`chip ${step === 2 ? "chip-on" : ""}`} onClick={() => setS(2)}>i += 2 {tr2({ uz: "(ikki-ikki)", ru: "(по два)" })}</button>
            </div>
            <div className="codebox" style={{ marginTop: 6 }}>
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; <span className="for-pt for-cond">i &lt;= {end}</span>; <span className="for-pt for-step">{step === 1 ? "i++" : "i += 2"}</span>) {"{"}</div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(i)</div>
              <div>{"}"}</div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: <>Natija — {nums.length} ta son</>, ru: <>Результат — чисел: {nums.length}</> })}</p>
            <div className="numline fade-up delay-1">
              {Array.from({ length: 12 }, (_, k) => k + 1).map((n) => <span key={n} className={`num-cell ${nums.includes(n) ? "hit" : ""}`}>{n}</span>)}
            </div>
            <Terminal lines={nums.map(String)} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Ko'rdingizmi? Bitta sonni o'zgartirdingiz — butun natija o'zgardi. Qadam <b>2</b> bo'lsa, sikl sonlarni <b>sakrab</b> o'tadi. Sikl moslashuvchan!</>, ru: <>✓ Видели? Поменяли одно число — изменился весь результат. Если шаг <b>2</b>, цикл идёт по числам <b>прыжками</b>. Цикл гибкий!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen5b = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Tekshiruv", ru: "Проверка" })}
  questionText="for (let i = 1; i <= 3; i++) console.log(i) — konsolda qaysi sonlar chiqadi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "Siklni o'qing", ru: "Прочитайте цикл" })}</p><h2 className="title h-ask" style={{ margin: "8px 0 2px" }}>{tr2({ uz: <>Bu sikl konsolga <span className="italic" style={{ color: T.accent }}>qaysi sonlarni</span> yozadi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Какие числа</span> этот цикл выведет в консоль?</> })}</h2><div className="codebox" style={{ marginTop: 10, marginBottom: 4 }}><div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>3</NUM>; i++) {"{"}</div><div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(i)</div><div>{"}"}</div></div></>}
  options={["1, 2, 3", "1, 2", "1, 2, 3, 4", "3, 2, 1"]}
  correctIdx={0}
  explainCorrect={{ uz: "To'g'ri! i = 1 dan boshlanadi va «i <= 3» bo'lgancha ishlaydi: 1, 2, 3. i = 4 bo'lganda shart buziladi — sikl to'xtaydi.", ru: "Верно! i начинается с 1 и работает, пока «i <= 3»: 1, 2, 3. При i = 4 условие нарушается — цикл останавливается." }}
  explainWrong={{
    1: { uz: "Deyarli! Shart «i <= 3» — ya'ni 3 ham kiradi (3 <= 3 — to'g'ri). Demak 1, 2, 3.", ru: "Почти! Условие «i <= 3» — значит, 3 тоже входит (3 <= 3 — истина). Итого 1, 2, 3." },
    2: { uz: "Yo'q — i = 4 bo'lganda «4 <= 3» noto'g'ri, sikl to'xtaydi. 4 chiqmaydi. Faqat 1, 2, 3.", ru: "Нет — при i = 4 условие «4 <= 3» ложно, цикл останавливается. 4 не выводится. Только 1, 2, 3." },
    3: { uz: "Yo'q — i++ i ni oshiradi (1 dan yuqoriga), kamaytirmaydi. Demak 1, 2, 3 tartibda.", ru: "Нет — i++ увеличивает i (от 1 вверх), а не уменьшает. Значит порядок 1, 2, 3." },
    default: { uz: "Boshlanish 1, shart «i <= 3» → 1, 2, 3.", ru: "Старт 1, условие «i <= 3» → 1, 2, 3." }
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEP = 20;
  const [suv, setSuv] = useState2(storedAnswer ? 100 : 0);
  const [iter, setIter] = useState2(storedAnswer ? 5 : 0);
  const [running, setRunning] = useState2(false);
  const timer = useRef2(null);
  const done = suv >= 100;
  useEffect2(() => () => clearTimeout(timer.current), []);
  const step = () => {
    if (running || suv >= 100) return;
    setSuv((v) => Math.min(v + STEP, 100));
    setIter((c) => c + 1);
  };
  const again = () => {
    clearTimeout(timer.current);
    setRunning(false);
    setSuv(0);
    setIter(0);
  };
  const run = () => {
    clearTimeout(timer.current);
    setSuv(0);
    setIter(0);
    setRunning(true);
    const tick = (v, c) => {
      setSuv(v);
      setIter(c);
      if (v < 100) timer.current = setTimeout(() => tick(Math.min(v + STEP, 100), c + 1), 480);
      else setRunning(false);
    };
    timer.current = setTimeout(() => tick(STEP, 1), 350);
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "while sikli", ru: "Цикл while" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Idishni to'ldiring", ru: "Наполните сосуд" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Necha marta takrorlashni <span className="italic" style={{ color: T.accent }}>bilmasak-chi?</span></>, ru: <>А если <span className="italic" style={{ color: T.accent }}>не знаем</span>, сколько раз повторять?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Zavoddagi idish <b style={{ color: T.ink }}>to'lguncha</b> suv quyiladi — hech kim oldindan «5 marta quy» demaydi. <span className="mono" style={{ color: T.accent }}>while</span> ham shunday: shart <b style={{ color: T.success }}>rost</b> bo'lsa takrorlaydi, <b style={{ color: T.accent }}>yolg'on</b> bo'lsa to'xtaydi.</>, ru: <>В сосуд на заводе льют, <b style={{ color: T.ink }}>пока он не наполнится</b> — никто заранее не говорит «налей 5 раз». <span className="mono" style={{ color: T.accent }}>while</span> работает так же: условие <b style={{ color: T.success }}>истинно</b> — повторяет, <b style={{ color: T.accent }}>ложно</b> — останавливается.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1">
              <div><KW>let</KW> suv = <NUM>0</NUM></div>
              <div><KW>while</KW> (<span className="for-pt for-cond">suv &lt; 100</span>) {"{"}</div>
              <div style={{ paddingLeft: 18 }}>suv += <NUM>20</NUM> <CM>{tr2({ uz: "// yana quyamiz", ru: "// подливаем ещё" })}</CM></div>
              <div>{"}"}</div>
            </div>
            {
    /* F-0803-17: avval QO'LDA bir qadam (o'quvchi shartni o'zi tekshiradi), keyin to'liq animatsiya */
  }
            <div className="fade-up delay-2" style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
              {done ? <button className="btn" onClick={again}>{tr2({ uz: "↻ Boshidan", ru: "↻ Сначала" })}</button> : <>
                    <button className="btn" onClick={step} disabled={running}>👣 {tr2({ uz: "Bir marta quy", ru: "Налить один раз" })}</button>
                    <button className="btn-ghost" onClick={run} disabled={running} style={{ padding: "11px 18px", fontSize: 14 }}>{running ? tr2({ uz: "Quyilmoqda…", ru: "Наливается…" }) : tr2({ uz: "▶ To'liq quyib ko'rsat", ru: "▶ Показать целиком" })}</button>
                  </>}
            </div>
            <div className={`loop-count fade-up delay-2 ${iter ? "bump" : ""}`} key={iter}>
              <span className="loop-count-n">{iter}</span>
              <span className="loop-count-l">{tr2({ uz: "aylanish bajarildi", ru: "итераций выполнено" })}</span>
            </div>
          </Col>
          <Col>
            <div className="glass-wrap fade-up delay-1">
              <span className="tap-emoji">🚰{running && <span className="drip">💧</span>}</span>
              <div className="glass">
                <div className="glass-fill" style={{ height: `${suv}%` }}>{suv > 0 && suv < 100 && <div className="glass-wave" />}</div>
                <span className="glass-pct">{suv}%</span>
                {running && suv > 0 && <span className="splash" key={suv}>+20</span>}
              </div>
              <p className="cond-label">👀 {tr2({ uz: "Tekshiruvchi", ru: "Проверяющий" })}</p>
              <div className={`cond-pill${done ? " stop" : ""}`} style={{ background: suv < 100 ? T.successSoft : T.accentSoft, color: suv < 100 ? T.success : T.accent }}>suv {suv} &lt; 100 → {suv < 100 ? tr2({ uz: "✓ rost — yana quy", ru: "✓ истина — лей ещё" }) : tr2({ uz: "✗ yolg'on — to'xta", ru: "✗ ложь — стоп" })}</div>
              <p className="mono small" style={{ color: T.ink3, margin: 0 }}>{tr2({ uz: `${iter}-aylanish`, ru: `итерация ${iter}` })}</p>
            </div>
            <div className="fade-up delay-2"><SiklZavodi count={iter} max={5} whileMode init="suv = 0" cond="suv < 100" step="suv += 20" done={done} compact /></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Idish to'ldi — sikl 5 marta ishladi. Biz sanamadik: <b>Tekshiruvchi</b> shart yolg'on bo'lgan lahzada o'zi to'xtatdi.</>, ru: <>✓ Сосуд полон — цикл сработал 5 раз. Мы не считали: <b>Проверяющий</b> сам остановил его в момент, когда условие стало ложным.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CARDS = {
    forc: { ic: "🔢", name: "for", when: { uz: "Necha marta — OLDINDAN MA'LUM", ru: "Сколько раз — ИЗВЕСТНО ЗАРАНЕЕ" }, ex: [{ uz: "5 marta sakra", ru: "прыгни 5 раз" }, { uz: "30 ta do'stga yoz", ru: "напиши 30 друзьям" }, { uz: "1 dan 100 gacha sana", ru: "сосчитай от 1 до 100" }] },
    whilec: { ic: "❓", name: "while", when: { uz: "Necha marta — NOMA'LUM (shartga bog'liq)", ru: "Сколько раз — НЕИЗВЕСТНО (зависит от условия)" }, ex: [{ uz: "jon tugaguncha o'yna", ru: "играй, пока не кончатся жизни" }, { uz: "parol to'g'ri bo'lguncha so'ra", ru: "спрашивай пароль, пока он не совпадёт" }, { uz: "idish to'lguncha quy", ru: "лей, пока сосуд не наполнится" }] }
  };
  const [active, setActive] = useState2(null);
  const [seen, setSeen] = useState2(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (k) => {
    setActive(k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="for ⚔️ while" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `${seen.size}/2 ko'ring`, ru: `Просмотрите ${seen.size}/2` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qaysi birini <span className="italic" style={{ color: T.accent }}>qachon</span> ishlatamiz?</>, ru: <>Какой из них <span className="italic" style={{ color: T.accent }}>когда</span> использовать?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Ikkalasi ham takrorlaydi. Farq <b style={{ color: T.ink }}>bitta savolda</b>: necha marta takrorlashni <b style={{ color: T.ink }}>oldindan bilamizmi?</b> Bilsak — <b style={{ color: T.accent }}>for</b>. Bilmasak, faqat shart bo'lsa — <b style={{ color: T.accent }}>while</b>. Ikkala kartani bosing.</>, ru: <>Оба повторяют. Разница — в <b style={{ color: T.ink }}>одном вопросе</b>: <b style={{ color: T.ink }}>знаем ли заранее</b>, сколько раз повторять? Знаем — <b style={{ color: T.accent }}>for</b>. Не знаем, есть только условие — <b style={{ color: T.accent }}>while</b>. Нажмите обе карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.keys(CARDS).map((k) => <button key={k} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 14, padding: "15px 16px", background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
                  <span className={k === "whilec" ? "pulse-q" : "ic-float"} style={{ fontSize: 28 }}>{CARDS[k].ic}</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: 18, color: T.accent }}>{CARDS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success, fontSize: 15 }}>✓</span>}
                </button>)}
            </div>
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span className={active === "whilec" ? "pulse-q" : "ic-float"} style={{ fontSize: 24 }}>{CARDS[active].ic}</span><span className="sk-wordbadge">{CARDS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: "11px 0 9px", fontWeight: 600 }}>{tr2(CARDS[active].when)}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {CARDS[active].ex.map((e, i) => <div key={i} className="ex-row" style={{ display: "flex", gap: 8, alignItems: "center", background: T.bg, borderRadius: 8, padding: "8px 11px", animationDelay: `${0.05 + i * 0.09}s` }}><span style={{ color: T.accent }}>•</span><span className="body" style={{ margin: 0, color: T.ink2 }}>{tr2(e)}</span></div>)}
                </div>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Bir kartani bosing", ru: "Нажмите на карточку" })}</p></div> : null}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Esda tuting: <b>for</b> = sanab bo'ladigan ishlar, <b>while</b> = "qachongacha?" deb so'raydigan ishlar.</>, ru: <>Запомните: <b>for</b> — задачи, которые можно сосчитать, <b>while</b> — задачи с вопросом «до каких пор?».</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const ARR = [{ e: "🍎", n: "olma" }, { e: "🍌", n: "banan" }, { e: "🍇", n: "uzum" }, { e: "🍓", n: "qulupnay" }];
  const [active, setActive] = useState2(null);
  const [seen, setSeen] = useState2(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (i) => {
    setActive(i);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(i);
      return n;
    });
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Massiv", ru: "Массив" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Elementlarni bosing", ru: "Нажимайте на элементы" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Ko'p narsani <span className="italic" style={{ color: T.accent }}>bitta joyda</span> qanday saqlaymiz?</>, ru: <>Как хранить много всего <span className="italic" style={{ color: T.accent }}>в одном месте</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>4 ta meva uchun 4 ta alohida o'zgaruvchi (<span className="mono">meva1, meva2…</span>) yasash — noqulay. 100 ta bo'lsa-chi? Yaxshisi — hammasini bitta <b style={{ color: T.ink }}>massivga</b>, raqamlangan qator qutilarga joylaymiz. Eng qizig'i: qutilar <b style={{ color: T.accent }}>1 dan emas, 0 dan</b> sanaladi! Dasturlashda shunday qabul qilingan: birinchi element — 0-o'rinda. Har bir qutini bosib ko'ring.</>, ru: <>Делать 4 отдельные переменные для 4 фруктов (<span className="mono">meva1, meva2…</span>) — неудобно. А если их 100? Лучше сложить всё в один <b style={{ color: T.ink }}>массив</b> — ряд пронумерованных коробок. Самое интересное: коробки считаются <b style={{ color: T.accent }}>не с 1, а с 0</b>! Так принято в программировании: первый элемент — на месте 0. Нажмите на каждую коробку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1">
              <div><KW>const</KW> mevalar = [<STR>"olma"</STR>, <STR>"banan"</STR>, <STR>"uzum"</STR>, <STR>"qulupnay"</STR>]</div>
            </div>
            <p className="flow-label">{tr2({ uz: "Qutilar — indeksini bosing", ru: "Коробки — нажмите на индекс" })}</p>
            <div className="arr-row">
              {ARR.map((it, i) => <button key={i} className={`arr-cell ex-row ${active === i ? "on" : ""}`} onClick={() => tap(i)} style={{ animationDelay: `${0.15 + i * 0.09}s` }}>
                  <span className="arr-emoji">{it.e}</span>
                  <span className="arr-name">{it.n}</span>
                  <span className="arr-idx">[{i}]</span>
                </button>)}
            </div>
          </Col>
          <Col>
            {active !== null ? <div className="sk-info fade-step" key={active}>
                <p className="flow-label" style={{ margin: "0 0 8px" }}>{tr2({ uz: "Indeks orqali olamiz", ru: "Получаем по индексу" })}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span className="mono" style={{ fontSize: "clamp(18px,3vw,24px)", color: T.ink }}>mevalar[<span style={{ color: T.accent, fontWeight: 700 }}>{active}</span>]</span>
                  <span className="mono" style={{ color: T.ink3, fontSize: 20 }}>→</span>
                  <span style={{ fontSize: 26 }}>{ARR[active].e}</span>
                  <span className="mono" style={{ fontSize: "clamp(16px,2.4vw,20px)", color: T.success, fontWeight: 700 }}>"{ARR[active].n}"</span>
                </div>
                <p className="body" style={{ color: T.ink, margin: "12px 0 0" }}>{active === 0 ? tr2({ uz: <>🎯 <b>Indeks 0</b> — eng birinchi element! Sanash noldan boshlanadi, shuning uchun "olma" — nolinchi.</>, ru: <>🎯 <b>Индекс 0</b> — самый первый элемент! Счёт идёт с нуля, поэтому "olma" — нулевая.</> }) : tr2({ uz: <>Bu <b>{active + 1}-element</b>, lekin indeksi <b>{active}</b> — chunki 0 dan sanadik.</>, ru: <>Это <b>{active + 1}-й элемент</b>, но его индекс <b>{active}</b> — потому что считали с 0.</> })}</p>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Bir qutini bosing — indeksini ko'ring", ru: "Нажмите на коробку — увидите её индекс" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Birinchi element <b>[0]</b>, oxirgisi <b>[3]</b>. Bu "0 dan sanash" — dasturlashning eng mashhur "tuzog'i". Endi bilasiz! 😉</>, ru: <>✓ Первый элемент <b>[0]</b>, последний <b>[3]</b>. Этот «счёт с нуля» — самая известная «ловушка» программирования. Теперь вы в курсе! 😉</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Практика · вопрос 2" })}
  questionText="mevalar = ['olma','banan','uzum']. mevalar[0] nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><div className="codebox" style={{ marginTop: 10, marginBottom: 6 }}><div><KW>const</KW> mevalar = [<STR>"olma"</STR>, <STR>"banan"</STR>, <STR>"uzum"</STR>]</div></div><h2 className="title h-ask" style={{ marginTop: 6 }}>{tr2({ uz: <><span className="mono" style={{ color: T.accent }}>mevalar[0]</span> nimaga teng?</>, ru: <>Чему равно <span className="mono" style={{ color: T.accent }}>mevalar[0]</span>?</> })}</h2></>}
  options={['"banan"', '"olma"', { uz: "Xato — [0] yo'q", ru: "Ошибка — [0] не существует" }, '"uzum"']}
  correctIdx={1}
  explainCorrect={{ uz: `To'g'ri! Indeks 0 dan boshlanadi, shuning uchun mevalar[0] — birinchi element, ya'ni "olma".`, ru: 'Верно! Индекс начинается с 0, поэтому mevalar[0] — первый элемент, то есть "olma".' }}
  explainWrong={{
    0: { uz: `Yo'q — "banan" ikkinchi element, uning indeksi [1]. [0] esa birinchi — "olma".`, ru: 'Нет — "banan" второй элемент, его индекс [1]. А [0] — первый, это "olma".' },
    2: { uz: "Yo'q — [0] aniq bor: u birinchi elementni bildiradi (indeks 0 dan boshlanadi).", ru: "Нет — [0] точно существует: это первый элемент (индекс начинается с 0)." },
    3: { uz: `Yo'q — "uzum" uchinchi element, indeksi [2]. [0] — "olma".`, ru: 'Нет — "uzum" третий элемент, его индекс [2]. [0] — это "olma".' },
    default: { uz: 'Indeks 0 dan boshlanadi → mevalar[0] = "olma".', ru: 'Индекс начинается с 0 → mevalar[0] = "olma".' }
  }}
/>;
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const ARR = [{ e: "🍎", n: "olma" }, { e: "🍌", n: "banan" }, { e: "🍇", n: "uzum" }, { e: "🍓", n: "qulupnay" }];
  const N = ARR.length;
  const [hi, setHi] = useState2(-1);
  const [out, setOut] = useState2(storedAnswer ? ARR.map((a) => a.n) : []);
  const [running, setRunning] = useState2(false);
  const timer = useRef2(null);
  const done = out.length >= N;
  useEffect2(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setOut([]);
    setHi(-1);
    setRunning(true);
    const tick = (i) => {
      setHi(i);
      setOut((prev) => [...prev, ARR[i].n]);
      if (i < N - 1) timer.current = setTimeout(() => tick(i + 1), 640);
      else {
        setRunning(false);
        timer.current = setTimeout(() => setHi(-1), 700);
      }
    };
    timer.current = setTimeout(() => tick(0), 350);
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Aylanib chiqish", ru: "Обход массива" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval ishga tushiring", ru: "Сначала запустите" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Sikl massivni <span className="italic" style={{ color: T.accent }}>birma-bir</span> o'qiydi</>, ru: <>Цикл читает массив <span className="italic" style={{ color: T.accent }}>по одному</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Mana eng kuchli birikma! <b style={{ color: T.ink }}>for</b> sikli massivning har bir elementini <b style={{ color: T.ink }}>birma-bir ko'rib chiqadi</b> — buni "ro'yxatni <b style={{ color: T.ink }}>aylanib chiqish</b>" deymiz. <span className="mono" style={{ color: T.accent }}>i</span> indeks bo'ladi (0, 1, 2…), <span className="mono" style={{ color: T.accent }}>.length</span> esa massivda nechta element borligini aytadi. Ishga tushiring.</>, ru: <>Вот самая мощная связка! Цикл <b style={{ color: T.ink }}>for</b> просматривает каждый элемент массива <b style={{ color: T.ink }}>по одному</b> — это называется «<b style={{ color: T.ink }}>обход</b> списка». <span className="mono" style={{ color: T.accent }}>i</span> будет индексом (0, 1, 2…), а <span className="mono" style={{ color: T.accent }}>.length</span> говорит, сколько элементов в массиве. Запускайте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1">
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>0</NUM>; i &lt; mevalar.<FN>length</FN>; i++) {"{"}</div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(mevalar[<span style={{ color: T.accent }}>i</span>])</div>
              <div>{"}"}</div>
            </div>
            <div className="arr-row fade-up delay-2">
              {ARR.map((it, i) => <div key={i} className={`arr-cell ${hi === i ? "scan" : ""}`}>
                  <span className="arr-emoji">{it.e}</span>
                  <span className="arr-name">{it.n}</span>
                  <span className="arr-idx">[{i}]</span>
                </div>)}
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: "flex-start" }}>{running ? tr2({ uz: "Aylanyapti…", ru: "Обходит…" }) : done ? tr2({ uz: "↻ Yana", ru: "↻ Ещё раз" }) : tr2({ uz: "▶ Ishga tushir", ru: "▶ Запустить" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Natija (har bir element)", ru: "Результат (каждый элемент)" })}</p>
            <Terminal lines={out} empty={{ uz: "// ▶ ishga tushiring", ru: "// ▶ запустите" }} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Sikl massivning 4 ta elementini birma-bir chop etdi. <span className="mono">i &lt; .length</span> tufayli oxiriga yetganda o'zi to'xtadi — qancha element bo'lsa ham ishlaydi!</>, ru: <>✓ Цикл напечатал 4 элемента массива по одному. Благодаря <span className="mono">i &lt; .length</span> он сам остановился в конце — и так с любым числом элементов!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const NAMES = ["Ali", "Laylo", "Bobur"];
  const N = NAMES.length;
  const [out, setOut] = useState2(storedAnswer ? NAMES.map((n) => `${tr2({ uz: "Bayram muborak", ru: "С праздником" })}, ${n}`) : []);
  const [running, setRunning] = useState2(false);
  const timer = useRef2(null);
  const done = out.length >= N;
  useEffect2(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setOut([]);
    setRunning(true);
    const tick = (i) => {
      setOut((prev) => [...prev, `${tr2({ uz: "Bayram muborak", ru: "С праздником" })}, ${NAMES[i]}`]);
      if (i < N - 1) timer.current = setTimeout(() => tick(i + 1), 460);
      else setRunning(false);
    };
    timer.current = setTimeout(() => tick(0), 300);
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Hayotiy misol", ru: "Пример из жизни" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Hammaga yuboring", ru: "Отправьте всем" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Esingizdami — <span className="italic" style={{ color: T.accent }}>30 ta xabar?</span> Mana yechim!</>, ru: <>Помните — <span className="italic" style={{ color: T.accent }}>30 сообщений?</span> Вот решение!</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Dars boshida do'stlarga qo'lda yozayotgan edingiz. Endi qo'lingizda kuchli usul bor: do'stlar ro'yxatini massivga solamiz, sikl esa ro'yxatni <b style={{ color: T.ink }}>aylanib chiqib</b>, <b style={{ color: T.ink }}>har biriga</b> tabrik yozadi — bir marta yozib! Tugmani bosing.</>, ru: <>В начале урока вы писали друзьям вручную. Теперь у вас мощный приём: кладём список друзей в массив, а цикл <b style={{ color: T.ink }}>обходит</b> список и пишет поздравление <b style={{ color: T.ink }}>каждому</b> — написали один раз! Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1" style={{ lineHeight: 2 }}>
              <div><KW>const</KW> dostlar = [<STR>"Ali"</STR>, <STR>"Laylo"</STR>, <STR>"Bobur"</STR>]</div>
              <div style={{ marginTop: 10 }}><KW>for</KW> (<KW>let</KW> i = <NUM>0</NUM>; i &lt; dostlar.<FN>length</FN>; i++) {"{"}</div>
              <div style={{ paddingLeft: 16 }}><FN>console</FN>.<FN>log</FN>(<STR>{tr2({ uz: '"Bayram muborak, "', ru: '"С праздником, "' })}</STR> + dostlar[i])</div>
              <div>{"}"}</div>
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: "flex-start" }}>{running ? tr2({ uz: "Yuborilmoqda…", ru: "Отправляется…" }) : done ? tr2({ uz: "↻ Yana yuborish", ru: "↻ Отправить ещё раз" }) : tr2({ uz: "🎉 Hammaga tabrik yuborish", ru: "🎉 Отправить всем поздравление" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sikl har bir do'stga yuboryapti", ru: "Цикл отправляет каждому другу" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {NAMES.map((nm, i) => {
    const got = out.length > i;
    return <div key={i} className={`friend-card ${got ? "got" : ""}`}>
                    <span className="friend-ava">{["🧑", "👩", "🧔"][i]}</span>
                    <div><div className="friend-name">{nm}</div><div className="friend-msg">{got ? `"${tr2({ uz: "Bayram muborak", ru: "С праздником" })}, ${nm}"` : tr2({ uz: "navbatini kutyapti…", ru: "ждёт своей очереди…" })}</div></div>
                    <span className="friend-status">{got ? "✅" : "✉️"}</span>
                  </div>;
  })}
            </div>
            <Terminal lines={out} empty={{ uz: "// ▶ tugmani bosing", ru: "// ▶ нажмите кнопку" }} title={{ uz: "xabarlar", ru: "сообщения" }} />
            <div className="fade-up delay-2"><SiklZavodi count={out.length} max={N} init="i = 0" cond="i < dostlar.length" step="i++" load={NAMES} done={done} compact /></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ 3 ta shaxsiy tabrik — <b>bitta sikl bilan</b>! Ro'yxatda 1000 ta nom bo'lsa ham, kod aynan shu qoladi. Mana dasturchining "dangasaligi" — aslida zukkolik!</>, ru: <>✓ 3 личных поздравления — <b>одним циклом</b>! Даже если в списке 1000 имён, код останется тем же. Вот она, «лень» программиста — на самом деле смекалка!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Практика · вопрос 3" })}
  questionText="dostlar massivida 5 ta nom bor. for (i=0; i<dostlar.length; i++) sikli necha marta ishlaydi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><div className="codebox" style={{ marginTop: 10, marginBottom: 6 }}><div><CM>{tr2({ uz: "// dostlar = 5 ta nom", ru: "// dostlar = 5 имён" })}</CM></div><div><KW>for</KW> (<KW>let</KW> i = <NUM>0</NUM>; i &lt; dostlar.<FN>length</FN>; i++) {"{ … }"}</div></div><h2 className="title h-ask" style={{ marginTop: 6 }}>{tr2({ uz: <>Sikl <span className="italic" style={{ color: T.accent }}>necha marta</span> ishlaydi?</>, ru: <>Цикл сработает <span className="italic" style={{ color: T.accent }}>сколько раз</span>?</> })}</h2></>}
  options={[{ uz: "4 marta", ru: "4 раза" }, { uz: "5 marta", ru: "5 раз" }, { uz: "6 marta", ru: "6 раз" }, { uz: "Cheksiz", ru: "Бесконечно" }]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! .length = 5, sikl i = 0, 1, 2, 3, 4 bo'lganda ishlaydi — ya'ni 5 marta, har bir element uchun bir marta.", ru: "Верно! .length = 5, цикл работает при i = 0, 1, 2, 3, 4 — то есть 5 раз, по разу на каждый элемент." }}
  explainWrong={{
    0: { uz: "Yo'q — bu klassik «±1» xato. i 0,1,2,3,4 — bu 5 ta qiymat. Demak 5 marta.", ru: "Нет — это классическая ошибка «±1». i идёт 0,1,2,3,4 — это 5 значений. Значит 5 раз." },
    2: { uz: "Yo'q — i 5 bo'lganda «5 < 5» noto'g'ri, sikl to'xtaydi. Demak 6 emas, 5 marta.", ru: "Нет — при i = 5 условие «5 < 5» ложно, цикл останавливается. Значит не 6, а 5 раз." },
    3: { uz: "Yo'q — i++ tufayli i oshadi va shart bir kun buziladi. Cheksiz emas — 5 marta.", ru: "Нет — благодаря i++ значение i растёт, и условие однажды нарушится. Не бесконечно — 5 раз." },
    default: { uz: ".length = 5 → i 0..4 → 5 marta.", ru: ".length = 5 → i 0..4 → 5 раз." }
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const MSGS = [{ uz: "Men dasturchiman!", ru: "Я программист!" }, { uz: "Sikl — bu kuch!", ru: "Цикл — это сила!" }];
  const [n, setN] = useState2(5);
  const [msgIdx, setMsgIdx] = useState2(0);
  const [out, setOut] = useState2([]);
  const [running, setRunning] = useState2(false);
  const [ran, setRan] = useState2(!!storedAnswer);
  const timer = useRef2(null);
  const done = ran;
  useEffect2(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setOut([]);
    setRunning(true);
    const msg = tr2(MSGS[msgIdx]);
    const tick = (i) => {
      setOut((prev) => [...prev, `${i}. ${msg}`]);
      if (i < n) timer.current = setTimeout(() => tick(i + 1), 360);
      else {
        setRunning(false);
        setRan(true);
      }
    };
    timer.current = setTimeout(() => tick(1), 300);
  };
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Amaliyot · o'z siklingiz", ru: "Практика · ваш цикл" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Siklni ishga tushiring", ru: "Запустите цикл" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(8px,1.4vw,14px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>siz</span> sikl quring</>, ru: <>Теперь цикл строите <span className="italic" style={{ color: T.accent }}>вы</span></> })}</h2></div>
        <Mentor>{tr2({ uz: <>Navbat sizga! <b style={{ color: T.ink }}>Necha marta</b> takrorlashni va <b style={{ color: T.ink }}>qaysi xabarni</b> tanlang, keyin "Ishga tushir"ni bosing. Kod o'zgarishini va natijani kuzating.</>, ru: <>Ваш ход! Выберите, <b style={{ color: T.ink }}>сколько раз</b> повторять и <b style={{ color: T.ink }}>какое сообщение</b>, затем нажмите «Запустить». Следите, как меняется код и результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Necha marta? (shart)", ru: "Сколько раз? (условие)" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {[3, 5, 7].map((v) => <button key={v} className={`chip ${n === v ? "chip-on" : ""}`} onClick={() => {
    setN(v);
    setRan(false);
  }}>{tr2({ uz: `${v} marta`, ru: `${v} ${v === 3 ? "раза" : "раз"}` })}</button>)}
            </div>
            <p className="flow-label" style={{ marginTop: 4 }}>{tr2({ uz: "Qaysi xabar?", ru: "Какое сообщение?" })}</p>
            <div className="fade-up delay-2" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MSGS.map((m, i) => <button key={i} className={`chip ${msgIdx === i ? "chip-on" : ""}`} onClick={() => {
    setMsgIdx(i);
    setRan(false);
  }}>"{tr2(m)}"</button>)}
            </div>
            <div className="codebox" style={{ marginTop: 6 }}>
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>{n}</NUM>; i++) {"{"}</div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(i + <STR>". {tr2(MSGS[msgIdx])}"</STR>)</div>
              <div>{"}"}</div>
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: "flex-start" }}>{running ? tr2({ uz: "Bajarilmoqda…", ru: "Выполняется…" }) : tr2({ uz: "▶ Ishga tushir", ru: "▶ Запустить" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sizning natijangiz", ru: "Ваш результат" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", alignItems: "center", gap: 13, background: T.paper, borderRadius: 12, padding: "12px 18px", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <span className="rep-badge burst" key={out.length}>{out.length}</span>
              <div><div className="flow-label" style={{ margin: 0 }}>{tr2({ uz: "marta bajarildi", ru: "раз выполнено" })}</div><div className="mono small" style={{ color: T.ink2 }}>{tr2({ uz: `${n} martadan`, ru: `из ${n}` })}</div></div>
              {done && <span className="burst" key="cel" style={{ marginLeft: "auto", fontSize: 30 }}>🎉</span>}
            </div>
            <Terminal lines={out} empty={{ uz: "// parametrni tanlab, ishga tushiring", ru: "// выберите параметры и запустите" }} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Zo'r! Siz haqiqiy sikl qurdingiz va ishga tushirdingiz. Parametrni o'zgartirib, yana sinab ko'ring.</>, ru: <>✓ Класс! Вы собрали настоящий цикл и запустили его. Поменяйте параметры и попробуйте ещё.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState2(storedAnswer ? "step" : null);
  const [fixed, setFixed] = useState2(!!storedAnswer);
  const found = picked === "step";
  const done = fixed;
  const click = (part) => {
    if (found) return;
    setPicked(part);
  };
  const fix = () => setFixed(true);
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Debugging", ru: "Дебаггинг" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Yakuniy sinov →", ru: "Финальное испытание →" }) : found ? tr2({ uz: "Endi tuzating", ru: "Теперь исправьте" }) : tr2({ uz: "Xatoni toping", ru: "Найдите ошибку" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bu sikl <span className="italic" style={{ color: T.accent }}>to'xtamayapti</span> — nega?</>, ru: <>Этот цикл <span className="italic" style={{ color: T.accent }}>не останавливается</span> — почему?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI 1 dan 5 gacha sanaydigan sikl yozdi, lekin u <b style={{ color: T.ink }}>cheksiz</b> aylanyapti! Sir <b style={{ color: T.ink }}>qadam</b> qismida yashiringan. Diqqat bilan o'qing: i 5 ga <b style={{ color: T.ink }}>yaqinlashyaptimi</b>? Xato qismni toping va bosing.</>, ru: <>ИИ написал цикл, считающий от 1 до 5, но он крутится <b style={{ color: T.ink }}>бесконечно</b>! Секрет спрятан в части <b style={{ color: T.ink }}>шаг</b>. Читайте внимательно: i вообще <b style={{ color: T.ink }}>приближается</b> к 5? Найдите ошибочную часть и нажмите на неё.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr2({ uz: "1 dan 5 gacha sanaymiz:", ru: "Считаем от 1 до 5:" })}</span></div>
              <div className="ai-code">
                <div className="ai-line" style={{ cursor: "default" }}>
                  <KW>for</KW> (
                  <span onClick={() => click("init")} style={{ cursor: found ? "default" : "pointer" }}>let i = 1</span>;{" "}
                  <span onClick={() => click("cond")} style={{ cursor: found ? "default" : "pointer" }}>i &lt;= 5</span>;{" "}
                  <span className={found ? fixed ? "tok-ok" : "tok-bad" : ""} onClick={() => click("step")} style={{ cursor: found ? "default" : "pointer" }}>{fixed ? "i++" : "i--"}</span>) {"{"}
                </div>
                <div className="ai-line" style={{ cursor: "default", paddingLeft: 16 }}><FN>console</FN>.<FN>log</FN>(i)</div>
                <div className="ai-line" style={{ cursor: "default" }}>{"}"}</div>
              </div>
              {!found && <p className="ai-prompt">{tr2({ uz: "Qaysi qism xato? Ustiga bosing.", ru: "Какая часть с ошибкой? Нажмите на неё." })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={fix}>🔧 {tr2({ uz: "i-- ni i++ ga almashtirish", ru: "Заменить i-- на i++" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: "normal", fontWeight: 600 }}>✓ {tr2({ uz: "Tuzatildi — endi i oshadi va sikl 5 da to'xtaydi!", ru: "Исправлено — теперь i растёт, и цикл остановится на 5!" })}</p>}
            </div>
            {!fixed ? <div className="term fade-up delay-2">
                <div className="term-bar"><span className="term-dot" style={{ background: "#FF5F56" }} /><span className="term-dot" style={{ background: "#FFBD2E" }} /><span className="term-dot" style={{ background: "#27C93F" }} /><span className="term-title">console</span></div>
                <div className="term-body">{[1, 0, -1, -2].map((v, k) => <div key={k} className="term-line"><span className="term-arrow" style={{ color: T.accent }}>›</span><span>{v}</span></div>)}<div className="term-line warn-pulse" style={{ color: T.accent }}><span className="term-arrow" style={{ color: T.accent }}>›</span><span>⋮</span></div><p className="term-empty warn-pulse" style={{ color: T.accent }}>⚠️ {tr2({ uz: "i kamayyapti — 5 ga hech yetmaydi, cheksiz!", ru: "i уменьшается — до 5 не дойдёт никогда, бесконечно!" })}</p></div>
              </div> : <div className="term fade-step">
                <div className="term-bar"><span className="term-dot" style={{ background: "#FF5F56" }} /><span className="term-dot" style={{ background: "#FFBD2E" }} /><span className="term-dot" style={{ background: "#27C93F" }} /><span className="term-title">console</span></div>
                <div className="term-body">{[1, 2, 3, 4, 5].map((v) => <div key={v} className="term-line"><span className="term-arrow">›</span><span>{v}</span></div>)}<p className="term-empty" style={{ color: T.success }}>✓ {tr2({ uz: "5 marta ishladi va to'xtadi", ru: "сработал 5 раз и остановился" })}</p></div>
              </div>}
          </Col>
          <Col>
            {!found && (picked && picked !== "step" ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bu qism to'g'ri. {picked === "init" ? "Boshlanish (i = 1) — joyida." : "Shart (i <= 5) — joyida."} Xato esa <b>qadam</b> qismida — i qaysi tomonga o'zgaryapti?</>, ru: <>Эта часть верна. {picked === "init" ? "Старт (i = 1) — на месте." : "Условие (i <= 5) — на месте."} А ошибка в части <b>шаг</b> — в какую сторону меняется i?</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Eslang: sikl to'xtashi uchun i <b style={{ color: T.ink }}>shartga yaqinlashishi</b> kerak. Bu yerda i 5 ga tomon ketyaptimi yoki undan <b style={{ color: T.ink }}>uzoqlashyaptimi?</b></>, ru: <>Помните: чтобы цикл остановился, i должен <b style={{ color: T.ink }}>приближаться к условию</b>. Здесь i идёт к 5 или <b style={{ color: T.ink }}>удаляется от неё?</b></> })}</p></div>)}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>✓ {tr2({ uz: "Topdingiz!", ru: "Нашли!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><span className="mono">i--</span> i ni <b>kamaytiradi</b> (1, 0, -1, …) — 5 ga hech qachon yetmaydi. To'g'risi: <span className="mono">i++</span>. Chap tugmani bosing →</>, ru: <><span className="mono">i--</span> <b>уменьшает</b> i (1, 0, -1, …) — до 5 не дойдёт никогда. Правильно: <span className="mono">i++</span>. Нажмите кнопку слева →</> })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr2({ uz: "Topdingiz va tuzatdingiz — bu debugging!", ru: "Нашли и исправили — это дебаггинг!" })}</p><p className="ta-sub">{tr2({ uz: "Cheksiz sikl — qadam shartga yaqinlashmaganda yuz beradi", ru: "Бесконечный цикл случается, когда шаг не приближает к условию" })}</p></div>}
            <div className="fade-up delay-2"><SiklZavodi count={fixed ? 5 : 8} max={5} init="i = 1" cond="i <= 5" step={fixed ? "i++" : "i--"} cheksiz={!fixed} done={fixed} compact /></div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
  const [hwOpen, setHwOpen] = useState2(false);
  const [hwCharge, setHwCharge] = useState2(false);
  const fireHw = () => {
    if (hwCharge || hwOpen) return;
    setHwCharge(true);
    setTimeout(() => {
      setHwOpen(true);
      setHwCharge(false);
    }, 500);
  };
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState2(false);
  const [arenaSolo, setArenaSolo] = useState2(false);
  const quizSt = _live && _live.quiz && _live.quiz.state || "off";
  const isStudentL = _live && _live.mode === "student";
  const isMentorL = _live && _live.mode === "mentor";
  const classOver = !!(_live && (_live.status === "ended" || !_live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== "done";
  const studentLive = isStudentL && !studentSolo && quizSt !== "off";
  const studentWait = isStudentL && !studentSolo && quizSt === "off";
  const openArena = async () => {
    if (isMentorL && quizSt === "off") {
      try {
        await _live.quizControl("lobby", -1);
      } catch {
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const RECAP = [{ uz: "Sikl — bir amalni ko'p marta takrorlaydi", ru: "Цикл повторяет действие много раз" }, { uz: "for — 3 qism: boshlanish, shart, qadam", ru: "for — 3 части: старт, условие, шаг" }, { uz: "while — shart rost ekan takrorlaydi", ru: "while повторяет, пока условие истинно" }, { uz: "Massiv — qutilar qatori, indeks 0 dan", ru: "Массив — ряд коробок, индекс с 0" }, { uz: "Aylanib chiqish — for + massiv[i] + .length", ru: "Обход — for + massiv[i] + .length" }];
  const HOMEWORK = [{ b: { uz: "1 dan 20 gacha", ru: "От 1 до 20" }, t: { uz: "— for sikli bilan barcha sonlarni chop eting", ru: "— выведите все числа циклом for" } }, { b: { uz: "O'z ro'yxatingiz", ru: "Свой список" }, t: { uz: "— 5 ta sevimli narsangizni massivga solib, sikl bilan aylanib chiqing", ru: "— положите 5 любимых вещей в массив и обойдите его циклом" } }, { b: { uz: "Juft sonlar", ru: "Чётные числа" }, t: { uz: "— 2 dan 10 gacha faqat juft sonlarni chiqaring (i += 2)", ru: "— выведите только чётные от 2 до 10 (i += 2)" } }];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash", ru: "Завершить" })} ✓</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Dars tugadi", ru: "Урок завершён" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>takrorlashni</span> kompyuterga topshirasiz.</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>повторение</span> вы поручаете компьютеру.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark
    stats={false}
    liveOn={studentLive}
    disabled={studentWait}
    onClick={studentWait ? void 0 : openArena}
    hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0}
  />
        </div>
        {arena && <QuizArena live={_live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: "50%", background: T.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> {tr2({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr2(r)}</span></li>)}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 {tr2({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr2({ uz: "Sikllar bilan mashq qiling:", ru: "Потренируйтесь с циклами:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{tr2(h.b)}</b> <span className="t">{tr2(h.t)}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "Sikllar — eng ko'p ishlatiladigan vosita. Mashq qilsangiz, qo'lingizga o'tirib qoladi! 🚀", ru: "Циклы — самый используемый инструмент. Потренируетесь — и рука набьётся! 🚀" })}</p>{typeof onHomework === "function" && <button className="hw-run" onClick={onHomework}>✍️ {tr2({ uz: "Kompilyatorda yozib tekshirish →", ru: "Написать и проверить в компиляторе →" })}</button>}</div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr2({ uz: "Nishonlaringiz", ru: "Ваши награды" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
    </Stage>;
};
var Q_LABELS = { 4: { uz: "1 — i++ qadami", ru: "1 — шаг i++" }, 6: { uz: "2 — Sikl natijasi", ru: "2 — Результат цикла" }, 10: { uz: "3 — Massiv indeksi", ru: "3 — Индекс массива" }, 13: { uz: "4 — Necha marta", ru: "4 — Сколько раз" } };
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
var INLINE_KEYS = { s4: 1, s5b: 0, s9: 1, s12: 1 };
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
  return <Stage eyebrow={tr2({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr2({ uz: "To'liq reyting", ru: "Полный рейтинг" })}</div>
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
    /* Savollar bo'yicha — qaysi mavzu qiyin bo'ldi */
  }
            <div className="card fade-up d2">
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr2({ uz: "Savollar bo'yicha", ru: "По вопросам" })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map((q) => {
    const qa = rows.filter((r) => r.screen_idx === q);
    const okN = qa.filter((r) => r.correct).length;
    const pct = qa.length ? Math.round(okN / qa.length * 100) : 0;
    const hard = qa.length >= 2 && pct < 50;
    return <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{Q_LABELS[q] ? tr2(Q_LABELS[q]) : `#${q}`}{hard && " ⚠️"}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>;
  })}
              </div>
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr2({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.", ru: "Вопросы со значком ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить их ещё раз." })}</p>}
            </div>
          </>}
      </div>
    </Stage>;
};
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "for", l: 6, t: 18, s: 36, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: "{ }", l: 84, t: 12, s: 34, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: "i++", l: 9, t: 74, s: 30, c: "rgba(255,110,70,0.15)", d: 27, dl: 0.8 },
  { ch: "while", l: 76, t: 70, s: 28, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: "i <= 5", l: 44, t: 86, s: 26, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "i--", l: 66, t: 24, s: 24, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: ";", l: 24, t: 36, s: 26, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "i=1", l: 92, t: 46, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: "[ ]", l: 2, t: 46, s: 26, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "`for` siklining 3 qismi to'g'ri tartibda qaysi?", ru: "Три части цикла `for` в правильном порядке?" }, opts: [{ uz: "boshlanish, shart, qadam", ru: "старт, условие, шаг" }, { uz: "shart, qadam, boshlanish", ru: "условие, шаг, старт" }, { uz: "qadam, boshlanish, shart", ru: "шаг, старт, условие" }, { uz: "faqat shart", ru: "только условие" }], correct: 0 },
  { q: { uz: "`let i = 1` — for siklining qaysi qismi?", ru: "`let i = 1` — какая это часть цикла for?" }, opts: [{ uz: "Boshlanish", ru: "Старт" }, { uz: "Shart", ru: "Условие" }, { uz: "Qadam", ru: "Шаг" }, { uz: "Tana", ru: "Тело" }], correct: 0 },
  { q: { uz: "`for (let i = 0; i < 3; i++)` sikli necha marta ishlaydi?", ru: "Сколько раз сработает цикл `for (let i = 0; i < 3; i++)`?" }, opts: ["3", "2", "4", { uz: "cheksiz", ru: "бесконечно" }], correct: 0 },
  { q: { uz: "`i++` har aylanishda `i` ni nima qiladi?", ru: "Что `i++` делает с `i` на каждой итерации?" }, opts: [{ uz: "1 ga kamaytiradi", ru: "уменьшает на 1" }, { uz: "1 ga oshiradi", ru: "увеличивает на 1" }, { uz: "0 qiladi", ru: "обнуляет" }, { uz: "o'zgartirmaydi", ru: "не меняет" }], correct: 1 },
  { q: { uz: "Sikl qachon to'xtaydi?", ru: "Когда цикл останавливается?" }, opts: [{ uz: "`i = 0` bo'lganda", ru: "когда `i = 0`" }, { uz: "Shart noto'g'ri (`false`) bo'lganda", ru: "когда условие ложно (`false`)" }, { uz: "Hech qachon to'xtamaydi", ru: "никогда не останавливается" }, { uz: "Birinchi aylanishdan keyin", ru: "после первой итерации" }], correct: 1 },
  { q: { uz: "Cheksiz sikl qachon yuzaga keladi?", ru: "Когда возникает бесконечный цикл?" }, opts: [{ uz: "Shart juda katta bo'lsa", ru: "если условие слишком большое" }, { uz: "Qadam shartga yaqinlashmasa", ru: "если шаг не приближает к условию" }, { uz: "Massiv bo'sh bo'lsa", ru: "если массив пустой" }, { uz: "`i` ni yozib qo'ysak", ru: "если записать `i`" }], correct: 1 },
  { q: { uz: "Massivda indekslar nechadan boshlanadi?", ru: "С чего начинаются индексы в массиве?" }, opts: [{ uz: "1 dan", ru: "с 1" }, { uz: "-1 dan", ru: "с -1" }, { uz: "0 dan", ru: "с 0" }, { uz: "uzunligidan", ru: "с длины" }], correct: 2 },
  { q: { uz: "`['a','b','c']` massivida `'c'` ning indeksi qaysi?", ru: "Какой индекс у `'c'` в массиве `['a','b','c']`?" }, opts: ["1", "3", "2", "0"], correct: 2 },
  { q: { uz: "`massiv.length` nimani beradi?", ru: "Что даёт `massiv.length`?" }, opts: [{ uz: "Birinchi element", ru: "Первый элемент" }, { uz: "Oxirgi indeksni", ru: "Последний индекс" }, { uz: "Elementlar sonini", ru: "Число элементов" }, { uz: "Massiv nomini", ru: "Имя массива" }], correct: 2 },
  { q: { uz: "`for (let i=1; i<=10; i+=2)` qaysi sonlarni beradi?", ru: "Какие числа даст `for (let i=1; i<=10; i+=2)`?" }, opts: ["1,2,3,...,10", { uz: "faqat 10", ru: "только 10" }, "2,4,6,8,10", "1,3,5,7,9"], correct: 3 },
  { q: { uz: "`while` sikli qachon ishlaydi?", ru: "Когда работает цикл `while`?" }, opts: [{ uz: "Massiv mavjud bo'lganda", ru: "Пока существует массив" }, { uz: "Faqat bir marta ishlaydi", ru: "Только один раз" }, { uz: "Har doim aniq 10 marta", ru: "Всегда ровно 10 раз" }, { uz: "Shart to'g'ri (`true`) bo'lguncha", ru: "Пока условие истинно (`true`)" }], correct: 3 },
  { q: { uz: "Massivni to'liq aylanish uchun shart qanday yoziladi?", ru: "Как пишется условие для полного обхода массива?" }, opts: ["`i <= massiv.length`", "`i == massiv.length`", "`i > 0`", "`i < massiv.length`"], correct: 3 }
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
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className={`cs-tok ${i % 2 ? "back" : "front"}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, "--d": `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{s.ch}</span>)}
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
          <span className="cs-hud-i">🏆 {tr2({ uz: "PODIUM", ru: "ПОДИУМ" })}</span>
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
    const TOK = ["for", "while", "i++", "i<=5", "{ }", "i=1", "[ ]", ";"];
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
      if (!window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {
    /* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */
  }
      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>⚠️ {tr2({ uz: "Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr2({ uz: "Mashq rejimida davom etish", ru: "Продолжить в режиме тренировки" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>▶ {tr2({ uz: "Testni boshlash", ru: "Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr2({ uz: "Mentor testni boshlashini kuting…", ru: "Ждите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr2({ uz: "Boshlash", ru: "Начать" })}</button>}
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
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr2({ uz: "Javob qabul qilindi — natijani kuting…", ru: "Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr2({ uz: "Hamma javob berdi!", ru: "Все ответили!" })}</span>}
              <button className="qz-btn" onClick={() => ctrl("r", qi)}>⏹ {tr2({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Побыстрее! ⏱" })}</span>}
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
          <h2 className="qz-h">🏆 {tr2({ uz: "Test yakunlandi!", ru: "Тест завершён!" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ""}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верных${soloScore.maxStreak >= 2 ? ` · лучший стрик 🔥x${soloScore.maxStreak}` : ""}` })}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr2({ uz: "Qayta ishlash", ru: "Пройти ещё раз" })}</button>
            </div> : <>
              <div className="qz-pod">
                {[1, 0, 2].map((rank) => {
    const b = board[rank];
    return <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? "me" : ""}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : "—"}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr2({ uz: "ball", ru: "баллов" })} · {b.ok}/{QUIZ_BANK.length}</span>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr2({ uz: "Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "Пройти тест ещё раз — тренировка (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
var ACHIEVEMENTS = {
  loopstarter: { icon: "🔁", name: "Loop Starter", desc: { uz: "Birinchi sikl testini yechdingiz", ru: "Вы решили первый тест по циклам" } },
  infinitytamer: { icon: "♾️", name: "Infinity Tamer", desc: { uz: "Cheksiz siklni topib to'xtatdingiz", ru: "Вы нашли и остановили бесконечный цикл" } },
  assemblymaster: { icon: "🔧", name: "Assembly Master", desc: { uz: "Birinchi siklingizni o'zingiz yozdingiz", ru: "Вы сами написали свой первый цикл" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "Sikllar darsini to'liq yakunladingiz", ru: "Вы полностью завершили урок о циклах" } }
};
var ACH_TRIGGERS = { s4: "loopstarter", s14: "infinitytamer" };
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
var JS_LOOPS_FLASHCARDS = [
  { front: { uz: "Bir ishni ko'p marta takrorlash uchun nima ishlatiladi?", ru: "Что используют, чтобы повторить одно действие много раз?" }, back: { uz: "sikl (for)", ru: "цикл (for)" }, note: { uz: "ikki xili bor: for va while", ru: "есть два вида: for и while" } },
  { front: { uz: "Necha marta takrorlashni oldindan bilsangiz, qaysi sikl qulay?", ru: "Если Вы заранее знаете число повторов — какой цикл удобнее?" }, back: "for", note: { uz: "uch qismi bor: boshlanish, shart, qadam", ru: "три части: старт, условие, шаг" } },
  { front: { uz: "Necha marta takrorlash noma'lum bo'lsa, qaysi sikl ishlatiladi?", ru: "Какой цикл берут, если число повторов неизвестно?" }, back: "while", note: { uz: "shart rost turgan ekan aylanaveradi", ru: "крутится, пока условие истинно" } },
  { front: { uz: "for siklida sanoq qaysi sondan boshlanishi qayerda yoziladi?", ru: "Где в цикле for пишут, с какого числа начинается счёт?" }, back: "let i = 1", note: { uz: "birinchi qism — boshlanish", ru: "первая часть — старт" } },
  { front: { uz: "Sikl yana aylanishini nima hal qiladi?", ru: "Что решает, будет ли цикл крутиться дальше?" }, back: { uz: "shart (i <= 5)", ru: "условие (i <= 5)" }, note: { uz: "shart rost bo'lsa — yana aylanadi", ru: "условие истинно — крутится снова" } },
  { front: { uz: "i++ har aylanishdan keyin nima qiladi?", ru: "Что делает i++ после каждого оборота?" }, back: { uz: "i ni 1 ga oshiradi", ru: "увеличивает i на 1" }, note: { uz: "uchinchi qism — qadam", ru: "третья часть — шаг" } },
  { front: { uz: "Sikl qachon to'xtaydi?", ru: "Когда цикл останавливается?" }, back: { uz: "shart yolg'on bo'lganda", ru: "когда условие ложно" }, note: { uz: "masalan i = 6 bo'lsa, i <= 5 endi bajarilmaydi", ru: "например при i = 6 условие i <= 5 уже не выполняется" } },
  { front: { uz: "Hech to'xtamaydigan sikl qanday ataladi?", ru: "Как называется цикл, который никогда не останавливается?" }, back: { uz: "cheksiz sikl", ru: "бесконечный цикл" }, note: { uz: "qadam shartga yaqinlashtirmasa shunday bo'ladi", ru: "так бывает, если шаг не приближает к условию" } },
  { front: { uz: "Bir nechta qiymatni bitta joyda saqlash uchun nima ishlatiladi?", ru: "Что используют, чтобы хранить несколько значений в одном месте?" }, back: { uz: "massiv", ru: "массив" }, note: "['olma', 'anor', 'uzum']" },
  { front: { uz: "Massivning birinchi elementini qanday olasiz?", ru: "Как взять первый элемент массива?" }, back: "massiv[0]", note: { uz: "sanoq 0 dan boshlanadi", ru: "счёт начинается с 0" } },
  { front: { uz: "Massivda nechta element borligini nima aytadi?", ru: "Что подскажет, сколько элементов в массиве?" }, back: "massiv.length", note: { uz: "3 ta element bo'lsa → 3", ru: "если элементов 3 → 3" } },
  { front: { uz: "Massivning har bir elementini birma-bir ishlatish uchun nima yoziladi?", ru: "Что пишут, чтобы использовать каждый элемент массива по одному?" }, back: "for + massiv.length", note: { uz: "i = 0 dan massiv.length gacha", ru: "от i = 0 до massiv.length" } }
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
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr2({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{total}/{total} {tr2({ uz: "atama yodlandi", ru: "терминов выучено" })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr2({ uz: "Qaytadan takrorlash", ru: "Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr2({ uz: "O'rganilmoqda", ru: "Учим" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr2({ uz: "Bildim", ru: "Знаю" })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr2(card.front)}</span><span className="fc-cue">{tr2({ uz: "Javobni o'ylang", ru: "Подумайте над ответом" })} 🤔 <span className="fc-tap">{tr2({ uz: "bosing", ru: "нажмите" })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr2(card.back))}{card.note && <span className="fc-note">{tr2(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr2({ uz: "Takrorlash", ru: "Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr2({ uz: "Bildim", ru: "Знаю" })}</button></div> : <p className="fc-hint">👆 {tr2({ uz: "Kartani bosing — javobni ko'rasiz", ru: "Нажмите на карточку — увидите ответ" })}</p>}
    </div>;
}
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect2(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={JS_LOOPS_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
function MentorPracticeOverlay({ entry, live, onClose }) {
  const [view, setView] = useState2("watch");
  const [data, setData] = useState2({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect2(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, doneIdx)]);
        if (on) setData({ players, rows });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live.pin, doneIdx]);
  if (view === "demo") {
    return <div style={{ position: "fixed", inset: 0, zIndex: 2e3, background: T.bg }}>
        <HtmlCompiler_default lang={__lang2} task={entry.task} starterCode={entry.starter} onContinue={() => setView("watch")} onBack={() => setView("watch")} />
      </div>;
  }
  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map((r) => r.player_id));
  return <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr2({ uz: "Amaliyot · jonli", ru: "Практика · живой урок" })}</div>
        <h2 className="mp-title">{tr2(entry.task.title)}</h2>
        <p className="mp-brief">{tr2(entry.task.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">1 · {tr2({ uz: "O'quvchilar o'z qurilmasida yozmoqda", ru: "Ученики пишут на своих устройствах" })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">2 · {tr2({ uz: "Mentor doskada yozib ko'rsatadi", ru: "Ментор пишет и показывает на доске" })}</span>
        </div>
        {data.players === null ? <p className="mstats-wait">{tr2({ uz: "Ulanish…", ru: "Подключение…" })}</p> : <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr2({ uz: "Praktikani tugatdi", ru: "Завершили практику" })}</span>
              <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma tugatdi!", ru: "✓ Все закончили!" }) : <>{tr2({ uz: "Tugatdi:", ru: "Закончили:" })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(doneN / total * 100) : 0}%` }} /></div>
            {total > 0 && <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map((p) => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : void 0}>{doneIds.has(p.id) ? "✓ " : "✏️ "}{p.nickname}</span>)}
              </div>}
            {total === 0 && <p className="mstats-wait">{tr2({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: "Пока никто не присоединился — как только ученики начнут практику, здесь появятся ✓…" })}</p>}
          </div>}
        <div className="mp-actions">
          <button className="mp-demo" onClick={() => setView("demo")}>🖊 {tr2({ uz: "Doskada yozib ko'rsatish", ru: "Показать на доске" })}</button>
          <button className="mp-next" onClick={onClose}>{tr2({ uz: "Keyingi mavzuga", ru: "К следующей теме" })} →</button>
        </div>
        <p className="mp-tip">{tr2({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga yozing — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: "💡 Когда большинство закончит, напишите это же упражнение на доске вместе — так ученики проверят себя, и тема закрепится." })}</p>
      </div>
    </div>;
}
var TASK_SANOQ = {
  eyebrow: { uz: "Praktika · for", ru: "Практика · for" },
  title: { uz: "Kompyuterga 1 dan 5 gacha sanatib ko'ring", ru: "Заставьте компьютер посчитать от 1 до 5" },
  brief: { uz: "`for` sikli yozing: `i` birdan boshlansin, `5` gacha borsin, har qadamda bittaga oshsin. Sikl ichida `console.log(i)` yozing — pastdagi konsolda `1 2 3 4 5` chiqadi.", ru: "Напишите цикл `for`: `i` начинается с единицы, идёт до `5`, на каждом шаге растёт на 1. Внутри цикла напишите `console.log(i)` — в консоли внизу появится `1 2 3 4 5`." },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "for", label: { uz: "for sikli yozildi", ru: "цикл for написан" }, check: checks.js(/for\s*\([^)]*;[^)]*;[^)]*\)/, { uz: "`for (let i = 1; i <= 5; i++) {` deb boshlang", ru: "Начните с `for (let i = 1; i <= 5; i++) {`" }) },
    { id: "log", label: { uz: "konsolda 1 2 3 4 5", ru: "в консоли 1 2 3 4 5" }, check: checks.logs("1 2 3 4 5", { uz: "Sikl ichida `console.log(i)` yozing — har qadamda bitta son chiqadi", ru: "Внутри цикла напишите `console.log(i)` — на каждом шаге выводится число" }) }
  ]
};
var TASK_MEVA = {
  eyebrow: { uz: "Praktika · massiv", ru: "Практика · массив" },
  title: { uz: "Ro'yxatni sikl bilan chiqaring", ru: "Выведите список циклом" },
  brief: { uz: 'Massiv yozing: `let mevalar = ["olma", "banan", "uzum"]`. Keyin `for` sikli bilan har bir mevani konsolga chiqaring — `console.log(mevalar[i])`. Konsolda uchalasi ketma-ket chiqadi.', ru: 'Напишите массив: `let mevalar = ["olma", "banan", "uzum"]`. Затем циклом `for` выведите каждый фрукт — `console.log(mevalar[i])`. В консоли появятся все три подряд.' },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "arr", label: { uz: "massiv yozildi", ru: "массив написан" }, check: checks.js(/\[\s*["'][^"']+["']\s*,/, { uz: 'Massivni shunday yozing: `let mevalar = ["olma", "banan", "uzum"]`', ru: 'Напишите массив так: `let mevalar = ["olma", "banan", "uzum"]`' }) },
    { id: "log", label: { uz: "konsolda uchala meva", ru: "в консоли все три фрукта" }, check: checks.logs("olma banan uzum", { uz: "Sikl ichida `console.log(mevalar[i])` yozing", ru: "Внутри цикла напишите `console.log(mevalar[i])`" }) }
  ]
};
var PRACTICE_AFTER = {
  6: { task: TASK_SANOQ, starter: "" },
  // 1) for bilan 1..5 sanash
  15: { task: TASK_MEVA, starter: "" }
  // 2) yakuniy: massivni sikl bilan o'qish
};
function JsLoopsLesson({ lang: langProp, onFinished, onPractice }) {
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
  const [practice, setPractice] = useState2(null);
  const [mentorPractice, setMentorPractice] = useState2(null);
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
  const runPractice = (entry, fromScreen) => {
    const done = () => {
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
      earn("assemblymaster");
      pracClear(LESSON_META.lessonId);
      setPractice(null);
      advance();
    };
    if (typeof onPractice === "function") Promise.resolve(onPractice(entry.task)).then(done);
    else {
      pracWrite(LESSON_META.lessonId, { kind: `s${fromScreen}`, screen: fromScreen });
      setPractice({ ...entry, done, codeKey: codeKeyOf(LESSON_META.lessonId, `s${fromScreen}`) });
    }
  };
  const openHomeworkPractice = () => {
    const entry = { task: TASK_MEVA, starter: "" };
    if (typeof onPractice === "function") Promise.resolve(onPractice(entry.task)).catch(() => {
    });
    else {
      pracWrite(LESSON_META.lessonId, { kind: "hw" });
      setPractice({ ...entry, codeKey: codeKeyOf(LESSON_META.lessonId, "hw"), done: () => {
        pracClear(LESSON_META.lessonId);
        setPractice(null);
      } });
    }
  };
  useEffect2(() => {
    if (typeof onPractice === "function") return;
    const p = pracRead(LESSON_META.lessonId);
    if (!p) return;
    if (p.kind === "hw") {
      openHomeworkPractice();
      return;
    }
    const entry = PRACTICE_AFTER[p.screen];
    if (entry) runPractice(entry, p.screen);
    else pracClear(LESSON_META.lessonId);
  }, []);
  const next = () => {
    const entry = PRACTICE_AFTER[screen];
    if (!entry) {
      advance();
      return;
    }
    if (!(live && (live.mode === "mentor" || live.mode === "student" && live.status !== "ended" && live.mentorAlive))) {
      advance();
      return;
    }
    if (live.mode === "mentor") {
      setMentorPractice({ ...entry, fromScreen: screen });
      advance();
    } else runPractice(entry, screen);
  };
  const prev = () => setScreen((s) => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers((a) => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === "final" && data && data.correct && live.mode === "student") live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => {
    progClear(LESSON_META.lessonId);
    pracClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    setPractice(null);
    setMentorPractice(null);
    startTimeRef.current = Date.now();
  };
  useEffect2(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  useEffect2(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen]);
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
    const finalAnswers = SCREEN_META.map((s, i) => s.scored && s.scope === "final" ? answers[i] : null).filter(Boolean);
    const finalCorrect = finalAnswers.filter((a) => a.correct).length;
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
      answers: SCREEN_META.map((_, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === "function") onFinished(payload);
  };
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenPodium, ScreenFlashcards, Screen16];
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
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
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
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.3s ease-out; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }

        /* === CODEBOX === */
        .codebox { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); color: ${CODE.text}; line-height: 1.75; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow-x: hidden; }
        .codebox > div { white-space: pre-wrap; word-break: break-word; }
        .for-pt { border-radius: 5px; padding: 1px 5px; font-weight: 700; }
        .for-init { background: rgba(1,154,203,0.22); color: #5BC8EC; }
        .for-cond { background: rgba(230,161,0,0.24); color: #F5C874; }
        .for-step { background: rgba(31,122,77,0.28); color: #6FD79E; }
        .tok-bad { background: rgba(255,79,40,0.22); color: #FF9777; border-radius: 4px; padding: 1px 4px; }
        .tok-ok { background: rgba(31,122,77,0.28); color: #6FD79E; border-radius: 4px; padding: 1px 4px; }

        /* === AI CARD / DEBUGGING / TAGPILL === */
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: clamp(12.5px,1.7vw,14px); color: ${CODE.text}; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; word-break: break-word; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === TERMINAL === */
        .term { background: ${CODE.bg}; border-radius: 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow: hidden; }
        .term-bar { display: flex; align-items: center; gap: 6px; padding: 9px 13px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .term-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${CODE.comment}; margin-left: 6px; }
        .term-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; font-family: 'JetBrains Mono'; font-size: clamp(12.5px,1.6vw,14px); color: ${CODE.text}; min-height: 64px; }
        .term-line { display: flex; gap: 9px; animation: el-pop 0.25s ease-out; }
        .term-arrow { color: ${T.success}; flex-shrink: 0; }
        .term-empty { color: ${CODE.comment}; font-style: italic; margin: 0; font-family: 'JetBrains Mono'; font-size: 13px; }

        /* === IWATCH (i qiymati) === */
        .iwatch { display: flex; align-items: baseline; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .iwatch-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .iwatch-eq { font-family: 'JetBrains Mono'; font-size: 18px; color: ${T.ink2}; }
        .iwatch-num { font-family: 'Fraunces', serif; font-size: clamp(34px,7vw,52px); color: ${T.accent}; line-height: 1; }

        /* === LEGEND === */
        .legend { display: flex; flex-direction: column; gap: 7px; }
        .legend-row { display: flex; align-items: center; gap: 9px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink}; }
        .legend-row b { font-weight: 700; }
        .lg-dot { width: 11px; height: 11px; border-radius: 3px; flex-shrink: 0; }

        /* === ARRAY === */
        .arr-row { display: flex; flex-wrap: wrap; gap: 9px; }
        .arr-cell { display: flex; flex-direction: column; align-items: center; gap: 3px; border: none; cursor: pointer; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all 0.18s; font-family: 'Manrope'; }
        .arr-cell:hover { transform: translateY(-2px); }
        .arr-cell.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -6px rgba(255,79,40,0.35); transform: translateY(-3px) scale(1.04); background: ${T.accentSoft}; }
        .arr-cell.scan { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 22px -6px rgba(255,79,40,0.4); background: ${T.accentSoft}; transform: translateY(-3px) scale(1.04); }
        .arr-emoji { font-size: 26px; }
        .arr-name { font-weight: 600; font-size: 12.5px; color: ${T.ink}; }
        .arr-idx { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${T.accent}; }

        /* === GLASS (while) === */
        .glass-wrap { display: flex; flex-direction: column; align-items: center; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: 20px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .glass { position: relative; width: 86px; height: 124px; border: 3px solid ${T.ink3}; border-top: none; border-radius: 6px 6px 16px 16px; overflow: hidden; background: rgba(1,154,203,0.04); }
        .glass-fill { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(180deg, #4FC3E8, #019ACB); transition: height 0.45s cubic-bezier(.4,0,.2,1); }
        .glass-pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 18px; color: ${T.ink}; mix-blend-mode: difference; filter: invert(1); }

        /* === MSG LIST (hook) === */
        .msg-list { display: flex; flex-direction: column; gap: 6px; max-height: 230px; overflow-y: auto; background: ${T.paper}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .msg-line { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-size: 13.5px; color: ${T.ink}; }
        .msg-ok { flex-shrink: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .mini-task { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.14); } .mini-task b { color: ${T.ink}; }

        /* === 🏭 SIKL ZAVODI (konveyer mashina skeleti) === */
        .zavod { position: relative; display: flex; flex-direction: column; gap: 12px; background: linear-gradient(160deg, #FFFFFF, #F1EDE4); border: 1.5px solid ${T.line}; border-radius: 18px; padding: 16px; box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.22); transition: border-color 0.3s, box-shadow 0.3s, background 0.3s; }
        .zavod-sm { padding: 12px; gap: 9px; }
        /* F-0807-05: panel silkinishi (zv-shake) OLIB TASHLANDI. Bu ekranda o'quvchi kodni
           diqqat bilan o'qib xatoni (i--) topishi kerak — to'xtovsiz harakat o'qishga
           raqobat qilardi. Xavf-signali qizil ramka, fon va ⚠️ yozuv bilan beriladi. */
        .zavod.zavod-cheksiz { border-color: ${T.accent}; background: linear-gradient(160deg, #FFF3EF, #FFE1D7); box-shadow: 0 0 0 3px ${T.accentSoft}, 0 14px 34px -12px rgba(255,79,40,0.4); }
        .zavod.zavod-done { border-color: ${T.success}; background: linear-gradient(160deg, #FFFFFF, #EAF6EE); }
        .zavod-levers { display: flex; gap: 8px; }
        .zv-lever { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; border-radius: 11px; padding: 10px 6px 8px; text-align: center; overflow: hidden; }
        .zv-lever::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .zv-lever .zv-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; }
        .zv-lever .zv-code { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .zv-init { background: ${T.blueSoft}; box-shadow: inset 0 0 0 1.5px ${T.blue}55; } .zv-init .zv-lbl { color: ${T.blue}; } .zv-init::before { background: ${T.blue}; }
        .zv-cond { background: ${T.sunSoft}; box-shadow: inset 0 0 0 1.5px ${T.sun}55; } .zv-cond .zv-lbl { color: ${T.sun}; } .zv-cond::before { background: ${T.sun}; }
        .zv-step { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; } .zv-step .zv-lbl { color: ${T.success}; } .zv-step::before { background: ${T.success}; }
        .zavod-body { display: flex; align-items: center; gap: 12px; }
        .zavod-tablo { flex-shrink: 0; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 90px; height: 72px; border-radius: 14px; background: linear-gradient(180deg, #1F2B40, #141C2B); border: 2px solid #2C3A52; box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 5px 14px -7px rgba(0,0,0,0.45); }
        .zavod-sm .zavod-tablo { width: 78px; height: 62px; }
        .zv-tablo-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #7DD181; letter-spacing: 0.16em; opacity: 0.85; }
        .zv-tablo-num { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 34px; line-height: 1; color: #7DD181; text-shadow: 0 0 14px rgba(125,209,129,0.7); animation: zv-flip 0.3s cubic-bezier(.34,1.4,.4,1); }
        .zavod-sm .zv-tablo-num { font-size: 28px; }
        .zavod-cheksiz .zavod-tablo { border-color: #7A2A1E; box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,79,40,0.35), 0 5px 14px -7px rgba(0,0,0,0.45); }
        .zavod-cheksiz .zv-tablo-lbl { color: #FFB4A0; }
        .zavod-cheksiz .zv-tablo-num { color: #FF8A6E; text-shadow: 0 0 14px rgba(255,79,40,0.75); }
        @keyframes zv-flip { from { transform: translateY(-40%); opacity: 0; } }
        .zavod-belt { flex: 1; display: flex; align-items: center; justify-content: space-around; height: 22px; border-radius: 99px; background: repeating-linear-gradient(90deg, ${T.ink3}33 0 8px, transparent 8px 16px); background-size: 16px 100%; animation: zv-belt-move 0.85s linear infinite; }
        @keyframes zv-belt-move { to { background-position: -16px 0; } }
        .zavod-cheksiz .zavod-belt { animation-duration: 0.24s; }
        .zavod-done .zavod-belt { animation-play-state: paused; }
        .zv-belt-arrow { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink3}; font-size: 15px; transition: color 0.3s; animation: zv-arrow-flow 1.05s linear infinite; }
        .zv-belt-arrow:nth-child(2) { animation-delay: 0.18s; }
        .zv-belt-arrow:nth-child(3) { animation-delay: 0.36s; }
        @keyframes zv-arrow-flow { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        .zavod-cheksiz .zv-belt-arrow { color: ${T.accent}; animation-duration: 0.42s; }
        /* F-0807-06: sikl ishlamayotgan paytda lenta ham turadi (o'qish ekranlari tinch) */
        .zavod.zv-idle .zavod-belt { animation: none; }
        .zavod.zv-idle .zv-belt-arrow { animation: none; opacity: 0.28; }
        .zavod-done .zv-belt-arrow { animation-play-state: paused; opacity: 0.55; }
        .zavod-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .zv-start { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #FFFFFF; background: linear-gradient(180deg, #2FA968, #1F7A4D); border: none; border-radius: 12px; padding: 12px 20px; cursor: pointer; box-shadow: 0 8px 18px -6px rgba(31,122,77,0.55), inset 0 1px 0 rgba(255,255,255,0.25); transition: transform 0.12s, box-shadow 0.2s, filter 0.2s; }
        .zv-start:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 24px -7px rgba(31,122,77,0.6), inset 0 1px 0 rgba(255,255,255,0.25); }
        .zv-start:active:not(:disabled) { transform: translateY(1px); }
        .zv-start:disabled { filter: grayscale(0.5) opacity(0.55); cursor: default; }
        .zavod-bin { display: flex; flex-wrap: wrap; gap: 6px; min-height: 44px; align-content: flex-start; background: ${T.bg}; border-radius: 12px; padding: 9px; box-shadow: inset 0 2px 8px -4px rgba(${T.shadowBase},0.2); }
        .zv-bin-empty { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink3}; font-style: italic; }
        .zv-box { position: relative; display: inline-flex; align-items: center; gap: 3px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border-radius: 8px; padding: 4px 8px; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.25); transform-origin: top center; animation: zv-box-drop 0.5s cubic-bezier(.34,1.56,.5,1) both; }
        .zv-box b { color: ${T.accent}; }
        @keyframes zv-box-drop { 0% { opacity: 0; transform: translateY(-24px) scale(0.55); } 55% { opacity: 1; transform: translateY(3px) scale(1.1); } 75% { transform: translateY(-1px) scale(0.96); } 100% { transform: translateY(0) scale(1); } }
        /* F-0807-05: avval SAKKIZTA qutining hammasi titrardi (8 ta cheksiz animatsiya).
           Endi faqat OXIRGI IKKITASI — ya'ni «hozir kelayotgani». Ma'no o'sha: ishlab
           chiqarish to'xtamayapti; lekin ko'z bir joyga qaraydi, o'qish buzilmaydi. */
        .zavod-cheksiz .zv-box:nth-last-child(-n+2) { animation: zv-box-jitter 0.34s ease-in-out infinite; }
        @keyframes zv-box-jitter { 0%,100% { transform: translateY(0) rotate(-2.5deg); } 50% { transform: translateY(-2px) rotate(2.5deg); } }
        .zavod-done .zavod-tablo { animation: zv-ding 0.75s ease-out; }
        @keyframes zv-ding { 0% { box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 0 rgba(125,209,129,0), 0 5px 14px -7px rgba(0,0,0,0.45); } 28% { box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 7px rgba(125,209,129,0.55), 0 5px 14px -7px rgba(0,0,0,0.45); } 100% { box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 0 rgba(125,209,129,0), 0 5px 14px -7px rgba(0,0,0,0.45); } }
        .zavod-done .zv-tablo-num { animation: zv-flip 0.3s cubic-bezier(.34,1.4,.4,1), zv-ding-glow 0.75s ease-out; }
        @keyframes zv-ding-glow { 0%,100% { text-shadow: 0 0 14px rgba(125,209,129,0.7); } 30% { text-shadow: 0 0 22px rgba(125,209,129,1), 0 0 6px #fff; } }
        @media (prefers-reduced-motion: reduce) {
          .zavod-belt, .zv-belt-arrow { animation: none !important; }
          .zv-box, .zavod-cheksiz .zv-box { animation: fade-step 0.3s both !important; }
          .zavod-done .zavod-tablo, .zavod-done .zv-tablo-num { animation: none !important; }
        }
        .zavod-alert { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; text-align: center; }
        .zavod-ding { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; text-align: center; animation: fade-step 0.3s; }
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
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
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

        /* === 🏅 ACHIEVEMENTS — to'liq-ekran nishon bayrami === */
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
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
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

        /* kod atamasi chipi — savol/variant/izohlarda oddiy matndan ajralib turadi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* Jonli holat lentasi — sokin (0.4), hover'da to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== QO'SHIMCHA ANIMATSIYALAR (v16 yaxshilash) ===== */
        /* S0 — charchoq o'lchagich */
        .fatigue { height: 11px; border-radius: 99px; background: rgba(167,166,162,0.28); overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.12); }
        .fatigue-bar { height: 100%; border-radius: 99px; transition: width 0.35s cubic-bezier(.4,0,.2,1), background 0.35s ease; box-shadow: 0 0 10px -2px currentColor; }
        @keyframes wobble { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-2.5deg)} 75%{transform:rotate(2.5deg)} }
        .btn-tired { animation: wobble 0.45s ease-in-out infinite; }
        @keyframes pop-face { 0%{transform:scale(0.4); opacity:0;} 60%{transform:scale(1.25);} 100%{transform:scale(1); opacity:1;} }
        .face-pop { display: inline-block; animation: pop-face 0.4s cubic-bezier(.34,1.4,.4,1); }

        /* S1 — reja ikonkalari */
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .ic-spin { display: inline-block; animation: spin360 2.6s linear infinite; }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .ic-float { display: inline-block; animation: floaty 2.4s ease-in-out infinite; }
        .mini-arr { display: flex; gap: 5px; margin-top: 9px; }
        .mini-cell { width: 27px; height: 27px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; animation: cellwave 2.4s ease-in-out infinite; }
        @keyframes cellwave { 0%,100%{ background: ${T.bg}; color: ${T.ink2}; transform: translateY(0);} 50%{ background: ${T.accent}; color:#fff; transform: translateY(-5px); box-shadow: 0 6px 14px -5px rgba(255,79,40,0.45);} }

        /* S3 — for dastaklari */
        .stair-strip { display: flex; align-items: flex-end; gap: 6px; height: 104px; background: ${T.paper}; border-radius: 12px; padding: 10px 12px 8px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .stair-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px; height: 100%; }
        .stair-bar { width: 100%; border-radius: 5px 5px 0 0; background: rgba(167,166,162,0.3); transition: background 0.35s ease, box-shadow 0.35s ease; }
        .stair-bar.lit { background: linear-gradient(180deg, #6FD79E, ${T.success}); box-shadow: 0 0 14px rgba(31,122,77,0.4); }
        .stair-walker { font-size: 19px; animation: hop 0.5s ease; }
        @keyframes hop { 0%{transform:translateY(-9px)} 60%{transform:translateY(2px)} 100%{transform:translateY(0)} }
        .stair-n { font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; color: ${T.ink3}; }
        .stair-bar.lit + .stair-n, .stair-col.on .stair-n { color: ${T.success}; }

        /* S5 — son chizig'i */
        .numline { display: flex; flex-wrap: wrap; gap: 5px; }
        .num-cell { width: 31px; height: 31px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12.5px; background: ${T.bg}; color: ${T.ink3}; transition: all 0.3s cubic-bezier(.4,0,.2,1); }
        .num-cell.hit { background: ${T.accent}; color: #fff; transform: translateY(-3px) scale(1.06); box-shadow: 0 6px 15px -5px rgba(255,79,40,0.5); }

        /* S6 — stakan qo'shimchalari */
        .glass-wave { position: absolute; top: -5px; left: -4%; width: 108%; height: 11px; background: #5BC8EC; border-radius: 50%; animation: bob 1.05s ease-in-out infinite; }
        @keyframes bob { 0%,100%{transform: scaleX(1.05) translateY(0);} 50%{transform: scaleX(0.95) translateY(2px);} }
        .tap-emoji { font-size: 30px; position: relative; display: inline-block; }
        .drip { position: absolute; left: 50%; top: 88%; font-size: 14px; animation: dripfall 0.5s linear infinite; }
        @keyframes dripfall { 0%{ opacity: 0; transform: translate(-50%, 0);} 20%{opacity:1;} 100%{ opacity: 0; transform: translate(-50%, 46px);} }
        .splash { position: absolute; top: 10px; left: 50%; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; color: ${T.blue}; animation: floatup 0.72s ease-out; }
        @keyframes floatup { from { opacity: 1; transform: translate(-50%, 8px);} to { opacity: 0; transform: translate(-50%, -24px);} }
        .cond-pill { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; padding: 6px 13px; border-radius: 99px; transition: all 0.3s ease; }
        /* F-0803-17: 👀 Tekshiruvchi yorlig'i + shart YOLG'ON bo'lgan lahza urg'usi */
        .cond-label { margin: 2px 0 -2px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.ink3}; }
        .cond-pill.stop { animation: cond-flash 0.9s ease-out; }
        @keyframes cond-flash { 0% { box-shadow: 0 0 0 0 rgba(255,79,40,0.55); } 60% { box-shadow: 0 0 0 15px rgba(255,79,40,0); } 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        /* Aylanish hisoblagichi — ekrandagi asosiy raqam (avval 13px matn edi) */
        .loop-count { display: inline-flex; align-items: baseline; gap: 9px; align-self: flex-start; background: ${T.paper}; border-radius: 14px; padding: 9px 16px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.18); }
        .loop-count-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px,4.2vw,40px); line-height: 1; color: ${T.accent}; font-variant-numeric: tabular-nums; }
        .loop-count-l { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.ink2}; }
        .loop-count.bump .loop-count-n { animation: lc-bump 0.38s cubic-bezier(.34,1.6,.4,1); }
        @keyframes lc-bump { 0% { transform: scale(1); } 45% { transform: scale(1.26); } 100% { transform: scale(1); } }

        /* S7 — karta ikonkalari + misol satrlari */
        @keyframes pulseq { 0%,100%{transform:scale(1); opacity:1;} 50%{transform:scale(1.16); opacity:0.65;} }
        .pulse-q { display:inline-block; animation: pulseq 1.4s ease-in-out infinite; }
        .ex-row { animation: el-pop 0.32s ease-out both; }

        /* S11 — do'stlar */
        .friend-card { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all 0.4s cubic-bezier(.4,0,.2,1); opacity: 0.5; }
        .friend-card.got { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.25); }
        .friend-ava { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; background: ${T.accentSoft}; flex-shrink: 0; transition: background 0.35s; }
        .friend-card.got .friend-ava { background: ${T.successSoft}; animation: hop 0.5s ease; }
        .friend-name { font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .friend-msg { font-size: 12px; color: ${T.ink2}; }
        .friend-status { margin-left: auto; font-size: 17px; }

        /* S13 — takror hisoblagich */
        .rep-badge { font-family: 'Fraunces', serif; font-size: clamp(30px,7vw,48px); color: ${T.accent}; line-height: 1; }
        @keyframes burstpop { 0%{transform:scale(0); opacity:0;} 55%{transform:scale(1.3);} 100%{transform:scale(1); opacity:1;} }
        .burst { display: inline-block; animation: burstpop 0.5s cubic-bezier(.34,1.4,.4,1); }

        /* S14 — xato silkinishi */
        @keyframes shakeX { 0%,100%{transform:translateX(0)} 18%{transform:translateX(-3px)} 38%{transform:translateX(3px)} 58%{transform:translateX(-2px)} 78%{transform:translateX(2px)} }
        .tok-bad { animation: shakeX 0.42s ease; }
        @keyframes warnpulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .warn-pulse { animation: warnpulse 1s ease-in-out infinite; }

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
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
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
        .pod-col.me .pod-name { color: ${T.accent}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.accent}; }
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


        /* === ✍️ PRAKTIKA — mentor paneli (jonli darsda) + uy-vazifa tugmasi === */
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
        .hw-run { margin-top: 12px; align-self: flex-start; padding: 12px 20px; border: none; border-radius: 13px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.42); transition: transform 0.15s, background 0.15s; }
        .hw-run:hover { transform: translateY(-2px); background: ${T.accent}; }

        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "JS darsi", ru: "Урок JS" }} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>}
          {practice && <div style={{ position: "fixed", inset: 0, zIndex: 2e3, background: T.bg }}>
              <HtmlCompiler_default lang={__lang2} task={practice.task} starterCode={practice.starter} storageKey={practice.codeKey} onContinue={practice.done} onBack={() => {
    pracClear(LESSON_META.lessonId);
    setPractice(null);
  }} />
            </div>}
          {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => setMentorPractice(null)} />}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}
export {
  JsLoopsLesson as default
};
