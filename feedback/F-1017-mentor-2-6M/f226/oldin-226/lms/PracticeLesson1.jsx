// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/PracticeLesson1.jsx
//          src/compilator/HtmlCompiler.jsx
//  Qayta yig'ish:  node scripts/build-lms.mjs src/2-Modull/PracticeLesson1.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/lms-entry:PracticeLesson1.jsx
import React3, { createElement as __ccEl, useState as useState5, useEffect as useEffect6, useRef as useRef5, useCallback as useCallback3, useMemo as useMemo2, createContext as createContext2, useContext as useContext2, useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, isValidElement } from "react";

// src/2-Modull/PracticeLesson1.jsx
import { createPortal } from "react-dom";

// src/compilator/HtmlCompiler.jsx
var __lang = "uz";
var tr = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var useMedia = (q) => {
  const [on2, setOn] = useState(() => typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : false);
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
  return on2;
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
  successSoft: "#E3F0E8",
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
var TEG_TARTIB = ["m1-01", "m1-02", "m1-03", "m1-04", "m1-14", "m1-05", "m1-06", "m1-07", "m1-15", "m1-08", "m1-10", "m1-09", "m1-11", "m1-12", "m1-13", "m2-01", "m2-02", "m2-03", "m2-04", "m2-05", "m2-06", "m2-07", "m2-08", "m2-09", "m2-10", "m2-11", "m2-12", "m2-13", "m2-14", "m2-15", "m2-16", "m3-*", "m4-*", "m4a-*", "m4b-*", "m4c-*"];
var BOSQICH = { "_izoh": "Qaysi darsdan qaysi imkoniyat ochiladi (Q5). Dars kompilyatorga `stage` bermasa — hammasi ochiq (2-Moduldan boshlab).", "emmet": "m1-15", "class_id_qisqartma": "m1-06", "css_maslahat": "m1-06", "js_maslahat": "m2-02" };
var TAG_MENU_ALL = [
  { t: "h1", dars: "m1-03", matn: true, d: { "uz": "eng katta sarlavha", "ru": "самый большой заголовок" } },
  { t: "h2", dars: "m1-03", matn: true, d: { "uz": "bo'lim sarlavhasi", "ru": "заголовок раздела" } },
  { t: "h3", dars: "m1-03", matn: true, d: { "uz": "kichik sarlavha", "ru": "малый заголовок" } },
  { t: "h4", dars: "m1-03", matn: true, d: { "uz": "4-daraja sarlavha", "ru": "заголовок 4-го уровня" } },
  { t: "h5", dars: "m1-03", matn: true, d: { "uz": "5-daraja sarlavha", "ru": "заголовок 5-го уровня" } },
  { t: "h6", dars: "m1-03", matn: true, d: { "uz": "eng kichik sarlavha", "ru": "самый маленький заголовок" } },
  { t: "p", dars: "m1-03", matn: true, d: { "uz": "matn xatboshisi", "ru": "абзац текста" } },
  { t: "strong", dars: "m1-03", matn: true, d: { "uz": "qalin matn", "ru": "жирный текст" } },
  { t: "em", dars: "m1-03", matn: true, d: { "uz": "qiya matn", "ru": "наклонный текст" } },
  { t: "ul", dars: "m1-03", d: { "uz": "ro'yxat", "ru": "список" } },
  { t: "ol", dars: "m1-03", d: { "uz": "raqamli ro'yxat", "ru": "нумерованный список" } },
  { t: "li", dars: "m1-03", matn: true, d: { "uz": "ro'yxat bandi", "ru": "пункт списка" } },
  { t: "a", dars: "m1-03", matn: true, d: { "uz": "havola", "ru": "ссылка" } },
  { t: "html", dars: "m1-03", d: { "uz": "butun sahifa", "ru": "вся страница" } },
  { t: "head", dars: "m1-03", d: { "uz": "sahifa sozlamalari (ko'rinmaydi)", "ru": "настройки страницы (не видно)" } },
  { t: "title", dars: "m1-03", matn: true, d: { "uz": "varaq nomi", "ru": "название вкладки" } },
  { t: "body", dars: "m1-03", d: { "uz": "sahifa tanasi (ko'rinadi)", "ru": "тело страницы (видно)" } },
  { t: "img", dars: "m1-04", void: true, d: { "uz": "rasm", "ru": "картинка" } },
  { t: "header", dars: "m1-04", d: { "uz": "sahifa boshi", "ru": "шапка страницы" } },
  { t: "main", dars: "m1-04", d: { "uz": "asosiy qism", "ru": "основная часть" } },
  { t: "footer", dars: "m1-04", d: { "uz": "sahifa pasti", "ru": "подвал страницы" } },
  { t: "div", dars: "m1-04", d: { "uz": "oddiy quti", "ru": "обычный блок" } },
  { t: "form", dars: "m1-04", d: { "uz": "forma", "ru": "форма" } },
  { t: "input", dars: "m1-04", void: true, d: { "uz": "yozish maydoni", "ru": "поле ввода" } },
  { t: "label", dars: "m1-04", matn: true, d: { "uz": "maydon yozuvi", "ru": "подпись поля" } },
  { t: "button", dars: "m1-04", matn: true, d: { "uz": "tugma", "ru": "кнопка" } },
  { t: "style", dars: "m1-06", d: { "uz": "CSS shu yerda", "ru": "CSS здесь" } },
  { t: "link", dars: "m1-06", void: true, d: { "uz": "CSS faylini ulash", "ru": "подключить CSS" } },
  { t: "nav", dars: "m1-08", d: { "uz": "menyu", "ru": "меню" } },
  { t: "section", dars: "m1-08", d: { "uz": "bo'lim", "ru": "раздел" } },
  { t: "span", dars: "m2-08", matn: true, d: { "uz": "matn ichidagi bo'lak", "ru": "кусочек внутри текста" } }
];
var ATTR_MENU_ALL = {
  "a": [{ a: "href", dars: "m1-03", d: { "uz": "qayerga olib boradi", "ru": "куда ведёт" } }],
  "img": [{ a: "src", dars: "m1-04", d: { "uz": "rasm manzili", "ru": "адрес картинки" } }, { a: "alt", dars: "m1-04", d: { "uz": "rasm o'rnidagi matn", "ru": "текст вместо картинки" } }],
  "input": [{ a: "type", dars: "m1-04", d: { "uz": "maydon turi", "ru": "тип поля" }, v: ["text", "email", "password", "number"] }, { a: "placeholder", dars: "m1-04", d: { "uz": "xira maslahat", "ru": "подсказка" } }, { a: "value", dars: "m1-04", d: { "uz": "boshlang'ich qiymat", "ru": "начальное значение" } }],
  "*": [{ a: "class", dars: "m1-06", d: { "uz": "CSS uchun nom", "ru": "имя для CSS" } }, { a: "style", dars: "m1-06", d: { "uz": "CSS shu yerning o'zida", "ru": "CSS прямо здесь" } }, { a: "id", dars: "m1-08", d: { "uz": "yagona nom", "ru": "уникальное имя" } }],
  "link": [{ a: "rel", dars: "m1-06", d: { "uz": "ulash turi", "ru": "тип связи" }, v: ["stylesheet"] }, { a: "href", dars: "m1-06", d: { "uz": "fayl manzili", "ru": "адрес файла" } }],
  "html": [{ a: "lang", dars: "m1-15", d: { "uz": "sahifa tili", "ru": "язык страницы" } }]
};
var CSS_MENU_ALL = [
  { p: "color", dars: "m1-06", d: { "uz": "matn rangi", "ru": "цвет текста" }, v: ["red", "blue", "green", "white", "black", "#…"] },
  { p: "background-color", dars: "m1-06", d: { "uz": "fon rangi", "ru": "цвет фона" }, v: ["#…", "white", "black"] },
  { p: "font-size", dars: "m1-06", d: { "uz": "shrift kattaligi", "ru": "размер шрифта" }, v: ["16px", "24px", "32px"] },
  { p: "text-align", dars: "m1-06", d: { "uz": "matn tekislash", "ru": "выравнивание текста" }, v: ["center", "left", "right"] },
  { p: "font-family", dars: "m1-06", d: { "uz": "shrift", "ru": "шрифт" }, v: ["Arial", "Georgia", "sans-serif"] },
  { p: "margin", dars: "m1-06", d: { "uz": "tashqi bo'shliq", "ru": "внешний отступ" }, v: ["0", "8px", "16px", "auto"] },
  { p: "padding", dars: "m1-06", d: { "uz": "ichki bo'shliq", "ru": "внутренний отступ" }, v: ["8px", "16px", "24px"] },
  { p: "display", dars: "m1-07", d: { "uz": "ko'rinish turi", "ru": "тип отображения" }, v: ["flex", "block", "none"] },
  { p: "gap", dars: "m1-07", d: { "uz": "elementlar orasi", "ru": "промежуток" }, v: ["8px", "16px", "24px"] },
  { p: "justify-content", dars: "m1-07", d: { "uz": "gorizontal joylash", "ru": "по горизонтали" }, v: ["center", "space-between", "flex-start", "flex-end"] },
  { p: "align-items", dars: "m1-07", d: { "uz": "vertikal joylash", "ru": "по вертикали" }, v: ["center", "flex-start", "flex-end"] },
  { p: "flex-direction", dars: "m1-07", d: { "uz": "yo'nalish", "ru": "направление" }, v: ["row", "column"] },
  { p: "height", dars: "m1-07", d: { "uz": "balandlik", "ru": "высота" }, v: ["100px", "200px", "100vh"] },
  { p: "width", dars: "m1-15", d: { "uz": "kenglik", "ru": "ширина" }, v: ["100px", "300px", "100%"] },
  { p: "background", dars: "m1-15", d: { "uz": "fon", "ru": "фон" }, v: ["#…", "white"] },
  { p: "border-radius", dars: "m1-15", d: { "uz": "burchak yumaloqligi", "ru": "скругление углов" }, v: ["8px", "12px", "50%"] },
  { p: "box-shadow", dars: "m1-15", d: { "uz": "soya", "ru": "тень" }, v: ["0 4px 12px rgba(0,0,0,.15)"] }
];
var JS_MENU_ALL = {
  kw: [{ k: "let", dars: "m2-02", d: { "uz": "o'zgaruvchi (o'zgaradi)", "ru": "переменная (меняется)" } }, { k: "const", dars: "m2-02", d: { "uz": "o'zgarmas", "ru": "константа" } }, { k: "if", dars: "m2-04", d: { "uz": "shart", "ru": "условие" } }, { k: "else", dars: "m2-04", d: { "uz": "aks holda", "ru": "иначе" } }, { k: "else if", dars: "m2-04", d: { "uz": "yana bir shart", "ru": "ещё одно условие" } }, { k: "true", dars: "m2-04", d: { "uz": "rost", "ru": "истина" } }, { k: "false", dars: "m2-04", d: { "uz": "yolg'on", "ru": "ложь" } }, { k: "for", dars: "m2-05", d: { "uz": "sikl (sanab)", "ru": "цикл (со счётчиком)" } }, { k: "while", dars: "m2-05", d: { "uz": "sikl (shart bo'lguncha)", "ru": "цикл (пока условие)" } }, { k: "function", dars: "m2-06", d: { "uz": "funksiya", "ru": "функция" } }, { k: "return", dars: "m2-06", d: { "uz": "javob qaytarish", "ru": "вернуть значение" } }, { k: "=>", dars: "m2-08", d: { "uz": "qisqa funksiya", "ru": "стрелочная функция" } }],
  api: [{ k: "console.log", dars: "m2-02", d: { "uz": "konsolga chiqarish", "ru": "вывести в консоль" }, q: "console.log()" }, { k: "prompt", dars: "m2-04", d: { "uz": "foydalanuvchidan so'rash", "ru": "спросить у пользователя" }, q: 'prompt("")' }, { k: ".length", dars: "m2-05", d: { "uz": "nechta element", "ru": "сколько элементов" } }, { k: "onclick", dars: "m2-08", d: { "uz": "bosilganda", "ru": "при нажатии" }, q: ".onclick = () => {\n  \n}" }, { k: "oninput", dars: "m2-08", d: { "uz": "yozilganda", "ru": "при вводе" }, q: ".oninput = () => {\n  \n}" }],
  snip: [{ q: "log", dars: "m2-02", body: "console.log();" }, { q: "if", dars: "m2-04", body: "if () {\n  \n}" }, { q: "else", dars: "m2-04", body: "else {\n  \n}" }, { q: "for", dars: "m2-05", body: "for (let i = 0; i < 5; i++) {\n  \n}" }, { q: "while", dars: "m2-05", body: "while () {\n  \n}" }, { q: "fn", dars: "m2-06", body: "function nom() {\n  \n}" }]
};
var tegRank = (k) => {
  if (!k) return Infinity;
  const i = TEG_TARTIB.indexOf(k);
  if (i !== -1) return i;
  const m = /^(m\d[abc]?)-/.exec(k);
  const w = m ? TEG_TARTIB.indexOf(m[1] + "-*") : -1;
  return w === -1 ? Infinity : w;
};
var tegOchiq = (stage, dars) => !stage || tegRank(dars) <= tegRank(stage);
var tagBody = (name, ind) => {
  const sn = SNIPPETS[name];
  if (sn) return { body: sn.body.split("\n").join("\n" + ind), caret: sn.body.slice(0, sn.caret).split("\n").join("\n" + ind).length };
  if (VOID_TAGS.has(name)) return { body: `<${name}>`, caret: name.length + 2 };
  return { body: `<${name}></${name}>`, caret: name.length + 2 };
};
var EMMET_BANG = '<!DOCTYPE html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8">\n  <title>Sahifa</title>\n</head>\n<body>\n  \n</body>\n</html>';
function emmetExpand(abbr, ind, { classOn }) {
  if (abbr === "!") {
    const t = EMMET_BANG.split("\n").join("\n" + ind);
    return { body: t, caret: t.indexOf("<body>\n") + 7 + ind.length + 2 };
  }
  const parts = abbr.split(">");
  const re = /^([a-zA-Z][a-zA-Z0-9]*)?((?:[.#][a-zA-Z0-9_-]+)*)(?:\*(\d{1,2}))?$/;
  const P = [];
  for (const x of parts) {
    const m = re.exec(x);
    if (!m || !m[1] && !m[2]) return null;
    if (m[2] && !classOn) return null;
    const tag = (m[1] || "div").toLowerCase();
    if (!TAG_MENU_ALL.some((q) => q.t === tag)) return null;
    if (parts.length === 1 && !m[2] && !m[3]) return null;
    const cls = (m[2].match(/\.[a-zA-Z0-9_-]+/g) || []).map((c2) => c2.slice(1));
    const id = (m[2].match(/#[a-zA-Z0-9_-]+/) || [""])[0].slice(1);
    P.push({ tag, cls, id, n: Math.min(20, Math.max(1, Number(m[3] || 1))) });
  }
  const open = (q) => "<" + q.tag + (q.id ? ' id="' + q.id + '"' : "") + (q.cls.length ? ' class="' + q.cls.join(" ") + '"' : "") + ">";
  const rend = (i, pad) => {
    const q = P[i];
    const out = [];
    for (let k = 0; k < q.n; k++) {
      if (VOID_TAGS.has(q.tag)) {
        out.push(pad + open(q));
        continue;
      }
      if (i === P.length - 1) out.push(pad + open(q) + "</" + q.tag + ">");
      else out.push(pad + open(q) + "\n" + rend(i + 1, pad + "  ") + "\n" + pad + "</" + q.tag + ">");
    }
    return out.join("\n");
  };
  const body = rend(0, ind).slice(ind.length);
  const c = body.indexOf("></");
  return { body, caret: c === -1 ? body.length : c + 1 };
}
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
  // F-1017-206: solishtirish NORMALLASHGAN — katta-kichik harf, ortiqcha probel va apostrof turi (' ‘ ’ ʻ) farq qilmaydi
  // («hello» = «Hello»). Ko'p so'zli qiymat TARTIBLI qoladi («1 2 3 4 5» — sanoq); tartibsiz ro'yxat uchun logsEach.
  logs: (value, hint) => ({ __runtime: "log_includes", value: String(value), hint }),
  // Bir nechta qiymat — HAR BIRI chiqishda bor, TARTIBI muhim emas (massiv/ro'yxat natijalari:
  // o'quvchi «uzum banan olma» deb yozsa ham to'g'ri). F-1017-206.
  logsEach: (values, hint) => ({ __runtime: "log_each", values: (Array.isArray(values) ? values : [values]).map(String), hint }),
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
  if (s.logsEach !== void 0) return checks.logsEach(s.logsEach, hint);
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
  "blockquote",
  ...TAG_MENU_ALL.filter((t) => t.matn).map((t) => t.t)
  // xaritadagi `matn` belgisi (F-1001-91)
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
      _idx=String.prototype.indexOf,_trim=String.prototype.trim,_low=String.prototype.toLowerCase,_rep=String.prototype.replace,
      _st=window.setTimeout,_qs=document.querySelector;
  var _l=console.log;console.log=function(){
    for(var i=0;i<arguments.length;i++){var a=arguments[i];
      try{_push.call(logs,typeof a==='object'?_json(a):_str(a));}catch(e){_push.call(logs,_str(a));}}
    try{_l.apply(console,arguments);}catch(e){}
  };
  function has(hay,needle){return _idx.call(_str(hay),needle)!==-1;}
  // F-1017-206: konsol-matnini normallashtirish — kichik harf, apostrof turlari → ', probel yig'iladi
  function norm(s){var x=_low.call(_str(s));x=_rep.call(x,/[‘’ʻʼ\`´]/g,"'");x=_rep.call(x,/\\s+/g,' ');return _trim.call(x);}
  function qs(sel){try{return _qs.call(document,sel);}catch(e){return null;}}
  function runProbes(){
    var P=${JSON.stringify(probes)};
    var joined='';for(var j=0;j<logs.length;j++)joined+=(j?' ':'')+logs[j];
    var out={};
    for(var k=0;k<P.length;k++){
      var p=P[k],ok=false;
      try{
        if(p.type==='log_includes'){
          var v=norm(p.value);
          ok=has(norm(joined),v);
          if(!ok){for(var q=0;q<logs.length;q++){if(has(norm(logs[q]),v)){ok=true;break;}}}
        }else if(p.type==='log_each'){
          var J=norm(joined),vals=p.values||[];
          ok=vals.length>0;
          for(var m=0;m<vals.length;m++){if(!has(J,norm(vals[m]))){ok=false;break;}}
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
var ANCHOR_NAV = `<script>
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href^="#"]'):null;
  if(!a)return;
  e.preventDefault();
  var id=a.getAttribute('href').slice(1),el=null;
  try{id=decodeURIComponent(id)}catch(_){}
  if(id)el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  else if(!id)window.scrollTo({top:0,behavior:'smooth'});
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
${opts.harness ? "" : ANCHOR_NAV}
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
  lang = "uz",
  // 'uz' | 'ru' — modul dars kontekstidan tashqarida ishlaydi
  stage
  // F-1001-91 (Q2): dars kaliti (`'m1-03'`) — ro'yxatda faqat shu darsgacha o'tilganlar; yo'q bo'lsa hammasi
}) {
  const tagMenu = useMemo(() => TAG_MENU_ALL.filter((t) => tegOchiq(stage, t.dars)), [stage]);
  const attrMenu = useMemo(() => {
    const o = {};
    for (const k of Object.keys(ATTR_MENU_ALL)) o[k] = ATTR_MENU_ALL[k].filter((a) => tegOchiq(stage, a.dars));
    return o;
  }, [stage]);
  const emmetOn = tegOchiq(stage, BOSQICH.emmet);
  const classOn = tegOchiq(stage, BOSQICH.class_id_qisqartma);
  const cssMenu = useMemo(() => tegOchiq(stage, BOSQICH.css_maslahat) ? CSS_MENU_ALL.filter((c) => tegOchiq(stage, c.dars)) : [], [stage]);
  const jsMenu = useMemo(() => {
    if (!tegOchiq(stage, BOSQICH.js_maslahat)) return [];
    const snip = Object.fromEntries(JS_MENU_ALL.snip.filter((q) => tegOchiq(stage, q.dars)).map((q) => [q.q, q.body]));
    const items = [];
    for (const k of JS_MENU_ALL.kw) if (tegOchiq(stage, k.dars)) items.push({ k: k.k, d: k.d, body: snip[k.k] || (/^(true|false|null|=>)$/.test(k.k) ? k.k : k.k + " ") });
    for (const a of JS_MENU_ALL.api) if (tegOchiq(stage, a.dars)) items.push({ k: a.k, d: a.d, body: a.q || a.k });
    for (const q of Object.keys(snip)) if (!items.some((i) => i.k === q)) items.push({ k: q, d: { uz: snip[q].split("\n")[0] + " …", ru: snip[q].split("\n")[0] + " …" }, body: snip[q] });
    return items;
  }, [stage]);
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
  const consoleOnly = showConsole && !task.previewUrl && !files.some((f) => f.lang === "html") && !/\bdocument\b|\balert\s*\(/.test(js);
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
    if (!el || document.activeElement !== el) return setMenu(null);
    const v = el.value, s = el.selectionStart;
    if (s !== el.selectionEnd) return setMenu(null);
    if (escAtRef.current.at === s && escAtRef.current.seq === editSeqRef.current) return setMenu(null);
    const open = (next) => setMenu((prev) => prev && prev.kind === next.kind && prev.from === next.from && prev.items.length === next.items.length ? { ...next, idx: Math.min(prev.idx, next.items.length - 1) } : next);
    const before = v.slice(0, s);
    if (activeLang === "css") {
      if (!cssMenu.length) return setMenu(null);
      const ob = before.lastIndexOf("{"), cb = before.lastIndexOf("}");
      if (ob === -1 || cb > ob) return setMenu(null);
      const seg = before.slice(Math.max(ob, before.lastIndexOf(";"), before.lastIndexOf("\n")) + 1);
      const mv = /^\s*([a-z-]+)\s*:\s*([a-zA-Z0-9#.%-]*)$/.exec(seg);
      if (mv) {
        const def = cssMenu.find((c) => c.p === mv[1]);
        if (!def) return setMenu(null);
        const pref = mv[2];
        const items = def.v.filter((x) => x.startsWith(pref)).map((x) => ({ a: x, d: "" }));
        if (!items.length) return setMenu(null);
        return open({ kind: "cssval", src: "lt", items, idx: 0, from: s - pref.length, ...caretXY() });
      }
      const mp = /^\s*([a-z-]+)$/.exec(seg);
      if (mp) {
        const pref = mp[1];
        const items = cssMenu.filter((c) => c.p.startsWith(pref)).sort((x, y) => (x.p === pref ? 0 : 1) - (y.p === pref ? 0 : 1));
        if (!items.length) return setMenu(null);
        return open({ kind: "cssprop", src: "lt", items, idx: 0, from: s - pref.length, ...caretXY() });
      }
      return setMenu(null);
    }
    if (activeLang === "js") {
      if (!jsMenu.length) return setMenu(null);
      const ls0 = before.lastIndexOf("\n") + 1, line = before.slice(ls0);
      if (line.includes("//")) return setMenu(null);
      if (before.lastIndexOf("/*") > before.lastIndexOf("*/")) return setMenu(null);
      let q = null;
      for (const ch of line) {
        if (q) {
          if (ch === q) q = null;
        } else if (ch === '"' || ch === "'" || ch === "`") q = ch;
      }
      if (q) return setMenu(null);
      const mi = /([A-Za-z_$.][\w$.]*)$/.exec(line);
      if (!mi || mi[1].replace(/^\./, "").length < 2) return setMenu(null);
      const match = (pf) => jsMenu.filter((x) => x.k.startsWith(pf)).sort((x, y) => (x.k === pf ? 0 : 1) - (y.k === pf ? 0 : 1));
      let pref = mi[1], items = match(pref);
      if (!items.length && pref.includes(".")) {
        pref = pref.slice(pref.lastIndexOf("."));
        items = match(pref);
      }
      if (!items.length) return setMenu(null);
      return open({ kind: "js", src: "bare", items, idx: 0, from: s - pref.length, ...caretXY() });
    }
    if (activeLang !== "html") return setMenu(null);
    const byPref = (list, key, pref) => list.filter((x) => x[key].startsWith(pref)).sort((x, y) => (x[key] === pref ? 0 : 1) - (y[key] === pref ? 0 : 1));
    const mTag = /<([a-zA-Z][a-zA-Z0-9-]*)?$/.exec(before);
    if (mTag && before[mTag.index + 1] !== "/") {
      const pref = (mTag[1] || "").toLowerCase();
      const items = byPref(tagMenu, "t", pref);
      if (!items.length) return setMenu(null);
      return open({ kind: "tag", src: "lt", items, idx: 0, from: mTag.index, ...caretXY() });
    }
    const mVal = /<([a-zA-Z][a-zA-Z0-9-]*)(?:"[^"]*"|'[^']*'|[^<>"'])*\s([a-zA-Z-]+)="([a-zA-Z0-9-]*)$/.exec(before);
    if (mVal) {
      const tag = mVal[1].toLowerCase(), attr = mVal[2].toLowerCase(), pref = mVal[3].toLowerCase();
      const def = [...attrMenu[tag] || [], ...attrMenu["*"] || []].find((x) => x.a === attr);
      const items = def && def.v ? byPref(def.v.map((v2) => ({ a: v2, d: "" })), "a", pref) : [];
      if (!items.length) return setMenu(null);
      return open({ kind: "val", src: "lt", items, idx: 0, from: s - pref.length, ...caretXY() });
    }
    const mAttr = /<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^<>"'])*)\s([a-zA-Z-]*)$/.exec(before);
    if (mAttr) {
      const tag = mAttr[1].toLowerCase(), pref = (mAttr[3] || "").toLowerCase(), had = mAttr[2];
      const pool = [...attrMenu[tag] || [], ...attrMenu["*"] || []];
      const items = byPref(pool, "a", pref).filter((x) => !new RegExp("(^|\\s)" + x.a + "\\s*=").test(had));
      if (!items.length) return setMenu(null);
      return open({ kind: "attr", src: "lt", items, idx: 0, from: s - pref.length, ...caretXY() });
    }
    const ls = before.lastIndexOf("\n") + 1;
    const mBare = /(?:^[ \t]*|<[a-zA-Z][^<>]*>)([a-zA-Z][a-zA-Z0-9-]*)$/.exec(before.slice(ls));
    const rest = v.slice(s).split("\n")[0];
    if (mBare && (!rest.trim() || /^\s*<\/[a-zA-Z][a-zA-Z0-9-]*>\s*$/.test(rest)) && !inTextTag(before.slice(0, s - mBare[1].length))) {
      const pref = mBare[1].toLowerCase();
      const items = byPref(tagMenu, "t", pref);
      if (!items.length) return setMenu(null);
      return open({ kind: "tag", src: "bare", items, idx: 0, from: s - mBare[1].length, ...caretXY() });
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
    if (menu.kind === "val" || menu.kind === "cssval") {
      put(el, item.a, menu.from + item.a.length);
      setMenu(null);
      return;
    }
    if (menu.kind === "cssprop") {
      put(el, item.p + ": ", menu.from + item.p.length + 2);
      setMenu(null);
      return;
    }
    if (menu.kind === "js") {
      const v0 = el.value, ls0 = v0.lastIndexOf("\n", menu.from - 1) + 1;
      const ind0 = (/^[ \t]*/.exec(v0.slice(ls0, menu.from)) || [""])[0];
      const body2 = item.body.split("\n").join("\n" + ind0);
      const ci = body2.indexOf("()") !== -1 ? body2.indexOf("()") + 1 : body2.indexOf("\n" + ind0 + "  \n") !== -1 ? body2.indexOf("\n" + ind0 + "  \n") + ind0.length + 3 : body2.length;
      put(el, body2, menu.from + ci);
      setMenu(null);
      return;
    }
    const name = item.t, v = el.value;
    const ls = v.lastIndexOf("\n", menu.from - 1) + 1;
    const ind = (/^[ \t]*/.exec(v.slice(ls, menu.from)) || [""])[0];
    const { body, caret } = tagBody(name, ind);
    put(el, body, menu.from + caret);
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
  const handleTab = (el, shift) => {
    const v = el.value, s = el.selectionStart, en = el.selectionEnd;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const line = v.slice(lineStart, s);
    if (s === en && activeLang === "html" && !shift) {
      const ind = (/^[ \t]*/.exec(line) || [""])[0];
      const mWord = /(?:^[ \t]*|<[a-zA-Z][^<>]*>)([a-zA-Z][a-zA-Z0-9-]*)$/.exec(line);
      const word = mWord ? mWord[1].toLowerCase() : null;
      let ex = null, from = s;
      if (word && TAG_MENU_ALL.some((t) => t.t === word) && !inTextTag(v.slice(0, s - word.length))) {
        ex = tagBody(word, ind);
        from = s - word.length;
      } else if (emmetOn) {
        const mAb = /([!a-zA-Z.#][a-zA-Z0-9.#>*_-]*)$/.exec(line);
        let abbr = mAb ? mAb[1] : null;
        if (abbr && line[mAb.index - 1] === "<") {
          const g = abbr.indexOf(">");
          abbr = g === -1 ? null : abbr.slice(g + 1) || null;
        }
        if (abbr && (abbr !== "!" || line.trim() === "!") && !inTextTag(v.slice(0, s - abbr.length))) {
          ex = emmetExpand(abbr, ind, { classOn });
          if (ex) from = s - abbr.length;
        }
      }
      if (ex) {
        el.setSelectionRange(from, s);
        document.execCommand("insertText", false, ex.body);
        const caret = from + ex.caret;
        el.setSelectionRange(caret, caret);
        caretRef.current = caret;
        setMenu(null);
        return;
      }
    }
    if (shift) {
      const back = /^ {1,2}/.exec(v.slice(lineStart, lineStart + 2));
      if (!back) return;
      const caret = Math.max(lineStart, s - back[0].length);
      el.setSelectionRange(lineStart, lineStart + back[0].length);
      document.execCommand("delete");
      el.setSelectionRange(caret, caret);
    } else {
      put(el, "  ", s + 2);
    }
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
      if (e.key === "Tab" || e.key === "Enter" && menu.src !== "bare" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        acceptMenu(menu.items[menu.idx]);
        return;
      }
      if (e.key === "Enter" && menu.src === "bare") setMenu(null);
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
      handleTab(el, e.shiftKey);
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
    statusMsg = <span className="hc-wait-msg">{narrow ? consoleOnly ? tr({ uz: "Shartlarni bajaring — «Console» tabida ko'rinadi", ru: "Выполняйте условия — смотрите во вкладке «Console»" }) : tr({ uz: "Shartlarni bajaring — «Natija» tabida ko'rinadi", ru: "Выполняйте условия — смотрите во вкладке «Результат»" }) : tr({ uz: "Shartlarni bajaring — natija o'ngda ko'rinadi", ru: "Выполняйте условия — результат виден справа" })}</span>;
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
            {consoleOnly ? "🖥️ Console" : <>📺 {tr({ uz: "Natija", ru: "Результат" })}</>}
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
    key={it.t || it.a || it.p || it.k}
    role="option"
    aria-selected={i === menu.idx}
    className={`hc-menu-row ${i === menu.idx ? "on" : ""}`}
    onClick={() => acceptMenu(it)}
  >
                        <span className="hc-menu-k">{menu.kind === "tag" ? `<${it.t}>` : menu.kind === "val" ? `"${it.a}"` : menu.kind === "cssprop" ? `${it.p}:` : it.a ?? it.k}</span>
                        <span className="hc-menu-d">{tr(it.d)}</span>
                      </button>)}
                  </div>
                  <span className="hc-menu-tip">{touch ? tr({ uz: "Bosib tanlang", ru: "Нажмите, чтобы выбрать" }) : menu.src === "bare" ? tr({ uz: "Tab — tanlash · Esc — yopish", ru: "Tab — выбрать · Esc — закрыть" }) : tr({ uz: "Enter — tanlash · Esc — yopish", ru: "Enter — выбрать · Esc — закрыть" })}</span>
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
      if (!el) return;
      if (menu) acceptMenu(menu.items[menu.idx]);
      else handleTab(el, false);
    }}
    title={tr({ uz: "Tab — tegni yoyish / ichkariga surish", ru: "Tab — раскрыть тег / отступ" })}
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

        <section className={`hc-pane hc-preview-pane${consoleOnly ? " console-only" : ""}`}>
          <div className="hc-pane-bar">
            {
    /* `task.previewUrl` berilsa — natija paneli SOXTA BRAUZER oynasiga aylanadi
       (manzil qatori bilan). PM darslarining o'zagi shu: bola o'zi yozgan
       sahifani «haqiqiy sayt» sifatida ko'radi (F-0809-05, PM shc-* dan). */
  }
            {task.previewUrl ? <>
                <span className="hc-dots"><i /><i /><i /></span>
                <span className="hc-url"><span className="hc-lock">●</span>{tr(task.previewUrl)}</span>
              </> : consoleOnly ? <span className="hc-pane-name">🖥️ Console</span> : <span className="hc-pane-name">📺 {tr({ uz: "Natija", ru: "Результат" })}</span>}
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
                {!consoleOnly && <span className="hc-console-title">🖥️ Console</span>}
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
        display:flex;flex-direction:column;justify-content:safe center;gap:clamp(12px,1.8vw,18px);padding:clamp(16px,2.4vw,30px);overflow:hidden;-webkit-font-smoothing:antialiased;width:100%;max-width:1740px;margin:0 auto}

      .hc-top{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
      .hc-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:800;color:${HC_T.accent};display:inline-flex;align-items:center;gap:7px}
      .hc-eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.accent}}
      .hc-title{font-family:Georgia,serif;font-size:clamp(22px,3vw,32px);margin:0;color:${HC_T.ink};font-weight:600;letter-spacing:-.015em;line-height:1.12}
      .hc-brief{margin:0;color:${HC_T.ink2};font-size:clamp(13px,1.5vw,15px);line-height:1.55;max-width:60ch}

      .hc-checklist{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:6px}
.hc-title,.hc-brief,.hc-chip,.hc-hint{user-select:none;-webkit-user-select:none} /* F-1017-224 (mentor): vazifa matni/shart/maslahatdagi kod belgilanmaydi — o'quvchi nusxalamasdan o'zi teradi */
      .hc-count{font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-weight:700;font-size:12px;color:#fff;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});padding:6px 11px;border-radius:99px;box-shadow:0 6px 16px -6px rgba(255,77,38,.5)}
      .hc-chip{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:${HC_T.ink2};background:${HC_T.paper};padding:6px 14px 6px 7px;border-radius:99px;border:1px solid ${HC_T.line};box-shadow:0 1px 2px rgba(${HC_T.shadowBase},.04);transition:all .22s ease;cursor:default}
      .hc-chip.ok{color:${HC_T.ink};font-weight:600;border-color:${HC_T.success}40;background:${HC_T.successSoft}}
      .hc-dot{flex-shrink:0;width:21px;height:21px;border-radius:50%;background:${HC_T.bg};color:${HC_T.ink3};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;transition:all .25s}
      .hc-chip.ok .hc-dot{background:${HC_T.success};color:#fff;box-shadow:0 3px 8px -2px ${HC_T.success}88}
      /* F-0808-02: qat'iy balandlik — xabar paydo bo'lganda/yo'qolganda muharrir SAKRAMAYDI */
      .hc-msg{height:40px;width:100%;display:flex;align-items:center;justify-content:center;margin-top:3px;overflow:hidden}
      .hc-hint.hc-hint{margin:0;font-size:13px;color:${HC_T.warn};background:#FFF6EA;border:1px solid #F4DFBC;padding:8px 15px;border-radius:11px;max-width:76ch;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      /* K-M-02: tugma flex — matn (span) kesiladi, «+N» belgisi qisilmaydi va doim ko'rinadi */
      .hc-err{font-size:12.5px;color:#C01024;background:#FDECEC;border:1px solid #F6CFCF;padding:7px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;max-width:min(100%,96ch);line-height:1.4;display:inline-flex;align-items:center;gap:8px;min-width:0;cursor:pointer;text-align:left}
      .hc-err-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
      .hc-err:hover{background:#FBDFDF;border-color:#EEB8B8}
      .hc-err-more{flex-shrink:0;background:#C01024;color:#fff;border-radius:99px;padding:1px 7px;font-size:11px}

      /* F-0813-01: 3 ustun — editor | sudraluvchi chegara | natija. Ulush --hcL/--hcR
         o'zgaruvchilarida (30–70%), sudralganda JS yangilaydi, tanlov eslab qolinadi. */
      /* F-1004-18: past ekranda (1280×773) sarlavha + ro'yxat + 62dvh sig'masdi — markazlash tepani kesardi.
         Endi panel qisqaradi (balandlik doimiy, xabar paydo bo'lganda sakramaydi), tepa «safe center» bilan kesilmaydi. */
      .hc-split{flex:0 1 auto;height:calc(62dvh / var(--lz,1));min-height:240px;display:grid;grid-template-columns:minmax(0,var(--hcL,1fr)) 12px minmax(0,var(--hcR,1fr));gap:clamp(3px,.4vw,5px)}
      .hc-pane{display:flex;flex-direction:column;min-height:0;border-radius:18px;overflow:hidden;background:${HC_T.paper};box-shadow:0 1px 0 ${HC_T.line},0 18px 40px -22px rgba(${HC_T.shadowBase},.35)}
      .hc-pane-bar{display:flex;align-items:center;gap:10px;padding:10px 15px;font-size:12px;font-weight:600;color:${HC_T.ink2}}
      .hc-editor-pane .hc-pane-bar{background:${HC_CODE.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane .hc-pane-bar{background:${HC_T.paper};border-bottom:1px solid ${HC_T.line}}
      .hc-dots{display:inline-flex;gap:6px;flex-shrink:0}
      .hc-dots i{width:11px;height:11px;border-radius:50%;background:#3A4760;display:block}
      .hc-dots i:nth-child(1){background:#ff5f56}.hc-dots i:nth-child(2){background:#ffbd2e}.hc-dots i:nth-child(3){background:#27c93f}
      .hc-pane-name{font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-weight:700}
      /* Soxta brauzer manzil-qatori — task.previewUrl berilganda (F-0809-05) */
      .hc-url{font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:11px;color:${HC_T.ink2};display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
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
      .hc-tab{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:12px;font-weight:600;padding:6px 13px;border-radius:9px;cursor:pointer;transition:all .15s;white-space:nowrap}
      .hc-tab:hover{color:#cfe0ff;background:rgba(255,255,255,.06)}
      .hc-tab.active{color:#fff;background:rgba(255,255,255,.14);box-shadow:inset 0 -2px 0 ${HC_T.accent}}
      .hc-mini{margin-left:auto;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:9px;padding:6px 13px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;transition:all .18s;flex-shrink:0;box-shadow:0 6px 14px -6px rgba(255,77,38,.6)}
      .hc-mini:hover{transform:translateY(-1px);box-shadow:0 9px 18px -6px rgba(255,77,38,.7)}
      .hc-mini:active{transform:translateY(0)}

      .hc-editor-wrap{flex:1;min-height:0;display:flex;background:${HC_CODE.bg};overflow:hidden}
      .hc-gutter{flex:0 0 auto;padding:18px 10px 18px 16px;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:var(--hcfs,14px);line-height:1.7;color:#41527A;text-align:right;white-space:pre;user-select:none;overflow:hidden;pointer-events:none}
      /* overflow:hidden — joriy-qator chizig'i surilganda quti tashqarisiga chiqmasin */
      .hc-code-box{position:relative;flex:1;min-width:0;min-height:0;overflow:hidden}

      /* 🔴 RANG QATLAMI: quyidagi UCHTA xossa .hc-hl va .hc-code da AYNAN bir xil
         bo'lishi shart (shrift, o'lcham, qator balandligi, chekinish, white-space) —
         bitta piksel farq qilsa, harflar kursordan siljib ketadi. */
      .hc-hl,.hc-code{position:absolute;inset:0;margin:0;border:none;
        font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:var(--hcfs,14px);line-height:1.7;letter-spacing:0;
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
      /* F-1004-18: console-only — bo'sh oq Natija oynasi o'rniga console butun panelda */
      .hc-preview-pane.console-only{background:${HC_CODE.bg}}
      .hc-preview-pane.console-only .hc-pane-bar{background:${HC_CODE.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane.console-only .hc-frame{flex:none;height:0;visibility:hidden}
      .hc-preview-pane.console-only .hc-console{flex:1;height:auto;border-top:none}
      .hc-console-bar:empty{display:none}
      .hc-console-bar{display:flex;align-items:center;gap:8px;padding:7px 14px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7E92B4;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-console-title{font-family:'JetBrains Mono',monospace;font-feature-settings:"liga" 0,"calt" 0}
      .hc-console-clear{margin-left:auto;background:rgba(255,255,255,.08);color:#cfe0ff;border:none;border-radius:7px;padding:4px 10px;font-size:10.5px;font-weight:600;cursor:pointer;text-transform:none;letter-spacing:0;font-family:'Manrope',sans-serif;transition:all .15s}
      .hc-console-clear:hover{background:${HC_T.accent};color:#fff}
      .hc-console-body{flex:1;min-height:0;overflow:auto;padding:6px 0;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:13px;line-height:1.6}
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
      .hc-sb-btn{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:11px;font-weight:700;cursor:pointer;border-radius:6px;padding:2px 7px;transition:all .15s}
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

// src/live/previewMode.js
var PREVIEW = "preview";
var on = false;
var runId = null;
var OWN_KEY_PREFIXES = [
  "liveSession:",
  "liveNickname",
  "ccProgress:",
  "ccPractice:",
  "ccCode:",
  "ccDetails:",
  "ccSeal:",
  "ccHomework:",
  "ccHwSeal:",
  "ccHwQa-",
  "ccDemoDay",
  "ccPitch",
  "ccBridgeCard",
  "cc-site-url",
  "cc-deploy-project",
  "pm-",
  "bridge-",
  "ld-tahrir",
  "inetOnboarded_",
  "hcOnboarded_",
  "hcFont",
  "hcSplit"
];
var PASS_KEYS = ["cc_lang", "bridgeLang", "hwDemoLang"];
var isOwnKey = (k) => typeof k === "string" && (PASS_KEYS.includes(k) || OWN_KEY_PREFIXES.some((p) => k.startsWith(p)));
var isPreview = () => on;
function notePreviewProps(props) {
  if (props && props.visitMode === PREVIEW) {
    if (typeof props.previewRunId === "string" && /^[A-Za-z0-9_-]{16,128}$/.test(props.previewRunId)) runId = props.previewRunId;
    enable();
  }
  return isPreview();
}
function enable() {
  if (on) return;
  on = true;
  installOverlay();
}
function installOverlay() {
  if (typeof Storage === "undefined" || typeof window === "undefined") return;
  const P = Storage.prototype;
  if (P.__ccPreview) return;
  const local = /* @__PURE__ */ new Map(), session = /* @__PURE__ */ new Map();
  const memOf = (s) => {
    try {
      if (s === window.localStorage) return local;
    } catch {
    }
    try {
      if (s === window.sessionStorage) return session;
    } catch {
    }
    return null;
  };
  const get = P.getItem, set = P.setItem, rem = P.removeItem;
  P.getItem = function(k) {
    const m = memOf(this), key = String(k);
    if (!m || !isOwnKey(key)) return get.call(this, k);
    if (m.has(key)) return m.get(key);
    return PASS_KEYS.includes(key) ? get.call(this, k) : null;
  };
  P.setItem = function(k, v) {
    const m = memOf(this), key = String(k);
    if (m && isOwnKey(key)) {
      m.set(key, String(v));
      return;
    }
    return set.call(this, k, v);
  };
  P.removeItem = function(k) {
    const m = memOf(this), key = String(k);
    if (m && isOwnKey(key)) {
      m.set(key, null);
      return;
    }
    return rem.call(this, k);
  };
  Object.defineProperty(P, "__ccPreview", { value: true });
}

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
  clearedProgress.delete(lessonId);
  attemptsByLesson.delete(lessonId);
  earnedAtByLesson.delete(lessonId);
  arenaByLesson.delete(lessonId);
  loaded.delete(lessonId);
  sealedByLesson.delete(lessonId);
  try {
    store()?.removeItem(KEY(lessonId));
  } catch {
  }
  try {
    store()?.removeItem(SEAL_KEY(lessonId));
  } catch {
  }
}
var sealedByLesson = /* @__PURE__ */ new Map();
var SEAL_KEY = (lessonId) => `ccSeal:${lessonId}`;
var attemptMark = (lessonId) => {
  try {
    const ls = JSON.parse(store()?.getItem(`liveSession:${lessonId}`) || "null");
    return String(ls && (ls.attemptId || ls.pin) || "");
  } catch {
    return "";
  }
};
var sealKey = (lessonId, p) => `${(p && p.livePin) ?? ""}|${(p && p.liveMode) ?? ""}|${attemptMark(lessonId)}`;
var CAP_BYTES = 48e3;
var byteLen = (s) => {
  try {
    return new TextEncoder().encode(s).length;
  } catch {
    return s.length;
  }
};
function capPayload(payload, cap = CAP_BYTES) {
  if (!payload || typeof payload !== "object") return payload;
  if (byteLen(JSON.stringify(payload)) <= cap) return payload;
  const p = JSON.parse(JSON.stringify(payload));
  const dropped = [];
  const step = (name, fn) => {
    if (byteLen(JSON.stringify(p)) <= cap) return;
    fn();
    dropped.push(name);
  };
  step("answers", () => {
    delete p.answers;
  });
  step("attempts", () => {
    for (const q of p.questions || []) if (Array.isArray(q.attempts) && q.attempts.length > 3) q.attempts = q.attempts.slice(0, 3);
  });
  step("text", () => {
    const c = (s) => typeof s === "string" && s.length > 120 ? s.slice(0, 120) : s;
    for (const q of p.questions || []) {
      q.question = c(q.question);
      if (q.options) q.options = q.options.map(c);
      q.correct_answer = c(q.correct_answer);
      for (const a of q.attempts || []) a.answer = c(a.answer);
    }
  });
  step("questions", () => {
    while ((p.questions || []).length > 1 && byteLen(JSON.stringify(p)) > cap) p.questions.pop();
  });
  p.truncated = true;
  p.truncatedFields = dropped;
  return p;
}
function sealPayload(lessonId, payload) {
  if (!lessonId || !payload || typeof payload !== "object") return payload;
  try {
    const key = sealKey(lessonId, payload);
    let held = sealedByLesson.get(lessonId);
    if (!held) {
      try {
        held = JSON.parse(store()?.getItem(SEAL_KEY(lessonId)) || "null");
      } catch {
        held = null;
      }
      if (held && held.key && held.json) sealedByLesson.set(lessonId, held);
      else held = null;
    }
    if (held && held.key === key) return JSON.parse(held.json);
    const rec = { key, json: JSON.stringify(capPayload(payload)) };
    sealedByLesson.set(lessonId, rec);
    try {
      store()?.setItem(SEAL_KEY(lessonId), JSON.stringify(rec));
    } catch {
    }
    return JSON.parse(rec.json);
  } catch {
    return payload;
  }
}
function unsealPayload(lessonId) {
  sealedByLesson.delete(lessonId);
}
function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now, arenaBank, firstPass, lastAnswers, startedAt: startedIn, totalScreens: totalIn } = {}) {
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
    if (correctIdx === null) return;
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
  const prog = clearedProgress.get(lessonId) || null;
  const fp = firstPass !== void 0 ? firstPass : prog ? prog.firstPass ?? null : void 0;
  const started = Number.isFinite(startedIn) ? startedIn : prog && Number.isFinite(prog.startedAt) ? prog.startedAt : null;
  const totalScreens = Number.isInteger(totalIn) ? totalIn : (screenMeta || []).length || (prog && Number.isInteger(prog.total) ? prog.total : 0);
  const missed = questions.filter((q) => q.kind === "test" && q.correct !== true).map((q) => q.question_id);
  let retake = null;
  if (fp !== void 0) {
    if (fp && typeof fp === "object") {
      const la = lastAnswers || prog && prog.answers || null;
      retake = { pressed: true, lastPass: passStats(screenMeta, la, started, finish) };
    } else retake = { pressed: false };
  }
  const out = { detailsVersion: 2, lang, questions, achievements: list.slice(0, LIM.achievements), missed, totalScreens, finishedAt: iso(finish), truncated: false, retake };
  if (started) out.startedAt = iso(started);
  return out;
}
function passStats(screenMeta, answers, startedAt, finish) {
  const scored = [];
  (screenMeta || []).forEach((m, i) => {
    if (m && m.scored) scored.push(i);
  });
  const total = scored.length;
  const correct = answers && typeof answers === "object" ? scored.filter((i) => answers[i] && answers[i].correct === true).length : null;
  const o = { totalQuestions: total, correctAnswers: correct, scorePercent: correct === null || !total ? null : Math.round(correct / total * 100) };
  if (Number.isFinite(startedAt)) o.durationSec = Math.max(0, Math.floor((finish - startedAt) / 1e3));
  return o;
}
var clearedProgress = /* @__PURE__ */ new Map();
function noteProgressCleared(lessonId, prog) {
  if (!lessonId) return;
  if (prog && typeof prog === "object") clearedProgress.set(lessonId, prog);
}

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
function net(url, init) {
  if (isPreview()) {
    const e = new Error("preview: dars-api yopiq");
    e.code = "preview_offline";
    return Promise.reject(e);
  }
  return fetch(url, init);
}
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
  const r = await net(`${API}/rpc/${fn}`, {
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
  const r = await net(`${API}/session/${encodeURIComponent(pin)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`get: ${r.status}`);
  return r.json();
}
async function liveList(url) {
  const r = await net(url);
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
var livePlayers = (pin) => liveList(`${API}/players/${encodeURIComponent(pin)}`);
var liveAnswers = (pin, screenIdx) => liveList(`${API}/answers/${encodeURIComponent(pin)}${screenIdx == null ? "" : `?screen=${encodeURIComponent(screenIdx)}`}`);
var liveQuizAnswers = (pin) => liveList(`${API}/answers/${encodeURIComponent(pin)}?range=arena`);
async function lmsFetch(method, url, liveToken, body) {
  const r = await net(url, {
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
  const r = await net(`${LIVE_API_URL}/api/v1/me/progress`, {
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
    noteProgressCleared(id, JSON.parse(localStorage.getItem(_progKey(id)) || "null"));
  } catch {
  }
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

// src/live/progressSync.js
var DEBOUNCE_MS = 2e3;
var channels = /* @__PURE__ */ new Map();
function setProgressChannel(lessonId, ch) {
  const prev = channels.get(lessonId);
  if (prev) {
    clearTimeout(prev.timer);
    flush(lessonId, { keepalive: true });
  }
  if (!ch || isPreview()) {
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
  const previewRef = useRef2(null);
  if (previewRef.current === null) previewRef.current = notePreviewProps(opts);
  const preview = previewRef.current;
  const liveToken = preview ? null : opts.liveToken || null;
  const lessonVersion = opts.lessonVersion || null;
  const keyRef = useRef2(answerKey);
  keyRef.current = answerKey;
  useEffect2(() => {
    unsealPayload(lessonId);
  }, [lessonId]);
  const initRef = useRef2(void 0);
  if (initRef.current === void 0) initRef.current = LIVE_ENABLED && !preview ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState2(() => {
    if (!LIVE_ENABLED || preview) return "self";
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
    let on2 = true, timer = null, delay = LIVE_POLL_MS;
    const schedule = () => {
      if (on2) timer = setTimeout(tick, delay);
    };
    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) {
        schedule();
        return;
      }
      try {
        const row = await liveGet(pin);
        if (!on2) return;
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
        if (!on2) return;
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
      on2 = false;
      clearTimeout(timer);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, pin, lessonId]);
  useEffect2(() => {
    if (mode !== "mentor" || !pin) return;
    let on2 = true;
    liveGet(pin).then((row) => {
      if (!on2) return;
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
      on2 = false;
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
    let on2 = true, inFlight = false;
    const recheck = async () => {
      if (!on2 || inFlight || typeof document !== "undefined" && document.hidden) return;
      inFlight = true;
      try {
        const body = { lesson_id: lessonId };
        if (lessonVersion) body.lesson_version = lessonVersion;
        const res = await lmsJoin(tok2, body);
        if (!on2 || !res || res.mode !== "student") return;
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
      on2 = false;
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
    liveJoinedNote,
    preview
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

// src/live/useAutoNext.js
import { useEffect as useEffect4, useRef as useRef4, useState as useState3 } from "react";
var AUTO_NEXT_MS = 6e3;
function useAutoNext({ on: on2, onFire, qKey }) {
  const [sec, setSec] = useState3(null);
  const [auto, setAuto] = useState3(true);
  const firedRef = useRef4(false);
  const fireRef = useRef4(onFire);
  fireRef.current = onFire;
  useEffect4(() => {
    firedRef.current = false;
  }, [qKey]);
  useEffect4(() => {
    if (!on2 || !auto) {
      setSec(null);
      return void 0;
    }
    const deadline = Date.now() + AUTO_NEXT_MS;
    setSec(Math.ceil(AUTO_NEXT_MS / 1e3));
    const iv = setInterval(() => {
      const rem = deadline - Date.now();
      if (rem > 0) {
        setSec(Math.ceil(rem / 1e3));
        return;
      }
      clearInterval(iv);
      setSec(null);
      if (!firedRef.current) {
        firedRef.current = true;
        fireRef.current();
      }
    }, 200);
    return () => clearInterval(iv);
  }, [on2, auto, qKey]);
  const fireNow = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setSec(null);
    fireRef.current();
  };
  const shown = on2 && auto ? sec ?? Math.ceil(AUTO_NEXT_MS / 1e3) : null;
  return {
    sec: shown,
    auto,
    fireNow,
    pause: () => setAuto(false),
    resume: () => setAuto(true)
  };
}

// src/live/LiveUI.jsx
import React2, { useState as useState4, useEffect as useEffect5 } from "react";
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
  const [code, setCode] = useState4("");
  const [nick, setNick] = useState4(() => nickRead());
  const [mentorCode, setMentorCode] = useState4("");
  const [role, setRole] = useState4("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  const lms = live.lms || { state: "idle" };
  const [pinFallback, setPinFallback] = useState4(false);
  if (live.preview) return null;
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
  const [bigOpen, setBigOpen] = useState4(false);
  const [nPlayers, setNPlayers] = useState4(null);
  useEffect5(() => {
    if (live.mode !== "mentor" || !live.pin || live.ended) return;
    let on2 = true, t = null;
    const tick = async () => {
      try {
        const rows = await livePlayers(live.pin);
        if (on2) setNPlayers(rows.length);
      } catch {
      }
      if (on2) t = setTimeout(tick, 6e3);
    };
    tick();
    return () => {
      on2 = false;
      clearTimeout(t);
    };
  }, [live.mode, live.pin, live.ended]);
  if (live.preview) return <div data-tour="live" data-live="badge-preview" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr2({ uz: "Oldindan ko'rish", ru: "Предпросмотр" })}</div>;
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
var _toastEl = null;
var _toastT = null;
function liveToast(node, ms = 6e3) {
  if (typeof document === "undefined") return;
  const text = tr2(node);
  if (!_toastEl) {
    _toastEl = document.createElement("div");
    _toastEl.setAttribute("role", "status");
    _toastEl.setAttribute("data-live", "toast");
    Object.assign(_toastEl.style, { position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: "12000", background: LT.ink, color: "#fff", borderRadius: "14px", padding: "12px 18px", fontFamily: "'Manrope', system-ui, sans-serif", fontSize: "15px", fontWeight: "600", lineHeight: "1.4", textAlign: "center", maxWidth: "min(92vw, 560px)", boxShadow: "0 10px 30px -8px rgba(0,0,0,0.45)", opacity: "0", transition: "opacity .25s", pointerEvents: "none" });
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = typeof text === "string" ? text : String(text);
  _toastEl.style.opacity = "1";
  clearTimeout(_toastT);
  _toastT = setTimeout(() => {
    if (_toastEl) _toastEl.style.opacity = "0";
  }, ms);
}
function FinishBtn({ onClick, children, disabled, ...rest }) {
  const [done, setDone] = useState4(false);
  const click = (e) => {
    if (done) return;
    try {
      if (typeof onClick === "function") onClick(e);
    } catch (err) {
      console.error("[finish]", err);
      return;
    }
    setDone(true);
    liveToast(isPreview() ? { uz: "Ko'rish rejimi — natija yozilmaydi.", ru: "Режим просмотра — результат не записывается." } : { uz: "Dars yakunlandi ✓ Endi bu oynani yopsangiz bo'ladi.", ru: "Урок завершён ✓ Теперь это окно можно закрыть." });
  };
  return <button {...rest} data-live={done ? "finish-done" : "finish"} disabled={disabled || done} onClick={click}>{done ? tr2({ uz: "Yakunlandi ✓", ru: "Завершено ✓" }) : children}</button>;
}

// src/2-Modull/PracticeLesson1.jsx
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
  line: "#E9E6DF",
  shadowBase: "58, 53, 48"
};
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8" };
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
var AchMissCtx = createContext2(null);
var PRACTICE_DONE_BASE = 500;
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split(/(`[^`]+`)/g).map((p, i) => p.startsWith("`") && p.endsWith("`") ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p) : s;
var __lang2 = "uz";
var tr3 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React3.isValidElement(node)) return node;
  return node[__lang2] ?? node.uz ?? node.ru ?? "";
};
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState5(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect6(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}
var STR = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var FN = ({ children }) => <span style={{ color: CODE.punct }}>{children}</span>;
var CM = ({ children }) => <span style={{ color: CODE.comment }}>{children}</span>;
var LESSON_META = {
  lessonId: "practice-01-jonlantirish-v18",
  lessonTitle: { uz: "Praktika 1 — Saytni jonlantiramiz", ru: "Практика 1 — Оживляем сайт" }
  /* 27.09: LMS katalog nomi asl holida — jon-kiritish qoidasi JS moduliga tegishli emas */
};
var HW_TOKENS = [
  { t: { uz: "amaliyot", ru: "практика" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "loyiha", ru: "проект" }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: "mashq", ru: "упражнение" }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: "natija", ru: "результат" }, l: 78, tp: 68, s: 13, d: 6.8 }
];
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "a1", type: "practice", template: "custom", scored: false, scope: null },
  { id: "a2", type: "practice", template: "custom", scored: false, scope: null },
  { id: "a3", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "custom", scored: true, scope: "final" },
  // F-1016-01 «Oxirgi sinov» — yagona ballik
  { id: "a4", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
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
  const [mCollapsed, setMCollapsed] = useState5(false);
  const contentRef = useRef5(null);
  useEffect6(() => {
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
var NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr3({ uz: "Orqaga", ru: "Назад" })}</button>;
var NavNext = ({ disabled, label = { uz: "Davom etish", ru: "Продолжить" }, onClick, optionalLive, mentorLock }) => {
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive || live && live.mode === "mentor" && !mentorLock || gate && gate.passed);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr3({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr3({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : freeRide && disabled ? tr3({ uz: "Davom etish", ru: "Продолжить" }) : tr3(label)}</button>;
};
function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState5(C);
  useEffect6(() => {
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
var Browser = ({ url = "mening-saytim.uz", children, dark = false }) => <div className={`browser ${dark ? "browser-dark" : ""}`}>
    <div className="browser-bar">
      <span className="browser-dot" style={{ background: "#FF5F56" }} />
      <span className="browser-dot" style={{ background: "#FFBD2E" }} />
      <span className="browser-dot" style={{ background: "#27C93F" }} />
      <span className="browser-url">{url}</span>
    </div>
    <div className="browser-body">{children}</div>
  </div>;
var SiteCard = ({ name = "Akmal", role, children }) => <div className="site-card">
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div className="site-ava">{name && name.trim()[0] || "A"}</div>
      <div>
        <div className="site-name">{name}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{tr3(role) || tr3({ uz: "Veb-dasturchi · 14 yosh", ru: "Веб-разработчик · 14 лет" })}</div>
      </div>
    </div>
    {children}
  </div>;
var Zoomable = ({ children, off = false }) => {
  const [big, setBig] = useState5(false);
  const zref = useRef5(null);
  const [hasContent, setHasContent] = useState5(true);
  useEffect6(() => {
    const el = zref.current;
    if (!el) return;
    const kids = [...el.childNodes].filter((n) => !(n.nodeType === 1 && n.classList.contains("zoom-btn")));
    const c = kids.some((n) => (n.textContent || "").trim().length > 0 || n.nodeType === 1 && n.querySelector("img,svg,canvas,input,textarea,video,iframe,button"));
    if (c !== hasContent) setHasContent(c);
  });
  useEffect6(() => {
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
      <div ref={zref} className={`zoomable ${big ? "zoom-on" : ""}${hasContent ? "" : " z-empty"}`}>
        {hasContent && !off && <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr3({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr3({ uz: "Kattalashtirish", ru: "Увеличить" })} title={big ? tr3({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr3({ uz: "Kattalashtirish", ru: "Увеличить" })}>{big ? "✕" : "⛶"}</button>}
        {children}
      </div>
    </>;
};
var ACK_KIRISH = {
  a: { uz: "Aynan!", ru: "Именно!" },
  b: { uz: "Internet emas — saytda JavaScript yo'q.", ru: "Дело не в интернете — на сайте нет JavaScript." },
  c: { uz: "Tugma chiroyli — lekin unga JavaScript kerak.", ru: "Кнопка красивая — но ей нужен JavaScript." }
};
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [dead, setDead] = useState5(0);
  const [shake, setShake] = useState5(false);
  const [picked, setPicked] = useState5(storedAnswer?.picked ?? null);
  const timer = useRef5(null);
  const OPTS = [
    { id: "a", label: tr3({ uz: "JavaScript yo'q — sayt reaksiya qila olmaydi", ru: "Нет JavaScript — сайт не может реагировать" }) },
    { id: "b", label: tr3({ uz: "Internet sekin, shuning uchun ishlamayapti", ru: "Интернет медленный, поэтому не работает" }) },
    { id: "c", label: tr3({ uz: "Tugma chiroyli emas, shuning uchun bosilmaydi", ru: "Кнопка некрасивая, поэтому не нажимается" }) }
  ];
  useEffect6(() => () => clearTimeout(timer.current), []);
  const tapDead = () => {
    setDead((d) => d + 1);
    setShake(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShake(false), 360);
  };
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
  };
  return <Stage eyebrow={tr3({ uz: "Kirish", ru: "Введение" })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr3({ uz: <>Chiroyli sayt, lekin tugma <span className="italic" style={{ color: T.accent }}>bosilsa</span> — hech nima bo'lmaydi</>, ru: <>Красивый сайт, но <span className="italic" style={{ color: T.accent }}>нажимаешь</span> кнопку — и ничего не происходит</> })}</h1>
        <Mentor>{tr3({ uz: <>Mana siz qurgan sayt — chiroyli ko'rinadi. <b style={{ color: T.ink }}>Like</b> tugmasini kamida 3 marta bosing va diqqat qiling: nima o'zgaryapti? Hech narsa! Hozircha bu sayt <b style={{ color: T.ink }}>jonsiz</b> — bosasiz, lekin u <b style={{ color: T.ink }}>javob bermaydi</b>, xuddi devordagi <b style={{ color: T.ink }}>rasm</b>dek qotib turadi.</>, ru: <>Вот сайт, который вы построили, — выглядит красиво. Нажмите кнопку <b style={{ color: T.ink }}>Like</b> минимум 3 раза и обратите внимание: что меняется? Ничего! Пока этот сайт <b style={{ color: T.ink }}>неживой</b> — вы нажимаете, а он <b style={{ color: T.ink }}>не отвечает</b>, застыл, как <b style={{ color: T.ink }}>картина</b> на стене.</> })}</Mentor>
        <Zoomable off={dead < 3}>{
    /* F-0926-06: ramka olingach zoom-tugma bo'sh ustunda yolg'iz qolmasin */
  }
        <Split>
          <Col>
            <p className="flow-label">{tr3({ uz: "Sizning saytingiz", ru: "Ваш сайт" })}</p>
            <Browser>
              <SiteCard>
                <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>{tr3({ uz: "Salom! Bu mening birinchi saytim. Yoqsa, like bosing.", ru: "Привет! Это мой первый сайт. Понравился — ставь лайк." })}</p>
                <button className={`site-like ${shake ? "shake" : ""}`} onClick={tapDead}>Like · 0</button>
                {dead > 0 && <p className="mono small" style={{ color: T.accent, margin: "4px 0 0" }}>{tr3({ uz: <>{dead}-marta bosildi, son hali 0. Hech nima bo'lmadi.</>, ru: <>Нажато {dead} раз — число всё ещё 0. Ничего не произошло.</> })}</p>}
              </SiteCard>
            </Browser>
          </Col>
          <Col>
            {
    /* F-0926-06: bo'sh-holat ramkasi olindi (159/3) — «kamida 3 marta» chorlovi mentor gapida */
  }
            {dead < 3 ? null : <div className="fade-step">
                <p className="eyebrow" style={{ color: T.ink2, margin: "0 0 9px" }}>{tr3({ uz: "Nega tugma ishlamayapti?", ru: "Почему кнопка не работает?" })}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {OPTS.map((o) => {
    const on2 = picked === o.id;
    return <button key={o.id} className={`hook-option ${on2 ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                        <span className="radio">{on2 && <span className="radio-dot" />}</span>
                        <span>{o.label}</span>
                      </button>;
  })}
                </div>
                {picked !== null && <p className="hook-ack fade-step"><b>{tr3(ACK_KIRISH[picked])}</b> {tr3({ uz: "Bugun saytga JavaScript qo'shamiz — tugma bosilganda ishlaydi.", ru: "Сегодня добавим на сайт JavaScript — кнопка заработает." })}</p>}
              </div>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var TAYYOR = [
  { uz: <>VS Code'da <span className="qcode">mening-saytim</span> papkangizni oching, <span className="qcode">index.html</span> da Go Live.</>, ru: <>Откройте в VS Code папку <span className="qcode">mening-saytim</span>, в <span className="qcode">index.html</span> — Go Live.</> },
  { uz: <>Copilot'ni o'rnating: chap paneldagi Extensions belgisi → qidiruvga «GitHub Copilot» → Install → GitHub hisobingiz bilan kiring.</>, ru: <>Установите Copilot: значок Extensions на левой панели → в поиске «GitHub Copilot» → Install → войдите через свой GitHub.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: "В другом окне откройте gemini.google.com." }
];
var REJA_BLOK = [
  { t: { uz: "Tungi rejim", ru: "Ночной режим" }, tag: "Gemini · if/else" },
  { t: { uz: "Like sanagich", ru: "Счётчик лайков" }, tag: "Copilot · click" },
  { t: { uz: "10 like — tabrik", ru: "10 лайков — поздравление" }, tag: { uz: "o'zingiz · if", ru: "сами · if" } }
];
var TayyorTugma = () => {
  const [ochiq, setOchiq] = useState5(false);
  const [korgan, setKorgan] = useState5(false);
  const btnRef = useRef5(null);
  const yopRef = useRef5(null);
  const yop = () => {
    setOchiq(false);
    setTimeout(() => btnRef.current && btnRef.current.focus(), 0);
  };
  useEffect6(() => {
    if (!ochiq) return;
    const onKey = (e) => {
      if (e.key === "Escape") yop();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    yopRef.current && yopRef.current.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [ochiq]);
  const sarlavha = <>{tr3({ uz: "Avval tayyorlaning", ru: "Сначала подготовьтесь" })} · {tr3({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</>;
  return <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${korgan ? "" : "am-tt-nafas"}`}>
      <button ref={btnRef} type="button" className="am-tt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => {
    setOchiq(true);
    setKorgan(true);
  }}>
        <span className="am-tayyor-h">{sarlavha}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr3({ uz: "Avval tayyorlaning", ru: "Сначала подготовьтесь" })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr3({ uz: "Yopish", ru: "Закрыть" })}>✕</button></div>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr3(x)}</span></li>)}</ol>
          <p className="am-tayyor-s">{tr3({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: "Готово — «Начинаем»." })}</p>
        </div>
      </>, btnRef.current && btnRef.current.closest(".lesson-root") || document.body)}
    </div></div>;
};
var Screen1 = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr3({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Boshlaymiz", ru: "Начинаем" }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: "clamp(14px,2.4vw,20px)" }}>
      <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Bugun saytingizga <span className="italic" style={{ color: T.accent }}>JavaScript</span> qo'shasiz.</>, ru: <>Сегодня добавите на сайт <span className="italic" style={{ color: T.accent }}>JavaScript</span>.</> })}</h2></div>
      <Mentor>{tr3({ uz: <>Bu — Netlify'ga chiqargan saytingiz. Bugun u bosishga javob beradigan bo'ladi: kodni Gemini va <b style={{ color: T.ink }}>Copilot</b> yozadi, bittasini o'zingiz yozasiz.</>, ru: <>Это сайт, который вы выложили на Netlify. Сегодня он начнёт отвечать на нажатия: код пишут Gemini и <b style={{ color: T.ink }}>Copilot</b>, одно вы напишете сами.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr3({ uz: "Dars oxirida · namuna", ru: "К концу урока · образец" })}</p>
          <JonliSayt rejim like tabrik />
        </Col>
        <Col>
          <p className="flow-label">{tr3({ uz: "Bugungi 3 blok", ru: "3 блока сегодня" })}</p>
          <ol className="am-blok-ro">{REJA_BLOK.map((b, i) => <li key={i} className="am-karta fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}><span className="am-blok-n">{String(i + 1).padStart(2, "0")}</span><b>{tr3(b.t)}</b><span className="am-blok-teg">{tr3(b.tag)}</span></li>)}</ol>
        </Col>
      </Split>
    </div>
  </Stage>;
var DEMO_KEY = "ccDemoDay";
var demoRead = () => {
  try {
    const v = JSON.parse(localStorage.getItem(DEMO_KEY) || "null");
    return v && typeof v === "object" ? v : null;
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
var useDemo = () => {
  const [d, setD] = useState5(() => demoRead() || {});
  const set = (patch) => {
    demoWrite(patch);
    setD(demoRead() || {});
  };
  return { d, set };
};
var USLUB_STD = "yorqin";
var DS_JADVAL = [
  { t: { uz: "Robototexnika", ru: "Робототехника" }, v: "15:00", x: { uz: "204-xona", ru: "каб. 204" }, c: "#2563eb" },
  { t: { uz: "Shaxmat", ru: "Шахматы" }, v: "16:30", x: { uz: "112-xona", ru: "каб. 112" }, c: "#d97706" },
  { t: { uz: "Futbol", ru: "Футбол" }, v: "17:00", x: { uz: "Stadion", ru: "Стадион" }, c: "#16a34a" }
];
var DsIll = () => <svg className="ds-svg" viewBox="0 0 300 230" aria-hidden="true">
    <circle className="il-b1" cx="225" cy="70" r="62" /><circle className="il-b2" cx="70" cy="175" r="48" /><circle className="il-b3" cx="270" cy="190" r="22" />
    <g transform="translate(108,14)">
      <rect className="il-phone" width="104" height="204" rx="18" />
      <rect className="il-screen" x="6" y="10" width="92" height="184" rx="13" />
      <rect className="il-notch" x="38" y="16" width="28" height="5" rx="2.5" />
      <rect className="il-bar" x="14" y="30" width="76" height="22" rx="7" />
      <text className="il-bar-t" x="22" y="45">{tr3({ uz: "Dushanba", ru: "Понедельник" })}</text>
      {DS_JADVAL.map((r, i) => <g key={i} transform={`translate(14,${60 + i * 40})`}>
          <rect className={`il-r${i + 1}`} width="76" height="34" rx="8" />
          <rect width="4" height="34" rx="2" style={{ fill: r.c }} />
          <text className="il-t" x="10" y="14">{tr3(r.t)}</text>
          <text className="il-v" x="10" y="26">{r.v} · {tr3(r.x)}</text>
        </g>)}
    </g>
    <g transform="translate(36,46)"><circle className="il-c" r="26" /><rect className="il-robot" x="-12" y="-9" width="24" height="18" rx="5" /><circle className="il-eye" cx="-5" cy="0" r="3" /><circle className="il-eye" cx="5" cy="0" r="3" /><rect className="il-robot" x="-1.5" y="-16" width="3" height="7" /><circle className="il-robot" cy="-17" r="3" /></g>
    <g transform="translate(262,128)"><circle className="il-c" r="24" /><path className="il-chess" d="M-7 12h14v-4h-2l-2-8 4-4-3-6h-6l1 5-5 5 2 8h-3z" /></g>
    <g transform="translate(44,128)"><circle className="il-c" r="20" /><circle className="il-ball-o" r="11" /><path className="il-ball" d="M0-5l4.5 3.3-1.7 5.2h-5.6l-1.7-5.2z" /></g>
  </svg>;
var PromptBlok = ({ matn, tayyor }) => {
  const [ok, setOk] = useState5(false);
  const nusxa = async () => {
    try {
      await navigator.clipboard.writeText(matn);
      setOk(true);
      setTimeout(() => setOk(false), 1600);
    } catch {
    }
  };
  return <div className="am-karta fade-up delay-2">
      {tayyor && <p className="am-tayyor-ok">{tr3(tayyor)}</p>}
      <div className="am-prompt-h"><p className="flow-label">{tr3({ uz: "Prompt", ru: "Промпт" })}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr3({ uz: "✓ Nusxalandi", ru: "✓ Скопировано" }) : tr3({ uz: "Promptni nusxalash", ru: "Скопировать промпт" })}</button></div>
      <pre className="am-masalan">{matn}</pre>
    </div>;
};
var PromptKarta = ({ matn }) => {
  const [ok, setOk] = useState5(false);
  const [ochiq, setOchiq] = useState5(false);
  const btnRef = useRef5(null);
  const yopRef = useRef5(null);
  const nusxa = async () => {
    try {
      await navigator.clipboard.writeText(matn);
      setOk(true);
      setTimeout(() => setOk(false), 1600);
    } catch {
    }
  };
  const yop = () => {
    setOchiq(false);
    setTimeout(() => btnRef.current && btnRef.current.focus(), 0);
  };
  useEffect6(() => {
    if (!ochiq) return;
    const onKey = (e) => {
      if (e.key === "Escape") yop();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    yopRef.current && yopRef.current.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [ochiq]);
  const birinchi = matn.split("\n")[0];
  return <div className="am-karta pk-karta">
      <div className="am-prompt-h">
        <p className="flow-label">{tr3({ uz: "Prompt", ru: "Промпт" })}</p>
        <span className="pk-tg">
          <button ref={btnRef} type="button" className="pk-kor" aria-haspopup="dialog" onClick={() => setOchiq(true)}>{tr3({ uz: "Ko'rish", ru: "Показать" })}</button>
          <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr3({ uz: "✓ Nusxalandi", ru: "✓ Скопировано" }) : tr3({ uz: "Promptni nusxalash", ru: "Скопировать промпт" })}</button>
        </span>
      </div>
      <p className="pk-bosh">{birinchi}</p>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna pk-oyna" role="dialog" aria-modal="true" aria-label={tr3({ uz: "Prompt", ru: "Промпт" })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{tr3({ uz: "Prompt", ru: "Промпт" })}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr3({ uz: "Yopish", ru: "Закрыть" })}>✕</button></div>
          <pre className="am-masalan">{matn}</pre>
          <button type="button" className="am-nusxa pk-ich" onClick={nusxa}>{ok ? tr3({ uz: "✓ Nusxalandi", ru: "✓ Скопировано" }) : tr3({ uz: "Promptni nusxalash", ru: "Скопировать промпт" })}</button>
        </div>
      </>, btnRef.current && btnRef.current.closest(".lesson-root") || document.body)}
    </div>;
};
var Qadamlar = ({ b, cls = "" }) => <div className={`am-karta ${cls}`}>
    <p className="flow-label">{tr3({ uz: "Qadamlar", ru: "Шаги" })}</p>
    <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr3(x))}</span></li>)}</ol>
    {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr3(b.yordam)}</p>}
  </div>;
var QadamTugma = ({ b, cls = "" }) => {
  const [ochiq, setOchiq] = useState5(false);
  const btnRef = useRef5(null);
  const yopRef = useRef5(null);
  const yop = () => {
    setOchiq(false);
    setTimeout(() => btnRef.current && btnRef.current.focus(), 0);
  };
  useEffect6(() => {
    if (!ochiq) return;
    const onKey = (e) => {
      if (e.key === "Escape") yop();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    yopRef.current && yopRef.current.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [ochiq]);
  const sarlavha = <>{tr3({ uz: "Qadamlar", ru: "Шаги" })} · {b.qadamlar.length}</>;
  return <div className={`am-karta am-qt ${cls}`}>
      <button ref={btnRef} type="button" className="am-qt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => setOchiq(true)}>
        <span>{sarlavha}</span><span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr3({ uz: "Qadamlar", ru: "Шаги" })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr3({ uz: "Yopish", ru: "Закрыть" })}>✕</button></div>
          <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr3(x))}</span></li>)}</ol>
        </div>
      </>, btnRef.current && btnRef.current.closest(".lesson-root") || document.body)}
    </div>;
};
var JonliSayt = ({ rejim = false, like = false, tabrik = false, vosita = null, boshSon = 0 }) => {
  const demo = useDemo();
  const asl = demo.d.uslub || USLUB_STD;
  const [tungi, setTungi] = useState5(false);
  const [son, setSon] = useState5(boshSon);
  const [menyu, setMenyu] = useState5(false);
  const [ism, setIsm] = useState5("");
  const [pochta, setPochta] = useState5("");
  const [javob, setJavob] = useState5(null);
  const uslub = tungi ? asl === "qorongi" ? "minimal" : "qorongi" : asl;
  return <div className={`ds ds-${uslub} js-sayt`}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · Live Server</span></div>
      <div className="ds-body">
        <div className="ds-hd">
          <span className="ds-logo"><i className="ds-mark" aria-hidden="true" />{tr3({ uz: "To'garak jadvali", ru: "Расписание кружков" })}</span>
          {vosita === "menyu" ? <button type="button" className="js-btn js-menyu-btn" aria-expanded={menyu} onClick={() => setMenyu((m) => !m)}>{tr3(menyu ? { uz: "Yopish", ru: "Закрыть" } : { uz: "Menyu", ru: "Меню" })}</button> : <span className="ds-nav"><span>{tr3({ uz: "Jadval", ru: "Расписание" })}</span><span>{tr3({ uz: "Aloqa", ru: "Контакты" })}</span></span>}
          {rejim && <button type="button" className="js-btn" onClick={() => setTungi((t) => !t)}>{tr3(tungi ? { uz: "Kunduzgi rejim", ru: "Дневной режим" } : { uz: "Tungi rejim", ru: "Ночной режим" })}</button>}
        </div>
        {vosita === "menyu" && menyu && <div className="js-menyu am-ochil">{[{ uz: "Bosh sahifa", ru: "Главная" }, { uz: "Jadval", ru: "Расписание" }, { uz: "Ustozlar", ru: "Учителя" }, { uz: "Aloqa", ru: "Контакты" }].map((x, i) => <span key={i}>{tr3(x)}</span>)}</div>}
        <div className="ds-hero">
          <div className="ds-hero-t">
            <p className="ds-tag">{tr3({ uz: "Maktab to'garaklari · 2026", ru: "Школьные кружки · 2026" })}</p>
            <p className="ds-h1">{tr3({ uz: "To'garak jadvali endi telefoningizda", ru: "Расписание кружков теперь в телефоне" })}</p>
            <p className="ds-p">{tr3({ uz: "Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.", ru: "Расписание висело только на стене — теперь его видно и из дома." })}</p>
            {like && <div className="ds-btns"><button type="button" className="ds-tugma js-like" onClick={() => setSon((n) => n + 1)}>Like</button><span className="js-son" aria-live="polite">{son}</span></div>}
            {tabrik && son >= 10 && <p className="js-tabrik am-ochil">{tr3({ uz: "Rahmat! 10 like", ru: "Спасибо! 10 лайков" })}</p>}
          </div>
          <DsIll />
        </div>
        {vosita === "salom" && <div className="js-blok am-ochil">
          <input className="js-input" value={ism} placeholder={tr3({ uz: "Ismingizni yozing", ru: "Напишите своё имя" })} onChange={(e) => setIsm(e.target.value)} aria-label={tr3({ uz: "Ism", ru: "Имя" })} />
          <p className="js-salom">{ism.trim() ? tr3({ uz: `Salom, ${ism.trim()}!`, ru: `Привет, ${ism.trim()}!` }) : tr3({ uz: "Salom!", ru: "Привет!" })}</p>
        </div>}
        {vosita === "forma" && <form className="js-blok am-ochil" onSubmit={(e) => {
    e.preventDefault();
    setJavob(pochta.trim() ? "ok" : "xato");
  }}>
          <div className="js-qator"><input className="js-input" value={pochta} placeholder={tr3({ uz: "Pochtangiz", ru: "Ваша почта" })} onChange={(e) => {
    setPochta(e.target.value);
    setJavob(null);
  }} aria-label={tr3({ uz: "Pochta", ru: "Почта" })} /><button type="submit" className="ds-tugma js-btn2">{tr3({ uz: "Yuborish", ru: "Отправить" })}</button></div>
          {javob === "xato" && <p className="js-xato">{tr3({ uz: "Pochtani yozing", ru: "Напишите почту" })}</p>}
          {javob === "ok" && <p className="js-ok">{tr3({ uz: "Rahmat, xabaringiz qabul qilindi", ru: "Спасибо, сообщение принято" })}</p>}
        </form>}
        <div className="ds-ft">{tr3({ uz: "To'garak jadvali · 2026", ru: "Расписание кружков · 2026" })}</div>
      </div>
    </div>;
};
var NUSXA_HTML = '<button id="like">Like</button> <span id="son">0</span>';
var NUSXA_IZOH = "// like tugmasi bosilsa son 1 ga oshsin";
var KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState5(false);
  const nusxa = async () => {
    try {
      await navigator.clipboard.writeText(kod);
      setOk(true);
      setTimeout(() => setOk(false), 1600);
    } catch {
    }
  };
  return <div className="am-kod">
      <div className="am-prompt-h"><p className="flow-label">{tr3(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr3({ uz: "✓ Nusxalandi", ru: "✓ Скопировано" }) : tr3({ uz: "Nusxalash", ru: "Скопировать" })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>;
};
var A1 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: "«Скопировать промпт» → вставьте в gemini.google.com, вместо `{…}` в конце — код `index.html` и `style.css`." },
    { uz: "Javobdagi kodlarni fayllarga qo'ying: `index.html` va `style.css` ni almashtiring, yangi `script.js` yarating, `Ctrl+S`.", ru: "Вставьте код из ответа в файлы: замените `index.html` и `style.css`, создайте новый `script.js`, `Ctrl+S`." },
    { uz: "Live Server'da tugmani bosing: sayt qorong'i bo'ldimi, yana bosilsa qaytdimi? Ishlamasa, Gemini'ga yozing: «tugma bosilsa hech narsa bo'lmayapti, tuzat».", ru: "Нажмите кнопку в Live Server: сайт потемнел, а при повторном нажатии вернулся? Если нет, напишите Gemini: «при нажатии ничего не происходит, исправь»." }
  ]
};
var A1_PROMPT = { uz: "Saytimga tungi rejim tugmasini qo'sh: menyu yonida «Tungi rejim» tugmasi bo'lsin.\nBosilsa sahifa qorong'i bo'lsin (to'q fon, och matn), yana bosilsa yorug'ga qaytsin; tugma yozuvi ham almashsin.\nJavaScript'ni alohida script.js fayliga yoz va index.html oxirida ula. Qorong'i ranglarni style.css ga .tungi klassi bilan qo'sh.\nBor matnlarimni o'zgartirma. O'zgargan fayllarni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}", ru: "Добавь на мой сайт кнопку ночного режима: рядом с меню кнопка «Ночной режим».\nПри нажатии страница темнеет (тёмный фон, светлый текст), при повторном — возвращается светлой; надпись на кнопке тоже меняется.\nJavaScript напиши в отдельном файле script.js и подключи в конце index.html. Тёмные цвета добавь в style.css классом .tungi.\nМои тексты не меняй. Верни изменённые файлы целиком.\nВот мой код: {вставьте сюда код index.html и style.css}" };
var ScreenTungi = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr3({ uz: "Amaliyot 1 · Gemini", ru: "Практика 1 · Gemini" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
      <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: "Saytingizga tungi rejim tugmasini qo'shing.", ru: "Добавьте на сайт кнопку ночного режима." })}</h2></div>
      <Split>
        <Col><div className="fade-up delay-1"><PromptKarta matn={tr3(A1_PROMPT)} /> {
  /* F-1015-385: yig'iq prompt */
}</div></Col>
        <Col>
          <p className="flow-label">{tr3({ uz: "Kutilgan natija · bosib ko'ring", ru: "Ожидаемый результат · нажмите" })}</p>
          <JonliSayt rejim />
          <p className="small am-osti">{fmtCode(tr3({ uz: "Gemini javobida `if` / `else` ni toping — u hozirgi rejimga qarab qaysi biriga o'tishni tanlaydi.", ru: "Найдите в ответе Gemini `if` / `else` — по текущему режиму он выбирает, куда переключиться." }))}</p>
          <QadamTugma b={A1} />
        </Col>
      </Split>
    </div>
  </Stage>;
var A2 = {
  qadamlar: [
    { uz: "`index.html` da tugma va son uchun joy yozing (pastdagi qatorni nusxalang) — masalan, bosh qismdagi tugmalar yoniga.", ru: "В `index.html` добавьте кнопку и место для числа (скопируйте строку ниже) — например, рядом с кнопками главного блока." },
    { uz: "`script.js` oxiriga izohni qo'ying va `Enter` bosing.", ru: "В конец `script.js` вставьте комментарий и нажмите `Enter`." },
    { uz: "Kulrang taklif chiqadi — o'qing, to'g'ri bo'lsa `Tab` bilan qabul qiling. `Ctrl+S`, brauzerda 3 marta bosing: son 3 bo'ldimi?", ru: "Появится серая подсказка — прочитайте, если верно, примите клавишей `Tab`. `Ctrl+S`, нажмите в браузере 3 раза: стало 3?" }
  ]
};
var ScreenLike = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr3({ uz: "Amaliyot 2 · Copilot", ru: "Практика 2 · Copilot" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
      <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: "Like tugmasi bosilgan sari son oshsin.", ru: "Пусть число растёт с каждым нажатием лайка." })}</h2></div>
      <Mentor>{tr3({ uz: <>Bu safar promptni Gemini'ga emas — <b style={{ color: T.ink }}>Copilot</b>'ga yozasiz: u VS Code ichida, siz yozgan izohdan kodni o'zi taklif qiladi.</>, ru: <>На этот раз пишете не Gemini, а <b style={{ color: T.ink }}>Copilot</b>: он внутри VS Code и сам предлагает код по вашему комментарию.</> })}</Mentor>
      <Split>
        <Col>
          <div className="am-karta fade-up delay-1">
            <KodNusxa yorliq={{ uz: "1 · index.html ga", ru: "1 · в index.html" }} kod={NUSXA_HTML} />
            <KodNusxa yorliq={{ uz: "2 · script.js oxiriga", ru: "2 · в конец script.js" }} kod={NUSXA_IZOH} />
          </div>
          <Qadamlar b={A2} cls="fade-up delay-2" />
          <details className="am-yordam"><summary>{tr3({ uz: "Taklif chiqmadimi?", ru: "Подсказка не появилась?" })}</summary><p>{tr3({ uz: "Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — Copilot'ga kirganingizni tekshiring (pastki chiziqdagi Copilot belgisi) yoki shu izohni Gemini'ga yuboring.", ru: "Нажмите Enter после комментария ещё раз. Если всё равно нет — проверьте, что вошли в Copilot (значок Copilot в нижней строке), или отправьте этот комментарий в Gemini." })}</p></details>
        </Col>
        <Col>
          <p className="flow-label">{tr3({ uz: "Kutilgan natija · bosib ko'ring", ru: "Ожидаемый результат · нажмите" })}</p>
          <JonliSayt rejim like />
          <p className="small am-osti">{fmtCode(tr3({ uz: "Copilot `let son = 0` va `click` hodisasini yozadi — o'zgaruvchi va hodisa JS darslaridagi bilan bir xil.", ru: "Copilot напишет `let son = 0` и событие `click` — переменная и событие те же, что на уроках JS." }))}</p>
        </Col>
      </Split>
    </div>
  </Stage>;
var A3 = {
  qadamlar: [
    { uz: "`script.js` da son oshadigan qatorni toping (`son = son + 1` yoki `son++`).", ru: "Найдите в `script.js` строку, где растёт число (`son = son + 1` или `son++`)." },
    { uz: "Undan keyin o'zingiz shart yozing: son 10 ga teng bo'lsa — sahifada «Rahmat! 10 like» yozuvi chiqsin.", ru: "После неё сами напишите условие: если число равно 10 — на странице появляется «Спасибо! 10 лайков»." },
    { uz: "`Ctrl+S` — brauzerda 10 marta bosib tekshiring.", ru: "`Ctrl+S` — проверьте в браузере, нажав 10 раз." }
  ]
};
var ScreenTabrik = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr3({ uz: "Amaliyot 3 · AI'siz", ru: "Практика 3 · без AI" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
      <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: "10 like bo'lsa, tabrik yozuvi chiqsin.", ru: "При 10 лайках пусть появится поздравление." })}</h2></div>
      <Mentor>{tr3({ uz: <>Bu safar kodni AI yozmaydi — <b style={{ color: T.ink }}>o'zingiz</b>. Shart (<code className="qcode">if</code>) JS darsidagi o'sha.</>, ru: <>На этот раз код пишет не AI, а <b style={{ color: T.ink }}>вы сами</b>. Условие (<code className="qcode">if</code>) — то же, что на уроке JS.</> })}</Mentor>
      <Split>
        <Col>
          <Qadamlar b={A3} cls="fade-up delay-1" />
          <div className="am-karta fade-up delay-2">
            <p className="flow-label">{tr3({ uz: "Qolip", ru: "Шаблон" })}</p>
            <pre className="am-masalan">{"if (son === …) {\n  …\n}"}</pre>
          </div>
          <details className="am-yordam"><summary>{tr3({ uz: "Qiynalyapsizmi?", ru: "Трудно?" })}</summary><pre className="am-masalan">{'if (son === 10) {\n  alert("Rahmat! 10 like");\n}'}</pre></details>
        </Col>
        <Col>
          <p className="flow-label">{tr3({ uz: "Kutilgan natija · 10 marta bosing", ru: "Ожидаемый результат · нажмите 10 раз" })}</p>
          <JonliSayt rejim like tabrik />
          <p className="small am-osti">{fmtCode(tr3({ uz: "Shart (`if`) son 10 ga teng bo'lsagina ishlaydi.", ru: "Условие (`if`) срабатывает, только когда число равно 10." }))}</p>
        </Col>
      </Split>
    </div>
  </Stage>;
var VOSITALAR = [
  {
    id: "menyu",
    name: { uz: "Ochiladigan menyu", ru: "Раскрывающееся меню" },
    sub: { uz: "bosilsa ochiladi, yana bosilsa yopiladi", ru: "нажали — открылось, ещё раз — закрылось" },
    p: { uz: "Saytimga ochiladigan menyu qo'sh: tepada «Menyu» tugmasi bo'lsin; bosilsa sahifalar ro'yxati ochilsin, yana bosilsa yopilsin, tugma yozuvi «Yopish» ga almashsin.", ru: "Добавь на сайт раскрывающееся меню: вверху кнопка «Меню»; при нажатии открывается список страниц, при повторном — закрывается, надпись кнопки меняется на «Закрыть»." }
  },
  {
    id: "salom",
    name: { uz: "Jonli salom", ru: "Живое приветствие" },
    sub: { uz: "ism yozilsa salom o'zgaradi", ru: "пишете имя — приветствие меняется" },
    p: { uz: "Bosh sahifaga ism yoziladigan maydon qo'sh: ism yozilgan sari ostidagi «Salom, {ism}!» yozuvi jonli o'zgarsin (input hodisasi); maydon bo'sh bo'lsa — «Salom!».", ru: "Добавь на главную поле для имени: по мере ввода надпись под ним «Привет, {имя}!» меняется вживую (событие input); если поле пустое — «Привет!»." }
  },
  {
    id: "forma",
    name: { uz: "Forma tekshiruvi", ru: "Проверка формы" },
    sub: { uz: "bo'sh yuborilsa ogohlantiradi", ru: "предупреждает, если пусто" },
    p: { uz: "Aloqa sahifasiga forma qo'sh: pochta maydoni va «Yuborish» tugmasi. Maydon bo'sh bo'lsa, qizil «Pochtani yozing» xabari chiqsin; to'ldirilgan bo'lsa — «Rahmat, xabaringiz qabul qilindi» (if / else).", ru: "Добавь на страницу контактов форму: поле почты и кнопка «Отправить». Если поле пустое — красное «Напишите почту»; если заполнено — «Спасибо, сообщение принято» (if / else)." }
  }
];
var A4 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html`, `style.css` va `script.js` kodingizni qo'ying.", ru: "«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html`, `style.css` и `script.js`." },
    { uz: "Javobdagi kodlarni fayllaringizga almashtiring, `Ctrl+S`.", ru: "Замените код в своих файлах на код из ответа, `Ctrl+S`." },
    { uz: "Live Server'da sinab ko'ring: namunadagidek ishlayaptimi? Yana birini qo'shmoqchi bo'lsangiz — boshqasini tanlab, promptni yana yuboring.", ru: "Проверьте в Live Server: работает, как в образце? Хотите ещё — выберите другой и отправьте промпт снова." }
  ]
};
var ScreenVosita = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const tanlov = demo.d.js && demo.d.js.vosita || null;
  const tanla = (id) => demo.set({ js: { ...demo.d.js || {}, vosita: id } });
  const v = VOSITALAR.find((x) => x.id === tanlov);
  const matn = v ? tr3({ uz: `${v.p.uz}
JavaScript'ni script.js ga qo'sh (bor kodimni o'chirma), kerakli HTML va CSS'ni ham qo'sh. Bor matnlarimni o'zgartirma.
O'zgargan fayllarni to'liq qaytar.
Mana kodim: {index.html, style.css va script.js kodini shu yerga qo'ying}`, ru: `${v.p.ru}
JavaScript добавь в script.js (мой код не удаляй), нужные HTML и CSS тоже добавь. Мои тексты не меняй.
Верни изменённые файлы целиком.
Вот мой код: {вставьте сюда код index.html, style.css и script.js}` }) : null;
  return <Stage eyebrow={tr3({ uz: "Amaliyot 4 · yana bitta vosita", ru: "Практика 4 · ещё один инструмент" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: "Saytingizga yana bitta jonli vosita qo'shing.", ru: "Добавьте на сайт ещё один живой инструмент." })}</h2></div>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr3({ uz: "Vosita", ru: "Инструмент" })}</p>
              <div className="am-uslub am-uslub-1">{VOSITALAR.map((x) => <button key={x.id} type="button" className={`am-uslub-btn ${tanlov === x.id ? "on" : ""}`} onClick={() => tanla(x.id)}><b>{tr3(x.name)}</b><span>{tr3(x.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr3(tanlov ? { uz: "O'ngdagi namunada sinab ko'ring.", ru: "Попробуйте в образце справа." } : { uz: "Bittasini tanlang — o'ngdagi namunada sinab ko'rasiz, keyin prompt ochiladi.", ru: "Выберите один — попробуете в образце справа, затем откроется промпт." })}</p>
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "Saytingiz · sinab ko'ring", ru: "Ваш сайт · попробуйте" })}</p>
            <div key={tanlov || "yoq"}><JonliSayt rejim like vosita={tanlov} /></div>
            {matn && <QadamTugma b={A4} cls="am-ochil" />}
          </Col>
        </Split>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [evt, setEvt] = useState5(storedAnswer ? "click" : null);
  const [react, setReact] = useState5(storedAnswer ? "color" : null);
  const [passed, setPassed] = useState5(!!(storedAnswer && (storedAnswer.solved || storedAnswer.correct)));
  const [bg, setBg] = useState5(false);
  const [deleted, setDeleted] = useState5(false);
  const [tried, setTried] = useState5(false);
  const resetSite = () => {
    setBg(false);
    setDeleted(false);
    setTried(false);
  };
  const achMiss = useContext2(AchMissCtx);
  const wrongEverRef = useRef5(false);
  const markWrong = () => {
    if (passed) return;
    wrongEverRef.current = true;
    if (achMiss) achMiss.miss(screen);
  };
  const evtOk = evt === "click";
  const reactOk = react === "color";
  const ready = evtOk && reactOk;
  const both = !!(evt && react);
  const onSiteClick = () => {
    if (!both) return;
    setTried(true);
    if (evt !== "click") return;
    if (react === "color") setBg((b) => !b);
    else if (react === "delete") setDeleted(true);
  };
  const onSiteEnter = () => {
    if (!both || evt !== "hover") return;
    setTried(true);
    if (react === "color") setBg(true);
    else if (react === "delete") setDeleted(true);
  };
  const onSiteLeave = () => {
    if (evt === "hover" && react === "color") setBg(false);
  };
  const outcome = !both ? null : ready ? bg ? tr3({ uz: "Bosdingiz — sahifa rangi o'zgardi! Yana bosing, qaytadi.", ru: "Вы нажали — цвет страницы изменился! Нажмите ещё раз — вернётся." }) : tr3({ uz: "Tugmani bosing — sahifa rangi darhol o'zgaradi.", ru: "Нажмите кнопку — цвет страницы сразу изменится." }) : !tried ? tr3({ uz: "Tugmani bosib ko'ring — nima bo'ladi?", ru: "Нажмите кнопку — что произойдёт?" }) : deleted ? tr3({ uz: "Sahifa o'chdi — maqsad bu emas edi. Reaksiyani almashtiring.", ru: "Страница удалилась — цель была не эта. Смените реакцию." }) : evt === "scroll" ? tr3({ uz: "Bosdingiz — hech narsa bo'lmadi: «Aylantirilganda» bosishni sezmaydi. Hodisani almashtiring.", ru: "Вы нажали — ничего не произошло: «При прокрутке» не замечает нажатие. Смените событие." }) : react === "nothing" ? tr3({ uz: "Hech narsa o'zgarmadi — reaksiya yo'q. Reaksiyani almashtiring.", ru: "Ничего не изменилось — реакции нет. Смените реакцию." }) : tr3({ uz: "Ishladi, lekin sichqoncha tugma ustiga kelganda. Maqsad — bosilganda. Hodisani almashtiring.", ru: "Сработало, но при наведении мыши. Цель — при нажатии. Смените событие." });
  useEffect6(() => {
    if (ready && !passed) {
      setPassed(true);
      const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
      onAnswer(screen, { stage: "final", screenIdx: screen, question: tr3({ uz: "Tugmani jonlantirish: hodisa + reaksiya", ru: "Оживить кнопку: событие + реакция" }), studentAnswer: `${evt}+${react}`, correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
    }
  }, [ready]);
  const EVTS = [{ id: "click", l: tr3({ uz: "Bosilganda (click)", ru: "При нажатии (click)" }) }, { id: "hover", l: "Hover" }, { id: "scroll", l: tr3({ uz: "Aylantirilganda", ru: "При прокрутке" }) }];
  const REACTS = [{ id: "color", l: tr3({ uz: "Rangni o'zgartir", ru: "Изменить цвет" }) }, { id: "delete", l: tr3({ uz: "Sahifani o'chir", ru: "Удалить страницу" }) }, { id: "nothing", l: tr3({ uz: "Hech narsa", ru: "Ничего" }) }];
  return <Stage eyebrow={tr3({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Hodisa va reaksiyani tanlang", ru: "Выберите событие и реакцию" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr3({ uz: <>Oxirgi sinov: tugmani <span className="italic" style={{ color: T.accent }}>o'zingiz</span> to'g'ri jonlantiring</>, ru: <>Последнее испытание: оживите кнопку <span className="italic" style={{ color: T.accent }}>сами</span></> })}</h2></div>
        <Mentor>{tr3({ uz: <>Maqsad: <b style={{ color: T.ink }}>"Tugma bosilganda sahifa rangi o'zgarsin."</b> To'g'ri <b style={{ color: T.ink }}>HODISA</b> va to'g'ri <b style={{ color: T.ink }}>REAKSIYA</b>ni tanlang. Ikkalasi to'g'ri bo'lsa — tugma saytda haqiqatan ishlay boshlaydi.</>, ru: <>Цель: <b style={{ color: T.ink }}>«При нажатии кнопки цвет страницы меняется.»</b> Выберите правильное <b style={{ color: T.ink }}>СОБЫТИЕ</b> и правильную <b style={{ color: T.ink }}>РЕАКЦИЮ</b>. Если оба верны — кнопка на сайте действительно заработает.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr3({ uz: "1. Qaysi HODISA?", ru: "1. Какое СОБЫТИЕ?" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EVTS.map((e) => <button key={e.id} className={`chip ${evt === e.id ? "chip-on" : ""}`} onClick={() => {
    setEvt(e.id);
    resetSite();
    if (e.id !== "click") markWrong();
  }} style={evt === e.id && e.id === "click" ? { background: T.successSoft, color: T.success, boxShadow: `0 0 0 2px ${T.success}` } : void 0}>{e.l}</button>)}
            </div>
            {evt && <p className="small fade-step" style={{ margin: 0, fontWeight: 600, color: evtOk ? T.success : T.accent }}>{evtOk ? tr3({ uz: "✓ Tugma aynan bosishni sezadi", ru: "✓ Кнопка замечает именно нажатие" }) : tr3({ uz: "✗ Bu hodisa tugma bosilishini sezmaydi.", ru: "✗ Это событие не замечает нажатие кнопки." })}</p>}
            <p className="flow-label" style={{ marginTop: 4 }}>{tr3({ uz: "2. Qaysi REAKSIYA?", ru: "2. Какая РЕАКЦИЯ?" })}</p>
            <div className="fade-up delay-2" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {REACTS.map((r) => <button key={r.id} className={`chip ${react === r.id ? "chip-on" : ""}`} onClick={() => {
    setReact(r.id);
    resetSite();
    if (r.id !== "color") markWrong();
  }} style={react === r.id && r.id === "color" ? { background: T.successSoft, color: T.success, boxShadow: `0 0 0 2px ${T.success}` } : void 0}>{r.l}</button>)}
            </div>
            {react && <p className="small fade-step" style={{ margin: 0, fontWeight: 600, color: reactOk ? T.success : T.accent }}>{reactOk ? tr3({ uz: "✓ Rang o'zgaradi — maqsad shu", ru: "✓ Цвет изменится — это и есть цель" }) : react === "delete" ? tr3({ uz: "✗ Bu sahifani o'chiradi — maqsadga mos emas", ru: "✗ Это удалит страницу — не соответствует цели" }) : tr3({ uz: "✗ 'Hech narsa' bo'lsa sayt jonlanmaydi", ru: "✗ Если «ничего» — сайт не оживёт" })}</p>}
            <div className="codebox" style={{ marginTop: 6 }}>
              <div><FN>tugma</FN>.<FN>{{ click: "onclick", hover: "onmouseover", scroll: "onscroll" }[evt] || "???"}</FN> = () =&gt; {"{"}</div>
              <div style={{ paddingLeft: 18 }}>{reactOk ? <>sahifa.<FN>rang</FN> = <STR>{tr3({ uz: '"yangi"', ru: '"новый"' })}</STR></> : <CM>{react === "delete" ? tr3({ uz: "// sahifani o'chiradi", ru: "// удаляет страницу" }) : react === "nothing" ? tr3({ uz: "// bo'sh — hech narsa", ru: "// пусто — ничего" }) : tr3({ uz: "// reaksiyani tanlang", ru: "// выберите реакцию" })}</CM>}</div>
              <div>{"}"}</div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr3({ uz: "natija — saytingiz", ru: "результат — ваш сайт" })}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ background: evt ? evtOk ? T.successSoft : T.accentSoft : T.paper, color: evt ? evtOk ? T.success : T.accent : T.ink3 }}>{evt ? evtOk ? "✓" : "✗" : "1"} {tr3({ uz: "HODISA", ru: "СОБЫТИЕ" })}</span>
              <span className="tagpill" style={{ background: react ? reactOk ? T.successSoft : T.accentSoft : T.paper, color: react ? reactOk ? T.success : T.accent : T.ink3 }}>{react ? reactOk ? "✓" : "✗" : "2"} {tr3({ uz: "REAKSIYA", ru: "РЕАКЦИЯ" })}</span>
            </div>
            <Browser>
              {deleted ? <div className="fade-step" style={{ borderRadius: 12, padding: "clamp(22px,4vw,34px)", textAlign: "center", background: T.bg, border: "1.5px dashed #E6E1D8" }}>
                    <p className="small" style={{ margin: "0 0 14px", fontWeight: 700, color: T.ink3 }}>{tr3({ uz: "Sahifa o'chdi", ru: "Страница удалена" })}</p>
                    <button className="site-btn" onClick={resetSite}>{tr3({ uz: "Qaytarish", ru: "Вернуть" })}</button>
                  </div> : <div style={{ borderRadius: 12, padding: "clamp(22px,4vw,34px)", textAlign: "center", transition: "background .35s ease", background: bg ? T.accent : "#FFFFFF", border: `1.5px solid ${bg ? T.accent : "#E6E1D8"}` }}>
                    <p className="small" style={{ margin: "0 0 14px", fontWeight: 700, letterSpacing: "0.03em", color: bg ? "#fff" : T.ink2 }}>{tr3({ uz: "Sahifa rangi:", ru: "Цвет страницы:" })} {bg ? tr3({ uz: "TO'Q SARIQ", ru: "ОРАНЖЕВЫЙ" }) : tr3({ uz: "OQ", ru: "БЕЛЫЙ" })}</p>
                    <button className={`site-btn ${ready && !bg ? "glow-btn" : ""}`} disabled={!both} onClick={onSiteClick} onMouseEnter={onSiteEnter} onMouseLeave={onSiteLeave} style={{ opacity: both ? 1 : 0.5, background: bg ? "#fff" : T.accent, color: bg ? T.accent : "#fff" }}>{both ? tr3({ uz: "Tugmani bos", ru: "Нажми кнопку" }) : tr3({ uz: "🔒 Avval tanlang", ru: "🔒 Сначала выберите" })}</button>
                  </div>}
            </Browser>
            {outcome && <p className="small" style={{ margin: 0, color: !ready && tried ? T.accent : T.ink3, fontWeight: !ready && tried ? 600 : 400 }}>{
    /* F-0926-06: tanlovgacha yozuv olindi — mentor takrori (159/7) */
  }{outcome}</p>}
            {passed && ready ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr3({ uz: <>Mukammal! <b>Bosish</b> hodisasi va <b>rangni o'zgartirish</b> reaksiyasi birga — tugma jonlandi. Siz uni o'zingiz jonlantirdingiz.</>, ru: <>Отлично! Событие <b>клик</b> и реакция <b>изменить цвет</b> вместе — кнопка ожила. Вы оживили её сами.</> })}</p></div> : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr3({ uz: "Maslahat: maqsad gapini qayta o'qing — unda hodisa ham, reaksiya ham bor.", ru: "Подсказка: перечитайте цель — в ней есть и событие, и реакция." })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
  const [hwOpen, setHwOpen] = useState5(false);
  const [hwCharge, setHwCharge] = useState5(false);
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
  const [arena, setArena] = useState5(false);
  const [arenaSolo, setArenaSolo] = useState5(false);
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
      } catch (e) {
        console.warn("[arena]", e);
        liveToast({ uz: "Jonli arena ochilmadi: server javob bermadi. Mashq rejimida ochildi — o'quvchilar ekranida ko'rinmaydi.", ru: "Живая арена не открылась: сервер не ответил. Открыта в режиме тренировки — на экранах учеников не видна." });
        setArenaSolo(true);
        setArena(true);
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const RECAP = [tr3({ uz: "Asosiy qoida: HODISA → REAKSIYA → O'ZGARISH", ru: "Главное правило: СОБЫТИЕ → РЕАКЦИЯ → ИЗМЕНЕНИЕ" }), fmtCode(tr3({ uz: "Tungi rejim — `if` / `else` hozirgi holatga qarab tanlaydi", ru: "Ночной режим — `if` / `else` выбирает по текущему состоянию" })), fmtCode(tr3({ uz: "Copilot: izoh yozasiz → taklifni `Tab` bilan qabul qilasiz", ru: "Copilot: пишете комментарий → принимаете подсказку клавишей `Tab`" })), fmtCode(tr3({ uz: "Shartni o'zingiz yozdingiz: `if (son === 10)`", ru: "Условие вы написали сами: `if (son === 10)`" })), tr3({ uz: "JavaScript alohida script.js faylida turadi", ru: "JavaScript находится в отдельном файле script.js" })];
  const HOMEWORK = [{ b: tr3({ uz: "Yana bitta vosita", ru: "Ещё один инструмент" }), t: tr3({ uz: "— 4-amaliyotda tanlamagan vositalardan birini Copilot yoki Gemini bilan qo'shing", ru: "— добавьте с Copilot или Gemini один из инструментов, которые не выбрали в практике 4" }) }, { b: tr3({ uz: "Saytni yangilang", ru: "Обновите сайт" }), t: tr3({ uz: "— Netlify'da saytingiz nomini bosing, Deploys bo'limini oching va papkani qayta sudrab tashlang", ru: "— в Netlify нажмите на имя сайта, откройте Deploys и снова перетащите папку" }) }, { b: tr3({ uz: "Havolani yuboring", ru: "Отправьте ссылку" }), t: tr3({ uz: "— platformadagi vazifa-savoliga", ru: "— в задание на платформе" }) }];
  const GLOSSARY = [{ b: tr3({ uz: "Interaktivlik", ru: "Интерактивность" }), t: tr3({ uz: "— saytning foydalanuvchiga javob berishi", ru: "— способность сайта отвечать пользователю" }) }, { b: tr3({ uz: "Hodisa (event)", ru: "Событие (event)" }), t: tr3({ uz: "— foydalanuvchi harakati (bosish, yozish)", ru: "— действие пользователя (клик, ввод)" }) }, { b: tr3({ uz: "Reaksiya", ru: "Реакция" }), t: tr3({ uz: "— ishga tushadigan JavaScript funksiyasi", ru: "— функция JavaScript, которая запускается" }) }, { b: "click", t: tr3({ uz: "— bosish hodisasi", ru: "— событие клика" }) }, { b: "input", t: tr3({ uz: "— yozish hodisasi", ru: "— событие ввода" }) }, { b: "hover", t: tr3({ uz: "— ustiga olib borish hodisasi", ru: "— событие наведения" }) }, { b: "Copilot", t: tr3({ uz: "— VS Code ichidagi AI: siz yozgan izohdan kod taklif qiladi", ru: "— AI внутри VS Code: предлагает код по вашему комментарию" }) }];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const [open, setOpen] = useState5(false);
  const glossRef = useRef5(null);
  const isNarrow = useIsMobile(768);
  const toggleGloss = () => setOpen((o) => {
    const nv = !o;
    if (nv && isNarrow) setTimeout(() => {
      if (glossRef.current) glossRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 80);
    return nv;
  });
  return <Stage eyebrow={tr3({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr3({ uz: "Qaytadan", ru: "Заново" })}</button><FinishBtn className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr3({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</FinishBtn></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr3({ uz: "1-praktika tugadi", ru: "Практика 1 завершена" })}</span><span className="score-chip fade-up">{correct}/{total} {tr3({ uz: "to'g'ri", ru: "верно" })}</span></div><h2 className="title h-title fade-up d1">{tr3({ uz: <>Statik saytni <span className="italic" style={{ color: T.accent }}>jonli</span> saytga aylantirdingiz</>, ru: <>Вы превратили статичный сайт в <span className="italic" style={{ color: T.accent }}>живой</span></> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr3({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0} />
        </div>
        {arena && <QuizArena live={isMentorL && arenaSolo ? { mode: "self" } : _live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: "50%", background: T.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> {tr3({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>)}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr3({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr3({ uz: "Saytingizni jonlantiring:", ru: "Оживите свой сайт:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>)}</ul><p className="hw-note">{tr3({ uz: <>Keyingi dars — <b>Praktika 2</b>: AI bilan tez sayt.</>, ru: <>Следующий урок — <b>Практика 2</b>: быстрый сайт с AI.</> })}</p></div>}
        {
    /* 🏠 UYGA VAZIFA — amaliy topshiriq kompilyatorda bajariladi. Mentor proyektorida
       KO'RSATILMAYDI: uy ishi shaxsiy (sahna ↔ daftar tamoyili). */
  }
        {!isMentorL && onHomework && <div className="hw-big-wrap fade-up d4">
            <button className="hw-big" onClick={onHomework}>
              <span className="hw-big-shine" aria-hidden="true" />
              <span className="hw-big-t">{tr3({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span>
              <span className="hw-big-s">{tr3({ uz: "Amaliy topshiriqni bajarish →", ru: "Выполнить практическое задание →" })}</span>
            </button>
          </div>}
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
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr3({ uz: "Kalit so'zlar (interaktivlik)", ru: "Ключевые слова (интерактивность)" })}</span><span className="gloss-toggle">{open ? "−" : "+"}</span></div>{open && <div className="gloss-body">{GLOSSARY.map((g, i) => <span key={i}><b>{g.b}</b> {g.t}{i < GLOSSARY.length - 1 ? " · " : ""}</span>)}</div>}</div>
      </div>
    </Stage>;
};
var Q_LABELS = { 5: { uz: "Tugmani jonlantirish", ru: "Оживить кнопку" } };
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
var INLINE_KEYS = { s15: 0 };
var ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState5([]);
  const [rows, setRows] = useState5([]);
  const [loaded2, setLoaded] = useState5(false);
  useEffect6(() => {
    if (!isLive || !livePin) return;
    let on2 = true, t = null;
    const tick = async () => {
      try {
        const [p, a] = await Promise.all([livePlayers(livePin), liveAnswers(livePin)]);
        if (on2) {
          setPlayers(p);
          setRows(a);
          setLoaded(true);
        }
      } catch {
      }
      if (on2) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on2 = false;
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
  return <Stage eyebrow={tr3({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head head-c"><h2 className="title h-title fade-up">{tr3({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr3({ uz: "Siz —", ru: "Вы —" })} <b>{myIdx + 1}-{tr3({ uz: "o'rin", ru: "е место" })}</b> ({board[myIdx].okCount}/{totalQ} {tr3({ uz: "to'g'ri", ru: "верно" })})</p>}
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
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr3({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntiring.", ru: "Вопросы с ⚠️ — темы, где класс затруднился. Объясните их ещё раз." })}</p>}
            </div>
          </>}
      </div>
    </Stage>;
};
var ACHIEVEMENTS = {
  coder: { icon: "💻", name: "Code It!", desc: { uz: "Saytingizga tungi rejim qo'shdingiz", ru: "Вы добавили на сайт ночной режим" } },
  logician: { icon: "🧩", name: "Nice Logic!", desc: { uz: "Like tugmasini Copilot bilan jonlantirdingiz", ru: "Вы оживили кнопку лайка с Copilot" } },
  spark: { icon: "⚡", name: "It's Alive!", desc: { uz: "Like tugmasiga shartni o'zingiz yozdingiz", ru: "Вы сами написали условие для лайка" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "Praktikani yakunladingiz", ru: "Вы завершили практику" } }
};
var BLOK_ACH = { a1: "coder", a2: "logician", a3: "spark" };
var ACH_TRIGGERS = {};
function AchCelebrate({ ach, onDone }) {
  useEffect6(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr3({ uz: "Yangi nishon", ru: "Новый значок" })}: ${ach.name}`}>
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
function AchCounter() {
  const earned = useContext2(AchCtx);
  const gate = useContext2(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef5(count);
  const [bump, setBump] = useState5(false);
  const [open, setOpen] = useState5(false);
  useEffect6(() => {
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
function MentorPracticeOverlay({ entry, live, onClose }) {
  const [view, setView] = useState5("watch");
  const [data, setData] = useState5({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect6(() => {
    let on2 = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, doneIdx)]);
        if (on2) setData({ players, rows });
      } catch {
      }
      if (on2) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on2 = false;
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
var TASK_LIKE = {
  eyebrow: { uz: "Praktika · Like", ru: "Практика · Like" },
  title: { uz: "Like tugmasini jonlantiring", ru: "Оживите кнопку Like" },
  brief: { uz: "HTML'da tugma `<button id=\"like\">Like</button>` va son uchun `<span id=\"son\">0</span>` yozing. JS faylida tugma bosilganda son 1 taga oshsin (`son = son + 1`). To'g'ri bo'lsa — bosilganda 0 → 1 bo'ladi.", ru: 'В HTML напишите кнопку `<button id="like">Like</button>` и `<span id="son">0</span>` для числа. В JS-файле: при нажатии кнопки число растёт на 1 (`son = son + 1`). Если всё верно — при нажатии 0 → 1.' },
  files: [
    { name: "index.html", lang: "html", starter: `<!-- Bu yerga yozing -->
` },
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "btn", label: { uz: '<button id="like"> tugma', ru: '<button id="like"> кнопка' }, check: checks.has("#like", { uz: '`<button id="like">Like</button>` qo\'shing', ru: 'Добавьте `<button id="like">Like</button>`' }) },
    { id: "son", label: { uz: '<span id="son">0</span> — son', ru: '<span id="son">0</span> — число' }, check: checks.has("#son", { uz: 'Son uchun `<span id="son">0</span>` qo\'shing', ru: 'Добавьте `<span id="son">0</span>` для числа' }) },
    { id: "click", label: { uz: "bosilganda son 1 ga oshadi", ru: "при нажатии число растёт на 1" }, check: checks.domAfterClick("#like", "#son", "1", { uz: "JS'da: bosilganda `son`ni +1 qilib, `son` matnini yangilang", ru: "В JS: при нажатии прибавьте к `son` +1 и обновите текст `son`" }) }
  ]
};
var TASK_TOGGLE = {
  eyebrow: { uz: "Praktika · Rejim", ru: "Практика · Режим" },
  title: { uz: "Rejim tugmasini yasang", ru: "Сделайте кнопку режима" },
  brief: { uz: "HTML'da `<button id=\"rejim\">Kunduz</button>` yozing. JS'da tugma bosilganda matn «Kunduz» va «Tun» orasida almashsin (if/else). 1-bosishda Tun, 2-bosishda yana Kunduz bo'lishi kerak.", ru: 'В HTML напишите `<button id="rejim">Kunduz</button>`. В JS: при нажатии текст переключается между «Kunduz» и «Tun» (if/else). После 1-го нажатия — Tun, после 2-го — снова Kunduz.' },
  files: [
    { name: "index.html", lang: "html", starter: `<!-- Bu yerga yozing -->
` },
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "btn", label: '<button id="rejim">Kunduz</button>', check: checks.has("#rejim", { uz: '`<button id="rejim">Kunduz</button>` qo\'shing', ru: 'Добавьте `<button id="rejim">Kunduz</button>`' }) },
    { id: "toggle", label: { uz: "Kunduz ⇄ Tun almashadi", ru: "Kunduz ⇄ Tun переключается" }, check: checks.toggle("#rejim", "#rejim", "Kunduz", "Tun", { uz: "JS'da: agar matn «Kunduz» bo'lsa «Tun»ga, aks holda «Kunduz»ga o'zgartiring", ru: "В JS: если текст «Kunduz» — поменяйте на «Tun», иначе — на «Kunduz»" }) }
  ]
};
var TASK_FORM = {
  eyebrow: { uz: "Praktika · Forma", ru: "Практика · Форма" },
  title: { uz: "Formani tekshiring (if/else)", ru: "Проверьте форму (if/else)" },
  brief: { uz: 'HTML\'da `<input id="ism">`, `<button id="yubor">Yuborish</button>` va xabar uchun `<span id="xabar"></span>` yozing. JS\'da: agar input bo\'sh bo\'lsa — «Ism kiriting» yozing, aks holda «Rahmat». Bo\'sh formada bosilsa «Ism kiriting» chiqadi.', ru: 'В HTML напишите `<input id="ism">`, `<button id="yubor">Yuborish</button>` и `<span id="xabar"></span>` для сообщения. В JS: если input пустой — выведите «Ism kiriting», иначе — «Rahmat». При пустой форме после нажатия появится «Ism kiriting».' },
  files: [
    { name: "index.html", lang: "html", starter: `<!-- Bu yerga yozing -->
` },
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "btn", label: { uz: '<button id="yubor"> tugma', ru: '<button id="yubor"> кнопка' }, check: checks.has("#yubor", { uz: '`<button id="yubor">Yuborish</button>` qo\'shing', ru: 'Добавьте `<button id="yubor">Yuborish</button>`' }) },
    { id: "ifelse", label: { uz: "if/else ishlatilgan", ru: "использован if/else" }, check: checks.js(/if\s*\(/, { uz: "Tekshiruv uchun `if (...)` sharti yozing", ru: "Напишите условие `if (...)` для проверки" }) },
    { id: "check", label: { uz: "bo'sh formada «Ism kiriting»", ru: "при пустой форме — «Ism kiriting»" }, check: checks.domAfterClick("#yubor", "#xabar", "kiriting", { uz: "JS'da: agar `ism` qiymati bo'sh bo'lsa `xabar`ga «Ism kiriting» yozing", ru: "В JS: если значение `ism` пустое, выведите в `xabar` текст «Ism kiriting»" }) }
  ]
};
var PRACTICE_AFTER = {};
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "onclick", l: 6, t: 18, s: 30, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: "click", l: 82, t: 12, s: 26, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: "son=0", l: 9, t: 74, s: 30, c: "rgba(255,110,70,0.15)", d: 27, dl: 0.8 },
  { ch: "input", l: 76, t: 70, s: 26, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: "if/else", l: 46, t: 86, s: 28, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "hover", l: 66, t: 24, s: 22, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: "son+1", l: 22, t: 36, s: 22, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "toggle", l: 92, t: 46, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: "event", l: 2, t: 46, s: 24, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "HTML va CSS saytga nima beradi?", ru: "Что дают сайту HTML и CSS?" }, opts: [{ uz: "Tashqi ko'rinish", ru: "Внешний вид" }, { uz: "Jonlilik va reaksiya", ru: "Живость и реакции" }, { uz: "Internet tezligi", ru: "Скорость интернета" }, { uz: "Ma'lumotlar bazasi", ru: "Базу данных" }], correct: 0 },
  { q: { uz: "Saytga jon (interaktivlik) kiritadigan til qaysi?", ru: "Какой язык вдыхает в сайт жизнь (интерактивность)?" }, opts: ["HTML", "CSS", "JavaScript", "Word"], correct: 2 },
  { q: { uz: "«Hodisa» (event) nima?", ru: "Что такое «событие» (event)?" }, opts: [{ uz: "Saytning tashqi rangi", ru: "Внешний цвет сайта" }, { uz: "Yuklangan fayl nomi", ru: "Имя загруженного файла" }, { uz: "Internet ulanish tezligi", ru: "Скорость интернет-соединения" }, { uz: "Foydalanuvchining harakati", ru: "Действие пользователя" }], correct: 3 },
  { q: { uz: "Jonlantirishning to'g'ri ketma-ketligi qaysi?", ru: "Какова правильная последовательность оживления?" }, opts: [{ uz: "O'zgarish → Hodisa → Reaksiya", ru: "Изменение → Событие → Реакция" }, { uz: "Hodisa → Reaksiya → O'zgarish", ru: "Событие → Реакция → Изменение" }, { uz: "Reaksiya → Hodisa → O'zgarish", ru: "Реакция → Событие → Изменение" }, { uz: "Faqat o'zgarish", ru: "Только изменение" }], correct: 1 },
  { q: { uz: "Tugmani bosish qaysi hodisaga misol?", ru: "Нажатие кнопки — пример какого события?" }, opts: ["input", "hover", "click", "scroll"], correct: 2 },
  { q: { uz: "Matn maydoniga yozish qaysi hodisa?", ru: "Ввод в текстовое поле — какое событие?" }, opts: ["input", "click", "hover", "load"], correct: 0 },
  { q: { uz: "son = 0 bo'lsa, tugma 3 marta bosilsa (son = son + 1) natija?", ru: "son = 0; кнопку нажали 3 раза (son = son + 1) — результат?" }, opts: ["0", "1", "3", "33"], correct: 2 },
  { q: { uz: "Sayt nechta like borligini nimada eslab qoladi?", ru: "Где сайт запоминает, сколько лайков?" }, opts: [{ uz: "Rasm faylida", ru: "В файле картинки" }, { uz: "URL manzilda", ru: "В URL-адресе" }, { uz: "CSS faylida", ru: "В CSS-файле" }, { uz: "O'zgaruvchida", ru: "В переменной" }], correct: 3 },
  { q: { uz: "Tungi/kunduzgi rejim tugmasi asosan nimani o'zgartiradi?", ru: "Что в основном меняет кнопка ночного/дневного режима?" }, opts: [{ uz: "Internet tezligini", ru: "Скорость интернета" }, { uz: "Ranglar va mavzuni", ru: "Цвета и тему" }, { uz: "Fayl nomlarini", ru: "Имена файлов" }, { uz: "Server manzilini", ru: "Адрес сервера" }], correct: 1 },
  { q: { uz: "«Ko'rsat / yashir» tugmasi nimani boshqaradi?", ru: "Чем управляет кнопка «показать / скрыть»?" }, opts: [{ uz: "Element ko'rinishini", ru: "Видимостью элемента" }, { uz: "Internet ulanishini", ru: "Интернет-соединением" }, { uz: "Shriftni yuklashni", ru: "Загрузкой шрифта" }, { uz: "Domen manzilini", ru: "Адресом домена" }], correct: 0 },
  { q: { uz: "Forma tekshiruvida bo'sh maydon uchun nima ishlatiladi?", ru: "Что используется для проверки пустого поля в форме?" }, opts: [{ uz: "Rang o'zgarishi", ru: "Смена цвета" }, { uz: "if/else sharti", ru: "Условие if/else" }, { uz: "Rasm qo'shish", ru: "Добавление картинки" }, { uz: "Video ijrosi", ru: "Воспроизведение видео" }], correct: 1 },
  { q: { uz: "«Jonli salom» — ism yozilganda o'zgarishi uchun kerak bo'lgan hodisa?", ru: "«Живое приветствие» — какое событие нужно, чтобы оно менялось при вводе имени?" }, opts: ["click", { uz: "hech qaysi", ru: "никакое" }, "hover", "input"], correct: 3 }
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
  const [charge, setCharge] = useState5(false);
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
  const ref = useRef5(null);
  useEffect6(() => {
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
    const TOK = ["onclick", "let", "() =>", "click", "if", "true", "{ }", ";"];
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
  const [soloMode, setSoloMode] = useState5(!!startSolo);
  const solo = soloMode || !isMentor && !isStudent;
  const soloRef = useRef5(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState5("lobby");
  const [qi, setQi] = useState5(-1);
  const [remaining, setRemaining] = useState5(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState5({});
  const [players, setPlayers] = useState5([]);
  const [qRows, setQRows] = useState5([]);
  const [answeredN, setAnsweredN] = useState5(0);
  const [classEnded, setClassEnded] = useState5(false);
  const seenQRef = useRef5(-1);
  const qStartRef = useRef5(0);
  const deadlineRef = useRef5(0);
  const phaseRef = useRef5(phase);
  phaseRef.current = phase;
  useEffect6(() => {
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
  useEffect6(() => {
    if (soloRef.current) return;
    let on2 = true, t = null;
    const tick = async () => {
      if (soloRef.current) return;
      try {
        const row = await liveGet(live.pin);
        if (!on2) return;
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
        if (on2) setClassEnded(!row || row.status === "ended");
        if (ph === "lobby" || ph === "reveal" || ph === "done" || phaseRef.current === "reveal") {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on2) {
            setPlayers(pl);
            setQRows(qa);
          }
        } else if (ph === "q" && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on2) {
            setPlayers(pl);
            setAnsweredN(qa.length);
          }
        }
      } catch {
      }
      if (on2) t = setTimeout(tick, 1200);
    };
    tick();
    return () => {
      on2 = false;
      clearTimeout(t);
    };
  }, []);
  useEffect6(() => {
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
  const autoNext = useAutoNext({
    on: phase === "reveal" && isMentor && !solo && !lastQ,
    onFire: () => ctrl("q", qi + 1),
    qKey: qi
  });
  const my = qi >= 0 ? myAnswers[qi] : null;
  const closeArena = () => {
    if (isMentor && !solo && phase !== "done") {
      if (!window.confirm(tr3({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nПотом можно вернуться в это же место через «⚔️ Продолжить».\n\nВсё равно закрыть?" }))) return;
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
          <span>{tr3({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест сами:" })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr3({ uz: "Mashq rejimida davom etish", ru: "Продолжить в режиме тренировки" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr3({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее правильный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!" })}</p>
          {solo && isStudent && <p className="qz-sub" style={{ color: "#FFC94D" }}>{tr3({ uz: "📖 Mashq rejimi — o'z tezligingizda ishlaysiz, natija faqat sizga ko'rinadi.", ru: "📖 Режим тренировки — работаете в своём темпе, результат виден только вам." })}</p>}
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr3({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>▶ {tr3({ uz: "Testni boshlash", ru: "Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr3({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Ждите, пока ментор начнёт тест…" })}</p>}
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
          {my && !isMentor && !solo && <p className="qz-waitmsg">{tr3({ uz: "✔ Javob qabul qilindi — natijani kuting…", ru: "✔ Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr3({ uz: "✓ Hamma javob berdi!", ru: "✓ Все ответили!" })}</span>}
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr3({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr3({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr3({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Быстрее! ⏱" })}</span>}
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : autoNext.fireNow()}>{lastQ ? tr3({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr3({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr3({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: "Остановить авто-переход — чтобы объяснить ответ (до конца арены)" })}>{autoNext.auto ? `${tr3({ uz: "To'xtatish", ru: "Пауза" })}${autoNext.sec ? ` · ${autoNext.sec}` : ""}` : tr3({ uz: "▶ Avto", ru: "▶ Авто" })}</button>}
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
              <p className="qz-sub">{tr3({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr3({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? ` · ${tr3({ uz: "eng uzun streak", ru: "лучшая серия" })} 🔥x${soloScore.maxStreak}` : ""}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr3({ uz: "Siz —", ru: "Вы —" })} <b>{myRank + 1}-{tr3({ uz: "o'rin", ru: "е место" })}</b> · {board[myRank].pts} {tr3({ uz: "ball", ru: "баллов" })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr3({ uz: "Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "Пройти тест ещё раз — тренировка (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr3({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
function PracticeLesson1({ lang: langProp, onFinished, onPractice, liveToken }) {
  const lang = langProp || "uz";
  __lang2 = lang;
  setLiveLang(lang);
  const savedRef = useRef5(void 0);
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
  const [screen, setScreen] = useState5(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [maxReached, setMaxReached] = useState5(() => saved ? Math.max(saved.maxReached || 0, saved.screen || 0) : 0);
  const [answers, setAnswers] = useState5(() => saved && saved.answers || {});
  const [practice, setPractice] = useState5(null);
  const [mentorPractice, setMentorPractice] = useState5(null);
  const startTimeRef = useRef5(saved?.startedAt || Date.now());
  const firstPassRef = useRef5(saved?.firstPass || null);
  const soloSentRef = useRef5(/* @__PURE__ */ new Set());
  const [fpPractice, setFpPractice] = useState5(!!saved?.firstPass);
  const earnedRef = useRef5(new Set(saved?.earned || []));
  const [earned, setEarned] = useState5(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState5([]);
  const achKeyRef = useRef5(0);
  const earn = useCallback3((id) => {
    if (firstPassRef.current) return;
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  const missedRef = useRef5(new Set(saved?.missed || []));
  const [missed, setMissed] = useState5(() => new Set(saved?.missed || []));
  const missTry = useCallback3((idx) => {
    const sid = SCREEN_META[idx] && SCREEN_META[idx].id;
    const ach = ACH_TRIGGERS[sid];
    if (!sid || missedRef.current.has(sid) || ach && earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo2(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  useEffect6(() => {
    const upd = () => {
      const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1e3)));
      document.documentElement.style.setProperty("--lz", String(Math.round(z * 1e3) / 1e3));
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  useEffect6(() => {
    setMaxReached((m) => screen === 0 && !Object.keys(answers || {}).length ? 0 : Math.max(m, screen));
  }, [screen, answers]);
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
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
      earn("coder");
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
    const entry = { task: TASK_FORM, starter: "" };
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
  useEffect6(() => {
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
    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id];
    if (blokAch && live.mode !== "mentor") earn(blokAch);
    const entry = PRACTICE_AFTER[screen];
    if (!entry) {
      advance();
      return;
    }
    if (!(live && (live.mode === "mentor" || live.mode === "student" && live.status !== "ended"))) {
      advance();
      return;
    }
    if (live && live.mode === "mentor") {
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
    if (_m && _m.scored && live.mode === "solo" && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) {
        soloSentRef.current.add(idx);
        live.submitAnswer(idx, _m.id, key < 0 ? 0 : data.correct ? key : key === 0 ? 1 : 0, !!data.correct, data.elapsedMs || 0);
      }
    }
    if (_m && _m.scored && _m.scope === "final" && data && data.solved && live.mode === "student") live.submitAnswer(idx, _m.id, data.picked === 1 ? 1 : 0, !!data.correct, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => {
    if (!firstPassRef.current) {
      firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1e3) };
      setFpPractice(true);
    }
    progClear(LESSON_META.lessonId);
    pracClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    setPractice(null);
    setMentorPractice(null);
    startTimeRef.current = Date.now();
  };
  useEffect6(() => {
    progWrite(LESSON_META.lessonId, { screen, maxReached, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);
  useEffect6(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  useEffect6(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen]);
  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const fp = firstPassRef.current;
    const ans = fp ? fp.answers : answers;
    const scoredMeta = SCREEN_META.filter((s) => s.scored);
    const finalMeta = scoredMeta.filter((s) => s.scope === "final");
    const scoredAnswers = SCREEN_META.map((s, i) => s.scored ? ans[i] : null).filter(Boolean);
    const correctAnswers = scoredAnswers.filter((a) => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => s.scored && s.scope === "final" ? ans[i] : null).filter(Boolean);
    const finalCorrect = finalAnswers.filter((a) => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null,
      livePin: live.pin || null,
      liveMode: live.mode,
      durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1e3),
      totalQuestions: scoredMeta.length,
      correctAnswers,
      scorePercent: scoredMeta.length ? Math.round(correctAnswers / scoredMeta.length * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false,
      answers: SCREEN_META.map((_, i) => ans[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers: ans, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === "function") onFinished(sealPayload(LESSON_META.lessonId, payload));
  };
  const screens = [Screen0, Screen1, ScreenTungi, ScreenLike, ScreenTabrik, Screen15, ScreenVosita, ScreenPodium, Screen16];
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
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .zoomable { position: relative; }
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band) */
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
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
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
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}; } /* F-0926-06: baland rang -> soft + halqa (159/10) */

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

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
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
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        @media (min-width: 761px) { .split:has(> .col > .flow-label:first-child) > .col:not(:has(> .flow-label:first-child))::before { content: "."; visibility: hidden; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; } } /* F-1015-371: ikki ustun bloklari bir chiziqdan boshlanadi */
        .num-badge { width: 30px; height: 30px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 14px; flex-shrink: 0; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }

        /* === CODEBOX === */
        .codebox { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.6vw,14.5px); color: ${CODE.text}; line-height: 1.75; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow-x: hidden; }
        .codebox > div { white-space: pre-wrap; word-break: break-word; }

        /* === TAGPILL / AI CARD === */
        .tagpill { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }

        /* === BROWSER / SAYT PREVIEW === */
        .browser { background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.22); border: 1px solid rgba(167,166,162,0.25); }
        .browser-bar { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: #ECEAE4; }
        .browser-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .browser-url { margin-left: 8px; flex: 1; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink3}; background: ${T.paper}; border-radius: 6px; padding: 4px 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .browser-body { padding: clamp(15px,2.6vw,22px); min-height: 150px; background: ${T.paper}; color: ${T.ink}; transition: background .35s ease, color .35s ease; }
        .browser-dark .browser-bar { background: #11151C; }
        .browser-dark .browser-body { background: #161E2B; color: #E8E5DD; }
        .browser-dark .browser-url { background: #0E141D; color: #7A8699; }

        /* === MINI-SAYT === */
        .site-card { display: flex; flex-direction: column; gap: 13px; align-items: flex-start; }
        .site-ava { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, ${T.accent}, #FF9B7D); display: flex; align-items: center; justify-content: center; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 24px; color: #fff; flex-shrink: 0; text-transform: uppercase; }
        .site-name { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px,2.4vw,21px); }
        .site-btn { font-family: 'Manrope'; font-weight: 600; font-size: 14px; border: none; border-radius: 10px; padding: 9px 16px; cursor: pointer; background: ${T.accent}; color: #fff; transition: all .18s; } /* F-0926-06: qora tugma -> accent (159/5), inline T.ink ham accent bo'ldi */
        .site-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .site-btn:disabled { cursor: not-allowed; }
        .site-like { display: inline-flex; align-items: center; gap: 8px; background: ${T.accentSoft}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 16px; font-family: 'Manrope'; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .15s; }
        .site-like:active { transform: scale(.94); }
        .shake { animation: shake .36s ease; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

        /* === FLOW (Hodisa->Reaksiya->O'zgarish) === */
        .flow { display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; }
        .flow-node { display: flex; align-items: center; gap: 5px; background: ${T.paper}; border-radius: 9px; padding: 6px 9px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink2}; transition: all .25s; opacity: .45; white-space: nowrap; }
        .flow-node.on { opacity: 1; background: ${T.accent}; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px -6px rgba(255,79,40,0.4); }
        .flow-node .flow-n { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: rgba(167,166,162,0.3); font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 9.5px; flex-shrink: 0; }
        .flow-node.on .flow-n { background: rgba(255,255,255,0.3); }
        .flow-arrow { color: ${T.ink3}; font-size: 13px; }

        /* === EVENT KARTALAR === */
        .evt-card { display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer; border: none; border-radius: 12px; padding: 13px 15px; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all .18s; width: 100%; }
        .evt-card:hover { transform: translateY(-1px); }
        .evt-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22); }
        .evt-card .evt-name { font-family: 'Manrope'; font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .evt-card .evt-hint { font-size: 12px; color: ${T.ink2}; }

        /* === IWATCH === */
        .iwatch { display: flex; align-items: baseline; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .iwatch-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .iwatch-eq { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 18px; color: ${T.ink2}; }
        .iwatch-num { font-family: 'Fraunces', serif; font-size: clamp(34px,7vw,52px); color: ${T.accent}; line-height: 1; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
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

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== QO'SHIMCHA ANIMATSIYALAR (v16 yaxshilash) ===== */
        @keyframes floatplus { 0%{opacity:1; transform:translate(-50%,0) scale(1);} 100%{opacity:0; transform:translate(-50%,-28px) scale(1.35);} }
        .float-plus { position:absolute; left:50%; top:-8px; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight:800; font-size:16px; color:${T.accent}; pointer-events:none; animation: floatplus 0.7s ease-out forwards; }
        @keyframes popnum { 0%{transform:scale(0.55);} 55%{transform:scale(1.28);} 100%{transform:scale(1);} }
        .pop-num { display:inline-block; animation: popnum 0.35s cubic-bezier(.34,1.4,.4,1); }
        @keyframes glowpulse { 0%,100%{box-shadow:0 0 0 0 rgba(31,122,77,0.55);} 50%{box-shadow:0 0 0 9px rgba(31,122,77,0);} }
        .glow-btn { animation: glowpulse 1.2s ease-in-out infinite; }
        @keyframes livedot { 0%,100%{box-shadow:0 0 0 0 rgba(255,79,40,0.55);} 50%{box-shadow:0 0 0 7px rgba(255,79,40,0);} }
        .live-dot { animation: livedot 1.3s ease-in-out infinite; }
        .ex-row { animation: el-pop 0.32s ease-out both; }
        @keyframes codeglow-ok { from{background:rgba(31,122,77,0);} to{background:rgba(31,122,77,0.2);} }
        @keyframes codeglow-bad { from{background:rgba(255,79,40,0);} to{background:rgba(255,79,40,0.18);} }
        .ck-line { display:flex; align-items:center; gap:9px; border-radius:10px; padding:9px 13px; font-size:13px; transition:all .3s; }

        /* === MOBIL POLISH (zichroq, toza, gorizontal toshmasin) === */
        @media (max-width: 640px) {
          .stage-content { padding-bottom: clamp(14px,3vw,22px); }
          .screen { gap: 13px; }
          .browser-body { min-height: 84px; padding: 14px 15px; }
          .codebox { font-size: 12.5px; line-height: 1.6; padding: 12px 13px; }
          .mentor-msg { padding: 11px 14px; }
          .site-ava { width: 46px; height: 46px; font-size: 21px; }
          .frame { padding: 15px 16px; }
          .split { gap: 14px; }
          .flow { gap: 4px; }
          .flow-node { padding: 6px 8px; }
        }

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
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
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
        .mstats-verdict.need { background: ${T.accentSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.successSoft}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); }
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
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
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

        /* ===== ✍️ MENTOR PRAKTIKA OVERLAY ===== */
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
        .mp-demo { flex: 1; min-width: 200px; padding: 14px 20px; border: none; border-radius: 14px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s; } /* F-0926-06: qora tugma → accent (159/5) */
        .mp-demo:hover { transform: translateY(-2px); }
        .mp-next { flex: 1; min-width: 160px; padding: 14px 20px; border: 1.5px solid rgba(${T.shadowBase},0.16); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .mp-next:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .mp-tip { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink3}; }
        /* ===== 🃏 FLASHCARDS ===== */
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
        /* === ⚔️ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #1D1145, #35206B); border-radius: 18px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 14px 36px -14px rgba(29,17,69,0.55); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #fff; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: rgba(255,255,255,0.72); }
        .qz-cta-btn { background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 8px 22px -8px rgba(255,79,40,0.7); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: rgba(255,255,255,0.14); color: rgba(255,255,255,0.55); cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 8px 22px -8px rgba(255,79,40,0.7); } 50% { transform: scale(1.06); box-shadow: 0 10px 30px -6px rgba(255,79,40,0.95); } }

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

        /* === ⚔️ ARENA — to'liq ekran, tiniq qorong'u muhit === */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px);
          background:
            radial-gradient(120% 85% at 50% -18%, rgba(88,58,200,0.55) 0%, rgba(88,58,200,0) 55%),
            radial-gradient(70% 60% at 108% 112%, rgba(196,37,126,0.30) 0%, rgba(196,37,126,0) 60%),
            radial-gradient(55% 45% at -8% 108%, rgba(19,104,206,0.28) 0%, rgba(19,104,206,0) 60%),
            linear-gradient(168deg, #241560 0%, #170F3D 52%, #0D0826 100%);
        }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; animation: qz-drift ease-in-out infinite; text-shadow: 0 0 34px currentColor; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-7deg) scale(1); } 50% { transform: translate(22px,-28px) rotate(9deg) scale(1.07); } }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.12); color: #fff; font-size: 16px; cursor: pointer; transition: background 0.2s; }
        .qz-x:hover { background: rgba(255,255,255,0.25); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 780px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,4.4vw,40px); color: #fff; margin: 0; text-align: center; letter-spacing: -0.02em; }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: rgba(255,255,255,0.75); margin: 0; text-align: center; max-width: 560px; line-height: 1.55; }
        .qz-dimtxt { color: rgba(255,255,255,0.5); font-family: 'Manrope'; font-size: 14px; font-style: italic; }
        .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
        .qz-pchip { background: rgba(255,255,255,0.12); color: #fff; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .qz-pchip.me { background: ${T.accent}; }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -8px rgba(255,79,40,0.65); transition: transform 0.18s; }
        .qz-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .qz-btn:disabled { opacity: 0.45; cursor: default; }
        .qz-btn.big { font-size: clamp(16px,2.2vw,19px); padding: clamp(14px,2vw,17px) clamp(30px,4vw,44px); }
        .qz-btn.ghost { background: rgba(255,255,255,0.12); box-shadow: none; }
        .qz-waitmsg { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 14.5px; color: #2BD97C; text-align: center; }
        .qz-qview { max-width: 860px; }
        .qz-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .qz-count { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: rgba(255,255,255,0.75); }
        .qz-count b { color: #fff; font-size: 1.25em; }
        .qz-ansn { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.8vw,16px); color: #FFC94D; min-width: 64px; text-align: right; }
        .qz-timer { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .qz-timer-n { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
        .qz-timer.urgent { animation: qz-shake 0.5s ease-in-out infinite; }
        @keyframes qz-shake { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #fff; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.07); border-radius: 18px; padding: clamp(16px,2.6vw,24px) clamp(18px,3vw,30px); width: 100%; }
        .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,1.6vw,14px); width: 100%; }
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
        .qz-tile { position: relative; display: flex; align-items: center; gap: 12px; border: none; border-radius: 16px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 64px; box-shadow: 0 10px 26px -10px rgba(0,0,0,0.55); transition: transform 0.16s, opacity 0.3s, box-shadow 0.16s; }
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px) scale(1.015); box-shadow: 0 16px 34px -10px rgba(0,0,0,0.6); }
        .qz-tile:disabled { cursor: default; }
        .qz-shape { font-size: clamp(17px,2.4vw,22px); color: rgba(255,255,255,0.9); flex-shrink: 0; }
        .qz-opt { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; }
        .qz-tile.faded { opacity: 0.28; }
        .qz-tile.picked { outline: 3px solid #fff; animation: qz-pop 0.3s; }
        .qz-pbadge { position: absolute; top: -9px; right: -7px; width: 26px; height: 26px; border-radius: 50%; background: #fff; color: #17103B; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); }
        .qz-tile.rv.win { outline: 4px solid #2BD97C; box-shadow: 0 0 34px rgba(43,217,124,0.55); animation: qz-pop 0.4s; }
        .qz-tile.rv.lose { opacity: 0.3; }
        .qz-cnt { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.2vw,19px); color: #fff; background: rgba(0,0,0,0.28); border-radius: 99px; padding: 4px 13px; flex-shrink: 0; }
        .qz-mrow { display: flex; align-items: center; gap: 14px; }
        .qz-allin { font-family: 'Manrope'; font-weight: 700; font-size: 15px; color: #2BD97C; animation: qz-pop 0.4s; }
        .qz-res { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; justify-content: center; border-radius: 16px; padding: 14px 26px; animation: qz-pop 0.45s cubic-bezier(.34,1.5,.4,1); }
        .qz-res.good { background: rgba(43,217,124,0.16); outline: 1.5px solid rgba(43,217,124,0.5); }
        .qz-res.bad { background: rgba(255,90,90,0.14); outline: 1.5px solid rgba(255,90,90,0.4); }
        .qz-res-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,4.4vw,40px); color: #2BD97C; line-height: 1; }
        .qz-res-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #fff; }
        .qz-res-rank { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: rgba(255,255,255,0.7); width: 100%; text-align: center; }
        .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.07); border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; }
        .qz-board.wide { max-width: 640px; max-height: 260px; overflow: auto; }
        .qz-board-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.1em; color: #FFC94D; margin-bottom: 3px; }
        .qz-brow { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 10px; background: rgba(255,255,255,0.05); }
        .qz-brow.me { background: linear-gradient(90deg,rgba(43,217,124,0.26),rgba(43,217,124,0.06)); outline: 1.5px solid rgba(43,217,124,0.55); }
        .qz-brow.me .qz-brank { background: #2BD97C; color: #0B2417; }
        .qz-brank { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: rgba(255,255,255,0.55); min-width: 20px; }
        .qz-bname { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-bstreak { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: #FFC94D; }
        .qz-bok { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: rgba(255,255,255,0.6); }
        .qz-bpts { font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: #FFC94D; min-width: 52px; text-align: right; }
        .qz-pod { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2.4vw,24px); padding-top: 18px; }
        .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
        .qz-crown { position: absolute; top: -30px; font-size: 28px; animation: qz-float-sm 2s ease-in-out infinite; }
        @keyframes qz-float-sm { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .qz-pod-medal { font-size: clamp(30px,5vw,46px); line-height: 1; }
        .qz-pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,2vw,18px); color: #fff; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-pod-pts { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.5vw,13px); color: rgba(255,255,255,0.72); }
        .qz-pod-bar { width: 100%; border-radius: 12px 12px 0 0; animation: qz-rise 0.9s cubic-bezier(.3,1.2,.4,1); transform-origin: bottom; }
        @keyframes qz-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .qz-pod-col.p1 .qz-pod-bar { height: clamp(90px,14vw,150px); background: linear-gradient(180deg, #FFD34D, #E8A13A); box-shadow: 0 0 44px rgba(255,211,77,0.4); }
        .qz-pod-col.p2 .qz-pod-bar { height: clamp(62px,10vw,104px); background: linear-gradient(180deg, #D8DCE8, #9AA2B8); }
        .qz-pod-col.p3 .qz-pod-bar { height: clamp(44px,7vw,74px); background: linear-gradient(180deg, #D89A5C, #A9682F); }
        .qz-pod-col.me .qz-pod-name { color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: rgba(255,255,255,0.85); }
        .qz-mypl b { color: #3CE88E; }
        .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FFC94D; text-shadow: 0 8px 34px rgba(255,201,77,0.4); }
        .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; padding: 10px 16px; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; backdrop-filter: blur(6px); }

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
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
        /* Jonli-badge — sekundar UI, kerak bo'lguncha xira (11.15) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        /* ===== F-1015-303/309 · praktika qolipi: amaliyot bloklari va DemoSahifa (izohda backtick yo'q) ===== */
        .am-karta { background: ${T.paper}; border-radius: 14px; padding: clamp(12px,1.8vw,16px) clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .lesson-root .am-band { margin: 0; padding-left: 20px; list-style: disc outside; display: flex; flex-direction: column; gap: 5px; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-masalan { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.35vw,13px); line-height: 1.6; border-radius: 10px; padding: 12px 14px; white-space: pre-wrap; word-break: break-word; }
        .am-qadam { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-qn { flex: none; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .am-osti { margin: 0; color: ${T.ink2}; line-height: 1.5; }
        .lesson-root .am-hw { margin: 0 0 6px; padding-left: 22px; list-style: decimal outside; display: flex; flex-direction: column; gap: 6px; color: ${T.ink}; }
        .am-uslub { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .am-uslub-btn { display: flex; flex-direction: column; gap: 2px; text-align: left; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; cursor: pointer; }
        .am-uslub-btn span { font-size: 12.5px; color: ${T.ink2}; }
        .am-uslub-btn.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}; }
        .am-javob-joy { min-height: 104px; }
        .am-nusxa { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 16px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-nusxa:hover { background: ${T.accentSoft}; }
        .am-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .am-tayyor { background: ${T.paper}; border: 1.5px solid rgba(255,79,40,0.35); border-radius: 16px; padding: clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 10px 24px -10px rgba(255,79,40,0.35); }
        .am-tayyor-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,2vw,19px); color: ${T.ink}; }
        .lesson-root .am-tayyor-l { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .am-tayyor-l li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; }
        .am-tayyor-n { flex: none; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .am-tayyor-s { margin: 0; font-size: 13px; color: ${T.ink2}; }
        .am-maydon { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: ${T.ink}; }
        .am-input { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .am-input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .am-input:hover { border-color: #cfcabe; }
        .am-input:focus { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .am-saqla { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 18px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-saqla:hover:not(:disabled) { background: ${T.accentSoft}; }
        .am-saqla:disabled { border-color: ${T.line}; color: ${T.ink2}; cursor: default; }
        .am-loyiha-nom { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 18px; color: ${T.ink}; }
        .am-soni { font: 700 12px 'Manrope', sans-serif; color: ${T.success}; background: ${T.successSoft}; border-radius: 999px; padding: 3px 10px; }
        .am-tayyor-ok { margin: 0; font-weight: 700; color: ${T.success}; font-size: 14px; }
        .am-ochil { animation: am-ochil 0.45s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes am-ochil { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .am-ochil { animation: none; } }
        .ds { border-radius: 12px; overflow: hidden; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; background: #fff; }
        .ds-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .ds-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ds-body { --ds-bg: #fff; --ds-ink: #16181d; --ds-mut: #4b5563; --ds-acc: #d4380d; --ds-acc-ink: #fff; --ds-card: #fff; --ds-line: #e8e8e8; --ds-hd: #fff; --ds-hd-ink: #16181d; --ds-hero: linear-gradient(135deg, #f8fafc, #fff1ec); --ds-bub: #fdeee9; --ds-h1: #16181d; --ds-ill: #fff; background: var(--ds-bg); color: var(--ds-ink); }
        .ds-hd { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--ds-hd); color: var(--ds-hd-ink); font-size: 11.5px; border-bottom: 1px solid var(--ds-line); }
        .ds-logo { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; margin-right: auto; }
        .ds-mark { width: 14px; height: 14px; border-radius: 4px; background: var(--ds-acc); display: inline-block; }
        .ds-nav { display: flex; gap: 12px; opacity: 0.9; }
        .ds-cta { background: var(--ds-acc); color: var(--ds-acc-ink); font-weight: 700; padding: 4px 11px; border-radius: 999px; }
        .ds-hero { display: flex; gap: 14px; align-items: center; padding: 20px 16px; background: var(--ds-hero); flex-wrap: wrap; }
        .ds-hero-t { flex: 1 1 170px; min-width: 0; }
        @media (max-width: 520px) { .ds-svg { flex-basis: 100%; max-width: 290px; } }
        .lesson-root .ds-tag { display: inline-block; margin: 0 0 8px; padding: 3px 9px; border-radius: 999px; background: var(--ds-ill); font-size: 10px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-acc); }
        .lesson-root .ds-h1 { margin: 0 0 8px; font-size: 20px; font-weight: 800; line-height: 1.15; color: var(--ds-h1); }
        .ds-p { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--ds-mut); }
        .ds-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .ds-tugma { background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 11.5px; font-weight: 700; padding: 7px 14px; border-radius: 999px; }
        .ds-tugma2 { border: 1.5px solid var(--ds-acc); color: var(--ds-acc); background: var(--ds-ill); font-size: 11.5px; font-weight: 700; padding: 6px 13px; border-radius: 999px; }
        .ds-svg { flex: 0 1 46%; min-width: 150px; max-width: 270px; height: auto; margin: 0 auto; display: block;
          --il-b1: #fed7c7; --il-b2: #e0e7ff; --il-b3: #fde68a; --il-phone: #1e293b; --il-screen: #fff; --il-notch: #cbd5e1; --il-r1: #f8fafc; --il-r2: #fff7ed; --il-r3: #f0fdf4;
          --il-ink: #0f172a; --il-mut: #475569; --il-c: #fff; --il-cl: #e2e8f0; --il-robot: #2563eb; --il-eye: #fff; --il-chess: #0f172a; --il-ball: #16a34a; }
        .ds-svg .il-b1 { fill: var(--il-b1); fill-opacity: 0.75; } .ds-svg .il-b2 { fill: var(--il-b2); fill-opacity: 0.85; } .ds-svg .il-b3 { fill: var(--il-b3); fill-opacity: 0.8; }
        .ds-svg .il-phone { fill: var(--il-phone); } .ds-svg .il-screen { fill: var(--il-screen); } .ds-svg .il-notch { fill: var(--il-notch); }
        .ds-svg .il-bar { fill: var(--ds-acc); } .ds-svg .il-bar-t { fill: var(--ds-acc-ink); font-size: 9px; font-weight: 800; font-family: 'Manrope', Arial, sans-serif; }
        .ds-svg .il-r1 { fill: var(--il-r1); } .ds-svg .il-r2 { fill: var(--il-r2); } .ds-svg .il-r3 { fill: var(--il-r3); }
        .ds-svg .il-t { fill: var(--il-ink); font-size: 8.5px; font-weight: 800; font-family: 'Manrope', Arial, sans-serif; } .ds-svg .il-v { fill: var(--il-mut); font-size: 7.5px; font-family: 'Manrope', Arial, sans-serif; }
        .ds-svg .il-c { fill: var(--il-c); stroke: var(--il-cl); } .ds-svg .il-robot { fill: var(--il-robot); } .ds-svg .il-eye { fill: var(--il-eye); }
        .ds-svg .il-chess { fill: var(--il-chess); } .ds-svg .il-ball { fill: var(--il-ball); } .ds-svg .il-ball-o { fill: var(--il-c); stroke: var(--il-ball); stroke-width: 2.5; }
        .ds-yorqin .ds-svg { --il-b1: #fdba74; --il-b2: #bfdbfe; --il-b3: #fde047; --il-r1: #eff6ff; --il-r2: #fffbeb; --il-r3: #f0fdf4; }
        .ds-qorongi .ds-svg { --il-b1: #134e4a; --il-b2: #1e3a8a; --il-b3: #065f46; --il-phone: #020617; --il-screen: #1e293b; --il-notch: #334155; --il-r1: #0f172a; --il-r2: #0f172a; --il-r3: #0f172a;
          --il-ink: #f1f5f9; --il-mut: #cbd5e1; --il-c: #1e293b; --il-cl: #334155; --il-robot: #34d399; --il-eye: #0f172a; --il-chess: #f1f5f9; --il-ball: #34d399; }
        .ds-gradient .ds-svg { --il-b1: #e9d5ff; --il-b2: #fbcfe8; --il-b3: #c4b5fd; --il-r1: #faf5ff; --il-r2: #fdf2f8; --il-r3: #f5f3ff; --il-robot: #7e22ce; }
        .ds-rang .ds-svg { --il-robot: #15803d; } .ds-rang.ds-qorongi .ds-svg { --il-robot: #fbbf24; --il-ball: #fbbf24; } .ds-rang.ds-gradient .ds-svg { --il-robot: #be185d; }
        .ds-kartalar { display: flex; gap: 10px; padding: 14px 16px 16px; }
        .ds-karta { flex: 1; min-width: 0; background: var(--ds-card); border: 1px solid var(--ds-line); border-radius: 12px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .ds-bub { width: 28px; height: 28px; border-radius: 9px; background: var(--ds-bub); color: var(--ds-acc); display: inline-flex; align-items: center; justify-content: center; }
        .ds-ic { width: 16px; height: 16px; }
        .ds-h2 { margin: 6px 0 2px; font-size: 12px; font-weight: 800; }
        .ds-ft { text-align: center; font-size: 10.5px; padding: 9px; border-top: 1px solid var(--ds-line); color: var(--ds-mut); }
        .ds-yorqin .ds-body { --ds-bg: #fffaf3; --ds-acc: #c2410c; --ds-hd: #1d4ed8; --ds-hd-ink: #fff; --ds-line: #f3d9bf; --ds-hero: linear-gradient(135deg, #ffedd5 0%, #fde68a 55%, #fdba74 100%); --ds-bub: #ffedd5; --ds-h1: #1e3a8a; }
        .ds-yorqin .ds-cta { background: #fff; color: #1d4ed8; }
        .ds-qorongi .ds-body { --ds-bg: #0f172a; --ds-ink: #f1f5f9; --ds-mut: #cbd5e1; --ds-acc: #34d399; --ds-acc-ink: #0f172a; --ds-card: #1e293b; --ds-line: #334155; --ds-hd: #0f172a; --ds-hd-ink: #f1f5f9; --ds-hero: radial-gradient(circle at 80% 20%, #134e4a 0%, #0f172a 60%); --ds-bub: #134e4a; --ds-h1: #f1f5f9; --ds-ill: #1e293b; }
        .ds-gradient .ds-body { --ds-bg: #fdf4ff; --ds-acc: #7e22ce; --ds-line: #f0d5f5; --ds-hd: #fdf4ff; --ds-hero: linear-gradient(135deg, #ede9fe, #fce7f3); --ds-bub: #f3e8ff; --ds-h1: #4c1d95; }
        .ds-gradient .ds-karta { border-radius: 16px; box-shadow: 0 6px 16px rgba(126,34,206,0.14); }
        .ds-rang .ds-body { --ds-acc: #15803d; --ds-bub: #dcfce7; }
        .ds-rang.ds-qorongi .ds-body { --ds-acc: #fbbf24; --ds-bub: #422006; }
        .ds-rang.ds-gradient .ds-body { --ds-acc: #be185d; --ds-bub: #fce7f3; }
        .ds-xom .ds-body { --ds-bg: #fff; --ds-ink: #000; --ds-mut: #000; --ds-acc: #000; --ds-acc-ink: #1a0dab; --ds-card: transparent; --ds-line: transparent; --ds-hd: #fff; --ds-hd-ink: #000; --ds-hero: #fff; --ds-h1: #000; --ds-ill: #fff; font-family: 'Times New Roman', serif; }
        .ds-xom .ds-hd, .ds-xom .ds-hero, .ds-xom .ds-kartalar { display: block; } .ds-xom .ds-nav { display: flex; gap: 6px; color: #1a0dab; text-decoration: underline; opacity: 1; }
        .ds-xom .ds-mark, .ds-xom .ds-bub, .ds-xom .ds-svg { display: none; } .ds-xom .ds-cta, .ds-xom .ds-tugma, .ds-xom .ds-tugma2 { background: none; border: none; padding: 0; color: #1a0dab; text-decoration: underline; font-weight: 400; }
        .ds-xom .ds-karta { border: none; padding: 2px 0; box-shadow: none; } .lesson-root .ds-xom .ds-tag { color: #000; text-transform: none; letter-spacing: 0; font-weight: 400; padding: 0; background: none; }
        .lesson-root .ds-xom .ds-h1 { font-size: 24px; }
        .ds-halqa { outline: 2.5px dashed ${T.accent}; outline-offset: -3px; border-radius: 10px; }
        /* ===== F-1015-330 · qadamlar tugmasi (a2, a3) ===== */
        .am-qt { padding: 0; overflow: hidden; }
        .am-qt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: none; border: none; cursor: pointer; padding: 14px 18px; font: 700 14px 'Manrope', sans-serif; color: ${T.ink}; text-align: left; }
        .am-qt-btn:hover { background: ${T.accentSoft}; }
        .am-qt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-qt-ic { color: ${T.accent}; font-size: 16px; transition: transform 0.2s; }
        .am-qt.on .am-qt-ic { transform: rotate(180deg); }
        .am-qt > .am-qadam { padding: 0 18px 16px; }
        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .am-tt { padding: 0; gap: 0; }
        .am-tt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; cursor: pointer; text-align: left; padding: clamp(14px,2vw,18px); border-radius: 14px; font: inherit; }
        .am-tt-btn:hover { background: ${T.accentSoft}; }
        .am-tt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-tt.on .am-qt-ic { transform: rotate(180deg); }
        .am-tt-ich { display: flex; flex-direction: column; gap: 10px; padding: 0 clamp(14px,2vw,18px) clamp(14px,2vw,18px); }
        .am-tt-nafas { animation: am-nafas 2.4s ease-in-out infinite; }
        .am-tayyor.am-tt { box-shadow: none; } /* F-1015-362: yordamchi blok — yumshoq ramka, soyasiz */
        @keyframes am-nafas { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0.18); } 50% { box-shadow: 0 0 0 6px rgba(255,79,40,0); } }
        .am-tt-oyna { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(560px,92vw); max-height: calc(88vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(18px,3vw,28px); display: flex; flex-direction: column; gap: 14px; box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .pk-tg { display: inline-flex; gap: 8px; flex-wrap: wrap; } /* F-1015-384/385: yig'iq prompt — Ko'rish + Nusxalash */
        .pk-kor { font: 700 13px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 14px; cursor: pointer; }
        .pk-kor:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .pk-kor:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pk-bosh { margin: 0; font: 500 13px 'JetBrains Mono', monospace; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .am-tt-oyna.pk-oyna { width: min(680px,94vw); }
        .pk-oyna .am-masalan { margin: 0; }
        .pk-ich { align-self: flex-end; }
        .am-tt-oyna-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .am-tt-yop { flex: none; width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .am-tt-yop:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .am-tt-yop:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-yig { width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px; border: none; cursor: pointer; text-align: left; font: inherit; padding: 14px 18px; }
        .am-yig-ok { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .am-yig-k { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; }
        .am-yig:hover .am-yig-k { color: ${T.accent}; }
        .am-yig:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .sk-kotar { animation: sk-kotar 0.5s cubic-bezier(.2,.7,.3,1) both; } /* F-1015-363: prompt yig'ilgach kod oynasi yuqoriga ko'tariladi */
        @keyframes sk-kotar { from { opacity: 0.4; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .sk-bar-nur { animation: sk-bar-nur 1.1s ease-out; }
        @keyframes sk-bar-nur { from { box-shadow: inset 0 -2px 0 rgba(250,204,21,0.9); background: rgba(250,204,21,0.22); } to { box-shadow: inset 0 -2px 0 rgba(250,204,21,0); } }
        @media (prefers-reduced-motion: reduce) { .sk-kotar, .sk-bar-nur, .am-tt-oyna { animation: none !important; } }
        .sk-nur { border-radius: 6px; animation: sk-nur 1.2s ease-out; }
        @keyframes sk-nur { 0%, 35% { background: rgba(250,204,21,0.38); } 100% { background: transparent; } }
        @media (prefers-reduced-motion: reduce) { .am-tt-nafas { animation: none; } }
        .screen > .head + .split { margin-top: clamp(6px,1vw,10px); } /* F-1015-333: mentorsiz ekranda sarlavha bloklarga yopishmasin */
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* ===== F-1015-332 · jonli sayt namunasi va amaliyot qo'shimchalari ===== */
        .js-sayt .ds-body { transition: background 0.35s, color 0.35s; }
        .js-btn { font: 700 11px 'Manrope', sans-serif; background: var(--ds-acc); color: var(--ds-acc-ink); border: none; border-radius: 999px; padding: 5px 12px; cursor: pointer; }
        .js-btn:focus-visible, .js-like:focus-visible { outline: 2px solid var(--ds-ink); outline-offset: 2px; }
        .js-menyu-btn { margin-left: auto; }
        .js-menyu { display: flex; flex-direction: column; gap: 2px; padding: 8px 14px 10px; background: var(--ds-card); border-bottom: 1px solid var(--ds-line); font-size: 12px; color: var(--ds-ink); }
        .js-menyu span { padding: 5px 8px; border-radius: 6px; } .js-menyu span:hover { background: var(--ds-bub); }
        .js-like { border: none; cursor: pointer; font-family: inherit; }
        .js-son { align-self: center; font: 800 16px 'Manrope', sans-serif; color: var(--ds-h1); min-width: 22px; }
        .lesson-root .js-tabrik { margin: 10px 0 0; display: inline-block; padding: 6px 12px; border-radius: 10px; background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 12.5px; font-weight: 800; }
        .js-blok { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px; border-top: 1px solid var(--ds-line); }
        .js-qator { display: flex; gap: 8px; }
        .js-input { flex: 1; min-width: 0; font: 500 12.5px 'Manrope', sans-serif; padding: 7px 10px; border-radius: 8px; border: 1.5px solid var(--ds-line); background: var(--ds-card); color: var(--ds-ink); }
        .js-btn2 { border: none; cursor: pointer; font-family: inherit; }
        .lesson-root .js-salom { margin: 0; font-size: 15px; font-weight: 800; color: var(--ds-h1); }
        .lesson-root .js-xato { margin: 0; font-size: 12px; font-weight: 700; color: #b91c1c; }
        .ds-qorongi .lesson-root .js-xato, .ds-qorongi .js-xato { color: #fca5a5; }
        .lesson-root .js-ok { margin: 0; font-size: 12px; font-weight: 700; color: var(--ds-acc); }
        .am-kod { display: flex; flex-direction: column; gap: 6px; }
        .am-kod + .am-kod { margin-top: 6px; }
        .am-uslub-1 { grid-template-columns: minmax(0,1fr); }
        .am-yordam { background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .am-yordam summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .am-yordam p, .am-yordam pre { margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .lesson-root .am-blok-ro { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-ro li { flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
        .am-blok-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .am-blok-teg { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live, passed: screen < maxReached }}>
        <AchCtx.Provider value={earned}>
        <AchMissCtx.Provider value={achMissVal}>
          <div className="lesson-root">
            {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "Praktika", ru: "Практика" }} /> : <>
                <Current key={screen} screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
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
        </AchMissCtx.Provider>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}

// src/2-Modull/lms-entry:PracticeLesson1.jsx
function CcLessonEntry(props) {
  notePreviewProps(props);
  return __ccEl(PracticeLesson1, props);
}
export {
  CcLessonEntry as default
};
