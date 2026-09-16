// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/JsConditionsLesson.jsx
//          src/compilator/HtmlCompiler.jsx
//  Qayta yig'ish:  node scripts/build-lms.mjs src/2-Modull/JsConditionsLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/JsConditionsLesson.jsx
import React3, { useState as useState4, useEffect as useEffect5, useRef as useRef4, useMemo as useMemo2, useCallback as useCallback3, createContext as createContext2, useContext as useContext2, useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, isValidElement } from "react";

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

// src/live/liveClient.js
var DEFAULT_API_URL = "https://dars-api.coddycamp.uz";
var LIVE_API_URL = "" ? String("").replace(/\/+$/, "") : DEFAULT_API_URL;
var LIVE_ENABLED = !!LIVE_API_URL;
var LIVE_POLL_MS = 2500;
var LIVE_POLL_MAX_MS = 15e3;
var LIVE_HEARTBEAT_MS = 1e4;
var LIVE_STALE_MS = 18e4;
var LMS_SOLO_RECHECK_MS = 2e4;
var API = `${LIVE_API_URL}/api/v1/live`;
async function errorFrom(r, fallback) {
  let msg = "";
  try {
    msg = (await r.json()).message || "";
  } catch {
  }
  const e = new Error(msg || fallback);
  e.status = r.status;
  return e;
}
async function liveRpc(fn, body) {
  const r = await fetch(`${API}/rpc/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  if (!r.ok) throw await errorFrom(r, `${fn}: ${r.status}`);
  if (r.status === 204) return null;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
async function liveGet(pin) {
  const r = await fetch(`${API}/session/${encodeURIComponent(pin)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`get: ${r.status}`);
  return r.json();
}
async function liveList(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
var livePlayers = (pin) => liveList(`${API}/players/${encodeURIComponent(pin)}`);
var liveAnswers = (pin, screenIdx) => liveList(`${API}/answers/${encodeURIComponent(pin)}${screenIdx == null ? "" : `?screen=${encodeURIComponent(screenIdx)}`}`);
var liveQuizAnswers = (pin) => liveList(`${API}/answers/${encodeURIComponent(pin)}?range=arena`);
async function lmsFetch(method, url, liveToken, body) {
  const r = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${liveToken}`, ...body ? { "Content-Type": "application/json" } : {} },
    body: body ? JSON.stringify(body) : void 0
  });
  let data = null;
  try {
    data = await r.json();
  } catch {
  }
  if (!r.ok) {
    const e = new Error(data && data.message || `lms: ${r.status}`);
    e.code = data && data.error || `http_${r.status}`;
    e.status = r.status;
    throw e;
  }
  return data;
}
var lmsJoin = (liveToken, body) => lmsFetch("POST", `${LIVE_API_URL}/api/v1/lms/join`, liveToken, body);
var lmsRestart = (liveToken, lessonId) => lmsFetch("POST", `${LIVE_API_URL}/api/v1/lms/restart`, liveToken, { lesson_id: lessonId });
async function progressPut(liveToken, body, { keepalive = false } = {}) {
  const r = await fetch(`${LIVE_API_URL}/api/v1/me/progress`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${liveToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive
  });
  let data = null;
  try {
    data = await r.json();
  } catch {
  }
  if (!r.ok) {
    const e = new Error(data && data.message || `progress: ${r.status}`);
    e.code = data && data.error || `http_${r.status}`;
    e.status = r.status;
    throw e;
  }
  return data;
}
function peekTokenRole(liveToken) {
  try {
    const part = String(liveToken).split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const role = JSON.parse(atob(part)).role;
    return role === "mentor" || role === "student" ? role : null;
  } catch {
    return null;
  }
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
var _progWriteHook = null;
var setProgWriteHook = (fn) => {
  _progWriteHook = typeof fn === "function" ? fn : null;
};
var progWrite = (id, o) => {
  try {
    localStorage.setItem(_progKey(id), JSON.stringify(o));
  } catch {
  }
  try {
    if (_progWriteHook) _progWriteHook(id, o);
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

// src/live/i18n.js
import React from "react";
var liveLang = "uz";
var setLiveLang = (lang) => {
  liveLang = lang === "ru" ? "ru" : "uz";
};
var getLiveLang = () => liveLang;
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[liveLang] ?? node.uz ?? node.ru ?? "";
};

// src/live/resultDetails.js
var LIM = { questions: 200, attempts: 10, options: 6, text: 300, achievements: 20, name: 40, title: 200, elapsed: 36e5 };
var cut = (v, n) => typeof v === "string" ? v.slice(0, n) : void 0;
var iso = (t) => new Date(t || Date.now()).toISOString().replace(/\.\d{3}Z$/, "Z");
var optText = (o, lang) => o && typeof o === "object" ? String(o[lang] ?? o.uz ?? "") : String(o ?? "");
var attemptsByLesson = /* @__PURE__ */ new Map();
var earnedAtByLesson = /* @__PURE__ */ new Map();
var arenaByLesson = /* @__PURE__ */ new Map();
var ARENA_Q = /^quiz-(\d+)$/;
var KEY = (lessonId) => `ccDetails:${lessonId}`;
var store = () => {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
};
var loaded = /* @__PURE__ */ new Set();
function load(lessonId) {
  if (loaded.has(lessonId)) return;
  loaded.add(lessonId);
  const st = store();
  if (!st) return;
  let o = null;
  try {
    o = JSON.parse(st.getItem(KEY(lessonId)) || "null");
  } catch {
    return;
  }
  if (!o || typeof o !== "object") return;
  const am = attemptsByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  for (const [k, list] of Object.entries(o.attempts || {})) {
    const idx = Number(k);
    if (!Number.isInteger(idx) || !Array.isArray(list) || am.has(idx)) continue;
    am.set(idx, list.filter((t) => t && typeof t === "object" && Number.isFinite(t.at)).slice(0, LIM.attempts));
  }
  attemptsByLesson.set(lessonId, am);
  const em = earnedAtByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  for (const [id, t] of Object.entries(o.earnedAt || {})) if (Number.isFinite(t) && !em.has(id)) em.set(id, t);
  earnedAtByLesson.set(lessonId, em);
  const ar = arenaByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  for (const [k, e] of Object.entries(o.arena || {})) {
    const qi = Number(k);
    if (!Number.isInteger(qi) || ar.has(qi) || !e || typeof e !== "object" || !Number.isFinite(e.at)) continue;
    ar.set(qi, { option: Number.isInteger(e.option) ? e.option : -1, correct: e.correct === true, elapsed_ms: Number.isFinite(e.elapsed_ms) ? e.elapsed_ms : 0, at: e.at });
  }
  arenaByLesson.set(lessonId, ar);
}
function persist(lessonId) {
  const st = store();
  if (!st) return;
  const attempts = {};
  for (const [k, v] of attemptsByLesson.get(lessonId) || []) attempts[k] = v;
  const earnedAt = Object.fromEntries(earnedAtByLesson.get(lessonId) || []);
  const arena = {};
  for (const [k, v] of arenaByLesson.get(lessonId) || []) arena[k] = v;
  try {
    st.setItem(KEY(lessonId), JSON.stringify({ v: 1, attempts, earnedAt, arena }));
  } catch {
  }
}
function logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs } = {}) {
  if (!lessonId || !Number.isInteger(screenIdx)) return;
  load(lessonId);
  if (!attemptsByLesson.has(lessonId)) attemptsByLesson.set(lessonId, /* @__PURE__ */ new Map());
  const m = attemptsByLesson.get(lessonId);
  if (!m.has(screenIdx)) m.set(screenIdx, []);
  const list = m.get(screenIdx);
  if (list.length >= LIM.attempts) return;
  list.push({ option: Number.isInteger(picked) ? picked : -1, answer: cut(texts && texts.picked, LIM.text), elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
  persist(lessonId);
}
function logArena(lessonId, questionId, { picked, correct, elapsedMs } = {}) {
  const m = ARENA_Q.exec(String(questionId || ""));
  if (!lessonId || !m) return false;
  const qi = Number(m[1]);
  load(lessonId);
  if (!arenaByLesson.has(lessonId)) arenaByLesson.set(lessonId, /* @__PURE__ */ new Map());
  const ar = arenaByLesson.get(lessonId);
  if (ar.has(qi) || ar.size >= LIM.questions) return false;
  ar.set(qi, { option: Number.isInteger(picked) ? picked : -1, correct: correct === true, elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
  persist(lessonId);
  return true;
}
function noteEarned(lessonId, ids) {
  if (!lessonId || !Array.isArray(ids)) return;
  load(lessonId);
  if (!earnedAtByLesson.has(lessonId)) earnedAtByLesson.set(lessonId, /* @__PURE__ */ new Map());
  const m = earnedAtByLesson.get(lessonId);
  const now = Date.now();
  let changed = false;
  for (const raw of ids) {
    const id = String(raw);
    if (!m.has(id)) {
      m.set(id, now);
      changed = true;
    }
  }
  if (changed) persist(lessonId);
}
function resetResultDetails(lessonId) {
  attemptsByLesson.delete(lessonId);
  earnedAtByLesson.delete(lessonId);
  arenaByLesson.delete(lessonId);
  loaded.delete(lessonId);
  try {
    store()?.removeItem(KEY(lessonId));
  } catch {
  }
}
function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now, arenaBank } = {}) {
  const lang = langIn === "ru" || langIn === "uz" ? langIn : getLiveLang();
  const finish = now || Date.now();
  load(lessonId);
  const log = attemptsByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  const questions = [];
  (screenMeta || []).forEach((meta, i) => {
    if (!meta || !meta.scored) return;
    const a = answers && answers[i];
    if (!a || typeof a !== "object" || !Number.isInteger(a.picked)) return;
    if (questions.length >= LIM.questions) return;
    const correctIdx = Number.isInteger(a.correctIndex) ? a.correctIndex : Number.isInteger(a.correctIdx) ? a.correctIdx : null;
    const raw = (log.get(i) || []).slice().sort((x, y) => x.at - y.at).slice(0, LIM.attempts);
    const options = Array.isArray(a.options) ? a.options.slice(0, LIM.options).map((o) => optText(o, lang).slice(0, LIM.text)) : void 0;
    const correct = a.correct === true;
    const last = Number.isInteger(a.lastPicked) ? a.lastPicked : a.picked;
    const eventually = correctIdx !== null ? last === correctIdx : a.solved === true;
    const baseAt = Number.isInteger(a.at) ? a.at : finish;
    const fallback = correct || !eventually ? [{ option: last, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: baseAt }] : [{ option: -1, elapsed_ms: 0, at: baseAt, correct: false }, { option: last, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: baseAt, correct: true }];
    const attempts = (raw.length ? raw : fallback).map((t, n) => {
      const o = { n: n + 1, option: t.option, correct: typeof t.correct === "boolean" ? t.correct : correctIdx !== null ? t.option === correctIdx : false, elapsed_ms: t.elapsed_ms, at: iso(t.at) };
      const ans = t.answer ?? (options && t.option >= 0 ? options[t.option] : void 0);
      if (typeof ans === "string") o.answer = ans.slice(0, LIM.text);
      return o;
    });
    if (attempts[0]) attempts[0].correct = correct;
    if (correctIdx === null && eventually && !attempts.some((t) => t.correct)) attempts[attempts.length - 1].correct = true;
    const q = {
      question_id: meta.id && String(meta.id) || `s${i}`,
      kind: "test",
      order: questions.length + 1,
      correct,
      solved: attempts.some((t) => t.correct),
      // F-0909-03: dars bayrog'i emas, urinish-dalili (server result-builder.js:356 bilan bir xil)
      attempts
    };
    const qt = cut(typeof a.question === "string" ? a.question : optText(a.question, lang), LIM.text);
    if (qt) q.question = qt;
    if (options) q.options = options;
    if (correctIdx !== null && correctIdx >= 0 && correctIdx <= 5) q.correct_option = correctIdx;
    const ca = cut(typeof a.correctAnswer === "string" ? a.correctAnswer : options && correctIdx !== null ? options[correctIdx] : void 0, LIM.text);
    if (ca) q.correct_answer = ca;
    questions.push(q);
  });
  const arena = [...(arenaByLesson.get(lessonId) || /* @__PURE__ */ new Map()).entries()].sort((x, y) => x[0] - y[0]);
  for (const [qi, e] of arena) {
    if (questions.length >= LIM.questions) break;
    const bank = Array.isArray(arenaBank) ? arenaBank[qi] : null;
    const rawOpts = bank && (Array.isArray(bank.opts) ? bank.opts : Array.isArray(bank.options) ? bank.options : null);
    const options = rawOpts ? rawOpts.slice(0, LIM.options).map((o) => optText(o, lang).slice(0, LIM.text)) : void 0;
    const correctIdx = bank && Number.isInteger(bank.correct) ? bank.correct : null;
    const attempt = { n: 1, option: e.option, correct: e.correct, elapsed_ms: e.elapsed_ms, at: iso(e.at) };
    if (options && e.option >= 0 && e.option < options.length) attempt.answer = options[e.option];
    const q = { question_id: `quiz-${qi}`, kind: "arena", order: questions.length + 1, correct: e.correct, solved: e.correct, attempts: [attempt] };
    const qt = bank ? cut(typeof (bank.q ?? bank.question) === "string" ? bank.q ?? bank.question : optText(bank.q ?? bank.question, lang), LIM.text) : void 0;
    if (qt) q.question = qt;
    if (options) q.options = options;
    if (correctIdx !== null && correctIdx >= 0 && correctIdx <= 5) q.correct_option = correctIdx;
    if (options && correctIdx !== null && options[correctIdx]) q.correct_answer = options[correctIdx];
    questions.push(q);
  }
  const at = earnedAtByLesson.get(lessonId) || /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new Set();
  const list = [];
  for (const raw of earned instanceof Set ? [...earned] : Array.isArray(earned) ? earned : []) {
    const id = String(raw).toLowerCase();
    if (!/^[a-z0-9_-]{1,32}$/.test(id) || seen.has(id)) continue;
    seen.add(id);
    const def = achievements && (achievements[raw] || achievements[id]) || null;
    const desc = def && def.desc;
    const title = typeof desc === "string" ? desc : desc && (desc[lang] || desc.uz) || def && def.name || id;
    list.push({ id, name: String(def && def.name || id).slice(0, LIM.name), title: String(title).slice(0, LIM.title), earned_at: iso(at.get(String(raw)) ?? at.get(id) ?? finish) });
  }
  list.sort((x, y) => x.earned_at < y.earned_at ? -1 : x.earned_at > y.earned_at ? 1 : 0);
  return { lang, questions, achievements: list.slice(0, LIM.achievements) };
}

// src/live/progressSync.js
var DEBOUNCE_MS = 2e3;
var channels = /* @__PURE__ */ new Map();
function setProgressChannel(lessonId, ch) {
  const prev = channels.get(lessonId);
  if (prev) {
    clearTimeout(prev.timer);
    flush(lessonId, { keepalive: true });
  }
  if (!ch) {
    channels.delete(lessonId);
    return;
  }
  channels.set(lessonId, { ...ch, timer: null, pending: null, inFlight: false });
}
function queueProgress(lessonId, obj) {
  if (obj && Array.isArray(obj.earned)) noteEarned(lessonId, obj.earned);
  const ch = channels.get(lessonId);
  if (!ch || ch.status !== "active" || !obj) return;
  ch.pending = {
    lesson_id: lessonId,
    attempt_id: ch.attemptId,
    screen: Number.isInteger(obj.screen) ? obj.screen : 0,
    total: Number.isInteger(obj.total) && obj.total > 0 ? obj.total : void 0,
    answers: obj.answers && typeof obj.answers === "object" ? obj.answers : {},
    earned: Array.isArray(obj.earned) ? obj.earned.map(String) : [],
    started_at_ms: Number.isInteger(obj.startedAt) ? obj.startedAt : void 0,
    client_ts: Date.now()
  };
  clearTimeout(ch.timer);
  ch.timer = setTimeout(() => flush(lessonId), DEBOUNCE_MS);
}
async function flush(lessonId, { keepalive = false } = {}) {
  const ch = channels.get(lessonId);
  if (!ch || !ch.pending || ch.inFlight) return;
  const body = ch.pending;
  ch.pending = null;
  ch.inFlight = true;
  try {
    const r = await progressPut(ch.token, body, { keepalive });
    if (r && r.status === "finished") {
      ch.status = "finished";
      ch.onFinished?.({ reason: r.finish_reason || "completed" });
    }
  } catch (e) {
    if (e && (e.status === 409 || e.status === 404 || e.status === 401 || e.status === 403)) {
      ch.status = "finished";
      if (e.status === 409) ch.onFinished?.({ reason: "server" });
    } else {
      if (!ch.pending) ch.pending = body;
    }
    ch.onError?.(e);
  } finally {
    ch.inFlight = false;
    if (ch.pending && ch.status === "active" && !ch.timer) ch.timer = setTimeout(() => {
      ch.timer = null;
      flush(lessonId);
    }, DEBOUNCE_MS);
  }
}
function flushAll(keepalive) {
  for (const id of channels.keys()) {
    const ch = channels.get(id);
    clearTimeout(ch.timer);
    ch.timer = null;
    flush(id, { keepalive });
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => flushAll(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flushAll(true);
  });
}
setProgWriteHook(queueProgress);

// src/live/useLiveSession.js
import { useState as useState2, useEffect as useEffect2, useRef as useRef2, useCallback as useCallback2, createContext, useContext } from "react";
var LiveGateCtx = createContext(null);
var STORED_MODES = ["self", "student", "mentor", "solo", "review"];
function useLiveSession(lessonId, answerKey, opts = {}) {
  const liveToken = opts.liveToken || null;
  const lessonVersion = opts.lessonVersion || null;
  const keyRef = useRef2(answerKey);
  keyRef.current = answerKey;
  const initRef = useRef2(void 0);
  if (initRef.current === void 0) initRef.current = LIVE_ENABLED ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState2(() => {
    if (!LIVE_ENABLED) return "self";
    if (init && STORED_MODES.includes(init.mode)) return init.mode;
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
    } catch (e) {
      const st = e && e.status;
      setJoinError(
        st === 401 || st === 403 ? tr2({ uz: "Mentor kodi noto'g'ri.", ru: "Неверный код ментора." }) : st ? tr2({ uz: `Server javob bermadi (xato ${st}). Birozdan keyin urinib ko'ring.`, ru: `Сервер не ответил (ошибка ${st}). Попробуйте чуть позже.` }) : tr2({
          uz: "Serverga ulanib bo'lmadi. Internetni tekshiring — yoki «← Orqaga» bosib, «Kodsiz, o'zim ko'raman» bilan darsni jonli rejimsiz o'tkazing.",
          ru: "Не удалось подключиться к серверу. Проверьте интернет — или нажмите «← Назад» и выберите «Без кода, смотрю сам», чтобы провести урок без живого режима."
        })
      );
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
        setJoinError(tr2({ uz: "Bu kod boshqa darsga tegishli.", ru: "Этот код относится к другому уроку." }));
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
    if (mode === "student") logArena(lessonId, questionId, { picked, correct, elapsedMs });
    if (mode !== "student" && mode !== "solo" || !pin || !playerRef.current) return;
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
    const attempt2 = (n) => {
      liveRpc("submit_answer", body).catch(() => {
        if (n < 3) setTimeout(() => attempt2(n + 1), 3e3 * (n + 1));
      });
    };
    attempt2(0);
  }, [mode, pin, lessonId]);
  const recordAttempt = useCallback2((screenIdx, questionId, picked, elapsedMs, texts) => {
    logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs });
    if (mode !== "student" && mode !== "solo" || !pin || !playerRef.current) return;
    const cut2 = (v) => typeof v === "string" ? v.slice(0, 300) : void 0;
    const t = texts && typeof texts === "object" ? {
      question: cut2(texts.question),
      options: Array.isArray(texts.options) ? texts.options.slice(0, 6).map((o) => cut2(String(o ?? ""))) : void 0,
      picked: cut2(texts.picked),
      correct: cut2(texts.correct),
      lang: texts.lang === "ru" ? "ru" : "uz"
    } : void 0;
    if (t) {
      for (const k of Object.keys(t)) if (t[k] === void 0) delete t[k];
    }
    const body = {
      p_pin: pin,
      p_player_id: playerRef.current.id,
      p_token: playerRef.current.token,
      p_screen: screenIdx,
      p_question_id: questionId || "",
      p_picked: picked,
      p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0)),
      ...t ? { p_texts: t } : {}
    };
    const attempt2 = (n) => {
      liveRpc("record_attempt", body).catch(() => {
        if (n < 3) setTimeout(() => attempt2(n + 1), 3e3 * (n + 1));
      });
    };
    attempt2(0);
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
  const [lms, setLms] = useState2({ state: "idle", choices: null, message: "" });
  const [attempt, setAttempt] = useState2(null);
  const [serverProgress, setServerProgress] = useState2(null);
  const lmsTokenRef = useRef2(null);
  const openChannel = useCallback2((tok2, att) => {
    if (!att || att.status !== "active") {
      setProgressChannel(lessonId, null);
      return;
    }
    setProgressChannel(lessonId, {
      token: tok2,
      attemptId: att.id,
      status: "active",
      onFinished: (info) => setAttempt((a) => a && a.id === att.id ? { ...a, status: "finished", finish_reason: info?.reason || "completed" } : a)
    });
  }, [lessonId]);
  const applyServerSession = useCallback2((p, tok2) => {
    if (!p || typeof p !== "object") return false;
    const prog = p.progress ? { ...p.progress, seq: Date.now() + Math.random() } : null;
    if (p.mode === "mentor" && p.pin && p.token) {
      tokenRef.current = p.token;
      setPin(p.pin);
      setEnded(false);
      setJoinError("");
      setMode("mentor");
      liveStore(lessonId, { mode: "mentor", pin: p.pin, token: p.token });
      setAttempt(null);
      setProgressChannel(lessonId, null);
      return true;
    }
    if (p.mode === "student" && p.pin && p.playerId && p.playerToken) {
      playerRef.current = { id: p.playerId, token: p.playerToken };
      nickRef.current = p.nickname || "";
      if (p.nickname) nickStore(p.nickname);
      lastUpdatedRef.current = null;
      lastSeenRef.current = Date.now();
      const scr = p.lastScreen || 0, mx = Math.max(p.maxScreen || 0, scr);
      setPin(p.pin);
      setMentorScreen(scr);
      setMentorMax(mx);
      setStatus("live");
      setJoinError("");
      setMode("student");
      liveStore(lessonId, { mode: "student", pin: p.pin, lastScreen: scr, maxScreen: mx, playerId: p.playerId, playerToken: p.playerToken, nickname: p.nickname, attemptId: p.attempt?.id });
      setAttempt(p.attempt || null);
      if (prog) setServerProgress(prog);
      openChannel(tok2, p.attempt);
      return true;
    }
    if (p.mode === "solo" && p.pin && p.playerId && p.playerToken) {
      playerRef.current = { id: p.playerId, token: p.playerToken };
      nickRef.current = p.nickname || "";
      if (p.nickname) nickStore(p.nickname);
      setPin(p.pin);
      setStatus("live");
      setJoinError("");
      setMode("solo");
      liveStore(lessonId, { mode: "solo", pin: p.pin, playerId: p.playerId, playerToken: p.playerToken, nickname: p.nickname, attemptId: p.attempt?.id });
      setAttempt(p.attempt || null);
      if (prog) setServerProgress(prog);
      openChannel(tok2, p.attempt);
      return true;
    }
    if (p.mode === "review") {
      setJoinError("");
      setMode("review");
      liveStore(lessonId, { mode: "review", attemptId: p.attempt?.id });
      setAttempt(p.attempt || null);
      if (prog) setServerProgress(prog);
      setProgressChannel(lessonId, null);
      return true;
    }
    return false;
  }, [lessonId, openChannel]);
  const joinWithToken = useCallback2(async (sessionId) => {
    const tok2 = lmsTokenRef.current;
    if (!tok2) return;
    setLms((s) => ({ ...s, state: "joining", message: "" }));
    try {
      const body = { lesson_id: lessonId };
      if (lessonVersion) body.lesson_version = lessonVersion;
      if (sessionId) body.session_id = sessionId;
      if (keyRef.current && peekTokenRole(tok2) === "mentor") body.answer_key = keyRef.current;
      const res = await lmsJoin(tok2, body);
      if (res && Array.isArray(res.choose)) {
        setLms({ state: "choose", choices: res.choose, message: "" });
        return;
      }
      if (applyServerSession(res, tok2)) {
        setLms({ state: "joined", choices: null, message: "" });
        return;
      }
      setLms({ state: "error", choices: null, message: "" });
    } catch (e) {
      const code = e && e.code || "";
      setLms({ state: code === "no_active_session" ? "none" : "error", choices: null, message: String(e && e.message || "") });
    }
  }, [lessonId, lessonVersion, applyServerSession]);
  const restartAttempt = useCallback2(async () => {
    resetResultDetails(lessonId);
    const tok2 = lmsTokenRef.current;
    if (!tok2) return false;
    setBusy(true);
    try {
      const res = await lmsRestart(tok2, lessonId);
      return applyServerSession(res, tok2);
    } catch (e) {
      setJoinError(String(e && e.message || tr2({ uz: "Qaytadan boshlab bo'lmadi.", ru: "Не удалось начать заново." })));
      return false;
    } finally {
      setBusy(false);
    }
  }, [lessonId, applyServerSession]);
  useEffect2(() => {
    if (!LIVE_ENABLED || !liveToken || lmsTokenRef.current === liveToken) return;
    lmsTokenRef.current = liveToken;
    joinWithToken();
  }, [liveToken, joinWithToken]);
  const [liveJoinedNote, setLiveJoinedNote] = useState2(false);
  const attemptId = attempt?.id || null, attemptStatus = attempt?.status || null;
  useEffect2(() => {
    if (mode !== "solo" || lms.state !== "joined" || !attemptId || attemptStatus !== "active") return;
    const tok2 = lmsTokenRef.current;
    if (!tok2 || peekTokenRole(tok2) !== "student") return;
    let on = true, inFlight = false;
    const recheck = async () => {
      if (!on || inFlight || typeof document !== "undefined" && document.hidden) return;
      inFlight = true;
      try {
        const body = { lesson_id: lessonId };
        if (lessonVersion) body.lesson_version = lessonVersion;
        const res = await lmsJoin(tok2, body);
        if (!on || !res || res.mode !== "student") return;
        resetResultDetails(lessonId);
        if (applyServerSession(res, tok2)) setLiveJoinedNote(true);
      } catch {
      } finally {
        inFlight = false;
      }
    };
    const id = setInterval(recheck, LMS_SOLO_RECHECK_MS);
    const onVis = () => {
      if (typeof document !== "undefined" && !document.hidden) recheck();
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      on = false;
      clearInterval(id);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, lms.state, attemptId, attemptStatus, lessonId, lessonVersion, applyServerSession]);
  useEffect2(() => {
    if (!liveJoinedNote) return;
    const t = setTimeout(() => setLiveJoinedNote(false), 8e3);
    return () => clearTimeout(t);
  }, [liveJoinedNote]);
  useEffect2(() => () => setProgressChannel(lessonId, null), [lessonId]);
  return {
    mode,
    pin,
    mentorScreen,
    mentorMax,
    status,
    mentorAlive,
    connected,
    ended,
    joinError,
    busy,
    startMentor,
    joinStudent,
    selfStudy,
    reportScreen,
    endSession,
    submitAnswer,
    recordAttempt,
    quiz,
    quizControl,
    revealScreen,
    mentorReveal,
    playerId: playerRef.current?.id || null,
    nickname: nickRef.current,
    lms,
    joinWithToken,
    hasLmsToken: !!liveToken,
    attempt,
    serverProgress,
    restartAttempt,
    liveJoinedNote
  };
}

// src/live/useServerProgress.js
import { useEffect as useEffect3, useRef as useRef3 } from "react";
function useServerProgress(live, refs) {
  const seenRef = useRef3(null);
  const p = live && live.serverProgress;
  useEffect3(() => {
    if (!p || !p.seq || seenRef.current === p.seq) return;
    seenRef.current = p.seq;
    const { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total } = refs || {};
    let answers = p.answers && typeof p.answers === "object" ? p.answers : {};
    let earned = Array.isArray(p.earned) ? p.earned : [];
    let screen = Number.isInteger(p.screen) ? p.screen : 0;
    if (p.total && total && p.total !== total) {
      answers = {};
      earned = [];
      screen = 0;
    }
    if (total) screen = Math.min(Math.max(screen, 0), total - 1);
    if (typeof setAnswers === "function") setAnswers(answers);
    if (typeof setScreen === "function") setScreen(screen);
    if (earnedRef && typeof earnedRef === "object") earnedRef.current = new Set(earned);
    if (typeof setEarned === "function") setEarned(new Set(earned));
    if (startTimeRef && typeof startTimeRef === "object") startTimeRef.current = Number.isInteger(p.startedAt) ? p.startedAt : Date.now();
  }, [p]);
}

// src/live/LiveUI.jsx
import React2, { useState as useState3, useEffect as useEffect4 } from "react";
var LT = { bg: "#F6F4EF", ink: "#0E0E10", ink2: "#5A5A60", ink3: "#A7A6A2", paper: "#FFFFFF", accent: "#FF4F28", accentSoft: "#FFE8E1", success: "#1F7A4D" };
var _liveBtnPri = { background: LT.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer" };
var _liveBadgeS = { position: "fixed", top: 2, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: "2px 14px", fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: "0 2px 10px rgba(58,53,48,0.12)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", maxWidth: "92vw" };
var _liveDot = (c) => ({ width: 8, height: 8, borderRadius: 99, background: c, display: "inline-block" });
function LiveBigCode({ pin, onClose }) {
  const digits = String(pin || "").split("");
  const overlay = { position: "fixed", inset: 0, zIndex: 1e4, background: LT.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,40px)", textAlign: "center" };
  const box = { background: LT.paper, color: LT.ink, borderRadius: "clamp(10px,1.6vw,18px)", fontFamily: "monospace", fontWeight: 800, lineHeight: 1, fontSize: "clamp(48px,13vw,150px)", padding: "clamp(10px,2vw,28px) clamp(12px,2.2vw,30px)", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" };
  return <div style={overlay}>
      <div style={{ fontSize: "clamp(13px,2vw,18px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: LT.accent, marginBottom: "clamp(14px,3vw,28px)" }}>{tr2({ uz: "Jonli darsga qo'shilish", ru: "Подключение к живому уроку" })}</div>
      <div style={{ display: "flex", gap: "clamp(6px,1.4vw,16px)", justifyContent: "center", flexWrap: "wrap" }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: "#fff", opacity: 0.85, fontSize: "clamp(15px,2.2vw,22px)", maxWidth: 640, margin: "clamp(20px,4vw,36px) 0 0", lineHeight: 1.5 }}>{tr2({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: "#fff" }}>«👨‍🎓 O'quvchiman»</b> → shu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: "#fff" }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: "clamp(22px,4vw,40px)", background: LT.accent, color: "#fff", border: "none", borderRadius: 14, padding: "clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)", fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 700, cursor: "pointer" }}>{tr2({ uz: "Darsni boshlash →", ru: "Начать урок →" })}</button>
    </div>;
}
function LiveGate({ live, title = "Jonli dars" }) {
  const [code, setCode] = useState3("");
  const [nick, setNick] = useState3(() => nickRead());
  const [mentorCode, setMentorCode] = useState3("");
  const [role, setRole] = useState3("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  const lms = live.lms || { state: "idle" };
  const [pinFallback, setPinFallback] = useState3(false);
  if (lms.state === "joining" || live.hasLmsToken && lms.state === "idle") {
    return <div style={wrap}><div style={card} data-live="lms-joining">
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr2(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Darsga ulanmoqda…", ru: "Подключение к уроку…" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "LMS orqali avtomatik kirish. Bir necha soniya.", ru: "Автоматический вход через LMS. Несколько секунд." })}</p></div>
    </div></div>;
  }
  if (lms.state === "choose" && !pinFallback && Array.isArray(lms.choices)) {
    const when = (iso2) => {
      try {
        return new Date(iso2).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } catch {
        return "";
      }
    };
    return <div style={wrap}><div style={card} data-live="lms-choose">
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr2(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Qaysi darsga kirasiz?", ru: "На какой урок войти?" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Hozir bir nechta jonli dars ketmoqda.", ru: "Сейчас идёт несколько живых уроков." })}</p></div>
      {lms.choices.map((c) => <button key={c.session_id} onClick={() => live.joinWithToken(c.session_id)} style={{ ..._liveBtnPri, display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>{tr2(c.lesson_title) || tr2(title)}</span><span style={{ opacity: 0.8, fontWeight: 600 }}>{when(c.started_at)}</span>
        </button>)}
      <button onClick={() => setPinFallback(true)} style={link}>{tr2({ uz: "Kod bilan kiraman →", ru: "Войду по коду →" })}</button>
    </div></div>;
  }
  const lmsNote = lms.state === "none" ? tr2({ uz: "Guruhingizda hozir jonli dars yo'q. Kod bilan kiring yoki o'zingiz ko'ring.", ru: "В вашей группе сейчас нет живого урока. Войдите по коду или смотрите сами." }) : lms.state === "error" ? tr2({ uz: "Avtomatik kirish bo'lmadi. Kod bilan kiring.", ru: "Автоматический вход не удался. Войдите по коду." }) : "";
  if (role === "mentor") {
    return <div style={wrap}><div style={card}>
      <div style={{ textAlign: "center" }}><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "0 0 4px" }}>{tr2({ uz: "🧑‍🏫 Mentor kirishi", ru: "🧑‍🏫 Вход для ментора" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor kodini kiriting.", ru: "Введите код ментора." })}</p></div>
      <input value={mentorCode} onChange={(e) => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr2({ uz: "Mentor kodi", ru: "Код ментора" })} onKeyDown={(e) => {
      if (e.key === "Enter") live.startMentor(mentorCode);
    }} style={{ width: "100%", padding: "14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: "center", outline: "none" }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr2({ uz: "Tekshirilmoqda…", ru: "Проверка…" }) : tr2({ uz: "Kirish →", ru: "Войти →" })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
      <button onClick={() => {
      setRole("student");
      setMentorCode("");
    }} style={link}>{tr2({ uz: "← Orqaga", ru: "← Назад" })}</button>
    </div></div>;
  }
  return <div style={wrap}><div style={card}>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr2(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr2({ uz: "Darsga qo'shilish", ru: "Присоединиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr2({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от ментора и своё имя." })}</p></div>
    <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: "100%", padding: "16px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em", textAlign: "center", outline: "none" }} />
    <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={24} placeholder={tr2({ uz: "Ismingiz (masalan: Ali)", ru: "Ваше имя (например: Али)" })} onKeyDown={(e) => {
    if (e.key === "Enter") live.joinStudent(code, nick);
  }} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: "center", outline: "none" }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr2({ uz: "Ulanmoqda…", ru: "Подключение…" }) : tr2({ uz: "Qo'shilish →", ru: "Присоединиться →" })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
    {lmsNote && <div data-live="lms-note" style={{ color: LT.ink2, fontSize: 13, textAlign: "center", background: LT.bg, borderRadius: 10, padding: "8px 10px" }}>{lmsNote}</div>}
    {
    /* Jonli dars bo'lmasa (uyda, keyinroq) — darsni kodsiz ochish yo'li. Ilgari bu yo'l yo'q edi (F-0903-01). */
  }
    <button data-live="self" onClick={() => live.selfStudy()} style={link}>{tr2({ uz: "Kodsiz, o'zim ko'raman →", ru: "Без кода, смотрю сам →" })}</button>
    <button onClick={() => {
    setRole("mentor");
    setCode("");
  }} title="Mentor" aria-label="Mentor" style={{ position: "absolute", bottom: 10, right: 12, background: "none", border: "none", fontSize: 16, opacity: 0.3, cursor: "pointer", lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>;
}
function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState3(false);
  const [nPlayers, setNPlayers] = useState3(null);
  useEffect4(() => {
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
    if (live.ended) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr2({ uz: "🔓 O'quvchilar erkin qilindi", ru: "🔓 Ученики отпущены" })}</div>;
    return <>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div data-tour="live" className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> Kod: <b style={{ fontFamily: "monospace", letterSpacing: "0.08em" }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr2({ uz: "Kodni katta ko'rsatish", ru: "Показать код крупно" })} style={{ marginLeft: 6, background: LT.ink, color: "#fff", border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr2({ uz: "📺 Ko'rsatish", ru: "📺 Показать" })}</button>
        <button onClick={() => {
      if (window.confirm(tr2({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: "Отпустить учеников? Они продолжат самостоятельно." }))) live.endSession();
    }} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr2({ uz: "🔓 Erkin qilish", ru: "🔓 Отпустить" })}</button>
      </div>
    </>;
  }
  const restartBtn = <button data-live="restart" disabled={live.busy} onClick={() => live.restartAttempt && live.restartAttempt()} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr2({ uz: "↻ Qaytadan boshlash", ru: "↻ Начать заново" })}</button>;
  if (live.mode === "solo") {
    const done = live.attempt && live.attempt.status === "finished";
    return <div data-tour="live" data-live="badge-solo" className="live-badge" style={_liveBadgeS}>
      <span style={_liveDot(done ? LT.ink3 : LT.success)} /> {done ? tr2({ uz: "✓ Yakunlandi — javoblaringiz saqlandi", ru: "✓ Завершено — ответы сохранены" }) : tr2({ uz: "📘 Mustaqil rejim", ru: "📘 Самостоятельный режим" })}
      {!done && live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}
      {done && restartBtn}
    </div>;
  }
  if (live.mode === "review") {
    return <div data-tour="live" data-live="badge-review" className="live-badge" style={_liveBadgeS}>
      <span style={_liveDot(LT.ink3)} /> {tr2({ uz: "👁 Ko'rish rejimi — oldingi javoblaringiz", ru: "👁 Режим просмотра — ваши прежние ответы" })}
      {restartBtn}
    </div>;
  }
  if (live.mode === "student") {
    if (live.liveJoinedNote) return <div data-tour="live" data-live="badge-joined" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr2({ uz: "🎉 Mentor darsni boshladi — jonli darsga ulandingiz", ru: "🎉 Ментор начал урок — вы подключены к живому уроку" })}</div>;
    if (live.status === "ended") return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr2({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: "🔓 Свободный режим — продолжайте сами" })}</div>;
    if (!live.mentorAlive) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr2({ uz: "⚠️ Mentor uzildi — erkin rejim", ru: "⚠️ Ментор отключился — свободный режим" })}</div>;
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot("#FFD380")} /> {tr2({ uz: "🔄 Qayta ulanmoqda…", ru: "🔄 Переподключение…" })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr2({ uz: "👨‍🏫 Mentor:", ru: "👨‍🏫 Ментор:" })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

// src/2-Modull/JsConditionsLesson.jsx
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
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
  shadowBase: "58, 53, 48",
  line: "#E9E6DF"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8", kw: "#C792EA", num: "#F78C6C", vr: "#82AAFF", bool: "#FFCB6B" };
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
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var PRACTICE_DONE_BASE = 500;
var useLang = () => useContext2(LangContext);
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState4(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect5(() => {
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
    const load2 = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      this.voicesByLang.ru = v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesByLang.uz = v.find((x) => x.lang.startsWith("uz")) || v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesReady = true;
    };
    load2();
    if (window.speechSynthesis.onvoiceschanged !== void 0) window.speechSynthesis.onvoiceschanged = load2;
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
  const [state, setState] = useState4({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef4(null);
  const segmentsRef = useRef4(segments);
  const key = segments ? JSON.stringify(segments) : "";
  const prevKey = useRef4(key);
  if (prevKey.current !== key) {
    segmentsRef.current = segments;
    prevKey.current = key;
  }
  const stable = segmentsRef.current;
  useEffect5(() => {
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
  const triggerEvent = useCallback3((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const replay = useCallback3(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback3(() => {
    setState((p) => {
      const m = !p.muted;
      if (m && engineRef.current) engineRef.current.stop();
      return { ...p, muted: m };
    });
  }, []);
  return { ...state, triggerEvent, replay, toggleMute };
}
var __lang2 = "uz";
var tr3 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React3.isValidElement(node)) return node;
  return node[__lang2] ?? node.uz ?? node.ru ?? "";
};
var LESSON_META = { lessonId: "js-cond-01-v18", lessonTitle: { uz: "JavaScript — if/else", ru: "JavaScript — if/else" } };
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
  // F-0914: boolean (ID-karta ipi) else testidan keyin — o'sha misol davom etadi
  { id: "s8", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s13", type: "case", template: "custom", scored: false, scope: null },
  // F-0914-06: = va == debuggingdan oldin (testi bilan birga); s10/s12 (ichma-ich) olib tashlandi
  { id: "s6", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s14", type: "case", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "selse", type: "case", template: "custom", scored: false, scope: null },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "review", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
var Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : void 0}>{children}</div>;
function AchCounter() {
  const earned = useContext2(AchCtx);
  const gate = useContext2(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef4(count);
  const [bump, setBump] = useState4(false);
  const [open, setOpen] = useState4(false);
  useEffect5(() => {
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
var Kw = ({ children }) => <span style={{ color: CODE.kw }}>{children}</span>;
var Vr = ({ children }) => <span style={{ color: CODE.vr }}>{children}</span>;
var St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var Nm = ({ children }) => <span style={{ color: CODE.num }}>{children}</span>;
var Op = ({ children }) => <span style={{ color: CODE.punct }}>{children}</span>;
var Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: "italic" }}>{children}</span>;
var Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState4(false);
  const contentRef = useRef4(null);
  useEffect5(() => {
    setMCollapsed(false);
  }, [screen]);
  const setCollapsed = useCallback3((v) => {
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
var NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr3({ uz: "Orqaga", ru: "Назад" })}</button>;
var NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  const lbl = label != null ? tr3(label) : tr3({ uz: "Davom etish", ru: "Продолжить" });
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr3({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr3({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : freeRide && disabled ? tr3({ uz: "Davom etish", ru: "Продолжить" }) : lbl}</button>;
};
var FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState4(show);
  const [visible, setVisible] = useState4(false);
  const ref = useRef4(null);
  useEffect5(() => {
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
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React3.Fragment key={i}><span className="rc-chip">{tr3(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React3.Fragment>)}</div>;
var RECAPS = {
  // s4 — "if blokining ichidagi kod qachon ishlaydi?" (to'g'ri: Shart rost/true bo'lganda)
  4: {
    title: { uz: "if qachon ishlaydi?", ru: "Когда работает if?" },
    cards: [
      {
        ic: "🔋",
        h: { uz: "if — shart rost bo'lsagina", ru: "if — только если условие истинно" },
        body: { uz: <>Telefon zaryad <b>20% dan kam</b> bo'lsa ogohlantiradi. if ham shunday: shart <b>rost (true)</b> bo'lsa — ichidagi kod ishlaydi, yolg'on bo'lsa — o'tkazib yuboriladi.</>, ru: <>Телефон предупреждает, когда заряд <b>меньше 20%</b>. if работает так же: если условие <b>истинно (true)</b> — код внутри работает, если ложно — пропускается.</> },
        vis: <RcFlow items={[{ uz: "Shart", ru: "Условие" }, { uz: "rost (true)?", ru: "истина (true)?" }, { uz: "kod ishlaydi", ru: "код работает" }]} />,
        ask: { uz: "Zaryad 50% bo'lsa, telefon ogohlantiradimi?", ru: "Если заряд 50%, телефон предупредит?" }
      },
      {
        ic: "🔒",
        h: { uz: "PIN-kod to'g'ri bo'lsagina ochiladi", ru: "Открывается, только если PIN-код верный" },
        body: { uz: <>Telefon PIN-kodni tekshiradi: <b>to'g'ri</b> bo'lsa — ochiladi (rost), noto'g'ri bo'lsa — qulf turadi. if ham <b>faqat shart bajarilsa</b> ichidagi kodni ishga tushiradi.</>, ru: <>Телефон проверяет PIN-код: <b>верный</b> — открывается (истина), неверный — остаётся заблокированным. if тоже запускает код внутри, <b>только если условие выполнено</b>.</> },
        vis: <RcFlow items={[{ uz: "PIN-kod 1234", ru: "PIN-код 1234" }, { uz: "to'g'ri → true", ru: "верный → true" }, { uz: "ochiladi", ru: "открывается" }]} />
      },
      {
        ic: "🙅",
        h: { uz: '"Doim" ham, "hech qachon" ham emas', ru: "Не «всегда» и не «никогда»" },
        body: { uz: <>if har safar ishlab ketmaydi va butunlay o'chib qolmaydi — u <b>shartga qarab</b> qaror qiladi. Shart rost bo'lgan safar ishlaydi, yolg'on bo'lganda esa o'tkazib yuboradi.</>, ru: <>if не срабатывает каждый раз и не выключается насовсем — он решает <b>по условию</b>. Когда условие истинно — работает, когда ложно — пропускает.</> }
      }
    ]
  },
  // s5b — "Shart false (yolg'on) bo'lsa, qaysi blok ishlaydi?" (to'g'ri: else bloki)
  6: {
    title: { uz: "false bo'lsa — else", ru: "Если false — else" },
    cards: [
      {
        ic: "🔀",
        h: { uz: `else — "aks holda" yo'li`, ru: "else — путь «иначе»" },
        body: { uz: <>if va else — bu <b>yo'l ayrilishi</b>. Shart rost bo'lsa — <b>if</b> yo'lidan yurasiz. Rost bo'lmasa (false) — <b>else</b> yo'lidan yurasiz. Ikkalasi bir vaqtda emas.</>, ru: <>if и else — это <b>развилка дорог</b>. Если условие истинно — вы идёте по пути <b>if</b>. Если нет (false) — по пути <b>else</b>. Никогда по обоим сразу.</> },
        vis: <RcFlow items={[{ uz: "Shart false", ru: "Условие false" }, { uz: "if o'tkaziladi", ru: "if пропускается" }, { uz: "else ishlaydi", ru: "работает else" }]} />,
        ask: { uz: `Test topshirmadingizmi? Unda "aks holda" nima bo'ladi?`, ru: "Не сдали тест? Тогда что случится «иначе»?" }
      },
      {
        ic: "☔",
        h: { uz: "Kundalik misol", ru: "Пример из жизни" },
        body: { uz: <>«Agar <b>yomg'ir yog'sa</b> — soyabon ol, <b>aks holda</b> — quyoshoynak ol.» Yomg'ir yo'q (shart false) bo'lsa, birinchi buyruq tashlanadi va <b>else</b>dagi «quyoshoynak ol» bajariladi.</>, ru: <>«Если <b>идёт дождь</b> — возьми зонт, <b>иначе</b> — возьми солнечные очки.» Если дождя нет (условие false), первая команда отбрасывается и выполняется «возьми очки» из <b>else</b>.</> },
        vis: <RcFlow items={[{ uz: "yomg'ir yo'q = false", ru: "дождя нет = false" }, "else", { uz: "quyoshoynak", ru: "очки" }]} />
      },
      {
        ic: "🎯",
        h: { uz: "Doim bittasi ishlaydi", ru: "Всегда работает один" },
        body: { uz: <>if/else da <b>har doim aniq bitta</b> blok ishlaydi — yo if, yo else. Shart false bo'lganda if bloki chetlab o'tiladi va <b>else bloki</b> bajariladi.</>, ru: <>В if/else <b>всегда работает ровно один</b> блок — либо if, либо else. Когда условие false, блок if обходится и выполняется <b>блок else</b>.</> }
      }
    ]
  },
  // s9 — "Ikki qiymat tengligini tekshirish uchun qaysi belgi?" (to'g'ri: ==) — ekran 12-indeksda (F-0914-06)
  12: {
    title: { uz: "== tenglikni tekshiradi", ru: "== проверяет равенство" },
    cards: [
      {
        ic: "⚖️",
        h: { uz: '== — bu "tengmi?" savoli', ru: "== — это вопрос «равно ли?»" },
        body: { uz: <>Ikki teng belgi <b>==</b> ikki qiymatni solishtiradi va <b>«tengmi?»</b> deb so'raydi. Javob rost yoki yolg'on bo'ladi. Masalan <b>pin == 1234</b> — kiritilgan PIN-kod aynan 1234mi?</>, ru: <>Два знака равно <b>==</b> сравнивают два значения и спрашивают: <b>«равны ли?»</b>. Ответ — истина или ложь. Например <b>pin == 1234</b> — введённый PIN-код ровно 1234?</> },
        vis: <RcFlow items={["pin", "==", "1234 ?"]} />,
        ask: { uz: "7 == 7 — bu rostmi yoki yolg'onmi?", ru: "7 == 7 — это истина или ложь?" }
      },
      {
        ic: "📥",
        h: { uz: "= esa qiymat BERADI", ru: "А = ДАЁТ значение" },
        body: { uz: <>Bitta teng <b>=</b> — bu tekshirish emas, <b>qutiga qiymat solish</b>: <b>score = 100</b> degani «score qutisiga 100 ni joyla». Tekshirmoqchi bo'lsangiz — <b>==</b> yozing.</>, ru: <>Один знак <b>=</b> — это не проверка, а <b>укладка значения в коробку</b>: <b>score = 100</b> значит «положи 100 в коробку score». Хотите проверить — пишите <b>==</b>.</> },
        vis: <RcFlow items={[{ uz: "= beradi", ru: "= даёт" }, { uz: "== tekshiradi", ru: "== проверяет" }]} sep="·" />
      },
      {
        ic: "🧩",
        h: { uz: "Boshqa belgilar boshqa ish", ru: "Другие знаки — другая работа" },
        body: { uz: <>+ belgisi <b>qo'shadi</b>, &lt; esa <b>kichikligini</b> tekshiradi. Shartda «tengmi?» deb so'ramoqchi bo'lsangiz — <b>==</b> yozing.</>, ru: <>Знак + <b>складывает</b>, а &lt; проверяет «<b>меньше</b>». Хотите спросить в условии «равно ли?» — пишите <b>==</b>.</> }
      }
    ]
  }
};
function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState4(0);
  useEffect5(() => {
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
        <span className="rc-tag">📖 {tr3({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })}</span>
        <span className="rc-title">{tr3(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr3({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr3(card.h)}</h2>
        <p className="rc-body">{tr3(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr3({ uz: "Sinfga savol:", ru: "Вопрос классу:" })} {tr3(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr3({ uz: "Oldingi", ru: "Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr3({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>✓ {tr3({ uz: "Tushunarli — davom etamiz", ru: "Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr3({ uz: "Keyingisi", ru: "Дальше" })} →</button>}
      </div>
    </div>;
}
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState4({ players: null, rows: [] });
  useEffect5(() => {
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
        <span className="mstats-lbl">📊 {tr3({ uz: "Jonli natija", ru: "Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr3({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr3({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>🔓 {tr3({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(answered / total * 100) : 0}%` }} /></div>
      {reveal ? <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr3({ uz: "to'g'ri", ru: "верно" })} ✅</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr3({ uz: "xato", ru: "ошибка" })} ❌</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr3({ uz: "kutilmoqda", ru: "ожидаем" })} ⏳</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr3({ uz: "javob berdi", ru: "ответили" })} 📨</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr3({ uz: "kutilmoqda", ru: "ожидаем" })} ⏳</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">🙈 {tr3({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "Кто что выбрал и число ✅/❌ скрыто — по нажатию «Открыть результат» всё откроется сразу и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? tr3({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} уч. · ${pct}%` }) : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr3({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Перед тем как продолжить, коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr3({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr3(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr3({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr3({ uz: "Qisqa takrorlash", ru: "Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr3({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr3({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить трудно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr3({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr3(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr3({ uz: "Kutilmoqda:", ru: "Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr3({ uz: "Ko'pchilik adashdi — mavzu tushunarsiz qolganga o'xshaydi. Yana bir bor tushuntiring.", ru: "Большинство ошиблось — похоже, тема осталась непонятной. Объясните ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr3({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: "on_mount", waits_for: { type: "option_picked" } }] : null);
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef4(Date.now());
  const [picked, setPicked] = useState4(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState4(storedAnswer ? storedAnswer.solved ?? storedAnswer.picked === correctIdx : false);
  const firstCorrectRef = useRef4(storedAnswer ? storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null : null);
  const [mReveal, setMReveal] = useState4(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState4(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => {
    setMReveal(true);
    if (live) live.mentorReveal(screen);
    if (storedAnswer === void 0) onAnswer(screen, { mentorRevealed: true });
  };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect5(() => {
    if (isMentorLive && liveRevealScreen === screen) setMReveal(true);
  }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    const optTexts = options.map((o) => tr3(o));
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (live && live.recordAttempt) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: optTexts, picked: optTexts[i], correct: optTexts[correctIdx], lang: typeof __lang2 !== "undefined" && __lang2 === "ru" ? "ru" : "uz" });
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
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr3({ uz: "Davom etish", ru: "Продолжить" }) : tr3({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr3({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr3({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr3({ uz: "To'g'ri javobni toping", ru: "Найдите верный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "safe center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>⚡ {tr3({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, думайте перед кликом!" })}</p>}
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: picked !== null ? 8 : 11 }}>
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
    return <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? "clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)" : "clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)", fontSize: "clamp(15px,1.85vw,17px)", display: "flex", alignItems: "center", gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr3(opt))}</span>
              </button>;
  })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : solved && !wrongLocked} neutral={waiting}>
          <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: waiting ? T.blue : isMentorLive || solved && !wrongLocked ? T.success : T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isMentorLive ? fmtCode(tr3({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr3(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr3(options[correctIdx])}` })) : waiting ? tr3({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? fmtCode(tr3({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr3(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr3(options[correctIdx])}` })) : solved ? tr3({ uz: "To'g'ri", ru: "Верно" }) : tr3({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(tr3(isMentorLive ? explainCorrect : waiting ? { uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас вы узнаете верный ответ." } : wrongLocked ? explainWrong[picked] ?? explainWrong.default : solved ? explainCorrect : explainWrong[picked] ?? explainWrong.default))}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
       Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */
  }
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 {tr3({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
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
  const [off, setOff] = useState4(C);
  useEffect5(() => {
    const t = setTimeout(() => setOff(C * (1 - PCT)), 200);
    return () => clearTimeout(t);
  }, [C, PCT]);
  return <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + "40"} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr3({ uz: "to'g'ri javob", ru: "верных ответов" })}</div></div>
    </div>;
}
var Mentor = ({ children }) => {
  const ctx = useContext2(MentorCtx) || {};
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
        <span className="mentor-name">{tr3({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> · {tr3({ uz: "ko'rsatmani ochish", ru: "открыть подсказку" })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var BoolPill = ({ value, pulse }) => <span className={pulse ? `pop-in ${value ? "ring-green" : "ring-red"}` : void 0} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: value ? T.success : T.accent, background: value ? T.successSoft : T.accentSoft, padding: "5px 12px", borderRadius: 99 }}>{value ? "✓ true" : "✗ false"}</span>;
var Zoomable = ({ children }) => {
  const [big, setBig] = useState4(false);
  useEffect5(() => {
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
        <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr3({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr3({ uz: "Kattalashtirish", ru: "Увеличить" })} title={big ? tr3({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr3({ uz: "Kattalashtirish", ru: "Увеличить" })}>{big ? "✕" : "⛶"}</button>
        {children}
      </div>
    </>;
};
var HOOK_PINS = ["0000", "1234", "4321"];
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: "s0", text: `Telefoningizning PIN-kodi 1234. Har xil PIN-kod kiritib ko'ring: telefon qachon ochiladi, qachon yo'q? Telefon bu qarorni qanday qabul qiladi?`, trigger: "on_mount", waits_for: { type: "option_picked" } }]);
  const [picked, setPicked] = useState4(storedAnswer?.picked ?? null);
  const [pin, setPin] = useState4("0000");
  const unlocked = pin === "1234";
  const OPTS = [
    { id: "a", label: { uz: "Tasodifan — goh ochiladi, goh yo'q", ru: "Случайно — то откроется, то нет" } },
    { id: "b", label: { uz: "Tekshiradi: kiritilgan PIN-kod to'g'rimi?", ru: "Проверяет: введённый PIN-код верный?" } },
    { id: "c", label: { uz: "Har qanday PIN-kod bilan ochiladi", ru: "Открывается с любым PIN-кодом" } }
  ];
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
    audio.triggerEvent("option_picked");
  };
  return <Stage eyebrow={tr3({ uz: "Kirish", ru: "Введение" })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr3({ uz: <>PIN-kodni kiritsangiz, telefon <span className="italic" style={{ color: T.accent }}>qachon</span> ochiladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Когда</span> телефон откроется после ввода PIN-кода?</> })}</h1>
        <Mentor>{tr3({ uz: <>Telefoningizning PIN-kodi — <b style={{ color: T.ink }}>1234</b>. Har xil PIN-kod kiritib ko'ring: telefon <b style={{ color: T.ink }}>qachon ochiladi</b>, qachon yo'q?</>, ru: <>PIN-код вашего телефона — <b style={{ color: T.ink }}>1234</b>. Попробуйте разные PIN-коды: <b style={{ color: T.ink }}>когда телефон откроется</b>, а когда нет?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr3({ uz: "PIN-kodni kiriting", ru: "Введите PIN-код" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {HOOK_PINS.map((p) => <button key={p} className={`chip ${pin === p ? "chip-on" : ""}`} onClick={() => setPin(p)}><span className="mono">{p}</span></button>)}
            </div>
            <div style={{ background: unlocked ? T.successSoft : T.accentSoft, borderRadius: 16, padding: "18px 16px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.16)`, transition: "background 0.35s ease" }}>
              <div className={`lock-phone ${unlocked ? "open" : "shut"}`} key={pin}><span className="lock-ic">{unlocked ? "🔓" : "🔒"}</span><span className="lock-pin mono">{pin}</span></div>
              <p className="demo-swap" key={pin + "t"} style={{ fontFamily: "Georgia, serif", fontWeight: 700, color: unlocked ? T.success : T.accent, margin: "12px 0 2px", fontSize: "clamp(16px,2.4vw,20px)" }}>{unlocked ? tr3({ uz: "✅ Telefon ochildi!", ru: "✅ Телефон открылся!" }) : tr3({ uz: "⛔ PIN-kod noto'g'ri", ru: "⛔ Неверный PIN-код" })}</p>
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr3({ uz: "Telefon qanday qaror qiladi?", ru: "Как телефон принимает решение?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr3(o.label)}</span>
                  </button>;
  })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{picked === "b" ? tr3({ uz: <>To'g'ri! Telefon <b>shartni</b> tekshiradi: PIN-kod to'g'rimi? Buni <span className="mono">if</span> bilan yozamiz — bugun shuni o'rganamiz.</>, ru: <>Верно! Телефон проверяет <b>условие</b>: PIN-код верный? Мы запишем это через <span className="mono">if</span> — этому сегодня и научимся.</> }) : tr3({ uz: <>Aslida telefon <b>shartni</b> tekshiradi: PIN-kod to'g'rimi? Buni <span className="mono">if</span> bilan yozamiz — bugun shuni o'rganamiz.</>, ru: <>На самом деле телефон проверяет <b>условие</b>: PIN-код верный? Мы запишем это через <span className="mono">if</span> — этому сегодня и научимся.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s1", text: `Hayot shartlarga to'la: 16 yosh bo'lsa, ID-karta olasiz, aks holda yoshingiz hali kichik. Kod ham xuddi shunday "agar... bo'lsa..." deb o'ylaydi. Buni if va else bilan yozamiz.`, trigger: "on_mount", waits_for: null }]);
  const STEPS = [
    { text: { uz: "if — shart bajarilsa, kod ishlaydi", ru: "if — код работает, если условие выполнено" }, tag: "if" },
    { text: { uz: "Taqqoslash operatorlari", ru: "Операторы сравнения" }, tag: "> < >= ==" },
    { text: { uz: "else — aks holda", ru: "else — иначе" }, tag: "else" },
    { text: { uz: "Bir nechta yo'l", ru: "Несколько путей" }, tag: "else if" },
    { text: { uz: "= va == farqi, keyin o'zingiz yozasiz", ru: "Разница = и ==, потом пишете сами" }, tag: "= · ==" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState4(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr3({ uz: "Bugun shunday kod yozasiz", ru: "Сегодня вы напишете такой код" })}</p>
      <pre className="code-box fade-up" style={{ fontSize: "clamp(12.5px,1.9vw,14.5px)" }}><Kw>if</Kw> (<Vr>age</Vr> <Op>{">="}</Op> <Nm>16</Nm>) {"{"}{"\n"}{"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: '"ID-karta olishingiz mumkin"', ru: '"Можно получить ID-карту"' })}</St>){"\n"}{"}"} <Kw>else</Kw> {"{"}{"\n"}{"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: '"Yoshingiz hali kichik"', ru: '"Вы ещё слишком молоды"' })}</St>){"\n"}{"}"}</pre>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>→ {tr3({ uz: "dastur qaror qabul qiladi", ru: "программа принимает решение" })}</p>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr3({ uz: "5 qadam", ru: "5 шагов" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{tr3(s.text)}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={tr3({ uz: "Reja", ru: "План" })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Boshlaymiz →", ru: "Начинаем →" }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr3({ uz: <>Kod endi <span className="italic" style={{ color: T.accent }}>o'zi tanlaydi</span></>, ru: <>Теперь код <span className="italic" style={{ color: T.accent }}>выбирает сам</span></> })}</h2>
        </div>
        <Mentor>{tr3({ uz: <>Hayot shartlarga to'la: <b style={{ color: T.ink }}>16 yosh bo'lsa</b> — ID-karta olasiz, <b style={{ color: T.ink }}>aks holda</b> — yoshingiz hali kichik. Kod ham shunday <b style={{ color: T.ink }}>"agar... bo'lsa..."</b> deb o'ylaydi — buni <span className="mono">if</span> va <span className="mono">else</span> bilan yozamiz.</>, ru: <>Жизнь полна условий: <b style={{ color: T.ink }}>исполнилось 16</b> — получаете ID-карту, <b style={{ color: T.ink }}>иначе</b> — вы ещё слишком молоды. Код думает так же: <b style={{ color: T.ink }}>«если... то...»</b> — мы запишем это через <span className="mono">if</span> и <span className="mono">else</span>.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>📋 {tr3({ uz: "Bugungi 5 qadamni ko'rish", ru: "Посмотреть 5 шагов на сегодня" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>↩ {tr3({ uz: "Kodni ko'rish", ru: "Посмотреть код" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s2", text: `if degani "agar". Telefon zaryad 20 foizdan kam bo'lsagina ogohlantiradi. Shart rost bo'lsa, figurali qavs ichidagi kod ishlaydi. Zaryadni o'zgartiring.`, trigger: "on_mount", waits_for: null }]);
  const [battery, setBattery] = useState4(50);
  const [touched, setTouched] = useState4(false);
  const cond = battery < 20;
  const done = touched;
  const setB = (b) => {
    setBattery(b);
    setTouched(true);
  };
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="if" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Zaryadni o'zgartiring", ru: "Измените заряд" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Dastur <span className="italic" style={{ color: T.accent }}>qachon</span> kodni bajaradi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Когда</span> программа выполняет код?</> })}</h2></div>
        <Mentor>{tr3({ uz: <><span className="mono">if</span> degani <b style={{ color: T.ink }}>"agar"</b>. Telefon zaryad <b style={{ color: T.ink }}>20% dan kam</b> bo'lsagina ogohlantiradi: shart <b style={{ color: T.ink }}>rost (true)</b> bo'lsa, figurali qavs <span className="mono">{"{ }"}</span> ichidagi kod ishlaydi. Zaryadni o'zgartiring.</>, ru: <><span className="mono">if</span> значит <b style={{ color: T.ink }}>«если»</b>. Телефон предупреждает, только когда заряд <b style={{ color: T.ink }}>меньше 20%</b>: если условие <b style={{ color: T.ink }}>истинно (true)</b>, код в фигурных скобках <span className="mono">{"{ }"}</span> работает. Меняйте заряд.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">battery = {battery}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {[50, 15].map((b) => <button key={b} className={`chip ${battery === b ? "chip-on" : ""}`} onClick={() => setB(b)}>🔋 {b}%</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(13px,2vw,15px)" }}>
              <Kw>if</Kw> (<Vr>battery</Vr> <Op>{"<"}</Op> <Nm>20</Nm>) {"{"}  <Cm>{`// ${battery} < 20 → ${cond}`}</Cm>{"\n"}
              <span style={{ background: cond ? "rgba(31,122,77,0.25)" : "transparent", borderRadius: 4, opacity: cond ? 1 : 0.4 }}>{"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: '"Quvvatlagichga ulang"', ru: '"Подключите зарядку"' })}</St>)</span>{"\n"}
              {"}"}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Natija", ru: "Результат" })}</p>
            <div className="demo-swap" key={battery + "r"} style={{ background: T.paper, borderRadius: 14, padding: "18px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <BoolPill value={cond} />
              <p className="body" style={{ margin: "12px 0 0", color: T.ink }}>{cond ? tr3({ uz: "✅ Shart rost → kod ishladi: «Quvvatlagichga ulang»", ru: "✅ Условие истинно → код сработал: «Подключите зарядку»" }) : tr3({ uz: "⛔ Shart yolg'on → kod o'tkazib yuborildi", ru: "⛔ Условие ложно → код пропущен" })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>✓ <b>if</b> — shart <b>true</b> bo'lsagina ichidagi kod ishlaydi.</>, ru: <>✓ <b>if</b> — код внутри работает, только если условие <b>true</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s3", text: `Shartni qanday yozamiz? Taqqoslash operatorlari bilan. Katta, kichik, katta yoki teng, teng, teng emas. Har biri ikki qiymatni solishtirib, true yoki false qaytaradi. Operatorlarni bosib, natijani ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const A = 14, B = 12;
  const OPS = [
    { op: ">", res: A > B, name: { uz: "katta", ru: "больше" } },
    { op: "<", res: A < B, name: { uz: "kichik", ru: "меньше" } },
    { op: ">=", res: A >= B, name: { uz: "katta yoki teng", ru: "больше или равно" } },
    { op: "<=", res: A <= B, name: { uz: "kichik yoki teng", ru: "меньше или равно" } },
    { op: "==", res: A === B, name: { uz: "teng", ru: "равно" } },
    { op: "!=", res: A !== B, name: { uz: "teng emas", ru: "не равно" } }
  ];
  const [active, setActive] = useState4(null);
  const [seen, setSeen] = useState4(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 3;
  const tap = (op) => {
    setActive(op);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(op);
      return n;
    });
  };
  const cur = OPS.find((o) => o.op === active);
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr3({ uz: "Taqqoslash", ru: "Сравнение" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `${seen.size}/3 operatorni sinang`, ru: `Попробуйте операторы: ${seen.size}/3` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Shartni <span className="italic" style={{ color: T.accent }}>qanday</span> yozamiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> записать условие?</> })}</h2></div>
        <Mentor>{tr3({ uz: <>Shart — <b style={{ color: T.ink }}>taqqoslash operatorlari</b> bilan yoziladi. Har biri ikki qiymatni solishtirib, <b style={{ color: T.ink }}>true</b> yoki <b style={{ color: T.ink }}>false</b> qaytaradi. Operatorlarni bosib, natijani ko'ring.</>, ru: <>Условие записывается <b style={{ color: T.ink }}>операторами сравнения</b>. Каждый сравнивает два значения и возвращает <b style={{ color: T.ink }}>true</b> или <b style={{ color: T.ink }}>false</b>. Нажимайте на операторы и смотрите результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr3({ uz: "Operatorni tanlang", ru: "Выберите оператор" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {OPS.map((o) => <button key={o.op} className={`chip ${active === o.op ? "chip-on" : ""}`} onClick={() => tap(o.op)}><span className="mono">{o.op}</span>{seen.has(o.op) && " ✓"}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(15px,2.6vw,20px)", textAlign: "center" }}><Nm>{A}</Nm> <span className="pop-num" key={active} style={{ color: CODE.punct, fontWeight: 700 }}>{active || "?"}</span> <Nm>{B}</Nm></pre>
          </Col>
          <Col>
            {cur ? <div className="demo-swap" key={active} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="pop-in" style={{ background: T.paper, borderRadius: 14, padding: "18px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
                  <p className="mono" style={{ margin: "0 0 10px", color: T.ink2, fontSize: 15 }}>{A} {cur.op} {B}</p>
                  <BoolPill value={cur.res} pulse />
                </div>
                <div className="sk-info"><span className="sk-tagbig"><span className="sk-wordbadge mono">{cur.op}</span><span style={{ fontWeight: 600, color: T.ink }}>{tr3(cur.name)}</span></span><p className="body" style={{ color: T.ink, margin: "9px 0 0" }}>{tr3({ uz: `14 ${tr3(cur.name)} 12? Javob: ${cur.res ? "ha (true)" : "yo'q (false)"}.`, ru: `14 ${tr3(cur.name)} 12? Ответ: ${cur.res ? "да (true)" : "нет (false)"}.` })}</p></div>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr3({ uz: "Operatorni bosing", ru: "Нажмите на оператор" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>✓ Esda saqlang: <span className="mono">==</span> teng, <span className="mono">!=</span> teng emas, <span className="mono">{">="}</span> katta yoki teng. Hammasi true/false beradi.</>, ru: <>✓ Запомните: <span className="mono">==</span> равно, <span className="mono">!=</span> не равно, <span className="mono">{">="}</span> больше или равно. Все дают true/false.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  idx={4}
  scope="module-mikro"
  eyebrow={tr3({ uz: "Mashq · 1-savol", ru: "Практика · вопрос 1" })}
  audioText="if blokining ichidagi kod qachon ishlaydi?"
  questionText="if blokining ichidagi kod qachon ishlaydi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr3({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr3({ uz: <>if blokining ichidagi kod <span className="italic" style={{ color: T.accent }}>qachon</span> ishlaydi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Когда</span> работает код внутри блока if?</> })}</h2></>}
  options={[{ uz: "Doim, har safar", ru: "Всегда, каждый раз" }, { uz: "Hech qachon", ru: "Никогда" }, { uz: "Shart yolg'on (`false`) bo'lganda", ru: "Когда условие ложно (`false`)" }, { uz: "Shart rost (`true`) bo'lganda", ru: "Когда условие истинно (`true`)" }]}
  correctIdx={3}
  explainCorrect={{ uz: "To'g'ri! `if` ichidagi kod faqat shart `true` bo'lganda ishlaydi. `false` bo'lsa — o'tkazib yuboriladi.", ru: "Верно! Код внутри `if` работает, только когда условие `true`. Если `false` — он пропускается." }}
  explainWrong={{ 0: { uz: "Yo'q — doim emas. Faqat shart `true` bo'lganda ishlaydi.", ru: "Нет — не всегда. Только когда условие `true`." }, 1: { uz: "Yo'q — shart `true` bo'lsa ishlaydi.", ru: "Нет — он работает, когда условие `true`." }, 2: { uz: "Aksincha — `false` bo'lsa o'tkazib yuboriladi. `true` bo'lsa ishlaydi.", ru: "Наоборот — при `false` он пропускается. Работает при `true`." }, default: { uz: "`if` ichidagi kod shart `true` bo'lganda ishlaydi.", ru: "Код внутри `if` работает, когда условие `true`." } }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s5", text: `Shart bajarilmasa-chi? Buning uchun else bor — "aks holda" degani. 16 yosh bo'lsa ID-karta olasiz, aks holda yoshingiz hali kichik. Yoshni o'zgartirib, qaysi yo'l tanlanishini ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const [age, setAge] = useState4(14);
  const [seen, setSeen] = useState4(/* @__PURE__ */ new Set([14]));
  const allowed = age >= 16;
  const done = seen.size >= 2;
  const setA = (a) => {
    setAge(a);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(a);
      return n;
    });
  };
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="else" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Ikkala yo'lni ko'ring", ru: "Посмотрите оба пути" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Shart bajarilmasa, dastur <span className="italic" style={{ color: T.accent }}>nima qiladi</span>?</>, ru: <>Если условие не выполнено, <span className="italic" style={{ color: T.accent }}>что делает</span> программа?</> })}</h2></div>
        <Mentor>{tr3({ uz: <><span className="mono">else</span> — bu <b style={{ color: T.ink }}>"aks holda"</b>, ya'ni <b style={{ color: T.ink }}>ikkinchi yo'l</b>. Shart <b style={{ color: T.ink }}>rost</b> bo'lsa — if bloki, <b style={{ color: T.ink }}>yolg'on</b> bo'lsa — else bloki ishlaydi, doim ikkitadan bittasi. Yoshni o'zgartiring.</>, ru: <><span className="mono">else</span> — это <b style={{ color: T.ink }}>«иначе»</b>, то есть <b style={{ color: T.ink }}>второй путь</b>. Условие <b style={{ color: T.ink }}>истинно</b> — работает блок if, <b style={{ color: T.ink }}>ложно</b> — блок else, всегда один из двух. Меняйте возраст.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {[14, 17].map((a) => <button key={a} className={`chip ${age === a ? "chip-on" : ""}`} onClick={() => setA(a)}>{a} {tr3({ uz: "yosh", ru: "лет" })}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(12.5px,1.9vw,14.5px)" }}>
              <Kw>if</Kw> (<Vr>age</Vr> <Op>{">="}</Op> <Nm>16</Nm>) {"{"}{"\n"}
              <span style={{ background: allowed ? "rgba(31,122,77,0.25)" : "transparent", borderRadius: 4, opacity: allowed ? 1 : 0.4, transition: "background 0.35s, opacity 0.35s" }}>{"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: '"ID-karta olishingiz mumkin"', ru: '"Можно получить ID-карту"' })}</St>)</span>{"\n"}
              {"}"} <Kw>else</Kw> {"{"}{"\n"}
              <span style={{ background: !allowed ? "rgba(255,79,40,0.22)" : "transparent", borderRadius: 4, opacity: !allowed ? 1 : 0.4, transition: "background 0.35s, opacity 0.35s" }}>{"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: '"Yoshingiz hali kichik"', ru: '"Вы ещё слишком молоды"' })}</St>)</span>{"\n"}
              {"}"}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Natija", ru: "Результат" })}</p>
            <div className="demo-swap" key={age} style={{ background: allowed ? T.successSoft : T.accentSoft, borderRadius: 14, padding: "20px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)`, transition: "background 0.35s" }}>
              <div className="pop-num" style={{ fontSize: 36 }}>{allowed ? "🪪" : "⏳"}</div>
              <p className="mono" style={{ margin: "8px 0 0", fontWeight: 700, color: allowed ? T.success : T.accent }}>{allowed ? tr3({ uz: '"ID-karta olishingiz mumkin"', ru: '"Можно получить ID-карту"' }) : tr3({ uz: '"Yoshingiz hali kichik"', ru: '"Вы ещё слишком молоды"' })}</p>
              <p className="small" style={{ margin: "6px 0 0", color: T.ink2 }}>{allowed ? tr3({ uz: "↑ if bloki ishladi", ru: "↑ сработал блок if" }) : tr3({ uz: "↓ else bloki ishladi", ru: "↓ сработал блок else" })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>✓ <b>if / else</b> — ikki yo'l: rost bo'lsa biri, yolg'on bo'lsa ikkinchisi. Hech qachon ikkalasi birga emas.</>, ru: <>✓ <b>if / else</b> — развилка на два пути: истина — один, ложь — другой. Никогда оба сразу.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen5b = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr3({ uz: "Tekshiruv", ru: "Проверка" })}
  audioText="Shart yolg'on, ya'ni false bo'lsa, qaysi blok ishlaydi?"
  questionText="Shart false (yolg'on) bo'lsa, qaysi blok ishlaydi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr3({ uz: "Mustahkamlash", ru: "Закрепление" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr3({ uz: <>Shart <span className="italic" style={{ color: T.accent }}>false</span> bo'lsa, qaysi blok ishlaydi?</>, ru: <>Если условие <span className="italic" style={{ color: T.accent }}>false</span>, какой блок работает?</> })}</h2></>}
  options={[{ uz: "`if` bloki", ru: "Блок `if`" }, { uz: "`else` bloki", ru: "Блок `else`" }, { uz: "Ikkalasi", ru: "Оба" }, { uz: "Hech biri", ru: "Ни один" }]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! Shart `false` bo'lsa, `if` bloki o'tkazib yuboriladi va `else` bloki ishlaydi.", ru: "Верно! Если условие `false`, блок `if` пропускается и работает блок `else`." }}
  explainWrong={{
    0: { uz: "Yo'q — `if` bloki shart `true` bo'lganda ishlaydi. `false` bo'lsa — `else`.", ru: "Нет — блок `if` работает при условии `true`. Если `false` — `else`." },
    2: { uz: "Yo'q — har doim faqat bittasi ishlaydi, ikkalasi emas.", ru: "Нет — всегда работает только один, а не оба." },
    3: { uz: "Yo'q — `else` aynan shu holat uchun: `false` bo'lsa `else` ishlaydi.", ru: "Нет — `else` именно для этого случая: при `false` работает `else`." },
    default: { uz: "`false` bo'lsa — `else` bloki ishlaydi.", ru: "Если `false` — работает блок `else`." }
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s6", text: `Bu yerda ko'pchilik adashadi. Bitta teng belgisi qiymatni qutiga soladi. Ikki teng belgisi esa so'raydi: bular tengmi? va true yoki false qaytaradi. Ikkala kartani bosib solishtiring.`, trigger: "on_mount", waits_for: null }]);
  const [active, setActive] = useState4(null);
  const [seen, setSeen] = useState4(/* @__PURE__ */ new Set());
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
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr3({ uz: "= va ==", ru: "= и ==" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Ikkalasini ko'ring", ru: "Посмотрите оба" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <><span className="italic" style={{ color: T.accent }}>=</span> va <span className="italic" style={{ color: T.accent }}>==</span> — farqi nimada?</>, ru: <><span className="italic" style={{ color: T.accent }}>=</span> и <span className="italic" style={{ color: T.accent }}>==</span> — в чём разница?</> })}</h2></div>
        <Mentor>{tr3({ uz: <>Bu yerda ko'pchilik adashadi: <b style={{ color: T.ink }}>=</b> qiymatni qutiga <b style={{ color: T.ink }}>soladi</b>, <b style={{ color: T.ink }}>==</b> esa so'raydi — <b style={{ color: T.ink }}>tengmi?</b> Ikkala kartani bosing.</>, ru: <>Здесь многие путаются: <b style={{ color: T.ink }}>=</b> <b style={{ color: T.ink }}>кладёт</b> значение в коробку, а <b style={{ color: T.ink }}>==</b> спрашивает — <b style={{ color: T.ink }}>равно ли?</b> Нажмите обе карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button onClick={() => tap("assign")} className="fade-up delay-1" style={{ textAlign: "left", cursor: "pointer", border: "none", width: "100%", borderRadius: 14, padding: "15px 17px", background: T.paper, boxShadow: active === "assign" ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s", marginBottom: 10 }}>
              <p className="mono" style={{ margin: "0 0 6px", fontSize: 16, color: T.ink }}><Vr>score</Vr> <Op>=</Op> <Nm>10</Nm></p>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>📥 {tr3({ uz: 'Qiymat berish — "10 ni score qutisiga sol"', ru: "Присваивание — «положи 10 в коробку score»" })} {seen.has("assign") && "✓"}</p>
            </button>
            <button onClick={() => tap("compare")} className="fade-up delay-1" style={{ textAlign: "left", cursor: "pointer", border: "none", width: "100%", borderRadius: 14, padding: "15px 17px", background: T.paper, boxShadow: active === "compare" ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
              <p className="mono" style={{ margin: "0 0 6px", fontSize: 16, color: T.ink }}><Vr>score</Vr> <Op>==</Op> <Nm>10</Nm></p>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>❓ {tr3({ uz: 'Tekshirish — "score 10 ga tengmi?" → true/false', ru: "Проверка — «score равно 10?» → true/false" })} {seen.has("compare") && "✓"}</p>
            </button>
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}>
                {active === "assign" ? <><span className="sk-tagbig"><span className="sk-wordbadge mono">=</span><span style={{ fontWeight: 600, color: T.ink }}>{tr3({ uz: "qiymat berish", ru: "присваивание" })}</span></span><p className="body" style={{ color: T.ink, margin: "10px 0 0" }}>{tr3({ uz: "Quti yaratganda ishlatamiz (o'zgaruvchilar darsidan). Hech narsa tekshirmaydi — shunchaki qiymat soladi.", ru: "Используем при создании коробки (с урока о переменных). Ничего не проверяет — просто кладёт значение." })}</p><div className="pop-in" style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><span className="mono" style={{ fontWeight: 700, color: T.ink }}>10</span><span className="flow-x" style={{ color: T.accent, fontWeight: 700, fontSize: 18 }}>→</span><span className="var-box" style={{ minWidth: 92 }}><span className="var-name">score</span><span className="var-val" style={{ fontSize: 18, color: T.ink }}>10</span></span></div></> : <><span className="sk-tagbig"><span className="sk-wordbadge mono">==</span><span style={{ fontWeight: 600, color: T.ink }}>{tr3({ uz: "tekshirish", ru: "проверка" })}</span></span><p className="body" style={{ color: T.ink, margin: "10px 0 4px" }}>{tr3({ uz: <>Ikki qiymatni solishtiradi va <b>true</b> yoki <b>false</b> qaytaradi.</>, ru: <>Сравнивает два значения и возвращает <b>true</b> или <b>false</b>.</> })}</p><div className="pop-in" style={{ margin: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 11, flexWrap: "wrap" }}><span className="mono" style={{ color: T.ink2 }}>10 == 10</span><span className="flow-x" style={{ color: T.ink3, fontSize: 18 }}>→</span><BoolPill value={true} pulse /></div><p className="body" style={{ margin: 0, color: T.ink }}><b style={{ color: T.accent }}>{tr3({ uz: "Shartda (if) tekshirish — ==.", ru: "В условии (if) проверка — ==." })}</b></p></>}
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr3({ uz: "Bir kartani bosing", ru: "Нажмите на карточку" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <><b>Qoida:</b> qiymat berish — <span className="mono">=</span>, tekshirish — <span className="mono">==</span>. AI yozgan kodda <span className="mono">===</span> ni ham ko'rasiz — bu ham tekshirish belgisi.</>, ru: <><b>Правило:</b> дать значение — <span className="mono">=</span>, проверить — <span className="mono">==</span>. В коде от AI встретите и <span className="mono">===</span> — это тоже знак проверки.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s7", text: `Ba'zan ikki emas, bir nechta yo'l bo'ladi. Masalan imtihon bahosi: ball 90 va undan yuqori — besh, 70 va undan yuqori — to'rt, 60 va undan yuqori — uch, aks holda — ikki. Buning uchun else if ishlatamiz — ya'ni "aks holda, agar...". Ballni o'zgartirib, qaysi baho chiqishini ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const BALLS = [95, 80, 65, 40];
  const [ball, setBall] = useState4(95);
  const [seen, setSeen] = useState4(/* @__PURE__ */ new Set([95]));
  const grade = ball >= 90 ? 5 : ball >= 70 ? 4 : ball >= 60 ? 3 : 2;
  const branch = ball >= 90 ? 0 : ball >= 70 ? 1 : ball >= 60 ? 2 : 3;
  const done = seen.size >= 2;
  const setB = (b) => {
    setBall(b);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(b);
      return n;
    });
  };
  const LINES = [
    { c: <><Kw>if</Kw> (<Vr>score</Vr> <Op>{">="}</Op> <Nm>90</Nm>) {"{"} <Vr>grade</Vr> <Op>=</Op> <Nm>5</Nm> {"}"}</> },
    { c: <><Kw>else if</Kw> (<Vr>score</Vr> <Op>{">="}</Op> <Nm>70</Nm>) {"{"} <Vr>grade</Vr> <Op>=</Op> <Nm>4</Nm> {"}"}</> },
    { c: <><Kw>else if</Kw> (<Vr>score</Vr> <Op>{">="}</Op> <Nm>60</Nm>) {"{"} <Vr>grade</Vr> <Op>=</Op> <Nm>3</Nm> {"}"}</> },
    { c: <><Kw>else</Kw> {"{"} <Vr>grade</Vr> <Op>=</Op> <Nm>2</Nm> {"}"}</> }
  ];
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="else if" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Ballni o'zgartiring", ru: "Измените балл" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Bir nechta yo'l bo'lsa, dastur <span className="italic" style={{ color: T.accent }}>qaysi birini</span> tanlaydi?</>, ru: <>Если путей несколько, <span className="italic" style={{ color: T.accent }}>какой</span> выберет программа?</> })}</h2></div>
        <Mentor>{tr3({ uz: <>Ba'zan bir nechta yo'l bo'ladi. Imtihon bahosi: 90+ → 5, 70+ → 4, 60+ → 3, aks holda → 2. Buning uchun <span className="mono">else if</span> — <b style={{ color: T.ink }}>"aks holda, agar..."</b>. Ballni o'zgartiring.</>, ru: <>Иногда путей несколько. Оценка за экзамен: 90+ → 5, 70+ → 4, 60+ → 3, иначе → 2. Для этого есть <span className="mono">else if</span> — <b style={{ color: T.ink }}>«иначе, если...»</b>. Меняйте балл.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">score = {ball}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {BALLS.map((b) => <button key={b} className={`chip ${ball === b ? "chip-on" : ""}`} onClick={() => setB(b)}>{b}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(11.5px,1.7vw,13.5px)" }}>
              {LINES.map((l, i) => <span key={i} style={{ display: "block", background: branch === i ? "rgba(31,122,77,0.25)" : "transparent", borderRadius: 4, opacity: branch === i ? 1 : 0.45, padding: "2px 4px", transition: "background 0.35s, opacity 0.35s" }}>{branch === i && <span style={{ color: CODE.str, fontWeight: 700 }}>▶ </span>}{l.c}</span>)}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Natija", ru: "Результат" })}</p>
            <div className="demo-swap" key={ball} style={{ background: T.paper, borderRadius: 14, padding: "20px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <div className="pop-num" key={grade} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(40px,9vw,60px)", color: grade >= 3 ? T.success : T.accent }}>{grade}</div>
              <p className="small" style={{ margin: "4px 0 0", color: T.ink2 }}>{tr3({ uz: `baho — ${ball} ball uchun`, ru: `оценка — за ${ball} баллов` })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>✓ <b>else if</b> zanjiri: yuqoridan pastga tekshiriladi, birinchi rost shart ishlaydi, qolganlari o'tkazib yuboriladi.</>, ru: <>✓ Цепочка <b>else if</b>: проверяется сверху вниз, срабатывает первое истинное условие, остальные пропускаются.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s8", text: `Taqqoslashning natijasi — true yoki false. Demak shart natijasini qutiga solib qo'yish mumkin. Yoshni o'zgartirib, canGetId qutisiga nima tushishini ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const [age, setAge] = useState4(14);
  const [touched, setTouched] = useState4(false);
  const val = age >= 16;
  const done = touched;
  const setA = (a) => {
    setAge(a);
    setTouched(true);
  };
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr3({ uz: "Shart natijasi", ru: "Результат условия" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Yoshni o'zgartiring", ru: "Измените возраст" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Shart <span className="italic" style={{ color: T.accent }}>true/false</span> beradi — buni saqlasa bo'ladimi?</>, ru: <>Условие даёт <span className="italic" style={{ color: T.accent }}>true/false</span> — можно ли это сохранить?</> })}</h2></div>
        <Mentor>{tr3({ uz: <>Taqqoslash natijasi (<span className="mono">age {">="} 16</span>) — o'sha <b style={{ color: T.ink }}>true yoki false</b>. Demak uni <b style={{ color: T.ink }}>o'zgaruvchiga saqlash</b> mumkin: yoshni o'zgartirib, <span className="mono">canGetId</span> ga nima yozilishini ko'ring.</>, ru: <>Результат сравнения (<span className="mono">age {">="} 16</span>) — те самые <b style={{ color: T.ink }}>true или false</b>. Значит его можно <b style={{ color: T.ink }}>сохранить в переменную</b>: меняйте возраст и смотрите, что запишется в <span className="mono">canGetId</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {[14, 17].map((a) => <button key={a} className={`chip ${age === a ? "chip-on" : ""}`} onClick={() => setA(a)}>{a} {tr3({ uz: "yosh", ru: "лет" })}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(13px,2vw,15px)" }}><Kw>let</Kw> <Vr>age</Vr> <Op>=</Op> <Nm>{age}</Nm>{"\n"}<Kw>let</Kw> <Vr>canGetId</Vr> <Op>=</Op> <Vr>age</Vr> <Op>{">="}</Op> <Nm>16</Nm>{"\n"}<Cm>{`// canGetId = ${val}`}</Cm></pre>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Taqqoslash natijasi o'zgaruvchiga tushadi", ru: "Результат сравнения попадает в переменную" })}</p>
            <div className="demo-swap" key={age} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span className="mono pop-in" style={{ fontSize: 15, color: T.ink2 }}>{age} {">="} 16 → <b style={{ color: val ? T.success : T.accent }}>{String(val)}</b></span>
              <span className="flow-x" style={{ color: T.ink3, fontSize: 22 }}>↓</span>
              <div className={`var-box ${val ? "ring-green" : "ring-red"}`} style={{ minWidth: 150 }}><div className="var-name">{tr3({ uz: "o'zgaruvchi: canGetId", ru: "переменная: canGetId" })}</div><div className="var-val pop-num" style={{ color: val ? T.success : T.accent }}>{String(val)}</div></div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>✓ Ko'rdingizmi — <span className="mono">age {">="} 16</span> shunchaki <b>true/false</b> beradi, uni o'zgaruvchida saqlash mumkin.</>, ru: <>✓ Видите — <span className="mono">age {">="} 16</span> просто даёт <b>true/false</b>, и это можно сохранить в переменной.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr3({ uz: "Mashq · 2-savol", ru: "Практика · вопрос 2" })}
  audioText="Ikki qiymat teng ekanini tekshirish uchun shartda qaysi belgi ishlatiladi?"
  questionText="Ikki qiymat tengligini tekshirish uchun shartda qaysi belgi ishlatiladi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr3({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr3({ uz: <>Ikki qiymat <span className="italic" style={{ color: T.accent }}>tengligini</span> tekshirish uchun qaysi belgi?</>, ru: <>Какой знак проверяет <span className="italic" style={{ color: T.accent }}>равенство</span> двух значений?</> })}</h2></>}
  options={["`==`", "`=`", "`+`", "`<`"]}
  correctIdx={0}
  explainCorrect={{ uz: "To'g'ri! `==` ikki qiymatni taqqoslab, `true` yoki `false` qaytaradi.", ru: "Верно! `==` сравнивает два значения и возвращает `true` или `false`." }}
  explainWrong={{
    1: { uz: "`=` qiymatni qutiga soladi, tekshirmaydi. Tenglikni `==` tekshiradi.", ru: "`=` кладёт значение в коробку, а не проверяет. Равенство проверяет `==`." },
    2: { uz: "`+` qo'shish amali, taqqoslash emas. Tenglik — `==`.", ru: "`+` — сложение, а не сравнение. Равенство — `==`." },
    3: { uz: "`<` kichikligini tekshiradi, tenglikni emas. Tenglik — `==`.", ru: "`<` проверяет «меньше», а не равенство. Равенство — `==`." },
    default: { uz: "Tenglikni `==` tekshiradi.", ru: "Равенство проверяет `==`." }
  }}
/>;
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s11", text: `Keling, hamma narsani birga ishlatamiz. Kino chiptasi narxi yoshga bog'liq: 7 yoshgacha bolalar tekin, 18 gacha o'quvchilar yarim narx, kattalar to'liq. Yoshni o'zgartirib, narx qanday hisoblanishini ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const AGES = [5, 14, 30];
  const [age, setAge] = useState4(5);
  const [seen, setSeen] = useState4(/* @__PURE__ */ new Set([5]));
  const price = age < 7 ? 0 : age < 18 ? 25e3 : 5e4;
  const branch = age < 7 ? 0 : age < 18 ? 1 : 2;
  const done = seen.size >= 2;
  const setA = (a) => {
    setAge(a);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(a);
      return n;
    });
  };
  const LINES = [
    <><Kw>if</Kw> (<Vr>age</Vr> <Op>{"<"}</Op> <Nm>7</Nm>) {"{"} <Vr>price</Vr> <Op>=</Op> <Nm>0</Nm> {"}"}</>,
    <><Kw>else if</Kw> (<Vr>age</Vr> <Op>{"<"}</Op> <Nm>18</Nm>) {"{"} <Vr>price</Vr> <Op>=</Op> <Nm>25000</Nm> {"}"}</>,
    <><Kw>else</Kw> {"{"} <Vr>price</Vr> <Op>=</Op> <Nm>50000</Nm> {"}"}</>
  ];
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr3({ uz: "Amaliy misol", ru: "Практический пример" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Yoshlarni sinang", ru: "Попробуйте возрасты" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Siz <span className="italic" style={{ color: T.accent }}>kassirsiz</span>: chipta narxi qancha?</>, ru: <>Вы — <span className="italic" style={{ color: T.accent }}>кассир</span>: сколько стоит билет?</> })}</h2></div>
        <Mentor>{tr3({ uz: <>Kinoteatr <b style={{ color: T.ink }}>kassasidasiz</b>! Har bir mehmonga yoshiga qarab narx aytasiz: 7 gacha bola — <b style={{ color: T.ink }}>tekin</b>, 18 gacha o'quvchi — <b style={{ color: T.ink }}>yarim narx</b>, kattalar — <b style={{ color: T.ink }}>to'liq</b>. <span className="mono">if / else if</span> shu qarorni o'zi chiqaradi. Yoshni tanlang.</>, ru: <>Вы <b style={{ color: T.ink }}>на кассе кинотеатра</b>! Каждому гостю называете цену по возрасту: ребёнок до 7 — <b style={{ color: T.ink }}>бесплатно</b>, школьник до 18 — <b style={{ color: T.ink }}>полцены</b>, взрослые — <b style={{ color: T.ink }}>полная</b>. <span className="mono">if / else if</span> принимает это решение сам. Выберите возраст.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">age = {age}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              {AGES.map((a) => <button key={a} className={`chip ${age === a ? "chip-on" : ""}`} onClick={() => setA(a)}>{a} {tr3({ uz: "yosh", ru: "лет" })}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(11.5px,1.7vw,13.5px)" }}>
              {LINES.map((l, i) => <span key={i} style={{ display: "block", background: branch === i ? "rgba(31,122,77,0.25)" : "transparent", borderRadius: 4, opacity: branch === i ? 1 : 0.45, padding: "2px 4px", transition: "background 0.35s, opacity 0.35s" }}>{branch === i && <span style={{ color: CODE.str, fontWeight: 700 }}>▶ </span>}{l}</span>)}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Chipta narxi", ru: "Цена билета" })}</p>
            <div className="demo-swap" key={age} style={{ background: T.paper, borderRadius: 14, padding: "20px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <div className="pop-num" key={price} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,6vw,40px)", color: price === 0 ? T.success : T.accent }}>{price === 0 ? tr3({ uz: "TEKIN", ru: "БЕСПЛАТНО" }) : price.toLocaleString("ru-RU") + tr3({ uz: " so'm", ru: " сум" })}</div>
              <p className="small" style={{ margin: "4px 0 0", color: T.ink2 }}>🎟️ {age < 7 ? tr3({ uz: "bola (7 gacha)", ru: "ребёнок (до 7)" }) : age < 18 ? tr3({ uz: "o'quvchi (18 gacha)", ru: "школьник (до 18)" }) : tr3({ uz: "katta", ru: "взрослый" })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: "✓ Mana — haqiqiy dasturlardagi mantiq! if/else if bilan har qanday qoidani yozish mumkin.", ru: "✓ Вот она — логика настоящих программ! С if/else if можно записать любое правило." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s13", text: `Endi shartni o'zingiz tuzasiz. Operator va sonni tanlang, keyin har xil zaryadni sinab ko'ring: telefon qachon ogohlantiradi?`, trigger: "on_mount", waits_for: null }]);
  const OPS = ["<", "<=", ">"];
  const NUMS = [10, 20, 50];
  const [op, setOp] = useState4(null);
  const [num, setNum] = useState4(null);
  const [test, setTest] = useState4(null);
  const ready = op && num;
  const done = ready;
  const evalCond = (t) => {
    if (op === "<") return t < num;
    if (op === "<=") return t <= num;
    return t > num;
  };
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr3({ uz: "Amaliyot · shart tuzing", ru: "Практика · соберите условие" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Shart tuzing", ru: "Соберите условие" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Zaryad shartini <span className="italic" style={{ color: T.accent }}>o'zingiz tuzing</span></>, ru: <>Соберите условие заряда <span className="italic" style={{ color: T.accent }}>сами</span></> })}</h2></div>
        <Mentor>{tr3({ uz: <>Endi shartni o'zingiz tuzasiz: <b style={{ color: T.ink }}>operator</b> va <b style={{ color: T.ink }}>son</b>ni tanlang. Keyin zaryadni sinab ko'ring — telefon qachon ogohlantiradi?</>, ru: <>Теперь вы сами соберёте условие: выберите <b style={{ color: T.ink }}>оператор</b> и <b style={{ color: T.ink }}>число</b>. Потом проверьте заряд — когда телефон предупредит?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr3({ uz: "Operator", ru: "Оператор" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 7 }}>{OPS.map((o) => <button key={o} className={`chip ${op === o ? "chip-on" : ""}`} onClick={() => setOp(o)}><span className="mono">{o}</span></button>)}</div>
            <p className="flow-label">{tr3({ uz: "Son (zaryad chegarasi, %)", ru: "Число (порог заряда, %)" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 7 }}>{NUMS.map((n) => <button key={n} className={`chip ${num === n ? "chip-on" : ""}`} onClick={() => setNum(n)}>{n}</button>)}</div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(12.5px,1.9vw,15px)" }}><Kw>if</Kw> (<Vr>battery</Vr> <span className="pop-num" key={op} style={{ color: op ? CODE.punct : CODE.comment, fontWeight: 700 }}>{op || "?"}</span> <span className="pop-num" key={num} style={{ color: num != null ? CODE.num : CODE.comment, fontWeight: 700 }}>{num ?? "?"}</span>) {"{"} <Cm>{tr3({ uz: "ogohlantirish", ru: "предупредить" })}</Cm> {"}"}</pre>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Shartingizni sinab ko'ring", ru: "Проверьте своё условие" })}</p>
            {ready ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 7 }}>{[15, 20, 80].map((t) => <button key={t} className={`chip ${test === t ? "chip-on" : ""}`} onClick={() => setTest(t)}>🔋 {t}%</button>)}</div>
                {test !== null && <div className={`demo-swap ${evalCond(test) ? "ring-green" : "ring-red"}`} key={test} style={{ background: evalCond(test) ? T.successSoft : T.accentSoft, borderRadius: 14, padding: "16px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
                    <p className="mono small" style={{ margin: "0 0 6px", color: T.ink2 }}>{test} {op} {num} → <b style={{ color: evalCond(test) ? T.success : T.accent }}>{String(evalCond(test))}</b></p>
                    <p className="pop-num" style={{ fontWeight: 700, margin: 0, color: evalCond(test) ? T.success : T.accent }}>{evalCond(test) ? tr3({ uz: "🔋 Ogohlantirish chiqdi", ru: "🔋 Появилось предупреждение" }) : tr3({ uz: "— Telefon jim turadi", ru: "— Телефон молчит" })}</p>
                  </div>}
                <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: "✓ Shartingiz tayyor! Har xil zaryadni sinab ko'ring.", ru: "✓ Ваше условие готово! Проверьте разный заряд." })}</p></div>
              </div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr3({ uz: "Operator va sonni tanlang", ru: "Выберите оператор и число" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s14", text: `AI PIN-kod tekshiruvini yozdi, lekin xato qilibdi: noto'g'ri PIN-kod bilan ham telefon ochilyapti. Shartda bitta teng belgisi turibdi — u qiymat soladi, tekshirmaydi. Xato qatorni toping va bosing.`, trigger: "on_mount", waits_for: { type: "error_found" } }]);
  const [picked, setPicked] = useState4(storedAnswer ? "if" : null);
  const [fixed, setFixed] = useState4(!!storedAnswer);
  const found = picked === "if";
  const done = fixed;
  const pickIf = () => {
    if (found) return;
    setPicked("if");
    audio.triggerEvent("error_found");
    if (!audio.muted) setTimeout(() => {
      const e = getAudioEngine();
      if (e && !audio.muted) e.pushOneOff(`Topdingiz! Shartda bitta teng — u qiymat beradi. Uni ikki tengga almashtiramiz.`);
    }, 300);
  };
  const fix = () => {
    setFixed(true);
    if (!audio.muted) setTimeout(() => {
      const e = getAudioEngine();
      if (e && !audio.muted) e.pushOneOff(`Tuzatildi! Endi shart to'g'ri tekshiradi.`);
    }, 300);
  };
  useEffect5(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="Debugging" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : found ? { uz: "Endi tuzating", ru: "Теперь почините" } : { uz: "Xatoni toping", ru: "Найдите ошибку" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Noto'g'ri PIN-kod bilan ham telefon <span className="italic" style={{ color: T.accent }}>ochilyapti</span> — nega?</>, ru: <>Телефон <span className="italic" style={{ color: T.accent }}>открывается</span> даже с неверным PIN-кодом — почему?</> })}</h2></div>
        <Mentor>{tr3({ uz: <>AI kod yozdi, lekin xato qilibdi: PIN-kod <b style={{ color: T.ink }}>1111</b> bo'lsa ham telefon ochilyapti! Shartda <b style={{ color: T.ink }}>bitta teng belgisi</b> turibdi — u qiymat soladi, <b style={{ color: T.ink }}>tekshirmaydi</b>. Xato qatorni toping.</>, ru: <>AI написал код, но ошибся: даже с PIN-кодом <b style={{ color: T.ink }}>1111</b> телефон открывается! В условии стоит <b style={{ color: T.ink }}>один знак равно</b> — он кладёт значение, а <b style={{ color: T.ink }}>не проверяет</b>. Найдите строку с ошибкой.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr3({ uz: "PIN-kod tekshiruvi:", ru: "Проверка PIN-кода:" })}</span></div>
              <div className="ai-code">
                <div className="ai-line" style={{ cursor: "default" }}><Kw>let</Kw> <Vr>pin</Vr> <Op>=</Op> <Nm>1111</Nm></div>
                <div className={`ai-line ${found ? fixed ? "ok" : "bad" : ""}`} onClick={pickIf}><Kw>if</Kw> (<Vr>pin</Vr> <Op>{fixed ? "==" : "="}</Op> <Nm>1234</Nm>) {"{"} <Cm>{tr3({ uz: "ochildi", ru: "открыт" })}</Cm> {"}"} {!fixed && <Cm>// ?</Cm>}</div>
              </div>
              {!found && <p className="ai-prompt">{tr3({ uz: "Qaysi qatorda xato? Bosing.", ru: "В какой строке ошибка? Нажмите." })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={fix}>🔧 {tr3({ uz: "= ni == ga almashtirish", ru: "Заменить = на ==" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: "normal", fontWeight: 600 }}>✓ {tr3({ uz: "Tuzatildi — endi shart to'g'ri tekshiradi!", ru: "Починено — теперь условие проверяет правильно!" })}</p>}
            </div>
          </Col>
          <Col>
            {!found && <div className="hint"><p className="body zb-notch" style={{ margin: 0, color: T.ink2 }}>{tr3({ uz: <>Eslang: shartda tenglik <b style={{ color: T.ink }}>==</b> bilan tekshiriladi. Qaysi qatorda <span className="mono">=</span> noto'g'ri ishlatilgan?</>, ru: <>Вспомните: в условии равенство проверяется через <b style={{ color: T.ink }}>==</b>. В какой строке <span className="mono">=</span> использован неверно?</> })}</p></div>}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>✓ {tr3({ uz: "Topdingiz!", ru: "Нашли!" })}</p><p className="body zb-notch" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>Shartda <span className="mono">=</span> — qiymat soladi, tekshirmaydi. To'g'risi: <span className="mono">==</span>. Chap tugmani bosing →</>, ru: <>В условии <span className="mono">=</span> кладёт значение, а не проверяет. Правильно: <span className="mono">==</span>. Нажмите кнопку слева →</> })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr3({ uz: "Topdingiz va tuzatdingiz — bu debugging!", ru: "Нашли и починили — это дебаггинг!" })}</p><p className="ta-sub">{tr3({ uz: "Shartda doim == (tekshirish), = emas", ru: "В условии всегда == (проверка), а не =" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s15", text: `Mana, oxirgi qadam — o'zingiz if yozasiz. Ball 90 dan katta bo'lsa tekshiradigan shart yozing. if, qavs ichida score katta 90, va figurali qavs ochilsin. Masalan: if qavs score katta 90 qavs figurali qavs.`, trigger: "on_mount", waits_for: { type: "typed_ok" } }]);
  const [value, setValue] = useState4(typeof storedAnswer?.picked === "string" ? storedAnswer.picked : "");
  const [passed, setPassed] = useState4(!!storedAnswer?.correct);
  const _gate = useContext2(LiveGateCtx) || {};
  const isMentorLive = !!(_gate.live && _gate.live.mode === "mentor");
  const v = value.trim();
  const hasIf = /^if\b/.test(v);
  const hasParen = /^if\s*\(.+\)/.test(v);
  const hasOp = /(>=|<=|===|!==|==|!=|>|<)/.test(v);
  const hasBrace = /\{/.test(v);
  const valid = /^if\s*\([^)]*(>=|<=|===|!==|==|!=|>|<)[^)]*\)\s*\{/.test(v);
  useEffect5(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { correct: true, picked: value });
      audio.triggerEvent("typed_ok");
      if (!audio.muted) setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) e.pushOneOff(`Ajoyib! Birinchi shartingizni o'zingiz yozdingiz. Tabriklayman!`);
      }, 300);
    }
  }, [valid]);
  return <Stage eyebrow={tr3({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !passed} label={isMentorLive ? { uz: "Davom etish", ru: "Продолжить" } : passed ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Shartni yozing", ru: "Напишите условие" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>if</span> ni o'zingiz yozing.</>, ru: <>Последний шаг: напишите <span className="italic" style={{ color: T.accent }}>if</span> сами.</> })}</h2></div>
        <Mentor>{tr3({ uz: <>Ball 90 dan katta ekanini tekshiradigan shart yozing: <span className="mono">if</span>, qavs ichida <span className="mono">score {">"} 90</span>, va <span className="mono">{"{"}</span> oching. Masalan: <span className="mono">{"if (score > 90) {"}</span></>, ru: <>Напишите условие, которое проверяет, что балл больше 90: <span className="mono">if</span>, в скобках <span className="mono">score {">"} 90</span>, и откройте <span className="mono">{"{"}</span>. Например: <span className="mono">{"if (score > 90) {"}</span></> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <input className="fade-up delay-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder={"if (score > 90) {"} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: "100%", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, padding: "14px 16px", borderRadius: 12, border: "none", background: T.paper, color: T.ink, outline: "none", transition: "box-shadow 0.2s", boxShadow: valid ? `0 0 0 2px ${T.success}, 0 8px 20px -8px rgba(${T.shadowBase},0.2)` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            <div className="fade-up delay-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ opacity: hasIf ? 1 : 0.4 }}>{hasIf ? "✓" : "1"} if</span>
              <span className="tagpill" style={{ opacity: hasParen ? 1 : 0.4 }}>{hasParen ? "✓" : "2"} {tr3({ uz: "( shart )", ru: "( условие )" })}</span>
              <span className="tagpill" style={{ opacity: hasOp ? 1 : 0.4 }}>{hasOp ? "✓" : "3"} {tr3({ uz: "taqqoslash", ru: "сравнение" })}</span>
              <span className="tagpill" style={{ opacity: hasBrace ? 1 : 0.4 }}>{hasBrace ? "✓" : "4"} {"{"}</span>
            </div>
            {passed ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: "✓ Ajoyib! Bu to'g'ri shart — dasturingiz endi qaror qabul qila oladi!", ru: "✓ Отлично! Это верное условие — теперь ваша программа умеет принимать решения!" })}</p></div> : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr3({ uz: <>Taqqoslash operatori: {">"}, {"<"}, {">="} yoki ==. Oxirida {"{"} ochishni unutmang.</>, ru: <>Оператор сравнения: {">"}, {"<"}, {">="} или ==. Не забудьте открыть {"{"} в конце.</> })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "natija", ru: "результат" })}</p>
            <div style={{ background: T.paper, borderRadius: 14, minHeight: 120, padding: "20px", boxShadow: `0 8px 22px -10px rgba(${T.shadowBase},0.16)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              {valid ? <div className="fade-step"><div style={{ fontSize: 34 }}>🚦</div><p style={{ fontFamily: "Georgia, serif", color: T.success, fontWeight: 700, margin: "8px 0 0" }}>{tr3({ uz: "Shart tayyor!", ru: "Условие готово!" })}</p><p className="small" style={{ margin: "4px 0 0", color: T.ink2 }}>{tr3({ uz: "dastur tekshira oladi", ru: "программа умеет проверять" })}</p></div> : <p style={{ fontFamily: "Georgia, serif", color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr3({ uz: "To'liq yozing:", ru: "Напишите полностью:" })} <span className="mono" style={{ fontStyle: "normal" }}>{"if ( shart ) {"}</span></p>}
            </div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var ScreenElseWrite = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "selse", text: `if ni yozdingiz — endi unga else qo'shing. if blokini yopib, else va yangi blok oching: yopiq figurali qavs, else, ochiq figurali qavs.`, trigger: "on_mount", waits_for: { type: "typed_ok" } }]);
  const [value, setValue] = useState4(typeof storedAnswer?.picked === "string" ? storedAnswer.picked : "");
  const [passed, setPassed] = useState4(!!storedAnswer?.correct);
  const _gate = useContext2(LiveGateCtx) || {};
  const isMentorLive = !!(_gate.live && _gate.live.mode === "mentor");
  const v = value.trim();
  const hasClose = /^\}/.test(v);
  const hasElse = /\belse\b/.test(v);
  const hasOpen = /else\s*\{/.test(v);
  const valid = /^\}\s*else\s*\{$/.test(v);
  useEffect5(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { correct: true, picked: value });
      audio.triggerEvent("typed_ok");
    }
  }, [valid]);
  return <Stage eyebrow={tr3({ uz: "Mashq · else yoz", ru: "Практика · напишите else" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={isMentorLive ? false : !passed} label={isMentorLive ? { uz: "Davom etish", ru: "Продолжить" } : passed ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "else qatorini yozing", ru: "Напишите строку else" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>else</span> ni ham o'zingiz yozing.</>, ru: <>Теперь напишите и <span className="italic" style={{ color: T.accent }}>else</span> сами.</> })}</h2></div>
        <Mentor>{tr3({ uz: <>if bloki tayyor. Endi <b style={{ color: T.ink }}>"aks holda" yo'lini</b> qo'shing: if blokini <span className="mono">{"}"}</span> bilan yoping, <span className="mono">else</span> yozing va yangi blok <span className="mono">{"{"}</span> oching. Ya'ni: <span className="mono">{"} else {"}</span></>, ru: <>Блок if готов. Теперь добавьте <b style={{ color: T.ink }}>путь «иначе»</b>: закройте блок if символом <span className="mono">{"}"}</span>, напишите <span className="mono">else</span> и откройте новый блок <span className="mono">{"{"}</span>. То есть: <span className="mono">{"} else {"}</span></> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up" style={{ fontSize: "clamp(12.5px,1.9vw,14.5px)" }}>
              <Kw>if</Kw> (<Vr>score</Vr> <Op>{">"}</Op> <Nm>90</Nm>) {"{"}{"\n"}
              {"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: '"Ajoyib!"', ru: '"Отлично!"' })}</St>){"\n"}
              <span style={{ color: CODE.comment }}>{tr3({ uz: "▼ shu qatorni siz yozasiz ▼", ru: "▼ эту строку пишете вы ▼" })}</span>
            </pre>
            <input className="fade-up delay-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder={"} else {"} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: "100%", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, padding: "14px 16px", borderRadius: 12, border: "none", background: T.paper, color: T.ink, outline: "none", transition: "box-shadow 0.2s", boxShadow: valid ? `0 0 0 2px ${T.success}, 0 8px 20px -8px rgba(${T.shadowBase},0.2)` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            <pre className="code-box fade-up delay-1" style={{ fontSize: "clamp(12.5px,1.9vw,14.5px)" }}>
              {"  "}<Vr>console</Vr>.<Vr>log</Vr>(<St>{tr3({ uz: `"Yana urinib ko'ring"`, ru: '"Попробуйте ещё раз"' })}</St>){"\n"}
              {"}"}
            </pre>
            <div className="fade-up delay-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ opacity: hasClose ? 1 : 0.4 }}>{hasClose ? "✓" : "1"} {"}"} — {tr3({ uz: "if ni yop", ru: "закройте if" })}</span>
              <span className="tagpill" style={{ opacity: hasElse ? 1 : 0.4 }}>{hasElse ? "✓" : "2"} else</span>
              <span className="tagpill" style={{ opacity: hasOpen ? 1 : 0.4 }}>{hasOpen ? "✓" : "3"} {"{"} — {tr3({ uz: "yangi blok", ru: "новый блок" })}</span>
            </div>
            {passed ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: `✓ Ajoyib! Endi dasturingizda ikkala yo'l ham bor: rost bo'lsa — "Ajoyib!", yolg'on bo'lsa — "Yana urinib ko'ring".`, ru: "✓ Отлично! Теперь в вашей программе есть оба пути: истина — «Отлично!», ложь — «Попробуйте ещё раз»." })}</p></div> : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr3({ uz: <>Uch qism: {"}"} keyin else keyin {"{"} — hammasi bitta qatorda.</>, ru: <>Три части: {"}"} потом else потом {"{"} — всё в одной строке.</> })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "natija", ru: "результат" })}</p>
            <div style={{ background: T.paper, borderRadius: 14, minHeight: 120, padding: "20px", boxShadow: `0 8px 22px -10px rgba(${T.shadowBase},0.16)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              {valid ? <div className="fade-step"><div style={{ fontSize: 34 }}>🔀</div><p style={{ fontFamily: "Georgia, serif", color: T.success, fontWeight: 700, margin: "8px 0 0" }}>{tr3({ uz: "Ikki yo'l tayyor!", ru: "Оба пути готовы!" })}</p><p className="small" style={{ margin: "4px 0 0", color: T.ink2 }}>{tr3({ uz: `rost → "Ajoyib!" · yolg'on → "Yana urinib ko'ring"`, ru: "истина → «Отлично!» · ложь → «Попробуйте ещё раз»" })}</p></div> : <p style={{ fontFamily: "Georgia, serif", color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr3({ uz: "To'liq yozing:", ru: "Напишите полностью:" })} <span className="mono" style={{ fontStyle: "normal" }}>{"} else {"}</span></p>}
            </div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var JS_FLASHCARDS = [
  { front: { uz: "Shart rost bo'lganda kodni ishga tushiradigan so'z qaysi?", ru: "Какое слово запускает код, когда условие истинно?" }, back: "if", note: { uz: "if (shart) { ... }", ru: "if (условие) { ... }" } },
  { front: { uz: "Shart yolg'on bo'lsa, qaysi so'z ishlaydi?", ru: "Какое слово срабатывает, если условие ложно?" }, back: "else", note: { uz: "«aks holda» degani — if dan keyin keladi", ru: "значит «иначе» — идёт после if" } },
  { front: { uz: "Bir nechta yo'ldan birini tanlash uchun qaysi so'z ishlatiladi?", ru: "Каким словом выбирают один путь из нескольких?" }, back: "else if", note: { uz: "90+ → 5, 70+ → 4, 60+ → 3, qolgani → 2", ru: "90+ → 5, 70+ → 4, 60+ → 3, остальное → 2" } },
  { front: { uz: "Ikki qiymat tengligini qaysi belgi tekshiradi?", ru: "Каким знаком проверяют равенство двух значений?" }, back: "==", note: { uz: "10 == 10 → true", ru: "10 == 10 → true" } },
  { front: { uz: "Qutiga qiymat berish uchun qaysi belgi ishlatiladi?", ru: "Каким знаком дают значение коробке?" }, back: "=", note: { uz: "score = 10 — bu tekshiruv emas", ru: "score = 10 — это не проверка" } },
  { front: { uz: "Teng EMASligini qaysi belgi tekshiradi?", ru: "Какой знак проверяет, что значения НЕ равны?" }, back: "!=", note: { uz: "10 != 7 → true", ru: "10 != 7 → true" } },
  { front: { uz: "«Katta yoki teng»ni qaysi belgi bildiradi?", ru: "Какой знак означает «больше или равно»?" }, back: ">=", note: { uz: "age >= 16 — 16 yosh ham o'tadi", ru: "age >= 16 — 16 лет тоже проходит" } },
  { front: { uz: "Shart tekshiruvi qanday natija qaytaradi?", ru: "Какой результат возвращает проверка условия?" }, back: "true / false", note: { uz: "boolean qiymat — rost yoki yolg'on", ru: "значение boolean — истина или ложь" } },
  { front: { uz: "«Kichik»ni qaysi belgi bildiradi?", ru: "Какой знак означает «меньше»?" }, back: "<", note: { uz: "battery < 20 — zaryad kam", ru: "battery < 20 — заряд низкий" } },
  { front: { uz: "Shart bajarilganda ishlaydigan kod nima ichiga yoziladi?", ru: "Во что записывают код, который работает при выполнении условия?" }, back: "{ }", note: { uz: "figurali qavs — kod bloki", ru: "фигурные скобки — блок кода" } },
  { front: { uz: "if/else da bir vaqtda nechta blok ishlaydi?", ru: "Сколько блоков работает в if/else одновременно?" }, back: { uz: "Faqat bittasi", ru: "Только один" }, note: { uz: "yo if, yo else — ikkalasi birga emas", ru: "либо if, либо else — не оба сразу" } },
  { front: { uz: "14 > 12 ifodasi qanday qiymat qaytaradi?", ru: "Какое значение вернёт выражение 14 > 12?" }, back: "true", note: { uz: "taqqoslash doim true yoki false beradi", ru: "сравнение всегда даёт true или false" } }
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
  const [queue, setQueue] = useState4(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState4(false);
  const [known, setKnown] = useState4(0);
  const [exiting, setExiting] = useState4(null);
  const swapRef = useRef4(0);
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
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr3({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{total}/{total} {tr3({ uz: "atama yodlandi", ru: "терминов выучено" })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr3({ uz: "Qaytadan takrorlash", ru: "Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr3({ uz: "O'rganilmoqda", ru: "Учим" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr3({ uz: "Bildim", ru: "Знаю" })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr3(card.front)}</span><span className="fc-cue">{tr3({ uz: "Javobni o'ylang", ru: "Подумайте над ответом" })} 🤔 <span className="fc-tap">{tr3({ uz: "bosing", ru: "нажмите" })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr3(card.back))}{card.note && <span className="fc-note">{tr3(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr3({ uz: "Takrorlash", ru: "Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr3({ uz: "Bildim", ru: "Знаю" })}</button></div> : <p className="fc-hint">👆 {tr3({ uz: "Kartani bosing — javobni ko'rasiz", ru: "Нажмите на карточку — увидите ответ" })}</p>}
    </div>;
}
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "sflash", text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: "on_mount", waits_for: null }]);
  useEffect5(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr3({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: "Yakunlash →", ru: "Завершить →" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={JS_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
  const [hwOpen, setHwOpen] = useState4(false);
  const [hwCharge, setHwCharge] = useState4(false);
  const fireHw = () => {
    if (hwCharge || hwOpen) return;
    setHwCharge(true);
    setTimeout(() => {
      setHwOpen(true);
      setHwCharge(false);
    }, 500);
  };
  const _gate = useContext2(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState4(false);
  const [arenaSolo, setArenaSolo] = useState4(false);
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
  const audio = useAudio([{ id: "s16", text: "Tabriklaymiz — endi dasturingiz qaror qabul qila oladi! Eslab qoling: if shart rost bo'lsa ishlaydi, else aks holda, else if bir nechta yo'l uchun, taqqoslash operatorlari true yoki false beradi, bitta teng qiymat beradi, ikki teng tekshiradi. Keyingi darsda kompyuterni ko'p marta takrorlatishni — sikllarni o'rganamiz.", trigger: "on_mount", waits_for: null }]);
  const RECAP = [{ uz: "if — shart rost bo'lsa kod ishlaydi", ru: "if — код работает, если условие истинно" }, { uz: "Taqqoslash: > < >= <= == !=", ru: "Сравнение: > < >= <= == !=" }, { uz: "else — aks holda", ru: "else — иначе" }, { uz: "else if — bir nechta yo'l", ru: "else if — несколько путей" }, { uz: "= qiymat beradi, == tekshiradi", ru: "= даёт значение, == проверяет" }];
  const HOMEWORK = [{ b: "age", t: { uz: `— if/else bilan "ID-karta olsa bo'ladimi?" ni aniqlang`, ru: "— через if/else определите «можно ли получить ID-карту?»" } }, { b: "score", t: { uz: "— else if bilan ball → 5/4/3/2", ru: "— балл → 5/4/3/2 через else if" } }, { b: "pin", t: { uz: "— == bilan PIN-kod to'g'ri/xato ekanini tekshiring", ru: "— проверьте через ==, верный PIN-код или нет" } }];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr3({ uz: "Tayyor", ru: "Готово" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr3({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr3({ uz: "Yakunlash", ru: "Завершить" })} ✓</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr3({ uz: "Dars tugadi", ru: "Урок пройден" })}</span><h2 className="title h-title fade-up d1">{tr3({ uz: <>Dasturingiz endi <span className="italic" style={{ color: T.accent }}>qaror</span> qabul qiladi.</>, ru: <>Ваша программа теперь принимает <span className="italic" style={{ color: T.accent }}>решения</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark
    stats={false}
    disabled={studentWait}
    liveOn={studentLive}
    onClick={studentWait ? void 0 : openArena}
    hint={studentWait ? tr3({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0}
  />
        </div>
        {arena && <QuizArena live={_live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: "50%", background: T.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> {tr3({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr3(r)}</span></li>)}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? "charging" : ""}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, "--d": `${k.d}s` }}>{tr3(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr3({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span>
            <span className="hw-big-s">{tr3({ uz: "Amaliy topshiriqni bajarish →", ru: "Выполнить практическое задание →" })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 {tr3({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr3({ uz: "Mana bu shartlarni yozib ko'ring:", ru: "Попробуйте написать эти условия:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b className="mono">{h.b}</b> <span className="t">{tr3(h.t)}</span></li>)}</ul><p className="hw-note">{tr3({ uz: "Keyingi darsda kompyuterni ko'p marta takrorlatamiz — sikllar! 🔁", ru: "На следующем уроке заставим компьютер повторять много раз — циклы! 🔁" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr3({ uz: "Nishonlaringiz", ru: "Ваши значки" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(achievements && achievements.has(id));
    return <div key={id} className={`ach-badge ${got ? "got" : "locked"}`} title={tr3(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : "🔒"}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr3(a.desc)}</span>}
              </div>;
  })}
          </div>
        </div>}
      </div>
    </Stage>;
};
var Q_LABELS = { 4: { uz: "1 — if qachon ishlaydi", ru: "1 — когда работает if" }, 6: { uz: "2 — else (false)", ru: "2 — else (false)" }, 12: { uz: "3 — == tenglik", ru: "3 — == равенство" }, 14: { uz: "4 — if yozing", ru: "4 — напишите if" } };
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
var ACHIEVEMENTS = {
  builder: { icon: "🔋", name: "Rule Maker", desc: { uz: "Zaryad shartini o'zingiz tuzdingiz", ru: "Вы сами собрали условие заряда" } },
  debugger: { icon: "🐞", name: "Nice Catch!", desc: { uz: "= va == xatosini topib tuzatdingiz", ru: "Вы нашли и починили ошибку = и ==" } },
  firstif: { icon: "🚦", name: "Logic Master", desc: { uz: "Birinchi if shartingizni o'zingiz yozdingiz", ru: "Вы сами написали своё первое условие if" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "if/else darsini to'liq yakunladingiz", ru: "Вы полностью прошли урок if/else" } }
};
var ACH_TRIGGERS = { s13: "builder", s14: "debugger", s15: "firstif" };
function AchCelebrate({ ach, onDone }) {
  useEffect5(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr3({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
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
          {ach.desc && <span className="acu-desc">{tr3(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr3({ uz: "bosib davom eting", ru: "нажмите, чтобы продолжить" })}</span>
      </div>
    </div>;
}
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}
var INLINE_KEYS = { s4: 3, s5b: 1, s9: 0, s15: -1 };
var ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState4([]);
  const [rows, setRows] = useState4([]);
  const [loaded2, setLoaded] = useState4(false);
  useEffect5(() => {
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
  return <Stage eyebrow={tr3({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr3({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши <span className="italic" style={{ color: T.accent }}>победители</span> сегодня</> }) : tr3({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>результат</span> сегодня</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr3({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr3({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr3({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не присоединился." })}</p></div> : <>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr3({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr3({ uz: "To'liq reyting", ru: "Полный рейтинг" })}</div>
              <div className="pod-list">
                {board.map((b, i) => <div key={b.id} className={`pod-row ${live.playerId === b.id ? "me" : ""}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map((q) => {
    const a = rows.find((r) => r.player_id === b.id && r.screen_idx === q);
    return <span key={q} className={`pod-dot ${a ? a.correct ? "ok" : "bad" : ""}`} title={tr3(Q_LABELS[q])} />;
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
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr3({ uz: "Savollar bo'yicha", ru: "По вопросам" })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map((q) => {
    const qa = rows.filter((r) => r.screen_idx === q);
    const okN = qa.filter((r) => r.correct).length;
    const pct = qa.length ? Math.round(okN / qa.length * 100) : 0;
    const hard = qa.length >= 2 && pct < 50;
    return <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{tr3(Q_LABELS[q]) || `#${q}`}{hard && " ⚠️"}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>;
  })}
              </div>
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr3({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Ularni yana bir bor tushuntiring.", ru: "Вопросы со знаком ⚠️ — темы, где класс споткнулся. Объясните их ещё раз." })}</p>}
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
  { ch: "if", l: 6, t: 18, s: 40, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: "{ }", l: 84, t: 12, s: 34, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: "else", l: 9, t: 74, s: 30, c: "rgba(255,110,70,0.15)", d: 27, dl: 0.8 },
  { ch: "==", l: 78, t: 70, s: 28, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: "true", l: 46, t: 86, s: 30, c: "rgba(120,235,175,0.13)", d: 25, dl: 1.1 },
  { ch: ">=", l: 66, t: 24, s: 22, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: "false", l: 24, t: 36, s: 26, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "else if", l: 92, t: 46, s: 24, c: "rgba(203,173,255,0.10)", d: 24, dl: 1.3 },
  { ch: "!=", l: 2, t: 46, s: 24, c: "rgba(203,173,255,0.14)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "`if (age >= 16)` — age 14 bo'lsa, ichidagi kod ishlaydimi?", ru: "`if (age >= 16)` — если age равен 14, код внутри сработает?" }, opts: [{ uz: "Ha, ishlaydi", ru: "Да, сработает" }, { uz: "Xato beradi", ru: "Выдаст ошибку" }, { uz: "Yo'q — shart `false`", ru: "Нет — условие `false`" }, { uz: "Ba'zan", ru: "Иногда" }], correct: 2 },
  { q: { uz: "`20 > 15` ifodasi qanday qiymat qaytaradi?", ru: "Какое значение вернёт выражение `20 > 15`?" }, opts: ["`true`", "`20`", "`false`", "`15`"], correct: 0 },
  { q: { uz: "`=` va `==` o'rtasidagi farq nima?", ru: "В чём разница между `=` и `==`?" }, opts: [{ uz: "Farqi yo'q", ru: "Разницы нет" }, { uz: "`=` qiymat beradi, `==` tekshiradi", ru: "`=` даёт значение, `==` проверяет" }, { uz: "`=` tekshiradi, `==` qiymat beradi", ru: "`=` проверяет, `==` даёт значение" }, { uz: "`==` faqat raqamlar uchun", ru: "`==` только для чисел" }], correct: 1 },
  { q: { uz: "`if` bloki ishlamasa, o'rniga qaysi blok ishlaydi?", ru: "Если блок `if` не сработал, какой блок работает вместо него?" }, opts: [{ uz: "Yana `if`", ru: "Ещё один `if`" }, { uz: "Hech biri", ru: "Никакой" }, { uz: "Sikl", ru: "Цикл" }, { uz: "`else` bloki", ru: "Блок `else`" }], correct: 3 },
  { q: { uz: "`!=` operatori nimani bildiradi?", ru: "Что означает оператор `!=`?" }, opts: [{ uz: "Teng", ru: "Равно" }, { uz: "Teng emas", ru: "Не равно" }, { uz: "Katta", ru: "Больше" }, { uz: "Kichik yoki teng", ru: "Меньше или равно" }], correct: 1 },
  { q: { uz: "`7 == 9` natijasi qanday?", ru: "Каков результат `7 == 9`?" }, opts: ["`false`", "`true`", "`9`", { uz: "Xato", ru: "Ошибка" }], correct: 0 },
  { q: { uz: "Bir nechta shartni ketma-ket tekshirish uchun nima ishlatiladi?", ru: "Что используется для проверки нескольких условий по очереди?" }, opts: ["`else`", "`let`", { uz: "`==` ketma-ket", ru: "`==` подряд" }, "`else if`"], correct: 3 },
  { q: { uz: "`let battery = 30` bo'lsa, `if (battery < 20)` ichidagi kod ishlaydimi?", ru: "Если `let battery = 30`, код внутри `if (battery < 20)` сработает?" }, opts: [{ uz: "Ha — 30 katta son", ru: "Да — 30 большое число" }, { uz: "Yo'q — `30 < 20` bu `false`", ru: "Нет — `30 < 20` это `false`" }, { uz: "Faqat zaryad 20 bo'lganda", ru: "Только при заряде 20" }, { uz: "Xato beradi", ru: "Выдаст ошибку" }], correct: 1 },
  { q: { uz: "`if (score >= 90)` da score 90 bo'lsa, shart `true` bo'ladimi?", ru: "В `if (score >= 90)` при score равном 90 условие будет `true`?" }, opts: [{ uz: "Yo'q, faqat 91+ da", ru: "Нет, только при 91+" }, { uz: "Xato beradi", ru: "Выдаст ошибку" }, { uz: "Ha — `>=` tenglikni ham qamraydi", ru: "Да — `>=` включает и равенство" }, { uz: "Faqat score 100 da", ru: "Только при score 100" }], correct: 2 },
  { q: { uz: "`5 <= 3` ifodasi nima qaytaradi?", ru: "Что вернёт выражение `5 <= 3`?" }, opts: ["`true`", "`5`", "`3`", "`false`"], correct: 3 },
  { q: { uz: "`if/else` da bir vaqtda nechta blok ishlaydi?", ru: "Сколько блоков работает в `if/else` одновременно?" }, opts: [{ uz: "Faqat bittasi", ru: "Только один" }, { uz: "Ikkalasi ham", ru: "Оба" }, { uz: "Hech biri", ru: "Ни одного" }, { uz: "Uchtasi", ru: "Три" }], correct: 0 },
  { q: { uz: "Shartda tenglikni qaysi belgi bilan tekshiramiz?", ru: "Каким знаком проверяем равенство в условии?" }, opts: ["`=`", "`<`", "`==`", "`+`"], correct: 2 }
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
  const [charge, setCharge] = useState4(false);
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
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr3({ uz: "SAVOL", ru: "ВОПРОСОВ" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1e3}</b> {tr3({ uz: "SONIYA", ru: "СЕКУНД" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">🏆 {tr3({ uz: "PODIUM", ru: "ПОДИУМ" })}</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>;
};
function QzFX() {
  const ref = useRef4(null);
  useEffect5(() => {
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
    const TOK = ["if", "else", "==", ">=", "true", "false", "{ }", "else if"];
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
  const [soloMode, setSoloMode] = useState4(!!startSolo);
  const solo = soloMode || !isMentor && !isStudent;
  const soloRef = useRef4(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState4("lobby");
  const [qi, setQi] = useState4(-1);
  const [remaining, setRemaining] = useState4(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState4({});
  const [players, setPlayers] = useState4([]);
  const [qRows, setQRows] = useState4([]);
  const [answeredN, setAnsweredN] = useState4(0);
  const [classEnded, setClassEnded] = useState4(false);
  const seenQRef = useRef4(-1);
  const qStartRef = useRef4(0);
  const deadlineRef = useRef4(0);
  const phaseRef = useRef4(phase);
  phaseRef.current = phase;
  useEffect5(() => {
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
  useEffect5(() => {
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
  useEffect5(() => {
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
      if (!window.confirm(tr3({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr3({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {
    /* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */
  }
      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>⚠️ {tr3({ uz: "Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr3({ uz: "Mashq rejimida davom etish", ru: "Продолжить в режиме практики" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr3({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают бонус 🔥!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr3({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>▶ {tr3({ uz: "Testni boshlash", ru: "Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr3({ uz: "Mentor testni boshlashini kuting…", ru: "Ждите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr3({ uz: "Boshlash", ru: "Начать" })}</button>}
        </div>}

      {
    /* ===== SAVOL ===== */
  }
      {phase === "q" && Q && <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr3({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span> : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : " "}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(tr3(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const pickedThis = my && my.picked === i;
    return <button key={i} className={`qz-tile ${my ? pickedThis ? "picked" : "faded" : ""}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr3(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>;
  })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr3({ uz: "Javob qabul qilindi — natijani kuting…", ru: "Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr3({ uz: "Hamma javob berdi!", ru: "Все ответили!" })}</span>}
              <button className="qz-btn" onClick={() => ctrl("r", qi)}>⏹ {tr3({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>
            </div>}
        </div>}

      {
    /* ===== NATIJA (reveal) ===== */
  }
      {phase === "reveal" && Q && <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr3({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr3({ uz: "natija", ru: "результат" })}</span>
          </div>
          <h2 className="qz-q">{fmtCode(tr3(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const win = i === Q.correct;
    const pickedThis = my && my.picked === i;
    return <div key={i} className={`qz-tile rv ${win ? "win" : "lose"} ${pickedThis ? "picked" : ""}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr3(o))}</span>
                  <span className="qz-cnt">{win ? "✓ " : ""}{counts[i]}</span>
                </div>;
  })}
          </div>
          {!isMentor && <div className={`qz-res ${my?.correct ? "good" : "bad"}`}>
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr3({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr3({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr3({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Побыстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr3({ uz: "Siz hozir:", ru: "Вы сейчас:" })} {myRank + 1}-{tr3({ uz: "o'rin", ru: "е место" })}</span>}
            </div>}
          {!solo && <div className="qz-board">
              <div className="qz-board-h">🏆 TOP-5</div>
              {board.slice(0, 5).map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>)}
            </div>}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : ctrl("q", qi + 1)}>{lastQ ? tr3({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr3({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr3({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr3({ uz: "Keyingi →", ru: "Дальше →" })}</button>}
        </div>}

      {
    /* ===== YAKUN — PODIUM ===== */
  }
      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: "clamp(20px,3.4vw,30px)" }}>{tr3({ uz: "Test yakunlandi!", ru: "Тест завершён!" })} 🎉</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr3({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ""}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верно${soloScore.maxStreak >= 2 ? ` · лучший стрик 🔥x${soloScore.maxStreak}` : ""}` })}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr3({ uz: "Qayta ishlash", ru: "Пройти ещё раз" })}</button>
            </div> : <>
              <div className="qz-pod">
                {[1, 0, 2].map((rank) => {
    const b = board[rank];
    return <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? "me" : ""}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : "—"}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr3({ uz: "ball", ru: "баллов" })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>;
  })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr3({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr3({ uz: "Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "Пройти тест ещё раз — практика (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr3({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
function MentorPracticeOverlay({ entry, live, onClose }) {
  const [view, setView] = useState4("watch");
  const [data, setData] = useState4({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect5(() => {
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
        <div className="mp-eyebrow">✍️ {tr3({ uz: "Amaliyot · jonli", ru: "Практика · живой урок" })}</div>
        <h2 className="mp-title">{tr3(entry.task.title)}</h2>
        <p className="mp-brief">{tr3(entry.task.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">1 · {tr3({ uz: "O'quvchilar o'z qurilmasida yozmoqda", ru: "Ученики пишут на своих устройствах" })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">2 · {tr3({ uz: "Mentor doskada yozib ko'rsatadi", ru: "Ментор пишет и показывает на доске" })}</span>
        </div>
        {data.players === null ? <p className="mstats-wait">{tr3({ uz: "Ulanish…", ru: "Подключение…" })}</p> : <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr3({ uz: "Praktikani tugatdi", ru: "Завершили практику" })}</span>
              <span className="mstats-n">{allIn ? tr3({ uz: "✓ Hamma tugatdi!", ru: "✓ Все закончили!" }) : <>{tr3({ uz: "Tugatdi:", ru: "Закончили:" })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(doneN / total * 100) : 0}%` }} /></div>
            {total > 0 && <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map((p) => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : void 0}>{doneIds.has(p.id) ? "✓ " : "✏️ "}{p.nickname}</span>)}
              </div>}
            {total === 0 && <p className="mstats-wait">{tr3({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: "Пока никто не присоединился — как только ученики начнут практику, здесь появятся ✓…" })}</p>}
          </div>}
        <div className="mp-actions">
          <button className="mp-demo" onClick={() => setView("demo")}>🖊 {tr3({ uz: "Doskada yozib ko'rsatish", ru: "Показать на доске" })}</button>
          <button className="mp-next" onClick={onClose}>{tr3({ uz: "Keyingi mavzuga", ru: "К следующей теме" })} →</button>
        </div>
        <p className="mp-tip">{tr3({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga yozing — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: "💡 Когда большинство закончит, напишите это же упражнение на доске вместе — так ученики проверят себя, и тема закрепится." })}</p>
      </div>
    </div>;
}
var TASK_RADAR = {
  eyebrow: { uz: "Praktika · if / else", ru: "Практика · if / else" },
  title: { uz: "Radar: jarima bormi?", ru: "Радар: есть штраф?" },
  brief: { uz: "Yo'lda «60» belgisi turibdi. Birinchi qator tayyor: `let speed = 75` (tezlik, km/soat). Agar `speed` 60 dan katta bo'lsa — konsolga `Siz jarimaga tushdingiz`, aks holda — `Jarima yo'q` chiqsin. Tezlik 75 bo'lgani uchun konsolda `Siz jarimaga tushdingiz` chiqadi.", ru: "На дороге знак «60». Первая строка готова: `let speed = 75` (скорость, км/ч). Если `speed` больше 60 — в консоль `Siz jarimaga tushdingiz`, иначе — `Jarima yo'q`. Так как скорость 75, в консоли появится `Siz jarimaga tushdingiz`." },
  files: [
    { name: "script.js", lang: "js", starter: `let speed = 75

// if ... else ni shu yerga yozing
` }
  ],
  requirements: [
    { id: "if", label: { uz: "if sharti yozildi", ru: "условие if написано" }, check: checks.js(/if\s*\(/, { uz: "`if (speed > 60) {` deb yozing", ru: "Напишите `if (speed > 60) {`" }) },
    { id: "else", label: { uz: "else qismi yozildi", ru: "часть else написана" }, check: checks.js(/\belse\b/, { uz: "Shartdan keyin `} else {` qo'shing", ru: "После условия добавьте `} else {`" }) },
    { id: "log", label: { uz: "konsolda: Siz jarimaga tushdingiz", ru: "в консоли: Siz jarimaga tushdingiz" }, check: checks.logs("Siz jarimaga tushdingiz", { uz: 'Shart ichida `console.log("Siz jarimaga tushdingiz")` yozing', ru: 'Внутри условия напишите `console.log("Siz jarimaga tushdingiz")`' }) }
  ]
};
var TASK_TRANSLATE = {
  eyebrow: { uz: "Praktika · ==", ru: "Практика · ==" },
  title: { uz: "Ilova qaysi tilda salomlashadi?", ru: "На каком языке приложение здоровается?" },
  brief: { uz: '`let lang = "en"` yozing. Agar `lang` `"uz"` ga teng bo\'lsa (`==`) — konsolga `Salom`, aks holda — `Hello` chiqsin. Til "en" bo\'lgani uchun konsolda `Hello` chiqadi.', ru: 'Напишите `let lang = "en"`. Если `lang` равен `"uz"` (`==`) — в консоль `Salom`, иначе — `Hello`. Так как язык "en", в консоли появится `Hello`.' },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "eq", label: { uz: "== bilan tekshirildi", ru: "проверено через ==" }, check: checks.js(/==/, { uz: 'Shartni `if (lang == "uz") {` deb yozing', ru: 'Напишите условие `if (lang == "uz") {`' }) },
    { id: "else", label: { uz: "else qismi yozildi", ru: "часть else написана" }, check: checks.js(/\belse\b/, { uz: "Shartdan keyin `} else {` qo'shing", ru: "После условия добавьте `} else {`" }) },
    { id: "log", label: { uz: "konsolda Hello", ru: "в консоли Hello" }, check: checks.logs("Hello", { uz: '`else` ichida `console.log("Hello")` yozing', ru: 'Внутри `else` напишите `console.log("Hello")`' }) }
  ]
};
var TASK_RADAR_LEVELS = {
  eyebrow: { uz: "Praktika · else if", ru: "Практика · else if" },
  title: { uz: "Radar: uch xil javob", ru: "Радар: три разных ответа" },
  brief: { uz: "`let speed = 85` yozing. Uch yo'l: 60 yoki undan kam (`<= 60`) — `Jarima yo'q`, 80 yoki undan kam (`<= 80`) — `Ogohlantirish`, aks holda — `Katta jarima`. Tezlik 85 bo'lgani uchun konsolda `Katta jarima` chiqadi.", ru: "Напишите `let speed = 85`. Три пути: 60 или меньше (`<= 60`) — `Jarima yo'q`, 80 или меньше (`<= 80`) — `Ogohlantirish`, иначе — `Katta jarima`. Так как скорость 85, в консоли появится `Katta jarima`." },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "elseif", label: { uz: "else if ishlatildi", ru: "использован else if" }, check: checks.js(/else\s+if\s*\(/, { uz: "Ikkinchi yo'l uchun `} else if (speed <= 80) {` yozing", ru: "Для второго пути напишите `} else if (speed <= 80) {`" }) },
    { id: "log", label: { uz: "konsolda Katta jarima", ru: "в консоли Katta jarima" }, check: checks.logs("Katta jarima", { uz: 'Oxirgi `else` ichida `console.log("Katta jarima")` yozing', ru: 'В последнем `else` напишите `console.log("Katta jarima")`' }) }
  ]
};
var PRACTICE_AFTER = {
  6: { task: TASK_RADAR, starter: "" },
  // 1) else testidan keyin — radar if/else
  12: { task: TASK_TRANSLATE, starter: "" },
  // 2) == testidan keyin — tarjima
  15: { task: TASK_RADAR_LEVELS, starter: "" }
  // 3) else-yozish mashqidan keyin — radar else if (yakuniy)
};
var HW_TASK = TASK_RADAR_LEVELS;
function JsConditionsLesson({ lang: langProp, onFinished, onPractice, liveToken }) {
  const lang = langProp || "uz";
  __lang2 = lang;
  setLiveLang(lang);
  const savedRef = useRef4(void 0);
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
  const [screen, setScreen] = useState4(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState4(() => saved && saved.answers || {});
  const [practice, setPractice] = useState4(null);
  const [mentorPractice, setMentorPractice] = useState4(null);
  const startTimeRef = useRef4(saved?.startedAt || Date.now());
  const earnedRef = useRef4(new Set(saved?.earned || []));
  const [earned, setEarned] = useState4(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState4([]);
  const achKeyRef = useRef4(0);
  const earn = useCallback3((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  useEffect5(() => {
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
      earn("logician");
      pracClear(LESSON_META.lessonId);
      setPractice(null);
      advance();
    };
    const openLocal = () => {
      pracWrite(LESSON_META.lessonId, { kind: `s${fromScreen}`, screen: fromScreen });
      setPractice({ ...entry, done, codeKey: codeKeyOf(LESSON_META.lessonId, `s${fromScreen}`) });
    };
    if (typeof onPractice !== "function") {
      openLocal();
      return;
    }
    try {
      Promise.resolve(onPractice(entry.task)).then(done, openLocal);
    } catch {
      openLocal();
    }
  };
  const openHomeworkPractice = () => {
    const entry = { task: HW_TASK, starter: "" };
    const openLocal = () => {
      pracWrite(LESSON_META.lessonId, { kind: "hw" });
      setPractice({ ...entry, codeKey: codeKeyOf(LESSON_META.lessonId, "hw"), done: () => {
        pracClear(LESSON_META.lessonId);
        setPractice(null);
      } });
    };
    if (typeof onPractice !== "function") {
      openLocal();
      return;
    }
    try {
      Promise.resolve(onPractice(entry.task)).catch(openLocal);
    } catch {
      openLocal();
    }
  };
  useEffect5(() => {
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
    if (!(live && (live.mode === "mentor" || live.mode === "student" && live.status !== "ended"))) {
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
  useEffect5(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect5(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  useEffect5(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen]);
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
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === "function") onFinished(payload);
  };
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen8, Screen7, Screen11, Screen13, Screen6, Screen9, Screen14, Screen15, ScreenElseWrite, ScreenPodium, ScreenFlashcards, Screen16];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        /* F-0812-03 — SHRIFT LIGATURASI O'CHIRILADI (F-0808-02 yechimi shu darsga ham).
           JetBrains Mono dasturchi-shrifti: === ni bitta glifga (uch chiziq), !== ni, >= va <= ni
           qo'shib chizadi. Ildizdagi font-feature-settings "ss01","cv11" meros bo'ladi,
           lekin ligaturani o'chirmaydi. Natijada bola kodda === yozgan bo'lsa ham ekranda boshqa
           belgi ko'radi (feedback/F-0812-03/ligatura-mobil.png — taqqoslash ekrani).
           🔴 font-variant-ligatures BILAN BIRGA yozilmaydi — Chrome unda butun qatorni tashlab ketadi.
           🔴 QAMROV: xossa guruh-selektorda EMAS, har mono-e'lonning O'Z ichida turadi. Sabab —
           guruh-ro'yxati unutishga moyil: dastlab shu darsda 13 selektor sanalgan edi, arena
           elementlari (.cs-tok, .cs-hud, .cs-livedot) esa ro'yxatdan tushib qolgan edi. */

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        /* F-0912-09 · 147-qonun (m1 da muhrlangan naqsh): ⛶ tugmasi burchagini matn
           AYLANIB o'tadi — faqat tugma yonidagi qator qisqaradi, qolganlari to'liq
           kenglikda qoladi. Hisob: tugma o'ngdan 6+30=36px egallaydi, idishning o'z
           o'ng chekinishi 15–16px → ~20px yetishmaydi, 28px nafas bilan olinadi. */
        .zb-notch::before { content: ''; float: right; width: 28px; height: 28px; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        /* ── Jonli demo animatsiyalari ── */
        @keyframes pop-in { 0% { opacity: 0; transform: scale(.82) translateY(10px); } 55% { opacity: 1; transform: scale(1.05) translateY(0); } 100% { transform: scale(1); } }
        .pop-in { animation: pop-in .42s cubic-bezier(.34,1.4,.4,1); }
        @keyframes pop-num { 0% { transform: scale(.5); opacity: 0; } 60% { transform: scale(1.18); opacity: 1; } 100% { transform: scale(1); } }
        .pop-num { animation: pop-num .5s cubic-bezier(.34,1.5,.4,1); display: inline-block; }
        @keyframes shake-x { 0%,100% { transform: translateX(0); } 18% { transform: translateX(-6px); } 38% { transform: translateX(6px); } 58% { transform: translateX(-4px); } 78% { transform: translateX(4px); } }
        .shake-x { animation: shake-x .45s ease; }
        @keyframes ring-green { 0% { box-shadow: 0 0 0 0 rgba(31,122,77,.5); } 70% { box-shadow: 0 0 0 16px rgba(31,122,77,0); } 100% { box-shadow: 0 0 0 0 rgba(31,122,77,0); } }
        @keyframes ring-red { 0% { box-shadow: 0 0 0 0 rgba(255,79,40,.5); } 70% { box-shadow: 0 0 0 16px rgba(255,79,40,0); } 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ring-green { animation: ring-green 1.3s ease-out; } .ring-red { animation: ring-red 1.3s ease-out; }
        @keyframes flow-x { 0% { transform: translate(-3px,0); opacity: .45; } 50% { transform: translate(3px,0); opacity: 1; } 100% { transform: translate(-3px,0); opacity: .45; } }
        .flow-x { animation: flow-x 1.1s ease-in-out infinite; display: inline-block; }
        /* Telefon qulfi (hook, F-0914-02) */
        .lock-phone { width: 76px; height: 104px; margin: 0 auto; border-radius: 16px; background: ${T.paper}; box-shadow: inset 0 0 0 3px ${T.ink}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; animation: lock-pop .35s cubic-bezier(.34,1.3,.4,1); }
        .lock-phone.open { box-shadow: inset 0 0 0 3px ${T.success}; }
        .lock-phone.shut { box-shadow: inset 0 0 0 3px ${T.accent}; }
        .lock-ic { font-size: 30px; line-height: 1; }
        .lock-pin { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: ${T.ink}; }
        @keyframes lock-pop { from { transform: scale(.92); } to { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lock-phone { animation: none; } }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

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

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.65; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        .var-box { display: inline-flex; flex-direction: column; min-width: 130px; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.18); }
        .var-name { background: ${T.ink}; color: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12.5px; padding: 8px 14px; letter-spacing: 0.03em; }
        .var-val { padding: 16px 14px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-align: center; font-size: clamp(18px,3vw,24px); }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

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

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

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

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

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
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
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
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none;
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
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
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
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
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
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
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
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
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
        /* kod atamasi chipi — savol/variant/izohlarda oddiy matndan ajralib turadi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }


        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

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
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
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
  JsConditionsLesson as default
};
