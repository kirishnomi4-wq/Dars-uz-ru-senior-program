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
// className (F-1125-01): «mk-zich» — 1280×720 da zich sahna (CSS_N1, faqat past ekranda)
function Ide({ root = MKCFG.root, files, active, onOpen, fresh, clickable, children, style, className }) {
  return <div className={'mk-ide' + (className ? ' ' + className : '')} style={style}>
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
/* F-1125-01 (1-savol): 1280×720 da Buzamiz sahnasi — kod, chizma, terminal va xulosa bitta oynaga sig'adi. Faqat Ide className mk-zich bo'lgan ekranlar; 1600 va 1920 o'zgarmaydi. Chizma o'z o'lchamida (kattalashtirilmaydi). */
@media (max-height:920px){.mk-ide.mk-zich .mk-ide-main{gap:8px}}
@media (max-height:760px){
.mk-body:has(.mk-zich){padding-top:8px;padding-bottom:8px}
.mk-ide.mk-zich .mk-ide-bar{padding:6px 12px}
.mk-ide.mk-zich .mk-ide-main{gap:6px;padding:8px}
.mk-ide.mk-zich .mk-panel{font-size:11.5px;line-height:1.26}
.mk-ide.mk-zich .mk-panel .fn{margin-bottom:4px;padding:4px 12px}
.mk-ide.mk-zich .mk-rule{padding:8px 12px;font-size:13.5px;line-height:1.4}
.mk-ide.mk-zich .n1-fit{max-width:520px;margin:0 auto}
}
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

// AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-kod.py — OrderBotNest teglaridan aynan (qo'lda tahrirlanmaydi)
const KOD = {
 "START_START": {
  "file": "src/api/telegram/telegram.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "  private registerCustomer() {",
    "n": 56
   },
   {
    "t": "    this.bot.start(async (ctx) => {",
    "n": 57
   },
   {
    "t": "      const user = this.users.getOrCreate(ctx.from);",
    "n": 58
   },
   {
    "t": "      await ctx.reply(texts.start(user.name, user.role === 'admin'));",
    "n": 59
   },
   {
    "t": "    });",
    "n": 60
   }
  ]
 },
 "START_USER": {
  "file": "src/api/user/user.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "@Injectable()",
    "n": 5
   },
   {
    "t": "export class UserService {",
    "n": 6
   },
   {
    "t": "  // telegramId → foydalanuvchi. Xotirada: server qayta ishga tushsa bo'shaydi.",
    "n": 7
   },
   {
    "t": "  private readonly users = new Map<number, User>();",
    "n": 8
   },
   {
    "t": "",
    "n": 9
   },
   {
    "t": "  getOrCreate(from: { id: number; first_name: string }): User {",
    "n": 10
   },
   {
    "t": "    const bor = this.users.get(from.id);",
    "n": 11
   },
   {
    "t": "    if (bor) return bor;",
    "n": 12
   },
   {
    "t": "    const user: User = {",
    "n": 13
   },
   {
    "t": "      telegramId: from.id,",
    "n": 14
   },
   {
    "t": "      name: from.first_name,",
    "n": 15
   },
   {
    "t": "      phone: null,",
    "n": 16
   },
   {
    "t": "      role: config.ADMIN_TELEGRAM_IDS.includes(from.id) ? 'admin' : 'customer',",
    "n": 17
   },
   {
    "t": "      state: 'IDLE',",
    "n": 18
   },
   {
    "t": "    };",
    "n": 19
   },
   {
    "t": "    this.users.set(from.id, user);",
    "n": 20
   },
   {
    "t": "    return user;",
    "n": 21
   },
   {
    "t": "  }",
    "n": 22
   }
  ]
 },
 "START_ORDER": {
  "file": "src/api/order/order.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "@Injectable()",
    "n": 11
   },
   {
    "t": "export class OrderService {",
    "n": 12
   },
   {
    "t": "  // Buyurtmalar ro'yxati xotirada; id oddiy hisoblagich",
    "n": 13
   },
   {
    "t": "  private readonly orders: Order[] = [];",
    "n": 14
   },
   {
    "t": "  private nextId = 1;",
    "n": 15
   }
  ]
 },
 "START_CAT": {
  "file": "src/api/catalog/catalog.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "// Katalog hozircha koddagi ro'yxat. Narx so'mda, stock — omborda nechta.",
    "n": 6
   },
   {
    "t": "const PRODUCTS: Product[] = [",
    "n": 7
   },
   {
    "t": "  { id: 1, name: 'Klaviatura', price: 120000, stock: 8 },",
    "n": 8
   },
   {
    "t": "  { id: 2, name: 'Sichqoncha', price: 75000, stock: 15 },",
    "n": 9
   },
   {
    "t": "  { id: 3, name: 'Quloqchin', price: 95000, stock: 5 },",
    "n": 10
   },
   {
    "t": "  { id: 4, name: 'Kolonka', price: 50000, stock: 10 },",
    "n": 11
   },
   {
    "t": "  { id: 5, name: 'Planshet', price: 300000, stock: 3 },",
    "n": 12
   },
   {
    "t": "  { id: 6, name: \"O'yinchoq\", price: 30000, stock: 4 },",
    "n": 13
   },
   {
    "t": "];",
    "n": 14
   }
  ]
 },
 "DONE_PRODUCT": {
  "file": "src/core/entity/product.entity.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';",
    "n": 1
   },
   {
    "t": "",
    "n": 2
   },
   {
    "t": "// products — PG-2 darsidagi jadvalning o'zi: id, name, price, stock",
    "n": 3
   },
   {
    "t": "@Entity('products')",
    "n": 4
   },
   {
    "t": "export class Product {",
    "n": 5
   },
   {
    "t": "  @PrimaryGeneratedColumn()",
    "n": 6
   },
   {
    "t": "  id: number;",
    "n": 7
   },
   {
    "t": "",
    "n": 8
   },
   {
    "t": "  @Column({ type: 'varchar', unique: true })",
    "n": 9
   },
   {
    "t": "  name: string;",
    "n": 10
   },
   {
    "t": "",
    "n": 11
   },
   {
    "t": "  @Column({ type: 'integer' })",
    "n": 12
   },
   {
    "t": "  price: number; // so'm",
    "n": 13
   },
   {
    "t": "",
    "n": 14
   },
   {
    "t": "  @Column({ type: 'integer', default: 0 })",
    "n": 15
   },
   {
    "t": "  stock: number; // omborda nechta; bazada CHECK (stock >= 0)",
    "n": 16
   },
   {
    "t": "}",
    "n": 17
   }
  ]
 },
 "DONE_MIG": {
  "file": "src/infrastructure/migrations/1762200000000-init.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "  public async up(q: QueryRunner): Promise<void> {",
    "n": 7
   },
   {
    "t": "    await q.query(`CREATE TABLE \"products\" (",
    "n": 8
   },
   {
    "t": "      \"id\" SERIAL PRIMARY KEY,",
    "n": 9
   },
   {
    "t": "      \"name\" VARCHAR NOT NULL UNIQUE,",
    "n": 10
   },
   {
    "t": "      \"price\" INTEGER NOT NULL,",
    "n": 11
   },
   {
    "t": "      \"stock\" INTEGER NOT NULL DEFAULT 0,",
    "n": 12
   },
   {
    "t": "      CONSTRAINT \"stock_nonneg\" CHECK (\"stock\" >= 0)",
    "n": 13
   },
   {
    "t": "    )`);",
    "n": 14
   }
  ]
 },
 "DONE_USER": {
  "file": "src/core/entity/user.entity.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "@Entity('users')",
    "n": 11
   },
   {
    "t": "export class User {",
    "n": 12
   },
   {
    "t": "  @PrimaryGeneratedColumn()",
    "n": 13
   },
   {
    "t": "  id: number;",
    "n": 14
   },
   {
    "t": "",
    "n": 15
   },
   {
    "t": "  // Telegram id 32 bitga sig'maydi (5 123 456 789) — BIGINT.",
    "n": 16
   },
   {
    "t": "  // node-pg BIGINT'ni MATN qilib qaytaradi, shuning uchun tipi string.",
    "n": 17
   },
   {
    "t": "  @Column({ name: 'telegram_id', type: 'bigint', unique: true })",
    "n": 18
   },
   {
    "t": "  telegram_id: string;",
    "n": 19
   },
   {
    "t": "",
    "n": 20
   },
   {
    "t": "  @Column({ type: 'varchar' })",
    "n": 21
   },
   {
    "t": "  name: string;",
    "n": 22
   },
   {
    "t": "",
    "n": 23
   },
   {
    "t": "  @Column({ type: 'varchar', nullable: true })",
    "n": 24
   },
   {
    "t": "  phone: string | null;",
    "n": 25
   },
   {
    "t": "",
    "n": 26
   },
   {
    "t": "  @Column({ type: 'varchar', default: 'customer' })",
    "n": 27
   },
   {
    "t": "  role: Role;",
    "n": 28
   },
   {
    "t": "",
    "n": 29
   },
   {
    "t": "  // Suhbat qaysi bosqichda — bazada, server qayta ishga tushsa ham qoladi",
    "n": 30
   },
   {
    "t": "  @Column({ type: 'varchar', default: 'IDLE' })",
    "n": 31
   },
   {
    "t": "  state: UserState;",
    "n": 32
   }
  ]
 },
 "DONE_CART": {
  "file": "src/api/cart/cart.service.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "  // Bitta so'rov: yo'q bo'lsa INSERT, bor bo'lsa qty + 1 (ON CONFLICT — UNIQUE (user_id, product_id) ustiga)",
    "n": 19
   },
   {
    "t": "  async add(user: User, productId: number): Promise<number> {",
    "n": 20
   },
   {
    "t": "    const rows: { qty: number }[] = await this.repo.query(",
    "n": 21
   },
   {
    "t": "      `INSERT INTO cart_items (user_id, product_id, qty) VALUES ($1, $2, 1)",
    "n": 22
   },
   {
    "t": "       ON CONFLICT (user_id, product_id) DO UPDATE SET qty = cart_items.qty + 1",
    "n": 23
   },
   {
    "t": "       RETURNING qty`,",
    "n": 24
   },
   {
    "t": "      [user.id, productId],",
    "n": 25
   },
   {
    "t": "    );",
    "n": 26
   },
   {
    "t": "    return rows[0].qty;",
    "n": 27
   },
   {
    "t": "  }",
    "n": 28
   }
  ]
 },
 "DONE_PLACE": {
  "file": "src/api/order/order.service.ts",
  "tag": "tgpg-done",
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
   },
   {
    "t": "        items.push(",
    "n": 46
   },
   {
    "t": "          m.create(OrderItem, { product: p, qty: c.qty, price: p.price }),",
    "n": 47
   },
   {
    "t": "        );",
    "n": 48
   },
   {
    "t": "      }",
    "n": 49
   },
   {
    "t": "      const order = m.create(Order, {",
    "n": 50
   },
   {
    "t": "        user,",
    "n": 51
   },
   {
    "t": "        phone: user.phone!,",
    "n": 52
   },
   {
    "t": "        status: 'NEW',",
    "n": 53
   },
   {
    "t": "        total: items.reduce((s, i) => s + i.price * i.qty, 0),",
    "n": 54
   },
   {
    "t": "        items,",
    "n": 55
   },
   {
    "t": "      });",
    "n": 56
   },
   {
    "t": "      const saved = await m.save(order);",
    "n": 57
   },
   {
    "t": "      await m.delete(CartItem, { user: { id: user.id } });",
    "n": 58
   },
   {
    "t": "      return saved;",
    "n": 59
   },
   {
    "t": "    });",
    "n": 60
   },
   {
    "t": "  }",
    "n": 61
   }
  ]
 },
 "DONE_DS": {
  "file": "src/infrastructure/data-source.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "// Bitta ulanish sozlamasi — ham Nest (DatabaseModule), ham typeorm CLI (migration:run) shuni ishlatadi",
    "n": 7
   },
   {
    "t": "export const dataSourceOptions = {",
    "n": 8
   },
   {
    "t": "  type: 'postgres' as const,",
    "n": 9
   },
   {
    "t": "  url: config.DATABASE_URL,",
    "n": 10
   },
   {
    "t": "  ssl: config.DATABASE_URL.includes('sslmode=require')",
    "n": 11
   },
   {
    "t": "    ? { rejectUnauthorized: false }",
    "n": 12
   },
   {
    "t": "    : false,",
    "n": 13
   },
   {
    "t": "  entities: [Product, User, CartItem, Order, OrderItem],",
    "n": 14
   },
   {
    "t": "  migrations: [Init1762200000000],",
    "n": 15
   },
   {
    "t": "  synchronize: false, // jadvallar faqat migratsiya bilan o'zgaradi",
    "n": 16
   },
   {
    "t": "  logging: config.DB_LOGGING ? ['query', 'error'] : ['error'],",
    "n": 17
   },
   {
    "t": "};",
    "n": 18
   },
   {
    "t": "",
    "n": 19
   }
  ]
 },
 "BUZUQ": {
  "file": "src/api/order/order.service.ts",
  "tag": "buzuq",
  "lines": [
   {
    "t": "      for (const c of cart) {",
    "n": 29
   },
   {
    "t": "        // 1) Mahsulotni o'qiymiz va omborda yetarlimi — tekshiramiz",
    "n": 30
   },
   {
    "t": "        const p = await m.findOneBy(Product, { id: c.product.id });",
    "n": 31
   },
   {
    "t": "        if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
    "n": 32
   },
   {
    "t": "        if (p.stock < c.qty) {",
    "n": 33
   },
   {
    "t": "          throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
    "n": 34
   },
   {
    "t": "        }",
    "n": 35
   },
   {
    "t": "        p.stock = p.stock - c.qty;",
    "n": 36
   },
   {
    "t": "        await m.save(p);",
    "n": 37
   },
   {
    "t": "        items.push(",
    "n": 38
   },
   {
    "t": "          m.create(OrderItem, { product: p, qty: c.qty, price: p.price }),",
    "n": 39
   },
   {
    "t": "        );",
    "n": 40
   },
   {
    "t": "      }",
    "n": 41
   }
  ]
 }
};

// ============================================================
//  TgPg MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-matn.py (manba: 17-TgPg-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Telegraf + PostgreSQL",
  "title": "Tayyor buyurtma boti bor. Uni AI bilan PostgreSQL'ga ko'chiramiz — bosqichma-bosqich va har qadamni tekshirib",
  "seg": [
   [
    "a",
    "Telegraf bilan bot yozishni bilasiz — bugun <b>bot ma'lumotini PostgreSQL'da saqlaymiz</b>",
    "Assalomu alaykum. Telegraf bilan bot yozishni, buyruq va inline tugmalarni videodarslarda ko'rgansiz. Bugun keyingi qadam: bot ma'lumotini PostgreSQL'da saqlaymiz. Shunda server qayta ishga tushsa ham savat, buyurtma va telefon raqami yo'qolmaydi."
   ],
   [
    "b",
    "Loyiha tayyor: <b>katalog, savat, buyurtma va admin</b> — Nest va Telegraf'da",
    "Loyiha noldan yozilmaydi. GitHub'da tayyor buyurtma boti bor: katalog, savat, buyurtma va admin paneli, NestJS va Telegraf'da. U to'liq ishlaydi, faqat hamma ma'lumot xotirada turadi. Siz uni clone qilib, kamchiligini o'z ko'zingiz bilan ko'rasiz."
   ],
   [
    "c",
    "Kodni AI yozadi, siz <b>bosqichlab boshqarasiz va har bosqichni tekshirasiz</b>",
    "Kodni AI yozadi: Antigravity, Claude Code, Codex yoki Copilot, qaysi biri bo'lsa ham. Sizning ishingiz boshqarish: ishni to'rt bosqichga bo'lasiz, har biriga prompt yozasiz va natijani o'zingiz tekshirasiz. Biz buni ikki xil AI bilan haqiqatan qilib ko'rdik, ekrandagi javoblar o'sha yurgizishlardan."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>. Shoshilmang",
    "Dars olti bosqichdan iborat, to'rtta amaliyotda AI bilan o'zingiz ishlaysiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · loyiha va muammo",
  "title": "Loyiha besh moduldan iborat: telegram, catalog, user, cart va order",
  "seg": [
   [
    "a",
    "Bot buyruqlari bitta faylda: <b><code>telegram.service.ts</code> — siz bilgan Telegraf handler'lari</b>",
    "Loyihani Explorer'da ochamiz. Bot buyruqlari bitta faylda: telegram service. Ichida siz bilgan Telegraf handler'lari turadi: bot start, bot command catalog va bot action. Tugmalar keyboards faylida, bot matnlari texts faylida."
   ],
   [
    "b",
    "Logika to'rt Service'da: <b>katalog, foydalanuvchi, savat va buyurtma</b> — har biri o'z modulida",
    "Handler'lar logikani o'zi yozmaydi, Service'ga beradi. Loyihada to'rtta Service bor: catalog mahsulotlar va omborni boshqaradi, user foydalanuvchi va uning state'ini, cart savatni, order buyurtmani. Har biri o'z modulida, Nest ularni telegram service'ga inject qiladi."
   ],
   [
    "c",
    "Mijoz yo'li: <b>katalog → savat → telefon → buyurtma</b>, keyin admin tasdiqlaydi",
    "Mijoz yo'lini ko'ramiz. Aziza katalogni ochadi, mahsulotlar ikkitadan sahifada. Tugmani bosib savatga qo'shadi, buyurtma beradi, bot telefon so'raydi. Raqam kelgach buyurtma yaratiladi va adminga xabar ketadi. Admin Jasur buyurtmani tasdiqlaydi, Azizaga xabar boradi."
   ],
   [
    "d",
    "Xulosa: bot to'liq ishlaydi, lekin <b>hamma ma'lumot <code>Map</code> va massivda</b> turibdi",
    "Xulosa: bot to'liq ishlaydi, admin roli ham bor. Lekin Service'larni ochsangiz, foydalanuvchilar Map'da, savatlar Map'da, buyurtmalar oddiy massivda turibdi. Bu ma'lumot qayerda yashashini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · ichida",
  "title": "Map Node jarayonining xotirasida yashaydi: jarayon to'xtasa — u ham yo'qoladi",
  "seg": [
   [
    "a",
    "1-jarayonda hammasi bor: <b>buyurtma #1, savatda Sichqoncha, Azizaning telefoni</b>",
    "Birinchi jarayonda bot ishlayapti. Aziza buyurtma berdi, raqami bir, jami ikki yuz yigirma ming so'm. Admin uni tasdiqladi. Keyin Aziza savatga yana Sichqoncha qo'shdi. Telefoni ham botda saqlangan."
   ],
   [
    "b",
    "Server qayta ishga tushdi: <b>savat bo'sh, buyurtma yo'q</b>, telefon yana so'raladi",
    "Endi serverni to'xtatib, qayta ishga tushiramiz. Aziza savatni ochadi: savat bo'sh. Admin buyurtmalarni ko'radi: hozircha buyurtma yo'q. Telefon raqami ham yo'qoldi, keyingi buyurtmada bot uni yana so'raydi. Xato xabari chiqmadi, ma'lumot shunchaki yo'q."
   ],
   [
    "c",
    "Sabab: <code>Map</code> — <b>jarayon xotirasidagi obyekt</b>; jarayon bilan birga tug'iladi va o'ladi",
    "Sababi oddiy. Map Node jarayonining operativ xotirasidagi obyekt. Jarayon ishga tushganda u bo'sh yaratiladi, jarayon to'xtaganda xotira bo'shaydi. Hosting serverni har deploy'da qayta ishga tushiradi, ya'ni haqiqiy botda bu kuniga bir necha marta bo'ladi."
   ],
   [
    "d",
    "Xulosa: <b>saqlanishi kerak bo'lgan har narsa bazaga</b> — beshta ma'lumot ro'yxati",
    "Xulosa: restartdan keyin qolishi kerak bo'lgan har narsa bazada turishi kerak. Botda bunday ma'lumot beshta: mahsulot va ombor, foydalanuvchi va uning roli, telefon va state, savat, buyurtma. Bugun shu beshtasini PostgreSQL'ga ko'chiramiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 5",
  "title": "Katalog kodda yozilgan massiv, ombordagi son ham shu massivda. Restartdan keyin Kolonka qoldig'i nechta bo'ladi?",
  "q": "Xotirani ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Katalog kodda yozilgan massiv, ombordagi son ham shu massivda turadi. Aziza ikkita Kolonka oldi, qoldiq sakkiz bo'ldi. Server qayta ishga tushsa, Kolonka qoldig'i nechta bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Massiv kodda yozilgan, jarayon ishga tushganda u yana koddagi qiymat bilan yaratiladi: o'n. Ya'ni restart buyurtmani o'chirdi va omborni ham o'n ga qaytardi. Ikkalasi bir-biriga mos, faqat noto'g'ri. Demak, xotiradagi ma'lumot har restartda kod yozilgan boshlang'ich qiymatiga qaytadi.",
  "okShort": "Massiv koddan qayta yaratiladi — <code>stock: 10</code>. Buyurtma yo'qoldi, ombor ham qaytdi.",
  "hint": "Massiv qayerda yozilgan — kodda yoki bazada? Jarayon ishga tushganda kod massivga qaysi qiymatni beradi?",
  "demak": "Xotiradagi ma'lumot har restartda koddagi boshlang'ich qiymatga qaytadi.",
  "correct": 1,
  "opts": [
   "8 — server oxirgi qiymatni eslab qoladi",
   "10 — massiv koddan qaytadan yaratiladi",
   "0 — RAM bo'shaydi, massiv ham bo'sh qoladi",
   "Server xato beradi — ombor sinxron emas"
  ],
  "wrong": {
   "0": "Eslab qolish uchun disk kerak; Map va massiv faqat RAM'da.",
   "2": "Xotira bo'shaydi, lekin massiv kodda yozilgan — u qayta yaratiladi.",
   "3": "Restart xato emas: server odatdagidek ko'tariladi."
  }
 },
 "5": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Loyihani o'z kompyuteringizda ishga tushiring va restartda nima yo'qolishini ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: loyihani clone qilasiz, <b>o'z botingiz tokeni bilan</b> ishga tushirasiz",
    "Endi navbat sizga. Loyihani clone qilasiz va o'z botingiz bilan ishga tushirasiz. Token uchun BotFather'da yangi sinov boti oching, videodarsdagi kabi. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: clone, <code>tgpg-start</code> tegi, <code>npm install</code>, <code>.env</code> — <b>token va o'z id'ingiz</b>",
    "Birinchi qadamda reponi clone qilib, tgpg start tegiga o'tasiz va npm install qilasiz. Ikkinchisida env example'dan env fayl yasaysiz: bot token va admin uchun o'z Telegram id'ingiz. Id'ni userinfobot'dan olasiz."
   ],
   [
    "c",
    "3–4-qadam: bot oqimi, keyin restart; isbot — <b>restartdan keyin <code>/cart</code> javobi</b>",
    "Uchinchi qadamda Telegram'da start, catalog, ikki mahsulot va buyurtmani sinaysiz, admin sifatida orders'ni ko'rasiz. To'rtinchisida savatga mahsulot qo'shib, serverni Ctrl C bilan to'xtatib qayta yoqasiz. Isbot maydoniga cart buyrug'iga kelgan javobni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin loyiha kompyuteringizda ishlaydi va qaysi ma'lumot restartda yo'qolishini o'zingiz ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Clone",
    "cmds": [
     "git clone https://github.com/Azizbekcrypto/OrderBotNest.git",
     "cd OrderBotNest",
     "git checkout tgpg-start",
     "npm install"
    ],
    "exp": "added … packages"
   },
   {
    "t": ".env — BOT_TOKEN (BotFather) va ADMIN_TELEGRAM_IDS (@userinfobot) yozing, keyin ishga tushiring",
    "cmds": [
     "cp .env.example .env",
     "npm run start:dev"
    ],
    "exp": "Server 3000-portda ishlayapti · Telegram bot ulandi"
   },
   {
    "t": "Bot oqimi — Telegram'da: /start → /catalog → ▶ → mahsulot → /cart → «✅ Buyurtma berish» → telefon → /orders",
    "cmds": [
     "/start",
     "/catalog",
     "/orders"
    ],
    "exp": "«Buyurtma #1 qabul qilindi!» · admin tugmalari"
   },
   {
    "t": "Restart — savatga mahsulot qo'shing, serverni to'xtatib qayta yoqing, Telegram'da /cart va /orders",
    "cmds": [
     "Ctrl+C",
     "npm run start:dev",
     "npm run smoke -- restart"
    ],
    "exp": "«Savat bo'sh…» · «Hozircha buyurtma yo'q.» · NATIJA: 0/3"
   }
  ],
  "proof": {
   "label": "Restartdan keyin /cart ga kelgan javob",
   "placeholder": "bot javobini nusxalang",
   "re": "savat\\s+bo.?sh",
   "flags": "i",
   "wrong": "Restartdan keyin savat ochilganmi? Server Ctrl+C bilan to'xtab, qayta yoqilganini tekshiring."
  },
  "trouble": [
   [
    "BOT_TOKEN topilmadi",
    ".env yo'q yoki bo'sh — cp .env.example .env, token yozing"
   ],
   [
    "Server … ishlayapti va Telegram ulanmadi: 401: Unauthorized",
    "token noto'g'ri; server ishlaydi, bot javob bermaydi — BotFather'dan qayta oling"
   ],
   [
    "409: Conflict: terminated by other getUpdates request",
    "shu token bilan ikkinchi nusxa ishlayapti — eski terminalni to'xtating (⚠ Telegram hujjatidan, sinalmagan — haqiqiy token kerak)"
   ],
   [
    "/orders → «faqat admin uchun»",
    "ADMIN_TELEGRAM_IDS da boshqa id — @userinfobot'dagi raqamni yozing"
   ],
   [
    "EADDRINUSE :::3000",
    "port band — eski server; Ctrl+C yoki .env da PORT=3001"
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · reja va prompt",
  "title": "Beshta ma'lumot — to'rt bosqich: har bosqichdan keyin tekshiruv va commit",
  "seg": [
   [
    "a",
    "Ishni <b>to'rt bosqichga</b> bo'lamiz: ulanish va katalog, foydalanuvchi, savat, buyurtma",
    "Beshta ma'lumotni bir yo'la ko'chirmaymiz. Ishni to'rt bosqichga bo'lamiz: avval bazaga ulanish va katalog, keyin foydalanuvchi va uning state'i, keyin savat, oxirida buyurtma va tranzaksiya. Tartib bog'liqlikka qarab: savat foydalanuvchi va mahsulotga, buyurtma hammasiga tayanadi."
   ],
   [
    "b",
    "Har bosqichdan keyin: <b>build, restart, psql — keyin commit</b>",
    "Har bosqichdan keyin to'xtaymiz va tekshiramiz: loyiha build bo'ladimi, restartdan keyin nima qoladi, PostgreSQL terminalida jadval qanday. Hammasi to'g'ri bo'lsa, commit qilamiz. Keyingi bosqich xato qilsa, oxirgi ishlagan joyga qaytish oson bo'ladi."
   ],
   [
    "c",
    "Bir gapli promptda AI <b>1145 qatorni bir yo'la</b> o'zgartirdi — buni ko'rib chiqib bo'lmaydi",
    "Nega bosqichlab? Biz sinab ko'rdik. AI'ga bir gapli prompt berdik: katalogni PostgreSQL'ga ko'chir. U faqat katalogni emas, hammasini ko'chirdi: yigirma ikki fayl, ming bir yuz qirq besh yangi qator. Kod ishladi, lekin bunday o'zgarishni mentor o'qib chiqa olmaydi, xato bo'lsa qayerdaligini topa olmaydi."
   ],
   [
    "d",
    "Xulosa: <b>bitta prompt — bitta bosqich</b>, natijani tekshirmaguncha keyingisiga o'tmaymiz",
    "Xulosa: bitta prompt, bitta bosqich. Bosqich kichik bo'lsa, AI javobini o'qiysiz, diffni ko'rasiz va xatoni darhol topasiz. Tekshirmaguncha keyingi promptni yozmang. Endi promptning o'zini qanday yozishni ko'ramiz."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · reja va prompt",
  "title": "Yaxshi prompt beshta qismdan iborat: kontekst, maqsad, shartlar, chegara va javob",
  "seg": [
   [
    "a",
    "Birinchi qism — <b>kontekst</b>: loyiha nima va hozir qanday ishlaydi",
    "Promptning birinchi qismi kontekst: loyiha nima va hozir qanday ishlaydi. AI loyihani o'qiy oladi, lekin sizning maqsadingizni bilmaydi. Shuning uchun bitta gap yetadi: bu NestJS va Telegraf'dagi buyurtma boti, hamma ma'lumot xotirada, bosqichma-bosqich PostgreSQL'ga ko'chiramiz."
   ],
   [
    "b",
    "Ikkinchi va uchinchi qism — <b>bitta bosqich maqsadi va qat'iy shartlar</b>",
    "Ikkinchi qism maqsad: faqat shu bosqich, bizda ulanish va katalog. Uchinchisi qat'iy shartlar: manzil env'dan o'qilsin, synchronize ishlatilmasin, jadval migratsiya bilan yaratilsin, stock manfiy bo'lmasin, seed ikkinchi marta takror qo'shmasin. Har shart keyin tekshiriladigan narsa."
   ],
   [
    "c",
    "To'rtinchi va beshinchi qism — <b>nimaga tegmaslik va javobda nima bo'lishi</b>",
    "To'rtinchi qism chegara: user, savat va buyurtma servislariga hali tegma. Beshinchisi javob: qaysi fayllar o'zgardi, qanday ishga tushirish va PostgreSQL terminalida nimani tekshirish. Shu qism AI'ni o'z ishini tushuntirishga majburlaydi, siz esa tekshirish ro'yxatini tayyor olasiz."
   ],
   [
    "d",
    "Xulosa: har shart — <b>keyin tekshiriladigan bitta band</b>; tekshirib bo'lmaydigan shart yozilmaydi",
    "Xulosa: prompt beshta qismdan iborat. Har shartni keyin tekshirish mumkin bo'lsin: stock manfiy bo'lmasin degan shartni PostgreSQL terminalida minus bir yozib tekshirasiz. Chiroyli qilib yoz degan shartni tekshirib bo'lmaydi, uni yozmang."
   ]
  ]
 },
 "8": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 5",
  "title": "Ikki AI'ga bir xil vazifa berildi. Qaysi natijani ko'rib chiqib, commit qilish mumkin?",
  "q": "Prompt qolipini ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Ikki AI'ga bir xil vazifa berildi: katalogni bazaga ko'chirish. Ekranda ikkala prompt, o'zgarish hajmi va AI javobidan parcha. Qaysi natijani ko'rib chiqib, commit qilish mumkin? Variantni tanlang.",
  "ok": "To'g'ri. B faqat katalogni ko'chirdi va boshqa servislarga nega tekkanini o'zi aytdi: async bo'lgani uchun await kerak edi. Bu asosli va tekshirish oson. A ham ishladi, lekin so'ralmagan to'rt bosqichni bir yo'la qildi va buni aytmadi. Demak, commit qilinadigan natija hajmi siz so'ragan bosqichga teng bo'ladi.",
  "okShort": "B — so'ralgan bosqich, chetga chiqish aytilgan. A — 1145 qator, so'ralmagan ish, aytilmagan.",
  "hint": "Qaysi AI faqat so'ralgan ishni qildi? Qaysi biri qayerda chetga chiqqanini aytdi?",
  "demak": "Commit qilinadigan o'zgarish hajmi siz so'ragan bosqichga teng bo'ladi.",
  "correct": 2,
  "opts": [
   "A — hammasini bir yo'la qilgan, vaqt tejaldi",
   "Ikkalasi bir xil — ikkalasi ham ishlaydi",
   "B — faqat so'ralgan bosqich, chetini aytgan",
   "Hech biri — AI kodini commit qilib bo'lmaydi"
  ],
  "wrong": {
   "0": "Ko'p ish — ko'p ko'rib chiqish: 1145 qatorda xatoni topish qiyin.",
   "1": "Ishlashi yetmaydi: siz har qatorga javob berasiz.",
   "3": "Commit qilinadi — o'qib, tekshirib bo'lgandan keyin."
  }
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · ulanish va katalog · ichida",
  "title": "Entity jadvalni tasvirlaydi, migratsiya uni yaratadi, migrations jadvali nima yurganini eslaydi",
  "seg": [
   [
    "a",
    "Entity — <b>jadvalning kod ko'rinishi</b>: klass, ustunlar decorator bilan",
    "Birinchi bosqich ichida nima bo'lishini ko'ramiz. TypeORM'da jadval entity klassi bilan tasvirlanadi: Entity decorator jadval nomini, Column decorator har ustunni beradi. Siz bilgan Mongoose'da bu schema edi."
   ],
   [
    "b",
    "Migratsiya — <b>jadvalni yaratadigan SQL fayli</b>; <code>synchronize</code> o'chiq",
    "Jadvalni entity emas, migratsiya yaratadi. Migratsiya oddiy SQL fayli: up metodida create table, down metodida drop table. Synchronize false, ya'ni TypeORM jadvalni o'zi o'zgartirmaydi. Mongoose'da migratsiya yo'q edi, chunki kolleksiyada ustun qoidasi yo'q. PostgreSQL'da qoida bor, uni fayl bilan o'zgartiramiz."
   ],
   [
    "c",
    "<code>migrations</code> jadvali — <b>qaysi fayl yurganini eslaydi</b>; server ko'tarilganda yurmagani o'zi yuradi",
    "Migratsiya yurgach, TypeORM migrations jadvaliga bitta qator yozadi: fayl nomi va vaqti. Server har ko'tarilganda shu jadvalga qaraydi va faqat yurmagan migratsiyani yurgizadi, bu migrations run true sozlamasi. Ikkinchi ishga tushirishda hech narsa takrorlanmaydi."
   ],
   [
    "d",
    "Xulosa: jadvalni o'zgartirish — <b>yangi migratsiya fayli</b>, eskisi tahrirlanmaydi",
    "Xulosa: entity jadvalni kodda tasvirlaydi, migratsiya uni bazada yaratadi, migrations jadvali qaysi fayl yurganini eslaydi. Keyin ustun qo'shmoqchi bo'lsangiz, yangi migratsiya yozasiz. Yurgan migratsiyani tahrirlash foyda bermaydi: baza uni qayta yurgizmaydi."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · ulanish va katalog",
  "title": "AI javobini uch qismga ajrating: nima o'zgardi, qayerda chetga chiqdi, qanday tekshiriladi",
  "seg": [
   [
    "a",
    "Birinchi: <b>o'zgargan fayllar ro'yxatini <code>git diff --stat</code> bilan</b> solishtiring",
    "AI ishini tugatdi va javob yozdi. Uni uch qismga ajratib o'qing. Birinchisi: qaysi fayllar o'zgardi. AI'ning ro'yxatini git diff stat bilan solishtiring. Bu safar ro'yxat mos keldi: entity, migratsiya, seed, config va catalog service."
   ],
   [
    "b",
    "Ikkinchi: <b>«chetga chiqdim» qismini</b> toping va sababini baholang",
    "Ikkinchisi: AI qayerda chetga chiqdi. Biz user, savat va buyurtmaga tegma degan edik. AI order va telegram servislarini o'zgartirgan va buni ochiq yozgan: catalog service endi async, chaqiruvlarga await kerak. Sabab asosli. Agar sabab yozilmagan bo'lsa, diffdan o'zingiz qidirasiz."
   ],
   [
    "c",
    "Uchinchi: tekshirish buyruqlarini <b>o'zingiz yurgizing</b> — AI'ning «sinadim» degan gapi isbot emas",
    "Uchinchisi: tekshirish. AI o'zim sinadim deydi, lekin bu isbot emas. Buyruqlarni o'zingiz yurgizing. Seed birinchi marta olti mahsulot qo'shdi, ikkinchi marta nol. Backslash d products'da UNIQUE va CHECK bor. Build toza."
   ],
   [
    "d",
    "Xulosa: o'qing, solishtiring, yurgizing — <b>shundan keyin commit</b>",
    "Xulosa: AI javobi uch qismdan o'qiladi: fayllar, chetga chiqish va tekshiruv. Fayllarni diff bilan solishtirasiz, chetga chiqish sababini baholaysiz, tekshiruvni o'zingiz yurgizasiz. Hammasi to'g'ri bo'lsa, commit qilasiz. Lekin bu bosqichda yana bitta yashirin muammo bor, uni keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "Katalog bazada, buyurtma xotirada: restartdan keyin buyurtma yo'qoldi, ombor esa kamayib qoldi",
  "seg": [
   [
    "a",
    "1-bosqichdan keyin bot ishlaydi: <b>katalog bazadan, buyurtma esa hali xotirada</b>",
    "Birinchi bosqich tayyor, testlar toza. Endi bot oqimini restart bilan sinaymiz. Aziza buyurtma berdi: bitta klaviatura va ikkita kolonka. Ombor bazada kamaydi. Buyurtmaning o'zi esa hali xotiradagi massivda, chunki uni to'rtinchi bosqichda ko'chiramiz."
   ],
   [
    "b",
    "Restart: <b>buyurtma yo'qoldi, ombor esa 7 va 8 da qoldi</b>",
    "Serverni qayta ishga tushiramiz. Admin buyurtmalarni ochadi: hozircha buyurtma yo'q. PostgreSQL terminalida esa klaviatura yetti, kolonka sakkiz. Ya'ni mahsulot ombordan ketgan, lekin uni kim olgani haqida hech qanday yozuv yo'q. Bu xato xabari bermaydigan, eng yomon turdagi buzilish."
   ],
   [
    "c",
    "Sabab: <b>bir ish ikki joyda yozildi</b> — biri doimiy, biri vaqtinchalik",
    "Sababi: bitta sotuv ikki joyga yozildi. Ombordan ayirish bazaga, buyurtma esa xotiraga. Restart xotirani o'chirdi, bazaga tegmadi. Tekshiruv buni ko'rsatdi, chunki biz faqat build emas, restart bilan butun oqimni sinadik."
   ],
   [
    "d",
    "Xulosa: <b>oraliq bosqichni prodga chiqarmang</b>; har bosqichdan keyin restart bilan sinang",
    "Xulosa: bosqichma-bosqich ko'chirishda oraliq vaziyat bo'ladi, unda ma'lumot ikki joyda yashaydi. Oraliq bosqichni ishlab turgan botga chiqarmang, avval hamma bosqichni tugating. Har bosqichdan keyin restart bilan to'liq oqimni sinang: buni build ham, AI'ning o'z testlari ham ushlamaydi."
   ]
  ]
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "Ulanish, migratsiya va katalog — o'z AI'ingiz bilan, keyin o'zingiz tekshirasiz",
  "seg": [
   [
    "a",
    "Endi siz: <b>1-promptni o'z AI'ingizga</b> berasiz va natijani tekshirasiz",
    "Endi navbat sizga. Birinchi promptni o'z AI'ingizga berasiz: Antigravity, Claude Code yoki boshqasi. AI javobi bizdagidan boshqacha bo'ladi, bu normal. Tekshiruv bir xil. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: baza, prompt, <b>AI javobini uch qismga ajratib o'qish</b>",
    "Birinchi qadamda PostgreSQL terminalida shop bazasini yaratasiz va env faylga database url yozasiz. Ikkinchisida promptni nusxalab AI'ga berasiz, javobini o'qiysiz: fayllar, chetga chiqish va tekshirish buyruqlari."
   ],
   [
    "c",
    "3–4-qadam: seed ikki marta va <code>\\d products</code>; isbot — <b>ikkinchi seed'dan keyingi mahsulotlar soni</b>",
    "Uchinchi qadamda seed'ni ikki marta yurgizasiz va backslash d products bilan CHECK borligini ko'rasiz. To'rtinchisida stock'ni minus bir qilib ko'rasiz: xato chiqishi kerak. Isbot maydoniga select count'dan chiqqan sonni yozing. Hammasi to'g'ri bo'lsa, commit qiling."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz katalogni PostgreSQL'dan o'qiydi va siz AI ishini o'zingiz tekshirgan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Baza — PostgreSQL terminalida yarating, manzilini .env ga yozing",
    "cmds": [
     "psql -U postgres",
     "CREATE DATABASE shop;",
     "DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/shop"
    ],
    "exp": "CREATE DATABASE"
   },
   {
    "t": "Prompt — 1-promptni AI'ga bering, javobni uch qismga ajratib o'qing: fayllar · chetga chiqish · tekshirish",
    "cmds": [
     "git diff --stat"
    ],
    "exp": "ro'yxat diff bilan mos"
   },
   {
    "t": "Seed va jadval",
    "cmds": [
     "npm run seed ×2",
     "psql -U postgres -d shop",
     "\\d products",
     "SELECT * FROM migrations;"
    ],
    "exp": "2-marta 0 qo'shildi · CHECK (stock >= 0) · 1 qator"
   },
   {
    "t": "Qoida va commit",
    "cmds": [
     "UPDATE products SET stock = -1 WHERE id = 1;",
     "SELECT count(*) FROM products;",
     "git add -A && git commit -m \"1-bosqich: katalog\""
    ],
    "exp": "violates check constraint · 6"
   }
  ],
  "proof": {
   "label": "SELECT count(*) FROM products; natijasi",
   "placeholder": "natijadagi sonni yozing",
   "re": "^\\s*6\\s*$",
   "flags": "",
   "wrong": "Seed ikki marta yurdi — takror qo'shmaganmi? 12 chiqsa, seed takrorlanmaslik shartini AI bajarmagan: unga shu haqida yozing."
  },
  "trouble": [
   [
    "count = 12",
    "seed takror qo'shdi — AI'ga: «seed ikkinchi marta yurganda takror qo'shmasin, ON CONFLICT (name) DO NOTHING»"
   ],
   [
    "UPDATE xatosiz o'tdi",
    "CHECK yo'q — \\d products; AI'ga: «stock uchun bazada CHECK (stock >= 0) bo'lsin, yangi migratsiya bilan»"
   ],
   [
    "relation \"products\" does not exist",
    "migratsiya yurmagan — serverni bir marta ishga tushiring yoki npm run migration:run"
   ],
   [
    "Unable to connect to the database. Retrying (1)... va error: database \"shop\" does not exist",
    "1-qadam: CREATE DATABASE shop;"
   ],
   [
    "Unable to connect to the database. Retrying (1)... va error: password authentication failed for user \"postgres\"",
    ".env dagi parol — PostgreSQL-1 da qo'ygan parolingiz"
   ],
   [
    "npm error Missing script: \"seed\"",
    "AI seed'ni boshqa nom bilan yozgan yoki migratsiya ichiga qo'ygan — javobidan qidiring (2-tajribada shunday bo'ldi)"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · foydalanuvchi, state, savat · ichida",
  "title": "Telegram id INTEGERga sig'maydi — BIGINT kerak; lekin BIGINT kodga matn bo'lib keladi",
  "seg": [
   [
    "a",
    "Azizaning id'si 5 123 456 789 — <b><code>INTEGER</code> chegarasidan katta</b>, shuning uchun <code>BIGINT</code>",
    "Ikkinchi bosqich: foydalanuvchilar. Birinchi tuzoq id'da. Telegram id ikki milliard bir yuz qirq yetti milliondan katta bo'lishi mumkin, bu integer'ning chegarasi. Azizaning id'si besh milliarddan oshadi. Shuning uchun ustun big int bo'ladi. Ikkala AI ham big int tanladi."
   ],
   [
    "b",
    "Lekin node-pg va TypeORM <code>BIGINT</code> ustunini kodga <b>matn qilib qaytaradi</b>: <code>\"5123456789\"</code>",
    "Ikkinchi tuzoq ko'rinmaydi. Big int JavaScript'ning oddiy sonidan katta bo'lishi mumkin, shuning uchun pg kutubxonasi uni matn qilib qaytaradi. TypeORM ham xuddi shunday. Matn bilan son uch tenglik bilan solishtirilsa, false chiqadi. Siz bilgan Mongoose'da bu son edi va true chiqardi."
   ],
   [
    "c",
    "Ikki to'g'ri yo'l: <b>ustun turi <code>string</code></b> yoki <b>transformer bilan <code>number</code></b>",
    "Ikki to'g'ri yo'l bor. Birinchisi: entity'da telegram id'ni string deb yozish va har joyda matn bilan ishlash. Ikkinchisi: transformer bilan bazadan kelganda songa aylantirish. Telegram id ellik ikki bitdan oshmaydi, JavaScript soni uni sig'diradi. Bizdagi tayyor kod birinchi yo'lni, AI ikkinchisini tanladi. Ikkalasi ishlaydi."
   ],
   [
    "d",
    "Xulosa: entity'dagi <b>id turini va solishtirishni</b> diffdan albatta tekshiring",
    "Xulosa: Telegram id uchun big int, va kodda u matnmi yoki sonmi, buni bilib turing. AI kodini ko'rganda ikki joyga qarang: migratsiyada ustun turi big int'mi, entity'da qaysi tur va qayerda uch tenglik bilan solishtirilgan."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Mijoz tugmani ikki marta tez bosdi: avval qidirib keyin qo'shish ikki qator ochishi mumkin — ON CONFLICT bitta so'rovda hal qiladi",
  "seg": [
   [
    "a",
    "Savatda bitta mahsulot — bitta qator: <b><code>UNIQUE (user_id, product_id)</code></b>",
    "Uchinchi bosqich: savat. Bitta mijozda bitta mahsulot faqat bitta qator bo'ladi, qayta qo'shilsa qty bittaga oshadi. Bu qoidani kod ham, baza ham ushlaydi: cart items jadvalida user id va product id juftligi UNIQUE."
   ],
   [
    "b",
    "Avval qidirib keyin qo'shish — <b>ikki tez bosishda ikkalasi «yo'q» ko'radi</b>",
    "Oddiy yo'l: avval select bilan qidirish, yo'q bo'lsa insert. Lekin mijoz tugmani ikki marta tez bossa, ikki so'rov bir vaqtda qidiradi va ikkalasi ham yo'q deb ko'radi. Biz yigirma marta sinadik: o'n to'qqiz marta savatda ikki qator paydo bo'ldi. UNIQUE bo'lsa, ikkinchisi duplicate key xatosini oladi."
   ],
   [
    "c",
    "<code>ON CONFLICT … DO UPDATE</code> — <b>bitta so'rov</b>: yo'q bo'lsa qo'shadi, bor bo'lsa oshiradi",
    "Yechim bitta so'rov: insert on conflict do update. Qator yo'q bo'lsa qo'shiladi, bor bo'lsa qty bittaga oshadi. Baza buni o'zi navbatga qo'yadi. Siz bilgan Mongoose'da bu upsert edi, lekin u ham unique index bo'lmasa ikki hujjat ochdi. Ikkala AI ham to'g'ri yo'lni tanladi."
   ],
   [
    "d",
    "Xulosa: <b>qidirib qo'shish</b> ko'rsangiz, <code>UNIQUE</code> va <code>ON CONFLICT</code> borligini tekshiring",
    "Xulosa: avval qidirib keyin qo'shish bir mijozda ishlaydi, lekin tez bosishda buziladi. AI kodida shunday joy ko'rsangiz, ikki narsani tekshiring: jadvalda UNIQUE qoidasi bormi va so'rov on conflict bilanmi. Foydalanuvchida ham xuddi shu qoida: start ikki marta bosilsa ham bitta qator."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · foydalanuvchi, state, savat",
  "title": "WAITING_PHONE bazada: bot telefon so'radi, server qayta ishga tushdi — raqam kelganda bot uni taniydi",
  "seg": [
   [
    "a",
    "State — <b>bot mijoz haqida eslab qolgan bosqich</b>: <code>IDLE</code> yoki <code>WAITING_PHONE</code>",
    "State'ni ko'ramiz. State bot foydalanuvchi haqida eslab qolgan ma'lumot: qaysi qadamda turgani. Bizning botda ikkita: IDLE, ya'ni oddiy, va WAITING PHONE, ya'ni telefon kutilmoqda. Mijoz buyurtma berishni bosganda state WAITING PHONE bo'ladi."
   ],
   [
    "b",
    "Restartdan keyin raqam keldi — <b>bot uni telefon deb tanidi</b>, «Tushunmadim» demadi",
    "Bobur buyurtma berishni bosdi, bot telefon so'radi. Shu payt server qayta ishga tushdi. Bobur raqamini yozdi. State bazada bo'lgani uchun bot raqamni telefon deb tanidi va buyurtmani yaratdi. State xotirada bo'lganda bot tushunmadim degan bo'lardi."
   ],
   [
    "c",
    "Ikkinchi va uchinchi bosqichdan keyin <b>state ham, savat ham</b> restartdan o'tdi",
    "Bu natija uchinchi bosqichdan keyin chiqdi. Ikkinchi bosqichdan keyin bot telefonni tanigan, lekin savat bo'sh edi, chunki savat hali xotirada edi. Bu yana oraliq vaziyat. Uchinchi bosqichdan keyin savat ham bazada, buyurtma raqami bir bo'lib yaratildi."
   ],
   [
    "d",
    "Xulosa: state'ni sinash uchun <b>restartni suhbat o'rtasida</b> qiling",
    "Xulosa: state'ni oddiy sinov ushlamaydi, chunki bitta jarayonda hamma narsa ishlaydi. Restartni suhbat o'rtasida qiling: bot savol berdi, server qayta yondi, keyin javob yozing. Bot davom etsa, state bazada."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 5",
  "title": "Admin tekshiruvi xom so'rov natijasi bilan yozilgan: rows[0].telegram_id !== 111. Jasur (id 111) /orders bosdi. Nima bo'ladi?",
  "q": "Big int'ni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Admin tekshiruvi xom so'rov bilan yozilgan: bazadan telegram id olinadi va bir yuz o'n birga teng emasmi deb solishtiriladi. TypeScript xato bermadi. Jasurning id'si haqiqatan bir yuz o'n bir. U orders bosdi. Nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Bazadan telegram id matn bo'lib keladi, bir yuz o'n bir qo'shtirnoq ichida. Matn bilan son hech qachon teng emas, shuning uchun Jasur admin bo'lmay qoladi. Xato xabari yo'q, bot faqat admin uchun deydi. Demak, big int ustunini solishtirishdan oldin turini bir xil qiling: matn bilan matn yoki son bilan son.",
  "okShort": "<code>\"111\" !== 111</code> → <code>true</code>: admin tekshiruvi o'tmaydi, xato yo'q.",
  "hint": "Bazadan telegram_id qaysi turda keladi? === turi har xil qiymatlarga nima deydi?",
  "demak": "<code>BIGINT</code> ustunini solishtirishdan oldin ikki tomonning turi bir xil bo'lsin.",
  "correct": 3,
  "opts": [
   "Jasur buyurtmalarni ko'radi — id 111 to'g'ri",
   "Server ishga tushmaydi — tsc turni rad etadi",
   "Baza xato beradi — id matn bilan so'raldi",
   "«faqat admin uchun» chiqadi — \"111\" !== 111"
  ],
  "wrong": {
   "0": "Bazadan matn keladi: \"111\" — son emas.",
   "1": "Server ishlaydi va tsc ham xato bermaydi: raw (ichida ds.query) natijasi any. Entity'dagi string bilan solishtirilganda esa tsc TS2367 beradi — sinadik.",
   "2": "Baza so'rovni bajardi; solishtirish JavaScript'da."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 25 daqiqa",
  "title": "Foydalanuvchi, state va savat — ikki prompt, har biridan keyin restart",
  "seg": [
   [
    "a",
    "Endi siz: <b>ikki prompt, ikki commit</b> — foydalanuvchi va state, keyin savat",
    "Endi ikkita bosqichni o'zingiz qilasiz: foydalanuvchi va state, keyin savat. Har promptdan keyin tekshiruv va commit. Yigirma besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: 2-prompt, javobni o'qish, <b><code>\\d users</code> — id turi <code>bigint</code></b>",
    "Birinchi qadamda ikkinchi promptni AI'ga berasiz va javobni uch qismga ajratib o'qiysiz. Ikkinchisida backslash d users bilan telegram id turini ko'rasiz: big int bo'lishi kerak. Entity'da tur qanday ekaniga ham qarang."
   ],
   [
    "c",
    "3–4-qadam: 3-prompt, keyin <b>suhbat o'rtasida restart</b>; isbot — <code>state</code> ustuni",
    "Uchinchi qadamda uchinchi promptni berasiz. To'rtinchisida savatga mahsulot qo'shib, buyurtma berishni bosasiz, bot telefon so'raydi. Shu payt PostgreSQL terminalida users jadvalidan state'ni ko'ring va isbot maydoniga yozing. Keyin restart qilib raqam yuboring: bot buyurtma yaratishi kerak."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz foydalanuvchini, state'ni va savatni bazada saqlaydi va siz buni restart bilan isbotlagansiz."
   ]
  ],
  "steps": [
   {
    "t": "2-prompt — AI'ga bering, javobni uch qismga ajratib o'qing",
    "cmds": [
     "git diff --stat"
    ],
    "exp": "yangi migratsiya, birinchisi o'zgarmagan"
   },
   {
    "t": "users — /start ni ikki marta bosing, tekshiring, commit qiling",
    "cmds": [
     "\\d users",
     "SELECT telegram_id, count(*) FROM users GROUP BY 1;"
    ],
    "exp": "bigint · har id 1 marta"
   },
   {
    "t": "3-prompt — AI'ga bering; Telegram'da bitta mahsulotni 3 marta bosing; tekshirib commit qiling",
    "cmds": [
     "\\d cart_items",
     "SELECT * FROM cart_items;"
    ],
    "exp": "UNIQUE · bitta qator, qty 3"
   },
   {
    "t": "Restart — «✅ Buyurtma berish» bosing; telefon so'ralganda state'ni ko'ring; serverni qayta yoqib raqam yuboring",
    "cmds": [
     "SELECT state FROM users WHERE telegram_id = <id>;",
     "Ctrl+C",
     "npm run start:dev"
    ],
    "exp": "WAITING_PHONE · «Buyurtma #… qabul qilindi!»"
   }
  ],
  "proof": {
   "label": "Telefon so'ralgan paytdagi state qiymati",
   "placeholder": "psql natijasini yozing",
   "re": "WAITING_PHONE",
   "flags": "i",
   "wrong": "Buyurtma berishni bosgandan keyin, raqam yozishdan oldin tekshiring. IDLE chiqsa — state bazaga yozilmagan: AI'ga state'ni bazada saqlash shartini qayta yozing."
  },
  "trouble": [
   [
    "telegram_id — integer",
    "AI turni noto'g'ri tanladi — yangi migratsiya: ALTER COLUMN … TYPE BIGINT; katta id'da terminalda value \"5123456789\" is out of range for type integer, bot «Tushunmadim» deydi"
   ],
   [
    "/start ikki marta — ikki qator",
    "UNIQUE yo'q — AI'ga: «telegram_id takrorlanmasin, bazada ham»"
   ],
   [
    "duplicate key value violates unique constraint",
    "avval qidirmasdan qo'shilyapti — ON CONFLICT (14-ekran)"
   ],
   [
    "Restartdan keyin «Tushunmadim»",
    "state bazaga yozilmagan yoki o'qilmayapti — SELECT state …"
   ],
   [
    "Restartdan keyin «Savat bo'sh»",
    "savat hali xotirada — 3-prompt bajarilganmi"
   ],
   [
    "Admin /orders — «faqat admin uchun»",
    "\"111\" === 111 (16-ekran) — tur"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · buyurtma · ichida",
  "title": "Buyurtma uch ish: ombordan ayirish, buyurtma yozish, savatni tozalash — yo hammasi, yo hech biri",
  "seg": [
   [
    "a",
    "Buyurtma <b>uch jadvalga tegadi</b>: <code>products</code>, <code>orders</code> va <code>cart_items</code>",
    "To'rtinchi bosqich: buyurtma. Bitta buyurtma uch jadvalga tegadi: products'dan ombor ayiriladi, orders va order items'ga buyurtma yoziladi, cart items'dan savat o'chiriladi. PostgreSQL-2 da ikki jadval bitta ish ekranini ko'rgansiz, bu o'shaning o'zi, faqat kod ichida."
   ],
   [
    "b",
    "TypeORM <code>transaction</code> — <b><code>START TRANSACTION</code> … <code>COMMIT</code></b> — SQL logda ko'rinadi",
    "Kodda bu dataSource transaction. Ichidagi hamma so'rov bitta tranzaksiyada yuradi. SQL logni yoqsangiz, uning o'zini ko'rasiz: start transaction, ikkita update, ikkita insert, delete va commit. Bu PostgreSQL terminalidagi begin va commit'ning aynan o'zi."
   ],
   [
    "c",
    "Birortasi yiqilsa — <b><code>ROLLBACK</code></b>: ombor, buyurtma va savat o'zgarmaydi",
    "Ichida bitta so'rov yiqilsa, TypeORM rollback qiladi. Ombor ham, buyurtma ham, savat ham o'zgarmaydi. Biz buni ataylab sinadik: order items'ga yozishda xato beradigan trigger qo'ydik. Bot buyurtma berilmadi dedi, ombor sakkiz va o'nda, buyurtma nol, savat joyida qoldi."
   ],
   [
    "d",
    "Xulosa: bitta ishning <b>hamma so'rovi bitta tranzaksiyada</b>; SQL log — isbot",
    "Xulosa: bir nechta jadvalga tegadigan bitta ish bitta tranzaksiyada bo'ladi. AI tranzaksiya qildim desa, SQL logni yoqib ko'ring: start transaction va commit orasida hamma so'rov bormi. Bu tekshiruv bir daqiqa oladi."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Omborda bitta Planshet, ikki mijoz bir vaqtda «Buyurtma berish» bosdi: bittasiga sotiladi, ikkinchisi aniq xabar oladi",
  "seg": [
   [
    "a",
    "Sinov: omborda <b>bitta Planshet qoldi, ikki tranzaksiya bir vaqtda</b> boshlanadi",
    "Endi eng og'ir sinov. Omborda bitta Planshet qoldi. Aziza va Bobur bir vaqtda buyurtma berishni bosadi. Ikki tranzaksiya bir vaqtda boshlanadi va ikkalasi ham Planshet qatoriga yetib boradi."
   ],
   [
    "b",
    "Birinchi tranzaksiya qatorni <b>qulflaydi</b>, ikkinchisi u tugashini kutadi",
    "Birinchi tranzaksiya Planshet qatorini qulflaydi. Bizdagi kodda bu select for update, AI kodida update where stock katta yoki teng qty. Ikkinchi tranzaksiya shu qatorga yetganda kutadi. Birinchisi commit qilgach, ikkinchisi yangi qoldiqni ko'radi: nol."
   ],
   [
    "c",
    "Natija: <b>bitta sotildi, ombor 0</b>, Bobur aniq xabar oldi, savati saqlandi",
    "Natija: Azizaga sotildi, ombor nol, manfiy emas. Bobur aniq xabar oldi: Planshet, omborda faqat nol ta qoldi. Uning tranzaksiyasi rollback bo'ldi, savati saqlanib qoldi. Biz bu sinovni o'zimizdagi kod va AI kodi bilan yurgizdik, natija bir xil."
   ],
   [
    "d",
    "Xulosa: «ortiqcha sotilmasin» sharti <b>faqat bir vaqtdagi ko'p mijoz sinovi bilan</b> tekshiriladi",
    "Xulosa: bitta mijoz bilan bu xato hech qachon ko'rinmaydi, faqat bir vaqtdagi ikki so'rov bilan. Ikki mijoz ham kam: tranzaksiya tez tugaydi va qulfsiz kod ham ko'pincha to'g'ri chiqadi. Shuning uchun smoke beshta mijozni uch raund yurgizadi. Qulf bo'lmasa nima bo'lishini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Qulfsiz «o'qi, tekshir, yoz»: hamma tranzaksiya qoldiq 1 ni ko'radi — bitta Planshet besh kishiga sotiladi, CHECK ham ushlamaydi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>lock</code> ustiga bosing",
    "Buyurtma ishlaydi, race sinovi ham toza. Endi ataylab buzamiz, chunki AI'lar ko'pincha aynan shunday yozadi. Buzishni o'zingiz qilasiz: order service'ning o'ttiz uchinchi satrida lock yonib turibdi, ustiga bosing: qulf olib tashlanadi.",
    "<b>order.service.ts</b> 33-satridagi <b><code>lock: { mode: 'pessimistic_write' }</code></b> ustiga bosing — qulf olib tashlanadi, o'qish oddiy <code>findOneBy</code> bo'ladi."
   ],
   [
    "a",
    "Qulf yo'q: qatorni <b>qulfsiz o'qiymiz</b>, qoldiqni kodda hisoblab, yangisini yozamiz",
    "Qulfni olib tashladingiz. Endi mahsulot oddiy find bilan o'qiladi, qoldiq yetadimi deb kodda tekshiriladi, yangi qoldiq hisoblanib save qilinadi. AI'lar ko'pincha aynan shunday yozadi, ko'rinishi to'g'ri."
   ],
   [
    "b",
    "Besh tranzaksiya <b>bir vaqtda «qoldiq 1» ni ko'radi</b> — hammasi tekshiruvdan o'tadi",
    "Besh mijoz bir vaqtda bosadi. Hamma tranzaksiya qoldiqni o'qiydi: bir. Hammasi yetadi deb hisoblaydi va nolni yozadi. Biz buni besh raund yurgizdik: to'rt raundda bitta Planshet besh kishiga sotildi. Birinchi raundda tasodifan bittaga, shuning uchun bir marta sinash yetmaydi."
   ],
   [
    "c",
    "<code>CHECK (stock &gt;= 0)</code> <b>ushlamaydi</b>: yozilgan qiymat 0, manfiy emas",
    "Baza qoidasi ham yordam bermaydi. Check stock katta yoki teng nol faqat manfiy qiymatni rad etadi. Har tranzaksiya nol yozdi, nol esa ruxsat etilgan. Ya'ni bu vaziyatda xato xabari yo'q, faqat bitta ortiqcha buyurtma bor."
   ],
   [
    "d",
    "Tuzatish ikki xil: <b>qulf bilan o'qish</b> yoki <b>bitta <code>UPDATE … WHERE</code></b> — yana 1 sotildi",
    "Tuzatish ikki xil. Birinchisi: o'qishda qulf, find'ga lock pessimistic write qo'shiladi, ikkinchi tranzaksiya kutadi. Ikkinchisi: hisobni bazaga berish, update stock minus qty where stock katta yoki teng qty. Race qayta yurgizildi: besh raundda ham bitta sotildi, ombor nol. Demak, qoldiqni kodda hisoblab yozish qulfsiz ishlamaydi."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "CHECK rad etgandan keyin o'sha tranzaksiyada yana so'rov: «current transaction is aborted» — PG-2 dagi shop=!# kod ichida",
  "seg": [
   [
    "a",
    "Bu xatoni <b>biz o'zimiz qildik</b>: loyihani yozayotganda birinchi kod shunday edi",
    "Bu xatoni AI emas, biz o'zimiz qildik: tayyor loyihani yozayotganda birinchi kod shunday edi. Fikr to'g'ri ko'ringan: avval ayiramiz, check rad etsa, mahsulotni qayta o'qib, mijozga qancha qolganini aytamiz."
   ],
   [
    "b",
    "<code>CHECK</code> rad etdi — keyingi <code>SELECT</code> <b>«transaction is aborted»</b> oldi",
    "Mijoz to'rtta Planshet so'radi, uchta bor edi. Update check'ga urildi. Keyin kod qoldiqni bilish uchun select qildi va xato oldi: current transaction is aborted. Mijozga esa tushunarsiz inglizcha xabar ketdi."
   ],
   [
    "c",
    "PostgreSQL qoidasi: tranzaksiyada xato chiqqandan keyin <b>faqat <code>ROLLBACK</code> yordam beradi</b>",
    "Bu PostgreSQL-2 dagi undov belgili prompt'ning o'zi. Tranzaksiya ichida bitta xato bo'lsa, rollback'gacha hamma so'rov rad etiladi. Kodda ham shunday: xatodan keyin shu tranzaksiyada hech narsa so'rab bo'lmaydi."
   ],
   [
    "d",
    "Tuzatish: <b>avval tekshirish, keyin yozish</b>; <code>CHECK</code> — oxirgi qo'riqchi",
    "Tuzatish: tekshiruvni update'dan oldinga oldik. Qatorni qulf bilan o'qiymiz, yetmasa xabarni o'sha yerda beramiz. Check esa oxirgi qo'riqchi bo'lib qoladi: kod xato qilsa ham ombor manfiy bo'lmaydi. Demak, tranzaksiya ichida xatoni ushlab, so'rovni davom ettirib bo'lmaydi."
   ]
  ]
 },
 "22": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 5 — qaysi satr xato?",
  "title": "Bitta Planshet besh kishiga sotildi. Xato satrni toping",
  "q": "Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Besh mijoz oxirgi Planshetni bir vaqtda oldi va besh buyurtma yaratildi. Bu bo'lakda bitta satr qatorni qulfsiz o'qiydi. O'sha satrni bosing.",
  "ok": "To'g'ri. Find one by qatorni qulfsiz o'qiydi, shuning uchun hamma tranzaksiya bir xil qoldiqni ko'radi. Tekshiruv va hisob to'g'ri, lekin ular eski qiymat ustida ishlaydi. Ekranda tuzatilgan kod: lock pessimistic write, race'da bitta sotildi. Demak, ikki mijoz xatosida avval qoldiq qayerda o'qilganini qidiring.",
  "okShort": "<code>findOneBy</code> — qulfsiz o'qish: hamma tranzaksiya qoldiq 1 ni ko'radi. <code>lock: pessimistic_write</code> bilan qolganlari navbat kutadi.",
  "hint": "Tekshiruv satri to'g'ri hisoblaydi — lekin qaysi qiymat ustida? O'sha qiymat qaysi satrda va qanday o'qilgan?",
  "task": "Qoida: tranzaksiya ichida o'qilgan qoldiq boshqa tranzaksiya uni o'zgartirmasligi uchun qulflanadi — yoki hisob bitta <code>UPDATE … WHERE</code> ichida bo'ladi. Bu bo'lakda bitta satr qatorni qulfsiz o'qiydi. <b>O'sha satrni bosing.</b>"
 },
 "23": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 25 daqiqa",
  "title": "Buyurtma tranzaksiyada — va besh mijoz oxirgi mahsulotni oladi",
  "seg": [
   [
    "a",
    "Oxirgi bosqich: <b>4-prompt</b>, SQL log va ko'p mijoz sinovi",
    "Oxirgi bosqich: buyurtmalarni bazaga ko'chirasiz. Keyin uchta tekshiruv: SQL logda tranzaksiya, ko'p mijoz sinovi va bekor qilish. Yigirma besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: 4-prompt, javob, <b>SQL logda <code>START TRANSACTION</code> … <code>COMMIT</code></b>",
    "Birinchi qadamda to'rtinchi promptni AI'ga berib, javobni uch qismga ajratib o'qiysiz. Ikkinchisida env'da db logging true qilib, bitta buyurtma berasiz va terminalda start transaction va commit orasidagi so'rovlarni ko'rasiz."
   ],
   [
    "c",
    "3–4-qadam: <b>ko'p mijoz sinovi</b> va bekor qilish; isbot — ikkinchi mijozga kelgan xabar",
    "Uchinchi qadamda smoke skriptini race rejimida yurgizasiz: besh mijoz bitta Planshetni bir vaqtda oladi. To'rtinchisida admin sifatida buyurtmani ikki marta bekor qilasiz: ombor bir marta qaytishi kerak. Isbot maydoniga ikkinchi mijozga kelgan xabarni yozing. Hammasi to'g'ri bo'lsa, commit."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingizning hamma ma'lumoti PostgreSQL'da va ortiqcha sotilmasligini o'zingiz isbotlagansiz."
   ]
  ],
  "steps": [
   {
    "t": "4-prompt — AI'ga bering, javobni o'qing, yangi jadvallarni ko'ring",
    "cmds": [
     "git diff --stat",
     "\\d orders",
     "\\d order_items"
    ],
    "exp": "yangi migratsiya · texts.ts/keyboards.ts o'zgarmagan"
   },
   {
    "t": "SQL log — .env ga qo'shing (AI boshqa nom bergan bo'lsa — javobidan), Telegram'da buyurtma bering",
    "cmds": [
     "DB_LOGGING=true"
    ],
    "exp": "START TRANSACTION … COMMIT"
   },
   {
    "t": "Besh mijoz",
    "cmds": [
     "npm run smoke -- race (vaqtinchalik bazada, sizning bazangiz o'zgarmaydi)"
    ],
    "exp": "✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0"
   },
   {
    "t": "Bekor — admin sifatida /orders da «❌ Bekor» ni ikki marta bosing, qoldiqni ko'ring, commit",
    "cmds": [
     "SELECT stock FROM products WHERE name = 'Planshet';"
    ],
    "exp": "1-chi «Bekor qilingan», 2-chi «allaqachon bekor qilingan» · 1"
   }
  ],
  "proof": {
   "label": "Ikkinchi mijozga kelgan xabar",
   "placeholder": "smoke natijasidan nusxalang",
   "re": "omborda\\s+faqat\\s+0\\s+ta",
   "flags": "i",
   "wrong": "Ikkalasiga ham \"qabul qilindi\" chiqdimi? Unda qulf yo'q — 20-ekran: place ichida qoldiq qanday o'qilganini qarang."
  },
  "trouble": [
   [
    "✗ ortiqcha sotilmadi (masalan 5/0)",
    "qulfsiz o'qish (20, 22-ekran) — AI'ga: «qatorni FOR UPDATE bilan qulfla yoki UPDATE … WHERE stock >= qty»"
   ],
   [
    "current transaction is aborted xatosi",
    "xatodan keyin tranzaksiyada so'rov (21-ekran) — tekshiruv UPDATEdan oldin"
   ],
   [
    "Bekor 2 marta — ombor 2 ga oshdi",
    "bekor qilishda buyurtma qatori qulflanmagan yoki status tekshirilmagan — AI'ga shu haqida"
   ],
   [
    "SQL logda START TRANSACTION yo'q",
    "so'rovlar tranzaksiyasiz — dataSource.transaction"
   ],
   [
    "smoke — Missing script",
    "AI package.json dagi smoke qatorini o'chirgan — git checkout tgpg-start -- scripts/smoke.js va qatorni qaytaring"
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "5-bosqich · xulosa",
  "title": "Har bosqichdan keyin beshta tekshiruv: diff, build, restart, psql va ko'p mijoz",
  "seg": [
   [
    "a",
    "Birinchi ikki tekshiruv: <b>diff hajmi va build</b> — so'ralgan ish va toza kompilyatsiya",
    "To'rt bosqichni o'tdingiz. Endi tekshiruvlarni bitta ro'yxatga yig'amiz, chunki ular har bosqichda bir xil. Birinchisi diff: o'zgarish hajmi so'ralgan bosqichga tengmi. Ikkinchisi build: loyiha xatosiz kompilyatsiya bo'ladimi."
   ],
   [
    "b",
    "Uchinchi va to'rtinchi: <b>restart va PostgreSQL terminali</b> — ma'lumot qayerda yashaydi",
    "Uchinchisi restart: suhbat o'rtasida serverni qayta yoqing va nima qolganini ko'ring. Oraliq vaziyat va state faqat shu bilan ko'rinadi. To'rtinchisi PostgreSQL terminali: backslash d bilan ustun turlari va qoidalar, select bilan haqiqiy qatorlar."
   ],
   [
    "c",
    "Beshinchi: <b>bir vaqtdagi ko'p mijoz</b> — smoke bizning kodimizda ham xato topdi",
    "Beshinchisi bir vaqtdagi ko'p mijoz: buni smoke'ning race rejimi qiladi. U bizning o'z kodimizda ham xato topdi: admin bekorni bir vaqtda ikki marta bossa, ombor ikki marta qaytardi. Buyurtma qatori qulflanmagan edi, tuzatdik. Ikki AI'ning kodi bu sinovdan o'tdi."
   ],
   [
    "d",
    "Xulosa: AI'ning <b>«sinadim» degan gapi — tekshiruv emas</b>; besh band — sizning qo'lingizda",
    "Xulosa: ikki tajribada AI kodni ko'pincha to'g'ri yozdi. Lekin so'ralmagan ishni qildi, oraliq vaziyatni sezmadi, bir marta haqiqiy Telegram'ga so'rov yubordi. Buni AI aytmadi, tekshiruv topdi. Besh band har bosqichda sizning qo'lingizda, keyin commit."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m5-04 · «Bot eslab qoladi»",
  "title": "O'quvchi darsi: bitta users jadvali, Neon va uch qatorli prompt — siz bilgan yo'lning kichik varianti",
  "seg": [
   [
    "a",
    "m5-04 — 20 ekran: o'quvchi boti <b>ismni eslab qoladi</b>, bitta <code>users</code> jadvali",
    "Endi sinfga tayyorgarlik, ikki ekran. O'quvchi darsi m5-04, yigirma ekran. O'quvchi boti ismni eslab qolishi kerak: bitta users jadvali, unda telegram id big int, ism va holat ustunlari, ya'ni name va state. Siz bugun beshta jadval bilan ishladingiz, bu uning kichik varianti."
   ],
   [
    "b",
    "Amaliyot: <b>Neon va Antigravity</b>, <code>synchronize: true</code> — migratsiyasiz",
    "O'quvchi amaliyotida baza internetdagi Neon'da, ulanish manzili oxirida sslmode require turadi. Kodni Antigravity uch qatorli prompt bilan yozadi. Jadvalni synchronize true o'zi yaratadi, migratsiya yo'q. O'quv loyiha uchun bu yetadi, siz farqini bilasiz."
   ],
   [
    "c",
    "Siz qo'shasiz: <b><code>\\d users</code> — <code>bigint</code></b>, ikki marta <code>/start</code>, restart suhbat o'rtasida",
    "Darsga siz qo'shadigan narsalar: AI yozgandan keyin o'quvchi bilan backslash d users'ni ko'ring, telegram id big int bo'lsin. Start'ni ikki marta bosib, qator bitta qolganini ko'rsating. Restartni ism so'ralgan paytda qiling: bot davom etsa, state bazada."
   ],
   [
    "d",
    "Xulosa: darsdan oldin — <b>Neon akkaunti, BotFather sinov boti</b>, <code>dars-03-done</code> ishga tushgan",
    "Xulosa: darsdan oldin uch narsani tekshiring: har o'quvchida Neon akkaunti ochiladi, BotFather'da sinov boti bor, va dars uchdagi bot ishlab turibdi. Vaqt bo'yicha taklif: amaliyotga eng ko'p vaqt bering, Neon va token bosqichida ko'pchilik xato qiladi."
   ]
  ]
 },
 "26": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "To'rtta vaziyat va tayyor javoblar — hammasini bugun o'zingiz ko'rdingiz",
  "seg": [
   [
    "a",
    "Darsda albatta chiqadigan to'rt vaziyat — <b>ikkitasi xabar bilan, ikkitasi xabarsiz</b>",
    "Endi o'quvchi darsida albatta chiqadigan to'rtta vaziyatni ko'ramiz. Ikkitasi xabar bilan keladi, ikkitasi xabarsiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "401 va <code>DATABASE_URL topilmadi</code> — <b>xabardan darhol taniladi</b>",
    "Birinchisi: server ishlayapti deydi, lekin bot javob bermaydi, terminalda to'rt yuz bir. Token noto'g'ri. Ikkinchisi: server umuman yonmaydi, database url topilmadi. Env fayli yo'q yoki manzil yozilmagan."
   ],
   [
    "c",
    "Ism unutildi va katta id — <b>restart va <code>\\d users</code> bilan</b> topiladi",
    "Uchinchisi xabarsiz: restartdan keyin bot ismni yana so'raydi. State bazaga yozilmayapti, users jadvaliga qarang. To'rtinchisi: terminalda out of range for type integer yoki ikkinchi start'da duplicate key. Ustun turi va avval qidirish bormi, shuni tekshiring."
   ],
   [
    "d",
    "Xulosa: o'quvchi «AI yozdi, ishlayapti» desa — <b>restart va ikki marta <code>/start</code></b> qildiring",
    "Xulosa va usul: o'quvchi AI yozdi, ishlayapti desa, ikki narsani o'zi qilsin: restartni suhbat o'rtasida va start'ni ikki marta. Javobni darhol aytmang, natijani birga ko'ring. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "27": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Bot savat va buyurtmani Mapda saqlaydi. Server qayta ishga tushdi. Nima bo'ladi?",
    "o": [
     "Savat va buyurtma yo'qoladi, xato chiqmaydi",
     "Server xato beradi — Map ichi buzilgan",
     "Hammasi joyida qoladi — Map diskka yoziladi",
     "Faqat buyurtma qoladi — u alohida massivda"
    ],
    "c": 0,
    "e": "Map — jarayon xotirasida.",
    "s": 3
   },
   {
    "q": "AI'ga bir gapli prompt: «Katalogni ko'chir». U 22 fayl, 1145 qatorni o'zgartirdi, kod ishlaydi. To'g'ri qadam?",
    "o": [
     "Darhol commit — kod ishlayapti, shu yetadi",
     "Bekor qilib, bitta bosqichli prompt berish",
     "AI'ni almashtirib, xuddi shu promptni berish",
     "Hech narsa — 1145 qator ham oddiy hajm"
    ],
    "c": 1,
    "e": "Commit qilinadigan hajm — so'ralgan bosqich.",
    "s": 6
   },
   {
    "q": "Katalog bazada, buyurtma hali xotirada. Buyurtmadan keyin restart. Natija?",
    "o": [
     "Hammasi joyida — katalog bazada saqlangan",
     "Ikkalasi yo'qoladi — restart bazani tozalaydi",
     "Buyurtma yo'qoladi, ombor esa kamayib qoladi",
     "Server yonmaydi — baza va xotira mos emas"
    ],
    "c": 2,
    "e": "Oraliq vaziyat: bir ish ikki joyda.",
    "s": 11
   },
   {
    "q": "Yurgan migratsiyaga ustun qo'shib tahrirladingiz, server qayta yondi. Ustun paydo bo'ladimi?",
    "o": [
     "Ha — migratsiya har restartda qayta yuradi",
     "Ha — synchronize ustunni o'zi qo'shadi",
     "Server xato beradi — fayl o'zgargani uchun",
     "Yo'q — u yurgan, yangi migratsiya kerak"
    ],
    "c": 3,
    "e": "Migratsiya bir marta yuradi.",
    "s": 9
   },
   {
    "q": "Bazadan telegram_id keldi, user.telegram_id === 111 false chiqdi, id esa 111. Sabab?",
    "o": [
     "BIGINT bazadan matn bo'lib keladi: \"111\"",
     "Id noto'g'ri — Telegram boshqa id bergan",
     "Baza ulanmagan — qiymat undefined keldi",
     "=== katta sonlarda doim false beradi"
    ],
    "c": 0,
    "e": "node-pg bigintni matn qaytaradi.",
    "s": 13
   },
   {
    "q": "Mijoz tugmani ikki marta tez bosdi, savatda ikki bir xil qator paydo bo'ldi. Nima yetishmayapti?",
    "o": [
     "Tranzaksiya — ikki bosish ketma-ket emas",
     "UNIQUE (user_id, product_id) + ON CONFLICT",
     "BIGINT — id sig'magani uchun ikki qator",
     "Migratsiya — savat jadvali eskirib qolgan"
    ],
    "c": 1,
    "e": "Avval qidirib qo'shish — ikki so'rov ikkalasi «yo'q» ko'radi.",
    "s": 14
   },
   {
    "q": "Bitta Planshet, besh mijoz bir vaqtda; kod: findOneBy → if (stock < qty) → save. CHECK (stock >= 0) bor. Natija?",
    "o": [
     "Faqat biriga — CHECK qolganlarini to'xtatadi",
     "CHECK xato beradi — ombor manfiy bo'ladi",
     "Bir nechtasiga sotiladi, ombor 0, xato yo'q",
     "Deadlock — tranzaksiyalar bir-birini kutadi"
    ],
    "c": 2,
    "e": "Har biri 0 yozdi — manfiy emas (sinovda 5 tasiga).",
    "s": 20
   },
   {
    "q": "Tranzaksiyada CHECK xato berdi, kod shu tranzaksiyada SELECT qildi. Nima chiqadi?",
    "o": [
     "Oddiy natija — SELECT alohida ishlaydi",
     "Baza o'zi COMMIT qiladi va natija beradi",
     "0 rows — jadval bo'shab qoladi",
     "current transaction is aborted xatosi"
    ],
    "c": 3,
    "e": "Xatodan keyin faqat ROLLBACK.",
    "s": 21
   }
  ]
 },
 "28": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  TgPg — «Buzamiz» (20-ekran) uchun kichik rasm (F-1120-02, M51/M52). Darsning katta rasmi — parts/02e-bot.jsx (BotMap).
//  Qiymatlar: manba/orderbot-out/09, 10-smoke-buzuq (buzuq: 1/0 5/0 5/0 5/0 5/0), tgpg-done: 1/0 × 5. CSS izohida backtick yo'q.
// ============================================================
// locked: kodda qulf bormi · known: natija ko'rinadimi (M52-3: ovoz aytguncha «?») · fixed · pins: { a, b }
function RaceMini({ locked, known, fixed, pins = {} }) {
  const bad = !locked && !fixed;
  const res = !known ? '?' : bad ? '5 / 0' : '1 / 0';
  const box = (x, w, label, sub, state) => <div className="n1-abs" style={{ left: x, top: 34, width: w, height: 50, borderRadius: 10, border: `2px solid ${state === 'bad' ? '#DC2626' : state === 'ok' ? T.green : T.line}`, background: state === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s' }}>
    <div style={{ font: `700 11.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap' }}>{label}</div>
    <div style={{ font: `500 10.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', marginTop: 3 }}>{sub}</div>
  </div>;
  return <>
    <span className="n1-tagl" style={{ left: 8, top: 12 }}>{t("5 mijoz · 1 ta Planshet · bir vaqtda", '5 клиентов · 1 Planshet · одновременно')}</span>
    {box(8, 104, '×5 mijoz', '✅ Buyurtma', '')}
    {box(128, 196, locked || fixed ? 'findOne + lock' : 'findOneBy', locked || fixed ? t('qulf: biri kutadi', 'блок: второй ждёт') : t('qulfsiz: hammasi 1 ni ko\'radi', 'без блока: все видят 1'), bad ? 'bad' : fixed ? 'ok' : '')}
    {box(340, 172, 'products', 'Planshet · stock 1', '')}
    {[112, 324].map((x) => <div key={x} className="n1-arr" style={{ left: x + 1, top: 58, width: 14 }} />)}
    <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: res === '?' ? T.ink3 : bad ? '#DC2626' : T.green }}>{t('sotildi / ombor', 'продано / склад')} → {res}{known && bad ? t(' · CHECK ushlamadi', ' · CHECK не поймал') : ''}</span>
    {pins.a && <span className="n1-pin on" style={{ left: 310, top: 26 }}>{pins.a}</span>}
    {pins.b && <span className="n1-pin on" style={{ left: 498, top: 26 }}>{pins.b}</span>}
  </>;
}
// ============================================================
//  MENTOR KURSI · Telegraf + PostgreSQL «Buyurtma boti: AI bilan bazaga ko'chiramiz» (v2, F-1103-10)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/17-TgPg-mentor-v2.md (GATE M 04.11)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar tgpg-start → tgpg-done; kod bo'laklari 03b-kod.gen.jsx (aynan, satr raqami bilan)
//  Haqiqiy chiqishlar: manba/orderbot-out/ (loyiha, smoke, KOD 3–8) · manba/orderbot-ai/ (Opus) · manba/orderbot-ai2/ (Haiku)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx tgpg/parts/*.jsx > TgPgMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-tgpg-01-holat-v1'; // M44: id o'zgarmaydi — ekranlar soni o'zgargani uchun eski saqlov o'zi bekor bo'ladi
const LESSON_TITLE = "Buyurtma boti: AI bilan bazaga ko'chiramiz";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', tg: '#5B8DB8', tgBg: '#DCE7F0', ai: '#6D3BE4' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.entity\.ts$/.test(f) ? T.purple : /migrations\//.test(f) ? PG.pg : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
  cat: 'src/api/catalog/catalog.service.ts', usr: 'src/api/user/user.service.ts', cart: 'src/api/cart/cart.service.ts', ord: 'src/api/order/order.service.ts',
  types: 'src/core/types.ts', cfg: 'src/config/index.ts', main: 'src/main.ts',
  prod: 'src/core/entity/product.entity.ts', uent: 'src/core/entity/user.entity.ts', mig: 'src/infrastructure/migrations/1762200000000-init.ts', ds: 'src/infrastructure/data-source.ts',
};
const START_FILES = tree(['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.cart, F.cat, F.ord, F.tg, F.kb, F.tx, F.usr, F.cfg, F.types, F.main, '.env', 'package.json', 'README.md']);
const DONE_FILES = tree(['node_modules/', 'scripts/smoke.js', 'src/api/app.module.ts', F.cart, F.cat, F.ord, F.tg, F.kb, F.tx, F.usr, F.cfg, 'src/core/entity/cart-item.entity.ts', 'src/core/entity/order.entity.ts', 'src/core/entity/order-item.entity.ts', F.prod, F.uent, F.ds, 'src/infrastructure/database.module.ts', F.mig, 'src/infrastructure/seed.ts', F.main, '.env', 'package.json', 'README.md']);
MKCFG.files = START_FILES;
// VS Code'dagidek ixcham Explorer: faqat ochiq faylning papka zanjiri ochiq, qolgan papkalar yopiq (M27: '/' — yopiq papka).
// Ildizdagi fayllar va yopiq papkalar ko'rinib turadi — loyiha strukturasi yo'qolmaydi, lekin 1280 da sahnaga sig'adi.
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
  // F-1120-02 (M52): 4-element — act (mentor o'zi bosadi, chap paneldagi ko'rsatma)
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['backslash d products', '\\d products'], ['backslash d users', '\\d users'], ['backslash d', '\\d'],
  ['insert on conflict do update', 'INSERT … ON CONFLICT DO UPDATE'], ['on conflict', 'ON CONFLICT'], ['select for update', 'SELECT … FOR UPDATE'],
  ['update where stock katta yoki teng qty', 'UPDATE … WHERE stock >= qty'], ['update stock minus qty where stock katta yoki teng qty', 'UPDATE stock - qty WHERE stock >= qty'],
  ['check stock katta yoki teng nol', 'CHECK (stock >= 0)'], ['lock pessimistic write', "lock: 'pessimistic_write'"], ['find one by', 'findOneBy'],
  ['dataSource transaction', 'dataSource.transaction'], ['start transaction', 'START TRANSACTION'], ['migrations run true', 'migrationsRun: true'],
  ['synchronize false', 'synchronize: false'], ['synchronize true', 'synchronize: true'], ['Synchronize false', 'synchronize: false'],
  ['git diff stat', 'git diff --stat'], ['db logging true', 'DB_LOGGING=true'], ['database url', 'DATABASE_URL'], ['env example', '.env.example'],
  ['sslmode require', 'sslmode=require'], ['tgpg start', 'tgpg-start'], ['tgpg done', 'tgpg-done'], ['telegram service', 'telegram.service'],
  ['catalog service', 'catalog.service'], ['bot command catalog', "bot.command('catalog')"], ['bot action', 'bot.action'], ['bot start', 'bot.start'],
  ['cart items', 'cart_items'], ['order items', 'order_items'], ['telegram id', 'telegram_id'], ['user id', 'user_id'], ['product id', 'product_id'],
  ['WAITING PHONE', 'WAITING_PHONE'], ['big int', 'BIGINT'], ['Ctrl C', 'Ctrl+C'], ['userinfobot', '@userinfobot'], ['dars uchdagi', 'dars-03-done'],
  ['Entity decorator', '@Entity'], ['Column decorator', '@Column'], ['up metodida', 'up()'], ['down metodida', 'down()'],
];
DIGITS.unshift(["ming bir yuz qirq besh", '1145'], ['yigirma ikki fayl', '22 fayl'], ["ikki milliard bir yuz qirq yetti milliondan", '2 147 483 647 dan'],
  ['besh milliarddan', '5 milliarddan'], ['ellik ikki bitdan', '52 bitdan'], ['ikki yuz yigirma ming', '220 000'], ["o'n to'qqiz marta", '19 marta'],
  ['yigirma marta', '20 marta'], ['bir yuz o\'n birga', '111 ga'], ['bir yuz o\'n bir', '111'], ["to'rt yuz bir", '401'], ['m5-04', 'm5-04']);
// F-1109-01: gap boshidagi «Backslash l» ham «Matn»da kod bo'lib ko'rinsin
SPOKEN.push(...SPOKEN.filter(([a]) => a.startsWith('backslash')).map(([a, b]) => ['B' + a.slice(1), b]));
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(
  /current transaction is aborted/g, /is out of range for type integer/g, /violates check constraint/g, /duplicate key value/g, /Missing script/g,
  /out of range for type integer/g, /Unauthorized/g, /Conflict/g,
);

// Kod rang beruvchilar. Matn — String.raw yoki KOD (03b-kod.gen.jsx), HTML'siz.
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string)$/;
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
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
const SQL_KW = /^(SELECT|FROM|WHERE|JOIN|ON|AND|AS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|ALTER|ADD|COLUMN|DROP|PRIMARY|KEY|REFERENCES|NOT|NULL|UNIQUE|CHECK|SERIAL|INTEGER|BIGINT|VARCHAR|BEGIN|COMMIT|ROLLBACK|RETURNING|DEFAULT|CONFLICT|DO|FOR|ORDER|BY|LIMIT|CONSTRAINT|START|TRANSACTION)$/;
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
// psql: prompt (shop=#) alohida rangda; xato qizil; buyruq javobi yashil
function psqlLine(l) {
  let m = /^(\w+[=\-(][*!]?# ?)(.*)$/.exec(l);
  if (m) return `<span class="p">${escH(m[1])}</span>${/^\\/.test(m[2]) ? `<span class="m">${escH(m[2])}</span>` : sqlLine(m[2])}`;
  m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/ERROR:|FATAL:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^(DETAIL|HINT)/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  return escH(l);
}
const psql = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: psqlLine(l), ...(meta[i + 1] || {}) }));
// Oddiy terminal (npm, node, smoke, TypeORM logi)
function termLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/^\s*✗|error|Error|ERROR|query failed|Unauthorized|aborted|out of range|XATO|berilmadi/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*✓|NATIJA: 5\/5|qabul qilindi|ulandi|ishlayapti|tsc: xato yo'q|COMMIT/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^query: /.test(l)) return `<span class="cm">query: </span>${sqlLine(l.slice(7))}`;
  if (/^\s*(#|—|\(|Eslatma)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const term = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: termLine(l), ...(meta[i + 1] || {}) }));
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});
const upto = (lines, beat) => lines.filter((l) => l.at == null || l.at <= beat);

const Term = ({ lines, title = t('terminal', "терминал"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const Psql = ({ lines, title = 'psql — shop', er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
// Loyiha kodi (KOD — aynan, satr raqami bilan). ids: {satr: 'id'} — yoritish uchun; from/to — satr chegarasi
const kod = (k, ids = {}, from, to) => KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).map((l) => ({ h: tsLine(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) }));
const Code = ({ k, ids, from, to, focus, beat, files, active, fresh, style }) => <Ide files={compact(files || (KOD[k].tag === 'tgpg-start' ? START_FILES : DONE_FILES), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={baseName(KOD[k].file)} lines={kod(k, ids, from, to)} focus={focus} beat={beat} />
</Ide>;
// Mongoose jufti — bitta xira qator (M45): dvigatel .mk-pair
const Pair = ({ code, res }) => <div className="mk-pair"><b style={{ color: PG.mongo }}>{t("Mongoose'da:", "В Mongoose:")}</b> <code>{code}</code>{res ? <> → {res}</> : null}</div>;

// Bot oqimi kartasi — haqiqiy Nest + Telegraf kodi, Telegram serverisiz (handleUpdate + javob ushlanadi). Telegram ilovasi ko'rinishi EMAS (GATE M 04.11).
// items: [kim, matn, belgi] — kim: 'u' mijoz · 'b' bot · 'sep' ajratgich · 'kb' tugmalar qatori
function TgFlow({ title = t('Bot oqimi', "Поток бота"), items = [], note, src }) {
  return <div className="tg-flow">
    <div className="bar"><span className="av">🤖</span><span className="tt">{title}</span><span className="src">{src || t("haqiqiy bot javoblari · Telegram'siz sinov", "настоящие ответы бота · проверка без Telegram")}</span></div>
    <div className="bd">{items.map(([who, tx, extra], i) => who === 'sep'
      ? <div key={i} className="sep">{tx}</div>
      : who === 'kb' ? <div key={i} className="kb">{tx.split(' | ').map((b) => <span key={b}>{b}</span>)}</div>
        : <div key={i} className={`m ${who}${extra ? ' ' + extra : ''}`}>{tx}</div>)}</div>
    {note && <div className="nt">{note}</div>}
  </div>;
}
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

// TgPg v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
.pg-four{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:stretch}
@media (max-width:1300px){.pg-three,.pg-four{grid-template-columns:1fr 1fr}}
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
.tg-flow{background:${PG.tgBg};border:1px solid #C5D3E0;border-radius:12px;overflow:hidden}
.tg-flow .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#fff;border-bottom:1px solid #D7E0EA;font:600 13px ${SANS};color:${T.ink}}
.tg-flow .bar .av{width:24px;height:24px;border-radius:50%;background:${PG.tg};display:inline-flex;align-items:center;justify-content:center;font-size:13px}
.tg-flow .bar .src{margin-left:auto;font:600 10.5px ${MONO};color:${T.green};background:#E3F5EC;border:1px solid #A8D8C1;border-radius:6px;padding:3px 7px}
.tg-flow .bd{padding:10px 12px;display:flex;flex-direction:column;gap:5px}
.tg-flow .m{max-width:86%;padding:6px 10px;border-radius:12px;font-size:13.5px;line-height:1.4;background:#fff;color:${T.ink};white-space:pre-wrap;box-shadow:0 1px 1px rgba(0,0,0,.06)}
.tg-flow .m.u{align-self:flex-end;background:#E1FEC6}
.tg-flow .m.b{align-self:flex-start}
.tg-flow .m.bad{border:1.5px solid ${T.accent}}
.tg-flow .m.ok{border:1.5px solid ${T.green}}
.tg-flow .kb{align-self:flex-start;display:flex;flex-wrap:wrap;gap:4px;max-width:86%}
.tg-flow .kb span{font:12px ${SANS};background:rgba(255,255,255,.75);border:1px solid #BFD0E0;border-radius:8px;padding:4px 8px;color:${PG.tg}}
.tg-flow .sep{align-self:center;font:600 11px ${MONO};color:#5E6B78;background:rgba(255,255,255,.75);border-radius:10px;padding:3px 10px}
.tg-flow .nt{padding:6px 12px 10px;font:12px ${MONO};color:#5E6B78}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${PG.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${PG.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${PG.ai}}
.ai-card .df{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.codeInk};background:${PG.term};white-space:pre;overflow-x:auto}
.pr5{margin:0;font:13px/1.6 ${MONO};white-space:pre-wrap;background:${T.paper};border:1px solid ${T.line};border-radius:12px;padding:12px 14px}
.pr5 span{transition:background .3s,color .3s;border-radius:4px;padding:1px 0}
.pr5 span.on{background:#FFF0EB;color:${T.accent}}
.pr5 span.dim{color:${T.ink3}}
.pr5 i{font-style:normal;font:700 10.5px ${MONO};color:#fff;background:${T.accent};border-radius:4px;padding:1px 5px;margin-right:6px}
.race{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
.race .row{font:700 13px ${MONO};text-align:center;padding:10px;border:2px solid ${PG.pg};border-radius:12px;background:#E8F0F8}
.race .tx{display:grid;gap:6px}
.race .tx div{font:12.5px ${MONO};padding:6px 10px;border-radius:8px;border:1px solid ${T.line};background:${T.paper};color:${T.ink3};transition:all .3s}
.race .tx div.w{border-color:${T.yellow};background:#FFF6E2;color:${T.ink}}
.race .tx div.ok{border-color:${T.green};background:#E3F5EC;color:${T.ink}}
.race .tx div.bad{border-color:${T.accent};background:#FFF0EB;color:${T.ink}}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-tg');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-tg'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: bot buyurtmani bazaga yozdi (orderbot-out/04, 05)
// ============================================================
const PLAN1 = ['Loyiha va muammo', 'Reja va prompt', 'Ulanish va katalog', 'Foydalanuvchi, state, savat', 'Buyurtma va tranzaksiya', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0] }, { hl: [1, 2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi (BotMap, parts/02e-bot.jsx); reja pastda
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const STAGE_NO = { products: 1, users: 2, carts: 3, orders: 4 };
const CHAT_ORDER = ['+998901234567', "Buyurtma #1 qabul qilindi! Jami: 220 000 so'm", 'ok'];
const S1M = [
  { loc: DB_ALL, chat: CHAT_ORDER, note: { orders: '#1 · 220000 · CONFIRMED' }, ro: ['psql · shop', 'SELECT … FROM orders; <span class="n1-ok">→ 1 | 2 | +998901234567 | 220000 | CONFIRMED</span>'] },
  { loc: {}, chat: ['/catalog', "Katalog (1/3-sahifa). Qo'shish uchun mahsulotni bosing:"], on: ['phone', 'telegram', 'catalog', 'user', 'cart', 'order', 'mem', 'products', 'users', 'carts', 'orders'] },
  { loc: DB_ALL, chat: CHAT_ORDER, badge: STAGE_NO, on: ['db', 'products', 'users', 'carts', 'orders'] },
  { loc: DB_ALL, chat: CHAT_ORDER, note: { orders: '#1 · 220000 · CONFIRMED' } },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap {...m} tag={t("Bugungi darsning rasmi — buyurtma boti: telefon, server, ma'lumot", 'Картина урока — бот заказов: телефон, сервер, данные')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={S1.segments[Math.min(beat, 3)].hl.includes(i) ? 'hl' : (S1.segments[Math.min(beat, 3)].hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · OrderBotNest: modullar va bot oqimi (tgpg-start; orderbot-out/01 1-jarayon)
// ============================================================
const SVC2 = [['catalog', 'mahsulotlar va ombor', T.green], ['user', 'foydalanuvchi, rol, state', T.green], ['cart', 'savat', T.green], ['order', 'buyurtma, admin statusi', T.green]];
const FLOW2 = [
  ['u', '/catalog'], ['b', 'Katalog (1/3-sahifa). Qo\'shish uchun mahsulotni bosing:'], ['kb', 'Klaviatura · 120 000 so\'m | Sichqoncha · 75 000 so\'m | 1/3 | ▶ | …'],
  ['u', '[Kolonka · 50 000 so\'m] ×2'], ['b', "Kolonka savatga qo'shildi (2 ta)."], ['u', '[✅ Buyurtma berish]'],
  ['b', 'Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):'], ['u', '+998901234567'], ['b', 'Buyurtma #1 qabul qilindi! … Jami: 220 000 so\'m'],
  ['sep', 'admin Jasur'], ['b', "🆕 Yangi buyurtma #1 — Aziza, 220 000 so'm. /orders"], ['u', '[✅ Tasdiqlash]'], ['b', 'Buyurtmangiz #1: ✅ Tasdiqlangan', 'ok'],
];
const S2 = mkS(2, [{ v: 'tg' }, { v: 'svc' }, { v: 'flow' }, { v: 'map' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {(seg.v === 'tg' || seg.v === 'svc') && <Code k="START_START" />}
    {seg.v === 'svc' && <div className="pg-four">{SVC2.map(([n, d, c]) => <Card key={n} c={c} h={`${n}.service.ts`}><p>{d}</p></Card>)}</div>}
    {seg.v === 'flow' && <TgFlow title="OrderBotNest · tgpg-start" items={FLOW2} />}
    {seg.v === 'map' && <Ide files={compact(START_FILES, F.usr)} active={F.usr}>
      <CodePanel file="user.service.ts" lines={kod('START_USER', { 8: 'm' }, 6, 8)} focus={['m']} />
      <CodePanel file="order.service.ts" lines={kod('START_ORDER', { 14: 'a' }, 12, 14)} focus={['a']} style={{ marginTop: 10 }} />
    </Ide>}
  </>} />;
}

// ============================================================
//  3 · Restart (orderbot-out/01-xotira-senariy — Map'lar yangidan; telefon qatori — 10-smoke-tgpg-start, alohida node jarayoni)
// ============================================================
const FLOW3A = [['sep', '1-jarayon'], ['u', '[Klaviatura] → [Kolonka] ×2 → telefon'], ['b', "Buyurtma #1 qabul qilindi! … Jami: 220 000 so'm", 'ok'], ['u', '/orders (admin) → [✅ Tasdiqlash]'], ['b', 'Buyurtmangiz #1: ✅ Tasdiqlangan'], ['u', '[Sichqoncha]'], ['b', "Sichqoncha savatga qo'shildi (1 ta)."]];
const FLOW3B = [['sep', 'server qayta ishga tushdi'], ['u', '/cart'], ['b', "Savat bo'sh. /catalog dan mahsulot tanlang.", 'bad'], ['u', '/orders (admin)'], ['b', "Hozircha buyurtma yo'q.", 'bad'], ['sep', 'telefon so\'ralgan paytda restart'], ['u', '+998901234567'], ['b', 'Tushunmadim. /help ni bosing.', 'bad']];
const S3 = mkS(3, [{ v: 'a' }, { v: 'b' }, { v: 'map' }, { v: 'list' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {(seg.v === 'a' || seg.v === 'b') && <div className="pg-two" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
      <TgFlow title={t("1-jarayon", "1-й процесс")} items={FLOW3A} />
      {seg.v === 'b' ? <TgFlow title="Restart" items={FLOW3B} /> : <div />}
    </div>}
    {/* F-1120-02 (M51): Node/RAM/Disk kartalari va ro'yxat o'rniga darsning rasmi */}
    {seg.v === 'map' && <div className="mk-light" style={{ padding: 14 }}><BotMap restart chat={['/cart', "Savat bo'sh. /catalog dan mahsulot tanlang.", 'bad']} on={['mem', 'products', 'users', 'carts', 'orders', 'telegram']} ro={['user.service.ts:8', 'private readonly users = <span class="n1-k">new</span> Map&lt;number, User&gt;();']} tag={t("Restart — jarayon xotirasi bo'shadi", 'Перезапуск — память процесса очистилась')} /></div>}
    {seg.v === 'list' && <div className="mk-light" style={{ padding: 14 }}><BotMap on={['mem', 'products', 'users', 'carts', 'orders']} tag={t("Bazaga ko'chadigan ma'lumot — hammasi hozir xotirada", 'Данные, которые переезжают в базу — сейчас всё в памяти')} /></div>}
  </>} />;
}

// ============================================================
//  4 · Tekshiruv 1 — restartdan keyin Kolonka (orderbot-out/12-k3-stock-restart.txt — ikki alohida jarayon)
// ============================================================
const T4_AFTER = term(String.raw`
$ node k3p.cjs tgpg-start 1
jarayon 276989: Buyurtma #1 qabul qilindi! · Kolonka stock = 8
$ node k3p.cjs tgpg-start 2
jarayon 277003 (qayta ishga tushdi): Kolonka stock = 10`);
function Screen4(p) {
  return MC(p, 4, {
    above: <div style={{ display: 'grid', gap: 8 }}><CodePanel file="catalog.service.ts" lines={kod('START_CAT', { 11: 'mi' }, 7, 14)} focus={['mi']} /><div className="mk-pair">{t("1-jarayon: Aziza [Kolonka] ×2 → «Buyurtma #1 qabul qilindi!» → qoldiq 8", "процесс 1: Азиза [Kolonka] ×2 → «Buyurtma #1 qabul qilindi!» → остаток 8")}</div></div>,
    after: <Term title={t("terminal — ikki alohida jarayon", "терминал — два отдельных процесса")} lines={T4_AFTER} />,
  });
}

// ============================================================
//  5 · Amaliyot 1 — clone, ishga tushirish, restart
// ============================================================
const P5 = mkPractice(5, [[], [0, 1], [2, 3], []]);
function ScreenP5(p) { return <Practice p={p} S={P5.S} steps={P5.steps} trouble={P5.trouble} proof={P5.proof} />; }

// ============================================================
//  6 · Reja: to'rt bosqich (orderbot-ai2 — oddiy prompt, 22 fayl / 1145 qator)
// ============================================================
const DIFF6 = ` src/db/database.module.ts               |  29 ++
 src/db/migrations/1762000000000-Init.ts |  69 +++
 22 files changed, 1145 insertions(+), 210 deletions(-)`;
const S6 = mkS(6, [{ v: 'st', hl: -1 }, { v: 'chk', hl: -1 }, { v: 'haiku' }, { v: 'st', hl: 'all' }]);
// F-1120-02 (M51): to'rt karta o'rniga rasm — har ma'lumot qaysi bosqichda bazaga ko'chishi (raqam), xulosada hammasi bazada
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'st' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={seg.hl === 'all' ? DB_ALL : {}} badge={STAGE_NO} on={seg.hl === 'all' ? ['db', 'products', 'users', 'carts', 'orders'] : ['mem', 'products', 'users', 'carts', 'orders']} tag={t("To'rt bosqich: raqam — ma'lumot qaysi bosqichda bazaga ko'chadi", 'Четыре этапа: число — на каком этапе данные переезжают в базу')} /></div>}
    {seg.v === 'chk' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={{ products: 'db' }} badge={STAGE_NO} on={['db', 'products']} note={{ products: '✓ build · restart · psql' }} ro={['git', 'git add -A &amp;&amp; git commit -m "1-bosqich: katalog"  <span class="n1-ok">' + t('→ keyin 2-bosqich', '→ потом 2-й этап') + '</span>']} tag={t("1-bosqichdan keyin: build, restart, psql — keyin commit", 'После 1-го этапа: build, restart, psql — потом commit')} /></div>}
    {seg.v === 'haiku' && <AiReply who={t("Oddiy prompt (2-tajriba)", "Обычный промпт (2-й опыт)")} prompt="Katalogni postgresqlga ko'chirib ber, TypeORM ishlat. .env da DATABASE_URL bor." said={<>{t("AI: «katalog va holat xotiradan PostgreSQL'ga ko'chirildi» — ", "AI: «каталог и состояние перенесены из памяти в PostgreSQL» — ")}<b>{t("hamma servis", "все сервисы")}</b>{t(" o'zgardi, chetga chiqqani alohida aytilmadi.", " изменены, выход за рамки отдельно не назван.")}</>} diff={DIFF6} hl />}
    {seg.v === 'st' && seg.hl === 'all' && <div className="mk-rule">{t("Bitta prompt — ", "Один промпт — ")}<b>{t("bitta bosqich", "один этап")}</b>{t(". Tekshirmaguncha keyingisi yozilmaydi.", ". Пока не проверено, следующий не пишется.")}</div>}
  </>} />;
}

// ============================================================
//  7 · Besh qismli prompt (orderbot-ai/00-promptlar.md — Prompt 1, aynan)
// ============================================================
const PROMPT1 = [
  ['1', "Bu NestJS + Telegraf loyihasi (Telegram buyurtma boti). Hozir katalog, savat, foydalanuvchilar va buyurtmalar xotirada (Map va array) — server qayta ishga tushsa hammasi yo'qoladi. Ularni PostgreSQL'ga bosqichma-bosqich ko'chiramiz.\n\n"],
  ['2', "1-bosqich — faqat bazaga ulanish va katalog:\n"],
  ['3', "- TypeORM ulang (@nestjs/typeorm, pg). Manzil .env dagi DATABASE_URL dan, src/config/index.ts orqali o'qilsin.\n- synchronize ishlatmang: jadvallar migratsiya bilan yaratilsin, server ko'tarilganda yurmagan migratsiya o'zi yursin.\n- products jadvali: id, name (takrorlanmas), price, stock; stock manfiy bo'lmasin — bazada CHECK.\n- Seed skript (npm run seed): hozirgi 6 mahsulotni kiritsin, ikkinchi marta yurganda takror qo'shmasin.\n- CatalogService bazadan o'qisin, sahifalash qolsin (2 tadan).\n"],
  ['4', "- User, savat, buyurtma servislariga hali tegmang.\n\n"],
  ['5', "Javobingizda: qaysi fayllar o'zgardi, qanday ishga tushirish va psql'da nimani tekshirish kerak."],
];
const PART7 = ['kontekst', 'maqsad', 'shartlar', 'chegara', 'javob'];
const S7 = mkS(7, [{ on: ['1'] }, { on: ['2', '3'] }, { on: ['4', '5'] }, { on: [] }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag" style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t("1-prompt — nusxalanadi (12-ekran)", "1-й промпт — копируется (экран 12)")}</span><CopyBtn text={PROMPT1.map((x) => x[1]).join('')} /></div>
      <pre className="pr5">{PROMPT1.map(([k, tx]) => <span key={k} className={seg.on.includes(k) ? 'on' : seg.on.length ? 'dim' : ''}><i>{k} · {PART7[k - 1]}</i>{tx}</span>)}</pre></div>
    {seg.on.length === 0 && <div className="mk-rule">{t("Har shart — keyin ", "Каждое условие — потом ")}<b>{t("tekshiriladigan bitta band", "один проверяемый пункт")}</b>: CHECK → <code>UPDATE … SET stock = -1</code>{t(" xato beradi; seed → ikkinchi marta 0 ta.", " даёт ошибку; seed → во второй раз 0.")}</div>}
  </>} />;
}

// ============================================================
//  8 · Tekshiruv 2 — qaysi prompt (orderbot-ai/p1, orderbot-ai2/p1)
// ============================================================
const DIFF8B = ` src/api/order/order.service.ts                     |  11 +-
 src/api/telegram/telegram.service.ts               |  25 +-
 (15 fayl, shundan package-lock.json 536 qator)`;
function Screen8(p) {
  return MC(p, 8, {
    above: <div style={{ display: 'grid', gap: 10 }}>
      <AiReply who="A · «Katalogni postgresqlga ko'chirib ber, TypeORM ishlat.»" said={t("«katalog va holat xotiradan PostgreSQL'ga ko'chirildi»", "«каталог и состояние перенесены из памяти в PostgreSQL»")} diff=" 22 files changed, 1145 insertions(+), 210 deletions(-)" />
      <AiReply who={t("B · besh qismli prompt (faqat 1-bosqich, «tegmang»)", "B · промпт из пяти частей (только 1-й этап, «не трогай»)")} said={<>«<b>{t("Bitta chetga chiqish:", "Один выход за рамки:")}</b>{t(" order va telegram servislarida bir nechta qatorni o'zgartirdim… await qo'shilmasa, kod kompilyatsiyadan o'tmaydi.»", " в сервисах order и telegram я изменил несколько строк… если не добавить await, код не скомпилируется.»")}</>} diff=" 15 files changed, 721 insertions(+), 77 deletions(-)" />
    </div>,
    after: <Term title={t("B · git diff --stat (parcha)", "B · git diff --stat (фрагмент)")} lines={term(DIFF8B)} />,
  });
}

// ============================================================
//  9 · TypeORM ichida: entity → migratsiya → migrations (tgpg-done; orderbot-out/03; Mongoose — pg2-out/v2d-mongoose.txt)
// ============================================================
const T9 = psql(String.raw`
shop=# \dt
             List of tables
 Schema |    Name     | Type  |  Owner
--------+-------------+-------+----------
 public | cart_items  | table | postgres
 public | migrations  | table | postgres
 public | order_items | table | postgres
 public | orders      | table | postgres
 public | products    | table | postgres
 public | users       | table | postgres
(6 rows)

shop=# SELECT * FROM migrations;
 id |   timestamp   |       name
----+---------------+-------------------
  1 | 1762200000000 | Init1762200000000
(1 row)`, { 13: { id: 'm' }, 16: { id: 'm' } });
const S9 = mkS(9, [{ v: 'ent' }, { v: 'mig' }, { v: 'tbl' }, { v: 'tbl', rule: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'ent' && <><Code k="DONE_PRODUCT" focus={['d']} ids={{ 4: 'd', 9: 'd', 12: 'd', 15: 'd' }} /><Pair code="new Schema({ _id: Number, name: String, price: Number, stock: Number })" res={t("migratsiya yo'q — shop bazasi birinchi create'da o'zi paydo bo'ldi", "миграции нет — база shop появилась сама при первом create")} /></>}
    {seg.v === 'mig' && <><Code k="DONE_MIG" focus={['c']} ids={{ 13: 'c' }} active={F.mig} /><div className="mk-rule"><code>synchronize: false</code>{t(" — jadvalni faqat migratsiya o'zgartiradi · ", " — таблицу меняет только миграция · ")}<code>migrationsRun: true</code>{t(" — server ko'tarilganda yurmagani o'zi yuradi", " — при подъёме сервера незапущенная запускается сама")}</div></>}
    {seg.v === 'tbl' && <Psql lines={T9} focus={seg.rule ? ['m'] : []} />}
    {seg.rule && <div className="mk-rule">{t("Ustun qo'shish — ", "Добавить колонку — ")}<b>{t("yangi migratsiya fayli", "новый файл миграции")}</b>{t(". Yurgan migratsiyani tahrirlash foyda bermaydi: ", ". Править уже выполненную миграцию бесполезно: ")}<code>migrations</code>{t(" jadvalida u allaqachon bor.", " она уже есть в таблице.")}</div>}
  </>} />;
}

// ============================================================
//  10 · AI javobini o'qish (orderbot-ai/p1: 00-ai-javobi, diff-stat, 02-seed, 05-psql)
// ============================================================
const DIFF10 = ` .env.example                                       |   3 +
 README.md                                          |  12 +-
 package-lock.json                                  | 536 +++++++++++++++++++--
 package.json                                       |  13 +-
 src/api/app.module.ts                              |   4 +-
 src/api/catalog/catalog.module.ts                  |   3 +
 src/api/catalog/catalog.service.ts                 |  71 +--
 src/api/catalog/product.entity.ts                  |  20 +
 src/api/order/order.service.ts                     |  11 +-
 src/api/telegram/telegram.service.ts               |  25 +-
 src/config/index.ts                                |   2 +
 src/database/data-source.ts                        |   6 +
 .../migrations/1793733128247-CreateProducts.ts     |  23 +
 src/database/seed.ts                               |  42 ++
 src/database/typeorm.config.ts                     |  27 ++
 15 files changed, 721 insertions(+), 77 deletions(-)`;
const DIFF10L = term(DIFF10, { 9: { id: 'x' }, 10: { id: 'x' } });
const T10 = term(String.raw`
$ npm run seed
Seed: 6 ta mahsulot qo'shildi, 0 tasi bazada bor edi.
$ npm run seed
Seed: 0 ta mahsulot qo'shildi, 6 tasi bazada bor edi.
$ psql -U postgres -d shop -c '\d products'
    "UQ_products_name" UNIQUE CONSTRAINT, btree (name)
    "CHK_products_stock" CHECK (stock >= 0)`);
const S10 = mkS(10, [{ v: 'diff' }, { v: 'out' }, { v: 'run' }, { v: 'run', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v !== 'run' && <Term title={t("git diff --stat — 1-tajriba, 1-prompt", "git diff --stat — 1-й опыт, 1-й промпт")} lines={DIFF10L} focus={seg.v === 'out' ? ['x'] : []} />}
    {seg.v === 'out' && <AiReply who={t("1-tajriba · 1-prompt", "1-й опыт · 1-й промпт")} said={<>«<b>{t("Bitta chetga chiqish (buni bilib qo'ying):", "Один выход за рамки (имейте в виду):")}</b>{t(" order va telegram servislarida bir nechta qatorni o'zgartirdim. Bazaga so'rov asinxron, shuning uchun CatalogService metodlari endi Promise qaytaradi…»", " в сервисах order и telegram я изменил несколько строк. Запрос к базе асинхронный, поэтому методы CatalogService теперь возвращают Promise…»")}</>} hl />}
    {seg.v === 'run' && <Term title={t("terminal — o'zingiz yurgizasiz", "терминал — запускаете сами")} lines={T10} />}
    {/* F-1120-02 (M51): xulosada darsning rasmi — katalog bazada, seed ikki marta yurdi, qoidalar \d products da (T10) */}
    {seg.sum && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={{ products: 'db' }} on={['catalog', 'db', 'products']} note={{ products: '6 ta · UNIQUE · CHECK' }} ro={['git', t("o'qing → solishtiring → yurgizing → <b>git commit</b>", 'прочитать → сравнить → запустить → <b>git commit</b>')]} max={1} tag={t("O'qing, solishtiring, yurgizing — shundan keyin commit", 'Прочитайте, сравните, запустите — потом коммит')} /></div>}
  </>} />;
}

// ============================================================
//  11 · Oraliq vaziyat (orderbot-ai/p1: 04-senariy, 05-psql)
// ============================================================
const T11 = psql(String.raw`
shop=# SELECT * FROM products ORDER BY id;
 id |    name    | price  | stock
----+------------+--------+-------
  1 | Klaviatura | 120000 |     7
  2 | Sichqoncha |  75000 |    15
  3 | Quloqchin  |  95000 |     5
  4 | Kolonka    |  50000 |     8
  5 | Planshet   | 300000 |     3
  6 | O'yinchoq  |  30000 |     4
(6 rows)`, { 4: { id: 'k' }, 7: { id: 'k' } });
const FLOW11A = [['sep', '1-bosqichdan keyin'], ['u', '[Klaviatura] → [Kolonka] ×2 → telefon'], ['b', "Buyurtma #1 qabul qilindi! … Jami: 220 000 so'm"]];
const FLOW11B = [['sep', 'server qayta ishga tushdi'], ['u', '/orders (admin)'], ['b', "Hozircha buyurtma yo'q.", 'bad']];
const S11 = mkS(11, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'c' }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <>
    {seg.v !== 'c' && <div className="pg-two"><TgFlow title={t("buyurtma — xotirada", "заказ — в памяти")} items={FLOW11A} />{seg.v === 'b' && <TgFlow title="restart" items={FLOW11B} />}</div>}
    {seg.v === 'b' && <Psql lines={T11} focus={['k']} />}
    {/* F-1120-02 (M51): ikki karta o'rniga rasm — ombor bazada qoldi, buyurtma xotirada edi va restartda o'chdi */}
    {seg.v === 'c' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={{ products: 'db' }} restart chat={['/orders (admin)', "Hozircha buyurtma yo'q.", 'bad']} on={['products', 'orders', 'mem', 'db', 'order', 'catalog']} note={{ products: 'Klaviatura 7 · Kolonka 8' }} tag={t("Bitta sotuv — ikki joyda: ombor bazada, buyurtma xotirada", 'Одна продажа — в двух местах: склад в базе, заказ в памяти')} /></div>}
  </>} />;
}

// ============================================================
//  12 · Amaliyot 2 — 1-prompt o'z AI'ingiz bilan
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []]);
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} />; }

// ============================================================
//  25 (saytda) · Tekshiruv 5 — 2-AI (oddiy topshiriq) migratsiyasi: qaysi satr savatni mijozga bog'lamaydi (F-1125-01, M56; MD «## AI-T5»)
//  Matn shu yerda (generator o'qimaydi), RU — t(). Haqiqiy kod: feedback/F-1029-02-mentor-kurs/manba/orderbot-ai2/p1/diff.patch
//  (src/db/migrations/1762000000000-Init.ts 25–32, aynan). Yurgizilgan: orderbot-ai2/p1/07-fk-sinov.txt (AI sxemasi) va 07-fk-tuzatilgan.txt
//  (28-satrga REFERENCES users … ON DELETE CASCADE) — PostgreSQL 18.4, vaqtinchalik klaster, 26.11. Explorer daraxti yo'q — 1280 da satrlar to'liq (M61).
// ============================================================
const LC5_LINES = [
  { n: 25, h: tsLine("    await q.query(`") },
  { n: 26, h: sqlLine("      CREATE TABLE cart_items (") },
  { n: 27, h: sqlLine("        id serial PRIMARY KEY,") },
  { n: 28, h: sqlLine("        telegram_id bigint NOT NULL,") },
  { n: 29, h: sqlLine("        product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,") },
  { n: 30, h: sqlLine("        qty integer NOT NULL CHECK (qty > 0),") },
  { n: 31, h: sqlLine("        CONSTRAINT uq_cart_item UNIQUE (telegram_id, product_id)") },
  { n: 32, h: tsLine("      )`);") },
];
const LC5_FIXED = [
  ...LC5_LINES.slice(0, 3),
  { gone: true, n: '', h: LC5_LINES[3].h },
  { neu: true, n: 28, h: sqlLine("        telegram_id bigint NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,") },
  ...LC5_LINES.slice(4),
];
// 07-fk-sinov.txt (oldin) va 07-fk-tuzatilgan.txt (keyin) — bir xil senariy, qisqartirilgan; t() chizish paytida — funksiya
const LC5_RUN = () => [
  { n: '', h: '<span class="p">INSERT INTO cart_items … VALUES (999, 1, 1);</span>  <span class="cm">' + t("-- 999 — users da yo'q", '-- 999 — нет в users') + '</span>' },
  { n: '', h: t('  oldin → INSERT 0 1', '  до → INSERT 0 1') },
  { n: '', h: t('  keyin → <span class="er">ERROR: … violates foreign key constraint "cart_items_telegram_id_fkey"</span>', '  после → <span class="er">ERROR: … violates foreign key constraint "cart_items_telegram_id_fkey"</span>') },
  { n: '', h: '<span class="p">DELETE FROM users WHERE telegram_id = 5123456789;</span>  <span class="cm">' + t('-- Aziza, savatida 1 qator', '-- Азиза, в корзине 1 строка') + '</span>' },
  { n: '', h: t('  savatda qoldi: oldin → (2 rows) · keyin → <span class="ok">(0 rows)</span>', '  осталось в корзине: до → (2 rows) · после → <span class="ok">(0 rows)</span>') },
];
function ScreenAI5(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t("Tekshiruv · 5 / 5 — qaysi satr bog'lanmagan?", 'Проверка · 5 / 5 — какая строка не связана?')}
    title={t("2-AI migratsiyasi: qaysi satr savatni mijozga bog'lamaydi?", 'Миграция 2-го AI: какая строка не связывает корзину с клиентом?')}
    task={t("Qoida (<code>tgpg-done</code>): savat qatori mijozga bog'langan — mijoz yo'q bo'lsa qator yozilmaydi, mijoz o'chsa savati ham o'chadi. Bu 2-AI ning oddiy topshiriqda yozgan migratsiyasi; build va bot sinovlari (restart, ko'p mijoz) o'tgan. <b>Qaysi satr bu bog'lanishni bermaydi? Bosing.</b>", 'Правило (<code>tgpg-done</code>): строка корзины связана с клиентом — если клиента нет, строка не записывается, если клиента удалили, его корзина тоже удаляется. Это миграция, которую 2-й AI написал по простому заданию; build и проверки бота (рестарт, много клиентов) прошли. <b>Какая строка не даёт этой связи? Нажмите.</b>')}
    q={t("Beshinchi, oxirgi tekshiruv. Bu ikkinchi AI oddiy topshiriqda yozgan migratsiya: src, db, migrations papkasidagi init faylining savat jadvali. Build va bot sinovlari o'tgan. Darsdagi qoida: savat qatori mijozga bog'langan, mijoz o'chsa savati ham o'chadi. Qaysi satr bu bog'lanishni bermaydi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это миграция, которую второй AI написал по простому заданию: таблица корзины в файле init в папке src, db, migrations. Build и проверки бота прошли. Правило урока: строка корзины связана с клиентом, если клиента удалили, его корзина тоже удаляется. Какая строка не даёт этой связи? Нажмите на неё.')}
    file={t('src/db/migrations/1762000000000-Init.ts · 2-AI, oddiy topshiriq', 'src/db/migrations/1762000000000-Init.ts · 2-й AI, простое задание')} lines={LC5_LINES} target={3}
    fixed={LC5_FIXED} fixedExtra={[{ file: t('psql — haqiqiy, bir xil senariy: oldin / keyin', 'psql — настоящий, один сценарий: до / после'), lines: LC5_RUN() }]}
    ok={t("To'g'ri. Yigirma sakkizinchi satrda telegram id bor, lekin users jadvaliga bog'lanish yo'q. Biz sinadik: yo'q mijozga savat qatori yozildi, mijoz o'chirilganda savati qoldi. Satrga references users va on delete cascade qo'shdik: yo'q mijozga xato chiqdi, o'chirilganda savat ham o'chdi. Demak, AI migratsiyasida har id ustuni qaysi jadvalga bog'langanini backslash d bilan tekshiring.", 'Верно. В двадцать восьмой строке есть telegram id, но нет ссылки на таблицу users. Мы проверили: для несуществующего клиента строка корзины записалась, после удаления клиента его корзина осталась. Добавили в строку references users и on delete cascade: для несуществующего клиента — ошибка, при удалении корзина тоже удалилась. Значит, в миграции от AI проверяйте через backslash d, с какой таблицей связан каждый столбец id.')}
    okShort={t("28-satr: telegram_id — users ga bog'lanish yo'q (orders da ham, 36-satr). Sinaldi: yo'q mijozga INSERT 0 1, mijoz o'chsa savat qoldi. REFERENCES users(telegram_id) ON DELETE CASCADE → foreign key xatosi, savat ham o'chdi.", 'Строка 28: telegram_id — нет ссылки на users (в orders тоже, строка 36). Проверено: для несуществующего клиента INSERT 0 1, после удаления клиента корзина осталась. REFERENCES users(telegram_id) ON DELETE CASCADE → ошибка foreign key, корзина тоже удалилась.')}
    hint={t("Bu satr id, mahsulot, son yoki takrorlanmaslik haqida. Mijozni bildiradigan ustunni toping va uning oxirida nima yo'qligiga qarang.", 'Эта строка про id, товар, количество или уникальность. Найдите столбец, который обозначает клиента, и посмотрите, чего не хватает в его конце.')} />;
}

// ============================================================
//  13 · BIGINT: Telegram id va matn (orderbot-out/05; tgpg-out/07, 14; orderbot-ai/p2; 12-k5 Mongoose)
// ============================================================
const T13A = psql(String.raw`
shop=# SELECT telegram_id, pg_typeof(telegram_id), telegram_id > 2147483647 AS int4_sigmaydi FROM users;
 telegram_id | pg_typeof | int4_sigmaydi
-------------+-----------+---------------
         111 | bigint    | f
  5123456789 | bigint    | t
(2 rows)`, { 6: { id: 'a' } });
const T13B = term(String.raw`
$ node bigint.js          # node-pg
rows[0].telegram_id = "5123456789" · typeof: string
v === 5123456789 → false
Number(v) === 5123456789 → true
$ node sinov-typeorm.js   # TypeORM
user.telegram_id = "5123456789" · typeof: string`);
const S13 = mkS(13, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'd' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'a' && <Psql lines={T13A} focus={['a']} />}
    {seg.v !== 'a' && seg.v !== 'c' && <><Term lines={T13B} /><Pair code="User.create({ telegramId: 5123456789 })" res="typeof: number · === 5123456789 → true" /></>}
    {seg.v === 'c' && <div className="pg-two">
      <Card c={T.green} h={t("1 · tur — string (tgpg-done)", "1 · тип — string (tgpg-done)")}><p><code>telegram_id: string</code>{t(" · solishtirish ", " · сравнение ")}<code>String(ctx.from.id)</code>{t(" bilan", " через")}</p></Card>
      <Card c={PG.ai} h="2 · transformer → number (AI)"><p>{t("bazadan kelganda ", "из базы — ")}<code>Number(v)</code>{t("; Telegram id 52 bitdan oshmaydi", "; Telegram id не больше 52 бит")}</p></Card>
    </div>}
    {seg.v === 'c' && <Code k="DONE_USER" from={16} to={19} focus={['t']} ids={{ 18: 't', 19: 't' }} />}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — users jadvali bazada, telegram_id BIGINT; entity'dagi haqiqiy satr (user.entity.ts:18–19) */}
    {seg.v === 'd' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={{ products: 'db', users: 'db' }} on={['user', 'db', 'users']} ro={['user.entity.ts:18', t("type: <b>'bigint'</b> · telegram_id: <b>string</b> — solishtirish String(ctx.from.id) bilan", "type: <b>'bigint'</b> · telegram_id: <b>string</b> — сравнение через String(ctx.from.id)")]} max={1} tag={t("Diffda ikki joy: migratsiyada BIGINT · entity'da tur va === solishtirish", 'В diff два места: BIGINT в миграции · тип и сравнение === в entity')} /></div>}
  </>} />;
}

// ============================================================
//  14 · ON CONFLICT — ikki marta bosish (orderbot-out/07, 12-k6; 12-k5 Mongoose)
// ============================================================
const T14 = term(String.raw`
# avval SELECT, keyin INSERT — UNIQUE yo'q, 20 urinish × 2 parallel bosish:
1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
2 qator chiqqan urinishlar: 19/20
# UNIQUE (user_id, product_id) bor:
ok
ERROR: duplicate key value violates unique constraint "c2_user_id_product_id_key"
# INSERT … ON CONFLICT … DO UPDATE SET qty = qty + 1 (2 parallel):
RETURNING qty: 1, 2
[{"user_id":1,"product_id":2,"qty":2}]`, mergeMeta(rng(1, 6, { at: 1 }), rng(7, 9, { at: 2 }), { 3: { id: 'n' }, 6: { id: 'u' }, 8: { id: 'o' }, 9: { id: 'o' } }));
const S14 = mkS(14, [{ v: 'code', f: ['u'] }, { v: 'race', f: ['n', 'u'] }, { v: 'oc', f: ['o'] }, { v: 'code', f: [] }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg, beat }) => <>
    {seg.v === 'code' && <Code k="DONE_CART" from={19} to={28} focus={['q']} ids={{ 22: 'q', 23: 'q', 24: 'q' }} active={F.cart} />}
    {seg.v !== 'code' && <Term title={t("terminal — haqiqiy parallel sinov", "терминал — настоящая параллельная проверка")} lines={upto(T14, beat)} beat={beat} focus={seg.f} />}
    {seg.v === 'oc' && <Pair code="findOneAndUpdate(…, { $inc: { qty: 1 } }, { upsert: true })" res={t("unique index'siz bir vaqtda — 2 hujjat · index bilan — 1", "без unique index одновременно — 2 документа · с index — 1")} />}
    {seg.v === 'code' && seg.f.length === 0 && <div className="mk-rule">{t("«Avval qidirib, keyin qo'shish» ko'rsangiz: jadvalda ", "Видите «сначала найти, потом добавить»: есть ли в таблице ")}<b>UNIQUE</b>{t(" bormi va so'rov ", " и идёт ли запрос через ")}<b>ON CONFLICT</b>{t(" bilanmi.", " ?")}</div>}
  </>} />;
}

// ============================================================
//  15 · State bazada (orderbot-ai/p2, p3 04b-state-restart; 12-k3-state-psql)
// ============================================================
const FLOW15 = [['u', '/start → [Sichqoncha] → [✅ Buyurtma berish]'], ['b', 'Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):'], ['sep', 'server qayta ishga tushdi'], ['u', '+998935554433'], ['b', "Buyurtma #1 qabul qilindi!\n• Sichqoncha × 1 = 75 000 so'm", 'ok']];
const FLOW15B = [['sep', '2-bosqichdan keyin (savat hali xotirada)'], ['u', '+998935554433'], ['b', "Buyurtma berilmadi: Savat bo'sh", 'bad']];
const T15 = psql(String.raw`
shop=# SELECT telegram_id, name, phone, state FROM users;
 telegram_id | name  | phone |     state
-------------+-------+-------+---------------
  5123456789 | Aziza |       | WAITING_PHONE
(1 row)`, { 4: { id: 's' } });
const S15 = mkS(15, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'sum' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'a' && <><Code k="DONE_USER" from={30} to={32} focus={['s']} ids={{ 31: 's', 32: 's' }} /><Psql title={t("psql — telefon so'ralgan payt", "psql — момент запроса телефона")} lines={T15} focus={['s']} /></>}
    {seg.v === 'b' && <TgFlow title={t("Bobur — 3-bosqichdan keyin", "Бобур — после 3-го этапа")} items={FLOW15} />}
    {/* F-1120-02 (M51): xulosada darsning rasmi — server qayta ishga tushdi, xotira bo'shadi, lekin users va savat bazada: WAITING_PHONE qoldi, buyurtma o'tdi (FLOW15) */}
    {seg.v === 'sum' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={{ products: 'db', users: 'db', carts: 'db' }} restart chat={['+998935554433', 'Buyurtma #1 qabul qilindi!', 'ok']} on={['phone', 'user', 'db', 'users', 'carts', 'mem']} note={{ users: 'state = WAITING_PHONE' }} max={1} tag={t("State'ni sinash: restart suhbat o'rtasida — holat bazada qoldi", 'Проверка state: рестарт посреди диалога — состояние осталось в базе')} /></div>}
    {seg.v === 'c' && <div className="pg-two"><TgFlow title={t("2-bosqichdan keyin", "после 2-го этапа")} items={FLOW15B} /><TgFlow title={t("3-bosqichdan keyin", "после 3-го этапа")} items={FLOW15.slice(2)} /></div>}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — xom so'rov va "111" (orderbot-out/12-k7-tenglik.txt)
// ============================================================
const C16 = ts(String.raw`
this.bot.command('orders', async (ctx) => {
  await this.users.getOrCreate(ctx.from);
  // raw = this.ds.query — natija turi any
  const rows = await this.orders.raw(
    'SELECT telegram_id FROM users WHERE telegram_id = $1',
    [ctx.from.id],
  );
  if (rows[0].telegram_id !== 111) return ctx.reply(texts.adminOnly);`, { 8: { id: 'x' } });
const T16 = term(String.raw`
$ npx tsc --noEmit
(tsc: xato yo'q)`);
const T16_AFTER = term(String.raw`
Jasur (id 111, ADMIN_TELEGRAM_IDS=111): /orders → bot: Bu buyruq faqat admin uchun.
$ node bigint.js
v === 5123456789 → false
Number(v) === 5123456789 → true`);
function Screen16(p) {
  return MC(p, 16, {
    above: <div style={{ display: 'grid', gap: 8 }}><CodePanel file="telegram.service.ts" lines={C16} focus={['x']} /><Term lines={T16} /></div>,
    after: <Term title={t("terminal — haqiqiy natija", "терминал — настоящий результат")} lines={T16_AFTER} />,
  });
}

// ============================================================
//  17 · Amaliyot 3 — 2- va 3-prompt
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []]);
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} />; }

// ============================================================
//  18 · Buyurtma — bitta tranzaksiya (orderbot-out/07-sql-log 33–41; 12-k8-trigger-rollback)
// ============================================================
const T18 = term(String.raw`
query: START TRANSACTION
query: SELECT … FROM "products" "Product" WHERE (("Product"."id" = $1)) LIMIT 1 FOR UPDATE -- PARAMETERS: [2]
query: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [1,2]
query: SELECT … FROM "products" "Product" WHERE (("Product"."id" = $1)) LIMIT 1 FOR UPDATE -- PARAMETERS: [1]
query: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [1,1]
query: INSERT INTO "orders"("phone", "total", "status", "created_at", "user_id") VALUES (…) RETURNING "id", "status", "created_at"
query: INSERT INTO "order_items"("qty", "price", "order_id", "product_id") VALUES (…), (…) RETURNING "id"
query: DELETE FROM "cart_items" WHERE "user_id" = $1 -- PARAMETERS: [2]
query: COMMIT`, { 1: { id: 'tx' }, 9: { id: 'tx' } });
const T18B = term(String.raw`
oldin  · products Klaviatura 8, Kolonka 10 · orders 0 · cart_items 2
query failed: INSERT INTO "order_items"(…) VALUES (…)
error: error: SINOV: order_items yozilmadi
bot: Buyurtma berilmadi: SINOV: order_items yozilmadi
keyin  · products Klaviatura 8, Kolonka 10 · orders 0 · cart_items 2`);
const S18 = mkS(18, [{ v: 'jad' }, { v: 'log' }, { v: 'rb' }, { v: 'log', f: ['tx'] }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {/* F-1120-02 (M51): uch karta o'rniga darsning rasmi — bitta buyurtma uch jadvalga tegadi, hammasi bitta tranzaksiyada */}
    {seg.v === 'jad' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={DB_ALL} tx="open" ops={{ products: 'UPDATE', orders: 'INSERT', carts: 'DELETE' }} on={['order', 'db', 'products', 'orders', 'carts']} chat={['[✅ Buyurtma berish]']} tag={t("Bitta buyurtma — uch jadval, bitta tranzaksiya", 'Один заказ — три таблицы, одна транзакция')} /></div>}
    {seg.v === 'jad' && <Code k="DONE_PLACE" from={24} to={29} />}
    {/* F-1120-02 (M51): xulosada rasm — uch jadval bitta tranzaksiyada, COMMIT; ostida o'sha SQL log */}
    {seg.f && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} tx="commit" ops={{ products: 'UPDATE', orders: 'INSERT', carts: 'DELETE' }} on={['order', 'db', 'products', 'orders', 'carts']} max={0.8} /></div>}
    {seg.v === 'log' && <Term title={t("DB_LOGGING=true — SQL log (SELECT ustunlari qisqartirilgan)", "DB_LOGGING=true — SQL-лог (колонки SELECT сокращены)")} lines={T18} focus={seg.f || []} />}
    {seg.v === 'rb' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={DB_ALL} tx="rollback" on={['order', 'db', 'products', 'orders', 'carts']} chat={['[✅ Buyurtma berish]', 'Buyurtma berilmadi: SINOV: order_items yozilmadi', 'bad']} note={{ products: 'Klaviatura 8 · Kolonka 10', orders: t("0 ta — o'zgarmadi", '0 — не изменилось'), carts: t('2 ta — saqlandi', '2 — сохранились') }} tag={t("order_items yiqildi — ROLLBACK: uch jadval ham o'zgarmadi", 'order_items упал — ROLLBACK: все три таблицы не изменились')} /></div>}
    {seg.v === 'rb' && <Term title={t("terminal — trigger bilan ataylab xato", "терминал — нарочная ошибка через trigger")} lines={T18B} />}
  </>} />;
}

// ============================================================
//  19 · Ikki mijoz, bitta Planshet: qulf (orderbot-out/08, 10-smoke-tgpg-done; orderbot-ai/p4/04c)
// ============================================================
const FLOW19 = [['sep', 'omborda 1 ta Planshet'], ['u', 'Aziza: [✅ Buyurtma berish]   ·   Bobur: [✅ Buyurtma berish]'], ['b', 'Aziza ← Buyurtma #4 qabul qilindi!', 'ok'], ['b', 'Bobur ← Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi', 'bad'], ['sep', 'ombor 0 · Boburning savati saqlandi']];
function Race19({ step }) {
  return <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Bitta qator, ikki tranzaksiya", "Одна строка, две транзакции")}</div>
    <div className="race">
      <div className="tx"><div className={step >= 1 ? 'ok' : ''}>{t("A: qatorni qulfladi", "A: заблокировала строку")}</div><div className={step >= 2 ? 'ok' : ''}>A: stock 1 → 0 · COMMIT</div></div>
      <div className="row">Planshet<br />stock {step >= 2 ? 0 : 1}</div>
      <div className="tx"><div className={step >= 1 ? 'w' : ''}>{t("B: kutadi…", "B: ждёт…")}</div><div className={step >= 2 ? 'bad' : ''}>{t("B: stock 0 — rad etildi · ROLLBACK", "B: stock 0 — отклонено · ROLLBACK")}</div></div>
    </div></div>;
}
const T19 = term(String.raw`
$ npm run smoke -- race
  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0
  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1`);
const S19 = mkS(19, [{ step: 0 }, { step: 1 }, { step: 2, flow: true }, { step: 2, smoke: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    <Race19 step={seg.step} />
    {seg.flow && <TgFlow title={t("ikki mijoz bir vaqtda", "два клиента одновременно")} items={FLOW19} src="npm run smoke -- race" />}
    {seg.smoke && <Term lines={T19} />}
    {/* F-1120-02 (M51): xulosada darsning rasmi — ikki mijoz bir vaqtda, bitta tranzaksiya COMMIT, ikkinchisi aniq xabar oladi (FLOW19, T19) */}
    {seg.smoke && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} clients={2} tx="commit" ops={{ products: 'UPDATE', orders: 'INSERT' }} on={['phone', 'order', 'db', 'products', 'orders']} chat={['[✅ Buyurtma berish]', 'Bobur ← omborda faqat 0 ta qoldi', 'bad']} note={{ products: 'stock 0' }} max={1} tag={t("Ortiqcha sotilmasin — faqat bir vaqtdagi ko'p mijoz sinovi bilan tekshiriladi", 'Не продать лишнего — проверяется только одновременными клиентами')} /></div>}
  </>} />;
}

// ============================================================
//  20 · Buzamiz: qulfsiz o'qib yozish (manba/orderbot-buzuq-order.service.ts; orderbot-out/09, 10-smoke-buzuq)
// ============================================================
const T20 = term(String.raw`
# 5 xaridor, 1 ta Planshet, bir vaqtda checkout — 5 raund
buzuq (findOneBy → if → save):  sotildi/ombor  1/0  5/0  5/0  5/0  5/0
$ npm run smoke -- race
  ✗ ortiqcha sotilmadi (sotildi/ombor): 4/0  5/0  5/0`, { 2: { id: 'b' } });
const T20_OK = term(String.raw`
tgpg-done (lock: pessimistic_write):  sotildi/ombor  1/0  1/0  1/0  1/0  1/0
$ npm run smoke -- race
  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0`);
// F-1120-02 (M52): 1-segment (x) — mentor tuzatilgan koddagi lock'ni o'zi bosadi (data-act) → kod buzuq holatga o'tadi
const LOCK20 = kod('DONE_PLACE', { 31: 'r', 32: 'r', 33: 'r', 34: 'r' }, 29, 38).map((l) => (l.n === 33 ? { ...l, h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : l));
const S20 = mkS(20, [{ v: 'act' }, { v: 'code' }, { v: 'race' }, { v: 'race', chk: true }, { v: 'fix' }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={(b) => <Scene20 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzuq kod (javob «?») · 2 race → 5/0, bo'laklar 1·2 · 3 CHECK ushlamaydi · 4 tuzatildi → 1/0
function Scene20({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'code' : 'act') : seg.v;
  const mini = <N1Mini><RaceMini locked={v === 'act'} fixed={v === 'fix'} known={beat >= 2} pins={beat === 2 ? { a: 1, b: 2 } : {}} /></N1Mini>;
  return <>
    {v === 'act' && <Ide files={compact(DONE_FILES, KOD.DONE_PLACE.file)} active={KOD.DONE_PLACE.file}><div onClick={act.onClick}><CodePanel file="order.service.ts" lines={LOCK20} focus={['r']} /></div>{mini}</Ide>}
    {v === 'code' && <Ide files={compact(DONE_FILES, KOD.BUZUQ.file)} active={KOD.BUZUQ.file}><CodePanel key="b" file="order.service.ts" lines={kod('BUZUQ', { 31: 'r', 36: 'w', 37: 'w' }, 29, 37)} focus={['r', 'w']} />{mini}</Ide>}
    {v === 'race' && <Ide files={compact(DONE_FILES, KOD.BUZUQ.file)} active={KOD.BUZUQ.file}><CodePanel file="order.service.ts" lines={kod('BUZUQ', { 31: 'r', 36: 'w', 37: 'w' }, 31, 37)} focus={seg.chk ? [] : ['r', 'w']} marks={beat === 2 ? { 0: 'n1-p1', 5: 'n1-p2' } : {}} />{mini}</Ide>}
    {v === 'race' && <Term title={t("terminal — haqiqiy parallel sinov", "терминал — настоящая параллельная проверка")} lines={T20} focus={['b']} />}
    {seg.chk && <div className="n2-warn">{t("Har tranzaksiya ", "Каждая транзакция ")}<b>0</b>{t(" yozdi — ", " записала — ")}<code>CHECK (stock &gt;= 0)</code>{t(" uchun 0 ruxsat etilgan: xato xabari yo'q, faqat ortiqcha buyurtmalar.", " 0 разрешён: сообщения об ошибке нет, только лишние заказы.")}</div>}
    {v === 'fix' && <><Ide files={compact(DONE_FILES, KOD.DONE_PLACE.file)} active={KOD.DONE_PLACE.file}><CodePanel file="order.service.ts · tgpg-done" lines={kod('DONE_PLACE', { 31: 'l', 32: 'l', 33: 'l', 34: 'l' }, 29, 38)} focus={['l']} />{mini}</Ide><Term lines={T20_OK} /></>}
  </>;
}

// ============================================================
//  21 · Tranzaksiya ichida xato: aborted (orderbot-out/04a — o'z birinchi kodimiz)
// ============================================================
const T21 = term(String.raw`
Aziza: [✅ Buyurtma berish]     # 4 ta Planshet, omborda 3 ta
query failed: UPDATE products SET stock = stock - $1 WHERE id = $2 -- PARAMETERS: [4,5]
error: error: new row for relation "products" violates check constraint "stock_nonneg"
query failed: SELECT "Product"."id" AS "Product_id", … FROM "products" "Product" WHERE (("Product"."id" = $1)) LIMIT 1 -- PARAMETERS: [5]
error: error: current transaction is aborted, commands ignored until end of transaction block
  bot → Aziza: Buyurtma berilmadi: current transaction is aborted, commands ignored until end of transaction block`, { 3: { id: 'c' }, 5: { id: 'a' }, 6: { id: 'a' } });
const S21 = mkS(21, [{ v: 'log', f: [] }, { v: 'log', f: ['c', 'a'] }, { v: 'pg' }, { v: 'fix' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'log' && <Term title={t("terminal — birinchi kodimiz (tgpg-done yozilayotganda)", "терминал — наш первый код (пока писался tgpg-done)")} lines={T21} focus={seg.f} />}
    {seg.v === 'pg' && <div className="pg-three"><Card c={T.green} h="shop=#"><p>{t("oddiy — har buyruq o'zi saqlanadi", "обычное — каждая команда сохраняется сама")}</p></Card><Card c={T.yellow} h="shop=*#"><p>{t("tranzaksiya ochiq", "транзакция открыта")}</p></Card><Card c={T.accent} h="shop=!#" hl><p>{t("xato bo'ldi — faqat ROLLBACK", "была ошибка — только ROLLBACK")}</p></Card></div>}
    {seg.v === 'pg' && <div className="mk-rule">{t("PostgreSQL-2 dagi undov belgili prompt — kodda ", "Промпт с восклицательным знаком из PostgreSQL-2 — в коде ")}<code>current transaction is aborted</code>{t(" bo'lib chiqadi.", " выходит.")}</div>}
    {seg.v === 'fix' && <Code k="DONE_PLACE" from={31} to={45} focus={['t']} ids={{ 36: 't', 37: 't', 38: 't', 42: 'u' }} />}
  </>} />;
}

// ============================================================
//  22 · Tekshiruv 4 — qaysi satr ortiqcha sotadi (LineCheck; buzuq fayl 29–41, xato 31 → bo'lakda 3-satr, target 2)
// ============================================================
const LC22 = kod('BUZUQ').filter((l) => l.n !== 30); // 30-satr izohi — shovqin; satr raqamlari haqiqiy
const LC22_FIXED = LC22.map((l) => (l.n === 31 ? { ...l, gone: true } : l));
LC22_FIXED.splice(2, 0, ...ts(String.raw`
        const p = await m.findOne(Product, {
          where: { id: c.product.id },
          lock: { mode: 'pessimistic_write' },
        });`).map((l) => ({ ...l, neu: true })));
function plainLines(src) { return src.split('\n').map((l) => ({ h: `<span class="ok">${escH(l)}</span>` })); }
function Screen22(p) {
  const m = MDT[22];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="order.service.ts" lines={LC22} target={1}
    tree={{ root: MKCFG.root, files: compact(DONE_FILES, F.ord), active: F.ord }}
    fixed={LC22_FIXED} fixedExtra={[{ file: 'npm run smoke -- race', lines: plainLines('✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0') }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  23 · Amaliyot 4 — 4-prompt va ko'p mijoz sinovi
// ============================================================
const P23 = mkPractice(23, [[], [0, 1], [2, 3], []]);
function ScreenP23(p) { return <Practice p={p} S={P23.S} steps={P23.steps} trouble={P23.trouble} proof={P23.proof} />; }

// ============================================================
//  24 · Beshta tekshiruv (orderbot-ai/XULOSA; 10-smoke-tgpg-done — birinchi yurish ✗ bekor)
// ============================================================
const CHK24 = [['1', 'diff', 'hajm = so\'ralgan bosqich (1145 qator — yo\'q)'], ['2', 'build', 'tsc · nest build'], ['3', 'restart', 'suhbat o\'rtasida · smoke restart'], ['4', 'psql', '\\d · CHECK · bigint · SELECT'], ['5', "ko'p mijoz", 'smoke race · ikki marta bekor']];
const FOUND24 = ["so'ralmagan ishni qildi (22 fayl)", 'oraliq vaziyatni sezmadi', "sinovda Telegram'ga bitta so'rov ketdi (401)", 'bizning kodda: ikki marta «Bekor» → ombor 2'];
const T24 = term(String.raw`
$ npm run smoke        # tgpg-done, birinchi yurish
  ✗ ikki marta bekor — ombor bir marta qaytdi: 2
$ npm run smoke        # FOR UPDATE qo'shilgach
  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1
NATIJA: 5/5 ✓`);
const S24 = mkS(24, [{ on: ['1', '2'] }, { on: ['3', '4'] }, { on: ['5'], t: true }, { on: ['1', '2', '3', '4', '5'], f: true }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    <div className="pg-four" style={{ gridTemplateColumns: 'repeat(5,minmax(0,1fr))' }}>{CHK24.map(([n, h, d]) => { const cur = seg.on.includes(n) && seg.on.length < 5; return <Card key={n} c={cur ? T.accent : T.blue} h={`${n} · ${h}`} hl={cur} dim={!seg.on.includes(n)}><p>{d}</p></Card>; })}</div>
    {seg.t && <Term lines={T24} />}
    {seg.f && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("AI aytmadi — tekshiruv topdi", "AI не сказал — нашла проверка")}</div>
      <div className="mk-plan">{FOUND24.map((x, i) => <div key={x} style={{ animation: `mk-up .4s ${i * 0.08}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  25 · Sinfga tayyorgarlik: m5-04 (BotStatefulMemoryLesson.jsx — SCREEN_META 20; TelegramBotNest dars-04-done)
// ============================================================
const ADD25 = [['\\d users — telegram_id bigint', 'amaliyot, AI yozgandan keyin'], ['/start ikki marta — SELECT count(*)', 'amaliyot, Telegram tekshiruvi'], ['restart ism so\'ralganda', 'amaliyot oxiri'], ['sslmode=require o\'chirilmasin', 'Neon qadami'], ['AI fayllari — git diff --stat', 'Antigravity qadami']];
const S25 = mkS(25, [{ v: 'cards' }, { v: 'cards', hlO: true }, { v: 'add' }, { v: 'pre' }]);
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m5-04 (20 ekran)", "Ученик · m5-04 (20 экранов)")} hl={seg.hlO}><p><code>TelegramBotNest</code>{t(" · dars-03-done → dars-04-done · bitta ", " · dars-03-done → dars-04-done · одна ")}<code>users</code> (<code>telegram_id bigint unique</code>, <code>ism</code>, <code>holat</code>{t(" — reponing state'i) · Neon (", " — state репозитория) · Neon (")}<code>sslmode=require</code>{t(") · Antigravity'ga 3 qatorli prompt · ", ") · промпт Antigravity из 3 строк · ")}<code>synchronize: true</code></p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest · tgpg-start → tgpg-done · 5 jadval · migratsiya · 4 bosqich · besh tekshiruv · ", "OrderBotNest · tgpg-start → tgpg-done · 5 таблиц · миграция · 4 этапа · пять проверок · ")}<code>npm run smoke</code></p></Card>
    </div>}
    {seg.v === 'add' && <table className="pg-dict"><tbody>{ADD25.map(([a, b]) => <tr key={a}><td><code>{a}</code></td><td>{b}</td></tr>)}</tbody></table>}
    {seg.v === 'pre' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Darsdan oldin", "До урока")}</div><div className="mk-plan">
      {[t('Har o\'quvchida Neon akkaunti ochiladi', "У каждого ученика открывается аккаунт Neon"), t("BotFather'da sinov boti bor (token)", "В BotFather есть тестовый бот (токен)"), t('dars-03-done boti ishlab turibdi', "бот dars-03-done работает")].map((x, i) => <div key={x}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>}
  </>} />;
}

// ============================================================
//  26 · Qoqiladigan joylar (tgpg-out/11, 13 — TelegramBotNest; orderbot-out/12-k4) + o'quvchi savollari
// ============================================================
const CARDS26 = [
  ['Bot javob bermaydi', 'Telegram ulanmadi: 401: Unauthorized (server «ishlayapti»)', 'token — BotFather'],
  ['Server yonmaydi', 'DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing', '.env'],
  ['Restartdan keyin ism unutildi', 'xato yo\'q, «Salom! Ismingiz nima?»', 'state bazaga yozilmayapti — SELECT … FROM users'],
  ['Katta id', 'value "5123456789" is out of range for type integer · yoki duplicate key', 'bigint; avval qidirish yoki ON CONFLICT'],
];
const QA26 = [
  ['«AI yozdi, ishlayapti — yana nega tekshiramiz?»', 'Bitta sinovda ko\'rinmaydigan xato bor: restart va ikki marta bosish (11, 14-ekran).'],
  ['«Nega synchronize: true, ishlab turgan loyihada ham shundaymi?»', 'Yo\'q: u ustunni ogohlantirmasdan o\'chirishi mumkin; ishlab turgan loyihada migratsiya (9-ekran).'],
  ['«Telegram id raqam-ku, nega bazadan matn keldi?»', 'bigint JavaScript sonidan katta bo\'lishi mumkin, kutubxona matn beradi (13-ekran).'],
  ['«Neon o\'rniga o\'z kompyuterimdagi PostgreSQL bo\'ladimi?»', 'Ha, DATABASE_URL ni o\'zgartirasiz; botni hostingga chiqarganda baza internetda bo\'lishi kerak.'],
  ['«Ikki kishi bir vaqtda yozsa, ismlar aralashadimi?»', 'Yo\'q, har qator telegram_id bo\'yicha alohida.'],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S26 = mkS(26, [{ on: [] }, { on: [0, 1] }, { on: [2, 3] }, { on: [0, 1, 2, 3], qa: true }]);
function Screen26(p) {
  return <Lesson p={p} S={S26} scene={({ seg }) => <>
    <div className="pg-2c">{CARDS26.map(([h, x, y], i) => <Card key={h} c={i < 2 ? T.blue : T.accent} h={`${i + 1} · ${h}`} hl={seg.on.includes(i) && !seg.qa} dim={seg.on.length > 0 && !seg.on.includes(i)}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>
    {seg.qa && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA26} /></>}
  </>} />;
}

// ============================================================
//  27 · O'z-sinov — 8 savol (MD 27, FINAL)
// ============================================================
const FINAL = MDT[27].final;
function Screen27(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: xotira va restart, bosqichlar, migratsiya, big int, on conflict, qulf va tranzaksiya. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi AI bilan bot yozganda, nimani tekshirishni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  28 · Yakun (M13, M14, M30) — xulosa 6 band, uyga vazifa 5 qadam, eslatma
// ============================================================
const SUM28 = [
  { k: 'mem', t: "Xotiradagi ma'lumot (Map, massiv) restartda yo'qoladi yoki koddagi boshlang'ich qiymatga qaytadi; saqlanishi kerak bo'lgan har narsa — bazada", st: ['bot', 'pg'] },
  { k: 'ai', t: "AI bilan ish: bitta prompt — bitta bosqich; prompt besh qismli (kontekst · maqsad · shartlar · chegara · javob); javob uch qismdan o'qiladi (fayllar · chetga chiqish · tekshiruv)", st: ['ai'] },
  { k: 'orm', t: "TypeORM: entity tasvirlaydi, migratsiya yaratadi, migrations jadvali eslaydi; synchronize: false; o'zgarish — yangi migratsiya", st: ['orm', 'pg'] },
  { k: 'id', t: "Telegram id — BIGINT, kodga matn bo'lib keladi; takror qator — UNIQUE + ON CONFLICT; state bazada — suhbat o'rtasidagi restartdan o'tadi", st: ['bot', 'orm', 'pg'] },
  { k: 'tx', t: "Buyurtma — bitta tranzaksiya; qoldiq qulf bilan o'qiladi yoki bitta UPDATE … WHERE stock >= qty; tranzaksiyada xatodan keyin faqat ROLLBACK", st: ['orm', 'pg'] },
  { k: 'chk', t: "Besh tekshiruv har bosqichda: diff · build · restart · psql · ko'p mijoz (npm run smoke). Sinf: m5-04 — \\d users, ikki marta /start, restart ism so'ralganda", st: ['ai', 'bot', 'pg'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap); har band rasmning o'z qismini yoritadi
const MAP28 = {
  mem: { restart: true, on: ['mem', 'products', 'users', 'carts', 'orders'], chat: ['/cart', "Savat bo'sh. /catalog dan mahsulot tanlang.", 'bad'] },
  ai: { loc: DB_ALL, badge: STAGE_NO, on: ['db', 'products', 'users', 'carts', 'orders'] },
  orm: { loc: DB_ALL, on: ['db', 'products', 'users', 'carts', 'orders'] },
  id: { loc: DB_ALL, on: ['user', 'users', 'carts'], note: { users: 'BIGINT · state bazada' } },
  tx: { loc: DB_ALL, tx: 'commit', ops: { products: 'UPDATE', orders: 'INSERT', carts: 'DELETE' }, on: ['order', 'products', 'orders', 'carts'] },
  chk: { loc: DB_ALL, clients: 5, on: ['phone', 'order', 'products'], note: { products: 'Planshet · sotildi 1 / 0' } },
};
function SummaryMap28({ hl }) {
  const m = MAP28[hl] || { loc: DB_ALL, chat: CHAT_ORDER };
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap {...m} max={0.95} tag={t("Bugungi dars — botdan bazagacha, AI bilan", "Сегодняшний урок — от бота до базы, с AI")} />
  </div>;
}
const HOMEWORK28 = [
  { t: "O'z nusxangiz — GitHub'da yangi repo, OrderBotNest'ni unga chiqaring (tgpg-done yoki o'z 4-bosqichingiz)", c: ['git remote set-url origin <sizning repo>', 'git push -u origin main'] },
  { t: "/report — faqat admin: bugungi buyurtmalar soni va summasi (CANCELLED hisobga olinmaydi), order_items bo'yicha top-3 (JOIN, GROUP BY, SUM). O'sha SQL'ni psql'da o'zingiz yozib, natijani bot javobi bilan solishtiring", c: [] },
  { t: "Ogohlantirish — COMMIT'dan keyin qoldiq 2 dan kam bo'lgan mahsulot haqida adminga xabar; tranzaksiya ichida Telegram'ga so'rov yuborilmasin", c: [] },
  { t: "Besh tekshiruv — diff · build · restart · psql · ko'p mijoz", c: ['npm run smoke'] },
  { t: "README «AI bilan ish»: har bosqich prompti, AI chetga chiqqan joylar, tekshiruv topgan xatolar → git push → repo linki platformadagi uyga vazifaga", c: ['git add -A && git commit -m "report + ogohlantirish"', 'git push'] },
];
const CHEATSHEET28 = `# Telegraf + PostgreSQL — mentor eslatmasi (OrderBotNest, AI bilan)
## Loyiha
git clone https://github.com/Azizbekcrypto/OrderBotNest.git · git checkout tgpg-start (xotirada) → tgpg-done (bazada) · npm run smoke [-- restart | race]
## To'rt bosqich — bitta prompt, bitta bosqich
1 ulanish + katalog (TypeORM, migratsiya, products, seed) · 2 users + state (BIGINT, WAITING_PHONE) · 3 savat (UNIQUE, ON CONFLICT) · 4 buyurtma (tranzaksiya, qulf, bekor → ombor)
## Besh qismli prompt
kontekst (loyiha nima, hozir qanday) · bitta bosqich maqsadi · qat'iy shartlar (har biri tekshiriladi) · nimaga tegmaslik · javobda nima (fayllar + tekshirish)
## AI javobini o'qish
fayllar ro'yxati = git diff --stat · «chetga chiqdim» qismi va sababi · tekshirish buyruqlarini o'zingiz yurgizing — «sinadim» isbot emas
## TypeORM
entity tasvirlaydi · migratsiya yaratadi · migrations jadvali eslaydi · synchronize: false · migrationsRun: true · o'zgarish — yangi migratsiya
## Tuzoqlar (hammasi haqiqiy yurgizishdan)
oraliq vaziyat: buyurtma xotirada, ombor bazada → restartdan keyin buyurtma yo'q, ombor kamaygan
Telegram id > 2 147 483 647 → BIGINT; node-pg va TypeORM BIGINT'ni matn qaytaradi: "5123456789" === 5123456789 → false (Mongoose'da number)
INTEGER ustun → value "5123456789" is out of range for type integer, bot «Tushunmadim»
avval SELECT, keyin INSERT — UNIQUE'siz 19/20 urinishda 2 qator → UNIQUE + INSERT … ON CONFLICT DO UPDATE (Mongoose upsert ham unique index'siz 2 hujjat)
qulfsiz findOneBy → save: 1 ta Planshet 5 kishiga sotildi, CHECK xato bermaydi (0 manfiy emas) → lock: pessimistic_write yoki UPDATE … WHERE stock >= qty
tranzaksiyada CHECK xatosidan keyin so'rov → current transaction is aborted → tekshiruv UPDATE'dan oldin; CHECK — oxirgi qo'riqchi
ikki marta bir vaqtda «Bekor» → ombor 2 marta qaytdi → buyurtma qatori FOR UPDATE
## Besh tekshiruv
diff · build (tsc, nest build) · restart suhbat o'rtasida · psql (\\d, CHECK, bigint, SELECT) · ko'p mijoz (npm run smoke -- race)
## Xatolar
BOT_TOKEN topilmadi → .env · DATABASE_URL topilmadi → .env · Unable to connect … database "shop" does not exist → CREATE DATABASE shop · password authentication failed → parol · Telegram ulanmadi: 401 → token (server ishlayveradi) · 409 Conflict → ikkinchi nusxa (sinalmagan)
## Sinfga tayyorgarlik (m5-04, 20 ekran)
TelegramBotNest dars-03-done → dars-04-done · Neon (sslmode=require) · Antigravity 3 qatorli prompt · synchronize: true · siz qo'shasiz: \\d users (bigint), ikki marta /start, restart ism so'ralganda, git diff --stat
## Sizning uyga vazifangiz (60–90 daqiqa)
/report (JOIN + GROUP BY + SUM, CANCELLED'siz) + kam qoldiq ogohlantirishi (COMMIT'dan keyin) + besh tekshiruv + README «AI bilan ish» → GitHub → repo linki platformaga`;
const s28Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Xotiradagi ma'lumot <b>restartda yo'qoladi</b> — saqlanishi kerak bo'lgan har narsa bazada", "Birinchi: Map va massiv jarayon xotirasida, restartda yo'qoladi yoki koddagi boshlang'ich qiymatga qaytadi. Saqlanishi kerak bo'lgan har narsa bazada turadi.", { hl: 'mem' }),
  sg('b2', "AI bilan: <b>bitta prompt — bitta bosqich</b>; prompt besh qismli, javob uch qismdan o'qiladi", "Ikkinchi: AI bilan ishda bitta prompt, bitta bosqich. Prompt besh qismli: kontekst, maqsad, shartlar, chegara va javob. AI javobini uch qismdan o'qiysiz: fayllar, chetga chiqish va tekshiruv.", { hl: 'ai' }),
  sg('b3', "TypeORM: <b>entity, migratsiya, migrations jadvali</b>; o'zgarish — yangi migratsiya", "Uchinchi: entity jadvalni tasvirlaydi, migratsiya uni yaratadi, migrations jadvali qaysi fayl yurganini eslaydi. Jadvalni o'zgartirish uchun yangi migratsiya yoziladi.", { hl: 'orm' }),
  sg('b4', "Telegram id — <b>BIGINT, kodga matn</b>; takror qator — UNIQUE va ON CONFLICT; state bazada", "To'rtinchi: Telegram id big int, va u kodga matn bo'lib keladi. Takror qatorga qarshi UNIQUE va on conflict. State bazada bo'lsa, suhbat o'rtasidagi restartdan o'tadi.", { hl: 'id' }),
  sg('b5', "Buyurtma — <b>bitta tranzaksiya va qulf</b>; xatodan keyin faqat ROLLBACK", "Beshinchi: buyurtma bitta tranzaksiya. Qoldiq qulf bilan o'qiladi yoki bitta update where stock katta yoki teng qty bilan ayiriladi. Tranzaksiyada xatodan keyin faqat rollback qoladi.", { hl: 'tx' }),
  sg('b6', "<b>Besh tekshiruv</b> har bosqichda; sinfda — <b>\\d users</b>, ikki marta /start, restart", "Oltinchi: har bosqichda besh tekshiruv: diff, build, restart, PostgreSQL terminali va ko'p mijoz. Sinfda o'quvchi bilan backslash d users, ikki marta start va restartni ism so'ralganda qiling.", { hl: 'chk' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z nusxangizda admin uchun /report va kam qoldiq ogohlantirishi", "Uyga vazifa: OrderBotNest'ning o'z nusxangizga admin uchun ikki imkoniyat qo'shing, AI bilan, ikki bosqichda. Birinchisi report buyrug'i: bugungi buyurtmalar soni, summasi va eng ko'p sotilgan uchta mahsulot. Ikkinchisi: qoldiq ikkitadan kam qolsa, adminga ogohlantirish.", { hl: 'hw' }),
  sg('hw2', "Har bosqichdan keyin <b>besh tekshiruv</b>; README'da AI tahlili; repo linki platformaga", "Har bosqichdan keyin besh tekshiruvni qiling. README'ga AI nimani to'g'ri, nimani noto'g'ri qilgani va siz uni qanday ushlaganingizni yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying. Oltmish-to'qson daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: bosqichlar, prompt, tuzoqlar va tekshiruvlar — bir sahifada", "Pastda bir sahifalik eslatma: to'rt bosqich, prompt qolipi, AI javobini o'qish, tuzoqlar, besh tekshiruv, xatolar va sinfga tayyorgarlik. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET28, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('telegraf-postgresql-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s28Segments(passed), [passed]);
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
            <SummaryMap28 hl={hl} />
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM28.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 60–90 daqiqa', 'Домашнее задание · 60–90 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK28.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" /report raqamlari psql bilan mos · CANCELLED chiqarilgan · ogohlantirish tranzaksiyadan keyin · README'da AI tahlili (kamida bitta topilma).", " числа /report совпадают с psql · CANCELLED исключён · предупреждение после транзакции · в README разбор AI (хотя бы одна находка).")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Kursdagi keyingi mentor darsi", "Следующий урок курса для менторов")}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("Jest: OrderBotNest'ga birinchi testlar", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Yozamiz, buzamiz va AI yozgan testni tekshiramiz", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · Telegraf + PostgreSQL", "Курс для менторов · Telegraf + PostgreSQL")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["tayyor botning ma'lumotini AI bilan PostgreSQL'ga to'rt bosqichda ko'chirasiz", "har bosqichni o'zingiz tekshirasiz: diff, build, restart, psql va ko'p mijoz", "buyurtmani tranzaksiyada yozasiz va bitta mahsulot ikki kishiga sotilmasligini isbotlaysiz"], ["перенесёте данные готового бота в PostgreSQL с AI за четыре этапа", 'сами проверите каждый этап: diff, build, restart, psql и много клиентов', 'запишете заказ в транзакции и докажете, что один товар не продаётся двоим']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 40 daqiqa – 2 soat, 12-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: PostgreSQL ishlab turgan, Node.js 20+, VS Code, AI yordamchi, BotFather'da sinov boti · Loyiha: github.com/Azizbekcrypto/OrderBotNest (tgpg-start)", "Урок со звуком · 1 ч 40 мин – 2 ч, после 12-го экрана можно сделать перерыв · Нужно: работающий PostgreSQL, Node.js 20+, VS Code, AI-помощник, тестовый бот в BotFather · Проект: github.com/Azizbekcrypto/OrderBotNest (tgpg-start)")}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} chat={CHAT_ORDER} note={{ orders: '#1 · 220000 · CONFIRMED' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, ScreenP5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, Screen21, Screen22, ScreenP23, Screen24, ScreenAI5, Screen25, Screen26, Screen27, Screen28]; // F-1125-01: ScreenAI5 (Tekshiruv 5) — saytda 25-ekran; MD 25–28 saytda 26–29 (M57)
const PRACTICE_COUNT = [ScreenP5, ScreenP12, ScreenP17, ScreenP23].filter((S) => SCREENS.includes(S)).length; // 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi
export default function TgPgMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/tgpg-*.json, ru/tgpg-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/tgpg-sahna.js) ---
// TgPg · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
// Bot xabarlari (b) va tugmalar — OrderBotNest ning haqiqiy matni, o'zgarmaydi; faqat izoh qatorlari (sep) tarjima qilinadi.
var RU_S = {
  S1: { plan: ['Проект и проблема', 'План и промпт', 'Подключение и каталог', 'Пользователь, state, корзина', 'Заказ и транзакция', 'Подготовка к классу'] },
};
ru(SVC2, [[null, 'товары и склад', null], [null, 'пользователь, роль, state', null], [null, 'корзина', null], [null, 'заказ, статус админа', null]]);
ru(FLOW2, [null, null, null, null, null, null, null, null, null, [null, 'админ Жасур'], null, null, null]);
ru(FLOW3B, [[null, 'сервер перезапустился'], null, null, null, null, [null, 'перезапуск в момент запроса телефона'], null, null]);
ru(PROMPT1, [
  [null, 'Это проект NestJS + Telegraf (Telegram-бот заказов). Сейчас каталог, корзина, пользователи и заказы в памяти (Map и array) — при перезапуске сервера всё пропадает. Переносим их в PostgreSQL поэтапно.\n\n'],
  [null, 'Этап 1 — только подключение к базе и каталог:\n'],
  [null, '- Подключи TypeORM (@nestjs/typeorm, pg). Адрес — из DATABASE_URL в .env, читать через src/config/index.ts.\n- Не используй synchronize: таблицы создаются миграциями, при подъёме сервера незапущенная миграция запускается сама.\n- Таблица products: id, name (уникальное), price, stock; stock не может быть отрицательным — CHECK в базе.\n- Seed-скрипт (npm run seed): добавляет текущие 6 товаров, при втором запуске не добавляет повторно.\n- CatalogService читает из базы, пагинация остаётся (по 2).\n'],
  [null, '- Сервисы user, корзины и заказа пока не трогай.\n\n'],
  [null, 'В ответе: какие файлы изменились, как запустить и что проверить в psql.'],
]);
ru(FLOW11B, [[null, 'сервер перезапустился'], null, null]);
ru(FLOW15, [null, null, [null, 'сервер перезапустился'], null, null]);
ru(CHK24, [[null, null, 'объём = запрошенный этап (1145 строк — нет)'], null, [null, 'перезапуск', 'посреди разговора · smoke restart'], null, [null, 'много клиентов', 'smoke race · отмена дважды']]);
ru(FOUND24, ['сделал работу, о которой не просили (22 файла)', 'не заметил промежуточного состояния', 'в проверке ушёл один запрос в Telegram (401)', 'в нашем коде: дважды «Bekor» → склад 2']);
ru(ADD25, [[null, 'практика, после того как AI написал'], ['/start дважды — SELECT count(*)', 'практика, проверка в Telegram'], ['перезапуск, когда спрошено имя', 'конец практики'], ['sslmode=require не удалять', 'шаг Neon'], ['файлы AI — git diff --stat', 'шаг Antigravity']]);
ru(CARDS26, [
  ['Бот не отвечает', 'Telegram ulanmadi: 401: Unauthorized (сервер «работает»)', 'токен — BotFather'],
  ['Сервер не запускается', null, '.env'],
  ['После перезапуска имя забыто', 'ошибки нет, «Salom! Ismingiz nima?»', 'state не пишется в базу — SELECT … FROM users'],
  ['Большой id', 'value "5123456789" is out of range for type integer · или duplicate key', 'bigint; сначала поиск или ON CONFLICT'],
]);
ru(QA26, [
  ['«AI написал, работает — зачем ещё проверять?»', 'Есть ошибки, которые не видны в одной проверке: перезапуск и двойное нажатие (экраны 11, 14).'],
  ['«Почему synchronize: true — и в рабочем проекте так же?»', 'Нет: он может без предупреждения удалить колонку; в рабочем проекте — миграции (экран 9).'],
  ['«Telegram id же число, почему из базы пришла строка?»', 'bigint может быть больше числа JavaScript, библиотека отдаёт строку (экран 13).'],
  ['«Можно вместо Neon PostgreSQL на своём компьютере?»', 'Да, меняете DATABASE_URL; когда выпускаете бота на хостинг, база должна быть в интернете.'],
  ['«Если двое напишут одновременно, имена перепутаются?»', 'Нет, каждая строка отдельно по telegram_id.'],
]);
ru(SUM28, [
  { t: 'Данные в памяти (Map, массив) при перезапуске пропадают или возвращаются к начальному значению из кода; всё, что должно сохраняться, — в базе' },
  { t: 'Работа с AI: один промпт — один этап; промпт из пяти частей (контекст · цель · условия · граница · ответ); ответ читается в трёх частях (файлы · выход за рамки · проверка)' },
  { t: 'TypeORM: entity описывает, миграция создаёт, таблица migrations помнит; synchronize: false; изменение — новая миграция' },
  { t: 'Telegram id — BIGINT, приходит в код строкой; повторная строка — UNIQUE + ON CONFLICT; state в базе — переживает перезапуск посреди разговора' },
  { t: 'Заказ — одна транзакция; остаток читается с блокировкой или вычитается одним UPDATE … WHERE stock >= qty; после ошибки в транзакции — только ROLLBACK' },
  { t: 'Пять проверок на каждом этапе: diff · build · перезапуск · psql · много клиентов (npm run smoke). Класс: m5-04 — \\d users, дважды /start, перезапуск, когда спрошено имя' },
]);
ru(HOMEWORK28, [
  { t: 'Своя копия — новый репозиторий на GitHub, выложите в него OrderBotNest (tgpg-done или ваш 4-й этап)' },
  { t: '/report — только для админа: число и сумма заказов за сегодня (CANCELLED не считается), топ-3 по order_items (JOIN, GROUP BY, SUM). Тот же SQL напишите сами в psql и сравните с ответом бота' },
  { t: 'Предупреждение — после COMMIT сообщение админу о товаре с остатком меньше 2; внутри транзакции запрос в Telegram не отправлять' },
  { t: 'Пять проверок — diff · build · перезапуск · psql · много клиентов' },
  { t: 'README «Работа с AI»: промпт каждого этапа, где AI вышел за рамки, какие ошибки нашла проверка → git push → ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.SPOKEN = [['бэкслеша ', 'backslash '], ['Бэкслеш ', 'Backslash '], ['бэкслеш ', 'backslash ']];  // F-1109-01: ruscha ovoz → «Matn»da `\d products` kabi kod
RU_S.TITLE = 'Бот заказов: переносим в базу вместе с AI';
RU_S.COVER = ['Всего около 1 часа 40 минут – 2 часов: озвучка ~27 минут · четыре практики с AI 70–90 минут · 5 проверок · самопроверка 8 вопросов. После экрана 12 можно сделать перерыв', 'Нужно: видеоуроки по Telegraf · PostgreSQL-1 и PostgreSQL-2 · уроки для менторов по NestJS · работающий PostgreSQL · Node.js 20+ · VS Code · AI-помощник (Antigravity, Claude Code, Codex или Copilot) · тестовый бот в BotFather', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с tgpg-start'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: память и перезапуск, этапы, миграция, big int, on conflict, блокировка и транзакция. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, когда ученик пишет бота с AI, вы знаете, что проверять.';
RU_S.NEXT_T = 'Jest: первые тесты для OrderBotNest';
RU_S.NEXT_D = 'Пишем, ломаем и проверяем тест, написанный AI';
RU_S.FILE = 'telegraf-postgresql-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['Данные в памяти <b>пропадают при перезапуске</b> — всё, что должно сохраняться, в базе', 'Первое: Map и массив — в памяти процесса, при перезапуске пропадают или возвращаются к начальному значению из кода. Всё, что должно сохраняться, лежит в базе.'],
  b2: ['С AI: <b>один промпт — один этап</b>; промпт из пяти частей, ответ читается в трёх', 'Второе: в работе с AI один промпт — один этап. Промпт из пяти частей: контекст, цель, условия, граница и ответ. Ответ AI читаете в трёх частях: файлы, выход за рамки и проверка.'],
  b3: ['TypeORM: <b>entity, миграция, таблица migrations</b>; изменение — новая миграция', 'Третье: entity описывает таблицу, миграция её создаёт, таблица migrations помнит, какой файл запускался. Чтобы изменить таблицу, пишется новая миграция.'],
  b4: ['Telegram id — <b>BIGINT, в коде строка</b>; повторная строка — UNIQUE и ON CONFLICT; state в базе', 'Четвёртое: Telegram id — big int, и в код он приходит строкой. Против повторной строки — UNIQUE и on conflict. Если state в базе, он переживает перезапуск посреди разговора.'],
  b5: ['Заказ — <b>одна транзакция и блокировка</b>; после ошибки только ROLLBACK', 'Пятое: заказ — одна транзакция. Остаток читается с блокировкой или вычитается одним update where stock больше или равно qty. После ошибки в транзакции остаётся только rollback.'],
  b6: ['<b>Пять проверок</b> на каждом этапе; в классе — <b>\\d users</b>, дважды /start, перезапуск', 'Шестое: на каждом этапе пять проверок: diff, build, перезапуск, терминал PostgreSQL и много клиентов. В классе сделайте с учеником бэкслеш d users, start дважды и перезапуск, когда спрошено имя.'],
  hw: ['<b>Домашнее задание</b>: в своей копии /report для админа и предупреждение о малом остатке', 'Домашнее задание: добавьте в свою копию OrderBotNest две возможности для админа, с AI, в два этапа. Первая — команда report: число и сумма заказов за сегодня и три самых продаваемых товара. Вторая: если остаток меньше двух, предупреждение админу.'],
  hw2: ['После каждого этапа <b>пять проверок</b>; разбор AI в README; ссылка на репозиторий — на платформу', 'После каждого этапа сделайте пять проверок. В README напишите, что AI сделал правильно, что неправильно и как вы это поймали. Выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе. Шестьдесят–девяносто минут.'],
  c: ['<b>Возьмите памятку</b>: этапы, промпт, ловушки и проверки — на одной странице', 'Внизу памятка на одну страницу: четыре этапа, шаблон промпта, чтение ответа AI, ловушки, пять проверок, ошибки и подготовка к классу. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# Telegraf + PostgreSQL — памятка ментора (OrderBotNest, с AI)
## Проект
git clone https://github.com/Azizbekcrypto/OrderBotNest.git · git checkout tgpg-start (в памяти) → tgpg-done (в базе) · npm run smoke [-- restart | race]
## Четыре этапа — один промпт, один этап
1 подключение + каталог (TypeORM, миграция, products, seed) · 2 users + state (BIGINT, WAITING_PHONE) · 3 корзина (UNIQUE, ON CONFLICT) · 4 заказ (транзакция, блокировка, отмена → склад)
## Промпт из пяти частей
контекст (что за проект, как сейчас) · цель одного этапа · строгие условия (каждое проверяется) · что не трогать · что в ответе (файлы + проверка)
## Чтение ответа AI
список файлов = git diff --stat · часть «вышел за рамки» и её причина · команды проверки запускайте сами — «я проверил» не доказательство
## TypeORM
entity описывает · миграция создаёт · таблица migrations помнит · synchronize: false · migrationsRun: true · изменение — новая миграция
## Ловушки (все из настоящих запусков)
промежуточное состояние: заказ в памяти, склад в базе → после перезапуска заказа нет, а склад уменьшен
Telegram id > 2 147 483 647 → BIGINT; node-pg и TypeORM возвращают BIGINT строкой: "5123456789" === 5123456789 → false (в Mongoose number)
колонка INTEGER → value "5123456789" is out of range for type integer, бот «Tushunmadim»
сначала SELECT, потом INSERT — без UNIQUE в 19/20 попыток 2 строки → UNIQUE + INSERT … ON CONFLICT DO UPDATE (upsert Mongoose без unique index тоже 2 документа)
findOneBy без блокировки → save: 1 планшет продан пятерым, CHECK молчит (0 не отрицательное) → lock: pessimistic_write или UPDATE … WHERE stock >= qty
запрос после ошибки CHECK в транзакции → current transaction is aborted → проверка до UPDATE; CHECK — последний сторож
дважды одновременно «Bekor» → склад вернулся дважды → строка заказа FOR UPDATE
## Пять проверок
diff · build (tsc, nest build) · перезапуск посреди разговора · psql (\\d, CHECK, bigint, SELECT) · много клиентов (npm run smoke -- race)
## Ошибки
BOT_TOKEN topilmadi → .env · DATABASE_URL topilmadi → .env · Unable to connect … database "shop" does not exist → CREATE DATABASE shop · password authentication failed → пароль · Telegram ulanmadi: 401 → токен (сервер продолжает работать) · 409 Conflict → вторая копия (не проверено)
## Подготовка к классу (m5-04, 20 экранов)
TelegramBotNest dars-03-done → dars-04-done · Neon (sslmode=require) · промпт Antigravity из 3 строк · synchronize: true · вы добавляете: \\d users (bigint), дважды /start, перезапуск, когда спрошено имя, git diff --stat
## Ваше домашнее задание (60–90 минут)
/report (JOIN + GROUP BY + SUM, без CANCELLED) + предупреждение о малом остатке (после COMMIT) + пять проверок + README «Работа с AI» → GitHub → ссылка на репозиторий на платформу`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxatlari. Bot xabarlari — haqiqiy chiqish, o'zgarmaydi; faqat 'sep' izohlari
ru(FLOW3A, [[null, '1-й процесс']]);
ru(FLOW11A, [[null, 'после 1-го этапа']]);
ru(FLOW15B, [[null, 'после 2-го этапа (корзина ещё в памяти)']]);
ru(FLOW19, [[null, 'на складе 1 Planshet'], null, null, null, [null, 'склад 0 · корзина Бобура сохранена']]);

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · Telegraf + PostgreSQL",
  "title": "Есть готовый бот заказов. Переносим его с AI на PostgreSQL — поэтапно и проверяя каждый шаг",
  "seg": {
   "a": [
    "Писать бота на Telegraf вы умеете — сегодня <b>храним данные бота в PostgreSQL</b>",
    "Здравствуйте. Как писать бота на Telegraf, команды и inline-кнопки вы видели в видеоуроках. Сегодня следующий шаг: храним данные бота в PostgreSQL. Тогда даже при перезапуске сервера корзина, заказ и номер телефона не пропадут."
   ],
   "b": [
    "Проект готов: <b>каталог, корзина, заказ и админ</b> — на Nest и Telegraf",
    "Проект не пишется с нуля. На GitHub есть готовый бот заказов: каталог, корзина, заказ и панель админа, на NestJS и Telegraf. Он полностью работает, только все данные лежат в памяти. Вы сделаете clone и своими глазами увидите его недостаток."
   ],
   "c": [
    "Код пишет AI, а вы <b>управляете по этапам и проверяете каждый этап</b>",
    "Код пишет AI: Antigravity, Claude Code, Codex или Copilot, какой угодно. Ваша работа — управлять: делите задачу на четыре этапа, пишете на каждый промпт и сами проверяете результат. Мы действительно сделали это с двумя разными AI, ответы на экране — из этих запусков."
   ],
   "d": [
    "Шесть этапов, четыре практики; в конце <b>два экрана подготовки к классу</b>. Не спешите",
    "Урок состоит из шести этапов, в четырёх практиках вы работаете с AI сами. Последние два экрана — подготовка к классу: карта урока ученика и места, где ученики ошибаются. Не спешите: каждый экран можно прослушать с начала, урок запоминает, где вы остановились. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · проект и проблема",
  "title": "Проект состоит из пяти модулей: telegram, catalog, user, cart и order",
  "seg": {
   "a": [
    "Команды бота в одном файле: <b><code>telegram.service.ts</code> — знакомые вам handler Telegraf</b>",
    "Открываем проект в Explorer. Команды бота — в одном файле: telegram service. Внутри знакомые вам handler Telegraf: bot start, bot command catalog и bot action. Кнопки — в файле keyboards, тексты бота — в файле texts."
   ],
   "b": [
    "Логика в четырёх Service: <b>каталог, пользователь, корзина и заказ</b> — каждый в своём модуле",
    "Handler сами логику не пишут, они передают её в Service. В проекте четыре Service: catalog управляет товарами и складом, user — пользователем и его state, cart — корзиной, order — заказом. Каждый в своём модуле, Nest inject-ит их в telegram service."
   ],
   "c": [
    "Путь клиента: <b>каталог → корзина → телефон → заказ</b>, потом админ подтверждает",
    "Посмотрим путь клиента. Азиза открывает каталог, товары по два на странице. Нажимает кнопку и кладёт в корзину, оформляет заказ, бот спрашивает телефон. Когда пришёл номер, создаётся заказ и уходит сообщение админу. Админ Жасур подтверждает заказ, Азизе приходит сообщение."
   ],
   "d": [
    "Итог: бот полностью работает, но <b>все данные в <code>Map</code> и массиве</b>",
    "Итог: бот полностью работает, роль админа тоже есть. Но если открыть Service, пользователи лежат в Map, корзины в Map, заказы — в обычном массиве. Где живут эти данные, посмотрим на следующем экране."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · внутри",
  "title": "Map живёт в памяти процесса Node: остановился процесс — пропал и он",
  "seg": {
   "a": [
    "В 1-м процессе всё есть: <b>заказ #1, в корзине мышка, телефон Азизы</b>",
    "В первом процессе бот работает. Азиза сделала заказ, номер один, итого двести двадцать тысяч сум. Админ его подтвердил. Потом Азиза положила в корзину ещё мышку. Её телефон тоже сохранён в боте."
   ],
   "b": [
    "Сервер перезапустился: <b>корзина пуста, заказа нет</b>, телефон снова спрашивают",
    "Теперь останавливаем сервер и запускаем снова. Азиза открывает корзину: корзина пуста. Админ смотрит заказы: заказов пока нет. Номер телефона тоже пропал, при следующем заказе бот снова его спросит. Сообщения об ошибке не было, данных просто нет."
   ],
   "c": [
    "Причина: <code>Map</code> — <b>объект в памяти процесса</b>; рождается и умирает вместе с процессом",
    "Причина простая. Map — объект в оперативной памяти процесса Node. При запуске процесса он создаётся пустым, при остановке память освобождается. Хостинг перезапускает сервер при каждом deploy, то есть у настоящего бота это бывает несколько раз в день."
   ],
   "d": [
    "Итог: <b>всё, что должно сохраняться, — в базу</b> — список из пяти данных",
    "Итог: всё, что должно остаться после перезапуска, должно быть в базе. В боте таких данных пять: товар и склад, пользователь и его роль, телефон и state, корзина, заказ. Сегодня переносим эти пять в PostgreSQL."
   ]
  }
 },
 "4": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 5",
  "title": "Каталог — массив в коде, число на складе тоже в этом массиве. Сколько мишек останется после перезапуска?",
  "q": "Вы видели память, теперь проверим. Первая проверка. Каталог — массив, написанный в коде, число на складе тоже в этом массиве. Азиза взяла двух мишек, осталось восемь. Если сервер перезапустится, сколько мишек будет на складе? Выберите вариант.",
  "ok": "Верно. Массив написан в коде, при запуске процесса он снова создаётся со значением из кода: десять. То есть перезапуск стёр заказ и вернул склад к десяти. Оба согласованы между собой, только неверны. Значит, данные в памяти при каждом перезапуске возвращаются к начальному значению из кода.",
  "okShort": "Массив создаётся заново из кода — <code>stock: 10</code>. Заказ пропал, склад тоже вернулся.",
  "hint": "Где написан массив — в коде или в базе? Какое значение даёт ему код при запуске процесса?",
  "demak": "данные в памяти при каждом перезапуске возвращаются к начальному значению из кода.",
  "opts": [
   "8 — сервер помнит последнее значение",
   "10 — массив создаётся заново из кода",
   "0 — RAM очищается, массив тоже пустой",
   "Сервер даст ошибку — склад не синхронен"
  ],
  "wrong": {
   "0": "Чтобы помнить, нужен диск; Map и массив — только в RAM.",
   "2": "Память очищается, но массив написан в коде — он создаётся заново.",
   "3": "Перезапуск — не ошибка: сервер поднимается как обычно."
  }
 },
 "5": {
  "kicker": "Практика 1 / 4",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Запустите проект на своём компьютере и посмотрите, что пропадает при перезапуске",
  "seg": {
   "a": [
    "Теперь вы: делаете clone проекта и запускаете <b>с токеном своего бота</b>",
    "Теперь ваша очередь. Делаете clone проекта и запускаете со своим ботом. Для токена откройте в BotFather новый тестовый бот, как в видеоуроке. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: clone, тег <code>tgpg-start</code>, <code>npm install</code>, <code>.env</code> — <b>токен и ваш id</b>",
    "На первом шаге делаете clone репозитория, переходите на тег tgpg start и делаете npm install. На втором создаёте env-файл из env example: bot token и ваш id в Telegram для админа. Id берёте у userinfobot."
   ],
   "c": [
    "Шаги 3–4: поток бота, потом перезапуск; подтверждение — <b>ответ на <code>/cart</code> после перезапуска</b>",
    "На третьем шаге в Telegram проверяете start, catalog, два товара и заказ, как админ смотрите orders. На четвёртом кладёте товар в корзину, останавливаете сервер через Ctrl C и запускаете снова. В поле подтверждения напишите ответ на команду cart."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики проект работает на вашем компьютере, и вы сами видели, какие данные пропадают при перезапуске."
   ]
  },
  "steps": [
   {
    "t": "Clone",
    "exp": "added … packages"
   },
   {
    "t": ".env — впишите BOT_TOKEN (BotFather) и ADMIN_TELEGRAM_IDS (@userinfobot), потом запустите",
    "exp": "Server 3000-portda ishlayapti · Telegram bot ulandi"
   },
   {
    "t": "Поток бота — в Telegram: /start → /catalog → ▶ → товар → /cart → «✅ Buyurtma berish» → телефон → /orders",
    "exp": "«Buyurtma #1 qabul qilindi!» · кнопки админа"
   },
   {
    "t": "Перезапуск — положите товар в корзину, остановите сервер и включите снова, в Telegram /cart и /orders",
    "exp": "«Savat bo'sh…» · «Hozircha buyurtma yo'q.» · NATIJA: 0/3"
   }
  ],
  "proof": {
   "label": "Ответ на /cart после перезапуска",
   "placeholder": "скопируйте ответ бота",
   "wrong": "Открывали ли корзину после перезапуска? Проверьте, что сервер остановлен через Ctrl+C и запущен снова."
  },
  "trouble": [
   [
    "BOT_TOKEN topilmadi",
    "нет .env или он пустой — cp .env.example .env, впишите токен"
   ],
   [
    "Server … ishlayapti и Telegram ulanmadi: 401: Unauthorized",
    "неверный токен; сервер работает, бот не отвечает — получите заново в BotFather"
   ],
   [
    "409: Conflict: terminated by other getUpdates request",
    "с этим токеном работает вторая копия — остановите старый терминал (⚠ из документации Telegram, не проверено — нужен настоящий токен)"
   ],
   [
    "/orders → «faqat admin uchun»",
    "в ADMIN_TELEGRAM_IDS другой id — впишите число из @userinfobot"
   ],
   [
    "EADDRINUSE :::3000",
    "порт занят — старый сервер; Ctrl+C или в .env PORT=3001"
   ]
  ]
 },
 "6": {
  "kicker": "Этап 2 · план и промпт",
  "title": "Пять данных — четыре этапа: после каждого проверка и commit",
  "seg": {
   "a": [
    "Делим работу на <b>четыре этапа</b>: подключение и каталог, пользователь, корзина, заказ",
    "Пять данных не переносим разом. Делим работу на четыре этапа: сначала подключение к базе и каталог, потом пользователь и его state, потом корзина, в конце заказ и транзакция. Порядок — по зависимостям: корзина опирается на пользователя и товар, заказ — на всё."
   ],
   "b": [
    "После каждого этапа: <b>build, перезапуск, psql — потом commit</b>",
    "После каждого этапа останавливаемся и проверяем: собирается ли проект, что остаётся после перезапуска, какая таблица в терминале PostgreSQL. Если всё верно — делаем commit. Если следующий этап ошибётся, вернуться к последнему рабочему месту будет легко."
   ],
   "c": [
    "По промпту в одно предложение AI <b>изменил 1145 строк разом</b> — это не проверить",
    "Почему по этапам? Мы проверили. Дали AI промпт в одно предложение: перенеси каталог в PostgreSQL. Он перенёс не только каталог, а всё: двадцать два файла, тысяча сто сорок пять новых строк. Код заработал, но такое изменение ментор не сможет прочитать, а если будет ошибка — не найдёт, где она."
   ],
   "d": [
    "Итог: <b>один промпт — один этап</b>, пока не проверили результат — к следующему не переходим",
    "Итог: один промпт — один этап. Если этап маленький, вы читаете ответ AI, смотрите diff и сразу находите ошибку. Пока не проверили, следующий промпт не пишите. Теперь посмотрим, как писать сам промпт."
   ]
  }
 },
 "7": {
  "kicker": "Этап 2 · план и промпт",
  "title": "Хороший промпт состоит из пяти частей: контекст, цель, условия, граница и ответ",
  "seg": {
   "a": [
    "Первая часть — <b>контекст</b>: что за проект и как он сейчас работает",
    "Первая часть промпта — контекст: что за проект и как он сейчас работает. AI может прочитать проект, но не знает вашей цели. Поэтому хватит одного предложения: это бот заказов на NestJS и Telegraf, все данные в памяти, переносим в PostgreSQL по этапам."
   ],
   "b": [
    "Вторая и третья часть — <b>цель одного этапа и строгие условия</b>",
    "Вторая часть — цель: только этот этап, у нас подключение и каталог. Третья — строгие условия: адрес читается из env, synchronize не используется, таблица создаётся миграцией, stock не бывает отрицательным, seed при втором запуске не добавляет повторно. Каждое условие потом проверяется."
   ],
   "c": [
    "Четвёртая и пятая — <b>что не трогать и что должно быть в ответе</b>",
    "Четвёртая часть — граница: сервисы user, корзины и заказа пока не трогай. Пятая — ответ: какие файлы изменились, как запустить и что проверить в терминале PostgreSQL. Эта часть заставляет AI объяснить свою работу, а вы получаете готовый список проверки."
   ],
   "d": [
    "Итог: каждое условие — <b>один пункт, который потом проверяется</b>; непроверяемое условие не пишется",
    "Итог: промпт из пяти частей. Пусть каждое условие можно будет потом проверить: условие «stock не бывает отрицательным» проверяете в терминале PostgreSQL, написав минус один. Условие «напиши красиво» не проверить, не пишите его."
   ]
  }
 },
 "8": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 5",
  "title": "Двум AI дали одинаковую задачу. Какой результат можно просмотреть и сделать commit?",
  "q": "Вы видели шаблон промпта, теперь проверим. Вторая проверка. Двум AI дали одинаковую задачу: перенести каталог в базу. На экране оба промпта, объём изменений и фрагмент ответа AI. Какой результат можно просмотреть и сделать commit? Выберите вариант.",
  "ok": "Верно. B перенёс только каталог и сам сказал, зачем тронул другие сервисы: стало async, понадобился await. Это обосновано и легко проверить. A тоже работал, но сделал разом четыре этапа, о которых не просили, и не сказал об этом. Значит, результат для commit по объёму равен этапу, который вы попросили.",
  "okShort": "B — запрошенный этап, выход за рамки назван. A — 1145 строк, работа, о которой не просили, не названа.",
  "hint": "Какой AI сделал только то, что просили? Какой сказал, где вышел за рамки?",
  "demak": "изменение для commit по объёму равно этапу, который вы попросили.",
  "opts": [
   "A — сделал всё разом, время сэкономлено",
   "Оба одинаковы — оба работают",
   "B — только запрошенный этап, назвал, где вышел",
   "Ни один — код AI нельзя коммитить"
  ],
  "wrong": {
   "0": "Много работы — много просмотра: в 1145 строках ошибку найти трудно.",
   "1": "Мало того, что работает: за каждую строку отвечаете вы.",
   "3": "Коммитится — после того как прочитали и проверили."
  }
 },
 "9": {
  "kicker": "Этап 3 · подключение и каталог · внутри",
  "title": "Entity описывает таблицу, миграция её создаёт, таблица migrations помнит, что запускалось",
  "seg": {
   "a": [
    "Entity — <b>таблица в виде кода</b>: класс, колонки через decorator",
    "Посмотрим, что происходит внутри первого этапа. В TypeORM таблица описывается классом entity: decorator Entity даёт имя таблицы, decorator Column — каждую колонку. В знакомом вам Mongoose это была schema."
   ],
   "b": [
    "Миграция — <b>SQL-файл, создающий таблицу</b>; <code>synchronize</code> выключен",
    "Таблицу создаёт не entity, а миграция. Миграция — обычный SQL-файл: в методе up create table, в методе down drop table. Synchronize false, то есть TypeORM сам таблицу не меняет. В Mongoose миграций не было, потому что у коллекции нет правил колонок. В PostgreSQL правила есть, и меняем их файлом."
   ],
   "c": [
    "Таблица <code>migrations</code> — <b>помнит, какой файл запускался</b>; при подъёме сервера незапущенные запускаются сами",
    "Когда миграция прошла, TypeORM пишет в таблицу migrations одну строку: имя файла и время. При каждом подъёме сервер смотрит в эту таблицу и запускает только незапущенные миграции, это настройка migrations run true. При втором запуске ничего не повторяется."
   ],
   "d": [
    "Итог: изменить таблицу — <b>новый файл миграции</b>, старый не правится",
    "Итог: entity описывает таблицу в коде, миграция создаёт её в базе, таблица migrations помнит, какой файл запускался. Если потом захотите добавить колонку — пишете новую миграцию. Править уже запущенную миграцию бесполезно: база её заново не запустит."
   ]
  }
 },
 "10": {
  "kicker": "Этап 3 · подключение и каталог",
  "title": "Разделите ответ AI на три части: что изменилось, где вышел за рамки, как проверить",
  "seg": {
   "a": [
    "Первое: сравните <b>список изменённых файлов с <code>git diff --stat</code></b>",
    "AI закончил работу и написал ответ. Читайте его, разделив на три части. Первая: какие файлы изменились. Сравните список AI с git diff stat. На этот раз список совпал: entity, миграция, seed, config и catalog service."
   ],
   "b": [
    "Второе: найдите часть <b>«вышел за рамки»</b> и оцените причину",
    "Вторая: где AI вышел за рамки. Мы сказали: не трогай пользователя, корзину и заказ. AI изменил сервисы order и telegram и открыто это написал: catalog service теперь async, вызовам нужен await. Причина обоснована. Если причина не написана, ищете в diff сами."
   ],
   "c": [
    "Третье: команды проверки <b>запускайте сами</b> — «я проверил» от AI не доказательство",
    "Третья: проверка. AI говорит «я сам проверил», но это не доказательство. Запускайте команды сами. Seed в первый раз добавил шесть товаров, во второй — ноль. В бэкслеш d products есть UNIQUE и CHECK. Build чистый."
   ],
   "d": [
    "Итог: прочитайте, сравните, запустите — <b>потом commit</b>",
    "Итог: ответ AI читается в трёх частях: файлы, выход за рамки и проверка. Файлы сравниваете с diff, причину выхода оцениваете, проверку запускаете сами. Если всё верно — commit. Но на этом этапе есть ещё одна скрытая проблема, увидим её на следующем экране."
   ]
  }
 },
 "11": {
  "kicker": "Этап 3 · внутри",
  "title": "Каталог в базе, заказ в памяти: после перезапуска заказ пропал, а склад остался уменьшенным",
  "seg": {
   "a": [
    "После 1-го этапа бот работает: <b>каталог из базы, а заказ ещё в памяти</b>",
    "Первый этап готов, тесты чистые. Теперь проверим поток бота с перезапуском. Азиза сделала заказ: одна клавиатура и две мышки. Склад в базе уменьшился. А сам заказ всё ещё в массиве в памяти, потому что его переносим на четвёртом этапе."
   ],
   "b": [
    "Перезапуск: <b>заказ пропал, а склад остался 7 и 8</b>",
    "Перезапускаем сервер. Админ открывает заказы: заказов пока нет. А в терминале PostgreSQL клавиатура — семь, мышка — восемь. То есть товар ушёл со склада, но записи о том, кто его взял, нет никакой. Это поломка худшего вида, без сообщения об ошибке."
   ],
   "c": [
    "Причина: <b>одно дело записано в два места</b> — одно постоянное, другое временное",
    "Причина: одна продажа записана в два места. Вычитание со склада — в базу, а заказ — в память. Перезапуск стёр память, базу не тронул. Проверка это показала, потому что мы проверили не только build, а весь поток с перезапуском."
   ],
   "d": [
    "Итог: <b>промежуточный этап на прод не выпускайте</b>; после каждого этапа проверяйте с перезапуском",
    "Итог: при поэтапном переносе бывает промежуточное состояние, когда данные живут в двух местах. Промежуточный этап на работающего бота не выпускайте, сначала закончите все этапы. После каждого этапа проверяйте полный поток с перезапуском: этого не поймают ни build, ни собственные тесты AI."
   ]
  }
 },
 "12": {
  "kicker": "Практика 2 / 4",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Подключение, миграция и каталог — с вашим AI, потом проверяете сами",
  "seg": {
   "a": [
    "Теперь вы: даёте <b>1-й промпт своему AI</b> и проверяете результат",
    "Теперь ваша очередь. Даёте первый промпт своему AI: Antigravity, Claude Code или другому. Ответ AI будет не таким, как у нас, это нормально. Проверка та же. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: база, промпт, <b>чтение ответа AI в трёх частях</b>",
    "На первом шаге создаёте в терминале PostgreSQL базу shop и пишете в env-файл database url. На втором копируете промпт, даёте AI и читаете ответ: файлы, выход за рамки и команды проверки."
   ],
   "c": [
    "Шаги 3–4: seed дважды и <code>\\d products</code>; подтверждение — <b>число товаров после второго seed</b>",
    "На третьем шаге запускаете seed дважды и через бэкслеш d products смотрите, что есть CHECK. На четвёртом пробуете сделать stock минус один: должна выйти ошибка. В поле подтверждения напишите число из select count. Если всё верно, сделайте commit."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики ваш бот читает каталог из PostgreSQL, а работу AI вы проверили сами."
   ]
  },
  "steps": [
   {
    "t": "База — создайте в терминале PostgreSQL, адрес впишите в .env",
    "exp": "CREATE DATABASE",
    "cmds": [
     null,
     null,
     "DATABASE_URL=postgresql://postgres:<пароль>@localhost:5432/shop"
    ]
   },
   {
    "t": "Промпт — дайте AI 1-й промпт, прочитайте ответ в трёх частях: файлы · выход за рамки · проверка",
    "exp": "список совпадает с diff"
   },
   {
    "t": "Seed и таблица",
    "exp": "во 2-й раз добавлено 0 · CHECK (stock >= 0) · 1 строка"
   },
   {
    "t": "Правило и commit",
    "exp": "violates check constraint · 6"
   }
  ],
  "proof": {
   "label": "Результат SELECT count(*) FROM products;",
   "placeholder": "напишите число из результата",
   "wrong": "Seed запускался дважды — не добавил ли повторно? Если вышло 12, AI не выполнил условие про повтор seed: напишите ему об этом."
  },
  "trouble": [
   [
    "count = 12",
    "seed добавил повторно — AI: «при втором запуске seed не добавляет повторно, ON CONFLICT (name) DO NOTHING»"
   ],
   [
    "UPDATE прошёл без ошибки",
    "нет CHECK — \\d products; AI: «пусть для stock в базе будет CHECK (stock >= 0), новой миграцией»"
   ],
   [
    "relation \"products\" does not exist",
    "миграция не запускалась — запустите сервер один раз или npm run migration:run"
   ],
   [
    "Unable to connect to the database. Retrying (1)... и error: database \"shop\" does not exist",
    "шаг 1: CREATE DATABASE shop;"
   ],
   [
    "Unable to connect to the database. Retrying (1)... и error: password authentication failed for user \"postgres\"",
    "пароль в .env — тот, что вы поставили в PostgreSQL-1"
   ],
   [
    "npm error Missing script: \"seed\"",
    "AI назвал seed иначе или положил внутрь миграции — ищите в его ответе (так было во 2-м опыте)"
   ]
  ]
 },
 "13": {
  "kicker": "Этап 4 · пользователь, state, корзина · внутри",
  "title": "Telegram id не помещается в INTEGER — нужен BIGINT; но BIGINT приходит в код строкой",
  "seg": {
   "a": [
    "Id Азизы 5 123 456 789 — <b>больше предела <code>INTEGER</code></b>, поэтому <code>BIGINT</code>",
    "Второй этап: пользователи. Первая ловушка — в id. Telegram id может быть больше двух миллиардов ста сорока семи миллионов, это предел integer. Id Азизы больше пяти миллиардов. Поэтому колонка — big int. Оба AI выбрали big int."
   ],
   "b": [
    "Но node-pg и TypeORM <b>возвращают колонку <code>BIGINT</code> в код строкой</b>: <code>\"5123456789\"</code>",
    "Вторая ловушка не видна. Big int может быть больше обычного числа JavaScript, поэтому библиотека pg возвращает его строкой. TypeORM так же. Если сравнить строку с числом через три равенства, выйдет false. В знакомом вам Mongoose это было число, и выходило true."
   ],
   "c": [
    "Два верных пути: <b>тип колонки <code>string</code></b> или <b><code>number</code> через transformer</b>",
    "Верных путей два. Первый: в entity написать telegram id как string и везде работать со строкой. Второй: через transformer превращать в число при чтении из базы. Telegram id не больше пятидесяти двух бит, число JavaScript его вмещает. Наш готовый код выбрал первый путь, AI — второй. Работают оба."
   ],
   "d": [
    "Итог: <b>тип id и сравнение</b> в entity обязательно проверьте по diff",
    "Итог: для Telegram id — big int, и знайте, строка он в коде или число. Глядя на код AI, посмотрите в два места: тип колонки в миграции — big int ли, и какой тип в entity и где он сравнивается через три равенства."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · внутри",
  "title": "Клиент дважды быстро нажал кнопку: «сначала найти, потом добавить» может открыть две строки — ON CONFLICT решает одним запросом",
  "seg": {
   "a": [
    "В корзине один товар — одна строка: <b><code>UNIQUE (user_id, product_id)</code></b>",
    "Третий этап: корзина. У одного клиента один товар — только одна строка, при повторном добавлении qty увеличивается на один. Это правило держат и код, и база: в таблице cart items пара user id и product id — UNIQUE."
   ],
   "b": [
    "Сначала найти, потом добавить — <b>при двух быстрых нажатиях оба видят «нет»</b>",
    "Простой путь: сначала искать через select, если нет — insert. Но если клиент быстро нажмёт кнопку дважды, два запроса одновременно ищут, и оба видят «нет». Мы проверили двадцать раз: девятнадцать раз в корзине появились две строки. Если есть UNIQUE, второй получает ошибку duplicate key."
   ],
   "c": [
    "<code>ON CONFLICT … DO UPDATE</code> — <b>один запрос</b>: нет — добавит, есть — увеличит",
    "Решение — один запрос: insert on conflict do update. Если строки нет — добавится, если есть — qty увеличится на один. База сама ставит это в очередь. В знакомом вам Mongoose это был upsert, но и он без unique index открывал два документа. Оба AI выбрали верный путь."
   ],
   "d": [
    "Итог: видите <b>«найти и добавить»</b> — проверьте, есть ли <code>UNIQUE</code> и <code>ON CONFLICT</code>",
    "Итог: «сначала найти, потом добавить» работает для одного клиента, но ломается при быстрых нажатиях. Если видите такое место в коде AI, проверьте две вещи: есть ли в таблице правило UNIQUE и идёт ли запрос через on conflict. У пользователя то же правило: даже если start нажат дважды — одна строка."
   ]
  }
 },
 "15": {
  "kicker": "Этап 4 · пользователь, state, корзина",
  "title": "WAITING_PHONE в базе: бот спросил телефон, сервер перезапустился — когда пришёл номер, бот его узнаёт",
  "seg": {
   "a": [
    "State — <b>этап, который бот запомнил о клиенте</b>: <code>IDLE</code> или <code>WAITING_PHONE</code>",
    "Посмотрим на state. State — то, что бот запомнил о пользователе: на каком шаге он стоит. У нашего бота их два: IDLE, то есть обычный, и WAITING PHONE, то есть ждём телефон. Когда клиент нажимает «оформить заказ», state становится WAITING PHONE."
   ],
   "b": [
    "После перезапуска пришёл номер — <b>бот узнал в нём телефон</b>, не сказал «Tushunmadim»",
    "Бобур нажал «оформить заказ», бот спросил телефон. В этот момент сервер перезапустился. Бобур написал номер. Так как state в базе, бот узнал в номере телефон и создал заказ. Если бы state был в памяти, бот сказал бы «не понял»."
   ],
   "c": [
    "После второго и третьего этапа <b>и state, и корзина</b> пережили перезапуск",
    "Этот результат получился после третьего этапа. После второго бот узнал телефон, но корзина была пуста, потому что корзина ещё была в памяти. Это опять промежуточное состояние. После третьего этапа и корзина в базе, заказ создан под номером один."
   ],
   "d": [
    "Итог: чтобы проверить state, <b>перезапускайте посреди разговора</b>",
    "Итог: обычная проверка state не ловит, потому что в одном процессе всё работает. Перезапускайте посреди разговора: бот задал вопрос, сервер перезапустился, потом напишите ответ. Если бот продолжает — state в базе."
   ]
  }
 },
 "16": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 5",
  "title": "Проверка админа написана на результате сырого запроса: rows[0].telegram_id !== 111. Жасур (id 111) нажал /orders. Что будет?",
  "q": "Вы видели big int, теперь проверим. Третья проверка. Проверка админа написана сырым запросом: из базы берётся telegram id и сравнивается, не равен ли он ста одиннадцати. TypeScript ошибку не дал. Id Жасура действительно сто одиннадцать. Он нажал orders. Что будет? Выберите вариант.",
  "ok": "Верно. Telegram id приходит из базы строкой, сто одиннадцать в кавычках. Строка никогда не равна числу, поэтому Жасур перестаёт быть админом. Сообщения об ошибке нет, бот просто говорит «только для админа». Значит, перед сравнением колонки big int приведите обе стороны к одному типу: строку со строкой или число с числом.",
  "okShort": "<code>\"111\" !== 111</code> → <code>true</code>: проверка админа не проходит, ошибки нет.",
  "hint": "В каком типе telegram_id приходит из базы? Что говорит === на значения разных типов?",
  "demak": "перед сравнением колонки <code>BIGINT</code> тип обеих сторон должен быть одинаковым.",
  "opts": [
   "Жасур видит заказы — id 111 верный",
   "Сервер не запустится — tsc отклонит тип",
   "База выдаст ошибку — id запрошен строкой",
   "Выйдет «faqat admin uchun» — \"111\" !== 111"
  ],
  "wrong": {
   "0": "Из базы приходит строка: \"111\" — не число.",
   "1": "Сервер работает, и tsc ошибки не даёт: результат raw (внутри ds.query) — any. А при сравнении со string из entity tsc даёт TS2367 — проверили.",
   "2": "База выполнила запрос; сравнение — в JavaScript."
  }
 },
 "17": {
  "kicker": "Практика 3 / 4",
  "eyebrow": "Сейчас у себя · 25 минут",
  "title": "Пользователь, state и корзина — два промпта, после каждого перезапуск",
  "seg": {
   "a": [
    "Теперь вы: <b>два промпта, два commit</b> — пользователь и state, потом корзина",
    "Теперь два этапа делаете сами: пользователь и state, потом корзина. После каждого промпта проверка и commit. Займёт двадцать пять минут."
   ],
   "b": [
    "Шаги 1–2: 2-й промпт, чтение ответа, <b><code>\\d users</code> — тип id <code>bigint</code></b>",
    "На первом шаге даёте AI второй промпт и читаете ответ в трёх частях. На втором через бэкслеш d users смотрите тип telegram id: должен быть big int. Посмотрите и какой тип в entity."
   ],
   "c": [
    "Шаги 3–4: 3-й промпт, потом <b>перезапуск посреди разговора</b>; подтверждение — колонка <code>state</code>",
    "На третьем шаге даёте третий промпт. На четвёртом кладёте товар в корзину, нажимаете «оформить заказ», бот спрашивает телефон. В этот момент посмотрите в терминале PostgreSQL state в таблице users и напишите в поле подтверждения. Потом перезапустите и отправьте номер: бот должен создать заказ."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики ваш бот хранит в базе пользователя, state и корзину, и вы доказали это перезапуском."
   ]
  },
  "steps": [
   {
    "t": "2-й промпт — дайте AI, прочитайте ответ в трёх частях",
    "exp": "новая миграция, первая не изменена"
   },
   {
    "t": "users — дважды нажмите /start, проверьте, сделайте commit",
    "exp": "bigint · каждый id 1 раз"
   },
   {
    "t": "3-й промпт — дайте AI; в Telegram нажмите один товар 3 раза; проверьте и сделайте commit",
    "exp": "UNIQUE · одна строка, qty 3"
   },
   {
    "t": "Перезапуск — нажмите «✅ Buyurtma berish»; когда спросят телефон, посмотрите state; перезапустите сервер и отправьте номер",
    "exp": "WAITING_PHONE · «Buyurtma #… qabul qilindi!»"
   }
  ],
  "proof": {
   "label": "Значение state в момент, когда спросили телефон",
   "placeholder": "напишите результат psql",
   "wrong": "Проверяйте после нажатия «оформить заказ», до ввода номера. Если вышло IDLE — state не записан в базу: напишите AI заново условие хранить state в базе."
  },
  "trouble": [
   [
    "telegram_id — integer",
    "AI выбрал неверный тип — новая миграция: ALTER COLUMN … TYPE BIGINT; при большом id в терминале value \"5123456789\" is out of range for type integer, бот говорит «Tushunmadim»"
   ],
   [
    "/start дважды — две строки",
    "нет UNIQUE — AI: «telegram_id не повторяется, и в базе тоже»"
   ],
   [
    "duplicate key value violates unique constraint",
    "добавляется, не поискав — ON CONFLICT (экран 14)"
   ],
   [
    "После перезапуска «Tushunmadim»",
    "state не записан в базу или не читается — SELECT state …"
   ],
   [
    "После перезапуска «Savat bo'sh»",
    "корзина ещё в памяти — выполнен ли 3-й промпт"
   ],
   [
    "Админ /orders — «faqat admin uchun»",
    "\"111\" === 111 (экран 16) — тип"
   ]
  ]
 },
 "18": {
  "kicker": "Этап 5 · заказ · внутри",
  "title": "Заказ — три дела: вычесть со склада, записать заказ, очистить корзину — либо всё, либо ничего",
  "seg": {
   "a": [
    "Заказ <b>затрагивает три таблицы</b>: <code>products</code>, <code>orders</code> и <code>cart_items</code>",
    "Четвёртый этап: заказ. Один заказ затрагивает три таблицы: из products вычитается склад, в orders и order items пишется заказ, из cart items удаляется корзина. В PostgreSQL-2 вы видели экран «две таблицы — одно дело», это оно же, только внутри кода."
   ],
   "b": [
    "<code>transaction</code> TypeORM — <b><code>START TRANSACTION</code> … <code>COMMIT</code></b> — видно в SQL-логе",
    "В коде это dataSource transaction. Все запросы внутри идут в одной транзакции. Если включить SQL-лог, увидите её саму: start transaction, два update, два insert, delete и commit. Это ровно begin и commit из терминала PostgreSQL."
   ],
   "c": [
    "Если один упадёт — <b><code>ROLLBACK</code></b>: склад, заказ и корзина не меняются",
    "Если внутри упадёт один запрос, TypeORM делает rollback. Не меняются ни склад, ни заказ, ни корзина. Мы проверили это нарочно: поставили trigger, дающий ошибку при записи в order items. Бот сказал «заказ не оформлен», склад на восьми и десяти, заказов ноль, корзина на месте."
   ],
   "d": [
    "Итог: <b>все запросы одного дела — в одной транзакции</b>; SQL-лог — доказательство",
    "Итог: одно дело, которое затрагивает несколько таблиц, делается в одной транзакции. Если AI говорит «сделал транзакцию», включите SQL-лог и посмотрите: все ли запросы между start transaction и commit. Эта проверка занимает минуту."
   ]
  }
 },
 "19": {
  "kicker": "Этап 5 · внутри",
  "title": "На складе один планшет, два клиента одновременно нажали «Buyurtma berish»: одному продаётся, второй получает понятное сообщение",
  "seg": {
   "a": [
    "Проверка: на складе <b>остался один планшет, две транзакции начинаются одновременно</b>",
    "Теперь самая тяжёлая проверка. На складе остался один планшет. Азиза и Бобур одновременно нажимают «оформить заказ». Две транзакции начинаются одновременно, и обе доходят до строки планшета."
   ],
   "b": [
    "Первая транзакция <b>блокирует</b> строку, вторая ждёт её завершения",
    "Первая транзакция блокирует строку планшета. В нашем коде это select for update, в коде AI — update where stock больше или равно qty. Вторая транзакция, дойдя до этой строки, ждёт. Когда первая сделала commit, вторая видит новый остаток: ноль."
   ],
   "c": [
    "Результат: <b>продан один, склад 0</b>, Бобур получил понятное сообщение, корзина сохранена",
    "Результат: Азизе продали, склад ноль, не минус. Бобур получил понятное сообщение: планшет, на складе осталось только ноль. Его транзакция откатилась, корзина сохранилась. Эту проверку мы запускали и на своём коде, и на коде AI, результат одинаковый."
   ],
   "d": [
    "Итог: условие «не продать лишнего» <b>проверяется только многими клиентами одновременно</b>",
    "Итог: с одним клиентом эта ошибка никогда не видна, только с двумя одновременными запросами. И двух клиентов мало: транзакция заканчивается быстро, и код без блокировки тоже часто выходит правильным. Поэтому smoke гоняет пять клиентов три раунда. Что будет без блокировки, увидим на следующем экране."
   ]
  }
 },
 "20": {
  "kicker": "Этап 5 · ломаем",
  "title": "«Прочитай, проверь, запиши» без блокировки: все транзакции видят остаток 1 — один планшет продаётся пятерым, и CHECK не ловит",
  "seg": {
   "a": [
    "Блокировки нет: <b>читаем строку без блокировки</b>, остаток считаем в коде и записываем новый",
    "Вы убрали блокировку. Теперь товар читается обычным find, в коде проверяется, хватает ли остатка, новый остаток считается и сохраняется через save. AI часто пишет именно так, выглядит правильно."
   ],
   "b": [
    "Пять транзакций <b>одновременно видят «остаток 1»</b> — все проходят проверку",
    "Пять клиентов нажимают одновременно. Каждая транзакция читает остаток: один. Все считают, что хватает, и пишут ноль. Мы прогнали это пять раундов: в четырёх один планшет продали пятерым. В первом раунде случайно одному, поэтому одной проверки мало."
   ],
   "c": [
    "<code>CHECK (stock &gt;= 0)</code> <b>не ловит</b>: записано 0, не отрицательное",
    "Правило базы тоже не помогает. Check stock больше или равно нулю отклоняет только отрицательное. Каждая транзакция записала ноль, а ноль разрешён. То есть в этой ситуации нет сообщения об ошибке, есть только лишние заказы."
   ],
   "d": [
    "Исправлений два: <b>чтение с блокировкой</b> или <b>один <code>UPDATE … WHERE</code></b> — снова продан 1",
    "Исправлений два. Первое: блокировка при чтении, в find добавляется lock pessimistic write, вторая транзакция ждёт. Второе: отдать счёт базе, update stock минус qty where stock больше или равно qty. Race прогнали заново: во всех пяти раундах продан один, склад ноль. Значит, считать остаток в коде и записывать без блокировки не работает."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>lock</code>",
    "Заказ работает, проверка race тоже чистая. Теперь ломаем намеренно, потому что AI часто пишет именно так. Ломаете вы сами: в тридцать третьей строке order service подсвечен lock, нажмите на него: блокировка уберётся.",
    "Нажмите на <b><code>lock: { mode: 'pessimistic_write' }</code></b> в 33-й строке <b>order.service.ts</b> — блокировка уберётся, чтение станет обычным <code>findOneBy</code>."
   ]
  }
 },
 "21": {
  "kicker": "Этап 5 · внутри",
  "title": "После отказа CHECK — ещё запрос в той же транзакции: «current transaction is aborted» — shop=!# из PG-2 внутри кода",
  "seg": {
   "a": [
    "Эту ошибку <b>сделали мы сами</b>: при написании проекта первый код был таким",
    "Эту ошибку сделал не AI, а мы сами: при написании готового проекта первый код был таким. Мысль казалась верной: сначала вычитаем, если check отклонит, перечитаем товар и скажем клиенту, сколько осталось."
   ],
   "b": [
    "<code>CHECK</code> отклонил — следующий <code>SELECT</code> получил <b>«transaction is aborted»</b>",
    "Клиент попросил четыре планшета, было три. Update упёрся в check. Потом код сделал select, чтобы узнать остаток, и получил ошибку: current transaction is aborted. А клиенту ушло непонятное английское сообщение."
   ],
   "c": [
    "Правило PostgreSQL: после ошибки в транзакции <b>помогает только <code>ROLLBACK</code></b>",
    "Это то самое приглашение с восклицательным знаком из PostgreSQL-2. Если внутри транзакции одна ошибка, до rollback отклоняются все запросы. В коде так же: после ошибки в этой транзакции ничего спросить нельзя."
   ],
   "d": [
    "Исправление: <b>сначала проверка, потом запись</b>; <code>CHECK</code> — последний сторож",
    "Исправление: перенесли проверку раньше update. Читаем строку с блокировкой, если не хватает — сообщение даём там же. А check остаётся последним сторожем: даже если код ошибётся, склад не станет отрицательным. Значит, внутри транзакции нельзя поймать ошибку и продолжить запросы."
   ]
  }
 },
 "22": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 5 — какая строка с ошибкой?",
  "title": "Один планшет продали пятерым. Найдите строку с ошибкой",
  "q": "Вы видели поломку, теперь найдите сами. Четвёртая проверка. Пять клиентов одновременно взяли последний планшет, и создалось пять заказов. В этом фрагменте одна строка читает строку без блокировки. Нажмите на эту строку.",
  "ok": "Верно. Find one by читает строку без блокировки, поэтому все транзакции видят один и тот же остаток. Проверка и счёт верные, но работают над старым значением. На экране исправленный код: lock pessimistic write, в race продан один. Значит, при ошибке двух клиентов сначала ищите, где прочитан остаток.",
  "okShort": "<code>findOneBy</code> — чтение без блокировки: все транзакции видят остаток 1. С <code>lock: pessimistic_write</code> остальные ждут очереди.",
  "hint": "Строка проверки считает верно — но над каким значением? В какой строке и как оно прочитано?",
  "task": "Правило: остаток, прочитанный внутри транзакции, блокируется, чтобы другая транзакция его не изменила — или счёт идёт внутри одного <code>UPDATE … WHERE</code>. В этом фрагменте одна строка читает строку без блокировки. <b>Нажмите на эту строку.</b>"
 },
 "23": {
  "kicker": "Практика 4 / 4",
  "eyebrow": "Сейчас у себя · 25 минут",
  "title": "Заказ в транзакции — и пять клиентов берут последний товар",
  "seg": {
   "a": [
    "Последний этап: <b>4-й промпт</b>, SQL-лог и проверка многими клиентами",
    "Последний этап: переносите заказы в базу. Потом три проверки: транзакция в SQL-логе, проверка многими клиентами и отмена. Займёт двадцать пять минут."
   ],
   "b": [
    "Шаги 1–2: 4-й промпт, ответ, <b>в SQL-логе <code>START TRANSACTION</code> … <code>COMMIT</code></b>",
    "На первом шаге даёте AI четвёртый промпт и читаете ответ в трёх частях. На втором в env ставите db logging true, делаете один заказ и смотрите в терминале запросы между start transaction и commit."
   ],
   "c": [
    "Шаги 3–4: <b>проверка многими клиентами</b> и отмена; подтверждение — сообщение второму клиенту",
    "На третьем шаге запускаете smoke-скрипт в режиме race: пять клиентов одновременно берут один планшет. На четвёртом как админ дважды отменяете заказ: склад должен вернуться один раз. В поле подтверждения напишите сообщение, которое пришло второму клиенту. Если всё верно — commit."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики все данные вашего бота в PostgreSQL, и вы сами доказали, что лишнего не продаётся."
   ]
  },
  "steps": [
   {
    "t": "4-й промпт — дайте AI, прочитайте ответ, посмотрите новые таблицы",
    "exp": "новая миграция · texts.ts/keyboards.ts не изменены"
   },
   {
    "t": "SQL-лог — добавьте в .env (если AI дал другое имя — из его ответа), сделайте заказ в Telegram",
    "exp": "START TRANSACTION … COMMIT"
   },
   {
    "t": "Пять клиентов",
    "exp": "✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
    "cmds": [
     "npm run smoke -- race (во временной базе, ваша база не меняется)"
    ]
   },
   {
    "t": "Отмена — как админ в /orders дважды нажмите «❌ Bekor», посмотрите остаток, commit",
    "exp": "1-й «Bekor qilingan», 2-й «allaqachon bekor qilingan» · 1"
   }
  ],
  "proof": {
   "label": "Сообщение, пришедшее второму клиенту",
   "placeholder": "скопируйте из результата smoke",
   "wrong": "Обоим пришло \"qabul qilindi\"? Тогда блокировки нет — экран 20: посмотрите, как читается остаток внутри place."
  },
  "trouble": [
   [
    "✗ ortiqcha sotilmadi (например 5/0)",
    "чтение без блокировки (экраны 20, 22) — AI: «заблокируй строку через FOR UPDATE или UPDATE … WHERE stock >= qty»"
   ],
   [
    "ошибка current transaction is aborted",
    "запрос в транзакции после ошибки (экран 21) — проверка до UPDATE"
   ],
   [
    "Отмена 2 раза — склад вырос на 2",
    "при отмене строка заказа не заблокирована или статус не проверяется — напишите об этом AI"
   ],
   [
    "В SQL-логе нет START TRANSACTION",
    "запросы без транзакции — dataSource.transaction"
   ],
   [
    "smoke — Missing script",
    "AI удалил строку smoke в package.json — git checkout tgpg-start -- scripts/smoke.js и верните строку"
   ]
  ]
 },
 "24": {
  "kicker": "Этап 5 · итог",
  "title": "После каждого этапа пять проверок: diff, build, перезапуск, psql и много клиентов",
  "seg": {
   "a": [
    "Первые две проверки: <b>объём diff и build</b> — запрошенная работа и чистая компиляция",
    "Вы прошли четыре этапа. Теперь соберём проверки в один список, потому что на каждом этапе они одинаковые. Первая — diff: равен ли объём изменений запрошенному этапу. Вторая — build: компилируется ли проект без ошибок."
   ],
   "b": [
    "Третья и четвёртая: <b>перезапуск и терминал PostgreSQL</b> — где живут данные",
    "Третья — перезапуск: перезапустите сервер посреди разговора и посмотрите, что осталось. Промежуточное состояние и state видны только так. Четвёртая — терминал PostgreSQL: через бэкслеш d типы колонок и правила, через select настоящие строки."
   ],
   "c": [
    "Пятая: <b>много клиентов одновременно</b> — smoke нашёл ошибку и в нашем коде",
    "Пятая — много клиентов одновременно: это делает режим race у smoke. Он нашёл ошибку и в нашем собственном коде: если админ одновременно дважды нажмёт «отменить», склад вернулся дважды. Строка заказа не была заблокирована, исправили. Код обоих AI эту проверку прошёл."
   ],
   "d": [
    "Итог: <b>«я проверил» от AI — не проверка</b>; пять пунктов — в ваших руках",
    "Итог: в двух опытах AI чаще всего писал код правильно. Но делал работу, о которой не просили, не заметил промежуточного состояния, один раз отправил запрос в настоящий Telegram. Этого AI не сказал, нашла проверка. Пять пунктов на каждом этапе — в ваших руках, потом commit."
   ]
  }
 },
 "25": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m5-04 · «Bot eslab qoladi»",
  "title": "Урок ученика: одна таблица users, Neon и промпт из трёх строк — маленький вариант пути, который вы знаете",
  "seg": {
   "a": [
    "m5-04 — 20 экранов: бот ученика <b>запоминает имя</b>, одна таблица <code>users</code>",
    "Теперь подготовка к классу, два экрана. Урок ученика m5-04, двадцать экранов. Бот ученика должен запомнить имя: одна таблица users, в ней telegram id big int, колонки имени и состояния, то есть name и state. Вы сегодня работали с пятью таблицами, это её маленький вариант."
   ],
   "b": [
    "Практика: <b>Neon и Antigravity</b>, <code>synchronize: true</code> — без миграций",
    "В практике ученика база в интернете, в Neon, в конце адреса подключения стоит sslmode require. Код пишет Antigravity промптом из трёх строк. Таблицу сам создаёт synchronize true, миграций нет. Для учебного проекта этого хватает, а разницу вы знаете."
   ],
   "c": [
    "Вы добавляете: <b><code>\\d users</code> — <code>bigint</code></b>, дважды <code>/start</code>, перезапуск посреди разговора",
    "Что вы добавляете к уроку: после того как AI написал, посмотрите с учеником бэкслеш d users, telegram id должен быть big int. Нажмите start дважды и покажите, что строка одна. Перезапуск сделайте, когда спрошено имя: если бот продолжает, state в базе."
   ],
   "d": [
    "Итог: до урока — <b>аккаунт Neon, тестовый бот в BotFather</b>, запущен <code>dars-03-done</code>",
    "Итог: до урока проверьте три вещи: у каждого ученика открывается аккаунт Neon, в BotFather есть тестовый бот, и бот из третьего урока работает. Предложение по времени: больше всего времени дайте практике, на шаге Neon и токена многие ошибаются."
   ]
  }
 },
 "26": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Четыре ситуации и готовые ответы — все вы сегодня видели сами",
  "seg": {
   "a": [
    "Четыре ситуации, которые обязательно будут на уроке — <b>две с сообщением, две без</b>",
    "Теперь посмотрим четыре ситуации, которые обязательно возникнут на уроке ученика. Две приходят с сообщением, две без. Все вы сегодня видели сами, поэтому скажу коротко."
   ],
   "b": [
    "401 и <code>DATABASE_URL topilmadi</code> — <b>узнаются по сообщению сразу</b>",
    "Первая: сервер говорит, что работает, но бот не отвечает, в терминале четыреста один. Неверный токен. Вторая: сервер вообще не запускается, database url не найден. Нет env-файла или адрес не записан."
   ],
   "c": [
    "Имя забыто и большой id — <b>находятся перезапуском и <code>\\d users</code></b>",
    "Третья без сообщения: после перезапуска бот снова спрашивает имя. State не пишется в базу, посмотрите таблицу users. Четвёртая: в терминале out of range for type integer или при втором start duplicate key. Проверьте тип колонки и есть ли сначала поиск."
   ],
   "d": [
    "Итог: если ученик говорит «AI написал, работает» — <b>пусть сделает перезапуск и дважды <code>/start</code></b>",
    "Итог и способ: если ученик говорит, что AI написал и всё работает, пусть сам сделает две вещи: перезапуск посреди разговора и start дважды. Не говорите ответ сразу, посмотрите результат вместе. Внизу готовые ответы на вопросы учеников."
   ]
  }
 },
 "27": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "Бот хранит корзину и заказ в Map. Сервер перезапустился. Что будет?",
    "e": "Map — в памяти процесса.",
    "o": [
     "Корзина и заказ пропадут, ошибки не будет",
     "Сервер даст ошибку — содержимое Map испорчено",
     "Всё останется — Map пишется на диск",
     "Останется только заказ — он в отдельном массиве"
    ]
   },
   {
    "q": "Промпт AI в одно предложение: «Перенеси каталог». Он изменил 22 файла, 1145 строк, код работает. Верный шаг?",
    "e": "Объём для commit — запрошенный этап.",
    "o": [
     "Сразу commit — код работает, этого достаточно",
     "Отменить и дать промпт на один этап",
     "Сменить AI и дать тот же промпт",
     "Ничего — 1145 строк тоже обычный объём"
    ]
   },
   {
    "q": "Каталог в базе, заказ ещё в памяти. После заказа перезапуск. Результат?",
    "e": "Промежуточное состояние: одно дело в двух местах.",
    "o": [
     "Всё на месте — каталог сохранён в базе",
     "Пропадёт и то, и другое — перезапуск чистит базу",
     "Заказ пропадёт, а склад останется уменьшенным",
     "Сервер не включится — база и память не совпадают"
    ]
   },
   {
    "q": "Вы поправили уже запущенную миграцию, добавив колонку, сервер перезапустился. Появится колонка?",
    "e": "Миграция запускается один раз.",
    "o": [
     "Да — миграция запускается при каждом перезапуске",
     "Да — synchronize сам добавит колонку",
     "Сервер даст ошибку — потому что файл изменился",
     "Нет — она уже запущена, нужна новая миграция"
    ]
   },
   {
    "q": "Из базы пришёл telegram_id, user.telegram_id === 111 дало false, а id равен 111. Причина?",
    "e": "node-pg возвращает bigint строкой.",
    "o": [
     "BIGINT приходит из базы строкой: \"111\"",
     "Id неверный — Telegram дал другой id",
     "База не подключена — пришло undefined",
     "=== на больших числах всегда даёт false"
    ]
   },
   {
    "q": "Клиент дважды быстро нажал кнопку, в корзине появились две одинаковые строки. Чего не хватает?",
    "e": "Сначала поиск, потом добавление — два запроса оба видят «нет».",
    "o": [
     "Транзакции — два нажатия не по очереди",
     "UNIQUE (user_id, product_id) + ON CONFLICT",
     "BIGINT — две строки из-за того, что id не влез",
     "Миграции — таблица корзины устарела"
    ]
   },
   {
    "q": "Один планшет, пять клиентов одновременно; код: findOneBy → if (stock < qty) → save. Есть CHECK (stock >= 0). Результат?",
    "e": "Каждый записал 0 — не отрицательное (в проверке — пятерым).",
    "o": [
     "Только одному — CHECK остановит остальных",
     "CHECK даст ошибку — склад станет отрицательным",
     "Продадут нескольким, склад 0, ошибки нет",
     "Deadlock — транзакции ждут друг друга"
    ]
   },
   {
    "q": "В транзакции CHECK дал ошибку, код в этой же транзакции сделал SELECT. Что выйдет?",
    "e": "После ошибки — только ROLLBACK.",
    "o": [
     "Обычный результат — SELECT работает отдельно",
     "База сама сделает COMMIT и даст результат",
     "0 rows — таблица опустеет",
     "Ошибка current transaction is aborted"
    ]
   }
  ]
 },
 "28": {
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
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S7, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.S7) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S11, { ...head(11), ...((typeof RU_S !== 'undefined' && RU_S.S11) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S19, { ...head(19), ...((typeof RU_S !== 'undefined' && RU_S.S19) || {}) });
  ru(S20, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.S20) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
  ru(S24, { ...head(24), ...((typeof RU_S !== 'undefined' && RU_S.S24) || {}) });
  ru(S25, { ...head(25), ...((typeof RU_S !== 'undefined' && RU_S.S25) || {}) });
  ru(S26, { ...head(26), ...((typeof RU_S !== 'undefined' && RU_S.S26) || {}) });
  ru(P5.S, { ...head(5), ...((typeof RU_S !== 'undefined' && RU_S.P5_S) || {}) });
  ru(P5.steps, RU_MDT[5].steps);
  ru(P5.trouble, RU_MDT[5].trouble);
  ru(P5.proof, RU_MDT[5].proof);
  ru(P12.S, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.P12_S) || {}) });
  ru(P12.steps, RU_MDT[12].steps);
  ru(P12.trouble, RU_MDT[12].trouble);
  ru(P12.proof, RU_MDT[12].proof);
  ru(P17.S, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.P17_S) || {}) });
  ru(P17.steps, RU_MDT[17].steps);
  ru(P17.trouble, RU_MDT[17].trouble);
  ru(P17.proof, RU_MDT[17].proof);
  ru(P23.S, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.P23_S) || {}) });
  ru(P23.steps, RU_MDT[23].steps);
  ru(P23.trouble, RU_MDT[23].trouble);
  ru(P23.proof, RU_MDT[23].proof);
  ru(FINAL, RU_MDT[27].final);
})();
