// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/pm/PmUserStoryLesson.jsx
//          src/compilator/HtmlCompiler.jsx
//  Qayta yig'ish:  node scripts/build-lms.mjs src/pm/PmUserStoryLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/pm/PmUserStoryLesson.jsx
import React, { useState as useState2, useEffect as useEffect2, useRef as useRef2, useMemo as useMemo2, createContext, useContext, useCallback as useCallback2, useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, isValidElement } from "react";

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
var stripJsComments = (src) => {
  const s = src || "";
  let out = "", i = 0, last = "";
  const n = s.length;
  const regexMayStart = () => !last || /[(,=:\[!&|?{};+\-*%<>~^]/.test(last) || /\b(return|typeof|case|in|of|delete|void|throw|new)$/.test(out.slice(-8));
  while (i < n) {
    const c = s[i], d = s[i + 1];
    if (c === "/" && d === "/") {
      while (i < n && s[i] !== "\n") {
        out += " ";
        i++;
      }
      continue;
    }
    if (c === "/" && d === "*") {
      const e = s.indexOf("*/", i + 2);
      const end = e === -1 ? n : e + 2;
      for (; i < end; i++) out += s[i] === "\n" ? "\n" : " ";
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      out += c;
      i++;
      while (i < n && s[i] !== q) {
        if (s[i] === "\\" && i + 1 < n) {
          out += s[i] + s[i + 1];
          i += 2;
          continue;
        }
        if (s[i] === "\n" && q !== "`") break;
        out += s[i];
        i++;
      }
      if (i < n && s[i] === q) {
        out += q;
        i++;
      }
      last = q;
      continue;
    }
    if (c === "/" && regexMayStart()) {
      out += c;
      i++;
      let cls = false;
      while (i < n && s[i] !== "\n" && (cls || s[i] !== "/")) {
        if (s[i] === "\\" && i + 1 < n) {
          out += s[i] + s[i + 1];
          i += 2;
          continue;
        }
        if (s[i] === "[") cls = true;
        else if (s[i] === "]") cls = false;
        out += s[i];
        i++;
      }
      if (i < n && s[i] === "/") {
        out += "/";
        i++;
      }
      last = "/";
      continue;
    }
    out += c;
    if (!/\s/.test(c)) last = c;
    i++;
  }
  return out;
};
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
  // JS: manbada shu MATN bormi? (deklarativ { js: 'console.log(' } uchun — K-C-05)
  jsText: (text, hint) => (x) => stripJsComments(x.js).includes(text) ? true : tr(hint ?? { uz: `Skriptda kerakli qism topilmadi`, ru: `В скрипте не найден нужный фрагмент` }),
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
  if (s.js) return s.js instanceof RegExp ? checks.js(s.js, hint) : checks.jsText(String(s.js), hint);
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
  if (s.js) return s.js instanceof RegExp ? { uz: "JS namunasi", ru: "фрагмент JS" } : `JS: ${s.js}`;
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
  if (!req || typeof req !== "object") req = {};
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
  css = css.replace(/@import\b[^;]*;?/gi, "");
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
  let rules = [];
  try {
    const declared = new Set((css.match(/([-a-zA-Z]+)\s*:/g) || []).map((m) => m.replace(/\s*:$/, "").toLowerCase()));
    const flat = [];
    const walk = (list) => {
      for (const r of list || []) {
        if (r.style && r.selectorText != null) flat.push(r);
        else if (r.cssRules && r.cssRules.length && !(typeof CSSKeyframesRule !== "undefined" && r instanceof CSSKeyframesRule)) walk([...r.cssRules]);
      }
    };
    walk([...el.sheet?.cssRules || []]);
    rules = flat.map((r) => {
      const props = {};
      for (let i = 0; i < r.style.length; i++) {
        const p = r.style[i];
        props[p] = r.style.getPropertyValue(p);
      }
      declared.forEach((name) => {
        if (props[name] == null) {
          const v = r.style.getPropertyValue(name);
          if (v) props[name] = v;
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
var CONSOLE_FORWARD = (nonce, pos) => `<script>
(function(){
  var N=${JSON.stringify(nonce)},JS=${Number(pos && pos.jsStart) || 0},HT=${Number(pos && pos.htmlStart) || 0};
  // K-P-07/K-C-16: DevTools uslubidagi ko'rinish — Error name: message, Map(n) {k => v}, Set(n) {..}, <tag id>, Date ISO,
  // undefined saqlanadi, 5n, ƒ nom(); chuqurlik maks 3 ({…}/[…]), 50 element (… +N), [Circular]; bitta satr maks 4000 belgi.
  var DEPTH=3,ITEMS=50,MAXCH=4000;
  function insp(v,d,seen){
    var t=typeof v;
    if(v===null)return 'null';if(t==='undefined')return 'undefined';
    if(t==='string')return d>0?JSON.stringify(v):v;
    if(t==='number')return (v===0&&1/v<0)?'-0':String(v);
    if(t==='bigint')return String(v)+'n';if(t==='symbol'||t==='boolean')return String(v);
    if(t==='function')return 'ƒ '+(v.name||'')+'()';
    try{
      if(v instanceof Error)return (v.name||'Error')+': '+v.message;
      if(v instanceof Date)return isNaN(v.getTime())?'Invalid Date':v.toISOString();
      if(v instanceof RegExp)return String(v);
      if(v.nodeType===1)return '<'+String(v.tagName).toLowerCase()+(v.id?' id="'+v.id+'"':'')+(typeof v.className==='string'&&v.className?' class="'+v.className+'"':'')+'>';
      if(v.nodeType)return String(v.nodeName);
      if(seen.indexOf(v)!==-1)return '[Circular]';
      var isArr=Array.isArray(v),isMap=v instanceof Map,isSet=v instanceof Set;
      if(d>=DEPTH)return isArr?'[…]':'{…}';
      seen.push(v);
      var out=[],i=0,more=0;
      if(isMap){v.forEach(function(val,k){if(i<ITEMS)out.push(insp(k,d+1,seen)+' => '+insp(val,d+1,seen));else more++;i++;});seen.pop();return 'Map('+v.size+') {'+out.join(', ')+(more?', … +'+more:'')+'}';}
      if(isSet){v.forEach(function(val){if(i<ITEMS)out.push(insp(val,d+1,seen));else more++;i++;});seen.pop();return 'Set('+v.size+') {'+out.join(', ')+(more?', … +'+more:'')+'}';}
      if(isArr){for(i=0;i<v.length;i++){if(i<ITEMS)out.push(insp(v[i],d+1,seen));else{more=v.length-ITEMS;break;}}seen.pop();return '['+out.join(', ')+(more?', … +'+more:'')+']';}
      var ks=Object.keys(v);for(i=0;i<ks.length;i++){if(i<ITEMS)out.push(ks[i]+': '+insp(v[ks[i]],d+1,seen));else{more=ks.length-ITEMS;break;}}
      seen.pop();return '{'+out.join(', ')+(more?', … +'+more:'')+'}';
    }catch(e){try{return String(v);}catch(x){return '[?]';}}
  }
  function fmt(a){return insp(a,0,[]);}
  var indent='';
  function join(args){
    var parts=[],i=0;
    if(args.length>1&&typeof args[0]==='string'&&/%[sdifoOc]/.test(args[0])){ // %s/%d/%o format-belgilar (birinchi arg satr)
      var k=1,str=args[0].replace(/%([sdifoOc])/g,function(m,c){if(k>=args.length)return m;var a=args[k++];if(c==='c')return '';if(c==='d'||c==='i')return String(parseInt(a,10));if(c==='f')return String(parseFloat(a));return fmt(a);});
      parts.push(str);i=k;
    }
    for(;i<args.length;i++)parts.push(fmt(args[i]));
    var text=parts.join(' ');
    if(text.length>MAXCH)text=text.slice(0,MAXCH)+' … (+'+(text.length-MAXCH)+' belgi)';
    return indent+text;
  }
  function send(level,args){
    try{parent.postMessage({__hcConsole:true,nonce:N,level:level,text:join(args)},'*');}catch(e){}
  }
  ['log','info','warn','error'].forEach(function(m){
    var _o=console[m]?console[m].bind(console):function(){};
    console[m]=function(){send(m,arguments);try{_o.apply(null,arguments);}catch(e){}};
  });
  // K-P-16: debug/dir → log; group/groupEnd → chekinish; table → matnli jadval (maks 20 qator × 6 ustun); clear → panel tozalanadi
  var _dbg=console.debug?console.debug.bind(console):function(){},_dir=console.dir?console.dir.bind(console):function(){};
  console.debug=function(){send('log',arguments);try{_dbg.apply(null,arguments);}catch(e){}};
  console.dir=function(){send('log',arguments);try{_dir.apply(null,arguments);}catch(e){}};
  console.group=console.groupCollapsed=function(){send('log',arguments.length?['▼ '+join(arguments).slice(indent.length)]:['▼']);indent+='  ';};
  console.groupEnd=function(){indent=indent.slice(0,-2);};
  console.clear=function(){try{parent.postMessage({__hcConsole:true,nonce:N,level:'clear',text:''},'*');}catch(e){}};
  console.table=function(data){
    if(!data||typeof data!=='object'){send('log',arguments);return;}
    var ROWS=20,COLS=6,rows=[],keys=[],rk=Object.keys(data),i,j;
    for(i=0;i<rk.length&&i<ROWS;i++){var r=data[rk[i]];rows.push([rk[i],r]);if(r&&typeof r==='object'){var kk=Object.keys(r);for(j=0;j<kk.length;j++)if(keys.indexOf(kk[j])===-1&&keys.length<COLS)keys.push(kk[j]);}}
    var hasVal=rows.some(function(r){return !(r[1]&&typeof r[1]==='object');});
    var head=['(index)'].concat(keys,hasVal?['Value']:[]);
    var lines=[head];
    rows.forEach(function(r){var line=[r[0]];keys.forEach(function(k){line.push(r[1]&&typeof r[1]==='object'&&k in r[1]?insp(r[1][k],1,[]):'');});if(hasVal)line.push(r[1]&&typeof r[1]==='object'?'':insp(r[1],1,[]));lines.push(line);});
    var w=head.map(function(_,c){var m=0;lines.forEach(function(l){var s=String(l[c]==null?'':l[c]).slice(0,24);if(s.length>m)m=s.length;});return m;});
    var txt=lines.map(function(l){return l.map(function(c,ci){var s=String(c==null?'':c).slice(0,24);while(s.length<w[ci])s+=' ';return s;}).join(' │ ');});
    txt.splice(1,0,w.map(function(x){var s='';while(s.length<x)s+='─';return s;}).join('─┼─'));
    if(rk.length>ROWS)txt.push('… +'+(rk.length-ROWS)+' qator');
    send('log',[txt.join('\\n')]);
  };
  // K-C-14 (= K-P-05): sandbox'da (allow-modals yo'q) alert/prompt/confirm brauzer tomonidan JIM yutiladi.
  // Semantika SAQLANADI (alert→undefined, prompt→null, confirm→false — «Bekor» bosilgandek), lekin har
  // chaqiriq konsolga warn-marker yuboradi (matn RENDER paytida o'quvchi tilida — K-M-01). O'quvchi
  // o'z kodida window.alert'ni qayta belgilasa — uniki ustun (oddiy o'zlashtirish, himoya YO'Q, ataylab).
  var seenModal=false,firstOf={};
  function modal(kind,ret){return function(msg){
    seenModal=true;var again=!!firstOf[kind];firstOf[kind]=true;
    var t='';try{t=msg===undefined?'':String(msg);}catch(e){t='';}
    try{parent.postMessage({__hcConsole:true,nonce:N,level:'warn',text:'__hcModal:'+kind+':'+(again?'again':'first')+':'+t},'*');}catch(e){}
    return ret;};}
  try{window.alert=modal('alert',undefined);window.prompt=modal('prompt',null);window.confirm=modal('confirm',false);}catch(e){}
  window.addEventListener('error',function(e){
    var ln=e.lineno||0,file='',line=0;
    if(JS&&ln>=JS){file='script.js';line=ln-JS+1;}
    else if(HT&&ln>=HT){file='index.html';line=ln-HT+1;}
    try{parent.postMessage({__hcConsole:true,nonce:N,level:'error',text:String(e.message||''),file:file,line:line,col:e.colno||0,hint:seenModal?'modal-null':''},'*');}catch(x){}
  });
})();
<\/script>`;
var buildHarness = (probes, nonce) => `<script>
(function(){
  try{var _cs=document.currentScript;if(_cs)_cs.parentNode.removeChild(_cs);}catch(e){}
  var logs=[],_push=Array.prototype.push,_str=String,_json=JSON.stringify,
      _idx=String.prototype.indexOf,_trim=String.prototype.trim,_low=String.prototype.toLowerCase,
      _st=window.setTimeout,_qs=document.querySelector;
  var _l=console.log;console.log=function(){
    for(var i=0;i<arguments.length;i++){var a=arguments[i];
      try{_push.call(logs,typeof a==='object'?_json(a):_str(a));}catch(e){_push.call(logs,_str(a));}}
    try{_l.apply(console,arguments);}catch(e){}
  };
  function has(hay,needle){return _idx.call(_str(hay),needle)!==-1;}
  function qs(sel){try{return _qs.call(document,sel);}catch(e){return null;}}
  function runProbes(){
    var P=${JSON.stringify(probes)};
    var joined='';for(var j=0;j<logs.length;j++)joined+=(j?' ':'')+logs[j];
    var out={};
    for(var k=0;k<P.length;k++){
      var p=P[k],ok=false;
      try{
        if(p.type==='log_includes'){
          var v=_trim.call(_str(p.value));
          ok=has(joined,v);
          if(!ok){for(var q=0;q<logs.length;q++){if(has(_trim.call(_str(logs[q])),v)){ok=true;break;}}}
        }else if(p.type==='eval_equals'){
          var r; try{r=eval(p.expr);}catch(e){r=undefined;}
          ok=_str(r)===_str(p.expected);
        }else if(p.type==='click_text'){
          var exp=_str(p.expected);
          var t0=qs(p.readSel);
          var before=t0?t0.textContent:'';
          var b=qs(p.clickSel);
          if(b){try{b.click();}catch(e){}}
          var t1=qs(p.readSel);
          var after=t1?t1.textContent:'';
          // Matn bosishdan KEYIN paydo bo'lishi kerak (oldin bo'lmagan) — JS'siz o'tmaydi
          ok=has(after,exp) && !has(before,exp);
        }else if(p.type==='toggle'){
          var A=_trim.call(_low.call(_str(p.textA)));
          var B=_trim.call(_low.call(_str(p.textB)));
          var rd=function(){var e=qs(p.readSel);return _low.call(_str(e?e.textContent:''));};
          var b2=qs(p.clickSel);
          var s0=rd();
          var startOk=has(s0,A) && !has(s0,B); // boshida A
          if(b2){try{b2.click();}catch(e){}}
          var s1=rd();
          var firstOk=has(s1,B) && !has(s1,A); // 1-bosish -> B
          if(b2){try{b2.click();}catch(e){}}
          var s2=rd();
          var secondOk=has(s2,A) && !has(s2,B); // 2-bosish -> A
          ok=startOk && firstOk && secondOk;
        }
      }catch(e){ok=false;}
      out[p.id]=ok;
    }
    try{parent.postMessage({__hcReport:true,nonce:${JSON.stringify(nonce)},results:out},'*');}catch(e){}
  }
  // 'load' hodisasidan keyin ishga tushiramiz — o'quvchi handler'ni
  // window.onload / addEventListener('load') ichida ulagan bo'lsa ham ulgursin.
  function start(){ _st.call(window, runProbes, 50); }
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
var IMG_FALLBACK = () => `<script>
document.addEventListener('error',function(e){
  var el=e.target;
  if(!el||el.tagName!=='IMG'||el.dataset.hcFb)return;
  el.dataset.hcFb='1';el.style.display='none';
  var alt=(el.getAttribute('alt')||'').trim();
  var b=document.createElement('div');
  b.className='hc-imgfb';
  b.innerHTML='<span class="hc-imgfb-i">\\uD83D\\uDDBC</span>'
    +'<span class="hc-imgfb-t"></span>'
    +'<span class="hc-imgfb-h">'+${JSON.stringify(tr({ uz: "rasm topilmadi — <code>src</code> manzilini tekshiring", ru: "картинка не найдена — проверьте адрес в <code>src</code>" }))}+'</span>';
  b.querySelector('.hc-imgfb-t').textContent = alt || ${JSON.stringify(tr({ uz: "alt matni yozilmagan", ru: "текст alt не написан" }))};
  if(el.parentNode)el.parentNode.insertBefore(b,el.nextSibling);
},true);
<\/script>`;
var wrapDoc = (html, css, js, opts = {}) => {
  const head = (pos) => `<!doctype html>
<html lang="${__lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_blank">
<style>${baseStyle}
${opts.previewCss || ""}
${css || ""}</style>
${opts.harness || ""}
${opts.consoleNonce != null ? CONSOLE_FORWARD(opts.consoleNonce, pos) : ""}
${opts.harness ? "" : IMG_FALLBACK()}
</head>
<body>
`;
  const nl = (s) => (String(s || "").match(/\n/g) || []).length;
  const htmlStart = nl(head({ jsStart: 0, htmlStart: 0 })) + 1;
  const jsStart = htmlStart + nl(html) + 1;
  return `${head({ jsStart, htmlStart })}${html || ""}
<script>${js || ""}<\/script>
${opts.doneNonce != null ? `<script>try{parent.postMessage({__hcDone:true,nonce:${JSON.stringify(opts.doneNonce)}},'*')}catch(e){}<\/script>` : ""}
</body>
</html>`;
};
var JS_ERR_DICT = [
  [/^(?:Uncaught )?ReferenceError: (.+?) is not defined$/, (m) => ({
    uz: `\`${m[1]}\` aniqlanmagan — bunday o'zgaruvchi yoki funksiya yo'q. Imlosini yoki e'lon qilinganini tekshiring`,
    ru: `\`${m[1]}\` не определено — такой переменной или функции нет. Проверьте написание или объявление`
  })],
  [/^(?:Uncaught )?TypeError: Cannot read propert(?:y|ies) of (null|undefined) \(reading '(.+?)'\)$/, (m) => ({
    uz: `\`${m[2]}\` ni o'qib bo'lmadi — qiymat ${m[1]}. Element topilmagan yoki o'zgaruvchi hali bo'sh bo'lishi mumkin`,
    ru: `не удалось прочитать \`${m[2]}\` — значение ${m[1]}. Возможно, элемент не найден или переменная ещё пустая`
  })],
  [/^(?:Uncaught )?TypeError: (.+?) is not a function$/, (m) => ({
    uz: `\`${m[1]}\` funksiya emas — uni qavs bilan chaqirib bo'lmaydi. Nomini tekshiring`,
    ru: `\`${m[1]}\` — не функция, её нельзя вызвать со скобками. Проверьте имя`
  })],
  [/^(?:Uncaught )?SyntaxError: Unexpected token '?(.+?)'?$/, (m) => ({
    uz: `kutilmagan belgi \`${m[1]}\` — oldingi qator(lar)da qavs, tirnoq yoki nuqta-vergul tekshiring`,
    ru: `неожиданный символ \`${m[1]}\` — проверьте скобки, кавычки или точку с запятой в предыдущих строках`
  })],
  [/^(?:Uncaught )?SyntaxError: Unexpected end of input$/, () => ({
    uz: `kod tugab qoldi — qavs \`)\` yoki \`}\` yopilmagan`,
    ru: `код оборвался — не закрыта скобка \`)\` или \`}\``
  })],
  [/^(?:Uncaught )?SyntaxError: Invalid or unexpected token$/, () => ({
    uz: `noto'g'ri belgi — tirnoq yopilmagan yoki begona belgi kirib qolgan bo'lishi mumkin`,
    ru: `неверный символ — возможно, не закрыта кавычка или попал лишний символ`
  })],
  [/^(?:Uncaught )?SyntaxError: Identifier '(.+?)' has already been declared$/, (m) => ({
    uz: `\`${m[1]}\` allaqachon e'lon qilingan — ikkinchi marta \`let\`/\`const\` yozmang`,
    ru: `\`${m[1]}\` уже объявлено — не пишите \`let\`/\`const\` второй раз`
  })],
  [/^(?:Uncaught )?SyntaxError: Missing initializer in const declaration$/, () => ({
    uz: `\`const\` ga qiymat berilmagan — \`const nom = qiymat;\` shaklida yozing`,
    ru: `\`const\` без значения — пишите \`const имя = значение;\``
  })],
  [/^(?:Uncaught )?TypeError: Assignment to constant variable\.?$/, () => ({
    uz: `\`const\` ga qayta qiymat berib bo'lmaydi — o'zgarishi kerak bo'lsa \`let\` ishlating`,
    ru: `\`const\` нельзя переприсвоить — если значение меняется, используйте \`let\``
  })],
  [/^(?:Uncaught )?Error: (.+)$/, (m) => ({ uz: `xato: ${m[1]}`, ru: `ошибка: ${m[1]}` })]
];
var jsErrText = (raw, hint) => {
  const s = String(raw ?? "").trim();
  if (hint === "modal-null") {
    const m = /^(?:Uncaught )?TypeError: Cannot read propert(?:y|ies) of null \(reading '(.+?)'\)$/.exec(s);
    if (m) return tr({
      uz: `\`${m[1]}\` ni o'qib bo'lmadi — qiymat null. Ehtimol bu \`prompt()\`/\`confirm()\` javobi: bu muhitda ular doim null/false qaytaradi — qiymatni o'zgaruvchiga to'g'ridan-to'g'ri yozing`,
      ru: `не удалось прочитать \`${m[1]}\` — значение null. Вероятно, это ответ \`prompt()\`/\`confirm()\`: в этой среде они всегда возвращают null/false — запишите значение в переменную напрямую`
    });
  }
  for (const [re, fn] of JS_ERR_DICT) {
    const m = re.exec(s);
    if (m) return tr(fn(m));
  }
  return s.replace(/^Uncaught /, "") || s;
};
var MODAL_RE = /^__hcModal:(alert|prompt|confirm):(first|again):([\s\S]*)$/;
var modalText = (raw) => {
  const m = MODAL_RE.exec(String(raw ?? ""));
  if (!m) return null;
  const [, kind, when, arg] = m;
  const call = `${kind}(${arg ? JSON.stringify(arg) : ""})`;
  if (when === "again") return tr({ uz: `${call} — o'tkazib yuborildi (bu muhitda ishlamaydi)`, ru: `${call} — пропущено (в этой среде не работает)` });
  const T2 = {
    alert: {
      uz: `${call} — bu muhitda dialog-oyna ochilmaydi. Matnni ko'rsatish uchun \`console.log(...)\` yoki sahifaga yozing`,
      ru: `${call} — в этой среде диалоговое окно не открывается. Чтобы показать текст, используйте \`console.log(...)\` или выведите на страницу`
    },
    prompt: {
      uz: `${call} — bu yerda ishlamaydi, javob null (bo'sh) qaytdi. Qiymatni o'zgaruvchiga to'g'ridan-to'g'ri yozing: \`let ism = "Ali"\``,
      ru: `${call} — здесь не работает, ответ null (пусто). Запишите значение в переменную напрямую: \`let ism = "Ali"\``
    },
    confirm: {
      uz: `${call} — bu yerda ishlamaydi, javob false qaytdi — \`else\` tarmog'i ishlaydi`,
      ru: `${call} — здесь не работает, ответ false — сработает ветка \`else\``
    }
  };
  return tr(T2[kind]);
};
function HtmlCompiler({
  task: taskProp = DEFAULT_TASK,
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
  const task = taskProp && typeof taskProp === "object" ? taskProp : DEFAULT_TASK;
  const taskReqs = Array.isArray(task.requirements) ? task.requirements : [];
  const taskFiles = Array.isArray(task.files) ? task.files.filter((f) => f && typeof f === "object" && f.name) : [];
  const reqs = useMemo(
    () => taskReqs.map((r, i) => normalizeReq(r, i)),
    [task.requirements]
  );
  const files = useMemo(() => {
    if (taskFiles.length) return taskFiles;
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
    if (!s.codes || typeof s.codes !== "object" || Array.isArray(s.codes)) return fresh;
    if (names.length !== Object.keys(s.codes).length || !names.every((n) => n in s.codes)) return fresh;
    return Object.fromEntries(names.map((n) => [n, typeof s.codes[n] === "string" ? s.codes[n] : fresh[n]]));
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
  const [consoleBuf, setConsoleBuf] = useState({ lines: [], dropped: 0 });
  const consoleLines = consoleBuf.lines;
  const setConsoleLines = useCallback((v) => setConsoleBuf({ lines: Array.isArray(v) ? v : [], dropped: 0 }), []);
  const CONSOLE_MAX = 500;
  const consoleBodyRef = useRef(null);
  const consoleAtBottomRef = useRef(true);
  const [consoleNew, setConsoleNew] = useState(0);
  const consoleScrollBottom = useCallback(() => {
    const el = consoleBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    consoleAtBottomRef.current = true;
    setConsoleNew(0);
  }, []);
  const consoleLastTopRef = useRef(0);
  const onConsoleScroll = useCallback(() => {
    const el = consoleBodyRef.current;
    if (!el) return;
    const atB = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (atB) {
      consoleAtBottomRef.current = true;
      setConsoleNew(0);
    } else if (el.scrollTop < consoleLastTopRef.current - 2) consoleAtBottomRef.current = false;
    consoleLastTopRef.current = el.scrollTop;
  }, []);
  const consolePrevLenRef = useRef(0);
  useEffect(() => {
    const el = consoleBodyRef.current, prevLen = consolePrevLenRef.current;
    consolePrevLenRef.current = consoleLines.length;
    if (!el || consoleLines.length === 0) return;
    if (consoleAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
      consoleLastTopRef.current = el.scrollTop;
    } else setConsoleNew((c) => c + Math.max(1, consoleLines.length - prevLen));
  }, [consoleLines]);
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
        setCheckDoc(mkDoc({ harness: buildHarness(runtimeProbes, nonce) }));
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
        if (d.level === "clear") {
          setConsoleBuf({ lines: [{ level: "clear", text: "" }], dropped: 0 });
          return;
        }
        const item = { level: d.level, text: String(d.text ?? ""), file: d.file || "", line: Number(d.line) || 0, col: Number(d.col) || 0, hint: String(d.hint || "") };
        setConsoleBuf((prev) => prev.lines.length >= CONSOLE_MAX ? { lines: [...prev.lines.slice(prev.lines.length - CONSOLE_MAX + 1), item], dropped: prev.dropped + 1 } : { lines: [...prev.lines, item], dropped: prev.dropped });
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
  }, [html, css, js, reqs, lang]);
  const [lintSrc, setLintSrc] = useState(html);
  useEffect(() => {
    const id = setTimeout(() => setLintSrc(html), LINT_DELAY_MS);
    return () => clearTimeout(id);
  }, [html]);
  const htmlErrors = useMemo(() => lintHtml(lintSrc), [lintSrc, lang]);
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
  const jumpToLine = (ln, text) => {
    const el = taRef.current;
    if (!el || !ln) return;
    const lines = (text ?? codes[active] ?? "").split("\n");
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
          {fmtNote ? <p className="hc-note">{fmtNote}</p> : shownErrors.length > 0 ? (
    /* K-M-02: matn alohida span'da kesiladi (ellipsis), «+N» belgisi esa DOIM ko'rinadi;
       title'da to'liq xabar — kesilgan bo'lsa ham o'qish yo'li bor */
    <button
      type="button"
      className="hc-err"
      onClick={() => jumpToLine(shownErrors[0].line)}
      title={`${tr({ uz: "Qator", ru: "Строка" })} ${shownErrors[0].line}: ${shownErrors[0].msg}
${tr({ uz: "Bosing — kursor shu qatorga tushadi", ru: "Нажмите — курсор перейдёт на эту строку" })}`}
    >
              <span className="hc-err-text">⚠ {tr({ uz: "Qator", ru: "Строка" })} {shownErrors[0].line}: {shownErrors[0].msg}</span>
              {shownErrors.length > 1 && <b className="hc-err-more">+{shownErrors.length - 1}</b>}
            </button>
  ) : !allPassed && firstHint && <p className="hc-hint">💡 {firstHint}</p>}
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
          {
    /* K-P-01: `key` — qotgan frame tashlanib yangisi yaratiladi; framesOff — jarayon o'lsin */
  }
          {!framesOff && <iframe
    key={frameGen}
    ref={previewFrameRef}
    className="hc-frame"
    title="natija"
    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
    srcDoc={doc}
  />}
          {hung && <div className="hc-hung" role="alert">{HUNG_MSG}</div>}
          {showConsole && <div className="hc-console">
              <div className="hc-console-bar">
                <span className="hc-console-title">🖥️ Console</span>
                {consoleLines.length > 0 && <span className="hc-console-count">{consoleLines.length}{consoleBuf.dropped > 0 ? " · " + tr({ uz: `eng eski ${consoleBuf.dropped} yashirildi`, ru: `скрыто старых: ${consoleBuf.dropped}` }) : ""}</span>}
                {consoleNew > 0 && <button className="hc-console-new" onClick={consoleScrollBottom}>↓ {tr({ uz: `yangi ${consoleNew}`, ru: `новых ${consoleNew}` })}</button>}
                {consoleLines.length > 0 && <button className="hc-console-clear" onClick={() => setConsoleLines([])}>{tr({ uz: "tozalash", ru: "очистить" })}</button>}
              </div>
              <div className="hc-console-body" ref={consoleBodyRef} onScroll={onConsoleScroll}>
                {consoleLines.length === 0 ? <div className="hc-console-empty">{tr({ uz: "console.log(...) natijasi shu yerda chiqadi", ru: "результат console.log(...) появится здесь" })}</div> : consoleLines.map((l, i) => l.level === "clear" ? <div key={i} className="hc-console-line lvl-clear"><span className="hc-console-text">— {tr({ uz: "console.clear() — tozalandi", ru: "console.clear() — очищено" })} —</span></div> : l.level === "error" && l.file ? (
    // K-C-09: xato — fayl:satr (bosilsa o'sha faylning o'sha qatoriga kursor) + o'quvchi tilida matn; xom matn title'da
    <div
      key={i}
      className={`hc-console-line lvl-${l.level} has-pos`}
      title={l.text}
      onClick={() => {
        if (files.some((f) => f.name === l.file)) {
          setActive(l.file);
          setTimeout(() => jumpToLine(l.line, codes[l.file]), 0);
        }
      }}
    >
                        <span className="hc-console-caret">›</span>
                        <span className="hc-console-pos">{l.file}:{l.line}</span>
                        <span className="hc-console-text">{jsErrText(l.text, l.hint)}</span>
                      </div>
  ) : <div key={i} className={`hc-console-line lvl-${l.level}${l.level === "warn" && MODAL_RE.test(l.text) ? " is-modal" : ""}`} title={l.level === "error" && /^Uncaught /.test(l.text) ? l.text : void 0}>
                        <span className="hc-console-caret">{l.level === "warn" && MODAL_RE.test(l.text) ? "⚠" : "›"}</span>
                        <span className="hc-console-text">{l.level === "error" && /^Uncaught /.test(l.text) ? jsErrText(l.text, l.hint) : l.level === "warn" && modalText(l.text) || l.text}</span>
                      </div>)}
              </div>
            </div>}
        </section>
      </main>

      {
    /* Yashirin tekshiruv iframe'i — probe'lar shu yerda ishlaydi (tugmani
       bosadi, DOMni o'zgartiradi), foydalanuvchi ko'radigan preview esa toza qoladi */
  }
      {hasRuntime && !framesOff && <iframe
    key={frameGen}
    ref={checkFrameRef}
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
var HC_FONTS_URL = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
function StyleTag() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("hc-fonts")) return;
    const l = document.createElement("link");
    l.id = "hc-fonts";
    l.rel = "stylesheet";
    l.href = HC_FONTS_URL;
    document.head.appendChild(l);
  }, []);
  return <style>{`
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
      /* K-M-02: tugma flex — matn (span) kesiladi, «+N» belgisi qisilmaydi va doim ko'rinadi */
      .hc-err{font-size:12.5px;color:#C01024;background:#FDECEC;border:1px solid #F6CFCF;padding:7px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace;max-width:min(100%,96ch);line-height:1.4;display:inline-flex;align-items:center;gap:8px;min-width:0;cursor:pointer;text-align:left}
      .hc-err-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
      .hc-err:hover{background:#FBDFDF;border-color:#EEB8B8}
      .hc-err-more{flex-shrink:0;background:#C01024;color:#fff;border-radius:99px;padding:1px 7px;font-size:11px}

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

      /* K-E-01: tablar QISILMAYDI (flex-shrink:0) va joy yetmasa gorizontal suriladi — 1024–1400px
         va telefonda style.css/script.js 0 gacha qisilib yo'qolardi. Tor panelda ▶/✨ ikonkaga ixchamlashadi. */
      .hc-tabs{display:flex;gap:4px;flex:1 1 auto;min-width:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      .hc-tabs::-webkit-scrollbar{display:none}
      .hc-tab{flex-shrink:0}
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
      .hc-console-count{font-weight:600;color:#5B6B86;text-transform:none;letter-spacing:0}
      .hc-console-new{background:${HC_T.accent};color:#fff;border:none;border-radius:99px;padding:3px 10px;font-size:10.5px;font-weight:700;cursor:pointer;text-transform:none;letter-spacing:0}
      .hc-console-line.lvl-clear{color:#5B6B86;font-style:italic;justify-content:center}
      .hc-console-line{display:flex;gap:8px;padding:2px 15px;color:#E7EAF2;border-bottom:1px solid rgba(255,255,255,.03);white-space:pre-wrap;word-break:break-word}
      .hc-console-caret{color:#27c93f;flex-shrink:0;font-weight:700}
      .hc-console-line.lvl-warn{color:#FFD380;background:rgba(255,189,46,.08)}
      .hc-console-line.lvl-error{color:#ff8a7a;background:rgba(255,95,86,.1)}
      .hc-console-line.lvl-error .hc-console-caret{color:#ff5f56}
      .hc-console-line.has-pos{cursor:pointer}
      .hc-console-line.has-pos:hover{background:rgba(255,95,86,.18)}
      .hc-console-pos{flex-shrink:0;color:#FFD380;font-weight:700;text-decoration:underline dotted}

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
      /* K-E-01: tor panelda ▶/✨ ikonkaga ixchamlashadi (panel ENIga qarab — container query) */
      .hc-editor-pane{container-type:inline-size}
      @container (max-width:760px){
        .hc-mini{font-size:0;padding:6px 10px;line-height:1}
        .hc-mini::after{content:"▶";font-size:13px}
        .hc-ic.wide{font-size:0;padding:0 8px}
        .hc-ic.wide::after{content:"✨";font-size:13px}
        .hc-tools{margin-left:4px}
      }
      @container (max-width:480px){
        /* telefon: tablar O'Z qatorida (to'liq en), tugmalar pastki qatorda — hech biri yo'qolmaydi */
        .hc-tabs-bar{flex-wrap:wrap;row-gap:6px}
        .hc-tabs{order:-1;flex-basis:100%}
        .hc-dots{display:none}
      }

    `}</style>;
}
var HtmlCompiler_default = HtmlCompiler;

// src/pm/PmUserStoryLesson.jsx
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
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
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
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
  const syncQuiz = useCallback2((row) => {
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
  const startMentor = useCallback2(async (mentorCode) => {
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
      setJoinError("Mentor kodi noto'g'ri yoki ulanishda xato.");
    } finally {
      setBusy(false);
    }
  }, [lessonId]);
  const joinStudent = useCallback2(async (raw, rawNick) => {
    const p = (raw || "").replace(/\D/g, "");
    const nick = (rawNick || "").trim();
    if (p.length < 4) {
      setJoinError(tr2({ uz: "Kodni to'liq kiriting.", ru: "Введите код полностью." }));
      return;
    }
    if (nick.length < 2) {
      setJoinError("Ismingizni kiriting (kamida 2 harf).");
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
  const selfStudy = useCallback2(() => {
    setMode("self");
    liveStore(lessonId, { mode: "self" });
  }, [lessonId]);
  const reportScreen = useCallback2((idx) => {
    if (mode === "mentor" && pin) liveRpc("advance_session", { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {
    });
  }, [mode, pin]);
  const endSession = useCallback2(() => {
    if (mode === "mentor" && pin) {
      liveRpc("end_session", { p_pin: pin, p_token: tokenRef.current }).catch(() => {
      });
      setEnded(true);
    }
  }, [mode, pin]);
  const submitAnswer = useCallback2((screenIdx, questionId, picked, correct, elapsedMs) => {
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
  const quizControl = useCallback2(async (state, q) => {
    if (mode !== "mentor" || !pin) throw new Error("mentor emas");
    await liveRpc("quiz_control", { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);
  const mentorReveal = useCallback2((screenIdx) => {
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
      <p style={{ color: "#fff", opacity: 0.85, fontSize: "clamp(15px,2.2vw,22px)", maxWidth: 640, margin: "clamp(20px,4vw,36px) 0 0", lineHeight: 1.5 }}>{tr2({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: "#fff" }}>«Darsga qo'shilish»</b> oynasida shu kodni va ismingizni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → в окне <b style={{ color: "#fff" }}>«Подключиться к уроку»</b> введите этот код и своё имя.</> })}</p>
      <button onClick={onClose} style={{ marginTop: "clamp(22px,4vw,40px)", background: LT.accent, color: "#fff", border: "none", borderRadius: 14, padding: "clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)", fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 700, cursor: "pointer" }}>{tr2({ uz: "Darsni boshlash →", ru: "Начать урок →" })}</button>
    </div>;
}
function LiveGate({ live, title = tr2({ uz: "Jonli dars", ru: "Живой урок" }) }) {
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
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{title}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Darsga qo'shilish", ru: "Подключиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от ментора и своё имя." })}</p></div>
    <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: "100%", padding: "16px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em", textAlign: "center", outline: "none" }} />
    <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={24} placeholder={tr2({ uz: "Ismingiz (masalan: Ali)", ru: "Ваше имя (например: Али)" })} onKeyDown={(e) => {
    if (e.key === "Enter") live.joinStudent(code, nick);
  }} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: "center", outline: "none" }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr2({ uz: "Ulanmoqda…", ru: "Подключаемся…" }) : tr2({ uz: "Qo'shilish →", ru: "Присоединиться →" })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
    <button onClick={() => {
    setRole("mentor");
    setCode("");
  }} title={tr2({ uz: "Mentor", ru: "Ментор" })} aria-label={tr2({ uz: "Mentor", ru: "Ментор" })} style={{ position: "absolute", bottom: 10, right: 12, background: "none", border: "none", fontSize: 16, opacity: 0.3, cursor: "pointer", lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
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
var __lang2 = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[__lang2] ?? node.uz ?? node.ru ?? "";
};
var MentorCtx = createContext(null);
var AchCtx = createContext(null);
var LiveGateCtx = createContext(null);
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
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
var LESSON_META = { lessonId: "pm-m3d2-v3", lessonTitle: { uz: "User Story: kim va nima uchun?", ru: "User Story" } };
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  // 0
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  // 1
  { id: "s2", type: "exploration", template: "custom", scored: false, scope: null },
  // 2
  { id: "s3", type: "exploration", template: "custom", scored: false, scope: null },
  // 3
  { id: "s7", type: "test", template: "custom", scored: true, scope: "module-mikro" },
  // 4 · TEST-1 (qizil tugma)
  { id: "s4", type: "case", template: "custom", scored: false, scope: null },
  // 5 · K11 keys
  { id: "s8", type: "test", template: "custom", scored: true, scope: "module-mikro" },
  // 6 · TEST-2 (natija=takror)
  { id: "practice", type: "practice", template: "custom", scored: false, scope: null },
  // 7 · ustaxona (3 hikoya bittalab)
  { id: "peer", type: "exploration", template: "custom", scored: false, scope: null },
  // 8 · tekshiruvchi stoli
  { id: "s9", type: "test", template: "custom", scored: true, scope: "module-mikro" },
  // 9 · TEST-3 (dark mode)
  { id: "clinic", type: "practice", template: "custom", scored: false, scope: null },
  // 10 · hikoya-klinika
  { id: "s10", type: "koding", template: "custom", scored: false, scope: null },
  // 11 · koding (compiler)
  { id: "priority", type: "practice", template: "custom", scored: false, scope: null },
  // 12 · prioritet-doska
  { id: "s11", type: "recap", template: "custom", scored: false, scope: null },
  // 13
  { id: "podium", type: "stats", template: "custom", scored: false, scope: null },
  // 14
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
  // 15 (uy-vazifa kartasi shu yerda — F-0803-23)
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var SCREEN_INTENTS = {
  s0: "Bola ikki so'rovni solishtirib ovoz beradi va farq KIM+NEGA ekanini darhol biladi — dars ipi shu yerdan boshlanadi",
  s1: "Bola dars oxirida o'zi 3 hikoya-karta yozishini oldindan ko'radi",
  s2: "Bola harakat bilan sababni ajratadi va hikoyada eng muhimi sabab ekanini biladi",
  s3: "Bola hikoyaning 3 bo'lagini (KIM/NIMA/NATIJA) formulaga o'zi joylab yig'adi",
  s7: "Bola hikoyada NATIJA bo'lagi umuman yetishmayotganini topadi",
  s4: "Bola milkshake misolidan odam mahsulotni emas, natijani sotib olishini biladi",
  s8: "Bola NATIJA harakatni takrorlamasligi kerakligini topadi",
  practice: "Bola o'z loyihasi uchun 3 hikoyani bittalab yozib, daftarga saqlaydi",
  peer: "Bola tayyor 3 namuna-kartaga bittalab hukm chiqarib, kamchilikni o'zi nomlaydi",
  s9: "Bola KIM va NATIJA'siz gap imkoniyat-so'rovi ekanini, hikoya emasligini aniqlaydi",
  clinic: "Bola dasturchi o'rnida uch xil so'rovni o'qib, so'rov sifati natijani belgilashini o'z ko'zi bilan ko'radi",
  s10: "Bola hikoyaYasa funksiyasini to'ldirib, 3 hikoyasini kod orqali chiqaradi",
  priority: "Bola 3 hikoyasini muhimlik darajalariga (yuqori/o'rta/past) ajratadi",
  s11: "Bola bugun o'rganganini sherigiga aytib, bir gapda yozib qoldiradi",
  podium: "Bola o'z natijasini (jonlida — sinf reytingini) ko'radi",
  s16: "Bola darsni yakunlab, uy-vazifa foydalanuvchisini tanlaydi, nishonlari va arena-imkoniyatini ko'radi"
};
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
      <button className={`ach-counter ${bump ? "bump" : ""} ${count > 0 ? "has" : ""}`} onClick={() => setOpen((o) => !o)} aria-label={tr2({ uz: "Nishonlar", ru: "Значки" })} title={tr2({ uz: "Nishonlar", ru: "Значки" })}>
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 {tr2({ uz: "Nishonlar", ru: "Значки" })} — {count}/{total}</div>
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
  const setCollapsed = useCallback2((v) => {
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
var waveCls = (on, i, n) => on ? ` turn-ring turn-wave${n > 3 ? " wv4" : ""} w${i + 1}` : "";
var NavNext = ({ disabled, label = tr2({ uz: "Davom etish", ru: "Продолжить" }), onClick, optionalLive, turnBusy }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  const isOff = (freeRide ? false : disabled) || locked;
  const hint = useTurnHint(!isOff && !turnBusy);
  return <button className={`btn-white-accent${hint ? " turn-hint" : ""}`} disabled={isOff} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : freeRide && disabled ? tr2({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: "Живой урок: можно идти дальше, даже не выполнив" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? "⏳ Mentorni kuting" : label}</button>;
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
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var INLINE_KEYS = { s7: 2, s8: 2, s9: 1, practice: -1 };
var RECAPS = {
  4: {
    title: { uz: "Hikoyada NATIJA shart", ru: "В истории РЕЗУЛЬТАТ обязателен" },
    cards: [
      { ic: "🎯", h: { uz: "NATIJA — real foyda", ru: "РЕЗУЛЬТАТ — реальная польза" }, body: { uz: <>Har User Story oxirida <b>[NATIJA]</b> bo'ladi: foydalanuvchi oladigan real foyda, tugma nomi emas.</>, ru: <>В конце каждой User Story стоит <b>[РЕЗУЛЬТАТ]</b>: реальная польза для пользователя, а не название кнопки.</> } },
      { ic: "🙋", h: { uz: "KIM aniq bo'lsin", ru: "КТО должен быть конкретным" }, body: { uz: <>«foydalanuvchi» — aniq emas, juda umumiy so'z. <b>Aniq turi</b> aytilsin: yangi mehmon, qaytgan mijoz, mentor.</>, ru: <>«пользователь» — это неконкретно, слишком общее слово. Назовите <b>конкретный тип</b>: новый гость, вернувшийся клиент, ментор.</> } },
      { ic: "🧩", h: { uz: "Uch bo'lak to'liq", ru: "Все три части на месте" }, body: { uz: <>Hikoyada uch bo'lak — <b>KIM + NIMA + NATIJA</b> — bittasi ham tushib qolmasin, tushsa hikoya to'liq bo'lmay qoladi.</>, ru: <>В истории три части — <b>КТО + ЧТО + РЕЗУЛЬТАТ</b> — ни одна не должна выпадать, иначе история остаётся неполной.</> }, ask: { uz: "«qizil tugma xohlayman» — bu hikoyada NATIJA bormi?", ru: "«хочу красную кнопку» — есть ли в этой истории РЕЗУЛЬТАТ?" } }
    ]
  },
  6: {
    title: { uz: "NATIJA harakatni takrorlamasin", ru: "РЕЗУЛЬТАТ не повторяет действие" },
    cards: [
      { ic: "🔁", h: { uz: "Takror = foyda yo'q", ru: "Повтор = пользы не видно" }, body: { uz: <>«saytga kirishni xohlayman, saytga kirish uchun» — <b>NATIJA harakatni takrorlaydi</b>, foyda ko'rinmaydi.</>, ru: <>«хочу войти на сайт, чтобы войти на сайт» — <b>РЕЗУЛЬТАТ повторяет действие</b>, пользы не видно.</> } },
      { ic: "💡", h: { uz: "Nima o'zgaradi?", ru: "Что изменится?" }, body: { uz: <>To'g'ri NATIJA: harakatdan keyin foydalanuvchi <b>hayotida nima o'zgaradi</b> — masalan «buyurtmamni tez topish uchun».</>, ru: <>Верный РЕЗУЛЬТАТ: что <b>изменится в жизни пользователя</b> после действия — например «чтобы быстро найти свой заказ».</> } },
      { ic: "✅", h: { uz: "Tekshiruv savoli", ru: "Проверочный вопрос" }, body: { uz: <>NATIJA'ni tekshiring: u <b>NIMA'ni takrorlamayaptimi</b>? Bir xil bo'lsa — hikoya to'liq emas.</>, ru: <>Проверьте РЕЗУЛЬТАТ: не повторяет ли он <b>ЧТО</b>? Если это одно и то же — история неполная.</> }, ask: { uz: "«...kirish uchun» qismini qanday tuzatamiz?", ru: "Как исправить кусок «...чтобы войти»?" } }
    ]
  },
  9: {
    title: { uz: "Hikoya — imkoniyat-so'rovi emas", ru: "История — это не заявка на возможность" },
    cards: [
      { ic: "🚫", h: "Feature request", body: { uz: <>«Saytda dark mode bo'lsin» — bu <b>imkoniyat-so'rovi</b> (feature request), User Story emas.</>, ru: <>«Пусть на сайте будет тёмная тема» — это <b>заявка на возможность</b> (feature request), а не User Story.</> } },
      { ic: "❓", h: { uz: "KIM va NATIJA yo'q", ru: "Нет КТО и РЕЗУЛЬТАТА" }, body: { uz: <>Unda <b>kim</b> va <b>nima uchun</b> yo'q — shuning uchun u hali hikoya emas.</>, ru: <>В ней нет <b>кто</b> и <b>зачем</b> — поэтому это ещё не история.</> } },
      { ic: "🔧", h: { uz: "Hikoyaga aylantiring", ru: "Превратите в историю" }, body: { uz: <>Uni to'g'rilash: «Men <b>kechqurun o'qiydigan o'quvchi</b> sifatida, <b>qorong'i rejim</b>ni xohlayman, <b>ko'zim charchamasligi</b> uchun».</>, ru: <>Как поправить: «Я как <b>ученик, который читает вечером</b>, хочу <b>тёмную тему</b>, чтобы <b>глаза не уставали</b>».</> }, ask: { uz: "Bu gapga qaysi 2 bo'lak yetishmayapti?", ru: "Каких двух частей не хватает этой фразе?" } }
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
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr2({ uz: "🗣️ Sinfga savol:", ru: "🗣️ Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>✓ Tushunarli — davom etamiz</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Следующая →" })}</button>}
      </div>
    </div>;
}
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
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr2({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
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
            {level === "need" && <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тему класс не понял. Перед тем как идти дальше, стоит коротко повторить.</> })}</p>}
            {level === "maybe" && <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите перед тем, как идти дальше.</> })}</p>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему усвоил. Спокойно идите дальше!</> })}</p>}
            {level === "few" && <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать сложно. Оцените сами.</> })}</p>}
            {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 Qayta tushuntirishni ochish</button>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить заново." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь вживую…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, renderMode, ctaLabel, revealPrefix = tr2({ uz: "To'g'ri javob", ru: "Верный ответ" }), hsFx, storedAnswer, onAnswer, onNext, onPrev }) => {
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  const isHotspot = renderMode === "hotspot";
  return <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : ctaLabel || tr2({ uz: "Javobni tanlang", ru: "Выберите ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, жмите обдуманно!" })}</p>}
        <div className={`fade-up delay-1 ${isHotspot ? "hs-parts" : ""}`} style={{ display: "flex", flexDirection: isHotspot ? "row" : "column", flexWrap: isHotspot ? "wrap" : "nowrap", gap: isHotspot ? 10 : 9 }}>
          {options.map((opt, i) => {
    const brokenCls = " hs-broken" + (hsFx === "stamp" ? " hs-stamp" : "");
    let cls = isHotspot ? "hs-chip" : "option";
    if (isMentorLive) {
      if (mReveal) {
        cls += i === correctIdx ? isHotspot ? brokenCls : " option-correct" : isHotspot ? " hs-ok" : " option-wrong";
      }
    } else if (solved) {
      if (waiting) {
        if (i === picked) cls += isHotspot ? " hs-wait" : " option-wait";
      } else {
        cls += i === correctIdx ? isHotspot ? brokenCls : " option-correct" : isHotspot ? " hs-ok" : " option-wrong";
        if (wrongLocked && i === picked) cls += isHotspot ? " hs-miss" : " option-picked-wrong";
      }
    } else if (i === picked) cls += isHotspot ? " hs-miss" : " option-picked-wrong";
    const showGreenLetter = isMentorLive ? mReveal && i === correctIdx : solved && revealed && i === correctIdx;
    const showRedLetter = cls.includes("option-picked-wrong");
    const showDimLetter = cls.includes("option-wrong") && !showGreenLetter && !showRedLetter;
    return <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={isHotspot ? void 0 : { padding: "clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)", fontSize: "clamp(15px,1.85vw,17px)", display: "flex", alignItems: "center", gap: 12 }}>
                {!isHotspot && <span className={`opt-abc ${showGreenLetter ? "ok" : showRedLetter ? "bad" : showDimLetter ? "dim" : ""}`}>{showGreenLetter ? "✓" : showRedLetter ? "✗" : String.fromCharCode(65 + i)}</span>}
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>;
  })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : solved && !wrongLocked} neutral={waiting}>
          <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: waiting ? T.blue : isMentorLive || solved && !wrongLocked ? T.success : T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isMentorLive ? <>✓ {revealPrefix}: {fmtCode(options[correctIdx])}</> : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? <>{revealPrefix}: {fmtCode(options[correctIdx])}</> : solved ? "Topdingiz!" : "Qaytadan ko'ring"}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? fmtCode(explainCorrect) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете верный ответ." }) : wrongLocked ? fmtCode(explainWrong[picked] ?? explainWrong.default) : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Короткое повторение — взглянуть на тему ещё раз" })}</button>}
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
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue"> · ko'rsatmani ochish ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState2(false);
  if (!live || live.mode !== "mentor") return null;
  if (!open) return <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr2({ uz: "Mentorga eslatma — bosib oching", ru: "Заметка ментору — нажмите, чтобы открыть" })}>📋 {tr2({ uz: "Eslatma", ru: "Заметка" })}</button>;
  return <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr2({ uz: "Yopish uchun bosing", ru: "Нажмите, чтобы закрыть" })}>
      <span className="mnote-lbl">{tr2({ uz: "🧑‍🏫 Mentorga eslatma", ru: "🧑‍🏫 Заметка ментору" })}<span className="mnote-x">{tr2({ uz: "✕ yopish", ru: "✕ закрыть" })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>;
};
var STORIES_KEY = "pm-m3d2-stories";
var readStories = () => {
  try {
    const a = JSON.parse(localStorage.getItem(STORIES_KEY) || "null");
    return Array.isArray(a) ? a : null;
  } catch {
    return null;
  }
};
var writeStories = (arr) => {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(arr));
  } catch {
  }
  try {
    window.dispatchEvent(new Event("pm-m3d2-stories"));
  } catch {
  }
};
var validateStory = (kim, nima, natija) => {
  const has = (s) => (s || "").trim().length >= 2;
  return { kimOk: has(kim), nimaOk: has(nima), natijaOk: has(natija), full: has(kim) && has(nima) && has(natija) };
};
var BOARD_SCREEN_IDS = /* @__PURE__ */ new Set(["s11"]);
var boardSlots = () => {
  const arr = (readStories() || []).slice(0, 3);
  return [0, 1, 2].map((i) => {
    const s = arr[i];
    return !!(s && validateStory(s.kim, s.nima, s.natija).full);
  });
};
var _sboardOpen = true;
function StoryBoard() {
  const [slots, setSlots] = useState2(boardSlots);
  const [open, setOpen] = useState2(_sboardOpen);
  useEffect2(() => {
    const upd = () => setSlots(boardSlots());
    window.addEventListener("pm-m3d2-stories", upd);
    window.addEventListener("storage", upd);
    return () => {
      window.removeEventListener("pm-m3d2-stories", upd);
      window.removeEventListener("storage", upd);
    };
  }, []);
  const toggle = () => setOpen((o) => {
    _sboardOpen = !o;
    return !o;
  });
  const n = slots.filter(Boolean).length;
  return <button
    type="button"
    className={`sboard ${open ? "" : "closed"} ${n === 3 ? "full" : ""}`}
    onClick={toggle}
    title={open ? tr2({ uz: "Daftarni yig'ish", ru: "Свернуть блокнот" }) : tr2({ uz: "Daftarni ochish", ru: "Открыть блокнот" })}
    aria-label={tr2({ uz: `Hikoya-daftar: ${n}/3 tayyor`, ru: `Блокнот историй: готово ${n}/3` })}
  >
      <span className="sboard-ic">📒</span>
      {open && <span className="sboard-lbl">{tr2({ uz: "Hikoyalarim", ru: "Мои истории" })}</span>}
      {open && <span className="sboard-slots">{slots.map((ok, i) => <span key={i} className={`sboard-slot ${ok ? "ok" : ""}`}>{ok ? "✓" : i + 1}</span>)}</span>}
      <b className="sboard-n">{n}/3</b>
    </button>;
}
var HOOK_REQS = [
  { tag: { uz: "1-mijoz", ru: "1-й клиент" }, cls: "a", text: { uz: "«Saytga video qo'shib qo'ying.»", ru: "«Добавьте на сайт видео.»" } },
  { tag: { uz: "2-mijoz", ru: "2-й клиент" }, cls: "b", text: { uz: "«Men imtihonga tayyorlanayotgan o'quvchi sifatida, darsni qayta ko'rishni xohlayman — mavzuni o'zim tushunib olishim uchun.»", ru: "«Я как ученик, который готовится к экзамену, хочу пересмотреть урок — чтобы разобраться в теме самому.»" } }
];
var HOOK_OPTS = [
  { uz: "Birinchisini — qisqa va lo'nda", ru: "Первое — коротко и по делу" },
  { uz: "Ikkinchisini — kim so'rayotgani va nega kerakligi aniq", ru: "Второе — ясно, кто просит и зачем это нужно" },
  { uz: "Ikkalasi ham bir xil tushunarli", ru: "Оба понятны одинаково" }
];
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [picked, setPicked] = useState2(storedAnswer?.picked ?? null);
  const [counts, setCounts] = useState2(null);
  const [view, setView] = useState2(0);
  const [seen, setSeen] = useState2(() => /* @__PURE__ */ new Set([0]));
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  useEffect2(() => {
    if (!isLive) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const rows = await liveAnswers(live.pin, screen);
        if (on) setCounts(HOOK_OPTS.map((_, i) => rows.filter((r2) => r2.picked === i).length));
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [isLive, live && live.pin, screen]);
  const isMentor = live && live.mode === "mentor";
  const seenBoth = seen.size >= 2;
  const show = (i) => {
    setView(i);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(i);
      return n;
    });
  };
  const pick = (i) => {
    if (picked !== null || isMentor || !seenBoth) return;
    setPicked(i);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === "student") live.submitAnswer(screen, "s0", i, false, 0);
  };
  const shown = counts || (picked !== null ? HOOK_OPTS.map((_, i) => i === picked ? 1 : 0) : null);
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  const revealViz = shown && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const pendMsg = [0, 1].filter((i) => !seen.has(i));
  const litMsg = useTurnWalk(pendMsg);
  const optWave = useTurnHint(seenBoth && picked === null);
  const r = HOOK_REQS[view];
  return <Stage eyebrow={tr2({ uz: "Kirish · ikki so'rov", ru: "Введение · две просьбы" })} screen={screen} navContent={<NavNext optionalLive disabled={(picked === null || !seenBoth) && !isMentor} label={isMentor ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : !seenBoth ? tr2({ uz: "Ikkala xabarni o'qing", ru: "Прочитайте оба сообщения" }) : picked === null ? tr2({ uz: "Fikringizni belgilang", ru: "Отметьте своё мнение" }) : tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Ikki mijoz yordam so'radi — qaysi biri <span className="italic" style={{ color: T.accent }}>tushunarli</span>?</>, ru: <>Два клиента попросили о помощи — какая просьба <span className="italic" style={{ color: T.accent }}>понятнее</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Sizga ikki mijozdan xabar keldi. <b style={{ color: T.ink }}>«1-mijoz»</b> va <b style={{ color: T.ink }}>«2-mijoz»</b> tugmalarini birma-bir bosib o'qing — so'ng o'ng tomonda fikringizni belgilang.</>, ru: <>Вам пришли сообщения от двух клиентов. Нажмите по очереди кнопки <b style={{ color: T.ink }}>«1-й клиент»</b> и <b style={{ color: T.ink }}>«2-й клиент»</b> и прочитайте — потом справа отметьте своё мнение.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {HOOK_REQS.map((q, i) => <button key={i} className={`hk-chip ${view === i ? "on" : ""}${turnCls(litMsg, i, pendMsg.length > 1)}`} onClick={() => show(i)}>{tr2(q.tag)}{seen.has(i) && view !== i ? " ✓" : ""}</button>)}
            </div>
            <div key={view} className={`hreq-card ${r.cls} hk-view fade-step`}>
              <span className="hreq-tag">💬 {tr2({ uz: <>{tr2(r.tag)}dan xabar</>, ru: <>Сообщение от {tr2(r.tag)}</> })}</span>
              <p className="hreq-txt">{tr2(r.text)}</p>
            </div>
            <MentorNote>{tr2({ uz: "O'quvchilar fikr belgilaydi, diagramma o'sib boradi — natijani sinf bilan muhokama qiling.", ru: "Ученики отмечают мнение, диаграмма растёт — обсудите результат с классом." })}</MentorNote>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Sizningcha, qaysi xabar tushunarli?", ru: "Как по-вашему, какое сообщение понятнее?" })}</p>
            <div className="fade-up delay-2" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {HOOK_OPTS.map((o, i) => {
    const on = picked === i;
    const locked = picked !== null || isMentor || !seenBoth;
    return <button key={i} className={`hk-opt ${on ? "on" : ""} ${!seenBoth ? "wait" : ""}${!locked && optWave ? ` turn-ring turn-wave w${i + 1}` : ""}`} disabled={locked} onClick={() => pick(i)}>
                    <span className="hk-radio">{on && <span className="hk-dot" />}</span>
                    <span>{tr2(o)}</span>
                  </button>;
  })}
            </div>
            {picked !== null && !isMentor && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Ikkinchi xabarda <b>KIM</b> so'rayotgani va <b>NEGA</b> kerakligi yozilgan — taxmin qilib o'tirish shart emas. Bunday gap <b>User Story</b> deyiladi: bugun uchtasini o'zingiz yozasiz.</>, ru: <>Во втором сообщении написано, <b>КТО</b> просит и <b>ЗАЧЕМ</b> это нужно — гадать не приходится. Такая фраза называется <b>User Story</b>: сегодня три такие вы напишете сами.</> })}</p></div>}
            {revealViz && isLive && <div className="hvote fade-step" aria-label={tr2({ uz: "Sinf natijasi", ru: "Результат класса" })}>
                {HOOK_OPTS.map((o, i) => {
    const n = shown[i];
    const pct = totalVotes ? Math.round(n / totalVotes * 100) : 0;
    return <div key={i} className={`hvote-row ${picked === i ? "mine" : ""} ${i === topIdx && totalVotes > 0 ? "top" : ""}`}>
                      <span className="hvote-lbl">{tr2(o)}</span>
                      <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                      <span className="hvote-pct mono">{pct}%</span>
                    </div>;
  })}
              </div>}
          </Col>
        </div>
      </div>
    </Stage>;
};
var DEMO_STORIES = [
  { kim: { uz: "imtihonga tayyorlanayotgan o'quvchi", ru: "ученик, который готовится к экзамену" }, nima: { uz: "videoni 2 barobar tez ko'rish", ru: "смотреть видео в 2 раза быстрее" }, natija: { uz: "bir kechada ko'proq mavzuga ulgurish", ru: "успеть за вечер больше тем" } },
  { kim: { uz: "yo'lda ketayotgan tomoshabin", ru: "зритель, который едет в дороге" }, nima: { uz: "videoni oldindan yuklab qo'yish", ru: "скачать видео заранее" }, natija: { uz: "internet yo'q joyda ham ko'ra olish", ru: "смотреть и там, где нет интернета" } },
  { kim: { uz: "yangi kanal egasi", ru: "владелец нового канала" }, nima: { uz: "videoni kim ko'rganini bilish", ru: "знать, кто смотрел видео" }, natija: { uz: "kimga mos video yasashni tushunish", ru: "понимать, для кого делать видео" } }
];
var Screen1 = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr2({ uz: "Maqsad", ru: "Цель" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
      <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Dars oxirida siz <span className="italic" style={{ color: T.accent }}>nimalarga</span> erishasiz?</>, ru: <>Чего вы <span className="italic" style={{ color: T.accent }}>добьётесь</span> к концу урока?</> })}</h2></div>
      <Mentor>{tr2({ uz: <>Ikkinchi mijozning gapi — tayyor <b style={{ color: T.ink }}>User Story</b> edi; bugun o'zingiz ham 3 ta shunday hikoya yozasiz. Pastdagi kartalarni kuzating — YouTube uchun yozilgan hikoyalar o'z-o'zidan to'lib boradi.</>, ru: <>Фраза второго клиента — это и была готовая <b style={{ color: T.ink }}>User Story</b>; сегодня вы и сами напишете три такие истории. Смотрите на карточки внизу — истории, написанные для YouTube, заполняются сами собой.</> })}</Mentor>
      <div className="demo-src fade-up delay-1"><span className="demo-src-ic">▶️</span> {tr2({ uz: "YouTube jamoasi shunday yozadi", ru: "Вот так пишет команда YouTube" })}</div>
      <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DEMO_STORIES.map((s, i) => <div key={i} className="story-silo demo-card" style={{ "--cd": `${0.2 + i * 0.18}s` }}>
            <span className="story-silo-n">{i + 1}</span>
            <div className="story-silo-slots">
              {[["kim", { uz: "KIM", ru: "КТО" }], ["nima", { uz: "NIMA", ru: "ЧТО" }], ["natija", { uz: "NATIJA", ru: "РЕЗУЛЬТАТ" }]].map(([k, lbl], j) => <span key={k} className={`silo-slot ${k} demo-slot`} style={{ "--fd": `${1.1 + (i * 3 + j) * 0.42}s` }}>
                  <span className="silo-lbl">{tr2(lbl)}</span>
                  <span className="silo-fill">{tr2(s[k])}</span>
                </span>)}
            </div>
            <span className="silo-done" style={{ "--fd": `${1.1 + (i * 3 + 2) * 0.42 + 0.3}s` }}>✓</span>
          </div>)}
      </div>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">{tr2({ uz: "Dars oxirida sizning 3 kartangiz ham xuddi shunday yozilgan bo'ladi.", ru: "К концу урока три ваши карточки будут написаны точно так же." })}</p></div>
    </div>
  </Stage>;
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
var S2_FRAGS = [
  { txt: { uz: "Videoni qayta ochdim", ru: "Открыл видео заново" }, cat: "harakat" },
  { txt: { uz: "imtihonga tayyorlanish uchun", ru: "чтобы подготовиться к экзамену" }, cat: "sabab" },
  { txt: { uz: "YouTube'ni ochdim", ru: "Открыл YouTube" }, cat: "harakat" },
  { txt: { uz: "matematikani tushunish uchun", ru: "чтобы разобраться в математике" }, cat: "sabab" }
];
var Screen2 = ({ screen, onNext, onPrev }) => {
  const [st, setSt] = useState2({ picks: {}, hint: -1 });
  const choose = (i, cat) => {
    if (S2_FRAGS[i].cat === cat) setSt((p) => ({ picks: { ...p.picks, [i]: cat }, hint: -1 }));
    else {
      setSt((p) => ({ ...p, hint: i }));
      setTimeout(() => setSt((p) => p.hint === i ? { ...p, hint: -1 } : p), 2200);
    }
  };
  const allSorted = S2_FRAGS.every((_, i) => st.picks[i]);
  const pendRows = S2_FRAGS.map((_, i) => String(i)).filter((k) => !st.picks[k]);
  const litRow = useTurnWalk(pendRows);
  const doneRef = useRef2(null);
  useEffect2(() => {
    if (allSorted && doneRef.current) {
      const t = setTimeout(() => doneRef.current && doneRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
      return () => clearTimeout(t);
    }
  }, [allSorted]);
  const [gs, setGs] = useState2(0);
  useEffect2(() => {
    if (!allSorted) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGs(4);
      return;
    }
    const ts = [setTimeout(() => setGs(1), 250), setTimeout(() => setGs(2), 1200), setTimeout(() => setGs(3), 2100), setTimeout(() => setGs(4), 3e3)];
    return () => ts.forEach(clearTimeout);
  }, [allSorted]);
  return <Stage eyebrow={tr2({ uz: "Muhokama · savol", ru: "Обсуждение · вопрос" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSorted} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Hikoya <span className="italic" style={{ color: T.accent }}>nimadan</span> yasaladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Из чего</span> состоит история?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Hikoya uch bo'lakdan yasaladi: <b style={{ color: T.ink }}>KIM</b>, <b style={{ color: T.ink }}>harakat</b> va <b style={{ color: T.ink }}>sabab</b>. Avval harakat bilan sababni ajratishni o'rganamiz — pastdagi gaplarni belgilab ko'ring. Barchasini to'g'ri belgilagach, to'liq hikoya quramiz.</>, ru: <>История состоит из трёх частей: <b style={{ color: T.ink }}>КТО</b>, <b style={{ color: T.ink }}>действие</b> и <b style={{ color: T.ink }}>причина</b>. Сначала научимся отличать действие от причины — отметьте фразы внизу. Когда всё будет отмечено верно, соберём полную историю.</> })}</Mentor>
        <MentorNote>{tr2({ uz: "Sinf bilan og'zaki muhokama: «Qaysi ilovani nima maqsadda ishlatasiz?» — ilova nomi emas, NIMA UCHUN ishlatishi muhim. 2-3 javob oling, so'ng mashqqa o'ting.", ru: "Устное обсуждение с классом: «Каким приложением и ради чего вы пользуетесь?» — важно не название приложения, а ЗАЧЕМ им пользуются. Возьмите 2-3 ответа и переходите к упражнению." })}</MentorNote>
        <div className={`s2sort fade-up delay-1${allSorted ? " dim" : ""}`}>
          <span className="flow-label">{tr2({ uz: "Bo'laklarni ajrating: harakatmi yoki sabab?", ru: "Разделите кусочки: это действие или причина?" })}</span>
          {S2_FRAGS.map((f, i) => {
    const pick = st.picks[i];
    return <div key={i} className={`s2row ${pick ? "done" : ""}${turnCls(litRow, String(i), pendRows.length > 1)}`}>
                <span className="s2txt">{pick === "harakat" ? "🏃 " : pick === "sabab" ? "💡 " : ""}«{tr2(f.txt)}»</span>
                {pick ? <span className={`s2tag ${pick}`}>{pick === "harakat" ? tr2({ uz: "harakat", ru: "действие" }) : tr2({ uz: "sabab", ru: "причина" })} ✓</span> : <span className="s2btns"><button className="s2btn" onClick={() => choose(i, "harakat")}>🏃 {tr2({ uz: "harakat", ru: "действие" })}</button><button className="s2btn" onClick={() => choose(i, "sabab")}>💡 {tr2({ uz: "sabab", ru: "причина" })}</button></span>}
                {st.hint === i && <span className="s2hint">{tr2({ uz: "Yana o'ylab ko'ring: «...uchun» bilan tugasa — bu sabab. 🙂", ru: "Подумайте ещё: если заканчивается на «чтобы...» — это причина. 🙂" })}</span>}
              </div>;
  })}
        </div>
        {
    /* Yakun (F-0727-02): xulosa AVVAL so'z bilan ochiladi, keyin o'quvchining O'Z gapi to'liq
       hikoyaga o'stiriladi — bo'laklar «kim/harakat/sabab» deb belgilanadi (formula-nomlari
       keyingi ekranda keladi: induktiv tartib). Ko'prik-gap keyingi ekranga ishorat qiladi. */
  }
        {allSorted && <Zoomable>
            <div className="grow-card fade-step" ref={doneRef}>
              <span className="ex-lbl">{tr2({ uz: "🌱 Mana sizning to'liq hikoyangiz", ru: "🌱 Вот ваша полная история" })}</span>
              <div className="grow-from">
                <span className={`gf-chip harakat gf-l${gs >= 1 ? " in" : ""}`}>🏃 «{tr2({ uz: "YouTube'ni ochdim", ru: "Открыл YouTube" })}»</span>
                <span className={`gf-plus gf-f${gs >= 1 ? " in" : ""}`}>+</span>
                <span className={`gf-chip sabab gf-r${gs >= 1 ? " in" : ""}`}>💡 «{tr2({ uz: "matematikani tushunish uchun", ru: "чтобы разобраться в математике" })}»</span>
              </div>
              {gs >= 2 && <span className="grow-arrow ga-pulse" aria-hidden="true">↓</span>}
              {gs >= 2 && <p className="ex-body">{tr2({
    uz: <>Men {gs >= 4 ? <b className="gp kim lit drop" data-sub="🙋 kim">matematikadan qiynalayotgan o'quvchi</b> : <span className="gp-slot" aria-label="hali bo'sh joy" />} sifatida, <b className="gp nima lit" data-sub="🏃 harakat">darsni YouTube'da qayta ko'rish</b>ni xohlayman, <b className={`gp natija${gs >= 3 ? " lit" : ""}`} data-sub="💡 sabab">masalani mustaqil yechishim</b> uchun.</>,
    ru: <>Я как {gs >= 4 ? <b className="gp kim lit drop" data-sub="🙋 кто">ученик, которому трудно даётся математика</b> : <span className="gp-slot" aria-label="пока пустое место" />}, хочу <b className="gp nima lit" data-sub="🏃 действие">пересмотреть урок на YouTube</b>, чтобы <b className={`gp natija${gs >= 3 ? " lit" : ""}`} data-sub="💡 причина">решить задачу самостоятельно</b>.</>
  })}</p>}
            </div>
          </Zoomable>}
      </div>
    </Stage>;
};
var FRAG_POOL = [
  { txt: { uz: "matematikadan qiynalayotgan o'quvchi", ru: "ученик, которому трудно даётся математика" }, slot: 0 },
  { txt: { uz: "darsni YouTube'da qayta ko'rish", ru: "пересмотреть урок на YouTube" }, slot: 1 },
  { txt: { uz: "masalani mustaqil yechishim", ru: "решить задачу самостоятельно" }, slot: 2 }
];
var SLOT_META = [
  { key: "kim", label: { uz: "KIM", ru: "КТО" }, hint: { uz: "foydalanuvchi turi", ru: "тип пользователя" } },
  { key: "nima", label: { uz: "NIMA", ru: "ЧТО" }, hint: { uz: "harakat", ru: "действие" } },
  { key: "natija", label: { uz: "NATIJA", ru: "РЕЗУЛЬТАТ" }, hint: { uz: "natija", ru: "результат" } }
];
var FORMULA_WORDS = {
  pre: { uz: "Men", ru: "Я как" },
  after: [
    { uz: "sifatida,", ru: ", хочу" },
    { uz: "ni xohlayman,", ru: ", чтобы" },
    { uz: "uchun.", ru: "." }
  ]
};
var FRAG_ORDER = [1, 2, 0];
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [st, setSt] = useState2(() => ({ placed: storedAnswer?.placed || [null, null, null], sel: -1, shake: -1 }));
  const done = st.placed.every((p) => p !== null);
  const pickChip = (idx) => {
    const f = FRAG_POOL[idx];
    if (st.placed[f.slot] === idx) return;
    setSt((prev) => ({ ...prev, sel: prev.sel === idx ? -1 : idx, shake: -1 }));
  };
  const trySlot = (slotIdx) => {
    if (st.placed[slotIdx] !== null || st.sel < 0) return;
    const frag = FRAG_POOL[st.sel];
    if (frag.slot === slotIdx) {
      const placed = [...st.placed];
      placed[slotIdx] = st.sel;
      setSt({ placed, sel: -1, shake: -1 });
      if (placed.every((p) => p !== null) && storedAnswer === void 0) onAnswer(screen, { placed, correct: true });
    } else {
      setSt((prev) => ({ ...prev, shake: slotIdx }));
      setTimeout(() => setSt((prev) => prev.shake === slotIdx ? { ...prev, shake: -1 } : prev), 480);
    }
  };
  const reset = () => setSt({ placed: [null, null, null], sel: -1, shake: -1 });
  const selActive = st.sel >= 0;
  const pendFrags = FRAG_ORDER.filter((idx) => st.placed[FRAG_POOL[idx].slot] !== idx).map(String);
  const litFrag = useTurnWalk(pendFrags, !selActive && !done);
  return <Stage eyebrow={tr2({ uz: "1 hikoya — 3 bo'lak", ru: "1 история — 3 части" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Uch bo'lakni joylang", ru: "Разложите три части" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Hikoyani 3 bo'lakdan o'zingiz <span className="italic" style={{ color: T.accent }}>tuza olasizmi</span>?</>, ru: <>Сможете <span className="italic" style={{ color: T.accent }}>собрать</span> историю из 3 частей сами?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>User Story ichida 3 bo'lak bor: <b style={{ color: T.ink }}>«Men [KIM] sifatida, [NIMA]ni xohlayman, [NATIJA] uchun»</b> — ikkinchi mijoz gapi aynan shunday tuzilgan edi. Pastdagi bo'laklarni birma-bir bosib, hikoyani o'zingiz yig'ing.</>, ru: <>Внутри User Story три части: <b style={{ color: T.ink }}>«Я как [КТО], хочу [ЧТО], чтобы [РЕЗУЛЬТАТ]»</b> — фраза второго клиента была построена именно так. Нажимайте на части внизу по одной и соберите историю сами.</> })}</Mentor>
        <div className="formula-line fade-up delay-1">
          <span className="fw">{tr2(FORMULA_WORDS.pre)}</span>
          {SLOT_META.map((s, i) => <React.Fragment key={s.key}>
              <button
    className={`fslot ${s.key} ${st.placed[i] ? "filled" : ""} ${st.shake === i ? "shake" : ""} ${selActive && st.placed[i] === null ? "targetable" : ""}`}
    disabled={st.placed[i] !== null}
    onClick={() => trySlot(i)}
  >{st.placed[i] === null || st.placed[i] === void 0 ? tr2(s.label) : typeof st.placed[i] === "number" ? tr2(FRAG_POOL[st.placed[i]].txt) : st.placed[i]}</button>
              <span className="fw">{tr2(FORMULA_WORDS.after[i])}</span>
            </React.Fragment>)}
        </div>
        {!done && <div className="frag-pool fade-up delay-2">
          {FRAG_ORDER.map((idx) => {
    const f = FRAG_POOL[idx];
    if (st.placed[f.slot] === idx) return null;
    return <button key={idx} className={`frag-chip ${st.sel === idx ? "sel" : ""}${turnCls(litFrag, String(idx), pendFrags.length > 1)}`} onClick={() => pickChip(idx)}>{tr2(f.txt)}</button>;
  })}
        </div>}
        {done && <div className="fade-step" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="done-mini">{tr2({ uz: "✅ Hikoya to'liq!", ru: "✅ История собрана!" })} <span className="dm-sub">{tr2({ uz: "E'tibor bering: video ko'rish — harakat, «masalani mustaqil yechish» — undan keladigan foyda. NATIJA doim foydani aytadi", ru: "Обратите внимание: посмотреть видео — это действие, а «решить задачу самостоятельно» — польза от него. РЕЗУЛЬТАТ всегда называет пользу" })}</span></div>
            <button className="btn-soft" onClick={reset}>{tr2({ uz: "↻ Qaytadan", ru: "↻ Заново" })}</button>
          </div>}
      </div>
    </Stage>;
};
var K11_SLIDES = [
  { ic: "🌅", h: { uz: "Hammasi raqamlardan boshlandi", ru: "Всё началось с цифр" }, body: { uz: <>McDonald's sotuvlarni tekshirdi: milkshake'lar eng ko'p <b>ertalab</b> sotilyapti. Kutilmagan holat — axir ertalab kim milkshake ichadi?</>, ru: <>McDonald's проверил продажи: молочные коктейли больше всего покупают <b>по утрам</b>. Неожиданно — кто вообще пьёт коктейль с утра?</> } },
  { ic: "🕵️", h: { uz: "Xaridorlardan so'rashdi", ru: "Спросили у покупателей" }, body: { uz: <>Kuzatuvchilar ertalabki xaridorlar bilan gaplashib chiqdi. Ma'lum bo'ldi: ular milkshake'ni <b>shirinlik yeyish uchun olmayotgan ekan</b> — sababi butunlay boshqa.</>, ru: <>Наблюдатели поговорили с утренними покупателями. Выяснилось: коктейль берут <b>вовсе не как десерт</b> — причина совсем другая.</> } },
  { ic: "🚗", h: { uz: "Sabab — uzoq yo'l", ru: "Причина — долгая дорога" }, body: { uz: <>Bu odamlar har kuni ertalab mashinada uzoq yo'l yurib boradi — va yo'l zerikarli o'tadi. Milkshake ana shu yo'lda <b>uchta foyda</b> berarkan: bir qo'lda bemalol ushlanadi; tez tugamaydi — yo'l oxirigacha yetadi; va to'yimli — odamni <b>tushlikkacha to'q saqlaydi</b>.</>, ru: <>Эти люди каждое утро едут на машине долгую дорогу — и в дороге скучно. Оказалось, коктейль даёт в пути <b>три выгоды</b>: спокойно держится одной рукой; не кончается быстро — хватает до конца пути; и сытный — <b>держит сытым до обеда</b>.</> } },
  {
    ic: "🔧",
    h: { uz: "Buni bilgach, nima o'zgardi?", ru: "Что изменилось, когда это узнали?" },
    body: { uz: <>McDonald's ikkita qaror qildi. <b>Birinchisi:</b> milkshake'ni yanada quyuq qildi — quyuq ichimlik uzoq ichiladi, endi u yo'l oxirigacha tugab qolmaydi. <b>Ikkinchisi:</b> uni kassadan eshik oldiga ko'chirdi — mijoz <b>o'zi quyib oladigan maxsus apparat</b> qo'ydi, shoshayotgan haydovchi navbatda turmasdan olib ketaveradi. Natija: ertalabki sotuv o'sdi.</>, ru: <>McDonald's принял два решения. <b>Первое:</b> сделал коктейль гуще — густой напиток пьётся дольше, теперь он не кончается до конца дороги. <b>Второе:</b> перенёс его от кассы ко входу — поставил <b>отдельный аппарат, где наливаешь сам</b>, и спешащий водитель забирает коктейль без очереди. Итог: утренние продажи выросли.</> },
    predict: { ask: { uz: "Sizningcha, buni bilgach McDonald's nima qildi?", ru: "Как думаете, что сделал McDonald's, когда узнал это?" }, chips: [{ ic: "💸", t: { uz: "narxni tushirdi", ru: "снизил цену" } }, { ic: "📺", t: { uz: "reklama qildi", ru: "дал рекламу" } }, { ic: "🥤", t: { uz: "yanada quyuq qildi", ru: "сделал гуще" } }, { ic: "🕐", t: { uz: "kechqurun sotdi", ru: "стал продавать вечером" } }], ans: 2 }
  },
  {
    ic: "🎯",
    h: { uz: "Xulosa: odam natijani sotib oladi", ru: "Вывод: человек покупает результат" },
    body: { uz: <>Odam milkshake'ning o'zini emas, u beradigan <b>natijani</b> — «yo'lda zerikmaslik va tushlikkacha to'q qolish»ni sotib olyapti. Bu g'oya <b>Jobs-to-be-Done (JTBD)</b> deb ataladi: mahsulot odamga beradigan foydali natija.</>, ru: <>Человек покупает не сам коктейль, а <b>результат</b>, который тот даёт: «не скучать в дороге и оставаться сытым до обеда». Эта идея называется <b>Jobs-to-be-Done (JTBD)</b>: полезный результат, который продукт даёт человеку.</> },
    predict: { ask: { uz: "Odam aslida nimani sotib oladi?", ru: "Что человек покупает на самом деле?" }, chips: [{ ic: "🥤", t: { uz: "ta'mni", ru: "вкус" } }, { ic: "🎯", t: { uz: "foydali natijani", ru: "полезный результат" } }, { ic: "💸", t: { uz: "arzon narxni", ru: "низкую цену" } }], ans: 1 }
  }
];
var Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === "mentor");
  const [i, setI] = useState2(0);
  const [bets, setBets] = useState2({});
  const last = i === K11_SLIDES.length - 1;
  useEffect2(() => {
    if (last && storedAnswer === void 0) onAnswer(screen, { correct: true });
  }, [last]);
  const c = K11_SLIDES[i];
  const bet = c.predict ? bets[i] : void 0;
  const betPending = !!(c.predict && bet === void 0);
  const betHint = useTurnHint(betPending);
  return <Stage eyebrow={tr2({ uz: "Biznesdan real misol 🥤", ru: "Реальный пример из бизнеса 🥤" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr2({ uz: "Avval taxminingizni tanlang", ru: "Сначала выберите свою догадку" }) : last ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `Keyingi bosqich (${i + 1}/${K11_SLIDES.length})`, ru: `Следующий шаг (${i + 1}/${K11_SLIDES.length})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <><span className="italic" style={{ color: T.accent }}>Milkshake</span> — biznesdagi mashhur misol</>, ru: <><span className="italic" style={{ color: T.accent }}>Молочный коктейль</span> — известный пример из бизнеса</> })}</h2></div>
        {c.predict ? <>
            <div className="kp-bet fade-step" key={`b${i}`}>
              <span className="k-slide-eyebrow">{tr2({ uz: "🎲 Taxmin o'yini · ball yo'q", ru: "🎲 Игра в догадки · без баллов" })}</span>
              <h3 className="k-slide-h">{tr2(c.predict.ask)}</h3>
              <div className="kp-chips">
                {c.predict.chips.map((ch, k) => {
    const locked = bet !== void 0;
    const isAns = k === c.predict.ans;
    let cls = "kp-chip";
    if (locked) {
      cls += " locked";
      if (isAns) cls += " correct";
      else if (bet === k && !isMentorK) cls += " wrong";
    } else cls += waveCls(betHint, k, c.predict.chips.length);
    return <button key={k} className={cls} disabled={locked} onClick={() => setBets((p) => ({ ...p, [i]: k }))}>
                      <span className="kp-ic">{ch.ic}</span>{tr2(ch.t)}
                      {locked && isAns && <span className="kp-mark ok">✓</span>}
                      {locked && !isAns && bet === k && !isMentorK && <span className="kp-mark no">✗</span>}
                    </button>;
  })}
              </div>
              {bet === void 0 ? <p className="kp-sub">{tr2({ uz: "Birini tanlang — javobi ochiladi.", ru: "Выберите один — ответ откроется." })}</p> : bet !== void 0 && !isMentorK && <p className={`kp-res ${bet === c.predict.ans ? "hit" : "miss"}`}>{bet === c.predict.ans ? tr2({ uz: "🎯 Topdingiz!", ru: "🎯 Угадали!" }) : tr2({ uz: <>Adashdingiz — asl javob «{tr2(c.predict.chips[c.predict.ans].t)}», «{tr2(c.predict.chips[bet].t)}» emas.</>, ru: <>Не угадали — верный ответ «{tr2(c.predict.chips[c.predict.ans].t)}», а не «{tr2(c.predict.chips[bet].t)}».</> })}</p>}
            </div>
            {bet !== void 0 && <div className="k-slide fade-step revealed" key={i}>
                <div className="k-slide-ic">{c.ic}</div>
                <h3 className="k-slide-h">{tr2(c.h)}</h3>
                <p className="k-slide-body">{tr2(c.body)}</p>
              </div>}
          </> : <div className="k-slide fade-step" key={i}>
            <span className="k-slide-eyebrow">📊 {tr2({ uz: "Milkshake misoli", ru: "Пример с коктейлем" })} · {i + 1} / {K11_SLIDES.length}</span>
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{tr2(c.h)}</h3>
            <p className="k-slide-body">{tr2(c.body)}</p>
          </div>}
        <div className="k-dots">{K11_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} />)}</div>
        {last && !betPending && <div className="frame-soft fade-step">
          <p className="body" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>
            {tr2({ uz: "Dars boshidagi ikki mijozni eslang — bu misol ham xuddi shuni aytadi: odam nima sotib olayotgani emas, NEGA olayotgani muhim.", ru: "Вспомните двух клиентов в начале урока — этот пример говорит о том же: важно не что человек покупает, а ЗАЧЕМ он это покупает." })}
          </p>
        </div>}
      </div>
    </Stage>;
};
var PRACTICE_BASE = 500;
var MentorPracticeStats = ({ live, screen, label = "👀 Kim bajardi" }) => {
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
      <div className="card-lbl" style={{ color: T.blue }}>{label} — {doers.length}/{players.length}</div>
      {data.players === null ? <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: "italic" }}>{tr2({ uz: "Yuklanmoqda…", ru: "Загрузка…" })}</p> : players.length === 0 ? <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: "italic" }}>{tr2({ uz: "Hali hech kim qo'shilmagan.", ru: "Пока никто не подключился." })}</p> : <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
      👥 {tr2({ uz: "Sinfda:", ru: "В классе:" })} <b>{data.done}</b> {tr2({ uz: "bajardi", ru: "выполнили" })}{doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr2({ uz: "hali bajarmoqda", ru: "ещё выполняют" })}</span>}
    </div>;
};
var emptyCard = () => ({ kim: "", nima: "", natija: "", star: 0 });
var ScreenStoryWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorW = !!(live && live.mode === "mentor");
  const [st, setSt] = useState2(() => {
    const src = storedAnswer?.cards || readStories() || [];
    const saved2 = src.filter((c) => c && validateStory(c.kim, c.nima, c.natija).full).slice(0, 3).map((c) => ({ kim: c.kim, nima: c.nima, natija: c.natija, star: c.star || 0 }));
    return { saved: saved2, draft: emptyCard(), editIdx: -1, done: !!(storedAnswer && storedAnswer.solved) || saved2.length >= 3 };
  });
  const { saved, draft, editIdx, done } = st;
  useEffect2(() => {
    if (done && storedAnswer === void 0 && saved.length >= 3) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "story-workshop", cards: saved, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
  }, []);
  const v = validateStory(draft.kim, draft.nima, draft.natija);
  const editing = editIdx >= 0;
  const allSaved = saved.length >= 3;
  const showEditor = !allSaved || editing;
  const natijaTakror = v.full && draft.natija.trim().toLowerCase() === draft.nima.trim().toLowerCase();
  const others = saved.filter((_, i) => i !== editIdx);
  const kimTakror = v.full && others.length > 0 && others.some((c) => c.kim.trim().toLowerCase() === draft.kim.trim().toLowerCase());
  const canSave = v.full && !natijaTakror && !kimTakror;
  const saveHint = !v.full ? null : natijaTakror ? tr2({ uz: "NATIJA harakatning takrori bo'lib qoldi. Harakatdan keyin hayotda nima o'zgaradi — shuni yozing.", ru: "РЕЗУЛЬТАТ повторил действие. Напишите, что изменится в жизни после этого действия." }) : kimTakror ? tr2({ uz: "Bu KIM allaqachon daftarda bor — boshqa foydalanuvchi turini o'ylang.", ru: "Такой КТО в блокноте уже есть — придумайте другой тип пользователя." }) : null;
  const persistAll = (cards) => writeStories(cards);
  const saveDraft = () => {
    if (!canSave) return;
    const cards = editing ? saved.map((c, i) => i === editIdx ? { ...draft } : c) : [...saved, { ...draft }];
    persistAll(cards);
    const finished = cards.length >= 3;
    if (finished && !done) {
      onAnswer(screen, { stage: "practice", screenIdx: screen, practice: "story-workshop", cards, solved: true, correct: true, picked: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 0, true, 0);
    }
    setSt({ saved: cards, draft: emptyCard(), editIdx: -1, done: done || finished });
  };
  const editCard = (i) => setSt((prev) => ({ ...prev, draft: { ...prev.saved[i] }, editIdx: i }));
  const setStar = (i, star) => setSt((prev) => {
    const cards = prev.saved.map((c, k) => k === i ? { ...c, star } : c);
    persistAll(cards);
    return { ...prev, saved: cards };
  });
  const setD = (patch) => setSt((prev) => ({ ...prev, draft: { ...prev.draft, ...patch } }));
  const navLabel = done || isMentorW ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `✍️ ${saved.length}/3 — hikoyani yozib saqlang`, ru: `✍️ ${saved.length}/3 — напишите историю и сохраните` });
  const [fieldFocus, setFieldFocus] = useState2(false);
  const pendFields = ["kim", "nima", "natija"].filter((k) => !(draft[k] || "").trim());
  const litField = useTurnWalk(pendFields, showEditor && !fieldFocus);
  const saveTurn = useTurnHint(showEditor && canSave);
  const turnBusyW = showEditor && !isMentorW && (pendFields.length > 0 || canSave);
  const turnQuietW = showEditor && !isMentorW && !fieldFocus && pendFields.length > 0 || saveTurn;
  return <Stage eyebrow={tr2({ uz: "Amaliyot · hikoya-ustaxona ✍️", ru: "Практика · мастерская историй ✍️" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={turnBusyW} disabled={!done && !isMentorW} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'z loyihangiz uchun <span className="italic" style={{ color: T.accent }}>3 ta hikoya</span> yozing</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>3 истории</span> для своего проекта</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Endi navbat sizda — o'z loyihangiz uchun yozasiz. Kartani to'ldirib <b style={{ color: T.ink }}>«Saqlash»</b>ni bosing: tepadagi qadam-belgisi ✓ bo'ladi va yangi karta keladi.</>, ru: <>Теперь ваша очередь — пишете для своего проекта. Заполните карточку и нажмите <b style={{ color: T.ink }}>«Сохранить»</b>: шаг наверху станет ✓ и придёт новая карточка.</> })}</Mentor>
        {
    /* F-0727-58: JTBD-ustaxona naqshi porti — havodagi 1-2-3 indikator + yagona muharrir-karta;
       yozilgan hikoyalar yozish paytida ko'rinmaydi, 3/3 da daftar (yulduzlar bilan) ochiladi. */
  }
        {
    /* Qadam-indikatori navbat maydonlarda yurayotganda tinchlanadi — lahzada bitta puls (88-qonun (a)) */
  }
        <div className={`jw-steps fade-up ${turnQuietW ? "turn-quiet" : ""}`} aria-label={tr2({ uz: `${saved.length}/3 hikoya yozildi`, ru: `Написано историй: ${saved.length}/3` })}>
          {[0, 1, 2].map((i) => <React.Fragment key={i}>
              {i > 0 && <span className={`jws-line ${saved.length >= i ? "on" : ""}`} aria-hidden="true" />}
              <span className={`jws ${saved[i] ? "on" : i === saved.length && showEditor ? "cur" : ""}`}>
                <i className="jws-n">{saved[i] ? "✓" : i + 1}</i>
                <em className="jws-t">{saved[i] ? saved[i].kim : tr2({ uz: `${i + 1}-hikoya`, ru: `История ${i + 1}` })}</em>
              </span>
            </React.Fragment>)}
        </div>
        {showEditor ? <div className="swed fade-up" key={editing ? `e${editIdx}` : `n${saved.length}`}>
            {editing && <span className="swed-tag">✎ {tr2({ uz: `${editIdx + 1}-hikoyani tahrirlash`, ru: `Правка истории ${editIdx + 1}` })}</span>}
            <p className="swed-sent">{tr2({
    uz: <>Men <b className={`ss-slot kim ${draft.kim ? "on" : ""}`}>{draft.kim || "kim"}</b> sifatida, <b className={`ss-slot nima ${draft.nima ? "on" : ""}`}>{draft.nima || "nima"}</b>ni xohlayman, <b className={`ss-slot natija ${draft.natija ? "on" : ""}`}>{draft.natija || "natija"}</b> uchun.</>,
    ru: <>Я как <b className={`ss-slot kim ${draft.kim ? "on" : ""}`}>{draft.kim || "кто"}</b>, хочу <b className={`ss-slot nima ${draft.nima ? "on" : ""}`}>{draft.nima || "что"}</b>, чтобы <b className={`ss-slot natija ${draft.natija ? "on" : ""}`}>{draft.natija || "результат"}</b>.</>
  })}</p>
            <div className="swcard-fields">
              <label className={`smini-f kim ${v.kimOk ? "on" : ""}${turnCls(litField, "kim", pendFields.length > 1)}`}><span>{tr2({ uz: "KIM", ru: "КТО" })}</span><input value={draft.kim} onChange={(e) => setD({ kim: e.target.value })} onFocus={() => setFieldFocus(true)} onBlur={() => setFieldFocus(false)} placeholder={tr2({ uz: "foydalanuvchi turi", ru: "тип пользователя" })} /></label>
              <label className={`smini-f nima ${v.nimaOk ? "on" : ""}${turnCls(litField, "nima", pendFields.length > 1)}`}><span>{tr2({ uz: "NIMA", ru: "ЧТО" })}</span><input value={draft.nima} onChange={(e) => setD({ nima: e.target.value })} onFocus={() => setFieldFocus(true)} onBlur={() => setFieldFocus(false)} placeholder={tr2({ uz: "harakat", ru: "действие" })} /></label>
              <label className={`smini-f natija ${v.natijaOk ? "on" : ""}${turnCls(litField, "natija", pendFields.length > 1)}`}><span>{tr2({ uz: "NATIJA", ru: "РЕЗУЛЬТАТ" })}</span><input value={draft.natija} onChange={(e) => setD({ natija: e.target.value })} onFocus={() => setFieldFocus(true)} onBlur={() => setFieldFocus(false)} placeholder={tr2({ uz: "natija", ru: "результат" })} /></label>
            </div>
            {saveHint && <p className="swed-hint">💡 {saveHint}</p>}
            <div className="swed-btns">
              {editing && <button className="btn-ghost" onClick={() => setSt((prev) => ({ ...prev, draft: emptyCard(), editIdx: -1 }))}>{tr2({ uz: "Bekor qilish", ru: "Отмена" })}</button>}
              {!v.full && <span className="swed-cnt">{[draft.kim, draft.nima, draft.natija].filter((x) => (x || "").trim().length >= 2).length}/3 {tr2({ uz: "maydon to'ldi", ru: "полей заполнено" })}</span>}
              <button className={`swed-save${saveTurn ? " turn-ring" : ""}`} disabled={!canSave} onClick={saveDraft}>✓ {tr2({ uz: "Saqlash", ru: "Сохранить" })}</button>
            </div>
          </div> : <>
            <div className="done-mini fade-step">{tr2({ uz: "✅ Uchta hikoya tayyor", ru: "✅ Три истории готовы" })} <span className="dm-sub">{tr2({ uz: "— tahrirlash uchun ✎ belgisidan foydalaning", ru: "— для правки нажмите значок ✎" })}</span></div>
            <div className="svd full fade-step">
              {[0, 1, 2].map((i) => {
    const c = saved[i];
    if (!c) return null;
    return <div key={i} className={`svd-card ${editIdx === i ? "editing" : ""}`}>
                    <div className="svd-top">
                      <span className="svd-num">✓ {i + 1}</span>
                      <span className="svd-stars">{[1, 2, 3, 4, 5].map((st2) => <button key={st2} className={`star ${c.star >= st2 ? "on" : ""}`} onClick={() => setStar(i, st2)} aria-label={tr2({ uz: `Muhimligi: ${st2} yulduz`, ru: `Важность: ${st2} звёзд` })} title={tr2({ uz: `Muhimligi: ${st2} yulduz`, ru: `Важность: ${st2} звёзд` })}>★</button>)}</span>
                      <button className="svd-edit" onClick={() => editCard(i)} aria-label={tr2({ uz: `${i + 1}-hikoyani tahrirlash`, ru: `Править историю ${i + 1}` })}>✎ {tr2({ uz: "Tahrirlash", ru: "Править" })}</button>
                    </div>
                    <p className="svd-sent">{tr2({
      uz: <>Men <b style={{ color: T.blue }}>{c.kim}</b> sifatida, <b style={{ color: "#B77A16" }}>{c.nima}</b>ni xohlayman, <b style={{ color: T.success }}>{c.natija}</b> uchun.</>,
      ru: <>Я как <b style={{ color: T.blue }}>{c.kim}</b>, хочу <b style={{ color: "#B77A16" }}>{c.nima}</b>, чтобы <b style={{ color: T.success }}>{c.natija}</b>.</>
    })}</p>
                  </div>;
  })}
              <p className="svd-foot">{tr2({ uz: "⭐ Har hikoyangizga yulduz qo'ying: bu hikoya siz uchun qanchalik muhim?", ru: "⭐ Поставьте каждой истории звёзды: насколько она важна для вас?" })}</p>
            </div>
          </>}
        <MentorPracticeStats live={live} screen={screen} label={tr2({ uz: "✍️ 3 hikoyani yozib bo'lganlar", ru: "✍️ Кто написал 3 истории" })} />
        <MentorNote>{tr2({ uz: "Bu amaliyotni o'quvchilar bajaradi — «✍️ 3 hikoyani yozib bo'lganlar» panelida kuzatasiz; «Davom etish» siz uchun ochiq. Qiynalganga 3 savol bering: loyihangizdan KIM foydalanadi? U birinchi NIMANI qiladi? Keyin hayotida NIMA o'zgaradi? Shu 3 javob = 1 hikoya.", ru: "Это задание выполняют ученики — вы следите на панели «✍️ Кто написал 3 истории»; «Продолжить» для вас открыто. Кто застрял, задайте 3 вопроса: КТО будет пользоваться вашим проектом? ЧТО он сделает первым делом? ЧТО потом изменится в его жизни? Эти 3 ответа = 1 история." })}</MentorNote>
      </div>
    </Stage>;
};
var readFullStories = () => (readStories() || []).filter((c) => c && validateStory(c.kim, c.nima, c.natija).full).slice(0, 3);
var PEER_REASONS = [
  { key: "kim", t: { uz: "KIM aniq emas", ru: "КТО не конкретен" } },
  { key: "takror", t: { uz: "NATIJA takror", ru: "РЕЗУЛЬТАТ повторяется" } },
  { key: "foyda", t: { uz: "NATIJA foyda emas", ru: "РЕЗУЛЬТАТ не про пользу" } }
  // distraktor: bu uch kartada javob emas
];
var PEER_CARDS = [
  {
    kim: { uz: "foydalanuvchi", ru: "пользователь" },
    nima: { uz: "qorong'i rejim", ru: "тёмная тема" },
    natija: { uz: "kechqurun ko'zim charchamasligi", ru: "чтобы вечером глаза не уставали" },
    ok: false,
    flaw: "kim",
    why: { uz: "KIM «foydalanuvchi» — qaysi odam ekani aytilmagan.", ru: "КТО — «пользователь»: не сказано, что это за человек." }
  },
  {
    kim: { uz: "birinchi marta kirgan mehmon", ru: "гость, который зашёл впервые" },
    nima: { uz: "qidiruv qatori", ru: "строка поиска" },
    natija: { uz: "kerakli darsni tez topishim", ru: "чтобы быстро найти нужный урок" },
    ok: true,
    flaw: null,
    why: { uz: "KIM aniq, NATIJA esa yangi foyda beradi.", ru: "КТО конкретен, а РЕЗУЛЬТАТ даёт новую пользу." }
  },
  {
    kim: { uz: "9-sinf o'quvchisi", ru: "ученик 9 класса" },
    nima: { uz: "eslatma tugmasi", ru: "кнопка напоминания" },
    natija: { uz: "eslatma tugmasi bo'lishi", ru: "чтобы была кнопка напоминания" },
    ok: false,
    flaw: "takror",
    why: { uz: "NATIJA NIMAni takrorlaydi — yangi foyda ko'rinmayapti.", ru: "РЕЗУЛЬТАТ повторяет ЧТО — новой пользы не видно." }
  }
];
var peerLine = (card, v) => {
  const why = tr2(card.why);
  if (card.ok) return v.ok ? { good: true, t: tr2({ uz: `Ha, to'g'ri: ${why}`, ru: `Да, верно: ${why}` }) } : { good: false, t: tr2({ uz: `Bu hikoya aslida to'g'ri: ${why}`, ru: `На самом деле эта история верная: ${why}` }) };
  if (v.ok) return { good: false, t: tr2({ uz: `Bu hikoya noto'g'ri: ${why}`, ru: `Эта история неверная: ${why}` }) };
  if (v.reason === card.flaw) return { good: true, t: tr2({ uz: `To'g'ri: ${why}`, ru: `Верно: ${why}` }) };
  return { good: false, t: tr2({ uz: `Kamchilik boshqa joyda: ${why}`, ru: `Недостаток в другом месте: ${why}` }) };
};
var ScreenPeer = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorP = !!(live && live.mode === "mentor");
  const [st, setSt] = useState2(() => {
    const v = storedAnswer && Array.isArray(storedAnswer.verdicts) ? storedAnswer.verdicts : [];
    const fin = !!(storedAnswer && storedAnswer.solved);
    return { idx: fin ? PEER_CARDS.length : v.length, verdicts: v, done: fin, asking: false };
  });
  const { idx, verdicts, done, asking } = st;
  const card = done ? null : PEER_CARDS[idx];
  const cur = verdicts[idx] || null;
  const left = PEER_CARDS.length - verdicts.filter(Boolean).length;
  const commit = (v) => setSt((prev) => {
    const next = prev.verdicts.slice();
    next[prev.idx] = v;
    return { ...prev, verdicts: next, asking: false };
  });
  const choose = (ok) => {
    if (cur) return;
    if (ok) commit({ ok: true, reason: null });
    else setSt((prev) => ({ ...prev, asking: true }));
  };
  const goNext = () => {
    const n = idx + 1;
    if (n < PEER_CARDS.length) {
      setSt((prev) => ({ ...prev, idx: n, asking: false }));
      return;
    }
    if (!done) {
      onAnswer(screen, { stage: "peer", screenIdx: screen, verdicts, solved: true, correct: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "peer", 0, true, 0);
    }
    setSt((prev) => ({ ...prev, idx: n, done: true, asking: false }));
  };
  const fb = card && cur ? peerLine(card, cur) : null;
  const verdictHint = useTurnHint(!!card && !cur && !asking);
  const reasonHint = useTurnHint(!!card && !cur && asking);
  const goHint = useTurnHint(!!(card && cur));
  return <Stage eyebrow={tr2({ uz: "Tekshiruvchi stoli · 🔍", ru: "Стол проверяющего · 🔍" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorP} label={done || isMentorP ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `Yana ${left} kartani baholang`, ru: `Оцените ещё: ${left}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="peer-top">
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{tr2({ uz: <>Uch kartani <span className="italic" style={{ color: T.accent }}>tekshiring</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Проверьте</span> три карточки.</> })}</h2>
          {!done && <span className="peer-prog fade-up"><span className="peer-dots">{PEER_CARDS.map((_, i) => <i key={i} className={`peer-dot ${i <= idx ? "on" : ""}`} />)}</span>{idx + 1}/{PEER_CARDS.length}</span>}
        </div>
        <Mentor>{done ? tr2({ uz: <>Mana, uchala javobingiz yonma-yon.</>, ru: <>Вот все три ваших ответа рядом.</> }) : tr2({ uz: <>Har kartani o'qing va <b style={{ color: T.ink }}>✓ To'g'ri</b> yoki <b style={{ color: T.ink }}>✕ Noto'g'ri</b>ga ajrating.</>, ru: <>Прочитайте каждую карточку и отнесите её к <b style={{ color: T.ink }}>✓ Верно</b> или <b style={{ color: T.ink }}>✕ Неверно</b>.</> })}</Mentor>
        {card && <>
            <div key={idx} className="peer-big fade-step">
              <p className="peer-sent">{tr2({
    uz: <>Men <b style={{ color: T.blue }}>{tr2(card.kim)}</b> sifatida, <b style={{ color: "#B77A16" }}>{tr2(card.nima)}</b>ni xohlayman, <b style={{ color: T.success }}>{tr2(card.natija)}</b> uchun.</>,
    ru: <>Я как <b style={{ color: T.blue }}>{tr2(card.kim)}</b>, хочу <b style={{ color: "#B77A16" }}>{tr2(card.nima)}</b>, чтобы <b style={{ color: T.success }}>{tr2(card.natija)}</b>.</>
  })}</p>
            </div>
            <div className="peer-acts">
              <button type="button" className={`peer-vbtn yes ${cur && cur.ok ? "on" : ""}${waveCls(verdictHint, 0, 2)}`} onClick={() => choose(true)} disabled={!!cur}>✓ {tr2({ uz: "To'g'ri", ru: "Верно" })}</button>
              <button type="button" className={`peer-vbtn no ${cur && !cur.ok ? "on" : ""} ${asking ? "armed" : ""}${waveCls(verdictHint, 1, 2)}`} onClick={() => choose(false)} disabled={!!cur}>✕ {tr2({ uz: "Noto'g'ri", ru: "Неверно" })}</button>
            </div>
            {asking && !cur && <div className="peer-why fade-step">
                <span className="peer-why-l">{tr2({ uz: "Kamchiligi nimada?", ru: "В чём недостаток?" })}</span>
                {PEER_REASONS.map((r, ri) => <button key={r.key} type="button" className={`peer-chip${waveCls(reasonHint, ri, PEER_REASONS.length)}`} onClick={() => commit({ ok: false, reason: r.key })}>{tr2(r.t)}</button>)}
              </div>}
            {cur && fb && <div className="peer-fb fade-step">
                <p className={`peer-fb-t ${fb.good ? "good" : ""}`}>{fb.good ? "✅" : "💡"} {fb.t}</p>
                <button type="button" className={`btn-soft peer-go${goHint ? " turn-ring" : ""}`} onClick={goNext}>{idx + 1 < PEER_CARDS.length ? tr2({ uz: "Keyingisi ▸", ru: "Следующая ▸" }) : tr2({ uz: "Xulosa ▸", ru: "Итог ▸" })}</button>
              </div>}
          </>}
        {done && <div className="peer-sum fade-step">
            {PEER_CARDS.map((c, i) => {
    const v = verdicts[i];
    if (!v) return null;
    const exact = c.ok ? v.ok : !v.ok && v.reason === c.flaw;
    const rr = v.ok ? null : PEER_REASONS.find((r) => r.key === v.reason);
    return <div key={i} className="peer-srow">
                  <span className="peer-snom">{tr2({ uz: `${i + 1}-karta`, ru: `Карточка ${i + 1}` })}</span>
                  <span className="peer-sv">{v.ok ? tr2({ uz: "✓ to'g'ri", ru: "✓ верно" }) : tr2({ uz: `✕ noto'g'ri — ${rr ? tr2(rr.t) : "tuzatish kerak"}`, ru: `✕ неверно — ${rr ? tr2(rr.t) : "нужно поправить"}` })}</span>
                  <span className="peer-sm" title={exact ? tr2({ uz: "Aniq topdingiz", ru: "Попали точно" }) : tr2({ uz: "Izohini ko'rdingiz", ru: "Вы увидели пояснение" })}>{exact ? "✅" : "💡"}</span>
                </div>;
  })}
            {
    /* F-0725-02: «shu ko'z bilan qarang» ko'chma ma'nosi olib tashlandi — harakat-tili (42-qonun): nima qilish + nimani qidirish. */
  }
            <p className="peer-close">{tr2({ uz: "Endi o'z hikoyangizda ham shu kamchiliklarni qidiring.", ru: "Теперь поищите эти же недостатки в своей истории." })}</p>
          </div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr2({ uz: "🔍 Uch kartani baholaganlar", ru: "🔍 Кто оценил три карточки" })} />
        <MentorNote>{tr2({ uz: "Har javobdan keyin bitta savol bering: «Nega shunday ajratdingiz?» — sabab javobning o'zidan qimmatroq. To'liq karta — o'rtadagi 2-karta (qidiruv qatori hikoyasi), qolgan ikkitasida kamchilik bor.", ru: "После каждого ответа задайте один вопрос: «Почему вы так решили?» — причина ценнее самого ответа. Полная карточка — вторая, в середине (история про строку поиска), в двух других есть недостатки." })}</MentorNote>
      </div>
    </Stage>;
};
var BT_REQS = [
  {
    id: "quruq",
    tag: { uz: "1-so'rov · quruq", ru: "1-я просьба · сухая" },
    txt: { uz: "«Saytga video qo'shib qo'ying.»", ru: "«Добавьте на сайт видео.»" },
    kim: null,
    nima: { uz: "video (qanaqasi?)", ru: "видео (какое?)" },
    natija: null,
    fail: 0,
    guess: { uz: "Kim so'rayapti? Yozilmagan — taxmin qilaman…", ru: "Кто просит? Не написано — буду гадать…" },
    out: { uz: "Taxmin qilishga to'g'ri keldi: bosh sahifaga tasodifiy video tushdi. Mijoz esa darsni qayta ko'rishni kutgan edi — qilingan ish bekor ketdi.", ru: "Пришлось гадать: на главную попало случайное видео. А клиент ждал возможности пересмотреть урок — работа ушла впустую." },
    ok: false
  },
  {
    id: "yarim",
    tag: { uz: "2-so'rov · yarim hikoya", ru: "2-я просьба · половина истории" },
    txt: { uz: "«Men o'quvchi sifatida, darsni qayta ko'rishni xohlayman»", ru: "«Я как ученик, хочу пересмотреть урок»" },
    kim: { uz: "o'quvchi", ru: "ученик" },
    nima: { uz: "darsni qayta ko'rish", ru: "пересмотреть урок" },
    natija: null,
    fail: 2,
    guess: { uz: "Nega kerakligi aytilmagan — shunchaki qo'shib qo'yaman…", ru: "Зачем это нужно — не сказано, просто добавлю…" },
    out: { uz: "«Darsni qayta ko'rish» tugmasi qo'shildi, lekin nega kerakligi noma'lum bo'lgani uchun sahifaning eng pastiga tushib qoldi — o'quvchi uni topolmadi.", ru: "Кнопку «Пересмотреть урок» добавили, но, раз неизвестно зачем она нужна, её поставили в самый низ страницы — ученик её не нашёл." },
    ok: false
  },
  {
    id: "toliq",
    tag: { uz: "3-so'rov · to'liq hikoya", ru: "3-я просьба · полная история" },
    txt: { uz: "«Men imtihonga tayyorlanayotgan o'quvchi sifatida, darsni qayta ko'rishni xohlayman — mavzuni o'zim tushunib olishim uchun»", ru: "«Я как ученик, который готовится к экзамену, хочу пересмотреть урок — чтобы разобраться в теме самому»" },
    kim: { uz: "imtihonga tayyorlanayotgan o'quvchi", ru: "ученик, который готовится к экзамену" },
    nima: { uz: "darsni qayta ko'rish", ru: "пересмотреть урок" },
    natija: { uz: "mavzuni o'zim tushunib olishim", ru: "разобраться в теме самому" },
    fail: -1,
    guess: null,
    out: { uz: "Uchala bo'lak aniq — «Darsni qayta ko'rish» tugmasi aynan video ostiga qo'yildi. Mijoz kutgani shu edi!", ru: "Все три части ясны — кнопку «Пересмотреть урок» поставили прямо под видео. Клиент ждал именно этого!" },
    ok: true
  }
];
var BT_PARTS = [[{ uz: "KIM", ru: "КТО" }, "kim"], [{ uz: "NIMA", ru: "ЧТО" }, "nima"], [{ uz: "NATIJA", ru: "РЕЗУЛЬТАТ" }, "natija"]];
var ScreenClinic = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorB = !!(live && live.mode === "mentor");
  const [tried, setTried] = useState2(() => new Set(storedAnswer?.tried || []));
  const [sel, setSel] = useState2(null);
  const [phase, setPhase] = useState2("idle");
  const [step, setStep] = useState2(-1);
  const timer = useRef2(null);
  useEffect2(() => () => clearTimeout(timer.current), []);
  const req = BT_REQS.find((r) => r.id === sel) || null;
  const done = tried.has("quruq") && tried.has("toliq");
  useEffect2(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, tried: [...tried] });
  }, [done]);
  const pend = BT_REQS.map((r) => r.id).filter((id) => !tried.has(id));
  const lit = useTurnWalk(pend, phase !== "read" && (!sel || phase === "out"));
  const sendHint = useTurnHint(!!sel && phase === "idle");
  const pick = (id) => {
    if (phase === "read") return;
    clearTimeout(timer.current);
    setSel(id);
    setPhase("idle");
    setStep(-1);
  };
  const send = () => {
    if (!req || phase === "read") return;
    setPhase("read");
    setStep(-1);
    const walk = (i) => {
      setStep(i);
      if (req.fail === i || i >= 2) {
        timer.current = setTimeout(() => {
          setPhase("out");
          setTried((prev) => {
            const n = new Set(prev);
            n.add(req.id);
            return n;
          });
        }, req.fail === i ? 1100 : 800);
        return;
      }
      timer.current = setTimeout(() => walk(i + 1), 800);
    };
    timer.current = setTimeout(() => walk(0), 350);
  };
  const reading = phase === "read";
  return <Stage eyebrow={tr2({ uz: "So'rov-sinovi 🛠", ru: "Испытание просьб 🛠" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorB} label={done || isMentorB ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Quruq va to'liq so'rovni sinab ko'ring", ru: "Испытайте сухую и полную просьбу" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qaysi hikoyadan <span className="italic" style={{ color: T.accent }}>yaxshi natija</span> chiqadi?</>, ru: <>Из какой истории выйдет <span className="italic" style={{ color: T.accent }}>хороший результат</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>So'rov qanday yozilgani natijani o'zgartiradi. Mana shu uchta so'rov bitta narsa haqida, lekin turlicha yozilgan — birini tanlab <b style={{ color: T.ink }}>«Sinab ko'rish»</b>ni bosing va farqni o'zingiz ko'ring.</>, ru: <>От того, как написана просьба, зависит результат. Три просьбы ниже — об одном и том же, но написаны по-разному: выберите одну, нажмите <b style={{ color: T.ink }}>«Испытать»</b> и увидите разницу сами.</> })}</Mentor>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "So'rovlar — birini tanlang", ru: "Просьбы — выберите одну" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {BT_REQS.map((r) => {
    const on = sel === r.id;
    const was = tried.has(r.id);
    return <button key={r.id} className={`bt-req ${on ? "on" : ""}${turnCls(lit, r.id, pend.length > 1)}`} disabled={reading} onClick={() => pick(r.id)}>
                    <span className="bt-req-tag">{tr2(r.tag)}{was && <span className="bt-req-done">✓ {tr2({ uz: "sinaldi", ru: "испытано" })}</span>}</span>
                    <span className="bt-req-txt">{tr2(r.txt)}</span>
                  </button>;
  })}
            </div>
            <button className={`bt-send${sendHint ? " turn-ring go" : ""}`} onClick={send} disabled={!sel || reading} style={{ alignSelf: "flex-start" }}>
              {reading ? tr2({ uz: "⏳ O'qilmoqda…", ru: "⏳ Читает…" }) : tr2({ uz: "▶️ Sinab ko'rish", ru: "▶️ Испытать" })}
            </button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "So'rov o'qilmoqda", ru: "Просьбу читают" })}</p>
            <div className="bt-desk fade-up delay-2">
              <div className="bt-desk-top"><span className="bt-dev" aria-hidden="true">🧑‍💻</span><span className="bt-dev-name">{tr2({ uz: "Ish stoli", ru: "Рабочий стол" })}</span><span className="bt-desk-t">{!req ? tr2({ uz: "so'rov kutilmoqda…", ru: "ждём просьбу…" }) : reading ? tr2({ uz: "o'qilmoqda…", ru: "читает…" }) : phase === "out" ? tr2({ uz: "ish tugadi", ru: "работа готова" }) : tr2({ uz: "so'rov keldi — «Sinab ko'rish»ni bosing", ru: "просьба пришла — нажмите «Испытать»" })}</span></div>
              <div className="bt-parts">
                {BT_PARTS.map(([lbl, k], i) => {
    const val = req ? req[k] : null;
    const seen = req && phase !== "idle" && step >= i;
    const bad = seen && req.fail === i;
    const okP = seen && !bad && val;
    const cur = reading && step === i;
    return <div key={k} className={`bt-part p${i} ${bad ? "bad" : okP ? "ok" : ""} ${cur ? "cur" : ""}`}>
                      <span className="bt-part-lbl">{tr2(lbl)}</span>
                      <span className="bt-part-val">{seen ? tr2(val) || tr2({ uz: "— yo'q —", ru: "— нет —" }) : "?"}</span>
                    </div>;
  })}
              </div>
              {phase === "out" && req && !req.ok && <p className="bt-guess">💭 {tr2(req.guess)}</p>}
              {phase === "out" && req && req.ok && <Confetti />}
              {phase === "out" && req && <div className={req.ok ? "frame-success fade-step" : "frame-warn fade-step"}>
                  <p className="body" style={{ margin: 0, color: T.ink }}>{tr2(req.out)}</p>
                </div>}
            </div>
            {done && <div className="done-mini fade-step">{tr2({ uz: "✅ Farqni ko'rdingiz!", ru: "✅ Вы увидели разницу!" })} <span className="dm-sub">{tr2({ uz: "— to'liq hikoya aniq yo'nalishni ko'rsatadi, taxmin qilishga o'rin qolmaydi", ru: "— полная история задаёт точное направление, гадать больше не нужно" })}</span></div>}
          </Col>
        </div>
      </div>
    </Stage>;
};
var PRIORITY_KEY = "pm-m3d2-priority";
var PD_LEVELS = [
  { k: "p1", t: { uz: "🔥 Eng muhim", ru: "🔥 Самое важное" }, sub: { uz: "birinchi qilinadi", ru: "делается первым" } },
  { k: "p2", t: { uz: "⚡ Keyingisi", ru: "⚡ Следующее" }, sub: { uz: "navbatda", ru: "в очереди" } },
  { k: "p3", t: { uz: "🌱 Keyinroq", ru: "🌱 Попозже" }, sub: { uz: "shoshilinch emas", ru: "не срочно" } }
];
var PD_OLD = { hozir: "p1", keyin: "p2", keyinroq: "p3" };
var ScreenPriority = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorPr = !!(live && live.mode === "mentor");
  const [stories] = useState2(() => {
    const s = readFullStories();
    return s.length ? s : DEMO_STORIES;
  });
  const [isDemo] = useState2(() => readFullStories().length === 0);
  const [st, setSt] = useState2(() => {
    let saved = storedAnswer?.assign;
    if (!saved) {
      try {
        saved = JSON.parse(localStorage.getItem(PRIORITY_KEY) || "null");
      } catch {
        saved = null;
      }
    }
    const assign2 = {};
    Object.entries(saved || {}).forEach(([i, v]) => {
      const nv = PD_OLD[v] || v;
      if (PD_LEVELS.some((c) => c.k === nv) && !Object.values(assign2).includes(nv)) assign2[i] = nv;
    });
    const restored = stories.every((_, i) => assign2[i]);
    return { assign: assign2, sel: -1, shakeCol: null, done: !!(storedAnswer && storedAnswer.solved) || restored };
  });
  const { assign, sel, shakeCol, done } = st;
  useEffect2(() => {
    if (done && storedAnswer === void 0) {
      onAnswer(screen, { stage: "priority", screenIdx: screen, assign: st.assign, solved: true, correct: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "priority", 0, true, 0);
    }
  }, []);
  const allPlaced = stories.every((_, i) => assign[i]);
  const colItems = (k) => stories.map((_, i) => i).filter((i) => assign[i] === k);
  const pickStory = (i) => setSt((prev) => ({ ...prev, sel: prev.sel === i ? -1 : i, shakeCol: null }));
  const tryCol = (k) => {
    if (sel < 0) return;
    const inCol = colItems(k).filter((i) => i !== sel).length;
    if (inCol >= 1) {
      setSt((prev) => ({ ...prev, shakeCol: k }));
      setTimeout(() => setSt((prev) => prev.shakeCol === k ? { ...prev, shakeCol: null } : prev), 480);
      return;
    }
    const next = { ...assign, [sel]: k };
    try {
      localStorage.setItem(PRIORITY_KEY, JSON.stringify(next));
    } catch {
    }
    const nowDone = stories.every((_, i) => next[i]);
    if (nowDone && !done) {
      onAnswer(screen, { stage: "priority", screenIdx: screen, assign: next, solved: true, correct: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "priority", 0, true, 0);
    }
    setSt((prev) => ({ ...prev, assign: next, sel: -1, done: prev.done || nowDone }));
  };
  const topIdx = colItems("p1")[0];
  const trayTurn = useTurnHint(sel < 0 && !allPlaced);
  const colTurn = useTurnHint(sel >= 0);
  return <Stage eyebrow={tr2({ uz: "Muhimlik darajalari · 🔥", ru: "Уровни важности · 🔥" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorPr} label={done || isMentorPr ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "🔥 3 hikoyani ajrating", ru: "🔥 Разложите 3 истории" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qaysi hikoya <span className="italic" style={{ color: T.accent }}>eng muhim</span>? Darajasini belgilang</>, ru: <>Какая история <span className="italic" style={{ color: T.accent }}>самая важная</span>? Отметьте её уровень</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Siz 3 ta hikoya yozdingiz — lekin uchalasini birdaniga qurib bo'lmaydi, shuning uchun eng muhimi birinchi qilinadi; buni <b style={{ color: T.ink }}>navbat belgilash</b> (prioritet) deyiladi. Hikoyani bosib tanlang, keyin unga mos darajani bosing.</>, ru: <>Вы написали 3 истории — но все три сразу не построишь, поэтому первой делают самую важную; это называют <b style={{ color: T.ink }}>расстановкой очереди</b> (приоритет). Нажмите на историю, а потом на подходящий ей уровень.</> })}</Mentor>
        {isDemo && <p className="small fade-up" style={{ margin: 0, color: T.ink3, fontStyle: "italic" }}>{tr2({ uz: "Namuna hikoyalar — ustaxonada yozilganlar shu yerda chiqadi.", ru: "Это истории-образцы — здесь появятся те, что вы напишете в мастерской." })}</p>}
        {
    /* F-0727-08: kartalar mentor-gapga yopishib turmasin — belgi-yorliqli LAGANCHA: qizil puls-border
       «bularni joylashtirish kerak» signalini beradi; birinchi karta joylashgach tinchlanadi. */
  }
        {stories.some((_, i) => !assign[i]) && <div className={`pd-tray ${trayTurn ? "" : "calm"}`}>
            <span className="pd-tray-lbl">{tr2({ uz: "✋ Bu 3 hikoyangizni pastdagi darajalarga ajrating", ru: "✋ Разложите эти 3 истории по уровням внизу" })} <span className="pd-tray-arrow">↓</span></span>
            <div className="pd-pool">
              {stories.map((c, i) => assign[i] ? null : <button key={i} className={`pd-card ${sel === i ? "sel" : ""}`} onClick={() => pickStory(i)}>
                  <span className="pd-card-n">{i + 1}</span>
                  <span className="pd-card-txt"><b style={{ color: T.blue }}>{tr2(c.kim)}</b> — {tr2(c.nima)}</span>
                </button>)}
            </div>
          </div>}
        <div className="ms-list fade-up delay-2">
          {PD_LEVELS.map((col, di) => {
    const items = colItems(col.k);
    const full = items.length >= 1;
    return <div key={col.k} className={`ms-row ${col.k} ${shakeCol === col.k ? "shake" : ""} ${sel >= 0 && !full ? "targetable" : ""}${waveCls(colTurn && !full, di, 3)}`} onClick={() => tryCol(col.k)} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === "Enter") tryCol(col.k);
    }}>
                <div className="ms-h"><span className="ms-t">{tr2(col.t)}</span><span className="ms-sub">{tr2(col.sub)}</span></div>
                {items.length ? items.map((i) => <button key={i} className={`pd-card placed ${sel === i ? "sel" : ""}`} onClick={(e) => {
      e.stopPropagation();
      pickStory(i);
    }}>
                    <span className="pd-card-n">{i + 1}</span>
                    <span className="pd-card-txt"><b style={{ color: T.blue }}>{tr2(stories[i].kim)}</b> — {tr2(stories[i].nima)}</span>
                  </button>) : <div className="ms-empty">{col.k === "p1" ? tr2({ uz: "eng muhim hikoya shu yerga", ru: "сюда — самую важную историю" }) : col.k === "p2" ? tr2({ uz: "keyingisi shu yerga", ru: "сюда — следующую" }) : tr2({ uz: "keyinroq qilinadigani shu yerga", ru: "сюда — то, что можно позже" })}</div>}
              </div>;
  })}
        </div>
        {allPlaced && topIdx !== void 0 && <div className="done-mini fade-step">{tr2({ uz: "✅ Ajratildi!", ru: "✅ Разложено!" })} <span className="dm-sub">{tr2({ uz: "— eng muhim vazifangiz:", ru: "— ваша самая важная задача:" })} «{tr2(stories[topIdx].nima)}» 🔥</span></div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr2({ uz: "🔥 Ajratib bo'lganlar", ru: "🔥 Кто разложил" })} />
        <MentorNote>{tr2({ uz: "Joylashgan kartani bosib boshqa darajaga ko'chirsa bo'ladi. «Eng muhim» talashib qolganlarga savol: qaysi hikoya foydalanuvchiga ENG katta foydani beradi? Javob — o'sha birinchi.", ru: "Уже разложенную карточку можно нажать и перенести на другой уровень. Тем, кто спорит про «самое важное», задайте вопрос: какая история даёт пользователю САМУЮ большую пользу? Она и идёт первой." })}</MentorNote>
      </div>
    </Stage>;
};
var TestQ = ({ ask, story }) => <div className="tq">
    <h2 className="tq-ask">{ask}</h2>
    <div className="tq-card"><p className="tq-story">«{story}»</p></div>
  </div>;
var Screen7 = (props) => <QuestionScreen
  {...props}
  eyebrow={tr2({ uz: "Tekshiruv · hikoya 1", ru: "Проверка · история 1" })}
  scope="module-mikro"
  ctaLabel={tr2({ uz: "Javobni tanlang", ru: "Выберите ответ" })}
  revealPrefix={tr2({ uz: "To'g'ri javob", ru: "Верный ответ" })}
  question={<TestQ
    ask={tr2({ uz: "Bu hikoyada qaysi bo'lak yetishmayapti? Tanlang.", ru: "Какой части не хватает в этой истории? Выберите." })}
    story={tr2({ uz: "Men foydalanuvchi sifatida, qizil tugma xohlayman.", ru: "Я как пользователь, хочу красную кнопку." })}
  />}
  questionText={tr2({ uz: "Hikoya 1: qizil tugma", ru: "История 1: красная кнопка" })}
  options={[tr2({ uz: "KIM bo'lagi — foydalanuvchi turi", ru: "Часть КТО — тип пользователя" }), tr2({ uz: "NIMA bo'lagi — harakat", ru: "Часть ЧТО — действие" }), tr2({ uz: "NATIJA bo'lagi — real foyda", ru: "Часть РЕЗУЛЬТАТ — реальная польза" })]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri — NATIJA umuman yo'q: «qizil tugma» harakat, lekin foydalanuvchi undan qanday foyda olishi aytilmagan. Yana bir kamchilik: KIM ham aniq emas («foydalanuvchi» — qaysi turi?).", ru: "Верно — РЕЗУЛЬТАТА нет совсем: «красная кнопка» — это действие, но не сказано, какую пользу пользователь из него получит. Есть и второй недостаток: КТО тоже неконкретен («пользователь» — какой именно?)." })}
  explainWrong={{ 0: tr2({ uz: "KIM bor — «foydalanuvchi» (aniq bo'lmasa ham yozilgan). Yetishmayotgani — NATIJA: harakatdan keyin nima foyda?", ru: "КТО есть — «пользователь» (пусть и неконкретно, но написан). Не хватает РЕЗУЛЬТАТА: какая польза после действия?" }), 1: tr2({ uz: "NIMA bor — «qizil tugma xohlayman». Yetishmayotgani — NATIJA: undan keyin nima foyda?", ru: "ЧТО есть — «хочу красную кнопку». Не хватает РЕЗУЛЬТАТА: какая от этого польза?" }), default: tr2({ uz: "NATIJA (real foyda) yetishmaydi — oxirgi variantni tanlang.", ru: "Не хватает РЕЗУЛЬТАТА (реальной пользы) — выберите последний вариант." }) }}
/>;
var Screen8 = (props) => <QuestionScreen
  {...props}
  eyebrow={tr2({ uz: "Tekshiruv · hikoya 2", ru: "Проверка · история 2" })}
  scope="module-mikro"
  ctaLabel={tr2({ uz: "Javobni tanlang", ru: "Выберите ответ" })}
  revealPrefix={tr2({ uz: "To'g'ri javob", ru: "Верный ответ" })}
  question={<TestQ
    ask={tr2({ uz: "Bu hikoyada qaysi bo'lak oldingisini takrorlaydi? Tanlang.", ru: "Какая часть этой истории повторяет предыдущую? Выберите." })}
    story={tr2({ uz: "Men mehmon sifatida, saytga kirishni xohlayman, saytga kirish uchun.", ru: "Я как гость, хочу войти на сайт, чтобы войти на сайт." })}
  />}
  questionText={tr2({ uz: "Hikoya 2: saytga kirish", ru: "История 2: вход на сайт" })}
  options={[tr2({ uz: "Men mehmon sifatida", ru: "Я как гость" }), tr2({ uz: "saytga kirishni xohlayman", ru: "хочу войти на сайт" }), tr2({ uz: "saytga kirish uchun", ru: "чтобы войти на сайт" })]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri — «saytga kirish uchun» harakatning takrori, foyda aytilmagan. To'g'ri varianti, masalan: «buyurtmamni tez topish uchun».", ru: "Верно — «чтобы войти на сайт» повторяет действие, польза не названа. Правильно было бы, например: «чтобы быстро найти свой заказ»." })}
  explainWrong={{ 0: tr2({ uz: "KIM aniq («mehmon») — bu joyi to'g'ri. Xato NATIJA'da: u harakatni takrorlaydi. Oxirgi variantni tanlang.", ru: "КТО конкретен («гость») — здесь всё верно. Ошибка в РЕЗУЛЬТАТЕ: он повторяет действие. Выберите последний вариант." }), 1: tr2({ uz: "NIMA to'g'ri yozilgan. Muammo — NATIJA harakatni takrorlaydi. Oxirgi variantni tanlang.", ru: "ЧТО написано верно. Проблема в том, что РЕЗУЛЬТАТ повторяет действие. Выберите последний вариант." }), default: tr2({ uz: "NATIJA harakatni takrorlaydi (foyda yo'q) — oxirgi variantni tanlang.", ru: "РЕЗУЛЬТАТ повторяет действие (пользы нет) — выберите последний вариант." }) }}
/>;
var Screen9 = (props) => <QuestionScreen
  {...props}
  eyebrow={tr2({ uz: "Tekshiruv · hikoya 3", ru: "Проверка · история 3" })}
  scope="module-mikro"
  ctaLabel={tr2({ uz: "Javobni tanlang", ru: "Выберите ответ" })}
  revealPrefix={tr2({ uz: "To'g'ri javob", ru: "Верный ответ" })}
  question={<TestQ
    ask={tr2({ uz: "Bu gap User Story'mi? Javobni tanlang.", ru: "Эта фраза — User Story? Выберите ответ." })}
    story={tr2({ uz: "Saytda dark mode (qorong'i rejim) bo'lsin.", ru: "Пусть на сайте будет dark mode (тёмная тема)." })}
  />}
  questionText={tr2({ uz: "Dark mode gapi: baho", ru: "Фраза про dark mode: оценка" })}
  options={[tr2({ uz: "Tayyor User Story — o'zgartirish shart emas", ru: "Готовая User Story — менять не нужно" }), tr2({ uz: "Imkoniyat-so'rovi (feature request) — hali hikoya emas", ru: "Заявка на возможность (feature request) — ещё не история" }), tr2({ uz: "JTBD misoli — milkshake'dagi kabi «natija»", ru: "Пример JTBD — «результат», как в истории с коктейлем" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri — bu hali hikoya emas, shunchaki so'rov: unda KIM ham, NATIJA ham yo'q, faqat NIMA aytilgan.", ru: "Верно — это ещё не история, а просто просьба: в ней нет ни КТО, ни РЕЗУЛЬТАТА, названо только ЧТО." })}
  explainWrong={{ 0: tr2({ uz: "Hali tayyor emas: gapda KIM ham, NATIJA ham yo'q — faqat NIMA kerakligi aytilgan. Bunday gapni imkoniyat-so'rovi deymiz.", ru: "Ещё не готова: во фразе нет ни КТО, ни РЕЗУЛЬТАТА — сказано только, ЧТО нужно. Такую фразу называют заявкой на возможность." }), 2: tr2({ uz: "JTBD — odam mahsulotdan kutadigan foydali natija haqidagi g'oya. Bu gap esa oddiy so'rov: unda na KIM bor, na NATIJA.", ru: "JTBD — это идея о полезном результате, которого человек ждёт от продукта. А здесь обычная просьба: ни КТО, ни РЕЗУЛЬТАТА." }), default: tr2({ uz: "Bu — imkoniyat-so'rovi: faqat NIMA kerakligi aytilgan, KIM ham, NATIJA ham yo'q. Hali hikoya emas.", ru: "Это заявка на возможность: сказано только ЧТО нужно, нет ни КТО, ни РЕЗУЛЬТАТА. Ещё не история." }) }}
/>;
var KODING_STARTER = {
  uz: `function hikoyaYasa(kim, nima, natija) {
  // Hikoya qolipi: Men [kim] sifatida, [nima]ni xohlayman, [natija] uchun.
  return '';
}
console.log(hikoyaYasa('yangi mehmon', 'loyihalarni bitta ekranda korish', 'meni tez tanib olishlari'));`,
  ru: `function hikoyaYasa(kim, nima, natija) {
  // Шаблон истории: Я как [kim], хочу [nima], чтобы [natija].
  return '';
}
console.log(hikoyaYasa('новый гость', 'видеть проекты на одном экране', 'меня быстро узнавали'));`
};
var KODING_CONDS = [
  {
    id: "c1",
    label: { uz: "Funksiya to'ldirilgan — bo'sh emas, gap qaytadi", ru: "Функция заполнена — не пустая, возвращает фразу" },
    hint: { uz: "return qatorini to'ldiring: hozir bo'sh matn ('') qaytmoqda.", ru: "Заполните строку return: сейчас возвращается пустой текст ('')." }
  },
  {
    id: "c2",
    label: { uz: "Gap to'g'ri qolipda — «sifatida» · «xohlayman» · «uchun» joyida", ru: "Фраза в правильном шаблоне — «как» · «хочу» · «чтобы» на месте" },
    hint: { uz: "Qolip (orqa-qo'shtirnoq ` ichida): return `Men ${kim} sifatida, ${nima}ni xohlayman, ${natija} uchun.`", ru: "Шаблон (внутри обратных кавычек `): return `Я как ${kim}, хочу ${nima}, чтобы ${natija}.`" }
  },
  {
    id: "c3",
    label: { uz: "O'z 3 hikoyangiz chiqarildi (kamida 3 gap)", ru: "Ваши 3 истории выведены (минимум 3 фразы)" },
    hint: { uz: "hikoyaYasa'ni kamida 3 marta chaqirib, o'z hikoyalaringizni console.log qiling.", ru: "Вызовите hikoyaYasa минимум 3 раза и выведите свои истории через console.log." }
  }
];
var KOD_FILE = "hikoyaYasa.js";
var KOD_PROBE = 'hikoyaYasa("yangi mehmon","loyihalarni bitta ekranda korish","meni tez tanib olishlari")';
var KOD_EVAL_C1 = "(function(){try{var p=" + KOD_PROBE + ';return typeof p==="string"&&p.trim().length>0;}catch(e){return false;}})()';
var KOD_EVAL_C2 = '(function(){try{var S=typeof _str==="function"?_str:String;var H=typeof has==="function"?has:function(h,n){return S(h).indexOf(n)!==-1;};var p=typeof _low==="function"?_low.call(S(' + KOD_PROBE + ")):S(" + KOD_PROBE + ').toLowerCase();return (H(p,"sifatida")&&H(p,"xohlayman")&&H(p,"uchun"))||(H(p,"как")&&H(p,"хочу")&&H(p,"чтобы"));}catch(e){return false;}})()';
var KOD_EVAL_C3 = '(function(){try{var S=typeof _str==="function"?_str:String;var H=typeof has==="function"?has:function(h,n){return S(h).indexOf(n)!==-1;};var LOW=typeof _low==="function"?function(v){return _low.call(S(v));}:function(v){return S(v).toLowerCase();};var n=0;for(var i=0;i<logs.length;i++){var x=LOW(logs[i]);if((H(x,"sifatida")&&H(x,"uchun"))||(H(x,"как")&&H(x,"чтобы")))n++;}return n>=3;}catch(e){return false;}})()';
var mkKodTask = (starter) => ({
  eyebrow: { uz: "Koding · praktika", ru: "Кодинг · практика" },
  title: { uz: "Hikoya qolipini kod o'zi yig'sin", ru: "Пусть код сам собирает шаблон истории" },
  brief: {
    uz: <>Funksiyani to'ldiring: <span className="mono">hikoyaYasa</span> uch bo'lakdan bitta User Story gapini qaytarsin, keyin o'z 3 hikoyangizni <span className="mono">console.log</span> bilan chiqaring. Natija konsolda.</>,
    ru: <>Заполните функцию: <span className="mono">hikoyaYasa</span> должна возвращать из трёх частей одну фразу User Story, а потом выведите свои 3 истории через <span className="mono">console.log</span>. Результат — в консоли.</>
  },
  files: [{ name: KOD_FILE, lang: "js", starter }],
  requirements: [
    { id: "c1", label: KODING_CONDS[0].label, hint: KODING_CONDS[0].hint, eval: KOD_EVAL_C1, equals: "true" },
    { id: "c2", label: KODING_CONDS[1].label, hint: KODING_CONDS[1].hint, eval: KOD_EVAL_C2, equals: "true" },
    { id: "c3", label: KODING_CONDS[2].label, hint: KODING_CONDS[2].hint, eval: KOD_EVAL_C3, equals: "true" }
  ]
});
var KODING_KEY = "pm-m3d2-koding";
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
var ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === "mentor");
  const isSelf = !live || live.mode === "self";
  const [open, setOpen] = useState2(() => {
    const s = readKoding();
    return !!(s && s.open);
  });
  const [st, setSt] = useState2(() => {
    const saved = readKoding();
    return {
      code: storedAnswer?.code || saved && saved.code || "",
      done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done)
    };
  });
  const { code, done } = st;
  useEffect2(() => {
    if (done && storedAnswer === void 0) {
      onAnswer(screen, { stage: "koding", screenIdx: screen, code: st.code, solved: true, correct: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "koding", 0, true, 0);
    }
  }, []);
  const kodTask = useMemo2(() => mkKodTask(code || KODING_STARTER), []);
  const finishPractice = ({ codes }) => {
    const newCode = codes && codes[KOD_FILE] || code;
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
  const myStories = readFullStories().slice(0, 1);
  const previewStories = myStories.length ? myStories : DEMO_STORIES.slice(0, 1);
  const launchTurn = useTurnHint(!done && !open);
  return <Stage eyebrow={tr2({ uz: "Koding · 🛠 kompilyator", ru: "Кодинг · 🛠 компилятор" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval kompilyatorda bajaring", ru: "Сначала выполните в компиляторе" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Hikoyangizni kartaga aylantiradigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который превратит вашу историю в карточку</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Diqqat qiling: hikoyalarni allaqachon yozdik — <b style={{ color: T.ink }}>kod esa endi yoziladi</b>. Ish har doim shu tartibda: avval kimga nima kerakligini bilamiz, keyin qura boshlaymiz. Endi <span className="mono">hikoyaYasa</span> funksiyasini to'ldirasiz — u har hikoyangizni tayyor kartaga aylantiradi.</>, ru: <>Обратите внимание: истории мы уже написали — <b style={{ color: T.ink }}>а код пишется только сейчас</b>. Работа всегда идёт в таком порядке: сначала узнаём, кому что нужно, потом начинаем строить. Теперь вы заполните функцию <span className="mono">hikoyaYasa</span> — она превратит каждую вашу историю в готовую карточку.</> })}</Mentor>
        <div className="kdx fade-up delay-1">
          <div className="kdx-fn">
            <span className="kdx-fn-bar"><span className="bb-dots"><i /><i /><i /></span>hikoyaYasa.js</span>
            <code className="kdx-fn-code">hikoyaYasa(<span className="kx-kim">kim</span>, <span className="kx-nima">nima</span>, <span className="kx-natija">natija</span>)</code>
          </div>
          <span className="kdx-arrow" aria-hidden="true">➜</span>
          <div className="kdx-out">
            {previewStories.map((s, i) => <div key={i} className="kdx-card" style={{ "--kd": `${0.5 + i * 0.3}s` }}>
                <span className="hc-prev-badge">User Story</span>
                {tr2({ uz: <>Men <b>{tr2(s.kim)}</b> sifatida, <b>{tr2(s.nima)}</b>ni xohlayman, <b>{tr2(s.natija)}</b> uchun.</>, ru: <>Я как <b>{tr2(s.kim)}</b>, хочу <b>{tr2(s.nima)}</b>, чтобы <b>{tr2(s.natija)}</b>.</> })}
              </div>)}
          </div>
        </div>
        <div className="kdx-cta fade-up delay-2">
          <button className={`kod-launch-btn${launchTurn ? "" : " calm"}`} onClick={() => {
    setOpen(true);
    writeKodingOpen(true);
  }}>{done ? tr2({ uz: "↻ Kompilyatorni qayta ochish", ru: "↻ Открыть компилятор заново" }) : tr2({ uz: "🛠 Kompilyatorni ochish", ru: "🛠 Открыть компилятор" })}</button>
          {done && <span className="kdx-cta-sub">{tr2({ uz: "Bajarildi — xohlasangiz kodni yana yaxshilang", ru: "Выполнено — при желании доработайте код" })}</span>}
          {
    /* 🔓 TAKRORLASH-YO'LI (89-qonun) — FAQAT erkin rejimda va FAQAT bajarilmagan holatda.
       Nima uchun: bajarilgan praktika brauzer xotirasiga yoziladi va qaytib kelganda darvoza
       o'zi ochiq bo'ladi. Lekin bola sinfda BOSHQA qurilmada bajargan bo'lsa, buni dastur
       BILA OLMAYDI (login yo'q, PIN esa dars tugagach yopiladi) — bu darsda hikoyalari ham
       o'sha qurilmada qolgan bo'ladi. O'sha yagona holat uchun — o'zidan so'raymiz.
       🔴 Bu havola FAQAT eshikni ochadi: nishon bermaydi, «bajarildi» deb yozmaydi,
       serverga signal yubormaydi, xotiraga saqlamaydi. Jonli darsda ko'rinmaydi.
       Puls ham olmaydi — navbat «Kompilyatorni ochish» tugmasida (88-qonun (a)). */
  }
          {!done && isSelf && <button className="kdx-skip" onClick={onNext}>{tr2({ uz: "✓ Bu mashqni sinfda bajarganman — davom etish →", ru: "✓ Это задание я делал(а) в классе — продолжить →" })}</button>}
        </div>
        <div className="takeaway fade-up delay-2"><span className="ta-bulb">📌</span><p className="ta-h">{tr2({ uz: "User Story kod yozishdan OLDIN yoziladi — avval «kimga nima kerak»ni bilamiz, keyin quramiz.", ru: "User Story пишут ДО кода — сначала узнаём, «кому что нужно», потом строим." })}</p></div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: "center" }}>{tr2({ uz: "✅ Ishladi!", ru: "✅ Заработало!" })} <span className="dm-sub">{tr2({ uz: "— 3 hikoyangiz koddan karta bo'lib chiqdi", ru: "— ваши 3 истории вышли из кода карточками" })}</span></div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr2({ uz: "🛠 Kodni yozib bo'lganlar", ru: "🛠 Кто дописал код" })} />
      </div>
      {open && <div style={{ position: "fixed", inset: 0, zIndex: 2e3, background: T.bg }}>
          <HtmlCompiler_default lang={__lang2} task={kodTask} storageKey={`${KODING_KEY}:code`} onContinue={finishPractice} onBack={() => {
    setOpen(false);
    writeKodingOpen(false);
  }} />
        </div>}
    </Stage>;
};
var REFLECT_KEY = "pm-m3d2-reflection";
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
          <div className={`pair-ring ${isA ? "a" : "b"}`}>
            <svg width="82" height="82" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r={R} fill="none" stroke={T.line} strokeWidth="7" />
              <circle cx="44" cy="44" r={R} fill="none" stroke={isA ? T.accent : T.success} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 44 44)" style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div className="pair-ring-mid"><span className={`pair-ring-who ${isA ? "" : "b"}`}>{isA ? "A" : "B"}</span><span className="pair-ring-sec">{phaseLeft}s</span></div>
          </div>
          <div className="pair-live-txt">
            <span className="pair-now">{tr2({ uz: "Hozir ", ru: "Сейчас говорит " })}<span className={`pair-who ${isA ? "" : "b"}`}>{isA ? "A" : "B"}</span>{tr2({ uz: " gapiradi", ru: "" })}</span>
            <span className="pair-next">{isA ? tr2({ uz: "keyin — B navbati", ru: "потом — очередь B" }) : tr2({ uz: "oxirgi navbat", ru: "последняя очередь" })}</span>
          </div>
        </div> : <p className="pair-now" style={{ margin: 0 }}>{st.done ? tr2({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: "✓ Время вышло — рассказали оба. Молодцы!" }) : tr2({ uz: "Har biringizga 30 soniyadan — avval A, keyin B.", ru: "По 30 секунд каждому — сначала A, потом B." })}</p>}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? "btn-soft" : `pair-start${startTurn ? "" : " calm"}`} onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? tr2({ uz: "↻ Yana 1 daqiqa", ru: "↻ Ещё 1 минута" }) : tr2({ uz: "▶ 1 daqiqani boshlash", ru: "▶ Запустить минуту" })}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>{tr2({ uz: "⏹ To'xtatish", ru: "⏹ Остановить" })}</button>}
      </div>
    </div>;
}
var Screen11 = ({ screen, onNext, onPrev }) => {
  const [text, setText] = useState2(() => {
    try {
      return localStorage.getItem(REFLECT_KEY) || "";
    } catch {
      return "";
    }
  });
  const save = (v) => {
    setText(v);
    try {
      localStorage.setItem(REFLECT_KEY, v);
    } catch {
    }
  };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState2("idle");
  const [reflFocus, setReflFocus] = useState2(false);
  const inputTurn = useTurnHint(pairStage === "done" && !written && !reflFocus);
  return <Stage eyebrow={tr2({ uz: "Mustahkamlash · 2 qadam", ru: "Закрепление · 2 шага" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Eng muhim hikoyangizni <span className="italic" style={{ color: T.accent }}>yoddan</span> aytib bera olasizmi?</>, ru: <>Сможете рассказать свою главную историю <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Dars deyarli tugadi — endi eng muhim hikoyangizni yoddan aytib berasiz: <b style={{ color: T.ink }}>KIM</b> uchun yozdingiz va u qanday <b style={{ color: T.ink }}>foyda</b> oladi? <span style={{ whiteSpace: "nowrap" }}>«▶ 1 daqiqani boshlash»</span> tugmasini bosing — avval siz sherigingizga aytasiz, keyin u sizga.</>, ru: <>Урок почти закончен — теперь расскажите свою главную историю по памяти: для <b style={{ color: T.ink }}>КОГО</b> вы её написали и какую <b style={{ color: T.ink }}>пользу</b> он получит? Нажмите <span style={{ whiteSpace: "nowrap" }}>«▶ Запустить минуту»</span> — сначала рассказываете вы напарнику, потом он вам.</> })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr2({ uz: "🗣 Sherigingizga ayting: kim uchun, qanday foyda uchun", ru: "🗣 Расскажите напарнику: для кого и ради какой пользы" })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr2({ uz: "✍️ Endi bir qator yozing", ru: "✍️ Теперь напишите одну строку" })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? " turn-ring" : ""}`}>
              <input className="reflect-input" value={text} onChange={(e) => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr2({ uz: "Men ... uchun hikoya yozdim, chunki unga ... kerak edi", ru: "Я написал(а) историю для ..., потому что ему нужно было ..." })} maxLength={160} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr2({ uz: "✓ Yozildi!", ru: "✓ Записано!" })}</p>}
          </div>
        </div>
      </div>
    </Stage>;
};
var HW_KEY = "pm-m3d2-hw-target";
var HW_TARGETS = [
  { id: "dost", t: { uz: "do'st", ru: "друг" } },
  { id: "mentor", t: { uz: "mentor", ru: "ментор" } },
  { id: "mehmon", t: { uz: "birinchi mehmon", ru: "первый гость" } }
];
var hwById = (id) => HW_TARGETS.find((x) => x.id === id) || null;
var readHwTarget = () => {
  try {
    return localStorage.getItem(HW_KEY) || "";
  } catch {
    return "";
  }
};
var HwTaskCard = () => {
  const [st, setSt] = useState2(() => {
    const saved = readHwTarget();
    const preset = hwById(saved);
    return { target: saved, custom: preset ? "" : saved, customMode: !!saved && !preset };
  });
  const { target, custom, customMode } = st;
  const pick = (id) => {
    setSt((prev) => ({ ...prev, target: id, customMode: false }));
    try {
      localStorage.setItem(HW_KEY, id);
    } catch {
    }
  };
  const setCustom = (v) => {
    setSt((prev) => ({ ...prev, custom: v, target: v.trim(), customMode: true }));
    try {
      localStorage.setItem(HW_KEY, v.trim());
    } catch {
    }
  };
  const openCustom = () => setSt((prev) => ({ ...prev, customMode: true, target: prev.custom.trim() }));
  const chosenT = customMode ? (custom || "").trim() : hwById(target) ? tr2(hwById(target).t) : (target || "").trim();
  const chosen = chosenT;
  const pickTurn = useTurnHint(!chosen);
  return <div className="card hw fade-up d4">
      <div className="card-lbl" style={{ color: T.accent }}>📝 {tr2({ uz: <>Uyda <b>kim</b> uchun hikoya yozasiz?</>, ru: <>Для <b>кого</b> напишете историю дома?</> })}</div>
      <p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr2({ uz: <>Uyda endi <b style={{ color: T.ink }}>boshqa foydalanuvchi</b> uchun hikoya yozasiz — ro'yxatdan bittasini tanlang yoki «✍️ o'z variantimni yozaman»ni bosing.</>, ru: <>Дома вы напишете историю уже для <b style={{ color: T.ink }}>другого пользователя</b> — выберите одного из списка или нажмите «✍️ напишу свой вариант».</> })}</p>
      <div className="hw-chips">
        {HW_TARGETS.map((x, ti) => <button key={x.id} className={`hw-chip ${target === x.id && !customMode ? "on" : ""}${waveCls(pickTurn, ti, HW_TARGETS.length + 1)}`} onClick={() => pick(x.id)}>{tr2(x.t)}</button>)}
        <button className={`hw-chip add ${customMode ? "on" : ""}${waveCls(pickTurn, HW_TARGETS.length, HW_TARGETS.length + 1)}`} onClick={openCustom}>✍️ {tr2({ uz: "o'z variantimni yozaman", ru: "напишу свой вариант" })}</button>
      </div>
      {customMode && <input className="reflect-input fade-step" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={tr2({ uz: "masalan: o'qituvchi, ota-ona, ilk mijoz…", ru: "например: учитель, родитель, первый клиент…" })} maxLength={40} autoFocus />}
      {chosen ? <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">🗂 {tr2({ uz: "Topshiriq kartasi", ru: "Карточка задания" })}</span><span className="pmtask-id">US-UY</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">{tr2({ uz: "Kim uchun", ru: "Для кого" })}</span><span className="pmtask-v"><b className="pmtask-val" key={chosen} style={{ color: T.accent }}>{chosen}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr2({ uz: "Nechta hikoya", ru: "Сколько историй" })}</span><span className="pmtask-v"><b>{tr2({ uz: "2 ta yangi", ru: "2 новые" })}</b> <span className="pmtask-sub">{tr2({ uz: "(sinfda 3 ta, uyda 2 ta — jami 5 ta)", ru: "(3 в классе, 2 дома — всего 5)" })}</span></span></div>
            </div>
          <div className="pmtask-steps">
            <span className="pmtask-step"><i>1</i>{tr2({ uz: <><b>{chosen}</b> qanday odam ekanini bir gapda yozing</>, ru: <>Одной фразой опишите, что за человек <b>{chosen}</b></> })}</span>
            <span className="pmtask-step"><i>2</i>{tr2({ uz: "unga 2 ta to'liq hikoya yozing", ru: "напишите для него 2 полные истории" })}</span>
            <span className="pmtask-step"><i>3</i>{tr2({ uz: "5 hikoyadan eng muhim 3 tasini belgilang", ru: "из 5 историй отметьте 3 самые важные" })}</span>
          </div>
        </div> : <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "👆 Avval kim uchun yozishingizni tanlang — topshiriq-karta shunga moslashadi.", ru: "👆 Сначала выберите, для кого будете писать — карточка задания подстроится." })}</p></div>}
    </div>;
};
var ACHIEVEMENTS = {
  storyBuilder: { icon: "📝", name: "Story Pro!", desc: { uz: "Ustaxonada 3/3 User Story yozdingiz", ru: "Вы написали 3/3 User Story в мастерской" } },
  hotspotAce: { icon: "🔎", name: "Nice Catch!", desc: { uz: "3 hikoyadagi xatoni ham to'g'ri topdingiz", ru: "Вы верно нашли ошибку во всех 3 историях" } },
  toolMaker: { icon: "🛠️", name: "Tool Maker!", desc: { uz: "User Story yig'uvchini kod bilan qurdingiz", ru: "Вы собрали кодом сборщик User Story" } },
  graduate: { icon: "🎓", name: "Level Up!", desc: { uz: "User Story darsini yakunladingiz", ru: "Вы прошли урок про User Story" } }
};
var ACH_TRIGGERS = { practice: "storyBuilder", s10: "toolMaker" };
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
var Q_LABELS = { 4: "1 — Hikoya 1", 6: "2 — Hikoya 2", 9: "3 — Hikoya 3" };
var QUIZ_MS = 15e3;
var QZ_BG_SHAPES = [
  { ch: { uz: "KIM", ru: "КТО" }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "NIMA", ru: "ЧТО" }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: "NATIJA", ru: "РЕЗУЛЬТАТ" }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: "JTBD", l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: "sifatida", ru: "как" }, l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: "uchun", ru: "чтобы" }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: "story", l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: "xohlayman", ru: "хочу" }, l: 55, t: 5, s: 20, d: 22, dl: 0.6 },
  { ch: "⭐", l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: "🥤", l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: "🎯", l: 2, t: 30, s: 30, d: 28, dl: 3.1 }
];
var QUIZ_BANK = [
  { q: { uz: "To'g'ri yozilgan User Story qaysi?", ru: "Какая User Story написана верно?" }, opts: [
    { uz: "Men tugmani bosganimda yangi sahifa ochilib, ma'lumot chiqadi", ru: "Когда я нажимаю кнопку, открывается новая страница и выходит информация" },
    { uz: "Agar [shart] bo'lsa, [natija] qil", ru: "Если [условие], то сделай [результат]" },
    { uz: "Men [KIM] sifatida, [NIMA]ni xohlayman, [NATIJA] uchun", ru: "Я как [КТО], хочу [ЧТО], чтобы [РЕЗУЛЬТАТ]" },
    { uz: "[Sana] — [vazifa] — [mas'ul]", ru: "[Дата] — [задача] — [ответственный]" }
  ], correct: 2 },
  { q: { uz: "Hikoyadagi [KIM] bo'lagi nimani bildiradi?", ru: "Что означает часть [КТО] в истории?" }, opts: [
    { uz: "Foydalanuvchi turi", ru: "Тип пользователя" },
    { uz: "Tugmaning rangi", ru: "Цвет кнопки" },
    { uz: "Dasturchi ismi", ru: "Имя программиста" },
    { uz: "Sahifaning to'liq manzili", ru: "Полный адрес страницы" }
  ], correct: 0 },
  { q: { uz: "User Story qachon yoziladi?", ru: "Когда пишут User Story?" }, opts: [
    { uz: "Loyiha topshirilgandan keyin", ru: "После сдачи проекта" },
    { uz: "Kod yozishdan OLDIN", ru: "ДО написания кода" },
    { uz: "Kod yozib bo'lingach, hujjat sifatida", ru: "После кода, как документ" },
    { uz: "Faqat xato chiqqanda", ru: "Только когда появилась ошибка" }
  ], correct: 1 },
  { q: { uz: "[NATIJA] qismi qanday bo'lishi kerak?", ru: "Какой должна быть часть [РЕЗУЛЬТАТ]?" }, opts: [
    { uz: "Yozilgan kod qatorlarining umumiy soni", ru: "Общее число написанных строк кода" },
    { uz: "Tugmaning nomi", ru: "Название кнопки" },
    { uz: "Sahifaning fon rangi", ru: "Цвет фона страницы" },
    { uz: "Foydalanuvchi oladigan real foyda", ru: "Реальная польза для пользователя" }
  ], correct: 3 },
  { q: { uz: "«Men foydalanuvchi sifatida, qizil tugma xohlayman» — nimasi yetishmayapti?", ru: "«Я как пользователь, хочу красную кнопку» — чего здесь не хватает?" }, opts: [
    { uz: "NATIJA (real foyda)", ru: "РЕЗУЛЬТАТА (реальной пользы)" },
    { uz: "KIM", ru: "КТО" },
    { uz: "NIMA", ru: "ЧТО" },
    { uz: "Hech nima — hikoya to'liq", ru: "Ничего — история полная" }
  ], correct: 0 },
  { q: { uz: "Jobs-to-be-Done (JTBD) g'oyasi nima?", ru: "В чём идея Jobs-to-be-Done (JTBD)?" }, opts: [
    { uz: "Ko'proq tugma qo'shish kerak", ru: "Нужно добавлять больше кнопок" },
    { uz: "Kodni tezroq yozish kerak", ru: "Нужно быстрее писать код" },
    { uz: "Har bir foydalanuvchiga alohida ilova yozib chiqish kerak", ru: "Для каждого пользователя нужно писать отдельное приложение" },
    { uz: "Odamlar mahsulotning o'zini emas, u beradigan foydali natijani sotib oladi", ru: "Люди покупают не сам продукт, а полезный результат, который он даёт" }
  ], correct: 3 },
  { q: { uz: "Milkshake misolida u xaridorga qanday foydali natija berardi?", ru: "Какой полезный результат давал коктейль покупателю в том примере?" }, opts: [
    { uz: "Arzon bo'lgani uchun", ru: "Он был дешёвым" },
    { uz: "Uzoq yo'lda zerikmaslik va tushlikkacha to'q qolish uchun", ru: "Не скучать в долгой дороге и остаться сытым до обеда" },
    { uz: "Sovg'a bilan berilgani uchun", ru: "Его давали с подарком" },
    { uz: "Reklamada juda chiroyli ko'rsatilib, ko'zga tashlangani uchun", ru: "Его очень красиво показывали в рекламе" }
  ], correct: 1 },
  { q: { uz: "Haqiqiy sababni bilgach, McDonald's milkshake bilan nima qildi?", ru: "Что McDonald's сделал с коктейлем, когда узнал настоящую причину?" }, opts: [
    { uz: "Narxini tushirib, reklamada ko'proq ko'rsatdi", ru: "Снизил цену и стал больше показывать в рекламе" },
    { uz: "Sotuvini faqat kechki payt ochiq qoldirdi", ru: "Оставил продажу только по вечерам" },
    { uz: "Yanada quyuq qilib, eshik oldidagi apparatga qo'ydi", ru: "Сделал гуще и поставил в аппарат у входа" },
    { uz: "O'rniga yo'lga qulay banan sota boshladi", ru: "Вместо него стал продавать удобный в дороге банан" }
  ], correct: 2 },
  { q: { uz: "«Saytda dark mode bo'lsin» — bu nima?", ru: "«Пусть на сайте будет dark mode» — что это?" }, opts: [
    { uz: "To'liq va tugallangan User Story hikoyasi", ru: "Полная, завершённая история User Story" },
    { uz: "Foydalanuvchi turi", ru: "Тип пользователя" },
    { uz: "Jobs-to-be-Done (JTBD)", ru: "Jobs-to-be-Done (JTBD)" },
    { uz: "Imkoniyat-so'rovi (feature request)", ru: "Заявка на возможность (feature request)" }
  ], correct: 3 },
  { q: { uz: "Agar NATIJA harakatni takrorlasa, nima bo'ladi?", ru: "Что будет, если РЕЗУЛЬТАТ повторяет действие?" }, opts: [
    { uz: "Foyda ko'rinmaydi — hikoya to'liq emas", ru: "Пользы не видно — история неполная" },
    { uz: "Kod tezroq ishlaydi", ru: "Код будет работать быстрее" },
    { uz: "Hikoya kuchliroq bo'ladi", ru: "История станет сильнее" },
    { uz: "Foydalanuvchi turi o'z-o'zidan aniqlashadi", ru: "Тип пользователя определится сам собой" }
  ], correct: 0 },
  { q: { uz: "Hikoyadagi [NIMA] bo'lagi nimani bildiradi?", ru: "Что означает часть [ЧТО] в истории?" }, opts: [
    { uz: "Foydalanuvchi oxir-oqibat oladigan real foyda", ru: "Реальная польза, которую пользователь получит в итоге" },
    { uz: "Foydalanuvchi turi", ru: "Тип пользователя" },
    { uz: "Foydalanuvchi bajarmoqchi bo'lgan harakat", ru: "Действие, которое пользователь хочет сделать" },
    { uz: "Loyiha muddati", ru: "Срок проекта" }
  ], correct: 2 },
  { q: { uz: "Nega avval User Story, keyin kod?", ru: "Почему сначала User Story, а потом код?" }, opts: [
    { uz: "Chunki kod yozish qiyin", ru: "Потому что писать код трудно" },
    { uz: "Avval «kimga nima kerak»ni bilish, keyin qurish uchun", ru: "Чтобы сначала узнать, «кому что нужно», и только потом строить" },
    { uz: "Chunki mijoz shuni talab qiladi", ru: "Потому что этого требует клиент" },
    { uz: "Buning umuman ahamiyati yo'q, tartib mutlaqo farq qilmaydi", ru: "Это совсем неважно, порядок роли не играет" }
  ], correct: 1 }
];
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
          <span className="cs-hud-i">{tr2({ uz: "🏆 PODIUM", ru: "🏆 ПОДИУМ" })}</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>;
};
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
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
function QzFX() {
  const ref = useRef2(null);
  useEffect2(() => {
    const cv = ref.current;
    if (!cv) return;
    if (typeof window === "undefined") return;
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
    const TOK = tr2({
      uz: ["KIM", "NIMA", "NATIJA", "story", "JTBD", "uchun", "sifatida", "xohlayman", "⭐", "🥤"],
      ru: ["КТО", "ЧТО", "РЕЗУЛЬТАТ", "story", "JTBD", "чтобы", "как", "хочу", "⭐", "🥤"]
    });
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
      if (typeof window !== "undefined" && !window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закрыть, ученики останутся ждать на арене.\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr2(s.ch)}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме тренировки" })}</button>
        </div>}

      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают бонус 🔥!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr2({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr2({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Подождите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr2({ uz: "▶ Boshlash", ru: "▶ Начать" })}</button>}
        </div>}

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

      {phase === "reveal" && Q && <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr2({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length} {tr2({ uz: "— natija", ru: "— результат" })}</span>
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? tr2({ uz: ` · 🔥 x${streakUpTo(qi)} ketma-ket`, ru: ` · 🔥 x${streakUpTo(qi)} подряд` }) : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz.", ru: "Ошиблись — 0 баллов. Возьмёте на следующем." }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling.", ru: "Время вышло — 0 баллов. Будьте быстрее." })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>}
          {!solo && <div className="qz-board">
              <div className="qz-board-h">{tr2({ uz: "🏆 TOP-5", ru: "🏆 ТОП-5" })}</div>
              {board.slice(0, 5).map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>)}
            </div>}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : ctrl("q", qi + 1)}>{lastQ ? tr2({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr2({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr2({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr2({ uz: "Keyingi →", ru: "Дальше →" })}</button>}
        </div>}

      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr2({ uz: "🏆 Test yakunlandi!", ru: "🏆 Тест завершён!" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: "ball ·", ru: "баллов ·" })} {soloScore.ok}/{QUIZ_BANK.length} {tr2({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? tr2({ uz: ` · ketma-ket to'g'ri 🔥x${soloScore.maxStreak}`, ru: ` · подряд верно 🔥x${soloScore.maxStreak}` }) : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ Qayta yechish</button>
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
              {myRank >= 0 && <p className="qz-mypl">{tr2({ uz: "Siz —", ru: "Вы —" })} <b>{tr2({ uz: `${myRank + 1}-o'rin`, ru: `${myRank + 1}-е место` })}</b> · {board[myRank].pts} {tr2({ uz: "ball", ru: "баллов" })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta yechish — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест ещё раз — тренировка (в таблицу не идёт)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
var ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
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
  const soloSlots = boardSlots();
  return <Stage eyebrow={tr2({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши сегодняшние <span className="italic" style={{ color: T.accent }}>победители</span></> }) : tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="pod-solo">
              <div className="pod-solo-sec">
                <span className="pod-solo-lbl">🏅 {tr2({ uz: "Nishonlar", ru: "Значки" })}</span>
                <div className="pod-solo-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(achievements && achievements.has(id));
    return <span key={id} className={`pod-solo-b ${got ? "got" : ""}`} title={a.name}>{got ? a.icon : "🔒"}</span>;
  })}
                </div>
              </div>
              <div className="pod-solo-sec">
                <span className="pod-solo-lbl">📒 {tr2({ uz: "Hikoya-daftar", ru: "Блокнот историй" })}</span>
                <div className="pod-solo-badges">
                  {soloSlots.map((ok, i) => <span key={i} className={`sboard-slot big ${ok ? "ok" : ""}`}>{ok ? "✓" : i + 1}</span>)}
                </div>
              </div>
            </div>
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Это ваш личный результат. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
            <Confetti />
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: "Siz —", ru: "Вы —" })} <b>{tr2({ uz: `${myIdx + 1}-o'rin`, ru: `${myIdx + 1}-е место` })}</b> ({board[myIdx].okCount}/{totalQ} {tr2({ uz: "to'g'ri", ru: "верно" })})</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr2({ uz: "To'liq reyting", ru: "Полный рейтинг" })}</div>
              <div className="pod-list">
                {board.map((b, i) => <div key={b.id} className={`pod-row ${live.playerId === b.id ? "me" : ""}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map((q) => {
    const a = rows.find((r) => r.player_id === b.id && r.screen_idx === q);
    return <span key={q} className={`pod-dot ${a ? a.correct ? "ok" : "bad" : ""}`} title={Q_LABELS[q]} />;
  })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>)}
              </div>
            </div>
          </>}
      </div>
    </Stage>;
};
var HW_TOKENS = [
  { t: { uz: "KIM", ru: "КТО" }, l: 5, tp: 16, s: 12, d: 6.5 },
  { t: { uz: "NIMA", ru: "ЧТО" }, l: 80, tp: 12, s: 11, d: 7.5 },
  { t: { uz: "NATIJA", ru: "РЕЗУЛЬТАТ" }, l: 12, tp: 70, s: 11, d: 8 },
  { t: "story", l: 68, tp: 76, s: 12, d: 6 },
  { t: { uz: "sifatida", ru: "как" }, l: 86, tp: 52, s: 10, d: 9 },
  { t: { uz: "uchun", ru: "чтобы" }, l: 36, tp: 8, s: 10, d: 7 },
  { t: "JTBD", l: 3, tp: 44, s: 13, d: 8.5 }
];
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
  const RECAP = [
    { uz: "Hikoya uch bo'lakdan tuziladi: KIM, NIMA va NATIJA", ru: "История состоит из трёх частей: КТО, ЧТО и РЕЗУЛЬТАТ" },
    { uz: "KIM — foydalanuvchi turi, NIMA — harakat, NATIJA — real foyda", ru: "КТО — тип пользователя, ЧТО — действие, РЕЗУЛЬТАТ — реальная польза" },
    { uz: "NATIJA harakatni takrorlamaydi — foydani aytadi", ru: "РЕЗУЛЬТАТ не повторяет действие — он называет пользу" },
    { uz: "Hikoya kod yozishdan oldin yoziladi", ru: "Историю пишут до того, как писать код" }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
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
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Dars tugadi", ru: "Урок завершён" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Birinchi 3 <span className="italic" style={{ color: T.accent }}>hikoyangiz</span> tayyor.</>, ru: <>Ваши первые 3 <span className="italic" style={{ color: T.accent }}>истории</span> готовы.</> })}</h2>{
    /* F-0725-01 · 54-qonun: yakun-hero'ning h-sub qatori o'chirildi (foydalanuvchi qarori — sarlavha o'zi yetadi, pastda «Endi siz bilasiz» ro'yxati bor). */
  }</div>{!isMentorL && <ScoreRing correct={correct} total={total} />}</div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : void 0} />
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
        {hwOpen && <HwTaskCard />}
        {
    /* Nishon-kolleksiyasi — SHAXSIY hisob, mentor proyektorida ko'rsatilmaydi
       (90-qonun; AchCounter izohiga qarang: sahna ↔ daftar tamoyili). */
  }
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr2({ uz: "Nishonlaringiz —", ru: "Ваши значки —" })} {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
function PmUserStoryLesson({ lang: langProp, onFinished }) {
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
  const earn = useCallback2((id) => {
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
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect2(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  const SUMMARY_IDX = SCREEN_META.findIndex((m) => m.id === "s16");
  useEffect2(() => {
    if (screen === SUMMARY_IDX) earn("graduate");
  }, [screen, SUMMARY_IDX, earn]);
  const next = () => setScreen((s) => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen((s) => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    const nextA = { ...answers, [idx]: data };
    setAnswers(nextA);
    if ([4, 6, 9].every((i) => nextA[i] && nextA[i].correct)) earn("hotspotAce");
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen7, Screen4, Screen8, ScreenStoryWorkshop, ScreenPeer, Screen9, ScreenClinic, ScreenCoding, ScreenPriority, Screen11, ScreenPodium, Screen16];
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
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* Jonli-nishon (LiveBadge) — xira, aralashmaydi; hoverda to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
        .live-badge:hover { opacity: 1; }

        /* === ⛶ KATTALASHTIRISH (Zoomable — PracticeLesson4 porti) === */
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }

        /* === KNOPKALAR === */
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        /* 🔔 NAVBAT-PULSI (88-qonun · 1-C): navbat shu elementda. O'LCHAM O'ZGARMAYDI — faqat halqa
           nafas oladi, shuning uchun UI sakramaydi va ixchamligicha qoladi. Asosiy soya saqlanadi. */
        @keyframes turn-hint {
          0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
          50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
        }
        .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
        /* Tugmadan boshqa elementlar uchun (chip, karta, zona, kiritish maydoni): halqa ALOHIDA
           qatlamda chiziladi — elementning o'z chegarasi/soyasiga tegmaydi va layout'ni surmaydi. */
        .turn-ring { position: relative; }
        .turn-ring::after {
          content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
          border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
        }
        @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
        /* Navbat TO'LQINI: bir guruh teng variant birma-bir yonadi. Kechikishlar shunday tanlanganki,
           istalgan lahzada FAQAT BITTASI ko'rinadi. Cheklangan (4 aylanish) — sekin o'qiydigan
           o'quvchi peripheral harakatdan charchamasin. wv4 sinfi — to'rt variantli qator uchun. */
        .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
        @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
        .turn-wave.w2::after { animation-delay: 0.7s; }
        .turn-wave.w3::after { animation-delay: 1.4s; }
        .turn-wave.wv4::after { animation-duration: 2.8s; }
        .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        /* Kiritish maydoni ::after qabul qilmaydi — halqa o'rovchi qatlamga qo'yiladi (layout o'zgarmaydi). */
        .turn-wrap { display: block; position: relative; }
        .turn-wrap > .reflect-input { width: 100%; }
        .smini-f.turn-ring::after { inset: -4px; border-radius: 12px; }
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.errSoft} !important; color: ${T.err} !important; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.32) !important; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === MENTORGA ESLATMA (faqat mentor-rejim) === */
        .mnote { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        /* Proyektor-sir: yopiq holatda xira chip (LiveBadge oilasi) — o'quvchi diqqatini tortmaydi */
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }

        /* === HOOK: menyu-kartochka ovoz-plitkalari === */
        /* === HOOK v3: xabar-almashtirgich + radio-variantlar (PmLesson2 andozasi) === */
        .hk-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); cursor: pointer; border: none; border-radius: 99px; padding: 9px 16px; background: ${T.paper}; color: ${T.ink2}; box-shadow: 0 5px 14px -8px rgba(${T.shadowBase},0.2); transition: all 0.16s; }
        .hk-chip:hover:not(.on) { transform: translateY(-2px); }
        .hk-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .hk-view { min-height: clamp(120px,16vw,160px); }
        .hk-opt { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(12px,1.8vw,15px) clamp(14px,2vw,17px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .hk-opt:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hk-opt.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hk-opt:disabled { cursor: default; }
        .hk-opt.wait { color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .hk-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hk-opt.on .hk-radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .hk-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .hk-chip, .hk-opt { transition: none; } }

        /* === HOOK: IKKI SO'ROV KARTASI + OVOZ-DIAGRAMMA (dars-ipi shu yerdan) === */
        .hreq { display: grid; grid-template-columns: 1fr 1.5fr; gap: clamp(10px,1.8vw,16px); }
        @media (max-width: 640px) { .hreq { grid-template-columns: 1fr; } }
        .hreq-card { background: ${T.paper}; border-radius: 4px 18px 18px 18px; padding: clamp(14px,2vw,20px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.22); border-left: 3px solid ${T.line}; }
        .hreq-card.b { border-left-color: ${T.accent}; }
        .hreq-tag { display: inline-block; font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 7px; }
        .hreq-card.b .hreq-tag { color: ${T.accent}; }
        .hreq-txt { margin: 0; font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px,1.8vw,16.5px); line-height: 1.55; color: ${T.ink}; }
        .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .hvote-row { display: flex; align-items: center; gap: 10px; }
        .hvote-lbl { flex: 0 0 clamp(120px,26vw,220px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
        .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
        .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
        .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .hvote-fill { transition: none; } }

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
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar bir-birining ustiga chiqib ketardi (klinika 11/17 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }

        /* === TAKEAWAY === */
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; } .ta-b { font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink2}; line-height: 1.55; margin: 4px 0 0; max-width: 62ch; }

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
        /* 💻 UYGA VAZIFA — bitta katta chorlab turuvchi kapsula (CODE STRIKE fon-oilasi):
           qorong'i-binafsha radial-fon + neon-hoshiya + nafas oluvchi nur + suzuvchi tokenlar + shine. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }

        /* === bb-dots (kod-muharrir sarlavhasi) === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }

        /* === 🃏 STORY-SILUET — ish stoli ustidagi indeks-kartalar (maqsad) === */
        .demo-src { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.04em; color: ${T.ink3}; background: ${T.accentSoft}; border-radius: 999px; padding: 5px 13px; }
        .demo-src-ic { font-size: 13px; }
        .story-silo { position: relative; display: flex; align-items: center; gap: 12px; background: linear-gradient(180deg, #fff, #FBFAFE); border-radius: 4px 12px 12px 4px; padding: 13px 16px 13px 22px; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.2); border-left: 4px solid ${T.accent}44; transition: transform 0.22s, box-shadow 0.22s; }
        .story-silo::before { content: ""; position: absolute; left: 11px; top: 12px; width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}33; box-shadow: 0 22px 0 ${T.accent}22; }
        .story-silo:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.26); }
        .story-silo-n { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .story-silo-slots { display: flex; gap: 8px; flex: 1; flex-wrap: wrap; }
        .silo-slot { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; padding: 5px 11px; border-radius: 7px; border: 1.5px dashed ${T.ink3}; color: ${T.ink3}; }
        .silo-slot.kim { border-color: ${T.blue}66; color: ${T.blue}; } .silo-slot.nima { border-color: #E8A13A88; color: #B77A16; } .silo-slot.natija { border-color: ${T.success}66; color: ${T.success}; }
        /* === MAQSAD-DEMO: kartalar ko'z oldida to'ladi (CSS-taymlayn) === */
        .demo-card { opacity: 0; animation: silo-in 0.5s ease-out forwards; animation-delay: var(--cd, 0s); }
        @keyframes silo-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .demo-slot { display: inline-grid; align-items: center; justify-items: center; }
        .demo-slot .silo-lbl { grid-area: 1 / 1; animation: silo-lbl-out 0.3s ease forwards; animation-delay: var(--fd, 1s); }
        @keyframes silo-lbl-out { to { opacity: 0.18; transform: scale(0.92); } }
        .demo-slot .silo-fill { grid-area: 1 / 1; width: 100%; display: flex; align-items: center; justify-content: center; padding: 0 2px; white-space: nowrap; font-weight: 700; letter-spacing: 0; text-transform: none; background: ${T.paper}; border-radius: 5px; opacity: 0; transform: scale(0.6); animation: silo-fill-pop 0.45s cubic-bezier(.3,1.5,.45,1) forwards; animation-delay: var(--fd, 1s); }
        .silo-slot.kim .silo-fill { background: ${T.blueSoft}; } .silo-slot.nima .silo-fill { background: #FBEED6; } .silo-slot.natija .silo-fill { background: ${T.successSoft}; }
        @keyframes silo-fill-pop { 0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
        .silo-done { width: 22px; height: 22px; border-radius: 50%; background: ${T.success}; color: #fff; font-family: 'Manrope'; font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0; transform: scale(0); animation: silo-fill-pop 0.4s cubic-bezier(.3,1.6,.45,1) forwards; animation-delay: var(--fd, 2s); box-shadow: 0 4px 10px -3px rgba(18,169,104,0.5); }
        @media (prefers-reduced-motion: reduce) {
          .demo-card, .demo-slot .silo-lbl, .demo-slot .silo-fill, .silo-done { animation: none; opacity: 1; transform: none; }
          .demo-slot .silo-lbl { opacity: 0.35; }
        }

        /* === PROYEKTOR SAVOL + MISOL (yadro) === */
        .broken-story { font-family: 'Source Serif 4', serif; font-size: clamp(20px,3.2vw,27px); color: ${T.ink}; margin: 0; line-height: 1.42; }
        .broken-cue { font-size: 13px; color: ${T.ink2}; margin: 0; font-weight: 600; }
        .ex-card { background: ${T.successSoft}; border-radius: 14px; padding: clamp(14px,2.2vw,18px); display: flex; flex-direction: column; gap: 10px; }
        /* O'STIRISH-KARTA (F-0727-02): o'quvchining o'z 2 bo'lagi → to'liq hikoya, bo'laklar belgilangan */
        .grow-card { background: ${T.paper}; border: 1.5px solid ${T.success}33; border-radius: 14px; padding: clamp(14px,2.2vw,18px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 9px; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.25); }
        .grow-from { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; justify-content: center; }
        .gf-chip { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); border-radius: 99px; padding: 6px 13px; }
        .gf-chip.harakat { background: #FBEED6; color: #B77A16; } .gf-chip.sabab { background: ${T.successSoft}; color: ${T.success}; }
        .gf-plus { font-family: 'Manrope'; font-weight: 800; color: ${T.ink3}; }
        .grow-arrow { font-size: 20px; color: ${T.success}; line-height: 1; }
        .gp { padding: 1px 4px; border-radius: 5px; border-bottom: 2.5px solid; position: relative; transition: background 0.4s, border-color 0.4s; }
        .gp.lit.kim { background: ${T.blueSoft}; border-color: ${T.blue}; } .gp.lit.nima { background: #FBEED6; border-color: #E8A13A; } .gp.lit.natija { background: ${T.successSoft}; border-color: ${T.success}; }
        .gp:not(.lit) { background: transparent; border-color: transparent; }
        /* Bo'lak yonganda izohi bevosita ostida chiqadi (alohida legend-qatori yo'q) */
        .gp.lit::after { content: attr(data-sub); position: absolute; left: 50%; transform: translateX(-50%); top: calc(100% + 1px); font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
        .gp.kim::after { color: ${T.blue}; } .gp.nima::after { color: #B77A16; } .gp.natija::after { color: ${T.success}; }
        .grow-card .ex-body { line-height: 2.3; }
        /* KIM hali kelmagan -- bo'sh chiziq-joy */
        .gp-slot { display: inline-block; min-width: clamp(110px,16vw,170px); height: 1.05em; vertical-align: middle; border-bottom: 2.5px dashed ${T.blue}; border-radius: 5px; background: ${T.blueSoft}55; }
        /* KIM uchib kelib o'tiradi */
        .gp.drop { animation: gp-drop 0.6s cubic-bezier(0.2, 0.8, 0.3, 1.15); }
        @keyframes gp-drop { 0% { opacity: 0; transform: translateY(-16px); } 100% { opacity: 1; transform: none; } }
        /* Chiplar ikki chetdan kelib birlashadi */
        .gf-l { opacity: 0; transform: translateX(-28px); transition: all 0.55s ease; }
        .gf-r { opacity: 0; transform: translateX(28px); transition: all 0.55s ease; }
        .gf-f { opacity: 0; transition: opacity 0.45s ease 0.3s; }
        .gf-l.in, .gf-r.in { opacity: 1; transform: none; }
        .gf-f.in { opacity: 1; }
        .ga-pulse { animation: ga-pulse 1.1s ease-in-out 2; }
        @keyframes ga-pulse { 0%, 100% { transform: none; } 50% { transform: translateY(5px); } }
        .s2sort { transition: opacity 0.5s; }
        .s2sort.dim { opacity: 0.5; }
        @media (prefers-reduced-motion: reduce) { .gf-l, .gf-r, .gf-f { transition: none; opacity: 1; transform: none; } .ga-pulse, .gp.drop { animation: none; } .s2sort { transition: none; } }
        .ex-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.success}; }
        .ex-body { font-size: clamp(15px,2vw,18px); color: ${T.ink}; margin: 0; line-height: 1.45; }

        /* === s2 yengil tap-mashq (harakat/sabab) — UNSCORED, xato = yumshoq indigo === */
        .s2sort { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 14px; padding: clamp(14px,2.2vw,18px); box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .s2row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding: 9px 11px; border-radius: 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.25s; }
        .s2row.done { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .s2txt { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; min-width: 160px; }
        .s2btns { display: flex; gap: 7px; }
        .s2btn { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; padding: 7px 13px; border-radius: 9px; border: none; background: ${T.paper}; color: ${T.ink2}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; }
        .s2btn:hover { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; transform: translateY(-1px); }
        /* tap affordance — bosilishi bilinsin: bosilganda ichkariga cho'kadi */
        .s2btn:active { transform: translateY(0) scale(0.95); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .s2tag { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.03em; padding: 6px 12px; border-radius: 99px; }
        /* Rang-semantikasi butun darsda bitta (F-0727-02): ko'k = KIM · sariq = harakat/NIMA · yashil = sabab/NATIJA.
           Ilgari «harakat» shu ekranda ko'k edi — keyingi ekranda ko'k KIM'ga o'tib, ma'no ko'chib ketardi. */
        .s2tag.harakat { color: #B77A16; background: #FBEED6; } .s2tag.sabab { color: ${T.success}; background: ${T.successSoft}; }
        /* hint = yumshoq indigo maslahat (accentSoft) — XATO-ogohlantirish EMAS; kirish silliq fade */
        .s2hint { flex-basis: 100%; font-family: 'Manrope'; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 7px 11px; animation: story-drop 0.34s ease both; }
        @media (prefers-reduced-motion: reduce) { .s2hint { animation: none; } }

        /* === FORMULA KONSTRUKTOR (s3) === */
        .formula-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: ${T.paper}; background-image: radial-gradient(rgba(${T.shadowBase},0.05) 1px, transparent 1.2px); background-size: 16px 16px; border-radius: 14px; padding: clamp(16px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14), inset 0 0 0 1.5px ${T.line}; font-size: clamp(15px,2.1vw,19px); }
        .fw { color: ${T.ink2}; font-weight: 500; }
        /* Bo'sh slot NEUTRAL (rang-ishorasiz) — rang faqat to'g'ri joylashgach paydo bo'ladi */
        .fslot { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.6vw,14px); letter-spacing: 0.04em; padding: 8px 14px; border-radius: 10px; border: 2px dashed ${T.ink3}; color: ${T.ink3}; min-width: 74px; text-align: center; transition: all 0.25s; background: transparent; cursor: default; }
        .fslot:disabled { cursor: default; }
        .fslot.targetable { cursor: pointer; border-color: ${T.accent}; color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accent}1F; }
        .fslot.shake { animation: fslot-shake 0.44s cubic-bezier(.36,.07,.19,.97); border-color: ${T.err}; color: ${T.err}; }
        @keyframes fslot-shake { 10%,90% { transform: translateX(-2px); } 20%,80% { transform: translateX(3px); } 30%,50%,70% { transform: translateX(-5px); } 40%,60% { transform: translateX(5px); } }
        .fslot.filled { border-style: solid; letter-spacing: 0; animation: fslot-snap 0.42s cubic-bezier(.34,1.65,.4,1); }
        @keyframes fslot-snap { 0% { transform: scale(0.86); } 45% { transform: scale(1.12); } 70% { transform: scale(0.97); } 100% { transform: scale(1); } }
        /* reduced-motion: silkinish/pop o'chadi, lekin xato-rang (err) va to'ldirilgan-rang belgisi qoladi — feedback yo'qolmaydi */
        @media (prefers-reduced-motion: reduce) { .fslot.filled, .fslot.shake { animation: none; } }
        .fslot.kim.filled { background: ${T.blueSoft}; color: ${T.blue}; border-color: ${T.blue}; }
        .fslot.nima.filled { background: #FBEED6; color: #B77A16; border-color: #E8A13A; }
        .fslot.natija.filled { background: ${T.successSoft}; color: ${T.success}; border-color: ${T.success}; }
        .frag-pool { display: flex; flex-wrap: wrap; gap: 10px; }
        .frag-chip { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.7vw,15px); padding: 11px 16px; border-radius: 11px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2); transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; }
        .frag-chip:hover:not(:disabled) { transform: translateY(-3px) rotate(-1deg); box-shadow: 0 12px 22px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
        .frag-chip:active:not(:disabled) { transform: translateY(-1px) scale(0.97); }
        /* Chip NEUTRAL — rang-ishora yo'q; tanlanganda accent bilan belgilanadi */
        .frag-chip.sel { background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55), inset 0 0 0 1.5px ${T.accent}; transform: translateY(-2px); }
        .frag-chip.sel:hover { box-shadow: 0 12px 24px -8px rgba(91,61,230,0.6), inset 0 0 0 1.5px ${T.accent}; }
        .frag-chip.used { opacity: 0.35; cursor: default; }

        /* === K11 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
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
        .kp-chip.locked { cursor: default; transform: none; }
        .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.wrong { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; }
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.err}; }
        .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
        .kp-mark { font-weight: 900; font-size: 15px; }
        /* === TEST-SAVOL (idea_oll tartibi): katta savol + toza kartochka === */
        .tq { display: flex; flex-direction: column; gap: clamp(12px,2vw,18px); width: 100%; }
        .tq-ask { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16.5px,2.2vw,21px); line-height: 1.3; letter-spacing: -0.005em; color: ${T.ink}; margin: 0; }
        .tq-card { background: ${T.paper}; border-radius: 16px; padding: clamp(20px,3vw,28px) clamp(20px,3vw,30px); box-shadow: 0 14px 34px -14px rgba(${T.shadowBase},0.22); border-left: 5px solid ${T.accent}; }
        .tq-story { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(17px,2.4vw,23px); line-height: 1.55; color: ${T.ink}; margin: 0; }
        .opt-abc { width: 27px; height: 27px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; transition: background 0.2s, color 0.2s; }
        .opt-abc.ok { background: ${T.success}; color: #fff; }
        .opt-abc.bad { background: ${T.err}; color: #fff; }
        .opt-abc.dim { background: ${T.bg}; color: ${T.ink3}; }
        .kp-sub { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        /* taxmin natijasi: topdi = yashil · topmadi = NEYTRAL indigo (qizil EMAS — bu ball emas, o'yin) */
        /* 🔴 F-0803-27 — klass IKKI marta ataylab: bu <p>, «.lesson-root p { padding:0 }» reseti
           esa aniqligi (0,1,1) bilan bitta-klassli qoidadan kuchli va padding'ni jimgina
           o'chiradi (99px burchakli «pill» yassilanib qoladi). Ikkilantirish (0,2,0) beradi. */
        .kp-res.kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
        .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
        /* reveal: yumshoq indigo glow-to'lqin */
        .k-slide.revealed { animation: fade-step 0.3s ease-out, kp-glow 0.9s ease-out; }
        @keyframes kp-glow { 0% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 0 rgba(91,61,230,0.4); } 70% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 16px rgba(91,61,230,0); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover, .kp-chip:active { transition: none; transform: none; } .k-slide.revealed, .kp-res { animation: none; } }

        /* === USTAXONA: maydon-uslublari (smini-f/swcard-fields — muharrirda ishlatiladi) === */
        @keyframes card-fill-pop { 0% { transform: scale(1); } 40% { transform: scale(1.012) translateY(-2px); } 100% { transform: scale(1); } }
        .swcard-fields { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        @media (max-width: 620px) { .swcard-fields { grid-template-columns: 1fr; } }
        .smini-f { display: flex; flex-direction: column; gap: 4px; }
        .smini-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .smini-f.kim span { color: ${T.blue}; } .smini-f.nima span { color: #B77A16; } .smini-f.natija span { color: ${T.success}; }
        .smini-f input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; }
        .smini-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .smini-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        .star { background: none; border: none; cursor: pointer; font-size: 18px; color: ${T.ink3}; padding: 0 1px; transition: color 0.15s, transform 0.15s; }
        .star.on { color: #F5A623; } .star:hover { transform: scale(1.2); }
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
        .jws-line { flex: 0 1 110px; height: 3px; border-radius: 99px; background: ${T.line}; margin-top: clamp(18px,2.2vw,21px); transition: background 0.4s; }
        .jws-line.on { background: ${T.success}; }
        .svd.full { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .smini-f.kim input { box-shadow: inset 0 0 0 1.5px ${T.blue}55; }
        .smini-f.nima input { box-shadow: inset 0 0 0 1.5px #E8A13A66; }
        .smini-f.natija input { box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .smini-f.kim input:focus { box-shadow: inset 0 0 0 2px ${T.blue}; }
        .smini-f.nima input:focus { box-shadow: inset 0 0 0 2px #E8A13A; }
        .smini-f.natija input:focus { box-shadow: inset 0 0 0 2px ${T.success}; }
        .smini-f.kim.on input { box-shadow: inset 0 0 0 1.5px ${T.blue}; }
        .smini-f.nima.on input { box-shadow: inset 0 0 0 1.5px #E8A13A; }
        .smini-f.natija.on input { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        @media (prefers-reduced-motion: reduce) { .jws.cur .jws-n { animation: none; } }
        .swed { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; gap: 13px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.2); border-left: 5px solid ${T.accent}; }
        .swed-tag { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 99px; color: ${T.accent}; background: ${T.accentSoft}; }
        .swed-sent { font-family: Georgia, serif; font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.6; margin: 0; overflow-wrap: anywhere; }
        /* Gap-slotlari formula-konstruktor (s3) ranglarida: bo'sh = xira-punktir, to'lgan = o'z rangi */
        .ss-slot { font-weight: 700; color: ${T.ink3}; font-style: italic; border-bottom: 2px dashed ${T.ink3}66; padding: 0 2px; transition: color 0.2s; }
        .ss-slot.on { font-style: normal; border-bottom-style: solid; }
        .ss-slot.kim.on { color: ${T.blue}; border-bottom-color: ${T.blue}55; }
        .ss-slot.nima.on { color: #B77A16; border-bottom-color: #B77A1655; }
        .ss-slot.natija.on { color: ${T.success}; border-bottom-color: ${T.success}55; }
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
        .svd-stars { display: inline-flex; align-items: center; }
        .svd-stars .star { font-size: 15px; }
        .svd-edit { margin-left: auto; background: ${T.paper}; border: none; border-radius: 8px; padding: 0 10px; height: 28px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; white-space: nowrap; color: ${T.ink2}; cursor: pointer; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); transition: color 0.15s, transform 0.15s; }
        .svd-edit:hover { color: ${T.accent}; transform: scale(1.08); }
        .svd-sent { font-size: 13.5px; color: ${T.ink2}; line-height: 1.45; margin: 0; overflow-wrap: anywhere; }
        .svd-sent b { color: ${T.ink}; font-weight: 600; }
        .svd-foot { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: 12px; line-height: 1.45; color: ${T.ink3}; }
        /* === TEKSHIRUVCHI STOLI: bitta katta namuna-karta → hukm → sabab-chip → xulosa-strip === */
        .peer-top { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
        .peer-prog { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink3}; font-variant-numeric: tabular-nums; }
        .peer-dots { display: inline-flex; gap: 5px; }
        .peer-dot { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; transition: background 0.2s; }
        .peer-dot.on { background: ${T.accent}; }
        .peer-big { background: ${T.paper}; border-radius: 16px; border-left: 5px solid ${T.accentSoft}; padding: clamp(14px,2.2vw,22px) clamp(16px,2.4vw,26px); display: flex; flex-direction: column; gap: 7px; min-width: 0; box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.28); }
        .peer-sent { font-family: 'Source Serif 4', serif; font-weight: 500; font-size: clamp(16px,2.2vw,22px); line-height: 1.45; color: ${T.ink2}; margin: 0; min-width: 0; overflow-wrap: anywhere; }
        .peer-sent b { font-weight: 600; }
        .peer-acts { display: flex; gap: clamp(8px,1.4vw,14px); flex-wrap: wrap; }
        .peer-vbtn { flex: 1 1 200px; min-width: 0; background: ${T.paper}; border: none; border-radius: 13px; padding: clamp(11px,1.6vw,15px) 16px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; box-shadow: 0 7px 18px -8px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s, box-shadow 0.15s, background 0.2s, color 0.2s; }
        .peer-vbtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}55; }
        .peer-vbtn:disabled { cursor: default; opacity: 0.5; }
        .peer-vbtn.no.armed { box-shadow: 0 0 0 2.5px ${T.accent}, 0 10px 22px -8px rgba(91,61,230,0.35); }
        /* tanlangan hukm = tanlov rangi (yashil emas: to'g'ri-noto'g'ri faqat izoh qatorida aytiladi) */
        .peer-vbtn.on { background: ${T.accentSoft}; color: ${T.accent}; opacity: 1; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .peer-why { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .peer-why-l { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink2}; }
        .peer-chip { background: ${T.paper}; border: none; border-radius: 99px; padding: 9px 16px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 15px -7px rgba(${T.shadowBase},0.25), inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s, box-shadow 0.15s; }
        .peer-chip:hover { transform: translateY(-2px); box-shadow: 0 9px 18px -7px rgba(91,61,230,0.32), inset 0 0 0 1.5px ${T.accent}66; }
        .peer-fb { display: flex; align-items: center; gap: clamp(10px,1.6vw,16px); flex-wrap: wrap; }
        .peer-fb-t { margin: 0; flex: 1 1 260px; min-width: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.45; color: ${T.ink2}; overflow-wrap: anywhere; }
        .peer-fb-t.good { color: ${T.success}; }
        .peer-go { flex-shrink: 0; font-weight: 700; }
        .peer-sum { display: flex; flex-direction: column; gap: 8px; }
        .peer-srow { display: flex; align-items: center; gap: 10px; min-width: 0; background: ${T.paper}; border-radius: 12px; padding: 10px 15px; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.2); }
        .peer-snom { flex: 1 1 auto; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; overflow-wrap: anywhere; }
        .peer-sv { flex-shrink: 0; font-family: 'Manrope'; font-weight: 800; font-size: 12px; border-radius: 99px; padding: 4px 12px; background: ${T.bg}; color: ${T.ink2}; }
        .peer-sm { flex-shrink: 0; width: 20px; text-align: center; font-size: 13px; color: ${T.ink3}; }
        .peer-close { margin: 4px 0 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,18px); color: ${T.ink}; }
        @media (prefers-reduced-motion: reduce) { .peer-vbtn, .peer-vbtn:hover, .peer-chip, .peer-chip:hover { transition: none; transform: none; } .peer-big.fade-step, .peer-why.fade-step, .peer-fb.fade-step, .peer-sum.fade-step { animation: none; } }
        /* === DASTURCHI-SINOVI: so'rov-kartalar + dasturchi stoli === */
        .bt-send { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.6vw,15px); cursor: pointer; border: none; border-radius: 12px; padding: clamp(11px,1.6vw,13px) clamp(20px,2.4vw,26px); background: ${T.accent}; color: #fff; box-shadow: 0 8px 20px -8px rgba(91,61,230,0.5); transition: all 0.18s; }
        .bt-send:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 26px -8px rgba(91,61,230,0.6); }
        .bt-send:disabled { background: ${T.paper}; color: ${T.ink3}; cursor: not-allowed; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.14); }
        /* Tayyor-puls: so'rov tanlangach tugma "nafas oladi" — halqa (turn-ring) + yumshoq soya. */
        .bt-send.go { animation: bt-send-go 1.9s ease-in-out infinite; }
        .bt-send.go.turn-ring::after { border-color: ${T.accent}; inset: -5px; }
        @keyframes bt-send-go { 0%, 100% { box-shadow: 0 8px 20px -8px rgba(91,61,230,0.5); } 50% { box-shadow: 0 12px 30px -4px rgba(91,61,230,0.75); } }
        @media (prefers-reduced-motion: reduce) { .bt-send.go { animation: none; } }
        .bt-req { display: flex; flex-direction: column; gap: 5px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 13px; padding: 12px 14px; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: all 0.16s; font-family: 'Manrope', sans-serif; }
        .bt-req:hover:not(:disabled):not(.on) { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .bt-req.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -8px rgba(91,61,230,0.28); }
        .bt-req:disabled { cursor: default; opacity: 0.75; }
        .bt-req-tag { display: flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink3}; }
        .bt-req.on .bt-req-tag { color: ${T.accent}; }
        .bt-req-done { font-size: 10px; font-weight: 800; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 2px 8px; text-transform: none; letter-spacing: 0.02em; }
        .bt-req-txt { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(13.5px,1.7vw,15.5px); line-height: 1.5; color: ${T.ink}; }
        .bt-desk { display: flex; flex-direction: column; gap: 11px; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2vw,18px); box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.3); }
        .bt-desk-top { display: flex; align-items: center; gap: 10px; }
        .bt-dev { font-size: 30px; line-height: 1; }
        .bt-dev-name { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px; }
        .bt-desk-t { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .bt-parts { display: flex; flex-direction: column; gap: 8px; }
        .bt-part { display: flex; align-items: center; gap: 10px; border-radius: 11px; padding: 9px 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.25s; }
        .bt-part.p0 { --pc: ${T.blue}; } .bt-part.p1 { --pc: #E8A13A; } .bt-part.p2 { --pc: ${T.success}; }
        .bt-part-lbl { min-width: 62px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; color: var(--pc); }
        .bt-part-val { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .bt-part.cur { background: ${T.paper}; box-shadow: inset 0 0 0 2px var(--pc); }
        .bt-part.ok { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px var(--pc); }
        .bt-part.ok .bt-part-val { color: ${T.ink}; }
        .bt-part.bad { background: ${T.errSoft}; box-shadow: inset 0 0 0 1.5px ${T.err}66; }
        .bt-part.bad .bt-part-val { color: ${T.err}; font-weight: 700; }
        .bt-guess.bt-guess { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; background: ${T.bg}; border-radius: 4px 14px 14px 14px; padding: 8px 12px; }
        @media (prefers-reduced-motion: reduce) { .bt-req, .bt-part { transition: none; } }
        /* === PRIORITET-DOSKA: 3 ustun (Hozir=1 joy) + tanla-bos kartalar === */
        /* LAGANCHA (F-0727-08): joylashtirilmagan kartalar alohida idishda — qizil puls «meni joyla» signali */
        .pd-tray { display: flex; flex-direction: column; gap: 9px; margin-top: clamp(8px,1.6vw,14px); background: #FFF8F7; border-radius: 14px; padding: 12px 14px 13px; animation: tray-in 0.5s ease-out, tray-pulse 1.5s ease-in-out 0.5s infinite; }
        @keyframes tray-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes tray-pulse {
          0%, 100% { box-shadow: 0 0 0 2px ${T.err}44, 0 0 0 0 rgba(229,72,77,0); }
          50% { box-shadow: 0 0 0 2.5px ${T.err}, 0 0 20px 3px rgba(229,72,77,0.30); }
        }
        .pd-tray.calm { animation: none; box-shadow: 0 0 0 1.5px ${T.err}55; }
        .pd-tray-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: #C2362F; display: inline-flex; align-items: center; gap: 6px; }
        .pd-tray-arrow { display: inline-block; animation: tray-arrow 1.5s ease-in-out infinite; }
        @keyframes tray-arrow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
        .pd-tray.calm .pd-tray-arrow { animation: none; }
        @media (prefers-reduced-motion: reduce) { .pd-tray, .pd-tray-arrow { animation: none; } .pd-tray { box-shadow: 0 0 0 2px ${T.err}88; } }
        .pd-pool { display: flex; flex-wrap: wrap; gap: 9px; }
        .pd-card { display: inline-flex; align-items: center; gap: 8px; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 9px 13px; cursor: pointer; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.22); transition: transform 0.15s, box-shadow 0.15s; max-width: 100%; }
        .pd-card:hover { transform: translateY(-2px); }
        .pd-card.sel { box-shadow: 0 0 0 2.5px ${T.accent}, 0 10px 22px -7px rgba(91,61,230,0.4); transform: translateY(-2px); }
        .pd-card-n { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; }
        .pd-card-txt { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; line-height: 1.35; overflow-wrap: anywhere; }
        /* Muhimlik darajalari: qatorlar tepadan pastga — yuqorisi katta-yorqin, pasti kichik-xira */
        .ms-list { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .ms-row { position: relative; display: flex; flex-direction: column; gap: 8px; width: 100%; border-radius: 14px; padding: 11px 13px 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.2s, background 0.2s; cursor: default; }
        .ms-row.p1 { background: linear-gradient(135deg, #FDF1E7, #FCE8D9); box-shadow: inset 0 0 0 1.5px #E8A13A66; }
        .ms-row.p2 { width: 88%; background: linear-gradient(135deg, #FBF7E9, #F8F2DC); }
        .ms-row.p3 { width: 76%; opacity: 0.92; }
        .ms-row.targetable { box-shadow: inset 0 0 0 2px ${T.accent}66; cursor: pointer; }
        .ms-row.targetable:hover { box-shadow: inset 0 0 0 2.5px ${T.accent}; }
        .ms-row.shake { animation: fslot-shake 0.4s; }
        .ms-h { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .ms-t { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .ms-row.p1 .ms-t { font-size: 15.5px; }
        .ms-row.p3 .ms-t { color: ${T.ink2}; }
        .ms-sub { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; }
        .ms-empty { border: 1.5px dashed ${T.ink3}55; border-radius: 10px; padding: 10px 8px; text-align: center; font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; font-style: italic; }
        .ms-row .pd-card.placed { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.28); animation: card-fill-pop 0.42s cubic-bezier(.34,1.5,.4,1); align-self: flex-start; }
        .ms-row .pd-card.placed.sel { box-shadow: 0 0 0 2.5px ${T.accent}; }
        @media (max-width: 640px) { .ms-row.p2, .ms-row.p3 { width: 100%; } }
        @media (prefers-reduced-motion: reduce) { .ms-row.shake, .ms-row .pd-card.placed { animation: none; } .pd-card:hover { transform: none; } }

        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }

        /* === YORDAM (ochiladigan) === */
        /* 31-qonun: «kim bajaradi» yozuvi (faqat mentor ko'radi) */

        /* muvaffaqiyat = ixcham chip (paragraf-ramka EMAS) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === HOTSPOT (buzuq bo'laklar) === */
        .hs-parts { justify-content: center; }
        .hs-chip { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2.1vw,19px); padding: 12px 18px; border-radius: 12px; border: 2px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.18); }
        .hs-chip:hover:not(:disabled) { border-color: ${T.blue}; transform: translateY(-2px); }
        .hs-chip:disabled { cursor: default; }
        /* buzuq bo'lak TOPILDI = yashil «✓ topdingiz» (xato emas — nishonni topish) */
        .hs-broken { position: relative; background: ${T.successSoft} !important; color: ${T.success} !important; border-color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(18,169,104,0.34) !important; animation: hs-found-pop 0.44s cubic-bezier(.34,1.5,.4,1); }
        .hs-broken::after { content: '✓'; position: absolute; top: -9px; right: -9px; width: 22px; height: 22px; border-radius: 50%; background: ${T.success}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(18,169,104,0.5); }
        @keyframes hs-found-pop { 0% { transform: scale(0.92); } 45% { transform: scale(1.06) translateY(-3px); } 100% { transform: scale(1); } }
        .hs-ok { opacity: 0.45 !important; }
        .hs-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; border-color: ${T.blue} !important; }
        /* o'quvchi NOTO'G'RI bosgan bo'lak = qizil (faqat shu holatda) */
        .hs-miss { background: ${T.errSoft} !important; color: ${T.err} !important; border-color: ${T.err} !important; opacity: 1 !important; text-decoration: line-through; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.28) !important; }
        @media (prefers-reduced-motion: reduce) { .hs-broken { animation: none; } }
        /* s7 reveal-boyitma: buzuq bo'lak ustiga «TOPILDI» shtampi tushadi (faqat vizual qatlam) */
        .hs-stamp::before { content: 'TOPILDI'; position: absolute; top: -14px; left: 12px; transform: rotate(-9deg); font-family: 'Manrope', sans-serif; font-weight: 900; font-size: 11px; letter-spacing: 0.14em; color: ${T.success}; border: 2.5px solid ${T.success}; border-radius: 6px; padding: 2px 8px; background: rgba(255,255,255,0.88); pointer-events: none; box-shadow: 0 4px 10px -4px rgba(18,169,104,0.4); animation: stamp-in 0.42s cubic-bezier(.2,1.4,.4,1) 0.1s both; }
        @keyframes stamp-in { 0% { transform: rotate(-9deg) scale(2.3); opacity: 0; } 55% { opacity: 1; } 74% { transform: rotate(-9deg) scale(0.94); } 100% { transform: rotate(-9deg) scale(1); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .hs-stamp::before { animation: none; } }

        /* === KODING: launch-karta (darsdan kompilyatorga «boradi») === */
        /* === KODING: «aylantirish-vizual» (kod-chip ➜ hikoya-kartalar) + bitta CTA === */
        .kdx { display: flex; align-items: center; gap: clamp(10px,1.8vw,18px); }
        @media (max-width: 760px) { .kdx { flex-direction: column; align-items: stretch; } .kdx-arrow { transform: rotate(90deg); align-self: center; } }
        .kdx-fn { flex-shrink: 0; border-radius: 14px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 12px 28px -10px rgba(${T.shadowBase},0.35); }
        .kdx-fn-bar { display: flex; align-items: center; gap: 8px; background: #141C2B; padding: 8px 13px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #7E92B4; }
        .kdx-fn-code { display: block; padding: clamp(18px,2.4vw,26px) clamp(18px,2.6vw,28px); font-family: 'JetBrains Mono', monospace; font-size: clamp(13px,1.7vw,16.5px); color: ${CODE.text}; white-space: nowrap; }
        .kx-kim { color: #7DB8E8; } .kx-nima { color: ${CODE.attr}; } .kx-natija { color: ${CODE.str}; }
        .kdx-arrow { font-size: clamp(22px,3vw,30px); color: ${T.accent}; flex-shrink: 0; animation: kdx-arrow-nudge 1.6s ease-in-out infinite; }
        @keyframes kdx-arrow-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
        @media (max-width: 760px) { @keyframes kdx-arrow-nudge { 0%, 100% { transform: rotate(90deg) translateX(0); } 50% { transform: rotate(90deg) translateX(6px); } } }
        .kdx-out { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
        .kdx-card { font-family: Georgia, serif; font-size: clamp(14px,1.8vw,16.5px); line-height: 1.55; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: clamp(12px,1.8vw,16px) clamp(14px,2vw,18px); box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25); border-left: 3px solid ${T.accent}; overflow-wrap: anywhere; opacity: 0; animation: fade-step 0.45s ease-out forwards; animation-delay: var(--kd, 0.5s); }
        .kdx-card b { font-weight: 700; }
        .kdx-card .hc-prev-badge { margin-right: 8px; vertical-align: middle; }
        .kdx-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .kdx-cta-sub { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-align: center; }
        @media (prefers-reduced-motion: reduce) { .kdx-arrow { animation: none; } .kdx-card { opacity: 1; animation: none; } }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.65); transition: transform 0.18s, box-shadow 0.18s; animation: kod-btn-pulse 2.2s ease-in-out infinite; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.75); }
        /* Navbat-sharti: tugma faqat navbat unda bo'lganda nafas oladi (88-qonun (a)) */
        .kod-launch-btn.calm { animation: none; }
        /* Takrorlash-yo'li (89-qonun): asosiy harakat bilan raqobatlashmaydigan xira matn-havola */
        .kdx-skip { margin-top: 2px; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
        .kdx-skip:hover { color: ${T.accent}; }
        @keyframes kod-btn-pulse { 0%,100% { box-shadow: 0 14px 30px -8px rgba(91,61,230,0.65); } 50% { box-shadow: 0 14px 38px -4px rgba(110,75,255,0.85); } }
        @media (prefers-reduced-motion: reduce) { .kod-launch-btn { animation: none; } }
        .code-out-empty { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink3}; font-style: italic; margin: 0; }

        /* === PM-KOMPILYATOR (to'liq-ekran, Htmllesson1 relslari, PM palitra) === */
        @keyframes story-drop { 0% { opacity: 0; transform: translateY(-10px) scale(0.97); } 100% { opacity: 1; transform: none; } }
        /* User Story badge — koding aylantirish-vizual kartalarida */
        .hc-prev-badge { display: inline-block; font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 9px; margin-right: 8px; vertical-align: middle; }
        /* hint = ochiladigan yumshoq indigo maslahat (xato-ogohlantirish EMAS) */

        /* === YAKUNIY SO'Z — 3 qadam oqimi === */
        .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step.wide { grid-column: 1 / -1; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .rcp-s { display: block; font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; margin-top: 2px; line-height: 1.4; }
        .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
        .pair-timer-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .pair-now { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; line-height: 1.45; }
        .pair-who { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; vertical-align: middle; }
        .pair-who.b { background: ${T.success}; }
        .pair-clock { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 22px; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .pair-prog { position: relative; height: 8px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; }
        .pair-prog-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); transition: width 1s linear; }
        .pair-prog-mid { position: absolute; left: 50%; top: -3px; bottom: -3px; width: 2px; background: ${T.ink3}; border-radius: 2px; }
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
        .qa-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 620px) { .qa-cards { grid-template-columns: 1fr; } }
        .qa-card { background: ${T.paper}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .qa-ic { font-size: 24px; } .qa-card p { font-size: 13.5px; color: ${T.ink}; margin: 0; line-height: 1.4; } .qa-card b { color: ${T.accent}; }

        /* Uyga-vazifa SHARTNOMA — tanlov-chiplar */
        .hw-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .hw-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); padding: 11px 18px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
        .hw-chip:hover:not(.on) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}55; }
        /* tanlangan = to'ldirilgan indigo (aniq holat) */
        .hw-chip.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }
        .hw-chip.add { color: ${T.accent}; border-style: dashed; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .hw-chip.add.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }

        /* === PM-TOPSHIRIQ KARTASI + 3-QADAM (yakun-sahifadagi uy-vazifa kartasi, jonli to'ladi) === */
        /* «imzolangan brief-hujjat» hissi — chap-accent hoshiya + indigo soya */
        .pmtask { background: ${T.paper}; border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(91,61,230,0.28); border: 1.5px solid ${T.line}; border-left: 5px solid ${T.accent}; }
        .pmtask-head { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: ${T.accentSoft}; }
        .pmtask-tag { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.04em; color: ${T.accent}; }
        .pmtask-id { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: ${T.accent}; background: ${T.paper}; border-radius: 99px; padding: 3px 10px; }
        .pmtask-rows { display: flex; flex-direction: column; }
        .pmtask-row { display: flex; gap: 12px; padding: 11px 16px; align-items: baseline; }
        .pmtask-row + .pmtask-row { border-top: 1px solid ${T.line}; }
        .pmtask-k { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; flex: 0 0 clamp(84px,14vw,110px); }
        .pmtask-v { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; line-height: 1.4; }
        /* tanlov o'zgarganda «Kim uchun» qiymati yumshoq yangilanadi (opacity-only, silkinishsiz) */
        .pmtask-val { display: inline-block; animation: pmval-fade 0.24s ease both; }
        @keyframes pmval-fade { 0% { opacity: 0.25; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .pmtask-val { animation: none; } }
        .pmtask-sub { color: ${T.ink3}; font-size: 0.86em; }
        .pmtask-steps { display: flex; flex-direction: column; gap: 9px; padding: 14px 16px 16px; background: ${T.bg}; }
        .pmtask-step { display: flex; align-items: center; gap: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: ${T.ink2}; }
        .pmtask-step b { color: ${T.accent}; margin-right: 4px; }
        .pmtask-step i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; }
        .pmsteps { background: ${T.bg}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .pmsteps-ol { margin: 0; padding-left: 0; list-style: none; counter-reset: pms; display: flex; flex-direction: column; gap: 9px; }
        .pmsteps-ol li { counter-increment: pms; position: relative; padding-left: 38px; font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; line-height: 1.45; min-height: 26px; display: flex; align-items: center; }
        /* «3 qadam» raqam-doirachalari — to'la doira, indigo, oq halqa bilan */
        .pmsteps-ol li::before { content: counter(pms); position: absolute; left: 0; top: 0; width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🛠️ JONLI PRAKTIKA (self-report) === */
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.5); }
        .lp-done-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + bayram === */
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
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
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

        /* === Konfetti === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === 🏆 PODIUM === */
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
        .pod-my b { color: ${T.accent}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.success}; }
        .pod-dot.bad { background: ${T.err}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }
        /* podium SOLO-ko'rinishi: shaxsiy progress — nishonlar + daftar-holati */
        .pod-solo { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .pod-solo-sec { background: ${T.paper}; border-radius: 14px; padding: 12px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
        .pod-solo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .pod-solo-badges { display: flex; gap: 9px; align-items: center; }
        .pod-solo-b { font-size: 24px; line-height: 1; }
        .pod-solo-b:not(.got) { filter: grayscale(1) opacity(0.45); font-size: 18px; }

        /* === 📒 HIKOYA-DAFTAR — burchak-strip (3 slot, bosilsa yig'iladi) === */
        .sboard { position: fixed; right: 14px; bottom: 80px; z-index: 1500; display: inline-flex; align-items: center; gap: 8px; height: 44px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 0 14px; font-family: 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); opacity: 0.94; transition: box-shadow 0.2s, border-color 0.2s, opacity 0.2s; }
        .sboard:hover { opacity: 1; border-color: ${T.accent}66; box-shadow: 0 14px 30px -10px rgba(91,61,230,0.32); }
        .sboard.full { border-color: ${T.success}66; }
        .sboard.closed { padding: 0 12px; }
        .sboard-ic { font-size: 17px; line-height: 1; }
        .sboard-lbl { font-weight: 800; font-size: 12px; color: ${T.ink2}; letter-spacing: 0.02em; }
        .sboard-slots { display: flex; gap: 5px; }
        .sboard-slot { width: 20px; height: 20px; border-radius: 50%; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.25s; }
        .sboard-slot.ok { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .sboard-slot.big { width: 30px; height: 30px; font-size: 14px; }
        .sboard-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.accent}; font-weight: 700; }
        .sboard.full .sboard-n { color: ${T.success}; }
        @media (max-width: 640px) { .sboard { right: 8px; bottom: 74px; height: 40px; } .sboard-lbl { display: none; } }
        @media (prefers-reduced-motion: reduce) { .sboard-slot.ok { animation: none; } }

        /* === recap 3-qadam SOLO: o'z-o'zini tekshirish kartalari === */
        .qa-tap { border: none; cursor: pointer; text-align: left; font-family: inherit; transition: transform 0.18s, box-shadow 0.18s; }
        .qa-tap:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.22); }
        .qa-tap:active:not(:disabled) { transform: scale(0.98); }
        .qa-tap.openq { cursor: default; box-shadow: 0 6px 16px -6px rgba(18,169,104,0.22); }
        .qa-flip { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.accent}; }
        .qa-ans { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 8px; padding: 6px 10px; line-height: 1.4; }
        @media (prefers-reduced-motion: reduce) { .qa-tap, .qa-tap:hover, .qa-tap:active { transition: none; transform: none; } .qa-ans { animation: none; } }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Yakun-ekran CTA ixcham: so'z kattaligi o'zgarmaydi, faqat kapsula bo'sh joyi qisqaradi
           («Mentorni kuting»dan keyin joy qolib qalin ko'rinmasin — image copy.png etaloni) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        @keyframes cs-ignite { 0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; } 32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; } 38% { opacity: 1; filter: none; } 44% { opacity: .38; filter: saturate(.4) brightness(.65); } 51% { opacity: 1; filter: none; } 57% { opacity: .55; filter: saturate(.5) brightness(.75); } 66%, 100% { opacity: 1; filter: none; } }
        @keyframes cs-breathe { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }
        .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; line-height: 1; user-select: none; color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4); animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
        .cs-tok.back { color: rgba(150,115,240,.16); filter: blur(.6px); }
        @keyframes cs-float { 0%,100% { transform: translate(0,0) rotate(-5deg); } 50% { transform: translate(16px,-14px) rotate(5deg); } }
        .cs-dash { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(190,150,255,.55), transparent); animation: cs-dash-run 5.5s linear infinite; }
        @keyframes cs-dash-run { 0% { transform: translateX(-46px); opacity: 0; } 14% { opacity: .85; } 86% { opacity: .85; } 100% { transform: translateX(76px); opacity: 0; } }
        .cs-thunder { position: absolute; inset: 0; opacity: 0; background: radial-gradient(62% 95% at 50% 0%, rgba(222,192,255,.55), transparent 64%); animation: cs-thunder 6.4s linear infinite; }
        @keyframes cs-thunder { 0%, 90.5%, 100% { opacity: 0; } 91.4% { opacity: .5; } 92.3% { opacity: .07; } 93.4% { opacity: .38; } 95% { opacity: 0; } }
        .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
        .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
        .csn-bolt { width: clamp(30px,4.6vw,54px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
        .csn-boltwrap.flip .csn-bolt { animation-delay: 1s; }
        @keyframes cs-bolt-strike { 0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } 5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); } 9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); } 13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); } 20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
        .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
        .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
        .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
        .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
        .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
        @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic; font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em; background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-wglow 2.8s ease-in-out infinite; }
        .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none; background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
        @keyframes cs-wglow { 0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); } 50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
        @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
        .cs-clickable:hover .cs-word { animation-duration: 1.4s; }
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
        .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
        .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
        .cs-hud-dot { color: rgba(190,150,255,.6); }
        .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
        .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
        @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }

        /* === Kahoot-kutish holatlari === */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }

        /* === MENTOR STATISTIKASI === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.errSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.err}; }
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
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.err}; background: ${T.errSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.errSoft}; border-left: 4px solid ${T.err}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) === */
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
        .rc-ask { font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 18px; max-width: 660px; }
        .rc-nav { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; padding-top: 8px; }
        .rc-dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } .rc-btn { font-size: 13px; padding: 11px 16px; } }

        /* ===== ⚡ ARENA ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; color: rgba(203,173,255,0.16); }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); backdrop-filter: blur(6px); transition: transform 0.25s, color 0.2s, background 0.2s; }
        .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
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
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
        .qz-tile { --gl: 255,255,255; position: relative; display: flex; align-items: center; gap: 14px; border: none; border-radius: 18px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 66px; color: #fff; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(0,0,0,0.55), 0 0 26px -4px rgba(var(--gl),0.42), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -4px 0 rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(0,0,0,0.24); transition: transform 0.14s, opacity 0.3s, box-shadow 0.14s, filter 0.2s; }
        .qz-grid .qz-tile:nth-child(1) { --gl: 255,90,44; }
        .qz-grid .qz-tile:nth-child(2) { --gl: 15,166,214; }
        .qz-grid .qz-tile:nth-child(3) { --gl: 245,166,35; }
        .qz-grid .qz-tile:nth-child(4) { --gl: 34,160,92; }
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); }
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
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
          .lp-done-btn.is-done { animation: none !important; }
        }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={tr2({ uz: "User Story darsi", ru: "Урок про User Story" })} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              {BOARD_SCREEN_IDS.has(SCREEN_META[screen].id) && <StoryBoard />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
            </>}
        </div>
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>;
}
export {
  SCREEN_INTENTS,
  PmUserStoryLesson as default
};
