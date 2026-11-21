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

// AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-kod.py — OrderBotNest wh-start/wh-done, maydon-jamoa m13-dars-03 (manba/wh-out), haqiqiy chiqishlar (qo'lda tahrirlanmaydi)
const KOD_SIG = {
 "file": "src/api/payment/signature.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { createHmac, timingSafeEqual } from 'crypto';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// To'lov xizmati har xabarni imzolaydi: X-Signature = HMAC-SHA256(xom tana, PAYMENT_WEBHOOK_SECRET), 64 belgili hex.",
   "n": 3
  },
  {
   "t": "// Biz xuddi shu hisobni qilamiz va solishtiramiz. Kalit faqat bizda va xizmatda — boshqa hech kim to'g'ri imzo yasay olmaydi.",
   "n": 4
  },
  {
   "t": "export function sign(rawBody: Buffer | string, secret: string): string {",
   "n": 5
  },
  {
   "t": "  return createHmac('sha256', secret).update(rawBody).digest('hex');",
   "n": 6
  },
  {
   "t": "}",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "export function isValidSignature(",
   "n": 9
  },
  {
   "t": "  rawBody: Buffer | undefined,",
   "n": 10
  },
  {
   "t": "  header: unknown,",
   "n": 11
  },
  {
   "t": "  secret: string,",
   "n": 12
  },
  {
   "t": "): boolean {",
   "n": 13
  },
  {
   "t": "  // kalit bo'sh bo'lsa hech qanday xabar qabul qilinmaydi (bo'sh kalit bilan imzoni har kim yasaydi)",
   "n": 14
  },
  {
   "t": "  if (!secret || !rawBody || typeof header !== 'string') return false;",
   "n": 15
  },
  {
   "t": "  const expected = Buffer.from(sign(rawBody, secret), 'hex');",
   "n": 16
  },
  {
   "t": "  const got = Buffer.from(header, 'hex');",
   "n": 17
  },
  {
   "t": "  // uzunlik farq qilsa — darhol yo'q; teng bo'lsa timingSafeEqual: javob vaqtidan imzoni taxmin qilib bo'lmaydi",
   "n": 18
  },
  {
   "t": "  return got.length === expected.length && timingSafeEqual(got, expected);",
   "n": 19
  },
  {
   "t": "}",
   "n": 20
  }
 ]
};
const KOD_CTRL = {
 "file": "src/api/payment/payment.controller.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Body,",
   "n": 2
  },
  {
   "t": "  Controller,",
   "n": 3
  },
  {
   "t": "  Headers,",
   "n": 4
  },
  {
   "t": "  HttpCode,",
   "n": 5
  },
  {
   "t": "  Logger,",
   "n": 6
  },
  {
   "t": "  Post,",
   "n": 7
  },
  {
   "t": "  Req,",
   "n": 8
  },
  {
   "t": "  UnauthorizedException,",
   "n": 9
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 10
  },
  {
   "t": "import type { RawBodyRequest } from '@nestjs/common';",
   "n": 11
  },
  {
   "t": "import type { Request } from 'express';",
   "n": 12
  },
  {
   "t": "import { config } from '../../config';",
   "n": 13
  },
  {
   "t": "import { parsePayment } from './payment-input';",
   "n": 14
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 15
  },
  {
   "t": "import { isValidSignature } from './signature';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "@Controller('payments')",
   "n": 18
  },
  {
   "t": "export class PaymentController {",
   "n": 19
  },
  {
   "t": "  private readonly log = new Logger('Payment');",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  constructor(private readonly payments: PaymentService) {",
   "n": 22
  },
  {
   "t": "    if (!config.PAYMENT_WEBHOOK_SECRET) {",
   "n": 23
  },
  {
   "t": "      this.log.warn(",
   "n": 24
  },
  {
   "t": "        \"PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\",",
   "n": 25
  },
  {
   "t": "      );",
   "n": 26
  },
  {
   "t": "    }",
   "n": 27
  },
  {
   "t": "  }",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "  // To'lov xizmati natijani shu manzilga o'zi yuboradi. Tartib muhim:",
   "n": 30
  },
  {
   "t": "  // 1) imzo (xom tana bilan) → 2) maydonlar → 3) yozuv (takror — bir marta). Imzo yozuvdan OLDIN.",
   "n": 31
  },
  {
   "t": "  @Post('webhook')",
   "n": 32
  },
  {
   "t": "  @HttpCode(200)",
   "n": 33
  },
  {
   "t": "  async webhook(",
   "n": 34
  },
  {
   "t": "    @Req() req: RawBodyRequest<Request>,",
   "n": 35
  },
  {
   "t": "    @Headers('x-signature') signature: string | undefined,",
   "n": 36
  },
  {
   "t": "    @Body() body: unknown,",
   "n": 37
  },
  {
   "t": "  ) {",
   "n": 38
  },
  {
   "t": "    if (",
   "n": 39
  },
  {
   "t": "      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)",
   "n": 40
  },
  {
   "t": "    ) {",
   "n": 41
  },
  {
   "t": "      this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");",
   "n": 42
  },
  {
   "t": "      throw new UnauthorizedException(\"imzo noto'g'ri\");",
   "n": 43
  },
  {
   "t": "    }",
   "n": 44
  },
  {
   "t": "    const p = parsePayment(body);",
   "n": 45
  },
  {
   "t": "    const r = await this.payments.record(p);",
   "n": 46
  },
  {
   "t": "    this.log.log(",
   "n": 47
  },
  {
   "t": "      `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,",
   "n": 48
  },
  {
   "t": "    );",
   "n": 49
  },
  {
   "t": "    return { ok: true, duplicate: r.duplicate };",
   "n": 50
  },
  {
   "t": "  }",
   "n": 51
  },
  {
   "t": "}",
   "n": 52
  }
 ]
};
const KOD_SVC = {
 "file": "src/api/payment/payment.service.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { BadRequestException, Injectable } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 2
  },
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 3
  },
  {
   "t": "import { LiveGateway } from '../live/live.gateway';",
   "n": 4
  },
  {
   "t": "import type { PaymentInput } from './payment-input';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "@Injectable()",
   "n": 7
  },
  {
   "t": "export class PaymentService {",
   "n": 8
  },
  {
   "t": "  constructor(",
   "n": 9
  },
  {
   "t": "    private readonly ds: DataSource,",
   "n": 10
  },
  {
   "t": "    private readonly live: LiveGateway,",
   "n": 11
  },
  {
   "t": "  ) {}",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "  // Bitta tranzaksiya: payments ga qator va orders.payment_status.",
   "n": 14
  },
  {
   "t": "  // payment_id noyob: takror xabar (xizmat javobimizni olmay qayta yuborgan) — ON CONFLICT, hech narsa o'zgarmaydi.",
   "n": 15
  },
  {
   "t": "  // Rad etilgan to'lov ham yoziladi — lekin oldin to'langan buyurtmani «rad» ga tushirmaydi.",
   "n": 16
  },
  {
   "t": "  async record(p: PaymentInput): Promise<{ duplicate: boolean }> {",
   "n": 17
  },
  {
   "t": "    const res = await this.ds.transaction(async (m) => {",
   "n": 18
  },
  {
   "t": "      const order = await m.findOneBy(Order, { id: p.orderId });",
   "n": 19
  },
  {
   "t": "      if (!order) {",
   "n": 20
  },
  {
   "t": "        throw new BadRequestException(`buyurtma topilmadi: #${p.orderId}`);",
   "n": 21
  },
  {
   "t": "      }",
   "n": 22
  },
  {
   "t": "      if (p.amount !== order.total) {",
   "n": 23
  },
  {
   "t": "        throw new BadRequestException(",
   "n": 24
  },
  {
   "t": "          `summa mos emas: ${p.amount} \u2260 ${order.total}`,",
   "n": 25
  },
  {
   "t": "        );",
   "n": 26
  },
  {
   "t": "      }",
   "n": 27
  },
  {
   "t": "      const rows: unknown[] = await m.query(",
   "n": 28
  },
  {
   "t": "        `INSERT INTO payments (payment_id, order_id, status, amount)",
   "n": 29
  },
  {
   "t": "         VALUES ($1, $2, $3, $4)",
   "n": 30
  },
  {
   "t": "         ON CONFLICT (payment_id) DO NOTHING",
   "n": 31
  },
  {
   "t": "         RETURNING id`,",
   "n": 32
  },
  {
   "t": "        [p.paymentId, p.orderId, p.status, p.amount],",
   "n": 33
  },
  {
   "t": "      );",
   "n": 34
  },
  {
   "t": "      if (rows.length === 0) return { duplicate: true };",
   "n": 35
  },
  {
   "t": "      await m.query(",
   "n": 36
  },
  {
   "t": "        `UPDATE orders SET payment_status = $1",
   "n": 37
  },
  {
   "t": "         WHERE id = $2 AND payment_status IS DISTINCT FROM 'paid'`,",
   "n": 38
  },
  {
   "t": "        [p.status, p.orderId],",
   "n": 39
  },
  {
   "t": "      );",
   "n": 40
  },
  {
   "t": "      return { duplicate: false };",
   "n": 41
  },
  {
   "t": "    });",
   "n": 42
  },
  {
   "t": "    // tranzaksiya tugadi — panel so'raganda to'lov bazada bor (WebSocket-1 qoidasi)",
   "n": 43
  },
  {
   "t": "    if (!res.duplicate) this.live.orderChanged(p.orderId, 'payment');",
   "n": 44
  },
  {
   "t": "    return res;",
   "n": 45
  },
  {
   "t": "  }",
   "n": 46
  },
  {
   "t": "}",
   "n": 47
  }
 ]
};
const KOD_INPUT = {
 "file": "src/api/payment/payment-input.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { BadRequestException } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import type { PaymentStatus } from '../../core/entity';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "export type PaymentInput = {",
   "n": 4
  },
  {
   "t": "  paymentId: string;",
   "n": 5
  },
  {
   "t": "  orderId: number;",
   "n": 6
  },
  {
   "t": "  status: PaymentStatus;",
   "n": 7
  },
  {
   "t": "  amount: number;",
   "n": 8
  },
  {
   "t": "};",
   "n": 9
  },
  {
   "t": "",
   "n": 10
  },
  {
   "t": "// Imzo to'g'ri bo'lgandan keyin — maydonlar. Xato bo'lsa 400 va hech narsa yozilmaydi",
   "n": 11
  },
  {
   "t": "export function parsePayment(body: unknown): PaymentInput {",
   "n": 12
  },
  {
   "t": "  const b = (body ?? {}) as Record<string, unknown>;",
   "n": 13
  },
  {
   "t": "  if (typeof b.paymentId !== 'string' || !b.paymentId) {",
   "n": 14
  },
  {
   "t": "    throw new BadRequestException(\"paymentId yo'q\");",
   "n": 15
  },
  {
   "t": "  }",
   "n": 16
  },
  {
   "t": "  if (!Number.isInteger(b.orderId)) {",
   "n": 17
  },
  {
   "t": "    throw new BadRequestException(\"orderId butun son bo'lishi kerak\");",
   "n": 18
  },
  {
   "t": "  }",
   "n": 19
  },
  {
   "t": "  if (b.status !== 'paid' && b.status !== 'failed') {",
   "n": 20
  },
  {
   "t": "    throw new BadRequestException(\"status: 'paid' yoki 'failed'\");",
   "n": 21
  },
  {
   "t": "  }",
   "n": 22
  },
  {
   "t": "  if (!Number.isInteger(b.amount) || (b.amount as number) <= 0) {",
   "n": 23
  },
  {
   "t": "    throw new BadRequestException(\"amount musbat butun son bo'lishi kerak\");",
   "n": 24
  },
  {
   "t": "  }",
   "n": 25
  },
  {
   "t": "  return {",
   "n": 26
  },
  {
   "t": "    paymentId: b.paymentId,",
   "n": 27
  },
  {
   "t": "    orderId: b.orderId as number,",
   "n": 28
  },
  {
   "t": "    status: b.status,",
   "n": 29
  },
  {
   "t": "    amount: b.amount as number,",
   "n": 30
  },
  {
   "t": "  };",
   "n": 31
  },
  {
   "t": "}",
   "n": 32
  }
 ]
};
const KOD_MAIN = {
 "file": "src/main.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { NestFactory } from '@nestjs/core';",
   "n": 1
  },
  {
   "t": "import { AppModule } from './api/app.module';",
   "n": 2
  },
  {
   "t": "import { config } from './config';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "async function main() {",
   "n": 5
  },
  {
   "t": "  // rawBody: to'lov webhook'i imzosi xom baytlardan hisoblanadi — JSON qayta yozilsa imzo mos kelmaydi",
   "n": 6
  },
  {
   "t": "  const app = await NestFactory.create(AppModule, { rawBody: true });",
   "n": 7
  },
  {
   "t": "  await app.listen(config.PORT);",
   "n": 8
  },
  {
   "t": "  console.log(`Server ${config.PORT}-portda ishlayapti`);",
   "n": 9
  },
  {
   "t": "}",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "void main();",
   "n": 12
  }
 ]
};
const KOD_PAY = {
 "file": "scripts/pay.js",
 "tag": "wh-done",
 "lines": [
  {
   "t": "// npm run pay -- <buyurtma raqami> [ok | rad | ikki | imzosiz | soxta]",
   "n": 1
  },
  {
   "t": "// Soxta to'lov xizmati: haqiqiy xizmat qiladigan ishni qiladi — to'lov natijasini imzolab POST /payments/webhook ga yuboradi.",
   "n": 2
  },
  {
   "t": "// Summa buyurtmaning o'zidan olinadi (GET /admin/orders, ADMIN_PANEL_TOKEN bilan). Kalit — .env dagi PAYMENT_WEBHOOK_SECRET.",
   "n": 3
  },
  {
   "t": "//   ok      — to'landi (paid)",
   "n": 4
  },
  {
   "t": "//   rad     — rad etildi (failed)",
   "n": 5
  },
  {
   "t": "//   ikki    — bitta xabar ikki marta (javob yo'qolgandagi kabi) — ikkinchisi takror",
   "n": 6
  },
  {
   "t": "//   imzosiz — X-Signature sarlavhasisiz",
   "n": 7
  },
  {
   "t": "//   soxta   — boshqa kalit bilan imzolangan (kalitni bilmagan odam)",
   "n": 8
  },
  {
   "t": "const path = require('path');",
   "n": 9
  },
  {
   "t": "const { createHmac, randomBytes } = require('crypto');",
   "n": 10
  },
  {
   "t": "require('dotenv').config({",
   "n": 11
  },
  {
   "t": "  path: path.join(__dirname, '..', '.env'),",
   "n": 12
  },
  {
   "t": "  quiet: true,",
   "n": 13
  },
  {
   "t": "});",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "const url =",
   "n": 16
  },
  {
   "t": "  process.env.PAY_URL || `http://localhost:${process.env.PORT || 3000}`;",
   "n": 17
  },
  {
   "t": "const [id, mode = 'ok'] = process.argv.slice(2);",
   "n": 18
  },
  {
   "t": "const secret = process.env.PAYMENT_WEBHOOK_SECRET || '';",
   "n": 19
  },
  {
   "t": "const MODES = ['ok', 'rad', 'ikki', 'imzosiz', 'soxta'];",
   "n": 20
  },
  {
   "t": "if (!Number.isInteger(Number(id)) || !MODES.includes(mode)) {",
   "n": 21
  },
  {
   "t": "  console.log(",
   "n": 22
  },
  {
   "t": "    `ishlatish: npm run pay -- <buyurtma raqami> [${MODES.join(' | ')}]`,",
   "n": 23
  },
  {
   "t": "  );",
   "n": 24
  },
  {
   "t": "  process.exit(1);",
   "n": 25
  },
  {
   "t": "}",
   "n": 26
  },
  {
   "t": "const sign = (body, key) =>",
   "n": 27
  },
  {
   "t": "  createHmac('sha256', key).update(body).digest('hex');",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "async function send(body, signature) {",
   "n": 30
  },
  {
   "t": "  const headers = { 'Content-Type': 'application/json' };",
   "n": 31
  },
  {
   "t": "  if (signature) headers['X-Signature'] = signature;",
   "n": 32
  },
  {
   "t": "  const r = await fetch(`${url}/payments/webhook`, {",
   "n": 33
  },
  {
   "t": "    method: 'POST',",
   "n": 34
  },
  {
   "t": "    headers,",
   "n": 35
  },
  {
   "t": "    body,",
   "n": 36
  },
  {
   "t": "  });",
   "n": 37
  },
  {
   "t": "  console.log(`← ${r.status} ${await r.text()}`);",
   "n": 38
  },
  {
   "t": "}",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "(async () => {",
   "n": 41
  },
  {
   "t": "  const r = await fetch(`${url}/admin/orders`, {",
   "n": 42
  },
  {
   "t": "    headers: { Authorization: `Bearer ${process.env.ADMIN_PANEL_TOKEN}` },",
   "n": 43
  },
  {
   "t": "  });",
   "n": 44
  },
  {
   "t": "  if (!r.ok) {",
   "n": 45
  },
  {
   "t": "    console.log(",
   "n": 46
  },
  {
   "t": "      `GET /admin/orders → ${r.status} (.env dagi ADMIN_PANEL_TOKEN?)`,",
   "n": 47
  },
  {
   "t": "    );",
   "n": 48
  },
  {
   "t": "    process.exit(1);",
   "n": 49
  },
  {
   "t": "  }",
   "n": 50
  },
  {
   "t": "  const order = (await r.json()).find((o) => o.id === Number(id));",
   "n": 51
  },
  {
   "t": "  if (!order) {",
   "n": 52
  },
  {
   "t": "    console.log(`#${id} oxirgi 20 buyurtma ichida yo'q`);",
   "n": 53
  },
  {
   "t": "    process.exit(1);",
   "n": 54
  },
  {
   "t": "  }",
   "n": 55
  },
  {
   "t": "  const body = JSON.stringify({",
   "n": 56
  },
  {
   "t": "    paymentId: `pay_${randomBytes(4).toString('hex')}`,",
   "n": 57
  },
  {
   "t": "    orderId: order.id,",
   "n": 58
  },
  {
   "t": "    status: mode === 'rad' ? 'failed' : 'paid',",
   "n": 59
  },
  {
   "t": "    amount: order.total,",
   "n": 60
  },
  {
   "t": "  });",
   "n": 61
  },
  {
   "t": "  const signature =",
   "n": 62
  },
  {
   "t": "    mode === 'imzosiz'",
   "n": 63
  },
  {
   "t": "      ? ''",
   "n": 64
  },
  {
   "t": "      : sign(body, mode === 'soxta' ? 'boshqa-kalit' : secret);",
   "n": 65
  },
  {
   "t": "  console.log(`→ POST /payments/webhook ${body}`);",
   "n": 66
  },
  {
   "t": "  console.log(",
   "n": 67
  },
  {
   "t": "    `  X-Signature: ${signature ? signature.slice(0, 16) + '…' : \"(yo'q)\"}`,",
   "n": 68
  },
  {
   "t": "  );",
   "n": 69
  },
  {
   "t": "  await send(body, signature);",
   "n": 70
  },
  {
   "t": "  if (mode === 'ikki') {",
   "n": 71
  },
  {
   "t": "    console.log(",
   "n": 72
  },
  {
   "t": "      '→ xuddi shu xabar yana (xizmat javobni olmagan deb qayta yubordi)',",
   "n": 73
  },
  {
   "t": "    );",
   "n": 74
  },
  {
   "t": "    await send(body, signature);",
   "n": 75
  },
  {
   "t": "  }",
   "n": 76
  },
  {
   "t": "})().catch((e) => {",
   "n": 77
  },
  {
   "t": "  console.log(`xato: ${e.message} — server ishlayaptimi? (${url})`);",
   "n": 78
  },
  {
   "t": "  process.exit(1);",
   "n": 79
  },
  {
   "t": "});",
   "n": 80
  }
 ]
};
const KOD_ENV = {
 "file": ".env.example",
 "tag": "wh-done",
 "lines": [
  {
   "t": "# Bu faylni nusxalab .env deb nomlang. .env git'ga tushmaydi.",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "# @BotFather beradi (Telegramda /newbot)",
   "n": 3
  },
  {
   "t": "BOT_TOKEN=",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "# Admin bo'ladigan Telegram id'lar, vergul bilan (o'zingiznikini @userinfobot dan oling)",
   "n": 6
  },
  {
   "t": "ADMIN_TELEGRAM_IDS=",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "# Jonli panel (http://localhost:3000/admin) va WebSocket ulanishi uchun maxfiy so'z — o'zingiz o'ylab topasiz.",
   "n": 9
  },
  {
   "t": "# Bo'sh qolsa panelga hech kim kira olmaydi.",
   "n": 10
  },
  {
   "t": "ADMIN_PANEL_TOKEN=",
   "n": 11
  },
  {
   "t": "",
   "n": 12
  },
  {
   "t": "# To'lov xizmati bilan umumiy maxfiy kalit: webhook imzosi (X-Signature) shu bilan tekshiriladi.",
   "n": 13
  },
  {
   "t": "# Bo'sh qolsa har to'lov xabari 401 bilan rad etiladi. Lokal sinov: npm run pay -- <buyurtma raqami>",
   "n": 14
  },
  {
   "t": "PAYMENT_WEBHOOK_SECRET=",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "# PostgreSQL (lokal: PG-1 darsida o'rnatilgan). Baza oldindan yaratilgan bo'lsin: CREATE DATABASE shop;",
   "n": 17
  },
  {
   "t": "DATABASE_URL=postgresql://postgres:parol@localhost:5432/shop",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "# true — TypeORM har SQL so'rovni terminalga yozadi (o'rganish uchun qulay)",
   "n": 20
  },
  {
   "t": "DB_LOGGING=true",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "# Server porti (hosting o'zi beradi, lokalda tegmaysiz)",
   "n": 23
  },
  {
   "t": "PORT=3000",
   "n": 24
  }
 ]
};
const KOD_CONFIG = {
 "file": "src/config/index.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import * as dotenv from 'dotenv';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "dotenv.config({ quiet: true });",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "export const config = {",
   "n": 5
  },
  {
   "t": "  PORT: Number(process.env.PORT) || 3000,",
   "n": 6
  },
  {
   "t": "  DATABASE_URL: String(process.env.DATABASE_URL || ''),",
   "n": 7
  },
  {
   "t": "  // true bo'lsa TypeORM har SQL so'rovni terminalga yozadi — o'rganish uchun",
   "n": 8
  },
  {
   "t": "  DB_LOGGING: process.env.DB_LOGGING === 'true',",
   "n": 9
  },
  {
   "t": "  BOT_TOKEN: String(process.env.BOT_TOKEN || ''),",
   "n": 10
  },
  {
   "t": "  // jonli panel (/admin) va WebSocket ulanishi uchun maxfiy so'z — o'zingiz o'ylab topasiz",
   "n": 11
  },
  {
   "t": "  ADMIN_PANEL_TOKEN: String(process.env.ADMIN_PANEL_TOKEN || ''),",
   "n": 12
  },
  {
   "t": "  // to'lov xizmati bilan umumiy maxfiy kalit: webhook imzosi shu bilan tekshiriladi (faqat .env da, kodga yozilmaydi)",
   "n": 13
  },
  {
   "t": "  PAYMENT_WEBHOOK_SECRET: String(process.env.PAYMENT_WEBHOOK_SECRET || ''),",
   "n": 14
  },
  {
   "t": "  // \"123,456\" → [123, 456]",
   "n": 15
  },
  {
   "t": "  ADMIN_TELEGRAM_IDS: String(process.env.ADMIN_TELEGRAM_IDS || '')",
   "n": 16
  },
  {
   "t": "    .split(',')",
   "n": 17
  },
  {
   "t": "    .map((s) => s.trim())",
   "n": 18
  },
  {
   "t": "    .filter(Boolean)",
   "n": 19
  },
  {
   "t": "    .map(Number),",
   "n": 20
  },
  {
   "t": "};",
   "n": 21
  }
 ]
};
const KOD_MIG = {
 "file": "src/infrastructure/migrations/1762300000000-payments.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { MigrationInterface, QueryRunner } from 'typeorm';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// To'lov xabarlari: har xabar — bitta qator. payment_id NOYOB — xizmat bitta xabarni ikki marta yuborsa,",
   "n": 3
  },
  {
   "t": "// ikkinchisi yozilmaydi (takror). orders.payment_status — panelda ko'rinadigan oxirgi holat.",
   "n": 4
  },
  {
   "t": "export class Payments1762300000000 implements MigrationInterface {",
   "n": 5
  },
  {
   "t": "  name = 'Payments1762300000000';",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "  public async up(q: QueryRunner): Promise<void> {",
   "n": 8
  },
  {
   "t": "    await q.query(`CREATE TABLE \"payments\" (",
   "n": 9
  },
  {
   "t": "      \"id\" SERIAL PRIMARY KEY,",
   "n": 10
  },
  {
   "t": "      \"payment_id\" VARCHAR NOT NULL UNIQUE,",
   "n": 11
  },
  {
   "t": "      \"order_id\" INTEGER NOT NULL REFERENCES \"orders\"(\"id\"),",
   "n": 12
  },
  {
   "t": "      \"status\" VARCHAR NOT NULL CHECK (\"status\" IN ('paid', 'failed')),",
   "n": 13
  },
  {
   "t": "      \"amount\" INTEGER NOT NULL,",
   "n": 14
  },
  {
   "t": "      \"created_at\" TIMESTAMP NOT NULL DEFAULT now()",
   "n": 15
  },
  {
   "t": "    )`);",
   "n": 16
  },
  {
   "t": "    await q.query(`ALTER TABLE \"orders\" ADD COLUMN \"payment_status\" VARCHAR`);",
   "n": 17
  },
  {
   "t": "  }",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "  public async down(q: QueryRunner): Promise<void> {",
   "n": 20
  },
  {
   "t": "    await q.query(`ALTER TABLE \"orders\" DROP COLUMN \"payment_status\"`);",
   "n": 21
  },
  {
   "t": "    await q.query(`DROP TABLE \"payments\"`);",
   "n": 22
  },
  {
   "t": "  }",
   "n": 23
  },
  {
   "t": "}",
   "n": 24
  }
 ]
};
const KOD_CSPEC = {
 "file": "src/api/payment/payment.controller.spec.ts",
 "tag": "wh-done",
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
   "t": "import { config } from '../../config';",
   "n": 4
  },
  {
   "t": "import { PaymentController } from './payment.controller';",
   "n": 5
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 6
  },
  {
   "t": "import { sign } from './signature';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "// Baza o'rniga mock servis. App rawBody: true bilan — main.ts dagi kabi",
   "n": 9
  },
  {
   "t": "const KEY = 'sinov-kalit';",
   "n": 10
  },
  {
   "t": "const record = jest.fn(async () => ({ duplicate: false }));",
   "n": 11
  },
  {
   "t": "const body = JSON.stringify({",
   "n": 12
  },
  {
   "t": "  paymentId: 'pay_1',",
   "n": 13
  },
  {
   "t": "  orderId: 5,",
   "n": 14
  },
  {
   "t": "  status: 'paid',",
   "n": 15
  },
  {
   "t": "  amount: 120000,",
   "n": 16
  },
  {
   "t": "});",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "describe('PaymentController — POST /payments/webhook', () => {",
   "n": 19
  },
  {
   "t": "  let app: INestApplication;",
   "n": 20
  },
  {
   "t": "  const post = (b: string, sig?: string) => {",
   "n": 21
  },
  {
   "t": "    const r = request(app.getHttpServer())",
   "n": 22
  },
  {
   "t": "      .post('/payments/webhook')",
   "n": 23
  },
  {
   "t": "      .set('Content-Type', 'application/json');",
   "n": 24
  },
  {
   "t": "    return (sig ? r.set('X-Signature', sig) : r).send(b);",
   "n": 25
  },
  {
   "t": "  };",
   "n": 26
  },
  {
   "t": "",
   "n": 27
  },
  {
   "t": "  beforeAll(async () => {",
   "n": 28
  },
  {
   "t": "    config.PAYMENT_WEBHOOK_SECRET = KEY;",
   "n": 29
  },
  {
   "t": "    const mod = await Test.createTestingModule({",
   "n": 30
  },
  {
   "t": "      controllers: [PaymentController],",
   "n": 31
  },
  {
   "t": "      providers: [{ provide: PaymentService, useValue: { record } }],",
   "n": 32
  },
  {
   "t": "    }).compile();",
   "n": 33
  },
  {
   "t": "    app = mod.createNestApplication({ rawBody: true, logger: false });",
   "n": 34
  },
  {
   "t": "    await app.init();",
   "n": 35
  },
  {
   "t": "  });",
   "n": 36
  },
  {
   "t": "",
   "n": 37
  },
  {
   "t": "  beforeEach(() => record.mockClear());",
   "n": 38
  },
  {
   "t": "  afterAll(() => app.close());",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "  it('imzosiz — 401, yozuvga yetmaydi', async () => {",
   "n": 41
  },
  {
   "t": "    const res = await post(body);",
   "n": 42
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 43
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 44
  },
  {
   "t": "  });",
   "n": 45
  },
  {
   "t": "",
   "n": 46
  },
  {
   "t": "  it('boshqa kalit bilan — 401', async () => {",
   "n": 47
  },
  {
   "t": "    const res = await post(body, sign(body, 'boshqa-kalit'));",
   "n": 48
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 49
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 50
  },
  {
   "t": "  });",
   "n": 51
  },
  {
   "t": "",
   "n": 52
  },
  {
   "t": "  it(\"imzodan keyin tana o'zgargan — 401\", async () => {",
   "n": 53
  },
  {
   "t": "    const res = await post(body.replace('120000', '1200'), sign(body, KEY));",
   "n": 54
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 55
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
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
   "t": "  it(\"to'g'ri imzo — 200, servisga aynan shu to'lov\", async () => {",
   "n": 59
  },
  {
   "t": "    const res = await post(body, sign(body, KEY));",
   "n": 60
  },
  {
   "t": "    expect(res.status).toBe(200);",
   "n": 61
  },
  {
   "t": "    expect(res.body).toEqual({ ok: true, duplicate: false });",
   "n": 62
  },
  {
   "t": "    expect(record).toHaveBeenCalledWith({",
   "n": 63
  },
  {
   "t": "      paymentId: 'pay_1',",
   "n": 64
  },
  {
   "t": "      orderId: 5,",
   "n": 65
  },
  {
   "t": "      status: 'paid',",
   "n": 66
  },
  {
   "t": "      amount: 120000,",
   "n": 67
  },
  {
   "t": "    });",
   "n": 68
  },
  {
   "t": "  });",
   "n": 69
  },
  {
   "t": "",
   "n": 70
  },
  {
   "t": "  it(\"imzo to'g'ri, maydon xato — 400, yozilmaydi\", async () => {",
   "n": 71
  },
  {
   "t": "    const bad = JSON.stringify({",
   "n": 72
  },
  {
   "t": "      paymentId: 'pay_2',",
   "n": 73
  },
  {
   "t": "      orderId: 5,",
   "n": 74
  },
  {
   "t": "      status: 'ok',",
   "n": 75
  },
  {
   "t": "      amount: 120000,",
   "n": 76
  },
  {
   "t": "    });",
   "n": 77
  },
  {
   "t": "    const res = await post(bad, sign(bad, KEY));",
   "n": 78
  },
  {
   "t": "    expect(res.status).toBe(400);",
   "n": 79
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 80
  },
  {
   "t": "  });",
   "n": 81
  },
  {
   "t": "",
   "n": 82
  },
  {
   "t": "  it(\"kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401\", async () => {",
   "n": 83
  },
  {
   "t": "    config.PAYMENT_WEBHOOK_SECRET = '';",
   "n": 84
  },
  {
   "t": "    const res = await post(body, sign(body, ''));",
   "n": 85
  },
  {
   "t": "    config.PAYMENT_WEBHOOK_SECRET = KEY;",
   "n": 86
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 87
  },
  {
   "t": "  });",
   "n": 88
  },
  {
   "t": "});",
   "n": 89
  }
 ]
};
const KOD_CTRL_TARTIB = {
 "file": "src/api/payment/payment.controller.ts",
 "tag": "tartib nusxa",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Body,",
   "n": 2
  },
  {
   "t": "  Controller,",
   "n": 3
  },
  {
   "t": "  Headers,",
   "n": 4
  },
  {
   "t": "  HttpCode,",
   "n": 5
  },
  {
   "t": "  Logger,",
   "n": 6
  },
  {
   "t": "  Post,",
   "n": 7
  },
  {
   "t": "  Req,",
   "n": 8
  },
  {
   "t": "  UnauthorizedException,",
   "n": 9
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 10
  },
  {
   "t": "import type { RawBodyRequest } from '@nestjs/common';",
   "n": 11
  },
  {
   "t": "import type { Request } from 'express';",
   "n": 12
  },
  {
   "t": "import { config } from '../../config';",
   "n": 13
  },
  {
   "t": "import { parsePayment } from './payment-input';",
   "n": 14
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 15
  },
  {
   "t": "import { isValidSignature } from './signature';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "@Controller('payments')",
   "n": 18
  },
  {
   "t": "export class PaymentController {",
   "n": 19
  },
  {
   "t": "  private readonly log = new Logger('Payment');",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  constructor(private readonly payments: PaymentService) {",
   "n": 22
  },
  {
   "t": "    if (!config.PAYMENT_WEBHOOK_SECRET) {",
   "n": 23
  },
  {
   "t": "      this.log.warn(",
   "n": 24
  },
  {
   "t": "        \"PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\",",
   "n": 25
  },
  {
   "t": "      );",
   "n": 26
  },
  {
   "t": "    }",
   "n": 27
  },
  {
   "t": "  }",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "  // To'lov xizmati natijani shu manzilga o'zi yuboradi. Tartib muhim:",
   "n": 30
  },
  {
   "t": "  // 1) imzo (xom tana bilan) → 2) maydonlar → 3) yozuv (takror — bir marta). Imzo yozuvdan OLDIN.",
   "n": 31
  },
  {
   "t": "  @Post('webhook')",
   "n": 32
  },
  {
   "t": "  @HttpCode(200)",
   "n": 33
  },
  {
   "t": "  async webhook(",
   "n": 34
  },
  {
   "t": "    @Req() req: RawBodyRequest<Request>,",
   "n": 35
  },
  {
   "t": "    @Headers('x-signature') signature: string | undefined,",
   "n": 36
  },
  {
   "t": "    @Body() body: unknown,",
   "n": 37
  },
  {
   "t": "  ) {",
   "n": 38
  },
  {
   "t": "    const p = parsePayment(body);",
   "n": 39
  },
  {
   "t": "    const r = await this.payments.record(p);",
   "n": 40
  },
  {
   "t": "    if (",
   "n": 41
  },
  {
   "t": "      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)",
   "n": 42
  },
  {
   "t": "    ) {",
   "n": 43
  },
  {
   "t": "      this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");",
   "n": 44
  },
  {
   "t": "      throw new UnauthorizedException(\"imzo noto'g'ri\");",
   "n": 45
  },
  {
   "t": "    }",
   "n": 46
  },
  {
   "t": "    this.log.log(",
   "n": 47
  },
  {
   "t": "      `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,",
   "n": 48
  },
  {
   "t": "    );",
   "n": 49
  },
  {
   "t": "    return { ok: true, duplicate: r.duplicate };",
   "n": 50
  },
  {
   "t": "  }",
   "n": 51
  },
  {
   "t": "}",
   "n": 52
  }
 ]
};
const KOD_CTRL_JSON = {
 "file": "src/api/payment/payment.controller.ts",
 "tag": "json nusxa",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Body,",
   "n": 2
  },
  {
   "t": "  Controller,",
   "n": 3
  },
  {
   "t": "  Headers,",
   "n": 4
  },
  {
   "t": "  HttpCode,",
   "n": 5
  },
  {
   "t": "  Logger,",
   "n": 6
  },
  {
   "t": "  Post,",
   "n": 7
  },
  {
   "t": "  Req,",
   "n": 8
  },
  {
   "t": "  UnauthorizedException,",
   "n": 9
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 10
  },
  {
   "t": "import type { RawBodyRequest } from '@nestjs/common';",
   "n": 11
  },
  {
   "t": "import type { Request } from 'express';",
   "n": 12
  },
  {
   "t": "import { config } from '../../config';",
   "n": 13
  },
  {
   "t": "import { parsePayment } from './payment-input';",
   "n": 14
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 15
  },
  {
   "t": "import { isValidSignature } from './signature';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "@Controller('payments')",
   "n": 18
  },
  {
   "t": "export class PaymentController {",
   "n": 19
  },
  {
   "t": "  private readonly log = new Logger('Payment');",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  constructor(private readonly payments: PaymentService) {",
   "n": 22
  },
  {
   "t": "    if (!config.PAYMENT_WEBHOOK_SECRET) {",
   "n": 23
  },
  {
   "t": "      this.log.warn(",
   "n": 24
  },
  {
   "t": "        \"PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\",",
   "n": 25
  },
  {
   "t": "      );",
   "n": 26
  },
  {
   "t": "    }",
   "n": 27
  },
  {
   "t": "  }",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "  // To'lov xizmati natijani shu manzilga o'zi yuboradi. Tartib muhim:",
   "n": 30
  },
  {
   "t": "  // 1) imzo (xom tana bilan) → 2) maydonlar → 3) yozuv (takror — bir marta). Imzo yozuvdan OLDIN.",
   "n": 31
  },
  {
   "t": "  @Post('webhook')",
   "n": 32
  },
  {
   "t": "  @HttpCode(200)",
   "n": 33
  },
  {
   "t": "  async webhook(",
   "n": 34
  },
  {
   "t": "    @Req() req: RawBodyRequest<Request>,",
   "n": 35
  },
  {
   "t": "    @Headers('x-signature') signature: string | undefined,",
   "n": 36
  },
  {
   "t": "    @Body() body: unknown,",
   "n": 37
  },
  {
   "t": "  ) {",
   "n": 38
  },
  {
   "t": "    if (",
   "n": 39
  },
  {
   "t": "      !isValidSignature(",
   "n": 40
  },
  {
   "t": "        Buffer.from(JSON.stringify(body)),",
   "n": 41
  },
  {
   "t": "        signature,",
   "n": 42
  },
  {
   "t": "        config.PAYMENT_WEBHOOK_SECRET,",
   "n": 43
  },
  {
   "t": "      )",
   "n": 44
  },
  {
   "t": "    ) {",
   "n": 45
  },
  {
   "t": "      this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");",
   "n": 46
  },
  {
   "t": "      throw new UnauthorizedException(\"imzo noto'g'ri\");",
   "n": 47
  },
  {
   "t": "    }",
   "n": 48
  },
  {
   "t": "    const p = parsePayment(body);",
   "n": 49
  },
  {
   "t": "    const r = await this.payments.record(p);",
   "n": 50
  },
  {
   "t": "    this.log.log(",
   "n": 51
  },
  {
   "t": "      `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    return { ok: true, duplicate: r.duplicate };",
   "n": 54
  },
  {
   "t": "  }",
   "n": 55
  },
  {
   "t": "}",
   "n": 56
  }
 ]
};
const KOD_MAIN_NORAW = {
 "file": "src/main.ts",
 "tag": "norawbody nusxa",
 "lines": [
  {
   "t": "import { NestFactory } from '@nestjs/core';",
   "n": 1
  },
  {
   "t": "import { AppModule } from './api/app.module';",
   "n": 2
  },
  {
   "t": "import { config } from './config';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "async function main() {",
   "n": 5
  },
  {
   "t": "  // rawBody: to'lov webhook'i imzosi xom baytlardan hisoblanadi — JSON qayta yozilsa imzo mos kelmaydi",
   "n": 6
  },
  {
   "t": "  const app = await NestFactory.create(AppModule);",
   "n": 7
  },
  {
   "t": "  await app.listen(config.PORT);",
   "n": 8
  },
  {
   "t": "  console.log(`Server ${config.PORT}-portda ishlayapti`);",
   "n": 9
  },
  {
   "t": "}",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "void main();",
   "n": 12
  }
 ]
};
const KOD_README = {
 "file": "README.md",
 "tag": "wh-done",
 "lines": [
  {
   "t": "## To'lov webhook'i",
   "n": 65
  },
  {
   "t": "To'lov xizmati (Payme, Click kabi) mijoz to'laganini **o'zi** serverga xabar qiladi: `POST /payments/webhook`. Ilova yoki mijozning «to'ladim» degani dalil emas — dalil faqat xizmatning imzoli xabari.",
   "n": 67
  },
  {
   "t": "| Qadam | Nima tekshiriladi | Xato bo'lsa |",
   "n": 69
  },
  {
   "t": "|---|---|---|",
   "n": 70
  },
  {
   "t": "| 1 · imzo | `X-Signature` = HMAC-SHA256(**xom tana**, `PAYMENT_WEBHOOK_SECRET`) | `401`, hech narsa yozilmaydi |",
   "n": 71
  },
  {
   "t": "| 2 · maydonlar | `paymentId`, `orderId`, `status: 'paid' \\| 'failed'`, `amount` | `400` |",
   "n": 72
  },
  {
   "t": "| 3 · buyurtma | buyurtma bor va `amount` = `total` | `400` |",
   "n": 73
  },
  {
   "t": "| 4 · yozuv | `payments` ga qator — `payment_id` noyob | takror: `200 { duplicate: true }`, ikkinchi qator yo'q |",
   "n": 74
  },
  {
   "t": "| 5 · panel | `order-changed { orderId, reason: 'payment' }` | — |",
   "n": 75
  },
  {
   "t": "- Imzo **yozuvdan oldin** tekshiriladi. Kalit faqat `.env` da (va hostingda) — kodga, git'ga, chatga yozilmaydi; bo'sh bo'lsa har xabar `401`.",
   "n": 77
  },
  {
   "t": "- Imzo baytlardan hisoblanadi: server `rawBody: true` bilan ishga tushadi (`main.ts`). JSON qayta yozilsa (bo'sh joy, kalitlar tartibi) imzo mos kelmaydi.",
   "n": 78
  },
  {
   "t": "- Rad etilgan to'lov ham yoziladi (`status: 'failed'`); oldin to'langan buyurtmani «rad» ga tushirmaydi. Panelda «To'lov» ustuni.",
   "n": 79
  },
  {
   "t": "- Lokal sinov (haqiqiy xizmatsiz): `npm run pay -- <buyurtma raqami> [ok | rad | ikki | imzosiz | soxta]` — xabarni xizmat kabi imzolab yuboradi.",
   "n": 80
  },
  {
   "t": "- Telegram'siz tekshirish: `npm run smoke -- payment`.",
   "n": 81
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nP HEAD 71c72a4 ws2-done: qayta ulanish — panel va npm run live har connect'da ro'yxatni \n M .env.example\n M README.md\n M package.json\n M public/admin.html\n M scripts/smoke.js\n M src/api/app.module.ts\n M src/api/live/admin.controller.spec.ts\n M src/api/live/admin.controller.ts\n M src/api/live/live.gateway.ts\n M src/config/index.ts\n M src/core/entity/index.ts\n M src/core/entity/order.entity.ts\n M src/infrastructure/data-source.ts\n M src/main.ts\n?? scripts/pay.js\n?? src/api/payment/\n?? src/core/entity/payment.entity.ts\n?? src/infrastructure/migrations/1762300000000-payments.ts\n@nestjs/core 11.2.8\n@nestjs/platform-express 11.2.8\nGoogle Chrome 148.0.7778.96 \nWed Nov  4 10:23:37 PM +05 2026";
const KOD_OUT_00B = "# nusxalar farqi (done → buzilgan)\n## main.ts: done → norawbody\n@@ -4,7 +4,7 @@\n \n async function main() {\n   // rawBody: to'lov webhook'i imzosi xom baytlardan hisoblanadi — JSON qayta yozilsa imzo mos kelmaydi\n-  const app = await NestFactory.create(AppModule, { rawBody: true });\n+  const app = await NestFactory.create(AppModule);\n   await app.listen(config.PORT);\n   console.log(`Server ${config.PORT}-portda ishlayapti`);\n }\n## payment.controller.ts: done → tartib\n@@ -36,14 +36,14 @@\n     @Headers('x-signature') signature: string | undefined,\n     @Body() body: unknown,\n   ) {\n+    const p = parsePayment(body);\n+    const r = await this.payments.record(p);\n     if (\n       !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)\n     ) {\n       this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");\n       throw new UnauthorizedException(\"imzo noto'g'ri\");\n     }\n-    const p = parsePayment(body);\n-    const r = await this.payments.record(p);\n     this.log.log(\n       `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,\n     );\n## payment.controller.ts: done → json\n@@ -37,7 +37,11 @@\n     @Body() body: unknown,\n   ) {\n     if (\n-      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)\n+      !isValidSignature(\n+        Buffer.from(JSON.stringify(body)),\n+        signature,\n+        config.PAYMENT_WEBHOOK_SECRET,\n+      )\n     ) {\n       this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");\n       throw new UnauthorizedException(\"imzo noto'g'ri\");";
const KOD_OUT_01 = "# wh-start (= ws2-done): to'lov xizmati xabar yubordi — server bunday manzilni bilmaydi\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'Content-Type: application/json' -d '{\"paymentId\":\"pay_1\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}'\n{\"message\":\"Cannot POST /payments/webhook\",\"error\":\"Not Found\",\"statusCode\":404}\n\n$ psql: SELECT id, status, total FROM orders\n id | status | total  \n----+--------+--------\n  1 | NEW    | 120000\n(1 row)";
const KOD_OUT_02 = "# wh-done: npm run start — main.ts rawBody bilan, yangi yo'l POST /payments/webhook\n22:21:41 main.ts: NestFactory.create(AppModule, {\"rawBody\":true})\nLOG [RoutesResolver] PaymentController {/payments}:\nLOG [RouterExplorer] Mapped {/payments/webhook, POST} route\nServer 3100-portda ishlayapti\n\n$ psql: \\d payments\n                                        Table \"public.payments\"\n   Column   |            Type             | Collation | Nullable |               Default                \n------------+-----------------------------+-----------+----------+--------------------------------------\n id         | integer                     |           | not null | nextval('payments_id_seq'::regclass)\n payment_id | character varying           |           | not null | \n order_id   | integer                     |           | not null | \n status     | character varying           |           | not null | \n amount     | integer                     |           | not null | \n created_at | timestamp without time zone |           | not null | now()\nIndexes:\n    \"payments_pkey\" PRIMARY KEY, btree (id)\n    \"payments_payment_id_key\" UNIQUE CONSTRAINT, btree (payment_id)\nCheck constraints:";
const KOD_OUT_03 = "# wh-done: Bobur buyurtma berdi (#1) — to'lov xizmati xabar yuboradi\n$ npm run pay -- 1\n→ POST /payments/webhook {\"paymentId\":\"pay_0005d844\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: 5c73334670107a1f…\n← 200 {\"ok\":true,\"duplicate\":false}\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nLOG [Payment] pay_0005d844 · #1 · paid · 120000\n\n$ psql: SELECT payment_id, order_id, status, amount FROM payments\n  payment_id  | order_id | status | amount \n--------------+----------+--------+--------\n pay_0005d844 |        1 | paid   | 120000\n(1 row)\n$ psql: SELECT id, total, payment_status FROM orders\n id | total  | payment_status \n----+--------+----------------\n  1 | 120000 | paid\n(1 row)";
const KOD_OUT_04 = "# wh-done: xizmat javobni olmadi deb bitta xabarni qayta yubordi\n$ npm run pay -- 1 ikki\n→ POST /payments/webhook {\"paymentId\":\"pay_b96e99d4\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: e95d82d564f7b419…\n← 200 {\"ok\":true,\"duplicate\":false}\n→ xuddi shu xabar yana (xizmat javobni olmagan deb qayta yubordi)\n← 200 {\"ok\":true,\"duplicate\":true}\n\n## Server logi\nLOG [Payment] pay_b96e99d4 · #1 · paid · 120000\nLOG [Payment] pay_b96e99d4 · #1 · paid · 120000 — takror, yozilmadi\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n  payment_id  | order_id | status \n--------------+----------+--------\n pay_0005d844 |        1 | paid\n pay_b96e99d4 |        1 | paid\n(2 rows)";
const KOD_OUT_05 = "# wh-done: imzosiz va boshqa kalit bilan (kalitni bilmagan odam) — xabar rad etiladi\n$ npm run pay -- 1 imzosiz\n→ POST /payments/webhook {\"paymentId\":\"pay_d4dd85bf\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: (yo'q)\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n$ npm run pay -- 1 soxta\n→ POST /payments/webhook {\"paymentId\":\"pay_233cc12f\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: b42930c1ee36e342…\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n## Server logi\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  2\n(1 row)";
const KOD_OUT_06 = "# wh-done: ikkinchi buyurtma (#2) — to'lov RAD etildi (karta rad etdi): xabar keladi va yoziladi\n$ npm run pay -- 2 rad\n→ POST /payments/webhook {\"paymentId\":\"pay_9cef5e2f\",\"orderId\":2,\"status\":\"failed\",\"amount\":120000}\n  X-Signature: 58869dd5151fbf84…\n← 200 {\"ok\":true,\"duplicate\":false}\n\n## Server logi\nLOG [Payment] pay_9cef5e2f · #2 · failed · 120000\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n  payment_id  | order_id | status \n--------------+----------+--------\n pay_0005d844 |        1 | paid\n pay_b96e99d4 |        1 | paid\n pay_9cef5e2f |        2 | failed\n(3 rows)\n$ psql: SELECT id, payment_status FROM orders ORDER BY id\n id | payment_status \n----+----------------\n  1 | paid\n  2 | failed\n(2 rows)";
const KOD_OUT_07DONE = "# nusxa: done — xizmat JSON'ni bo'sh joy bilan yubordi, imzo shu baytlardan (to'g'ri)\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: 88e7dfffff6a3624…' -d '{ \"paymentId\": \"pay_bosh_joy\", \"orderId\": 1, \"status\": \"paid\", \"amount\": 120000 }'\n{\"ok\":true,\"duplicate\":false}\n← 200\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nLOG [Payment] pay_bosh_joy · #1 · paid · 120000\n\n$ psql: SELECT payment_id, status FROM payments\n  payment_id  | status \n--------------+--------\n pay_bosh_joy | paid\n(1 row)";
const KOD_OUT_07JSON = "# nusxa: json — xizmat JSON'ni bo'sh joy bilan yubordi, imzo shu baytlardan (to'g'ri)\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: 88e7dfffff6a3624…' -d '{ \"paymentId\": \"pay_bosh_joy\", \"orderId\": 1, \"status\": \"paid\", \"amount\": 120000 }'\n{\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n← 401\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT payment_id, status FROM payments\n payment_id | status \n------------+--------\n(0 rows)";
const KOD_OUT_08 = "# nusxa: norawbody — main.ts da { rawBody: true } yo'q\n22:22:16 main.ts: NestFactory.create(AppModule)\n\n$ npm run pay -- 1\n→ POST /payments/webhook {\"paymentId\":\"pay_fda9f50b\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: 4cfe76e89b38a3ab…\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  0\n(1 row)";
const KOD_OUT_09 = "# nusxa: tartib — parsePayment va record imzo tekshiruvidan OLDIN\n$ npm run pay -- 1 imzosiz\n→ POST /payments/webhook {\"paymentId\":\"pay_e714112c\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: (yo'q)\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n  payment_id  | order_id | status \n--------------+----------+--------\n pay_e714112c |        1 | paid\n(1 row)\n$ psql: SELECT id, payment_status FROM orders\n id | payment_status \n----+----------------\n  1 | paid\n(1 row)";
const KOD_OUT_09B = "22:22:23.603 brauzer: WebSocket ochildi\n22:22:23.605 brauzer: GET /admin/orders (1)\n22:22:24.217 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n22:22:24.504 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n22:22:24.504 brauzer: GET /admin/orders (2)\n22:22:27.484 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"payment\"}]\n22:22:27.485 brauzer: GET /admin/orders (3)\n22:22:29.776 SURAT 09-panel-1 (1-imzosiz-keyin) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ✅ To'landi | 22:22:24\n22:22:30.543 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 3";
const KOD_OUT_10 = "# wh-done, .env da PAYMENT_WEBHOOK_SECRET bo'sh\nWARN [Payment] PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\n\n$ npm run pay -- 1\n→ POST /payments/webhook {\"paymentId\":\"pay_1882a443\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: 7226e09e00a6ba28…\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  0\n(1 row)";
const KOD_OUT_11 = "$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: c0effd6168cee3e1…' -d '{\"paymentId\":\"pay_kam\",\"orderId\":1,\"status\":\"paid\",\"amount\":1200}'\n{\"message\":\"summa mos emas: 1200 \u2260 120000\",\"error\":\"Bad Request\",\"statusCode\":400}\n← 400\n\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: a29b2134353000bd…' -d '{\"paymentId\":\"pay_st\",\"orderId\":1,\"status\":\"ok\",\"amount\":120000}'\n{\"message\":\"status: 'paid' yoki 'failed'\",\"error\":\"Bad Request\",\"statusCode\":400}\n← 400\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  0\n(1 row)";
const KOD_OUT_12 = "# wh-done: brauzerdagi panel — buyurtma, to'landi, rad (sahifa yangilanmadi)\n22:21:48.215 brauzer: WebSocket ochildi\n22:21:48.217 brauzer: GET /admin/orders (1)\n22:21:48.830 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n22:21:49.107 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n22:21:49.108 brauzer: GET /admin/orders (2)\n22:21:51.773 SURAT 03-panel-1 (1-buyurtma) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | — | 22:21:49\n22:21:52.768 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"payment\"}]\n22:21:52.768 brauzer: GET /admin/orders (3)\n22:21:55.022 SURAT 03-panel-2 (2-tolandi) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ✅ To'landi | 22:21:49\n22:21:55.951 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"payment\"}]\n22:21:55.951 brauzer: GET /admin/orders (4)\n22:21:58.433 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n22:21:58.433 brauzer: GET /admin/orders (5)\n22:22:01.411 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"payment\"}]\n22:22:01.411 brauzer: GET /admin/orders (6)\n22:22:03.631 SURAT 03-panel-3 (3-rad) — belgi «Ulangan» · ro'yxat: #2, #1\n    2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ❌ Rad etildi | 22:21:58\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ✅ To'landi | 22:21:49\n22:22:04.247 tugadi — belgi «Ulangan» · ro'yxat: #2, #1 · jami GET: 6";
const KOD_OUT_13 = "$ npm test\nPASS src/api/payment/signature.spec.ts\nPASS src/api/telegram/phone.spec.ts\nPASS src/api/telegram/texts.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/app.controller.spec.ts\nPASS src/api/order/order.service.spec.ts\nPASS src/api/payment/payment.service.spec.ts\nPASS src/api/live/live.gateway.spec.ts\nPASS src/api/live/admin.controller.spec.ts\nPASS src/api/payment/payment.controller.spec.ts\nTests:       48 passed, 48 total\n\n$ npm run smoke -- payment\n== vaqtinchalik baza: shop_smoke ==\n  katalogda 6 ta mahsulot\n— payment: to'lov webhook'i — imzo, takror, rad va panelga hodisa\n  ✓ imzosiz — 401, payments da qator yo'q\n  ✓ imzoli to'lov — 200 {\"ok\":true,\"duplicate\":false} · #1 payment_status=paid\n  ✓ panelga → order-changed {\"orderId\":1,\"reason\":\"payment\"}\n  ✓ takror — 200 {\"ok\":true,\"duplicate\":true} · payments da 1 qator\n  ✓ keyingi rad — yozildi, lekin to'langan buyurtma «paid» qoldi (paid)\nNATIJA: 5/5 ✓";
const KOD_OUT_14 = "# nusxa: tartib (yozuv imzodan OLDIN) — npm test\n$ npm test -- payment.controller\nFAIL src/api/payment/payment.controller.spec.ts\n    ✕ imzosiz — 401, yozuvga yetmaydi\n    ✕ boshqa kalit bilan — 401\n    ✕ imzodan keyin tana o'zgargan — 401\n    ✓ to'g'ri imzo — 200, servisga aynan shu to'lov\n    ✓ imzo to'g'ri, maydon xato — 400, yozilmaydi\n    ✓ kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401\n  ● PaymentController — POST /payments/webhook › imzosiz — 401, yozuvga yetmaydi\n  ● PaymentController — POST /payments/webhook › boshqa kalit bilan — 401\n  ● PaymentController — POST /payments/webhook › imzodan keyin tana o'zgargan — 401\nTests:       3 failed, 3 passed, 6 total";
const KOD_OUT_15 = "# wh-done: bir xil xabar bir vaqtda ikki marta (ikki curl parallel)\n$ curl … & curl … &   # body: {\"paymentId\":\"pay_birdan\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n{\"ok\":true,\"duplicate\":true} ← 200\n{\"ok\":true,\"duplicate\":false} ← 200\n\n## Server logi\nLOG [Payment] pay_birdan · #1 · paid · 120000\nLOG [Payment] pay_birdan · #1 · paid · 120000 — takror, yozilmadi\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n payment_id | order_id | status \n------------+----------+--------\n pay_birdan |        1 | paid\n(1 row)";
const KOD_OUT_16 = "# GitHub Actions — main 17be79e (wh-done), run 41877680202\n✓ main CI · 41877680202\n✓ test in 22s (ID 126741522165)\n✓ smoke in 36s (ID 126741726686)\n\n## smoke job — payment\n— payment: to'lov webhook'i — imzo, takror, rad va panelga hodisa\n  ✓ imzosiz — 401, payments da qator yo'q\n  ✓ imzoli to'lov — 200 {\"ok\":true,\"duplicate\":false} · #6 payment_status=paid\n  ✓ panelga → order-changed {\"orderId\":6,\"reason\":\"payment\"}\n  ✓ takror — 200 {\"ok\":true,\"duplicate\":true} · payments da 1 qator\n  ✓ keyingi rad — yozildi, lekin to'langan buyurtma «paid» qoldi (paid)\nNATIJA: 14/14 ✓";
const KOD_OUT_AI1 = "# ai1 — haqiqiy PostgreSQL 18, server: AI nusxasining dist/main.js · manzil /payments/webhook · buyurtma #1, total 120000\n22:31:50 main.ts: NestFactory.create(AppModule, {\"rawBody\":true})\n\n## 1. to'g'ri imzo — to'landi\n$ {\"payment_id\":\"p_1\",\"order_id\":1,\"status\":\"paid\",\"amount\":120000}\n{\"ok\":true,\"result\":\"applied\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 2. o'sha xabar yana (takror)\n{\"ok\":true,\"result\":\"duplicate\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 3. imzosiz\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 4. imzo «abc» (qisqa)\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 5. imzo to'g'ri, summa 1200 (buyurtma #2 — 120000)\n$ {\"payment_id\":\"p_5\",\"order_id\":2,\"status\":\"paid\",\"amount\":1200}\n{\"ok\":true,\"result\":\"applied\",\"order_id\":2,\"payment_status\":\"AMOUNT_MISMATCH\"} ← 200\n  payments qatorlari: 2\n\n## 6. chiroyli JSON (bo'sh joy, qator) — imzo shu baytlardan\n{\"ok\":true,\"result\":\"applied\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments qatorlari: 3\n\n## 7. bir xil xabar bir vaqtda ikki marta\n{\"ok\":true,\"result\":\"duplicate\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n{\"ok\":true,\"result\":\"applied\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments (p_7) qatorlari: 1\n\n## 8. GET /admin/orders — panel nimani ko'radi\n#2 total 120000 · payment \"AMOUNT_MISMATCH\"\n#1 total 120000 · payment \"PAID\"\n\n## Server logi (to'lov)\nLOG [RouterExplorer] Mapped {/payments/webhook, POST} route\nLOG [Payment] p_1 · #1 · paid 120000 → applied, PAID\nLOG [Payment] p_1 · #1 · paid 120000 → duplicate, PAID\nWARN [Payment] imzo noto'g'ri yoki yo'q (::1)\nWARN [Payment] imzo noto'g'ri yoki yo'q (::1)\nWARN [Payment] #2: to'langan 1200, buyurtma jami 120000\nLOG [Payment] p_5 · #2 · paid 1200 → applied, AMOUNT_MISMATCH\nLOG [Payment] p_6 · #1 · paid 120000 → applied, PAID\nLOG [Payment] p_7 · #1 · paid 120000 → applied, PAID\nLOG [Payment] p_7 · #1 · paid 120000 → duplicate, PAID";
const KOD_OUT_AI2 = "# ai2 — haqiqiy PostgreSQL 18, server: AI nusxasining dist/main.js · manzil /webhooks/payment · buyurtma #1, total 120000\n22:26:48 main.ts: NestFactory.create(AppModule, {\"rawBody\":true})\n\n## 1. to'g'ri imzo — to'landi\n$ {\"payment_id\":\"p_1\",\"order_id\":1,\"status\":\"paid\",\"amount\":120000}\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 2. o'sha xabar yana (takror)\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 3. imzosiz\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 4. imzo «abc» (qisqa)\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 5. imzo to'g'ri, summa 1200 (buyurtma #2 — 120000)\n$ {\"payment_id\":\"p_5\",\"order_id\":2,\"status\":\"paid\",\"amount\":1200}\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 2\n\n## 6. chiroyli JSON (bo'sh joy, qator) — imzo shu baytlardan\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 3\n\n## 7. bir xil xabar bir vaqtda ikki marta\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments (p_7) qatorlari: 1\n\n## 8. GET /admin/orders — panel nimani ko'radi\n#2 total 120000 · payment {\"status\":\"PAID\",\"amount\":1200,\"external_id\":\"p_5\",\"received_at\":\"2026-11-04T17:26:49.312Z\"}\n#1 total 120000 · payment {\"status\":\"PAID\",\"amount\":120000,\"external_id\":\"p_7\",\"received_at\":\"2026-11-04T17:26:49.578Z\"}\n\n## Server logi (to'lov)\nLOG [RouterExplorer] Mapped {/webhooks/payment, POST} route\nLOG [Payment] #1: to'lov p_1 → PAID\nLOG [Payment] #1: to'lov p_1 → PAID\nWARN [Payment] #2: to'lov summasi 1200, buyurtma summasi 120000 — tekshiring\nLOG [Payment] #2: to'lov p_5 → PAID\nLOG [Payment] #1: to'lov p_6 → PAID\nLOG [Payment] #1: to'lov p_7 → PAID\nLOG [Payment] #1: to'lov p_7 → PAID";
const KOD_OUT_MJ01 = "$ curl localhost:3000/tolov-mashq?oyinchi=11\nMashq to'lov\nBu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.\nMaydon Jamoa — Pro, 30 kun · 10 000 so'm\nTo'lash (mashq)\nRad etish (mashq)\nIkki marta yuborish\nImzosiz yuborish";
const KOD_OUT_MJ02 = "$ curl -X POST localhost:3000/tolov-mashq/yubor -d '{\"tur\":\"tolash\",\"oyinchi\":11,\"summa\":10000}'   # «tolash» tugmasi\n{\"tolovRaqami\":\"m-1793494239802\",\"javoblar\":[{\"holat\":200,\"tana\":{\"ok\":true}}]}";
const KOD_OUT_MJ05 = "$ curl -X POST localhost:3000/tolov-mashq/yubor -d '{\"tur\":\"imzosiz\",\"oyinchi\":11,\"summa\":10000}'   # «imzosiz» tugmasi\n{\"tolovRaqami\":\"m-1793494243179\",\"javoblar\":[{\"holat\":401,\"tana\":{\"message\":\"Imzo mos emas\",\"error\":\"Unauthorized\",\"statusCode\":401}}]}";
const KOD_OUT_MJ13 = "# tolov.controller.ts — imzo tekshiruvi insert'dan keyin:\n  async webhook(@Req() sorov: RawBodyRequest<Request>, @Headers('x-imzo') imzo: string | undefined) {\n    const tana = (sorov.body ?? {}) as Record<string, unknown>;\n    const tolovRaqami = typeof tana.tolovRaqami === 'string' ? tana.tolovRaqami.trim() : '';\n    const holat = tana.holat;\n    const summa = tana.summa;\n    const oyinchiId = tana.oyinchiId;\n    if (!tolovRaqami || tolovRaqami.length > 40) throw new BadRequestException(\"tolovRaqami bo'sh\");\n    if (typeof holat !== 'string' || !HOLATLAR.includes(holat)) throw new BadRequestException('holat — tolandi yoki rad');\n    if (typeof summa !== 'number' || !Number.isInteger(summa) || summa <= 0) {\n      throw new BadRequestException(\"summa — musbat butun son (so'm)\");\n    }\n    if (typeof oyinchiId !== 'number' || !Number.isInteger(oyinchiId) || !(await this.oyinchilar.existsBy({ id: oyinchiId }))) {\n      throw new BadRequestException('oyinchiId — mavjud hisob');\n    }\n\n    if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };\n    try {\n      await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });\n    } catch (e) {\n      // Ikki bir xil xabar bir vaqtda keldi: ikkinchisini jadvaldagi noyoblik to'xtatdi — u ham takror (500 emas)\n      if ((e as { code?: string }).code === '23505') return { takror: true };\n      throw e;\n    }\n    if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException(\"Imzo mos emas\");\n    return { ok: true };\n  }\n\n$ … tolov-mashq/yubor {\"tur\":\"imzosiz\"}\n{\"tolovRaqami\":\"m-1793494254980\",\"javoblar\":[{\"holat\":401,\"tana\":{\"message\":\"Imzo mos emas\",\"error\":\"Unauthorized\",\"statusCode\":401}}]}\n$ psql: oxirgi qator\n  tolov_raqami   |  holat  \n-----------------+---------\n m-1793494254980 | tolandi\n(1 row)";
const KOD_PANEL = [
 {
  "k": "09b-1",
  "t": "22:22:29",
  "note": "1-imzosiz-keyin",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "✅ To'landi",
     "22:22:24"
    ]
   }
  ]
 },
 {
  "k": "12-1",
  "t": "22:21:51",
  "note": "1-buyurtma",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "—",
     "22:21:49"
    ]
   }
  ]
 },
 {
  "k": "12-2",
  "t": "22:21:55",
  "note": "2-tolandi",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "✅ To'landi",
     "22:21:49"
    ]
   }
  ]
 },
 {
  "k": "12-3",
  "t": "22:22:03",
  "note": "3-rad",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "❌ Rad etildi",
     "22:21:58"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "✅ To'landi",
     "22:21:49"
    ]
   }
  ]
 }
];
const KOD_AI_AI1 = {
 "stat": "24 files changed, 789 insertions(+), 19 deletions(-)"
};
const KOD_AI_AI2 = {
 "stat": "20 files changed, 551 insertions(+), 11 deletions(-)"
};
const KOD_PROMPT1 = "OrderBotNest'ga onlayn to'lov qo'shmoqchimiz. To'lov xizmati mijoz to'lagandan keyin natijani bizning serverga webhook bilan yuboradi: POST so'rov, JSON tanada to'lov raqami, buyurtma raqami, holat (to'landi yoki rad etildi) va summa. Har xabar HMAC-SHA256 bilan imzolangan, imzo X-Signature sarlavhasida, kalit bizda .env da. Shu webhook'ni qo'shib ber: to'lov holati admin panelida ko'rinsin.";
const KOD = { SIG: KOD_SIG, CTRL: KOD_CTRL, SVC: KOD_SVC, INPUT: KOD_INPUT, MAIN: KOD_MAIN, PAY: KOD_PAY, ENV: KOD_ENV, CONFIG: KOD_CONFIG, MIG: KOD_MIG, CSPEC: KOD_CSPEC, CTRL_TARTIB: KOD_CTRL_TARTIB, CTRL_JSON: KOD_CTRL_JSON, MAIN_NORAW: KOD_MAIN_NORAW, README: KOD_README, OUT: { '00': KOD_OUT_00, '00b': KOD_OUT_00B, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07done': KOD_OUT_07DONE, '07json': KOD_OUT_07JSON, '08': KOD_OUT_08, '09': KOD_OUT_09, '09b': KOD_OUT_09B, '10': KOD_OUT_10, '11': KOD_OUT_11, '12': KOD_OUT_12, '13': KOD_OUT_13, '14': KOD_OUT_14, '15': KOD_OUT_15, '16': KOD_OUT_16, 'ai1': KOD_OUT_AI1, 'ai2': KOD_OUT_AI2, 'mj01': KOD_OUT_MJ01, 'mj02': KOD_OUT_MJ02, 'mj05': KOD_OUT_MJ05, 'mj13': KOD_OUT_MJ13 }, PANEL: KOD_PANEL, AI: { ai1: KOD_AI_AI1, ai2: KOD_AI_AI2 }, PROMPT1: KOD_PROMPT1 };

// ============================================================
//  WebSocket-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-matn.py (manba: 21-WS2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Webhook",
  "title": "Mijoz to'lov qildi. Server buni kimdan biladi? Bugun to'lov xabarini qabul qilamiz: imzo, takror va rad",
  "seg": [
   [
    "a",
    "Mijoz to'ladi — <b>panelda «To'landi» o'zi chiqdi</b>; xabarni to'lov xizmati yubordi",
    "Assalomu alaykum. OrderBotNest'da buyurtma bor, endi unga onlayn to'lov qo'shamiz. Ekranda dars oxiridagi natija: birinchi buyurtma to'landi, ikkinchisi rad etildi, panel buni o'zi ko'rsatdi. Bu xabarni mijoz ham, bot ham emas, to'lov xizmati yubordi."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: kim kimga yuboradi va nega mijozning gapi dalil emas",
    "Avval umumiy tushuncha: to'lov xabari kimdan kimga boradi va nega mijozning to'ladim degani dalil emas. Keyin imzo: manzil ochiq bo'lgani uchun soxta xabarni qanday ajratamiz."
   ],
   [
    "c",
    "Keyin <b>takror, rad va to'rt buzilish</b>; oxirida AI va sinf",
    "Uchinchi bosqichda bitta xabar ikki marta kelsa va to'lov rad etilsa nima bo'ladi. To'rtinchisida to'rtta xatoni ataylab yasaymiz. Beshinchisida ikki AI yozgan webhook'ni haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>WebSocket-2 dagi OrderBotNest va Postgres</b>",
    "Dars olti bosqich, uchta amaliyot. Oldingi darsdagi OrderBotNest nusxangiz va Postgres kerak. Haqiqiy to'lov xizmatiga ulanmaymiz, karta yozilmaydi: xizmat o'rnida loyihadagi kichik skript ishlaydi. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "To'lov xizmati natijani serverga o'zi yuboradi — bu webhook. Mijoz yoki ilovaning «to'ladim»i dalil emas: dalil faqat xizmatning imzoli xabari",
  "seg": [
   [
    "a",
    "Mijoz kartani xizmatga beradi; <b>xizmat natijani serverga o'zi yuboradi</b>",
    "Mijoz kartani bizga emas, to'lov xizmatiga beradi: Payme, Click kabi. Pul o'tdimi, buni xizmat biladi. Keyin xizmat bizning server manziliga o'zi so'rov yuboradi: shu buyurtma to'landi. Bu so'rov webhook deyiladi."
   ],
   [
    "b",
    "Mijozning <b>«to'ladim»i dalil emas</b>: skrinshotni har kim yasaydi",
    "Nega botga to'ladim tugmasini qo'ymaymiz? Chunki mijozning gapi yoki skrinshoti dalil emas, uni har kim yasaydi. Ilovaning o'zi ham dalil emas. Dalil faqat xizmatning xabari, va u imzolangan bo'lishi kerak."
   ],
   [
    "c",
    "WebSocket'da server panelga o'zi yuborardi; <b>webhook'da xizmat serverga o'zi yuboradi</b>",
    "Oldingi darslarni eslang: WebSocket'da server panelga o'zi xabar berardi. Webhook xuddi shunday, faqat yo'nalish boshqa: tashqi xizmat bizning serverga o'zi yuboradi. Server so'ramaydi, kutadi. Shuning uchun manzil internetda ochiq turadi."
   ],
   [
    "d",
    "Xulosa: xabar — <b>JSON tana va imzo sarlavhasi</b>; to'rt maydon",
    "Xulosa: xabar oddiy POST so'rov. Tanada to'rt maydon: to'lov raqami, buyurtma raqami, holat va summa. Sarlavhada imzo. Manzil ochiq bo'lgani uchun imzo kerak, uni keyingi bosqichda ochamiz. Avval boshlang'ich tegda nima bo'lishini ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "wh-start da xizmat xabar yubordi — Cannot POST /payments/webhook, 404. Buyurtma bazada «NEW» qoldi: server to'lov bo'lganini bilmaydi",
  "seg": [
   [
    "a",
    "<code>wh-start</code> da xizmat yubordi — <b><code>Cannot POST /payments/webhook</code>, 404</b>",
    "Boshlang'ich tegda tajriba: Bobur buyurtma berdi, to'lov xizmati xuddi haqiqiydek xabar yubordi. Server javobi to'rt yuz to'rt: Cannot POST payments webhook. Bunday manzil yo'q."
   ],
   [
    "b",
    "Bazada buyurtma <b>«NEW» qoldi</b> — server to'lov bo'lganini bilmaydi",
    "Bazaga qarang: buyurtma yangi holatda qoldi. Pul o'tgan, lekin server bilmaydi, panel ham bilmaydi. Haqiqiy xizmat bunday javobdan keyin bir necha marta qayta urinadi, keyin taslim bo'ladi."
   ],
   [
    "c",
    "Manzil qo'shsak — u <b>internetda ochiq</b>: har kim POST yubora oladi",
    "Manzil qo'shamiz, lekin bir narsani tushunib oling: u internetda ochiq turadi. Xizmat ham, istalgan odam ham unga so'rov yubora oladi. Ochiq manzilga to'landi deb yozish juda oson bo'lib qoladi."
   ],
   [
    "d",
    "Xulosa: kerak — <b>manzil, imzo va bir martalik yozuv</b>",
    "Xulosa: bizga uch narsa kerak. Manzil, ya'ni POST payments webhook. Imzo, xabar haqiqatan xizmatdanmi. Va bir martalik yozuv: bitta to'lov ikki marta kelsa ham bir marta yoziladi. Imzodan boshlaymiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "signature.ts: xizmat va server bitta maxfiy kalitni biladi; imzo = HMAC-SHA256(xom tana, kalit). Server qayta hisoblaydi va timingSafeEqual bilan solishtiradi",
  "seg": [
   [
    "a",
    "Kalit <b>faqat ikki tomonda</b>: to'lov xizmatida va bizning <code>.env</code> da",
    "Imzo qanday ishlaydi? To'lov xizmati bilan biz bitta maxfiy kalitni bilamiz: u xizmat kabinetida va bizning env faylimizda. Boshqa hech kim bilmaydi. Xizmat har xabar uchun shu kalit bilan imzo hisoblaydi va sarlavhaga yozadi."
   ],
   [
    "b",
    "<code>sign()</code>: <b>HMAC-SHA256 — xom tana va kalitdan</b> 64 belgili hex",
    "Src, api, payment papkasidagi signature ts faylini oching. Sign funksiyasi: create hmac sha256, kalit bilan, tananing o'zi, hex. Natija oltmish to'rt belgili satr. Tanada bitta harf o'zgarsa, imzo butunlay boshqacha chiqadi."
   ],
   [
    "c",
    "Tekshiruv: <b>kalit bo'sh, tana yoki sarlavha yo'q — darhol rad</b>",
    "Is valid signature funksiyasi avval uch holatni rad etadi: kalit bo'sh, tana yo'q yoki sarlavha yo'q. Kalit bo'sh bo'lsa ayniqsa xavfli: bo'sh kalit bilan imzoni har kim hisoblay oladi. Shuning uchun bo'sh kalit — hech qanday xabar qabul qilinmaydi."
   ],
   [
    "d",
    "Xulosa: solishtirish <b><code>timingSafeEqual</code></b> — javob vaqtidan imzoni taxmin qilib bo'lmaydi",
    "Xulosa: server imzoni o'zi qayta hisoblaydi va kelgani bilan solishtiradi. Oddiy teng belgisi emas, timing safe equal: u har doim bir xil vaqtda solishtiradi, javob tezligidan imzoni bo'lakma-bo'lak topib bo'lmaydi. Uzunlik farq qilsa, darhol yo'q."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "payment.controller.ts: avval imzo (401), keyin maydonlar (400), keyin yozuv. Imzo req.rawBody dan — shuning uchun main.ts da rawBody: true",
  "seg": [
   [
    "a",
    "<code>webhook()</code>: <b>birinchi qator — imzo</b>; noto'g'ri bo'lsa 401 va boshqa hech narsa",
    "Payment controller ts faylida webhook funksiyasi. Birinchi ish imzo: req raw body, sarlavhadagi imzo va env'dagi kalit. Mos kelmasa, logga ogohlantirish va to'rt yuz bir. Funksiya shu yerda tugaydi, bazaga hech narsa yetib bormaydi."
   ],
   [
    "b",
    "Keyin <b>maydonlar (400)</b>, keyin <b>yozuv</b>: <code>parsePayment</code>, <code>record</code>",
    "Imzo to'g'ri bo'lsa, maydonlar: parse payment to'lov raqami, buyurtma raqami, holat va summani tekshiradi, xato bo'lsa to'rt yuz. Faqat shundan keyin record, ya'ni yozuv. Javob: ok va duplicate, takrormi yoki yo'q."
   ],
   [
    "c",
    "<code>main.ts</code>: <b><code>rawBody: true</code></b> — imzo baytlardan hisoblanadi",
    "Muhim satr main ts faylida: Nest factory create, raw body true. Nest odatda tanani JSON obyektga aylantiradi va xom baytlarni tashlab yuboradi. Imzo esa aynan o'sha baytlardan hisoblangan. Raw body true bo'lsa, ular req raw body'da saqlanadi."
   ],
   [
    "d",
    "Xulosa: tartib — <b>imzo, maydonlar, yozuv</b>; buzilsa nima bo'lishini 4-bosqichda ko'ramiz",
    "Xulosa: uch qadam, shu tartibda. Imzo, maydonlar, yozuv. Imzo yozuvdan oldin, aks holda soxta xabar ham bazaga yetib boradi. Server logida yangi yo'l va raw body ko'rinadi. To'rtinchi bosqichda shu tartibni buzib ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Kimdir ochiq manzilga X-Signature siz xabar yubordi: «#1 to'landi, 120 000». Bu controller nima qiladi?",
  "q": "Controller'ni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Kimdir ochiq manzilga imzosiz xabar yubordi: birinchi buyurtma to'landi, bir yuz yigirma ming. Bu controller nima qiladi? Variantni tanlang.",
  "ok": "To'g'ri. Imzo birinchi qadam: sarlavha yo'q, demak is valid signature yo'q deydi va controller to'rt yuz bir tashlaydi. Parse payment ham, record ham chaqirilmaydi, bazaga hech narsa yetmaydi. Demak, imzosiz xabar maydonlari to'g'ri bo'lsa ham, uning mazmuniga qaralmaydi.",
  "okShort": "Imzo — birinchi: yo'q bo'lsa 401, <code>record</code> chaqirilmaydi.",
  "hint": "webhook() dagi birinchi if nima qiladi va undan keyin nima chaqiriladi?",
  "demak": "Imzo yozuvdan oldin: imzosiz xabar mazmuniga qaralmaydi — 401, qator yo'q.",
  "correct": 2,
  "opts": [
   "Yozadi, lekin holatni «tekshirilmagan» deb belgilaydi",
   "Maydonlarni tekshiradi, to'g'ri bo'lsa yozadi",
   "401 qaytaradi va hech narsa yozmaydi",
   "Xizmatdan imzoni so'rab qayta yuborishini kutadi"
  ],
  "wrong": {
   "0": "Imzosiz xabar umuman yozilmaydi — «tekshirilmagan» holati ham yo'q.",
   "1": "Maydonlarga imzodan keyin yetiladi; imzo yo'q — undan nariga o'tilmaydi.",
   "3": "Server hech narsa kutmaydi: javob 401, xabar tashlanadi."
  }
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "Soxta to'lov xizmati (npm run pay) xabarni xuddi haqiqiydek imzolab yuboradi: 200, payments da qator, payment_status = paid — panelda «To'landi» o'zi chiqdi",
  "seg": [
   [
    "a",
    "<code>npm run pay</code>: <b>xizmat qiladigan ishni qiladi</b> — tanani kalit bilan imzolab yuboradi",
    "Haqiqiy to'lov xizmatiga ulanmaymiz, uning o'rniga loyihada kichik skript bor: scripts, pay js. U xizmat qiladigan ishni qiladi: buyurtma summasini oladi, tanani env'dagi kalit bilan imzolaydi va webhook manziliga yuboradi."
   ],
   [
    "b",
    "Javob <b>200, <code>duplicate: false</code></b>; server logida to'lov satri",
    "Ishga tushiramiz: npm run pay, birinchi buyurtma. Yuborilgan tana va imzoning boshi ko'rinadi. Javob ikki yuz, ok true, duplicate false. Server logida: to'lov raqami, buyurtma bir, paid, bir yuz yigirma ming."
   ],
   [
    "c",
    "Bazada: <b><code>payments</code> da qator, <code>payment_status = paid</code></b>",
    "Bazaga qarang: payments jadvalida bitta qator, xizmatning to'lov raqami bilan. Orders jadvalida payment status paid. Ikkalasi bitta tranzaksiyada yozildi: yoki ikkalasi, yoki hech biri."
   ],
   [
    "d",
    "Xulosa: panel <b><code>order-changed</code> 'payment'</b> bilan o'zi yangilandi",
    "Xulosa: panelda to'lov ustuni chiziqchadan to'landi'ga o'zgardi, sahifa yangilanmadi. Tranzaksiya tugagach server order changed yubordi, sabab payment. WebSocket darsidagi qoida shu yerda ham ishladi. Endi buni o'zingiz qilasiz."
   ]
  ]
 },
 "8": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "wh-done tegida .env ga kalit yozing, serverni ishga tushiring, telefondan buyurtma bering va npm run pay bilan to'lang — panelda «To'landi»",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>wh-done</code> tegi, kalit, server va <code>npm run pay</code></b>",
    "Endi navbat sizga. OrderBotNest papkangizda wh done tegiga o'tasiz, env fayliga to'lov kalitini yozasiz, serverni ishga tushirasiz va telefondan buyurtma berasiz. Keyin npm run pay bilan to'laysiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>teg, <code>.env</code> da <code>PAYMENT_WEBHOOK_SECRET</code></b>, server — logda <code>/payments/webhook</code>",
    "Birinchi qadamda git fetch va checkout. Ikkinchisida env'ga payment webhook secret qatori: uzun tasodifiy satr, uni hech kimga bermaysiz. Server ishga tushganda migratsiya o'zi yuradi, logda payments webhook yo'li chiqishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b>telefondan buyurtma, <code>npm run pay -- &lt;raqam&gt;</code></b>; isbot — javob satri",
    "Uchinchi qadamda brauzerda panel va telefondan botga buyurtma. To'rtinchisida ikkinchi terminalda npm run pay, buyurtma raqami bilan. Panelda to'landi chiqadi. Isbot maydoniga ikki yuz javob satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz botingizga to'lov xabarini qabul qiladigan manzil qo'shgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout wh-done",
     "npm install"
    ],
    "exp": "added … packages yoki up to date"
   },
   {
    "t": "Kalit va server",
    "cmds": [
     ".env ga PAYMENT_WEBHOOK_SECRET=<uzun tasodifiy satr>",
     "npm run start:dev"
    ],
    "exp": "Mapped {/payments/webhook, POST} route"
   },
   {
    "t": "Buyurtma",
    "cmds": [
     "brauzer: http://localhost:3000/admin",
     "telefon: botga buyurtma"
    ],
    "exp": "panelda yangi qator, «To'lov» — «—»"
   },
   {
    "t": "To'lov",
    "cmds": [
     "ikkinchi terminal: npm run pay -- <buyurtma raqami>"
    ],
    "exp": "← 200 {\"ok\":true,\"duplicate\":false} · panelda «To'landi»"
   }
  ],
  "proof": {
   "label": "npm run pay javob satri",
   "placeholder": "masalan: ← 200 {\"ok\":true,\"duplicate\":false}",
   "re": "200 \\{\"ok\":true,\"duplicate\":false\\}",
   "flags": "",
   "wrong": "npm run pay -- <raqam> dan keyingi ← 200 … satrini aynan nusxalang."
  },
  "trouble": [
   [
    "← 401 … imzo noto'g'ri",
    "server .env ni o'qimagan (kalit qo'shilgach qayta ishga tushiring) yoki skript va serverda kalit boshqa"
   ],
   [
    "GET /admin/orders → 401",
    ".env da ADMIN_PANEL_TOKEN yo'q — skript summani panel yo'lidan oladi"
   ],
   [
    "#… oxirgi 20 buyurtma ichida yo'q",
    "buyurtma raqami noto'g'ri — paneldagi # ustuniga qarang"
   ],
   [
    "relation \"payments\" does not exist",
    "server wh-done dan oldingi dist bilan — npm run start:dev ni qayta ishga tushiring"
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror va rad",
  "title": "Imzosiz xabar ham, boshqa kalit bilan imzolangani ham — 401, payments da yangi qator yo'q; server logida ikkita ogohlantirish",
  "seg": [
   [
    "a",
    "Imzosiz: <b><code>X-Signature</code> yo'q — 401</b>; tana to'g'ri bo'lsa ham",
    "Endi ochiq manzilga begona xabarlar. Birinchisi imzosiz: tana xuddi haqiqiydek, birinchi buyurtma to'landi, summa to'g'ri. Javob to'rt yuz bir, imzo noto'g'ri. Mazmuni to'g'ri bo'lsa ham, imzosiz xabarga ishonilmaydi."
   ],
   [
    "b",
    "Boshqa kalit: <b>imzo bor, lekin kalit boshqa — 401</b>",
    "Ikkinchisi ayyorroq: imzo bor, oltmish to'rt belgi, faqat boshqa kalit bilan hisoblangan. Kalitni bilmagan odam shunday qiladi. Server o'z kaliti bilan hisoblaydi, natija mos kelmaydi, yana to'rt yuz bir."
   ],
   [
    "c",
    "Server logida <b>ikki ogohlantirish</b>; <code>payments</code> da yangi qator yo'q",
    "Server logida ikkita ogohlantirish: imzo noto'g'ri, xabar rad etildi. Bazada payments qatorlari soni o'zgarmadi. Hujum bo'lsa ham, logdan ko'rinadi, ma'lumot buzilmaydi."
   ],
   [
    "d",
    "Xulosa: imzoni <b>faqat kalit egasi yasaydi</b>; kalit sirligi — butun himoya",
    "Xulosa: to'g'ri imzoni faqat kalitni bilgan yasaydi. Demak himoyaning hammasi kalit sirligida. Kalit env faylida va hosting sozlamasida, kodda ham, git'da ham, chatda ham emas. Endi xizmatning o'zi ikki marta yuborsa nima bo'lishini ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror va rad",
  "title": "Xizmat javobni olmasa, xabarni qayta yuboradi: ikkinchisi 200 { duplicate: true }, qator bitta — bir vaqtda kelsa ham. Rad etilgan to'lov ham yoziladi",
  "seg": [
   [
    "a",
    "Javob yo'qolsa <b>xizmat qayta yuboradi</b>: ikkinchisi <code>duplicate: true</code>",
    "Haqiqiy xizmat javobimizni olmasa, masalan tarmoq uzilsa, xuddi shu xabarni qayta yuboradi. Npm run pay, ikki rejimi: birinchisi duplicate false, ikkinchisi duplicate true. Server logida: takror, yozilmadi. Javob baribir ikki yuz, aks holda xizmat qayta urinaveradi."
   ],
   [
    "b",
    "<code>ON CONFLICT (payment_id) DO NOTHING</code> — <b>bir vaqtda kelgan ikki xabar ham bitta qator</b>",
    "Payment service faylida insert, on conflict payment id do nothing, returning. Payment id noyob, takrorda hech narsa qaytmaydi va biz duplicate deymiz. Ikki xabar bir vaqtda kelganini ham sinadik: biri yozildi, biri takror, bazada bitta qator. Avval qidirib keyin yozsak, bu joyda ikkala so'rov ham o'tib ketishi mumkin edi."
   ],
   [
    "c",
    "Rad: <b><code>status: 'failed'</code> ham yoziladi</b> — «to'lovim qayerda?» savoliga javob",
    "Ikkinchi buyurtma, karta rad etdi: xabar baribir keladi va yoziladi, holat failed. Nega yozamiz? Mijoz to'lovim qayerda desa, admin ko'radi: urinish bo'lgan, rad etilgan. Hech narsa yozmasak, bu savolga javob yo'q."
   ],
   [
    "d",
    "Xulosa: panelda <b>«To'landi» va «Rad etildi»</b>; to'langani «rad» ga tushmaydi",
    "Xulosa: panelda ikkala holat, sahifa yangilanmadi. Yana bir qoida servisda: buyurtma allaqachon to'langan bo'lsa, keyingi rad xabari uni rad'ga tushirmaydi. Smoke shuni ham tekshiradi. Endi bu uchtasini o'zingiz sinaysiz."
   ]
  ]
 },
 "11": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "npm run pay ning to'rt rejimi: ikki marta, imzosiz, soxta, rad — har birining javobi va bazadagi natijasini ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b>to'rt rejim</b> — xizmat ikki marta yuborsa, begona yuborsa, karta rad etsa",
    "Endi navbat sizga. Npm run pay'ning to'rt rejimini sinaysiz: ikki marta, imzosiz, soxta kalit va rad. Har birida javobni va bazani ko'rasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>ikki</code>, keyin <code>imzosiz</code> va <code>soxta</code></b> — <code>duplicate: true</code> va 401",
    "Birinchi qadamda ikki rejimi: ikkinchi javobda duplicate true. Ikkinchisida imzosiz va soxta: ikkalasi to'rt yuz bir, server terminalida ogohlantirish. Bazada payments jadvalini oching, qatorlar soni o'zgarmaganini ko'ring."
   ],
   [
    "c",
    "3–4-qadam: <b>yangi buyurtma va <code>rad</code></b>; panelda «Rad etildi»; isbot — takror javobi",
    "Uchinchi qadamda yangi buyurtma va rad rejimi: panelda rad etildi. To'rtinchisida payments jadvalida to'lovlar va holatlar. Isbot maydoniga ikki rejimidagi duplicate true satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror, begona va rad xabarlarni o'zingiz sinab ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Takror",
    "cmds": [
     "npm run pay -- <raqam> ikki"
    ],
    "exp": "2-javob ← 200 {\"ok\":true,\"duplicate\":true}"
   },
   {
    "t": "Begona",
    "cmds": [
     "npm run pay -- <raqam> imzosiz",
     "npm run pay -- <raqam> soxta"
    ],
    "exp": "ikkalasi ← 401, serverda imzo noto'g'ri"
   },
   {
    "t": "Rad",
    "cmds": [
     "telefondan yangi buyurtma",
     "npm run pay -- <yangi raqam> rad"
    ],
    "exp": "← 200, panelda «Rad etildi»"
   },
   {
    "t": "Baza",
    "cmds": [
     "psql: SELECT payment_id, order_id, status FROM payments;"
    ],
    "exp": "takror bitta qator, imzosiz/soxta yo'q, rad bor"
   }
  ],
  "proof": {
   "label": "ikki rejimining ikkinchi javobi",
   "placeholder": "masalan: ← 200 {\"ok\":true,\"duplicate\":true}",
   "re": "\"duplicate\":true",
   "flags": "",
   "wrong": "npm run pay -- <raqam> ikki dagi ikkinchi ← 200 … satrini qo'ying — unda \"duplicate\":true."
  },
  "trouble": [
   [
    "Ikkala javob duplicate: false",
    "payments.payment_id da UNIQUE yo'q — migratsiya yurmagan; serverni qayta ishga tushiring, \\d payments"
   ],
   [
    "imzosiz ham 200",
    "server eski kodda yoki tartib buzilgan — git status, git checkout wh-done"
   ],
   [
    "rad → 400 summa mos emas",
    "buyurtma raqami boshqa (summa boshqa buyurtmaniki)"
   ],
   [
    "Panelda «To'lov» ustuni yo'q",
    "sahifa eski — F5"
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Imzo baytlardan: xizmat JSON'ni bo'sh joy bilan yuborsa, xom tanadan hisoblagan kod qabul qiladi, JSON.stringify(body) dan hisoblagani rad etadi. rawBody o'chsa — haqiqiy to'lov ham 401",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>req.rawBody</code> ustiga bosing",
    "Endi to'rtta xatoni ataylab yasaymiz, birinchisini o'zingiz qilasiz. Payment controller ts'da imzo req raw body'dan hisoblanyapti, raw body yonib turibdi, ustiga bosing: imzo JSON stringify body'dan hisoblanadi.",
    "<b>payment.controller.ts</b>dagi <b><code>req.rawBody</code></b> ustiga bosing — imzo <code>JSON.stringify(body)</code> dan hisoblanadi."
   ],
   [
    "a",
    "Sodda xato: imzoni <b><code>JSON.stringify(body)</code> dan</b> hisoblash — «baribir o'sha ma'lumot-ku»",
    "Imzo endi xom tanadan emas, JSON stringify body'dan hisoblanadi. Bu juda keng tarqalgan xato. Ma'lumot baribir o'sha, deb o'ylaysiz. Bizning skript bo'sh joysiz yuboradi, shuning uchun bu kod u bilan ishlaydi."
   ],
   [
    "b",
    "Xizmat <b>bo'sh joy bilan</b> yubordi: to'g'ri kod 200, xato kod 401",
    "Lekin xizmat JSON'ni bo'sh joylar bilan yuborsa-chi? Imzo aynan shu baytlardan. To'g'ri kod qabul qildi, ikki yuz. Stringify qilgan kod esa obyektni qayta yozdi, bo'sh joylar yo'qoldi, imzo mos kelmadi, to'rt yuz bir. Haqiqiy to'lov rad etildi."
   ],
   [
    "c",
    "<code>main.ts</code> da <b><code>rawBody</code> yo'q</b>: <code>req.rawBody</code> bo'sh — haqiqiy to'lov ham 401",
    "Ikkinchi xato: main ts'dan raw body true olib tashlandi. Server logida create, ikkinchi argumentsiz. Npm run pay to'g'ri kalit bilan yuboradi, javob baribir to'rt yuz bir, bazada nol qator. Req raw body umuman yo'q, imzoni solishtiradigan narsa yo'q."
   ],
   [
    "d",
    "Demak, sabab: imzo <b>baytlardan</b>; xom tanani faqat <code>rawBody: true</code> saqlaydi",
    "Demak, sabab bitta: imzo matn ma'nosidan emas, aniq baytlardan hisoblanadi. Nest tanani o'qib, obyektga aylantiradi va baytlarni tashlaydi. Ularni faqat raw body true saqlaydi. Har ikki xatoda belgi bir xil: haqiqiy, to'g'ri imzoli to'lov to'rt yuz bir oladi."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Yozuvni imzodan oldin qo'ysak: imzosiz xabar 401 oladi — lekin payments da qator bor va panelda «To'landi». Javob to'g'ri, bazada esa yolg'on",
  "seg": [
   [
    "x",
    "Uchinchi xato eng xavflisi — <b>uni ham o'zingiz qilasiz</b>: <code>record</code> satri ustiga bosing",
    "Uchinchi xato eng xavflisi, uni ham o'zingiz qilasiz. Controller'da yozuv satri yonib turibdi, ustiga bosing: u imzo tekshiruvidan oldinga ko'chadi.",
    "<b>payment.controller.ts</b>dagi <b><code>this.payments.record</code></b> ustiga bosing — yozuv imzo tekshiruvidan oldinga ko'chadi."
   ],
   [
    "a",
    "Uchinchi xato: <b><code>record</code> imzo tekshiruvidan oldin</b> — «avval yozib olay, keyin tekshiraman»",
    "Tartib almashdi: avval parse va record, keyin imzo. Kod ishlaydi, testlarsiz ko'rinmaydi. Imzosiz xabar yuboramiz."
   ],
   [
    "b",
    "Javob <b>401</b>: tashqaridan qaraganda hammasi to'g'ri",
    "Javob to'rt yuz bir, imzo noto'g'ri. Xabar yuborgan odam rad etildim deb o'ylaydi, server logida ham ogohlantirish. Tashqaridan qaraganda himoya ishlayapti."
   ],
   [
    "c",
    "Bazada <b><code>paid</code></b>, panelda <b>«To'landi»</b> — imzosiz xabar ishini qildi",
    "Lekin bazaga qarang: payments'da qator, buyurtma paid. Panelda ham to'landi, sahifa o'zi yangilandi. Yozuv tranzaksiyasi to'rt yuz birdan oldin tugagan. Admin buyurtmani yetkazib beradi, pul esa yo'q."
   ],
   [
    "d",
    "Demak, sabab: <b>401 yozilganni qaytarmaydi</b>; imzo — eng birinchi qadam",
    "Demak, sabab: to'rt yuz bir faqat javob, u bazaga yozilganni qaytarmaydi. Shuning uchun imzo eng birinchi qadam, hech qanday yozuvdan oldin. Bunday xatoni ko'z bilan topish qiyin, uni test ushlaydi, uchinchi amaliyotda ko'rasiz."
   ]
  ]
 },
 "14": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu controller imzosiz xabarga 401 qaytaradi, lekin buyurtma «to'landi» bo'lib qoladi. Joyida turmagan satrni toping",
  "q": "Tartib buzilishini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu controller imzosiz xabarga to'rt yuz bir qaytaradi, lekin buyurtma to'landi bo'lib qoladi. Bo'lakda bitta satr imzodan oldin bazaga yozadi. O'sha satrni bosing.",
  "ok": "To'g'ri. Record chaqiruvi imzo tekshiruvidan oldin turibdi: tranzaksiya tugab, buyurtma paid bo'ladi, keyin imzo tekshirilib to'rt yuz bir qaytadi. Parse payment ham oldin, lekin u bazaga yozmaydi. Demak, javob kodiga emas, bazaga qarab tekshiring: yozuvni imzodan keyinga qo'ying.",
  "okShort": "<code>record(p)</code> imzodan oldin — yozuv bo'ladi, keyin 401. 401 yozilganni qaytarmaydi.",
  "hint": "Qaysi satr bazaga yozadi va u isValidSignature dan oldinmi, keyinmi?",
  "task": "Qoida: bazaga yozadigan chaqiruv <b>imzo tekshiruvidan keyin</b> turadi. Bu bo'lakda bitta satr imzodan <b>oldin bazaga yozadi</b>. <b>O'sha satrni bosing.</b>"
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "To'rtinchi xato — kalit .env da bo'sh: server ishga tushganda ogohlantiradi va har xabar 401. Imzo to'g'ri bo'lsa ham, summa yoki maydon xato — 400 va qator yo'q",
  "seg": [
   [
    "a",
    "Kalit bo'sh: server <b>ishga tushganda ogohlantiradi</b>",
    "To'rtinchi xato: env faylida payment webhook secret bo'sh qoldi, masalan hostingda qo'shish esdan chiqdi. Server ishga tushganda logda ogohlantirish: kalit bo'sh, har to'lov xabari to'rt yuz bir bilan rad etiladi. Bu satrni ishga tushirish logida qidiring."
   ],
   [
    "b",
    "Har xabar <b>401</b>, qator yo'q — bo'sh kalit bilan imzoni har kim yasardi",
    "Npm run pay ham bo'sh kalit bilan imzolaydi, server baribir to'rt yuz bir beradi. Bu ataylab shunday: bo'sh kalit bilan hisoblangan imzoni har kim hisoblay oladi. Bo'sh kalitni qabul qilish manzilni himoyasiz qoldirish bilan bir xil."
   ],
   [
    "c",
    "Imzo to'g'ri, lekin <b>summa mos emas yoki holat noma'lum — 400</b>",
    "Imzo to'g'ri bo'lsa ham hamma narsa yozilavermaydi. Summa bir ming ikki yuz, buyurtma esa bir yuz yigirma ming: to'rt yuz, summa mos emas. Holat ok deb kelsa: to'rt yuz, paid yoki failed. Ikkalasida bazada nol qator."
   ],
   [
    "d",
    "Xulosa: kalit — <b><code>.env</code> va hostingda</b>; kodda, git'da, chatda — yo'q",
    "Xulosa va kalit qoidalari. Kalit faqat env faylida va hosting sozlamasida. Git'ga tushmaydi, kodga yozilmaydi, AI'ga yoki chatga berilmaydi. Tushib qolsa, xizmat kabinetida darhol almashtiriladi. Endi tekshirib olaylik."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Hostingda PAYMENT_WEBHOOK_SECRET qo'shilmay qoldi. Nega server bunday holatda imzoni umuman tekshirib o'tirmay, har xabarni rad etadi?",
  "q": "Kalitni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Hostingda kalit qo'shilmay qoldi. Server bunday holatda imzoni umuman tekshirmay, har xabarni rad etadi. Nega? Variantni tanlang.",
  "ok": "To'g'ri. HMAC bo'sh kalit bilan ham hisoblanadi, xato chiqmaydi. Lekin bo'sh kalitni hamma biladi: istalgan odam to'g'ri ko'rinadigan imzo yasaydi va to'landi deb yozadi. Shuning uchun bo'sh kalit, darhol rad, va ishga tushganda ogohlantirish. Demak, kalitning yo'qligi ham xato, uni qabul qilib bo'lmaydi.",
  "okShort": "Bo'sh kalit — hammaga ma'lum kalit: imzoni har kim yasaydi. Shuning uchun darhol 401.",
  "hint": "Bo'sh kalitni kim biladi?",
  "demak": "Bo'sh kalit — himoya yo'q degani: server uni qabul qilmaydi va ishga tushganda aytadi.",
  "correct": 1,
  "opts": [
   "Bo'sh kalit bilan HMAC hisoblab bo'lmaydi, kod xato tashlaydi",
   "Bo'sh kalit bilan to'g'ri imzoni har kim hisoblay oladi",
   "Kalit bo'lmasa to'lov xizmati xabar yubormaydi",
   "Bo'sh kalitda server to'xtaydi, xatoni ko'rish qiyin"
  ],
  "wrong": {
   "0": "Hisoblanadi — createHmac bo'sh kalit bilan ham ishlaydi; muammo xavfsizlikda.",
   "2": "Xizmat o'z kabinetidagi kalit bilan yuboradi; bizdagi bo'sh kalitni bilmaydi.",
   "3": "Server to'xtamaydi — ishlaydi va logda ogohlantiradi."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Controller'da record ni imzodan oldinga ko'chiring, npm test ni yurgizing — uchta test qizil bo'lishi kerak; keyin kodni qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: tartibni <b>ataylab buzasiz</b> va testlar ushlashini ko'rasiz",
    "Endi navbat sizga. Payment controller'da tartibni ataylab buzasiz: parse va record'ni imzo tekshiruvidan oldinga ko'chirasiz. Keyin testlarni yurgizasiz va qaysilari qizarishini ko'rasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>ikki satrni yuqoriga</b> ko'chiring; <code>npm test -- payment.controller</code>",
    "Birinchi qadamda const p va const r satrlarini if'dan yuqoriga ko'chirib saqlaysiz. Ikkinchisida npm test, payment controller. Uchta test qizil: imzosiz, boshqa kalit va tana o'zgargan. Ular servis chaqirilmasligini tekshiradi."
   ],
   [
    "c",
    "3–4-qadam: <b>qizil test nomlarini</b> o'qing; <code>git checkout</code> bilan qaytaring; isbot — natija satri",
    "Uchinchi qadamda qizil testlarning nomini o'qing: hammasi yozuvga yetmaslik haqida. To'rtinchisida git checkout bilan faylni qaytarib, testlarni yana yurgizasiz, hammasi yashil. Isbot maydoniga qizil natijadagi Tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bilasiz: ko'z bilan ko'rinmaydigan xatoni to'g'ri yozilgan test ushlaydi."
   ]
  ],
  "steps": [
   {
    "t": "Buzish",
    "cmds": [
     "src/api/payment/payment.controller.ts: const p = parsePayment(body); va const r = await this.payments.record(p); → if ( dan oldinga"
    ],
    "exp": "saqlandi"
   },
   {
    "t": "Testlar",
    "cmds": [
     "npm test -- payment.controller"
    ],
    "exp": "FAIL · ✕ imzosiz — 401, yozuvga yetmaydi"
   },
   {
    "t": "O'qish",
    "cmds": [
     "qizil testlar nomi"
    ],
    "exp": "3 ta: imzosiz · boshqa kalit · tana o'zgargan"
   },
   {
    "t": "Qaytarish",
    "cmds": [
     "git checkout -- src/api/payment/payment.controller.ts",
     "npm test"
    ],
    "exp": "Tests: 48 passed"
   }
  ],
  "proof": {
   "label": "Qizil natijadagi Tests: satri",
   "placeholder": "masalan: Tests: 3 failed, 3 passed, 6 total",
   "re": "3 failed",
   "flags": "",
   "wrong": "Buzilgan kod bilan npm test -- payment.controller dagi Tests: … satrini qo'ying — unda 3 failed."
  },
  "trouble": [
   [
    "Hammasi yashil",
    "fayl saqlanmagan yoki satrlar if ichiga tushgan — git diff"
   ],
   [
    "Cannot find name 'p'",
    "const p record dan keyin qolgan — avval parsePayment, keyin record"
   ],
   [
    "6 tadan ko'p test qizil",
    "if bloki buzilgan (qavs) — git checkout bilan qaytarib qayta urining"
   ],
   [
    "npm test umuman ishlamaydi",
    "npm install qilinmagan (wh-done da yangi paket yo'q, lekin node_modules kerak)"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Ikki AI'ga xizmat hujjatidagi kabi qisqa talab: «POST, JSON, HMAC-SHA256, X-Signature, kalit .env da». Ikkalasi xom tana, timingSafeEqual va takrorni o'zi qildi",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>AI webhook yozadi, siz qabul qilasiz</b> — qisqa talab bilan",
    "Beshinchi bosqich, AI. Ikki AI'ga to'lov xizmati hujjatidagi kabi qisqa talab berdik: POST, JSON, HMAC SHA256, X Signature sarlavhasi, kalit env'da. Xom tana, takror, tartib, summa haqida bir so'z yo'q. Kuchli va kuchsizroq model."
   ],
   [
    "b",
    "Prompt — <b>to'rt maydon va imzo</b>; qolganini AI o'zi o'ylashi kerak",
    "Prompt ekranda aynan. To'lov raqami, buyurtma raqami, holat, summa va imzo. Bunday talabdan to'g'ri webhook chiqishi uchun AI bugun siz o'rgangan hamma narsani o'zi bilishi kerak: baytlar, takror, tartib, summa."
   ],
   [
    "c",
    "Ikkalasi: <b>xom tana, <code>timingSafeEqual</code>, takror</b>; farq — summa va takror javobida",
    "Ikkalasi ham raw body'ni yoqdi, timing safe equal ishlatdi, payment id'ni noyob qildi. Birinchisi ancha chuqur: sha256 old qo'shimchasini ham qabul qiladi, summa mos kelmasa alohida holat. Ikkinchisi summa farq qilsa ham to'landi deydi, faqat logga yozadi."
   ],
   [
    "d",
    "AI-2 o'zi aytdi: <b>«summa farq qilsa — 200, siz hal qiling»</b>; AI-1 — doiradan chiqqanini",
    "Ikkinchi AI'ning javobida halol jumla bor: summa farq qilsa xabar qabul qilinadi, siz hal qiling. Ya'ni qaror sizda. Birinchisi esa bir marta papkasidan tashqariga fayl ko'chirib, o'chirganini aytdi. Endi ikkalasini haqiqiy bazada sinaymiz."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Haqiqiy PostgreSQL bilan yetti sinov: imzo, takror, bo'sh joyli JSON, bir vaqtda — ikkalasi o'tdi. Summa 1 200 (buyurtma 120 000): AI-1 «Summa mos emas», AI-2 «To'landi»",
  "seg": [
   [
    "a",
    "Haqiqiy bazada: imzo, takror, bo'sh joyli JSON, bir vaqtda — <b>ikkalasi to'g'ri</b>",
    "Ikkala nusxani haqiqiy Postgres bilan, bizning sinovlar bilan tekshirdik. To'g'ri imzo ikki yuz, takror bitta qator, imzosiz va qisqa imzo to'rt yuz bir, bo'sh joyli JSON qabul, bir vaqtda ikki xabar bitta qator. Bu qismda ikkalasi to'g'ri."
   ],
   [
    "b",
    "Summa 1 200, buyurtma 120 000: <b>AI-2 panelda «To'landi»</b>, AI-1 «Summa mos emas»",
    "Beshinchi sinov: imzo to'g'ri, lekin summa bir ming ikki yuz, buyurtma esa bir yuz yigirma ming. Ikkinchi AI'da panel to'landi deydi, admin yetkazib beradi. Birinchisida summa mos emas holati: to'lov yozildi, lekin admin farqni ko'radi."
   ],
   [
    "c",
    "Halol solishtiruv: <b>bu yerda AI-1 bizdan yaxshiroq</b> — pul o'tgan bo'lsa, yozuv yo'qolmaydi",
    "Halol solishtiramiz. Bizning kod bunday xabarga to'rt yuz qaytaradi va yozmaydi. Lekin pul haqiqatan o'tgan bo'lishi mumkin, yozuv esa yo'q. Birinchi AI yozib, alohida belgilaydi. Bu yerda u bizdan yaxshiroq, uyga vazifada shuni qilasiz."
   ],
   [
    "d",
    "Xulosa: AI webhook'iga <b>to'rt savol</b>: baytlarmi · tartib · takror · summa",
    "Xulosa: AI yozgan webhook'ga to'rt savol. Imzo xom baytlardanmi. Imzo yozuvdan oldinmi. Takror va bir vaqtda kelgan xabar bitta qatormi. Summa buyurtma bilan solishtiriladimi. Javobni kodda va haqiqiy bazada tekshiring."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "2-AI panelida: #2 «To'landi · 1 200 so'm», buyurtma esa 120 000 so'm. Server logida faqat ogohlantirish. Bu yerda nima xavf?",
  "q": "AI webhook'larini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Ikkinchi AI panelida buyurtma to'landi, bir ming ikki yuz so'm, buyurtma esa bir yuz yigirma ming. Server logida faqat ogohlantirish. Bu yerda nima xavf? Variantni tanlang.",
  "ok": "To'g'ri. Admin logni emas, panelni ko'radi, panel esa to'landi deydi. Buyurtma yetkaziladi, pulning yuzdan biri kelgan. Imzo to'g'ri, xabar haqiqiy: masalan, xizmat summani tiyinda yuborgan. Demak, summa buyurtma jami bilan solishtiriladi va mos kelmasa, alohida ko'rinadigan holat bo'ladi.",
  "okShort": "Panel «To'landi» — admin yetkazadi, pul 1 %. Summani jami bilan solishtiring.",
  "hint": "Admin qayerga qaraydi — logga yoki panelga? Imzo nimani isbotlaydi?",
  "demak": "Imzo xabar haqiqiyligini isbotlaydi, summaning to'g'riligini emas — summa alohida tekshiriladi.",
  "correct": 0,
  "opts": [
   "Admin buyurtmani to'liq to'langan deb yetkazib yuboradi",
   "Xavf yo'q — log ogohlantiryapti, admin uni baribir har kuni o'qiydi",
   "Imzo buzilgan — demak xabar soxta bo'lishi mumkin",
   "Takror xabar keyin ikkinchi qatorni ham yozib qo'yadi"
  ],
  "wrong": {
   "1": "Admin panelga qaraydi, logga emas — ogohlantirish ko'rinmaydi.",
   "2": "Imzo to'g'ri — xabar haqiqiy; muammo summada (masalan, tiyinda yuborilgan).",
   "3": "Takror bu yerda yo'q — ikkala AI ham bitta qator yozadi."
  }
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»",
  "title": "O'quvchi darsi: Maydon Jamoa'da Pro obuna, test rejim — siz bugun OrderBotNest'da qilgan xabar, imzo, takror va radning o'zi",
  "seg": [
   [
    "a",
    "m11-03 — 20 ekran: <b>Maydon Jamoa, Pro obuna, test rejim</b> — pul yechilmaydi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m11-03, yigirma ekran. Misol Maydon Jamoa: o'yin tashkilotchisi Pro obuna uchun to'laydi, o'ttiz kun, o'n ming so'm. Hammasi test rejimda, karta so'ralmaydi, pul yechilmaydi."
   ],
   [
    "b",
    "O'quvchi ham <b>xabar, imzo, takror va rad</b>; amaliyotda agent bilan o'z Backend'i",
    "O'quvchi darsidagi yo'l siznikidek: to'lov xabari, imzo, takror, rad va to'lov oqimi sxemasi. Amaliyotda o'quvchi o'z Backend'iga webhook qo'shadi, agent bilan, keyin mashq sahifasida uch tekshiruv. Kalit faqat env va Render'da."
   ],
   [
    "c",
    "Bloklar: <b>og'ir joy — 7-ekran kod oynasi va ikki amaliyot</b>",
    "Bloklar jadvaliga qarang. Og'ir joy yettinchi ekrandagi kod oynasi va ikki amaliyot, har birida Render'da yangi versiya kutiladi. Har blokda siz qo'shadigan narsa o'ng ustunda, bugungi ekran raqami bilan."
   ],
   [
    "d",
    "Xulosa: repo <b><code>m13-dars-03-done</code></b>: <code>POST /tolov/webhook</code>, <code>X-Imzo</code>, <code>TOLOV_KALITI</code>",
    "Xulosa: o'quvchi loyihasi maydon jamoa, o'n uchinchi modul uchinchi dars done tegi. Manzil tolov webhook, imzo X Imzo sarlavhasida, kalit TOLOV KALITI. Nomlar o'zbekcha, qoidalar siz bugun ko'rgandek. Keyingi ekranda o'quvchi so'zlari."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "O'quvchi tilida: to'lov xabari, imzo, kalit, takror — va «Mashq to'lov» sahifasining to'rt tugmasi; tartib buzilganda o'quvchi loyihasida ham 401, lekin qator yozilgan",
  "seg": [
   [
    "a",
    "O'quvchi so'zlari: <b><code>X-Imzo</code>, <code>TOLOV_KALITI</code>, <code>takror: true</code></b> — siznikining o'zbekcha nomi",
    "O'quvchi darsidagi so'zlar: to'lov xabari, imzo X Imzo sarlavhasida, kalit TOLOV KALITI, takror xabarga javob takror true. Siz bilgan narsalar, faqat nomlar o'zbekcha. O'quvchi aytganda, yonida OrderBotNest nomini ayting."
   ],
   [
    "b",
    "«Mashq to'lov» sahifasi: <b>to'rt tugma</b> — xizmat o'rnida Backend'ning o'zi",
    "O'quvchida npm run pay o'rniga sahifa bor: mashq to'lov. Karta so'ralmaydi, pul yechilmaydi. To'rt tugma: to'lash, rad etish, ikki marta yuborish, imzosiz yuborish. Siz bugun skriptning xuddi shu to'rt rejimini sinadingiz."
   ],
   [
    "c",
    "Tugmalar: <b>«To'lash» 200, «Imzosiz» 401</b> — o'quvchi loyihasida haqiqiy Backend bilan",
    "Bu chiqishlar o'quvchi loyihasining haqiqiy Backend'idan: to'lash, ikki yuz ok. Imzosiz, to'rt yuz bir, imzo mos emas. Sinfda o'quvchi shu ikki javobni ko'rishi kerak."
   ],
   [
    "d",
    "Xulosa: o'quvchida ham <b>tartib buzilsa 401, lekin qator yozilgan</b> — 13-ekrandagi xato",
    "Xulosa va ogohlantirish. O'quvchi loyihasida ham tekshiruv tartibini buzib ko'rdik: imzosiz to'rt yuz bir, lekin to'lovlar jadvalida qator. Agent kodni yozganda o'quvchi javob kodiga emas, jadvalga qarasin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "401 bo'lsa — kalit, rawBody, tartib; qolganida javob matnini o'qing: olti holat va o'quvchi so'raydigan to'rt savol",
  "seg": [
   [
    "a",
    "Birinchi uchtasi — <b>401 bilan bog'liq</b>: kalit, <code>rawBody</code>, tartib",
    "Sinfda uchraydigan olti holat. Birinchi uchtasi imzo bilan bog'liq. Hamma xabar to'rt yuz bir: kalit bo'sh yoki Render'dagisi boshqa. Haqiqiy to'lash ham to'rt yuz bir: raw body yoqilmagan. Javob to'rt yuz bir, lekin jadvalda qator: tartib buzilgan."
   ],
   [
    "b",
    "Qolgan uchtasi: <b>ikki qator, 400 va <code>.env</code> Git'da</b>",
    "To'rtinchisi: ikki marta tugmasi ikki qator yozdi, to'lov raqami noyob emas. Beshinchisi: to'rt yuz, javob matnida qaysi maydon xato yozilgan. Oltinchisi: env fayl Git'ga tushib qolgan, bunda kalitlar darhol almashtiriladi."
   ],
   [
    "c",
    "O'quvchi savollari: <b>Payme, takrorga 200, rad, kalitni agentga berish</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: Payme ulasam bo'ladimi, nega takrorga ham ikki yuz, nega rad yoziladi va kalitni agentga bersam bo'ladimi."
   ],
   [
    "d",
    "Xulosa: 401 da <b>kalit → <code>rawBody</code> → tartib</b>; jadvalga qarang, javobga emas",
    "Xulosa va usul: javob to'rt yuz bir bo'lsa, shu tartibda tekshiring: kalit, raw body, keyin tekshiruv tartibi. Har doim jadvalga qarang, faqat javob kodiga emas. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Mijoz to'laganini server nimadan biladi?",
    "o": [
     "Mijoz yuborgan to'lov skrinshotidan",
     "Botdagi «To'ladim» tugmasi bosilganidan",
     "To'lov xizmatining imzoli xabaridan",
     "Admin panelda qo'ygan belgidan"
    ],
    "c": 2,
    "e": "Dalil — faqat xizmatning imzoli xabari.",
    "s": 2
   },
   {
    "q": "Imzo nimadan hisoblanadi?",
    "o": [
     "Xom tana va maxfiy kalitdan",
     "JSON obyekt va buyurtma raqamidan",
     "Sarlavhalar va IP manzildan",
     "Summa va vaqt belgisidan"
    ],
    "c": 0,
    "e": "HMAC — baytlar va kalitdan.",
    "s": 4
   },
   {
    "q": "main.ts da rawBody: true yo'q. Nima bo'ladi?",
    "o": [
     "Imzosiz xabarlar ham o'tib ketadi",
     "Haqiqiy to'lov ham 401 oladi",
     "Takror xabarlar ikki marta yoziladi",
     "Server umuman ishga tushmaydi"
    ],
    "c": 1,
    "e": "Imzoni solishtiradigan bayt yo'q.",
    "s": 12
   },
   {
    "q": "Imzosiz xabar 401 oldi, lekin buyurtma «To'landi». Sabab?",
    "o": [
     "Kalit .env faylida bo'sh qolib ketgan",
     "main.ts da rawBody yoqilmagan",
     "timingSafeEqual ishlatilmagan",
     "Yozuv imzo tekshiruvidan oldin"
    ],
    "c": 3,
    "e": "401 yozilganni qaytarmaydi.",
    "s": 13
   },
   {
    "q": "Xizmat bitta xabarni ikki marta yubordi. Server nima qiladi?",
    "o": [
     "Ikkinchisiga 409 qaytaradi",
     "Ikkala marta yozadi",
     "200 duplicate, qator bitta",
     "Ikkinchisiga 401 qaytaradi"
    ],
    "c": 2,
    "e": "payment_id noyob, ON CONFLICT.",
    "s": 10
   },
   {
    "q": "Karta rad etildi, xizmat xabar yubordi. Nima qilinadi?",
    "o": [
     "Yoziladi, holati failed",
     "Tashlab yuboriladi, chunki pul o'tmagan",
     "400 qaytariladi",
     "Buyurtma o'chiriladi"
    ],
    "c": 0,
    "e": "«To'lovim qayerda?» ga javob.",
    "s": 10
   },
   {
    "q": ".env da kalit bo'sh. Server nima qiladi?",
    "o": [
     "Imzoni tekshirmay hammasini qabul qiladi",
     "Ogohlantiradi va har xabarni rad etadi",
     "Umuman ishga tushmaydi",
     "Kalitni xizmatdan o'zi so'raydi"
    ],
    "c": 1,
    "e": "Bo'sh kalitni hamma biladi.",
    "s": 15
   },
   {
    "q": "AI webhook'i 1 200 so'mlik to'lovni 120 000 so'mlik buyurtmaga «To'landi» dedi. To'g'ri qaror?",
    "o": [
     "Ishlayapti, imzo to'g'ri — shundayligicha qabul qilish",
     "Faqat logni o'qib turish",
     "Imzoni uzunroq qilish",
     "Summani jami bilan solishtirib ajratish"
    ],
    "c": 3,
    "e": "Imzo summani isbotlamaydi.",
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
//  MENTOR KURSI · Webhook «To'lov xabari: imzo, takror va rad» (v2, F-1104-24)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/23-WH-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar wh-start (= ws2-done) → wh-done (POST /payments/webhook, payments, npm run pay)
//  Kod, terminal, panel holatlari va AI natijalari: 03b-kod.gen.jsx (dev/wh-kod.py — repo teglari va manba/whv2-out, whv2-ai dan aynan)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx wh/parts/*.jsx > WebhookMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-wh-01-tolov-xabari-v1'; // M44: id o'zgarmaydi (v1 dagi qiymat)
const LESSON_TITLE = "To'lov xabari: imzo, takror va rad";
const C1 = { term: '#111827', termEr: '#1F1115', ai: '#6D3BE4', pass: '#15803D', fail: '#C2410C', ws: '#0E7490', live: '#B45309', bad: '#C2362B' };
MKCFG.root = 'OrderBotNest';
MKCFG.kind = (f) => /\.html$/.test(f) ? '#E34F26' : /\.spec\.ts$/.test(f) ? '#99425B' : /\.gateway\.ts$/.test(f) ? C1.ws : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.controller\.ts$/.test(f) ? T.purple : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : /\.md$/.test(f) ? T.ink3 : null;
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
  sig: 'src/api/payment/signature.ts', ctrl: 'src/api/payment/payment.controller.ts', svc: 'src/api/payment/payment.service.ts', inp: 'src/api/payment/payment-input.ts',
  cspec: 'src/api/payment/payment.controller.spec.ts', main: 'src/main.ts', pay: 'scripts/pay.js', env: '.env.example', cfg: 'src/config/index.ts', readme: 'README.md',
};
const BASE_FILES = ['node_modules/', 'public/admin.html', 'scripts/live-client.js', F.pay, 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', 'src/api/catalog/', 'src/api/live/', 'src/api/order/', F.inp, F.cspec, F.ctrl, 'src/api/payment/payment.module.ts', 'src/api/payment/payment.service.spec.ts', F.svc, 'src/api/payment/signature.spec.ts', F.sig, 'src/api/telegram/', 'src/api/user/', F.cfg, 'src/core/', 'src/infrastructure/', F.main, F.env, 'package.json', F.readme];
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
  ['npm run pay', 'npm run pay'], ['npm run start dev', 'npm run start:dev'], ['npm run smoke', 'npm run smoke'], ['npm test', 'npm test'], ['wh done', 'wh-done'], ['wh start', 'wh-start'],
  ['POST payments webhook', 'POST /payments/webhook'], ['payments webhook', '/payments/webhook'], ['Cannot POST payments webhook', 'Cannot POST /payments/webhook'],
  ['payment webhook secret', 'PAYMENT_WEBHOOK_SECRET'], ['signature ts', 'signature.ts'], ['payment controller ts', 'payment.controller.ts'], ['payment controller', 'payment.controller'], ['payment service', 'payment.service'],
  ['main ts', 'main.ts'], ['pay js', 'pay.js'], ['is valid signature', 'isValidSignature'], ['parse payment', 'parsePayment'], ['create hmac sha256', "createHmac('sha256')"], ['timing safe equal', 'timingSafeEqual'],
  ['raw body true', 'rawBody: true'], ['req raw body', 'req.rawBody'], ['raw body', 'rawBody'], ['Nest factory create', 'NestFactory.create'], ['JSON stringify body', 'JSON.stringify(body)'], ['JSON stringify', 'JSON.stringify'],
  ['on conflict payment id do nothing', 'ON CONFLICT (payment_id) DO NOTHING'], ['payment id', 'payment_id'], ['payment status', 'payment_status'], ['order changed', 'order-changed'],
  ['duplicate false', 'duplicate: false'], ['duplicate true', 'duplicate: true'], ['HMAC SHA256', 'HMAC-SHA256'], ['X Signature', 'X-Signature'], ['X Imzo', 'X-Imzo'], ['TOLOV KALITI', 'TOLOV_KALITI'], ['tolov webhook', '/tolov/webhook'], ['takror true', 'takror: true'],
  ['git checkout', 'git checkout'], ['Ctrl C', 'Ctrl+C'], ['m11-03', 'm11-03'],
];
DIGITS.unshift(["bir yuz yigirma ming", '120 000'], ["bir ming ikki yuz", '1 200'], ["o'n ming so'm", "10 000 so'm"], ["oltmish to'rt", '64'], ["to'rt yuz to'rt", '404'], ["to'rt yuz bir", '401'], ["to'rt yuz", '400'], ["ikki yuz", '200'],
  ["o'n besh daqiqa", '15 daqiqa'], ["yigirma ekran", '20 ekran'], ["o'ttiz kun", '30 kun'], ["yettinchi ekran", '7-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/order changed/gi, /raw body/gi, /timing safe equal/gi, /is valid signature/gi, /parse payment/gi, /create hmac sha256/gi, /Nest factory create/gi, /JSON stringify/gi, /on conflict payment id do nothing/gi,
  /payment id/gi, /payment status/gi, /duplicate (true|false)/gi, /HMAC SHA256/g, /X Signature/g, /webhook/g, /Payme/g, /Click/g, /embedded postgres/gi, /Ctrl C/g, /deploy/g);

const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|class|implements|private|readonly|public|async|await|function|return|const|let|new|if|throw|for|of|true|false|null|undefined|typeof|as|number|string|in|unknown|type|require)$/;
function tsLine(src) {
  const re = /(\/\/.*$|\/\*.*?\*\/|<!--.*?-->)|(`(?:[^`\\]|\\.)*`?|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@\w+)|(<\/?[a-zA-Z][\w-]*)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, dec, tag, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (dec) out += `<span class="d">${escH(dec)}</span>`;
    else if (tag) out += `<span class="k">${escH(tag)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const mdLine = (src) => /^#/.test(src) ? `<span class="k">${escH(src)}</span>` : /^\|/.test(src) ? escH(src) : `<span class="cm">${escH(src)}</span>`;
// Terminal: server logi va npm run live — ulangan yashil, uzilish/xato qizil, ulanmoqda sariq, hodisa ko'k
function liveLine(l) {
  const m = /^(\$ )(.*)$/.exec(l);
  if (m) return `<span class="p">$ </span><span class="m">${escH(m[2])}</span>`;
  if (/order-changed|kadr keldi/.test(l)) return `<span class="ev">${escH(l)}</span>`;
  // Webhook: javob kodi va to'lov logi
  if (/← 40\d|"statusCode":40\d|Cannot POST|FAIL |✕|AMOUNT_MISMATCH|\d failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/← 200|"ok":true|PASS |✓|NATIJA: \d+\/\d+ ✓|Tests:\s+\d+ passed|LOG \[Payment\]|rawBody":true/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/WARN \[Payment\]/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/recovered=false|YO'Q —|SERVER XATO|✕|✗/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/connect · ulangan|recovered=true|transport: websocket|\[Live\] panel ulandi|NATIJA: \d+\/\d+ ✓|^\s*✓|Tests:\s+\d+ passed|PASS |WebSocket ochildi|→ «Ulangan»|GET \/admin\/orders → \d+ ta/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/io server disconnect|Token noto'g'ri|«Ulanmagan»/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/ulanmoqda|Ulanmoqda|xhr poll error|transport close|ping timeout|WebSocket yopildi|Offline yoqildi|TARMOQ UZILDI|— server|tarmoq uzildi/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*#|^LOG \[|^\d\d:\d\d:\d\d — |bot →|bot \(/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const outLines = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim() !== '');
const outRange = (k, reA, reB, keep = () => true) => { const L = outLines(k); let a = reA ? L.findIndex((l) => reA.test(l)) : 0; if (a < 0) a = 0; let b = reB ? L.findIndex((l, i) => i > a && reB.test(l)) : L.length; if (b < 0) b = L.length; return L.slice(a, b).filter(keep).map((l) => ({ h: liveLine(l) })); };
const outPick = (k, keep) => outLines(k).filter(keep).map((l) => ({ h: liveLine(l) }));
const jt = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l) => ({ h: liveLine(l) }));
const txtLines = (s) => s.split('\n').filter((l) => l.trim() !== '').map((l) => ({ h: liveLine(l) }));
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style, marks }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} marks={marks} />;
const hlOf = (f) => (/\.md$/.test(f) ? mdLine : tsLine);
const lineN = (k, re, from = 1) => { const l = KOD[k].lines.find((x) => x.n >= from && re.test(x.t)); return l ? l.n : 1; };
const kod = (k, ids = {}, from, to, edit = {}) => { const hl = hlOf(KOD[k].file); return KOD[k].lines.filter((l) => (from == null || l.n >= from) && (to == null || l.n <= to)).flatMap((l) => {
  const base = { h: hl(l.t), n: l.n, ...(ids[l.n] ? { id: ids[l.n] } : {}) };
  if (edit[l.n] == null) return [base];
  if (edit[l.n] === false) return [{ ...base, gone: true }];
  return [{ ...base, gone: true }, { h: hl(edit[l.n]), n: l.n, neu: true, ...(ids[l.n] ? { id: ids[l.n] } : {}) }];
}); };
const rngIds = (a, b, id) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, id]));
const Code = ({ k, ids, from, to, edit, focus, beat, files, active, fresh, style, title }) => <Ide files={compact(files || FILES(), active || KOD[k].file)} active={active || KOD[k].file} fresh={fresh} style={style}>
  <CodePanel file={title || baseName(KOD[k].file)} lines={kod(k, ids, from, to, edit)} focus={focus} beat={beat} />
</Ide>;

function AiReply({ who, prompt, said, hl, tag = t('namuna — sizning AI\'ingiz boshqacha yozadi', "образец — ваш AI напишет иначе") }) {
  return <div className={`ai-card${hl ? ' hl' : ''}`}>
    <div className="bar"><span className="lg">AI</span><span className="tt">{who}</span><span className="tg">{tag}</span></div>
    {prompt && <pre className="pr">{prompt}</pre>}
    {said && <div className="sd">{said}</div>}
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

// Brauzerdagi panel — HAQIQIY suratlardan (KOD.PANEL: headless Chrome, manba/ws2v2-panel.mjs SURAT qatorlari; drive-whv2.sh). Maket: ko'rinish chizilgan, har qator va belgi haqiqiy.
const PCOLS = ['#', 'Mijoz', 'Telefon', 'Mahsulotlar', 'Jami', 'Holat', "To'lov", 'Vaqt'];
const pstage = (k) => KOD.PANEL.find((x) => x.k === k);
function PanelView({ k, note, small, label }) {
  const st = pstage(k); if (!st) return null;
  const cls = st.belgi === 'Ulangan' ? 'ulangan' : st.belgi === 'Ulanmagan' ? 'ulanmagan' : 'ulanmoqda';
  return <div className={`c1-br${small ? ' sm' : ''}`}>
    <div className="bar"><span className="dots"><i /><i /><i /></span><span className="url">localhost:3000/admin</span><span className="src">{label || t('haqiqiy brauzer', "настоящий браузер")} · {st.t}</span></div>
    <div className="hd"><b>Buyurtmalar — jonli panel</b><span className={`belgi ${cls}`}>{st.belgi}</span></div>
    {note && <div className="note">{note}</div>}
    <table><thead><tr>{PCOLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{st.rows.map((r, i) => r.msg ? <tr key={i}><td colSpan={8}>{r.msg}</td></tr> : <tr key={i} className={r.yangi ? 'yangi' : ''}>{r.cells.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
// Vaqt chizig'i: [kalit, sarlavha, izoh, rang]
function Flow({ items, hl = [] }) {
  return <div className="c1-flow">{items.map(([k, h, tx, c], i) => <React.Fragment key={k}>
    {i > 0 && <span className="ar">→</span>}
    <div className={hl.includes(k) ? 'hl' : hl.length ? 'dim' : ''} style={{ '--c': c }}><b>{h}</b><small>{tx}</small></div>
  </React.Fragment>)}</div>;
}
// Chiqish faylining bo'limi: «## <nom>» dan keyingi «## » gacha (bo'sh qatorlarsiz); panel logida millisekund olib tashlanadi
const secRaw = (k, name) => { const L = KOD.OUT[k].split('\n'); const a = L.findIndex((l) => l.startsWith('## ' + name)); if (a < 0) return []; const b = L.findIndex((l, i) => i > a && l.startsWith('## ')); return L.slice(a + 1, b < 0 ? L.length : b).filter((l) => l.trim() !== '' && !/^\s{4}/.test(l)); };
const ms = (l) => l.replace(/^(\d\d:\d\d:\d\d)\.\d{3}/, '$1').replace(/SURAT \S+ \([^)]*\) — /, t('ekranda: ', "на экране:"));
const sec = (k, name, keep = () => true) => secRaw(k, name).filter(keep).map((l) => ({ h: liveLine(ms(l)) }));
const lastLine = (k, re) => (KOD.OUT[k].split('\n').filter((l) => re.test(l)).pop() || '');
// Network: har order-changed kadridan keyin nechta GET /admin/orders (06 — tinglovchi connect ichida)
function netGroups(k) {
  const L = secRaw(k, 'Brauzer'); const out = []; let rc = -1;
  L.forEach((l, i) => {
    if (/WebSocket ochildi/.test(l)) rc++;
    if (/kadr keldi/.test(l)) { const id = (l.match(/"orderId":(\d+)/) || [])[1]; let n = 0; for (let j = i + 1; j < L.length && /GET \/admin\/orders/.test(L[j]); j++) n++; out.push({ id, rc: Math.max(rc, 0), n }); }
  });
  return out;
}
function NetList({ k, upto = 99 }) {
  const G = netGroups(k).slice(0, upto);
  return <div className="c2-net"><div className="hd"><b>Network</b><span>{t("filtr: orders", "фильтр: orders")}</span></div>
    {G.map((g, i) => <div key={i} className="row" style={{ animation: `mk-up .35s ${i * 0.12}s ease both` }}>
      <span className="ev">order-changed #{g.id}</span><span className="rc">{g.rc === 0 ? t('birinchi ulanish', "первое подключение") : t(`${g.rc} qayta ulanishdan keyin`, `после ${g.rc}-го переподключения`)}</span>
      <span className="gets">{Array.from({ length: g.n }, (_, j) => <i key={j}>GET</i>)}</span><b className={g.n > 1 ? 'bad' : ''}>×{g.n}</b>
    </div>)}
  </div>;
}

// Webhook v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.wh-g5{display:grid;grid-template-columns:1fr 26px 1fr 26px 1fr 26px 1fr;align-items:stretch}
.wh-g5 .down{display:flex;justify-content:center;color:#DC2626;font-size:18px}
.wh-a18 td:first-child,.wh-a9 td:first-child{font-family:system-ui,sans-serif;font-weight:700;color:#374151;white-space:nowrap}
.wh-a18 td,.wh-a9 td{vertical-align:top}
.wh-a18 tr.w td{background:#FFF7ED}
.wh-a18 .f{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#FFEDD5;color:#C2410C}
.wh-a18 .g{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#DCFCE7;color:#15803D}
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
.mk-panel .ev{color:#7DD3FC;font-weight:700}
.ai-card{background:${T.paper};border:1.5px solid #D9CCF7;border-radius:12px;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.ai-card.hl{border-color:${C1.ai};box-shadow:0 0 0 4px rgba(109,59,228,.14)}
.ai-card .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#F5F1FE;border-bottom:1px solid #E6DDFB;font:600 12.5px ${SANS};color:${T.ink}}
.ai-card .lg{font:800 11px ${MONO};color:#fff;background:${C1.ai};border-radius:6px;padding:3px 7px}
.ai-card .tg{margin-left:auto;font:600 10px ${MONO};color:${T.ink3};letter-spacing:.04em}
.ai-card .pr{margin:0;padding:8px 12px;font:12px/1.5 ${MONO};color:${T.ink2};background:#FBFAFF;border-bottom:1px dashed #E6DDFB;white-space:pre-wrap}
.ai-card .sd{padding:8px 12px;font-size:13.5px;line-height:1.45;color:${T.ink}}
.ai-card .sd b{color:${C1.ai}}
.ai-card .sd code{font:12px ${MONO};background:#EEF0F4;padding:1px 5px;border-radius:5px;overflow-wrap:anywhere}
.cause{display:grid;gap:6px}
.cause div{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;align-items:center;border:1px solid ${T.line};border-radius:10px;padding:8px 10px;background:${T.paper};font-size:13.5px;line-height:1.4;opacity:.3;transform:translateY(4px);transition:all .35s}
.cause div.on{opacity:1;transform:none}
.cause div.bad{border-color:${T.accent};background:#FFF0EB}
.cause i{font-style:normal;font:800 11px ${MONO};color:#fff;background:${T.ink3};border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}
.cause div.bad i{background:${T.accent}}
.c1-stage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c1-stage>div{border:2px solid var(--c);border-radius:14px;padding:14px;background:${T.paper};transition:opacity .35s}
.c1-stage h4{margin:0 0 4px;font:800 14px ${SANS};color:var(--c)}
.c1-stage p{margin:0;font-size:13.5px;color:${T.ink2};line-height:1.45}
/* Brauzer paneli (haqiqiy bosqichlardan) */
.c1-br{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;color:#1F2328}
.c1-br .bar{display:flex;gap:10px;align-items:center;padding:7px 12px;background:#EEF1F4;border-bottom:1px solid #D0D7DE;font:12px ${SANS}}
.c1-br .dots{display:inline-flex;gap:5px}
.c1-br .dots i{width:10px;height:10px;border-radius:50%;background:#C9CED6;display:inline-block}
.c1-br .url{flex:1;background:#fff;border:1px solid #D0D7DE;border-radius:6px;padding:3px 10px;font:12px ${MONO};color:#57606A}
.c1-br .src{font:600 10.5px ${MONO};color:#57606A}
.c1-br .hd{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #EAEEF2}
.c1-br .hd b{font-size:15px}
.c1-br .belgi{margin-left:auto;padding:3px 10px;border-radius:999px;font:700 12px ${SANS};color:#fff;background:#57606A}
.c1-br .belgi.ulangan{background:#1A7F37}
.c1-br .belgi.ulanmoqda{background:#9A6700}
.c1-br .belgi.ulanmagan{background:#CF222E}
.c1-br .note{padding:6px 14px;font:12.5px ${SANS};color:#57606A;background:#F6F8FA;border-bottom:1px solid #EAEEF2}
.c1-br table{width:100%;border-collapse:collapse;font-size:13px}
.c1-br th,.c1-br td{padding:7px 10px;text-align:left;border-bottom:1px solid #EAEEF2}
.c1-br th{background:#F6F8FA;font-size:12px;color:#57606A}
.c1-br td{white-space:nowrap}
.c1-br tr.yangi td{background:#FFF8C5;transition:background .4s}
.c1-br.sm table{font-size:12px}
.c1-br.sm th,.c1-br.sm td{padding:5px 8px}
/* Oqim */
.c1-flow{display:flex;align-items:stretch;gap:6px;flex-wrap:wrap}
.c1-flow>div{flex:1;min-width:110px;border:2px solid var(--c);border-radius:12px;padding:9px 10px;background:${T.paper};display:grid;gap:3px;transition:opacity .3s,box-shadow .3s}
.c1-flow>div b{font:800 13px ${MONO};color:var(--c)}
.c1-flow>div small{font-size:12px;color:${T.ink2};line-height:1.35}
.c1-flow>div.hl{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.c1-flow>div.dim{opacity:.35}
.c1-flow .ar{align-self:center;font:700 18px ${MONO};color:${T.ink3}}
/* Uch holat */
.c1-state{border:2px solid var(--c);border-radius:14px;padding:12px 14px;background:${T.paper};display:grid;gap:6px;align-content:start;transition:opacity .3s,box-shadow .3s}
.c1-state .belgi{justify-self:start;padding:3px 10px;border-radius:999px;font:700 12.5px ${SANS};color:#fff;background:var(--c)}
.c1-state code{font:12px ${MONO};color:${T.ink};background:#F4F5F7;border-radius:6px;padding:4px 7px;overflow-wrap:anywhere}
.c1-state p{margin:0;font-size:13px;color:${T.ink2};line-height:1.4}
.c1-state.hl{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.c1-state.dim{opacity:.35}
.c1-res{width:100%;border-collapse:separate;border-spacing:0 5px;font-size:13px}
.c1-res th{font:700 12px ${SANS};color:${T.ink2};text-align:left;padding:3px 10px}
.c1-res td{padding:7px 10px;background:${T.paper};border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};font:12.5px ${MONO}}
.c1-res td:first-child{font:600 13px ${SANS};border-left:1px solid ${T.line};border-radius:8px 0 0 8px}
.c1-res td:last-child{border-right:1px solid ${T.line};border-radius:0 8px 8px 0}
.c1-res .ok{color:${T.green};font-weight:700}
.c1-small .mk-panel{font-size:12px}
/* Network ro'yxati (06) */
.c2-net{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;font:12.5px ${MONO};color:#1F2328}
.c2-net .hd{display:flex;gap:10px;align-items:center;padding:7px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE}
.c2-net .hd span{color:#57606A}
.c2-net .row{display:grid;grid-template-columns:150px minmax(0,1fr) auto 36px;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid #EAEEF2}
.c2-net .ev{color:${C1.ws};font-weight:700}
.c2-net .rc{color:#57606A;font-family:${SANS}}
.c2-net .gets{display:flex;gap:4px}
.c2-net .gets i{font-style:normal;background:#DDF4FF;color:#0969DA;border-radius:5px;padding:2px 6px;font-size:11px}
.c2-net b{text-align:right}
.c2-net b.bad{color:${T.accent}}
/* DevTools maketi */
.c2-dev{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;font:12.5px ${SANS};color:#1F2328}
.c2-dev .tabs{display:flex;gap:16px;padding:7px 12px;background:#F3F3F3;border-bottom:1px solid #D0D7DE;color:#57606A}
.c2-dev .tabs b{color:#1A73E8;border-bottom:2px solid #1A73E8;padding-bottom:4px}
.c2-dev .tool{display:flex;gap:12px;align-items:center;padding:8px 12px;border-bottom:1px solid #EAEEF2}
.c2-dev .sel{border:1px solid #D0D7DE;border-radius:5px;padding:3px 8px;background:#fff}
.c2-dev .sel.off{border-color:${T.accent};color:${T.accent};font-weight:700;box-shadow:0 0 0 3px rgba(194,54,43,.12)}
.c2-dev .list{display:grid;gap:2px;padding:8px 12px}
.c2-dev .list span{color:#57606A}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-wh');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-wh'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: panelda «To'landi» va «Rad etildi» (whv2-out/12, 3-surat)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', 'Imzo', 'Takror va rad', 'Buzamiz', 'AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi; pastki qatorda to'lov xizmati: natijani serverga o'zi yuboradi (webhook, X-Signature)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const PAY_ON = ['order', 'db', 'orders'];
const PAY = (steps, res, badge) => ({ get name() { return t("To'lov xizmati", 'Платёжный сервис'); }, get steps() { return typeof steps === 'function' ? steps() : steps; }, res, badge });
const PAID = { orders: 'payment_status: paid' };
const S1M = [
  { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
  { on: PAY_ON, note: PAID, jest: PAY([['POST /payments/webhook', 'ok']], 'pass', '200') },
  { on: PAY_ON, jest: PAY(() => [[t('imzosiz', 'без подписи'), 'bad'], [t('takror', 'повтор'), 'ok']], 'fail', '401 · 200') },
  { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} {...m} tag={t("Bugungi darsning rasmi — to'lov xabari imzo bilan keladi, server tekshirib yozadi", 'Картина урока — сообщение об оплате приходит с подписью, сервер проверяет и записывает')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Kim kimga yuboradi: to'lov xabari (oqim; whv2-out/03 — tana)
// ============================================================
const FLOW2 = [['m', 'Mijoz', 'kartani xizmatga beradi', T.blue], ['x', "To'lov xizmati", 'Payme, Click kabi', C1.ai], ['w', 'POST /payments/webhook', 'tana + X-Signature', T.accent], ['s', 'Server', 'imzo → yozuv', T.green], ['p', 'Panel', "order-changed 'payment'", C1.ws]];
const T2 = outPick('03', (l) => /^→ POST|X-Signature/.test(l));
// F-1109-06: gapli kartalar o'rniga webhook yo'li haqiqiy tana, imzo va javob bilan (whv2-out/03, 12) va «dalil emas / dalil» juftligi
function Path2({ pair, full }) {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("To'lov natijasini server qayerdan biladi — webhook yo'li (npm run pay -- 1)", "Откуда сервер узнаёт результат оплаты — путь webhook (npm run pay -- 1)")}</p>
      <div className="z-flow">
        <div className="z-st"><b>{t("To'lov xizmati", "Платёжный сервис")}</b><span className="z-mut">Payme, Click …</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue" style={{ flex: '2 1 0' }}><b>POST /payments/webhook</b><span className="zm" style={{ fontSize: 12 }}>{'{'}"paymentId":"pay_0005d844","orderId":1,"status":"paid","amount":120000{'}'}</span><span className="zm" style={{ fontSize: 12 }}>X-Signature: 5c7333467…</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("Server", "Сервер")}</b><span className="z-tag g">200</span><span className="zm" style={{ fontSize: 12 }}>{'{'}"ok":true,"duplicate":false{'}'}</span></div>
      </div>
      <div className={'z-flow' + (full ? '' : ' dim')}>
        <div className="z-st"><b>payments</b><span className="zm" style={{ fontSize: 12 }}>pay_0005d844 · #1 · paid · 120000</span></div>
        <div className="z-ar">→</div>
        <div className="z-st"><b>orders</b><span className="zm" style={{ fontSize: 12 }}>#1 · payment_status: paid</span></div>
        <div className="z-ar">→</div>
        <div className="z-st"><b>{t("Panel", "Панель")}</b><span className="zm" style={{ fontSize: 12 }}>order-changed {'{'}"orderId":1,"reason":"payment"{'}'}</span></div>
      </div>
    </div>
    <div className={'z-two' + (pair ? '' : ' dim')}>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}><b style={{ color: 'var(--bad)' }}>{t("Dalil emas", "Не доказательство")}</b><span className="z-mut">{t("mijoz «to'ladim» desa yoki ilova shunday ko'rsatsa", "если клиент говорит «я оплатил» или так показывает приложение")}</span></div>
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}><b style={{ color: 'var(--ok)' }}>{t("Dalil", "Доказательство")}</b><span className="z-mut">{t("faqat xizmatning imzoli xabari: tanada to'rt maydon, sarlavhada imzo", "только подписанное сообщение сервиса: четыре поля в теле, подпись в заголовке")}</span></div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'flow' }, { v: 'two' }, { v: 'ws' }, { v: 'body' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'flow' && <Path2 />}
    {seg.v === 'two' && <Path2 pair />}
    {seg.v === 'ws' && <div className="pg-two">
      <Card c={C1.ws} h="WebSocket"><p>{t("server → panel: server o'zi xabar beradi", "сервер → панель: сервер сообщает сам")}</p></Card>
      <Card c={T.accent} h="Webhook" hl><p>{t("tashqi xizmat → server: xizmat o'zi yuboradi, server ", "внешний сервис → сервер: сервис шлёт сам, сервер ")}<b>{t("kutadi", "ждёт")}</b>{t(" — manzil internetda ochiq", " — адрес открыт в интернете")}</p></Card>
    </div>}
    {seg.v === 'body' && <Path2 pair full />}
  </>} />;
}

// ============================================================
//  3 · wh-start: manzil yo'q — 404 (whv2-out/01)
// ============================================================
const T3A = outRange('01', /^\$ curl/, /^\$ psql/);
const T3B = outRange('01', /^\$ psql/, null);
// F-1109-06: xulosa — uch karta o'rniga haqiqiy 404 va orders jadvali (whv2-out/01) hamda wh-done dagi uch tekshiruv oqimi
function Need3() {
  return <div className="z">
    <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
      <p className="z-h">{t("wh-start: xizmat xabar yubordi — server bilmadi", "wh-start: сервис отправил сообщение — сервер не узнал")}</p>
      <div className="z-term"><span className="m">$ curl -X POST http://localhost:3100/payments/webhook -d '{'{'}"paymentId":"pay_1","orderId":1,"status":"paid","amount":120000{'}'}'</span>{'\n'}<span className="r">{'{'}"message":"Cannot POST /payments/webhook","error":"Not Found","statusCode":404{'}'}</span></div>
      <table className="z-tbl" style={{ maxWidth: 320 }}><tbody><tr><th>id</th><th>status</th><th>total</th></tr><tr className="bad"><td>1</td><td>NEW</td><td>120000</td></tr></tbody></table>
      <span className="z-mut">{t("pul o'tgan, buyurtma bazada «NEW» qoldi — admin bilmaydi", "деньги прошли, заказ в базе остался «NEW» — админ не знает")}</span>
    </div>
    <div className="z-card">
      <p className="z-h">{t("wh-done da xabar uch tekshiruvdan o'tadi", "В wh-done сообщение проходит три проверки")}</p>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("1 · Manzil", "1 · Адрес")}</b><span className="zm">POST /payments/webhook</span><span className="z-mut">{t("404 o'rniga yo'l bor", "вместо 404 есть маршрут")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("2 · Imzo", "2 · Подпись")}</b><span className="z-mut">{t("xabar haqiqatan xizmatdanmi", "действительно ли сообщение от сервиса")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("3 · Bir martalik yozuv", "3 · Однократная запись")}</b><span className="z-mut">{t("ikki marta kelsa ham — bir qator", "даже если придёт дважды — одна строка")}</span></div>
      </div>
    </div>
  </div>;
}
const S3 = mkS(3, [{ v: 'a' }, { v: 'b' }, { v: 'open' }, { v: 'need' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("VS Code terminali · wh-start", "терминал VS Code · wh-start")} lines={T3A} er />}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("VS Code terminali · wh-start", "терминал VS Code · wh-start")} lines={T3A} er /><Term title={t("psql · buyurtma", "psql · заказ")} lines={T3B} /></div>}
    {seg.v === 'open' && <div className="pg-two"><Card c={T.green} h={t("To'lov xizmati", "Платёжный сервис")}><p>{t("to'g'ri xabar yuboradi", "шлёт правильное сообщение")}</p></Card><Card c={T.accent} h={t("Istalgan odam", "Кто угодно")} hl><p>{t("xuddi shu manzilga «#1 to'landi» yubora oladi — manzil ", "может прислать на этот же адрес «#1 оплачен» — адрес ")}<b>{t("ochiq", "открыт")}</b></p></Card></div>}
    {seg.v === 'need' && <Need3 />}
  </>} />;
}

// ============================================================
//  4 · Imzo: xom tana + kalit → HMAC (signature.ts, .env.example)
// ============================================================
const SG = { s0: lineN('SIG', /^export function sign\(/), v0: lineN('SIG', /^export function isValidSignature\(/), chk: lineN('SIG', /if \(!secret \|\| !rawBody/), eq: lineN('SIG', /timingSafeEqual\(got, expected\)/) };
const ENV4 = lineN('ENV', /^PAYMENT_WEBHOOK_SECRET=/);
const S4 = mkS(4, [{ v: 'key' }, { v: 'sign' }, { v: 'chk' }, { v: 'eq' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'key' && <div style={{ display: 'grid', gap: 8 }}><div className="pg-two"><Card c={C1.ai} h={t("To'lov xizmati", "Платёжный сервис")}><p>{t("kabinetida — kalit", "в своём кабинете — ключ")}</p></Card><Card c={T.green} h={t("Bizning server", "Наш сервер")}><p><code>.env</code>{t(" da — o'sha kalit", " — тот же ключ")}</p></Card></div><CodePanel file=".env.example" lines={kod('ENV', { [ENV4]: 'k', [ENV4 - 1]: 'k', [ENV4 - 2]: 'k' }, ENV4 - 2, ENV4)} focus={['k']} /></div>}
    {seg.v === 'sign' && <Code k="SIG" ids={rngIds(SG.s0, SG.s0 + 2, 's')} from={1} to={SG.s0 + 2} focus={['s']} />}
    {seg.v === 'chk' && <Code k="SIG" ids={rngIds(SG.chk - 1, SG.chk, 'c')} from={SG.v0} to={SG.chk} focus={['c']} />}
    {seg.v === 'eq' && <Code k="SIG" ids={rngIds(SG.eq - 1, SG.eq, 'e')} from={SG.v0} to={SG.eq + 1} focus={['e']} />}
  </>} />;
}

// ============================================================
//  5 · Controller: imzo, maydonlar, yozuv — shu tartibda (payment.controller.ts, main.ts, whv2-out/02)
// ============================================================
const CT = { post: lineN('CTRL', /@Post\('webhook'\)/), iff: lineN('CTRL', /^\s+if \($/, lineN('CTRL', /@Post\('webhook'\)/)), parse: lineN('CTRL', /const p = parsePayment/), rec: lineN('CTRL', /const r = await this\.payments\.record/), ret: lineN('CTRL', /return \{ ok: true/) };
const MN = lineN('MAIN', /NestFactory\.create\(AppModule/);
const T5 = outPick('02', (l) => /main\.ts:|Mapped \{\/payments|ishlayapti/.test(l));
// F-1109-06: xulosa — uch karta o'rniga tekshiruv zanjiri (yiqilsa 401 / 400, whv2-out/06, 11) va rawBody bor/yo'q natijalari (07, 08)
// 400 xabari — haqiqiy chiqishdan (whv2-out/11), qo'lda ko'chirilmaydi
const MSG5 = ((KOD.OUT['11'] || '').match(/summa mos emas: [^"\\]+/) || ['summa mos emas'])[0];
function Chain5() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("payment.controller.ts — tartib: imzo, maydonlar, yozuv", "payment.controller.ts — порядок: подпись, поля, запись")}</p>
      <div className="wh-g5">
        <div className="z-st"><b>{t("xabar", "сообщение")}</b><span className="zm" style={{ fontSize: 12 }}>req.rawBody + X-Signature</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue"><b>{t("1 · imzo", "1 · подпись")}</b><span className="z-mut">{t("rawBody dan HMAC", "HMAC из rawBody")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue"><b>{t("2 · maydonlar", "2 · поля")}</b><span className="z-mut">paymentId · orderId · status · amount</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("3 · yozuv", "3 · запись")}</b><span className="z-mut">{t("payments va orders", "payments и orders")}</span><span className="z-tag g">200</span></div>
        <div /><div />
        <div className="down">↓</div><div /><div className="down">↓</div><div /><div />
        <div /><div />
        <div className="z-st bad"><span className="z-tag r">401</span><span className="zm" style={{ fontSize: 12 }}>imzo noto'g'ri</span><span className="z-mut">{t("hech narsa yozilmadi", "ничего не записано")}</span></div><div />
        <div className="z-st bad"><span className="z-tag o">400</span><span className="zm" style={{ fontSize: 12 }}>{MSG5}</span></div><div /><div />
      </div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Imzo xom tanadan — shuning uchun main.ts da rawBody: true", "Подпись из сырого тела — поэтому в main.ts rawBody: true")}</p>
      <div className="z-two">
        <div className="z-st ok"><b>{t("rawBody bilan", "с rawBody")}</b><span className="zm" style={{ fontSize: 12 }}>{t("bo'sh joyli JSON → 200 ", "JSON с пробелами → 200 ")}{'{'}"ok":true{'}'}</span></div>
        <div className="z-st bad"><b>{t("rawBody yo'q", "без rawBody")}</b><span className="zm" style={{ fontSize: 12 }}>{t("to'g'ri imzo ham → 401 · payments: 0", "даже верная подпись → 401 · payments: 0")}</span></div>
      </div>
    </div>
  </div>;
}
const S5 = mkS(5, [{ v: 'sig' }, { v: 'rec' }, { v: 'main' }, { v: 'order' }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {seg.v === 'sig' && <Code k="CTRL" ids={rngIds(CT.iff, CT.iff + 5, 's')} from={CT.post - 1} to={CT.iff + 5} focus={['s']} />}
    {seg.v === 'rec' && <Code k="CTRL" ids={{ [CT.parse]: 'r', [CT.rec]: 'r', [CT.ret]: 'r' }} from={CT.iff} to={CT.ret + 1} focus={['r']} />}
    {seg.v === 'main' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="src/main.ts" lines={kod('MAIN', { [MN]: 'm', [MN - 1]: 'm' }, MN - 1, MN + 1)} focus={['m']} /><Term title={t("server logi · npm run start (02)", "лог сервера · npm run start (02)")} lines={T5} /></div>}
    {seg.v === 'order' && <Chain5 />}
  </>} />;
}

// ============================================================
//  6 · Tekshiruv 1 — imzosiz xabar (whv2-out/05)
// ============================================================
const T6 = outRange('05', /^\$ npm run pay -- \d+ imzosiz/, /^\$ npm run pay -- \d+ soxta/);
function Screen6(p) {
  return MC(p, 6, {
    above: <CodePanel file="payment.controller.ts · webhook()" lines={kod('CTRL', rngIds(CT.iff, CT.rec, 'c'), CT.iff, CT.rec)} focus={['c']} />,
    after: <Term title={t("VS Code terminali · npm run pay -- 1 imzosiz (05)", "терминал VS Code · npm run pay -- 1 imzosiz (05)")} lines={T6} />,
  });
}

// ============================================================
//  7 · Haqiqiy oqim: npm run pay → panelda «To'landi» (pay.js; whv2-out/03, 12)
// ============================================================
const PY = { sg: lineN('PAY', /^const sign = /), fe: lineN('PAY', /const r = await fetch\(`\$\{url\}\/payments\/webhook`/) };
const T7A = outRange('03', /^\$ npm run pay/, /^## Server/);
const T7L = outPick('03', (l) => /LOG \[Payment\] pay_/.test(l));
const T7DB = outRange('03', /^\$ psql/, null);
const T7EV = KOD.OUT['12'].split('\n').filter((l) => /"reason":"payment"/.test(l)).slice(0, 1).map((l) => ({ h: liveLine(ms(l)) }));
const S7 = mkS(7, [{ v: 'pay' }, { v: 'run' }, { v: 'db' }, { v: 'panel' }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    {seg.v === 'pay' && <Code k="PAY" ids={{ ...rngIds(PY.sg, PY.sg, 'p'), ...rngIds(PY.fe, PY.fe + 1, 'p') }} from={PY.sg} to={PY.fe + 4} focus={['p']} />}
    {seg.v === 'run' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("VS Code terminali · npm run pay -- 1", "терминал VS Code · npm run pay -- 1")} lines={T7A} /><Term title={t("server logi", "лог сервера")} lines={T7L} /></div>}
    {seg.v === 'db' && <Term title={t("psql · payments va orders (03)", "psql · payments и orders (03)")} lines={T7DB} />}
    {seg.v === 'panel' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="12-1" small label={t("to'lovdan oldin", "до оплаты")} /><PanelView k="12-2" small label={t("to'lovdan keyin — sahifa yangilanmadi", "после оплаты — страница не обновлялась")} /><Term title={t("panel logi", "лог панели")} lines={T7EV} /></div>}
  </>} />;
}

// ============================================================
//  8 · Amaliyot 1 — webhook va soxta to'lov xizmati
// ============================================================
const P8 = mkPractice(8, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: F.env, lines: kod('ENV', { [ENV4]: 'k' }, ENV4 - 2, ENV4) }, { step: 3, file: F.pay, lines: kod('PAY'), copy: false }],
});
function ScreenP8(p) { return <Practice p={p} S={P8.S} steps={P8.steps} trouble={P8.trouble} proof={P8.proof} code={P8.code} tree={FILES()} />; }

// ============================================================
//  9 · Imzosiz va boshqa kalit — 401 (whv2-out/05)
// ============================================================
const T9B = outRange('05', /^\$ npm run pay -- \d+ soxta/, /^## Server/);
const T9L = outPick('05', (l) => /WARN \[Payment\]/.test(l));
const T9DB = outRange('05', /^\$ psql/, null);
// F-1109-06: xulosa — ikki qoida kartasi ostiga bir xil to'lov × uch xil imzo jadvali (whv2-out/03, 05)
function Sig9() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Bir xil to'lov — uch xil imzo (npm run pay -- 1 …)", "Один и тот же платёж — три разные подписи (npm run pay -- 1 …)")}</p>
      <table className="z-tbl wh-a9"><tbody>
        <tr><th>{t("xabar", "сообщение")}</th><th>{t("javob", "ответ")}</th><th>payments</th><th>{t("server logi", "лог сервера")}</th></tr>
        <tr className="ok"><td>{t("to'g'ri kalit bilan imzolangan", "подписано верным ключом")}</td><td>200 {'{'}"ok":true,"duplicate":false{'}'}</td><td>{t("+1 qator", "+1 строка")}</td><td>LOG pay_0005d844 · #1 · paid</td></tr>
        <tr className="bad"><td>{t("imzosiz", "без подписи")}</td><td>401 imzo noto'g'ri</td><td>{t("yangi qator yo'q", "новой строки нет")}</td><td>WARN imzo noto'g'ri — xabar rad etildi</td></tr>
        <tr className="bad"><td>{t("boshqa kalit bilan (soxta)", "другим ключом (поддельный)")}</td><td>401 imzo noto'g'ri</td><td>{t("yangi qator yo'q", "новой строки нет")}</td><td>WARN imzo noto'g'ri — xabar rad etildi</td></tr>
      </tbody></table>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}><b style={{ color: 'var(--ok)' }}>{t("Kalit — butun himoya", "Ключ — вся защита")}</b><span className="z-mut">{t("to'g'ri imzoni faqat kalitni biladigan yasaydi", "верную подпись делает только тот, кто знает ключ")}</span></div>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}><b style={{ color: 'var(--bad)' }}>{t("Kalit qayerda", "Где ключ")}</b><span className="z-mut">{t(".env va hosting sozlamasi — kodda, git'da, chatda emas", ".env и настройки хостинга — не в коде, не в git, не в чате")}</span></div>
    </div>
  </div>;
}
const S9 = mkS(9, [{ v: 'a' }, { v: 'b' }, { v: 'log' }, { v: 'rule' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("VS Code terminali · imzosiz", "терминал VS Code · imzosiz")} lines={T6} er />}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><Term title="imzosiz" lines={T6} er /><Term title={t("boshqa kalit bilan (soxta)", "другим ключом (поддельный)")} lines={T9B} er /></div>}
    {seg.v === 'log' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("server logi", "лог сервера")} lines={T9L} /><Term title={t("psql · payments qatorlari (o'zgarmadi)", "psql · строки payments (не изменились)")} lines={T9DB} /></div>}
    {seg.v === 'rule' && <Sig9 />}
  </>} />;
}

// ============================================================
//  10 · Takror va rad (whv2-out/04, 15, 06, 12; payment.service.ts)
// ============================================================
const SV = { ins: lineN('SVC', /INSERT INTO payments/), dup: lineN('SVC', /if \(rows\.length === 0\) return \{ duplicate: true \}/), upd: lineN('SVC', /UPDATE orders SET payment_status/) };
const T10A = outRange('04', /^\$ npm run pay/, /^\$ psql/);
const T10C = outRange('15', /^\$ curl/, null);
const T10R = outRange('06', /^\$ npm run pay/, null);
const S10 = mkS(10, [{ v: 'ikki' }, { v: 'svc' }, { v: 'rad' }, { v: 'panel' }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'ikki' && <Term title={t("VS Code terminali · npm run pay -- 1 ikki (04)", "терминал VS Code · npm run pay -- 1 ikki (04)")} lines={T10A} />}
    {seg.v === 'svc' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="payment.service.ts" lines={kod('SVC', rngIds(SV.ins, SV.dup, 'd'), SV.ins - 1, SV.dup)} focus={['d']} /><Term title={t("bir xil xabar bir vaqtda ikki marta (15)", "одно и то же сообщение дважды одновременно (15)")} lines={T10C} /></div>}
    {seg.v === 'rad' && <Term title={t("VS Code terminali · npm run pay -- 2 rad (06)", "терминал VS Code · npm run pay -- 2 rad (06)")} lines={T10R} />}
    {seg.v === 'panel' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="12-3" small label={t("panel · sahifa yangilanmadi", "панель · страница не обновилась")} /><CodePanel file={t("payment.service.ts · to'langani tushmaydi", "payment.service.ts · оплаченный не падает")} lines={kod('SVC', rngIds(SV.upd, SV.upd + 1, 'u'), SV.upd - 1, SV.upd + 3)} focus={['u']} /></div>}
  </>} />;
}

// ============================================================
//  11 · Amaliyot 2 — ikki marta, imzosiz, rad
// ============================================================
const P11 = mkPractice(11, [[], [0, 1], [2, 3], []]);
function ScreenP11(p) { return <Practice p={p} S={P11.S} steps={P11.steps} trouble={P11.trouble} proof={P11.proof} tree={FILES()} />; }

// ============================================================
//  12 · Buzamiz: xom tana va rawBody (00b; whv2-out/07done, 07json, 08)
// ============================================================
const JS = { a: lineN('CTRL_JSON', /Buffer\.from\(JSON\.stringify\(body\)\)/) };
// curl satri ikkiga: buyruq va tana (bo'sh joylar ko'rinsin)
const splitCurl = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim()).slice(1).filter((l, i, a) => i < a.findIndex((x) => x.startsWith('## Server'))).flatMap((l) => { const m = /^(\$ curl .*?) -d '(.*)'$/.exec(l); return m ? [m[1] + ' \\', "    -d '" + m[2] + "'"] : [l]; }).map((l) => ({ h: liveLine(l) }));
const T12A = splitCurl('07done');
const T12B = splitCurl('07json');
const MNR = lineN('MAIN_NORAW', /NestFactory\.create\(AppModule/);
const T12C = [...outPick('08', (l) => /main\.ts:/.test(l)), ...outRange('08', /^\$ npm run pay/, /^## Server/), ...outRange('08', /^\$ psql/, null)];
const CAUSE12 = ['Xizmat imzoni aniq baytlardan hisoblaydi — bo\'sh joy ham bayt', "Nest tanani obyektga aylantiradi, baytlarni tashlaydi", "JSON.stringify(body) — boshqa baytlar: bo'sh joy yo'qoladi, imzo mos kelmaydi", "Baytlarni faqat rawBody: true saqlaydi — req.rawBody"];
// F-1120-02 (M52): 1-segment (x) — mentor wh-done controller'idagi req.rawBody ni o'zi bosadi → imzo JSON.stringify(body) dan
const RB = lineN('CTRL', /isValidSignature\(req\.rawBody/);
const ACT12 = () => kod('CTRL', { [RB]: 'x' }, RB - 2, RB + 3).map((l) => (l.n === RB ? { ...l, h: l.h.replace('req.rawBody', '<span class="n1-act" data-act="1">req.rawBody</span>') } : l));
const SigMini = ({ src, known, res, pins }) => <N1Mini><FlowMini tag={t("to'lov xizmati → imzo → javob", 'платёжный сервис → подпись → ответ')}
  boxes={[[t("to'lov xizmati", 'платёжный сервис'), t("bo'sh joyli JSON", 'JSON с пробелами'), ''], [t('imzo manbasi', 'источник подписи'), src, src === 'req.rawBody' ? '' : 'bad'], [t('javob', 'ответ'), known ? res : '?', known && res !== '200' ? 'bad' : '']]}
  res={src !== 'req.rawBody' ? [known ? t("401 — haqiqiy to'lov ham rad", '401 — отклонён и настоящий платёж') : '?', 'bad'] : null} pins={pins} /></N1Mini>;
const S12 = mkS(12, [{ v: 'act' }, { v: 'code' }, { v: 'two' }, { v: 'raw' }, { v: 'cause' }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={(b) => <Scene12 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 json nusxa (javob «?») · 2 bo'sh joyli JSON: 200 vs 401, bo'laklar 1·2 · 3 rawBody yo'q · 4 sabab
function Scene12({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'code' : 'act') : seg.v;
  const src = v === 'act' ? 'req.rawBody' : v === 'raw' ? t("req.rawBody — yo'q", 'req.rawBody — нет') : 'JSON.stringify(body)';
  const mini = <SigMini src={src} known={beat >= 2} res="401" pins={beat === 2 ? { 1: 1, 2: 2 } : {}} />;
  return <>
    {v === 'act' && <><div onClick={act.onClick}><CodePanel file="payment.controller.ts · wh-done" lines={ACT12()} focus={['x']} /></div>{mini}</>}
    {v === 'code' && <CodePanel file={t("payment.controller.ts · json nusxa (imzo JSON.stringify'dan)", "payment.controller.ts · копия json (подпись из JSON.stringify)")} lines={kod('CTRL_JSON', rngIds(JS.a - 1, JS.a + 3, 'x'), JS.a - 3, JS.a + 5)} focus={['x']} />}
    {(v === 'code' || v === 'two' || v === 'raw') && mini}
    {v === 'two' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("wh-done (xom tana) · bo'sh joyli JSON", "wh-done (сырое тело) · JSON с пробелами")} lines={T12A} /><Term title={t("json nusxa · o'sha xabar", "копия json · то же сообщение")} lines={T12B} er /></div>}
    {v === 'raw' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("src/main.ts · norawbody nusxa", "src/main.ts · копия norawbody")} lines={kod('MAIN_NORAW', { [MNR]: 'x' }, MNR - 1, MNR + 1)} focus={['x']} /><Term title={t("norawbody · to'g'ri imzoli to'lov (08)", "norawbody · оплата с верной подписью (08)")} lines={T12C} er /></div>}
    {/* F-1120-02 (M50-2): sabab qadamida kichik rasm yashirilmaydi — ro'yxat uning ostida */}
    {v === 'cause' && <div style={{ display: 'grid', gap: 10 }}>{mini}<Cause items={CAUSE12} on={4} bad={2} /></div>}
  </>;
}

// ============================================================
//  13 · Buzamiz: tartib — 401, lekin «To'landi» (00b tartib; whv2-out/09, 09b)
// ============================================================
const TR = { parse: lineN('CTRL_TARTIB', /const p = parsePayment/), rec: lineN('CTRL_TARTIB', /const r = await this\.payments\.record/) };
TR.thr = lineN('CTRL_TARTIB', /throw new UnauthorizedException/, TR.rec);
const T13A = outRange('09', /^\$ npm run pay/, /^## Server/);
const T13DB = outRange('09', /^\$ psql/, null);
const CAUSE13 = ['parsePayment va record — imzodan oldin', 'record tranzaksiyasi tugadi: payments da qator, orders.payment_status = paid', "keyin imzo tekshiriladi — 401 qaytadi", '401 faqat javob — bazaga yozilganni qaytarmaydi: admin yetkazadi, pul yo\'q'];
// F-1120-02 (M52): 1-segment (x) — mentor wh-done controller'idagi this.payments.record satrini o'zi bosadi → yozuv imzodan oldinga ko'chadi
const RC = lineN('CTRL', /this\.payments\.record/);
const ACT13 = () => kod('CTRL', { [RC]: 'x' }, RB - 1, RC + 1).map((l) => (l.n === RC ? { ...l, h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : l));
const OrderMini = ({ moved, ans, db, pins }) => <N1Mini><FlowMini tag={t('imzosiz xabar → controller → javob va baza', 'сообщение без подписи → controller → ответ и база')}
  boxes={[[t('imzosiz xabar', 'сообщение без подписи'), 'npm run pay -- 1 imzosiz', ''], ['controller', moved ? t('record → imzo', 'record → подпись') : t('imzo → record', 'подпись → record'), moved ? 'bad' : ''], [t('javob · baza', 'ответ · база'), (ans ? '401' : '?') + ' · ' + (db ? 'paid' : '?'), db ? 'bad' : '']]}
  res={moved ? [db ? t("401, lekin buyurtma «To'landi» — pul yo'q", "401, но заказ «To'landi» — денег нет") : '?', 'bad'] : null} pins={pins} /></N1Mini>;
const S13 = mkS(13, [{ v: 'act' }, { v: 'code' }, { v: 'run' }, { v: 'db' }, { v: 'cause' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={(b) => <Scene13 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 tartib nusxa · 2 javob 401 · 3 bazada paid, bo'laklar 1·2 · 4 sabab
function Scene13({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'code' : 'act') : seg.v;
  const mini = <OrderMini moved={v !== 'act'} ans={beat >= 2} db={beat >= 3} pins={beat === 3 ? { 1: 1, 2: 2 } : {}} />;
  return <>
    {v === 'act' && <><div onClick={act.onClick}><CodePanel file="payment.controller.ts · wh-done" lines={ACT13()} focus={['x']} /></div>{mini}</>}
    {v === 'code' && <CodePanel file={t("payment.controller.ts · tartib nusxa", "payment.controller.ts · копия tartib")} lines={kod('CTRL_TARTIB', { [TR.parse]: 'x', [TR.rec]: 'x' }, TR.parse, TR.thr + 1)} focus={['x']} />}
    {(v === 'code' || v === 'run' || v === 'db') && mini}
    {v === 'run' && <Term title={t("VS Code terminali · npm run pay -- 1 imzosiz (09)", "терминал VS Code · npm run pay -- 1 imzosiz (09)")} lines={T13A} />}
    {v === 'db' && <div style={{ display: 'grid', gap: 8 }}><Term title="psql (09)" lines={T13DB} er /><PanelView k="09b-1" small label={t("tartib nusxa · imzosiz xabardan keyin", "копия с порядком · после сообщения без подписи")} /></div>}
    {/* F-1120-02 (M50-2): sabab qadamida kichik rasm yashirilmaydi — ro'yxat uning ostida */}
    {v === 'cause' && <div style={{ display: 'grid', gap: 10 }}>{mini}<Cause items={CAUSE13} on={4} bad={3} /></div>}
  </>;
}

// ============================================================
//  14 · Tekshiruv 2 — LineCheck: record imzodan oldin (tartib nusxa)
// ============================================================
const LC14 = KOD.CTRL_TARTIB.lines.filter((l) => l.n >= TR.parse && l.n <= TR.thr + 1).map((l) => ({ h: tsLine(l.t), n: l.n }));
const LC14_FIXED = KOD.CTRL.lines.filter((l) => l.n >= CT.iff && l.n <= CT.rec).map((l) => ({ h: tsLine(l.t), n: l.n, ...(l.n >= CT.parse ? { neu: true } : {}) }));
function Screen14(p) {
  const m = MDT[14];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={t("payment.controller.ts · webhook() · tartib nusxa", "payment.controller.ts · webhook() · копия tartib")} lines={LC14} target={LC14.findIndex((l) => l.n === TR.rec)}
    fixed={LC14_FIXED} fixedExtra={[{ file: t('psql · tartib nusxa, imzosiz xabardan keyin (09) — 401, lekin paid', "psql · копия с порядком, после сообщения без подписи (09) — 401, но paid"), lines: T13DB }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  15 · Kalit bo'sh, summa va maydon xato (whv2-out/10, 11; signature.ts)
// ============================================================
const T15W = outPick('10', (l) => /PAYMENT_WEBHOOK_SECRET bo'sh/.test(l));
const T15P = [...outRange('10', /^\$ npm run pay/, /^\$ psql/), ...outRange('10', /^\$ psql/, null)];
const T15S = outPick('11', (l) => !/^\s*$/.test(l));
// F-1109-06: xulosa — ikki karta o'rniga haqiqiy ogohlantirish va natija (whv2-out/10) hamda kalit joylari teglar bilan
function Key15() {
  return <div className="z">
    <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
      <p className="z-h">{t(".env da PAYMENT_WEBHOOK_SECRET bo'sh — server ishga tushadi, lekin", "PAYMENT_WEBHOOK_SECRET в .env пустой — сервер запускается, но")}</p>
      <div className="z-term"><span className="y">WARN [Payment] PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)</span>{'\n'}<span className="m">$ npm run pay -- 1</span>{'\n'}<span className="r">← 401 {'{'}"message":"imzo noto'g'ri","error":"Unauthorized","statusCode":401{'}'}</span>{'\n'}<span className="m">payments_qatorlari:</span> 0</div>
      <span className="z-mut">{t("imzo to'g'ri bo'lsa ham — summa va qator to'g'ri bo'lsa ham — har xabar 401", "даже при верной подписи, сумме и строке — каждое сообщение 401")}</span>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}>
        <p className="z-h" style={{ color: 'var(--ok)' }}>{t("Kalit — shu yerda", "Ключ — здесь")}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><span className="z-tag g">{t(".env (lokal)", ".env (локально)")}</span><span className="z-tag g">{t("hosting sozlamasi (Render)", "настройки хостинга (Render)")}</span><span className="z-tag g">{t("xizmat kabineti", "кабинет сервиса")}</span></div>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
        <p className="z-h" style={{ color: 'var(--bad)' }}>{t("Kalit — hech qachon", "Ключ — никогда")}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><span className="z-tag r">{t("kodda", "в коде")}</span><span className="z-tag r">{t("git'da", "в git")}</span><span className="z-tag r">{t("AI'ga chatda", "AI в чате")}</span><span className="z-tag r">{t("skrinshotda", "на скриншоте")}</span></div>
        <span className="z-mut">{t("tushib qolsa — darhol almashtiriladi", "если утёк — сразу меняется")}</span>
      </div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'warn' }, { v: 'p401' }, { v: 'p400' }, { v: 'hyg' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'warn' && <Term title={t("server logi · ishga tushish (10)", "лог сервера · запуск (10)")} lines={T15W} />}
    {seg.v === 'p401' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("kalit bo'sh · npm run pay (10)", "ключ пустой · npm run pay (10)")} lines={T15P} er /><CodePanel file="signature.ts" lines={kod('SIG', { [SG.chk]: 'c' }, SG.chk - 1, SG.chk)} focus={['c']} /></div>}
    {seg.v === 'p400' && <Term title={t("imzo to'g'ri, summa va holat xato (11)", "подпись верная, сумма и статус неверные (11)")} lines={T15S} />}
    {seg.v === 'hyg' && <Key15 />}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — kalit bo'sh bo'lsa (10; payment.controller.spec.ts)
// ============================================================
const CS16 = lineN('CSPEC', /kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401/);
function Screen16(p) {
  return MC(p, 16, {
    above: <div style={{ display: 'grid', gap: 8 }}><CodePanel file="signature.ts" lines={kod('SIG', { [SG.chk]: 'c' }, SG.chk - 1, SG.chk)} focus={['c']} /><Term title={t("server logi (10)", "лог сервера (10)")} lines={T15W} /></div>,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("kalit bo'sh · npm run pay (10)", "ключ пустой · npm run pay (10)")} lines={T15P} /><CodePanel file="payment.controller.spec.ts" lines={kod('CSPEC', { [CS16]: 't' }, CS16, CS16)} focus={['t']} /></div>,
  });
}

// ============================================================
//  17 · Amaliyot 3 — tartibni buzing, testlar qizarsin (whv2-out/14, 13)
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.ctrl, lines: kod('CTRL_TARTIB', { [TR.parse]: 'x', [TR.rec]: 'x' }, TR.parse, TR.thr + 1), copy: false }, { step: 2, file: F.cspec, lines: kod('CSPEC', {}, lineN('CSPEC', /imzosiz — 401/), lineN('CSPEC', /imzodan keyin tana/) + 5), copy: false }],
});
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} code={P17.code} tree={FILES()} />; }
// ============================================================
//  18 · AI webhook yozdi — ikki javob (whv2-ai/*/00-javob.md, diff-stat)
// ============================================================
// F-1109-06: xulosa — ikki iqtibos o'rniga taqqoslash jadvali (whv2-ai/XULOSA.md) va «AI o'zi aytgan gapni o'qing»
function Cmp18() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Talab: «POST, JSON, HMAC-SHA256, X-Signature, kalit .env da» — xizmat hujjatidagidek qisqa", "Требование: «POST, JSON, HMAC-SHA256, X-Signature, ключ в .env» — коротко, как в документации сервиса")}</p>
      <table className="z-tbl wh-a18"><tbody>
        <tr><th /><th>1-AI</th><th>2-AI</th></tr>
        <tr><td>{t("Manzil", "Адрес")}</td><td>/payments/webhook</td><td>/webhooks/payment</td></tr>
        <tr><td>{t("Imzo", "Подпись")}</td><td>{t("xom tana · timingSafeEqual", "сырое тело · timingSafeEqual")} <span className="g">{t("to'g'ri", "верно")}</span></td><td>{t("xom tana · timingSafeEqual", "сырое тело · timingSafeEqual")} <span className="g">{t("to'g'ri", "верно")}</span></td></tr>
        <tr><td>{t("Takror", "Повтор")}</td><td>{t("200 duplicate, 1 qator", "200 duplicate, 1 строка")} <span className="g">{t("to'g'ri", "верно")}</span></td><td>{t("1 qator", "1 строка")} <span className="g">{t("to'g'ri", "верно")}</span></td></tr>
        <tr className="w"><td>{t("Summa farq qilsa", "Если сумма отличается")}</td><td>{t("yozadi, panelda «Summa mos emas»", "записывает, в панели «Summa mos emas»")}</td><td>{t("200, «to'landi» — o'zi aytdi: ", "200, «оплачено» — сам сказал: ")}<b>{t("«siz hal qiling»", "«решайте вы»")}</b> <span className="f">{t("AI aytdi", "AI сказал")}</span></td></tr>
        <tr className="w"><td>{t("O'z sinovi", "Своя проверка")}</td><td>embedded-postgres, smoke 15/15</td><td>{t("supertest + mock, baza yo'q", "supertest + mock, базы нет")}</td></tr>
        <tr className="w"><td>{t("Doira", "Рамки")}</td><td>{t("bir marta loyihadan tashqariga nusxa — ", "один раз копия вне проекта — ")}<b>{t("o'zi aytdi", "сказал сам")}</b>{t(", o'chirdi", ", удалил")} <span className="f">{t("doiradan chiqdi", "вышел за рамки")}</span></td><td>{t("toza", "чисто")}</td></tr>
      </tbody></table>
    </div>
    <div className="z-rule">{t("AI o'zi aytgan gapni o'qing: ", "Читайте, что AI сказал сам: ")}<b>{t("«siz hal qiling»", "«решайте вы»")}</b>{t(" — summa qarori sizda.", " — решение по сумме за вами.")}</div>
  </div>;
}
const S18 = mkS(18, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'quote' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("imzo, tartib, xom tana, takror, rad, to'rt buzilish", "подпись, порядок, сырое тело, повтор, отказ, четыре поломки")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("qisqa talab → ikki webhook → haqiqiy bazada sinov", "короткое требование → два webhook → проверка на настоящей базе")}</p></div>
    </div>}
    {seg.v === 'prompt' && <div style={{ marginTop: 10 }}><AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: xom tana, takror, tartib, summa yo'q", "без подсказок: нет сырого тела, повтора, порядка, суммы")} /></div>}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<>{KOD.AI.ai1.stat} · <code>POST /payments/webhook</code> · <code>rawBody</code> · <code>timingSafeEqual</code>, <code>sha256=</code>{t(" ham qabul · UNIQUE + ", " тоже принимается · UNIQUE + ")}<code>FOR UPDATE</code> · <b>{t("«Summa mos emas» holati", "статус «Summa mos emas»")}</b> · 409 · smoke 15/15 (<code>embedded-postgres</code>)</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<>{KOD.AI.ai2.stat} · <code>POST /webhooks/payment</code> · <code>rawBody</code> · 64-hex + <code>timingSafeEqual</code>{t(" · takror — qatorni yangilaydi · ", " · повтор — обновляет строку · ")}<b>{t("summa farq qilsa — 200 va faqat log", "сумма отличается — 200 и только лог")}</b></>} />
    </div>}
    {seg.v === 'quote' && <Cmp18 />}
  </>} />;
}

// ============================================================
//  19 · AI webhook'lari haqiqiy bazada (whv2-ai/*/01-haqiqiy-baza.txt)
// ============================================================
// «## N. …» bo'limidagi javob kodi va qatorlar soni
function aiTest(ai, n) {
  const L = KOD.OUT[ai].split('\n');
  const part = (k) => { const a = L.findIndex((l) => l.startsWith(`## ${k}.`)); if (a < 0) return null; const b = L.findIndex((l, i) => i > a && l.startsWith('## ')); return L.slice(a + 1, b < 0 ? L.length : b); };
  const rowsOf = (S) => (S ? (S.map((l) => (l.match(/qatorlari: (\d+)/) || [])[1]).filter(Boolean).pop() || '') : '');
  const S = part(n); if (!S) return '?';
  const codes = S.map((l) => (l.match(/← (\d{3})/) || [])[1]).filter(Boolean).join(' · ');
  if (n === 2 || n === 7) return `${codes} · ${rowsOf(S)} qator`;
  if (n === 3 || n === 4) return `${codes} · ${rowsOf(S) === rowsOf(part(n - 1)) ? "yangi qator yo'q" : 'qator qo\'shildi!'}`;
  return codes;
}
const TESTS19 = [[1, "to'g'ri imzo"], [2, 'takror'], [3, 'imzosiz'], [4, '«abc» imzo'], [6, "bo'sh joyli JSON"], [7, 'bir vaqtda ikki']];
const aiSec = (ai, n) => { const L = KOD.OUT[ai].split('\n'); const a = L.findIndex((l) => l.startsWith(`## ${n}.`)); const b = L.findIndex((l, i) => i > a && l.startsWith('## ')); return L.slice(a, b).filter((l) => l.trim()).map((l) => ({ h: liveLine(l) })); };
const aiGet = (ai, re) => KOD.OUT[ai].split('\n').filter((l) => re.test(l)).map((l) => ({ h: liveLine(l) }));
const FOUR19 = ['Imzo xom baytlardanmi (rawBody)?', 'Imzo har qanday yozuvdan oldinmi?', 'Takror va bir vaqtdagi xabar — bitta qatormi?', 'Summa buyurtma jami bilan solishtiriladimi?'];
const S19 = mkS(19, [{ v: 'tab' }, { v: 'sum' }, { v: 'three' }, { v: 'four' }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    {seg.v === 'tab' && <table className="c1-res"><thead><tr><th>{t("Sinov (haqiqiy PostgreSQL)", "Проверка (настоящий PostgreSQL)")}</th><th>1-AI</th><th>2-AI</th></tr></thead>
      <tbody>{TESTS19.map(([n, h]) => <tr key={n}><td>{h}</td><td className="ok">{aiTest('ai1', n)}</td><td className="ok">{aiTest('ai2', n)}</td></tr>)}</tbody></table>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("1-AI · summa 1 200, buyurtma 120 000", "1-й AI · сумма 1 200, заказ 120 000")} lines={[...aiSec('ai1', 5), ...aiGet('ai1', /^#2 /)]} /><Term title={t("2-AI · o'sha xabar", "2-й AI · то же сообщение")} lines={[...aiSec('ai2', 5), ...aiGet('ai2', /^#2 /)]} er /></div>}
    {seg.v === 'three' && <div className="pg-three">
      <Card c={T.ink3} h={t("Bizniki (wh-done)", "Наш (wh-done)")}><p>{t("400 «summa mos emas» — yozilmaydi. Pul o'tgan bo'lsa, yozuv ", "400 «summa mos emas» — не записывается. Если деньги прошли, запись ")}<b>{t("yo'qoladi", "пропадает")}</b></p></Card>
      <Card c={T.green} h="1-AI" hl><p>{t("yoziladi, ", "записывается, ")}<b>{t("«Summa mos emas»", "«Summa mos emas»")}</b>{t(" — admin farqni ko'radi. Bu yerda bizdan yaxshiroq", " — админ видит разницу. Здесь лучше нас")}</p></Card>
      <Card c={T.accent} h="2-AI"><p>{t("«To'landi» — admin yetkazib beradi, pul 1 %", "«To'landi» — админ доставит, денег 1 %")}</p></Card>
    </div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI webhook'ini qabul qilish — to'rt savol", "Приём webhook от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR19.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  20 · Tekshiruv 4 — summa mos emas (ai2/01, ai1/01)
// ============================================================
function Screen20(p) {
  return MC(p, 20, {
    above: <Term title={t("2-AI · haqiqiy bazada (5-sinov)", "2-й AI · на настоящей базе (проверка 5)")} lines={[...aiSec('ai2', 5).slice(2), ...aiGet('ai2', /^#2 /), ...aiGet('ai2', /WARN \[Payment\] #2/)]} />,
    after: <Term title={t("1-AI · o'sha xabar", "1-й AI · то же сообщение")} lines={[...aiSec('ai1', 5).slice(2), ...aiGet('ai1', /^#2 /)]} />,
  });
}

// ============================================================
//  21 · m11-03 xaritasi (PaymentWebhookLesson.jsx — SCREEN_META 20)
// ============================================================
const BLOK21 = [['1 Kirish', 's0 · s1 reja', "mijozning gapi dalil emas (2)"], ['2 Xabar va imzo', "s2 to'lov xabari · s3 test · s4 imzo · s5 test", "soxta 401, xom tana (9, 12)"], ['3 Takror', "s6 javob yo'qoldi · s7 kod oynasi · s8 test", 'bir vaqtda ikki xabar (10)'], ['4 Rad va test rejim', 's9 rad · s10 test · s11 test rejim', "to'langani «rad» ga tushmaydi (10)"], ['5 Sxema va amaliyot', "s12–s14 sxema · A1 o'z Backend'i · A2 mashq sahifa", 'tartib (13), kalit (15), Render ⚠']];
const S21 = mkS(21, [{ v: 'cards' }, { v: 'cards', way: true }, { v: 'blok' }, { v: 'repo' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m11-03 (20 ekran)", "Ученик · m11-03 (20 экранов)")} hl><p><b>Maydon Jamoa</b>{t(" — Pro, 30 kun · 10 000 so'm, test rejim · to'lov xabari · imzo · takror · rad · to'lov oqimi sxemasi", " — Pro, 30 дней · 10 000 сум, тестовый режим · сообщение об оплате · подпись · повтор · отказ · схема потока оплаты")}</p>{seg.way && <p style={{ marginTop: 6 }}><b>{t("Amaliyot:", "Практика:")}</b>{t(" A1 — o'z Backend'ida ", " A1 — в своём Backend ")}<code>POST /tolov/webhook</code>{t(" (agent bilan) · A2 — «Mashq to'lov» sahifasi va uch tekshiruv", " (с агентом) · A2 — страница «Mashq to'lov» и три проверки")}</p>}</Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest: imzo · tartib · ", "OrderBotNest: подпись · порядок · ")}<code>rawBody</code>{t(" · takror · rad · summa · AI", " · повтор · отказ · сумма · AI")}</p></Card>
    </div>}
    {seg.v === 'blok' && <table className="pg-dict"><tbody>{BLOK21.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>}
    {seg.v === 'repo' && <div className="pg-three">{[['maydon-jamoa', 'm13-dars-03-done'], [t('Manzil', "Адрес"), 'POST /tolov/webhook'], [t('Imzo · kalit', "Подпись · ключ"), 'X-Imzo · TOLOV_KALITI']].map(([h, tx]) => <Card key={h} c={T.green} h={h}><p><code>{tx}</code></p></Card>)}</div>}
  </>} />;
}

// ============================================================
//  22 · O'quvchi so'zlari va mashq sahifa (manba/wh-out/01, 02, 05, 13 — maydon-jamoa)
// ============================================================
const DICT22 = [["to'lov xabari · POST /tolov/webhook", 'webhook · POST /payments/webhook'], ['imzo · X-Imzo · TOLOV_KALITI', 'X-Signature · PAYMENT_WEBHOOK_SECRET'], ['takror xabar · { takror: true }', '{ duplicate: true }'], ['holat: tolandi / rad', 'status: paid / failed'], ["mashq to'lov sahifasi", 'npm run pay']];
const mjL = (k, keep = () => true) => KOD.OUT[k].split('\n').filter((l) => l.trim() && keep(l)).map((l) => ({ h: liveLine(l) }));
const S22 = mkS(22, [{ v: 'dict' }, { v: 'page' }, { v: 'btn' }, { v: 'order' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT22.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'page' && <Term title={t("maydon-jamoa · «Mashq to'lov» sahifasi (01.11)", "maydon-jamoa · страница «Mashq to'lov» (01.11)")} lines={mjL('mj01')} />}
    {seg.v === 'btn' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("«To'lash» tugmasi", "кнопка «To'lash»")} lines={mjL('mj02')} /><Term title={t("«Imzosiz» tugmasi", "кнопка «Imzosiz»")} lines={mjL('mj05')} er /></div>}
    {seg.v === 'order' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("maydon-jamoa · tolov.controller.ts — imzo tekshiruvi yozuvdan keyin (tajriba nusxasi)", "maydon-jamoa · tolov.controller.ts — проверка подписи после записи (копия для опыта)")} lines={mjL('mj13').slice(0, 12)} er /><div className="n2-warn">Imzosiz → <b>401</b>{t(", lekin ", ", но ")}<code>tolovlar</code>{t(" jadvalida qator — 13-ekrandagi xato, o'quvchi loyihasida ham. Agent kodni yozsa, o'quvchi javob kodiga emas, ", " в таблице строка — ошибка с экрана 13, и в проекте ученика тоже. Когда код пишет агент, ученик смотрит не на код ответа, ")}<b>{t("jadvalga", "а на таблицу")}</b>{t(" qarasin.", " .")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const CARDS23 = [['Hamma xabar 401', 'Imzo mos emas', "kalit bo'sh yoki Render'dagisi boshqa"], ["Haqiqiy «To'lash» ham 401", 'Imzo mos emas', 'rawBody yoqilmagan'], ['401, lekin jadvalda qator', '—', 'imzo yozuvdan keyin'], ['«Ikki marta» — ikki qator', 'takror kelmadi', "to'lov raqami noyob emas"], ['400', 'javob matnida maydon nomi', 'maydon yoki summa xato'], ['.env Git\'da', 'git ls-files da fayl nomi', 'kalitlar darhol almashtiriladi']];
const QA23 = [
  ['«Payme ulasam bo\'ladimi?»', "AI Startup kursida emas: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (o'quvchi darsi s1 eslatmasi)."],
  ['«Nega takrorga ham 200?»', 'Xato kodi qaytsa, xizmat qayta yuboraveradi.'],
  ['«Nega rad yoziladi?»', '«To\'lovim qayerda?» savoliga javob.'],
  ['«Kalitni agentga bersam tezroq bo\'lardi-ku?»', "Kalit kimda bo'lsa, o'sha «to'landi» yasaydi."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'a' }, { v: 'b' }, { v: 'qa' }, { v: 'qa' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {(seg.v === 'a' || seg.v === 'b') && <div className="pg-three">{CARDS23.slice(seg.v === 'a' ? 0 : 3, seg.v === 'a' ? 3 : 6).map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${(seg.v === 'a' ? 1 : 4) + i} · ${h}`}><p>{x}</p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: dalil, imzo, raw body, tartib, takror, rad, bo'sh kalit va AI'ning summasi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi to'lov xabari kelganda avval imzo, keyin summa, keyin yozuv: buni o'quvchiga ham shu tartibda tushuntirasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'q', t: "To'lov xizmati natijani serverga o'zi yuboradi (webhook); mijoz yoki ilovaning «to'ladim»i dalil emas — dalil faqat imzoli xabar", st: ['q'] },
  { k: 'sg', t: "Imzo — HMAC-SHA256(xom tana, kalit); server qayta hisoblaydi, timingSafeEqual; bo'sh kalit — hamma xabar rad; kalit faqat .env va hostingda", st: ['sg'] },
  { k: 'or', t: "Tartib: imzo → maydonlar → buyurtma va summa → yozuv. Yozuv imzodan oldin bo'lsa — 401, lekin bazada «to'landi»", st: ['or'] },
  { k: 'rb', t: "Imzo baytlardan: rawBody: true va req.rawBody; JSON.stringify(body) dan hisoblash — bo'sh joyli haqiqiy to'lovni rad etadi", st: ['sg'] },
  { k: 'dp', t: "Takror — payment_id UNIQUE + ON CONFLICT DO NOTHING (bir vaqtda kelsa ham bitta qator), javob 200; rad ham yoziladi, to'langanini tushirmaydi", st: ['dp'] },
  { k: 'ai', t: "AI webhook'iga to'rt savol: baytlarmi · tartib · takror · summa; haqiqiy bazada sinang — bu safar summada AI-1 bizdan yaxshiroq edi", st: ['ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + to'lov xizmati); har band rasmning o'z qismini yoritadi
const MAP25 = {
  q: { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
  sg: { on: PAY_ON, jest: PAY([['HMAC-SHA256', 'ok'], ['timingSafeEqual', 'ok']], 'pass', '200') },
  or: { on: PAY_ON, note: PAID, jest: PAY(() => [['record → ' + t('imzo', 'подпись'), 'bad']], 'fail', t("401 · bazada paid", '401 · в базе paid')) },
  rb: { on: PAY_ON, jest: PAY([['JSON.stringify(body)', 'bad']], 'fail', '401') },
  dp: { on: PAY_ON, note: PAID, jest: PAY(() => [[t('takror', 'повтор'), 'ok'], ['ON CONFLICT DO NOTHING', 'ok']], 'pass', '200 · duplicate') },
  ai: { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.q;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — to'lov xabari: imzo, tartib, takror", 'Сегодняшний урок — сообщение об оплате: подпись, порядок, повтор')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "Servis — payment.service.ts: summa farq qilsa 400 emas, yozish va payment_status = 'amount_mismatch'", c: [] },
  { t: "Panel — admin.html TOLOV ga amount_mismatch: '⚠️ Summa mos emas'", c: [] },
  { t: "Test — payment.service.spec.ts dagi «summa mos emas» testini yangilang; smoke'ga bitta band", c: ['npm test', 'npm run smoke -- payment'] },
  { t: "Sinov — curl bilan summa 1200: 200 va panelda «⚠️ Summa mos emas»", c: ["BODY='{\"paymentId\":\"pay_kam\",\"orderId\":1,\"status\":\"paid\",\"amount\":1200}'", "SIG=$(printf '%s' \"$BODY\" | openssl dgst -sha256 -hmac \"$PAYMENT_WEBHOOK_SECRET\" | sed 's/^.*= //')", 'curl -s -X POST localhost:3000/payments/webhook -H "Content-Type: application/json" -H "X-Signature: $SIG" -d "$BODY"'] },
  { t: "Topshirish — README «To'lov webhook'i» jadvali → git push → repo linki platformaga", c: ['git add . && git commit -m "to\'lov: summa mos emas holati"', 'git push'] },
];
const CHEATSHEET25 = `# Webhook: to'lov xabari — mentor eslatmasi (OrderBotNest)
## Loyiha
git fetch --tags · git checkout wh-start (= ws2-done) → wh-done (src/api/payment/, payments jadvali, main.ts rawBody, panelda «To'lov», npm run pay) · .env: PAYMENT_WEBHOOK_SECRET=<uzun tasodifiy satr>
## Umumiy tushuncha
to'lov xizmati natijani serverga O'ZI yuboradi: POST /payments/webhook · mijoz/ilovaning «to'ladim»i dalil emas — dalil faqat imzoli xabar · manzil internetda ochiq
## Imzo (signature.ts)
X-Signature = HMAC-SHA256(xom tana, PAYMENT_WEBHOOK_SECRET), hex 64 · server qayta hisoblaydi, timingSafeEqual (uzunlik farq qilsa — yo'q) · kalit bo'sh — hamma xabar rad
## Tartib (payment.controller.ts)
1 imzo → 401 · 2 maydonlar (paymentId, orderId, status paid|failed, amount) → 400 · 3 buyurtma va summa = total → 400 · 4 yozuv · imzo YOZUVDAN OLDIN
## Xom tana
NestFactory.create(AppModule, { rawBody: true }) · req.rawBody · JSON.stringify(body) dan emas — bo'sh joyli haqiqiy to'lov 401 bo'ladi
## Takror va rad (payment.service.ts)
INSERT … ON CONFLICT (payment_id) DO NOTHING RETURNING id — bo'sh bo'lsa { duplicate: true }, javob 200 · bir vaqtda kelsa ham bitta qator · failed ham yoziladi · to'langanini «rad» ga tushirmaydi (payment_status IS DISTINCT FROM 'paid')
## Tekshirish
npm run pay -- <raqam> [ok | rad | ikki | imzosiz | soxta] · npm test (48) · npm run smoke -- payment (5) · psql: SELECT * FROM payments
## To'rt buzilish va belgisi
JSON.stringify — bo'sh joyli to'lov 401 · rawBody yo'q — haqiqiy to'lov ham 401 · tartib — 401, lekin bazada paid (testlar: 3 qizil) · kalit bo'sh — ishga tushishda WARN, hamma 401
## AI webhook'iga to'rt savol
imzo xom baytlardanmi · imzo yozuvdan oldinmi · takror va bir vaqtdagi xabar bitta qatormi · summa buyurtma bilan solishtiriladimi (AI-2: 1 200 so'm → «To'landi»)
## Sinfga tayyorgarlik (m11-03, 20 ekran)
Maydon Jamoa — Pro, 30 kun · 10 000 so'm, test rejim · POST /tolov/webhook · X-Imzo · TOLOV_KALITI · { takror: true } · holat tolandi/rad · «Mashq to'lov» sahifasi: To'lash · Rad etish · Ikki marta · Imzosiz · Payme — kursda emas
## Sinfdagi holatlar
hamma 401 → kalit · haqiqiy ham 401 → rawBody · 401, lekin qator → tartib · ikki qator → raqam noyob emas · 400 → javob matni · .env Git'da → kalit almashtiriladi
## Sizning uyga vazifangiz (40–60 daqiqa)
summa mos emas → yozish va 'amount_mismatch' · panelda «⚠️ Summa mos emas» · test va smoke · README · repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "To'lov xizmati <b>o'zi yuboradi</b>; dalil — faqat imzoli xabar", "Birinchi: to'lov xizmati natijani serverga o'zi yuboradi, bu webhook. Mijozning yoki ilovaning to'ladim degani dalil emas, dalil faqat xizmatning imzoli xabari.", { hl: 'q' }),
  sg('b2', "Imzo — <b>xom tana va kalitdan HMAC</b>; bo'sh kalit — rad", "Ikkinchi: imzo xom tana va maxfiy kalitdan HMAC. Server o'zi qayta hisoblaydi va timing safe equal bilan solishtiradi. Kalit bo'sh bo'lsa, hamma xabar rad etiladi.", { hl: 'q' }),
  sg('b3', "Tartib: <b>imzo, maydonlar, summa, yozuv</b>", "Uchinchi: tartib. Imzo, maydonlar, buyurtma va summa, keyin yozuv. Yozuv imzodan oldin bo'lsa, javob to'rt yuz bir, lekin bazada to'landi qoladi.", { hl: 'or' }),
  sg('b4', "Imzo <b>baytlardan</b>: rawBody true", "To'rtinchi: imzo baytlardan hisoblanadi. Raw body true bo'lmasa yoki imzo JSON stringify'dan hisoblansa, haqiqiy to'lov ham rad etiladi.", { hl: 'rb' }),
  sg('b5', "Takror — <b>bitta qator</b>, javob 200; rad ham yoziladi", "Beshinchi: takror xabar. Payment id noyob, on conflict do nothing: bir vaqtda kelsa ham bitta qator, javob ikki yuz. Rad etilgan to'lov ham yoziladi, to'langani tushmaydi.", { hl: 'dp' }),
  sg('b6', "AI webhook'iga <b>to'rt savol</b> — summa ham", "Oltinchi: AI yozgan webhook'ga to'rt savol: baytlar, tartib, takror va summa. Haqiqiy bazada sinang. Bugun summada birinchi AI bizdan yaxshiroq edi.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: summa mos emas — 400 emas, yozib ajratish", "Uyga vazifa: summasi mos kelmagan to'lovni to'rt yuz o'rniga yozib, alohida belgilang: payment status amount mismatch, panelda summa mos emas. Pul o'tgan bo'lsa, yozuv yo'qolmasin.", { hl: 'hw' }),
  sg('hw2', "Testni yangilang, smoke'ga band; <b>repo linki platformaga</b>", "Servis testini yangi xatti-harakatga moslang, smoke'ga bitta band qo'shing va curl bilan bir ming ikki yuz so'm yuborib, panelni ko'ring. README jadvali, GitHub, link platformaga. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: imzo, tartib, xom tana, takror, buzilishlar, AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: umumiy tushuncha, imzo va tartib, xom tana, takror va rad, to'rt buzilish va belgisi, AI'ga to'rt savol, m11-03 lug'ati va sinfdagi holatlar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('webhook-tolov-xabari-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" imzo hali ham birinchi · mos kelmagan summa yozilgan va ajratilgan (to'landi emas) · test yangilangan · README.", " подпись по-прежнему первая · несовпавшая сумма записана и выделена (не «оплачено») · тест обновлён · README.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Bu kursdagi oxirgi mentor darsi", "Последний урок для менторов в этом курсе")}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("OrderBotNest — boshidan oxirigacha", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Bot, baza, testlar, lenta, jonli panel va to'lov", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · Webhook", "Курс для менторов · Webhook")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["to'lov xabarini qabul qilasiz: imzo xom tanadan, keyin maydonlar, keyin yozuv", "takror va rad xabarlarini to'g'ri yozasiz: bitta to'lov — bitta qator", "to'rt xatoni buzib ko'rasiz va AI yozgan webhook'ni to'rt savol bilan tekshirasiz"], ['примете сообщение об оплате: подпись из сырого тела, потом поля, потом запись', 'правильно запишете повтор и отказ: один платёж — одна строка', 'сломаете четыре ошибки и проверите webhook от AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15 daqiqa, 11-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: WebSocket-2 darsi (jonli panel), Telegraf darsidagi bot tokeni va PostgreSQL, telefon, AI yordamchi; haqiqiy to'lov xizmatiga ulanmaymiz · Loyiha: wh-start tegi", 'Урок со звуком · 1 ч 15 мин, после 11-го экрана можно сделать перерыв · Нужно: урок WebSocket-2 (живая панель), токен бота и PostgreSQL из урока Telegraf, телефон, AI-помощник; к настоящему платёжному сервису не подключаемся · Проект: тег wh-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} {...S1M[0]} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenP8, Screen9, Screen10, ScreenP11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WebhookMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/wh-*.json, ru/wh-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/wh-sahna.js) ---
// Webhook · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
// Panel yorliqlari (To'landi / Rad etildi) — OrderBotNest admin.html ning haqiqiy matni, o'zgarmaydi.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Подпись', 'Повтор и отказ', 'Ломаем', 'AI', 'Подготовка к классу'] },
};
ru(CAUSE12, ['Сервис считает подпись по точным байтам — пробел тоже байт', 'Nest превращает тело в объект и выбрасывает байты', 'JSON.stringify(body) — другие байты: пробелы пропадают, подпись не совпадает', 'Байты сохраняет только rawBody: true — req.rawBody']);
ru(CAUSE13, ['parsePayment и record — до подписи', 'транзакция record закончилась: строка в payments, orders.payment_status = paid', 'потом проверяется подпись — возвращается 401', '401 — только ответ — записанное в базу не отменяет: админ доставит, а денег нет']);
ru(TESTS19, [[null, 'верная подпись'], [null, 'повтор'], [null, 'без подписи'], [null, 'подпись «abc»'], [null, 'JSON с пробелами'], [null, 'два одновременно']]);
ru(FOUR19, ['Подпись по сырым байтам (rawBody)?', 'Подпись до любой записи?', 'Повтор и одновременное сообщение — одна строка?', 'Сравнивается ли сумма с итогом заказа?']);
ru(BLOK21, [['1 Вступление', 's0 · s1 план', 'слова клиента — не доказательство (2)'], ['2 Сообщение и подпись', 's2 сообщение об оплате · s3 тест · s4 подпись · s5 тест', 'поддельное 401, сырое тело (9, 12)'], ['3 Повтор', 's6 ответ потерялся · s7 окно кода · s8 тест', 'два сообщения одновременно (10)'], ['4 Отказ и тестовый режим', 's9 отказ · s10 тест · s11 тестовый режим', 'оплаченный не падает в «отказ» (10)'], ['5 Схема и практика', 's12–s14 схема · A1 свой Backend · A2 тренировочная страница', 'порядок (13), ключ (15), Render ⚠']]);
ru(CARDS23, [['Все сообщения 401', null, 'ключ пустой или на Render другой'], ['И настоящее «To\'lash» 401', null, 'не включён rawBody'], ['401, но в таблице строка', null, 'подпись после записи'], ['«Ikki marta» — две строки', 'повтор не сработал', 'номер платежа не уникален'], ['400', 'в тексте ответа имя поля', 'неверное поле или сумма'], ['.env в Git', 'имя файла в git ls-files', 'ключи меняются сразу']]);
ru(QA23, [
  ['«Можно подключить Payme?»', 'Не в курсе AI Startup: настоящий запуск — с письменного согласия родителей и с юрлицом или ИП (заметка s1 в уроке ученика).'],
  ['«Почему и на повтор 200?»', 'Если вернуть код ошибки, сервис будет присылать снова и снова.'],
  ['«Зачем записывать отказ?»', 'Ответ на вопрос «где мой платёж?».'],
  ['«Если отдать ключ агенту, было бы быстрее?»', 'У кого ключ, тот и сделает «оплачено».'],
]);
ru(SUM25, [
  { t: 'Платёжный сервис сам шлёт результат на сервер (webhook); «я оплатил» от клиента или приложения — не доказательство — доказательство только подписанное сообщение' },
  { t: 'Подпись — HMAC-SHA256(сырое тело, ключ); сервер пересчитывает, timingSafeEqual; пустой ключ — все сообщения отклоняются; ключ только в .env и на хостинге' },
  { t: 'Порядок: подпись → поля → заказ и сумма → запись. Если запись до подписи — 401, но в базе «оплачено»' },
  { t: 'Подпись по байтам: rawBody: true и req.rawBody; считать по JSON.stringify(body) — отклонит настоящую оплату с пробелами' },
  { t: 'Повтор — payment_id UNIQUE + ON CONFLICT DO NOTHING (даже одновременно — одна строка), ответ 200; отказ тоже записывается, оплаченный не опускает' },
  { t: 'Четыре вопроса к webhook от AI: байты ли · порядок · повтор · сумма; проверяйте на настоящей базе — в этот раз по сумме 1-й AI был лучше нас' },
]);
ru(HOMEWORK25, [
  { t: 'Сервис — payment.service.ts: если сумма отличается, не 400, а запись и payment_status = \'amount_mismatch\'' },
  { t: 'Панель — в TOLOV admin.html amount_mismatch: \'⚠️ Summa mos emas\'' },
  { t: 'Тест — обновите тест «summa mos emas» в payment.service.spec.ts; один пункт в smoke' },
  { t: 'Проверка — curl с суммой 1200: 200 и в панели «⚠️ Summa mos emas»' },
  { t: 'Сдача — таблица README «To\'lov webhook\'i» → git push → ссылка на репозиторий на платформу' },
]);
RU_S.TITLE = 'Сообщение об оплате: подпись, повтор и отказ';
RU_S.COVER = ['Всего около 1 часа 15 минут: озвучка ~25 минут · три практики ~45 минут · 4 проверки · самопроверка 8 вопросов. После экрана 11 можно сделать перерыв', 'Нужно: урок для менторов WebSocket-2 (ваша копия OrderBotNest, живая панель) · токен бота и PostgreSQL с урока Telegraf · телефон · AI-помощник. К настоящему платёжному сервису не подключаемся, карту не вводим', 'Проект: github.com/Azizbekcrypto/OrderBotNest — wh-start (= ws2-done) → wh-done; каждый вывод — с настоящих сервера, базы и браузера'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: доказательство, подпись, raw body, порядок, повтор, отказ, пустой ключ и сумма у AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, когда приходит сообщение об оплате, сначала подпись, потом сумма, потом запись: так же объясните и ученику.';
RU_S.NEXT_T = 'OrderBotNest — от начала до конца';
RU_S.NEXT_D = 'Бот, база, тесты, конвейер, живая панель и оплата';
RU_S.FILE = 'webhook-oplata-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['Платёжный сервис <b>шлёт сам</b>; доказательство — только подписанное сообщение', 'Первое: платёжный сервис сам шлёт результат на сервер, это webhook. «Я оплатил» от клиента или приложения — не доказательство, доказательство только подписанное сообщение сервиса.'],
  b2: ['Подпись — <b>HMAC из сырого тела и ключа</b>; пустой ключ — отказ', 'Второе: подпись — HMAC из сырого тела и секретного ключа. Сервер сам пересчитывает и сравнивает через timing safe equal. Если ключ пустой, все сообщения отклоняются.'],
  b3: ['Порядок: <b>подпись, поля, сумма, запись</b>', 'Третье: порядок. Подпись, поля, заказ и сумма, потом запись. Если запись до подписи, ответ четыреста один, а в базе остаётся «оплачено».'],
  b4: ['Подпись <b>по байтам</b>: rawBody true', 'Четвёртое: подпись считается по байтам. Если raw body true не включён или подпись считается по JSON stringify, отклоняется и настоящая оплата.'],
  b5: ['Повтор — <b>одна строка</b>, ответ 200; отказ тоже записывается', 'Пятое: повторное сообщение. Payment id уникален, on conflict do nothing: даже одновременно — одна строка, ответ двести. Отклонённая оплата тоже записывается, оплаченный не опускается.'],
  b6: ['<b>Четыре вопроса</b> к webhook от AI — и сумма', 'Шестое: к webhook, написанному AI, — четыре вопроса: байты, порядок, повтор и сумма. Проверяйте на настоящей базе. Сегодня по сумме первый AI был лучше нас.'],
  hw: ['<b>Домашнее задание</b>: сумма не совпадает — не 400, а запись с пометкой', 'Домашнее задание: оплату с несовпадающей суммой вместо четырёхсот запишите и пометьте отдельно: payment status amount mismatch, в панели «сумма не совпадает». Если деньги прошли, запись не должна теряться.'],
  hw2: ['Обновите тест, пункт в smoke; <b>ссылка на репозиторий — на платформу</b>', 'Подгоните тест сервиса под новое поведение, добавьте один пункт в smoke и отправьте curl с тысячей двести сум, посмотрите на панель. Таблица README, GitHub, ссылка на платформу. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: подпись, порядок, сырое тело, повтор, поломки, вопросы к AI — на одной странице', 'Внизу памятка на одну страницу: общее понятие, подпись и порядок, сырое тело, повтор и отказ, четыре поломки и их признаки, четыре вопроса к AI, словарь m11-03 и случаи в классе. Скопируйте или скачайте.'],
};
RU_S.CHEAT = `# Webhook: сообщение об оплате — памятка ментора (OrderBotNest)
## Проект
git fetch --tags · git checkout wh-start (= ws2-done) → wh-done (src/api/payment/, таблица payments, rawBody в main.ts, «To'lov» в панели, npm run pay) · .env: PAYMENT_WEBHOOK_SECRET=<длинная случайная строка>
## Общее понятие
платёжный сервис САМ шлёт результат на сервер: POST /payments/webhook · «я оплатил» от клиента/приложения — не доказательство — доказательство только подписанное сообщение · адрес открыт в интернете
## Подпись (signature.ts)
X-Signature = HMAC-SHA256(сырое тело, PAYMENT_WEBHOOK_SECRET), hex 64 · сервер пересчитывает, timingSafeEqual (длина разная — нет) · ключ пустой — все сообщения отклоняются
## Порядок (payment.controller.ts)
1 подпись → 401 · 2 поля (paymentId, orderId, status paid|failed, amount) → 400 · 3 заказ и сумма = total → 400 · 4 запись · подпись ДО ЗАПИСИ
## Сырое тело
NestFactory.create(AppModule, { rawBody: true }) · req.rawBody · не из JSON.stringify(body) — настоящая оплата с пробелами получит 401
## Повтор и отказ (payment.service.ts)
INSERT … ON CONFLICT (payment_id) DO NOTHING RETURNING id — пусто → { duplicate: true }, ответ 200 · даже одновременно — одна строка · failed тоже записывается · оплаченный не опускается в «отказ» (payment_status IS DISTINCT FROM 'paid')
## Проверка
npm run pay -- <номер> [ok | rad | ikki | imzosiz | soxta] · npm test (48) · npm run smoke -- payment (5) · psql: SELECT * FROM payments
## Четыре поломки и их признак
JSON.stringify — оплата с пробелами 401 · нет rawBody — и настоящая оплата 401 · порядок — 401, но в базе paid (тесты: 3 красных) · ключ пустой — WARN при запуске, все 401
## Четыре вопроса к webhook от AI
подпись по сырым байтам · подпись до записи · повтор и одновременное сообщение — одна строка · сравнивается ли сумма с заказом (2-й AI: 1 200 сум → «To'landi»)
## Подготовка к классу (m11-03, 20 экранов)
Maydon Jamoa — Pro, 30 дней · 10 000 сум, тестовый режим · POST /tolov/webhook · X-Imzo · TOLOV_KALITI · { takror: true } · статус tolandi/rad · страница «Mashq to'lov»: To'lash · Rad etish · Ikki marta · Imzosiz · Payme — не в курсе
## Случаи в классе
все 401 → ключ · и настоящая 401 → rawBody · 401, но строка есть → порядок · две строки → номер не уникален · 400 → текст ответа · .env в Git → ключ меняется
## Ваше домашнее задание (40–60 минут)
сумма не совпадает → запись и 'amount_mismatch' · в панели «⚠️ Summa mos emas» · тест и smoke · README · ссылка на репозиторий на платформу`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxatlari
ru(FLOW2, [[null, 'Клиент', 'отдаёт карту сервису'], [null, 'Платёжный сервис', 'например Payme, Click'], [null, null, 'тело + X-Signature'], [null, 'Сервер', 'подпись → запись'], [null, 'Панель']]);
ru(DICT22, [['сообщение об оплате · POST /tolov/webhook'], ['подпись · X-Imzo · TOLOV_KALITI'], ['повторное сообщение · { takror: true }'], ['статус: tolandi / rad'], ['тестовая страница оплаты']]);

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · Webhook",
  "title": "Клиент оплатил. От кого сервер об этом узнаёт? Сегодня принимаем сообщение об оплате: подпись, повтор и отказ",
  "seg": {
   "a": [
    "Клиент оплатил — <b>в панели сама появилась «To'landi»</b>; сообщение прислал платёжный сервис",
    "Здравствуйте. В OrderBotNest есть заказ, теперь добавим к нему онлайн-оплату. На экране результат в конце урока: первый заказ оплачен, второй отклонён, панель сама это показала. Это сообщение прислал не клиент и не бот, а платёжный сервис."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: кто кому шлёт и почему слова клиента не доказательство",
    "Сначала общее понятие: от кого к кому идёт сообщение об оплате и почему «я оплатил» от клиента — не доказательство. Потом подпись: адрес открыт, как же отличить поддельное сообщение."
   ],
   "c": [
    "Потом <b>повтор, отказ и четыре поломки</b>; в конце AI и класс",
    "На третьем этапе — что будет, если одно сообщение придёт дважды и если оплата отклонена. На четвёртом нарочно сделаем четыре ошибки. На пятом проверим на настоящей базе webhook, написанный двумя AI. В конце подготовка к классу."
   ],
   "d": [
    "Шесть этапов, три практики; нужны <b>OrderBotNest с WebSocket-2 и Postgres</b>",
    "Урок — шесть этапов, три практики. Нужны ваша копия OrderBotNest с прошлого урока и Postgres. К настоящему платёжному сервису не подключаемся, карту не вводим: вместо сервиса работает маленький скрипт из проекта. Не спешите, каждый экран можно прослушать с начала. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "Платёжный сервис сам шлёт результат на сервер — это webhook. «Я оплатил» от клиента или приложения — не доказательство: доказательство только подписанное сообщение сервиса",
  "seg": {
   "a": [
    "Клиент отдаёт карту сервису; <b>сервис сам шлёт результат на сервер</b>",
    "Клиент отдаёт карту не нам, а платёжному сервису: Payme, Click и подобным. Прошли ли деньги, знает сервис. Потом сервис сам отправляет запрос на адрес нашего сервера: этот заказ оплачен. Такой запрос называется webhook."
   ],
   "b": [
    "<b>«Я оплатил» от клиента — не доказательство</b>: скриншот может сделать кто угодно",
    "Почему не поставить в боте кнопку «я оплатил»? Потому что слова клиента или скриншот — не доказательство, их может сделать кто угодно. Само приложение тоже не доказательство. Доказательство — только сообщение сервиса, и оно должно быть подписано."
   ],
   "c": [
    "В WebSocket сервер сам слал панели; <b>в webhook сервис сам шлёт серверу</b>",
    "Вспомните прошлые уроки: в WebSocket сервер сам сообщал панели. Webhook такой же, только направление другое: внешний сервис сам шлёт нашему серверу. Сервер не спрашивает, он ждёт. Поэтому адрес открыт в интернете."
   ],
   "d": [
    "Итог: сообщение — <b>JSON-тело и заголовок подписи</b>; четыре поля",
    "Итог: сообщение — обычный POST-запрос. В теле четыре поля: номер платежа, номер заказа, статус и сумма. В заголовке подпись. Подпись нужна, потому что адрес открыт, разберём её на следующем этапе. Сначала посмотрим, что будет на начальном теге."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · общее понятие",
  "title": "На wh-start сервис прислал сообщение — Cannot POST /payments/webhook, 404. Заказ в базе остался «NEW»: сервер не знает, что была оплата",
  "seg": {
   "a": [
    "На <code>wh-start</code> сервис прислал — <b><code>Cannot POST /payments/webhook</code>, 404</b>",
    "Опыт на начальном теге: Бобур сделал заказ, платёжный сервис прислал сообщение, как настоящее. Ответ сервера — четыреста четыре: Cannot POST payments webhook. Такого адреса нет."
   ],
   "b": [
    "В базе заказ <b>остался «NEW»</b> — сервер не знает, что была оплата",
    "Посмотрите в базу: заказ остался в статусе «новый». Деньги прошли, но сервер не знает, панель тоже не знает. Настоящий сервис после такого ответа пытается снова несколько раз, потом сдаётся."
   ],
   "c": [
    "Добавим адрес — он <b>открыт в интернете</b>: POST может прислать кто угодно",
    "Адрес добавим, но поймите одну вещь: он открыт в интернете. Запрос на него может прислать и сервис, и любой человек. Написать на открытый адрес «оплачено» становится очень легко."
   ],
   "d": [
    "Итог: нужны <b>адрес, подпись и одноразовая запись</b>",
    "Итог: нам нужны три вещи. Адрес, то есть POST payments webhook. Подпись: действительно ли сообщение от сервиса. И одноразовая запись: если один платёж придёт дважды, запишется один раз. Начинаем с подписи."
   ]
  }
 },
 "4": {
  "kicker": "Этап 2 · подпись",
  "title": "signature.ts: сервис и сервер знают один секретный ключ; подпись = HMAC-SHA256(сырое тело, ключ). Сервер пересчитывает и сравнивает через timingSafeEqual",
  "seg": {
   "a": [
    "Ключ <b>только у двух сторон</b>: у платёжного сервиса и в нашем <code>.env</code>",
    "Как работает подпись? Мы с платёжным сервисом знаем один секретный ключ: он в кабинете сервиса и в нашем env-файле. Больше его никто не знает. Для каждого сообщения сервис считает этим ключом подпись и пишет её в заголовок."
   ],
   "b": [
    "<code>sign()</code>: <b>HMAC-SHA256 — из сырого тела и ключа</b>, hex из 64 символов",
    "Откройте файл signature ts в папке src, api, payment. Функция sign: create hmac sha256, с ключом, само тело, hex. Результат — строка из шестидесяти четырёх символов. Если в теле изменится одна буква, подпись выйдет совсем другой."
   ],
   "c": [
    "Проверка: <b>ключ пустой, нет тела или заголовка — сразу отказ</b>",
    "Функция is valid signature сначала отклоняет три случая: ключ пустой, нет тела или нет заголовка. Пустой ключ особенно опасен: с пустым ключом подпись может посчитать кто угодно. Поэтому при пустом ключе не принимается ни одно сообщение."
   ],
   "d": [
    "Итог: сравнение — <b><code>timingSafeEqual</code></b> — по времени ответа подпись не угадать",
    "Итог: сервер сам пересчитывает подпись и сравнивает с пришедшей. Не обычным знаком равенства, а timing safe equal: он всегда сравнивает за одно и то же время, по скорости ответа подпись не подобрать по кусочкам. Если длина разная — сразу нет."
   ]
  }
 },
 "5": {
  "kicker": "Этап 2 · подпись",
  "title": "payment.controller.ts: сначала подпись (401), потом поля (400), потом запись. Подпись из req.rawBody — поэтому в main.ts rawBody: true",
  "seg": {
   "a": [
    "<code>webhook()</code>: <b>первая строка — подпись</b>; неверная — 401 и больше ничего",
    "В файле payment controller ts функция webhook. Первое дело — подпись: req raw body, подпись из заголовка и ключ из env. Не совпало — предупреждение в лог и четыреста один. Функция заканчивается здесь, до базы ничего не доходит."
   ],
   "b": [
    "Потом <b>поля (400)</b>, потом <b>запись</b>: <code>parsePayment</code>, <code>record</code>",
    "Если подпись верна, поля: parse payment проверяет номер платежа, номер заказа, статус и сумму, при ошибке — четыреста. Только после этого record, то есть запись. Ответ: ok и duplicate, повтор или нет."
   ],
   "c": [
    "<code>main.ts</code>: <b><code>rawBody: true</code></b> — подпись считается по байтам",
    "Важная строка в файле main ts: Nest factory create, raw body true. Обычно Nest превращает тело в JSON-объект и выбрасывает сырые байты. А подпись посчитана именно по этим байтам. С raw body true они сохраняются в req raw body."
   ],
   "d": [
    "Итог: порядок — <b>подпись, поля, запись</b>; что будет при нарушении, увидим на 4-м этапе",
    "Итог: три шага, в этом порядке. Подпись, поля, запись. Подпись — до записи, иначе и поддельное сообщение дойдёт до базы. В логе сервера виден новый путь и raw body. На четвёртом этапе нарушим этот порядок."
   ]
  }
 },
 "6": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "Кто-то прислал на открытый адрес сообщение без X-Signature: «#1 оплачен, 120 000». Что сделает этот controller?",
  "q": "Вы видели controller, теперь проверим. Первая проверка. Кто-то прислал на открытый адрес сообщение без подписи: первый заказ оплачен, сто двадцать тысяч. Что сделает этот controller? Выберите вариант.",
  "ok": "Верно. Подпись — первый шаг: заголовка нет, значит is valid signature говорит «нет», и controller бросает четыреста один. Ни parse payment, ни record не вызываются, до базы ничего не доходит. Значит, даже если поля сообщения без подписи верные, на его содержимое не смотрят.",
  "okShort": "Подпись — первая: нет — 401, <code>record</code> не вызывается.",
  "hint": "Что делает первый if в webhook() и что вызывается после него?",
  "demak": "подпись до записи: на содержимое сообщения без подписи не смотрят — 401, строки нет.",
  "opts": [
   "Запишет, но отметит статус как «не проверено»",
   "Проверит поля, если верны — запишет",
   "Вернёт 401 и ничего не запишет",
   "Будет ждать, что сервис переотправит с подписью"
  ],
  "wrong": {
   "0": "Сообщение без подписи вообще не записывается — статуса «не проверено» тоже нет.",
   "1": "До полей доходят после подписи; подписи нет — дальше не идут.",
   "3": "Сервер ничего не ждёт: ответ 401, сообщение выброшено."
  }
 },
 "7": {
  "kicker": "Этап 2 · подпись",
  "title": "Поддельный платёжный сервис (npm run pay) подписывает сообщение как настоящий: 200, строка в payments, payment_status = paid — в панели сама появилась «To'landi»",
  "seg": {
   "a": [
    "<code>npm run pay</code>: <b>делает то, что делает сервис</b> — подписывает тело ключом и отправляет",
    "К настоящему платёжному сервису не подключаемся, вместо него в проекте есть маленький скрипт: scripts, pay js. Он делает то, что делает сервис: берёт сумму заказа, подписывает тело ключом из env и отправляет на адрес webhook."
   ],
   "b": [
    "Ответ <b>200, <code>duplicate: false</code></b>; в логе сервера строка платежа",
    "Запускаем: npm run pay, первый заказ. Видно отправленное тело и начало подписи. Ответ двести, ok true, duplicate false. В логе сервера: номер платежа, заказ один, paid, сто двадцать тысяч."
   ],
   "c": [
    "В базе: <b>строка в <code>payments</code>, <code>payment_status = paid</code></b>",
    "Посмотрите в базу: в таблице payments одна строка, с номером платежа сервиса. В таблице orders payment status — paid. Оба записаны в одной транзакции: либо оба, либо ничего."
   ],
   "d": [
    "Итог: панель сама обновилась через <b><code>order-changed</code> 'payment'</b>",
    "Итог: в панели колонка оплаты сменилась с прочерка на «оплачено», страница не обновлялась. Когда транзакция закончилась, сервер отправил order changed, причина payment. Правило с урока по WebSocket сработало и здесь. Теперь сделаете это сами."
   ]
  }
 },
 "8": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "На теге wh-done запишите ключ в .env, запустите сервер, сделайте заказ с телефона и оплатите через npm run pay — в панели «To'landi»",
  "seg": {
   "a": [
    "Теперь вы: <b>тег <code>wh-done</code>, ключ, сервер и <code>npm run pay</code></b>",
    "Теперь ваша очередь. В своей папке OrderBotNest переходите на тег wh done, пишете в env-файл платёжный ключ, запускаете сервер и делаете заказ с телефона. Потом оплачиваете через npm run pay. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>тег, в <code>.env</code> <code>PAYMENT_WEBHOOK_SECRET</code></b>, сервер — в логе <code>/payments/webhook</code>",
    "На первом шаге git fetch и checkout. На втором в env строка payment webhook secret: длинная случайная строка, её никому не даёте. При запуске сервера миграция пройдёт сама, в логе должен выйти путь payments webhook."
   ],
   "c": [
    "Шаги 3–4: <b>заказ с телефона, <code>npm run pay -- &lt;номер&gt;</code></b>; подтверждение — строка ответа",
    "На третьем шаге панель в браузере и заказ боту с телефона. На четвёртом во втором терминале npm run pay с номером заказа. В панели появится «оплачено». В поле подтверждения скопируйте строку ответа двести."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики у вашего бота есть адрес, который принимает сообщения об оплате."
   ]
  },
  "steps": [
   {
    "t": "Тег",
    "exp": "added … packages или up to date"
   },
   {
    "t": "Ключ и сервер",
    "exp": "Mapped {/payments/webhook, POST} route",
    "cmds": [
     "в .env: PAYMENT_WEBHOOK_SECRET=<длинная случайная строка>",
     null
    ]
   },
   {
    "t": "Заказ",
    "exp": "в панели новая строка, «To'lov» — «—»",
    "cmds": [
     null,
     "телефон: заказ боту"
    ]
   },
   {
    "t": "Оплата",
    "exp": "← 200 {\"ok\":true,\"duplicate\":false} · в панели «To'landi»",
    "cmds": [
     "второй терминал: npm run pay -- <номер заказа>"
    ]
   }
  ],
  "proof": {
   "label": "Строка ответа npm run pay",
   "placeholder": "например: ← 200 {\"ok\":true,\"duplicate\":false}",
   "wrong": "Скопируйте дословно строку ← 200 … после npm run pay -- <номер>."
  },
  "trouble": [
   [
    "← 401 … imzo noto'g'ri",
    "сервер не прочитал .env (после добавления ключа перезапустите) или ключ в скрипте и на сервере разный"
   ],
   [
    "GET /admin/orders → 401",
    "в .env нет ADMIN_PANEL_TOKEN — скрипт берёт сумму через путь панели"
   ],
   [
    "#… oxirgi 20 buyurtma ichida yo'q",
    "неверный номер заказа — посмотрите колонку # в панели"
   ],
   [
    "relation \"payments\" does not exist",
    "сервер со старым dist до wh-done — перезапустите npm run start:dev"
   ]
  ]
 },
 "9": {
  "kicker": "Этап 3 · повтор и отказ",
  "title": "И сообщение без подписи, и подписанное другим ключом — 401, новой строки в payments нет; в логе сервера два предупреждения",
  "seg": {
   "a": [
    "Без подписи: <b>нет <code>X-Signature</code> — 401</b>; даже если тело верное",
    "Теперь чужие сообщения на открытый адрес. Первое — без подписи: тело как настоящее, первый заказ оплачен, сумма верная. Ответ — четыреста один, подпись неверна. Даже если содержимое правильное, сообщению без подписи не доверяют."
   ],
   "b": [
    "Другой ключ: <b>подпись есть, но ключ другой — 401</b>",
    "Второе хитрее: подпись есть, шестьдесят четыре символа, только посчитана другим ключом. Так сделает тот, кто ключа не знает. Сервер считает своим ключом, результат не совпадает, снова четыреста один."
   ],
   "c": [
    "В логе сервера <b>два предупреждения</b>; новой строки в <code>payments</code> нет",
    "В логе сервера два предупреждения: подпись неверна, сообщение отклонено. В базе число строк payments не изменилось. Даже если это атака, она видна в логе, а данные не портятся."
   ],
   "d": [
    "Итог: подпись <b>делает только владелец ключа</b>; секретность ключа — вся защита",
    "Итог: правильную подпись делает только тот, кто знает ключ. Значит, вся защита — в секретности ключа. Ключ — в env-файле и в настройках хостинга, не в коде, не в git, не в чате. Теперь посмотрим, что будет, если сам сервис отправит дважды."
   ]
  }
 },
 "10": {
  "kicker": "Этап 3 · повтор и отказ",
  "title": "Если сервис не получил ответ, он отправляет сообщение снова: второе — 200 { duplicate: true }, строка одна — даже если пришли одновременно. Отклонённая оплата тоже записывается",
  "seg": {
   "a": [
    "Если ответ потерялся, <b>сервис отправит снова</b>: второе — <code>duplicate: true</code>",
    "Если настоящий сервис не получил наш ответ, например оборвалась сеть, он отправит то же сообщение снова. Npm run pay, режим ikki: первое — duplicate false, второе — duplicate true. В логе сервера: повтор, не записано. Ответ всё равно двести, иначе сервис будет пытаться снова."
   ],
   "b": [
    "<code>ON CONFLICT (payment_id) DO NOTHING</code> — <b>и два одновременных сообщения — одна строка</b>",
    "В файле payment service: insert, on conflict payment id do nothing, returning. Payment id уникален, при повторе ничего не возвращается, и мы говорим duplicate. Проверили и два сообщения одновременно: одно записалось, второе — повтор, в базе одна строка. Если бы сначала искали, а потом писали, здесь могли бы пройти оба запроса."
   ],
   "c": [
    "Отказ: <b><code>status: 'failed'</code> тоже записывается</b> — ответ на вопрос «где мой платёж?»",
    "Второй заказ, карта отклонена: сообщение всё равно приходит и записывается, статус failed. Зачем записывать? Если клиент спросит «где мой платёж», админ увидит: попытка была, отклонена. Если ничего не записать, ответа на этот вопрос нет."
   ],
   "d": [
    "Итог: в панели <b>«To'landi» и «Rad etildi»</b>; оплаченный не падает в «отказ»",
    "Итог: в панели оба статуса, страница не обновлялась. Ещё одно правило в сервисе: если заказ уже оплачен, следующее сообщение об отказе не переводит его в отказ. Smoke проверяет и это. Теперь три этих случая проверите сами."
   ]
  }
 },
 "11": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Четыре режима npm run pay: дважды, без подписи, поддельный, отказ — посмотрите ответ и результат в базе для каждого",
  "seg": {
   "a": [
    "Теперь вы: <b>четыре режима</b> — сервис шлёт дважды, шлёт чужой, карта отклонена",
    "Теперь ваша очередь. Проверяете четыре режима npm run pay: ikki, imzosiz, поддельный ключ и rad. Для каждого смотрите ответ и базу. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b><code>ikki</code>, потом <code>imzosiz</code> и <code>soxta</code></b> — <code>duplicate: true</code> и 401",
    "На первом шаге режим ikki: во втором ответе duplicate true. На втором imzosiz и soxta: оба четыреста один, в терминале сервера предупреждение. Откройте в базе таблицу payments и убедитесь, что число строк не изменилось."
   ],
   "c": [
    "Шаги 3–4: <b>новый заказ и <code>rad</code></b>; в панели «Rad etildi»; подтверждение — ответ повтора",
    "На третьем шаге новый заказ и режим rad: в панели «отклонено». На четвёртом — платежи и статусы в таблице payments. В поле подтверждения скопируйте строку duplicate true из режима ikki."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы сами проверили повторные, чужие и отклонённые сообщения."
   ]
  },
  "steps": [
   {
    "t": "Повтор",
    "exp": "2-й ответ ← 200 {\"ok\":true,\"duplicate\":true}",
    "cmds": [
     "npm run pay -- <номер> ikki"
    ]
   },
   {
    "t": "Чужой",
    "exp": "оба ← 401, на сервере imzo noto'g'ri",
    "cmds": [
     "npm run pay -- <номер> imzosiz",
     "npm run pay -- <номер> soxta"
    ]
   },
   {
    "t": "Отказ",
    "exp": "← 200, в панели «Rad etildi»",
    "cmds": [
     "новый заказ с телефона",
     "npm run pay -- <новый номер> rad"
    ]
   },
   {
    "t": "База",
    "exp": "повтор — одна строка, imzosiz/soxta нет, rad есть"
   }
  ],
  "proof": {
   "label": "Второй ответ режима ikki",
   "placeholder": "например: ← 200 {\"ok\":true,\"duplicate\":true}",
   "wrong": "Вставьте вторую строку ← 200 … из npm run pay -- <номер> ikki — в ней \"duplicate\":true."
  },
  "trouble": [
   [
    "Оба ответа duplicate: false",
    "на payments.payment_id нет UNIQUE — миграция не прошла; перезапустите сервер, \\d payments"
   ],
   [
    "и imzosiz 200",
    "сервер на старом коде или порядок нарушен — git status, git checkout wh-done"
   ],
   [
    "rad → 400 summa mos emas",
    "другой номер заказа (сумма другого заказа)"
   ],
   [
    "В панели нет колонки «To'lov»",
    "старая страница — F5"
   ]
  ]
 },
 "12": {
  "kicker": "Этап 4 · ломаем",
  "title": "Подпись по байтам: если сервис шлёт JSON с пробелами, код, считающий по сырому телу, принимает, а считающий по JSON.stringify(body) — отклоняет. Выключен rawBody — и настоящая оплата 401",
  "seg": {
   "a": [
    "Простая ошибка: считать подпись <b>по <code>JSON.stringify(body)</code></b> — «это же те же данные»",
    "Подпись теперь считается не из сырого тела, а из JSON stringify body. Это очень распространённая ошибка. Вы думаете: данные-то те же. Наш скрипт шлёт без пробелов, поэтому с ним этот код работает."
   ],
   "b": [
    "Сервис прислал <b>с пробелами</b>: правильный код 200, ошибочный 401",
    "А если сервис шлёт JSON с пробелами? Подпись посчитана именно по этим байтам. Правильный код принял, двести. А код со stringify переписал объект, пробелы пропали, подпись не совпала, четыреста один. Настоящая оплата отклонена."
   ],
   "c": [
    "В <code>main.ts</code> <b>нет <code>rawBody</code></b>: <code>req.rawBody</code> пуст — и настоящая оплата 401",
    "Вторая ошибка: из main ts убрали raw body true. В логе сервера create без второго аргумента. Npm run pay шлёт с верным ключом, а ответ всё равно четыреста один, в базе ноль строк. Req raw body вообще нет, сравнивать подпись не с чем."
   ],
   "d": [
    "Значит, причина: подпись <b>по байтам</b>; сырое тело сохраняет только <code>rawBody: true</code>",
    "Значит, причина одна: подпись считается не по смыслу текста, а по точным байтам. Nest читает тело, превращает в объект и выбрасывает байты. Сохраняет их только raw body true. У обеих ошибок одинаковый признак: настоящая оплата с верной подписью получает четыреста один."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>req.rawBody</code>",
    "Теперь намеренно сделаем четыре ошибки, первую делаете вы. В payment controller ts подпись считается из req raw body, raw body подсвечен, нажмите на него: подпись будет считаться из JSON stringify body.",
    "Нажмите на <b><code>req.rawBody</code></b> в <b>payment.controller.ts</b> — подпись будет считаться из <code>JSON.stringify(body)</code>."
   ]
  }
 },
 "13": {
  "kicker": "Этап 4 · ломаем",
  "title": "Если поставить запись до подписи: сообщение без подписи получает 401 — но в payments есть строка, и в панели «To'landi». Ответ правильный, а в базе ложь",
  "seg": {
   "a": [
    "Третья ошибка: <b><code>record</code> до проверки подписи</b> — «сначала запишу, потом проверю»",
    "Порядок поменялся: сначала parse и record, потом подпись. Код работает, без тестов не заметно. Отправляем сообщение без подписи."
   ],
   "b": [
    "Ответ <b>401</b>: снаружи всё правильно",
    "Ответ четыреста один, подпись неверна. Отправитель думает, что его отклонили, в логе сервера тоже предупреждение. Снаружи защита работает."
   ],
   "c": [
    "В базе <b><code>paid</code></b>, в панели <b>«To'landi»</b> — сообщение без подписи сделало своё дело",
    "Но посмотрите в базу: в payments строка, заказ paid. В панели тоже «оплачено», страница обновилась сама. Транзакция записи закончилась до четыреста один. Админ доставит заказ, а денег нет."
   ],
   "d": [
    "Значит, причина: <b>401 не отменяет записанное</b>; подпись — самый первый шаг",
    "Значит, причина: четыреста один — только ответ, он не отменяет то, что уже записано в базу. Поэтому подпись — самый первый шаг, до любой записи. Такую ошибку трудно найти глазами, её ловит тест, увидите в третьей практике."
   ],
   "x": [
    "Третья ошибка самая опасная — <b>её тоже делаете вы</b>: нажмите на строку <code>record</code>",
    "Третья ошибка самая опасная, её тоже делаете вы. В controller подсвечена строка записи, нажмите на неё: она переедет до проверки подписи.",
    "Нажмите на <b><code>this.payments.record</code></b> в <b>payment.controller.ts</b> — запись переедет до проверки подписи."
   ]
  }
 },
 "14": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4 — какая строка с ошибкой?",
  "title": "Этот controller возвращает 401 на сообщение без подписи, но заказ остаётся «оплачен». Найдите строку не на своём месте",
  "q": "Вы видели нарушение порядка, теперь найдите сами. Вторая проверка. Этот controller возвращает четыреста один на сообщение без подписи, но заказ остаётся оплаченным. Одна строка во фрагменте пишет в базу до подписи. Нажмите на эту строку.",
  "ok": "Верно. Вызов record стоит до проверки подписи: транзакция заканчивается, заказ становится paid, потом проверяется подпись, и возвращается четыреста один. Parse payment тоже раньше, но он в базу не пишет. Значит, проверяйте не по коду ответа, а по базе: поставьте запись после подписи.",
  "okShort": "<code>record(p)</code> до подписи — запись происходит, потом 401. 401 не отменяет записанное.",
  "hint": "Какая строка пишет в базу и стоит она до isValidSignature или после?",
  "task": "Правило: вызов, пишущий в базу, стоит <b>после проверки подписи</b>. В этом фрагменте одна строка <b>пишет в базу до подписи</b>. <b>Нажмите на эту строку.</b>"
 },
 "15": {
  "kicker": "Этап 4 · внутри",
  "title": "Четвёртая ошибка — ключ в .env пустой: при запуске сервер предупреждает, и каждое сообщение — 401. Даже при верной подписи неверная сумма или поле — 400, и строки нет",
  "seg": {
   "a": [
    "Ключ пустой: сервер <b>предупреждает при запуске</b>",
    "Четвёртая ошибка: в env-файле payment webhook secret остался пустым, например забыли добавить на хостинге. При запуске сервера в логе предупреждение: ключ пустой, каждое сообщение об оплате будет отклонено с четыреста один. Ищите эту строку в логе запуска."
   ],
   "b": [
    "Каждое сообщение <b>401</b>, строки нет — с пустым ключом подпись сделал бы кто угодно",
    "Npm run pay тоже подписывает пустым ключом, а сервер всё равно даёт четыреста один. Это нарочно: подпись, посчитанную пустым ключом, может посчитать кто угодно. Принять пустой ключ — то же самое, что оставить адрес без защиты."
   ],
   "c": [
    "Подпись верная, но <b>сумма не совпадает или статус неизвестен — 400</b>",
    "Даже при верной подписи записывается не всё. Сумма тысяча двести, а заказ — сто двадцать тысяч: четыреста, сумма не совпадает. Если статус пришёл как ok: четыреста, paid или failed. В обоих случаях в базе ноль строк."
   ],
   "d": [
    "Итог: ключ — <b>в <code>.env</code> и на хостинге</b>; в коде, git, чате — нет",
    "Итог и правила ключа. Ключ только в env-файле и в настройках хостинга. В git не попадает, в код не пишется, AI и в чат не отдаётся. Если утёк — сразу меняется в кабинете сервиса. Теперь проверим."
   ]
  }
 },
 "16": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4",
  "title": "На хостинге не добавили PAYMENT_WEBHOOK_SECRET. Почему в этом случае сервер даже не проверяет подпись, а отклоняет каждое сообщение?",
  "q": "Вы видели ключ, теперь проверим. Третья проверка. На хостинге не добавили ключ. В этом случае сервер вообще не проверяет подпись и отклоняет каждое сообщение. Почему? Выберите вариант.",
  "ok": "Верно. HMAC считается и с пустым ключом, ошибки не будет. Но пустой ключ известен всем: любой сделает подпись, которая выглядит правильной, и напишет «оплачено». Поэтому пустой ключ — сразу отказ и предупреждение при запуске. Значит, отсутствие ключа — тоже ошибка, его нельзя принимать.",
  "okShort": "Пустой ключ — ключ, известный всем: подпись сделает любой. Поэтому сразу 401.",
  "hint": "Кто знает пустой ключ?",
  "demak": "пустой ключ — значит, защиты нет: сервер его не принимает и говорит об этом при запуске.",
  "opts": [
   "С пустым ключом HMAC не посчитать, код бросит ошибку",
   "С пустым ключом верную подпись может посчитать кто угодно",
   "Без ключа платёжный сервис не пришлёт сообщение",
   "При пустом ключе сервер останавливается, ошибку трудно увидеть"
  ],
  "wrong": {
   "0": "Считается — createHmac работает и с пустым ключом; проблема в безопасности.",
   "2": "Сервис шлёт со своим ключом из кабинета; о нашем пустом ключе он не знает.",
   "3": "Сервер не останавливается — работает и предупреждает в логе."
  }
 },
 "17": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Перенесите в controller record раньше подписи, запустите npm test — три теста должны покраснеть; потом верните код",
  "seg": {
   "a": [
    "Теперь вы: <b>нарочно ломаете</b> порядок и видите, что тесты ловят",
    "Теперь ваша очередь. В payment controller нарочно ломаете порядок: переносите parse и record раньше проверки подписи. Потом запускаете тесты и смотрите, какие покраснели. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>перенесите две строки вверх</b>; <code>npm test -- payment.controller</code>",
    "На первом шаге переносите строки const p и const r выше if и сохраняете. На втором — npm test, payment controller. Три теста красные: без подписи, другой ключ и изменённое тело. Они проверяют, что сервис не вызывается."
   ],
   "c": [
    "Шаги 3–4: прочитайте <b>имена красных тестов</b>; верните через <code>git checkout</code>; подтверждение — строка результата",
    "На третьем шаге прочитайте имена красных тестов: все они о том, что до записи не доходит. На четвёртом верните файл через git checkout и снова запустите тесты, всё зелёное. В поле подтверждения скопируйте строку Tests из красного результата."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы знаете: ошибку, которую не видно глазами, ловит правильно написанный тест."
   ]
  },
  "steps": [
   {
    "t": "Поломка",
    "exp": "сохранено",
    "cmds": [
     "src/api/payment/payment.controller.ts: const p = parsePayment(body); и const r = await this.payments.record(p); → выше if ("
    ]
   },
   {
    "t": "Тесты",
    "exp": "FAIL · ✕ imzosiz — 401, yozuvga yetmaydi"
   },
   {
    "t": "Чтение",
    "exp": "3 теста: без подписи · другой ключ · изменённое тело",
    "cmds": [
     "названия красных тестов"
    ]
   },
   {
    "t": "Возврат",
    "exp": "Tests: 48 passed"
   }
  ],
  "proof": {
   "label": "Строка Tests: из красного результата",
   "placeholder": "например: Tests: 3 failed, 3 passed, 6 total",
   "wrong": "Вставьте строку Tests: … из npm test -- payment.controller со сломанным кодом — в ней 3 failed."
  },
  "trouble": [
   [
    "Всё зелёное",
    "файл не сохранён или строки попали внутрь if — git diff"
   ],
   [
    "Cannot find name 'p'",
    "const p остался после record — сначала parsePayment, потом record"
   ],
   [
    "Красных больше 6",
    "сломан блок if (скобка) — верните через git checkout и попробуйте снова"
   ],
   [
    "npm test вообще не работает",
    "не сделан npm install (на wh-done нового пакета нет, но node_modules нужен)"
   ]
  ]
 },
 "18": {
  "kicker": "Этап 5 · AI",
  "title": "Двум AI — короткое требование, как в документации сервиса: «POST, JSON, HMAC-SHA256, X-Signature, ключ в .env». Оба сами сделали сырое тело, timingSafeEqual и повтор",
  "seg": {
   "a": [
    "Снова этап AI: <b>webhook пишет AI, вы принимаете</b> — по короткому требованию",
    "Пятый этап, AI. Двум AI дали короткое требование, как в документации платёжного сервиса: POST, JSON, HMAC SHA256, заголовок X Signature, ключ в env. О сыром теле, повторе, порядке, сумме — ни слова. Сильная модель и модель слабее."
   ],
   "b": [
    "Промпт — <b>четыре поля и подпись</b>; остальное AI должен додумать сам",
    "Промпт на экране дословно. Номер платежа, номер заказа, статус, сумма и подпись. Чтобы из такого требования вышел правильный webhook, AI должен сам знать всё, что вы сегодня выучили: байты, повтор, порядок, сумма."
   ],
   "c": [
    "Оба: <b>сырое тело, <code>timingSafeEqual</code>, повтор</b>; разница — в сумме и ответе на повтор",
    "Оба включили raw body, использовали timing safe equal и сделали payment id уникальным. Первый гораздо глубже: принимает и префикс sha256, при несовпадении суммы — отдельный статус. Второй говорит «оплачено», даже если сумма отличается, только пишет в лог."
   ],
   "d": [
    "2-й AI сам сказал: <b>«если сумма отличается — 200, решайте сами»</b>; 1-й AI — что вышел за рамки",
    "В ответе второго AI есть честная фраза: если сумма отличается, сообщение принимается, решайте сами. То есть решение за вами. А первый сказал, что один раз скопировал файл за пределы своей папки и удалил его. Теперь проверим оба на настоящей базе."
   ]
  }
 },
 "19": {
  "kicker": "Этап 5 · внутри",
  "title": "Семь проверок с настоящим PostgreSQL: подпись, повтор, JSON с пробелами, одновременно — оба прошли. Сумма 1 200 (заказ 120 000): 1-й AI «Summa mos emas», 2-й AI «To'landi»",
  "seg": {
   "a": [
    "На настоящей базе: подпись, повтор, JSON с пробелами, одновременно — <b>оба правы</b>",
    "Обе копии проверили на настоящем Postgres нашими проверками. Верная подпись — двести, повтор — одна строка, без подписи и с короткой подписью — четыреста один, JSON с пробелами принят, два сообщения одновременно — одна строка. В этой части оба правы."
   ],
   "b": [
    "Сумма 1 200, заказ 120 000: <b>у 2-го AI в панели «To'landi»</b>, у 1-го «Summa mos emas»",
    "Пятая проверка: подпись верная, но сумма тысяча двести, а заказ — сто двадцать тысяч. У второго AI панель говорит «оплачено», админ доставит. У первого статус «сумма не совпадает»: платёж записан, но админ видит разницу."
   ],
   "c": [
    "Честное сравнение: <b>здесь 1-й AI лучше нас</b> — если деньги прошли, запись не теряется",
    "Сравним честно. Наш код на такое сообщение возвращает четыреста и не записывает. Но деньги могли действительно пройти, а записи нет. Первый AI записывает и отдельно помечает. Здесь он лучше нас, в домашнем задании сделаете так же."
   ],
   "d": [
    "Итог: webhook от AI — <b>четыре вопроса</b>: по байтам ли · порядок · повтор · сумма",
    "Итог: webhook от AI — четыре вопроса. Подпись по сырым байтам? Подпись до записи? Повтор и одновременные сообщения — одна строка? Сравнивается ли сумма с заказом? Ответы проверяйте в коде и на настоящей базе."
   ]
  }
 },
 "20": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "В панели 2-го AI: #2 «To'landi · 1 200 so'm», а заказ на 120 000 so'm. В логе сервера только предупреждение. В чём здесь опасность?",
  "q": "Вы видели webhook от AI, теперь проверим. Четвёртая проверка. В панели второго AI заказ оплачен, тысяча двести сум, а заказ на сто двадцать тысяч. В логе сервера только предупреждение. В чём здесь опасность? Выберите вариант.",
  "ok": "Верно. Админ смотрит не в лог, а в панель, а панель говорит «оплачено». Заказ доставят, а пришла сотая часть денег. Подпись верная, сообщение настоящее: например, сервис прислал сумму в тийинах. Значит, сумма сравнивается с итогом заказа, и при несовпадении — отдельный видимый статус.",
  "okShort": "Панель «To'landi» — админ доставит, денег 1 %. Сравнивайте сумму с итогом.",
  "hint": "Куда смотрит админ — в лог или в панель? Что доказывает подпись?",
  "demak": "подпись доказывает, что сообщение настоящее, а не что сумма верна — сумма проверяется отдельно.",
  "opts": [
   "Админ доставит заказ как полностью оплаченный",
   "Опасности нет — лог предупреждает, админ всё равно читает его каждый день",
   "Подпись сломана — значит, сообщение может быть поддельным",
   "Повторное сообщение потом запишет и вторую строку"
  ],
  "wrong": {
   "1": "Админ смотрит в панель, а не в лог — предупреждения не видно.",
   "2": "Подпись верная — сообщение настоящее; проблема в сумме (например, прислано в тийинах).",
   "3": "Повтора здесь нет — оба AI пишут одну строку."
  }
 },
 "21": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»",
  "title": "Урок ученика: подписка Pro в Maydon Jamoa, тестовый режим — ровно то сообщение, подпись, повтор и отказ, что вы сегодня делали в OrderBotNest",
  "seg": {
   "a": [
    "m11-03 — 20 экранов: <b>Maydon Jamoa, подписка Pro, тестовый режим</b> — деньги не списываются",
    "Теперь подготовка к классу. Урок ученика m11-03, двадцать экранов. Пример — Maydon Jamoa: организатор игры платит за подписку Pro, тридцать дней, десять тысяч сум. Всё в тестовом режиме, карту не спрашивают, деньги не списываются."
   ],
   "b": [
    "У ученика тоже <b>сообщение, подпись, повтор и отказ</b>; на практике — свой Backend с агентом",
    "Путь в уроке ученика как у вас: сообщение об оплате, подпись, повтор, отказ и схема потока оплаты. На практике ученик добавляет webhook в свой Backend, с агентом, потом три проверки на странице тренировки. Ключ только в env и на Render."
   ],
   "c": [
    "Блоки: <b>трудное место — окно кода на 7-м экране и две практики</b>",
    "Посмотрите на таблицу блоков. Трудное место — окно кода на седьмом экране и две практики, в каждой ждём новую версию на Render. Что вы добавляете в каждом блоке — в правой колонке, с номером сегодняшнего экрана."
   ],
   "d": [
    "Итог: репозиторий <b><code>m13-dars-03-done</code></b>: <code>POST /tolov/webhook</code>, <code>X-Imzo</code>, <code>TOLOV_KALITI</code>",
    "Итог: проект ученика — maydon jamoa, тег done тринадцатого модуля, третьего урока. Адрес tolov webhook, подпись в заголовке X Imzo, ключ TOLOV KALITI. Имена узбекские, правила — как вы видели сегодня. На следующем экране слова ученика."
   ]
  }
 },
 "22": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "На языке ученика: сообщение об оплате, подпись, ключ, повтор — и четыре кнопки страницы «Mashq to'lov»; при нарушении порядка в проекте ученика тоже 401, но строка записана",
  "seg": {
   "a": [
    "Слова ученика: <b><code>X-Imzo</code>, <code>TOLOV_KALITI</code>, <code>takror: true</code></b> — узбекские имена ваших",
    "Слова из урока ученика: сообщение об оплате, подпись в заголовке X Imzo, ключ TOLOV KALITI, ответ на повтор — takror true. То, что вы знаете, только имена узбекские. Когда ученик говорит, рядом называйте имя из OrderBotNest."
   ],
   "b": [
    "Страница «Mashq to'lov»: <b>четыре кнопки</b> — вместо сервиса сам Backend",
    "У ученика вместо npm run pay есть страница: тренировочная оплата. Карту не спрашивают, деньги не списываются. Четыре кнопки: оплатить, отклонить, отправить дважды, отправить без подписи. Вы сегодня проверили ровно эти четыре режима скрипта."
   ],
   "c": [
    "Кнопки: <b>«To'lash» 200, «Imzosiz» 401</b> — в проекте ученика с настоящим Backend",
    "Эти выводы — из настоящего Backend проекта ученика: оплатить — двести ok. Без подписи — четыреста один, подпись не совпадает. В классе ученик должен увидеть эти два ответа."
   ],
   "d": [
    "Итог: и у ученика <b>при нарушении порядка 401, но строка записана</b> — ошибка с 13-го экрана",
    "Итог и предупреждение. В проекте ученика мы тоже нарушили порядок проверки: без подписи четыреста один, но в таблице платежей строка. Когда агент пишет код, пусть ученик смотрит не на код ответа, а в таблицу."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Если 401 — ключ, rawBody, порядок; в остальных случаях читайте текст ответа: шесть случаев и четыре вопроса, которые задаст ученик",
  "seg": {
   "a": [
    "Первые три — <b>связаны с 401</b>: ключ, <code>rawBody</code>, порядок",
    "Шесть случаев, которые встречаются в классе. Первые три связаны с подписью. Все сообщения четыреста один: ключ пустой или на Render другой. И настоящая оплата четыреста один: не включён raw body. Ответ четыреста один, но в таблице строка: нарушен порядок."
   ],
   "b": [
    "Остальные три: <b>две строки, 400 и <code>.env</code> в Git</b>",
    "Четвёртый: кнопка «дважды» записала две строки, номер платежа не уникален. Пятый: четыреста, в тексте ответа написано, какое поле неверно. Шестой: env-файл попал в Git, тогда ключи сразу меняют."
   ],
   "c": [
    "Вопросы ученика: <b>Payme, 200 на повтор, отказ, отдать ключ агенту</b>",
    "Готовые ответы на вопросы учеников внизу, нажмите, чтобы открыть: можно ли подключить Payme, почему и на повтор двести, зачем записывать отказ и можно ли отдать ключ агенту."
   ],
   "d": [
    "Итог: при 401 <b>ключ → <code>rawBody</code> → порядок</b>; смотрите в таблицу, а не на ответ",
    "Итог и способ: если ответ четыреста один, проверяйте в таком порядке: ключ, raw body, потом порядок проверки. Всегда смотрите в таблицу, а не только на код ответа. С этим вы готовы к классу. Теперь проверьте себя."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "Откуда сервер знает, что клиент оплатил?",
    "e": "Доказательство — только подписанное сообщение сервиса.",
    "o": [
     "Из скриншота оплаты от клиента",
     "Из нажатия кнопки «To'ladim» в боте",
     "Из подписанного сообщения платёжного сервиса",
     "Из отметки, которую поставил админ в панели"
    ]
   },
   {
    "q": "Из чего считается подпись?",
    "e": "HMAC — из байтов и ключа.",
    "o": [
     "Из сырого тела и секретного ключа",
     "Из JSON-объекта и номера заказа",
     "Из заголовков и IP-адреса",
     "Из суммы и отметки времени"
    ]
   },
   {
    "q": "В main.ts нет rawBody: true. Что будет?",
    "e": "Нет байтов, с которыми сравнить подпись.",
    "o": [
     "Пройдут и сообщения без подписи",
     "И настоящая оплата получит 401",
     "Повторные сообщения запишутся дважды",
     "Сервер вообще не запустится"
    ]
   },
   {
    "q": "Сообщение без подписи получило 401, но заказ «To'landi». Причина?",
    "e": "401 не отменяет записанное.",
    "o": [
     "Ключ в .env остался пустым",
     "В main.ts не включён rawBody",
     "Не использован timingSafeEqual",
     "Запись — до проверки подписи"
    ]
   },
   {
    "q": "Сервис прислал одно сообщение дважды. Что сделает сервер?",
    "e": "payment_id уникален, ON CONFLICT.",
    "o": [
     "На второе вернёт 409",
     "Запишет оба раза",
     "200 duplicate, строка одна",
     "На второе вернёт 401"
    ]
   },
   {
    "q": "Карта отклонена, сервис прислал сообщение. Что делается?",
    "e": "Ответ на «где мой платёж?».",
    "o": [
     "Записывается, статус failed",
     "Выбрасывается, потому что деньги не прошли",
     "Возвращается 400",
     "Заказ удаляется"
    ]
   },
   {
    "q": "В .env ключ пустой. Что делает сервер?",
    "e": "Пустой ключ знают все.",
    "o": [
     "Принимает всё, не проверяя подпись",
     "Предупреждает и отклоняет каждое сообщение",
     "Вообще не запускается",
     "Сам запрашивает ключ у сервиса"
    ]
   },
   {
    "q": "Webhook от AI назвал платёж на 1 200 сум за заказ на 120 000 «To'landi». Правильное решение?",
    "e": "Подпись не доказывает сумму.",
    "o": [
     "Работает, подпись верная — принять как есть",
     "Просто читать лог",
     "Сделать подпись длиннее",
     "Сравнивать сумму с итогом и выделять"
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
  ru(S5, { ...head(5), ...((typeof RU_S !== 'undefined' && RU_S.S5) || {}) });
  ru(S7, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.S7) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S12, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.S12) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S19, { ...head(19), ...((typeof RU_S !== 'undefined' && RU_S.S19) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P8.S, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.P8_S) || {}) });
  ru(P8.steps, RU_MDT[8].steps);
  ru(P8.trouble, RU_MDT[8].trouble);
  ru(P8.proof, RU_MDT[8].proof);
  ru(P11.S, { ...head(11), ...((typeof RU_S !== 'undefined' && RU_S.P11_S) || {}) });
  ru(P11.steps, RU_MDT[11].steps);
  ru(P11.trouble, RU_MDT[11].trouble);
  ru(P11.proof, RU_MDT[11].proof);
  ru(P17.S, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.P17_S) || {}) });
  ru(P17.steps, RU_MDT[17].steps);
  ru(P17.trouble, RU_MDT[17].trouble);
  ru(P17.proof, RU_MDT[17].proof);
  ru(FINAL, RU_MDT[24].final);
})();
