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
// `act` segmenti (F-1120-02): xuddi shunday kutadi, lekin bosiladigan narsa SAHNADA (masalan kodda yonib turgan so'z);
// sahna bosilganda answerAsk(seg.id, 0) chaqiradi, chap panelda act matni ko'rsatma bo'lib turadi.
// `review` (Orqaga bilan qaytilgan ekran, A12): ovoz yo'q, ekran yakuniy holatda; ↺ boshidan — ovoz bilan qayta
function useBeats(segments, review) {
  const segs = useMemo(() => review ? [] : segments.map((s, i) => ({ id: s.id, text: voice(s.text), trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: s.ask || s.act ? { type: 'button_click', target: 'step' } : s.waits_for })), [segments, review]);
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
    const k = segments.findIndex((s, i) => i >= beat && (s.ask || s.act));
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
    // F-1120-02: ovoz hali YUKLANAYOTGAN bo'lsa (status idle, lekin currentId — shu segment) qo'lda o'tilmaydi:
    // aks holda qadam oldinga ketadi, runtime esa shu segmentda tugmani kutib qoladi va dars ovozsiz qoladi
    else if (audio.muted || (audio.status === 'idle' && audio.currentId !== segId)) stepManual();
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
  const showManual = !review && (audio.muted || (!audio.isPlaying && !audio.waitingFor && beat < segments.length - 1 && audio.status === 'idle' && !now.ask && !now.act));
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
        {now.act && guess && guess[now.id] === undefined && !review && <p className="n1-acthint" dangerouslySetInnerHTML={html(now.act)} />}
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

// ============================================================
//  DARS RASMI — UMUMIY QISM (F-1120-02, 20.11; qonun M51, M52). Hamma mentor darsiga yig'iladi (dev/yig.sh).
//  Bu yerda: rasm uslubi (CSS, useCssN1 — darsning ildiz komponentida chaqiriladi), N1Fit (qat'iy o'lchamli
//  chizma sahna eniga moslashadi), useLate, useAct (M52: mentor o'zi bosib buzadi), N1Mini, Res.
//  Darsga xos rasm — o'z bo'lagida: Nest darslari — parts/02c-nest.jsx, boshqa dars — <dars>/parts/02b-*.jsx.
//  Ranglar dars ranglari (PART, T); yangi rang yo'q. CSS ichida backtick yo'q (CLAUDE.md).
// ============================================================
const CSS_N1 = `
.n1-fit{position:relative;width:100%;flex:0 0 auto}
.n1-box{position:absolute;top:0;transform-origin:0 0;font:13px/1.4 ${SANS};color:${T.ink}}
.n1-box *{box-sizing:border-box}
.n1-abs{position:absolute}
.n1-tagl{position:absolute;font:600 10.5px/1 ${MONO};letter-spacing:.12em;color:${T.ink3};text-transform:uppercase;white-space:nowrap}
.n1-st{transition:opacity .45s,box-shadow .45s,filter .45s,border-color .45s,background .45s}
.n1-st[data-st="g"]{opacity:.3;filter:grayscale(1)}
.n1-st[data-st="dim"]{opacity:.45}
.n1-st[data-st="off"]{opacity:0;pointer-events:none}
.n1-st[data-st="hl"]{box-shadow:0 0 0 4px rgba(226,69,31,.16),0 14px 30px rgba(15,17,21,.12)}

.n1-br{position:absolute;border-radius:12px;border:1.5px solid #C9CED8;background:${T.paper};overflow:hidden}
.n1-br .top{height:30px;background:#E9ECF1;display:flex;align-items:center;gap:5px;padding:0 9px}
.n1-br .top i{width:7px;height:7px;border-radius:50%;background:#B9BFCB;flex:none}
.n1-br .top span{margin-left:4px;flex:1;min-width:0;background:${T.paper};border-radius:9px;font:500 10px/1.6 ${MONO};padding:0 6px;color:${T.ink2};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.n1-br .bd{position:absolute;left:0;right:0;top:30px;bottom:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px}
.n1-br .wait{font-size:12.5px;color:${T.ink3}}
.n1-br .out{font:700 18px/1.25 ${SANS};color:${T.ink};animation:mk-up .4s ease both}
.n1-br .out.code{font:600 11px/1.5 ${MONO};text-align:left;color:${T.green};word-break:break-all;white-space:normal}
.n1-br .out.er{color:#DC2626}
.n1-cap{position:absolute;text-align:center;font-size:11.5px;color:${T.ink3};white-space:nowrap}

.n1-app{position:absolute;border-radius:18px;border:1.5px dashed #C9CED8;background:#FAFBFC}
.n1-mod{position:absolute;border:2px solid ${PART.mod};border-radius:12px;background:#FFFBF0}
.n1-mod .lg{position:absolute;left:12px;top:-9px;background:${T.paper};padding:0 6px;font:700 13px/16px ${SANS};color:${PART.mod};white-space:nowrap}
.n1-mod .lab{position:absolute;right:12px;top:-14px}
.n1-chip{position:absolute;font:500 12px/1.4 ${MONO};background:${T.paper};border:1px solid #E6D6A8;border-radius:7px;padding:4px 8px;white-space:nowrap;color:${T.ink};transition:box-shadow .4s,border-color .4s,opacity .4s}
.n1-chip.hot{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.18)}
.n1-link{position:absolute;width:2px;background:${PART.mod};opacity:0;transition:opacity .4s}
.n1-link.on{opacity:1}

.n1-part{position:absolute;border-radius:14px;background:${T.paper};border:2px solid var(--c);padding:13px 14px}
.n1-part .nm{font:700 16px/1.2 ${SANS};color:var(--c);display:flex;align-items:center;gap:8px;white-space:nowrap}
.n1-part .nm i{width:9px;height:9px;border-radius:3px;background:var(--c);flex:none}
.n1-part .role{font-size:13px;color:${T.ink2};margin-top:5px}
.n1-part .cd{display:inline-block;margin-top:10px;background:${T.code};color:${T.codeInk};font:500 12px/1.4 ${MONO};padding:6px 10px;border-radius:8px;white-space:nowrap}
.n1-part .fl{position:absolute;left:14px;bottom:10px;font:500 11px/1 ${MONO};color:${T.ink3};white-space:nowrap}
.n1-part .lab{position:absolute;right:10px;top:10px}
.n1-lab{display:inline-block;font:700 11.5px/1 ${SANS};color:${T.ink2};background:#F1F3F6;border:1px solid ${T.line};border-radius:999px;padding:5px 9px;white-space:nowrap;animation:mk-up .4s ease both}
.n1-sock{position:absolute;height:34px;border-radius:17px;border:1.5px dashed #A8AFBD;display:flex;align-items:center;justify-content:center;font:700 12.5px/1 ${MONO};color:${T.ink3};background:${T.paper};transition:all .4s}
.n1-sock.er{border:1.5px solid #DC2626;color:#DC2626;background:#FEF2F2}

.n1-exp{position:absolute;border-radius:10px;border:1px solid ${T.line};background:#F0F2F5;display:flex;align-items:center;gap:8px;padding:0 14px;font-size:12.5px;color:${T.ink2};white-space:nowrap;transition:all .45s}
.n1-exp b{color:${T.ink};font-weight:700}
.n1-exp[data-st="hl"]{background:#FFF0EB;border-color:${T.accent};box-shadow:0 0 0 4px rgba(226,69,31,.12)}
.n1-exp[data-st="hl"] b{color:${T.accent}}

.n1-stem{position:absolute;width:0;border-left:2px dotted #C9CED8}
.n1-lanes{position:absolute;border-radius:14px;background:${T.bg}}
.n1-ln{position:absolute;height:2px;background:#D5D9E1}
.n1-lf{position:absolute;height:2px;transition:width .9s cubic-bezier(.4,0,.2,1)}
.n1-lf.r{background:${T.accent}}.n1-lf.g{background:${T.green}}
.n1-stn{position:absolute;width:10px;height:10px;border-radius:50%;background:${T.paper};border:2px solid #B9BFCB;transform:translate(-50%,-50%)}
.n1-lbl{position:absolute;right:14px;font:600 11px/1 ${MONO};color:${T.ink3};white-space:nowrap;transform:translateY(-50%)}
.n1-pk{position:absolute;transform:translate(-50%,-50%);background:${T.accent};color:#fff;font:600 12px/1 ${MONO};padding:6px 11px;border-radius:14px;white-space:nowrap;box-shadow:0 6px 14px rgba(15,17,21,.22);transition:left .9s cubic-bezier(.4,0,.2,1),top .35s,background .3s,opacity .3s;z-index:3}
.n1-pk.grn{background:${T.green}}
.n1-pk.off{opacity:0}
.n1-pk.loop{transition:none;animation:n1-loop 5.2s linear infinite}
@keyframes n1-loop{0%{left:var(--xa);top:var(--y1);background:${T.accent}}44%{left:var(--xc);top:var(--y1);background:${T.accent}}50%{left:var(--xc);top:var(--y2);background:${T.green}}94%{left:var(--xa);top:var(--y2);background:${T.green}}100%{left:var(--xa);top:var(--y1);background:${T.accent}}}
.n1-ro{position:absolute;background:${T.code};border-radius:12px;display:flex;align-items:center;gap:14px;padding:0 16px;transition:opacity .35s;overflow:hidden}
.n1-ro .rf{font:500 11.5px/1 ${MONO};color:#8A90A2;white-space:nowrap}
.n1-ro code{font:500 13px/1.3 ${MONO};color:${T.codeInk};white-space:nowrap}
.n1-ro.off{opacity:0}
.n1-k{color:#C792EA}.n1-s{color:#9ECE6A}.n1-d{color:#E5C07B}.n1-c{color:#7AA2F7}.n1-ok{color:#86EFAC}.n1-er{color:#FCA5A5}

.n1-tok{position:absolute;height:38px;border-radius:19px;background:#E3F5EC;border:2px solid ${T.green};display:flex;align-items:center;justify-content:center;gap:7px;font:700 13px/1 ${SANS};color:${T.green};transform:translate(-50%,-50%);transition:left .9s cubic-bezier(.4,0,.2,1),top .9s cubic-bezier(.4,0,.2,1),opacity .35s,transform .35s;z-index:3;white-space:nowrap}
.n1-tok i{width:8px;height:8px;border-radius:50%;background:${T.green};flex:none}
.n1-tok.off{opacity:0;transform:translate(-50%,-50%) scale(.6)}
.n1-tok.twin{background:transparent;border-style:dashed;opacity:0;transition:opacity .4s;z-index:2}
.n1-tok.twin.on{opacity:.55}
.n1-tok.grey{background:#F3F4F7;border-color:#9AA1B1;color:${T.ink2}}
.n1-tok.grey i{background:#9AA1B1}
.n1-tok.yel{background:#FFFBF0;border-color:${PART.mod};color:${PART.mod};border-style:dashed}
.n1-tok.yel i{background:${PART.mod}}
.n1-box2{position:absolute;border-radius:14px;border:2px solid #9AA1B1;background:#F3F4F7}
.n1-box2 .bl{position:absolute;left:14px;top:12px;font:600 10.5px/1 ${MONO};letter-spacing:.12em;color:${T.ink2};white-space:nowrap}
.n1-box2 .sh{position:absolute;border-radius:19px;border:1.5px dashed #A8AFBD;display:flex;align-items:center;justify-content:center;font:500 11.5px/1 ${MONO};color:${T.ink3};transition:color .3s}
.n1-box2.has .sh{color:transparent}
.n1-box2 .nq{position:absolute;left:14px;right:14px;bottom:12px;font-size:11.5px;line-height:1.35;color:${T.ink2};opacity:0;transition:opacity .4s}
.n1-box2 .nq.on{opacity:1}
.n1-you{position:absolute;font:700 11.5px/1 ${SANS};color:#fff;background:${T.accent};border-radius:10px;padding:5px 9px;white-space:nowrap;opacity:0;transition:opacity .4s;z-index:4}
.n1-you.on{opacity:1}
.n1-ann{position:absolute;font:600 12px/1.3 ${SANS};color:${T.ink2};white-space:nowrap;opacity:0;transition:opacity .4s}
.n1-ann.on{opacity:1}
.n1-ann b{color:${T.accent}}
.n1-tayyor{color:${T.green};transition:opacity .4s}
.n1-line{position:absolute;height:38px;border-radius:9px;background:${T.code};color:${T.codeInk};font:500 12px/1 ${MONO};display:flex;align-items:center;padding:0 10px;white-space:nowrap}
.n1-prm{border-radius:4px;padding:1px 0;transition:background .4s,box-shadow .4s}
.n1-prm.hot{background:rgba(226,69,31,.3);box-shadow:0 0 0 2px rgba(226,69,31,.3)}
.n1-sock.wait{border-color:${T.accent};color:${T.accent};animation:n1-pulse 1.4s ease-in-out infinite}
@keyframes n1-pulse{50%{box-shadow:0 0 0 6px rgba(226,69,31,.14)}}
.n1-svg{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}
.n1-pth{stroke:#A8AFBD;stroke-width:2;stroke-dasharray:5 5;fill:none;opacity:0;transition:opacity .4s,stroke .4s}
.n1-pth.dash{opacity:1}
.n1-pth.solid{opacity:1;stroke:${T.green};stroke-dasharray:none}
.n1-pth.bad{opacity:1;stroke:#DC2626}
.n1-row{position:absolute;opacity:0;transition:opacity .45s;pointer-events:none}
.n1-row.on{opacity:1}
.n1-row.dim{opacity:.42}
.n1-srch{border:1px solid ${T.line};border-radius:12px;background:#F3F4F7}
.n1-fld{position:absolute;height:34px;border-radius:7px;border:1.5px solid ${T.blue};background:${T.paper};display:flex;align-items:center;gap:8px;padding:0 10px;font:500 13px/1 ${MONO}}
.n1-res{position:absolute;font:700 14px/1.3 ${SANS};color:${T.accent};white-space:nowrap}
.n1-res span{font-weight:500;color:${T.ink2};margin-left:8px}
.n1-exf{position:absolute;border-radius:12px;border:1px solid ${T.line};background:${T.paper};overflow:hidden}
.n1-exf .tb{height:24px;background:#E9ECF1;font:500 10.5px/24px ${MONO};color:${T.ink2};padding:0 10px}
.n1-exf .cl{position:absolute;left:10px;top:34px;font:500 11.5px/1.3 ${MONO};color:${T.ink};white-space:nowrap}
.n1-bn{position:absolute;border-radius:12px;border:1px solid ${T.line};background:${T.paper}}
.n1-bn svg{position:absolute;left:13px;top:12px}
.n1-bn .bt{position:absolute;left:14px;bottom:12px;font:700 13.5px/1.2 ${SANS};color:${T.ink}}

.n1-plan{position:absolute;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
.n1-plan div{border:1px solid ${T.line};border-radius:10px;background:${T.paper};padding:9px 10px;display:flex;flex-direction:column;gap:6px;transition:border-color .3s,box-shadow .3s,opacity .3s}
.n1-plan div.hl{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.12)}
.n1-plan div.dim{opacity:.45}
.n1-plan b{font:700 11.5px/1 ${MONO};color:${T.accent}}
.n1-plan span{font-size:11.5px;line-height:1.3;color:${T.ink}}

.n1-team{position:absolute;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 12px}
.n1-team h6{margin:0 0 6px;font:600 10.5px/1 ${MONO};letter-spacing:.12em;color:${T.ink3};text-transform:uppercase}
.n1-team div{font:500 12px/1.7 ${MONO};color:${T.ink2};white-space:nowrap}
.n1-team div i{display:inline-block;width:7px;height:7px;border-radius:2px;background:var(--c,${T.ink3});margin-right:7px}

.n1-shelf{position:absolute;border-radius:12px;border:1.5px solid ${T.line};background:${T.paper};transition:border-color .4s,box-shadow .4s,opacity .4s}
.n1-shelf .sl{position:absolute;left:12px;top:-9px;background:${T.paper};padding:0 6px;font:600 12px/16px ${MONO};color:${T.ink2};white-space:nowrap}
.n1-shelf.hl{border-color:${T.accent};box-shadow:0 0 0 4px rgba(226,69,31,.12)}
.n1-shelf.dim{opacity:.45}
.n1-shelf .emp{position:absolute;left:14px;top:14px;font:500 12px/1 ${MONO};color:${T.ink3}}
.n1-file{position:absolute;display:flex;align-items:center;gap:7px;font:500 12px/1 ${MONO};color:${T.ink};white-space:nowrap;padding:7px 10px;border-radius:8px;background:${T.paper};border:1px solid ${T.line}}
.n1-file i{width:8px;height:8px;border-radius:2px;background:var(--c);flex:none}
.n1-file.new{border-color:${T.accent};animation:mk-up .45s ease both}
.n1-ghost{position:absolute;display:flex;align-items:center;gap:7px;font:600 12px/1 ${SANS};color:#B91C1C;white-space:nowrap;padding:7px 10px;border-radius:8px;border:1.5px dashed #F2A9A9;background:#FEF2F2;animation:mk-up .45s ease both}
.n1-tree-ln{position:absolute;background:#C9CED8}

.n1-mini{position:absolute;border-radius:12px;border:1px solid ${T.line};background:#FAFBFC}
.n1-badge{position:absolute;height:24px;border-radius:7px;display:flex;align-items:center;padding:0 8px;font:600 11.5px/1 ${MONO};white-space:nowrap;transition:all .4s}
.n1-badge.ok{background:#FFF7E0;color:#8A5A00;border:1px solid #E6D6A8}
.n1-badge.gone{background:transparent;color:#DC2626;border:1.5px dashed #F2A9A9}
.n1-say{position:absolute;font:600 12px/1.3 ${SANS};white-space:nowrap;transition:opacity .4s}
.n1-say.er{color:#DC2626}.n1-say.ok{color:${T.green}}
.n1-res2{position:absolute;display:flex;flex-direction:column;gap:6px}
.n1-res2 div{font:500 11.5px/1 ${MONO};white-space:nowrap;padding:6px 9px;border-radius:7px;background:${T.code};color:${T.codeInk};transition:all .4s}
.n1-res2 b{font-weight:700}
.n1-arr{position:absolute;height:2px;background:${T.green};transition:background .4s}
.n1-arr::after{content:"";position:absolute;right:-1px;top:-4px;border-left:7px solid ${T.green};border-top:5px solid transparent;border-bottom:5px solid transparent;transition:border-color .4s}
.n1-arr.bad{background:repeating-linear-gradient(90deg,#DC2626 0 4px,transparent 4px 8px)}
.n1-arr.bad::after{border-left-color:#DC2626}
.n1-arr.off{opacity:.25}
.n1-pin{position:absolute;display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:${T.accent};color:#fff;font:700 11.5px/1 ${SANS};box-shadow:0 0 0 3px #fff;opacity:0;transition:opacity .35s;z-index:5}
.n1-pin.on{opacity:1}
.mk-ln.n1-p1>span:last-child::before,.mk-ln.n1-p2>span:last-child::before,.mk-ln.n1-p3>span:last-child::before{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:${T.accent};color:#fff;font:700 10.5px/1 ${SANS};margin-right:7px;vertical-align:1px}
.mk-ln.n1-p1>span:last-child::before{content:"1"}
.mk-ln.n1-p2>span:last-child::before{content:"2"}
.mk-ln.n1-p3>span:last-child::before{content:"3"}
.n1-act{cursor:pointer;border-radius:5px;padding:1px 3px;outline:2px solid #FF8A65;outline-offset:1px;animation:n1-blink 1.3s ease-in-out infinite}
.n1-act:hover{background:rgba(255,138,101,.22)}
@keyframes n1-blink{50%{outline-color:transparent}}
.n1-acthint{margin-top:16px;padding:12px 14px;border:1.5px solid ${T.accent};border-radius:12px;background:#FFF7F3;font-size:15px;line-height:1.45;color:${T.ink};animation:mk-up .4s ease both}
.n1-acthint b{color:${T.accent}}

.n1-kit .st{position:absolute;border-radius:12px;background:${T.paper};border:2px solid var(--c);padding:10px 10px 8px;display:flex;flex-direction:column;gap:6px;transition:opacity .4s,box-shadow .4s}
.n1-kit .st .w{font:700 14px/1.15 ${SANS};color:${T.ink}}
.n1-kit .st .a{font:600 12px/1 ${MONO};color:var(--c)}
.n1-kit .st .v{font-size:11.5px;line-height:1.3;color:${T.ink2}}
.n1-kit .st .f{font:500 10px/1.2 ${MONO};color:${T.ink3};word-break:break-all;opacity:0;transition:opacity .4s}
.n1-kit .st .f.on{opacity:1}
.n1-kit .st.hl{box-shadow:0 0 0 4px rgba(226,69,31,.16),0 14px 30px rgba(15,17,21,.12)}
.n1-kit .st.dim{opacity:.4}
.n1-kit .ar{position:absolute;height:2px;background:#B9BFCB}
.n1-kit .ar::after{content:"";position:absolute;right:-1px;top:-4px;border-left:7px solid #B9BFCB;border-top:5px solid transparent;border-bottom:5px solid transparent}
.n1-kit .no{position:absolute;font:600 11.5px/1.3 ${SANS};color:${T.accent};white-space:nowrap;opacity:0;transition:opacity .4s}
.n1-kit .no.on{opacity:1}

.mk-cover .card.n1-cv{max-width:1120px;padding:0;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);overflow:hidden}
.n1-cv .tx{padding:40px 30px 36px 40px;display:flex;flex-direction:column}
.n1-cv .af{margin:6px 0 10px;font:600 11.5px/1 ${MONO};letter-spacing:.12em;color:${T.ink3};text-transform:uppercase}
.n1-cv ul.ok{margin:0 0 22px;gap:10px}
.n1-cv ul.ok li{display:flex;gap:10px;color:${T.ink};font-size:15.5px;line-height:1.4}
.n1-cv ul.ok li::before{content:"✓";flex:none;width:21px;height:21px;border-radius:50%;background:#E3F5EC;color:${T.green};font:700 12px/21px ${SANS};text-align:center;margin:0}
.n1-cv .tx>.mk-btn{align-self:flex-start}
.n1-cv .meta{margin:auto 0 16px;font-size:13px;line-height:1.5;color:${T.ink3}}
.n1-cv .pic{background:${T.bg};border-left:1px solid ${T.line};display:flex;align-items:center;padding:24px 20px}
@media (max-width:900px){.mk-cover .card.n1-cv{grid-template-columns:1fr}.n1-cv .pic{border-left:0;border-top:1px solid ${T.line}}}
@media (prefers-reduced-motion:reduce){.n1-pk.loop,.n1-sock.wait,.n1-act{animation:none}.n1-box *{transition:none!important}}
`;
function useCssN1() {
  useEffect(() => {
    let s = document.getElementById('mk-css-n1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-n1'; document.head.appendChild(s); }
    if (s.textContent !== CSS_N1) s.textContent = CSS_N1;
  }, []);
}

// Qat'iy o'lchamli chizma (w×h) sahna eniga qarab kattalashadi (max gacha), markazda turadi
function N1Fit({ w, h, max = 1.25, children, style }) {
  const ref = useRef(null);
  const [W, setW] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const f = () => setW(el.clientWidth);
    f();
    if (typeof ResizeObserver === 'undefined') { window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  const k = W > 0 ? Math.min(max, W / w) : 1;
  return <div ref={ref} className="n1-fit" style={{ height: Math.round(h * k), ...(style || {}) }}>
    <div className="n1-box" style={{ width: w, height: h, left: Math.max(0, (W - w * k) / 2), transform: `scale(${k})`, visibility: W > 0 ? 'visible' : 'hidden' }}>{children}</div>
  </div>;
}

// Bir qadamdan keyin ms o'tdimi (paket ikkinchi yo'lakka o'tishi, brauzerga javob kelishi uchun)
function useLate(key, ms) {
  const [late, setLate] = useState(false);
  useEffect(() => { setLate(false); const id = setTimeout(() => setLate(true), ms); return () => clearTimeout(id); }, [key, ms]);
  return late;
}

// ---------- 23–26-ekran: «Buzamiz» — kichik rasm (VS Code oynasi ichida, kod va terminal orasida) ----------
// Mentor o'zi buzadi: kodda yonib turgan so'z (data-act) bosiladi → act segmenti tugaydi (dvigatel: answerAsk).
// hit — bosildimi; broken — buzilgan holat ko'rinadimi
function useAct(b, id = 'x') {
  const hit = !!(b.guess && b.guess[id] !== undefined);
  const onClick = (e) => { const el = e.target && e.target.closest ? e.target.closest('[data-act]') : null; if (el && !hit && b.answerAsk) b.answerAsk(id, 0); };
  return { hit, onClick };
}
// Balandlik 122 (ramka 8…118): 1280×720 da VS Code oynasiga kod + rasm + terminal sig'sin; kattalashish 1.1 gacha
const N1Mini = ({ h = 122, children }) => <div style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12, padding: '4px 8px', flex: '0 0 auto' }}><N1Fit w={520} h={h} max={1.1}>{children}</N1Fit></div>;
// code null — natija hali noma'lum (savol berilgan, javob keyingi qadamda): «?»
const Res = ({ rows, left = 404, top = 34 }) => <div className="n1-res2" style={{ left, top }}>{rows.map(([q, code, txt]) => <div key={q}>{q} → <b className={code == null ? '' : code >= 400 ? 'n1-er' : 'n1-ok'}>{code == null ? '?' : code}</b>{txt ? ' ' + txt : ''}</div>)}</div>;

// ============================================================
//  «BUYURTMA BOTI» XARITASI (F-1120-02, qonun M51) — OrderBot ipidagi 8 darsga umumiy rasm
//  (TgPg, Jest-1/2, CI/CD-1/2, WS-1/2, Webhook; dev/yig.sh). Joylashuv, rang va nomlar hamma darsda bir xil —
//  har dars faqat holatni o'zgartiradi va o'z qismini yoritadi.
//  Chapda mijoz telefoni (Telegram), o'rtada OrderBotNest serveri (telegram · catalog · user · cart · order),
//  o'ngda ma'lumot: Xotira (Map / massiv) va PostgreSQL (products · users · cart_items · orders).
//  Nomlar OrderBotNest kodidan: PRODUCTS[] (catalog.service.ts:7), users Map (user.service.ts:8),
//  carts Map (cart.service.ts:7), orders[] (order.service.ts:14) — teg tgpg-start.
//  Ranglar: dars ranglari (T) va OrderBot darslaridagi Telegram/PostgreSQL ranglari; CSS izohida backtick yo'q.
// ============================================================
const BM = { tg: '#5B8DB8', tgBg: '#DCE7F0', pg: '#336791', jest: '#99425B' }; // jest — Jest darslaridagi rang (JC.jest)
// [kalit, xotiradagi nomi, xotira izohi, jadval nomi, jadval izohi]
const BM_DATA = [
  ['products', 'PRODUCTS[]', 'catalog.service.ts', 'products', 'stock CHECK ≥ 0'],
  ['users', 'users Map', 'rol · telefon · state', 'users', 'telegram_id BIGINT'],
  ['carts', 'carts Map', 'cart.service.ts', 'cart_items', 'UNIQUE · ON CONFLICT'],
  ['orders', 'orders[]', 'order.service.ts', 'orders', '+ order_items'],
];
const BM_MODS = [['catalog', 236, 104], ['user', 348, 104], ['cart', 236, 146], ['order', 348, 146]];
// loc: { products|users|carts|orders: 'mem' | 'db' } (berilmasa — 'mem') · restart: xotira bo'shadi
// on: yonib turgan qismlar (modullar 'phone','telegram','catalog','user','cart','order'; ma'lumot 'products','users','carts','orders'; 'mem','db'); berilmasa hammasi oddiy
// chat: [mijoz, bot, 'ok'|'bad'] · clients: bir vaqtda nechta mijoz · tx: 'open'|'commit'|'rollback' (PostgreSQL ichida)
// note: { kalit: jadval ostidagi yozuv } · ops: { kalit: 'UPDATE' … } · badge: { kalit: raqam } (masalan bosqich)
// bad: { at: kalit, why } · ro: [fayl:satr, html] · tag · max
// jest: { name, cmd, files: [...], steps: [[nom, 'ok'|'bad'|'skip'|'']], res: 'pass'|'fail'|'?', txt, badge (o'z matni) } (name berilmasa — «Jest»; CI darslarida steps — lenta qadamlari) — server ostidagi qator (Jest darslari): test faqat funksiyani chaqiradi
// tgSub: telegram moduli yonidagi yozuv (berilmasa «Telegraf») · dbLabel: PostgreSQL qutisi nomi (CI'da — services konteyneri)
function BotMap({ loc = {}, restart, on, chat, clients = 1, tx, note = {}, ops = {}, badge = {}, bad, ro, tag, max, jest, tgSub, dbLabel }) {
  const W = 760, BOT = tx ? 318 : 300, H = BOT + (ro ? 54 : 4);
  const lit = (k) => !on || on.includes(k);
  const st = (k) => (bad && bad.at === k ? 'bad' : lit(k) ? (on ? 'hl' : '') : 'dim');
  const where = (k) => loc[k] || 'mem';
  const memItems = BM_DATA.filter((d) => where(d[0]) === 'mem');
  const dbItems = BM_DATA.filter((d) => where(d[0]) === 'db');
  const box = (k, x, y, w, h, color, inner, extra = {}) => {
    const s = st(k);
    return <div key={k} className="n1-abs n1-st" data-st={s === 'dim' ? 'dim' : undefined} style={{ left: x, top: y, width: w, height: h, borderRadius: 9, border: `2px solid ${s === 'bad' ? '#DC2626' : color}`, background: s === 'bad' ? '#FEF2F2' : T.paper, boxShadow: s === 'hl' ? '0 0 0 3px rgba(226,69,31,.14)' : 'none', padding: '5px 9px', overflow: 'hidden', ...extra }}>{inner}</div>;
  };
  const badgeEl = (k) => (badge[k] != null ? <span style={{ position: 'absolute', right: 6, top: 5, width: 18, height: 18, borderRadius: '50%', background: T.accent, color: '#fff', font: `700 11px/18px ${SANS}`, textAlign: 'center' }}>{badge[k]}</span> : null);
  const memChip = (d, i) => {
    const x = 506 + (i % 2) * 116, y = 54 + Math.floor(i / 2) * 32;
    return box(d[0], x, y, 110, 28, restart ? '#F2A9A9' : T.yellow, <>
      <div style={{ font: `700 11px/1.5 ${MONO}`, color: restart ? '#B91C1C' : T.ink, whiteSpace: 'nowrap', textDecoration: restart ? 'line-through' : 'none' }}>{d[1]}</div>{badgeEl(d[0])}
    </>, { padding: '2px 8px', borderStyle: restart ? 'dashed' : 'solid' });
  };
  // jadval — PostgreSQL ichida to'liq enli qator: nomi, amal (UPDATE/INSERT/DELETE), izoh
  const dbChip = (d, i) => box(d[0], 506, 152 + i * 35, 222, 32, BM.pg, <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 20, whiteSpace: 'nowrap' }}>
    <span style={{ font: `700 11.5px ${MONO}`, color: BM.pg }}>{d[3]}</span>
    {ops[d[0]] ? <span style={{ font: `700 9.5px/1.4 ${MONO}`, color: '#fff', background: ops[d[0]] === 'DELETE' ? T.yellow : ops[d[0]] === 'INSERT' ? T.green : T.accent, borderRadius: 4, padding: '0 4px' }}>{ops[d[0]]}</span> : null}
    <span style={{ marginLeft: 'auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', font: `500 10px ${MONO}`, color: T.ink2, paddingRight: badge[d[0]] != null ? 18 : 0 }}>{note[d[0]] || d[4]}</span>{badgeEl(d[0])}
  </div>, { padding: '4px 8px' });
  const memLit = memItems.some((d) => lit(d[0])) && memItems.length > 0;
  const dbLit = dbItems.some((d) => lit(d[0])) && dbItems.length > 0;
  const txC = tx === 'rollback' ? '#DC2626' : tx === 'commit' ? T.green : T.accent;
  return <N1Fit w={W} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 4 }}>{tag}</span>}
    {/* telefon — Telegram */}
    {clients > 1 && [2, 1].map((k) => <div key={k} className="n1-abs" style={{ left: 20 + k * 6, top: 40 - k * 6, width: 176, height: 196, borderRadius: 14, border: `1.5px solid ${T.line}`, background: T.paper }} />)}
    <div className="n1-abs n1-st" data-st={st('phone') === 'dim' ? 'dim' : undefined} style={{ left: 20, top: 40, width: 176, height: 196, borderRadius: 14, border: `2px solid ${st('phone') === 'hl' ? BM.tg : T.line}`, background: BM.tgBg, overflow: 'hidden' }}>
      <div style={{ height: 30, background: BM.tg, color: '#fff', font: `700 12px/30px ${SANS}`, padding: '0 10px', whiteSpace: 'nowrap' }}>Telegram · OrderBot</div>
      {chat && <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {chat[0] && <div style={{ alignSelf: 'flex-end', maxWidth: 150, background: '#EFFDDE', borderRadius: '10px 10px 2px 10px', padding: '4px 8px', font: `500 10.5px/1.35 ${SANS}`, color: T.ink, overflowWrap: 'anywhere' }}>{chat[0]}</div>}
        {chat[1] && <div style={{ alignSelf: 'flex-start', maxWidth: 160, background: T.paper, border: `1.5px solid ${chat[2] === 'bad' ? '#F2A9A9' : chat[2] === 'ok' ? '#BFE3D0' : 'transparent'}`, borderRadius: '10px 10px 10px 2px', padding: '4px 8px', font: `500 10.5px/1.35 ${SANS}`, color: chat[2] === 'bad' ? '#B91C1C' : T.ink, overflowWrap: 'anywhere', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{chat[1]}</div>}
      </div>}
    </div>
    {clients > 1 && <span className="n1-abs" style={{ left: 120, top: 18, background: T.accent, color: '#fff', font: `700 11px/1 ${SANS}`, borderRadius: 9, padding: '4px 8px', whiteSpace: 'nowrap' }}>×{clients} {t('mijoz', 'клиентов')}</span>}
    {/* server */}
    <div className="n1-app" style={{ left: 222, top: 30, width: 246, height: 206 }} />
    <span className="n1-tagl" style={{ left: 236, top: 40 }}>OrderBotNest · NestJS</span>
    {box('telegram', 236, 58, 218, 34, BM.tg, <div style={{ font: `600 11.5px/20px ${MONO}`, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>telegram <span style={{ color: T.ink3 }}>· {tgSub || 'Telegraf'}</span></div>)}
    {BM_MODS.map(([k, x, y]) => box(k, x, y, 106, 34, T.green, <div style={{ font: `600 11.5px/20px ${MONO}`, color: T.ink, whiteSpace: 'nowrap' }}>{k}</div>))}
    <span className="n1-abs" style={{ left: 236, top: 194, font: `500 10.5px/1.35 ${SANS}`, color: T.ink3, width: 218 }}>{t("bot.on / action → servis → ma'lumot", 'bot.on / action → сервис → данные')}</span>
    {/* xotira */}
    <div className="n1-abs n1-st" data-st={st('mem') === 'dim' ? 'dim' : undefined} style={{ left: 494, top: 30, width: 246, height: 98, borderRadius: 14, border: `2px ${restart ? 'dashed' : 'solid'} ${restart ? '#F2A9A9' : T.yellow}`, background: restart ? '#FEF2F2' : '#FFFBF0' }} />
    <span className="n1-abs" style={{ left: 506, top: 21, background: T.paper, padding: '0 6px', font: `700 12px/16px ${SANS}`, color: restart ? '#B91C1C' : T.yellow, whiteSpace: 'nowrap' }}>{restart ? t("Xotira — restart: bo'shadi", 'Память — перезапуск: пусто') : t('Xotira (RAM) · Map, massiv', 'Память (RAM) · Map, массив')}</span>
    {memItems.map(memChip)}
    {memItems.length === 0 && <span className="n1-abs" style={{ left: 506, top: 66, font: `500 11px ${SANS}`, color: T.ink3 }}>{t("bo'sh — hammasi bazada", 'пусто — всё в базе')}</span>}
    {/* PostgreSQL */}
    <div className="n1-abs n1-st" data-st={st('db') === 'dim' ? 'dim' : undefined} style={{ left: 494, top: 140, width: 246, height: 156, borderRadius: 14, border: `2px solid ${BM.pg}`, background: '#F7FAFC' }} />
    <span className="n1-abs" style={{ left: 506, top: 131, background: T.paper, padding: '0 6px', font: `700 12px/16px ${SANS}`, color: BM.pg, whiteSpace: 'nowrap' }}>{dbLabel || 'PostgreSQL · shop'}</span>
    {dbItems.map(dbChip)}
    {dbItems.length === 0 && <span className="n1-abs" style={{ left: 506, top: 168, font: `500 11px ${SANS}`, color: T.ink3, width: 220 }}>{t("hali jadval yo'q — ma'lumot xotirada", 'таблиц ещё нет — данные в памяти')}</span>}
    {tx && <>
      <div className="n1-abs" style={{ left: 500, top: 146, width: 234, height: 146, borderRadius: 10, border: `2px dashed ${txC}` }} />
      <span className="n1-abs" style={{ left: 506, top: 300, font: `700 10.5px/1 ${MONO}`, color: txC, whiteSpace: 'nowrap' }}>{tx === 'rollback' ? 'START TRANSACTION … ROLLBACK' : tx === 'commit' ? 'START TRANSACTION … COMMIT' : 'START TRANSACTION …'}</span>
    </>}
    {jest && <>
      <div className="n1-abs" style={{ left: 20, top: 250, width: 448, height: 46, borderRadius: 12, border: `2px solid ${BM.jest}`, background: T.paper, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <b style={{ font: `700 13px ${SANS}`, color: BM.jest, flex: 'none' }}>{jest.name || 'Jest'}</b>
        {!jest.steps && (jest.files || []).length < 2 && <span style={{ font: `500 10.5px ${MONO}`, color: T.ink3, flex: 'none' }}>{jest.cmd || 'npm test'}</span>}
        {(jest.steps || []).map(([n, st], i) => <span key={'s' + i} style={{ font: `600 10px/1 ${MONO}`, color: st === 'bad' ? '#B91C1C' : st === 'skip' ? T.ink3 : T.ink, background: st === 'bad' ? '#FEF2F2' : st === 'ok' ? '#E3F5EC' : T.paper, border: `1px ${st === 'skip' ? 'dashed' : 'solid'} ${st === 'bad' ? '#F2A9A9' : st === 'ok' ? '#BFE3D0' : T.line}`, borderRadius: 6, padding: '4px 5px', whiteSpace: 'nowrap', flex: 'none' }}>{st === 'ok' ? '✓ ' : st === 'bad' ? '✕ ' : ''}{n}</span>)}
        {(jest.files || []).map((f) => <span key={f} style={{ font: `600 10px/1 ${MONO}`, color: T.ink, background: '#F6F7F9', border: `1px solid ${T.line}`, borderRadius: 6, padding: '4px 6px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f}</span>)}
        <span style={{ marginLeft: 'auto', flex: 'none', font: `700 11px/1 ${MONO}`, color: '#fff', background: jest.res === 'pass' ? T.green : jest.res === 'fail' ? '#DC2626' : T.ink3, borderRadius: 6, padding: '5px 7px' }}>{jest.badge || ((jest.res === 'pass' ? 'PASS' : jest.res === 'fail' ? 'FAIL' : '?') + (jest.txt ? ' · ' + jest.txt : ''))}</span>
      </div>
      <svg className="n1-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}><path d="M345 250 L 345 240" fill="none" stroke={BM.jest} strokeWidth="2" strokeDasharray="3 3" /></svg>
    </>}
    {bad && bad.why && <span className="n1-abs" style={{ left: 236, top: 246, font: `700 11px/1.3 ${SANS}`, color: '#B91C1C', width: 240 }}>✕ {bad.why}</span>}
    {/* yo'llar */}
    <svg className="n1-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <marker id="bmr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.accent} /></marker>
        <marker id="bmk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#B9BFCB" /></marker>
      </defs>
      <path d="M196 120 L 218 120" fill="none" stroke={lit('phone') || lit('telegram') ? T.accent : '#B9BFCB'} strokeWidth="2" markerEnd={`url(#${lit('phone') || lit('telegram') ? 'bmr' : 'bmk'})`} />
      <path d="M468 80 L 490 80" fill="none" stroke={memLit && !restart ? T.yellow : '#D5D9E1'} strokeWidth="2" strokeDasharray={memItems.length ? '0' : '5 4'} />
      <path d="M468 200 L 490 200" fill="none" stroke={dbLit ? BM.pg : '#D5D9E1'} strokeWidth="2" strokeDasharray={dbItems.length ? '0' : '5 4'} />
    </svg>
    {ro && <div className="n1-ro" style={{ left: 20, top: BOT + 8, width: 720, height: 42 }}><span className="rf">{ro[0]}</span><code style={{ fontSize: ro[1].replace(/<[^>]+>/g, '').length > 72 ? 11.5 : 13, background: 'transparent', color: T.codeInk, padding: 0, border: 0 }} dangerouslySetInnerHTML={html(ro[1])} /></div>}
  </N1Fit>;
}

// «Buzamiz» kichik rasmi (M52) — umumiy shakl: 3 ta quti strelka bilan va natija satri; OrderBot darslarida N1Mini ichida.
// boxes: [[nom, izoh, holat ('' | 'bad' | 'ok')], …3] · res: [matn, holat] (matn '?' — natija hali aytilmagan, M52-3) · pins: { qutiIndeksi: raqam }
function FlowMini({ tag, boxes, res, pins = {} }) {
  const X = [8, 178, 348], Wd = [154, 154, 164];
  return <>
    {tag && <span className="n1-tagl" style={{ left: 8, top: 12 }}>{tag}</span>}
    {boxes.map(([label, sub, st], i) => <div key={i} className="n1-abs" style={{ left: X[i], top: 34, width: Wd[i], height: 50, borderRadius: 10, border: `2px solid ${st === 'bad' ? '#DC2626' : st === 'ok' ? T.green : T.line}`, background: st === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s', overflow: 'hidden' }}>
      <div style={{ font: `700 11.5px ${MONO}`, color: st === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ font: `500 10.5px ${MONO}`, color: st === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 3 }}>{sub}</div>
    </div>)}
    {[162, 332].map((x) => <div key={x} className="n1-arr" style={{ left: x + 1, top: 58, width: 14 }} />)}
    {res && <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: res[0] === '?' ? T.ink3 : res[1] === 'bad' ? '#DC2626' : res[1] === 'ok' ? T.green : T.ink2 }}>{res[0]}</span>}
    {Object.keys(pins).map((i) => <span key={i} className="n1-pin on" style={{ left: X[i] + Wd[i] - 10, top: 26 }}>{pins[i]}</span>)}
  </>;
}

// AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-kod.py — OrderBotNest teglari, yml variantlari, chiqishlar va haqiqiy GitHub Actions run'lari (qo'lda tahrirlanmaydi)
const KOD_CI_START = {
 "file": ".github/workflows/ci.yml",
 "tag": "cicd2-start",
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
const KOD_CI_DONE = {
 "file": ".github/workflows/ci.yml",
 "tag": "cicd2-done",
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
  },
  {
   "t": "  smoke:",
   "n": 16
  },
  {
   "t": "    needs: test",
   "n": 17
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 18
  },
  {
   "t": "    services:",
   "n": 19
  },
  {
   "t": "      postgres:",
   "n": 20
  },
  {
   "t": "        image: postgres:18",
   "n": 21
  },
  {
   "t": "        env:",
   "n": 22
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 23
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 24
  },
  {
   "t": "        ports:",
   "n": 25
  },
  {
   "t": "          - 5432:5432",
   "n": 26
  },
  {
   "t": "        options: >-",
   "n": 27
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 28
  },
  {
   "t": "          --health-interval 5s",
   "n": 29
  },
  {
   "t": "          --health-timeout 5s",
   "n": 30
  },
  {
   "t": "          --health-retries 10",
   "n": 31
  },
  {
   "t": "    steps:",
   "n": 32
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 33
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 34
  },
  {
   "t": "        with:",
   "n": 35
  },
  {
   "t": "          node-version: 24",
   "n": 36
  },
  {
   "t": "          cache: npm",
   "n": 37
  },
  {
   "t": "      - run: npm ci",
   "n": 38
  },
  {
   "t": "      - run: npm run smoke",
   "n": 39
  },
  {
   "t": "        env:",
   "n": 40
  },
  {
   "t": "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop  # konteyner paroli — sir emas, job bilan birga o'chadi",
   "n": 41
  }
 ]
};
const KOD_README_BADGE = {
 "file": "README.md",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "[![CI](https://github.com/Azizbekcrypto/OrderBotNest/actions/workflows/ci.yml/badge.svg)](https://github.com/Azizbekcrypto/OrderBotNest/actions/workflows/ci.yml)",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "# OrderBotNest — CoddyCamp do'koni boti",
   "n": 3
  }
 ]
};
const KOD_SMOKE_URL = {
 "file": "scripts/smoke.js",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "}",
   "n": 58
  },
  {
   "t": "const baseUrl = process.env.SMOKE_DB_URL || process.env.DATABASE_URL || '';",
   "n": 59
  },
  {
   "t": "const hasDb = Boolean(pg && baseUrl);",
   "n": 60
  }
 ]
};
const KOD_SMOKE_DB = {
 "file": "scripts/smoke.js",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "  const db = `${u.pathname.slice(1) || 'shop'}_smoke`;",
   "n": 94
  },
  {
   "t": "  await adminQuery(`DROP DATABASE IF EXISTS \"${db}\"`);",
   "n": 95
  },
  {
   "t": "  await adminQuery(`CREATE DATABASE \"${db}\" TEMPLATE template0`);",
   "n": 96
  }
 ]
};
const KOD_PKG_SMOKE = {
 "file": "package.json",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "    \"migration:revert\": \"typeorm-ts-node-commonjs migration:revert -d src/infrastructure/data-source.ts\",",
   "n": 17
  },
  {
   "t": "    \"migration:generate\": \"typeorm-ts-node-commonjs migration:generate -d src/infrastructure/data-source.ts src/infrastructure/migrations/auto\",",
   "n": 18
  },
  {
   "t": "    \"smoke\": \"node scripts/smoke.js\"",
   "n": 19
  }
 ]
};
const KOD_YML_1_MATRIX = {
 "file": ".github/workflows/ci.yml",
 "tag": "1-matrix.yml",
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
   "t": "    strategy:",
   "n": 6
  },
  {
   "t": "      matrix:",
   "n": 7
  },
  {
   "t": "        node-version: [22, 24]",
   "n": 8
  },
  {
   "t": "    steps:",
   "n": 9
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 10
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 11
  },
  {
   "t": "        with:",
   "n": 12
  },
  {
   "t": "          node-version: ${{ matrix.node-version }}",
   "n": 13
  },
  {
   "t": "          cache: npm",
   "n": 14
  },
  {
   "t": "      - run: npm ci",
   "n": 15
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 16
  },
  {
   "t": "      - run: npm test",
   "n": 17
  },
  {
   "t": "      - run: npm run build",
   "n": 18
  }
 ]
};
const KOD_YML_2_MATRIX_FAIL_FAST_FALSE = {
 "file": ".github/workflows/ci.yml",
 "tag": "2-matrix-fail-fast-false.yml",
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
   "t": "    strategy:",
   "n": 6
  },
  {
   "t": "      fail-fast: false",
   "n": 7
  },
  {
   "t": "      matrix:",
   "n": 8
  },
  {
   "t": "        node-version: [22, 24]",
   "n": 9
  },
  {
   "t": "    steps:",
   "n": 10
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 11
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 12
  },
  {
   "t": "        with:",
   "n": 13
  },
  {
   "t": "          node-version: ${{ matrix.node-version }}",
   "n": 14
  },
  {
   "t": "          cache: npm",
   "n": 15
  },
  {
   "t": "      - run: npm ci",
   "n": 16
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 17
  },
  {
   "t": "      - run: npm test",
   "n": 18
  },
  {
   "t": "      - run: npm run build",
   "n": 19
  }
 ]
};
const KOD_YML_3_SMOKE_SERVICES = {
 "file": ".github/workflows/ci.yml",
 "tag": "3-smoke-services.yml",
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
  },
  {
   "t": "  smoke:",
   "n": 16
  },
  {
   "t": "    needs: test",
   "n": 17
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 18
  },
  {
   "t": "    services:",
   "n": 19
  },
  {
   "t": "      postgres:",
   "n": 20
  },
  {
   "t": "        image: postgres:18",
   "n": 21
  },
  {
   "t": "        env:",
   "n": 22
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 23
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 24
  },
  {
   "t": "        ports:",
   "n": 25
  },
  {
   "t": "          - 5432:5432",
   "n": 26
  },
  {
   "t": "        options: >-",
   "n": 27
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 28
  },
  {
   "t": "          --health-interval 5s",
   "n": 29
  },
  {
   "t": "          --health-timeout 5s",
   "n": 30
  },
  {
   "t": "          --health-retries 10",
   "n": 31
  },
  {
   "t": "    steps:",
   "n": 32
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 33
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 34
  },
  {
   "t": "        with:",
   "n": 35
  },
  {
   "t": "          node-version: 24",
   "n": 36
  },
  {
   "t": "          cache: npm",
   "n": 37
  },
  {
   "t": "      - run: npm ci",
   "n": 38
  },
  {
   "t": "      - run: npm run smoke",
   "n": 39
  },
  {
   "t": "        env:",
   "n": 40
  },
  {
   "t": "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop  # konteyner paroli — sir emas, job bilan birga o'chadi",
   "n": 41
  }
 ]
};
const KOD_YML_4_SMOKE_SECRET_XATO = {
 "file": ".github/workflows/ci.yml",
 "tag": "4-smoke-secret-xato.yml",
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
  },
  {
   "t": "  smoke:",
   "n": 16
  },
  {
   "t": "    needs: test",
   "n": 17
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 18
  },
  {
   "t": "    services:",
   "n": 19
  },
  {
   "t": "      postgres:",
   "n": 20
  },
  {
   "t": "        image: postgres:18",
   "n": 21
  },
  {
   "t": "        env:",
   "n": 22
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 23
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 24
  },
  {
   "t": "        ports:",
   "n": 25
  },
  {
   "t": "          - 5432:5432",
   "n": 26
  },
  {
   "t": "        options: >-",
   "n": 27
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 28
  },
  {
   "t": "          --health-interval 5s",
   "n": 29
  },
  {
   "t": "          --health-timeout 5s",
   "n": 30
  },
  {
   "t": "          --health-retries 10",
   "n": 31
  },
  {
   "t": "    steps:",
   "n": 32
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 33
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 34
  },
  {
   "t": "        with:",
   "n": 35
  },
  {
   "t": "          node-version: 24",
   "n": 36
  },
  {
   "t": "          cache: npm",
   "n": 37
  },
  {
   "t": "      - run: npm ci",
   "n": 38
  },
  {
   "t": "      - run: npm run smoke",
   "n": 39
  },
  {
   "t": "        env:",
   "n": 40
  },
  {
   "t": "          DATABASE_URL: ${{ secrets.DATABSE_URL }}",
   "n": 41
  }
 ]
};
const KOD_YML_5_SECRET_ECHO = {
 "file": ".github/workflows/ci.yml",
 "tag": "5-secret-echo.yml",
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
   "t": "  secret:",
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
   "t": "      - run: echo \"DATABASE_URL=${{ secrets.DATABASE_URL }}\"",
   "n": 7
  },
  {
   "t": "      - run: echo \"${{ secrets.DATABASE_URL }}\" | wc -c",
   "n": 8
  },
  {
   "t": "      - run: echo \"YO'Q=${{ secrets.DATABSE_URL }}\"",
   "n": 9
  }
 ]
};
const KOD_YML_AI1 = {
 "file": ".github/workflows/ci.yml",
 "tag": "ai1",
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
   "t": "    # smoke uchun PostgreSQL: runner yonida vaqtinchalik konteyner, job tugashi bilan o'chadi",
   "n": 6
  },
  {
   "t": "    services:",
   "n": 7
  },
  {
   "t": "      postgres:",
   "n": 8
  },
  {
   "t": "        image: postgres:18",
   "n": 9
  },
  {
   "t": "        env:",
   "n": 10
  },
  {
   "t": "          POSTGRES_USER: postgres",
   "n": 11
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 12
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 13
  },
  {
   "t": "        ports:",
   "n": 14
  },
  {
   "t": "          - 5432:5432",
   "n": 15
  },
  {
   "t": "        options: >-",
   "n": 16
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 17
  },
  {
   "t": "          --health-interval 5s",
   "n": 18
  },
  {
   "t": "          --health-timeout 5s",
   "n": 19
  },
  {
   "t": "          --health-retries 10",
   "n": 20
  },
  {
   "t": "    steps:",
   "n": 21
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 22
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 23
  },
  {
   "t": "        with:",
   "n": 24
  },
  {
   "t": "          node-version: 24",
   "n": 25
  },
  {
   "t": "          cache: npm",
   "n": 26
  },
  {
   "t": "      - run: npm ci",
   "n": 27
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 28
  },
  {
   "t": "      - run: npm test",
   "n": 29
  },
  {
   "t": "      - run: npm run build",
   "n": 30
  },
  {
   "t": "      # Telegram'siz tekshiruv: restart + race. Smoke o'zi shop_smoke bazasini ochadi va oxirida o'chiradi;",
   "n": 31
  },
  {
   "t": "      # BOT_TOKEN va ADMIN_TELEGRAM_IDS ni smoke o'zi qo'yadi, Telegram'ga so'rov ketmaydi",
   "n": 32
  },
  {
   "t": "      - run: npm run smoke",
   "n": 33
  },
  {
   "t": "        env:",
   "n": 34
  },
  {
   "t": "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop",
   "n": 35
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
   "t": "    services:",
   "n": 6
  },
  {
   "t": "      postgres:",
   "n": 7
  },
  {
   "t": "        image: postgres:18",
   "n": 8
  },
  {
   "t": "        env:",
   "n": 9
  },
  {
   "t": "          POSTGRES_USER: postgres",
   "n": 10
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 11
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 12
  },
  {
   "t": "        ports:",
   "n": 13
  },
  {
   "t": "          - 5432:5432",
   "n": 14
  },
  {
   "t": "        options: >-",
   "n": 15
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 16
  },
  {
   "t": "          --health-interval 5s",
   "n": 17
  },
  {
   "t": "          --health-timeout 5s",
   "n": 18
  },
  {
   "t": "          --health-retries 10",
   "n": 19
  },
  {
   "t": "    env:",
   "n": 20
  },
  {
   "t": "      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop",
   "n": 21
  },
  {
   "t": "    steps:",
   "n": 22
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 23
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 24
  },
  {
   "t": "        with:",
   "n": 25
  },
  {
   "t": "          node-version: 24",
   "n": 26
  },
  {
   "t": "          cache: npm",
   "n": 27
  },
  {
   "t": "      - run: npm ci",
   "n": 28
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 29
  },
  {
   "t": "      - run: npm test",
   "n": 30
  },
  {
   "t": "      - run: npm run build",
   "n": 31
  },
  {
   "t": "      - run: npm run smoke",
   "n": 32
  }
 ]
};
const KOD_OUT_00 = "$ gh secret list -R Azizbekcrypto/OrderBotNest\n\n# bor=0 · qiymat (foydalanuvchi yaratsa): postgresql://postgres:postgres@localhost:5432/shop";
const KOD_OUT_09 = "v24.18.0\n11.16.0\ngh version 2.100.0 (2026-09-03)\nWed Nov  4 07:13:33 PM +05 2026\nAzizbekcrypto";
const KOD_OUT_V1_01 = "$ cat package.json\n{\n  \"name\": \"ci-mashq\",\n  \"version\": \"1.0.0\",\n  \"scripts\": { \"test\": \"echo ok && exit 0\" }\n}";
const KOD_OUT_V1_02 = "$ npm ci\nnpm error code EUSAGE\nnpm error\nnpm error The `npm ci` command can only install with an existing package-lock.json or\nnpm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or\nnpm error later to generate a package-lock.json file, then try again.\nnpm error\nnpm error Clean install a project\nnpm error\nnpm error Usage:\nnpm error npm ci\nnpm error\nnpm error Options:\nnpm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]\nnpm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]\nnpm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]\nnpm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]\nnpm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]\nnpm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]\nnpm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]\nnpm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]\nnpm error [--no-bin-links] [--no-fund] [--dry-run]\nnpm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]\nnpm error [--workspaces] [--include-workspace-root] [--install-links]\nnpm error\nnpm error   --install-strategy\nnpm error     Sets the strategy for installing packages in node_modules.\nnpm error\nnpm error   --legacy-bundling\nnpm error     Instead of hoisting package installs in `node_modules`, install packages\nnpm error\nnpm error   --global-style\nnpm error     Only install direct dependencies in the top level `node_modules`,\nnpm error\nnpm error   --omit\nnpm error     Dependency types to omit from the installation tree on disk.\nnpm error\nnpm error   --include\nnpm error     Option that allows for defining which types of dependencies to install.\nnpm error\nnpm error   --strict-peer-deps\nnpm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_\nnpm error\nnpm error   --foreground-scripts\nnpm error     Run all build scripts (ie, `preinstall`, `install`, and\nnpm error\nnpm error   --ignore-scripts\nnpm error     If true, npm does not run scripts specified in package.json files.\nnpm error\nnpm error   --allow-directory\nnpm error     Limits the ability for npm to install dependencies from directories.\nnpm error\nnpm error   --allow-file\nnpm error     Limits the ability for npm to install dependencies from tarball files.\nnpm error\nnpm error   --allow-git\nnpm error     Limits the ability for npm to fetch dependencies from git references.\nnpm error\nnpm error   --allow-remote\nnpm error     Limits the ability for npm to fetch dependencies from urls.\nnpm error\nnpm error   --allow-scripts\nnpm error     Comma-separated list of packages whose install-time lifecycle scripts\nnpm error\nnpm error   --strict-allow-scripts\nnpm error     If `true`, turn the install-script policy from a warning into a hard\nnpm error\nnpm error   --dangerously-allow-all-scripts\nnpm error     If `true`, bypass the `allowScripts` policy entirely and run every\nnpm error\nnpm error   --audit\nnpm error     When \"true\" submit audit reports alongside the current npm command to the\nnpm error\nnpm error   --bin-links\nnpm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package\nnpm error\nnpm error   --fund\nnpm error     When \"true\" displays the message at the end of each `npm install`\nnpm error\nnpm error   --dry-run\nnpm error     Indicates that you don't want npm to make any changes and that it should\nnpm error\nnpm error   -w|--workspace\nnpm error     Enable running a command in the context of the configured workspaces of the\nnpm error\nnpm error   --workspaces\nnpm error     Set to true to run the command in the context of **all** configured\nnpm error\nnpm error   --include-workspace-root\nnpm error     Include the workspace root when workspaces are enabled for a command.\nnpm error\nnpm error   --install-links\nnpm error     When set file: protocol dependencies will be packed and installed as\nnpm error\nnpm error\nnpm error aliases: clean-install, ic, install-clean, isntall-clean\nnpm error\nnpm error Run \"npm help ci\" for more info\nnpm error A complete log of this run can be found in: /home/kali/.npm/_logs/2026-10-31T21_50_43_174Z-debug-0.log\n[chiqish kodi: 1]";
const KOD_OUT_V1_03 = "$ npm install\n\nup to date, audited 1 package in 238ms\n\nfound 0 vulnerabilities\n[chiqish kodi: 0]\n\n$ npm test\n\n> ci-mashq@1.0.0 test\n> echo ok && exit 0\n\nok\n[chiqish kodi: 0]\n\n$ ls\npackage.json\npackage-lock.json";
const KOD_OUT_V1_04 = "# \"test\": \"echo xato && exit 1\" ga o'zgartirildi\n$ npm test\n\n> ci-mashq@1.0.0 test\n> echo xato && exit 1\n\nxato\n[chiqish kodi: 1]";
const KOD_RUNS_C1_10 = {
 "id": "41832879751",
 "n": 11,
 "title": "ci: lenta — npm ci · tsc · test · build",
 "ev": "push",
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
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {c8b895d0-b2d8-4e7f-a2a8-63465f006925}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/56d9986e-59b9-4b78-a345-c9ae46605c9e' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ef9e6671e0c84b98c6143ba02e5e0b3527d0bc1e:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         ef9e6671e0c84b98c6143ba02e5e0b3527d0bc1e -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "ef9e6671e0c84b98c6143ba02e5e0b3527d0bc1e"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2342) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "npm cache is not found"
  ],
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
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2537) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "[command]/usr/bin/tar --posix -cf cache.tzst --exclude cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --files-from manifest.txt --use-compress-program zstdmt",
   "(node:2537) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Sent 36395187 of 36395187 (100.0%), 43.3 MBs/sec",
   "Cache saved with the key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/320d9817-eee6-4594-9dc4-0b6adeca5154' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_C1_11 = {
 "id": "42608643059",
 "n": 44,
 "title": "sinov: chegara buzildi (< → <=)",
 "ev": "push",
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
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {788364b5-e781-41cd-8c46-a74914b93f7c}",
   "Region: eastus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/eca73341-8d7e-4e99-8c36-f87f62e3ec82' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +fccde96bd3d76ff533b5d26b057fd49736c3797c:refs/remotes/origin/sinov-test-qizil",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         fccde96bd3d76ff533b5d26b057fd49736c3797c -> origin/sinov-test-qizil",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B sinov-test-qizil refs/remotes/origin/sinov-test-qizil",
   "Switched to a new branch 'sinov-test-qizil'",
   "branch 'sinov-test-qizil' set up to track 'origin/sinov-test-qizil'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "fccde96bd3d76ff533b5d26b057fd49736c3797c"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2409) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2409) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 89.2 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/a3a0c2e4-0a8c-4a4e-97f5-d8d20a1578da/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
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
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/a26dc3ce-950a-4b6c-bdde-f70496decd53' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_C1_15 = {
 "id": "41833479902",
 "n": 16,
 "title": "sinov: tsc qadami bor + tur xatosi",
 "ev": "push",
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
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {90000ca8-1c23-4925-92c4-daade293ef00}",
   "Region: westcentralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/4afb00e8-1361-4dca-af49-a18f2a97ff16' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +9c6b5f2edaf89e4ebfb0e5151ee0ffbfd6476ee6:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         9c6b5f2edaf89e4ebfb0e5151ee0ffbfd6476ee6 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "9c6b5f2edaf89e4ebfb0e5151ee0ffbfd6476ee6"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2419) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2419) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 36.3 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/70f435da-64ec-4318-9a75-9016888d7764/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
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
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/4fad91e8-59bb-4dcc-8a20-1ccaa35c1bb5' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_C1_18 = {
 "id": "41833650859",
 "n": 19,
 "title": "cicd1-done: node-version 24 — runner'dagi npm 10 lock faylni o'qiy ol…",
 "ev": "push",
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
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {a2f1f54d-a17c-42b0-a5aa-94675ca027b3}",
   "Region: westus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/087aa042-c057-4c95-8a08-b7aa54cafd6c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +d789c0b677c948c16e766e5f4a7912993426c0f0:refs/remotes/origin/main",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         d789c0b677c948c16e766e5f4a7912993426c0f0 -> origin/main",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main",
   "Switched to a new branch 'main'",
   "branch 'main' set up to track 'origin/main'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "d789c0b677c948c16e766e5f4a7912993426c0f0"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2375) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "npm cache is not found"
  ],
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
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2560) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "[command]/usr/bin/tar --posix -cf cache.tzst --exclude cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --files-from manifest.txt --use-compress-program zstdmt",
   "(node:2560) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Sent 23527424 of 36396297 (64.6%), 22.4 MBs/sec",
   "Sent 36396297 of 36396297 (100.0%), 24.7 MBs/sec",
   "Cache saved with the key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/6abe7c37-04e0-42aa-abb1-bdf1fb065d60' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_30 = {
 "id": "41844079933",
 "n": 21,
 "title": "sinov: matrix node 22/24 (fail-fast odatiy)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "09fe858",
 "st": "bad",
 "dur": "26 s",
 "at": "2026-11-04T14:05:18Z",
 "jobs": [
  {
   "name": "test (24)",
   "st": "off",
   "dur": "22 s",
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
     "6 s"
    ],
    [
     "Run npm ci",
     "ok",
     "5 s"
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
  },
  {
   "name": "test (22)",
   "st": "bad",
   "dur": "10 s",
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
     "3 s"
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
   "The strategy configuration was canceled because \"test._22\" failed"
  ],
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "test (24) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {1e096a36-3057-4509-9bbc-8d3a6bd268de}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (24)"
  ],
  "test (24) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/ecbd92ba-f7f6-46cc-95f6-1b1096290cc6' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +09fe85876f0753cb6b760fd51c04dc082c733e0f:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         09fe85876f0753cb6b760fd51c04dc082c733e0f -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "09fe85876f0753cb6b760fd51c04dc082c733e0f"
  ],
  "test (24) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2186) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2186) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 62.1 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/0db50796-b664-431b-8181-9bba921e74bb/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (24) · Run npm ci": [
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
  "test (24) · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test (24) · Run npm test": [
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
   "Time:        1.352 s",
   "Ran all test suites."
  ],
  "test (24) · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test (24) · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2375) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test (24) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/c1413941-3eef-4959-b63b-e9380eb80f7a' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (24) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "test (22) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {d00cc395-cb82-4c6f-a46c-0a2a09c017bb}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (22)"
  ],
  "test (22) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/d5e3d864-98df-43f1-adcd-6375e9342ed8' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +09fe85876f0753cb6b760fd51c04dc082c733e0f:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         09fe85876f0753cb6b760fd51c04dc082c733e0f -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "09fe85876f0753cb6b760fd51c04dc082c733e0f"
  ],
  "test (22) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 22",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2198) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64",
   "node: v22.23.4",
   "npm: 10.9.9",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/22.23.4/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2198) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 36.7 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/8ebbcabd-bb25-42d8-8c39-48177763e3dc/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (22) · Run npm ci": [
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
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T14_05_26_114Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ],
  "test (22) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/879410de-c72f-43e1-a41d-1a02ec6ea226' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (22) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_31 = {
 "id": "41844193379",
 "n": 22,
 "title": "sinov: matrix node 22/24, fail-fast: false",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "a77711f",
 "st": "bad",
 "dur": "29 s",
 "at": "2026-11-04T14:06:00Z",
 "jobs": [
  {
   "name": "test (22)",
   "st": "bad",
   "dur": "10 s",
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
     "bad",
     "0 s"
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
  },
  {
   "name": "test (24)",
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
     "9 s"
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
  "test (22) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {c56f1f58-7b39-41eb-ba5b-a8890f49fb27}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (22)"
  ],
  "test (22) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/5186477b-f082-49b7-91b6-7d45d2f0afe7' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +a77711fdaa06a563454dc80ef3cf142e7a4b038d:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         a77711fdaa06a563454dc80ef3cf142e7a4b038d -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "a77711fdaa06a563454dc80ef3cf142e7a4b038d"
  ],
  "test (22) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 22",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64",
   "(node:2175) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v22.23.4",
   "npm: 10.9.9",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/22.23.4/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2175) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 37.1 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/008eaf66-7bff-43bb-9191-23f0f48dd153/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (22) · Run npm ci": [
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
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T14_06_14_118Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ],
  "test (22) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/9a1b64d3-657a-4093-ab08-79083ef0932f' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (22) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "test (24) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {5daa47e8-b35f-4dad-9ced-8980a55b7842}",
   "Region: westus2",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (24)"
  ],
  "test (24) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/280bf65f-0c1f-43da-9028-572d29c7f2b0' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +a77711fdaa06a563454dc80ef3cf142e7a4b038d:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         a77711fdaa06a563454dc80ef3cf142e7a4b038d -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "a77711fdaa06a563454dc80ef3cf142e7a4b038d"
  ],
  "test (24) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2664) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2664) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 28006579 of 36395187 (77.0%), 26.7 MBs/sec",
   "Received 36395187 of 36395187 (100.0%), 33.8 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/d7b43be3-38bb-4169-b13d-331ae2e35540/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (24) · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "To address issues that do not require attention, run:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "  npm audit fix",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details."
  ],
  "test (24) · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test (24) · Run npm test": [
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
   "Time:        1.471 s",
   "Ran all test suites."
  ],
  "test (24) · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test (24) · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2858) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test (24) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/6483a280-936c-4ffa-b7d2-688cb6b4de11' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (24) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_32 = {
 "id": "41845454983",
 "n": 25,
 "title": "sinov: smoke job — services: postgres:18, DATABASE_URL env (konteyner)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "9fc3af1",
 "st": "ok",
 "dur": "1 daq 6 s",
 "at": "2026-11-04T14:13:43Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "19 s",
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
     "4 s"
    ],
    [
     "Run npm ci",
     "ok",
     "5 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
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
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "41 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Initialize containers",
     "ok",
     "13 s"
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
     "10 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "9 s"
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
     "Stop containers",
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
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {b46ba1ad-0e10-4209-a226-0dc09383d7d9}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/b9358d6d-3e75-4392-b6ac-206a1599cba5' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2163) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2163) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 59.0 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/715d2b01-c2db-4ec7-b344-fad20bb6205d/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 5s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "  npm audit fix",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "PASS src/api/telegram/keyboards.spec.ts",
   "> jest",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.07 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2361) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/6400bfe0-183a-4131-9ac3-b6ec76ac9c35' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {cf0f8035-03cb-4dd4-83e5-373f19a9a269}",
   "Region: westus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=9ab1db\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=9ab1db\"",
   "##[command]/usr/bin/docker network create --label 9ab1db github_network_e1e8a5ac7c604a12a477d8c17c48b8ba",
   "0c57e1911478ae51735ed7041cb9b4b65ffe7c052e01661990cbfae7523dcd15",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "d0fbcb0db440: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "7e6d71cb0490: Download complete",
   "cea4f0db46a6: Download complete",
   "fbc84e711712: Download complete",
   "879995175298: Download complete",
   "d89068781d71: Download complete",
   "00ff7a4924f2: Download complete",
   "d0fbcb0db440: Download complete",
   "7c25aa4e8a77: Download complete",
   "d06edb2e3f43: Download complete",
   "3795839385bc: Download complete",
   "9b1a18996a22: Download complete",
   "1b52931e2f91: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "9b1a18996a22: Pull complete",
   "fbc84e711712: Pull complete",
   "879995175298: Pull complete",
   "d89068781d71: Pull complete",
   "ef90fb83cca5: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 59b8e1225c904ca3862e1e7019730d98_postgres18_e32bb8 --label 9ab1db --network github_network_e1e8a5ac7c604a12a477d8c17c48b8ba --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "##[command]/usr/bin/docker start 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "##[command]/usr/bin/docker ps --all --filter id=0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/fc9f35a1-4ab3-4e84-8337-185c4297b51c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2780) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2780) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 4194304 of 36395187 (11.5%), 4.0 MBs/sec",
   "Received 36395187 of 36395187 (100.0%), 26.8 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/f6c4c064-a3d2-4fd2-94a6-a4ebd8be1a32/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 9s",
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
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3077) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/0c29c250-9d51-4668-b43d-103254d88f1f' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 59b8e1225c904ca3862e1e7019730d98_postgres18_e32bb8",
   "##[command]/usr/bin/docker logs --details 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:14:16.597 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:14:16.597 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:14:16.597 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:14:16.598 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:14:16.602 UTC [75] LOG:  database system was shut down at 2026-11-04 14:14:16 UTC",
   " 2026-11-04 14:14:16.609 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:14:44.476 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:14:44.487 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.012 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:14:16.252 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:14:16.253 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:14:16.258 UTC [59] LOG:  database system was shut down at 2026-11-04 14:14:16 UTC",
   " 2026-11-04 14:14:16.262 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:14:16.469 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-04 14:14:16.470 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:14:16.473 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:14:16.474 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:14:16.475 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:14:16.492 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.015 s, sync=0.002 s, total=0.019 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:14:16.507 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 59b8e1225c904ca3862e1e7019730d98_postgres18_e32bb8",
   "##[command]/usr/bin/docker rm --force 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "Remove container network: github_network_e1e8a5ac7c604a12a477d8c17c48b8ba",
   "##[command]/usr/bin/docker network rm github_network_e1e8a5ac7c604a12a477d8c17c48b8ba",
   "github_network_e1e8a5ac7c604a12a477d8c17c48b8ba"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_33 = {
 "id": "41845709717",
 "n": 26,
 "title": "sinov: secrets.DATABSE_URL — nomi xato (secret bo'lmasa ham bo'sh)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "2013fd1",
 "st": "bad",
 "dur": "54 s",
 "at": "2026-11-04T14:15:16Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "20 s",
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
     "4 s"
    ],
    [
     "Run npm ci",
     "ok",
     "4 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
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
  },
  {
   "name": "smoke",
   "st": "bad",
   "dur": "30 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "11 s"
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
     "8 s"
    ],
    [
     "Run npm run smoke",
     "bad",
     "4 s"
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
     "Stop containers",
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
   "Process completed with exit code 2."
  ]
 ],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {78640de3-c5d5-4c20-8a55-b5fda5139b15}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/c1e7a3b4-36c3-4a7d-92c1-38d294e7aeb4' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +2013fd1e6897d67cc81a221ba7915df00d9938b4:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         2013fd1e6897d67cc81a221ba7915df00d9938b4 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "2013fd1e6897d67cc81a221ba7915df00d9938b4"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2157) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2157) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 32200883 of 36395187 (88.5%), 30.7 MBs/sec",
   "Received 32200883 of 36395187 (88.5%), 15.4 MBs/sec",
   "Received 36395187 of 36395187 (100.0%), 13.4 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/43e3025a-926b-4b6e-a4d4-0e0fbe641377/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 4s",
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
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
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
   "Time:        0.954 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2349) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/73ce7c0f-547d-4169-9590-4fb96593fbe7' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {4c2e4fdc-c594-45a4-87c1-b7521a42927f}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=cf67ce\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=cf67ce\"",
   "##[command]/usr/bin/docker network create --label cf67ce github_network_8483ec21ac5a4bf6a734e4b15511d4b2",
   "23c9e05f5544e93ce3336012a1175687b6cdc111627473333cc4590e379a2108",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "d0fbcb0db440: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "7c25aa4e8a77: Download complete",
   "d0fbcb0db440: Download complete",
   "fbc84e711712: Download complete",
   "7e6d71cb0490: Download complete",
   "d89068781d71: Download complete",
   "00ff7a4924f2: Download complete",
   "d06edb2e3f43: Download complete",
   "879995175298: Download complete",
   "cea4f0db46a6: Download complete",
   "9b1a18996a22: Download complete",
   "3795839385bc: Download complete",
   "1b52931e2f91: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "9b1a18996a22: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 524b1dc63f1c43dc84e4f8ef8a51575c_postgres18_80f952 --label cf67ce --network github_network_8483ec21ac5a4bf6a734e4b15511d4b2 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "##[command]/usr/bin/docker start 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "##[command]/usr/bin/docker ps --all --filter id=9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "starting",
   "postgres service is starting, waiting 3 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/a3e489ba-ee11-4448-969e-343e7dfc8f1c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +2013fd1e6897d67cc81a221ba7915df00d9938b4:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         2013fd1e6897d67cc81a221ba7915df00d9938b4 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "2013fd1e6897d67cc81a221ba7915df00d9938b4"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2760) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2760) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 123.5 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/ddaecb78-5eb4-4084-9e42-37625687027f/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
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
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== baza yo'q: hammasi xotirada (tgpg-start) ==",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "SMOKE XATO: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: ***localhost:5432/shop",
   "SMOKE XATO: Command failed: node \"/home/runner/work/OrderBotNest/OrderBotNest/scripts/smoke.js\" __step 1",
   "SMOKE XATO: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: ***localhost:5432/shop",
   "##[error]Process completed with exit code 2."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/f12bb342-e6b2-448c-8d0a-d8652f2ce2ed' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 524b1dc63f1c43dc84e4f8ef8a51575c_postgres18_80f952",
   "##[command]/usr/bin/docker logs --details 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:15:49.107 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:15:49.107 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:15:49.108 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:15:49.109 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:15:49.113 UTC [75] LOG:  database system was shut down at 2026-11-04 14:15:49 UTC",
   " 2026-11-04 14:15:49.116 UTC [1] LOG:  database system is ready to accept connections",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:15:48.786 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:15:48.786 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:15:48.790 UTC [59] LOG:  database system was shut down at 2026-11-04 14:15:48 UTC",
   " 2026-11-04 14:15:48.793 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " 2026-11-04 14:15:48.984 UTC [53] LOG:  received fast shutdown request",
   " waiting for server to shut down....2026-11-04 14:15:48.984 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:15:48.986 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:15:48.986 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:15:48.987 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:15:49.003 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.014 s, sync=0.002 s, total=0.017 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:15:49.014 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 524b1dc63f1c43dc84e4f8ef8a51575c_postgres18_80f952",
   "##[command]/usr/bin/docker rm --force 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "Remove container network: github_network_8483ec21ac5a4bf6a734e4b15511d4b2",
   "##[command]/usr/bin/docker network rm github_network_8483ec21ac5a4bf6a734e4b15511d4b2",
   "github_network_8483ec21ac5a4bf6a734e4b15511d4b2"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_35 = {
 "id": "41845936594",
 "n": 27,
 "title": "ci: smoke job (services: postgres:18, DATABASE_URL secret) va README …",
 "ev": "push",
 "br": "lenta-smoke",
 "sha": "70035b5",
 "st": "ok",
 "dur": "1 daq 10 s",
 "at": "2026-11-04T14:16:37Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "24 s",
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
     "3 s"
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
     "ok",
     "3 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
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
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "39 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "13 s"
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
     "9 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "8 s"
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
     "Stop containers",
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
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {9aab6ec5-8739-4463-8c9c-9561c420b21b}",
   "Region: westcentralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/b2a439f3-e73a-4982-9b83-b87039c63df3' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +70035b5a01e42de2500c3180a440f42c5fc34a8a:refs/remotes/origin/lenta-smoke",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         70035b5a01e42de2500c3180a440f42c5fc34a8a -> origin/lenta-smoke",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B lenta-smoke refs/remotes/origin/lenta-smoke",
   "Switched to a new branch 'lenta-smoke'",
   "branch 'lenta-smoke' set up to track 'origin/lenta-smoke'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "70035b5a01e42de2500c3180a440f42c5fc34a8a"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2401) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2401) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 39.7 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/89067e75-5981-4542-8f55-1d40efbd81ba/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
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
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
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
   "Time:        1.665 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2629) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/36e495ac-67c4-4e98-865f-07e2154bc26b' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {cb307374-02f1-4f99-93ac-0fe25ec2a384}",
   "Region: westus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=dd54ac\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=dd54ac\"",
   "##[command]/usr/bin/docker network create --label dd54ac github_network_49dfbe2e200a457d8a198ce988a7c9aa",
   "2dc7e118a8ff30df1e64524fd3dd00021bea2e74fcc00b7e592780479bf7ad6f",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "d0fbcb0db440: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "fbc84e711712: Download complete",
   "879995175298: Download complete",
   "d0fbcb0db440: Download complete",
   "cea4f0db46a6: Download complete",
   "d89068781d71: Download complete",
   "7e6d71cb0490: Download complete",
   "d06edb2e3f43: Download complete",
   "7c25aa4e8a77: Download complete",
   "00ff7a4924f2: Download complete",
   "3795839385bc: Download complete",
   "9b1a18996a22: Download complete",
   "1b52931e2f91: Download complete",
   "a3fcee8384ca: Download complete",
   "ef90fb83cca5: Download complete",
   "6fc242d221a6: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "fbc84e711712: Pull complete",
   "879995175298: Pull complete",
   "d89068781d71: Pull complete",
   "9b1a18996a22: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7e6d71cb0490: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "00ff7a4924f2: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 233d5cf7cc1d425da0ea7070afcf794c_postgres18_12b520 --label dd54ac --network github_network_49dfbe2e200a457d8a198ce988a7c9aa --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "##[command]/usr/bin/docker start 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "##[command]/usr/bin/docker ps --all --filter id=667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/048da74e-12af-4528-ab94-ed6fd73f387b' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +70035b5a01e42de2500c3180a440f42c5fc34a8a:refs/remotes/origin/lenta-smoke",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         70035b5a01e42de2500c3180a440f42c5fc34a8a -> origin/lenta-smoke",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B lenta-smoke refs/remotes/origin/lenta-smoke",
   "Switched to a new branch 'lenta-smoke'",
   "branch 'lenta-smoke' set up to track 'origin/lenta-smoke'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "70035b5a01e42de2500c3180a440f42c5fc34a8a"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2774) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2774) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 4194304 of 36396297 (11.5%), 4.0 MBs/sec",
   "Received 36396297 of 36396297 (100.0%), 29.4 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/bad8e5b7-c807-482b-919a-b3932a6caf22/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
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
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3074) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/ee4814ca-9f55-44fd-b671-9df522391014' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 233d5cf7cc1d425da0ea7070afcf794c_postgres18_12b520",
   "##[command]/usr/bin/docker logs --details 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:17:16.963 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:17:16.963 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:17:16.963 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:17:16.964 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:17:16.968 UTC [75] LOG:  database system was shut down at 2026-11-04 14:17:16 UTC",
   " 2026-11-04 14:17:16.973 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:17:42.292 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:17:42.295 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.004 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:17:16.635 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:17:16.635 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:17:16.639 UTC [59] LOG:  database system was shut down at 2026-11-04 14:17:16 UTC",
   " 2026-11-04 14:17:16.642 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " 2026-11-04 14:17:16.838 UTC [53] LOG:  received fast shutdown request",
   " waiting for server to shut down....2026-11-04 14:17:16.838 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:17:16.840 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:17:16.841 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:17:16.841 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:17:16.858 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.014 s, sync=0.002 s, total=0.018 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:17:16.870 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 233d5cf7cc1d425da0ea7070afcf794c_postgres18_12b520",
   "##[command]/usr/bin/docker rm --force 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "Remove container network: github_network_49dfbe2e200a457d8a198ce988a7c9aa",
   "##[command]/usr/bin/docker network rm github_network_49dfbe2e200a457d8a198ce988a7c9aa",
   "github_network_49dfbe2e200a457d8a198ce988a7c9aa"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_36 = {
 "id": "41846225069",
 "n": 28,
 "title": "ci: smoke job (PostgreSQL xizmati) va README badge",
 "ev": "pull_request",
 "br": "lenta-smoke",
 "sha": "70035b5",
 "st": "ok",
 "dur": "1 daq 15 s",
 "at": "2026-11-04T14:18:23Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "20 s",
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
     "ok",
     "6 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "3 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "4 s"
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
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "35 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "11 s"
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
     "9 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "8 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
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
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {170ec72b-a97b-4fcc-930f-3e4503287225}",
   "Region: southcentralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/60cea125-ab97-4151-9650-93781530b0fc' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ff03da35c46fdd25d23d5b4e0a73ea4ae72683db:refs/remotes/pull/1/merge",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         ff03da35c46fdd25d23d5b4e0a73ea4ae72683db -> pull/1/merge",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force refs/remotes/pull/1/merge",
   "Note: switching to 'refs/remotes/pull/1/merge'.",
   "You are in 'detached HEAD' state. You can look around, make experimental",
   "changes and commit them, and you can discard any commits you make in this",
   "state without impacting any branches by switching back to a branch.",
   "If you want to create a new branch to retain commits you create, you may",
   "do so (now or later) by using -c with the switch command. Example:",
   "  git switch -c <new-branch-name>",
   "Or undo this operation with:",
   "  git switch -",
   "Turn off this advice by setting config variable advice.detachedHead to false",
   "HEAD is now at ff03da3 Merge 70035b5a01e42de2500c3180a440f42c5fc34a8a into d789c0b677c948c16e766e5f4a7912993426c0f0",
   "[command]/usr/bin/git log -1 --format=%H",
   "ff03da35c46fdd25d23d5b4e0a73ea4ae72683db"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2339) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2339) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 59.5 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/7a5d732e-43e9-47cd-9f95-0b5f7aea7ce4/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 6s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "To address issues that do not require attention, run:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "  npm audit fix",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
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
   "Time:        1.324 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2537) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/b42a1ec9-09fd-4d4e-baf0-d4acf53c6266' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {7b5faeda-6cfc-4d04-adac-55a474904346}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=6b7feb\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=6b7feb\"",
   "##[command]/usr/bin/docker network create --label 6b7feb github_network_6eaae99124614777878bc29cf3885a56",
   "77bc1ed5030468d1217e075f53210b9ca71dea03ead82483139830ce6bd62d95",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "9b1a18996a22: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "fbc84e711712: Download complete",
   "d06edb2e3f43: Download complete",
   "00ff7a4924f2: Download complete",
   "7e6d71cb0490: Download complete",
   "d89068781d71: Download complete",
   "cea4f0db46a6: Download complete",
   "d0fbcb0db440: Download complete",
   "879995175298: Download complete",
   "7c25aa4e8a77: Download complete",
   "a3fcee8384ca: Download complete",
   "3795839385bc: Download complete",
   "9b1a18996a22: Download complete",
   "1b52931e2f91: Download complete",
   "6fc242d221a6: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "3795839385bc: Pull complete",
   "cea4f0db46a6: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "9b1a18996a22: Pull complete",
   "7e6d71cb0490: Pull complete",
   "ef90fb83cca5: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name e77c684bd3d8479fb9d4898c44c8d838_postgres18_06dbb9 --label 6b7feb --network github_network_6eaae99124614777878bc29cf3885a56 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "##[command]/usr/bin/docker start 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "##[command]/usr/bin/docker ps --all --filter id=3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/7fff95b8-b159-47b2-af7a-0179380130cb' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ff03da35c46fdd25d23d5b4e0a73ea4ae72683db:refs/remotes/pull/1/merge",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         ff03da35c46fdd25d23d5b4e0a73ea4ae72683db -> pull/1/merge",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force refs/remotes/pull/1/merge",
   "Note: switching to 'refs/remotes/pull/1/merge'.",
   "You are in 'detached HEAD' state. You can look around, make experimental",
   "changes and commit them, and you can discard any commits you make in this",
   "state without impacting any branches by switching back to a branch.",
   "If you want to create a new branch to retain commits you create, you may",
   "do so (now or later) by using -c with the switch command. Example:",
   "  git switch -c <new-branch-name>",
   "Or undo this operation with:",
   "  git switch -",
   "Turn off this advice by setting config variable advice.detachedHead to false",
   "HEAD is now at ff03da3 Merge 70035b5a01e42de2500c3180a440f42c5fc34a8a into d789c0b677c948c16e766e5f4a7912993426c0f0",
   "[command]/usr/bin/git log -1 --format=%H",
   "ff03da35c46fdd25d23d5b4e0a73ea4ae72683db"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2769) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2769) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 121.4 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/36d2a9cb-b1a0-4a8b-b4b0-52c0df4439da/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 9s",
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
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3069) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/7a0ce489-cb46-4202-85b0-87a6760e63e1' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: e77c684bd3d8479fb9d4898c44c8d838_postgres18_06dbb9",
   "##[command]/usr/bin/docker logs --details 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:19:10.246 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:19:10.246 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:19:10.246 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:19:10.247 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:19:10.251 UTC [75] LOG:  database system was shut down at 2026-11-04 14:19:10 UTC",
   " 2026-11-04 14:19:10.254 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:19:34.911 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:19:34.914 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.004 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:19:09.926 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:19:09.927 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:19:09.931 UTC [59] LOG:  database system was shut down at 2026-11-04 14:19:09 UTC",
   " 2026-11-04 14:19:09.934 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " 2026-11-04 14:19:10.123 UTC [53] LOG:  received fast shutdown request",
   " waiting for server to shut down....2026-11-04 14:19:10.124 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:19:10.126 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:19:10.127 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:19:10.127 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:19:10.144 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.013 s, sync=0.003 s, total=0.018 s; sync files=303, longest=0.002 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:19:10.155 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: e77c684bd3d8479fb9d4898c44c8d838_postgres18_06dbb9",
   "##[command]/usr/bin/docker rm --force 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "Remove container network: github_network_6eaae99124614777878bc29cf3885a56",
   "##[command]/usr/bin/docker network rm github_network_6eaae99124614777878bc29cf3885a56",
   "github_network_6eaae99124614777878bc29cf3885a56"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_37 = {
 "id": "41846525635",
 "n": 29,
 "title": "Merge pull request #1 from Azizbekcrypto/lenta-smoke",
 "ev": "push",
 "br": "main",
 "sha": "47d30ec",
 "st": "ok",
 "dur": "1 daq 1 s",
 "at": "2026-11-04T14:20:12Z",
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
     "4 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
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
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "38 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "14 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "3 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "7 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "6 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "2 s"
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
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {6fad1e66-4e7e-4450-a6ea-3cae6440cb74}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/f32e6640-348d-4de5-8d1f-84e26acd0ebe' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08:refs/remotes/origin/main",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08 -> origin/main",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main",
   "Switched to a new branch 'main'",
   "branch 'main' set up to track 'origin/main'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2139) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2139) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 32201993 of 36396297 (88.5%), 30.7 MBs/sec",
   "Received 36396297 of 36396297 (100.0%), 34.1 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/698dfd08-fb21-4cf9-92ad-b209b9ad3aa7/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 4s",
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
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
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
   "Time:        0.975 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2336) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/7fa325c3-0244-4855-b465-b032331d3970' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {3063bb04-5f10-486e-a29b-fcb70323396c}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=eb96b4\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=eb96b4\"",
   "##[command]/usr/bin/docker network create --label eb96b4 github_network_0026bc8b95ee464985a82a089b21661a",
   "8680f67f596f9ac87dfcdcf257ac459c6b8caa5d42a472fccd24e34e34d0a2be",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "6fc242d221a6: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "fbc84e711712: Download complete",
   "7e6d71cb0490: Download complete",
   "00ff7a4924f2: Download complete",
   "d0fbcb0db440: Download complete",
   "d06edb2e3f43: Download complete",
   "1b52931e2f91: Download complete",
   "cea4f0db46a6: Download complete",
   "d89068781d71: Download complete",
   "7c25aa4e8a77: Download complete",
   "879995175298: Download complete",
   "6fc242d221a6: Download complete",
   "9b1a18996a22: Download complete",
   "3795839385bc: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Pull complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "3795839385bc: Pull complete",
   "cea4f0db46a6: Pull complete",
   "9b1a18996a22: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 1678c369444d4f9dad9ef6b301771181_postgres18_8b5163 --label eb96b4 --network github_network_0026bc8b95ee464985a82a089b21661a --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "##[command]/usr/bin/docker start cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "##[command]/usr/bin/docker ps --all --filter id=cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "starting",
   "postgres service is starting, waiting 3 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/953c369c-18a1-40a2-9524-e276f9ea5f4a' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08:refs/remotes/origin/main",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08 -> origin/main",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main",
   "Switched to a new branch 'main'",
   "branch 'main' set up to track 'origin/main'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2547) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2547) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 109.2 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/3557d456-7f4e-4729-9880-70d960bc14ea/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 7s",
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
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2829) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/f0cafc32-b632-4bfe-adb7-a1475143c253' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 1678c369444d4f9dad9ef6b301771181_postgres18_8b5163",
   "##[command]/usr/bin/docker logs --details cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " This user must also own the server process.",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:20:46.683 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:20:46.683 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:20:46.683 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:20:46.684 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:20:46.688 UTC [76] LOG:  database system was shut down at 2026-11-04 14:20:46 UTC",
   " 2026-11-04 14:20:46.691 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:21:08.885 UTC [74] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:21:08.888 UTC [74] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.003 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:20:45.931 UTC [54] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:20:45.932 UTC [54] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:20:45.935 UTC [60] LOG:  database system was shut down at 2026-11-04 14:20:44 UTC",
   " 2026-11-04 14:20:45.937 UTC [54] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:20:46.560 UTC [54] LOG:  received fast shutdown request",
   " .2026-11-04 14:20:46.560 UTC [54] LOG:  aborting any active transactions",
   " 2026-11-04 14:20:46.563 UTC [54] LOG:  background worker \"logical replication launcher\" (PID 63) exited with exit code 1",
   " 2026-11-04 14:20:46.563 UTC [58] LOG:  shutting down",
   " 2026-11-04 14:20:46.563 UTC [58] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:20:46.649 UTC [58] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.084 s, sync=0.002 s, total=0.087 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:20:46.659 UTC [54] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 1678c369444d4f9dad9ef6b301771181_postgres18_8b5163",
   "##[command]/usr/bin/docker rm --force cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "Remove container network: github_network_0026bc8b95ee464985a82a089b21661a",
   "##[command]/usr/bin/docker network rm github_network_0026bc8b95ee464985a82a089b21661a",
   "github_network_0026bc8b95ee464985a82a089b21661a"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_40 = {
 "id": "41844500453",
 "n": 23,
 "title": "sinov: AI yozgan workflow — smoke + PostgreSQL xizmati (ai1)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "cbf13e3",
 "st": "ok",
 "dur": "49 s",
 "at": "2026-11-04T14:07:53Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "43 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Initialize containers",
     "ok",
     "12 s"
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
     "9 s"
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
     "Run npm run smoke",
     "ok",
     "8 s"
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
     "Stop containers",
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
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {8210330a-4c48-4b29-831f-437b936a51ab}",
   "Region: eastus2",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=17ecfa\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=17ecfa\"",
   "##[command]/usr/bin/docker network create --label 17ecfa github_network_99f62ecc73214b37843c20fd0862ac62",
   "05ce8b30e65f6f9729db53e8dff67c84dbefd98536accec1a3958b7bbf36ae9f",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "6fc242d221a6: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "7e6d71cb0490: Download complete",
   "00ff7a4924f2: Download complete",
   "879995175298: Download complete",
   "cea4f0db46a6: Download complete",
   "d0fbcb0db440: Download complete",
   "d06edb2e3f43: Download complete",
   "7c25aa4e8a77: Download complete",
   "fbc84e711712: Download complete",
   "d89068781d71: Download complete",
   "1b52931e2f91: Download complete",
   "6fc242d221a6: Download complete",
   "9b1a18996a22: Download complete",
   "3795839385bc: Download complete",
   "a3fcee8384ca: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "9b1a18996a22: Pull complete",
   "879995175298: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 03fc1ae5f5cf4406b42464e953c47f36_postgres18_582b94 --label 17ecfa --network github_network_99f62ecc73214b37843c20fd0862ac62 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_USER=postgres\" -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "##[command]/usr/bin/docker start 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "##[command]/usr/bin/docker ps --all --filter id=009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "healthy",
   "postgres service is healthy."
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/8b44f089-fe13-4b15-8476-dcbb0da68fac' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +cbf13e327661a77ec44f82ec1867490e6325971a:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         cbf13e327661a77ec44f82ec1867490e6325971a -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "cbf13e327661a77ec44f82ec1867490e6325971a"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2764) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2764) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 130.0 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/3aaab27b-47d4-4fbe-8d0f-698e6e6cc2de/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 9s",
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
   "Time:        1.523 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3240) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/c8fef0d1-509c-47b7-a20b-63d084196ff1' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Stop containers": [
   "Print service container logs: 03fc1ae5f5cf4406b42464e953c47f36_postgres18_582b94",
   "##[command]/usr/bin/docker logs --details 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:08:04.619 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " 2026-11-04 14:08:04.619 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:08:04.619 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:08:04.620 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:08:04.624 UTC [75] LOG:  database system was shut down at 2026-11-04 14:08:04 UTC",
   " 2026-11-04 14:08:04.628 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:08:37.345 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:08:37.349 UTC [73] LOG:  checkpoint complete: wrote 43 buffers (0.3%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.002 s, sync=0.001 s, total=0.004 s; sync files=14, longest=0.001 s, average=0.001 s; distance=4857 kB, estimate=4857 kB; lsn=0/2060160, redo lsn=0/2060108",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:08:04.294 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:08:04.295 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:08:04.299 UTC [59] LOG:  database system was shut down at 2026-11-04 14:08:04 UTC",
   " 2026-11-04 14:08:04.301 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:08:04.496 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-04 14:08:04.497 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:08:04.500 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:08:04.500 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:08:04.501 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:08:04.516 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.013 s, sync=0.002 s, total=0.016 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:08:04.528 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 03fc1ae5f5cf4406b42464e953c47f36_postgres18_582b94",
   "##[command]/usr/bin/docker rm --force 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "Remove container network: github_network_99f62ecc73214b37843c20fd0862ac62",
   "##[command]/usr/bin/docker network rm github_network_99f62ecc73214b37843c20fd0862ac62",
   "github_network_99f62ecc73214b37843c20fd0862ac62"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_41 = {
 "id": "41844703019",
 "n": 24,
 "title": "sinov: AI yozgan workflow — smoke + PostgreSQL xizmati (ai2)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "94937cc",
 "st": "ok",
 "dur": "46 s",
 "at": "2026-11-04T14:09:08Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "42 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "12 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
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
     "Run npm run smoke",
     "ok",
     "8 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
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
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {5668318e-7b5c-4144-ba2a-8e51819adbb2}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=8d48c9\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=8d48c9\"",
   "##[command]/usr/bin/docker network create --label 8d48c9 github_network_a80041c55268404b84f5a661fc0c8901",
   "275b877d2a161f620bed410391b50d230c91656707cf312111809a689d51fd90",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "7c25aa4e8a77: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "d0fbcb0db440: Download complete",
   "9b1a18996a22: Download complete",
   "00ff7a4924f2: Download complete",
   "d89068781d71: Download complete",
   "7c25aa4e8a77: Download complete",
   "1b52931e2f91: Download complete",
   "cea4f0db46a6: Download complete",
   "d06edb2e3f43: Download complete",
   "879995175298: Download complete",
   "7e6d71cb0490: Download complete",
   "fbc84e711712: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Download complete",
   "3795839385bc: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "9b1a18996a22: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "fbc84e711712: Pull complete",
   "ef90fb83cca5: Pull complete",
   "d0fbcb0db440: Pull complete",
   "00ff7a4924f2: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "7e6d71cb0490: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 4ada16619b124249bda547f87f48d5d2_postgres18_92190f --label 8d48c9 --network github_network_a80041c55268404b84f5a661fc0c8901 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_USER=postgres\" -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "##[command]/usr/bin/docker start 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "##[command]/usr/bin/docker ps --all --filter id=01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "healthy",
   "postgres service is healthy."
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/e2b372b6-9f12-4605-ab5f-4177bda86cc6' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +94937cc525cfdef9fe4c901845dbeae63bbcdea3:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         94937cc525cfdef9fe4c901845dbeae63bbcdea3 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "94937cc525cfdef9fe4c901845dbeae63bbcdea3"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2891) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2891) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 138.3 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/9ddc8ba4-7162-4bc8-b626-7303459056b7/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Run npm ci": [
   "$ npm ci",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
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
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop"
  ],
  "Run npm test": [
   "$ npm test",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
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
   "Time:        1.848 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3328) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/46544ba3-8dc5-4430-b221-cc9d4791578a' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Stop containers": [
   "Print service container logs: 4ada16619b124249bda547f87f48d5d2_postgres18_92190f",
   "##[command]/usr/bin/docker logs --details 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:09:18.713 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:09:18.714 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:09:18.714 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:09:18.717 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:09:18.721 UTC [75] LOG:  database system was shut down at 2026-11-04 14:09:18 UTC",
   " 2026-11-04 14:09:18.725 UTC [1] LOG:  database system is ready to accept connections",
   " This user must also own the server process.",
   " 2026-11-04 14:09:50.903 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:09:50.906 UTC [73] LOG:  checkpoint complete: wrote 43 buffers (0.3%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.002 s, sync=0.001 s, total=0.004 s; sync files=14, longest=0.001 s, average=0.001 s; distance=4857 kB, estimate=4857 kB; lsn=0/2060160, redo lsn=0/2060108",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:09:18.387 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:09:18.388 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:09:18.392 UTC [59] LOG:  database system was shut down at 2026-11-04 14:09:18 UTC",
   " 2026-11-04 14:09:18.395 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:09:18.588 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-04 14:09:18.589 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:09:18.591 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:09:18.592 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:09:18.592 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:09:18.610 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.016 s, sync=0.002 s, total=0.019 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:09:18.622 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 4ada16619b124249bda547f87f48d5d2_postgres18_92190f",
   "##[command]/usr/bin/docker rm --force 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "Remove container network: github_network_a80041c55268404b84f5a661fc0c8901",
   "##[command]/usr/bin/docker network rm github_network_a80041c55268404b84f5a661fc0c8901",
   "github_network_a80041c55268404b84f5a661fc0c8901"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_PROMPT1 = "OrderBotNest'da `npm run smoke` buyrug'i bor — Telegram'siz tekshiruv, unga PostgreSQL kerak (DATABASE_URL). GitHub Actions workflow'iga shu smoke'ni ham qo'shib ber: har push'da testlar va smoke yursin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), .github/workflows/ci.yml bor (job test: checkout · setup-node · npm ci · npx tsc --noEmit · npm test · npm run build). npm run smoke — Telegram'siz tekshiruv (scripts/smoke.js), unga ishlayotgan PostgreSQL va DATABASE_URL kerak; smoke <baza>_smoke bazasini o'zi ochib o'chiradi. Vazifa: ci.ymlga ikkinchi job smoke qo'sh: needs: test; services: postgres (image: postgres:18, POSTGRES_PASSWORD: postgres, POSTGRES_DB: shop, ports: 5432:5432, pg_isready healthcheck); qadamlar: checkout, setup-node (node-version — mening raqamim, cache: npm), npm ci, npm run smoke (env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop). Secret ishlatma — konteyner. Boshqa fayllarga tegma. Javobda faylning to'liq matni.";
const KOD_TXT_36B = "$ gh pr view 1\ntitle:\tci: smoke job (PostgreSQL xizmati) va README badge\nstate:\tOPEN\nauthor:\tAzizbekcrypto (Azizbek)\nlabels:\t\nassignees:\t\nreviewers:\t\nprojects:\t\nmilestone:\t\nnumber:\t1\nurl:\thttps://github.com/Azizbekcrypto/OrderBotNest/pull/1\nadditions:\t29\ndeletions:\t1\nauto-merge:\tdisabled\n--\nLentaga ikkinchi job: `smoke` — `services: postgres:18`, `DATABASE_URL` secret'dan, `npm run smoke`. README'da lenta nishoni (badge). CI/CD-2 mentor darsi uchun (F-1104-21).\n\n$ gh pr checks 1\nsmoke\tpass\t39s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41845936594/job/126629568615\t\nsmoke\tpass\t35s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41846225069/job/126630675440\t\ntest\tpass\t24s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41845936594/job/126629310338\t\ntest\tpass\t20s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41846225069/job/126630420521\t\n\n## API: pulls/1\n{\"base\":\"main\",\"head\":\"lenta-smoke\",\"html_url\":\"https://github.com/Azizbekcrypto/OrderBotNest/pull/1\",\"mergeable\":true,\"mergeable_state\":\"clean\",\"number\":1,\"state\":\"open\",\"title\":\"ci: smoke job (PostgreSQL xizmati) va README badge\"}";
const KOD_TXT_00 = "$ gh secret list -R Azizbekcrypto/OrderBotNest\n\n# bor=0 · qiymat (foydalanuvchi yaratsa): postgresql://postgres:postgres@localhost:5432/shop";
const KOD = { CI_START: KOD_CI_START, CI_DONE: KOD_CI_DONE, README_BADGE: KOD_README_BADGE, SMOKE_URL: KOD_SMOKE_URL, SMOKE_DB: KOD_SMOKE_DB, PKG_SMOKE: KOD_PKG_SMOKE, YML_1_MATRIX: KOD_YML_1_MATRIX, YML_2_MATRIX_FAIL_FAST_FALSE: KOD_YML_2_MATRIX_FAIL_FAST_FALSE, YML_3_SMOKE_SERVICES: KOD_YML_3_SMOKE_SERVICES, YML_4_SMOKE_SECRET_XATO: KOD_YML_4_SMOKE_SECRET_XATO, YML_5_SECRET_ECHO: KOD_YML_5_SECRET_ECHO, YML_AI1: KOD_YML_AI1, YML_AI2: KOD_YML_AI2, OUT: { '00': KOD_OUT_00, '09': KOD_OUT_09, 'v1-01': KOD_OUT_V1_01, 'v1-02': KOD_OUT_V1_02, 'v1-03': KOD_OUT_V1_03, 'v1-04': KOD_OUT_V1_04 }, RUNS: { 'c1-10': KOD_RUNS_C1_10, 'c1-11': KOD_RUNS_C1_11, 'c1-15': KOD_RUNS_C1_15, 'c1-18': KOD_RUNS_C1_18, '30': KOD_RUNS_30, '31': KOD_RUNS_31, '32': KOD_RUNS_32, '33': KOD_RUNS_33, '35': KOD_RUNS_35, '36': KOD_RUNS_36, '37': KOD_RUNS_37, '40': KOD_RUNS_40, '41': KOD_RUNS_41 }, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2, TXT_36B: KOD_TXT_36B, TXT_00: KOD_TXT_00 };

// ============================================================
//  CI/CD-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-matn.py (manba: 24-CICD2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Lenta bor va yashil. Bugun uning ichiga kiramiz: log, cache, matrix, Postgres bilan smoke, secret va pull request — hammasi haqiqiy run'larda",
  "seg": [
   [
    "a",
    "CI/CD-1 da lenta yozdingiz — bugun <b>Actions'ning ichiga</b> kiramiz, hammasi haqiqiy run'larda",
    "Assalomu alaykum. Oldingi darsda OrderBotNest'ga lenta yozdingiz: har push'da to'rt qadam. Bugun shu lentaning ichiga kiramiz. Ekranda dars oxiridagi natija: ikkita job, test va smoke, smoke haqiqiy Postgres bilan, ikkalasi yashil."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: run, job, step va GitHub o'zi qo'shadigan qadamlar",
    "Avval umumiy tushuncha: Actions nima qiladi, run, job va step nima, GitHub o'zi qaysi qadamlarni qo'shadi va uses ichida nima bo'ladi. Keyin qizil run'ni to'g'ri o'qishni va cache nima qilishini ko'rasiz."
   ],
   [
    "c",
    "Keyin <b>matrix, Postgres xizmati bilan smoke, secret va pull request</b>",
    "Uchinchi bosqichda matrix: bitta fayl, ikki Node. To'rtinchisida bazali tekshiruvni lentaga qo'yamiz: Postgres xizmati va smoke. Secret nima va nomi xato bo'lsa nima bo'ladi. Beshinchisida pull request va AI yozgan workflow'lar. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot — <b>o'z GitHub reponingizda</b>; har run haqiqiy",
    "Dars olti bosqich, uchta amaliyot, hammasi CI/CD-1 dagi o'z reponingizda. Ekrandagi har run haqiqiy: OrderBotNest'da shu kuni yurgizilgan, qadam va soniyalari o'sha. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Har push — run; faylda jobs: ostidagi har nom — alohida mashinada bitta job; job ichida qadamlar; uchtasini GitHub o'zi qo'shadi",
  "seg": [
   [
    "a",
    "Run — bitta push; <b>job — faylda <code>jobs:</code> ostidagi har nom</b>, har biri alohida mashinada",
    "Actions'ni boshidan tushunib olaylik. Har push bitta run. Faylda jobs ostida bitta nom bor, test, demak bitta job. Job bu alohida mashina: ikki nom yozsangiz, ikki mashina parallel ochiladi. Shuni matrix va smoke'da ko'rasiz."
   ],
   [
    "b",
    "Step — job ichidagi qadam: <b>har <code>uses</code> va <code>run</code> — bitta «Run …» qatori</b>",
    "Job ichida qadamlar: faylda steps ostida nechta uses va run bo'lsa, run oynasida shuncha Run qatori. Checkout, setup node, to'rtta buyruq. Har qatorning yonida belgi va soniya, bossangiz, log."
   ],
   [
    "c",
    "Uchtasini siz yozmadingiz: <b><code>Set up job</code>, <code>Post Run …</code>, <code>Complete job</code></b> — GitHub o'zi qo'shadi",
    "Lekin ro'yxatda siz yozmagan qatorlar ham bor. Boshida set up job: mashinani tayyorlash. Oxirida post run, ya'ni tozalash, cache saqlash, va complete job. GitHub ularni har job'ga o'zi qo'shadi. Ularning logida foydali narsalar bor, hozir ko'ramiz."
   ],
   [
    "d",
    "Xulosa: <b>run → job → step</b>; qizil bo'lsa — qaysi job, qaysi qadam, uning logi",
    "Xulosa: run, job, step. Run yashil yoki qizil. Qizil bo'lsa qaysi job, qaysi qadam, deb pastga tushasiz va o'sha qadamning logini o'qiysiz. Endi GitHub qo'shgan qadamlarning ichiga qaraymiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Tayyor qadamlar yashirin emas: Set up job mashinani aytadi, checkout bo'sh papkada git init va fetch --depth=1 qiladi, setup-node tayyor Node'ni topadi",
  "seg": [
   [
    "a",
    "<code>Set up job</code> logi: <b>runner <code>ubuntu-26.04</code>, token ruxsati <code>Contents: read</code></b>, action'lar yuklab olinadi",
    "Run'ni oching, set up job qadamini bosing. Mashina: image ubuntu yigirma olti nol to'rt. Ubuntu latest endi shu, oktabrdan o'zgardi. GitHub token ruxsati: contents read, faqat o'qiydi. Keyin download action repository: checkout va setup node tayyor qadamlari yuklab olinadi, SHA bilan."
   ],
   [
    "b",
    "<code>checkout</code> ichida: <b>papkani tozalaydi, <code>git init</code>, <code>fetch --depth=1</code></b> — faqat oxirgi commit",
    "Checkout qadamini bosing. Syncing repository, keyin deleting the contents: papka tozalanadi. Git init: bo'sh repo. Git fetch depth bir: faqat oxirgi commit olinadi, butun tarix emas, tez bo'lsin. Mana nega CI/CD-1 da checkout'siz papka bo'sh edi."
   ],
   [
    "c",
    "<code>setup-node</code> ichida: <b>«Found in cache» — runner'da tayyor Node 24.22.1, npm 11.19.1</b>",
    "Setup node: node version yigirma to'rt, cache npm. Found in cache: runner'da Node yigirma to'rt allaqachon bor, yuklab olinmadi. Node v yigirma to'rt yigirma ikki bir, npm o'n bir o'n to'qqiz. CI/CD-1 dagi tuzoq shu yerda ko'rinadi: versiya raqamini log aytadi."
   ],
   [
    "d",
    "Xulosa: <b><code>uses</code> — boshqalar yozgan skript</b>, logi ochiq; mashina, versiya, ruxsat — shu yerda",
    "Xulosa: uses yashirin narsa emas, boshqalar yozgan skript, logi ochiq. Mashina qaysi, Node qaysi, token nimaga ruxsatli, hammasi shu uch qadamning logida. Xato tushunarsiz bo'lsa, avval shu yerga qarang. Endi qizil run'ni o'qiymiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Run sahifasidagi annotatsiya — xatoning birinchi satri; to'liq sabab qizil qadamning logida: tsc run'ida uchta annotatsiya, logda sakkiz satr",
  "seg": [
   [
    "a",
    "Run sahifasining yuqorisi — <b>annotatsiyalar</b>: <code>##[error]</code> bilan boshlangan satrlar, qisqa",
    "Qizil run'ni oching, CI/CD-1 dagi tsc run'i. Yuqorida annotations: uchta satr. Process completed with exit code two, no overload matches this call, va tur xatosining birinchi qatori. Bular logdagi error belgisi bilan boshlangan satrlar, GitHub ularni yuqoriga chiqaradi."
   ],
   [
    "b",
    "To'liq sabab — <b>qizil qadamning logida</b>: fayl, satr, ustun, ikki xato, nima nimaga mos emas",
    "Lekin annotatsiya qisqa. Qizil qadamni bosing: npx tsc. Logda hammasi: user service ts, yigirmanchi satr, qirq ikkinchi ustun, TS ikki uch ikki ikki, number string'ga mos emas, va yigirma ikkinchi satrda ikkinchi xato. Sabab shu yerda, annotatsiyada emas."
   ],
   [
    "c",
    "Test qizil run'ida annotatsiya <b>faqat «exit code 1»</b> — Jest xatosi logda: FAIL, qaysi test, qaysi satr",
    "Test qizil bo'lgan run'da annotatsiya yanada kam: faqat process completed with exit code one. Jest error belgisi bilan yozmaydi. Qaysi test, nima kutilgan, nima keldi, o'ttiz yettinchi satr, hammasi npm test qadamining logida. Annotatsiya sizga faqat qaysi qadam ekanini aytadi."
   ],
   [
    "d",
    "Xulosa: <b>belgi → qizil job → qizil qadam → log</b>; annotatsiya yo'l ko'rsatadi, sabab logda",
    "Xulosa: qizil run'ni o'qish tartibi: belgi, qizil job, qizil qadam, uning logi. Annotatsiya yo'l ko'rsatkich, sabab logda. O'quvchi lentam qizil, nima qilay desa, shu to'rt qadamni birga bosing. Endi tekshirib olaylik."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Run qizil. Annotatsiyada faqat Process completed with exit code 1. — npm test qadamida. Sababni qayerdan o'qiysiz?",
  "q": "Qizil run'ni o'qishni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Run qizil, annotatsiyada faqat process completed with exit code one, npm test qadamida. Qaysi test yiqilganini qayerdan o'qiysiz? Variantni tanlang.",
  "ok": "To'g'ri. Qizil qadamni bosasiz: npm test. Logda Jest'ning to'liq chiqishi: FAIL, qaysi test, kutilgan va kelgan, o'ttiz yettinchi satr. Annotatsiya faqat qadamni ko'rsatdi, chunki Jest error belgisi bilan yozmaydi. Demak, annotatsiya manzil, log esa sabab; lokalda qayta yurgizish shart emas.",
  "okShort": "Qizil qadam logi — to'liq Jest chiqishi. Annotatsiya — faqat manzil.",
  "hint": "4-ekrandagi tartib: belgi → job → qadam → ?",
  "demak": "Annotatsiya — manzil (qaysi qadam); sabab — qizil qadamning logida. Jest xatosi annotatsiyaga chiqmaydi.",
  "correct": 1,
  "opts": [
   "Annotatsiyani bosib — u to'liq xatoni ochadi",
   "npm test qadamini bosib — logda FAIL va test nomi",
   "Set up job logidan — u hamma xatoni yig'adi",
   "Commit'ni lokalda qayta yurgizib — GitHub logi to'liq emas"
  ],
  "wrong": {
   "0": "Annotatsiya qisqa satr, ochilmaydi — Jest uchun faqat «exit code 1».",
   "2": "Set up job — mashina va ruxsatlar; qadam xatolari u yerda yo'q.",
   "3": "GitHub logi — terminalingizdagi to'liq matn; lokalda qayta yurgizish shart emas."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · cache",
  "title": "cache: npm nima qiladi: birinchi run «Cache saved», ikkinchisi «Cache hit» — npm ci 11 s → 5 s; mainda esa «not found»: cache tarmoqqa bog'liq",
  "seg": [
   [
    "a",
    "<code>setup-node</code> <code>cache: npm</code> — birinchi run'da <b>«npm cache is not found»</b>, oxirida «Cache saved with the key»",
    "Ci yml'dagi cache npm satri nima qiladi? Birinchi run'ning setup node logida: npm cache is not found, cache yo'q. Oxirida, post run setup node qadamida: cache saved with the key, node cache, Linux, npm va uzun raqam. Npm si ay o'n bir soniya yurdi."
   ],
   [
    "b",
    "Ikkinchi run: <b>«Cache hit» — <code>npm ci</code> 11 soniyadan 5 ga tushdi</b>; kalit — lock faylning hash'i",
    "Ikkinchi run, o'sha tarmoq: cache hit for, o'sha kalit. Npm si ay besh soniya: paketlar internetdan emas, saqlangan cache'dan. Kalitdagi uzun raqam package lock json'ning hash'i: lock o'zgarsa, kalit o'zgaradi, cache qaytadan yig'iladi. Shuning uchun lock commit'da bo'lishi kerak."
   ],
   [
    "c",
    "<code>main</code>dagi birinchi run: yana <b>«not found»</b> — cache tarmoqqa bog'liq, <code>ci-sinov</code>niki <code>main</code>ga o'tmaydi",
    "Endi main tarmog'idagi birinchi run: yana npm cache is not found, npm si ay yana o'n bir soniya. Cache tarmoqqa bog'liq: ci sinov tarmog'ida saqlangani main'ga o'tmaydi. Main'da bir marta yashil bo'lgach, undan keyingi run'lar va tarmoqlar o'sha cache'ni oladi."
   ],
   [
    "d",
    "Xulosa: <b>cache — tezlik, to'g'rilik emas</b>; «not found» xato emas, «hit» — lock o'zgarmagan degani",
    "Xulosa: cache tezlik uchun, to'g'rilik uchun emas: cache bo'lmasa ham lenta to'g'ri ishlaydi, faqat sekinroq. Logda not found ko'rsangiz, bu xato emas. Hit ko'rsangiz, lock o'zgarmagan. Endi o'z run'ingizni o'qiysiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 12 daqiqa",
  "title": "CI/CD-1 dagi reponingizda ikki run'ni oching: Set up job, checkout, cache «saved» va «hit», npm ci soniyalari",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z reponingizdagi oxirgi ikki run</b>, uchta log va cache",
    "Endi navbat sizga. CI/CD-1 dagi reponingizni GitHub'da oching, Actions bo'limi. Oxirgi ikki run'ni o'qiysiz: set up job, checkout, setup node loglari va cache. Push kerak emas, faqat o'qish. O'n ikki daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>Set up job</code>da mashina va ruxsat</b>, <code>checkout</code>da <code>git init</code> va <code>fetch --depth=1</code>",
    "Birinchi qadamda oxirgi run'ni ochib, set up job logidan image va GITHUB TOKEN ruxsatini topasiz. Ikkinchisida checkout logidan git init va fetch depth bir satrlarini. Uchinchi ekrandagi bilan solishtiring."
   ],
   [
    "c",
    "3–4-qadam: <b>ikki run'da cache: «saved» va «hit»</b>, <code>npm ci</code> soniyalari; isbot — hit satri",
    "Uchinchi qadamda eski run'ning post run setup node logida cache saved, yangisida setup node logida cache hit satrini topasiz. To'rtinchisida ikkala run'da npm si ay necha soniya yurganini yozib oling. Isbot maydoniga cache hit satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz run'ning har qadamini ochib o'qiy olasiz."
   ]
  ],
  "steps": [
   {
    "t": "Set up job",
    "cmds": [
     "GitHub → Actions → oxirgi run → job test → Set up job"
    ],
    "exp": "Image: ubuntu-… · GITHUB_TOKEN Permissions · Download action repository"
   },
   {
    "t": "checkout",
    "cmds": [
     "Run actions/checkout@v4 logi"
    ],
    "exp": "Deleting the contents of · git init · fetch … --depth=1"
   },
   {
    "t": "Cache",
    "cmds": [
     "eski run → Post Run actions/setup-node@v4",
     "yangi run → Run actions/setup-node@v4"
    ],
    "exp": "Cache saved with the key: node-cache-… · Cache hit for: node-cache-…"
   },
   {
    "t": "Soniyalar",
    "cmds": [
     "ikkala run'da Run npm ci yonidagi soniya"
    ],
    "exp": "ikkinchisi kamroq"
   }
  ],
  "proof": {
   "label": "Yangi run'dagi «Cache hit» satri",
   "placeholder": "masalan: Cache hit for: node-cache-Linux-x64-npm-…",
   "re": "Cache hit for: node-cache-",
   "flags": "i",
   "wrong": "Run actions/setup-node@v4 logidagi Cache hit for: node-cache-… satrini qo'ying."
  },
  "trouble": [
   [
    "Ikkala run'da npm cache is not found",
    "ikkinchi run boshqa tarmoqda yoki cache: npm satri yo'q — bir tarmoqda ketma-ket ikki run bo'lsin"
   ],
   [
    "Cache saved yo'q",
    "run qizil tugagan — Post Run cache'ni faqat npm ci o'tganda saqlaydi; yashil run'ni oching"
   ],
   [
    "Log ochilmaydi (bo'sh)",
    "run hali yuryapti yoki 90 kundan eski — yangi push qiling"
   ],
   [
    "Image: ubuntu-24.04 chiqdi",
    "runner surati sanaga qarab farq qiladi — xato emas, raqamni yozing"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · matrix",
  "title": "strategy.matrix.node-version: [22, 24] — bitta job ta'rifi, ikki mashina: test (22) qizil, test (24) esa… bekor qilindi — fail-fast",
  "seg": [
   [
    "a",
    "Matrix: <b><code>strategy.matrix</code> — bitta job, bir nechta qiymat</b>; <code>${{ matrix.node-version }}</code> har mashinaga o'z raqami",
    "Matrix bilan boshlaymiz. Ci yml'da job ostiga strategy, matrix, node version, qavsda yigirma ikki va yigirma to'rt. Setup node'da esa raqam o'rniga matrix node version. Bitta job ta'rifi, GitHub undan ikki mashina ochadi: test yigirma ikki va test yigirma to'rt, parallel."
   ],
   [
    "b",
    "Run: <b><code>test (22)</code> qizil — <code>npm ci</code>, o'sha lock tuzog'i</b>; <code>test (24)</code> «cancelled»",
    "Push, run. Chapda ikki job. Test yigirma ikki qizil: npm si ay, CI/CD-1 dagi o'sha tuzoq, missing webpack from lock file. Test yigirma to'rt esa yashil ham, qizil ham emas: cancelled, bekor qilindi, yigirma ikkinchi soniyada, tsc yurayotganda."
   ],
   [
    "c",
    "Demak, sabab: <b>fail-fast — bittasi yiqilsa qolganini bekor qiladi</b> (odatiy sozlama)",
    "Demak, sabab annotatsiyada: the strategy configuration was canceled because test yigirma ikki failed. Bu fail fast: matrix'da bitta mashina yiqilsa, GitHub qolganini bekor qiladi, vaqt va mashina tejaydi. Odatiy sozlama shu. Lekin siz yigirma to'rtda nima bo'lganini bilmay qolasiz."
   ],
   [
    "d",
    "Xulosa: <b>matrix mashinani emas, versiyani sinaydi</b>; natija to'liq kerak bo'lsa — <code>fail-fast: false</code>",
    "Xulosa: matrix bitta kodni bir nechta versiyada sinaydi. Fail fast tez, lekin javobi chala: yigirma to'rt yashilmi, bilmadik. To'liq javob kerak bo'lsa, fail fast false. Keyingi run'da shuni qo'yamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · matrix",
  "title": "fail-fast: false — ikkala mashina oxirigacha: test (22) qizil, test (24) yashil; run qizil, lekin javob to'liq: kod 24 da ishlaydi, 22 da lock o'qilmaydi",
  "seg": [
   [
    "a",
    "<code>fail-fast: false</code> — <b>ikkala mashina oxirigacha yuradi</b>, run baribir qizil (22 yiqildi)",
    "Strategy ostiga fail fast false qo'shamiz. Push. Endi ikkala job oxirigacha yurdi: test yigirma ikki qizil, test yigirma to'rt yashil, to'rtala qadam. Run umuman qizil, chunki bittasi yiqildi, lekin javob to'liq."
   ],
   [
    "b",
    "22 ning logi — <b>CI/CD-1 dagi o'sha xato</b>: npm 10 lock'ni o'qiy olmaydi; 24 — hammasi yashil",
    "Yigirma ikkining npm si ay logi: missing webpack from lock file, CI/CD-1 o'n yettinchi ekrandagi xato. Yigirma to'rt: npm si ay, tsc, test, build, hammasi yashil. Matrix sizga aniq aytdi: bu loyiha Node yigirma to'rtda ishlaydi, yigirma ikkida lock o'qilmaydi."
   ],
   [
    "c",
    "Matrix kimga kerak: <b>kutubxona yozsangiz — ha</b>, bot yoki sayt — mashinangizdagi bitta Node yetadi",
    "Matrix kimga kerak? Kutubxona yozsangiz, uni har xil Node'da ishlatishadi, matrix shart. OrderBotNest kabi bot yoki sayt bitta serverda, bitta Node'da yuradi: mashinangizdagi raqam yetadi. O'quvchi darsida matrix parallel lentalar deb chizilgan, uchta Node."
   ],
   [
    "d",
    "Xulosa: <b>matrix — bir nechta versiya, parallel</b>; <code>fail-fast</code> tez, <code>false</code> — to'liq javob",
    "Xulosa: matrix bitta faylni bir nechta versiyada parallel sinaydi. Fail fast tez to'xtatadi, false to'liq javob beradi. Loyihangizga kerak bo'lsa qo'ying, bo'lmasa bitta Node, mashinangizdagi. Endi tekshirib olaylik."
   ]
  ]
 },
 "10": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "matrix [22, 24], fail-fast yozilmagan. test (22) 10-soniyada yiqildi, test (24) hali tscda. test (24) bilan nima bo'ladi?",
  "q": "Matrix'ni ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Matrix yigirma ikki va yigirma to'rt, fail fast yozilmagan. Test yigirma ikki o'ninchi soniyada yiqildi, test yigirma to'rt hali tsc'da. Yigirma to'rt bilan nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Fail fast yozilmasa, u true: bitta mashina yiqilishi bilan GitHub qolganini bekor qiladi, cancelled. Yigirma to'rt tsc'da to'xtatildi, natijasi noma'lum. To'liq javob kerak bo'lsa, fail fast false yoziladi. Demak, matrix'da cancelled ko'rsangiz, bu o'sha job'ning xatosi emas, boshqasining yiqilgani.",
  "okShort": "<code>fail-fast</code> odatiy <code>true</code> — bittasi yiqilsa qolgani «cancelled». To'liq javob — <code>fail-fast: false</code>.",
  "hint": "8-ekrandagi annotatsiya: «canceled because … failed» — kim kimni to'xtatdi?",
  "demak": "matrix'da «cancelled» — o'sha job'ning xatosi emas: boshqa job yiqildi, <code>fail-fast</code> to'xtatdi.",
  "correct": 2,
  "opts": [
   "Oxirigacha yuradi — matrix job'lari bir-biriga bog'liq emas",
   "Oxirigacha yuradi, lekin natijasi run'ga kirmaydi",
   "Bekor qilinadi — odatiy fail-fast qolganini to'xtatadi",
   "Qayta boshlanadi — GitHub 22 ning o'rniga 24 ni ishlatadi"
  ],
  "wrong": {
   "0": "matrix job'lari bitta strategy'ga bog'langan — fail-fast ularni birga boshqaradi.",
   "1": "Yurmaydi: 22-soniyada «cancelled», tsc tugamadi.",
   "3": "GitHub mashinani almashtirmaydi; har qiymat — o'z mashinasi."
  }
 },
 "11": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "ci.ymlga matrix [22, 24] qo'shing, ikki job'ni ko'ring, fail-fast: false bilan to'liq javob oling, keyin bitta Node'ga qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z reponingizda matrix</b>, ikki mashina, fail-fast ikki holatda",
    "Endi navbat sizga. O'z reponingizdagi ci yml'ga matrix qo'shasiz, yigirma ikki va yigirma to'rt, push qilib ikki job'ni ko'rasiz. Keyin fail fast false bilan to'liq javob, oxirida bitta Node'ga qaytarasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>matrix va push</b> — <code>test (22)</code> qizil, <code>test (24)</code> cancelled",
    "Birinchi qadamda strategy matrix va setup node'da matrix node version yozasiz, sakkizinchi ekrandagi kabi. Ikkinchisida push: Actions'da ikki job, yigirma ikki qizil, yigirma to'rt cancelled bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b><code>fail-fast: false</code></b> — 24 yashil; keyin matrix'ni olib, <code>node-version: 24</code>; isbot — 24 job'ining holati",
    "Uchinchi qadamda fail fast false qo'shib push qilasiz: yigirma to'rt yashil, yigirma ikki qizil. To'rtinchisida matrix'ni olib tashlab, node version yigirma to'rtga qaytarasiz, run yashil. Isbot maydoniga uchinchi qadamdagi yigirma to'rt job'ining holatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz matrix yozasiz va cancelled nima ekanini bilasiz."
   ]
  ],
  "steps": [
   {
    "t": "matrix",
    "cmds": [
     "ci.yml: strategy: → matrix: → node-version: [22, 24]",
     "setup-nodeda node-version: ${{ matrix.node-version }}"
    ],
    "exp": "8-ekrandagi 18 satr"
   },
   {
    "t": "Push",
    "cmds": [
     "git commit -am \"ci: matrix\" && git push mine HEAD:main"
    ],
    "exp": "test (22) ✗ · test (24) cancelled"
   },
   {
    "t": "fail-fast: false",
    "cmds": [
     "strategy: ostiga fail-fast: false",
     "push"
    ],
    "exp": "test (22) ✗ · test (24) ✓"
   },
   {
    "t": "Qaytarish",
    "cmds": [
     "matrix'ni olib tashlang, node-version: 24",
     "push"
    ],
    "exp": "run ✓ (bitta job)"
   }
  ],
  "proof": {
   "label": "3-qadamda test (24) job'ining holati",
   "placeholder": "masalan: success / yashil",
   "re": "(success|yashil|✓|passed)",
   "flags": "i",
   "wrong": "fail-fast: false bilan 24 job'i oxirigacha yurishi kerak — holatini yozing."
  },
  "trouble": [
   [
    "Bitta job, nomi test",
    "strategy runs-on bilan bir chuqurlikda emas yoki matrix.node-version ishlatilmagan — 8-ekrandagi yml"
   ],
   [
    "Ikkalasi yashil",
    "mashinangizda Node 22 va lock npm 10 bilan yig'ilgan — tuzoq yo'q; kutilgan farq faqat lock npm 11 bilan bo'lsa chiqadi (CI/CD-1 17-ekran)"
   ],
   [
    "Ikkalasi qizil npm ci",
    "lock mos emas (CI/CD-1 14-ekran) — npm install, lock commit'ga"
   ],
   [
    "Invalid workflow file",
    "YAML surilish — strategy: matrix: ikki probel o'ngda, ro'yxat [22, 24]"
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "4-bosqich · smoke va secret",
  "title": "Jest testlari bazasiz (mock). Smoke esa haqiqiy Postgres'ga yozadi — lentada baza yo'q. Yechim: job yoniga vaqtinchalik konteyner — services",
  "seg": [
   [
    "a",
    "Lentada hozir faqat <b>Jest — bazasiz</b>; TgPg darsidagi smoke esa haqiqiy bazaga yozadi",
    "To'rtinchi bosqich. Lentada hozir faqat Jest testlari: mock, baza yo'q, ikki soniya. Lekin Telegraf darsida smoke yozgansiz: npm run smoke, haqiqiy Nest va Telegraf kodi, haqiqiy Postgres, restart va race. U lentada yo'q, chunki runner'da baza yo'q."
   ],
   [
    "b",
    "<code>scripts/smoke.js</code>: <b><code>DATABASE_URL</code>dan <code>shop_smoke</code> bazasini o'zi ochadi</b>, oxirida o'chiradi",
    "OrderBotNest'da scripts papkasidagi smoke js'ni oching. Base url: DATABASE URL muhit o'zgaruvchisidan. Undan shop smoke nomli vaqtinchalik baza ochadi, template zero bilan, oxirida o'chiradi. Demak, smoke'ga faqat bitta narsa kerak: ishlayotgan Postgres va unga manzil."
   ],
   [
    "c",
    "Yechim: <b><code>services</code> — job mashinasi yonida vaqtinchalik konteyner</b>, <code>postgres:18</code>, <code>localhost:5432</code>",
    "GitHub'da bu services deyiladi: job'ga ikkinchi konteyner, bu yerda postgres o'n sakkiz. U job bilan birga ochiladi, mashinada localhost besh ming to'rt yuz o'ttiz ikkida turadi, job tugashi bilan o'chadi. Hech qanday server, hech qanday tashqi baza kerak emas."
   ],
   [
    "d",
    "Xulosa: <b>unit test bazasiz, smoke — services bilan</b>; lentada ikkalasi: tez va to'liq",
    "Xulosa: unit testlar bazasiz, tez. Smoke bazali, to'liq. Lentada ikkalasi bo'lsin: avval test, keyin smoke, uning yonida Postgres konteyneri. Keyingi ekranda shu job'ni yozamiz va haqiqiy run'da ko'ramiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · smoke va secret",
  "title": "Ikkinchi job smoke: needs: test, services: postgres:18 healthcheck bilan, npm run smoke — run'da Initialize containers, keyin NATIJA: 5/5 ✓",
  "seg": [
   [
    "a",
    "Ikkinchi job: <b><code>smoke:</code> <code>needs: test</code></b> — test qizil bo'lsa smoke boshlanmaydi, Postgres ko'tarilmaydi",
    "Ci yml'ga jobs ostiga ikkinchi nom qo'shamiz: smoke. Birinchi satri needs test: avval test job'i yashil bo'lsin, keyin smoke. Test qizil bo'lsa smoke boshlanmaydi, Postgres ham ko'tarilmaydi, vaqt bekor ketmaydi."
   ],
   [
    "b",
    "<code>services: postgres</code>: <b>image, parol, baza nomi, port va healthcheck</b> — <code>pg_isready</code> tayyor demaguncha kutadi",
    "Services ostida postgres: image postgres o'n sakkiz. Env: parol va baza nomi shop, smoke shop smoke'ni shundan ochadi. Ports: besh ming to'rt yuz o'ttiz ikki. Options: healthcheck, pg is ready. Baza tayyor demaguncha qadamlar boshlanmaydi, aks holda smoke ulanolmay yiqilardi."
   ],
   [
    "c",
    "Qadamlar: checkout, setup-node, <code>npm ci</code>, <b><code>npm run smoke</code> — <code>env: DATABASE_URL</code> konteynerga</b>; run'da «Initialize containers»",
    "Qadamlar tanish: checkout, setup node, npm si ay. Keyin npm run smoke, uning env'ida DATABASE URL: postgres, parol postgres, localhost, shop. Push. Run'da ikki job: test yashil, keyin smoke: birinchi qadam initialize containers, Postgres ko'tarildi, o'n ikki soniya."
   ],
   [
    "d",
    "Xulosa: smoke logida <b><code>NATIJA: 5/5 ✓</code></b> — restart va race lentada; <code>Stop containers</code> — baza o'chdi",
    "Xulosa: npm run smoke qadamining logi: vaqtinchalik baza shop smoke, restart uchta yashil, race ikkita yashil, natija besh besh. Oxirida stop containers: baza o'chdi, iz qolmadi. Endi haqiqiy bot sinovi har push'da. Keyingi ekranda DATABASE URL qayerdan kelishini chuqurroq ko'ramiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Konteyner paroli sir emas — env:da ochiq. Haqiqiy baza yoki bot tokeni — Secrets: logda yulduzcha (maska). Secret nomi xato bo'lsa xato chiqmaydi — qiymat bo'sh, smoke «DATABASE_URL topilmadi»",
  "seg": [
   [
    "a",
    "Konteyner paroli — <b><code>env:</code>da ochiq, bu to'g'ri</b>: u faqat job ichida yashaydi, job bilan o'ladi",
    "O'n uchinchi ekranda DATABASE URL'ni yml'ga ochiq yozdik, parol postgres. Bu to'g'ri: konteyner job ichida tug'iladi va o'ladi, unga tashqaridan hech kim ulanolmaydi. Sir emas. Ikkala AI ham shunday qildi, keyin ko'rasiz."
   ],
   [
    "b",
    "Haqiqiy baza, bot tokeni — <b>GitHub Secrets</b>: Settings'da yoziladi, yml'da <code>${{ secrets.NOM }}</code>, logda <code>***</code>",
    "Lekin haqiqiy baza manzili yoki bot tokeni yml'ga yozilmaydi: repo ochiq, tarix abadiy. Ular GitHub'da repo settings, secrets and variables, actions bo'limiga yoziladi. Yml'da faqat nomi: secrets DATABASE URL. Logda qiymati yulduzcha bo'lib chiqadi, maska."
   ],
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: <code>ci.yml</code>da yonib turgan secret nomi ustiga bosing",
    "Endi buzamiz. Buzishni o'zingiz qilasiz: ci yml'ning qirq birinchi satrida secrets DATABASE URL yonib turibdi, ustiga bosing: nomdan bitta harf tushib qoladi.",
    "<b>ci.yml</b> 41-satridagi <b><code>secrets.DATABASE_URL</code></b> ustiga bosing — nomdan bitta harf tushib qoladi."
   ],
   [
    "c",
    "Buzildi: <b><code>secrets.DATABSE_URL</code> — bitta harf tushib qoldi</b>; xato yo'q, qiymat bo'sh — smoke «DATABASE_URL topilmadi»",
    "Harf tushib qoldi: secrets DATABSE URL. Push. GitHub xato bermaydi: bunday secret yo'q, demak qiymat bo'sh. Smoke qadami qizil: SMOKE XATO, DATABASE URL topilmadi, chiqish kodi ikki. Logga qarang: xabardagi namuna manzilning paroli yulduzcha, runner URL parolini o'zi yashirdi."
   ],
   [
    "d",
    "Xulosa: <b>env — konteyner, secrets — tashqi</b>; «topilmadi» ko'rsangiz — yml'dagi secret nomini tekshiring",
    "Xulosa: konteyner uchun env, tashqi resurs uchun secrets. Secret nomi xato bo'lsa GitHub indamaydi, qiymat bo'sh keladi va dastur yiqiladi. Logda topilmadi yoki undefined ko'rsangiz, avval yml'dagi secret nomini Settings'dagi bilan solishtiring. Endi shu satrni o'zingiz topasiz."
   ]
  ]
 },
 "15": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Bu ci.yml bilan smoke job qizil: «DATABASE_URL topilmadi». Postgres ko'tarildi, healthcheck o'tdi. Sababchi satrni toping",
  "q": "Secret nomini ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Bu ci yml bilan smoke job qizil: DATABASE URL topilmadi. Postgres ko'tarildi, healthcheck o'tdi. Bo'lakda bitta satr noto'g'ri secret nomiga murojaat qiladi. O'sha satrni bosing.",
  "ok": "To'g'ri. Secrets DATABSE URL: E harfi tushib qolgan. GitHub bunday secret'ni topmadi, lekin xato bermadi, bo'sh qiymat berdi. Smoke bo'sh manzil bilan ishga tushdi va o'zi to'xtadi: DATABASE URL topilmadi. Ekranda tuzatilgan satr. Demak, secret bilan bog'liq xatoni avval nomdan qidiring.",
  "okShort": "<code>DATABSE</code> — bitta harf yo'q; GitHub indamaydi, qiymat bo'sh, dastur yiqiladi. Nomni Settings bilan solishtiring.",
  "hint": "${{ secrets.… }} ichidagi nomni harfma-harf o'qing: DATABASE_URL to'liqmi?",
  "task": "Qoida: <code>${{ secrets.NOM }}</code> — NOM Settings'dagi bilan harfma-harf bir xil bo'lishi kerak; yo'q nom — bo'sh qiymat, xato yo'q. Bu bo'lakda bitta satr noto'g'ri nomga murojaat qiladi. <b>O'sha satrni bosing.</b>"
 },
 "16": {
  "type": "Lesson",
  "kicker": "5-bosqich · PR va AI",
  "title": "Yangi ish — alohida tarmoqda; pull request ochilganda lenta yana yuradi va PR sahifasida tekshiruv turadi; yashil — merge; README'da badge lenta holatini ko'rsatadi",
  "seg": [
   [
    "a",
    "Yangi ish — <b>alohida tarmoq <code>lenta-smoke</code></b>; push — tarmoqda ham run (<code>on: push</code>)",
    "Smoke job'ni main'ga to'g'ridan emas, pull request orqali qo'shamiz, jamoada shunday. Terminalda git checkout b lenta smoke, ci yml'ni o'zgartirib commit, git push u origin lenta smoke. Actions'da run: on push har tarmoqqa tegishli."
   ],
   [
    "b",
    "Pull request: <b><code>on: pull_request</code> — yana run</b>; PR sahifasida «checks»: <code>test</code> ✓, <code>smoke</code> ✓",
    "GitHub'da pull request ochamiz: lenta smoke'dan main'ga. Ci yml'dagi on pull request ishga tushadi: yana bir run, bu safar pull request hodisasi. PR sahifasining pastida checks: test yashil, smoke yashil. Merge tugmasi ochiq. Qizil bo'lsa, bu yerda ko'rinadi, main'ga o'tmaydi."
   ],
   [
    "c",
    "Merge — <b>main'da merge commit, yana run</b>: ikki job yashil; endi main'da smoke ham bor",
    "Merge bosamiz. Main'da merge commit paydo bo'ladi, on push, yana run: test va smoke yashil. Endi main'dagi lenta ikki job'li. Tarix ham tushunarli: qaysi PR nimani qo'shgani ko'rinadi, CI/CD-1 dagi to'g'ridan push'dan farqi shu."
   ],
   [
    "d",
    "Xulosa: <b>README'ga badge</b> — <code>actions/workflows/ci.yml/badge.svg</code>: ochgan odam lentani ko'radi",
    "Xulosa: tarmoq, pull request, checks, merge. Va README'ning birinchi satriga badge: workflows ci yml badge svg. Reponi ochgan har kim lenta yashilmi, qizilmi, darhol ko'radi. O'quvchi darsida bu tablo deyiladi. Endi AI'ga o'tamiz."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: ikki AI'ga bitta prompt — «smoke'ni ham qo'sh, unga PostgreSQL kerak»; ikkalasi services: postgres yozdi va lentada birinchi urinishda yashil",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>prompt — «smoke'ni ham qo'sh, unga PostgreSQL kerak»</b>, services so'zi yo'q",
    "CI/CD-1 dagi kabi oxirgi bosqich AI bilan. Prompt: OrderBotNest'da npm run smoke bor, unga PostgreSQL kerak, DATABASE URL. Workflow'ga shu smoke'ni ham qo'shib ber. Services, konteyner, healthcheck, secret, bu so'zlar promptda yo'q. Har AI loyihaning alohida nusxasida, mavjud ci yml bilan."
   ],
   [
    "b",
    "Ikkalasi <b><code>services: postgres:18</code>, healthcheck, <code>POSTGRES_DB: shop</code></b> yozdi — README'dagi versiyadan",
    "Ikkalasi ham services postgres o'n sakkiz yozdi, README'dagi versiyadan. Parol, baza nomi shop, port, va healthcheck pg is ready. Smoke qadami build'dan keyin, env'ida DATABASE URL. Birinchisi env'ni faqat smoke qadamiga, ikkinchisi butun job'ga berdi."
   ],
   [
    "c",
    "Lentada: <b>ikkalasi birinchi urinishda yashil</b> — <code>Initialize containers</code>, <code>NATIJA: 5/5 ✓</code>",
    "Ikkalasini ham sinov tarmog'iga push qildik. Ikkalasi yashil: initialize containers, Postgres ko'tarildi, npm run smoke, natija besh besh. CI/CD-1 dagidan farqli, bu safar AI birinchi urinishda to'g'ri qildi. Nega shunday, hozir ko'ramiz."
   ],
   [
    "d",
    "Xulosa: AI <b>secret ishlatmadi — to'g'ri</b> («konteyner — sir emas»); yashil, lekin tekshiruv hali oldinda",
    "Xulosa: ikkala AI secret ishlatmadi va birinchisi sababini yozdi: konteyner paroli faqat job ichida, sir emas. To'g'ri fikr. Ikkalasi yashil. Lekin yashil hali qabul emas: keyingi ekranda to'rt savol bilan o'qiymiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Nega bu safar yashil: AI faylni noldan yozmadi, sizning ci.ymlni (node 24) o'zgartirdi — tayanch to'g'ri bo'lsa AI ham to'g'ri; qabul — to'rt savol",
  "seg": [
   [
    "a",
    "Farq: CI/CD-1 da AI <b>noldan yozdi</b> (node 22 → qizil); bu safar <b>sizning faylingizni o'zgartirdi</b> (24 → yashil)",
    "CI/CD-1 da AI workflow'ni noldan yozdi va node yigirma ikki qo'ydi, qizil. Bu safar repoda sizning ci yml'ingiz bor edi, node yigirma to'rt bilan. AI uni o'zgartirdi, noldan yozmadi. Tayanch to'g'ri bo'lsa, AI ham to'g'ri davom etadi. Shuning uchun avval o'zingiz yozing, keyin AI'ga bering."
   ],
   [
    "b",
    "Ikki farq: <b><code>env</code> qayerda</b> — 1-AI faqat smoke qadamida (torroq, yaxshi), 2-AI butun job'ga; smoke alohida job emas",
    "Ikkalasini solishtiring. Birinchi AI DATABASE URL'ni faqat smoke qadamiga berdi, ikkinchisi butun job'ga: ikkalasi ishlaydi, torrog'i yaxshiroq. Ikkalasi smoke'ni alohida job qilmadi, oxirgi qadam qildi: ishlaydi, lekin test qizil bo'lsa ham Postgres ko'tariladi. Tavsiyada needs test bilan alohida job."
   ],
   [
    "c",
    "1-AI o'zi sezdi: <b>smoke ichida yana <code>nest build</code> — build ikki marta</b>; AI izohini o'qing",
    "Birinchi AI yana bir narsani o'zi aytdi: smoke ichida yana nest build bor, build ikki marta yuradi, bir necha soniya ortiqcha. Siz hal qilasiz: npm run build qadamini qoldirasizmi, olasizmi. AI'ning izohlarini o'qing, ko'pincha eng foydali joyi shu."
   ],
   [
    "d",
    "Xulosa: AI smoke workflow'iga <b>to'rt savol</b>: services + healthcheck · <code>DATABASE_URL</code> yetib boradimi · tartib · secret kerakmi",
    "Xulosa, to'rt savol. Services va healthcheck bormi. DATABASE URL smoke qadamiga yetib boradimi, env qayerda. Tartib: smoke build'dan keyinmi. Secret kerakmi: konteyner uchun yo'q, tashqi baza uchun ha. To'rttasiga javob bo'lsa, push va run. Endi tekshirib olaylik."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI services: postgres yozdi va DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop ni yml'da ochiq qoldirdi. Bu xatomi?",
  "q": "AI workflow'ini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI services postgres yozdi va DATABASE URL'ni, parol postgres bilan, yml'da ochiq qoldirdi. Bu xatomi? Variantni tanlang.",
  "ok": "To'g'ri. Bu konteyner job bilan ochiladi va job bilan o'chadi, unga tashqaridan hech kim ulanolmaydi, parol hech narsani ochmaydi. Secret tashqi resurs uchun: haqiqiy baza, bot tokeni. Demak, secret kerakmi deb so'raganda, bu qiymat job'dan tashqarida nimani ochadi, deb so'rang.",
  "okShort": "Konteyner — job ichida, job bilan o'chadi → <code>env</code> yetadi. Tashqi resurs → Secrets.",
  "hint": "14-ekran: env — konteyner, secrets — tashqi. Bu konteyner job'dan tashqarida bormi?",
  "demak": "Secret savoli: bu qiymat job'dan tashqarida nimani ochadi? Konteyner — hech narsani → <code>env</code>. Prod baza, token → Secrets.",
  "correct": 2,
  "opts": [
   "Xato — har qanday parol, hatto vaqtinchalik ham, Secrets'da bo'lishi shart",
   "Xato — GitHub ochiq parolni ko'rsa run'ni to'xtatadi",
   "Xato emas — konteyner job ichida yashaydi, parol tashqariga chiqmaydi",
   "Xato emas — localhost manzillari hech qachon sir bo'lmaydi"
  ],
  "wrong": {
   "0": "Secrets tashqi resurs uchun; konteyner paroli job bilan o'ladi.",
   "1": "GitHub yml'dagi matnni tekshirmaydi — run yashil (40, 41).",
   "3": "localhost ham sir bo'lishi mumkin (masalan, self-hosted runner'dagi haqiqiy baza) — gap manzilda emas, qiymat nimani ochishida."
  }
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 25 daqiqa",
  "title": "O'z AI'ingizga smoke job yozdiring, to'rt savol bilan tekshiring, alohida tarmoqda PR oching, yashil bo'lgach merge qiling, README'ga badge",
  "seg": [
   [
    "a",
    "Endi siz: <b>AI'ga smoke job</b> — tarmoq, PR, merge, badge",
    "Endi navbat sizga. O'z AI'ingizga smoke job yozdirasiz, promptni pastdagi tugma bilan nusxalaysiz. Alohida tarmoqda push qilib pull request ochasiz, tekshiruv yashil bo'lgach merge, README'ga badge. Yigirma besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>tarmoq va prompt</b>, keyin to'rt savol: services + healthcheck · env · tartib · secret",
    "Birinchi qadamda yangi tarmoq ochasiz: git checkout b lenta smoke. Ikkinchisida promptni AI'ga berib, faylni to'rt savol bilan o'qiysiz: services va healthcheck bormi, DATABASE URL smoke qadamiga yetadimi, smoke build'dan keyinmi, secret kerak emasligi to'g'rimi."
   ],
   [
    "c",
    "3–4-qadam: <b>push, PR, checks yashil, merge</b>, README'ga badge; isbot — PR manzili",
    "Uchinchi qadamda push va GitHub'da pull request: checks'da test va smoke yashil bo'lgach merge. To'rtinchisida README'ning birinchi satriga badge qo'yib, main'ga push qilasiz: nishon passing. Isbot maydoniga merge qilingan PR manzilini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning lentangizda haqiqiy bot sinovi bor va u pull request orqali keldi."
   ]
  ],
  "steps": [
   {
    "t": "Tarmoq",
    "cmds": [
     "git checkout -b lenta-smoke"
    ],
    "exp": "yangi tarmoq"
   },
   {
    "t": "Prompt + to'rt savol",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga",
     "services + pg_isready",
     "env: DATABASE_URL smoke qadamida",
     "smoke builddan keyin / needs: test",
     "secret yo'q (konteyner)"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "PR va merge",
    "cmds": [
     "git push -u mine lenta-smoke",
     "GitHub → New pull request (lenta-smoke → main)",
     "checks ✓ → Merge"
    ],
    "exp": "PR merged · main run ✓ (2 job)"
   },
   {
    "t": "Badge",
    "cmds": [
     "git pull mine main",
     "README 1-satr: ![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)",
     "commit, push"
    ],
    "exp": "README'da «CI passing»"
   }
  ],
  "proof": {
   "label": "Merge qilingan PR manzili",
   "placeholder": "masalan: https://github.com/siz/OrderBotNest/pull/1",
   "re": "github\\.com\\/[^\\s\\/]+\\/[^\\s\\/]+\\/pull\\/\\d+",
   "flags": "",
   "wrong": "PR sahifasining manzilini qo'ying: …/pull/<raqam>."
  },
  "trouble": [
   [
    "smoke qizil: DATABASE_URL topilmadi",
    "env: smoke qadamiga yetmagan (boshqa qadamda yoki job'da yo'q) yoki secret nomi xato (14–15-ekran)"
   ],
   [
    "smoke qizil: ECONNREFUSED 127.0.0.1:5432",
    "services yo'q yoki ports: 5432:5432 yo'q yoki healthcheck yo'q (baza tayyor bo'lmasdan boshlandi)"
   ],
   [
    "smoke qizil: database \"shop\" does not exist",
    "POSTGRES_DB: shop yo'q — smoke shop ga ulanib shop_smoke ochadi"
   ],
   [
    "PR'da checks ko'rinmaydi",
    "on: da pull_request yo'q — on: [push, pull_request]"
   ],
   [
    "Badge «no status»",
    "manzilda workflow fayl nomi xato — ci.yml aynan; yoki main'da hali run yo'q"
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4c-03 · «GitHub Actions — yo'l xaritasini yozish»",
  "title": "O'quvchi darsi: yo'l xaritasi, nuqta, amal, parallel lentalar, yaqin javon, seyf, tablo — siz bugun haqiqiy run'da ko'rgan narsalarning rasmli nomlari",
  "seg": [
   [
    "a",
    "m4c-03 — 23 ekran: <b>yo'l xaritasi, nuqta, amal</b>; matrix, seyf, tablo — simulyatsiyada",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m4c-03, yigirma uch ekran. Yo'l xaritasi bu ci yml, nuqta bu job, amal bu step. Parallel lentalar matrix, seyf secrets, tablo badge. Hammasi ekranda chizilgan simulyatsiya: tugma bosiladi, lenta yuradi, hammasi yashil."
   ],
   [
    "b",
    "Lug'at: <b>o'quvchi so'zi → atama</b>; sinfda ikkalasini birga ayting",
    "Lug'atga qarang: o'quvchi so'zi chapda, atama o'ngda. Jurnal bu qadam logi, yaqin javon bu cache, seyf bu secrets. Sinfda so'zni atamasi bilan birga ayting: parallel lentalar, ya'ni matrix. O'quvchi keyin GitHub'ni ochganda so'zlar tanish bo'ladi."
   ],
   [
    "c",
    "Simulyatsiya ↔ haqiqiy: <b>o'quvchi darsida hammasi yashil</b>, haqiqiy Actions'da 22 qizil, cancelled, <code>***</code>",
    "Farqni bilib turing. O'quvchi darsida matrix uchala lentada yashil, seyf shunchaki yashirin, jurnalda sabab bitta satr. Haqiqiy Actions'da yigirma ikki qizil, yigirma to'rt cancelled, secret nomi xato bo'lsa indamaydi, sabab logning ichida. Siz buni bugun ko'rdingiz, o'quvchi ko'rmagan."
   ],
   [
    "d",
    "Xulosa: <b>simulyatsiya tushuncha beradi, haqiqiy run tajriba</b>; sinfda bittasini ekranda oching",
    "Xulosa: simulyatsiya tushunchani beradi, haqiqiy run tajribani. Sinfda o'z reponingizdagi bitta run'ni proyektorda oching: job, qadam, log, cache hit. O'quvchi yo'l xaritasi va haqiqiy Actions bir narsa ekanini ko'rsin. Keyingi ekranda sinfdagi tuzoqlar."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "O'quvchi darsidagi «Repongiz yo'qmi?» namunasi: lock fayl yo'q — npm ci qizil; \"test\": \"echo ok && exit 0\" — hech qachon qizil bo'lmaydi; uyga vazifadagi «testni buzing» shu yerda to'xtab qoladi",
  "seg": [
   [
    "a",
    "Namuna: <b><code>npm install</code>, <code>echo ok</code> testi, lock yo'q</b> — o'quvchi shu bilan birinchi lentasini yozadi",
    "O'quvchi darsida reposi yo'q o'quvchi uchun namuna bor: package json'da test echo ok, lock fayl yo'q, lenta npm install va npm test. U ishlaydi: npm install o'rnatadi, test ok deydi, yashil. Lekin ikki tuzoq bor."
   ],
   [
    "b",
    "Tuzoq 1: o'quvchi GitHub'ning tayyor andozasini bossa — <b><code>npm ci</code>, lock yo'q — qizil</b>",
    "Birinchi tuzoq: o'quvchi Actions'da GitHub'ning tayyor Node andozasini bossa, u npm si ay yozadi. Lock fayl yo'q, npm si ay yiqiladi: can only install with an existing package lock json. CI/CD-1 o'n uchinchi ekrandagi xabar, boshqa sabab bilan. Yechim: npm install, yoki npm install bir marta lokalda, lock commit'ga."
   ],
   [
    "c",
    "Tuzoq 2: <b><code>echo ok &amp;&amp; exit 0</code> hech qachon qizil bo'lmaydi</b> — uyga vazifadagi «testni buzing» imkonsiz",
    "Ikkinchi tuzoq: test echo ok va exit nol, u hech qachon qizil bo'lmaydi. Uyga vazifada testni ataylab buzing deyiladi, namunada buzib bo'lmaydi. Yechim: o'quvchi o'z Jest loyihasida qilsin, yoki skriptni echo xato va exit bir qilib ko'rsating: qizil, keyin qaytaring."
   ],
   [
    "d",
    "Xulosa: namuna <b>boshlash uchun yaxshi, buzish uchun emas</b>; <code>@v4</code> ishlaydi, ogohlantirish — xato emas",
    "Xulosa: namuna boshlash uchun yaxshi, buzish uchun emas. Va o'quvchi darsidagi checkout v to'rt hozir ham ishlaydi, logda Node yigirma deprecated ogohlantirishi chiqadi, bu xato emas. Oxirgi ekranda siz qo'shadigan narsalar va o'quvchi savollari."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Darsga siz qo'shadigan to'rt narsa, uch vaziyat va o'quvchi savollariga tayyor javoblar",
  "seg": [
   [
    "a",
    "Siz qo'shasiz: <b>haqiqiy run proyektorda, matrix'ning haqiqiy natijasi, secret nomi, namuna tuzoqlari</b>",
    "Darsga siz qo'shadigan to'rt narsa. Jurnaldan sababni topish ekranida haqiqiy run'ni proyektorda oching. Parallel lentalarda ayting: haqiqatda bitta versiya qizil bo'lishi mumkin. Seyfda: nom xato bo'lsa indamaydi. Uyga vazifada namuna tuzoqlarini oldindan ayting."
   ],
   [
    "b",
    "Uch vaziyat: <b>lock yo'q, cancelled, «buzdim, baribir yashil»</b> — xabar va yechim",
    "Uch vaziyat. Npm si ay qizil, lock yo'q: npm install yoki lock commit'ga. Matrix'da cancelled: xato boshqa job'da, fail fast. Testni buzdim, baribir yashil: echo ok buzilmaydi, exit bir yoki Jest loyihasi. Har birining xabari kartada."
   ],
   [
    "c",
    "O'quvchi so'rasa: <b>jurnal qayerda, matrix yashil shartmi, seyfni ko'rsam bo'ladimi, badge qizil</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: jurnal qayerda, matrix'da hammasi yashil bo'lishi shartmi, seyfdagi kalitni ko'rsam bo'ladimi, badge qizil bo'lsa nima. Har biriga bir gap javob bor."
   ],
   [
    "d",
    "Xulosa: o'quvchi «lenta qizil» desa — <b>job → qadam → log</b>; shu bilan sinfga tayyor",
    "Xulosa: o'quvchi lenta qizil desa, u bilan birga uch qadam: qaysi job, qaysi qadam, uning logi. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "ci.ymlda jobs: ostida test: va smoke:. Run'da nechta mashina ochiladi?",
    "o": [
     "Bitta — job'lar navbat bilan bir mashinada",
     "Ikkita — har job alohida mashinada",
     "Qadamlar soni qancha bo'lsa, shuncha",
     "Uchta — GitHub Set up job uchun alohida mashina oladi"
    ],
    "c": 1,
    "e": "Har job — o'z mashinasi; needs tartibini beradi.",
    "s": 2
   },
   {
    "q": "Run actions/checkout@v4 logida git fetch … --depth=1. Bu nima?",
    "o": [
     "Butun tarixni yuklaydi — tezlik uchun siqilgan",
     "Faqat oxirgi commit yuklanadi — tarixsiz, tez",
     "Faqat o'zgargan fayllarni yuklaydi",
     "Bir daqiqa ichida tugamasa to'xtatadi"
    ],
    "c": 1,
    "e": "Runner'ga butun tarix kerak emas.",
    "s": 3
   },
   {
    "q": "Run qizil, annotatsiya: Process completed with exit code 1. — npm testda. To'liq sabab qayerda?",
    "o": [
     "Annotatsiyaning o'zida — boshqa joyda yo'q",
     "Set up job logida — xatolar u yerga yig'iladi",
     "npm test qadamining logida — FAIL va test nomi",
     "Commit sahifasida — GitHub xatoni u yerga yozadi"
    ],
    "c": 2,
    "e": "Annotatsiya — manzil, sabab — log.",
    "s": 4
   },
   {
    "q": "Ikkinchi run'da setup-node logida Cache hit for: node-cache-…. npm ci nima qiladi?",
    "o": [
     "Paketlarni o'rnatmaydi — cache'dan ishlataveradi",
     "Saqlangan yuklamalardan o'rnatadi — tezroq, natija bir xil",
     "Lock faylni cache'dagi eski nusxa bilan almashtirib qo'yadi",
     "Faqat o'zgargan paketlarni yuklaydi"
    ],
    "c": 1,
    "e": "Cache — tezlik, to'g'rilik emas.",
    "s": 6
   },
   {
    "q": "matrix [22, 24], fail-fast yozilmagan; 22 yiqildi. 24?",
    "o": [
     "Oxirigacha yuradi — natijasi alohida ko'rinadi",
     "Bekor qilinadi — «cancelled», natijasi noma'lum",
     "Qayta boshlanadi — 22 ning o'rniga",
     "Oxirigacha yuradi, lekin run baribir yashil deb belgilanadi"
    ],
    "c": 1,
    "e": "Odatiy fail-fast: true.",
    "s": 8
   },
   {
    "q": "Smoke'ga Postgres kerak. Lentada baza qayerdan?",
    "o": [
     "Runner'da Postgres o'rnatilgan — hech narsa yozilmaydi",
     "Mentor serveridagi bazaga ulanadi — manzil Secrets'da",
     "services: postgres — job yonida vaqtinchalik konteyner",
     "Smoke bazasiz rejimga o'tadi — natija yashil"
    ],
    "c": 2,
    "e": "Konteyner job bilan tug'iladi va o'ladi.",
    "s": 13
   },
   {
    "q": "yml'da ${{ secrets.DATABSE_URL }} (harf tushgan). Run?",
    "o": [
     "Fayl xatosi — run ochilmaydi",
     "Annotatsiya: «secret not found» — qadam darhol qizil, log bo'sh",
     "Qiymat bo'sh keladi — dastur o'zi yiqiladi, GitHub indamaydi",
     "Run yashil — bo'sh qiymat bilan smoke o'tadi"
    ],
    "c": 2,
    "e": "«DATABASE_URL topilmadi» — kod 2.",
    "s": 14
   },
   {
    "q": "PR ochildi, checks'da smoke qizil. Nima bo'ladi?",
    "o": [
     "Merge tugmasi butunlay yo'qoladi — GitHub qizil check bilan merge'ni taqiqlaydi",
     "PR o'zi yopiladi — qayta ochish kerak",
     "Qizil ko'rinadi — merge qilmaslik sizning qaroringiz (himoya sozlanmagan)",
     "main'dagi lenta ham qizil bo'ladi"
    ],
    "c": 2,
    "e": "Checks ko'rsatadi; taqiq — branch protection bilan.",
    "s": 16
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
//  MENTOR KURSI · CI/CD-2 «GitHub Actions ichida: qizil run'dan PR'gacha» (v2, F-1104-21)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/24-CICD2-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar cicd2-start (= cicd1-done) → cicd2-done (PR #1 merge: smoke job + badge)
//  Kod, yml va HAQIQIY GitHub Actions run'lari: 03b-kod.gen.jsx (dev/cicd2-kod.py — repo teglari, cicd2v2-yml, cicd1v2-out 10/11/15/18, cicd2v2-out 30–41, gh api)
//  AI tajribasi: manba/cicd2v2-ai/ (ai1 Opus · ai2 Haiku — ikkalasi services: postgres, yashil; secret ishlatmadi)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd2/parts/*.jsx > GithubActionsMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-cicd-02-actions-v1'; // M44: id o'zgarmaydi
const LESSON_TITLE = "GitHub Actions ichida: qizil run'dan PR'gacha";
const C1 = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', pass: '#15803D', fail: '#C2410C', gh: '#1F2328', ci: '#1F6FEB', cd: '#B45309', yml: '#7C3AED', pg: '#336791' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.ya?ml$/.test(f) ? C1.yml : /\.spec\.ts$/.test(f) ? '#99425B' : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : /\.md$/.test(f) ? T.ink3 : null;
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
  ci: '.github/workflows/ci.yml', readme: 'README.md', smoke: 'scripts/smoke.js', pkg: 'package.json', lock: 'package-lock.json',
  ord: 'src/api/order/order.service.ts', ors: 'src/api/order/order.service.spec.ts', usr: 'src/api/user/user.service.ts',
  tg: 'src/api/telegram/telegram.service.ts', ph: 'src/api/telegram/phone.ts', phs: 'src/api/telegram/phone.spec.ts', app: 'src/api/app.controller.ts', apps: 'src/api/app.controller.spec.ts',
};
const BASE_FILES = ['node_modules/', F.ci, F.smoke, 'src/api/app.module.ts', F.app, F.apps, 'src/api/cart/', 'src/api/catalog/', F.ord, F.ors, F.usr, F.tg, F.ph, F.phs, 'src/api/telegram/keyboards.ts', 'src/api/telegram/texts.ts', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, F.lock, F.readme];
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

const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) /* F-1120-02 (M52): act */ };
};
const SPOKEN = [
  ['set up job', 'Set up job'], ['post run', 'Post Run'], ['complete job', 'Complete job'], ['initialize containers', 'Initialize containers'], ['stop containers', 'Stop containers'],
  ['npx tsc no emit', 'npx tsc --noEmit'], ['npm si ay', 'npm ci'], ['ci yml', 'ci.yml'], ['package lock json', 'package-lock.json'], ['package json', 'package.json'], ['smoke js', 'smoke.js'],
  ['setup node', 'setup-node'], ['node version', 'node-version'], ['fail fast false', 'fail-fast: false'], ['fail fast', 'fail-fast'], ['matrix node version', 'matrix.node-version'],
  ['git fetch depth bir', 'git fetch --depth=1'], ['fetch depth bir', 'fetch --depth=1'], ['git init', 'git init'], ['found in cache', 'Found in cache'], ['cache saved with the key', 'Cache saved with the key'], ['cache hit for', 'Cache hit for'],
  ['npm cache is not found', 'npm cache is not found'], ['cache npm', 'cache: npm'], ['cache hit', 'Cache hit'], ['cache saved', 'Cache saved'],
  ['services postgres', 'services: postgres'], ['postgres o\'n sakkiz', 'postgres:18'], ['pg is ready', 'pg_isready'], ['needs test', 'needs: test'], ['npm run smoke', 'npm run smoke'],
  ['DATABASE URL', 'DATABASE_URL'], ['secrets DATABSE URL', 'secrets.DATABSE_URL'], ['secrets DATABASE URL', 'secrets.DATABASE_URL'], ['SMOKE XATO', 'SMOKE XATO'], ['shop smoke', 'shop_smoke'],
  ['pull request', 'pull request'], ['lenta smoke', 'lenta-smoke'], ['badge svg', 'badge.svg'], ['on push', 'on: push'], ['on pull request', 'on: pull_request'],
  ['GITHUB TOKEN', 'GITHUB_TOKEN'], ['contents read', 'Contents: read'], ['download action repository', 'Download action repository'], ['image ubuntu yigirma olti nol to\'rt', 'Image: ubuntu-26.04'],
  ['process completed with exit code one', 'Process completed with exit code 1'], ['process completed with exit code two', 'Process completed with exit code 2'],
  ['TS ikki uch ikki ikki', 'TS2322'], ['no overload matches this call', 'No overload matches this call'], ['missing webpack from lock file', 'Missing: webpack@5.112.2 from lock file'],
  ['the strategy configuration was canceled because test yigirma ikki failed', 'The strategy configuration was canceled because "test._22" failed'], ['cancelled', 'cancelled'],
  ['echo ok', 'echo ok'], ['exit nol', 'exit 0'], ['exit bir', 'exit 1'], ['m4c-03', 'm4c-03'], ['Node js', 'Node.js'], ['checkout v to\'rt', 'checkout@v4'], ['Actions', 'Actions'],
];
DIGITS.unshift(["o'ttiz yettinchi satr", '37-satr'], ["yigirmanchi satr", '20-satr'], ["yigirma ikkinchi satr", '22-satr'], ["qirq ikkinchi ustun", '42-ustun'], ["o'ninchi soniyada", '10-soniyada'], ["yigirma ikkinchi soniyada", '22-soniyada'],
  ["besh ming to'rt yuz o'ttiz ikki", '5432'], ["yigirma to'rt yigirma ikki bir", '24.22.1'], ["o'n bir o'n to'qqiz", '11.19'], ["yigirma olti nol to'rt", '26.04'], ["yigirma to'rt", '24'], ["yigirma ikki", '22'], ["yigirma uch ekran", '23 ekran'],
  ["o'n bir soniya", '11 s'], ["besh soniya", '5 s'], ["o'n ikki soniya", '12 s'], ["ikki soniya", '2 s'], ["besh besh", '5/5'], ["o'n ikki daqiqa", '12 daqiqa'], ["o'n besh daqiqa", '15 daqiqa'], ['yigirma besh daqiqa', '25 daqiqa'], ['yigirma sakkiz', '28'], ['uch narsa', '3 narsa']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/Set up job/gi, /Post Run/gi, /Complete job/gi, /Initialize containers/gi, /Stop containers/gi, /Found in cache/gi, /Cache saved with the key/gi, /Cache hit for/gi, /npm cache is not found/gi,
  /Process completed with exit code/gi, /No overload matches this call/gi, /from lock file/gi, /Missing: webpack/gi, /The strategy configuration was canceled because/gi, /failed/g, /cancelled/gi, /canceled/gi,
  /Download action repository/gi, /Contents: read/gi, /Syncing repository/gi, /Deleting the contents/gi, /Secrets and variables/gi, /pull request/gi, /checks/g, /merge/gi, /badge/gi, /healthcheck/gi, /services/g, /runner/gi, /matrix/gi, /fail-fast/gi, /needs/g, /secret/gi, /image/gi, /workflow/gi);

const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string|in|unknown|require|process)$/;
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
  if (!m) return /^\s*#/.test(src) ? `<span class="cm">${escH(src)}</span>` : /^\s*- /.test(src) ? `<span class="p">${escH(src)}</span>` : escH(src);
  const [, ind, dash, key, colon, rest] = m;
  const cm = rest.indexOf(' #');
  const val = cm >= 0 ? rest.slice(0, cm) : rest, com = cm >= 0 ? rest.slice(cm) : '';
  return `${ind}${dash ? '<span class="p">- </span>' : ''}<span class="k">${escH(key)}</span>${colon}${val.trim() ? `<span class="s">${escH(val)}</span>` : escH(val)}${com ? `<span class="cm">${escH(com)}</span>` : ''}`;
}
const mdLine = (src) => /^\[!\[/.test(src) ? `<span class="s">${escH(src)}</span>` : /^#/.test(src) ? `<span class="k">${escH(src)}</span>` : escH(src);
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓|^NATIJA: \d+\/\d+ ✓|^ok$|^added \d+ packages|Cache hit|Cache saved|^Found in cache/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●|^npm error|^##\[error\]|error TS\d+|^Error:|^X |^sh: |not found|SMOKE XATO|canceled|^xato/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^Tests:.*failed|\[chiqish kodi: [1-9]\d*|^\[1\]|^\[2\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0|^\[0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—|>|\d+ \||\|)|^npm warn|^Snapshots|^Time:|^Ran all|^Test Suites|^\s*Types of|^\s*Type '|^\s*Overload|^\s*Object literal|^  [a-z]|^---|^==|^\[command\]|^\s+\w[\w-]*: /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outPick = (k, keep, meta = {}) => outLines(k).filter(keep).map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: jestLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const hlOf = (f) => (/\.ya?ml$/.test(f) ? yamlLine : /\.md$/.test(f) ? mdLine : tsLine);
const kod = (k, ids = {}, from, to, edit = {}) => { const hl = hlOf(KOD[k].file); return KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: hl(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  if (edit[l.n] === false) return [{ ...base, gone: true }];
  return [{ ...base, gone: true }, { h: hl(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
}); };
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const lineN = (k, re) => { const l = KOD[k].lines.find((x) => re.test(x.t)); return l ? l.n : 1; };
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;
const Yml = ({ k = 'CI_DONE', ids, from, to, edit, focus, beat, title, style }) => <CodePanel file={title || `.github/workflows/ci.yml${KOD[k].tag && !/done|start/.test(KOD[k].tag) ? ' · ' + KOD[k].tag : ''}`} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} style={style} />;

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

// GitHub Actions run oynasi — HAQIQIY run ma'lumotidan (KOD.RUNS). Ko'p job'li run: chapda job'lar, `job` — tanlangan job (nom yoki indeks).
const GH_ST = { ok: '✓', bad: '✗', skip: '⊘', wait: '●', off: '○' };
const hhmm = (iso) => { if (!iso) return ''; const h = (Number(iso.slice(11, 13)) + 5) % 24; return `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${String(h).padStart(2, '0')}:${iso.slice(14, 16)}`; };
const lg = (arr = []) => arr.map((t) => ({ t, c: /^\$ /.test(t) ? 'cmd' : /^##\[error\]|npm error|^FAIL|✕|●|Received|not found|error TS|^X |SMOKE XATO|canceled/.test(t) ? 'er' : /^PASS|✓|passed|^added \d+|Cache hit|Cache saved|Found in cache|NATIJA/.test(t) ? 'ok' : /warn|deprecated/.test(t) ? 'wn' : /^\s*(>|\d+ \||\|)|^>|^\[command\]|^\s+[\w-]+: |^with:|^env:/.test(t) ? 'cm' : '' }));
const jobIdx = (k, job) => { const J = KOD.RUNS[k].jobs; if (job == null) return 0; if (typeof job === 'number') return job; const i = J.findIndex((j) => j.name === job); return i < 0 ? 0 : i; };
const logKey = (k, step, job) => (KOD.RUNS[k].jobs.length > 1 ? `${KOD.RUNS[k].jobs[jobIdx(k, job)].name} · ${step}` : step);
const runLog = (k, step, keep, job) => lg((KOD.RUNS[k].log[logKey(k, step, job)] || []).filter(keep || (() => true)));
const runLogLines = (k, step, keep, job) => runLog(k, step, keep, job).map((l) => ({ h: jestLine(l.t) }));
const stepsOf = (k, job, post) => { const j = KOD.RUNS[k].jobs[jobIdx(k, job)]; return j ? j.steps.filter((s) => post || !/^Post /.test(s[0])) : []; };
const stepDur = (k, step, job) => { const s = stepsOf(k, job, true).find((x) => x[0] === step); return s ? s[2] : ''; };
function RunView({ k, job, open, lines, hlStep, ann, annAll, note, only, post, src }) {
  const r = KOD.RUNS[k]; const ji = jobIdx(k, job); const j = r.jobs[ji]; const steps = stepsOf(k, job, post).filter((s) => !only || only.test(s[0]));
  const hs = Array.isArray(hlStep) ? hlStep : hlStep == null ? [] : [hlStep];
  const oi = typeof open === 'string' ? steps.findIndex((s) => s[0] === open) : open;
  const anns = annAll ? (r.ann || []).filter(([lv]) => lv === 'failure') : ann === undefined ? (r.ann || []).filter(([lv]) => lv === 'failure').slice(0, 1) : ann ? [ann] : [];
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{src || t(`haqiqiy run · #${r.n}${r.ev === 'pull_request' ? ' · pull_request' : ''}`, `настоящий run · #${r.n}${r.ev === 'pull_request' ? ' · pull_request' : ''}`)}</span></div>
    <div className="hd"><span className={`dot ${r.st}`}>{GH_ST[r.st]}</span><b>{r.title}</b><span>{r.br} · {r.sha}</span><span className="du">{r.dur !== '0 s' && r.dur !== '-' ? r.dur : ''}{r.at ? ` · ${hhmm(r.at)}` : ''}</span></div>
    {anns.map((a, i) => <div key={i} className="ann"><b>Annotations · {j ? j.name : 'test'}</b><span>{a[1]}</span></div>)}
    {note && <div className="ann nt"><b>{note[0]}</b><span>{note[1]}</span></div>}
    {r.wfIssue ? <div className="empty"><b style={{ color: '#CF222E' }}>✗ This run likely failed because of a workflow file issue.</b><br />{t("job yo'q · qadam yo'q · log yo'q", "job нет · шагов нет · лога нет")}</div> : <div className="rb">
      <div className="jobs">{r.jobs.map((x, i) => <div key={i} className={`jb ${x.st}${i === ji ? ' on' : ''}`}><span className="dot">{GH_ST[x.st]}</span>{x.name}<small>{x.dur}</small></div>)}</div>
      <div className="steps">
        {steps.map(([n, st, du], i) => <div key={i} className={`st ${st}${hs.includes(n) || hs.includes(i) ? ' hl' : ''}`}>
          <span className="dot">{GH_ST[st]}</span><span className="nm">{n}</span><small>{st === 'skip' ? 'skipped' : st === 'off' ? 'cancelled' : du}</small>
          {oi === i && lines && lines.length > 0 && <pre className="log">{lines.map((l, q) => <span key={q} className={l.c || ''}>{l.t}{'\n'}</span>)}</pre>}
        </div>)}
      </div>
    </div>}
  </div>;
}
function RunRows({ keys, hl = [] }) {
  return <div className="c2-gh"><div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Actions</span><span className="src">{t("haqiqiy run'lar", "настоящие run")}</span></div>
    <div className="lst">{keys.map((k) => { const r = KOD.RUNS[k]; return <div key={k} className={`row ${r.st}${hl.includes(k) ? ' hl' : ''}`}><span className="dot">{GH_ST[r.st]}</span><span className="tl"><b>{r.title}</b><small>#{r.n} · {r.sha} · {r.ev}</small></span><span className="brn">{r.br}</span><span className="tm"><small>{hhmm(r.at)}</small><small>{r.dur}</small></span></div>; })}</div>
  </div>;
}
// Cache zanjiri — uch run (haqiqiy log satrlari va npm ci soniyasi)
function CacheChain({ hl }) {
  const items = [
    { k: 'c1-10', h: t("1-run · ci-sinov", "1-й run · ci-sinov"), find: [/npm cache is not found/, /Cache saved with the key/], st: 'save' },
    { k: 'c1-11', h: t("2-run · ci-sinov", "2-й run · ci-sinov"), find: [/Cache hit for/], st: 'hit' },
    { k: 'c1-18', h: "1-run · main", find: [/npm cache is not found/], st: 'miss' },
  ];
  return <div className="c1-chain">{items.map((it, i) => {
    const r = KOD.RUNS[it.k]; const logs = [...(r.log['Run actions/setup-node@v4'] || []), ...(r.log['Post Run actions/setup-node@v4'] || [])];
    const ls = it.find.map((re) => logs.find((l) => re.test(l)) || '').filter(Boolean);
    return <div key={it.k} className={`${it.st}${hl === i ? ' hl' : ''}${hl != null && hl !== i ? ' dim' : ''}`}>
      <h4>{it.h} <small>#{r.n}</small></h4>{ls.map((l) => <code key={l}>{l.replace(/node-cache-Linux-x64-npm-([0-9a-f]{8})[0-9a-f]*/, 'node-cache-Linux-x64-npm-$1…')}</code>)}
      <b>npm ci · {stepDur(it.k, 'Run npm ci')}</b>
    </div>;
  })}</div>;
}
// PR kartasi — gh pr view / pr checks (36b) + pull_request run'i (36)
function PrCard({ checks, merged }) {
  const tl = (KOD.TXT_36B || '').split('\n'); const g = (key) => (tl.find((l) => l.startsWith(key + ':')) || '').split(':').slice(1).join(':').trim();
  const r36 = KOD.RUNS['36'];
  return <div className="c2-gh"><div className="bar"><span className="lg">GitHub</span><span className="tt">OrderBotNest · Pull request #{g('number') || '1'}</span><span className="src">{t("gh pr view · haqiqiy", "gh pr view · настоящий")}</span></div>
    <div className="hd"><span className={`dot ${merged ? 'ok' : 'wait'}`}>{merged ? '✓' : '●'}</span><b>{g('title')}</b><span>lenta-smoke → main</span><span className="du">{merged ? 'Merged' : g('state')}</span></div>
    {checks && r36 && <div className="c1-checks"><div className="t">Checks · pull_request run #{r36.n}</div>{r36.jobs.map((j) => <div key={j.name} className={j.st}><span className="dot">{GH_ST[j.st]}</span><b>{j.name}</b><small>{j.st === 'ok' ? 'Successful' : 'Failing'} in {j.dur}</small></div>)}
      <div className="mg">{merged ? 'Pull request successfully merged and closed' : 'All checks have passed · Merge pull request'}</div></div>}
  </div>;
}
function Badge({ ok = true }) { return <span className="c1-badge"><span>CI</span><b style={{ background: ok ? '#4C1' : '#E05D44' }}>{ok ? 'passing' : 'failing'}</b></span>; }

// CI/CD-2 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.c2-n2{border:2px solid #1D4ED8;border-radius:14px;padding:12px;display:grid;gap:10px;background:#F8FBFF}
.c2-n2 .jobs{display:grid;grid-template-columns:1fr 34px 1fr;align-items:stretch}
.c2-n2 .job{border:2px solid #15803D;border-radius:12px;padding:10px;display:grid;gap:6px;background:#fff;align-content:start}
.c2-n2 .st{display:flex;justify-content:space-between;gap:8px;border:1px solid #E5E7EB;border-left:4px solid #6D3BE4;border-radius:6px;padding:3px 8px;font:12.5px ui-monospace,Menlo,Consolas,monospace;color:#1F2937;background:#fff}
.c2-n2 .st span{color:#6B7280}
.c2-n2 .st.pre{border-left-color:#9CA3AF;color:#6B7280}
.c2-n2 .lab{font:700 12px system-ui,sans-serif;letter-spacing:.03em;color:#1D4ED8}
.c2-n2 .job .lab{color:#15803D}
.c2-n2 .need{display:flex;align-items:center;justify-content:center;flex-direction:column;font:700 11px ui-monospace,Menlo,Consolas,monospace;color:#6B7280}
.c2-t3{display:flex;height:34px;border-radius:8px;overflow:hidden;border:1px solid #D7DCE3}
.c2-t3 div{display:flex;align-items:center;justify-content:center;font:600 11px ui-monospace,Menlo,Consolas,monospace;color:#fff;white-space:nowrap;overflow:hidden;border-right:1px solid rgba(255,255,255,.6)}
.c2-t3 .h{background:#1D4ED8}.c2-t3 .m{background:#94A3B8}.c2-t3 .p{background:#CBD5E1;color:#334155}
.c2-t3l{display:flex;justify-content:space-between;gap:10px;font:11px ui-monospace,Menlo,Consolas,monospace;color:#6B7280}
.c2-s3 .z-term{font-size:12px}
.c2-m8{display:grid;grid-template-columns:86px 1fr;gap:6px 10px;align-items:center}
.c2-m8 .lb{white-space:nowrap;font:600 13px ui-monospace,Menlo,Consolas,monospace;color:#374151}
.c2-m8 .tr{position:relative;height:30px;background:#F3F4F6;border-radius:6px}
.c2-m8 .bar{position:absolute;top:0;bottom:0;border-radius:6px;display:flex;align-items:center;padding:0 8px;font:700 12px system-ui,sans-serif;color:#fff;white-space:nowrap}
.c2-m8 .bad{background:#DC2626}.c2-m8 .ok{background:#15803D}.c2-m8 .can{background:repeating-linear-gradient(135deg,#9CA3AF 0 6px,#B6BCC6 6px 12px);color:#111827}
.c2-m8 .ax{grid-column:2;display:flex;justify-content:space-between;font:11px ui-monospace,Menlo,Consolas,monospace;color:#9CA3AF}
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
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
.c1-code{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper}}
.c1-code .n{font:800 20px ${MONO};text-align:center}
.c1-code .t{font-size:13.5px;line-height:1.4}
.c1-code .t code{font:12px ${MONO};color:${T.ink2}}
.c1-stage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c1-stage>div{border:2px solid var(--c);border-radius:14px;padding:14px;background:${T.paper};transition:opacity .35s}
.c1-stage h4{margin:0 0 4px;font:800 14px ${SANS};color:var(--c)}
.c1-stage p{margin:0;font-size:13.5px;color:${T.ink2};line-height:1.45}
/* Cache zanjiri */
.c1-chain{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
@media (max-width:1000px){.c1-chain{grid-template-columns:1fr}}
.c1-chain>div{border:2px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 12px;display:grid;gap:6px;align-content:start;transition:all .35s}
.c1-chain h4{margin:0;font:800 13.5px ${SANS};color:${T.ink}}
.c1-chain h4 small{font:600 11px ${MONO};color:${T.ink3};margin-left:6px}
.c1-chain code{font:11.5px/1.4 ${MONO};background:#F4F5F7;border-radius:6px;padding:4px 7px;color:${T.ink};overflow-wrap:anywhere}
.c1-chain b{font:700 13px ${MONO};color:${T.ink2}}
.c1-chain .hit{border-color:${T.green};background:#F1FAF5}
.c1-chain .hit code{background:#E3F5EC;color:${T.green}}
.c1-chain .save{border-color:${C1.ci}}
.c1-chain .miss{border-color:${T.accent}}
.c1-chain .hl{box-shadow:0 0 0 4px rgba(226,69,31,.14)}
.c1-chain .dim{opacity:.4}
/* PR checks */
.c1-checks{padding:8px 12px;display:grid;gap:4px;font:13px ${SANS}}
.c1-checks .t{font:700 12px ${SANS};color:#57606A;margin-bottom:2px}
.c1-checks>div.ok,.c1-checks>div.bad{display:flex;gap:8px;align-items:center;padding:6px 8px;border:1px solid #D0D7DE;border-radius:6px;color:#1F2328}
.c1-checks small{margin-left:auto;color:#57606A}
.c1-checks .mg{margin-top:4px;padding:8px 10px;border-radius:6px;background:#DAFBE1;color:#1A7F37;font-weight:600}
.c1-badge{display:inline-flex;font:700 12px ${SANS};border-radius:4px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.c1-badge span{background:#555;color:#fff;padding:3px 7px}
.c1-badge b{color:#fff;padding:3px 7px}
/* env ↔ secrets, services */
.c1-mach{border:2px solid ${T.line};border-radius:14px;background:${T.paper};padding:12px 14px;display:grid;gap:6px;align-content:start;transition:all .35s}
.c1-mach h4{margin:0 0 2px;font:800 14px ${SANS};color:${T.ink}}
.c1-mach .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;font-size:13px;color:${T.ink2}}
.c1-mach .r code{font:12px ${MONO};background:#F4F5F7;border-radius:6px;padding:2px 7px;color:${T.ink};overflow-wrap:anywhere}
.c1-mach p{margin:4px 0 0;font-size:13px;line-height:1.45;color:${T.ink2}}
.c1-mach p code{font:12px ${MONO};overflow-wrap:anywhere;word-break:break-all}
.c1-mach.ok{border-color:${T.green};background:#F1FAF5}
.c1-mach.bad{border-color:${T.accent};background:#FFF5F1}
.c1-mach.pg{border-color:${C1.pg};background:#F0F5FA}
.c1-mach.hl{box-shadow:0 0 0 4px rgba(226,69,31,.14)}
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
.c2-gh .row.ok,.c2-gh .row.bad,.c2-gh .row.skip,.c2-gh .row.wait,.c2-gh .row.off,.c2-gh .jb.ok,.c2-gh .jb.bad,.c2-gh .jb.wait,.c2-gh .jb.off{color:#1F2328}
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
.c2-gh .rb{display:grid;grid-template-columns:140px minmax(0,1fr);gap:0}
.c2-gh .jobs{border-right:1px solid #EAEEF2;padding:8px;display:grid;align-content:start;gap:4px}
.c2-gh .jb{display:flex;gap:6px;align-items:center;font:600 13px ${SANS};padding:5px 6px;border-radius:6px}
.c2-gh .jb.on{background:#F6F8FA;box-shadow:inset 0 0 0 1px #D0D7DE}
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
.c1-small .c2-gh .rb{grid-template-columns:110px minmax(0,1fr)}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: main'dagi PR merge run'i (37): test + smoke
// ============================================================
const PLAN1 = ['Umumiy tushuncha', "Qizilni o'qish va cache", 'matrix', 'Smoke va secret', 'PR va AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + Actions: ikki job — test (bazasiz) va smoke (services: postgres:18) (BotMap)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const CI_ON = ['telegram', 'catalog', 'user', 'cart', 'order'];
const CI2_OK = { name: 'Actions', steps: [['test', 'ok'], ['smoke', 'ok']], res: 'pass', get badge() { return t('ikki job — yashil', 'две job — зелёные'); } };
const DB_SVC = 'services: postgres:18';
const S1M = [
  { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: CI2_OK },
  { on: CI_ON, jest: { name: 'Actions', steps: [['Set up job', 'ok'], ['checkout', 'ok'], ['npm ci', 'ok'], ['npm test', 'ok']], res: 'pass', badge: 'run · job · step' } },
  { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: { name: 'Actions', steps: [['test (22)', 'ok'], ['test (24)', 'ok'], ['smoke', 'ok']], res: 'pass', badge: 'matrix · services' } },
  { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: CI2_OK },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} {...m} tag={t("Bugungi darsning rasmi — lenta ichida: job'lar, matrix va Postgres konteyneri", 'Картина урока — внутри конвейера: job, matrix и контейнер Postgres')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Actions nima qiladi: run → job → step, GitHub qo'shgan qadamlar (run 10 — Post'lar bilan)
// ============================================================
const GH_STEPS = ['Set up job', 'Post Run actions/setup-node@v4', 'Post Run actions/checkout@v4', 'Complete job'];
// F-1109-06: xulosa — uch ta'rif kartasi o'rniga haqiqiy run 41845454983 ichma-ich (run → ikki job → qadamlar)
const N2_TEST = [['Set up job', '1 s', 1], ['actions/checkout@v4', '0 s', 1], ['actions/setup-node@v4', '4 s', 1], ['npm ci', '5 s'], ['npx tsc --noEmit', '2 s'], ['npm test', '1 s'], ['npm run build', '3 s']];
const N2_SMOKE = [['Set up job', '0 s', 1], ['Initialize containers', '13 s', 1], ['actions/checkout@v4', '1 s', 1], ['actions/setup-node@v4', '3 s', 1], ['npm ci', '10 s'], ['npm run smoke', '9 s']];
function RunNest2() {
  const st = (rows) => rows.map(([n, s, pre]) => <div key={n} className={'st' + (pre ? ' pre' : '')}>{n}<span>{s}</span></div>);
  return <div className="z">
    <div className="c2-n2">
      <div className="lab">RUN · 41845454983 · push · ci-sinov · 9fc3af1 · <span style={{ color: '#15803D' }}>✓ success</span></div>
      <div className="jobs">
        <div className="job"><div className="lab">{t("JOB test · alohida mashina · 19 s", "JOB test · отдельная машина · 19 s")}</div>{st(N2_TEST)}</div>
        <div className="need">needs<br />→</div>
        <div className="job"><div className="lab">{t("JOB smoke · alohida mashina · 41 s", "JOB smoke · отдельная машина · 41 s")}</div>{st(N2_SMOKE)}</div>
      </div>
    </div>
    <div className="z-three">
      <div className="z-card" style={{ borderColor: '#1D4ED8', padding: 10 }}><b style={{ color: '#1D4ED8' }}>run</b><span className="z-mut">{t("bitta push → bitta run: yashil yoki qizil", "один push → один run: зелёный или красный")}</span></div>
      <div className="z-card" style={{ borderColor: '#15803D', padding: 10 }}><b style={{ color: '#15803D' }}>job</b><span className="z-mut">{t("jobs: ostidagi har nom — alohida mashina; needs tartib beradi", "каждое имя под jobs: — отдельная машина; needs задаёт порядок")}</span></div>
      <div className="z-card" style={{ borderColor: '#6D3BE4', padding: 10 }}><b style={{ color: '#6D3BE4' }}>step</b><span className="z-mut">{t("uses / run qatori; kulranglarini GitHub o'zi qo'shadi", "строка uses / run; серые GitHub добавляет сам")}</span></div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'yml', f: ['j'] }, { v: 'yml', f: ['s'] }, { v: 'run', hl: GH_STEPS }, { v: 'three' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'yml' && <div className="pg-two"><Yml k="CI_START" title="ci.yml · cicd2-start" ids={{ 3: 'j', 4: 'j', ...rngIds(6, 15, 's') }} focus={seg.f} /><RunView k="c1-10" post /></div>}
    {seg.v === 'run' && <RunView k="c1-10" post hlStep={seg.hl} />}
    {seg.v === 'three' && <RunNest2 />}
  </>} />;
}

// ============================================================
//  3 · uses ichida: Set up job, checkout, setup-node loglari (run 10 — aynan)
// ============================================================
const L3_SETUP = runLog('c1-10', 'Set up job', (l) => /Current runner version|^Image:|^Contents:|Download action repository/.test(l));
const L3_CHECKOUT = runLog('c1-10', 'Run actions/checkout@v4', (l) => /Syncing repository|Deleting the contents|git init|fetch --no-tags/.test(l)).map((l) => ({ ...l, t: l.t.replace(/\[command\]\/usr\/bin\//, '$ ').replace(/ origin \+[0-9a-f]+:.*$/, ' origin +ef9e667…') }));
const L3_NODE = runLog('c1-10', 'Run actions/setup-node@v4', (l) => /^\s+node-version:|^\s+cache:|Found in cache|^node: |^npm: /.test(l));
// F-1109-06: xulosa — uch karta o'rniga job vaqt chizig'i (run 41832879751) va uch tayyor qadamning haqiqiy log satrlari
function Uses3() {
  return <div className="z c2-s3">
    <div className="z-card">
      <p className="z-h">{t("JOB test · run 41832879751 · 25 s — qadamlar vaqt bo'yicha", "JOB test · run 41832879751 · 25 s — шаги по времени")}</p>
      <div className="c2-t3">
        <div className="h" style={{ flex: 1.2 }}>1</div><div className="h" style={{ flex: 0.8 }}>2</div><div className="h" style={{ flex: 1.2 }}>3</div>
        <div className="m" style={{ flex: 11 }}>npm ci · 11 s</div><div className="m" style={{ flex: 3 }}>tsc 3 s</div><div className="m" style={{ flex: 2 }}>test</div><div className="m" style={{ flex: 3 }}>build</div><div className="p" style={{ flex: 2.4 }}>post</div>
      </div>
      <div className="c2-t3l"><span>:25</span><span><b style={{ color: '#1D4ED8' }}>1</b> Set up job · <b style={{ color: '#1D4ED8' }}>2</b> checkout · <b style={{ color: '#1D4ED8' }}>3</b> setup-node{t(" — GitHub tayyor qadamlari; kulrang — sizniki", " — готовые шаги GitHub; серые — ваши")}</span><span>:49</span></div>
    </div>
    <div className="z-three">
      <div className="z-card" style={{ borderColor: '#1D4ED8', padding: 10 }}><b style={{ color: '#1D4ED8' }}>Set up job</b>
        <div className="z-term">Image: <span className="y">ubuntu-26.04</span>{'\n'}GITHUB_TOKEN Permissions{'\n'}Contents: <span className="y">read</span>{'\n'}Download action repository 'actions/checkout@v4' (SHA:11d5…7262)</div>
        <span className="z-mut">{t("qaysi mashina, qanday ruxsat", "какая машина, какие права")}</span></div>
      <div className="z-card" style={{ borderColor: '#15803D', padding: 10 }}><b style={{ color: '#15803D' }}>checkout</b>
        <div className="z-term">git init /home/runner/work/OrderBotNest/…{'\n'}git … fetch … <span className="y">--depth=1</span> origin +ef9e667…</div>
        <span className="z-mut">{t("bo'sh papka, faqat oxirgi commit", "пустая папка, только последний commit")}</span></div>
      <div className="z-card" style={{ borderColor: '#6D3BE4', padding: 10 }}><b style={{ color: '#6D3BE4' }}>setup-node</b>
        <div className="z-term">Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64{'\n'}node: <span className="y">v24.22.1</span>{'\n'}npm: <span className="y">11.19.1</span></div>
        <span className="z-mut">{t("runner'dagi tayyor Node", "готовый Node на runner")}</span></div>
    </div>
    <div className="z-rule"><b>uses</b>{t(" — boshqalar yozgan skript, lekin logi ochiq: mashina, versiya, ruxsat — shu yerda.", " — скрипт, написанный другими, но лог открыт: машина, версия, права — здесь.")}</div>
  </div>;
}
const S3 = mkS(3, [{ v: 'setup' }, { v: 'checkout' }, { v: 'node' }, { v: 'sum' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'setup' && <RunView k="c1-10" open="Set up job" lines={L3_SETUP} hlStep="Set up job" only={/Set up job|checkout|setup-node|npm ci/} />}
    {seg.v === 'checkout' && <RunView k="c1-10" open="Run actions/checkout@v4" lines={L3_CHECKOUT} hlStep="Run actions/checkout@v4" only={/Set up job|checkout|setup-node|npm ci/} />}
    {seg.v === 'node' && <RunView k="c1-10" open="Run actions/setup-node@v4" lines={L3_NODE} hlStep="Run actions/setup-node@v4" only={/Set up job|checkout|setup-node|npm ci/} />}
    {seg.v === 'sum' && <Uses3 />}
  </>} />;
}

// ============================================================
//  4 · Qizil run'ni o'qish: annotatsiya qisqa, sabab — qadam logida (run 15 tsc, run 11 test)
// ============================================================
const L4_TSC = runLog('c1-15', 'Run npx tsc --noEmit', (l) => /^\$|error TS|Types of property|Type 'number'/.test(l));
const L4_TEST = runLog('c1-11', 'Run npm test', (l) => /^\$|^FAIL|●|Kolonka|> 37|^Tests:|##\[error\]/.test(l));
const ORDER4 = ['Belgi: run qizil', 'Chapda qizil job', 'Qizil qadam (✗)', 'Qadam logi — sabab shu yerda', '##[error] satrlari → annotatsiya (qisqa)'];
const S4 = mkS(4, [{ v: 'ann' }, { v: 'log' }, { v: 'test' }, { v: 'order' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'ann' && <RunView k="c1-15" annAll only={/^Run np/} hlStep="Run npx tsc --noEmit" />}
    {seg.v === 'log' && <RunView k="c1-15" ann={null} only={/^Run np/} open="Run npx tsc --noEmit" lines={L4_TSC} hlStep="Run npx tsc --noEmit" />}
    {seg.v === 'test' && <RunView k="c1-11" only={/^Run np/} open="Run npm test" lines={L4_TEST} hlStep="Run npm test" />}
    {seg.v === 'order' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("Qizil run'ni o'qish tartibi", "Порядок чтения красного run")}</div><div className="mk-plan">{ORDER4.map((x, i) => <div key={i} className={i === 3 ? 'hl' : ''} style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — annotatsiya «exit code 1» (run 11)
// ============================================================
function Screen5(p) {
  return MC(p, 5, {
    above: <RunView k="c1-11" only={/^Run np/} hlStep="Run npm test" />,
    after: <RunView k="c1-11" ann={null} only={/npm test/} open="Run npm test" lines={L4_TEST} />,
  });
}

// ============================================================
//  6 · Cache: saqlandi → tiklandi → main'da yo'q (run 10, 11, 18)
// ============================================================
const KEY6 = ((KOD.RUNS['c1-10'].log['Post Run actions/setup-node@v4'] || []).find((l) => /Cache saved with the key/.test(l)) || '').replace(/.*key: /, '');
const S6 = mkS(6, [{ hl: 0 }, { hl: 1 }, { hl: 2 }, { v: 'key' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    <CacheChain hl={seg.v === 'key' ? null : seg.hl} />
    {seg.v === 'key' && <div className="mk-light" style={{ padding: 12, marginTop: 10 }}><div className="mk-tag">{t("Cache kaliti", "Ключ cache")}</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {[['node-cache', t('setup-node yaratgan cache', "cache, созданный setup-node")], ['Linux-x64', t('runner mashinasi', "машина runner")], ['npm', t('paket menejeri', "менеджер пакетов")], [KEY6.replace(/^node-cache-Linux-x64-npm-/, '').slice(0, 12) + '…', t('package-lock.json ning hash\'i — lock o\'zgarsa kalit o\'zgaradi', "хеш package-lock.json — если lock меняется, меняется и ключ")]].map(([a, b], i) => <div key={a} className="c1-code" style={{ animation: `mk-up .35s ${i * 0.08}s ease both` }}><span className="n" style={{ fontSize: 12, color: T.accent }}>{i + 1}</span><span className="t"><code>{a}</code> — {b}</span></div>)}
      </div>
      <div className="mk-rule" style={{ marginTop: 8 }}>Cache — <b>{t("tezlik", "скорость")}</b>{t(", to'g'rilik emas: «not found» xato emas, «hit» — lock o'zgarmagan.", ", а не правильность: «not found» — не ошибка, «hit» — lock не менялся.")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — o'z run'ingizni o'qish
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []]);
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} tree={FILES()} />; }

// ============================================================
//  8 · matrix: bitta fayl, ikki Node — fail-fast 24 ni bekor qildi (run 30)
// ============================================================
const L8_22 = runLog('30', 'Run npm ci', (l) => /^\$|EUSAGE|Missing:/.test(l), 'test (22)');
// F-1109-06: xulosa — ikki karta o'rniga ikki haqiqiy run vaqt o'qida (41844079933 · 41844193379) va annotatsiya xabari
function Matrix8() {
  const ax = <div className="ax"><span>0 s</span><span>10</span><span>20</span><span>30 s</span></div>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("fail-fast: true (odatiy) · run 41844079933", "fail-fast: true (по умолчанию) · run 41844079933")}</p>
      <div className="c2-m8">
        <span className="lb">test (22)</span><div className="tr"><div className="bar bad" style={{ left: 0, width: '33%' }}>{t("npm ci qizil · 10 s", "npm ci красный · 10 s")}</div></div>
        <span className="lb">test (24)</span><div className="tr"><div className="bar can" style={{ left: 0, width: '73%' }}>{t("cancelled · 22 s — yarmida to'xtatildi", "cancelled · 22 s — остановлен на полпути")}</div></div>
        {ax}
      </div>
      <div className="z-term"><span className="r">X The strategy configuration was canceled because "test._22" failed</span></div>
    </div>
    <div className="z-card">
      <p className="z-h">fail-fast: false · run 41844193379</p>
      <div className="c2-m8">
        <span className="lb">test (22)</span><div className="tr"><div className="bar bad" style={{ left: '16%', width: '33%' }}>{t("npm ci qizil · 10 s", "npm ci красный · 10 s")}</div></div>
        <span className="lb">test (24)</span><div className="tr"><div className="bar ok" style={{ left: 0, width: '83%' }}>{t("yashil · 25 s · Tests: 25 passed", "зелёный · 25 s · Tests: 25 passed")}</div></div>
        {ax}
      </div>
      <span className="z-mut">{t("Run baribir qizil — lekin to'liq javob bor: 24 da hammasi o'tadi, muammo faqat 22 da.", "Run всё равно красный — но ответ полный: на 24 всё проходит, проблема только на 22.")}</span>
    </div>
    <div className="z-rule">{t("matrix mashinani emas, ", "matrix проверяет не машину, а ")}<b>{t("versiyani", "версию")}</b>{t(" sinaydi: bitta kod × bir nechta Node, parallel.", ": один код × несколько Node, параллельно.")}</div>
  </div>;
}
const S8 = mkS(8, [{ v: 'yml' }, { v: 'run22' }, { v: 'run24' }, { v: 'sum' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'yml' && <Ide files={compact(FILES(), F.ci)} active={F.ci}><CodePanel file="ci.yml · matrix" lines={kod('YML_1_MATRIX', { ...rngIds(6, 8, 'm'), 13: 'v' })} focus={['m', 'v']} /></Ide>}
    {seg.v === 'run22' && <RunView k="30" job="test (22)" ann={null} only={/^Run np/} open="Run npm ci" lines={L8_22} hlStep="Run npm ci" />}
    {seg.v === 'run24' && <RunView k="30" job="test (24)" annAll only={/^Run np/} hlStep={['Run npx tsc --noEmit']} />}
    {seg.v === 'sum' && <Matrix8 />}
  </>} />;
}

// ============================================================
//  9 · fail-fast: false — 22 qizil, 24 yashil (run 31)
// ============================================================
const L9_22 = runLog('31', 'Run npm ci', (l) => /^\$|Missing:/.test(l), 'test (22)');
const S9 = mkS(9, [{ v: 'run24' }, { v: 'run22' }, { v: 'who' }, { v: 'sum' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'run24' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="ci.yml · fail-fast: false" lines={kod('YML_2_MATRIX_FAIL_FAST_FALSE', { 7: 'f' }, 6, 9)} focus={['f']} /><RunView k="31" job="test (24)" ann={null} only={/^Run np/} /></div>}
    {seg.v === 'run22' && <RunView k="31" job="test (22)" only={/^Run np/} open="Run npm ci" lines={L9_22} hlStep="Run npm ci" />}
    {seg.v === 'who' && <div className="pg-two">
      <Card c={C1.ci} h={t("Kutubxona (npm paketi)", "Библиотека (npm-пакет)")}><p>{t("Har xil loyihalarda, har xil Node'da ishlatiladi → ", "Используется в разных проектах, на разных Node → ")}<b>{t("matrix kerak", "нужен matrix")}</b>: 20, 22, 24…</p></Card>
      <Card c={T.green} h={t("Bot / sayt (OrderBotNest)", "Бот / сайт (OrderBotNest)")}><p>{t("Bitta serverda, bitta Node'da yuradi → ", "Работает на одном сервере, на одном Node → ")}<b>{t("mashinangizdagi bitta raqam", "одного числа с вашей машины")}</b>{t(" yetadi (CI/CD-1 17-ekran).", " хватает (CI/CD-1, экран 17).")}</p></Card>
    </div>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}><RunView k="31" job="test (24)" ann={null} only={/^Run np/} /><div className="mk-rule">{t("matrix — bir nechta versiya, parallel · ", "matrix — несколько версий, параллельно · ")}<code>fail-fast</code>{t(" tez to'xtatadi · ", " быстро останавливает · ")}<code>fail-fast: false</code>{t(" — to'liq javob.", " — полный ответ.")}</div></div>}
  </>} />;
}

// ============================================================
//  10 · Tekshiruv 2 — fail-fast (run 30)
// ============================================================
function Screen10(p) {
  return MC(p, 10, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="ci.yml · 6–8" lines={kod('YML_1_MATRIX', rngIds(6, 8, 'm'), 6, 8)} focus={['m']} />
      <RunView k="30" job="test (22)" ann={null} only={/^Run npm ci/} src={t("haqiqiy run · #21 · 10-soniyada", "настоящий run · #21 · на 10-й секунде")} />
    </div>,
    after: <RunView k="30" job="test (24)" ann={null} only={/tsc|npm test|build/} />,
  });
}

// ============================================================
//  11 · Amaliyot 2 — matrix o'z reposida
// ============================================================
const P11 = mkPractice(11, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.ci, lines: kod('YML_1_MATRIX') }, { step: 2, file: F.ci, lines: kod('YML_2_MATRIX_FAIL_FAST_FALSE') }],
});
function ScreenP11(p) { return <Practice p={p} S={P11.S} steps={P11.steps} trouble={P11.trouble} proof={P11.proof} code={P11.code} tree={FILES()} />; }

// ============================================================
//  12 · Smoke lentada: bazali tekshiruvga baza qayerdan — services (umumiy)
// ============================================================
// F-1109-06: xulosa — bitta qoida o'rniga ikki job yonma-yon va lentadagi haqiqiy smoke logi (run 41845454983, cicd2v2-out/32)
function Smoke12() {
  return <div className="z">
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("JOB test — bazasiz · 19 s", "JOB test — без базы · 19 s")}</p>
        <div className="z-flow">
          <div className="z-st"><b>npm test</b><span className="z-mut">Jest</span></div>
          <div className="z-ar">→</div>
          <div className="z-st blue"><b>manager</b><span className="zm">mock</span><span className="z-mut">{t("baza yo'q", "базы нет")}</span></div>
        </div>
        <span className="z-mut">{t("tez: kodning mantiqini tekshiradi", "быстро: проверяет логику кода")}</span>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--pg)' }}>
        <p className="z-h">JOB smoke — needs: test · 41 s</p>
        <div className="z-flow">
          <div className="z-st"><b>npm run smoke</b><span className="z-mut">{t("bot jarayoni", "процесс бота")}</span></div>
          <div className="z-ar">→</div>
          <div className="z-st blue"><b>services: postgres:18</b><span className="z-mut">{t("konteyner · 13 s ko'tarildi", "контейнер · поднялся за 13 s")}</span><span className="zm" style={{ fontSize: 11.5 }}>localhost:5432/shop</span></div>
        </div>
        <span className="z-mut">{t("to'liq: haqiqiy bazaga yozadi, job tugasa konteyner o'chadi", "полно: пишет в настоящую базу, после job контейнер удаляется")}</span>
      </div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Run 41845454983 · smoke logi — lentada haqiqiy Postgres bilan", "Run 41845454983 · лог smoke — в конвейере с настоящим Postgres")}</p>
      <div className="z-term"><span className="m">— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)</span>{'\n'}<span className="g">✓</span> telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»{'\n'}<span className="g">✓</span> savat restartdan o'tdi → «Savat:»{'\n'}<span className="g">✓</span> buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»{'\n'}<span className="m">— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor</span>{'\n'}<span className="g">✓</span> ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0{'\n'}<span className="g">✓</span> ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1{'\n'}<span className="g">NATIJA: 5/5 ✓</span></div>
    </div>
    <div className="z-rule">{t("Unit test — ", "Unit test — ")}<b>{t("bazasiz, tez", "без базы, быстро")}</b>{t(". Smoke — ", ". Smoke — ")}<b>{t("bazali, to'liq", "с базой, полный")}</b>{t(". Lentada ikkalasi: test → smoke.", ". В конвейере оба: test → smoke.")}</div>
  </div>;
}
const S12 = mkS(12, [{ v: 'two' }, { v: 'smoke' }, { v: 'services' }, { v: 'sum' }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <>
    {seg.v === 'two' && <div className="pg-two">
      <Card c={T.green} h="Unit test (Jest-2)" hl><p>{t("mock · baza yo'q · 25 test · ", "mock · базы нет · 25 тестов · ")}<b>2 s</b>{t(" — lentada bor", " — есть в конвейере")}</p></Card>
      <Card c={C1.pg} h="Smoke (TgPg)"><p><code>npm run smoke</code>{t(" — haqiqiy Nest + Telegraf kodi, ", " — настоящий код Nest + Telegraf, ")}<b>{t("haqiqiy Postgres", "настоящий Postgres")}</b>: restart 3 + race 2 → <code>NATIJA: 5/5 ✓</code>{t(" — lentada yo'q: runner'da baza yo'q", " — в конвейере нет: на runner нет базы")}</p></Card>
    </div>}
    {seg.v === 'smoke' && <div style={{ display: 'grid', gap: 8 }}>
      <Code k="PKG_SMOKE" files={FILES()} active={F.pkg} ids={{ [lineN('PKG_SMOKE', /"smoke"/)]: 's' }} focus={['s']} />
      <CodePanel file="scripts/smoke.js" lines={[...kod('SMOKE_URL', { [lineN('SMOKE_URL', /DATABASE_URL/)]: 'u' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('SMOKE_DB', { [lineN('SMOKE_DB', /CREATE DATABASE/)]: 'd' })]} focus={['u', 'd']} />
    </div>}
    {seg.v === 'services' && <div className="pg-two">
      <div className="c1-mach ok"><h4>{t("Job mashinasi (runner)", "Машина job (runner)")}</h4><div className="r"><span>{t("qadamlar", "шаги")}</span><code>npm ci → npm run smoke</code></div><div className="r"><span>DATABASE_URL</span><code>postgresql://…@localhost:5432/shop</code></div><p>smoke <code>localhost:5432</code>{t(" ga ulanadi — yonidagi konteynerga", " — это соседний контейнер")}</p></div>
      <div className="c1-mach pg hl"><h4>services: postgres</h4><div className="r"><span>image</span><code>postgres:18</code></div><div className="r"><span>port</span><code>5432 → 5432</code></div><div className="r"><span>healthcheck</span><code>pg_isready</code></div><p>{t("job bilan tug'iladi (", "рождается с job (")}<code>Initialize containers</code>{t("), job bilan o'ladi (", "), умирает с job (")}<code>Stop containers</code>)</p></div>
    </div>}
    {seg.v === 'sum' && <Smoke12 />}
  </>} />;
}

// ============================================================
//  13 · services: postgres + needs: test — smoke job yashil (run 32)
// ============================================================
const L13 = runLog('32', 'Run npm run smoke', (l) => /^\$|== vaqt|✓|✗|NATIJA/.test(l), 'smoke');
const S13 = mkS(13, [{ v: 'needs' }, { v: 'services' }, { v: 'steps' }, { v: 'log' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'needs' && <Ide files={compact(FILES(), F.ci)} active={F.ci}><CodePanel file="ci.yml · smoke job" lines={kod('YML_3_SMOKE_SERVICES', { 16: 'n', 17: 'n' }, 14, 20)} focus={['n']} /></Ide>}
    {seg.v === 'services' && <CodePanel file="ci.yml · services" lines={kod('YML_3_SMOKE_SERVICES', { 19: 's', 20: 's', 21: 'i', 24: 'd', 26: 'p', ...rngIds(27, 30, 'h') }, 19, 30)} focus={['s', 'i', 'd', 'p', 'h']} />}
    {seg.v === 'steps' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><CodePanel file={t("ci.yml · smoke qadamlari", "ci.yml · шаги smoke")} lines={kod('YML_3_SMOKE_SERVICES', { 38: 'r', 39: 'e', 40: 'e' }, 31, 40)} focus={['r', 'e']} /><RunView k="32" job="smoke" only={/Initialize|npm ci|npm run smoke|Stop/} hlStep="Initialize containers" /></div>}
    {seg.v === 'log' && <RunView k="32" job="smoke" only={/Initialize|npm ci|npm run smoke|Stop/} open="Run npm run smoke" lines={L13} hlStep="Run npm run smoke" />}
  </>} />;
}

// ============================================================
//  14 · DATABASE_URL qayerdan: env (konteyner) va secrets (tashqi); nomi xato → bo'sh (run 33)
// ============================================================
const L14 = runLog('33', 'Run npm run smoke', (l) => /^\$|^env:|DATABASE_URL:|SMOKE XATO: DATABASE_URL|##\[error\]/.test(l), 'smoke');
// F-1120-02 (M52): 3-segment (x) — mentor 41-satrdagi secrets.DATABASE_URL ni o'zi bosadi → DATABSE_URL (run 33 — haqiqiy)
const OK41 = kod('YML_4_SMOKE_SECRET_XATO', { 41: 'x' }, 38, 41).map((l) => (l.n === 41 ? { ...l, h: l.h.replace('DATABSE_URL', '<span class="n1-act" data-act="1">DATABASE_URL</span>') } : l));
const SecretMini = ({ broken, known, pins }) => <N1Mini><FlowMini tag={t("secret nomi → qiymat → smoke", 'имя secret → значение → smoke')}
  boxes={[[broken ? 'secrets.DATABSE_URL' : 'secrets.DATABASE_URL', t('ci.yml · 41-satr', 'ci.yml · строка 41'), broken ? 'bad' : ''], [t('qiymat', 'значение'), !broken ? '***' : known ? t("bo'sh — xato yo'q", 'пусто — ошибки нет') : '?', ''], ['npm run smoke', !broken ? '✓' : known ? '✕' : '?', broken && known ? 'bad' : '']]}
  res={broken ? [known ? 'SMOKE XATO: DATABASE_URL topilmadi · exit code 2' : '?', 'bad'] : null} pins={pins} /></N1Mini>;
const S14 = mkS(14, [{ v: 'env' }, { v: 'secrets' }, { v: 'act' }, { v: 'run' }, { v: 'sum' }]);
function Screen14(p) {
  const cards = (hl) => <div className="pg-two">
    <div className={`c1-mach ok${hl === 'env' ? ' hl' : ''}`}><h4>{t("env: — konteyner", "env: — контейнер")}</h4><div className="r"><span>{t("ci.yml, smoke qadami", "ci.yml, шаг smoke")}</span><code>env:</code></div><p><code>DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop</code></p><p>{t("yml'da ochiq — to'g'ri: konteyner job ichida tug'iladi va o'ladi, tashqaridan ulanib bo'lmaydi", "открыто в yml — правильно: контейнер рождается и умирает внутри job, снаружи не подключиться")}</p></div>
    <div className={`c1-mach${hl === 'secrets' ? ' hl' : ''}`}><h4>{t("secrets — tashqi resurs", "secrets — внешний ресурс")}</h4><div className="r"><span>GitHub</span><code>Settings → Secrets → Actions</code></div><div className="r"><span>log</span><code>***</code></div><p><code>{'DATABASE_URL: ${{ secrets.DATABASE_URL }}'}</code></p><p>{t("haqiqiy baza, bot tokeni — yml'ga yozilmaydi: repo ochiq, tarix abadiy", "настоящая база, токен бота — в yml не пишутся: репозиторий открыт, история вечна")}</p></div>
  </div>;
  return <Lesson p={p} S={S14} scene={(b) => <Scene14 b={b} cards={cards} />} />;
}
// Qadamlar: 0 env · 1 secrets · 2 bosing (act) · 3 run qizil, bo'laklar 1·2 · 4 xulosa
function Scene14({ b, cards }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 2 ? (act.hit ? 'broke' : 'act') : seg.v;
  const mini = <SecretMini broken={v !== 'act'} known={beat >= 3} pins={beat === 3 ? { 0: 1, 2: 2 } : {}} />;
  return <>
    {seg.v === 'env' && cards('env')}
    {seg.v === 'secrets' && cards('secrets')}
    {v === 'act' && <div style={{ display: 'grid', gap: 8 }}><div onClick={act.onClick}><CodePanel file="ci.yml" lines={OK41} focus={['x']} /></div>{mini}</div>}
    {v === 'broke' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("ci.yml · 41-satr — harf tushib qoldi", "ci.yml · строка 41 — пропала буква")} lines={kod('YML_4_SMOKE_SECRET_XATO', { 41: 'x' }, 38, 41)} focus={['x']} />{mini}</div>}
    {v === 'run' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><CodePanel file={t("ci.yml · 41-satr — harf tushib qolgan", "ci.yml · строка 41 — пропала буква")} lines={kod('YML_4_SMOKE_SECRET_XATO', { 41: 'x' }, 38, 41)} focus={['x']} />{mini}<RunView k="33" job="smoke" ann={null} only={/npm run smoke/} open="Run npm run smoke" lines={L14} /></div>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}>{cards(null)}<div className="n2-warn">{t("Secret nomi xato — GitHub ", "Неверное имя secret — GitHub ")}<b>{t("indamaydi", "молчит")}</b>{t(", qiymat bo'sh, dastur yiqiladi («topilmadi»). Logda ", ", значение пустое, программа падает («topilmadi»). В логе ")}<code>***</code>{t(" — runner URL ichidagi ", " — runner внутри URL ")}<code>user:parol@</code>{t(" ni o'zi yashiradi (run 33, secret'siz ham).", " скрывает сам (run 33, и без secret).")}</div></div>}
  </>;
}

// ============================================================
//  15 · Tekshiruv 3 — LineCheck: secret nomi xato (4-smoke-secret-xato.yml 31–41, 41-satr → indeks 10)
// ============================================================
const LC15 = kod('YML_4_SMOKE_SECRET_XATO', {}, 31, 41);
const LC15_FIXED = LC15.flatMap((l) => l.n === 41 ? [{ ...l, gone: true }, { h: yamlLine('          DATABASE_URL: ${{ secrets.DATABASE_URL }}'), n: 41, neu: true }] : [l]);
const T15X = runLogLines('33', 'Run npm run smoke', (l) => /SMOKE XATO: DATABASE_URL|##\[error\]/.test(l), 'smoke');
function Screen15(p) {
  const m = MDT[15];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={t("ci.yml · smoke qadamlari", "ci.yml · шаги smoke")} lines={LC15} target={10}
    tree={{ root: MKCFG.root, files: compact(FILES(), F.ci), active: F.ci }}
    fixed={LC15_FIXED} fixedExtra={[{ file: t('GitHub · smoke job logi (run 33) — konteyner uchun oddiy env: ham yetadi (13-ekran)', "GitHub · лог job smoke (run 33) — для контейнера хватает обычного env: (экран 13)"), lines: T15X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  16 · Pull request: lenta merge'dan oldin tekshiradi; badge (run 35, 36, 37; TXT_36B; README cicd2-done)
// ============================================================
const T16 = jt('$ git checkout -b lenta-smoke\n$ git add .github README.md\n$ git commit -m "ci: smoke job (PostgreSQL xizmati) va README badge"\n$ git push -u origin lenta-smoke');
const S16 = mkS(16, [{ v: 'push' }, { v: 'pr' }, { v: 'merge' }, { v: 'badge' }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <>
    {seg.v === 'push' && <div style={{ display: 'grid', gap: 10 }}><Term lines={T16} /><RunRows keys={['35']} hl={['35']} /></div>}
    {seg.v === 'pr' && <PrCard checks />}
    {seg.v === 'merge' && <div style={{ display: 'grid', gap: 10 }} className="c1-small"><PrCard checks merged /><RunView k="37" job="smoke" ann={null} only={/Initialize|npm run smoke/} /></div>}
    {seg.v === 'badge' && <div style={{ display: 'grid', gap: 10 }}>
      <Code k="README_BADGE" files={FILES()} active={F.readme} ids={{ 1: 'b' }} focus={['b']} title="README.md · cicd2-done" />
      <div className="mk-light" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}><div className="mk-tag" style={{ margin: 0 }}>{t("Reponi ochgan odam ko'radi", "Кто открыл репозиторий, видит")}</div><Badge ok /><span style={{ fontSize: 13, color: T.ink2 }}>{t("— main'dagi oxirgi run holati (", "— состояние последнего run в main (")}<code>actions/workflows/ci.yml/badge.svg</code>)</span></div>
    </div>}
  </>} />;
}

// ============================================================
//  17 · AI smoke workflow yozdi — ikki to'plam, ikkalasi yashil (run 40, 41)
// ============================================================
const S17 = mkS(17, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'runs' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("run'ni o'qish · cache · matrix · services + smoke · secret", "чтение run · cache · matrix · services + smoke · secret")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("bitta prompt → ikki workflow → haqiqiy lentada sinov", "один промпт → два workflow → проверка в настоящем конвейере")}</p></div>
    </div>}
    {seg.v === 'prompt' && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: services, konteyner, healthcheck, secret yo'q", "без подсказок: нет services, контейнера, healthcheck, secret")} />}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<><code>ci.yml</code>{t(" +20 satr: ", " +20 строк: ")}<code>services: postgres:18</code> + <code>pg_isready</code> healthcheck · <code>POSTGRES_DB: shop</code> · <code>npm run smoke</code>{t(" build'dan keyin · ", " после build · ")}<b>{t("env faqat smoke qadamida", "env только в шаге smoke")}</b>{t(" · 3 izoh («build ikki marta»)", " · 3 пояснения («build дважды»)")}</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<><code>ci.yml</code>{t(" +17 satr: xuddi shu services va healthcheck · ", " +17 строк: те же services и healthcheck · ")}<b>{t("env job darajasida", "env на уровне job")}</b>{t(" (hamma qadamga) · smoke oxirida · izohsiz", " (во все шаги) · smoke в конце · без пояснений")}</>} />
    </div>}
    {seg.v === 'runs' && <div className="pg-two c1-small"><RunView k="40" ann={null} only={/Initialize|npm ci|npm run smoke|Stop/} hlStep="Run npm run smoke" /><RunView k="41" ann={null} only={/Initialize|npm ci|npm run smoke|Stop/} hlStep="Run npm run smoke" /></div>}
  </>} />;
}

// ============================================================
//  18 · AI'ni qabul qilish: to'rt savol; tayanch to'g'ri — AI ham to'g'ri
// ============================================================
const AI1_ENV = lineN('YML_AI1', /DATABASE_URL:/); const AI2_ENV = lineN('YML_AI2', /DATABASE_URL:/);
const AI1_CM = KOD.YML_AI1.lines.filter((l) => /^\s*#/.test(l.t));
const FOUR18 = ['`services: postgres` + healthcheck bormi?', '`DATABASE_URL` smoke qadamiga yetib boradimi (`env` qayerda)?', 'Tartib: smoke `build`dan keyinmi (yoki `needs: test`)?', 'Secret kerakmi: konteyner — yo\'q; tashqi baza — ha'];
const S18 = mkS(18, [{ v: 'two' }, { v: 'env' }, { v: 'cm' }, { v: 'four' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'two' && <div className="pg-two">
      <div className="c1-mach bad"><h4>{t("CI/CD-1: AI noldan yozdi", "CI/CD-1: AI написал с нуля")}</h4><div className="r"><span>{t("tayanch", "основа")}</span><code>{t("yo'q", "нет")}</code></div><div className="r"><span>node-version</span><code>{t("22 (odatiy)", "22 (по умолчанию)")}</code></div><div className="r"><span>run</span><code>✗ npm ci</code></div></div>
      <div className="c1-mach ok hl"><h4>{t("CI/CD-2: AI sizning faylingizni o'zgartirdi", "CI/CD-2: AI изменил ваш файл")}</h4><div className="r"><span>{t("tayanch", "основа")}</span><code>ci.yml (node 24)</code></div><div className="r"><span>{t("qo'shdi", "добавил")}</span><code>services + smoke</code></div><div className="r"><span>run</span><code>✓ NATIJA: 5/5</code></div></div>
    </div>}
    {seg.v === 'env' && <div style={{ display: 'grid', gap: 8 }}><Yml k="YML_AI1" title={t("ci.yml · 1-AI — env faqat smoke qadamida", "ci.yml · 1-й AI — env только в шаге smoke")} from={AI1_ENV - 2} to={AI1_ENV} ids={{ [AI1_ENV]: 'e' }} focus={['e']} /><Yml k="YML_AI2" title={t("ci.yml · 2-AI — env job darajasida", "ci.yml · 2-й AI — env на уровне job")} from={AI2_ENV - 1} to={AI2_ENV + 1} ids={{ [AI2_ENV]: 'e' }} focus={['e']} /></div>}
    {seg.v === 'cm' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("ci.yml · 1-AI izohlari", "ci.yml · пояснения 1-го AI")} lines={AI1_CM.map((l) => ({ h: yamlLine(l.t.trim()), n: l.n }))} focus={[]} /><div className="n2-warn">{t("1-AI o'zi sezdi: smoke ichida yana ", "1-й AI сам заметил: внутри smoke снова ")}<code>nest build</code> — build <b>{t("ikki marta", "дважды")}</b>{t(". Siz hal qilasiz: ", ". Решаете вы: ")}<code>npm run build</code>{t(" qadami qoladimi.", " шаг остаётся?")}</div></div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI smoke workflow'ini qabul qilish — to'rt savol", "Приём workflow smoke от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR18.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span dangerouslySetInnerHTML={html(x.replace(/`([^`]+)`/g, '<code>$1</code>'))} /></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — konteyner uchun secret kerakmi (YML_AI1, run 40)
// ============================================================
function Screen19(p) {
  return MC(p, 19, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Yml k="YML_AI1" title={t("ci.yml · AI yozgan — smoke qadami", "ci.yml · написал AI — шаг smoke")} from={AI1_ENV - 2} to={AI1_ENV} ids={{ [AI1_ENV]: 'e' }} focus={['e']} />
      <div className="mk-pair"><code>services: postgres</code>{t(" — konteyner job ichida, job bilan o'chadi", " — контейнер внутри job, выключается вместе с job")}</div>
    </div>,
    after: <div className="c1-small"><RunView k="40" ann={null} only={/Initialize|npm run smoke|Stop/} /></div>,
  });
}

// ============================================================
//  20 · Amaliyot 3 — smoke job, PR, merge, badge (prompt — MD 20-ekrandan aynan)
// ============================================================
const PROMPT20 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P20 = mkPractice(20, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: 'prompt.txt', lines: PROMPT20 }, { step: 2, file: F.ci, lines: kod('YML_3_SMOKE_SERVICES'), copy: false }, { step: 3, file: F.readme, lines: kod('README_BADGE') }],
});
function ScreenP20(p) { return <Practice p={p} S={P20.S} steps={P20.steps} trouble={P20.trouble} proof={P20.proof} code={P20.code} tree={['prompt.txt', F.ci, F.readme]} />; }

// ============================================================
//  21 · m4c-03 xaritasi: o'quvchi so'zlari (GithubActionsLesson.jsx — SCREEN_META 23)
// ============================================================
const DICT21 = [["yo'l xaritasi · lenta mashinasi · start signali", 'ci.yml · runner (runs-on) · on: push'], ['nuqta · amal', 'job · step (uses — tayyor amal, run — buyruq)'], ['jurnal · jurnaldan sababni topish', 'qadam logi · annotatsiya → qizil qadam → log (4-ekran)'], ['parallel lentalar', 'strategy.matrix — har qiymat alohida job; fail-fast'], ['yaqin javon', "cache: npm — «Cache saved» → «Cache hit»"], ['seyf', 'GitHub Secrets — ${{ secrets.NOM }}, logda ***; konteyner — env'], ['tablo', 'README badge — actions/workflows/ci.yml/badge.svg']];
const SIM21 = [["matrix: 3 lenta, hammasi ✓", '22 ✗ (lock), 24 ✓; fail-fast 24 ni bekor qildi (30, 31)'], ['seyf: ${{ secrets.API_KEY }} → yashirin', "logda ***; nomi xato — bo'sh, xato yo'q (33)"], ['jurnal: sabab bitta satrda', 'annotatsiya qisqa; sabab qadam logida (15, 11)'], ['tablo: passing', "badge.svg — main'dagi oxirgi run (37)"]];
const S21 = mkS(21, [{ v: 'cards' }, { v: 'dict' }, { v: 'sim' }, { v: 'sim', sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4c-03 (23 ekran)", "Ученик · m4c-03 (23 экрана)")} hl><p>{t("yo'l xaritasi qayerda yashaydi (", "где живёт дорожная карта (")}<code>.github/workflows/</code>{t(") · nuqta = job, amal = step · signal va mashina · ", ") · точка = job, действие = step · сигнал и машина · ")}<code>uses</code>/<code>run</code>{t(" · «Jurnaldan sababni topish» · tartib (DragDrop) · parallel lentalar (matrix, 3 Node — simulyatsiya) · seyf (", " · «Найти причину в журнале» · порядок (DragDrop) · параллельные ленты (matrix, 3 Node — симуляция) · сейф (")}<code>secrets.API_KEY</code>{t(") · tablo (badge) · amaliyot: o'z reposiga ci.yml", ") · табло (badge) · практика: ci.yml в свой репозиторий")}</p></Card>
      <Card c={T.accent} h={t("Siz · bugun (haqiqiy run'lar)", "Вы · сегодня (настоящие run)")}><p>{t("log, annotatsiya · cache saved/hit · matrix + fail-fast · services + smoke · env/secrets, nom xatosi · PR → checks → merge · badge · AI", "лог, аннотация · cache saved/hit · matrix + fail-fast · services + smoke · env/secrets, ошибка в имени · PR → checks → merge · badge · AI")}</p></Card>
    </div>}
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT21.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'sim' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Simulyatsiya (o'quvchi darsi) ↔ haqiqiy Actions (bugun)", "Симуляция (урок ученика) ↔ настоящий Actions (сегодня)")}</div><table className="pg-dict"><tbody>{SIM21.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
      {seg.sum && <div className="mk-rule">{t("Simulyatsiya — tushuncha, haqiqiy run — tajriba. Sinfda o'z reponingizdagi ", "Симуляция — понятие, настоящий run — опыт. В классе откройте ")}<b>{t("bitta run'ni proyektorda", "один run из своего репозитория на проекторе")}</b>{t(" oching: job → qadam → log → cache hit.", " : job → шаг → лог → cache hit.")}</div>}</>}
  </>} />;
}

// ============================================================
//  22 · «Repongiz yo'qmi?» namunasi — sinfdagi tuzoqlar (cicd2-out/01–04 lokal, 01.11)
// ============================================================
const T22A = outPick('v1-01', (l) => /^\$|"name"|"scripts"|"test"|^\}|^\{/.test(l));
const T22B = outPick('v1-02', (l) => /^\$|can only install|package-lock|chiqish kodi|^\[/.test(l));
const T22C = outPick('v1-03', (l) => /^\$|^ok$|^> |chiqish kodi|^\[/.test(l));
const T22D = outPick('v1-04', (l) => /^\$|xato|exit|chiqish kodi|^\[|"test"/.test(l));
const S22 = mkS(22, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'd' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'a' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("VS Code terminali · ci-mashq (o'quvchi namunasi)", "терминал VS Code · ci-mashq (образец ученика)")} lines={T22A} /><Term title={t("VS Code terminali · npm install && npm test", "терминал VS Code · npm install && npm test")} lines={T22C} /></div>}
    {seg.v === 'b' && <Term title={t("VS Code terminali · npm ci (GitHub andozasi shunday yozadi)", "терминал VS Code · npm ci (так пишет шаблон GitHub)")} lines={T22B} er />}
    {seg.v === 'c' && <Term title={t("VS Code terminali · «testni buzing»", "терминал VS Code · «сломайте тест»")} lines={T22D} er />}
    {seg.v === 'd' && <div className="pg-three">
      <Card c={T.accent} h={t("1 · lock yo'q", "1 · нет lock")}><p>{t("GitHub andozasi ", "Шаблон GitHub ")}<code>npm ci</code>{t(" yozadi → ", " пишет → ")}<b>{t("qizil", "красный")}</b>{t(". Yechim: ", ". Решение: ")}<code>npm install</code>{t(" yoki lock commit'ga.", " или lock в commit.")}</p></Card>
      <Card c={T.accent} h="2 · echo ok"><p><code>"test": "echo ok && exit 0"</code>{t(" hech qachon qizil bo'lmaydi → uyga vazifadagi «buzing» — ", " никогда не бывает красным → «сломайте» из домашнего задания — ")}<code>exit 1</code>{t(" yoki Jest loyihasi.", " или Jest-проект.")}</p></Card>
      <Card c={T.green} h={t("3 · @v4 ishlaydi", "3 · @v4 работает")}><p>{t("Bugungi run'larda ham ", "И в сегодняшних run ")}<code>@v4</code>{t(" ✓; ogohlantirish «Node.js 20 is deprecated … forced to run on Node.js 24» — xato emas.", " ✓; предупреждение «Node.js 20 is deprecated … forced to run on Node.js 24» — не ошибка.")}</p></Card>
    </div>}
  </>} />;
}

// ============================================================
//  23 · Siz qo'shasiz, xato qiladigan joylar, o'quvchi so'rasa
// ============================================================
const ADD23 = [["haqiqiy run'ni proyektorda: job → qadam → log; annotatsiya vs log (4-ekran)", '«Jurnaldan sababni topish»'], ["matrix'da haqiqiy natija: bitta versiya qizil bo'lishi mumkin, fail-fast qolganini to'xtatadi (8–9)", 'parallel lentalar'], ["secret nomi xato — xato chiqmaydi, bo'sh keladi (14); konteyner uchun secret kerak emas", 'seyf'], ["namunadagi npm ci va echo ok tuzoqlari (22)", '«Repongiz yo\'qmi?» + uyga vazifa']];
const CARDS23 = [
  ["npm ci qizil, lock yo'q", 'can only install with an existing package-lock.json', "npm install (namuna) yoki lock commit'ga"],
  ["matrix'da bitta job «cancelled»", 'The strategy configuration was canceled because … failed', "xato boshqa job'da; fail-fast: false"],
  ['«testni buzdim, baribir yashil»', 'ok', 'echo ok && exit 0 — buzilmaydi; exit 1 yoki Jest loyihasi'],
];
const QA23 = [
  ['«Jurnal qayerda?»', 'run → job → qadam; qadam nomini bosing — log ochiladi.'],
  ["«Matrix'da hammasi yashil bo'lishi shartmi?»", "Yo'q — maqsad qaysi versiyada ishlashini bilish; qizil versiya — javob."],
  ["«Seyfdagi kalitni ko'rsam bo'ladimi?»", "Yo'q — logda ***; qiymat faqat yozilganda ko'rinadi, keyin hech kim o'qiy olmaydi."],
  ["«Badge qizil bo'lsa nima?»", "main'dagi oxirgi run qizil — Actions'ni ochib qaysi qadam qizilligini toping."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'add' }, { v: 'err' }, { v: 'qa' }, { v: 'qa' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'add' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Siz qo'shasiz", "Вы добавляете")}</div><table className="pg-dict"><tbody>{ADD23.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></>}
    {seg.v === 'err' && <div className="pg-three">{CARDS23.map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${i + 1} · ${h}`}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>}
    {seg.v === 'qa' && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: job va mashina, checkout, qizilni o'qish, cache, fail fast, services, secret nomi va pull request. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi lentam qizil desa, job, qadam va logga birga tushasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  25 · Yakun (M13, M14, M30)
// ============================================================
const SUM25 = [
  { k: 'run', t: "run → job → step; GitHub qo'shadi: Set up job (runner, token ruxsati, action'lar), Post Run (cache), Complete job. uses ichi ochiq: checkout — git init + fetch --depth=1; setup-node — «Found in cache», Node/npm versiyasi", st: ['run'] },
  { k: 'red', t: "Qizil run: belgi → job → qadam → log. Annotatsiya — manzil (##[error] satrlari), sabab — qadam logida. Cache: «saved» → «hit» (npm ci 11 s → 5 s); tarmoqqa bog'liq («not found» — xato emas)", st: ['run'] },
  { k: 'matrix', t: "matrix — bitta job, bir nechta qiymat, parallel; fail-fast (odatiy) bittasi yiqilsa qolganini «cancelled» qiladi; to'liq javob — fail-fast: false. Bot/sayt uchun bitta Node yetadi", st: ['matrix'] },
  { k: 'smoke', t: "Bazali tekshiruv lentada: smoke job needs: test, services: postgres:18 (parol, POSTGRES_DB, port, pg_isready healthcheck), npm run smoke env: DATABASE_URL → Initialize containers → NATIJA: 5/5 ✓ → Stop containers", st: ['smoke'] },
  { k: 'secret', t: "env — konteyner (sir emas); Secrets — tashqi resurs (Settings → Secrets, ${{ secrets.NOM }}, logda ***). Nomi xato — xato yo'q, qiymat bo'sh, dastur yiqiladi («topilmadi»)", st: ['smoke'] },
  { k: 'pr', t: "Pull request: tarmoq → PR → pull_request run → checks → merge → main run; README badge. AI smoke workflow'i: tayanch (ci.yml) to'g'ri bo'lsa AI ham to'g'ri; to'rt savol: services + healthcheck · env yetadimi · tartib · secret kerakmi", st: ['pr', 'ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + Actions); har band rasmning o'z qismini yoritadi
const MAP25 = {
  run: { on: CI_ON, jest: S1M[1].jest },
  red: { on: CI_ON, jest: { name: 'Actions', steps: [['npm ci', 'ok'], ['tsc', 'ok'], ['npm test', 'bad'], ['build', 'skip']], res: 'fail', badge: '##[error]' } },
  matrix: { on: CI_ON, jest: { name: 'Actions', steps: [['test (22)', 'bad'], ['test (24)', 'skip']], res: 'fail', badge: 'fail-fast → cancelled' } },
  smoke: { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: { name: 'Actions', steps: [['test', 'ok'], ['smoke', 'ok']], res: 'pass', badge: 'NATIJA: 5/5 ✓' } },
  secret: { on: [...CI_ON, 'db'], dbLabel: DB_SVC, jest: { name: 'Actions', steps: [['test', 'ok'], ['smoke', 'bad']], res: 'fail', get badge() { return t('DATABASE_URL topilmadi', 'DATABASE_URL не найден'); } } },
  pr: { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: CI2_OK },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.pr;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — lenta ichida: job'lar, matrix, Postgres va secret", 'Сегодняшний урок — внутри конвейера: job, matrix, Postgres и secret')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "lint job — ci.yml: jobs.lint — checkout · setup-node · npm ci · npx prettier --check \"src/**/*.ts\" (uch job: test · smoke · lint)", c: ['npx prettier --check "src/**/*.ts"'] },
  { t: "Himoya — Settings → Branches → rule main → Require status checks: test, smoke, lint", c: ['Settings → Branches → Add branch ruleset → main'] },
  { t: "Qizil PR — tarmoq lint-sinov, src/api/app.controller.ts formatini buzing (bir qatorga), push, PR: lint ✗, Merge yopiq", c: ['git checkout -b lint-sinov', 'git push -u mine lint-sinov'] },
  { t: "Yashil PR — prettier --write, push: uchalasi ✓, merge", c: ['npx prettier --write src/api/app.controller.ts'] },
  { t: "Topshirish — repo linki + PR manzili → platformadagi uyga vazifa", c: [] },
];
const CHEATSHEET25 = `# GitHub Actions — mentor eslatmasi (OrderBotNest, run ichi → PR)
## Loyiha
git fetch --tags · git checkout cicd2-start (= cicd1-done) → cicd2-done (PR #1 merge: smoke job + README badge) · npm test — 25 test · npm run smoke — Postgres kerak (DATABASE_URL)
## run → job → step
run = bitta push · job = jobs: ostidagi har nom (alohida mashina; needs — tartib) · step = har uses/run · GitHub qo'shadi: Set up job · Post Run … · Complete job
## uses ichida (log)
Set up job: Image: ubuntu-26.04 · GITHUB_TOKEN Permissions: Contents: read · Download action repository · checkout: Deleting the contents → git init → fetch --depth=1 · setup-node: Found in cache @ …/node/24.22.1 · node: v24.22.1 · npm: 11.19.1
## Qizil run'ni o'qish
belgi → qizil job → qizil qadam (✗) → log · annotatsiya = ##[error] satrlari (qisqa, manzil) · Jest xatosi annotatsiyaga chiqmaydi — faqat «exit code 1»
## cache: npm
1-run: npm cache is not found → Post: Cache saved with the key: node-cache-Linux-x64-npm-<lock hash> · 2-run: Cache hit for: … (npm ci 11 s → 5 s) · boshqa tarmoq: not found (xato emas)
## matrix
strategy: matrix: node-version: [22, 24] · node-version: \${{ matrix.node-version }} → test (22), test (24) parallel · fail-fast (odatiy true): bittasi yiqilsa qolgani cancelled («The strategy configuration was canceled because "test._22" failed») · fail-fast: false — to'liq javob · bot/sayt — bitta Node yetadi
## smoke job (services)
smoke: needs: test · services: postgres: image: postgres:18 · env: POSTGRES_PASSWORD: postgres, POSTGRES_DB: shop · ports: - 5432:5432 · options: --health-cmd "pg_isready -U postgres" … · steps: checkout · setup-node · npm ci · npm run smoke (env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop) → Initialize containers → NATIJA: 5/5 ✓ → Stop containers
## env ↔ secrets
konteyner — env: (ochiq, job bilan o'ladi) · tashqi resurs (prod baza, bot token) — Settings → Secrets and variables → Actions; yml: \${{ secrets.NOM }}; logda *** · nomi xato (DATABSE_URL) — xato yo'q, qiymat bo'sh → «DATABASE_URL topilmadi» (kod 2)
## Pull request · badge
git checkout -b lenta-smoke → push → PR (lenta-smoke → main) → on: pull_request run → checks: test ✓ smoke ✓ → Merge → main run · README: [![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)](…)
## AI smoke workflow'iga to'rt savol
services + healthcheck bormi · DATABASE_URL smoke qadamiga yetadimi (env qayerda) · tartib (build'dan keyin / needs: test) · secret kerakmi (konteyner — yo'q) · tayanch ci.yml to'g'ri bo'lsa AI ham to'g'ri
## Sinfga tayyorgarlik (m4c-03, 23 ekran)
yo'l xaritasi = ci.yml · nuqta = job · amal = step · jurnal = log · parallel lentalar = matrix · yaqin javon = cache · seyf = secrets · tablo = badge · namuna: npm ci lock yo'q → qizil; echo ok buzilmaydi
## Xato qiladigan joylar
can only install with an existing package-lock.json → npm install / lock commit'ga · cancelled → boshqa job yiqildi, fail-fast · «buzdim, yashil» → echo ok · DATABASE_URL topilmadi → env/secret nomi · ECONNREFUSED 5432 → services/ports/healthcheck
## Sizning uyga vazifangiz (40–60 daqiqa)
lint job · branch rule (required checks) · qizil PR → yashil PR · repo linki + PR manzili platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "<b>run → job → step</b>; GitHub qadamlari; uses ichi ochiq", "Birinchi: run, job, step. GitHub o'zi set up job, post run va complete job'ni qo'shadi. Uses yashirin emas: checkout git init va fetch depth bir qiladi, setup node tayyor Node'ni topadi, logda Node va npm versiyasi.", { hl: 'run' }),
  sg('b2', "Qizilni o'qish: <b>belgi → job → qadam → log</b>; cache saved → hit", "Ikkinchi: qizil run'ni belgi, job, qadam, log tartibida o'qing. Annotatsiya manzil, sabab logda. Cache npm birinchi run'da saqlanadi, ikkinchisida hit, npm si ay ikki barobar tez. Boshqa tarmoqda not found, bu xato emas.", { hl: 'red' }),
  sg('b3', "<b>matrix</b> — bir nechta versiya parallel; fail-fast qolganini bekor qiladi", "Uchinchi: matrix bitta faylni bir nechta Node'da parallel sinaydi. Fail fast odatiy: bittasi yiqilsa qolgani cancelled. To'liq javob uchun fail fast false. Bot yoki sayt uchun mashinangizdagi bitta Node yetadi.", { hl: 'matrix' }),
  sg('b4', "Smoke lentada: <b>services: postgres</b>, healthcheck, needs: test", "To'rtinchi: bazali tekshiruv lentada. Smoke job needs test bilan, services postgres o'n sakkiz, parol, baza nomi, port, pg is ready healthcheck. Initialize containers, npm run smoke, natija besh besh, stop containers.", { hl: 'smoke' }),
  sg('b5', "<b>env</b> — konteyner, <b>secrets</b> — tashqi; nomi xato — bo'sh, xato yo'q", "Beshinchi: konteyner paroli env'da ochiq, bu to'g'ri. Haqiqiy baza va token secrets'da, logda yulduzcha. Secret nomi xato bo'lsa GitHub indamaydi, qiymat bo'sh keladi, dastur topilmadi deb yiqiladi.", { hl: 'secret' }),
  sg('b6', "<b>Pull request</b> → checks → merge; badge; AI'ga to'rt savol", "Oltinchi: yangi ish alohida tarmoqda, pull request, checks yashil, merge, main'da run. README'da badge. AI smoke workflow'i: tayanch to'g'ri bo'lsa AI ham to'g'ri; to'rt savol: services, env, tartib, secret kerakmi.", { hl: 'pr' }),
  sg('hw', "<b>Uyga vazifa</b>: lint job, main himoyasi, qizil PR → yashil PR", "Uyga vazifa: lentaga uchinchi job lint, prettier check bilan. Keyin main tarmog'ini himoyalang: required status checks, test, smoke, lint. Ataylab noto'g'ri formatlangan fayl bilan pull request oching: lint qizil, merge yopiq.", { hl: 'hw' }),
  sg('hw2', "Tuzatib push — <b>yashil, merge</b>; repo va PR manzili platformaga", "Tuzatib push qiling: uchalasi yashil, merge. README'dagi badge yashil. Repo linkini va PR manzilini platformadagi uyga vazifaga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: run ichi, cache, matrix, services, secrets, PR — bir sahifada", "Pastda bir sahifalik eslatma: run, job, step, uses loglari, qizilni o'qish, cache, matrix, smoke job qolipi, env va secrets, pull request, badge, AI'ga to'rt savol, sinf lug'ati va xato qiladigan joylar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('github-actions-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b> <code>ci.yml</code>{t("da uch job · branch rule bor · PR tarixida qizil ", "три job · есть branch rule · в истории PR красный ")}<code>lint</code>{t(" run va keyin yashil merge.", " run, потом зелёный merge.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("WebSocket: jonli panel", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Bot buyurtma olsa — brauzerdagi panel sahifani yangilamasdan o'zi ko'rsatadi", RS('NEXT_D'))}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
// F-1120-02 (M51): muqova — chapda dars nima berishi, o'ngda darsning rasmi; eslatmalar bitta qisqa satrda
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card n1-cv">
      <div className="tx">
        <p className="mk-eyebrow">{t("Mentor kursi · CI/CD", "Курс для менторов · CI/CD")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["qizil run'ni o'qiysiz: run → job → step → log, cache va matrix nima qilishini bilasiz", "smoke'ni lentaga qo'yasiz: services: postgres:18 va DATABASE_URL, secret nomi xatosini topasiz", "pull request bilan ishlaysiz va AI yozgan workflow'ni to'rt savol bilan tekshirasiz"], ['прочитаете красный run: run → job → step → лог, поймёте cache и matrix', 'поставите smoke в конвейер: services: postgres:18 и DATABASE_URL, найдёте ошибку в имени secret', 'поработаете с pull request и проверите workflow от AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 11-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: CI/CD-1 darsi (o'z reponingizda ci.yml), Node.js 20+, VS Code, AI yordamchi; Postgres lentada konteyner bo'lib ko'tariladi · Loyiha: cicd2-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 11-го экрана можно сделать перерыв · Нужно: урок CI/CD-1 (ci.yml в своём репозитории), Node.js 20+, VS Code, AI-помощник; Postgres поднимается в конвейере контейнером · Проект: тег cicd2-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={[...CI_ON, 'db', 'products', 'users', 'carts', 'orders']} dbLabel={DB_SVC} jest={CI2_OK} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, ScreenP11, Screen12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, ScreenP20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function GithubActionsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
  useCssN1(); // F-1120-02: dars rasmi uslubi (parts/02b-rasm.jsx)
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/cicd2-*.json, ru/cicd2-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/cicd2-sahna.js) ---
// CI/CD-2 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Чтение красного и cache', 'matrix', 'Smoke и secret', 'PR и AI', 'Подготовка к классу'] },
};
ru(FOUR18, ['есть `services: postgres` + healthcheck?', 'доходит ли `DATABASE_URL` до шага smoke (где `env`)?', 'Порядок: smoke после `build` (или `needs: test`)?', 'Нужен ли secret: контейнер — нет; внешняя база — да']);
ru(DICT21, [['маршрут · машина ленты · стартовый сигнал', null], ['точка · действие', 'job · step (uses — готовое действие, run — команда)'], ['журнал · найти причину в журнале', 'лог шага · аннотация → красный шаг → лог (экран 4)'], ['параллельные ленты', 'strategy.matrix — каждое значение отдельная job; fail-fast'], ['ближняя полка', null], ['сейф', 'GitHub Secrets — ${{ secrets.NOM }}, в логе ***; контейнер — env'], ['табло', null]]);
ru(SIM21, [['matrix: 3 ленты, все ✓', '22 ✗ (lock), 24 ✓; fail-fast отменил 24 (30, 31)'], ['сейф: ${{ secrets.API_KEY }} → скрыт', 'в логе ***; имя неверное — пусто, ошибки нет (33)'], ['журнал: причина в одной строке', 'аннотация короткая; причина в логе шага (15, 11)'], ['табло: passing', 'badge.svg — последний run в main (37)']]);
ru(ADD23, [['настоящий run на проекторе: job → шаг → лог; аннотация vs лог (экран 4)', '«Найти причину в журнале»'], ['настоящий результат matrix: одна версия может быть красной, fail-fast останавливает остальные (8–9)', 'параллельные ленты'], ['неверное имя secret — ошибки нет, приходит пусто (14); для контейнера secret не нужен', 'сейф'], ['ловушки npm ci и echo ok в образце (22)', '«Нет репозитория?» + домашнее задание']]);
ru(CARDS23, [
  ['npm ci красный, нет lock', null, 'npm install (образец) или lock в commit'],
  ['в matrix одна job «cancelled»', null, 'ошибка в другой job; fail-fast: false'],
  ['«сломал тест, а всё равно зелёный»', null, 'echo ok && exit 0 — не ломается; exit 1 или Jest-проект'],
]);
ru(QA23, [
  ['«Где журнал?»', 'run → job → шаг; нажмите на имя шага — откроется лог.'],
  ['«В matrix всё обязательно должно быть зелёным?»', 'Нет — цель знать, на какой версии работает; красная версия — это ответ.'],
  ['«Можно увидеть ключ в сейфе?»', 'Нет — в логе ***; значение видно только при записи, потом его никто не прочитает.'],
  ['«А если badge красный?»', 'последний run в main красный — откройте Actions и найдите красный шаг.'],
]);
ru(SUM25, [
  { t: 'run → job → step; GitHub добавляет: Set up job (runner, право токена, action), Post Run (cache), Complete job. Внутри uses открыто: checkout — git init + fetch --depth=1; setup-node — «Found in cache», версия Node/npm' },
  { t: 'Красный run: знак → job → шаг → лог. Аннотация — адрес (строки ##[error]), причина — в логе шага. Cache: «saved» → «hit» (npm ci 11 с → 5 с); привязан к ветке («not found» — не ошибка)' },
  { t: 'matrix — одна job, несколько значений, параллельно; fail-fast (по умолчанию): если одна упала, остальные «cancelled»; полный ответ — fail-fast: false. Боту/сайту хватит одного Node' },
  { t: 'Проверка с базой в конвейере: job smoke needs: test, services: postgres:18 (пароль, POSTGRES_DB, порт, healthcheck pg_isready), npm run smoke env: DATABASE_URL → Initialize containers → NATIJA: 5/5 ✓ → Stop containers' },
  { t: 'env — контейнер (не секрет); Secrets — внешний ресурс (Settings → Secrets, ${{ secrets.NOM }}, в логе ***). Неверное имя — ошибки нет, значение пустое, программа падает («topilmadi»)' },
  { t: 'Pull request: ветка → PR → run pull_request → checks → merge → run в main; badge в README. Workflow smoke от AI: если опора (ci.yml) верна, AI тоже верен; четыре вопроса: services + healthcheck · доходит ли env · порядок · нужен ли secret' },
]);
RU_S.TITLE = 'Внутри GitHub Actions: от красного run до PR';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 4 проверки · самопроверка 8 вопросов. После экрана 11 можно сделать перерыв', 'Нужно: урок для менторов CI/CD-1 (в вашем репозитории на GitHub ci.yml и зелёный run) · Node.js 20+ · VS Code · AI-помощник. База и токен бота не нужны — Postgres поднимается в конвейере контейнером', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега cicd2-start (= cicd1-done); каждый run — из настоящего GitHub Actions'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: job и машина, checkout, чтение красного, cache, fail fast, services, имя secret и pull request. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет «у меня конвейер красный», вы вместе спуститесь в job, шаг и лог.';
RU_S.NEXT_T = 'WebSocket: живая панель';
RU_S.NEXT_D = 'Бот получил заказ — панель в браузере показывает его сама, без обновления страницы';
RU_S.FILE = 'github-actions-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['<b>run → job → step</b>; шаги GitHub; внутри uses открыто', 'Первое: run, job, step. GitHub сам добавляет set up job, post run и complete job. Uses не скрыт: checkout делает git init и fetch depth один, setup node находит готовый Node, в логе версии Node и npm.'],
  b2: ['Чтение красного: <b>знак → job → шаг → лог</b>; cache saved → hit', 'Второе: красный run читайте в порядке знак, job, шаг, лог. Аннотация — адрес, причина — в логе. Cache npm сохраняется в первом run, во втором hit, npm ci вдвое быстрее. В другой ветке not found, это не ошибка.'],
  b3: ['<b>matrix</b> — несколько версий параллельно; fail-fast отменяет остальные', 'Третье: matrix параллельно проверяет один файл на нескольких Node. Fail fast по умолчанию: если одна упала, остальные cancelled. Для полного ответа — fail fast false. Боту или сайту хватит одного Node с вашей машины.'],
  b4: ['Smoke в конвейере: <b>services: postgres</b>, healthcheck, needs: test', 'Четвёртое: проверка с базой в конвейере. Job smoke с needs test, services postgres восемнадцать, пароль, имя базы, порт, healthcheck pg is ready. Initialize containers, npm run smoke, итог пять из пяти, stop containers.'],
  b5: ['<b>env</b> — контейнер, <b>secrets</b> — внешнее; неверное имя — пусто, ошибки нет', 'Пятое: пароль контейнера открыт в env, и это правильно. Настоящая база и токен — в secrets, в логе звёздочки. Если имя secret неверное, GitHub молчит, приходит пустое значение, и программа падает с «не найден».'],
  b6: ['<b>Pull request</b> → checks → merge; badge; четыре вопроса к AI', 'Шестое: новая работа в отдельной ветке, pull request, checks зелёные, merge, run в main. Badge в README. Workflow smoke от AI: если опора верна, AI тоже верен; четыре вопроса: services, env, порядок, нужен ли secret.'],
  hw: ['<b>Домашнее задание</b>: job lint, защита main, красный PR → зелёный PR', 'Домашнее задание: третья job в конвейере — lint, через prettier check. Потом защитите ветку main: required status checks, test, smoke, lint. Откройте pull request с нарочно неверно отформатированным файлом: lint красный, merge закрыт.'],
  hw2: ['Исправьте и push — <b>зелёный, merge</b>; адрес репозитория и PR — на платформу', 'Исправьте и сделайте push: все три зелёные, merge. Badge в README зелёный. Вставьте ссылку на репозиторий и адрес PR в домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: внутри run, cache, matrix, services, secrets, PR — на одной странице', 'Внизу памятка на одну страницу: run, job, step, логи uses, чтение красного, cache, matrix, шаблон job smoke, env и secrets, pull request, badge, четыре вопроса к AI, словарь класса и места, где ошибаются. Скопируйте или скачайте.'],
};
RU_S.CHEAT = `# GitHub Actions — памятка ментора (OrderBotNest, внутри run → PR)
## Проект
git fetch --tags · git checkout cicd2-start (= cicd1-done) → cicd2-done (merge PR #1: job smoke + badge в README) · npm test — 25 тестов · npm run smoke — нужен Postgres (DATABASE_URL)
## run → job → step
run = один push · job = каждое имя под jobs: (отдельная машина; needs — порядок) · step = каждый uses/run · GitHub добавляет: Set up job · Post Run … · Complete job
## Внутри uses (лог)
Set up job: Image: ubuntu-26.04 · GITHUB_TOKEN Permissions: Contents: read · Download action repository · checkout: Deleting the contents → git init → fetch --depth=1 · setup-node: Found in cache @ …/node/24.22.1 · node: v24.22.1 · npm: 11.19.1
## Чтение красного run
знак → красная job → красный шаг (✗) → лог · аннотация = строки ##[error] (коротко, адрес) · ошибка Jest в аннотацию не выходит — только «exit code 1»
## cache: npm
1-й run: npm cache is not found → Post: Cache saved with the key: node-cache-Linux-x64-npm-<hash lock> · 2-й run: Cache hit for: … (npm ci 11 с → 5 с) · другая ветка: not found (не ошибка)
## matrix
strategy: matrix: node-version: [22, 24] · node-version: \${{ matrix.node-version }} → test (22), test (24) параллельно · fail-fast (по умолчанию true): одна упала — остальные cancelled («The strategy configuration was canceled because "test._22" failed») · fail-fast: false — полный ответ · боту/сайту хватит одного Node
## job smoke (services)
smoke: needs: test · services: postgres: image: postgres:18 · env: POSTGRES_PASSWORD: postgres, POSTGRES_DB: shop · ports: - 5432:5432 · options: --health-cmd "pg_isready -U postgres" … · steps: checkout · setup-node · npm ci · npm run smoke (env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop) → Initialize containers → NATIJA: 5/5 ✓ → Stop containers
## env ↔ secrets
контейнер — env: (открыто, умирает с job) · внешний ресурс (боевая база, токен бота) — Settings → Secrets and variables → Actions; в yml: \${{ secrets.NOM }}; в логе *** · неверное имя (DATABSE_URL) — ошибки нет, значение пустое → «DATABASE_URL topilmadi» (код 2)
## Pull request · badge
git checkout -b lenta-smoke → push → PR (lenta-smoke → main) → run on: pull_request → checks: test ✓ smoke ✓ → Merge → run в main · README: [![CI](https://github.com/<вы>/OrderBotNest/actions/workflows/ci.yml/badge.svg)](…)
## Четыре вопроса к workflow smoke от AI
есть ли services + healthcheck · доходит ли DATABASE_URL до шага smoke (где env) · порядок (после build / needs: test) · нужен ли secret (контейнер — нет) · если опорный ci.yml верен, AI тоже верен
## Подготовка к классу (m4c-03, 23 экрана)
маршрут = ci.yml · точка = job · действие = step · журнал = лог · параллельные ленты = matrix · ближняя полка = cache · сейф = secrets · табло = badge · образец: npm ci без lock → красный; echo ok не ломается
## Где ошибаются
can only install with an existing package-lock.json → npm install / lock в commit · cancelled → упала другая job, fail-fast · «сломал, а зелёный» → echo ok · DATABASE_URL topilmadi → env/имя secret · ECONNREFUSED 5432 → services/ports/healthcheck
## Ваше домашнее задание (40–60 минут)
job lint · правило ветки (required checks) · красный PR → зелёный PR · ссылка на репозиторий + адрес PR на платформу`;
ru(HOMEWORK25, [
  { t: 'job lint — ci.yml: jobs.lint — checkout · setup-node · npm ci · npx prettier --check "src/**/*.ts" (три job: test · smoke · lint)' },
  { t: 'Защита — Settings → Branches → правило main → Require status checks: test, smoke, lint' },
  { t: 'Красный PR — ветка lint-sinov, сломайте формат src/api/app.controller.ts (в одну строку), push, PR: lint ✗, Merge закрыт' },
  { t: 'Зелёный PR — prettier --write, push: все три ✓, merge' },
  { t: 'Сдача — ссылка на репозиторий + адрес PR → домашнее задание на платформе' },
]);
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxati
ru(ORDER4, ['Значок: run красный', 'Слева красный job', 'Красный шаг (✗)', 'Лог шага — причина здесь', 'Строки ##[error] → аннотация (кратко)']);

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · CI/CD",
  "title": "Конвейер есть, и он зелёный. Сегодня заходим внутрь: лог, cache, matrix, smoke с Postgres, secret и pull request — всё на настоящих run",
  "seg": {
   "a": [
    "В CI/CD-1 вы написали конвейер — сегодня заходим <b>внутрь Actions</b>, всё на настоящих run",
    "Здравствуйте. На прошлом уроке вы написали конвейер для OrderBotNest: при каждом push четыре шага. Сегодня заходим внутрь этого конвейера. На экране результат в конце урока: две job, test и smoke, smoke с настоящим Postgres, обе зелёные."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: run, job, step и шаги, которые GitHub добавляет сам",
    "Сначала общее понятие: что делает Actions, что такое run, job и step, какие шаги GitHub добавляет сам и что происходит внутри uses. Потом увидите, как правильно читать красный run и что делает cache."
   ],
   "c": [
    "Потом <b>matrix, smoke с сервисом Postgres, secret и pull request</b>",
    "На третьем этапе matrix: один файл, два Node. На четвёртом ставим в конвейер проверку с базой: сервис Postgres и smoke. Что такое secret и что будет, если ошибиться в имени. На пятом — pull request и workflow, написанные AI. В конце подготовка к классу."
   ],
   "d": [
    "Шесть этапов, три практики — <b>в вашем репозитории на GitHub</b>; каждый run настоящий",
    "Урок — шесть этапов, три практики, всё в вашем репозитории с CI/CD-1. Каждый run на экране настоящий: запущен в OrderBotNest в этот день, шаги и секунды те же. Не спешите, каждый экран можно прослушать с начала. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "Каждый push — run; в файле каждое имя под jobs: — одна job на отдельной машине; внутри job шаги; три из них GitHub добавляет сам",
  "seg": {
   "a": [
    "Run — один push; <b>job — каждое имя под <code>jobs:</code> в файле</b>, каждая на отдельной машине",
    "Разберёмся в Actions с начала. Каждый push — один run. В файле под jobs одно имя, test, значит одна job. Job — это отдельная машина: напишете два имени — параллельно откроются две машины. Это увидите в matrix и smoke."
   ],
   "b": [
    "Step — шаг внутри job: <b>каждый <code>uses</code> и <code>run</code> — одна строка «Run …»</b>",
    "Внутри job шаги: сколько в файле под steps строк uses и run, столько строк Run в окне run. Checkout, setup node, четыре команды. Рядом с каждой строкой знак и секунды, нажмёте — лог."
   ],
   "c": [
    "Три из них вы не писали: <b><code>Set up job</code>, <code>Post Run …</code>, <code>Complete job</code></b> — их добавляет GitHub",
    "Но в списке есть и строки, которые вы не писали. В начале set up job: подготовка машины. В конце post run, то есть очистка и сохранение cache, и complete job. GitHub добавляет их к каждой job сам. В их логе есть полезное, сейчас посмотрим."
   ],
   "d": [
    "Итог: <b>run → job → step</b>; если красный — какая job, какой шаг, его лог",
    "Итог: run, job, step. Run зелёный или красный. Если красный, спускаетесь вниз: какая job, какой шаг, и читаете лог этого шага. Теперь заглянем внутрь шагов, которые добавил GitHub."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · общее понятие",
  "title": "Готовые шаги не скрыты: Set up job называет машину, checkout делает в пустой папке git init и fetch --depth=1, setup-node находит готовый Node",
  "seg": {
   "a": [
    "Лог <code>Set up job</code>: <b>runner <code>ubuntu-26.04</code>, право токена <code>Contents: read</code></b>, скачиваются action",
    "Откройте run, нажмите на шаг set up job. Машина: image ubuntu двадцать шесть ноль четыре. Ubuntu latest теперь это, изменилось с октября. Право GitHub token: contents read, только чтение. Потом download action repository: скачиваются готовые шаги checkout и setup node, с SHA."
   ],
   "b": [
    "Внутри <code>checkout</code>: <b>очищает папку, <code>git init</code>, <code>fetch --depth=1</code></b> — только последний commit",
    "Нажмите на шаг checkout. Syncing repository, потом deleting the contents: папка очищается. Git init: пустой репозиторий. Git fetch depth один: берётся только последний commit, не вся история, чтобы было быстро. Вот почему в CI/CD-1 без checkout папка была пустой."
   ],
   "c": [
    "Внутри <code>setup-node</code>: <b>«Found in cache» — на runner уже есть Node 24.22.1, npm 11.19.1</b>",
    "Setup node: node version двадцать четыре, cache npm. Found in cache: Node двадцать четыре на runner уже есть, не скачивался. Node v двадцать четыре двадцать два один, npm одиннадцать девятнадцать. Здесь видна ловушка из CI/CD-1: номер версии называет лог."
   ],
   "d": [
    "Итог: <b><code>uses</code> — скрипт, написанный другими</b>, лог открыт; машина, версия, право — здесь",
    "Итог: uses — не что-то скрытое, это скрипт, написанный другими, и лог его открыт. Какая машина, какой Node, на что у токена право — всё в логе этих трёх шагов. Если ошибка непонятна, сначала смотрите сюда. Теперь читаем красный run."
   ]
  }
 },
 "4": {
  "kicker": "Этап 2 · читаем красный",
  "title": "Аннотация на странице run — первая строка ошибки; полная причина в логе красного шага: в run с tsc три аннотации, в логе восемь строк",
  "seg": {
   "a": [
    "Верх страницы run — <b>аннотации</b>: строки, начинающиеся с <code>##[error]</code>, короткие",
    "Откройте красный run, run с tsc из CI/CD-1. Вверху annotations: три строки. Process completed with exit code two, no overload matches this call и первая строка ошибки типа. Это строки лога, начинающиеся со знака error, GitHub выносит их наверх."
   ],
   "b": [
    "Полная причина — <b>в логе красного шага</b>: файл, строка, колонка, две ошибки, что чему не соответствует",
    "Но аннотация короткая. Нажмите на красный шаг: npx tsc. В логе всё: user service ts, двадцатая строка, сорок вторая колонка, TS два три два два, number не соответствует string, и в двадцать второй строке вторая ошибка. Причина здесь, а не в аннотации."
   ],
   "c": [
    "В красном run с тестом аннотация <b>только «exit code 1»</b> — ошибка Jest в логе: FAIL, какой тест, какая строка",
    "В run, где покраснел тест, аннотаций ещё меньше: только process completed with exit code one. Jest не пишет со знаком error. Какой тест, что ожидалось, что пришло, тридцать седьмая строка — всё в логе шага npm test. Аннотация говорит вам только, какой это шаг."
   ],
   "d": [
    "Итог: <b>знак → красная job → красный шаг → лог</b>; аннотация показывает путь, причина в логе",
    "Итог: порядок чтения красного run: знак, красная job, красный шаг, его лог. Аннотация — указатель, причина в логе. Если ученик говорит «у меня конвейер красный, что делать», нажмите эти четыре шага вместе. Теперь проверим."
   ]
  }
 },
 "5": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "Run красный. В аннотации только Process completed with exit code 1. — на шаге npm test. Где прочитаете причину?",
  "q": "Вы видели, как читать красный run, теперь проверим. Первая проверка. Run красный, в аннотации только process completed with exit code one, на шаге npm test. Где прочитаете, какой тест упал? Выберите вариант.",
  "ok": "Верно. Нажимаете на красный шаг: npm test. В логе полный вывод Jest: FAIL, какой тест, что ожидалось и что пришло, тридцать седьмая строка. Аннотация показала только шаг, потому что Jest не пишет со знаком error. Значит, аннотация — адрес, а лог — причина; перезапускать локально не нужно.",
  "okShort": "Лог красного шага — полный вывод Jest. Аннотация — только адрес.",
  "hint": "Порядок с экрана 4: знак → job → шаг → ?",
  "demak": "аннотация — адрес (какой шаг); причина — в логе красного шага. Ошибка Jest в аннотацию не выходит.",
  "opts": [
   "Нажать на аннотацию — она откроет полную ошибку",
   "Нажать на шаг npm test — в логе FAIL и имя теста",
   "Из лога Set up job — он собирает все ошибки",
   "Перезапустить commit локально — лог GitHub неполный"
  ],
  "wrong": {
   "0": "Аннотация — короткая строка, не раскрывается — для Jest только «exit code 1».",
   "2": "Set up job — машина и права; ошибок шагов там нет.",
   "3": "Лог GitHub — полный текст как в вашем терминале; перезапускать локально не нужно."
  }
 },
 "6": {
  "kicker": "Этап 2 · cache",
  "title": "Что делает cache: npm: первый run «Cache saved», второй «Cache hit» — npm ci 11 с → 5 с; а в main «not found»: cache привязан к ветке",
  "seg": {
   "a": [
    "<code>setup-node</code> <code>cache: npm</code> — в первом run <b>«npm cache is not found»</b>, в конце «Cache saved with the key»",
    "Что делает строка cache npm в ci yml? В логе setup node первого run: npm cache is not found, кэша нет. В конце, в шаге post run setup node: cache saved with the key, node cache, Linux, npm и длинное число. Npm ci шёл одиннадцать секунд."
   ],
   "b": [
    "Второй run: <b>«Cache hit» — <code>npm ci</code> с 11 секунд упал до 5</b>; ключ — hash lock-файла",
    "Второй run, та же ветка: cache hit for, тот же ключ. Npm ci — пять секунд: пакеты не из интернета, а из сохранённого кэша. Длинное число в ключе — hash package lock json: изменится lock — изменится ключ, кэш соберётся заново. Поэтому lock должен быть в commit."
   ],
   "c": [
    "Первый run в <code>main</code>: снова <b>«not found»</b> — cache привязан к ветке, кэш <code>ci-sinov</code> в <code>main</code> не переходит",
    "Теперь первый run в ветке main: снова npm cache is not found, npm ci снова одиннадцать секунд. Кэш привязан к ветке: сохранённый в ветке ci sinov в main не переходит. Когда main один раз станет зелёным, следующие run и ветки возьмут этот кэш."
   ],
   "d": [
    "Итог: <b>cache — скорость, а не правильность</b>; «not found» — не ошибка, «hit» — значит lock не менялся",
    "Итог: cache — для скорости, не для правильности: и без кэша конвейер работает правильно, только медленнее. Если видите в логе not found, это не ошибка. Если hit — lock не менялся. Теперь прочитаете свой run."
   ]
  }
 },
 "7": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 12 минут",
  "title": "Откройте в своём репозитории с CI/CD-1 два run: Set up job, checkout, cache «saved» и «hit», секунды npm ci",
  "seg": {
   "a": [
    "Теперь вы: <b>два последних run в вашем репозитории</b>, три лога и cache",
    "Теперь ваша очередь. Откройте на GitHub свой репозиторий с CI/CD-1, раздел Actions. Прочитаете два последних run: логи set up job, checkout, setup node и cache. Push не нужен, только чтение. Займёт двенадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>в <code>Set up job</code> машина и право</b>, в <code>checkout</code> — <code>git init</code> и <code>fetch --depth=1</code>",
    "На первом шаге открываете последний run и находите в логе set up job image и право GITHUB TOKEN. На втором — строки git init и fetch depth один в логе checkout. Сравните с третьим экраном."
   ],
   "c": [
    "Шаги 3–4: <b>cache в двух run: «saved» и «hit»</b>, секунды <code>npm ci</code>; подтверждение — строка hit",
    "На третьем шаге находите cache saved в логе post run setup node старого run и cache hit в логе setup node нового. На четвёртом записываете, сколько секунд шёл npm ci в обоих run. В поле подтверждения скопируйте строку cache hit."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы умеете открыть и прочитать каждый шаг run."
   ]
  },
  "steps": [
   {
    "t": "Set up job",
    "exp": "Image: ubuntu-… · GITHUB_TOKEN Permissions · Download action repository",
    "cmds": [
     "GitHub → Actions → последний run → job test → Set up job"
    ]
   },
   {
    "t": "checkout",
    "exp": "Deleting the contents of · git init · fetch … --depth=1",
    "cmds": [
     "лог Run actions/checkout@v4"
    ]
   },
   {
    "t": "Cache",
    "exp": "Cache saved with the key: node-cache-… · Cache hit for: node-cache-…",
    "cmds": [
     "старый run → Post Run actions/setup-node@v4",
     "новый run → Run actions/setup-node@v4"
    ]
   },
   {
    "t": "Секунды",
    "exp": "во втором меньше",
    "cmds": [
     "секунды рядом с Run npm ci в обоих run"
    ]
   }
  ],
  "proof": {
   "label": "Строка «Cache hit» в новом run",
   "placeholder": "например: Cache hit for: node-cache-Linux-x64-npm-…",
   "wrong": "Вставьте строку Cache hit for: node-cache-… из лога Run actions/setup-node@v4."
  },
  "trouble": [
   [
    "В обоих run npm cache is not found",
    "второй run в другой ветке или нет строки cache: npm — нужны два run подряд в одной ветке"
   ],
   [
    "Нет Cache saved",
    "run закончился красным — Post Run сохраняет cache только когда npm ci прошёл; откройте зелёный run"
   ],
   [
    "Лог не открывается (пустой)",
    "run ещё идёт или старше 90 дней — сделайте новый push"
   ],
   [
    "Вышло Image: ubuntu-24.04",
    "образ runner зависит от даты — не ошибка, запишите число"
   ]
  ]
 },
 "8": {
  "kicker": "Этап 3 · matrix",
  "title": "strategy.matrix.node-version: [22, 24] — одно описание job, две машины: test (22) красный, а test (24)… отменён — fail-fast",
  "seg": {
   "a": [
    "Matrix: <b><code>strategy.matrix</code> — одна job, несколько значений</b>; <code>${{ matrix.node-version }}</code> — каждой машине своё число",
    "Начинаем с matrix. В ci yml под job: strategy, matrix, node version, в скобках двадцать два и двадцать четыре. А в setup node вместо числа — matrix node version. Одно описание job, а GitHub открывает из него две машины: test двадцать два и test двадцать четыре, параллельно."
   ],
   "b": [
    "Run: <b><code>test (22)</code> красный — <code>npm ci</code>, та же ловушка с lock</b>; <code>test (24)</code> «cancelled»",
    "Push, run. Слева две job. Test двадцать два красный: npm ci, та же ловушка из CI/CD-1, missing webpack from lock file. А test двадцать четыре ни зелёный, ни красный: cancelled, отменён, на двадцать второй секунде, когда шёл tsc."
   ],
   "c": [
    "Значит, причина: <b>fail-fast — если одна упала, остальные отменяются</b> (настройка по умолчанию)",
    "Значит, причина в аннотации: the strategy configuration was canceled because test двадцать два failed. Это fail fast: если в matrix падает одна машина, GitHub отменяет остальные, экономит время и машины. Это настройка по умолчанию. Но вы так и не узнаете, что было с двадцать четыре."
   ],
   "d": [
    "Итог: <b>matrix проверяет не машину, а версию</b>; нужен полный результат — <code>fail-fast: false</code>",
    "Итог: matrix проверяет один код на нескольких версиях. Fail fast быстрый, но ответ неполный: зелёный ли двадцать четыре, мы не узнали. Если нужен полный ответ — fail fast false. В следующем run поставим именно его."
   ]
  }
 },
 "9": {
  "kicker": "Этап 3 · matrix",
  "title": "fail-fast: false — обе машины до конца: test (22) красный, test (24) зелёный; run красный, но ответ полный: код работает на 24, на 22 lock не читается",
  "seg": {
   "a": [
    "<code>fail-fast: false</code> — <b>обе машины идут до конца</b>, run всё равно красный (22 упал)",
    "Добавляем под strategy fail fast false. Push. Теперь обе job дошли до конца: test двадцать два красный, test двадцать четыре зелёный, все четыре шага. Run в целом красный, потому что одна упала, но ответ полный."
   ],
   "b": [
    "Лог 22 — <b>та же ошибка из CI/CD-1</b>: npm 10 не может прочитать lock; 24 — всё зелёное",
    "Лог npm ci на двадцать два: missing webpack from lock file, ошибка с семнадцатого экрана CI/CD-1. Двадцать четыре: npm ci, tsc, test, build — всё зелёное. Matrix точно сказал вам: этот проект работает на Node двадцать четыре, на двадцать два lock не читается."
   ],
   "c": [
    "Кому нужен matrix: <b>если пишете библиотеку — да</b>, бот или сайт — хватит одного Node с вашей машины",
    "Кому нужен matrix? Если пишете библиотеку, её используют на разных Node, matrix обязателен. Бот или сайт вроде OrderBotNest работают на одном сервере, на одном Node: хватит числа с вашей машины. В уроке ученика matrix нарисован как параллельные ленты, три Node."
   ],
   "d": [
    "Итог: <b>matrix — несколько версий, параллельно</b>; <code>fail-fast</code> быстро, <code>false</code> — полный ответ",
    "Итог: matrix параллельно проверяет один файл на нескольких версиях. Fail fast быстро останавливает, false даёт полный ответ. Нужно проекту — ставьте, нет — один Node, как на вашей машине. Теперь проверим."
   ]
  }
 },
 "10": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4",
  "title": "matrix [22, 24], fail-fast не написан. test (22) упал на 10-й секунде, test (24) ещё в tsc. Что будет с test (24)?",
  "q": "Вы видели matrix, теперь проверим. Вторая проверка. Matrix двадцать два и двадцать четыре, fail fast не написан. Test двадцать два упал на десятой секунде, test двадцать четыре ещё в tsc. Что будет с двадцать четыре? Выберите вариант.",
  "ok": "Верно. Если fail fast не написан, он true: как только одна машина упала, GitHub отменяет остальные, cancelled. Двадцать четыре остановлен в tsc, результат неизвестен. Если нужен полный ответ, пишется fail fast false. Значит, если в matrix видите cancelled, это не ошибка этой job, а падение другой.",
  "okShort": "<code>fail-fast</code> по умолчанию <code>true</code> — если одна упала, остальные «cancelled». Полный ответ — <code>fail-fast: false</code>.",
  "hint": "Аннотация с экрана 8: «canceled because … failed» — кто кого остановил?",
  "demak": "«cancelled» в matrix — не ошибка этой job: упала другая job, остановил <code>fail-fast</code>.",
  "opts": [
   "Дойдёт до конца — job в matrix не зависят друг от друга",
   "Дойдёт до конца, но результат не войдёт в run",
   "Будет отменён — fail-fast по умолчанию останавливает остальные",
   "Начнётся заново — GitHub использует 24 вместо 22"
  ],
  "wrong": {
   "0": "job в matrix связаны одной strategy — fail-fast управляет ими вместе.",
   "1": "Не дойдёт: на 22-й секунде «cancelled», tsc не закончился.",
   "3": "GitHub не меняет машину; каждое значение — своя машина."
  }
 },
 "11": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Добавьте в ci.yml matrix [22, 24], посмотрите на две job, получите полный ответ с fail-fast: false, потом верните один Node",
  "seg": {
   "a": [
    "Теперь вы: <b>matrix в вашем репозитории</b>, две машины, fail-fast в двух состояниях",
    "Теперь ваша очередь. Добавляете в ci yml своего репозитория matrix, двадцать два и двадцать четыре, делаете push и смотрите на две job. Потом полный ответ с fail fast false, в конце возвращаете один Node. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>matrix и push</b> — <code>test (22)</code> красный, <code>test (24)</code> cancelled",
    "На первом шаге пишете strategy matrix и в setup node matrix node version, как на восьмом экране. На втором — push: в Actions две job, двадцать два должен быть красным, двадцать четыре — cancelled."
   ],
   "c": [
    "Шаги 3–4: <b><code>fail-fast: false</code></b> — 24 зелёный; потом убрать matrix, <code>node-version: 24</code>; подтверждение — состояние job 24",
    "На третьем шаге добавляете fail fast false и делаете push: двадцать четыре зелёный, двадцать два красный. На четвёртом убираете matrix и возвращаете node version двадцать четыре, run зелёный. В поле подтверждения напишите состояние job двадцать четыре на третьем шаге."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы пишете matrix и знаете, что такое cancelled."
   ]
  },
  "steps": [
   {
    "t": "matrix",
    "exp": "18 строк с экрана 8",
    "cmds": [
     null,
     "в setup-node: node-version: ${{ matrix.node-version }}"
    ]
   },
   {
    "t": "Push",
    "exp": "test (22) ✗ · test (24) cancelled"
   },
   {
    "t": "fail-fast: false",
    "exp": "test (22) ✗ · test (24) ✓",
    "cmds": [
     "под strategy: fail-fast: false",
     null
    ]
   },
   {
    "t": "Возврат",
    "exp": "run ✓ (одна job)",
    "cmds": [
     "уберите matrix, node-version: 24",
     null
    ]
   }
  ],
  "proof": {
   "label": "Состояние job test (24) на шаге 3",
   "placeholder": "например: success / зелёный",
   "wrong": "С fail-fast: false job 24 должна дойти до конца — напишите её состояние."
  },
  "trouble": [
   [
    "Одна job с именем test",
    "strategy не на одной глубине с runs-on или не используется matrix.node-version — yml с экрана 8"
   ],
   [
    "Обе зелёные",
    "у вас Node 22 и lock собран npm 10 — ловушки нет; ожидаемая разница появляется, только если lock собран npm 11 (CI/CD-1, экран 17)"
   ],
   [
    "Обе красные на npm ci",
    "lock не совпадает (CI/CD-1, экран 14) — npm install, lock в commit"
   ],
   [
    "Invalid workflow file",
    "сдвиг YAML — strategy: matrix: на два пробела правее, список [22, 24]"
   ]
  ]
 },
 "12": {
  "kicker": "Этап 4 · smoke и secret",
  "title": "Тесты Jest — без базы (mock). А smoke пишет в настоящий Postgres — в конвейере базы нет. Решение: временный контейнер рядом с job — services",
  "seg": {
   "a": [
    "В конвейере сейчас только <b>Jest — без базы</b>; а smoke с урока TgPg пишет в настоящую базу",
    "Четвёртый этап. В конвейере сейчас только тесты Jest: mock, базы нет, две секунды. Но на уроке Telegraf вы писали smoke: npm run smoke, настоящий код Nest и Telegraf, настоящий Postgres, перезапуск и race. Его нет в конвейере, потому что на runner нет базы."
   ],
   "b": [
    "<code>scripts/smoke.js</code>: <b>сам открывает базу <code>shop_smoke</code> по <code>DATABASE_URL</code></b>, в конце удаляет",
    "Откройте в OrderBotNest smoke js в папке scripts. Base url: из переменной окружения DATABASE URL. Из неё открывается временная база с именем shop smoke, через template zero, в конце удаляется. Значит, smoke нужна всего одна вещь: работающий Postgres и адрес к нему."
   ],
   "c": [
    "Решение: <b><code>services</code> — временный контейнер рядом с машиной job</b>, <code>postgres:18</code>, <code>localhost:5432</code>",
    "В GitHub это называется services: второй контейнер для job, здесь postgres восемнадцать. Он открывается вместе с job, стоит на машине на localhost пять тысяч четыреста тридцать два и выключается, как только job заканчивается. Никакой сервер, никакая внешняя база не нужны."
   ],
   "d": [
    "Итог: <b>unit-тесты без базы, smoke — с services</b>; в конвейере оба: быстро и полно",
    "Итог: unit-тесты без базы, быстрые. Smoke с базой, полный. Пусть в конвейере будут оба: сначала test, потом smoke, рядом с ним контейнер Postgres. На следующем экране напишем эту job и посмотрим на настоящий run."
   ]
  }
 },
 "13": {
  "kicker": "Этап 4 · smoke и secret",
  "title": "Вторая job smoke: needs: test, services: postgres:18 с healthcheck, npm run smoke — в run Initialize containers, потом NATIJA: 5/5 ✓",
  "seg": {
   "a": [
    "Вторая job: <b><code>smoke:</code> <code>needs: test</code></b> — если test красный, smoke не начнётся, Postgres не поднимется",
    "Добавляем в ci yml под jobs второе имя: smoke. Его первая строка — needs test: пусть сначала job test будет зелёной, потом smoke. Если test красный, smoke не начинается, Postgres тоже не поднимается, время не тратится зря."
   ],
   "b": [
    "<code>services: postgres</code>: <b>image, пароль, имя базы, порт и healthcheck</b> — ждёт, пока <code>pg_isready</code> не скажет «готов»",
    "Под services postgres: image postgres восемнадцать. Env: пароль и имя базы shop, из неё smoke открывает shop smoke. Ports: пять тысяч четыреста тридцать два. Options: healthcheck, pg is ready. Пока база не скажет «готов», шаги не начинаются, иначе smoke упал бы, не подключившись."
   ],
   "c": [
    "Шаги: checkout, setup-node, <code>npm ci</code>, <b><code>npm run smoke</code> — <code>env: DATABASE_URL</code> на контейнер</b>; в run «Initialize containers»",
    "Шаги знакомые: checkout, setup node, npm ci. Потом npm run smoke, в его env DATABASE URL: postgres, пароль postgres, localhost, shop. Push. В run две job: test зелёный, потом smoke: первый шаг initialize containers, Postgres поднят, двенадцать секунд."
   ],
   "d": [
    "Итог: в логе smoke <b><code>NATIJA: 5/5 ✓</code></b> — перезапуск и race в конвейере; <code>Stop containers</code> — база выключена",
    "Итог: лог шага npm run smoke: временная база shop smoke, перезапуск — три зелёных, race — два зелёных, итог пять из пяти. В конце stop containers: база выключена, следов не осталось. Теперь настоящая проверка бота — при каждом push. На следующем экране глубже посмотрим, откуда берётся DATABASE URL."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · внутри",
  "title": "Пароль контейнера — не секрет, он открыт в env:. Настоящая база или токен бота — в Secrets: в логе звёздочки (маска). Ошибка в имени secret не даёт ошибки — значение пустое, smoke «DATABASE_URL topilmadi»",
  "seg": {
   "a": [
    "Пароль контейнера — <b>открыт в <code>env:</code>, и это правильно</b>: он живёт только внутри job и умирает вместе с ней",
    "На тринадцатом экране мы написали DATABASE URL в yml открыто, пароль postgres. Это правильно: контейнер рождается и умирает внутри job, снаружи к нему никто не подключится. Это не секрет. Оба AI сделали так же, увидите позже."
   ],
   "b": [
    "Настоящая база, токен бота — <b>GitHub Secrets</b>: пишутся в Settings, в yml <code>${{ secrets.NOM }}</code>, в логе <code>***</code>",
    "Но адрес настоящей базы или токен бота в yml не пишутся: репозиторий открыт, история вечна. Их пишут на GitHub в разделе settings репозитория, secrets and variables, actions. В yml только имя: secrets DATABASE URL. В логе значение выходит звёздочками, маской."
   ],
   "c": [
    "Сломано: <b><code>secrets.DATABSE_URL</code> — пропала одна буква</b>; ошибки нет, значение пустое — smoke «DATABASE_URL topilmadi»",
    "Буква выпала: secrets DATABSE URL. Push. GitHub ошибку не даёт: такого secret нет, значит значение пустое. Шаг smoke красный: SMOKE ОШИБКА, DATABASE URL не найден, код выхода два. Посмотрите в лог: пароль в адресе-примере из сообщения — звёздочки, runner сам скрыл пароль URL."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченное в <code>ci.yml</code> имя secret",
    "Теперь ломаем. Ломаете вы сами: в сорок первой строке ci yml подсвечен secrets DATABASE URL, нажмите на него: из имени выпадет одна буква.",
    "Нажмите на <b><code>secrets.DATABASE_URL</code></b> в 41-й строке <b>ci.yml</b> — из имени выпадет одна буква."
   ],
   "d": [
    "Итог: <b>env — контейнер, secrets — внешнее</b>; видите «topilmadi» — проверьте имя secret в yml",
    "Итог: для контейнера — env, для внешнего ресурса — secrets. Если имя secret неверное, GitHub молчит, приходит пустое значение, и программа падает. Если в логе видите «не найден» или undefined, сначала сравните имя secret в yml с тем, что в Settings. Теперь найдёте эту строку сами."
   ]
  }
 },
 "15": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4 — какая строка с ошибкой?",
  "title": "С этим ci.yml job smoke красная: «DATABASE_URL topilmadi». Postgres поднялся, healthcheck прошёл. Найдите строку-виновника",
  "q": "Вы видели имя secret, теперь найдите сами. Третья проверка. С этим ci yml job smoke красная: DATABASE URL не найден. Postgres поднялся, healthcheck прошёл. Одна строка во фрагменте обращается к secret с неверным именем. Нажмите на эту строку.",
  "ok": "Верно. Secrets DATABSE URL: пропала буква E. GitHub такой secret не нашёл, но ошибку не дал, а дал пустое значение. Smoke запустился с пустым адресом и сам остановился: DATABASE URL не найден. На экране исправленная строка. Значит, ошибку, связанную с secret, сначала ищите в имени.",
  "okShort": "<code>DATABSE</code> — нет одной буквы; GitHub молчит, значение пустое, программа падает. Сравните имя с Settings.",
  "hint": "Прочитайте имя внутри ${{ secrets.… }} по буквам: DATABASE_URL полное?",
  "task": "Правило: в <code>${{ secrets.NOM }}</code> NOM должен совпадать с Settings буква в букву; нет такого имени — пустое значение, ошибки нет. В этом фрагменте одна строка обращается к неверному имени. <b>Нажмите на эту строку.</b>"
 },
 "16": {
  "kicker": "Этап 5 · PR и AI",
  "title": "Новая работа — в отдельной ветке; при открытии pull request конвейер снова запускается, и на странице PR стоит проверка; зелёный — merge; badge в README показывает состояние конвейера",
  "seg": {
   "a": [
    "Новая работа — <b>отдельная ветка <code>lenta-smoke</code></b>; push — run и в ветке (<code>on: push</code>)",
    "Job smoke добавляем в main не напрямую, а через pull request, так принято в команде. В терминале git checkout b lenta smoke, меняем ci yml, commit, git push u origin lenta smoke. В Actions run: on push относится к каждой ветке."
   ],
   "b": [
    "Pull request: <b><code>on: pull_request</code> — снова run</b>; на странице PR «checks»: <code>test</code> ✓, <code>smoke</code> ✓",
    "Открываем на GitHub pull request: из lenta smoke в main. Срабатывает on pull request из ci yml: ещё один run, на этот раз событие pull request. Внизу страницы PR checks: test зелёный, smoke зелёный. Кнопка merge открыта. Если бы был красный, он был бы виден здесь и в main не попал бы."
   ],
   "c": [
    "Merge — <b>в main merge commit, снова run</b>: обе job зелёные; теперь в main есть и smoke",
    "Нажимаем merge. В main появляется merge commit, on push, снова run: test и smoke зелёные. Теперь конвейер в main из двух job. И история понятна: видно, какой PR что добавил, — в этом отличие от прямого push в CI/CD-1."
   ],
   "d": [
    "Итог: <b>badge в README</b> — <code>actions/workflows/ci.yml/badge.svg</code>: кто открыл, видит конвейер",
    "Итог: ветка, pull request, checks, merge. И в первую строку README — badge: workflows ci yml badge svg. Любой, кто открыл репозиторий, сразу видит, зелёный конвейер или красный. В уроке ученика это называется табло. Теперь переходим к AI."
   ]
  }
 },
 "17": {
  "kicker": "Этап 5 · AI",
  "title": "Продолжение нового навыка: двум AI один промпт — «добавь и smoke, ему нужен PostgreSQL»; оба написали services: postgres и в конвейере зелёные с первой попытки",
  "seg": {
   "a": [
    "Снова этап AI: <b>промпт — «добавь и smoke, ему нужен PostgreSQL»</b>, слова services нет",
    "Как в CI/CD-1, последний этап — с AI. Промпт: в OrderBotNest есть npm run smoke, ему нужен PostgreSQL, DATABASE URL. Добавь в workflow и этот smoke. Services, контейнер, healthcheck, secret — этих слов в промпте нет. Каждый AI — в отдельной копии проекта, с существующим ci yml."
   ],
   "b": [
    "Оба написали <b><code>services: postgres:18</code>, healthcheck, <code>POSTGRES_DB: shop</code></b> — по версии из README",
    "Оба написали services postgres восемнадцать, по версии из README. Пароль, имя базы shop, порт и healthcheck pg is ready. Шаг smoke после build, в его env DATABASE URL. Первый дал env только шагу smoke, второй — всей job."
   ],
   "c": [
    "В конвейере: <b>оба зелёные с первой попытки</b> — <code>Initialize containers</code>, <code>NATIJA: 5/5 ✓</code>",
    "Оба мы отправили push в тестовую ветку. Оба зелёные: initialize containers, Postgres поднят, npm run smoke, итог пять из пяти. В отличие от CI/CD-1, на этот раз AI сделал правильно с первой попытки. Почему так, сейчас увидим."
   ],
   "d": [
    "Итог: AI <b>не использовал secret — и это верно</b> («контейнер — не секрет»); зелёный, но проверка ещё впереди",
    "Итог: оба AI не использовали secret, и первый написал причину: пароль контейнера только внутри job, это не секрет. Верная мысль. Оба зелёные. Но зелёный — ещё не приём: на следующем экране прочитаем по четырём вопросам."
   ]
  }
 },
 "18": {
  "kicker": "Этап 5 · внутри",
  "title": "Почему на этот раз зелёный: AI не писал файл с нуля, а изменил ваш ci.yml (node 24) — правильная опора, и AI тоже правильный; приём — четыре вопроса",
  "seg": {
   "a": [
    "Разница: в CI/CD-1 AI <b>писал с нуля</b> (node 22 → красный); на этот раз <b>изменил ваш файл</b> (24 → зелёный)",
    "В CI/CD-1 AI написал workflow с нуля и поставил node двадцать два — красный. На этот раз в репозитории был ваш ci yml, с node двадцать четыре. AI его изменил, а не писал с нуля. Если опора правильная, AI тоже продолжает правильно. Поэтому сначала пишите сами, потом давайте AI."
   ],
   "b": [
    "Две разницы: <b>где <code>env</code></b> — 1-й AI только в шаге smoke (уже, лучше), 2-й AI на всю job; smoke не отдельная job",
    "Сравните оба. Первый AI дал DATABASE URL только шагу smoke, второй — всей job: работают оба, но чем уже, тем лучше. Оба сделали smoke не отдельной job, а последним шагом: работает, но Postgres поднимается, даже если test красный. В рекомендации — отдельная job с needs test."
   ],
   "c": [
    "1-й AI сам заметил: <b>внутри smoke снова <code>nest build</code> — build дважды</b>; читайте пояснения AI",
    "Первый AI сам сказал ещё одну вещь: внутри smoke снова есть nest build, build идёт дважды, несколько лишних секунд. Решаете вы: оставить шаг npm run build или убрать. Читайте пояснения AI, часто самое полезное — именно там."
   ],
   "d": [
    "Итог: workflow smoke от AI — <b>четыре вопроса</b>: services + healthcheck · доходит ли <code>DATABASE_URL</code> · порядок · нужен ли secret",
    "Итог, четыре вопроса. Есть ли services и healthcheck. Доходит ли DATABASE URL до шага smoke, где env. Порядок: smoke после build? Нужен ли secret: для контейнера нет, для внешней базы да. Если на все четыре есть ответ — push и run. Теперь проверим."
   ]
  }
 },
 "19": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "AI написал services: postgres и оставил DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop в yml открыто. Это ошибка?",
  "q": "Вы видели workflow от AI, теперь проверим. Четвёртая проверка. AI написал services postgres и оставил DATABASE URL, с паролем postgres, открытым в yml. Это ошибка? Выберите вариант.",
  "ok": "Верно. Этот контейнер открывается вместе с job и выключается вместе с job, снаружи к нему никто не подключится, пароль ничего не открывает. Secret — для внешнего ресурса: настоящая база, токен бота. Значит, спрашивая, нужен ли secret, спросите: что это значение открывает за пределами job?",
  "okShort": "Контейнер — внутри job, выключается с job → хватит <code>env</code>. Внешний ресурс → Secrets.",
  "hint": "Экран 14: env — контейнер, secrets — внешнее. Есть ли этот контейнер вне job?",
  "demak": "вопрос о secret: что это значение открывает вне job? Контейнер — ничего → <code>env</code>. Боевая база, токен → Secrets.",
  "opts": [
   "Ошибка — любой пароль, даже временный, обязан быть в Secrets",
   "Ошибка — GitHub, увидев открытый пароль, остановит run",
   "Не ошибка — контейнер живёт внутри job, пароль наружу не выходит",
   "Не ошибка — адреса localhost никогда не бывают секретом"
  ],
  "wrong": {
   "0": "Secrets — для внешнего ресурса; пароль контейнера умирает вместе с job.",
   "1": "GitHub не проверяет текст в yml — run зелёный (40, 41).",
   "3": "localhost тоже может быть секретом (например, настоящая база на self-hosted runner) — дело не в адресе, а в том, что открывает значение."
  }
 },
 "20": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 25 минут",
  "title": "Поручите своему AI написать job smoke, проверьте по четырём вопросам, откройте PR в отдельной ветке, после зелёного сделайте merge, badge в README",
  "seg": {
   "a": [
    "Теперь вы: <b>job smoke от AI</b> — ветка, PR, merge, badge",
    "Теперь ваша очередь. Поручаете своему AI написать job smoke, промпт копируете кнопкой ниже. Делаете push в отдельную ветку и открываете pull request, после зелёной проверки merge, badge в README. Займёт двадцать пять минут."
   ],
   "b": [
    "Шаги 1–2: <b>ветка и промпт</b>, потом четыре вопроса: services + healthcheck · env · порядок · secret",
    "На первом шаге открываете новую ветку: git checkout b lenta smoke. На втором даёте промпт AI и читаете файл по четырём вопросам: есть ли services и healthcheck, доходит ли DATABASE URL до шага smoke, smoke после build, верно ли, что secret не нужен."
   ],
   "c": [
    "Шаги 3–4: <b>push, PR, checks зелёные, merge</b>, badge в README; подтверждение — адрес PR",
    "На третьем шаге push и pull request на GitHub: когда в checks test и smoke зелёные — merge. На четвёртом ставите badge в первую строку README и делаете push в main: значок passing. В поле подтверждения скопируйте адрес PR, по которому сделан merge."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики в вашем конвейере есть настоящая проверка бота, и она пришла через pull request."
   ]
  },
  "steps": [
   {
    "t": "Ветка",
    "exp": "новая ветка"
   },
   {
    "t": "Промпт + четыре вопроса",
    "exp": "4 ✓",
    "cmds": [
     "промпт выше — своему AI",
     null,
     "env: DATABASE_URL в шаге smoke",
     "smoke после build / needs: test",
     "secret нет (контейнер)"
    ]
   },
   {
    "t": "PR и merge",
    "exp": "PR merged · main run ✓ (2 job)"
   },
   {
    "t": "Badge",
    "exp": "в README «CI passing»",
    "cmds": [
     null,
     "1-я строка README: ![CI](https://github.com/<ваш-логин>/OrderBotNest/actions/workflows/ci.yml/badge.svg)",
     null
    ]
   }
  ],
  "proof": {
   "label": "Адрес PR, по которому сделан merge",
   "placeholder": "например: https://github.com/вы/OrderBotNest/pull/1",
   "wrong": "Вставьте адрес страницы PR: …/pull/<номер>."
  },
  "trouble": [
   [
    "smoke красный: DATABASE_URL topilmadi",
    "env: не дошёл до шага smoke (в другом шаге или нет в job) или неверное имя secret (экраны 14–15)"
   ],
   [
    "smoke красный: ECONNREFUSED 127.0.0.1:5432",
    "нет services, или нет ports: 5432:5432, или нет healthcheck (начал, пока база не готова)"
   ],
   [
    "smoke красный: database \"shop\" does not exist",
    "нет POSTGRES_DB: shop — smoke подключается к shop и открывает shop_smoke"
   ],
   [
    "В PR не видно checks",
    "в on: нет pull_request — on: [push, pull_request]"
   ],
   [
    "Badge «no status»",
    "в адресе неверное имя файла workflow — ровно ci.yml; или в main ещё нет run"
   ]
  ]
 },
 "21": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m4c-03 · «GitHub Actions — yo'l xaritasini yozish»",
  "title": "Урок ученика: маршрут, точка, действие, параллельные ленты, ближняя полка, сейф, табло — рисованные имена того, что вы сегодня видели в настоящем run",
  "seg": {
   "a": [
    "m4c-03 — 23 экрана: <b>маршрут, точка, действие</b>; matrix, сейф, табло — в симуляции",
    "Теперь подготовка к классу. Урок ученика m4c-03, двадцать три экрана. Маршрут — это ci yml, точка — job, действие — step. Параллельные ленты — matrix, сейф — secrets, табло — badge. Всё это нарисованная на экране симуляция: нажимается кнопка, лента идёт, всё зелёное."
   ],
   "b": [
    "Словарь: <b>слово ученика → термин</b>; в классе говорите оба вместе",
    "Посмотрите на словарь: слово ученика слева, термин справа. Журнал — это лог шага, ближняя полка — cache, сейф — secrets. В классе говорите слово вместе с термином: параллельные ленты, то есть matrix. Когда ученик потом откроет GitHub, слова будут знакомы."
   ],
   "c": [
    "Симуляция ↔ настоящее: <b>в уроке ученика всё зелёное</b>, в настоящем Actions 22 красный, cancelled, <code>***</code>",
    "Знайте разницу. В уроке ученика matrix зелёный на всех трёх лентах, сейф просто скрыт, в журнале причина одной строкой. В настоящем Actions двадцать два красный, двадцать четыре cancelled, при неверном имени secret молчит, причина внутри лога. Вы это сегодня видели, ученик — нет."
   ],
   "d": [
    "Итог: <b>симуляция даёт понятие, настоящий run — опыт</b>; в классе откройте один на экране",
    "Итог: симуляция даёт понятие, настоящий run — опыт. В классе откройте на проекторе один run из своего репозитория: job, шаг, лог, cache hit. Пусть ученик увидит, что маршрут и настоящий Actions — одно и то же. На следующем экране ловушки в классе."
   ]
  }
 },
 "22": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Образец «Нет репозитория?» из урока ученика: нет lock-файла — npm ci красный; \"test\": \"echo ok && exit 0\" — никогда не бывает красным; «сломайте тест» из домашнего задания здесь застревает",
  "seg": {
   "a": [
    "Образец: <b><code>npm install</code>, тест <code>echo ok</code>, lock нет</b> — с ним ученик пишет свой первый конвейер",
    "В уроке ученика для ученика без репозитория есть образец: в package json test — echo ok, lock-файла нет, конвейер — npm install и npm test. Он работает: npm install ставит, test говорит ok, зелёный. Но есть две ловушки."
   ],
   "b": [
    "Ловушка 1: если ученик нажмёт готовый шаблон GitHub — <b><code>npm ci</code>, lock нет — красный</b>",
    "Первая ловушка: если ученик нажмёт в Actions готовый шаблон Node от GitHub, тот пишет npm ci. Lock-файла нет, npm ci падает: can only install with an existing package lock json. Сообщение с тринадцатого экрана CI/CD-1, с другой причиной. Решение: npm install, или один раз npm install локально и lock в commit."
   ],
   "c": [
    "Ловушка 2: <b><code>echo ok &amp;&amp; exit 0</code> никогда не бывает красным</b> — «сломайте тест» из домашнего задания невозможно",
    "Вторая ловушка: test — echo ok и exit ноль, он никогда не бывает красным. В домашнем задании сказано нарочно сломать тест, а в образце его не сломать. Решение: пусть ученик делает это в своём Jest-проекте, или покажите скрипт с echo ошибка и exit один: красный, потом верните."
   ],
   "d": [
    "Итог: образец <b>хорош для начала, не для поломки</b>; <code>@v4</code> работает, предупреждение — не ошибка",
    "Итог: образец хорош для начала, не для поломки. И checkout v четыре из урока ученика работает и сейчас, в логе выходит предупреждение Node двадцать deprecated, это не ошибка. На последнем экране — что вы добавляете и вопросы учеников."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Четыре вещи, которые вы добавляете к уроку, три ситуации и готовые ответы на вопросы учеников",
  "seg": {
   "a": [
    "Вы добавляете: <b>настоящий run на проекторе, настоящий результат matrix, имя secret, ловушки образца</b>",
    "Четыре вещи, которые вы добавляете к уроку. На экране «найти причину в журнале» откройте на проекторе настоящий run. На параллельных лентах скажите: на самом деле одна версия может быть красной. На сейфе: при неверном имени молчит. В домашнем задании заранее скажите о ловушках образца."
   ],
   "b": [
    "Три ситуации: <b>нет lock, cancelled, «сломал, а всё зелёное»</b> — сообщение и решение",
    "Три ситуации. Npm ci красный, нет lock: npm install или lock в commit. В matrix cancelled: ошибка в другой job, fail fast. Сломал тест, а всё равно зелёный: echo ok не ломается, exit один или Jest-проект. Сообщение каждой — на карточке."
   ],
   "c": [
    "Если ученик спросит: <b>где журнал, обязательно ли matrix зелёный, можно ли увидеть сейф, badge красный</b>",
    "Готовые ответы на вопросы учеников внизу, нажмите, чтобы открыть: где журнал, обязательно ли в matrix всё зелёное, можно ли увидеть ключ в сейфе, что если badge красный. На каждый — ответ одним предложением."
   ],
   "d": [
    "Итог: если ученик говорит «конвейер красный» — <b>job → шаг → лог</b>; с этим вы готовы к классу",
    "Итог: если ученик говорит, что конвейер красный, вместе с ним три шага: какая job, какой шаг, его лог. С этим вы готовы к классу. Теперь проверьте себя."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "В ci.yml под jobs: есть test: и smoke:. Сколько машин откроется в run?",
    "e": "Каждая job — своя машина; needs задаёт порядок.",
    "o": [
     "Одна — job по очереди на одной машине",
     "Две — каждая job на отдельной машине",
     "Сколько шагов, столько и машин",
     "Три — GitHub берёт отдельную машину для Set up job"
    ]
   },
   {
    "q": "В логе Run actions/checkout@v4 есть git fetch … --depth=1. Что это?",
    "e": "Runner не нужна вся история.",
    "o": [
     "Скачивает всю историю — сжатую для скорости",
     "Скачивается только последний commit — без истории, быстро",
     "Скачивает только изменённые файлы",
     "Останавливает, если не уложилось в минуту"
    ]
   },
   {
    "q": "Run красный, аннотация: Process completed with exit code 1. — в npm test. Где полная причина?",
    "e": "Аннотация — адрес, причина — лог.",
    "o": [
     "В самой аннотации — больше нигде нет",
     "В логе Set up job — ошибки собираются туда",
     "В логе шага npm test — FAIL и имя теста",
     "На странице commit — GitHub пишет ошибку туда"
    ]
   },
   {
    "q": "Во втором run в логе setup-node Cache hit for: node-cache-…. Что делает npm ci?",
    "e": "Cache — скорость, а не правильность.",
    "o": [
     "Не ставит пакеты — просто использует cache",
     "Ставит из сохранённых загрузок — быстрее, результат тот же",
     "Заменяет lock-файл старой копией из cache",
     "Скачивает только изменённые пакеты"
    ]
   },
   {
    "q": "matrix [22, 24], fail-fast не написан; 22 упал. 24?",
    "e": "По умолчанию fail-fast: true.",
    "o": [
     "Дойдёт до конца — результат виден отдельно",
     "Будет отменён — «cancelled», результат неизвестен",
     "Начнётся заново — вместо 22",
     "Дойдёт до конца, но run всё равно отмечен зелёным"
    ]
   },
   {
    "q": "Smoke нужен Postgres. Откуда база в конвейере?",
    "e": "Контейнер рождается и умирает вместе с job.",
    "o": [
     "На runner установлен Postgres — ничего писать не нужно",
     "Подключается к базе на сервере ментора — адрес в Secrets",
     "services: postgres — временный контейнер рядом с job",
     "Smoke переходит в режим без базы — результат зелёный"
    ]
   },
   {
    "q": "В yml ${{ secrets.DATABSE_URL }} (пропала буква). Run?",
    "e": "«DATABASE_URL topilmadi» — код 2.",
    "o": [
     "Ошибка файла — run не откроется",
     "Аннотация: «secret not found» — шаг сразу красный, лог пустой",
     "Приходит пустое значение — программа падает сама, GitHub молчит",
     "Run зелёный — smoke проходит с пустым значением"
    ]
   },
   {
    "q": "Открыт PR, в checks smoke красный. Что будет?",
    "e": "Checks показывают; запрет — через branch protection.",
    "o": [
     "Кнопка merge совсем пропадёт — GitHub запрещает merge с красным check",
     "PR сам закроется — придётся открыть заново",
     "Виден красный — не делать merge решаете вы (защита не настроена)",
     "Конвейер в main тоже станет красным"
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
  const segRu = (n) => { const r = RU_MDT[n] && RU_MDT[n].seg; if (!r) return undefined; const o = {}; Object.keys(r).forEach((id) => { const [key, text, act] = r[id]; o[id] = { ...(key != null ? { key } : {}), ...(text != null ? { text, show: wrRu(text) } : {}), ...(act != null ? { act } : {}) }; }); return o; };
  const head = (n) => { const r = RU_MDT[n] || {}; const o = {}; ['kicker', 'eyebrow', 'title'].forEach((k) => { if (r[k] != null) o[k] = r[k]; }); const s = segRu(n); if (s) o.segments = s; return o; };
  const mdt = {}; Object.keys(RU_MDT).forEach((n) => { const r = { ...RU_MDT[n] }; if (r.seg) r.seg = MDT[n].seg.map(([id]) => (r.seg[id] ? [null, r.seg[id][0], r.seg[id][1], r.seg[id][2]] : null)); mdt[n] = r; });
  ru(MDT, mdt);
  ru(S1, { ...head(1), ...((typeof RU_S !== 'undefined' && RU_S.S1) || {}) });
  ru(S2, { ...head(2), ...((typeof RU_S !== 'undefined' && RU_S.S2) || {}) });
  ru(S3, { ...head(3), ...((typeof RU_S !== 'undefined' && RU_S.S3) || {}) });
  ru(S4, { ...head(4), ...((typeof RU_S !== 'undefined' && RU_S.S4) || {}) });
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S8, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.S8) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S12, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.S12) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S16, { ...head(16), ...((typeof RU_S !== 'undefined' && RU_S.S16) || {}) });
  ru(S17, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.S17) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P7.S, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.P7_S) || {}) });
  ru(P7.steps, RU_MDT[7].steps);
  ru(P7.trouble, RU_MDT[7].trouble);
  ru(P7.proof, RU_MDT[7].proof);
  ru(P11.S, { ...head(11), ...((typeof RU_S !== 'undefined' && RU_S.P11_S) || {}) });
  ru(P11.steps, RU_MDT[11].steps);
  ru(P11.trouble, RU_MDT[11].trouble);
  ru(P11.proof, RU_MDT[11].proof);
  ru(P20.S, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.P20_S) || {}) });
  ru(P20.steps, RU_MDT[20].steps);
  ru(P20.trouble, RU_MDT[20].trouble);
  ru(P20.proof, RU_MDT[20].proof);
  ru(FINAL, RU_MDT[24].final);
})();
