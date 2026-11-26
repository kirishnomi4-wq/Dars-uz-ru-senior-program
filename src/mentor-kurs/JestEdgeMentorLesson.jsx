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
    <span style={{ marginLeft: 'auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', font: `500 10px/15px ${MONO}`, color: T.ink2, paddingRight: badge[d[0]] != null ? 18 : 0 }}>{note[d[0]] || d[4]}</span>{badgeEl(d[0])}
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

// AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-kod.py — OrderBotNest teglari va haqiqiy test fayllaridan aynan (qo'lda tahrirlanmaydi)
const KOD_TS_PHONE = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-start",
 "lines": [
  {
   "t": "const PHONE = /^\\+?\\d{9,13}$/;",
   "n": 12
  }
 ]
};
const KOD_TS_ONTEXT = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-start",
 "lines": [
  {
   "t": "  // Matn keldi: telefon kutilayotgan bo'lsa — saqlab buyurtma beramiz",
   "n": 152
  },
  {
   "t": "  private async onText(ctx: Context & { message: { text: string } }) {",
   "n": 153
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 154
  },
  {
   "t": "    if (user.state === 'WAITING_PHONE') {",
   "n": 155
  },
  {
   "t": "      const phone = ctx.message.text.trim();",
   "n": 156
  },
  {
   "t": "      if (!PHONE.test(phone)) return ctx.reply(texts.badPhone);",
   "n": 157
  },
  {
   "t": "      await this.users.setPhone(user, phone);",
   "n": 158
  },
  {
   "t": "      return this.placeOrder(ctx, user);",
   "n": 159
  },
  {
   "t": "    }",
   "n": 160
  }
 ]
};
const KOD_TS_IMPORT_NEW = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "import { cartKeyboard, catalogKeyboard, orderKeyboard } from './keyboards';",
   "n": 9
  },
  {
   "t": "import { isPhone } from './phone';",
   "n": 10
  },
  {
   "t": "import { texts } from './texts';",
   "n": 11
  }
 ]
};
const KOD_TS_ONTEXT_NEW = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "  private async onText(ctx: Context & { message: { text: string } }) {",
   "n": 152
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 153
  },
  {
   "t": "    if (user.state === 'WAITING_PHONE') {",
   "n": 154
  },
  {
   "t": "      const phone = ctx.message.text.replace(/[\\s-]/g, '');",
   "n": 155
  },
  {
   "t": "      if (!isPhone(phone)) return ctx.reply(texts.badPhone);",
   "n": 156
  },
  {
   "t": "      await this.users.setPhone(user, phone);",
   "n": 157
  },
  {
   "t": "      return this.placeOrder(ctx, user);",
   "n": 158
  },
  {
   "t": "    }",
   "n": 159
  }
 ]
};
const KOD_PHONE_OLD = {
 "file": "src/api/telegram/phone.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam",
   "n": 1
  },
  {
   "t": "export const PHONE = /^\\+?\\d{9,13}$/;",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "export const isPhone = (text: string) => PHONE.test(text.trim());",
   "n": 4
  }
 ]
};
const KOD_PHONE_NEW = {
 "file": "src/api/telegram/phone.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam. Mijoz probel yoki chiziqcha bilan yozishi mumkin",
   "n": 1
  },
  {
   "t": "export const PHONE = /^\\+?\\d{9,13}$/;",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "export const isPhone = (text: string) => PHONE.test(text.replace(/[\\s-]/g, ''));",
   "n": 4
  }
 ]
};
const KOD_SPEC_PHONE_02 = {
 "file": "src/api/telegram/phone.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { isPhone } from './phone';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('isPhone', () => {",
   "n": 3
  },
  {
   "t": "  it.each(['+998901234567', '998901234567'])(\"%s — to'g'ri raqam\", (s) => {",
   "n": 4
  },
  {
   "t": "    expect(isPhone(s)).toBe(true);",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "  it.each([",
   "n": 8
  },
  {
   "t": "    ['12345678', '8 ta raqam — qisqa'],",
   "n": 9
  },
  {
   "t": "    ['+99890123456789', '14 ta raqam — uzun'],",
   "n": 10
  },
  {
   "t": "    ['abc', 'harf'],",
   "n": 11
  },
  {
   "t": "    ['', \"bo'sh\"],",
   "n": 12
  },
  {
   "t": "  ])('%s — %s', (s) => {",
   "n": 13
  },
  {
   "t": "    expect(isPhone(s)).toBe(false);",
   "n": 14
  },
  {
   "t": "  });",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "  it('mijoz probel bilan yozadi', () => {",
   "n": 17
  },
  {
   "t": "    expect(isPhone('+998 90 123 45 67')).toBe(true);",
   "n": 18
  },
  {
   "t": "  });",
   "n": 19
  },
  {
   "t": "});",
   "n": 20
  }
 ]
};
const KOD_SPEC_PHONE_04 = {
 "file": "src/api/telegram/phone.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { isPhone } from './phone';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('isPhone', () => {",
   "n": 3
  },
  {
   "t": "  it.each(['+998901234567', '998901234567'])(\"%s — to'g'ri raqam\", (s) => {",
   "n": 4
  },
  {
   "t": "    expect(isPhone(s)).toBe(true);",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "  it.each([",
   "n": 8
  },
  {
   "t": "    ['12345678', '8 ta raqam — qisqa'],",
   "n": 9
  },
  {
   "t": "    ['+99890123456789', '14 ta raqam — uzun'],",
   "n": 10
  },
  {
   "t": "    ['abc', 'harf'],",
   "n": 11
  },
  {
   "t": "    ['', \"bo'sh\"],",
   "n": 12
  },
  {
   "t": "  ])('%s — %s', (s) => {",
   "n": 13
  },
  {
   "t": "    expect(isPhone(s)).toBe(false);",
   "n": 14
  },
  {
   "t": "  });",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "  it('mijoz probel bilan yozadi', () => {",
   "n": 17
  },
  {
   "t": "    expect(isPhone('+998 90 123 45 67')).toBe(true);",
   "n": 18
  },
  {
   "t": "  });",
   "n": 19
  },
  {
   "t": "});",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "describe(\"isPhone — qoida nimani o'tkazib yuboradi\", () => {",
   "n": 22
  },
  {
   "t": "  it(\"9 ta nol ham o'tadi\", () => {",
   "n": 23
  },
  {
   "t": "    expect(isPhone('000000000')).toBe(true);",
   "n": 24
  },
  {
   "t": "  });",
   "n": 25
  },
  {
   "t": "});",
   "n": 26
  }
 ]
};
const KOD_ORDER_PLACE = {
 "file": "src/api/order/order.service.ts",
 "tag": "jest2-start",
 "lines": [
  {
   "t": "  place(user: User, cart: CartItem[]): Promise<Order> {",
   "n": 24
  },
  {
   "t": "    if (!user.phone) throw new Error(\"Telefon raqami yo'q\");",
   "n": 25
  },
  {
   "t": "    if (cart.length === 0) throw new Error(\"Savat bo'sh\");",
   "n": 26
  },
  {
   "t": "    return this.ds.transaction(async (m) => {",
   "n": 27
  },
  {
   "t": "      const items: OrderItem[] = [];",
   "n": 28
  },
  {
   "t": "      for (const c of cart) {",
   "n": 29
  },
  {
   "t": "        // 1) Qatorni qulflab o'qiymiz (SELECT ... FOR UPDATE): ikkinchi mijoz shu qatorni biz tugatguncha kutadi",
   "n": 30
  },
  {
   "t": "        const p = await m.findOne(Product, {",
   "n": 31
  },
  {
   "t": "          where: { id: c.product.id },",
   "n": 32
  },
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
  },
  {
   "t": "        //    («current transaction is aborted») — faqat ROLLBACK qoladi.",
   "n": 41
  },
  {
   "t": "        await m.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [",
   "n": 42
  },
  {
   "t": "          c.qty,",
   "n": 43
  },
  {
   "t": "          p.id,",
   "n": 44
  },
  {
   "t": "        ]);",
   "n": 45
  }
 ]
};
const KOD_ORDER_SETSTATUS = {
 "file": "src/api/order/order.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "",
   "n": 66
  },
  {
   "t": "  // Status o'zgaradi; bekor qilinsa mahsulotlar omborga qaytadi — yana tranzaksiya",
   "n": 67
  },
  {
   "t": "  setStatus(id: number, status: OrderStatus): Promise<Order> {",
   "n": 68
  },
  {
   "t": "    return this.ds.transaction(async (m) => {",
   "n": 69
  },
  {
   "t": "      // Buyurtma qatorini qulflaymiz: «Bekor» ikki marta bir vaqtda bosilsa,",
   "n": 70
  },
  {
   "t": "      // ikkinchisi birinchisi tugashini kutadi va CANCELLED ni ko'radi — ombor bir marta qaytadi",
   "n": 71
  },
  {
   "t": "      await m.query('SELECT id FROM orders WHERE id = $1 FOR UPDATE', [id]);",
   "n": 72
  },
  {
   "t": "      const order = await m.findOneBy(Order, { id });",
   "n": 73
  },
  {
   "t": "      if (!order) throw new Error(`Buyurtma topilmadi: #${id}`);",
   "n": 74
  },
  {
   "t": "      if (order.status === 'CANCELLED') {",
   "n": 75
  },
  {
   "t": "        throw new Error(`#${id} allaqachon bekor qilingan`);",
   "n": 76
  },
  {
   "t": "      }",
   "n": 77
  },
  {
   "t": "      if (status === 'CANCELLED') {",
   "n": 78
  },
  {
   "t": "        for (const i of order.items) {",
   "n": 79
  },
  {
   "t": "          await m.increment(Product, { id: i.product.id }, 'stock', i.qty);",
   "n": 80
  },
  {
   "t": "        }",
   "n": 81
  },
  {
   "t": "      }",
   "n": 82
  },
  {
   "t": "      order.status = status;",
   "n": 83
  },
  {
   "t": "      return m.save(order);",
   "n": 84
  },
  {
   "t": "    });",
   "n": 85
  },
  {
   "t": "  }",
   "n": 86
  },
  {
   "t": "}",
   "n": 87
  }
 ]
};
const KOD_SPEC_ORDER_05 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_06 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", async () => {",
   "n": 34
  },
  {
   "t": "    await expect(",
   "n": 35
  },
  {
   "t": "      service.place({ id: 1, phone: null } as User, cart),",
   "n": 36
  },
  {
   "t": "    ).rejects.toThrow(\"Telefon raqami yo'q\");",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_07 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    expect(() => service.place(user, cart)).toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_08 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Planshet: omborda faqat 9 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "  });",
   "n": 54
  },
  {
   "t": "",
   "n": 55
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 56
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 57
  },
  {
   "t": "      id: 4,",
   "n": 58
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 59
  },
  {
   "t": "      stock: 10,",
   "n": 60
  },
  {
   "t": "      price: 50000,",
   "n": 61
  },
  {
   "t": "    });",
   "n": 62
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 63
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 64
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 65
  },
  {
   "t": "  });",
   "n": 66
  },
  {
   "t": "});",
   "n": 67
  }
 ]
};
const KOD_SPEC_ORDER_08B = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Planshet: omborda faqat 9 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_10 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "",
   "n": 68
  },
  {
   "t": "  it(\"chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi\", async () => {",
   "n": 69
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 70
  },
  {
   "t": "      id: 4,",
   "n": 71
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 72
  },
  {
   "t": "      stock: 2,",
   "n": 73
  },
  {
   "t": "      price: 50000,",
   "n": 74
  },
  {
   "t": "    });",
   "n": 75
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 76
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 77
  },
  {
   "t": "  });",
   "n": 78
  },
  {
   "t": "});",
   "n": 79
  }
 ]
};
const KOD_APP_CTRL = {
 "file": "src/api/app.controller.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "import { Controller, Get } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "@Controller()",
   "n": 3
  },
  {
   "t": "export class AppController {",
   "n": 4
  },
  {
   "t": "  // Hosting \"tirikmi?\" deb shu manzilni tekshiradi",
   "n": 5
  },
  {
   "t": "  @Get()",
   "n": 6
  },
  {
   "t": "  health() {",
   "n": 7
  },
  {
   "t": "    return { ok: true, service: 'order-bot' };",
   "n": 8
  },
  {
   "t": "  }",
   "n": 9
  },
  {
   "t": "}",
   "n": 10
  }
 ]
};
const KOD_SPEC_APP = {
 "file": "src/api/app.controller.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { INestApplication } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 2
  },
  {
   "t": "import request from 'supertest';",
   "n": 3
  },
  {
   "t": "import { AppController } from './app.controller';",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "let app: INestApplication;",
   "n": 6
  },
  {
   "t": "beforeAll(async () => {",
   "n": 7
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 8
  },
  {
   "t": "    controllers: [AppController],",
   "n": 9
  },
  {
   "t": "  }).compile();",
   "n": 10
  },
  {
   "t": "  app = mod.createNestApplication();",
   "n": 11
  },
  {
   "t": "  await app.init();",
   "n": 12
  },
  {
   "t": "});",
   "n": 13
  },
  {
   "t": "afterAll(() => app.close());",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "describe('HTTP: GET /', () => {",
   "n": 16
  },
  {
   "t": "  it('200 va { ok: true }', async () => {",
   "n": 17
  },
  {
   "t": "    const res = await request(app.getHttpServer()).get('/');",
   "n": 18
  },
  {
   "t": "    expect(res.status).toBe(200);",
   "n": 19
  },
  {
   "t": "    expect(res.body).toEqual({ ok: true, service: 'order-bot' });",
   "n": 20
  },
  {
   "t": "  });",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "  it(\"yo'q manzil — 404\", async () => {",
   "n": 23
  },
  {
   "t": "    const res = await request(app.getHttpServer()).get('/nope');",
   "n": 24
  },
  {
   "t": "    expect(res.status).toBe(404);",
   "n": 25
  },
  {
   "t": "    expect(res.body.message).toBe('Cannot GET /nope');",
   "n": 26
  },
  {
   "t": "  });",
   "n": 27
  },
  {
   "t": "});",
   "n": 28
  }
 ]
};
const KOD_AI1_ORDER = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "    const { service, ds } = setup([product(1, 5)]);",
   "n": 44
  },
  {
   "t": "    await expect(",
   "n": 45
  },
  {
   "t": "      run(service, user(phone), [line(product(1, 5), 1)]),",
   "n": 46
  },
  {
   "t": "    ).rejects.toThrow(\"Telefon raqami yo'q\");",
   "n": 47
  },
  {
   "t": "    expect(ds.transaction).not.toHaveBeenCalled();",
   "n": 48
  }
 ]
};
const KOD_AI1_TEL = {
 "file": "src/api/telegram/telegram.service.phone.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "    ['faqat probel', '   '],",
   "n": 84
  },
  {
   "t": "    ['8 raqam (bittasi kam)', '12345678'],",
   "n": 85
  },
  {
   "t": "    ['14 raqam (bittasi ortiq)', '+12345678901234'],",
   "n": 86
  },
  {
   "t": "    ['faqat +', '+'],",
   "n": 87
  },
  {
   "t": "    ['ikkita +', '++998901234567'],",
   "n": 88
  },
  {
   "t": "    ['+ oxirida', '998901234567+'],",
   "n": 89
  },
  {
   "t": "    [\"o'rtada probel\", '+998 90 123 45 67'],",
   "n": 90
  },
  {
   "t": "    ['chiziqcha', '+998-90-123-45-67'],",
   "n": 91
  },
  {
   "t": "    ['qavs', '+998(90)1234567'],",
   "n": 92
  },
  {
   "t": "    ['harf', '+99890123456a'],",
   "n": 93
  },
  {
   "t": "    ['matn', \"raqamim yo'q\"],",
   "n": 94
  },
  {
   "t": "    [\"o'rtada qator ko'chishi\", '+998901\\n234567'],",
   "n": 95
  },
  {
   "t": "    ['arabcha raqamlar', '٩٩٨٩٠١٢٣٤٥٦٧'],",
   "n": 96
  }
 ]
};
const KOD_AI2_ORDER = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "    const p = product(1, 'Non', 5000, 10);",
   "n": 33
  },
  {
   "t": "    const { service, ds } = setup({ 1: p });",
   "n": 34
  },
  {
   "t": "    expect(() => service.place(user({ phone: null }), [cartItem(p, 1)])).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "    expect(ds.transaction).not.toHaveBeenCalled();",
   "n": 38
  }
 ]
};
const KOD_AI2_TEL = {
 "file": "src/api/telegram/telegram.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "  const cart = { list: jest.fn(async () => [{ product: { price: 1, id: 1 }, qty: 1 }]) };",
   "n": 18
  },
  {
   "t": "  const order = { id: 5 } as Order;",
   "n": 19
  },
  {
   "t": "  const orders = { place: jest.fn(async () => order) };",
   "n": 20
  },
  {
   "t": "  const service = new TelegramService(users as never, {} as never, cart as never, orders as never);",
   "n": 21
  },
  {
   "t": "  const bot = { telegram: { sendMessage: jest.fn(async () => ({})) } };",
   "n": 22
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\nHEAD 9d6b947 jest1-done: birinchi unit-testlar — som (bo'l\njest 30.5.2\nts-jest 29.4.15\n@nestjs/testing 11.2.8\ntypescript 5.9.3";
const KOD_OUT_01 = "# telegram.service.ts ichida:\n12:const PHONE = /^\\+?\\d{9,13}$/;\n104:        await this.users.setState(user, 'WAITING_PHONE');\n155:    if (user.state === 'WAITING_PHONE') {\n157:      if (!PHONE.test(phone)) return ctx.reply(texts.badPhone);";
const KOD_OUT_02 = "$ npx jest phone --verbose\nFAIL src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam (2 ms)\n    ✓ 998901234567 — to'g'ri raqam\n    ✓ 12345678 — 8 ta raqam — qisqa\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf\n    ✓  — bo'sh\n    ✕ mijoz probel bilan yozadi (2 ms)\n\n  ● isPhone › mijoz probel bilan yozadi\n\n    expect(received).toBe(expected) // Object.is equality\n\n    Expected: true\n    Received: false\n\n      16 |\n      17 |   it('mijoz probel bilan yozadi', () => {\n    > 18 |     expect(isPhone('+998 90 123 45 67')).toBe(true);\n         |                                          ^\n      19 |   });\n      20 | });\n      21 |\n\n      at Object.<anonymous> (api/telegram/phone.spec.ts:18:42)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 6 passed, 7 total\nSnapshots:   0 total\nTime:        0.408 s, estimated 1 s\nRan all test suites matching phone.\n[chiqish kodi: 1]";
const KOD_OUT_03 = "$ npx jest phone --verbose\nPASS src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam (2 ms)\n    ✓ 998901234567 — to'g'ri raqam (1 ms)\n    ✓ 12345678 — 8 ta raqam — qisqa\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf\n    ✓  — bo'sh (1 ms)\n    ✓ mijoz probel bilan yozadi\n\nTest Suites: 1 passed, 1 total\nTests:       7 passed, 7 total\nSnapshots:   0 total\nTime:        0.385 s, estimated 1 s\nRan all test suites matching phone.\n[chiqish kodi: 0]";
const KOD_OUT_04 = "$ npx jest phone --verbose\nPASS src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam (2 ms)\n    ✓ 998901234567 — to'g'ri raqam (1 ms)\n    ✓ 12345678 — 8 ta raqam — qisqa (1 ms)\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf (1 ms)\n    ✓  — bo'sh\n    ✓ mijoz probel bilan yozadi (1 ms)\n  isPhone — qoida nimani o'tkazib yuboradi\n    ✓ 9 ta nol ham o'tadi\n\nTest Suites: 1 passed, 1 total\nTests:       8 passed, 8 total\nSnapshots:   0 total\nTime:        0.389 s, estimated 1 s\nRan all test suites matching phone.\n[chiqish kodi: 0]";
const KOD_OUT_05 = "$ npx jest order.service --verbose\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (19 ms)\n    ✓ savat bo'sh — darhol xato (3 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (3 ms)\n    ✓ yetarli — jami narx hisoblanadi (3 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total\nSnapshots:   0 total\nTime:        0.791 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 0]";
const KOD_OUT_06 = "$ npx jest order.service -t telefon\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ telefon yo'q — darhol xato (11 ms)\n    ○ skipped savat bo'sh — darhol xato\n    ○ skipped omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n    ○ skipped yetarli — jami narx hisoblanadi\n\n  ● OrderService.place › telefon yo'q — darhol xato\n\n    Telefon raqami yo'q\n\n      23 |   // CHECK (stock >= 0) rad etadi — ikki mijoz bir vaqtda bossa ham ortiqcha sotilmaydi.\n      24 |   place(user: User, cart: CartItem[]): Promise<Order> {\n    > 25 |     if (!user.phone) throw new Error(\"Telefon raqami yo'q\");\n         |                            ^\n      26 |     if (cart.length === 0) throw new Error(\"Savat bo'sh\");\n      27 |     return this.ds.transaction(async (m) => {\n      28 |       const items: OrderItem[] = [];\n\n      at OrderService.place (api/order/order.service.ts:25:28)\n      at Object.<anonymous> (api/order/order.service.spec.ts:36:15)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 skipped, 4 total\nSnapshots:   0 total\nTime:        0.812 s, estimated 1 s\nRan all test suites matching order.service with tests matching \"telefon\".\n[chiqish kodi: 1]";
const KOD_OUT_07 = "$ npx jest order.service -t omborda\n…/OrderBotNest/src/api/order/order.service.ts:48\n                    throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n                          ^\n\nError: Kolonka: omborda faqat 1 ta qoldi\n    at …/OrderBotNest/src/api/order/order.service.ts:37:17\n    at processTicksAndRejections (node:internal/process/task_queues:104:5)\n\nNode.js v24.18.0\n[chiqish kodi: 1]";
const KOD_OUT_08 = "$ npx jest order.service -t omborda\n…/OrderBotNest/node_modules/expect/build/index.js:2155\n  const innerErr = new JestAssertionError();\n                   ^\n\nJestAssertionError: expect(received).rejects.toThrow(expected)\n\nExpected substring: \"Planshet: omborda faqat 9 ta qoldi\"\nReceived message:   \"Kolonka: omborda faqat 1 ta qoldi\"\n\n      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n      36 |         if (p.stock < c.qty) {\n    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n         |                 ^\n      38 |         }\n      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\n\n      at src/api/order/order.service.ts:37:17\n    at Object.toThrow (…/OrderBotNest/node_modules/expect/build/index.js:2155:20)\n    at Object.<anonymous> (…/OrderBotNest/src/api/order/order.service.spec.ts:51:47)\n    at Promise.finally.completed (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1834:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1774:10)\n    at _callCircusTest (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1167:40)\n    at processTicksAndRejections (node:internal/process/task_queues:104:5)\n    at _runTestInContext (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1103:3)\n    at runTestWithContext (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:996:5)\n    at _runTestsForDescribeBlockOnce (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1008:11)\n    at _runTestsForDescribeBlock (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:824:5)\n    at _runTestsForDescribeBlockOnce (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1003:11)\n    at _runTestsForDescribeBlock (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:824:5)\n    at run (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:789:3)\n    at runAndTransformResultsToJestFormat (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:2300:21)\n    at jestAdapter (…/OrderBotNest/node_modules/jest-circus/build/runner.js:111:19)\n    at runTestInternal (…/OrderBotNest/node_modules/jest-runner/build/index.js:247:16)\n    at runTest (…/OrderBotNest/node_modules/jest-runner/build/index.js:315:7) {\n  matcherResult: {\n    message: 'expect(received).rejects.toThrow(expected)\\n' +\n      '\\n' +\n      'Expected substring: \"Planshet: omborda faqat 9 ta qoldi\"\\n' +\n      'Received message:   \"Kolonka: omborda faqat 1 ta qoldi\"\\n' +\n      '\\n' +\n      '      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\\n' +\n      '      36 |         if (p.stock < c.qty) {\\n' +\n      '    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\\n' +\n      '         |                 ^\\n' +\n      '      38 |         }\\n' +\n      \"      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\\n\" +\n      \"      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\\n\" +\n      '\\n' +\n      '      at src/api/order/order.service.ts:37:17',\n    pass: false\n  }\n}\n\nNode.js v24.18.0\n[chiqish kodi: 1]";
const KOD_OUT_08B = "$ npx jest order.service -t omborda\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (28 ms)\n    ○ skipped telefon yo'q — darhol xato\n    ○ skipped savat bo'sh — darhol xato\n    ○ skipped yetarli — jami narx hisoblanadi\n\n  ● OrderService.place › omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n\n    expect(received).rejects.toThrow(expected)\n\n    Expected substring: \"Planshet: omborda faqat 9 ta qoldi\"\n    Received message:   \"Kolonka: omborda faqat 1 ta qoldi\"\n\n          35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n          36 |         if (p.stock < c.qty) {\n        > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n             |                 ^\n          38 |         }\n          39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n          40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\n\n      at api/order/order.service.ts:37:17\n      at Object.<anonymous> (api/order/order.service.spec.ts:51:5)\n      at Object.<anonymous> (api/order/order.service.spec.ts:51:53)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 skipped, 4 total\nSnapshots:   0 total\nTime:        0.733 s, estimated 1 s\nRan all test suites matching order.service with tests matching \"omborda\".\n[chiqish kodi: 1]";
const KOD_OUT_09 = "36:        if (p.stock <= c.qty) {\n\n$ npx jest order.service\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (25 ms)\n    ✓ savat bo'sh — darhol xato (3 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (3 ms)\n    ✓ yetarli — jami narx hisoblanadi (2 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total\nSnapshots:   0 total\nTime:        0.791 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 0]";
const KOD_OUT_09B = "$ npx jest order.service --verbose\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (19 ms)\n    ✓ savat bo'sh — darhol xato (2 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✓ yetarli — jami narx hisoblanadi (3 ms)\n    ✓ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi (2 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       5 passed, 5 total\nSnapshots:   0 total\nTime:        0.796 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 0]";
const KOD_OUT_09C = "36:        if (p.stock <= c.qty) {\n\n$ npx jest order.service\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (20 ms)\n    ✓ savat bo'sh — darhol xato (2 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✓ yetarli — jami narx hisoblanadi (2 ms)\n    ✕ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi (2 ms)\n\n  ● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi\n\n    Kolonka: omborda faqat 2 ta qoldi\n\n      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n      36 |         if (p.stock <= c.qty) {\n    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n         |                 ^\n      38 |         }\n      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\n\n      at api/order/order.service.ts:37:17\n      at Object.<anonymous> (api/order/order.service.spec.ts:76:19)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 4 passed, 5 total\nSnapshots:   0 total\nTime:        0.797 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 1]";
const KOD_OUT_10 = "$ npm i -D supertest @types/supertest\nnpm warn allow-scripts\nnpm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.\n[chiqish kodi: 0]\nsupertest 7.3.1\n@types/supertest 7.2.1";
const KOD_OUT_11 = "$ npx jest app.controller --verbose\nPASS src/api/app.controller.spec.ts\n  HTTP: GET /\n    ✓ 200 va { ok: true } (39 ms)\n    ✓ yo'q manzil — 404 (12 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.766 s, estimated 1 s\nRan all test suites matching app.controller.\n[chiqish kodi: 0]";
const KOD_OUT_12 = "$ npm test -- --verbose\n\n> order-bot-nest@1.0.0 test\n> jest --verbose\n\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (20 ms)\n    ✓ savat bo'sh — darhol xato (2 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✓ yetarli — jami narx hisoblanadi (2 ms)\n    ✓ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi (2 ms)\n\nPASS src/api/app.controller.spec.ts\n  HTTP: GET /\n    ✓ 200 va { ok: true } (26 ms)\n    ✓ yo'q manzil — 404 (6 ms)\n\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (2 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor (1 ms)\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (6 ms)\n    ✓ o'rtada ikkalasi bor\n    ✓ oxirgi sahifada ▶ yo'q (1 ms)\n    ✓ bitta sahifa — faqat 1/1\n    ✓ tugagan mahsulot bosilmaydi (1 ms)\n\nPASS src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam\n    ✓ 998901234567 — to'g'ri raqam\n    ✓ 12345678 — 8 ta raqam — qisqa\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf\n    ✓  — bo'sh\n    ✓ mijoz probel bilan yozadi\n  isPhone — qoida nimani o'tkazib yuboradi\n    ✓ 9 ta nol ham o'tadi\n\nPASS src/api/telegram/texts.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (1 ms)\n    ✓ kichik sonda probel yo'q (1 ms)\n\nTest Suites: 5 passed, 5 total\nTests:       25 passed, 25 total\nSnapshots:   0 total\nTime:        1.286 s\nRan all test suites.\n[chiqish kodi: 0]";
const KOD_OUT_13 = " package-lock.json | 277 ++++++++++++++++++++++++++++++++++++++++++++++++++++++\n package.json      |   2 +\n 2 files changed, 279 insertions(+)";
const KOD_OUT_14A = "$ npx jest order.service\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ telefon yo'q — darhol xato (10 ms)\n    ✕ savat bo'sh — darhol xato (2 ms)\n    ✕ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✕ yetarli — jami narx hisoblanadi (1 ms)\n\n  ● OrderService.place › telefon yo'q — darhol xato\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\n  ● OrderService.place › savat bo'sh — darhol xato\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\n  ● OrderService.place › omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\n  ● OrderService.place › yetarli — jami narx hisoblanadi\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\nTest Suites: 1 failed, 1 total\nTests:       4 failed, 4 total\nSnapshots:   0 total\nTime:        0.74 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 1]";
const KOD_OUT_14B = "$ npx jest order.service -t omborda\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (29 ms)\n    ○ skipped telefon yo'q — darhol xato\n    ○ skipped savat bo'sh — darhol xato\n    ○ skipped yetarli — jami narx hisoblanadi\n\n  ● OrderService.place › omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n\n    expect(received).rejects.toThrow(expected)\n\n    Expected substring: \"Kolonka: omborda faqat 1 ta qoldi\"\n    Received message:   \"Mahsulot topilmadi: Kolonka\"\n\n          33 |           lock: { mode: 'pessimistic_write' },\n          34 |         });\n        > 35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n             |                       ^\n          36 |         if (p.stock < c.qty) {\n          37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n          38 |         }\n\n      at api/order/order.service.ts:35:23\n      at Object.<anonymous> (api/order/order.service.spec.ts:45:5)\n      at Object.<anonymous> (api/order/order.service.spec.ts:45:53)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 skipped, 4 total\nSnapshots:   0 total\nTime:        0.807 s, estimated 1 s\nRan all test suites matching order.service with tests matching \"omborda\".\n[chiqish kodi: 1]";
const KOD_AI_DIFF1 = " src/api/order/order.service.spec.ts             | 203 ++++++++++++++++++++++++\n src/api/telegram/telegram.service.phone.spec.ts | 149 +++++++++++++++++\n 2 files changed, 352 insertions(+)";
const KOD_AI_DIFF2 = " src/api/order/order.service.spec.ts       | 142 ++++++++++++++++++++++++++++++\n src/api/telegram/telegram.service.spec.ts |  82 +++++++++++++++++\n 2 files changed, 224 insertions(+)";
const KOD_PROMPT1 = "src/api/order/order.service.ts dagi place funksiyasi va telegram.service.ts dagi telefon raqami tekshiruvi uchun edge case va xato holatlariga jest testlar yozib ber. npm test yashil bo'lsin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), Jest sozlangan, testlar src/ ichida *.spec.ts; src/api/order/order.service.spec.ts da place uchun mock namunasi bor. Vazifa: OrderService.setStatus(id, status) uchun unit-testlar yoz (src/api/order/order.service.spec.ts ga qo'sh yoki alohida fayl): buyurtma topilmadi → xato; allaqachon CANCELLED bo'lgan buyurtmani yana bekor qilish → xato va increment chaqirilmaydi; CANCELLED qilinganda har mahsulot uchun increment chaqiriladi; CONFIRMED qilinganda increment chaqirilmaydi. Shartlar: baza o'rniga mock (findOneBy, query, increment, save — jest.fn); promise xatosi await expect(…).rejects.toThrow('…') bilan; xato xabarini qo'lda yoz, koddan olma; har it da kamida bitta expect. Tegma: src/ dagi .spec.ts dan boshqa fayllarga. Javobda: qo'shilgan fayllar ro'yxati va npm test natijasi.";
const KOD = { TS_PHONE: KOD_TS_PHONE, TS_ONTEXT: KOD_TS_ONTEXT, TS_IMPORT_NEW: KOD_TS_IMPORT_NEW, TS_ONTEXT_NEW: KOD_TS_ONTEXT_NEW, PHONE_OLD: KOD_PHONE_OLD, PHONE_NEW: KOD_PHONE_NEW, SPEC_PHONE_02: KOD_SPEC_PHONE_02, SPEC_PHONE_04: KOD_SPEC_PHONE_04, ORDER_PLACE: KOD_ORDER_PLACE, ORDER_SETSTATUS: KOD_ORDER_SETSTATUS, SPEC_ORDER_05: KOD_SPEC_ORDER_05, SPEC_ORDER_06: KOD_SPEC_ORDER_06, SPEC_ORDER_07: KOD_SPEC_ORDER_07, SPEC_ORDER_08: KOD_SPEC_ORDER_08, SPEC_ORDER_08B: KOD_SPEC_ORDER_08B, SPEC_ORDER_10: KOD_SPEC_ORDER_10, APP_CTRL: KOD_APP_CTRL, SPEC_APP: KOD_SPEC_APP, AI1_ORDER: KOD_AI1_ORDER, AI1_TEL: KOD_AI1_TEL, AI2_ORDER: KOD_AI2_ORDER, AI2_TEL: KOD_AI2_TEL, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '08b': KOD_OUT_08B, '09': KOD_OUT_09, '09b': KOD_OUT_09B, '09c': KOD_OUT_09C, '10': KOD_OUT_10, '11': KOD_OUT_11, '12': KOD_OUT_12, '13': KOD_OUT_13, '14a': KOD_OUT_14A, '14b': KOD_OUT_14B }, AI_DIFF1: KOD_AI_DIFF1, AI_DIFF2: KOD_AI_DIFF2, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2 };

// ============================================================
//  Jest-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-matn.py (manba: 12-Jest2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "Bot to'g'ri kirishda ishlaydi — endi noto'g'ri kirishda to'g'ri buziladimi, shuni sinaymiz",
  "seg": [
   [
    "a",
    "Jest-1 da «ishlaydi»ni sinadingiz — bugun <b>«buzilganda to'g'ri buziladimi»</b>",
    "Assalomu alaykum. Jest birinchi darsida bot to'g'ri kirishda to'g'ri ishlashini sinadingiz. Bugun teskarisi: mijoz noto'g'ri yozganda, ombor yetmaganda bot to'g'ri buziladimi. Ekranda dars oxiridagi natija: beshta test fayli, yigirma beshta test, hammasi yashil."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: uch yo'l — happy path, edge case, error path",
    "Avval umumiy tushunchani olamiz: kodning uch yo'li bor. Happy path, ya'ni kutilgan to'g'ri kirish. Edge case, ya'ni qoidaning chegarasi. Error path, ya'ni kod ataylab xato beradigan yo'l. Bugun uchalasini botning haqiqiy joylarida ko'rasiz."
   ],
   [
    "c",
    "Telefon qoidasi, buyurtmaning uch xatosi, <b>sayt API'siga HTTP test</b>",
    "Keyin uchta haqiqiy joy: telefon raqami qoidasi, buyurtma berishdagi uchta xato va saytning API manzili. Oxirgisi Jest birinchi darsidagi savolga javob: sayt ham xuddi shunday sinaladi. Yo'lda ikkita yashirin tuzoqni ko'rasiz: ularda Jest qizil ham bermaydi."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>",
    "Dars olti bosqichdan iborat, uchta amaliyotda o'zingiz yozasiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Har funksiyada uch yo'l bor: kutilgan kirish, chegaradagi kirish va ataylab xato — test uchalasini sinaydi",
  "seg": [
   [
    "a",
    "Happy path — <b>kutilgan to'g'ri kirish</b>: Jest-1 ning hamma testi shu yo'lda edi",
    "Birinchi yo'l happy path: mijoz raqamni to'g'ri yozdi, omborda yetarli, buyurtma qabul qilindi. Jest birinchi darsidagi hamma test shu yo'lda edi. Haqiqiy do'konda esa mijozlarning hammasi ham to'g'ri yozmaydi."
   ],
   [
    "b",
    "Edge case — <b>qoidaning chegarasi</b>: kod xato bermaydi, lekin javob to'g'rimi?",
    "Ikkinchi yo'l edge case, ya'ni chegara. Mijoz raqamni probel bilan yozdi. Yoki raqam aynan to'qqizta, ya'ni eng qisqa ruxsat etilgani. Yoki omborda aynan ikkita bor va ikkitasi olinadi. Kod xato bermaydi, lekin javobi to'g'rimi, buni test aytadi."
   ],
   [
    "c",
    "Error path — <b>kod ataylab xato beradi</b>: qaysi xabar, keyin nima bo'lmaydi",
    "Uchinchi yo'l error path: telefon yo'q, savat bo'sh, omborda yetmaydi. Bu yerda kod ataylab xato beradi, bu to'g'ri xulq. Test xatoning o'zini kutadi: xato chiqdimi, qaysi xabar bilan, va xatodan keyin ombor o'zgarmay qoldimi."
   ],
   [
    "d",
    "Xulosa: har funksiyaga <b>uch yo'lning testi</b> — bugun uchalasini yozamiz",
    "Xulosa: bitta funksiyaga uch yo'lning testi yoziladi: kutilgan kirish, chegara va xato. Bugun telefon qoidasida chegarani, buyurtmada xato yo'lini, saytning API'sida esa so'rov va javobni sinaymiz. Telefon qoidasidan boshlaymiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "2-bosqich · telefon",
  "title": "PHONE qoidasi telegram.service.ts ichida yashirin — testdan chaqirib bo'lmaydi, shuning uchun alohida faylga chiqaramiz",
  "seg": [
   [
    "a",
    "Qoida <b><code>telegram.service.ts</code> 12-satrda</b>: <code>+</code> ixtiyoriy, 9 dan 13 tagacha raqam",
    "OrderBotNest papkangizni VS Code'da oching. Src, api, telegram papkasidagi telegram service ts faylining o'n ikkinchi satrida telefon qoidasi: regex. Plus ixtiyoriy, keyin to'qqizdan o'n uchtagacha raqam, boshqa hech narsa. Bir yuz ellik yettinchi satrda bot shu qoida bilan mijoz xabarini tekshiradi."
   ],
   [
    "b",
    "Muammo: qoida <b><code>const</code>, eksport qilinmagan</b> — test uni chaqira olmaydi",
    "Muammo shunda: qoida const, fayl ichida yashirin, eksport qilinmagan. Test uni chaqira olmaydi. Butun botni ko'tarib, Telegram xabarini soxtalashtirish esa unit-test emas. Shuning uchun qoidani alohida faylga chiqaramiz."
   ],
   [
    "c",
    "Yangi fayl <code>phone.ts</code>: <b><code>isPhone(text)</code> — bitta funksiya</b>, bot ham, test ham shuni chaqiradi",
    "Shu telegram papkasida phone ts faylini yaratamiz. Ichida ikki narsa: o'sha regex va is phone funksiyasi, u matnni oladi va true yoki false qaytaradi. Endi bot ham, test ham bitta funksiyani chaqiradi. Qoida bitta joyda yashaydi."
   ],
   [
    "d",
    "Xulosa: <b>sinamoqchi bo'lgan qoidani funksiyaga ajrating</b> — bu kodni ham tozalaydi",
    "Xulosa: sinamoqchi bo'lgan qoida service ichida yashirin bo'lsa, uni alohida funksiyaga ajrating. Telegram service endi is phone'ni import qiladi va chaqiradi. Bu testni mumkin qiladi va kodni ham tozalaydi: qoida bitta joyda. Endi qoidaning o'zini sinaymiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Mijoz raqamni «+998 90 123 45 67» deb yozdi. isPhone hozirgi regex bilan nima qaytaradi?",
  "q": "Qoidani ajratdik, endi tekshirib olaylik. Birinchi tekshiruv. Mijoz raqamni probellar bilan yozdi: plus to'qqiz to'qqiz sakkiz, probel, to'qson, probel va hokazo. Is phone hozirgi regex bilan nima qaytaradi? Variantni tanlang.",
  "ok": "To'g'ri. Regex'da faqat plus va raqamlar bor, probel yo'q, shuning uchun false. Trim faqat boshi va oxiridagi probelni oladi, o'rtadagini emas. Bot bu raqamni rad etadi, mijoz esa raqamni to'g'ri yozganini o'ylaydi. Demak, edge case ko'pincha qoida emas, mijozning odatidan chiqadi.",
  "okShort": "Regex'da probel yo'q → <code>false</code>. <code>trim()</code> faqat chekkadagi probelni oladi.",
  "hint": "Regex'da qaysi belgilar ruxsat etilgan? Probel ular ichidami?",
  "demak": "Edge case ko'pincha qoidadan emas, mijozning odatidan chiqadi.",
  "correct": 1,
  "opts": [
   "true — raqamlar soni to'g'ri, probel sanalmaydi",
   "false — regex'da faqat raqam va +, probel yo'q",
   "true — trim() probellarni olib tashlaydi",
   "Xato — regex matndagi probelda yiqiladi"
  ],
  "wrong": {
   "0": "Regex belgima-belgi tekshiradi: probel \\d emas.",
   "2": "trim() faqat boshidagi va oxiridagi probelni oladi, o'rtadagini emas.",
   "3": "Regex yiqilmaydi, u false qaytaradi — xato xabari yo'q."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · telefon",
  "title": "Bitta qoidaga yettita kirish: ikkita to'g'ri, to'rtta noto'g'ri va bitta chegara — it.each ularni bir jadvalda yozadi",
  "seg": [
   [
    "a",
    "<code>it.each</code> — <b>bir xil test, har xil kirish</b>: ro'yxat beriladi, Jest har biriga alohida test yasaydi",
    "Phone spec ts faylini telegram papkasida, phone ts yonida yaratamiz. Yangi narsa: it each. Unga kirishlar ro'yxati beriladi, Jest har biriga alohida test yasaydi. Birinchi ro'yxatda ikkita to'g'ri raqam: plus bilan va plussiz."
   ],
   [
    "b",
    "To'rtta noto'g'ri kirish: <b>8 ta raqam, 14 ta raqam, harf, bo'sh</b> — har birining nomi bor",
    "Ikkinchi ro'yxatda to'rtta noto'g'ri kirish: sakkizta raqam, ya'ni chegaradan bitta kam. O'n to'rtta raqam, chegaradan bitta ko'p. Harflar. Bo'sh matn. Har qatorda kirish va uning nomi: terminalda test nomi tushunarli bo'lsin."
   ],
   [
    "c",
    "Yettinchi test — mijozning odati: <b>probel bilan yozilgan raqam <code>true</code> bo'lishi kerak</b>",
    "Yettinchi test mijozning odati: probel bilan yozilgan raqam. Biz uni to'g'ri deb kutamiz, chunki bu haqiqiy raqam. VS Code terminalida npm test, ikki chiziqcha, phone. Oltita yashil, bittasi qizil: probel bilan yozilgan raqam."
   ],
   [
    "d",
    "Demak, <b>qoida mijozdan tor</b>: probel bilan yozilgan haqiqiy raqamni bot rad etadi",
    "Demak, sabab bitta joyda: qoida mijozdan tor. Mijoz probel bilan yozadi, regex esa faqat raqamlarni biladi. Test buni kod yozilgan kuniyoq ko'rsatdi, mijoz shikoyat qilguncha emas. Keyingi ekranda qoidani kengaytiramiz va yana bir chegarani ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida",
  "title": "Tuzatish bitta satr: tekshirishdan oldin probel va chiziqchani olib tashlaymiz — keyin test qoida nimani o'tkazib yuborishini ham ko'rsatadi",
  "seg": [
   [
    "a",
    "Tuzatish: <b><code>replace(/[\\s-]/g, '')</code></b> — probel va chiziqcha olib tashlanadi, keyin tekshiriladi",
    "Phone ts faylining to'rtinchi satrini o'zgartiramiz: trim o'rniga replace. U probel va chiziqchalarni olib tashlaydi, keyin regex tekshiradi. Mijoz qanday yozsa ham, raqamlar bir xil. Npm test phone: yettala test yashil."
   ],
   [
    "b",
    "Yana bir test: <b>9 ta nol ham <code>true</code></b> — qoida buni to'g'ri raqam deydi",
    "Endi qiziq test. To'qqizta nol: is phone nima deydi? True. Qoida bo'yicha bu to'g'ri raqam: to'qqizta raqam, boshqa hech narsa. Test yashil, lekin siz o'ylab qolasiz: haqiqatan ham to'qqizta nol telefon raqamimi?"
   ],
   [
    "c",
    "Test <b>qoidani tekshiradi, qoidaning o'zi to'g'rimi</b> — bu sizning qaroringiz",
    "Mana edge test'ning ikkinchi foydasi. Test qoidani tekshiradi, qoidaning o'zi to'g'rimi, buni test hal qilmaydi. To'qqizta nol o'tishi sizga kelishmasa, qoidani torroq yozasiz va test yana sizni qo'riqlaydi. Hozircha qoldiramiz: bot uchun yetarli."
   ],
   [
    "d",
    "Xulosa: <b>chegaradagi kirishni testga yozing</b> — u qoidani ko'zingiz oldiga olib keladi",
    "Xulosa: chegaradagi kirishni testga yozing, u qoidani ko'zingiz oldiga olib keladi. Bitta test qoidaning tor joyini topdi, probel. Boshqasi qoidaning keng joyini ko'rsatdi, to'qqizta nol. Endi shu ikkala faylni o'zingiz yozasiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 12 daqiqa",
  "title": "Telefon qoidasini alohida faylga chiqaring, chegara testlarini yozing va probel bilan qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>jest2-start</code> tegida</b> qoidani ajratasiz va yetti test yozasiz",
    "Endi navbat sizga. OrderBotNest papkangizda jest ikki start tegiga o'tasiz. Telegram papkasida phone ts va phone spec ts yaratasiz. Baza va token kerak emas. O'n ikki daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: teg va <b><code>phone.ts</code>, <code>it.each</code> bilan yetti test</b> — probel testi qizil",
    "Birinchi qadamda git fetch va checkout bilan tegga o'tasiz. Ikkinchisida phone ts'ga regex va is phone'ni, phone spec ts'ga it each bilan yetti testni yozasiz. Npm test phone: probel testi qizil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b><code>replace</code> bilan tuzatish</b>, «9 ta nol» testi; isbot — <code>Tests:</code> satri",
    "Uchinchi qadamda is phone'da trim o'rniga replace yozasiz: hammasi yashil. To'rtinchisida to'qqizta nol testini qo'shasiz va natijani ko'rasiz. Isbot maydoniga oxirgi natijaning tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qoidani testga ochasiz va chegara testini yozasiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout jest2-start",
     "npm test"
    ],
    "exp": "Tests: 10 passed, 10 total"
   },
   {
    "t": "phone.ts + phone.spec.ts (3–5-ekrandagi kod)",
    "cmds": [
     "src/api/telegram/phone.ts",
     "src/api/telegram/phone.spec.ts",
     "npm test -- phone"
    ],
    "exp": "✕ mijoz probel bilan yozadi · Tests: 1 failed, 6 passed"
   },
   {
    "t": "Tuzatish",
    "cmds": [
     "isPhone da text.replace(/[\\s-]/g, '')",
     "npm test -- phone"
    ],
    "exp": "Tests: 7 passed, 7 total"
   },
   {
    "t": "Chegara",
    "cmds": [
     "it(\"9 ta nol ham o'tadi\") — isPhone('000000000') → true"
    ],
    "exp": "Tests: 8 passed, 8 total"
   }
  ],
  "proof": {
   "label": "Oxirgi natijaning Tests: satri",
   "placeholder": "masalan: Tests: 8 passed, 8 total",
   "re": "Tests:\\s+8 passed,\\s+8 total",
   "flags": "",
   "wrong": "Sakkizta test yashilmi? npm test -- phone natijasidagi Tests: qatorini qo'ying."
  },
  "trouble": [
   [
    "error: pathspec 'jest2-start' did not match",
    "teglar olinmagan — git fetch --tags, keyin checkout"
   ],
   [
    "2-qadamda hammasi ✓",
    "probel testi yozilmagan yoki replace allaqachon qo'yilgan — 5-ekrandagi yettinchi testni tekshiring"
   ],
   [
    "it.each da %s o'rniga undefined",
    "ro'yxat elementlari massiv emas — ['12345678', '8 ta raqam'] juftlik bo'lsin"
   ],
   [
    "Cannot find module './phone'",
    "fayl src/api/telegram/ da emas — telegram.service.ts yoniga ko'chiring"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · error path",
  "title": "Buyurtma berishda uchta xato bor: ikkitasi funksiyaning o'zida darhol, uchinchisi tranzaksiya ichida — testda bu farq hal qiluvchi",
  "seg": [
   [
    "a",
    "<code>order.service.ts</code> 24-satr: <b><code>place</code> ikki xatoni darhol otadi</b> — telefon yo'q, savat bo'sh",
    "Endi buyurtmaga o'tamiz. Src, api, order papkasidagi order service ts faylini oching, yigirma to'rtinchi satr: place funksiyasi. Yigirma besh va yigirma oltinchi satrlarda ikki tekshiruv: telefon yo'q bo'lsa xato, savat bo'sh bo'lsa xato. Ikkalasi darhol, funksiyaning o'zida otiladi."
   ],
   [
    "b",
    "Uchinchi xato <b>tranzaksiya ichida, 37-satr</b>: omborda yetmasa — promise'da otiladi",
    "Uchinchi xato o'ttiz yettinchi satrda: omborda yetmasa. Lekin u transaction ichida, ya'ni async funksiya ichida. Bu xato darhol emas, promise'da otiladi. Ekrandagi chizmaga qarang: ikki xato chapda, funksiyaning o'zida, bittasi o'ngda, promise ichida."
   ],
   [
    "c",
    "Farq nega muhim: <b>Jest'da ikkita har xil usul</b> — sinxron uchun biri, promise uchun boshqasi",
    "Bu farq test uchun hal qiluvchi. Sinxron xatoni expect, qavs ichida funksiya, to throw bilan ushlaymiz. Promise xatosini esa await expect, rejects, to throw bilan. Usulni almashtirib yuborsangiz, Jest qizil ham bermaydi, buni ikki ekrandan keyin ko'rasiz."
   ],
   [
    "d",
    "Xulosa: xatoni sinashdan oldin <b>qayerda otilishini</b> aniqlang — darholmi, promise ichidami",
    "Xulosa: xatoni sinashdan oldin uning qayerda otilishini aniqlang: funksiyaning o'zida darholmi, yoki promise ichidami. Place'da ikkala tur ham bor. Lekin testdan oldin yana bir muammo: place bazaga yozadi, bizda esa test bazasi yo'q. Keyingi ekranda shuni hal qilamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "Unit-test bazasiz: DataSource o'rniga soxta obyekt, findOne biz aytgan mahsulotni qaytaradi — bu mock",
  "seg": [
   [
    "a",
    "<code>place</code> bazaga yozadi, test bazasi yo'q — <b>baza o'rniga mock</b>: soxta <code>manager</code>",
    "Place funksiyasi transaction ichida bazaga yozadi: find one, update, save. Unit-testda baza yo'q va kerak emas. Shuning uchun baza o'rniga mock, ya'ni soxta obyekt beramiz. Order papkasida order service spec ts faylini yaratamiz, sakkizinchi satrdan manager obyekti."
   ],
   [
    "b",
    "<code>jest.fn()</code> — <b>chaqiruvni yozib qoladigan soxta funksiya</b>; <code>transaction</code> esa mock'ni callback'ka beradi",
    "Jest fn soxta funksiya: u chaqirilganini va qanday argument bilan chaqirilganini yozib qoladi. Find one, query, save, hammasi shunday. O'n oltinchi satrda data source: uning transaction funksiyasi callback'ni darhol chaqirib, unga bizning manager'ni beradi. Place buni haqiqiy baza deb o'ylaydi."
   ],
   [
    "c",
    "<code>Test.createTestingModule</code>: <b>Nest'ga <code>DataSource</code> o'rniga mock'ni beramiz</b>, <code>OrderService</code> haqiqiy",
    "Yigirma uchinchi satrdan Nest'ning test moduli. Providers ro'yxatida order service haqiqiy, data source o'rniga esa bizning soxta obyekt. Nest uni inject qiladi, order service farqini bilmaydi. Repository ham kerak, bo'sh obyekt yetadi: place uni ishlatmaydi."
   ],
   [
    "d",
    "Xulosa: har testda <b><code>mockResolvedValue</code> bilan mahsulotni biz beramiz</b> — omborda 1 ta yoki 10 ta",
    "Xulosa: endi har testda omborni biz boshqaramiz. Mock resolved value bilan find one'ga nima qaytarishini aytamiz: omborda bitta Kolonka yoki o'nta. Baza yo'q, lekin place aynan haqiqiy kodda ishlaydi. Endi to'rtta testni yozamiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · error path",
  "title": "Sinxron xato — expect(() => …).toThrow(), promise xatosi — await expect(…).rejects.toThrow(): to'rt test, hammasi yashil",
  "seg": [
   [
    "a",
    "Sinxron xato: <b><code>expect(() =&gt; …)</code> — funksiyani o'rab beramiz</b>, Jest uni o'zi chaqiradi",
    "Birinchi ikki test sinxron xato uchun. Qarang: expect ichida funksiyani darhol chaqirmaymiz, qavs, strelka, keyin chaqiruv. Jest o'sha o'ramni o'zi chaqiradi va xatoni ushlaydi. To throw ichida xabar: telefon raqami yo'q. Xabar mos bo'lmasa, test qizil."
   ],
   [
    "b",
    "Promise xatosi: <b><code>await expect(…).rejects.toThrow()</code></b> — funksiya darhol chaqiriladi, promise kutiladi",
    "Uchinchi test promise xatosi uchun, shakli boshqa. Expect ichida place darhol chaqiriladi, o'ramsiz, chunki u promise qaytaradi. Keyin rejects: promise xato bilan tugashini kutamiz. Va boshida await: Jest natijani kutsin. Mock'da omborda bitta Kolonka, savatda ikkita."
   ],
   [
    "c",
    "To'rtinchi test — happy path: <b>omborda 10 ta, jami 100 000</b>, <code>query</code> bir marta chaqirildi",
    "To'rtinchi test happy path: omborda o'nta, buyurtma o'tadi, jami bir yuz ming so'm. Va yana bir tekshiruv: manager query bir marta chaqirildi, ya'ni update ketdi. VS Code terminalida npm test order service: to'rttala test yashil."
   ],
   [
    "d",
    "Xulosa: <b>sinxron — o'rab <code>toThrow</code>, promise — <code>rejects</code> va <code>await</code></b>; endi ikkalasini almashtirib ko'ramiz",
    "Xulosa: sinxron xatoga o'ram va to throw, promise xatosiga rejects va await. Ikkalasi yashil, lekin shakl muhim. Keyingi ikki ekranda ularni ataylab almashtiramiz va Jest nima qilishini ko'rasiz. Natija sizni hayron qoldiradi."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "Ombor xatosini toThrow bilan yozsak, Jest qizil bermaydi — jarayonning o'zi quladi, PASS ham, FAIL ham chiqmadi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: testda yonib turgan <code>rejects</code> ustiga bosing",
    "Ombor testi to'g'ri yozilgan: await va rejects bor. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: order service spec faylining ellik birinchi satri yonib turibdi, ustiga bosing: test birinchi testdagi sinxron shaklga o'tadi.",
    "<b>order.service.spec.ts</b> 51-satridagi <b><code>await expect(…).rejects</code></b> ustiga bosing — test <code>expect(() =&gt; …).toThrow</code> shakliga o'tadi."
   ],
   [
    "a",
    "Ombor testi endi <b><code>toThrow</code> bilan</b> — sinxron shakl, promise xatosi uchun",
    "Test endi o'ram va to throw bilan, await yo'q, rejects yo'q. Ko'rinishi to'g'riga o'xshaydi: xabar ham o'sha. Npm test order service."
   ],
   [
    "b",
    "Natija: <b>PASS ham, FAIL ham yo'q</b> — terminalda xato va <code>Node.js v24.18.0</code>, jarayon quladi",
    "Natijaga qarang. PASS yo'q, FAIL yo'q, tests satri yo'q. Faqat xato: Kolonka, omborda faqat bitta qoldi, va Node versiyasi. Jest jarayonining o'zi quladi. Siz test qizil bo'ladi deb kutgan edingiz, u esa umuman natija bermadi."
   ],
   [
    "c",
    "Demak, sabab: <b><code>toThrow</code> o'ramni chaqirdi, <code>place</code> promise qaytardi, xato keyin keldi</b> — hech kim ushlamadi",
    "Demak, sabab bitta joyda. To throw o'ramni chaqirdi, place promise qaytardi, va shu paytda xato yo'q edi. Test o'tdi deb hisoblandi. Xato keyin, promise ichida otildi, uni hech kim ushlamadi, va Node butun jarayonni to'xtatdi. Bu yashirin xato: qizil emas, bo'sh."
   ],
   [
    "d",
    "Xulosa: promise xatosiga <b><code>toThrow</code> emas, <code>rejects</code></b> — aks holda Jest sizga hech narsa aytmaydi",
    "Xulosa: promise ichidagi xatoga to throw yozilmaydi, rejects yoziladi. Aks holda Jest sizga hech narsa aytmaydi, jarayon qulaydi. Sinfda o'quvchi test natijasi chiqmayapti desa, birinchi shuni so'rang: xato promise ichidami. Endi teskarisini ko'ramiz."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Telefon testini await expect(service.place(…)).rejects.toThrow() bilan yozdik. place xatoni darhol, funksiya ichida otadi. Natija?",
  "q": "Promise shaklini sinxron xatoga qo'yib ko'ramiz. Ikkinchi tekshiruv. Telefon testini rejects bilan yozdik, lekin place telefon xatosini darhol, funksiyaning o'zida otadi, promise qaytarmasdan. Npm test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. Place chaqirilganda xato darhol otildi, expect hali ishga tushmagan edi. Jest bu xatoni testning o'zi yiqildi deb hisoblaydi va FAIL beradi, xabari: telefon raqami yo'q. Bu safar natija bor, chunki xato sinxron, Jest uni ushladi. Demak, rejects faqat promise'dan keladigan xatoni ushlaydi.",
  "okShort": "Xato <code>expect</code>gacha otildi — FAIL, Jest ushladi. <code>rejects</code> faqat promise xatosi uchun.",
  "hint": "service.place(…) qachon chaqiriladi — expect ichida, rejectsdan oldin. Xato qachon otiladi?",
  "demak": "<code>rejects</code> faqat promise'dan keladigan xatoni ushlaydi; sinxron xato <code>expect</code>gacha otiladi.",
  "correct": 2,
  "opts": [
   "PASS — rejects sinxron xatoni ham ushlaydi",
   "Jarayon quladi — 11-ekrandagi kabi natija yo'q",
   "FAIL — xato expect ishga tushguncha otildi",
   "PASS — await xatoni promise'ga o'raydi"
  ],
  "wrong": {
   "0": "rejects promise kutadi; xato expect ishga tushguncha otildi.",
   "1": "Bu safar xato sinxron — Jest uni test ichida ushladi, natija bor.",
   "3": "await xatoni o'ramaydi; place chaqirilgan paytdayoq otildi."
  }
 },
 "13": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "rejects to'g'ri, lekin await yo'q va xabar ataylab noto'g'ri: Jest xatoni topdi, lekin testga bog'lay olmadi — yana natija yo'q",
  "seg": [
   [
    "a",
    "Shakl deyarli to'g'ri: <code>rejects</code> bor, <b>faqat <code>await</code> yo'q</b>; xabarni ham ataylab noto'g'ri yozdik",
    "Yana bir yashirin xato, bu safar ancha nozik. Rejects bor, to throw bor, faqat boshida await yo'q. Va xabarni ataylab noto'g'ri yozdik: Planshet, to'qqizta qoldi, kodda esa Kolonka, bitta. Test qizil bo'lishi kerak. Npm test."
   ],
   [
    "b",
    "Natija: Jest farqni <b>topdi — <code>Expected</code> Planshet, <code>Received</code> Kolonka</b>, lekin PASS/FAIL yana yo'q",
    "Natijaga qarang. Jest farqni topdi: expected Planshet, received Kolonka, o'ttiz yettinchi satr. Lekin pastda yana Node versiyasi, PASS yo'q, FAIL yo'q. Jest xatoni ko'rdi, lekin uni testga bog'lay olmadi."
   ],
   [
    "c",
    "Demak, sabab: <b><code>await</code>siz test darhol tugadi</b>, promise keyin rad etildi — Jest uni qaysi testga yozishni bilmadi",
    "Demak, sabab bitta: await yo'q. Test funksiyasi promise'ni kutmasdan darhol tugadi. Promise keyin rad etildi, Jest bu xato qaysi testniki ekanini bilmadi va jarayonni to'xtatdi. Await bo'lsa, bu oddiy qizil test bo'lar edi, xabar bilan."
   ],
   [
    "d",
    "Xulosa: <b><code>rejects</code> oldida doim <code>await</code></b>; natija umuman chiqmasa — promise va <code>await</code>ni tekshiring",
    "Xulosa: rejects oldida doim await, test funksiyasi esa async. Jest natija umuman bermasa, bu kodning xatosi emas, testning shakli: promise xatosiga to throw yoki await'siz rejects. Endi shu satrni o'zingiz topasiz."
   ]
  ]
 },
 "14": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Bu test faylida npm test natija bermaydi — jarayon qulaydi. Sababchi satrni toping",
  "q": "Yashirin xatoni ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Bu test faylida npm test natija bermaydi, jarayon qulaydi. Bo'lakda bitta satr promise'ni kutmaydi. O'sha satrni bosing.",
  "ok": "To'g'ri. Shu satrda await yo'q: test promise'ni kutmasdan tugaydi, xato keyin keladi va Jest uni testga bog'lay olmaydi. Ekranda tuzatilgan satr: await bilan. Endi noto'g'ri xabar oddiy qizil test beradi, expected va received bilan. Demak, natija chiqmasa, avval rejects oldidagi await'ni qidiring.",
  "okShort": "<code>await</code> yo'q — test promise'ni kutmadi, jarayon quladi. <code>await</code> bilan — oddiy FAIL, <code>Expected</code>/<code>Received</code> bilan.",
  "hint": "Qaysi satr promise qaytaradi va uni kutmaydi? rejects oldida nima bo'lishi kerak?",
  "task": "Qoida: promise xatosi <code>await expect(…).rejects.toThrow()</code> bilan kutiladi. Bu bo'lakda bitta satr promise'ni kutmaydi. <b>O'sha satrni bosing.</b>"
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · chegara va «bo'lmasligi kerak»",
  "title": "Xato yo'lida test ikki narsani kutadi: xato chiqdi va ombor o'zgarmadi — not.toHaveBeenCalled()",
  "seg": [
   [
    "a",
    "Xato chiqdi — bu yarmi. <b>Xatodan keyin <code>UPDATE</code> ketmaganini</b> ham tekshiramiz",
    "Ombor testiga qaytamiz. Xato chiqdi, bu yarmi. Muhimroq savol: xatodan keyin ombor o'zgarmay qoldimi? Order service ts'da o'ttiz oltinchi satrdagi tekshiruv update'dan oldin turadi. Agar kimdir tartibni almashtirsa, xato chiqadi, lekin ombor baribir kamayadi."
   ],
   [
    "b",
    "<code>expect(manager.query).not.toHaveBeenCalled()</code> — <b>mock chaqiruvni yozib qolgan</b>, biz so'raymiz",
    "Mock bu yerda yordam beradi. Manager query jest fn, u chaqirilganini eslab qoladi. Biz so'raymiz: not to have been called, ya'ni umuman chaqirilmagan bo'lsin. Xato yo'lida bu eng muhim qator: bot xato berib, baribir omborni kamaytirmasin."
   ],
   [
    "c",
    "Happy path'da teskarisi: <b><code>toHaveBeenCalledTimes(1)</code></b> — <code>UPDATE</code> aynan bir marta ketdi",
    "Happy path testida teskarisi: to have been called times bir. Update aynan bir marta ketdi, ikki marta emas, nol marta emas. Mock bilan siz kod bazaga nima yuborganini sanaysiz: nima ketdi, nima ketmadi."
   ],
   [
    "d",
    "Xulosa: error path testi <b>ikki qismli</b>: xato chiqdi va keyingi qadam bajarilmadi",
    "Xulosa: xato yo'lining testi ikki qismli. Birinchisi: xato chiqdi, to'g'ri xabar bilan. Ikkinchisi: xatodan keyin bo'lmasligi kerak bo'lgan narsa bo'lmadi. Ikkinchisini ko'pchilik yozmaydi, aynan shu yerda bot pulni yo'qotadi. Endi chegarani buzamiz."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Ombor tekshiruvini <= qilsak, aynan 2 ta qolganda 2 tasini sotib bo'lmaydi — to'rt test yashil qoladi, chegara testi qizaradi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: shartda yonib turgan <code>&lt;</code> ustiga bosing",
    "Ombor tekshiruvi to'g'ri ishlaydi. Endi chegarani buzamiz. Buzishni o'zingiz qilasiz: order service ts'ning o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing: u kichik yoki tengga aylanadi.",
    "<b>order.service.ts</b> 36-satridagi <b><code>&lt;</code></b> ustiga bosing — <code>&lt;=</code> bo'ladi."
   ],
   [
    "a",
    "Buzildi: <b><code>&lt;</code> o'rniga <code>&lt;=</code></b> — omborda 2 ta, 2 tasini olsa, bot «faqat 2 ta qoldi» deydi",
    "Kichik endi kichik yoki teng. Omborda ikkita bo'lsa va mijoz ikkitasini olsa, bot xato beradi: faqat ikkita qoldi. Oxirgi mahsulot hech qachon sotilmaydi. Npm test order service."
   ],
   [
    "b",
    "To'rt test <b>yashil qoldi</b>: ular 1 ta va 10 ta ni sinaydi, chegarani emas",
    "To'rttala test yashil. Sababi: ombor testi bitta qolganini sinaydi, happy path o'nta. Ikkalasi chegaradan uzoqda. Kichik va kichik yoki teng farqi faqat ikki son teng bo'lganda ko'rinadi. Jest birinchi darsidagi sahifalash xatosi bilan bir xil."
   ],
   [
    "c",
    "Beshinchi test — <b>omborda aynan 2 ta, 2 tasi olinadi</b>: endi qizil, «faqat 2 ta qoldi»",
    "Beshinchi testni qo'shamiz: mock'da omborda aynan ikkita, savatda ikkita. Buyurtma o'tishi kerak, jami bir yuz ming. To'g'ri kod bilan beshtala yashil. Buzilgan kod bilan beshinchisi qizil: omborda faqat ikkita qoldi. Bitta belgi, bitta test uni ushladi."
   ],
   [
    "d",
    "Xulosa: har <b><code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> shartiga chegara testi</b> — aynan teng bo'lgan qiymat bilan",
    "Xulosa: kodda kichik, katta, kichik yoki teng ko'rsangiz, aynan teng bo'lgan qiymat bilan test yozing. Bu test odatda eng qisqa va eng ko'p xatoni ushlaydi. Shartni tiklaymiz, beshtala yashil. Endi order service testlarini o'zingiz yozasiz."
   ]
  ]
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "Mock bilan place ning uch xatosini va chegarasini sinang, keyin kodni buzib qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>order.service.spec.ts</code></b> — mock, uch xato, chegara va bitta buzish",
    "Endi navbat sizga. Order papkasida order service spec ts yozasiz: mock, uchta xato, happy path va chegara. Ekrandagi namuna kodni ochishingiz mumkin, lekin o'zingiz yozing, nusxalamang. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>mock va to'rt test</b> — sinxron <code>toThrow</code>, promise <code>rejects</code>, <code>not.toHaveBeenCalled</code>",
    "Birinchi qadamda mock manager va test modulini yozasiz. Ikkinchisida to'rtta test: telefon va savat sinxron to throw bilan, ombor await rejects bilan va query chaqirilmaganini tekshirib, happy path jami bilan. Npm test order service: to'rttasi yashil."
   ],
   [
    "c",
    "3–4-qadam: <b>chegara testi va <code>&lt;=</code> buzish</b>; isbot — qizargan (✕) testning nomi",
    "Uchinchi qadamda chegara testini qo'shasiz: omborda aynan ikkita. To'rtinchisida order service ts'da kichikni kichik yoki tengga buzib, qaysi test qizarganini ko'rasiz va git checkout bilan tiklaysiz. Isbot maydoniga qizargan test nomini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bazasiz xato yo'lini sinaysiz va chegara testining xatoni ushlashini o'zingiz ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Mock va modul",
    "cmds": [
     "src/api/order/order.service.spec.ts — manager, dataSource, Test.createTestingModule (9-ekran)"
    ],
    "exp": "fayl tayyor"
   },
   {
    "t": "To'rt test",
    "cmds": [
     "telefon",
     "savat (toThrow)",
     "ombor (await … rejects.toThrow + not.toHaveBeenCalled)",
     "yetarli (total 100000)",
     "npm test -- order.service"
    ],
    "exp": "Tests: 4 passed, 4 total"
   },
   {
    "t": "Chegara",
    "cmds": [
     "it(\"chegara: omborda aynan 2 ta…\") — stock: 2",
     "npm test -- order.service"
    ],
    "exp": "Tests: 5 passed, 5 total"
   },
   {
    "t": "Buzish va tiklash",
    "cmds": [
     "order.service.ts 36-satr < → <=",
     "npm test -- order.service",
     "git checkout -- src/api/order/order.service.ts"
    ],
    "exp": "✕ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi"
   }
  ],
  "proof": {
   "label": "4-qadamda qizargan (✕) testning nomi — buyruq emas",
   "placeholder": "masalan: chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi",
   "re": "(chegara|aynan 2|2 ta)",
   "flags": "i",
   "wrong": "Bu yerga buyruqni emas, terminalda ✕ yonidagi test nomini yozing, masalan: chegara: omborda aynan 2 ta."
  },
  "trouble": [
   [
    "Natija umuman yo'q, Node.js v24…",
    "promise xatosiga toThrow yoki rejects oldida await yo'q (11, 13-ekran)"
   ],
   [
    "Nest can't resolve dependencies of the OrderService (?, DataSource)… \"OrderRepository\" at index [0]",
    "providers da getRepositoryToken(Order) yo'q — bo'sh obyekt bilan qo'shing (9-ekran)"
   ],
   [
    "Received message: \"Mahsulot topilmadi: Kolonka\"",
    "mockResolvedValue shu testda yozilmagan — findOne undefined qaytardi, kod «topilmadi» dedi"
   ],
   [
    "4-qadamda hammasi ✓",
    "chegara testi stock: 2 emas — mock'da aynan 2 va savatda 2 bo'lsin"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · HTTP va AI",
  "title": "Sayt ham shunday sinaladi: supertest server ochmasdan Nest ilovasiga so'rov yuboradi — GET / 200 va JSON, GET /nope 404",
  "seg": [
   [
    "a",
    "Jest-1 dagi savol: <b>«saytni test qila olamanmi?»</b> — ha, bitta paket: <code>supertest</code>",
    "Jest birinchi darsida savol bor edi: botni sinadim, saytni-chi? Javob: xuddi shunday, bitta qo'shimcha paket bilan. VS Code terminalida npm i minus D supertest va types supertest. Supertest server ochmasdan Nest ilovasiga so'rov yuboradi."
   ],
   [
    "b",
    "<code>app.controller.spec.ts</code>: <b>Nest ilovasini xotirada ko'taramiz</b> — <code>createNestApplication</code>, <code>app.init()</code>",
    "Src, api papkasida app controller spec ts yaratamiz. Before all'da test moduli faqat app controller bilan, keyin create nest application va init. Ilova xotirada ko'tarildi, port ochilmadi, baza yo'q. After all'da yopamiz."
   ],
   [
    "c",
    "Ikki test: <b><code>GET /</code> → 200 va <code>{ ok: true }</code></b>, <code>GET /nope</code> → 404 «Cannot GET /nope»",
    "Birinchi test: get, ildiz manzil. Status ikki yuz, tana ok true va service order bot, to equal bilan. Ikkinchisi error path: yo'q manzil. Status to'rt yuz to'rt, xabar cannot get nope. Npm test app controller: ikkalasi yashil."
   ],
   [
    "d",
    "Xulosa: <b>so'rov → status va tana</b>; bot handler'i ham, sayt route'i ham bir xil sinaladi",
    "Xulosa: HTTP test so'rov yuboradi va statusni, tanani tekshiradi. Bot handler'i ham, sayt route'i ham bitta usulda sinaladi: kirish beriladi, chiqish solishtiriladi. Kattaroq API'da shu qolip har route uchun takrorlanadi. Endi tekshirib olaylik."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Ilovada faqat GET / route'i bor. Test GET /nope yubordi. res.status va res.body.message nima bo'ladi?",
  "q": "HTTP testni ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Ilovada faqat bitta route bor, ildiz. Test yo'q manzilga, nope'ga so'rov yubordi. Status va xabar nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Nest yo'q manzilga o'zi to'rt yuz to'rt qaytaradi, tanasida message: cannot get nope. Bu kodingizdagi xato emas, kutilgan error path, va test uni aynan shunday kutadi. Demak, yo'q manzil beshyuz emas, to'rt yuz to'rt: mijoz xatosi, server xatosi emas.",
  "okShort": "Yo'q route → Nest'ning o'zi 404 va <code>Cannot GET /nope</code> — bu kutilgan error path.",
  "hint": "Brauzerda yo'q sahifani ochsangiz qaysi raqam chiqadi? Nest ham shuni qaytaradi.",
  "demak": "Yo'q manzil — 404, mijoz xatosi; 500 — server xatosi. Test ikkalasini farqlaydi.",
  "correct": 3,
  "opts": [
   "200 va { ok: true } — Nest ildizga yo'naltiradi",
   "500 — route topilmagani server xatosi",
   "Test yiqiladi — supertest yo'q manzilni yubormaydi",
   "404 va Cannot GET /nope — Nest'ning o'z javobi"
  ],
  "wrong": {
   "0": "Nest yo'naltirmaydi: route yo'q bo'lsa — 404.",
   "1": "500 — kod ichidagi xato; yo'q route oddiy 404.",
   "2": "supertest istalgan manzilga yuboradi; javob 404 keladi, test yiqilmaydi."
  }
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: AI edge va xato testlarini yozdi — ikki to'plam, ikkalasi yashil; endi ularni qabul qilamiz",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>edge va xato testlarini AI yozadi, siz qabul qilasiz</b>",
    "Jest birinchi darsidagi kabi oxirgi bosqich AI bilan. Farqi: bu safar AI happy path emas, edge va xato testlarini yozadi, ya'ni bugungi mavzuni. Biz ikki xil AI'ga bitta oddiy prompt berdik va natijani olib keldik."
   ],
   [
    "b",
    "Prompt: <b>«place va telefon tekshiruvi uchun edge case va xato testlar yoz»</b> — ishorasiz",
    "Prompt oddiy: order service'dagi place funksiyasi va telefon raqami tekshiruvi uchun edge case va xato holatlariga jest testlar yoz, npm test yashil bo'lsin. Rejects, await, chegara, mock, bu so'zlarning hech biri promptda yo'q. Har AI loyihaning alohida nusxasida ishladi."
   ],
   [
    "c",
    "Natija yaxshi: <b>50 va 42 test, kodga tegmadi</b>, <code>rejects</code> va <code>await</code> to'g'ri, «bo'lmasligi kerak» testlari bor",
    "Natija yaxshi ko'rinadi. Ikkalasi faqat test fayllarini qo'shdi, kodga tegmadi. Birinchisi ellik, ikkinchisi qirq ikkita test, hammasi yashil. Ikkalasi ham promise xatosiga rejects va await yozdi, jarayon qulamadi. Ikkalasi ham xatodan keyin update ketmaganini tekshirdi."
   ],
   [
    "d",
    "Lekin: ikkalasi <b>qoidani ajratmadi</b> va <b>probelli raqam rad etilishini «to'g'ri» deb yozdi</b>",
    "Lekin ikki narsa. Ikkalasi ham telefon qoidasini ajratmadi: uni butun handler orqali, to'rtta servisni soxtalab sinadi, birinchisida bir yuz qirq to'qqiz qator. Va ikkalasi ham probel bilan yozilgan raqam rad etilishini to'g'ri deb test qildi, biz esa buni oltinchi ekranda xato deb topgan edik."
   ],
   [
    "e",
    "Xulosa: <b>yashil hali tekshiruv emas</b>; buzib ko'ramiz — va yana bir savol: test qoidani sinaydimi, kodni muhrlaydimi",
    "Xulosa: yashil hali tekshiruv emas, keyingi ekranda beshta buzish bilan tekshiramiz. Va yangi savol tug'ildi: AI yozgan test qoidani sinaydimi, yoki kod hozir qanday ishlasa, shuni muhrlaydimi. Probelli raqam testi ikkinchisi."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Beshta buzish — uchala to'plam hammasini ushladi; oltinchi «buzilish»ni esa buzib bo'lmaydi: AI probelli raqam rad etilishini muhrlab qo'ygan",
  "seg": [
   [
    "a",
    "Beshta buzish — <b>bugungi beshta qoida</b>: regex chegarasi, <code>&lt;=</code>, tartib, xabar, bo'sh savat",
    "Beshta buzish oldik, har biri bugungi bitta qoida. Regex'da to'qqizni sakkizga. Kichikni kichik yoki tengga. Update'ni ombor tekshiruvidan oldinga. Xato xabarini o'zgartirish. Bo'sh savat tekshiruvini olib tashlash. Uchala to'plamni sinadik: bizniki va ikki AI."
   ],
   [
    "b",
    "Natija: <b>uchala to'plam beshalasini ushladi</b> — bu safar AI xato yo'lini yaxshi yozdi",
    "Natija: uchala to'plam beshala buzilishni ushladi. Bizning yigirma besh testimiz har buzilishda bittadan qizardi. Birinchi AI xabar o'zgarganda uchta, tartib buzilganda ikkita test bilan sezdi. Ikkinchi AI ham hammasini sezdi. Bu safar AI xato yo'lini yaxshi yozdi, buni tan olamiz."
   ],
   [
    "c",
    "Oltinchi «buzilish» jadvalda yo'q: <b>AI probelli raqam rad etilishini muhrladi</b> — <code>replace</code> tuzatishi uning testini qizartiradi",
    "Lekin bitta narsa jadvalga sig'maydi, chunki uni buzib bo'lmaydi: probel. Ikkala AI probelli raqam rad etilishini test qilib muhrladi. Siz oltinchi ekrandagi replace bilan tuzatsangiz, ularning testi qizaradi. Test qoidani emas, hozirgi kodni qo'riqlayapti. Mijoz odati haqida AI bilmaydi."
   ],
   [
    "d",
    "Xulosa: AI testi <b>xatoni ushlaydi, lekin hozirgi xulqni ham muhrlaydi</b> — har testdan «bu qoidami?» deb so'rang",
    "Xulosa: AI yozgan test ikki narsa qiladi. Xatoni ushlaydi, bu yaxshi. Va hozirgi xulqni, shu jumladan xatoni ham, muhrlab qo'yadi. Har testni o'qib so'rang: bu qoidami, yoki kod shunchaki hozir shunday ishlaydimi. Endi o'z AI'ingiz bilan sinab ko'rasiz."
   ]
  ]
 },
 "22": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga aniq shartli prompt bering, keyin to'rt tekshiruv va uchta buzish",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>shartlari aniq prompt</b> — <code>setStatus</code> ning xato yo'li uchun",
    "Endi navbat sizga. O'z AI'ingizga test yozdirasiz, mavzu: order service'dagi set status funksiyasi, uning xato yo'li. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>to'rt tekshiruv</b> — diff, <code>await</code> + <code>rejects</code>, <code>not.toHaveBeenCalled</code>, «qoidami?»",
    "Birinchi qadamda promptni berasiz. Ikkinchisida natijani tekshirasiz: git diff stat'da faqat spec fayl, promise xatosida await va rejects, xatodan keyin increment chaqirilmaganini tekshiradigan test bor. Va har testdan so'rang: bu qoidami, yoki kod hozir shunday ishlaydimi."
   ],
   [
    "c",
    "3–4-qadam: <b>uchta buzish</b> — hammasi qizarsin; isbot — natija",
    "Uchinchi qadamda set status'ni uch joyda navbat bilan buzasiz: bekor tekshiruvini olib tashlang, increment'ni tekshiruvdan oldinga ko'chiring, xabarni o'zgartiring. Har biridan keyin npm test va git checkout. Qizarmagan joyga AI'dan test so'rang. Isbot maydoniga natijani yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan xato yo'li testini ikki qismi bo'yicha qabul qilasiz: xato chiqdi va keyingi qadam bo'lmadi."
   ]
  ],
  "steps": [
   {
    "t": "Prompt",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga",
     "npm test"
    ],
    "exp": "PASS"
   },
   {
    "t": "To'rt tekshiruv",
    "cmds": [
     "git diff --stat — faqat .spec.ts",
     "rejects oldida await",
     "expect(manager.increment).not.toHaveBeenCalled() bor",
     "har test «qoida»mi yoki «kod hozir shunday»mi — ikkinchisini belgilang"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Uch buzish",
    "cmds": [
     "order.service.ts setStatus: if (order.status === 'CANCELLED') tekshiruvini olib tashlang",
     "increment siklini tekshiruvdan oldinga ko'chiring",
     "allaqachon bekor qilingan → bekor — har biridan keyin npm test va git checkout -- src/api/order/order.service.ts"
    ],
    "exp": "har biri ✕"
   },
   {
    "t": "Qizarmagan joy",
    "cmds": [
     "AI'ga: «<buzish> ni hech bir test ushlamadi — shu qoidaga test yoz»",
     "3-qadamni qaytaring"
    ],
    "exp": "uchalasi ✕"
   }
  ],
  "proof": {
   "label": "Uch buzishning natijasi",
   "placeholder": "masalan: uchalasi qizardi · yoki: increment tartibi — avval qizarmadi, test qo'shdim",
   "re": "(qizar|fail|✕|uchala|hammasi|test qo'sh)",
   "flags": "i",
   "wrong": "Har buzishdan keyin npm test natijasini yozing."
  },
  "trouble": [
   [
    "git diff --stat da order.service.ts ham bor",
    "AI kodni o'zgartirdi — git checkout -- src/api/order/order.service.ts, «Tegma» bandini takrorlang"
   ],
   [
    "Natija umuman yo'q, Node.js v24…",
    "AI toThrow ni promise'da ishlatgan yoki await yo'q — 11, 13-ekran; satrni qo'lda tuzating"
   ],
   [
    "increment tartibi buzilishida hammasi ✓",
    "«bo'lmasligi kerak» testi yo'q — not.toHaveBeenCalled so'rang (15-ekran)"
   ],
   [
    "order.items undefined",
    "mock'dagi buyurtmada items: [] yo'q — mock'ga items bering"
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4b-03 · «Edge cases va error path»",
  "title": "O'quvchi darsi: KitobShop orderTotal, «shumtaka mijoz» va guard — siz bilgan yo'lning kichik, bazasiz varianti",
  "seg": [
   [
    "a",
    "m4b-03 — 21 ekran: <b><code>orderTotal</code> ga guard</b>, shumtaka mijoz 0 va manfiy beradi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m4b-03, yigirma bir ekran. O'quvchi Jest birinchi darsidagi order total funksiyasiga guard qo'shadi: nol, manfiy, matn kelsa xato tashlaydi. Dars buni shumtaka mijoz misolida tushuntiradi: g'alati buyurtma beradigan mijoz. Baza yo'q, promise yo'q, hammasi sinxron."
   ],
   [
    "b",
    "O'quvchi so'zlari: <b>shumtaka — edge case, guard — <code>if</code> <code>throw</code> <code>return</code></b>, o'rab berish — <code>expect(() =&gt; …)</code>",
    "O'quvchi darsidagi so'zlar: shumtaka mijoz bu edge case. Guard bu if, throw, return. O'rab berish bu expect ichidagi qavs strelka. Kartochkadagi «jim buzilish» esa yashirin buzilish: xatosiz noto'g'ri natija. Sinfda so'zni atamasi bilan birga ayting."
   ],
   [
    "c",
    "Siz qo'shasiz: <b>ikki qismli test, <code>() =&gt;</code> siz natija, chegaraning ikki tomoni</b>",
    "Darsga siz qo'shadigan narsalar. Guard testida ikki qism: xato chiqdi va hisob bajarilmadi. O'rab bermasa nima bo'lishini bir marta haqiqiy terminalda ko'rsating: natija yo'q, bugun o'zingiz ko'rgansiz. Uyga vazifada apply coupon'ning aynan nol va aynan yuz chegaralarini sinattiring."
   ],
   [
    "d",
    "Xulosa: o'quvchi «test natijasi chiqmayapti» desa — <b><code>() =&gt;</code> yo'q</b>; pastda uch vaziyat va savollar",
    "Xulosa: o'quvchi test natijasi umuman chiqmayapti desa, birinchi expect ichidagi o'ramga qarang. Did not throw chiqsa, guard yo'q yoki shart qiymatni o'tkazgan. Pastda uch vaziyat va o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Mijoz «+998 90 123 45 67» yozdi, bot «Raqam noto'g'ri» dedi. Bu qaysi yo'l?",
    "o": [
     "Edge case — qoida mijoz odatidan tor",
     "Error path — kod ataylab xato berdi, to'g'ri",
     "Happy path — raqam to'g'ri, bot ham",
     "Xato emas — mijoz noto'g'ri yozgan"
    ],
    "c": 0,
    "e": "Haqiqiy raqam, qoida tor.",
    "s": 5
   },
   {
    "q": "const PHONE service ichida, eksport yo'q. Testda nima qilasiz?",
    "o": [
     "Butun botni ko'tarib, Telegram xabarini soxtalaymiz",
     "Qoidani alohida funksiyaga ajratib, uni sinaymiz",
     "Regex'ni testga nusxalab, o'sha yerda sinaymiz",
     "Service'ni any qilib, PHONE ga kiramiz"
    ],
    "c": 1,
    "e": "Bitta joy, bot ham test ham shuni chaqiradi.",
    "s": 3
   },
   {
    "q": "place ombor xatosini transaction ichida otadi. Qaysi shakl to'g'ri?",
    "o": [
     "expect(() => service.place(u, c)).toThrow('…') — o'ram bilan",
     "expect(service.place(u, c)).toThrow('…')",
     "await expect(service.place(u, c)).rejects.toThrow('…')",
     "expect(await service.place(u, c)).toThrow('…') — await ichida"
    ],
    "c": 2,
    "e": "Promise xatosi — rejects va await.",
    "s": 10
   },
   {
    "q": "Promise xatosiga toThrow yozildi. npm test nima ko'rsatadi?",
    "o": [
     "FAIL — xabar mos kelmadi",
     "PASS — xato ushlanmadi, test o'tdi",
     "FAIL — toThrow promise'ni darhol rad etadi",
     "Natija yo'q — jarayon quladi, Node.js v24"
    ],
    "c": 3,
    "e": "Xato promise'da, hech kim ushlamadi.",
    "s": 11
   },
   {
    "q": "expect(service.place(u, c)).rejects.toThrow('…') — await yo'q, xabar noto'g'ri. Natija?",
    "o": [
     "Natija yo'q — Jest xatoni testga bog'lay olmadi",
     "FAIL — Expected / Received farqi aniq ko'rsatiladi",
     "PASS — rejects promise'ni o'zi kutib oladi",
     "TypeScript xato — rejects oldida await shart"
    ],
    "c": 0,
    "e": "Test promise'ni kutmay tugadi.",
    "s": 13
   },
   {
    "q": "Xato yo'li testida «xato chiqdi»dan tashqari nima tekshiriladi?",
    "o": [
     "Xato necha millisekundda chiqqani — tezlik",
     "Xatodan keyin UPDATE chaqirilmagani",
     "Xato stack'ida qaysi fayl borligi",
     "Xato obyekti Error turida ekani"
    ],
    "c": 1,
    "e": "«Nima bo'lmasligi kerak» — not.toHaveBeenCalled.",
    "s": 15
   },
   {
    "q": "Mock'da omborda 1 ta va 10 ta sinalgan. Kodda < → <= buzildi. Testlar?",
    "o": [
     "Ikkalasi FAIL — chegara buzilgani uchun",
     "Ombor testi FAIL, happy PASS",
     "Ikkalasi PASS — chegara sinalmagan",
     "Natija yo'q — mock qulaydi"
    ],
    "c": 2,
    "e": "Farq faqat aynan teng bo'lganda.",
    "s": 16
   },
   {
    "q": "supertest bilan GET /nope yuborildi, route yo'q. Javob?",
    "o": [
     "500 — server route topa olmadi",
     "200 — Nest ildizga yo'naltiradi",
     "Test yiqiladi — manzil mavjud bo'lmagani uchun",
     "404 va Cannot GET /nope — Nest javobi"
    ],
    "c": 3,
    "e": "Nest'ning o'z 404 javobi — kutilgan error path.",
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
//  MENTOR KURSI · Jest-2 «Xato yo'li: bot noto'g'ri kirishda to'g'ri buziladimi» (v2, F-1104-19)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/12-Jest2-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar jest2-start (= jest1-done) → jest2-done
//  Kod va terminal: 03b-kod.gen.jsx (dev/jest2-kod.py — repo teglari va manba/jest2v2-out/ dan aynan, satr raqami bilan)
//  AI tajribasi: manba/jest2v2-ai/ (ai1 Opus 50 test · ai2 Haiku 42 test · mutatsiya-men/ai.txt)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest2/parts/*.jsx > JestEdgeMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-jest-02-edge-cases-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "Xato yo'li: bot noto'g'ri kirishda to'g'ri buziladimi";
const JC = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', jest: '#99425B', pass: '#15803D', fail: '#C2410C', happy: '#1F7A4D', edge: '#B45309', err: '#C2362B' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.spec\.ts$/.test(f) ? JC.jest : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
  tg: 'src/api/telegram/telegram.service.ts', kb: 'src/api/telegram/keyboards.ts', tx: 'src/api/telegram/texts.ts',
  txs: 'src/api/telegram/texts.spec.ts', kbs: 'src/api/telegram/keyboards.spec.ts',
  ph: 'src/api/telegram/phone.ts', phs: 'src/api/telegram/phone.spec.ts',
  ord: 'src/api/order/order.service.ts', ors: 'src/api/order/order.service.spec.ts',
  app: 'src/api/app.controller.ts', apps: 'src/api/app.controller.spec.ts',
  cat: 'src/api/catalog/catalog.service.ts', pkg: 'package.json',
};
const BASE_FILES = ['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.app, 'src/api/cart/', F.cat, F.ord, 'src/api/user/', F.tg, F.kb, F.tx, F.txs, F.kbs, 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, 'README.md'];
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
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) /* F-1120-02 (M52): act */ };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['rejects to throw', 'rejects.toThrow'], ['to throw', 'toThrow'], ['it each', 'it.each'], ['is phone', 'isPhone'],
  ['phone spec ts', 'phone.spec.ts'], ['phone ts', 'phone.ts'], ['order service spec ts', 'order.service.spec.ts'], ['order service ts', 'order.service.ts'],
  ['telegram service ts', 'telegram.service.ts'], ['app controller spec ts', 'app.controller.spec.ts'], ['app controller', 'app.controller'],
  ['mock resolved value', 'mockResolvedValue'], ['not to have been called', 'not.toHaveBeenCalled'], ['to have been called times', 'toHaveBeenCalledTimes'],
  ['jest fn', 'jest.fn'], ['data source', 'DataSource'], ['create nest application', 'createNestApplication'], ['before all', 'beforeAll'], ['after all', 'afterAll'],
  ['git diff stat', 'git diff --stat'], ['npm i minus D supertest', 'npm i -D supertest'], ['types supertest', '@types/supertest'], ['set status', 'setStatus'],
  ['npm test order service', 'npm test -- order.service'], ['npm test phone', 'npm test -- phone'], ['npm test app controller', 'npm test -- app.controller'],
  ['jest ikki start', 'jest2-start'], ['Object is', 'Object.is'], ['cannot get nope', 'Cannot GET /nope'], ['did not throw', 'did not throw'],
  ['plus to\'qqiz to\'qqiz sakkiz', '+998'], ['m4b-03', 'm4b-03'], ['Test module', 'Test.createTestingModule'],
];
DIGITS.unshift(["o'ttiz yettinchi satr", '37-satr'], ["o'ttiz oltinchi satr", '36-satr'], ["yigirma to'rtinchi satr", '24-satr'], ["yigirma besh va yigirma oltinchi satr", '25–26-satr'],
  ["bir yuz ellik yettinchi satr", '157-satr'], ["o'n ikkinchi satr", '12-satr'], ["o'n oltinchi satr", '16-satr'], ["yigirma uchinchi satr", '23-satr'], ["sakkizinchi satr", '8-satr'], ["to'rtinchi satr", '4-satr'], ["ellik birinchi satr", '51-satr'],
  ["bir yuz qirq to'qqiz", '149'], ['yigirma besh', '25'], ['ellik', '50'], ['qirq ikki', '42'], ['bir yuz ming', '100 000'], ["to'qqizdan o'n uchtagacha", '9–13'], ["to'qqizni sakkizga", '9 ni 8 ga'],
  ["o'n ikki daqiqa", '12 daqiqa'], ["o'n to'rtta", '14 ta'], ['sakkizta', '8 ta'], ["to'qqizta", '9 ta'], ['yigirma bir', '21']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/Received function did not throw/g, /Cannot GET/g, /Expected substring/g, /Received message/g);

// Kod rang beruvchi (Jest-1 dan). Matn — KOD (03b-kod.gen.jsx), HTML'siz.
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
// Jest terminali: PASS yashil, FAIL qizil, ✓ / ✕, ● sarlavha, Expected / Received, > satr, Node.js qulashi qizil
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*○/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*(Expected|- Expected|Expected substring)/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(Received|\+ Received|Received string|Received message|\+ )/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/No tests found|^Error:|Error \[|JestAssertionError|Cannot find|\[chiqish kodi: 1\]|Node\.js v/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:.*failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outFind = (k, re) => { const L = outLines(k); const i = L.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
// outPick — faqat kerakli qatorlar (uzun qulash chiqishlari uchun): keep(l) true bo'lganlari
const outPick = (k, keep, meta = {}) => outLines(k).filter(keep).map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? JC.termEr : JC.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const kod = (k, ids = {}, from, to, edit = {}) => KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: tsLine(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  return [{ ...base, gone: true }, { h: tsLine(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
});
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(F.ph, F.phs, F.ors, F.apps), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;

function AiReply({ who, prompt, said, diff, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
    {diff && <pre className="df">{diff}</pre>}
  </div>;
}
const Card = ({ c = T.accent, h, children, hl, dim, style }) => <div className={`mk-box${hl ? ' hl' : ''}`} style={{ '--c': c, opacity: dim ? 0.4 : 1, transition: 'opacity .3s', ...(style || {}) }}><h4>{h}</h4>{children}</div>;

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

// Buzib tekshirish jadvali (manba/jest2v2-ai/mutatsiya-men.txt, mutatsiya-ai.txt — aynan): qizargan testlar soni
const MUT = [
  ['B1', "regex 9–13 → 8–13 raqam (8 ta raqam o'tadi)", [1, 1, 2]],
  ['B2', 'place: stock < qty → stock <= qty', [1, 1, 1]],
  ['B3', 'place: UPDATE ombor tekshiruvidan OLDIN', [1, 2, 1]],
  ['B4', "xabar «Telefon raqami yo'q» → «Raqam yo'q»", [1, 3, 3]],
  ['B5', "place: bo'sh savat tekshiruvi olib tashlandi", [1, 1, 1]],
];
const MUT_COLS = [['Men', 25], ['1-AI', 50], ['2-AI', 42]];
function MutTable({ rows = 5, hlCol, hlRow }) {
  return <table className="mut"><thead><tr><th>{t("Buzish", "Поломка")}</th>{MUT_COLS.map(([n, c], i) => <th key={n} className={hlCol === i ? 'hl' : ''}>{n}<small>{c} test</small></th>)}</tr></thead>
    <tbody>{MUT.slice(0, rows).map(([id, d, v], r) => <tr key={id} className={hlRow === r ? 'hl' : ''} style={{ animation: `mk-up .35s ${r * 0.06}s ease both` }}><td><b>{id}</b> {d}</td>{v.map((x, i) => <td key={i} className={`${x === 0 ? 'zero' : 'red'}${hlCol === i ? ' col' : ''}`}>{x}</td>)}</tr>)}</tbody></table>;
}

// Jest-2 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.j2-15 .flow{display:grid;grid-template-columns:1fr 26px 1fr 26px 1fr 26px 1fr;align-items:stretch;background:#fff;border:1px solid #D7DCE3;border-radius:14px;padding:14px}
.j2-15 .st{border:1.5px solid #D7DCE3;border-radius:10px;padding:10px;display:grid;gap:6px;align-content:start;background:#F8FAFC;min-width:0}
.j2-15 .st h6{margin:0;font:700 11px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
.j2-15 .st .ln{font:11.5px ui-monospace,Menlo,Consolas,monospace;color:#6B7280}
.j2-15 .ar{display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:20px}
.j2-15 .st.x{border-color:#DC2626;background:#FEF2F2}
.j2-15 .st.off{border-style:dashed;background:#fff}
.j2-15 .st.off .zm{color:#6B7280}
.j2-15 .st .z-tag{white-space:normal}
.j2-15 .as{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.j2-15 .a{border:2px solid #C2410C;border-radius:12px;background:#fff;padding:10px 12px;display:grid;gap:6px;align-content:start}
.j2-15 .a>b{color:#C2410C;font-size:14px}
.j2-15 .a .zm{background:#F1F3F6;border-radius:6px;padding:6px 8px;white-space:pre-wrap}
.j2-15 .a small{color:#6B7280;font-size:12.5px}
.j2-5 td.c,.j2-5 th.c,.j2-6 td.c,.j2-6 th.c{text-align:center}
.j2-5 .grp td{background:#F8FAFC;font:700 11.5px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
.j2-5 .p,.j2-6 .p{color:#15803D;font-weight:700}.j2-5 .f,.j2-6 .f{color:#DC2626;font-weight:700}
.j2-nl{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;text-align:center;font:13px ui-monospace,Menlo,Consolas,monospace}
.j2-nl div{border-radius:6px;padding:6px 0;background:#DCFCE7;color:#15803D;font-weight:700}
.j2-nl div.x{background:#FEE2E2;color:#991B1B}
.j2-nl small{display:block;font:11px system-ui,sans-serif;font-weight:400;color:inherit;opacity:.85}
.j2-6 tr.tor td{background:#FFF7ED}.j2-6 tr.keng td{background:#EFF6FF}
.j2-6 .lab{font:700 11px system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;border-radius:999px;padding:1px 7px;white-space:nowrap}
.j2-6 .lab.o{background:#FFEDD5;color:#C2410C}.j2-6 .lab.b{background:#DBEAFE;color:#1D4ED8}
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
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
.mk-panel .jp{background:${JC.pass};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.mk-panel .jf{background:${JC.fail};color:#fff;font-weight:700;padding:0 5px;border-radius:3px}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${JC.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${JC.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${JC.ai}}
.ai-card .sd code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px}
.ai-card .df{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.codeInk};background:${JC.term};white-space:pre;overflow-x:auto}
.mut{width:100%;border-collapse:separate;border-spacing:0 5px;font-size:13.5px}
.mut th{font:700 12px ${SANS};color:${T.ink2};text-align:center;padding:4px 8px}
.mut th:first-child{text-align:left}
.mut th small{display:block;font-weight:500;color:${T.ink3}}
.mut th.hl{color:${T.accent}}
.mut td{padding:8px 10px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};text-align:center;font:700 14px ${MONO}}
.mut td:first-child{text-align:left;font:13px ${SANS};border-left:1px solid ${T.line};border-radius:10px 0 0 10px}
.mut td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.mut td.zero{background:#FFE4DA;color:${T.accent}}
.mut td.red{color:${T.green}}
.mut td.col{box-shadow:inset 0 0 0 2px ${T.accent}}
.mut tr.hl td{border-color:${T.accent}}
.path{border:2px solid var(--c);border-radius:14px;padding:12px 14px;background:${T.paper};transition:all .35s;display:grid;gap:6px;align-content:start}
.path.dim{opacity:.35}
.path.hl{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.path h4{margin:0;font:800 14px ${SANS};color:var(--c)}
.path .ex{font:13px ${MONO};background:#F4F5F7;border-radius:8px;padding:5px 8px;color:${T.ink}}
.path .q{font-size:13.5px;color:${T.ink2};line-height:1.45}
.path .t{font:600 12.5px ${SANS};color:var(--c);border-top:1px dashed ${T.line};padding-top:6px;margin-top:2px}
.fl-grid{display:grid;grid-template-columns:minmax(0,200px) minmax(0,1fr);gap:10px;align-items:center}
.fl-tests{display:grid;gap:8px}
.fl-row{display:grid;grid-template-columns:20px minmax(0,1fr) 150px;gap:8px;align-items:center}
.fl-ar{font:700 18px ${MONO};color:${T.ink3};text-align:center}
.fl-box{border:2px solid var(--c);border-radius:12px;padding:8px 10px;background:${T.paper};transition:all .35s}
.fl-box.hl{background:#FFF0EB}
.fl-box small{display:block;font:600 11px ${MONO};color:${T.ink3};margin-bottom:3px}
.fl-box b{font:700 13.5px ${MONO};color:${T.ink}}
.fl-v{font:700 13px ${SANS};border-radius:10px;padding:8px 10px;text-align:center;animation:mk-up .4s ease both}
.fl-v.ok{background:#E3F5EC;color:${T.green}}
.fl-v.bad{background:#FFE4DA;color:${T.accent}}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: 5 fayl, 25 test (jest2v2-out/12)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', 'Telefon: edge case', 'Buyurtma: error path', "Chegara va «bo'lmasligi kerak»", 'HTTP test va AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0] }, { hl: [1, 2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + Jest qatori (BotMap, parts/02e-bot.jsx); reja pastda.
// Bugungi uch joy: telefon qoidasi (telegram · phone.ts), buyurtma xatolari (order · baza o'rniga mock), sayt API (supertest)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const J2_FILES = ['spec: phone · order.service · app.controller'];
const S1M = [
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' }, note: { products: 'mock: findOne → Kolonka, stock 1' } },
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} tgSub="phone.ts" {...m} tag={t("Bugungi darsning rasmi — bot noto'g'ri kirishda to'g'ri buziladimi", 'Картина урока — правильно ли ломается бот на неверном вводе')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Uch yo'l: happy path, edge case, error path (umumiy tushuncha — F-1104 foydalanuvchi talabi)
// ============================================================
const PATHS2 = [
  { k: 'happy', c: JC.happy, h: 'Happy path — kutilgan kirish', ex: ['+998901234567', 'omborda 10 ta'], q: "Buyurtma qabul qilindi. Jest-1 ning hamma testi shu yo'lda edi.", t: "test: natija to'g'rimi" },
  { k: 'edge', c: JC.edge, h: 'Edge case — qoidaning chegarasi', ex: ['+998 90 123 45 67', '9 ta raqam', 'omborda aynan 2 ta'], q: "Kod xato bermaydi — lekin javobi to'g'rimi?", t: "test: chegarada ham to'g'rimi" },
  { k: 'err', c: JC.err, h: 'Error path — kod ataylab xato beradi', ex: ["telefon yo'q", "savat bo'sh", 'omborda 1 ta, savatda 2'], q: "Xato — to'g'ri xulq. Qaysi xabar? Keyin nima bo'lmaydi?", t: "test: xato chiqdi va keyingi qadam bo'lmadi" },
];
const S2 = mkS(2, [{ on: 0 }, { on: 1 }, { on: 2 }, { on: -1, all: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <><div className="pg-three">
    {PATHS2.map((x, i) => <div key={x.k} className={`path${seg.on === i ? ' hl' : ''}${seg.on >= 0 && seg.on !== i ? ' dim' : ''}`} style={{ '--c': x.c }}>
      <h4>{x.h}</h4>{x.ex.map((e) => <div key={e} className="ex">{e}</div>)}<div className="q">{x.q}</div>{seg.all && <div className="t">{x.t}</div>}
    </div>)}
  </div>
    {/* F-1120-02 (M51): xulosada darsning rasmi — bugungi uch yo'l botning qaysi joyida sinaladi (telegram · phone.ts, order); testlar hali yozilmagan */}
    {seg.all && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} tgSub="phone.ts" on={['telegram', 'order']} jest={{ steps: [['happy path', ''], ['edge case', ''], ['error path', '']], res: '?', badge: t('bugun yozamiz', 'пишем сегодня') }} max={1} tag={t("Har funksiyaga uch yo'lning testi — bugun uchalasini yozamiz", 'Тесты трёх путей для каждой функции — сегодня пишем все три')} /></div>}
  </>} />;
}

// ============================================================
//  3 · Telefon qoidasi yashirin — alohida funksiyaga (jest2-start 12, 155–157 · phone.ts · jest2-done 10, 155–156)
// ============================================================
const S3 = mkS(3, [{ v: 'old', f: ['p', 'u'] }, { v: 'old', f: ['p'] }, { v: 'new' }, { v: 'use' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'old' && <Ide files={compact(FILES(), F.tg)} active={F.tg}>
      <CodePanel file="telegram.service.ts" lines={[...kod('TS_PHONE', { 12: 'p' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('TS_ONTEXT', { 155: 'u', 156: 'u', 157: 'u' })]} focus={seg.f} />
    </Ide>}
    {seg.v === 'new' && <Code k="PHONE_OLD" files={FILES(F.ph)} active={F.ph} fresh={F.ph} ids={{ 2: 'r', 4: 'i' }} focus={['r', 'i']} />}
    {seg.v === 'use' && <Ide files={compact(FILES(F.ph), F.tg)} active={F.tg}>
      <CodePanel file="telegram.service.ts · jest2-done" lines={[...kod('TS_IMPORT_NEW', { 10: 'i' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('TS_ONTEXT_NEW', { 155: 'u', 156: 'u' }, 153, 158)]} focus={['i', 'u']} />
    </Ide>}
  </>} />;
}

// ============================================================
//  4 · Tekshiruv 1 — probel bilan yozilgan raqam (jest2v2-out/02)
// ============================================================
function Screen4(p) {
  return MC(p, 4, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="phone.ts" lines={kod('PHONE_OLD', { 2: 'r', 4: 'i' })} focus={['r', 'i']} />
      <div className="mk-pair">{t("Aziza yozdi: ", "Азиза написала: ")}<code>+998 90 123 45 67</code></div>
    </div>,
    after: <Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={out('02', outFind('02', /✕/), outFind('02', /Received:/))} er />,
  });
}

// ============================================================
//  5 · Edge testlar: it.each (kod-02-phone.spec.ts · jest2v2-out/02)
// ============================================================
const T5 = out('02', outFind('02', /^FAIL/), outFind('02', /^Tests:/));
// F-1109-06: xulosa — FAIL parchasi o'rniga it.each jadvalining o'zi (jest2v2-out/02) va qoida raqamlar o'qida
const ROWS5 = [
  ['g', "it.each — to'g'ri raqamlar", 'it.each — правильные номера'],
  ['r', '+998901234567', "to'g'ri raqam", 'true', 'true', true],
  ['r', '998901234567', "to'g'ri raqam", 'true', 'true', true],
  ['g', "it.each — noto'g'ri kirishlar", 'it.each — неверные вводы'],
  ['r', '12345678', '8 ta raqam — qisqa', 'false', 'false', true],
  ['r', '+99890123456789', '14 ta raqam — uzun', 'false', 'false', true],
  ['r', 'abc', 'harf', 'false', 'false', true],
  ['r', "''", "bo'sh", 'false', 'false', true],
  ['g', "it — mijozning odati", 'it — привычка клиента'],
  ['r', '+998 90 123 45 67', 'mijoz probel bilan yozadi', 'true', 'false', false],
];
function Each5() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("phone.spec.ts — bitta qoida, yetti kirish · npm test -- phone", "phone.spec.ts — одно правило, семь вводов · npm test -- phone")}</p>
      <table className="z-tbl j2-5"><tbody>
        <tr><th>{t("kirish", "ввод")}</th><th>{t("test nomi", "имя теста")}</th><th className="c">{t("kutilgan", "ожидалось")}</th><th className="c">isPhone</th><th className="c">test</th></tr>
        {ROWS5.map((r, i) => r[0] === 'g' ? <tr key={i} className="grp"><td colSpan={5}>{t(r[1], r[2])}</td></tr>
          : <tr key={i} className={r[5] ? '' : 'bad'}><td>{r[1]}</td><td>{r[2]}</td><td className="c">{r[3]}</td><td className="c">{r[5] ? r[4] : <b>{r[4]}</b>}</td><td className={'c ' + (r[5] ? 'p' : 'f')}>{r[5] ? '✓' : '✕'}</td></tr>)}
      </tbody></table>
      <span className="z-mut">Tests: 1 failed, 6 passed, 7 total</span>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Qoida: ", "Правило: ")}<span className="zk">/^\+?\d{'{'}9,13{'}'}$/</span>{t(" — raqamlar soni", " — количество цифр")}</p>
      <div className="j2-nl">
        <div className="x">8<small>{t("qisqa", "коротко")}</small></div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div className="x">14<small>{t("uzun", "длинно")}</small></div><div className="x">␣<small>{t("probel", "пробел")}</small></div>
      </div>
      <span className="z-mut">{t("8 va 14 — chegaradan bitta tashqarida. Probel qoidada umuman yo'q: mijoz yozadi, regex bilmaydi.", "8 и 14 — на одну за границей. Пробела в правиле нет вовсе: клиент пишет, regex не знает.")}</span>
    </div>
  </div>;
}
const S5 = mkS(5, [{ f: ['a'] }, { f: ['b'] }, { f: ['c'], run: true }, { f: [], run: true, sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {!seg.run && <Code k="SPEC_PHONE_02" files={FILES(F.ph, F.phs)} active={F.phs} fresh={F.phs} ids={{ ...rngIds(4, 6, 'a'), ...rngIds(8, 15, 'b'), ...rngIds(17, 19, 'c') }} focus={seg.f} />}
    {seg.run && !seg.sum && <><CodePanel file="phone.spec.ts" lines={kod('SPEC_PHONE_02', rngIds(17, 19, 'c'), 17, 20)} focus={seg.f} /><Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={T5} er /></>}
    {seg.sum && <Each5 />}
  </>} />;
}

// ============================================================
//  6 · Ichida: tuzatish va «9 ta nol ham o'tadi» (kod-03-phone.ts · jest2v2-out/03, 04)
// ============================================================
const FIX6 = kod('PHONE_OLD', { 4: 'f' }, 1, 4, { 4: KOD.PHONE_NEW.lines[3].t });
const T6A = out('03', outFind('03', /^PASS/), outFind('03', /^Tests:/));
const T6B = out('04', outFind('04', /isPhone — qoida/), outFind('04', /^Tests:/));
// F-1109-06: xulosa — ikki karta o'rniga phone.ts 4-satr diff (kod manbasidan) va bir xil kirishlar eski/yangi qoidada (jest2v2-out/02–04)
function Diff6() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("phone.ts 4-satr — bitta o'zgarish", "phone.ts строка 4 — одно изменение")}</p>
      <div className="z-term"><span className="r">- {KOD.PHONE_OLD.lines[3].t}</span>{'\n'}<span className="g">+ {KOD.PHONE_NEW.lines[3].t}</span></div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Bir xil kirishlar — eski va yangi qoida", "Одни и те же вводы — старое и новое правило")}</p>
      <table className="z-tbl j2-6"><tbody>
        <tr><th>{t("kirish", "ввод")}</th><th className="c">trim()</th><th className="c">replace()</th><th /></tr>
        <tr><td>+998901234567</td><td className="c p">true</td><td className="c p">true</td><td /></tr>
        <tr><td>12345678 · 14 ta · abc · ''</td><td className="c">false</td><td className="c">false</td><td /></tr>
        <tr className="tor"><td>+998 90 123 45 67</td><td className="c f">false</td><td className="c p">true</td><td><span className="lab o">{t("qoida tor edi", "правило было узким")}</span></td></tr>
        <tr className="keng"><td>000000000</td><td className="c p">true</td><td className="c p">true</td><td><span className="lab b">{t("qoida keng — sizning qaroringiz", "правило широкое — ваше решение")}</span></td></tr>
      </tbody></table>
      <span className="z-mut">{t("npm test -- phone: 7 passed → «9 ta nol ham o'tadi» bilan 8 passed. Test qoidani tekshiradi; qoidaning o'zi to'g'rimi — buni siz hal qilasiz.", "npm test -- phone: 7 passed → с «9 нулей тоже проходит» 8 passed. Тест проверяет правило; верно ли само правило — решаете вы.")}</span>
    </div>
  </div>;
}
const S6 = mkS(6, [{ v: 'fix' }, { v: 'nol' }, { v: 'nol', rule: true }, { v: 'sum' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'fix' && <><CodePanel file="phone.ts" lines={FIX6} focus={['f']} /><Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={T6A} /></>}
    {seg.v === 'nol' && <><CodePanel file="phone.spec.ts" lines={kod('SPEC_PHONE_04', rngIds(22, 25, 'n'), 22, 26)} focus={seg.rule ? [] : ['n']} /><Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={T6B} /></>}
    {seg.rule && <div className="n2-warn">{t(<>Test <b>qoidani</b> tekshiradi. Qoidaning o'zi to'g'rimi (9 ta nol — telefonmi?) — bu <b>sizning qaroringiz</b>.</>, <>Тест проверяет <b>правило</b>. Верно ли само правило (9 нулей — телефон?) — это <b>ваше решение</b>.</>)}</div>}
    {seg.v === 'sum' && <Diff6 />}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — phone.ts va phone.spec.ts
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 1, file: F.phs, lines: kod('SPEC_PHONE_02') },
    { step: 2, file: F.ph, lines: kod('PHONE_NEW') },
    { step: 3, file: F.phs, lines: kod('SPEC_PHONE_04') },
  ],
});
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} code={P7.code} tree={FILES(F.ph, F.phs)} />; }

// ============================================================
//  8 · place — uch xato, ikki xil joy (order.service.ts 24–45, jest2-start)
// ============================================================
function Flow8({ hl }) {
  return <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("place() — xato qayerda otiladi", "place() — где бросается ошибка")}</div>
    <div className="fl-grid">
      <div className="fl-box" style={{ '--c': T.blue }}><small>place(user, cart)</small><b>{t("funksiya chaqirildi", "функция вызвана")}</b></div>
      <div className="fl-tests">
        <div className="fl-row"><span className="fl-ar">→</span><div className={`fl-box${hl === 'sync' ? ' hl' : ''}`} style={{ '--c': JC.err }}><small>{t("25–26-satr · darhol, funksiyaning o'zida", "строки 25–26 · сразу, в самой функции")}</small><b>throw «Telefon raqami yo'q» · «Savat bo'sh»</b></div><div className="fl-v bad">{t("sinxron xato", "синхронная ошибка")}</div></div>
        <div className="fl-row"><span className="fl-ar">→</span><div className={`fl-box${hl === 'async' ? ' hl' : ''}`} style={{ '--c': JC.edge }}><small>{t("27-satr: transaction(async …) → 37-satr", "строка 27: transaction(async …) → строка 37")}</small><b>throw «Kolonka: omborda faqat 1 ta qoldi»</b></div><div className="fl-v bad">{t("promise xatosi", "ошибка promise")}</div></div>
      </div>
    </div>
  </div>;
}
const S8 = mkS(8, [{ v: 'code', f: ['s'] }, { v: 'code', f: ['a'] }, { v: 'flow', hl: 'sync' }, { v: 'flow', hl: 'async', sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="ORDER_PLACE" files={FILES()} active={F.ord} ids={{ 25: 's', 26: 's', 36: 'a', 37: 'a', 38: 'a' }} focus={seg.f} from={24} to={38} />}
    {seg.v === 'flow' && <Flow8 hl={seg.hl} />}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — order moduli, ikki xil xato va ikki xil expect (order.service.ts 25–26 · 27→37) */}
    {seg.sum && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} tgSub="phone.ts" on={['order', 'orders', 'products']} tx="rollback" jest={{ steps: [['toThrow()', 'ok'], ['rejects.toThrow()', 'ok']], res: 'pass' }} ro={['order.service.ts:25', t("25–26 darhol → <b>.toThrow()</b> · 27→37 transaction ichida → <b>await … .rejects.toThrow()</b>", "25–26 сразу → <b>.toThrow()</b> · 27→37 внутри transaction → <b>await … .rejects.toThrow()</b>")]} max={1} tag={t("Xatoni sinashdan oldin qayerda otilishini aniqlang — darholmi, promise ichidami", 'Прежде чем проверять ошибку — где она бросается: сразу или внутри promise')} /></div>}
  </>} />;
}

// ============================================================
//  9 · Mock: baza o'rniga soxta manager (kod-05-order.service.spec.ts 8–31)
// ============================================================
const S9 = mkS(9, [{ f: ['m'], to: 16 }, { f: ['d'], to: 16 }, { f: ['t'], to: 31 }, { f: ['r'], from: 44, to: 50 }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    <Code k="SPEC_ORDER_05" files={FILES(F.ph, F.phs, F.ors)} active={F.ors} fresh={F.ors} ids={{ ...rngIds(8, 14, 'm'), 15: 'd', ...rngIds(23, 29, 't'), ...rngIds(45, 50, 'r') }} focus={seg.f} from={seg.from || 1} to={seg.to} />
    {seg.f[0] === 'r' && <div className="mk-rule"><code>mockResolvedValue</code>{t(" — bu testda ", " — в этом тесте ")}<code>findOne</code>{t(" aynan shu mahsulotni qaytaradi: omborda ", " возвращает именно этот товар: на складе ")}<b>1 ta</b>{t(". Baza yo'q, kod haqiqiy.", ". Базы нет, код настоящий.")}</div>}
  </>} />;
}

// ============================================================
//  10 · toThrow va rejects.toThrow — to'rt test yashil (kod-05 33–67 · jest2v2-out/05)
// ============================================================
const T10 = out('05', outFind('05', /^PASS/), outFind('05', /^Tests:/));
const S10 = mkS(10, [{ f: ['s'], to: 42 }, { f: ['a'], from: 44, to: 55 }, { f: ['h'], from: 57, to: 67, run: true }, { run: true, sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {!seg.sum && <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_05', { ...rngIds(34, 38, 's'), ...rngIds(40, 42, 's'), ...rngIds(51, 54, 'a'), 65: 'h', 66: 'h' }, seg.from || 33, seg.to)} focus={seg.f} />}
    {seg.run && <Term title={t("VS Code terminali · npm test -- order.service", "терминал VS Code · npm test -- order.service")} lines={T10} />}
    {seg.sum && <div className="pg-two">
      <Card c={JC.err} h={t("Sinxron xato", "Синхронная ошибка")}><p><code>expect(() =&gt; service.place(…)).toThrow('…')</code>{t(" — funksiya o'raladi, Jest o'zi chaqiradi", " — функция обёрнута, Jest вызывает её сам")}</p></Card>
      <Card c={JC.edge} h={t("Promise xatosi", "Ошибка promise")}><p><code>await expect(service.place(…)).rejects.toThrow('…')</code>{t(" — darhol chaqiriladi, promise kutiladi", " — вызывается сразу, promise ожидается")}</p></Card>
    </div>}
  </>} />;
}

// ============================================================
//  11 · Buzamiz: toThrow promise xatosida — natija yo'q (kod-07 · jest2v2-out/07)
// ============================================================
const T11 = out('07');
const CAUSE11 = ["toThrow o'ramni chaqirdi — place() promise qaytardi", "Shu paytda xato yo'q → Jest «test o'tdi» deb hisobladi", "Xato keyin, promise ichida otildi — hech kim ushlamadi", 'Node butun jarayonni to\'xtatdi: PASS ham, FAIL ham yo\'q'];
function Cause({ items, on, bad }) {
  return <div className="cause">{items.map((x, i) => <div key={i} className={`${i < on ? 'on' : ''}${bad === i ? ' bad' : ''}`}><i>{i + 1}</i><span>{x}</span></div>)}</div>;
}
// F-1120-02 (M52): 1-segment (x) — mentor to'g'ri testdagi 51-satrni (await … .rejects) o'zi bosadi → test sinxron toThrow shakliga o'tadi
const ACT11 = kod('SPEC_ORDER_10', { 51: 'x', 52: 'x', 53: 'x' }, 44, 55).map((l) => (l.n === 51 ? { ...l, h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : l));
const S11 = mkS(11, [{ v: 'act' }, { v: 'code' }, { v: 'run' }, { v: 'cause' }, { v: 'cause', sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={(b) => <Scene11 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 toThrow shakli (natija «?») · 2 jarayon quladi, bo'laklar 1·2 · 3 sabab · 4 xulosa
function Scene11({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'code' : 'act') : seg.v;
  const broken = v !== 'act';
  const mini = <N1Mini><FlowMini tag={t("Test place() ni chaqiradi — xato promise ichida", 'Тест вызывает place() — ошибка внутри promise')}
    boxes={[[t('test · 51-satr', 'тест · строка 51'), broken ? '() => … .toThrow' : 'await … .rejects', broken ? 'bad' : ''], ['place(user, cart)', t('Promise qaytaradi', 'возвращает Promise'), ''], [t('Jest natijasi', 'Результат Jest'), beat >= 2 ? t("PASS/FAIL yo'q", 'нет PASS/FAIL') : '?', beat >= 2 ? 'bad' : '']]}
    res={broken ? [beat >= 2 ? t('Node.js v24.18.0 — jarayon quladi', 'Node.js v24.18.0 — процесс упал') : '?', 'bad'] : null} pins={beat === 2 ? { 0: 1, 2: 2 } : {}} /></N1Mini>;
  return <>
    {v !== 'cause' && <Ide files={compact(FILES(F.ph, F.phs, F.ors), F.ors)} active={F.ors}>
      {v === 'act' && <div onClick={act.onClick}><CodePanel file="order.service.spec.ts" lines={ACT11} focus={['x']} /></div>}
      {v === 'code' && <CodePanel key="c" file={t("order.service.spec.ts · buzilgan", "order.service.spec.ts · сломан")} lines={kod('SPEC_ORDER_07', { 51: 'x', 52: 'x', 53: 'x' }, 44, 55)} focus={['x']} />}
      {v === 'run' && <CodePanel key="r" file={t("order.service.spec.ts · buzilgan", "order.service.spec.ts · сломан")} lines={kod('SPEC_ORDER_07', { 51: 'x' }, 51, 53)} focus={['x']} marks={beat === 2 ? { 0: 'n1-p1' } : {}} />}
      {mini}
    </Ide>}
    {v === 'run' && <Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T11} er marks={{ [T11.findIndex((l) => /Node\.js v/.test(l.h || ''))]: 'n1-p2' }} />}
    {v === 'cause' && <><Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T11} er /><Cause items={CAUSE11} on={4} bad={3} /></>}
  </>;
}

// ============================================================
//  12 · Tekshiruv 2 — rejects sinxron xatoda (kod-06 · jest2v2-out/06)
// ============================================================
function Screen12(p) {
  return MC(p, 12, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_06', { 35: 'x', 36: 'x', 37: 'x' }, 35, 37)} focus={['x']} />
      <CodePanel file="order.service.ts" lines={kod('ORDER_PLACE', { 25: 't' }, 25, 25)} focus={['t']} />
    </div>,
    after: <Term title={t("VS Code terminali · npm test -- order.service -t telefon", "терминал VS Code · npm test -- order.service -t telefon")} lines={out('06', outFind('06', /●/), outFind('06', /^\s*>\s*25/))} er />,
  });
}

// ============================================================
//  13 · await unutildi — xabar noto'g'ri, natija yo'q (kod-08 · jest2v2-out/08)
// ============================================================
const T13 = outPick('08', (l) => !/^\s+at |matcherResult|^\s*'|^\s*"|pass: false|^\s*\}|^\s*\{$|innerErr|^\s+\^$/.test(l));
const CAUSE13 = ['Test funksiyasi promise\'ni kutmasdan darhol tugadi', 'Promise keyin rad etildi — Jest farqni ko\'rdi (Expected / Received)', 'Lekin bu xato qaysi testniki? Jest bog\'lay olmadi', 'Jarayon to\'xtadi: PASS ham, FAIL ham yo\'q'];
const S13 = mkS(13, [{ v: 'code' }, { v: 'run' }, { v: 'cause' }, { v: 'cause', sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'code' && <CodePanel file={t("order.service.spec.ts · await yo'q", "order.service.spec.ts · нет await")} lines={kod('SPEC_ORDER_08', { 51: 'x', 52: 'x' }, 44, 54)} focus={['x']} />}
    {seg.v === 'run' && <><CodePanel file={t("order.service.spec.ts · await yo'q", "order.service.spec.ts · нет await")} lines={kod('SPEC_ORDER_08', { 51: 'x' }, 51, 53)} focus={['x']} /><Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T13} er /></>}
    {seg.v === 'cause' && <><Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T13.slice(0, 5)} er /><Cause items={CAUSE13} on={4} bad={0} /></>}
  </>} />;
}

// ============================================================
//  14 · Tekshiruv 3 — LineCheck: await yo'q (kod-08 44–54, xato 51-satr → indeks 7; 08b tuzatilgan)
// ============================================================
const LC14 = kod('SPEC_ORDER_08', {}, 44, 54);
const LC14_FIXED = kod('SPEC_ORDER_08', {}, 44, 54).flatMap((l) => l.n === 51 ? [{ ...l, gone: true }, { h: tsLine('    await expect(service.place(user, cart)).rejects.toThrow('), n: 51, neu: true }] : [l]);
const T14X = out('08b', outFind('08b', /●/), outFind('08b', /Received message/));
function Screen14(p) {
  const m = MDT[14];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="order.service.spec.ts" lines={LC14} target={7}
    tree={{ root: MKCFG.root, files: compact(FILES(F.ph, F.phs, F.ors), F.ors), active: F.ors }}
    fixed={LC14_FIXED} fixedExtra={[{ file: t("VS Code terminali · await bilan, xabar noto'g'ri", "терминал VS Code · с await, сообщение неверное"), lines: T14X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  15 · Xato yo'lida nima bo'lmasligi kerak (kod-05 44–55, 57–67 · order.service.ts 36–45)
// ============================================================
// F-1109-06: xulosa — ikki expect kartasi o'rniga place() oqimi (order.service.ts satrlari bilan) va har expect qaysi qutini tekshirishi
function Flow15() {
  return <div className="z j2-15">
    <div className="flow">
      <div className="st"><h6>{t("Savat", "Корзина")}</h6><div className="zm">Kolonka × 2</div><div className="ln">{t("cart · spec 18-satr", "cart · spec строка 18")}</div></div>
      <div className="ar">→</div>
      <div className="st"><h6>{t("Ombor (mock)", "Склад (mock)")}</h6><div className="zm">findOne → stock: <b>1</b></div><div className="ln">{t("service 31-satr", "service строка 31")}</div></div>
      <div className="ar">→</div>
      <div className="st x"><h6>{t("Tekshiruv", "Проверка")}</h6><div className="zm">1 &lt; 2 → throw</div><span className="z-tag r">{t("✗ xato chiqdi", "✗ ошибка вышла")}</span><div className="ln">{t("service 36–37-satr", "service строки 36–37")}</div></div>
      <div className="ar">✕</div>
      <div className="st off"><h6>{t("Omborni kamaytirish", "Уменьшение склада")}</h6><div className="zm">UPDATE products SET stock = stock - $1</div><span className="z-tag g">{t("chaqirilmadi · ombor 1 qoldi", "не вызван · на складе осталось 1")}</span><div className="ln">{t("service 42-satr", "service строка 42")}</div></div>
    </div>
    <div className="as">
      <div className="a"><b>{t("1-qism · xato chiqdi", "Часть 1 · ошибка вышла")}</b><div className="zm">await expect(service.place(user, cart)){'\n'}.rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi')</div><small>{t("«Tekshiruv» qutisini tekshiradi", "проверяет блок «Проверка»")}</small></div>
      <div className="a"><b>{t("2-qism · keyingi qadam bo'lmadi", "Часть 2 · следующий шаг не случился")}</b><div className="zm">expect(manager.query){'\n'}.not.toHaveBeenCalled()</div><small>{t("«Omborni kamaytirish» qutisini tekshiradi", "проверяет блок «Уменьшение склада»")}</small></div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'src' }, { v: 'not' }, { v: 'times' }, { v: 'sum' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'src' && <Code k="ORDER_PLACE" files={FILES(F.ors)} active={F.ord} ids={{ 36: 'c', 37: 'c', 38: 'c', 42: 'u', 43: 'u', 44: 'u', 45: 'u' }} focus={['c', 'u']} from={35} to={45} />}
    {seg.v === 'not' && <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_05', { 54: 'n' }, 44, 55)} focus={['n']} />}
    {seg.v === 'times' && <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_05', { 66: 'n' }, 57, 67)} focus={['n']} />}
    {seg.v === 'sum' && <Flow15 />}
  </>} />;
}

// ============================================================
//  16 · Chegara: < → <= (jest2v2-out/09, 09b, 09c · kod-10 69–78)
// ============================================================
const BREAK16 = { 36: KOD.ORDER_PLACE.lines.find((l) => l.n === 36).t.replace('p.stock < c.qty', 'p.stock <= c.qty') };
const T16A = out('09', outFind('09', /^PASS/), outFind('09', /^Tests:/));
const T16B = out('09c', outFind('09c', /^FAIL/), outFind('09c', /^\s*>\s*37/));
const T16C = out('09b', outFind('09b', /^PASS/), outFind('09b', /^Tests:/));
// F-1120-02 (M52): 1-segment (x) — mentor 36-satrdagi «<» ni o'zi bosadi (data-act) → «<=»
const L36 = KOD.ORDER_PLACE.lines.find((l) => l.n === 36).t;
const ACT16 = kod('ORDER_PLACE', { 36: 'x' }, 35, 38).map((l) => (l.n === 36 ? { ...l, h: tsLine(L36.split('p.stock < c.qty')[0] + 'p.stock ') + '<span class="n1-act" data-act="1">' + tsLine('<') + '</span>' + tsLine(' c.qty' + L36.split('p.stock < c.qty')[1]) } : l));
// 1280×720 da kichik rasm bilan sig'sin: 5-testdan nomi, stock: 2 va kutilgan jami (oraliq satrlar «…»)
const SPEC16 = (() => { const L = kod('SPEC_ORDER_10', { 69: 'c', 73: 'c', 77: 'c' }, 69, 78); const keep = [69, 73, 76, 77, 78]; const out = []; L.forEach((l) => { if (!keep.includes(l.n)) { if (out.length && out[out.length - 1].n !== '') out.push({ h: '<span class="cm">…</span>', n: '' }); return; } out.push(l); }); return out; })();
const S16 = mkS(16, [{ v: 'act' }, { v: 'break' }, { v: 'four' }, { v: 'five' }, { v: 'ok' }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={(b) => <Scene16 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi (natija «?») · 2 to'rt test yashil · 3 5-test qizil, bo'laklar 1·2 · 4 tiklandi → 5 passed
function Scene16({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'break' : 'act') : seg.v;
  const broken = v !== 'act' && v !== 'ok';
  const res = v === 'act' || v === 'break' ? (v === 'break' ? ['?', ''] : null) : v === 'four' ? ['npm test -- order.service → 4 passed ' + t('(sezilmadi)', '(не заметили)'), 'ok'] : v === 'five' ? ['5-test → 1 failed: Kolonka: omborda faqat 2 ta qoldi', 'bad'] : ['5 passed', 'ok'];
  const mini = <N1Mini><FlowMini tag={t("Chegara: omborda 2 ta, savatda 2 ta", 'Граница: на складе 2, в корзине 2')}
    boxes={[[t('mock: stock 2', 'mock: stock 2'), t('savatda: 2 ta', 'в корзине: 2'), ''], [broken ? 'p.stock <= c.qty' : 'p.stock < c.qty', t('36-satr', 'строка 36'), broken ? 'bad' : v === 'ok' ? 'ok' : ''], [t('buyurtma', 'заказ'), v === 'five' ? t("rad: «faqat 2 ta qoldi»", 'отказ: «осталось только 2»') : v === 'act' || v === 'ok' ? t('qabul · 100 000', 'принят · 100 000') : '?', v === 'five' ? 'bad' : '']]}
    res={res} pins={beat === 3 ? { 1: 1, 2: 2 } : {}} /></N1Mini>;
  return <>
    {v !== 'five' && v !== 'ok' && <Ide files={compact(FILES(F.ors), F.ord)} active={F.ord}>
      {v === 'act' ? <div onClick={act.onClick}><CodePanel file="order.service.ts" lines={ACT16} focus={['x']} /></div> : <CodePanel key="b" file={t("order.service.ts · buzilgan", "order.service.ts · сломан")} lines={kod('ORDER_PLACE', { 36: 'x' }, 35, 38, BREAK16)} focus={['x']} />}
      {mini}
    </Ide>}
    {(v === 'break' || v === 'four') && <Term title={t("VS Code terminali · npm test -- order.service", "терминал VS Code · npm test -- order.service")} lines={T16A} />}
    {v === 'four' && <div className="n2-warn">{t(<>To'rt test yashil: ular <b>1 ta</b> va <b>10 ta</b> ni sinaydi — <code>&lt;</code> va <code>&lt;=</code> farqi faqat <b>aynan teng</b> bo'lganda.</>, <>Четыре теста зелёные: они проверяют <b>1</b> и <b>10</b> — разница между <code>&lt;</code> и <code>&lt;=</code> только при <b>точном равенстве</b>.</>)}</div>}
    {v === 'five' && <><Ide files={compact(FILES(F.ors), F.ors)} active={F.ors}><CodePanel file="order.service.spec.ts" lines={SPEC16} focus={['c']} />{mini}</Ide><Term title={t("VS Code terminali · buzilgan kod bilan", "терминал VS Code · со сломанным кодом")} lines={T16B} er /></>}
    {v === 'ok' && <><Term title={t("VS Code terminali · tiklangan kod bilan", "терминал VS Code · с восстановленным кодом")} lines={T16C} />{mini}<div className="mk-rule">{t(<>Har <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> shartiga — <b>aynan teng</b> qiymat bilan test.</>, <>На каждое условие <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> — тест со значением <b>ровно на равенстве</b>.</>)}</div></>}
  </>;
}

// ============================================================
//  17 · Amaliyot 2 — order.service.spec.ts va chegara
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 0, file: F.ors, lines: kod('SPEC_ORDER_05', {}, 1, 31), copy: false },
    { step: 1, file: F.ors, lines: kod('SPEC_ORDER_05', {}, 33, 68), copy: false },
    { step: 2, file: F.ors, lines: kod('SPEC_ORDER_10', {}, 69, 79), copy: false },
  ],
});
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} code={P17.code} tree={FILES(F.ph, F.phs, F.ors)} />; }

// ============================================================
//  18 · Sayt API'siga HTTP test: supertest (jest2v2-out/10, 11 · kod-11)
// ============================================================
const T18A = out('10');
const T18B = out('11', outFind('11', /^PASS/), outFind('11', /^Tests:/));
// F-1109-06: xulosa — ikki gapli karta o'rniga ikki parallel oqim bir qolipda: kirish → kod → chiqish → expect (haqiqiy qiymatlar)
function Two18() {
  const row = (inp, code, codeNote, outp, exp) => <div className="z-flow">
    <div className="z-st"><b>{t("kirish", "ввод")}</b>{inp}</div><div className="z-ar">→</div>
    <div className="z-st blue"><b>{t("kod", "код")}</b><span className="zm">{code}</span>{codeNote && <span className="z-mut">{codeNote}</span>}</div><div className="z-ar">→</div>
    <div className="z-st"><b>{t("chiqish", "вывод")}</b>{outp}</div><div className="z-ar">→</div>
    <div className="z-st ok"><b>expect</b><span className="zm">{exp}</span><span className="z-tag g">✓</span></div>
  </div>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Bot handler'i — order.service.spec.ts", "Handler бота — order.service.spec.ts")}</p>
      {row(<><span className="zm">place(user, cart)</span><span className="z-mut">{t("Kolonka × 2, omborda 1", "Kolonka × 2, на складе 1")}</span></>, 'OrderService.place', t("manager — mock", "manager — mock"), <span className="zm">throw 'Kolonka: omborda faqat 1 ta qoldi'</span>, '.rejects.toThrow(…)')}
    </div>
    <div className="z-card">
      <p className="z-h">{t("Sayt route'i — app.controller.spec.ts · supertest · Tests: 2 passed", "Route сайта — app.controller.spec.ts · supertest · Tests: 2 passed")}</p>
      {row(<span className="zm">request(app.getHttpServer()).get('/')</span>, 'AppController', t("xotirada: port ochilmaydi, baza yo'q", "в памяти: порт не открывается, базы нет"), <><span className="z-tag g">200</span><span className="zm">{'{'} ok: true, service: 'order-bot' {'}'}</span></>, 'status 200 · toEqual')}
      {row(<span className="zm">.get('/nope')</span>, t("route yo'q", "route нет"), null, <><span className="z-tag o">404</span><span className="zm">Cannot GET /nope</span></>, 'status 404 · message')}
    </div>
    <div className="z-rule">{t("Qolip bitta: ", "Шаблон один: ")}<b>{t("kirish beriladi, chiqish solishtiriladi", "даём ввод, сравниваем вывод")}</b>{t(" — bot handler'i ham, sayt route'i ham.", " — и handler бота, и route сайта.")}</div>
  </div>;
}
const S18 = mkS(18, [{ v: 'install' }, { v: 'setup' }, { v: 'tests' }, { v: 'sum' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'install' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T18A} />}
    {seg.v === 'setup' && <Code k="SPEC_APP" files={FILES(F.ph, F.phs, F.ors, F.apps)} active={F.apps} fresh={F.apps} ids={rngIds(7, 14, 's')} focus={['s']} from={1} to={14} />}
    {seg.v === 'tests' && <><CodePanel file="app.controller.spec.ts" lines={kod('SPEC_APP', { ...rngIds(17, 21, 'a'), ...rngIds(23, 27, 'b') }, 16, 28)} focus={['a', 'b']} /><Term title={t("VS Code terminali · npm test -- app.controller", "терминал VS Code · npm test -- app.controller")} lines={T18B} /></>}
    {seg.v === 'sum' && <Two18 />}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — GET /nope (kod-11 23–27 · jest2v2-out/11)
// ============================================================
function Screen19(p) {
  return MC(p, 19, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="app.controller.ts" lines={kod('APP_CTRL', { 6: 'g' }, 3, 10)} focus={['g']} />
      <CodePanel file="app.controller.spec.ts" lines={kod('SPEC_APP', { 24: 'r' }, 23, 27)} focus={['r']} />
    </div>,
    after: <Term title={t("VS Code terminali · npm test -- app.controller", "терминал VS Code · npm test -- app.controller")} lines={T18B} />,
  });
}

// ============================================================
//  20 · AI edge testlar yozdi — ikki to'plam (jest2v2-ai/ai1, ai2)
// ============================================================
const S20 = mkS(20, [{ v: 'intro' }, { v: 'prompt' }, { v: 'two' }, { v: 'snip' }, { v: 'snip', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'intro' && <div className="pg-two">
      <Card c={T.ink3} h={t("1–4-bosqich · xato yo'lini siz yozdingiz", "Этапы 1–4 · путь ошибки писали вы")} dim><p><code>isPhone</code> · mock · <code>toThrow</code> / <code>rejects</code> · <code>not.toHaveBeenCalled</code>{t(" · chegara", " · граница")}</p></Card>
      <Card c={JC.ai} h={t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")} hl><p>{t("Savol: ", "Вопрос: ")}<b>{t("bu test xatoni ushlaydimi — va qoidani sinaydimi?", "ловит ли этот тест ошибку — и проверяет ли он правило?")}</b></p></Card>
    </div>}
    {(seg.v === 'prompt' || seg.v === 'two') && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("haqiqiy yurgizish · 04.11", "настоящий запуск · 04.11")} />}
    {seg.v === 'two' && <div className="pg-two">
      <AiReply who={t('1-AI (kuchli model)', '1-й AI (сильная модель)')} said={t(<>«50 test, hammasi o'tdi» · <code>await expect(run(…)).rejects.toThrow(…)</code> · <code>not.toHaveBeenCalled</code> 12 ta</>, <>«50 тестов, все прошли» · <code>await expect(run(…)).rejects.toThrow(…)</code> · <code>not.toHaveBeenCalled</code> — 12</>)} diff={KOD.AI_DIFF1} hl />
      <AiReply who={t('2-AI (kuchsizroq model)', '2-й AI (модель слабее)')} said={t(<>«42 test o'tdi» · <code>expect(() =&gt; service.place(…)).toThrow(…)</code> · <code>rejects</code> 3 ta</>, <>«42 теста прошли» · <code>expect(() =&gt; service.place(…)).toThrow(…)</code> · <code>rejects</code> — 3</>)} diff={KOD.AI_DIFF2} hl />
    </div>}
    {seg.v === 'snip' && <div className="pg-two">
      <CodePanel file={t("1-AI · telegram.service.phone.spec.ts · rad ro'yxati", "1-й AI · telegram.service.phone.spec.ts · список отказов")} lines={kod('AI1_TEL', { 90: 'p' })} focus={['p']} />
      <CodePanel file="2-AI · telegram.service.spec.ts" lines={kod('AI2_TEL', { 21: 'm' })} focus={['m']} />
    </div>}
    {seg.sum && <div className="mk-rule">{t(<>«Hammasi yashil» — <b>tekshiruv emas</b>. Va yangi savol: test <b>qoidani</b> sinaydimi, <b>kodni muhrlaydimi</b>?</>, <>«Всё зелёное» — <b>не проверка</b>. И новый вопрос: тест проверяет <b>правило</b> или <b>запечатывает код</b>?</>)}</div>}
  </>} />;
}

// ============================================================
//  21 · Buzib tekshirish: AI to'plamlari (mutatsiya-men.txt, mutatsiya-ai.txt)
// ============================================================
const S21 = mkS(21, [{ rows: 5 }, { rows: 5, all: true }, { rows: 5, seal: true }, { rows: 5, sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {!seg.seal && <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("Nechta test qizardi (0 — buzilish sezilmadi) · ", "Сколько тестов покраснело (0 — поломка не замечена) · ")}<code>jest2v2-mutatsiya.sh</code></div><MutTable rows={seg.rows} /></div>}
    {seg.seal && <div style={{ display: 'grid', gap: 8 }}>
      <div className="mk-tag" style={{ margin: 0 }}>{t("Oltinchi «buzilish» — buzib bo'lmaydi: AI hozirgi xulqni muhrlagan", "Шестую «поломку» — не сломать: AI запечатал текущее поведение")}</div>
      <CodePanel file={t("1-AI · telegram.service.phone.spec.ts · «rad etiladi» ro'yxatida", '1-й AI · telegram.service.phone.spec.ts · в списке «rad etiladi»')} lines={kod('AI1_TEL', { 90: 'p' }, 88, 92)} focus={['p']} />
      <CodePanel file={t("phone.ts · 6-ekrandagi tuzatish", "phone.ts · исправление с экрана 6")} lines={kod('PHONE_NEW', { 4: 'f' }, 3, 4)} focus={['f']} />
      <div className="n2-warn">{t(<>Tuzatishdan keyin AI testi <b>qizaradi</b>: u qoidani emas, kod hozir qanday ishlashini qo'riqlayapti. Mijoz odatini AI bilmaydi.</>, <>После исправления тест от AI <b>краснеет</b>: он охраняет не правило, а то, как код работает сейчас. О привычке клиента AI не знает.</>)}</div>
    </div>}
    {seg.sum && <div className="mk-rule">{t(<>AI testi <b>xatoni ushlaydi</b> — va <b>hozirgi xulqni muhrlaydi</b>. Har testdan so'rang: bu qoidami, yoki «kod hozir shunday»mi?</>, <>Тест от AI <b>ловит ошибку</b> — и <b>запечатывает текущее поведение</b>. У каждого теста спросите: это правило или «код просто сейчас так»?</>)}</div>}
  </>} />;
}

// ============================================================
//  22 · Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz (prompt — MD 22-ekrandan aynan, setStatus 66–87)
// ============================================================
const PROMPT22 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P22 = mkPractice(22, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: 'prompt.txt', lines: PROMPT22 }, { step: 2, file: F.ord, lines: kod('ORDER_SETSTATUS'), copy: false }],
});
function ScreenP22(p) { return <Practice p={p} S={P22.S} steps={P22.steps} trouble={P22.trouble} proof={P22.proof} code={P22.code} tree={['prompt.txt', F.ord, F.ors]} />; }

// ============================================================
//  23 · Sinfga tayyorgarlik: m4b-03 (EdgeCasesTestLesson.jsx — SCREEN_META 21; shumtaka, guard, toThrow, applyCoupon)
// ============================================================
const DICT23 = [["shumtaka mijoz · g'alati buyurtma", "edge case, noto'g'ri kirish"], ['«hech kim sezmaydi» · «jim buzilish» (kartochka)', "yashirin buzilish — xatosiz noto'g'ri natija (0, −10000, NaN)"], ['guard · 🚧 shart · 🧯 xato tashlash', 'if → throw new Error → return'], ["o'rab berish", 'expect(() => f()).toThrow() — sinxron xato'], ['happy path', 'kutilgan kirish']];
const ADD23 = [['«xato chiqdi» + «keyin nima bo\'lmadi» — ikki qismli test', 's6–s8 guard'], ["() => siz nima bo'ladi — haqiqiy chiqish (natija yo'q)", "s7 o'rash"], ['chegaraning ikki tomoni: aynan 0 va aynan 100', 'uyga vazifa applyCoupon'], ['AI yozgan testni bir marta buzdirish', 'amaliyot oxiri']];
const CARDS23 = [
  ["Himoya yo'q", 'Received function did not throw', "guard yozilmagan yoki shart qiymatni o'tkazdi"],
  ["() => yo'q", "natija yo'q yoki test funksiya xatosi bilan yiqildi", 'expect(() => …)'],
  ['Boshqa xabar', 'Expected substring / Received message', 'xabarni koddagi bilan moslang'],
];
const QA23 = [
  ["«Nega xato tashlaymiz, 0 qaytarsak bo'lmaydimi?»", "0 — yashirin buzilish: bepul buyurtma; xato esa darhol ko'rinadi."],
  ['«toThrow() ichida xabar shartmi?»', "Shart emas, lekin xabar bilan test aniqroq: qaysi xato ekanini ham tekshiradi."],
  ["«'ikki' yozsam VS Code qizil chizadi»", "TypeScript turini tekshiradi; test uchun as any — ataylab noto'g'ri tur beryapmiz."],
  ["«Guard'ni funksiya oxiriga yozsam bo'ladimi?»", "Yo'q: xato hisobdan oldin chiqishi kerak, aks holda hisob baribir bajariladi."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'cards' }, { v: 'dict' }, { v: 'add' }, { v: 'err' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4b-03 (21 ekran)", 'Ученик · m4b-03 (21 экран)')} hl><p>{t(<><b>KitobShop sayti</b> · <code>orderTotal(price, quantity)</code>: 0, manfiy, <code>'ikki'</code>, <code>null</code> → guard (<code>if</code> → <code>throw</code> → <code>return</code>) · <code>expect(() =&gt; …).toThrow()</code> · uyga vazifa <code>applyCoupon</code> · baza yo'q, promise yo'q</>, <><b>Сайт KitobShop</b> · <code>orderTotal(price, quantity)</code>: 0, минус, <code>'ikki'</code>, <code>null</code> → guard (<code>if</code> → <code>throw</code> → <code>return</code>) · <code>expect(() =&gt; …).toThrow()</code> · домашнее задание <code>applyCoupon</code> · базы нет, promise нет</>)}</p></Card>
      <Card c={T.accent} h={t('Siz · bugun', 'Вы · сегодня')}><p>OrderBotNest · <code>isPhone</code> · <code>place</code>: mock, <code>rejects</code>, <code>not.toHaveBeenCalled</code> · {t('chegara · HTTP · AI testi', 'граница · HTTP · тест от AI')}</p></Card>
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: uch yo'l, qoidani ajratish, to throw va rejects, natija yo'q holatlari, bo'lmasligi kerak testi, chegara va HTTP. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi test natija bermayapti desa, qayerga qarashni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'paths', t: "Uch yo'l: happy path (kutilgan kirish), edge case (chegara — kod xato bermaydi, javob to'g'rimi), error path (kod ataylab xato beradi — qaysi xabar, keyin nima bo'lmadi)", st: ['edge', 'err'] },
  { k: 'rule', t: "Sinamoqchi bo'lgan qoidani alohida funksiyaga ajrating (isPhone); it.each — bir test, ko'p kirish; chegara testi qoidaning tor (probel) va keng (9 ta nol) joyini ko'rsatadi", st: ['edge'] },
  { k: 'mock', t: 'Baza o\'rniga mock: jest.fn, mockResolvedValue, Test.createTestingModule — unit-test bazasiz, kod haqiqiy', st: ['err'] },
  { k: 'shape', t: "Sinxron xato — expect(() => …).toThrow(); promise xatosi — await expect(…).rejects.toThrow(). Shakl noto'g'ri bo'lsa Jest natija bermaydi: jarayon qulaydi (toThrow promise'da · await'siz rejects)", st: ['err'] },
  { k: 'two', t: "Error path testi ikki qismli: xato chiqdi va keyingi qadam bajarilmadi (not.toHaveBeenCalled); har < / <= shartiga aynan teng qiymat bilan chegara testi", st: ['err', 'edge'] },
  { k: 'http', t: "Sayt API'si supertest bilan: so'rov → status va tana; 404 — mijoz xatosi, 500 — server xatosi. AI testini qabul qilish: diff · await + rejects · «bo'lmasligi kerak» testi · «qoidami yoki kod hozir shunday?» · buzib tekshirish", st: ['http', 'ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + Jest qatori); har band rasmning o'z qismini yoritadi
const MAP25 = {
  paths: { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
  rule: { on: ['telegram'], tgSub: 'phone.ts', jest: { cmd: 'npm test -- phone', files: ['phone.spec.ts · it.each'], res: 'pass', txt: '8 passed' } },
  mock: { on: ['order'], note: { products: 'mock: findOne → Kolonka, stock 1' }, jest: { cmd: 'npm test -- order.service', files: ['order.service.spec.ts'], res: 'pass' } },
  shape: { on: ['order'], jest: { cmd: 'toThrow · rejects', files: ['order.service.spec.ts'], res: 'fail', get txt() { return t("natija yo'q", 'нет результата'); } } },
  two: { on: ['order'], jest: { cmd: 'npm test -- order.service', files: ['order.service.spec.ts'], res: 'pass', txt: '5 passed' } },
  http: { on: ['telegram', 'order'], jest: { cmd: 'supertest', files: ['app.controller.spec.ts · GET / · /nope'], res: 'pass', txt: '2 passed' } },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.paths;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} tgSub="phone.ts" {...m} max={1.05} tag={t("Bugungi dars — bot noto'g'ri kirishda to'g'ri buziladimi", 'Сегодняшний урок — правильно ли ломается бот на неверном вводе')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "O'z nusxangiz — o'z reposingizda yangi tarmoq (yoki jest2-done dan)", c: ['git checkout -b edge-tests'] },
  { t: "cart.service.spec.ts — mock repo (query, delete): add — query 1 marta, RETURNING qty → natija; query rad etsa — await … rejects.toThrow, boshqa chaqiruv yo'q", c: ['npm test -- cart.service'] },
  { t: "user.service.spec.ts — mock repo (findOne, create, save): bor — save 0 · yo'q — save 1 · rol o'zgargan — save 1", c: ['npm test -- user.service'] },
  { t: "Uch buzish — getOrCreate: if (!user) tekshiruvini olib tashlang · add: rows[0].qty → rows.length · rol tekshiruvi !== → === ; har biridan keyin npm test va git checkout", c: ['git checkout -- src/api/user/user.service.ts src/api/cart/cart.service.ts'] },
  { t: "README «Testlar» bo'limi: buzish → qizargan test nomi (3 qator) → git push → repo linki platformadagi uyga vazifaga", c: ['git add . && git commit -m "edge va error path testlari"', 'git push'] },
];
const CHEATSHEET25 = `# Jest — mentor eslatmasi (OrderBotNest, xato yo'li va chegara)
## Loyiha
git fetch --tags · git checkout jest2-start → jest2-done (phone.ts, phone.spec.ts, order.service.spec.ts, app.controller.spec.ts, supertest) · npm test — 25 test, baza va token kerak emas
## Uch yo'l
happy path — kutilgan kirish · edge case — qoidaning chegarasi (kod xato bermaydi, javob to'g'rimi?) · error path — kod ataylab xato beradi (qaysi xabar? keyin nima bo'lmaydi?)
## Qoidani ajrating
const PHONE service ichida yashirin → src/api/telegram/phone.ts: export const isPhone = (text) => PHONE.test(text.replace(/[\\s-]/g, '')) · bot ham, test ham shuni chaqiradi
## it.each
it.each(['+998901234567', '998901234567'])("%s — to'g'ri raqam", (s) => { expect(isPhone(s)).toBe(true); }) · [['12345678', '8 ta raqam'], …] juftliklar — nom terminalda ko'rinadi
## Mock qolipi (baza yo'q)
const manager = { findOne: jest.fn(), query: jest.fn(), create: jest.fn((_c, d) => d), save: jest.fn(async (o) => ({ id: 1, ...o })), delete: jest.fn() }
const dataSource = { transaction: jest.fn((cb) => cb(manager)) } · Test.createTestingModule({ providers: [OrderService, { provide: getRepositoryToken(Order), useValue: {} }, { provide: DataSource, useValue: dataSource }] })
manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 })
## Xato shakli
sinxron throw → expect(() => service.place(u, c)).toThrow("Telefon raqami yo'q")
promise xatosi → await expect(service.place(u, c)).rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi')
NATIJA YO'Q (PASS/FAIL yo'q, Node.js v24…): toThrow promise xatosida · await'siz rejects — shaklni tekshiring
## Error path — ikki qism
1) xato chiqdi (xabar bilan) · 2) keyingi qadam bo'lmadi: expect(manager.query).not.toHaveBeenCalled() · happy path: toHaveBeenCalledTimes(1)
## Chegara
< / <= / > shartiga aynan teng qiymat bilan test (omborda 2 ta, 2 ta olinadi) — 4 test ko'rmadi, 5-si ko'rdi
## HTTP test
npm i -D supertest @types/supertest · Test.createTestingModule({ controllers: [AppController] }) → app = mod.createNestApplication(); await app.init() · request(app.getHttpServer()).get('/') → status 200, body · /nope → 404 «Cannot GET /nope»
## AI testini qabul qilish
git diff --stat — faqat .spec.ts · rejects oldida await · «bo'lmasligi kerak» testi bormi · har test: qoidami yoki «kod hozir shunday»mi (AI probelli raqam rad etilishini muhrlagan edi) · buzib tekshirish
## Xato qiladigan joylar
Received function did not throw → guard yo'q · natija yo'q → () => yoki await yo'q · Expected substring / Received message → xabarni moslang · Nest can't resolve dependencies … (?, DataSource) → providers'da repository token yo'q · Received message: "Mahsulot topilmadi" → mockResolvedValue yozilmagan
## Sinfga tayyorgarlik (m4b-03, 21 ekran)
KitobShop orderTotal · shumtaka = edge case · guard = if → throw → return · o'rab berish = expect(() => …) · siz qo'shasiz: ikki qismli test, () => siz natija yo'q, chegaraning ikki tomoni, bir marta buzdirish
## Sizning uyga vazifangiz (50–70 daqiqa)
cart.service.spec.ts + user.service.spec.ts (mock, rejects, not.toHaveBeenCalled) · 3 buzish · README jadvali → GitHub → repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Uch yo'l: <b>happy path, edge case, error path</b> — test uchalasini sinaydi", "Birinchi: har funksiyada uch yo'l bor. Happy path, kutilgan kirish. Edge case, qoidaning chegarasi, kod xato bermaydi, lekin javob to'g'rimi. Error path, kod ataylab xato beradi: qaysi xabar bilan va keyin nima bo'lmaydi.", { hl: 'paths' }),
  sg('b2', "Qoidani <b>alohida funksiyaga</b> ajrating; <b>it.each</b> va chegara testi", "Ikkinchi: sinamoqchi bo'lgan qoidani alohida funksiyaga ajrating, is phone kabi. It each bilan bir testga ko'p kirish berasiz. Chegara testi qoidaning tor joyini ham, keng joyini ham ko'rsatadi.", { hl: 'rule' }),
  sg('b3', "Baza o'rniga <b>mock</b>: jest.fn, mockResolvedValue, Test.createTestingModule", "Uchinchi: baza o'rniga mock. Jest fn chaqiruvni yozib qoladi, mock resolved value nima qaytarishini aytadi, test moduli Nest'ga soxta data source'ni beradi. Unit-test bazasiz, kod esa haqiqiy.", { hl: 'mock' }),
  sg('b4', "Sinxron — <b>toThrow</b>, promise — <b>await rejects.toThrow</b>; shakl noto'g'ri bo'lsa natija yo'q", "To'rtinchi: sinxron xatoga o'ram va to throw, promise xatosiga await, rejects, to throw. Shakl noto'g'ri bo'lsa Jest qizil bermaydi, jarayon qulaydi. Natija umuman chiqmasa, avval shaklni tekshiring.", { hl: 'shape' }),
  sg('b5', "Error path testi <b>ikki qismli</b>; har shartga <b>aynan teng</b> qiymat bilan chegara testi", "Beshinchi: xato yo'lining testi ikki qismli: xato chiqdi va keyingi qadam bajarilmadi, not to have been called bilan. Har kichik yoki katta shartiga aynan teng qiymat bilan chegara testi yozing.", { hl: 'two' }),
  sg('b6', "Sayt API'si — <b>supertest</b>; AI testi: <b>qoidami yoki «kod hozir shunday»mi</b>", "Oltinchi: saytning API'si supertest bilan sinaladi: so'rov, status va tana. AI yozgan testni qabul qilishda diff, await va rejects, bo'lmasligi kerak testi, va har testdan so'rang: bu qoidami yoki kod hozir shunday ishlaydimi. Keyin buzib tekshiring.", { hl: 'http' }),
  sg('hw', "<b>Uyga vazifa</b>: savat va foydalanuvchi servislariga xato yo'li testlari", "Uyga vazifa: OrderBotNest'ning o'z nusxangizda cart service'ning add va user service'ning get or create funksiyalariga xato yo'li va chegara testlarini yozing, mock bilan. Add'da so'rov bir marta ketadi, rad etilsa boshqa so'rov ketmaydi. Get or create'da save nechta marta chaqirilishini sanang.", { hl: 'hw' }),
  sg('hw2', "<b>Uch buzish</b> va README jadvali; repo linki platformaga", "Keyin uchta buzish qiling va har birida qaysi test qizarganini README'ga jadval qilib yozing. AI bilan yozsangiz ham bo'ladi, lekin har testda await va bo'lmasligi kerak qismini o'zingiz tekshiring. GitHub'ga chiqaring va linkni platformadagi uyga vazifangizga qo'ying. Ellik-yetmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: uch yo'l, mock qolipi, xato shakli va AI tekshiruvi — bir sahifada", "Pastda bir sahifalik eslatma: uch yo'l, qoidani ajratish, mock qolipi, xato shakli, natija yo'q holatlari, chegara, supertest, AI testini qabul qilish va xato qiladigan joylar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('jest-xato-yoli-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 50–70 daqiqa', 'Домашнее задание · 50–70 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> har promise xatosida <code>await</code> + <code>rejects</code> · <code>not.toHaveBeenCalled</code> kamida ikki testda · README jadvalida 3 buzish, har biri qizargan.</>, <><b>Проверяющий смотрит:</b> на каждой ошибке promise <code>await</code> + <code>rejects</code> · <code>not.toHaveBeenCalled</code> хотя бы в двух тестах · в таблице README 3 поломки, и каждая покраснела.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("CI/CD: testlar lentada", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Har push'da npm test o'zi yuradi, qizil bo'lsa — to'xtaydi", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · Jest", "Курс для менторов · Jest")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["botning xato yo'lini sinaysiz: telefon qoidasi, buyurtmaning uch xatosi va chegarasi", "baza o'rniga mock qo'yasiz va promise xatosini rejects bilan to'g'ri ushlaysiz", "sayt API'sini supertest bilan sinaysiz va AI yozgan testni kodni buzib tekshirasiz"], ['проверите путь ошибки бота: правило телефона, три ошибки заказа и границу', 'подставите mock вместо базы и правильно поймаете ошибку promise через rejects', 'проверите API сайта через supertest и тест от AI — ломая код']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 14-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: Jest-1 darsi (texts.spec.ts, keyboards.spec.ts), Node.js 20+, VS Code, AI yordamchi; baza va bot tokeni kerak emas · Loyiha: jest2-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 14-го экрана можно сделать перерыв · Нужно: урок Jest-1 (texts.spec.ts, keyboards.spec.ts), Node.js 20+, VS Code, AI-помощник; база и токен бота не нужны · Проект: тег jest2-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} tgSub="phone.ts" on={['telegram', 'order']} jest={{ files: J2_FILES, res: 'pass', txt: '25 passed' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, Screen21, ScreenP22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = [ScreenP7, ScreenP17, ScreenP22].filter((S) => SCREENS.includes(S)).length; // 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi
export default function JestEdgeMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/jest2-*.json, ru/jest2-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/jest2-sahna.js) ---
// Jest-2 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Телефон: edge case', 'Заказ: error path', 'Граница и «не должно быть»', 'HTTP-тест и AI', 'Подготовка к классу'] },
};
ru(MUT, [[null, 'regex 9–13 → 8–13 цифр (проходят 8 цифр)'], [null, null], [null, 'place: UPDATE ДО проверки склада'], [null, 'сообщение «Telefon raqami yo\'q» → «Raqam yo\'q»'], [null, 'place: убрана проверка пустой корзины']]);
ru(MUT_COLS, [['Мы', null], null, null]);
ru(PATHS2, [
  { h: 'Happy path — ожидаемый ввод', ex: [null, 'на складе 10'], q: 'Заказ принят. Все тесты Jest-1 были на этом пути.', t: 'тест: верен ли результат' },
  { h: 'Edge case — граница правила', ex: [null, '9 цифр', 'на складе ровно 2'], q: 'Код не даёт ошибку — но верен ли ответ?', t: 'тест: верно ли и на границе' },
  { h: 'Error path — код нарочно даёт ошибку', ex: ['нет телефона', 'корзина пуста', 'на складе 1, в корзине 2'], q: 'Ошибка — правильное поведение. Какое сообщение? Чего потом не происходит?', t: 'тест: ошибка вышла, и следующий шаг не случился' },
]);
ru(CAUSE11, ['toThrow вызвал обёртку — place() вернул promise', 'В этот момент ошибки нет → Jest посчитал «тест прошёл»', 'Ошибка брошена позже, внутри promise — её никто не поймал', 'Node остановил весь процесс: нет ни PASS, ни FAIL']);
ru(CAUSE13, ['Тестовая функция закончилась сразу, не дождавшись promise', 'Promise потом отклонился — Jest увидел разницу (Expected / Received)', 'Но чья это ошибка? Jest не смог привязать', 'Процесс остановился: нет ни PASS, ни FAIL']);
ru(DICT23, [['клиент-хитрец · странный заказ', 'edge case, неверный ввод'], ['«никто не заметит» · «незаметная поломка» (карточка)', 'скрытая поломка — неверный результат без ошибки (0, −10000, NaN)'], ['guard · 🚧 условие · 🧯 бросить ошибку', null], ['обернуть', 'expect(() => f()).toThrow() — синхронная ошибка'], [null, 'ожидаемый ввод']]);
ru(ADD23, [['«ошибка вышла» + «чего потом не случилось» — тест из двух частей', null], ['что будет без () => — настоящий вывод (результата нет)', 's7 обёртка'], ['обе стороны границы: ровно 0 и ровно 100', 'домашнее задание applyCoupon'], ['один раз сломать тест, написанный AI', 'конец практики']]);
ru(CARDS23, [
  ['Нет защиты', null, 'guard не написан или условие пропустило значение'],
  ['Нет () =>', 'результата нет или тест упал с ошибкой функции', null],
  ['Другое сообщение', null, 'согласуйте сообщение с кодом'],
]);
ru(QA23, [
  ['«Зачем бросать ошибку, нельзя вернуть 0?»', '0 — скрытая поломка: бесплатный заказ; а ошибка видна сразу.'],
  ['«Обязательно ли сообщение внутри toThrow()?»', 'Не обязательно, но с сообщением тест точнее: проверяет и то, какая это ошибка.'],
  ['«Если напишу \'ikki\', VS Code подчёркивает красным»', 'TypeScript проверяет тип; для теста as any — нарочно даём неверный тип.'],
  ['«Можно написать guard в конце функции?»', 'Нет: ошибка должна выйти до подсчёта, иначе подсчёт всё равно выполнится.'],
]);
ru(SUM25, [
  { t: 'Три пути: happy path (ожидаемый ввод), edge case (граница — код не даёт ошибку, верен ли ответ), error path (код нарочно даёт ошибку — какое сообщение, чего потом не случилось)' },
  { t: 'Правило, которое хотите проверить, вынесите в отдельную функцию (isPhone); it.each — один тест, много вводов; тест границы показывает узкое (пробел) и широкое (9 нулей) место правила' },
  { t: 'Вместо базы mock: jest.fn, mockResolvedValue, Test.createTestingModule — unit-тест без базы, код настоящий' },
  { t: 'Синхронная ошибка — expect(() => …).toThrow(); ошибка promise — await expect(…).rejects.toThrow(). При неверной форме Jest не даёт результата: процесс падает (toThrow на promise · rejects без await)' },
  { t: 'Тест error path из двух частей: ошибка вышла, и следующий шаг не выполнен (not.toHaveBeenCalled); на каждое условие < / <= — тест границы со значением ровно на равенстве' },
  { t: 'API сайта через supertest: запрос → статус и тело; 404 — ошибка клиента, 500 — ошибка сервера. Приём теста от AI: diff · await + rejects · тест «не должно быть» · «это правило или код просто сейчас так?» · проверка поломкой' },
]);
ru(HOMEWORK25, [
  { t: 'Своя копия — новая ветка в своём репозитории (или от jest2-done)' },
  { t: 'cart.service.spec.ts — mock repo (query, delete): add — query 1 раз, RETURNING qty → результат; если query отклонён — await … rejects.toThrow, других вызовов нет' },
  { t: 'user.service.spec.ts — mock repo (findOne, create, save): есть — save 0 · нет — save 1 · роль изменилась — save 1' },
  { t: 'Три поломки — getOrCreate: уберите проверку if (!user) · add: rows[0].qty → rows.length · проверка роли !== → === ; после каждой npm test и git checkout' },
  { t: 'Раздел README «Тесты»: поломка → имя покрасневшего теста (3 строки) → git push → ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.TITLE = 'Путь ошибки: правильно ли бот ломается на неверном вводе';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 4 проверки · самопроверка 8 вопросов. После экрана 14 можно сделать перерыв', 'Нужно: урок для менторов Jest-1 (вы написали в OrderBotNest texts.spec.ts, keyboards.spec.ts) · Node.js 20+ · VS Code · AI-помощник (Antigravity, Claude Code, Codex или Copilot). База и токен бота не нужны', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега jest2-start'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: три пути, вынос правила, to throw и rejects, случаи без результата, тест «не должно быть», граница и HTTP. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет, что тест не даёт результата, вы знаете, куда смотреть.';
RU_S.NEXT_T = 'CI/CD: тесты в конвейере';
RU_S.NEXT_D = 'При каждом push npm test запускается сам, если красный — останавливается';
RU_S.FILE = 'jest-put-oshibki-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['Три пути: <b>happy path, edge case, error path</b> — тест проверяет все три', 'Первое: в каждой функции три пути. Happy path, ожидаемый ввод. Edge case, граница правила: код не даёт ошибку, но верен ли ответ. Error path, код нарочно даёт ошибку: с каким сообщением и чего потом не происходит.'],
  b2: ['Вынесите правило <b>в отдельную функцию</b>; <b>it.each</b> и тест границы', 'Второе: правило, которое хотите проверить, вынесите в отдельную функцию, как is phone. Через it each даёте одному тесту много вводов. Тест границы показывает и узкое, и широкое место правила.'],
  b3: ['Вместо базы <b>mock</b>: jest.fn, mockResolvedValue, Test.createTestingModule', 'Третье: вместо базы mock. Jest fn запоминает вызов, mock resolved value говорит, что вернуть, тестовый модуль даёт Nest поддельный data source. Unit-тест без базы, а код настоящий.'],
  b4: ['Синхронная — <b>toThrow</b>, promise — <b>await rejects.toThrow</b>; неверная форма — результата нет', 'Четвёртое: для синхронной ошибки — обёртка и to throw, для ошибки promise — await, rejects, to throw. При неверной форме Jest не даёт красного, процесс падает. Если результата нет вообще, сначала проверьте форму.'],
  b5: ['Тест error path <b>из двух частей</b>; на каждое условие — тест границы <b>ровно на равенстве</b>', 'Пятое: тест пути ошибки из двух частей: ошибка вышла, и следующий шаг не выполнен, через not to have been called. На каждое условие «меньше» или «больше» пишите тест границы со значением ровно на равенстве.'],
  b6: ['API сайта — <b>supertest</b>; тест от AI: <b>это правило или «код просто сейчас так»</b>', 'Шестое: API сайта проверяется через supertest: запрос, статус и тело. Принимая тест от AI: diff, await и rejects, тест «не должно быть», и у каждого теста спросите: это правило или код просто сейчас так работает? Потом проверьте поломкой.'],
  hw: ['<b>Домашнее задание</b>: тесты пути ошибки для сервисов корзины и пользователя', 'Домашнее задание: в своей копии OrderBotNest напишите тесты пути ошибки и границы для функций add в cart service и get or create в user service, с mock. В add запрос уходит один раз, при отказе другой запрос не уходит. В get or create посчитайте, сколько раз вызывается save.'],
  hw2: ['<b>Три поломки</b> и таблица в README; ссылка на репозиторий — на платформу', 'Потом сделайте три поломки и для каждой запишите в README таблицей, какой тест покраснел. Можно писать и с AI, но в каждом тесте await и часть «не должно быть» проверьте сами. Выложите на GitHub и вставьте ссылку в своё домашнее задание на платформе. Пятьдесят–семьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: три пути, шаблон mock, форма ошибки и проверка AI — на одной странице', 'Внизу памятка на одну страницу: три пути, вынос правила, шаблон mock, форма ошибки, случаи без результата, граница, supertest, приём теста от AI и места, где ошибаются. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# Jest — памятка ментора (OrderBotNest, путь ошибки и граница)
## Проект
git fetch --tags · git checkout jest2-start → jest2-done (phone.ts, phone.spec.ts, order.service.spec.ts, app.controller.spec.ts, supertest) · npm test — 25 тестов, база и токен не нужны
## Три пути
happy path — ожидаемый ввод · edge case — граница правила (код не даёт ошибку, верен ли ответ?) · error path — код нарочно даёт ошибку (какое сообщение? чего потом не происходит?)
## Вынесите правило
const PHONE спрятан внутри service → src/api/telegram/phone.ts: export const isPhone = (text) => PHONE.test(text.replace(/[\\s-]/g, '')) · его вызывают и бот, и тест
## it.each
it.each(['+998901234567', '998901234567'])("%s — to'g'ri raqam", (s) => { expect(isPhone(s)).toBe(true); }) · пары [['12345678', '8 ta raqam'], …] — имя видно в терминале
## Шаблон mock (без базы)
const manager = { findOne: jest.fn(), query: jest.fn(), create: jest.fn((_c, d) => d), save: jest.fn(async (o) => ({ id: 1, ...o })), delete: jest.fn() }
const dataSource = { transaction: jest.fn((cb) => cb(manager)) } · Test.createTestingModule({ providers: [OrderService, { provide: getRepositoryToken(Order), useValue: {} }, { provide: DataSource, useValue: dataSource }] })
manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 })
## Форма ошибки
синхронный throw → expect(() => service.place(u, c)).toThrow("Telefon raqami yo'q")
ошибка promise → await expect(service.place(u, c)).rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi')
РЕЗУЛЬТАТА НЕТ (нет PASS/FAIL, Node.js v24…): toThrow на ошибке promise · rejects без await — проверьте форму
## Error path — две части
1) ошибка вышла (с сообщением) · 2) следующий шаг не случился: expect(manager.query).not.toHaveBeenCalled() · happy path: toHaveBeenCalledTimes(1)
## Граница
тест со значением ровно на равенстве для < / <= / > (на складе 2, берут 2) — 4 теста не увидели, 5-й увидел
## HTTP-тест
npm i -D supertest @types/supertest · Test.createTestingModule({ controllers: [AppController] }) → app = mod.createNestApplication(); await app.init() · request(app.getHttpServer()).get('/') → status 200, body · /nope → 404 «Cannot GET /nope»
## Приём теста от AI
git diff --stat — только .spec.ts · await перед rejects · есть ли тест «не должно быть» · каждый тест: правило или «код просто сейчас так» (AI запечатал отказ номеру с пробелами) · проверка поломкой
## Где ошибаются
Received function did not throw → нет guard · результата нет → нет () => или await · Expected substring / Received message → согласуйте сообщение · Nest can't resolve dependencies … (?, DataSource) → в providers нет repository token · Received message: "Mahsulot topilmadi" → не написан mockResolvedValue
## Подготовка к классу (m4b-03, 21 экран)
KitobShop orderTotal · хитрец = edge case · guard = if → throw → return · обернуть = expect(() => …) · вы добавляете: тест из двух частей, без () => результата нет, обе стороны границы, один раз сломать
## Ваше домашнее задание (50–70 минут)
cart.service.spec.ts + user.service.spec.ts (mock, rejects, not.toHaveBeenCalled) · 3 поломки · таблица README → GitHub → ссылка на репозиторий на платформу`;

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · Jest",
  "title": "Бот работает при правильном вводе — теперь проверим, правильно ли он ломается при неправильном",
  "seg": {
   "a": [
    "В Jest-1 вы проверяли «работает» — сегодня <b>«правильно ли ломается»</b>",
    "Здравствуйте. На первом уроке по Jest вы проверяли, что бот правильно работает при правильном вводе. Сегодня наоборот: правильно ли ломается бот, когда клиент пишет неправильно или на складе не хватает товара. На экране результат в конце урока: пять тестовых файлов, двадцать пять тестов, все зелёные."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: три пути — happy path, edge case, error path",
    "Сначала общее понятие: у кода три пути. Happy path, то есть ожидаемый правильный ввод. Edge case, то есть граница правила. Error path, то есть путь, на котором код нарочно выдаёт ошибку. Сегодня вы увидите все три в настоящих местах бота."
   ],
   "c": [
    "Правило телефона, три ошибки заказа, <b>HTTP-тест для API сайта</b>",
    "Дальше три настоящих места: правило номера телефона, три ошибки при оформлении заказа и адрес API сайта. Последнее — ответ на вопрос с первого урока по Jest: сайт проверяется точно так же. По пути увидите две скрытые ловушки: в них Jest даже не даёт красного."
   ],
   "d": [
    "Шесть этапов, три практики; в конце <b>два экрана подготовки к классу</b>",
    "Урок состоит из шести этапов, в трёх практиках пишете сами. Последние два экрана — подготовка к классу: карта урока ученика и места, где ученики ошибаются. Не спешите: каждый экран можно прослушать с начала, урок запоминает, где вы остановились. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "В каждой функции три пути: ожидаемый ввод, ввод на границе и нарочная ошибка — тест проверяет все три",
  "seg": {
   "a": [
    "Happy path — <b>ожидаемый правильный ввод</b>: все тесты Jest-1 были на этом пути",
    "Первый путь — happy path: клиент правильно написал номер, на складе хватает, заказ принят. Все тесты первого урока по Jest были на этом пути. А в настоящем магазине не все клиенты пишут правильно."
   ],
   "b": [
    "Edge case — <b>граница правила</b>: код не даёт ошибку, но верен ли ответ?",
    "Второй путь — edge case, то есть граница. Клиент написал номер с пробелами. Или в номере ровно девять цифр, то есть самый короткий допустимый. Или на складе ровно два, и берут оба. Код не даёт ошибку, но верен ли ответ, скажет тест."
   ],
   "c": [
    "Error path — <b>код нарочно бросает ошибку</b>: какое сообщение, и что потом не происходит",
    "Третий путь — error path: нет телефона, корзина пуста, на складе не хватает. Здесь код нарочно бросает ошибку, и это правильное поведение. Тест ждёт саму ошибку: вышла ли ошибка, с каким сообщением и остался ли склад неизменным после ошибки."
   ],
   "d": [
    "Итог: на каждую функцию — <b>тесты трёх путей</b>; сегодня пишем все три",
    "Итог: на одну функцию пишутся тесты трёх путей: ожидаемый ввод, граница и ошибка. Сегодня в правиле телефона проверим границу, в заказе — путь ошибки, а в API сайта — запрос и ответ. Начинаем с правила телефона."
   ]
  }
 },
 "3": {
  "kicker": "Этап 2 · телефон",
  "title": "Правило PHONE спрятано внутри telegram.service.ts — из теста его не вызвать, поэтому выносим в отдельный файл",
  "seg": {
   "a": [
    "Правило <b>в <code>telegram.service.ts</code>, 12-я строка</b>: <code>+</code> необязателен, от 9 до 13 цифр",
    "Откройте свою папку OrderBotNest в VS Code. В двенадцатой строке файла telegram service ts в папке src, api, telegram — правило телефона: regex. Плюс необязателен, дальше от девяти до тринадцати цифр, больше ничего. В сто пятьдесят седьмой строке бот проверяет этим правилом сообщение клиента."
   ],
   "b": [
    "Проблема: правило — <b><code>const</code>, не экспортировано</b> — тест не может его вызвать",
    "Проблема в том, что правило — const, спрятано внутри файла и не экспортировано. Тест не может его вызвать. А поднимать весь бот и подделывать сообщение Telegram — это уже не unit-тест. Поэтому выносим правило в отдельный файл."
   ],
   "c": [
    "Новый файл <code>phone.ts</code>: <b><code>isPhone(text)</code> — одна функция</b>, её вызывают и бот, и тест",
    "В этой же папке telegram создаём файл phone ts. В нём две вещи: тот же regex и функция is phone, она берёт текст и возвращает true или false. Теперь и бот, и тест вызывают одну функцию. Правило живёт в одном месте."
   ],
   "d": [
    "Итог: <b>правило, которое хотите проверить, вынесите в функцию</b> — это и код делает чище",
    "Итог: если правило, которое хотите проверить, спрятано внутри service, вынесите его в отдельную функцию. Telegram service теперь импортирует is phone и вызывает её. Это делает тест возможным и код чище: правило в одном месте. Теперь проверяем само правило."
   ]
  }
 },
 "4": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "Клиент написал номер как «+998 90 123 45 67». Что вернёт isPhone с текущим regex?",
  "q": "Правило вынесли, теперь проверим. Первая проверка. Клиент написал номер с пробелами: плюс девять девять восемь, пробел, девяносто, пробел и так далее. Что вернёт is phone с текущим regex? Выберите вариант.",
  "ok": "Верно. В regex только плюс и цифры, пробела нет, поэтому false. Trim убирает только пробелы в начале и в конце, а не в середине. Бот отклонит этот номер, а клиент думает, что написал его правильно. Значит, edge case часто появляется не из правила, а из привычки клиента.",
  "okShort": "В regex нет пробела → <code>false</code>. <code>trim()</code> убирает только пробелы по краям.",
  "hint": "Какие символы разрешены в regex? Есть ли среди них пробел?",
  "demak": "edge case часто появляется не из правила, а из привычки клиента.",
  "opts": [
   "true — количество цифр верное, пробел не считается",
   "false — в regex только цифры и +, пробела нет",
   "true — trim() убирает пробелы",
   "Ошибка — regex падает на пробеле в тексте"
  ],
  "wrong": {
   "0": "Regex проверяет посимвольно: пробел — не \\d.",
   "2": "trim() убирает только пробелы в начале и в конце, не в середине.",
   "3": "Regex не падает, он возвращает false — сообщения об ошибке нет."
  }
 },
 "5": {
  "kicker": "Этап 2 · телефон",
  "title": "Семь вводов на одно правило: два верных, четыре неверных и одна граница — it.each записывает их в одну таблицу",
  "seg": {
   "a": [
    "<code>it.each</code> — <b>один тест, разный ввод</b>: даётся список, Jest делает для каждого отдельный тест",
    "Создаём файл phone spec ts в папке telegram, рядом с phone ts. Новое: it each. Ему передаётся список вводов, Jest делает для каждого отдельный тест. В первом списке два верных номера: с плюсом и без."
   ],
   "b": [
    "Четыре неверных ввода: <b>8 цифр, 14 цифр, буквы, пусто</b> — у каждого есть имя",
    "Во втором списке четыре неверных ввода: восемь цифр, то есть на одну меньше границы. Четырнадцать цифр, на одну больше. Буквы. Пустой текст. В каждой строке ввод и его имя: пусть имя теста в терминале будет понятным."
   ],
   "c": [
    "Седьмой тест — привычка клиента: <b>номер с пробелами должен быть <code>true</code></b>",
    "Седьмой тест — привычка клиента: номер, написанный с пробелами. Мы ждём, что он верный, потому что это настоящий номер. В терминале VS Code npm test, два дефиса, phone. Шесть зелёных, один красный: номер с пробелами."
   ],
   "d": [
    "Значит, <b>правило уже, чем клиент</b>: настоящий номер с пробелами бот отклоняет",
    "Значит, причина в одном месте: правило уже, чем клиент. Клиент пишет с пробелами, а regex знает только цифры. Тест показал это в тот же день, когда написан код, а не тогда, когда клиент пожалуется. На следующем экране расширим правило и посмотрим ещё одну границу."
   ]
  }
 },
 "6": {
  "kicker": "Этап 2 · внутри",
  "title": "Исправление — одна строка: перед проверкой убираем пробелы и дефисы — и тест показывает, что правило пропускает лишнее",
  "seg": {
   "a": [
    "Исправление: <b><code>replace(/[\\s-]/g, '')</code></b> — убираем пробелы и дефисы, потом проверяем",
    "Меняем четвёртую строку файла phone ts: вместо trim — replace. Он убирает пробелы и дефисы, потом проверяет regex. Как бы клиент ни написал, цифры одинаковые. Npm test phone: все семь тестов зелёные."
   ],
   "b": [
    "Ещё один тест: <b>9 нулей тоже <code>true</code></b> — правило считает это верным номером",
    "Теперь интересный тест. Девять нулей: что скажет is phone? True. По правилу это верный номер: девять цифр, больше ничего. Тест зелёный, но вы задумаетесь: правда ли девять нулей — номер телефона?"
   ],
   "c": [
    "Тест <b>проверяет правило, а верно ли само правило</b> — это ваше решение",
    "Вот вторая польза edge-теста. Тест проверяет правило, а верно ли само правило, тест не решает. Если вас не устраивает, что девять нулей проходят, пишете правило уже, и тест снова вас защищает. Пока оставляем: для бота достаточно."
   ],
   "d": [
    "Итог: <b>пишите в тест ввод на границе</b> — он ставит правило перед глазами",
    "Итог: пишите в тест ввод на границе, он ставит правило перед глазами. Один тест нашёл узкое место правила — пробел. Другой показал широкое — девять нулей. Теперь оба файла напишете сами."
   ]
  }
 },
 "7": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 12 минут",
  "title": "Вынесите правило телефона в отдельный файл, напишите тесты границы и увидьте красный с пробелами",
  "seg": {
   "a": [
    "Теперь вы: <b>на теге <code>jest2-start</code></b> выносите правило и пишете семь тестов",
    "Теперь ваша очередь. В своей папке OrderBotNest переходите на тег jest два start. В папке telegram создаёте phone ts и phone spec ts. База и токен не нужны. Займёт двенадцать минут."
   ],
   "b": [
    "Шаги 1–2: тег и <b><code>phone.ts</code>, семь тестов через <code>it.each</code></b> — тест с пробелами красный",
    "На первом шаге переходите на тег через git fetch и checkout. На втором пишете в phone ts regex и is phone, а в phone spec ts семь тестов через it each. Npm test phone: тест с пробелами должен быть красным."
   ],
   "c": [
    "Шаги 3–4: <b>исправление через <code>replace</code></b>, тест «9 нулей»; подтверждение — строка <code>Tests:</code>",
    "На третьем шаге пишете в is phone вместо trim replace: всё зелёное. На четвёртом добавляете тест девяти нулей и смотрите результат. В поле подтверждения скопируйте строку tests из последнего результата."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы открываете правило для теста и пишете тест границы."
   ]
  },
  "steps": [
   {
    "t": "Тег",
    "exp": "Tests: 10 passed, 10 total"
   },
   {
    "t": "phone.ts + phone.spec.ts (код с экранов 3–5)",
    "exp": "✕ mijoz probel bilan yozadi · Tests: 1 failed, 6 passed"
   },
   {
    "t": "Исправление",
    "exp": "Tests: 7 passed, 7 total"
   },
   {
    "t": "Граница",
    "exp": "Tests: 8 passed, 8 total",
    "cmds": [
     "it(\"9 нулей тоже проходит\") — isPhone('000000000') → true"
    ]
   }
  ],
  "proof": {
   "label": "Строка Tests: последнего результата",
   "placeholder": "например: Tests: 8 passed, 8 total",
   "wrong": "Восемь тестов зелёные? Вставьте строку Tests: из результата npm test -- phone."
  },
  "trouble": [
   [
    "error: pathspec 'jest2-start' did not match",
    "теги не получены — git fetch --tags, потом checkout"
   ],
   [
    "На шаге 2 всё ✓",
    "тест с пробелами не написан или replace уже поставлен — проверьте седьмой тест с экрана 5"
   ],
   [
    "в it.each вместо %s — undefined",
    "элементы списка не массивы — нужна пара ['12345678', '8 ta raqam']"
   ],
   [
    "Cannot find module './phone'",
    "файл не в src/api/telegram/ — перенесите рядом с telegram.service.ts"
   ]
  ]
 },
 "8": {
  "kicker": "Этап 3 · error path",
  "title": "При оформлении заказа три ошибки: две сразу в самой функции, третья внутри транзакции — для теста эта разница решающая",
  "seg": {
   "a": [
    "<code>order.service.ts</code>, 24-я строка: <b><code>place</code> сразу бросает две ошибки</b> — нет телефона, корзина пуста",
    "Теперь переходим к заказу. Откройте файл order service ts в папке src, api, order, двадцать четвёртая строка: функция place. В двадцать пятой и двадцать шестой строках две проверки: нет телефона — ошибка, корзина пуста — ошибка. Обе бросаются сразу, в самой функции."
   ],
   "b": [
    "Третья ошибка <b>внутри транзакции, 37-я строка</b>: не хватает на складе — бросается в promise",
    "Третья ошибка в тридцать седьмой строке: если на складе не хватает. Но она внутри transaction, то есть внутри async-функции. Эта ошибка бросается не сразу, а в promise. Посмотрите на схему на экране: две ошибки слева, в самой функции, одна справа, внутри promise."
   ],
   "c": [
    "Почему разница важна: <b>в Jest два разных способа</b> — один для синхронной, другой для promise",
    "Для теста эта разница решающая. Синхронную ошибку ловим через expect, функцию в скобках, to throw. А ошибку promise — через await expect, rejects, to throw. Если перепутать способы, Jest даже не даст красного, это увидите через два экрана."
   ],
   "d": [
    "Итог: прежде чем проверять ошибку, выясните, <b>где она бросается</b> — сразу или внутри promise",
    "Итог: прежде чем проверять ошибку, выясните, где она бросается: сразу в самой функции или внутри promise. В place есть оба вида. Но до теста ещё одна проблема: place пишет в базу, а тестовой базы у нас нет. Решим это на следующем экране."
   ]
  }
 },
 "9": {
  "kicker": "Этап 3 · внутри",
  "title": "Unit-тест без базы: вместо DataSource поддельный объект, findOne возвращает товар, который задали мы — это mock",
  "seg": {
   "a": [
    "<code>place</code> пишет в базу, тестовой базы нет — <b>вместо базы mock</b>: поддельный <code>manager</code>",
    "Функция place пишет в базу внутри transaction: find one, update, save. В unit-тесте базы нет, и она не нужна. Поэтому вместо базы даём mock, то есть поддельный объект. В папке order создаём файл order service spec ts, с восьмой строки объект manager."
   ],
   "b": [
    "<code>jest.fn()</code> — <b>поддельная функция, которая запоминает вызовы</b>; а <code>transaction</code> передаёт mock в callback",
    "Jest fn — поддельная функция: она запоминает, что её вызвали и с какими аргументами. Find one, query, save — все такие. В шестнадцатой строке data source: его функция transaction сразу вызывает callback и передаёт ему наш manager. Place думает, что это настоящая база."
   ],
   "c": [
    "<code>Test.createTestingModule</code>: <b>даём Nest mock вместо <code>DataSource</code></b>, <code>OrderService</code> настоящий",
    "С двадцать третьей строки тестовый модуль Nest. В списке providers order service настоящий, а вместо data source — наш поддельный объект. Nest его inject-ит, order service разницы не знает. Repository тоже нужен, хватит пустого объекта: place его не использует."
   ],
   "d": [
    "Итог: в каждом тесте <b>товар задаём мы через <code>mockResolvedValue</code></b> — на складе 1 или 10",
    "Итог: теперь в каждом тесте складом управляем мы. Через mock resolved value говорим, что вернёт find one: на складе один Колонка или десять. Базы нет, но place работает ровно в настоящем коде. Теперь напишем четыре теста."
   ]
  }
 },
 "10": {
  "kicker": "Этап 3 · error path",
  "title": "Синхронная ошибка — expect(() => …).toThrow(), ошибка promise — await expect(…).rejects.toThrow(): четыре теста, все зелёные",
  "seg": {
   "a": [
    "Синхронная ошибка: <b><code>expect(() =&gt; …)</code> — оборачиваем функцию</b>, Jest вызывает её сам",
    "Первые два теста — для синхронной ошибки. Смотрите: внутри expect не вызываем функцию сразу: скобки, стрелка, потом вызов. Jest сам вызывает эту обёртку и ловит ошибку. Внутри to throw сообщение: нет номера телефона. Если сообщение не совпадёт, тест красный."
   ],
   "b": [
    "Ошибка promise: <b><code>await expect(…).rejects.toThrow()</code></b> — функция вызывается сразу, promise ждём",
    "Третий тест — для ошибки promise, форма другая. Внутри expect place вызывается сразу, без обёртки, потому что возвращает promise. Потом rejects: ждём, что promise завершится ошибкой. И в начале await: пусть Jest дождётся результата. В mock на складе один Колонка, в корзине два."
   ],
   "c": [
    "Четвёртый тест — happy path: <b>на складе 10, итого 100 000</b>, <code>query</code> вызван один раз",
    "Четвёртый тест — happy path: на складе десять, заказ проходит, итого сто тысяч сум. И ещё одна проверка: manager query вызван один раз, то есть update ушёл. В терминале VS Code npm test order service: все четыре теста зелёные."
   ],
   "d": [
    "Итог: <b>синхронная — обёртка и <code>toThrow</code>, promise — <code>rejects</code> и <code>await</code></b>; теперь поменяем их местами",
    "Итог: для синхронной ошибки — обёртка и to throw, для ошибки promise — rejects и await. Оба зелёные, но форма важна. На следующих двух экранах нарочно поменяем их местами и посмотрим, что сделает Jest. Результат вас удивит."
   ]
  }
 },
 "11": {
  "kicker": "Этап 3 · ломаем",
  "title": "Если ошибку склада написать через toThrow, Jest не даёт красного — падает сам процесс, нет ни PASS, ни FAIL",
  "seg": {
   "a": [
    "Тест на склад теперь <b>с <code>toThrow</code></b> — синхронная форма, для ошибки promise",
    "Тест теперь с обёрткой и to throw, нет await, нет rejects. Выглядит правильно: и сообщение то же. Npm test order service."
   ],
   "b": [
    "Результат: <b>нет ни PASS, ни FAIL</b> — в терминале ошибка и <code>Node.js v24.18.0</code>, процесс упал",
    "Посмотрите на результат. Нет PASS, нет FAIL, нет строки tests. Только ошибка: Колонка, на складе остался только один, и версия Node. Упал сам процесс Jest. Вы ждали, что тест будет красным, а он вообще не дал результата."
   ],
   "c": [
    "Значит, причина: <b><code>toThrow</code> вызвал обёртку, <code>place</code> вернул promise, ошибка пришла позже</b> — её никто не поймал",
    "Значит, причина в одном месте. To throw вызвал обёртку, place вернул promise, и в этот момент ошибки не было. Тест посчитался пройденным. Ошибка бросилась позже, внутри promise, её никто не поймал, и Node остановил весь процесс. Это скрытая ошибка: не красный, а пусто."
   ],
   "d": [
    "Итог: для ошибки promise — <b>не <code>toThrow</code>, а <code>rejects</code></b> — иначе Jest вам ничего не скажет",
    "Итог: для ошибки внутри promise пишется не to throw, а rejects. Иначе Jest вам ничего не скажет, процесс упадёт. Если в классе ученик говорит, что результат теста не выходит, первым делом спросите: ошибка внутри promise? Теперь посмотрим обратный случай."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченный в тесте <code>rejects</code>",
    "Тест на склад написан правильно: есть await и rejects. Теперь ломаем намеренно. Ломаете вы сами: в файле order service spec подсвечена пятьдесят первая строка, нажмите на неё: тест перейдёт в синхронную форму первого теста.",
    "Нажмите на <b><code>await expect(…).rejects</code></b> в 51-й строке <b>order.service.spec.ts</b> — тест перейдёт в форму <code>expect(() =&gt; …).toThrow</code>."
   ]
  }
 },
 "12": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4",
  "title": "Тест телефона написали через await expect(service.place(…)).rejects.toThrow(). place бросает ошибку сразу, внутри функции. Результат?",
  "q": "Поставим форму для promise на синхронную ошибку. Вторая проверка. Тест телефона написали через rejects, но place бросает ошибку телефона сразу, в самой функции, не возвращая promise. Что скажет npm test? Выберите вариант.",
  "ok": "Верно. При вызове place ошибка бросилась сразу, expect ещё не запустился. Jest считает, что упал сам тест, и даёт FAIL с сообщением: нет номера телефона. На этот раз результат есть, потому что ошибка синхронная и Jest её поймал. Значит, rejects ловит только ошибку, пришедшую из promise.",
  "okShort": "Ошибка брошена до <code>expect</code> — FAIL, Jest поймал. <code>rejects</code> — только для ошибки promise.",
  "hint": "Когда вызывается service.place(…) — внутри expect, до rejects. Когда бросается ошибка?",
  "demak": "<code>rejects</code> ловит только ошибку, пришедшую из promise; синхронная ошибка бросается до <code>expect</code>.",
  "opts": [
   "PASS — rejects ловит и синхронную ошибку",
   "Процесс упал — результата нет, как на экране 11",
   "FAIL — ошибка брошена до запуска expect",
   "PASS — await оборачивает ошибку в promise"
  ],
  "wrong": {
   "0": "rejects ждёт promise; ошибка брошена до запуска expect.",
   "1": "На этот раз ошибка синхронная — Jest поймал её внутри теста, результат есть.",
   "3": "await не оборачивает ошибку; она брошена уже в момент вызова place."
  }
 },
 "13": {
  "kicker": "Этап 3 · внутри",
  "title": "rejects верный, но нет await и сообщение нарочно неверное: Jest нашёл ошибку, но не смог привязать её к тесту — снова нет результата",
  "seg": {
   "a": [
    "Форма почти верная: <code>rejects</code> есть, <b>только нет <code>await</code></b>; и сообщение мы нарочно написали неверно",
    "Ещё одна скрытая ошибка, на этот раз гораздо тоньше. Rejects есть, to throw есть, только в начале нет await. И сообщение мы нарочно написали неверно: Планшет, осталось девять, а в коде Колонка, один. Тест должен быть красным. Npm test."
   ],
   "b": [
    "Результат: Jest <b>нашёл разницу — <code>Expected</code> Планшет, <code>Received</code> Колонка</b>, но PASS/FAIL снова нет",
    "Посмотрите на результат. Jest нашёл разницу: expected Планшет, received Колонка, тридцать седьмая строка. Но внизу снова версия Node, нет PASS, нет FAIL. Jest увидел ошибку, но не смог привязать её к тесту."
   ],
   "c": [
    "Значит, причина: <b>без <code>await</code> тест сразу закончился</b>, promise отклонился позже — Jest не знал, к какому тесту это записать",
    "Значит, причина одна: нет await. Тестовая функция закончилась сразу, не дождавшись promise. Promise отклонился позже, Jest не знал, чья это ошибка, и остановил процесс. С await это был бы обычный красный тест, с сообщением."
   ],
   "d": [
    "Итог: <b>перед <code>rejects</code> всегда <code>await</code></b>; если результата нет вообще — проверьте promise и <code>await</code>",
    "Итог: перед rejects всегда await, а тестовая функция — async. Если Jest вообще не даёт результата, это не ошибка кода, а форма теста: to throw на ошибке promise или rejects без await. Теперь найдёте эту строку сами."
   ]
  }
 },
 "14": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4 — какая строка с ошибкой?",
  "title": "В этом тестовом файле npm test не даёт результата — процесс падает. Найдите строку-виновника",
  "q": "Вы видели скрытую ошибку, теперь найдите её сами. Третья проверка. В этом тестовом файле npm test не даёт результата, процесс падает. Одна строка во фрагменте не ждёт promise. Нажмите на эту строку.",
  "ok": "Верно. В этой строке нет await: тест заканчивается, не дождавшись promise, ошибка приходит позже, и Jest не может привязать её к тесту. На экране исправленная строка: с await. Теперь неверное сообщение даёт обычный красный тест, с expected и received. Значит, если результата нет, сначала ищите await перед rejects.",
  "okShort": "Нет <code>await</code> — тест не дождался promise, процесс упал. С <code>await</code> — обычный FAIL, с <code>Expected</code>/<code>Received</code>.",
  "hint": "Какая строка возвращает promise и не ждёт его? Что должно стоять перед rejects?",
  "task": "Правило: ошибка promise ожидается через <code>await expect(…).rejects.toThrow()</code>. В этом фрагменте одна строка не ждёт promise. <b>Нажмите на эту строку.</b>"
 },
 "15": {
  "kicker": "Этап 4 · граница и «не должно быть»",
  "title": "На пути ошибки тест ждёт двух вещей: ошибка вышла и склад не изменился — not.toHaveBeenCalled()",
  "seg": {
   "a": [
    "Ошибка вышла — это половина. Проверяем ещё, что <b>после ошибки <code>UPDATE</code> не ушёл</b>",
    "Вернёмся к тесту склада. Ошибка вышла — это половина. Вопрос важнее: остался ли склад неизменным после ошибки? В order service ts проверка в тридцать шестой строке стоит до update. Если кто-то поменяет порядок, ошибка выйдет, но склад всё равно уменьшится."
   ],
   "b": [
    "<code>expect(manager.query).not.toHaveBeenCalled()</code> — <b>mock запомнил вызовы</b>, мы спрашиваем",
    "Здесь помогает mock. Manager query — jest fn, он запоминает, что его вызвали. Мы спрашиваем: not to have been called, то есть не вызывался вообще. На пути ошибки это самая важная строка: пусть бот, выдав ошибку, всё равно не уменьшает склад."
   ],
   "c": [
    "В happy path наоборот: <b><code>toHaveBeenCalledTimes(1)</code></b> — <code>UPDATE</code> ушёл ровно один раз",
    "В тесте happy path наоборот: to have been called times один. Update ушёл ровно один раз, не два и не ноль. С mock вы считаете, что код отправил в базу: что ушло, а что нет."
   ],
   "d": [
    "Итог: тест error path <b>из двух частей</b>: ошибка вышла, а следующий шаг не выполнен",
    "Итог: тест пути ошибки состоит из двух частей. Первая: ошибка вышла, с правильным сообщением. Вторая: после ошибки не случилось то, чего не должно быть. Вторую большинство не пишет, и именно здесь бот теряет деньги. Теперь ломаем границу."
   ]
  }
 },
 "16": {
  "kicker": "Этап 4 · ломаем",
  "title": "Если проверку склада сделать <=, при остатке ровно 2 нельзя купить 2 — четыре теста остаются зелёными, краснеет тест границы",
  "seg": {
   "a": [
    "Сломано: <b><code>&lt;=</code> вместо <code>&lt;</code></b> — на складе 2, берут 2, бот говорит «осталось только 2»",
    "Меньше теперь меньше или равно. Если на складе два и клиент берёт два, бот даёт ошибку: осталось только два. Последний товар никогда не продаётся. Npm test order service."
   ],
   "b": [
    "Четыре теста <b>остались зелёными</b>: они проверяют 1 и 10, а не границу",
    "Все четыре теста зелёные. Причина: тест склада проверяет остаток один, happy path — десять. Оба далеко от границы. Разница между «меньше» и «меньше или равно» видна только тогда, когда два числа равны. Так же, как ошибка пагинации на первом уроке по Jest."
   ],
   "c": [
    "Пятый тест — <b>на складе ровно 2, берут 2</b>: теперь красный, «осталось только 2»",
    "Добавляем пятый тест: в mock на складе ровно два, в корзине два. Заказ должен пройти, итого сто тысяч. С правильным кодом все пять зелёные. Со сломанным кодом пятый красный: на складе осталось только два. Один знак, и один тест его поймал."
   ],
   "d": [
    "Итог: на каждое условие <b><code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> — тест границы</b> — со значением ровно на равенстве",
    "Итог: если видите в коде «меньше», «больше», «меньше или равно», напишите тест со значением ровно на равенстве. Такой тест обычно самый короткий и ловит больше всего ошибок. Восстанавливаем условие, все пять зелёные. Теперь тесты order service напишете сами."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченный в условии <code>&lt;</code>",
    "Проверка склада работает правильно. Теперь ломаем границу. Ломаете вы сами: в тридцать шестой строке order service ts подсвечен знак меньше, нажмите на него: он станет меньше или равно.",
    "Нажмите на <b><code>&lt;</code></b> в 36-й строке <b>order.service.ts</b> — станет <code>&lt;=</code>."
   ]
  }
 },
 "17": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Проверьте через mock три ошибки и границу place, потом сломайте код и увидьте красный",
  "seg": {
   "a": [
    "Теперь вы: <b><code>order.service.spec.ts</code></b> — mock, три ошибки, граница и одна поломка",
    "Теперь ваша очередь. В папке order пишете order service spec ts: mock, три ошибки, happy path и граница. Образец кода на экране можно открыть, но пишите сами, не копируйте. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>mock и четыре теста</b> — синхронный <code>toThrow</code>, promise <code>rejects</code>, <code>not.toHaveBeenCalled</code>",
    "На первом шаге пишете mock manager и тестовый модуль. На втором — четыре теста: телефон и корзина синхронно через to throw, склад через await rejects с проверкой, что query не вызывался, happy path с итогом. Npm test order service: все четыре зелёные."
   ],
   "c": [
    "Шаги 3–4: <b>тест границы и поломка <code>&lt;=</code></b>; подтверждение — имя покрасневшего (✕) теста",
    "На третьем шаге добавляете тест границы: на складе ровно два. На четвёртом ломаете в order service ts «меньше» на «меньше или равно», смотрите, какой тест покраснел, и восстанавливаете через git checkout. В поле подтверждения напишите имя покрасневшего теста."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы проверяете путь ошибки без базы и сами видели, что тест границы ловит ошибку."
   ]
  },
  "steps": [
   {
    "t": "Mock и модуль",
    "exp": "файл готов",
    "cmds": [
     "src/api/order/order.service.spec.ts — manager, dataSource, Test.createTestingModule (9-й экран)"
    ]
   },
   {
    "t": "Четыре теста",
    "exp": "Tests: 4 passed, 4 total"
   },
   {
    "t": "Граница",
    "exp": "Tests: 5 passed, 5 total"
   },
   {
    "t": "Поломка и восстановление",
    "exp": "✕ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi",
    "cmds": [
     "order.service.ts, строка 36: < → <=",
     null,
     null
    ]
   }
  ],
  "proof": {
   "label": "Имя теста, покрасневшего (✕) на шаге 4 — не команда",
   "placeholder": "например: chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi",
   "wrong": "Напишите сюда не команду, а имя теста рядом со знаком ✕ в терминале, например: chegara: omborda aynan 2 ta."
  },
  "trouble": [
   [
    "Результата нет вообще, Node.js v24…",
    "для ошибки promise — toThrow или нет await перед rejects (экраны 11, 13)"
   ],
   [
    "Nest can't resolve dependencies of the OrderService (?, DataSource)… \"OrderRepository\" at index [0]",
    "в providers нет getRepositoryToken(Order) — добавьте с пустым объектом (экран 9)"
   ],
   [
    "Received message: \"Mahsulot topilmadi: Kolonka\"",
    "в этом тесте не написан mockResolvedValue — findOne вернул undefined, код сказал «не найден»"
   ],
   [
    "На шаге 4 всё ✓",
    "в тесте границы не stock: 2 — в mock должно быть ровно 2 и в корзине 2"
   ]
  ]
 },
 "18": {
  "kicker": "Этап 5 · HTTP и AI",
  "title": "Сайт проверяется так же: supertest отправляет запрос в приложение Nest, не открывая сервер — GET / 200 и JSON, GET /nope 404",
  "seg": {
   "a": [
    "Вопрос из Jest-1: <b>«а сайт можно тестировать?»</b> — да, один пакет: <code>supertest</code>",
    "На первом уроке по Jest был вопрос: бот я проверил, а сайт? Ответ: точно так же, с одним дополнительным пакетом. В терминале VS Code npm i минус D supertest и types supertest. Supertest отправляет запрос в приложение Nest, не открывая сервер."
   ],
   "b": [
    "<code>app.controller.spec.ts</code>: <b>поднимаем приложение Nest в памяти</b> — <code>createNestApplication</code>, <code>app.init()</code>",
    "В папке src, api создаём app controller spec ts. В before all тестовый модуль только с app controller, потом create nest application и init. Приложение поднято в памяти, порт не открыт, базы нет. В after all закрываем."
   ],
   "c": [
    "Два теста: <b><code>GET /</code> → 200 и <code>{ ok: true }</code></b>, <code>GET /nope</code> → 404 «Cannot GET /nope»",
    "Первый тест: get, корневой адрес. Статус двести, тело ok true и service order bot, через to equal. Второй — error path: несуществующий адрес. Статус четыреста четыре, сообщение cannot get nope. Npm test app controller: оба зелёные."
   ],
   "d": [
    "Итог: <b>запрос → статус и тело</b>; handler бота и route сайта проверяются одинаково",
    "Итог: HTTP-тест отправляет запрос и проверяет статус и тело. И handler бота, и route сайта проверяются одним способом: даётся ввод, сравнивается вывод. В API побольше этот шаблон повторяется для каждого route. Теперь проверим."
   ]
  }
 },
 "19": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "В приложении есть только route GET /. Тест отправил GET /nope. Чему будут равны res.status и res.body.message?",
  "q": "Вы видели HTTP-тест, теперь проверим. Четвёртая проверка. В приложении только один route, корень. Тест отправил запрос на несуществующий адрес, nope. Какими будут статус и сообщение? Выберите вариант.",
  "ok": "Верно. На несуществующий адрес Nest сам возвращает четыреста четыре, в теле message: cannot get nope. Это не ошибка в вашем коде, а ожидаемый error path, и тест ждёт именно его. Значит, несуществующий адрес — не пятьсот, а четыреста четыре: ошибка клиента, а не сервера.",
  "okShort": "Нет route → сам Nest даёт 404 и <code>Cannot GET /nope</code> — это ожидаемый error path.",
  "hint": "Какой номер выходит, если открыть в браузере несуществующую страницу? Nest возвращает то же.",
  "demak": "несуществующий адрес — 404, ошибка клиента; 500 — ошибка сервера. Тест различает их.",
  "opts": [
   "200 и { ok: true } — Nest перенаправляет на корень",
   "500 — ненайденный route это ошибка сервера",
   "Тест падает — supertest не отправляет на несуществующий адрес",
   "404 и Cannot GET /nope — собственный ответ Nest"
  ],
  "wrong": {
   "0": "Nest не перенаправляет: если route нет — 404.",
   "1": "500 — ошибка внутри кода; нет route — обычный 404.",
   "2": "supertest отправляет на любой адрес; приходит ответ 404, тест не падает."
  }
 },
 "20": {
  "kicker": "Этап 5 · AI",
  "title": "Продолжение нового навыка: AI написал тесты edge и ошибок — два набора, оба зелёные; теперь принимаем их",
  "seg": {
   "a": [
    "Снова этап AI: <b>тесты edge и ошибок пишет AI, вы их принимаете</b>",
    "Как и на первом уроке по Jest, последний этап — с AI. Разница: на этот раз AI пишет не happy path, а тесты edge и ошибок, то есть сегодняшнюю тему. Мы дали двум разным AI один простой промпт и принесли результат."
   ],
   "b": [
    "Промпт: <b>«напиши edge case и тесты ошибок для place и проверки телефона»</b> — без подсказок",
    "Промпт простой: напиши jest-тесты для edge case и ошибочных ситуаций функции place в order service и проверки номера телефона, пусть npm test будет зелёным. Rejects, await, граница, mock — ни одного из этих слов в промпте нет. Каждый AI работал в отдельной копии проекта."
   ],
   "c": [
    "Результат хороший: <b>50 и 42 теста, код не тронут</b>, <code>rejects</code> и <code>await</code> верные, есть тесты «не должно быть»",
    "Результат выглядит хорошо. Оба добавили только тестовые файлы и не тронули код. Первый написал пятьдесят тестов, второй сорок два, все зелёные. Оба написали для ошибки promise rejects и await, процесс не упал. Оба проверили, что после ошибки update не ушёл."
   ],
   "d": [
    "Но: оба <b>не вынесли правило</b> и <b>записали отказ номеру с пробелами как «правильный»</b>",
    "Но есть две вещи. Ни один не вынес правило телефона: оба проверяют его через весь handler, подделывая четыре сервиса, у первого сто сорок девять строк. И оба записали в тест, что номер с пробелами правильно отклоняется, а мы на шестом экране нашли, что это ошибка."
   ],
   "e": [
    "Итог: <b>зелёный — ещё не проверка</b>; проверим поломкой — и ещё вопрос: тест проверяет правило или запечатывает код",
    "Итог: зелёный — ещё не проверка, на следующем экране проверим пятью поломками. И появился новый вопрос: тест от AI проверяет правило или запечатывает то, как код работает сейчас? Тест номера с пробелами — второе."
   ]
  }
 },
 "21": {
  "kicker": "Этап 5 · внутри",
  "title": "Пять поломок — все три набора поймали всё; а шестую «поломку» сломать нельзя: AI запечатал отказ номеру с пробелами",
  "seg": {
   "a": [
    "Пять поломок — <b>пять сегодняшних правил</b>: граница regex, <code>&lt;=</code>, порядок, сообщение, пустая корзина",
    "Мы взяли пять поломок, каждая — одно сегодняшнее правило. В regex девять на восемь. «Меньше» на «меньше или равно». Update раньше проверки склада. Изменить сообщение ошибки. Убрать проверку пустой корзины. Проверили все три набора: наш и двух AI."
   ],
   "b": [
    "Результат: <b>все три набора поймали все пять</b> — на этот раз AI хорошо написал путь ошибки",
    "Результат: все три набора поймали все пять поломок. Наши двадцать пять тестов краснели по одному на каждую поломку. Первый AI заметил изменение сообщения тремя тестами, нарушение порядка — двумя. Второй AI тоже заметил всё. На этот раз AI хорошо написал путь ошибки, это признаём."
   ],
   "c": [
    "Шестой «поломки» нет в таблице: <b>AI запечатал отказ номеру с пробелами</b> — исправление <code>replace</code> делает его тест красным",
    "Но одна вещь в таблицу не помещается, потому что её нельзя сломать: пробел. Оба AI запечатали тестом отказ номеру с пробелами. Если вы исправите через replace с шестого экрана, их тест покраснеет. Тест охраняет не правило, а текущий код. О привычке клиента AI не знает."
   ],
   "d": [
    "Итог: тест от AI <b>ловит ошибку, но и запечатывает текущее поведение</b> — у каждого теста спрашивайте «это правило?»",
    "Итог: тест от AI делает две вещи. Ловит ошибку — это хорошо. И запечатывает текущее поведение, в том числе ошибку. Читайте каждый тест и спрашивайте: это правило или код просто сейчас так работает? Теперь попробуете со своим AI."
   ]
  }
 },
 "22": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Дайте своему AI промпт с точными условиями, потом четыре проверки и три поломки",
  "seg": {
   "a": [
    "Теперь вы: даёте AI <b>промпт с точными условиями</b> — для пути ошибки <code>setStatus</code>",
    "Теперь ваша очередь. Поручаете своему AI написать тесты, тема: функция set status в order service и её путь ошибки. Промпт копируете кнопкой ниже. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: промпт и <b>четыре проверки</b> — diff, <code>await</code> + <code>rejects</code>, <code>not.toHaveBeenCalled</code>, «это правило?»",
    "На первом шаге даёте промпт. На втором проверяете результат: в git diff stat только spec-файл, в ошибке promise есть await и rejects, есть тест, что после ошибки increment не вызывался. И у каждого теста спросите: это правило или код просто сейчас так работает?"
   ],
   "c": [
    "Шаги 3–4: <b>три поломки</b> — пусть все покраснеют; подтверждение — результат",
    "На третьем шаге по очереди ломаете set status в трёх местах: уберите проверку отмены, перенесите increment раньше проверки, измените сообщение. После каждой — npm test и git checkout. На непокрасневшее место попросите у AI тест. В поле подтверждения напишите результат."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы принимаете тест пути ошибки от AI по двум частям: ошибка вышла, и следующий шаг не случился."
   ]
  },
  "steps": [
   {
    "t": "Промпт",
    "exp": "PASS",
    "cmds": [
     "промпт выше — своему AI",
     null
    ]
   },
   {
    "t": "Четыре проверки",
    "exp": "4 ✓",
    "cmds": [
     "git diff --stat — только .spec.ts",
     "await перед rejects",
     "есть expect(manager.increment).not.toHaveBeenCalled()",
     "каждый тест — «правило» или «код сейчас так работает»? Отметьте вторые"
    ]
   },
   {
    "t": "Три поломки",
    "exp": "каждая ✕",
    "cmds": [
     "order.service.ts setStatus: уберите проверку if (order.status === 'CANCELLED')",
     "перенесите цикл increment раньше проверки",
     "allaqachon bekor qilingan → bekor — после каждой npm test и git checkout -- src/api/order/order.service.ts"
    ]
   },
   {
    "t": "Непокрасневшее место",
    "exp": "все три ✕",
    "cmds": [
     "AI: «<поломку> не поймал ни один тест — напиши тест на это правило»",
     "повторите 3-й шаг"
    ]
   }
  ],
  "proof": {
   "label": "Результат трёх поломок",
   "placeholder": "например: покраснели все три · или: порядок increment — сначала не покраснел, добавил тест",
   "wrong": "После каждой поломки напишите результат npm test."
  },
  "trouble": [
   [
    "в git diff --stat есть и order.service.ts",
    "AI изменил код — git checkout -- src/api/order/order.service.ts, повторите пункт «Не трогай»"
   ],
   [
    "Результата нет вообще, Node.js v24…",
    "AI использовал toThrow на promise или нет await — экраны 11, 13; исправьте строку вручную"
   ],
   [
    "При поломке порядка increment всё ✓",
    "нет теста «не должно быть» — попросите not.toHaveBeenCalled (экран 15)"
   ],
   [
    "order.items undefined",
    "в заказе из mock нет items: [] — дайте mock'у items"
   ]
  ]
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m4b-03 · «Edge cases va error path»",
  "title": "Урок ученика: KitobShop orderTotal, «клиент-хитрец» и guard — маленький вариант без базы пути, который вы знаете",
  "seg": {
   "a": [
    "m4b-03 — 21 экран: <b>guard для <code>orderTotal</code></b>, клиент-хитрец даёт 0 и минус",
    "Теперь подготовка к классу. Урок ученика m4b-03, двадцать один экран. Ученик добавляет guard в функцию order total с первого урока по Jest: если пришёл ноль, минус или текст, она бросает ошибку. Урок объясняет это на примере клиента-хитреца: клиента, который делает странный заказ. Базы нет, promise нет, всё синхронно."
   ],
   "b": [
    "Слова урока ученика: <b>хитрец — edge case, guard — <code>if</code> <code>throw</code> <code>return</code></b>, обернуть — <code>expect(() =&gt; …)</code>",
    "Слова из урока ученика: клиент-хитрец — это edge case. Guard — это if, throw, return. Обернуть — это скобки со стрелкой внутри expect. А «незаметная поломка» на карточке — скрытая поломка: неверный результат без ошибки. В классе говорите слово вместе с термином."
   ],
   "c": [
    "Вы добавляете: <b>тест из двух частей, результат без <code>() =&gt;</code>, обе стороны границы</b>",
    "Что вы добавляете к уроку. В тесте guard две части: ошибка вышла, и подсчёт не выполнен. Один раз покажите в настоящем терминале, что будет без обёртки: результата нет, сегодня вы это видели сами. В домашнем задании пусть проверят apply coupon ровно на границах ноль и сто."
   ],
   "d": [
    "Итог: если ученик говорит «результат теста не выходит» — <b>нет <code>() =&gt;</code></b>; внизу три ситуации и вопросы",
    "Итог: если ученик говорит, что результат теста вообще не выходит, сначала посмотрите на обёртку внутри expect. Если вышло did not throw, guard нет или условие пропустило значение. Внизу три ситуации и готовые ответы на вопросы учеников."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "Клиент написал «+998 90 123 45 67», бот ответил «Raqam noto'g'ri». Какой это путь?",
    "e": "Настоящий номер, правило узкое.",
    "o": [
     "Edge case — правило уже привычки клиента",
     "Error path — код нарочно дал ошибку, это верно",
     "Happy path — номер верный, бот тоже",
     "Не ошибка — клиент написал неверно"
    ]
   },
   {
    "q": "const PHONE внутри service, экспорта нет. Что делаете в тесте?",
    "e": "Одно место, его вызывают и бот, и тест.",
    "o": [
     "Поднимаем весь бот и подделываем сообщение Telegram",
     "Выносим правило в отдельную функцию и проверяем её",
     "Копируем regex в тест и проверяем там",
     "Делаем service any и лезем в PHONE"
    ]
   },
   {
    "q": "place бросает ошибку склада внутри transaction. Какая форма верная?",
    "e": "Ошибка promise — rejects и await.",
    "o": [
     "expect(() => service.place(u, c)).toThrow('…') — с обёрткой",
     "expect(service.place(u, c)).toThrow('…')",
     "await expect(service.place(u, c)).rejects.toThrow('…')",
     "expect(await service.place(u, c)).toThrow('…') — await внутри"
    ]
   },
   {
    "q": "Для ошибки promise написали toThrow. Что покажет npm test?",
    "e": "Ошибка в promise, её никто не поймал.",
    "o": [
     "FAIL — сообщение не совпало",
     "PASS — ошибка не поймана, тест прошёл",
     "FAIL — toThrow сразу отклоняет promise",
     "Результата нет — процесс упал, Node.js v24"
    ]
   },
   {
    "q": "expect(service.place(u, c)).rejects.toThrow('…') — нет await, сообщение неверное. Результат?",
    "e": "Тест закончился, не дождавшись promise.",
    "o": [
     "Результата нет — Jest не смог привязать ошибку к тесту",
     "FAIL — разница Expected / Received показана точно",
     "PASS — rejects сам дождётся promise",
     "Ошибка TypeScript — перед rejects обязателен await"
    ]
   },
   {
    "q": "Что проверяется в тесте пути ошибки, кроме «ошибка вышла»?",
    "e": "«Чего не должно быть» — not.toHaveBeenCalled.",
    "o": [
     "За сколько миллисекунд вышла ошибка — скорость",
     "Что после ошибки UPDATE не вызывался",
     "Какой файл есть в stack ошибки",
     "Что объект ошибки типа Error"
    ]
   },
   {
    "q": "В mock проверены склад 1 и 10. В коде сломали < → <=. Тесты?",
    "e": "Разница только при точном равенстве.",
    "o": [
     "Оба FAIL — потому что граница сломана",
     "Тест склада FAIL, happy PASS",
     "Оба PASS — граница не проверена",
     "Результата нет — mock падает"
    ]
   },
   {
    "q": "Через supertest отправили GET /nope, route нет. Ответ?",
    "e": "Собственный ответ Nest 404 — ожидаемый error path.",
    "o": [
     "500 — сервер не нашёл route",
     "200 — Nest перенаправляет на корень",
     "Тест падает — потому что адреса не существует",
     "404 и Cannot GET /nope — ответ Nest"
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
  ru(S5, { ...head(5), ...((typeof RU_S !== 'undefined' && RU_S.S5) || {}) });
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S8, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.S8) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S11, { ...head(11), ...((typeof RU_S !== 'undefined' && RU_S.S11) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S16, { ...head(16), ...((typeof RU_S !== 'undefined' && RU_S.S16) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S20, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.S20) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P7.S, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.P7_S) || {}) });
  ru(P7.steps, RU_MDT[7].steps);
  ru(P7.trouble, RU_MDT[7].trouble);
  ru(P7.proof, RU_MDT[7].proof);
  ru(P17.S, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.P17_S) || {}) });
  ru(P17.steps, RU_MDT[17].steps);
  ru(P17.trouble, RU_MDT[17].trouble);
  ru(P17.proof, RU_MDT[17].proof);
  ru(P22.S, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.P22_S) || {}) });
  ru(P22.steps, RU_MDT[22].steps);
  ru(P22.trouble, RU_MDT[22].trouble);
  ru(P22.proof, RU_MDT[22].proof);
  ru(FINAL, RU_MDT[24].final);
})();
