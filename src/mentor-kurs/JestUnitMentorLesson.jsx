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

// AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-kod.py — OrderBotNest teglari va haqiqiy test fayllaridan aynan (qo'lda tahrirlanmaydi)
const KOD_TX_SOM = {
 "file": "src/api/telegram/texts.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "import { CartItem, Order, OrderStatus, Product } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// 120000 → \"120 000 so'm\"",
   "n": 3
  },
  {
   "t": "export const som = (n: number) => `${n.toLocaleString('ru-RU')} so'm`;",
   "n": 4
  }
 ]
};
const KOD_TX_STATUS = {
 "file": "src/api/telegram/texts.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "export const STATUS_UZ: Record<OrderStatus, string> = {",
   "n": 6
  },
  {
   "t": "  NEW: '🆕 Yangi',",
   "n": 7
  },
  {
   "t": "  CONFIRMED: '✅ Tasdiqlangan',",
   "n": 8
  },
  {
   "t": "  DELIVERED: '🚚 Yetkazilgan',",
   "n": 9
  },
  {
   "t": "  CANCELLED: '❌ Bekor qilingan',",
   "n": 10
  },
  {
   "t": "};",
   "n": 11
  }
 ]
};
const KOD_KB_NAV = {
 "file": "src/api/telegram/keyboards.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "  const nav: ReturnType<typeof Markup.button.callback>[] = [];",
   "n": 18
  },
  {
   "t": "  if (page > 0) nav.push(Markup.button.callback('◀', `page:${page - 1}`));",
   "n": 19
  },
  {
   "t": "  nav.push(Markup.button.callback(`${page + 1}/${pages}`, 'noop'));",
   "n": 20
  },
  {
   "t": "  if (page < pages - 1)",
   "n": 21
  },
  {
   "t": "    nav.push(Markup.button.callback('▶', `page:${page + 1}`));",
   "n": 22
  },
  {
   "t": "  rows.push(nav);",
   "n": 23
  },
  {
   "t": "  rows.push([Markup.button.callback('🛒 Savat', 'cart')]);",
   "n": 24
  },
  {
   "t": "  return Markup.inlineKeyboard(rows);",
   "n": 25
  }
 ]
};
const KOD_KB_ORDER = {
 "file": "src/api/telegram/keyboards.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "// Admin: har buyurtma ostida status tugmalari (\"status:<id>:<STATUS>\")",
   "n": 37
  },
  {
   "t": "export const orderKeyboard = (o: Order) => {",
   "n": 38
  },
  {
   "t": "  if (o.status === 'DELIVERED' || o.status === 'CANCELLED') return undefined;",
   "n": 39
  },
  {
   "t": "  const row =",
   "n": 40
  },
  {
   "t": "    o.status === 'NEW'",
   "n": 41
  },
  {
   "t": "      ? [",
   "n": 42
  },
  {
   "t": "          Markup.button.callback('✅ Tasdiqlash', `status:${o.id}:CONFIRMED`),",
   "n": 43
  },
  {
   "t": "          Markup.button.callback('❌ Bekor', `status:${o.id}:CANCELLED`),",
   "n": 44
  },
  {
   "t": "        ]",
   "n": 45
  },
  {
   "t": "      : [",
   "n": 46
  },
  {
   "t": "          Markup.button.callback('🚚 Yetkazildi', `status:${o.id}:DELIVERED`),",
   "n": 47
  },
  {
   "t": "          Markup.button.callback('❌ Bekor', `status:${o.id}:CANCELLED`),",
   "n": 48
  },
  {
   "t": "        ];",
   "n": 49
  },
  {
   "t": "  return Markup.inlineKeyboard([row]);",
   "n": 50
  },
  {
   "t": "};",
   "n": 51
  }
 ]
};
const KOD_PKG_TEST = {
 "file": "package.json",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "    \"test\": \"jest\",",
   "n": 14
  }
 ]
};
const KOD_PKG = {
 "file": "package.json",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "  \"jest\": {",
   "n": 45
  },
  {
   "t": "    \"moduleFileExtensions\": [",
   "n": 46
  },
  {
   "t": "      \"js\",",
   "n": 47
  },
  {
   "t": "      \"json\",",
   "n": 48
  },
  {
   "t": "      \"ts\"",
   "n": 49
  },
  {
   "t": "    ],",
   "n": 50
  },
  {
   "t": "    \"rootDir\": \"src\",",
   "n": 51
  },
  {
   "t": "    \"testRegex\": \".*\\\\.spec\\\\.ts$\",",
   "n": 52
  },
  {
   "t": "    \"transform\": {",
   "n": 53
  },
  {
   "t": "      \"^.+\\\\.ts$\": \"ts-jest\"",
   "n": 54
  },
  {
   "t": "    },",
   "n": 55
  },
  {
   "t": "    \"testEnvironment\": \"node\"",
   "n": 56
  },
  {
   "t": "  }",
   "n": 57
  }
 ]
};
const KOD_SPEC02 = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { som } from './texts';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('som', () => {",
   "n": 3
  },
  {
   "t": "  it(\"120000 ni so'mda yozadi\", () => {",
   "n": 4
  },
  {
   "t": "    expect(som(120000)).toBe(\"120 000 so'm\");",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "});",
   "n": 7
  }
 ]
};
const KOD_SPEC04 = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { som } from './texts';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('som', () => {",
   "n": 3
  },
  {
   "t": "  it(\"120000 ni so'mda yozadi\", () => {",
   "n": 4
  },
  {
   "t": "    // toLocaleString('ru-RU') minglarni bo'linmas probel (U+00A0) bilan ajratadi",
   "n": 5
  },
  {
   "t": "    expect(som(120000)).toBe(\"120\\u00a0000 so'm\");",
   "n": 6
  },
  {
   "t": "  });",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "  it(\"kichik sonda probel yo'q\", () => {",
   "n": 9
  },
  {
   "t": "    expect(som(500)).toBe(\"500 so'm\");",
   "n": 10
  },
  {
   "t": "  });",
   "n": 11
  },
  {
   "t": "});",
   "n": 12
  }
 ]
};
const KOD_SPEC05 = {
 "file": "src/api/telegram/yolgon.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { som } from './texts';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('som', () => {",
   "n": 3
  },
  {
   "t": "  it(\"120000 ni so'mda yozadi\", () => {",
   "n": 4
  },
  {
   "t": "    console.log(som(120000));",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "});",
   "n": 7
  }
 ]
};
const KOD_SPEC06 = {
 "file": "src/api/telegram/savat.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { CartItem } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { som, texts } from './texts';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "const items = [",
   "n": 4
  },
  {
   "t": "  { product: { name: 'Kolonka', price: 50000 }, qty: 2 },",
   "n": 5
  },
  {
   "t": "] as CartItem[];",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "describe('texts.cart', () => {",
   "n": 8
  },
  {
   "t": "  it('etalon koddan', () => {",
   "n": 9
  },
  {
   "t": "    const t = texts.cart(items, 100000);",
   "n": 10
  },
  {
   "t": "    expect(t).toContain(`Jami: ${som(100000)}`);",
   "n": 11
  },
  {
   "t": "  });",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "  it(\"etalon qo'lda\", () => {",
   "n": 14
  },
  {
   "t": "    const t = texts.cart(items, 100000);",
   "n": 15
  },
  {
   "t": "    expect(t).toContain(\"Jami: 100\\u00a0000 so'm\");",
   "n": 16
  },
  {
   "t": "  });",
   "n": 17
  },
  {
   "t": "});",
   "n": 18
  }
 ]
};
const KOD_SPEC06B = {
 "file": "src/api/telegram/tobe.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "describe('toBe va toEqual', () => {",
   "n": 1
  },
  {
   "t": "  it('toBe', () => {",
   "n": 2
  },
  {
   "t": "    expect([['◀', '2/3', '▶']]).toBe([['◀', '2/3', '▶']]);",
   "n": 3
  },
  {
   "t": "  });",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "  it('toEqual', () => {",
   "n": 6
  },
  {
   "t": "    expect([['◀', '2/3', '▶']]).toEqual([['◀', '2/3', '▶']]);",
   "n": 7
  },
  {
   "t": "  });",
   "n": 8
  },
  {
   "t": "});",
   "n": 9
  }
 ]
};
const KOD_SPEC_KB = {
 "file": "src/api/telegram/keyboards.spec.ts",
 "tag": "jest1-done",
 "lines": [
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { catalogKeyboard, orderKeyboard } from './keyboards';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "// Faqat tugmalar matni va callback'i — qolgani bizga kerak emas",
   "n": 4
  },
  {
   "t": "const buttons = (kb: ReturnType<typeof orderKeyboard>) =>",
   "n": 5
  },
  {
   "t": "  kb?.reply_markup.inline_keyboard.map((row) =>",
   "n": 6
  },
  {
   "t": "    row.map((b) => [b.text, 'callback_data' in b ? b.callback_data : '']),",
   "n": 7
  },
  {
   "t": "  );",
   "n": 8
  },
  {
   "t": "",
   "n": 9
  },
  {
   "t": "const order = (status: Order['status']) => ({ id: 7, status }) as Order;",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "describe('orderKeyboard', () => {",
   "n": 12
  },
  {
   "t": "  it('yangi buyurtma — Tasdiqlash va Bekor', () => {",
   "n": 13
  },
  {
   "t": "    expect(buttons(orderKeyboard(order('NEW')))).toEqual([",
   "n": 14
  },
  {
   "t": "      [",
   "n": 15
  },
  {
   "t": "        ['✅ Tasdiqlash', 'status:7:CONFIRMED'],",
   "n": 16
  },
  {
   "t": "        ['❌ Bekor', 'status:7:CANCELLED'],",
   "n": 17
  },
  {
   "t": "      ],",
   "n": 18
  },
  {
   "t": "    ]);",
   "n": 19
  },
  {
   "t": "  });",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  it('tasdiqlangan — Yetkazildi va Bekor', () => {",
   "n": 22
  },
  {
   "t": "    expect(buttons(orderKeyboard(order('CONFIRMED')))).toEqual([",
   "n": 23
  },
  {
   "t": "      [",
   "n": 24
  },
  {
   "t": "        ['🚚 Yetkazildi', 'status:7:DELIVERED'],",
   "n": 25
  },
  {
   "t": "        ['❌ Bekor', 'status:7:CANCELLED'],",
   "n": 26
  },
  {
   "t": "      ],",
   "n": 27
  },
  {
   "t": "    ]);",
   "n": 28
  },
  {
   "t": "  });",
   "n": 29
  },
  {
   "t": "",
   "n": 30
  },
  {
   "t": "  it(\"yetkazilgan va bekor qilingan — tugma yo'q\", () => {",
   "n": 31
  },
  {
   "t": "    expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();",
   "n": 32
  },
  {
   "t": "    expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();",
   "n": 33
  },
  {
   "t": "  });",
   "n": 34
  },
  {
   "t": "});",
   "n": 35
  },
  {
   "t": "",
   "n": 36
  },
  {
   "t": "const p = (id: number, stock = 5) =>",
   "n": 37
  },
  {
   "t": "  ({ id, name: `M${id}`, price: 1000, stock }) as any;",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "// Oxirgidan oldingi qator — sahifalash: ◀ · 2/3 · ▶",
   "n": 40
  },
  {
   "t": "const nav = (kb: ReturnType<typeof catalogKeyboard>) => {",
   "n": 41
  },
  {
   "t": "  const rows = kb.reply_markup.inline_keyboard;",
   "n": 42
  },
  {
   "t": "  return rows[rows.length - 2].map((b) => b.text);",
   "n": 43
  },
  {
   "t": "};",
   "n": 44
  },
  {
   "t": "",
   "n": 45
  },
  {
   "t": "describe('catalogKeyboard', () => {",
   "n": 46
  },
  {
   "t": "  it(\"birinchi sahifada ◀ yo'q\", () => {",
   "n": 47
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(1), p(2)], 0, 3))).toEqual(['1/3', '▶']);",
   "n": 48
  },
  {
   "t": "  });",
   "n": 49
  },
  {
   "t": "",
   "n": 50
  },
  {
   "t": "  it(\"o'rtada ikkalasi bor\", () => {",
   "n": 51
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(3), p(4)], 1, 3))).toEqual(['◀', '2/3', '▶']);",
   "n": 52
  },
  {
   "t": "  });",
   "n": 53
  },
  {
   "t": "",
   "n": 54
  },
  {
   "t": "  it(\"oxirgi sahifada ▶ yo'q\", () => {",
   "n": 55
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(5)], 2, 3))).toEqual(['◀', '3/3']);",
   "n": 56
  },
  {
   "t": "  });",
   "n": 57
  },
  {
   "t": "",
   "n": 58
  },
  {
   "t": "  it('bitta sahifa — faqat 1/1', () => {",
   "n": 59
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(1)], 0, 1))).toEqual(['1/1']);",
   "n": 60
  },
  {
   "t": "  });",
   "n": 61
  },
  {
   "t": "",
   "n": 62
  },
  {
   "t": "  it('tugagan mahsulot bosilmaydi', () => {",
   "n": 63
  },
  {
   "t": "    const row = catalogKeyboard([p(9, 0)], 0, 1).reply_markup",
   "n": 64
  },
  {
   "t": "      .inline_keyboard[0];",
   "n": 65
  },
  {
   "t": "    expect(row[0]).toMatchObject({",
   "n": 66
  },
  {
   "t": "      text: 'M9 · tugagan',",
   "n": 67
  },
  {
   "t": "      callback_data: 'noop',",
   "n": 68
  },
  {
   "t": "    });",
   "n": 69
  },
  {
   "t": "  });",
   "n": 70
  },
  {
   "t": "});",
   "n": 71
  }
 ]
};
const KOD_SPEC_OP = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { texts } from './texts';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "const order = {",
   "n": 4
  },
  {
   "t": "  id: 42,",
   "n": 5
  },
  {
   "t": "  phone: '+998901234567',",
   "n": 6
  },
  {
   "t": "  total: 50000,",
   "n": 7
  },
  {
   "t": "  status: 'NEW',",
   "n": 8
  },
  {
   "t": "  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],",
   "n": 9
  },
  {
   "t": "} as unknown as Order;",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "describe('texts.orderPlaced', () => {",
   "n": 12
  },
  {
   "t": "  it('buyurtma qatori va jami', () => {",
   "n": 13
  },
  {
   "t": "    const t = texts.orderPlaced(order);",
   "n": 14
  },
  {
   "t": "    expect(t).toContain('Buyurtma #42 qabul qilindi!');",
   "n": 15
  },
  {
   "t": "    expect(t).toContain(\"Jami: 50\\u00a0000 so'm\");",
   "n": 16
  },
  {
   "t": "    expect(t).toContain('Telefon: +998901234567');",
   "n": 17
  },
  {
   "t": "  });",
   "n": 18
  },
  {
   "t": "});",
   "n": 19
  }
 ]
};
const KOD_AI1_STATUS = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "describe('STATUS_UZ', () => {",
   "n": 41
  },
  {
   "t": "  it('har bir status uchun matn bor', () => {",
   "n": 42
  },
  {
   "t": "    const all: OrderStatus[] = ['NEW', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];",
   "n": 43
  },
  {
   "t": "    expect(Object.keys(STATUS_UZ).sort()).toEqual([...all].sort());",
   "n": 44
  },
  {
   "t": "    for (const s of all) expect(STATUS_UZ[s]).toBeTruthy();",
   "n": 45
  },
  {
   "t": "  });",
   "n": 46
  },
  {
   "t": "});",
   "n": 47
  }
 ]
};
const KOD_AI1_NORM = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "// toLocaleString('ru-RU') guruhlarni oddiy probel bilan emas, NBSP (U+00A0)",
   "n": 4
  },
  {
   "t": "// yoki ICU versiyasiga qarab U+202F bilan ajratadi — solishtirishdan oldin",
   "n": 5
  },
  {
   "t": "// shu ikki belgini oddiy probelga keltiramiz (\\n tegilmaydi).",
   "n": 6
  },
  {
   "t": "const norm = (s: string) => s.replace(/[\\u00a0\\u202f]/g, ' ');",
   "n": 7
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nWed Nov  4 01:42:57 PM +05 2026\nHEAD f2eca2f tgpg-done: bekor qilishda buyurtma qatori qulfl\njest 30.5.2\nts-jest 29.4.15\ntypescript 5.9.3\ntelegraf 4.16.3";
const KOD_OUT_01 = "{\n  \"test\": \"jest\",\n  \"jest\": {\n    \"moduleFileExtensions\": [\n      \"js\",\n      \"json\",\n      \"ts\"\n    ],\n    \"rootDir\": \"src\",\n    \"testRegex\": \".*\\\\.spec\\\\.ts$\",\n    \"transform\": {\n      \"^.+\\\\.ts$\": \"ts-jest\"\n    },\n    \"testEnvironment\": \"node\"\n  }\n}\n\n$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nNo tests found, exiting with code 1\nRun with `--passWithNoTests` to exit with code 0\nIn …/OrderBotNest/src\n  27 files checked.\n  testMatch:  - 0 matches\n  testPathIgnorePatterns: /node_modules/ - 27 matches\n  testRegex: .*\\.spec\\.ts$ - 0 matches\nPattern:  - 0 matches\n[chiqish kodi: 1]";
const KOD_OUT_02 = "$ npx jest texts\nFAIL src/api/telegram/texts.spec.ts\n  som\n    ✕ 120000 ni so'mda yozadi (18 ms)\n\n  ● som › 120000 ni so'mda yozadi\n\n    expect(received).toBe(expected) // Object.is equality\n\n    Expected: \"120 000 so'm\"\n    Received: \"120 000 so'm\"\n\n      3 | describe('som', () => {\n      4 |   it(\"120000 ni so'mda yozadi\", () => {\n    > 5 |     expect(som(120000)).toBe(\"120 000 so'm\");\n        |                         ^\n      6 |   });\n      7 | });\n      8 |\n\n      at Object.<anonymous> (api/telegram/texts.spec.ts:5:25)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 total\nSnapshots:   0 total\nTime:        0.396 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 1]";
const KOD_OUT_03 = "$ node -e \"…JSON.stringify(som) + belgilar kodi\"\n\"120 000 so'm\"\n0031 0032 0030 00a0 0030 0030 0030 0020 0073 006f 0027 006d\n[chiqish kodi: 0]";
const KOD_OUT_04 = "$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (16 ms)\n    ✓ kichik sonda probel yo'q (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.37 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]";
const KOD_OUT_05 = "$ npx jest yolgon\n  console.log\n    120 000 so'm\n\n      at Object.<anonymous> (api/telegram/yolgon.spec.ts:5:13)\n\nPASS src/api/telegram/yolgon.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (31 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.392 s, estimated 1 s\nRan all test suites matching yolgon.\n[chiqish kodi: 0]";
const KOD_OUT_06 = "# som() buzildi: ru-RU → en-US\n4:export const som = (n: number) => `${n.toLocaleString('en-US')} so'm`;\n\n$ npx jest savat --verbose\nFAIL src/api/telegram/savat.spec.ts\n  texts.cart\n    ✓ etalon koddan (17 ms)\n    ✕ etalon qo'lda (1 ms)\n\n  ● texts.cart › etalon qo'lda\n\n    expect(received).toContain(expected) // indexOf\n\n    Expected substring: \"Jami: 100 000 so'm\"\n    Received string:    \"Savat:\n    • Kolonka × 2 = 100,000 so'm·\n    Jami: 100,000 so'm\"\n\n      14 |   it(\"etalon qo'lda\", () => {\n      15 |     const t = texts.cart(items, 100000);\n    > 16 |     expect(t).toContain(\"Jami: 100\\u00a0000 so'm\");\n         |               ^\n      17 |   });\n      18 | });\n      19 |\n\n      at Object.<anonymous> (api/telegram/savat.spec.ts:16:15)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 passed, 2 total\nSnapshots:   0 total\nTime:        0.388 s, estimated 1 s\nRan all test suites matching savat.\n[chiqish kodi: 1]";
const KOD_OUT_06A = "$ npx jest savat --verbose\nPASS src/api/telegram/savat.spec.ts\n  texts.cart\n    ✓ etalon koddan (15 ms)\n    ✓ etalon qo'lda (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.388 s, estimated 1 s\nRan all test suites matching savat.\n[chiqish kodi: 0]";
const KOD_OUT_06B = "$ npx jest tobe --verbose\nFAIL src/api/telegram/tobe.spec.ts\n  toBe va toEqual\n    ✕ toBe (6 ms)\n    ✓ toEqual (1 ms)\n\n  ● toBe va toEqual › toBe\n\n    expect(received).toBe(expected) // Object.is equality\n\n    If it should pass with deep equality, replace \"toBe\" with \"toStrictEqual\"\n\n    Expected: [[\"◀\", \"2/3\", \"▶\"]]\n    Received: serializes to the same string\n\n      1 | describe('toBe va toEqual', () => {\n      2 |   it('toBe', () => {\n    > 3 |     expect([['◀', '2/3', '▶']]).toBe([['◀', '2/3', '▶']]);\n        |                                 ^\n      4 |   });\n      5 |\n      6 |   it('toEqual', () => {\n\n      at Object.<anonymous> (api/telegram/tobe.spec.ts:3:33)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 passed, 2 total\nSnapshots:   0 total\nTime:        0.382 s, estimated 1 s\nRan all test suites matching tobe.\n[chiqish kodi: 1]";
const KOD_OUT_07 = "$ npx jest keyboards --verbose\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        0.417 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 0]";
const KOD_OUT_08 = "39:  if (o.status === 'DELIVERED') return undefined;\n\n$ npx jest keyboards\nFAIL src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (4 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor (1 ms)\n    ✕ yetkazilgan va bekor qilingan — tugma yo'q (2 ms)\n\n  ● orderKeyboard › yetkazilgan va bekor qilingan — tugma yo'q\n\n    expect(received).toBeUndefined()\n\n    Received: {\"reply_markup\": {\"inline_keyboard\": [[{\"callback_data\": \"status:7:DELIVERED\", \"hide\": false, \"text\": \"🚚 Yetkazildi\"}, {\"callback_data\": \"status:7:CANCELLED\", \"hide\": false, \"text\": \"❌ Bekor\"}]]}}\n\n      31 |   it(\"yetkazilgan va bekor qilingan — tugma yo'q\", () => {\n      32 |     expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();\n    > 33 |     expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();\n         |                                               ^\n      34 |   });\n      35 | });\n      36 |\n\n      at Object.<anonymous> (api/telegram/keyboards.spec.ts:33:47)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 2 passed, 3 total\nSnapshots:   0 total\nTime:        0.417 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 1]";
const KOD_OUT_09 = "$ npx jest keyboards --verbose\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (14 ms)\n    ✓ o'rtada ikkalasi bor (1 ms)\n    ✓ oxirgi sahifada ▶ yo'q\n    ✓ bitta sahifa — faqat 1/1\n    ✓ tugagan mahsulot bosilmaydi (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       8 passed, 8 total\nSnapshots:   0 total\nTime:        0.422 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 0]";
const KOD_OUT_10 = "21:  if (page <= pages - 1)\n\n$ npx jest keyboards\nFAIL src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (15 ms)\n    ✓ o'rtada ikkalasi bor\n    ✕ oxirgi sahifada ▶ yo'q (3 ms)\n    ✕ bitta sahifa — faqat 1/1 (1 ms)\n    ✓ tugagan mahsulot bosilmaydi (1 ms)\n\n  ● catalogKeyboard › oxirgi sahifada ▶ yo'q\n\n    expect(received).toEqual(expected) // deep equality\n\n    - Expected  - 0\n    + Received  + 1\n\n      Array [\n        \"◀\",\n        \"3/3\",\n    +   \"▶\",\n      ]\n\n      54 |\n      55 |   it(\"oxirgi sahifada ▶ yo'q\", () => {\n    > 56 |     expect(nav(catalogKeyboard([p(5)], 2, 3))).toEqual(['◀', '3/3']);\n         |                                                ^\n      57 |   });\n      58 |\n      59 |   it('bitta sahifa — faqat 1/1', () => {\n\n      at Object.<anonymous> (api/telegram/keyboards.spec.ts:56:48)\n\n  ● catalogKeyboard › bitta sahifa — faqat 1/1\n\n    expect(received).toEqual(expected) // deep equality\n\n    - Expected  - 0\n    + Received  + 1\n\n      Array [\n        \"1/1\",\n    +   \"▶\",\n      ]\n\n      58 |\n      59 |   it('bitta sahifa — faqat 1/1', () => {\n    > 60 |     expect(nav(catalogKeyboard([p(1)], 0, 1))).toEqual(['1/1']);\n         |                                                ^\n      61 |   });\n      62 |\n      63 |   it('tugagan mahsulot bosilmaydi', () => {\n\n      at Object.<anonymous> (api/telegram/keyboards.spec.ts:60:48)\n\nTest Suites: 1 failed, 1 total\nTests:       2 failed, 6 passed, 8 total\nSnapshots:   0 total\nTime:        0.453 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 1]";
const KOD_OUT_11 = "$ npm test -- --verbose\n\n> order-bot-nest@1.0.0 test\n> jest --verbose\n\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor (1 ms)\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (14 ms)\n    ✓ o'rtada ikkalasi bor\n    ✓ oxirgi sahifada ▶ yo'q\n    ✓ bitta sahifa — faqat 1/1\n    ✓ tugagan mahsulot bosilmaydi\n\nPASS src/api/telegram/texts.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (1 ms)\n    ✓ kichik sonda probel yo'q\n\nTest Suites: 2 passed, 2 total\nTests:       10 passed, 10 total\nSnapshots:   0 total\nTime:        0.462 s, estimated 1 s\nRan all test suites.\n[chiqish kodi: 0]";
const KOD_OUT_12 = "$ ls -a | grep env\n.env.example\n\n$ npm test 2>&1 | tail -5\nTest Suites: 2 passed, 2 total\nTests:       10 passed, 10 total\nSnapshots:   0 total\nTime:        0.451 s, estimated 1 s\nRan all test suites.";
const KOD_OUT_13 = "$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nNo tests found, exiting with code 1\nRun with `--passWithNoTests` to exit with code 0\nIn …/OrderBotNest/src\n  28 files checked.\n  testMatch:  - 0 matches\n  testPathIgnorePatterns: /node_modules/ - 28 matches\n  testRegex: .*\\.spec\\.ts$ - 0 matches\nPattern:  - 0 matches\n[chiqish kodi: 1]";
const KOD_OUT_14 = "$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nNo tests found, exiting with code 1\nRun with `--passWithNoTests` to exit with code 0\nIn …/OrderBotNest/src\n  27 files checked.\n  testMatch:  - 0 matches\n  testPathIgnorePatterns: /node_modules/ - 27 matches\n  testRegex: .*\\.spec\\.ts$ - 0 matches\nPattern:  - 0 matches\n[chiqish kodi: 1]";
const KOD_OUT_20 = "$ git checkout jest1-start\nerror: pathspec 'jest1-start' did not match any file(s) known to git\n[chiqish kodi: 1]\n\n$ git status --short\n M src/api/order/order.service.ts\n\n$ git checkout tgpg-done\nerror: Your local changes to the following files would be overwritten by checkout:\n\tsrc/api/order/order.service.ts\nPlease commit your changes or stash them before you switch branches.\nAborting\n[chiqish kodi: 1]";
const KOD_OUT_21 = "# texts.spec.ts boshqa papkada: src/api/ (texts.ts esa src/api/telegram/ da)\n$ npx jest texts\nFAIL src/api/texts.spec.ts\n  ● Test suite failed to run\n\n    Cannot find module './texts' from 'api/texts.spec.ts'\n\n    However, Jest was able to find:\n    \t'./texts.spec.ts'\n\n    You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['js', 'json', 'ts'].\n\n    See https://jestjs.io/docs/configuration#modulefileextensions-arraystring\n\n    > 1 | import { som } from './texts';\n        | ^\n      2 |\n      3 | describe('som', () => {\n      4 |   it(\"120000 ni so'mda yozadi\", () => {\n\n      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/index.js:1031:11)\n      at Object.<anonymous> (api/texts.spec.ts:1:1)\n\nTest Suites: 1 failed, 1 total\nTests:       0 total\nSnapshots:   0 total\nTime:        0.694 s\nRan all test suites matching texts.\n[chiqish kodi: 1]";
const KOD_OUT_22 = "# yordamchisiz: b.callback_data to'g'ridan-to'g'ri\n$ npx jest kb\nPASS src/api/telegram/kb.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma (6 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.991 s, estimated 1 s\nRan all test suites matching kb.\n[chiqish kodi: 0]";
const KOD_OUT_23 = "# LineCheck fayli (satr raqamlari):\n     1\timport { Order } from '../../core/entity';\n     2\timport { som, texts } from './texts';\n     3\t\n     4\tconst order = {\n     5\t  id: 42,\n     6\t  phone: '+998901234567',\n     7\t  total: 50000,\n     8\t  status: 'NEW',\n     9\t  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],\n    10\t} as unknown as Order;\n    11\t\n    12\tdescribe('texts.orderPlaced', () => {\n    13\t  it('buyurtma qatori va jami', () => {\n    14\t    const t = texts.orderPlaced(order);\n    15\t    expect(t).toContain('Buyurtma #42 qabul qilindi!');\n    16\t    expect(t).toContain(`Jami: ${som(50000)}`);\n    17\t    expect(t).toContain('Telefon: +998901234567');\n    18\t  });\n    19\t});\n\n$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✓ buyurtma qatori va jami (25 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.791 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]\n\n# som() buzildi: ru-RU → en-US\n$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✓ buyurtma qatori va jami (29 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.677 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]";
const KOD_OUT_24 = "# Tuzatilgan (satr raqamlari):\n     1\timport { Order } from '../../core/entity';\n     2\timport { texts } from './texts';\n     3\t\n     4\tconst order = {\n     5\t  id: 42,\n     6\t  phone: '+998901234567',\n     7\t  total: 50000,\n     8\t  status: 'NEW',\n     9\t  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],\n    10\t} as unknown as Order;\n    11\t\n    12\tdescribe('texts.orderPlaced', () => {\n    13\t  it('buyurtma qatori va jami', () => {\n    14\t    const t = texts.orderPlaced(order);\n    15\t    expect(t).toContain('Buyurtma #42 qabul qilindi!');\n    16\t    expect(t).toContain(\"Jami: 50\\u00a0000 so'm\");\n    17\t    expect(t).toContain('Telefon: +998901234567');\n    18\t  });\n    19\t});\n\n$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✓ buyurtma qatori va jami (30 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.709 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]\n\n# som() buzildi: ru-RU → en-US\n$ npx jest texts\nFAIL src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✕ buyurtma qatori va jami (26 ms)\n\n  ● texts.orderPlaced › buyurtma qatori va jami\n\n    expect(received).toContain(expected) // indexOf\n\n    Expected substring: \"Jami: 50 000 so'm\"\n    Received string:    \"Buyurtma #42 qabul qilindi!\n    • Kolonka × 1 = 50,000 so'm·\n    Jami: 50,000 so'm\n    Telefon: +998901234567\n    Holati: 🆕 Yangi\"\n\n      14 |     const t = texts.orderPlaced(order);\n      15 |     expect(t).toContain('Buyurtma #42 qabul qilindi!');\n    > 16 |     expect(t).toContain(\"Jami: 50\\u00a0000 so'm\");\n         |               ^\n      17 |     expect(t).toContain('Telefon: +998901234567');\n      18 |   });\n      19 | });\n\n      at Object.<anonymous> (api/telegram/texts.spec.ts:16:15)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 total\nSnapshots:   0 total\nTime:        0.692 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 1]";
const KOD_OUT_25 = "## ai1 buzilmagan: Tests:       36 passed, 36 total\n10:  CANCELLED: '🆕 Yangi',\n## ai1 CANCELLED → «🆕 Yangi»: Tests:       36 passed, 36 total\n\n## ai2 buzilmagan: Tests:       33 passed, 33 total\n10:  CANCELLED: '🆕 Yangi',\n## ai2 CANCELLED → «🆕 Yangi»: Tests:       1 failed, 32 passed, 33 total\n  ● STATUS_UZ › maps statuses to their Uzbek labels";
const KOD_SPEC_OP_BUZUQ = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { som, texts } from './texts';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "const order = {",
   "n": 4
  },
  {
   "t": "  id: 42,",
   "n": 5
  },
  {
   "t": "  phone: '+998901234567',",
   "n": 6
  },
  {
   "t": "  total: 50000,",
   "n": 7
  },
  {
   "t": "  status: 'NEW',",
   "n": 8
  },
  {
   "t": "  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],",
   "n": 9
  },
  {
   "t": "} as unknown as Order;",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "describe('texts.orderPlaced', () => {",
   "n": 12
  },
  {
   "t": "  it('buyurtma qatori va jami', () => {",
   "n": 13
  },
  {
   "t": "    const t = texts.orderPlaced(order);",
   "n": 14
  },
  {
   "t": "    expect(t).toContain('Buyurtma #42 qabul qilindi!');",
   "n": 15
  },
  {
   "t": "    expect(t).toContain(`Jami: ${som(50000)}`);",
   "n": 16
  },
  {
   "t": "    expect(t).toContain('Telefon: +998901234567');",
   "n": 17
  },
  {
   "t": "  });",
   "n": 18
  },
  {
   "t": "});",
   "n": 19
  }
 ]
};
const KOD_AI_DIFF1 = " src/api/telegram/keyboards.spec.ts | 113 +++++++++++++++++++++++\n src/api/telegram/texts.spec.ts     | 177 +++++++++++++++++++++++++++++++++++++\n 2 files changed, 290 insertions(+)";
const KOD_AI_DIFF2 = " src/api/telegram/keyboards.spec.ts | 111 +++++++++++++++++++++\n src/api/telegram/texts.spec.ts     | 193 +++++++++++++++++++++++++++++++++++++\n 2 files changed, 304 insertions(+)";
const KOD_AI2_LINES = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "ai2",
 "lines": [
  {
   "t": "    expect(som(120000)).toBe(`120 000 so'm`);",
   "n": 33
  },
  {
   "t": "    expect(t).toContain(`Jami: ${som(50000)}`);",
   "n": 134
  }
 ]
};
const KOD_PROMPT1 = "src/api/telegram/texts.ts va keyboards.ts uchun jest testlar yozib ber. npm test yashil bo'lsin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf), Jest sozlangan, testlar `src/` ichida `*.spec.ts`. Vazifa: `src/api/telegram/texts.ts` dagi `texts.cart`, `texts.orderPlaced`, `texts.orderLine` va `STATUS_UZ` uchun unit-testlar yoz. Shartlar: etalonni qo'lda yoz — `som()`, `STATUS_UZ` yoki boshqa sinalayotgan kodni etalonda ishlatma; bo'linmas probelni `\\u00a0` bilan ochiq yoz; `toBeTruthy` bilan matn tekshirma — aniq qiymat yoz; har `it` da kamida bitta `expect`. Tegma: `src/` dagi `.spec.ts` dan boshqa fayllarga. Javobda: qo'shilgan fayllar ro'yxati va `npm test` natijasi.";
const KOD = { TX_SOM: KOD_TX_SOM, TX_STATUS: KOD_TX_STATUS, KB_NAV: KOD_KB_NAV, KB_ORDER: KOD_KB_ORDER, PKG_TEST: KOD_PKG_TEST, PKG: KOD_PKG, SPEC02: KOD_SPEC02, SPEC04: KOD_SPEC04, SPEC05: KOD_SPEC05, SPEC06: KOD_SPEC06, SPEC06B: KOD_SPEC06B, SPEC_KB: KOD_SPEC_KB, SPEC_OP: KOD_SPEC_OP, AI1_STATUS: KOD_AI1_STATUS, AI1_NORM: KOD_AI1_NORM, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '06a': KOD_OUT_06A, '06b': KOD_OUT_06B, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09, '10': KOD_OUT_10, '11': KOD_OUT_11, '12': KOD_OUT_12, '13': KOD_OUT_13, '14': KOD_OUT_14, '20': KOD_OUT_20, '21': KOD_OUT_21, '22': KOD_OUT_22, '23': KOD_OUT_23, '24': KOD_OUT_24, '25': KOD_OUT_25 }, SPEC_OP_BUZUQ: KOD_SPEC_OP_BUZUQ, AI_DIFF1: KOD_AI_DIFF1, AI_DIFF2: KOD_AI_DIFF2, AI2_LINES: KOD_AI2_LINES, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2 };

// ============================================================
//  Jest-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-matn.py (manba: 10-Jest1-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "OrderBotNest'ga birinchi testlarni yozamiz: avval o'zingiz, keyin AI yozgan testni tekshirasiz",
  "seg": [
   [
    "a",
    "Buyurtma boti ishlaydi — bugun uning <b>qoidalarini test bilan qo'riqlaymiz</b>",
    "Assalomu alaykum. O'tgan darsda buyurtma botini PostgreSQL'ga ko'chirdingiz. Bugun uning qoidalarini test bilan qo'riqlaymiz: narx qanday yoziladi, admin qaysi tugmani ko'radi, katalogning oxirgi sahifasida nima bo'ladi. Ekranda natija: o'nta test, yarim soniyada."
   ],
   [
    "b",
    "Avval testni o'zingiz yozasiz, <b>FAIL va PASS'ni o'qishni</b> o'rganasiz",
    "Avval testni qo'lda yozasiz va Jest javobini o'qishni o'rganasiz. Birinchi testning o'zi kutilmagan narsani ko'rsatadi: kod to'g'ri ishlaydi, test qizil, ikki qator esa bir xil ko'rinadi. Sababini darsda bilib olasiz."
   ],
   [
    "c",
    "Keyin testni AI yozadi, siz <b>uni buzib tekshirasiz</b>",
    "Keyin testni AI yozadi. Biz buni ikki xil AI bilan haqiqatan qilib ko'rdik. Ikkalasi o'ttizdan ortiq test yozdi, hammasi yashil. Lekin kodni ataylab buzganimizda ba'zi buzilishlarni hech bir test sezmadi. Shu tekshiruv usulini o'rganasiz."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>",
    "Dars olti bosqichdan iborat, uchta amaliyotda o'zingiz ishlaysiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · nega va qayerda",
  "title": "Smoke butun botni tekshiradi, unit-test — bitta qoidani: biri ikkinchisining o'rnini bosmaydi",
  "seg": [
   [
    "a",
    "Telegraf+PG darsida <b>smoke butun botni tekshirdi</b>: baza, restart va besh mijoz",
    "Telegraf va PostgreSQL darsida smoke skriptini yurgizgansiz. U butun botni tekshiradi: alohida baza ochadi, serverni qayta yoqadi, besh mijozni bir vaqtda yuboradi. Javobi bitta: bot ishlayaptimi yoki yo'q."
   ],
   [
    "b",
    "Unit-test esa <b>bitta funksiyani bitta qoida bilan</b> tekshiradi",
    "Unit-test boshqacha. U bitta funksiyani chaqiradi va bitta qoidani tekshiradi: masalan, katalogning oxirgi sahifasida o'ng strelka chiqmasin. Smoke buni sezmaydi, chunki bot baribir ishlaydi. Unit-test esa xato qaysi funksiyada va qaysi qatorda ekanini aytadi."
   ],
   [
    "c",
    "Testda <b>Telegram ham, baza ham yo'q</b> — u bot yoki sayt ekanini bilmaydi",
    "Endi loyihaning o'zini oching: Telegraf va PostgreSQL darsidagi OrderBotNest papkasini VS Code'da oching. Ekranda bugun yozadigan test: u src, api, telegram papkasidagi texts ts faylidan faqat som funksiyasini import qiladi. Telegram, baza va env fayli kerak emas, env faylisiz o'nta test yarim soniyada o'tdi. Shuning uchun bot ham, sayt ham bir xil sinaladi."
   ],
   [
    "d",
    "Xulosa: smoke — <b>«ishlayaptimi»</b>, unit-test — «shu qoida buzilmadimi»",
    "Xulosa: smoke ishlayaptimi degan savolga javob beradi, unit-test esa shu qoida buzilmadimi degan savolga. Bugun unit-test yozamiz. Saytning so'rov va javobini sinash Jest ikkinchi darsida bo'ladi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · ichida",
  "title": "Jest sozlamasi package.jsonda tayyor: fayl src/ ichida, nomi .spec.ts bilan tugaydi",
  "seg": [
   [
    "a",
    "Loyihada <b>test yozish uchun hamma narsa tayyor</b>: Jest, ts-jest va sozlama",
    "Avval Jest testni qayerdan qidirishini ko'ramiz. VS Code'da OrderBotNest papkasining ildizidagi package json faylini oching. O'n to'rtinchi satrda test buyrug'i: jest. Pastroqda, qirq beshinchi satrdan, jest bo'limi boshlanadi. Nest loyihasida jest va ts jest paketlari allaqachon o'rnatilgan, hech narsa o'rnatmaysiz."
   ],
   [
    "b",
    "Ikki satr hal qiladi: <b><code>rootDir: src</code> va <code>testRegex</code> — <code>.spec.ts</code></b>",
    "Jest bo'limida ikki satr hal qiladi: ellik birinchi va ellik ikkinchi. Root dir src: Jest faqat src papkasi ichini ko'radi. Test regex: fayl nomi spec ts bilan tugashi kerak. Ellik to'rtinchi satrdagi transform ts jest esa TypeScript faylni JavaScript'ga aylantirib beradi."
   ],
   [
    "c",
    "<b>VS Code terminalida <code>npm test</code></b>: hozir test fayli yo'q — <code>No tests found</code>",
    "Endi VS Code'da Terminal menyusidan yangi terminal oching, u OrderBotNest papkasida ochiladi, va npm test yozing. Loyihada hali bitta ham test fayli yo'q, shuning uchun Jest no tests found deydi va bir kodi bilan chiqadi, ya'ni xato. Pastda: yigirma yetti fayl ko'rildi, test regex'ga nol mos keldi."
   ],
   [
    "d",
    "Xulosa: <code>No tests found</code> chiqsa — <b>fayl joyi va nomini</b> tekshiring",
    "Xulosa: no tests found ko'rsangiz, kodni emas, fayl joyi va nomini tekshiring. Sinab ko'rdik: nomi test ts bo'lsa ham, fayl src'dan tashqarida tursa ham, aynan shu xabar chiqadi."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Test fayli test/texts.spec.ts da — loyiha ildizidagi test papkasida. npm test nima deydi?",
  "q": "Jest qayerdan qidirishini ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Test fayli nomi to'g'ri, spec ts bilan tugaydi. Lekin u src ichida emas, loyiha ildizidagi test papkasida turibdi. Npm test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. Root dir src bo'lgani uchun Jest test papkasiga umuman qaramaydi. Sinab ko'rdik: no tests found va bir kodi. Import xatosi chiqishi uchun Jest faylni ochishi kerak edi, u esa faylni ko'rmadi. Demak, test fayli src ichida, sinaladigan faylning yonida turadi.",
  "okShort": "<code>rootDir: src</code> — <code>test/</code> ko'rinmaydi: <code>No tests found</code>.",
  "hint": "rootDir qaysi papkani ko'rsatadi? Fayl o'sha papka ichidami?",
  "demak": "Test fayli <code>src/</code> ichida, sinaladigan faylning yonida turadi.",
  "correct": 2,
  "opts": [
   "PASS — fayl nomi .spec.ts bilan tugaydi",
   "Cannot find module — import yo'li buzildi",
   "No tests found — fayl src/ dan tashqarida",
   "PASS — Jest test/ papkasini o'zi qidiradi"
  ],
  "wrong": {
   "0": "Nom to'g'ri, lekin joy rootDir dan tashqarida.",
   "1": "Import xatosi uchun Jest faylni ochishi kerak — u faylni ko'rmadi.",
   "3": "Nest'ning e2e testlari uchun alohida sozlama kerak; bu loyihada u yo'q."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "Test — uch qismli kod: qaysi funksiya, qaysi vaziyat va qanday natija kutiladi",
  "seg": [
   [
    "a",
    "Birinchi test uchun <b><code>som</code> funksiyasini</b> olamiz: u narxni so'mda yozadi",
    "Birinchi test uchun eng oddiy funksiyani olamiz. VS Code'da src, api, telegram papkasidagi texts ts faylini oching: to'rtinchi satrda som funksiyasi. U sonni oladi va bot matni uchun so'mda yozadi, bir yuz yigirma ming bir yuz yigirma ming so'm bo'ladi. Bot har narxni shu funksiya bilan chiqaradi."
   ],
   [
    "b",
    "Test fayli <b>yonida turadi</b>: <code>texts.ts</code> uchun — <code>texts.spec.ts</code>",
    "Test faylini shu telegram papkasining o'zida, texts ts yonida yaratasiz: Explorer'da papkani o'ng tugma bilan bosib, New File, nomi texts spec ts. Nomi spec ts bilan tugashi shart. Birinchi satrda funksiyani import qilamiz. Telegraf ham, baza ham import qilinmaydi."
   ],
   [
    "c",
    "<code>describe</code> — funksiya, <code>it</code> — vaziyat, <b><code>expect … toBe</code> — kutilgan natija</b>",
    "Keyingi uch qism. Describe som: bu testlar qaysi funksiya haqida. It: bitta vaziyat, nomi oddiy gap bilan yoziladi. Ichida expect: som bir yuz yigirma ming natijasi to be ichidagi etalonga teng bo'lsin. Etalon — kutilgan qiymat, uni qo'lda yozamiz."
   ],
   [
    "d",
    "Xulosa: <b>funksiyani chaqirish, etalon bilan solishtirish</b> — har test shu ikki qadam",
    "Xulosa: har test ikki qadamdan iborat: funksiyani chaqirasiz va natijani qo'lda yozilgan etalon bilan solishtirasiz. Endi testni yurgizamiz: VS Code terminalida npm test, ikki chiziqcha va texts. Fayl nomini qo'shsak, faqat shu test fayli yuradi."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "Test qizil: Expected va Received bir xil ko'rinadi, lekin Jest ularni teng demayapti",
  "seg": [
   [
    "a",
    "FAIL'ni <b>yuqoridan pastga</b> o'qiymiz: avval qaysi test yiqildi",
    "Terminalda npm test, ikki chiziqcha va texts yozdik: test qizil. FAIL'ni yuqoridan pastga o'qiymiz. Nuqtali satr qaysi test yiqilganini aytadi: som guruhidagi bir yuz yigirma ming testi. Testlar ko'p bo'lsa, birinchi shu satrni qidirasiz."
   ],
   [
    "b",
    "Keyin ikki satr: <b><code>Expected</code> — etalon, <code>Received</code> — funksiya qaytargani</b>",
    "Keyingi ikki satr asosiysi. Expected — siz test faylida yozgan matn. Received — som funksiyasi haqiqatda qaytargan matn. Jest sonni emas, shu ikki matnni solishtiradi va ular teng bo'lmasa, test yiqiladi. Lekin qarang: ikkala qator bir xil, bir yuz yigirma ming so'm."
   ],
   [
    "c",
    "Pastda <b>satr raqami</b>: <code>texts.spec.ts:5:25</code> — beshinchi satr, <code>toBe</code> belgisi",
    "Pastda kod bo'lagi: katta belgisi va strelka xato bo'lgan joyni ko'rsatadi, test faylining beshinchi satri, to be. Eng oxirgi qatorda fayl nomi va satr raqami yana yozilgan. VS Code'da texts spec ts faylining aynan shu satrini ochasiz."
   ],
   [
    "d",
    "Demak, sabab bitta joyda: <b>bo'sh joy ikki matnda har xil belgi</b>",
    "Demak, sabab bitta joyda: bir yuz yigirma va ming orasidagi bo'sh joy. Siz klaviaturada oddiy probel yozdingiz, som esa ko'zga ko'rinmaydigan boshqa belgi qo'ydi. Ekranda ikkalasi bir xil ko'rinadi, Jest uchun esa har xil. Keyingi ekranda ikki matnni belgima-belgi solishtirib, shu belgini o'z ko'zingiz bilan ko'rasiz."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida",
  "title": "toLocaleString minglarni oddiy probel bilan emas, bo'linmas probel bilan ajratadi",
  "seg": [
   [
    "a",
    "<code>toBe</code> <b>belgi-belgi solishtiradi</b>: bitta belgi farq qilsa — teng emas",
    "Endi sababini aniqlaymiz. To be ikki matnni belgi-belgi solishtiradi, Jest buni Object is deb yozadi. Ekranda ikki qator: yuqorida Expected, siz yozgan matn, pastda Received, som qaytargan matn. Belgilarni birma-bir taqqoslaymiz: bir, ikki, nol, keyin bo'sh joy."
   ],
   [
    "b",
    "To'rtinchi belgida farq: <b><code>0020</code> — oddiy probel, <code>00a0</code> — bo'linmas probel</b>",
    "Mana farq, to'rtinchi belgida. Expected'da oddiy probel, kodi nol nol ikki nol. Received'da nol nol a nol: bo'linmas probel. Ekranda u oddiy probeldek ko'rinadi, lekin boshqa belgi. Uni to locale string qo'ydi, rus tili qoidasi bo'yicha. Qolgan hamma belgi bir xil, ular yashil."
   ],
   [
    "c",
    "Etalonni <b><code>\\u00a0</code> bilan ochiq yozamiz</b> — endi test yashil va o'qiladi",
    "Kod to'g'ri: bo'linmas probel raqamni Telegram xabarida ikki qatorga bo'lib yubormaydi. Shuning uchun etalonni tuzatamiz va belgini ochiq yozamiz: backslash u, nol nol a nol. Ikkinchi testni kichik son uchun qo'shdik. Ikkalasi yashil."
   ],
   [
    "d",
    "Xulosa: birinchi testning o'zi <b>kod haqida bilmagan narsangizni</b> ko'rsatdi",
    "Xulosa: birinchi testning o'zi siz bilmagan narsani ko'rsatdi. Expected va received bir xil ko'rinsa, ko'rinmas belgini qidiring. Etalonga belgini ochiq yozing, ko'zga ko'rinmaydigan belgining o'zini emas: keyingi odam uni oddiy probel deb o'ylaydi."
   ]
  ]
 },
 "8": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Birinchi testni o'zingiz yozing: avval qizilni ko'ring, keyin sababini topib yashil qiling",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>jest1-start</code> tegida</b> birinchi test faylini yozasiz",
    "Endi navbat sizga. Telegraf va PostgreSQL darsidagi OrderBotNest papkasini ochasiz va jest bir start tegiga o'tasiz. Env fayli va baza kerak emas. O'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: teg, fayl va <b>oddiy probelli etalon</b> — FAIL'ni o'zingiz ko'ring",
    "Birinchi qadamda git fetch va checkout bilan tegga o'tasiz, npm test no tests found deydi. Ikkinchisida texts spec ts faylini yozasiz, etalonni klaviaturadagi oddiy probel bilan. Npm test texts: qizil, ikki qator bir xil."
   ],
   [
    "c",
    "3–4-qadam: <b><code>\\u00a0</code></b> bilan tuzatish va ikkinchi test; isbot — <code>Tests:</code> satri",
    "Uchinchi qadamda etalonga backslash u nol nol a nol yozasiz. To'rtinchisida besh yuz uchun ikkinchi testni qo'shasiz. Isbot maydoniga oxirgi natijaning tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz test yozasiz, FAIL'ni o'qiysiz va ko'rinmas belgini topasiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout jest1-start",
     "npm test"
    ],
    "exp": "No tests found, exiting with code 1"
   },
   {
    "t": "Test — oddiy probel bilan",
    "cmds": [
     "src/api/telegram/texts.spec.ts (5-ekrandagi kod)",
     "npm test -- texts"
    ],
    "exp": "FAIL · Expected: \"120 000 so'm\" · Received: \"120 000 so'm\""
   },
   {
    "t": "Tuzatish",
    "cmds": [
     "etalon \"120\\u00a0000 so'm\"",
     "npm test -- texts"
    ],
    "exp": "PASS"
   },
   {
    "t": "Ikkinchi test",
    "cmds": [
     "it('kichik sonda probel yo\\'q', …) — som(500) → \"500 so'm\""
    ],
    "exp": "Tests: 2 passed, 2 total"
   }
  ],
  "proof": {
   "label": "Oxirgi natijaning Tests: satri",
   "placeholder": "Tests: … qatorini nusxalang",
   "re": "Tests:\\s+2 passed,\\s+2 total",
   "flags": "",
   "wrong": "Ikkala test yashilmi? npm test -- texts natijasidagi Tests: qatorini qo'ying."
  },
  "trouble": [
   [
    "error: pathspec 'jest1-start' did not match",
    "teglar olinmagan — git fetch --tags, keyin checkout"
   ],
   [
    "Your local changes … would be overwritten by checkout",
    "Telegraf+PG darsidagi o'z o'zgarishlaringiz — git stash yoki commit, keyin checkout"
   ],
   [
    "2-qadamda PASS",
    "etalonni nusxa bilan qo'ydingiz — belgi ham ko'chdi; probelni klaviaturadan qayta yozing"
   ],
   [
    "Cannot find module './texts'",
    "fayl src/api/telegram/ da emas — texts.ts yoniga ko'chiring"
   ],
   [
    "No tests found",
    "nomi .spec.ts emas yoki src/ dan tashqarida (3–4-ekran)"
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · yolg'on testlar",
  "title": "expectsiz test har doim yashil: u funksiyani chaqiradi, lekin hech narsani tekshirmaydi",
  "seg": [
   [
    "a",
    "Test yozishni bildingiz — endi <b>testning o'zi qanday aldashini</b> ko'ramiz",
    "Test yozishni bildingiz. Endi testning o'zi qanday aldashini ko'ramiz. Ekranda shu telegram papkasidagi yolgon spec ts fayli. Birinchi tur yolg'on test: unda expect yo'q, faqat console log. Bunday test ko'pincha qo'lda tekshirib ko'rish paytida qoladi."
   ],
   [
    "b",
    "Jest natijani chop etdi va <b>PASS dedi</b> — hech narsa solishtirilmadi",
    "Natija: terminalda Jest qiymatni chop etdi va PASS dedi. Lekin hech narsa solishtirilmadi. Jest uchun qoida oddiy: it ichida xato tashlanmasa, test o'tdi. Xatoni faqat expect tashlaydi."
   ],
   [
    "c",
    "Xulosa: har <code>it</code> ichida <b>kamida bitta <code>expect</code></b> bo'lsin — aks holda u test emas",
    "Xulosa: har it ichida kamida bitta expect bo'lishi kerak, aks holda u test emas, faqat chaqiruv. Bunday test topish oson: console log bor, expect yo'q. Ikkinchi tur esa ancha yashirin, uni keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "Etalonni kodning o'zidan yasasangiz, kod buzilganda etalon ham buziladi — test yashil qoladi",
  "seg": [
   [
    "a",
    "Ikki test savat matnini tekshiradi: <b>biri etalonni <code>som</code>dan oladi, biri qo'lda</b>",
    "Ikkinchi tur. Telegram papkasidagi savat spec ts faylida ikkita test bor, ikkalasi savat matnidagi jami qatorini qidiradi. Birinchisida etalon som funksiyasining o'zidan yasalgan, ikkinchisida qo'lda yozilgan. Chizmaga qarang: hozir som to'g'ri, ikkala etalon ham yuz ming so'm, ikkalasi yashil."
   ],
   [
    "b",
    "Kodni buzamiz: <b>narx endi «100,000» ko'rinishida</b> — bot noto'g'ri yozadi",
    "Endi kodni ataylab buzamiz. Texts ts faylining to'rtinchi satrida, som funksiyasida rus tili o'rniga ingliz tili qoidasini qo'yamiz. Endi bot narxni vergul bilan yozadi: yuz ming emas, yuz, vergul, ming. Mijoz uchun bu boshqa son. Testlarni yurgizamiz."
   ],
   [
    "c",
    "Koddan olingan etalon <b>buzilgan <code>som</code> bilan birga o'zgardi</b> — test yashil",
    "Chizmaga qarang. Som endi yuz, vergul, ming deydi. Birinchi testning etaloni ham som'dan yasaladi, ya'ni u ham yuz, vergul, ming bo'ldi: ikki tomon birga buzildi va test yashil qoldi. Qo'lda yozilgan etalon o'zgarmadi, shuning uchun ikkinchi test qizil."
   ],
   [
    "d",
    "Xulosa: <b>etalon qo'lda yoziladi</b> — sinalayotgan funksiya etalonda ishlatilmaydi",
    "Xulosa: etalon qo'lda yoziladi. Sinalayotgan funksiya etalonni yasashda ishlatilmaydi. Testda dollar va qavs ichida shu funksiya chaqirilgan bo'lsa, bu ogohlantirish belgisi. Endi buni bitta kod bo'lagida o'zingiz topasiz."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu test som buzilganda ham yashil qoladi. Sababchi satrni toping",
  "q": "Yolg'on testni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu test buyurtma qabul qilingan xabarini tekshiradi. Som buzilganda ham u yashil qoladi. Bitta satr etalonni som funksiyasining o'zidan yasaydi. O'sha satrni bosing.",
  "ok": "To'g'ri. Shu satrda etalon som'ning o'zidan yasaladi, shuning uchun som buzilsa, etalon ham u bilan birga buziladi. Ekranda tuzatilgan satr: etalon qo'lda, bo'linmas probel bilan. Endi som buzilsa, test qizaradi. Demak, etalonda sinalayotgan funksiya chaqirilgan satrni qidiring.",
  "okShort": "<code>${som(50000)}</code> — etalon koddan: <code>som</code> buzilsa, ikkala tomon birga buziladi. Qo'lda yozilgan <code>\"Jami: 50\\u00a0000 so'm\"</code> buzilishni ushlaydi.",
  "hint": "Qaysi satrda etalon qo'lda yozilmagan, funksiya chaqiruvidan yasalgan?",
  "task": "Qoida: etalon qo'lda yoziladi, sinalayotgan funksiya etalonda chaqirilmaydi. Bu testda bitta satr etalonni <code>som</code> ning o'zidan yasaydi. <b>O'sha satrni bosing.</b>"
 },
 "12": {
  "type": "Lesson",
  "kicker": "4-bosqich · statuslar va chegara",
  "title": "Buyurtma to'rt statusdan o'tadi — har statusga admin ko'radigan tugmalar uchun bitta test",
  "seg": [
   [
    "a",
    "Admin har buyurtma ostida <b>statusiga qarab tugma</b> ko'radi",
    "Endi admin tugmalarini sinaymiz. Telegraf va PostgreSQL darsidan bilasiz: buyurtma to'rt statusdan o'tadi. Yangi buyurtma ostida tasdiqlash va bekor tugmalari, tasdiqlanganida yetkazildi va bekor. Yetkazilgan yoki bekor qilingan buyurtmada tugma yo'q."
   ],
   [
    "b",
    "Bu qoida <b>bitta funksiyada</b>: <code>orderKeyboard</code> — buyurtma kiradi, klaviatura chiqadi",
    "Bu qoida bitta funksiyada yozilgan: src, api, telegram papkasidagi keyboards ts faylida, o'ttiz yettinchi satrdan, order keyboard. Unga buyurtma beriladi, u Telegraf klaviaturasini qaytaradi yoki undefined. Tugma bosilganda bot callback satrini oladi: status, buyurtma raqami va yangi status."
   ],
   [
    "c",
    "Har statusga <b>bitta <code>it</code></b>: ikki tugma, ikki tugma, <code>toBeUndefined</code>",
    "Test fayli yonida: keyboards spec ts. Har statusga bitta it yozamiz. Beshinchi satrdagi buttons yordamchisi klaviaturadan faqat tugma matni va callback'ni oladi. O'ttiz birinchi satrdagi testda to be undefined: yetkazilgan va bekor qilingan buyurtmada klaviatura yo'q. Terminalda uchala test yashil."
   ],
   [
    "d",
    "Xulosa: <b>har status — bitta vaziyat</b>; bittasi tushib qolsa, o'sha qoida qo'riqlanmaydi",
    "Xulosa: statuslar jadvali bo'lsa, har qatori bitta test bo'ladi. To'rtta status uchun uchta test yozdik, oxirgisida ikkita expect. Birorta status tushib qolsa, o'sha qoida himoyasiz qoladi. Yordamchida nega to equal ishlatilganini keyingi ekranda bilib olasiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Ikki massiv bir xil ko'rinsa ham toBe FAIL beradi: u ichini emas, aynan bitta massivmi — shuni tekshiradi",
  "seg": [
   [
    "a",
    "Bir xil massiv, ikki solishtirish: <b><code>toBe</code> qizil, <code>toEqual</code> yashil</b>",
    "Bir xil ikki massivni ikki usulda solishtiramiz. To be qizil, to equal yashil. Jest xabari ham shuni aytadi: received bir xil satrga aylanadi, lekin to be uni teng demaydi va to strict equal'ni taklif qiladi."
   ],
   [
    "b",
    "<code>toBe</code> — <b>aynan bitta obyektmi</b>; <code>toEqual</code> — ichidagi qiymatlar tengmi",
    "Sababi bunday. Satr va son uchun to be qiymatni solishtiradi. Massiv va obyekt uchun esa u ikkalasi xotirada aynan bitta obyektmi, shuni tekshiradi. Kodda ikki marta yozilgan massiv ikki xil obyekt. To equal esa ichini bittalab solishtiradi."
   ],
   [
    "c",
    "Telegraf tugmaga <b><code>hide: false</code> qo'shadi</b> — shuning uchun yordamchi kerak bo'ldi",
    "Klaviaturada yana bir nozik joy bor. Telegraf har tugmaga hide false maydonini o'zi qo'shadi, kodimizda u yozilmagan. Klaviaturani to'liq solishtirsak, etalonga ham shu maydonni yozishga to'g'ri keladi. Shuning uchun yordamchi faqat matn va callback'ni oladi."
   ],
   [
    "d",
    "Xulosa: <b>son va satr — <code>toBe</code>, massiv va obyekt — <code>toEqual</code></b>",
    "Xulosa: son va satr uchun to be, massiv va obyekt uchun to equal ishlating. Kutubxona qo'shadigan maydonlar testni ortiqcha og'irlashtirsa, solishtirishdan oldin kerakli qismini ajratib oling."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · statuslar va chegara",
  "title": "Bekor qilingan buyurtmaga yana tugma chiqdi — test qaysi qoida buzilganini aniq aytadi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>CANCELLED</code> sharti ustiga bosing",
    "Testlar yashil. Endi kodni ataylab buzamiz, chunki shartdan bitta status tushib qolishi juda oson. Buzishni o'zingiz qilasiz: keyboards ts faylining o'ttiz to'qqizinchi satrida bekor qilingan status sharti yonib turibdi, ustiga bosing.",
    "<b>keyboards.ts</b> 39-satridagi <b><code>|| o.status === 'CANCELLED'</code></b> ustiga bosing — bu bo'lak shartdan o'chadi."
   ],
   [
    "a",
    "Shartdan <b><code>CANCELLED</code> tushib qoldi</b>: kod ishlaydi, server ham xato bermaydi",
    "Bekor qilingan status shartdan tushib qoldi. Bot ishlaydi, server ham xato bermaydi. Lekin admin bekor qilingan buyurtma ostida yana yetkazildi va bekor tugmalarini ko'radi. Testni yurgizamiz."
   ],
   [
    "b",
    "Uchtadan bitta test qizil: <b><code>toBeUndefined</code> kutildi, lekin klaviatura keldi</b>",
    "Uchta testdan bittasi qizil. Nuqtali satr qoidani aytadi: yetkazilgan va bekor qilingan, tugma yo'q. Received qatorida undefined o'rniga klaviatura keldi, ichida yetkazildi va bekor tugmalari. Katta belgisi o'ttiz uchinchi satrda: bekor qilingan status."
   ],
   [
    "c",
    "Xulosa: <b>test nomi qoidani aytadi</b> — FAIL'dan qaysi qoida buzilgani darhol ko'rinadi",
    "Xulosa: test nomini qoida sifatida yozing, masalan «bekor qilingan, tugma yo'q». Shunda FAIL'ning birinchi satridan qaysi qoida buzilganini darhol bilasiz. Shartni tiklaymiz, test yana yashil."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · statuslar va chegara",
  "title": "Xato ko'pincha chegarada: birinchi, oxirgi va yagona sahifa uchun alohida test",
  "seg": [
   [
    "a",
    "Katalog ikkitadan sahifada: <b>◀ birinchi sahifada yo'q, ▶ oxirgisida yo'q</b>",
    "Katalogga o'tamiz. Mahsulotlar ikkitadan sahifada ko'rsatiladi. Birinchi sahifada chap strelka yo'q, oxirgisida o'ng strelka yo'q, o'rtada ikkalasi bor. Mahsulot ikkitadan kam bo'lsa, sahifa bitta va strelka umuman yo'q."
   ],
   [
    "b",
    "To'rt vaziyat — to'rt test: <b>birinchi, o'rta, oxirgi va yagona sahifa</b>",
    "Shu to'rt vaziyatga to'rtta test yozamiz: birinchi, o'rtadagi, oxirgi va yagona sahifa. Keyboards spec ts faylining qirq birinchi satridagi nav yordamchisi klaviaturadan faqat strelkalar qatorini oladi. Beshinchi test tugagan mahsulotni tekshiradi: uni bosib bo'lmaydi."
   ],
   [
    "c",
    "Kichikdan katta o'rniga <b>kichik yoki teng</b>: o'rtadagi sahifa buni sezmaydi",
    "Kodni buzamiz: keyboards ts faylining yigirma birinchi satrida kichik belgisi o'rniga kichik yoki teng. Endi oxirgi sahifada ham o'ng strelka chiqadi. Natija: ikkita test qizil, oxirgi va yagona sahifa. O'rtadagi sahifa testi yashil qoldi, chunki u chegarada emas. Jest farqni plyus belgisi bilan ko'rsatdi."
   ],
   [
    "d",
    "Xulosa: <b>har shartga chegara testi</b> — chegarasiz testlar bu xatoni ko'rmaydi",
    "Xulosa: har shartning chegarasiga alohida test yozing: birinchi, oxirgi va yagona sahifa. Faqat o'rtadagi sahifani sinasangiz, bu xato yashirin qoladi. Kichik va kichik yoki teng farqi faqat chegarada ko'rinadi."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Faqat ikki test bor: «birinchi sahifa» va «o'rtadagi sahifa». Kodda page <= pages - 1 yozildi. npm test nima deydi?",
  "q": "Chegarani ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Faqat ikki test bor: birinchi sahifa va o'rtadagi sahifa. Kodda kichik yoki teng yozildi, ya'ni oxirgi sahifada ham o'ng strelka chiqadi. Npm test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. Birinchi va o'rtadagi sahifada o'ng strelka baribir bor, xato faqat oxirgi sahifada ko'rinadi. Sinab ko'rdik: to'rt test bilan ikkitasi qizardi, oxirgi va yagona sahifa. Bu ikkisi bo'lmasa, test yashil, xato esa kodda. Demak, yashil test faqat sinalgan vaziyatlar haqida gapiradi.",
  "okShort": "Ikkala test chegarada emas — PASS. Xatoni faqat oxirgi va yagona sahifa testlari ushlaydi.",
  "hint": "< va <= qaysi page qiymatida har xil natija beradi? O'sha qiymat testlarda bormi?",
  "demak": "Yashil test faqat sinalgan vaziyatlar haqida gapiradi.",
  "correct": 0,
  "opts": [
   "Ikkalasi PASS — xato faqat oxirgi sahifada",
   "Ikkalasi FAIL — strelka qoidasi buzildi",
   "«o'rtadagi sahifa» FAIL — u ▶ ni ikki marta oladi",
   "TypeScript xato — <= bu yerda ishlamaydi"
  ],
  "wrong": {
   "1": "Birinchi sahifada ▶ to'g'ri chiqadi — xato u yerda ko'rinmaydi.",
   "2": "O'rtada ▶ baribir bor — < ham, <= ham bir xil natija beradi.",
   "3": "<= — to'g'ri TypeScript; xato mantiqda."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Admin tugmalari va katalog uchun testlar yozing, keyin kodni bir marta buzib qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>keyboards.spec.ts</code></b> — statuslar va katalog chegarasi",
    "Endi navbat sizga. Keyboards uchun test faylini yozasiz: admin tugmalari va katalog sahifalari. Ekrandagi testlarni nusxalamang, o'zingiz yozing: etalonni har safar o'zingiz o'ylab chiqasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>har status va to'rt sahifa</b> uchun test; hammasi yashil",
    "Birinchi qadamda order keyboard uchun har statusga test yozasiz. Ikkinchisida catalog keyboard uchun birinchi, oxirgi va yagona sahifa testlari. Npm test keyboards: hammasi yashil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: kodni <b>ataylab buzing</b>, qizilni ko'ring va tiklang; isbot — qizil test nomi",
    "Uchinchi qadamda keyboards faylida bitta shartni buzing: bekor qilingan status yoki kichik yoki teng. Qaysi test qizarganini ko'ring. To'rtinchisida kodni git checkout bilan tiklang. Isbot maydoniga qizargan test nomini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz har status va chegaraga test yozasiz va uning xatoni ushlashini o'zingiz isbotlagansiz."
   ]
  ],
  "steps": [
   {
    "t": "orderKeyboard",
    "cmds": [
     "src/api/telegram/keyboards.spec.ts — NEW, CONFIRMED, DELIVERED / CANCELLED",
     "npm test -- keyboards"
    ],
    "exp": "3 ta ✓"
   },
   {
    "t": "catalogKeyboard",
    "cmds": [
     "birinchi",
     "oxirgi",
     "yagona sahifa (0, 3",
     "2, 3",
     "0, 1)"
    ],
    "exp": "Tests: … passed"
   },
   {
    "t": "Buzish",
    "cmds": [
     "keyboards.ts 39-satrdan o.status === 'CANCELLED' shartini o'chiring yoki 21-satrda < → <=",
     "npm test -- keyboards"
    ],
    "exp": "✕ oxirgi sahifada ▶ yo'q yoki ✕ yetkazilgan va bekor qilingan — tugma yo'q"
   },
   {
    "t": "Tiklash",
    "cmds": [
     "git checkout -- src/api/telegram/keyboards.ts",
     "npm test"
    ],
    "exp": "hammasi ✓"
   }
  ],
  "proof": {
   "label": "3-qadamda qizargan (✕) testning nomi — buyruq emas",
   "placeholder": "masalan: oxirgi sahifada ▶ yo'q",
   "re": "(bekor|oxirgi|bitta|yagona|cancel)",
   "flags": "i",
   "wrong": "Bu yerga buyruqni emas, terminalda ✕ belgisi yonidagi test nomini yozing, masalan: oxirgi sahifada ▶ yo'q."
  },
  "trouble": [
   [
    "toBe bilan serializes to the same string",
    "massiv — toEqual (13-ekran)"
   ],
   [
    "Etalonda hide: false yo'q — FAIL",
    "Telegraf qo'shadi: faqat text va callback_datani ajrating yoki toMatchObject"
   ],
   [
    "3-qadamda hammasi ✓",
    "buzgan shartingizga test yo'q — o'sha vaziyatga test qo'shing (16-ekran)"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI testi",
  "title": "Yangi ko'nikma: AI yozgan testni qabul qilish — avval ikki AI tajribasi",
  "seg": [
   [
    "a",
    "Yangi bosqich, yangi ko'nikma: <b>testni AI yozadi, siz uni qabul qilasiz</b>",
    "Endi yangi bosqich boshlanadi va u boshqa ko'nikma. To'rt bosqichda testni o'zingiz yozdingiz va FAIL'ni o'qishni o'rgandingiz. Ishda esa testni ko'pincha AI yozadi. Sizning ishingiz endi yozish emas, qabul qilish: AI yozgan test haqiqatan xatoni ushlaydimi. Buni ikki xil AI bilan haqiqiy tajribada ko'ramiz."
   ],
   [
    "b",
    "Prompt bitta gap: <b>«test yozib ber, yashil bo'lsin»</b> — mentor odatda shunday yozadi",
    "Tajriba bunday edi. Biz ikki xil AI'ga bir xil oddiy prompt berdik: texts va keyboards uchun jest testlar yozib ber, npm test yashil bo'lsin. Ataylab qisqa, chunki mentor ko'pincha shunday yozadi. Har AI loyihaning alohida nusxasida ishladi."
   ],
   [
    "c",
    "Ikkalasi <b>faqat ikki test fayl qo'shdi</b>, kodga tegmadi: 36 va 33 test, hammasi yashil",
    "Natija yaxshi ko'rinadi. Ikkalasi faqat ikkita test fayl qo'shdi, kodga tegmadi, git diff stat buni tasdiqlaydi. Birinchisi o'ttiz olti, ikkinchisi o'ttiz uchta test yozdi, hammasi yashil. Ikkalasi bo'linmas probelni ham o'zi sezdi."
   ],
   [
    "d",
    "Lekin probelni <b>ikki xil hal qildi</b>: biri almashtiradi, biri ko'rinmas belgini qo'ydi",
    "Lekin probelni ikki xil hal qildi. Birinchisi solishtirishdan oldin bo'linmas probelni oddiysiga almashtiradi va yana bir belgi haqida yozdi: Node versiyasiga qarab u boshqa belgi bo'lishi mumkin. Bizdagi Node'da bunday emas, sinab ko'rdik. Ikkinchisining etalonida esa ko'rinmas belgining o'zi turibdi, yettinchi ekrandagi tuzoq."
   ],
   [
    "e",
    "Xulosa: <b>«hammasi yashil» — tekshiruv emas</b>; testning o'zini tekshirish kerak",
    "Xulosa: ikki AI ham va'dasini bajardi, testlar yashil. Lekin yashil test yaxshi test degani emas. AI aytgan gapni ham tekshiramiz. Testning o'zi xatoni ushlaydimi, buni bilishning bitta ishonchli usulini keyingi ekranda ko'rasiz."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Test to'plamini kodni buzib tekshiramiz: qizarmasa — o'sha buzilish himoyasiz",
  "seg": [
   [
    "a",
    "Usul oddiy: <b>kodni ataylab buzing</b> va nechta test qizarganini sanang",
    "Usul oddiy: kodni ataylab buzing va nechta test qizarganini sanang. Bitta ham qizarmasa, o'sha buzilish himoyasiz. Biz beshta buzish oldik: narx formati, savatdagi narx, bekor qilingan buyurtma tugmasi, oxirgi sahifa va status matni. Uchala to'plamni sinadik."
   ],
   [
    "b",
    "Bizning <b>o'n testimiz ikki buzilishni sezmadi</b>: matnlarni sinamaganmiz",
    "Avval o'zimiznikini tan olamiz. Bizning o'nta testimiz ikki buzilishni sezmadi: savatdagi narx va status matni. Sababi oddiy: texts faylidan faqat som'ni sinaganmiz. Test yo'q joy himoyasiz."
   ],
   [
    "c",
    "36 test <b>status matni o'zgarganini sezmadi</b>: <code>toBeTruthy</code> faqat «bormi» deydi",
    "O'ttiz olti testli to'plam ham status matni o'zgarganini sezmadi. Uning testi faqat har status uchun qandaydir matn borligini tekshiradi, to be truthy bilan. Matn o'zgarsa ham test yashil. Ikkinchi to'plamda esa som buzilganda o'ttiz uchdan faqat bittasi qizardi: etaloni koddan olingan testlar."
   ],
   [
    "d",
    "Xulosa: <b>test soni sifat emas</b> — qaysi buzilishni ushlashi sifat",
    "Xulosa: test soni sifat emas. O'ttiz olti test ham bitta buzilishni o'tkazib yubordi. Sifat — test qaysi buzilishni ushlashi. AI test yozgandan keyin uch to'rt joyda kodni buzib ko'ring. Qizarmagan joyga test qo'shing."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI testi: expect(STATUS_UZ.CANCELLED).toBeTruthy(). Kimdir matnni «Bekor qilingan» dan «Yangi» ga o'zgartirdi. Test nima deydi?",
  "q": "Buzib tekshirishni ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI testi bekor qilingan status matnini to be truthy bilan tekshiradi. Kimdir matnni xato bilan yangi deb o'zgartirdi: mijoz bekor qilingan buyurtmasini yangi deb ko'radi. Test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. To be truthy faqat qiymat bo'sh emasligini tekshiradi. Yangi degan matn ham bo'sh emas, shuning uchun test yashil. Mijoz esa noto'g'ri status ko'radi. Etalonni aniq yozsangiz, test qizaradi. Demak, to be truthy qiymat borligini tekshiradi, to'g'riligini emas.",
  "okShort": "«Yangi» matni ham bo'sh emas — PASS. Statusning to'liq matnini kutgan aniq <code>toBe</code> buni ushlaydi.",
  "hint": "toBeTruthy qaysi qiymatlarda FAIL beradi? «Yangi» matni shulardan birimi?",
  "demak": "<code>toBeTruthy</code> qiymat borligini tekshiradi, to'g'riligini emas.",
  "correct": 1,
  "opts": [
   "FAIL — toBeTruthy matn o'zgarganini sezadi",
   "PASS — toBeTruthy faqat bo'sh emasmi deydi",
   "TypeScript xato — status matni turi o'zgardi",
   "FAIL — ikki status endi bir xil matnda"
  ],
  "wrong": {
   "0": "toBeTruthy matnni etalon bilan solishtirmaydi — faqat bo'sh emasmi.",
   "2": "Ikkalasi ham string — turi o'zgarmadi.",
   "3": "Fayl joyi va nomi o'zgarmadi."
  }
 },
 "21": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga aniq shartli prompt bering, keyin to'rt tekshiruv va uchta buzish",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>shartlari aniq prompt</b> berasiz — <code>texts.ts</code> dagi buyurtma matnlari uchun",
    "Endi navbat sizga. O'z AI'ingizga test yozdirasiz, lekin bu safar shartlari aniq prompt bilan. Mavzu: texts faylidagi savat va buyurtma matnlari. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>diff — faqat <code>.spec.ts</code></b>, etalonda <code>${…}</code> yo'q",
    "Birinchi qadamda promptni berasiz. Ikkinchisida natijani tekshirasiz: git diff stat'da faqat spec fayl bo'lsin, har it'da expect bo'lsin, etalonda dollar va qavs ichida funksiya chaqirilmasin."
   ],
   [
    "c",
    "3–4-qadam: <b>uchta buzish</b> — hammasi qizarsin; isbot — qizarmagan buzish yoki «hammasi»",
    "Uchinchi qadamda kodni uch joyda navbat bilan buzasiz: narx formati, savatdagi narx va status matni. Har biridan keyin npm test, keyin git checkout. Qizarmagan joy bo'lsa, AI'dan o'sha joyga test so'rang. Isbot maydoniga natijani yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan testni soniga qarab emas, buzib tekshirib qabul qilasiz."
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
     "har itda expect",
     "etalonda ${som( yoki ${STATUS_UZ yo'q",
     "grep -c 'u00a0' src/api/telegram/texts.spec.ts — 0 dan katta (escape matni bor)"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Uch buzish",
    "cmds": [
     "texts.ts: 'ru-RU' → 'en-US'",
     "(i.price ?? i.product.price) → i.product.price",
     "'❌ Bekor qilingan' → '🆕 Yangi' — har biridan keyin npm test va git checkout -- src/api/telegram/texts.ts"
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
   "placeholder": "masalan: uchalasi qizardi · yoki: savatdagi narx — avval qizarmadi, test qo'shdim",
   "re": "(qizar|fail|✕|uchala|hammasi|test qo'sh)",
   "flags": "i",
   "wrong": "Har buzishdan keyin npm test natijasini yozing."
  },
  "trouble": [
   [
    "git diff --stat da texts.ts ham bor",
    "AI kodni o'zgartirdi — git checkout -- src/api/telegram/texts.ts, promptdagi «Tegma» bandini takrorlang"
   ],
   [
    "Etalonda ${som(…)} qoldi",
    "AI shartni bajarmadi — o'sha satrlarni qo'lda yozing (10-ekran)"
   ],
   [
    "AI «\\u00a0 bilan ochiq yozdim» dedi, grep -c 'u00a0' → 0",
    "faylda ko'rinmas belgining o'zi — ikkala AI'da ham shunday chiqdi (p2/XULOSA); qatorlarni qo'lda \\u00a0 bilan yozing, keyin npm test"
   ],
   [
    "Savatdagi narx buzilishida hammasi ✓",
    "price (buyurtma paytidagi narx) va product.price har xil bo'lgan test yo'q — ikkalasini farqli qilib test so'rang"
   ],
   [
    "sed yoki tahrirdan keyin fayl o'zgarmadi",
    "qo'lda tahrir qiling va saqlang (VS Code'da nuqta — saqlanmagan)"
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4b-01 · «Unit-test: Jest»",
  "title": "O'quvchi darsi: KitobShop sayti, bitta orderTotal funksiyasi va Jestbot — siz bilgan yo'lning kichik varianti",
  "seg": [
   [
    "a",
    "m4b-01 — 21 ekran: <b>KitobShop sayti</b>, <code>orderTotal</code> — narx ko'paytirish son",
    "Endi sinfga tayyorgarlik, ikki ekran. O'quvchi darsi m4b-01, yigirma bir ekran. Misol — KitobShop sayti: order total funksiyasi narxni songa ko'paytiradi. Ya'ni bot emas, sayt. Lekin describe, it va expect xuddi bugungidek, chunki test faqat funksiyani chaqiradi."
   ],
   [
    "b",
    "O'quvchi darsi <b>Jestbot robot</b> misolida tushuntiradi — siz so'zni atamasi bilan aytasiz",
    "O'quvchi darsi testni robot misolida tushuntiradi, robotning ismi Jestbot. Robot papkasi bu describe, sinov varaqasi bu it, etalon kartochkasi bu expect. Sinfda ikkalasini birga ayting: etalon kartochkasi, ya'ni expect, va o'sha satrni ko'rsating."
   ],
   [
    "c",
    "Siz qo'shasiz: <b>haqiqiy FAIL, kim xato, chegara va buzib ko'rish</b>",
    "Darsga siz qo'shadigan narsalar: o'quvchi darsi natijani kartochkada ko'rsatadi, siz proyektorda haqiqiy FAIL'ni o'qib bering. Har FAIL'da savol bering: kim xato, kodmi yoki etalonmi. Uyga vazifadagi delivery fee'da aynan chegara qiymatini sinattiring. Test yashil bo'lsa, kodni bir marta buzdiring."
   ],
   [
    "d",
    "Xulosa: amaliyot oldidan — <b>test <code>src/</code> ichida, nomi <code>.spec.ts</code></b>, <code>npm install</code> qilingan",
    "Xulosa: amaliyot oldidan uch narsani tekshiring. Repo npm install bilan o'rnatilgan, test fayli src ichida, nomi spec ts bilan tugaydi. Vaqt bo'yicha taklif: to'qson daqiqaning yigirma beshi amaliyotga, chunki sozlashda vaqt ketadi."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Beshta vaziyat va tayyor javoblar — to'rttasini bugun o'zingiz ko'rdingiz",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan beshta vaziyat — <b>to'rttasi bugun sizda ham chiqdi</b>",
    "Endi o'quvchi darsida albatta chiqadigan beshta vaziyatni ko'ramiz. To'rttasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman. Beshinchisi o'quvchi reposiga xos."
   ],
   [
    "b",
    "Topilmadi va <code>npm ci</code> — <b>joy, nom va <code>npm install</code></b>",
    "Birinchisi no tests found: fayl joyi va nomini tekshiring. Ikkinchisi o'quvchi reposiga xos: npm ci yiqiladi, chunki package json va lock fayl sinxron emas. Npm install qiling. Bu repo kamchiligi, o'quvchining xatosi emas."
   ],
   [
    "c",
    "Yolg'on yashil va bir xil ko'ringan FAIL — <b><code>expect</code>, qo'lda etalon, <code>toEqual</code></b>",
    "Uchinchisi: test yashil, lekin expect yo'q yoki etalon koddan olingan. To'rtinchisi: qatorlar bir xil, test qizil: ko'rinmas belgi yoki massivni to be bilan solishtirish. Beshinchisi bo'sh loyiha: eng tez yo'l testni o'quvchi reposida yozdirish."
   ],
   [
    "d",
    "Xulosa: o'quvchi «AI yozdi, yashil» desa — <b>bitta joyni buzdiring</b>",
    "Xulosa va usul: o'quvchi AI test yozdi, hammasi yashil desa, kodda bitta joyni o'zi buzsin va test qizarishini ko'rsin. Javobni darhol aytmang, terminaldagi xabarni birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "package.json: rootDir: \"src\", testRegex: \".*\\\\.spec\\\\.ts$\". Fayl src/order.test.ts. npm test?",
    "o": [
     "No tests found — nomi .spec.ts emas",
     "PASS — Jest .test.ts ni ham oladi",
     "Cannot find module — order topilmadi",
     "PASS — rootDir: src bo'lgani yetadi"
    ],
    "c": 0,
    "e": "Nomi .spec.ts emas.",
    "s": 3
   },
   {
    "q": "Expected: \"120 000 so'm\" · Received: \"120 000 so'm\" — test FAIL. Birinchi qadam?",
    "o": [
     "Jest'ni qayta o'rnatib, yana yurgizish",
     "Belgilar kodini chiqarib solishtirish",
     "Testni o'chirib, qo'lda tekshirib ko'rish",
     "toBe o'rniga toBeTruthy qo'yish"
    ],
    "c": 1,
    "e": "toBe belgi-belgi solishtiradi: U+00A0.",
    "s": 7
   },
   {
    "q": "it ichida faqat console.log(som(120000)). Natija?",
    "o": [
     "FAIL — expect yo'qligi xato sanaladi",
     "No tests found — bo'sh it sanalmaydi",
     "PASS — Jest hech narsani solishtirmadi",
     "SyntaxError — testda console.log taqiq"
    ],
    "c": 2,
    "e": "Xatoni faqat expect tashlaydi.",
    "s": 9
   },
   {
    "q": "Etalon: ` Jami: ${som(100000)} . som` buzildi. Test?",
    "o": [
     "FAIL — som buzilgani darhol sezildi",
     "TypeScript xato — shablon satr noto'g'ri",
     "Cannot find module — som import bo'lmadi",
     "PASS — etalon ham u bilan birga buzildi"
    ],
    "c": 3,
    "e": "Etalon qo'lda yoziladi.",
    "s": 10
   },
   {
    "q": "expect(buttons).toBe([['◀', '1/3']]) — massivlar bir xil, lekin FAIL. Sabab?",
    "o": [
     "toBe bitta obyektni kutadi — toEqual kerak",
     "Massivdagi strelka belgisi boshqa kodda",
     "Jest eskirgan — massivni solishtira olmaydi",
     "Emoji'lar massivda boshqacha saqlanadi"
    ],
    "c": 0,
    "e": "serializes to the same string.",
    "s": 13
   },
   {
    "q": "Testlar faqat birinchi va o'rtadagi sahifani sinaydi, kodda <= xato. Natija?",
    "o": [
     "Ikkalasi FAIL — <= hamma sahifani buzadi",
     "Ikkalasi PASS — xato chegarada yashirin",
     "O'rtadagisi FAIL — u ▶ ni ikki marta oladi",
     "TypeScript xato — <= sonlar uchun emas"
    ],
    "c": 1,
    "e": "Yashil test faqat sinalgan vaziyat haqida.",
    "s": 16
   },
   {
    "q": "AI 36 test yozdi, hammasi yashil. Qabul qilishdan oldin eng ishonchli tekshiruv?",
    "o": [
     "Test sonini sanab, 30 dan ko'pligini ko'rish",
     "Testlarni qayta yurgizib, yana yashil ko'rish",
     "Kodni 3 joyda buzib, test qizarishini ko'rish",
     "AI'dan «hammasini tekshirdingmi» deb so'rash"
    ],
    "c": 2,
    "e": "Son emas — ushlagan buzilish.",
    "s": 19
   },
   {
    "q": "expect(STATUS_UZ.CANCELLED).toBeTruthy(), matn «Yangi» ga o'zgardi. Test?",
    "o": [
     "FAIL — matn «bekor» emas, «yangi» bo'ldi",
     "No tests found — STATUS_UZ topilmadi",
     "TypeScript xato — matn turi o'zgardi",
     "PASS — toBeTruthy faqat bo'sh emasmi"
    ],
    "c": 3,
    "e": "toBeTruthy — bormi, to'g'rimi emas.",
    "s": 20
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
//  Jest-1 — «Buzamiz» (14-ekran) uchun kichik rasm (F-1120-02, M51/M52). Katta rasm — parts/02e-bot.jsx (BotMap + jest qatori).
//  Qiymatlar: jest1v2-out/07 (3 passed), 08 (1 failed, 2 passed; Received — Yetkazildi va Bekor tugmalari). CSS izohida backtick yo'q.
// ============================================================
// broken: shart buzildimi · known: natija ko'rinadimi (M52-3) · fixed · pins: { a, b }
function KbMini({ broken, known, fixed, pins = {} }) {
  const bad = broken && !fixed;
  const res = !broken && !fixed ? null : !known ? '?' : bad ? t('1 failed, 2 passed', '1 failed, 2 passed') : '3 passed';
  const box = (x, w, label, sub, state) => <div className="n1-abs" style={{ left: x, top: 34, width: w, height: 50, borderRadius: 10, border: `2px solid ${state === 'bad' ? '#DC2626' : state === 'ok' ? T.green : T.line}`, background: state === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s' }}>
    <div style={{ font: `700 11.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap' }}>{label}</div>
    <div style={{ font: `500 10.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', marginTop: 3 }}>{sub}</div>
  </div>;
  return <>
    <span className="n1-tagl" style={{ left: 8, top: 12 }}>{t("Test kodni chaqiradi — bot ham, baza ham yo'q", 'Тест вызывает код — ни бота, ни базы')}</span>
    {box(8, 150, 'keyboards.spec.ts', t("kutadi: tugma yo'q", 'ждёт: кнопок нет'), '')}
    {box(174, 160, "orderKeyboard(…)", bad ? t("39: faqat 'DELIVERED'", "39: только 'DELIVERED'") : "'DELIVERED' || 'CANCELLED'", bad ? 'bad' : fixed ? 'ok' : '')}
    {box(350, 162, t('natija', 'результат'), !known || !broken ? '?' : bad ? t('2 tugma: 🚚 ❌', '2 кнопки: 🚚 ❌') : 'undefined', bad && known ? 'bad' : '')}
    {[158, 334].map((x) => <div key={x} className="n1-arr" style={{ left: x + 1, top: 58, width: 14 }} />)}
    {res && <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: res === '?' ? T.ink3 : bad ? '#DC2626' : T.green }}>npx jest keyboards → {res}</span>}
    {pins.a && <span className="n1-pin on" style={{ left: 148, top: 26 }}>{pins.a}</span>}
    {pins.b && <span className="n1-pin on" style={{ left: 502, top: 26 }}>{pins.b}</span>}
  </>;
}
// ============================================================
//  MENTOR KURSI · Jest-1 «OrderBotNest'ga birinchi testlar: yozamiz, buzamiz, AI testini tekshiramiz» (v2, F-1104-01)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/10-Jest1-mentor-v2.md (GATE M 04.11)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar jest1-start (= tgpg-done) → jest1-done
//  Kod va terminal: 03b-kod.gen.jsx (dev/jest1-kod.py — repo teglari va manba/jest1v2-out/ dan aynan, satr raqami bilan)
//  AI tajribasi: manba/jest1v2-ai/ (1-prompt: ai1 Opus, ai2 Haiku · 2-prompt: p2/)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest1/parts/*.jsx > JestUnitMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-jest-01-birinchi-unit-test-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "OrderBotNest'ga birinchi testlar";
const JC = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', jest: '#99425B', pass: '#15803D', fail: '#C2410C' };
const ESC = String.fromCharCode(92) + 'u00a0'; // bo'linmas probel escape'i matn sifatida (fayl vositasi uni belgiga aylantirmasin — 04.11)
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
  cat: 'src/api/catalog/catalog.service.ts', ord: 'src/api/order/order.service.ts', pkg: 'package.json',
};
const BASE_FILES = ['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', F.cat, F.ord, 'src/api/user/', F.tg, F.kb, F.tx, 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', F.pkg, 'README.md'];
const FILES = (...extra) => tree(BASE_FILES, extra);
MKCFG.files = FILES();
// VS Code'dagidek ixcham Explorer: faqat ochiq faylning papka zanjiri ochiq (TgPg dagi compact)
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
  ['backslash u nol nol a nol', ESC], ['nol nol a nol', '00a0'], ['ikki nol', '0020'],
  ['texts spec ts', 'texts.spec.ts'], ['keyboards spec ts', 'keyboards.spec.ts'], ['texts ts', 'texts.ts'], ['spec ts', '.spec.ts'], ['test ts', '.test.ts'],
  ['to strict equal', 'toStrictEqual'], ['to be undefined', 'toBeUndefined'], ['to be truthy', 'toBeTruthy'], ['to equal', 'toEqual'], ['to be', 'toBe'],
  ['to locale string', 'toLocaleString'], ['Object is', 'Object.is'], ['console log', 'console.log'], ['no tests found', 'No tests found'],
  ['Root dir src', 'rootDir: src'], ['root dir src', 'rootDir: src'], ['Test regex', 'testRegex'], ['test regex', 'testRegex'], ['transform ts jest', 'transform: ts-jest'], ['ts jest', 'ts-jest'],
  ['order keyboard', 'orderKeyboard'], ['catalog keyboard', 'catalogKeyboard'], ['Buttons yordamchisi', 'buttons() yordamchisi'], ['Nav yordamchisi', 'nav() yordamchisi'],
  ['hide false', 'hide: false'], ['git diff stat', 'git diff --stat'], ['jest bir start', 'jest1-start'], ['package json', 'package.json'],
  ['Describe som', "describe('som')"], ['npm test keyboards', 'npm test -- keyboards'], ['npm test texts', 'npm test -- texts'], ['git checkout', 'git checkout'],
  ['dollar va qavs', '${…}'], ['delivery fee', 'deliveryFee'], ['order total', 'orderTotal'], ['m4b-01', 'm4b-01'], ['env fayli', '.env fayli'], ['env faylisiz', '.env faylisiz'],
];
DIGITS.unshift(['bir yuz yigirma ming', '120 000'], ['bir yuz ming', '100 000'], ["o'ttiz olti", '36'], ["o'ttiz uch", '33'], ["o'ttizdan ortiq", '30 dan ortiq'], ["o'ttiz uchinchi", '33-'],
  ["o'nta", '10 ta'], ["yigirma bir", '21'], ["to'qson daqiqaning yigirma beshi", '90 daqiqaning 25 tasi'], ["o'n besh", '15'], ["o'n daqiqa", '10 daqiqa'], ['besh yuz', '500']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/No tests found/g, /serializes to the same string/g, /Cannot find module/g, /Object is/g);

// Kod rang beruvchi (TgPg dan). Matn — KOD (03b-kod.gen.jsx), HTML'siz.
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
// Jest terminali: PASS yashil, FAIL qizil, ✓ / ✕, ● sarlavha, Expected / Received, > satr
function jestLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^PASS /.test(l)) return `<span class="jp">PASS</span>${escH(l.slice(4))}`;
  if (/^FAIL /.test(l)) return `<span class="jf">FAIL</span>${escH(l.slice(4))}`;
  if (/^\s*✓/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*✕|^\s*●/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*(Expected|- Expected|Expected substring)/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(Received|\+ Received|Received string|\+ )/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/No tests found|error|Error|Cannot find|\[chiqish kodi: 1\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:.*failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^Tests:|\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*(#|at |\(|—)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
// out(k, a, b, meta) — KOD.OUT[k] satrlari a..b (1 dan, bo'sh satrsiz); meta {satr: {id}} — yoritish
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const out = (k, a = 1, b, meta = {}) => outLines(k).slice(a - 1, b == null ? undefined : b).map((l, i) => ({ h: jestLine(l), ...(meta[a + i] || {}) }));
const outFind = (k, re, meta) => { const L = outLines(k); const i = L.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
const upto = (lines, beat) => lines.filter((l) => l.at == null || l.at <= beat);
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? JC.termEr : JC.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
// Loyiha kodi (KOD — aynan, satr raqami bilan). ids: {satr: 'id'} — yoritish; from/to — satr chegarasi; edit: {satr: matn} — buzilgan/tuzatilgan satr
const kod = (k, ids = {}, from, to, edit = {}) => KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: tsLine(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  return [{ ...base, gone: true }, { h: tsLine(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
});
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(F.txs, F.kbs), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;

// AI javobi kartasi — prompt, AI javobidan qisqa parcha, git diff --stat (haqiqiy yurgizish, «namuna» belgisi bilan)
function AiReply({ who, prompt, said, diff, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
    {diff && <pre className="df">{diff}</pre>}
  </div>;
}
const Card = ({ c = T.accent, h, children, hl, dim, style }) => <div className={`mk-box${hl ? ' hl' : ''}`} style={{ '--c': c, opacity: dim ? 0.4 : 1, transition: 'opacity .3s', ...(style || {}) }}><h4>{h}</h4>{children}</div>;

// v2 qoliplari: amaliyot MD'dan (mkPractice), tekshiruv (MC) — M42: above/after/demak
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

// Buzib tekshirish jadvali (manba/jest1v2-ai/mutatsiya.txt — aynan): qizargan testlar soni; 0 — buzilish sezilmadi
const MUT = [
  ['B1', "som: ru-RU → en-US («120,000»)", [1, 8, 1]],
  ['B2', 'savat qatori: buyurtma narxi o\'rniga hozirgi narx', [0, 1, 1]],
  ['B3', 'orderKeyboard: CANCELLED da ham tugma', [1, 1, 1]],
  ['B4', 'catalogKeyboard: oxirgi sahifada ham ▶', [2, 3, 3]],
  ['B5', 'STATUS_UZ.NEW matni o\'zgardi', [0, 0, 1]],
];
const MUT_COLS = [['Men', 10], ['1-AI', 36], ['2-AI', 33]];
function MutTable({ rows = 5, hlCol, hlRow }) {
  return <table className="mut"><thead><tr><th>{t("Buzish", "Поломка")}</th>{MUT_COLS.map(([n, c], i) => <th key={n} className={hlCol === i ? 'hl' : ''}>{n}<small>{c} test</small></th>)}</tr></thead>
    <tbody>{MUT.slice(0, rows).map(([id, d, v], r) => <tr key={id} className={hlRow === r ? 'hl' : ''} style={{ animation: `mk-up .35s ${r * 0.06}s ease both` }}><td><b>{id}</b> {d}</td>{v.map((x, i) => <td key={i} className={`${x === 0 ? 'zero' : 'red'}${hlCol === i ? ' col' : ''}`}>{x}</td>)}</tr>)}</tbody></table>;
}

// Jest-1 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.j1-15 td,.j1-15 th{text-align:center}
.j1-15 td.l,.j1-15 th.l{text-align:left}
.j1-15 .kb{display:inline-flex;gap:4px}
.j1-15 .kb i{font-style:normal;border:1px solid #CBD5E1;border-radius:6px;padding:1px 7px;background:#fff}
.j1-15 .kb i.x{border-color:#DC2626;background:#FEE2E2;color:#991B1B;font-weight:700}
.j1-15 .tp{color:#15803D;font-weight:700}.j1-15 .tf{color:#DC2626;font-weight:700}
.j1-15 .f0{color:#6B7280}.j1-15 .f1{color:#15803D;font-weight:700}.j1-15 .f2{color:#DC2626;font-weight:700}
.j1-15 tr.edge td{background:#FFF7ED}
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
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
.chars{display:flex;flex-wrap:wrap;gap:4px;font:600 13px ${MONO}}
.chars span{display:inline-flex;flex-direction:column;align-items:center;min-width:34px;padding:4px 3px;border:1px solid ${T.line};border-radius:8px;background:${T.paper}}
.chars span i{font-style:normal;font-size:15px;color:${T.ink};min-height:18px}
.chars span small{font-size:10.5px;color:${T.ink3}}
.chars span.nb{border:2px solid ${T.accent};background:#FFF0EB}
.chars span.nb small{color:${T.accent};font-weight:800}
.chars span.sp{border:2px solid ${T.green};background:#E3F5EC}
.chars span.sp small{color:${T.green};font-weight:800}
.st-tab{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.st-tab td{padding:8px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};transition:background .3s}
.st-tab td:first-child{border-left:4px solid ${JC.jest};border-radius:10px 0 0 10px;font:700 12.5px ${MONO}}
.st-tab td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.st-tab tr.hl td{background:#FFF0EB}
.st-tab .btn{display:inline-block;font:12px ${SANS};border:1px solid #BFD0E0;border-radius:8px;padding:3px 8px;margin:0 4px 0 0;background:#F4F8FC}
.pages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.pages div{border:1.5px solid ${T.line};border-radius:12px;padding:10px;text-align:center;font:700 14px ${MONO};background:${T.paper};transition:all .3s}
.pages div small{display:block;font:600 11px ${SANS};color:${T.ink3};margin-top:4px}
.pages div.hl{border-color:${T.accent};background:#FFF0EB}
.pages div.ok{border-color:${T.green};background:#E3F5EC}
.cmp-row{display:flex;align-items:stretch;gap:6px;margin:6px 0}
.cmp-lab{width:92px;display:flex;flex-direction:column;justify-content:center}
.cmp-lab b{font:700 14px ${MONO};color:${T.ink}}
.cmp-lab small{font-size:11.5px;color:${T.ink3}}
.cmp-c{width:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 2px;border:1.5px solid ${T.line};border-radius:10px;background:${T.paper};opacity:.15;transform:translateY(6px);transition:all .3s}
.cmp-c.on{opacity:1;transform:none}
.cmp-c i{font-style:normal;font:700 24px ${MONO};color:${T.ink};min-height:28px}
.cmp-c small{font:600 11px ${MONO};color:${T.ink3}}
.cmp-c.ok{border-color:${T.green};background:#E3F5EC}
.cmp-c.bad{border-color:${T.accent};background:#FFE4DA}
.cmp-c.bad small{color:${T.accent};font-weight:800}
.cmp-c.big{transform:scale(1.15);box-shadow:0 0 0 4px rgba(225,73,38,.18);animation:cmp-pulse 1.2s ease-in-out infinite}
@keyframes cmp-pulse{50%{box-shadow:0 0 0 8px rgba(225,73,38,.06)}}
.cmp-note{margin-top:10px;font-size:14px;line-height:1.5;color:${T.ink}}
.cmp-note code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px}
.cmp-note b{color:${T.accent}}
.fl-grid{display:grid;grid-template-columns:minmax(0,190px) minmax(0,1fr);gap:10px;align-items:center}
.fl-tests{display:grid;gap:8px}
.fl-row{display:grid;grid-template-columns:20px minmax(0,1fr) 58px 150px;gap:8px;align-items:center}
.fl-ar,.fl-eq{font:700 18px ${MONO};color:${T.ink3};text-align:center}
.fl-eq{font:700 12px/1.15 ${SANS};white-space:normal}
.fl-box{border:2px solid var(--c);border-radius:12px;padding:8px 10px;background:${T.paper};transition:all .35s}
.fl-box.hl{background:#FFF0EB}
.fl-box small{display:block;font:600 11px ${MONO};color:${T.ink3};margin-bottom:3px}
.fl-box b{font:700 15px ${MONO};color:${T.ink}}
.fl-v{font:700 13px ${SANS};border-radius:10px;padding:8px 10px;text-align:center;animation:mk-up .4s ease both}
.fl-v.ok{background:#E3F5EC;color:${T.green}}
.fl-v.lie{background:#FFF6E2;color:#B45309;border:1.5px dashed #D97706}
.fl-v.bad{background:#FFE4DA;color:${T.accent}}
.fl-note{margin-top:10px;font-size:14px;color:${T.ink}}
.fl-note b{color:${T.accent}}
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: 10 test, yarim soniyada (jest1v2-out/11)
// ============================================================
const PLAN1 = ['Nega va qayerda', 'Birinchi test', "Yolg'on testlar", 'Statuslar va chegara', 'AI testi', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + Jest qatori (BotMap, parts/02e-bot.jsx); reja pastda.
// Testda Telegram ham, baza ham yo'q: faqat telegram modulidagi funksiya chaqiriladi (texts.ts, keyboards.ts)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const UNIT_ON = ['telegram'];
const S1M = [
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' } },
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts.ts', jest: { cmd: 'npx jest texts', files: ['texts.spec.ts'], res: 'fail', txt: '1 failed' } },
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'AI', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '36 passed' } },
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' } },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap {...m} tag={t("Bugungi darsning rasmi — buyurtma botining qoidasi test bilan qo'riqlanadi", 'Картина урока — правило бота заказов охраняет тест')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Smoke bor — nega yana test? (orderbot-out/10 · jest1v2-out/12)
// ============================================================
const T2_SMOKE = [{ h: jestLine('$ npm run smoke') }, { h: '<span class="cm"># baza shop_smoke · har qadam alohida node jarayonida · restart · 5 mijoz bir vaqtda</span>' }, { h: '<span class="ok">NATIJA: 5/5 ✓</span>' }];
const T2_UNIT = out('12');
const S2 = mkS(2, [{ v: 'smoke' }, { v: 'unit' }, { v: 'code' }, { v: 'sum' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {/* F-1120-02 (M51): ikki karta o'rniga darsning rasmi — smoke butun botni, unit-test bitta funksiyani tekshiradi */}
    {seg.v === 'smoke' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={DB_ALL} clients={5} chat={['[✅ Buyurtma berish]', "Buyurtma #1 qabul qilindi! Jami: 220 000 so'm", 'ok']} jest={{ name: 'Smoke', cmd: 'npm run smoke', files: [t('shop_smoke · restart · 5 mijoz', 'shop_smoke · рестарт · 5 клиентов')], res: 'pass', txt: '5/5' }} tag={t("Smoke — butun bot: telefon, server, baza", 'Smoke — весь бот: телефон, сервер, база')} /></div>}
    {seg.v === 'smoke' && <Term lines={T2_SMOKE} />}
    {(seg.v === 'unit' || seg.v === 'sum') && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={DB_ALL} on={UNIT_ON} tgSub="texts · keyboards" jest={{ cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' }} tag={t("Unit-test — bitta funksiya: Telegram ham, baza ham, .env ham kerak emas", 'Unit-тест — одна функция: не нужны ни Telegram, ни база, ни .env')} /></div>}
    {seg.v === 'unit' && <Term lines={T2_UNIT} />}
    {seg.v === 'code' && <Ide files={compact(FILES(F.txs), F.txs)} active={F.txs}>
      <CodePanel file="texts.spec.ts" lines={kod('SPEC04', { 1: 'i' }, 1, 2)} focus={['i']} />
      <CodePanel file="texts.ts" lines={kod('TX_SOM', { 4: 's' }, 3, 4)} focus={['s']} style={{ marginTop: 10 }} />
      <div className="n2-warn" style={{ marginTop: 10 }}>{t("Testda ", "В тесте ")}<b>{t("Telegraf ham, baza ham", "Ни Telegraf, ни база")}</b>{t(" import qilinmaydi — faqat ", " не импортируются — только ")}<code>som</code>{t(" funksiyasi. ", " функция. ")}<code>.env</code>{t(" yo'q, 10 test 0,5 soniyada.", " нет, 10 тестов за 0,5 секунды.")}</div>
    </Ide>}
    {seg.v === 'sum' && <div className="mk-rule">Smoke — <b>{t("«ishlayaptimi»", "«работает ли»")}</b>; unit-test — <b>{t("«shu qoida buzilmadimi»", "«не нарушено ли это правило»")}</b>{t(". Saytning so'rov va javobi — Jest ikkinchi darsida.", ". Запрос и ответ сайта — на втором уроке по Jest.")}</div>}
  </>} />;
}

// ============================================================
//  3 · Jest testni qayerdan topadi (package.json jest bo'limi · jest1v2-out/01)
// ============================================================
const T3 = out('01', outFind('01', /^\$ npm test/));
const S3 = mkS(3, [{ v: 'pkg', f: ['t'] }, { v: 'pkg', f: ['r'] }, { v: 'run' }, { v: 'run', f: ['nf'] }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'pkg' && <Ide files={compact(FILES(), F.pkg)} active={F.pkg}>
      <CodePanel file="package.json" lines={[...kod('PKG_TEST', { 14: 't' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('PKG', { 45: 'j', 51: 'r', 52: 'r', 53: 'x', 54: 'x', 55: 'x' }, 45, 57)]} focus={seg.f} />
    </Ide>}
    {seg.v === 'run' && <CodePanel file="package.json" lines={kod('PKG', {}, 51, 52)} />}
    {seg.v === 'run' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T3} er focus={seg.f || []} />}
  </>} />;
}

// ============================================================
//  4 · Tekshiruv 1 — test/ papkasidagi fayl (jest1v2-out/14)
// ============================================================
const T4_PKG = kod('PKG', {}, 51, 52);
const T4_AFTER = out('14', outFind('14', /^No tests found/));
function Screen4(p) {
  return MC(p, 4, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Ide files={tree(['node_modules/', 'src/', 'test/texts.spec.ts', '.env.example', F.pkg, 'README.md'])} active="test/texts.spec.ts">
        <CodePanel file="package.json" lines={T4_PKG} />
      </Ide>
    </div>,
    after: <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T4_AFTER} er />,
  });
}

// ============================================================
//  5 · Birinchi test: describe · it · expect (texts.ts 1–4 · kod-02-texts.spec.ts)
// ============================================================
const S5 = mkS(5, [{ v: 'src' }, { v: 'spec', f: ['i'] }, { v: 'spec', f: ['d', 't', 'e'] }, { v: 'spec', f: [] }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {seg.v === 'src' && <Code k="TX_SOM" ids={{ 3: 's', 4: 's' }} focus={['s']} files={FILES()} active={F.tx} />}
    {seg.v === 'spec' && <Code k="SPEC02" ids={{ 1: 'i', 3: 'd', 4: 't', 5: 'e' }} focus={seg.f} files={FILES(F.txs)} active={F.txs} fresh={F.txs} />}
    {seg.v === 'spec' && seg.f.length === 3 && <div className="pg-three">
      <Card c={T.blue} h="describe"><p>{t("qaysi funksiya — ", "какая функция — ")}<code>som</code></p></Card>
      <Card c={T.purple} h="it"><p>{t("bitta vaziyat — oddiy gap bilan", "одна ситуация — обычным предложением")}</p></Card>
      <Card c={JC.jest} h="expect … toBe"><p>{t("natija = etalon (qo'lda yoziladi)", "результат = эталон (пишется вручную)")}</p></Card>
    </div>}
  </>} />;
}

// ============================================================
//  6 · Bir xil ikki qator — FAIL (jest1v2-out/02 aynan)
// ============================================================
const L6 = outLines('02');
const i6 = (re) => L6.findIndex((l) => re.test(l)) + 1;
const T6 = out('02', i6(/^FAIL/), undefined, {
  [i6(/● som/)]: { id: 'd' }, [i6(/Expected:/)]: { id: 'e' }, [i6(/Received:/)]: { id: 'e' }, [i6(/^\s*>/)]: { id: 'g' }, [i6(/^\s*\|\s*\^/)]: { id: 'g' }, [i6(/at Object/)]: { id: 'g' },
});
const S6 = mkS(6, [{ f: ['d'] }, { f: ['e'] }, { f: ['g'] }, { f: ['e'] }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <Term title={t("VS Code terminali · npm test -- texts", "терминал VS Code · npm test -- texts")} lines={T6} er focus={seg.f} />} />;
}

// ============================================================
//  7 · Ichida: toBe va bo'linmas probel (jest1v2-out/03, 04)
// ============================================================
const L7 = outLines('03');
const CODES7 = (L7[2] || '').trim().split(/\s+/);
const CH7 = Array.from("120" + String.fromCharCode(160) + "000 so'm");
const T7_EQ = out('02', i6(/expect\(received\)/), i6(/Received:/), { [i6(/expect\(received\)/)]: { id: 'o' } });
const FIX7 = [...kod('SPEC04', {}, 1, 5), { h: tsLine(KOD.SPEC02.lines[4].t), n: 6, gone: true }, ...kod('SPEC04', { 6: 'f' }, 6, 6).map((l) => ({ ...l, neu: true })), ...kod('SPEC04', {}, 7, 8), ...kod('SPEC04', {}, 9, 11).map((l) => ({ ...l, neu: true })), ...kod('SPEC04', {}, 12, 12)];
const T7_PASS = out('04', outFind('04', /^PASS/));
// F-1104-07: katta solishtirish — Expected (siz yozgan) va Received (som qaytargan) belgilari yonma-yon, bittalab
const EXP7 = Array.from("120 000 so'm");
const REC7 = CH7;
const code4 = (c) => c.charCodeAt(0).toString(16).padStart(4, '0');
function Compare7({ mode }) {
  const [n, setN] = useState(mode === 'diff' ? EXP7.length : 0);
  useEffect(() => {
    if (mode === 'diff') { setN(EXP7.length); return undefined; }
    setN(0); let k = 0;
    const id = setInterval(() => { k += 1; setN(k); if (k >= EXP7.length) clearInterval(id); }, 380);
    return () => clearInterval(id);
  }, [mode]);
  const row = (arr, other, who, lab) => <div className="cmp-row"><div className="cmp-lab"><b>{who}</b><small>{lab}</small></div>
    {arr.map((c, i) => { const shown = i < n; const same = code4(c) === code4(other[i]); return <div key={i} className={`cmp-c${shown ? ' on' : ''}${shown ? (same ? ' ok' : ' bad') : ''}${mode === 'diff' && !same ? ' big' : ''}`}><i>{c === ' ' || c.charCodeAt(0) === 160 ? '·' : c}</i><small>{code4(c)}</small></div>; })}</div>;
  return <div className="mk-light cmp" style={{ padding: 16 }}>
    <div className="mk-tag">{t("Jest ikki matnni belgima-belgi solishtiradi", "Jest сравнивает два текста посимвольно")}</div>
    {row(EXP7, REC7, 'Expected', t('siz yozgan', "написали вы"))}
    {row(REC7, EXP7, 'Received', t('som qaytargan', "вернул som"))}
    {n >= 4 && <div className="cmp-note">{mode === 'diff' ? <>{t("Farq faqat ", "Разница только ")}<b>{t("4-belgida", "в 4-м символе")}</b>: <code>0020</code>{t(" — oddiy probel (siz yozgan) · ", " — обычный пробел (написали вы) · ")}<code>00a0</code>{t(" — bo'linmas probel (", " — неразрывный пробел (")}<code>toLocaleString('ru-RU')</code>{t(" qo'ygan). Qolgan 11 belgi bir xil.", " ставит). Остальные 11 символов одинаковы.")}</> : <>{t("4-belgida birinchi farq — ", "В 4-м символе первое различие — ")}<b>{t("teng emas", "не равно")}</b>{t(", shuning uchun test qizil.", ", поэтому тест красный.")}</>}</div>}
  </div>;
}
const S7 = mkS(7, [{ v: 'eq' }, { v: 'chars' }, { v: 'fix' }, { v: 'fix', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    {(seg.v === 'eq' || seg.v === 'chars') && <Term title={t("VS Code terminali · FAIL", "терминал VS Code · FAIL")} lines={T7_EQ} er focus={seg.v === 'eq' ? ['o'] : []} />}
    {(seg.v === 'eq' || seg.v === 'chars') && <Compare7 mode={seg.v === 'eq' ? 'scan' : 'diff'} />}
    {seg.v === 'fix' && <><CodePanel file="texts.spec.ts" lines={FIX7} focus={seg.sum ? [] : ['f']} /><Term lines={T7_PASS} /></>}
  </>} />;
}

// ============================================================
//  8 · Amaliyot 1 — texts.spec.ts
// ============================================================
const P8 = mkPractice(8, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 1, file: F.txs, lines: kod('SPEC02') },
    { step: 3, file: F.txs, lines: kod('SPEC04') },
  ],
});
function ScreenP8(p) { return <Practice p={p} S={P8.S} steps={P8.steps} trouble={P8.trouble} proof={P8.proof} code={P8.code} tree={FILES(F.txs)} />; }

// ============================================================
//  9 · Yolg'on PASS: expect yo'q (kod-05-yolgon.spec.ts · jest1v2-out/05)
// ============================================================
const T9 = out('05', 2);
const S9 = mkS(9, [{ v: 'code' }, { v: 'run' }, { v: 'run', sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'code' ? <Code k="SPEC05" ids={{ 5: 'c' }} focus={['c']} files={FILES(F.txs, 'src/api/telegram/yolgon.spec.ts')} active="src/api/telegram/yolgon.spec.ts" /> : <CodePanel file="yolgon.spec.ts" lines={kod('SPEC05', {}, 3, 7)} />}
    {seg.v === 'run' && <Term title={t("VS Code terminali · npm test -- yolgon", "терминал VS Code · npm test -- yolgon")} lines={T9} />}
    {seg.sum && <div className="mk-rule">{t("Har ", "В каждом ")}<code>it</code>{t(" ichida kamida bitta ", " — внутри хотя бы один ")}<b>expect</b>{t(". Xatoni faqat ", ". Ошибку бросает только ")}<code>expect</code>{t(" tashlaydi.", " .")}</div>}
  </>} />;
}

// ============================================================
//  10 · Etalon koddan olingan — buzilgan kodda ham yashil (kod-06-savat.spec.ts · jest1v2-out/06a, 06)
// ============================================================
const T10A = out('06a', 2);
const T10B = out('06', outFind('06', /^FAIL/), outFind('06', /^\s*Jami: 100,000/));
// F-1104-09: oqim chizmasi — som() natijasi va ikki etalon qayerdan keladi
function Flow10({ broken }) {
  const res = broken ? "100,000 so'm" : "100 000 so'm";
  const Box = ({ h, v, c, hl }) => <div className={`fl-box${hl ? ' hl' : ''}`} style={{ '--c': c }}><small>{h}</small><b>{v}</b></div>;
  const verdict = (ok, lie) => <div className={`fl-v ${ok ? (lie ? 'lie' : 'ok') : 'bad'}`}>{ok ? (lie ? t("✓ yashil — lekin yolg'on", "✓ зелёный — но ложный") : t('✓ yashil', "✓ зелёный")) : t('✕ qizil', "✕ красный")}</div>;
  return <div className="mk-light fl" style={{ padding: 14 }}>
    <div className="mk-tag">{broken ? t("som buzildi (en-US) — kim nimani ko'radi", "som сломана (en-US) — кто что видит") : t("som to'g'ri — ikkala test", "som правильная — оба теста")}</div>
    <div className="fl-grid">
      <Box h={t("som(100000) qaytaradi", "som(100000) возвращает")} v={res} c={broken ? T.accent : T.green} hl={broken} />
      <div className="fl-tests">
        <div className="fl-row"><span className="fl-ar">→</span><Box h={t("1-test etaloni: `Jami: ${som(100000)}`", "эталон 1-го теста: `Jami: ${som(100000)}`")} v={'Jami: ' + res} c={broken ? T.accent : T.blue} hl={broken} /><span className="fl-eq">{t('teng', 'равно')}</span>{verdict(true, broken)}</div>
        <div className="fl-row"><span className="fl-ar">→</span><Box h={t("2-test etaloni: qo'lda yozilgan", "эталон 2-го теста: написан вручную")} v="Jami: 100 000 so'm" c={T.blue} /><span className="fl-eq">{broken ? t('teng emas', 'не равно') : t('teng', 'равно')}</span>{verdict(!broken)}</div>
      </div>
    </div>
    {broken && <div className="fl-note">{t("1-test etaloni ham ", "Эталон 1-го теста тоже ")}<b>{t("som'dan", "из som")}</b>{t(" yasaladi — som buzilsa, etalon ham u bilan birga buziladi.", " делается — если som сломается, эталон сломается вместе с ней.")}</div>}
  </div>;
}
const S10 = mkS(10, [{ v: 'both' }, { v: 'break' }, { v: 'res' }, { v: 'res', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'both' && <><CodePanel file="savat.spec.ts" lines={kod('SPEC06', { 11: 'a', 16: 'b' }, 9, 17)} focus={['a', 'b']} /><Flow10 /></>}
    {seg.v === 'break' && <Code k="TX_SOM" ids={{ 4: 'x' }} focus={['x']} edit={{ 4: KOD.TX_SOM.lines[3].t.replace("'ru-RU'", "'en-US'") }} files={FILES('src/api/telegram/savat.spec.ts')} active={F.tx} />}
    {seg.v === 'res' && !seg.sum && <><Flow10 broken /><Term title={t("VS Code terminali · som buzilgan", "терминал VS Code · som сломан")} lines={T10B} er /></>}
    {seg.sum && <><CodePanel file="savat.spec.ts" lines={kod('SPEC06', { 11: 'a', 16: 'b' }, 10, 16)} focus={['a']} /><div className="mk-rule">{t(<>Etalon <b>qo'lda</b> yoziladi. Etalonda <code>{'${som(…)}'}</code> — ogohlantirish belgisi.</>, <>Эталон пишется <b>вручную</b>. <code>{'${som(…)}'}</code> в эталоне — тревожный знак.</>)}</div></>}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (jest1v2-out/23 buzuq, 24 tuzatilgan; target 16-satr → bo'lakda 5-satr, indeks 4)
// ============================================================
const LC11 = KOD.SPEC_OP_BUZUQ.lines.filter((l) => l.n >= 12 && l.n <= 19).map((l) => ({ h: tsLine(l.t), n: l.n }));
const LC11_FIXED = KOD.SPEC_OP.lines.filter((l) => l.n >= 12 && l.n <= 19).flatMap((l) => l.n === 16 ? [{ h: tsLine(KOD.SPEC_OP_BUZUQ.lines[15].t), n: 16, gone: true }, { h: tsLine(l.t), n: 16, neu: true }] : [{ h: tsLine(l.t), n: l.n }]);
const L24 = outLines('24');
const T11X = out('24', L24.findIndex((l, i) => i > 20 && /^FAIL/.test(l)) + 1, L24.findIndex((l, i) => i > 20 && /Holati/.test(l)) + 1);
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="texts.spec.ts" lines={LC11} target={4}
    tree={{ root: MKCFG.root, files: compact(FILES(F.txs), F.txs), active: F.txs }}
    fixed={LC11_FIXED} fixedExtra={[{ file: t('terminal — som en-US bilan buzilgan', "терминал — som сломана через en-US"), lines: T11X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Admin tugmalari: har statusga bitta test (keyboards.ts 37–51 · keyboards.spec.ts 1–35 · jest1v2-out/07)
// ============================================================
const ST12 = [['NEW', ['✅ Tasdiqlash', '❌ Bekor']], ['CONFIRMED', ['🚚 Yetkazildi', '❌ Bekor']], ['DELIVERED', []], ['CANCELLED', []]];
function StatusTab({ on = [] }) {
  return <table className="st-tab"><tbody>{ST12.map(([s, b], i) => <tr key={s} className={on.includes(i) ? 'hl' : ''}><td>{s}</td><td>{b.length ? b.map((x) => <span key={x} className="btn">{x}</span>) : <span style={{ color: T.ink3 }}>{t("tugma yo'q — undefined", "кнопок нет — undefined")}</span>}</td></tr>)}</tbody></table>;
}
const T12 = out('07', 2);
const S12 = mkS(12, [{ v: 'tab' }, { v: 'src' }, { v: 'spec' }, { v: 'tab', all: true }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <>
    {seg.v === 'tab' && <StatusTab on={seg.all ? [0, 1, 2, 3] : []} />}
    {seg.v === 'src' && <Code k="KB_ORDER" ids={{ 39: 'u', 43: 'b', 44: 'b', 47: 'b', 48: 'b' }} focus={['u', 'b']} files={FILES()} active={F.kb} />}
    {seg.v === 'spec' && <><CodePanel file="keyboards.spec.ts" lines={[...kod('SPEC_KB', { 5: 'h', 6: 'h', 7: 'h', 8: 'h' }, 4, 10), { h: '<span class="cm">…</span>', n: '' }, ...kod('SPEC_KB', { 31: 'u', 32: 'u', 33: 'u' }, 31, 35)]} focus={['h', 'u']} /><Term lines={T12} /></>}
  </>} />;
}

// ============================================================
//  13 · toBe massivda ishlamaydi — toEqual (kod-06b-tobe.spec.ts · jest1v2-out/06b, 08)
// ============================================================
const L06B = outLines('06b');
const T13 = out('06b', 2, L06B.findIndex((l) => /^\s*>/.test(l)) + 1, { [L06B.findIndex((l) => /If it should pass/.test(l)) + 1]: { id: 'w' }, [L06B.findIndex((l) => /serializes/.test(l)) + 1]: { id: 'w' } });
const L08 = outLines('08');
const T13_HIDE = [{ h: jestLine(L08.find((l) => /Received: \{/.test(l)).replace(/^\s+/, '    ')), id: 'h' }];
const S13 = mkS(13, [{ v: 'run', f: ['w'] }, { v: 'run', f: [] }, { v: 'hide' }, { v: 'sum' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v !== 'hide' && <><CodePanel file="tobe.spec.ts" lines={kod('SPEC06B', { 3: 'b', 7: 'e' })} focus={['b', 'e']} /><Term lines={T13} er focus={seg.f || []} /></>}
    {seg.v === 'hide' && <><Term title={t("VS Code terminali · Received (Telegraf klaviaturasi)", "терминал VS Code · Received (клавиатура Telegraf)")} lines={T13_HIDE} er />
      <div className="n2-warn"><code>"hide": false</code>{t(" — kodda yozilmagan, Telegraf ", " — в коде не написано, Telegraf ")}<b>{t("o'zi qo'shadi", "добавляет сам")}</b>{t(". Yordamchi faqat ", ". Помощник берёт только ")}<code>text</code>{t(" va ", " и ")}<code>callback_data</code>{t(" ni ajratadi.", " .")}</div></>}
    {seg.v === 'sum' && <div className="mk-rule">{t("Son va satr — ", "Число и строка — ")}<code>toBe</code>{t("; massiv va obyekt — ", "; массив и объект — ")}<code>toEqual</code>.</div>}
  </>} />;
}

// ============================================================
//  14 · Kodni buzamiz: CANCELLED da ham tugma (jest1v2-out/08)
// ============================================================
const BREAK14 = { 39: KOD.KB_ORDER.lines[2].t.replace(" || o.status === 'CANCELLED'", '') };
const T14 = out('08', outFind('08', /^\$ /));
const T14_OK = out('07', 2);
// F-1120-02 (M52): 1-segment (x) — mentor 39-satrdagi «|| o.status === 'CANCELLED'» ni o'zi bosadi (data-act)
const L39 = KOD.KB_ORDER.lines.find((l) => l.n === 39).t;
const ACT14 = kod('KB_ORDER', { 39: 'x' }, 38, 41).map((l) => (l.n === 39 ? { ...l, h: tsLine(L39.split(" || o.status === 'CANCELLED'")[0]) + '<span class="n1-act" data-act="1">' + tsLine(" || o.status === 'CANCELLED'") + '</span>' + tsLine(L39.split(" || o.status === 'CANCELLED'")[1]) } : l));
// 1280×720 da kod ko'rinib tursin: terminaldan «> 33» va «^» satrlarigacha, keyin faqat «Tests:» satri (jest1v2-out/08)
const T14S = (() => { const i = T14.findIndex((l) => /\^/.test((l.h || '').replace(/<[^>]+>/g, '')) && !/expect/.test(l.h || '')); const k = T14.findIndex((l) => /Tests:/.test(l.h || '')); return [...T14.slice(0, i + 1), ...(k > i ? [T14[k]] : [])]; })();
const S14 = mkS(14, [{ v: 'act' }, { v: 'break' }, { v: 'run' }, { v: 'fix' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={(b) => <Scene14 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi (javob «?») · 2 test → 1 failed, bo'laklar 1·2 · 3 xulosa: tiklandi → 3 passed
function Scene14({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'break' : 'act') : seg.v;
  const mini = <N1Mini><KbMini broken={v !== 'act'} fixed={v === 'fix'} known={beat >= 2} pins={beat === 2 ? { a: 1, b: 2 } : {}} /></N1Mini>;
  return <>
    <Ide files={compact(FILES(F.txs, F.kbs), F.kb)} active={F.kb}>
      {v === 'act' && <div onClick={act.onClick}><CodePanel file="keyboards.ts" lines={ACT14} focus={['x']} /></div>}
      {(v === 'break' || v === 'run') && <CodePanel key="b" file={t("keyboards.ts · buzilgan", "keyboards.ts · сломан")} lines={kod('KB_ORDER', { 39: 'x' }, 38, 41, BREAK14)} focus={['x']} />}
      {v === 'fix' && <CodePanel key="f" file={t("keyboards.ts · tiklandi", "keyboards.ts · восстановлен")} lines={kod('KB_ORDER', { 39: 'x' }, 38, 41)} focus={['x']} />}
      {mini}
    </Ide>
    {v === 'run' && <Term title={t("VS Code terminali · npm test -- keyboards", "терминал VS Code · npm test -- keyboards")} lines={T14S} er marks={{ [T14S.findIndex((l) => /● orderKeyboard ›/.test(l.h || ''))]: 'n1-p1', [T14S.findIndex((l) => /Received:/.test(l.h || ''))]: 'n1-p2' }} />}
    {v === 'fix' && <Term lines={T14_OK} />}
  </>;
}

// ============================================================
//  15 · Katalog: chegara — oxirgi va bitta sahifa (keyboards.ts 18–25 · jest1v2-out/09, 10)
// ============================================================
const PAGES15 = [['1/3 ▶', 'birinchi'], ['◀ 2/3 ▶', "o'rtada"], ['◀ 3/3', 'oxirgi'], ['1/1', 'yagona']];
const BREAK15 = { 21: KOD.KB_NAV.lines[3].t.replace('page < pages - 1', 'page <= pages - 1') };
const T15 = [...out('10', outFind('10', /^FAIL/), outFind('10', /^FAIL/)), ...out('10', outFind('10', /^\s*catalogKeyboard$/), outFind('10', /- Expected/) + 6)];
// F-1109-06: xulosa — sahifa belgilari qatori o'rniga 4 sahifa × ikki shart jadvali va haqiqiy npx jest farqi (jest1v2-out/10)
const ROWS15 = [
  ["birinchi", "первая", '0 · 2', 'f1', ['1/3', '▶'], false, false],
  ["o'rtada", 'в середине', '1 · 2', 'f1', ['◀', '2/3', '▶'], false, false],
  ['oxirgi', 'последняя', '2 · 2', 'f0', ['◀', '3/3', '▶'], true, true],
  ['yagona', 'единственная', '0 · 0', 'f0', ['1/1', '▶'], true, true],
];
function Edge15() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("keyboards.ts 21-satr · ▶ qachon chiqadi — 4 sahifa, ikki shart", "keyboards.ts строка 21 · когда появляется ▶ — 4 страницы, два условия")}</p>
      <table className="z-tbl j1-15"><tbody>
        <tr><th className="l">{t("sahifa", "страница")}</th><th>page · pages − 1</th><th>page &lt; pages − 1</th><th>page &lt;= pages − 1</th><th>{t("buzilgan kod ko'rsatdi", "показал сломанный код")}</th><th>test</th></tr>
        {ROWS15.map(([uz, ruN, v, f, kb, edge, x]) => <tr key={uz} className={edge ? 'edge' : ''}>
          <td className="l">{edge ? <b>{t(uz, ruN)}</b> : t(uz, ruN)}</td><td>{edge ? <b>{v}</b> : v}</td>
          <td className={f}>{f === 'f1' ? 'true ▶' : 'false'}</td><td className={edge ? 'f2' : 'f1'}>true ▶</td>
          <td><span className="kb">{kb.map((k, j) => <i key={j} className={x && j === kb.length - 1 ? 'x' : ''}>{k}</i>)}</span></td>
          <td className={x ? 'tf' : 'tp'}>{x ? '✕' : '✓'}</td>
        </tr>)}
      </tbody></table>
      <span className="z-mut">{t("Ikki shart faqat page = pages − 1 bo'lganda farq qiladi — ya'ni chegarada. O'rtadagi sahifa testi farqni ko'rmaydi.", "Два условия различаются только при page = pages − 1 — то есть на границе. Тест средней страницы разницы не видит.")}</span>
    </div>
    <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
      <p className="z-h" style={{ color: 'var(--bad)' }}>{t("npx jest keyboards — haqiqiy farq", "npx jest keyboards — настоящая разница")}</p>
      <div className="z-term"><span className="r">✕ oxirgi sahifada ▶ yo'q</span>      Array [ "◀", "3/3", <span className="r">+ "▶"</span> ]{'\n'}<span className="r">✕ bitta sahifa — faqat 1/1</span>    Array [ "1/1", <span className="r">+ "▶"</span> ]{'\n'}<span className="g">✓ birinchi sahifada ◀ yo'q   ✓ o'rtada ikkalasi bor</span></div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'pages' }, { v: 'spec' }, { v: 'break' }, { v: 'pages', bad: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'pages' && !seg.bad && <div className="pages">{PAGES15.map(([x, n], i) => <div key={x} className={seg.bad ? (i >= 2 ? 'hl' : 'ok') : ''}>{x}<small>{n}{t(" sahifa", " стр.")}</small></div>)}</div>}
    {seg.v === 'pages' && !seg.bad && <Code k="KB_NAV" ids={{ 19: 'c', 21: 'c', 22: 'c' }} focus={['c']} files={FILES()} active={F.kb} />}
    {seg.v === 'spec' && <Code k="SPEC_KB" ids={Object.fromEntries(Array.from({ length: 15 }, (_, i) => [47 + i, 'n']))} focus={['n']} from={37} to={71} files={FILES(F.txs, F.kbs)} active={F.kbs} />}
    {seg.v === 'break' && <><CodePanel file={t("keyboards.ts · buzilgan", "keyboards.ts · сломан")} lines={kod('KB_NAV', { 21: 'x' }, 19, 22, BREAK15)} focus={['x']} /><Term title={t("VS Code terminali · npm test -- keyboards", "терминал VS Code · npm test -- keyboards")} lines={T15} er /></>}
    {seg.bad && <Edge15 />}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — page <= pages - 1 (jest1v2-out/10)
// ============================================================
const L10 = outLines('10');
const T16_AFTER = out('10', L10.findIndex((l) => /✓ birinchi/.test(l)) + 1, L10.findIndex((l) => /✓ tugagan/.test(l)) + 1);
function Screen16(p) {
  return MC(p, 16, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file={t("keyboards.ts · buzilgan", "keyboards.ts · сломан")} lines={kod('KB_NAV', { 21: 'x' }, 19, 22, BREAK15)} focus={['x']} />
      <div className="mk-pair">{t("Faqat ikki test: ", "Только два теста: ")}<code>{t("birinchi sahifada ◀ yo'q", "на первой странице нет ◀")}</code> (0, 3) · <code>{t("o'rtada ikkalasi bor", "в середине есть обе")}</code> (1, 3)</div>
    </div>,
    after: <Term title={t("VS Code terminali · to'rt sahifa testi bilan", "терминал VS Code · с тестами четырёх страниц")} lines={T16_AFTER} er />,
  });
}

// ============================================================
//  17 · Amaliyot 2 — keyboards.spec.ts va bitta buzish
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 0, file: F.kbs, lines: kod('SPEC_KB', {}, 1, 35), copy: false },
    { step: 1, file: F.kbs, lines: kod('SPEC_KB', {}, 37, 71), copy: false },
  ],
});
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} code={P17.code} tree={FILES(F.txs, F.kbs)} />; }

// ============================================================
//  18 · AI ikki to'plam yozdi — ikkalasi yashil (jest1v2-ai/ai1, ai2 — 1-prompt)
// ============================================================
const S18 = mkS(18, [{ v: 'intro' }, { v: 'prompt' }, { v: 'two' }, { v: 'two', snip: true }, { v: 'two', snip: true, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'intro' && <div className="pg-two">
      <Card c={T.ink3} h={t("1–4-bosqich · testni siz yozdingiz", "Этапы 1–4 · тест писали вы")} dim><p><code>describe</code> · <code>it</code> · <code>expect</code>{t(" · FAIL o'qish · yolg'on testlar · chegara", " · чтение FAIL · ложные тесты · граница")}</p></Card>
      <Card c={JC.ai} h={t("5-bosqich · testni AI yozadi, siz qabul qilasiz", "Этап 5 · тест пишет AI, вы принимаете")} hl><p>{t("Savol endi «qanday yozaman?» emas — ", "Вопрос теперь не «как написать?», а — ")}<b>{t("«bu test xatoni ushlaydimi?»", "«ловит ли этот тест ошибку?»")}</b></p></Card>
    </div>}
    {seg.v !== 'intro' && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("haqiqiy yurgizish · 04.11", "настоящий запуск · 04.11")} />}
    {seg.v === 'two' && <div className="pg-two">
      <AiReply who={t('1-AI (kuchli model)', '1-й AI (сильная модель)')} said={seg.snip ? t(<>«36 test, hammasi o'tdi» · probel: <code>norm()</code> — oddiysiga almashtiradi; «U+202F bo'lishi mumkin» — <b>AI aytdi, lekin tekshirmagan</b></>, <>«36 тестов, все прошли» · пробел: <code>norm()</code> — заменяет обычным; «может быть U+202F» — <b>AI сказал, но не проверил</b></>) : t(<>«36 test, hammasi o'tdi»</>, <>«36 тестов, все прошли»</>)} diff={KOD.AI_DIFF1} hl={seg.snip && !seg.sum} />
      <AiReply who={t('2-AI (kuchsizroq model)', '2-й AI (модель слабее)')} said={seg.snip ? t(<>«33 test o'tdi» · etalonda <b>ko'rinmas belgining o'zi</b> (U+00A0, 33-satr) · etalon koddan: <code>{'`Jami: ${som(50000)}`'}</code></>, <>«33 теста прошли» · в эталоне <b>сам невидимый символ</b> (U+00A0, строка 33) · эталон из кода: <code>{'`Jami: ${som(50000)}`'}</code></>) : t(<>«33 test o'tdi»</>, <>«33 теста прошли»</>)} diff={KOD.AI_DIFF2} hl={seg.snip && !seg.sum} />
    </div>}
    {seg.snip && <CodePanel file="1-AI · texts.spec.ts" lines={kod('AI1_NORM', { 7: 'n' })} focus={['n']} />}
    {seg.sum && <div className="mk-rule">{t("«Hammasi yashil» — ", "«Всё зелёное» — ")}<b>{t("tekshiruv emas", "не проверка")}</b>{t(". Testning o'zini tekshiramiz.", ". Проверяем сам тест.")}</div>}
  </>} />;
}

// ============================================================
//  19 · Buzib tekshirish: 36 test nimani sezmadi (jest1v2-ai/mutatsiya.txt)
// ============================================================
const S19 = mkS(19, [{ rows: 5 }, { rows: 5, col: 0 }, { rows: 5, col: 1, code: true }, { rows: 5, sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("Nechta test qizardi (0 — buzilish sezilmadi) · ", "Сколько тестов покраснело (0 — поломка не замечена) · ")}<code>jest1v2-mutatsiya.sh</code></div><MutTable rows={seg.rows} hlCol={seg.col} /></div>
    {seg.code && <CodePanel file="1-AI · texts.spec.ts" lines={kod('AI1_STATUS', { 45: 't' })} focus={['t']} />}
    {seg.sum && <div className="mk-rule">{t("Test soni — sifat emas. Sifat — ", "Число тестов — не качество. Качество — ")}<b>{t("qaysi buzilishni ushlashi", "какую поломку он ловит")}</b>{t(". Qizarmagan joyga test qo'shing.", ". Где не покраснело — добавьте тест.")}</div>}
  </>} />;
}

// ============================================================
//  20 · Tekshiruv 4 — toBeTruthy (jest1v2-out/25)
// ============================================================
const BREAK20 = { 10: "  CANCELLED: '🆕 Yangi'," };
const T20 = out('25').filter((l, i) => !/buzilmagan|^\d+:/.test(outLines('25')[i].replace(/^## \w+ /, '').trim()) || /●/.test(outLines('25')[i]));
function Screen20(p) {
  return MC(p, 20, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="1-AI · texts.spec.ts" lines={kod('AI1_STATUS', { 45: 't' })} focus={['t']} />
      <CodePanel file={t("texts.ts · buzilgan", "texts.ts · сломан")} lines={kod('TX_STATUS', { 10: 'x' }, 6, 11, BREAK20)} focus={['x']} />
    </div>,
    after: <Term title={t("VS Code terminali · CANCELLED «🆕 Yangi» bilan", "терминал VS Code · CANCELLED с «🆕 Yangi»")} lines={T20} />,
  });
}

// ============================================================
//  21 · Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz (prompt — jest1v2-ai/p2-prompt.txt aynan)
// ============================================================
const PROMPT21 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P21 = mkPractice(21, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: 'prompt.txt', lines: PROMPT21 }],
});
function ScreenP21(p) { return <Practice p={p} S={P21.S} steps={P21.steps} trouble={P21.trouble} proof={P21.proof} code={P21.code} tree={['prompt.txt', F.txs]} />; }

// ============================================================
//  22 · Sinfga tayyorgarlik: m4b-01 (JestUnitTestLesson.jsx — SCREEN_META 21; s13 FAIL · s15 AI testlari · s16 etalon · HW_V2 deliveryFee)
// ============================================================
const DICT22 = [['mashina — kirish → chiqish', 'funksiya'], ['Jestbot — sinovchi robot', 'Jest (npm test)'], ['robot papkasi', 'describe'], ['sinov varaqasi', 'it'], ['etalon kartochkasi', 'expect(…).toBe(…)'], ["yolg'on test", 'expect yo\'q yoki noto\'g\'ri etalon']];
const ADD22 = [['haqiqiy FAIL o\'qish: ● → Expected / Received → > satr', 's13 «FAIL»'], ['«kim xato: kodmi, etalonmi?»', 's13, s16 noto\'g\'ri etalon'], ['etalon qo\'lda — orderTotal etalonda chaqirilmasin', 's15 AI testlari'], ['chegara: aynan 100 000', 'uyga vazifa deliveryFee'], ['yashil bo\'lsa — bir marta buzdirish', 'amaliyot oxiri']];
const S22 = mkS(22, [{ v: 'cards' }, { v: 'dict' }, { v: 'add' }, { v: 'pre' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {(seg.v === 'cards' || seg.v === 'dict') && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4b-01 (21 ekran)", "Ученик · m4b-01 (21 экран)")} hl={seg.v === 'cards'}><p><b>{t("KitobShop sayti", "сайт KitobShop")}</b> · <code>orderTotal(price, quantity)</code> → <code>src/order.ts</code> + <code>src/order.spec.ts</code>{t(" · Jestbot (robot) · uyga vazifa ", " · Jestbot (робот) · домашнее задание ")}<code>deliveryFee</code></p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>OrderBotNest · <code>som</code>, <code>orderKeyboard</code>, <code>catalogKeyboard</code>{t(" · ko'rinmas belgi · yolg'on testlar · AI testi va buzib tekshirish", " · невидимый символ · ложные тесты · тест от AI и проверка поломкой")}</p></Card>
    </div>}
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT22.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'add' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Siz qo'shasiz", "Вы добавляете")}</div><table className="pg-dict"><tbody>{ADD22.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></>}
    {seg.v === 'pre' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Amaliyot oldidan", "Перед практикой")}</div><div className="mk-plan">
      {[t("Repo npm install bilan o'rnatilgan", "Репозиторий установлен через npm install"), t('Test fayli src/ ichida', "Тестовый файл внутри src/"), t('Nomi .spec.ts bilan tugaydi', "Имя заканчивается на .spec.ts")].map((x, i) => <div key={x}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>}
  </>} />;
}

// ============================================================
//  23 · Qoqiladigan joylar (jest1-out/01, 11–15 — o'quvchi reposi; jest1v2-out) + o'quvchi savollari
// ============================================================
const CARDS23 = [
  ['Test topilmadi', 'No tests found, exiting with code 1', 'src/ ichida, nomi .spec.ts'],
  ["O'quvchi reposida npm ci yiqildi", 'npm ci can only install packages when … in sync', 'npm install — lock fayl sinxron emas'],
  ["Yolg'on yashil", "PASS, lekin expect yo'q yoki etalon koddan", "har it'da expect; etalon qo'lda"],
  ["Bir xil ko'rinadi, lekin FAIL", 'Expected = Received ko\'rinishda · serializes to the same string', 'ko\'rinmas belgi (' + ESC + ') · massivga toEqual'],
  ["Nest bo'lmagan bo'sh loyiha", 'Must use import to load ES Module → describe → TypeScript 7', "o'quvchi reposida yozdirish; bo'sh loyihada config:init, @types/jest, typescript@5"],
];
const QA23 = [
  ['«Test kodni tuzatadimi?»', "Yo'q, faqat xabar beradi; tuzatish — sizniki."],
  ['«Darsda npm i -D jest ts-jest bor — o\'rnatsam buziladimi?»', "Nest reposida jest allaqachon bor; buyruq faqat kichik versiyaga ko'taradi, testlar yashil (sinalgan)."],
  ['«Jest faqat Nest uchunmi?»', "Yo'q, istalgan JavaScript/TypeScript loyihasi; Nest'da tayyor sozlangan."],
  ["«AI testni yozsa bo'ladimi?»", "Ha; keyin to'rt tekshiruv va kamida bitta buzish (19-ekran)."],
  ['«toBe va === farqi?»', "toBe ham Object.is bilan solishtiradi, lekin natijani PASS yoki FAIL qilib xabar beradi."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ on: [] }, { on: [0, 1] }, { on: [2, 3, 4] }, { on: [0, 1, 2, 3, 4], qa: true }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    <div className="pg-2c">{CARDS23.map(([h, x, y], i) => <Card key={h} c={i < 2 ? T.blue : T.accent} h={`${i + 1} · ${h}`} hl={seg.on.includes(i) && !seg.qa} dim={seg.on.length > 0 && !seg.on.includes(i)}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>
    {seg.qa && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: Jest sozlamasi, ko'rinmas belgi, yolg'on testlar, toBe va toEqual, chegara va AI testi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi «AI test yozdi, hammasi yashil» desa, nimani tekshirishni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'unit', t: "Unit-test — bitta funksiya va bitta qoida; Telegram, baza va .env kerak emas — bot ham, sayt ham bir xil sinaladi. Smoke — «ishlayaptimi», unit-test — «shu qoida buzilmadimi»", st: ['jest'] },
  { k: 'cfg', t: "Jest: rootDir: src, testRegex: .spec.ts — fayl sinaladigan faylning yonida; No tests found — joy va nom", st: ['jest'] },
  { k: 'fail', t: "FAIL: ● → Expected / Received → > satr va raqam; bir xil ko'rinsa — ko'rinmas belgi (" + ESC + ") yoki massivni toBe bilan solishtirish (toEqual)", st: ['jest', 'code'] },
  { k: 'lie', t: "Yolg'on test ikki xil: expect yo'q · etalon koddan olingan; toBeTruthy — bormi, to'g'rimi emas", st: ['code'] },
  { k: 'edge', t: "Har status — bitta test; har shartga chegara testi: birinchi, oxirgi, yagona", st: ['code'] },
  { k: 'ai', t: "AI testini qabul qilish: diff faqat .spec.ts · har it'da expect · etalon qo'lda · kodni buzib, test qizarishini ko'rish. Sinf: m4b-01 — haqiqiy FAIL, «kim xato», chegara, bir marta buzdirish", st: ['ai', 'code'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + Jest qatori); har band rasmning o'z qismini yoritadi
const MAP25 = {
  unit: { on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' } },
  cfg: { on: UNIT_ON, tgSub: 'texts.ts', jest: { cmd: 'rootDir: src · .spec.ts', files: ['src/api/telegram/texts.spec.ts'], res: 'pass' } },
  fail: { on: UNIT_ON, tgSub: 'texts.ts · som()', jest: { cmd: 'npx jest texts', files: ['texts.spec.ts'], res: 'fail', txt: '1 failed' } },
  lie: { on: UNIT_ON, tgSub: 'texts.ts · som()', jest: { cmd: 'npx jest yolgon', files: ['yolgon.spec.ts'], res: 'pass', get txt() { return t('expectsiz', 'без expect'); } } },
  edge: { on: UNIT_ON, tgSub: 'keyboards.ts', jest: { cmd: 'npx jest keyboards', files: ['orderKeyboard', 'catalogKeyboard'], res: 'pass', txt: '8 passed' } },
  ai: { on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'AI', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '36 passed' } },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.unit;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — buyurtma botining qoidalari test bilan", 'Сегодняшний урок — правила бота заказов под тестами')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "O'z nusxangiz — Telegraf+PG darsidagi o'z reposingizda yangi tarmoq (yoki jest1-start dan)", c: ['git checkout -b tests'] },
  { t: "Testlar — texts.spec.ts ga: texts.orderPlaced, texts.orderLine, texts.statusChanged, texts.customerStatus; narx qoidasi: price va product.price har xil bo'lgan buyurtma", c: ['npm test'] },
  { t: "To'rt buzish — som formati · i.price ?? i.product.price → i.product.price · STATUS_UZ matni · o'zingiz tanlagan bitta joy; har biridan keyin npm test va git checkout", c: ['git checkout -- src/api/telegram/texts.ts'] },
  { t: "README «Testlar» bo'limi: buzish → qizargan test nomi (4 qator); AI bilan yozgan bo'lsangiz — AI qaysi shartni bajarmadi va siz qanday ushladingiz", c: [] },
  { t: 'Topshirish — git push → repo linki platformadagi uyga vazifaga', c: ['git add . && git commit -m "texts testlari"', 'git push'] },
];
const CHEATSHEET25 = `# Jest — mentor eslatmasi (OrderBotNest, birinchi testlar)
## Loyiha
git fetch --tags · git checkout jest1-start (test yo'q) → jest1-done (texts.spec.ts, keyboards.spec.ts) · npm test [-- texts | -- keyboards] · .env va baza kerak emas
## Jest qayerdan topadi (package.json → jest)
rootDir: "src" · testRegex: ".*\\\\.spec\\\\.ts$" · transform: ts-jest → fayl src/ ichida, sinaladigan faylning yonida, nomi .spec.ts · aks holda: No tests found, exiting with code 1
## Test qolipi
describe('som', () => { it("120000 ni so'mda yozadi", () => { expect(som(120000)).toBe("120${ESC}000 so'm"); }); });
## FAIL o'qish
● describe › it → Expected (etalon) / Received (funksiya qaytargani) → > satr va ^ → at … (texts.spec.ts:5:25)
## Bir xil ko'rinadi, lekin FAIL
toLocaleString('ru-RU') minglarni U+00A0 (bo'linmas probel) bilan ajratadi → etalonda ${ESC} ochiq yoziladi, belgining o'zi emas
massiv va obyekt: toBe → «serializes to the same string» → toEqual · Telegraf tugmaga hide: false qo'shadi → kerakli qismini ajrating
## Yolg'on testlar
expect yo'q (console.log) → doim PASS · etalon koddan: \`Jami: \${som(100000)}\` → som buzilsa ham PASS · toBeTruthy → matn o'zgarsa ham PASS
## Statuslar va chegara
har status — bitta it · har shartga chegara: birinchi, oxirgi, yagona sahifa · < va <= farqi faqat chegarada
## AI testini qabul qilish
git diff --stat — faqat .spec.ts · har it'da expect · etalonda \${som( / \${STATUS_UZ yo'q · grep -c 'u00a0' (escape matni bormi) · kodni 3–4 joyda buzing — har biri qizarsin
## Sinfga tayyorgarlik (m4b-01, 21 ekran)
KitobShop sayti · orderTotal · Jestbot = Jest, papka = describe, varaqa = it, etalon kartochkasi = expect · siz qo'shasiz: haqiqiy FAIL, «kim xato», chegara 100 000, bir marta buzdirish
## Xatolar
No tests found → joy va nom · npm ci … in sync → npm install · Cannot find module './texts' → fayl joyi · bo'sh loyiha: Must use import → npx ts-jest config:init · Cannot find name 'describe' → @types/jest · TypeScript 7 → typescript@5
## Sizning uyga vazifangiz (40–60 daqiqa)
texts.orderPlaced, orderLine, statusChanged, customerStatus testlari + buyurtma paytidagi narx qoidasi + 4 buzish README jadvalida → GitHub → repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Unit-test — <b>bitta funksiya va bitta qoida</b>; bot ham, sayt ham bir xil sinaladi", "Birinchi: unit-test bitta funksiyani va bitta qoidani tekshiradi. Telegram, baza va env fayli kerak emas, shuning uchun bot ham, sayt ham bir xil sinaladi. Smoke ishlayaptimi deydi, unit-test esa shu qoida buzilmadimi deydi.", { hl: 'unit' }),
  sg('b2', "Jest faylni <b>src ichidan, .spec.ts nomidan</b> topadi", "Ikkinchi: Jest test faylini src papkasi ichidan va spec ts nomidan topadi. No tests found chiqsa, kodni emas, fayl joyi va nomini tekshiring.", { hl: 'cfg' }),
  sg('b3', "FAIL: <b>Expected, Received, satr raqami</b>; bir xil ko'rinsa — ko'rinmas belgi yoki toEqual", "Uchinchi: FAIL'ni yuqoridan pastga o'qiysiz: nuqtali satr, expected va received, keyin satr raqami. Ikki qator bir xil ko'rinsa, ko'rinmas belgini qidiring. Massiv va obyektni to equal bilan solishtiring.", { hl: 'fail' }),
  sg('b4', "Yolg'on test ikki xil: <b>expect yo'q yoki etalon koddan</b>", "To'rtinchi: yolg'on test ikki xil bo'ladi. Birida expect yo'q, ikkinchisida etalon kodning o'zidan yasalgan. To be truthy esa qiymat borligini tekshiradi, to'g'riligini emas.", { hl: 'lie' }),
  sg('b5', "Har status — <b>bitta test</b>; har shartga <b>chegara testi</b>", "Beshinchi: har statusga bitta test yozasiz. Har shartning chegarasiga alohida test: birinchi, oxirgi va yagona sahifa. Kichik va kichik yoki teng farqi faqat chegarada ko'rinadi.", { hl: 'edge' }),
  sg('b6', "AI testini <b>buzib tekshirib</b> qabul qilasiz; sinfda — bir marta buzdirish", "Oltinchi: AI yozgan testni sonidan emas, buzib tekshirib qabul qilasiz. Diff, expect, qo'lda etalon va kamida uchta buzish. Sinfda o'quvchi testi yashil bo'lsa, kodni bir marta o'zi buzsin.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: buyurtma matnlari testlari va buyurtma paytidagi narx qoidasi", "Uyga vazifa: OrderBotNest'ning o'z nusxangizda buyurtma matnlari uchun testlar yozing. Muhim qoida: xabarda buyurtma paytidagi narx chiqadi, mahsulotning hozirgi narxi emas. Bunga alohida test yozing. AI bilan yozsangiz ham bo'ladi.", { hl: 'hw' }),
  sg('hw2', "<b>To'rt buzish</b> va README jadvali; repo linki platformaga", "Keyin to'rtta buzish qiling va har birida qaysi test qizarganini README'ga jadval qilib yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: sozlama, FAIL o'qish, yolg'on testlar va AI tekshiruvi — bir sahifada", "Pastda bir sahifalik eslatma: Jest sozlamasi, test qolipi, FAIL o'qish, ko'rinmas belgi, yolg'on testlar, AI testini qabul qilish, xatolar va sinfga tayyorgarlik. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('jest-birinchi-testlar-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> etalonlar qo'lda (<code>{'${som('}</code> yo'q) · narx qoidasi testi bor · README jadvalida 4 buzish va har biri qizargan.</>, <><b>Проверяющий смотрит:</b> эталоны вручную (нет <code>{'${som('}</code>) · есть тест правила цены · в таблице README 4 поломки, и каждая покраснела.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("Jest: edge cases va xato yo'li", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("toThrow, Service'ni mock bilan sinash va saytning API'siga birinchi HTTP test", RS('NEXT_D'))}</div></div>
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
          {t(["OrderBotNest'ning qoidalariga unit-test yozasiz va FAIL'ni o'qiysiz: Expected, Received, satr", "yolg'on testni taniysiz: expect yo'q, etalon koddan olingan, toBeTruthy", "AI yozgan testni kodni buzib tekshirasiz: qizarmagan joy — himoyasiz"], ["напишете unit-тесты на правила OrderBotNest и прочитаете FAIL: Expected, Received, строка", 'узнаете ложный тест: нет expect, эталон взят из кода, toBeTruthy', 'проверите тест от AI, ломая код: не покраснело — не защищено']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 10–25 daqiqa, 11-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: OrderBotNest kompyuteringizda, Node.js 20+, VS Code, AI yordamchi; baza va bot tokeni kerak emas · Loyiha: jest1-start tegi", 'Урок со звуком · 1 ч 10–25 мин, после 11-го экрана можно сделать перерыв · Нужно: OrderBotNest на компьютере, Node.js 20+, VS Code, AI-помощник; база и токен бота не нужны · Проект: тег jest1-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={UNIT_ON} tgSub="texts · keyboards" jest={{ cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenP8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, ScreenP21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function JestUnitMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/jest1-*.json, ru/jest1-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/jest1-sahna.js) ---
// Jest-1 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Зачем и где', 'Первый тест', 'Ложные тесты', 'Статусы и граница', 'Тест от AI', 'Подготовка к классу'] },
};
ru(T2_SMOKE, [null, { h: '<span class="cm"># база shop_smoke · каждый шаг в отдельном процессе node · перезапуск · 5 клиентов одновременно</span>' }, { h: '<span class="ok">ИТОГ: 5/5 ✓</span>' }]);
ru(PAGES15, [[null, 'первая'], [null, 'в середине'], [null, 'последняя'], [null, 'единственная']]);
ru(MUT, [[null, 'som: ru-RU → en-US («120,000»)'], [null, 'строка корзины: текущая цена вместо цены заказа'], [null, 'orderKeyboard: кнопки и при CANCELLED'], [null, 'catalogKeyboard: ▶ и на последней странице'], [null, 'изменился текст STATUS_UZ.NEW']]);
ru(MUT_COLS, [['Мы', null], null, null]);
ru(DICT22, [['машина — вход → выход', 'функция'], ['Jestbot — робот-проверяльщик', null], ['папка робота', null], ['лист проверки', null], ['карточка эталона', null], ['ложный тест', 'нет expect или неверный эталон']]);
ru(ADD22, [['чтение настоящего FAIL: ● → Expected / Received → строка >', null], ['«кто ошибся: код или эталон?»', 's13, s16 неверный эталон'], ['эталон вручную — orderTotal в эталоне не вызывается', 's15 тесты от AI'], ['граница: ровно 100 000', 'домашнее задание deliveryFee'], ['если зелёный — пусть один раз сломают', 'конец практики']]);
ru(CARDS23, [
  ['Тест не найден', null, 'внутри src/, имя .spec.ts'],
  ['В репозитории ученика упал npm ci', null, 'npm install — lock-файл не синхронен'],
  ['Ложный зелёный', 'PASS, но нет expect или эталон из кода', 'в каждом it — expect; эталон вручную'],
  ['Выглядит одинаково, но FAIL', 'Expected = Received на вид · serializes to the same string', 'невидимый символ (' + ESC + ') · для массива toEqual'],
  ['Пустой проект не на Nest', null, 'писать в репозитории ученика; в пустом проекте config:init, @types/jest, typescript@5'],
]);
ru(QA23, [
  ['«Тест исправляет код?»', 'Нет, только сообщает; исправлять — вам.'],
  ['«В уроке есть npm i -D jest ts-jest — если установлю, всё сломается?»', 'В репозитории Nest jest уже есть; команда только поднимает минорную версию, тесты зелёные (проверено).'],
  ['«Jest только для Nest?»', 'Нет, любой проект на JavaScript/TypeScript; в Nest он уже настроен.'],
  ['«Можно, чтобы тест написал AI?»', 'Да; потом четыре проверки и хотя бы одна поломка (экран 19).'],
  ['«Чем toBe отличается от ===?»', 'toBe тоже сравнивает через Object.is, но сообщает результат как PASS или FAIL.'],
]);
ru(SUM25, [
  { t: 'Unit-тест — одна функция и одно правило; Telegram, база и .env не нужны — бот и сайт проверяются одинаково. Smoke — «работает ли», unit-тест — «не нарушено ли это правило»' },
  { t: 'Jest: rootDir: src, testRegex: .spec.ts — файл рядом с проверяемым файлом; No tests found — место и имя' },
  { t: 'FAIL: ● → Expected / Received → строка > и номер; выглядит одинаково — невидимый символ (' + ESC + ') или массив сравнили через toBe (toEqual)' },
  { t: 'Ложный тест бывает двух видов: нет expect · эталон взят из кода; toBeTruthy — есть ли, а не верно ли' },
  { t: 'Каждый статус — один тест; на каждое условие тест границы: первая, последняя, единственная' },
  { t: 'Приём теста от AI: diff только .spec.ts · в каждом it — expect · эталон вручную · сломать код и увидеть, как тест краснеет. Класс: m4b-01 — настоящий FAIL, «кто ошибся», граница, один раз сломать' },
]);
ru(HOMEWORK25, [
  { t: 'Своя копия — новая ветка в своём репозитории с урока Telegraf+PG (или от jest1-start)' },
  { t: 'Тесты — в texts.spec.ts: texts.orderPlaced, texts.orderLine, texts.statusChanged, texts.customerStatus; правило цены: заказ, где price и product.price разные' },
  { t: 'Четыре поломки — формат som · i.price ?? i.product.price → i.product.price · текст STATUS_UZ · одно место на ваш выбор; после каждой npm test и git checkout' },
  { t: 'Раздел README «Тесты»: поломка → имя покрасневшего теста (4 строки); если писали с AI — какое условие AI не выполнил и как вы это поймали' },
  { t: 'Сдача — git push → ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.SPOKEN = [['бэкслеш u ноль ноль а ноль', ESC], ['ноль ноль а ноль', '00a0'], ['ноль ноль два ноль', '0020'], ['texts spec ts', 'texts.spec.ts'], ['keyboards spec ts', 'keyboards.spec.ts'], ['texts ts', 'texts.ts'], ['spec ts', '.spec.ts'], ['test ts', '.test.ts'],
  ['to strict equal', 'toStrictEqual'], ['to be undefined', 'toBeUndefined'], ['to be truthy', 'toBeTruthy'], ['to equal', 'toEqual'], ['to be', 'toBe'], ['to locale string', 'toLocaleString'], ['Object is', 'Object.is'], ['console log', 'console.log'], ['no tests found', 'No tests found'],
  ['Root dir src', 'rootDir: src'], ['root dir src', 'rootDir: src'], ['Test regex', 'testRegex'], ['test regex', 'testRegex'], ['transform ts jest', 'transform: ts-jest'], ['ts jest', 'ts-jest'], ['order keyboard', 'orderKeyboard'], ['catalog keyboard', 'catalogKeyboard'],
  ['hide false', 'hide: false'], ['git diff stat', 'git diff --stat'], ['jest один start', 'jest1-start'], ['package json', 'package.json'], ['Describe som', "describe('som')"], ['npm test keyboards', 'npm test -- keyboards'], ['npm test texts', 'npm test -- texts'], ['delivery fee', 'deliveryFee'], ['order total', 'orderTotal']];
RU_S.TITLE = 'Первые тесты для OrderBotNest';
RU_S.EYEBROW = 'Курс для менторов · Jest';
RU_S.COVER = ['Всего около 1 часа 10–25 минут: озвучка ~24 минуты · три практики 45–60 минут · 4 проверки · самопроверка 8 вопросов. После экрана 11 можно сделать перерыв', 'Нужно: урок для менторов Telegraf + PostgreSQL (OrderBotNest на вашем компьютере) · Node.js 20+ · VS Code · AI-помощник (Antigravity, Claude Code, Codex или Copilot). База и токен бота не нужны', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега jest1-start (= tgpg-done); каждый вывод — из настоящего запуска'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: настройка Jest, невидимый символ, ложные тесты, toBe и toEqual, граница и тест от AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к экранам красных вопросов и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет «AI написал тест, всё зелёное», вы знаете, что проверить.';
RU_S.NEXT_T = 'Jest: edge cases и путь ошибки';
RU_S.NEXT_D = 'toThrow, проверка Service через mock и первый HTTP-тест для API сайта';
RU_S.FILE = 'jest-pervye-testy-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['Unit-тест — <b>одна функция и одно правило</b>; бот и сайт проверяются одинаково', 'Первое: unit-тест проверяет одну функцию и одно правило. Telegram, база и env-файл не нужны, поэтому бот и сайт проверяются одинаково. Smoke говорит, работает ли, а unit-тест — не нарушено ли это правило.'],
  b2: ['Jest находит файл <b>внутри src, по имени .spec.ts</b>', 'Второе: Jest находит тестовый файл внутри папки src и по имени spec ts. Если вышло no tests found, проверяйте не код, а место и имя файла.'],
  b3: ['FAIL: <b>Expected, Received, номер строки</b>; выглядит одинаково — невидимый символ или toEqual', 'Третье: FAIL читаете сверху вниз: строка с точкой, expected и received, потом номер строки. Если две строки выглядят одинаково, ищите невидимый символ. Массив и объект сравнивайте через to equal.'],
  b4: ['Ложный тест двух видов: <b>нет expect или эталон из кода</b>', 'Четвёртое: ложный тест бывает двух видов. В одном нет expect, в другом эталон сделан из самого кода. А to be truthy проверяет, что значение есть, а не что оно верное.'],
  b5: ['Каждый статус — <b>один тест</b>; на каждое условие — <b>тест границы</b>', 'Пятое: на каждый статус пишете один тест. На границу каждого условия — отдельный тест: первая, последняя и единственная страница. Разница между «меньше» и «меньше или равно» видна только на границе.'],
  b6: ['Тест от AI принимаете, <b>проверив поломкой</b>; в классе — один раз сломать', 'Шестое: тест от AI принимаете не по количеству, а проверив поломкой. Diff, expect, эталон вручную и хотя бы три поломки. Если в классе тест ученика зелёный, пусть он сам один раз сломает код.'],
  hw: ['<b>Домашнее задание</b>: тесты текстов заказа и правило цены на момент заказа', 'Домашнее задание: в своей копии OrderBotNest напишите тесты для текстов заказа. Важное правило: в сообщении выводится цена на момент заказа, а не текущая цена товара. Напишите на это отдельный тест. Можно писать и с AI.'],
  hw2: ['<b>Четыре поломки</b> и таблица в README; ссылка на репозиторий — на платформу', 'Потом сделайте четыре поломки и для каждой запишите в README таблицей, какой тест покраснел. Выложите на GitHub и вставьте ссылку на репозиторий в своё домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: настройка, чтение FAIL, ложные тесты и проверка AI — на одной странице', 'Внизу памятка на одну страницу: настройка Jest, шаблон теста, чтение FAIL, невидимый символ, ложные тесты, приём теста от AI, ошибки и подготовка к классу. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# Jest — памятка ментора (OrderBotNest, первые тесты)
## Проект
git fetch --tags · git checkout jest1-start (тестов нет) → jest1-done (texts.spec.ts, keyboards.spec.ts) · npm test [-- texts | -- keyboards] · .env и база не нужны
## Где Jest ищет (package.json → jest)
rootDir: "src" · testRegex: ".*\\\\.spec\\\\.ts$" · transform: ts-jest → файл внутри src/, рядом с проверяемым файлом, имя .spec.ts · иначе: No tests found, exiting with code 1
## Шаблон теста
describe('som', () => { it("120000 ni so'mda yozadi", () => { expect(som(120000)).toBe("120${ESC}000 so'm"); }); });
## Чтение FAIL
● describe › it → Expected (эталон) / Received (что вернула функция) → строка > и ^ → at … (texts.spec.ts:5:25)
## Выглядит одинаково, но FAIL
toLocaleString('ru-RU') разделяет тысячи символом U+00A0 (неразрывный пробел) → в эталоне ${ESC} пишется явно, а не сам символ
массив и объект: toBe → «serializes to the same string» → toEqual · Telegraf добавляет кнопке hide: false → выделите нужную часть
## Ложные тесты
нет expect (console.log) → всегда PASS · эталон из кода: \`Jami: \${som(100000)}\` → PASS, даже если som сломана · toBeTruthy → PASS, даже если текст изменился
## Статусы и граница
каждый статус — один it · на каждое условие граница: первая, последняя, единственная страница · разница < и <= только на границе
## Приём теста от AI
git diff --stat — только .spec.ts · в каждом it — expect · в эталоне нет \${som( / \${STATUS_UZ · grep -c 'u00a0' (есть ли escape-запись) · сломайте код в 3–4 местах — каждое должно покраснеть
## Подготовка к классу (m4b-01, 21 экран)
сайт KitobShop · orderTotal · Jestbot = Jest, папка = describe, лист = it, карточка эталона = expect · вы добавляете: настоящий FAIL, «кто ошибся», граница 100 000, один раз сломать
## Ошибки
No tests found → место и имя · npm ci … in sync → npm install · Cannot find module './texts' → место файла · пустой проект: Must use import → npx ts-jest config:init · Cannot find name 'describe' → @types/jest · TypeScript 7 → typescript@5
## Ваше домашнее задание (40–60 минут)
тесты texts.orderPlaced, orderLine, statusChanged, customerStatus + правило цены на момент заказа + 4 поломки в таблице README → GitHub → ссылка на репозиторий на платформу`;

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · Jest",
  "title": "Пишем первые тесты для OrderBotNest: сначала сами, потом проверяете тест, написанный AI",
  "seg": {
   "a": [
    "Бот заказов работает — сегодня <b>защищаем его правила тестами</b>",
    "Здравствуйте. На прошлом уроке вы перенесли бот заказов на PostgreSQL. Сегодня защищаем его правила тестами: как записывается цена, какие кнопки видит админ, что происходит на последней странице каталога. На экране результат: десять тестов за полсекунды."
   ],
   "b": [
    "Сначала пишете тест сами и учитесь <b>читать FAIL и PASS</b>",
    "Сначала вы пишете тест вручную и учитесь читать ответ Jest. Уже первый тест покажет неожиданное: код работает правильно, тест красный, а две строки выглядят одинаково. Причину узнаете на уроке."
   ],
   "c": [
    "Потом тест пишет AI, а вы <b>проверяете его, ломая код</b>",
    "Потом тест пишет AI. Мы действительно попробовали это с двумя разными AI. Оба написали больше тридцати тестов, все зелёные. Но когда мы нарочно ломали код, некоторые поломки не заметил ни один тест. Вы научитесь этому способу проверки."
   ],
   "d": [
    "Шесть этапов, три практики; в конце <b>два экрана подготовки к классу</b>",
    "Урок состоит из шести этапов, в трёх практиках вы работаете сами. Последние два экрана — подготовка к классу: карта урока ученика и места, где ученики ошибаются. Не спешите: каждый экран можно прослушать с начала, урок запоминает, где вы остановились. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · зачем и где",
  "title": "Smoke проверяет весь бот, unit-тест — одно правило: один не заменяет другой",
  "seg": {
   "a": [
    "На уроке Telegraf+PG <b>smoke проверил весь бот</b>: базу, перезапуск и пять клиентов",
    "На уроке по Telegraf и PostgreSQL вы запускали smoke-скрипт. Он проверяет весь бот: открывает отдельную базу, перезапускает сервер, отправляет пять клиентов одновременно. Ответ у него один: работает бот или нет."
   ],
   "b": [
    "А unit-тест проверяет <b>одну функцию одним правилом</b>",
    "Unit-тест устроен иначе. Он вызывает одну функцию и проверяет одно правило: например, на последней странице каталога не должно быть правой стрелки. Smoke этого не заметит, потому что бот всё равно работает. А unit-тест скажет, в какой функции и в какой строке ошибка."
   ],
   "c": [
    "В тесте <b>нет ни Telegram, ни базы</b> — он не знает, бот это или сайт",
    "Теперь откройте сам проект: папку OrderBotNest с урока по Telegraf и PostgreSQL откройте в VS Code. На экране тест, который напишем сегодня: из файла texts ts в папке src, api, telegram он импортирует только функцию som. Не нужны ни Telegram, ни база, ни env-файл; без env-файла десять тестов прошли за полсекунды. Поэтому и бот, и сайт проверяются одинаково."
   ],
   "d": [
    "Итог: smoke — <b>«работает ли»</b>, unit-тест — «не нарушено ли это правило»",
    "Итог: smoke отвечает на вопрос, работает ли, а unit-тест — на вопрос, не нарушено ли это правило. Сегодня пишем unit-тесты. Проверка запроса и ответа сайта будет на втором уроке по Jest."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · внутри",
  "title": "Настройка Jest уже есть в package.json: файл внутри src/, имя заканчивается на .spec.ts",
  "seg": {
   "a": [
    "В проекте <b>всё готово для тестов</b>: Jest, ts-jest и настройка",
    "Сначала посмотрим, где Jest ищет тесты. В VS Code откройте файл package json в корне папки OrderBotNest. В четырнадцатой строке команда test: jest. Ниже, с сорок пятой строки, начинается раздел jest. В проекте Nest пакеты jest и ts jest уже установлены, ничего устанавливать не нужно."
   ],
   "b": [
    "Решают две строки: <b><code>rootDir: src</code> и <code>testRegex</code> — <code>.spec.ts</code></b>",
    "В разделе jest решают две строки: пятьдесят первая и пятьдесят вторая. Root dir src: Jest смотрит только внутрь папки src. Test regex: имя файла должно заканчиваться на spec ts. А transform ts jest в пятьдесят четвёртой строке превращает файл TypeScript в JavaScript."
   ],
   "c": [
    "<b><code>npm test</code> в терминале VS Code</b>: тестового файла пока нет — <code>No tests found</code>",
    "Теперь в VS Code через меню Terminal откройте новый терминал, он откроется в папке OrderBotNest, и напишите npm test. В проекте пока нет ни одного тестового файла, поэтому Jest пишет no tests found и выходит с кодом один, то есть с ошибкой. Внизу: просмотрено двадцать семь файлов, под test regex подошло ноль."
   ],
   "d": [
    "Итог: если видите <code>No tests found</code> — проверьте <b>место и имя файла</b>",
    "Итог: если видите no tests found, проверяйте не код, а место и имя файла. Мы проверили: и когда имя test ts, и когда файл лежит вне src, выходит именно это сообщение."
   ]
  }
 },
 "4": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "Тестовый файл в test/texts.spec.ts — в папке test в корне проекта. Что скажет npm test?",
  "q": "Вы видели, где Jest ищет тесты, теперь проверим. Первая проверка. Имя тестового файла правильное, заканчивается на spec ts. Но он лежит не внутри src, а в папке test в корне проекта. Что скажет npm test? Выберите вариант.",
  "ok": "Верно. Так как root dir src, Jest вообще не смотрит в папку test. Мы проверили: no tests found и код один. Чтобы появилась ошибка импорта, Jest должен был открыть файл, а он файла не увидел. Значит, тестовый файл лежит внутри src, рядом с проверяемым файлом.",
  "okShort": "<code>rootDir: src</code> — <code>test/</code> не виден: <code>No tests found</code>.",
  "hint": "Какую папку указывает rootDir? Файл внутри этой папки?",
  "demak": "тестовый файл лежит внутри <code>src/</code>, рядом с проверяемым файлом.",
  "opts": [
   "PASS — имя файла заканчивается на .spec.ts",
   "Cannot find module — сломался путь импорта",
   "No tests found — файл вне src/",
   "PASS — Jest сам ищет папку test/"
  ],
  "wrong": {
   "0": "Имя правильное, но место вне rootDir.",
   "1": "Для ошибки импорта Jest должен открыть файл — а он файла не увидел.",
   "3": "Для e2e-тестов Nest нужна отдельная настройка; в этом проекте её нет."
  }
 },
 "5": {
  "kicker": "Этап 2 · первый тест",
  "title": "Тест — код из трёх частей: какая функция, какая ситуация и какой результат ожидается",
  "seg": {
   "a": [
    "Для первого теста берём <b>функцию <code>som</code></b>: она записывает цену в сумах",
    "Для первого теста берём самую простую функцию. В VS Code откройте файл texts ts в папке src, api, telegram: в четвёртой строке функция som. Она берёт число и записывает его в сумах для текста бота: сто двадцать тысяч становится «сто двадцать тысяч сум». Каждую цену бот выводит этой функцией."
   ],
   "b": [
    "Тестовый файл <b>лежит рядом</b>: для <code>texts.ts</code> — <code>texts.spec.ts</code>",
    "Тестовый файл создаёте в этой же папке telegram, рядом с texts ts: в Explorer нажмите на папку правой кнопкой, New File, имя texts spec ts. Имя обязательно должно заканчиваться на spec ts. В первой строке импортируем функцию. Ни Telegraf, ни база не импортируются."
   ],
   "c": [
    "<code>describe</code> — функция, <code>it</code> — ситуация, <b><code>expect … toBe</code> — ожидаемый результат</b>",
    "Дальше три части. Describe som: о какой функции эти тесты. It: одна ситуация, её имя пишется обычным предложением. Внутри expect: результат som от ста двадцати тысяч должен быть равен эталону внутри to be. Эталон — ожидаемое значение, его пишем вручную."
   ],
   "d": [
    "Итог: <b>вызвать функцию, сравнить с эталоном</b> — каждый тест из этих двух шагов",
    "Итог: каждый тест состоит из двух шагов: вызываете функцию и сравниваете результат с эталоном, написанным вручную. Теперь запускаем тест: в терминале VS Code npm test, два дефиса и texts. Если добавить имя файла, запустится только этот тестовый файл."
   ]
  }
 },
 "6": {
  "kicker": "Этап 2 · первый тест",
  "title": "Тест красный: Expected и Received выглядят одинаково, но Jest не считает их равными",
  "seg": {
   "a": [
    "FAIL читаем <b>сверху вниз</b>: сначала какой тест упал",
    "В терминале написали npm test, два дефиса и texts: тест красный. FAIL читаем сверху вниз. Строка с точкой говорит, какой тест упал: тест «сто двадцать тысяч» в группе som. Если тестов много, сначала ищете эту строку."
   ],
   "b": [
    "Дальше две строки: <b><code>Expected</code> — эталон, <code>Received</code> — что вернула функция</b>",
    "Главное — следующие две строки. Expected — текст, который вы написали в тестовом файле. Received — текст, который функция som вернула на самом деле. Jest сравнивает не число, а эти два текста, и если они не равны, тест падает. Но посмотрите: обе строки одинаковые, сто двадцать тысяч сум."
   ],
   "c": [
    "Внизу <b>номер строки</b>: <code>texts.spec.ts:5:25</code> — пятая строка, знак <code>toBe</code>",
    "Внизу фрагмент кода: знак «больше» и стрелка показывают место ошибки, пятая строка тестового файла, to be. В самой последней строке снова написаны имя файла и номер строки. В VS Code открываете именно эту строку файла texts spec ts."
   ],
   "d": [
    "Значит, причина в одном месте: <b>пробел в двух текстах — разные символы</b>",
    "Значит, причина в одном месте: пробел между «сто двадцать» и «тысяч». Вы набрали на клавиатуре обычный пробел, а som поставила другой, невидимый глазу символ. На экране оба выглядят одинаково, а для Jest они разные. На следующем экране вы сравните два текста посимвольно и увидите этот символ своими глазами."
   ]
  }
 },
 "7": {
  "kicker": "Этап 2 · внутри",
  "title": "toLocaleString разделяет тысячи не обычным, а неразрывным пробелом",
  "seg": {
   "a": [
    "<code>toBe</code> <b>сравнивает посимвольно</b>: отличается один символ — не равно",
    "Теперь выясним причину. To be сравнивает два текста посимвольно, Jest пишет это как Object is. На экране две строки: сверху Expected, текст, который написали вы, снизу Received, текст, который вернула som. Сравниваем символы по одному: один, два, ноль, потом пробел."
   ],
   "b": [
    "Разница в четвёртом символе: <b><code>0020</code> — обычный пробел, <code>00a0</code> — неразрывный пробел</b>",
    "Вот разница, в четвёртом символе. В Expected обычный пробел, код ноль ноль два ноль. В Received ноль ноль а ноль: неразрывный пробел. На экране он выглядит как обычный пробел, но это другой символ. Его поставил to locale string по правилам русского языка. Все остальные символы одинаковые, они зелёные."
   ],
   "c": [
    "Пишем эталон <b>явно, через <code> </code></b> — теперь тест зелёный и читается",
    "Код правильный: неразрывный пробел не даёт числу разорваться на две строки в сообщении Telegram. Поэтому исправляем эталон и пишем символ явно: бэкслеш u, ноль ноль а ноль. Второй тест мы добавили для маленького числа. Оба зелёные."
   ],
   "d": [
    "Итог: уже первый тест показал <b>то, чего вы не знали о коде</b>",
    "Итог: уже первый тест показал то, чего вы не знали. Если expected и received выглядят одинаково, ищите невидимый символ. В эталоне пишите символ явно, а не сам невидимый символ: следующий человек примет его за обычный пробел."
   ]
  }
 },
 "8": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 10 минут",
  "title": "Напишите первый тест сами: сначала увидьте красный, потом найдите причину и сделайте зелёным",
  "seg": {
   "a": [
    "Теперь вы: <b>на теге <code>jest1-start</code></b> пишете первый тестовый файл",
    "Теперь ваша очередь. Открываете папку OrderBotNest с урока по Telegraf и PostgreSQL и переходите на тег jest один start. Env-файл и база не нужны. Займёт десять минут."
   ],
   "b": [
    "Шаги 1–2: тег, файл и <b>эталон с обычным пробелом</b> — увидьте FAIL сами",
    "На первом шаге переходите на тег через git fetch и checkout, npm test пишет no tests found. На втором пишете файл texts spec ts, эталон — с обычным пробелом с клавиатуры. Npm test texts: красный, две строки одинаковые."
   ],
   "c": [
    "Шаги 3–4: исправление через <b><code> </code></b> и второй тест; подтверждение — строка <code>Tests:</code>",
    "На третьем шаге пишете в эталоне бэкслеш u ноль ноль а ноль. На четвёртом добавляете второй тест для пятисот. В поле подтверждения скопируйте строку tests из последнего результата."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы пишете тест, читаете FAIL и находите невидимый символ."
   ]
  },
  "steps": [
   {
    "t": "Тег",
    "exp": "No tests found, exiting with code 1"
   },
   {
    "t": "Тест — с обычным пробелом",
    "exp": "FAIL · Expected: \"120 000 so'm\" · Received: \"120 000 so'm\"",
    "cmds": [
     "src/api/telegram/texts.spec.ts (код с 5-го экрана)",
     null
    ]
   },
   {
    "t": "Исправление",
    "exp": "PASS",
    "cmds": [
     "эталон \"120 000 so'm\"",
     null
    ]
   },
   {
    "t": "Второй тест",
    "exp": "Tests: 2 passed, 2 total",
    "cmds": [
     "it('в маленьком числе нет пробела', …) — som(500) → \"500 so'm\""
    ]
   }
  ],
  "proof": {
   "label": "Строка Tests: последнего результата",
   "placeholder": "Скопируйте строку Tests: …",
   "wrong": "Оба теста зелёные? Вставьте строку Tests: из результата npm test -- texts."
  },
  "trouble": [
   [
    "error: pathspec 'jest1-start' did not match",
    "теги не получены — git fetch --tags, потом checkout"
   ],
   [
    "Your local changes … would be overwritten by checkout",
    "ваши изменения с урока Telegraf+PG — git stash или commit, потом checkout"
   ],
   [
    "PASS на шаге 2",
    "эталон вставлен копированием — символ тоже перенёсся; наберите пробел с клавиатуры заново"
   ],
   [
    "Cannot find module './texts'",
    "файл не в src/api/telegram/ — перенесите рядом с texts.ts"
   ],
   [
    "No tests found",
    "имя не .spec.ts или файл вне src/ (экраны 3–4)"
   ]
  ]
 },
 "9": {
  "kicker": "Этап 3 · ложные тесты",
  "title": "Тест без expect всегда зелёный: он вызывает функцию, но ничего не проверяет",
  "seg": {
   "a": [
    "Писать тесты вы умеете — теперь посмотрим, <b>как обманывает сам тест</b>",
    "Писать тесты вы умеете. Теперь посмотрим, как обманывает сам тест. На экране файл yolgon spec ts в той же папке telegram. Первый вид ложного теста: в нём нет expect, только console log. Такой тест часто остаётся после ручной проверки."
   ],
   "b": [
    "Jest вывел результат и <b>сказал PASS</b> — ничего не сравнивалось",
    "Результат: в терминале Jest вывел значение и сказал PASS. Но ничего не сравнивалось. Для Jest правило простое: если внутри it не брошена ошибка, тест прошёл. Ошибку бросает только expect."
   ],
   "c": [
    "Итог: в каждом <code>it</code> <b>хотя бы один <code>expect</code></b> — иначе это не тест",
    "Итог: в каждом it должен быть хотя бы один expect, иначе это не тест, а просто вызов. Такой тест найти легко: console log есть, expect нет. Второй вид спрятан гораздо глубже, его посмотрим на следующем экране."
   ]
  }
 },
 "10": {
  "kicker": "Этап 3 · внутри",
  "title": "Если делать эталон из самого кода, при поломке кода ломается и эталон — тест остаётся зелёным",
  "seg": {
   "a": [
    "Два теста проверяют текст корзины: <b>один берёт эталон из <code>som</code>, другой — вручную</b>",
    "Второй вид. В файле savat spec ts в папке telegram два теста, оба ищут строку «итого» в тексте корзины. В первом эталон сделан из самой функции som, во втором написан вручную. Посмотрите на схему: сейчас som правильная, оба эталона — сто тысяч сум, оба зелёные."
   ],
   "b": [
    "Ломаем код: <b>цена теперь в виде «100,000»</b> — бот пишет неправильно",
    "Теперь нарочно ломаем код. В четвёртой строке файла texts ts, в функции som, ставим вместо правила русского языка правило английского. Теперь бот пишет цену с запятой: не сто тысяч, а сто, запятая, тысяча. Для клиента это другое число. Запускаем тесты."
   ],
   "c": [
    "Эталон из кода <b>изменился вместе со сломанной <code>som</code></b> — тест зелёный",
    "Посмотрите на схему. Som теперь пишет сто, запятая, тысяча. Эталон первого теста тоже делается из som, то есть и он стал сто, запятая, тысяча: обе стороны сломались вместе, и тест остался зелёным. Эталон, написанный вручную, не изменился, поэтому второй тест красный."
   ],
   "d": [
    "Итог: <b>эталон пишется вручную</b> — проверяемая функция в эталоне не используется",
    "Итог: эталон пишется вручную. Проверяемая функция не используется для создания эталона. Если в тесте эта функция вызвана внутри доллара и скобок, это тревожный знак. Теперь найдёте это сами в одном фрагменте кода."
   ]
  }
 },
 "11": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4 — какая строка с ошибкой?",
  "title": "Этот тест остаётся зелёным, даже когда som сломана. Найдите строку-виновника",
  "q": "Вы видели ложный тест, теперь найдите его сами. Вторая проверка. Этот тест проверяет сообщение о принятом заказе. Он остаётся зелёным, даже когда som сломана. Одна строка делает эталон из самой функции som. Нажмите на эту строку.",
  "ok": "Верно. В этой строке эталон делается из самой som, поэтому если som сломается, эталон сломается вместе с ней. На экране исправленная строка: эталон вручную, с неразрывным пробелом. Теперь если som сломается, тест покраснеет. Значит, ищите строку, где в эталоне вызвана проверяемая функция.",
  "okShort": "<code>${som(50000)}</code> — эталон из кода: если <code>som</code> сломается, обе стороны сломаются вместе. Написанный вручную <code>\"Jami: 50 000 so'm\"</code> ловит поломку.",
  "hint": "В какой строке эталон написан не вручную, а сделан из вызова функции?",
  "task": "Правило: эталон пишется вручную, проверяемая функция в эталоне не вызывается. В этом тесте одна строка делает эталон из самой <code>som</code>. <b>Нажмите на эту строку.</b>"
 },
 "12": {
  "kicker": "Этап 4 · статусы и граница",
  "title": "Заказ проходит четыре статуса — по одному тесту на кнопки, которые видит админ при каждом статусе",
  "seg": {
   "a": [
    "Под каждым заказом админ видит <b>кнопки в зависимости от статуса</b>",
    "Теперь проверим кнопки админа. С урока по Telegraf и PostgreSQL вы знаете: заказ проходит четыре статуса. Под новым заказом кнопки «подтвердить» и «отменить», под подтверждённым — «доставлен» и «отменить». У доставленного или отменённого заказа кнопок нет."
   ],
   "b": [
    "Это правило <b>в одной функции</b>: <code>orderKeyboard</code> — на входе заказ, на выходе клавиатура",
    "Это правило записано в одной функции: в файле keyboards ts в папке src, api, telegram, с тридцать седьмой строки, order keyboard. Ей передаётся заказ, она возвращает клавиатуру Telegraf или undefined. При нажатии кнопки бот получает строку callback: status, номер заказа и новый статус."
   ],
   "c": [
    "На каждый статус <b>один <code>it</code></b>: две кнопки, две кнопки, <code>toBeUndefined</code>",
    "Тестовый файл рядом: keyboards spec ts. На каждый статус пишем один it. Помощник buttons в пятой строке берёт из клавиатуры только текст кнопки и callback. В тесте в тридцать первой строке to be undefined: у доставленного и отменённого заказа клавиатуры нет. В терминале все три теста зелёные."
   ],
   "d": [
    "Итог: <b>каждый статус — одна ситуация</b>; пропустите один — это правило не защищено",
    "Итог: если есть таблица статусов, каждая её строка становится тестом. На четыре статуса мы написали три теста, в последнем два expect. Если пропустить какой-то статус, это правило останется без защиты. Почему в помощнике использован to equal, узнаете на следующем экране."
   ]
  }
 },
 "13": {
  "kicker": "Этап 4 · внутри",
  "title": "Даже если два массива выглядят одинаково, toBe даёт FAIL: он проверяет не содержимое, а тот ли это самый массив",
  "seg": {
   "a": [
    "Один и тот же массив, два сравнения: <b><code>toBe</code> красный, <code>toEqual</code> зелёный</b>",
    "Сравним два одинаковых массива двумя способами. To be красный, to equal зелёный. Сообщение Jest говорит то же самое: received превращается в одинаковую строку, но to be не считает его равным и предлагает to strict equal."
   ],
   "b": [
    "<code>toBe</code> — <b>тот ли это самый объект</b>; <code>toEqual</code> — равны ли значения внутри",
    "Причина такая. Для строки и числа to be сравнивает значение. А для массива и объекта он проверяет, один ли это и тот же объект в памяти. Массив, дважды написанный в коде, — это два разных объекта. А to equal сравнивает содержимое по одному элементу."
   ],
   "c": [
    "Telegraf <b>добавляет кнопке <code>hide: false</code></b> — поэтому понадобился помощник",
    "В клавиатуре есть ещё одна тонкость. Telegraf сам добавляет каждой кнопке поле hide false, в нашем коде его нет. Если сравнивать клавиатуру целиком, это поле пришлось бы писать и в эталоне. Поэтому помощник берёт только текст и callback."
   ],
   "d": [
    "Итог: <b>число и строка — <code>toBe</code>, массив и объект — <code>toEqual</code></b>",
    "Итог: для числа и строки используйте to be, для массива и объекта — to equal. Если поля, которые добавляет библиотека, лишне утяжеляют тест, перед сравнением выделите нужную часть."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · статусы и граница",
  "title": "У отменённого заказа снова появились кнопки — тест точно говорит, какое правило нарушено",
  "seg": {
   "a": [
    "Из условия <b>выпал <code>CANCELLED</code></b>: код работает, сервер тоже не даёт ошибки",
    "Отменённый статус выпал из условия. Бот работает, сервер тоже не даёт ошибки. Но под отменённым заказом админ снова видит кнопки «доставлен» и «отмена». Запускаем тест."
   ],
   "b": [
    "Из трёх тестов один красный: <b>ожидался <code>toBeUndefined</code>, а пришла клавиатура</b>",
    "Из трёх тестов один красный. Строка с точкой называет правило: доставлен и отменён, кнопок нет. В строке received вместо undefined пришла клавиатура, внутри кнопки «доставлен» и «отменить». Знак «больше» в тридцать третьей строке: статус «отменён»."
   ],
   "c": [
    "Итог: <b>имя теста называет правило</b> — по FAIL сразу видно, какое правило нарушено",
    "Итог: пишите имя теста как правило, например «отменён, кнопок нет». Тогда по первой строке FAIL вы сразу знаете, какое правило нарушено. Восстанавливаем условие, тест снова зелёный."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченное в коде условие <code>CANCELLED</code>",
    "Тесты зелёные. Теперь ломаем код намеренно, потому что выпасть из условия одному статусу очень легко. Ломаете вы сами: в тридцать девятой строке файла keyboards ts подсвечено условие отменённого статуса, нажмите на него.",
    "Нажмите на <b><code>|| o.status === 'CANCELLED'</code></b> в 39-й строке <b>keyboards.ts</b> — этот кусок исчезнет из условия."
   ]
  }
 },
 "15": {
  "kicker": "Этап 4 · статусы и граница",
  "title": "Ошибка чаще всего на границе: отдельный тест для первой, последней и единственной страницы",
  "seg": {
   "a": [
    "Каталог по два на странице: <b>◀ нет на первой, ▶ нет на последней</b>",
    "Переходим к каталогу. Товары показываются по два на странице. На первой странице нет левой стрелки, на последней нет правой, в середине есть обе. Если товаров меньше двух, страница одна и стрелок нет вообще."
   ],
   "b": [
    "Четыре ситуации — четыре теста: <b>первая, средняя, последняя и единственная страница</b>",
    "На эти четыре ситуации пишем четыре теста: первая, средняя, последняя и единственная страница. Помощник nav в сорок первой строке файла keyboards spec ts берёт из клавиатуры только строку со стрелками. Пятый тест проверяет закончившийся товар: на него нельзя нажать."
   ],
   "c": [
    "Вместо «меньше» — <b>«меньше или равно»</b>: средняя страница этого не замечает",
    "Ломаем код: в двадцать первой строке файла keyboards ts вместо знака «меньше» — «меньше или равно». Теперь правая стрелка появляется и на последней странице. Результат: два теста красные, последняя и единственная страница. Тест средней страницы остался зелёным, потому что она не на границе. Jest показал разницу знаком плюс."
   ],
   "d": [
    "Итог: <b>на каждое условие — тест границы</b> — тесты без границы этой ошибки не видят",
    "Итог: на границу каждого условия пишите отдельный тест: первая, последняя и единственная страница. Если проверять только среднюю страницу, эта ошибка останется скрытой. Разница между «меньше» и «меньше или равно» видна только на границе."
   ]
  }
 },
 "16": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4",
  "title": "Есть только два теста: «первая страница» и «средняя страница». В коде написали page <= pages - 1. Что скажет npm test?",
  "q": "Вы видели границу, теперь проверим. Третья проверка. Есть только два теста: первая страница и средняя страница. В коде написали «меньше или равно», то есть правая стрелка появляется и на последней странице. Что скажет npm test? Выберите вариант.",
  "ok": "Верно. На первой и средней странице правая стрелка всё равно есть, ошибка видна только на последней. Мы проверили: с четырьмя тестами покраснели два, последняя и единственная страница. Без этих двух тест зелёный, а ошибка в коде. Значит, зелёный тест говорит только о проверенных ситуациях.",
  "okShort": "Оба теста не на границе — PASS. Ошибку ловят только тесты последней и единственной страницы.",
  "hint": "При каком значении page < и <= дают разный результат? Есть ли это значение в тестах?",
  "demak": "зелёный тест говорит только о проверенных ситуациях.",
  "opts": [
   "Оба PASS — ошибка только на последней странице",
   "Оба FAIL — правило стрелок нарушено",
   "«средняя страница» FAIL — она получает ▶ дважды",
   "Ошибка TypeScript — <= здесь не работает"
  ],
  "wrong": {
   "1": "На первой странице ▶ выходит правильно — ошибка там не видна.",
   "2": "В середине ▶ всё равно есть — и <, и <= дают одинаковый результат.",
   "3": "<= — правильный TypeScript; ошибка в логике."
  }
 },
 "17": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Напишите тесты для кнопок админа и каталога, потом один раз сломайте код и увидьте красный",
  "seg": {
   "a": [
    "Теперь вы: <b><code>keyboards.spec.ts</code></b> — статусы и граница каталога",
    "Теперь ваша очередь. Пишете тестовый файл для keyboards: кнопки админа и страницы каталога. Не копируйте тесты с экрана, пишите сами: эталон каждый раз продумываете сами. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: тесты <b>на каждый статус и четыре страницы</b>; всё зелёное",
    "На первом шаге пишете для order keyboard тест на каждый статус. На втором — для catalog keyboard тесты первой, последней и единственной страницы. Npm test keyboards: всё должно быть зелёным."
   ],
   "c": [
    "Шаги 3–4: <b>нарочно сломайте</b> код, увидьте красный и восстановите; подтверждение — имя красного теста",
    "На третьем шаге сломайте одно условие в файле keyboards: статус «отменён» или «меньше или равно». Посмотрите, какой тест покраснел. На четвёртом восстановите код через git checkout. В поле подтверждения напишите имя покрасневшего теста."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы пишете тест на каждый статус и границу и сами доказали, что он ловит ошибку."
   ]
  },
  "steps": [
   {
    "t": "orderKeyboard",
    "exp": "3 ✓"
   },
   {
    "t": "catalogKeyboard",
    "exp": "Tests: … passed",
    "cmds": [
     "первая",
     "последняя",
     "единственная страница (0, 3",
     null,
     null
    ]
   },
   {
    "t": "Поломка",
    "exp": "✕ oxirgi sahifada ▶ yo'q или ✕ yetkazilgan va bekor qilingan — tugma yo'q",
    "cmds": [
     "удалите условие o.status === 'CANCELLED' в keyboards.ts с 39-й строки или в 21-й строке < → <=",
     null
    ]
   },
   {
    "t": "Восстановление",
    "exp": "всё ✓"
   }
  ],
  "proof": {
   "label": "Имя теста, покрасневшего (✕) на шаге 3 — не команда",
   "placeholder": "например: oxirgi sahifada ▶ yo'q",
   "wrong": "Напишите сюда не команду, а имя теста рядом со знаком ✕ в терминале, например: oxirgi sahifada ▶ yo'q."
  },
  "trouble": [
   [
    "с toBe: serializes to the same string",
    "массив — toEqual (экран 13)"
   ],
   [
    "В эталоне нет hide: false — FAIL",
    "добавляет Telegraf: выделите только text и callback_data или toMatchObject"
   ],
   [
    "На шаге 3 всё ✓",
    "на сломанное условие нет теста — добавьте тест на эту ситуацию (экран 16)"
   ]
  ]
 },
 "18": {
  "kicker": "Этап 5 · тест от AI",
  "title": "Новый навык: принимать тест, написанный AI — сначала два опыта с AI",
  "seg": {
   "a": [
    "Новый этап, новый навык: <b>тест пишет AI, вы его принимаете</b>",
    "Теперь начинается новый этап, и это другой навык. За четыре этапа вы писали тесты сами и научились читать FAIL. А на работе тест часто пишет AI. Ваша задача теперь не писать, а принимать: действительно ли тест от AI ловит ошибку. Посмотрим это в реальном опыте с двумя разными AI."
   ],
   "b": [
    "Промпт в одно предложение: <b>«напиши тесты, пусть будут зелёными»</b> — ментор обычно так и пишет",
    "Опыт был такой. Двум разным AI мы дали одинаковый простой промпт: напиши jest-тесты для texts и keyboards, пусть npm test будет зелёным. Нарочно коротко, потому что ментор часто так и пишет. Каждый AI работал в отдельной копии проекта."
   ],
   "c": [
    "Оба <b>добавили только два тестовых файла</b>, код не трогали: 36 и 33 теста, все зелёные",
    "Результат выглядит хорошо. Оба добавили только два тестовых файла и не трогали код, git diff stat это подтверждает. Первый написал тридцать шесть тестов, второй тридцать три, все зелёные. Оба сами заметили неразрывный пробел."
   ],
   "d": [
    "Но пробел <b>решили по-разному</b>: один заменяет, другой вставил невидимый символ",
    "Но пробел они решили по-разному. Первый перед сравнением заменяет неразрывный пробел обычным и написал ещё про один символ: в зависимости от версии Node это может быть другой символ. На нашем Node это не так, мы проверили. А в эталоне второго стоит сам невидимый символ — ловушка с седьмого экрана."
   ],
   "e": [
    "Итог: <b>«всё зелёное» — не проверка</b>; проверять нужно сам тест",
    "Итог: оба AI выполнили обещание, тесты зелёные. Но зелёный тест не значит хороший тест. Слова AI тоже проверяем. Один надёжный способ узнать, ловит ли тест ошибку, увидите на следующем экране."
   ]
  }
 },
 "19": {
  "kicker": "Этап 5 · внутри",
  "title": "Проверяем набор тестов, ломая код: не покраснел — эта поломка без защиты",
  "seg": {
   "a": [
    "Способ простой: <b>нарочно сломайте код</b> и посчитайте, сколько тестов покраснело",
    "Способ простой: нарочно сломайте код и посчитайте, сколько тестов покраснело. Если не покраснел ни один, эта поломка без защиты. Мы взяли пять поломок: формат цены, цена в корзине, кнопка отменённого заказа, последняя страница и текст статуса. Проверили все три набора."
   ],
   "b": [
    "Наши <b>десять тестов не заметили двух поломок</b>: тексты мы не проверяли",
    "Сначала признаем своё. Наши десять тестов не заметили двух поломок: цену в корзине и текст статуса. Причина простая: из файла texts мы проверяли только som. Где нет теста, там нет защиты."
   ],
   "c": [
    "36 тестов <b>не заметили смены текста статуса</b>: <code>toBeTruthy</code> говорит только «есть ли»",
    "Набор из тридцати шести тестов тоже не заметил, что текст статуса изменился. Его тест проверяет только, что для каждого статуса есть какой-то текст, через to be truthy. Даже если текст изменится, тест зелёный. А во втором наборе, когда сломали som, из тридцати трёх покраснел только один: тесты с эталоном из кода."
   ],
   "d": [
    "Итог: <b>число тестов — не качество</b>, качество — какую поломку он ловит",
    "Итог: число тестов — не качество. Даже тридцать шесть тестов пропустили одну поломку. Качество — это какую поломку ловит тест. После того как AI написал тесты, сломайте код в трёх-четырёх местах. Туда, где ничего не покраснело, добавьте тест."
   ]
  }
 },
 "20": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "Тест от AI: expect(STATUS_UZ.CANCELLED).toBeTruthy(). Кто-то поменял текст с «Bekor qilingan» на «Yangi». Что скажет тест?",
  "q": "Вы видели проверку поломкой, теперь проверим. Четвёртая проверка. Тест от AI проверяет текст статуса «отменён» через to be truthy. Кто-то по ошибке поменял текст на «новый»: клиент видит свой отменённый заказ как новый. Что скажет тест? Выберите вариант.",
  "ok": "Верно. To be truthy проверяет только, что значение не пустое. Текст «новый» тоже не пустой, поэтому тест зелёный. А клиент видит неверный статус. Если написать эталон точно, тест покраснеет. Значит, to be truthy проверяет, что значение есть, а не что оно верное.",
  "okShort": "Текст «Yangi» тоже не пустой — PASS. Это ловит точный <code>toBe</code>, ожидающий полный текст статуса.",
  "hint": "При каких значениях toBeTruthy даёт FAIL? Текст «Yangi» — одно из них?",
  "demak": "<code>toBeTruthy</code> проверяет, что значение есть, а не что оно верное.",
  "opts": [
   "FAIL — toBeTruthy замечает смену текста",
   "PASS — toBeTruthy говорит только, не пусто ли",
   "Ошибка TypeScript — изменился тип текста статуса",
   "FAIL — у двух статусов теперь одинаковый текст"
  ],
  "wrong": {
   "0": "toBeTruthy не сравнивает текст с эталоном — только не пусто ли.",
   "2": "Оба — string, тип не изменился.",
   "3": "Место и имя файла не изменились."
  }
 },
 "21": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Дайте своему AI промпт с точными условиями, потом четыре проверки и три поломки",
  "seg": {
   "a": [
    "Теперь вы: даёте AI <b>промпт с точными условиями</b> — для текстов заказа в <code>texts.ts</code>",
    "Теперь ваша очередь. Вы поручаете своему AI написать тесты, но на этот раз промптом с точными условиями. Тема: тексты корзины и заказа в файле texts. Промпт копируете кнопкой ниже. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: промпт и <b>diff — только <code>.spec.ts</code></b>, в эталоне нет <code>${…}</code>",
    "На первом шаге даёте промпт. На втором проверяете результат: в git diff stat только spec-файл, в каждом it есть expect, в эталоне функция не вызывается внутри доллара и скобок."
   ],
   "c": [
    "Шаги 3–4: <b>три поломки</b> — пусть все покраснеют; подтверждение — непокрасневшая поломка или «все»",
    "На третьем шаге по очереди ломаете код в трёх местах: формат цены, цена в корзине и текст статуса. После каждой — npm test, потом git checkout. Если какое-то место не покраснело, попросите AI написать тест на него. В поле подтверждения напишите результат."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы принимаете тест от AI не по количеству, а проверив его поломкой."
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
     "в каждом it есть expect",
     "в эталоне нет ${som( и ${STATUS_UZ",
     "grep -c 'u00a0' src/api/telegram/texts.spec.ts — больше 0 (есть escape-запись)"
    ]
   },
   {
    "t": "Три поломки",
    "exp": "каждая ✕",
    "cmds": [
     "texts.ts: 'ru-RU' → 'en-US'",
     null,
     "'❌ Bekor qilingan' → '🆕 Yangi' — после каждой npm test и git checkout -- src/api/telegram/texts.ts"
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
   "placeholder": "например: покраснели все три · или: цена в корзине — сначала не покраснела, добавил тест",
   "wrong": "После каждой поломки напишите результат npm test."
  },
  "trouble": [
   [
    "в git diff --stat есть и texts.ts",
    "AI изменил код — git checkout -- src/api/telegram/texts.ts, повторите пункт «Не трогай» в промпте"
   ],
   [
    "В эталоне остался ${som(…)}",
    "AI не выполнил условие — напишите эти строки вручную (экран 10)"
   ],
   [
    "AI сказал «написал явно через  », grep -c 'u00a0' → 0",
    "в файле сам невидимый символ — так вышло у обоих AI (p2/XULOSA); напишите строки вручную через  , потом npm test"
   ],
   [
    "При поломке цены в корзине всё ✓",
    "нет теста, где price (цена на момент заказа) и product.price разные — попросите тест, где они отличаются"
   ],
   [
    "После sed или правки файл не изменился",
    "правьте вручную и сохраните (точка в VS Code — не сохранено)"
   ]
  ]
 },
 "22": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m4b-01 · «Unit-test: Jest»",
  "title": "Урок ученика: сайт KitobShop, одна функция orderTotal и Jestbot — маленький вариант пути, который вы знаете",
  "seg": {
   "a": [
    "m4b-01 — 21 экран: <b>сайт KitobShop</b>, <code>orderTotal</code> — цена, умноженная на количество",
    "Теперь подготовка к классу, два экрана. Урок ученика m4b-01, двадцать один экран. Пример — сайт KitobShop: функция order total умножает цену на количество. То есть не бот, а сайт. Но describe, it и expect точно такие же, как сегодня, потому что тест только вызывает функцию."
   ],
   "b": [
    "Урок ученика объясняет на примере <b>робота Jestbot</b> — вы называете слово термином",
    "Урок ученика объясняет тест на примере робота, робота зовут Jestbot. Папка робота — это describe, лист проверки — это it, карточка эталона — это expect. В классе говорите оба: карточка эталона, то есть expect, и показывайте эту строку."
   ],
   "c": [
    "Вы добавляете: <b>настоящий FAIL, кто ошибся, граница и проверка поломкой</b>",
    "Что вы добавляете к уроку: урок ученика показывает результат на карточке, а вы прочитайте на проекторе настоящий FAIL. На каждом FAIL спрашивайте: кто ошибся, код или эталон? В домашнем задании пусть проверят delivery fee именно на граничном значении. Если тест зелёный, пусть один раз сломают код."
   ],
   "d": [
    "Итог: перед практикой — <b>тест внутри <code>src/</code>, имя <code>.spec.ts</code></b>, сделан <code>npm install</code>",
    "Итог: перед практикой проверьте три вещи. Репозиторий установлен через npm install, тестовый файл внутри src, имя заканчивается на spec ts. Предложение по времени: из девяноста минут двадцать пять на практику, потому что на настройку уходит время."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Пять ситуаций и готовые ответы — четыре вы сегодня видели сами",
  "seg": {
   "a": [
    "Пять ситуаций, которые обязательно будут в классе — <b>четыре сегодня были и у вас</b>",
    "Теперь посмотрим пять ситуаций, которые обязательно возникнут на уроке ученика. Четыре вы сегодня видели сами, поэтому скажу коротко. Пятая связана с репозиторием ученика."
   ],
   "b": [
    "Не найдено и <code>npm ci</code> — <b>место, имя и <code>npm install</code></b>",
    "Первая — no tests found: проверьте место и имя файла. Вторая связана с репозиторием ученика: npm ci падает, потому что package json и lock-файл не синхронны. Сделайте npm install. Это недостаток репозитория, а не ошибка ученика."
   ],
   "c": [
    "Ложный зелёный и одинаковый на вид FAIL — <b><code>expect</code>, эталон вручную, <code>toEqual</code></b>",
    "Третья: тест зелёный, но expect нет или эталон взят из кода. Четвёртая: строки одинаковые, тест красный: невидимый символ или массив сравнили через to be. Пятая — пустой проект: самый быстрый путь — писать тест в репозитории ученика."
   ],
   "d": [
    "Итог: если ученик говорит «AI написал, зелёное» — <b>пусть сломает одно место</b>",
    "Итог и способ: если ученик говорит, что AI написал тесты и всё зелёное, пусть сам сломает одно место в коде и увидит, как тест краснеет. Не говорите ответ сразу, прочитайте сообщение в терминале вместе. Внизу готовые ответы на вопросы учеников."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "package.json: rootDir: \"src\", testRegex: \".*\\\\.spec\\\\.ts$\". Файл src/order.test.ts. npm test?",
    "e": "Имя не .spec.ts.",
    "o": [
     "No tests found — имя не .spec.ts",
     "PASS — Jest берёт и .test.ts",
     "Cannot find module — order не найден",
     "PASS — достаточно rootDir: src"
    ]
   },
   {
    "q": "Expected: \"120 000 so'm\" · Received: \"120 000 so'm\" — тест FAIL. Первый шаг?",
    "e": "toBe сравнивает посимвольно: U+00A0.",
    "o": [
     "Переустановить Jest и запустить снова",
     "Вывести коды символов и сравнить",
     "Удалить тест и проверить вручную",
     "Поставить toBeTruthy вместо toBe"
    ]
   },
   {
    "q": "Внутри it только console.log(som(120000)). Результат?",
    "e": "Ошибку бросает только expect.",
    "o": [
     "FAIL — отсутствие expect считается ошибкой",
     "No tests found — пустой it не считается",
     "PASS — Jest ничего не сравнил",
     "SyntaxError — console.log в тесте запрещён"
    ]
   },
   {
    "q": "Эталон: ` Jami: ${som(100000)} . som` сломалась. Тест?",
    "e": "Эталон пишется вручную.",
    "o": [
     "FAIL — поломка som сразу замечена",
     "Ошибка TypeScript — неверная шаблонная строка",
     "Cannot find module — som не импортировалась",
     "PASS — эталон сломался вместе с ней"
    ]
   },
   {
    "q": "expect(buttons).toBe([['◀', '1/3']]) — массивы одинаковые, но FAIL. Причина?",
    "e": "serializes to the same string.",
    "o": [
     "toBe ждёт тот же объект — нужен toEqual",
     "Знак стрелки в массиве другим кодом",
     "Jest устарел — не умеет сравнивать массивы",
     "Эмодзи в массиве хранятся иначе"
    ]
   },
   {
    "q": "Тесты проверяют только первую и среднюю страницу, в коде ошибка <=. Результат?",
    "e": "Зелёный тест — только о проверенной ситуации.",
    "o": [
     "Оба FAIL — <= ломает все страницы",
     "Оба PASS — ошибка скрыта на границе",
     "Средняя FAIL — получает ▶ дважды",
     "Ошибка TypeScript — <= не для чисел"
    ]
   },
   {
    "q": "AI написал 36 тестов, все зелёные. Самая надёжная проверка перед приёмом?",
    "e": "Не число — пойманная поломка.",
    "o": [
     "Посчитать тесты и убедиться, что их больше 30",
     "Перезапустить тесты и снова увидеть зелёный",
     "Сломать код в 3 местах и увидеть, как тест краснеет",
     "Спросить AI: «ты всё проверил?»"
    ]
   },
   {
    "q": "expect(STATUS_UZ.CANCELLED).toBeTruthy(), текст изменился на «Yangi». Тест?",
    "e": "toBeTruthy — есть ли, а не верно ли.",
    "o": [
     "FAIL — текст стал не «отменён», а «новый»",
     "No tests found — STATUS_UZ не найден",
     "Ошибка TypeScript — изменился тип текста",
     "PASS — toBeTruthy только «не пусто ли»"
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
  ru(S7, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.S7) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S12, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.S12) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S19, { ...head(19), ...((typeof RU_S !== 'undefined' && RU_S.S19) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P8.S, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.P8_S) || {}) });
  ru(P8.steps, RU_MDT[8].steps);
  ru(P8.trouble, RU_MDT[8].trouble);
  ru(P8.proof, RU_MDT[8].proof);
  ru(P17.S, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.P17_S) || {}) });
  ru(P17.steps, RU_MDT[17].steps);
  ru(P17.trouble, RU_MDT[17].trouble);
  ru(P17.proof, RU_MDT[17].proof);
  ru(P21.S, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.P21_S) || {}) });
  ru(P21.steps, RU_MDT[21].steps);
  ru(P21.trouble, RU_MDT[21].trouble);
  ru(P21.proof, RU_MDT[21].proof);
  ru(FINAL, RU_MDT[24].final);
})();
