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
//  PostgreSQL DARSLARI RASMI (F-1120-02, qonun M51) — PG-1 va PG-2 ga yig'iladi (dev/yig.sh).
//  Blog bazasi: users va posts jadvallari, tashqi kalit (posts.user_id → users.id), qoida belgilari,
//  JOIN chiziqlari, rad etilgan yozuv (✕) va pastda psql satri. Ma'lumot — manba/pg1-out dagi haqiqiy blog.
// ============================================================
const BLOG_USERS = [['1', 'ali'], ['2', 'vali'], ['3', 'sardor']];
const BLOG_POSTS = [['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']];
// join: 'inner' | 'left' · fk: tashqi kalit chizig'i yonadi · rules: qoida belgilari yonadi · hl: { users: [ustun], posts: [ustun] }
// bad: { t: 'posts'|'users', row: [...], why } — jadvalga kirmagan yozuv · del: users qatori (o'chirish rad etildi)
// empty: jadvallar faqat tuzilish (qatorsiz) · read: [prompt, html] · out: html (natija yoki ERROR) · outEr
function BlogDb({ join, fk, rules, hl = {}, bad, del, empty, read, out, outEr, tag, compact, max, users = BLOG_USERS, posts = BLOG_POSTS }) {
  const RH = 26, TY = 44, HY = TY + 30, BY = HY + 26; // jadval: sarlavha · ustun nomlari · qatorlar
  const U = { x: 20, w: 250, cols: [['id', 60], ['username', 190]] };
  const P = { x: 410, w: 330, cols: [['id', 50], ['user_id', 90], ['izoh', 190]] };
  const rowsU = empty ? [] : users, rowsP = empty ? [] : posts;
  const tblH = 30 + 26 + Math.max(rowsU.length, rowsP.length, 1) * RH + (bad ? RH + 8 : 0);
  const rdY = TY + tblH + 18;
  const H = compact ? rdY : rdY + (read ? 50 : 0) + (out ? 36 : 0) + 6;
  const colX = (tb, i) => tb.x + tb.cols.slice(0, i).reduce((a, c) => a + c[1], 0);
  const matched = (uid) => rowsP.some((r) => r[1] === uid);
  const uState = (i, r) => (del === r[0] ? 'del' : join === 'inner' && !matched(r[0]) ? 'dim' : join === 'left' && !matched(r[0]) ? 'left' : '');
  const cell = (tb, ci, ri, txt, extra = {}) => <div key={ci + '-' + ri} className="n1-abs" style={{ left: colX(tb, ci), top: BY + ri * RH, width: tb.cols[ci][1], height: RH, padding: '0 10px', display: 'flex', alignItems: 'center', font: `500 12.5px ${MONO}`, color: T.ink, borderTop: `1px solid ${T.line}`, whiteSpace: 'nowrap', overflow: 'hidden', ...extra }}>{txt}</div>;
  const head = (tb, name, color) => <>
    <div className="n1-abs" style={{ left: tb.x, top: TY, width: tb.w, height: tblH, border: `2px solid ${color}`, borderRadius: 12, background: T.paper }} />
    <div className="n1-abs" style={{ left: tb.x + 12, top: TY + 7, font: `700 14px ${MONO}`, color }}>{name}</div>
    {tb.cols.map(([c], i) => { const on = (hl[name] || []).includes(i); return <div key={c} className="n1-abs" style={{ left: colX(tb, i), top: HY, width: tb.cols[i][1], height: 26, padding: '0 10px', display: 'flex', alignItems: 'center', font: `700 11.5px ${MONO}`, color: on ? T.accent : T.ink2, background: on ? '#FFF0EB' : '#F6F7F9', borderTop: `1px solid ${T.line}`, transition: 'all .4s' }}>{c}</div>; })}
  </>;
  // tashqi kalit: ikki jadval orasida, ustun nomlari satrida — posts → users
  const jy = (ri) => BY + ri * RH + RH / 2;
  return <N1Fit w={760} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 4 }}>{tag}</span>}
    {head(U, 'users', '#336791')}
    {head(P, 'posts', '#336791')}
    {rules && <>
      <span className="n1-badge ok" style={{ left: U.x + 76, top: TY + 5, height: 20, fontSize: 10.5 }}>PK · NOT NULL · UNIQUE</span>
      <span className="n1-badge ok" style={{ left: P.x + 70, top: TY + 5, height: 20, fontSize: 10.5 }}>user_id REFERENCES users(id)</span>
    </>}
    {rowsU.map((r, i) => { const s = uState(i, r); return <React.Fragment key={'u' + i}>{r.map((c, ci) => cell(U, ci, i, c, { opacity: s === 'dim' ? 0.35 : 1, background: s === 'del' ? '#FEF2F2' : s === 'left' ? '#F5F3FF' : undefined, color: s === 'del' ? '#B91C1C' : T.ink }))}</React.Fragment>; })}
    {join === 'left' && rowsU.filter((r) => !matched(r[0])).map((r) => <span key={'n' + r[0]} className="n1-abs" style={{ left: U.x + U.w + 8, top: jy(rowsU.indexOf(r)) - 9, font: `600 11px ${MONO}`, color: T.purple }}>izoh: NULL</span>)}
    {del && <span className="n1-say er" style={{ left: U.x + U.w - 92, top: jy(rowsU.findIndex((r) => r[0] === del)) - 8 }}>✕ DELETE</span>}
    {rowsP.map((r, i) => <React.Fragment key={'p' + i}>{r.map((c, ci) => cell(P, ci, i, c, { color: ci === 1 && (fk || join) ? T.accent : T.ink, fontWeight: ci === 1 && (fk || join) ? 700 : 500 }))}</React.Fragment>)}
    {bad && <>
      {bad.row.map((c, ci) => cell(bad.t === 'users' ? U : P, ci, (bad.t === 'users' ? rowsU : rowsP).length, c, { top: BY + (bad.t === 'users' ? rowsU : rowsP).length * RH + 6, color: '#B91C1C', textDecoration: 'line-through', background: '#FEF2F2', borderTop: '1.5px dashed #F2A9A9' }))}
      <span className="n1-say er" style={{ left: (bad.t === 'users' ? U.x + U.w : P.x + P.w) - 150, top: TY + tblH + 2, fontSize: 11.5, background: T.paper, padding: '0 4px' }}>✕ {bad.why}</span>
    </>}
    <svg className="n1-svg" width="760" height={H} viewBox={`0 0 760 ${H}`}>
      {(fk || join) && <path d={`M${P.x - 2} ${HY + 13} L ${U.x + U.w + 4} ${HY + 13}`} fill="none" stroke={T.accent} strokeWidth="2" strokeDasharray={fk && !join ? '0' : '5 4'} markerEnd="url(#pgah)" />}
      <defs><marker id="pgah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.accent} /></marker></defs>
      {join && rowsP.map((r, i) => { const ui = rowsU.findIndex((u) => u[0] === r[1]); if (ui < 0) return null; return <path key={i} d={`M${P.x} ${jy(i)} C ${P.x - 60} ${jy(i)}, ${U.x + U.w + 60} ${jy(ui)}, ${U.x + U.w} ${jy(ui)}`} fill="none" stroke={T.purple} strokeWidth="1.6" opacity=".75" />; })}
    </svg>
    {(fk || join) && <span className="n1-abs" style={{ left: (U.x + U.w + P.x) / 2, top: TY - 13, transform: 'translate(-50%,-50%)', font: `600 11px ${MONO}`, color: T.accent, whiteSpace: 'nowrap', background: T.paper, padding: '0 4px' }}>{join ? 'ON users.id = posts.user_id' : 'posts.user_id → users.id'}</span>}
    {!compact && read && <div className="n1-ro" style={{ left: 20, top: rdY, width: 720, height: 44 }}><span className="rf">{read[0]}</span><code style={{ fontSize: read[1].replace(/<[^>]+>/g, '').length > 75 ? 11.5 : undefined }} dangerouslySetInnerHTML={html(read[1])} /></div>}
    {!compact && out && <div className="n1-abs" style={{ left: 20, top: rdY + (read ? 50 : 0), width: 720, height: 30, borderRadius: 8, padding: '0 14px', display: 'flex', alignItems: 'center', font: `600 12px ${MONO}`, whiteSpace: 'nowrap', overflow: 'hidden', background: outEr ? '#FEF2F2' : '#E3F5EC', color: outEr ? '#B91C1C' : T.green }} dangerouslySetInnerHTML={html(out)} />}
  </N1Fit>;
}

// ============================================================
//  PG-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg2-matn.py (manba: 08-PostgreSQL2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · PostgreSQL",
  "title": "Jadval tayyor. Endi uni boshqaramiz — PostgreSQL terminalida va Express ichida",
  "seg": [
   [
    "a",
    "PostgreSQL-1 da jadval yaratdingiz — bugun undagi ma'lumotni <b>to'rt buyruq bilan boshqarasiz</b>",
    "Assalomu alaykum. Oldingi darsda PostgreSQL'ni o'rnatdingiz, jadval yaratdingiz va bog'ladingiz. Bugun jadvaldagi ma'lumotni boshqaramiz: qo'shish, ko'rish, o'zgartirish va o'chirish. Buni CRUD deyishadi, uning nimaligini keyingi ekranda aniq ko'ramiz."
   ],
   [
    "b",
    "Avval buyruqlar terminalda — va har birining <b>ichida nima bo'lishi</b>: son, tartib, tranzaksiya",
    "Avval buyruqlarni terminalda qo'lda yozamiz va har birining ichida nima bo'lishini ko'ramiz: javobdagi son nimani sanaydi, nega qatorlar tartibi o'zgaradi, tranzaksiya ichida baza nima qiladi. Misolimiz kichik do'kon: klaviatura, sichqoncha, quloqchin, kolonka."
   ],
   [
    "c",
    "Keyin o'sha so'rovlar Express ichida: <b><code>Pool</code> nima, nega <code>$1</code></b>, server nega 500 beradi",
    "Keyin xuddi shu so'rovlarni Express serveri ichiga qo'yamiz. Pool nimaligini, nega qiymatlar dollar bir bilan berilishini, server qachon va nega besh yuz qaytarishini o'zingiz sinab ko'rasiz. Serverni ataylab buzamiz va tuzatamiz. Keyin AI yozgan SQL'ni bazada tekshiramiz."
   ],
   [
    "d",
    "Yetti bosqich, to'rt amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>. Shoshilmang",
    "Dars yetti bosqichdan iborat, orasida to'rtta amaliyot bor. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darslari xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "CRUD — ma'lumot bilan qilinadigan to'rt amal: bazada buyruq, serverda endpoint",
  "seg": [
   [
    "a",
    "CRUD — to'rtta inglizcha so'zning <b>bosh harfi</b>: yaratish, o'qish, o'zgartirish, o'chirish",
    "Bugungi darsning poydevori bitta so'z: CRUD. Bu to'rtta inglizcha so'zning bosh harfi: Create, Read, Update va Delete, ya'ni yaratish, o'qish, o'zgartirish va o'chirish. Har qanday ilova ma'lumot bilan aynan shu to'rt ishni qiladi: onlayn do'kon ham, Telegram ham."
   ],
   [
    "b",
    "PostgreSQL'da har amalning <b>o'z buyrug'i bor</b>: <code>INSERT</code>, <code>SELECT</code>, <code>UPDATE</code>, <code>DELETE</code>",
    "PostgreSQL'da har amalning o'z buyrug'i bor: insert, select, update va delete. Siz bilgan Mongoose'da bular create, find, updateOne va deleteOne edi. Ma'nosi bir xil, faqat yozilishi boshqa. Har buyruqdan keyin baza qisqa javob qaytaradi, masalan update bir. Mongo'da uning o'rnida matchedCount bir chiqardi."
   ],
   [
    "c",
    "Serverda xuddi shu to'rt amal <b>endpoint bo'ladi</b>: <code>POST</code>, <code>GET</code>, <code>PUT</code>, <code>DELETE</code>",
    "Serverda xuddi shu to'rt amal endpoint bo'ladi. Yaratish POST, o'qish GET, o'zgartirish PUT, o'chirish DELETE. Har endpoint ichida o'sha SQL buyrug'i turadi. Javobda status chiqadi: yaratilganda ikki yuz bir, qolganlarida ikki yuz."
   ],
   [
    "d",
    "Xulosa: har amalning bazada <b>bitta buyrug'i</b>, serverda bitta endpoint'i bor",
    "Xulosa: CRUD to'rtta amal. Har amalning PostgreSQL'da bitta buyrug'i va serverda bitta endpoint'i bor. Bugun avval buyruqlarni terminalda qo'lda yozamiz va ichini ko'ramiz, keyin xuddi shularni Express serveri ichiga qo'yamiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "products — to'rt ustun, to'rt mahsulot; id ni baza o'zi beradi",
  "seg": [
   [
    "a",
    "Mongo'da baza va kolleksiya o'zi paydo bo'lardi — bu yerda <b>avval <code>CREATE DATABASE</code>, keyin jadval</b>",
    "Siz bilgan Mongoose'da connect yetardi: baza ham, kolleksiya ham birinchi create'da o'zi paydo bo'lardi. PostgreSQL'da avval create database bilan baza, keyin create table bilan jadval yaratiladi. Jadval products, to'rt ustun: id o'zi o'sadi, name matn, price va stock butun son. Hozircha ustunlarda qoida yo'q, bu ataylab."
   ],
   [
    "b",
    "Bitta <code>INSERT</code> bilan to'rt qator; javob <code>INSERT 0 4</code> — <b>oxirgi raqam qo'shilgan qatorlar soni</b>",
    "Bitta insert bilan to'rtta mahsulot qo'shamiz. Baza javobi insert, nol, to'rt. Oxirgi raqam nechta qator qo'shilganini aytadi. O'rtadagi nol eski versiyalardan qolgan, u hech narsani bildirmaydi, unga qaramang."
   ],
   [
    "c",
    "<code>SELECT *</code> — hamma ustun; <code>id</code> larni biz yozmadik, <b>baza o'zi berdi</b>: <code>SERIAL</code>",
    "Select yulduzcha hamma ustunni ko'rsatadi. id ustunini biz yozmadik, baza o'zi bir, ikki, uch, to'rt deb berdi. Buni serial qiladi: ichida alohida hisoblagich bor, har yangi qatorga keyingi sonni beradi. Qator o'chirilsa ham hisoblagich orqaga qaytmaydi."
   ],
   [
    "d",
    "Xulosa: jadval tayyor — <b>hech qanday qoidasiz</b>; baza faqat yozilgan qoidani qo'riqlaydi",
    "Xulosa: bazangizda to'rt mahsulotli do'kon bor. Bitta narsani eslab qoling: bu jadvalda hozircha not null ham, boshqa qoida ham yo'q. Baza faqat yozilgan qoidani qo'riqlaydi. Nima bo'lishini uchinchi bosqichda o'z ko'zingiz bilan ko'rasiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "WHERE — minglab qatordan faqat keraklisi",
  "seg": [
   [
    "a",
    "Hamma ustun kerak bo'lmasa — <code>SELECT</code>dan keyin <b>faqat kerakli ustunlar</b> yoziladi",
    "Jadval bor, endi undan o'qiymiz. Hamma ustun kerak bo'lmasa, select'dan keyin faqat keraklisini yozasiz: nom va narx. Ma'lumot o'zgarmaydi, select faqat ko'rsatadi."
   ],
   [
    "b",
    "<code>WHERE price &lt; 100000</code> — yuz mingdan arzonlari: <b>uchta mahsulot</b>",
    "Minglab mahsulotdan faqat keraklisini olish uchun where yoziladi. Narxi yuz mingdan kam bo'lganlarini so'raymiz: sichqoncha, quloqchin va kolonka, uchta qator. Where har qatorni shartga solishtiradi va faqat to'g'ri chiqqanlarini qaytaradi. Mongoose'da bu find ichidagi dollar lt shart edi."
   ],
   [
    "c",
    "<code>WHERE stock &lt; 6</code> — tugayotgan mahsulot: <b>faqat quloqchin</b>",
    "Ikkinchi filtr qoldig'i oltidan kam, ya'ni tugayotgan mahsulotlarni topadi. Natijada faqat quloqchin chiqdi, undan beshta qolgan. Do'kon menejeri aynan shu so'rov bilan nimani buyurtma qilishni biladi."
   ],
   [
    "d",
    "Xulosa: <code>SELECT</code> faqat o'qiydi; <b><code>WHERE</code> qatorlarni tanlaydi</b> — <code>UPDATE</code> va <code>DELETE</code>da ham aynan shu",
    "Xulosa: select hech narsani o'zgartirmaydi, faqat o'qiydi. Where qaysi qatorlar kerakligini aytadi. Keyingi ekranda update va delete'ni ko'rasiz: ularda ham aynan shu where ishlaydi, faqat endi u qaysi qatorlar o'zgarishini hal qiladi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "UPDATE 1, DELETE 1, UPDATE 0 — javobdagi son nechta qator tegilganini aytadi",
  "seg": [
   [
    "a",
    "Klaviatura arzonladi: <code>UPDATE … WHERE id = 1</code> — javob <b><code>UPDATE 1</code></b>, bitta qator",
    "Klaviatura narxi to'qson to'qqiz mingga tushdi. Buyruq: update products set price, where id bir. Baza javobi update bir: bitta qator o'zgardi. Javobdagi son doim nechta qator tegilganini aytadi, bu update'da ham, delete'da ham shunday."
   ],
   [
    "b",
    "Quloqchin sotuvdan chiqdi: <code>DELETE … WHERE id = 3</code> — <b><code>DELETE 1</code></b>",
    "Quloqchin sotuvdan chiqdi, uni o'chiramiz: delete from products, where id uch. Baza javobi delete bir. Qator butunlay ketdi, uning id'si esa qayta ishlatilmaydi."
   ],
   [
    "c",
    "Bunday <code>id</code> yo'q bo'lsa — <b>xato emas</b>, <code>UPDATE 0</code> va <code>DELETE 0</code>",
    "To'qson to'qqizinchi mahsulotni o'zgartirib ko'ramiz. Xato chiqmaydi, javob update nol. Delete ham nol qaytaradi. Baza «bunday qator yo'q» demaydi: where hech qaysi qatorga mos kelmadi, shuning uchun hech narsaga tegmadi. Mongo'dagi matchedCount nol ham xuddi shu. Bu xato emas, bu javob."
   ],
   [
    "d",
    "<code>RETURNING</code> — baza o'zgargan <b>qatorning o'zini qaytaradi</b>; mos qator bo'lmasa <code>(0 rows)</code>",
    "Bitta klaviatura sotildi: qoldiqni bittaga kamaytiramiz. Yangi qoldiq nechta bo'lganini siz hisoblamaysiz, buyruq oxiriga returning yozasiz va baza o'zgargan qatorni qaytaradi: klaviatura, yetti. To'qson to'qqizinchi id bilan returning nol qator beradi. Serverda aynan shu returning ishlatiladi."
   ],
   [
    "e",
    "Xulosa: har <code>UPDATE</code> va <code>DELETE</code>dan keyin <b>javobdagi sonni o'qing</b>",
    "Xulosa: update va delete'dan keyin javobdagi sonni o'qing. Bir bo'lsa, kutganingiz bo'ldi. Nol bo'lsa, where hech narsaga mos kelmadi. Kutilmagan katta son bo'lsa, where noto'g'ri yoki umuman yozilmagan. Buni ikkinchi bosqichda xavfsiz ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "1-bosqich · ichida nima bo'ladi",
  "title": "UPDATEdan keyin qator joyi o'zgardi — baza yangilangan qatorni yangi joyga yozadi",
  "seg": [
   [
    "a",
    "<code>SELECT *</code> — Klaviatura <b>ro'yxat oxiriga tushdi</b>. Bu xato emas, lekin sababini bilish kerak",
    "Oldingi ekrandagi buyruqlardan keyin select qilamiz va natijaga qarang: uchta mahsulot qoldi, klaviatura esa birinchi emas, oxirida turibdi. Bu xato emas. Lekin «tasodif» deb qo'ya qolmaymiz: nega shunday bo'lganini bilish kerak, chunki bu savol albatta beriladi."
   ],
   [
    "b",
    "Sabab: PostgreSQL yangilangan qatorni <b>joyida o'zgartirmaydi</b> — yangi nusxasini bo'sh joyga yozadi",
    "Sabab bazaning ichida. PostgreSQL update'da qatorni joyida o'zgartirmaydi: eski nusxani «eskirgan» deb belgilaydi, yangisini fayldagi bo'sh joyga, bu yerda oxiriga yozadi. Eski nusxa keyinroq tozalanadi. Select yulduzcha esa qatorlarni fayldagi tartibda o'qiydi."
   ],
   [
    "c",
    "Isbot: <code>ctid</code> — qatorning fayldagi manzili; Klaviatura endi <code>(0,6)</code>: <b>ikki o'zgarish — ikki yangi nusxa</b>",
    "Buni ko'rsa bo'ladi. Har qatorning ctid degan yashirin ustuni bor: bu uning fayldagi manzili, sahifa va o'rin. Select ctid qilsak, klaviatura nol vergul olti, ya'ni oltinchi o'rinda. Klaviatura ikki marta o'zgardi: avval narxi, keyin qoldig'i. Har safar baza yangi nusxa yozdi: beshinchi, keyin oltinchi o'rinda. Shuning uchun u oxirida chiqdi."
   ],
   [
    "d",
    "Xulosa: tartib kerak bo'lsa — <b><code>ORDER BY id</code></b>; usiz tartib hech qachon kafolatlanmaydi",
    "Xulosa: order by yozilmasa, baza qatorlarni fayldagi tartibda beradi, bu tartib esa har update'dan keyin o'zgarishi mumkin. Tartib kerak bo'lsa, oxiriga order by id yoziladi, shunda klaviatura yana birinchi. «Mahsulot o'rni o'zgardi» degan savolning javobi shu: order by yo'q edi."
   ]
  ]
 },
 "7": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 5",
  "title": "Buyruq xatosiz o'tdi, javob UPDATE 0. Bu nimani bildiradi?",
  "q": "Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ekrandagi terminalda to'qson to'qqizinchi mahsulot narxi o'zgartirilmoqchi bo'ldi. Xato yo'q, javob: update nol. Bu nimani bildiradi? Variantni tanlang.",
  "ok": "To'g'ri. Where id to'qson to'qqiz hech qanday qatorga mos kelmadi, shuning uchun nol qator o'zgardi. Baza buni xato deb hisoblamaydi. Ishonch hosil qilish uchun select bilan bunday id bor-yo'qligini tekshiring, ekranda shu select turibdi. Demak, update nol xato emas: where hech qaysi qatorga mos kelmaganini bildiradi.",
  "okShort": "<code>UPDATE 0</code> — <code>WHERE</code> hech bir qatorga mos kelmadi. Xato emas: <code>SELECT … WHERE id = 99</code> ham bo'sh qaytaradi.",
  "hint": "Javobdagi son nimani sanaydi? WHERE qaysi qatorni topishi kerak edi?",
  "demak": "<code>UPDATE 0</code> xato emas: <code>WHERE</code> hech qaysi qatorga mos kelmaganini bildiradi.",
  "correct": 0,
  "opts": [
   "id = 99 yo'q — WHERE hech qatorga mos kelmadi",
   "Narxni o'zgartirishga foydalanuvchida ruxsat yo'q",
   "Jadval bo'shab qoldi — qator o'chirildi",
   "Narx o'zgardi, lekin hali COMMIT bo'lmadi"
  ],
  "wrong": {
   "1": "Ruxsat yo'q bo'lsa ERROR:  permission denied for table products chiqardi; bu yerda xato yo'q.",
   "2": "Jadval joyida: UPDATE 0 hech narsani o'chirmaydi.",
   "3": "Tranzaksiyasiz UPDATE darhol saqlanadi; son esa nechta qator tegilganini aytadi."
  }
 },
 "8": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "shop bazasi va CRUD — to'rt buyruq, har javobdagi son",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z bazangizda</b> jadval, to'rt mahsulot, ikki filtr, narx va o'chirish",
    "Endi navbat sizga. O'z bazangizda shu ishlarni qilasiz: jadval yaratasiz, to'rt mahsulot qo'shasiz, ikki filtr yozasiz, keyin narxni o'zgartirib, bitta mahsulotni o'chirasiz. Bunga o'n-o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–3-qadam: baza, jadval, mahsulotlar va <b>ikki filtr</b>",
    "Birinchi qadamda shop bazasi va products jadvalini yaratasiz. Ikkinchisida to'rtta mahsulotni bitta insert bilan qo'shasiz va javobdagi to'rtni ko'rasiz. Uchinchisida ikkita filtr yozasiz: arzonlarini va tugayotganlarini. Har buyruqdan keyin javob satrini o'qing."
   ],
   [
    "c",
    "4-qadam: narx va o'chirish; isbot — <b>oxirgi <code>SELECT</code>dagi qatorlar soni</b>",
    "To'rtinchi qadamda klaviatura narxini o'zgartiring, quloqchinni o'chiring va select yulduzcha qiling. Klaviatura qayerda turganiga e'tibor bering. Isbot maydoniga oxirgi select natijasi ostidagi qatorlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz CRUD'ning to'rt buyrug'ini o'z bazangizda yozgan va har javobdagi sonni o'qigan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Baza va jadval",
    "cmds": [
     "psql -U postgres",
     "CREATE DATABASE shop;",
     "\\c shop",
     "CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);"
    ],
    "exp": "CREATE DATABASE · CREATE TABLE"
   },
   {
    "t": "Mahsulotlar",
    "cmds": [
     "INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);"
    ],
    "exp": "INSERT 0 4"
   },
   {
    "t": "Filtrlar",
    "cmds": [
     "SELECT * FROM products WHERE price < 100000;",
     "SELECT * FROM products WHERE stock < 6;"
    ],
    "exp": "3 qator · 1 qator (Quloqchin)"
   },
   {
    "t": "Narx va o'chirish",
    "cmds": [
     "UPDATE products SET price = 99000 WHERE id = 1;",
     "DELETE FROM products WHERE id = 3;",
     "SELECT * FROM products;"
    ],
    "exp": "UPDATE 1 · DELETE 1 · (3 rows), Klaviatura oxirida"
   }
  ],
  "proof": {
   "label": "Oxirgi SELECT * natijasidagi qatorlar soni",
   "placeholder": "natija ostidagi sonni yozing",
   "re": "^\\s*\\(?\\s*3\\b",
   "flags": "",
   "wrong": "To'rt mahsulotdan bittasi o'chirilgach nechta qoladi? Natija ostidagi qavsdagi sonni yozing."
  },
  "trouble": [
   [
    "ERROR:  database \"shop\" already exists",
    "baza oldin yaratilgan — \\c shop"
   ],
   [
    "ERROR:  relation \"products\" does not exist",
    "boshqa bazadasiz (prompt postgres=#) — \\c shop"
   ],
   [
    "INSERT 0 4 ikki marta",
    "mahsulotlar ikki marta qo'shilgan — id lar 1–8; 4-qadamda idni SELECT bo'yicha tanlang"
   ],
   [
    "UPDATE 0 / DELETE 0",
    "bunday id yo'q — avval SELECT * bilan idni ko'ring"
   ],
   [
    "Klaviatura oxirida",
    "xato emas — 6-ekran: ORDER BY id bilan tartiblang"
   ],
   [
    "ERROR:  syntax error at or near \"…\"",
    "^ ko'rsatgan joydan oldin vergul, qavs yoki tirnoq tushib qolgan"
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "2-bosqich · tranzaksiya",
  "title": "WHERE unutilsa — UPDATE 3, DELETE 3. Xavfsiz sinash: BEGIN … ROLLBACK",
  "seg": [
   [
    "a",
    "<code>WHERE</code>'siz <code>UPDATE</code> yoki <code>DELETE</code> — <b>hamma qator</b>. Buni ko'rish kerak, lekin bazani buzmasdan",
    "Javobdagi son kutilmagan katta bo'lsa, where yo'q edi, degandim. Buni o'z ko'zingiz bilan ko'rishingiz kerak, lekin bazani buzmasdan. Usul: avval begin, ya'ni tranzaksiya ochamiz. Undan keyingi hamma narsa vaqtincha bo'ladi."
   ],
   [
    "b",
    "<code>WHERE</code>'siz <code>UPDATE</code> — <code>UPDATE 3</code>: <b>hamma mahsulot to'qson to'qqiz ming</b>",
    "Begin'dan keyin where'siz update. Baza javobi update uch. Select qilsak, hamma mahsulot to'qson to'qqiz ming so'm: sichqoncha ham, kolonka ham. Bitta unutilgan where butun narx ro'yxatini buzdi. Mongo'dan kelganlar aynan shu yerda xato qiladi: u yerda updateOne bitta hujjatga tegardi, bu yerda where yo'q bo'lsa hamma qator o'zgaradi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz <code>DELETE</code> — <code>DELETE 3</code>, <b>jadval bo'sh</b>",
    "Undan ham yomoni where'siz delete. Baza javobi delete uch, select esa nol qator qaytaradi. Haqiqiy do'konda bu butun katalog yo'qolgani. Lekin biz tranzaksiya ichidamiz."
   ],
   [
    "d",
    "<code>ROLLBACK</code> — hammasi joyida: <b>tranzaksiya ichidagi o'zgarish bekor bo'ldi</b>",
    "Endi rollback yozamiz va select qilamiz: uchala mahsulot joyida, narxlari ham eski. Tranzaksiya ichida qilingan hamma narsa bekor bo'ldi. PostgreSQL-1 da tranzaksiya do'konni himoya qilgan edi, bu yerda u sizning sinov maydoningiz."
   ],
   [
    "e",
    "Xulosa: xavfli <code>UPDATE</code>/<code>DELETE</code>ni avval <b><code>BEGIN</code> ichida sinang</b>, <code>SELECT</code> bilan ko'ring",
    "Xulosa: xavfli update yoki delete'ni avval begin ichida yurgizing, select bilan natijani ko'ring. To'g'ri bo'lsa commit, noto'g'ri bo'lsa rollback. Bu bitta qator, lekin butun jadvalni saqlab qoladi. Keyingi ekranda tranzaksiya ichida baza aslida nima qilishini ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida nima bo'ladi",
  "title": "Har buyruq o'zi saqlanadi; BEGINdan keyin — faqat sizning seansingizda, COMMITgacha",
  "seg": [
   [
    "a",
    "Oddiy holatda PostgreSQL <b>autocommit</b>da: har buyruq bajarilishi bilan saqlanadi",
    "Oddiy holatda PostgreSQL autocommit rejimida ishlaydi: har buyruq bajarilishi bilan darhol saqlanadi, uni qaytarib bo'lmaydi. Birinchi bosqichdagi update va delete'lar aynan shunday saqlandi. Shuning uchun where'siz delete haqiqiy bazada halokat."
   ],
   [
    "b",
    "<code>BEGIN</code>dan keyin prompt <code>shop=*#</code> — <b>yulduzcha: tranzaksiya ochiq</b>, o'zgarish faqat sizga ko'rinadi",
    "Begin yozganingizda prompt o'zgaradi: teng, yulduzcha, panjara. Yulduzcha tranzaksiya ochiqligini bildiradi. Endi o'zgarishlar faqat sizning seansingizda ko'rinadi. Sinab ko'rdik: A seansida klaviaturaga chegirma qildik, sakson to'qqiz ming. B seansi hali to'qson to'qqiz mingni ko'radi. Commit'dan keyingina B yangi narxni ko'rdi."
   ],
   [
    "c",
    "Tranzaksiya ichida xato chiqsa — prompt <code>shop=!#</code>: <b>aborted</b>, keyingi buyruqlar rad etiladi",
    "Tranzaksiya ichida biror buyruq xato bersa, prompt undov belgisiga o'zgaradi va baza «current transaction is aborted» deydi: keyingi buyruqlar bajarilmaydi, hatto oddiy select ham. Bu holatdan faqat rollback chiqaradi. Commit yozsangiz ham baza rollback qiladi, javobida shunday yozadi."
   ],
   [
    "d",
    "Xulosa: <code>BEGIN</code> — vaqtincha, <code>COMMIT</code> — saqla, <code>ROLLBACK</code> — bekor; <b><code>!#</code> ko'rsangiz — <code>ROLLBACK</code></b>",
    "Xulosa: begin'dan keyin hamma narsa vaqtincha va faqat sizga ko'rinadi, commit saqlaydi, rollback bekor qiladi. Promptdagi yulduzcha tranzaksiya ochiqligini, undov belgisi xato bo'lganini aytadi. Undov belgisini ko'rsangiz, boshqa buyruq yozmang: rollback."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida nima bo'ladi",
  "title": "Sotuv — ikki buyruq: qoldiqni kamaytirish va buyurtma yozish. Yo ikkalasi, yo hech biri",
  "seg": [
   [
    "a",
    "Do'konga qoida va ikkinchi jadval: <b><code>CHECK (stock &gt;= 0)</code></b> va <code>orders</code> — buyurtmalar",
    "Tranzaksiya faqat sinov uchun emas. Do'konga qoida qo'shamiz: qoldiq manfiy bo'lmasin, check stock katta yoki teng nol. Va ikkinchi jadval: orders, buyurtmalar: qaysi mahsulot, nechta va qachon. Created at ustuniga default now yozdik, vaqtni baza o'zi qo'yadi."
   ],
   [
    "b",
    "Bitta sotuv — ikki buyruq: <code>UPDATE</code> qoldiqni kamaytiradi, <code>INSERT</code> buyurtma yozadi — <b><code>BEGIN … COMMIT</code> ichida</b>",
    "Bitta sichqoncha sotildi. Bu ikki buyruq: qoldiqni bittaga kamaytirish va buyurtma yozish. Ikkalasi begin va commit orasida. Returning qoldiq o'n to'rt bo'lganini, buyurtma esa bir raqam va vaqt bilan yozilganini ko'rsatdi. Commit'dan keyin ikkalasi ham saqlandi."
   ],
   [
    "c",
    "O'n ikki kolonka so'raldi, bor-yo'g'i o'nta: <b><code>CHECK</code> rad etdi</b>, tranzaksiya aborted — <code>ROLLBACK</code>",
    "Endi o'n ikkita kolonka so'raldi, omborda o'nta. Buyurtma yozildi, keyin update qoldiqni minus ikki qilmoqchi bo'ldi. Check rad etdi: new row violates check constraint stock nonneg. Tranzaksiya aborted. Rollback qilamiz: buyurtma ham yo'qoldi, qoldiq ham o'nta. Yolg'on buyurtma qolmadi."
   ],
   [
    "d",
    "Xulosa: bir ishga tegishli buyruqlar <b>bitta tranzaksiyada</b>; qoida bazada bo'lsa, yarim ish qolmaydi",
    "Xulosa: bir ishga tegishli buyruqlar bitta tranzaksiyada bo'ladi: yo hammasi saqlanadi, yo hech biri. Buni atomik deyishadi. Qoida bazaning o'zida bo'lsa, kod xato qilsa ham yarim ish qolmaydi. PostgreSQL-1 dagi «oxirgi telefon» masalasining javobi aynan shu: tranzaksiya va qoida."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 5",
  "title": "BEGIN; → DELETE FROM products; (DELETE 3) → ROLLBACK;. Endi SELECT * FROM products; nima qaytaradi?",
  "q": "Tranzaksiya ichini ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Ekranda: begin, where'siz delete, javob delete uch, keyin rollback. Endi select qilsak, jadvalda nima bor? Variantni tanlang.",
  "ok": "To'g'ri. Delete tranzaksiya ichida edi, rollback uni bekor qildi. Uchala mahsulot joyida, ekranda select shuni ko'rsatdi. Commit yozilmaguncha hech qanday o'zgarish saqlanmaydi. Demak, begin va rollback xavfli buyruqni bazani buzmasdan sinash imkonini beradi.",
  "okShort": "<code>ROLLBACK</code> — tranzaksiya ichidagi hamma o'zgarish bekor: uch qator joyida.",
  "hint": "ROLLBACK tranzaksiya ichidagi o'zgarishlar bilan nima qiladi?",
  "demak": "<code>COMMIT</code> yozilmaguncha tranzaksiya ichidagi o'zgarish saqlanmaydi; <code>ROLLBACK</code> hammasini bekor qiladi.",
  "correct": 2,
  "opts": [
   "Nol qator — DELETE 3 allaqachon bajarilgan",
   "Faqat bitta qator — oxirgisi qaytib keladi",
   "Uchalasi — ROLLBACK o'chirishni bekor qildi",
   "ERROR — o'chirilgan jadvaldan o'qib bo'lmaydi"
  ],
  "wrong": {
   "0": "DELETE 3 tranzaksiya ichida edi va COMMIT qilinmadi.",
   "1": "ROLLBACK bitta qatorni emas, butun tranzaksiyani bekor qiladi.",
   "3": "DELETE qatorlarni o'chiradi, jadvalni emas; jadval doim joyida."
  }
 },
 "13": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 5–10 daqiqa",
  "title": "WHERE'siz UPDATEni xavfsiz sinang — promptdagi yulduzchani kuzating",
  "seg": [
   [
    "a",
    "Endi siz: <code>WHERE</code>'siz <code>UPDATE</code>ni o'z bazangizda, lekin <b>tranzaksiya ichida</b> qilasiz",
    "Endi o'zingiz: where'siz update'ni o'z bazangizda qilasiz, lekin tranzaksiya ichida. Bunga besh-o'n daqiqa ketadi. Bundan keyin har xavfli buyruqni shu usulda sinaysiz."
   ],
   [
    "b",
    "1–2-qadam: <code>BEGIN</code> (prompt <code>shop=*#</code>), <code>WHERE</code>'siz <code>UPDATE</code> va <code>SELECT</code> — <b>hamma narx bir xil</b>",
    "Birinchi qadamda begin yozasiz va promptda yulduzcha paydo bo'lganini ko'rasiz. Ikkinchisida where'siz update qilib, select bilan hamma narx bir xil bo'lganini ko'rasiz. Commit yozmang."
   ],
   [
    "c",
    "3–4-qadam: <code>ROLLBACK</code> va <code>SELECT</code>; isbot — <b>klaviaturaning narxi</b>",
    "Uchinchi qadamda rollback yozasiz, prompt oddiy holatga qaytadi. To'rtinchisida yana select qilasiz. Isbot maydoniga klaviaturaning hozirgi narxini yozing, rollback'dan keyingisini."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz where'siz update qanday xavfli ekanini ko'rdingiz va rollback bilan hammasini qaytarishni o'rgandingiz."
   ]
  ],
  "steps": [
   {
    "t": "Tranzaksiya",
    "cmds": [
     "BEGIN;"
    ],
    "exp": "BEGIN · prompt shop=*#"
   },
   {
    "t": "WHERE'siz",
    "cmds": [
     "UPDATE products SET price = 1;",
     "SELECT * FROM products;"
    ],
    "exp": "UPDATE 3 · hamma narx 1"
   },
   {
    "t": "Bekor",
    "cmds": [
     "ROLLBACK;"
    ],
    "exp": "ROLLBACK · prompt shop=#"
   },
   {
    "t": "Tekshirish",
    "cmds": [
     "SELECT * FROM products;"
    ],
    "exp": "narxlar eski"
   }
  ],
  "proof": {
   "label": "ROLLBACKdan keyingi Klaviatura narxi",
   "placeholder": "klaviatura narxini yozing",
   "re": "^\\s*99\\s?000\\s*$",
   "flags": "",
   "wrong": "ROLLBACKdan keyin narx 1-amaliyotdagidek bo'ladi. SELECT natijasidan Klaviatura qatorini o'qing."
  },
  "trouble": [
   [
    "WARNING:  there is no transaction in progress (ROLLBACK'da)",
    "BEGIN yozilmagan — o'zgarish allaqachon saqlangan; narxlarni 1-amaliyotdagi UPDATElar bilan tiklang"
   ],
   [
    "narx 120000",
    "1-amaliyotning 4-qadami (99 000) bajarilmagan — 1-amaliyotni tugating"
   ],
   [
    "prompt shop=!#",
    "tranzaksiya ichida xato bo'ldi — ROLLBACK; yozing (10-ekran)"
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "3-bosqich · baza qo'riqlaydi",
  "title": "Nomsiz mahsulot xato bermay saqlandi — qoidani o'zimiz qo'shamiz, baza rad eta boshlaydi",
  "seg": [
   [
    "a",
    "Nomsiz <code>INSERT</code> — <code>INSERT 0 1</code>, <b>xato yo'q</b>: jadvalda <code>NOT NULL</code> yo'q edi",
    "Uchinchi bosqich: baza qanday qo'riqlaydi. Nomsiz mahsulot qo'shamiz: faqat narx va qoldiq. Xato chiqmadi, insert nol bir. Where name is null bilan qidirsak, beshinchi qator: nomi bo'sh. Baza faqat yozilgan qoidani qo'riqlaydi, biz esa qoida yozmagan edik."
   ],
   [
    "b",
    "<code>NOT NULL</code> qo'shmoqchimiz — baza rad etdi: <b>ustunda bo'sh qiymat bor</b>. Avval tozalaymiz, keyin qoida",
    "Endi qoida qo'shamiz: alter table, name set not null. Baza rad etdi: column name contains null values. Mantiqli: bo'sh nom bor ekan, qoidani qo'yib bo'lmaydi. Nomsiz qatorni o'chiramiz va qoidani qayta qo'shamiz. Endi nomsiz insert xato beradi: violates not-null constraint."
   ],
   [
    "c",
    "<code>DEFAULT 0</code> — berilmagan qoldiq nol bo'ladi; <b><code>UNIQUE</code></b> — ikkinchi «Kolonka» rad etiladi",
    "Yana ikki qoida. Default: stock berilmasa nol bo'lsin, planshet nol qoldiq bilan saqlandi. Unique: nom takrorlanmasin. Ikkinchi kolonka qo'shmoqchi bo'lsak, baza duplicate key value deydi va qaysi qiymat takrorlanganini aytadi."
   ],
   [
    "d",
    "Xulosa: <code>\\d products</code> — hamma qoida bir joyda; <b>qoida bazada bo'lsa</b>, xatoni kod emas, baza ushlaydi",
    "Xulosa: backslash d products jadvalning hamma qoidasini ko'rsatadi: not null, default, unique, check va tashqi kalit. Qoida bazada bo'lsa, xatoni kod emas, baza ushlaydi, va har xabar ichida qoidaning nomi turadi. Keyingi ekranda shu xabarlarni o'qishni mashq qilamiz."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "3-bosqich · baza qo'riqlaydi",
  "title": "Beshta xato — har birida xabarning o'zi nimani tuzatishni aytadi",
  "seg": [
   [
    "a",
    "<code>relation \"product\" does not exist</code> — jadval nomi: <b>bitta <code>s</code> yetmaydi</b>",
    "Endi eng ko'p uchraydigan xatolar. Birinchisi jadval nomida: products o'rniga product yozilgan. Baza relation product does not exist deydi. Relation — bazaning jadvalga beradigan nomi. Jadval bor, faqat nomi bitta harfga farq qiladi."
   ],
   [
    "b",
    "<code>column \"narx\" does not exist</code> — ustun nomi; <code>HINT</code> esa <b>noto'g'ri ustunni taklif qiladi</b>",
    "Ikkinchisi ustun nomida: narx deb yozilgan. Baza column narx does not exist deydi, ostida hint: perhaps you meant name. Diqqat: hint taxmin qiladi va bu yerda adashgan, kerakli ustun price. Hint'ga emas, backslash d ga ishoning."
   ],
   [
    "c",
    "Son o'rniga matn va tushib qolgan qiymat — <code>invalid input syntax</code>, <b><code>more target columns</code></b>",
    "Uchinchisi: narx ustuniga arzon degan so'z yozilgan, baza invalid input syntax for type integer deydi. To'rtinchisi: uchta ustun yozilgan, qiymat esa ikkita, baza insert has more target columns than expressions deydi. Ikkalasida ham strelka xato joyni ko'rsatadi."
   ],
   [
    "d",
    "O'zbekcha apostrof satrni yopadi: <code>syntax error at or near \"yinchoq\"</code> — <b>ikki marta yoziladi</b>",
    "Beshinchisi, o'zbekcha matnda eng ko'p uchraydigani: apostrof. O'yinchoq so'zidagi apostrof matnni erta yopib qo'yadi, baza yinchoq so'zida adashadi. Tuzatish: so'z ichidagi apostrof ikki marta yoziladi, saqlanganda bitta bo'ladi."
   ],
   [
    "e",
    "Xulosa: xabar ichidagi nomni <b><code>\\d products</code></b> bilan solishtiring; <code>^</code> xato joyni ko'rsatadi",
    "Xulosa: bu xatolarning hammasida xabar ichida nom yoki qiymat turadi. Uni jadval tuzilishi bilan solishtiring, backslash d products. Strelka xato joyni ko'rsatadi. Apostrof uchun bitta qoida: so'z ichidagi apostrof ikki marta."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 5",
  "title": "VALUES ('O'yinchoq', 30000, 4) → syntax error at or near \"yinchoq\". Tuzatish qaysi?",
  "q": "Xabarlarni o'qidingiz, tekshirib olaylik. Uchinchi tekshiruv. Ekranda o'yinchoq degan mahsulot qo'shilmoqchi, baza syntax error, yinchoq so'zida deydi. Nima bo'ldi va tuzatish qaysi? Variantni tanlang.",
  "ok": "To'g'ri. SQL'da matn bir tirnoq ichida, so'z ichidagi apostrof uni erta yopadi. Ikki marta yozilsa, baza uni bitta apostrof deb tushunadi. Ekranda tuzatilgan insert: mahsulot o'yinchoq nomi bilan saqlandi. Demak, SQL matnidagi har apostrof ikki marta yoziladi.",
  "okShort": "<code>'O''yinchoq'</code> — so'z ichidagi apostrof ikki marta. Saqlanganda bitta bo'ladi: <code>O'yinchoq</code>.",
  "hint": "Matn qaysi belgi bilan boshlanib, qaysi belgi bilan tugaydi? Apostrof shu belgining o'zi.",
  "demak": "SQL matnidagi apostrof ikki marta yoziladi: <code>'O''yinchoq'</code>.",
  "correct": 1,
  "opts": [
   "Nomni kirillda yozish — apostrof kerak emas",
   "Apostrofni ikki marta yozish: 'O''yinchoq'",
   "Nomni qo'shtirnoqqa olish: \"O'yinchoq\"",
   "name ustunini VARCHAR emas, TEXT qilish"
  ],
  "wrong": {
   "0": "Muammo harfda emas, apostrofda: u matnni erta yopyapti.",
   "2": "Qo'shtirnoq SQL'da ustun yoki jadval nomi uchun — sinab ko'rdik: column \"O'yinchoq\" does not exist.",
   "3": "Ustun turi bu xatoga aloqasiz: xato matn yozilishida."
  }
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express · ichida nima bo'ladi",
  "title": "Pool — ulanishlar to'plami: yaratilganda ulanmaydi, birinchi so'rovda ulanadi, keyin shu ulanishni qayta ishlatadi",
  "seg": [
   [
    "a",
    "Express'da bazaga <code>pg</code> paketi orqali boriladi; kod tepasida <b><code>new Pool({ user, password, database, host, port })</code></b>",
    "Terminalda qilganlaringizni endi server ichiga ko'chiramiz. Node'da PostgreSQL bilan pg paketi gaplashadi. Kodning tepasida pg'dan Pool olinadi va unga foydalanuvchi, parol, baza nomi, host va port beriladi. Pool so'zi «hovuz», ya'ni ulanishlar to'plami degani. Nega to'plam, hozir ko'rasiz."
   ],
   [
    "b",
    "O'lchab ko'rdik: <code>Pool</code> yaratilganda ulanish <b>nol</b>; birinchi so'rovda ulanadi, keyingi so'rovlar o'sha ulanishda",
    "Buni o'lchab ko'rdik. Pool yaratilgan zahoti ulanishlar soni nol: u hali bazaga bormagan. Birinchi so'rovda ulanadi. Keyin yana ikki so'rov yubordik: bazadagi jarayon raqami, pid, uchalasida bir xil, faol ulanish bitta. Ya'ni Pool har so'rovga yangi ulanish ochmaydi, borini qayta ishlatadi."
   ],
   [
    "c",
    "Nega muhim: ulanish ochish qimmat; va <b>xato faqat birinchi so'rovda</b> — parol xato bo'lsa ham server «ishlayapti» deydi",
    "Bu ikki narsani tushuntiradi. Birinchisi: bazaga ulanish qimmat ish, shuning uchun uni bir marta ochib, qayta ishlatish to'g'ri. Ikkinchisi: Pool yaratilganda ulanmagani uchun parol xato bo'lsa ham server xatosiz ishga tushadi, xato faqat birinchi so'rovda chiqadi. Sinab ko'rdik: xato parol bilan Pool yaratildi, xato yo'q; birinchi so'rovda password authentication failed."
   ],
   [
    "d",
    "Xulosa: <code>Pool</code> bir marta sozlanadi, <b>birinchi so'rovda ulanadi</b>, ulanishni qayta ishlatadi; «server ishlayapti» — baza haqida emas",
    "Xulosa: Pool bir marta sozlanadi, birinchi so'rovda ulanadi va ulanishni qayta ishlatadi. Terminaldagi «server ishlayapti» faqat Express haqida, baza haqida hech narsa demaydi. Buni beshinchi bosqichda, ulanish xatolarida yana ko'rasiz. Endi Pool orqali birinchi so'rovni yuboramiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "pool.query so'rovni bazaga olib boradi; javobda rows — qatorlar, rowCount — terminaldagi son",
  "seg": [
   [
    "a",
    "<code>GET /api/cars</code>: <code>pool.query('SELECT * FROM cars')</code> — <b>natijaning <code>rows</code> qismi</b> <code>res.json</code> bilan qaytadi",
    "GET api cars endpoint'i. Pool query select'ni bazaga olib boradi. Natija obyektida bir nechta narsa bor, bizga ikkitasi kerak: rows, ya'ni qatorlar massivi, va rowCount. Rows res json bilan qaytariladi. Postman'da ikki yuz va uchta mashina. Bu terminaldagi select'ning o'zi, faqat javob JSON ko'rinishida."
   ],
   [
    "b",
    "<code>rowCount</code> — terminaldagi <code>UPDATE 1</code> ning o'zi: o'lchadik, <b><code>WHERE id = 99</code> → <code>rowCount: 0</code></b>, <code>rows: []</code>",
    "Rowcount nechta qator tegilganini aytadi, bu terminaldagi update bir yoki select'dagi qatorlar sonining o'zi. Sinab ko'rdik: shop bazasida where price kichik yuz ming bilan rowcount uch. Update where id to'qson to'qqiz bilan rowcount nol va rows bo'sh massiv. Birinchi bosqichdagi update nol aynan shu yerga keladi."
   ],
   [
    "c",
    "<code>async</code>/<code>await</code> va <code>try</code>/<code>catch</code>: so'rov kutiladi; xato bo'lsa <b>status 500 va xato matni</b>",
    "Pool query va'da qaytaradi, shuning uchun await bilan kutiladi, funksiya esa async. Hammasi try ichida. Xato bo'lsa catch ishlaydi: server besh yuz status va xato matnini qaytaradi. Beshinchi bosqichda xatolarning hammasini aynan shu catch orqali ko'rasiz."
   ],
   [
    "d",
    "Xulosa: <b><code>Pool</code> → <code>pool.query</code> → <code>rows</code> / <code>rowCount</code> → <code>res.json</code></b> — so'rov serverdan bazaga shu to'rt qadamda boradi",
    "Xulosa: so'rov serverdan bazaga to'rt qadamda boradi. Pool ulanadi, pool query so'rov yuboradi, natijadan rows yoki rowcount olinadi, res json javob qaytaradi. Keyingi ekranda qolgan uch endpoint: ularda ham shu to'rt qadam, faqat SQL boshqa."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "Uch yozuvchi endpoint — uch SQL buyruq; javob statusi va rowCount bilan",
  "seg": [
   [
    "a",
    "<code>POST</code> — <code>INSERT … RETURNING *</code>: <b>yangi qator javobda</b>, status 201",
    "GET o'qiydi, qolgan uchtasi yozadi. POST'da insert, oxirida returning yulduzcha, birinchi bosqichda ko'rgansiz: baza yangi qatorni, id bilan, qaytaradi. Shu qator rows nol bo'lib javobga ketadi. Status ikki yuz bir, ya'ni yaratildi. Chevrolet Spark to'rtinchi id bilan qo'shildi."
   ],
   [
    "b",
    "<code>is_rented: null</code> — <code>POST</code>da berilmagan ustun bo'sh qoldi: <b>jadvalda <code>DEFAULT</code> yo'q</b>",
    "Javobga qarang: is rented null. POST'da bu ustun berilmadi, jadvalda esa default qiymat yo'q. Uchinchi bosqichni eslang: baza faqat yozilgan qoidani bajaradi. Yechim jadvalda: alter table, is rented set default false. Shunda yangi mashina doim bo'sh deb yoziladi."
   ],
   [
    "c",
    "<code>PUT</code> — <code>UPDATE … WHERE id = $2</code>, <code>DELETE</code> — <code>WHERE id = $1</code>: 200; <b><code>rowCount</code> nol bo'lsa — 404</b>",
    "PUT ikkinchi mashina narxini yangiladi, ikki yuz va yangilangan qator. DELETE birinchi mashinani o'chirdi. Ikkalasida where bor, id URL'dan keladi. To'qson to'qqizinchi mashina: baza update nol qaytaradi, xato emas. Bu namunada kod rowcount nolmi deb tekshiradi va to'rt yuz to'rt beradi: mashina topilmadi. Rowcount'siz javob ikki yuz bo'lardi, ya'ni yolg'on «o'zgardi»."
   ],
   [
    "d",
    "Xulosa: GET — 200, POST — 201, PUT/DELETE — 200, <b>topilmasa — 404</b>, xato — 500; 404 ni <code>rowCount</code> hal qiladi",
    "Xulosa: GET ikki yuz, POST ikki yuz bir, PUT va DELETE ikki yuz; qator topilmasa to'rt yuz to'rt, xato bo'lsa besh yuz. To'rt yuz to'rtni kim hal qiladi? Rowcount, ya'ni terminaldagi update nol. Endi eng muhim savol: nega qiymatlar dollar bir bilan beriladi."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express · ichida nima bo'ladi",
  "title": "Yopishtirilgan SQL: 1 OR 1=1 — uchala mashina o'chdi. $1 bilan — 500, jadval joyida",
  "seg": [
   [
    "a",
    "Qiymatni SQL matniga yopishtirish: <code>'… WHERE id = ' + req.params.id</code> — <b>ishlaydi, lekin</b>",
    "Kodda qiymatni SQL matniga qo'shib yuborish oson: where id teng, plyus, req params id. Oddiy so'rovda bu ishlaydi: delete api cars bir, birinchi mashina o'chadi. Muammo shundaki, URL'dagi matn SQL'ning bir qismiga aylanadi. Sinab ko'rdik."
   ],
   [
    "b",
    "URL'ga <code>1 OR 1=1</code> yozildi — so'rov «hammasi» bo'lib qoldi: <b><code>deleted: 3</code></b>, jadval bo'sh",
    "URL'da id o'rniga bir or bir teng bir yubordik. Yopishtirilgan satr shunday SQL bo'ldi: where id bir, yoki bir teng bir. Bir teng bir doim to'g'ri. Javob ikki yuz, deleted uch: jadval bo'sh qoldi. Buni SQL injection deyishadi, va buni istalgan foydalanuvchi brauzerdan qila oladi."
   ],
   [
    "c",
    "<code>$1</code> bilan xuddi shu so'rov: qiymat alohida boradi — <b><code>invalid input syntax for type integer</code></b>, 500, jadval joyida",
    "Endi dollar bir bilan: pool query'ning ikkinchi argumenti massiv, qiymat shu massivda, SQL matniga kirmaydi. Baza bir or bir teng bir'ni son sifatida o'qishga urinadi va rad etadi: invalid input syntax for type integer. Besh yuz, lekin jadval joyida, uchala mashina bor."
   ],
   [
    "d",
    "Xulosa: foydalanuvchidan kelgan har qiymat <b><code>$1, $2</code> bilan</b>, SQL matniga hech qachon yopishtirilmaydi",
    "Xulosa: foydalanuvchidan kelgan har qiymat dollar bir, dollar ikki bilan beriladi, SQL matniga hech qachon yopishtirilmaydi. Bu uslub masalasi emas, xavfsizlik masalasi: bitta plyus belgisi butun jadvalni o'chirishga yo'l ochadi. Endi serverni o'zingiz ko'tarasiz."
   ]
  ]
 },
 "21": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 15–20 daqiqa",
  "title": "car_rental va server.js — o'z serveringiz, Postman bilan sinov",
  "seg": [
   [
    "a",
    "Endi siz: jadval qo'lda, server — <b>namunadan yoki Gemini bilan</b>, sinov Postman'da",
    "Endi o'zingiz server ko'tarasiz. Jadvalni terminalda qo'lda yozasiz. Server kodini namunadan yozing yoki Gemini'dan oling: Express, pg, to'rt endpoint, qiymatlar dollar bir bilan. O'n besh-yigirma daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <code>car_rental</code> va <code>cars</code>; papka, <b><code>express</code> va <code>pg</code></b>",
    "Birinchi qadamda car rental bazasi va cars jadvalini yaratib, uchta mashina qo'shasiz. Ikkinchisida avto ijara server papkasini ochib, npm init qilasiz va express bilan pg paketlarini o'rnatasiz."
   ],
   [
    "c",
    "3–4-qadam: <code>server.js</code>, <code>node server.js</code>, Postman; isbot — <b><code>POST</code> javobining statusi</b>",
    "Uchinchi qadamda server js faylini yozasiz, unga parolingizni qo'yib, node server js bilan ishga tushirasiz. To'rtinchisida Postman'da GET va POST yuborasiz. Isbot maydoniga POST javobining statusini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi bosqichda bu xatolarning hammasini ataylab chiqarib tuzatamiz. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda ishlab turgan server bor va siz uni Postman bilan sinagan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Jadval",
    "cmds": [
     "CREATE DATABASE car_rental;",
     "\\c car_rental",
     "CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);",
     "INSERT … ('Chevrolet Cobalt', 280000, 2022, false), …"
    ],
    "exp": "INSERT 0 3"
   },
   {
    "t": "Loyiha",
    "cmds": [
     "mkdir avto-ijara-server",
     "cd avto-ijara-server",
     "npm init -y",
     "npm install express pg"
    ],
    "exp": "added … packages"
   },
   {
    "t": "Server — server.js: «Kodni ochish» (namuna) yoki Gemini (Express + pg, to'rt endpoint, $1, topilmasa 404); parolni yozing",
    "cmds": [
     "node server.js"
    ],
    "exp": "Server 3000-portda ishlayapti"
   },
   {
    "t": "Postman",
    "cmds": [
     "GET localhost:3000/api/cars",
     "POST localhost:3000/api/cars body { \"model\": \"Chevrolet Spark\", \"daily_price\": 190000, \"year\": 2021 }"
    ],
    "exp": "200 · 3 mashina · POST — id bilan"
   }
  ],
  "proof": {
   "label": "POST javobining statusi",
   "placeholder": "Postman ko'rsatgan statusni yozing",
   "re": "^\\s*201\\b",
   "flags": "",
   "wrong": "Muvaffaqiyatli POST statusi uch xonali son. Postman'da javob ustida yozilgan."
  },
  "trouble": [
   [
    "500 password authentication failed for user \"postgres\"",
    "PASSWORD — o'rnatishda berilgan parol (24-ekran)"
   ],
   [
    "500 client password must be a string",
    "parol bo'sh / process.env o'qilmagan (24-ekran)"
   ],
   [
    "500 database \"…\" does not exist",
    "DATABASE nomi xato yoki baza yaratilmagan (24-ekran)"
   ],
   [
    "500 {\"error\":\"\"}",
    "PostgreSQL ishlamayapti — console.error(err) bilan ECONNREFUSED ko'rinadi (24-ekran)"
   ],
   [
    "500 Cannot destructure property 'model' of 'req.body'",
    "app.use(express.json()) yo'q (23-ekran)"
   ],
   [
    "500 column \"price\" of relation \"cars\" does not exist",
    "kodda ustun nomi xato (22-ekran)"
   ],
   [
    "kod o'zgardi, javob o'zgarmadi",
    "eski server ishlab turibdi — 25-ekran"
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "column \"price\" of relation \"cars\" does not exist — kodda price, jadvalda daily_price",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>daily_price</code> ustiga bosing",
    "Server ishlaydi, to'rt so'rov ham ishlaydi. Endi ataylab buzamiz, chunki o'quvchining Gemini'si aynan shu xatolarni qiladi. Buzishni o'zingiz qilasiz: server js'ning o'ttiz oltinchi satrida daily price yonib turibdi, ustiga bosing.",
    "<b>server.js</b> 36-satridagi <b><code>daily_price</code></b> ustiga bosing — Gemini yozgandek <b><code>price</code></b> bo'ladi."
   ],
   [
    "a",
    "Birinchi buzish — Gemini'ning odatiy xatosi: <code>INSERT</code>da <b>ustun nomini o'zi o'ylab topadi</b>, <code>price</code>",
    "Daily price o'rniga price bo'ldi. Bu Gemini'ning eng ko'p uchraydigan xatosi: insert'da ustun nomini jadvaldan emas, o'z taxminidan oladi. Serverni ishga tushiramiz: xato yo'q, server ishlayapti deb yozadi. Xato faqat POST yuborilganda chiqadi."
   ],
   [
    "b",
    "POST → 500, xabarda jadval va ustun: <b><code>\"price\"</code> · <code>\"cars\"</code></b>",
    "POST yuboramiz, javob besh yuz. Xabarni o'qiymiz: column price of relation cars does not exist. Ustun price, jadval esa cars. Relation so'zi uchinchi bosqichdan tanish: bu jadval. Xabar nimani tuzatishni o'zi aytdi."
   ],
   [
    "c",
    "Tuzatish: kodda <code>daily_price</code> — serverni <b>qayta ishga tushirib</b>, POST → 201",
    "Jadval tuzilishiga qaraymiz: ustun daily price. Kodda tuzatamiz, serverni to'xtatib, qayta ishga tushiramiz. POST yuboramiz: javob ikki yuz bir, yangi mashina id bilan qaytdi."
   ],
   [
    "d",
    "Xulosa: 500 bo'lsa — <code>error</code> matnidagi nomni <b><code>\\d cars</code></b> bilan solishtiring; kod o'zgarsa server qayta",
    "Xulosa: besh yuz chiqsa, xato matnini o'qing, ichida ustun va jadval nomi bor. Uni terminaldagi backslash d cars bilan solishtiring. Kod o'zgargandan keyin serverni albatta qayta ishga tushiring, aks holda eski kod ishlayveradi."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "Cannot destructure property 'model' of 'req.body' — so'rov tanasi o'qilmagan",
  "seg": [
   [
    "x",
    "Ikkinchi buzish ham <b>sizda</b>: kodda yonib turgan <code>app.use(express.json())</code> ustiga bosing",
    "Ikkinchi buzish ham sizda. Gemini ba'zan bitta satrni unutadi. Server js'ning o'n sakkizinchi satrida app use express json yonib turibdi, ustiga bosing: satr o'chadi.",
    "<b>server.js</b> 18-satridagi <b><code>app.use(express.json())</code></b> ustiga bosing — satr o'chadi."
   ],
   [
    "a",
    "Satr o'chdi: <code>app.use(express.json())</code> yo'q — <b>server baribir ishga tushadi</b>",
    "Satrni o'chirdingiz. Server xatosiz ishga tushadi, GET ham ishlaydi. Muammo faqat tanasi bor so'rovlarda."
   ],
   [
    "b",
    "POST → 500: <code>req.body</code> — <b><code>undefined</code></b>, <code>model</code>ni olib bo'lmaydi",
    "POST yuboramiz, javob besh yuz. Xabar shunday: cannot destructure property model of req body as it is undefined. Ya'ni req body umuman yo'q: Express so'rov tanasini o'qimagan, chunki JSON'ni o'qiydigan qism ulanmagan."
   ],
   [
    "c",
    "Tuzatish: satr qaytariladi, <code>app</code> yaratilgandan keyin, <b>endpoint'lardan oldin</b> — POST → 201",
    "Tuzatish uchun app use express json satrini app yaratilgandan keyin, endpoint'lardan oldin qaytaramiz. Tartib muhim: bu satr har so'rovdan oldin ishlaydi. Server qayta ishga tushadi, POST ikki yuz bir."
   ],
   [
    "d",
    "Xulosa: <code>req.body</code> <code>undefined</code> bo'lsa — birinchi qaraladigan joy <b><code>express.json()</code></b>",
    "Xulosa: req body undefined degan xato chiqsa, birinchi qaraladigan joy app use express json. GET ishlab, POST va PUT ishlamasa ham shu satr. Bitta satr, lekin usiz tanasi bor hech bir so'rov ishlamaydi."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "Server «ishlayapti» deydi — parol, baza va PostgreSQL xatosi birinchi so'rovda chiqadi",
  "seg": [
   [
    "a",
    "<code>Pool</code> darhol ulanmaydi (17-ekran): server ishga tushadi, <b>xato birinchi so'rovda</b>",
    "Pool ekranida ko'rgan edingiz: Pool server ishga tushganda bazaga ulanmaydi, birinchi so'rovda ulanadi. Shuning uchun parol xato bo'lsa ham terminalda server ishlayapti deb yoziladi. «Server ishlayapti, lekin besh yuz» degan holatda xabarni o'qing: to'rt xil bo'ladi."
   ],
   [
    "b",
    "Parol xato — <code>password authentication failed</code>; parol bo'sh — <b><code>client password must be a string</code></b>",
    "Parol xato bo'lsa: password authentication failed for user postgres. Parol umuman berilmasa, masalan process env'dan o'qilmagan bo'lsa: client password must be a string. Ikkinchisi g'alati ko'rinadi, lekin ma'nosi oddiy: parol o'zgaruvchisi bo'sh."
   ],
   [
    "c",
    "Baza nomi xato — <code>database \"carrental\" does not exist</code>: <b>pastki chiziq tushib qolgan</b>",
    "Baza nomida pastki chiziq tushib qolsa: database carrental does not exist. Baza bor, faqat nomi car pastki chiziq rental. Terminaldagi backslash l bilan aniq nomni ko'ring."
   ],
   [
    "d",
    "PostgreSQL o'chiq — xato matni bo'sh; <b><code>console.error(err)</code></b> — <code>ECONNREFUSED</code> ko'rinadi",
    "Eng chalkashi: PostgreSQL ishlamasa, javob besh yuz, lekin error bo'sh, terminalda ham bo'sh qator. Sinab ko'rdik: console error'ga err message emas, err'ning o'zini bersak, ECONNREFUSED chiqadi, ya'ni ulanish rad etildi. Yechim: PostgreSQL'ni ishga tushiring."
   ],
   [
    "e",
    "Xulosa: «ishlayapti» — faqat Express; <b>baza xatosini birinchi so'rov va terminal aytadi</b>",
    "Xulosa: terminaldagi ishlayapti degan satr faqat Express haqida. Bazaga ulanish birinchi so'rovda tekshiriladi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. PostgreSQL'ni ishga tushirish: Windows'da Services, Mac'da Postgres.app."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "Ikkinchi node server.js ham «ishlayapti» deydi — javobni esa eski server beradi",
  "seg": [
   [
    "a",
    "Eng chalkash holat: <b>«kodni tuzatdim, hech narsa o'zgarmadi»</b>",
    "Eng chalkash holat: kodni tuzatasiz, serverni yana ishga tushirasiz, lekin javob o'zgarmaydi. Sabab ko'pincha bitta: birinchi server boshqa terminalda hali ishlab turibdi."
   ],
   [
    "b",
    "Sinab ko'rdik: ikkinchi server ham «ishlayapti» deb yozdi va <b>xato bermay chiqib ketdi</b>",
    "Sinab ko'rdik. Birinchi server ishlab turganda ikkinchi oynada node server js. Kutganimiz port band degan xato edi. Haqiqatda ikkinchi server ham ishlayapti deb yozdi va xato bermay chiqib ketdi. So'rovlarga birinchi, eski server javob beradi."
   ],
   [
    "c",
    "Sabab Express 5 da: xato <code>listen</code> callback'iga beriladi, <b>namunadagi callback uni o'qimaydi</b>",
    "Sabab Express beshinchi versiyasida: listen xatoni callback'ga beradi. Gemini yozgan callback esa xatoni o'qimaydi, faqat ishlayapti deb chiqaradi. Callback xatoni o'qisa, address already in use chiqadi va server to'xtaydi. Bu namuna kodidagi kamchilik, Express'niki emas."
   ],
   [
    "d",
    "Xulosa: <b>bitta loyiha — bitta terminal</b>; qayta ishga tushirishdan oldin <code>Ctrl+C</code>",
    "Xulosa: bitta loyiha uchun bitta terminal. Qayta ishga tushirishdan oldin Ctrl C bilan eski serverni to'xtating. Javob o'zgarmasa, birinchi savol: boshqa terminalda server ochiq qolmadimi?"
   ]
  ]
 },
 "26": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 5 — qaysi satr xato?",
  "title": "POST 500: column \"price\" of relation \"cars\" does not exist. Xato satrni toping",
  "q": "Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Jadval ustunlarini eslang: id, model, daily price, year, is rented. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. O'sha satrni bosing.",
  "ok": "To'g'ri. O'ttiz oltinchi satrda insert'da price yozilgan, jadvalda esa daily price. O'ttiz to'rtinchi satrdagi daily price faqat JavaScript o'zgaruvchisi, baza uni ko'rmaydi, u SQL matnidagi nomni ko'radi. Ekranda tuzatilgan holat: daily price, POST ikki yuz bir. Demak, besh yuz chiqsa, SQL matnidagi har nomni jadval ustunlari bilan solishtiring.",
  "okShort": "36-satr: SQL'da <code>price</code> — jadvalda <code>daily_price</code>. 34-satrdagi <code>daily_price</code> — JS o'zgaruvchisi, baza ko'rmaydi.",
  "hint": "Baza JavaScript o'zgaruvchilarini ko'rmaydi — faqat qo'shtirnoq ichidagi SQL matnini. O'sha matndagi ustun nomlarini qidiring.",
  "task": "Qoida: SQL'dagi ustun nomlari jadvaldagi bilan aynan bir xil bo'ladi — <code>cars</code>: <code>id, model, daily_price, year, is_rented</code>. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. <b>O'sha satrni bosing.</b>"
 },
 "27": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Ikki buzish, ikki tuzatish — o'z serveringizda",
  "seg": [
   [
    "a",
    "Endi siz: o'z serveringizda ikkita xatoni <b>ataylab chiqarasiz va tuzatasiz</b>",
    "Oxirgi amaliyot: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz. O'n daqiqa. Bu xatolar haqiqiy loyihada ham chiqadi; ularni bir marta o'zingiz chiqarsangiz, keyin xabardan darhol taniysiz."
   ],
   [
    "b",
    "1–2-qadam: <code>price</code> xatosi — 500, <b>xabarni o'qing</b>, tuzating, 201",
    "Birinchi qadamda insert'dagi daily price'ni price qilib, serverni qayta ishga tushirasiz va POST yuborasiz. Ikkinchisida xabarni o'qib, xatoni tuzatasiz va qayta ishga tushirasiz: javob ikki yuz bir bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: eski serverni yopmasdan yangisini yoqing; isbot — <b>500 xabarining matni</b>",
    "Uchinchi qadamda birinchi server ishlab turganda ikkinchi terminalda yana node server js qilasiz va ishlayapti satrini ko'rasiz. To'rtinchisida ikkalasini ham Ctrl C bilan to'xtatasiz. Isbot maydoniga birinchi qadamdagi besh yuz xabarini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, bu ikki xato chiqqanda siz ularni birinchi marta ko'rayotgan bo'lmaysiz va xabardan sababini darhol topasiz."
   ]
  ],
  "steps": [
   {
    "t": "Buzish",
    "cmds": [
     "server.js: INSERT INTO cars (model, price, year)",
     "Ctrl+C",
     "node server.js",
     "Postman POST"
    ],
    "exp": "500 column \"price\" of relation \"cars\" does not exist"
   },
   {
    "t": "Tuzatish",
    "cmds": [
     "price → daily_price",
     "Ctrl+C",
     "node server.js",
     "POST"
    ],
    "exp": "201"
   },
   {
    "t": "Ikki server",
    "cmds": [
     "1-terminal ishlab turibdi",
     "2-terminalda node server.js"
    ],
    "exp": "ikkinchisi ham «Server 3000-portda ishlayapti»"
   },
   {
    "t": "To'xtatish",
    "cmds": [
     "ikkala terminalda Ctrl+C"
    ],
    "exp": "Postman: GET — javob yo'q (server yo'q)"
   }
  ],
  "proof": {
   "label": "1-qadamdagi 500 xabari",
   "placeholder": "Postman'dagi error matnini qo'ying",
   "re": "column\\s+\"?price\"?\\s+of relation\\s+\"?cars\"?\\s+does not exist",
   "flags": "i",
   "wrong": "Xabar to'liq bo'lsin: qaysi ustun va qaysi jadval (of relation …). Postman'dagi error qiymatini nusxalang."
  },
  "trouble": [
   [
    "1-qadamda 201",
    "server qayta ishga tushmagan — eski kod ishlayapti (25-ekran)"
   ],
   [
    "column \"price\" does not exist (of relationsiz)",
    "SELECT/UPDATEda xato qilingan — INSERTdagi ustunni o'zgartiring"
   ],
   [
    "3-qadamda listen EADDRINUSE: address already in use :::3000",
    "sizning server.jsingizda callback xatoni o'qiydi (Gemini boshqacha yozgan) — bu yaxshi; ikkala terminalni ham to'xtating"
   ],
   [
    "4-qadamda javob bor",
    "yana bir terminal ochiq qolgan — hammasini Ctrl+C"
   ]
  ]
 },
 "28": {
  "type": "Lesson",
  "kicker": "7-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4-06 · m4-08",
  "title": "Ikki o'quvchi darsi: nimani ko'radi, siz nimani qo'shasiz, nimaga tayyor turasiz",
  "seg": [
   [
    "a",
    "m4-06 (21 ekran): do'kon tugmalar bilan, amaliyotda — <b>haqiqiy PostgreSQL terminali</b>; jadval bugungi <code>products</code> ning o'zi",
    "Endi sinfga tayyorgarlik, ikki ekran. Birinchi o'quvchi darsi m4-06, yigirma bir ekran: o'quvchi do'konni tugmalar bilan boshqaradi, insert, select, where, update, delete. Jadval bugun siz yaratgan products'ning aynan o'zi. Amaliyotda esa u haqiqiy PostgreSQL terminalida yoki VS Code'da AI bilan o'z do'konini yaratadi, shuning uchun PostgreSQL har kompyuterda ishlab turishi shart. AI yozgan buyruqni oltinchi bosqichdagidek tekshirasiz."
   ],
   [
    "b",
    "m4-08 (9 ekran): <code>cars</code> jadvali qo'lda, <code>server.js</code> Gemini'dan, Postman bilan sinov — <b>bugungi serveringizning o'zi</b>",
    "Ikkinchisi m4-08, AvtoIjara, to'qqiz ekran: o'quvchi cars jadvalini terminalda o'zi yozadi, server kodini Gemini'dan oladi, Postman bilan sinaydi va AI xatosini topadi. Bu bugun siz ko'targan serverning o'zi. Farqi: o'quvchi Pool'ning ichini, tranzaksiyani va injection'ni bilmaydi, siz bilasiz."
   ],
   [
    "c",
    "Siz qo'shasiz: javobdagi son · <code>BEGIN … ROLLBACK</code> · <code>ORDER BY</code> · apostrof · <code>NOT NULL</code> · <b><code>HINT</code> ham adashadi</b>; to'rt farqni oldindan ayting",
    "Darsga siz qo'shadigan narsalar: har update'dan keyin javobdagi sonni so'rang, where'siz update'ni proyektorda begin ichida ko'rsating, order by va apostrofni ayting, o'z do'konini yaratayotganda not null'ni maslahat bering, hint ham adashishini eslating. To'rt farqni oldindan ayting: darsdagi xato matni qisqa, Gemini har kimga boshqacha kod yozadi, POST'dan keyin is rented null, port band bo'lsa ham «ishlayapti»."
   ],
   [
    "d",
    "Xulosa: darsdan oldin — har kompyuterda PostgreSQL va Postman, <b>sinf paroli</b>, bitta loyiha — bitta terminal; vaqt amaliyotga",
    "Xulosa: darsdan oldin uch narsani tekshiring: har kompyuterda PostgreSQL terminali ochiladi va Postman o'rnatilgan, sinf paroli hammaga ma'lum, qoida: bitta loyiha, bitta terminal. Vaqt bo'yicha taklif: m4-06 da to'qson daqiqaning yigirma beshi amaliyotga, m4-08 da qirqi server va Postman'ga, chunki o'quvchilar eng ko'p xato qiladigan joy shu."
   ]
  ]
 },
 "29": {
  "type": "Lesson",
  "kicker": "7-bosqich · sinfga tayyorgarlik",
  "title": "Olti holat va tayyor javoblar — hammasini bugun o'zingiz ko'rdingiz",
  "seg": [
   [
    "a",
    "Darsda albatta chiqadigan olti holat — <b>hammasini bugun o'zingiz ko'rdingiz</b>",
    "Ikki o'quvchi darsini bilasiz. Endi darsda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "Nom xatosi va apostrof — <b><code>\\d</code> bilan solishtiring</b>, apostrof ikki marta",
    "Birinchi holat jadval yoki ustun nomidagi xato: xabar ichidagi nomni backslash d bilan solishtiring, hint'ga ishonmang. Ikkinchisi apostrof: u ikki marta yoziladi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz va ulanish xatolari — <b><code>BEGIN</code>, parol va bo'sh xabar</b>",
    "Uchinchisi where'siz update yoki delete: uning oldi begin bilan olinadi. To'rtinchisi parol yoki baza nomidagi xato: uni Pool sozlamalarida qidiring. Beshinchisi: xabar bo'sh bo'lsa, console error'ga butun xatoni bering va PostgreSQL'ni tekshiring."
   ],
   [
    "d",
    "Xulosa: o'zgarmasa — ikkinchi terminal; <b>xabarni o'quvchi bilan birga o'qing</b>, javobni darhol aytmang",
    "Oltinchisi: o'quvchi «o'zgarmadi» desa, ikkinchi terminalda eski server qolganini tekshiring. Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "30": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "UPDATE products SET price = 99000; — WHERE yo'q. Javob?",
    "o": [
     "UPDATE 1 — faqat birinchi qator o'zgaradi",
     "ERROR — WHERE'siz UPDATE taqiqlangan",
     "UPDATE 3 — hamma qator yangi narxni oldi",
     "UPDATE 0 — shart yo'q, hech narsa"
    ],
    "c": 2,
    "e": "WHERE'siz — jadvaldagi hamma qator.",
    "s": 9
   },
   {
    "q": "BEGIN; → DELETE FROM products; → ROLLBACK; → SELECT *. Natija?",
    "o": [
     "Hamma mahsulot joyida — DELETE bekor bo'ldi",
     "(0 rows) — DELETE allaqachon diskka yozilgan",
     "Faqat birinchi qator qaytib keladi, xolos",
     "ERROR — ROLLBACK'dan keyin jadval yopiq"
    ],
    "c": 0,
    "e": "ROLLBACK tranzaksiyani bekor qiladi.",
    "s": 12
   },
   {
    "q": "Tranzaksiya ichida buyruq xato berdi, prompt shop=!#. Endi SELECT 1; yozsangiz?",
    "o": [
     "Oddiy ishlaydi — xato o'tib ketgan",
     "current transaction is aborted xatosi",
     "Baza o'zi COMMIT qilib, natija beradi",
     "Prompt o'zi oddiy holatga qaytadi"
    ],
    "c": 1,
    "e": "Aborted holat: ROLLBACKgacha hamma buyruq rad etiladi.",
    "s": 10
   },
   {
    "q": "UPDATEdan keyin SELECT * da qator ro'yxat oxiriga tushdi. Sabab?",
    "o": [
     "Bu xato — qator buzilgan, qayta yozing",
     "id o'zgardi — UPDATE yangi id berdi",
     "Tranzaksiya yopilmagan — qator vaqtincha",
     "ORDER BY yo'q — tartib kafolatlanmaydi"
    ],
    "c": 3,
    "e": "ctid o'zgardi; tartib ORDER BY bilan.",
    "s": 6
   },
   {
    "q": "new Pool({…}) yaratildi, parol xato. Server ishga tushganda nima bo'ladi?",
    "o": [
     "Darhol xato beradi, server tushadi",
     "Server yonadi, xato birinchi so'rovda",
     "Pool to'g'ri parolni o'zi topib oladi",
     "Hech qachon xato chiqmaydi — parol keshda"
    ],
    "c": 1,
    "e": "Pool birinchi so'rovda ulanadi.",
    "s": 17
   },
   {
    "q": "Server «ishlayapti», GET ishlaydi, POST — Cannot destructure property 'model' of 'req.body'. Sabab?",
    "o": [
     "Parol xato — baza so'rovni rad etdi",
     "Jadval yo'q — INSERT bajarilmadi",
     "Port band — POST boshqa serverga ketdi",
     "express.json() ulanmagan — tana bo'sh"
    ],
    "c": 3,
    "e": "req.body o'qilmagan.",
    "s": 23
   },
   {
    "q": "POST 500, {\"error\":\"\"}, terminalda bo'sh qator. Birinchi qadam?",
    "o": [
     "Serverni o'chirib, qaytadan yoqib ko'rish",
     "Gemini'dan butunlay yangi kod so'rash",
     "console.error(err) bilan xatoni ko'rish",
     "npm install bilan paketlarni yangilash"
    ],
    "c": 2,
    "e": "Bo'sh xabar — ECONNREFUSED yashiringan.",
    "s": 24
   },
   {
    "q": "'DELETE … WHERE id = ' + req.params.id va URL 1 OR 1=1. Nima bo'ladi?",
    "o": [
     "Hamma qator o'chadi va javob 200 qaytadi",
     "Baza bunday so'rovni rad etadi — 500",
     "404 — 1 OR 1=1 degan id topilmadi",
     "Faqat birinchi mashina o'chadi, qolgani qoladi"
    ],
    "c": 0,
    "e": "Yopishtirilgan matn SQL bo'ldi; $1 bilan — 500, jadval joyida.",
    "s": 20
   }
  ]
 },
 "31": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  PG-2 DARSINING RASMI (F-1120-02, qonun M51) — «So'rov bazagacha va qaytib».
//  Chapda ikki mijoz: Postman (Express orqali) va psql (to'g'ridan-to'g'ri SQL). O'rtada Express (server.js):
//  express.json → route → pool.query. O'ngda PostgreSQL: car_rental · cars va shop · products. Pastda — bajarilayotgan satr.
//  Qiymatlar — manba/pg2-out (11-crud-sorovlar, 12-price-xato, 13-express-json-yoq, v2b-01). Satr raqamlari server.js dagidek
//  (06-s14-s27.jsx: Pool 10–16 · json 18 · GET 21–29 · POST 32–44, SQL 36). Modul darajasida PG/T ishlatilmaydi (yig'ish tartibi).
//  Ranglar: dars ranglari (T, PG). CSS izohida backtick yo'q.
// ============================================================
const CARS0 = [['1', 'Chevrolet Cobalt', '280000'], ['2', 'Chevrolet Malibu', '520000'], ['3', 'Kia K5', '610000']];
const PRODS0 = [['1', 'Klaviatura', '120000'], ['2', 'Sichqoncha', '75000']];
// on: yonib turgan bekatlar ('pm','json','route','pool','cars','psql','shop'); berilmasa — hammasi oddiy
// path: 'api' | 'psql' | 'both' — qaysi yo'l rangli · back: javob yo'li (yashil) · st: status (null — yo'q, '?' — hali noma'lum)
// bad: { at: 'json'|'route'|'pool'|'cars'|'pg', why } · pins: { json|route|pool|cars|col|pm: raqam } (M52-4)
// cars/prods: jadval qatorlari · newRow: cars'da yangi qator (yashil) · col: cars ustunlari satri · psqlLine: [buyruq, natija]
// route/sql: Express ichidagi satrlar · rc: natija chipi · ro: [fayl:satr, html] · tag · max
function CrudMachine({ on, path = 'api', back, st = null, res, bad, pins = {}, cars = CARS0, newRow, col, prods = PRODS0, pcols, psqlLine, req, route, sql, rc, ro, tag, max, json = true }) {
  const W = 760, BOT = 300;
  const H = BOT + (ro ? 54 : 4);
  const lit = (k) => !on || on.includes(k);
  const ds = (k) => (bad && bad.at === k ? 'bad' : lit(k) ? (on ? 'hl' : '') : 'dim');
  const apiOn = path === 'api' || path === 'both', psqlOn = path === 'psql' || path === 'both';
  const stC = st == null || st === '?' ? T.ink3 : st >= 400 ? '#DC2626' : T.green;
  const station = (k, y, txt, ref, c) => {
    const s = ds(k);
    return <div key={k} className="n1-abs n1-st" data-st={s === 'dim' ? 'dim' : undefined} style={{ left: 244, top: y, width: 244, height: 34, borderRadius: 9, border: `2px solid ${s === 'bad' ? '#DC2626' : c}`, background: s === 'bad' ? '#FEF2F2' : T.paper, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', font: `500 ${((n) => (n > 30 ? 10 : n > 26 ? 10.5 : 11.5))(txt.replace(/<[^>]+>/g, '').length)}px ${MONO}`, color: s === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap', overflow: 'hidden', boxShadow: s === 'hl' ? '0 0 0 3px rgba(226,69,31,.14)' : 'none', textDecoration: s === 'bad' && k === 'json' ? 'line-through' : 'none' }}>
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }} dangerouslySetInnerHTML={html(txt)} /><span style={{ color: T.ink3, fontSize: 10.5 }}>{ref}</span>
    </div>;
  };
  const pin = (k, x, y) => (pins[k] ? <span key={'p' + k} className="n1-pin on" style={{ left: x, top: y }}>{pins[k]}</span> : null);
  const tbl = (k, name, cols, rows, y, hlRow, colsHtml) => {
    const s = ds(k);
    return <div className="n1-abs n1-st" data-st={s === 'dim' ? 'dim' : undefined} style={{ left: 530, top: y, width: 202, borderRadius: 10, border: `1.5px solid ${s === 'bad' ? '#DC2626' : s === 'hl' ? PG.pg : T.line}`, background: T.paper, overflow: 'hidden', boxShadow: s === 'hl' ? '0 0 0 3px rgba(51,103,145,.14)' : 'none' }}>
      <div style={{ padding: '5px 9px', font: `700 11.5px ${MONO}`, color: PG.pg, background: '#F1F5F9' }}>{name}</div>
      <div style={{ padding: '3px 9px', font: `600 10.5px ${MONO}`, color: s === 'bad' ? '#B91C1C' : T.ink2, borderTop: `1px solid ${T.line}`, whiteSpace: 'nowrap' }} dangerouslySetInnerHTML={html(colsHtml || cols)} />
      {rows.map((r, i) => <div key={i} style={{ padding: '2px 8px', font: `500 10px/1.55 ${MONO}`, color: i === hlRow ? T.green : T.ink, background: i === hlRow ? '#E3F5EC' : undefined, fontWeight: i === hlRow ? 700 : 500, borderTop: `1px solid ${T.line}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.join(' · ')}</div>)}
    </div>;
  };
  const rq = req || { m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", … }' };
  const pl = psqlLine || ['shop=#', 'UPDATE products SET price = 99000 WHERE id = 1;', 'UPDATE 1'];
  return <N1Fit w={W} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 4 }}>{tag}</span>}
    {/* Postman — Express orqali */}
    <div className="n1-abs n1-st" data-st={ds('pm') === 'dim' ? 'dim' : undefined} style={{ left: 20, top: 30, width: 196, height: 138, borderRadius: 12, border: `2px solid ${ds('pm') === 'hl' ? PG.post : T.line}`, background: T.paper, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderBottom: `1px solid ${T.line}`, whiteSpace: 'nowrap' }}><b style={{ font: `700 12px ${SANS}`, color: PG.post }}>Postman</b><span style={{ font: `700 10px ${MONO}`, color: '#fff', background: rq.m === 'GET' ? PG.pg : T.green, borderRadius: 5, padding: '2px 5px' }}>{rq.m}</span><span style={{ font: `500 11px ${MONO}`, color: T.ink2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{rq.url}</span></div>
      <div style={{ padding: '5px 10px', font: `500 10px/1.5 ${MONO}`, color: T.ink2, height: 56, overflow: 'hidden', overflowWrap: 'anywhere' }}>{rq.body || t("tanasiz so'rov", 'запрос без тела')}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderTop: `1px solid ${T.line}` }}>
        <span style={{ font: `700 12px ${MONO}`, color: '#fff', background: stC, borderRadius: 6, padding: '3px 7px', minWidth: 34, textAlign: 'center', transition: 'background .4s' }}>{st == null ? '…' : st}</span>
        <span style={{ font: `500 10px/1.35 ${MONO}`, color: st >= 400 ? '#B91C1C' : T.ink2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflowWrap: 'anywhere' }}>{res || ''}</span>
      </div>
    </div>
    {pin('pm', 206, 22)}
    {/* psql — to'g'ridan-to'g'ri SQL */}
    <div className="n1-abs n1-st" data-st={ds('psql') === 'dim' ? 'dim' : undefined} style={{ left: 20, top: 222, width: 196, height: 74, borderRadius: 12, background: T.code, padding: '8px 10px', font: `500 10.5px/1.45 ${MONO}`, color: T.codeInk, overflow: 'hidden', boxShadow: ds('psql') === 'hl' ? '0 0 0 3px rgba(226,69,31,.18)' : 'none' }}>
      <div style={{ color: '#8A90A2', whiteSpace: 'nowrap' }}>psql</div>
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ color: '#8A90A2' }}>{pl[0]}</span> {pl[1]}</div>
      <div className={/ERROR/.test(pl[2]) ? 'n1-er' : 'n1-ok'} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl[2]}</div>
    </div>
    {/* Express — server.js */}
    <div className="n1-app" style={{ left: 232, top: 30, width: 268, height: 160 }} />
    <span className="n1-tagl" style={{ left: 246, top: 40 }}>Express · server.js</span>
    {json ? station('json', 58, 'app.use(<span class="n1-c">express.json</span>())', '18', T.yellow) : <div className="n1-abs" style={{ left: 244, top: 58, width: 244, height: 34, borderRadius: 9, border: '1.5px dashed #F2A9A9', background: '#FEF2F2', display: 'flex', alignItems: 'center', padding: '0 10px', font: `600 11.5px ${MONO}`, color: '#B91C1C', whiteSpace: 'nowrap' }}>{t("18-satr yo'q — req.body: undefined", 'строки 18 нет — req.body: undefined')}</div>}
    {station('route', 100, route || "app.<span class=\"n1-k\">post</span>(<span class=\"n1-s\">'/api/cars'</span>)", route && /get/.test(route) ? '21' : '32', T.ink2)}
    {station('pool', 142, sql || 'pool.query(sql, [$1, $2, $3])', route && /get/.test(route) ? '23' : '36', T.purple)}
    {pin('json', 478, 50)}{pin('route', 478, 92)}{pin('pool', 478, 134)}
    {/* PostgreSQL */}
    <div className="n1-abs" style={{ left: 520, top: 30, width: 220, height: 266, borderRadius: 14, border: `2px solid ${ds('pg') === 'bad' ? '#DC2626' : PG.pg}`, background: ds('pg') === 'bad' ? '#FEF2F2' : '#F7FAFC' }} />
    <span className="n1-abs" style={{ left: 532, top: 21, background: T.paper, padding: '0 6px', font: `700 12.5px/16px ${SANS}`, color: PG.pg, whiteSpace: 'nowrap' }}>PostgreSQL :5432</span>
    {tbl('cars', 'car_rental · cars', 'id · model · daily_price', cars, 48, newRow, col)}
    {/* 2 dan ko'p qator — jadval yuqoriga suriladi (har qator 20 px), PostgreSQL ramkasidan chiqmaydi; 2 qatorda joyi o'zgarmaydi */}
    {tbl('shop', 'shop · products', pcols || 'id · name · price', prods, 210 - 20 * Math.max(0, prods.length - 2), -1)}
    {pin('cars', 716, 40)}{pin('col', 716, 66)}
    {/* yo'llar */}
    <svg className="n1-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <marker id="pg2r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.accent} /></marker>
        <marker id="pg2g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.green} /></marker>
        <marker id="pg2k" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#B9BFCB" /></marker>
      </defs>
      <path d="M216 75 L 240 75" fill="none" stroke={apiOn ? T.accent : '#B9BFCB'} strokeWidth="2" markerEnd={`url(#${apiOn ? 'pg2r' : 'pg2k'})`} />
      <path d="M366 92 L 366 98 M366 134 L 366 140" fill="none" stroke={apiOn ? T.accent : '#B9BFCB'} strokeWidth="2" />
      <path d="M488 159 L 526 159" fill="none" stroke={apiOn ? T.accent : '#B9BFCB'} strokeWidth="2" markerEnd={`url(#${apiOn ? 'pg2r' : 'pg2k'})`} strokeDasharray={bad && (bad.at === 'json' || bad.at === 'route') ? '4 4' : '0'} />
      {back && <path d="M520 206 L 228 206 L 228 150 L 220 150" fill="none" stroke={bad ? '#DC2626' : T.green} strokeWidth="2" markerEnd={`url(#${bad ? 'pg2r' : 'pg2g'})`} strokeDasharray={bad ? '5 4' : '0'} />}
      <path d="M216 259 L 530 259" fill="none" stroke={psqlOn ? T.accent : '#D5D9E1'} strokeWidth="2" markerEnd={`url(#${psqlOn ? 'pg2r' : 'pg2k'})`} strokeDasharray={psqlOn ? '0' : '5 5'} />
    </svg>
    {back && <span className="n1-abs" style={{ left: 374, top: 206, transform: 'translate(-50%,-50%)', background: T.paper, padding: '1px 7px', borderRadius: 6, font: `600 11px ${MONO}`, color: bad ? '#B91C1C' : T.green, whiteSpace: 'nowrap', border: `1px solid ${bad ? '#F2A9A9' : '#BFE3D0'}` }}>{back}</span>}
    <span className="n1-abs" style={{ left: 374, top: 259, transform: 'translate(-50%,-50%)', background: T.paper, padding: '1px 7px', font: `600 10.5px ${MONO}`, color: psqlOn ? T.accent : T.ink3, whiteSpace: 'nowrap' }}>{t("psql — SQL to'g'ridan-to'g'ri", 'psql — SQL напрямую')}</span>
    {rc && <span className="n1-abs" style={{ left: 534, top: 182, font: `600 10.5px ${MONO}`, color: T.green, whiteSpace: 'nowrap', background: '#E3F5EC', borderRadius: 6, padding: '3px 7px' }}>{rc}</span>}
    {bad && bad.why && <span className="n1-abs" style={{ left: bad.at === 'cars' || bad.at === 'pg' ? 534 : 244, top: bad.at === 'cars' || bad.at === 'pg' ? 182 : 196, font: `700 11px ${SANS}`, color: '#B91C1C', whiteSpace: 'nowrap', background: T.paper, padding: '1px 4px' }}>✕ {bad.why}</span>}
    {ro && <div className="n1-ro" style={{ left: 20, top: BOT + 8, width: 720, height: 42 }}><span className="rf">{ro[0]}</span><code style={{ fontSize: ro[1].replace(/<[^>]+>/g, '').length > 72 ? 11.5 : 13, background: 'transparent', color: T.codeInk, padding: 0, border: 0 }} dangerouslySetInnerHTML={html(ro[1])} /></div>}
  </N1Fit>;
}

// «Buzamiz» (22, 23) — VS Code oynasi ichidagi kichik rasm (M52): Postman → express.json → INSERT → cars → javob
// broken: 'col' (price) | 'json' · known: natija ko'rinadimi (M52-3: ovoz aytguncha «?») · fixed · pins: { a: 1, b: 2 }
function CrudMini({ broken, known, fixed, pins = {} }) {
  const bad = broken && !fixed;
  const st = !broken && !fixed ? null : !known ? '?' : bad ? 500 : 201;
  const box = (x, w, label, sub, state) => <div className="n1-abs" style={{ left: x, top: 34, width: w, height: 50, borderRadius: 10, border: `2px solid ${state === 'bad' ? '#DC2626' : state === 'ok' ? T.green : T.line}`, background: state === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s' }}>
    <div style={{ font: `700 11.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap', textDecoration: state === 'bad' && sub === 'gone' ? 'line-through' : 'none' }} dangerouslySetInnerHTML={html(label)} />
    <div style={{ font: `500 10.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', marginTop: 3 }}>{sub === 'gone' ? t("o'chirilgan", 'удалена') : sub}</div>
  </div>;
  const colBad = bad && broken === 'col', jsonBad = bad && broken === 'json';
  return <>
    <span className="n1-tagl" style={{ left: 8, top: 12 }}>{t("POST /api/cars — so'rovning yo'li", 'POST /api/cars — путь запроса')}</span>
    {box(8, 92, 'Postman', 'POST', '')}
    {box(116, 128, 'express.json()', jsonBad ? 'gone' : 'req.body ✓', jsonBad ? 'bad' : fixed && broken === 'json' ? 'ok' : '')}
    {box(260, 156, 'INSERT INTO cars', colBad ? '(model, price, …)' : '(model, daily_price…)', colBad ? 'bad' : fixed && broken === 'col' ? 'ok' : '')}
    {box(430, 90, 'cars', 'daily_price', '')}
    {[100, 244, 416].map((x) => <div key={x} className={`n1-arr${bad && x > (jsonBad ? 100 : 244) ? ' off' : ''}`} style={{ left: x + 1, top: 58, width: 14 }} />)}
    <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: st == null || st === '?' ? T.ink3 : st >= 400 ? '#DC2626' : T.green }}>{st == null ? '' : `${t('javob', 'ответ')} → ${st}`}{st === 500 && jsonBad ? " · req.body: undefined" : st === 500 ? t(" · cars'da price ustuni yo'q", ' · в cars нет колонки price') : ''}</span>
    {pins.a && <span className="n1-pin on" style={{ left: jsonBad ? 230 : 402, top: 26 }}>{pins.a}</span>}
    {pins.b && <span className="n1-pin on" style={{ left: jsonBad ? 230 : 502, top: jsonBad ? 72 : 26 }}>{pins.b}</span>}
  </>;
}

// ============================================================
//  MENTOR KURSI · PostgreSQL-2 «CRUD so'rovlar va Express'dan bazaga»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/08-PostgreSQL2-mentor-v2.md (MD v2 — M41 «avval mentor o'rganadi», GATE M 03.11: 1A·2C·3A·4A)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/pg2-out/ — v2b (3→11 uzluksiz), v2e (ikki psql seansi), v2f (14–18 uzluksiz), v2d (Mongoose), 10–20 (Express)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg2/parts/*.jsx > PgCrudMentorLesson.jsx
//  Yordamchilar PG-1 dan nusxa (pg1/parts/04-yordam.jsx) — darslar bir-biriga bog'liq emas
// ============================================================
const LESSON_ID = 'mentor-pg-02-crud-express-v1';
const LESSON_TITLE = "CRUD so'rovlar va Express'dan bazaga";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', win: '#0067C0', post: '#FF6C37' };
MKCFG.root = 'avto-ijara-server';
MKCFG.kind = (f) => /\.js$/.test(f) ? T.yellow : /\.sql$/.test(f) ? PG.pg : /\.json$/.test(f) ? T.ink2 : null;
MKCFG.files = ['node_modules/', 'package.json', 'server.js'];
// Mongoose jufti — bitta xira qator (M45): dvigatel .mk-pair
const Pair = ({ code, res }) => <div className="mk-pair"><b style={{ color: PG.mongo }}>{t("Mongoose'da:", "В Mongoose:")}</b> <code>{code}</code>{res ? <> → {res}</> : null}</div>;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  // F-1120-02 (M52): 4-element — act (mentor o'zi bosadi, chap paneldagi ko'rsatma)
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['psql minus U postgres', 'psql -U postgres'], ['backslash d products', '\\d products'], ['backslash d cars', '\\d cars'],
  ['backslash l', '\\l'], ['backslash d', '\\d'], ['backslash c', '\\c'],
  ['app use express json', 'app.use(express.json())'], ['express json', 'express.json()'], ['pool query', 'pool.query'], ['res json', 'res.json'],
  ['req body', 'req.body'], ['node server js', 'node server.js'], ['server js', 'server.js'], ['console error', 'console.error'], ['err message', 'err.message'],
  ['daily price', 'daily_price'], ['is rented', 'is_rented'], ['car rental', 'car_rental'], ['avto ijara server', 'avto-ijara-server'], ['rowCount', 'rowCount'],
  ['dollar bir, dollar ikki', '$1, $2'], ['dollar bir', '$1'], ['dollar ikki', '$2'], ['bir or bir teng bir', '1 OR 1=1'],
  ['order by id', 'ORDER BY id'], ['order by', 'ORDER BY'], ['returning yulduzcha', 'RETURNING *'], ['select yulduzcha', 'SELECT *'],
  ['insert, nol, uch', 'INSERT 0 3'], ['insert nol bir', 'INSERT 0 1'], ['update bir', 'UPDATE 1'], ['update nol', 'UPDATE 0'], ['update uch', 'UPDATE 3'],
  ['delete bir', 'DELETE 1'], ['delete uch', 'DELETE 3'], ['deleted uch', 'deleted: 3'], ['not null', 'NOT NULL'], ['default false', 'DEFAULT false'],
  ['where name is null', 'WHERE name IS NULL'], ['process env', 'process.env'], ['Ctrl C', 'Ctrl+C'], ['npm init', 'npm init -y'],
  // v2 (03.11)
  ['create database', 'CREATE DATABASE'], ['create table', 'CREATE TABLE'], ['insert into', 'INSERT INTO'], ['nol vergul olti', '(0,6)'], ['nol vergul besh', '(0,5)'],
  ['matchedCount nol', 'matchedCount: 0'], ['dollar lt', '$lt'], ['check stock katta yoki teng nol', 'CHECK (stock >= 0)'], ['alter table', 'ALTER TABLE'], ['set not null', 'SET NOT NULL'],
  ['rowcount', 'rowCount'], ['Rowcount', 'rowCount'], ['update nol', 'UPDATE 0'], ['insert nol to\'rt', 'INSERT 0 4'], ['teng, yulduzcha, panjara', '=*#'], ['undov belgisi', '!'],
];
DIGITS.unshift(["sakson to'qqiz ming", '89 000'], ["to'qson to'qqiz ming", '99 000'], ['yuz ming', '100 000'], ['ellik ming', '50 000'], ["o'ttiz ming", '30 000'],
  ["to'qson to'qqizinchi", '99-'], ['yigirma bir', '21'], ['yigirma beshi', '25 tasi'], ["o'n besh-yigirma", '15–20'], ["besh-o'n", '5–10'],
  ['bir, ikki, uch, to\'rt', '1, 2, 3, 4'], ['id bir', 'id 1'], ['id uch', 'id 3'], ["to'qqiz ekran", '9 ekran']);
// F-1109-01: gap boshidagi «Backslash l» ham «Matn»da kod bo'lib ko'rinsin
SPOKEN.push(...SPOKEN.filter(([a]) => a.startsWith('backslash')).map(([a, b]) => ['B' + a.slice(1), b]));
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /violates foreign key constraint/g, /is not present in table/g, /is still referenced from table/g, /violates check constraint/g,
  /violates not-null constraint/g, /duplicate key value/g, /already exists/g, /syntax error/g, /Connection refused/g,
  /Cannot destructure property/g, /client password must be a string/g, /there is no transaction in progress/g, /permission denied/g,
  /invalid input syntax for type integer/g, /has more target columns than expressions/g, /address already in use/g, /Perhaps you meant/g,
);

// Kod rang beruvchi: JS (Mongo sahnasi) va SQL/psql (qolgan hammasi). Matn — String.raw, HTML'siz.
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const JS_KW = /^(const|let|await|new|async|return|true|false|null|require)$/;
function jsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|(\d+)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += JS_KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const js = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jsLine(l), ...(meta[i + 1] || {}) }));
const SQL_KW = /^(SELECT|FROM|WHERE|JOIN|LEFT|ON|AND|AS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|ALTER|ADD|COLUMN|DROP|PRIMARY|KEY|REFERENCES|NOT|NULL|UNIQUE|CHECK|SERIAL|INT|TEXT|JSONB|BEGIN|COMMIT|ROLLBACK|RETURNING|DEFAULT)$/;
function sqlLine(src) {
  const re = /(--.*$)|('(?:[^']|'')*')|([A-Za-z_][\w]*)|(\d+)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += SQL_KW.test(id) ? `<span class="k">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const sql = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: sqlLine(l), ...(meta[i + 1] || {}) }));
// psql terminali: prompt (blog=# · postgres-# · $) alohida rangda; xato qizil, DETAIL/LINE sariq, buyruq javobi yashil
const RESULT_OK = /^(CREATE TABLE|CREATE DATABASE|ALTER TABLE|DROP TABLE|INSERT \d+ \d+|UPDATE [1-9]\d*|DELETE \d+|BEGIN|COMMIT)\s*$/;
function psqlLine(l) {
  let m = /^(\w+[=\-(][*!]?# ?)(.*)$/.exec(l); // blog=# · blog-# · blog(# · tranzaksiyada blog=*# · xatoda blog=!# (pg1-out/25)
  if (m) return `<span class="p">${escH(m[1])}</span>${/^\\/.test(m[2]) ? `<span class="m">${escH(m[2])}</span>` : sqlLine(m[2])}`;
  m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/ERROR:|FATAL:|psql: error|XATO:|not recognized|command not found/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^(DETAIL|HINT|LINE \d|WARNING)|^\s+\^\s*$|Is the server running/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^(UPDATE 0|ROLLBACK)\s*$/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (RESULT_OK.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^(Password for user|Type "help"|psql \()/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*--/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*(SELECT|FROM|JOIN|LEFT|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|BEGIN|COMMIT|\(|\)|id |user_id|izoh|username|nomi|stock|product_id|xaridor|\('|  \(')/.test(l) && !/\|/.test(l)) return sqlLine(l);
  return escH(l);
}
const psql = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: psqlLine(l), ...(meta[i + 1] || {}) }));
// Bitta qatorga «at» (qadam) va «id» (yoritish) beruvchi qisqa yozuv: rng(2, 5, {at: 1}) → {2:{at:1}, …, 5:{at:1}}
// Galma-gal terminal: faqat oxirgi kelgan qadam guruhi (at) — eski buyruqlar ekrandan ketadi (memory «ma'lumot galma-gal»)
const cur = (lines, beat) => { const ats = lines.map((l) => l.at).filter((x) => x != null && x <= beat); const m = ats.length ? Math.max(...ats) : null; return lines.filter((l) => l.at == null || l.at === m); };
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});

const Psql = ({ lines, title = 'psql — blog', er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
// Rasmiy hujjatdan olingan maket (bu kompyuterda sinalmagan) — har oynada belgi (MD Ochiq savol 2)
function Win({ title, os = 'win', children, hl }) {
  return <div className={`pg-win${os === 'mac' ? ' mac' : ''}${hl ? ' hl' : ''}`}>
    <div className="bar">{os === 'mac' ? <><i /><i /><i /></> : <span className="ico">▣</span>}<span className="tt">{title}</span><span className="warn">{t('⚠ rasmiy hujjatdan, sinalmagan', '⚠ по официальной документации, не проверено')}</span></div>
    <div className="bd">{children}</div>
  </div>;
}
function MiniTable({ name, cols, rows, hlRow = [], hlCol = [], color = PG.pg, dimRow = [] }) {
  return <div className="pg-mt" style={{ '--c': color }}>
    <div className="nm">{name}</div>
    <table><thead><tr>{cols.map((c, i) => <th key={c} className={hlCol.includes(i) ? 'hl' : ''}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className={`${hlRow.includes(i) ? 'hl' : ''}${dimRow.includes(i) ? ' dim' : ''}`}>{r.map((c, j) => <td key={j} className={hlCol.includes(j) ? 'hlc' : ''}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
// Postman ko'rinishidagi karta (PRD Q2): javob — haqiqiy, curl bilan olingan (pg2-out)
const METHOD_C = { GET: '#61AFFE', POST: '#49CC90', PUT: '#FCA130', DELETE: '#F93E3E' };
function PostmanCard({ m, url, body, st, res, hl }) {
  const c = String(st)[0];
  return <div className={`pg-pm${hl ? ' hl' : ''}`}>
    <div className="top"><span className="lg">Postman</span><span className="m" style={{ background: METHOD_C[m] }}>{m}</span><span className="u">{url}</span><span className="tg">{t("haqiqiy javob", "настоящий ответ")}</span></div>
    {body && <pre className="b">{body}</pre>}
    <div className="r"><span className={`st s${c}`}>{st}</span><pre>{res}</pre></div>
  </div>;
}
const Doc = ({ children, odd, er }) => <pre className={`pg-doc${odd ? ' odd' : ''}${er ? ' er' : ''}`}>{children}</pre>;

// PG-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.p2-vs-card{background:#fff;border:1px solid #D7DCE3;border-radius:14px;padding:14px 10px 8px}
.p2-vs-card svg{display:block;width:100%;height:auto}
.p2-vs-card .nd{font:700 20px ui-monospace,Menlo,Consolas,monospace}
.p2-vs-card .in{font:13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;fill:#CBD5E1}
.p2-vs-card .lb{font:700 14px ui-monospace,Menlo,Consolas,monospace}
.p2-lanes{display:grid;grid-template-columns:92px 1fr 1fr 1fr;background:#fff;border:1px solid #D7DCE3;border-radius:14px;overflow:hidden}
.p2-lanes>div{padding:10px 12px;border-bottom:1px solid #EEF0F3;font-size:14px;line-height:1.35;display:flex;align-items:center;gap:8px;min-height:46px}
.p2-lanes .h{font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;background:#F8FAFC}
.p2-lanes .tm{font:600 12px ui-monospace,Menlo,Consolas,monospace;color:#6B7280;background:#F8FAFC}
.p2-lanes code{font:13px ui-monospace,Menlo,Consolas,monospace;background:#F1F3F6;border-radius:5px;padding:1px 6px}
.p2-cn{display:flex;align-items:center;gap:6px;flex:1}
.p2-cn i{flex:1;height:0;border-top:2px dashed #C3CAD4}
.p2-cn.on i{border-top:3px solid #336791}
.p2-pid{font:700 13px ui-monospace,Menlo,Consolas,monospace;color:#fff;background:#336791;border-radius:6px;padding:2px 8px;white-space:nowrap}
.p2-bad{border:2px solid #E2451F;border-radius:14px;background:#FFF5F2;padding:12px 14px;display:grid;grid-template-columns:auto 1fr;gap:6px 12px;align-items:center;font-size:14px}
.p2-bad>b{color:#E2451F}
.p2-s19 td.st{text-align:center;font-weight:700;width:64px}
.p2-s19 td.st.s2{color:#15803D}.p2-s19 td.st.s4{color:#B45309}.p2-s19 td.st.s5{color:#B91C1C}
.p2-s19 tr.k td{background:#FFFBEB}
.p2-s19 td.ar{color:#9CA3AF;text-align:center;width:22px}
.mk-explorer{overflow:auto}
/* ogohlantirish qutisi — Nest-2 dagi bilan bir xil (u bo'lak bu darsga kirmaydi) */
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-win{background:${T.paper};border:1px solid #CBD2DC;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(15,17,21,.10);transition:box-shadow .3s,border-color .3s}
.pg-win.hl{border-color:${T.accent};box-shadow:0 0 0 4px rgba(226,69,31,.14),0 10px 30px rgba(15,17,21,.10)}
.pg-win .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F3F3F3;border-bottom:1px solid #DADDE3;font:600 12px ${SANS};color:${T.ink2}}
.pg-win.mac .bar{background:#E8E8EA}
.pg-win .bar i{width:10px;height:10px;border-radius:50%;display:inline-block;background:#FF5F57}
.pg-win .bar i:nth-child(2){background:#FEBC2E}.pg-win .bar i:nth-child(3){background:#28C840}
.pg-win .bar .ico{color:${PG.win};font-size:13px}
.pg-win .bar .warn{margin-left:auto;font:600 10.5px ${MONO};letter-spacing:.04em;color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:3px 7px}
.pg-win .bd{padding:14px 16px;font-size:14px;line-height:1.5}
.pg-win .bd h4{margin:0 0 10px;font-size:16px}
.pg-chk{display:grid;gap:6px;margin:4px 0}
.pg-chk div{display:flex;gap:10px;align-items:center;padding:6px 10px;border:1px solid ${T.line};border-radius:8px;font-size:14px}
.pg-chk div.off{color:${T.ink3};text-decoration:line-through}
.pg-chk div b{font-family:${MONO};font-size:13px;min-width:18px}
.pg-field{display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center;margin:6px 0;font-size:14px}
.pg-field span:last-child{font:13px ${MONO};border:1px solid #BFC6D1;border-radius:6px;padding:6px 10px;background:#fff}
.pg-btn{display:inline-block;margin-top:10px;padding:8px 18px;border-radius:6px;background:${PG.win};color:#fff;font-weight:700;font-size:14px}
.pg-win.mac .pg-btn{background:#1E6FD9}
.pg-mt{border:1.5px solid var(--c);border-radius:12px;overflow:hidden;background:${T.paper}}
.pg-mt .nm{font:700 12px/1 ${MONO};color:#fff;background:var(--c);padding:7px 10px;letter-spacing:.04em}
.pg-mt table{width:100%;border-collapse:collapse;font:12.5px ${MONO}}
.pg-mt th,.pg-mt td{padding:5px 10px;border-bottom:1px solid ${T.line};text-align:left;transition:background .3s}
.pg-mt th{color:${T.ink3};font-weight:600}
.pg-mt th.hl{color:${T.accent};background:#FFF0EB}
.pg-mt td.hlc{background:#FFF7F3;color:${T.accent};font-weight:700}
.pg-mt tr.hl td{background:#FFF0EB}
.pg-mt tr.dim td{opacity:.4}
.pg-doc{margin:0;font:12.5px/1.5 ${MONO};white-space:pre-wrap;word-break:break-word;color:#0B5A33;background:#E9F7EF;border:1.5px solid ${PG.mongo};border-radius:10px;padding:10px 12px}
.pg-doc.odd{color:#7A4B00;background:#FFF6E2;border-color:#E3B341}
.pg-doc.er{color:#8A1C1C;background:#FDECEC;border-color:#F3A6A6}
.pg-dict{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px}
.pg-dict td{padding:8px 12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};transition:opacity .3s,background .3s}
.pg-dict td:first-child{border-left:4px solid ${PG.mongo};border-radius:10px 0 0 10px}
.pg-dict td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.pg-dict td:nth-child(2){color:${T.ink3};width:28px;text-align:center}
.pg-dict td:nth-child(3){border-left:0}
.pg-dict tr.hl td{background:#FFF7F3}
.pg-dict tr.hl td:first-child{border-left-color:${T.accent}}
.pg-dict tr.dim td{opacity:.4}
.pg-dict code{font:12.5px ${MONO};background:#EEF0F4;padding:1px 6px;border-radius:5px}
.pg-dict th{font:600 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;text-align:left;padding:0 12px 4px}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1000px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1000px){.pg-three{grid-template-columns:1fr}}
.pg-lab{font:700 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;color:${T.ink3};margin:0 0 6px;display:flex;gap:8px;align-items:center}
.pg-lab .tm{color:${T.accent}}
.pg-wait{display:inline-flex;gap:8px;align-items:center;font:600 13px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:8px;padding:6px 10px;animation:mk-pulse 1.6s ease-in-out infinite}
.pg-row{display:flex;gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper};font:13px ${MONO}}
.pg-row .v{margin-left:auto;font-weight:800;font-size:18px}
.pg-row .v.z{color:${T.accent}}
.pg-cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pg-cmp .mk-card h5{display:flex;gap:8px;align-items:center}
.pg-cmp .mk-card h5 i{width:10px;height:10px;border-radius:50%;display:inline-block}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1000px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
.pg-pm{background:${T.paper};border:1px solid #D8DDE5;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.pg-pm.hl{border-color:${T.accent};box-shadow:0 0 0 4px rgba(226,69,31,.14)}
.pg-pm .top{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F7F8FA;border-bottom:1px solid #E6E9EE;font:12.5px ${MONO}}
.pg-pm .lg{font:700 11px ${SANS};color:${PG.post};letter-spacing:.04em}
.pg-pm .m{font:700 11px ${MONO};color:#fff;border-radius:5px;padding:3px 7px}
.pg-pm .u{color:${T.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pg-pm .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.06em;text-transform:uppercase}
.pg-pm .b{margin:0;padding:8px 12px;font:12px/1.45 ${MONO};color:${T.ink2};border-bottom:1px dashed #E6E9EE;white-space:pre-wrap}
.pg-pm .r{display:flex;gap:10px;align-items:flex-start;padding:8px 12px}
.pg-pm .r pre{margin:0;font:12px/1.45 ${MONO};white-space:pre-wrap;word-break:break-word;color:${T.ink}}
.pg-pm .st{font:700 12px ${MONO};border-radius:6px;padding:3px 8px;flex:0 0 auto}
.pg-pm .st.s2{background:#E3F5EC;color:${T.green}}.pg-pm .st.s4{background:#FFF6E2;color:${T.yellow}}.pg-pm .st.s5{background:#FDECEC;color:#B91C1C}
/* F-1102-21 · 2-ekran CRUD jadvali (ustunlar galma-gal ochiladi) */
.pg-crud{width:100%;border-collapse:separate;border-spacing:0 8px;font-size:15px}
.pg-crud th{font:700 11px/1 ${MONO};letter-spacing:.08em;text-transform:uppercase;color:${T.ink3};text-align:left;padding:0 12px 2px}
.pg-crud th.sql{color:${PG.pg}}.pg-crud th.ex{color:${T.green}}
.pg-crud td{padding:12px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};transition:opacity .35s}
.pg-crud td:first-child{border-left:4px solid ${T.accent};border-radius:10px 0 0 10px;font-weight:800}
.pg-crud td:last-child{border-right:1px solid ${T.line};border-radius:0 10px 10px 0}
.pg-crud td.off>*{opacity:0}
.pg-crud code{font:13px ${MONO};background:#EEF0F4;padding:2px 7px;border-radius:5px}
.pg-crud td.sql code{background:#E8F0F8;color:${PG.pg}}.pg-crud td.ex code{background:#E3F5EC;color:${T.green}}
.pg-crud th.mg{color:${PG.mongo}}.pg-crud td.mg code{background:#E9F7EF;color:#0B5A33}
/* v2 (03.11): Mongoose bloki, fayl sahifasi (ctid), uch holat, Pool chizmasi, karta qatori */
.pg-mg{margin:0;font:12px/1.55 ${MONO};color:${T.ink2};background:#F1F8F4;border:1px dashed ${PG.mongo};border-radius:10px;padding:8px 12px;white-space:pre-wrap}
.pg-mg b{color:${PG.mongo}}
.pg-page{background:${T.paper};border:1px solid ${T.line};border-radius:12px;padding:12px 14px}
.pg-page .slots{display:grid;gap:6px}
.pg-page .slot{display:flex;gap:10px;align-items:center;padding:6px 10px;border:1px solid ${T.line};border-radius:8px;font:13px ${MONO};transition:background .3s,border-color .3s}
.pg-page .slot b{min-width:44px;color:${T.ink3};font-weight:600}
.pg-page .slot.old span{text-decoration:line-through;color:${T.ink3}}
.pg-page .slot.gone{border-style:dashed;color:${T.ink3}}
.pg-page .slot.now{border-color:${PG.pg};background:#E8F0F8;font-weight:700}
.pg-page .slot.hl{border-color:${T.accent};background:#FFF0EB}
.pg-states{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.pg-states .mk-box code{font:700 14px ${MONO};background:transparent;padding:0}
.pg-pool{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:center}
.pg-pool .ar{font:700 18px ${MONO};color:${T.ink3};text-align:center}
.pg-cards3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-cards3,.pg-states{grid-template-columns:1fr}}
.pg-rules{display:grid;gap:6px;font:13px ${MONO}}
.pg-rules div{display:flex;gap:10px;padding:6px 10px;border:1px solid ${T.line};border-radius:8px;background:${T.paper};transition:background .3s}
.pg-rules div.on{background:#E3F5EC;border-color:${T.green}}
.pg-rules div.new{animation:mk-up .4s ease both}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-pg2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-pg2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  v2 yordamchilar: amaliyot MD'dan (mkPractice), tekshiruv (MC) qolipi — M42: above/after/demak
// ============================================================
const mkPractice = (n, hls, extra = {}) => {
  const m = MDT[n]; const pr = m.proof;
  return {
    S: mkS(n, hls.map((hl) => ({ hl })), { tableAt: 3 }), steps: m.steps, trouble: m.trouble,
    proof: { label: pr.label, placeholder: pr.placeholder, check: (v) => new RegExp(pr.re, pr.flags).test(v), wrong: pr.wrong }, ...extra,
  };
};
// Qadam-baqadam terminal: faqat shu qadamgacha kelgan qatorlar (yashirin qatorlar bo'sh qora joy egallamasin — F-1103-08 sinfi)
const upto = (lines, beat) => lines.filter((l) => l.at == null || l.at <= beat);
const Demak = (n) => <span dangerouslySetInnerHTML={html(MDT[n].demak)} />;
function MC(p, n, more) {
  const m = MDT[n];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong} demak={Demak(n)} {...more} />;
}
const PCOLS = ['id', 'name', 'price', 'stock'];

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['CRUD terminalida', 'Tranzaksiya: xavfsiz sinash va atomik ish', "Baza qo'riqlaydi", "Express'dan bazaga", 'Buzamiz va tuzatamiz', 'AI yozgan SQL', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [6] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — so'rov bazagacha va qaytib (CrudMachine, 04b-mashina.jsx); reja pastda
const S1M = [
  { path: 'both', back: 'rows[0] → res.status(201).json', st: 201, newRow: 3, ro: ['server.js:36', "<span class=\"n1-s\">'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *'</span>,"] },
  { path: 'psql', on: ['psql', 'shop'], ro: ['psql · shop', 'UPDATE products SET price = 99000 WHERE id = 1; <span class="n1-ok">→ UPDATE 1</span>'] },
  { path: 'api', on: ['pm', 'json', 'route', 'pool', 'cars'], back: 'rows[0] → res.status(201).json', st: 201, newRow: 3, ro: ['server.js:36', "<span class=\"n1-s\">'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *'</span>,"] },
  { path: 'both', back: 'rows[0] → res.status(201).json', st: 201, newRow: 3 },
];
const CARS1 = [...CARS0, ['4', 'Chevrolet Spark', '190000']];
const PRODS1 = [['1', 'Klaviatura', '99000'], ['2', 'Sichqoncha', '75000']];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <CrudMachine {...m} cars={CARS1} prods={PRODS1} res='{"id":4,"model":"Chevrolet Spark",…}' req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }' }}
      tag={t("Bugungi darsning rasmi — bitta baza, ikki yo'l: terminal va Express", 'Картина урока — одна база, два пути: терминал и Express')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · CRUD: to'rt amal — to'rt buyruq — to'rt endpoint (M39, galma-gal; M45: siz bilgan Mongoose ustuni)
//  Haqiqiy: v2b-01 (INSERT 0 4 · 4 rows · UPDATE 1 · DELETE 1) · v2d-mongoose (matchedCount 1 · deletedCount 1) · 11-crud-sorovlar (201/200)
// ============================================================
const CRUD = [
  ['C', 'Create', 'yaratish', 'INSERT', 'INSERT 0 4', 'Product.create(…)', 'POST /api/cars', '201'],
  ['R', 'Read', "o'qish", 'SELECT', '(4 rows)', 'Product.find(…)', 'GET /api/cars', '200'],
  ['U', 'Update', "o'zgartirish", 'UPDATE', 'UPDATE 1', 'Product.updateOne(…) → matchedCount: 1', 'PUT /api/cars/2', '200'],
  ['D', 'Delete', "o'chirish", 'DELETE', 'DELETE 1', 'Product.deleteOne(…) → deletedCount: 1', 'DELETE /api/cars/1', '200'],
];
const S2 = mkS(2, [{ sql: false, mg: false, ex: false }, { sql: true, mg: true, ex: false }, { sql: true, mg: true, ex: true }, { sql: true, mg: true, ex: true, rule: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: '6px 12px' }}>
      <table className="pg-crud"><thead><tr>
        <th>CRUD</th><th>{t("ma'nosi", "смысл")}</th>
        <th className="sql">PostgreSQL</th><th className="sql">{t("baza javobi", "ответ базы")}</th>
        <th className="mg">{t("siz bilgan Mongoose", "знакомый вам Mongoose")}</th>
        <th className="ex">Express</th><th className="ex">status</th>
      </tr></thead><tbody>
        {CRUD.map(([l, en, uz, q, ans, mg, ep, st]) => <tr key={l}>
          <td><span style={{ color: T.accent, fontSize: 20 }}>{l}</span><span style={{ fontWeight: 600, color: T.ink2 }}>{en.slice(1)}</span></td>
          <td>{uz}</td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{q}</code></td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{ans}</code></td>
          <td className={`mg${seg.mg ? '' : ' off'}`} style={{ opacity: seg.mg ? 0.8 : 1 }}><code>{mg}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{ep}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{st}</code></td>
        </tr>)}
      </tbody></table>
    </div>
    <Block at={3} beat={beat}><div className="mk-rule">{t("Bitta amal — bazada ", "Одно действие — в базе ")}<b>{t("bitta SQL buyruq", "одна SQL-команда")}</b>{t(", serverda ", ", на сервере ")}<b>{t("bitta endpoint", "один endpoint")}</b>{t(". Avval terminalda qo'lda va ichini ko'ramiz, keyin Express ichida.", ". Сначала вручную в терминале и смотрим внутрь, потом внутри Express.")}</div></Block>
  </div>} />;
}

// ============================================================
//  3 · shop bazasi: CREATE DATABASE → \c → jadval → INSERT (v2c-baza, v2b-01; Mongoose — v2d)
// ============================================================
const T3 = psql(String.raw`
postgres=# CREATE DATABASE shop;
CREATE DATABASE
postgres=# \c shop
You are now connected to database "shop" as user "postgres".
shop=# CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
CREATE TABLE
shop=# INSERT INTO products (name, price, stock) VALUES
shop-#   ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15),
shop-#   ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);
INSERT 0 4
shop=# SELECT * FROM products;
 id |    name    | price  | stock
----+------------+--------+-------
  1 | Klaviatura | 120000 |     8
  2 | Sichqoncha |  75000 |    15
  3 | Quloqchin  |  95000 |     5
  4 | Kolonka    |  50000 |    10
(4 rows)`, mergeMeta(rng(1, 6, { at: 0 }), rng(7, 10, { at: 1 }), rng(11, 18, { at: 2 }), { 1: { id: 'db' }, 3: { id: 'db' }, 5: { id: 'ddl' }, 10: { id: 'n' }, 11: { id: 'sel' } }));
const MG3 = `await mongoose.connect('mongodb://localhost/shop')
bazalar: admin · config · local          (shop hali yo'q)
await Product.create([ …4 ta… ])         → 4 ta hujjat
bazalar: admin · config · local · shop`;
const S3 = mkS(3, [{ focus: ['db', 'ddl'], v: 'mg' }, { focus: ['n'], v: 'pair' }, { focus: ['sel'], v: 'sel' }, { focus: ['ddl'], v: 'warn' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <>
    <Psql title="psql" lines={seg.v === 'warn' ? T3.filter((l) => l.at === 1) : upto(T3, beat)} beat={beat} focus={seg.focus} />
    {/* F-1120-02 (M51): xulosada ogohlantirish kartasi o'rniga darsning rasmi — psql to'g'ridan-to'g'ri shop.products ga, qoidasiz jadval */}
    {seg.v === 'warn' && <div className="mk-light" style={{ padding: 12 }}><CrudMachine path="psql" on={['psql', 'shop']} prods={[['1', 'Klaviatura', '120000', '8'], ['2', 'Sichqoncha', '75000', '15'], ['3', 'Quloqchin', '95000', '5'], ['4', 'Kolonka', '50000', '10']]} pcols="id · name · price · stock" psqlLine={['shop=#', 'SELECT * FROM products;', '(4 rows)']} max={1} tag={t("Jadval tayyor — lekin hech qanday qoida yo'q: baza faqat yozilgan qoidani qo'riqlaydi", 'Таблица готова — но правил нет: база охраняет только записанное правило')} /></div>}
    {seg.v !== 'warn' && <div className="pg-two">
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("products — ustun va turi", "products — колонки и тип")}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.7 }}><code>id</code>{t(" SERIAL PRIMARY KEY — o'zi o'sadi · ", " SERIAL PRIMARY KEY — растёт сам · ")}<code>name</code> TEXT · <code>price</code> INTEGER · <code>stock</code> INTEGER<div style={{ color: T.ink3, fontSize: 12.5 }}>{t("hozircha hech qanday qoida yo'q — ataylab", "пока никаких правил — нарочно")}</div></div></div>
      <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        {seg.v === 'mg' && <pre className="pg-mg">{t(<><b>Mongoose'da</b> (siz bilgan):</>, <><b>В Mongoose</b> (знакомое вам):</>)}{'\n'}{t(MG3, RS('MG3'))}</pre>}
        {seg.v === 'pair' && <Pair code="await Product.create([ …4 ta… ])" res={t("4 ta hujjat", "4 документа")} />}
        {seg.v === 'warn' && <div className="n2-warn">{t("Bu jadvalda hozircha ", "В этой таблице пока ")}<b>{t("NOT NULL ham, boshqa qoida ham yo'q", "нет ни NOT NULL, ни другого правила")}</b>{t(" — baza faqat yozilgan qoidani qo'riqlaydi. 3-bosqichda ko'rasiz.", " — база охраняет только записанное правило. Увидите на 3-м этапе.")}</div>}
      </div>
    </div>}
  </>} />;
}

// ============================================================
//  4 · SELECT va WHERE (v2b-01)
// ============================================================
const PRODUCTS0 = [['1', 'Klaviatura', '120000', '8'], ['2', 'Sichqoncha', '75000', '15'], ['3', 'Quloqchin', '95000', '5'], ['4', 'Kolonka', '50000', '10']];
const T4a = psql(String.raw`
shop=# SELECT name, price FROM products;
    name    | price
------------+--------
 Klaviatura | 120000
 Sichqoncha |  75000
 Quloqchin  |  95000
 Kolonka    |  50000
(4 rows)`);
const T4b = psql(String.raw`
shop=# SELECT * FROM products WHERE price < 100000;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  3 | Quloqchin  | 95000 |     5
  4 | Kolonka    | 50000 |    10
(3 rows)`, { 1: { id: 'w' } });
const T4c = psql(String.raw`
shop=# SELECT * FROM products WHERE stock < 6;
 id |   name    | price | stock
----+-----------+-------+-------
  3 | Quloqchin | 95000 |     5
(1 row)`, { 1: { id: 'w' } });
const S4 = mkS(4, [{ v: 'a', rows: [] }, { v: 'b', rows: [1, 2, 3] }, { v: 'c', rows: [2] }, { v: 'c', rows: [] }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => <>
    <MiniTable name="products" cols={PCOLS} rows={PRODUCTS0} hlRow={seg.rows} dimRow={seg.rows.length ? [0, 1, 2, 3].filter((i) => !seg.rows.includes(i)) : []} hlCol={seg.v === 'b' ? [2] : seg.v === 'c' && beat === 2 ? [3] : []} />
    {seg.v === 'a' && <Psql title="psql — shop" lines={T4a} />}
    {seg.v === 'b' && <><Psql title="psql — shop" lines={T4b} focus={['w']} /><Pair code="await Product.find({ price: { $lt: 100000 } })" res={t("3 ta hujjat", "3 документа")} /></>}
    {seg.v === 'c' && <Psql title="psql — shop" lines={T4c} focus={beat === 2 ? ['w'] : []} />}
    <Block at={3} beat={beat}><div className="mk-rule"><b>SELECT</b>{t(" faqat o'qiydi · ", " только читает · ")}<b>WHERE</b>{t(" qatorlarni tanlaydi — UPDATE va DELETE'da ham aynan shu WHERE ishlaydi", " выбирает строки — в UPDATE и DELETE работает тот же WHERE")}</div></Block>
  </>} />;
}

// ============================================================
//  5 · UPDATE, DELETE va javobdagi son; RETURNING (v2b-01, uzluksiz holat)
// ============================================================
const T5 = psql(String.raw`
shop=# UPDATE products SET price = 99000 WHERE id = 1;
UPDATE 1
shop=# DELETE FROM products WHERE id = 3;
DELETE 1
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0
shop=# DELETE FROM products WHERE id = 99;
DELETE 0
shop=# UPDATE products SET stock = stock - 1 WHERE id = 1 RETURNING id, name, stock;
 id |    name    | stock
----+------------+-------
  1 | Klaviatura |     7
(1 row)
UPDATE 1`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 4, { at: 1 }), rng(5, 8, { at: 2 }), rng(9, 14, { at: 3 }), { 2: { id: 'u' }, 4: { id: 'd' }, 6: { id: 'z' }, 8: { id: 'z' }, 9: { id: 'r' }, 12: { id: 'r' } }));
const S5 = mkS(5, [{ focus: ['u'] }, { focus: ['d'] }, { focus: ['z'] }, { focus: ['r'] }, { focus: ['u', 'd', 'z'] }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={upto(T5, beat)} beat={beat} focus={seg.focus} />
    <div style={{ display: 'grid', gap: 6 }}>
      <Block at={0} beat={beat}><Pair code="await Product.updateOne({ _id: 1 }, { price: 99000 })" res="matchedCount: 1, modifiedCount: 1" /></Block>
      <Block at={1} beat={beat}><Pair code="await Product.deleteOne({ _id: 3 })" res="deletedCount: 1" /></Block>
      <Block at={2} beat={beat}><Pair code="await Product.updateOne({ _id: 99 }, { price: 1 })" res="matchedCount: 0" /></Block>
    </div>
    <Block at={4} beat={beat}><div className="mk-rule">{t("Javobdagi son: ", "Число в ответе: ")}<b>1</b>{t(" — kutganingiz · ", " — ожидаемое · ")}<b>0</b>{t(" — WHERE hech narsaga mos kelmadi (xato emas) · ", " — WHERE ни к чему не подошёл (не ошибка) · ")}<b>{t("kutilmagan katta son", "неожиданно большое число")}</b>{t(" — WHERE noto'g'ri yoki yo'q", " — WHERE неверный или его нет")}</div></Block>
  </>} />;
}

// ============================================================
//  6 · Nega Klaviatura oxiriga tushdi — qator tartibi, ctid, ORDER BY (v2b-01: ikki UPDATE → ikki yangi nusxa → (0,6))
// ============================================================
const T6 = psql(String.raw`
shop=# SELECT * FROM products;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     7
(3 rows)
shop=# SELECT ctid, id, name, price FROM products;
 ctid  | id |    name    | price
-------+----+------------+-------
 (0,2) |  2 | Sichqoncha | 75000
 (0,4) |  4 | Kolonka    | 50000
 (0,6) |  1 | Klaviatura | 99000
(3 rows)
shop=# SELECT * FROM products ORDER BY id;
 id |    name    | price | stock
----+------------+-------+-------
  1 | Klaviatura | 99000 |     7
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
(3 rows)`, mergeMeta(rng(1, 7, { at: 0 }), rng(8, 14, { at: 2 }), rng(15, 21, { at: 3 }), { 6: { id: 'kl' }, 13: { id: 'ct' }, 15: { id: 'ob' }, 18: { id: 'ob' } }));
// Fayl sahifasi 0 — qatorlarning joyi (ctid): eski nusxalar chizilgan, o'chirilgan joy bo'sh, hozirgisi ko'k
const PAGE6 = [['1', 'Klaviatura · 120000 · 8 — birinchi nusxa', 'old'], ['2', 'Sichqoncha · 75000 · 15', ''], ['3', "Quloqchin — o'chirilgan (5-ekran)", 'gone'], ['4', 'Kolonka · 50000 · 10', ''], ['5', 'Klaviatura · 99000 · 8 — narx o\'zgarganda yozilgan nusxa', 'old'], ['6', 'Klaviatura · 99000 · 7 — hozirgi qator', 'now']];
function FilePage({ hl = [] }) {
  return <div className="pg-page"><div className="pg-lab">{t("Fayl sahifasi 0 — har qatorning joyi (ctid)", "Страница файла 0 — место каждой строки (ctid)")}</div>
    <div className="slots">{PAGE6.map(([n, txt, k]) => <div key={n} className={`slot ${k}${hl.includes(n) ? ' hl' : ''}`}><b>(0,{n})</b><span>{txt}</span></div>)}</div></div>;
}
const S6 = mkS(6, [{ focus: ['kl'], page: null }, { focus: ['kl'], page: ['1', '5', '6'] }, { focus: ['ct'], page: ['6'] }, { focus: ['ob'], page: null, sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={cur(T6, beat)} beat={beat} focus={seg.focus} />
    {seg.page && <FilePage hl={seg.page} />}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — psql → shop.products, ORDER BY id bilan (T6) */}
    {seg.sum && <div className="mk-light" style={{ padding: 12 }}><CrudMachine path="psql" on={['psql', 'shop']} prods={[['1', 'Klaviatura', '99000', '7'], ['2', 'Sichqoncha', '75000', '15'], ['4', 'Kolonka', '50000', '10']]} pcols="id · name · price · stock" psqlLine={['shop=#', 'SELECT * FROM products ORDER BY id;', '(3 rows)']} max={1} tag={t("ORDER BY yozilmasa — fayldagi tartib; tartib kerak bo'lsa — ORDER BY id", 'Без ORDER BY — порядок файла; нужен порядок — ORDER BY id')} /></div>}
  </>} />;
}

// ============================================================
//  7 · Tekshiruv 1 — UPDATE 0 (M42: material savoldan oldin, isbot keyin, Demak)
// ============================================================
const T7_ABOVE = psql(String.raw`
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0`);
const T7_AFTER = psql(String.raw`
shop=# SELECT * FROM products WHERE id = 99;
 id | name | price | stock
----+------+-------+-------
(0 rows)`);
function Screen7(p) { return MC(p, 7, { above: <Psql title="psql — shop" lines={T7_ABOVE} />, after: <Psql title={t("psql — shop · tekshirib ko'rdik", "psql — shop · проверили")} lines={T7_AFTER} /> }); }

// ============================================================
//  8 · Amaliyot 1 — do'konni o'zingiz boshqaring (qadamlar, isbot, jadval — MD'dan)
// ============================================================
const P8 = mkPractice(8, [[], [0, 1, 2], [3], []]);
function ScreenP8(p) { return <Practice p={p} S={P8.S} steps={P8.steps} trouble={P8.trouble} proof={P8.proof} />; }

// ============================================================
//  9 · WHERE'siz — hamma qator; BEGIN … ROLLBACK (v2b-02) · Mongo'dan kelganlar tuzog'i (v2d)
// ============================================================
const T9 = psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET price = 99000;
UPDATE 3
shop=*# SELECT * FROM products;
  2 | Sichqoncha | 99000 |    15
  4 | Kolonka    | 99000 |    10
  1 | Klaviatura | 99000 |     7
shop=*# DELETE FROM products;
DELETE 3
shop=*# SELECT * FROM products;
(0 rows)
shop=*# ROLLBACK;
ROLLBACK
shop=# SELECT * FROM products;
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     7`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 8, { at: 1 }), rng(9, 12, { at: 2 }), rng(13, 18, { at: 3 }), { 1: { id: 'b' }, 4: { id: 'u' }, 10: { id: 'd' }, 12: { id: 'd' }, 14: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'r' }, 18: { id: 'r' } }));
const ROWS9 = { ok: [['2', 'Sichqoncha', '75000', '15'], ['4', 'Kolonka', '50000', '10'], ['1', 'Klaviatura', '99000', '7']], up: [['2', 'Sichqoncha', '99000', '15'], ['4', 'Kolonka', '99000', '10'], ['1', 'Klaviatura', '99000', '7']], del: [] };
const S9 = mkS(9, [{ focus: ['b'], st: 'ok' }, { focus: ['u'], st: 'up' }, { focus: ['d'], st: 'del' }, { focus: ['r'], st: 'ok' }, { focus: [], st: 'ok' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={cur(T9, beat)} beat={beat} focus={seg.focus} />
    <div className="pg-two">
      <MiniTable name={seg.st === 'ok' ? 'products' : t('products · tranzaksiya ichida', "products · внутри транзакции")} cols={PCOLS} rows={ROWS9[seg.st]} hlCol={seg.st === 'up' ? [2] : []} color={seg.st === 'ok' ? PG.pg : T.accent} />
      <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
        {seg.st === 'del' && <div className="n2-warn"><b>(0 rows)</b>{t(" — butun katalog yo'q. Tranzaksiya hali ochiq.", " — всего каталога нет. Транзакция ещё открыта.")}</div>}
        <Block at={1} beat={beat}><div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Mongo'dan kelganlar aynan shu yerda xato qiladi", "Пришедшие из Mongo ошибаются именно здесь")}</h5>
          <div style={{ fontSize: 13.5, lineHeight: 1.55 }}><b style={{ color: PG.mongo }}>{t("Mongoose'da:", "В Mongoose:")}</b> <code>await Product.updateOne({'{}'}, {'{ price: 99000 }'})</code> → <b>matchedCount: 1</b>{t(" — shartsiz ham ", " — даже без условия ")}<b>{t("bitta", "один")}</b>{t(" hujjat; hammasi uchun alohida ", " документ; для всех — отдельно ")}<code>updateMany({'{}'}, …)</code> → matchedCount: 3</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 6 }}><b style={{ color: PG.pg }}>{t("PostgreSQL'da:", "В PostgreSQL:")}</b> {t(<><code>WHERE</code>'siz <code>UPDATE</code> — <b>hammasi</b></>, <><code>UPDATE</code> без <code>WHERE</code> — <b>все строки</b></>)}{t(". Alohida «many» yo'q.", ". Отдельного «many» нет.")}</div></div></Block>
        <Block at={4} beat={beat}><div className="mk-rule">{t(<>Xavfli UPDATE/DELETE — avval <code>BEGIN</code> ichida · <code>SELECT</code> bilan ko'ring · to'g'ri bo'lsa <code>COMMIT</code>, noto'g'ri bo'lsa <code>ROLLBACK</code></>, <>Опасный UPDATE/DELETE — сначала внутри <code>BEGIN</code> · проверьте через <code>SELECT</code> · если верно — <code>COMMIT</code>, если нет — <code>ROLLBACK</code></>)}</div></Block>
      </div>
    </div>
  </>} />;
}

// ============================================================
//  10 · Tranzaksiya ichida nima bo'ladi — IKKI HAQIQIY psql seansi (v2e-ikki-seans, GATE M 2C), uch holat
// ============================================================
const A10 = {
  a: psql(String.raw`
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 99000`),
  b: psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET price = 89000 WHERE id = 1;
UPDATE 1
shop=*# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 89000
shop=*# COMMIT;
COMMIT`, { 3: { id: 'u' }, 6: { id: 'u' } }),
  c: psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# SELECT 1/0;
ERROR:  division by zero
shop=!# SELECT name FROM products WHERE id = 1;
ERROR:  current transaction is aborted, commands ignored until end of transaction block
shop=!# COMMIT;
ROLLBACK`, { 5: { id: 'x' }, 7: { id: 'x' }, 8: { id: 'x' } }),
};
const B10 = {
  a: psql(String.raw`
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 99000`),
  b: psql(String.raw`
-- A hali COMMIT qilmagan:
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 99000
-- A COMMIT qilgandan keyin:
shop=# SELECT name, price FROM products WHERE id = 1;
 Klaviatura | 89000`, { 3: { id: 'o' }, 6: { id: 'n' } }),
};
const STATES10 = [['shop=#', 'oddiy — har buyruq darhol saqlanadi (autocommit)'], ['shop=*#', "tranzaksiya ochiq — o'zgarish faqat shu seansda"], ['shop=!#', 'xato bo\'ldi (aborted) — faqat ROLLBACK']];
// F-1109-06: xulosa — uch alohida prompt kartasi o'rniga bitta holat sxemasi (BEGIN, xato, COMMIT, ROLLBACK strelka bilan)
function States10() {
  return <div className="z">
    <div className="p2-vs-card">
      <svg viewBox="0 0 780 300" role="img" aria-label="psql prompt: BEGIN, xato, COMMIT, ROLLBACK">
        <defs>
          <marker id="p2vsA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#374151" /></marker>
          <marker id="p2vsR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#E2451F" /></marker>
          <marker id="p2vsG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#15803D" /></marker>
        </defs>
        <rect x="20" y="20" width="200" height="88" rx="10" fill="#111827" stroke="#15803D" strokeWidth="3" />
        <text x="120" y="58" textAnchor="middle" className="nd" fill="#86EFAC">shop=#</text>
        <text x="120" y="88" textAnchor="middle" className="in">{t("har buyruq darhol saqlanadi", "каждая команда сразу сохраняется")}</text>
        <rect x="290" y="20" width="200" height="88" rx="10" fill="#111827" stroke="#336791" strokeWidth="3" />
        <text x="390" y="58" textAnchor="middle" className="nd" fill="#93C5FD">shop=*#</text>
        <text x="390" y="88" textAnchor="middle" className="in">{t("o'zgarish faqat shu seansda", "изменение только в этом сеансе")}</text>
        <rect x="560" y="20" width="200" height="88" rx="10" fill="#111827" stroke="#E2451F" strokeWidth="3" />
        <text x="660" y="58" textAnchor="middle" className="nd" fill="#FCA5A5">shop=!#</text>
        <text x="660" y="88" textAnchor="middle" className="in">{t("xato — buyruqlar rad etiladi", "ошибка — команды отклоняются")}</text>
        <line x1="223" y1="64" x2="285" y2="64" stroke="#374151" strokeWidth="2.5" markerEnd="url(#p2vsA)" />
        <text x="254" y="52" textAnchor="middle" className="lb" fill="#374151">BEGIN</text>
        <line x1="493" y1="64" x2="555" y2="64" stroke="#E2451F" strokeWidth="2.5" markerEnd="url(#p2vsR)" />
        <text x="524" y="52" textAnchor="middle" className="lb" fill="#E2451F">{t("xato", "ошибка")}</text>
        <path d="M360 110 V160 H150 V114" fill="none" stroke="#15803D" strokeWidth="2.5" markerEnd="url(#p2vsG)" />
        <rect x="172" y="150" width="167" height="21" rx="4" fill="#fff" /><text x="255" y="165" textAnchor="middle" className="lb" fill="#15803D">{t("COMMIT · saqlanadi", "COMMIT · сохраняется")}</text>
        <path d="M420 110 V212 H110 V114" fill="none" stroke="#374151" strokeWidth="2.5" strokeDasharray="7 5" markerEnd="url(#p2vsA)" />
        <rect x="190" y="202" width="150" height="21" rx="4" fill="#fff" /><text x="265" y="217" textAnchor="middle" className="lb" fill="#374151">{t("ROLLBACK · bekor", "ROLLBACK · отмена")}</text>
        <path d="M660 110 V264 H70 V114" fill="none" stroke="#E2451F" strokeWidth="2.5" strokeDasharray="7 5" markerEnd="url(#p2vsR)" />
        <rect x="141" y="254" width="448" height="21" rx="4" fill="#fff" /><text x="365" y="269" textAnchor="middle" className="lb" fill="#E2451F">{t("faqat ROLLBACK · COMMIT yozsangiz ham bekor bo'ladi", "только ROLLBACK · даже COMMIT станет отменой")}</text>
      </svg>
    </div>
    <div className="z-rule"><code>!#</code>{t(" ko'rsangiz — ", " видите — ")}<b>{t("boshqa buyruq yozmang, ROLLBACK", "не пишите других команд, ROLLBACK")}</b></div>
  </div>;
}
const S10 = mkS(10, [{ v: 'a', st: [0] }, { v: 'b', st: [1] }, { v: 'c', st: [2] }, { v: 'sum', st: [0, 1, 2] }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v !== 'sum' && <div className="pg-two">
      <div><div className="pg-lab">{t("A oynasi", "Окно A")}</div><Psql title="psql — shop · A" lines={A10[seg.v]} focus={seg.v === 'b' ? ['u'] : seg.v === 'c' ? ['x'] : []} /></div>
      <div><div className="pg-lab">{t("B oynasi", "Окно B")}</div>{B10[seg.v] ? <Psql title="psql — shop · B" lines={B10[seg.v]} focus={seg.v === 'b' ? ['o', 'n'] : []} /> : <div className="mk-card" style={{ color: T.ink3, fontSize: 14 }}>{t("B oynasi bu holatda hech narsa yozmaydi — xato faqat A seansida.", "Окно B в этом состоянии ничего не пишет — ошибка только в сеансе A.")}</div>}</div>
    </div>}
    {seg.v !== 'sum' && <div className="pg-states">{STATES10.map(([pr, d], i) => <div key={pr} className={`mk-box${seg.st.includes(i) ? ' hl' : ''}`} style={{ '--c': [T.green, PG.pg, T.accent][i], opacity: seg.st.includes(i) ? 1 : 0.4 }}><h4><code>{pr}</code></h4><p>{d}</p></div>)}</div>}
    {seg.v === 'sum' && <States10 />}
  </>} />;
}

// ============================================================
//  11 · Ikki jadval, bitta ish: orders, CHECK, atomik (v2b-04)
// ============================================================
const T11 = {
  a: psql(String.raw`
shop=# ALTER TABLE products ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
ALTER TABLE
shop=# CREATE TABLE orders (id SERIAL PRIMARY KEY,
shop(#   product_id INTEGER NOT NULL REFERENCES products(id),
shop(#   qty INTEGER NOT NULL CHECK (qty > 0),
shop(#   created_at TIMESTAMP DEFAULT now());
CREATE TABLE`, { 1: { id: 'c' }, 3: { id: 'o' }, 4: { id: 'o' }, 5: { id: 'o' }, 6: { id: 'o' } }),
  b: psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET stock = stock - 1 WHERE id = 2 RETURNING name, stock;
 Sichqoncha |    14
shop=*# INSERT INTO orders (product_id, qty) VALUES (2, 1) RETURNING *;
  1 |          2 |   1 | 2026-11-03 14:32:57
shop=*# COMMIT;
COMMIT`, { 4: { id: 'r' }, 6: { id: 'r' } }),
  c: psql(String.raw`
shop=# BEGIN;
shop=*# INSERT INTO orders (product_id, qty) VALUES (4, 12) RETURNING id, product_id, qty;
  2 |          4 |  12
shop=*# UPDATE products SET stock = stock - 12 WHERE id = 4;
ERROR:  new row for relation "products" violates check constraint "stock_nonneg"
DETAIL:  Failing row contains (4, Kolonka, 50000, -2).
shop=!# ROLLBACK;
ROLLBACK
shop=# SELECT * FROM orders;
  1 |          2 |   1 | 2026-11-03 14:32:57
(1 row)`, { 5: { id: 'x' }, 6: { id: 'x' }, 10: { id: 'k' } }),
};
const PROD11 = { a: [['1', 'Klaviatura', '7'], ['2', 'Sichqoncha', '15'], ['4', 'Kolonka', '10']], b: [['1', 'Klaviatura', '7'], ['2', 'Sichqoncha', '14'], ['4', 'Kolonka', '10']] };
const ORD11 = [['1', '2', '1', '14:32:57']];
const S11 = mkS(11, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'sum' }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <>
    {seg.v !== 'sum' && <Psql title="psql — shop" lines={T11[seg.v]} focus={seg.v === 'a' ? ['c'] : seg.v === 'b' ? ['r'] : ['x', 'k']} />}
    <div className="pg-two">
      <MiniTable name="products" cols={['id', 'name', 'stock']} rows={PROD11[seg.v === 'a' ? 'a' : 'b']} hlRow={seg.v === 'b' ? [1] : seg.v === 'c' ? [2] : []} hlCol={[2]} />
      <MiniTable name="orders" cols={['id', 'product_id', 'qty', 'created_at']} rows={seg.v === 'a' ? [] : ORD11} hlRow={seg.v === 'b' ? [0] : []} color={T.green} />
    </div>
    {seg.v === 'c' && <div className="n2-warn">{t("2-buyurtma ", "2-й заказ ")}<b>{t("yozilmadi", "не записан")}</b>{t(", Kolonka qoldig'i ", ", остаток Kolonka ")}<b>10</b>{t(" da qoldi — tranzaksiya butunlay bekor bo'ldi. Yolg'on buyurtma qolmadi.", " осталось — транзакция полностью отменена. Ложного заказа не осталось.")}</div>}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — psql'da tranzaksiya: CHECK xatosi → ROLLBACK, yarim ish yo'q (T11.c) */}
    {seg.v === 'sum' && <div className="mk-light" style={{ padding: 12 }}><CrudMachine path="psql" on={['psql', 'shop']} prods={[['2', 'Sichqoncha', '75000'], ['4', 'Kolonka', '50000']]} psqlLine={['shop=!#', 'ROLLBACK;', 'ROLLBACK']} ro={['psql · shop', '<span class="n1-er">ERROR:  … violates check constraint "stock_nonneg"</span> → ROLLBACK — orders: 1 row']} max={1} tag={t("Bir ishga tegishli buyruqlar — bitta tranzaksiyada: yo hammasi, yo hech biri", 'Команды одного дела — в одной транзакции: либо все, либо ни одной')} /></div>}
  </>} />;
}

// ============================================================
//  12 · Tekshiruv 2 — ROLLBACK dan keyin
// ============================================================
const T12_ABOVE = psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# DELETE FROM products;
DELETE 3
shop=*# ROLLBACK;
ROLLBACK
shop=#`);
const T12_AFTER = psql(String.raw`
shop=# SELECT * FROM products;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     7
(3 rows)`);
function Screen12(p) { return MC(p, 12, { above: <Psql title="psql — shop" lines={T12_ABOVE} />, after: <Psql title={t("psql — shop · haqiqiy natija", "psql — shop · настоящий результат")} lines={T12_AFTER} /> }); }

// ============================================================
//  13 · Amaliyot 2 — BEGIN … ROLLBACK
// ============================================================
const P13 = mkPractice(13, [[], [0, 1], [2, 3], []]);
function ScreenP13(p) { return <Practice p={p} S={P13.S} steps={P13.steps} trouble={P13.trouble} proof={P13.proof} />; }
// ============================================================
//  6-bosqich · AI yozgan SQL (F-1125-01, M56). HAQIQIY AI — Claude Haiku ×2, fayl va buyruqsiz (oddiy chatdagi javob).
//  Topshiriq — o'quvchi darsi m4-06 (src/4-Modull/PostgresCrudLesson.jsx) amaliyotidagi to'rt amal, darsning 1-bosqichidagi shop · products.
//  SQL aynan, vaqtinchalik PostgreSQL 18 da yurgizilgan (M10).
//  Manba: feedback/F-1125-01-nest1-kuchaytirish/ai-pg2/ — 00-promptlar.md · A-oddiy/ · A-oddiy-nomlar/ · B-tuzilish/ · A-tuzatilgan/ · qoshimcha-drop-column/ · XULOSA.md
//  Matn MD generatoridan tashqarida (MD'da «## AI-1», «## AI-2» — hujjat), RU shu faylning oxirida ru() bilan.
// ============================================================
SPOKEN.push(['drop column kolonka', 'DROP COLUMN kolonka'], ['drop column', 'DROP COLUMN']);
// Topshiriqlar AI'ga o'zbekcha berilgan — ruscha darsda ham aynan shu matn (tarjima qilinmaydi)
const AIQ_TASKS = ["1) 100 000 so'mdan arzon mahsulotlarni ko'rsat", '2) Quloqchin narxini 90 000 so\'m qil', "3) Kolonkani o'chir", "4) yangi mahsulot qo'sh: Monitor, 1 500 000 so'm, 3 dona"];
const AIQ_A_SQL = sql(String.raw`
SELECT * FROM mahsulotlar WHERE narxi < 100000;
SELECT * FROM mahsulotlar WHERE nomi ILIKE '%quloqchin%';
UPDATE mahsulotlar SET narxi = 90000 WHERE nomi ILIKE '%quloqchin%';
ALTER TABLE mahsulotlar DROP COLUMN kolonka;
INSERT INTO mahsulotlar (nomi, narxi, soni) VALUES ('Monitor', 1500000, 3);`);
const AIQ_A_ERR = psql(String.raw`
ERROR:  relation "mahsulotlar" does not exist
LINE 1: SELECT * FROM mahsulotlar WHERE narxi < 100000;
                      ^
… beshala buyruqda — xuddi shu xato`);
const AIQ_B_3 = sql(String.raw`
-- Avval tekshirish: bu kolonka bormi?
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'products';

BEGIN;
ALTER TABLE products DROP COLUMN <kolonka_nomi>;`);
// [topshiriq, A (nomlar almashtirilgan), B (butun javob)] — ai-pg2/A-oddiy-nomlar/natija.txt, B-tuzilish/natija.txt
const AIQ_ROWS = [
  [{ uz: "1 · arzonlar", ru: '1 · дешёвые' }, { r: '3 rows', ok: true }, { r: '3 rows', ok: true }],
  [{ uz: '2 · Quloqchin 90 000', ru: '2 · Quloqchin 90 000' }, { r: 'UPDATE 1', ok: true }, { r: 'BEGIN · UPDATE 1 · COMMIT', ok: true }],
  [{ uz: "3 · Kolonkani o'chir", ru: '3 · удалить Kolonka' }, { r: 'ERROR', n: { uz: 'column "kolonka" … does not exist', ru: 'column "kolonka" … does not exist' }, bad: true }, { r: 'ERROR', n: { uz: 'syntax error at or near "<"', ru: 'syntax error at or near "<"' }, bad: true }],
  [{ uz: '4 · Monitor', ru: '4 · Monitor' }, { r: 'INSERT 0 1', ok: true }, { r: 'ERROR', n: { uz: 'current transaction is aborted', ru: 'current transaction is aborted' }, bad: true }],
  [{ uz: 'yakun: SELECT *', ru: 'итог: SELECT *' }, { r: { uz: 'Kolonka joyida', ru: 'Kolonka на месте' }, bad: true }, { r: { uz: "Kolonka joyida · Monitor yo'q", ru: 'Kolonka на месте · Monitor нет' }, bad: true }],
];
const tlq = (x) => (x && typeof x === 'object' ? t(x.uz, x.ru) : x);
function AiqCell({ c }) {
  const col = c.bad ? T.accent : c.ok ? T.green : T.ink3;
  return <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap', minWidth: 0, padding: '5px 10px', borderRadius: 8, border: `1px solid ${c.bad ? T.accent : T.line}`, background: c.bad ? '#FFF0EB' : T.paper }}>
    <b style={{ font: `700 12.5px/1.35 ${MONO}`, color: col }}>{tlq(c.r)}</b>
    {c.n && <span style={{ font: `12px/1.35 ${MONO}`, color: T.accent, overflowWrap: 'anywhere' }}>{tlq(c.n)}</span>}
  </div>;
}
const S_PG2AI = {
  kicker: '6-bosqich · AI yozgan SQL', title: "AI yozgan SQL bazada: to'rt amal, ikki topshiriq — Kolonka o'chmadi",
  segments: [
    sg('a', "O'quvchi amaliyotidagi to'rt amalni haqiqiy AI'ga berdik: <b>oddiy so'z bilan</b> va <b>jadval tuzilishi bilan</b>", "m4-06 da o'quvchi AI'ga oddiy so'z bilan aytadi, AI SQL yozadi. Biz ham haqiqiy AI'ga, Claude Haiku'ga, to'rt amal berdik: arzon mahsulotlarni ko'rsatish, quloqchin narxini o'zgartirish, kolonkani o'chirish va monitor qo'shish. Chapdagisiga jadval tuzilishini aytmadik, o'ngdagisiga aytdik."),
    sg('b', "A jadval nomini <b>o'ylab topdi</b> — beshala buyruq bir xil xato", "Birinchi AI jadval tuzilishini bilmagani uchun nomlarni o'ylab topdi: mahsulotlar, nomi, narxi. Bazada esa products. Beshala buyruq bir xil xato berdi: bunday jadval yo'q. O'quvchi darsidagi AI xatosining haqiqiy ko'rinishi shu: u yerda product, bu yerda mahsulotlar."),
    sg('c', "«Kolonkani o'chir» — ikkala AI ham uni <b>jadval ustuni</b> deb tushundi", "Eng muhim joy uchinchi amal. Bizning do'konda kolonka mahsulot. Ikkala AI ham uni jadval ustuni deb tushundi. A ustunni o'chiradigan alter table drop column yozdi. B jadval tuzilishini bilsa ham, qaysi ustun aniq emas, deb shablon berdi. Topshiriq qatorni o'chirish edi, ya'ni delete."),
    sg('d', "Bazada: ikkalasida <b>Kolonka joyida</b>, B da <b>Monitor ham qo'shilmadi</b>", "Endi bazadagi natija. A ning nomlarini, o'zi aytganidek, haqiqiysiga almashtirdik: narx o'zgardi, monitor qo'shildi, kolonka esa joyida qoldi. B ning javobini butunlay yurgizdik: narx begin va commit ichida to'g'ri o'zgardi, lekin shablondagi xato tranzaksiyani buzdi va monitor ham qo'shilmadi."),
    sg('e', "Xulosa: AI buyrug'ini <b>fe'l, nom va son</b> bilan tekshiring", "Xulosa. AI yozgan SQL'ni uch narsa bilan tekshiring. Fe'l topshiriqqa mosmi: ko'rish select, o'zgartirish update, o'chirish delete, qo'shish insert. Jadval va ustun nomi backslash d bilan bir xilmi. Javobdagi son kutganingizmi. Oxirida select yulduzcha bilan butun jadvalga qarang."),
  ],
};
function ScreenAI(p) {
  return <Lesson p={p} S={S_PG2AI} scene={({ beat }) => (<>
    {beat === 0 && <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('A · oddiy so\'z bilan (tuzilish aytilmagan)', 'A · простыми словами (дано на узбекском, без структуры)')}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>«Do'konim bazasida mahsulotlar bor. PostgreSQL uchun SQL yozib ber:»</div>
        </div>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('B · jadval tuzilishi bilan', 'B · со структурой таблицы (дано на узбекском)')}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>«PostgreSQL, shop bazasi. Jadval: <code>products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER)</code>… Har UPDATE va DELETE'da WHERE bo'lsin; avval SELECT bilan tekshirib olinadigan qilib yoz.»</div>
        </div>
      </div>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("Ikkalasiga bir xil to'rt amal · baza — 1-bosqichdagi shop · products (Kolonka — mahsulot)", 'Обоим одни и те же четыре действия · база — shop · products из этапа 1 (Kolonka — товар)')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 14 }}>{AIQ_TASKS.map((x) => <div key={x}>{x}</div>)}</div>
      </div>
    </>}
    {beat === 1 && <>
      <CodePanel file={t('A · javobdagi SQL (aynan)', 'A · SQL из ответа (дословно)')} lines={AIQ_A_SQL} />
      <Psql title={t('psql — shop · A yurgizildi (haqiqiy)', 'psql — shop · запуск A (настоящий)')} er lines={AIQ_A_ERR} />
    </>}
    {beat === 2 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <div className="mk-tag" style={{ margin: 0 }}>{t('A · 3-amal (aynan)', 'A · действие 3 (дословно)')}</div>
        <CodePanel file="sql" numbers={false} lines={sql("ALTER TABLE mahsulotlar DROP COLUMN kolonka;")} />
        <div style={{ fontSize: 13.5, color: T.ink2 }}>«Qaysi ustun o'chirilishi aniq emas. Agar ustun nomi <code>kolonka</code> bo'lsa…»</div>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <div className="mk-tag" style={{ margin: 0 }}>{t('B · 3-amal (aynan)', 'B · действие 3 (дословно)')}</div>
        <CodePanel file="sql" numbers={false} lines={AIQ_B_3} />
        <div style={{ fontSize: 13.5, color: T.ink2 }}>«Qaysi kolonka ekani aniq emas. Jadvalda faqat id, name, price, stock bor…»</div>
      </div>
      <div className="mk-light" style={{ gridColumn: '1 / -1', padding: 12, fontSize: 14, lineHeight: 1.5 }}>{t(<><b>Topshiriq:</b> Kolonka — mahsulot, qatorni o'chirish → <code>DELETE … WHERE</code>. <b style={{ color: T.accent }}>AI:</b> <code>ALTER TABLE … DROP COLUMN</code> — jadval tuzilishini o'zgartiradi. Ustun bo'lsa — hamma qatordagi qiymat o'chadi, so'roqsiz (sinab ko'rildi: <code>DROP COLUMN stock</code> → <code>ALTER TABLE</code>).</>, <><b>Задание:</b> Kolonka — товар, удалить строку → <code>DELETE … WHERE</code>. <b style={{ color: T.accent }}>ИИ:</b> <code>ALTER TABLE … DROP COLUMN</code> — меняет структуру таблицы. Если колонка есть — значение пропадёт во всех строках, без вопроса (проверено: <code>DROP COLUMN stock</code> → <code>ALTER TABLE</code>).</>)}</div>
    </div>}
    {beat >= 3 && <div className="mk-light" style={{ padding: 14, display: 'grid', gap: 8 }}>
      <div className="mk-tag">{t("Bazada · haqiqiy PostgreSQL 18 (aynan javoblar)", 'В базе · настоящий PostgreSQL 18 (дословные ответы)')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1fr 1.2fr', gap: 8, fontSize: 13, color: T.ink3, fontWeight: 600 }}><span>{t('Amal', 'Действие')}</span><span>{t("A · nomlar almashtirildi¹", 'A · имена заменены¹')}</span><span>{t('B · butun javob', 'B · весь ответ')}</span></div>
      {AIQ_ROWS.map(([q, a, b]) => <div key={q.uz} style={{ display: 'grid', gridTemplateColumns: '0.9fr 1fr 1.2fr', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13.5 }}>{tlq(q)}</span><AiqCell c={a} /><AiqCell c={b} />
      </div>)}
      <div style={{ fontSize: 12.5, color: T.ink3 }}>{t("¹ A o'zi yozgan: «Haqiqiy nomlar boshqacha bo'lsa, ularni almashtiring» — mahsulotlar → products, nomi → name, narxi → price, soni → stock.", '¹ A сам написал: «если настоящие имена другие, замените их» — mahsulotlar → products, nomi → name, narxi → price, soni → stock.')}</div>
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>AI yozgan SQL'ni tekshirish:</b> fe'l — ko'rish <code>SELECT</code> · o'zgartirish <code>UPDATE</code> · o'chirish <code>DELETE</code> · qo'shish <code>INSERT</code> · nomlar — <code>\d products</code> bilan · javobdagi son · oxirida <code>SELECT *</code>. <code>ALTER</code> / <code>DROP</code> — topshiriqda so'ralmagan bo'lsa, yurgizmang.</>, <><b>Проверка SQL от ИИ:</b> глагол — посмотреть <code>SELECT</code> · изменить <code>UPDATE</code> · удалить <code>DELETE</code> · добавить <code>INSERT</code> · имена — по <code>\d products</code> · число в ответе · в конце <code>SELECT *</code>. <code>ALTER</code> / <code>DROP</code> — если в задании не просили, не запускайте.</>)}</div></Block>
  </>)} />;
}

// --- Tekshiruv 5: A yozgan SQL (nomlar almashtirilgan) — Kolonka o'chmadi. Haqiqiy: ai-pg2/A-oddiy-nomlar/sorovlar.sql, natija.txt ---
const LCAIQ_LINES = sql(String.raw`
SELECT * FROM products WHERE price < 100000;
-- Avval tekshiring, nechta qator chiqishini ko'ring:
SELECT * FROM products WHERE name ILIKE '%quloqchin%';
-- Keyin yangilang:
UPDATE products SET price = 90000 WHERE name ILIKE '%quloqchin%';
ALTER TABLE products DROP COLUMN kolonka;
INSERT INTO products (name, price, stock) VALUES ('Monitor', 1500000, 3);`).map((l, i) => ({ ...l, n: i + 1 }));
const LCAIQ_FIXED = [
  ...LCAIQ_LINES.slice(0, 5),
  { ...LCAIQ_LINES[5], gone: true },
  { h: sqlLine("DELETE FROM products WHERE name = 'Kolonka';"), n: 6, neu: true },
  LCAIQ_LINES[6],
];
const LCAIQ_AFTER = psql(String.raw`
shop=# DELETE FROM products WHERE name = 'Kolonka';
DELETE 1
shop=# SELECT * FROM products ORDER BY id;
 id |    name    |  price  | stock
----+------------+---------+-------
  1 | Klaviatura |  120000 |     8
  2 | Sichqoncha |   75000 |    15
  3 | Quloqchin  |   90000 |     5
  5 | Monitor    | 1500000 |     3
(4 rows)`);
// chap ustun 1280×720 ga sig'sin: natijaning faqat kerakli qatorlari (to'liq — ai-pg2/A-oddiy-nomlar/natija.txt)
const LCAIQ_PRE = (tag) => '<pre class="pg-doc er" style="margin-top:12px;font-size:12px">' + escH(String.raw`shop=# SELECT * FROM products ORDER BY id;
 id |    name    |  price  | stock
 …
  4 | Kolonka    |   50000 |    10   ← ${tag}
  5 | Monitor    | 1500000 |     3`) + '</pre>';
function ScreenLCAI(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t('Tekshiruv · 5 / 5 — qaysi satr xato?', 'Проверка · 5 / 5 — какая строка с ошибкой?')}
    title={t("AI yozgan SQL: to'rt amal, lekin Kolonka joyida qoldi", 'SQL от ИИ: четыре действия, но Kolonka осталась на месте')}
    task={t("Topshiriq: arzonlar · Quloqchin 90 000 · <b>Kolonkani (mahsulot) o'chirish</b> · Monitor qo'shish. A ning SQL'i, nomlari AI aytganidek almashtirilgan. Yakunda Kolonka joyida. <b>Topshiriqni bajarmagan satrni bosing.</b>", 'Задание: дешёвые · Quloqchin 90 000 · <b>удалить Kolonka (товар)</b> · добавить Monitor. SQL от A, имена заменены, как советовал ИИ. В итоге Kolonka на месте. <b>Нажмите на строку, которая не выполнила задание.</b>')
      + t(LCAIQ_PRE("o'chmadi"), LCAIQ_PRE('не удалена'))}
    q={t("Beshinchi, oxirgi tekshiruv. Bu birinchi AI yozgan SQL, nomlari haqiqiysiga almashtirilgan. To'rt amal berilgan edi, yakunda esa kolonka joyida qoldi. Qaysi satr kolonkani o'chirish topshirig'ini bajarmadi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это SQL первого ИИ, имена заменены на настоящие. Было дано четыре действия, а в итоге kolonka осталась на месте. Какая строка не выполнила задание удалить kolonka? Нажмите на эту строку.')}
    file={t('psql — shop · A yozgan SQL (nomlar almashtirilgan)', 'psql — shop · SQL от A (имена заменены)')} lines={LCAIQ_LINES} target={5}
    fixed={LCAIQ_FIXED} fixedExtra={[{ file: t("psql — shop · tuzatilgandan keyin (haqiqiy)", 'psql — shop · после исправления (настоящий)'), lines: LCAIQ_AFTER }]}
    ok={t("To'g'ri. Oltinchi satr: alter table products drop column kolonka. Topshiriq kolonka degan mahsulotni o'chirish edi, AI esa kolonka degan ustunni o'chirmoqchi bo'ldi. Bunday ustun yo'qligi uchun baza xato berdi va hech narsa o'chmadi. Ustun bo'lganida esa hamma qatordagi qiymat so'roqsiz o'chardi, buni sinab ko'rdik. Tuzatish: delete from products, where name kolonka. Bazada delete bir, kolonka o'chdi.", 'Верно. Шестая строка: alter table products drop column kolonka. Задание было удалить товар kolonka, а ИИ хотел удалить колонку kolonka. Такой колонки нет, поэтому база выдала ошибку и ничего не удалилось. А будь такая колонка, значение во всех строках пропало бы без вопроса, мы это проверили. Исправление: delete from products, where name kolonka. В базе delete один, kolonka удалена.')}
    okShort={t("6-satr: DROP COLUMN — mahsulot emas, ustun o'chiriladi; ustun yo'q → ERROR. Tuzatildi: DELETE FROM products WHERE name = 'Kolonka'; → DELETE 1 (sinab ko'rilgan).", "Строка 6: DROP COLUMN — удаляется колонка, а не товар; колонки нет → ERROR. Исправлено: DELETE FROM products WHERE name = 'Kolonka'; → DELETE 1 (проверено).")}
    hint={t("O'chirish — qaysi CRUD buyrug'i? Har satrning birinchi so'ziga qarang: qaysi biri qatorni emas, jadvalni o'zgartiradi?", 'Удаление — какая команда CRUD? Посмотрите на первое слово каждой строки: какая меняет не строку, а таблицу?')} />;
}

// --- RU: 6-bosqich · AI yozgan SQL (show = text) ---
const rsQ = (key, text) => ({ key, text, show: text });
ru(S_PG2AI, {
  kicker: 'Этап 6 · SQL от ИИ', title: 'SQL от ИИ в базе: четыре действия, два задания — Kolonka не удалена',
  segments: {
    a: rsQ('Четыре действия из практики ученика дали настоящему ИИ: <b>простыми словами</b> и <b>со структурой таблицы</b>', 'В m4-06 ученик говорит ИИ простыми словами, а ИИ пишет SQL. Мы тоже дали настоящему ИИ, Claude Haiku, четыре действия: показать дешёвые товары, изменить цену quloqchin, удалить kolonka и добавить monitor. Левому не сказали структуру таблицы, правому сказали.'),
    b: rsQ('A <b>придумал</b> имя таблицы — все пять команд с одной ошибкой', 'Первый ИИ не знал структуру таблицы и придумал имена: mahsulotlar, nomi, narxi. А в базе products. Все пять команд дали одну ошибку: такой таблицы нет. Это настоящий вид ошибки ИИ из урока ученика: там product, здесь mahsulotlar.'),
    c: rsQ('«Удалить Kolonka» — оба ИИ поняли это как <b>колонку таблицы</b>', 'Самое важное — третье действие. В нашем магазине kolonka — это товар. Оба ИИ поняли его как колонку таблицы. A написал alter table drop column, который удаляет колонку. B, хотя знал структуру таблицы, ответил: неясно, какая колонка, и дал шаблон. Задание было удалить строку, то есть delete.'),
    d: rsQ('В базе: в обоих <b>Kolonka на месте</b>, у B <b>не добавился и Monitor</b>', 'Теперь результат в базе. Имена A мы, как он сам советовал, заменили на настоящие: цена изменилась, monitor добавлен, а kolonka осталась. Ответ B запустили целиком: цена верно изменилась внутри begin и commit, но ошибка в шаблоне сломала транзакцию, и monitor тоже не добавился.'),
    e: rsQ('Вывод: команду ИИ проверяйте <b>глаголом, именем и числом</b>', 'Вывод. SQL от ИИ проверяйте по трём вещам. Глагол соответствует заданию: посмотреть — select, изменить — update, удалить — delete, добавить — insert. Имя таблицы и колонок совпадает с backslash d. Число в ответе такое, как вы ждали. В конце посмотрите всю таблицу через select со звёздочкой.'),
  },
});

// ============================================================
//  14 · Qoida yozilmasa — qo'riqlamaydi: NOT NULL, DEFAULT, UNIQUE (v2f-ekran14, uzluksiz holat: nomsiz qator id 5, Planshet id 7)
// ============================================================
const T14 = {
  a: psql(String.raw`
shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
INSERT 0 1
shop=# SELECT * FROM products WHERE name IS NULL;
 id | name | price | stock
  5 |      | 30000 |     4
(1 row)`, { 2: { id: 'x' }, 5: { id: 'x' } }),
  b: psql(String.raw`
shop=# ALTER TABLE products ALTER COLUMN name SET NOT NULL;
ERROR:  column "name" of relation "products" contains null values
shop=# DELETE FROM products WHERE name IS NULL;
DELETE 1
shop=# ALTER TABLE products ALTER COLUMN name SET NOT NULL;
ALTER TABLE
shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
ERROR:  null value in column "name" of relation "products" violates not-null constraint`, { 2: { id: 'x' }, 6: { id: 'ok' }, 8: { id: 'ok' } }),
  c: psql(String.raw`
shop=# ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;
ALTER TABLE
shop=# INSERT INTO products (name, price) VALUES ('Planshet', 300000) RETURNING *;
  7 | Planshet | 300000 |     0
shop=# ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
ALTER TABLE
shop=# INSERT INTO products (name, price, stock) VALUES ('Kolonka', 1, 1);
ERROR:  duplicate key value violates unique constraint "products_name_unique"
DETAIL:  Key (name)=(Kolonka) already exists.`, { 4: { id: 'ok' }, 8: { id: 'x' }, 9: { id: 'x' } }),
  d: psql(String.raw`
shop=# \d products
 Column |  Type   | Nullable |               Default
--------+---------+----------+--------------------------------------
 id     | integer | not null | nextval('products_id_seq'::regclass)
 name   | text    | not null |
 price  | integer |          |
 stock  | integer |          | 0
Indexes:
    "products_name_unique" UNIQUE CONSTRAINT, btree (name)
Check constraints:
    "stock_nonneg" CHECK (stock >= 0)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)`),
};
// Qoidalar kartasi — qoshilib boradi (k: '' — doim; boshqasi — seg.on ichida bo'lsa)
const RULES14 = [['id', 'SERIAL PRIMARY KEY', ''], ['name', 'TEXT', ''], ['name', 'NOT NULL', 'nn'], ['price', 'INTEGER', ''], ['stock', 'INTEGER', ''], ['stock', 'DEFAULT 0', 'def'], ['stock', 'CHECK (stock >= 0) — 11-ekran', 'chk'], ['name', 'UNIQUE', 'uq'], ['orders', 'product_id REFERENCES products(id) — 11-ekran', 'fk']];
const S14 = mkS(14, [{ e: 'a', on: ['chk', 'fk'] }, { e: 'b', on: ['chk', 'fk', 'nn'], neu: ['nn'] }, { e: 'c', on: ['chk', 'fk', 'nn', 'def', 'uq'], neu: ['def', 'uq'] }, { e: 'd', on: ['chk', 'fk', 'nn', 'def', 'uq'], sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    <div style={{ display: 'grid', gap: 12 }}>
      {!seg.sum && <Psql title="psql — shop" er={seg.e !== 'd'} lines={T14[seg.e]} focus={seg.e === 'a' ? ['x'] : seg.e === 'b' ? ['ok'] : seg.e === 'c' ? ['ok', 'x'] : []} />}
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("products — qoidalar", "products — правила")}</div>
        <div className="pg-rules" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>{RULES14.filter(([, , k]) => !k || seg.on.includes(k)).map(([c, r, k]) => <div key={c + r} className={`${k ? 'on' : ''}${(seg.neu || []).includes(k) ? ' new' : ''}`}><b style={{ minWidth: 70, whiteSpace: 'nowrap' }}>{c}</b><span>{r}</span></div>)}</div></div>
    </div>
    {seg.e === 'a' && <div className="n2-warn">{t("Xato yo'q, nomsiz qator saqlandi — jadvalda ", "Ошибки нет, строка без имени сохранилась — в таблице ")}<b>{t("NOT NULL yo'q", "нет NOT NULL")}</b>{t(" edi. Baza faqat yozilgan qoidani qo'riqlaydi.", " . База охраняет только записанное правило.")}</div>}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — psql'dagi nomsiz yozuvni endi baza o'zi rad etadi (haqiqiy xato, T14.d) */}
    {seg.sum && <div className="mk-light" style={{ padding: 12 }}><CrudMachine path="psql" on={['psql', 'shop']} prods={[['1', 'Klaviatura', '120000'], ['2', 'Sichqoncha', '75000']]} psqlLine={['shop=#', 'INSERT INTO products (price, stock) VALUES (30000, 4);', 'ERROR: null value in column "name" … violates not-null constraint']} ro={['psql · shop', '<span class="n1-er">ERROR:  null value in column "name" of relation "products" violates not-null constraint</span>']} max={1} tag={t("Qoida bazada — xatoni kod emas, baza ushlaydi; xabarda qoida nomi bor", 'Правило в базе — ошибку ловит не код, а база; в сообщении есть имя правила')} /></div>}
  </>} />;
}

// ============================================================
//  15 · Xabarni o'qish: beshta xato (v2f-ekran15-16; O'yinchoq id 9)
// ============================================================
const E15 = {
  a: psql(String.raw`
shop=# SELECT * FROM product WHERE price < 100000;
ERROR:  relation "product" does not exist
LINE 1: SELECT * FROM product WHERE price < 100000;
                      ^`),
  b: psql(String.raw`
shop=# SELECT * FROM products WHERE narx < 100000;
ERROR:  column "narx" does not exist
LINE 1: SELECT * FROM products WHERE narx < 100000;
                                     ^
HINT:  Perhaps you meant to reference the column "products.name".`, { 5: { id: 'h' } }),
  c: psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet2', 'arzon', 3);
ERROR:  invalid input syntax for type integer: "arzon"
LINE 1: ...roducts (name, price, stock) VALUES ('Planshet2', 'arzon', 3...
                                                             ^
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet2', 300000);
ERROR:  INSERT has more target columns than expressions
LINE 1: INSERT INTO products (name, price, stock) VALUES ('Planshet2...
                                           ^`),
  d: psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);
ERROR:  syntax error at or near "yinchoq"
LINE 1: ...ERT INTO products (name, price, stock) VALUES ('O'yinchoq', ...
                                                             ^
shop=# INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
 id |   name    | price | stock
----+-----------+-------+-------
  9 | O'yinchoq | 30000 |     4
(1 row)`, { 5: { neu: true, id: 'f' }, 8: { id: 'f' } }),
  e: psql(String.raw`
shop=# \d products
 Column |  Type   | Nullable | Default
--------+---------+----------+---------
 id     | integer | not null |
 name   | text    | not null |
 price  | integer |          |
 stock  | integer |          | 0`),
};
const FORMULA15 = [['Qaysi jadval?', 'relation "…"', PG.pg], ['Qaysi ustun yoki qoida?', 'column "…" · constraint "…"', T.accent], ['Qaysi qiymat?', 'DETAIL / LINE … ^', T.yellow]];
const S15 = mkS(15, [{ e: 'a' }, { e: 'b', focus: ['h'] }, { e: 'c' }, { e: 'd', focus: ['f'] }, { e: 'e', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    <div className="pg-three">{FORMULA15.map(([h, d, c]) => <div key={h} className="mk-box" style={{ '--c': c }}><h4>{h}</h4><p style={{ fontFamily: MONO, fontSize: 12 }}>{d}</p></div>)}</div>
    <Psql title="psql — shop" er={seg.e !== 'e'} lines={E15[seg.e]} focus={seg.focus || []} />
    {seg.e === 'b' && <div className="n2-warn">{t(<>HINT <b>taxmin</b> qiladi: <code>name</code> ni taklif qildi, kerakli ustun esa <code>price</code>. Ishonchli manba — <code>\d products</code>.</>, <>HINT <b>гадает</b>: предложил <code>name</code>, а нужная колонка — <code>price</code>. Надёжный источник — <code>\d products</code>.</>)}</div>}
    {seg.sum && <div className="mk-rule">{t(<>Xabardagi nomni <code>\d products</code> bilan solishtiring · </>, <>Сравните имя из сообщения с <code>\d products</code> · </>)}<code>^</code>{t(" xato joyni ko'rsatadi · so'z ichidagi apostrof — ", " показывает место ошибки · апостроф внутри слова — ")}<b>{t("ikki marta", "дважды")}</b>: <code>'O''yinchoq'</code></div>}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — apostrof
// ============================================================
function Screen16(p) { return MC(p, 16, { above: <Psql title="psql — shop" er lines={E15.d.slice(0, 4)} />, after: <Psql title={t("psql — shop · tuzatildi", "psql — shop · исправлено")} lines={E15.d.slice(4)} focus={['f']} /> }); }

// ============================================================
//  Server kodi — pg2-out/11-server-80.js (Prettier 80, M43; parol o'rniga 'password'). Satr raqamlari fayldagidek:
//  Pool 10–16 · app/json 17–18 · GET 21–29 · POST 32–44 (SQL 36) · PUT 47–61 (404: 54–55) · DELETE 64–76 (404: 69–70) · listen 78
// ============================================================
const SERVER_SRC = String.raw`
// server.js — AvtoIjara backend (Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');

// Bazaga ulanish sozlamalari
const USER = 'postgres';
const PASSWORD = 'password'; // o'z parolingizni yozing
const DATABASE = 'car_rental';

const pool = new Pool({
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  host: 'localhost',
  port: 5432,
});
const app = express();
app.use(express.json());

// GET — hamma mashinalar
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — yangi mashina
app.post('/api/cars', async (req, res) => {
  try {
    const { model, daily_price, year } = req.body;
    const result = await pool.query(
      'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *',
      [model, daily_price, year],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — narxni yangilash
app.put('/api/cars/:id', async (req, res) => {
  try {
    const { daily_price } = req.body;
    const result = await pool.query(
      'UPDATE cars SET daily_price = $1 WHERE id = $2 RETURNING *',
      [daily_price, req.params.id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — mashinani o'chirish
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cars WHERE id = $1', [
      req.params.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json({ message: "O'chirildi", deleted: result.rowCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));`;
const SRV_META = mergeMeta(
  rng(10, 16, { id: 'pool' }), { 17: { id: 'app' }, 18: { id: 'json' } },
  rng(21, 29, { id: 'get' }), { 23: { id: 'getq' }, 24: { id: 'getq' } }, rng(25, 28, { id: 'catch' }),
  rng(32, 44, { id: 'post' }), rng(35, 38, { id: 'postq' }), { 36: { id: 'sqlp' } },
  rng(47, 61, { id: 'put' }), rng(50, 53, { id: 'putq' }), rng(54, 55, { id: 'nf' }),
  rng(64, 76, { id: 'del' }), rng(66, 68, { id: 'delq' }), rng(69, 70, { id: 'nf' }), { 78: { id: 'listen' } });
const SERVER_LINES = js(SERVER_SRC, SRV_META);
const SRV_FILES = MKCFG.files;
// Bo'lak: fayl satrlari a..b (1-asosli), raqamlar fayldagidek (n)
const srvSlice = (a, b, lines = SERVER_LINES) => lines.slice(a - 1, b).map((l, i) => (l.n != null ? l : { ...l, n: a + i }));
const SrvIde = ({ focus = [], a, b, lines, children }) => <Ide files={SRV_FILES} active="server.js">
  <CodePanel file="server.js" lines={lines || srvSlice(a, b)} focus={focus} style={{ fontSize: 12.5 }} />
  {children}
</Ide>;
function ShamaNoteC() { return <div className="mk-tag" style={{ margin: 0 }}>{t("Shartli namuna — Gemini har safar boshqacha yozadi, mazmuni shu", "Условный образец — Gemini каждый раз пишет по-разному, суть такая")}</div>; } // t() render paytida (modul darajasida LANG hali uz)
const shamaNote = <ShamaNoteC />;
const PM_POST = { m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }', st: 201, res: '{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}' };
const PM_ELANTRA = (st) => ({ m: 'POST', url: '/api/cars', body: '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }', st, res: st === 201 ? '{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}' : '' });

// ============================================================
//  17 · Pool nima va qachon ulanadi — o'lchab ko'rdik (v2f-pool: pid 378069, ulanish 0 → 1)
// ============================================================
const POOL17 = psql(String.raw`
$ node pool-pid.js
Pool yaratildi · ulanishlar: 0
so'rov 1: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
so'rov 2: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
so'rov 3: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1`, { 2: { id: 'z' }, 3: { id: 'one' }, 4: { id: 'one' }, 5: { id: 'one' } });
const BAD17 = psql(String.raw`
xato parol bilan Pool yaratildi — xato yo'q (hali ulanmadi)
birinchi so'rovda: password authentication failed for user "postgres"`, { 2: { id: 'x' } });
function PoolDiagram({ conn, pid, note }) {
  return <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">Server ↔ Pool ↔ PostgreSQL</div>
    <div className="pg-pool">
      <div className="mk-box" style={{ '--c': T.ink }}><h4>Express</h4><p>server.js</p></div><div className="ar">→</div>
      <div className="mk-box hl" style={{ '--c': T.purple }}><h4>Pool</h4><p>{t("ulanishlar: ", "соединения: ")}<b>{conn}</b></p></div><div className="ar">→</div>
      <div className="mk-box" style={{ '--c': PG.pg }}><h4>PostgreSQL</h4><p>{pid ? <>{t("jarayon pid ", "процесс pid ")}<b>{pid}</b></> : t('hali ulanmagan', "ещё не подключено")}</p></div>
    </div>
    {note && <div className="exp" style={{ marginTop: 8, color: T.ink2 }}>{note}</div>}
  </div>;
}
// F-1109-06: xulosa — uch karta o'rniga Kod · Pool · PostgreSQL yo'laklari (ulanish 0 → birinchi so'rovda ochiladi → o'sha pid) va parol xatosi
function Lanes17() {
  const PID = 378069; // shu ekrandagi terminal (POOL17) bilan bir xil
  const row = (tm, code, pool, on) => <><div className="tm">{tm}</div><div><code>{code}</code></div><div>{pool}</div><div>{on ? <><span className="p2-cn on"><i /></span><span className="p2-pid">pid {PID}</span></> : <><span className="p2-cn"><i /></span><span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>{t("hali bog'lanmagan", "ещё не связан")}</span></>}</div></>;
  return <div className="z">
    <div className="p2-lanes">
      <div className="h" /><div className="h" style={{ color: '#6D3BE4' }}>{t("Kod · server.js", "Код · server.js")}</div><div className="h" style={{ color: '#336791' }}>Pool</div><div className="h" style={{ color: '#336791' }}>PostgreSQL</div>
      {row(t("ishga tushdi", "запуск"), 'new Pool({…})', <>{t("yaratildi · ", "создан · ")}<b>{t("ulanish: 0", "соединений: 0")}</b></>, false)}
      {row(t("so'rov 1", "запрос 1"), 'pool.query(…)', <b>{t("ulanish ochdi", "открыл соединение")}</b>, true)}
      {row(t("so'rov 2", "запрос 2"), 'pool.query(…)', t("o'sha ulanish", "то же соединение"), true)}
      {row(t("so'rov 3", "запрос 3"), 'pool.query(…)', t("o'sha ulanish", "то же соединение"), true)}
    </div>
    <div className="p2-bad">
      <b>{t("Parol xato", "Неверный пароль")}</b>
      <div>{t("Ishga tushganda ", "При запуске ")}<span style={{ color: '#15803D', fontWeight: 700 }}>{t("✓ xato yo'q", "✓ ошибки нет")}</span>{t(" — Pool hali bazaga bormagan", " — Pool ещё не ходил в базу")}</div>
      <span />
      <div className="z-term">Server 3000-portda ishlayapti{'\n'}<span className="r">{t("so'rov 1", "запрос 1")} → password authentication failed for user "postgres"</span></div>
    </div>
  </div>;
}
const S17 = mkS(17, [{ v: 'code' }, { v: 'pid' }, { v: 'bad' }, { v: 'sum' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {seg.v === 'code' && <SrvIde a={2} b={16} focus={['pool']}>{shamaNote}</SrvIde>}
    {seg.v === 'pid' && <><Psql title={t("terminal — node pool-pid.js (shop bazasida)", "терминал — node pool-pid.js (в базе shop)")} lines={POOL17} focus={['z', 'one']} /><PoolDiagram conn={1} pid={378069} note={t("Uch so'rov — bitta ulanish, bitta pid: Pool borini qayta ishlatadi.", "Три запроса — одно соединение, один pid: Pool переиспользует имеющееся.")} /></>}
    {seg.v === 'bad' && <><Psql title={t("terminal — xato parol bilan", "терминал — с неверным паролем")} er lines={BAD17} focus={['x']} /><PoolDiagram conn={0} pid={null} note={t("Pool yaratildi, lekin ulanmadi — xato faqat birinchi so'rovda chiqadi.", "Pool создан, но не подключился — ошибка выходит только на первом запросе.")} /></>}
    {seg.v === 'sum' && <Lanes17 />}
  </>} />;
}

// ============================================================
//  18 · GET: pool.query → rows, rowCount → res.json (11-crud-sorovlar GET 200; rowCount — v2f-pool)
// ============================================================
const GET18 = '[{"id":1,"model":"Chevrolet Cobalt","daily_price":280000,"year":2022,"is_rented":false},\n {"id":2,"model":"Chevrolet Malibu",…}, {"id":3,"model":"Kia K5",…}]';
const RC18 = psql(String.raw`
rowCount: 3 · rows: [{"name":"Klaviatura","price":89000},{"name":"Sichqoncha","price":75000},{"name":"Kolonka","price":50000}]
UPDATE id=99 → rowCount: 0 · rows: []`, { 1: { id: 'r' }, 2: { id: 'z' } });
const STEPS18 = [['Pool', 'ulanadi', T.purple], ['pool.query(sql)', "so'rov bazaga", PG.pg], ['rows / rowCount', 'natija', T.green], ['res.json', 'javob', T.ink]];
// F-1109-06: xulosa — to'rt kichik karta o'rniga GET /api/cars yo'li haqiqiy qiymatlar bilan, rowCount jadvali va catch (12-price-xato)
// F-1120-02 (M51): yuqoridagi oqim kartasi o'rniga darsning rasmi — o'sha GET yo'li (CrudMachine)
function Flow18() {
  return <div className="z">
    <div className="z-card" style={{ padding: 12 }}>
      <CrudMachine path="api" on={['pm', 'route', 'pool', 'cars']} req={{ m: 'GET', url: '/api/cars', body: null }} st={200} res={'[{"id":1,"model":"Chevrolet Cobalt",…}, …]'}
        route={"app.<span class=\"n1-k\">get</span>(<span class=\"n1-s\">'/api/cars'</span>)"} sql={"pool.query(<span class=\"n1-s\">'SELECT * FROM cars'</span>)"} rc="rows: 3 · rowCount: 3" back="result.rows → res.json → 200"
        ro={['server.js:24', 'res.json(result.rows);']} tag={t("GET /api/cars — so'rov serverdan bazaga va qaytib", 'GET /api/cars — запрос от сервера к базе и обратно')} />
    </div>
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("rowCount — terminaldagi son", "rowCount — число из терминала")}</p>
        <table className="z-tbl"><tbody>
          <tr><th>{t("terminalda", "в терминале")}</th><th>{t("pool.query natijasida", "в результате pool.query")}</th></tr>
          <tr><td>(3 rows)</td><td>rowCount: 3</td></tr>
          <tr className="hl"><td>UPDATE 0</td><td>rowCount: 0 · rows: []</td></tr>
        </tbody></table>
        <span className="z-mut">{t("UPDATE … WHERE id = 99 — mos qator yo'q, xato emas", "UPDATE … WHERE id = 99 — подходящей строки нет, это не ошибка")}</span>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
        <p className="z-h" style={{ color: 'var(--bad)' }}>{t("xato bo'lsa — catch", "при ошибке — catch")}</p>
        <div className="z-term">res.status(500).json({'{'} error: err.message {'}'}){'\n'}<span className="m">→</span> <span className="r">500</span> {'{'}"error":"column \"price\" of relation \"cars\" does not exist"{'}'}</div>
        <span className="z-mut">{t("5-bosqichdagi hamma xato shu yo'ldan keladi", "все ошибки 5-го этапа приходят этим путём")}</span>
      </div>
    </div>
  </div>;
}
const S18 = mkS(18, [{ v: 'code', focus: ['getq'], pm: true }, { v: 'rc' }, { v: 'code', focus: ['catch'] }, { v: 'sum' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'code' && <SrvIde a={21} b={29} focus={seg.focus} />}
    {seg.pm && <PostmanCard m="GET" url="localhost:3000/api/cars" st={200} res={GET18} />}
    {seg.v === 'rc' && <><Psql title={t("node — shop bazasida sinov (pool-pid.js)", "node — проверка в базе shop (pool-pid.js)")} lines={RC18} focus={['r', 'z']} /><div className="mk-rule"><code>rowCount</code>{t(" — terminaldagi ", " — из терминала: ")}<code>UPDATE 1</code> / <code>(3 rows)</code>{t(" ning o'zi · ", " — то же самое · ")}<code>rowCount: 0</code>{t(" — 1-bosqichdagi ", " — тот самый ")}<code>UPDATE 0</code>{t(" shu yerga keladi", " с 1-го этапа приходит сюда")}</div></>}
    {seg.v === 'code' && seg.focus[0] === 'catch' && <div className="n2-warn"><code>await</code>{t(" — so'rov kutiladi, funksiya ", " — запрос ожидается, функция ")}<code>async</code>{t(" · xato bo'lsa ", " · при ошибке ")}<code>catch</code>: status <b>500</b>{t(" va xato matni — 5-bosqichdagi hamma xato shu yerdan chiqadi", " и текст ошибки — все ошибки 5-го этапа выходят отсюда")}</div>}
    {seg.v === 'sum' && <Flow18 />}
  </>} />;
}

// ============================================================
//  19 · POST, PUT, DELETE: RETURNING *, statuslar, 404 (11-crud-sorovlar)
// ============================================================
const STATUS19 = [['GET', '200', PG.pg], ['POST', '201', T.green], ['PUT · DELETE', '200', T.green], ['topilmasa', '404', T.yellow], ['xato', '500', '#B91C1C']];
// F-1109-06: xulosa — beshta status qutichasi o'rniga «so'rov · SQL · baza javobi → status» jadvali (11-crud-sorovlar) va server.js dagi 404 satri
const ROWS19 = [
  ['GET /api/cars', 'SELECT *', ['3 ta qator', '3 строки'], '200', 's2'],
  ['POST /api/cars', 'INSERT … RETURNING *', ['yangi qator, id 4', 'новая строка, id 4'], '201', 's2'],
  ['PUT /api/cars/2', 'UPDATE … WHERE id = $2', ['rowCount: 1', 'rowCount: 1'], '200', 's2'],
  ['DELETE /api/cars/1', 'DELETE … WHERE id = $1', ['rowCount: 1', 'rowCount: 1'], '200', 's2'],
];
function Table19() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Kim qaysi statusni beradi — server.js, haqiqiy javoblar", "Кто какой статус даёт — server.js, настоящие ответы")}</p>
      <table className="z-tbl p2-s19"><tbody>
        <tr><th>{t("so'rov", "запрос")}</th><th>SQL</th><th>{t("baza javobi", "ответ базы")}</th><th /><th>status</th></tr>
        {ROWS19.map(([q, sql, [uz, ruT], st, c]) => <tr key={q}><td>{q}</td><td>{sql}</td><td>{t(uz, ruT)}</td><td className="ar">→</td><td className={'st ' + c}>{st}</td></tr>)}
        <tr className="k"><td>PUT /api/cars/99</td><td>UPDATE … WHERE id = $2</td><td><b>rowCount: 0</b>{t(" — xato emas", " — не ошибка")}</td><td className="ar">→</td><td className="st s4">404</td></tr>
        <tr><td>{t("har qaysi", "любой")}</td><td colSpan={2}>{t("baza xato berdi → catch", "база вернула ошибку → catch")}</td><td className="ar">→</td><td className="st s5">500</td></tr>
      </tbody></table>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: '#B45309' }}>
        <p className="z-h" style={{ color: '#B45309' }}>{t("404 ni rowCount hal qiladi", "404 решает rowCount")}</p>
        <div className="z-term"><span className="c">if</span> (result.rowCount === <span className="y">0</span>){'\n'}  <span className="c">return</span> res.status(<span className="y">404</span>).json({'{'} error: <span className="g">'Mashina topilmadi'</span> {'}'});</div>
        <span className="z-mut">{t("Bu tekshiruv bo'lmasa javob 200 — yolg'on «o'zgardi»", "Без этой проверки ответ 200 — ложное «изменено»")}</span>
      </div>
      <div className="z-card">
        <p className="z-h">{t("POST javobida", "В ответе POST")}</p>
        <div className="z-term">{'{'}"id":4,"model":"Chevrolet Spark",…,<span className="hl">"is_rented":null</span>{'}'}</div>
        <span className="z-mut">{t("ustun berilmadi, jadvalda DEFAULT yo'q → null", "колонку не передали, в таблице нет DEFAULT → null")}</span>
      </div>
    </div>
  </div>;
}
const S19 = mkS(19, [{ v: 'post' }, { v: 'post', nul: true }, { v: 'pd' }, { v: 'sum' }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    {seg.v === 'post' && <><SrvIde a={32} b={44} focus={['sqlp']} /><PostmanCard {...PM_POST} hl={seg.nul} />
      {seg.nul && <div className="n2-warn"><b>is_rented: null</b>{t(" — POST'da berilmagan, jadvalda ", " — не передан в POST, а в таблице ")}<code>DEFAULT</code>{t(" yo'q (3-bosqich). Yechim jadvalda: ", " нет (3-й этап). Решение в таблице: ")}<code>ALTER TABLE cars ALTER COLUMN is_rented SET DEFAULT false</code>.</div>}</>}
    {seg.v === 'pd' && <><Ide files={SRV_FILES} active="server.js">
        <CodePanel file="server.js · PUT" lines={srvSlice(50, 56)} focus={['nf']} style={{ fontSize: 12.5 }} />
        <CodePanel file="server.js · DELETE" lines={srvSlice(66, 71)} focus={['nf']} style={{ fontSize: 12.5 }} />
      </Ide>
      <div className="pg-cards3">
        <PostmanCard m="PUT" url="/api/cars/2" body={'{ "daily_price": 480000 }'} st={200} res={'{"id":2,"model":"Chevrolet Malibu","daily_price":480000,"year":2023,"is_rented":false}'} />
        <PostmanCard m="DELETE" url="/api/cars/1" st={200} res={'{"message":"O\'chirildi","deleted":1}'} />
        <PostmanCard m="PUT" url="/api/cars/99" body={'{ "daily_price": 1 }'} st={404} res={'{"error":"Mashina topilmadi"}'} hl />
      </div>
      <div className="mk-rule">{t("Baza ", "База ")}<code>UPDATE 0</code>{t(" — xato emas. Kod ", " — не ошибка. Код ")}<code>rowCount === 0</code>{t(" ni tekshirib ", " проверяет и ")}<b>404</b>{t(" beradi; usiz javob 200 bo'lardi — yolg'on «o'zgardi».", " даёт; без этого ответ был бы 200 — ложное «изменено».")}</div></>}
    {seg.v === 'sum' && <Table19 />}
  </>} />;
}

// ============================================================
//  20 · Nega $1 — injection'ni o'zimiz qildik (pg2-out/17)
// ============================================================
const INJ_BAD = js(`
const result = await pool.query('DELETE FROM cars WHERE id = ' + req.params.id); // ← yopishtirilgan`, { 1: { id: 'x' } });
const INJ_OK = js(`
const result = await pool.query('DELETE FROM cars WHERE id = $1', [
  req.params.id,
]);`, { 1: { id: 'x', neu: true }, 2: { id: 'x', neu: true }, 3: { id: 'x', neu: true } });
const INJ_AFTER_BAD = psql(String.raw`
car_rental=# SELECT id, model FROM cars;
 id | model
----+-------
(0 rows)`);
const INJ_AFTER_OK = psql(String.raw`
car_rental=# SELECT id, model FROM cars;
 id |      model
----+------------------
  3 | Kia K5
  4 | Chevrolet Spark
  2 | Chevrolet Malibu
(3 rows)`);
const S20 = mkS(20, [{ v: 'bad0' }, { v: 'bad' }, { v: 'both' }, { v: 'both', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="pg-lab" style={{ color: T.accent }}>{t("Yopishtirilgan", "Приклеено")}</div>
      <CodePanel file="server.js · DELETE" lines={INJ_BAD} focus={['x']} style={{ fontSize: 12.5 }} />
      {seg.v === 'bad' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={200} res={'{"message":"O\'chirildi","deleted":3}'} hl={seg.v === 'bad'} /><Psql title="psql — car_rental" er lines={INJ_AFTER_BAD} /></>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start', opacity: seg.v === 'both' ? 1 : 0.35 }}>
      <div className="pg-lab" style={{ color: T.green }}>{t("$1 bilan", "с $1")}</div>
      <CodePanel file="server.js · DELETE" lines={INJ_OK} style={{ fontSize: 12.5 }} />
      {seg.v === 'both' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={500} res={'{"error":"invalid input syntax for type integer: \\"1 OR 1=1\\""}'} hl /><Psql title={t("psql — car_rental · jadval joyida", "psql — car_rental · таблица на месте")} lines={INJ_AFTER_OK} /></>}
      {seg.sum && <div className="mk-rule">{t("Foydalanuvchidan kelgan har qiymat — ", "Каждое значение от пользователя — ")}<code>$1, $2</code>{t(" + massiv. SQL matniga ", " + массив. В текст SQL ")}<b>{t("hech qachon", "никогда")}</b>{t(" yopishtirilmaydi: bu uslub emas, xavfsizlik.", " не приклеивается: это не стиль, а безопасность.")}</div>}
    </div>
  </div>} />;
}

// ============================================================
//  21 · Amaliyot 3 — AvtoIjara server (kod: namuna, nusxalash yo'q)
// ============================================================
const P21 = mkPractice(21, [[], [0, 1], [2, 3], []], { code: [{ file: 'server.js', step: 2, lines: SERVER_LINES, copy: false }], tree: MKCFG.files });
function ScreenP21(p) { return <Practice p={p} S={P21.S} steps={P21.steps} trouble={P21.trouble} proof={P21.proof} code={P21.code} tree={P21.tree} />; }

// ============================================================
//  22 · Buzamiz 1: price ustuni (pg2-out/12, 19) — POST bo'lagi 32–44, xato 36-satr
// ============================================================
// F-1120-02 (M52): 1-segment (x) — mentor 36-satrdagi daily_price ni o'zi bosadi; 'ok' holatida so'z yonib turadi (data-act)
const POST_LINES = (st) => srvSlice(32, 44).map((l, i) => {
  if (i !== 4) return l;
  if (st === 'bad') return { ...l, h: jsLine("      'INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *',"), id: 'x' };
  if (st === 'ok') return { ...l, id: 'x', h: l.h.replace('daily_price', '<span class="n1-act" data-act="1">daily_price</span>') };
  return { ...l, id: 'x', neu: st === 'fix' };
});
const PRICE_TERM = psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti
column "price" of relation "cars" does not exist`, { 3: { id: 'e' } });
const S22 = mkS(22, [{ st: 'ok' }, { st: 'bad' }, { st: 'bad', pm: 500 }, { st: 'fix', pm: 201 }, { sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={(b) => <Scene22 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi (javob «?») · 2 POST → 500, bo'laklar 1·2 · 3 tuzatildi → 201 · 4 xulosa — darsning rasmi
// Postman chiqqan qadamlarda kod 35–42-satr (1280×720 da kichik rasm va javob ko'rinib tursin)
function Scene22({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const st = beat === 0 ? (act.hit ? 'bad' : 'ok') : seg.st;
  if (seg.sum) return <>
    <div className="mk-light" style={{ padding: 14 }}>
      <CrudMachine path="api" on={['pm', 'json', 'route', 'pool', 'cars']} st={500} res={'{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}'}
        req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }' }}
        sql={"INSERT … (model, <b style=\"color:#DC2626\">price</b>, …)"} col={'id · model · <b style="color:#12805A">daily_price</b>'} bad={{ at: 'cars', why: t("cars'da price ustuni yo'q", 'в cars нет колонки price') }}
        back="catch → res.status(500)" ro={['\\d cars', 'Column: id · model · <span class="n1-ok">daily_price</span> · year · is_rented']}
        tag={t("Xabardagi nom — jadvaldagi nom bilan solishtiring", 'Имя из сообщения — сравните с именем в таблице')} />
    </div>
    <div className="mk-rule">{t("Xabar nimani tuzatishni ", "Что исправить, сообщение ")}<b>{t("o'zi aytdi", "сказал сам")}</b>{t(": ustun ", ": колонка ")}<code>price</code>{t(", jadval ", ", таблица ")}<code>cars</code>{t(". Kod o'zgargandan keyin serverni albatta qayta ishga tushiring.", ". После изменения кода обязательно перезапустите сервер.")}</div>
  </>;
  return <>
    <Ide files={SRV_FILES} active="server.js">
      <div onClick={act.onClick}><CodePanel key={st + (seg.pm ? 'p' : '')} file="server.js" lines={seg.pm ? POST_LINES(st).slice(3, 11) : POST_LINES(st)} focus={['x']} style={{ fontSize: 12.5 }} /></div>
      <N1Mini><CrudMini broken={st === 'ok' ? null : 'col'} known={beat >= 2} fixed={st === 'fix'} pins={beat === 2 ? { a: 1, b: 2 } : {}} /></N1Mini>
    </Ide>
    {seg.pm === 500 && <div className="pg-two"><PostmanCard {...PM_ELANTRA(500)} res={'{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}'} hl /><Psql title={t("terminal — node server.js", "терминал — node server.js")} er lines={PRICE_TERM} focus={['e']} marks={{ 2: 'n1-p1' }} /></div>}
    {seg.pm === 201 && <PostmanCard {...PM_ELANTRA(201)} hl />}
  </>;
}

// ============================================================
//  23 · Buzamiz 2: express.json() yo'q (pg2-out/13) — 16–18-satrlar
// ============================================================
// F-1120-02 (M52): 'ok' — 18-satr yonib turadi (data-act), mentor bosgach 'gone'
const JSON_LINES = (st) => srvSlice(16, 18).map((l, i) => (i === 2 ? { ...l, id: 'j', gone: st === 'gone', neu: st === 'fix', ...(st === 'ok' ? { h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : {}) } : l));
// F-1109-06: xulosa — kod yashirilib uch quti qolardi; endi bitta POST ikki yo'lda (13-express-json-yoq), satr joyi va belgisi
function Two23() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Bitta POST — ikki yo'l", "Один POST — два пути")}</p>
      <div className="z-term"><span className="m">POST /api/cars</span>  {'{'} "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 {'}'}</div>
      <div className="z-flow">
        <div className="z-st bad"><b>{t("app.use(express.json()) yo'q", "app.use(express.json()) нет")}</b><span className="z-mut">{t("tana o'qilmaydi", "тело не читается")}</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>req.body</b><span className="zm">undefined</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>{t("javob", "ответ")}</b><span className="z-tag r">500</span><span className="zm" style={{ fontSize: 12 }}>Cannot destructure property 'model' of 'req.body' as it is undefined.</span></div>
      </div>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("app.use(express.json()) bor", "app.use(express.json()) есть")}</b><span className="z-mut">{t("JSON tana obyektga aylanadi", "JSON-тело становится объектом")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>req.body</b><span className="zm">{'{'} model, daily_price, year {'}'}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("javob", "ответ")}</b><span className="z-tag g">201</span><span className="zm" style={{ fontSize: 12 }}>{'{'}"id":5,"model":"Hyundai Elantra",…{'}'}</span></div>
      </div>
    </div>
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("server.js — joyi", "server.js — место")}</p>
        <div className="z-term"><span className="c">const</span> app = express();{'\n'}<span className="hl">app.use(express.json());</span></div>
        <span className="z-mut">{t("app yaratilgandan keyin, endpoint'lardan oldin — har so'rovdan oldin ishlaydi", "после создания app, до endpoint — срабатывает перед каждым запросом")}</span>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--pg)' }}>
        <p className="z-h" style={{ color: 'var(--pg)' }}>{t("Belgisi", "Признак")}</p>
        <div><span className="z-tag g">GET 200</span> <span className="z-tag r">POST 500</span></div>
        <span className="z-mut">{t("Server «ishlayapti» deydi, GET ishlaydi — tanasi bor so'rov (POST, PUT) yiqiladi. Birinchi qaraladigan joy — shu satr.", "Сервер говорит «работает», GET работает — падает запрос с телом (POST, PUT). Первое, куда смотреть, — эта строка.")}</span>
      </div>
    </div>
  </div>;
}
const S23 = mkS(23, [{ st: 'ok' }, { st: 'gone' }, { st: 'gone', pm: 500 }, { st: 'fix', pm: 201 }, { sum: true }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={(b) => <Scene23 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 o'chdi (GET ishlaydi, POST «?») · 2 POST → 500, bo'lak 1 · 3 qaytdi → 201 · 4 xulosa (Two23)
function Scene23({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const st = beat === 0 ? (act.hit ? 'gone' : 'ok') : seg.st;
  if (seg.sum) return <Two23 />;
  return <>
    <Ide files={SRV_FILES} active="server.js">
      <div onClick={act.onClick}><CodePanel key={st} file="server.js" lines={JSON_LINES(st)} focus={['j']} style={{ fontSize: 12.5 }} /></div>
      <N1Mini><CrudMini broken={st === 'ok' ? null : 'json'} known={beat >= 2} fixed={st === 'fix'} pins={beat === 2 ? { a: 1 } : {}} /></N1Mini>
    </Ide>
    {st === 'gone' && !seg.pm && <div className="mk-tag" style={{ margin: 0 }}>{t("Server baribir «Server 3000-portda ishlayapti» · GET ishlaydi — muammo faqat tanasi bor so'rovlarda (POST, PUT)", "Сервер всё равно «Server 3000-portda ishlayapti» · GET работает — проблема только в запросах с телом (POST, PUT)")}</div>}
    {seg.pm === 500 && <PostmanCard {...PM_ELANTRA(500)} res={'{"error":"Cannot destructure property \'model\' of \'req.body\' as it is undefined."}'} hl />}
    {seg.pm === 201 && <PostmanCard {...PM_ELANTRA(201)} hl />}
  </>;
}

// ============================================================
//  24 · Ulanish xatolari — birinchi so'rovda (pg2-out/14, 15)
// ============================================================
const CONN24 = [
  { h: 'Parol xato', code: "const PASSWORD = 'notogri';", st: 500, res: '{"error":"password authentication failed for user \\"postgres\\""}', fix: "o'rnatishda berilgan parol" },
  { h: "Parol bo'sh (process.env o'qilmagan)", code: 'const PASSWORD = process.env.DB_PASSWORD;', st: 500, res: '{"error":"SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"}', fix: "parol o'zgaruvchisi bo'sh" },
  { h: 'Baza nomi xato', code: "const DATABASE = 'carrental';", st: 500, res: '{"error":"database \\"carrental\\" does not exist"}', fix: '\\l bilan aniq nom: car_rental' },
  { h: "PostgreSQL o'chiq", code: "— (server to'xtatilgan)", st: 500, res: '{"error":""}', fix: "console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring" },
];
const ECONN = psql(String.raw`
$ node server.js     (console.error(err.message) o'rniga console.error(err))
Server 3000-portda ishlayapti
AggregateError [ECONNREFUSED]:
    at …/node_modules/pg-pool/index.js:45:11
    at async …/server.js:17:20 {
  code: 'ECONNREFUSED',
  [errors]: [
    Error: connect ECONNREFUSED ::1:5432`, { 3: { id: 'e' }, 6: { id: 'e' }, 8: { id: 'e' } });
const S24 = mkS(24, [{ show: [], start: true }, { show: [0, 1] }, { show: [2] }, { show: [3], econn: true }, { show: [0, 1, 2, 3] }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    <Psql title={t("terminal — har to'rt holatda", "терминал — во всех четырёх случаях")} lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} />
    {seg.start && <div className="mk-rule">Pool server ishga tushganda ulanmaydi (17-ekran) — <b>birinchi so'rovda</b>. «Ishlayapti» faqat Express haqida.</div>}
    <div className="pg-two">{CONN24.map((c, i) => seg.show.includes(i) && <div key={i} style={{ display: 'grid', gap: 6, animation: 'mk-up .4s ease both' }}>
      <div className="pg-lab">{c.h} · <code style={{ textTransform: 'none' }}>{c.code}</code></div>
      <PostmanCard m="GET" url="/api/cars" st={c.st} res={c.res} />
      <div className="exp" style={{ fontSize: 12.5, color: T.green }}>Tuzatish: {c.fix}</div>
    </div>)}</div>
    {seg.econn && <Psql title="terminal — butun xato obyekti" er lines={ECONN} focus={['e']} />}
  </>} />;
}

// ============================================================
//  25 · Port band — «ishlayapti», lekin eski server (pg2-out/16, 20)
// ============================================================
const PORT25 = psql(String.raw`
$ node server.js   (ikkinchi oynada, birinchisi ishlab turibdi)
Server 3000-portda ishlayapti
[chiqish kodi: 0]`, { 2: { id: 'x' }, 3: { id: 'x' } });
const EXPRESS_SRC = js(String.raw`
// node_modules/express/lib/application.js (express 5.3.0)
app.listen = function listen() {
  var server = http.createServer(this)
  …
    server.once('error', done)   // xato callback'ga beriladi
  …
}
// server.js — callback xatoni o'qimaydi:
app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));`, { 5: { id: 'e' }, 9: { id: 'cb' } });
const S25 = mkS(25, [{ v: 'q' }, { v: 'two' }, { v: 'src' }, { v: 'sum' }]);
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg }) => <>
    {seg.v === 'q' && <div className="pg-two"><div className="mk-card"><h5>{t("Mentor yoki o'quvchi", "Ментор или ученик")}</h5><div style={{ fontSize: 15 }}>{t("«Kodni tuzatdim, ", "«Исправил код, ")}<code>node server.js</code>{t(" qildim — javob o'zgarmadi»", " сделал — ответ не изменился»")}</div></div><div className="mk-card"><h5>{t("Sabab ko'pincha", "Причина обычно")}</h5><div style={{ fontSize: 15 }}>{t("birinchi server boshqa terminalda hali ishlab turibdi", "первый сервер ещё работает в другом терминале")}</div></div></div>}
    {seg.v !== 'q' && <div className="pg-two">
      <div><div className="pg-lab">{t("1-oyna · eski server", "1-е окно · старый сервер")}</div><Psql title={t("terminal 1", "терминал 1")} lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} /></div>
      <div><div className="pg-lab">{t("2-oyna · yangi kod ", "2-е окно · новый код ")}<span className="tm">{t("xato yo'q", "ошибки нет")}</span></div><Psql title={t("terminal 2", "терминал 2")} lines={PORT25} focus={seg.v === 'two' ? ['x'] : []} /></div>
    </div>}
    {(seg.v === 'src' || seg.v === 'sum') && <CodePanel file={t("nega — Express manbasi", "почему — исходник Express")} lines={EXPRESS_SRC} focus={seg.v === 'src' ? ['e', 'cb'] : []} style={{ fontSize: 12.5 }} />}
    {seg.v === 'sum' && <div className="mk-rule">{t(<>Bitta loyiha — <b>bitta terminal</b>. Qayta ishga tushirishdan oldin <code>Ctrl+C</code>. «O'zgarmadi» desa — birinchi savol: boshqa terminalda server ochiq qolmadimi?</>, <>Один проект — <b>один терминал</b>. Перед перезапуском — <code>Ctrl+C</code>. Если говорят «не изменилось» — первый вопрос: не остался ли сервер открыт в другом терминале?</>)}</div>}
  </>} />;
}

// ============================================================
//  26 · Tekshiruv 4 — qaysi satr 500 beradi (LineCheck; fayl satrlari 32–43, xato 36 → target 4)
// ============================================================
const LC26 = srvSlice(32, 43).map((l, i) => (i === 4 ? { ...l, h: jsLine("      'INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *',") } : l)).map((l) => ({ h: l.h, n: l.n }));
const LC26_FIXED = LC26.map((l, i) => ({ ...l, ...(i === 4 ? { gone: true } : {}) }));
LC26_FIXED.splice(5, 0, { h: jsLine("      'INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *',"), n: 36, neu: true });
function plainLinesPm(src) { return src.split('\n').map((l) => ({ h: `<span class="ok">${escH(l)}</span>` })); }
function Screen26(p) {
  const m = MDT[26];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="server.js" lines={LC26} target={4}
    tree={{ root: MKCFG.root, files: MKCFG.files, active: 'server.js' }}
    fixed={LC26_FIXED} fixedExtra={[{ file: t('Postman — haqiqiy javob', "Postman — настоящий ответ"), lines: plainLinesPm(`POST /api/cars → 201\n{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}`) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  27 · Amaliyot 4 — o'zingiz buzing
// ============================================================
const P27 = mkPractice(27, [[], [0, 1], [2, 3], []]);
function ScreenP27(p) { return <Practice p={p} S={P27.S} steps={P27.steps} trouble={P27.trouble} proof={P27.proof} />; }

// ============================================================
//  28 · Sinfga tayyorgarlik: m4-06 va m4-08 xaritasi (M41: faqat shu ikki ekran o'quvchi darsi haqida)
// ============================================================
const CLS28 = [
  { n: 'm4-06', s: '21 ekran', t: "PostgreSQL so'rovlar — CRUD + AI bilan", d: ["do'kon tugmalar bilan: INSERT · SELECT · WHERE · UPDATE · DELETE", "jadval — bugun siz yaratgan products'ning aynan o'zi", "amaliyot: haqiqiy PostgreSQL terminali yoki VS Code + AI — o'z do'koni"] },
  { n: 'm4-08', s: '9 ekran', t: 'Praktika: Backend CRUD — AvtoIjara', d: ["cars jadvali — terminalda qo'lda", "server.js — Gemini'dan, Postman bilan sinov", "AI xatosini topish: price → daily_price"] },
];
const ADD28 = [['javobdagi son (UPDATE 1 / 0)', 'm4-06 CRUD bloki'], ["WHERE'siz — proyektorda BEGIN … ROLLBACK", 'm4-06 UPDATE/DELETE'], ["ORDER BY — «o'rni o'zgardi» savoli", 'm4-06 SELECT'], ["apostrof '', NOT NULL maslahati", "m4-06 amaliyoti (o'z do'koni)"], ['HINT ham adashadi', 'm4-06 AI xatosi bloki'], ["To'rt farq: xato matni qisqa · Gemini kodi har xil · is_rented: null · port band «ishlayapti»", 'm4-08']];
const PRE28 = ["Har kompyuterda PostgreSQL terminali ochiladi va Postman o'rnatilgan", "Sinf paroli hammaga ma'lum", 'Qoida: bitta loyiha — bitta terminal', "Vaqt: m4-06 da 90 daqiqaning 25 tasi amaliyotga · m4-08 da 40 tasi server va Postman'ga"];
const S28 = mkS(28, [{ v: 'cards', hl: 0 }, { v: 'cards', hl: 1 }, { v: 'add' }, { v: 'pre' }]);
function Screen28(p) {
  return <Lesson p={p} S={S28} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">{CLS28.map((c, i) => <div key={c.n} className="mk-card" style={{ borderColor: seg.hl === i ? T.accent : T.line, opacity: seg.hl === i ? 1 : 0.5, transition: 'opacity .3s' }}>
      <h5 style={{ color: T.accent }}>{c.n} · {c.s}</h5><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.t}</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.55 }}>{c.d.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>}
    {seg.v === 'add' && <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("Siz qo'shasiz — qayerda", "Вы добавляете — где")}</div>
      <table className="pg-dict"><tbody>{ADD28.map(([a, b], i) => <tr key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.08}s ease both` }}><td style={{ borderLeftColor: T.accent }}>{a}</td><td>→</td><td style={{ color: T.ink2 }}>{b}</td></tr>)}</tbody></table></div>}
    {seg.v === 'pre' && <div style={{ display: 'grid', gap: 8 }}>{PRE28.map((x, i) => <div key={i} className="mk-step hl" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span><div className="t"><b>{x}</b></div></div>)}</div>}
  </>} />;
}

// ============================================================
//  29 · Qoqiladigan olti joy va o'quvchi savollari
// ============================================================
const STUMBLE29 = [
  ['Jadval/ustun nomi', 'relation "product" · column "narx" (+ HINT)', '\\d jadval bilan solishtirish'],
  ['Apostrof', 'syntax error at or near "yinchoq"', "''"],
  ["WHERE'siz", 'UPDATE 3 / DELETE 3', "BEGIN … ROLLBACK; o'chgan bo'lsa — qayta INSERT"],
  ['Parol/baza', 'password authentication failed · client password must be a string · database … does not exist', 'Pool sozlamalari, sinf paroli'],
  ["Bo'sh xato", '{"error":""}', "console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring"],
  ["O'zgarmadi", 'javob eski', 'ikkinchi terminal; Ctrl+C'],
];
const QA29 = [
  ["«Nega mahsulot o'rni o'zgardi?»", "ORDER BY yo'q — baza yangilangan qatorni yangi joyga yozadi (6-ekran); ORDER BY id."],
  ['«$1 nima?»', "qiymat alohida beriladi, SQL matniga kirmaydi; 1 OR 1=1 misoli (20-ekran)."],
  ['«Postman shartmi?»', "yo'q, so'rov yuboradigan istalgan dastur; darsda Postman, chunki sinf uchun qulay."],
  ["«NestJS'da ham shunday yozamizmi?»", "yo'q: Nest'da Repository bu so'rovlarni o'zi yozadi (find, save…). Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz."],
  ['«SQL katta harfda yozilishi shartmi?»', "yo'q, kalit so'zlar kichik harfda ham ishlaydi (sinab ko'rdik: select name, price from PRODUCTS ishladi); katta harf — o'qish oson bo'lishi uchun odat."],
];
const S29 = mkS(29, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5], qa: true }]);
function Screen29(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S29} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE29.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b>{!seg.qa && <><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></>}</button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>{t("Javobni darhol aytmang — ", "Не говорите ответ сразу — ")}<b>{t("xabarni o'quvchi bilan birga o'qing", "читайте сообщение вместе с учеником")}</b>{t(": jadval/ustun nomi, status, terminal.", ": имя таблицы/колонки, статус, терминал.")}</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">{t("O'quvchi so'rasa — bosing", "Если ученик спросит — нажмите")}</div>
      <div className="pg-qa">{QA29.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  30 · O'z-sinov — 8 savol (M12; mexanika PG-1 bilan bir xil)
// ============================================================
const FINAL = MDT[30].final;
function Screen30(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: CRUD, tranzaksiya, Pool va server xatolari. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi m4-06 va m4-08 dagi xatolar sinfda sizga tanish bo'ladi.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  31 · Yakun (M13, M14) — xulosa 6 band, uyga vazifa 5 qadam, eslatma
// ============================================================
const SUM31 = [
  { k: 'crud', t: "CRUD = INSERT · SELECT · UPDATE · DELETE; javobdagi son — nechta qator tegildi; RETURNING — qatorning o'zi; ORDER BY siz tartib kafolatlanmaydi (ctid)", st: ['psql'] },
  { k: 'tx', t: "Tranzaksiya: autocommit · BEGIN → faqat sizning seansingizda → COMMIT / ROLLBACK; !# — aborted, faqat ROLLBACK; ikki jadval bitta ish — atomik", st: ['psql', 'tx'] },
  { k: 'rule', t: "Baza faqat yozilgan qoidani qo'riqlaydi: NOT NULL, DEFAULT, UNIQUE, CHECK; xabar ichida nom bor — \\d bilan solishtiring; apostrof ''", st: ['jad'] },
  { k: 'exp', t: 'Express: Pool birinchi so\'rovda ulanadi va ulanishni qayta ishlatadi → pool.query(sql, [$1…]) → rows / rowCount → res.json; 200 · 201 · 404 · 500', st: ['pm', 'srv', 'pool'] },
  { k: 'brk', t: "$1 — xavfsizlik: yopishtirilgan 1 OR 1=1 jadvalni bo'shatdi; server xatolari: ustun nomi · express.json() · parol/baza birinchi so'rovda · bo'sh xabar → console.error(err) · ikkinchi server «ishlayapti»", st: ['srv', 'pool'] },
  { k: 'class', t: "Sinf: m4-06 amaliyoti haqiqiy psql'da; m4-08 dan oldin parol, Postman, bitta terminal; olti holat va savollarga javoblar tayyor", st: ['pm', 'psql'] },
  { k: 'ai', t: "AI yozgan SQL: fe'l topshiriqqa mosmi (o'chirish — DELETE, ALTER/DROP emas) · nomlar \\d bilan · javobdagi son · oxirida SELECT *", st: ['psql'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (CrudMachine); har band rasmning o'z yo'lini yoritadi
const PS31 = { psql: ['psql', 'shop'], api: ['pm', 'json', 'route', 'pool', 'cars'] };
const MAP31 = {
  crud: { path: 'psql', on: PS31.psql, psqlLine: ['shop=#', 'UPDATE products SET price = 99000 WHERE id = 1;', 'UPDATE 1'] },
  tx: { path: 'psql', on: PS31.psql, psqlLine: ['shop=!#', 'ROLLBACK;', 'ROLLBACK'] },
  rule: { path: 'psql', on: PS31.psql, psqlLine: ['shop=*#', 'UPDATE products SET stock = stock - 7 WHERE id = 3;', 'ERROR: … violates check constraint "stock_nonneg"'] },
  exp: { path: 'api', on: PS31.api, st: 201, back: 'rows[0] → res.status(201).json' },
  brk: { path: 'api', on: PS31.api, st: 500, back: 'catch → res.status(500)' },
  ai: { path: 'psql', on: PS31.psql, psqlLine: ['shop=#', "DELETE FROM products WHERE name = 'Kolonka';", 'DELETE 1'] },
  class: { path: 'both', on: ['pm', 'psql'], st: 201, back: 'rows[0] → res.status(201).json' },
};
function SummaryMap31({ hl }) {
  const m = MAP31[hl] || { path: 'both', st: 201, back: 'rows[0] → res.status(201).json' };
  return <div className="mk-light" style={{ padding: 14 }}>
    <CrudMachine {...m} res={m.st === 500 ? '{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}' : '{"id":4,"model":"Chevrolet Spark",…}'}
      req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }' }}
      tag={t("Bugungi dars — so'rovning bazagacha yo'li", 'Сегодняшний урок — путь запроса до базы')} max={0.95} />
  </div>;
}
const HOMEWORK31 = [
  { t: "Jadvallar — schema.sql: products (NOT NULL nom va narx, CHECK (stock >= 0), DEFAULT 0), orders (REFERENCES products(id), CHECK (qty > 0), created_at DEFAULT now())", c: ['psql -U postgres -d <baza> -f schema.sql'] },
  { t: 'Server — server.js: GET · POST (201, RETURNING *) · PUT · DELETE (rowCount → 404), hamma qiymat $1 bilan', c: ['node server.js'] },
  { t: "Sinov — Postman: 4 so'rov + yo'q id → 200 · 201 · 200 · 200 · 404", c: [] },
  { t: "Tranzaksiya — psql: BEGIN → UPDATE … stock - 1 … RETURNING → INSERT INTO orders → COMMIT; keyin yetmagan qoldiq → CHECK xatosi → ROLLBACK — ikkala chiqish README'ga", c: [] },
  { t: "Topshirish — GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "shop-api"', 'git push'] },
];
const CHEATSHEET31 = `# PostgreSQL-2 — mentor eslatmasi (CRUD, tranzaksiya, Express)
## CRUD (psql) va javobdagi son
INSERT INTO products (name, price, stock) VALUES (…) → INSERT 0 n · SELECT * / SELECT name, price · WHERE price < 100000 · UPDATE … SET … WHERE id = 1 → UPDATE 1 · DELETE … WHERE id = 3 → DELETE 1
Son: 1 — kutganingiz · 0 — WHERE hech narsaga mos kelmadi (xato emas) · katta son — WHERE noto'g'ri/yo'q · RETURNING — o'zgargan qatorning o'zi
ORDER BY yo'q — tartib fayldagidek (UPDATE yangi nusxa yozadi: ctid (0,5) → (0,6)) → ORDER BY id
## Tranzaksiya
autocommit: har buyruq darhol · BEGIN → faqat sizning seansingizda (B seansi eski qiymatni ko'radi) → COMMIT saqlaydi / ROLLBACK bekor · prompt: =# oddiy · =*# ochiq · =!# xato (aborted) — faqat ROLLBACK, COMMIT ham ROLLBACK qaytaradi
Atomik: ikki jadval bitta ish — UPDATE stock + INSERT orders bitta BEGIN … COMMIT ichida; CHECK rad etsa — hech biri saqlanmaydi
## Baza qo'riqlaydi
Qoida yozilmasa — qo'riqlamaydi (nomsiz qator saqlanadi). NOT NULL (avval bo'sh qatorlarni tozalang) · DEFAULT 0 · UNIQUE (name) → duplicate key value · CHECK (stock >= 0) · \\d products — hammasi bir joyda
## SQL xatolari (xabar ichida nom bor)
relation "product" / column "narx" (HINT ham adashadi) → \\d bilan solishtirish · 'arzon' → invalid input syntax for type integer · ustun/qiymat soni → more target columns than expressions · apostrof → '' (O''yinchoq)
## Express → baza
Pool: yaratilganda ulanmaydi, birinchi so'rovda ulanadi, ulanishni qayta ishlatadi (3 so'rov — bitta pid) · pool.query(sql, [qiymatlar]) → result.rows / result.rowCount · res.json · GET 200 · POST 201 (RETURNING *) · PUT/DELETE 200 · rowCount 0 → 404 · catch → 500
Nega $1: yopishtirilgan '… WHERE id = ' + id va URL "1 OR 1=1" → hamma qator o'chdi (deleted: 3); $1 bilan → 500 invalid input syntax, jadval joyida
## Server xatolari
column "price" of relation "cars" does not exist → kodda ustun nomi (\\d cars) · Cannot destructure property 'model' of 'req.body' → app.use(express.json()) · password authentication failed → parol · client password must be a string → parol bo'sh (process.env) · database "…" does not exist → nom · {"error":""} → console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring
«Server … ishlayapti» faqat Express haqida — baza xatosi birinchi so'rovda · Port band: Express 5 da ikkinchi server ham «ishlayapti» deb xato bermay chiqadi, eski server javob beradi → bitta terminal, Ctrl+C
## Sinfga tayyorgarlik
m4-06 (21 ekran): amaliyot haqiqiy PostgreSQL terminalida — har kompyuterda PostgreSQL; siz qo'shasiz: javobdagi son, BEGIN … ROLLBACK proyektorda, ORDER BY, apostrof va NOT NULL maslahati, HINT ham adashadi
m4-08 (9 ekran): sinf paroli, Postman, bitta terminal; to'rt farq — xato matni qisqa · Gemini kodi har xil · is_rented null (DEFAULT yo'q) · port band «ishlayapti»
## AI yozgan SQL
fe'l topshiriqqa mosmi: ko'rish SELECT · o'zgartirish UPDATE · o'chirish DELETE · qo'shish INSERT; ALTER / DROP — so'ralmagan bo'lsa yurgizilmaydi (DROP COLUMN stock → ALTER TABLE, so'roqsiz, hamma qatordan qiymat yo'qoladi) · nomlar \\d products bilan (AI tuzilishni bilmasa o'ylab topadi: relation "mahsulotlar" does not exist) · javobdagi son · oxirida SELECT * · haqiqiy AI «Kolonkani o'chir»ni ustun deb tushundi (ikkalasi) · butun javobni nusxalamang: shablondagi <…> xatosi tranzaksiyani buzadi, keyingi INSERT ham bajarilmaydi
## Sizning uyga vazifangiz (50–70 daqiqa)
shop-api: schema.sql (products NOT NULL + CHECK, orders FK) + server.js (4 endpoint, $1, 404) + README (5 so'rov va javobi, BEGIN…COMMIT sotuv va CHECK xatosi) → GitHub → repo linki platformadagi uyga vazifaga`;
const s31Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CRUD — to'rt buyruq; <b>javobdagi son</b> va RETURNING; ORDER BY siz tartib kafolatlanmaydi", "Birinchi: CRUD to'rt buyruq, insert, select, update va delete. Javobdagi son nechta qator tegilganini aytadi, returning esa qatorning o'zini qaytaradi. Order by yozilmasa tartib kafolatlanmaydi: baza yangilangan qatorni yangi joyga yozadi.", { hl: 'crud' }),
  sg('b2', "Tranzaksiya: <b>BEGIN — faqat sizning seansingizda</b>, COMMIT yoki ROLLBACK; ikki jadval — bitta ish", "Ikkinchi: oddiy holatda har buyruq darhol saqlanadi. Begin'dan keyin o'zgarish faqat sizning seansingizda, commit saqlaydi, rollback bekor qiladi. Undov belgisi chiqsa, faqat rollback. Bir ishga tegishli buyruqlar bitta tranzaksiyada: yo hammasi, yo hech biri.", { hl: 'tx' }),
  sg('b3', "Baza <b>faqat yozilgan qoidani</b> qo'riqlaydi; xabardagi nomni \\d bilan solishtiring", "Uchinchi: baza faqat yozilgan qoidani qo'riqlaydi: not null, default, unique va check. Har xabar ichida jadval yoki qoida nomi bor, uni backslash d bilan solishtiring. Apostrof ikki marta yoziladi.", { hl: 'rule' }),
  sg('b4', "Express: <b>Pool birinchi so'rovda ulanadi</b> → pool.query → rows / rowCount → res.json", "To'rtinchi: Express'dan bazaga yo'l. Pool bir marta sozlanadi, birinchi so'rovda ulanadi va ulanishni qayta ishlatadi. Pool query so'rov yuboradi, natijadan rows yoki rowcount olinadi, res json javob qaytaradi. Statuslar: ikki yuz, ikki yuz bir, to'rt yuz to'rt, besh yuz.", { hl: 'exp' }),
  sg('b5', "<b>$1 — xavfsizlik</b>; server xatolari: ustun nomi, express.json, parol, bo'sh xabar, ikkinchi server", "Beshinchi: foydalanuvchidan kelgan qiymat doim dollar bir bilan, yopishtirilgan matn butun jadvalni bo'shatdi. Server xatolari: ustun nomi, express json, parol va baza birinchi so'rovda. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. Ikkinchi server ham ishlayapti deydi.", { hl: 'brk' }),
  sg('b6', "Sinf: m4-06 amaliyoti <b>haqiqiy psql'da</b>; m4-08 dan oldin parol, Postman, bitta terminal", "Oltinchi, sinf uchun: m4-06 amaliyoti haqiqiy PostgreSQL terminalida, har kompyuterda PostgreSQL kerak. m4-08 dan oldin sinf paroli, Postman va bitta terminal qoidasi. Olti holat va o'quvchi savollariga javoblar sizda tayyor.", { hl: 'class' }),
  sg('b7', "AI yozgan SQL: <b>fe'l, nom va son</b>; ALTER yoki DROP so'ralmagan bo'lsa — yurgizmang", "Yettinchi: AI yozgan SQL'ni fe'l, nom va son bilan tekshiring. O'chirish delete bo'lishi kerak; alter yoki drop so'ralmagan bo'lsa, uni yurgizmang. Haqiqiy AI kolonkani ustun deb tushundi, buni o'z ko'zingiz bilan ko'rdingiz.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z do'koningiz uchun shop-api — ikki jadval, to'rt endpoint, README", "Uyga vazifa: o'z do'koningiz uchun shop api. Schema faylida ikki jadval: mahsulotlar not null va check stock katta yoki teng nol bilan, buyurtmalar tashqi kalit bilan. Server js'da to'rt endpoint, hamma qiymat dollar bir bilan, topilmasa to'rt yuz to'rt. README'da har endpoint uchun bitta so'rov va javobi.", { hl: 'hw' }),
  sg('hw2', "Terminalda <b>bitta sotuv va CHECK xatosi</b> — README'ga; repo linki platformaga", "Terminalda bitta sotuvni begin, update, insert va commit bilan qiling, keyin yetmagan qoldiqda check xatosini oling: ikkalasini README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying. Ellik-yetmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: CRUD, tranzaksiya, qoidalar, xatolar va server — bir sahifada", "Pastda bir sahifalik eslatma: CRUD va javobdagi son, tranzaksiya holatlari, baza qoidalari, SQL va server xatolari, Express yo'li va sinfga tayyorgarlik. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen31(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET31, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('postgresql-2-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s31Segments(passed), [passed]);
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
            <SummaryMap31 hl={hl} />
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda (1-ekrandagi reja kabi) — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM31.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 50–70 daqiqa', 'Домашнее задание · 50–70 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK31.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" NOT NULL / CHECK · $1 (yopishtirish yo'q) · 404 · README'da 5 so'rov, COMMIT va CHECK xatosi.", " NOT NULL / CHECK · $1 (без склеивания) · 404 · в README 5 запросов, COMMIT и ошибка CHECK.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Kursdagi keyingi mentor darsi", "Следующий урок курса для менторов")}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("NestJS arxitekturasi — Module, Controller, Service", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Express'dagi shu CRUD Nest'da qanday tartib bilan yoziladi", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · PostgreSQL", "Курс для менторов · PostgreSQL")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["psql'da CRUD va tranzaksiyani javobdagi son bilan tekshirasiz", "Express'dan bazaga so'rov yuborasiz: Pool, $1, rows va statuslar", "server 500 berganda xabardan sababini topasiz va sinfga tayyor bo'lasiz"], ['проверите CRUD и транзакции в psql по числу в ответе', 'отправите запрос из Express в базу: Pool, $1, rows и статусы', 'найдёте по сообщению причину 500 на сервере и будете готовы к классу']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 20 daqiqa, 13-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: PostgreSQL-1 o'tilgan, PostgreSQL ishlab turgan, Node.js 20+, VS Code, Postman", 'Урок со звуком · 1 час 20 минут, после 13-го экрана можно сделать перерыв · Нужно: пройден PostgreSQL-1, работающий PostgreSQL, Node.js 20+, VS Code, Postman')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><CrudMachine path="both" st={201} back="rows[0] → res.status(201).json" newRow={3} cars={CARS1} prods={PRODS1} res='{"id":4,"model":"Chevrolet Spark",…}' req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenP8, Screen9, Screen10, Screen11, Screen12, ScreenP13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, Screen20, ScreenP21, Screen22, Screen23, Screen24, Screen25, Screen26, ScreenP27, ScreenAI, ScreenLCAI, Screen28, Screen29, Screen30, Screen31];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function PgCrudMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/pg2-*.json, ru/pg2-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/pg2-sahna.js) ---
// PG-2 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['CRUD в терминале', 'Транзакция: безопасная проверка и атомарное дело', 'База охраняет', 'Из Express в базу', 'Ломаем и чиним', 'SQL от ИИ', 'Подготовка к классу'] },
};
ru(CRUD, [[null, null, 'создать', null, null, null, null, null], [null, null, 'прочитать', null, null, null, null, null], [null, null, 'изменить', null, null, null, null, null], [null, null, 'удалить', null, null, null, null, null]]);
RU_S.MG3 = `await mongoose.connect('mongodb://localhost/shop')
базы: admin · config · local          (shop ещё нет)
await Product.create([ …4 шт… ])         → 4 документа
базы: admin · config · local · shop`;
ru(PAGE6, [[null, 'Klaviatura · 120000 · 8 — первая копия', null], null, [null, 'Quloqchin — удалена (экран 5)', null], null, [null, 'Klaviatura · 99000 · 8 — копия, записанная при смене цены', null], [null, 'Klaviatura · 99000 · 7 — текущая строка', null]]);
ru(STATES10, [[null, 'обычное — каждая команда сохраняется сразу (autocommit)'], [null, 'транзакция открыта — изменения видны только в этом сеансе'], [null, 'была ошибка (aborted) — только ROLLBACK']]);
ru(RULES14, [null, null, null, null, null, null, [null, 'CHECK (stock >= 0) — экран 11', null], null, [null, 'product_id REFERENCES products(id) — экран 11', null]]);
ru(CONN24, [
  { h: 'Неверный пароль', fix: 'пароль, заданный при установке' },
  { h: 'Пароль пустой (process.env не прочитан)', fix: 'переменная пароля пустая' },
  { h: 'Неверное имя базы', fix: 'точное имя через \\l: car_rental' },
  { h: 'PostgreSQL выключен', code: '— (сервер остановлен)', fix: 'console.error(err) → ECONNREFUSED → запустите PostgreSQL' },
]);
ru(CLS28, [
  { s: '21 экран', t: 'Запросы PostgreSQL — CRUD + с AI', d: ['магазин кнопками: INSERT · SELECT · WHERE · UPDATE · DELETE', 'таблица — ровно та products, что вы создали сегодня', 'практика: настоящий терминал PostgreSQL или VS Code + AI — свой магазин'] },
  { s: '9 экранов', t: 'Практика: Backend CRUD — AvtoIjara', d: ['таблица cars — вручную в терминале', 'server.js — от Gemini, проверка в Postman', 'найти ошибку AI: price → daily_price'] },
]);
ru(ADD28, [['число в ответе (UPDATE 1 / 0)', 'блок CRUD m4-06'], ['без WHERE — на проекторе BEGIN … ROLLBACK', 'm4-06 UPDATE/DELETE'], ['ORDER BY — вопрос «место изменилось»', 'm4-06 SELECT'], ['апостроф \'\', совет про NOT NULL', 'практика m4-06 (свой магазин)'], ['и HINT ошибается', 'блок ошибки AI в m4-06'], ['Четыре отличия: текст ошибки короткий · код Gemini разный · is_rented: null · порт занят, а «работает»', null]]);
ru(PRE28, ['На каждом компьютере открывается терминал PostgreSQL и установлен Postman', 'Пароль класса всем известен', 'Правило: один проект — один терминал', 'Время: в m4-06 из 90 минут 25 на практику · в m4-08 40 на сервер и Postman']);
ru(STUMBLE29, [
  ['Имя таблицы/колонки', null, 'сравнить с \\d таблица'],
  ['Апостроф', null, null],
  ['Без WHERE', null, 'BEGIN … ROLLBACK; если удалено — INSERT заново'],
  ['Пароль/база', null, 'настройки Pool, пароль класса'],
  ['Пустая ошибка', null, 'console.error(err) → ECONNREFUSED → запустите PostgreSQL'],
  ['Не изменилось', 'ответ старый', 'второй терминал; Ctrl+C'],
]);
ru(QA29, [
  ['«Почему место товара изменилось?»', 'Нет ORDER BY — база пишет обновлённую строку на новое место (экран 6); ORDER BY id.'],
  ['«Что такое $1?»', 'значение передаётся отдельно, в текст SQL не попадает; пример 1 OR 1=1 (экран 20).'],
  ['«Postman обязателен?»', 'нет, любая программа, которая шлёт запросы; на уроке Postman, потому что удобно для класса.'],
  ['«В NestJS пишем так же?»', 'нет: в Nest Repository сам пишет эти запросы (find, save…). Не волнуйтесь: это полностью, с кодом, разберёте на следующих уроках курса для менторов.'],
  ['«SQL обязательно писать заглавными?»', 'нет, ключевые слова работают и строчными (проверили: select name, price from PRODUCTS сработал); заглавные — привычка, чтобы легче читать.'],
]);
ru(SUM31, [
  { t: 'CRUD = INSERT · SELECT · UPDATE · DELETE; число в ответе — сколько строк затронуто; RETURNING — сама строка; без ORDER BY порядок не гарантирован (ctid)' },
  { t: 'Транзакция: autocommit · BEGIN → только в вашем сеансе → COMMIT / ROLLBACK; !# — aborted, только ROLLBACK; две таблицы — одно дело — атомарно' },
  { t: 'База охраняет только записанное правило: NOT NULL, DEFAULT, UNIQUE, CHECK; в сообщении есть имя — сравните с \\d; апостроф \'\'' },
  { t: 'Express: Pool подключается на первом запросе и переиспользует соединение → pool.query(sql, [$1…]) → rows / rowCount → res.json; 200 · 201 · 404 · 500' },
  { t: '$1 — безопасность: приклеенный 1 OR 1=1 опустошил таблицу; ошибки сервера: имя колонки · express.json() · пароль/база на первом запросе · пустое сообщение → console.error(err) · второй сервер «работает»' },
  { t: 'Класс: практика m4-06 в настоящем psql; до m4-08 пароль, Postman, один терминал; шесть случаев и ответы на вопросы готовы' },
  { t: 'SQL от ИИ: глагол соответствует заданию (удалить — DELETE, не ALTER/DROP) · имена по \\d · число в ответе · в конце SELECT *' },
]);
ru(HOMEWORK31, [
  { t: 'Таблицы — schema.sql: products (NOT NULL имя и цена, CHECK (stock >= 0), DEFAULT 0), orders (REFERENCES products(id), CHECK (qty > 0), created_at DEFAULT now())' },
  { t: 'Сервер — server.js: GET · POST (201, RETURNING *) · PUT · DELETE (rowCount → 404), все значения через $1' },
  { t: 'Проверка — Postman: 4 запроса + несуществующий id → 200 · 201 · 200 · 200 · 404' },
  { t: 'Транзакция — psql: BEGIN → UPDATE … stock - 1 … RETURNING → INSERT INTO orders → COMMIT; потом нехватка остатка → ошибка CHECK → ROLLBACK — оба вывода в README' },
  { t: 'Сдача — выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе' },
]);
RU_S.SPOKEN = [['бэкслеша ', 'backslash '], ['Бэкслеш ', 'Backslash '], ['бэкслеш ', 'backslash ']];  // F-1109-01: ruscha ovoz → «Matn»da `\d products` kabi kod
RU_S.TITLE = 'CRUD-запросы и из Express в базу';
RU_S.COVER = ['Всего около 1 часа 20 минут: озвучка ~27 минут · четыре практики 45–55 минут · 4 проверки · самопроверка 8 вопросов. После экрана 13 можно сделать перерыв', 'Нужно: пройден урок PostgreSQL-1 · работающий PostgreSQL · Node.js 20+ · VS Code · Postman', 'Проекты: база shop (products, orders) и сервер AvtoIjara (car_rental, server.js)'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: CRUD, транзакция, Pool и ошибки сервера. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь ошибки из m4-06 и m4-08 будут вам в классе знакомы.';
RU_S.NEXT_T = 'Архитектура NestJS — Module, Controller, Service';
RU_S.NEXT_D = 'Как этот же CRUD из Express пишется в Nest и в каком порядке';
RU_S.FILE = 'postgresql-2-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['CRUD — четыре команды; <b>число в ответе</b> и RETURNING; без ORDER BY порядок не гарантирован', 'Первое: CRUD — четыре команды: insert, select, update и delete. Число в ответе говорит, сколько строк затронуто, а returning возвращает саму строку. Если не написан order by, порядок не гарантирован: база пишет обновлённую строку на новое место.'],
  b2: ['Транзакция: <b>BEGIN — только в вашем сеансе</b>, COMMIT или ROLLBACK; две таблицы — одно дело', 'Второе: обычно каждая команда сохраняется сразу. После begin изменения только в вашем сеансе, commit сохраняет, rollback отменяет. Если вышел восклицательный знак — только rollback. Команды одного дела — в одной транзакции: либо всё, либо ничего.'],
  b3: ['База охраняет <b>только записанное правило</b>; имя из сообщения сравните с \\d', 'Третье: база охраняет только записанное правило: not null, default, unique и check. В каждом сообщении есть имя таблицы или правила, сравните его с бэкслеш d. Апостроф пишется дважды.'],
  b4: ['Express: <b>Pool подключается на первом запросе</b> → pool.query → rows / rowCount → res.json', 'Четвёртое: путь из Express в базу. Pool настраивается один раз, подключается на первом запросе и переиспользует соединение. Pool query отправляет запрос, из результата берётся rows или rowcount, res json возвращает ответ. Статусы: двести, двести один, четыреста четыре, пятьсот.'],
  b5: ['<b>$1 — безопасность</b>; ошибки сервера: имя колонки, express.json, пароль, пустое сообщение, второй сервер', 'Пятое: значение от пользователя — всегда через доллар один, приклеенный текст опустошил всю таблицу. Ошибки сервера: имя колонки, express json, пароль и база — на первом запросе. Если сообщение пустое, дайте console error всю ошибку. Второй сервер тоже говорит «работает».'],
  b6: ['Класс: практика m4-06 <b>в настоящем psql</b>; до m4-08 пароль, Postman, один терминал', 'Шестое, для класса: практика m4-06 — в настоящем терминале PostgreSQL, PostgreSQL нужен на каждом компьютере. До m4-08 — пароль класса, Postman и правило одного терминала. Шесть случаев и ответы на вопросы учеников у вас готовы.'],
  b7: ['SQL от ИИ: <b>глагол, имя и число</b>; ALTER или DROP без просьбы — не запускайте', 'Седьмое: SQL от ИИ проверяйте глаголом, именем и числом. Удаление — это delete; если alter или drop не просили, не запускайте. Настоящий ИИ понял kolonka как колонку, вы видели это своими глазами.'],
  hw: ['<b>Домашнее задание</b>: shop-api для своего магазина — две таблицы, четыре endpoint, README', 'Домашнее задание: shop api для своего магазина. В файле schema две таблицы: товары с not null и check stock больше или равно нулю, заказы с внешним ключом. В server js четыре endpoint, все значения через доллар один, если не найдено — четыреста четыре. В README на каждый endpoint один запрос и его ответ.'],
  hw2: ['В терминале <b>одна продажа и ошибка CHECK</b> — в README; ссылка на репозиторий — на платформу', 'В терминале сделайте одну продажу через begin, update, insert и commit, потом получите ошибку check при нехватке остатка: оба запишите в README. Выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе. Пятьдесят–семьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: CRUD, транзакция, правила, ошибки и сервер — на одной странице', 'Внизу памятка на одну страницу: CRUD и число в ответе, состояния транзакции, правила базы, ошибки SQL и сервера, путь Express и подготовка к классу. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# PostgreSQL-2 — памятка ментора (CRUD, транзакция, Express)
## CRUD (psql) и число в ответе
INSERT INTO products (name, price, stock) VALUES (…) → INSERT 0 n · SELECT * / SELECT name, price · WHERE price < 100000 · UPDATE … SET … WHERE id = 1 → UPDATE 1 · DELETE … WHERE id = 3 → DELETE 1
Число: 1 — как ожидали · 0 — WHERE ни к чему не подошёл (не ошибка) · большое число — WHERE неверный/его нет · RETURNING — сама изменённая строка
Нет ORDER BY — порядок как в файле (UPDATE пишет новую копию: ctid (0,5) → (0,6)) → ORDER BY id
## Транзакция
autocommit: каждая команда сразу · BEGIN → только в вашем сеансе (сеанс B видит старое значение) → COMMIT сохраняет / ROLLBACK отменяет · приглашение: =# обычное · =*# открыта · =!# ошибка (aborted) — только ROLLBACK, и COMMIT вернёт ROLLBACK
Атомарно: две таблицы — одно дело — UPDATE stock + INSERT orders в одном BEGIN … COMMIT; если CHECK отклонил — не сохранится ничего
## База охраняет
Правило не записано — не охраняет (строка без имени сохраняется). NOT NULL (сначала уберите пустые строки) · DEFAULT 0 · UNIQUE (name) → duplicate key value · CHECK (stock >= 0) · \\d products — всё в одном месте
## Ошибки SQL (в сообщении есть имя)
relation "product" / column "narx" (и HINT ошибается) → сравнить с \\d · 'arzon' → invalid input syntax for type integer · число колонок/значений → more target columns than expressions · апостроф → '' (O''yinchoq)
## Express → база
Pool: при создании не подключается, подключается на первом запросе, переиспользует соединение (3 запроса — один pid) · pool.query(sql, [значения]) → result.rows / result.rowCount · res.json · GET 200 · POST 201 (RETURNING *) · PUT/DELETE 200 · rowCount 0 → 404 · catch → 500
Зачем $1: приклеенный '… WHERE id = ' + id и URL "1 OR 1=1" → удалены все строки (deleted: 3); с $1 → 500 invalid input syntax, таблица на месте
## Ошибки сервера
column "price" of relation "cars" does not exist → имя колонки в коде (\\d cars) · Cannot destructure property 'model' of 'req.body' → app.use(express.json()) · password authentication failed → пароль · client password must be a string → пароль пустой (process.env) · database "…" does not exist → имя · {"error":""} → console.error(err) → ECONNREFUSED → запустите PostgreSQL
«Server … ishlayapti» — только про Express — ошибка базы на первом запросе · Порт занят: в Express 5 второй сервер тоже пишет «работает» и выходит без ошибки, отвечает старый → один терминал, Ctrl+C
## Подготовка к классу
m4-06 (21 экран): практика в настоящем терминале PostgreSQL — PostgreSQL на каждом компьютере; вы добавляете: число в ответе, BEGIN … ROLLBACK на проекторе, ORDER BY, совет про апостроф и NOT NULL, HINT тоже ошибается
m4-08 (9 экранов): пароль класса, Postman, один терминал; четыре отличия — текст ошибки короткий · код Gemini разный · is_rented null (нет DEFAULT) · порт занят, а «работает»
## SQL от ИИ
глагол соответствует заданию: посмотреть SELECT · изменить UPDATE · удалить DELETE · добавить INSERT; ALTER / DROP — если не просили, не запускать (DROP COLUMN stock → ALTER TABLE, без вопроса, значение пропадает во всех строках) · имена по \\d products (если ИИ не знает структуру, он придумывает: relation "mahsulotlar" does not exist) · число в ответе · в конце SELECT * · настоящий ИИ понял «Kolonkani o'chir» как колонку (оба) · не копируйте ответ целиком: ошибка <…> в шаблоне ломает транзакцию, следующий INSERT тоже не выполняется
## Ваше домашнее задание (50–70 минут)
shop-api: schema.sql (products NOT NULL + CHECK, orders FK) + server.js (4 endpoint, $1, 404) + README (5 запросов и ответов, продажа BEGIN…COMMIT и ошибка CHECK) → GitHub → ссылка на репозиторий в домашнее задание на платформе`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxatlari
ru(FORMULA15, [['Какая таблица?'], ['Какая колонка или правило?'], ['Какое значение?']]);
ru(STEPS18, [[null, 'подключается'], [null, 'запрос к базе'], [null, 'результат'], [null, 'ответ']]);

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · PostgreSQL",
  "title": "Таблица готова. Теперь управляем ею — в терминале PostgreSQL и внутри Express",
  "seg": {
   "a": [
    "В PostgreSQL-1 вы создали таблицу — сегодня <b>управляете её данными четырьмя командами</b>",
    "Здравствуйте. На прошлом уроке вы установили PostgreSQL, создали таблицу и связали её. Сегодня управляем данными в таблице: добавить, посмотреть, изменить и удалить. Это называют CRUD, что это такое, точно увидим на следующем экране."
   ],
   "b": [
    "Сначала команды в терминале — и <b>что происходит внутри</b> каждой: число, порядок, транзакция",
    "Сначала пишем команды вручную в терминале и смотрим, что происходит внутри каждой: что считает число в ответе, почему меняется порядок строк, что база делает внутри транзакции. Наш пример — маленький магазин: клавиатура, мышка, наушники, колонка."
   ],
   "c": [
    "Потом те же запросы внутри Express: <b>что такое <code>Pool</code>, зачем <code>$1</code></b>, почему сервер даёт 500",
    "Потом ставим те же запросы внутрь сервера Express. Сами проверите, что такое Pool, почему значения передаются через доллар один, когда и почему сервер возвращает пятьсот. Нарочно сломаем сервер и исправим. Потом проверим в базе SQL, написанный ИИ."
   ],
   "d": [
    "Семь этапов, четыре практики; в конце <b>два экрана подготовки к классу</b>. Не спешите",
    "Урок состоит из семи этапов, между ними четыре практики. Последние два экрана — подготовка к классу: карта уроков ученика и места, где ученики ошибаются. Не спешите: каждый экран можно прослушать с начала и прочитать текст. «Далее» откроется, когда учитель договорит. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · CRUD в терминале",
  "title": "CRUD — четыре действия с данными: в базе команда, на сервере endpoint",
  "seg": {
   "a": [
    "CRUD — <b>первые буквы</b> четырёх английских слов: создать, прочитать, изменить, удалить",
    "Основа сегодняшнего урока — одно слово: CRUD. Это первые буквы четырёх английских слов: Create, Read, Update и Delete, то есть создать, прочитать, изменить и удалить. Любое приложение делает с данными именно эти четыре дела: и интернет-магазин, и Telegram."
   ],
   "b": [
    "В PostgreSQL у каждого действия <b>своя команда</b>: <code>INSERT</code>, <code>SELECT</code>, <code>UPDATE</code>, <code>DELETE</code>",
    "В PostgreSQL у каждого действия своя команда: insert, select, update и delete. В знакомом вам Mongoose это были create, find, updateOne и deleteOne. Смысл тот же, только пишется иначе. После каждой команды база возвращает короткий ответ, например update один. В Mongo на его месте выходил matchedCount один."
   ],
   "c": [
    "На сервере те же четыре действия <b>становятся endpoint</b>: <code>POST</code>, <code>GET</code>, <code>PUT</code>, <code>DELETE</code>",
    "На сервере те же четыре действия становятся endpoint. Создать — POST, прочитать — GET, изменить — PUT, удалить — DELETE. Внутри каждого endpoint стоит та же SQL-команда. В ответе выходит статус: при создании двести один, в остальных двести."
   ],
   "d": [
    "Итог: у каждого действия <b>одна команда</b> в базе и один endpoint на сервере",
    "Итог: CRUD — четыре действия. У каждого действия одна команда в PostgreSQL и один endpoint на сервере. Сегодня сначала пишем команды вручную в терминале и смотрим внутрь, потом ставим их же внутрь сервера Express."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · CRUD в терминале",
  "title": "products — четыре колонки, четыре товара; id база даёт сама",
  "seg": {
   "a": [
    "В Mongo база и коллекция появлялись сами — здесь <b>сначала <code>CREATE DATABASE</code>, потом таблица</b>",
    "В знакомом вам Mongoose хватало connect: и база, и коллекция появлялись сами при первом create. В PostgreSQL сначала create database создаёт базу, потом create table — таблицу. Таблица products, четыре колонки: id растёт сам, name — текст, price и stock — целые числа. Правил в колонках пока нет, это нарочно."
   ],
   "b": [
    "Одним <code>INSERT</code> четыре строки; ответ <code>INSERT 0 4</code> — <b>последнее число — сколько строк добавлено</b>",
    "Одним insert добавляем четыре товара. Ответ базы: insert, ноль, четыре. Последнее число говорит, сколько строк добавлено. Ноль в середине остался от старых версий, он ничего не значит, не смотрите на него."
   ],
   "c": [
    "<code>SELECT *</code> — все колонки; <code>id</code> мы не писали, <b>база дала сама</b>: <code>SERIAL</code>",
    "Select звёздочка показывает все колонки. Колонку id мы не писали, база сама дала один, два, три, четыре. Это делает serial: внутри отдельный счётчик, каждой новой строке он даёт следующее число. Даже если строку удалить, счётчик назад не идёт."
   ],
   "d": [
    "Итог: таблица готова — <b>без всяких правил</b>; база охраняет только записанное правило",
    "Итог: в вашей базе магазин из четырёх товаров. Запомните одну вещь: в этой таблице пока нет ни not null, ни другого правила. База охраняет только записанное правило. Что будет, увидите своими глазами на третьем этапе."
   ]
  }
 },
 "4": {
  "kicker": "Этап 1 · CRUD в терминале",
  "title": "WHERE — из тысяч строк только нужное",
  "seg": {
   "a": [
    "Если все колонки не нужны — после <code>SELECT</code> пишутся <b>только нужные колонки</b>",
    "Таблица есть, теперь читаем из неё. Если все колонки не нужны, после select пишете только нужные: имя и цену. Данные не меняются, select только показывает."
   ],
   "b": [
    "<code>WHERE price &lt; 100000</code> — дешевле ста тысяч: <b>три товара</b>",
    "Чтобы из тысяч товаров взять только нужные, пишется where. Просим тех, у кого цена меньше ста тысяч: мышка, наушники и колонка, три строки. Where сравнивает каждую строку с условием и возвращает только подходящие. В Mongoose это было условие доллар lt внутри find."
   ],
   "c": [
    "<code>WHERE stock &lt; 6</code> — заканчивающийся товар: <b>только наушники</b>",
    "Второй фильтр находит товары с остатком меньше шести, то есть заканчивающиеся. В результате только наушники, их осталось пять. Менеджер магазина именно этим запросом узнаёт, что заказать."
   ],
   "d": [
    "Итог: <code>SELECT</code> только читает; <b><code>WHERE</code> выбирает строки</b> — в <code>UPDATE</code> и <code>DELETE</code> ровно так же",
    "Итог: select ничего не меняет, только читает. Where говорит, какие строки нужны. На следующем экране увидите update и delete: в них работает тот же where, только теперь он решает, какие строки изменятся."
   ]
  }
 },
 "5": {
  "kicker": "Этап 1 · CRUD в терминале",
  "title": "UPDATE 1, DELETE 1, UPDATE 0 — число в ответе говорит, сколько строк затронуто",
  "seg": {
   "a": [
    "Клавиатура подешевела: <code>UPDATE … WHERE id = 1</code> — ответ <b><code>UPDATE 1</code></b>, одна строка",
    "Цена клавиатуры упала до девяноста девяти тысяч. Команда: update products set price, where id один. Ответ базы — update один: изменилась одна строка. Число в ответе всегда говорит, сколько строк затронуто, и в update, и в delete."
   ],
   "b": [
    "Наушники сняты с продажи: <code>DELETE … WHERE id = 3</code> — <b><code>DELETE 1</code></b>",
    "Наушники сняли с продажи, удаляем их: delete from products, where id три. Ответ базы — delete один. Строка ушла полностью, а её id больше не используется."
   ],
   "c": [
    "Если такого <code>id</code> нет — <b>это не ошибка</b>, <code>UPDATE 0</code> и <code>DELETE 0</code>",
    "Попробуем изменить девяносто девятый товар. Ошибки нет, ответ — update ноль. Delete тоже возвращает ноль. База не говорит «такой строки нет»: where не подошёл ни к одной строке, поэтому ничего не тронуто. Ноль в matchedCount в Mongo — то же самое. Это не ошибка, это ответ."
   ],
   "d": [
    "<code>RETURNING</code> — база возвращает <b>саму изменённую строку</b>; если строки нет — <code>(0 rows)</code>",
    "Продана одна клавиатура: уменьшаем остаток на один. Сколько стало, вы не считаете: пишете в конце команды returning, и база возвращает изменённую строку: клавиатура, семь. С девяносто девятым id returning даёт ноль строк. На сервере используется именно этот returning."
   ],
   "e": [
    "Итог: после каждого <code>UPDATE</code> и <code>DELETE</code> <b>читайте число в ответе</b>",
    "Итог: после update и delete читайте число в ответе. Один — случилось то, что ждали. Ноль — where ни к чему не подошёл. Неожиданно большое число — where неверный или вообще не написан. Это безопасно посмотрим на втором этапе."
   ]
  }
 },
 "6": {
  "kicker": "Этап 1 · что происходит внутри",
  "title": "После UPDATE место строки изменилось — база пишет обновлённую строку на новое место",
  "seg": {
   "a": [
    "<code>SELECT *</code> — клавиатура <b>ушла в конец списка</b>. Это не ошибка, но причину надо знать",
    "После команд с прошлого экрана делаем select и смотрим на результат: осталось три товара, а клавиатура не первая, а в конце. Это не ошибка. Но не отмахиваемся «случайность»: надо знать, почему так, потому что этот вопрос обязательно зададут."
   ],
   "b": [
    "Причина: PostgreSQL <b>не меняет обновлённую строку на месте</b> — пишет её новую копию на свободное место",
    "Причина внутри базы. В update PostgreSQL не меняет строку на месте: старую копию помечает как «устаревшую», новую пишет на свободное место в файле, здесь в конец. Старая копия позже очищается. А select звёздочка читает строки в порядке файла."
   ],
   "c": [
    "Доказательство: <code>ctid</code> — адрес строки в файле; клавиатура теперь <code>(0,6)</code>: <b>два изменения — две новые копии</b>",
    "Это можно увидеть. У каждой строки есть скрытая колонка ctid: её адрес в файле, страница и место. Если сделать select ctid, клавиатура — ноль запятая шесть, то есть на шестом месте. Клавиатура менялась дважды: сначала цена, потом остаток. Каждый раз база писала новую копию: на пятое, потом на шестое место. Поэтому она вышла в конце."
   ],
   "d": [
    "Итог: если нужен порядок — <b><code>ORDER BY id</code></b>; без него порядок никогда не гарантирован",
    "Итог: если order by не написан, база отдаёт строки в порядке файла, а этот порядок может меняться после каждого update. Если нужен порядок, в конце пишется order by id, и клавиатура снова первая. Ответ на вопрос «почему место товара изменилось» — вот: не было order by."
   ]
  }
 },
 "7": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 5",
  "title": "Команда прошла без ошибки, ответ UPDATE 0. Что это значит?",
  "q": "Вы видели число в ответе, проверим. Первая проверка. В терминале на экране пытались изменить цену девяносто девятого товара. Ошибки нет, ответ: update ноль. Что это значит? Выберите вариант.",
  "ok": "Верно. Where id девяносто девять не подошёл ни к одной строке, поэтому изменилось ноль строк. База не считает это ошибкой. Чтобы убедиться, проверьте через select, есть ли такой id, на экране стоит этот select. Значит, update ноль — не ошибка: он говорит, что where не подошёл ни к одной строке.",
  "okShort": "<code>UPDATE 0</code> — <code>WHERE</code> не подошёл ни к одной строке. Не ошибка: <code>SELECT … WHERE id = 99</code> тоже вернёт пусто.",
  "hint": "Что считает число в ответе? Какую строку должен был найти WHERE?",
  "demak": "<code>UPDATE 0</code> — не ошибка: значит, <code>WHERE</code> не подошёл ни к одной строке.",
  "opts": [
   "id = 99 нет — WHERE не подошёл ни к одной строке",
   "У пользователя нет права менять цену",
   "Таблица опустела — строка удалена",
   "Цена изменилась, но ещё не было COMMIT"
  ],
  "wrong": {
   "1": "Если бы права не было, вышло бы ERROR:  permission denied for table products; здесь ошибки нет.",
   "2": "Таблица на месте: UPDATE 0 ничего не удаляет.",
   "3": "UPDATE без транзакции сохраняется сразу; а число говорит, сколько строк затронуто."
  }
 },
 "8": {
  "kicker": "Практика 1 / 4",
  "eyebrow": "Сейчас у себя · 10–15 минут",
  "title": "База shop и CRUD — четыре команды, число в каждом ответе",
  "seg": {
   "a": [
    "Теперь вы: <b>в своей базе</b> таблица, четыре товара, два фильтра, цена и удаление",
    "Теперь ваша очередь. В своей базе делаете то же: создаёте таблицу, добавляете четыре товара, пишете два фильтра, потом меняете цену и удаляете один товар. Займёт десять–пятнадцать минут."
   ],
   "b": [
    "Шаги 1–3: база, таблица, товары и <b>два фильтра</b>",
    "На первом шаге создаёте базу shop и таблицу products. На втором добавляете четыре товара одним insert и видите в ответе четыре. На третьем пишете два фильтра: дешёвые и заканчивающиеся. После каждой команды читайте строку ответа."
   ],
   "c": [
    "Шаг 4: цена и удаление; подтверждение — <b>число строк в последнем <code>SELECT</code></b>",
    "На четвёртом шаге измените цену клавиатуры, удалите наушники и сделайте select звёздочка. Обратите внимание, где стоит клавиатура. В поле подтверждения напишите число строк под результатом последнего select."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу, откроется окно с решениями. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы написали четыре команды CRUD в своей базе и прочитали число в каждом ответе."
   ]
  },
  "steps": [
   {
    "t": "База и таблица",
    "exp": "CREATE DATABASE · CREATE TABLE"
   },
   {
    "t": "Товары",
    "exp": "INSERT 0 4"
   },
   {
    "t": "Фильтры",
    "exp": "3 строки · 1 строка (Quloqchin)"
   },
   {
    "t": "Цена и удаление",
    "exp": "UPDATE 1 · DELETE 1 · (3 rows), Klaviatura в конце"
   }
  ],
  "proof": {
   "label": "Число строк в результате последнего SELECT *",
   "placeholder": "напишите число под результатом",
   "wrong": "Сколько останется из четырёх товаров после удаления одного? Напишите число в скобках под результатом."
  },
  "trouble": [
   [
    "ERROR:  database \"shop\" already exists",
    "база уже создана — \\c shop"
   ],
   [
    "ERROR:  relation \"products\" does not exist",
    "вы в другой базе (приглашение postgres=#) — \\c shop"
   ],
   [
    "INSERT 0 4 дважды",
    "товары добавлены дважды — id 1–8; на шаге 4 выбирайте id по SELECT"
   ],
   [
    "UPDATE 0 / DELETE 0",
    "такого id нет — сначала посмотрите id через SELECT *"
   ],
   [
    "Klaviatura в конце",
    "не ошибка — экран 6: упорядочите через ORDER BY id"
   ],
   [
    "ERROR:  syntax error at or near \"…\"",
    "перед местом, которое показал ^, пропущены запятая, скобка или кавычка"
   ]
  ]
 },
 "9": {
  "kicker": "Этап 2 · транзакция",
  "title": "Если забыть WHERE — UPDATE 3, DELETE 3. Проверять безопасно: BEGIN … ROLLBACK",
  "seg": {
   "a": [
    "<code>UPDATE</code> или <code>DELETE</code> без <code>WHERE</code> — <b>все строки</b>. Это надо увидеть, но не ломая базу",
    "Я говорил: если число в ответе неожиданно большое, не было where. Это нужно увидеть своими глазами, но не ломая базу. Способ: сначала begin, то есть открываем транзакцию. Всё, что после неё, будет временным."
   ],
   "b": [
    "<code>UPDATE</code> без <code>WHERE</code> — <code>UPDATE 3</code>: <b>все товары по девяносто девять тысяч</b>",
    "После begin — update без where. Ответ базы — update три. Делаем select: все товары по девяносто девять тысяч сум, и мышка, и колонка. Один забытый where сломал весь прайс. Пришедшие из Mongo ошибаются именно здесь: там updateOne трогал один документ, а здесь без where меняются все строки."
   ],
   "c": [
    "<code>DELETE</code> без <code>WHERE</code> — <code>DELETE 3</code>, <b>таблица пуста</b>",
    "Ещё хуже — delete без where. Ответ базы — delete три, а select возвращает ноль строк. В настоящем магазине это значит, что пропал весь каталог. Но мы внутри транзакции."
   ],
   "d": [
    "<code>ROLLBACK</code> — всё на месте: <b>изменения внутри транзакции отменены</b>",
    "Теперь пишем rollback и делаем select: все три товара на месте, и цены старые. Всё, что сделано внутри транзакции, отменено. В PostgreSQL-1 транзакция защищала магазин, а здесь это ваша площадка для проверки."
   ],
   "e": [
    "Итог: опасный <code>UPDATE</code>/<code>DELETE</code> сначала <b>проверяйте внутри <code>BEGIN</code></b>, смотрите через <code>SELECT</code>",
    "Итог: опасный update или delete сначала запускайте внутри begin и смотрите результат через select. Если верно — commit, если нет — rollback. Это одна строка, но она спасает всю таблицу. На следующем экране посмотрим, что база на самом деле делает внутри транзакции."
   ]
  }
 },
 "10": {
  "kicker": "Этап 2 · что происходит внутри",
  "title": "Каждая команда сохраняется сама; после BEGIN — только в вашем сеансе, до COMMIT",
  "seg": {
   "a": [
    "Обычно PostgreSQL в <b>autocommit</b>: каждая команда сохраняется сразу, как выполнена",
    "Обычно PostgreSQL работает в режиме autocommit: каждая команда сохраняется сразу, как только выполнена, вернуть её нельзя. Update и delete с первого этапа сохранились именно так. Поэтому delete без where в настоящей базе — катастрофа."
   ],
   "b": [
    "После <code>BEGIN</code> приглашение <code>shop=*#</code> — <b>звёздочка: транзакция открыта</b>, изменение видите только вы",
    "Когда пишете begin, приглашение меняется: равно, звёздочка, решётка. Звёздочка значит, что транзакция открыта. Теперь изменения видны только в вашем сеансе. Мы проверили: в сеансе A сделали скидку на клавиатуру, восемьдесят девять тысяч. Сеанс B всё ещё видит девяносто девять. Только после commit B увидел новую цену."
   ],
   "c": [
    "Если внутри транзакции ошибка — приглашение <code>shop=!#</code>: <b>aborted</b>, следующие команды отклоняются",
    "Если внутри транзакции какая-то команда дала ошибку, приглашение меняется на восклицательный знак, и база говорит «current transaction is aborted»: следующие команды не выполняются, даже простой select. Из этого состояния выводит только rollback. Даже если напишете commit, база сделает rollback, так и напишет в ответе."
   ],
   "d": [
    "Итог: <code>BEGIN</code> — временно, <code>COMMIT</code> — сохранить, <code>ROLLBACK</code> — отменить; <b>видите <code>!#</code> — <code>ROLLBACK</code></b>",
    "Итог: после begin всё временно и видно только вам, commit сохраняет, rollback отменяет. Звёздочка в приглашении говорит, что транзакция открыта, восклицательный знак — что была ошибка. Видите восклицательный знак — никаких других команд: rollback."
   ]
  }
 },
 "11": {
  "kicker": "Этап 2 · что происходит внутри",
  "title": "Продажа — две команды: уменьшить остаток и записать заказ. Либо обе, либо ни одной",
  "seg": {
   "a": [
    "Правило и вторая таблица для магазина: <b><code>CHECK (stock &gt;= 0)</code></b> и <code>orders</code> — заказы",
    "Транзакция не только для проверки. Добавляем магазину правило: остаток не может быть отрицательным, check stock больше или равно нулю. И вторую таблицу: orders, заказы: какой товар, сколько и когда. В колонку created at написали default now, время ставит сама база."
   ],
   "b": [
    "Одна продажа — две команды: <code>UPDATE</code> уменьшает остаток, <code>INSERT</code> пишет заказ — <b>внутри <code>BEGIN … COMMIT</code></b>",
    "Продана одна мышка. Это две команды: уменьшить остаток на один и записать заказ. Обе между begin и commit. Returning показал, что остаток стал четырнадцать, а заказ записан с номером один и временем. После commit сохранились обе."
   ],
   "c": [
    "Попросили двенадцать мишек, а всего десять: <b><code>CHECK</code> отклонил</b>, транзакция aborted — <code>ROLLBACK</code>",
    "Теперь попросили двенадцать мишек, на складе десять. Заказ записался, потом update хотел сделать остаток минус два. Check отклонил: new row violates check constraint stock nonneg. Транзакция aborted. Делаем rollback: и заказ пропал, и остаток десять. Ложного заказа не осталось."
   ],
   "d": [
    "Итог: команды одного дела — <b>в одной транзакции</b>; если правило в базе, полдела не остаётся",
    "Итог: команды, относящиеся к одному делу, — в одной транзакции: либо сохраняется всё, либо ничего. Это называют атомарностью. Если правило в самой базе, полдела не останется, даже если код ошибётся. Ответ на задачу «последний телефон» из PostgreSQL-1 — именно это: транзакция и правило."
   ]
  }
 },
 "12": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 5",
  "title": "BEGIN; → DELETE FROM products; (DELETE 3) → ROLLBACK;. Что теперь вернёт SELECT * FROM products;?",
  "q": "Вы видели транзакцию изнутри, проверим. Вторая проверка. На экране: begin, delete без where, ответ delete три, потом rollback. Если теперь сделать select, что будет в таблице? Выберите вариант.",
  "ok": "Верно. Delete был внутри транзакции, rollback его отменил. Все три товара на месте, select на экране это показал. Пока не написан commit, никакое изменение не сохраняется. Значит, begin и rollback позволяют проверить опасную команду, не ломая базу.",
  "okShort": "<code>ROLLBACK</code> — все изменения внутри транзакции отменены: три строки на месте.",
  "hint": "Что ROLLBACK делает с изменениями внутри транзакции?",
  "demak": "пока не написан <code>COMMIT</code>, изменения внутри транзакции не сохраняются; <code>ROLLBACK</code> отменяет всё.",
  "opts": [
   "Ноль строк — DELETE 3 уже выполнен",
   "Только одна строка — вернётся последняя",
   "Все три — ROLLBACK отменил удаление",
   "ERROR — из удалённой таблицы нельзя читать"
  ],
  "wrong": {
   "0": "DELETE 3 был внутри транзакции, и COMMIT не было.",
   "1": "ROLLBACK отменяет не одну строку, а всю транзакцию.",
   "3": "DELETE удаляет строки, а не таблицу; таблица всегда на месте."
  }
 },
 "13": {
  "kicker": "Практика 2 / 4",
  "eyebrow": "Сейчас у себя · 5–10 минут",
  "title": "Безопасно проверьте UPDATE без WHERE — следите за звёздочкой в приглашении",
  "seg": {
   "a": [
    "Теперь вы: <code>UPDATE</code> без <code>WHERE</code> в своей базе, но <b>внутри транзакции</b>",
    "Теперь сами: делаете update без where в своей базе, но внутри транзакции. Займёт пять–десять минут. После этого каждую опасную команду будете проверять так же."
   ],
   "b": [
    "Шаги 1–2: <code>BEGIN</code> (приглашение <code>shop=*#</code>), <code>UPDATE</code> без <code>WHERE</code> и <code>SELECT</code> — <b>все цены одинаковые</b>",
    "На первом шаге пишете begin и видите, что в приглашении появилась звёздочка. На втором делаете update без where и через select видите, что все цены стали одинаковыми. Commit не пишите."
   ],
   "c": [
    "Шаги 3–4: <code>ROLLBACK</code> и <code>SELECT</code>; подтверждение — <b>цена клавиатуры</b>",
    "На третьем шаге пишете rollback, приглашение возвращается к обычному. На четвёртом снова делаете select. В поле подтверждения напишите текущую цену клавиатуры, после rollback."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу, откроется окно с решениями. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, вы увидели, насколько опасен update без where, и научились всё вернуть через rollback."
   ]
  },
  "steps": [
   {
    "t": "Транзакция",
    "exp": "BEGIN · приглашение shop=*#"
   },
   {
    "t": "Без WHERE",
    "exp": "UPDATE 3 · все цены 1"
   },
   {
    "t": "Отмена",
    "exp": "ROLLBACK · приглашение shop=#"
   },
   {
    "t": "Проверка",
    "exp": "цены старые"
   }
  ],
  "proof": {
   "label": "Цена Klaviatura после ROLLBACK",
   "placeholder": "напишите цену клавиатуры",
   "wrong": "После ROLLBACK цена как в 1-й практике. Прочитайте строку Klaviatura в результате SELECT."
  },
  "trouble": [
   [
    "WARNING:  there is no transaction in progress (на ROLLBACK)",
    "BEGIN не написан — изменение уже сохранено; восстановите цены UPDATE из 1-й практики"
   ],
   [
    "цена 120000",
    "шаг 4 первой практики (99 000) не выполнен — закончите 1-ю практику"
   ],
   [
    "приглашение shop=!#",
    "внутри транзакции была ошибка — напишите ROLLBACK; (экран 10)"
   ]
  ]
 },
 "14": {
  "kicker": "Этап 3 · база охраняет",
  "title": "Товар без имени сохранился без ошибки — добавляем правило сами, и база начинает отклонять",
  "seg": {
   "a": [
    "<code>INSERT</code> без имени — <code>INSERT 0 1</code>, <b>ошибки нет</b>: в таблице не было <code>NOT NULL</code>",
    "Третий этап: как база охраняет. Добавляем товар без имени: только цена и остаток. Ошибки нет, insert ноль один. Если искать через where name is null, — пятая строка: имя пустое. База охраняет только записанное правило, а мы правило не писали."
   ],
   "b": [
    "Хотим добавить <code>NOT NULL</code> — база отклонила: <b>в колонке есть пустое значение</b>. Сначала чистим, потом правило",
    "Теперь добавляем правило: alter table, name set not null. База отклонила: column name contains null values. Логично: раз есть пустое имя, правило поставить нельзя. Удаляем строку без имени и ставим правило снова. Теперь insert без имени даёт ошибку: violates not-null constraint."
   ],
   "c": [
    "<code>DEFAULT 0</code> — не указанный остаток будет нулём; <b><code>UNIQUE</code></b> — второй «Kolonka» отклоняется",
    "Ещё два правила. Default: если stock не указан, пусть будет ноль, планшет сохранился с нулевым остатком. Unique: имя не повторяется. Если добавить второго колонку, база скажет duplicate key value и назовёт, какое значение повторилось."
   ],
   "d": [
    "Итог: <code>\\d products</code> — все правила в одном месте; <b>если правило в базе</b>, ошибку ловит база, а не код",
    "Итог: бэкслеш d products показывает все правила таблицы: not null, default, unique, check и внешний ключ. Если правило в базе, ошибку ловит база, а не код, и внутри каждого сообщения стоит имя правила. На следующем экране потренируемся читать эти сообщения."
   ]
  }
 },
 "15": {
  "kicker": "Этап 3 · база охраняет",
  "title": "Пять ошибок — в каждой само сообщение говорит, что исправить",
  "seg": {
   "a": [
    "<code>relation \"product\" does not exist</code> — имя таблицы: <b>не хватает одной <code>s</code></b>",
    "Теперь самые частые ошибки. Первая — в имени таблицы: вместо products написано product. База говорит relation product does not exist. Relation — название, которое база даёт таблице. Таблица есть, просто имя отличается на одну букву."
   ],
   "b": [
    "<code>column \"narx\" does not exist</code> — имя колонки; а <code>HINT</code> <b>предлагает не ту колонку</b>",
    "Вторая — в имени колонки: написано narx. База говорит column narx does not exist, ниже hint: perhaps you meant name. Внимание: hint угадывает и здесь ошибся, нужная колонка — price. Верьте не hint, а бэкслеш d."
   ],
   "c": [
    "Текст вместо числа и пропущенное значение — <code>invalid input syntax</code>, <b><code>more target columns</code></b>",
    "Третья: в колонку цены написали слово arzon, база говорит invalid input syntax for type integer. Четвёртая: колонок написано три, а значений два, база говорит insert has more target columns than expressions. В обоих случаях стрелка показывает место ошибки."
   ],
   "d": [
    "Узбекский апостроф закрывает строку: <code>syntax error at or near \"yinchoq\"</code> — <b>пишется дважды</b>",
    "Пятая, самая частая в узбекском тексте: апостроф. Апостроф в слове o'yinchoq раньше времени закрывает текст, и база спотыкается на слове yinchoq. Исправление: апостроф внутри слова пишется дважды, при сохранении он станет одним."
   ],
   "e": [
    "Итог: сравните имя из сообщения с <b><code>\\d products</code></b>; <code>^</code> показывает место ошибки",
    "Итог: во всех этих ошибках внутри сообщения стоит имя или значение. Сравните его со структурой таблицы, бэкслеш d products. Стрелка показывает место ошибки. Для апострофа одно правило: апостроф внутри слова — дважды."
   ]
  }
 },
 "16": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 5",
  "title": "VALUES ('O'yinchoq', 30000, 4) → syntax error at or near \"yinchoq\". Какое исправление?",
  "q": "Вы читали сообщения, проверим. Третья проверка. На экране хотят добавить товар o'yinchoq, база говорит syntax error, на слове yinchoq. Что случилось и какое исправление? Выберите вариант.",
  "ok": "Верно. В SQL текст — внутри одинарных кавычек, апостроф внутри слова закрывает его раньше времени. Если написать его дважды, база поймёт это как один апостроф. На экране исправленный insert: товар сохранился с именем o'yinchoq. Значит, каждый апостроф в тексте SQL пишется дважды.",
  "okShort": "<code>'O''yinchoq'</code> — апостроф внутри слова дважды. При сохранении станет одним: <code>O'yinchoq</code>.",
  "hint": "Каким символом текст начинается и каким заканчивается? Апостроф — этот же символ.",
  "demak": "апостроф в тексте SQL пишется дважды: <code>'O''yinchoq'</code>.",
  "opts": [
   "Написать имя кириллицей — апостроф не нужен",
   "Написать апостроф дважды: 'O''yinchoq'",
   "Взять имя в двойные кавычки: \"O'yinchoq\"",
   "Сделать колонку name не VARCHAR, а TEXT"
  ],
  "wrong": {
   "0": "Проблема не в буквах, а в апострофе: он раньше времени закрывает текст.",
   "2": "Двойные кавычки в SQL — для имени колонки или таблицы, проверили: column \"O'yinchoq\" does not exist.",
   "3": "Тип колонки к этой ошибке не относится: ошибка в записи текста."
  }
 },
 "17": {
  "kicker": "Этап 4 · Express · что происходит внутри",
  "title": "Pool — набор соединений: при создании не подключается, подключается на первом запросе, потом переиспользует это соединение",
  "seg": {
   "a": [
    "В Express к базе ходят через пакет <code>pg</code>; вверху кода <b><code>new Pool({ user, password, database, host, port })</code></b>",
    "То, что вы делали в терминале, теперь переносим внутрь сервера. В Node с PostgreSQL общается пакет pg. Вверху кода из pg берётся Pool, ему передаются пользователь, пароль, имя базы, host и порт. Слово pool значит «бассейн», то есть набор соединений. Почему набор — сейчас увидите."
   ],
   "b": [
    "Мы измерили: при создании <code>Pool</code> соединений <b>ноль</b>; на первом запросе подключается, следующие запросы — на том же соединении",
    "Мы это измерили. Сразу после создания Pool число соединений — ноль: он ещё не ходил в базу. На первом запросе подключается. Потом отправили ещё два запроса: номер процесса в базе, pid, у всех трёх одинаковый, активное соединение одно. То есть Pool не открывает новое соединение на каждый запрос, а переиспользует имеющееся."
   ],
   "c": [
    "Почему важно: открыть соединение дорого; и <b>ошибка только на первом запросе</b> — даже при неверном пароле сервер говорит «работает»",
    "Это объясняет две вещи. Первая: подключение к базе — дорогое дело, поэтому правильно открыть его один раз и переиспользовать. Вторая: так как Pool при создании не подключается, сервер запускается без ошибки даже при неверном пароле, ошибка выходит только на первом запросе. Проверили: создали Pool с неверным паролем — ошибки нет; на первом запросе password authentication failed."
   ],
   "d": [
    "Итог: <code>Pool</code> настраивается один раз, <b>подключается на первом запросе</b>, переиспользует соединение; «сервер работает» — не о базе",
    "Итог: Pool настраивается один раз, подключается на первом запросе и переиспользует соединение. «Сервер работает» в терминале — только про Express, о базе это ничего не говорит. Это увидите ещё раз на пятом этапе, в ошибках подключения. Теперь отправим через Pool первый запрос."
   ]
  }
 },
 "18": {
  "kicker": "Этап 4 · Express",
  "title": "pool.query несёт запрос в базу; в ответе rows — строки, rowCount — число из терминала",
  "seg": {
   "a": [
    "<code>GET /api/cars</code>: <code>pool.query('SELECT * FROM cars')</code> — <b>часть <code>rows</code> результата</b> возвращается через <code>res.json</code>",
    "Endpoint GET api cars. Pool query несёт select в базу. В объекте результата несколько вещей, нам нужны две: rows, то есть массив строк, и rowCount. Rows возвращается через res json. В Postman двести и три машины. Это тот же select из терминала, только ответ в виде JSON."
   ],
   "b": [
    "<code>rowCount</code> — тот самый <code>UPDATE 1</code> из терминала: измерили, <b><code>WHERE id = 99</code> → <code>rowCount: 0</code></b>, <code>rows: []</code>",
    "Rowcount говорит, сколько строк затронуто, это и есть update один из терминала или число строк в select. Проверили: в базе shop с where price меньше ста тысяч rowcount три. Update where id девяносто девять — rowcount ноль и пустой массив rows. Update ноль с первого этапа приходит именно сюда."
   ],
   "c": [
    "<code>async</code>/<code>await</code> и <code>try</code>/<code>catch</code>: запрос ожидается; при ошибке <b>статус 500 и текст ошибки</b>",
    "Pool query возвращает promise, поэтому его ждут через await, а функция — async. Всё внутри try. При ошибке срабатывает catch: сервер возвращает статус пятьсот и текст ошибки. На пятом этапе все ошибки увидите именно через этот catch."
   ],
   "d": [
    "Итог: <b><code>Pool</code> → <code>pool.query</code> → <code>rows</code> / <code>rowCount</code> → <code>res.json</code></b> — запрос идёт с сервера в базу за эти четыре шага",
    "Итог: запрос идёт с сервера в базу за четыре шага. Pool подключается, pool query отправляет запрос, из результата берётся rows или rowcount, res json возвращает ответ. На следующем экране остальные три endpoint: в них те же четыре шага, только SQL другой."
   ]
  }
 },
 "19": {
  "kicker": "Этап 4 · Express",
  "title": "Три пишущих endpoint — три SQL-команды; со статусом ответа и rowCount",
  "seg": {
   "a": [
    "<code>POST</code> — <code>INSERT … RETURNING *</code>: <b>новая строка в ответе</b>, статус 201",
    "GET читает, остальные три пишут. В POST — insert, в конце returning звёздочка, вы видели на первом этапе: база возвращает новую строку, с id. Эта строка уходит в ответ как rows ноль. Статус двести один, то есть создано. Chevrolet Spark добавлен с четвёртым id."
   ],
   "b": [
    "<code>is_rented: null</code> — колонка, не переданная в <code>POST</code>, осталась пустой: <b>в таблице нет <code>DEFAULT</code></b>",
    "Посмотрите на ответ: is rented null. В POST эту колонку не передали, а значения по умолчанию в таблице нет. Вспомните третий этап: база выполняет только записанное правило. Решение в таблице: alter table, is rented set default false. Тогда новая машина всегда записывается как свободная."
   ],
   "c": [
    "<code>PUT</code> — <code>UPDATE … WHERE id = $2</code>, <code>DELETE</code> — <code>WHERE id = $1</code>: 200; <b>если <code>rowCount</code> ноль — 404</b>",
    "PUT обновил цену второй машины, двести и обновлённая строка. DELETE удалил первую машину. В обоих есть where, id приходит из URL. Девяносто девятая машина: база возвращает update ноль, не ошибку. В этом образце код проверяет, ноль ли rowcount, и даёт четыреста четыре: машина не найдена. Без rowcount ответ был бы двести, то есть ложное «изменено»."
   ],
   "d": [
    "Итог: GET — 200, POST — 201, PUT/DELETE — 200, <b>не найдено — 404</b>, ошибка — 500; 404 решает <code>rowCount</code>",
    "Итог: GET двести, POST двести один, PUT и DELETE двести; строка не найдена — четыреста четыре, ошибка — пятьсот. Кто решает четыреста четыре? Rowcount, то есть update ноль из терминала. Теперь самый важный вопрос: почему значения передаются через доллар один."
   ]
  }
 },
 "20": {
  "kicker": "Этап 4 · Express · что происходит внутри",
  "title": "Склеенный SQL: 1 OR 1=1 — удалились все три машины. С $1 — 500, таблица на месте",
  "seg": {
   "a": [
    "Приклеить значение к тексту SQL: <code>'… WHERE id = ' + req.params.id</code> — <b>работает, но</b>",
    "В коде легко приклеить значение к тексту SQL: where id равно, плюс, req params id. В обычном запросе это работает: delete api cars один, удаляется первая машина. Проблема в том, что текст из URL становится частью SQL. Мы проверили."
   ],
   "b": [
    "В URL написали <code>1 OR 1=1</code> — запрос стал «всё»: <b><code>deleted: 3</code></b>, таблица пуста",
    "В URL вместо id отправили один or один равно один. Склеенная строка стала таким SQL: where id один, или один равно один. Один равно один всегда верно. Ответ двести, deleted три: таблица опустела. Это называют SQL injection, и это может сделать любой пользователь из браузера."
   ],
   "c": [
    "Тот же запрос с <code>$1</code>: значение идёт отдельно — <b><code>invalid input syntax for type integer</code></b>, 500, таблица на месте",
    "Теперь с доллар один: второй аргумент pool query — массив, значение в этом массиве и в текст SQL не попадает. База пытается прочитать один or один равно один как число и отклоняет: invalid input syntax for type integer. Пятьсот, но таблица на месте, все три машины есть."
   ],
   "d": [
    "Итог: каждое значение от пользователя — <b>через <code>$1, $2</code></b>, никогда не приклеивается к тексту SQL",
    "Итог: каждое значение от пользователя передаётся через доллар один, доллар два и никогда не приклеивается к тексту SQL. Это не вопрос стиля, а вопрос безопасности: один знак плюс открывает дорогу к удалению всей таблицы. Теперь поднимете сервер сами."
   ]
  }
 },
 "21": {
  "kicker": "Практика 3 / 4",
  "eyebrow": "Сейчас у себя · 15–20 минут",
  "title": "car_rental и server.js — свой сервер, проверка в Postman",
  "seg": {
   "a": [
    "Теперь вы: таблица вручную, сервер — <b>из образца или с Gemini</b>, проверка в Postman",
    "Теперь сами поднимаете сервер. Таблицу пишете вручную в терминале. Код сервера напишите по образцу или возьмите у Gemini: Express, pg, четыре endpoint, значения через доллар один. Пятнадцать–двадцать минут."
   ],
   "b": [
    "Шаги 1–2: <code>car_rental</code> и <code>cars</code>; папка, <b><code>express</code> и <code>pg</code></b>",
    "На первом шаге создаёте базу car rental и таблицу cars и добавляете три машины. На втором открываете папку сервера avto ijara, делаете npm init и ставите пакеты express и pg."
   ],
   "c": [
    "Шаги 3–4: <code>server.js</code>, <code>node server.js</code>, Postman; подтверждение — <b>статус ответа <code>POST</code></b>",
    "На третьем шаге пишете файл server js, ставите в него свой пароль и запускаете через node server js. На четвёртом отправляете в Postman GET и POST. В поле подтверждения напишите статус ответа на POST."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу, откроется окно с решениями. На пятом этапе все эти ошибки нарочно вызовем и исправим. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики у вас есть работающий сервер, и вы проверили его в Postman."
   ]
  },
  "steps": [
   {
    "t": "Таблица",
    "exp": "INSERT 0 3"
   },
   {
    "t": "Проект",
    "exp": "added … packages"
   },
   {
    "t": "Сервер — server.js: «Открыть код» (образец) или Gemini (Express + pg, четыре endpoint, $1, не найдено — 404); впишите пароль",
    "exp": "Server 3000-portda ishlayapti"
   },
   {
    "t": "Postman",
    "exp": "200 · 3 машины · POST — с id"
   }
  ],
  "proof": {
   "label": "Статус ответа POST",
   "placeholder": "напишите статус, который показал Postman",
   "wrong": "Статус успешного POST — трёхзначное число. В Postman написан над ответом."
  },
  "trouble": [
   [
    "500 password authentication failed for user \"postgres\"",
    "PASSWORD — пароль, заданный при установке (экран 24)"
   ],
   [
    "500 client password must be a string",
    "пароль пустой / process.env не прочитан (экран 24)"
   ],
   [
    "500 database \"…\" does not exist",
    "неверное имя DATABASE или база не создана (экран 24)"
   ],
   [
    "500 {\"error\":\"\"}",
    "PostgreSQL не работает — через console.error(err) будет видно ECONNREFUSED (экран 24)"
   ],
   [
    "500 Cannot destructure property 'model' of 'req.body'",
    "нет app.use(express.json()) (экран 23)"
   ],
   [
    "500 column \"price\" of relation \"cars\" does not exist",
    "неверное имя колонки в коде (экран 22)"
   ],
   [
    "код изменился, а ответ нет",
    "работает старый сервер — экран 25"
   ]
  ]
 },
 "22": {
  "kicker": "Этап 5 · ломаем и исправляем",
  "title": "column \"price\" of relation \"cars\" does not exist — в коде price, в таблице daily_price",
  "seg": {
   "a": [
    "Первая поломка — обычная ошибка Gemini: в <code>INSERT</code> он <b>сам выдумывает имя колонки</b>, <code>price</code>",
    "Вместо daily price стало price. Это самая частая ошибка Gemini: в insert имя колонки он берёт не из таблицы, а из своей догадки. Запускаем сервер: ошибки нет, он пишет «сервер работает». Ошибка выходит только при отправке POST."
   ],
   "b": [
    "POST → 500, в сообщении таблица и колонка: <b><code>\"price\"</code> · <code>\"cars\"</code></b>",
    "Отправляем POST, ответ пятьсот. Читаем сообщение: column price of relation cars does not exist. Колонка price, а таблица cars. Слово relation знакомо с третьего этапа: это таблица. Сообщение само сказало, что исправить."
   ],
   "c": [
    "Исправление: в коде <code>daily_price</code> — <b>перезапустив сервер</b>, POST → 201",
    "Смотрим структуру таблицы: колонка daily price. Исправляем в коде, останавливаем сервер и запускаем заново. Отправляем POST: ответ двести один, новая машина вернулась с id."
   ],
   "d": [
    "Итог: если 500 — сравните имя из текста <code>error</code> с <b><code>\\d cars</code></b>; код изменился — сервер заново",
    "Итог: если вышло пятьсот, читайте текст ошибки, внутри имя колонки и таблицы. Сравните его с бэкслеш d cars в терминале. После изменения кода обязательно перезапустите сервер, иначе продолжит работать старый код."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>daily_price</code>",
    "Сервер работает, все четыре запроса тоже. Теперь ломаем намеренно, потому что Gemini ученика делает именно эти ошибки. Ломаете вы сами: в тридцать шестой строке server js подсвечен daily price, нажмите на него.",
    "Нажмите на <b><code>daily_price</code></b> в 36-й строке <b>server.js</b> — станет <b><code>price</code></b>, как пишет Gemini."
   ]
  }
 },
 "23": {
  "kicker": "Этап 5 · ломаем и исправляем",
  "title": "Cannot destructure property 'model' of 'req.body' — тело запроса не прочитано",
  "seg": {
   "a": [
    "Строка удалена: <code>app.use(express.json())</code> нет — <b>сервер всё равно запускается</b>",
    "Вы удалили строку. Сервер запускается без ошибки, GET тоже работает. Проблема только в запросах с телом."
   ],
   "b": [
    "POST → 500: <code>req.body</code> — <b><code>undefined</code></b>, взять <code>model</code> нельзя",
    "Отправляем POST, ответ пятьсот. Сообщение такое: cannot destructure property model of req body as it is undefined. То есть req body нет вообще: Express не прочитал тело запроса, потому что не подключена часть, которая читает JSON."
   ],
   "c": [
    "Исправление: строка возвращается — после создания <code>app</code>, <b>до endpoint</b> — POST → 201",
    "Для исправления возвращаем строку app use express json — после создания app и до endpoint. Порядок важен: эта строка работает перед каждым запросом. Сервер перезапускается, POST двести один."
   ],
   "d": [
    "Итог: если <code>req.body</code> — <code>undefined</code>, первое место, куда смотреть, — <b><code>express.json()</code></b>",
    "Итог: если вышла ошибка req body undefined, первое место, куда смотреть, — app use express json. И если GET работает, а POST и PUT нет, — тоже эта строка. Одна строка, но без неё не работает ни один запрос с телом."
   ],
   "x": [
    "Вторая поломка тоже <b>ваша</b>: нажмите на подсвеченный в коде <code>app.use(express.json())</code>",
    "Вторая поломка тоже ваша. Gemini иногда забывает одну строку. В восемнадцатой строке server js подсвечен app use express json, нажмите на него: строка удалится.",
    "Нажмите на <b><code>app.use(express.json())</code></b> в 18-й строке <b>server.js</b> — строка удалится."
   ]
  }
 },
 "24": {
  "kicker": "Этап 5 · ломаем и исправляем",
  "title": "Сервер говорит «работает» — ошибка пароля, базы и PostgreSQL выходит на первом запросе",
  "seg": {
   "a": [
    "<code>Pool</code> подключается не сразу (экран 17): сервер запускается, <b>ошибка на первом запросе</b>",
    "Вы видели на экране Pool: при запуске сервера Pool не подключается к базе, подключается на первом запросе. Поэтому даже при неверном пароле в терминале пишется «сервер работает». В случае «сервер работает, но пятьсот» читайте сообщение: бывает четыре вида."
   ],
   "b": [
    "Пароль неверный — <code>password authentication failed</code>; пароль пустой — <b><code>client password must be a string</code></b>",
    "Если пароль неверный: password authentication failed for user postgres. Если пароль вообще не передан, например не прочитан из process env: client password must be a string. Второе выглядит странно, но смысл простой: переменная пароля пустая."
   ],
   "c": [
    "Неверное имя базы — <code>database \"carrental\" does not exist</code>: <b>пропало нижнее подчёркивание</b>",
    "Если в имени базы пропало нижнее подчёркивание: database carrental does not exist. База есть, просто её имя car подчёркивание rental. Точное имя посмотрите в терминале через бэкслеш l."
   ],
   "d": [
    "PostgreSQL выключен — текст ошибки пустой; <b><code>console.error(err)</code></b> — видно <code>ECONNREFUSED</code>",
    "Самое запутанное: если PostgreSQL не работает, ответ пятьсот, но error пустой, и в терминале пустая строка. Проверили: если дать console error не err message, а сам err, выйдет ECONNREFUSED, то есть в подключении отказано. Решение: запустите PostgreSQL."
   ],
   "e": [
    "Итог: «работает» — только про Express; <b>об ошибке базы говорят первый запрос и терминал</b>",
    "Итог: строка «работает» в терминале — только про Express. Подключение к базе проверяется на первом запросе. Если сообщение пустое, дайте console error всю ошибку. Запуск PostgreSQL: в Windows — Services, в Mac — Postgres.app."
   ]
  }
 },
 "25": {
  "kicker": "Этап 5 · ломаем и исправляем",
  "title": "Второй node server.js тоже говорит «работает» — а отвечает старый сервер",
  "seg": {
   "a": [
    "Самый запутанный случай: <b>«исправил код, ничего не изменилось»</b>",
    "Самый запутанный случай: исправляете код, снова запускаете сервер, а ответ не меняется. Причина чаще всего одна: первый сервер ещё работает в другом терминале."
   ],
   "b": [
    "Проверили: второй сервер тоже написал «работает» и <b>вышел без ошибки</b>",
    "Мы проверили. Пока первый сервер работал, во втором окне node server js. Ожидали ошибку «порт занят». На деле второй сервер тоже написал «работает» и вышел без ошибки. На запросы отвечает первый, старый сервер."
   ],
   "c": [
    "Причина в Express 5: ошибка передаётся в callback <code>listen</code>, <b>а callback в образце её не читает</b>",
    "Причина в пятой версии Express: listen передаёт ошибку в callback. А callback, написанный Gemini, ошибку не читает, только выводит «работает». Если callback читает ошибку, выходит address already in use, и сервер останавливается. Это недостаток кода образца, а не Express."
   ],
   "d": [
    "Итог: <b>один проект — один терминал</b>; перед перезапуском <code>Ctrl+C</code>",
    "Итог: для одного проекта — один терминал. Перед перезапуском остановите старый сервер через Ctrl C. Если ответ не меняется, первый вопрос: не остался ли сервер открытым в другом терминале?"
   ]
  }
 },
 "26": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 5 — какая строка с ошибкой?",
  "title": "POST 500: column \"price\" of relation \"cars\" does not exist. Найдите строку с ошибкой",
  "q": "Вы видели поломку, теперь найдите сами. Четвёртая проверка. Вспомните колонки таблицы: id, model, daily price, year, is rented. В этом фрагменте POST одна строка просит колонку, которой нет в таблице. Нажмите на эту строку.",
  "ok": "Верно. В тридцать шестой строке в insert написано price, а в таблице daily price. Daily price в тридцать четвёртой строке — только переменная JavaScript, база её не видит, она видит имя в тексте SQL. На экране исправленное: daily price, POST двести один. Значит, если вышло пятьсот, сравните каждое имя в тексте SQL с колонками таблицы.",
  "okShort": "Строка 36: в SQL <code>price</code> — в таблице <code>daily_price</code>. <code>daily_price</code> в строке 34 — переменная JS, база её не видит.",
  "hint": "База не видит переменных JavaScript — только текст SQL в кавычках. Ищите имена колонок в этом тексте.",
  "task": "Правило: имена колонок в SQL точно такие же, как в таблице — <code>cars</code>: <code>id, model, daily_price, year, is_rented</code>. В этом фрагменте POST одна строка просит колонку, которой нет в таблице. <b>Нажмите на эту строку.</b>"
 },
 "27": {
  "kicker": "Практика 4 / 4",
  "eyebrow": "Сейчас у себя · 10 минут",
  "title": "Две поломки, два исправления — на своём сервере",
  "seg": {
   "a": [
    "Теперь вы: на своём сервере <b>нарочно вызываете и исправляете</b> две ошибки",
    "Последняя практика: на своём сервере нарочно вызываете две ошибки и исправляете их. Десять минут. Эти ошибки бывают и в настоящем проекте; если один раз вызовете их сами, потом сразу узнаете по сообщению."
   ],
   "b": [
    "Шаги 1–2: ошибка <code>price</code> — 500, <b>прочитайте сообщение</b>, исправьте, 201",
    "На первом шаге меняете daily price в insert на price, перезапускаете сервер и отправляете POST. На втором читаете сообщение, исправляете ошибку и перезапускаете: ответ должен быть двести один."
   ],
   "c": [
    "Шаги 3–4: включите новый сервер, не закрыв старый; подтверждение — <b>текст сообщения 500</b>",
    "На третьем шаге, пока работает первый сервер, во втором терминале снова делаете node server js и видите строку «работает». На четвёртом останавливаете оба через Ctrl C. В поле подтверждения скопируйте сообщение пятьсот с первого шага."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу, откроется окно с решениями. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, когда эти две ошибки появятся, вы увидите их не впервые и сразу найдёте причину по сообщению."
   ]
  },
  "steps": [
   {
    "t": "Поломка",
    "exp": "500 column \"price\" of relation \"cars\" does not exist"
   },
   {
    "t": "Исправление",
    "exp": "201"
   },
   {
    "t": "Два сервера",
    "exp": "второй тоже «Server 3000-portda ishlayapti»",
    "cmds": [
     "1-й терминал работает",
     "во 2-м терминале: node server.js"
    ]
   },
   {
    "t": "Остановка",
    "exp": "Postman: GET — ответа нет (сервера нет)",
    "cmds": [
     "в обоих терминалах Ctrl+C"
    ]
   }
  ],
  "proof": {
   "label": "Сообщение 500 с шага 1",
   "placeholder": "вставьте текст error из Postman",
   "wrong": "Сообщение должно быть полным: какая колонка и какая таблица (of relation …). Скопируйте значение error из Postman."
  },
  "trouble": [
   [
    "На шаге 1 201",
    "сервер не перезапущен — работает старый код (экран 25)"
   ],
   [
    "column \"price\" does not exist (без of relation)",
    "ошибка сделана в SELECT/UPDATE — меняйте колонку в INSERT"
   ],
   [
    "на шаге 3 listen EADDRINUSE: address already in use :::3000",
    "в вашем server.js callback читает ошибку (Gemini написал иначе) — это хорошо; остановите оба терминала"
   ],
   [
    "на шаге 4 ответ есть",
    "открыт ещё один терминал — везде Ctrl+C"
   ]
  ]
 },
 "28": {
  "kicker": "Этап 7 · подготовка к классу",
  "eyebrow": "m4-06 · m4-08",
  "title": "Два урока ученика: что видит ученик, что добавляете вы, к чему быть готовым",
  "seg": {
   "a": [
    "m4-06 (21 экран): магазин кнопками, на практике — <b>настоящий терминал PostgreSQL</b>; таблица — та же <code>products</code>, что сегодня",
    "Теперь подготовка к классу, два экрана. Первый урок ученика m4-06, двадцать один экран: ученик управляет магазином кнопками, insert, select, where, update, delete. Таблица — ровно та products, что вы создали сегодня. А на практике он создаёт свой магазин в настоящем терминале PostgreSQL или в VS Code с AI, поэтому PostgreSQL обязан работать на каждом компьютере. Команду от ИИ вы проверяете, как на шестом этапе."
   ],
   "b": [
    "m4-08 (9 экранов): таблица <code>cars</code> вручную, <code>server.js</code> от Gemini, проверка в Postman — <b>это ваш сегодняшний сервер</b>",
    "Второй — m4-08, AvtoIjara, девять экранов: ученик сам пишет в терминале таблицу cars, код сервера берёт у Gemini, проверяет в Postman и находит ошибку AI. Это тот сервер, что вы подняли сегодня. Разница: ученик не знает, что внутри Pool, не знает транзакцию и injection, а вы знаете."
   ],
   "c": [
    "Вы добавляете: число в ответе · <code>BEGIN … ROLLBACK</code> · <code>ORDER BY</code> · апостроф · <code>NOT NULL</code> · <b>и <code>HINT</code> ошибается</b>; четыре отличия скажите заранее",
    "Что вы добавляете к уроку: после каждого update спрашивайте число в ответе, update без where покажите на проекторе внутри begin, скажите про order by и апостроф, когда ученик создаёт свой магазин, посоветуйте not null, напомните, что hint тоже ошибается. Четыре отличия скажите заранее: текст ошибки в уроке короткий, Gemini каждому пишет разный код, после POST is rented null, даже при занятом порте «работает»."
   ],
   "d": [
    "Итог: до урока — PostgreSQL и Postman на каждом компьютере, <b>пароль класса</b>, один проект — один терминал; время — практике",
    "Итог: до урока проверьте три вещи: на каждом компьютере открывается терминал PostgreSQL и установлен Postman, пароль класса всем известен, правило: один проект — один терминал. Предложение по времени: в m4-06 из девяноста минут двадцать пять на практику, в m4-08 сорок на сервер и Postman, потому что именно здесь ученики ошибаются больше всего."
   ]
  }
 },
 "29": {
  "kicker": "Этап 7 · подготовка к классу",
  "title": "Шесть случаев и готовые ответы — все вы сегодня видели сами",
  "seg": {
   "a": [
    "Шесть случаев, которые обязательно будут на уроке — <b>все вы сегодня видели сами</b>",
    "Два урока ученика вы знаете. Теперь посмотрим шесть случаев, которые обязательно будут на уроке. Все вы сегодня видели сами, поэтому скажу коротко."
   ],
   "b": [
    "Ошибка имени и апостроф — <b>сравните с <code>\\d</code></b>, апостроф дважды",
    "Первый случай — ошибка в имени таблицы или колонки: сравните имя в сообщении с бэкслеш d, hint не верьте. Второй — апостроф: он пишется дважды."
   ],
   "c": [
    "Без <code>WHERE</code> и ошибки подключения — <b><code>BEGIN</code>, пароль и пустое сообщение</b>",
    "Третий — update или delete без where: его предупреждает begin. Четвёртый — ошибка в пароле или имени базы: ищите её в настройках Pool. Пятый: если сообщение пустое, дайте console error всю ошибку и проверьте PostgreSQL."
   ],
   "d": [
    "Итог: не меняется — второй терминал; <b>читайте сообщение вместе с учеником</b>, ответ сразу не говорите",
    "Шестой: если ученик говорит «не изменилось», проверьте, не остался ли старый сервер во втором терминале. Итог и способ один: не говорите ответ сразу, читайте сообщение вместе с учеником. Внизу готовые ответы на вопросы учеников."
   ]
  }
 },
 "30": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "UPDATE products SET price = 99000; — нет WHERE. Ответ?",
    "e": "Без WHERE — все строки таблицы.",
    "o": [
     "UPDATE 1 — изменится только первая строка",
     "ERROR — UPDATE без WHERE запрещён",
     "UPDATE 3 — все строки получили новую цену",
     "UPDATE 0 — условия нет, ничего"
    ]
   },
   {
    "q": "BEGIN; → DELETE FROM products; → ROLLBACK; → SELECT *. Результат?",
    "e": "ROLLBACK отменяет транзакцию.",
    "o": [
     "Все товары на месте — DELETE отменён",
     "(0 rows) — DELETE уже записан на диск",
     "Вернётся только первая строка, и всё",
     "ERROR — после ROLLBACK таблица закрыта"
    ]
   },
   {
    "q": "Внутри транзакции команда дала ошибку, приглашение shop=!#. Если теперь написать SELECT 1;?",
    "e": "Состояние aborted: до ROLLBACK все команды отклоняются.",
    "o": [
     "Сработает как обычно — ошибка прошла",
     "Ошибка current transaction is aborted",
     "База сама сделает COMMIT и даст результат",
     "Приглашение само вернётся к обычному"
    ]
   },
   {
    "q": "После UPDATE в SELECT * строка ушла в конец списка. Причина?",
    "e": "ctid изменился; порядок — через ORDER BY.",
    "o": [
     "Это ошибка — строка испорчена, перепишите",
     "Изменился id — UPDATE дал новый id",
     "Транзакция не закрыта — строка временная",
     "Нет ORDER BY — порядок не гарантирован"
    ]
   },
   {
    "q": "Создан new Pool({…}), пароль неверный. Что будет при запуске сервера?",
    "e": "Pool подключается на первом запросе.",
    "o": [
     "Сразу ошибка, сервер падает",
     "Сервер запустится, ошибка на первом запросе",
     "Pool сам найдёт правильный пароль",
     "Ошибки не будет никогда — пароль в кэше"
    ]
   },
   {
    "q": "Сервер «работает», GET работает, POST — Cannot destructure property 'model' of 'req.body'. Причина?",
    "e": "req.body не прочитан.",
    "o": [
     "Неверный пароль — база отклонила запрос",
     "Нет таблицы — INSERT не выполнился",
     "Порт занят — POST ушёл на другой сервер",
     "Не подключён express.json() — тело пустое"
    ]
   },
   {
    "q": "POST 500, {\"error\":\"\"}, в терминале пустая строка. Первый шаг?",
    "e": "Пустое сообщение — скрыт ECONNREFUSED.",
    "o": [
     "Выключить сервер и включить заново",
     "Попросить у Gemini полностью новый код",
     "Посмотреть ошибку через console.error(err)",
     "Обновить пакеты через npm install"
    ]
   },
   {
    "q": "'DELETE … WHERE id = ' + req.params.id и URL 1 OR 1=1. Что будет?",
    "e": "Приклеенный текст стал SQL; с $1 — 500, таблица на месте.",
    "o": [
     "Удалятся все строки, и вернётся ответ 200",
     "База отклонит такой запрос — 500",
     "404 — id 1 OR 1=1 не найден",
     "Удалится только первая машина, остальные останутся"
    ]
   }
  ]
 },
 "31": {
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
  ru(S5, { ...head(5), ...((typeof RU_S !== 'undefined' && RU_S.S5) || {}) });
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S11, { ...head(11), ...((typeof RU_S !== 'undefined' && RU_S.S11) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S17, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.S17) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S19, { ...head(19), ...((typeof RU_S !== 'undefined' && RU_S.S19) || {}) });
  ru(S20, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.S20) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(S24, { ...head(24), ...((typeof RU_S !== 'undefined' && RU_S.S24) || {}) });
  ru(S25, { ...head(25), ...((typeof RU_S !== 'undefined' && RU_S.S25) || {}) });
  ru(S28, { ...head(28), ...((typeof RU_S !== 'undefined' && RU_S.S28) || {}) });
  ru(S29, { ...head(29), ...((typeof RU_S !== 'undefined' && RU_S.S29) || {}) });
  ru(P8.S, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.P8_S) || {}) });
  ru(P8.steps, RU_MDT[8].steps);
  ru(P8.trouble, RU_MDT[8].trouble);
  ru(P8.proof, RU_MDT[8].proof);
  ru(P13.S, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.P13_S) || {}) });
  ru(P13.steps, RU_MDT[13].steps);
  ru(P13.trouble, RU_MDT[13].trouble);
  ru(P13.proof, RU_MDT[13].proof);
  ru(P21.S, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.P21_S) || {}) });
  ru(P21.steps, RU_MDT[21].steps);
  ru(P21.trouble, RU_MDT[21].trouble);
  ru(P21.proof, RU_MDT[21].proof);
  ru(P27.S, { ...head(27), ...((typeof RU_S !== 'undefined' && RU_S.P27_S) || {}) });
  ru(P27.steps, RU_MDT[27].steps);
  ru(P27.trouble, RU_MDT[27].trouble);
  ru(P27.proof, RU_MDT[27].proof);
  ru(FINAL, RU_MDT[30].final);
})();
