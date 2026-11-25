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
//  NEST DARSLARI RASMI (F-1120-02) — Nest-1 (parts/*) va Nest-2 (yig.sh) ga yig'iladi.
//  Nest mashinasi: brauzer → Controller → Service, Module ro'yxati, Nest konteyneri; DI, «Buzamiz» kichik rasmlari,
//  Module ro'yxatlari, o'quvchi loyihasi yo'li (KitchenMap). Umumiy qism — parts/02b-rasm.jsx.
// ============================================================
// ---------- Katta mashina: brauzer + Nest ilovasi (Module, Controller, Service) + yo'laklar ----------
// st: br · mod · ctrl · svc — '' | 'hl' | 'g' | 'dim' | 'off'
// pkt: { x: 'b'|'c'|'s', lane: 1|2, label, grn, off, loop } · fill: [so'rov yo'lagi, javob yo'lagi] px (0…501)
const NM_X = { b: 105, c: 348, s: 606 };
const N1_APP = {
  names: { ctrl: 'AppController', svc: 'AppService', mod: 'AppModule' },
  files: { ctrl: 'src/app.controller.ts', svc: 'src/app.service.ts' },
  codes: { ctrl: '<span class="n1-d">@Get</span>() getHello()', svc: "<span class=\"n1-k\">return</span> <span class=\"n1-s\">'Hello World!'</span>" },
  chips: ['controllers: [AppController]', 'providers: [AppService]'],
};
const N1_CARS = {
  names: { ctrl: 'CarsController', svc: 'CarsService', mod: 'CarsModule' },
  files: { ctrl: 'src/cars/cars.controller.ts', svc: 'src/cars/cars.service.ts' },
  codes: { ctrl: '<span class="n1-d">@Get</span>() findAll()', svc: '<span class="n1-k">return this</span>.cars' },
  chips: ['controllers: [CarsController]', 'providers: [CarsService]'],
};
function NestMachine({ cfg = N1_APP, st = {}, url = 'localhost:3000', out, outKind, roles, lab, sock, exp, links, modHot, lanes, pkt, fill = [0, 0], readRow, read, tag, max, extra }) {
  const frameBottom = exp != null ? 330 : 292;
  const lanesTop = frameBottom + 30;
  const readTop = lanes ? lanesTop + 108 : frameBottom + 18;
  const H = readRow ? readTop + 48 : (lanes ? lanesTop + 94 : frameBottom + 6);
  const y1 = lanesTop + 30, y2 = lanesTop + 66;
  const R = roles || { ctrl: t("so'rovni qabul qiladi", 'принимает запрос'), svc: t('ishni bajaradi', 'выполняет работу') };
  const part = (k, x) => (
    <div className="n1-part n1-st" data-st={st[k] || ''} style={{ '--c': k === 'ctrl' ? PART.ctrl : PART.svc, left: x, top: 124, width: 236, height: 152 }}>
      <div className="nm"><i />{cfg.names[k]}</div>
      <div className="role">{R[k]}</div>
      {!(sock && sock[k]) && <span className="cd" dangerouslySetInnerHTML={html(cfg.codes[k])} />}
      {sock && sock[k] && <span className={`n1-sock${sock[k].er ? ' er' : ''}`} style={{ left: 14, top: 72, width: 150 }}>{sock[k].t}</span>}
      {lab && lab[k] && <span className="lab"><span className="n1-lab">{lab[k]}</span></span>}
      <span className="fl">{cfg.files[k]}</span>
    </div>
  );
  return <N1Fit w={760} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 8 }}>{tag}</span>}
    <div className="n1-br n1-st" data-st={st.br || ''} style={{ left: 20, top: 58, width: 170, height: 170 }}>
      <div className="top"><i /><i /><i /><span>{url}</span></div>
      <div className="bd">{out == null ? <span className="wait">{t('javob kutilmoqda…', 'ждём ответ…')}</span> : <span key={String(out)} className={`out${outKind ? ' ' + outKind : ''}`}>{out}</span>}</div>
    </div>
    <span className="n1-cap" style={{ left: 20, top: 236, width: 170 }}>{t('Brauzer · loyihadan tashqarida', 'Браузер · вне проекта')}</span>
    <div className="n1-app" style={{ left: 214, top: 34, width: 526, height: frameBottom - 34 }} />
    <span className="n1-tagl" style={{ left: 230, top: 44 }}>{t('Nest ilovasi · cars-api', 'Приложение Nest · cars-api')}</span>
    <div className="n1-mod n1-st" data-st={st.mod || ''} style={{ left: 230, top: 66, width: 494, height: 44 }}>
      <span className="lg">{cfg.names.mod} · {t("ro'yxat", 'список')}</span>
      {lab && lab.mod && <span className="lab"><span className="n1-lab">{lab.mod}</span></span>}
    </div>
    <span className={`n1-chip${modHot ? ' hot' : ''}`} style={{ left: 348, top: 76, transform: 'translateX(-50%)' }}>{cfg.chips[0]}</span>
    <span className={`n1-chip${modHot ? ' hot' : ''}`} style={{ left: 606, top: 76, transform: 'translateX(-50%)' }}>{cfg.chips[1]}</span>
    <i className={`n1-link${links ? ' on' : ''}`} style={{ left: 347, top: 110, height: 14 }} />
    <i className={`n1-link${links ? ' on' : ''}`} style={{ left: 605, top: 110, height: 14 }} />
    {part('ctrl', 230)}
    {part('svc', 488)}
    {exp != null && <div className="n1-exp n1-st" data-st={exp} style={{ left: 230, top: 288, width: 494, height: 30 }}><b>{t('Ichida: Express', 'Внутри: Express')}</b><span>(platform-express) — {t("so'rovni haqiqatda shu qabul qiladi", 'запрос на самом деле принимает он')}</span></div>}
    {lanes && <>
      <i className="n1-stem" style={{ left: 104, top: 252, height: lanesTop - 252 }} />
      <i className="n1-stem" style={{ left: 347, top: 276, height: lanesTop - 276 }} />
      <i className="n1-stem" style={{ left: 605, top: 276, height: lanesTop - 276 }} />
      <div className="n1-lanes" style={{ left: 20, top: lanesTop, width: 720, height: 94 }}>
        <i className="n1-ln" style={{ left: 85, width: 501, top: 30 }} />
        <i className="n1-ln" style={{ left: 85, width: 501, top: 66 }} />
        <i className="n1-lf r" style={{ left: 85, top: 30, width: fill[0] }} />
        <i className="n1-lf g" style={{ right: 720 - 586, top: 66, width: fill[1] }} />
        {[85, 328, 586].map((x) => <React.Fragment key={x}><i className="n1-stn" style={{ left: x, top: 31 }} /><i className="n1-stn" style={{ left: x, top: 67 }} /></React.Fragment>)}
        <span className="n1-lbl" style={{ top: 31 }}>{t("so'rov →", 'запрос →')}</span>
        <span className="n1-lbl" style={{ top: 67 }}>{t('← javob', '← ответ')}</span>
      </div>
      {pkt && <span className={`n1-pk${pkt.grn ? ' grn' : ''}${pkt.off ? ' off' : ''}${pkt.loop ? ' loop' : ''}`} style={pkt.loop ? { '--xa': NM_X.b + 'px', '--xc': NM_X.s + 'px', '--y1': y1 + 'px', '--y2': y2 + 'px', left: NM_X.b, top: y1 } : { left: NM_X[pkt.x || 'b'], top: pkt.lane === 2 ? y2 : y1 }}>{pkt.label}</span>}
    </>}
    {readRow && <div className={`n1-ro${read ? '' : ' off'}`} style={{ left: 20, top: readTop, width: 720, height: 46 }}>{read && <><span className="rf">{read[0]}</span><code dangerouslySetInnerHTML={html(read[1])} /></>}</div>}
    {extra}
  </N1Fit>;
}

// ---------- 14-ekran: Dependency Injection — Nest konteyneri instance'ni konstruktorga olib boradi ----------
// st qadamlari (S11 segmentlari bilan bir xil tartib): a savol · b Express · c providers · d instance · e konstruktorga · f nom · g foyda · h xulosa
function DiMachine({ beat }) {
  const T8 = [
    // mod, box, ctrl, prov, prm, sock, tok, pth, row, rowDim, ro
    ['g', 'g', 'hl', 0, 1, 'wait', 'off', '', 1, 0, null],
    ['g', 'g', 'dim', 0, 0, 'empty', 'off', '', 2, 0, null],
    ['hl', '', 'dim', 1, 0, 'empty', 'off', 'dash', 2, 1, ['src/app.module.ts:8', 'providers: [<span class="n1-c">AppService</span>],']],
    ['', 'hl', 'dim', 0, 0, 'empty', 'box', 'dash', 2, 1, ['terminal', '[Nest] LOG [InstanceLoader] <span class="n1-ok">AppModule dependencies initialized</span>']],
    ['', '', 'hl', 0, 1, 'full', 'slot', 'solid', 2, 1, ['terminal', '[Nest] LOG [InstanceLoader] <span class="n1-ok">AppModule dependencies initialized</span>']],
    ['', '', '', 0, 0, 'full', 'slot', 'solid', 2, 1, ['terminal', '[Nest] LOG [InstanceLoader] <span class="n1-ok">AppModule dependencies initialized</span>']],
    ['', '', '', 0, 0, 'full', 'slot', 'solid', 3, 0, null],
    ['', '', '', 1, 1, 'full', 'slot', 'solid', 3, 1, null],
  ][Math.min(beat, 7)];
  const [mod, box, ctrl, prov, prm, sock, tok, pth, row, rowDim, ro] = T8;
  const slot = tok === 'slot';
  const rowCls = (r) => `n1-row${row === r ? ' on' : ''}${row === r && rowDim ? ' dim' : ''}`;
  const files = [['cars.js', 1], ['orders.js', 2], ['users.js', 3]];
  return <N1Fit w={760} h={510}>
    <span className="n1-tagl" style={{ left: 26, top: 8 }}>{t("Nest ishga tushganda — birinchi so'rovdan oldin", 'Когда Nest запускается — до первого запроса')}</span>
    <div className="n1-mod n1-st" data-st={mod} style={{ left: 26, top: 40, width: 708, height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
      <span className="lg">AppModule</span>
      <span className="n1-chip" style={{ position: 'static' }}>controllers: [AppController]</span>
      <span className={`n1-chip${prov ? ' hot' : ''}`} style={{ position: 'static' }}>providers: [AppService]</span>
      <span className={`n1-you${beat >= 7 ? ' on' : ''}`} style={{ position: 'static' }}>{t('1 · siz yozasiz', '1 · пишете вы')}</span>
      <span style={{ marginLeft: 'auto', font: `500 11px ${MONO}`, color: T.ink3 }}>src/app.module.ts</span>
    </div>
    <svg className="n1-svg" width="760" height="510" viewBox="0 0 760 510"><defs><marker id="n1ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={pth === 'solid' ? T.green : '#A8AFBD'} /></marker></defs><path className={`n1-pth${pth ? ' ' + pth : ''}`} d="M208 186 C242 186 250 222 296 222" markerEnd="url(#n1ah)" /></svg>
    <div className={`n1-box2 n1-st${tok !== 'off' ? ' has' : ''}`} data-st={box} style={{ left: 26, top: 106, width: 180, height: 186 }}>
      <span className="bl">{t('NEST KONTEYNERI', 'КОНТЕЙНЕР NEST')}</span>
      <span className="sh" style={{ left: 15, top: 60, width: 150, height: 40 }}>{t("bo'sh", 'пусто')}</span>
      <span className={`nq${beat >= 7 ? ' on' : ''}`}>{t("Yaratish va berish — Nest'ning ishi", 'Создать и передать — работа Nest')}</span>
    </div>
    <div className="n1-part n1-st" data-st={ctrl} style={{ '--c': PART.ctrl, left: 286, top: 106, width: 448, height: 186 }}>
      <div className="nm"><i />AppController</div>
      <span className="fl" style={{ left: 'auto', right: 14, top: 16, bottom: 'auto' }}>src/app.controller.ts:6</span>
      <div className="n1-line" style={{ left: 14, top: 46, width: 420 }}><span><span className="n1-k">constructor</span>(<span className="n1-k">private readonly</span> <span className={`n1-prm${prm ? ' hot' : ''}`}>appService: <span className="n1-c">AppService</span></span>) {'{}'}</span></div>
      <span className={`n1-sock${sock === 'wait' ? ' wait' : ''}`} style={{ left: 14, top: 98, width: 150, borderStyle: slot ? 'solid' : 'dashed', borderColor: slot ? 'transparent' : undefined }}>{sock === 'full' ? '' : '?'}</span>
      <span className="n1-abs" style={{ left: 178, top: 107, font: `500 12.5px ${MONO}`, color: T.ink2, whiteSpace: 'nowrap' }}>→ this.appService <b className="n1-tayyor" style={{ opacity: slot ? 1 : 0 }}>✓ {t('tayyor', 'готово')}</b></span>
      <span className={`n1-you${beat >= 7 ? ' on' : ''}`} style={{ left: 300, top: 147 }}>{t("2 · siz so'raysiz", '2 · просите вы')}</span>
    </div>
    <span className={`n1-tok twin${slot ? ' on' : ''}`} style={{ left: 116, top: 186, width: 150 }}><i />AppService</span>
    <span className={`n1-tok${tok === 'off' ? ' off' : ''}`} style={{ left: slot ? 375 : 116, top: slot ? 222 : 186, width: 150 }}><i />AppService</span>
    <span className={`n1-ann${beat >= 5 ? ' on' : ''}`} style={{ left: 214, top: 150 }}><b>inject</b></span>
    <span className={`n1-ann${beat === 5 || beat === 6 ? ' on' : ''}`} style={{ left: 300, top: 252 }}><b>dependency</b> — {t('Controller usiz ishlamaydi', 'Controller без него не работает')}</span>
    <div className={`${rowCls(1)} n1-srch`} style={{ left: 26, top: 312, width: 708, height: 128 }}>
      <span className="n1-tagl" style={{ left: 14, top: 12 }}>{t('Search · butun loyiha', 'Search · весь проект')}</span>
      <div className="n1-fld" style={{ left: 14, top: 36, width: 420 }}><span style={{ color: T.ink3 }}>⌕</span><span>new AppService</span></div>
      <div className="n1-res" style={{ left: 14, top: 86 }}>{t('0 ta natija', '0 результатов')}<span>{t("hech kim uni new bilan yaratmagan", 'никто не создавал его через new')}</span></div>
    </div>
    <div className={rowCls(2)} style={{ left: 26, top: 312, width: 708, height: 128 }}>
      <span className="n1-tagl" style={{ left: 0, top: 0 }}>{t('Express · shartli misol — uch fayl, uch marta new', 'Express · условный пример — три файла, три раза new')}</span>
      {files.map(([f, n], i) => <div key={f} className="n1-exf" style={{ left: i * 241, top: 24, width: 226, height: 104 }}>
        <div className="tb">{f}</div>
        <span className="cl"><span style={{ color: T.ink3 }}>const</span> s = <b style={{ color: T.accent }}>new</b> CarsService();</span>
        <span className="n1-tok grey" style={{ left: 66, top: 78, width: 112, height: 28, fontSize: 11.5 }}><i />instance {n}</span>
      </div>)}
    </div>
    <div className={rowCls(3)} style={{ left: 26, top: 312, width: 708, height: 128 }}>
      <div className="n1-bn" style={{ left: 0, top: 0, width: 226, height: 128 }}>
        <svg width="200" height="72" viewBox="0 0 200 72"><rect x="4" y="6" width="74" height="24" rx="6" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><rect x="4" y="42" width="74" height="24" rx="6" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><path d="M78 18 C104 18 104 36 122 36 M78 54 C104 54 104 36 122 36" stroke={T.green} strokeWidth="2" fill="none" /><rect x="122" y="22" width="74" height="28" rx="14" fill="#E3F5EC" stroke={T.green} strokeWidth="2" /><circle cx="136" cy="36" r="4" fill={T.green} /></svg>
        <span className="bt">{t('Bitta instance', 'Один instance')}</span>
      </div>
      <div className="n1-bn" style={{ left: 241, top: 0, width: 226, height: 128 }}>
        <svg width="200" height="72" viewBox="0 0 200 72"><rect x="4" y="18" width="80" height="36" rx="8" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><rect x="14" y="27" width="60" height="18" rx="9" fill="#fff" stroke="#A8AFBD" strokeWidth="1.5" strokeDasharray="4 3" /><path d="M118 36 H90" stroke={PART.mod} strokeWidth="2" fill="none" /><path d="M96 31 L88 36 L96 41" stroke={PART.mod} strokeWidth="2" fill="none" /><rect x="118" y="22" width="78" height="28" rx="14" fill="#FFFBF0" stroke={PART.mod} strokeWidth="2" strokeDasharray="5 3" /><text x="157" y="40" textAnchor="middle" fontFamily={SANS} fontSize="11" fontWeight="700" fill={PART.mod}>{t('soxta', 'фейк')}</text></svg>
        <span className="bt">{t('Testda soxtasi beriladi', 'В тесте дают фейк')}</span>
      </div>
      <div className="n1-bn" style={{ left: 482, top: 0, width: 226, height: 128 }}>
        <svg width="200" height="72" viewBox="0 0 200 72"><rect x="110" y="18" width="86" height="36" rx="8" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><rect x="120" y="27" width="66" height="18" rx="9" fill="#E3F5EC" stroke={T.green} strokeWidth="1.5" /><path d="M64 36 H102" stroke={T.green} strokeWidth="2" fill="none" /><path d="M96 31 L104 36 L96 41" stroke={T.green} strokeWidth="2" fill="none" /><rect x="4" y="16" width="58" height="40" rx="10" fill="#F3F4F7" stroke="#9AA1B1" strokeWidth="2" strokeDasharray="5 3" /><text x="33" y="42" textAnchor="middle" fontFamily={SANS} fontSize="16" fontWeight="700" fill={T.ink3}>?</text></svg>
        <span className="bt">{t('Controller manbani bilmaydi', 'Controller не знает источника')}</span>
      </div>
    </div>
    <div className={`n1-ro${ro ? '' : ' off'}`} style={{ left: 26, top: 456, width: 708, height: 46 }}>{ro && <><span className="rf">{ro[0]}</span><code dangerouslySetInnerHTML={html(ro[1])} /></>}</div>
  </N1Fit>;
}

// 23 · providers bo'sh: Nest konteyneri bo'sh, CarsController konstruktori (?) — xatoning 3 bo'lagi raqam bilan
// who — dependency so'ragan klass · dep — yetishmagan dependency · mod — modul yorlig'i (Nest-2 20-ekran ham shu rasm)
function MiniProviders({ broken, fixed, pin, known = true, who = 'CarsController', dep = 'CarsService', mod = 'CarsModule · cars.module.ts' }) {
  const bad = broken && !fixed;
  const pins = [].concat(pin || []);
  const fs = dep.length > 14 ? 10.5 : 12.5;
  return <N1Mini>
    <div className="n1-mod" style={{ left: 6, top: 8, width: 380, height: 112 }}><span className="lg">{mod}</span></div>
    <span className={`n1-pin${pins.includes(3) ? ' on' : ''}`} style={{ left: 214, top: 4 }}>3</span>
    <div className={`n1-box2${bad ? '' : ' has'}`} style={{ left: 20, top: 28, width: 150, height: 80 }}><span className="bl" style={{ fontSize: 9.5, left: 10, top: 9 }}>{t('NEST KONTEYNERI', 'КОНТЕЙНЕР NEST')}</span><span className="sh" style={{ left: 9, top: 28, width: 128, height: 34 }}>{t("bo'sh", 'пусто')}</span></div>
    <span className={`n1-tok${bad ? ' off' : ''}`} style={{ left: 95, top: 79, width: 128, height: 34, fontSize: fs }}><i />{dep}</span>
    <i className={`n1-arr${bad ? ' bad' : ''}`} style={{ left: 176, top: 67, width: 30 }} />
    <div className="n1-part" style={{ '--c': PART.ctrl, left: 212, top: 28, width: 166, height: 80, padding: '8px 10px' }}>
      <div className="nm" style={{ fontSize: 13.5 }}><i />{who}</div>
      <span className={`n1-sock${bad ? ' er' : ''}`} style={{ left: 9, top: 28, width: 144, height: 34 }}>{bad ? '(?)' : ''}</span>
    </div>
    <span className={`n1-tok${bad ? ' off' : ''}`} style={{ left: 295, top: 79, width: 140, height: 34, fontSize: fs }}><i />{dep}</span>
    <span className={`n1-pin${pins.includes(1) ? ' on' : ''}`} style={{ left: 366, top: 20 }}>1</span>
    <span className={`n1-pin${pins.includes(2) ? ' on' : ''}`} style={{ left: 366, top: 70 }}>2</span>
    <span className="n1-tagl" style={{ left: 404, top: 12 }}>{t('Server', 'Сервер')}</span>
    <span className={`n1-say ${bad ? 'er' : 'ok'}`} style={{ left: 404, top: 34, color: known ? undefined : T.ink3 }}>{!known ? '…' : bad ? t('✕ yiqildi', '✕ упал') : t('✓ ishlayapti', '✓ работает')}</span>
    <span className={`n1-ann${pins.includes(2) ? ' on' : ''}`} style={{ left: 404, top: 64, fontSize: 11.5, whiteSpace: 'normal', width: 112 }}>{t('index [0] — birinchi parametr', 'index [0] — первый параметр')}</span>
  </N1Mini>;
}
// 24 · imports'da CarsModule yo'q: AppModule CarsModule'ni ulamadi — Nest cars papkasini o'qimadi, /cars → 404
function MiniImports({ broken, fixed, known = true, unread = true }) {
  const bad = broken && !fixed;
  const dim = bad && unread ? 'g' : '';
  return <N1Mini>
    <div className="n1-mod" style={{ left: 4, top: 8, width: 194, height: 104 }}><span className="lg">AppModule</span></div>
    <span className="n1-chip" style={{ left: 14, top: 28, fontSize: 11.5 }}>{bad ? 'imports: []' : 'imports: [CarsModule]'}</span>
    <span className="n1-chip" style={{ left: 14, top: 64, fontSize: 11.5, opacity: .6 }}>AppController</span>
    <i className={`n1-arr${bad ? ' bad' : ''}`} style={{ left: 204, top: 60, width: 30 }} />
    {bad && <span className="n1-say er" style={{ left: 210, top: 34, fontSize: 14 }}>✕</span>}
    <div className="n1-mod n1-st" data-st={dim} style={{ left: 240, top: 8, width: 152, height: 104 }}><span className="lg">CarsModule</span></div>
    <span className="n1-chip n1-st" data-st={dim} style={{ left: 250, top: 28, fontSize: 11.5, borderColor: '#BFD9EA' }}>CarsController</span>
    <span className="n1-chip n1-st" data-st={dim} style={{ left: 250, top: 64, fontSize: 11.5, borderColor: '#BFE3D2' }}>CarsService</span>
    {bad && unread && <span className="n1-say er" style={{ left: 250, top: 94, fontSize: 11.5, background: T.paper, padding: '0 4px' }}>{t("Nest o'qimadi", 'Nest не прочитал')}</span>}
    <Res left={404} top={26} rows={bad ? [['GET /cars', known ? 404 : null], ['GET /', known ? 200 : null]] : [['GET /cars', 200], ['GET /', 200]]} />
  </N1Mini>;
}
// 25 · @Controller('cars') yo'q: klass controllers ro'yxatida, lekin belgisi yo'q — Nest tanimaydi
function MiniCtrlDeco({ broken, fixed }) {
  const bad = broken && !fixed;
  return <N1Mini>
    <div className="n1-part" style={{ '--c': PART.ctrl, left: 6, top: 8, width: 230, height: 104, padding: '40px 12px 10px' }}>
      <div className="nm" style={{ fontSize: 14 }}><i />CarsController</div>
      <div className="role" style={{ fontSize: 12 }}>controllers: [CarsController]</div>
    </div>
    <span className={`n1-badge ${bad ? 'gone' : 'ok'}`} style={{ left: 18, top: 18 }}>{bad ? t("@Controller — yo'q", '@Controller — нет') : "@Controller('cars')"}</span>
    <i className={`n1-arr${bad ? ' bad' : ''}`} style={{ left: 244, top: 60, width: 30 }} />
    <div className="n1-box2" style={{ left: 282, top: 8, width: 232, height: 104 }}>
      <span className="bl" style={{ fontSize: 9.5 }}>NEST</span>
      <span className={`n1-say ${bad ? 'er' : 'ok'}`} style={{ left: 14, top: 30, whiteSpace: 'normal', width: 206 }}>{bad ? t('belgi yo\'q → «invalid controller», server yiqildi', 'нет метки → «invalid controller», сервер упал') : t("Controller deb tanidi → Mapped {/cars, GET}", 'узнал как Controller → Mapped {/cars, GET}')}</span>
    </div>
  </N1Mini>;
}
// 26 · @Injectable() yo'q: dependency'siz ishlaydi; PricingService qo'shilsa — konstruktorga hech narsa kelmaydi, so'rovda 500
function MiniInjectable({ broken, dep, fixed, known = true }) {
  const bad = broken && !fixed;
  const res = !known ? null : !dep ? 200 : bad ? 500 : 200;
  return <N1Mini>
    <div className="n1-part" style={{ '--c': PART.svc, left: 4, top: 8, width: 280, height: 104, padding: '8px 12px' }}>
      <div className="nm" style={{ fontSize: 14, marginTop: 4 }}><i />CarsService</div>
    </div>
    <span className={`n1-badge ${bad ? 'gone' : 'ok'}`} style={{ left: 128, top: 18 }}>{bad ? t("@Injectable — yo'q", '@Injectable — нет') : '@Injectable()'}</span>
    {!dep && <span className="n1-say" style={{ left: 18, top: 66, color: T.ink2, fontWeight: 500, fontFamily: MONO, fontSize: 11.5 }}>{t("konstruktor yo'q", 'конструктора нет')}</span>}
    {dep && <span className="n1-abs" style={{ left: 18, top: 66, font: `500 11.5px ${MONO}`, color: T.ink2 }}>pricing:</span>}
    {dep && <span className={`n1-sock${bad ? ' er' : ''}`} style={{ left: 82, top: 56, width: 176, height: 32 }}>{bad ? 'undefined' : ''}</span>}
    {dep && <span className={`n1-tok${bad ? ' off' : ''}`} style={{ left: 170, top: 72, width: 168, height: 32, fontSize: 12 }}><i />PricingService</span>}
    <div className="n1-box2 has" style={{ left: 292, top: 8, width: 100, height: 104 }}><span className="bl" style={{ fontSize: 9.5, left: 10 }}>{t('KONTEYNER', 'КОНТЕЙНЕР')}</span></div>
    {dep && bad && <span className="n1-tok" style={{ left: 342, top: 66, width: 88, height: 30, fontSize: 10.5 }}><i />Pricing</span>}
    {dep && bad && <span className="n1-say er" style={{ left: 300, top: 90, fontSize: 10.5 }}>{t('berilmadi', 'не передан')}</span>}
    <Res left={404} top={36} rows={[['GET /cars', res]]} />
  </N1Mini>;
}

// ---------- 3-ekran: Express'da har jamoa papkalarni o'zicha bo'ladi ----------
function TeamsStrip({ st }) {
  const teams = [['routes/', 'controllers/', 'services/'], ['api/', 'handlers/', 'logic/'], ['src/', 'lib/', 'utils/']];
  return <N1Fit w={760} h={128}>
    <span className="n1-tagl" style={{ left: 20, top: 4 }}>{t("Express · har jamoa o'zicha", 'Express · каждая команда по-своему')}</span>
    {teams.map((tm, i) => <div key={i} className="n1-team n1-st" data-st={st} style={{ left: 20 + i * 244, top: 24, width: 232, height: 100 }}>
      <h6>{t(`${i + 1}-jamoa`, `Команда ${i + 1}`)}</h6>{tm.map((f) => <div key={f}><i />{f}</div>)}
    </div>)}
  </N1Fit>;
}

// ---------- 10-ekran: Module — Nest ko'radigan uch ro'yxat; faylda bor, ro'yxatda yo'q — Nest uchun yo'q ----------
function Shelves({ beat }) {
  const sh = (k) => (beat === 1 ? (k === 'imports' ? 'dim' : 'hl') : beat === 2 ? (k === 'imports' ? 'hl' : 'dim') : beat >= 3 ? 'dim' : '');
  const box = (k, x, chips) => <div className={`n1-shelf ${sh(k)}`} style={{ left: x, top: 34, width: 232, height: 62 }}>
    <span className="sl">{k}: [ ]</span>
    {chips.length ? chips.map(([c, col], i) => <span key={c} className="n1-file" style={{ '--c': col, left: 12 + i * 120, top: 16 }}><i />{c}</span>) : <span className="emp">{t("bo'sh — boshqa modul yo'q", 'пусто — других модулей нет')}</span>}
  </div>;
  return <N1Fit w={760} h={beat >= 3 ? 168 : 104}>
    <span className="n1-tagl" style={{ left: 20, top: 4 }}>{t("Nest ko'radigan narsa — faqat shu uch ro'yxat", 'Nest видит только эти три списка')}</span>
    {box('imports', 20, [])}
    {box('controllers', 264, [['AppController', PART.ctrl]])}
    {box('providers', 508, [['AppService', PART.svc]])}
    {beat >= 3 && <>
      <span className="n1-tagl" style={{ left: 20, top: 112 }}>{t("Faylda bor, ro'yxatda yo'q", 'В файле есть, в списке нет')}</span>
      <div className="n1-abs" style={{ left: 20, top: 128, width: 720, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'nowrap' }}>
        <span className="n1-file new" style={{ '--c': PART.ctrl, position: 'static' }}><i />users.controller.ts</span>
        <span className="n1-ghost" style={{ position: 'static' }}>✕ {t("controllers'da yo'q", 'нет в controllers')}</span>
        <span style={{ width: 10 }} />
        <span className="n1-file new" style={{ '--c': PART.svc, position: 'static' }}><i />users.service.ts</span>
        <span className="n1-ghost" style={{ position: 'static' }}>✕ {t("providers'da yo'q", 'нет в providers')}</span>
      </div>
    </>}
  </N1Fit>;
}
function ModTree() {
  const kids = ['CarsModule', 'UsersModule', 'OrdersModule'];
  return <N1Fit w={760} h={196}>
    <span className="n1-tagl" style={{ left: 20, top: 4 }}>{t('Modullar strukturasi', 'Структура модулей')}</span>
    <div className="n1-mod" style={{ left: 200, top: 30, width: 360, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="lg">AppModule</span><span style={{ font: `500 12px ${MONO}` }}>imports: [CarsModule, UsersModule, OrdersModule]</span></div>
    <i className="n1-tree-ln" style={{ left: 379, top: 76, width: 2, height: 22 }} />
    <i className="n1-tree-ln" style={{ left: 135, top: 98, width: 492, height: 2 }} />
    {kids.map((m, i) => <React.Fragment key={m}>
      <i className="n1-tree-ln" style={{ left: 135 + i * 246, top: 98, width: 2, height: 22 }} />
      <div className="n1-mod" style={{ left: 18 + i * 246, top: 120, width: 236, height: 66, animation: `mk-up .4s ${0.15 + i * 0.15}s ease both` }}>
        <span className="lg">{m}</span>
        <span className="n1-file" style={{ '--c': PART.ctrl, left: 10, top: 18, padding: '5px 8px', fontSize: 11 }}><i />controllers</span>
        <span className="n1-file" style={{ '--c': PART.svc, left: 126, top: 18, padding: '5px 8px', fontSize: 11 }}><i />providers</span>
      </div>
    </React.Fragment>)}
  </N1Fit>;
}

// ---------- 32-ekran: o'quvchi loyihasi restoran tilida — har bekatda ikki so'z ----------
// DICT (07-bo'lak) ma'lumoti: [restoran so'zi, atama, vazifa] — RU tarjimasi ham o'sha yerdan
function KitchenMap({ beat, dict }) {
  const by = {}; dict.forEach(([w, a, v]) => { by[a] = { w, a, v }; });
  const ST = [
    { k: 'Guard', x: 120, c: T.purple },
    { k: 'Controller', x: 252, c: PART.ctrl },
    { k: 'Service', x: 384, c: PART.svc },
    { k: 'Repository', x: 516, c: T.ink2 },
    { k: 'Entity', x: 648, c: T.ink2 },
  ];
  const cls = (k) => (beat === 1 ? (k === 'Service' ? ' hl' : ' dim') : beat === 2 ? (k === 'Controller' || k === 'Service' ? ' hl' : ' dim') : '');
  return <N1Fit w={760} h={300}>
    <div className="n1-kit">
      <span className="n1-tagl" style={{ left: 8, top: 0 }}>{t("O'quvchi loyihasi · IntroNestArxitechture · bitta buyurtma", 'Проект ученика · IntroNestArxitechture · один заказ')}</span>
      <div className="n1-mod" style={{ left: 252, top: 26, width: 236, height: 36, opacity: beat === 1 || beat === 2 ? 0.4 : 1, transition: 'opacity .4s' }}>
        <span className="lg">{by.Module.a} · {by.Module.w}</span>
        <span className="n1-abs" style={{ left: 14, top: 12, font: `500 11px ${MONO}`, color: T.ink2 }}>{by.Module.v}: Controller · Service</span>
      </div>
      <div className={`st${beat === 1 || beat === 2 ? ' dim' : ''}`} style={{ '--c': '#C9CED8', left: 8, top: 84, width: 84, height: 120, borderWidth: 1.5 }}>
        <span className="w">{t('mijoz', 'клиент')}</span><span className="a">{t('brauzer', 'браузер')}</span><span className="v">{t("so'rov yuboradi", 'отправляет запрос')}</span>
      </div>
      {ST.map((x, i) => {
        const d = by[x.k];
        return <div key={x.k} className={`st${cls(x.k)}`} style={{ '--c': x.c, left: x.x, top: 84, width: 104, height: 120, animation: `mk-up .4s ${i * 0.1}s ease both` }}>
          <span className="w">{d.w}</span><span className="a">{d.a}</span><span className="v">{d.v}</span>
          {x.k === 'Service' && <span className={`f${beat === 1 ? ' on' : ''}`}>src/api/car/car.service.ts</span>}
        </div>;
      })}
      {[92, 224, 356, 488, 620].map((x) => <i key={x} className="ar" style={{ left: x + 4, top: 143, width: 20 }} />)}
      <span className="n1-abs" style={{ left: 8, top: 216, font: `600 11px ${MONO}`, color: T.ink3 }}>{t("so'rov bilan keladi", 'приходит с запросом')}</span>
      <span className={`n1-lab n1-st`} data-st={beat === 1 || beat === 2 ? 'dim' : ''} style={{ position: 'absolute', left: 8, top: 234 }}>{by.DTO.a} · {by.DTO.w} — {by.DTO.v}</span>
      <span className="n1-abs" style={{ left: 400, top: 216, font: `600 11px ${MONO}`, color: T.ink3 }}>{t('javob shu shaklda qaytadi', 'ответ возвращается в этой форме')}</span>
      <span className={`n1-lab n1-st`} data-st={beat === 1 || beat === 2 ? 'dim' : ''} style={{ position: 'absolute', left: 400, top: 234 }}>{by.successRes.a} · {by.successRes.w} — {by.successRes.v}</span>
      <span className={`no${beat === 2 ? ' on' : ''}`} style={{ left: 236, top: 270 }}>{t("ofitsiant oshxonaga kirmaydi: Controller Service'ni chaqiradi, hisobni o'zi qilmaydi", 'официант не заходит на кухню: Controller вызывает Service, сам не считает')}</span>
    </div>
  </N1Fit>;
}

// ---------- Nest-2 rasmi: o'quvchi loyihasida bitta so'rovning to'liq yo'li (8 bekat) ----------
// Bekat kalitlari Nest-2 SUM2 bilan bir xil: br · pre · guard · pipe · ctrl · svc · repo · db
// hl — yoritiladigan bekatlar (qolgani xira) · stop {k, code} — so'rov shu bekatda to'xtadi · ok {code} — so'rov bazagacha yetdi
// marks [{k, code}] — paketsiz belgilar · resp 'ok'|'err'|'both' — javob shakli · mod 'broken' — forFeature yo'q · lab {k: so'z} · pins {k: raqam}
const RM_X = { br: 8, pre: 101, guard: 194, pipe: 287, ctrl: 380, svc: 473, repo: 566, db: 659 };
const RM_W = 84;
function RepoMachine({ hl = [], stop, ok, marks = [], resp, mod, lab, pins = {}, url = 'GET /api/v1/car', tag, compact, max, extra }) {
  const ST = [
    ['br', t('Brauzer', 'Браузер'), 'Swagger', T.ink2],
    ['pre', '/api/v1', t('prefiks', 'префикс'), T.ink2],
    ['guard', 'Guard', t('token · rol', 'токен · роль'), '#B91C1C'],
    ['pipe', 'DTO', 'Validation', '#C2410C'],
    ['ctrl', 'Controller', 'route', PART.ctrl],
    ['svc', 'Service', 'BaseService', PART.svc],
    ['repo', 'Repository', 'TypeORM', T.purple],
    ['db', 'PostgreSQL', 'cars', T.purple],
  ];
  const bad = mod === 'broken';
  const st = (k) => (bad && k === 'repo' ? 'g' : hl.length ? (hl.includes(k) ? 'hl' : 'dim') : '');
  const SH = lab ? 132 : 74; // bekat balandligi — so'z (lab) bo'lsa baland
  const LY = 70 + SH + 24;    // yo'lak
  const H = compact ? LY + 28 : LY + 84;
  const cx = (k) => RM_X[k] + RM_W / 2;
  const code = (c) => (/^2/.test(String(c)) ? 'ok' : 'er');
  const pk = stop ? { k: stop.k, c: stop.code, ok: false } : ok ? { k: 'db', c: ok.code, ok: true } : null;
  const right = pk && (pk.k === 'db' || pk.k === 'repo'); // o'ng chetda — yozuv chapga suriladi, kesilmaydi
  return <N1Fit w={760} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 8, top: 0 }}>{tag}</span>}
    <div className={`n1-mod n1-st`} data-st={hl.length && !hl.includes('mod') && !bad ? 'dim' : hl.includes('mod') ? 'hl' : ''} style={{ left: RM_X.ctrl - 6, top: 26, width: RM_X.repo + RM_W - RM_X.ctrl + 12, height: 30, borderColor: bad ? '#DC2626' : undefined, background: bad ? '#FEF2F2' : undefined }}>
      <span className="lg" style={{ color: bad ? '#DC2626' : undefined }}>CarModule</span>
      <span className="n1-abs" style={{ right: 10, top: 8, font: `500 11px ${MONO}`, color: bad ? '#DC2626' : T.ink2, whiteSpace: 'nowrap' }}>{bad ? 'imports: [ ]' : 'imports: forFeature([CarEntity])'}</span>
      {lab && lab.mod && <span className="lab"><span className="n1-lab">{lab.mod}</span></span>}
    </div>
    {ST.map(([k, n, s, c]) => <div key={k} className="n1-part n1-st" data-st={st(k)} style={{ '--c': c, left: RM_X[k], top: 70, width: RM_W, height: SH, padding: '9px 8px', borderWidth: k === 'br' || k === 'pre' ? 1.5 : 2 }}>
      <div className="nm" style={{ fontSize: 11.5 }}>{n}</div>
      <div className="role" style={{ fontSize: 10, fontFamily: MONO, marginTop: 4, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{s}</div>
      {lab && lab[k] && <div style={{ marginTop: 6, font: `700 11px/1.25 ${SANS}`, color: T.ink }}>{lab[k]}</div>}
    </div>)}
    {Object.keys(pins).map((k) => <span key={k} className="n1-pin on" style={{ left: k === 'mod' ? RM_X.ctrl + 64 : RM_X[k] + RM_W - 12, top: k === 'mod' ? 16 : 62 }}>{pins[k]}</span>)}
    {[...Array(7)].map((_, i) => <i key={i} className={`n1-arr${bad && i === 5 ? ' bad' : ''}`} style={{ left: RM_X[ST[i][0]] + RM_W + 1, top: 70 + SH / 2, width: 7, height: 2 }} />)}
    <i className="n1-ln" style={{ left: cx('br'), width: cx('db') - cx('br'), top: LY }} />
    {ST.map(([k]) => <i key={k} className="n1-stn" style={{ left: cx(k), top: LY + 1 }} />)}
    {pk && <span className={`n1-pk${pk.ok ? ' grn' : ''}`} style={{ left: Math.max(cx(pk.k), 60), top: LY + 1, transform: right ? 'translate(-88%,-50%)' : undefined }}>{url}</span>}
    {pk && <span className={`n1-res2`} style={{ left: Math.min(cx(pk.k) - 26, 700), top: LY + 16 }}><div><b className={pk.ok ? 'n1-ok' : 'n1-er'}>{pk.c}</b></div></span>}
    {marks.map((m) => <span key={m.k + m.code} className="n1-res2" style={{ left: cx(m.k) - 22, top: LY - 12 }}><div><b className={code(m.code) === 'ok' ? 'n1-ok' : 'n1-er'}>{m.code}</b></div></span>)}
    {!compact && <>
      <div className={`n1-chip`} style={{ left: 8, top: LY + 48, opacity: resp === 'ok' || resp === 'both' ? 1 : 0.35, borderColor: '#BFE3D2', fontSize: 11.5 }}><b style={{ color: T.green }}>successRes</b> {'{ statusCode, message, data }'}</div>
      <div className={`n1-chip`} style={{ left: 330, top: LY + 48, opacity: resp === 'err' || resp === 'both' ? 1 : 0.35, borderColor: '#F2A9A9', fontSize: 11.5 }}><b style={{ color: '#B91C1C' }}>AllExceptionFilter</b> {'{ statusCode, error: { message } }'}</div>
    </>}
    {extra}
  </N1Fit>;
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
//  NEST-1 SOZLAMASI (31.10: dvigateldan ko'chirildi — dvigatel umumiy, darsga xos qiymat shu yerda)
// ============================================================
const LESSON_ID = 'mentor-nest-01-arxitektura-v1';
const APP_FILES = ['src/main.ts', 'src/app.module.ts', 'src/app.controller.ts', 'src/app.service.ts'];
const CARS_FILES = ['src/cars/cars.module.ts', 'src/cars/cars.controller.ts', 'src/cars/cars.service.ts'];
const ALL_FILES = [...APP_FILES, ...CARS_FILES];
MKCFG.root = 'cars-api';
MKCFG.files = ALL_FILES;

// ============================================================
//  1–2-BOSQICH · S1–S5b
//  Ovoz qoidasi: kod o'qilmaydi, nima bo'layotgani aytiladi; «/» va «@» so'z bilan.
// ============================================================
const S1 = {
  kicker: 'Kirish', eyebrow: 'Mentor kursi · NestJS', title: "Siz Express'ni bilasiz. Endi Nest.",
  plan: ['Nega Nest', "Uch bo'lak: Controller · Service · Module", 'Dependency Injection', "cars route'larini quramiz", "Buzamiz va xatoni o'qiymiz", "Amaliyot va AI yozgan kod", "O'quvchi darsini o'tish"],
  segments: [
    { id: 'a', key: "Express bilimingiz ustiga <b>Nest</b> qo'yamiz: u Express'ni bekor qilmaydi, tartib beradi", text: "Assalomu alaykum. Siz Express'ni videodarslarda ko'rgansiz: route qanday ochilishini, so'rov qanday qabul qilinishini va javob qanday qaytishini bilasiz. Bugun shu bilim ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi.", hl: [] },
    { id: 'b', key: "Dars oxirida bo'sh papkadan <b>ishlaydigan server</b> qurib bo'lasiz", text: "Dars oxirida siz bo'sh papkadan boshlab mashinalar ro'yxatini qaytaradigan server qurasiz.", hl: [3] },
    { id: 'c', key: "Nest xato xabarini <b>o'qiy olasiz</b>: qaysi klass, qaysi dependency yetishmayapti, qaysi fayl", text: "Nest'ning xato xabarlarini o'qiy olasiz: qaysi klassda xato, qaysi dependency yetishmayapti va qaysi faylni ochish kerak.", hl: [4] },
    { id: 'd', key: "O'quvchi darsidagi <b>har so'z</b> nimani anglatishini bilib olasiz", text: "Va o'quvchi darsida qaysi so'z nimani anglatishini bilasiz.", hl: [6] },
    { id: 'e', key: "Yetti bosqich. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi", text: "Dars yetti bosqichdan iborat. Shoshilmang: har ekranda ovozni o'chirish, ekranni boshidan eshitish va to'liq matnini o'qish mumkin. Ustoz gapirib bo'lgach, Davom tugmasi ochiladi. Bosing, boshlaymiz.", hl: [] },
  ],
};
// F-1120-02: sahna — darsning rasmi (Nest mashinasi) + yetti bosqich. Har gapda rasmning o'sha qismi o'zgaradi:
// a Express ustida Nest · b ishlaydigan server (GET /cars) · c xato o'qiladi (?) · d o'quvchi darsi so'zlari · e reja
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => <Scene1 seg={seg} beat={beat} />} />;
}
function Scene1({ seg, beat }) {
  const out = beat === 1 ? '[{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]' : null;
  const err = beat === 2;
  const st = beat === 1 ? { br: 'hl' } : beat === 2 ? { ctrl: 'hl' } : beat === 3 ? { ctrl: 'hl', svc: 'hl', mod: 'hl' } : {};
  return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 14 }}>
    <NestMachine cfg={N1_CARS} url="localhost:3000/cars" out={out} outKind="code" st={st} exp={beat === 0 ? 'hl' : ''} links={beat >= 3}
      sock={err ? { ctrl: { t: '(?)', er: true } } : null}
      lab={beat >= 3 ? { ctrl: t('ofitsiant', 'официант'), svc: t('oshpaz', 'повар'), mod: t('shtat jadvali', 'штатное расписание') } : null}
      readRow read={err ? ['terminal', "ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class=\"n1-er\">CarsController (?)</span>."] : beat === 1 ? ['terminal', '<span class="n1-c">GET /cars</span> → <span class="n1-ok">200</span>'] : null}
      tag={t("Bugungi darsning rasmi — dars davomida shu rasmga qaytamiz", 'Картина сегодняшнего урока — к ней мы будем возвращаться')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>;
}

// --- S2 Express: 20 qator → o'sgan loyiha (misol) ---
const EXPRESS_LINES = [
  { h: `<span class="k">const</span> express = <span class="c">require</span>(<span class="s">'express'</span>);` },
  { h: `<span class="k">const</span> app = <span class="c">express</span>();` },
  { h: `app.<span class="c">use</span>(express.<span class="c">json</span>());` },
  { h: `<span class="k">let</span> cars = [{ id: <span class="d">1</span>, brand: <span class="s">'Chevrolet'</span>, model: <span class="s">'Malibu'</span> }];` },
  { h: `` },
  { id: 'route1', h: `app.<span class="c">get</span>(<span class="s">'/cars'</span>, (req, res) => {` },
  { id: 'route1', h: `  res.<span class="c">json</span>(cars);` },
  { id: 'route1', h: `});` },
  { id: 'route2', h: `app.<span class="c">get</span>(<span class="s">'/cars/:id'</span>, (req, res) => {` },
  { id: 'route2', h: `  <span class="k">const</span> car = cars.<span class="c">find</span>(c => c.id === <span class="c">Number</span>(req.params.id));` },
  { id: 'route2', h: `  <span class="k">if</span> (!car) <span class="k">return</span> res.<span class="c">status</span>(<span class="d">404</span>).<span class="c">json</span>({ message: <span class="s">'topilmadi'</span> });` },
  { id: 'route2', h: `  res.<span class="c">json</span>(car);` },
  { id: 'route2', h: `});` },
  { id: 'route3', h: `app.<span class="c">post</span>(<span class="s">'/cars'</span>, (req, res) => {` },
  { id: 'route3', h: `  <span class="k">const</span> car = { id: cars.length + <span class="d">1</span>, ...req.body };` },
  { id: 'route3', h: `  cars.<span class="c">push</span>(car);` },
  { id: 'route3', h: `  res.<span class="c">status</span>(<span class="d">201</span>).<span class="c">json</span>(car);` },
  { id: 'route3', h: `});` },
  { h: `` },
  { h: `app.<span class="c">listen</span>(<span class="d">3000</span>);` },
];
const GROWN_LINES = [
  { n: 212, h: `app.<span class="c">post</span>(<span class="s">'/auth/register'</span>, <span class="k">async</span> (req, res) => {` },
  { n: 213, h: `  <span class="k">const</span> hash = <span class="k">await</span> bcrypt.<span class="c">hash</span>(req.body.password, <span class="d">10</span>);` },
  { n: 214, h: `  <span class="cm">// ... 40 qator tekshiruv</span>` },
  { n: 588, h: `app.<span class="c">post</span>(<span class="s">'/orders'</span>, upload.<span class="c">single</span>(<span class="s">'file'</span>), <span class="k">async</span> (req, res) => {` },
  { n: 589, h: `  <span class="cm">// ... to'lov, email, baza — hammasi shu yerda</span>` },
  { n: 990, id: 'login', h: `<span class="cm">// login qayerda??? 1000 qator pastda...</span>` },
  { n: 1187, h: `app.<span class="c">post</span>(<span class="s">'/auth/login'</span>, <span class="k">async</span> (req, res) => {` },
  { n: 1240, h: `app.<span class="c">listen</span>(<span class="d">3000</span>);` },
];
const S2 = {
  kicker: '1-bosqich · Nega Nest', title: "Express: tanish manzara va og'riq",
  segments: [
    { id: 'a', key: "Tanish manzara: butun Express server bitta <code>server.js</code> faylida", text: "Avval tanish narsadan boshlaymiz, Express'dan. Videodarslarda ko'rganingizdek, butun server bitta server js faylida.", focus: [] },
    { id: 'b', key: "<code>GET /cars</code> kelsa, mashinalar <b>ro'yxatini</b> qaytaramiz", text: "cars route'iga GET kelsa, ro'yxatni qaytaramiz.", show: "<code>/cars</code> route'iga GET kelsa, ro'yxatni qaytaramiz.", focus: ['route1'] },
    { id: 'c', key: "<code>GET /cars/:id</code> kelsa, <b>bitta mashinani</b> qidiramiz, topilmasa 404", text: "cars path'idan keyin id kelsa, bittasini qidiramiz, topilmasa to'rt yuz to'rt.", show: "<code>/cars/:id</code> kelsa, bittasini qidiramiz, topilmasa 404.", focus: ['route2'] },
    { id: 'd', key: "<code>POST /cars</code> yangisini qo'shadi. Hammasi <b>20 qator</b> — muammo yo'q", text: "POST kelsa, yangisini qo'shamiz. Hammasi yigirma qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", show: "<code>POST /cars</code> kelsa, yangisini qo'shamiz. Hammasi 20 qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", focus: ['route3'] },
    { id: 'e', key: "Loyiha o'sib <b>1240 qatorga</b> yetdi (shartli misol) — login qayerdaligini qidirasiz", text: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar qo'shildi, kirish va ro'yxatdan o'tish qo'shildi, buyurtmalar, to'lov, fayl yuklash. Mana shartli misol, haqiqiy loyiha emas: fayl ming ikki yuz qirq qator deylik. Login qayerda edi? Qidirasiz.", show: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar, kirish, buyurtmalar, to'lov, fayl yuklash. Mana <b>shartli misol</b> (haqiqiy loyiha emas): fayl <b>1240 qator</b>. Login qayerda edi? Qidirasiz.", focus: ['login'], grow: true },
    { id: 'f', key: "Xulosa: bitta route'da hamma ish — sinab bo'lmaydi, ikki kishi to'qnashadi. <b>Nest shu og'riq uchun</b>", text: "Xulosa: bitta route ichida ham so'rovni o'qish, ham tekshirish, ham bazaga yozish bor. Shu bo'lakni alohida sinab bo'lmaydi, chunki u route'dan ajralmagan. Ikki kishi bir faylda ishlasa, biri ikkinchisining o'zgarishini buzib qo'yadi. Videodarslardagi kichik loyihada bu sezilmaydi, haqiqiy jamoada esa har kuni bo'ladi. Nest aynan shu og'riq uchun yaratilgan. O'quvchi darsi ham aynan shu misoldan boshlanadi.", focus: [], grow: true },
  ],
};
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => {
    const grown = !!seg.grow;
    const lines = grown ? [...EXPRESS_LINES.slice(0, 6).map((l) => ({ ...l, id: null })), { n: '…', h: t('<span class="cm">// … 200 qator</span>', '<span class="cm">// … 200 строк</span>') }, ...GROWN_LINES] : EXPRESS_LINES;
    return <Ide root="express-api" files={['server.js']} active="server.js"><CodePanel key={grown ? 'g' : 'n'} file={grown ? t('server.js · 1240 qator (shartli misol, haqiqiy loyiha emas)', 'server.js · 1240 строк (условный пример, не реальный проект)') : t('server.js · 20 qator', 'server.js · 20 строк')} lines={lines} focus={seg.focus} /></Ide>;
  }} />;
}

// --- S3 Nest nima beradi ---
const S3 = {
  kicker: '1-bosqich · Nega Nest', title: 'Nest nima beradi: majburiy tartib',
  segments: [
    { id: 'a', key: "Express'da har jamoa papkalarni <b>o'zicha</b> bo'ladi — yangi odam qaytadan o'rganadi", text: "Xo'sh, og'riqni ko'rdik: hamma narsa bitta faylda. Tajribali Express dasturchi bunga nima qiladi? Faylni bo'ladi: routes papkasi, controllers papkasi, services papkasi. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi.", show: "Xo'sh, og'riqni ko'rdik: hamma narsa bitta faylda. Tajribali Express dasturchi bunga nima qiladi? Faylni bo'ladi: <code>routes/</code>, <code>controllers/</code>, <code>services/</code>. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi." },
    { id: 'b', key: "Nest tartibni <b>majburiy</b> qiladi: uch bo'lak — Controller, Service, Module", text: "Nest shu tartibni majburiy va bir xil qiladi. U uchta bo'lakka nom beradi: Controller, Service, Module." },
    { id: 'c', key: "Har Nest loyihasida bo'laklar bir joyda, bir nomda — <b>Toshkentda yozilganini Berlin bir daqiqada tushunadi</b>", text: "Har Nest loyihasida ular bir xil joyda, bir xil nomda turadi. Shuning uchun Toshkentdagi jamoa yozgan loyihani Berlindagi dasturchi ochsa, qayerda nima turganini bir daqiqada topadi." },
    { id: 'd', key: "Xulosa: Nest ichida <b>o'sha Express</b> ishlaydi — bilganingiz bekor bo'lmaydi, ustiga tartib qo'shiladi", text: "Xulosa va muhim fakt: Nest ichida o'sha Express ishlaydi. So'rovni haqiqatda Express qabul qiladi, Nest esa uni to'g'ri bo'lakka yo'naltiradi. Demak siz bilgan hech narsa bekor bo'lmaydi." },
  ],
};
// F-1120-02: sahna — a Express: har jamoa o'zicha · b Nest: uch bo'lak (mashina) · c har loyihada bir xil joy va nom · d ichida Express
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ beat }) => <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 10 }}>
    <TeamsStrip st={beat >= 1 ? 'dim' : ''} />
    <div style={{ opacity: beat >= 1 ? 1 : 0.12, transition: 'opacity .5s' }}>
      <NestMachine cfg={N1_CARS} st={beat === 1 ? { ctrl: 'hl', svc: 'hl', mod: 'hl' } : {}} exp={beat >= 3 ? 'hl' : ''} links={beat >= 1}
        readRow read={beat === 2 ? [t('har Nest loyihasida', 'в каждом проекте Nest'), 'src/cars/cars.controller.ts · cars.service.ts · cars.module.ts'] : null}
        tag={t('NestJS · tartib va nomlar — hamma loyihada bir xil', 'NestJS · порядок и имена — одинаковы в любом проекте')} />
    </div>
  </div>} />;
}

// --- S4 TypeScript va decorator ---
const DECO_LINES = [
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="cm">/* … */</span> }` },
  { h: `}` },
];
// F-1125-01 (2-ish): tip va class misoli — chiqish haqiqiy (TypeScript 6.0.3, nest build):
// src/misol.ts:2:1 - error TS2322: Type 'string' is not assignable to type 'number'.
const TS_LINES = [
  { id: 'ts-let', h: `<span class="k">let</span> price: <span class="k">number</span> = <span class="d">250</span>;` },
  { id: 'ts-bad', h: `price = <span class="s">'qimmat'</span>;` },
  { h: `` },
  { id: 'ts-class', h: `<span class="k">class</span> <span class="c">Car</span> {` },
  { id: 'ts-class', h: `  brand: <span class="k">string</span>;` },
  { id: 'ts-class', h: `  price: <span class="k">number</span>;` },
  { id: 'ts-ctor', h: `  <span class="k">constructor</span>(brand: <span class="k">string</span>, price: <span class="k">number</span>) {` },
  { id: 'ts-ctor', h: `    <span class="k">this</span>.brand = brand;` },
  { id: 'ts-ctor', h: `    <span class="k">this</span>.price = price;` },
  { id: 'ts-ctor', h: `  }` },
  { h: `}` },
  { id: 'ts-new', h: `<span class="k">const</span> k5 = <span class="k">new</span> <span class="c">Car</span>(<span class="s">'Kia'</span>, <span class="d">320</span>);` },
];
const TS_ERR = [
  { h: `src/misol.ts:2:1 - <span class="er">error TS2322: Type 'string' is not assignable to type 'number'.</span>` },
];
const S4 = {
  kicker: '1-bosqich · Nega Nest', title: 'TypeScript: tip, class va decorator',
  segments: [
    { id: 'a', key: "TypeScript — <b>tiplari bor</b> JavaScript: JavaScript bilsangiz, o'qiy olasiz", text: "Nest kodini ochishdan oldin bitta yangi narsani bilib olaylik, aks holda kod sizga begona ko'rinadi. Nest loyihalari TypeScript'da yoziladi. TypeScript bu JavaScript'ning o'zi, faqat tiplari bor: string, number va shunga o'xshash. Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz. Avval ikki narsani ko'rib olamiz: tip va class.", focus: [] },
    { id: 'tip', key: "Tip: <code>price: number</code> — bu o'zgaruvchiga <b>faqat son</b> yoziladi, matn bersangiz dastur ishga tushmasdan xato", text: "Birinchisi, tip. price ikki nuqta number: bu o'zgaruvchiga faqat son yoziladi. Ikkinchi satrda unga matn berdik. JavaScript buni indamay qabul qilardi, TypeScript esa dastur ishga tushmasdan xato beradi: VS Code satr tagiga qizil chiziq tortadi, ishga tushirmoqchi bo'lsangiz, terminalda tip mos emasligi haqida xato chiqadi. Xato foydalanuvchiga yetmasdan, kod yozilayotganda ushlanadi.", show: "Birinchisi, <b>tip</b>. <code>price: number</code>: bu o'zgaruvchiga faqat son yoziladi. Ikkinchi satrda unga matn berdik. JavaScript buni indamay qabul qilardi, TypeScript esa dastur ishga tushmasdan xato beradi: VS Code satr tagiga qizil chiziq tortadi, terminalda <code>Type 'string' is not assignable to type 'number'</code>. Xato foydalanuvchiga yetmasdan, kod yozilayotganda ushlanadi.", focus: ['ts-let', 'ts-bad'] },
    { id: 'cls', key: "<b>class</b> — bir xil obyektlar qolipi: <code>new Car('Kia', 320)</code> qolipdan bitta mashina yasaydi", text: "Ikkinchisi, class. Class bir xil obyektlar uchun qolip. Car klassida brand va price maydonlari bor, constructor esa yangi mashina yasalayotganda shu maydonlarni to'ldiradi. new Car, qavsda Kia va uch yuz yigirma: qolipdan bitta mashina yasaladi. Nest'da Controller ham, Service ham shunday klass. Faqat ularni new bilan siz emas, Nest o'zi yaratadi; qanday qilishini uchinchi bosqichda ko'ramiz.", show: "Ikkinchisi, <b>class</b>. Class bir xil obyektlar uchun qolip. <code>Car</code> klassida <code>brand</code> va <code>price</code> maydonlari bor, <code>constructor</code> esa yangi mashina yasalayotganda shu maydonlarni to'ldiradi. <code>new Car('Kia', 320)</code>: qolipdan bitta mashina yasaladi. Nest'da Controller ham, Service ham shunday klass. Faqat ularni <code>new</code> bilan siz emas, Nest o'zi yaratadi; qanday qilishini 3-bosqichda ko'ramiz.", focus: ['ts-class', 'ts-ctor', 'ts-new'] },
    { id: 'b', key: "Yangi narsa: <b>@</b> (kuchukcha) bilan boshlanadigan satr — <b>decorator</b>", text: "Va uchinchi yangi narsa, u bilan eng ko'p uchrashasiz: kuchukcha belgisi bilan boshlanadigan satrlar. Masalan, Controller decorator'i, qavsda cars. Bu decorator deyiladi.", show: "Va uchinchi yangi narsa, u bilan eng ko'p uchrashasiz: <b>@</b> (kuchukcha) belgisi bilan boshlanadigan satrlar. Masalan, <code>@Controller('cars')</code>. Bu <b>decorator</b> deyiladi.", focus: ['l-ctrl'] },
    { id: 'c', key: "Decorator Nest'ga aytadi: <b>bu klass Controller</b>, bu metod GET'ni qabul qiladi", text: "Decorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: bu klass Controller, uning path'i cars. Get decorator'i esa metod ustida turadi: GET so'rov kelsa, shu metod.", show: "Decorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: «bu klass Controller, uning path'i cars». <code>@Get</code> esa metod ustida turadi: «GET so'rov kelsa, shu metod».", focus: ['l-get'] },
    { id: 'd', key: "Xulosa: decorator kod bajarmaydi, belgi qo'yadi — <b>belgi yo'q bo'lsa, Nest klassni tanimaydi</b>", text: "Xulosa: decorator kodni bajarmaydi, u belgi qo'yadi. Nest ishga tushganda shu belgilarni o'qib, hamma bo'lakni joyiga qo'yadi. Shuni eslab qoling: decorator yo'q bo'lsa, Nest o'sha klassni tanimaydi. Beshinchi bosqichda buni ataylab buzib, xatosini ham ko'ramiz.", focus: [] },
  ],
};
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => (<>
    {/* UX-7: JS/TS solishtiruvi oynaning ichida, editor ustida — alohida «suzib» turmaydi */}
    <Ide files={beat === 1 || beat === 2 ? ['src/misol.ts'] : ['src/cars/cars.controller.ts']} active={beat === 1 || beat === 2 ? 'src/misol.ts' : 'src/cars/cars.controller.ts'}>
      {!(beat === 1 || beat === 2) && <Block at={0} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <span className="mk-card" style={{ fontSize: 13.5 }}><b>JavaScript</b> → <code>let price = 250</code></span>
        <span className="mk-card" style={{ fontSize: 13.5 }}><b>TypeScript</b> → <code>let price: number = 250</code></span>
      </div></Block>}
      {beat === 1 || beat === 2
        ? <><CodePanel file={t("src/misol.ts · faqat misol, loyihada yo'q", 'src/misol.ts · только пример, в проекте нет')} lines={TS_LINES} focus={seg.focus} style={{ fontSize: 15 }} />
          {beat === 1 && <CodePanel file={t('terminal — xato', 'terminal — ошибка')} numbers={false} wrap style={{ background: '#1F1115' }} lines={TS_ERR} />}</>
        : <CodePanel file="src/cars/cars.controller.ts" lines={DECO_LINES} focus={seg.focus} style={{ fontSize: 15 }} />}
    </Ide>
    <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>Decorator</b> — klass yoki metod ustidagi <b>@</b> (kuchukcha) belgili satr. Kod bajarmaydi, Nest'ga «bu nima» deb aytadi. Belgi yo'q — Nest klassni tanimaydi.</>, <><b>Decorator</b> — строка со знаком <b>@</b> («собачка») над классом или методом. Код не выполняет, говорит Nest, «что это». Нет метки — Nest не узнаёт класс.</>)}</div></Block>
  </>)} />;
}

// --- S5a Fayllar: VS Code Explorer (katta ko'rinish, vazifa izohi bilan) ---
const FILES5 = ['src/main.ts', 'src/app.module.ts', 'src/app.controller.ts', 'src/app.service.ts', 'src/app.controller.spec.ts', 'test/app.e2e-spec.ts', 'package.json', 'tsconfig.json'];
const FILES5_DESC = { 'src/main.ts': 'ilovani ishga tushiradi', 'src/app.module.ts': "ro'yxat", 'src/app.controller.ts': "so'rovni qabul qiladi", 'src/app.service.ts': 'ishni bajaradi', 'src/app.controller.spec.ts': 'avtomatik test — bugun tegmaymiz', 'test/app.e2e-spec.ts': 'avtomatik test — bugun tegmaymiz', 'package.json': "paketlar va npm buyruqlari (start:dev)", 'tsconfig.json': 'TypeScript sozlamasi' };
const S5a = {
  kicker: "2-bosqich · Uch bo'lak", title: 'Tirik loyiha: nest new nimani yaratdi',
  segments: [
    { id: 'a', key: "<code>nest new cars-api</code> yaratgan loyiha: <b>src</b> ichida to'rtta asosiy fayl", text: "Endi tayyorsiz: decorator'ni bilasiz, uch bo'lakning nomini bilasiz. Haqiqiy loyihaga qaraymiz. nest new cars-api buyrug'i mana shu papka va fayllarni yaratdi, xuddi VS Code'ning chap panelida ko'rganingizdek. Bizga kerakli hamma narsa src papkasida: to'rtta asosiy fayl.", hl: null },
    { id: 'b', key: "<b>main.ts</b> ilovani ishga tushiradi — boshqa hech narsa qilmaydi", text: "main ts: ilovani ishga tushiradi, boshqa hech narsa qilmaydi.", hl: 'src/main.ts' },
    { id: 'c', key: "<b>app.module.ts</b> — ro'yxat: Nest shunga qarab hamma narsani yig'adi", text: "app module ts: ro'yxat. Nest shu ro'yxatga qarab hamma narsani yig'adi.", hl: 'src/app.module.ts' },
    { id: 'd', key: "<b>app.controller.ts</b> so'rovni qabul qiladi va javobni qaytaradi", text: "app controller ts: so'rovni qabul qiladi va javobni qaytaradi.", hl: 'src/app.controller.ts' },
    { id: 'e', key: "<b>app.service.ts</b> ishni bajaradi; <b>spec</b> fayllar — avtomatik test, bugun tegmaymiz", text: "app service ts: ishni bajaradi. spec bilan tugaydigan fayllar avtomatik testlar, ularni Jest ishga tushiradi. Bugun ularga tegmaymiz. package json'da npm buyruqlari turadi, start dev ham shu yerda.", hl: 'src/app.service.ts' },
    { id: 'f', key: "Xulosa: uch bo'lak, uch rang — <b>ko'k Controller · yashil Service · sariq Module</b>", text: "Xulosa: loyihada uch turdagi bo'lak bor, har biri o'z faylida. Uchta rangni eslab qoling: ko'k Controller, yashil Service, sariq Module. Dars davomida har kod yonida shu Explorer turadi va qaysi faylda ekaningizni ko'rsatib boradi. Keyingi ekranda siz ham shu loyihani o'zingizda yaratib qo'yasiz.", hl: null },
  ],
};
function Screen5a(p) {
  return <Lesson p={p} S={S5a} scene={({ seg }) => <FileTree big files={FILES5} active={seg.hl} desc={FILES5_DESC} />} />;
}

// --- S5b So'rov yo'li ---
const S5b = {
  kicker: "2-bosqich · Uch bo'lak", title: "Bitta so'rovning yo'li",
  segments: [
    { id: 'a', key: "Brauzer <code>localhost:3000</code> manziliga <b>GET so'rov</b> yubordi", text: "Loyihangiz fonda o'rnatilayotganda, fayllar bir-biri bilan qanday ishlashini ko'raylik. Buning eng yaxshi yo'li, bitta so'rovning yo'lini kuzatish. Brauzer localhost uch ming manziliga GET so'rov yubordi.", dot: 'browser', boxes: ['browser'], file: null },
    { id: 'b', key: "So'rovni <b>AppController</b> qabul qildi — unda GET uchun metod bor", text: "So'rovni AppController qabul qildi, chunki unda GET uchun metod bor. U app controller ts faylida yashaydi, nomi qutining pastida.", dot: 'ctrl', boxes: ['browser', 'ctrl'], box: 'ctrl', file: 'src/app.controller.ts' },
    { id: 'c', key: "Controller javobni o'zi o'ylamaydi — <b>AppService'dan so'raydi</b>", text: "Controller o'zi javob o'ylab topmaydi, u AppService'dan so'raydi. Service Hello World matnini qaytaradi.", dot: 'svc', boxes: ['browser', 'ctrl', 'svc'], box: 'svc', file: 'src/app.service.ts' },
    { id: 'd', key: "Controller Service bergan matnni <b>brauzerga qaytardi</b>", text: "Controller shu matnni brauzerga yuboradi. Brauzerda Hello World chiqadi.", dot: 'browser', boxes: ['browser', 'ctrl', 'svc'], box: 'ctrl', reply: true, file: 'src/app.controller.ts' },
    { id: 'e', key: "<b>AppModule</b> ikkalasini ro'yxatda ushlaydi — Nest shunga qarab yig'adi", text: "AppModule esa bu ikkalasini bitta ro'yxatda ushlab turadi, Nest shu ro'yxatga qarab ularni yig'adi.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'], box: 'mod', file: 'src/app.module.ts' },
    { id: 'f', key: "Xulosa: yo'l doim shu — <b>so'rov → Controller → Service → javob</b>", text: "Xulosa: har so'rov bir xil yo'l bosadi. So'rov, Controller, Service, javob. Module esa bu bo'laklarni ro'yxatda ushlaydi. Bu yo'lni dars davomida ko'p marta ko'rasiz. Keyingi uch ekranda har faylni ochib, satrma-satr o'qiymiz.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'], file: null },
  ],
};
// F-1120-02: sahna — Nest mashinasi (02b-mashina.jsx). So'rov qizil yo'lakda boradi, javob yashil yo'lakda qaytadi;
// pastki qora satrda shu paytda bajarilayotgan satr (fayl:satr — CTRL_LINES, SVC_LINES, MOD_LINES bilan bir xil raqam)
function Screen5b(p) {
  return <Lesson p={p} S={S5b} scene={({ beat }) => <Scene5b beat={beat} />} />;
}
function Scene5b({ beat }) {
  const late = useLate(beat, 950);
  const st = [
    { br: 'hl', ctrl: 'g', svc: 'g', mod: 'g' },
    { br: '', ctrl: 'hl', svc: 'g', mod: 'g' },
    { br: '', ctrl: '', svc: 'hl', mod: 'g' },
    { br: 'hl', ctrl: '', svc: '', mod: 'g' },
    { br: '', ctrl: '', svc: '', mod: 'hl' },
    {},
  ][Math.min(beat, 5)];
  const back = beat === 2 && late;
  const pkt = beat >= 5 ? { loop: true, label: t("so'rov", 'запрос') }
    : beat === 4 ? { off: true, x: 'b', lane: 2, label: '' }
    : beat === 3 ? { x: 'b', lane: 2, grn: true, label: "'Hello World!'" }
    : back ? { x: 's', lane: 2, grn: true, label: "'Hello World!'" }
    : { x: ['b', 'c', 's'][beat], lane: 1, label: 'GET /' };
  const fill = [[0, 0], [243, 0], [501, 0], [501, 501], [501, 501], [501, 501]][Math.min(beat, 5)];
  const read = [
    [t('brauzer', 'браузер'), 'GET http://localhost:3000/'],
    ['src/app.controller.ts:8', '<span class="n1-d">@Get</span>()'],
    ['src/app.service.ts:6', "<span class=\"n1-k\">return</span> <span class=\"n1-s\">'Hello World!'</span>;"],
    ['src/app.controller.ts:10', '<span class="n1-k">return this</span>.appService.getHello();'],
    ['src/app.module.ts:7–8', 'controllers: [<span class="n1-c">AppController</span>],  providers: [<span class="n1-c">AppService</span>],'],
    [t('natija', 'результат'), 'GET /  →  <span class="n1-ok">200</span>  Hello World!'],
  ][Math.min(beat, 5)];
  const out = beat >= 4 || (beat === 3 && late) ? 'Hello World!' : null;
  return <div className="mk-light" style={{ padding: 16 }}>
    <NestMachine cfg={N1_APP} st={st} out={out} links={beat >= 4} modHot={beat === 4} lanes pkt={pkt} fill={fill} readRow read={read}
      tag={t("So'rov yo'li — brauzerdan fayllarga va qaytib", 'Путь запроса — из браузера к файлам и обратно')} />
  </div>;
}

// --- Amaliyot 1/4: Nest'ni o'rnating, nest new ni boshlab qo'ying (o'rnatilguncha dars davom etadi) ---
// F-1125-01 (M54): versiya buyruqning o'zida qotirilgan (@12), nest new savollarsiz (bayroqlar bilan) —
// dars chiqishlari Nest 12 da shu buyruqlar bilan tekshirilgan: feedback/F-1125-01-nest1-kuchaytirish/nest12/FARQLAR.md
const P0 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa (o'rnatish fonda)", title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 5,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: Nest'ni o'rnatib, loyihani yaratishni boshlab qo'yasiz", text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz va darsda kerak bo'ladigan dasturlarni tayyorlab qo'yasiz: to'rtta qadam. O'rnatish bir-uch daqiqa oladi, kutmaysiz, Davom bosib darsni davom ettirasiz, loyiha fonda o'rnatiladi.", hl: [] },
    { id: 'b', key: "1-qadam: Node versiyasi <b>22 yoki undan yuqori</b> bo'lishi shart", text: "Birinchi: node versiyasini tekshiring. Yigirma ikki yoki undan yuqori bo'lishi kerak. Past bo'lsa, jadvaldagi yo'l bilan yangilang.", hl: [0] },
    { id: 'c', key: "2-qadam: <b>Nest CLI 12</b>'ni o'rnating, versiyasini isbot maydoniga yozing", text: "Ikkinchi: Nest CLI'ni global o'rnating. Buyruq oxirida kuchukcha belgisi va o'n ikki turibdi: bu darsdagi hamma kod va terminal satrlari Nest'ning o'n ikkinchi versiyasida tekshirilgan, shuning uchun aynan shu versiyani o'rnatamiz. Keyin versiyani tekshiring va chiqqan raqamni pastdagi isbot maydoniga yozing.", show: "Ikkinchi: Nest CLI'ni global o'rnating. Buyruq oxirida <code>@12</code> turibdi: bu darsdagi hamma kod va terminal satrlari Nest'ning 12-versiyasida tekshirilgan, shuning uchun aynan shu versiyani o'rnatamiz. Keyin versiyani tekshiring va chiqqan raqamni pastdagi isbot maydoniga yozing.", hl: [1] },
    { id: 'd', key: "3-qadam: <code>nest new</code> buyrug'ini <b>to'liq nusxalang</b> — o'rnatish fonda, kutmasdan davom eting", text: "Uchinchi: loyihani yarating. Buyruqni qo'lda yozmang, to'liq nusxalang. Nest'ning o'n ikkinchi versiyasi loyiha yaratishda to'rtta savol beradi, biz javoblarni buyruqning o'zida berdik: paket menejeri npm, modul tizimi CommonJS, kuzatuv xizmati va AI agentlar uchun fayllar kerak emas. CommonJS'ni tanladik, chunki o'quvchi loyihasi ham shu tizimda yozilgan. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", show: "Uchinchi: loyihani yarating. Buyruqni qo'lda yozmang, to'liq nusxalang. Nest'ning 12-versiyasi loyiha yaratishda to'rtta savol beradi, biz javoblarni buyruqning o'zida berdik: paket menejeri <code>npm</code>, modul tizimi <code>CommonJS</code>, kuzatuv xizmati va AI agentlar uchun fayllar kerak emas. CommonJS'ni tanladik, chunki o'quvchi loyihasi ham shu tizimda yozilgan. O'rnatish boshlangach, kutmang: katakchani belgilang va keyingi qadamga o'ting.", hl: [2] },
    { id: 'pm', key: "4-qadam: so'rov yuborish uchun <b>Postman</b> yoki VS Code'dagi <b>Thunder Client</b>", text: "To'rtinchi: darsning o'rtasida serverga so'rov yuborasiz, buning uchun dastur kerak bo'ladi. Postman o'rnatilgan bo'lsa, shuni oching. Bo'lmasa, VS Code'ning Extensions bo'limidan Thunder Client'ni qo'shing: u ham xuddi shu ishni qiladi va VS Code ichida ochiladi.", hl: [3] },
    { id: 'e', key: "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi", text: "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: yechimlar oynasi ochiladi, xato va yechimi o'sha yerda. To'rttala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom tugmasi ochilmaydi. Demak, shu amaliyotdan keyin kompyuteringizda Nest o'rnatilgan, yangi loyiha yaratilmoqda va so'rov yuborish dasturi tayyor.", hl: [] },
  ],
};
const P0_STEPS = [
  { t: 'Node', cmds: ['node --version'], exp: 'v22 yoki undan yuqori' },
  { t: 'Nest CLI', cmds: ['npm i -g @nestjs/cli@12', 'nest --version'], exp: '12.x.x' },
  { t: "Loyiha — boshlab qo'ying", cmds: ['nest new cars-api -p npm --type cjs --no-observe --skip-skills'], exp: "savol chiqmaydi · o'rnatish 1–3 daqiqa — kutmang, keyingi qadamga o'ting" },
  { t: "So'rov yuborish dasturi", cmds: [], exp: "Postman ochiladi yoki VS Code → Extensions → «Thunder Client» qo'shilgan (22-ekranda kerak bo'ladi)" },
];
const P0_TROUBLE = [
  ['node: 22 dan past', "nodejs.org dan LTS versiyani o'rnating, terminalni qayta oching, 1-qadamni qaytaring"],
  ['nest: command not found', "CLI o'rnatilmagan yoki terminal yangilanmagan: 2-qadamni qaytaring, terminalni qayta oching"],
  ['nest new savol berdi (package manager, module system…)', "Buyruq to'liq nusxalanmagan: Ctrl+C bosing va 3-qadamdagi buyruqni to'liq nusxalab qayta yozing"],
  ["error: unknown option '--type'", "Eski Nest CLI qolgan: 2-qadamdagi buyruqni qaytaring, nest --version 12 ni ko'rsatsin"],
  ['npm install uzoq / xato', "internetni tekshiring; 3-qadamdagi buyruq oxiriga --skip-install qo'shing, keyin papkada npm install"],
];
const P0_PROOF = { label: "Isbot: nest --version nima chiqardi?", placeholder: 'terminalda chiqqan raqamni yozing', check: (v) => /^v?12\./.test(v), wrong: "Kutilgan 12.x.x — buyruqdagi @12 tushib qolgan yoki terminal yangilanmagan" };
function ScreenP0(p) { return <Practice p={p} S={P0} steps={P0_STEPS} trouble={P0_TROUBLE} proof={P0_PROOF} />; }

// ============================================================
//  2–3-BOSQICH · S6–S9, Amaliyot 1, S10, S11
// ============================================================
const CTRL_LINES = [
  { id: 'l-import', h: `<span class="k">import</span> { Controller, Get } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { id: 'l-import', h: `<span class="k">import</span> { AppService } <span class="k">from</span> <span class="s">'./app.service'</span>;` },
  { h: `` },
  { id: 'l-decorator', h: `<span class="d">@Controller</span>()` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">AppController</span> {` },
  { id: 'l-ctor', h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> appService: <span class="c">AppService</span>) {}` },
  { h: `` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-method', h: `  <span class="c">getHello</span>(): <span class="k">string</span> {` },
  { id: 'l-return', h: `    <span class="k">return</span> <span class="k">this</span>.appService.<span class="c">getHello</span>();` },
  { id: 'l-method', h: `  }` },
  { h: `}` },
];
const S6 = {
  kicker: '2-bosqich · Controller', title: "Controller — so'rovni qabul qiladi",
  segments: [
    { id: 'a', key: "<code>@Controller()</code> qavsi bo'sh — bu Controller'ning path'i <b>root</b> (<code>/</code>)", text: "So'rov yo'lidagi birinchi bekat Controller edi. So'rov aynan shu faylga keladi, shuning uchun undan boshlaymiz. Mana app controller ts. To'rtinchi satrda Controller decorator'i, qavsi bo'sh. Demak bu Controller'ning path'i root. Qavsga cars yozsak, uning hamma metodlari cars path'i bilan boshlanadi.", show: "So'rov yo'lidagi birinchi bekat Controller edi — so'rov aynan shu faylga keladi, shuning uchun undan boshlaymiz. <b>app.controller.ts</b>. To'rtinchi satr: <code>@Controller()</code>, qavsi bo'sh. Demak bu Controller'ning path'i root, ya'ni <code>/</code>. Qavsga cars yozsak, uning hamma metodlari <code>/cars</code> bilan boshlanadi.", focus: ['l-decorator'] },
    { id: 'b', key: "Decorator ostida <b>oddiy TypeScript klass</b>: AppController", text: "Keyin oddiy klass: AppController. Uni Controller qilgan narsa ustidagi decorator.", focus: ['l-class'] },
    { id: 'c', key: "Konstruktor aytadi: <b>«menga AppService kerak»</b> — qanday kelishi 14-ekranda", text: "Konstruktorda bitta satr bor: unda AppService nomli bo'lak so'raladi. Buni hozircha shunday tushuning: bu Controller'ga AppService kerak. Qanday kelishini o'n to'rtinchi ekranda ko'ramiz.", show: "Konstruktorda bitta satr: <code>private readonly appService: AppService</code>. Buni hozircha shunday tushuning: «bu Controller'ga AppService kerak». Qanday kelishini 14-ekranda ko'ramiz.", focus: ['l-ctor'] },
    { id: 'c2', key: "<code>private readonly</code> parametr <b>o'zi klass maydoniga</b> aylanadi — <code>this.appService</code> tayyor", text: "Bir TypeScript qisqa yozuvi: konstruktor parametri oldida private readonly tursa, u avtomatik klassning maydoni bo'ladi. To'rtinchi ekrandagi Car klassida buni qo'lda yozgan edik: this nuqta brand teng brand. Bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", show: "TypeScript qisqa yozuvi: parametr oldida <code>private readonly</code> tursa, u avtomatik klass maydoni bo'ladi. 4-ekrandagi <code>Car</code> klassida buni qo'lda yozgan edik: <code>this.brand = brand</code>. Bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", focus: ['l-ctor'] },
    { id: 'd', key: "<code>@Get()</code> metod ustida: <b>GET so'rov kelsa, shu metodni chaqir</b>", text: "Pastda Get decorator'i. U metod ustida turibdi va aytyapti: GET so'rov kelsa, shu metodni chaqir. Express'dagi app get bilan bir xil ma'no, faqat endi metodning ustida.", show: "Pastda <code>@Get()</code>. U metod ustida turibdi va aytyapti: «GET so'rov kelsa, shu metodni chaqir». Express'dagi <code>app.get</code> bilan bir xil ma'no, faqat endi metodning ustida.", focus: ['l-get', 'l-method'] },
    { id: 'e', key: "Metod ichida bitta ish: <b>Service'ni chaqirib, natijani qaytarish</b>", text: "Metod ichida bitta ish: Service'ning metodini chaqirib, natijasini qaytarish.", show: "Metod ichida bitta ish: <code>this.appService.getHello()</code> natijasini qaytarish.", focus: ['l-return'] },
    { id: 'f', key: "Xulosa: Controller'da <b>logika yozilmaydi</b> — so'rovni oldi, Service'ni chaqirdi, javobni qaytardi", text: "Xulosa: Controller'da logika yozilmaydi. U so'rovni oldi, kerakli Service'ni chaqirdi, javobni qaytardi. Controller shunday bo'lishi kerak: logika Service'da, Controller faqat ulaydi.", focus: [] },
  ],
};
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => (<>
    <Ide files={APP_FILES} active="src/app.controller.ts"><CodePanel file="src/app.controller.ts" lines={CTRL_LINES} focus={seg.focus} /></Ide>
    <Block at={6} beat={beat}><div className="mk-rule">{t(<><b>Controller'da logika yozilmaydi:</b> so'rovni oladi → Service'ni chaqiradi → javobni qaytaradi. <code>if</code>, hisob, baza — Service'da.</>, <><b>В Controller логику не пишут:</b> принимает запрос → вызывает Service → возвращает ответ. <code>if</code>, расчёты, база — в Service.</>)}</div></Block>
  </>)} />;
}

// --- S7 Service ---
const SVC_LINES = [
  { h: `<span class="k">import</span> { Injectable } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `` },
  { id: 'l-injectable', h: `<span class="d">@Injectable</span>()` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">AppService</span> {` },
  { id: 'l-method', h: `  <span class="c">getHello</span>(): <span class="k">string</span> {` },
  { id: 'l-method', h: `    <span class="k">return</span> <span class="s">'Hello World!'</span>;` },
  { id: 'l-method', h: `  }` },
  { h: `}` },
];
const S7 = {
  kicker: '2-bosqich · Service', title: 'Service — ishni bajaradi',
  segments: [
    { id: 'a', key: "<code>@Injectable()</code> — «bu klassni kerakli joyga <b>inject qilish mumkin</b>»", text: "Controller so'rovni oldi va ishni Service'ga uzatdi. Demak keyingi bekat Service, uni ochamiz: app service ts. Ustida Injectable decorator'i. Bu so'z inglizcha, inject qilish mumkin degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga inject qilsa bo'ladi.", show: "Controller so'rovni oldi va ishni Service'ga uzatdi. Demak keyingi bekat — Service: <b>app.service.ts</b>. Ustida <code>@Injectable()</code>. Bu so'z inglizcha, «inject qilish mumkin» degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga inject qilsa bo'ladi.", focus: ['l-injectable'] },
    { id: 'b', key: "Haqiqiy ish <b>Service'da</b>: narx hisobi, qoida tekshiruvi, bazaga yozish", text: "Ichida getHello metodi, u Hello World qaytaradi. Hozir bu juda kichkina, lekin qoida katta loyihada ham o'zgarmaydi: haqiqiy ish Service'da bo'ladi. Narxni hisoblash, qoidani tekshirish, bazaga yozish, hammasi shu yerda.", focus: ['l-method'] },
    { id: 'c', key: "Service'da <code>req</code> ham, <code>res</code> ham yo'q — shuning uchun <b>serversiz sinaladi</b>", text: "Bir narsaga e'tibor bering: Service so'rov haqida hech narsa bilmaydi. Unda req ham, res ham yo'q. Shuning uchun uni alohida sinash oson: test fayli metodni chaqiradi va natijani kutilgan qiymat bilan solishtiradi, server ishga tushirilmaydi.", focus: [] },
    { id: 'd', key: "Xulosa: bitta Service'ni <b>HTTP Controller ham, Telegram bot ham</b> ishlatadi", text: "Va shuning uchun bitta Service'ni ikki joy ishlatishi mumkin: HTTP Controller ham, Telegram bot ham. Xulosa: ish Service'da, Controller faqat uni so'rovga ulaydi.", focus: [] },
  ],
};
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg, beat }) => (<>
    <Ide files={APP_FILES} active="src/app.service.ts"><CodePanel file="src/app.service.ts" lines={SVC_LINES} focus={seg.focus} /></Ide>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={1} beat={beat}><div className="mk-card" style={{ borderColor: PART.svc }}><h5 style={{ color: PART.svc }}>{t("Service'da bor", 'В Service есть')}</h5><div style={{ fontSize: 14 }}>{t('hisob · qoida · bazaga murojaat', 'расчёты · правила · обращение к базе')}</div></div></Block>
      <Block at={2} beat={beat}><div className="mk-card"><h5>{t("Service'da yo'q", 'В Service нет')}</h5><div style={{ fontSize: 14 }}><code>req</code> · <code>res</code> · route — {t('shuning uchun serversiz sinaladi', 'поэтому тестируется без сервера')}</div></div></Block>
    </div>
    <Block at={3} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-row">
        <div className="mk-box" style={{ '--c': PART.ctrl }}><h4>HTTP Controller</h4><p>{t("brauzer so'rovi", 'запрос из браузера')}</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box hl" style={{ '--c': PART.svc }}><h4>CarsService</h4><p>{t('bitta instance, bitta logika', 'один instance, одна логика')}</p></div>
        <div className="mk-arrow on">←</div>
        <div className="mk-box" style={{ '--c': T.purple }}><h4>{t('Telegram bot', 'Telegram-бот')}</h4><p>{t("bot buyrug'i", 'команда бота')}</p></div>
      </div>
    </div></Block>
  </>)} />;
}

// --- S8 Module ---
const MOD_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { AppController } <span class="k">from</span> <span class="s">'./app.controller'</span>;` },
  { h: `<span class="k">import</span> { AppService } <span class="k">from</span> <span class="s">'./app.service'</span>;` },
  { h: `` },
  { id: 'l-module', h: `<span class="d">@Module</span>({` },
  { id: 'l-imports', h: `  imports: [],` },
  { id: 'l-controllers', h: `  controllers: [<span class="c">AppController</span>],` },
  { id: 'l-providers', h: `  providers: [<span class="c">AppService</span>],` },
  { id: 'l-module', h: `})` },
  { h: `<span class="k">export class</span> <span class="c">AppModule</span> {}` },
];
const S8 = {
  kicker: '2-bosqich · Module', title: "Module — ro'yxat",
  segments: [
    { id: 'a', key: "<code>@Module</code> ichida <b>uchta ro'yxat</b>: imports · controllers · providers", text: "Controller ham, Service ham tayyor. Lekin Nest ularning borligini qayerdan biladi? Javob uchinchi faylda, Module'da. app module ts: Module decorator'i va ichida uchta ro'yxat.", focus: ['l-module'] },
    { id: 'b', key: "<code>controllers</code> — Controller'lar, <code>providers</code> — Nest yaratadigan <b>Service'lar</b>", text: "controllers: shu modulga tegishli Controller'lar. providers: shu modul yaratib beradigan narsalar, hozircha bu Service'lar. provider so'zini eslab qoling, Nest Service'ni shunday ataydi.", focus: ['l-controllers', 'l-providers'] },
    { id: 'c', key: "<code>imports</code> — boshqa modullar. Nest <b>faqat ro'yxatdagini</b> ko'radi", text: "imports: boshqa modullar, hozir bo'sh. Module hech qanday ish qilmaydi, u ro'yxat. Lekin bu ro'yxat hal qiluvchi: Nest faqat shu yerda yozilgan narsani ko'radi.", focus: ['l-imports'] },
    { id: 'd', key: "Fayl bor, lekin ro'yxatda yo'q — <b>Nest uchun u yo'q</b>", text: "Controller yozib, uni controllers ro'yxatiga qo'shmasangiz, u yo'qdek. Service yozib, providers'ga qo'shmasangiz, Nest uni inject qila olmaydi.", focus: [] },
    { id: 'e', key: "Xulosa: <b>AppModule</b> tepada, qolgan modullar unga <code>imports</code> orqali ulanadi", text: "Loyihada bir nechta modul bo'ladi: cars uchun, users uchun, orders uchun. Hammasining tepasida AppModule turadi va qolganlarini imports orqali o'ziga ulaydi. Xulosa: Module ish qilmaydi, lekin u ro'yxat bo'lgani uchun xatolarning ko'pi aynan shu faylda tuzatiladi.", focus: ['l-imports'] },
  ],
};
// F-1120-02: kod ostida — Nest ko'radigan uch ro'yxat (Shelves); oxirida modullar strukturasi chiziqlar bilan (ModTree)
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => (<>
    {beat < 4 && <Ide files={APP_FILES} active="src/app.module.ts"><CodePanel file="src/app.module.ts" lines={MOD_LINES} focus={seg.focus} /></Ide>}
    <div className="mk-light" style={{ padding: 14 }}><Shelves beat={Math.min(beat, 3)} /></div>
    <Block at={3} beat={beat} dim={beat >= 4}><div className="mk-rule">{t(<><b>Ro'yxatda yo'q = Nest uchun yo'q.</b> Controller → <code>controllers</code>, Service → <code>providers</code>, boshqa modul → <code>imports</code>.</>, <><b>Нет в списке = нет для Nest.</b> Controller → <code>controllers</code>, Service → <code>providers</code>, другой модуль → <code>imports</code>.</>)}</div></Block>
    {beat >= 4 && <div className="mk-light" style={{ padding: 14 }}><ModTree /></div>}
  </>)} />;
}

// --- S9 main.ts va terminal chiqishi ---
// F-1125-01: oxirgi satr Nest 12 qolipida void bilan keladi (feedback/F-1125-01-nest1-kuchaytirish/nest12/qolip-n12-cjs/main.ts)
const MAIN_LINES = [
  { h: `<span class="k">import</span> { NestFactory } <span class="k">from</span> <span class="s">'@nestjs/core'</span>;` },
  { h: `<span class="k">import</span> { AppModule } <span class="k">from</span> <span class="s">'./app.module'</span>;` },
  { h: `` },
  { h: `<span class="k">async function</span> <span class="c">bootstrap</span>() {` },
  { id: 'main-create', h: `  <span class="k">const</span> app = <span class="k">await</span> NestFactory.<span class="c">create</span>(<span class="c">AppModule</span>);` },
  { id: 'main-listen', h: `  <span class="k">await</span> app.<span class="c">listen</span>(process.env.PORT ?? <span class="d">3000</span>);` },
  { h: `}` },
  { id: 'main-boot', h: `<span class="k">void</span> <span class="c">bootstrap</span>();` },
];
const LOG_LINES = [
  { at: 1, h: `<span class="p">$</span> npm run start:dev` },
  { at: 2, id: 'log1', h: `[Nest] LOG [NestFactory] Starting Nest application...` },
  { at: 2, id: 'log2', h: `[Nest] LOG [InstanceLoader] <span class="ok">AppModule dependencies initialized</span>` },
  { at: 3, id: 'log3', h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
  { at: 3, id: 'log4', h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/, GET} route</span>` },
  { at: 3, id: 'log5', h: `[Nest] LOG [NestApplication] Nest application successfully started` },
];
const S9 = {
  kicker: '2-bosqich · main.ts', title: "main.ts va terminaldagi ishga tushish satrlari",
  segments: [
    { id: 'a', key: "<code>main.ts</code> bosh modulni Nest'ga beradi — <b>Nest hammasini yig'adi</b>", text: "Uch bo'lakni ko'rdik. Endi ular qanday ishga tushadi? Hammasi main ts dan boshlanadi. Birinchi satr: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", show: "Uch bo'lakni ko'rdik. Endi ular qanday ishga tushadi? Hammasi main.ts dan boshlanadi. <code>NestFactory.create(AppModule)</code>: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", focus: ['main-create'], lf: [] },
    { id: 'b', key: "Port 3000 tinglanadi. Terminalda: <code>npm run start:dev</code>", text: "Keyin uch ming portni tinglaydi, Express'dagi kabi. Oxirgi satrda bootstrap funksiyasi chaqiriladi. Oldidagi void so'zi bu chaqiruvning natijasi bizga kerak emasligini bildiradi, ilova ishlashiga ta'sir qilmaydi. Endi terminalga qarang, npm run start dev yozdik.", show: "Keyin <code>listen(3000)</code>: Express'dagi kabi portni tinglaydi. Oxirgi satrda <code>bootstrap()</code> chaqiriladi. Oldidagi <code>void</code> bu chaqiruvning natijasi bizga kerak emasligini bildiradi, ilova ishlashiga ta'sir qilmaydi. Endi terminalga qarang, <code>npm run start:dev</code> yozdik.", focus: ['main-listen', 'main-boot'], lf: [] },
    { id: 'c', key: "Terminal: <b>dependencies initialized</b> — ro'yxatdagi hamma narsa yaratildi", text: "Birinchi satr: Nest ilovasi ishga tushmoqda. Ikkinchi: AppModule'ning dependency'lari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", show: "Starting Nest application. <b>AppModule dependencies initialized</b>: AppModule'ning dependency'lari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", focus: [], lf: ['log1', 'log2'] },
    { id: 'd', key: "Terminal: <b>Mapped {/, GET}</b> — root path'ga GET route'i ulandi", text: "Keyin: AppController topildi va unga root path berildi. Mapped satri: root path'ga GET route'i ulandi. Va oxirgisi: ilova muvaffaqiyatli ishga tushdi.", show: "<code>AppController {/}</code>: Controller topildi va unga path berildi. <b>Mapped {/, GET} route</b>: root path'ga GET route'i ulandi. Nest application successfully started.", focus: [], lf: ['log3', 'log4', 'log5'] },
    { id: 'e', key: "Odat: route ishlamasa — <b>avval terminaldagi Mapped satrini</b> qidiring", text: "Bu satrlarni o'qishni odat qiling. Keyinchalik biror route ishlamasa, birinchi qiladigan ishingiz terminaldagi shu satrlarga qarash bo'ladi: Mapped satri bormi, yo'qmi.", focus: [], lf: ['log4'] },
    { id: 'f', key: "Xulosa: main.ts → modul → Controller → brauzerda <b>Hello World!</b>", text: "Brauzerda localhost uch ming, javob: Hello World. Xulosa: main ts bosh modulni beradi, Nest ro'yxatdan hamma bo'lakni yig'adi va route'larni ulaydi, terminal esa nima ulanganini aytib turadi.", show: "Brauzerda <code>localhost:3000</code>, javob: <b>Hello World!</b> Xulosa: main.ts bosh modulni beradi, Nest ro'yxatdan hamma bo'lakni yig'adi va route'larni ulaydi, terminal esa nima ulanganini aytib turadi.", focus: [], lf: [] },
  ],
};
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => (<>
    <Ide files={APP_FILES} active="src/main.ts">
      <CodePanel file="src/main.ts" lines={MAIN_LINES} focus={seg.focus} />
      <Block at={1} beat={beat}><CodePanel file="terminal" lines={LOG_LINES} beat={beat} focus={seg.lf} numbers={false} wrap style={{ background: '#111827' }} /></Block>
      <Block at={5} beat={beat}><Browser url="localhost:3000" out="Hello World!" /></Block>
    </Ide>
  </>)} />;
}

// --- Amaliyot 1: loyihani yarating va ishga tushiring ---
const P1 = {
  kicker: 'Amaliyot 2 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa", title: "Ishga tushiring va terminalni o'qing", tableAt: 4,
  segments: [
    { id: 'a', key: "1-amaliyotdagi loyihangiz o'rnatildi — endi uni <b>ishga tushirasiz</b>", text: "Yana navbat sizga. Birinchi amaliyotda boshlab qo'ygan loyihangiz o'rnatilib bo'lgan bo'lsa kerak. Uch qadam: ishga tushirasiz, terminaldagi satrlarni o'qiysiz, brauzerda ko'rasiz.", hl: [] },
    { id: 'b', key: "1-qadam: papkaga kirib <code>npm run start:dev</code> yozing", text: "Birinchi: papkaga kiring va npm run start dev yozing.", hl: [0] },
    { id: 'c', key: "2-qadam: terminalda <b>Mapped</b> satrini toping va isbot maydoniga qo'ying", text: "Ikkinchi: terminalda Mapped satrini toping va uni aynan nusxalab, pastdagi isbot maydoniga qo'ying.", hl: [1] },
    { id: 'd', key: "3-qadam: brauzerda <code>localhost:3000</code> — <b>Hello World!</b> chiqsin", text: "Uchinchi: brauzerda localhost uch ming, Hello World ni ko'ring.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi", text: "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Uchala katakcha belgilanmaguncha va isbot to'g'ri qo'yilmaguncha Davom ochilmaydi. Demak, shu amaliyotdan keyin loyihangiz ishga tushgan va siz terminaldagi Mapped satrlarini o'qiy olasiz.", hl: [] },
  ],
};
const P1_STEPS = [
  { t: 'Ishga tushirish', cmds: ['cd cars-api', 'npm run start:dev'], exp: 'oxirida «Nest application successfully started»' },
  { t: 'Terminal', cmds: [], exp: 'Mapped {/, GET} route satri — nusxalab isbot maydoniga qo\'ying' },
  { t: 'Brauzer', cmds: [], exp: 'localhost:3000 → Hello World!' },
];
const P1_TROUBLE = [
  ['nest new hali tugamagan', "Terminalda «Successfully created project» chiqishini kuting; 5 daqiqadan oshsa — internet yoki npm install uzoq (--skip-install, keyin npm install)"],
  ['EADDRINUSE :::3000', "3000-portda boshqa server ochiq: uni yoping yoki PORT=3001 npm run start:dev"],
  ['Mapped satri yo\'q, xato bor', "Xato matnini o'qing: qizil TypeScript xatosi bo'lsa fayl:satr ko'rsatilgan; nest new tugamagan bo'lsa kuting"],
  ['Terminalda ObserveModule satrlari bor', "Loyiha 1-amaliyotdagi buyruq bilan yaratilmagan: cars-api papkasini o'chiring va 1-amaliyotning 3-qadamidagi buyruqni to'liq nusxalab qayta yarating"],
];
const P1_PROOF = { label: 'Isbot: terminaldagi Mapped satrini nusxalang', placeholder: "terminaldagi satrni shu yerga qo'ying", check: (v) => /Mapped\s*\{\s*\/\s*,\s*GET\s*\}/i.test(v), wrong: "Kutilgan: Mapped {/, GET} route — terminaldagi satrni aynan nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// --- S10 Tekshiruv 1 ---
function Screen10(p) {
  return <MCRetry {...p} kicker={t('Tekshiruv 1', 'Проверка 1')} eyebrow={t('Tekshiruv · 1 / 6', 'Проверка · 1 / 6')}
    title={t('Mashina narxiga chegirma hisoblaydigan kodni qayerga yozasiz?', 'Куда вы напишете код, который считает скидку на цену машины?')}
    q={t("Uch bo'lakni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Faraz qiling, mashina narxiga chegirma hisoblash kerak. Bu kod qayerga yoziladi? Variantni tanlang.", 'Три части вы увидели, теперь проверим. Первая проверка. Представьте, что нужно посчитать скидку на цену машины. Куда пишется этот код? Выберите вариант.')}
    opts={t(['Controller metodi ichiga', 'Service metodi ichiga', 'AppModule ichiga', 'main.ts ichiga'], ['Внутрь метода Controller', 'Внутрь метода Service', 'Внутрь AppModule', 'Внутрь main.ts'])} correct={1}
    ok={t("To'g'ri, Service. Hisob, qoida va bazaga murojaat Service'da turadi. Controller faqat so'rovni oladi va Service'ni chaqiradi. Shunda chegirmani serversiz ham sinab ko'rish mumkin. Demak, biznes logika qayerda turadi deb so'ralsa, javob doim Service.", 'Верно, Service. Расчёты, правила и обращение к базе живут в Service. Controller только принимает запрос и вызывает Service. Тогда скидку можно проверить и без сервера. Значит, если спрашивают, где живёт бизнес-логика, ответ всегда Service.')}
    okShort={t("Service: hisob, qoida, baza — shu yerda. Controller faqat oladi va chaqiradi.", 'Service: расчёты, правила, база — здесь. Controller только принимает и вызывает.')}
    wrong={t({ 0: "Controller'da logika yozilmaydi: u so'rovni oladi va Service'ga uzatadi, hisoblamaydi.", 2: "Module ro'yxat, unda ish bajaradigan kod yozilmaydi.", 3: "main.ts faqat ilovani ishga tushiradi." }, { 0: 'В Controller логику не пишут: он принимает запрос и передаёт его в Service, а не считает.', 2: 'Module — это список, код, который выполняет работу, в нём не пишут.', 3: 'main.ts только запускает приложение.' })} />;
}

// --- S11 Dependency Injection — qadam-baqadam, fayllar bilan (F-1030-06: avvalgi ko'rinish tushunarsiz edi) ---
// Savol (konstruktorda so'ralgan, lekin hech kim new qilmagan) → Express'da qanday edi → Nest'ning 3 qadami (module o'qiydi → 1 instance → konstruktorga beradi) → nom → foyda → xulosa
const S11 = {
  kicker: '3-bosqich · Dependency Injection', title: "Service Controller'ga qanday keladi",
  segments: [
    { id: 'a', key: "Konstruktorda <b>«menga AppService kerak»</b> — lekin uni hech kim <code>new</code> bilan yaratmagan", text: "Tekshiruvda Controller Service'ni chaqiradi dedik. Lekin Controller Service'ni qayerdan oladi? Shu savol bilan Controller faylidagi konstruktorga qaytamiz. Bu yerda yozilgan: menga AppService kerak. Lekin butun loyihada new AppService degan satr yo'q. Unda Service qayerdan keladi? Shu ekranda aynan shuni qadam-baqadam ko'ramiz.", show: "Tekshiruvda «Controller Service'ni chaqiradi» dedik. Lekin Controller Service'ni qayerdan oladi? Shu savol bilan Controller faylidagi konstruktorga qaytamiz: <code>constructor(private readonly appService: AppService)</code> — «menga AppService kerak». Lekin butun loyihada <code>new AppService()</code> degan satr yo'q. Unda Service qayerdan keladi?", st: 'ctrl' },
    { id: 'b', key: "Express'da o'zingiz yaratasiz: <code>require</code> + <code>new</code>, <b>har faylda qaytadan</b>", text: "Express'da bu ishni o'zingiz qilasiz: require qilasiz, new bilan yaratasiz, har kerakli faylda qaytadan. Uchta faylga kerak bo'lsa, uch marta. Nest'da bu ish sizdan olingan.", st: 'express' },
    { id: 'c', key: "1-qadam: Nest ishga tushganda <b>app.module.ts</b>'dagi <code>providers</code>'ni o'qiydi", text: "Birinchi qadam. Server ishga tushganda Nest app module ts faylini ochadi va providers ro'yxatini o'qiydi: unda AppService turibdi.", st: 'mod' },
    { id: 'd', key: "2-qadam: Nest AppService'dan <b>bitta instance</b> yaratib, o'zida saqlaydi", text: "Ikkinchi qadam. Nest AppService'dan bitta instance yaratadi va o'zida saqlab qo'yadi. Bu ombor Nest konteyneri deyiladi.", st: 'make' },
    { id: 'e', key: "3-qadam: konstruktordagi tip <code>AppService</code> — Nest <b>shu instance'ni konstruktorga beradi</b>", text: "Uchinchi qadam. Nest AppController'ni yaratayotib uning konstruktoriga qaraydi: parametrning tipi AppService. Tip buyurtma varaqasi kabi ishlaydi: Nest konteynerdan aynan shu tipdagi instance'ni olib, konstruktorga beradi. Endi this appService tayyor.", st: 'give' },
    { id: 'f', key: "Bu usulning nomi: <b>Dependency Injection</b> — dependency'ni inject qilish", text: "Bu usul Dependency Injection deyiladi, dependency'ni inject qilish. Dependency, chunki Controller Service'siz ishlay olmaydi. Inject, chunki uni siz emas, Nest tashqaridan olib kelib beradi.", st: 'give' },
    { id: 'g', key: "Foyda: <b>bitta instance</b>, testda <b>soxtasini berish</b> mumkin, Controller manbani bilmaydi", text: "Nega bu yaxshi? Birinchidan, butun loyihada bitta instance. Ikkinchidan, testda haqiqiy Service o'rniga soxtasini berish mumkin, Controller buni sezmaydi. Uchinchidan, Controller Service qayerdan kelganini bilishi shart emas.", st: 'give' },
    { id: 'h', key: "Xulosa: siz ikki ish qilasiz — <b>providers'ga yozasiz, konstruktorda so'raysiz</b>", text: "Xulosa. Sizning ishingiz ikkita: Service'ni modulning providers ro'yxatiga yozish va kerakli joyda konstruktorda so'rash. Yaratish va inject qilishni Nest qiladi. Ikkalasidan biri unutilsa nima bo'lishini beshinchi bosqichda ataylab buzib ko'ramiz.", st: 'give' },
  ],
};
// F-1120-02: sahna — Nest konteyneri AppService instance'ini konstruktorga olib boradi (DiMachine, 02b-mashina.jsx).
// Ikki matnli karta o'rniga: 1-qatorda loyiha qidiruvi (new AppService — 0), 2-qatorda Express'dagi uch marta new, oxirida uch foyda chizmasi
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ beat }) => <div className="mk-light" style={{ padding: 16 }}><DiMachine beat={beat} /></div>} />;
}

// ============================================================
//  4-BOSQICH · S12–S17, LineCheck 1, Amaliyot 2
// ============================================================
const CLI_LINES = [
  { at: 0, id: 'cmd1', h: `<span class="p">$</span> nest g module cars` },
  { at: 1, id: 'out1', h: `<span class="ok">CREATE</span> src/cars/cars.module.ts (81 bytes)` },
  { at: 1, id: 'out1u', h: `<span class="wn">UPDATE</span> src/app.module.ts (308 bytes)` },
  { at: 2, h: `` },
  { at: 2, id: 'cmd2', h: `<span class="p">$</span> nest g controller cars --no-spec` },
  { at: 2, id: 'out2', h: `<span class="ok">CREATE</span> src/cars/cars.controller.ts (97 bytes)` },
  { at: 2, id: 'out2', h: `<span class="wn">UPDATE</span> src/cars/cars.module.ts (166 bytes)` },
  { at: 3, h: `` },
  { at: 3, id: 'cmd3', h: `<span class="p">$</span> nest g service cars --no-spec` },
  { at: 3, id: 'out3', h: `<span class="ok">CREATE</span> src/cars/cars.service.ts (88 bytes)` },
  { at: 3, id: 'out3', h: `<span class="wn">UPDATE</span> src/cars/cars.module.ts (240 bytes)` },
];
const DIFF_LINES = [
  { h: `<span class="d">@Module</span>({` },
  { neu: true, h: `  imports: [<span class="c">CarsModule</span>],` },
  { h: `  controllers: [<span class="c">AppController</span>],` },
  { h: `  providers: [<span class="c">AppService</span>],` },
  { h: `})` },
];
const S12 = {
  kicker: '4-bosqich · CLI', title: 'CLI bilan cars modulini yaratamiz',
  segments: [
    { id: 'a', key: "Birinchi buyruq: <code>nest g module cars</code> — g = generate, ya'ni yaratish", text: "Asoslar tayyor: uch bo'lakni va Dependency Injection'ni bilasiz. Endi o'zimiz quramiz. Mashinalar uchun alohida modul kerak. Nest CLI buni uch buyruq bilan yaratadi. Birinchisi: nest g module cars. g bu generate, yaratish.", focus: ['cmd1'] },
    { id: 'b', key: "CLI bosh modulga <b>o'zi kirib</b>, <code>imports</code>'ga CarsModule'ni qo'shdi — UPDATE", text: "Natija ikki satr: CREATE, cars module yaratildi, va UPDATE, app module o'zgartirildi. Ikkinchi satrga e'tibor bering: CLI bosh modulga o'zi kirib, imports ro'yxatiga CarsModule'ni qo'shib qo'ydi. Qo'l bilan qilsangiz, aynan shuni unutasiz.", focus: ['out1u'] },
    { id: 'c', key: "<code>nest g controller cars</code> — Controller yaratildi va <b>controllers'ga yozildi</b>", text: "Ikkinchi buyruq: nest g controller cars. no-spec qo'shimchasi test faylini yaratma degani: bu darsda testlar bilan ishlamaymiz, fayllar kamroq bo'lsin. Controller yaratildi va cars modulining controllers ro'yxatiga yozildi.", show: "<code>nest g controller cars --no-spec</code>. <code>--no-spec</code>: test faylini yaratma — bu darsda testlar bilan ishlamaymiz. Controller yaratildi va cars modulining <code>controllers</code> ro'yxatiga yozildi.", focus: ['cmd2', 'out2'] },
    { id: 'd', key: "<code>nest g service cars</code> — Service yaratildi va <b>providers'ga yozildi</b>", text: "Uchinchi buyruq: nest g service cars. Service yaratildi va providers ro'yxatiga yozildi.", focus: ['cmd3', 'out3'] },
    { id: 'e', key: "Xulosa: 3 buyruq — 3 CREATE, 3 UPDATE. <b>CLI nima qilganini biling</b>, buzilsa qo'lda tuzatasiz", text: "Xulosa: uch buyruq, oltita o'zgarish va hamma ro'yxat to'g'ri. Chapdagi Explorer'da cars papkasi va uch yangi fayl paydo bo'ldi. CLI'ga ishonish mumkin, lekin u nima qilganini bilish shart, chunki buzilganda qo'l bilan tuzatasiz.", focus: [] },
  ],
};
function Screen12(p) {
  // Explorer buyruq bilan birga o'sadi: har CREATE — yangi fayl paydo bo'ladi, UPDATE qilingan fayl yoritiladi
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => {
    const files = [...APP_FILES, ...(beat >= 1 ? [CARS_FILES[0]] : []), ...(beat >= 2 ? [CARS_FILES[1]] : []), ...(beat >= 3 ? [CARS_FILES[2]] : [])];
    const fresh = beat === 1 ? [CARS_FILES[0]] : beat === 2 ? [CARS_FILES[1]] : beat === 3 ? [CARS_FILES[2]] : [];
    const active = beat === 1 ? 'src/app.module.ts' : beat === 2 ? CARS_FILES[1] : beat === 3 ? CARS_FILES[2] : null;
    return (
      <Ide files={files} active={active} fresh={fresh}>
        <CodePanel file="terminal" lines={CLI_LINES} beat={beat} focus={seg.focus} numbers={false} style={{ background: '#111827' }} />
        <Block at={1} beat={beat} dim={beat >= 2}><CodePanel file={t("src/app.module.ts · CLI o'zi o'zgartirdi", 'src/app.module.ts · CLI изменил сам')} lines={DIFF_LINES} numbers={false} /></Block>
        <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>3 buyruq → 3 CREATE + 3 UPDATE.</b> Har ro'yxat (imports · controllers · providers) CLI tomonidan to'ldirildi.</>, <><b>3 команды → 3 CREATE + 3 UPDATE.</b> Каждый список (imports · controllers · providers) заполнил CLI.</>)}</div></Block>
      </Ide>
    );
  }} />;
}

// --- S13 Bo'sh fayllar (+ o'ylab ko'ring) — F-1030-09: avval uch fayl birdan chiqardi; endi bittadan, Explorer bilan ---
// Fayl → savol → fayl → fayl → terminal → brauzer → xulosa (manzil Controller'dan, route metoddan)
const S13_FILES = {
  'src/cars/cars.module.ts': [{ h: `<span class="d">@Module</span>({` }, { id: 'lst', h: `  controllers: [<span class="c">CarsController</span>],` }, { id: 'lst', h: `  providers: [<span class="c">CarsService</span>]` }, { h: `})` }, { h: `<span class="k">export class</span> <span class="c">CarsModule</span> {}` }],
  'src/cars/cars.controller.ts': [{ h: `<span class="k">import</span> { Controller } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` }, { h: `` }, { id: 'dec', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` }, { id: 'body', h: `<span class="k">export class</span> <span class="c">CarsController</span> {}   <span class="cm">// ichi bo'sh — metod yo'q</span>` }],
  'src/cars/cars.service.ts': [{ h: `<span class="k">import</span> { Injectable } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` }, { h: `` }, { h: `<span class="d">@Injectable</span>()` }, { id: 'body', h: `<span class="k">export class</span> <span class="c">CarsService</span> {}   <span class="cm">// ichi bo'sh</span>` }],
};
const S13 = {
  kicker: "4-bosqich · bo'sh fayllar", title: "CLI yaratgan fayllar bo'sh: path bor, route yo'q",
  segments: [
    { id: 'a', key: "<b>cars.module.ts</b>: ikkala ro'yxatni CLI <b>o'zi to'ldirdi</b>", text: "CLI uch faylni yaratdi va ro'yxatlarga yozdi. Ichida nima bor? Birma-bir ochamiz. Birinchisi cars module ts: controllers ro'yxatida CarsController, providers ro'yxatida CarsService. Ikkalasini CLI o'zi yozdi.", file: 'src/cars/cars.module.ts', focus: ['lst'] },
    { id: 'b', key: "O'ylab ko'ring: shu fayllar bilan server ishga tushsa, <code>/cars</code> nima qaytaradi?", text: "Boshqa fayllarni ochishdan oldin o'ylab ko'ring. CLI hozirgina yaratgan Controller va Service bilan serverni ishga tushirsak, cars route'i nima qaytaradi? Uchta variantdan birini bosing.", ask: { q: "CLI yaratgan fayllar bilan server nima qiladi?", opts: ['Xato bilan yiqiladi', "Ishga tushadi, /cars → 404", "Ishga tushadi, /cars → 200, bo'sh ro'yxat"], answer: 1 }, file: 'src/cars/cars.module.ts', focus: [] },
    { id: 'c', key: "<b>cars.controller.ts</b>: decorator bor, lekin klass ichi <b>bo'sh — birorta metod yo'q</b>", text: "Endi cars controller ts. Controller decorator'i bor, qavsda cars. Lekin klassning ichi bo'sh: Get ham, Post ham, birorta metod yo'q.", show: "<b>cars.controller.ts</b>: <code>@Controller('cars')</code> bor, lekin klass ichi bo'sh — <code>@Get</code> ham, <code>@Post</code> ham, birorta metod yo'q.", file: 'src/cars/cars.controller.ts', focus: ['dec', 'body'] },
    { id: 'd', key: "<b>cars.service.ts</b>: <code>@Injectable()</code> bor, ichi ham <b>bo'sh</b>", text: "cars service ts ham xuddi shunday: Injectable decorator'i bor, ichi bo'sh.", show: "<b>cars.service.ts</b>: <code>@Injectable()</code> bor, ichi ham bo'sh.", file: 'src/cars/cars.service.ts', focus: ['body'] },
    { id: 'e', key: "Terminalda <code>CarsController {/cars}</code> bor, lekin <b>Mapped satri yo'q</b>", text: "Serverni ishga tushiramiz. Terminalda yangi satr bor: CarsController, qavs ichida cars path'i. Nest Controller'ni ko'rdi va unga path berdi. Lekin Mapped satri yo'q, chunki route metoddan paydo bo'ladi, metod esa yo'q.", show: "Terminalda yangi satr: <code>CarsController {/cars}</code>. Nest Controller'ni ko'rdi va unga path berdi. Lekin <b>Mapped satri yo'q</b>, chunki route metoddan paydo bo'ladi, metod esa yo'q.", file: null, focus: [] },
    { id: 'f', key: "Brauzerda <code>/cars</code> → <b>404</b>: eshik bor, ichida hech kim yo'q", text: "Brauzerda cars route'ini ochsak: to'rt yuz to'rt, Cannot GET cars. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.", show: "Brauzerda /cars ochsak: <b>404, Cannot GET /cars</b>. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.", file: null, focus: [] },
    { id: 'g', key: "Xulosa: path'ni Controller beradi, route'ni <b>metod</b> beradi — endi avval Service, keyin Controller", text: "Xulosa: path'ni Controller decorator'i beradi, route'ni esa metod va uning ustidagi Get yoki Post beradi. Metod yo'q ekan, Mapped ham yo'q, javob to'rt yuz to'rt. Keyingi ikki ekranda fayllarni to'ldiramiz: avval ishni bajaradigan Service, keyin uni chaqiradigan Controller.", file: null, focus: [] },
  ],
};
function Screen13(p) {
  return <Lesson p={p} S={S13} sceneTop scene={({ seg, beat }) => (
    <Ide files={ALL_FILES} active={seg.file}>
      {beat < 4
        ? <CodePanel key={seg.file} file={seg.file} lines={S13_FILES[seg.file]} focus={seg.focus} style={{ fontSize: 14 }} />
        : <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
            {CARS_FILES.map((f) => <CodePanel key={f} file={baseName(f)} numbers={false} lines={S13_FILES[f].filter((l) => l.h && !/import/.test(l.h)).map((l) => ({ ...l, h: l.h.replace(/\s*<span class="cm">[^<]*<\/span>/, '') }))} style={{ padding: '14px 12px', fontSize: 11.5 }} />)}
          </div>}
      <Block at={4} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [InstanceLoader] CarsModule dependencies initialized` },
        { id: 'x', h: `[Nest] LOG [RoutesResolver] <span class="ok">CarsController {/cars}:</span>` },
        { id: 'miss', keep: true, h: t("<span class=\"er\">⟵ bu yerda Mapped {/cars, GET} bo'lishi kerak edi — metod yo'q, satr ham yo'q</span>", '<span class="er">⟵ здесь должна была быть строка Mapped {/cars, GET} — метода нет, и строки нет</span>') },
        { h: `[Nest] LOG [NestApplication] Nest application successfully started` }]} focus={beat === 4 ? ['x', 'miss'] : []} /></Block>
      <Block at={5} beat={beat}><Browser url="localhost:3000/cars" out={'404 · {"message":"Cannot GET /cars"}'} er /></Block>
      <Block at={6} beat={beat}><div className="mk-rule">{t(<><b>Path — Controller'dan, route — metoddan.</b> Metod yo'q → Mapped yo'q → 404. Tartib: avval <b>Service</b> (ishni bajaradigan), keyin <b>Controller</b> (uni chaqiradigan).</>, <><b>Path — от Controller, route — от метода.</b> Нет метода → нет Mapped → 404. Порядок: сначала <b>Service</b> (выполняет работу), потом <b>Controller</b> (вызывает его).</>)}</div></Block>
    </Ide>
  )} />;
}

// --- S14 Service kodi ---
const CARS_SVC_LINES = [
  { at: 0, h: `<span class="k">import</span> { Injectable, NotFoundException } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { at: 0, h: `` },
  { at: 0, id: 'l-interface', h: `<span class="k">export interface</span> <span class="c">Car</span> {` },
  { at: 0, id: 'l-interface', h: `  id: <span class="k">number</span>;  brand: <span class="k">string</span>;  model: <span class="k">string</span>;  price: <span class="k">number</span>;` },
  { at: 0, id: 'l-interface', h: `}` },
  { at: 1, h: `` },
  { at: 1, h: `<span class="d">@Injectable</span>()` },
  { at: 1, h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
  { at: 1, id: 'l-array', h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [` },
  { at: 1, id: 'l-array', h: `    { id: <span class="d">1</span>, brand: <span class="s">'Chevrolet'</span>, model: <span class="s">'Malibu'</span>, price: <span class="d">250</span> },` },
  { at: 1, id: 'l-array', h: `    { id: <span class="d">2</span>, brand: <span class="s">'Kia'</span>, model: <span class="s">'K5'</span>, price: <span class="d">320</span> },` },
  { at: 1, id: 'l-array', h: `  ];` },
  { at: 2, h: `` },
  { at: 2, id: 'l-findAll', h: `  <span class="c">findAll</span>(): <span class="c">Car</span>[] { <span class="k">return this</span>.cars; }` },
  { at: 2, h: `` },
  { at: 2, id: 'l-findOne', h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
  { at: 2, id: 'l-findOne', h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
  { at: 3, id: 'l-notfound', h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
  { at: 2, id: 'l-findOne', h: `    <span class="k">return</span> car;` },
  { at: 2, id: 'l-findOne', h: `  }` },
  { at: 4, h: `` },
  { at: 4, id: 'l-create', h: `  <span class="c">create</span>(data: <span class="c">Omit</span>&lt;<span class="c">Car</span>, <span class="s">'id'</span>&gt;): <span class="c">Car</span> {` },
  { at: 4, id: 'l-create', h: `    <span class="k">const</span> car: <span class="c">Car</span> = { id: <span class="k">this</span>.cars.length + <span class="d">1</span>, ...data };` },
  { at: 4, id: 'l-create', h: `    <span class="k">this</span>.cars.<span class="c">push</span>(car);` },
  { at: 4, id: 'l-create', h: `    <span class="k">return</span> car;` },
  { at: 4, id: 'l-create', h: `  }` },
  { at: 1, h: `}` },
];
const S14 = {
  kicker: '4-bosqich · Service', title: "Service: ro'yxat va uch metod",
  segments: [
    { id: 'a', key: "<code>Car</code> interfeysi — mashinaning <b>shakli</b>: id, brand, model, price (bazadagi jadval emas)", text: "Fayllar bo'sh, route yo'q. Tartib bo'yicha avval ishni bajaradigan bo'lakni, Service'ni to'ldiramiz. cars service ts. Avval Car interfeysi: mashinada id, brand, model va price bo'ladi. Interface TypeScript'ning shakl tavsifi, bazadagi jadval emas, hozircha shunchaki shakl.", focus: ['l-interface'] },
    { id: 'b', key: "Ro'yxat hozircha <b>xotirada</b>: Malibu va K5 — bu darsda baza kerak emas", text: "Keyin ro'yxat: ikkita mashina, Chevrolet Malibu va Kia K5, narxi million so'mda. Baza hali yo'q, ma'lumot xotirada turibdi, bu dars uchun yetarli.", focus: ['l-array'] },
    { id: 'c', key: "<code>findAll</code> hammasini qaytaradi, <code>findOne</code> <b>id bo'yicha</b> bittasini qidiradi", text: "findAll ro'yxatni qaytaradi. findOne id bo'yicha qidiradi.", focus: ['l-findAll', 'l-findOne'] },
    { id: 'd', key: "Topilmasa <b>NotFoundException</b> tashlaydi — Nest uni o'zi <b>404 javobga</b> aylantiradi", text: "Topilmasa, NotFoundException tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi to'rt yuz to'rt javobga aylantiradi, statusi va xabari bilan. Express'da buni qo'lda yozasiz: status to'rt yuz to'rt va json.", show: "Topilmasa, <b>NotFoundException</b> tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi 404 javobga aylantiradi, statusi va xabari bilan. Express'da buni qo'lda yozasiz: <code>res.status(404).json</code>.", focus: ['l-notfound'] },
    { id: 'e', key: "Xulosa: <code>create</code> qo'shadi, Service'da esa <b>so'rov haqida bitta so'z yo'q</b>", text: "create yangi mashinani ro'yxatga qo'shadi va qaytaradi. Qavsdagi Omit Car vergul id, TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz o'zimiz beramiz. Xulosa: bu faylda so'rov haqida bitta so'z ham yo'q, req ham, res ham yo'q. Faqat mashinalar va ular bilan ishlaydigan uch metod. Shuning uchun uni Controller ham, Telegram bot ham ishlata oladi.", show: "<code>create</code> yangi mashinani qo'shadi va qaytaradi. <code>Omit&lt;Car, 'id'&gt;</code> — TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz beramiz. <b>Xulosa:</b> bu faylda so'rov haqida bitta so'z ham yo'q — faqat mashinalar va uch metod.", focus: ['l-create'] },
  ],
};
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg, beat }) => <Ide files={ALL_FILES} active="src/cars/cars.service.ts"><CodePanel file="src/cars/cars.service.ts" lines={beat >= 4 ? CARS_SVC_LINES.slice(6).map((l, k) => ({ ...l, n: 7 + k })) : CARS_SVC_LINES} beat={beat} focus={seg.focus} /></Ide>} />;
}

// --- S15 Controller kodi ---
const CARS_CTRL_LINES = [
  { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { CarsService } <span class="k">from</span> <span class="s">'./cars.service'</span>;` },
  { h: `` },
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-ctor', h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
  { h: `` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.carsService.<span class="c">findAll</span>(); }` },
  { h: `` },
  { id: 'l-getid', h: `  <span class="d">@Get</span>(<span class="s">':id'</span>)` },
  { id: 'l-param', h: `  <span class="c">findOne</span>(<span class="d">@Param</span>(<span class="s">'id'</span>) id: <span class="k">string</span>) {` },
  { id: 'l-param', h: `    <span class="k">return this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));` },
  { id: 'l-getid', h: `  }` },
  { h: `` },
  { id: 'l-post', h: `  <span class="d">@Post</span>()` },
  { id: 'l-body', h: `  <span class="c">create</span>(<span class="d">@Body</span>() body: { brand: <span class="k">string</span>; model: <span class="k">string</span>; price: <span class="k">number</span> }) {` },
  { id: 'l-body', h: `    <span class="k">return this</span>.carsService.<span class="c">create</span>(body);` },
  { id: 'l-post', h: `  }` },
  { h: `}` },
];
const EXN_ROWS = [
  { at: 1, e: "app.get('/cars', …)", n: '@Get()' },
  { at: 2, e: 'req.params.id', n: "@Param('id') id" },
  { at: 3, e: 'req.body', n: '@Body() body' },
  { at: 3, e: 'app.use(express.json())', n: 'kerak emas — yoqilgan' },
];
const S15 = {
  kicker: '4-bosqich · Controller', title: 'Controller: uch route',
  segments: [
    { id: 'a', key: "<code>@Controller('cars')</code>: hamma metod <b>/cars</b> bilan boshlanadi; konstruktor CarsService so'raydi", text: "Service tayyor: mashinalar ro'yxati va uchta metod. Endi Service'ni so'rovga ulaydigan bo'lakni, Controller'ni yozamiz. cars controller ts. Controller decorator'i, qavsda cars: hamma metod cars path'i bilan boshlanadi. Konstruktor: menga CarsService kerak.", show: "Service tayyor: mashinalar ro'yxati va uchta metod. Endi Service'ni so'rovga ulaydigan bo'lakni — Controller'ni yozamiz. <b>cars.controller.ts</b>. <code>@Controller('cars')</code>: hamma metod /cars bilan boshlanadi. Konstruktor: «menga CarsService kerak».", focus: ['l-ctrl', 'l-ctor'] },
    { id: 'b', key: "Bo'sh <code>@Get()</code> = <b>GET /cars</b> → Service'ning findAll'i chaqiriladi", text: "Get decorator'i bo'sh: GET cars. Metod Service'ning findAll'ini chaqiradi.", show: "<code>@Get()</code> bo'sh: <b>GET /cars</b>. Metod findAll'ni chaqiradi.", focus: ['l-get'] },
    { id: 'c', key: "<code>@Get(':id')</code> = <b>GET /cars/5</b>; <code>@Param('id')</code> — Express'dagi req.params.id, qiymati matn", text: "Get decorator'i ikki nuqta id bilan: cars path'idan keyin raqam, masalan cars besh. Param decorator'i Express'dagi req params id ning o'zi, faqat decorator orqali olinadi. URL'dan kelgan qiymat har doim matn, shuning uchun Number bilan raqamga o'tkazamiz.", show: "<code>@Get(':id')</code>: <b>GET /cars/5</b> kabi path. <code>@Param('id') id</code>: Express'dagi <code>req.params.id</code> ning o'zi, faqat decorator orqali olinadi. URL'dan kelgan qiymat har doim matn, shuning uchun <code>Number</code> bilan raqamga o'tkazamiz.", focus: ['l-getid', 'l-param'] },
    { id: 'd', key: "<code>@Post()</code> = <b>POST /cars</b>; <code>@Body()</code> — req.body, express.json ulash shart emas", text: "Post decorator'i: POST cars. Body decorator'i Express'dagi req body. Nest'da express json ni qo'lda ulash shart emas, u ichida yoqilgan.", show: "<code>@Post()</code>: <b>POST /cars</b>. <code>@Body() body</code>: Express'dagi <code>req.body</code>. Nest'da <code>express.json()</code> ni qo'lda ulash shart emas, u ichida yoqilgan.", focus: ['l-post', 'l-body'] },
    { id: 'e', key: "Xulosa: uch metod bir shaklda — <b>so'rovdan olinadi, Service chaqiriladi, natija qaytariladi</b>", text: "Xulosa: uchala metod ham bir xil shaklda. So'rovdan kerakli qism olinadi, Service metodi chaqiriladi, natija qaytariladi. Controller'da if yo'q, hisob yo'q, baza yo'q. Chapdagi jadval Express'dagi tanish yozuvlarning Nest'dagi o'rnini ko'rsatadi.", focus: [] },
  ],
};
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <Ide files={ALL_FILES} active="src/cars/cars.controller.ts"><CodePanel file="src/cars/cars.controller.ts" lines={CARS_CTRL_LINES} focus={seg.focus} /></Ide>}
    below={({ beat }) => beat >= 1 && <table className="mk-tbl"><thead><tr><th>Express</th><th>Nest</th></tr></thead><tbody>
      {EXN_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.e}</code></td><td><code>{r.n}</code></td></tr>)}
    </tbody></table>} />;
}

// --- Tekshiruv 2: qaysi satr xato (Controller) ---
const LC1_LINES = [
  { h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
  { h: `` },
  { h: `  <span class="d">@Get</span>()` },
  { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.carsService.<span class="c">findAll</span>(); }` },
  { h: `` },
  { h: `  <span class="d">@Get</span>(<span class="s">':id'</span>)` },
  { h: `  <span class="c">findOne</span>(<span class="d">@Param</span>(<span class="s">'id'</span>) id: <span class="k">string</span>) {` },
  { h: `    <span class="k">const</span> car = <span class="k">this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));` },
  { h: `    <span class="k">if</span> (car.price > <span class="d">300</span>) car.price = car.price * <span class="d">0.9</span>;` },
  { h: `    <span class="k">return</span> car;` },
  { h: `  }` },
  { h: `}` },
];
// Topilgach — tuzatilgan holat (F-1030-14): hisob Controller'dan olinadi, Service'ning findOne'iga ko'chadi
// n — tuzatilgan fayldagi haqiqiy satr raqami (o'chgan satr raqamsiz; raqamlar siljimasin — nest-linecheck/TAKLIF.md)
const LC1_FIXED = [
  ...LC1_LINES.slice(0, 9).map((l, i) => ({ ...l, n: i + 1 })),
  { gone: true, n: '', h: LC1_LINES[9].h },
  { gone: true, n: '', h: LC1_LINES[10].h },
  { gone: true, n: '', h: LC1_LINES[11].h },
  { neu: true, n: 10, h: `    <span class="k">return this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));   <span class="cm">// yana bitta satr</span>` },
  ...LC1_LINES.slice(12).map((l, i) => ({ ...l, n: 11 + i })),
];
const LC1_SVC_FIXED = [
  { h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
  { h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
  { h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
  { neu: true, h: `    <span class="k">if</span> (car.price > <span class="d">300</span>) <span class="k">return</span> { ...car, price: car.price * <span class="d">0.9</span> };   <span class="cm">// chegirma — Service'da</span>` },
  { h: `    <span class="k">return</span> car;` },
  { h: `  }` },
];
function ScreenLC1(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 2', 'Проверка 2')} eyebrow={t('Tekshiruv · 2 / 6 — qaysi satr xato?', 'Проверка · 2 / 6 — какая строка с ошибкой?')} title={t("Bu Controller ishlaydi, lekin bitta satr noto'g'ri faylda turibdi", 'Этот Controller работает, но одна строка стоит не в том файле')}
    task={t("Qoida: Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi — <b>hisob qilmaydi</b>. Bu Controller'da bitta satr hisob qilyapti. <b>O'sha satrni bosing.</b>", 'Правило: Controller только берёт из запроса, вызывает Service и возвращает результат — <b>не считает</b>. В этом Controller одна строка считает. <b>Нажмите на эту строку.</b>')}
    q={t("Controller'ni yozdik, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi, hisob qilmaydi. Ekrandagi Controller ishlaydi, lekin bitta satr hisob qilyapti. O'sha satrni bosing.", 'Controller мы написали, теперь проверьте сами. Вторая проверка. Вспомните правило: Controller только берёт из запроса, вызывает Service и возвращает результат, он не считает. Controller на экране работает, но одна строка в нём считает. Нажмите на эту строку.')}
    file="src/cars/cars.controller.ts" lines={LC1_LINES} target={10}
    tree={{ files: ALL_FILES, active: 'src/cars/cars.controller.ts' }}
    fixed={LC1_FIXED.filter((l) => String(l.h).trim() !== '')} fixedExtra={[{ file: 'src/cars/cars.service.ts · findOne', lines: LC1_SVC_FIXED }]}
    ok={t("To'g'ri. O'n birinchi satr narxga chegirma hisoblayapti. Ishlaydi, lekin bu biznes logika, u Service'ga tegishli: Controller'da tursa, uni alohida sinab bo'lmaydi va Telegram bot shu chegirmani ololmaydi. Ekranda tuzatilgan holat ko'rinib turibdi: hisob Service'ning findOne metodiga ko'chdi, Controller'da yana bitta satr qoldi. Demak, Controller'da hisob ko'rsangiz, uni Service'ga ko'chirish kerak.", 'Верно. Одиннадцатая строка считает скидку на цену. Это работает, но это бизнес-логика, и она относится к Service: пока она в Controller, её нельзя протестировать отдельно, и Telegram-бот не получит эту скидку. На экране виден исправленный вариант: расчёт перенесён в метод findOne в Service, а в Controller снова одна строка. Значит, если видите расчёт в Controller, его нужно перенести в Service.')}
    okShort={t("11-satr: chegirma hisobi — biznes logika, u Service'ga tegishli. Tuzatildi: hisob cars.service.ts → findOne'ga ko'chdi, Controller'da yana bitta satr.", 'Строка 11: расчёт скидки — бизнес-логика, она относится к Service. Исправлено: расчёт перенесён в cars.service.ts → findOne, в Controller снова одна строка.')}
    hint={t("Bu satr Controller'ning o'z ishi: so'rovdan olish, Service'ni chaqirish yoki qaytarish. Narxni o'zgartirib, hisob qilayotgan satrni qidiring.", 'Эта строка — собственная работа Controller: взять из запроса, вызвать Service или вернуть. Ищите строку, которая меняет цену, то есть считает.')} />;
}

// --- S16 Terminal va javoblar ---
const REQS = [
  { k: 'r1', m: 'GET', u: '/cars', st: 200, body: `[{"id":1,"brand":"Chevrolet","model":"Malibu","price":250},\n {"id":2,"brand":"Kia","model":"K5","price":320}]` },
  { k: 'r2', m: 'GET', u: '/cars/1', st: 200, body: `{"id":1,"brand":"Chevrolet","model":"Malibu","price":250}` },
  { k: 'r3', m: 'GET', u: '/cars/99', st: 404, body: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` },
  { k: 'r4', m: 'POST', u: '/cars  {brand:"Chevrolet", model:"Cobalt", price:145}', st: 201, body: `{"id":3,"brand":"Chevrolet","model":"Cobalt","price":145}` },
  { k: 'r5', m: 'POST', u: '/cars  {}  (bo\'sh)', st: 201, body: `{"id":4}` },
];
const S16 = {
  kicker: '4-bosqich · ishga tushdi', title: 'Terminal va javoblar', lockHint: "Beshala so'rov tugmasini bosing",
  segments: [
    { id: 'a', key: "Terminalda uchta <b>Mapped</b> satri — uchala route ulangan", text: "Service ham, Controller ham tayyor. Endi eng qiziq joyi: serverni ishga tushirib, haqiqiy so'rov yuboramiz. Server ishga tushdi. Terminalda uchta yangi Mapped satri: cars GET, cars id GET, cars POST. Uchala route ulangan. Endi so'rov yuboramiz.", open: null },
    { id: 'b', key: "<code>GET /cars</code> → <b>200</b>: JSON'ni Nest o'zi yasadi, stringify yozilmadi", text: "GET cars: ikki yuz va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz JSON stringify yozmadik, Nest obyektni o'zi JSON qiladi.", show: "<code>GET /cars</code>: <b>200</b> va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz <code>JSON.stringify</code> yozmadik, Nest obyektni o'zi JSON qiladi.", open: 'r1' },
    { id: 'c', key: "<code>GET /cars/1</code> → <b>200</b> va bitta mashina — Malibu", text: "GET cars bir: ikki yuz va Malibu.", show: "<code>GET /cars/1</code>: <b>200</b> va Malibu.", open: 'r2' },
    { id: 'd', key: "<code>GET /cars/99</code> → <b>404</b>: bizning NotFoundException, Nest xabar bilan qaytardi", text: "GET cars to'qson to'qqiz: to'rt yuz to'rt va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: message, error, statusCode.", show: "<code>GET /cars/99</code>: <b>404</b> va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: <code>message</code>, <code>error</code>, <code>statusCode</code>.", open: 'r3' },
    { id: 'e', key: "<code>POST /cars</code> → <b>201 Created</b> — bu status kodini Nest o'zi qo'ydi", text: "POST cars bilan Cobalt yuboramiz: ikki yuz bir Created va yangi mashina, id uch. E'tibor bering, biz ikki yuz birni yozmadik. Nest POST uchun uni o'zi qo'yadi, Express'da ikki yuz bo'lardi.", show: "<code>POST /cars</code> bilan Cobalt yuboramiz: <b>201 Created</b> va yangi mashina, id 3. Biz 201 yozmadik, Nest POST uchun o'zi qo'yadi; Express'da 200 bo'lardi.", open: 'r4' },
    { id: 'f', key: "Bo'sh <code>POST {}</code> ham <b>201</b> — Nest kiruvchi ma'lumotni <b>o'zi tekshirmaydi</b>", text: "Yana bir sinov: bo'sh POST yuboramiz, ichida hech narsa yo'q. Nest baribir ikki yuz bir qaytaradi va faqat id to'rt bo'lgan mashina yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha.", show: "Bo'sh <code>POST /cars {}</code>: Nest baribir <b>201</b> qaytaradi va faqat <code>{id:4}</code> yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha.", open: 'r5' },
    { id: 'f2', key: "Aytish usuli — <b>DTO + ValidationPipe</b>: bo'sh so'rovga Nest o'zi <b>400</b> qaytaradi", text: "Aytish usuli DTO: alohida klassda brand matn va majburiy, price raqam deb yoziladi, ValidationPipe yoqiladi. Shunda bo'sh so'rovga Nest o'zi to'rt yuz, Bad Request qaytaradi. Bu darsda uni yozmaymiz, lekin o'quvchi so'rasa, javobingiz shu.", show: "Aytish usuli — <b>DTO</b>: alohida klassda <code>brand</code> matn va majburiy, <code>price</code> raqam deb yoziladi, <code>ValidationPipe</code> yoqiladi; bo'sh so'rovga Nest o'zi <b>400 Bad Request</b> qaytaradi: <code>[&quot;brand should not be empty&quot;, …]</code> (sinab ko'rilgan). Bu darsda yozmaymiz — o'quvchi so'rasa, javobingiz shu.", open: 'r5' },
    { id: 'g', key: "Xulosa: JSON, 201 va 404 xabarini <b>Nest o'zi qiladi</b> — beshala tugmani bosib ko'ring", text: "Xulosa: Nest JSON'ni, POST uchun ikki yuz birni va xato xabarini o'zi qiladi, kiruvchi ma'lumotni tekshirishni esa siz aytmaguncha qilmaydi. Endi beshala tugmani o'zingiz bosib, har javobni o'qing. Davom besh tugmadan keyin ochiladi.", open: null },
  ],
};
function Screen16(p) {
  const [open, setOpen] = useState(null);
  const [clicked, setClicked] = useState([]);
  return <Lesson p={p} S={S16} ready={() => clicked.length >= REQS.length} scene={({ seg, beat }) => {
    const cur = REQS.find((r) => r.k === (open || seg.open));
    return (<>
      <CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [RoutesResolver] CarsController {/cars}:` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars/:id, GET} route</span>` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, POST} route</span>` },
        { h: `[Nest] LOG [NestApplication] Nest application successfully started` }]} />
      <Block at={1} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("So'rov yuborish — bosing", 'Отправить запрос — нажмите')}</div>
        <div className="mk-req">
          {REQS.map((r) => <button key={r.k} className={(open || seg.open) === r.k ? 'hl' : ''} onClick={() => { setOpen(r.k); setClicked((c) => c.includes(r.k) ? c : [...c, r.k]); }}><span className={`st s${String(r.st)[0]}`}>{r.st}</span><span>{r.m} {r.u}</span></button>)}
        </div>
        {cur && <pre key={cur.k} style={{ animation: 'mk-up .3s ease both' }}>{cur.body}</pre>}
      </div></Block>
    </>);
  }} />;
}

// --- S17 Tekshiruv 3 — o'ylab ko'ring ---
function Screen17(p) {
  return <MCRetry {...p} kicker={t('Tekshiruv 3', 'Проверка 3')} eyebrow={t("Tekshiruv · 3 / 6 — o'ylab ko'ring", 'Проверка · 3 / 6 — подумайте')}
    title={t("Kodimiz hozirgi holatda. GET /cars/abc so'rovi kelsa, javob qanday bo'ladi?", 'Код в текущем виде. Пришёл запрос GET /cars/abc — каким будет ответ?')}
    q={t("Javoblarni ko'rdik. Endi bir qadam oldinga o'ylaymiz. Uchinchi tekshiruv, o'ylab ko'ring. Kimdir cars path'idan keyin abc deb yubordi. Kodimiz hozirgi holatda. Javob qanday bo'ladi?", 'Ответы мы увидели. Теперь подумаем на шаг вперёд. Третья проверка, подумайте. Кто-то отправил abc после пути cars. Код в текущем виде. Каким будет ответ?')}
    opts={t(["200 va bo'sh obyekt — mashina yo'q", "500 Internal server error — Service yiqildi", '404 va «Car with id NaN not found»', '400 Bad Request — id son emas'], ['200 и пустой объект — машины нет', '500 Internal server error — Service упал', '404 и «Car with id NaN not found»', '400 Bad Request — id не число'])} correct={2}
    ok={t("To'g'ri: to'rt yuz to'rt va Car with id NaN not found. Number abc natijasi NaN, bunday id'li mashina yo'q, shuning uchun findOne NotFoundException tashlaydi. Ishlaydi, lekin foydalanuvchi NaN so'zini ko'rmasligi kerak. Id ParseIntPipe bilan olinsa, abc kelganda Nest o'zi to'rt yuz, Bad Request qaytaradi. Demak, Nest kiruvchi ma'lumotni siz pipe bilan aytmaguncha tekshirmaydi.", 'Верно: 404 и Car with id NaN not found. Number от abc даёт NaN, машины с таким id нет, поэтому findOne бросает NotFoundException. Это работает, но пользователь не должен видеть слово NaN. Если брать id через ParseIntPipe, то при abc Nest сам вернёт 400, Bad Request. Значит, Nest не проверяет входящие данные, пока вы не скажете ему это через pipe.')}
    okShort={t("404, «Car with id NaN not found»: Number('abc') = NaN → findOne topmaydi → NotFoundException. Tekshiruv yo'q; @Param('id', ParseIntPipe) yozilsa — 400 «Validation failed (numeric string is expected)» (sinab ko'rilgan).", "404, «Car with id NaN not found»: Number('abc') = NaN → findOne не находит → NotFoundException. Проверки нет; если написать @Param('id', ParseIntPipe) — 400 «Validation failed (numeric string is expected)» (проверено).")}
    wrong={t({ 0: "find hech narsa topmasa undefined qaytaradi, bizning kod esa bu holatda xato tashlaydi.", 1: "Besh yuz faqat biz kutmagan xato bo'lganda chiqadi; bu yerda xatoni o'zimiz NotFoundException bilan tashladik.", 3: "To'rt yuzni hech kim qaytarmaydi, chunki tekshiruv yozilmagan." }, { 0: 'Если find ничего не находит, он возвращает undefined, а наш код в этом случае бросает ошибку.', 1: '500 появляется только при ошибке, которую мы не ожидали; здесь ошибку мы бросили сами через NotFoundException.', 3: '400 никто не возвращает, потому что проверка не написана.' })} />;
}

// --- Amaliyot 2: cars modulini quring ---
const P2 = {
  kicker: 'Amaliyot 3 / 4', eyebrow: "Hozir o'zingizda · 10–15 daqiqa", title: 'cars modulini quring', tableAt: 5,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: cars modulini o'z loyihangizda to'rt qadamda qurasiz", text: "Yana navbat sizga. Hozirgina ko'rgan cars modulini o'z loyihangizda qurasiz: to'rt qadam, o'n-o'n besh daqiqa.", hl: [] },
    { id: 'b', key: "1-qadam: uch CLI buyrug'i — terminalda <b>3 CREATE, 3 UPDATE</b> chiqsin", text: "Birinchi: uch buyruq bilan modul, controller va service yarating. Terminalda uchta CREATE va uchta UPDATE chiqishi kerak.", hl: [0] },
    { id: 'c', key: "2-qadam: Service kodini <b>nusxalang</b> — qadam ichidagi «Kodni ochish» tugmasida", text: "Ikkinchi: Service'ni darsdagi kod bilan to'ldiring. Ikkinchi qadam ichida Kodni ochish tugmasi bor, kod o'sha yerda, nusxalab qo'ying.", hl: [1] },
    { id: 'd', key: "3-qadam: Controller'ni <b>o'zingiz yozing</b> — namunani ko'rasiz, lekin nusxalanmaydi", text: "Uchinchi: Controller'ni o'zingiz yozing, yigirma qator. Namuna uchinchi qadam ichidagi Kodni ochish tugmasida ko'rinadi, lekin nusxalanmaydi, ataylab. Decorator va konstruktorni qo'lingiz his qilsin. Terminalda uchta Mapped satri chiqsin.", hl: [2] },
    { id: 'e', key: "4-qadam: to'rtta so'rov — javoblar <b>200 · 200 · 404 · 201</b> bo'lsin", text: "To'rtinchi: brauzer, Postman yoki Thunder Client bilan to'rtta so'rovni yuboring va javoblarni darsdagi bilan solishtiring: ikki yuz, ikki yuz, to'rt yuz to'rt, ikki yuz bir. cars to'qson to'qqiz javobidagi xabarni isbot maydoniga yozing.", hl: [3] },
    { id: 'f', key: "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi", text: "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda o'zingiz qurgan cars moduli bor va u so'rovlarga javob beradi.", hl: [] },
  ],
};
const P2_STEPS = [
  { t: 'cars moduli', cmds: ['nest g module cars', 'nest g controller cars --no-spec', 'nest g service cars --no-spec'], exp: '3 CREATE, 3 UPDATE' },
  { t: 'Service — nusxalang', cmds: [], exp: "cars.service.ts — «Kodni ochish» → «nusxalash», faylga qo'ying" },
  { t: "Controller — o'zingiz yozing", cmds: [], exp: "cars.controller.ts — 20 qator, namunani «Kodni ochish»da ko'ring (nusxalanmaydi) · terminalda 3 ta Mapped {/cars…}" },
  { t: "So'rovlar", cmds: [], exp: 'GET /cars · /cars/1 · /cars/99 · POST /cars → 200 · 200 · 404 · 201' },
];
const P2_PROOF = { label: 'Isbot: GET /cars/99 javobidagi message maydoni', placeholder: "javobdagi message matnini yozing", check: (v) => /not found/i.test(v) && /99/.test(v), wrong: 'Kutilgan: Car with id 99 not found — javobdagi message qiymatini aynan yozing' };
const P2_TROUBLE = [
  ['Qizil TypeScript xatosi (fayl:satr)', "Nusxalashda satr tushib qolgan: ko'rsatilgan satrni «Kodni ochish»dagi kod bilan solishtiring"],
  ['Cannot GET /cars', "Terminalda Mapped {/cars…} bormi? Yo'q bo'lsa app.module.ts → imports: [CarsModule]"],
  ['POST da body undefined', "Postman yoki Thunder Client'da Body → JSON tanlanganmi? Content-Type: application/json"],
  ["error TS2307: Cannot find module './cars.service'", "Loyiha ESM turida yaratilgan: cars-api papkasini o'chiring, 1-amaliyotning 3-qadamidagi buyruqni to'liq nusxalab qayta yarating va cars modulini qaytadan quring"],
];
// F-1031-04: «Kodni ochish» oynasida butun cars-api ko'rinadi; faqat amaliyot fayllari bosiladi
const P2_TREE = ['dist/', 'node_modules/', ...ALL_FILES, 'test/', 'package.json'];
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} tree={P2_TREE} code={[{ file: 'src/cars/cars.service.ts', lines: CARS_SVC_LINES, step: 1 }, { file: 'src/cars/cars.controller.ts', lines: CARS_CTRL_LINES, copy: false, step: 2 }]} />; }
// ============================================================
//  6-bosqich · AI yozgan kod (F-1125-01, 3-ish; foydalanuvchi 25.11: AI bloki «A — avval Nest-1», resurs customers)
//  HAQIQIY AI yurgizishi — Claude Haiku ×2, har biri o'z nusxasida (darsning 3-amaliyotdan keyingi cars-api, Nest 12):
//  feedback/F-1125-01-nest1-kuchaytirish/ai-nest1/ — 00-promptlar.md · A2-oddiy/ · B2-nest/ · *-tuzatilgan/ · XULOSA.md
//  Raqam va xabarlar o'sha papkadagi 04-sorovlar.txt va 03-start.log dan (M10); o'ylab topilmagan.
// ============================================================
const AI_FILES = [...ALL_FILES, 'src/customers/customers.module.ts', 'src/customers/customers.controller.ts', 'src/customers/customers.service.ts'];
// AI'ga berilgan topshiriq o'zbekcha edi — ruscha darsda ham aynan shu matn ko'rsatiladi (tarjima qilinmaydi)
const AI_PROMPT_A = "Loyihamga mijozlar bo'limini qo'shib ber. Mashinani ijaraga oladigan mijozlar ro'yxatini ko'rish, bittasini id bo'yicha olish va yangi mijoz qo'shish kerak. Mijozda ism, telefon va yosh bo'lsin. Yoshi 18 dan kichik bo'lsa, qo'shmasin.";
const AI_PROMPT_B = ["NestJS'da customers moduli yarat.", 'CLI bilan: module · controller --no-spec · service --no-spec', "Service: findAll, findOne (NotFoundException), create; yosh < 18 → BadRequestException, tekshiruv Service'da", "Controller: GET, GET :id (ParseIntPipe), POST — faqat Service'ni chaqiradi", "Module ro'yxatlarda, AppModule imports'ida; npm run build xatosiz"];
const AI_LOG = [
  { h: `<span class="p">$</span> npm run start:dev` },
  { h: `[Nest] LOG [InstanceLoader] <span class="ok">CustomersModule dependencies initialized</span>` },
  { h: `[Nest] LOG [RoutesResolver] CustomersController {/customers}:` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/customers, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/customers/:id, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/customers, POST} route</span>` },
  { h: `[Nest] LOG [NestApplication] Nest application successfully started` },
];
// [so'rov, A natijasi, B natijasi]; bad — kutilganidan boshqacha (qizil)
const AI_REQ_OK = [
  ['GET /customers', { st: 200 }, { st: 200 }],
  ['GET /customers/99', { st: 404 }, { st: 404 }],
  ['POST /customers · age 15', { st: 400 }, { st: 400 }],
  ['GET /customers/abc', { st: 404, n: '«Customer with id NaN not found»', bad: true }, { st: 400, n: '«Validation failed»' }],
];
const AI_REQ_ODD = [
  ['POST /customers {}', { st: 400, n: '«name is required»' }, { st: 201, n: '{"id":4}', bad: true }],
  ['POST /customers {"id":1, …}', { st: 201, n: 'id 4' }, { st: 201, n: 'id 1', bad: true, dup: true }],
];
function AiCell({ c }) {
  return <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0, padding: '6px 10px', borderRadius: 8, border: `1px solid ${c.bad ? T.accent : T.line}`, background: c.bad ? '#FFF0EB' : T.paper }}>
    <span className={`st s${String(c.st)[0]}`}>{c.st}</span>
    {c.n && <span style={{ font: `12.5px/1.35 ${MONO}`, color: c.bad ? T.accent : T.ink2, overflowWrap: 'anywhere' }}>{c.n}{c.dup ? t(' — takror', ' — повтор') : ''}</span>}
  </div>;
}
function AiRows({ rows }) {
  return rows.map(([q, a, b]) => <div key={q} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
    <code style={{ font: `12.5px/1.35 ${MONO}`, overflowWrap: 'anywhere' }}>{q}</code><AiCell c={a} /><AiCell c={b} />
  </div>);
}
const S_AI = {
  kicker: '6-bosqich · AI yozgan kod', title: 'AI yozgan customers moduli: ikki topshiriq, ikki natija',
  segments: [
    { id: 'a', key: "AI'ga <b>customers</b> modulini yozdirdik: bir xil AI, <b>ikki xil topshiriq</b>", text: "Hozir kodning ko'pini AI yozadi, sizning ishingiz uni tekshirish. Biz cars api loyihasiga ijarachilar, ya'ni customers modulini AI'ga yozdirdik. AI bitta, Claude Haiku, topshiriq ikki xil: chapdagisi oddiy so'zlar bilan, o'ngdagisi Nest tilida. Ikkalasida bitta qoida bor: yoshi o'n sakkizdan kichik bo'lsa, qo'shmasin.", show: "Hozir kodning ko'pini AI yozadi, sizning ishingiz uni tekshirish. Biz <code>cars-api</code> loyihasiga ijarachilar, ya'ni <b>customers</b> modulini AI'ga yozdirdik. AI bitta, Claude Haiku, topshiriq ikki xil: chapdagisi oddiy so'zlar bilan, o'ngdagisi Nest tilida. Ikkalasida bitta qoida bor: yoshi 18 dan kichik bo'lsa, qo'shmasin." },
    { id: 'b', key: "1-tekshiruv — <b>tuzilish</b>: to'rt savol, ikkala AI ham o'tdi", text: "Birinchi tekshiruv tuzilish, bugungi darsning to'rt savoli. Fayllar: module, controller, service bormi. Ro'yxatlar: Service providers'da, modul AppModule imports'idami, terminalda customers uchun uchta Mapped satri chiqdimi. Logika: yosh qoidasi Service'dami. Decorator'lar joyidami. Ikkala AI ham to'rttala savoldan o'tdi." },
    { id: 'c', key: "2-tekshiruv — <b>so'rov</b>: <code>/customers/abc</code> da A <b>404 «NaN»</b> qaytardi", text: "Ikkinchi tekshiruv so'rov bilan. Ro'yxat, to'qson to'qqiz va o'n besh yoshli mijoz ikkalasida to'g'ri. Lekin customers abc so'rovida A to'rt yuz to'rt va NaN qaytardi: unda ParseIntPipe yo'q, id Number bilan olingan, yigirma birinchi ekrandagi holatning o'zi. B da ParseIntPipe bor, chunki topshiriqda so'ralgan edi.", show: "Ikkinchi tekshiruv so'rov bilan. Ro'yxat, <code>/customers/99</code> va 15 yoshli mijoz ikkalasida to'g'ri. Lekin <code>/customers/abc</code> so'rovida A <b>404</b> va «NaN» qaytardi: unda <code>ParseIntPipe</code> yo'q, id <code>Number</code> bilan olingan, 21-ekrandagi holatning o'zi. B da <code>ParseIntPipe</code> bor, chunki topshiriqda so'ralgan edi." },
    { id: 'd', key: "Kutilmagan so'rov: <b>bo'sh POST</b> va body'da <b>id: 1</b> — B da ikkalasi o'tib ketdi", text: "Endi kutilmagan ikki so'rov: bo'sh POST va body ichida id bir. A ikkalasini to'xtatdi: bo'sh POST'ga to'rt yuz, body'dagi id'ga e'tibor bermadi. B esa bo'sh mijoz yaratdi va ro'yxatda ikkinchi id bir paydo bo'ldi. Endi customers bir so'rovi eskisini qaytaradi, yangisi esa takror id bilan yotadi.", show: "Endi kutilmagan ikki so'rov: bo'sh <code>POST {}</code> va body ichida <code>\"id\": 1</code>. A ikkalasini to'xtatdi: bo'sh POST'ga <b>400</b>, body'dagi id'ga e'tibor bermadi. B esa bo'sh mijoz yaratdi va ro'yxatda <b>ikkinchi id: 1</b> paydo bo'ldi. Endi <code>/customers/1</code> eskisini qaytaradi, yangisi esa takror id bilan yotadi." },
    { id: 'e', key: "Xulosa: har AI <b>topshiriqda yozilmaganini</b> o'tkazib yubordi — <b>4 savol va 3 so'rov</b> bilan tekshiring", text: "Xulosa. Har AI topshiriqda yozilmagan narsani o'tkazib yubordi: oddiy topshiriq Nest'ga xos ParseIntPipe'ni, Nest topshirig'i kiruvchi ma'lumot tekshiruvini. Bu bitta sinov, boshqa AI boshqacha yozadi. Demak, AI kodini to'rt savol bilan o'qing va uchta kutilmagan so'rov yuboring: harfli id, bo'sh body va begona maydon." },
  ],
};
function ScreenAI6(p) {
  return <Lesson p={p} S={S_AI} scene={({ beat }) => (<>
    {beat === 0 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("A · oddiy topshiriq", 'A · простое задание (дано на узбекском)')}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>«{AI_PROMPT_A}»</div>
      </div>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t('B · Nest tilidagi topshiriq', 'B · задание на языке Nest (дано на узбекском)')}</div>
        <div style={{ display: 'grid', gap: 4, fontSize: 14, lineHeight: 1.45 }}>{AI_PROMPT_B.map((x, i) => <div key={i}>{i ? '· ' : ''}{x}</div>)}</div>
      </div>
    </div>}
    {beat === 1 && <>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("1-tekshiruv · tuzilish — to'rt savol", 'Проверка 1 · структура — четыре вопроса')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 14px', alignItems: 'center', fontSize: 14 }}>
          <span /><b>A</b><b>B</b>
          {[t('Fayllar: module · controller · service', 'Файлы: module · controller · service'), t("Ro'yxatlar: providers · AppModule imports · 3 ta Mapped", 'Списки: providers · imports в AppModule · 3 строки Mapped'), t("Logika: yosh qoidasi Service'da", 'Логика: правило возраста в Service'), t("Decorator'lar: @Controller · @Injectable · @Get / @Post", 'Decorator: @Controller · @Injectable · @Get / @Post')].map((x) => [<span key={x}>{x}</span>, <span key={x + 'a'} style={{ color: T.green, fontWeight: 700 }}>✓</span>, <span key={x + 'b'} style={{ color: T.green, fontWeight: 700 }}>✓</span>])}
        </div>
      </div>
      <CodePanel file={t('VS Code terminali · cars-api (B)', 'Терминал VS Code · cars-api (B)')} numbers={false} wrap style={{ background: '#111827' }} lines={AI_LOG} />
    </>}
    {beat >= 2 && <div className="mk-light mk-req" style={{ padding: 14, display: 'grid', gap: 8 }}>
      <div className="mk-tag">{t("2-tekshiruv · so'rov — haqiqiy javoblar", 'Проверка 2 · запросы — настоящие ответы')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 8, fontSize: 13, color: T.ink3, fontWeight: 600 }}><span>{t("So'rov", 'Запрос')}</span><span>{t('A · oddiy', 'A · простое')}</span><span>{t('B · Nest tilida', 'B · на языке Nest')}</span></div>
      <AiRows rows={AI_REQ_OK} />
      {beat >= 3 && <>
        <div className="mk-tag" style={{ marginTop: 6 }}>{t("Kutilmagan so'rovlar", 'Неожиданные запросы')}</div>
        <AiRows rows={AI_REQ_ODD} />
      </>}
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>AI kodini tekshirish:</b> 4 savol — fayllar · ro'yxatlar · logika Service'da · decorator'lar; 3 kutilmagan so'rov — harfli id (<code>/abc</code>) · bo'sh body (<code>{'{}'}</code>) · begona maydon (<code>"id": 1</code>).</>, <><b>Проверка кода от ИИ:</b> 4 вопроса — файлы · списки · логика в Service · decorator; 3 неожиданных запроса — id из букв (<code>/abc</code>) · пустой body (<code>{'{}'}</code>) · чужое поле (<code>"id": 1</code>).</>)}</div></Block>
  </>)} />;
}

// --- Tekshiruv 6: AI (B) yozgan create() — takror id. Haqiqiy kod: ai-nest1/B2-nest/01-diff.txt, 32–39-satr ---
const LCAI_LINES = [
  { n: 32, h: `  <span class="c">create</span>(data: <span class="c">CreateCustomerData</span>): <span class="c">Customer</span> {` },
  { n: 33, h: `    <span class="k">if</span> (data.age < <span class="d">18</span>) {` },
  { n: 34, h: `      <span class="k">throw new</span> <span class="c">BadRequestException</span>(<span class="s">'Customer must be at least 18 years old'</span>);` },
  { n: 35, h: `    }` },
  { n: 36, h: `    <span class="k">const</span> customer: <span class="c">Customer</span> = { id: <span class="k">this</span>.nextId++, ...data };` },
  { n: 37, h: `    <span class="k">this</span>.customers.<span class="c">push</span>(customer);` },
  { n: 38, h: `    <span class="k">return</span> customer;` },
  { n: 39, h: `  }` },
];
// Tuzatilgan holat — ai-nest1/B2-nest-tuzatilgan (haqiqiy yurgizish): id oxirida, body'dagi id e'tiborga olinmaydi.
// Natija qatorlari 04-sorovlar.txt dan qisqartirilgan («…» — qolgan maydonlar), id va status o'zgarmagan.
const LCAI_FIXED = [
  ...LCAI_LINES.slice(0, 4),
  { gone: true, n: '', h: LCAI_LINES[4].h },
  { neu: true, n: 36, h: `    <span class="k">const</span> customer: <span class="c">Customer</span> = { ...data, id: <span class="k">this</span>.nextId++ };` },
  ...LCAI_LINES.slice(5),
];
const LCAI_RUN = [
  { h: `<span class="p">POST /customers</span> {"id":1,"name":"Soxta",…}` },
  { h: `→ <span class="ok">201</span> {"id":5,"name":"Soxta",…}` },
  { h: `<span class="p">GET /customers/1</span> → <span class="ok">200</span> {"id":1,"name":"Ali",…}` },
];
function ScreenLCAI(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 6', 'Проверка 6')} eyebrow={t('Tekshiruv · 6 / 6 — qaysi satr xato?', 'Проверка · 6 / 6 — какая строка с ошибкой?')} title={t("AI yozgan create(): qaysi satr takror id'ga sabab?", 'create() от ИИ: какая строка даёт повторный id?')}
    task={t('Qoida: yangi yozuvning id\'sini <b>server beradi</b>, so\'rovdan kelgan id qabul qilinmaydi. Body\'da <code>"id": 1</code> yuborilganda ro\'yxatda ikkinchi <code>id: 1</code> paydo bo\'ldi. <b>Aybdor satrni bosing.</b>', 'Правило: id новой записи <b>выдаёт сервер</b>, id из запроса не принимается. Когда в body отправили <code>"id": 1</code>, в списке появился второй <code>id: 1</code>. <b>Нажмите на виноватую строку.</b>')}
    q={t("Oltinchi, oxirgi tekshiruv. Bu B yozgan create metodi, customers papkasidagi customers service ts faylida. Body ichida id bir yuborilganda, ro'yxatda ikkinchi id bir paydo bo'ldi. Qoida: yangi yozuvning id'sini server beradi, so'rovdan kelgan id qabul qilinmaydi. Qaysi satr so'rovdagi id'ni o'tkazib yuboryapti? O'sha satrni bosing.", 'Шестая, последняя проверка. Это метод create, который написал B, в файле customers service ts в папке customers. Когда в body отправили id один, в списке появился второй id один. Правило: id новой записи выдаёт сервер, id из запроса не принимается. Какая строка пропускает id из запроса? Нажмите на эту строку.')}
    file={t('src/customers/customers.service.ts · create() — B yozgan', 'src/customers/customers.service.ts · create() — написал B')} lines={LCAI_LINES} target={4}
    tree={{ files: AI_FILES, active: 'src/customers/customers.service.ts' }}
    fixed={LCAI_FIXED} fixedExtra={[{ file: t('terminal — tuzatilgandan keyin (haqiqiy)', 'terminal — после исправления (настоящий)'), lines: LCAI_RUN }]}
    ok={t("To'g'ri. O'ttiz oltinchi satrda avval server bergan id yoziladi, keyin data'ning hamma maydoni ustidan yoziladi, body'dagi id ham. Tuzatish: id'ni oxiriga qo'yish. Tuzatilgan kodda id bir yuborilsa ham yangi mijoz besh raqamini oldi. Bo'sh POST'ni esa DTO va ValidationPipe yopadi. Demak, AI kodida uch nuqta bilan yoyishni ko'rsangiz, tartibiga qarang.", 'Верно. В тридцать шестой строке сначала записывается id от сервера, а потом поверх него все поля data, в том числе id из body. Исправление: поставить id в конец. В исправленном коде, даже если отправить id один, новый клиент получил номер пять. А пустой POST закрывают DTO и ValidationPipe. Значит, если в коде от ИИ видите разворот через три точки, смотрите на порядок.')}
    okShort={t("36-satr: { id: …, ...data } — body'dagi id server bergan id ustidan yoziladi. Tuzatildi: { ...data, id: this.nextId++ } → yangi mijoz id 5 (sinab ko'rilgan).", 'Строка 36: { id: …, ...data } — id из body записывается поверх id от сервера. Исправлено: { ...data, id: this.nextId++ } → новый клиент id 5 (проверено).')}
    hint={t("Bu satr yoshni tekshiradi, ro'yxatga qo'shadi yoki natijani qaytaradi. Yangi mijoz obyekti yig'ilayotgan satrni qidiring.", 'Эта строка проверяет возраст, добавляет в список или возвращает результат. Ищите строку, где собирается объект нового клиента.')} />;
}

// ============================================================
//  5-BOSQICH · S18–S23, LineCheck 2, Amaliyot 3
// ============================================================
const MODULE_BROKEN = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { gone: true, h: `  providers: [<span class="c">CarsService</span>]` },
  { neu: true, h: `  providers: []` },
  { h: `})` },
];
const ERR1 = [
  { at: 1, id: 'e-who', h: `ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class="er">CarsController (?)</span>.` },
  { at: 2, id: 'e-what', h: `Please make sure that the argument <span class="er">CarsService at index [0]</span> is available` },
  { at: 3, id: 'e-where', h: `in the <span class="er">CarsModule</span> module.` },
  { at: 4, h: `` },
  { at: 4, id: 'e-solutions', h: `Potential solutions:` },
  { at: 4, id: 'e-solutions', h: `- Is CarsModule a valid NestJS module?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is a provider, is it part of the current CarsModule?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is exported from a separate @Module, is that module imported within CarsModule?` },
];
// F-1120-02: buzishdan oldingi butun holat — CarsService bosiladi (data-act)
const MODULE_OK = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { h: `  providers: [<span class="c n1-act" data-act="1">CarsService</span>]` },
  { h: `})` },
];
// Tuzatilgan holat va muvaffaqiyatli terminal — har «Buzamiz» ekrani tuzatish bilan tugaydi (MENTOR_DARS_ETALON 3-qonun, F-1030-13)
const MODULE_FIXED = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { gone: true, h: `  providers: []` },
  { neu: true, h: `  providers: [<span class="c">CarsService</span>]` },
  { h: `})` },
];
const OK_CARS = [
  { h: `[Nest] LOG [RoutesResolver] CarsController {/cars}:` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars/:id, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, POST} route</span>` },
  { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
];
const S18 = {
  kicker: '5-bosqich · buzamiz 1', title: "Buzamiz 1: providers bo'sh",
  segments: [
    // F-1120-02: mentor o'zi buzadi — kodda yonib turgan so'zni bosadi (act); keyingi segment buzilgan holatdan boshlanadi
    { id: 'x', key: "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>CarsService</code> ustiga bosing", text: "Ishlaydigan modulimiz bor. Endi uni ataylab buzamiz, chunki o'quvchilaringiz aynan shu xatolarni qiladi, siz esa ularni o'qiy olishingiz kerak. Bu safar buzishni o'zingiz qilasiz: o'ngdagi kodda CarsService so'zi yonib turibdi, ustiga bosing.", act: "O'ngdagi kodda yonib turgan <b>CarsService</b> ustiga bosing — u providers ro'yxatidan o'chadi.", focus: [] },
    { id: 'a', key: "Ataylab buzamiz: <code>cars.module.ts</code>'da <b>providers bo'sh</b> qoldi", text: "Birinchi holat: cars module da providers ro'yxatidan CarsService'ni o'chirdingiz, ro'yxat bo'sh qoldi.", focus: [] },
    { id: 'b', key: "Server yiqildi. 1-bo'lak — <b>qaysi klass?</b> CarsController; <code>(?)</code> — topilmagan dependency o'rni", text: "Serverni ishga tushiramiz, u yiqiladi. Xabarni uch bo'lakka bo'lib o'qiymiz. Birinchi bo'lak, qaysi klass: Nest CarsController'ning dependency'larini topa olmadi. Qavsdagi so'roq belgisi topilmagan dependency'ning o'rni.", show: "Serverni ishga tushiramiz, u yiqiladi. Xabarni uch bo'lakka bo'lib o'qiymiz. 1 · <b>qaysi klass</b>: <b>Nest can't resolve dependencies of the CarsController</b> — Nest CarsController'ning dependency'larini topa olmadi. Qavsdagi <b>(?)</b> — topilmagan dependency'ning o'rni.", focus: ['e-who'] },
    { id: 'c', key: "2-bo'lak — <b>qaysi dependency yetishmayapti?</b> CarsService, konstruktordagi 0-argument", text: "Ikkinchi bo'lak, qaysi dependency yetishmayapti: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService.", show: "2 · <b>qaysi dependency</b>: <b>argument CarsService at index [0] is available</b> — nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService.", focus: ['e-what'] },
    { id: 'd', key: "3-bo'lak — <b>qaysi fayl?</b> CarsModule, ya'ni <code>cars.module.ts</code>", text: "Uchinchi bo'lak, qaysi faylni ochamiz: Nest CarsModule'da qidirdi va topmadi, demak cars module ts fayli. Mana, uch savolga javob bor: qaysi klass, qaysi dependency, qaysi fayl.", show: "3 · <b>qaysi fayl</b>: <b>in the CarsModule module</b> — Nest CarsModule'da qidirdi va topmadi, demak <code>cars.module.ts</code>. Uch savolga javob bor: <b>qaysi klass · qaysi dependency · qaysi fayl</b>.", focus: ['e-where'] },
    { id: 'e', key: "Pastda Nest <b>yechimni o'zi taklif qiladi</b>: CarsService shu modulda bormi?", text: "Pastda Nest o'zi yechimlarni sanaydi. Ikkinchisi bizning holat: CarsService provider bo'lsa, u shu modulda bormi? Yo'q, biz uni o'chirganmiz.", focus: ['e-solutions'] },
    { id: 'f', key: "Tuzatamiz: <code>providers: [CarsService]</code> qaytdi — server <b>ishga tushdi</b>", text: "Tuzatamiz: cars module ts faylini ochib, providers ro'yxatiga CarsService'ni qaytaramiz va saqlaymiz. start dev serverni o'zi qayta yuklaydi: terminalda Mapped satrlari va successfully started.", focus: [] },
    { id: 'g', key: "Xulosa: «can't resolve dependencies» ko'rsangiz — <b>modul faylini oching</b>, providers'ni tekshiring", text: "Xulosa: bu Nest'dagi eng ko'p uchraydigan xato. Xabarni uch savol bilan o'qiysiz: qaysi klass, qaysi dependency, qaysi fayl. Javob esa doim modul faylida: yetishmayotgan Service providers ro'yxatiga yoziladi.", focus: [] },
  ],
};
function Screen18(p) {
  return <Lesson p={p} S={S18} sceneTop scene={(b) => <Scene18 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2–4 xatoning 3 bo'lagi · 5 yechimlar · 6 tuzatildi · 7 xulosa
function Scene18({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const fixed = beat >= 6;
  const pin = beat === 2 ? 1 : beat === 3 ? 2 : beat === 4 ? 3 : 0;
  return (
    <Ide files={ALL_FILES} active="src/cars/cars.module.ts">
      <div onClick={act.onClick}><CodePanel key={fixed ? 'f' : broken ? 'b' : 'o'} file="src/cars/cars.module.ts" numbers={false} lines={fixed ? MODULE_FIXED : broken ? MODULE_BROKEN : MODULE_OK} style={{ opacity: beat >= 2 && beat <= 5 ? 0.5 : 1, transition: 'opacity .4s' }} /></div>
      <MiniProviders broken={broken} fixed={fixed} pin={pin} known={!broken || beat >= 2} />
      {fixed
        ? <CodePanel file={t('terminal — tuzatildi, server ishga tushdi', 'terminal — исправлено, сервер запустился')} numbers={false} wrap style={{ background: '#111827' }} lines={OK_CARS} />
        : <Block at={2} beat={beat}><CodePanel file={t('terminal — server yiqildi', 'terminal — сервер упал')} numbers={false} wrap style={{ background: '#1F1115' }} beat={beat - 1} lines={ERR1} focus={seg.focus} marks={{ 0: 'n1-p1', 1: 'n1-p2', 2: 'n1-p3' }} /></Block>}
      <Block at={7} beat={beat}><div className="mk-rule">{t(<><b>Qaysi klass · qaysi dependency · qaysi fayl.</b> «can't resolve dependencies» ko'rsangiz — modul faylini oching, <code>providers</code>'ni tekshiring.</>, <><b>Какой класс · какой dependency · какой файл.</b> Видите «can't resolve dependencies» — откройте файл модуля, проверьте <code>providers</code>.</>)}</div></Block>
    </Ide>
  );
}

// --- S19 yashirin xato (+ o'ylab ko'ring) ---
const S19 = {
  kicker: '5-bosqich · buzamiz 2', title: "Buzamiz 2: imports'da CarsModule yo'q",
  segments: [
    { id: 'x', key: "Yana <b>o'zingiz buzasiz</b>: <code>imports</code> ro'yxatidagi <code>CarsModule</code> ustiga bosing", text: "Birinchi xatoni o'qidik va tuzatdik. Ikkinchi holat boshqacha: bu safar server yiqilmaydi, va aynan shuning uchun xavfli. Buzishni yana o'zingiz qilasiz: app module faylida imports ro'yxatidagi CarsModule so'zi yonib turibdi, ustiga bosing.", act: "<b>app.module.ts</b>'dagi <b>CarsModule</b> ustiga bosing — u imports ro'yxatidan o'chadi." },
    { id: 'a', key: "Ataylab buzamiz: <code>app.module.ts</code>'ning <code>imports</code>'idan CarsModule olindi", text: "CarsModule imports ro'yxatidan olib tashlandi, ro'yxat bo'sh qoldi." },
    { id: 'b', key: "O'ylab ko'ring: server <b>xato bilan yiqiladimi</b> yoki ishga tushadimi?", text: "O'ylab ko'ring: serverni ishga tushirsak, xato chiqib yiqiladimi, yoki ishga tushadimi?", ask: { q: 'Server nima qiladi?', opts: ['Xato bilan yiqiladi', 'Ishga tushadi'], answer: 1 } },
    { id: 'c', key: "Server <b>ishga tushdi</b> — «successfully started», xato yo'q", text: "Server ishga tushdi, muvaffaqiyatli deb yozdi, hamma narsa yaxshidek. Xato yo'q." },
    { id: 'd', key: "Lekin <code>/cars</code> → <b>404</b>, root path esa ishlaydi", text: "Lekin cars route'ini so'rasak, to'rt yuz to'rt, Cannot GET cars. Root path esa ishlaydi.", show: "Lekin <code>/cars</code> so'rasak, <b>404, Cannot GET /cars</b>. <code>/</code> esa ishlaydi." },
    { id: 'e', key: "AppModule CarsModule'ni ulamadi — Nest cars papkasini <b>umuman o'qimadi</b>. Bu yashirin xato", text: "Nima bo'ldi? AppModule CarsModule'ni ulamadi, shuning uchun Nest cars papkasini umuman o'qimadi. Xato yo'q, chunki Nest uchun u modul shunchaki yo'q. Bu yashirin xato, eng xavflisi." },
    { id: 'f', key: "Topish yo'li: terminalda <b>CarsController satri ham, Mapped ham yo'q</b>", text: "Buni qanday topasiz? Terminalga qarang: CarsController satri yo'q, cars uchun Mapped satri yo'q. Terminaldagi satrlarni o'qishni odat qiling degan edim, sabab mana shu." },
    { id: 'g', key: "Tuzatamiz: <code>imports: [CarsModule]</code> qaytdi — Mapped satrlari <b>qaytib keldi</b>", text: "Tuzatamiz: app module ts faylida imports ro'yxatiga CarsModule'ni qaytaramiz. Server qayta yuklanadi va terminalda CarsController hamda uchta Mapped satri qaytib keladi. cars route'i yana ishlaydi." },
    { id: 'h', key: "Xulosa: 404 bo'lsa-yu kod to'g'ri ko'rinsa — <b>avval terminaldagi Mapped</b>, keyin imports", text: "Xulosa: route to'rt yuz to'rt bersa va kodingiz to'g'ri ko'rinsa, avval terminalda Mapped satrini qidiring, keyin bosh modulning imports ro'yxatini tekshiring." },
  ],
};
function Screen19(p) {
  return <Lesson p={p} S={S19} sceneTop scene={(b) => <Scene19 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2 o'ylab ko'ring · 3 ishga tushdi · 4 404 · 5 nima bo'ldi · 6 topish yo'li · 7 tuzatildi · 8 xulosa
function Scene19({ b }) {
  const { beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const fixed = beat >= 7;
  if (fixed) return (
    <Ide files={ALL_FILES} active="src/app.module.ts">
      <CodePanel key="f" file="src/app.module.ts" numbers={false} lines={[{ h: `<span class="d">@Module</span>({` }, { gone: true, h: `  imports: [],` }, { neu: true, h: `  imports: [<span class="c">CarsModule</span>],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }]} />
      <MiniImports broken fixed />
      <CodePanel file={t('terminal — tuzatildi', 'terminal — исправлено')} numbers={false} wrap style={{ background: '#111827' }} lines={[...OK_CARS, { h: `` }, { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, …]` }]} />
      <Block at={8} beat={beat}><div className="mk-rule">{t(<><b>404 + kod to'g'ri ko'rinadi?</b> 1) terminalda <code>Mapped</code> satrini qidiring · 2) bosh modulning <code>imports</code>'ini tekshiring.</>, <><b>404, а код выглядит верным?</b> 1) ищите в терминале строку <code>Mapped</code> · 2) проверьте <code>imports</code> главного модуля.</>)}</div></Block>
    </Ide>
  );
  const lines = broken
    ? [{ h: `<span class="d">@Module</span>({` }, { gone: true, h: `  imports: [<span class="c">CarsModule</span>],` }, { neu: true, h: `  imports: [],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }]
    : [{ h: `<span class="d">@Module</span>({` }, { h: `  imports: [<span class="c n1-act" data-act="1">CarsModule</span>],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }];
  return (
    <Ide files={ALL_FILES} active="src/app.module.ts">
      <Block at={0} beat={beat} dim={beat >= 3 && beat !== 5}><div onClick={act.onClick}><CodePanel key={broken ? 'b' : 'o'} file="src/app.module.ts" numbers={false} lines={lines} /></div></Block>
      <MiniImports broken={broken} fixed={false} known={beat >= 4} unread={beat >= 5} />
      <Block at={3} beat={beat}><CodePanel file={t("terminal — xato YO'Q", 'terminal — ошибки НЕТ')} numbers={false} wrap style={{ background: '#111827' }} beat={beat - 1} lines={[
        { at: 2, h: `[Nest] LOG [InstanceLoader] AppModule dependencies initialized` },
        { at: 2, h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
        { at: 2, h: `[Nest] LOG [RouterExplorer] Mapped {/, GET} route` },
        { at: 5, id: 'miss', keep: true, h: t("<span class=\"er\">⟵ bu yerda CarsController {/cars} va Mapped {/cars…} bo'lishi kerak edi — yo'q</span>", '<span class="er">⟵ здесь должны были быть CarsController {/cars} и Mapped {/cars…} — их нет</span>') },
        { at: 2, id: 'ok', h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
        { at: 3, h: `` },
        { at: 3, h: `<span class="p">GET /cars</span> → <span class="er">404</span>  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}` },
        { at: 3, h: `<span class="p">GET /</span>     → <span class="ok">200</span>  Hello World!` }]} focus={beat === 3 ? ['ok'] : (beat === 6 ? ['miss'] : [])} /></Block>
    </Ide>
  );
}

// --- S20 Controller decorator'i yo'q ---
const S20 = {
  kicker: '5-bosqich · buzamiz 3', title: "Buzamiz 3: Controller decorator'i yo'q",
  segments: [
    { id: 'x', key: "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>@Controller('cars')</code> ustiga bosing", text: "Yashirin xatoni ko'rdik. Uchinchi holat decorator haqida: to'rtinchi ekranda aytgan qoidani endi amalda ko'ramiz. cars controller faylida Controller decorator'i yonib turibdi, ustiga bosib o'chiring.", act: "<b>cars.controller.ts</b>'dagi <b>@Controller('cars')</b> ustiga bosing — decorator o'chadi." },
    { id: 'a', key: "Ataylab buzamiz: <code>@Controller('cars')</code> o'chirildi, klass qoldi — server <b>yiqiladi</b>", text: "Decorator o'chdi, klass joyida qoldi. Server yiqiladi." },
    { id: 'b', key: "Xabar: «<b>invalid controller</b>» — belgi yo'q, lekin controllers ro'yxatida turibdi", text: "Xabar: noto'g'ri controller aniqlandi. CarsController'da Controller decorator'i yo'q, lekin u qaysidir modulning controllers ro'yxatida turibdi.", show: "<b>An invalid controller has been detected.</b> CarsController does not have the @Controller() decorator, but it is being listed in the controllers array of some module." },
    { id: 'c', key: "4-ekrandagi qoida ishladi: belgi bo'lmasa, <b>Nest klassni tanimaydi</b>", text: "Nest aniq aytyapti: siz uni ro'yxatga yozgansiz, lekin klassda belgi yo'q. Decorator'lar ekranida aytganimni eslang: belgi bo'lmasa, Nest klassni tanimaydi." },
    { id: 'd', key: "Tuzatamiz: decorator qaytdi — server <b>ishga tushdi</b>, Mapped satrlari joyida", text: "Tuzatish bitta satr: decorator'ni qaytaramiz. Server qayta yuklanadi, terminalda Mapped satrlari va successfully started." },
    { id: 'e', key: "Xulosa: «invalid controller» — <b>birinchi satr tushib qolgan</b>, decorator'ni qaytaring", text: "Xulosa: invalid controller xabarini ko'rsangiz, xabarda aytilgan klassning ustiga qarang. O'quvchilar buni ko'pincha kodni qo'lda ko'chirganda, birinchi satrni tushirib qoldirganda qiladi." },
  ],
};
function Screen20(p) {
  return <Lesson p={p} S={S20} sceneTop scene={(b) => <Scene20 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2 xabar · 3 qoida · 4 tuzatildi · 5 xulosa
function Scene20({ b }) {
  const { beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const fixed = beat >= 4;
  const deco = fixed ? { neu: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` }
    : broken ? { gone: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)   <span class="cm">${t("← o'chirildi", '← удалено')}</span>` }
    : { h: `<span class="n1-act" data-act="1"><span class="d">@Controller</span>(<span class="s">'cars'</span>)</span>` };
  return (<Ide files={ALL_FILES} active="src/cars/cars.controller.ts">
    <div onClick={act.onClick}><CodePanel key={fixed ? 'f' : broken ? 'b' : 'o'} file="src/cars/cars.controller.ts" lines={[
      { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
      { h: `` },
      deco,
      { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
      { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
      { h: `  <span class="cm">// …</span>` },
      { h: `}` }]} /></div>
    <MiniCtrlDeco broken={broken} fixed={fixed} />
    {fixed
      ? <CodePanel file={t('terminal — tuzatildi, server ishga tushdi', 'terminal — исправлено, сервер запустился')} numbers={false} wrap style={{ background: '#111827' }} lines={OK_CARS} />
      : <Block at={2} beat={beat}><CodePanel file={t('terminal — server yiqildi', 'terminal — сервер упал')} numbers={false} wrap style={{ background: '#1F1115' }} lines={[
          { h: `UnknownRequestMappingException [Error]: <span class="er">An invalid controller has been detected.</span>` },
          { h: `"CarsController" <span class="er">does not have the @Controller() decorator</span>` },
          { h: `but it is being listed in the "controllers" array of some module.` }]} /></Block>}
    <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>«invalid controller»</b> → xabardagi klass ustiga qarang: decorator tushib qolgan. Bitta satr bilan tuzatiladi.</>, <><b>«invalid controller»</b> → посмотрите над классом из сообщения: пропал decorator. Исправляется одной строкой.</>)}</div></Block>
  </Ide>);
}

// --- S21 Injectable yo'q (+ o'ylab ko'ring) — haqiqiy chiqishlar: manba/nest-out/12 (500) va 14 (nazorat, 200) ---
const S21 = {
  kicker: '5-bosqich · buzamiz 4', title: "Buzamiz 4: Injectable decorator'i yo'q",
  segments: [
    { id: 'x', key: "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>@Injectable()</code> ustiga bosing", text: "Controller decorator'siz Nest klassni tanimadi. Service'da ham shundaymi? To'rtinchi holat: cars service faylida Injectable decorator'i yonib turibdi, ustiga bosib o'chiring.", act: "<b>cars.service.ts</b>'dagi <b>@Injectable()</b> ustiga bosing — decorator o'chadi." },
    { id: 'a', key: "Ataylab buzamiz: <code>cars.service.ts</code>'dan <code>@Injectable()</code> o'chirildi", text: "Injectable o'chdi. Service'ning o'zida konstruktor yo'q, u hech kimga bog'liq emas." },
    { id: 'b', key: "O'ylab ko'ring: <code>@Injectable()</code>'siz <code>/cars</code> <b>ishlaydimi?</b>", text: "O'ylab ko'ring: serverni ishga tushirsak, cars route'i ishlaydimi?", ask: { q: "Injectable decorator'siz /cars ishlaydimi?", opts: ['Ha, ishlaydi', "Yo'q, xato chiqadi"], answer: 0 } },
    { id: 'c', key: "<b>Ishlayapti!</b> CarsService hech kimga bog'liq emas — Nest uni oddiy yaratdi", text: "Kutilmagan natija: hammasi ishlayapti, cars route'i ikki yuz qaytaryapti. Nega? CarsService'ning o'zining konstruktorida hech qanday dependency yo'q. Nest uni dependency'siz yaratib qo'ya oldi." },
    { id: 'd', key: "<code>@Injectable()</code> Nest'ga aytadi: <b>konstruktorga qarab, nima kerakligini aniqla</b>", text: "Injectable aslida Nest'ga shuni aytadi: bu klassning konstruktoriga qarab, unga nima kerakligini aniqlang. Belgi bo'lmasa, Nest konstruktorga qaramaydi." },
    { id: 'd2', key: "Dependency qo'shsak: server <b>ishga tushadi</b>, lekin so'rovda <b>500</b> — bu yashirin xato", text: "Endi sinab ko'ramiz: shu Injectable'siz Service'ga dependency qo'shamiz, konstruktorida PricingService so'raladi. Natija kutilmagan: server xatosiz ishga tushadi, Mapped satrlari joyida. Lekin cars so'rovi besh yuz qaytaradi, terminalda TypeError: undefined ning withDiscount xossasini o'qib bo'lmaydi. Nest dependency'ni inject qilmadi va xato ham bermadi, maydon bo'sh qoldi. Bu yashirin xato: ishga tushishda emas, birinchi so'rovda chiqadi.", show: "Injectable'siz Service'ga dependency qo'shdik (<code>constructor(private pricing: PricingService)</code>). Server <b>xatosiz ishga tushadi</b>, lekin <code>GET /cars</code> → <b>500</b>, terminalda <code>TypeError: Cannot read properties of undefined (reading 'withDiscount')</code>. Nest dependency'ni inject qilmadi va xato bermadi — maydon bo'sh. <b>Yashirin xato</b>: ishga tushishda emas, birinchi so'rovda." },
    { id: 'd3', key: "Tuzatamiz: <code>@Injectable()</code> qaytdi — PricingService inject qilindi, <code>/cars</code> → <b>200</b>", text: "Tuzatamiz: Injectable decorator'ini qaytaramiz. PricingService modulning providers ro'yxatida turibdi. Endi Nest konstruktorga qaraydi, PricingService'ni inject qiladi va cars so'rovi yana ikki yuz qaytaradi.", show: "Tuzatamiz: <code>@Injectable()</code> qaytdi. <code>PricingService</code> modulning <code>providers</code>'ida turibdi. Endi Nest konstruktorga qaraydi, PricingService'ni inject qiladi va <code>GET /cars</code> yana <b>200</b> qaytaradi." },
    { id: 'e', key: "Xulosa: <code>@Injectable()</code> <b>har Service'ga yoziladi</b>, hozir kerak bo'lmasa ham", text: "Xulosa va qoida: Injectable har Service'ga yoziladi, hozir kerak bo'lmasa ham. O'quvchi men o'chirdim, ishlayapti, demak kerak emas desa, siz nega kerakligini tushuntira olasiz: dependency paydo bo'lganda xato ishga tushishda emas, so'rov paytida chiqadi, uni topish qiyin." },
  ],
};
function Screen21(p) {
  return <Lesson p={p} S={S21} sceneTop scene={(b) => <Scene21 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2 o'ylab ko'ring · 3 ishlayapti · 4 nega · 5 dependency → 500 · 6 tuzatildi · 7 xulosa
function Scene21({ b }) {
  const { beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const withDep = beat >= 5;
  const fixed = beat >= 6;
  const svcLines = [
    fixed ? { neu: true, h: `<span class="d">@Injectable</span>()   <span class="cm">${t('← qaytdi', '← вернули')}</span>` }
      : broken ? { gone: true, h: `<span class="d">@Injectable</span>()   <span class="cm">${t("← o'chirildi", '← удалено')}</span>` }
      : { h: `<span class="n1-act" data-act="1"><span class="d">@Injectable</span>()</span>` },
    { h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
    withDep
      ? { id: 'ctor', neu: !fixed, h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> pricing: <span class="c">PricingService</span>) {}` }
      : { id: 'ctor', h: `  <span class="cm">${t("// konstruktor yo'q — hech kimga bog'liq emas", '// конструктора нет — ни от кого не зависит')}</span>` },
    { h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [ <span class="cm">…</span> ];` },
    withDep
      ? { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.cars.<span class="c">map</span>((c) => ({ ...c, price: <span class="k">this</span>.pricing.<span class="c">withDiscount</span>(c.price) })); }` }
      : { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.cars; }` },
    { h: `}` }];
  return (
    <Ide files={[...ALL_FILES, 'src/cars/pricing.service.ts']} active="src/cars/cars.service.ts">
      <div onClick={act.onClick}><CodePanel key={fixed ? 'f' : withDep ? 'd' : broken ? 'b' : 'o'} file="src/cars/cars.service.ts" lines={svcLines} focus={beat === 1 || beat === 3 || beat === 5 ? ['ctor'] : []} /></div>
      <MiniInjectable broken={broken} dep={withDep} fixed={fixed} known={!broken || beat >= 3} />
      {fixed
        ? <CodePanel file={t('terminal — tuzatildi (haqiqiy chiqish)', 'terminal — исправлено (реальный вывод)')} numbers={false} wrap style={{ background: '#111827' }} lines={[
            { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
            { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]` }]} />
        : withDep
          ? <CodePanel file={t("terminal — Injectable'siz + dependency (haqiqiy chiqish)", 'terminal — без Injectable + dependency (реальный вывод)')} numbers={false} wrap style={{ background: '#1F1115' }} lines={[
              { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
              { h: `<span class="p">GET /cars</span> → <span class="er">500</span>  {"statusCode":500,"message":"Internal server error"}` },
              { h: `[Nest] ERROR [ExceptionsHandler] <span class="er">TypeError: Cannot read properties of undefined (reading 'withDiscount')</span>` },
              { h: `    at CarsService.findAll (src/cars/cars.service.ts:21:22)` }]} />
          : <Block at={3} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
              { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
              { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
              { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]` }]} /></Block>}
      <Block at={7} beat={beat}><div className="mk-rule">{t(<><b>Qoida:</b> <code>@Injectable()</code> har Service'ga yoziladi, dependency'si bo'lmasa ham. Bo'lmasa — dependency paydo bo'lganda <b>yashirin xato</b>: server ishga tushadi, so'rovda 500.</>, <><b>Правило:</b> <code>@Injectable()</code> пишут на каждый Service, даже без dependency. Иначе, когда dependency появится, — <b>скрытая ошибка</b>: сервер запускается, а на запросе 500.</>)}</div></Block>
    </Ide>
  );
}

// --- Tekshiruv 4: qaysi satr xato (modul) ---
const LC2_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { OrdersController } <span class="k">from</span> <span class="s">'./orders.controller'</span>;` },
  { h: `<span class="k">import</span> { OrdersService } <span class="k">from</span> <span class="s">'./orders.service'</span>;` },
  { h: `<span class="k">import</span> { PaymentService } <span class="k">from</span> <span class="s">'./payment.service'</span>;` },
  { h: `` },
  { h: `<span class="d">@Module</span>({` },
  { h: `  imports: [],` },
  { h: `  controllers: [<span class="c">OrdersController</span>, <span class="c">PaymentService</span>],` },
  { h: `  providers: [<span class="c">OrdersService</span>],` },
  { h: `})` },
  { h: `<span class="k">export class</span> <span class="c">OrdersModule</span> {}` },
];
// Topilgach — tuzatilgan holat (F-1030-14): PaymentService controllers'dan chiqadi, providers'ga kiradi
// n — tuzatilgan fayldagi haqiqiy satr raqami: ovoz «sakkizinchi / to'qqizinchi satr» deydi (nest-linecheck/TAKLIF.md)
const LC2_FIXED = [
  ...LC2_LINES.slice(0, 7).map((l, i) => ({ ...l, n: i + 1 })),
  { gone: true, n: '', h: LC2_LINES[7].h },
  { neu: true, n: 8, h: `  controllers: [<span class="c">OrdersController</span>],   <span class="cm">// faqat Controller qoldi</span>` },
  { gone: true, n: '', h: LC2_LINES[8].h },
  { neu: true, n: 9, h: `  providers: [<span class="c">OrdersService</span>, <span class="c">PaymentService</span>],   <span class="cm">// Service — shu yerda</span>` },
  ...LC2_LINES.slice(9).map((l, i) => ({ ...l, n: 10 + i })),
];
function ScreenLC2(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 4', 'Проверка 4')} eyebrow={t('Tekshiruv · 4 / 6 — qaysi satr xato?', 'Проверка · 4 / 6 — какая строка с ошибкой?')} title={t("Server yiqiladi: «can't resolve dependencies of the OrdersController»", "Сервер падает: «can't resolve dependencies of the OrdersController»")}
    task={t("Qoida: Controller — <code>controllers</code>'da, Service — <code>providers</code>'da. Bu modulda bitta narsa <b>noto'g'ri ro'yxatga</b> yozilgan. <b>O'sha satrni bosing.</b>", 'Правило: Controller — в <code>controllers</code>, Service — в <code>providers</code>. В этом модуле одна вещь записана <b>не в тот список</b>. <b>Нажмите на эту строку.</b>')}
    q={t("To'rt xato holatini ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Bu modul bilan server yiqiladi: OrdersController'ning dependency'si topilmadi deydi. Qoidani eslang: Controller controllers ro'yxatida, Service providers ro'yxatida. Bitta narsa noto'g'ri ro'yxatda. O'sha satrni bosing.", 'Четыре случая ошибок вы увидели, теперь найдите сами. Четвёртая проверка. С этим модулем сервер падает: пишет, что не найден dependency для OrdersController. Вспомните правило: Controller в списке controllers, Service в списке providers. Одна вещь стоит не в том списке. Нажмите на эту строку.')}
    file="src/orders/orders.module.ts" lines={LC2_LINES} target={[7, 8]}
    tree={{ root: 'shop-api', files: ['src/orders/orders.module.ts', 'src/orders/orders.controller.ts', 'src/orders/orders.service.ts', 'src/orders/payment.service.ts'], active: 'src/orders/orders.module.ts' }}
    fixed={LC2_FIXED}
    ok={t("To'g'ri. PaymentService bu Service, lekin u controllers ro'yxatiga yozilgan, providers'da esa yo'q. Ekranda tuzatilgan holat ko'rinib turibdi: sakkizinchi satrda faqat OrdersController qoldi, PaymentService to'qqizinchi satrga, providers'ga ko'chdi. Endi Nest uni yaratadi va OrdersController'ga inject qiladi. Demak, Service doim providers ro'yxatiga yoziladi, controllers'ga emas.", 'Верно. PaymentService — это Service, но он записан в список controllers, а в providers его нет. На экране исправленный вариант: в восьмой строке остался только OrdersController, а PaymentService перенесён в девятую строку, в providers. Теперь Nest его создаст и сделает inject в OrdersController. Значит, Service всегда записывают в providers, а не в controllers.')}
    okShort={t("PaymentService — Service, u providers'da bo'lishi kerak. Tuzatildi: controllers: [OrdersController] · providers: [OrdersService, PaymentService].", 'PaymentService — это Service, он должен быть в providers. Исправлено: controllers: [OrdersController] · providers: [OrdersService, PaymentService].')}
    hint={t("Bu satr o'z joyida. Har narsa o'z ro'yxatidami: Controller controllers'da, Service providers'da? Nomi Service bilan tugaydigan narsani qidiring.", 'Эта строка на своём месте. Всё ли в своём списке: Controller в controllers, Service в providers? Ищите то, что заканчивается на Service.')} />;
}

// --- S22 Error vs HttpException ---
const S22 = {
  kicker: '5-bosqich · xato turi', title: 'Xatoning ikki turi: Error va HttpException',
  segments: [
    { id: 'a', key: "Ataylab buzamiz: <code>findOne</code>'da NotFoundException o'rniga <b>oddiy Error</b> tashladik", text: "Hozirgacha xatolar server ishga tushayotganda chiqdi. Oxirgi holat boshqa: server ishlayapti, xato so'rov paytida tashlanadi. Qaysi status qaytadi? cars service ts ichidagi findOne'da NotFoundException o'rniga oddiy Error tashladik, matni topilmadi." },
    { id: 'b', key: "Javob <b>500</b>, «topilmadi» matni yo'qoldi — Nest kutilmagan xatoni yashiradi", text: "Javob: besh yuz, Internal server error. Bizning topilmadi matnimiz yo'qoldi. Nest kutilmagan xatoni foydalanuvchiga ko'rsatmaydi, bu to'g'ri: ichki tafsilot tashqariga chiqmasligi kerak." },
    { id: 'c', key: "<b>HttpException oilasini</b> Nest taniydi: to'g'ri status va xabar bilan qaytaradi", text: "NotFoundException esa Nest'ning HttpException oilasidan. Nest uni taniydi va to'g'ri status bilan, xabari bilan qaytaradi." },
    { id: 'd', key: "Oila: <b>400</b> BadRequest · <b>401</b> Unauthorized · <b>403</b> Forbidden · <b>404</b> NotFound", text: "Oilada boshqalari ham bor: BadRequest to'rt yuz, noto'g'ri ma'lumot. Unauthorized to'rt yuz bir, kirish qilinmagan. Forbidden to'rt yuz uch, ruxsat yo'q. NotFound to'rt yuz to'rt, topilmadi." },
    { id: 'e', key: "Tuzatamiz: <code>Error</code> → <code>NotFoundException</code> — javob yana <b>404</b> va xabar", text: "Tuzatamiz: findOne'dagi oddiy Error'ni NotFoundException'ga almashtiramiz. Endi cars to'qson to'qqiz so'roviga yana to'rt yuz to'rt va Car with id 99 not found xabari keladi." },
    { id: 'f', key: "Xulosa: o'quvchi «nega 500?» desa — <b>«qanday xato tashladingiz?»</b> deb so'rang va almashtiring", text: "Xulosa va sinfdagi qoida: foydalanuvchi bilishi kerak bo'lgan xato HttpException oilasi bilan tashlanadi, qolgani besh yuz bo'lib qoladi va xabari yashiriladi. O'quvchi nega besh yuz chiqyapti desa, birinchi savolingiz: qanday xato tashladingiz? Oddiy Error bo'lsa, mos HttpException'ga almashtirasiz: topilmasa NotFound, ma'lumot noto'g'ri bo'lsa BadRequest." },
  ],
};
function Screen22(p) {
  return <Lesson p={p} S={S22} sceneTop scene={({ beat }) => beat >= 4 ? (
    <Ide files={ALL_FILES} active="src/cars/cars.service.ts">
      <CodePanel file="src/cars/cars.service.ts · findOne" lines={[
        { h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
        { h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
        { gone: true, h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">Error</span>(<span class="s">'${t('topilmadi', 'не найдено')}'</span>);` },
        { neu: true, h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
        { h: `    <span class="k">return</span> car;` },
        { h: `  }` }]} />
      <CodePanel file={t('terminal — tuzatildi', 'terminal — исправлено')} numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `<span class="p">GET /cars/99</span> → <span class="ok">404</span>  {"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` }]} />
      <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>«Nega 500?»</b> → «Qanday xato tashladingiz?» Oddiy <code>Error</code> → mos HttpException: topilmasa <code>NotFoundException</code> (404), ma'lumot noto'g'ri bo'lsa <code>BadRequestException</code> (400).</>, <><b>«Почему 500?»</b> → «Какую ошибку вы бросили?» Обычный <code>Error</code> → подходящий HttpException: не найдено — <code>NotFoundException</code> (404), неверные данные — <code>BadRequestException</code> (400).</>)}</div></Block>
    </Ide>
  ) : (<Ide files={ALL_FILES} active="src/cars/cars.service.ts">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={0} beat={beat} dim={beat >= 2 && beat <= 3}><CodePanel file={t('oddiy Error', 'обычный Error')} numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">Error</span>(<span class="s">'${t('topilmadi', 'не найдено')}'</span>);` },
        { at: 1, h: `` },
        { at: 1, h: `<span class="p">GET /cars/99</span> → <span class="er">500</span>` },
        { at: 1, h: `{"statusCode":500,"message":"Internal server error"}` },
        { at: 1, h: `<span class="cm">${t("// «topilmadi» yo'qoldi — yashirildi", '// «не найдено» пропало — скрыто')}</span>` }]} /></Block>
      <Block at={2} beat={beat}><CodePanel file={t('HttpException oilasi', 'семейство HttpException')} numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">'Car with id 99 not found'</span>);` },
        { h: `` },
        { h: `<span class="p">GET /cars/99</span> → <span class="ok">404</span>` },
        { h: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` }]} /></Block>
    </div>
    <Block at={3} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
      {[['BadRequestException', 400, t("ma'lumot noto'g'ri", 'неверные данные')], ['UnauthorizedException', 401, t('kirish qilinmagan', 'вход не выполнен')], ['ForbiddenException', 403, t("ruxsat yo'q", 'нет доступа')], ['NotFoundException', 404, t('topilmadi', 'не найдено')]].map(([n, c, d], i) => <div key={n} className="mk-card" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}><h5 style={{ color: T.accent }}>{c} · {d}</h5><code style={{ fontSize: 11.5 }}>{n}</code></div>)}
    </div></Block>
  </Ide>)} />;
}

// --- S23 Tekshiruv 5 — xatoni o'qish ---
function Screen23(p) {
  const above = <CodePanel numbers={false} wrap style={{ marginBottom: 18, background: '#1F1115', flex: '0 0 auto', maxHeight: 'none' }} lines={[
    { h: `Nest can't resolve dependencies of the OrdersController (<span class="er">?</span>, OrdersService).` },
    { h: `Please make sure that the argument <span class="er">PaymentService at index [0]</span> is available` },
    { h: `in the <span class="er">OrdersModule</span> module.` }]} />;
  // To'g'ri javobdan keyin — tuzatilgan fayl Explorer bilan (M2: har kod misolida tuzatish ko'rinadi)
  const after = <>
    <div className="mk-tag" style={{ color: T.green, marginBottom: 8 }}>{t('Tuzatildi — yangi satr yashil', 'Исправлено — новая строка зелёная')}</div>
    <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="src/orders/orders.module.ts" numbers={false} lines={[
        { h: `<span class="d">@Module</span>({` },
        { h: `  controllers: [<span class="c">OrdersController</span>],` },
        { gone: true, h: `  providers: [<span class="c">OrdersService</span>],` },
        { neu: true, h: `  providers: [<span class="c">OrdersService</span>, <span class="c">PaymentService</span>],   <span class="cm">${t("// qo'shildi", '// добавлено')}</span>` },
        { h: `})` }]} />
      <CodePanel file={t('terminal — tuzatildi', 'terminal — исправлено')} numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [InstanceLoader] <span class="ok">OrdersModule dependencies initialized</span>` },
        { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` }]} />
    </div>
  </>;
  return <MCRetry {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t("Tekshiruv · 5 / 6 — xatoni o'qish", 'Проверка · 5 / 6 — чтение ошибки')} above={above} after={after}
    title={t("Bu o'quvchingizning loyihasi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'Это проект вашего ученика. Какой файл вы откроете и что исправите?')}
    q={t("Sinfdagi haqiqiy holat. Beshinchi tekshiruv. Ekrandagi xabarni o'qing. Bu sizning emas, o'quvchingizning loyihasi, u yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'Настоящая ситуация в классе. Пятая проверка. Прочитайте сообщение на экране. Это не ваш проект, а проект вашего ученика, он попросил помощи. Какой файл вы откроете и что исправите?')}
    opts={t(["orders.controller.ts — konstruktordan OrdersService'ni o'chirish", "orders.module.ts — providers'ga PaymentService qo'shish", "app.module.ts — imports'ga OrdersController qo'shish", "payment.service.ts — Controller decorator'i qo'shish"], ['orders.controller.ts — удалить OrdersService из конструктора', 'orders.module.ts — добавить PaymentService в providers', 'app.module.ts — добавить OrdersController в imports', 'payment.service.ts — добавить decorator Controller'])} correct={1}
    ok={t("To'g'ri: orders module faylida providers ro'yxatiga PaymentService qo'shiladi. Xabarda hamma narsa yozilgan: klass OrdersController, dependency PaymentService, index nol, fayl OrdersModule. Qavsda so'roq belgisi birinchi o'rinda turibdi, OrdersService esa ikkinchi o'rinda topilgan. Ekranda tuzatilgan fayl: PaymentService qo'shildi va server ishga tushdi. Demak, so'roq belgisi turgan o'rindagi dependency yetishmayapti.", 'Верно: в файле orders module в список providers добавляется PaymentService. В сообщении написано всё: класс OrdersController, dependency PaymentService, index ноль, файл OrdersModule. В скобках знак вопроса стоит на первом месте, а OrdersService на втором найден. На экране исправленный файл: PaymentService добавлен, и сервер запустился. Значит, не хватает того dependency, на месте которого стоит знак вопроса.')}
    okShort={t("orders.module.ts → providers: [OrdersService, PaymentService]. Klass: OrdersController · dependency: PaymentService, index [0] · fayl: orders.module.ts.", 'orders.module.ts → providers: [OrdersService, PaymentService]. Класс: OrdersController · dependency: PaymentService, index [0] · файл: orders.module.ts.')}
    wrong={t({ 0: "OrdersService topilgan, muammo unda emas.", 2: "Controller imports'ga yozilmaydi, imports faqat modullar uchun.", 3: "Controller decorator'i Service'ga qo'yilmaydi; bu xabar PaymentService modul ro'yxatida yo'qligini aytyapti." }, { 0: 'OrdersService найден, проблема не в нём.', 2: 'Controller не пишут в imports, imports — только для модулей.', 3: 'Decorator Controller не ставят на Service; это сообщение говорит, что PaymentService нет в списке модуля.' })} />;
}

// --- Amaliyot 3: o'zingiz buzing va tuzating ---
const P3 = {
  kicker: 'Amaliyot 4 / 4', eyebrow: "Hozir o'zingizda · 5 daqiqa", title: "O'zingiz buzing va tuzating", tableAt: 3,
  segments: [
    { id: 'a', key: "Endi <b>siz buzasiz</b>: ikki holat — xatoni o'z ko'zingiz bilan o'qiysiz", text: "Oxirgi amaliyot: endi siz buzasiz. Ikki holat, besh daqiqa. Maqsad xatoni o'z ko'zingiz bilan ko'rish va o'qish.", hl: [] },
    { id: 'b', key: "1-qadam: <code>providers</code>'ni bo'shating, xabardan <b>qaysi klass · qaysi dependency · qaysi fayl</b>'ni toping, qaytaring", text: "Birinchi: cars module da providers ro'yxatini bo'shating, serverni ishga tushiring, xabardan qaysi klass, qaysi dependency va qaysi fayl ekanini toping. Topgan uchta javobingizni, klass, dependency va faylni, vergul bilan isbot maydoniga yozing, keyin providers'ni qaytaring.", hl: [0] },
    { id: 'c', key: "2-qadam: <code>imports</code>'dan CarsModule'ni oling — terminalda <b>qaysi satr yo'qolganini</b> toping", text: "Ikkinchi: app module da imports'dan CarsModule'ni olib tashlang. Server ishga tushadi. Terminalda qaysi satr yo'qolganini toping, cars route'ini so'rang, keyin qaytaring.", hl: [1] },
    { id: 'd', key: "3-qadam: hammasini qaytaring — terminalda <b>3 ta Mapped</b>, <code>/cars/99</code> → <b>404</b>", text: "Uchinchi: hammasini qaytaring va tekshiring. Terminalda yana uchta Mapped satri bo'lsin, cars to'qson to'qqiz so'rovi to'rt yuz to'rt va xabar qaytarsin. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Uchala katakcha va isbot to'g'ri bo'lmaguncha Davom ochilmaydi. Demak, endi siz Nest xabaridan klass, dependency va faylni o'zingiz topa olasiz.", hl: [2] },
  ],
};
const P3_STEPS = [
  { t: "providers bo'sh", cmds: [], exp: "«Nest can't resolve dependencies of the CarsController (?)» → klass · dependency · fayl → providers: [CarsService] qaytaring" },
  { t: "imports'da CarsModule yo'q", cmds: [], exp: "server ishga tushadi · terminalda CarsController satri YO'Q · GET /cars → 404 → imports: [CarsModule] qaytaring" },
  { t: 'Qaytaring va tekshiring', cmds: [], exp: 'terminalda yana 3 ta Mapped {/cars…} · GET /cars/99 → 404 «Car with id 99 not found»' },
];
const P3_TROUBLE = [
  ['Qaytardim, baribir xato', "Faylni saqladingizmi? start:dev saqlashda o'zi qayta yuklaydi; terminalda yangi satrlarni kuting"],
  ['Boshqa xato chiqdi', "Xabarni uch savol bilan o'qing: qaysi klass · qaysi dependency · qaysi fayl. Potential solutions ro'yxati yechimni aytadi"],
];
// Isbot = M18 formulasi: xabardan topilgan uch javob (klass · dependency · fayl); fayl nomi yoki modul nomi qabul
const P3_PROOF = { label: "Isbot: 1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan)", placeholder: 'klass, dependency, fayl', check: (v) => { const x = v.toLowerCase().replace(/\s/g, ''); return x.includes('carscontroller') && x.includes('carsservice') && (x.includes('cars.module') || x.includes('carsmodule')); }, wrong: "Xabarni qayta o'qing: «of the ___» — klass, «argument ___ at index [0]» — dependency, «in the ___ module» — fayl" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  7-BOSQICH · ko'prik (2), o'tish rejasi (3), savollar, o'z-sinov, yakun + root komponent
// ============================================================
// 30.10: haqiqiy repo strukturasi (GitHub API, IntroNestArxitechture HEAD) — M10
const TREE = [
  { t: 'IntroNestArxitechture/', f: true }, { t: '  src/main.ts', g: 'r' }, { t: '  src/config/index.ts', g: 'r' },
  { t: '  src/api/', f: true }, { t: '    app.module.ts', g: 'g' }, { t: '    app.service.ts  (Service emas!)', g: 'r' },
  { t: '    admin/admin.module.ts', g: 'g' }, { t: '    admin/admin.controller.ts', g: 'g' }, { t: '    admin/admin.service.ts', g: 'g' },
  { t: '    admin/dto/ (create · update · signin)', g: 'y' }, { t: '    auth/ (kirish)', g: 'r' },
  { t: '  src/core/', f: true }, { t: '    entity/Base.entity.ts · admin.entity.ts', g: 'y' }, { t: '    repository/admin.repository.ts', g: 'y' },
  { t: '  src/common/', f: true }, { t: '    guard/ (auth · roles)', g: 'r' }, { t: '    decorator/ · interface/ · enum/ · dto/', g: 'r' },
  { t: '  src/infrastructure/', f: true }, { t: '    base/base.service.ts', g: 'r' }, { t: '    exception/AllException.filter.ts', g: 'r' },
  { t: '    lib/token/ · lib/crypto/', g: 'r' }, { t: '    response/successRes.ts · pagination/', g: 'r' },
];
// F-1030-16: mentor kursdagi hamma darsni o'tib bo'lgan — «keyingi darsda» deyilmaydi; har rangli joy uchun mentorning TAYYOR GAPI shu yerda
const S25A_SAY = {
  y: [['Entity', "bazadagi jadval shakli: TypeORM shu klassdan jadval yasaydi"], ['DTO', "kiruvchi ma'lumot shakli: majburiy maydon va tiplar shu yerda tekshiriladi, xato bo'lsa 400"], ['Repository', "bazaga yozish va o'qish metodlari: Service bazaga shu orqali murojaat qiladi"]],
  r: [['auth', "kirish va ro'yxatdan o'tish moduli"], ['Guard', "so'rov Controller'ga yetguncha tokenni tekshiradi, yaroqsiz bo'lsa to'xtatadi"], ['BaseService', "hamma Service uchun tayyor CRUD metodlari, admin service undan meros oladi"], ['Token', "kirgan foydalanuvchining ruxsatnomasi"], ['successRes', "hamma javob bir xil shaklda qaytishi uchun yordamchi"], ['main.ts → app.service.ts', "server shu yerda ishga tushadi (Aplication klassi). Nomi app.service, lekin bu loyihada Service emas"], ['AllExceptionFilter', "hamma xatoni bitta shaklda qaytaradi: { statusCode, error: { message } }"], ['config', ".env qiymatlarini (PORT, DEV_DB_URL) o'qiydi"]],
};
const S25a = {
  kicker: "7-bosqich · o'quvchi darsini o'tish", title: "O'quvchi clone qiladigan loyiha",
  segments: [
    { id: 'a', key: "O'quvchi <b>noldan yozmaydi</b>: GitHub'dan tayyor loyihani clone qilib, ishga tushiradi", text: "Siz Nest'ni o'zingiz qurdingiz va o'zingiz buzdingiz. Endi darsning asosiy maqsadiga o'tamiz: bu mavzuni o'quvchiga o'tish. Avval o'quvchi darsiga qaraymiz, chunki u bu mavzuni boshqacha ko'radi. O'quvchi noldan yozmaydi: GitHub'dan tayyor loyihani clone qiladi, IntroNestArxitechture, va uni ishga tushiradi.", lit: null },
    { id: 'b', key: "Loyiha kattaroq: <code>api</code> · <code>core</code> · <code>common</code> · <code>infrastructure</code> papkalari", text: "Loyiha kattaroq: api, core, common, infrastructure papkalari.", lit: 'f' },
    { id: 'c', key: "<b>Yashil</b> — bugun kod bilan ko'rdingiz: admin module, controller, service — bizning cars'ning o'zi", text: "Yashil belgilangan joylarni siz bugun kod bilan ko'rdingiz: admin module, admin controller, admin service va bosh modul. Ular aynan bizning cars fayllarimiz, faqat admin uchun va kattaroq. Darsda ularni kodi bilan ko'rsatasiz.", lit: 'g' },
    { id: 'd', key: "<b>Sariq</b> — Entity · DTO · Repository: o'quvchi so'rasa, <b>bir gapda</b> tushuntirasiz", text: "Sariq joylar: entity, dto va repository. O'quvchi darsida ular nomi va vazifasi bilan chiqadi, so'rasa bir gapda tushuntirasiz. Entity, bazadagi jadval shakli: TypeORM shu klassdan jadval yasaydi.", lit: 'y' },
    { id: 'd2', key: "<b>DTO</b> — kiruvchi ma'lumot shakli, <b>Repository</b> — bazaga yozish va o'qish", text: "DTO, kiruvchi ma'lumot shakli: majburiy maydonlar va tiplar shu yerda tekshiriladi. Repository, bazaga yozish va o'qish metodlari: Service bazaga shu orqali murojaat qiladi. Ularning kodini kursdagi keyingi mentor darslarida to'liq o'rganasiz, hozir bir gap yetarli.", lit: 'y' },
    { id: 'e', key: "<b>Kulrang</b> — auth, Guard, BaseService, filter, config: <b>nom va vazifa</b>, bittadan gap", text: "Kulrang joylar. Auth moduli kirish va ro'yxatdan o'tishni qiladi. Guard so'rov Controller'ga yetguncha tokenni tekshiradi, yaroqsiz bo'lsa to'xtatadi. BaseService hamma Service uchun tayyor CRUD metodlari, admin service undan meros oladi. Token, kirgan foydalanuvchining ruxsatnomasi. successRes, hamma javob bir xil shaklda qaytishi uchun yordamchi.", lit: 'r' },
    { id: 'e2', key: "Ehtiyot joy: server <code>api/app.service.ts</code>'da ishga tushadi — nomi Service, lekin <b>Service emas</b>", text: "Bitta ehtiyot joy: bu loyihada server main ts'da emas, api papkasidagi app service ts faylida ishga tushadi. Nomi app service, lekin u Service emas, serverni ishga tushiradigan klass. O'quvchi so'rasa, shuni ayting.", lit: 'r' },
    { id: 'e3', key: "Xavotir olmang: bu loyihaning o'ziga xos joylarini <b>keyingi mentor darsida</b> clone qilib ko'rasiz", text: "Xavotir olmang: bu loyihaning o'ziga xos joylarini, route'lar api v1 bilan boshlanishini, xato javobining shaklini va BaseService'ni keyingi mentor darsida clone qilib, o'zingiz ko'rasiz. O'quvchi darsida esa shu gaplar yetarli.", lit: 'r' },
    { id: 'f', key: "Xulosa: strukturadagi <b>har rangli joy uchun bitta tayyor gapingiz</b> bor", text: "Xulosa: yashil fayllarni kod bilan ko'rsatasiz, sariq va kulranglarni bittadan gap bilan tushuntirib, darsga qaytasiz. O'quvchi darsi bu fayllarning kodini ochmaydi, shuning uchun bitta gap yetarli.", lit: null },
  ],
};
function Screen25a(p) {
  return <Lesson p={p} S={S25a} sceneTop scene={({ seg, beat }) => {
    // rang shu rangning birinchi segmentidan yonadi (segment bo'linsa ham siljimaydi)
    const lit = (g) => { const k = S25a.segments.findIndex((s) => s.lit === g); return k >= 0 && beat >= k; };
    const say = seg.lit === 'y' || seg.lit === 'r' ? S25A_SAY[seg.lit] : null;
    return <div style={{ display: 'grid', gridTemplateColumns: say ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gap: 12, alignItems: 'start' }}>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">github.com/Azizbekcrypto/IntroNestArxitechture</div>
        <div className="mk-tree" style={{ fontSize: 13 }}>{TREE.map((n, i) => <div key={i} className={n.f ? (beat >= 1 ? 'f' : '') : (n.g && lit(n.g) ? n.g : '')} style={{ opacity: beat >= 1 || n.f ? 1 : 0.6, outline: seg.lit && n.g === seg.lit && lit(n.g) ? `2px solid ${T.accent}` : 'none', outlineOffset: -2 }}>{n.t}</div>)}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 12, flexWrap: 'wrap' }}><span className="mk-tree"><span className="g" style={{ padding: '1px 6px' }}>{t("kod bilan ko'rsatasiz", 'показываете с кодом')}</span></span><span className="mk-tree"><span className="y" style={{ padding: '1px 6px' }}>{t('bir gapda tushuntirasiz', 'объясняете одной фразой')}</span></span><span className="mk-tree"><span className="r" style={{ padding: '1px 6px' }}>{t('nom va vazifa', 'название и задача')}</span></span></div>
      </div>
      {say && <div key={seg.lit} className="mk-light" style={{ padding: 14, animation: 'mk-up .4s ease both' }}>
        <div className="mk-tag" style={{ color: T.accent }}>{t("O'quvchi so'rasa — sizning gapingiz", 'Если ученик спросит — ваша фраза')}</div>
        <div style={{ display: 'grid', gap: 8 }}>{say.map(([a, b]) => <div key={a} style={{ fontSize: 13.5, lineHeight: 1.45 }}><code style={{ fontFamily: MONO, fontWeight: 700 }}>{a}</code> — {b}</div>)}</div>
      </div>}
    </div>;
  }} />;
}

const DICT = [['ofitsiant', 'Controller', "so'rovni oladi, oshxonaga uzatadi"], ['oshpaz', 'Service', 'ishni bajaradi'], ['omborchi', 'Repository', 'baza bilan gaplashadi'], ['javon chizmasi', 'Entity', 'jadval shakli'], ['buyurtma anketasi', 'DTO', "kiruvchi ma'lumot shakli"], ['nazoratchi', 'Guard', 'tokenni tekshiradi'], ['bir xil lagan', 'successRes', 'javob shakli'], ['shtat jadvali', 'Module', "ro'yxat"]];
const S25b = {
  kicker: "7-bosqich · o'quvchi darsini o'tish", title: "O'quvchi darsining tili: restoran",
  segments: [
    { id: 'a', key: "O'quvchi darsi <b>restoran tilida</b> gapiradi: ofitsiant, oshpaz, omborchi…", text: "Loyihaning fayllarini ko'rdik. Endi o'quvchi shu fayllarni qanday so'zlar bilan eslashini bilib olaylik. O'quvchi darsi restoran tilida gapiradi: Controller ofitsiant, Service oshpaz, Repository omborchi, Guard nazoratchi, Module shtat jadvali. O'quvchi shu so'zlarda o'ylaydi.", n: 8 },
    { id: 'b', key: "O'quvchi «oshpaz» desa — siz <b>Service</b> ekanini bilasiz va faylni ko'rsatasiz", text: "Siz endi ikkala tilni bilasiz: o'quvchi oshpaz desa, siz Service ekanini bilasiz va to'g'ri faylni ko'rsatasiz. Darsda ikkala so'zni birga ayting: oshpaz, ya'ni Service.", n: 8 },
    { id: 'c', key: "Xulosa: metafora <b>vazifani</b> tushuntiradi, kodni emas — ikkala so'zni birga ayting", text: "Xulosa va bitta ogohlantirish: metafora vazifani tushuntiradi, kodni emas. O'quvchi ofitsiant oshxonaga kirmaydi deganda, Controller Service'ni chaqiradi, lekin ichida hisob qilmaydi degan ma'noni tushunsin. Shu chegarani siz ushlab turasiz.", n: 8 },
  ],
};
// F-1120-02: jadval o'rniga — o'quvchi loyihasining yo'li, har bekatda restoran so'zi va atama (KitchenMap, DICT dan)
function Screen25b(p) {
  return <Lesson p={p} S={S25b} scene={({ beat }) => <div className="mk-light" style={{ padding: 16 }}>
    <KitchenMap beat={beat} dict={DICT} />
    <Block at={2} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>{t(<>Ikkala so'zni birga ayting: <b>«oshpaz, ya'ni Service»</b>. Metafora vazifani tushuntiradi, kodni emas.</>, <>Говорите оба слова вместе: <b>«повар, то есть Service»</b>. Метафора объясняет задачу, а не код.</>)}</div></Block>
  </div>} />;
}

// --- O'tish rejasi 1: o'quvchi darsining xaritasi (m4a-01, 22 ekran) ---
const MAP = [
  { t: 'Kirish', s: 's0–s1', d: "1240 qatorli server.js og'rig'i → «tayyor loyihani clone qilamiz», 4 qadam rejasi", m: "Siz buni shu darsning 2-ekranida ko'rdingiz: o'quvchi ham aynan shu og'riqdan boshlaydi. Nest nomini erta aytmang, avval og'riq." },
  { t: 'Clone va ishga tushirish', s: 's2–s4', d: "git clone + npm install, .env to'ldirish, start:dev; test: kalit qayerda turadi", m: "Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang." },
  { t: 'Swagger va bino xaritasi', s: 's5–s8', d: "Swagger eshiklari (endpoint'lar), papka strukturasi; test: Controller vazifasi", m: "«Ofitsiant» so'zi shu yerda kiradi. Strukturada yashil fayllarni (module/controller/service) o'zingiz ko'rsating." },
  { t: "Buyurtma yo'li", s: 's9–s10', d: 'Guard → Controller → Service → Repository → successRes tartibi sudrab teriladi; test', m: "Bu bizning «so'rov yo'li» ekranimiz, faqat ikki bekat ko'p: Guard tokenni tekshiradi, Repository bazaga yozadi. Har biriga bir gap — 33-ekrandagi tayyor gaplar." },
  { t: 'Qatlamlar', s: 's11–s16', d: 'Entity/BaseEntity, DTO (201/400), BaseService (CRUD tayyor), Module (smena), 5 qadam tartibi; test', m: "Chuqur emas: har biriga bir gap. Entity — jadval shakli, DTO — kiruvchi ma'lumot shakli (noto'g'ri bo'lsa 400), BaseService — tayyor CRUD, Module — ro'yxat. Xavotir olmang: Entity, DTO va Repository'ni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz." },
  { t: 'Qurish va yakun', s: 's18–s20', d: "AI 5 faylni yozadi, yakuniy debugging (xato qatorni olib tashlash), amaliy topshiriq, arena, kartochkalar", m: "Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi." },
];
const R1 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · «Nest arxitektura — tirik ko'rish»", title: "O'quvchi darsining xaritasi: 6 blok, 22 ekran",
  segments: [
    { id: 'a', key: "O'quvchi darsi <b>m4a-01</b>: 6 blok, 22 ekran — har blokda siz nima deysiz", text: "Loyihani ham, o'quvchi tilini ham bilasiz. Endi o'quvchi darsining o'zini ekranma-ekran ko'ramiz, chunki siz uni o'tasiz. Yigirma ikki ekran, oltita blok. Har blok uchun o'quvchi nima qiladi va siz nima deysiz.", hl: [] },
    { id: 'b', key: "1-blok · kirish: o'quvchi ham <b>o'sha og'riqdan</b> boshlaydi — Nest nomini erta aytmang", text: "Birinchi blok, kirish: o'quvchi ming ikki yuz qirq qatorli faylni ko'radi va tayyor loyihani clone qilish rejasini oladi. Siz buni shu darsning boshida ko'rdingiz. Nest nomini erta aytmang, avval og'riq.", hl: [0] },
    { id: 'c', key: "2-blok · clone va ishga tushirish: <b>eng ko'p vaqt</b> shu yerda ketadi", text: "Ikkinchi blok, clone va ishga tushirish: git clone, npm install, env fayli, start dev. Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang.", hl: [1] },
    { id: 'd', key: "3-blok · Swagger va papka strukturasi: <b>«ofitsiant»</b> so'zi shu yerda kiradi", text: "Uchinchi blok: Swagger'da eshiklarni ko'radi, keyin papka strukturasini. Ofitsiant so'zi shu yerda kiradi. Strukturada module, controller, service fayllarini o'zingiz ko'rsating.", hl: [2] },
    { id: 'e', key: "4-blok · buyurtma yo'li: bizning so'rov yo'li + <b>Guard va Repository</b>", text: "To'rtinchi blok, buyurtma yo'li: o'quvchi nazoratchi, ofitsiant, oshpaz, omborchi, lagan tartibini sudrab teradi. Bu bizning so'rov yo'li ekranimiz, faqat ikki bekat ko'p: Guard tokenni tekshiradi, Repository bazaga yozadi. Har biriga bitta gap yetarli.", hl: [3] },
    { id: 'f', key: "5-blok · qatlamlar: Entity, DTO, BaseService — <b>har biriga bir gap</b>, chuqur emas", text: "Beshinchi blok, qatlamlar: Entity, DTO, BaseService, Module va besh qadam tartibi. Chuqur emas, har biriga bir gap. Entity, jadval shakli. DTO, kiruvchi ma'lumot shakli, noto'g'ri bo'lsa to'rt yuz. BaseService, tayyor CRUD metodlari. Module, ro'yxat. Xavotir olmang: Entity, DTO va Repository'ni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz. O'quvchi darsining bu blokida esa bir gap yetarli.", hl: [4] },
    { id: 'g', key: "6-blok · AI bilan qurish va debugging: <b>Controller'da hisob bo'lmaydi</b> qoidasi ishlaydi", text: "Oltinchi blok: o'quvchi AI'ga beshta faylni yozdiradi, keyin yakuniy debugging, xato qatorni topib olib tashlaydi, so'ng amaliy topshiriq va arena. Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi. AI yozgan kodni esa oltinchi bosqichdagidek tekshirasiz: to'rt savol va uchta kutilmagan so'rov.", hl: [5] },
    { id: 'h', key: "Xulosa: eng ko'p kuch — <b>2-blok (server)</b> va <b>6-blok (debugging)</b>", text: "Xulosa: oltita blokdan ikkitasi sizdan eng ko'p kuch talab qiladi. Ikkinchisi, chunki hammaning serveri ishlashi kerak. Oltinchisi, chunki debugging'da bugungi qoidani o'quvchi o'zi topishi kerak.", hl: [1, 5] },
  ],
};
function ScreenR1(p) {
  return <Lesson p={p} S={R1} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{seg.hl.includes(i) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{t('Siz: ', 'Вы: ')}{b.m}</div>}</div>
    </div>)}
  </div>} />;
}

// --- O'tish rejasi 2: o'quvchilar xato qiladigan joylar ---
const STUMBLE = [
  { q: 'git clone ishlamaydi', a: "Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring." },
  { q: 'npm install uzoq yoki xato', a: "Sabr: 2–5 daqiqa normal. Xato bo'lsa Node versiyasini tekshiring (20+), node_modules'ni o'chirib qayta urining." },
  { q: ".env to'ldirilmagan — server yiqiladi", a: "Loyiha PostgreSQL'ga ulanadi: «Unable to connect to the database» — ikkinchi satr sababni aytadi (keyingi ekranda to'rt xabar). cp .env.example .env, keyin PostgreSQL ishlayotganini tekshiring." },
  { q: 'Port 3000 band', a: "Oldingi dars serveri ochiq qolgan. Uni yoping yoki PORT=3001 bilan ishga tushiring." },
  { q: "«can't resolve dependencies»", a: "Siz endi o'qiy olasiz: qaysi klass, qaysi dependency, qaysi fayl. O'quvchi bilan birga terminaldagi xabarni o'qing, javobni aytmang, savol bering: qaysi fayl? qaysi ro'yxat?" },
  { q: '«Nega Express emas?» yoki metafora chalkashdi', a: "Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring: oshpaz, ya'ni Service." },
];
const R2 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · darsda nima bo'ladi", title: "O'quvchilar xato qiladigan 6 joy",
  segments: [
    { id: 'a', key: "Sinfda <b>albatta</b> uchraydigan 6 holat — har biriga tayyor javobingiz bo'lsin", text: "Rejani bilasiz. Endi reja buziladigan joylarni ko'raylik: darsda albatta uchraydigan oltita holat. Har biriga tayyor javobingiz bo'lsin.", hl: [] },
    { id: 'b', key: "1 · <code>git clone</code> ishlamaydi → zaxira: GitHub'dan <b>ZIP yuklab olish</b>", text: "Birinchi: git clone ishlamaydi. Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring.", hl: [0] },
    { id: 'c', key: "2 · <code>npm install</code> uzoq yoki xato → 2–5 daqiqa normal, <b>Node 20+</b>", text: "Ikkinchi: npm install uzoq yoki xato. Ikki-besh daqiqa normal. Xato bo'lsa Node versiyasini tekshiring, yigirma yoki undan yuqori bo'lsin, node modules papkasini o'chirib qayta urining.", hl: [1] },
    { id: 'd', key: "3 · <code>.env</code> yo'q yoki PostgreSQL ishlamaydi → server <b>yiqiladi</b>", text: "Uchinchi, eng muhimi: env fayli yaratilmagan. Loyiha PostgreSQL'ga ulanadi. Bazaning manzili bo'lmasa yoki PostgreSQL ishlamasa, server ishga tushmaydi: Unable to connect to the database. Keyingi ekranda shu xatoning to'rt ko'rinishini o'qiymiz.", hl: [2] },
    { id: 'e', key: "4 · port 3000 band → <b>oldingi serverni yoping</b> yoki boshqa port bering", text: "To'rtinchi: port uch ming band. Oldingi dars serveri ochiq qolgan. Uni yoping yoki boshqa port bilan ishga tushiring.", hl: [3] },
    { id: 'f', key: "5 · «can't resolve» → o'quvchi bilan <b>birga o'qing</b>, javobni aytmang", text: "Beshinchi: can't resolve dependencies xatosi. Siz endi o'qiy olasiz: qaysi klass, qaysi dependency, qaysi fayl. O'quvchi bilan birga terminaldagi xabarni o'qing, javobni aytmang, savol bering: qaysi fayl, qaysi ro'yxat.", hl: [4] },
    { id: 'g', key: "6 · «Nega Express emas?» → <b>bitta gap</b>: tartib kerak, ichida o'sha Express", text: "Oltinchi: nega Express emas degan savol yoki metafora chalkashuvi. Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring.", hl: [5] },
    { id: 'h0', key: "Ogohlantirish: o'quvchi loyihasida route'lar <code>/api/v1</code> bilan boshlanadi — prefiks unutilsa <b>404</b>", text: "Yana bitta ogohlantirish: o'quvchi loyihasida hamma route api v1 bilan boshlanadi, admin emas, api v1 admin. Prefiks unutilsa to'rt yuz to'rt chiqadi. Bu loyihani keyingi mentor darsida to'liq, clone qilib ko'rasiz.", show: "Yana bitta ogohlantirish: o'quvchi loyihasida hamma route <code>/api/v1</code> bilan boshlanadi — <code>/admin</code> emas, <code>/api/v1/admin</code>; prefiks unutilsa <b>404</b>. Bu loyihani keyingi mentor darsida to'liq, clone qilib ko'rasiz.", hl: [] },
    { id: 'h', key: "Xulosa: darsdan oldin loyihani <b>o'zingiz bir marta ko'taring</b> — o'quvchilar xato qiladigan joyni oldindan bilasiz", text: "Xulosa: bu holatlarning ko'pi darsning birinchi yigirma daqiqasida chiqadi. Shuning uchun darsdan oldin loyihani o'zingiz bir marta clone qilib, env bilan ishga tushirib ko'ring: qayerda qoqilish mumkinligini o'zingiz his qilasiz.", show: "Xulosa: bu holatlarning ko'pi darsning birinchi 20 daqiqasida chiqadi. Darsdan oldin loyihani o'zingiz bir marta clone qilib, .env bilan ishga tushirib ko'ring: qayerda qoqilish mumkinligini o'zingiz his qilasiz.", hl: [] },
  ],
};
function ScreenR2(p) {
  return <Lesson p={p} S={R2} scene={({ seg }) => <div className="mk-qa">
    {STUMBLE.map((s, i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {s.q}</b>{(seg.hl.includes(i) || seg.hl.length === 0) && <p>{s.a}</p>}</button>)}
  </div>} />;
}

// --- O'tish rejasi 2b: sinfda chiqadigan xato — baza ulanmadi (haqiqiy chiqishlar: manba/nest-out/15–18) ---
const DB_ERRS = [
  { at: 1, id: 'db1', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 1, id: 'db1', h: `Error: connect <span class="er">ECONNREFUSED</span> 127.0.0.1:5432` },
  { at: 2, h: `` },
  { at: 2, id: 'db2', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 2, id: 'db2', h: `Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: <span class="er">client password must be a string</span>` },
  { at: 3, h: `` },
  { at: 3, id: 'db3', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 3, id: 'db3', h: `error: <span class="er">password authentication failed for user "postgres"</span>` },
  { at: 4, h: `` },
  { at: 4, id: 'db4', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 4, id: 'db4', h: `error: <span class="er">database "cars_db" does not exist</span>` },
  { at: 5, h: `` },
  { at: 5, id: 'db5', h: `ERROR [TypeOrmModule] Unable to connect to the database. Retrying (10)...` },
  { at: 5, id: 'db5', h: `<span class="er">ERROR [ExceptionHandler] error: …</span>   <span class="cm">← 10 urinishdan keyin server yiqiladi</span>` },
];
const DB_ROWS = [
  { at: 1, m: 'connect ECONNREFUSED 127.0.0.1:5432', s: "PostgreSQL ishlamayapti yoki port noto'g'ri", f: "<b>PostgreSQL'ni ishga tushiring</b>: Windows — Services → postgresql → Start · Mac — <code>brew services start postgresql</code> · Linux — <code>sudo systemctl start postgresql</code>. Keyin .env'dagi port 5432 ekanini tekshiring" },
  { at: 2, m: 'client password must be a string', s: ".env yo'q yoki DEV_DB_URL o'qilmagan (parol undefined)", f: "<b>Loyiha papkasida: <code>cp .env.example .env</code></b> (Windows: <code>copy .env.example .env</code>). Ichida <code>DEV_DB_URL</code> tayyor — parolni o'zingiznikiga almashtiring, serverni qayta ishga tushiring" },
  { at: 3, m: 'password authentication failed for user', s: ".env'dagi parol yoki foydalanuvchi noto'g'ri", f: ".env.example'da parol shunchaki <code>password</code> — <code>DEV_DB_URL</code>'ga o'z PostgreSQL parolingizni yozing; <code>psql -U postgres</code> bilan sinang" },
  { at: 4, m: 'database "…" does not exist', s: "ulanish va parol to'g'ri, lekin shu nomli baza yaratilmagan", f: "bazani yarating: <code>createdb -U postgres nestarxitechture</code> (nom — DEV_DB_URL oxiridagi so'z)" },
];
const RDB = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · sinfda eng ko'p chiqadigan xato", title: "Baza ulanmadi: to'rt xabar, to'rt sabab",
  segments: [
    { id: 'a', key: "O'quvchi loyihasi <b>PostgreSQL'ga ulanadi</b> — sinfdagi 1-xato shu, sabab doim <b>2-satrda</b>", text: "Oldingi ekrandagi uchinchi holatni, env va PostgreSQL'ni, alohida ko'ramiz, chunki sinfda eng ko'p vaqt shunga ketadi. Bugun to'rt Nest xatosini o'rgandingiz. Lekin sinfda eng ko'p chiqadigani boshqa: o'quvchi loyihasi PostgreSQL'ga ulanadi, va ulanish ko'pincha birinchi urinishda bo'lmaydi. Xabar har doim bir xil boshlanadi: Unable to connect to the database, Retrying. Sabab esa ikkinchi satrda. To'rtta haqiqiy holat." },
    { id: 'b', key: "1 · <b>ECONNREFUSED</b> → PostgreSQL ishlamayapti: <b>PostgreSQL'ni ishga tushiring</b>", text: "Birinchi: connect ECONNREFUSED, manzil va port. Demak shu portda hech kim javob bermayapti: PostgreSQL ishlamayapti yoki env faylida port noto'g'ri. Yechim: PostgreSQL'ni ishga tushiring. Windows'da Services oynasida postgresql'ni Start qilasiz, Mac va Linux'da jadvaldagi buyruq bilan. Keyin portni tekshiring.", show: "<b>connect ECONNREFUSED 127.0.0.1:5432</b>: shu portda hech kim javob bermayapti — PostgreSQL ishlamayapti yoki .env'dagi port noto'g'ri. Yechim: <b>PostgreSQL'ni ishga tushiring</b> (Windows: Services → postgresql → Start; Mac/Linux: jadvaldagi buyruq), keyin portni tekshiring." },
    { id: 'c', key: "2 · <b>client password must be a string</b> → .env yo'q: <code>cp .env.example .env</code>", text: "Ikkinchi, eng chalg'ituvchisi: client password must be a string. Bu parol noto'g'ri degani emas. Parol umuman yo'q, undefined: env fayli yo'q. O'quvchi loyihasida tayyor namuna bor, env example fayli. Yechim bitta: shu namunadan nusxa olib, env faylini yaratish, ichidagi parolni o'ziniki bilan almashtirish va serverni qayta ishga tushirish. Sinfda buni hammaga birinchi bo'lib ayting.", show: "<b>client password must be a string</b> — eng chalg'ituvchisi: parol noto'g'ri emas, parol <b>umuman yo'q</b> (undefined) — .env fayli yo'q. Loyihada tayyor namuna bor: <b>.env.example</b>. Yechim: <code>cp .env.example .env</code>, ichidagi parolni o'zingiznikiga almashtiring, serverni qayta ishga tushiring. Sinfda buni hammaga birinchi bo'lib ayting." },
    { id: 'd', key: "3 · <b>password authentication failed</b> → .env'dagi parol noto'g'ri: <b>o'z parolingizni</b> yozing", text: "Uchinchi: password authentication failed for user. Bu endi haqiqatan parol yoki foydalanuvchi nomi noto'g'ri. Sinfda bu tez-tez chiqadi, chunki env example'dagi parol shunchaki password so'zi. Yechim: DEV DB URL ichiga o'quvchining o'z PostgreSQL parolini yozish.", show: "<b>password authentication failed for user \"postgres\"</b>: endi haqiqatan parol yoki foydalanuvchi noto'g'ri. Sinfda tez-tez chiqadi: .env.example'dagi parol shunchaki <code>password</code>. Yechim: <code>DEV_DB_URL</code>'ga o'z PostgreSQL parolingizni yozing." },
    { id: 'd2', key: "4 · <b>database … does not exist</b> → baza yaratilmagan: <code>createdb</code>", text: "To'rtinchi: database, nomi, does not exist. Ulanish bor, parol ham to'g'ri, lekin PostgreSQL'da bunday nomli baza yo'q: uni hali hech kim yaratmagan. O'quvchi loyihasida nom DEV DB URL oxirida, nestarxitechture. Yechim: shu nom bilan bazani yaratish.", show: "<b>database \"…\" does not exist</b>: ulanish va parol to'g'ri, lekin bunday nomli baza <b>yaratilmagan</b>. O'quvchi loyihasida nom <code>DEV_DB_URL</code> oxirida: <code>nestarxitechture</code>. Yechim: <code>createdb -U postgres nestarxitechture</code>." },
    { id: 'e', key: "Xulosa: «Unable to connect» → <b>kodga tegmang</b> — 2-satrni o'qing, .env va PostgreSQL'ni tekshiring", text: "TypeORM o'n marta qayta urinadi, keyin server yiqiladi. Xulosa va qoida: Unable to connect ko'rsangiz, kodga tegmang, muammo kodda emas. Ikkinchi satrni o'qing, env faylini va PostgreSQL'ni tekshiring. Bu to'rt xabar eslatmada ham bor." },
  ],
};
function ScreenRdb(p) {
  return <Lesson p={p} S={RDB} scene={({ seg, beat }) => (<>
    {beat < 5 && <CodePanel file={t('terminal — haqiqiy chiqishlar (sinovdagi baza nomi: cars_db)', 'terminal — реальный вывод (имя базы в проверке: cars_db)')} numbers={false} wrap style={{ background: '#1F1115' }} beat={beat} lines={DB_ERRS.filter((l) => l.at === Math.min(beat, 4) || l.at == null)} focus={beat >= 1 && beat <= 4 ? ['db' + beat] : []} />}
    <Block at={1} beat={beat}><table className="mk-tbl"><thead><tr><th>{t('xabar (2-satr)', 'сообщение (2-я строка)')}</th><th>{t('sabab', 'причина')}</th><th>{t('yechim', 'решение')}</th></tr></thead><tbody>
      {DB_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.m}</code></td><td>{r.s}</td><td dangerouslySetInnerHTML={html(r.f)} /></tr>)}
    </tbody></table></Block>
    <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>«Unable to connect»</b> → TypeORM 10 marta qayta urinadi, keyin server yiqiladi. <b>Kodga tegmang:</b> 2-satrni o'qing, <code>.env</code> va PostgreSQL'ni tekshiring.</>, <><b>«Unable to connect»</b> → TypeORM делает 10 попыток, потом сервер падает. <b>Код не трогайте:</b> прочитайте 2-ю строку, проверьте <code>.env</code> и PostgreSQL.</>)}</div></Block>
  </>)} />;
}

// --- O'tish rejasi 3: 90 daqiqa ---
const PLAN90 = [
  { t: '0–10', n: "Kirish va og'riq", d: 'server.js misoli, 4 qadam rejasi' },
  { t: '10–30', n: 'Clone va ishga tushirish', d: "hammada server ishlaguncha; .env va PostgreSQL" },
  { t: '30–45', n: 'Swagger, bino xaritasi, 1–2-test', d: 'eshiklar, papkalar, «ofitsiant»' },
  { t: '45–60', n: "Buyurtma yo'li, 3-test", d: 'Guard → Controller → Service → Repository → successRes' },
  { t: '60–75', n: 'Qatlamlar, 4-test', d: 'Entity, DTO, BaseService, Module — nom va vazifa' },
  { t: '75–90', n: 'AI qurish, debugging, arena', d: "bugungi qoida: Controller'da hisob yo'q" },
];
const R3 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: 'm4a-01 · 90 daqiqa (taklif)', title: "Vaqt rejasi va uch qoida",
  segments: [
    { id: 'a', key: "Taklif: <b>90 daqiqa, oltita bo'lak</b> — sinfingizga qarab o'zgartirasiz", text: "O'quvchilar xato qiladigan joylarni va ularning yechimini bilasiz. Endi vaqtni rejalaymiz. Taklif qilingan vaqt rejasi: to'qson daqiqa, oltita bo'lak. Bu taklif, sinfingizga qarab o'zgartirasiz.", hl: [] },
    { id: 'b', key: "0–30: kirish va clone — <b>hammada server ishlaguncha</b> oldinga o'tmang", text: "Birinchi o'ttiz daqiqa: kirish va clone. Eng xavfli bo'lak clone va ishga tushirish, shuning uchun unga yigirma daqiqa.", hl: [0, 1] },
    { id: 'c', key: "30–60: Swagger, papkalar xaritasi, <b>buyurtma yo'li</b> va uchta test", text: "O'ttizdan oltmishgacha: Swagger, bino xaritasi, buyurtma yo'li va uchta test.", hl: [2, 3] },
    { id: 'd', key: "60–90: qatlamlar, <b>AI bilan qurish</b>, debugging va arena", text: "Oltmishdan to'qsongacha: qatlamlar, AI bilan qurish, yakuniy debugging va arena.", hl: [4, 5] },
    { id: 'e', key: "Xulosa — uch qoida: <b>server avval · ikki so'z birga · xabarni birga o'qish</b>", text: "Xulosa: uch qoida. Birinchi: hammaning serveri ishlamaguncha oldinga o'tmang. Ikkinchi: metafora va atamani birga ayting, oshpaz, ya'ni Service. Uchinchi: xato chiqsa terminaldagi xabarni o'quvchi bilan birga o'qing, javobni aytmang.", hl: [] },
  ],
};
function ScreenR3(p) {
  return <Lesson p={p} S={R3} scene={({ seg, beat }) => (<>
    <div style={{ display: 'grid', gap: 8 }}>
      {PLAN90.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1, alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 56 }}>{b.t}</span>
        <div className="t"><b style={{ marginBottom: 0 }}>{b.n}</b><div className="exp">{b.d}</div></div>
      </div>)}
    </div>
    <Block at={4} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {t([['Server avval', "hammada ishlamaguncha oldinga o'tmang"], ["Ikki so'z birga", '«oshpaz, ya\'ni Service»'], ['Xabarni birga o\'qing', "javobni aytmang, savol bering"]], [['Сначала сервер', 'пока не работает у всех, дальше не идите'], ['Два слова вместе', '«повар, то есть Service»'], ['Читайте сообщение вместе', 'ответ не говорите, задавайте вопрос']]).map(([h, d], i) => <div key={h} className="mk-card" style={{ borderColor: T.accent, animation: `mk-up .4s ${i * 0.15}s ease both` }}><h5 style={{ color: T.accent }}>{h}</h5><div style={{ fontSize: 13 }}>{d}</div></div>)}
    </div></Block>
  </>)} />;
}

// --- S26 O'quvchi so'raydigan savollar ---
const QA = [
  ['Nega Express emas, Nest?', "Loyiha katta bo'lganda tartib kerak; Nest tartibni majburiy qiladi, ichida esa o'sha Express."],
  ["Decorator nima o'zi?", "Klass yoki metod ustidagi belgi; Nest'ga shu narsa nima ekanini aytadi, kod bajarmaydi."],
  ['providers nima?', "Shu modul yaratib beradigan narsalar, asosan Service'lar."],
  ["Service'ni nega alohida qildik?", "Alohida sinash va qayta ishlatish uchun; Controller'da esa logika qolmaydi."],
  ["Nest Express'dan tezmi?", "Yo'q, tezlik bir xil, ichida Express. Nest tezlik emas, tartib beradi."],
  ["Injectable'ni o'chirdim, ishlayapti. Kerak emasmi?", "Dependency'si bo'lmagani uchun ishladi; dependency paydo bo'lganda server ishga tushadi, lekin so'rovda 500 TypeError — yashirin xato. Shuning uchun doim yoziladi."],
];
const S26 = {
  kicker: "7-bosqich · savollar", title: "O'quvchi so'raydigan savollar",
  segments: [
    { id: 'a', key: "Darsda sizga beriladigan <b>6 savol</b> va tayyor javoblar", text: "Dars rejasi tayyor. Oxirgi tayyorgarlik: o'quvchi sizga beradigan savollar. Ular taxminan shular bo'ladi.", hl: [] },
    { id: 'q1', key: "1 · «Nega Express emas?» → katta loyihada <b>tartib kerak</b>, ichida o'sha Express", text: "Birinchisi: nega Express emas, Nest? Javob: loyiha katta bo'lganda tartib kerak, Nest tartibni majburiy qiladi, ichida esa o'sha Express.", hl: [0] },
    { id: 'q2', key: "2 · «Decorator nima?» → klass ustidagi <b>belgi</b>: Nest'ga «bu nima»ligini aytadi", text: "Ikkinchisi: decorator nima? Klass yoki metod ustidagi belgi, Nest'ga shu narsa nima ekanini aytadi.", hl: [1] },
    { id: 'q3', key: "3 · «providers nima?» → modul <b>yaratib beradigan</b> narsalar, asosan Service'lar", text: "Uchinchisi: providers nima? Shu modul yaratib beradigan narsalar, asosan Service'lar.", hl: [2] },
    { id: 'q4', key: "4 · «Nega alohida Service?» → <b>alohida sinash</b> va qayta ishlatish uchun", text: "To'rtinchisi: Service'ni nega alohida qildik? Alohida sinash va qayta ishlatish uchun, Controller'da esa logika qolmaydi.", hl: [3] },
    { id: 'q5', key: "5 · «Nest tezroqmi?» → yo'q, ichida Express; Nest <b>tezlik emas, tartib</b> beradi", text: "Beshinchisi: Nest tezmi? Yo'q, tezlik bir xil, chunki ichida Express. Nest tezlik emas, tartib beradi.", hl: [4] },
    { id: 'q6', key: "6 · «Injectable'siz ishlayapti-ku?» → hozircha; dependency qo'shilsa — <b>yashirin xato, 500</b>", text: "Oltinchisi: Injectable'ni o'chirdim, ishlayapti. Dependency'si bo'lmagani uchun; dependency paydo bo'lganda server ishga tushadi, lekin so'rovda besh yuz, yashirin xato. Shuning uchun doim yoziladi.", hl: [5] },
    { id: 'z', key: "Xulosa: javob bera olmagan savolingiz bo'lsa — <b>darsdagi o'sha ekranga</b> qayting", text: "Xulosa: bu oltita javob sizda tayyor bo'lsin. Har kartani bosib, javobni o'zingiz yana o'qing. O'zingiz javob bera olmaydigan savol bo'lsa, darsdagi o'sha ekranga qayting.", hl: [], closeAll: true },
  ],
};
function Screen26(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S26} scene={({ seg }) => {
    const isOpen = (i) => seg.hl.includes(i) || (!seg.closeAll ? false : open.includes(i)) || open.includes(i);
    return <div className="mk-qa">
      {QA.map(([q, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{i + 1}. {q}</b>{isOpen(i) && <p>{a}</p>}</button>)}
    </div>;
  }} />;
}

// --- S27 O'z-sinov — 8 savol, HAR SAVOLDA BITTA URINISH ---
const FINAL = [
  { q: "Nest ichida so'rovni haqiqatda qaysi kutubxona qabul qiladi?", o: ["Nest'ning o'z HTTP serveri", 'Express (platform-express)', 'Node http moduli bevosita', 'Har doim Fastify'], c: 1, e: "Nest Express ustidagi qatlam; Fastify'ga almashtirish mumkin, lekin standart Express.", s: 3 },
  { q: "@Controller('cars') va @Get(':id') birga qaysi path'ni ochadi?", o: ['/cars?id=5', '/id/cars', '/cars/5', '/:id/cars'], c: 2, e: "Controller prefiksi + metod yo'li.", s: 18 },
  { q: 'POST metodida status yozilmagan. Nest nima qaytaradi?', o: ['200', '201', '204', '202'], c: 1, e: "Nest POST uchun 201 ni o'zi qo'yadi.", s: 20 },
  { q: "«Nest can't resolve dependencies of the X (?)» — so'roq belgisi nimani bildiradi?", o: ["Noma'lum modul — import yo'q", "Topilmagan argumentning o'rni", "Sintaksis xatosi — qavs yopilmagan", "Route yo'q — Controller bo'sh"], c: 1, e: 'Qavs ichida konstruktor argumentlari, ? — topilmagani.', s: 23 },
  { q: "Server «successfully started», /cars 404, terminalda Mapped {/cars…} yo'q. Eng ehtimoliy sabab?", o: ["CarsModule AppModule imports'ida yo'q", "Injectable yo'q — CarsService ulanmagan", "Port band — server boshqa portda", "Service'da xato — u 404 qaytaradi"], c: 0, e: "Yashirin xato: modul ulanmagan, Nest papkani o'qimagan.", s: 24 },
  { q: "Service ichida throw new Error('x'). Mijozga nima boradi?", o: ['404 va «x»', '500 Internal server error', '400', 'Hech narsa, server yiqiladi'], c: 1, e: 'Oddiy Error → 500, xabar yashiriladi.', s: 28 },
  { q: "Yangi xabar: «Nest can't resolve dependencies of the UsersService (?, JwtService). Please make sure that the argument ConfigService at index [0] is available in the UsersModule module.» Nima qilasiz?", o: ["users.module.ts — providers'ga ConfigService", "users.service.ts — konstruktordan JwtService'ni o'chirish", "app.module.ts — controllers'ga UsersService qo'shish", "UsersService'ga @Injectable() qo'shish"], c: 0, e: "Klass: UsersService · dependency: ConfigService, index [0] · fayl: users.module.ts (UsersModule). JwtService topilgan (ikkinchi o'rin), muammo unda emas.", s: 23 },
  { q: "orders.module.ts: controllers: [OrdersController], providers: [] — OrdersController konstruktorida OrdersService so'ralgan. Server nima qiladi?", o: ["Ishga tushadi, /orders → 404 qaytadi", "Yiqiladi: can't resolve dependencies (?)", "Ishga tushadi, /orders → 500 qaytadi", "Yiqiladi: invalid controller detected"], c: 1, e: "providers bo'sh → Nest OrdersService'ni topa olmaydi → ishga tushishda yiqiladi (1-buzish bilan bir xil).", s: 23 },
];
function Screen27(p) {
  const st = p.stored || {};
  // Kirish gapi holatga qarab (F-1030-19): birinchi marta — sinov sharti; natijadan ekranga borib qaytganda — xatolarni o'rganishda davom etish;
  // o'tgan bo'lsa — natija saqlangan. Qayta o'qilmaydi.
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult
      ? 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов. Это честная проверка себя: на каждый вопрос одна попытка, после ответа открывается верный вариант и пояснение. Шесть и больше — урок усвоен. Если меньше, вернётесь к указанным экранам и пройдёте тест заново.'
      : sc >= 6
        ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol. Bu o'zingizni halol o'lchash: har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi darsiga kirsangiz, har so'z tanish bo'ladi.", 'Урок усвоен. Теперь, когда вы откроете урок ученика, каждое слово будет знакомым.') : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring. Bu normal holat, Nest birinchi kunda hammaga ham o'tirmaydi.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново. Это нормально: Nest не у всех укладывается в первый день.'))), 400);
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

// --- S28 Yakun + eslatma ---
const CHEATSHEET = `# Nest-1 — mentor eslatmasi
## Buyruqlar
npm i -g @nestjs/cli@12 · nest new cars-api -p npm --type cjs --no-observe --skip-skills · npm run start:dev
nest g module cars · nest g controller cars --no-spec · nest g service cars --no-spec
## Uch bo'lak
Controller — so'rovni oladi, Service'ni chaqiradi, qaytaradi (logika yozilmaydi)
Service — ish: hisob, qoida, baza; req/res yo'q; @Injectable()
Module — ro'yxat: imports · controllers · providers; ro'yxatda yo'q = Nest uchun yo'q
## Dependency Injection
constructor(private readonly carsService: CarsService) — siz yaratmaysiz, Nest providers'dan yaratib beradi (1 instance)
## 4 xato
1 «can't resolve dependencies of the X (?) … argument Y at index [0] … in the Z module» → Z modulining providers'iga Y
2 server ishga tushdi, /cars 404, terminalda Mapped {/cars…} yo'q → AppModule imports: [CarsModule]
3 «invalid controller … does not have the @Controller() decorator» → decorator'ni qaytaring
4 @Injectable'siz ishlaydi (dependency yo'q) → dependency qo'shilsa: server ishga tushadi, so'rovda 500 TypeError (yashirin xato) → baribir yoziladi
## Baza ulanmadi (o'quvchi loyihasi, TypeORM — «Unable to connect to the database. Retrying (1)…», 10 urinish, keyin yiqiladi)
connect ECONNREFUSED 127.0.0.1:5432 → PostgreSQL'ni ishga tushiring (Windows: Services → postgresql; Mac: brew services start postgresql; Linux: sudo systemctl start postgresql)
SASL … client password must be a string → .env yo'q: cp .env.example .env, parolni o'zingiznikiga almashtiring
password authentication failed for user → .env.example'dagi parol «password» — DEV_DB_URL'ga o'z parolingiz
database "…" does not exist → createdb -U postgres nestarxitechture (nom — DEV_DB_URL oxirida)
## Yordam
Hech biri mos kelmasa: skrinshot + xato matni → mentor-kurs Telegram guruhi
## Xato turi
HttpException oilasi (NotFound 404, BadRequest 400, Unauthorized 401, Forbidden 403) → status + xabar · oddiy Error → 500, xabar yashirin
## Javoblar
GET /cars 200 · GET /cars/1 200 · GET /cars/99 404 · POST /cars 201 (o'zi) · /cars/abc → 404 «NaN» (tekshiruv yo'q; @Param('id', ParseIntPipe) yoki DTO + ValidationPipe → 400)
## O'quvchi darsi tili
ofitsiant=Controller · oshpaz=Service · omborchi=Repository · javon chizmasi=Entity · anketa=DTO · nazoratchi=Guard · shtat jadvali=Module
## Uch qoida (dars o'tishda)
hammada server ishlaguncha oldinga o'tmang · «oshpaz, ya'ni Service» · xato chiqsa terminaldagi xabarni birga o'qing, javobni aytmang
## AI yozgan kodni tekshirish
4 savol: fayllar (module · controller · service) · ro'yxatlar (providers, AppModule imports, terminalda Mapped) · logika Service'da · decorator'lar
3 kutilmagan so'rov: harfli id (/customers/abc → 400, 404 «NaN» emas) · bo'sh body ({} → 400, 201 emas) · begona maydon ("id": 1 → id'ni server beradi)
Yoyish tartibi: { ...data, id } — id oxirida; { id, ...data } — body'dagi id ustidan yozadi
TS1272 «must be imported with 'import type'» → Controller'dagi tipni import type bilan oling
## Lug'at
decorator — @ bilan boshlanadigan belgi · provider — modul yaratib beradigan narsa (asosan Service) · instance — klassdan yasalgan obyekt · inject — Nest'ning tayyor obyektni konstruktorga berishi · path — manzil, route — path + metod · Mapped — terminaldagi ulangan route satri · pipe — kiruvchi qiymatni tekshiradi yoki o'zgartiradi (ParseIntPipe) · DTO — kiruvchi ma'lumot shakli · HttpException — status bilan qaytadigan xatolar oilasi · CLI — nest g buyruqlari
## Uyga vazifa
cars-api'ga users moduli: nest g module/controller/service users · Service: ro'yxat + findAll/findOne/create, topilmasa NotFoundException · Controller: GET /users · GET /users/:id · POST /users · bir marta ataylab buzing (providers bo'sh) va tuzating · GitHub'ga push → repo linki platformadagi uyga vazifaga`;
// --- S28 Yakun (F-1030-20): Barakalla → animatsion xulosa (so'rov yo'li qayta chiziladi, 6 band birin-ketin) → uyga vazifa → eslatma → «Darsni yakunlash» ---
// hl — xulosa xaritasida yoritiladigan qism: all · ctrl · svc · mod · di · err
const S28_ITEMS = [
  { k: 'all', t: "Nest — Express ustidagi majburiy tartib" },
  { k: 'ctrl', t: "Controller so'rovni oladi — unda logika yozilmaydi" },
  { k: 'svc', t: "Service ishni bajaradi va so'rov haqida bilmaydi" },
  { k: 'mod', t: "Module — ro'yxat, Nest faqat ro'yxatdagini ko'radi" },
  { k: 'di', t: 'Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi' },
  { k: 'err', t: "Nest xatosi o'qiladi: qaysi klass · qaysi dependency · qaysi fayl" },
  { k: 'ai', t: "AI yozgan kod: 4 savol va 3 kutilmagan so'rov bilan tekshiriladi" },
];
const HOMEWORK = [
  { t: 'users moduli', c: ['nest g module users', 'nest g controller users --no-spec', 'nest g service users --no-spec'] },
  { t: "Service: foydalanuvchilar ro'yxati + findAll, findOne, create; topilmasa NotFoundException", c: [] },
  { t: 'Controller: GET /users · GET /users/:id · POST /users — terminalda 3 ta Mapped', c: [] },
  { t: "Bir marta ataylab buzing (providers'ni bo'shating), xabarni o'qing, tuzating", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "users moduli"', 'git push'] },
];
const s28Segments = (passed) => s28Ru(passed, [
  passed
    ? { id: 'a', key: "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", text: "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", hl: null }
    : { id: 'a', key: "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", text: "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", hl: null },
  { id: 'b1', key: "Nest — Express ustidagi <b>majburiy tartib</b>", text: "Birinchi: Nest bu Express ustidagi majburiy tartib. Ichida o'sha Express ishlaydi.", hl: 'all' },
  { id: 'b2', key: "<b>Controller</b> so'rovni oladi, Service'ni chaqiradi, javobni qaytaradi — <b>logika yozilmaydi</b>", text: "Ikkinchi: Controller so'rovni oladi, Service'ni chaqiradi va javobni qaytaradi. Unda hisob yo'q.", hl: 'ctrl' },
  { id: 'b3', key: "<b>Service</b> ishni bajaradi va so'rov haqida bilmaydi", text: "Uchinchi: Service ishni bajaradi va so'rov haqida hech narsa bilmaydi. Shuning uchun uni alohida sinash va qayta ishlatish oson.", hl: 'svc' },
  { id: 'b4', key: "<b>Module</b> — ro'yxat: Nest faqat ro'yxatdagini ko'radi", text: "To'rtinchi: Module ro'yxat. Nest faqat ro'yxatda yozilganini ko'radi.", hl: 'mod' },
  { id: 'b5', key: "<b>Dependency Injection</b>: providers'ga yozasiz, konstruktorda so'raysiz — Nest inject qiladi", text: "Beshinchi: Dependency Injection. Siz Service'ni providers'ga yozasiz va konstruktorda so'raysiz, yaratib inject qilishni Nest qiladi.", hl: 'di' },
  { id: 'b6', key: "Nest xatosi <b>o'qiladi</b>: qaysi klass · qaysi dependency · qaysi fayl", text: "Va eng muhimi: Nest xatosi o'qiladi. Xabarda qaysi klass, qaysi dependency yetishmayapti va qaysi faylni ochish kerakligi yozilgan, javob esa ko'pincha modul faylida.", hl: 'err' },
  { id: 'b7', key: "AI yozgan kod: <b>4 savol</b> va <b>3 kutilmagan so'rov</b> bilan tekshiriladi", text: "Va yana bittasi: AI yozgan kodni to'rt savol bilan o'qing va uchta kutilmagan so'rov yuboring: harfli id, bo'sh body va begona maydon.", hl: 'ai' },
  { id: 'hw', key: "<b>Uyga vazifa</b>: cars-api'ga <code>users</code> modulini o'zingiz qo'shing va GitHub'ga chiqaring", text: "Uyga vazifa. cars api loyihangizga users modulini shu darsdagi usulda qo'shing: uchta CLI buyrug'i, Service'da foydalanuvchilar ro'yxati va findAll, findOne, create metodlari, topilmasa NotFoundException. Controller'da uchta route. Keyin bir marta ataylab buzing, masalan providers'ni bo'shating, xabarni o'qing va tuzating. Tayyor loyihani GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying.", hl: 'hw' },
  { id: 'c', key: "<b>Eslatmani oling</b>: buyruqlar, xatolar, qoidalar va uyga vazifa — bir sahifada", text: "Pastda bir sahifalik eslatma: buyruqlar, to'rt Nest xatosi, baza ulanish xatolari, qoidalar, o'quvchi darsi lug'ati va uyga vazifa. Nusxalab yoki yuklab oling, o'quvchi darsini o'tayotganda yoningizda tursin.", hl: 'note' },
  { id: 'z', key: "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", text: "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", hl: 'note' },
]);
// UZ-RU: ruscha segmentlar parts/08-ru.jsx dagi S28_RU dan (id bo'yicha; 'a' — o'tgan/o'tmagan ikki varianti)
const s28Ru = (passed, segs) => (LANG === 'ru' ? segs.map((s) => ({ ...s, ...(S28_RU[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) })) : segs);
// F-1120-02: xulosa — darsning o'sha rasmi (Nest mashinasi); har band rasmning o'z qismini yoritadi
function SummaryMap({ hl }) {
  const one = (k) => (hl === k ? 'hl' : 'dim');
  const st = hl === 'ctrl' ? { ctrl: 'hl', svc: 'dim', mod: 'dim', br: 'dim' }
    : hl === 'svc' ? { svc: 'hl', ctrl: 'dim', mod: 'dim', br: 'dim' }
    : hl === 'mod' ? { mod: one('mod'), ctrl: '', svc: '', br: 'dim' }
    : hl === 'di' ? { mod: 'hl', ctrl: 'hl', svc: '', br: 'dim' }
    : hl === 'err' ? { ctrl: 'hl', svc: 'dim', br: 'dim' } : {};
  const read = hl === 'di' ? ['src/cars/cars.controller.ts', '<span class="n1-k">constructor</span>(<span class="n1-k">private readonly</span> carsService: <span class="n1-c">CarsService</span>) {}']
    : hl === 'err' ? ['terminal', "ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class=\"n1-er\">CarsController (?)</span>."]
    : hl === 'svc' ? ['src/cars/cars.service.ts', 'findAll() { <span class="n1-k">return this</span>.cars; }']
    : hl === 'ctrl' ? ['src/cars/cars.controller.ts', '<span class="n1-d">@Get</span>() findAll() { <span class="n1-k">return this</span>.carsService.findAll(); }'] : null;
  return <div className="mk-light" style={{ padding: 16 }}>
    <NestMachine cfg={N1_CARS} url="localhost:3000/cars" out={hl === 'err' ? null : '[{"id":1,"brand":"Chevrolet",…}, …]'} outKind="code" st={st}
      exp={hl === 'all' ? 'hl' : ''} links={hl === 'mod' || hl === 'di'} modHot={hl === 'mod' || hl === 'di'}
      sock={hl === 'err' ? { ctrl: { t: '(?)', er: true } } : null} readRow read={read}
      tag={t('Bugungi dars — bir qarashda', 'Сегодняшний урок — одним взглядом')} />
  </div>;
}
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET, CHEATSHEET_RU);
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('nest-1-mentor-eslatma.md', 'nest-1-pamyatka-mentora.md'); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s28Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => s.id.startsWith('b')).length; // nechta xulosa bandi chiqdi
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap hl={hl} />
            <div className="mk-plan" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>{S28_ITEMS.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both', padding: '9px 12px' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Topshirish:</b> GitHub repo linki → platformadagi uyga vazifangiz. Tekshiruvchi qaraydi: 3 ta Mapped, 404 xabari, buzib-tuzatilgan joy (commit tarixida).</>, <><b>Сдача:</b> ссылка на репозиторий GitHub → ваше домашнее задание на платформе. Проверяющий смотрит: 3 строки Mapped, сообщение 404, место, которое сломали и исправили (в истории commit).</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar", 'Репозиторий ученика: один ресурс, Guard и ошибки в классе')}</div><div className="exp">{t("Nest-2 · o'quvchi loyihasi IntroNestArxitechture: car resursi 5 qatlamda, token va rollar, sinfdagi xatolar", 'Nest-2 · проект ученика IntroNestArxitechture: ресурс car в 5 слоях, токен и роли, ошибки в классе')}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  MUQOVA + ROOT KOMPONENT
// ============================================================
// F-1120-02: muqova — chapda dars nima berishi, o'ngda darsning rasmi (so'rov aylanib turadi); eslatmalar bitta qisqa satrda
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card n1-cv">
      <div className="tx">
        <p className="mk-eyebrow">{t('Mentor kursi · NestJS', 'Курс для менторов · NestJS')}</p>
        <h1>{t('NestJS arxitekturasi: Module, Controller, Service', 'Архитектура NestJS: Module, Controller, Service')}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["so'rov Nest ichida qaysi fayldan qaysi faylga o'tishini chizib bera olasiz", "cars modulini o'z kompyuteringizda qurasiz", "o'quvchilar qiladigan 4 ta xatoni terminal xabaridan taniysiz"], ['сможете нарисовать, из какого файла в какой файл проходит запрос внутри Nest', 'соберёте модуль cars на своём компьютере', 'узнаете 4 ошибки учеников по сообщению в терминале']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars: quloqchin yoki ovozni tekshiring · 1,5–2 soat, 22-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: Node.js 20+, VS Code, terminal", 'Урок со звуком: проверьте наушники или громкость · 1,5–2 часа, после 22-го экрана можно сделать перерыв · Нужно: Node.js 20+, VS Code, терминал')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><NestMachine cfg={N1_APP} out="Hello World!" lanes pkt={{ loop: true, label: t("so'rov", 'запрос') }} fill={[501, 501]} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5a, ScreenP0, Screen5b, Screen6, Screen7, Screen8, Screen9, ScreenP1, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenLC1, Screen16, Screen17, ScreenP2, Screen18, Screen19, Screen20, Screen21, ScreenLC2, Screen22, Screen23, ScreenP3, ScreenAI6, ScreenLCAI, Screen25a, Screen25b, ScreenR1, ScreenR2, ScreenRdb, ScreenR3, Screen26, Screen27, Screen28];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function NestArchMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang); // UZ-RU (F-1030-38): render'dan oldin — ma'lumot va t() shu tilda
  useCss();
  useCssN1(); // F-1120-02: Nest mashinasi uslubi (02b-mashina.jsx)
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});   // to'liq ko'rilgan ekranlar — qaytib kelganda Davom qulfi yo'q (F-1030-01)
  const [rev, setRev] = useState(0);      // ↺ boshidan: key o'zgaradi → ekran qayta o'rnatiladi (F-1030-05)
  const [mode, setMode] = useState('live');
  const sv = useMentorSave({ id: LESSON_ID, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted }); // A12: Orqaga/Davom bilan ko'rilgan ekranga kelinsa — 'review' (tayyor holat, ovozsiz); ↺ va N-ekranga o'tish — 'live'
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
      lessonId: LESSON_ID, lessonTitle: 'NestJS arxitekturasi: Module, Controller, Service',
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
//  RU — ruscha matn (F-1030-38). O'zbekcha matn parts/03–07 da etalon holida turadi;
//  bu yerda faqat ruschasi: ru(obj, {…}) → setLang('ru') ildizda obyektning o'zini almashtiradi.
//  Segmentlar id bo'yicha, kod satrlari va qadamlar indeks bo'yicha. Yozilmagan maydon — o'zbekcha qoladi.
//  Uslub: «Вы», mentor imtihoni — dasturlash atamalari inglizcha (Controller, Service, route, dependency…);
//  ovoz matnida kod va belgilar o'qilmaydi (fayl nomi «app controller ts»), raqam raqam bilan (TTS o'qiydi).
// ============================================================
ru(HELP_ROW, ['Ничего не подошло', 'Скриншот и текст ошибки отправьте в Telegram-группу курса для менторов; урок не останавливайте, переходите к следующему экрану']);

// --- 03 · S1–S5b, Практика 1 ---
ru(S1, {
  kicker: 'Вступление', eyebrow: 'Курс для менторов · NestJS', title: 'Вы знаете Express. Теперь Nest.',
  plan: ['Зачем Nest', 'Три части: Controller · Service · Module', 'Dependency Injection', 'Пишем routes для cars', 'Ломаем и читаем ошибку', 'Практика и код от ИИ', 'Как вести урок ученика'],
  segments: {
    a: { key: 'Поверх ваших знаний Express ставим <b>Nest</b>: он не отменяет Express, а наводит порядок', text: 'Здравствуйте. Вы видели Express в видеоуроках: знаете, как открывается route, как принимается запрос и как возвращается ответ. Сегодня поверх этих знаний ставим NestJS. Nest не отменяет Express, наоборот, он наводит над ним порядок.' },
    b: { key: 'К концу урока вы с пустой папки соберёте <b>работающий сервер</b>', text: 'К концу урока вы, начиная с пустой папки, соберёте сервер, который возвращает список машин.' },
    c: { key: 'Сможете <b>читать</b> ошибки Nest: в каком классе, какого dependency не хватает, какой файл открыть', text: 'Вы научитесь читать сообщения об ошибках Nest: в каком классе ошибка, какого dependency не хватает и какой файл нужно открыть.' },
    d: { key: 'Узнаете, что значит <b>каждое слово</b> в уроке ученика', text: 'И будете знать, что означает каждое слово в уроке ученика.' },
    e: { key: 'Семь этапов. <b>Не спешите</b>: «Далее» откроется, когда учитель договорит', text: 'Урок состоит из семи этапов. Не спешите: на каждом экране можно выключить звук, прослушать экран с начала и прочитать полный текст. Когда учитель договорит, откроется кнопка «Далее». Нажмите её, начинаем.' },
  },
});
ru(EXPRESS_LINES, { 10: { h: `  <span class="k">if</span> (!car) <span class="k">return</span> res.<span class="c">status</span>(<span class="d">404</span>).<span class="c">json</span>({ message: <span class="s">'не найдено'</span> });` } });
ru(GROWN_LINES, {
  2: { h: `  <span class="cm">// ... 40 строк проверок</span>` },
  4: { h: `  <span class="cm">// ... оплата, email, база — всё здесь</span>` },
  5: { h: `<span class="cm">// где же login??? на 1000 строк ниже...</span>` },
});
ru(S2, {
  kicker: 'Этап 1 · Зачем Nest', title: 'Express: знакомая картина и боль',
  segments: {
    a: { key: 'Знакомая картина: весь сервер на Express в одном файле <code>server.js</code>', text: 'Начнём со знакомого, с Express. Как вы видели в видеоуроках, весь сервер в одном файле server js.' },
    b: { key: 'Приходит <code>GET /cars</code> — возвращаем <b>список</b> машин', text: 'Если на route cars приходит GET, возвращаем список.', show: 'Если на route <code>/cars</code> приходит GET, возвращаем список.' },
    c: { key: 'Приходит <code>GET /cars/:id</code> — ищем <b>одну машину</b>, не нашли — 404', text: 'Если после пути cars идёт id, ищем одну машину, а если не нашли, отвечаем 404.', show: 'Если приходит <code>/cars/:id</code>, ищем одну машину, не нашли — 404.' },
    d: { key: '<code>POST /cars</code> добавляет новую. Всего <b>20 строк</b> — проблем нет', text: 'Если приходит POST, добавляем новую. Всего 20 строк, всё перед глазами. На этом этапе никаких проблем нет.', show: 'Если приходит <code>POST /cars</code>, добавляем новую. Всего 20 строк, всё перед глазами. На этом этапе никаких проблем нет.' },
    e: { key: 'Проект вырос до <b>1240 строк</b> (условный пример) — ищете, где login', text: 'Проблема начинается, когда проект растёт. Добавились пользователи, вход и регистрация, заказы, оплата, загрузка файлов. Вот условный пример, не реальный проект: допустим, в файле 1240 строк. Где был login? Ищете.', show: 'Проблема начинается, когда проект растёт. Пользователи, вход, заказы, оплата, загрузка файлов. Вот <b>условный пример</b> (не реальный проект): в файле <b>1240 строк</b>. Где был login? Ищете.' },
    f: { key: 'Вывод: вся работа в одном route — не протестировать, двое мешают друг другу. <b>Nest создан от этой боли</b>', text: 'Вывод: внутри одного route и чтение запроса, и проверка, и запись в базу. Эту часть нельзя протестировать отдельно, потому что она не отделена от route. Если двое работают в одном файле, один ломает изменения другого. В небольшом проекте из видеоуроков это незаметно, а в настоящей команде случается каждый день. Nest создан именно от этой боли. Урок ученика тоже начинается именно с этого примера.' },
  },
});
ru(S3, {
  kicker: 'Этап 1 · Зачем Nest', title: 'Что даёт Nest: обязательный порядок',
  segments: {
    a: { key: 'В Express каждая команда делит папки <b>по-своему</b> — новичок заново учит порядок', text: 'Итак, боль мы увидели: всё в одном файле. Что с этим делает опытный Express-разработчик? Делит файл: папка routes, папка controllers, папка services. Но каждая команда делает это по-своему, и новый человек заново изучает порядок.', show: 'Итак, боль мы увидели: всё в одном файле. Что с этим делает опытный Express-разработчик? Делит файл: <code>routes/</code>, <code>controllers/</code>, <code>services/</code>. Но каждая команда делает это по-своему, и новый человек заново изучает порядок.' },
    b: { key: 'Nest делает порядок <b>обязательным</b>: три части — Controller, Service, Module', text: 'Nest делает этот порядок обязательным и одинаковым. Он даёт имена трём частям: Controller, Service, Module.' },
    c: { key: 'В каждом проекте Nest части в одном месте, с одним именем — <b>проект из Ташкента в Берлине поймут за минуту</b>', text: 'В каждом проекте Nest они лежат в одном и том же месте, под одними и теми же именами. Поэтому если разработчик в Берлине откроет проект команды из Ташкента, он за минуту найдёт, что где лежит.' },
    d: { key: 'Вывод: внутри Nest работает <b>тот же Express</b> — ваши знания не пропадают, сверху добавляется порядок', text: 'Вывод и важный факт: внутри Nest работает тот же Express. Запрос на самом деле принимает Express, а Nest направляет его в нужную часть. Значит, ничего из того, что вы знаете, не пропадает.' },
  },
});
ru(S4, {
  kicker: 'Этап 1 · Зачем Nest', title: 'TypeScript: тип, класс и decorator',
  segments: {
    a: { key: 'TypeScript — это JavaScript <b>с типами</b>: знаете JavaScript — сможете читать', text: 'Прежде чем открывать код Nest, узнаем одну новую вещь, иначе код покажется вам чужим. Проекты на Nest пишут на TypeScript. TypeScript — это тот же JavaScript, только с типами: string, number и тому подобное. Если вы знаете JavaScript, вы сможете читать TypeScript. Сначала разберём две вещи: тип и класс.' },
    tip: { key: 'Тип: <code>price: number</code> — в эту переменную пишут <b>только число</b>; дадите строку — ошибка ещё до запуска', text: 'Первое — тип. price двоеточие number: в эту переменную можно записать только число. Во второй строке мы дали ей строку. JavaScript принял бы это без ошибки, а TypeScript выдаёт ошибку ещё до запуска программы: VS Code подчёркивает строку красным, а если попробуете запустить, в терминале появится ошибка о несовпадении типов. Ошибка ловится, пока вы пишете код, и не доходит до пользователя.', show: 'Первое — <b>тип</b>. <code>price: number</code>: в эту переменную можно записать только число. Во второй строке мы дали ей строку. JavaScript принял бы это без ошибки, а TypeScript выдаёт ошибку ещё до запуска программы: VS Code подчёркивает строку красным, в терминале <code>Type \'string\' is not assignable to type \'number\'</code>. Ошибка ловится, пока вы пишете код, и не доходит до пользователя.' },
    cls: { key: '<b>Класс</b> — шаблон одинаковых объектов: <code>new Car(\'Kia\', 320)</code> делает по шаблону одну машину', text: 'Второе — класс. Класс — это шаблон для одинаковых объектов. В классе Car есть поля brand и price, а constructor заполняет их, когда создаётся новая машина. new Car, в скобках Kia и триста двадцать: по шаблону создаётся одна машина. В Nest и Controller, и Service — такие же классы. Только создаёте их не вы через new, а сам Nest; как он это делает, увидим на третьем этапе.', show: 'Второе — <b>класс</b>. Класс — это шаблон для одинаковых объектов. В классе <code>Car</code> есть поля <code>brand</code> и <code>price</code>, а <code>constructor</code> заполняет их, когда создаётся новая машина. <code>new Car(\'Kia\', 320)</code>: по шаблону создаётся одна машина. В Nest и Controller, и Service — такие же классы. Только создаёте их не вы через <code>new</code>, а сам Nest; как он это делает, увидим на 3-м этапе.' },
    b: { key: 'Новое: строка, которая начинается с <b>@</b> («собачка»), — это <b>decorator</b>', text: 'И третья новая вещь, с ней вы будете встречаться чаще всего: строки, которые начинаются со знака собачка. Например, decorator Controller, в скобках cars. Это называется decorator.', show: 'И третья новая вещь, с ней вы будете встречаться чаще всего: строки, которые начинаются со знака <b>@</b> («собачка»). Например, <code>@Controller(\'cars\')</code>. Это называется <b>decorator</b>.' },
    c: { key: 'Decorator говорит Nest: <b>этот класс — Controller</b>, этот метод принимает GET', text: 'Decorator пишут над классом или методом, и он сообщает Nest: этот класс Controller, его path cars. А decorator Get стоит над методом: если пришёл GET-запрос, вызвать этот метод.', show: 'Decorator пишут над классом или методом, и он сообщает Nest: «этот класс — Controller, его path — cars». А <code>@Get</code> стоит над методом: «пришёл GET-запрос — вызвать этот метод».' },
    d: { key: 'Вывод: decorator не выполняет код, а ставит метку — <b>нет метки, и Nest не узнаёт класс</b>', text: 'Вывод: decorator не выполняет код, он ставит метку. Когда Nest запускается, он читает эти метки и расставляет все части по местам. Запомните: если decorator нет, Nest этот класс не узнаёт. На пятом этапе мы специально это сломаем и увидим ошибку.' },
  },
});
ru(FILES5_DESC, { 'src/main.ts': 'запускает приложение', 'src/app.module.ts': 'список', 'src/app.controller.ts': 'принимает запрос', 'src/app.service.ts': 'выполняет работу', 'src/app.controller.spec.ts': 'автотест — сегодня не трогаем', 'test/app.e2e-spec.ts': 'автотест — сегодня не трогаем', 'package.json': 'пакеты и команды npm (start:dev)', 'tsconfig.json': 'настройки TypeScript' });
ru(S5a, {
  kicker: 'Этап 2 · Три части', title: 'Живой проект: что создал nest new',
  segments: {
    a: { key: 'Проект от <code>nest new cars-api</code>: в <b>src</b> четыре главных файла', text: 'Теперь вы готовы: вы знаете decorator и имена трёх частей. Смотрим на настоящий проект. Команда nest new cars-api создала вот эти папки и файлы, как вы видите в левой панели VS Code. Всё, что нам нужно, лежит в папке src: четыре главных файла.' },
    b: { key: '<b>main.ts</b> запускает приложение — и больше ничего не делает', text: 'main ts: запускает приложение и больше ничего не делает.' },
    c: { key: '<b>app.module.ts</b> — список: по нему Nest собирает всё', text: 'app module ts: список. По этому списку Nest собирает всё.' },
    d: { key: '<b>app.controller.ts</b> принимает запрос и возвращает ответ', text: 'app controller ts: принимает запрос и возвращает ответ.' },
    e: { key: '<b>app.service.ts</b> выполняет работу; файлы <b>spec</b> — автотесты, сегодня не трогаем', text: 'app service ts: выполняет работу. Файлы, которые заканчиваются на spec, это автотесты, их запускает Jest. Сегодня мы их не трогаем. В package json лежат команды npm, start dev тоже здесь.' },
    f: { key: 'Вывод: три части, три цвета — <b>синий Controller · зелёный Service · жёлтый Module</b>', text: 'Вывод: в проекте три вида частей, каждая в своём файле. Запомните три цвета: синий Controller, зелёный Service, жёлтый Module. Весь урок рядом с каждым кодом будет этот Explorer, и он будет показывать, в каком вы файле. На следующем экране вы тоже создадите этот проект у себя.' },
  },
});
ru(S5b, {
  kicker: 'Этап 2 · Три части', title: 'Путь одного запроса',
  segments: {
    a: { key: 'Браузер отправил <b>GET-запрос</b> на <code>localhost:3000</code>', text: 'Пока ваш проект устанавливается в фоне, посмотрим, как файлы работают друг с другом. Лучший способ — проследить путь одного запроса. Браузер отправил GET-запрос на адрес localhost 3000.' },
    b: { key: 'Запрос принял <b>AppController</b> — в нём есть метод для GET', text: 'Запрос принял AppController, потому что в нём есть метод для GET. Он живёт в файле app controller ts, имя файла внизу блока.' },
    c: { key: 'Controller сам ответ не придумывает — <b>спрашивает AppService</b>', text: 'Controller сам ответ не придумывает, он спрашивает AppService. Service возвращает текст Hello World.' },
    d: { key: 'Controller <b>вернул в браузер</b> текст от Service', text: 'Controller отправляет этот текст в браузер. В браузере появляется Hello World.' },
    e: { key: '<b>AppModule</b> держит обоих в списке — по нему Nest их собирает', text: 'А AppModule держит их обоих в одном списке, и по этому списку Nest их собирает.' },
    f: { key: 'Вывод: путь всегда один — <b>запрос → Controller → Service → ответ</b>', text: 'Вывод: каждый запрос проходит один и тот же путь. Запрос, Controller, Service, ответ. А Module держит эти части в списке. Этот путь вы увидите на уроке много раз. На следующих трёх экранах откроем каждый файл и прочитаем его построчно.' },
  },
});
ru(P0, {
  kicker: 'Практика 1 / 4', eyebrow: 'Сейчас у вас · 3–5 минут (установка в фоне)', title: 'Установите Nest, запустите создание проекта',
  segments: {
    a: { key: 'Теперь <b>вы</b>: установите Nest и запустите создание проекта', text: 'Теперь ваша очередь. Проект, который вы только что видели, вы создадите у себя и подготовите программы, нужные на уроке: четыре шага. Установка занимает от одной до трёх минут. Не ждите: нажмите «Далее» и продолжайте урок, проект установится в фоне.' },
    b: { key: 'Шаг 1: версия Node должна быть <b>22 или выше</b>', text: 'Первое: проверьте версию node. Она должна быть 22 или выше. Если ниже, обновите способом из таблицы.' },
    c: { key: 'Шаг 2: установите <b>Nest CLI 12</b>, версию впишите в поле подтверждения', text: 'Второе: установите Nest CLI глобально. В конце команды стоят собачка и двенадцать: весь код и все строки терминала в этом уроке проверены на двенадцатой версии Nest, поэтому ставим именно её. Потом проверьте версию и впишите число, которое появится, в поле подтверждения внизу.', show: 'Второе: установите Nest CLI глобально. В конце команды стоит <code>@12</code>: весь код и все строки терминала в этом уроке проверены на 12-й версии Nest, поэтому ставим именно её. Потом проверьте версию и впишите число, которое появится, в поле подтверждения внизу.' },
    d: { key: 'Шаг 3: команду <code>nest new</code> <b>скопируйте целиком</b> — установка в фоне, продолжайте, не дожидаясь', text: 'Третье: создайте проект. Не набирайте команду вручную, скопируйте её целиком. Nest двенадцатой версии при создании проекта задаёт четыре вопроса, и мы ответили на них прямо в команде: менеджер пакетов npm, система модулей CommonJS, сервис наблюдения и файлы для ИИ-агентов не нужны. CommonJS мы выбрали потому, что проект ученика написан на этой же системе. Когда установка началась, не ждите: отметьте пункт и нажмите «Далее».', show: 'Третье: создайте проект. Не набирайте команду вручную, скопируйте её целиком. Nest 12-й версии при создании проекта задаёт четыре вопроса, и мы ответили на них прямо в команде: менеджер пакетов <code>npm</code>, система модулей <code>CommonJS</code>, сервис наблюдения и файлы для ИИ-агентов не нужны. CommonJS мы выбрали потому, что проект ученика написан на этой же системе. Когда установка началась, не ждите: отметьте пункт и переходите к следующему шагу.' },
    pm: { key: 'Шаг 4: для запросов — <b>Postman</b> или <b>Thunder Client</b> в VS Code', text: 'Четвёртое: в середине урока вы будете отправлять запросы на сервер, для этого нужна программа. Если Postman установлен, откройте его. Если нет, добавьте в VS Code расширение Thunder Client из раздела Extensions: оно делает то же самое и открывается прямо в VS Code.' },
    e: { key: 'Вышло иначе — нажмите <b>«Вышло иначе?»</b>, откроется окно с решениями', text: 'Если что-то вышло иначе, нажмите внизу кнопку «Вышло иначе»: откроется окно с решениями, там ошибка и её решение. Пока не отмечены все четыре пункта и не вписано верное подтверждение, кнопка «Далее» не откроется. Значит, после этой практики Nest установлен на вашем компьютере, новый проект создаётся, а программа для запросов готова.' },
  },
});
ru(P0_STEPS, [
  { exp: 'v22 или выше' },
  null,
  { t: 'Проект — запустите создание', exp: 'вопросов не будет · установка 1–3 минуты — не ждите, переходите к следующему шагу' },
  { t: 'Программа для запросов', exp: 'открывается Postman или в VS Code → Extensions добавлен «Thunder Client» (понадобится на 22-м экране)' },
]);
ru(P0_TROUBLE, [
  ['node: ниже 22', 'установите LTS-версию с nodejs.org, откройте терминал заново, повторите шаг 1'],
  [null, 'CLI не установлен или терминал не обновился: повторите шаг 2, откройте терминал заново'],
  ['nest new задал вопросы (package manager, module system…)', 'Команда скопирована не целиком: нажмите Ctrl+C и заново вставьте команду из шага 3 целиком'],
  [null, 'Остался старый Nest CLI: повторите команду из шага 2, nest --version должен показать 12'],
  ['npm install долго / ошибка', 'проверьте интернет; добавьте в конец команды из шага 3 --skip-install, затем npm install в папке'],
]);
ru(P0_PROOF, { label: 'Подтверждение: что вывел nest --version?', placeholder: 'впишите число из терминала', wrong: 'Ожидается 12.x.x — в команде пропущено @12 или терминал не обновился' });

// --- 04 · S6–S9, Практика 2, S10, S11 ---
ru(S6, {
  kicker: 'Этап 2 · Controller', title: 'Controller — принимает запрос',
  segments: {
    a: { key: 'У <code>@Controller()</code> пустые скобки — значит, path этого Controller — <b>root</b> (<code>/</code>)', text: 'Первой остановкой на пути запроса был Controller. Запрос приходит именно в этот файл, поэтому с него и начнём. Вот app controller ts. В четвёртой строке decorator Controller, скобки пустые. Значит, path этого Controller — root. Если написать в скобках cars, все его методы будут начинаться с пути cars.', show: 'Первой остановкой на пути запроса был Controller — запрос приходит именно в этот файл, поэтому с него и начнём. <b>app.controller.ts</b>. Четвёртая строка: <code>@Controller()</code>, скобки пустые. Значит, path этого Controller — root, то есть <code>/</code>. Если написать в скобках cars, все его методы будут начинаться с <code>/cars</code>.' },
    b: { key: 'Под decorator — <b>обычный класс TypeScript</b>: AppController', text: 'Дальше обычный класс: AppController. Делает его Controller именно decorator над ним.' },
    c: { key: 'Конструктор говорит: <b>«мне нужен AppService»</b> — как он приходит, увидим на 14-м экране', text: 'В конструкторе одна строка: в ней запрашивается часть под именем AppService. Пока понимайте так: этому Controller нужен AppService. Как он приходит, увидим на четырнадцатом экране.', show: 'В конструкторе одна строка: <code>private readonly appService: AppService</code>. Пока понимайте так: «этому Controller нужен AppService». Как он приходит, увидим на 14-м экране.' },
    c2: { key: 'Параметр с <code>private readonly</code> <b>сам становится полем класса</b> — <code>this.appService</code> готов', text: 'Одна короткая запись TypeScript: если перед параметром конструктора стоит private readonly, он автоматически становится полем класса. В классе Car на четвёртом экране мы писали это вручную: this точка brand равно brand. Здесь эту строку не пишут, она выполняется сама.', show: 'Короткая запись TypeScript: если перед параметром стоит <code>private readonly</code>, он автоматически становится полем класса. В классе <code>Car</code> на 4-м экране мы писали это вручную: <code>this.brand = brand</code>. Здесь эту строку не пишут, она выполняется сама.' },
    d: { key: '<code>@Get()</code> над методом: <b>пришёл GET-запрос — вызови этот метод</b>', text: 'Ниже decorator Get. Он стоит над методом и говорит: если пришёл GET-запрос, вызови этот метод. Тот же смысл, что app get в Express, только теперь над методом.', show: 'Ниже <code>@Get()</code>. Он стоит над методом и говорит: «пришёл GET-запрос — вызови этот метод». Тот же смысл, что <code>app.get</code> в Express, только теперь над методом.' },
    e: { key: 'Внутри метода одно дело: <b>вызвать Service и вернуть результат</b>', text: 'Внутри метода одно дело: вызвать метод Service и вернуть его результат.', show: 'Внутри метода одно дело: вернуть результат <code>this.appService.getHello()</code>.' },
    f: { key: 'Вывод: в Controller <b>логику не пишут</b> — принял запрос, вызвал Service, вернул ответ', text: 'Вывод: в Controller логику не пишут. Он принял запрос, вызвал нужный Service, вернул ответ. Таким Controller и должен быть: логика в Service, а Controller только соединяет.' },
  },
});
ru(S7, {
  kicker: 'Этап 2 · Service', title: 'Service — выполняет работу',
  segments: {
    a: { key: '<code>@Injectable()</code> — «этот класс <b>можно передать через inject</b> туда, где он нужен»', text: 'Controller принял запрос и передал работу в Service. Значит, следующая остановка — Service, открываем его: app service ts. Над ним decorator Injectable. Это английское слово, оно значит «можно сделать inject». Оно говорит Nest: этот класс можно передать через inject туда, где он нужен.', show: 'Controller принял запрос и передал работу в Service. Значит, следующая остановка — Service: <b>app.service.ts</b>. Над ним <code>@Injectable()</code>. Это английское слово, оно значит «можно сделать inject». Оно говорит Nest: этот класс можно передать через inject туда, где он нужен.' },
    b: { key: 'Настоящая работа <b>в Service</b>: расчёт цены, проверка правил, запись в базу', text: 'Внутри метод getHello, он возвращает Hello World. Сейчас это совсем маленький метод, но правило не меняется и в большом проекте: настоящая работа делается в Service. Посчитать цену, проверить правило, записать в базу — всё здесь.' },
    c: { key: 'В Service нет ни <code>req</code>, ни <code>res</code> — поэтому его <b>тестируют без сервера</b>', text: 'Обратите внимание на одну вещь: Service ничего не знает о запросе. В нём нет ни req, ни res. Поэтому его легко тестировать отдельно: тестовый файл вызывает метод и сравнивает результат с ожидаемым значением, а сервер не запускается.' },
    d: { key: 'Вывод: один Service используют <b>и HTTP Controller, и Telegram-бот</b>', text: 'И поэтому один Service могут использовать два места: и HTTP Controller, и Telegram-бот. Вывод: работа в Service, а Controller только связывает его с запросом.' },
  },
});
ru(S8, {
  kicker: 'Этап 2 · Module', title: 'Module — список',
  segments: {
    a: { key: 'Внутри <code>@Module</code> <b>три списка</b>: imports · controllers · providers', text: 'И Controller, и Service готовы. Но откуда Nest знает, что они есть? Ответ в третьем файле, в Module. app module ts: decorator Module и внутри три списка.' },
    b: { key: '<code>controllers</code> — список Controller, <code>providers</code> — список <b>Service</b>, которые создаёт Nest', text: 'controllers: Controller этого модуля. providers: то, что этот модуль создаёт, сейчас это Service. Запомните слово provider, так Nest называет Service.' },
    c: { key: '<code>imports</code> — другие модули. Nest видит <b>только то, что в списке</b>', text: 'imports: другие модули, сейчас список пуст. Module никакой работы не делает, это список. Но этот список решающий: Nest видит только то, что здесь записано.' },
    d: { key: 'Файл есть, но в списке его нет — <b>для Nest его нет</b>', text: 'Если вы написали Controller, но не добавили его в список controllers, его как будто нет. Если написали Service, но не добавили в providers, Nest не сможет сделать его inject.' },
    e: { key: 'Вывод: <b>AppModule</b> наверху, остальные модули подключаются к нему через <code>imports</code>', text: 'В проекте бывает несколько модулей: для cars, для users, для orders. Над всеми стоит AppModule и подключает остальные к себе через imports. Вывод: Module не делает работу, но раз это список, большинство ошибок исправляется именно в этом файле.' },
  },
});
ru(S9, {
  kicker: 'Этап 2 · main.ts', title: 'main.ts и строки запуска в терминале',
  segments: {
    a: { key: '<code>main.ts</code> отдаёт Nest главный модуль — <b>Nest собирает всё</b>', text: 'Три части мы увидели. А как они запускаются? Всё начинается с main ts. Первая строка: отдаём Nest главный модуль. Он читает список модуля, создаёт Service и подключает Controller.', show: 'Три части мы увидели. А как они запускаются? Всё начинается с main.ts. <code>NestFactory.create(AppModule)</code>: отдаём Nest главный модуль. Он читает список модуля, создаёт Service и подключает Controller.' },
    b: { key: 'Слушаем порт 3000. В терминале: <code>npm run start:dev</code>', text: 'Потом он слушает порт 3000, как в Express. В последней строке вызывается функция bootstrap. Слово void перед ней означает, что результат этого вызова нам не нужен; на работу приложения оно не влияет. Теперь посмотрите на терминал, мы написали npm run start dev.', show: 'Потом <code>listen(3000)</code>: слушает порт, как в Express. В последней строке вызывается <code>bootstrap()</code>. Слово <code>void</code> перед ней означает, что результат этого вызова нам не нужен; на работу приложения оно не влияет. Теперь посмотрите на терминал, мы написали <code>npm run start:dev</code>.' },
    c: { key: 'Терминал: <b>dependencies initialized</b> — всё из списка создано', text: 'Первая строка: приложение Nest запускается. Вторая: dependency модуля AppModule готовы, то есть всё из списка создано.', show: 'Starting Nest application. <b>AppModule dependencies initialized</b>: dependency модуля AppModule готовы, то есть всё из списка создано.' },
    d: { key: 'Терминал: <b>Mapped {/, GET}</b> — к root path подключён GET route', text: 'Дальше: AppController найден, и ему дан root path. Строка Mapped: к root path подключён GET route. И последняя: приложение успешно запущено.', show: '<code>AppController {/}</code>: Controller найден, ему дан path. <b>Mapped {/, GET} route</b>: к root path подключён GET route. Nest application successfully started.' },
    e: { key: 'Привычка: route не работает — <b>сначала ищите строку Mapped</b> в терминале', text: 'Возьмите в привычку читать эти строки. Если потом какой-то route не работает, первым делом смотрите на эти строки в терминале: есть строка Mapped или нет.' },
    f: { key: 'Вывод: main.ts → модуль → Controller → в браузере <b>Hello World!</b>', text: 'В браузере localhost 3000, ответ: Hello World. Вывод: main ts отдаёт главный модуль, Nest по списку собирает все части и подключает routes, а терминал сообщает, что подключено.', show: 'В браузере <code>localhost:3000</code>, ответ: <b>Hello World!</b> Вывод: main.ts отдаёт главный модуль, Nest по списку собирает все части и подключает routes, а терминал сообщает, что подключено.' },
  },
});
ru(P1, {
  kicker: 'Практика 2 / 4', eyebrow: 'Сейчас у вас · 3–5 минут', title: 'Запустите и прочитайте терминал',
  segments: {
    a: { key: 'Проект из 1-й практики установился — теперь вы его <b>запустите</b>', text: 'Снова ваша очередь. Проект, который вы начали в первой практике, наверное, уже установился. Три шага: запускаете, читаете строки в терминале, смотрите в браузере.' },
    b: { key: 'Шаг 1: зайдите в папку и напишите <code>npm run start:dev</code>', text: 'Первое: зайдите в папку и напишите npm run start dev.' },
    c: { key: 'Шаг 2: найдите в терминале строку <b>Mapped</b> и вставьте её в поле подтверждения', text: 'Второе: найдите в терминале строку Mapped, скопируйте её точно и вставьте в поле подтверждения внизу.' },
    d: { key: 'Шаг 3: в браузере <code>localhost:3000</code> — должно появиться <b>Hello World!</b>', text: 'Третье: откройте в браузере localhost 3000 и увидите Hello World.' },
    e: { key: 'Вышло иначе — нажмите <b>«Вышло иначе?»</b>, откроется окно с решениями', text: 'Если вышло иначе, нажмите внизу кнопку «Вышло иначе», откроется окно с решениями. Пока не отмечены все три пункта и не вставлено верное подтверждение, «Далее» не откроется. Значит, после этой практики ваш проект запущен, и вы умеете читать строки Mapped в терминале.' },
  },
});
ru(P1_STEPS, [
  { t: 'Запуск', exp: 'в конце «Nest application successfully started»' },
  { t: 'Терминал', exp: 'строка Mapped {/, GET} route — скопируйте и вставьте в поле подтверждения' },
  { t: 'Браузер', exp: 'localhost:3000 → Hello World!' },
]);
ru(P1_TROUBLE, [
  ['nest new ещё не закончился', 'Дождитесь в терминале «Successfully created project»; если дольше 5 минут — интернет или npm install идёт долго (--skip-install, затем npm install)'],
  [null, 'На порту 3000 открыт другой сервер: закройте его или PORT=3001 npm run start:dev'],
  ['Строки Mapped нет, есть ошибка', 'Прочитайте текст ошибки: у красной ошибки TypeScript указаны файл:строка; если nest new не закончился — подождите'],
  ['В терминале есть строки ObserveModule', 'Проект создан не командой из практики 1: удалите папку cars-api и создайте проект заново, целиком скопировав команду из шага 3 практики 1'],
]);
ru(P1_PROOF, { label: 'Подтверждение: скопируйте строку Mapped из терминала', placeholder: 'вставьте сюда строку из терминала', wrong: 'Ожидается: Mapped {/, GET} route — скопируйте строку из терминала точно' });
ru(S11, {
  kicker: 'Этап 3 · Dependency Injection', title: 'Как Service попадает в Controller',
  segments: {
    a: { key: 'В конструкторе <b>«мне нужен AppService»</b> — но никто не создавал его через <code>new</code>', text: 'На проверке мы сказали: Controller вызывает Service. Но откуда Controller берёт Service? С этим вопросом вернёмся к конструктору в файле Controller. Здесь написано: мне нужен AppService. Но во всём проекте нет строки new AppService. Тогда откуда берётся Service? На этом экране разберём это шаг за шагом.', show: 'На проверке мы сказали: «Controller вызывает Service». Но откуда Controller берёт Service? С этим вопросом вернёмся к конструктору в файле Controller: <code>constructor(private readonly appService: AppService)</code> — «мне нужен AppService». Но во всём проекте нет строки <code>new AppService()</code>. Тогда откуда берётся Service?' },
    b: { key: 'В Express вы создаёте сами: <code>require</code> + <code>new</code>, <b>в каждом файле заново</b>', text: 'В Express эту работу вы делаете сами: require, создаёте через new, и так заново в каждом файле, где он нужен. Нужен в трёх файлах — три раза. В Nest эту работу у вас забрали.' },
    c: { key: 'Шаг 1: при запуске Nest читает <code>providers</code> в <b>app.module.ts</b>', text: 'Первый шаг. Когда сервер запускается, Nest открывает файл app module ts и читает список providers: там стоит AppService.' },
    d: { key: 'Шаг 2: Nest создаёт <b>один instance</b> AppService и хранит его у себя', text: 'Второй шаг. Nest создаёт один instance AppService и хранит его у себя. Это хранилище называется контейнером Nest.' },
    e: { key: 'Шаг 3: тип в конструкторе — <code>AppService</code>, и Nest <b>передаёт этот instance в конструктор</b>', text: 'Третий шаг. Создавая AppController, Nest смотрит на его конструктор: тип параметра — AppService. Тип работает как бланк заказа: Nest берёт из контейнера instance именно этого типа и передаёт в конструктор. Теперь this appService готов.' },
    f: { key: 'Название этого способа: <b>Dependency Injection</b> — внедрение dependency', text: 'Этот способ называется Dependency Injection, то есть внедрение dependency. Dependency — потому что Controller не может работать без Service. Inject — потому что его приносите не вы, а Nest передаёт его снаружи.' },
    g: { key: 'Польза: <b>один instance</b>, в тесте можно <b>подставить фейк</b>, Controller не знает источник', text: 'Почему это хорошо? Во-первых, во всём проекте один instance. Во-вторых, в тесте вместо настоящего Service можно подставить фейковый, и Controller этого не заметит. В-третьих, Controller не обязан знать, откуда пришёл Service.' },
    h: { key: 'Вывод: вы делаете две вещи — <b>пишете в providers, просите в конструкторе</b>', text: 'Вывод. Ваша работа — две вещи: записать Service в список providers модуля и попросить его в конструкторе там, где он нужен. Создание и inject делает Nest. Что будет, если забыть одно из двух, мы специально сломаем на пятом этапе.' },
  },
});

// --- 05 · S12–S17, Проверка 2, Практика 3 ---
ru(S12, {
  kicker: 'Этап 4 · CLI', title: 'Создаём модуль cars через CLI',
  segments: {
    a: { key: 'Первая команда: <code>nest g module cars</code> — g = generate, то есть «создать»', text: 'Основа готова: вы знаете три части и Dependency Injection. Теперь строим сами. Для машин нужен отдельный модуль. Nest CLI создаёт его тремя командами. Первая: nest g module cars. g — это generate, создать.' },
    b: { key: 'CLI <b>сам зашёл</b> в главный модуль и добавил CarsModule в <code>imports</code> — UPDATE', text: 'Результат — две строки: CREATE, создан cars module, и UPDATE, изменён app module. Обратите внимание на вторую строку: CLI сам зашёл в главный модуль и добавил CarsModule в список imports. Если делать вручную, именно это вы и забудете.' },
    c: { key: '<code>nest g controller cars</code> — Controller создан и <b>записан в controllers</b>', text: 'Вторая команда: nest g controller cars. Флаг no-spec значит «не создавай тестовый файл»: на этом уроке мы не работаем с тестами, пусть файлов будет меньше. Controller создан и записан в список controllers модуля cars.', show: '<code>nest g controller cars --no-spec</code>. <code>--no-spec</code>: не создавать тестовый файл — на этом уроке мы не работаем с тестами. Controller создан и записан в список <code>controllers</code> модуля cars.' },
    d: { key: '<code>nest g service cars</code> — Service создан и <b>записан в providers</b>', text: 'Третья команда: nest g service cars. Service создан и записан в список providers.' },
    e: { key: 'Вывод: 3 команды — 3 CREATE, 3 UPDATE. <b>Знайте, что сделал CLI</b>: сломается — исправите вручную', text: 'Вывод: три команды, шесть изменений, и все списки верные. В Explorer слева появилась папка cars и три новых файла. CLI можно доверять, но знать, что он сделал, обязательно: когда что-то сломается, исправлять будете вручную.' },
  },
});
ru(S13_FILES, {
  'src/cars/cars.controller.ts': { 3: { h: `<span class="k">export class</span> <span class="c">CarsController</span> {}   <span class="cm">// пусто — методов нет</span>` } },
  'src/cars/cars.service.ts': { 3: { h: `<span class="k">export class</span> <span class="c">CarsService</span> {}   <span class="cm">// пусто</span>` } },
});
ru(S13, {
  kicker: 'Этап 4 · пустые файлы', title: 'Файлы от CLI пустые: path есть, route нет',
  segments: {
    a: { key: '<b>cars.module.ts</b>: оба списка CLI <b>заполнил сам</b>', text: 'CLI создал три файла и записал их в списки. Что внутри? Откроем по одному. Первый — cars module ts: в списке controllers стоит CarsController, в списке providers — CarsService. Оба записал сам CLI.' },
    b: { key: 'Подумайте: если запустить сервер с этими файлами, что вернёт <code>/cars</code>?', text: 'Прежде чем открывать другие файлы, подумайте. Если запустить сервер с Controller и Service, которые только что создал CLI, что вернёт route cars? Нажмите один из трёх вариантов.', ask: { q: 'Что сделает сервер с файлами от CLI?', opts: ['Упадёт с ошибкой', 'Запустится, /cars → 404', 'Запустится, /cars → 200, пустой список'] } },
    c: { key: '<b>cars.controller.ts</b>: decorator есть, но класс <b>пустой — ни одного метода</b>', text: 'Теперь cars controller ts. Decorator Controller есть, в скобках cars. Но внутри класс пустой: ни Get, ни Post, ни одного метода.', show: '<b>cars.controller.ts</b>: <code>@Controller(\'cars\')</code> есть, но внутри класс пустой — ни <code>@Get</code>, ни <code>@Post</code>, ни одного метода.' },
    d: { key: '<b>cars.service.ts</b>: <code>@Injectable()</code> есть, внутри тоже <b>пусто</b>', text: 'cars service ts — то же самое: decorator Injectable есть, внутри пусто.', show: '<b>cars.service.ts</b>: <code>@Injectable()</code> есть, внутри тоже пусто.' },
    e: { key: 'В терминале есть <code>CarsController {/cars}</code>, но <b>строки Mapped нет</b>', text: 'Запускаем сервер. В терминале новая строка: CarsController, в фигурных скобках путь cars. Nest увидел Controller и дал ему path. Но строки Mapped нет, потому что route появляется из метода, а метода нет.', show: 'В терминале новая строка: <code>CarsController {/cars}</code>. Nest увидел Controller и дал ему path. Но <b>строки Mapped нет</b>, потому что route появляется из метода, а метода нет.' },
    f: { key: 'В браузере <code>/cars</code> → <b>404</b>: дверь есть, а внутри никого', text: 'Если открыть в браузере route cars: 404, Cannot GET cars. Это не ошибка, это естественное состояние: дверь есть, а внутри никого.', show: 'Если открыть в браузере /cars: <b>404, Cannot GET /cars</b>. Это не ошибка, это естественное состояние: дверь есть, а внутри никого.' },
    g: { key: 'Вывод: path даёт Controller, route даёт <b>метод</b> — теперь сначала Service, потом Controller', text: 'Вывод: path даёт decorator Controller, а route — метод и Get или Post над ним. Раз метода нет, нет и Mapped, ответ 404. На следующих двух экранах заполним файлы: сначала Service, который выполняет работу, потом Controller, который его вызывает.' },
  },
});
ru(S14, {
  kicker: 'Этап 4 · Service', title: 'Service: список и три метода',
  segments: {
    a: { key: 'Интерфейс <code>Car</code> — <b>форма</b> машины: id, brand, model, price (не таблица в базе)', text: 'Файлы пустые, route нет. По порядку сначала заполняем часть, которая выполняет работу, — Service. cars service ts. Сначала интерфейс Car: у машины есть id, brand, model и price. Interface — это описание формы в TypeScript, не таблица в базе, пока просто форма.' },
    b: { key: 'Список пока <b>в памяти</b>: Malibu и K5 — база на этом уроке не нужна', text: 'Дальше список: две машины, Chevrolet Malibu и Kia K5, цена в миллионах сумов. Базы пока нет, данные лежат в памяти, для этого урока этого достаточно.' },
    c: { key: '<code>findAll</code> возвращает все, <code>findOne</code> ищет одну <b>по id</b>', text: 'findAll возвращает список. findOne ищет по id.' },
    d: { key: 'Не нашли — бросает <b>NotFoundException</b>, и Nest сам превращает её <b>в ответ 404</b>', text: 'Если не нашли, бросает NotFoundException. Это готовая ошибка Nest: вы её бросаете, а Nest сам превращает её в ответ 404, со статусом и сообщением. В Express вы пишете это вручную: status 404 и json.', show: 'Если не нашли, бросает <b>NotFoundException</b>. Это готовая ошибка Nest: вы её бросаете, а Nest сам превращает её в ответ 404, со статусом и сообщением. В Express вы пишете это вручную: <code>res.status(404).json</code>.' },
    e: { key: 'Вывод: <code>create</code> добавляет, а в Service <b>ни слова о запросе</b>', text: 'create добавляет новую машину в список и возвращает её. Omit Car, id в скобках — это запись TypeScript: форма Car без id, потому что id мы даём сами. Вывод: в этом файле ни слова о запросе, нет ни req, ни res. Только машины и три метода для работы с ними. Поэтому его могут использовать и Controller, и Telegram-бот.', show: '<code>create</code> добавляет новую машину и возвращает её. <code>Omit&lt;Car, \'id\'&gt;</code> — запись TypeScript: форма Car без id, потому что id мы даём сами. <b>Вывод:</b> в этом файле ни слова о запросе — только машины и три метода.' },
  },
});
ru(EXN_ROWS, { 3: { n: 'не нужно — уже включено' } });
ru(S15, {
  kicker: 'Этап 4 · Controller', title: 'Controller: три route',
  segments: {
    a: { key: '<code>@Controller(\'cars\')</code>: все методы начинаются с <b>/cars</b>; конструктор просит CarsService', text: 'Service готов: список машин и три метода. Теперь пишем часть, которая связывает Service с запросом, — Controller. cars controller ts. Decorator Controller, в скобках cars: все методы начинаются с пути cars. Конструктор: мне нужен CarsService.', show: 'Service готов: список машин и три метода. Теперь пишем часть, которая связывает Service с запросом, — Controller. <b>cars.controller.ts</b>. <code>@Controller(\'cars\')</code>: все методы начинаются с /cars. Конструктор: «мне нужен CarsService».' },
    b: { key: 'Пустой <code>@Get()</code> = <b>GET /cars</b> → вызывается findAll из Service', text: 'Decorator Get пустой: GET cars. Метод вызывает findAll из Service.', show: '<code>@Get()</code> пустой: <b>GET /cars</b>. Метод вызывает findAll.' },
    c: { key: '<code>@Get(\':id\')</code> = <b>GET /cars/5</b>; <code>@Param(\'id\')</code> — это req.params.id из Express, значение — строка', text: 'Decorator Get с двоеточием и id: после пути cars идёт число, например cars 5. Decorator Param — это тот же req params id из Express, только берётся через decorator. Значение из URL всегда строка, поэтому переводим его в число через Number.', show: '<code>@Get(\':id\')</code>: path вида <b>GET /cars/5</b>. <code>@Param(\'id\') id</code> — это тот же <code>req.params.id</code> из Express, только берётся через decorator. Значение из URL всегда строка, поэтому переводим его в число через <code>Number</code>.' },
    d: { key: '<code>@Post()</code> = <b>POST /cars</b>; <code>@Body()</code> — это req.body, express.json подключать не нужно', text: 'Decorator Post: POST cars. Decorator Body — это req body из Express. В Nest не нужно вручную подключать express json, он включён внутри.', show: '<code>@Post()</code>: <b>POST /cars</b>. <code>@Body() body</code>: это <code>req.body</code> из Express. В Nest не нужно вручную подключать <code>express.json()</code>, он включён внутри.' },
    e: { key: 'Вывод: три метода одной формы — <b>взяли из запроса, вызвали Service, вернули результат</b>', text: 'Вывод: все три метода одной формы. Из запроса берётся нужная часть, вызывается метод Service, возвращается результат. В Controller нет if, нет расчётов, нет базы. Таблица слева показывает, где в Nest знакомые записи из Express.' },
  },
});
ru(LC1_FIXED, { 12: { h: `    <span class="k">return this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));   <span class="cm">// снова одна строка</span>` } });
ru(LC1_SVC_FIXED, { 3: { h: `    <span class="k">if</span> (car.price > <span class="d">300</span>) <span class="k">return</span> { ...car, price: car.price * <span class="d">0.9</span> };   <span class="cm">// скидка — в Service</span>` } });
ru(REQS, { 4: { u: '/cars  {}  (пусто)' } });
ru(S16, {
  kicker: 'Этап 4 · запустилось', title: 'Терминал и ответы', lockHint: 'Нажмите все пять кнопок запросов',
  segments: {
    a: { key: 'В терминале три строки <b>Mapped</b> — все три route подключены', text: 'И Service, и Controller готовы. Теперь самое интересное: запускаем сервер и отправляем настоящие запросы. Сервер запустился. В терминале три новые строки Mapped: cars GET, cars id GET, cars POST. Все три route подключены. Теперь отправляем запросы.' },
    b: { key: '<code>GET /cars</code> → <b>200</b>: JSON Nest сделал сам, stringify не писали', text: 'GET cars: 200 и список из двух машин в виде JSON. Мы не писали JSON stringify, Nest сам превращает объект в JSON.', show: '<code>GET /cars</code>: <b>200</b> и список из двух машин в виде JSON. Мы не писали <code>JSON.stringify</code>, Nest сам превращает объект в JSON.' },
    c: { key: '<code>GET /cars/1</code> → <b>200</b> и одна машина — Malibu', text: 'GET cars 1: 200 и Malibu.', show: '<code>GET /cars/1</code>: <b>200</b> и Malibu.' },
    d: { key: '<code>GET /cars/99</code> → <b>404</b>: наша NotFoundException, Nest вернул её с сообщением', text: 'GET cars 99: 404 и сообщение Car with id 99 not found. Это наша NotFoundException, Nest привёл её к такому виду: message, error, statusCode.', show: '<code>GET /cars/99</code>: <b>404</b> и сообщение Car with id 99 not found. Это наша NotFoundException, Nest привёл её к такому виду: <code>message</code>, <code>error</code>, <code>statusCode</code>.' },
    e: { key: '<code>POST /cars</code> → <b>201 Created</b> — этот статус Nest поставил сам', text: 'Отправляем POST cars с Cobalt: 201 Created и новая машина, id 3. Обратите внимание, 201 мы не писали. Nest ставит его для POST сам, в Express было бы 200.', show: 'Отправляем <code>POST /cars</code> с Cobalt: <b>201 Created</b> и новая машина, id 3. 201 мы не писали, Nest ставит его для POST сам; в Express было бы 200.' },
    f: { key: 'Пустой <code>POST {}</code> тоже <b>201</b> — Nest <b>сам не проверяет</b> входящие данные', text: 'Ещё одна проверка: отправляем пустой POST, внутри ничего нет. Nest всё равно возвращает 201 и создаёт машину только с id 4. Nest сам не проверяет входящие данные, пока вы ему не скажете.', show: 'Пустой <code>POST /cars {}</code>: Nest всё равно возвращает <b>201</b> и создаёт только <code>{id:4}</code>. Nest сам не проверяет входящие данные, пока вы ему не скажете.' },
    f2: { key: 'Как сказать — <b>DTO + ValidationPipe</b>: на пустой запрос Nest сам вернёт <b>400</b>', text: 'Как сказать: через DTO. В отдельном классе пишут, что brand — строка и обязателен, price — число, и включают ValidationPipe. Тогда на пустой запрос Nest сам вернёт 400, Bad Request. На этом уроке мы его не пишем, но если ученик спросит, ваш ответ такой.', show: 'Как сказать — <b>DTO</b>: в отдельном классе пишут, что <code>brand</code> — строка и обязателен, <code>price</code> — число, и включают <code>ValidationPipe</code>; на пустой запрос Nest сам вернёт <b>400 Bad Request</b>: <code>[&quot;brand should not be empty&quot;, …]</code> (проверено). На этом уроке не пишем — если ученик спросит, ваш ответ такой.' },
    g: { key: 'Вывод: JSON, 201 и сообщение 404 <b>Nest делает сам</b> — нажмите все пять кнопок', text: 'Вывод: Nest сам делает JSON, 201 для POST и сообщение об ошибке, а проверку входящих данных не делает, пока вы не скажете. Теперь сами нажмите все пять кнопок и прочитайте каждый ответ. «Далее» откроется после пяти кнопок.' },
  },
});
ru(P2, {
  kicker: 'Практика 3 / 4', eyebrow: 'Сейчас у вас · 10–15 минут', title: 'Постройте модуль cars',
  segments: {
    a: { key: 'Теперь <b>вы</b>: строите модуль cars в своём проекте за четыре шага', text: 'Снова ваша очередь. Модуль cars, который вы только что видели, вы построите в своём проекте: четыре шага, от десяти до пятнадцати минут.' },
    b: { key: 'Шаг 1: три команды CLI — в терминале <b>3 CREATE, 3 UPDATE</b>', text: 'Первое: тремя командами создайте module, controller и service. В терминале должны появиться три CREATE и три UPDATE.' },
    c: { key: 'Шаг 2: <b>скопируйте</b> код Service — кнопка «Открыть код» внутри шага', text: 'Второе: заполните Service кодом из урока. Внутри второго шага есть кнопка «Открыть код», код там, скопируйте его.' },
    d: { key: 'Шаг 3: Controller <b>напишите сами</b> — образец увидите, но скопировать нельзя', text: 'Третье: Controller напишите сами, двадцать строк. Образец виден по кнопке «Открыть код» внутри третьего шага, но скопировать его нельзя, это специально. Пусть рука почувствует decorator и конструктор. В терминале должны появиться три строки Mapped.' },
    e: { key: 'Шаг 4: четыре запроса — ответы <b>200 · 200 · 404 · 201</b>', text: 'Четвёртое: браузером, Postman или Thunder Client отправьте четыре запроса и сравните ответы с уроком: 200, 200, 404, 201. Сообщение из ответа на cars 99 впишите в поле подтверждения.' },
    f: { key: 'Вышло иначе — нажмите <b>«Вышло иначе?»</b>, откроется окно с решениями', text: 'Если вышло иначе, нажмите внизу кнопку «Вышло иначе», откроется окно с решениями. Пока не отмечены все четыре пункта и не вписано верное подтверждение, «Далее» не откроется. Значит, после этой практики у вас есть собственный модуль cars, и он отвечает на запросы.' },
  },
});
ru(P2_STEPS, [
  { t: 'Модуль cars' },
  { t: 'Service — скопируйте', exp: 'cars.service.ts — «Открыть код» → «копировать», вставьте в файл' },
  { t: 'Controller — напишите сами', exp: 'cars.controller.ts — 20 строк, образец смотрите в «Открыть код» (не копируется) · в терминале 3 строки Mapped {/cars…}' },
  { t: 'Запросы' },
]);
ru(P2_PROOF, { label: 'Подтверждение: поле message в ответе на GET /cars/99', placeholder: 'впишите текст message из ответа', wrong: 'Ожидается: Car with id 99 not found — впишите значение message точно' });
ru(P2_TROUBLE, [
  ['Красная ошибка TypeScript (файл:строка)', 'При копировании пропала строка: сравните указанную строку с кодом в «Открыть код»'],
  [null, 'Есть ли в терминале Mapped {/cars…}? Если нет — app.module.ts → imports: [CarsModule]'],
  ['В POST body undefined', 'В Postman или Thunder Client выбрано Body → JSON? Content-Type: application/json'],
  [null, 'Проект создан как ESM: удалите папку cars-api, создайте проект заново командой из шага 3 практики 1 (скопируйте её целиком) и соберите модуль cars ещё раз'],
]);

// --- 06 · S18–S23, Проверка 4, Практика 4 ---
ru(S18, {
  kicker: 'Этап 5 · ломаем 1', title: 'Ломаем 1: providers пустой',
  segments: {
    x: { key: 'Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>CarsService</code>', text: 'У нас есть работающий модуль. Теперь специально его сломаем, потому что ваши ученики делают именно эти ошибки, а вы должны уметь их читать. На этот раз ломаете вы сами: в коде справа подсвечено слово CarsService, нажмите на него.', act: 'Нажмите на подсвеченный справа в коде <b>CarsService</b> — он удалится из списка providers.' },
    a: { key: 'Ломаем специально: в <code>cars.module.ts</code> <b>providers остался пустым</b>', text: 'Первый случай: в cars module вы удалили CarsService из списка providers, список остался пустым.' },
    b: { key: 'Сервер упал. Часть 1 — <b>какой класс?</b> CarsController; <code>(?)</code> — место ненайденного dependency', text: 'Запускаем сервер, он падает. Читаем сообщение, разделив его на три части. Первая часть, какой класс: Nest не смог найти dependency для CarsController. Знак вопроса в скобках — место ненайденного dependency.', show: 'Запускаем сервер, он падает. Читаем сообщение, разделив его на три части. 1 · <b>какой класс</b>: <b>Nest can\'t resolve dependencies of the CarsController</b> — Nest не смог найти dependency для CarsController. <b>(?)</b> в скобках — место ненайденного dependency.' },
    c: { key: 'Часть 2 — <b>какого dependency не хватает?</b> CarsService, 0-й аргумент конструктора', text: 'Вторая часть, какого dependency не хватает: нулевой аргумент, то есть первый параметр конструктора, CarsService.', show: '2 · <b>какой dependency</b>: <b>argument CarsService at index [0] is available</b> — нулевой аргумент, то есть первый параметр конструктора, CarsService.' },
    d: { key: 'Часть 3 — <b>какой файл?</b> CarsModule, то есть <code>cars.module.ts</code>', text: 'Третья часть, какой файл открываем: Nest искал в CarsModule и не нашёл, значит, это файл cars module ts. Вот ответы на три вопроса: какой класс, какой dependency, какой файл.', show: '3 · <b>какой файл</b>: <b>in the CarsModule module</b> — Nest искал в CarsModule и не нашёл, значит, <code>cars.module.ts</code>. Есть ответы на три вопроса: <b>какой класс · какой dependency · какой файл</b>.' },
    e: { key: 'Ниже Nest <b>сам предлагает решение</b>: есть ли CarsService в этом модуле?', text: 'Ниже Nest сам перечисляет решения. Второе — наш случай: если CarsService — это provider, есть ли он в этом модуле? Нет, мы его удалили.' },
    f: { key: 'Исправляем: <code>providers: [CarsService]</code> вернули — сервер <b>запустился</b>', text: 'Исправляем: открываем файл cars module ts, возвращаем CarsService в список providers и сохраняем. start dev сам перезапускает сервер: в терминале строки Mapped и successfully started.' },
    g: { key: 'Вывод: видите «can\'t resolve dependencies» — <b>откройте файл модуля</b>, проверьте providers', text: 'Вывод: это самая частая ошибка в Nest. Сообщение читаете тремя вопросами: какой класс, какой dependency, какой файл. А ответ всегда в файле модуля: недостающий Service записывается в список providers.' },
  },
});
ru(S19, {
  kicker: 'Этап 5 · ломаем 2', title: 'Ломаем 2: в imports нет CarsModule',
  segments: {
    x: { key: 'Снова <b>ломаете вы</b>: нажмите на <code>CarsModule</code> в списке <code>imports</code>', text: 'Первую ошибку мы прочитали и исправили. Второй случай другой: на этот раз сервер не падает, и именно поэтому это опасно. Ломаете снова вы: в файле app module в списке imports подсвечено слово CarsModule, нажмите на него.', act: 'Нажмите на <b>CarsModule</b> в <b>app.module.ts</b> — он удалится из списка imports.' },
    a: { key: 'Ломаем специально: из <code>imports</code> в <code>app.module.ts</code> убрали CarsModule', text: 'CarsModule убран из списка imports, список остался пустым.' },
    b: { key: 'Подумайте: сервер <b>упадёт с ошибкой</b> или запустится?', text: 'Подумайте: если запустить сервер, он упадёт с ошибкой или запустится?', ask: { q: 'Что сделает сервер?', opts: ['Упадёт с ошибкой', 'Запустится'] } },
    c: { key: 'Сервер <b>запустился</b> — «successfully started», ошибки нет', text: 'Сервер запустился, написал, что всё успешно, вроде бы всё хорошо. Ошибки нет.' },
    d: { key: 'Но <code>/cars</code> → <b>404</b>, а root path работает', text: 'Но если запросить route cars, получим 404, Cannot GET cars. А root path работает.', show: 'Но если запросить <code>/cars</code>, получим <b>404, Cannot GET /cars</b>. А <code>/</code> работает.' },
    e: { key: 'AppModule не подключил CarsModule — Nest <b>вообще не прочитал</b> папку cars. Это скрытая ошибка', text: 'Что случилось? AppModule не подключил CarsModule, поэтому Nest вообще не прочитал папку cars. Ошибки нет, потому что для Nest этого модуля просто не существует. Это скрытая ошибка, самая опасная.' },
    f: { key: 'Как найти: в терминале <b>нет ни строки CarsController, ни Mapped</b>', text: 'Как это найти? Посмотрите на терминал: строки CarsController нет, строки Mapped для cars нет. Я говорил: возьмите в привычку читать строки в терминале. Вот причина.' },
    g: { key: 'Исправляем: <code>imports: [CarsModule]</code> вернули — строки Mapped <b>вернулись</b>', text: 'Исправляем: в файле app module ts возвращаем CarsModule в список imports. Сервер перезапускается, и в терминале возвращаются CarsController и три строки Mapped. Route cars снова работает.' },
    h: { key: 'Вывод: 404, а код выглядит верным — <b>сначала Mapped в терминале</b>, потом imports', text: 'Вывод: если route отдаёт 404, а код выглядит верным, сначала ищите в терминале строку Mapped, потом проверяйте список imports главного модуля.' },
  },
});
ru(S20, {
  kicker: 'Этап 5 · ломаем 3', title: 'Ломаем 3: нет decorator Controller',
  segments: {
    x: { key: 'Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>@Controller(\'cars\')</code>', text: 'Скрытую ошибку мы увидели. Третий случай про decorator: правило с четвёртого экрана теперь увидим на практике. В файле cars controller подсвечен decorator Controller, нажмите на него, чтобы удалить.', act: 'Нажмите на <b>@Controller(\'cars\')</b> в <b>cars.controller.ts</b> — decorator удалится.' },
    a: { key: 'Ломаем специально: <code>@Controller(\'cars\')</code> удалили, класс остался — сервер <b>падает</b>', text: 'Decorator удалён, класс остался на месте. Сервер падает.' },
    b: { key: 'Сообщение: «<b>invalid controller</b>» — метки нет, но класс стоит в списке controllers', text: 'Сообщение: обнаружен неверный controller. У CarsController нет decorator Controller, но он стоит в списке controllers какого-то модуля.' },
    c: { key: 'Сработало правило с 4-го экрана: нет метки — <b>Nest не узнаёт класс</b>', text: 'Nest говорит прямо: вы записали его в список, но у класса нет метки. Вспомните, что я говорил на экране про decorator: нет метки — Nest не узнаёт класс.' },
    d: { key: 'Исправляем: decorator вернули — сервер <b>запустился</b>, строки Mapped на месте', text: 'Исправление — одна строка: возвращаем decorator. Сервер перезапускается, в терминале строки Mapped и successfully started.' },
    e: { key: 'Вывод: «invalid controller» — <b>пропала первая строка</b>, верните decorator', text: 'Вывод: если видите сообщение invalid controller, посмотрите над классом, который назван в сообщении. Ученики часто делают это, когда переписывают код вручную и пропускают первую строку.' },
  },
});
ru(S21, {
  kicker: 'Этап 5 · ломаем 4', title: 'Ломаем 4: нет decorator Injectable',
  segments: {
    x: { key: 'Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>@Injectable()</code>', text: 'Без decorator Nest не узнал класс Controller. А с Service так же? Четвёртый случай: в файле cars service подсвечен decorator Injectable, нажмите на него, чтобы удалить.', act: 'Нажмите на <b>@Injectable()</b> в <b>cars.service.ts</b> — decorator удалится.' },
    a: { key: 'Ломаем специально: из <code>cars.service.ts</code> удалили <code>@Injectable()</code>', text: 'Injectable удалён. У самого Service нет конструктора, он ни от кого не зависит.' },
    b: { key: 'Подумайте: без <code>@Injectable()</code> <code>/cars</code> <b>будет работать?</b>', text: 'Подумайте: если запустить сервер, route cars будет работать?', ask: { q: 'Без decorator Injectable /cars будет работать?', opts: ['Да, будет', 'Нет, будет ошибка'] } },
    c: { key: '<b>Работает!</b> CarsService ни от кого не зависит — Nest создал его как обычно', text: 'Неожиданный результат: всё работает, route cars возвращает 200. Почему? В конструкторе самого CarsService нет никаких dependency. Nest смог создать его без dependency.' },
    d: { key: '<code>@Injectable()</code> говорит Nest: <b>посмотри на конструктор и определи, что нужно</b>', text: 'На самом деле Injectable говорит Nest вот что: посмотрите на конструктор этого класса и определите, что ему нужно. Нет метки — Nest на конструктор не смотрит.' },
    d2: { key: 'Добавим dependency: сервер <b>запускается</b>, но на запросе <b>500</b> — это скрытая ошибка', text: 'Теперь проверим: добавим этому Service без Injectable dependency, в конструкторе запрашивается PricingService. Результат неожиданный: сервер запускается без ошибок, строки Mapped на месте. Но запрос cars возвращает 500, а в терминале TypeError: нельзя прочитать свойство withDiscount у undefined. Nest без ошибки не сделал inject, поле осталось пустым. Это скрытая ошибка: она появляется не при запуске, а на первом запросе.', show: 'Добавили dependency в Service без Injectable (<code>constructor(private pricing: PricingService)</code>). Сервер <b>запускается без ошибок</b>, но <code>GET /cars</code> → <b>500</b>, в терминале <code>TypeError: Cannot read properties of undefined (reading \'withDiscount\')</code>. Nest без ошибки не сделал inject — поле пустое. <b>Скрытая ошибка</b>: не при запуске, а на первом запросе.' },
    d3: { key: 'Исправляем: <code>@Injectable()</code> вернули — PricingService передан через inject, <code>/cars</code> → <b>200</b>', text: 'Исправляем: возвращаем decorator Injectable. PricingService стоит в списке providers модуля. Теперь Nest смотрит на конструктор, делает inject PricingService, и запрос cars снова возвращает 200.', show: 'Исправляем: <code>@Injectable()</code> вернули. <code>PricingService</code> стоит в <code>providers</code> модуля. Теперь Nest смотрит на конструктор, делает inject PricingService, и <code>GET /cars</code> снова возвращает <b>200</b>.' },
    e: { key: 'Вывод: <code>@Injectable()</code> <b>пишут на каждый Service</b>, даже если сейчас он не нужен', text: 'Вывод и правило: Injectable пишут на каждый Service, даже если сейчас он не нужен. Если ученик скажет: я удалил, всё работает, значит, не нужен, — вы сможете объяснить, зачем он: когда появится dependency, ошибка выйдет не при запуске, а во время запроса, и найти её трудно.' },
  },
});
ru(LC2_FIXED, {
  8: { h: `  controllers: [<span class="c">OrdersController</span>],   <span class="cm">// остался только Controller</span>` },
  10: { h: `  providers: [<span class="c">OrdersService</span>, <span class="c">PaymentService</span>],   <span class="cm">// Service — здесь</span>` },
});
ru(S22, {
  kicker: 'Этап 5 · вид ошибки', title: 'Два вида ошибок: Error и HttpException',
  segments: {
    a: { key: 'Ломаем специально: в <code>findOne</code> вместо NotFoundException бросили <b>обычный Error</b>', text: 'До сих пор ошибки появлялись при запуске сервера. Последний случай другой: сервер работает, а ошибка бросается во время запроса. Какой статус вернётся? В findOne внутри cars service ts вместо NotFoundException мы бросили обычный Error с текстом «не найдено».' },
    b: { key: 'Ответ <b>500</b>, текст «не найдено» пропал — Nest скрывает неожиданную ошибку', text: 'Ответ: 500, Internal server error. Наш текст «не найдено» пропал. Nest не показывает неожиданную ошибку пользователю, и это правильно: внутренние детали не должны выходить наружу.' },
    c: { key: '<b>Семейство HttpException</b> Nest узнаёт: возвращает с верным статусом и сообщением', text: 'А NotFoundException — из семейства HttpException в Nest. Nest узнаёт его и возвращает с верным статусом и сообщением.' },
    d: { key: 'Семейство: <b>400</b> BadRequest · <b>401</b> Unauthorized · <b>403</b> Forbidden · <b>404</b> NotFound', text: 'В семействе есть и другие: BadRequest, 400, неверные данные. Unauthorized, 401, вход не выполнен. Forbidden, 403, нет доступа. NotFound, 404, не найдено.' },
    e: { key: 'Исправляем: <code>Error</code> → <code>NotFoundException</code> — ответ снова <b>404</b> с сообщением', text: 'Исправляем: меняем обычный Error в findOne на NotFoundException. Теперь на запрос cars 99 снова приходит 404 и сообщение Car with id 99 not found.' },
    f: { key: 'Вывод: ученик спрашивает «почему 500?» — спросите <b>«какую ошибку вы бросили?»</b> и замените', text: 'Вывод и правило для класса: ошибку, о которой пользователь должен знать, бросают через семейство HttpException, а всё остальное становится 500, и сообщение скрывается. Если ученик спросит, почему выходит 500, ваш первый вопрос: какую ошибку вы бросили? Если обычный Error, замените его на подходящий HttpException: не найдено — NotFound, неверные данные — BadRequest.' },
  },
});
ru(P3, {
  kicker: 'Практика 4 / 4', eyebrow: 'Сейчас у вас · 5 минут', title: 'Сломайте и исправьте сами',
  segments: {
    a: { key: 'Теперь <b>ломаете вы</b>: два случая — прочитаете ошибку своими глазами', text: 'Последняя практика: теперь ломаете вы. Два случая, пять минут. Цель — увидеть и прочитать ошибку своими глазами.' },
    b: { key: 'Шаг 1: очистите <code>providers</code>, найдите в сообщении <b>какой класс · какой dependency · какой файл</b>, верните', text: 'Первое: в cars module очистите список providers, запустите сервер и найдите в сообщении, какой класс, какой dependency и какой файл. Три найденных ответа, класс, dependency и файл, впишите через запятую в поле подтверждения, потом верните providers.' },
    c: { key: 'Шаг 2: уберите CarsModule из <code>imports</code> — найдите, <b>какая строка пропала</b> в терминале', text: 'Второе: в app module уберите CarsModule из imports. Сервер запустится. Найдите, какая строка пропала в терминале, запросите route cars, потом верните.' },
    d: { key: 'Шаг 3: верните всё — в терминале <b>3 строки Mapped</b>, <code>/cars/99</code> → <b>404</b>', text: 'Третье: верните всё и проверьте. В терминале снова должны быть три строки Mapped, а запрос cars 99 должен вернуть 404 и сообщение. Если вышло иначе, нажмите внизу кнопку «Вышло иначе», откроется окно с решениями. Пока все три пункта и подтверждение не верны, «Далее» не откроется. Значит, теперь вы сами находите в сообщении Nest класс, dependency и файл.' },
  },
});
ru(P3_STEPS, [
  { t: 'providers пустой', exp: '«Nest can\'t resolve dependencies of the CarsController (?)» → класс · dependency · файл → верните providers: [CarsService]' },
  { t: 'В imports нет CarsModule', exp: 'сервер запускается · в терминале НЕТ строки CarsController · GET /cars → 404 → верните imports: [CarsModule]' },
  { t: 'Верните и проверьте', exp: 'в терминале снова 3 строки Mapped {/cars…} · GET /cars/99 → 404 «Car with id 99 not found»' },
]);
ru(P3_TROUBLE, [
  ['Вернул, но ошибка осталась', 'Вы сохранили файл? start:dev сам перезапускается при сохранении; дождитесь новых строк в терминале'],
  ['Вышла другая ошибка', 'Прочитайте сообщение тремя вопросами: какой класс · какой dependency · какой файл. Список Potential solutions подскажет решение'],
]);
ru(P3_PROOF, { label: 'Подтверждение: из сообщения шага 1 — какой класс, какой dependency, какой файл? (через запятую)', placeholder: 'класс, dependency, файл', wrong: 'Перечитайте сообщение: «of the ___» — класс, «argument ___ at index [0]» — dependency, «in the ___ module» — файл' });

// --- 07 · мост, план урока, вопросы, самопроверка, итог ---
ru(TREE, { 5: { t: '    app.service.ts  (это не Service!)' }, 10: { t: '    auth/ (вход)' } });
ru(S25A_SAY, {
  y: [[null, 'форма таблицы в базе: TypeORM строит таблицу по этому классу'], [null, 'форма входящих данных: здесь проверяются обязательные поля и типы, при ошибке — 400'], [null, 'методы записи в базу и чтения: через него Service обращается к базе']],
  r: [[null, 'модуль входа и регистрации'], [null, 'проверяет токен, пока запрос не дошёл до Controller; если токен недействителен, останавливает запрос'], [null, 'готовые методы CRUD для всех Service, admin service наследуется от него'], [null, 'пропуск вошедшего пользователя'], [null, 'помощник, чтобы все ответы возвращались в одной форме'], [null, 'здесь запускается сервер (класс Aplication). Называется app.service, но в этом проекте это не Service'], [null, 'возвращает все ошибки в одной форме: { statusCode, error: { message } }'], [null, 'читает значения из .env (PORT, DEV_DB_URL)']],
});
ru(S25a, {
  kicker: 'Этап 7 · как вести урок ученика', title: 'Проект, который клонирует ученик',
  segments: {
    a: { key: 'Ученик <b>не пишет с нуля</b>: клонирует готовый проект с GitHub и запускает его', text: 'Вы сами построили Nest и сами его сломали. Теперь переходим к главной цели урока: передать эту тему ученику. Сначала посмотрим на урок ученика, потому что он видит эту тему по-другому. Ученик не пишет с нуля: он клонирует с GitHub готовый проект, IntroNestArxitechture, и запускает его.' },
    b: { key: 'Проект больше: папки <code>api</code> · <code>core</code> · <code>common</code> · <code>infrastructure</code>', text: 'Проект больше: папки api, core, common, infrastructure.' },
    c: { key: '<b>Зелёное</b> — сегодня видели в коде: admin module, controller, service — это наш cars', text: 'Места, отмеченные зелёным, вы сегодня видели в коде: admin module, admin controller, admin service и главный модуль. Это ровно наши файлы cars, только для admin и побольше. На уроке вы покажете их с кодом.' },
    d: { key: '<b>Жёлтое</b> — Entity · DTO · Repository: если ученик спросит, объясните <b>одной фразой</b>', text: 'Жёлтые места: entity, dto и repository. В уроке ученика они появляются с названием и задачей, если спросят — объясните одной фразой. Entity — форма таблицы в базе: TypeORM строит таблицу по этому классу.' },
    d2: { key: '<b>DTO</b> — форма входящих данных, <b>Repository</b> — запись в базу и чтение', text: 'DTO — форма входящих данных: здесь проверяются обязательные поля и типы. Repository — методы записи в базу и чтения: через него Service обращается к базе. Их код вы полностью изучите в следующих уроках курса для менторов, сейчас достаточно одной фразы.' },
    e: { key: '<b>Серое</b> — auth, Guard, BaseService, filter, config: <b>название и задача</b>, по одной фразе', text: 'Серые места. Модуль auth отвечает за вход и регистрацию. Guard проверяет токен, пока запрос не дошёл до Controller, и если токен недействителен, останавливает запрос. BaseService — готовые методы CRUD для всех Service, admin service наследуется от него. Token — пропуск вошедшего пользователя. successRes — помощник, чтобы все ответы возвращались в одной форме.' },
    e2: { key: 'Осторожно: сервер запускается в <code>api/app.service.ts</code> — называется Service, но <b>это не Service</b>', text: 'Одно место, где нужно быть осторожным: в этом проекте сервер запускается не в main ts, а в файле app service ts в папке api. Называется app service, но это не Service, а класс, который запускает сервер. Если ученик спросит, скажите именно это.' },
    e3: { key: 'Не волнуйтесь: особенности этого проекта вы <b>склонируете и посмотрите на следующем уроке для менторов</b>', text: 'Не волнуйтесь: особенности этого проекта — то, что routes начинаются с api v1, форму ответа с ошибкой и BaseService — вы сами склонируете и посмотрите на следующем уроке для менторов. А для урока ученика этих фраз достаточно.' },
    f: { key: 'Вывод: для <b>каждого цветного места в структуре у вас есть готовая фраза</b>', text: 'Вывод: зелёные файлы показываете с кодом, жёлтые и серые объясняете одной фразой и возвращаетесь к уроку. Урок ученика не открывает код этих файлов, поэтому одной фразы достаточно.' },
  },
});
ru(DICT, [
  ['официант', null, 'принимает запрос, передаёт на кухню'], ['повар', null, 'выполняет работу'], ['кладовщик', null, 'общается с базой'], ['чертёж стеллажа', null, 'форма таблицы'],
  ['анкета заказа', null, 'форма входящих данных'], ['контролёр', null, 'проверяет токен'], ['одинаковый поднос', null, 'форма ответа'], ['штатное расписание', null, 'список'],
]);
ru(S25b, {
  kicker: 'Этап 7 · как вести урок ученика', title: 'Язык урока ученика: ресторан',
  segments: {
    a: { key: 'Урок ученика говорит <b>языком ресторана</b>: официант, повар, кладовщик…', text: 'Файлы проекта мы увидели. Теперь узнаем, какими словами ученик их запоминает. Урок ученика говорит языком ресторана: Controller — официант, Service — повар, Repository — кладовщик, Guard — контролёр, Module — штатное расписание. Ученик думает этими словами.' },
    b: { key: 'Ученик говорит «повар» — вы знаете, что это <b>Service</b>, и показываете файл', text: 'Теперь вы знаете оба языка: ученик говорит «повар», а вы знаете, что это Service, и показываете нужный файл. На уроке говорите оба слова вместе: повар, то есть Service.' },
    c: { key: 'Вывод: метафора объясняет <b>задачу</b>, а не код — говорите оба слова вместе', text: 'Вывод и одно предупреждение: метафора объясняет задачу, а не код. Когда ученик слышит «официант не заходит на кухню», пусть понимает: Controller вызывает Service, но сам ничего не считает. Эту границу держите вы.' },
  },
});
ru(MAP, [
  { t: 'Вступление', d: '«Боль» server.js на 1240 строк → «клонируем готовый проект», план из 4 шагов', m: 'Вы видели это на 2-м экране этого урока: ученик тоже начинает с этой боли. Не называйте Nest рано — сначала боль.' },
  { t: 'Clone и запуск', d: 'git clone + npm install, заполнить .env, start:dev; тест: где лежит ключ', m: 'Больше всего времени уходит здесь. Пока сервер не работает у всех, дальше не идите.' },
  { t: 'Swagger и карта здания', d: 'двери Swagger (endpoints), структура папок; тест: задача Controller', m: 'Здесь появляется слово «официант». В структуре сами покажите зелёные файлы (module/controller/service).' },
  { t: 'Путь заказа', d: 'порядок Guard → Controller → Service → Repository → successRes собирают перетаскиванием; тест', m: 'Это наш экран «путь запроса», только на две остановки больше: Guard проверяет токен, Repository пишет в базу. На каждую — одна фраза, готовые фразы на 33-м экране.' },
  { t: 'Слои', d: 'Entity/BaseEntity, DTO (201/400), BaseService (готовый CRUD), Module (смена), порядок из 5 шагов; тест', m: 'Не глубоко: по одной фразе на каждый. Entity — форма таблицы, DTO — форма входящих данных (если неверные — 400), BaseService — готовый CRUD, Module — список. Не волнуйтесь: Entity, DTO и Repository вы полностью, с кодом, изучите в следующих уроках курса для менторов.' },
  { t: 'Сборка и итог', d: 'ИИ пишет 5 файлов, итоговый debugging (убрать строку с ошибкой), практическое задание, арена, карточки', m: 'На экране debugging работает правило, которое вы сегодня выучили: в Controller не считают.' },
]);
ru(R1, {
  kicker: 'Этап 7 · план урока', eyebrow: 'm4a-01 · «Nest архитектура — живой обзор»', title: 'Карта урока ученика: 6 блоков, 22 экрана',
  segments: {
    a: { key: 'Урок ученика <b>m4a-01</b>: 6 блоков, 22 экрана — что вы говорите в каждом блоке', text: 'Вы знаете и проект, и язык ученика. Теперь посмотрим сам урок ученика экран за экраном, потому что вести его будете вы. Двадцать два экрана, шесть блоков. Для каждого блока: что делает ученик и что говорите вы.' },
    b: { key: 'Блок 1 · вступление: ученик тоже начинает <b>с той же боли</b> — не называйте Nest рано', text: 'Первый блок, вступление: ученик видит файл на 1240 строк и получает план — клонировать готовый проект. Вы видели это в начале этого урока. Не называйте Nest рано, сначала боль.' },
    c: { key: 'Блок 2 · clone и запуск: здесь уходит <b>больше всего времени</b>', text: 'Второй блок, clone и запуск: git clone, npm install, файл env, start dev. Больше всего времени уходит здесь. Пока сервер не работает у всех, дальше не идите.' },
    d: { key: 'Блок 3 · Swagger и структура папок: здесь появляется слово <b>«официант»</b>', text: 'Третий блок: ученик смотрит двери в Swagger, потом структуру папок. Здесь появляется слово «официант». В структуре сами покажите файлы module, controller и service.' },
    e: { key: 'Блок 4 · путь заказа: наш путь запроса + <b>Guard и Repository</b>', text: 'Четвёртый блок, путь заказа: ученик перетаскиванием собирает порядок — контролёр, официант, повар, кладовщик, поднос. Это наш экран «путь запроса», только на две остановки больше: Guard проверяет токен, Repository пишет в базу. На каждую достаточно одной фразы.' },
    f: { key: 'Блок 5 · слои: Entity, DTO, BaseService — <b>по одной фразе</b>, не глубоко', text: 'Пятый блок, слои: Entity, DTO, BaseService, Module и порядок из пяти шагов. Не глубоко, по одной фразе на каждый. Entity — форма таблицы. DTO — форма входящих данных, если они неверные — 400. BaseService — готовые методы CRUD. Module — список. Не волнуйтесь: Entity, DTO и Repository вы полностью, с кодом, изучите в следующих уроках курса для менторов. А в этом блоке урока ученика достаточно одной фразы.' },
    g: { key: 'Блок 6 · сборка с ИИ и debugging: работает правило <b>«в Controller не считают»</b>', text: 'Шестой блок: ученик поручает ИИ написать пять файлов, потом итоговый debugging — находит и убирает строку с ошибкой, затем практическое задание и арена. На экране debugging работает правило, которое вы сегодня выучили: в Controller не считают. А код от ИИ проверяете, как на шестом этапе: четыре вопроса и три неожиданных запроса.' },
    h: { key: 'Вывод: больше всего сил — <b>блок 2 (сервер)</b> и <b>блок 6 (debugging)</b>', text: 'Вывод: из шести блоков два требуют от вас больше всего сил. Второй — потому что сервер должен работать у всех. Шестой — потому что в debugging ученик должен сам найти сегодняшнее правило.' },
  },
});
ru(STUMBLE, [
  { q: 'git clone не работает', a: 'Git не установлен или нет интернета. Запасной вариант: скачать ZIP с GitHub и распаковать. Перед уроком сами один раз склонируйте проект.' },
  { q: 'npm install долго или с ошибкой', a: 'Терпение: 2–5 минут — это нормально. Если ошибка — проверьте версию Node (20+), удалите node_modules и попробуйте снова.' },
  { q: '.env не заполнен — сервер падает', a: 'Проект подключается к PostgreSQL: «Unable to connect to the database» — причину говорит вторая строка (на следующем экране четыре сообщения). cp .env.example .env, потом проверьте, что PostgreSQL запущен.' },
  { q: 'Порт 3000 занят', a: 'Остался открытым сервер с прошлого урока. Закройте его или запустите с PORT=3001.' },
  { a: 'Теперь вы умеете это читать: какой класс, какой dependency, какой файл. Прочитайте сообщение в терминале вместе с учеником, ответ не говорите, задавайте вопросы: какой файл? какой список?' },
  { q: '«Почему не Express?» или путаница в метафоре', a: 'Одна фраза: в большом проекте нужен порядок, Nest делает порядок обязательным, а внутри тот же Express. Если метафора запуталась, верните к словарю: повар, то есть Service.' },
]);
ru(R2, {
  kicker: 'Этап 7 · план урока', eyebrow: 'm4a-01 · что происходит на уроке', title: '6 мест, где ученик спотыкается',
  segments: {
    a: { key: '6 ситуаций, которые <b>обязательно</b> будут в классе, — на каждую нужен готовый ответ', text: 'План вы знаете. Теперь посмотрим, где план ломается: шесть ситуаций, которые на уроке будут обязательно. На каждую у вас должен быть готовый ответ.' },
    b: { key: '1 · <code>git clone</code> не работает → запасной вариант: <b>скачать ZIP</b> с GitHub', text: 'Первая: git clone не работает. Git не установлен или нет интернета. Запасной вариант: скачать ZIP с GitHub и распаковать. Перед уроком сами один раз склонируйте проект.' },
    c: { key: '2 · <code>npm install</code> долго или с ошибкой → 2–5 минут — норма, <b>Node 20+</b>', text: 'Вторая: npm install идёт долго или с ошибкой. От двух до пяти минут — это нормально. Если ошибка, проверьте версию Node, она должна быть 20 или выше, удалите папку node modules и попробуйте снова.' },
    d: { key: '3 · нет <code>.env</code> или не работает PostgreSQL → сервер <b>падает</b>', text: 'Третья, самая важная: не создан файл env. Проект подключается к PostgreSQL. Если нет адреса базы или PostgreSQL не работает, сервер не запустится: Unable to connect to the database. На следующем экране прочитаем четыре вида этой ошибки.' },
    e: { key: '4 · порт 3000 занят → <b>закройте прошлый сервер</b> или дайте другой порт', text: 'Четвёртая: порт 3000 занят. Остался открытым сервер с прошлого урока. Закройте его или запустите на другом порту.' },
    f: { key: '5 · «can\'t resolve» → <b>читайте вместе</b> с учеником, ответ не говорите', text: 'Пятая: ошибка can\'t resolve dependencies. Теперь вы умеете это читать: какой класс, какой dependency, какой файл. Прочитайте сообщение в терминале вместе с учеником, ответ не говорите, задавайте вопросы: какой файл, какой список.' },
    g: { key: '6 · «Почему не Express?» → <b>одна фраза</b>: нужен порядок, внутри тот же Express', text: 'Шестая: вопрос «почему не Express» или путаница в метафоре. Одна фраза: в большом проекте нужен порядок, Nest делает порядок обязательным, а внутри тот же Express. Если метафора запуталась, верните к словарю.' },
    h0: { key: 'Внимание: в проекте ученика routes начинаются с <code>/api/v1</code> — забыли префикс — <b>404</b>', text: 'Ещё одно предупреждение: в проекте ученика все routes начинаются с api v1, не admin, а api v1 admin. Если забыть префикс, будет 404. Этот проект вы полностью, с клонированием, посмотрите на следующем уроке для менторов.', show: 'Ещё одно предупреждение: в проекте ученика все routes начинаются с <code>/api/v1</code> — не <code>/admin</code>, а <code>/api/v1/admin</code>; забыли префикс — <b>404</b>. Этот проект вы полностью, с клонированием, посмотрите на следующем уроке для менторов.' },
    h: { key: 'Вывод: перед уроком <b>сами один раз поднимите проект</b> — заранее узнаете, где споткнутся', text: 'Вывод: большинство этих ситуаций случается в первые двадцать минут урока. Поэтому перед уроком сами один раз склонируйте проект и запустите его с env: вы сами почувствуете, где можно споткнуться.', show: 'Вывод: большинство этих ситуаций случается в первые 20 минут урока. Перед уроком сами один раз склонируйте проект и запустите его с .env: вы сами почувствуете, где можно споткнуться.' },
  },
});
ru(DB_ERRS, { 13: { h: `<span class="er">ERROR [ExceptionHandler] error: …</span>   <span class="cm">← после 10 попыток сервер падает</span>` } });
ru(DB_ROWS, [
  { s: 'PostgreSQL не запущен или неверный порт', f: '<b>Запустите PostgreSQL</b>: Windows — Services → postgresql → Start · Mac — <code>brew services start postgresql</code> · Linux — <code>sudo systemctl start postgresql</code>. Потом проверьте, что в .env порт 5432' },
  { s: '.env нет или DEV_DB_URL не прочитан (пароль undefined)', f: '<b>В папке проекта: <code>cp .env.example .env</code></b> (Windows: <code>copy .env.example .env</code>). Внутри <code>DEV_DB_URL</code> уже есть — замените пароль на свой и перезапустите сервер' },
  { s: 'неверный пароль или пользователь в .env', f: 'в .env.example пароль просто <code>password</code> — впишите в <code>DEV_DB_URL</code> свой пароль от PostgreSQL; проверьте через <code>psql -U postgres</code>' },
  { s: 'подключение и пароль верные, но базы с таким именем нет', f: 'создайте базу: <code>createdb -U postgres nestarxitechture</code> (имя — последнее слово в DEV_DB_URL)' },
]);
ru(RDB, {
  kicker: 'Этап 7 · план урока', eyebrow: 'm4a-01 · самая частая ошибка в классе', title: 'База не подключилась: четыре сообщения, четыре причины',
  segments: {
    a: { key: 'Проект ученика <b>подключается к PostgreSQL</b> — это ошибка №1 в классе, причина всегда <b>во 2-й строке</b>', text: 'Третью ситуацию с прошлого экрана, env и PostgreSQL, разберём отдельно, потому что в классе на неё уходит больше всего времени. Сегодня вы изучили четыре ошибки Nest. Но в классе чаще всего выходит другая: проект ученика подключается к PostgreSQL, и подключение часто не получается с первого раза. Сообщение всегда начинается одинаково: Unable to connect to the database, Retrying. А причина во второй строке. Четыре реальных случая.' },
    b: { key: '1 · <b>ECONNREFUSED</b> → PostgreSQL не запущен: <b>запустите PostgreSQL</b>', text: 'Первый: connect ECONNREFUSED, адрес и порт. Значит, на этом порту никто не отвечает: PostgreSQL не запущен или в файле env неверный порт. Решение: запустите PostgreSQL. В Windows в окне Services запускаете postgresql кнопкой Start, в Mac и Linux — командой из таблицы. Потом проверьте порт.', show: '<b>connect ECONNREFUSED 127.0.0.1:5432</b>: на этом порту никто не отвечает — PostgreSQL не запущен или в .env неверный порт. Решение: <b>запустите PostgreSQL</b> (Windows: Services → postgresql → Start; Mac/Linux: команда из таблицы), потом проверьте порт.' },
    c: { key: '2 · <b>client password must be a string</b> → нет .env: <code>cp .env.example .env</code>', text: 'Второй, самый обманчивый: client password must be a string. Это не значит, что пароль неверный. Пароля нет совсем, он undefined: нет файла env. В проекте ученика есть готовый образец, файл env example. Решение одно: скопировать этот образец в файл env, заменить внутри пароль на свой и перезапустить сервер. В классе скажите это всем в первую очередь.', show: '<b>client password must be a string</b> — самый обманчивый: пароль не неверный, пароля <b>нет совсем</b> (undefined) — нет файла .env. В проекте есть готовый образец: <b>.env.example</b>. Решение: <code>cp .env.example .env</code>, замените внутри пароль на свой, перезапустите сервер. В классе скажите это всем в первую очередь.' },
    d: { key: '3 · <b>password authentication failed</b> → неверный пароль в .env: впишите <b>свой пароль</b>', text: 'Третий: password authentication failed for user. Вот теперь действительно неверный пароль или имя пользователя. В классе это бывает часто, потому что в env example пароль — просто слово password. Решение: вписать в DEV DB URL свой пароль от PostgreSQL.', show: '<b>password authentication failed for user "postgres"</b>: теперь действительно неверный пароль или пользователь. В классе бывает часто: в .env.example пароль просто <code>password</code>. Решение: впишите в <code>DEV_DB_URL</code> свой пароль от PostgreSQL.' },
    d2: { key: '4 · <b>database … does not exist</b> → база не создана: <code>createdb</code>', text: 'Четвёртый: database, имя, does not exist. Подключение есть, пароль верный, но в PostgreSQL нет базы с таким именем: её ещё никто не создал. В проекте ученика имя в конце DEV DB URL, nestarxitechture. Решение: создать базу с этим именем.', show: '<b>database "…" does not exist</b>: подключение и пароль верные, но базы с таким именем <b>не создано</b>. В проекте ученика имя в конце <code>DEV_DB_URL</code>: <code>nestarxitechture</code>. Решение: <code>createdb -U postgres nestarxitechture</code>.' },
    e: { key: 'Вывод: «Unable to connect» → <b>код не трогайте</b> — читайте 2-ю строку, проверяйте .env и PostgreSQL', text: 'TypeORM делает десять попыток, потом сервер падает. Вывод и правило: если видите Unable to connect, код не трогайте, проблема не в коде. Прочитайте вторую строку, проверьте файл env и PostgreSQL. Эти четыре сообщения есть и в памятке.' },
  },
});
ru(PLAN90, [
  { n: 'Вступление и боль', d: 'пример server.js, план из 4 шагов' },
  { n: 'Clone и запуск', d: 'пока сервер не заработает у всех; .env и PostgreSQL' },
  { n: 'Swagger, карта здания, тесты 1–2', d: 'двери, папки, «официант»' },
  { n: 'Путь заказа, тест 3' },
  { n: 'Слои, тест 4', d: 'Entity, DTO, BaseService, Module — название и задача' },
  { n: 'Сборка с ИИ, debugging, арена', d: 'сегодняшнее правило: в Controller не считают' },
]);
ru(R3, {
  kicker: 'Этап 7 · план урока', eyebrow: 'm4a-01 · 90 минут (предложение)', title: 'План по времени и три правила',
  segments: {
    a: { key: 'Предложение: <b>90 минут, шесть частей</b> — меняйте под свой класс', text: 'Места, где спотыкаются, и решения вы знаете. Теперь распланируем время. Предлагаемый план: девяносто минут, шесть частей. Это предложение, меняйте его под свой класс.' },
    b: { key: '0–30: вступление и clone — <b>пока сервер не работает у всех</b>, дальше не идите', text: 'Первые тридцать минут: вступление и clone. Самая опасная часть — clone и запуск, поэтому на неё двадцать минут.' },
    c: { key: '30–60: Swagger, карта папок, <b>путь заказа</b> и три теста', text: 'С тридцатой по шестидесятую минуту: Swagger, карта здания, путь заказа и три теста.' },
    d: { key: '60–90: слои, <b>сборка с ИИ</b>, debugging и арена', text: 'С шестидесятой по девяностую: слои, сборка с ИИ, итоговый debugging и арена.' },
    e: { key: 'Вывод — три правила: <b>сначала сервер · два слова вместе · читать сообщение вместе</b>', text: 'Вывод: три правила. Первое: пока сервер не работает у всех, дальше не идите. Второе: говорите метафору и термин вместе: повар, то есть Service. Третье: если вышла ошибка, читайте сообщение в терминале вместе с учеником, ответ не говорите.' },
  },
});
ru(QA, [
  ['Почему Nest, а не Express?', 'Когда проект большой, нужен порядок; Nest делает порядок обязательным, а внутри тот же Express.'],
  ['Что такое decorator?', 'Метка над классом или методом; говорит Nest, что это такое, код не выполняет.'],
  ['Что такое providers?', 'То, что этот модуль создаёт, в основном Service.'],
  ['Зачем мы вынесли Service отдельно?', 'Чтобы тестировать отдельно и использовать повторно; а в Controller не остаётся логики.'],
  ['Nest быстрее Express?', 'Нет, скорость одинаковая, внутри Express. Nest даёт не скорость, а порядок.'],
  ['Я удалил Injectable, всё работает. Он не нужен?', 'Сработало, потому что нет dependency; когда dependency появится, сервер запустится, но на запросе будет 500 TypeError — скрытая ошибка. Поэтому его пишут всегда.'],
]);
ru(S26, {
  kicker: 'Этап 7 · вопросы', title: 'Вопросы, которые задаст ученик',
  segments: {
    a: { key: '<b>6 вопросов</b>, которые вам зададут на уроке, и готовые ответы', text: 'План урока готов. Последняя подготовка: вопросы, которые вам задаст ученик. Примерно такие.' },
    q1: { key: '1 · «Почему не Express?» → в большом проекте <b>нужен порядок</b>, внутри тот же Express', text: 'Первый: почему Nest, а не Express? Ответ: когда проект большой, нужен порядок, Nest делает порядок обязательным, а внутри тот же Express.' },
    q2: { key: '2 · «Что такое decorator?» → <b>метка</b> над классом: говорит Nest, «что это»', text: 'Второй: что такое decorator? Метка над классом или методом, она говорит Nest, что это такое.' },
    q3: { key: '3 · «Что такое providers?» → то, что модуль <b>создаёт</b>, в основном Service', text: 'Третий: что такое providers? То, что этот модуль создаёт, в основном Service.' },
    q4: { key: '4 · «Зачем отдельный Service?» → чтобы <b>тестировать отдельно</b> и использовать повторно', text: 'Четвёртый: зачем мы вынесли Service отдельно? Чтобы тестировать отдельно и использовать повторно, а в Controller не остаётся логики.' },
    q5: { key: '5 · «Nest быстрее?» → нет, внутри Express; Nest даёт <b>не скорость, а порядок</b>', text: 'Пятый: Nest быстрее? Нет, скорость одинаковая, потому что внутри Express. Nest даёт не скорость, а порядок.' },
    q6: { key: '6 · «Без Injectable же работает?» → пока да; добавится dependency — <b>скрытая ошибка, 500</b>', text: 'Шестой: я удалил Injectable, а всё работает. Это потому, что нет dependency; когда dependency появится, сервер запустится, но на запросе будет 500, скрытая ошибка. Поэтому его пишут всегда.' },
    z: { key: 'Вывод: если на какой-то вопрос не можете ответить — <b>вернитесь к тому экрану урока</b>', text: 'Вывод: пусть эти шесть ответов будут у вас наготове. Нажмите на каждую карточку и прочитайте ответ ещё раз. Если на какой-то вопрос сами ответить не можете, вернитесь к тому экрану урока.' },
  },
});
ru(FINAL, [
  { q: 'Какая библиотека на самом деле принимает запрос внутри Nest?', o: ['Собственный HTTP-сервер Nest', null, 'Напрямую модуль http из Node', 'Всегда Fastify'], e: 'Nest — слой над Express; его можно заменить на Fastify, но по умолчанию это Express.' },
  { q: 'Какой path открывают вместе @Controller(\'cars\') и @Get(\':id\')?', e: 'Префикс Controller + путь метода.' },
  { q: 'В методе POST статус не указан. Что вернёт Nest?', e: 'Для POST Nest сам ставит 201.' },
  { q: '«Nest can\'t resolve dependencies of the X (?)» — что означает знак вопроса?', o: ["Неизвестный модуль — нет import", "Место ненайденного аргумента", "Синтаксическая ошибка — скобка не закрыта", "Нет route — Controller пустой"], e: 'В скобках аргументы конструктора, ? — тот, что не найден.' },
  { q: 'Сервер «successfully started», /cars 404, в терминале нет Mapped {/cars…}. Самая вероятная причина?', o: ["CarsModule нет в imports AppModule", "Нет Injectable — CarsService не подключён", "Порт занят — сервер на другом порту", "Ошибка в Service — он возвращает 404"], e: 'Скрытая ошибка: модуль не подключён, Nest не прочитал папку.' },
  { q: 'Внутри Service throw new Error(\'x\'). Что получит клиент?', o: ['404 и «x»', null, null, 'Ничего, сервер упадёт'], e: 'Обычный Error → 500, сообщение скрыто.' },
  { q: 'Новое сообщение: «Nest can\'t resolve dependencies of the UsersService (?, JwtService). Please make sure that the argument ConfigService at index [0] is available in the UsersModule module.» Что вы сделаете?', o: ["users.module.ts — ConfigService в providers", "users.service.ts — удалить JwtService из конструктора", "app.module.ts — добавить UsersService в controllers", "Добавить @Injectable() в UsersService"], e: 'Класс: UsersService · dependency: ConfigService, index [0] · файл: users.module.ts (UsersModule). JwtService найден (второе место), проблема не в нём.' },
  { q: 'orders.module.ts: controllers: [OrdersController], providers: [] — в конструкторе OrdersController запрашивается OrdersService. Что сделает сервер?', o: ["Запустится, /orders → вернёт 404", "Упадёт: can't resolve dependencies (?)", "Запустится, /orders → вернёт 500", "Упадёт: invalid controller detected"], e: 'providers пустой → Nest не может найти OrdersService → падает при запуске (как в «ломаем 1»).' },
]);
ru(S28_ITEMS, [
  { t: 'Nest — обязательный порядок поверх Express' },
  { t: 'Controller принимает запрос — логику в нём не пишут' },
  { t: 'Service выполняет работу и ничего не знает о запросе' },
  { t: 'Module — список, Nest видит только то, что в списке' },
  { t: 'Dependency Injection: вы не создаёте, Nest передаёт через конструктор' },
  { t: 'Ошибку Nest читают: какой класс · какой dependency · какой файл' },
  { t: 'Код от ИИ проверяют 4 вопросами и 3 неожиданными запросами' },
]);
ru(HOMEWORK, [
  { t: 'Модуль users' },
  { t: 'Service: список пользователей + findAll, findOne, create; если не найден — NotFoundException' },
  { t: 'Controller: GET /users · GET /users/:id · POST /users — в терминале 3 строки Mapped' },
  { t: 'Один раз специально сломайте (очистите providers), прочитайте сообщение, исправьте' },
  { t: 'Выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе', c: ['git add . && git commit -m "модуль users"', null] },
]);
// S28: segmentlar render paytida yig'iladi (o'tgan/o'tmagan) — ruschasi id bo'yicha, s28Ru() qo'yadi
const S28_RU = {
  a_pass: { key: '<b>Отлично!</b> Вы хорошо усвоили урок — соберём сегодняшний урок одним взглядом', text: 'Отлично! Вы хорошо усвоили урок. Теперь соберём всё, что вы сегодня изучили, одним взглядом.' },
  a_fail: { key: 'Вы дошли до конца урока — советую <b>пройти тест заново</b>', text: 'Вы дошли до конца урока. В итоговом тесте нужно было шесть баллов, поэтому перед завершением советую пройти тест заново. А сейчас соберём сегодняшний урок одним взглядом.' },
  b1: { key: 'Nest — <b>обязательный порядок</b> поверх Express', text: 'Первое: Nest — это обязательный порядок поверх Express. Внутри работает тот же Express.' },
  b2: { key: '<b>Controller</b> принимает запрос, вызывает Service, возвращает ответ — <b>логику не пишут</b>', text: 'Второе: Controller принимает запрос, вызывает Service и возвращает ответ. Расчётов в нём нет.' },
  b3: { key: '<b>Service</b> выполняет работу и ничего не знает о запросе', text: 'Третье: Service выполняет работу и ничего не знает о запросе. Поэтому его легко тестировать отдельно и использовать повторно.' },
  b4: { key: '<b>Module</b> — список: Nest видит только то, что в списке', text: 'Четвёртое: Module — это список. Nest видит только то, что записано в списке.' },
  b5: { key: '<b>Dependency Injection</b>: пишете в providers, просите в конструкторе — inject делает Nest', text: 'Пятое: Dependency Injection. Вы записываете Service в providers и просите его в конструкторе, а создаёт его и делает inject Nest.' },
  b6: { key: 'Ошибку Nest <b>читают</b>: какой класс · какой dependency · какой файл', text: 'И самое важное: ошибку Nest можно прочитать. В сообщении написано, какой класс, какого dependency не хватает и какой файл открыть, а ответ чаще всего в файле модуля.' },
  b7: { key: 'Код от ИИ проверяют <b>4 вопросами</b> и <b>3 неожиданными запросами</b>', text: 'И ещё одно: код от ИИ читайте по четырём вопросам и отправляйте три неожиданных запроса: id из букв, пустой body и чужое поле.' },
  hw: { key: '<b>Домашнее задание</b>: сами добавьте в cars-api модуль <code>users</code> и выложите на GitHub', text: 'Домашнее задание. Добавьте в свой проект cars api модуль users тем же способом, что на этом уроке: три команды CLI, в Service список пользователей и методы findAll, findOne, create, а если не найден — NotFoundException. В Controller три route. Потом один раз специально сломайте, например очистите providers, прочитайте сообщение и исправьте. Готовый проект выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе.' },
  c: { key: '<b>Возьмите памятку</b>: команды, ошибки, правила и домашнее задание — на одной странице', text: 'Ниже памятка на одну страницу: команды, четыре ошибки Nest, ошибки подключения к базе, правила, словарь урока ученика и домашнее задание. Скопируйте или скачайте её, пусть будет рядом, когда будете вести урок ученика.' },
  z: { key: 'Спасибо! Нажмите <b>«Завершить урок»</b>', text: 'Спасибо. Нажмите кнопку «Завершить урок», и урок будет отмечен как пройденный.' },
};
const CHEATSHEET_RU = `# Nest-1 — памятка ментора
## Команды
npm i -g @nestjs/cli@12 · nest new cars-api -p npm --type cjs --no-observe --skip-skills · npm run start:dev
nest g module cars · nest g controller cars --no-spec · nest g service cars --no-spec
## Три части
Controller — принимает запрос, вызывает Service, возвращает ответ (логику не пишут)
Service — работа: расчёты, правила, база; нет req/res; @Injectable()
Module — список: imports · controllers · providers; нет в списке = нет для Nest
## Dependency Injection
constructor(private readonly carsService: CarsService) — вы не создаёте, Nest создаёт по providers (1 instance)
## 4 ошибки
1 «can't resolve dependencies of the X (?) … argument Y at index [0] … in the Z module» → Y в providers модуля Z
2 сервер запустился, /cars 404, в терминале нет Mapped {/cars…} → AppModule imports: [CarsModule]
3 «invalid controller … does not have the @Controller() decorator» → верните decorator
4 без @Injectable работает (нет dependency) → если добавить dependency: сервер запускается, на запросе 500 TypeError (скрытая ошибка) → всё равно пишут
## База не подключилась (проект ученика, TypeORM — «Unable to connect to the database. Retrying (1)…», 10 попыток, потом падает)
connect ECONNREFUSED 127.0.0.1:5432 → запустите PostgreSQL (Windows: Services → postgresql; Mac: brew services start postgresql; Linux: sudo systemctl start postgresql)
SASL … client password must be a string → нет .env: cp .env.example .env, замените пароль на свой
password authentication failed for user → в .env.example пароль «password» — в DEV_DB_URL свой пароль
database "…" does not exist → createdb -U postgres nestarxitechture (имя — в конце DEV_DB_URL)
## Помощь
Если ничего не подошло: скриншот + текст ошибки → Telegram-группа курса для менторов
## Вид ошибки
семейство HttpException (NotFound 404, BadRequest 400, Unauthorized 401, Forbidden 403) → статус + сообщение · обычный Error → 500, сообщение скрыто
## Ответы
GET /cars 200 · GET /cars/1 200 · GET /cars/99 404 · POST /cars 201 (сам) · /cars/abc → 404 «NaN» (проверки нет; @Param('id', ParseIntPipe) или DTO + ValidationPipe → 400)
## Язык урока ученика
официант=Controller · повар=Service · кладовщик=Repository · чертёж стеллажа=Entity · анкета=DTO · контролёр=Guard · штатное расписание=Module
## Три правила (на уроке)
пока сервер не работает у всех, дальше не идите · «повар, то есть Service» · если ошибка — читайте сообщение в терминале вместе, ответ не говорите
## Проверка кода от ИИ
4 вопроса: файлы (module · controller · service) · списки (providers, imports в AppModule, Mapped в терминале) · логика в Service · decorator
3 неожиданных запроса: id из букв (/customers/abc → 400, а не 404 «NaN») · пустой body ({} → 400, а не 201) · чужое поле ("id": 1 → id выдаёт сервер)
Порядок разворота: { ...data, id } — id в конце; { id, ...data } — id из body записывается поверх
TS1272 «must be imported with 'import type'» → тип в Controller импортируйте через import type
## Словарь
decorator — метка, начинается с @ · provider — то, что создаёт модуль (в основном Service) · instance — объект, созданный из класса · inject — Nest передаёт готовый объект в конструктор · path — адрес, route — path + метод · Mapped — строка подключённого route в терминале · pipe — проверяет или меняет входное значение (ParseIntPipe) · DTO — форма входных данных · HttpException — семейство ошибок со статусом · CLI — команды nest g
## Домашнее задание
модуль users в cars-api: nest g module/controller/service users · Service: список + findAll/findOne/create, если не найден — NotFoundException · Controller: GET /users · GET /users/:id · POST /users · один раз специально сломайте (пустой providers) и исправьте · push на GitHub → ссылку на репозиторий в домашнее задание на платформе`;

// --- F-1125-01: 6-bosqich · AI yozgan kod (06b-ai.jsx) ---
ru(S_AI, {
  kicker: 'Этап 6 · код от ИИ', title: 'Модуль customers от ИИ: два задания, два результата',
  segments: {
    a: { key: 'Мы поручили ИИ модуль <b>customers</b>: один и тот же ИИ, <b>два разных задания</b>', text: 'Сейчас большую часть кода пишет ИИ, ваша работа — его проверить. Мы поручили ИИ добавить в проект cars api модуль арендаторов, то есть customers. ИИ один, Claude Haiku, а задания два: слева простыми словами, справа на языке Nest. В обоих одно правило: если возраст меньше восемнадцати, не добавлять.', show: 'Сейчас большую часть кода пишет ИИ, ваша работа — его проверить. Мы поручили ИИ добавить в проект <code>cars-api</code> модуль арендаторов, то есть <b>customers</b>. ИИ один, Claude Haiku, а задания два: слева простыми словами, справа на языке Nest. В обоих одно правило: если возраст меньше 18, не добавлять.' },
    b: { key: 'Проверка 1 — <b>структура</b>: четыре вопроса, оба ИИ прошли', text: 'Первая проверка — структура, четыре вопроса сегодняшнего урока. Файлы: есть ли module, controller, service. Списки: Service в providers, модуль в imports у AppModule, появились ли в терминале три строки Mapped для customers. Логика: правило возраста в Service. Decorator на месте. Оба ИИ прошли все четыре вопроса.' },
    c: { key: 'Проверка 2 — <b>запросы</b>: на <code>/customers/abc</code> A вернул <b>404 «NaN»</b>', text: 'Вторая проверка — запросами. Список, клиент девяносто девять и клиент пятнадцати лет у обоих правильные. Но на запрос customers abc A вернул четыреста четыре и NaN: в нём нет ParseIntPipe, id взят через Number, ровно как на двадцать первом экране. У B ParseIntPipe есть, потому что его просили в задании.', show: 'Вторая проверка — запросами. Список, <code>/customers/99</code> и клиент 15 лет у обоих правильные. Но на <code>/customers/abc</code> A вернул <b>404</b> и «NaN»: в нём нет <code>ParseIntPipe</code>, id взят через <code>Number</code>, ровно как на 21-м экране. У B <code>ParseIntPipe</code> есть, потому что его просили в задании.' },
    d: { key: 'Неожиданные запросы: <b>пустой POST</b> и <b>id: 1</b> в body — у B оба прошли', text: 'Теперь два неожиданных запроса: пустой POST и id один внутри body. A остановил оба: на пустой POST четыреста, а id из body проигнорировал. B создал пустого клиента, и в списке появился второй id один. Теперь запрос customers один возвращает старого, а новый лежит в списке с повторным id.', show: 'Теперь два неожиданных запроса: пустой <code>POST {}</code> и <code>"id": 1</code> внутри body. A остановил оба: на пустой POST <b>400</b>, а id из body проигнорировал. B создал пустого клиента, и в списке появился <b>второй id: 1</b>. Теперь <code>/customers/1</code> возвращает старого, а новый лежит в списке с повторным id.' },
    e: { key: 'Вывод: каждый ИИ пропустил <b>то, чего не было в задании</b> — проверяйте <b>4 вопросами и 3 запросами</b>', text: 'Вывод. Каждый ИИ пропустил то, чего не было в задании: простое задание — ParseIntPipe, который нужен именно в Nest, задание на языке Nest — проверку входных данных. Это одна проверка, другой ИИ напишет иначе. Значит, читайте код от ИИ по четырём вопросам и отправляйте три неожиданных запроса: id из букв, пустой body и чужое поле.' },
  },
});
