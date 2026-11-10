// ============================================================
//  MENTOR KURSI — UMUMIY DVIGATEL (parts/01–02), hamma mentor darsi uchun bitta (PRD §9-1).
//  F-1029-02 · ovozli, segment-sinxron dars. YIG'ILGAN FAYL — manba: bo'laklar.
//  Yig'ish: Nest-1 — cat parts/*.jsx > NestArchMentorLesson.jsx;
//           Nest-2 — cat parts/01-asos.jsx parts/02-dvigatel.jsx nest2/parts/*.jsx > NestRepoMentorLesson.jsx.
//  Darsga xos narsa (dars ID'si, loyiha nomi, fayl ro'yxati) dvigatelda EMAS — darsning o'z bo'lagida (MKCFG, 02-dvigatel).
//  Platforma SDK: bitta .jsx, import faqat react + '@lesson/runtime' (LESSON_PROMPT_WITH_UNLOCK.md).
//  Metodika: chapda USTOZ GAPI (faqat hozirgi segment), o'ngda SAHNA; segment = qadam:
//  element kiradi / yoritiladi / xiralashadi; ovoz tugagach «Davom» yonadi.
// ============================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAudio, useSfx, useNextLessonAccess } from '@lesson/runtime';

const UZ = "[O'zbekcha tallaffuz] ";
const RU_MARK = '[Русское произношение] ';

// UZ-RU (F-1030-38). Ikki yo'l:
// 1) t(uz, ru) — sahna va dvigateldagi yozuv uchun; faqat render ichida chaqiriladi (modul darajasida EMAS).
// 2) Ekran ma'lumotlari (S, kod satrlari, qadamlar, uyga vazifa) o'zbekcha holicha qoladi; ruschasi parts/08-ru.jsx da
//    ru(obj, {…}) bilan ro'yxatga olinadi. setLang('ru') ildizda bir marta ishlaydi: o'zbekcha nusxa saqlanadi va
//    obyektning O'ZI ruschaga almashtiriladi — shunda S1.plan kabi to'g'ridan o'qiladigan joy ham ruscha bo'ladi.
//    Massivda segment `id` bo'yicha (yoki indeks), obyektda maydon bo'yicha; ruschasi yo'q joy o'zbekcha qoladi.
//    O'zbekcha rejimda hech narsa almashtirilmaydi (ruscha ko'rilgandan keyin qaytsa — nusxadan tiklanadi).
let LANG = 'uz';
const t = (uz, ru) => (LANG === 'ru' && ru != null ? ru : uz);
const RU_OF = new Map();
const UZ_OF = new Map();
const ru = (obj, tr) => { RU_OF.set(obj, tr); return obj; };
const isPlain = (x) => x && typeof x === 'object' && !React.isValidElement(x);
const snap = (x) => (Array.isArray(x) ? x.map(snap) : isPlain(x) ? Object.keys(x).reduce((o, k) => { o[k] = snap(x[k]); return o; }, {}) : x); // reduce — .oz.jsx Chrome 70 ga mos
function ruMerge(b, r) {
  if (r == null) return b;
  if (!isPlain(r)) return r;
  if (Array.isArray(b)) return b.map((x, i) => ruMerge(x, x && x.id != null && !Array.isArray(r) && r[x.id] !== undefined ? r[x.id] : r[i]));
  if (isPlain(b)) { const o = { ...b }; Object.keys(r).forEach((k) => { o[k] = ruMerge(b[k], r[k]); }); return o; }
  return r;
}
// Ruscha ma'lumot o'zbekchada yo'q joyga tushsa (noto'g'ri indeks, segment id yoki maydon) — jim o'tmasin
function ruCheck(b, r, path) {
  if (!isPlain(r)) return;
  if (!isPlain(b)) { console.error('[ru] o\'zbekchada yo\'q: ' + path); return; }
  Object.keys(r).forEach((k) => {
    if (r[k] == null) return;
    const hit = Array.isArray(b) && !Array.isArray(r) ? (b.find((x) => x && x.id === k) || b[k]) : b[k];
    if (hit === undefined) console.error('[ru] o\'zbekchada yo\'q: ' + path + '.' + k);
    else ruCheck(hit, r[k], path + '.' + k);
  });
}
function setLang(lang) {
  const L = lang === 'ru' ? 'ru' : 'uz';
  if (L === LANG) return;
  RU_OF.forEach((tr, obj) => {
    if (!UZ_OF.has(obj)) { UZ_OF.set(obj, snap(obj)); ruCheck(obj, tr, Array.isArray(obj) ? '[]' : (obj.kicker || obj.title || '{}')); }
    const v = L === 'ru' ? ruMerge(snap(UZ_OF.get(obj)), tr) : snap(UZ_OF.get(obj));
    if (Array.isArray(obj)) obj.splice(0, obj.length, ...v);
    else { Object.keys(obj).forEach((k) => { delete obj[k]; }); Object.assign(obj, v); }
  });
  LANG = L;
}

const T = {
  bg: '#F5F6F8', paper: '#FFFFFF', ink: '#0F1115', ink2: '#4B5162', ink3: '#8A90A2', line: '#E3E6EC',
  accent: '#E2451F', blue: '#0E7FB8', green: '#12805A', yellow: '#B57A00', purple: '#6D3BE4',
  code: '#0F1115', codeInk: '#E8EAF0', codeDim: 'rgba(232,234,240,0.38)', codeHl: 'rgba(226,69,31,0.24)',
  chip: '#EEF0F4', chipLine: '#DDE1E8',
};
const PART = { ctrl: T.blue, svc: T.green, mod: T.yellow };
const SANS = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
const MONO = 'ui-monospace,Menlo,Consolas,monospace';

const CSS = `
.mk-stage,.mk-stage *,.mk-cover,.mk-cover *{box-sizing:border-box}
.mk-stage{height:100vh;width:100%;background:${T.bg};color:${T.ink};font:16px/1.5 ${SANS};display:flex;flex-direction:column;overflow:hidden}
.mk-head{flex:0 0 auto;background:${T.paper};border-bottom:1px solid ${T.line}}
.mk-prog{height:3px;background:${T.line}}
.mk-prog>div{height:100%;background:${T.accent};transition:width .5s}
.mk-chrome{display:flex;justify-content:space-between;align-items:center;padding:10px 28px}
.mk-kicker{font:600 11px/1 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:${T.ink3};display:flex;align-items:center;gap:8px}
.mk-kicker i{width:6px;height:6px;border-radius:50%;background:${T.accent};display:inline-block}
.mk-count{font:700 13px/1 ${MONO};color:${T.ink}}
.mk-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(320px,4fr) 8fr;gap:24px;padding:22px 28px}
@media (min-width:1600px){.mk-panel{font-size:14px}.mk-explorer{font-size:13px}}
@media (max-width:1599px){.mk-ide{grid-template-columns:150px minmax(0,1fr)}.mk-ide .mk-panel{font-size:12px}.mk-ide .mk-explorer{font-size:11.5px}}
.pg-two:has(.mk-ide),.pg-two:has(.mk-panel .mk-ln:nth-of-type(n+10)){grid-template-columns:minmax(0,1fr)}
.mk-pair{font:12.5px/1.4 ${MONO};color:${T.ink3};padding:0 4px}.mk-pair b{font-weight:600}.mk-pair code{font:inherit;color:${T.ink2}}
@media (max-width:900px){.mk-body{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:14px;padding:14px}}
.mk-ide{display:grid;grid-template-columns:218px minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);align-items:stretch;flex:0 1 auto;max-height:100%;min-height:0;background:#E9ECF1;border:1px solid #D5DAE2;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,17,21,.10)}
.mk-ide-bar{grid-column:1/-1;display:flex;align-items:center;gap:7px;padding:8px 14px;background:#DDE1E8;border-bottom:1px solid #D0D5DD;font:600 11px/1 ${MONO};color:${T.ink2};letter-spacing:.04em}
.mk-ide-bar i{width:10px;height:10px;border-radius:50%;display:inline-block}
.mk-ide-bar i:nth-child(1){background:#FF5F57}.mk-ide-bar i:nth-child(2){background:#FEBC2E}.mk-ide-bar i:nth-child(3){background:#28C840}
.mk-ide-bar span{margin-left:10px}
.mk-ide-main{display:flex;flex-direction:column;gap:12px;min-width:0;min-height:0;padding:12px;background:${T.bg};overflow:auto}
.mk-ide-main>*{flex:0 0 auto}
.mk-ide-main>.mk-panel{max-height:none}
.mk-ide .mk-explorer{border:0;border-right:1px solid #D5DAE2;border-radius:0;background:transparent}
.mk-ide .mk-panel{box-shadow:none;border-radius:12px}
.mk-ide .mk-panel{padding-top:0}
.mk-ide .mk-panel .fn{position:sticky;top:0;left:auto;right:auto;display:block;width:max-content;max-width:100%;margin:0 0 8px -20px;padding:6px 14px;background:#24272F;color:${T.codeInk};border-radius:12px 0 10px 0;letter-spacing:.02em;font-size:11.5px;z-index:2}
.mk-ide .mk-panel .fn+div{padding-top:0 !important}
@media (max-width:900px){.mk-ide{grid-template-columns:1fr}}
.mk-explorer{background:#EEF0F4;border:1px solid ${T.line};border-radius:14px;padding:10px 6px 12px;font:12px/1.75 ${MONO};color:${T.ink2};align-self:stretch;overflow:hidden}
.mk-explorer .hd{font:600 10px/1 ${MONO};letter-spacing:.12em;text-transform:uppercase;color:${T.ink3};padding:0 8px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-explorer .dir{color:${T.ink};font-weight:700;white-space:nowrap}
.mk-explorer .dir,.mk-explorer .fi{position:relative}
.mk-explorer .ig{position:absolute;top:0;bottom:0;width:1px;background:#C3C9D2;pointer-events:none}
.mk-explorer .dir.shut{font-weight:500;color:${T.ink3}}
.mk-explorer .dir .chev{display:inline-block;width:12px;font-size:9px;color:${T.ink3}}
.mk-explorer .fi.mute{opacity:.5}
.mk-codebar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:0 0 12px}
.mk-codebar .what{font-size:15px;color:${T.ink2}}
.mk-codebar .what b{color:${T.ink};font-family:${MONO};font-size:14px}
.mk-codebar .end{margin-left:auto}
.mk-trbtn{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:transparent;border:1.5px solid transparent;border-radius:12px;padding:11px 14px;font:inherit;color:${T.ink};cursor:pointer;transition:border-color .3s,background .3s}
.mk-trbtn:hover{background:#F6F7F9}
.mk-trbtn .q{font-weight:700;font-size:15px}
.mk-trbtn .n{font-size:13px;color:${T.ink3}}
.mk-trbtn .ar{margin-left:auto;font:700 14px/1 ${MONO};color:${T.ink3}}
.mk-trbtn.hot{border-color:${T.accent};animation:mk-pulse 1.4s ease 3}
.mk-trbtn.hot .q{color:${T.accent}}
.mk-trbtn[aria-expanded="true"]{border-bottom-left-radius:0;border-bottom-right-radius:0}
.mk-explorer .fi{display:flex;align-items:center;gap:7px;padding:1px 8px;border-radius:7px;border-left:3px solid transparent;transition:background .3s,opacity .3s;white-space:nowrap}
.mk-explorer .fi i{width:8px;height:8px;border-radius:2px;background:var(--c);flex:0 0 auto}
.mk-explorer .fi.on{background:#fff;border-left-color:${T.accent};color:${T.ink};font-weight:700;box-shadow:0 2px 8px rgba(15,17,21,.08)}
.mk-explorer .fi.clk{cursor:pointer}
.mk-explorer .fi.clk:hover{background:#fff}
.mk-explorer .fi.new{animation:mk-up .45s ease both}
.mk-explorer.big{font-size:14px;line-height:2;padding:14px 10px}
.mk-explorer.big .fi{padding:3px 10px;border-radius:9px}
.mk-explorer.big .fi .d{font:12.5px ${SANS};color:${T.ink3};margin-left:10px;white-space:normal}
.mk-explorer.big .fi.on .d{color:${T.ink2}}
.mk-browser{display:flex;gap:14px;align-items:center;padding:12px 16px}
.mk-browser .url{font:13px ${MONO};padding:6px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper}}
.mk-browser .out{font-size:20px;font-weight:800}
.mk-browser .out.er{color:${T.accent}}
.mk-say{display:flex;flex-direction:column;min-height:0}
.mk-eyebrow{font:600 11px/1 ${MONO};letter-spacing:.12em;text-transform:uppercase;color:${T.accent};margin:0 0 10px}
.mk-title{font-size:clamp(19px,1.5vw,22px);line-height:1.3;font-weight:600;color:${T.ink2};margin:0 0 14px;letter-spacing:0}
.mk-cap{flex:1;min-height:0;display:flex;flex-direction:column}
.mk-key{font-size:clamp(19px,1.45vw,22px);line-height:1.42;font-weight:500;color:${T.ink};margin:0;letter-spacing:0;animation:mk-up .45s ease both}
.mk-key[data-len="long"]{font-size:clamp(17px,1.3vw,19px)}
.mk-key b{color:${T.accent};font-weight:600}
.mk-key code{font:.88em ${MONO};background:${T.chip};color:${T.ink};border:1px solid ${T.chipLine};padding:1px 7px;border-radius:6px;font-weight:500;white-space:nowrap}
.mk-tr{margin:0;padding:0;list-style:none;display:grid;gap:8px;max-height:52vh;overflow:auto;padding-right:6px}
.mk-input{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid ${T.line};border-radius:8px;font:13px/1.4 ${MONO};background:#fff;color:${T.ink}}
.mk-input:focus{outline:2px solid ${T.accent};outline-offset:1px}
.mk-input.need{border-color:${T.accent};animation:mk-glow 1.8s ease-in-out infinite}
.mk-input.need:focus{animation:none}
.mk-modal{position:fixed;inset:0;z-index:50;background:rgba(15,17,21,.45);display:flex;align-items:center;justify-content:center;padding:24px;animation:mk-fade .2s ease both}
.mk-modal .box{background:${T.paper};border-radius:16px;max-width:960px;width:100%;max-height:82vh;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(15,17,21,.35);animation:mk-up .25s ease both}
.mk-modal .hd{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid ${T.line}}
.mk-modal .hd b{font-size:17px;color:${T.accent}}
.mk-modal .hd span{font-size:13px;color:${T.ink3}}
.mk-modal .hd .x{margin-left:auto;width:36px;height:36px;border-radius:10px;border:1px solid ${T.line};background:${T.paper};font-size:16px;cursor:pointer;color:${T.ink}}
.mk-modal .hd .x:hover{border-color:${T.ink}}
.mk-modal .bd{padding:6px 18px 18px;overflow:auto}
.mk-modal .mk-tbl{table-layout:fixed;width:100%}
.mk-modal .mk-tbl td:first-child{width:48%}
.mk-modal .mk-tbl code{white-space:normal;word-break:break-word}
.mk-tr li{font-size:14px;line-height:1.5;color:${T.ink3};padding:6px 10px;border-radius:8px;border-left:3px solid transparent}
.mk-tr li.on{color:${T.ink};background:#FFF7F3;border-left-color:${T.accent}}
.mk-tr li.done{color:${T.ink2}}
.mk-tr code{font:0.92em ${MONO};background:#E3E6EC;border:1px solid #D3D7DF;padding:0 5px;border-radius:5px;color:${T.ink}}
.mk-ask{margin-top:18px;padding:14px 16px;border:1.5px solid ${T.accent};border-radius:12px;background:#FFF7F3;animation:mk-up .4s ease both}
.mk-ask p{margin:0 0 10px;font-weight:600}
.mk-ask .row{display:flex;gap:10px;flex-wrap:wrap}
.mk-ask .res{margin-top:10px;font-size:14px;color:${T.ink2}}
.mk-now{font-size:clamp(17px,1.45vw,21px);line-height:1.6;color:${T.ink};margin:0;animation:mk-up .45s ease both}
.mk-now b{color:${T.accent};font-weight:700}
.mk-now code,.mk-prev code{font:0.92em ${MONO};background:#E3E6EC;border:1px solid #D3D7DF;padding:0 5px;border-radius:5px}
.mk-dots{display:flex;gap:6px;margin:16px 0 0}
.mk-dots i{width:22px;height:4px;border-radius:2px;background:${T.line};display:inline-block;transition:background .3s}
.mk-dots i.on{background:${T.accent}}
.mk-dots i.done{background:${T.ink3}}
.mk-below{margin-top:18px}
.mk-review{margin:14px 0 0;padding:10px 12px;border-radius:10px;background:#EEF0F4;color:${T.ink2};font-size:13.5px;line-height:1.45}
.mk-scene{min-height:0;display:flex;flex-direction:column;justify-content:flex-start;gap:14px;overflow:auto}
.mk-scene:not(.top)>:first-child{margin-top:auto}
.mk-scene:not(.top)>:last-child{margin-bottom:auto}
.mk-scene.top{justify-content:flex-start}
.mk-panel{flex:0 1 auto;max-height:100%;min-height:0;background:${T.code};color:${T.codeInk};border-radius:16px;padding:18px 20px;font:13px/1.55 ${MONO};overflow:auto;position:relative;box-shadow:0 10px 30px rgba(15,17,21,.12)}
.mk-panel .fn{position:absolute;top:10px;right:14px;font-size:11px;color:${T.codeDim};letter-spacing:.06em}
.mk-ln{display:flex;gap:14px;padding:1px 8px;border-radius:6px;white-space:pre;opacity:0;transform:translateY(6px);transition:opacity .35s,transform .35s,background .35s}
.mk-ln.in{opacity:1;transform:none}
.mk-ln.dim{opacity:.5}
.mk-ln.hl{background:${T.codeHl};box-shadow:inset 3px 0 0 ${T.accent}}
.mk-ln.gone{opacity:1;background:rgba(239,68,68,.22);box-shadow:inset 3px 0 0 #F87171;text-decoration:line-through;text-decoration-color:#F87171;text-decoration-thickness:2px}
.mk-ln.gone,.mk-ln.gone *{color:#FCA5A5!important}
.mk-ln.new{background:rgba(18,128,90,.22);box-shadow:inset 3px 0 0 #86EFAC}
.mk-ln .n{color:${T.codeDim};min-width:2ch;text-align:right;user-select:none}
.mk-ln.wrap{white-space:pre}
.mk-ln.clk{cursor:pointer}
.mk-ln.clk:hover{background:rgba(232,234,240,.08)}
.mk-ln.bad{background:rgba(226,69,31,.28);box-shadow:inset 3px 0 0 #FCA5A5}
.mk-ln.good{background:rgba(18,128,90,.3);box-shadow:inset 3px 0 0 #86EFAC}
.k{color:#C792EA}.s{color:#C3E88D}.d{color:#FFCB6B}.c{color:#82AAFF}.m{color:#89DDFF}.cm{color:#6B7280;font-style:italic}
.p{color:#7DD3FC}.ok{color:#86EFAC}.er{color:#FCA5A5}.wn{color:#FDE68A}
.mk-light{flex:0 1 auto;max-height:100%;min-height:0;background:${T.paper};border:1px solid ${T.line};border-radius:16px;padding:20px;position:relative;overflow:auto}
/* 04.11 · past ekran (1280×720, 1366×768): bo'shliqlar ixcham — shrift deyarli o'zgarmaydi, sahna sig'ishi uchun */
@media (max-height:800px){.mk-body{padding:14px 22px;gap:20px}.mk-scene{gap:10px}.mk-panel{padding:12px 16px;font-size:12.5px;line-height:1.45}.mk-explorer{line-height:1.45;padding:6px 6px 8px}.mk-light{padding:14px}.mk-box{padding:10px 12px}}
.mk-light.fill{flex:1}
.mk-tag{font:600 11px/1 ${MONO};letter-spacing:.08em;color:${T.ink3};text-transform:uppercase;margin:0 0 10px}
.mk-nav{flex:0 0 auto;background:${T.paper};border-top:1px solid ${T.line};padding:12px 28px;display:flex;align-items:center;gap:12px}
.mk-btn{border:1.5px solid ${T.ink};background:${T.ink};color:#fff;border-radius:12px;padding:11px 20px;font:600 15px/1 ${SANS};cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:transform .12s,opacity .3s,background .3s}
.mk-btn:active{transform:scale(.97)}
.mk-btn.ghost{background:transparent;color:${T.ink}}
.mk-btn.soft{background:transparent;color:${T.ink2};border-color:${T.line};font-weight:500}
.mk-btn.sm{padding:7px 12px;font-size:13px;border-radius:9px}
.mk-btn:disabled{opacity:.35;cursor:not-allowed}
.mk-lockhint{margin-left:auto;font-size:13.5px;color:${T.ink2};display:flex;align-items:center;gap:8px}
.mk-lockhint i{width:7px;height:7px;border-radius:50%;background:${T.accent};display:inline-block;animation:mk-pulse 1.6s ease-in-out infinite}
.mk-say.mc>:first-child{margin-top:auto}
.mk-say.mc>:last-child{margin-bottom:auto}
.mk-say.mc .mk-opt{font-size:15px;padding:11px 14px;border-radius:10px;align-items:flex-start}
.mk-opt .l{margin-top:3px}
.mk-opt .t{display:grid;gap:4px;min-width:0}
.mk-opt .why{font-size:13.5px;line-height:1.4;font-weight:500;color:${T.green}}
.mk-opt.bad .why{color:${T.accent}}
.mk-opt.ok{color:${T.ink}}
.mk-opt .why code{font:.92em ${MONO};background:${T.chip};border:1px solid ${T.chipLine};border-radius:5px;padding:0 5px;color:${T.ink}}
.mk-body.mc-split{grid-template-columns:minmax(340px,4fr) minmax(0,8fr);gap:24px}
.mc-after{display:flex;flex-direction:column;gap:12px;overflow:auto}
.mc-after>.mk-panel,.mc-after>.mc-proof{flex:0 0 auto;min-height:0}
.mc-proof{display:flex;flex-direction:column;gap:10px}
.mc-proof>div{display:flex!important;flex-direction:column;gap:10px;flex:0 0 auto;min-height:0}
.mc-proof .mk-panel{flex:0 0 auto;min-height:0;max-height:none}
.mc-proof .mk-rule,.mc-proof .mk-tag,.mc-after>.mk-tag{flex:0 0 auto}
.mc-demak{flex:0 0 auto;min-height:52px;display:flex;align-items:center;gap:6px;font-size:15px;line-height:1.45;color:${T.ink};padding:0 4px}
.mc-demak.on{border-left:3px solid ${T.green};padding-left:12px;animation:mk-up .45s ease both}
.mc-demak b{color:${T.green}}
.mc-demak code{font:.92em ${MONO};background:${T.chip};border:1px solid ${T.chipLine};border-radius:5px;padding:0 5px}
.mk-body.mc-split>.mk-say.mc>:first-child{margin-top:0}
.mk-title.mc-q{font-size:clamp(19px,1.5vw,22px);font-weight:600;color:${T.ink}}
.mc-wait{flex:0 0 auto;border:1.5px dashed ${T.line};border-radius:10px;padding:10px 14px;color:${T.ink3};font-size:13px;background:${T.paper}}
@media (max-width:1000px){.mk-body.mc-split{grid-template-columns:1fr;grid-auto-rows:max-content;overflow:auto}.mk-body.mc-split>.mk-say.mc,.mk-body.mc-split>.mc-after{overflow:visible!important}}
.mk-btn.ready{background:${T.accent};border-color:${T.accent};animation:mk-pulse 1.6s ease-in-out infinite}
.mk-audio{display:flex;align-items:center;gap:6px}
.mk-audio button{background:transparent;border:1px solid ${T.line};border-radius:8px;padding:5px 8px;cursor:pointer;color:${T.ink2};font:12px/1 ${SANS};display:inline-flex;align-items:center;gap:6px}
.mk-audio .live{color:${T.accent};border-color:${T.accent}}
.mk-bars{display:inline-flex;gap:2px;align-items:flex-end;height:12px}
.mk-bars i{width:3px;background:currentColor;border-radius:1px;animation:mk-eq .9s ease-in-out infinite}
.mk-bars i:nth-child(2){animation-delay:.15s}.mk-bars i:nth-child(3){animation-delay:.3s}
.mk-in{opacity:0;transform:translateY(8px);transition:opacity .4s,transform .4s}
.mk-in.on{opacity:1;transform:none}
.mk-in.dim{opacity:.55}
.mk-box{border-radius:14px;padding:12px 14px;background:${T.paper};border:2px solid var(--c);color:${T.ink};transition:opacity .4s,transform .4s,box-shadow .4s}
.mk-box.hl{box-shadow:0 0 0 4px rgba(226,69,31,.16),0 12px 28px rgba(15,17,21,.12)}
.mk-box h4{margin:0 0 4px;font-size:15px;color:var(--c)}
.mk-box p{margin:0;font-size:12.5px;color:${T.ink2};line-height:1.35}
.mk-box code{font:12px ${MONO};color:${T.ink}}
.mk-flow{position:relative;padding-top:26px}
.mk-row{display:grid;grid-template-columns:1fr 44px 1fr 44px 1fr;align-items:stretch}
.mk-arrow{display:flex;align-items:center;justify-content:center;color:${T.line};font-size:22px;transition:color .4s}
.mk-arrow.on{color:${T.accent}}.mk-arrow.back{color:${T.green}}
.mk-dot{position:absolute;top:0;width:16px;height:16px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 6px rgba(226,69,31,.18);transform:translateX(-50%);transition:left .9s cubic-bezier(.4,0,.2,1),opacity .3s,background .3s;opacity:0}
.mk-dot.in{opacity:1}.mk-dot.back{background:${T.green};box-shadow:0 0 0 6px rgba(18,128,90,.18)}
.mk-file{display:flex;align-items:center;gap:8px;padding:5px 10px;border-radius:8px;font:13px/1.4 ${MONO};color:${T.ink2};transition:opacity .35s,background .35s}
.mk-file.hl{background:#EEF0F4;color:var(--c);font-weight:700}
.mk-file i{width:8px;height:8px;border-radius:2px;background:var(--c,${T.ink3});display:inline-block;flex:0 0 auto}
.mk-plan{display:grid;gap:10px}
.mk-plan div{display:flex;gap:12px;align-items:center;padding:12px 14px;border:1px solid ${T.line};border-radius:12px;background:${T.paper};transition:border-color .3s,box-shadow .3s,opacity .3s}
.mk-plan div.hl{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.12)}
.mk-plan div.dim{opacity:.5}
.mk-plan b{font:700 12px/1 ${MONO};color:${T.accent};min-width:22px}
.mk-opt{display:flex;gap:12px;align-items:center;text-align:left;width:100%;padding:14px 16px;border-radius:12px;border:1.5px solid ${T.line};background:${T.paper};color:${T.ink};font:500 16px/1.35 ${SANS};cursor:pointer;transition:border-color .2s,background .2s,transform .12s,opacity .3s}
.mk-opt:hover:not(:disabled){border-color:${T.ink}}
.mk-opt:disabled{cursor:default}
.mk-opt .l{font:700 12px/1 ${MONO};color:${T.ink3};min-width:18px}
.mk-opt.ok{border-color:${T.green};background:#E3F5EC;color:${T.green}}
.mk-opt.bad{border-color:${T.accent};background:#FFF0EB;color:${T.accent};opacity:.75}
.mk-opt.off{opacity:.45}
.mk-fb{margin-top:14px;padding:14px 16px;border-radius:12px;border-left:4px solid var(--c);background:var(--bg);animation:mk-up .4s ease both}
.mk-fb b{display:block;font:700 11px/1 ${MONO};letter-spacing:.1em;text-transform:uppercase;color:var(--c);margin:0 0 6px}
.mk-card{border:1px solid ${T.line};border-radius:12px;padding:12px 14px;background:${T.paper}}
.mk-card h5{margin:0 0 6px;font-size:13px;color:${T.ink3};font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.mk-rule{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:12px 14px;font-size:15px;line-height:1.5}
.mk-rule b{color:${T.accent}}
.mk-tbl{width:100%;border-collapse:collapse;font-size:13.5px}
.mk-tbl th,.mk-tbl td{text-align:left;padding:7px 10px;border-bottom:1px solid ${T.line};vertical-align:top}
.mk-tbl th{font:600 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;color:${T.ink3}}
.mk-tbl code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px;white-space:nowrap}
.mk-tbl tr.hl td{background:#FFF7F3}
.mk-step{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border:1px solid ${T.line};border-radius:12px;background:${T.paper};transition:border-color .3s,box-shadow .3s,opacity .3s}
.mk-step.hl{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.12)}
.mk-step input{width:18px;height:18px;margin-top:3px;accent-color:${T.green}}
.mk-step .t{flex:1;min-width:0}
.mk-step .t b{display:block;font-size:14px;margin-bottom:3px}
.mk-step .cmd{display:inline-flex;gap:6px;align-items:center;margin:3px 12px 3px 0;max-width:100%}
.mk-step .cmd code{overflow-wrap:anywhere}
@media (max-height:760px){.mk-step{padding:7px 10px}.mk-step .t b{margin-bottom:1px}.mk-step .cmd{margin:2px 10px 2px 0}}
.mk-step code{font:12.5px ${MONO};background:#EEF0F4;padding:2px 7px;border-radius:6px}
.mk-step .exp{font-size:12.5px;color:${T.ink3}}
.mk-copy{border:1px solid ${T.line};background:#fff;border-radius:6px;padding:2px 7px;font:11px ${SANS};cursor:pointer;color:${T.ink2}}
.mk-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mk-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink};transition:border-color .3s,box-shadow .3s,opacity .3s}
.mk-qa button.hl{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.12)}
.mk-qa button.dim{opacity:.5}
.mk-qa b{display:block;font-size:14px;margin-bottom:6px}
.mk-qa p{margin:0;font-size:13px;color:${T.ink2};line-height:1.45}
.mk-tree{font:12.5px/1.6 ${MONO};color:${T.ink3}}
.mk-tree div{padding:0 6px;border-radius:5px;transition:background .3s,color .3s}
.mk-tree .g{color:${T.green};background:#E3F5EC}.mk-tree .y{color:${T.yellow};background:#FFF6E2}.mk-tree .r{color:${T.ink2};background:#EFF1F4}
.mk-tree .f{color:${T.ink};font-weight:700}
.mk-cover{height:100vh;display:grid;place-items:center;background:${T.bg};padding:24px;color:${T.ink};font:16px/1.5 ${SANS}}
.mk-cover .card{max-width:760px;width:100%;background:${T.paper};border:1px solid ${T.line};border-radius:20px;padding:36px 40px;box-shadow:0 20px 60px rgba(15,17,21,.08)}
.mk-cover h1{font-size:clamp(24px,2.3vw,30px);line-height:1.15;font-weight:700;margin:8px 0 10px;letter-spacing:-.01em}
.mk-cover p{color:${T.ink2};font-size:17px;line-height:1.55;margin:0 0 22px}
.mk-resume{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.mk-cover p.mk-resume-note{flex-basis:100%;margin:6px 0 0;font-size:14px;color:${T.ink2}}
.mk-cover ul{margin:0 0 26px;padding:0;list-style:none;display:grid;gap:8px;color:${T.ink2};font-size:15px}
.mk-cover li::before{content:"—";color:${T.accent};margin-right:10px}
.mk-req{display:grid;gap:8px}
.mk-req button{display:flex;gap:10px;align-items:center;border:1px solid ${T.line};border-radius:10px;background:${T.paper};padding:9px 12px;cursor:pointer;font:600 13px ${MONO};color:${T.ink};text-align:left;transition:border-color .3s}
.mk-req button.hl{border-color:${T.accent}}
.mk-req .st{font:700 11px ${MONO};padding:2px 7px;border-radius:6px;background:#EEF0F4;color:${T.ink2}}
.mk-req .st.s2{background:#E3F5EC;color:${T.green}}.mk-req .st.s4{background:#FFF0EB;color:${T.accent}}
.mk-req pre{margin:6px 0 0;font:12px/1.45 ${MONO};white-space:pre-wrap;color:${T.ink2}}
/* F-1109-06: mexanizm chizmalari (oqim, yo'lak, vaqt o'qi, jadval) — gapli karta o'rniga */
.z{--ac:#E2451F;--ac2:#FFF5F2;--pg:#336791;--ok:#15803D;--ok2:#DCFCE7;--bad:#DC2626;--bad2:#FEF2F2;--warn:#C2410C;--warn2:#FFEDD5;--blue:#1D4ED8;--blue2:#DBEAFE;--pur:#6D3BE4;--pur2:#EDE9FE;--ink:#1F2937;--ink2:#4B5563;--mut:#6B7280;--line:#D7DCE3;--soft:#F8FAFC;
  display:grid;gap:12px;color:var(--ink);font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.z *{box-sizing:border-box}
.z .zm,.z .zm *{font-family:ui-monospace,Menlo,Consolas,monospace}
.z .zm{font-size:13px;color:var(--ink)}
.z-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px;display:grid;gap:10px;min-width:0;align-content:start}
.z-h{font:700 13px system-ui,sans-serif;letter-spacing:.01em;color:var(--mut);margin:0}
.z-flow{display:flex;align-items:stretch;gap:0}
.z-flow>.z-st{flex:1 1 0;min-width:0}
.z-ar{flex:0 0 26px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:20px}
.z-ar.bad{color:var(--bad)}
.z-st{border:1.5px solid var(--line);border-radius:10px;padding:10px;display:grid;gap:5px;align-content:start;background:var(--soft)}
.z-st.ok{border-color:var(--ok);background:#F0FDF4}.z-st.bad{border-color:var(--bad);background:var(--bad2)}.z-st.ac{border-color:var(--ac);background:var(--ac2)}
.z-st.blue{border-color:var(--pg);background:#EFF6FF}.z-st.off{border-style:dashed;background:#fff;color:var(--mut)}
.z-st .ln{font:11.5px ui-monospace,Menlo,Consolas,monospace;color:var(--mut)}
.z-tag{justify-self:start;display:inline-block;font:700 12px system-ui,sans-serif;border-radius:999px;padding:2px 9px;white-space:nowrap}
.z-tag.r{background:var(--bad);color:#fff}.z-tag.g{background:var(--ok2);color:var(--ok)}.z-tag.b{background:var(--blue2);color:var(--blue)}.z-tag.o{background:var(--warn2);color:var(--warn)}.z-tag.n{background:#F1F3F6;color:var(--ink2)}
.z-term{background:#111827;color:#E5E7EB;border-radius:10px;padding:10px 12px;font:13px/1.55 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word}
.z-term .r{color:#FCA5A5}.z-term .g{color:#86EFAC}.z-term .y{color:#FDE68A}.z-term .c{color:#93C5FD}.z-term .m{color:#9CA3AF}
.z-term .hl{background:rgba(226,69,31,.28);border-radius:3px}
.z-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.z-three{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.z-rule{border-left:4px solid var(--ac);background:var(--ac2);border-radius:10px;padding:10px 14px;font-size:15px}
.z-rule b{color:var(--ac)}
.z-k{display:inline;font:13px ui-monospace,Menlo,Consolas,monospace;background:#F1F3F6;border-radius:5px;padding:1px 6px;color:var(--ink)}
.z-mut{color:var(--mut);font-size:13px}
.z-lanes{display:grid;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.z-lanes>div{padding:9px 12px;border-bottom:1px solid #EEF0F3;display:flex;align-items:center;gap:8px;min-height:44px;font-size:14px}
.z-lanes>.hd{font:700 12px system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;background:var(--soft);color:var(--ink2)}
.z-lanes>.rh{font:600 12px ui-monospace,Menlo,Consolas,monospace;color:var(--mut);background:var(--soft)}
.z-tbl{border-collapse:collapse;width:100%;font:13px ui-monospace,Menlo,Consolas,monospace}
.z-tbl th,.z-tbl td{border:1px solid #E5E7EB;padding:5px 9px;text-align:left;color:var(--ink)}
.z-tbl th{background:var(--soft);font-weight:700}
.z-tbl tr.hl td{background:var(--blue2)}.z-tbl tr.bad td{background:var(--bad2);color:#991B1B}.z-tbl tr.ok td{background:#F0FDF4}
.z-svg{display:block;width:100%;height:auto}
.z-svg text{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.z-svg .mono{font-family:ui-monospace,Menlo,Consolas,monospace}
.z b,.z strong{color:inherit}
.z .z-st>b{color:var(--ink)}
.z .zm{overflow-wrap:anywhere}
.z code{all:unset;display:inline;font:13px ui-monospace,Menlo,Consolas,monospace;background:#F1F3F6;border-radius:5px;padding:1px 6px;color:var(--ink)}
.z-h .zk,.z-h code{text-transform:none;letter-spacing:0;font:600 12.5px ui-monospace,Menlo,Consolas,monospace;color:var(--ink2)}
.z .mk-in{min-width:0}
.z-st.dim,.z-card.dim{opacity:.45}
.z-card.hl{border-color:#E2451F;box-shadow:0 0 0 3px rgba(226,69,31,.14)}
.z-st.hl{box-shadow:0 0 0 3px rgba(226,69,31,.18)}
.z-st,.z-card,.z-ar,.z-rule,.z-term,.z-tbl tr{transition:opacity .4s,box-shadow .4s,background .4s}
.z .dim{opacity:.4}
.z-band{display:grid;gap:8px;font:700 12px system-ui,sans-serif;text-align:center}
.z-band>div{border-radius:8px;padding:5px 4px}
@keyframes mk-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes mk-fade{from{opacity:0}to{opacity:1}}
@keyframes mk-glow{0%,100%{box-shadow:0 0 0 0 rgba(226,69,31,0)}50%{box-shadow:0 0 0 5px rgba(226,69,31,.16)}}
@keyframes mk-pulse{0%,100%{box-shadow:0 0 0 0 rgba(226,69,31,.35)}50%{box-shadow:0 0 0 8px rgba(226,69,31,0)}}
@keyframes mk-eq{0%,100%{height:4px}50%{height:12px}}
@keyframes mk-route{0%{left:calc((100% - 88px) / 6)}35%{left:50%}55%{left:calc(100% - (100% - 88px) / 6)}80%{left:50%}100%{left:calc((100% - 88px) / 6)}}
`;
function useCss() {
  useEffect(() => {
    let s = document.getElementById('mk-css');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css'; document.head.appendChild(s); }
    if (s.textContent !== CSS) s.textContent = CSS;
  }, []);
}

// ============================================================
//  DVIGATEL — segment-qadam, sahna qobig'i, umumiy komponentlar
// ============================================================
const html = (s) => ({ __html: s });
// F-1102-22 (M40): chap panel gapining uzunligi — CSS `.mk-key[data-len]` shu bilan o'lchamni moslaydi (teglarsiz belgi soni)
const lenTag = (s) => {
  if (typeof s !== 'string') return undefined;
  const n = s.replace(/<[^>]+>/g, '').trim().length;
  return n <= 70 ? 'short' : n <= 110 ? 'mid' : 'long';
};
// Ovoz matni so'z bilan («to'rt yuz to'rt»), ekran raqam bilan (404): show berilmagan matn uchun
// Tartib muhim: uzun ibora oldin («ming ikki yuz qirq» → 1240, keyin «ikki yuz» → 200 uni buzmaydi)
const DIGITS = [['ming ikki yuz qirq', '1240'], ["to'rt yuz to'rt", '404'], ["to'rt yuz bir", '401'], ["to'rt yuz uch", '403'], ['ikki yuz bir', '201'], ['besh yuz', '500'], ["to'rt yuz", '400'], ['ikki yuz', '200'], ['uch ming', '3000'], ["to'qson to'qqiz", '99'], ['index nol', 'index [0]'],
  ["o'n birinchi versiya", '11-versiya'], ["o'n-o'n besh", '10–15'], ["o'n marta", '10 marta'], ['ikki-besh', '2–5'], ['yigirma ikki', '22'], ["o'ttizdan oltmishgacha", '30–60'], ["oltmishdan to'qsongacha", '60–90'], ['yigirma', '20'], ["o'ttiz", '30'], ["to'qson", '90']];
const digits = (t) => DIGITS.reduce((acc, [w, d]) => acc.replace(new RegExp(w.replace(/'/g, "['\u2019]"), 'gi'), d), t || '');
// Ovozga ketadigan matn (platforma qoidasi, LESSON_PROMPT_WITH_UNLOCK «Multilingual narration»): host-marker + haqiqiy inglizcha
// IBORALAR `[English pronunciation] … [end]` ichida (terminal xabarlari, atama-iboralar). Yakka atamalar (Controller, route)
// o'ralmaydi — qoida «faqat kerak joyda». Ekranda/«Matn»da teg ko'rinmaydi: voice() faqat useAudio'ga beriladi.
const EN_PHRASES = [
  /Unable to connect to the database/g, /client password must be a string/g, /password authentication failed for user/g,
  /Nest application successfully started/g, /successfully started/g, /Validation failed/g, /Internal server error/g,
  /can't resolve dependencies/g, /invalid controller/g, /Dependency Injection/g, /Hello World/g, /Cannot GET/g,
  /Bad Request/g, /Not Found/g, /does not exist/g, /Potential solutions/g, /Car with id [\w' ]+? not found/g,
  /\b[Bb]ackslash\b/g, // F-1109-01 (M49): `\` belgisi o'z nomi bilan; ko'rik saytida o'zbekcha ovoz uchun tts-server «bekslesh» qiladi
];
// F-1109-02 (M49): o'quvchi darsi kodi (m4-03, m4a-03, m11-03) ovozga so'z bilan ketadi — raqam bo'lib ketsa «0» «o» harfi
// bo'lib o'qiladi («m4 o uch»). Faqat o'zbekcha ovozda; ekranda va «Matn»da kod o'zgarmaydi.
const SON_UZ = ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"];
const ON_UZ = ['', "o'n", 'yigirma', "o'ttiz", 'qirq'];
const sonUz = (n) => (n < 10 ? SON_UZ[n] : ON_UZ[Math.floor(n / 10)] + (n % 10 ? ' ' + SON_UZ[n % 10] : ''));
const kodOvoz = (t) => t.replace(/\bm(\d{1,2})(a?)-(\d)(\d)\b/g, (_, m, a, d1, d2) =>
  `em ${sonUz(+m)}${a ? ' a' : ''}, ${d1 === '0' ? 'nol ' + SON_UZ[+d2] : sonUz(+(d1 + d2))}`);
const voice = (t) => {
  const keep = [];
  let out = LANG === 'ru' ? (t || '') : kodOvoz(t || '');
  EN_PHRASES.forEach((re) => { out = out.replace(re, (m) => { keep.push(m); return `\u0000${keep.length - 1}\u0000`; }); });
  return (LANG === 'ru' ? RU_MARK : UZ) + out.replace(/\u0000(\d+)\u0000/g, (_, i) => `[English pronunciation] ${keep[i]} [end]`);
};
const HELP_ROW = ['Hech biri emas', "Skrinshot + xato matnini mentor-kurs Telegram guruhiga yuboring; darsni to'xtatmang, keyingi ekranga o'ting"];
const vis = (at, beat) => at == null || at <= beat;

// useAudio(segments) → currentId. Qadam faqat oldinga o'sadi. `ask` segmenti: ovoz savol beradi va
// tugma bosilguncha kutadi (waits_for button_click/step) — «o'ylab ko'ring».
// `review` (Orqaga bilan qaytilgan ekran, A12): ovoz yo'q, ekran yakuniy holatda; ↺ boshidan — ovoz bilan qayta
function useBeats(segments, review) {
  const segs = useMemo(() => review ? [] : segments.map((s, i) => ({ id: s.id, text: voice(s.text), trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: s.ask ? { type: 'button_click', target: 'step' } : s.waits_for })), [segments, review]);
  const audio = useAudio(segs);
  const [beat, setBeat] = useState(review ? segments.length - 1 : 0);
  const [done, setDone] = useState(!!review);
  const [guess, setGuess] = useState({});
  const started = useRef(false);
  useEffect(() => {
    const i = segments.findIndex((s) => s.id === audio.currentId);
    if (i >= 0) { started.current = true; setBeat((b) => Math.max(b, i)); }
  }, [audio.currentId, segments]);
  // Runtime savolda kutyapti, lekin savol segmenti currentId'da ko'rinmay o'tib ketgan bo'lsa (ovoz rad etilgan / juda qisqa) —
  // qadamni o'sha savolga suramiz, aks holda savol chiqmaydi va ekran qotadi
  useEffect(() => {
    if (!audio.waitingFor || audio.currentId) return;
    const k = segments.findIndex((s, i) => i >= beat && s.ask);
    if (k >= 0) { started.current = true; setBeat((b) => Math.max(b, k)); }
  }, [audio.waitingFor, audio.currentId, beat, segments]);
  // F-1031-16: oxirgi segment ovozi YUKLANAYOTGANDA ham isPlaying=false bo'ladi — Davom erta ochilmasin:
  // zanjir tugaganini currentId bo'shagani bilan bilamiz (platforma ham, dev shim ham oxirida null qiladi)
  useEffect(() => {
    if (!audio.isPlaying && !audio.waitingFor && !audio.currentId && started.current && beat >= segments.length - 1) setDone(true);
  }, [audio.isPlaying, audio.waitingFor, audio.currentId, beat, segments.length]);
  const stepManual = useCallback(() => { setBeat((b) => { const n = Math.min(b + 1, segments.length - 1); if (n === segments.length - 1) setDone(true); return n; }); }, [segments.length]);
  // «O'ylab ko'ring»: tugma ovoz paytida ham bosiladi; runtime hali kutmayotgan bo'lsa, kutishga o'tganda yuboriladi
  const pendingAsk = useRef(false);
  const answerAsk = useCallback((segId, i) => {
    setGuess((g) => ({ ...g, [segId]: i }));
    if (audio.waitingFor) audio.triggerEvent('button_click', 'step');
    else if (audio.muted || audio.status === 'idle') stepManual();
    else pendingAsk.current = true;
  }, [audio, stepManual]);
  useEffect(() => { if (audio.waitingFor && pendingAsk.current) { pendingAsk.current = false; audio.triggerEvent('button_click', 'step'); } }, [audio.waitingFor, audio]);
  return { audio, beat, done, stepManual, seg: segments[beat], guess, answerAsk };
}

// ↺ = ekranni BOSHIDAN (ovoz + sahna + qadamlar) — root komponent ekranni qayta o'rnatadi (F-1030-05); onRestart bo'lmasa — hozirgi gap
function AudioChip({ audio, onRestart }) {
  return (
    <div className="mk-audio">
      <button className={audio.isPlaying ? 'live' : ''} onClick={audio.toggleMute} title={audio.muted ? t('Ovozni yoqish', 'Включить звук') : t("Ovozni o'chirish", 'Выключить звук')}>
        {audio.isPlaying ? <span className="mk-bars"><i /><i /><i /></span> : <span>{audio.muted ? '🔇' : '🔈'}</span>}
        {audio.muted ? t("o'chiq", 'выкл.') : (audio.isPlaying ? t('ustoz gapiryapti', 'учитель говорит') : t('ovoz', 'звук'))}
      </button>
      <button onClick={onRestart || audio.replay} title={t('Ekranni boshidan', 'Экран с начала')}>{t('↺ boshidan', '↺ с начала')}</button>
    </div>
  );
}

// lockHint — Davom nega yopiqligini aytadi (UX-1); → / Enter — Davom ochiq bo'lsa keyingi ekran (UX-8; matn maydonida ishlamaydi)
function Stage({ kicker, idx, total, audio, children, onBack, onNext, onRestart, nextReady, nextDisabled, nextLabel, extra, lockHint }) {
  useEffect(() => {
    const onKey = (e) => {
      if (nextDisabled || !onNext || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = document.activeElement; const tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.key === 'Enter' && (tag === 'BUTTON' || tag === 'A'))) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); onNext(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextDisabled, onNext]);
  return (
    <div className="mk-stage">
      <div className="mk-head">
        <div className="mk-prog"><div style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
        <div className="mk-chrome">
          <div className="mk-kicker"><i />{kicker}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {audio && <AudioChip audio={audio} onRestart={onRestart} />}
            <span className="mk-count">{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      {children}
      <div className="mk-nav">
        {onBack ? <button className="mk-btn ghost" onClick={onBack}>{t('← Orqaga', '← Назад')}</button> : <span />}
        {extra}
        {nextDisabled && lockHint && <span className="mk-lockhint"><i />{lockHint}</span>}
        <button className={`mk-btn${nextReady && !nextDisabled ? ' ready' : ''}`} disabled={!!nextDisabled} style={{ marginLeft: nextDisabled && lockHint ? 12 : 'auto' }} onClick={onNext} title={nextDisabled ? lockHint || '' : t('Davom (→ yoki Enter)', 'Далее (→ или Enter)')}>{nextLabel || t('Davom', 'Далее')} →</button>
      </div>
    </div>
  );
}

// Chap ustun: sarlavha + KALIT IBORA (hozirgi segment) + qadam chiziqchalari + «Matn» (butun transkript) + «o'ylab ko'ring»
function Say({ eyebrow, title, segments, beat, audio, stepManual, below, guess, answerAsk, review }) {
  const now = segments[beat];
  const keyHtml = now.key || now.show || digits(now.text);
  const [tr, setTr] = useState(false);
  const showManual = !review && (audio.muted || (!audio.isPlaying && !audio.waitingFor && beat < segments.length - 1 && audio.status === 'idle' && !now.ask));
  const asking = now.ask && guess && guess[now.id] === undefined;
  const prevAsk = beat > 0 && segments[beat - 1].ask ? segments[beat - 1] : null;
  return (
    <div className="mk-say">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>{eyebrow && <p className="mk-eyebrow">{eyebrow}</p>}<h2 className="mk-title" data-len={lenTag(title)}>{title}</h2></div>
        <button className="mk-btn soft sm" onClick={() => setTr((v) => !v)} title={t("Ustoz gapining to'liq matni", 'Полный текст учителя')}>{tr ? t('Matnni yopish', 'Скрыть текст') : t('Matn', 'Текст')}</button>
      </div>
      <div className="mk-cap">
        {tr ? (
          <ul className="mk-tr">{segments.map((s, i) => <li key={s.id} className={i === beat ? 'on' : (i < beat ? 'done' : '')} dangerouslySetInnerHTML={html(s.show || digits(s.text))} />)}</ul>
        ) : (
          <p className="mk-key" key={now.id} data-len={lenTag(keyHtml)} dangerouslySetInnerHTML={html(keyHtml)} />
        )}
        <div className="mk-dots">{segments.map((s, i) => <i key={s.id} className={i === beat ? 'on' : (i < beat ? 'done' : '')} />)}</div>
        {review && <p className="mk-review">{t("Takrorlash: ekran tayyor holatda, ovozsiz. Ovoz bilan qayta eshitish — tepadagi «↺ boshidan». To'liq matn — «Matn».", 'Повтор: экран в готовом виде, без звука. Послушать заново со звуком — «↺ с начала» вверху. Полный текст — «Текст».')}</p>}
        {asking && (
          <div className="mk-ask"><p>{now.ask.q}</p><div className="row">{now.ask.opts.map((o, i) => <button key={i} className="mk-btn ghost sm" onClick={() => answerAsk(now.id, i)}>{o}</button>)}</div></div>
        )}
        {prevAsk && guess && guess[prevAsk.id] !== undefined && (
          <div className="mk-ask" style={{ borderColor: guess[prevAsk.id] === prevAsk.ask.answer ? T.green : T.ink3, background: guess[prevAsk.id] === prevAsk.ask.answer ? '#E3F5EC' : '#F0F2F5' }}>
            <div className="res">{t('Sizning javobingiz:', 'Ваш ответ:')} <b>{prevAsk.ask.opts[guess[prevAsk.id]]}</b> — {guess[prevAsk.id] === prevAsk.ask.answer ? t("to'g'ri", 'верно') : t('aslida: ', 'на самом деле: ') + prevAsk.ask.opts[prevAsk.ask.answer]}</div>
          </div>
        )}
        {showManual && <div style={{ marginTop: 14 }}><button className="mk-btn soft sm" onClick={stepManual}>{t('Keyingi qadam →', 'Следующий шаг →')}</button></div>}
        {below && <div className="mk-below">{below}</div>}
      </div>
    </div>
  );
}

// Kod/terminal paneli: satr `at` qadamida kiradi; `focus` id'lari yoritiladi, qolgani xiralashadi; `onLine` — bosiladigan
// F-1103-04 (03.11, foydalanuvchi «1 qator kod 3 qator bo'lmasin»): kod HECH QACHON o'ralmaydi — `wrap` prop e'tiborsiz (eski chaqiruvlar buzilmasin).
// Uzun qator — darsda Prettier (80 belgi) bilan bo'linadi; sig'masa panel ichida gorizontal skroll.
function CodePanel({ file, lines, beat = 99, focus = [], numbers = true, style, onLine, marks = {} }) {
  const anyFocus = focus.length > 0;
  const ref = useRef(null);
  const focusKey = focus.join('|');
  // Kichik ekran (1280×720 va past): yoritilgan yoki shu qadamda kirgan satr ko'rinib tursin — panelning o'zi yoki
  // eng yaqin aylanadigan konteyner (VS Code oynasining editori / sahna) aylantiriladi; sahifaning o'zi hech qachon
  useEffect(() => {
    const p = ref.current; if (!p) return;
    const hls = Array.from(p.querySelectorAll('.mk-ln.hl'));
    const first = hls[0] || Array.from(p.querySelectorAll('.mk-ln.in')).filter((n) => n.dataset.at === String(beat)).pop();
    if (!first) return;
    const last = hls.length ? hls[hls.length - 1] : first;
    const box = scrollBox(p); if (!box) return;
    const br = box.getBoundingClientRect(), fr = first.getBoundingClientRect(), lr = last.getBoundingClientRect();
    const top = fr.top - br.top + box.scrollTop - 12, bottom = lr.bottom - br.top + box.scrollTop + 12, h = box.clientHeight;
    if (top >= box.scrollTop && bottom <= box.scrollTop + h) return;            // butun blok ko'rinib turibdi
    const want = (bottom - top > h || top < box.scrollTop) ? top : bottom - h; // sig'masa — boshidan; pastga chiqsa — oxirini ko'rsat
    box.scrollTo({ top: Math.max(0, want), behavior: 'smooth' });
  }, [beat, focusKey]);
  return (
    <div className="mk-panel" style={style} ref={ref}>
      {file && <span className="fn">{file}</span>}
      <div style={{ paddingTop: file ? 10 : 0 }}>
        {lines.map((l, i) => {
          const v = vis(l.at, beat);
          const hl = anyFocus && l.id && focus.includes(l.id);
          const mk = marks[i] || '';
          const cls = `mk-ln${v ? ' in' : ''}${hl ? ' hl' : (anyFocus && v && !l.keep ? ' dim' : '')}${l.gone ? ' gone' : ''}${l.neu ? ' new' : ''}${onLine ? ' clk' : ''}${mk ? ' ' + mk : ''}`;
          return <div key={i} className={cls} data-at={l.at} onClick={onLine ? () => onLine(i, l) : undefined}>{numbers && <span className="n">{l.n != null ? l.n : i + 1}</span>}<span dangerouslySetInnerHTML={html(l.h)} /></div>;
        })}
      </div>
    </div>
  );
}

function Block({ at, beat, dim, className = '', style, children }) {
  return <div className={`mk-in${vis(at, beat) ? ' on' : ''}${dim ? ' dim' : ''} ${className}`} style={style} data-at={at}>{children}</div>;
}
// Eng yaqin aylanadigan konteyner (o'zi ham), .mk-stage gacha — sahifa siljimasin (1280×720 da sarlavha tugmalarni yopgan edi)
function scrollBox(el) {
  for (let n = el; n && !(n.classList && n.classList.contains('mk-stage')); n = n.parentElement) {
    const o = getComputedStyle(n).overflowY;
    if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 4) return n;
  }
  return null;
}

// Brauzer kartasi: manzil + javob (terminaldan alohida, chunki mentor brauzerda ko'radi)
function Browser({ url, out, er }) {
  return <div className="mk-light mk-browser"><span className="url">{url}</span><span className={`out${er ? ' er' : ''}`}>{out}</span></div>;
}

// Explorer (VS Code) — MENTOR_DARS_ETALON 1-qonun (F-1030-10): loyiha fayli ko'rsatilgan HAR sahnada chapda.
// `files` — shu paytgacha mavjud fayllar (yo'li bilan), `active` — hozir ochiq fayl (yoritiladi), `fresh` — shu qadamda paydo bo'lgan,
// `onOpen` — bosilsa ochiladi (amaliyotda), `big`+`desc` — S5a'dagi katta ko'rinish (vazifa izohi bilan).
// Darsga xos sozlama — har dars o'z bo'lagining boshida to'ldiradi: loyiha nomi (Explorer sarlavhasi), standart fayl ro'yxati,
// qo'shimcha fayl ranglari (kind(f) → rang yoki null; null bo'lsa quyidagi umumiy qoida). Dvigatelda darsga xos qiymat yo'q.
const MKCFG = { root: 'project', files: [], kind: null };
const FILE_KIND = (f) => (MKCFG.kind && MKCFG.kind(f)) || (/\.module\.ts$/.test(f) ? PART.mod : /\.controller\.ts$/.test(f) ? PART.ctrl : /\.service\.ts$/.test(f) ? PART.svc : /main\.ts$/.test(f) ? T.ink2 : T.ink3);
const baseName = (f) => f.split('/').pop();
// F-1031-02: VS Code'dagidek daraja chiziqlari — har ota-papka uchun bitta vertikal chiziq (qaysi fayl qaysi papkada — ko'rinadi).
// shift: fayl qatorida chap ramka 3px (faol fayl belgisi) — chiziq papka qatoridagi bilan bir tekisda tursin.
// step: daraja oralig'i — katta xaritada (big) 18px, oddiy Explorer'da 12px.
const treeGuides = (depth, shift, step) => Array.from({ length: depth }, (_, l) => <b key={'g' + l} className="ig" style={{ left: 12 + l * step - shift }} />);
// F-1031-04: '/' bilan tugagan yozuv — yopiq papka (▸, ichi ochilmaydi; loyihaning to'liq ko'rinishi uchun).
// clickable: berilsa, faqat shu fayllar bosiladi, qolganlari xira turadi (bosilmaydi).
function FileTree({ root = MKCFG.root, files = MKCFG.files, active, onOpen, big, desc, fresh = [], clickable }) {
  const rows = []; const seenDir = new Set(); const step = big ? 18 : 12;
  files.forEach((f) => {
    const shut = f.endsWith('/');
    const parts = (shut ? f.slice(0, -1) : f).split('/'); const name = shut ? null : parts.pop();
    let path = '';
    parts.forEach((d, i) => { path += d + '/'; if (!seenDir.has(path)) { seenDir.add(path); rows.push({ dir: true, depth: i, t: d + '/', shut: shut && i === parts.length - 1 }); } });
    if (!shut) rows.push({ f, name, depth: parts.length, c: FILE_KIND(f) });
  });
  const can = (f) => !!onOpen && (!clickable || clickable.includes(f));
  return <div className={`mk-explorer${big ? ' big' : ''}`}>
    <div className="hd">Explorer · {root}</div>
    {rows.map((r, i) => r.dir
      ? <div key={'d' + i} className={`dir${r.shut ? ' shut' : ''}`} style={{ paddingLeft: 8 + r.depth * step }}>{treeGuides(r.depth, 0, step)}{r.shut && <span className="chev" aria-hidden="true">▸</span>}{r.t}</div>
      : <div key={r.f} className={`fi${r.f === active ? ' on' : ''}${can(r.f) ? ' clk' : ''}${clickable && !can(r.f) && r.f !== active ? ' mute' : ''}${fresh.includes(r.f) ? ' new' : ''}`} style={{ '--c': r.c, paddingLeft: 8 + r.depth * step }} onClick={can(r.f) ? () => onOpen(r.f) : undefined}>
          {treeGuides(r.depth, 3, step)}<i /><span>{r.name}</span>{desc && desc[r.f] && <span className="d">{desc[r.f]}</span>}
        </div>)}
  </div>;
}
// Bitta VS Code oynasi (F-1030-22): sarlavha · chapda Explorer · o'ngda editor (kod panelida fayl yorlig'i — tab)
function Ide({ root = MKCFG.root, files, active, onOpen, fresh, clickable, children, style }) {
  return <div className="mk-ide" style={style}>
    <div className="mk-ide-bar"><i /><i /><i /><span>{root} — Visual Studio Code</span></div>
    <FileTree root={root} files={files} active={active} onOpen={onOpen} fresh={fresh} clickable={clickable} />
    <div className="mk-ide-main">{children}</div>
  </div>;
}

// Oddiy ekran qolipi: Say + sahna. Davom QULF: ovoz tugamaguncha (va `ready` bo'lmaguncha) bosilmaydi — MENTOR_DARS_ETALON 4-qonun (F-1030-01);
// ekran avval to'liq ko'rilgan bo'lsa (p.seen) — qulf yo'q, chunki mentor qaytib kelgan.
function Lesson({ p, S, scene, below, ready, sceneTop }) {
  const b = useBeats(S.segments, p.review);
  const ok = ready ? ready(b) : true;
  const canNext = (b.done && ok) || p.seen;
  // Kichik ekran: sahna sig'masa, shu qadamda paydo bo'lgan oxirgi blok ko'rinishga aylantiriladi (pastda yashirinib qolmasin)
  const sceneRef = useRef(null);
  // Faqat AYNAN shu qadamda paydo bo'lgan blok uchun (aks holda kod panelining yoritish-aylantirishini bosib ketadi)
  useEffect(() => {
    const s = sceneRef.current; if (!s) return;
    const last = Array.from(s.querySelectorAll('.mk-in.on')).filter((n) => n.dataset.at === String(b.beat)).pop(); if (!last) return;
    const box = scrollBox(last.parentElement); if (!box) return;
    const r = last.getBoundingClientRect(), br = box.getBoundingClientRect();
    if (r.bottom > br.bottom) box.scrollTo({ top: box.scrollTop + (r.bottom - br.bottom) + 12, behavior: 'smooth' });
  }, [b.beat]);
  return (
    <Stage kicker={S.kicker} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={b.done && ok} nextDisabled={!canNext} lockHint={!b.done ? t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит') : (S.lockHint || t('Topshiriqni bajaring', 'Выполните задание'))}>
      <div className="mk-body">
        <Say eyebrow={S.eyebrow} title={S.title} segments={S.segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} below={below ? below(b) : null} review={p.review} />
        {/* UX-3: hamma ekranda sahna yuqoridan — Davom bosilganda oyna sakramaydi */}
        <div ref={sceneRef} className="mk-scene top" style={{ overflow: 'auto' }} data-top={sceneTop ? 1 : 0}>{scene(b)}</div>
      </div>
    </Stage>
  );
}

// Tekshiruv (tanlov): xato variant yopiladi, to'g'risini topguncha bosadi
// `after` — to'g'ri javobdan keyin ko'rsatiladigan blok (masalan tuzatilgan fayl, 2-qonun, F-1030 qo'shimcha 1)
// F-1103-02 (A varianti): `above` — savoldan oldin ko'rinadigan material (terminal, kod, xabar); `after` — to'g'ri javobdan keyin isbot;
// `demak` — javobdan keyin o'ng ustun ostidagi bitta «Demak, …» gapi. Karta yo'q: sabab variantning ichida (to'g'risi yashil, xatosi qizil).
function MCRetry({ idx, total, onBack, onNext, onRestart, stored, onAnswer, review, kicker, eyebrow, title, q, opts, correct, ok, okShort, wrong, above, after, demak }) {
  const segs = useMemo(() => review ? [] : [{ id: 'q', text: voice(q), trigger: 'on_mount', waits_for: { type: 'option_picked' } }], [q, review]);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [bad, setBad] = useState(stored ? stored.bad || [] : []);
  const [solved, setSolved] = useState(!!(stored && stored.correct));
  const [last, setLast] = useState(stored && stored.correct ? correct : null);
  const pick = (i) => {
    if (solved || bad.includes(i)) return;
    if (bad.length === 0) audio.triggerEvent('option_picked');
    if (i === correct) {
      setSolved(true); setLast(i); sfx.playCorrect();
      onAnswer({ picked: i, correct: true, tries: bad.length + 1, firstTry: bad.length === 0, bad, type: 'mc' });
      setTimeout(() => audio.pushOneOff(voice(ok)), 300);
    } else {
      const nb = [...bad, i]; setBad(nb); setLast(i); sfx.playWrong();
      setTimeout(() => audio.pushOneOff(voice((wrong[i] || t('Unday emas.', 'Не совсем.')) + t(" Yana o'ylab ko'ring.", ' Подумайте ещё раз.'))), 300);
    }
  };
  // F-1102-16: tuzatilgan/haqiqiy natija bloki bo'lsa — ekran BOSHIDAN ikki ustun va joyi qimirlamaydi:
  // chapda savol va variantlar, o'ngda xabar (above) va javobdan keyin uning ostida natija (after).
  // Javobdan keyin variantlar o'z joyida qoladi (to'g'risi yashil, qolgani xira) — hech narsa sakramaydi.
  const split = !!(after || above);
  return (
    <Stage kicker={kicker} idx={idx} total={total} audio={audio} onBack={onBack} onNext={onNext} onRestart={onRestart} nextReady={solved} nextDisabled={!solved} lockHint={t("To'g'ri javobni toping", 'Найдите верный ответ')}>
      <div className={`mk-body${split ? ' mc-split' : ''}`} style={split ? undefined : { gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        {/* UX-5: savol bloki xavfsiz markazda (sig'masa tepasi kesilmaydi), variantlar 18 px */}
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          <p className="mk-eyebrow">{eyebrow} · {t('1-urinish hisoblanadi', 'считается 1-я попытка')}</p>
          {!split && above}
          <h2 className="mk-title mc-q" data-len={lenTag(title)}>{title}</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {opts.map((o, i) => {
              let cls = 'mk-opt';
              if (solved) cls += i === correct ? ' ok' : ' off';
              else if (bad.includes(i)) cls += ' bad';
              const why = solved && i === correct ? (okShort || digits(ok)) : (bad.includes(i) ? digits(wrong[i] || '') : null);
              return <button key={i} className={cls} disabled={solved || bad.includes(i)} onClick={() => pick(i)}><span className="l">{String.fromCharCode(65 + i)}</span><span className="t"><span>{o}</span>{why ? <small className="why">{why}</small> : null}</span></button>;
            })}
          </div>
        </div>
        {split && <div className="mk-scene top mc-after">
          {above}
          {solved
            ? (after ? <div className="mc-proof" style={{ animation: 'mk-up .45s ease both' }}>{after}</div> : null)
            : (above ? null : <div className="mc-wait">{t("Javobdan keyin shu yerda haqiqiy natija", 'После ответа здесь — реальный результат')}</div>)}
          {demak ? <div className={`mc-demak${solved ? ' on' : ''}`}>{solved ? <><b>{t('Demak,', 'Значит,')}</b><span>{demak}</span></> : null}</div> : null}
        </div>}
      </div>
    </Stage>
  );
}

// Tekshiruv (qaysi satr xato): kod ko'rsatiladi, mentor satrni bosadi, topguncha bosadi.
// `task` — shart (ekranga xos, F-1030-11); `fixed` — topilgach TUZATILGAN kod (eski satr chizilgan, yangisi yashil) — 2-qonun (F-1030-14);
// `fixedExtra` — tuzatish boshqa faylga ham tegsa; `tree` — Explorer {root, files, active}.
function LineCheck({ idx, total, onBack, onNext, onRestart, stored, onAnswer, review, kicker, eyebrow, title, q, task, file, lines, target, ok, okShort, hint, fixed, fixedExtra, tree }) {
  const targets = Array.isArray(target) ? target : [target];
  const segs = useMemo(() => review ? [] : [{ id: 'q', text: voice(q), trigger: 'on_mount', waits_for: { type: 'option_picked' } }], [q, review]);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [bad, setBad] = useState(stored ? stored.bad || [] : []);
  const [solved, setSolved] = useState(!!(stored && stored.correct));
  const marks = {}; bad.forEach((i) => { marks[i] = 'bad'; }); if (solved) targets.forEach((t) => { marks[t] = 'good'; });
  const onLine = (i, l) => {
    if (solved || bad.includes(i) || !l.h.trim()) return;
    if (bad.length === 0) audio.triggerEvent('option_picked');
    if (targets.includes(i)) { setSolved(true); sfx.playCorrect(); onAnswer({ picked: i, correct: true, tries: bad.length + 1, firstTry: bad.length === 0, bad, type: 'mc' }); setTimeout(() => audio.pushOneOff(voice(ok)), 300); }
    else { setBad((b) => [...b, i]); sfx.playWrong(); setTimeout(() => audio.pushOneOff(voice(hint)), 300); }
  };
  const showFixed = solved && fixed;
  const panels = showFixed
    ? (<>
        <div className="mk-tag" style={{ color: T.green, margin: 0 }}>{t('Tuzatildi — eski satr chizilgan, yangisi yashil', 'Исправлено — старая строка зачёркнута, новая зелёная')}</div>
        <CodePanel file={file} lines={fixed} />
        {(fixedExtra || []).map((x) => <CodePanel key={x.file} file={x.file} lines={x.lines} />)}
      </>)
    : <CodePanel file={file} lines={lines} onLine={solved ? undefined : onLine} marks={marks} />;
  return (
    <Stage kicker={kicker} idx={idx} total={total} audio={audio} onBack={onBack} onNext={onNext} onRestart={onRestart} nextReady={solved} nextDisabled={!solved} lockHint={t('Xato satrni toping', 'Найдите строку с ошибкой')}>
      <div className="mk-body">
        <div className="mk-say">
          <p className="mk-eyebrow">{eyebrow} · {t('1-urinish hisoblanadi', 'считается 1-я попытка')}</p>
          <h2 className="mk-title" data-len={lenTag(title)}>{title}</h2>
          <p className="mk-now" dangerouslySetInnerHTML={html(task || t('Kodda bitta xato bor. Xato satrni bosing.', 'В коде одна ошибка. Нажмите на строку с ошибкой.'))} />
          {(bad.length > 0 || solved) && (
            <div className="mk-fb" key={bad.length + (solved ? 'ok' : '')} style={{ '--c': solved ? T.green : T.accent, '--bg': solved ? '#E3F5EC' : '#FFF0EB' }}>
              <b>{solved ? t("To'g'ri", 'Верно') : t('Bu satr emas', 'Не эта строка')}</b><span>{solved ? (okShort || digits(ok)) : digits(hint)}</span>
            </div>
          )}
        </div>
        <div className="mk-scene top" style={{ overflow: 'auto' }}>{tree ? <Ide root={tree.root} files={tree.files} active={tree.active}>{panels}</Ide> : panels}</div>
      </div>
    </Stage>
  );
}

// Amaliyot ekrani: qadamlar (katakcha, nusxalash), «boshqacha chiqsa» jadvali, ixtiyoriy kod ko'rinishi
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return <button className="mk-copy" onClick={() => { try { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); } catch (e) {} }}>{ok ? t('nusxalandi', 'скопировано') : t('nusxalash', 'копировать')}</button>;
}
const plain = (lines) => lines.map((l) => l.h.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\\`/g, '`').replace(/\\\$/g, '$')).join('\n');
// «Boshqacha chiqdimi?» oynasi (F-1102-12): sahifa ustida, orqa fon xiralashadi; ✕ / tashqarini bosish / Esc — yopadi
function TroubleModal({ rows, onClose }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="mk-modal" role="dialog" aria-modal="true" aria-label={t('Boshqacha chiqdimi?', 'Вышло иначе?')} onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="hd">
          <b>{t('Boshqacha chiqdimi?', 'Вышло иначе?')}</b>
          {rows.length > 1 && <span>{t(`${rows.length - 1} ta holat va yechim`, `ситуации и решения: ${rows.length - 1}`)}</span>}
          <button type="button" className="x" aria-label={t('Yopish', 'Закрыть')} onClick={onClose}>✕</button>
        </div>
        <div className="bd"><table className="mk-tbl"><tbody>{rows.map(([a, c]) => <tr key={a}><td><code>{a}</code></td><td>{c}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}
// Davom QULF: ovoz tugamaguncha + hamma katakcha + isbot to'g'ri bo'lmaguncha (F-1030-01). Kod: har qadam ichida «Kodni ochish» tugmasi,
// sahnada Explorer — fayl bosilsa almashadi (F-1030-12); `code[i].step` — qaysi qadamga tegishli.
function Practice({ p, S, steps, trouble, code, proof, tree }) {
  const b = useBeats(S.segments, p.review);
  const { seg, beat } = b;
  const [checked, setChecked] = useState(p.stored && p.stored.checked ? p.stored.checked : []);
  const [proofVal, setProofVal] = useState(p.stored && p.stored.proof ? p.stored.proof : '');
  const [openFile, setOpenFile] = useState(null);
  const [tOpen, setTOpen] = useState(false); // F-1031-03: «Boshqacha chiqdimi?» jadvali yopiq, bosilganda ochiladi
  const proofOk = !proof || proof.check(proofVal.trim());
  const report = (n, pv) => p.onAnswer({ type: 'practice', checked: n, proof: pv, proofOk: !proof || proof.check(pv.trim()), done: n.length === steps.length && (!proof || proof.check(pv.trim())) });
  const toggle = (i) => { const n = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i]; setChecked(n); report(n, proofVal); };
  const onProof = (v) => { setProofVal(v); report(checked, v); };
  const allDone = checked.length === steps.length && proofOk;
  const rows = trouble ? [...trouble, HELP_ROW] : [HELP_ROW];
  const cur = code && openFile ? code.find((c) => c.file === openFile) : null;
  return (
    <Stage kicker={S.kicker} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={b.done && allDone} nextDisabled={!(b.done && allDone)} lockHint={!allDone ? (proof ? t("Katakchalar va isbotni to'ldiring", 'Отметьте пункты и заполните подтверждение') : t('Katakchalarni belgilang', 'Отметьте пункты')) : t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say eyebrow={S.eyebrow} title={S.title} segments={S.segments} beat={beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review}
          below={<><div className="mk-card" style={{ background: allDone ? '#E3F5EC' : T.paper, borderColor: allDone ? T.green : T.line }}><h5>{t('Bajarildi', 'Выполнено')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{checked.length} / {steps.length} {t('qadam', 'шагов')}{proof ? (proofOk && proofVal.trim() ? t(' · isbot ✓', ' · подтверждение ✓') : t(' · isbot kutilmoqda', ' · ждём подтверждение')) : ''}{allDone ? (b.done ? t(' — Davom bosing', ' — нажмите «Далее»') : t(' — ovoz tugagach Davom ochiladi', ' — «Далее» откроется после озвучки')) : ''}</div>
            {/* F-1102-20: isbot maydoni to'ldirilmaguncha yumshoq yonib-o'chadi — «shu yerga yozing» ko'rinib tursin */}
            {proof && <div style={{ marginTop: 10 }}><div className="exp" style={{ marginBottom: 4, fontWeight: 700, color: proofOk && proofVal.trim() ? T.green : T.ink }}>{t('Isbot', 'Подтверждение')}: {String(proof.label).replace(/^(Isbot|Подтверждение)\s*:\s*/, '')}</div><input className={`mk-input${proofOk && proofVal.trim() ? '' : ' need'}`} value={proofVal} placeholder={proof.placeholder} onChange={(e) => onProof(e.target.value)} />{proofVal.trim() && !proofOk && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{proof.wrong}</div>}</div>}
          </div>
          {/* 04.11: «Boshqacha chiqdimi?» chap ustunda — o'ng ustun qadamlarga to'liq qoladi (1280×720 da kesilmasin) */}
          <Block at={S.tableAt} beat={beat}><div className="mk-light mk-trouble" style={{ padding: 0, marginTop: 10 }}>
              <button type="button" className={`mk-trbtn${beat === S.tableAt && !tOpen ? ' hot' : ''}`} aria-haspopup="dialog" aria-expanded={tOpen} onClick={() => setTOpen(true)}>
                <span className="q">{t('Boshqacha chiqdimi?', 'Вышло иначе?')}</span>
                {rows.length > 1 && <span className="n">{t(`${rows.length - 1} ta holat va yechim`, `ситуации и решения: ${rows.length - 1}`)}</span>}
                <span className="ar" aria-hidden="true">↗</span>
              </button>
            </div></Block></>} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {cur ? (<>
            {/* F-1031-05: qaytish tugmasi oynadan tashqarida, katta — kod ko'rilgach qadamlarga qaytish ko'rinib tursin */}
            <div className="mk-codebar">
              <button className="mk-btn" onClick={() => setOpenFile(null)}>{t('← Qadamlarga qaytish', '← Назад к шагам')}</button>
              <span className="what">{cur.copy === false ? t('Kod namunasi', 'Образец кода') : t('Kod', 'Код')} · <b>{baseName(cur.file)}</b></span>
              <span className="end">{cur.copy === false ? <span className="mk-tag" style={{ margin: 0, color: T.accent }}>{t("namuna — o'zingiz yozing, nusxalash yo'q", 'образец — напишите сами, без копирования')}</span> : <CopyBtn text={plain(cur.lines)} />}</span>
            </div>
            <Ide files={tree || code.map((c) => c.file)} clickable={code.map((c) => c.file)} active={cur.file} onOpen={setOpenFile}>
              <CodePanel file={cur.file} lines={cur.lines} style={{ fontSize: 12.5 }} />
            </Ide>
          </>) : (<>
            <div style={{ display: 'grid', gap: 8 }}>
              {steps.map((s, i) => {
                const c = code ? code.find((x) => x.step === i) : null;
                return (
                <div key={i} className={`mk-step${(seg.hl || []).includes(i) ? ' hl' : ''}`} style={{ opacity: (seg.hl || []).length && !seg.hl.includes(i) ? 0.55 : 1 }}>
                  <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} />
                  <div className="t"><b>{i + 1}. {s.t}</b>
                    {s.cmds.map((cm) => <div key={cm} className="cmd"><code>{cm}</code><CopyBtn text={cm} /></div>)}
                    {/* 04.11: «Kodni ochish» va «Kutilgan» bitta qatorda (sig'masa o'tadi) — 1280×720 da qadamlar sig'sin */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px', margin: c ? '4px 0 2px' : 0 }}>
                      {c && <button className="mk-btn soft sm" style={{ borderColor: T.ink, color: T.ink }} onClick={() => setOpenFile(c.file)}>{t('Kodni ochish', 'Открыть код')} · {baseName(c.file)}{c.copy === false ? t(' (namuna)', ' (образец)') : ''}</button>}
                      <div className="exp">{t('Kutilgan:', 'Ожидается:')} {s.exp}</div>
                    </div>
                  </div>
                </div>
              ); })}
            </div>
            {/* F-1102-12: jadval sahifa ichida emas — ustida oyna (popup). ✕, tashqarisi yoki Esc yopadi; tugma joyida qoladi */}
            {tOpen && <TroubleModal rows={rows} onClose={() => setTOpen(false)} />}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ---------- Progress saqlovi (F-1103-06, 03.11): mentor darsni bo'lib o'tadi ----------
// O'quvchi darslaridagi ccProgress kabi — brauzer xotirasida: ekran, ko'rilgan ekranlar, javoblar.
// Ekranlar soni o'zgargan bo'lsa (dars qayta qurilgan) eski yozuv olinmaydi. startAt (dev) bo'lsa saqlov o'qilmaydi.
// Qaytganda darhol ekranga tushilmaydi: brauzer ovozni faqat bosishdan keyin chaladi — kirish oynasida tugma.
const SAVE_KEY = (id) => `ccMentor:${id}`;
function loadSaved(id, total) {
  try {
    const v = JSON.parse(localStorage.getItem(SAVE_KEY(id)) || 'null');
    if (!v || v.v !== 1 || v.total !== total || typeof v.idx !== 'number' || v.idx < 1) return null;
    return v;
  } catch (e) { return null; }
}
function clearSaved(id) { try { localStorage.removeItem(SAVE_KEY(id)); } catch (e) {} }
function useMentorSave({ id, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saved = useMemo(() => (startAt != null ? null : loadSaved(id, total)), []);
  useEffect(() => {
    if (!started) return;
    try { localStorage.setItem(SAVE_KEY(id), JSON.stringify({ v: 1, total, idx, answers, seen, t: Date.now() })); } catch (e) {}
  }, [started, idx, answers, seen, id, total]);
  const start = useCallback((resume) => {
    if (resume && saved) { setIdx(Math.min(saved.idx, total - 1)); setAnswers(saved.answers || {}); setSeen(saved.seen || {}); }
    else clearSaved(id);
    setStarted(true);
  }, [saved, id, total, setIdx, setAnswers, setSeen, setStarted]);
  return { resume: saved, start };
}
function CoverStart({ onStart, resume }) {
  if (!resume) return <button className="mk-btn ready" onClick={() => onStart(false)}>{t('Boshlash →', 'Начать →')}</button>;
  return (
    <div className="mk-resume">
      <button className="mk-btn ready" onClick={() => onStart(true)}>{t(`${resume.idx + 1}-ekrandan davom etish →`, `Продолжить с ${resume.idx + 1}-го экрана →`)}</button>
      <button className="mk-btn soft" onClick={() => onStart(false)}>{t('Boshidan boshlash', 'Начать сначала')}</button>
      <p className="mk-resume-note">{t(`Oxirgi marta ${resume.idx + 1}-ekrangacha kelgansiz. Javoblaringiz saqlangan.`, `В прошлый раз вы дошли до ${resume.idx + 1}-го экрана. Ответы сохранены.`)}</p>
    </div>
  );
}

// AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-kod.py — OrderBotNest teglari, yml variantlari, toza-muhit chiqishlari va haqiqiy GitHub Actions run'lari (qo'lda tahrirlanmaydi)
const KOD_ORDER_36 = {
 "file": "src/api/order/order.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "          lock: { mode: 'pessimistic_write' },",
   "n": 33
  },
  {
   "t": "        });",
   "n": 34
  },
  {
   "t": "        if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
   "n": 35
  },
  {
   "t": "        if (p.stock < c.qty) {",
   "n": 36
  },
  {
   "t": "          throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
   "n": 37
  },
  {
   "t": "        }",
   "n": 38
  },
  {
   "t": "        // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.",
   "n": 39
  },
  {
   "t": "        //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi",
   "n": 40
  }
 ]
};
const KOD_USER_20 = {
 "file": "src/api/user/user.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "  async getOrCreate(from: { id: number; first_name: string }): Promise<User> {",
   "n": 15
  },
  {
   "t": "    const telegram_id = String(from.id); // BIGINT bazadan matn bo'lib keladi — biz ham matn saqlaymiz",
   "n": 16
  },
  {
   "t": "    const role: Role = config.ADMIN_TELEGRAM_IDS.includes(from.id)",
   "n": 17
  },
  {
   "t": "      ? 'admin'",
   "n": 18
  },
  {
   "t": "      : 'customer';",
   "n": 19
  },
  {
   "t": "    let user = await this.repo.findOne({ where: { telegram_id } });",
   "n": 20
  },
  {
   "t": "    if (!user) {",
   "n": 21
  },
  {
   "t": "      user = this.repo.create({ telegram_id, name: from.first_name, role });",
   "n": 22
  },
  {
   "t": "      return this.repo.save(user);",
   "n": 23
  }
 ]
};
const KOD_PKG_TELEGRAF = {
 "file": "package.json",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "    \"reflect-metadata\": \"^0.2.2\",",
   "n": 28
  },
  {
   "t": "    \"rxjs\": \"^7.8.1\",",
   "n": 29
  },
  {
   "t": "    \"telegraf\": \"^4.16.3\",",
   "n": 30
  },
  {
   "t": "    \"typeorm\": \"^1.1.2\"",
   "n": 31
  },
  {
   "t": "  },",
   "n": 32
  }
 ]
};
const KOD_LOCK_TELEGRAF = {
 "file": "package-lock.json",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "    \"node_modules/telegraf\": {",
   "n": 8158
  },
  {
   "t": "      \"version\": \"4.16.3\",",
   "n": 8159
  },
  {
   "t": "      \"resolved\": \"https://registry.npmjs.org/telegraf/-/telegraf-4.16.3.tgz\",",
   "n": 8160
  }
 ]
};
const KOD_CI_DONE = {
 "file": ".github/workflows/ci.yml",
 "tag": "cicd1-done",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 13
  },
  {
   "t": "      - run: npm test",
   "n": 14
  },
  {
   "t": "      - run: npm run build",
   "n": 15
  }
 ]
};
const KOD_YML_1_TAVSIYA = {
 "file": ".github/workflows/ci.yml",
 "tag": "1-tavsiya.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 13
  },
  {
   "t": "      - run: npm test",
   "n": 14
  },
  {
   "t": "      - run: npm run build",
   "n": 15
  }
 ]
};
const KOD_YML_2_CHECKOUT_YOQ = {
 "file": ".github/workflows/ci.yml",
 "tag": "2-checkout-yoq.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 7
  },
  {
   "t": "        with:",
   "n": 8
  },
  {
   "t": "          node-version: 24",
   "n": 9
  },
  {
   "t": "      - run: npm ci",
   "n": 10
  },
  {
   "t": "      - run: npm test",
   "n": 11
  }
 ]
};
const KOD_YML_3_RUNS_ON_YOQ = {
 "file": ".github/workflows/ci.yml",
 "tag": "3-runs-on-yoq.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    steps:",
   "n": 5
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 6
  },
  {
   "t": "      - run: npm test",
   "n": 7
  }
 ]
};
const KOD_YML_4_SURILISH_XATO = {
 "file": ".github/workflows/ci.yml",
 "tag": "4-surilish-xato.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "    - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - run: npm ci",
   "n": 8
  },
  {
   "t": "      - run: npm test",
   "n": 9
  }
 ]
};
const KOD_YML_5_NPM_INSTALL = {
 "file": ".github/workflows/ci.yml",
 "tag": "5-npm-install.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "      - run: npm install",
   "n": 11
  },
  {
   "t": "      - run: npm test",
   "n": 12
  }
 ]
};
const KOD_YML_6_TSC_YOQ = {
 "file": ".github/workflows/ci.yml",
 "tag": "6-tsc-yoq.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npm test",
   "n": 13
  }
 ]
};
const KOD_YML_AI1 = {
 "file": ".github/workflows/test.yml",
 "tag": "ai1",
 "lines": [
  {
   "t": "name: Tests",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "on:",
   "n": 3
  },
  {
   "t": "  push:",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "jobs:",
   "n": 6
  },
  {
   "t": "  test:",
   "n": 7
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 8
  },
  {
   "t": "",
   "n": 9
  },
  {
   "t": "    steps:",
   "n": 10
  },
  {
   "t": "      - name: Kodni yuklab olish",
   "n": 11
  },
  {
   "t": "        uses: actions/checkout@v4",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "      - name: Node.js 22 o'rnatish",
   "n": 14
  },
  {
   "t": "        uses: actions/setup-node@v4",
   "n": 15
  },
  {
   "t": "        with:",
   "n": 16
  },
  {
   "t": "          node-version: 22",
   "n": 17
  },
  {
   "t": "          cache: npm",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "      - name: Kutubxonalarni o'rnatish",
   "n": 20
  },
  {
   "t": "        run: npm ci",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "      - name: Testlar",
   "n": 23
  },
  {
   "t": "        run: npm test",
   "n": 24
  }
 ]
};
const KOD_YML_AI2 = {
 "file": ".github/workflows/ci.yml",
 "tag": "ai2",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "on:",
   "n": 3
  },
  {
   "t": "  push:",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "permissions:",
   "n": 6
  },
  {
   "t": "  contents: read",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "jobs:",
   "n": 9
  },
  {
   "t": "  test:",
   "n": 10
  },
  {
   "t": "    name: Jest testlar",
   "n": 11
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "    steps:",
   "n": 14
  },
  {
   "t": "      - name: Kodni olish",
   "n": 15
  },
  {
   "t": "        uses: actions/checkout@v4",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "      - name: Node.js o'rnatish",
   "n": 18
  },
  {
   "t": "        uses: actions/setup-node@v4",
   "n": 19
  },
  {
   "t": "        with:",
   "n": 20
  },
  {
   "t": "          node-version: 22",
   "n": 21
  },
  {
   "t": "          cache: npm",
   "n": 22
  },
  {
   "t": "",
   "n": 23
  },
  {
   "t": "      - name: Bog'liqliklarni o'rnatish",
   "n": 24
  },
  {
   "t": "        run: npm ci",
   "n": 25
  },
  {
   "t": "",
   "n": 26
  },
  {
   "t": "      - name: Testlarni ishga tushirish",
   "n": 27
  },
  {
   "t": "        run: npm test",
   "n": 28
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nHEAD e15a44c jest2-done: xato yo'li va chegara testlari — isPhone al\nWed Nov  4 05:19:25 PM +05 2026";
const KOD_OUT_01 = "# Toza clone (node_modules yo'q) — CI mashinasidagi kabi\n$ ls\nnest-cli.json\npackage.json\npackage-lock.json\nREADME.md\nscripts\nsrc\ntsconfig.json\n\n$ npm ci --no-audit --no-fund\nnpm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me\n\nadded 633 packages in 5s\nnpm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:\nnpm warn allow-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)\nnpm warn allow-scripts\nnpm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.\n[chiqish kodi: 0 · 5.7 s]\n\n$ npx tsc --noEmit\n[chiqish kodi: 0 · 2.6 s]\n\n$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nPASS src/api/telegram/phone.spec.ts\nPASS src/api/telegram/texts.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/app.controller.spec.ts\nPASS src/api/order/order.service.spec.ts\n\nTest Suites: 5 passed, 5 total\nTests:       25 passed, 25 total\nSnapshots:   0 total\nTime:        1.423 s\nRan all test suites.\n[chiqish kodi: 0 · 2.2 s]\n\n$ npm run build\n\n> order-bot-nest@1.0.0 build\n> nest build\n\n[chiqish kodi: 0 · 3.5 s]\n\n$ ls dist | head\napi\nconfig\ncore\ninfrastructure\nmain.d.ts\nmain.js\nmain.js.map\ntsconfig.tsbuildinfo";
const KOD_OUT_02 = "# order.service.ts 36: < → <= (chegara buzildi)\n$ npm ci && npx tsc --noEmit && npm test && npm run build\nnpm ci ✓\ntsc ✓\n> order-bot-nest@1.0.0 test\n> jest\nFAIL src/api/order/order.service.spec.ts\n  ● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi\n    Kolonka: omborda faqat 2 ta qoldi\n      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n      36 |         if (p.stock <= c.qty) {\n    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n         |                 ^\n      38 |         }\n      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\nPASS src/api/app.controller.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/telegram/texts.spec.ts\nPASS src/api/telegram/phone.spec.ts\nTest Suites: 1 failed, 4 passed, 5 total\nTests:       1 failed, 24 passed, 25 total\nSnapshots:   0 total\nTime:        1.159 s\nRan all test suites.\n[chiqish kodi: 1]";
const KOD_OUT_03 = "# package.json ga dayjs qo\\x27shildi, package-lock.json o\\x27zgarmadi\n$ npm ci --no-audit --no-fund\nnpm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me\n\nadded 633 packages in 5s\nnpm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:\nnpm warn allow-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)\nnpm warn allow-scripts\nnpm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.\n[chiqish kodi: 0 · 5.2 s]";
const KOD_OUT_03B = "# package.json: telegraf ^4.16.3 → ^5.0.0, package-lock.json eski\n30:    \"telegraf\": \"^5.0.0\",\n$ npm ci --no-audit --no-fund\nnpm error code ETARGET\nnpm error notarget No matching version found for telegraf@^5.0.0.\nnpm error notarget In most cases you or one of your dependencies are requesting a package version that doesn't exist.\nnpm error A complete log of this run can be found in: /home/kali/.npm/_logs/2026-11-04T12_28_08_703Z-debug-0.log\n[chiqish kodi: 1]";
const KOD_OUT_03C = "# package.json: telegraf ^4.16.3 → 4.16.0 (mavjud versiya), package-lock.json da 4.16.3\n30:    \"telegraf\": \"4.16.0\",\n$ npm ci --no-audit --no-fund\nnpm error code EUSAGE\nnpm error\nnpm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.\nnpm error\nnpm error Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0\nnpm error\nnpm error Clean install a project\nnpm error\nnpm error Usage:\nnpm error npm ci\nnpm error\nnpm error Options:\nnpm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]\nnpm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]\nnpm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]\nnpm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]\nnpm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]\nnpm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]\nnpm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]\nnpm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]\nnpm error [--no-bin-links] [--no-fund] [--dry-run]\nnpm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]\nnpm error [--workspaces] [--include-workspace-root] [--install-links]\nnpm error\nnpm error   --install-strategy\nnpm error     Sets the strategy for installing packages in node_modules.\nnpm error\nnpm error   --legacy-bundling\nnpm error     Instead of hoisting package installs in `node_modules`, install packages\nnpm error\nnpm error   --global-style\nnpm error     Only install direct dependencies in the top level `node_modules`,\nnpm error\nnpm error   --omit\nnpm error     Dependency types to omit from the installation tree on disk.\nnpm error\nnpm error   --include\nnpm error     Option that allows for defining which types of dependencies to install.\nnpm error\nnpm error   --strict-peer-deps\nnpm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_\nnpm error\nnpm error   --foreground-scripts\nnpm error     Run all build scripts (ie, `preinstall`, `install`, and\nnpm error\nnpm error   --ignore-scripts\nnpm error     If true, npm does not run scripts specified in package.json files.\nnpm error\nnpm error   --allow-directory\nnpm error     Limits the ability for npm to install dependencies from directories.\nnpm error\nnpm error   --allow-file\nnpm error     Limits the ability for npm to install dependencies from tarball files.\nnpm error\nnpm error   --allow-git\nnpm error     Limits the ability for npm to fetch dependencies from git references.\nnpm error\nnpm error   --allow-remote\nnpm error     Limits the ability for npm to fetch dependencies from urls.\nnpm error\nnpm error   --allow-scripts\nnpm error     Comma-separated list of packages whose install-time lifecycle scripts\nnpm error\nnpm error   --strict-allow-scripts\nnpm error     If `true`, turn the install-script policy from a warning into a hard\nnpm error\nnpm error   --dangerously-allow-all-scripts\nnpm error     If `true`, bypass the `allowScripts` policy entirely and run every\nnpm error\nnpm error   --audit\nnpm error     When \"true\" submit audit reports alongside the current npm command to the\nnpm error\nnpm error   --bin-links\nnpm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package\nnpm error\nnpm error   --fund\nnpm error     When \"true\" displays the message at the end of each `npm install`\nnpm error\nnpm error   --dry-run\nnpm error     Indicates that you don't want npm to make any changes and that it should\nnpm error\nnpm error   -w|--workspace\nnpm error     Enable running a command in the context of the configured workspaces of the\nnpm error\nnpm error   --workspaces\nnpm error     Set to true to run the command in the context of **all** configured\nnpm error\nnpm error   --include-workspace-root\nnpm error     Include the workspace root when workspaces are enabled for a command.\nnpm error\nnpm error   --install-links\nnpm error     When set file: protocol dependencies will be packed and installed as\nnpm error\nnpm error\nnpm error aliases: clean-install, ic, install-clean, isntall-clean\nnpm error\nnpm error Run \"npm help ci\" for more info\nnpm error A complete log of this run can be found in: /home/kali/.npm/_logs/2026-11-04T12_28_42_555Z-debug-0.log\n[chiqish kodi: 1]";
const KOD_OUT_03D = "# Lokal: npm 11 (Node 24) bilan npm ci YASHIL edi (01). Runner: Node 22 → npm 10. Shu npm 10 bilan lokalda:\n$ node --version && npm --version\nv24.18.0\n11.16.0\n$ npx -p npm@10 npm --version\n10.9.9\n$ npx -p npm@10 npm ci --no-audit --no-fund\nnpm error code EUSAGE\nnpm error\nnpm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.\nnpm error\nnpm error Missing: webpack@5.112.2 from lock file\nnpm error\nnpm error Clean install a project\nnpm error\nnpm error Usage:\nnpm error npm ci\nnpm error\nnpm error Options:\n[chiqish kodi: 1]  # (zsh: PIPESTATUS bo'sh chiqdi; npm ci EUSAGE = 1 — run 10a/19 annotatsiyasi «exit code 1»)\n\n# npm 10 lock faylni qanday o'zgartirardi (faqat ko'rish, saqlanmaydi):\n$ npx -p npm@10 npm install --package-lock-only --no-audit --no-fund && git diff --stat\nup to date in 676ms\n package-lock.json | 91 ++++++++++++++++++++++++++-----------------------------\n 1 file changed, 43 insertions(+), 48 deletions(-)\n+      \"version\": \"5.112.2\",\n+      \"peer\": true,\n+      \"peerDependenciesMeta\": {";
const KOD_OUT_04 = "# node_modules yo'q (lentada npm ci qadami tushib qolgan)\n$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nsh: 1: jest: not found\n[chiqish kodi: 127 · 0.2 s]";
const KOD_OUT_05 = "$ npm run build\n\n> order-bot-nest@1.0.0 build\n> nest build\n\n[chiqish kodi: 0 · 3.3 s]\n\n$ node dist/main\n…/OrderBotNest/infrastructure/database.module.js:15\n    throw new Error('DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: postgresql://postgres:parol@localhost:5432/shop');\n    ^\n\nError: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: postgresql://postgres:parol@localhost:5432/shop\n    at Object.<anonymous> (…/OrderBotNest/infrastructure/database.module.js:15:11)\n    at Module._compile (node:internal/modules/cjs/loader:1871:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:2002:10)\n[chiqish kodi: 1]";
const KOD_OUT_06 = "# user.service.ts: telegram_id = from.id (string ustuniga number)\n$ npx tsc --noEmit\nsrc/api/user/user.service.ts(20,42): error TS2322: Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined'.\n  Types of property 'telegram_id' are incompatible.\n    Type 'number' is not assignable to type 'string | FindOperator<string> | undefined'.\nsrc/api/user/user.service.ts(22,33): error TS2769: No overload matches this call.\n  Overload 1 of 3, '(entityLikeArray: DeepPartial<User>[]): User[]', gave the following error.\n    Object literal may only specify known properties, and 'telegram_id' does not exist in type 'DeepPartial<User>[]'.\n  Overload 2 of 3, '(entityLike: DeepPartial<User>): User', gave the following error.\n    Type 'number' is not assignable to type 'string'.\n[chiqish kodi: 2 · 2.1 s]\n\n# test baribir yashilmi? (ts-jest diagnostics)\nTest Suites: 5 passed, 5 total\nTests:       25 passed, 25 total\nSnapshots:   0 total\nTime:        1.234 s\n[chiqish kodi: 0 · 1.9 s]";
const KOD_OUT_07 = "$ ls\n$ npm ci --no-audit --no-fund\n[chiqish kodi: 0 · 5.7 s]\n$ npx tsc --noEmit\n[chiqish kodi: 0 · 2.6 s]\n$ npm test\n[chiqish kodi: 0 · 2.2 s]\n$ npm run build\n[chiqish kodi: 0 · 3.5 s]\n$ ls dist | head";
const KOD_OUT_08 = "# @actions/workflow-parser 0.3.61 — GitHub'ning rasmiy YAML tahlilchisi (04.11, esbuild bundle)\n--- 1-tavsiya.yml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npx tsc --noEmit\n      - run: npm test\n      - run: npm run build\n  ✓ xato yo'q (schema bo'yicha to'g'ri)\n\n--- 2-checkout-yoq.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: npm ci\n      - run: npm test\n  ✓ xato yo'q (schema bo'yicha to'g'ri)\n\n--- 3-runs-on-yoq.yml\nname: CI\non: push\njobs:\n  test:\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test\n  XATO: 3-runs-on-yoq.yml (Line: 5, Col: 5): Required property is missing: runs-on\n\n--- 4-surilish-xato.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n  XATO: 4-surilish-xato.yml: A block sequence may not be used as an implicit map key at line 8, column 1:\n\n    - uses: actions/checkout@v4\n      - run: npm ci\n^\n\n  XATO: 4-surilish-xato.yml: Implicit keys need to be on a single line at line 8, column 7:\n\n    - uses: actions/checkout@v4\n      - run: npm ci\n      ^\n\n  XATO: 4-surilish-xato.yml: Implicit map keys need to be followed by map values at line 8, column 7:\n\n    - uses: actions/checkout@v4\n      - run: npm ci\n      ^\n\n\n--- 5-npm-install.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: npm install\n      - run: npm test\n  ✓ xato yo'q (schema bo'yicha to'g'ri)\n\n--- 6-tsc-yoq.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm test\n  ✓ xato yo'q (schema bo'yicha to'g'ri)";
const KOD_OUT_09 = "v24.18.0\n11.16.0\ngh version 2.100.0 (2026-09-03)\nWed Nov  4 05:51:17 PM +05 2026\nAzizbekcrypto";
const KOD_RUNS_10 = {
 "id": "41832879751",
 "n": 11,
 "title": "ci: lenta — npm ci · tsc · test · build",
 "br": "ci-sinov",
 "sha": "ef9e667",
 "st": "ok",
 "dur": "28 s",
 "at": "2026-11-04T12:51:22Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "25 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Run npm ci",
     "ok",
     "11 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "3 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 10s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.49 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ]
 }
};
const KOD_RUNS_10A = {
 "id": "41831241596",
 "n": 1,
 "title": "ci: lenta — npm ci · tsc · test · build",
 "br": "ci-sinov",
 "sha": "1ab36ac",
 "st": "bad",
 "dur": "9 s",
 "at": "2026-11-04T12:40:03Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "5 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Run npm ci",
     "bad",
     "1 s"
    ],
    [
     "Run npx tsc --noEmit",
     "skip",
     "0 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Missing: webpack@5.112.2 from lock file",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error aliases: clean-install, ic, install-clean, isntall-clean",
   "npm error",
   "npm error Run \"npm help ci\" for more info",
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T12_40_08_990Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_11 = {
 "id": "42608643059",
 "n": 44,
 "title": "sinov: chegara buzildi (< → <=)",
 "br": "sinov-test-qizil",
 "sha": "fccde96",
 "st": "bad",
 "dur": "19 s",
 "at": "2026-11-09T11:23:19Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "17 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "bad",
     "2 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 7s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (5 low, 17 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "FAIL src/api/order/order.service.spec.ts",
   "  ● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi",
   "    Kolonka: omborda faqat 2 ta qoldi",
   "      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
   "      36 |         if (p.stock <= c.qty) {",
   "    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
   "         |                 ^",
   "      38 |         }",
   "      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.",
   "      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi",
   "      at api/order/order.service.ts:37:17",
   "      at Object.<anonymous> (api/order/order.service.spec.ts:76:19)",
   "Test Suites: 1 failed, 4 passed, 5 total",
   "Tests:       1 failed, 24 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.421 s",
   "Ran all test suites.",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_12 = {
 "id": "41833077624",
 "n": 13,
 "title": "sinov: checkout qadami yo'q",
 "br": "ci-sinov",
 "sha": "33c3cc8",
 "st": "bad",
 "dur": "12 s",
 "at": "2026-11-04T12:52:46Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "9 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "4 s"
    ],
    [
     "Run npm ci",
     "bad",
     "1 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error The `npm ci` command can only install with an existing package-lock.json or",
   "npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or",
   "npm error later to generate a package-lock.json file, then try again.",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]",
   "npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]",
   "npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]",
   "npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]",
   "npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error   --install-strategy",
   "npm error     Sets the strategy for installing packages in node_modules.",
   "npm error",
   "npm error   --legacy-bundling",
   "npm error     Instead of hoisting package installs in `node_modules`, install packages",
   "npm error",
   "npm error   --global-style",
   "npm error     Only install direct dependencies in the top level `node_modules`,",
   "npm error",
   "npm error   --omit",
   "npm error     Dependency types to omit from the installation tree on disk.",
   "npm error",
   "npm error   --include",
   "npm error     Option that allows for defining which types of dependencies to install.",
   "npm error",
   "npm error   --strict-peer-deps",
   "npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_",
   "npm error",
   "npm error   --foreground-scripts",
   "npm error     Run all build scripts (ie, `preinstall`, `install`, and",
   "npm error",
   "npm error   --ignore-scripts",
   "npm error     If true, npm does not run scripts specified in package.json files.",
   "npm error",
   "npm error   --allow-directory",
   "npm error     Limits the ability for npm to install dependencies from directories.",
   "npm error",
   "npm error   --allow-file",
   "npm error     Limits the ability for npm to install dependencies from tarball files.",
   "npm error",
   "npm error   --allow-git",
   "npm error     Limits the ability for npm to fetch dependencies from git references.",
   "npm error",
   "npm error   --allow-remote",
   "npm error     Limits the ability for npm to fetch dependencies from urls."
  ]
 }
};
const KOD_RUNS_13 = {
 "id": "41833308519",
 "n": 14,
 "title": "sinov: package.json lock bilan sinxron emas",
 "br": "ci-sinov",
 "sha": "f7e6f8d",
 "st": "bad",
 "dur": "10 s",
 "at": "2026-11-04T12:54:24Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "8 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "bad",
     "2 s"
    ],
    [
     "Run npx tsc --noEmit",
     "skip",
     "0 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]",
   "npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]",
   "npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]",
   "npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]",
   "npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error   --install-strategy",
   "npm error     Sets the strategy for installing packages in node_modules.",
   "npm error",
   "npm error   --legacy-bundling",
   "npm error     Instead of hoisting package installs in `node_modules`, install packages",
   "npm error",
   "npm error   --global-style",
   "npm error     Only install direct dependencies in the top level `node_modules`,",
   "npm error",
   "npm error   --omit",
   "npm error     Dependency types to omit from the installation tree on disk.",
   "npm error",
   "npm error   --include",
   "npm error     Option that allows for defining which types of dependencies to install.",
   "npm error",
   "npm error   --strict-peer-deps",
   "npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_",
   "npm error",
   "npm error   --foreground-scripts",
   "npm error     Run all build scripts (ie, `preinstall`, `install`, and",
   "npm error",
   "npm error   --ignore-scripts",
   "npm error     If true, npm does not run scripts specified in package.json files.",
   "npm error",
   "npm error   --allow-directory",
   "npm error     Limits the ability for npm to install dependencies from directories.",
   "npm error",
   "npm error   --allow-file",
   "npm error     Limits the ability for npm to install dependencies from tarball files.",
   "npm error",
   "npm error   --allow-git",
   "npm error     Limits the ability for npm to fetch dependencies from git references.",
   "npm error",
   "npm error   --allow-remote",
   "npm error     Limits the ability for npm to fetch dependencies from urls."
  ]
 }
};
const KOD_RUNS_14 = {
 "id": "41833373499",
 "n": 15,
 "title": "sinov: tsc qadami yo'q + tur xatosi",
 "br": "ci-sinov",
 "sha": "b79cc7e",
 "st": "ok",
 "dur": "25 s",
 "at": "2026-11-04T12:54:51Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "19 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "7 s"
    ],
    [
     "Run npm ci",
     "ok",
     "6 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 5s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.343 s",
   "Ran all test suites."
  ]
 }
};
const KOD_RUNS_15 = {
 "id": "41833479902",
 "n": 16,
 "title": "sinov: tsc qadami bor + tur xatosi",
 "br": "ci-sinov",
 "sha": "9c6b5f2",
 "st": "bad",
 "dur": "21 s",
 "at": "2026-11-04T12:55:35Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "18 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "bad",
     "2 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 2."
  ],
  [
   "failure",
   "No overload matches this call."
  ],
  [
   "failure",
   "Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined'."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit",
   "##[error]src/api/user/user.service.ts(20,42): error TS2322: Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined'.",
   "  Types of property 'telegram_id' are incompatible.",
   "    Type 'number' is not assignable to type 'string | FindOperator<string> | undefined'.",
   "##[error]src/api/user/user.service.ts(22,33): error TS2769: No overload matches this call.",
   "  Overload 1 of 3, '(entityLikeArray: DeepPartial<User>[]): User[]', gave the following error.",
   "    Object literal may only specify known properties, and 'telegram_id' does not exist in type 'DeepPartial<User>[]'.",
   "  Overload 2 of 3, '(entityLike: DeepPartial<User>): User', gave the following error.",
   "    Type 'number' is not assignable to type 'string'.",
   "##[error]Process completed with exit code 2."
  ]
 }
};
const KOD_RUNS_16 = {
 "id": "41833570010",
 "n": 17,
 "title": "sinov: runs-on yo'q",
 "br": "ci-sinov",
 "sha": "49fa7bb",
 "st": "bad",
 "dur": "0 s",
 "at": "2026-11-04T12:56:13Z",
 "jobs": [],
 "ann": [],
 "wfIssue": true,
 "log": {}
};
const KOD_RUNS_17 = {
 "id": "41833614367",
 "n": 18,
 "title": "sinov: YAML surilish xatosi",
 "br": "ci-sinov",
 "sha": "7e5e43a",
 "st": "bad",
 "dur": "0 s",
 "at": "2026-11-04T12:56:31Z",
 "jobs": [],
 "ann": [],
 "wfIssue": true,
 "log": {}
};
const KOD_RUNS_18 = {
 "id": "41833650859",
 "n": 19,
 "title": "cicd1-done: node-version 24 — runner'dagi npm 10 lock faylni o'qiy ol…",
 "br": "main",
 "sha": "d789c0b",
 "st": "ok",
 "dur": "31 s",
 "at": "2026-11-04T12:56:47Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "28 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "11 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "4 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "1 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 11s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.486 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ]
 }
};
const KOD_RUNS_19 = {
 "id": "41833774062",
 "n": 1,
 "title": "sinov: AI yozgan workflow (ai1)",
 "br": "ci-sinov",
 "sha": "a18eb0e",
 "st": "bad",
 "dur": "10 s",
 "at": "2026-11-04T12:57:40Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "7 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Kodni yuklab olish",
     "ok",
     "1 s"
    ],
    [
     "Node.js 22 o'rnatish",
     "ok",
     "1 s"
    ],
    [
     "Kutubxonalarni o'rnatish",
     "bad",
     "1 s"
    ],
    [
     "Testlar",
     "skip",
     "0 s"
    ],
    [
     "Post Node.js 22 o'rnatish",
     "skip",
     "0 s"
    ],
    [
     "Post Kodni yuklab olish",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Kutubxonalarni o'rnatish": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Missing: webpack@5.112.2 from lock file",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error aliases: clean-install, ic, install-clean, isntall-clean",
   "npm error",
   "npm error Run \"npm help ci\" for more info",
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T12_57_46_990Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_20 = {
 "id": "41833834000",
 "n": 20,
 "title": "sinov: AI yozgan workflow (ai2)",
 "br": "ci-sinov",
 "sha": "d04c083",
 "st": "bad",
 "dur": "9 s",
 "at": "2026-11-04T12:58:06Z",
 "jobs": [
  {
   "name": "Jest testlar",
   "st": "bad",
   "dur": "6 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Kodni olish",
     "ok",
     "1 s"
    ],
    [
     "Node.js o'rnatish",
     "ok",
     "2 s"
    ],
    [
     "Bog'liqliklarni o'rnatish",
     "bad",
     "1 s"
    ],
    [
     "Testlarni ishga tushirish",
     "skip",
     "0 s"
    ],
    [
     "Post Node.js o'rnatish",
     "skip",
     "0 s"
    ],
    [
     "Post Kodni olish",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Bog'liqliklarni o'rnatish": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Missing: webpack@5.112.2 from lock file",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error aliases: clean-install, ic, install-clean, isntall-clean",
   "npm error",
   "npm error Run \"npm help ci\" for more info",
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T12_58_12_295Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_21 = {
 "id": "41833893142",
 "n": 2,
 "title": "sinov: AI (ai1) workflow, node-version 22 → 24",
 "br": "ci-sinov",
 "sha": "a0469b6",
 "st": "ok",
 "dur": "21 s",
 "at": "2026-11-04T12:58:31Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "17 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Kodni yuklab olish",
     "ok",
     "0 s"
    ],
    [
     "Node.js 22 o'rnatish",
     "ok",
     "5 s"
    ],
    [
     "Kutubxonalarni o'rnatish",
     "ok",
     "7 s"
    ],
    [
     "Testlar",
     "ok",
     "1 s"
    ],
    [
     "Post Node.js 22 o'rnatish",
     "ok",
     "0 s"
    ],
    [
     "Post Kodni yuklab olish",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "1 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Kutubxonalarni o'rnatish": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 6s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Testlar": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.346 s",
   "Ran all test suites."
  ]
 }
};
const KOD_PROMPT1 = "Bu NestJS loyihasi uchun GitHub Actions workflow yozib ber: har push'da testlar yursin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), package-lock.json bor, testlar Jest (npm test), turlar npx tsc --noEmit, build npm run build. Mashinamda Node <node --version raqamingiz>. Vazifa: .github/workflows/ci.yml yoz: har push va pull_requestda ubuntu-latestda: kodni olib kelish (actions/checkout@v4), Node o'rnatish (actions/setup-node@v4, node-version — mening raqamim, cache: npm), npm ci, npx tsc --noEmit, npm test, npm run build — aynan shu tartibda, har biri alohida run: qadam. Boshqa fayllarga tegma. Javobda: faylning to'liq matni.";
const KOD_VERSIONS = {
 "local": "v24.18.0\n11.16.0\nHEAD e15a44c jest2-done: xato yo'li va chegara testlari — isPhone al\nWed Nov  4 05:19:25 PM +05 2026",
 "actions": "v24.18.0\n11.16.0\ngh version 2.100.0 (2026-09-03)\nWed Nov  4 05:51:17 PM +05 2026\nAzizbekcrypto"
};
const KOD = { ORDER_36: KOD_ORDER_36, USER_20: KOD_USER_20, PKG_TELEGRAF: KOD_PKG_TELEGRAF, LOCK_TELEGRAF: KOD_LOCK_TELEGRAF, CI_DONE: KOD_CI_DONE, YML_1_TAVSIYA: KOD_YML_1_TAVSIYA, YML_2_CHECKOUT_YOQ: KOD_YML_2_CHECKOUT_YOQ, YML_3_RUNS_ON_YOQ: KOD_YML_3_RUNS_ON_YOQ, YML_4_SURILISH_XATO: KOD_YML_4_SURILISH_XATO, YML_5_NPM_INSTALL: KOD_YML_5_NPM_INSTALL, YML_6_TSC_YOQ: KOD_YML_6_TSC_YOQ, YML_AI1: KOD_YML_AI1, YML_AI2: KOD_YML_AI2, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '03b': KOD_OUT_03B, '03c': KOD_OUT_03C, '03d': KOD_OUT_03D, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09 }, RUNS: { '10': KOD_RUNS_10, '10a': KOD_RUNS_10A, '11': KOD_RUNS_11, '12': KOD_RUNS_12, '13': KOD_RUNS_13, '14': KOD_RUNS_14, '15': KOD_RUNS_15, '16': KOD_RUNS_16, '17': KOD_RUNS_17, '18': KOD_RUNS_18, '19': KOD_RUNS_19, '20': KOD_RUNS_20, '21': KOD_RUNS_21 }, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2, VERSIONS: KOD_VERSIONS };

// ============================================================
//  CI/CD-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-matn.py (manba: 14-CICD1-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Jest-2 da 25 test yozdingiz — bugun ular har push'da GitHub'ning o'zida yuradi, siz esa faqat yashil-qizilni ko'rasiz",
  "seg": [
   [
    "a",
    "Jest-2 da testlar yozildi — bugun ular <b>har push'da GitHub'ning o'zida</b> yuradi",
    "Assalomu alaykum. Jest ikkinchi darsida OrderBotNest'ga yigirma beshta test yozdingiz. Hozir ular faqat siz npm test desangiz yuradi. Bugun ularni lentaga topshiramiz: har push'da GitHub'ning o'zida yuradi. Ekranda dars oxiridagi natija: oltita qadam, hammasi yashil."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: CI/CD nima qiladi, lenta nima, nega kerak",
    "Avval umumiy tushunchani olamiz: CI/CD nima qiladi va nega kerak. Keyin lentani o'z kompyuteringizda qo'lda yurgizasiz, shundan keyin GitHub'ga topshirasiz. Lenta qayerda yiqilishini to'rt tuzoqda ko'rasiz."
   ],
   [
    "c",
    "Haqiqiy topilma: <b>lokalda yashil, lentada qizil</b> — va AI yozgan workflow'lar",
    "Beshinchi bosqichda haqiqiy topilma: lokalda hammasi yashil edi, lentada qizil chiqdi. Sababini birga topamiz. Keyin ikki AI yozgan workflow'ni lentada sinaymiz. Oxirida CD nima va sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>GitHub'da o'z reposingiz</b>",
    "Dars olti bosqich, uchta amaliyot. Amaliyotlar uchun GitHub'da o'z reposingiz kerak: OrderBotNest nusxangizni push qila olishingiz kifoya. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "CI — har push'da toza mashinada sizning buyruqlaringiz yuradi; CD — tekshirilgan yukni chiqarish. Ikkalasi bitta narsani hal qiladi: «menda ishlaydi»",
  "seg": [
   [
    "a",
    "Muammo: <b>«menda ishlaydi»</b> — hamkorda qizil, chunki uning mashinasi boshqa",
    "Tanish holat: sizda npm test yashil, push qildingiz, hamkor clone qildi, unda qizil. Menda ishlaydi, deysiz. Ikkalangiz ham haqsiz: uning node modules papkasi boshqa, Node versiyasi boshqa, env fayli boshqa. Kod bir xil, mashina boshqa."
   ],
   [
    "b",
    "CI: har push'da <b>toza mashinada sizning buyruqlaringiz</b> yuradi — hammaga bir xil javob",
    "CI shuni hal qiladi. Continuous Integration: har push'dan keyin GitHub'dagi toza mashina kodni olib, aynan sizning buyruqlaringizni yurgizadi: o'rnatish, turlar, test, build. Mashina hamma uchun bir xil, javob ham bir xil: yashil yoki qizil. Menda ishlaydi, degan bahs yo'q."
   ],
   [
    "c",
    "CD: <b>tekshirilgan yukni chiqarish</b> — Delivery odam tasdiqlaydi, Deployment o'zi chiqaradi",
    "CD ikkinchi yarmi: tekshirilgan yukni chiqarish. Continuous Delivery: paket tayyor, odam tugmani bosadi. Continuous Deployment: lenta o'zi chiqaradi, odam yo'q. Ikkalasi ham CI'dan keyin, chunki qizil yukni hech kim chiqarmaydi."
   ],
   [
    "d",
    "Xulosa: bugun <b>CI to'liq, CD chegaragacha</b> — OrderBotNest'ning lentasi har push'da yashil yoki qizil",
    "Xulosa: CI, har push'da toza mashinada tekshirish. CD, tekshirilgan yukni chiqarish. Bugun CI'ni oxirigacha qilamiz: OrderBotNest'ning lentasi har push'da yashil yoki qizil deydi. CD'ni chegarasigacha ko'ramiz: bot bazasiz va tokensiz chiqmaydi. Endi lentaning o'zi nima."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Lenta — buyruqlar ketma-ketligi: har biri chiqish kodi qaytaradi, 0 — yashil, boshqasi — qizil; qizildan keyin qolgani yurmaydi",
  "seg": [
   [
    "a",
    "To'rt qadam: <b><code>npm ci</code> → <code>tsc</code> → <code>npm test</code> → <code>npm run build</code></b> — har biri bitta terminal buyrug'i",
    "Lenta sirli narsa emas: bu siz terminalda yozadigan buyruqlar ketma-ketligi. OrderBotNest uchun to'rtta: npm si ay, paketlarni o'rnatadi. npx tsc, turlarni tekshiradi. npm test. npm run build, dist papkasini yig'adi. Lenta shu to'rttasini tartib bilan yurgizadi."
   ],
   [
    "b",
    "Har qadam <b>bitta savolga javob beradi</b>: o'rnatildimi, turlar to'g'rimi, test yashilmi, yig'ildimi",
    "Har qadam bitta savolga javob beradi. Paketlar o'rnatildimi. Turlar to'g'rimi. Testlar yashilmi. Build yig'ildimi. To'rt savol, to'rt javob. Hozircha eslint qadami yo'q: OrderBotNest'da lint sozlanmagan, lentaga faqat ishlaydigan buyruq qo'yiladi."
   ],
   [
    "c",
    "Chiqish kodi: <b>0 — yashil, boshqasi — qizil</b>; <code>tsc</code> 2 beradi, <code>jest: not found</code> 127 beradi",
    "Har buyruq tugaganda son qaytaradi, bu chiqish kodi. Nol, hammasi yaxshi, yashil. Boshqa son, qizil. Jest qizil testda bir beradi, tsc tur xatosida ikki, buyruq topilmasa yuz yigirma yetti. Lenta sonning o'zini bilmaydi, faqat nolmi yoki yo'qmi, shuni qaraydi."
   ],
   [
    "d",
    "Xulosa: <b>qizil qadamdan keyin qolgani yurmaydi</b> — test qizil bo'lsa, build boshlanmaydi",
    "Xulosa: lenta to'rt buyruq, har biri chiqish kodi bilan. Birinchi qizil qadamda lenta to'xtaydi, qolgani yurmaydi: test qizil bo'lsa build boshlanmaydi, buzuq kod hech qachon yig'ilmaydi. Endi shu lentani o'z kompyuteringizda, toza papkada qo'lda yurgizamiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · lenta qo'lda",
  "title": "Lenta mashinasi har safar bo'sh papkadan boshlaydi — biz ham: yangi clone, node_modules yo'q, to'rt buyruq ketma-ket, har biri chiqish kodi bilan",
  "seg": [
   [
    "a",
    "Yangi papkaga clone: <b><code>node_modules</code> yo'q</b> — lenta mashinasi ham shunday boshlaydi",
    "OrderBotNest'ni yangi papkaga clone qiling: git clone, keyin jest ikki done tegiga o'ting. VS Code'da oching, terminalda ls. Yetti narsa: package json, lock, src va hokazo. Node modules yo'q, env yo'q. Lenta mashinasi har safar aynan shunday bo'sh papkadan boshlaydi."
   ],
   [
    "b",
    "<code>npm ci</code>: <b>633 paket, 6 soniya</b> — lock fayldan aynan; keyin <code>tsc</code> — 3 soniya, chiqish kodi 0",
    "Birinchi buyruq npm si ay: lock fayldagi versiyalarni aynan o'rnatadi, olti yuz o'ttiz uchta paket, olti soniya, chiqish kodi nol. Ikkinchisi npx tsc no emit: turlarni tekshiradi, fayl yozmaydi. Uch soniya, chiqish kodi nol: xato yo'q."
   ],
   [
    "c",
    "<code>npm test</code>: <b>25 test yashil, 2 soniya</b>; <code>npm run build</code>: <code>dist</code> papkasi, 4 soniya",
    "Uchinchisi npm test: beshta fayl, yigirma beshta test, hammasi yashil, ikki soniya. To'rtinchisi npm run build: nest build dist papkasini yig'adi, to'rt soniya. Ls dist: main js va boshqa fayllar. To'rtala qadam nol bilan tugadi."
   ],
   [
    "d",
    "Xulosa: <b>to'rt buyruq, 15 soniya, to'rt nol</b> — bu lenta; GitHub'da aynan shu yuradi",
    "Xulosa: to'rt buyruq, jami o'n besh soniya, to'rtala chiqish kodi nol, lenta yashil. Siz hozir qo'lda qilgan ishni GitHub'dagi mashina har push'da o'zi qiladi, aynan shu buyruqlar bilan. Lekin avval bitta narsani tekshirib olaylik."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Toza clone'da to'g'ridan npm test yozdik. Terminal: sh: 1: jest: not found, chiqish kodi 127. Sabab nima?",
  "q": "Lentani ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Toza clone'da npm si ay'ni o'tkazib yuborib, to'g'ridan npm test yozdik. Terminal: jest not found, chiqish kodi yuz yigirma yetti. Sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Jest package json'da bor, lekin o'rnatilmagan: node modules papkasi yo'q, chunki npm si ay yurmadi. Lentada bu eng ko'p uchraydigan xato: o'rnatish qadami tushib qolgan yoki tartibi noto'g'ri. Demak, lentada birinchi qadam doim o'rnatish, qolgani undan keyin.",
  "okShort": "<code>node_modules</code> yo'q — <code>npm ci</code> yurmagan. Lentada birinchi qadam doim o'rnatish.",
  "hint": "ls da node_modules bormi? jest buyrug'i qayerdan keladi?",
  "demak": "Lentada birinchi qadam — o'rnatish (<code>npm ci</code>); toza mashinada <code>node_modules</code> yo'q.",
  "correct": 1,
  "opts": [
   "Jest package.jsonda umuman yo'q — avval ro'yxatga qo'shish kerak",
   "node_modules yo'q — npm ci qadami tushib qolgan",
   "Node versiyasi eski — Jest ishlamaydi",
   "Test fayllari yo'q — Jest «not found» deydi"
  ],
  "wrong": {
   "0": "package.json da jest bor (devDependencies); muammo o'rnatishda, ro'yxatda emas.",
   "2": "Node 24 — yangi; not found versiya emas, fayl yo'qligi.",
   "3": "Test fayli yo'q bo'lsa Jest No tests found deydi; bu yerda Jest'ning o'zi topilmadi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · buzamiz",
  "title": "Kodni buzamiz va to'rt buyruqni && bilan bog'laymiz: npm ci ✓, tsc ✓, test qizil — build boshlanmaydi, chiqish kodi 1",
  "seg": [
   [
    "a",
    "Buzamiz: <code>order.service.ts</code> 36-satr <b><code>&lt;</code> → <code>&lt;=</code></b> — Jest-2 dagi chegara testi buni ushlaydi",
    "Endi ataylab buzamiz. Src, api, order papkasidagi order service ts faylining o'ttiz oltinchi satrida kichikni kichik yoki tengga almashtiring. Jest ikkinchi darsidan eslaysiz: aynan ikkita qolganda ikkitasini sotib bo'lmaydi, chegara testi buni ushlaydi."
   ],
   [
    "b",
    "To'rt buyruq <b><code>&amp;&amp;</code> bilan bitta qatorda</b>: oldingisi nol bersa, keyingisi yuradi",
    "Bu safar to'rt buyruqni bitta qatorda yozamiz, oralarida ikki ampersand. Ma'nosi: oldingisi nol bersa, keyingisi yuradi, nol bermasa, to'xtaydi. Terminalda: npm si ay, ampersand, npx tsc, ampersand, npm test, ampersand, npm run build."
   ],
   [
    "c",
    "Natija: <b><code>npm ci</code> ✓, <code>tsc</code> ✓, test FAIL — <code>build</code> satri umuman yo'q</b>, chiqish kodi 1",
    "Natijaga qarang. Npm si ay yashil, tsc yashil. Npm test: FAIL, chegara testi, Kolonka, omborda faqat ikkita qoldi, o'ttiz yettinchi satr. Va pastda build satri umuman yo'q: nest build boshlanmadi. Butun qatorning chiqish kodi bir."
   ],
   [
    "d",
    "Xulosa: <b>zanjir birinchi qizilda uziladi</b> — GitHub lentasi ham aynan shunday, faqat «yurmadi» deb yozadi",
    "Xulosa: zanjir birinchi qizil qadamda uziladi, buzuq kod yig'ilmaydi. GitHub lentasi aynan shunday ishlaydi, faqat yurmagan qadamni skipped, ya'ni yurmadi deb ko'rsatadi. Satrni tiklang: git checkout, order service ts. Endi lentani o'zingiz qo'lda yurgizasiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 12 daqiqa",
  "title": "Toza clone'da to'rt buyruqni && bilan yurgiting, keyin kodni buzib zanjir uzilishini ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b>yangi papkaga clone, <code>jest2-done</code> tegi</b>, to'rt buyruq zanjiri",
    "Endi navbat sizga. OrderBotNest'ni yangi papkaga clone qilasiz, jest ikki done tegiga o'tasiz, to'rt buyruqni ampersand bilan yurgizasiz. Baza va token kerak emas. O'n ikki daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>clone va zanjir</b> — to'rtala qadam nol, <code>dist</code> papkasi paydo bo'ladi",
    "Birinchi qadamda git clone va git checkout jest ikki done. Ikkinchisida to'rt buyruq zanjiri: npm si ay, tsc, test, build. Oxirida dist papkasi paydo bo'lishi kerak, tests satri yigirma besh passed."
   ],
   [
    "c",
    "3–4-qadam: <b>36-satrni buzib</b> zanjirni yurgizing — <code>build</code> yurmaydi; tiklang; isbot — <code>Tests:</code> satri",
    "Uchinchi qadamda order service ts'ning o'ttiz oltinchi satrida kichikni kichik yoki tengga buzib, zanjirni qayta yurgizasiz: test qizil, build yurmaydi. To'rtinchisida git checkout bilan tiklaysiz. Isbot maydoniga uchinchi qadamdagi tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz lentani qo'lda yurgizgan va qizilda uzilishini ko'rgan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Toza clone",
    "cmds": [
     "git clone https://github.com/Azizbekcrypto/OrderBotNest.git lenta",
     "cd lenta",
     "git checkout jest2-done",
     "ls"
    ],
    "exp": "node_modules yo'q"
   },
   {
    "t": "Zanjir",
    "cmds": [
     "npm ci && npx tsc --noEmit && npm test && npm run build",
     "ls dist"
    ],
    "exp": "Tests: 25 passed, 25 total · dist/main.js"
   },
   {
    "t": "Buzish",
    "cmds": [
     "src/api/order/order.service.ts 36-satr < → <=",
     "zanjirni qayta yurgizing"
    ],
    "exp": "Tests: 1 failed, 24 passed, 25 total · build yurmadi"
   },
   {
    "t": "Tiklash",
    "cmds": [
     "git checkout -- src/api/order/order.service.ts",
     "zanjir"
    ],
    "exp": "Tests: 25 passed, 25 total"
   }
  ],
  "proof": {
   "label": "3-qadamdagi Tests: satri",
   "placeholder": "masalan: Tests: 1 failed, 24 passed, 25 total",
   "re": "Tests:\\s+1 failed,\\s+24 passed",
   "flags": "",
   "wrong": "Buzilgan kodda bitta test qizil bo'lishi kerak — 3-qadamdagi Tests: qatorini qo'ying."
  },
  "trouble": [
   [
    "error: pathspec 'jest2-done' did not match",
    "teglar olinmagan — git fetch --tags, keyin checkout"
   ],
   [
    "sh: 1: jest: not found",
    "npm ci yurmagan yoki zanjirda yo'q — birinchi buyruq npm ci"
   ],
   [
    "3-qadamda hammasi ✓",
    "36-satr o'zgarmagan yoki boshqa satr — if (p.stock <= c.qty) bo'lsin"
   ],
   [
    "build baribir yurdi",
    "buyruqlar ; bilan bog'langan — && bo'lsin: ; qizilda to'xtamaydi"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · GitHub Actions",
  "title": ".github/workflows/ci.yml — lentaning yo'l xaritasi: qachon (on), qaysi mashinada (runs-on), qaysi qadamlar (steps); uses — tayyor qadam, run — sizning buyrug'ingiz",
  "seg": [
   [
    "a",
    "Fayl <b><code>.github/workflows/ci.yml</code></b> — GitHub shu papkadagi har faylni lenta deb o'qiydi",
    "OrderBotNest papkangizda, ildizda, nuqta github papkasini, ichida workflows papkasini, ichida ci yml faylini yarating. GitHub shu papkadagi har faylni lenta deb o'qiydi. Birinchi ikki satr: name, lentaning nomi, va on: qachon yursin. Push va pull request."
   ],
   [
    "b",
    "<code>jobs</code> → <code>test</code> → <b><code>runs-on: ubuntu-latest</code></b> — GitHub'dagi toza Ubuntu mashina",
    "Uchinchidan beshinchi satrgacha: jobs, ya'ni ishlar. Bitta ish, nomi test. Runs on, ubuntu latest: GitHub'dagi toza Ubuntu mashina. Har run'da yangi mashina, bo'sh papka, siz to'rtinchi ekranda ko'rgan holat."
   ],
   [
    "c",
    "<code>steps</code>: <b><code>checkout</code> kodni olib keladi, <code>setup-node</code> Node 24 ni o'rnatadi</b> — <code>uses</code>, tayyor qadamlar",
    "Oltinchidan: steps, qadamlar. Birinchi ikkitasi uses bilan, tayyor qadamlar. Actions checkout: mashinaga reponi olib keladi, usiz papka bo'sh. Setup node: Node yigirma to'rtni o'rnatadi, mashinangizdagi bilan bir xil, va npm keshini yoqadi."
   ],
   [
    "d",
    "Xulosa: <b>to'rt <code>run:</code> satri — to'rtinchi ekrandagi to'rt buyruq</b>, aynan o'sha tartibda",
    "Xulosa: oxirgi to'rt satr run bilan, bular sizning buyruqlaringiz: npm si ay, tsc, test, build, aynan to'rtinchi ekrandagi tartibda. Ci yml uch qism: qachon, qaysi mashinada, qaysi qadamlar. Faylni saqlang, endi push qilamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · GitHub Actions",
  "title": "git push — va GitHub'ning Actions bo'limida run paydo bo'ladi: bitta job, oltita qadam, har biri soniyasi bilan, hammasi yashil",
  "seg": [
   [
    "a",
    "Push qiling — <b>GitHub'da Actions bo'limi</b>: run paydo bo'ldi, sariq nuqta — yuryapti",
    "Terminalda git add, commit, push. Brauzerda reponi oching, yuqorida Actions bo'limi. Yangi run paydo bo'ldi: nomi commit xabaringiz, yonida sariq nuqta, yuryapti. Bir daqiqadan kam kuting."
   ],
   [
    "b",
    "Run ichida: <b>bitta job <code>test</code>, oltita qadam</b> — <code>checkout</code>, <code>setup-node</code>, to'rt buyruq, har biri soniyasi bilan",
    "Run'ni oching. Chapda job: test. O'ngda qadamlar: set up job, GitHub'ning o'zi qo'shgan. Keyin checkout, setup node, va to'rt buyrug'ingiz. Har qadam yonida yashil belgi va necha soniya yurgani. Hammasi yashil, run yashil."
   ],
   [
    "c",
    "Qadamni bossangiz — <b>log, sizning terminalingizdagi matn</b>: <code>PASS</code>, <code>Tests: 25 passed</code>",
    "Npm test qadamini bosing: log ochiladi. Bu aynan sizning terminalingizdagi matn: PASS, beshta fayl, yigirma besh passed. Faqat uni siz emas, GitHub'dagi mashina yurgizdi. Shu logni o'qiy olsangiz, lentaning hamma xatosini topa olasiz."
   ],
   [
    "d",
    "Xulosa: <b>push → toza mashina → sizning buyruqlaringiz → yashil</b>; endi uni qizil qilamiz",
    "Xulosa: push qildingiz, GitHub toza mashina ochdi, kodni olib keldi, Node o'rnatdi, to'rt buyrug'ingizni yurgizdi, yashil dedi. Siz hech narsa qilmadingiz. Endi kodni buzib push qilamiz va lenta qizilni qanday ko'rsatishini ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "<= bilan push: run qizil — npm test qadami ✗, npm run build «skipped», annotatsiyada Process completed with exit code 1",
  "seg": [
   [
    "a",
    "36-satrni yana buzamiz va push — <b>run qizil</b>: ro'yxatda qizil belgi, commit xabari bilan",
    "Oltinchi ekrandagi buzishni qaytaramiz: order service ts, o'ttiz oltinchi satr, kichik yoki teng. Commit, push. Actions bo'limida yangi run, bu safar qizil belgi. Run'ni ochamiz."
   ],
   [
    "b",
    "Qadamlar: <b><code>npm test</code> ✗, <code>npm run build</code> — «skipped»</b>; annotatsiya: chiqish kodi 1",
    "Qadamlarga qarang: checkout, setup node, npm si ay, tsc, hammasi yashil. Npm test qizil. Npm run build: skipped, yurmadi. Yuqorida annotatsiya: process completed with exit code one. Oltinchi ekrandagi ampersand zanjiri bilan bir xil, faqat GitHub buni ko'rsatib beradi."
   ],
   [
    "c",
    "Logda <b>o'sha FAIL</b>: chegara testi, <code>Kolonka: omborda faqat 2 ta qoldi</code>, 37-satr",
    "Qizil qadamni bosing: log. O'sha FAIL: order service spec, chegara testi, Kolonka, omborda faqat ikkita qoldi, o'ttiz yettinchi satr. Jest sizga lokalda aytadigan hamma narsa shu yerda. Pastda: process completed with exit code one."
   ],
   [
    "d",
    "Demak, sabab: <b>test chiqish kodi 1 berdi — lenta to'xtadi</b>, build yurmadi, buzuq kod yig'ilmadi",
    "Demak, sabab bitta joyda: npm test chiqish kodi bir berdi, lenta shu qadamda to'xtadi, build yurmadi. Buzuq kod yig'ilmadi va hech qayerga chiqmadi. Satrni tiklab push qilsangiz, run yana yashil. Endi tekshirib olaylik."
   ]
  ]
 },
 "11": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Lentada npx tsc --noEmit qadami chiqish kodi 2 bilan tugadi. npm test va npm run build qadamlari nima bo'ladi?",
  "q": "Qizil run'ni ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Lentada tsc qadami chiqish kodi ikki bilan tugadi: tur xatosi. Undan keyingi npm test va npm run build qadamlari nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Lenta birinchi qizil qadamda to'xtaydi: tsc ikki berdi, npm test ham, build ham skipped, yurmadi. Chiqish kodi ikkimi, birmi, lenta uchun farqi yo'q: nol emas, demak qizil. Demak, qadam tartibi muhim: arzon va tez tekshiruv oldinda, undan o'tmagan kod testgacha ham bormaydi.",
  "okShort": "Birinchi qizil qadam — qolgani «skipped». 2 ham, 1 ham — nol emas.",
  "hint": "Oltinchi ekrandagi && zanjirini eslang: qizildan keyin nima bo'ldi?",
  "demak": "Lenta birinchi qizil qadamda to'xtaydi; keyingi qadamlar «skipped». Chiqish kodi nol emas — qizil.",
  "correct": 2,
  "opts": [
   "Ikkalasi yuradi — tur xatosi testga ham, build'ga ham xalaqit bermaydi",
   "npm test yuradi, build yurmaydi — test alohida",
   "Ikkalasi «skipped» — birinchi qizildan keyin to'xtaydi",
   "Ikkalasi yuradi, lekin run baribir qizil"
  ],
  "wrong": {
   "0": "Lenta qadam ketma-ketligi: oldingisi qizil — keyingisi boshlanmaydi.",
   "1": "Qadamlar bir-biriga bog'liq: tsc qizil bo'lsa test ham yurmaydi.",
   "3": "Yurmaydi: GitHub ularni «skipped» deb belgilaydi, run qizil."
  }
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "OrderBotNest nusxangizni GitHub'ga chiqaring, ci.yml yozing, push — Actions'da yashil run; keyin buzib qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z GitHub reposingiz</b> — OrderBotNest nusxasi, <code>ci.yml</code>, push",
    "Endi navbat sizga. GitHub'da o'zingizga yangi repo ochasiz, OrderBotNest nusxangizni unga push qilasiz, ci yml yozasiz va Actions'da yashil run'ni ko'rasiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>repo va push</b>, keyin <code>.github/workflows/ci.yml</code> — sakkizinchi ekrandagi 15 satr",
    "Birinchi qadamda GitHub'da bo'sh repo ochib, git remote bilan ulaysiz va push qilasiz. Ikkinchisida nuqta github, workflows, ci yml faylini sakkizinchi ekrandagi o'n besh satr bilan yozasiz, push. Actions'da run yashil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b>36-satrni buzib push</b> — run qizil, <code>build</code> skipped; tiklab push — yashil; isbot — run manzili",
    "Uchinchi qadamda o'ttiz oltinchi satrni buzib push qilasiz: run qizil, npm test qadami qizil, build skipped. To'rtinchisida tiklab push: yashil. Isbot maydoniga yashil run'ning manzilini, brauzer qatoridan, nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning reponingizda har push'da lenta yuradi, va siz uni bir marta qizil, bir marta yashil ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "O'z repo",
    "cmds": [
     "GitHub → New repository (bo'sh, README'siz)",
     "git remote add mine https://github.com/<siz>/OrderBotNest.git",
     "git push mine jest2-done:main"
    ],
    "exp": "GitHub'da kod ko'rinadi"
   },
   {
    "t": "ci.yml",
    "cmds": [
     ".github/workflows/ci.yml — 8-ekrandagi 15 satr (node-version — node --version raqamingiz)",
     "git add .github && git commit -m \"ci: lenta\" && git push mine HEAD:main"
    ],
    "exp": "Actions: run ✓ (6 qadam yashil)"
   },
   {
    "t": "Buzib push",
    "cmds": [
     "order.service.ts 36 < → <=",
     "git commit -am \"sinov: chegara\" && git push mine HEAD:main"
    ],
    "exp": "run ✗: npm test ✗ · npm run build skipped"
   },
   {
    "t": "Tiklab push",
    "cmds": [
     "git checkout -- src/api/order/order.service.ts",
     "git commit -am \"tiklash\" && git push mine HEAD:main"
    ],
    "exp": "run ✓"
   }
  ],
  "proof": {
   "label": "4-qadamdagi yashil run manzili",
   "placeholder": "masalan: https://github.com/siz/OrderBotNest/actions/runs/41831…",
   "re": "github\\.com\\/[^\\s\\/]+\\/[^\\s\\/]+\\/actions\\/runs\\/\\d+",
   "flags": "",
   "wrong": "Actions'da run'ni ochib, brauzer qatoridagi manzilni qo'ying: …/actions/runs/<raqam>."
  },
  "trouble": [
   [
    "Actions bo'limida run yo'q",
    "fayl .github/workflows/ papkasida emas yoki push mainga bormagan — yo'lni va git push mine HEAD:main ni tekshiring"
   ],
   [
    "npm ci qadami qizil: Missing: … from lock file",
    "runner'dagi Node mashinangizdan boshqa — node-version ni node --version raqamiga qo'ying (17-ekran)"
   ],
   [
    "npm ci qizil: can only install with an existing package-lock.json",
    "actions/checkout@v4 qadami yo'q — mashinada repo yo'q (13-ekran)"
   ],
   [
    "Run qizil, ichida job yo'q",
    "fayl xatosi — YAML surilish yoki runs-on yo'q (16-ekran)"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · to'rt tuzoq",
  "title": "actions/checkout satrini olib tashlasak — mashina bo'sh: npm ci «lock fayl yo'q» deydi, run qizil; birinchi tuzoq",
  "seg": [
   [
    "a",
    "Birinchi tuzoq: <b><code>checkout</code> satri yo'q</b> — to'g'ri ko'rinadi, YAML xatosi ham yo'q",
    "To'rt tuzoqni ko'ramiz, har biri haqiqiy run. Birinchisi: ci yml'dan actions checkout satrini olib tashladik. Fayl to'g'ri ko'rinadi: setup node, npm si ay, npm test. YAML xatosi yo'q, GitHub faylni qabul qildi, run boshlandi."
   ],
   [
    "b",
    "Run: <code>setup-node</code> ✓, <b><code>npm ci</code> ✗ — «can only install with an existing package-lock.json»</b>",
    "Run qizil. Setup node yashil, Node o'rnatildi. Npm si ay qizil, logda: npm si ay faqat mavjud package lock json bilan o'rnatadi, lock yarating, deydi. Lekin lock faylimiz repoda bor, siz uni to'rtinchi ekranda ko'rdingiz. Xabar aldaydi: lock yo'q emas, butun papka bo'sh."
   ],
   [
    "c",
    "Demak, sabab: <b>runner bo'sh papkadan boshlaydi</b> — kodni <code>checkout</code> olib keladi, u yo'q",
    "Demak, sabab bitta: runner har safar bo'sh papkadan boshlaydi, to'rtinchi ekrandagi toza clone'dan ham bo'shroq, u yerda hatto clone ham yo'q. Kodni mashinaga actions checkout olib keladi. U yo'q, demak package json ham, lock ham yo'q, npm si ay nima o'rnatishini bilmaydi."
   ],
   [
    "d",
    "Xulosa: <b>birinchi qadam doim <code>checkout</code></b>; «lock yo'q» yoki «package.json yo'q» ko'rsangiz — shu satrni qidiring",
    "Xulosa: har workflow'da birinchi qadam actions checkout. Logda lock fayl yo'q yoki package json yo'q ko'rsangiz, repongizni tekshirmang, ci yml'dagi shu satrni qidiring. O'quvchi darsidagi ci yml'da ham bu satr yo'q, yigirma uchinchi ekranda ko'ramiz. Ikkinchi tuzoq: lock fayl."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · to'rt tuzoq",
  "title": "package.jsonni qo'lda o'zgartirdik, lock qolmadi — npm ci lentada ham, lokalda ham yiqiladi: «package.json and package-lock.json … in sync»; ikkinchi tuzoq",
  "seg": [
   [
    "a",
    "Ikkinchi tuzoq: <code>package.json</code>da <b>versiyani qo'lda o'zgartirdik</b>, <code>npm install</code> yurgizmadik — lock eskicha",
    "Ikkinchi tuzoq. Package json faylining o'ttizinchi satrida telegraf versiyasini qo'lda to'rt o'n olti nolga o'zgartirdik, npm install yurgizmadik. Package lock json'da hali to'rt o'n olti uch. Ikki fayl bir-biriga mos emas. Commit, push."
   ],
   [
    "b",
    "Lokalda ham, lentada ham: <b><code>npm ci</code> qizil — «in sync» emas</b>: lock'da 4.16.3, <code>package.json</code>da 4.16.0",
    "Natija lokalda ham, lentada ham bir xil: npm si ay qizil. Xabar: package json va package lock json in sync emas, ya'ni mos emas. Pastda aniq sabab: lock fayldagi telegraf to'rt o'n olti uch, package json'dagi to'rt o'n olti nolga mos kelmaydi."
   ],
   [
    "c",
    "Demak, sabab: <b><code>npm ci</code> lock fayldan aynan o'rnatadi</b>, mos kelmasa — o'rnatmaydi, qizil beradi",
    "Demak, sabab: npm si ay, ya'ni clean install, lock fayldan aynan o'rnatadi, bir baytini ham o'zgartirmaydi. Package json mos kelmasa, taxmin qilmaydi, qizil beradi. Bu to'g'ri: lentada hamma mashina aynan bir xil paketlarni olishi kerak."
   ],
   [
    "d",
    "Xulosa: <b>lokalda <code>npm install</code>, lentada <code>npm ci</code></b>; versiya o'zgarsa — lock ham commit'ga kiradi",
    "Xulosa: paket qo'shsangiz yoki versiya o'zgartirsangiz, lokalda npm install yurgizing: u lock'ni yangilaydi. Lock faylni ham commit'ga qo'shing. Lentada esa doim npm si ay: u lock'ga ishonadi va mos kelmasa to'xtaydi. Uchinchi tuzoq eng xavflisi: yashil, lekin yolg'on."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "user.service.tsda tur xatosi: ts-jest testlarni baribir yashil o'tkazadi — tsc qadamisiz lenta yashil (yolg'on), tsc bilan qizil; uchinchi tuzoq",
  "seg": [
   [
    "a",
    "Uchinchi tuzoq: <b>tur xatosi, test yashil</b> — <code>ts-jest</code> turni tekshirmaydi, <code>tsc</code> tekshiradi",
    "Uchinchi tuzoq. Src, api, user papkasidagi user service ts faylining o'n oltinchi satrida string'ni olib tashladik: telegram id endi number, ustun esa string. Npx tsc: yigirmanchi satrda xato, TS ikki uch ikki ikki, chiqish kodi ikki. Npm test: yigirma besh passed, yashil. Test turni tekshirmaydi."
   ],
   [
    "b",
    "Lentada <code>tsc</code> qadami yo'q (run 14): <b>hammasi yashil — yolg'on</b>; kod kompilyatsiya bo'lmaydi",
    "Shu kodni tsc qadamisiz ci yml bilan push qildik: checkout, setup node, npm si ay, npm test. Run yashil, oltita belgi yashil. Lekin bu yolg'on yashil: nest build bu kodni yig'a olmaydi, bot ishga tushmaydi. Lenta buni ko'rmadi, chunki hech kim so'ramadi."
   ],
   [
    "c",
    "<code>tsc</code> qadami bilan (run 15): <b><code>tsc</code> ✗, test va build skipped</b> — run qizil, chiqish kodi 2",
    "O'sha kod, tavsiya ci yml bilan: tsc qadami bor. Run qizil: tsc qizil, chiqish kodi ikki, npm test skipped, build skipped. Yonma-yon qarang: bir xil kod, bir xil testlar, bitta satr farq: npx tsc no emit. Birida yolg'on yashil, ikkinchisida haqiqiy qizil."
   ],
   [
    "d",
    "Xulosa: <b>lenta faqat so'ralgan narsani tekshiradi</b> — <code>tsc</code> qadamini test'dan oldin qo'ying",
    "Xulosa: lenta faqat siz so'ragan narsani tekshiradi. Testlar yashil, degani turlar to'g'ri degani emas. Npx tsc no emit qadamini npm test'dan oldin qo'ying: arzon, uch soniya, va build'gacha bormay to'xtatadi. To'rtinchi tuzoq: faylning o'zi."
   ]
  ]
 },
 "16": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Bu ci.yml bilan push qildik — run qizil, lekin ichida bitta qadam ham yo'q: «workflow file issue». Sababchi satrni toping",
  "q": "Uch tuzoqni ko'rdingiz, to'rtinchisini o'zingiz topasiz. Uchinchi tekshiruv. Bu ci yml bilan push qildik: run qizil, lekin ichida bitta qadam ham yo'q, GitHub workflow file issue dedi. YAML'da bitta ro'yxatning elementlari bir ustunda turadi. Ro'yxat yettinchi satrda boshlandi, keyingi element boshqa ustundan boshlanadi. Birinchi buzilgan satrni bosing.",
  "ok": "To'g'ri. Sakkizinchi satr qo'shnisidan ikki probel o'ngda boshlanadi: YAML uni ro'yxat elementi emas, oldingi elementning davomi deb o'qiydi va tushunmaydi. GitHub bunday faylni yurgizmaydi: run ro'yxatda qizil, lekin ichida job yo'q, qadam yo'q, log yo'q, faqat workflow file issue. Ekranda tuzatilgan: hamma chiziqcha bir chuqurlikda. Pastda ikkinchi fayl xatosi: runs on yo'q.",
  "okShort": "8-satr 2 probel o'ngda — YAML tushunmadi. Fayl xatosida job yo'q, qadam yo'q, log yo'q.",
  "hint": "- uses va - run chiziqchalari bir ustunda turishi kerak. Qaysi biri surilgan?",
  "task": "Qoida: YAML'da bitta ro'yxatning elementlari (<code>- </code>) bir ustunda turadi. Ro'yxat 7-satrda boshlandi; keyingi element boshqa ustundan boshlanadi — GitHub aynan shu satrni ko'rsatadi. <b>Birinchi buzilgan satrni bosing.</b>"
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · mashina farqi",
  "title": "Haqiqiy topilma: toza clone'da yashil edi, birinchi run'da npm ci qizil — Missing: webpack@5.112.2 from lock file; sabab — runner'da Node 22, mashinada Node 24",
  "seg": [
   [
    "a",
    "Birinchi run'imiz aslida <b>qizil edi</b>: <code>npm ci</code> — <code>Missing: webpack@5.112.2 from lock file</code>",
    "Endi haqiqiy topilma. Bu darsni tayyorlashda birinchi run qizil chiqdi. Npm si ay qadami: missing webpack from lock file. Lokalda esa to'rtinchi ekranda o'sha lock bilan npm si ay yashil edi. Bir xil kod, bir xil lock, boshqa natija. Menda ishlaydi, lekin lentada yo'q."
   ],
   [
    "b",
    "Farq: <b>mashinada Node 24 va npm 11, runner'da Node 22 va npm 10</b> — npm 10 lock'ni boshqacha o'qiydi",
    "Ikki mashinani yonma-yon qo'yamiz. Sizniki: node yigirma to'rt, npm o'n bir. Runner: ci yml'da node version yigirma ikki yozilgan edi, u bilan npm o'n keladi. Npm o'n lock faylning bir yozuvini, peer paketni, boshqacha o'qiydi va yo'q deb hisoblaydi."
   ],
   [
    "c",
    "Isbot lokalda: <b>npm 10 bilan <code>npm ci</code> — o'sha xato</b>; demak sabab kod emas, npm versiyasi",
    "Isbot: o'z mashinamizda npx bilan npm o'nni chaqirib npm si ay yurgizdik: aynan o'sha xato, missing webpack. Demak, sabab kodda ham, lock'da ham emas: lentadagi Node, demak npm, mashinadagidan boshqa. Lokalda yashil, lentada qizil bo'lsa, birinchi shuni solishtiring."
   ],
   [
    "d",
    "Xulosa: <b><code>node-version</code> — <code>node --version</code> raqamingiz</b>; 22 → 24 qilindi, run yashil",
    "Xulosa: ci yml'dagi node version mashinangizdagi node version bilan bir xil bo'lsin. Yigirma ikkini yigirma to'rtga o'zgartirdik, push, run yashil. Shuning uchun sakkizinchi ekrandagi faylda yigirma to'rt. Endi AI yozgan workflow'larni ko'ramiz: ikkalasi ham shu tuzoqqa tushdi."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: ikki AI'ga bitta oddiy prompt — ikkalasi to'g'ri ko'rinadigan workflow yozdi; endi ularni o'qiymiz, keyin lentada sinaymiz",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>workflow'ni AI yozadi, siz qabul qilasiz</b> — oddiy prompt, ishorasiz",
    "Jest darslaridagi kabi oxirgi bosqich AI bilan. Prompt oddiy: bu NestJS loyihasi uchun GitHub Actions workflow yozib ber, har push'da testlar yursin. Checkout, setup node, versiya, tsc, build, bu so'zlarning hech biri promptda yo'q. Har AI loyihaning alohida nusxasida ishladi."
   ],
   [
    "b",
    "Ikkalasi <b>to'g'ri ko'rinadigan fayl</b> yozdi: checkout, setup-node, <code>npm ci</code>, <code>npm test</code>",
    "Ikkalasi ham to'g'ri ko'rinadigan fayl yozdi. Birinchisi test yml, yigirma ikki satr: checkout, setup node, npm si ay, npm test, har qadamga o'zbekcha nom. Ikkinchisi ci yml, yigirma olti satr, xuddi shu qadamlar, qo'shimcha permissions contents read, faqat o'qish huquqi. YAML xatosi yo'q."
   ],
   [
    "c",
    "Lekin ikkalasida <b><code>node-version: 22</code></b> — mashinangizni so'ramadi; va <b><code>tsc</code> ham, <code>build</code> ham yo'q</b>",
    "Lekin ikki narsa. Ikkalasi ham node version yigirma ikki yozdi: sizning mashinangizda qaysi Node borligini so'ramadi, odatdagi raqamni qo'ydi. Va ikkalasida tsc ham, build ham yo'q: prompt testlar yursin dedi, AI aynan shuni qildi, ortig'ini emas."
   ],
   [
    "d",
    "Xulosa: <b>to'g'ri ko'ringan fayl hali tekshiruv emas</b> — lentaga qo'yib ko'ramiz",
    "Xulosa: to'g'ri ko'ringan workflow hali tekshiruv emas. Jest'dagi yashil test kabi: fayl chiroyli, lekin sizning mashinangizni va loyihangizni bilmaydi. Ikkalasini ham OrderBotNest'ning sinov tarmog'iga push qildik. Natija ekranda."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Ikkala AI workflow'i lentada qizil — npm ci, o'sha Missing: webpack… from lock file; faqat node-version tuzatilsa yashil, lekin tur xatosi baribir o'tadi",
  "seg": [
   [
    "a",
    "Run 19 va 20: <b>ikkalasi qizil, <code>npm ci</code> qadamida</b> — 17-ekrandagi o'sha xato",
    "Ikkala run ham qizil, ikkalasi ham npm si ay qadamida: missing webpack from lock file. O'n yettinchi ekrandagi tuzoq: node version yigirma ikki, npm o'n, lock boshqacha o'qildi. AI buni bilishi mumkin emas edi: u sizning mashinangizni ko'rmaydi."
   ],
   [
    "b",
    "Faqat bitta raqam: <b>22 → 24 — run 21 yashil</b>, <code>npm ci</code> ✓, <code>npm test</code> ✓; qadam nomi hali «Node.js 22»",
    "Birinchi AI faylida faqat bitta raqamni o'zgartirdik: node version yigirma to'rt. Push: run yashil, npm si ay o'tdi, npm test yigirma besh passed. Qadam nomi hali Node js yigirma ikki o'rnatish deb turibdi: nom emas, raqam ishlaydi. Bitta raqam, qizildan yashilga."
   ],
   [
    "c",
    "Lekin: <b><code>tsc</code> yo'q — 15-ekrandagi tur xatosi bu lentada yashil qoladi</b>; <code>build</code> ham yo'q",
    "Lekin yashil hali to'liq emas. Bu workflow'da tsc yo'q: o'n beshinchi ekrandagi tur xatosini push qilsangiz, run yashil qoladi, yolg'on yashil. Build ham yo'q: yig'ilmaydigan kod yashil o'tadi. Prompt testlar yursin dedi, AI faqat shuni qildi."
   ],
   [
    "d",
    "Xulosa: AI workflow'ini <b>to'rt savol bilan</b> qabul qiling: checkout · <code>node-version</code> meniki · <code>npm ci</code> · <code>tsc</code> va <code>build</code>",
    "Xulosa: AI yozgan workflow'ni to'rt savol bilan qabul qiling. Checkout bormi. Node version mening mashinamdagi bilan bir xilmi. Npm si ay'mi, install emasmi. Tsc va build qadamlari bormi. To'rttasiga ha bo'lsa, push qiling va run'ni ko'ring. Endi tekshirib olaylik."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI yozgan workflow: checkout@v4 · setup-node@v4 (node-version: 22) · npm install · npm test. Mashinangizda Node 24. Lentaga qo'yishdan oldin nimani o'zgartirasiz?",
  "q": "AI workflow'larini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI yozgan faylda checkout bor, setup node yigirma ikki, npm install va npm test. Mashinangizda Node yigirma to'rt. Lentaga qo'yishdan oldin nimani o'zgartirasiz? Variantni tanlang.",
  "ok": "To'g'ri. Uch narsa. Node version mashinangizdagi yigirma to'rt, aks holda o'n yettinchi ekrandagi qizil. Npm install o'rniga npm si ay: lentada lock'ga ishonamiz. Va tsc bilan build qadamlari: aks holda tur xatosi va yig'ilmaydigan kod yashil o'tadi. Demak, AI fayli boshlanish nuqtasi, to'rt savol esa sizniki.",
  "okShort": "<code>node-version</code> = <code>node --version</code> · <code>npm ci</code> · <code>tsc</code> + <code>build</code> qadamlari. Checkout qoladi.",
  "hint": "19-ekrandagi to'rt savolni shu faylga bering: checkout? versiya? ci? tsc/build?",
  "demak": "AI workflow'i — boshlanish nuqtasi: <code>node-version</code> meniki · <code>npm ci</code> · <code>tsc</code> va <code>build</code> · <code>checkout</code> qoladi.",
  "correct": 2,
  "opts": [
   "Hech narsa — checkout bor, qolgani ishlaydi",
   "Faqat npm install → npm ci — versiya muhim emas",
   "node-version 24, npm ci, tsc va build qadamlari",
   "checkoutni olib tashlash — setup-node o'zi olib keladi"
  ],
  "wrong": {
   "0": "node-version: 22 bilan npm ci qizil (17-ekran); npm install lentada lock'ni o'zgartiradi.",
   "1": "Versiya muhim: runner'dagi npm lock'ni boshqacha o'qiydi — 17-ekran.",
   "3": "setup-node faqat Node o'rnatadi; kodni checkout olib keladi (13-ekran)."
  }
 },
 "21": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga workflow yozdiring, to'rt savol bilan tuzating, push — yashil; keyin tur xatosi bilan push — qizil bo'lsin",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>aniq shartli prompt</b> — OrderBotNest uchun workflow",
    "Endi navbat sizga. O'z AI'ingizga OrderBotNest uchun workflow yozdirasiz, promptni pastdagi tugma bilan nusxalaysiz. Keyin to'rt savol bilan tekshirib, o'z reponingizga push qilasiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>to'rt savol</b> — checkout · <code>node-version</code> meniki · <code>npm ci</code> · <code>tsc</code> va <code>build</code>",
    "Birinchi qadamda promptni berasiz. Ikkinchisida faylni to'rt savol bilan o'qiysiz: checkout bormi, node version mashinangizdagi raqammi, npm si ay'mi, tsc va build qadamlari bormi. Yetishmaganini qo'lda qo'shing yoki AI'dan so'rang."
   ],
   [
    "c",
    "3–4-qadam: <b>push — yashil; tur xatosi bilan push — <code>tsc</code> qizil</b>, tiklash; isbot — qizil run'ning qadam nomi",
    "Uchinchi qadamda push: run yashil bo'lishi kerak. To'rtinchisida user service ts'ning o'n oltinchi satrida string'ni olib tashlab push qilasiz: run qizil, tsc qadamida, test skipped. Tiklab push, yashil. Isbot maydoniga qizil run'da qaysi qadam qizarganini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan workflow'ni to'rt savol bilan qabul qilgansiz va lenta tur xatosini ham ushlashini o'zingiz ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Prompt",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga (<node --version raqamingiz> o'rniga o'z raqamingiz)"
    ],
    "exp": ".github/workflows/ci.yml"
   },
   {
    "t": "To'rt savol",
    "cmds": [
     "checkout@v4 bor",
     "node-version = node --version",
     "npm ci (install emas)",
     "npx tsc --noEmit va npm run build qadamlari bor — yetishmasa qo'shing"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Push — yashil",
    "cmds": [
     "git add .github && git commit -m \"ci: AI workflow\" && git push mine HEAD:main"
    ],
    "exp": "run ✓ (checkout · setup-node · ci · tsc · test · build)"
   },
   {
    "t": "Tur xatosi — qizil",
    "cmds": [
     "src/api/user/user.service.ts 16-satr String(from.id) → from.id",
     "commit, push",
     "keyin git checkout -- src/api/user/user.service.ts, commit, push"
    ],
    "exp": "run ✗: npx tsc --noEmit ✗ · npm test skipped → keyin run ✓"
   }
  ],
  "proof": {
   "label": "4-qadamdagi qizil run'da qizargan qadam nomi",
   "placeholder": "masalan: npx tsc --noEmit",
   "re": "tsc",
   "flags": "i",
   "wrong": "Qizil run'ni oching: qaysi qadam qizil? Uning nomini yozing (tsc bo'lishi kerak)."
  },
  "trouble": [
   [
    "npm ci qizil, Missing: … from lock file",
    "node-version mashinangizdan boshqa — 2-savol (17-ekran)"
   ],
   [
    "4-qadamda run yashil",
    "tsc qadami yo'q yoki npm testdan keyin turibdi — npx tsc --noEmit npm cidan keyin, npm testdan oldin"
   ],
   [
    "Run qizil, job yo'q (workflow file issue)",
    "YAML surilish — - uses va - run bir ustunda (16-ekran)"
   ],
   [
    "AI npm install yozdi",
    "npm ci ga almashtiring (14-ekran)"
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · CD",
  "title": "Lenta dist yig'di — lekin node dist/main toza mashinada darhol yiqiladi: DATABASE_URL topilmadi. CD shu yerdan boshlanadi: secret, server, chiqarish — keyingi darslar",
  "seg": [
   [
    "a",
    "Lenta <code>dist</code> yig'di — <b><code>node dist/main</code> toza mashinada yiqiladi</b>: <code>DATABASE_URL topilmadi</code>",
    "CI tugadi: dist papkasi tayyor. Endi uni ishga tushirib ko'raylik, toza mashinada: node dist main. Darhol xato: DATABASE URL topilmadi, env'ga Postgres manzilini yozing. Lokalda env faylingiz bor, lentada yo'q, va bo'lmasligi ham kerak: parol commit'ga kirmaydi."
   ],
   [
    "b",
    "CD: <b>tekshirilgan paketni chiqarish</b> — Delivery: odam tugmani bosadi; Deployment: lenta o'zi",
    "Mana CD'ning chegarasi. Continuous Delivery: lenta paketni tayyorlab qo'yadi, odam chiqar tugmasini bosadi. Continuous Deployment: yashil bo'lsa, lenta o'zi serverga chiqaradi. Ikkalasiga ham uch narsa kerak: maxfiy qiymatlar, server va chiqarish buyrug'i."
   ],
   [
    "c",
    "Kerak: <b><code>DATABASE_URL</code> va <code>BOT_TOKEN</code> — GitHub Secrets</b>; server; chiqarish buyrug'i",
    "Maxfiy qiymatlar GitHub Secrets'da saqlanadi, ci yml ularni nom bilan oladi, qiymatini hech kim ko'rmaydi. Server, bot qayerda yuradi. Va chiqarish buyrug'i. Bularning har biri alohida mavzu, bugungi dars emas."
   ],
   [
    "d",
    "Xulosa: <b>bugun CI to'liq, CD chegarasi aniq</b>; secrets va run'ni o'qish — keyingi mentor darsida",
    "Xulosa: bugun CI to'liq: har push'da to'rt qadam, yashil yoki qizil. CD'ning chegarasini ko'rdingiz: paket bor, lekin maxfiy qiymatlarsiz yurmaydi. Keyingi mentor darsida GitHub Actions'ga chuqurroq kiramiz: run'ni o'qish, secrets, cache. Hozir esa sinfga tayyorgarlik."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4c-01 · «CI/CD nima va nega kerak»",
  "title": "O'quvchi darsi: aeroport lentasi — chamadon, Yig'ish, Skaner, O'lcham ramkasi, O'rash, Uchirish; siz bilgan to'rt qadamning rasmli varianti",
  "seg": [
   [
    "a",
    "m4c-01 — 20 ekran: <b>aeroport lentasi, besh nuqta</b>; o'quvchi <code>ci.yml</code> bo'shliqlarini to'ldiradi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m4c-01, yigirma ekran. Metafora aeroport lentasi: chamadon bu kod, besh nuqta: yig'ish, skaner, o'lcham ramkasi, o'rash, uchirish. O'quvchi ci yml'dagi uch bo'shliqni to'ldiradi va amaliyotda o'z reposiga ci yml yozadi."
   ],
   [
    "b",
    "O'quvchi so'zlari: <b>Yig'ish — <code>npm install</code>, Skaner — <code>npm test</code>, start signali — <code>on: push</code></b>",
    "O'quvchi so'zlari: yig'ish bu npm install, skaner npm test, o'lcham ramkasi eslint, o'rash build, uchirish deploy. Start signali on push, yo'l xaritasi ci yml, lenta mashinasi runner. Qizil chiroq, lenta to'xtaydi, bu chiqish kodi. Sinfda so'zni atamasi bilan birga ayting."
   ],
   [
    "c",
    "Siz qo'shasiz: <b><code>checkout</code> satri — o'quvchi <code>ci.yml</code>ida yo'q</b>; <code>npm ci</code> sababi; bitta haqiqiy run",
    "Darsga siz qo'shadigan narsalar. O'quvchi darsidagi ci yml'da checkout satri yo'q: amaliyotda bitta qator qo'shing, deb ayting, aks holda uning run'i o'n uchinchi ekrandagi xato bilan qizaradi. Npm si ay'ning sababini bir gapda ayting. Va bitta haqiqiy run'ni ekranda ko'rsating."
   ],
   [
    "d",
    "Xulosa: o'quvchi «run yo'q» desa — <b>papka yo'li va push</b>; pastda uch vaziyat va savollar",
    "Xulosa: o'quvchi Actions'da run yo'q desa, avval fayl yo'lini va push'ni tekshiring. Package json topilmadi chiqsa, checkout. Workflow file issue, YAML. Pastda uch vaziyat va o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Sizda npm test yashil, hamkorda qizil. CI buni qanday hal qiladi?",
    "o": [
     "Hamkorga sizning node_modulesingizni yuboradi",
     "Har push'da toza mashinada bir xil buyruqlarni yurgizadi",
     "Testlarni GitHub'ga ko'chiradi — lokalda npm test endi yurmaydi",
     "Qizil testni avtomatik tuzatib qo'yadi"
    ],
    "c": 1,
    "e": "Toza mashina — hammaga bir xil javob.",
    "s": 2
   },
   {
    "q": "Lentada tsc qadami chiqish kodi 2 berdi. npm test qadami?",
    "o": [
     "Yuradi — tur xatosi testga aloqasi yo'q",
     "Yuradi, lekin natijasi run holatiga hisobga olinmaydi",
     "«Skipped» — birinchi qizil qadamdan keyin yurmaydi",
     "Yuradi, run sariq bo'lib kutadi"
    ],
    "c": 2,
    "e": "Nol emas — lenta to'xtaydi.",
    "s": 11
   },
   {
    "q": "Toza clone'da npm test: sh: 1: jest: not found, kod 127. Sabab?",
    "o": [
     "node_modules yo'q — o'rnatish qadami yurmagan",
     "Jest package.jsonda yo'q — devDependenciesga qo'shish kerak",
     "Node versiyasi eski — Jest yangi",
     "Test fayllari yo'q — Jest topmadi"
    ],
    "c": 0,
    "e": "Lentada birinchi qadam — npm ci.",
    "s": 5
   },
   {
    "q": "ci.ymlda actions/checkout satri yo'q. Lentada nima bo'ladi?",
    "o": [
     "YAML xatosi — GitHub faylni qabul qilmaydi",
     "setup-node kodni o'zi olib keladi, yashil",
     "npm ci qizil — «lock yo'q», chunki papka bo'sh",
     "Run ochiladi, lekin hech qaysi qadam yurmaydi"
    ],
    "c": 2,
    "e": "Runner bo'sh papkadan boshlaydi.",
    "s": 13
   },
   {
    "q": "package.jsonda versiyani qo'lda o'zgartirdingiz, lock eskicha. Lentada npm ci?",
    "o": [
     "O'rnatadi — package.json ustun",
     "Lock'ni o'zi yangilab o'rnatadi",
     "Qizil — «in sync» emas, mos kelmaydi",
     "O'rnatadi, lekin terminalda ogohlantirish yozadi"
    ],
    "c": 2,
    "e": "npm ci lock'dan aynan; mos kelmasa — qizil.",
    "s": 14
   },
   {
    "q": "Tur xatosi bor, ci.ymlda tsc qadami yo'q, testlar yashil. Run?",
    "o": [
     "Qizil — npm test tur xatosini ko'radi va to'xtaydi",
     "Yashil — lenta so'ralmagan narsani tekshirmaydi",
     "Qizil — setup-node turni tekshiradi",
     "Sariq — GitHub ogohlantiradi, kutadi"
    ],
    "c": 1,
    "e": "Yolg'on yashil — tsc qadamini qo'shing.",
    "s": 15
   },
   {
    "q": "Lokalda npm ci yashil, lentada Missing: webpack… from lock file. Birinchi nimani solishtirasiz?",
    "o": [
     "package.jsondagi webpack satrini",
     "Lock faylning hajmini",
     "node-version va node --version raqamini",
     "npm test natijasini lokalda va lentada solishtirasiz"
    ],
    "c": 2,
    "e": "Runner'dagi npm boshqa — lock'ni boshqacha o'qiydi.",
    "s": 17
   },
   {
    "q": "AI workflow: checkout, node-version: 22, npm install, npm test. Nima yetishmaydi?",
    "o": [
     "Hech narsa — to'rt qadam yetarli",
     "permissions — usiz run ochilmaydi",
     "Ikkinchi job — testlar va build alohida job'larda bo'lsin",
     "Versiya meniki, npm ci, tsc va build qadamlari"
    ],
    "c": 3,
    "e": "To'rt savol: checkout · versiya · ci · tsc/build.",
    "s": 19
   }
  ]
 },
 "25": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
// ============================================================
//  MENTOR KURSI · CI/CD-1 «Lenta: OrderBotNest'ning testlari har push'da o'zi yuradi» (v2, F-1104-20)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/14-CICD1-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar cicd1-start (= jest2-done) → cicd1-done (.github/workflows/ci.yml)
//  Kod, yml, terminal va HAQIQIY GitHub Actions run'lari: 03b-kod.gen.jsx (dev/cicd1-kod.py — repo teglari, manba/cicd1v2-yml, manba/cicd1v2-out, gh api)
//  AI tajribasi: manba/cicd1v2-ai/ (ai1 Opus · ai2 Haiku — ikkalasi node-version 22, tsc/build yo'q; run 19/20 qizil, 21 yashil)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd1/parts/*.jsx > CiCdIntroMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-cicd-01-lenta-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "Lenta: OrderBotNest'ning testlari har push'da o'zi yuradi";
const C1 = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', pass: '#15803D', fail: '#C2410C', gh: '#1F2328', ci: '#1F6FEB', cd: '#B45309', yml: '#7C3AED' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.ya?ml$/.test(f) ? C1.yml : /\.spec\.ts$/.test(f) ? '#99425B' : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
const byTree = (a, b) => {
  const A = a.split('/'), B = b.split('/');
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] === B[i]) continue;
    const ad = i < A.length - 1 || (i === A.length - 1 && a.endsWith('/')), bd = i < B.length - 1 || (i === B.length - 1 && b.endsWith('/'));
    if (ad !== bd) return ad ? -1 : 1;
    return A[i].toLowerCase() < B[i].toLowerCase() ? -1 : 1;
  }
  return A.length - B.length;
};
const tree = (...groups) => Array.from(new Set(groups.flat())).sort(byTree);
const F = {
  ci: '.github/workflows/ci.yml', ord: 'src/api/order/order.service.ts', ors: 'src/api/order/order.service.spec.ts',
  usr: 'src/api/user/user.service.ts', pkg: 'package.json', lock: 'package-lock.json',
  tg: 'src/api/telegram/telegram.service.ts', ph: 'src/api/telegram/phone.ts', phs: 'src/api/telegram/phone.spec.ts',
  app: 'src/api/app.controller.ts', apps: 'src/api/app.controller.spec.ts',
};
const BASE_FILES = ['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.app, F.apps, 'src/api/cart/', 'src/api/catalog/', F.ord, F.ors, F.usr, F.tg, F.ph, F.phs, 'src/api/telegram/keyboards.ts', 'src/api/telegram/texts.ts', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, F.lock, 'README.md'];
const FILES = (...extra) => tree(BASE_FILES, extra);
MKCFG.files = FILES();
const dirOf = (f) => (f.endsWith('/') ? f.slice(0, -1) : f).split('/').slice(0, -1).join('/');
function compact(files, active) {
  const A = active ? dirOf(active) : '';
  const out = files.map((f) => {
    const d = dirOf(f);
    if (!d || d === A || A.startsWith(d + '/') || f.endsWith('/')) return f;
    const ps = d.split('/'), as = A ? A.split('/') : [];
    let k = 0; while (k < ps.length && ps[k] === as[k]) k++;
    return ps.slice(0, k + 1).join('/') + '/';
  });
  return tree(out);
}

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['npx tsc no emit', 'npx tsc --noEmit'], ['npm si ay', 'npm ci'], ['ci yml', 'ci.yml'], ['package lock json', 'package-lock.json'], ['package json', 'package.json'],
  ['actions checkout', 'actions/checkout'], ['setup node', 'setup-node'], ['node version', 'node-version'], ['runs on', 'runs-on'], ['ubuntu latest', 'ubuntu-latest'],
  ['order service ts', 'order.service.ts'], ['user service ts', 'user.service.ts'], ['git checkout jest ikki done', 'git checkout jest2-done'], ['jest ikki done', 'jest2-done'],
  ['node dist main', 'node dist/main'], ['pull request', 'pull_request'], ['on push', 'on: push'], ['nest build', 'nest build'], ['git remote', 'git remote'],
  ['process completed with exit code one', 'Process completed with exit code 1'], ['missing webpack from lock file', 'Missing: webpack@5.112.2 from lock file'],
  ['could not read package json', 'Could not read package.json'], ['workflow file issue', 'workflow file issue'], ['TS ikki uch ikki ikki', 'TS2322'],
  ['DATABASE URL', 'DATABASE_URL'], ['env', '.env'], ['Node js', 'Node.js'], ['Actions', 'Actions'], ['m4c-01', 'm4c-01'], ['npm install', 'npm install'],
];
DIGITS.unshift(["o'ttiz oltinchi satr", '36-satr'], ["o'ttiz yettinchi satr", '37-satr'], ["o'n oltinchi satr", '16-satr'], ["yigirmanchi satr", '20-satr'], ["o'ttizinchi satr", '30-satr'],
  ["sakkizinchi satr", '8-satr'], ["yettinchi satr", '7-satr'], ["uchinchidan beshinchi satrgacha", '3–5-satrlar'], ["birinchi ikki satr", '1–2-satrlar'], ["oxirgi to'rt satr", '12–15-satrlar'],
  ["olti yuz o'ttiz uchta", '633 ta'], ["o'n besh soniya", '15 soniya'], ["olti soniya", '6 soniya'], ["uch soniya", '3 soniya'], ["ikki soniya", '2 soniya'], ["to'rt soniya", '4 soniya'],
  ["yuz yigirma yetti", '127'], ["yigirma to'rt", '24'], ["yigirma ikki", '22'], ["to'rt o'n olti nol", '4.16.0'], ["to'rt o'n olti uch", '4.16.3'], ["o'n besh satr", '15 satr'], ["o'n bir", '11'], ["o'n", '10'],
  ["yigirma besh", '25'], ["yigirma olti", '26'], ["yigirma daqiqa", '20 daqiqa'], ["o'n ikki daqiqa", '12 daqiqa'], ['yigirma ekran', '20 ekran'], ['besh nuqta', '5 nuqta']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/Continuous Integration/g, /Continuous Delivery/g, /Continuous Deployment/g, /Process completed with exit code/gi, /workflow file issue/gi, /from lock file/gi, /Missing: webpack/gi,
  /could not read package json/gi, /can only install with an existing package lock json/gi, /in sync/gi, /clean install/gi, /not found/gi, /skipped/g, /Set up job/gi, /no emit/gi, /runner/gi, /Secrets/g);

// Kod rang beruvchilar: TypeScript (Jest-2 dan), YAML (CI/CD-2 dan), terminal (npm · jest · tsc · GitHub log)
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string|in|unknown)$/;
function tsLine(src) {
  const re = /(\/\/.*$|\/\*.*?\*\/)|(`(?:[^`\\]|\\.)*`?|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@\w+)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, dec, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (dec) out += `<span class="d">${escH(dec)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
function yamlLine(src) {
  const m = /^(\s*)(- )?([\w-]+)(:)(.*)$/.exec(src);
  if (!m) return /^\s*#/.test(src) ? `<span class="cm">${escH(src)}</span>` : escH(src);
  const [, ind, dash, key, colon, rest] = m;
  const cm = rest.indexOf(' #');
  const val = cm >= 0 ? rest.slice(0, cm) : rest, com = cm >= 0 ? rest.slice(cm) : '';
  return `${ind}${dash ? '<span class="p">- </span>' : ''}<span class="k">${escH(key)}</span>${colon}${val.trim() ? `<span class="s">${escH(val)}</span>` : escH(val)}${com ? `<span class="cm">${escH(com)}</span>` : ''}`;
}
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓|^npm ci ✓|^tsc ✓|^added \d+ packages/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●|^npm error|^##\[error\]|error TS\d+|^Error:|^X |^sh: |not found|^\s*throw new Error/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^Tests:.*failed|\[chiqish kodi: [1-9]\d*/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—|>|\d+ \||\|)|^npm warn|^Snapshots|^Time:|^Ran all|^Test Suites|^\s*Types of|^\s*Type '|^\s*Overload|^\s*Object literal|^  [a-z]|^---/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
// Terminal chiqishlari — cicd1v2-out/0N (aynan)
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outFind = (k, re) => { const L = outLines(k); const i = L.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
const outPick = (k, keep, meta = {}) => outLines(k).filter(keep).map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
// reA dan (shu qator bilan) reB gacha (shu qator bilan; null — oxirigacha), keep — filtr
const outRange = (k, reA, reB, keep = () => true) => { const L = outLines(k); let a = L.findIndex((l) => reA.test(l)); if (a < 0) a = 0; let b = reB ? L.findIndex((l, i) => i >= a && reB.test(l)) : L.length - 1; if (b < 0) b = L.length - 1; return L.slice(a, b + 1).filter(keep).map((l) => ({ h: jestLine(l) })); };
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: jestLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
// Kod bo'laklari — KOD[k] (repo teglari / yml fayllari), satr raqami bilan; fayl turiga qarab rang
const hlOf = (f) => (/\.ya?ml$/.test(f) ? yamlLine : tsLine);
const kod = (k, ids = {}, from, to, edit = {}) => { const hl = hlOf(KOD[k].file); return KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: hl(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  if (edit[l.n] === false) return [{ ...base, gone: true }];
  return [{ ...base, gone: true }, { h: hl(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
}); };
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(F.ci), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;
const Yml = ({ k = 'CI_DONE', ids, from, to, edit, focus, beat, title, style }) => <CodePanel file={title || `.github/workflows/ci.yml${KOD[k].tag && KOD[k].tag !== 'cicd1-done' ? ' · ' + KOD[k].tag : ''}`} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} style={style} />;

function AiReply({ who, prompt, said, diff, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
    {diff && <pre className="df">{diff}</pre>}
  </div>;
}
const Card = ({ c = T.accent, h, children, hl, dim, style }) => <div className={`mk-box${hl ? ' hl' : ''}`} style={{ '--c': c, opacity: dim ? 0.4 : 1, transition: 'opacity .3s', ...(style || {}) }}><h4>{h}</h4>{children}</div>;
function Cause({ items, on, bad }) {
  return <div className="cause">{items.map((x, i) => <div key={i} className={`${i < on ? 'on' : ''}${bad === i ? ' bad' : ''}`}><i>{i + 1}</i><span>{x}</span></div>)}</div>;
}
const mkPractice = (n, hls, extra = {}) => {
  const m = MDT[n]; const pr = m.proof;
  return {
    S: mkS(n, hls.map((hl) => ({ hl })), { tableAt: 3 }), steps: m.steps, trouble: m.trouble,
    proof: { label: pr.label, placeholder: pr.placeholder, check: (v) => new RegExp(pr.re, pr.flags).test(v), wrong: pr.wrong }, ...extra,
  };
};
const Demak = (n) => <span dangerouslySetInnerHTML={html(MDT[n].demak)} />;
function MC(p, n, more) {
  const m = MDT[n];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong} demak={Demak(n)} {...more} />;
}

// Lenta chizig'i — OrderBotNest'ning to'rt qadami (holat: ok | bad | skip), savol qatori, soniya
const LENTA = [['ci', 'npm ci', "paketlar o'rnatildimi?"], ['tsc', 'npx tsc --noEmit', "turlar to'g'rimi?"], ['test', 'npm test', 'testlar yashilmi?'], ['build', 'npm run build', "dist yig'ildimi?"]];
const L_ST = { ok: '✓ yashil', bad: '✗ qizil', skip: '— yurmadi' };
function Lenta4({ st = {}, hl = [], q, dur = {}, dim }) {
  return <div className="c1-lenta">
    {LENTA.map(([k, cmd, qq], i) => <div key={k} className={`${st[k] || ''}${hl.includes(k) ? ' hl' : ''}${dim && !hl.includes(k) ? ' dim' : ''}`} style={{ animation: `mk-up .35s ${i * 0.08}s ease both` }}>
      <span className="ic">{i + 1}</span><code>{cmd}</code>{q && <em>{qq}</em>}{st[k] && <small>{L_ST[st[k]]}</small>}{dur[k] && <b>{dur[k]}</b>}
    </div>)}
  </div>;
}
// Ikki mashina kartasi: sizniki ↔ runner
function Machines({ left, right, hl }) {
  const box = (m, side) => <div className={`c1-mach ${m.st || ''}${hl === side ? ' hl' : ''}`}>
    <h4>{m.h}</h4>{(m.rows || []).map(([a, b]) => <div key={a} className="r"><span>{a}</span><code>{b}</code></div>)}{m.note && <p>{m.note}</p>}
  </div>;
  return <div className="pg-two">{box(left, 'l')}{box(right, 'r')}</div>;
}

// GitHub Actions run oynasi — HAQIQIY run ma'lumotidan (KOD.RUNS: gh api — job, qadam, soniya, annotatsiya, log). Skrinshot emas: maket, lekin har nom, holat, vaqt va log satri o'sha run'dan.
const GH_ST = { ok: '✓', bad: '✗', skip: '⊘', wait: '●', off: '○' };
const hhmm = (iso) => { if (!iso) return ''; const h = (Number(iso.slice(11, 13)) + 5) % 24; return `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${String(h).padStart(2, '0')}:${iso.slice(14, 16)}`; };
const lg = (arr = []) => arr.map((t) => ({ t, c: /^\$ /.test(t) ? 'cmd' : /^##\[error\]|npm error|^FAIL|✕|●|Received|not found|error TS|^X /.test(t) ? 'er' : /^PASS|✓|passed|^added \d+/.test(t) ? 'ok' : /warn|deprecated/.test(t) ? 'wn' : /^\s*(>|\d+ \||\|)|^>/.test(t) ? 'cm' : '' }));
const runLog = (k, step, keep) => lg((KOD.RUNS[k].log[step] || []).filter(keep || (() => true)));
const stepIdx = (k, step) => visibleSteps(k).findIndex((s) => s[0] === step);
const visibleSteps = (k) => { const r = KOD.RUNS[k]; return r.jobs.length ? r.jobs[0].steps.filter((s) => !/^Post /.test(s[0])) : []; };
function RunView({ k, open, lines, hlStep, ann, note, only }) {
  const r = KOD.RUNS[k]; const j = r.jobs[0]; const steps = visibleSteps(k).filter((s) => !only || only.test(s[0]));
  const hs = Array.isArray(hlStep) ? hlStep : hlStep == null ? [] : [hlStep];
  const oi = typeof open === 'string' ? stepIdx(k, open) : open;
  const a = ann === undefined ? (r.ann || []).find(([lv]) => lv === 'failure') : ann;
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{t("haqiqiy run · #", "настоящий run · #")}{r.n}</span></div>
    <div className="hd"><span className={`dot ${r.st}`}>{GH_ST[r.st]}</span><b>{r.title}</b><span>{r.br} · {r.sha}</span><span className="du">{r.dur !== '0 s' ? r.dur : ''}{r.at ? ` · ${hhmm(r.at)}` : ''}</span></div>
    {a && <div className="ann"><b>Annotations · {j ? j.name : 'test'}</b><span>{a[1]}</span></div>}
    {note && <div className="ann nt"><b>{note[0]}</b><span>{note[1]}</span></div>}
    {r.wfIssue ? <div className="empty"><b style={{ color: '#CF222E' }}>✗ This run likely failed because of a workflow file issue.</b><br />{t("job yo'q · qadam yo'q · log yo'q — GitHub faylni o'qiy olmadi", "job нет · шагов нет · лога нет — GitHub не смог прочитать файл")}</div> : <div className="rb">
      <div className="jobs">{r.jobs.map((x, i) => <div key={i} className={`jb ${x.st}${i === 0 ? ' on' : ''}`}><span className="dot">{GH_ST[x.st]}</span>{x.name}<small>{x.dur}</small></div>)}</div>
      <div className="steps">
        {steps.map(([n, st, du], i) => <div key={i} className={`st ${st}${hs.includes(n) || hs.includes(i) ? ' hl' : ''}`}>
          <span className="dot">{GH_ST[st]}</span><span className="nm">{n}</span><small>{st === 'skip' ? 'skipped' : du}</small>
          {oi === i && lines && lines.length > 0 && <pre className="log">{lines.map((l, q) => <span key={q} className={l.c || ''}>{l.t}{'\n'}</span>)}</pre>}
        </div>)}
      </div>
    </div>}
  </div>;
}
// Run ro'yxati (Actions bo'limi) — bir nechta haqiqiy run qatori
function RunRows({ keys, hl = [] }) {
  return <div className="c2-gh"><div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{t("haqiqiy run'lar", "настоящие run")}</span></div>
    <div className="lst">{keys.map((k) => { const r = KOD.RUNS[k]; return <div key={k} className={`row ${r.st}${hl.includes(k) ? ' hl' : ''}`}><span className="dot">{GH_ST[r.st]}</span><span className="tl"><b>{r.title}</b><small>CI #{r.n} · {r.sha}</small></span><span className="brn">{r.br}</span><span className="tm"><small>{hhmm(r.at)}</small><small>{r.dur}</small></span></div>; })}</div>
  </div>;
}

// CI/CD-1 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.c1-l3 .z-tbl th,.c1-l3 .z-tbl td{text-align:center;vertical-align:middle}
.c1-l3 .z-tbl .l{text-align:left}
.c1-l3 .c0{background:#DCFCE7;color:#15803D;font-weight:700}
.c1-l3 .cx{background:#FEE2E2;color:#B91C1C;font-weight:700}
.c1-l3 .sk{color:#9CA3AF;background:repeating-linear-gradient(135deg,#fff 0 6px,#F3F4F6 6px 12px)}
.c1-l3 small{display:block;font:11px system-ui,sans-serif;font-weight:400;color:#6B7280}
.c1-l3 .r{font:700 12px system-ui,sans-serif;border-radius:999px;padding:2px 8px;white-space:nowrap}
.c1-l3 .r.g{background:#DCFCE7;color:#15803D}.c1-l3 .r.x{background:#DC2626;color:#fff}
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:stretch}
@media (max-width:1000px){.pg-three{grid-template-columns:1fr 1fr}}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1000px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
.pg-dict{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.pg-dict td{padding:8px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line}}
.pg-dict td:first-child{border-left:4px solid ${T.accent};border-radius:10px 0 0 10px}
.pg-dict td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0;color:${T.ink2}}
.pg-dict code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px}
.mk-panel .jp{background:${C1.pass};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.mk-panel .jf{background:${C1.fail};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${C1.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${C1.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${C1.ai}}
.ai-card .sd code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px}
.ai-card .df{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.codeInk};background:${C1.term};white-space:pre;overflow-x:auto}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
/* Lenta chizig'i — to'rt qadam */
.c1-lenta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.c1-lenta>div{border:1.5px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 8px;text-align:center;display:grid;gap:4px;justify-items:center;transition:opacity .3s,border-color .3s,background .3s}
.c1-lenta .ic{display:inline-flex;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font:700 12px ${MONO};color:#fff;background:${T.ink3}}
.c1-lenta .ok .ic{background:${T.green}}
.c1-lenta .bad .ic{background:${T.accent}}
.c1-lenta code{font:12.5px ${MONO};color:${T.ink}}
.c1-lenta em{font:12.5px ${SANS};font-style:normal;color:${T.ink2}}
.c1-lenta small{font:600 11.5px ${SANS}}
.c1-lenta b{font:700 12px ${MONO};color:${T.ink2}}
.c1-lenta .ok{border-color:${T.green};background:#E3F5EC}
.c1-lenta .ok small{color:${T.green}}
.c1-lenta .bad{border-color:${T.accent};background:#FFF0EB}
.c1-lenta .bad small{color:${T.accent}}
.c1-lenta .skip{opacity:.45}
.c1-lenta .dim{opacity:.35}
.c1-lenta .hl{box-shadow:0 0 0 3px rgba(226,69,31,.18);border-color:${T.accent}}
/* Ikki mashina */
.c1-mach{border:2px solid ${T.line};border-radius:14px;background:${T.paper};padding:12px 14px;display:grid;gap:6px;align-content:start;transition:all .35s}
.c1-mach h4{margin:0 0 2px;font:800 14px ${SANS};color:${T.ink}}
.c1-mach .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;font-size:13px;color:${T.ink2}}
.c1-mach .r code{font:12.5px ${MONO};background:#F4F5F7;border-radius:6px;padding:2px 7px;color:${T.ink}}
.c1-mach p{margin:4px 0 0;font-size:13px;line-height:1.45;color:${T.ink2}}
.c1-mach.ok{border-color:${T.green};background:#F1FAF5}
.c1-mach.bad{border-color:${T.accent};background:#FFF5F1}
.c1-mach.hl{box-shadow:0 0 0 4px rgba(226,69,31,.14)}
/* Chiqish kodi qatorlari */
.c1-code{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper}}
.c1-code .n{font:800 22px ${MONO};text-align:center}
.c1-code .t{font-size:13.5px;line-height:1.4}
.c1-code .t code{font:12px ${MONO};color:${T.ink2}}
/* CD oqimi */
.c1-cd{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:stretch}
.c1-cd>div{border:2px solid var(--c);border-radius:12px;padding:10px;background:${T.paper};display:grid;gap:4px;align-content:start;transition:opacity .3s}
.c1-cd h4{margin:0;font:800 13px ${SANS};color:var(--c)}
.c1-cd p{margin:0;font-size:12.5px;line-height:1.4;color:${T.ink2}}
.c1-cd .dim{opacity:.35}
/* Bosqich kartasi (AI) */
.c1-stage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c1-stage>div{border:2px solid var(--c);border-radius:14px;padding:14px;background:${T.paper};transition:opacity .35s}
.c1-stage h4{margin:0 0 4px;font:800 14px ${SANS};color:var(--c)}
.c1-stage p{margin:0;font-size:13.5px;color:${T.ink2};line-height:1.45}
/* GitHub Actions oynalari (haqiqiy run ma'lumotidan) */
.c2-gh{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;color:${C1.gh}}
.c2-gh .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE;font:600 12px ${SANS}}
.c2-gh .bar .lg{font-weight:800}
.c2-gh .bar .src{margin-left:auto;font:600 10.5px ${MONO};color:#57606A;background:#fff;border:1px solid #D0D7DE;border-radius:6px;padding:3px 7px}
.c2-gh .dot{display:inline-flex;flex:none;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;color:#fff;background:#8C959F}
.c2-gh .ok>.dot,.c2-gh .dot.ok{background:#1A7F37}
.c2-gh .bad>.dot,.c2-gh .dot.bad{background:#CF222E}
.c2-gh .wait>.dot,.c2-gh .dot.wait{background:#BF8700}
.c2-gh .lst{display:grid}
.c2-gh .row.ok,.c2-gh .row.bad,.c2-gh .row.skip,.c2-gh .row.wait,.c2-gh .row.off,.c2-gh .jb.ok,.c2-gh .jb.bad,.c2-gh .jb.wait{color:#1F2328}
.c2-gh .st.ok,.c2-gh .st.bad,.c2-gh .st.wait{color:#E6EDF3}
.c2-gh .st.skip,.c2-gh .st.off{color:#8B949E}
.c2-gh .row{display:flex;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px solid #EAEEF2;transition:opacity .3s,background .3s}
.c2-gh .row.hl{background:#FFF8C5}
.c2-gh .row .tl{display:grid;gap:2px;min-width:0}
.c2-gh .row .tl b{font:600 14px ${SANS};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .row small{font:12px ${SANS};color:#57606A}
.c2-gh .row .brn{flex:none;font:12px ${MONO};color:#0969DA;background:#DDF4FF;border-radius:6px;padding:2px 7px}
.c2-gh .row .tm{margin-left:auto;display:grid;text-align:right;gap:2px;white-space:nowrap}
.c2-gh .hd{display:flex;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid #EAEEF2;font:13px ${SANS};min-width:0}
.c2-gh .hd b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .hd .du{margin-left:auto;color:#57606A;white-space:nowrap}
.c2-gh .ann{margin:8px 12px 0;padding:8px 10px;border:1px solid #FFCECB;background:#FFEBE9;border-radius:6px;font:12.5px ${MONO};display:grid;gap:3px}
.c2-gh .ann b{font:700 12.5px ${SANS};color:#CF222E}
.c2-gh .ann.nt{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.nt b{color:#9A6700}
.c2-gh .empty{padding:18px 14px;font:13px ${SANS};color:#57606A;background:#F6F8FA;line-height:1.6}
.c2-gh .rb{display:grid;grid-template-columns:130px minmax(0,1fr);gap:0}
.c2-gh .jobs{border-right:1px solid #EAEEF2;padding:8px;display:grid;align-content:start;gap:4px}
.c2-gh .jb{display:flex;gap:6px;align-items:center;font:600 13px ${SANS};padding:5px 6px;border-radius:6px}
.c2-gh .jb.on{background:#F6F8FA}
.c2-gh .jb small{margin-left:auto;font:11px ${SANS};color:#57606A}
.c2-gh .steps{padding:8px 10px;display:grid;gap:2px;background:#0D1117;color:#E6EDF3;min-width:0;align-content:start}
.c2-gh .st{display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:8px;align-items:center;padding:4px 4px;border-radius:6px;font:13px ${MONO}}
.c2-gh .st small{color:#8B949E;font:12px ${MONO}}
.c2-gh .st.skip .nm,.c2-gh .st.off .nm{color:#8B949E}
.c2-gh .st.hl{background:#30363D}
.c2-gh .st .log{grid-column:2/4;margin:4px 0 6px;padding:8px 10px;background:#161B22;border-radius:6px;font:12px/1.5 ${MONO};white-space:pre-wrap;overflow-wrap:anywhere;color:#C9D1D9}
.c2-gh .log .er{color:#FF7B72}
.c2-gh .log .ok{color:#7EE787}
.c2-gh .log .cm{color:#8B949E}
.c2-gh .log .wn{color:#E3B341}
.c2-gh .log .cmd{color:#79C0FF;font-weight:700}
.c1-small .c2-gh .steps{font-size:12px}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: main'dagi yashil run (cicd1-done, run 18)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', "Lenta qo'lda", 'GitHub Actions', "To'rt tuzoq", 'Mashina farqi va AI', 'CD va sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1, 2, 3] }, { hl: [4, 5] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>{t("Dars oxirida — OrderBotNest main'ida har push'da shu run", "В конце урока — в main OrderBotNest при каждом push такой run")}</div><RunView k="18" only={/^Run /} /></>}
  </div>} />;
}

// ============================================================
//  2 · CI/CD nima qiladi: «menda ishlaydi» → «toza mashinada ishlaydi» (umumiy tushuncha — F-1104 foydalanuvchi talabi)
// ============================================================
const S2 = mkS(2, [{ v: 'now' }, { v: 'ci' }, { v: 'cicd' }, { v: 'today' }]);
// F-1109-06: gapli kartalar o'rniga push → CI → CD → server oqimi; boshidan ko'rinadi, gapirilayotgan qism yonadi, xulosada hammasi to'liq
const lit2 = (beat, at) => (beat >= at ? '' : ' dim');
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ beat }) => <div className="z">
    <div className="z-card">
      <p className="z-h">{t("git push dan serverga — CI va CD", "От git push до сервера — CI и CD")}</p>
      <div className="z-flow">
        <div className={'z-st' + lit2(beat, 1)}><b>git push</b><span className="z-mut">{t("siz", "вы")}</span></div>
        <div className={'z-ar' + lit2(beat, 1)}>→</div>
        <div className={'z-st blue' + lit2(beat, 1) + (beat === 1 ? ' hl' : '')} style={{ flex: '4.2 1 0' }}>
          <b>{t("CI · GitHub'dagi toza mashina", "CI · чистая машина на GitHub")}</b>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><span className="z-tag g">npm ci 0</span><span className="z-tag g">tsc 0</span><span className="z-tag g">test 0</span><span className="z-tag g">build 0</span></div>
          <span className="z-mut">{t("hammaga bir xil javob: yashil yoki qizil", "для всех один ответ: зелёный или красный")}</span>
        </div>
        <div className={'z-ar' + lit2(beat, 2)}>→</div>
        <div className={'z-st ac' + lit2(beat, 2) + (beat === 2 ? ' hl' : '')} style={{ flex: '2.6 1 0' }}><b>{t("CD · yukni chiqarish", "CD · выпуск груза")}</b><span className="zm">node dist/main</span><span className="z-tag r">{t("DATABASE_URL topilmadi", "DATABASE_URL не найден")}</span></div>
        <div className={'z-ar' + lit2(beat, 3)}>→</div>
        <div className={'z-st off' + lit2(beat, 3)} style={{ flex: '1.6 1 0' }}><b>server</b><span className="z-mut">{t("Secrets · keyingi dars", "Secrets · следующий урок")}</span></div>
      </div>
      <div className={'z-band' + lit2(beat, 3)} style={{ gridTemplateColumns: '1fr 4.2fr 2.6fr 1.6fr' }}><div></div><div style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{t("bugun — to'liq", "сегодня — полностью")}</div><div style={{ background: '#FFEDD5', color: '#C2410C' }}>{t("bugun — chegaragacha", "сегодня — до границы")}</div><div style={{ background: '#F3F4F6', color: '#6B7280' }}>{t("keyingi dars", "следующий урок")}</div></div>
    </div>
    <div className="z-two">
      <div className={'z-card' + (beat === 0 ? ' hl' : '')}>
        <p className="z-h">{t("Hozir — «menda ishlaydi»", "Сейчас — «у меня работает»")}</p>
        <div className="z-flow">
          <div className="z-st ok"><b>{t("siz", "вы")}</b><span className="zm">npm test</span><span className="z-tag g">{t("yashil", "зелёный")}</span></div>
          <div className="z-ar">→</div>
          <div className="z-st bad"><b>{t("hamkor", "коллега")}</b><span className="zm">npm test</span><span className="z-tag r">{t("qizil", "красный")}</span></div>
        </div>
        <span className="z-mut">{t("kod bir xil, mashina boshqa: node_modules, Node, .env", "код тот же, машина другая: node_modules, Node, .env")}</span>
      </div>
      <div className={'z-card' + lit2(beat, 2)}>
        <p className="z-h">{t("CD — ikki xil", "CD — два вида")}</p>
        <div style={{ display: 'grid', gap: 6, fontSize: 14 }}><div><b>Delivery</b>{t(" — paket tayyor, odam tugmani bosadi", " — пакет готов, человек нажимает кнопку")}</div><div><b>Deployment</b>{t(" — lenta o'zi chiqaradi", " — конвейер выпускает сам")}</div><span className="z-mut">{t("ikkalasi ham CI'dan keyin: qizil yuk chiqmaydi", "оба после CI: красный груз не выходит")}</span></div>
      </div>
    </div>
  </div>} />;
}

// ============================================================
//  3 · Lenta: to'rt qadam, chiqish kodi, qizilda to'xtaydi
// ============================================================
const CODES3 = [['0', T.green, 'yashil — buyruq tugadi, xato yo\'q', 'npm ci · tsc · npm test · npm run build (01)'], ['1', T.accent, 'qizil — Jest: test yiqildi', 'npm test → FAIL … [chiqish kodi: 1] (02)'], ['2', T.accent, 'qizil — tsc: tur xatosi', 'npx tsc --noEmit → error TS2322 (06)'], ['127', T.accent, 'qizil — buyruq topilmadi', 'sh: 1: jest: not found (04)']];
const S3 = mkS(3, [{ v: 'lenta' }, { v: 'lenta', q: true }, { v: 'codes' }, { v: 'stop' }]);
// F-1109-06: lenta jadvali — to'rt vaziyat × to'rt qadam, har katakda haqiqiy chiqish kodi; xulosada jadval qoladi
const ROWS3 = [
  ["hammasi to'g'ri", 'Всё верно', [['0', '5.7 s'], ['0', '2.6 s'], ['0', '2.2 s'], ['0', '3.5 s']], true],
  ['test yiqildi', 'тест упал', [['0'], ['0'], ['1', 'FAIL'], ['-', 'yurmadi', 'не запускался']], false],
  ['tur xatosi', 'ошибка типа', [['0'], ['2', 'TS2322'], ['-', 'yurmaydi', 'не запускается'], ['-', 'yurmaydi', 'не запускается']], false],
  ["npm ci tushib qoldi", 'npm ci пропущен', [['-', "yo'q", 'нет'], ['-', '—', '—'], ['127', 'jest: not found'], ['-', 'yurmaydi', 'не запускается']], false],
];
function Cell3({ c }) {
  if (c[0] === '-') return <td className="sk">{t(c[1], c[2])}</td>;
  return <td className={c[0] === '0' ? 'c0' : 'cx'}>{c[0]}{c[1] && <small>{c[1]}</small>}</td>;
}
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ beat }) => <div className="z c1-l3">
    <div className="z-card">
      <p className="z-h">{t("Lenta — to'rt buyruq, har biri chiqish kodi qaytaradi (lokal yurgizish, toza papka)", "Конвейер — четыре команды, каждая возвращает код выхода (локальный запуск, чистая папка)")}</p>
      <table className="z-tbl">
        <tbody>
          <tr><th className="l">{t("vaziyat", "ситуация")}</th>{LENTA.map(([k, cmd, q]) => <th key={k}>{cmd}<small className={beat >= 1 ? '' : 'dim'} style={{ fontFamily: 'system-ui,sans-serif' }}>{q}</small></th>)}<th>{t("lenta", "конвейер")}</th></tr>
          {ROWS3.map(([uz, ruN, cells, ok], r) => <tr key={r} className={beat >= (r === 0 ? 0 : 2) ? '' : 'dim'}>
            <td className="l">{t(uz, ruN)}</td>{cells.map((c, i) => <Cell3 key={i} c={c} />)}
            <td><span className={'r ' + (ok ? 'g' : 'x')}>{ok ? t('yashil', 'зелёный') : t('qizil', 'красный')}</span></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="z-two">
      <div className={'z-card' + (beat >= 2 ? '' : ' dim')}>
        <p className="z-h">{t("Lenta sonni o'qimaydi — faqat nolmi?", "Конвейер не читает число — только ноль ли?")}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="z-tag g">{t("0 → keyingi qadam", "0 → следующий шаг")}</span><span className="z-tag r">{t("1 · 2 · 127 → to'xtaydi", "1 · 2 · 127 → остановка")}</span></div>
      </div>
      <div className={'z-rule' + (beat >= 3 ? '' : ' dim')} style={{ alignSelf: 'stretch' }}>{t("Test qizil bo'lsa, ", "Если тест красный, ")}<b>{t("build boshlanmaydi", "build не начинается")}</b>{t(" — buzuq kod yig'ilmaydi.", " — сломанный код не собирается.")}</div>
    </div>
  </div>} />;
}

// ============================================================
//  4 · Toza clone: OrderBotNest'ni qo'lda lentadan o'tkazamiz (cicd1v2-out/01, 07)
// ============================================================
const T4A = outRange('01', /^# Toza/, /^tsconfig/);
const T4B = outRange('01', /^\$ npm ci/, /chiqish kodi: 0 · 2\.6/, (l) => !/^npm warn/.test(l));
const T4C = outRange('01', /^\$ npm test/, null, (l) => !/^(Snapshots|Ran all|Time:|> jest|> order-bot|api|config|core|infrastructure|main\.d\.ts|main\.js\.map|tsconfig\.tsbuildinfo)$|^> order-bot/.test(l));
const DUR4 = { ci: '5.7 s', tsc: '2.6 s', test: '2.2 s', build: '3.5 s' };
const S4 = mkS(4, [{ v: 'ls' }, { v: 'ci' }, { v: 'test' }, { v: 'lenta' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'ls' && <Term title={t("VS Code terminali · OrderBotNest (yangi clone, jest2-done)", "терминал VS Code · OrderBotNest (новый clone, jest2-done)")} lines={T4A} />}
    {seg.v === 'ci' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T4B} />}
    {seg.v === 'test' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T4C} />}
    {seg.v === 'lenta' && <div style={{ display: 'grid', gap: 10 }}>
      <Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'ok', build: 'ok' }} dur={DUR4} />
      <div className="mk-rule">{t("To'rt buyruq · jami ", "Четыре команды · всего ")}<b>{t("≈ 15 soniya", "≈ 15 секунд")}</b>{t(" · to'rtala chiqish kodi ", " · все четыре кода выхода ")}<b>0</b>{t(" — lenta yashil. GitHub'dagi mashina har push'da aynan shuni qiladi.", " — конвейер зелёный. Машина на GitHub при каждом push делает ровно это.")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — jest: not found (cicd1v2-out/04, 01)
// ============================================================
function Screen5(p) {
  return MC(p, 5, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Term title={t("VS Code terminali · toza clone, npm ci yurmagan", "терминал VS Code · чистый clone, npm ci не запускался")} lines={out('04')} er />
      <div className="mk-pair"><code>ls</code> → 7 ta: <code>package.json</code> · <code>package-lock.json</code> · <code>src</code> … — <b>{t("node_modules yo'q", "нет node_modules")}</b></div>
    </div>,
    after: <Term title={t("VS Code terminali · npm ci", "терминал VS Code · npm ci")} lines={outRange('01', /^\$ npm ci/, /chiqish kodi: 0 · 5\.7/, (l) => !/^npm warn/.test(l))} />,
  });
}

// ============================================================
//  6 · Test qizil — zanjir shu yerda to'xtaydi (order.service.ts 36 · cicd1v2-out/02)
// ============================================================
const EDIT36 = { 36: '        if (p.stock <= c.qty) {' };
const T6A = outRange('02', /^\$ npm ci/, /^tsc ✓/);
const T6B = outPick('02', (l) => /^\$|✓|^FAIL|●|Kolonka|36 \||> 37|^Tests:|chiqish kodi/.test(l));
const S6 = mkS(6, [{ v: 'code' }, { v: 'chain' }, { v: 'run' }, { v: 'lenta' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="ORDER_36" files={FILES()} active={F.ord} ids={{ 36: 'x' }} edit={EDIT36} focus={['x']} />}
    {seg.v === 'chain' && <><CodePanel file={t("order.service.ts · buzilgan", "order.service.ts · сломан")} lines={kod('ORDER_36', { 36: 'x' }, 35, 38, EDIT36)} focus={['x']} /><Term lines={T6A} /></>}
    {seg.v === 'run' && <Term title={t("VS Code terminali · npm ci && npx tsc --noEmit && npm test && npm run build", "терминал VS Code · npm ci && npx tsc --noEmit && npm test && npm run build")} lines={T6B} er />}
    {seg.v === 'lenta' && <div style={{ display: 'grid', gap: 10 }}>
      <Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'bad', build: 'skip' }} hl={['test']} />
      <div className="mk-rule"><code>&amp;&amp;</code>{t(" zanjiri birinchi qizilda uziladi — GitHub lentasi ham: yurmagan qadamni ", " цепочка рвётся на первом красном — конвейер GitHub тоже: незапущенный шаг он показывает как ")}<b>skipped</b>{t(" deb ko'rsatadi. Tiklash: ", " . Восстановление: ")}<code>git checkout -- src/api/order/order.service.ts</code></div>
    </div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — lentani qo'lda yurgizish
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []], {
  code: [{ step: 2, file: F.ord, lines: kod('ORDER_36', { 36: 'x' }, 33, 40, EDIT36), copy: false }],
});
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} code={P7.code} tree={FILES()} />; }

// ============================================================
//  8 · ci.yml: uch qism — on, runs-on, steps (cicd1-done, 15 satr)
// ============================================================
const IDS8 = { ...rngIds(1, 2, 'a'), ...rngIds(3, 5, 'b'), ...rngIds(6, 11, 'c'), ...rngIds(12, 15, 'd') };
const MAP8 = [['- run: npm ci', "1-qadam · paketlar o'rnatildimi?"], ['- run: npx tsc --noEmit', "2-qadam · turlar to'g'rimi?"], ['- run: npm test', '3-qadam · testlar yashilmi?'], ['- run: npm run build', "4-qadam · dist yig'ildimi?"]];
const S8 = mkS(8, [{ f: ['a'] }, { f: ['b'] }, { f: ['c'] }, { f: ['d'], map: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {!seg.map && <Ide files={compact(FILES(F.ci), F.ci)} active={F.ci} fresh={F.ci}><CodePanel file="ci.yml" lines={kod('CI_DONE', IDS8)} focus={seg.f} /></Ide>}
    {seg.map && <div className="pg-two">
      <CodePanel file="ci.yml · 12–15" lines={kod('CI_DONE', IDS8, 12, 15)} focus={seg.f} />
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("run: satrlari ↔ 4-ekrandagi to'rt buyruq", "строки run: ↔ четыре команды с экрана 4")}</div>
        {MAP8.map(([a, b], i) => <div key={a} className="c1-code" style={{ marginBottom: 6, animation: `mk-up .35s ${i * 0.08}s ease both` }}><span className="n" style={{ color: T.accent, fontSize: 18 }}>{i + 1}</span><span className="t"><code>{a}</code><br />{b}</span></div>)}
      </div>
    </div>}
  </>} />;
}

// ============================================================
//  9 · Push → Actions: yashil run, qadamlar va vaqt (run 10 — haqiqiy)
// ============================================================
const PUSH9 = jt('$ git add .github\n$ git commit -m "ci: lenta"\n$ git push');
const L9 = runLog('10', 'Run npm test', (l) => /^\$|^PASS|^Tests:|^Test Suites/.test(l));
const D10 = Object.fromEntries(visibleSteps('10').map((s) => [s[0], s[2]]));
const DUR9 = { ci: D10['Run npm ci'], tsc: D10['Run npx tsc --noEmit'], test: D10['Run npm test'], build: D10['Run npm run build'] };
const S9 = mkS(9, [{ v: 'push' }, { v: 'run', hl: ['Run actions/checkout@v4', 'Run actions/setup-node@v4', 'Run npm ci', 'Run npx tsc --noEmit', 'Run npm test', 'Run npm run build'] }, { v: 'log' }, { v: 'sum' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'push' && <div style={{ display: 'grid', gap: 10 }}><Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={PUSH9} /><RunRows keys={['10']} hl={['10']} /></div>}
    {seg.v === 'run' && <RunView k="10" hlStep={seg.hl} />}
    {seg.v === 'log' && <RunView k="10" open="Run npm test" lines={L9} hlStep="Run npm test" />}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}><Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'ok', build: 'ok' }} dur={DUR9} /><div className="mk-rule">{t("push → toza mashina → ", "push → чистая машина → ")}<code>checkout</code> → <code>setup-node</code>{t(" → sizning to'rt buyrug'ingiz → ", " → ваши четыре команды → ")}<b>{t("yashil", "зелёный")}</b>{t(". Run jami ", ". Всего run ")}{KOD.RUNS['10'].dur}{t(" (GitHub'dagi haqiqiy run #", " (настоящий run на GitHub #")}{KOD.RUNS['10'].n}).</div></div>}
  </>} />;
}

// ============================================================
//  10 · Buzamiz: test qizil — lentada qaysi qadam, qaysi yurmadi (run 11 — haqiqiy)
// ============================================================
const PUSH10 = jt('$ git commit -am "sinov: chegara buzildi (< → <=)"\n$ git push');
const L10 = runLog('11', 'Run npm test', (l) => /^\$|^FAIL|●|Kolonka|> 37|^Tests:|##\[error\]/.test(l));
const CAUSE10 = ["npm test chiqish kodi 1 berdi (chegara testi qizil)", "Lenta shu qadamda to'xtadi — npm run build «skipped»", "Buzuq kod yig'ilmadi, hech qayerga chiqmadi", 'Satrni tiklab push qilsangiz — run yana yashil'];
const S10 = mkS(10, [{ v: 'push' }, { v: 'steps', hl: ['Run npm test', 'Run npm run build'] }, { v: 'log' }, { v: 'cause' }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'push' && <div style={{ display: 'grid', gap: 10 }}><CodePanel file={t("order.service.ts · buzilgan", "order.service.ts · сломан")} lines={kod('ORDER_36', { 36: 'x' }, 35, 38, EDIT36)} focus={['x']} /><Term lines={PUSH10} /><RunRows keys={['10', '11']} hl={['11']} /></div>}
    {seg.v === 'steps' && <RunView k="11" hlStep={seg.hl} />}
    {seg.v === 'log' && <RunView k="11" open="Run npm test" lines={L10} hlStep="Run npm test" ann={null} />}
    {seg.v === 'cause' && <div style={{ display: 'grid', gap: 10 }}><Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'bad', build: 'skip' }} hl={['test']} /><Cause items={CAUSE10} on={4} bad={1} /></div>}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — qizil qadamdan keyin (cicd1v2-out/06 · run 15)
// ============================================================
const T11 = outRange('06', /^\$ npx tsc/, /chiqish kodi: 2/, (l) => /^\$|error TS|chiqish kodi/.test(l));
function Screen11(p) {
  return MC(p, 11, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="ci.yml · 12–15" lines={kod('CI_DONE', { 13: 't' }, 12, 15)} focus={['t']} />
      <Term title={t("VS Code terminali · npx tsc --noEmit", "терминал VS Code · npx tsc --noEmit")} lines={T11} er />
    </div>,
    after: <RunView k="15" only={/^Run np/} ann={null} hlStep={['Run npx tsc --noEmit', 'Run npm test', 'Run npm run build']} />,
  });
}

// ============================================================
//  12 · Amaliyot 2 — ci.yml o'z reposingizda, yashil run
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: F.ci, lines: kod('CI_DONE') }, { step: 2, file: F.ord, lines: kod('ORDER_36', { 36: 'x' }, 33, 40, EDIT36), copy: false }],
});
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} code={P12.code} tree={FILES(F.ci)} />; }

// ============================================================
//  13 · Checkout yo'q — mashinada repo yo'q (2-checkout-yoq.yml · run 12 — haqiqiy)
// ============================================================
const YML13 = kod('CI_DONE', { 7: 'x' }, 1, 15, { 7: false });
const L13 = runLog('12', 'Run npm ci', (l) => /^\$|EUSAGE|can only install|npm-shrinkwrap|later to generate/.test(l));
const MACH13 = {
  l: { h: 'Sizning mashinangiz', st: 'ok', rows: [['papka', "OrderBotNest/ — to'la"], ['package-lock.json', 'bor'], ['npm ci', '✓']] },
  r: { h: "Runner · checkout yo'q", st: 'bad', rows: [['papka', '/home/runner/work/OrderBotNest/OrderBotNest — bo\'sh'], ['package-lock.json', "yo'q"], ['npm ci', '✗ «can only install with an existing package-lock.json»']], note: "Kodni mashinaga actions/checkout olib keladi. U yo'q — papka bo'sh, xabar esa «lock yarating» deydi." },
};
const S13 = mkS(13, [{ v: 'yml' }, { v: 'run' }, { v: 'mach' }, { v: 'sum' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'yml' && <Ide files={compact(FILES(F.ci), F.ci)} active={F.ci}><CodePanel file={t("ci.yml · checkout satri olib tashlandi", "ci.yml · строка checkout убрана")} lines={YML13} focus={['x']} /></Ide>}
    {seg.v === 'run' && <RunView k="12" open="Run npm ci" lines={L13} hlStep="Run npm ci" />}
    {seg.v === 'mach' && <Machines left={MACH13.l} right={MACH13.r} hl="r" />}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}>
      <CodePanel file="ci.yml · 6–8" lines={kod('CI_DONE', { 7: 'c' }, 6, 8)} focus={['c']} />
      <div className="n2-warn">{t("Har workflow'da ", "В каждом workflow ")}<b>{t("birinchi qadam — ", "первый шаг — ")}<code>actions/checkout</code></b>{t(". Logda «lock yo'q» yoki «package.json yo'q» ko'rsangiz — repongizni emas, ", ". Если в логе видите «нет lock» или «нет package.json» — ищите не в репозитории, а эту строку в ")}<code>ci.yml</code>{t("dagi shu satrni qidiring.", ".")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  14 · npm ci va lock: «in sync» xatosi (package.json · cicd1v2-out/03c · run 13 — haqiqiy)
// ============================================================
const PK_N = KOD.PKG_TELEGRAF.lines.find((l) => l.t.includes('"telegraf"')).n;
const EDIT_PKG = { [PK_N]: '    "telegraf": "4.16.0",' };
const T14 = outPick('03c', (l) => /^\$|EUSAGE|Invalid:|chiqish kodi/.test(l)); // uzun «in sync» satri — RunView logida (o'raladi)
const L14 = runLog('13', 'Run npm ci', (l) => /^\$|EUSAGE|in sync|Invalid:/.test(l));
const CAUSE14 = ['package.json: telegraf 4.16.0 (qo\'lda), package-lock.json: 4.16.3 (eski)', "npm ci lock fayldan AYNAN o'rnatadi — bir baytini ham o'zgartirmaydi", "Mos kelmasa — taxmin qilmaydi, qizil beradi: «in sync» emas", "Lokalda npm install → lock yangilanadi → lock ham commit'ga"];
// F-1109-06: sabab va xulosa — gapli kartalar o'rniga ikki yo'l oqimi (biz qilgan · to'g'ri), haqiqiy EUSAGE xabari bilan (cicd1v2-out/03c)
function Flow14({ two }) {
  return <div className="z">
    <div className={'z-card' + (two ? '' : ' hl')}>
      <p className="z-h">{t("Biz qildik — package.json qo'lda, npm install yo'q", "Мы сделали — package.json вручную, без npm install")}</p>
      <div className="z-flow">
        <div className="z-st ac"><b>package.json</b><span className="zm">"telegraf": "4.16.0"</span><span className="z-mut">{t("qo'lda o'zgardi", "изменён вручную")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st off"><b>npm install</b><span className="z-mut">{t("yurgizilmadi", "не запускали")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ac"><b>package-lock.json</b><span className="zm">telegraf@4.16.3</span><span className="z-mut">{t("eskicha qoldi", "остался старым")}</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>npm ci</b><span className="z-tag r">{t("chiqish kodi 1", "код выхода 1")}</span><span className="z-mut">{t("lokalda ham, lentada ham (run 13)", "и локально, и в конвейере (run 13)")}</span></div>
      </div>
      <div className="z-term"><span className="r">npm error code EUSAGE</span>{'\n'}npm error `npm ci` can only install packages when your package.json and package-lock.json … are <span className="hl">in sync</span>.{'\n'}<span className="r">npm error Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0</span></div>
    </div>
    <div className={'z-card' + (two ? ' hl' : ' dim')}>
      <p className="z-h">{t("To'g'ri yo'l — versiya o'zgarsa", "Правильный путь — если версия меняется")}</p>
      <div className="z-flow">
        <div className="z-st"><b>package.json</b><span className="z-mut">{t("versiya o'zgardi", "версия изменилась")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>npm install</b><span className="z-mut">{t("lokalda", "локально")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>package-lock.json</b><span className="z-mut">{t("yangilandi", "обновлён")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>commit</b><span className="z-mut">{t("ikkala fayl", "оба файла")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>npm ci</b><span className="z-tag g">{t("lentada 0", "в конвейере 0")}</span></div>
      </div>
      <span className="z-mut">{t("npm ci lock fayldan aynan o'rnatadi; mos kelmasa — taxmin qilmaydi, to'xtaydi.", "npm ci ставит строго по lock-файлу; если не совпадает — не угадывает, останавливается.")}</span>
    </div>
  </div>;
}
const S14 = mkS(14, [{ v: 'code' }, { v: 'run' }, { v: 'cause' }, { v: 'two' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    {seg.v === 'code' && <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="package.json" lines={kod('PKG_TELEGRAF', { [PK_N]: 'x' }, null, null, EDIT_PKG)} focus={['x']} />
      <CodePanel file="package-lock.json" lines={kod('LOCK_TELEGRAF', { [KOD.LOCK_TELEGRAF.lines[1].n]: 'l' })} focus={['l']} />
    </div>}
    {seg.v === 'run' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><Term title={t("VS Code terminali · npm ci (lokalda ham)", "терминал VS Code · npm ci (и локально)")} lines={T14} er /><RunView k="13" open="Run npm ci" lines={L14} hlStep="Run npm ci" ann={null} only={/^Run np/} /></div>}
    {(seg.v === 'cause' || seg.v === 'two') && <Flow14 two={seg.v === 'two'} />}
  </>} />;
}

// ============================================================
//  15 · tsc qadami: test yashil, lenta yolg'on yashil (user.service.ts 16 · cicd1v2-out/06 · run 14, 15 — haqiqiy)
// ============================================================
const U16 = KOD.USER_20.lines.find((l) => l.n === 16).t;
const EDIT16 = { 16: U16.replace('String(from.id)', 'from.id') };
const T15 = outRange('06', /^\$ npx tsc/, null, (l) => /^\$|error TS|^Tests:|chiqish kodi/.test(l));
const S15 = mkS(15, [{ v: 'code' }, { v: 'r14' }, { v: 'both' }, { v: 'sum' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'code' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("user.service.ts · buzilgan", "user.service.ts · сломан")} lines={kod('USER_20', { 16: 'x' }, 15, 22, EDIT16)} focus={['x']} /><Term title={t("VS Code terminali · npx tsc --noEmit · npm test", "терминал VS Code · npx tsc --noEmit · npm test")} lines={T15} er /></div>}
    {seg.v === 'r14' && <RunView k="14" note={[t("Yolg'on yashil", "Ложный зелёный"), t("ci.yml'da tsc qadami yo'q — tur xatosi hech kim so'ramagani uchun tekshirilmadi; nest build bu kodni yig'a olmaydi", "в ci.yml нет шага tsc — ошибку типа не проверили, потому что никто не спросил; nest build этот код не соберёт")]} />}
    {seg.v === 'both' && <div className="pg-two c1-small"><RunView k="14" /><RunView k="15" hlStep="Run npx tsc --noEmit" /></div>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}>
      <CodePanel file="ci.yml · 12–15" lines={kod('CI_DONE', { 13: 't' }, 12, 15)} focus={['t']} />
      <div className="n2-warn">{t("Lenta ", "Конвейер ")}<b>{t("faqat so'ralgan narsani", "только то, о чём спросили,")}</b>{t(" tekshiradi. Testlar yashil bo'lsa ham, turlar noto'g'ri bo'lishi mumkin. ", " проверяет. Даже если тесты зелёные, типы могут быть неверными. ")}{t(<><code>npx tsc --noEmit</code> — <code>npm ci</code>dan keyin, <code>npm test</code>dan oldin: 3 soniya, build'gacha bormay to'xtatadi.</>, <><code>npx tsc --noEmit</code> — после <code>npm ci</code>, до <code>npm test</code>: 3 секунды, останавливает, не доходя до build.</>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — LineCheck: YAML surilish (4-surilish-xato.yml 8-satr → indeks 7; run 17 · 08 tahlilchi)
// ============================================================
const Y4 = KOD.YML_4_SURILISH_XATO.lines;
const LC16 = Y4.map((l) => ({ h: yamlLine(l.t), n: l.n }));
const LC16_FIXED = Y4.flatMap((l) => l.n >= 8 ? [{ h: yamlLine(l.t), n: l.n, gone: true }, { h: yamlLine(l.t.slice(2)), n: l.n, neu: true }] : [{ h: yamlLine(l.t), n: l.n }]);
const T16X = [...outRange('08', /^--- 3-runs-on-yoq/, /Required property/, (l) => /^---|XATO/.test(l)), ...jt('X This run likely failed because of a workflow file issue.')];
function Screen16(p) {
  const m = MDT[16];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="ci.yml" lines={LC16} target={7}
    tree={{ root: MKCFG.root, files: compact(FILES(F.ci), F.ci), active: F.ci }}
    fixed={LC16_FIXED} fixedExtra={[{ file: t("ci.yml · runs-on yo'q — rasmiy tahlilchi (08) va GitHub (run 16)", "ci.yml · нет runs-on — официальный анализатор (08) и GitHub (run 16)"), lines: T16X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  17 · Lokalda yashil, lentada qizil: Node versiyasi (run 10a · cicd1v2-out/03d, 00 · run 10)
// ============================================================
const L17 = runLog('10a', 'Run npm ci', (l) => /^\$|EUSAGE|in sync|Missing:/.test(l));
const T17 = outPick('03d', (l) => /^\$ (node|npx)|^v24|^11\.|^10\.|Missing:|chiqish kodi: 1/.test(l));
const MACH17 = {
  l: { h: 'Sizning mashinangiz', st: 'ok', rows: [['node --version', 'v24.18.0'], ['npm --version', '11.16.0'], ['npm ci', '✓ (4-ekran)']] },
  r: { h: 'Runner · node-version: 22', st: 'bad', rows: [['Node', '22.23.4 (Found in cache)'], ['npm', '10.9.9'], ['npm ci', '✗ Missing: webpack@5.112.2 from lock file']], note: "npm 10 lock fayldagi bitta yozuvni (peer paket) boshqacha o'qiydi va «yo'q» deb hisoblaydi." },
};
const FIX17 = KOD.CI_DONE.lines.filter((l) => l.n >= 8 && l.n <= 11).flatMap((l) => l.n === 10 ? [{ h: yamlLine('          node-version: 22'), n: 10, gone: true }, { h: yamlLine(l.t), n: 10, neu: true, id: 'v' }] : [{ h: yamlLine(l.t), n: l.n }]);
const S17 = mkS(17, [{ v: 'run' }, { v: 'mach' }, { v: 'local' }, { v: 'fix' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {seg.v === 'run' && <RunView k="10a" open="Run npm ci" lines={L17} hlStep="Run npm ci" ann={null} note={[t('Birinchi run — 04.11 17:40', "Первый run — 04.11 17:40"), t("o'sha ci.yml, faqat node-version: 22 — lokalda yashil, lentada qizil", "тот же ci.yml, только node-version: 22 — локально зелёный, в конвейере красный")]} />}
    {seg.v === 'mach' && <Machines left={MACH17.l} right={MACH17.r} hl="r" />}
    {seg.v === 'local' && <Term title={t("VS Code terminali · OrderBotNest · npm 10 bilan", "терминал VS Code · OrderBotNest · с npm 10")} lines={T17} er />}
    {seg.v === 'fix' && <div style={{ display: 'grid', gap: 10 }} className="c1-small"><CodePanel file="ci.yml · 8–11" lines={FIX17} focus={['v']} /><RunView k="10" hlStep="Run npm ci" /></div>}
  </>} />;
}

// ============================================================
//  18 · AI workflow yozdi — ikki to'plam (cicd1v2-ai: ai1 test.yml 22 satr · ai2 ci.yml 26 satr)
// ============================================================
const NV = (k) => KOD[k].lines.find((l) => /node-version/.test(l.t)).n;
const S18 = mkS(18, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'yml' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · lentani siz yozdingiz", "Этапы 1–4 · конвейер писали вы")}</h4><p>{t("ci.yml · push · yashil / qizil run · to'rt tuzoq", "ci.yml · push · зелёный / красный run · четыре ловушки")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("Bitta oddiy prompt → ikki workflow → haqiqiy lentada sinov", "Один простой промпт → два workflow → проверка в настоящем конвейере")}</p></div>
    </div>}
    {seg.v === 'prompt' && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: checkout, versiya, tsc, build yo'q", "без подсказок: checkout, версии, tsc, build нет")} />}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<><code>.github/workflows/test.yml</code>{t(" — 22 satr: checkout@v4 → setup-node@v4 (", " — 22 строки: checkout@v4 → setup-node@v4 (")}<b>node-version: 22</b>, cache npm) → <code>npm ci</code> → <code>npm test</code>{t(". Har qadamga o'zbekcha nom. YAML ✓.", ". У каждого шага узбекское имя. YAML ✓.")}</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<><code>.github/workflows/ci.yml</code>{t(" — 26 satr: xuddi shu qadamlar + ", " — 26 строк: те же шаги + ")}<code>permissions: contents: read</code>{t(", job nomi «Jest testlar». ", ", имя job «Jest testlar». ")}<b>node-version: 22</b>. YAML ✓.</>} />
    </div>}
    {seg.v === 'yml' && <div style={{ display: 'grid', gap: 8 }}>
      <div className="pg-two"><Yml k="YML_AI1" title="test.yml · 1-AI" from={NV('YML_AI1') - 3} to={NV('YML_AI1') + 1} ids={{ [NV('YML_AI1')]: 'n' }} focus={['n']} /><Yml k="YML_AI2" title="ci.yml · 2-AI" from={NV('YML_AI2') - 3} to={NV('YML_AI2') + 1} ids={{ [NV('YML_AI2')]: 'n' }} focus={['n']} /></div>
      <div className="n2-warn">{t("Ikkalasida ham: ", "В обоих: ")}<b>node-version: 22</b>{t(" (mashinangizni so'ramadi) · ", " (вашу машину не спросил) · ")}<b>{t("tsc yo'q", "нет tsc")}</b> · <b>{t("build yo'q", "нет build")}</b>{t(" — prompt «testlar yursin» dedi, AI aynan shuni qildi.", " — промпт сказал «пусть тесты идут», AI ровно это и сделал.")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  19 · AI workflow'lari lentada: qizil → versiya → yashil, lekin… (run 19, 20, 21 — haqiqiy)
// ============================================================
const L19 = runLog('19', "Kutubxonalarni o'rnatish", (l) => /^\$|Missing:/.test(l));
const L20 = runLog('20', "Bog'liqliklarni o'rnatish", (l) => /^\$|Missing:/.test(l));
const L21 = runLog('21', 'Testlar', (l) => /^\$|^PASS|^Tests:/.test(l));
const FIX19 = KOD.YML_AI1.lines.filter((l) => l.n >= NV('YML_AI1') - 2 && l.n <= NV('YML_AI1') + 1).flatMap((l) => l.n === NV('YML_AI1') ? [{ h: yamlLine(l.t), n: l.n, gone: true }, { h: yamlLine(l.t.replace('22', '24')), n: l.n, neu: true, id: 'v' }] : [{ h: yamlLine(l.t), n: l.n }]);
const FOUR19 = ['checkout bormi?', 'node-version — mening `node --version` raqamimmi?', 'npm ci mi (install emas)?', 'tsc va build qadamlari bormi?'];
const S19 = mkS(19, [{ v: 'red' }, { v: 'green' }, { v: 'tsc' }, { v: 'four' }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    {seg.v === 'red' && <div className="pg-two c1-small"><RunView k="19" open="Kutubxonalarni o'rnatish" lines={L19} ann={null} /><RunView k="20" open="Bog'liqliklarni o'rnatish" lines={L20} ann={null} /></div>}
    {seg.v === 'green' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><CodePanel file={t("test.yml · 1-AI, bitta raqam", "test.yml · 1-й AI, одно число")} lines={FIX19} focus={['v']} /><RunView k="21" open="Testlar" lines={L21} hlStep={["Node.js 22 o'rnatish", 'Testlar']} /></div>}
    {seg.v === 'tsc' && <div className="pg-two c1-small"><RunView k="14" note={[t("Yolg'on yashil (15-ekran)", "Ложный зелёный (экран 15)"), t("tsc qadami yo'q — tur xatosi o'tdi", "нет шага tsc — ошибка типа прошла")]} /><Card c={T.accent} h={t("AI workflow'i bilan ham shunday", "с workflow от AI так же")}><p>{t("Bu faylda ", "В этом файле ")}<b>{t("tsc yo'q", "нет tsc")}</b>{t(": 15-ekrandagi tur xatosini push qilsangiz — run ", ": если запушить ошибку типа с 15-го экрана — run ")}<b>{t("yashil", "зелёный")}</b>{t(" qoladi.", " останется.")}</p><p><b>{t("build yo'q", "нет build")}</b>{t(": yig'ilmaydigan kod yashil o'tadi.", ": несобираемый код проходит зелёным.")}</p><p style={{ marginTop: 6, color: T.ink3 }}>{t("Prompt «testlar yursin» dedi — AI faqat shuni qildi.", "Промпт сказал «пусть запускаются тесты» — AI сделал только это.")}</p></Card></div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI workflow'ini qabul qilish — to'rt savol", "Приём workflow от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR19.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span dangerouslySetInnerHTML={html(x.replace(/`([^`]+)`/g, '<code>$1</code>'))} /></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  20 · Tekshiruv 4 — AI workflow'ni qabul qilish (5-npm-install.yml · run 21, 14, 10a)
// ============================================================
const NODE20 = jt('$ node --version\n' + KOD.VERSIONS.local.split('\n')[0]);
function Screen20(p) {
  return MC(p, 20, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Yml k="YML_5_NPM_INSTALL" title={t("ci.yml · AI yozgan (namuna)", "ci.yml · написал AI (образец)")} from={7} ids={{ [NV('YML_5_NPM_INSTALL')]: 'n', 10: 'i' }} focus={['n', 'i']} />
      <Term title={t("VS Code terminali · sizning mashinangiz", "терминал VS Code · ваша машина")} lines={NODE20} />
    </div>,
    after: <div className="c1-small"><RunView k="21" only={/olish|rnatish|Testlar/} note={[t('node-version: 24 bilan — yashil', "с node-version: 24 — зелёный"), t("lekin tsc va build yo'q: tur xatosi yashil o'tadi (run 14)", "но нет tsc и build: ошибка типа проходит зелёной (run 14)")]} /></div>,
  });
}

// ============================================================
//  21 · Amaliyot 3 — AI workflow, to'rt tekshiruv, buzib ko'rish (prompt — MD 21-ekrandan aynan)
// ============================================================
const PROMPT21 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P21 = mkPractice(21, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: 'prompt.txt', lines: PROMPT21 }, { step: 1, file: F.ci, lines: kod('CI_DONE'), copy: false }, { step: 3, file: F.usr, lines: kod('USER_20', { 16: 'x' }, 15, 22, EDIT16), copy: false }],
});
function ScreenP21(p) { return <Practice p={p} S={P21.S} steps={P21.steps} trouble={P21.trouble} proof={P21.proof} code={P21.code} tree={['prompt.txt', F.ci, F.usr]} />; }

// ============================================================
//  22 · CD: Delivery, Deployment va .env chegarasi (cicd1v2-out/05)
// ============================================================
const T22 = outPick('05', (l) => /^\$|^> nest|chiqish kodi|^Error: DATABASE_URL|throw new Error/.test(l));
function CdFlow({ hl, today }) {
  const box = (k, c, h, tx) => <div key={k} className={today && k === 'srv' ? 'dim' : ''} style={{ '--c': c, boxShadow: hl === k ? `0 0 0 4px color-mix(in srgb, ${c} 18%, transparent)` : 'none' }}><h4>{h}</h4><p>{tx}</p></div>;
  return <div className="c1-cd">
    {box('ci', C1.ci, 'CI ✓', t('npm ci · tsc · test · build — yashil', "npm ci · tsc · test · build — зелёный"))}
    {box('pkg', T.green, t('Paket tayyor', "Пакет готов"), t('dist/ — lekin .env yo\'q, baza yo\'q', "dist/ — но нет .env и базы"))}
    {box('cd', C1.cd, 'CD', t('Delivery — odam «chiqar» tugmasini bosadi · Deployment — lenta o\'zi', "Delivery — человек нажимает «выпустить» · Deployment — конвейер сам"))}
    {box('srv', C1.cd, 'Server', t('bot yuradigan joy: DATABASE_URL, BOT_TOKEN — Secrets', "где работает бот: DATABASE_URL, BOT_TOKEN — Secrets"))}
  </div>;
}
const S22 = mkS(22, [{ v: 'term' }, { v: 'cd' }, { v: 'need' }, { v: 'sum' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'term' && <Term title={t("VS Code terminali · toza clone, .env yo'q", "терминал VS Code · чистый clone, нет .env")} lines={T22} er />}
    {seg.v === 'cd' && <CdFlow hl="cd" />}
    {seg.v === 'need' && <div className="pg-three">
      <Card c={C1.cd} h={t("Maxfiy qiymatlar", "Секретные значения")}><p><code>DATABASE_URL</code>, <code>BOT_TOKEN</code> — GitHub <b>Secrets</b>{t(": ci.yml nom bilan oladi, qiymatni hech kim ko'rmaydi", ": ci.yml берёт по имени, значение никто не видит")}</p></Card>
      <Card c={C1.cd} h="Server"><p>{t("Bot qayerda yuradi — alohida mashina yoki xizmat", "Где работает бот — отдельная машина или сервис")}</p></Card>
      <Card c={C1.cd} h={t("Chiqarish buyrug'i", "Команда выпуска")}><p>{t("Paketni serverga yetkazib, ishga tushirish — lentaning oxirgi qadami", "Доставить пакет на сервер и запустить — последний шаг конвейера")}</p></Card>
    </div>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}><CdFlow today /><div className="mk-rule">{t("Bugun: ", "Сегодня: ")}<b>{t("CI to'liq", "CI полностью")}</b>{t(" — har push'da to'rt qadam. ", " — при каждом push четыре шага. ")}<b>{t("CD chegarasi", "граница CD")}</b>{t(" aniq: paket bor, maxfiy qiymatlarsiz yurmaydi. Keyingi mentor darsi: run'ni o'qish, secrets, cache.", " ясна: пакет есть, без секретных значений не работает. Следующий урок для менторов: чтение run, secrets, cache.")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfga tayyorgarlik: m4c-01 (CiCdIntroLesson.jsx — SCREEN_META 20; aeroport lentasi, ci.yml builder, amaliyot)
// ============================================================
const DICT23 = [['lenta · chamadon', 'pipeline · kod (commit)'], ["Yig'ish · Skaner · O'rash · Uchirish", 'npm install · npm test · npm run build · deploy (CD)'], ["O'lcham ramkasi", "eslint . — OrderBotNest'da yo'q, o'quvchi reposida bor"], ["start signali · yo'l xaritasi · lenta mashinasi", 'on: push · ci.yml · runner (runs-on: ubuntu-latest)'], ["qizil chiroq — lenta to'xtaydi", "chiqish kodi 0 emas — keyingi qadamlar «skipped»"], ['seyf', 'GitHub Secrets (keyingi dars)']];
const ADD23 = [["actions/checkout satri — o'quvchi ci.yml'ida yo'q (13-ekran): amaliyotda «bitta qator qo'shing»", 'amaliyot, ci.yml'], ["npm ci vs npm install — o'quvchi install yozadi; sinfda sabab bir gapda (14-ekran)", 's13 builder'], ["haqiqiy Actions run'ini bir marta ekranda ko'rsatish: qizil qadam, skipped", 'amaliyot oxiri'], ["«lokalda yashil, lentada qizil» — Node versiyasi (17-ekran)", "o'quvchi shikoyat qilganda"]];
const CARDS23 = [
  ["Actions'da run yo'q", '—', "fayl .github/workflows/ da emas yoki push bormagan"],
  ['npm install / npm test qizil', 'Could not read package.json … ENOENT', "checkout satri yo'q — papka bo'sh"],
  ["Run qizil, job yo'q", 'workflow file issue', "YAML surilish / runs-on yo'q"],
];
const QA23 = [
  ['«Lenta mening kompyuterimda yuradimi?»', "Yo'q — GitHub'dagi toza mashinada; shuning uchun checkout va npm install kerak."],
  ['«Nega npm install yana? Menda bor-ku»', "Toza mashinada node_modules yo'q — har run'da yangidan."],
  ["«Qizil bo'lsa sayt buziladimi?»", "Yo'q — qizil kod chiqmaydi, lenta to'xtaydi; bu himoya."],
  ['«Deploy qayerga?»', 'Bu CD — keyingi darslarda; hozir lenta tekshiradi, chiqarmaydi.'],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'cards' }, { v: 'dict' }, { v: 'add' }, { v: 'err' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4c-01 (20 ekran)", "Ученик · m4c-01 (20 экранов)")} hl><p><b>{t("Aeroport lentasi", "Лента в аэропорту")}</b>{t(" — chamadon (kod) → Yig'ish ", " — чемодан (код) → Сборка ")}<code>npm install</code> → Skaner <code>npm test</code>{t(" → O'lcham ramkasi ", " → Рамка размера ")}<code>eslint .</code>{t(" → O'rash ", " → Упаковка ")}<code>npm run build</code>{t(" → Uchirish (deploy) · ", " → Вылет (deploy) · ")}<code>on: push</code> = start signali · s13: <code>ci.yml</code>{t(" bo'shliqlari · amaliyot: o'z reposiga ", " пропуски · практика: в свой репозиторий ")}<code>ci.yml</code></p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>OrderBotNest · <code>npm ci</code> · <code>tsc</code> · <code>test</code> · <code>build</code>{t(" · haqiqiy run'lar · to'rt tuzoq · Node versiyasi · AI workflow'i", " · настоящие run · четыре ловушки · версия Node · workflow от AI")}</p></Card>
    </div>}
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT23.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'add' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Siz qo'shasiz", "Вы добавляете")}</div><table className="pg-dict"><tbody>{ADD23.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></>}
    {seg.v === 'err' && <><div className="pg-three">{CARDS23.map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${i + 1} · ${h}`}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>
      <div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
  </>} />;
}

// ============================================================
//  24 · O'z-sinov — 8 savol (MD 24, FINAL)
// ============================================================
const FINAL = MDT[24].final;
function Screen24(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: CI nima qiladi, chiqish kodi, lenta qayerda to'xtaydi, to'rt tuzoq, Node versiyasi va AI workflow'i. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
      : sc >= 6
        ? "Natijangiz saqlangan: sakkizdan " + ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz'][sc] + ". Dars o'zlashtirilgan, Davom bosing."
        : "Yaxshi, bir xatoyingizni ko'rib chiqdingiz. Qolgan qizil savollarning ekranlariga ham qayting. Tayyor bo'lgach, Sinovni qayta topshirish tugmasini bosing.";
    return p.review ? [] : [{ id: 'intro', text: voice(text), trigger: 'on_mount' }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [i, setI] = useState(st.i || 0);
  const [res, setRes] = useState(st.res || []);
  const [attempt, setAttempt] = useState(st.attempt || 1);
  const [showResult, setShowResult] = useState(!!st.showResult);
  const q = FINAL[i];
  const picked = res[i] ? res[i].picked : null;
  const score = res.filter((x) => x && x.correct).length;
  const finished = res.filter(Boolean).length === FINAL.length;
  const save = (patch) => p.onAnswer({ type: 'final', i, res, attempt, showResult, score, total: FINAL.length, ...patch });
  const pick = (k) => {
    if (picked !== null) return;
    audio.triggerEvent('option_picked');
    const r = [...res]; r[i] = { picked: k, correct: k === q.c }; setRes(r);
    if (k === q.c) sfx.playCorrect(); else sfx.playWrong();
    const sc = r.filter((x) => x && x.correct).length; save({ res: r, score: sc });
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi lentam qizil desa, qaysi qadamga qarashni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker={t("O'z-sinov", 'Самопроверка')} idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">{t("O'z-sinov · natija", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? t("dars o'zlashtirildi", 'урок усвоен') : t("yana bir ko'rib chiqing", 'посмотрите ещё раз')}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{t(`${f.s}-ekran`, `экран ${f.s}`)}</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>{t('Sinovni qayta topshirish', 'Пройти тест заново')}</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>{t('Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.', 'Если вернётесь к экрану и нажмёте «Далее», попадёте обратно к этому результату.')}</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">{t("O'z-sinov", 'Самопроверка')} · {i + 1} / {FINAL.length} · {t("bitta urinish · to'g'ri:", 'одна попытка · верно:')} {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? t("To'g'ri", 'Верно') : t("Noto'g'ri — to'g'risi yashil", 'Неверно — правильный ответ зелёный')}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? t('Keyingi savol →', 'Следующий вопрос →') : t("Natijani ko'rish →", 'Посмотреть результат →')}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  25 · Yakun (M13, M14, M30) — xulosa 6 band, uyga vazifa 5 qadam, eslatma
// ============================================================
const SUM25 = [
  { k: 'ci', t: "CI — har push'da toza mashinada sizning buyruqlaringiz: «menda ishlaydi» o'rniga hammaga bir xil javob. CD — tekshirilgan yukni chiqarish (Delivery: odam tasdiqlaydi · Deployment: lenta o'zi)", st: ['ci'] },
  { k: 'lenta', t: "Lenta — npm ci → npx tsc --noEmit → npm test → npm run build; har qadam chiqish kodi: 0 — yashil, boshqasi — qizil; birinchi qizildan keyin qolgani «skipped»", st: ['lenta'] },
  { k: 'yml', t: "ci.yml uch qism: on (push, pull_request) · runs-on: ubuntu-latest · steps (uses: actions/checkout@v4, actions/setup-node@v4 + run: buyruqlar). Push → Actions → run → job → qadamlar → log", st: ['yml'] },
  { k: 'tuzoq', t: "To'rt tuzoq: checkout yo'q («lock yo'q» — papka bo'sh) · lock mos emas («in sync» — lentada npm ci, lokalda npm install + lock commit'ga) · tsc qadamisiz yolg'on yashil · YAML surilish / runs-on yo'q (job yo'q)", st: ['tuzoq'] },
  { k: 'node', t: "Lokalda yashil, lentada qizil — avval node-version ↔ node --version: runner'dagi npm lock'ni boshqacha o'qiydi (Missing: webpack… from lock file)", st: ['tuzoq', 'lenta'] },
  { k: 'ai', t: "AI workflow'i — boshlanish nuqtasi: to'rt savol (checkout · versiya meniki · npm ci · tsc va build), keyin push va run. CD chegarasi: node dist/main .env'siz yiqiladi — secrets keyingi darsda", st: ['ai', 'ci'] },
];
const STATIONS25 = [['ci', 'CI / CD', C1.ci], ['lenta', 'Lenta', T.green], ['yml', 'ci.yml · Actions', C1.yml], ['tuzoq', "To'rt tuzoq", T.accent], ['ai', 'AI workflow', C1.ai]];
function SummaryMap25({ hl }) {
  const cur = SUM25.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">{t("Bugungi dars — OrderBotNest'ning testlari har push'da o'zi yuradi", "Сегодняшний урок — тесты OrderBotNest запускаются сами при каждом push")}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 6 }}>
      {STATIONS25.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 13, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK25 = [
  { t: "pull_request — ci.yml: on: [push, pull_request]", c: ['on: [push, pull_request]'] },
  { t: "lint job — jobs.lint: checkout · setup-node · npm ci · npx prettier --check \"src/**/*.ts\" (ikki job: test ✓ · lint ✓)", c: ['npx prettier --check "src/**/*.ts"'] },
  { t: "Badge — README birinchi qatoriga lenta nishoni", c: ['![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)'] },
  { t: "Buzish — src/api/app.controller.ts da satrni bir qatorga yig'ib (formatni buzib) push: lint ✗, test ✓ · keyin prettier --write va push: ikkalasi ✓", c: ['npx prettier --write src/api/app.controller.ts'] },
  { t: "Topshirish — repo linki platformadagi uyga vazifaga", c: ['git add . && git commit -m "ci: lint job va badge"', 'git push mine HEAD:main'] },
];
const CHEATSHEET25 = `# CI/CD — mentor eslatmasi (OrderBotNest, lenta)
## Loyiha
git fetch --tags · git checkout cicd1-start (= jest2-done) → cicd1-done (.github/workflows/ci.yml) · npm test — 25 test, baza va token kerak emas
## CI / CD
CI — har push'da toza mashinada sizning buyruqlaringiz (o'rnatish → turlar → test → build): «menda ishlaydi» o'rniga hammaga bir xil javob · CD — tekshirilgan yukni chiqarish: Delivery (odam tasdiqlaydi) · Deployment (lenta o'zi)
## Lenta — to'rt qadam
npm ci → npx tsc --noEmit → npm test → npm run build · chiqish kodi: 0 yashil, 1 (jest), 2 (tsc), 127 (buyruq yo'q) qizil · birinchi qizildan keyin qolgani «skipped» · lokalda: npm ci && npx tsc --noEmit && npm test && npm run build
## ci.yml (15 satr)
name: CI · on: [push, pull_request] · jobs: test: runs-on: ubuntu-latest · steps: - uses: actions/checkout@v4 · - uses: actions/setup-node@v4 (with: node-version: 24, cache: npm) · - run: npm ci · - run: npx tsc --noEmit · - run: npm test · - run: npm run build
push → Actions → run → job → qadamlar (Set up job, checkout, setup-node, run: …) → log (qadamni bosing)
## To'rt tuzoq
checkout yo'q → npm ci: «can only install with an existing package-lock.json» (papka bo'sh) · package.json qo'lda o'zgargan, lock eski → «in sync» emas (lokalda npm install, lock commit'ga; lentada npm ci) · tsc qadami yo'q → tur xatosi yashil o'tadi (yolg'on yashil) · YAML surilish / runs-on yo'q → run qizil, job yo'q («workflow file issue»)
## Lokalda yashil, lentada qizil
Missing: webpack@5.112.2 from lock file → runner'dagi Node (npm) mashinangizdan boshqa: node-version = node --version raqamingiz (22 → 24 — yashil)
## AI workflow'ini qabul qilish — to'rt savol
checkout bormi · node-version meniki · npm ci (install emas) · tsc va build qadamlari bormi → push → run yashilmi · ikkala AI node-version: 22 yozdi, tsc/build yo'q
## CD chegarasi
node dist/main → DATABASE_URL topilmadi (.env yo'q) · kerak: Secrets (DATABASE_URL, BOT_TOKEN) · server · chiqarish buyrug'i — keyingi darslar
## Sinfga tayyorgarlik (m4c-01, 20 ekran)
aeroport lentasi: Yig'ish = npm install · Skaner = npm test · O'lcham ramkasi = eslint · O'rash = build · Uchirish = deploy · start signali = on: push · yo'l xaritasi = ci.yml · siz qo'shasiz: checkout satri (o'quvchi yml'ida yo'q), npm ci sababi, bitta haqiqiy run
## Xato qiladigan joylar
run yo'q → fayl yo'li / push · Could not read package.json (ENOENT) → checkout yo'q · run qizil, job yo'q → YAML / runs-on · Missing … from lock file → Node versiyasi
## Sizning uyga vazifangiz (40–60 daqiqa)
pull_request · lint job (prettier --check) · README badge · bir marta lint qizil → yashil → repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CI — <b>toza mashinada sizning buyruqlaringiz</b>; CD — tekshirilgan yukni chiqarish", "Birinchi: CI, har push'da toza mashinada sizning buyruqlaringiz yuradi. Menda ishlaydi o'rniga hammaga bir xil javob. CD, tekshirilgan yukni chiqarish: Delivery'da odam tasdiqlaydi, Deployment'da lenta o'zi chiqaradi.", { hl: 'ci' }),
  sg('b2', "Lenta: <b>to'rt qadam, chiqish kodi</b>; birinchi qizildan keyin qolgani «skipped»", "Ikkinchi: lenta to'rt qadam: npm si ay, tsc, test, build. Har biri chiqish kodi qaytaradi: nol yashil, boshqasi qizil. Birinchi qizil qadamda lenta to'xtaydi, qolgani skipped, buzuq kod yig'ilmaydi.", { hl: 'lenta' }),
  sg('b3', "<b>ci.yml</b> uch qism: on · runs-on · steps; push → run → job → qadam → log", "Uchinchi: ci yml uch qism. On, qachon. Runs on, qaysi mashina. Steps, qadamlar: checkout, setup node va sizning run buyruqlaringiz. Push qilasiz, Actions'da run paydo bo'ladi, ichida job, qadamlar va har qadamning logi.", { hl: 'yml' }),
  sg('b4', "<b>To'rt tuzoq</b>: checkout yo'q · lock mos emas · tsc yo'q · YAML xatosi", "To'rtinchi: to'rt tuzoq. Checkout yo'q, papka bo'sh. Package json va lock mos emas, in sync xatosi. Tsc qadami yo'q, yolg'on yashil. YAML surilish yoki runs on yo'q, run qizil, lekin job yo'q.", { hl: 'tuzoq' }),
  sg('b5', "Lokalda yashil, lentada qizil — <b>node-version = node --version</b>", "Beshinchi: lokalda yashil, lentada qizil bo'lsa, avval Node versiyasini solishtiring. Runner'dagi npm lock faylni boshqacha o'qiydi: missing webpack from lock file. Ci yml'dagi node version mashinangizdagi raqam bo'lsin.", { hl: 'node' }),
  sg('b6', "AI workflow'i — <b>to'rt savol</b>; CD chegarasi — secrets keyingi darsda", "Oltinchi: AI yozgan workflow boshlanish nuqtasi. To'rt savol: checkout bormi, versiya meniki, npm si ay'mi, tsc va build bormi. Keyin push va run. CD chegarasi: dist main env'siz yiqiladi, secrets va server keyingi darsda.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: pull_request, lint job va README'da lenta nishoni", "Uyga vazifa: o'z reponingizdagi lentani kengaytiring. Pull request'da ham yursin. Ikkinchi job lint: prettier check. README'ga lenta nishonini qo'ying: har kim ochganda yashilmi, qizilmi, ko'radi.", { hl: 'hw' }),
  sg('hw2', "Bir marta <b>lint qizil</b>, keyin yashil; repo linki platformaga", "Keyin bitta faylning formatini ataylab buzib push qiling: lint qizil, test yashil bo'lsin. Tuzatib push, ikkalasi yashil. Repo linkini platformadagi uyga vazifaga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: lenta, ci.yml, to'rt tuzoq, Node qoidasi va AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: CI va CD, lentaning to'rt qadami, ci yml, to'rt tuzoq, Node versiyasi qoidasi, AI workflow'iga to'rt savol, CD chegarasi va xato qiladigan joylar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('cicd-lenta-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s25Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap25 hl={hl} />
            <div className="mk-plan">{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b> <code>ci.yml</code>{t("da ikki job · README'da badge · Actions'da kamida bitta qizil ", "две job · badge в README · в Actions хотя бы один красный ")}<code>lint</code>{t(" run va undan keyin yashil.", " run и после него зелёный.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("GitHub Actions: run, log va namunalar", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Qizil run'ni o'qish, secrets, cache, matrix", RS('NEXT_D'))}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">{t("Mentor kursi · CI/CD", "Курс для менторов · CI/CD")}</p>
      <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
      <p>{t("Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.", 'Урок озвучен. На каждом экране говорит учитель, экран меняется вместе с ним. Проверьте наушники или громкость.')}</p>
      <ul>
        {t(["Jami taxminan 1 soat 15–30 daqiqa: ovoz ~25 daqiqa · uchta amaliyot 50–65 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Jest-2 mentor darsi (OrderBotNest'da 25 test) · Node.js 20+ · VS Code · GitHub hisobi va o'z reposi (push qila olasiz) · AI yordamchi (Antigravity, Claude Code, Codex yoki Copilot). Baza va bot tokeni kerak emas", "Loyiha: github.com/Azizbekcrypto/OrderBotNest — cicd1-start (= jest2-done) tegidan boshlaysiz; har run — haqiqiy GitHub Actions'dan"], RS('COVER')).map((x) => <li key={x}>{x}</li>)}
      </ul>
      <CoverStart onStart={onStart} resume={resume} />
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, Screen20, ScreenP21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function CiCdIntroMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});
  const [rev, setRev] = useState(0);
  const [mode, setMode] = useState('live');
  const sv = useMentorSave({ id: LESSON_ID, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted });
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setMode('live'); setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { setMode('review'); setSeen((s) => ({ ...s, [idx]: true })); if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const restart = useCallback(() => { setMode('live'); setRev((r) => r + 1); }, []);
  const finish = () => {
    if (finished.current) return; finished.current = true;
    const vals = Object.values(answers);
    const checks = vals.filter((a) => a && a.type === 'mc');
    const fin = vals.find((a) => a && a.type === 'final');
    const practices = vals.filter((a) => a && a.type === 'practice');
    const score = fin ? fin.score : 0, totalQ = FINAL.length;
    const practiceDone = practices.length === PRACTICE_COUNT && practices.every((x) => x.done);
    onFinished && onFinished({
      lessonId: LESSON_ID, lessonTitle: LESSON_TITLE,
      durationSec: Math.floor((Date.now() - startTime.current) / 1000),
      totalQuestions: totalQ, correctAnswers: score, scorePercent: Math.round((score / totalQ) * 100), passed: score >= 6 && practiceDone, testPassed: score >= 6,
      finalAttempts: fin ? fin.attempt : 0,
      checks: checks.map((c) => ({ firstTry: c.firstTry, tries: c.tries })),
      practiceDone,
      answers: Object.entries(answers).map(([i, a]) => ({ screen: Number(i) + 1, ...a })),
    });
  };
  if (!started) return <Cover onStart={sv.start} resume={sv.resume} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}

// ============================================================
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/cicd1-*.json, ru/cicd1-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/cicd1-sahna.js) ---
// CI/CD-1 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Конвейер вручную', 'GitHub Actions', 'Четыре ловушки', 'Разница машин и AI', 'CD и подготовка к классу'] },
};
ru(LENTA, [[null, null, 'пакеты установились?'], [null, null, 'типы верны?'], [null, null, 'тесты зелёные?'], [null, null, 'dist собрался?']]);
ru(CODES3, [[null, null, 'зелёный — команда закончилась, ошибки нет', null], [null, null, 'красный — Jest: тест упал', null], [null, null, 'красный — tsc: ошибка типа', null], [null, null, 'красный — команда не найдена', null]]);
ru(MAP8, [[null, 'шаг 1 · пакеты установились?'], [null, 'шаг 2 · типы верны?'], [null, 'шаг 3 · тесты зелёные?'], [null, 'шаг 4 · dist собрался?']]);
ru(MACH13, {
  l: { h: 'Ваша машина', rows: [['папка', 'OrderBotNest/ — полная'], [null, 'есть'], null] },
  r: { h: 'Runner · нет checkout', rows: [['папка', '/home/runner/work/OrderBotNest/OrderBotNest — пустая'], [null, 'нет'], null], note: 'Код на машину приносит actions/checkout. Его нет — папка пустая, а сообщение говорит «создайте lock».' },
});
ru(CAUSE14, ['package.json: telegraf 4.16.0 (вручную), package-lock.json: 4.16.3 (старый)', 'npm ci ставит ТОЧНО по lock-файлу — не меняет ни байта', 'Не совпадает — не угадывает, даёт красный: не «in sync»', 'Локально npm install → lock обновляется → lock тоже в commit']);
ru(MACH17, {
  l: { h: 'Ваша машина', rows: [null, null, [null, '✓ (экран 4)']] },
  r: { note: 'npm 10 иначе читает одну запись lock-файла (peer-пакет) и считает, что её «нет».' },
});
ru(FOUR19, ['есть checkout?', 'node-version — моё число из `node --version`?', 'npm ci (не install)?', 'есть шаги tsc и build?']);
ru(DICT23, [['лента · чемодан', 'pipeline · код (commit)'], ['Сборка · Сканер · Упаковка · Вылет', null], ['Рамка размера', 'eslint . — в OrderBotNest нет, в репозитории ученика есть'], ['стартовый сигнал · маршрут · машина ленты', null], ['красный свет — лента останавливается', 'код выхода не 0 — следующие шаги «skipped»'], ['сейф', 'GitHub Secrets (следующий урок)']]);
ru(ADD23, [['строка actions/checkout — в ci.yml ученика её нет (экран 13): на практике «добавьте одну строку»', 'практика, ci.yml'], ['npm ci vs npm install — ученик пишет install; в классе причина одним предложением (экран 14)', null], ['один раз показать на экране настоящий run Actions: красный шаг, skipped', 'конец практики'], ['«локально зелёный, в конвейере красный» — версия Node (экран 17)', 'когда ученик жалуется']]);
ru(CARDS23, [
  ['В Actions нет run', null, 'файл не в .github/workflows/ или push не дошёл'],
  ['npm install / npm test красный', null, 'нет строки checkout — папка пустая'],
  ['Run красный, job нет', null, 'сдвиг YAML / нет runs-on'],
]);
ru(QA23, [
  ['«Конвейер запускается на моём компьютере?»', 'Нет — на чистой машине GitHub; поэтому нужны checkout и npm install.'],
  ['«Зачем снова npm install? У меня же есть»', 'На чистой машине нет node_modules — каждый run заново.'],
  ['«Если красный, сайт сломается?»', 'Нет — красный код не выходит, конвейер останавливается; это защита.'],
  ['«А deploy куда?»', 'Это CD — на следующих уроках; сейчас конвейер проверяет, а не выпускает.'],
]);
ru(SUM25, [
  { t: 'CI — при каждом push ваши команды на чистой машине: вместо «у меня работает» — один ответ для всех. CD — выпуск проверенного груза (Delivery: подтверждает человек · Deployment: конвейер сам)' },
  { t: 'Конвейер — npm ci → npx tsc --noEmit → npm test → npm run build; у каждого шага код выхода: 0 — зелёный, другое — красный; после первого красного остальное «skipped»' },
  { t: 'ci.yml из трёх частей: on (push, pull_request) · runs-on: ubuntu-latest · steps (uses: actions/checkout@v4, actions/setup-node@v4 + run: команды). Push → Actions → run → job → шаги → лог' },
  { t: 'Четыре ловушки: нет checkout («нет lock» — папка пустая) · lock не совпадает («in sync» — в конвейере npm ci, локально npm install + lock в commit) · без шага tsc ложный зелёный · сдвиг YAML / нет runs-on (нет job)' },
  { t: 'Локально зелёный, в конвейере красный — сначала node-version ↔ node --version: npm на runner читает lock иначе (Missing: webpack… from lock file)' },
  { t: 'Workflow от AI — точка старта: четыре вопроса (checkout · моя версия · npm ci · tsc и build), потом push и run. Граница CD: node dist/main падает без .env — secrets на следующем уроке' },
]);
ru(HOMEWORK25, [
  null,
  { t: 'job lint — jobs.lint: checkout · setup-node · npm ci · npx prettier --check "src/**/*.ts" (две job: test ✓ · lint ✓)' },
  { t: 'Badge — значок конвейера в первую строку README' },
  { t: 'Поломка — в src/api/app.controller.ts соберите строку в одну (сломайте формат) и push: lint ✗, test ✓ · потом prettier --write и push: обе ✓' },
  { t: 'Сдача — ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.TITLE = 'Конвейер: тесты OrderBotNest запускаются сами при каждом push';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 4 проверки · самопроверка 8 вопросов. После экрана 12 можно сделать перерыв', 'Нужно: урок для менторов Jest-2 (в OrderBotNest 25 тестов) · Node.js 20+ · VS Code · аккаунт GitHub и свой репозиторий (вы можете делать push) · AI-помощник (Antigravity, Claude Code, Codex или Copilot). База и токен бота не нужны', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега cicd1-start (= jest2-done); каждый run — из настоящего GitHub Actions'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: что делает CI, код выхода, где останавливается конвейер, четыре ловушки, версия Node и workflow от AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет «у меня конвейер красный», вы знаете, на какой шаг смотреть.';
RU_S.NEXT_T = 'GitHub Actions: run, лог и образцы';
RU_S.NEXT_D = 'Чтение красного run, secrets, cache, matrix';
RU_S.FILE = 'cicd-konveyer-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['CI — <b>ваши команды на чистой машине</b>; CD — выпуск проверенного груза', 'Первое: CI — при каждом push ваши команды запускаются на чистой машине. Вместо «у меня работает» — один ответ для всех. CD — выпуск проверенного груза: в Delivery подтверждает человек, в Deployment конвейер выпускает сам.'],
  b2: ['Конвейер: <b>четыре шага, код выхода</b>; после первого красного остальное «skipped»', 'Второе: конвейер — четыре шага: npm ci, tsc, test, build. Каждый возвращает код выхода: ноль — зелёный, другое — красный. На первом красном шаге конвейер останавливается, остальное skipped, сломанный код не собирается.'],
  b3: ['<b>ci.yml</b> из трёх частей: on · runs-on · steps; push → run → job → шаг → лог', 'Третье: ci yml из трёх частей. On — когда. Runs on — на какой машине. Steps — шаги: checkout, setup node и ваши команды run. Делаете push, в Actions появляется run, внутри job, шаги и лог каждого шага.'],
  b4: ['<b>Четыре ловушки</b>: нет checkout · lock не совпадает · нет tsc · ошибка YAML', 'Четвёртое: четыре ловушки. Нет checkout — папка пустая. Package json и lock не совпадают — ошибка in sync. Нет шага tsc — ложный зелёный. Сдвиг YAML или нет runs on — run красный, но job нет.'],
  b5: ['Локально зелёный, в конвейере красный — <b>node-version = node --version</b>', 'Пятое: если локально зелёный, а в конвейере красный, сначала сравните версию Node. Npm на runner читает lock-файл иначе: missing webpack from lock file. Пусть node version в ci yml будет числом с вашей машины.'],
  b6: ['Workflow от AI — <b>четыре вопроса</b>; граница CD — secrets на следующем уроке', 'Шестое: workflow от AI — точка старта. Четыре вопроса: есть ли checkout, моя ли версия, npm ci ли, есть ли tsc и build. Потом push и run. Граница CD: dist main падает без env, secrets и сервер — на следующем уроке.'],
  hw: ['<b>Домашнее задание</b>: pull_request, job lint и значок конвейера в README', 'Домашнее задание: расширьте конвейер в своём репозитории. Пусть запускается и на pull request. Вторая job — lint: prettier check. Поставьте в README значок конвейера: любой, кто откроет, увидит, зелёный он или красный.'],
  hw2: ['Один раз <b>lint красный</b>, потом зелёный; ссылка на репозиторий — на платформу', 'Потом нарочно сломайте формат одного файла и сделайте push: lint красный, test зелёный. Исправьте и сделайте push — обе зелёные. Вставьте ссылку на репозиторий в домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: конвейер, ci.yml, четыре ловушки, правило Node и вопросы к AI — на одной странице', 'Внизу памятка на одну страницу: CI и CD, четыре шага конвейера, ci yml, четыре ловушки, правило версии Node, четыре вопроса к workflow от AI, граница CD и места, где ошибаются. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# CI/CD — памятка ментора (OrderBotNest, конвейер)
## Проект
git fetch --tags · git checkout cicd1-start (= jest2-done) → cicd1-done (.github/workflows/ci.yml) · npm test — 25 тестов, база и токен не нужны
## CI / CD
CI — при каждом push ваши команды на чистой машине (установка → типы → тест → build): вместо «у меня работает» — один ответ для всех · CD — выпуск проверенного груза: Delivery (подтверждает человек) · Deployment (конвейер сам)
## Конвейер — четыре шага
npm ci → npx tsc --noEmit → npm test → npm run build · код выхода: 0 зелёный, 1 (jest), 2 (tsc), 127 (нет команды) красный · после первого красного остальное «skipped» · локально: npm ci && npx tsc --noEmit && npm test && npm run build
## ci.yml (15 строк)
name: CI · on: [push, pull_request] · jobs: test: runs-on: ubuntu-latest · steps: - uses: actions/checkout@v4 · - uses: actions/setup-node@v4 (with: node-version: 24, cache: npm) · - run: npm ci · - run: npx tsc --noEmit · - run: npm test · - run: npm run build
push → Actions → run → job → шаги (Set up job, checkout, setup-node, run: …) → лог (нажмите на шаг)
## Четыре ловушки
нет checkout → npm ci: «can only install with an existing package-lock.json» (папка пустая) · package.json изменён вручную, lock старый → не «in sync» (локально npm install, lock в commit; в конвейере npm ci) · нет шага tsc → ошибка типа проходит зелёной (ложный зелёный) · сдвиг YAML / нет runs-on → run красный, job нет («workflow file issue»)
## Локально зелёный, в конвейере красный
Missing: webpack@5.112.2 from lock file → Node (npm) на runner другой, чем на машине: node-version = ваше число из node --version (22 → 24 — зелёный)
## Приём workflow от AI — четыре вопроса
есть ли checkout · node-version мой · npm ci (не install) · есть ли шаги tsc и build → push → зелёный ли run · оба AI написали node-version: 22, без tsc/build
## Граница CD
node dist/main → DATABASE_URL topilmadi (нет .env) · нужно: Secrets (DATABASE_URL, BOT_TOKEN) · сервер · команда выпуска — следующие уроки
## Подготовка к классу (m4c-01, 20 экранов)
лента аэропорта: Сборка = npm install · Сканер = npm test · Рамка размера = eslint · Упаковка = build · Вылет = deploy · стартовый сигнал = on: push · маршрут = ci.yml · вы добавляете: строку checkout (её нет в yml ученика), причину npm ci, один настоящий run
## Где ошибаются
нет run → путь файла / push · Could not read package.json (ENOENT) → нет checkout · run красный, job нет → YAML / runs-on · Missing … from lock file → версия Node
## Ваше домашнее задание (40–60 минут)
pull_request · job lint (prettier --check) · badge в README · один раз lint красный → зелёный → ссылка на репозиторий на платформу`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxatlari
ru(CAUSE10, ['npm test вернул код выхода 1 (тест границы красный)', 'Конвейер остановился на этом шаге — npm run build «skipped»', 'Сломанный код не собран и никуда не ушёл', 'Восстановите строку и запушьте — run снова зелёный']);
ru(STATIONS25, [[null, 'CI / CD'], [null, 'Конвейер'], [null, 'ci.yml · Actions'], [null, 'Четыре ловушки'], [null, 'AI workflow']]);
ru(L_ST, { ok: '✓ зелёный', bad: '✗ красный', skip: '— не запускался' });

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · CI/CD",
  "title": "В Jest-2 вы написали 25 тестов — сегодня они запускаются при каждом push на самом GitHub, а вы видите только зелёный или красный",
  "seg": {
   "a": [
    "В Jest-2 тесты написаны — сегодня они запускаются <b>при каждом push на самом GitHub</b>",
    "Здравствуйте. На втором уроке по Jest вы написали для OrderBotNest двадцать пять тестов. Сейчас они запускаются, только когда вы пишете npm test. Сегодня передаём их конвейеру: при каждом push они запускаются на самом GitHub. На экране результат в конце урока: шесть шагов, все зелёные."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: что делает CI/CD, что такое конвейер, зачем он нужен",
    "Сначала общее понятие: что делает CI/CD и зачем он нужен. Потом вы вручную запустите конвейер на своём компьютере, а уже после этого передадите его GitHub. Где конвейер падает, увидите на четырёх ловушках."
   ],
   "c": [
    "Настоящая находка: <b>локально зелёный, в конвейере красный</b> — и workflow, написанные AI",
    "На пятом этапе настоящая находка: локально всё было зелёным, а в конвейере вышел красный. Причину найдём вместе. Потом проверим в конвейере workflow, написанные двумя AI. В конце — что такое CD и подготовка к классу."
   ],
   "d": [
    "Шесть этапов, три практики; нужен <b>свой репозиторий на GitHub</b>",
    "Урок — шесть этапов, три практики. Для практик нужен свой репозиторий на GitHub: достаточно, чтобы вы могли сделать push своей копии OrderBotNest. Не спешите: каждый экран можно прослушать с начала, урок запоминает, где вы остановились. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "CI — при каждом push ваши команды запускаются на чистой машине; CD — выпуск проверенного груза. Оба решают одно: «у меня работает»",
  "seg": {
   "a": [
    "Проблема: <b>«у меня работает»</b> — у коллеги красный, потому что машина у него другая",
    "Знакомая ситуация: у вас npm test зелёный, вы сделали push, коллега сделал clone, у него красный. У меня работает, говорите вы. Правы оба: у него другая папка node modules, другая версия Node, другой env-файл. Код один, машина другая."
   ],
   "b": [
    "CI: при каждом push <b>ваши команды запускаются на чистой машине</b> — для всех один ответ",
    "Это и решает CI. Continuous Integration: после каждого push чистая машина на GitHub берёт код и запускает именно ваши команды: установка, типы, тест, build. Машина для всех одинаковая, и ответ одинаковый: зелёный или красный. Спора «у меня работает» больше нет."
   ],
   "c": [
    "CD: <b>выпуск проверенного груза</b> — Delivery подтверждает человек, Deployment выпускает сам",
    "CD — вторая половина: выпуск проверенного груза. Continuous Delivery: пакет готов, кнопку нажимает человек. Continuous Deployment: конвейер выпускает сам, без человека. Оба — после CI, потому что красный груз никто не выпускает."
   ],
   "d": [
    "Итог: сегодня <b>CI полностью, CD до границы</b> — конвейер OrderBotNest при каждом push говорит зелёный или красный",
    "Итог: CI — проверка на чистой машине при каждом push. CD — выпуск проверенного груза. Сегодня делаем CI до конца: конвейер OrderBotNest при каждом push говорит зелёный или красный. CD посмотрим до его границы: без базы и токена бот не выпускается. Теперь — что такое сам конвейер."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · общее понятие",
  "title": "Конвейер — последовательность команд: каждая возвращает код выхода, 0 — зелёный, другое — красный; после красного остальное не запускается",
  "seg": {
   "a": [
    "Четыре шага: <b><code>npm ci</code> → <code>tsc</code> → <code>npm test</code> → <code>npm run build</code></b> — каждый одна команда терминала",
    "Конвейер — не что-то таинственное: это последовательность команд, которые вы пишете в терминале. Для OrderBotNest их четыре: npm ci устанавливает пакеты. npx tsc проверяет типы. npm test. npm run build собирает папку dist. Конвейер запускает эти четыре по порядку."
   ],
   "b": [
    "Каждый шаг <b>отвечает на один вопрос</b>: установилось ли, верны ли типы, зелёные ли тесты, собралось ли",
    "Каждый шаг отвечает на один вопрос. Установились ли пакеты. Верны ли типы. Зелёные ли тесты. Собрался ли build. Четыре вопроса, четыре ответа. Шага eslint пока нет: в OrderBotNest lint не настроен, а в конвейер ставится только работающая команда."
   ],
   "c": [
    "Код выхода: <b>0 — зелёный, другое — красный</b>; <code>tsc</code> даёт 2, <code>jest: not found</code> даёт 127",
    "Каждая команда по завершении возвращает число, это код выхода. Ноль — всё хорошо, зелёный. Другое число — красный. Jest при красном тесте даёт один, tsc при ошибке типов — два, если команда не найдена — сто двадцать семь. Само число конвейер не знает, он смотрит только, ноль или нет."
   ],
   "d": [
    "Итог: <b>после красного шага остальное не запускается</b> — если тест красный, build не начинается",
    "Итог: конвейер — четыре команды, каждая с кодом выхода. На первом красном шаге конвейер останавливается, остальное не запускается: если тест красный, build не начинается, сломанный код никогда не собирается. Теперь запустим этот конвейер вручную на своём компьютере, в чистой папке."
   ]
  }
 },
 "4": {
  "kicker": "Этап 2 · конвейер вручную",
  "title": "Машина конвейера каждый раз начинает с пустой папки — и мы тоже: новый clone, нет node_modules, четыре команды подряд, у каждой код выхода",
  "seg": {
   "a": [
    "Clone в новую папку: <b>нет <code>node_modules</code></b> — машина конвейера начинает так же",
    "Сделайте clone OrderBotNest в новую папку: git clone, потом переход на тег jest два done. Откройте в VS Code, в терминале ls. Семь вещей: package json, lock, src и так далее. Нет node modules, нет env. Машина конвейера каждый раз начинает ровно с такой пустой папки."
   ],
   "b": [
    "<code>npm ci</code>: <b>633 пакета, 6 секунд</b> — точно по lock-файлу; потом <code>tsc</code> — 3 секунды, код выхода 0",
    "Первая команда npm ci: ставит ровно те версии, что в lock-файле, шестьсот тридцать три пакета, шесть секунд, код выхода ноль. Вторая — npx tsc no emit: проверяет типы и не пишет файлы. Три секунды, код выхода ноль: ошибок нет."
   ],
   "c": [
    "<code>npm test</code>: <b>25 тестов зелёные, 2 секунды</b>; <code>npm run build</code>: папка <code>dist</code>, 4 секунды",
    "Третья — npm test: пять файлов, двадцать пять тестов, все зелёные, две секунды. Четвёртая — npm run build: nest build собирает папку dist, четыре секунды. Ls dist: main js и другие файлы. Все четыре шага завершились нулём."
   ],
   "d": [
    "Итог: <b>четыре команды, 15 секунд, четыре нуля</b> — это конвейер; на GitHub запускается ровно это",
    "Итог: четыре команды, всего пятнадцать секунд, все четыре кода выхода — ноль, конвейер зелёный. То, что вы сейчас сделали вручную, машина на GitHub сама делает при каждом push, именно этими командами. Но сначала проверим одну вещь."
   ]
  }
 },
 "5": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "В чистом clone сразу написали npm test. Терминал: sh: 1: jest: not found, код выхода 127. В чём причина?",
  "q": "Вы видели конвейер, теперь проверим. Первая проверка. В чистом clone пропустили npm ci и сразу написали npm test. Терминал: jest not found, код выхода сто двадцать семь. В чём причина? Выберите вариант.",
  "ok": "Верно. Jest есть в package json, но не установлен: папки node modules нет, потому что npm ci не запускался. В конвейере это самая частая ошибка: шаг установки выпал или стоит не в том порядке. Значит, в конвейере первый шаг всегда установка, всё остальное — после неё.",
  "okShort": "Нет <code>node_modules</code> — <code>npm ci</code> не запускался. В конвейере первый шаг всегда установка.",
  "hint": "Есть ли node_modules в ls? Откуда берётся команда jest?",
  "demak": "в конвейере первый шаг — установка (<code>npm ci</code>); на чистой машине <code>node_modules</code> нет.",
  "opts": [
   "Jest вообще нет в package.json — сначала надо добавить в список",
   "Нет node_modules — выпал шаг npm ci",
   "Старая версия Node — Jest не работает",
   "Нет тестовых файлов — Jest пишет «not found»"
  ],
  "wrong": {
   "0": "В package.json jest есть (devDependencies); проблема в установке, а не в списке.",
   "2": "Node 24 — новый; not found — это не версия, а отсутствие файла.",
   "3": "Если нет тестового файла, Jest пишет No tests found; здесь не найден сам Jest."
  }
 },
 "6": {
  "kicker": "Этап 2 · ломаем",
  "title": "Ломаем код и соединяем четыре команды через &&: npm ci ✓, tsc ✓, тест красный — build не начинается, код выхода 1",
  "seg": {
   "a": [
    "Ломаем: <code>order.service.ts</code>, 36-я строка <b><code>&lt;</code> → <code>&lt;=</code></b> — это поймает тест границы из Jest-2",
    "Теперь нарочно ломаем. В тридцать шестой строке файла order service ts в папке src, api, order замените «меньше» на «меньше или равно». Помните со второго урока по Jest: когда осталось ровно два, два продать нельзя, и тест границы это ловит."
   ],
   "b": [
    "Четыре команды <b>в одной строке через <code>&amp;&amp;</code></b>: если предыдущая дала ноль, запускается следующая",
    "На этот раз пишем четыре команды в одной строке, между ними два амперсанда. Смысл: если предыдущая дала ноль, запускается следующая, если нет — останавливается. В терминале: npm ci, амперсанд, npx tsc, амперсанд, npm test, амперсанд, npm run build."
   ],
   "c": [
    "Результат: <b><code>npm ci</code> ✓, <code>tsc</code> ✓, тест FAIL — строки <code>build</code> нет вообще</b>, код выхода 1",
    "Посмотрите на результат. Npm ci зелёный, tsc зелёный. Npm test: FAIL, тест границы, Колонка, на складе осталось только два, тридцать седьмая строка. А внизу строки build нет вообще: nest build не начался. Код выхода всей строки — один."
   ],
   "d": [
    "Итог: <b>цепочка рвётся на первом красном</b> — конвейер GitHub так же, только пишет «не запускался»",
    "Итог: цепочка рвётся на первом красном шаге, сломанный код не собирается. Конвейер GitHub работает точно так же, только незапущенный шаг показывает как skipped, то есть не запускался. Восстановите строку: git checkout, order service ts. Теперь запустите конвейер вручную сами."
   ]
  }
 },
 "7": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 12 минут",
  "title": "В чистом clone запустите четыре команды через &&, потом сломайте код и увидьте, как рвётся цепочка",
  "seg": {
   "a": [
    "Теперь вы: <b>clone в новую папку, тег <code>jest2-done</code></b>, цепочка из четырёх команд",
    "Теперь ваша очередь. Делаете clone OrderBotNest в новую папку, переходите на тег jest два done, запускаете четыре команды через амперсанд. База и токен не нужны. Займёт двенадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>clone и цепочка</b> — все четыре шага ноль, появляется папка <code>dist</code>",
    "На первом шаге git clone и git checkout jest два done. На втором цепочка из четырёх команд: npm ci, tsc, test, build. В конце должна появиться папка dist, строка tests — двадцать пять passed."
   ],
   "c": [
    "Шаги 3–4: <b>сломайте 36-ю строку</b> и запустите цепочку — <code>build</code> не запускается; восстановите; подтверждение — строка <code>Tests:</code>",
    "На третьем шаге ломаете «меньше» на «меньше или равно» в тридцать шестой строке order service ts и запускаете цепочку заново: тест красный, build не запускается. На четвёртом восстанавливаете через git checkout. В поле подтверждения скопируйте строку tests с третьего шага."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы запустили конвейер вручную и видели, как он рвётся на красном."
   ]
  },
  "steps": [
   {
    "t": "Чистый clone",
    "exp": "нет node_modules"
   },
   {
    "t": "Цепочка",
    "exp": "Tests: 25 passed, 25 total · dist/main.js"
   },
   {
    "t": "Поломка",
    "exp": "Tests: 1 failed, 24 passed, 25 total · build не запускался",
    "cmds": [
     "src/api/order/order.service.ts, строка 36: < → <=",
     "снова запустите цепочку"
    ]
   },
   {
    "t": "Восстановление",
    "exp": "Tests: 25 passed, 25 total",
    "cmds": [
     null,
     "цепочка"
    ]
   }
  ],
  "proof": {
   "label": "Строка Tests: с шага 3",
   "placeholder": "например: Tests: 1 failed, 24 passed, 25 total",
   "wrong": "В сломанном коде один тест должен быть красным — вставьте строку Tests: с шага 3."
  },
  "trouble": [
   [
    "error: pathspec 'jest2-done' did not match",
    "теги не получены — git fetch --tags, потом checkout"
   ],
   [
    "sh: 1: jest: not found",
    "npm ci не запускался или его нет в цепочке — первая команда npm ci"
   ],
   [
    "На шаге 3 всё ✓",
    "36-я строка не изменена или изменена другая — должно быть if (p.stock <= c.qty)"
   ],
   [
    "build всё равно запустился",
    "команды соединены через ; — нужно &&: ; не останавливается на красном"
   ]
  ]
 },
 "8": {
  "kicker": "Этап 3 · GitHub Actions",
  "title": ".github/workflows/ci.yml — маршрут конвейера: когда (on), на какой машине (runs-on), какие шаги (steps); uses — готовый шаг, run — ваша команда",
  "seg": {
   "a": [
    "Файл <b><code>.github/workflows/ci.yml</code></b> — GitHub считает конвейером каждый файл в этой папке",
    "В своей папке OrderBotNest, в корне, создайте папку точка github, в ней папку workflows, в ней файл ci yml. GitHub считает конвейером каждый файл в этой папке. Первые две строки: name, имя конвейера, и on: когда запускаться. Push и pull request."
   ],
   "b": [
    "<code>jobs</code> → <code>test</code> → <b><code>runs-on: ubuntu-latest</code></b> — чистая машина Ubuntu на GitHub",
    "С третьей по пятую строку: jobs, то есть работы. Одна работа, имя test. Runs on, ubuntu latest: чистая машина Ubuntu на GitHub. На каждый run — новая машина, пустая папка, то состояние, что вы видели на четвёртом экране."
   ],
   "c": [
    "<code>steps</code>: <b><code>checkout</code> приносит код, <code>setup-node</code> ставит Node 24</b> — <code>uses</code>, готовые шаги",
    "С шестой: steps, шаги. Первые два — через uses, готовые шаги. Actions checkout приносит на машину репозиторий, без него папка пустая. Setup node ставит Node двадцать четыре, такой же, как на вашей машине, и включает кэш npm."
   ],
   "d": [
    "Итог: <b>четыре строки <code>run:</code> — четыре команды с четвёртого экрана</b>, в том же порядке",
    "Итог: последние четыре строки — через run, это ваши команды: npm ci, tsc, test, build, ровно в порядке четвёртого экрана. Ci yml — три части: когда, на какой машине, какие шаги. Сохраните файл, теперь делаем push."
   ]
  }
 },
 "9": {
  "kicker": "Этап 3 · GitHub Actions",
  "title": "git push — и в разделе Actions на GitHub появляется run: одна job, шесть шагов, у каждого секунды, все зелёные",
  "seg": {
   "a": [
    "Сделайте push — <b>раздел Actions на GitHub</b>: появился run, жёлтая точка — выполняется",
    "В терминале git add, commit, push. В браузере откройте репозиторий, вверху раздел Actions. Появился новый run: его имя — ваше сообщение commit, рядом жёлтая точка, выполняется. Подождите меньше минуты."
   ],
   "b": [
    "Внутри run: <b>одна job <code>test</code>, шесть шагов</b> — <code>checkout</code>, <code>setup-node</code>, четыре команды, у каждой секунды",
    "Откройте run. Слева job: test. Справа шаги: set up job, его добавил сам GitHub. Потом checkout, setup node и ваши четыре команды. Рядом с каждым шагом зелёный знак и сколько секунд он шёл. Всё зелёное, run зелёный."
   ],
   "c": [
    "Нажмёте на шаг — <b>лог, тот же текст, что в вашем терминале</b>: <code>PASS</code>, <code>Tests: 25 passed</code>",
    "Нажмите на шаг npm test: откроется лог. Это ровно текст из вашего терминала: PASS, пять файлов, двадцать пять passed. Только запускали его не вы, а машина на GitHub. Если умеете читать этот лог, найдёте любую ошибку конвейера."
   ],
   "d": [
    "Итог: <b>push → чистая машина → ваши команды → зелёный</b>; теперь сделаем его красным",
    "Итог: вы сделали push, GitHub открыл чистую машину, принёс код, поставил Node, запустил ваши четыре команды и сказал: зелёный. Вы ничего не делали. Теперь сломаем код, сделаем push и посмотрим, как конвейер показывает красный."
   ]
  }
 },
 "10": {
  "kicker": "Этап 3 · ломаем",
  "title": "Push с <=: run красный — шаг npm test ✗, npm run build «skipped», в аннотации Process completed with exit code 1",
  "seg": {
   "a": [
    "Снова ломаем 36-ю строку и делаем push — <b>run красный</b>: в списке красный знак с сообщением commit",
    "Возвращаем поломку с шестого экрана: order service ts, тридцать шестая строка, «меньше или равно». Commit, push. В разделе Actions новый run, на этот раз красный знак. Открываем run."
   ],
   "b": [
    "Шаги: <b><code>npm test</code> ✗, <code>npm run build</code> — «skipped»</b>; аннотация: код выхода 1",
    "Посмотрите на шаги: checkout, setup node, npm ci, tsc — всё зелёное. Npm test красный. Npm run build: skipped, не запускался. Вверху аннотация: process completed with exit code one. То же, что цепочка с амперсандами на шестом экране, только GitHub это показывает."
   ],
   "c": [
    "В логе <b>тот же FAIL</b>: тест границы, <code>Kolonka: omborda faqat 2 ta qoldi</code>, 37-я строка",
    "Нажмите на красный шаг: лог. Тот же FAIL: order service spec, тест границы, Колонка, на складе осталось только два, тридцать седьмая строка. Всё, что Jest говорит вам локально, есть здесь. Внизу: process completed with exit code one."
   ],
   "d": [
    "Значит, причина: <b>тест дал код выхода 1 — конвейер остановился</b>, build не запускался, сломанный код не собран",
    "Значит, причина в одном месте: npm test дал код выхода один, конвейер остановился на этом шаге, build не запускался. Сломанный код не собрался и никуда не вышел. Если восстановить строку и сделать push, run снова зелёный. Теперь проверим."
   ]
  }
 },
 "11": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4",
  "title": "В конвейере шаг npx tsc --noEmit завершился с кодом выхода 2. Что будет с шагами npm test и npm run build?",
  "q": "Вы видели красный run, теперь проверим. Вторая проверка. В конвейере шаг tsc завершился с кодом выхода два: ошибка типов. Что будет со следующими шагами npm test и npm run build? Выберите вариант.",
  "ok": "Верно. Конвейер останавливается на первом красном шаге: tsc дал два, и npm test, и build — skipped, не запускались. Код выхода два или один — для конвейера разницы нет: не ноль, значит красный. Значит, порядок шагов важен: дешёвая и быстрая проверка впереди, код, не прошедший её, не доходит даже до теста.",
  "okShort": "Первый красный шаг — остальное «skipped». И 2, и 1 — не ноль.",
  "hint": "Вспомните цепочку && с шестого экрана: что было после красного?",
  "demak": "конвейер останавливается на первом красном шаге; следующие шаги «skipped». Код выхода не ноль — красный.",
  "opts": [
   "Оба запустятся — ошибка типов не мешает ни тесту, ни build",
   "npm test запустится, build нет — тест отдельно",
   "Оба «skipped» — после первого красного остановка",
   "Оба запустятся, но run всё равно красный"
  ],
  "wrong": {
   "0": "Конвейер — последовательность шагов: если предыдущий красный, следующий не начинается.",
   "1": "Шаги зависят друг от друга: если tsc красный, тест тоже не запускается.",
   "3": "Не запустятся: GitHub отмечает их «skipped», run красный."
  }
 },
 "12": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Выложите свою копию OrderBotNest на GitHub, напишите ci.yml, push — зелёный run в Actions; потом сломайте и увидьте красный",
  "seg": {
   "a": [
    "Теперь вы: <b>свой репозиторий на GitHub</b> — копия OrderBotNest, <code>ci.yml</code>, push",
    "Теперь ваша очередь. Открываете на GitHub новый репозиторий, делаете в него push своей копии OrderBotNest, пишете ci yml и видите в Actions зелёный run. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>репозиторий и push</b>, потом <code>.github/workflows/ci.yml</code> — 15 строк с восьмого экрана",
    "На первом шаге открываете на GitHub пустой репозиторий, подключаете через git remote и делаете push. На втором пишете файл точка github, workflows, ci yml пятнадцатью строками с восьмого экрана, push. В Actions run должен быть зелёным."
   ],
   "c": [
    "Шаги 3–4: <b>сломайте 36-ю строку и push</b> — run красный, <code>build</code> skipped; восстановите и push — зелёный; подтверждение — адрес run",
    "На третьем шаге ломаете тридцать шестую строку и делаете push: run красный, шаг npm test красный, build skipped. На четвёртом восстанавливаете и делаете push: зелёный. В поле подтверждения скопируйте адрес зелёного run из адресной строки браузера."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики в вашем репозитории конвейер запускается при каждом push, и вы видели его один раз красным и один раз зелёным."
   ]
  },
  "steps": [
   {
    "t": "Свой репозиторий",
    "exp": "код виден на GitHub",
    "cmds": [
     "GitHub → New repository (пустой, без README)",
     "git remote add mine https://github.com/<ваш-логин>/OrderBotNest.git",
     null
    ]
   },
   {
    "t": "ci.yml",
    "exp": "Actions: run ✓ (6 шагов зелёные)",
    "cmds": [
     ".github/workflows/ci.yml — 15 строк с 8-го экрана (node-version — ваш номер из node --version)",
     null
    ]
   },
   {
    "t": "Поломка и push",
    "exp": "run ✗: npm test ✗ · npm run build skipped"
   },
   {
    "t": "Восстановление и push",
    "exp": "run ✓"
   }
  ],
  "proof": {
   "label": "Адрес зелёного run с шага 4",
   "placeholder": "например: https://github.com/вы/OrderBotNest/actions/runs/41831…",
   "wrong": "Откройте run в Actions и вставьте адрес из строки браузера: …/actions/runs/<номер>."
  },
  "trouble": [
   [
    "В разделе Actions нет run",
    "файл не в папке .github/workflows/ или push не дошёл до main — проверьте путь и git push mine HEAD:main"
   ],
   [
    "шаг npm ci красный: Missing: … from lock file",
    "Node на runner другой, чем на вашей машине — поставьте в node-version число из node --version (экран 17)"
   ],
   [
    "npm ci красный: can only install with an existing package-lock.json",
    "нет шага actions/checkout@v4 — на машине нет репозитория (экран 13)"
   ],
   [
    "Run красный, внутри нет job",
    "ошибка файла — сдвиг YAML или нет runs-on (экран 16)"
   ]
  ]
 },
 "13": {
  "kicker": "Этап 4 · четыре ловушки",
  "title": "Если убрать строку actions/checkout — машина пустая: npm ci говорит «нет lock-файла», run красный; первая ловушка",
  "seg": {
   "a": [
    "Первая ловушка: <b>нет строки <code>checkout</code></b> — выглядит правильно, ошибки YAML тоже нет",
    "Посмотрим четыре ловушки, каждая — настоящий run. Первая: из ci yml убрали строку actions checkout. Файл выглядит правильно: setup node, npm ci, npm test. Ошибки YAML нет, GitHub принял файл, run начался."
   ],
   "b": [
    "Run: <code>setup-node</code> ✓, <b><code>npm ci</code> ✗ — «can only install with an existing package-lock.json»</b>",
    "Run красный. Setup node зелёный, Node установлен. Npm ci красный, в логе: npm ci устанавливает только с существующим package lock json, создайте lock. Но наш lock-файл есть в репозитории, вы видели его на четвёртом экране. Сообщение обманывает: нет не lock, пуста вся папка."
   ],
   "c": [
    "Значит, причина: <b>runner начинает с пустой папки</b> — код приносит <code>checkout</code>, а его нет",
    "Значит, причина одна: runner каждый раз начинает с пустой папки, даже пустее, чем чистый clone на четвёртом экране, там хотя бы был clone. Код на машину приносит actions checkout. Его нет, значит нет ни package json, ни lock, и npm ci не знает, что ставить."
   ],
   "d": [
    "Итог: <b>первый шаг всегда <code>checkout</code></b>; видите «нет lock» или «нет package.json» — ищите эту строку",
    "Итог: в каждом workflow первый шаг — actions checkout. Если в логе видите «нет lock-файла» или «нет package json», не проверяйте репозиторий, ищите эту строку в ci yml. В ci yml из урока ученика этой строки тоже нет, увидим на двадцать третьем экране. Вторая ловушка — lock-файл."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · четыре ловушки",
  "title": "Вручную изменили package.json, lock остался старым — npm ci падает и в конвейере, и локально: «package.json and package-lock.json … in sync»; вторая ловушка",
  "seg": {
   "a": [
    "Вторая ловушка: в <code>package.json</code> <b>вручную изменили версию</b>, <code>npm install</code> не запускали — lock старый",
    "Вторая ловушка. В тридцатой строке файла package json вручную поменяли версию telegraf на четыре шестнадцать ноль, npm install не запускали. В package lock json всё ещё четыре шестнадцать три. Два файла не соответствуют друг другу. Commit, push."
   ],
   "b": [
    "И локально, и в конвейере: <b><code>npm ci</code> красный — не «in sync»</b>: в lock 4.16.3, в <code>package.json</code> 4.16.0",
    "Результат и локально, и в конвейере одинаковый: npm ci красный. Сообщение: package json и package lock json не in sync, то есть не соответствуют. Ниже точная причина: telegraf в lock-файле четыре шестнадцать три не соответствует четыре шестнадцать ноль в package json."
   ],
   "c": [
    "Значит, причина: <b><code>npm ci</code> ставит точно по lock-файлу</b>, не совпадает — не ставит, даёт красный",
    "Значит, причина: npm ci, то есть clean install, ставит точно по lock-файлу, не меняя ни байта. Если package json не совпадает, он не угадывает, а даёт красный. Это правильно: в конвейере все машины должны получить ровно одинаковые пакеты."
   ],
   "d": [
    "Итог: <b>локально <code>npm install</code>, в конвейере <code>npm ci</code></b>; изменилась версия — lock тоже в commit",
    "Итог: если добавляете пакет или меняете версию, запустите локально npm install: он обновит lock. Lock-файл тоже добавьте в commit. А в конвейере всегда npm ci: он доверяет lock и останавливается, если не совпадает. Третья ловушка самая опасная: зелёный, но ложный."
   ]
  }
 },
 "15": {
  "kicker": "Этап 4 · внутри",
  "title": "Ошибка типа в user.service.ts: ts-jest всё равно пропускает тесты зелёными — без шага tsc конвейер зелёный (ложно), с tsc красный; третья ловушка",
  "seg": {
   "a": [
    "Третья ловушка: <b>ошибка типа, тест зелёный</b> — <code>ts-jest</code> типы не проверяет, проверяет <code>tsc</code>",
    "Третья ловушка. В шестнадцатой строке файла user service ts в папке src, api, user убрали string: telegram id теперь number, а колонка — string. Npx tsc: ошибка в двадцатой строке, TS два три два два, код выхода два. Npm test: двадцать пять passed, зелёный. Тест типы не проверяет."
   ],
   "b": [
    "В конвейере нет шага <code>tsc</code> (run 14): <b>всё зелёное — ложно</b>; код не компилируется",
    "Этот код мы отправили push с ci yml без шага tsc: checkout, setup node, npm ci, npm test. Run зелёный, шесть зелёных знаков. Но это ложный зелёный: nest build этот код не соберёт, бот не запустится. Конвейер этого не увидел, потому что никто не спросил."
   ],
   "c": [
    "С шагом <code>tsc</code> (run 15): <b><code>tsc</code> ✗, тест и build skipped</b> — run красный, код выхода 2",
    "Тот же код с рекомендованным ci yml: шаг tsc есть. Run красный: tsc красный, код выхода два, npm test skipped, build skipped. Посмотрите рядом: тот же код, те же тесты, разница в одной строке: npx tsc no emit. В одном ложный зелёный, в другом настоящий красный."
   ],
   "d": [
    "Итог: <b>конвейер проверяет только то, что спросили</b> — шаг <code>tsc</code> ставьте до теста",
    "Итог: конвейер проверяет только то, о чём вы спросили. Зелёные тесты не значат, что типы верны. Ставьте шаг npx tsc no emit до npm test: дёшево, три секунды, и останавливает, не доходя до build. Четвёртая ловушка: сам файл."
   ]
  }
 },
 "16": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4 — какая строка с ошибкой?",
  "title": "Сделали push с этим ci.yml — run красный, но внутри нет ни одного шага: «workflow file issue». Найдите строку-виновника",
  "q": "Вы видели три ловушки, четвёртую найдёте сами. Третья проверка. Сделали push с этим ci yml: run красный, но внутри нет ни одного шага, GitHub сказал workflow file issue. В YAML элементы одного списка стоят в одной колонке. Список начался в седьмой строке, следующий элемент начинается с другой колонки. Нажмите на первую сломанную строку.",
  "ok": "Верно. Восьмая строка начинается на два пробела правее соседней: YAML читает её не как элемент списка, а как продолжение предыдущего элемента и не понимает. Такой файл GitHub не запускает: run в списке красный, но внутри нет job, нет шагов, нет лога, только workflow file issue. На экране исправлено: все дефисы на одной глубине. Ниже вторая ошибка файла: нет runs on.",
  "okShort": "Строка 8 на 2 пробела правее — YAML не понял. При ошибке файла нет job, шагов и лога.",
  "hint": "Дефисы - uses и - run должны стоять в одной колонке. Какой сдвинут?",
  "task": "Правило: в YAML элементы одного списка (<code>- </code>) стоят в одной колонке. Список начался в 7-й строке; следующий элемент начинается с другой колонки — GitHub показывает именно эту строку. <b>Нажмите на первую сломанную строку.</b>"
 },
 "17": {
  "kicker": "Этап 5 · разница машин",
  "title": "Настоящая находка: в чистом clone было зелёным, а в первом run npm ci красный — Missing: webpack@5.112.2 from lock file; причина — на runner Node 22, на машине Node 24",
  "seg": {
   "a": [
    "Наш первый run на самом деле <b>был красным</b>: <code>npm ci</code> — <code>Missing: webpack@5.112.2 from lock file</code>",
    "Теперь настоящая находка. При подготовке этого урока первый run вышел красным. Шаг npm ci: missing webpack from lock file. А локально на четвёртом экране с тем же lock npm ci был зелёным. Тот же код, тот же lock, другой результат. У меня работает, а в конвейере нет."
   ],
   "b": [
    "Разница: <b>на машине Node 24 и npm 11, на runner Node 22 и npm 10</b> — npm 10 читает lock иначе",
    "Поставим две машины рядом. Ваша: node двадцать четыре, npm одиннадцать. Runner: в ci yml было написано node version двадцать два, с ним идёт npm десять. Npm десять иначе читает одну запись lock-файла, peer-пакет, и считает, что её нет."
   ],
   "c": [
    "Доказательство локально: <b>с npm 10 <code>npm ci</code> — та же ошибка</b>; значит, причина не в коде, а в версии npm",
    "Доказательство: на своей машине вызвали через npx npm десять и запустили npm ci: ровно та же ошибка, missing webpack. Значит, причина не в коде и не в lock: Node в конвейере, а значит и npm, другой, чем на машине. Если локально зелёный, а в конвейере красный, первым делом сравните это."
   ],
   "d": [
    "Итог: <b><code>node-version</code> — ваше число из <code>node --version</code></b>; 22 → 24, run зелёный",
    "Итог: node version в ci yml должен совпадать с версией node на вашей машине. Поменяли двадцать два на двадцать четыре, push, run зелёный. Поэтому в файле на восьмом экране двадцать четыре. Теперь посмотрим workflow, написанные AI: оба попали в эту ловушку."
   ]
  }
 },
 "18": {
  "kicker": "Этап 5 · AI",
  "title": "Продолжение нового навыка: двум AI один простой промпт — оба написали правильный на вид workflow; теперь читаем их, потом проверяем в конвейере",
  "seg": {
   "a": [
    "Снова этап AI: <b>workflow пишет AI, вы принимаете</b> — простой промпт, без подсказок",
    "Как и на уроках по Jest, последний этап — с AI. Промпт простой: напиши GitHub Actions workflow для этого проекта NestJS, пусть тесты запускаются при каждом push. Checkout, setup node, версия, tsc, build — ни одного из этих слов в промпте нет. Каждый AI работал в отдельной копии проекта."
   ],
   "b": [
    "Оба написали <b>правильный на вид файл</b>: checkout, setup-node, <code>npm ci</code>, <code>npm test</code>",
    "Оба написали файл, который выглядит правильно. Первый — test yml, двадцать две строки: checkout, setup node, npm ci, npm test, у каждого шага узбекское имя. Второй — ci yml, двадцать шесть строк, те же шаги, плюс permissions contents read, право только на чтение. Ошибки YAML нет."
   ],
   "c": [
    "Но в обоих <b><code>node-version: 22</code></b> — про вашу машину не спросили; и <b>нет ни <code>tsc</code>, ни <code>build</code></b>",
    "Но есть две вещи. Оба написали node version двадцать два: не спросили, какой Node на вашей машине, поставили привычное число. И в обоих нет ни tsc, ни build: промпт сказал «пусть запускаются тесты», AI сделал ровно это и ничего сверх."
   ],
   "d": [
    "Итог: <b>правильный на вид файл — ещё не проверка</b> — поставим его в конвейер",
    "Итог: workflow, который выглядит правильно, — ещё не проверка. Как зелёный тест в Jest: файл красивый, но не знает вашей машины и вашего проекта. Оба мы отправили push в тестовую ветку OrderBotNest. Результат на экране."
   ]
  }
 },
 "19": {
  "kicker": "Этап 5 · внутри",
  "title": "Оба workflow от AI в конвейере красные — npm ci, тот же Missing: webpack… from lock file; если исправить только node-version — зелёный, но ошибка типа всё равно проходит",
  "seg": {
   "a": [
    "Run 19 и 20: <b>оба красные, на шаге <code>npm ci</code></b> — та же ошибка с экрана 17",
    "Оба run красные, оба на шаге npm ci: missing webpack from lock file. Ловушка с семнадцатого экрана: node version двадцать два, npm десять, lock прочитан иначе. AI не мог этого знать: он не видит вашу машину."
   ],
   "b": [
    "Всего одно число: <b>22 → 24 — run 21 зелёный</b>, <code>npm ci</code> ✓, <code>npm test</code> ✓; имя шага всё ещё «Node.js 22»",
    "В файле первого AI поменяли всего одно число: node version двадцать четыре. Push: run зелёный, npm ci прошёл, npm test — двадцать пять passed. Имя шага всё ещё «установка Node js двадцать два»: работает не имя, а число. Одно число — и из красного в зелёный."
   ],
   "c": [
    "Но: <b>нет <code>tsc</code> — ошибка типа с экрана 15 в этом конвейере останется зелёной</b>; <code>build</code> тоже нет",
    "Но зелёный ещё не полный. В этом workflow нет tsc: если сделать push ошибки типа с пятнадцатого экрана, run останется зелёным, ложный зелёный. Build тоже нет: несобираемый код пройдёт зелёным. Промпт сказал «пусть запускаются тесты», AI сделал только это."
   ],
   "d": [
    "Итог: принимайте workflow от AI <b>по четырём вопросам</b>: checkout · <code>node-version</code> мой · <code>npm ci</code> · <code>tsc</code> и <code>build</code>",
    "Итог: принимайте workflow от AI по четырём вопросам. Есть ли checkout. Совпадает ли node version с моей машиной. Npm ci, а не install? Есть ли шаги tsc и build. Если на все четыре да — делайте push и смотрите run. Теперь проверим."
   ]
  }
 },
 "20": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "Workflow от AI: checkout@v4 · setup-node@v4 (node-version: 22) · npm install · npm test. На вашей машине Node 24. Что измените перед тем, как ставить в конвейер?",
  "q": "Вы видели workflow от AI, теперь проверим. Четвёртая проверка. В файле от AI есть checkout, setup node двадцать два, npm install и npm test. На вашей машине Node двадцать четыре. Что измените перед тем, как ставить в конвейер? Выберите вариант.",
  "ok": "Верно. Три вещи. Node version — двадцать четыре, как на вашей машине, иначе красный с семнадцатого экрана. Вместо npm install — npm ci: в конвейере доверяем lock. И шаги tsc и build: иначе ошибка типа и несобираемый код пройдут зелёными. Значит, файл от AI — точка старта, а четыре вопроса — ваши.",
  "okShort": "<code>node-version</code> = <code>node --version</code> · <code>npm ci</code> · шаги <code>tsc</code> + <code>build</code>. Checkout остаётся.",
  "hint": "Задайте этому файлу четыре вопроса с экрана 19: checkout? версия? ci? tsc/build?",
  "demak": "workflow от AI — точка старта: <code>node-version</code> мой · <code>npm ci</code> · <code>tsc</code> и <code>build</code> · <code>checkout</code> остаётся.",
  "opts": [
   "Ничего — checkout есть, остальное работает",
   "Только npm install → npm ci — версия не важна",
   "node-version 24, npm ci, шаги tsc и build",
   "Убрать checkout — setup-node сам принесёт"
  ],
  "wrong": {
   "0": "С node-version: 22 npm ci красный (экран 17); npm install в конвейере меняет lock.",
   "1": "Версия важна: npm на runner читает lock иначе — экран 17.",
   "3": "setup-node только ставит Node; код приносит checkout (экран 13)."
  }
 },
 "21": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Поручите своему AI написать workflow, исправьте по четырём вопросам, push — зелёный; потом push с ошибкой типа — пусть будет красным",
  "seg": {
   "a": [
    "Теперь вы: даёте AI <b>промпт с точными условиями</b> — workflow для OrderBotNest",
    "Теперь ваша очередь. Поручаете своему AI написать workflow для OrderBotNest, промпт копируете кнопкой ниже. Потом проверяете по четырём вопросам и делаете push в свой репозиторий. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: промпт и <b>четыре вопроса</b> — checkout · <code>node-version</code> мой · <code>npm ci</code> · <code>tsc</code> и <code>build</code>",
    "На первом шаге даёте промпт. На втором читаете файл по четырём вопросам: есть ли checkout, совпадает ли node version с числом на вашей машине, npm ci ли это, есть ли шаги tsc и build. Чего не хватает, добавьте вручную или попросите AI."
   ],
   "c": [
    "Шаги 3–4: <b>push — зелёный; push с ошибкой типа — <code>tsc</code> красный</b>, восстановление; подтверждение — имя шага красного run",
    "На третьем шаге push: run должен быть зелёным. На четвёртом убираете string в шестнадцатой строке user service ts и делаете push: run красный, на шаге tsc, test skipped. Восстановите и сделайте push — зелёный. В поле подтверждения напишите, какой шаг покраснел в красном run."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы приняли workflow от AI по четырём вопросам и сами видели, что конвейер ловит и ошибку типа."
   ]
  },
  "steps": [
   {
    "t": "Промпт",
    "exp": ".github/workflows/ci.yml",
    "cmds": [
     "промпт выше — своему AI (вместо <node --version raqamingiz> — ваше число)"
    ]
   },
   {
    "t": "Четыре вопроса",
    "exp": "4 ✓",
    "cmds": [
     "есть checkout@v4",
     null,
     "npm ci (не install)",
     "есть шаги npx tsc --noEmit и npm run build — если нет, добавьте"
    ]
   },
   {
    "t": "Push — зелёный",
    "exp": "run ✓ (checkout · setup-node · ci · tsc · test · build)"
   },
   {
    "t": "Ошибка типа — красный",
    "exp": "run ✗: npx tsc --noEmit ✗ · npm test skipped → потом run ✓",
    "cmds": [
     "src/api/user/user.service.ts, строка 16: String(from.id) → from.id",
     null,
     "потом git checkout -- src/api/user/user.service.ts, commit, push"
    ]
   }
  ],
  "proof": {
   "label": "Имя покрасневшего шага в красном run с шага 4",
   "placeholder": "например: npx tsc --noEmit",
   "wrong": "Откройте красный run: какой шаг красный? Напишите его имя (должен быть tsc)."
  },
  "trouble": [
   [
    "npm ci красный, Missing: … from lock file",
    "node-version не как на вашей машине — вопрос 2 (экран 17)"
   ],
   [
    "На шаге 4 run зелёный",
    "шага tsc нет или он после npm test — npx tsc --noEmit после npm ci, до npm test"
   ],
   [
    "Run красный, job нет (workflow file issue)",
    "сдвиг YAML — - uses и - run в одной колонке (экран 16)"
   ],
   [
    "AI написал npm install",
    "замените на npm ci (экран 14)"
   ]
  ]
 },
 "22": {
  "kicker": "Этап 6 · CD",
  "title": "Конвейер собрал dist — но node dist/main на чистой машине сразу падает: DATABASE_URL не найден. Отсюда начинается CD: secret, сервер, выпуск — следующие уроки",
  "seg": {
   "a": [
    "Конвейер собрал <code>dist</code> — <b><code>node dist/main</code> на чистой машине падает</b>: <code>DATABASE_URL topilmadi</code>",
    "CI закончен: папка dist готова. Теперь попробуем её запустить, на чистой машине: node dist main. Сразу ошибка: DATABASE URL не найден, запишите адрес Postgres в env. Локально у вас есть env-файл, в конвейере его нет, и не должно быть: пароль не попадает в commit."
   ],
   "b": [
    "CD: <b>выпуск проверенного пакета</b> — Delivery: кнопку нажимает человек; Deployment: конвейер сам",
    "Вот граница CD. Continuous Delivery: конвейер готовит пакет, человек нажимает кнопку «выпустить». Continuous Deployment: если зелёный, конвейер сам выпускает на сервер. Обоим нужны три вещи: секретные значения, сервер и команда выпуска."
   ],
   "c": [
    "Нужно: <b><code>DATABASE_URL</code> и <code>BOT_TOKEN</code> — GitHub Secrets</b>; сервер; команда выпуска",
    "Секретные значения хранятся в GitHub Secrets, ci yml берёт их по имени, значения никто не видит. Сервер — где работает бот. И команда выпуска. Каждое из этого — отдельная тема, не сегодняшний урок."
   ],
   "d": [
    "Итог: <b>сегодня CI полностью, граница CD ясна</b>; secrets и чтение run — на следующем уроке для менторов",
    "Итог: сегодня CI полностью: при каждом push четыре шага, зелёный или красный. Границу CD вы видели: пакет есть, но без секретных значений не работает. На следующем уроке для менторов глубже зайдём в GitHub Actions: чтение run, secrets, cache. А сейчас подготовка к классу."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m4c-01 · «CI/CD nima va nega kerak»",
  "title": "Урок ученика: багажная лента аэропорта — чемодан, Сборка, Сканер, Рамка размера, Упаковка, Вылет; рисованный вариант четырёх шагов, которые вы знаете",
  "seg": {
   "a": [
    "m4c-01 — 20 экранов: <b>лента аэропорта, пять точек</b>; ученик заполняет пропуски в <code>ci.yml</code>",
    "Теперь подготовка к классу. Урок ученика m4c-01, двадцать экранов. Метафора — лента аэропорта: чемодан — это код, пять точек: сборка, сканер, рамка размера, упаковка, вылет. Ученик заполняет три пропуска в ci yml, а на практике пишет ci yml в свой репозиторий."
   ],
   "b": [
    "Слова ученика: <b>Сборка — <code>npm install</code>, Сканер — <code>npm test</code>, стартовый сигнал — <code>on: push</code></b>",
    "Слова ученика: сборка — это npm install, сканер — npm test, рамка размера — eslint, упаковка — build, вылет — deploy. Стартовый сигнал — on push, маршрут — ci yml, машина ленты — runner. Красный свет, лента останавливается, — это код выхода. В классе говорите слово вместе с термином."
   ],
   "c": [
    "Вы добавляете: <b>строку <code>checkout</code> — в <code>ci.yml</code> ученика её нет</b>; причину <code>npm ci</code>; один настоящий run",
    "Что вы добавляете к уроку. В ci yml из урока ученика нет строки checkout: на практике скажите добавить одну строку, иначе его run покраснеет с ошибкой с тринадцатого экрана. Причину npm ci объясните одним предложением. И покажите на экране один настоящий run."
   ],
   "d": [
    "Итог: если ученик говорит «run нет» — <b>путь папки и push</b>; внизу три ситуации и вопросы",
    "Итог: если ученик говорит, что в Actions нет run, сначала проверьте путь файла и push. Если вышло «package json не найден» — checkout. Workflow file issue — YAML. Внизу три ситуации и готовые ответы на вопросы учеников."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "У вас npm test зелёный, у коллеги красный. Как это решает CI?",
    "e": "Чистая машина — для всех один ответ.",
    "o": [
     "Отправляет коллеге ваш node_modules",
     "При каждом push запускает одинаковые команды на чистой машине",
     "Переносит тесты на GitHub — локально npm test больше не работает",
     "Автоматически исправляет красный тест"
    ]
   },
   {
    "q": "В конвейере шаг tsc дал код выхода 2. Шаг npm test?",
    "e": "Не ноль — конвейер останавливается.",
    "o": [
     "Запустится — ошибка типа к тесту не относится",
     "Запустится, но результат не учтётся в статусе run",
     "«Skipped» — после первого красного шага не запускается",
     "Запустится, run станет жёлтым и будет ждать"
    ]
   },
   {
    "q": "В чистом clone npm test: sh: 1: jest: not found, код 127. Причина?",
    "e": "В конвейере первый шаг — npm ci.",
    "o": [
     "Нет node_modules — шаг установки не запускался",
     "Jest нет в package.json — надо добавить в devDependencies",
     "Старая версия Node — Jest новый",
     "Нет тестовых файлов — Jest не нашёл"
    ]
   },
   {
    "q": "В ci.yml нет строки actions/checkout. Что будет в конвейере?",
    "e": "Runner начинает с пустой папки.",
    "o": [
     "Ошибка YAML — GitHub не принимает файл",
     "setup-node сам принесёт код, зелёный",
     "npm ci красный — «нет lock», потому что папка пустая",
     "Run откроется, но ни один шаг не запустится"
    ]
   },
   {
    "q": "Вы вручную поменяли версию в package.json, lock старый. npm ci в конвейере?",
    "e": "npm ci — точно по lock; не совпадает — красный.",
    "o": [
     "Установит — package.json главнее",
     "Сам обновит lock и установит",
     "Красный — не «in sync», не совпадает",
     "Установит, но напишет предупреждение в терминал"
    ]
   },
   {
    "q": "Есть ошибка типа, в ci.yml нет шага tsc, тесты зелёные. Run?",
    "e": "Ложный зелёный — добавьте шаг tsc.",
    "o": [
     "Красный — npm test увидит ошибку типа и остановится",
     "Зелёный — конвейер не проверяет то, о чём не спросили",
     "Красный — setup-node проверяет типы",
     "Жёлтый — GitHub предупреждает и ждёт"
    ]
   },
   {
    "q": "Локально npm ci зелёный, в конвейере Missing: webpack… from lock file. Что сравните первым?",
    "e": "npm на runner другой — читает lock иначе.",
    "o": [
     "Строку webpack в package.json",
     "Размер lock-файла",
     "node-version и число из node --version",
     "Сравните результат npm test локально и в конвейере"
    ]
   },
   {
    "q": "Workflow от AI: checkout, node-version: 22, npm install, npm test. Чего не хватает?",
    "e": "Четыре вопроса: checkout · версия · ci · tsc/build.",
    "o": [
     "Ничего — четырёх шагов достаточно",
     "permissions — без них run не откроется",
     "Второй job — тесты и build в отдельных job",
     "Моя версия, npm ci, шаги tsc и build"
    ]
   }
  ]
 },
 "25": {
  "kicker": "Итог",
  "title": "Теперь вы знаете"
 }
};
// RS(k) — darsga xos ruscha (RU_S.k, ru/<dars>-sahna.js); yo'q bo'lsa null → t() o'zbekchani qoldiradi. wrRu — ovoz → «Matn» (RU_S.SPOKEN, keyin wr).
function RS(k) { return typeof RU_S !== 'undefined' && RU_S[k] != null ? RU_S[k] : null; }
function wrRu(s) { return wr((RS('SPOKEN') || []).reduce((a, [x, y]) => a.split(x).join(y), s)); }
function rsY(key, text) { return { key, text, show: wrRu(text) }; }
// Yakun segmentlari (ru-umumiy.py: sNNSegments → yakRu): umumiy a/z + RU_S.YAK (id bo'yicha)
function yakRu(passed, segs) {
  if (LANG !== 'ru') return segs;
  const Y = { a_pass: rsY('<b>Отлично!</b> Вы хорошо прошли урок — соберём сегодняшний урок одним взглядом', 'Отлично! Вы хорошо прошли урок. Теперь соберём всё, что узнали сегодня, одним взглядом.'), a_fail: rsY('Вы дошли до конца урока — советую <b>пройти тест заново</b>', 'Вы дошли до конца урока. В итоговом тесте нужно было шесть баллов, перед завершением советую пройти тест заново. А сейчас соберём сегодняшний урок одним взглядом.'), z: rsY('Спасибо! Нажмите кнопку <b>«Завершить урок»</b>', 'Спасибо. Нажмите кнопку «Завершить урок», урок будет отмечен как пройденный.'), ...Object.fromEntries(Object.entries(RS('YAK') || {}).map(([k, [key, text]]) => [k, rsY(key, text)])) };
  return segs.map((s) => ({ ...s, ...(Y[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) }));
}
(function ruMdtQo() {
  const segRu = (n) => { const r = RU_MDT[n] && RU_MDT[n].seg; if (!r) return undefined; const o = {}; Object.keys(r).forEach((id) => { const [key, text] = r[id]; o[id] = { ...(key != null ? { key } : {}), ...(text != null ? { text, show: wrRu(text) } : {}) }; }); return o; };
  const head = (n) => { const r = RU_MDT[n] || {}; const o = {}; ['kicker', 'eyebrow', 'title'].forEach((k) => { if (r[k] != null) o[k] = r[k]; }); const s = segRu(n); if (s) o.segments = s; return o; };
  const mdt = {}; Object.keys(RU_MDT).forEach((n) => { const r = { ...RU_MDT[n] }; if (r.seg) r.seg = MDT[n].seg.map(([id]) => (r.seg[id] ? [null, r.seg[id][0], r.seg[id][1]] : null)); mdt[n] = r; });
  ru(MDT, mdt);
  ru(S1, { ...head(1), ...((typeof RU_S !== 'undefined' && RU_S.S1) || {}) });
  ru(S2, { ...head(2), ...((typeof RU_S !== 'undefined' && RU_S.S2) || {}) });
  ru(S3, { ...head(3), ...((typeof RU_S !== 'undefined' && RU_S.S3) || {}) });
  ru(S4, { ...head(4), ...((typeof RU_S !== 'undefined' && RU_S.S4) || {}) });
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S8, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.S8) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S17, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.S17) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S19, { ...head(19), ...((typeof RU_S !== 'undefined' && RU_S.S19) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P7.S, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.P7_S) || {}) });
  ru(P7.steps, RU_MDT[7].steps);
  ru(P7.trouble, RU_MDT[7].trouble);
  ru(P7.proof, RU_MDT[7].proof);
  ru(P12.S, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.P12_S) || {}) });
  ru(P12.steps, RU_MDT[12].steps);
  ru(P12.trouble, RU_MDT[12].trouble);
  ru(P12.proof, RU_MDT[12].proof);
  ru(P21.S, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.P21_S) || {}) });
  ru(P21.steps, RU_MDT[21].steps);
  ru(P21.trouble, RU_MDT[21].trouble);
  ru(P21.proof, RU_MDT[21].proof);
  ru(FINAL, RU_MDT[24].final);
})();
