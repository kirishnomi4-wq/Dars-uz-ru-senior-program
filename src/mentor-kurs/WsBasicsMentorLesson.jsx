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

// AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-kod.py — OrderBotNest ws1-done, maydon-jamoa m12-dars-03-done, haqiqiy chiqishlar (qo'lda tahrirlanmaydi)
const KOD_GATEWAY = {
 "file": "src/api/live/live.gateway.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { Logger } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import {",
   "n": 2
  },
  {
   "t": "  OnGatewayConnection,",
   "n": 3
  },
  {
   "t": "  OnGatewayDisconnect,",
   "n": 4
  },
  {
   "t": "  WebSocketGateway,",
   "n": 5
  },
  {
   "t": "  WebSocketServer,",
   "n": 6
  },
  {
   "t": "} from '@nestjs/websockets';",
   "n": 7
  },
  {
   "t": "import type { Server, Socket } from 'socket.io';",
   "n": 8
  },
  {
   "t": "import { isAdminToken } from './admin-token';",
   "n": 9
  },
  {
   "t": "",
   "n": 10
  },
  {
   "t": "// gateway — doimiy ulanishlarni qabul qiladigan klass (socket.io). HTTP server bilan bitta portda turadi (PORT).",
   "n": 11
  },
  {
   "t": "// Panel bir marta ulanadi va ulanayotganda tokenni yuboradi: io(manzil, { auth: { token } }).",
   "n": 12
  },
  {
   "t": "// Token ulanish ochilayotganda tekshiriladi: yo'q yoki noto'g'ri bo'lsa — server ulanishni yopadi",
   "n": 13
  },
  {
   "t": "// (server yopgan ulanishga klient o'zi qayta ulanmaydi — panelda «Ulanmagan»).",
   "n": 14
  },
  {
   "t": "// Hodisa order-changed — { orderId, reason }: qaysi buyurtma va nega o'zgargani.",
   "n": 15
  },
  {
   "t": "// Yangi holatni panel GET /admin/orders dan qayta so'raydi — hodisa ichida ro'yxat ham, son ham yo'q.",
   "n": 16
  },
  {
   "t": "export type OrderChangeReason = 'new' | 'status';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "@WebSocketGateway()",
   "n": 19
  },
  {
   "t": "export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {",
   "n": 20
  },
  {
   "t": "  private readonly log = new Logger('Live');",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "  @WebSocketServer()",
   "n": 23
  },
  {
   "t": "  server?: Server;",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "  handleConnection(client: Socket) {",
   "n": 26
  },
  {
   "t": "    if (!isAdminToken(client.handshake.auth?.token)) {",
   "n": 27
  },
  {
   "t": "      client.disconnect();",
   "n": 28
  },
  {
   "t": "      return;",
   "n": 29
  },
  {
   "t": "    }",
   "n": 30
  },
  {
   "t": "    client.data.admin = true;",
   "n": 31
  },
  {
   "t": "    this.log.log(`panel ulandi: ${client.id}`);",
   "n": 32
  },
  {
   "t": "  }",
   "n": 33
  },
  {
   "t": "",
   "n": 34
  },
  {
   "t": "  handleDisconnect(client: Socket) {",
   "n": 35
  },
  {
   "t": "    if (client.data.admin) this.log.log(`panel uzildi: ${client.id}`);",
   "n": 36
  },
  {
   "t": "  }",
   "n": 37
  },
  {
   "t": "",
   "n": 38
  },
  {
   "t": "  // Bazadagi o'zgarish tugagandan keyin chaqiriladi (tranzaksiya yopilgach). Oladi — hamma ulangan panel.",
   "n": 39
  },
  {
   "t": "  // server yo'q bo'lsa (masalan, smoke HTTP'siz ishga tushirganda) — hodisa yuborilmaydi, bot ishlayveradi.",
   "n": 40
  },
  {
   "t": "  orderChanged(orderId: number, reason: OrderChangeReason) {",
   "n": 41
  },
  {
   "t": "    this.server?.emit('order-changed', { orderId, reason });",
   "n": 42
  },
  {
   "t": "  }",
   "n": 43
  },
  {
   "t": "}",
   "n": 44
  }
 ]
};
const KOD_TOKEN = {
 "file": "src/api/live/admin-token.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { config } from '../../config';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// Panel tokeni — .env dagi ADMIN_PANEL_TOKEN. Bitta qoida ikki joyda ishlatiladi:",
   "n": 3
  },
  {
   "t": "// WebSocket ulanishi ochilayotganda (gateway) va GET /admin/orders so'rovida (controller).",
   "n": 4
  },
  {
   "t": "// .env da token yozilmagan bo'lsa — hech kim kira olmaydi (bo'sh token ham rad etiladi).",
   "n": 5
  },
  {
   "t": "export function isAdminToken(token: unknown): boolean {",
   "n": 6
  },
  {
   "t": "  return (",
   "n": 7
  },
  {
   "t": "    typeof token === 'string' &&",
   "n": 8
  },
  {
   "t": "    token !== '' &&",
   "n": 9
  },
  {
   "t": "    token === config.ADMIN_PANEL_TOKEN",
   "n": 10
  },
  {
   "t": "  );",
   "n": 11
  },
  {
   "t": "}",
   "n": 12
  }
 ]
};
const KOD_CTRL = {
 "file": "src/api/live/admin.controller.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Controller,",
   "n": 2
  },
  {
   "t": "  Get,",
   "n": 3
  },
  {
   "t": "  Header,",
   "n": 4
  },
  {
   "t": "  Headers,",
   "n": 5
  },
  {
   "t": "  UnauthorizedException,",
   "n": 6
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 7
  },
  {
   "t": "import { readFileSync } from 'fs';",
   "n": 8
  },
  {
   "t": "import { join } from 'path';",
   "n": 9
  },
  {
   "t": "import { OrderService } from '../order/order.service';",
   "n": 10
  },
  {
   "t": "import { isAdminToken } from './admin-token';",
   "n": 11
  },
  {
   "t": "",
   "n": 12
  },
  {
   "t": "@Controller('admin')",
   "n": 13
  },
  {
   "t": "export class AdminController {",
   "n": 14
  },
  {
   "t": "  constructor(private readonly orders: OrderService) {}",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "  // Panel sahifasi: http://localhost:3000/admin — oddiy HTML. Tokenni sahifa so'raydi va brauzerda saqlaydi.",
   "n": 17
  },
  {
   "t": "  @Get()",
   "n": 18
  },
  {
   "t": "  @Header('Content-Type', 'text/html; charset=utf-8')",
   "n": 19
  },
  {
   "t": "  page(): string {",
   "n": 20
  },
  {
   "t": "    return readFileSync(join(process.cwd(), 'public', 'admin.html'), 'utf8');",
   "n": 21
  },
  {
   "t": "  }",
   "n": 22
  },
  {
   "t": "",
   "n": 23
  },
  {
   "t": "  // Panel shu ro'yxatni ochilganda va har order-changed hodisasidan keyin so'raydi.",
   "n": 24
  },
  {
   "t": "  // Token sarlavhada: Authorization: Bearer <ADMIN_PANEL_TOKEN>",
   "n": 25
  },
  {
   "t": "  @Get('orders')",
   "n": 26
  },
  {
   "t": "  async list(@Headers('authorization') auth?: string) {",
   "n": 27
  },
  {
   "t": "    const token = (auth ?? '').replace(/^Bearer /, '');",
   "n": 28
  },
  {
   "t": "    if (!isAdminToken(token))",
   "n": 29
  },
  {
   "t": "      throw new UnauthorizedException(\"Token noto'g'ri\");",
   "n": 30
  },
  {
   "t": "    const orders = await this.orders.recent(20);",
   "n": 31
  },
  {
   "t": "    return orders.map((o) => ({",
   "n": 32
  },
  {
   "t": "      id: o.id,",
   "n": 33
  },
  {
   "t": "      status: o.status,",
   "n": 34
  },
  {
   "t": "      total: o.total,",
   "n": 35
  },
  {
   "t": "      customer: o.user?.name ?? '',",
   "n": 36
  },
  {
   "t": "      phone: o.phone,",
   "n": 37
  },
  {
   "t": "      items: o.items.map((i) => ({ name: i.product.name, qty: i.qty })),",
   "n": 38
  },
  {
   "t": "      created_at: o.created_at,",
   "n": 39
  },
  {
   "t": "    }));",
   "n": 40
  },
  {
   "t": "  }",
   "n": 41
  },
  {
   "t": "}",
   "n": 42
  }
 ]
};
const KOD_MODULE = {
 "file": "src/api/live/live.module.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { Module } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { OrderModule } from '../order/order.module';",
   "n": 2
  },
  {
   "t": "import { AdminController } from './admin.controller';",
   "n": 3
  },
  {
   "t": "import { LiveGateway } from './live.gateway';",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "// Jonli panel: /admin sahifasi, GET /admin/orders va WebSocket gateway (order-changed hodisasi)",
   "n": 6
  },
  {
   "t": "@Module({",
   "n": 7
  },
  {
   "t": "  imports: [OrderModule],",
   "n": 8
  },
  {
   "t": "  controllers: [AdminController],",
   "n": 9
  },
  {
   "t": "  providers: [LiveGateway],",
   "n": 10
  },
  {
   "t": "  exports: [LiveGateway],",
   "n": 11
  },
  {
   "t": "})",
   "n": 12
  },
  {
   "t": "export class LiveModule {}",
   "n": 13
  }
 ]
};
const KOD_TG = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { Context, Telegraf } from 'telegraf';",
   "n": 2
  },
  {
   "t": "import { config } from '../../config';",
   "n": 3
  },
  {
   "t": "import { OrderStatus, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { CartService } from '../cart/cart.service';",
   "n": 5
  },
  {
   "t": "import { CatalogService } from '../catalog/catalog.service';",
   "n": 6
  },
  {
   "t": "import { LiveGateway } from '../live/live.gateway';",
   "n": 7
  },
  {
   "t": "import { OrderService } from '../order/order.service';",
   "n": 8
  },
  {
   "t": "import { UserService } from '../user/user.service';",
   "n": 9
  },
  {
   "t": "import { cartKeyboard, catalogKeyboard, orderKeyboard } from './keyboards';",
   "n": 10
  },
  {
   "t": "import { isPhone } from './phone';",
   "n": 11
  },
  {
   "t": "import { texts } from './texts';",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "@Injectable()",
   "n": 14
  },
  {
   "t": "export class TelegramService implements OnModuleInit, OnModuleDestroy {",
   "n": 15
  },
  {
   "t": "  private bot: Telegraf;",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "  constructor(",
   "n": 18
  },
  {
   "t": "    private readonly users: UserService,",
   "n": 19
  },
  {
   "t": "    private readonly catalog: CatalogService,",
   "n": 20
  },
  {
   "t": "    private readonly cart: CartService,",
   "n": 21
  },
  {
   "t": "    private readonly orders: OrderService,",
   "n": 22
  },
  {
   "t": "    private readonly live: LiveGateway,",
   "n": 23
  },
  {
   "t": "  ) {}",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "  async onModuleInit() {",
   "n": 26
  },
  {
   "t": "    if (!config.BOT_TOKEN) {",
   "n": 27
  },
  {
   "t": "      throw new Error(",
   "n": 28
  },
  {
   "t": "        'BOT_TOKEN topilmadi. .env faylini oching va @BotFather bergan tokenni yozing (README).',",
   "n": 29
  },
  {
   "t": "      );",
   "n": 30
  },
  {
   "t": "    }",
   "n": 31
  },
  {
   "t": "    this.bot = new Telegraf(config.BOT_TOKEN);",
   "n": 32
  },
  {
   "t": "    this.registerCustomer();",
   "n": 33
  },
  {
   "t": "    this.registerAdmin();",
   "n": 34
  },
  {
   "t": "    this.bot.on('text', (ctx) => this.onText(ctx));",
   "n": 35
  },
  {
   "t": "    this.bot.catch(async (err, ctx) => {",
   "n": 36
  },
  {
   "t": "      console.error('Bot xatosi:', (err as Error).message);",
   "n": 37
  },
  {
   "t": "      await ctx.reply(texts.unknown).catch(() => undefined);",
   "n": 38
  },
  {
   "t": "    });",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "    this.bot",
   "n": 41
  },
  {
   "t": "      .launch(() => console.log('Telegram bot ulandi'))",
   "n": 42
  },
  {
   "t": "      .catch((e: Error) =>",
   "n": 43
  },
  {
   "t": "        console.error(",
   "n": 44
  },
  {
   "t": "          'Telegram ulanmadi:',",
   "n": 45
  },
  {
   "t": "          e.message,",
   "n": 46
  },
  {
   "t": "          '— README, «Xatolar» jadvali',",
   "n": 47
  },
  {
   "t": "        ),",
   "n": 48
  },
  {
   "t": "      );",
   "n": 49
  },
  {
   "t": "  }",
   "n": 50
  },
  {
   "t": "",
   "n": 51
  },
  {
   "t": "  onModuleDestroy() {",
   "n": 52
  },
  {
   "t": "    try {",
   "n": 53
  },
  {
   "t": "      this.bot?.stop('shutdown');",
   "n": 54
  },
  {
   "t": "    } catch {",
   "n": 55
  },
  {
   "t": "      /* allaqachon to'xtagan */",
   "n": 56
  },
  {
   "t": "    }",
   "n": 57
  },
  {
   "t": "  }",
   "n": 58
  },
  {
   "t": "",
   "n": 59
  },
  {
   "t": "  // ---------- mijoz ----------",
   "n": 60
  },
  {
   "t": "  private registerCustomer() {",
   "n": 61
  },
  {
   "t": "    this.bot.start(async (ctx) => {",
   "n": 62
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 63
  },
  {
   "t": "      await ctx.reply(texts.start(user.name, user.role === 'admin'));",
   "n": 64
  },
  {
   "t": "    });",
   "n": 65
  },
  {
   "t": "",
   "n": 66
  },
  {
   "t": "    this.bot.help((ctx) => ctx.reply(texts.help));",
   "n": 67
  },
  {
   "t": "",
   "n": 68
  },
  {
   "t": "    this.bot.command('catalog', (ctx) => this.showCatalog(ctx, 0));",
   "n": 69
  },
  {
   "t": "",
   "n": 70
  },
  {
   "t": "    this.bot.action(/^page:(\\d+)$/, async (ctx) => {",
   "n": 71
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 72
  },
  {
   "t": "      await this.showCatalog(ctx, Number(ctx.match[1]), true);",
   "n": 73
  },
  {
   "t": "    });",
   "n": 74
  },
  {
   "t": "",
   "n": 75
  },
  {
   "t": "    this.bot.action(/^add:(\\d+)$/, async (ctx) => {",
   "n": 76
  },
  {
   "t": "      const p = await this.catalog.find(Number(ctx.match[1]));",
   "n": 77
  },
  {
   "t": "      if (!p) return ctx.answerCbQuery('Mahsulot topilmadi');",
   "n": 78
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 79
  },
  {
   "t": "      const qty = await this.cart.add(user, p.id);",
   "n": 80
  },
  {
   "t": "      await ctx.answerCbQuery(texts.added(p, qty));",
   "n": 81
  },
  {
   "t": "    });",
   "n": 82
  },
  {
   "t": "",
   "n": 83
  },
  {
   "t": "    this.bot.action('noop', (ctx) => ctx.answerCbQuery());",
   "n": 84
  },
  {
   "t": "",
   "n": 85
  },
  {
   "t": "    this.bot.command('cart', (ctx) => this.showCart(ctx));",
   "n": 86
  },
  {
   "t": "    this.bot.action('cart', async (ctx) => {",
   "n": 87
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 88
  },
  {
   "t": "      await this.showCart(ctx);",
   "n": 89
  },
  {
   "t": "    });",
   "n": 90
  },
  {
   "t": "",
   "n": 91
  },
  {
   "t": "    this.bot.action('cart:clear', async (ctx) => {",
   "n": 92
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 93
  },
  {
   "t": "      await this.cart.clear(user);",
   "n": 94
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 95
  },
  {
   "t": "      await ctx.reply(texts.cartCleared);",
   "n": 96
  },
  {
   "t": "    });",
   "n": 97
  },
  {
   "t": "",
   "n": 98
  },
  {
   "t": "    this.bot.action('checkout', async (ctx) => {",
   "n": 99
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 100
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 101
  },
  {
   "t": "      const items = await this.cart.list(user);",
   "n": 102
  },
  {
   "t": "      if (items.length === 0) return ctx.reply(texts.cartEmpty);",
   "n": 103
  },
  {
   "t": "      if (!user.phone) {",
   "n": 104
  },
  {
   "t": "        await this.users.setState(user, 'WAITING_PHONE');",
   "n": 105
  },
  {
   "t": "        return ctx.reply(texts.askPhone);",
   "n": 106
  },
  {
   "t": "      }",
   "n": 107
  },
  {
   "t": "      await this.placeOrder(ctx, user);",
   "n": 108
  },
  {
   "t": "    });",
   "n": 109
  },
  {
   "t": "  }",
   "n": 110
  },
  {
   "t": "",
   "n": 111
  },
  {
   "t": "  private async showCatalog(ctx: Context, page: number, edit = false) {",
   "n": 112
  },
  {
   "t": "    const { items, pages } = await this.catalog.page(page);",
   "n": 113
  },
  {
   "t": "    const text = texts.catalogTitle(page, pages);",
   "n": 114
  },
  {
   "t": "    const kb = catalogKeyboard(items, page, pages);",
   "n": 115
  },
  {
   "t": "    if (edit) {",
   "n": 116
  },
  {
   "t": "      try {",
   "n": 117
  },
  {
   "t": "        await ctx.editMessageText(text, kb);",
   "n": 118
  },
  {
   "t": "        return;",
   "n": 119
  },
  {
   "t": "      } catch {",
   "n": 120
  },
  {
   "t": "        /* xabar o'zgarmagan bo'lsa Telegram xato beradi — yangisini yuboramiz */",
   "n": 121
  },
  {
   "t": "      }",
   "n": 122
  },
  {
   "t": "    }",
   "n": 123
  },
  {
   "t": "    await ctx.reply(text, kb);",
   "n": 124
  },
  {
   "t": "  }",
   "n": 125
  },
  {
   "t": "",
   "n": 126
  },
  {
   "t": "  private async showCart(ctx: Context) {",
   "n": 127
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 128
  },
  {
   "t": "    const items = await this.cart.list(user);",
   "n": 129
  },
  {
   "t": "    if (items.length === 0) return ctx.reply(texts.cartEmpty);",
   "n": 130
  },
  {
   "t": "    const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);",
   "n": 131
  },
  {
   "t": "    await ctx.reply(texts.cart(items, total), cartKeyboard());",
   "n": 132
  },
  {
   "t": "  }",
   "n": 133
  },
  {
   "t": "",
   "n": 134
  },
  {
   "t": "  private async placeOrder(ctx: Context, user: User) {",
   "n": 135
  },
  {
   "t": "    try {",
   "n": 136
  },
  {
   "t": "      const order = await this.orders.place(user, await this.cart.list(user));",
   "n": 137
  },
  {
   "t": "      // tranzaksiya tugadi — buyurtma bazada; ochiq panellarga xabar beramiz",
   "n": 138
  },
  {
   "t": "      this.live.orderChanged(order.id, 'new');",
   "n": 139
  },
  {
   "t": "      await ctx.reply(texts.orderPlaced(order));",
   "n": 140
  },
  {
   "t": "      for (const admin of await this.users.admins()) {",
   "n": 141
  },
  {
   "t": "        if (admin.telegram_id === user.telegram_id) continue;",
   "n": 142
  },
  {
   "t": "        await this.bot.telegram",
   "n": 143
  },
  {
   "t": "          .sendMessage(",
   "n": 144
  },
  {
   "t": "            Number(admin.telegram_id),",
   "n": 145
  },
  {
   "t": "            texts.adminNewOrder(order, user.name),",
   "n": 146
  },
  {
   "t": "          )",
   "n": 147
  },
  {
   "t": "          .catch(() => undefined);",
   "n": 148
  },
  {
   "t": "      }",
   "n": 149
  },
  {
   "t": "    } catch (e) {",
   "n": 150
  },
  {
   "t": "      await ctx.reply(texts.orderFailed((e as Error).message));",
   "n": 151
  },
  {
   "t": "    }",
   "n": 152
  },
  {
   "t": "  }",
   "n": 153
  },
  {
   "t": "",
   "n": 154
  },
  {
   "t": "  // Matn keldi: telefon kutilayotgan bo'lsa — saqlab buyurtma beramiz",
   "n": 155
  },
  {
   "t": "  private async onText(ctx: Context & { message: { text: string } }) {",
   "n": 156
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 157
  },
  {
   "t": "    if (user.state === 'WAITING_PHONE') {",
   "n": 158
  },
  {
   "t": "      const phone = ctx.message.text.replace(/[\\s-]/g, '');",
   "n": 159
  },
  {
   "t": "      if (!isPhone(phone)) return ctx.reply(texts.badPhone);",
   "n": 160
  },
  {
   "t": "      await this.users.setPhone(user, phone);",
   "n": 161
  },
  {
   "t": "      return this.placeOrder(ctx, user);",
   "n": 162
  },
  {
   "t": "    }",
   "n": 163
  },
  {
   "t": "    await ctx.reply(texts.unknown);",
   "n": 164
  },
  {
   "t": "  }",
   "n": 165
  },
  {
   "t": "",
   "n": 166
  },
  {
   "t": "  // ---------- admin ----------",
   "n": 167
  },
  {
   "t": "  private registerAdmin() {",
   "n": 168
  },
  {
   "t": "    this.bot.command('orders', async (ctx) => {",
   "n": 169
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 170
  },
  {
   "t": "      if (user.role !== 'admin') return ctx.reply(texts.adminOnly);",
   "n": 171
  },
  {
   "t": "      const list = await this.orders.recent(5);",
   "n": 172
  },
  {
   "t": "      if (list.length === 0) return ctx.reply(texts.noOrders);",
   "n": 173
  },
  {
   "t": "      for (const o of list)",
   "n": 174
  },
  {
   "t": "        await ctx.reply(texts.orderLine(o), orderKeyboard(o));",
   "n": 175
  },
  {
   "t": "    });",
   "n": 176
  },
  {
   "t": "",
   "n": 177
  },
  {
   "t": "    this.bot.action(",
   "n": 178
  },
  {
   "t": "      /^status:(\\d+):(NEW|CONFIRMED|DELIVERED|CANCELLED)$/,",
   "n": 179
  },
  {
   "t": "      async (ctx) => {",
   "n": 180
  },
  {
   "t": "        const user = await this.users.getOrCreate(ctx.from);",
   "n": 181
  },
  {
   "t": "        if (user.role !== 'admin') return ctx.answerCbQuery(texts.adminOnly);",
   "n": 182
  },
  {
   "t": "        try {",
   "n": 183
  },
  {
   "t": "          const order = await this.orders.setStatus(",
   "n": 184
  },
  {
   "t": "            Number(ctx.match[1]),",
   "n": 185
  },
  {
   "t": "            ctx.match[2] as OrderStatus,",
   "n": 186
  },
  {
   "t": "          );",
   "n": 187
  },
  {
   "t": "          this.live.orderChanged(order.id, 'status');",
   "n": 188
  },
  {
   "t": "          await ctx.answerCbQuery(texts.statusChanged(order));",
   "n": 189
  },
  {
   "t": "          await ctx.editMessageText(",
   "n": 190
  },
  {
   "t": "            texts.orderLine(order),",
   "n": 191
  },
  {
   "t": "            orderKeyboard(order),",
   "n": 192
  },
  {
   "t": "          );",
   "n": 193
  },
  {
   "t": "          await this.bot.telegram",
   "n": 194
  },
  {
   "t": "            .sendMessage(",
   "n": 195
  },
  {
   "t": "              Number(order.user.telegram_id),",
   "n": 196
  },
  {
   "t": "              texts.customerStatus(order),",
   "n": 197
  },
  {
   "t": "            )",
   "n": 198
  },
  {
   "t": "            .catch(() => undefined);",
   "n": 199
  },
  {
   "t": "        } catch (e) {",
   "n": 200
  },
  {
   "t": "          await ctx.answerCbQuery((e as Error).message);",
   "n": 201
  },
  {
   "t": "        }",
   "n": 202
  },
  {
   "t": "      },",
   "n": 203
  },
  {
   "t": "    );",
   "n": 204
  },
  {
   "t": "  }",
   "n": 205
  },
  {
   "t": "}",
   "n": 206
  }
 ]
};
const KOD_TGMOD = {
 "file": "src/api/telegram/telegram.module.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { Module } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { CartModule } from '../cart/cart.module';",
   "n": 2
  },
  {
   "t": "import { CatalogModule } from '../catalog/catalog.module';",
   "n": 3
  },
  {
   "t": "import { LiveModule } from '../live/live.module';",
   "n": 4
  },
  {
   "t": "import { OrderModule } from '../order/order.module';",
   "n": 5
  },
  {
   "t": "import { UserModule } from '../user/user.module';",
   "n": 6
  },
  {
   "t": "import { TelegramService } from './telegram.service';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "@Module({",
   "n": 9
  },
  {
   "t": "  imports: [UserModule, CatalogModule, CartModule, OrderModule, LiveModule],",
   "n": 10
  },
  {
   "t": "  providers: [TelegramService],",
   "n": 11
  },
  {
   "t": "})",
   "n": 12
  },
  {
   "t": "export class TelegramModule {}",
   "n": 13
  }
 ]
};
const KOD_HTML = {
 "file": "public/admin.html",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "<!doctype html>",
   "n": 1
  },
  {
   "t": "<html lang=\"uz\">",
   "n": 2
  },
  {
   "t": "<head>",
   "n": 3
  },
  {
   "t": "<meta charset=\"utf-8\">",
   "n": 4
  },
  {
   "t": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
   "n": 5
  },
  {
   "t": "<title>Buyurtmalar — jonli panel</title>",
   "n": 6
  },
  {
   "t": "<style>",
   "n": 7
  },
  {
   "t": "  :root { --ink: #1f2328; --mute: #57606a; --line: #d0d7de; --ok: #1a7f37; --wait: #9a6700; --bad: #cf222e; --bg: #f6f8fa; }",
   "n": 8
  },
  {
   "t": "  * { box-sizing: border-box; }",
   "n": 9
  },
  {
   "t": "  body { margin: 0; font: 15px/1.45 system-ui, sans-serif; color: var(--ink); background: var(--bg); }",
   "n": 10
  },
  {
   "t": "  header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid var(--line); }",
   "n": 11
  },
  {
   "t": "  h1 { margin: 0; font-size: 18px; }",
   "n": 12
  },
  {
   "t": "  #holat { margin-left: auto; padding: 4px 10px; border-radius: 999px; font-weight: 600; font-size: 13px; color: #fff; background: var(--mute); }",
   "n": 13
  },
  {
   "t": "  #holat.ulangan { background: var(--ok); }",
   "n": 14
  },
  {
   "t": "  #holat.ulanmoqda { background: var(--wait); }",
   "n": 15
  },
  {
   "t": "  #holat.ulanmagan { background: var(--bad); }",
   "n": 16
  },
  {
   "t": "  main { padding: 16px 20px; max-width: 1000px; margin: 0 auto; }",
   "n": 17
  },
  {
   "t": "  form { display: flex; gap: 8px; margin-bottom: 14px; }",
   "n": 18
  },
  {
   "t": "  input { flex: 1; padding: 8px 10px; border: 1px solid var(--line); border-radius: 6px; font: inherit; }",
   "n": 19
  },
  {
   "t": "  button { padding: 8px 14px; border: 0; border-radius: 6px; background: var(--ink); color: #fff; font: inherit; cursor: pointer; }",
   "n": 20
  },
  {
   "t": "  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }",
   "n": 21
  },
  {
   "t": "  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }",
   "n": 22
  },
  {
   "t": "  th { background: var(--bg); font-size: 13px; color: var(--mute); }",
   "n": 23
  },
  {
   "t": "  tr.yangi td { background: #fff8c5; }",
   "n": 24
  },
  {
   "t": "  .izoh { color: var(--mute); font-size: 13px; margin: 10px 0 0; }",
   "n": 25
  },
  {
   "t": "</style>",
   "n": 26
  },
  {
   "t": "</head>",
   "n": 27
  },
  {
   "t": "<body>",
   "n": 28
  },
  {
   "t": "<header>",
   "n": 29
  },
  {
   "t": "  <h1>Buyurtmalar — jonli panel</h1>",
   "n": 30
  },
  {
   "t": "  <span id=\"holat\">Ulanmagan</span>",
   "n": 31
  },
  {
   "t": "</header>",
   "n": 32
  },
  {
   "t": "<main>",
   "n": 33
  },
  {
   "t": "  <form id=\"kirish\">",
   "n": 34
  },
  {
   "t": "    <input id=\"token\" type=\"password\" placeholder=\".env dagi ADMIN_PANEL_TOKEN\" autocomplete=\"off\">",
   "n": 35
  },
  {
   "t": "    <button>Kirish</button>",
   "n": 36
  },
  {
   "t": "  </form>",
   "n": 37
  },
  {
   "t": "  <table>",
   "n": 38
  },
  {
   "t": "    <thead><tr><th>#</th><th>Mijoz</th><th>Telefon</th><th>Mahsulotlar</th><th>Jami</th><th>Holat</th><th>Vaqt</th></tr></thead>",
   "n": 39
  },
  {
   "t": "    <tbody id=\"royxat\"><tr><td colspan=\"7\">Token kiriting</td></tr></tbody>",
   "n": 40
  },
  {
   "t": "  </table>",
   "n": 41
  },
  {
   "t": "  <p class=\"izoh\">Yangi buyurtma yoki holat o'zgarsa, ro'yxat o'zi yangilanadi — sahifani qayta ochish shart emas.</p>",
   "n": 42
  },
  {
   "t": "</main>",
   "n": 43
  },
  {
   "t": "<!-- socket.io klienti: server o'zi beradi (/socket.io/socket.io.js) -->",
   "n": 44
  },
  {
   "t": "<script src=\"/socket.io/socket.io.js\"></script>",
   "n": 45
  },
  {
   "t": "<script>",
   "n": 46
  },
  {
   "t": "  // Uch holat: ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, klient o'zi qayta urinmoqda ·",
   "n": 47
  },
  {
   "t": "  // ulanmagan — klient urinmayapti (token noto'g'ri — server ulanishni yopdi)",
   "n": 48
  },
  {
   "t": "  const HOLAT = { ulangan: 'Ulangan', ulanmoqda: 'Ulanmoqda…', ulanmagan: 'Ulanmagan' };",
   "n": 49
  },
  {
   "t": "  const STATUS = { NEW: 'Yangi', CONFIRMED: 'Tasdiqlandi', DELIVERED: 'Yetkazildi', CANCELLED: 'Bekor' };",
   "n": 50
  },
  {
   "t": "  const el = (id) => document.getElementById(id);",
   "n": 51
  },
  {
   "t": "  // Telegram'dan kelgan ism va mahsulot nomi — matn sifatida (ichida HTML bo'lsa ham ishlamaydi)",
   "n": 52
  },
  {
   "t": "  const esc = (v) => String(v).replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' })[c]);",
   "n": 53
  },
  {
   "t": "  let token = localStorage.getItem(\u0027adminToken') || '';",
   "n": 54
  },
  {
   "t": "  let ulanish = null;",
   "n": 55
  },
  {
   "t": "  let oxirgiId = 0;",
   "n": 56
  },
  {
   "t": "",
   "n": 57
  },
  {
   "t": "  function holatQoy(h) {",
   "n": 58
  },
  {
   "t": "    el('holat').className = h;",
   "n": 59
  },
  {
   "t": "    el('holat').textContent = HOLAT[h];",
   "n": 60
  },
  {
   "t": "  }",
   "n": 61
  },
  {
   "t": "",
   "n": 62
  },
  {
   "t": "  // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.",
   "n": 63
  },
  {
   "t": "  async function yukla() {",
   "n": 64
  },
  {
   "t": "    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });",
   "n": 65
  },
  {
   "t": "    if (r.status === 401) {",
   "n": 66
  },
  {
   "t": "      el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";",
   "n": 67
  },
  {
   "t": "      return;",
   "n": 68
  },
  {
   "t": "    }",
   "n": 69
  },
  {
   "t": "    const list = await r.json();",
   "n": 70
  },
  {
   "t": "    const eng = list.length ? list[0].id : 0;",
   "n": 71
  },
  {
   "t": "    el('royxat').innerHTML = list.length",
   "n": 72
  },
  {
   "t": "      ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">",
   "n": 73
  },
  {
   "t": "          <td>${o.id}</td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>",
   "n": 74
  },
  {
   "t": "          <td>${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}</td>",
   "n": 75
  },
  {
   "t": "          <td>${o.total.toLocaleString('ru-RU')} so'm</td><td>${STATUS[o.status] || o.status}</td>",
   "n": 76
  },
  {
   "t": "          <td>${new Date(o.created_at).toLocaleTimeString('ru-RU')}</td></tr>`).join('')",
   "n": 77
  },
  {
   "t": "      : \"<tr><td colspan='7'>Hali buyurtma yo'q</td></tr>\";",
   "n": 78
  },
  {
   "t": "    oxirgiId = eng;",
   "n": 79
  },
  {
   "t": "  }",
   "n": 80
  },
  {
   "t": "",
   "n": 81
  },
  {
   "t": "  function ulan() {",
   "n": 82
  },
  {
   "t": "    if (ulanish) ulanish.close();",
   "n": 83
  },
  {
   "t": "    ulanish = io({ auth: { token } });",
   "n": 84
  },
  {
   "t": "    holatQoy('ulanmoqda');",
   "n": 85
  },
  {
   "t": "    ulanish.on('connect', () => holatQoy('ulangan'));",
   "n": 86
  },
  {
   "t": "    // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»",
   "n": 87
  },
  {
   "t": "    ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 88
  },
  {
   "t": "    ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 89
  },
  {
   "t": "    ulanish.on('order-changed', () => yukla());",
   "n": 90
  },
  {
   "t": "  }",
   "n": 91
  },
  {
   "t": "",
   "n": 92
  },
  {
   "t": "  el('kirish').addEventListener('submit', (e) => {",
   "n": 93
  },
  {
   "t": "    e.preventDefault();",
   "n": 94
  },
  {
   "t": "    token = el('token').value.trim();",
   "n": 95
  },
  {
   "t": "    localStorage.setItem(\u0027adminToken', token);",
   "n": 96
  },
  {
   "t": "    yukla();",
   "n": 97
  },
  {
   "t": "    ulan();",
   "n": 98
  },
  {
   "t": "  });",
   "n": 99
  },
  {
   "t": "",
   "n": 100
  },
  {
   "t": "  if (token) {",
   "n": 101
  },
  {
   "t": "    el('token').value = token;",
   "n": 102
  },
  {
   "t": "    yukla();",
   "n": 103
  },
  {
   "t": "    ulan();",
   "n": 104
  },
  {
   "t": "  }",
   "n": 105
  },
  {
   "t": "</script>",
   "n": 106
  },
  {
   "t": "</body>",
   "n": 107
  },
  {
   "t": "</html>",
   "n": 108
  }
 ]
};
const KOD_CLIENT = {
 "file": "scripts/live-client.js",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "// npm run live [-- <token>]",
   "n": 1
  },
  {
   "t": "// Terminal klienti: jonli panel nima ko'rsa — shu yerda satr bo'lib chiqadi (brauzer kerak emas).",
   "n": 2
  },
  {
   "t": "// Manzil: LIVE_URL yoki http://localhost:<PORT>. Token: buyruqdagi argument yoki .env dagi ADMIN_PANEL_TOKEN.",
   "n": 3
  },
  {
   "t": "//   npm run live                  — .env dagi token bilan",
   "n": 4
  },
  {
   "t": "//   npm run live -- notogri       — noto'g'ri token bilan (server ulanishni yopadi)",
   "n": 5
  },
  {
   "t": "//   npm run live -- \"\"            — tokensiz",
   "n": 6
  },
  {
   "t": "const path = require('path');",
   "n": 7
  },
  {
   "t": "require('dotenv').config({",
   "n": 8
  },
  {
   "t": "  path: path.join(__dirname, '..', '.env'),",
   "n": 9
  },
  {
   "t": "  quiet: true,",
   "n": 10
  },
  {
   "t": "});",
   "n": 11
  },
  {
   "t": "const { io } = require('socket.io-client');",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "const url =",
   "n": 14
  },
  {
   "t": "  process.env.LIVE_URL || `http://localhost:${process.env.PORT || 3000}`;",
   "n": 15
  },
  {
   "t": "const token =",
   "n": 16
  },
  {
   "t": "  process.argv.length > 2 ? process.argv[2] : process.env.ADMIN_PANEL_TOKEN;",
   "n": 17
  },
  {
   "t": "const t = () => new Date().toTimeString().slice(0, 8);",
   "n": 18
  },
  {
   "t": "const holat = (s) =>",
   "n": 19
  },
  {
   "t": "  s.connected ? 'ulangan' : s.active ? 'ulanmoqda' : 'ulanmagan';",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "const s = io(url, { auth: { token } });",
   "n": 22
  },
  {
   "t": "console.log(`${t()} ulanmoqda… ${url}`);",
   "n": 23
  },
  {
   "t": "s.on('connect', () => {",
   "n": 24
  },
  {
   "t": "  console.log(",
   "n": 25
  },
  {
   "t": "    `${t()} connect · ${holat(s)} · transport: ${s.io.engine.transport.name}`,",
   "n": 26
  },
  {
   "t": "  );",
   "n": 27
  },
  {
   "t": "  s.io.engine.once('upgrade', (tr) =>",
   "n": 28
  },
  {
   "t": "    console.log(`${t()} transport: ${tr.name}`),",
   "n": 29
  },
  {
   "t": "  );",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "s.on('disconnect', (reason) =>",
   "n": 32
  },
  {
   "t": "  console.log(",
   "n": 33
  },
  {
   "t": "    `${t()} disconnect: ${reason} · active=${s.active} → ${holat(s)}`,",
   "n": 34
  },
  {
   "t": "  ),",
   "n": 35
  },
  {
   "t": ");",
   "n": 36
  },
  {
   "t": "s.on('connect_error', (e) =>",
   "n": 37
  },
  {
   "t": "  console.log(",
   "n": 38
  },
  {
   "t": "    `${t()} connect_error: ${e.message} · active=${s.active} → ${holat(s)}`,",
   "n": 39
  },
  {
   "t": "  ),",
   "n": 40
  },
  {
   "t": ");",
   "n": 41
  },
  {
   "t": "s.on('order-changed', (p) =>",
   "n": 42
  },
  {
   "t": "  console.log(`${t()} order-changed ${JSON.stringify(p)}`),",
   "n": 43
  },
  {
   "t": ");",
   "n": 44
  }
 ]
};
const KOD_ENV = {
 "file": ".env.example",
 "tag": "ws1-done",
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
   "t": "# PostgreSQL (lokal: PG-1 darsida o'rnatilgan). Baza oldindan yaratilgan bo'lsin: CREATE DATABASE shop;",
   "n": 13
  },
  {
   "t": "DATABASE_URL=postgresql://postgres:parol@localhost:5432/shop",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "# true — TypeORM har SQL so'rovni terminalga yozadi (o'rganish uchun qulay)",
   "n": 16
  },
  {
   "t": "DB_LOGGING=true",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "# Server porti (hosting o'zi beradi, lokalda tegmaysiz)",
   "n": 19
  },
  {
   "t": "PORT=3000",
   "n": 20
  }
 ]
};
const KOD_README = {
 "file": "README.md",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "## Jonli panel (WebSocket)",
   "n": 40
  },
  {
   "t": "Do'kon kompyuterida ochiq turadigan sahifa: **http://localhost:3000/admin** → `.env` dagi `ADMIN_PANEL_TOKEN` ni kiriting.",
   "n": 42
  },
  {
   "t": "Bot yangi buyurtma olganda yoki admin holatni o'zgartirganda ro'yxat **o'zi yangilanadi** — sahifani qayta ochish shart emas.",
   "n": 43
  },
  {
   "t": "| Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Panelda nima o'zgaradi |",
   "n": 45
  },
  {
   "t": "|---|---|---|---|---|",
   "n": 46
  },
  {
   "t": "| buyurtmalar ro'yxati | mijoz botda buyurtma beradi | `order-changed` · `reason: 'new'` | hamma ulangan panel | yangi qator (sariq) |",
   "n": 47
  },
  {
   "t": "| buyurtma holati | admin botda «Tasdiqlash / Yetkazildi / Bekor» bosadi | `order-changed` · `reason: 'status'` | hamma ulangan panel | «Holat» ustuni |",
   "n": 48
  },
  {
   "t": "`order-changed` — `{ orderId, reason }`: faqat qaysi buyurtma va nega. Yangi ro'yxatni panel `GET /admin/orders` dan qayta so'raydi (token — `Authorization: Bearer …`).",
   "n": 50
  },
  {
   "t": "Hodisa tranzaksiya tugagandan keyin yuboriladi: panel so'raganda buyurtma bazada bor.",
   "n": 51
  },
  {
   "t": "- Ulanish — socket.io (`@nestjs/websockets`, `@nestjs/platform-socket.io`), HTTP bilan bitta portda. Token ulanish ochilayotganda tekshiriladi (`auth: { token }`); noto'g'ri bo'lsa server ulanishni yopadi.",
   "n": 53
  },
  {
   "t": "- Panel belgisi: **Ulangan** — hodisalar keladi · **Ulanmoqda…** — server javob bermayapti, klient o'zi qayta urinmoqda · **Ulanmagan** — token noto'g'ri, klient urinmaydi.",
   "n": 54
  },
  {
   "t": "- Brauzersiz tekshirish: `npm run live` — terminal klienti (`npm run live -- notogri` — noto'g'ri token bilan).",
   "n": 55
  },
  {
   "t": "- Telegram'siz tekshirish: `npm run smoke -- live`.",
   "n": 56
  }
 ]
};
const KOD_MJ_README = {
 "file": "README.md",
 "tag": "m12-dars-03-done",
 "lines": [
  {
   "t": "## Real vaqt",
   "n": 103
  },
  {
   "t": "| Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Ekranda nima o'zgaradi |",
   "n": 105
  },
  {
   "t": "|---|---|---|---|---|",
   "n": 106
  },
  {
   "t": "| «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | `oyin-ozgardi` · sabab `qoshildi` | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi |",
   "n": 107
  },
  {
   "t": "| «8 / 10» va qo'shilganlar ro'yxati | o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | `oyin-ozgardi` · sabab `chiqdi` | hamma ulangan ilova | son va ro'yxat yangilanadi |",
   "n": 108
  },
  {
   "t": "| «Kelaman» belgilari | o'yinchi «Kelaman» ni bosadi | `oyin-ozgardi` · sabab `tasdiqladi` | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9» |",
   "n": 109
  },
  {
   "t": "| «Navbatda: N» | o'yinchi navbatga yoziladi | `oyin-ozgardi` · sabab `navbatga-yozildi` | hamma ulangan ilova | «Navbatda: 1» |",
   "n": 110
  },
  {
   "t": "| o'yinlar ro'yxati | tashkilotchi o'yin e'lon qiladi | `oyin-ozgardi` · sabab `elon-berildi` | hamma ulangan ilova | ro'yxatda yangi karta |",
   "n": 111
  },
  {
   "t": "`oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.",
   "n": 113
  },
  {
   "t": "Backend hodisani o'zgarish Database'ga yozib tugatilgandan keyin yuboradi (tranzaksiya bo'lsa — u tugagach); ilova bitta hodisadan keyin `GET /oyinlar` ni bir marta so'raydi — «O'yinlar» va «O'yin» shu javobdan o'qiydi.",
   "n": 114
  }
 ]
};
const KOD_MJ_ULANISH = {
 "file": "mobil/src/ulanish.ts",
 "tag": "m12-dars-03-done",
 "lines": [
  {
   "t": "import { useEffect, useState } from 'react';",
   "n": 1
  },
  {
   "t": "import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native';",
   "n": 2
  },
  {
   "t": "import { io, type Socket } from 'socket.io-client';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "import { API, tokenOl } from '@/api';",
   "n": 5
  },
  {
   "t": "import { oyinlarniOl } from '@/oyin';",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "// Doimiy ulanish (socket.io): ilova Backend'ga bir marta ulanadi, ulanish ochiq turadi.",
   "n": 8
  },
  {
   "t": "// Manzil — o'sha EXPO_PUBLIC_API_URL; ulanayotganda token yuboriladi (auth) — Backend uni shu paytda tekshiradi.",
   "n": 9
  },
  {
   "t": "// Hodisa oyin-ozgardi { oyinId, sabab } kelganda ilova GET /oyinlar ni bir marta qayta so'raydi —",
   "n": 10
  },
  {
   "t": "// «O'yinlar» va «O'yin» shu bitta javobdan yangilanadi (oyin.ts). Hodisa o'zgarish bo'lganini aytadi; yangi holat — Backend'dan.",
   "n": 11
  },
  {
   "t": "",
   "n": 12
  },
  {
   "t": "// Uch ulanish holati:",
   "n": 13
  },
  {
   "t": "// ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin) ·",
   "n": 14
  },
  {
   "t": "// ulanmagan — ilova urinmayapti (token yo'q yoki yaroqsiz, yoki hisobdan chiqilgan)",
   "n": 15
  },
  {
   "t": "export type UlanishHolati = 'ulangan' | 'ulanmoqda' | 'ulanmagan';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "let ulanish: Socket | null = null;",
   "n": 18
  },
  {
   "t": "let ilovaHolati: NativeEventSubscription | null = null;",
   "n": 19
  },
  {
   "t": "let holat: UlanishHolati = 'ulanmagan';",
   "n": 20
  },
  {
   "t": "const holatniKuzatuvchilar = new Set<(h: UlanishHolati) => void>();",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "function holatQoy(yangi: UlanishHolati) {",
   "n": 23
  },
  {
   "t": "  holat = yangi;",
   "n": 24
  },
  {
   "t": "  holatniKuzatuvchilar.forEach((k) => k(yangi));",
   "n": 25
  },
  {
   "t": "}",
   "n": 26
  },
  {
   "t": "",
   "n": 27
  },
  {
   "t": "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
   "n": 28
  },
  {
   "t": "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
   "n": 29
  },
  {
   "t": "function uzilishdanKeyin() {",
   "n": 30
  },
  {
   "t": "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
   "n": 31
  },
  {
   "t": "}",
   "n": 32
  },
  {
   "t": "",
   "n": 33
  },
  {
   "t": "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
   "n": 34
  },
  {
   "t": "// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.",
   "n": 35
  },
  {
   "t": "export async function ulan() {",
   "n": 36
  },
  {
   "t": "  if (ulanish) return;",
   "n": 37
  },
  {
   "t": "  const token = await tokenOl();",
   "n": 38
  },
  {
   "t": "  if (!token || ulanish) return;",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "  ulanish = io(API, { auth: { token } });",
   "n": 41
  },
  {
   "t": "  holatQoy('ulanmoqda');",
   "n": 42
  },
  {
   "t": "  ulanish.on('connect', () => {",
   "n": 43
  },
  {
   "t": "    holatQoy('ulangan');",
   "n": 44
  },
  {
   "t": "    ulanish?.on('oyin-ozgardi', () => {",
   "n": 45
  },
  {
   "t": "      qaytaSora();",
   "n": 46
  },
  {
   "t": "    });",
   "n": 47
  },
  {
   "t": "  });",
   "n": 48
  },
  {
   "t": "  ulanish.on('disconnect', uzilishdanKeyin);",
   "n": 49
  },
  {
   "t": "  ulanish.on('connect_error', uzilishdanKeyin);",
   "n": 50
  },
  {
   "t": "",
   "n": 51
  },
  {
   "t": "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
   "n": 52
  },
  {
   "t": "  let oldingi: string | null | undefined = AppState.currentState;",
   "n": 53
  },
  {
   "t": "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
   "n": 54
  },
  {
   "t": "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
   "n": 55
  },
  {
   "t": "    oldingi = yangi;",
   "n": 56
  },
  {
   "t": "  });",
   "n": 57
  },
  {
   "t": "}",
   "n": 58
  },
  {
   "t": "",
   "n": 59
  },
  {
   "t": "// Hodisadan keyin — GET /oyinlar bir marta; xato bo'lsa ekranda eski ro'yxat qoladi (pastga tortib yangilash ishlaydi)",
   "n": 60
  },
  {
   "t": "function qaytaSora() {",
   "n": 61
  },
  {
   "t": "  oyinlarniOl().catch(() => {});",
   "n": 62
  },
  {
   "t": "}",
   "n": 63
  },
  {
   "t": "",
   "n": 64
  },
  {
   "t": "// «Hisobdan chiqish»: ulanish yopiladi. Qayta kirilganda ulan() yangi token bilan yangi ulanish ochadi.",
   "n": 65
  },
  {
   "t": "export function uzil() {",
   "n": 66
  },
  {
   "t": "  ilovaHolati?.remove();",
   "n": 67
  },
  {
   "t": "  ilovaHolati = null;",
   "n": 68
  },
  {
   "t": "  ulanish?.removeAllListeners();",
   "n": 69
  },
  {
   "t": "  ulanish?.disconnect();",
   "n": 70
  },
  {
   "t": "  ulanish = null;",
   "n": 71
  },
  {
   "t": "  holatQoy('ulanmagan');",
   "n": 72
  },
  {
   "t": "}",
   "n": 73
  },
  {
   "t": "",
   "n": 74
  },
  {
   "t": "// Ekranda belgi uchun: hozirgi holat va uning o'zgarishi",
   "n": 75
  },
  {
   "t": "export function useUlanishHolati(): UlanishHolati {",
   "n": 76
  },
  {
   "t": "  const [h, setH] = useState(holat);",
   "n": 77
  },
  {
   "t": "  useEffect(() => {",
   "n": 78
  },
  {
   "t": "    holatniKuzatuvchilar.add(setH);",
   "n": 79
  },
  {
   "t": "    setH(holat);",
   "n": 80
  },
  {
   "t": "    return () => {",
   "n": 81
  },
  {
   "t": "      holatniKuzatuvchilar.delete(setH);",
   "n": 82
  },
  {
   "t": "    };",
   "n": 83
  },
  {
   "t": "  }, []);",
   "n": 84
  },
  {
   "t": "  return h;",
   "n": 85
  },
  {
   "t": "}",
   "n": 86
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nHEAD fb8b8b4 ws1-done: jonli buyurtmalar paneli — socket.io gateway (order-cha\n@nestjs/core 11.2.8\n@nestjs/websockets 11.2.8\n@nestjs/platform-socket.io 11.2.8\nsocket.io 4.8.4\nsocket.io-client 4.8.4\nWed Nov  4 08:19:08 PM +05 2026";
const KOD_OUT_01 = "# OrderBotNest serveri (PORT=3100), Nest logi — ishga tushish\n$ npm run start\nLOG [NestFactory] Starting Nest application...\nLOG [InstanceLoader] LiveModule dependencies initialized\nLOG [InstanceLoader] TelegramModule dependencies initialized\nLOG [RoutesResolver] AppController {/}:\nLOG [RouterExplorer] Mapped {/, GET} route\nLOG [RoutesResolver] AdminController {/admin}:\nLOG [RouterExplorer] Mapped {/admin, GET} route\nLOG [RouterExplorer] Mapped {/admin/orders, GET} route\nTelegram bot ulandi\nLOG [NestApplication] Nest application successfully started\n20:19:12 Server 3100-portda ishlayapti";
const KOD_OUT_02 = "# GET /admin/orders — Bobur buyurtma berishidan OLDIN va KEYIN (panel o'zi so'ramasa, yangi buyurtmani bilmaydi)\n$ curl -s http://localhost:3100/admin/orders -H 'Authorization: Bearer panel-sir'   # 1-so'rov\n[]\n\n# … 4 soniya: server logi\n20:19:16 — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)\n20:19:16 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n20:19:16 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n20:19:16 bot → 5987654321: Buyurtma #1 qabul qilindi!\n\n$ curl -s http://localhost:3100/admin/orders -H 'Authorization: Bearer panel-sir'   # 2-so'rov\n[{\"id\":1,\"status\":\"NEW\",\"total\":120000,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1}],\"created_at\":\"2026-11-04T15:19:16.857Z\"}]\n\n$ curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/admin/orders   # tokensiz\n401";
const KOD_OUT_03 = "# Tokensiz\n$ npm run live -- \"\"\n20:19:20 ulanmoqda… http://localhost:3100\n20:19:20 connect · ulangan · transport: websocket\n20:19:20 disconnect: io server disconnect · active=false → ulanmagan\n\n# Noto'g'ri token\n$ npm run live -- notogri\n20:19:20 ulanmoqda… http://localhost:3100\n20:19:20 connect · ulangan · transport: websocket\n20:19:20 disconnect: io server disconnect · active=false → ulanmagan\n\n# Server logi shu paytda ([Live] satri YO'Q — panel ulanmadi)\nLOG [InstanceLoader] LiveModule dependencies initialized\n20:19:19 Server 3100-portda ishlayapti";
const KOD_OUT_04 = "# Token bilan (.env: ADMIN_PANEL_TOKEN=panel-sir) — 3 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi\n$ npm run live\n20:19:21 ulanmoqda… http://localhost:3100\n20:19:21 connect · ulangan · transport: websocket\n20:19:24 order-changed {\"orderId\":2,\"reason\":\"new\"}\n20:19:26 order-changed {\"orderId\":2,\"reason\":\"status\"}\n\n# Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n20:19:21 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: ihTR2ZPhfzOWYIrXAAAA\n20:19:24 — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)\n20:19:24 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n20:19:24 bot (tugma javobi): Klaviatura savatga qo'shildi (1 ta).\n20:19:24 bot → 5987654321: Buyurtma #2 qabul qilindi!\n20:19:26 — admin (Jasur) #2 ni tasdiqlaydi\n20:19:26 bot → 111: Salom, Jasur! Bu CoddyCamp do'koni boti.\n20:19:26 bot (tugma javobi): #2 → ✅ Tasdiqlangan\n20:19:26 bot → 111: #2 · Bobur · 120 000 so'm · ✅ Tasdiqlangan\n20:19:26 bot → 5987654321: Buyurtmangiz #2: ✅ Tasdiqlangan\nLOG [Live] panel uzildi: ihTR2ZPhfzOWYIrXAAAA\n\n$ curl -s http://localhost:3100/admin/orders -H 'Authorization: Bearer panel-sir'   # hodisadan keyin panel so'raydigan javob\n[{\"id\":2,\"status\":\"CONFIRMED\",\"total\":120000,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1}],\"created_at\":\"2026-11-04T15:19:24.030Z\"},{\"id\":1,\"status\":\"NEW\",\"total\":120000,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1}],\"created_at\":\"2026-11-04T15:19:16.857Z\"}]";
const KOD_OUT_05 = "# Klient ochiq turadi; 3-soniyada server to'xtatiladi, 10-soniyada qayta yoqiladi\n20:19:34 — server to'xtatildi (Ctrl+C)\n20:19:41 — server qayta ishga tushirildi\n$ npm run live\n20:19:31 ulanmoqda… http://localhost:3100\n20:19:31 connect · ulangan · transport: websocket\n20:19:34 disconnect: transport close · active=true → ulanmoqda\n20:19:35 connect_error: xhr poll error · active=true → ulanmoqda\n20:19:37 connect_error: xhr poll error · active=true → ulanmoqda\n20:19:40 connect_error: xhr poll error · active=true → ulanmoqda\n20:19:45 connect · ulangan · transport: websocket";
const KOD_OUT_06 = "# Klient ochiq; server jarayoni 52 s muzlatiladi (telefon «uchish rejimi»da yoki Wi-Fi o'chganda shunga o'xshash)\n20:19:56 — server jarayoni muzlatildi (kill -STOP): ulanish uzilmaydi, lekin javob yo'q\n20:20:48 — server davom ettirildi (kill -CONT)\n$ npm run live\n20:19:54 ulanmoqda… http://localhost:3100\n20:19:54 connect · ulangan · transport: websocket\n20:20:39 disconnect: ping timeout · active=true → ulanmoqda\n20:20:48 connect · ulangan · transport: websocket\n\n# 45 s = socket.io (engine.io) standarti: pingInterval 25000 + pingTimeout 20000";
const KOD_OUT_07 = "# live.gateway.ts: client.disconnect(); dan keyingi return; olib tashlandi (dist'da) — tokensiz klient\n$ npm run live -- \"\"\n20:20:57 ulanmoqda… http://localhost:3100\n20:20:57 connect · ulangan · transport: polling\n20:20:57 disconnect: io server disconnect · active=false → ulanmagan\n\n# Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n20:20:56 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: MzXa4MMBOWZg86h7AAAA";
const KOD_OUT_08 = "# ws1-start (= cicd2-done): serverda gateway yo'q — klient (ws1-done dagi live-client.js)\n$ npm run live\n20:21:02 ulanmoqda… http://localhost:3100\n20:21:02 connect_error: xhr poll error · active=true → ulanmoqda\n20:21:03 connect_error: xhr poll error · active=true → ulanmoqda\n20:21:05 connect_error: xhr poll error · active=true → ulanmoqda\n\n$ curl -s http://localhost:3100/admin\n{\"message\":\"Cannot GET /admin\",\"error\":\"Not Found\",\"statusCode\":404}";
const KOD_OUT_09 = "$ npm test -- live\nPASS src/api/live/live.gateway.spec.ts\n  LiveGateway\n    ✓ tokensiz — server ulanishni yopadi, klient qayta urinmaydi\n    ✓ noto'g'ri token — xuddi shunday yopiladi\n    ✓ to'g'ri token — ulanadi va order-changed hodisasini oladi\nPASS src/api/live/admin.controller.spec.ts\n  AdminController\n    ✓ GET /admin/orders tokensiz — 401\n    ✓ GET /admin/orders noto'g'ri token — 401\n    ✓ GET /admin/orders token bilan — 200 va ro'yxat\n    ✓ GET /admin — panel sahifasi (socket.io klienti bilan)\nTest Suites: 2 passed, 2 total\nTests:       7 passed, 7 total\nSnapshots:   0 total\nTime:        1.45 s\nRan all test suites matching live.";
const KOD_OUT_10 = "20:21:13 10a-panel-ulangan — token kiritildi, Kirish bosildi\n  belgi: Ulangan\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n20:21:15 10b-yangi-buyurtma — bot buyurtma oldi — sahifa yangilanmadi\n  belgi: Ulangan\n  [yangi] 3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:21:15\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n20:21:17 10c-holat-ozgardi — admin tasdiqladi\n  belgi: Ulangan\n  3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:21:15\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n20:21:19 10e-notogri-token — ikkinchi oyna, token «notogri»\n  belgi: Ulanmagan\n  Token noto'g'ri\n20:21:23 10d-server-ochdi — server to'xtatildi\n  belgi: Ulanmoqda…\n  3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:21:15\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n\n# server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\nLOG [Live] panel ulandi: VD6rUcHF4jJ41ZE-AAAA\n20:21:15 — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)\n20:21:15 bot → 111: 🆕 Yangi buyurtma #3 — Bobur, 120 000 so'm. /orders\n20:21:17 — admin (Jasur) #3 ni tasdiqlaydi\nLOG [Live] panel uzildi: VD6rUcHF4jJ41ZE-AAAA";
const KOD_OUT_11A = "# To'g'ri panel: () => yukla() — hodisadan keyin ro'yxat qayta so'raladi\n$ grep -n \"order-changed\" public/admin.html\n90:    ulanish.on('order-changed', () => yukla());\n\n# brauzer (headless Chrome)\n20:35:41 panel ochildi · belgi: Ulangan\nOLDIN:\n  Hali buyurtma yo'q\n20:35:48 15 s gacha kutildi — ro'yxat O'ZGARDI:\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:35:45\n\n# o'sha paytda terminal klienti (npm run live)\n20:35:37 ulanmoqda… http://localhost:3100\n20:35:37 connect · ulangan · transport: polling\n20:35:37 transport: websocket\n20:35:46 order-changed {\"orderId\":1,\"reason\":\"new\"}\n20:35:48 order-changed {\"orderId\":1,\"reason\":\"status\"}";
const KOD_OUT_11B = "# Buzilgan panel: () => yukla (qavssiz) — funksiya chaqirilmaydi, faqat qaytariladi\n$ grep -n \"order-changed\" public/admin.html\n90:    ulanish.on('order-changed', () => yukla);\n\n# brauzer (headless Chrome)\n20:35:56 panel ochildi · belgi: Ulangan\nOLDIN:\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:35:45\n20:36:14 15 s gacha kutildi — ro'yxat O'ZGARMADI:\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:35:45\n\n# o'sha paytda terminal klienti (npm run live)\n20:35:54 ulanmoqda… http://localhost:3100\n20:35:54 connect · ulangan · transport: websocket\n20:36:02 order-changed {\"orderId\":2,\"reason\":\"new\"}\n20:36:04 order-changed {\"orderId\":2,\"reason\":\"status\"}";
const KOD_OUT_12 = "# ws1-done push → GitHub Actions (main, run 41856397400) — test va smoke (live bilan)\n# https://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41856397400\n\n✓ main CI · 41856397400\nTriggered via push about 1 minute ago\n\nJOBS\n✓ test in 27s (ID 126666088669)\n✓ smoke in 32s (ID 126666387866)\n\nANNOTATIONS\n\n\nsmoke: .github#2\n\nsmoke: .github#1\n\n\nFor more information about a job, try: gh run view --job=<job-id>\nView this run on GitHub: https://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41856397400\n## smoke logi (live)\n  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»\n  ✓ savat restartdan o'tdi → «Savat:»\n  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\n— live: jonli panel — tokensiz ulanish, yangi buyurtma va holat o'zgarishi\n  ✓ tokensiz ulanish — server yopdi: io server disconnect\n  ✓ yangi buyurtma → order-changed {\"orderId\":5,\"reason\":\"new\"}\n  ✓ GET /admin/orders 200 — eng yuqorida #5 · Bobur\n  ✓ admin tasdiqladi → order-changed {\"orderId\":5,\"reason\":\"status\"}\nNATIJA: 9/9 ✓";
const KOD_PANEL = [
 {
  "k": "10a",
  "t": "20:21:13",
  "note": "token kiritildi, Kirish bosildi",
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
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 },
 {
  "k": "10b",
  "t": "20:21:15",
  "note": "bot buyurtma oldi — sahifa yangilanmadi",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "3",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "20:21:15"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 },
 {
  "k": "10c",
  "t": "20:21:17",
  "note": "admin tasdiqladi",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "3",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Tasdiqlandi",
     "20:21:15"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 },
 {
  "k": "10e",
  "t": "20:21:19",
  "note": "ikkinchi oyna, token «notogri»",
  "belgi": "Ulanmagan",
  "rows": [
   {
    "msg": "Token noto'g'ri"
   }
  ]
 },
 {
  "k": "10d",
  "t": "20:21:23",
  "note": "server to'xtatildi",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "3",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Tasdiqlandi",
     "20:21:15"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 }
];
const KOD_AI_AI1 = {
 "01": "$ npx tsc --noEmit\n[chiqish kodi: 0]\n\n$ npm test\nTests:       35 passed, 35 total",
 "02": "$ npm run smoke   # haqiqiy PostgreSQL 18\n== build ==\n== vaqtinchalik baza: shop_ai1_smoke ==\nTelegram bot ulandi\n  katalogda 6 ta mahsulot\n— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)\n  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»\n  ✓ savat restartdan o'tdi → «Savat:»\n  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»\n— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor\nTelegram bot ulandi\n  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\nNATIJA: 5/5 ✓",
 "03": "# Tokensiz: ws://localhost:3100/admin/ws\n20:13:51 ulanmoqda… ws://localhost:3100/admin/ws\n20:13:51 open\n20:13:51 close 4401 bad token\n\n# Noto'g'ri token\n20:13:54 ulanmoqda… ws://localhost:3100/admin/ws?token=notogri\n20:13:54 open\n20:13:54 close 4401 bad token",
 "04": "# To'g'ri token: ws://localhost:3100/admin/ws?token=panel-sir — 2.5 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi\n20:13:57 ulanmoqda… ws://localhost:3100/admin/ws?token=panel-sir\n20:13:57 open\n20:13:57 xabar snapshot orders: 0 ta\n20:13:59 xabar order/created {\"id\":1,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"total\":120000,\"status\":\"NEW\",\"statusText\":\"🆕 Yangi\",\"createdAt\":\"2026-11-04T15:13:59.265Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n20:14:01 xabar order/updated {\"id\":1,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"total\":120000,\"status\":\"CONFIRMED\",\"statusText\":\"✅ Tasdiqlangan\",\"createdAt\":\"2026-11-04T15:13:59.265Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n",
 "stat": "17 files changed, 855 insertions(+), 10 deletions(-)"
};
const KOD_AI_AI2 = {
 "01": "$ npx tsc --noEmit\n[chiqish kodi: 0]\n\n$ npm test\nTests:       28 passed, 28 total",
 "02": "$ npm run smoke   # haqiqiy PostgreSQL 18\n== build ==\n== vaqtinchalik baza: shop_ai2_smoke ==\nTelegram bot ulandi\n  katalogda 6 ta mahsulot\n— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)\n  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»\n  ✓ savat restartdan o'tdi → «Savat:»\n  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»\n— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor\nTelegram bot ulandi\n  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\nNATIJA: 5/5 ✓",
 "03": "# Tokensiz: ws://localhost:3100/ws/orders\n20:14:23 ulanmoqda… ws://localhost:3100/ws/orders\n20:14:23 open\n20:14:23 close 1008 token\n\n# Noto'g'ri token\n20:14:26 ulanmoqda… ws://localhost:3100/ws/orders?token=notogri\n20:14:26 open\n20:14:26 close 1008 token",
 "04": "# To'g'ri token: ws://localhost:3100/ws/orders?token=panel-sir — 2.5 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi\n20:14:29 ulanmoqda… ws://localhost:3100/ws/orders?token=panel-sir\n20:14:29 open\n20:14:29 xabar snapshot orders: 0 ta\n20:14:31 xabar created {\"id\":1,\"status\":\"NEW\",\"total\":120000,\"phone\":\"+998907654321\",\"customer\":\"Bobur\",\"createdAt\":\"2026-11-04T15:14:31.271Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n20:14:33 xabar updated {\"id\":1,\"status\":\"CONFIRMED\",\"total\":120000,\"phone\":\"+998907654321\",\"customer\":\"Bobur\",\"createdAt\":\"2026-11-04T15:14:31.271Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n",
 "stat": "15 files changed, 512 insertions(+), 7 deletions(-)"
};
const KOD_PROMPT1 = "OrderBotNest'ga do'kon admini uchun jonli buyurtmalar paneli kerak: bot yangi buyurtma olganda yoki admin buyurtma holatini o'zgartirganda, brauzerdagi panel sahifani yangilamasdan o'zi yangilansin. WebSocket bilan qilib ber.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), ws1-done tegida jonli panel bor: src/api/live/live.gateway.ts (socket.io, order-changed { orderId, reason }), src/api/live/admin.controller.ts (GET /admin/orders, Bearer token), public/admin.html. Vazifa: 1) panelda CANCELLED holatidagi buyurtma qatori qizil fonli bo'lsin; 2) panel tepasida bugungi buyurtmalar soni chiqsin (GET /admin/orders javobidan hisoblang). Shartlar: socket.io qolsin (xom ws emas); token manzilga yozilmasin (faqat auth va Authorization sarlavhasi); hodisa tarkibi o'zgarmasin ({ orderId, reason }, buyurtma ma'lumoti hodisaga qo'shilmasin); mijoz ismi esc() bilan qolsin; src/api/order/ va src/api/telegram/ ga tegma. Javobda: o'zgargan fayllar ro'yxati va npm test natijasi.";
const KOD = { GATEWAY: KOD_GATEWAY, TOKEN: KOD_TOKEN, CTRL: KOD_CTRL, MODULE: KOD_MODULE, TG: KOD_TG, TGMOD: KOD_TGMOD, HTML: KOD_HTML, CLIENT: KOD_CLIENT, ENV: KOD_ENV, README: KOD_README, MJ_README: KOD_MJ_README, MJ_ULANISH: KOD_MJ_ULANISH, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09, '10': KOD_OUT_10, '11a': KOD_OUT_11A, '11b': KOD_OUT_11B, '12': KOD_OUT_12 }, PANEL: KOD_PANEL, AI: { ai1: KOD_AI_AI1, ai2: KOD_AI_AI2 }, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2 };

// ============================================================
//  WebSocket-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-matn.py (manba: 19-WS1-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Do'kon admini kompyuterda panelni ochib qo'yadi: bot buyurtma olsa, yangi qator sahifani yangilamasdan o'zi paydo bo'ladi — bugun shuni qilamiz",
  "seg": [
   [
    "a",
    "Bot buyurtma oladi — <b>panel sahifani yangilamasdan o'zi ko'rsatadi</b>",
    "Assalomu alaykum. OrderBotNest'da hozir admin yangi buyurtmani faqat Telegram xabaridan biladi. Bugun do'kon uchun jonli panel qilamiz: kompyuterda ochiq turadigan sahifa. Mijoz botda buyurtma bersa, panelda yangi qator o'zi paydo bo'ladi. Ekranda dars oxiridagi natija, haqiqiy brauzerdan."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: so'rov–javob, doimiy ulanish va socket.io",
    "Avval umumiy tushuncha: oddiy so'rov–javob bilan panel nega o'zi yangilanmaydi, doimiy ulanish nima va socket.io nima qiladi. Keyin serverda gateway yozamiz: ulanishlarni qabul qiladigan klass, token bilan."
   ],
   [
    "c",
    "Keyin <b>hodisa, panel sahifasi va uch ulanish holati</b>; oxirida AI va sinf",
    "Uchinchi bosqichda hodisani yuboramiz va panel sahifasini o'qiymiz. To'rtinchisida server o'chsa yoki javob bermasa panel nima ko'rsatishini ko'ramiz. Beshinchisida ikki AI yozgan panelni haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>TgPg darsidagi bot token va Postgres</b>",
    "Dars olti bosqich, uchta amaliyot. Telegraf darsida yaratgan bot tokeningiz va Postgres bazangiz kerak bo'ladi: panelni o'z telefoningizdan buyurtma berib sinaysiz. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Oddiy HTTP'da server faqat so'ralganda javob beradi: panel so'ramasa, Bobur bergan buyurtmani bilmaydi — ekran eski qoladi",
  "seg": [
   [
    "a",
    "Panel <b><code>GET /admin/orders</code> so'radi — bo'sh</b>; keyin Bobur botda buyurtma berdi",
    "Bizda oddiy yo'l bor: get admin orders, token bilan. Panel so'radi, javob bo'sh ro'yxat. Shu paytda mijoz Bobur botda buyurtma berdi: bot buyurtma bir qabul qilindi dedi. Panel buni biladimi? Yo'q, u faqat so'raganda javob oladi."
   ],
   [
    "b",
    "Ikkinchi so'rovda <b>buyurtma bor</b> — lekin panel o'zi so'ramaguncha ekran eski edi",
    "Ikkinchi so'rov: endi ro'yxatda birinchi buyurtma, Bobur, Klaviatura. Ma'lumot bazada birinchi so'rovdan keyin darhol paydo bo'lgan, lekin panel so'ramaguncha ekran eski turdi. So'rov–javobda server o'zi gapira olmaydi."
   ],
   [
    "c",
    "Ikki yo'l: <b>har necha soniyada qayta so'rash (polling)</b> yoki doimiy ulanish",
    "Ikki yo'l bor. Birinchisi: panel har uch soniyada qayta so'raydi, buni polling deyishadi. Oddiy, lekin ko'pincha javob o'zgarmagan bo'ladi va kechikish qoladi. Ikkinchisi: panel bir marta ulanadi, ulanish ochiq turadi, server o'zgarish bo'lganda o'zi xabar beradi."
   ],
   [
    "d",
    "Xulosa: so'rov–javobda <b>server o'zi gapirmaydi</b>; jonli panel uchun doimiy ulanish kerak",
    "Xulosa: oddiy HTTP'da server faqat so'ralganda javob beradi, tokensiz so'rovga esa to'rt yuz bir. Panel o'zi yangilanishi uchun server o'zi gapira olishi kerak. Buning uchun doimiy ulanish, keyingi ekranda uning kutubxonasi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "socket.io — doimiy ulanish kutubxonasi: avval oddiy HTTP so'rovlar (polling), keyin WebSocket'ga o'tadi; server va klient istalgan payt hodisa yuboradi",
  "seg": [
   [
    "a",
    "socket.io klienti ulanadi: <b>avval <code>polling</code>, bir lahzada <code>websocket</code></b>",
    "OrderBotNest'da buning uchun socket.io ishlatamiz. Terminal klientini ishga tushirdik: npm run live. Avval ulanmoqda, keyin connect, transport polling: oddiy HTTP so'rovlar. Bir lahzadan keyin transport websocket: doimiy ulanishga o'tdi. Agar WebSocket yopiq tarmoq bo'lsa, polling'da qoladi va baribir ishlaydi."
   ],
   [
    "b",
    "Bitta port: <b>HTTP yo'llari ham, WebSocket ham <code>3100</code>da</b> — alohida server yo'q",
    "Server logiga qarang: admin va admin orders yo'llari, va server uch ming bir yuz portida. WebSocket ham shu portda, alohida server kerak emas. Nest'da buni gateway qiladi, ikkinchi bosqichda yozamiz."
   ],
   [
    "c",
    "Hodisa — <b>nomi va kichik ma'lumot</b>: <code>order-changed</code>, qaysi buyurtma va nega",
    "Doimiy ulanishda xabar hodisa deyiladi: nomi va kichik ma'lumot. Bizda bitta hodisa: order changed, ichida buyurtma raqami va sabab: yangi yoki holat. Panel uni tinglaydi va ro'yxatni qayta so'raydi."
   ],
   [
    "d",
    "Xulosa: serverda <b>gateway bo'lmasa, klient cheksiz <code>xhr poll error</code></b> — WebSocket o'zi paydo bo'lmaydi",
    "Xulosa: socket.io ikki tomon: serverda gateway, klientda kutubxona. Darsning boshlang'ich tegida gateway yo'q: klient cheksiz xhr poll error, admin sahifasi to'rt yuz to'rt. Endi gateway'ni yozamiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · gateway va token",
  "title": "LiveGateway: har yangi ulanishda handleConnection — tokenni tekshiradi; noto'g'ri bo'lsa disconnect() va return; to'g'ri bo'lsa log yozadi",
  "seg": [
   [
    "a",
    "<code>src/api/live/live.gateway.ts</code>: <b><code>@WebSocketGateway()</code> — HTTP bilan bitta portda</b>",
    "OrderBotNest papkangizda src, api, live papkasini oching, live gateway ts fayli. Klass ustida WebSocket gateway dekoratori: Nest bu klassni ulanishlarni qabul qiladigan joy qiladi, HTTP bilan bitta portda. Ichida WebSocket server maydoni: hamma ulangan panellar shu orqali."
   ],
   [
    "b",
    "<code>handleConnection</code>: <b><code>handshake.auth.token</code> noto'g'ri — <code>disconnect()</code> va <code>return</code></b>",
    "Handle connection har yangi ulanishda chaqiriladi. Birinchi ish: handshake auth token, panel ulanayotganda yuborgan token. Noto'g'ri bo'lsa client disconnect, ya'ni server ulanishni yopadi, va return. To'g'ri bo'lsa client data admin true va log: panel ulandi."
   ],
   [
    "c",
    "Token qoidasi <b>bitta joyda: <code>isAdminToken</code></b> — <code>.env</code> dagi <code>ADMIN_PANEL_TOKEN</code>, bo'sh ham rad",
    "Tokenni tekshirish alohida faylda: admin token ts, is admin token funksiyasi. U env'dagi admin panel tokeni bilan solishtiradi, bo'sh tokenni ham rad etadi. Bir qoida ikki joyda ishlaydi: WebSocket ulanishida va get admin orders so'rovida."
   ],
   [
    "d",
    "Xulosa: token <b>ulanish ochilayotganda</b> tekshiriladi; <code>orderChanged</code> — hamma ulangan panelga hodisa",
    "Xulosa: token bir marta, ulanish ochilayotganda tekshiriladi, keyingi hodisalarda qayta emas. Gateway'ning ikkinchi ishi order changed funksiyasi: server emit, hamma ulangan panelga hodisa. Live module'ni telegram module'ga ulaymiz, bot shu funksiyani chaqiradi."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "npm run live -- \"\" — tokensiz ulanamiz. Gateway disconnect() qiladi. Terminal klienti nima yozadi?",
  "q": "Gateway'ni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Terminal klientini tokensiz ishga tushirdik. Gateway tokenni rad etadi va disconnect qiladi. Klient terminalida nima chiqadi? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish avval ochiladi, chunki token handle connection ichida, ulanish ochilgandan keyin tekshiriladi. Shuning uchun bir lahza connect, keyin io server disconnect, active false: server yopgan ulanishga klient o'zi qayta ulanmaydi. Demak, bu holatda panel belgisi ulanmagan, sabab token.",
  "okShort": "Bir lahza <code>connect</code> → <code>io server disconnect</code>, <code>active=false</code> — server yopdi, klient urinmaydi.",
  "hint": "Token qachon tekshiriladi — ulanish ochilishidan oldinmi, keyinmi? Kim yopdi — server yoki tarmoq?",
  "demak": "<code>io server disconnect</code> — server yopdi (token); klient qayta urinmaydi — «Ulanmagan».",
  "correct": 1,
  "opts": [
   "Faqat connect_error — ulanish umuman ochilmaydi, klient qayta urinaveradi",
   "Bir lahza connect, keyin io server disconnect — klient qayta urinmaydi",
   "ulanmoqda — klient har 3 soniyada token bilan qayta ulanishga urinadi",
   "connect va ulanish ochiq qoladi, faqat hodisalar kelmaydi"
  ],
  "wrong": {
   "0": "Ulanish ochiladi: token ochilgandan keyin handleConnection da tekshiriladi.",
   "2": "Server yopgan ulanishga socket.io o'zi qayta ulanmaydi — active=false.",
   "3": "disconnect() ulanishni yopadi — ochiq qolmaydi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · buzamiz",
  "title": "disconnect() dan keyin return yo'q: klient baribir yopildi, lekin server logi «panel ulandi» deb yozdi — log endi ishonchsiz",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>return;</code> ustiga bosing",
    "Gateway to'g'ri ishlaydi: tokensiz klient yopiladi, logda hech narsa yo'q. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: live gateway ts faylida client disconnect'dan keyingi return satri yonib turibdi, ustiga bosing: satr o'chadi.",
    "<b>live.gateway.ts</b>dagi <b><code>return;</code></b> ustiga bosing — <code>client.disconnect();</code> dan keyingi satr o'chadi."
   ],
   [
    "a",
    "Buzildi: <b><code>client.disconnect();</code> dan keyingi <code>return;</code> yo'q</b>",
    "Return satrini o'chirdingiz. Kichik o'zgarish, kod kompilyatsiya bo'ladi. Tokensiz klient bilan sinaymiz: npm run live, ikki qo'shtirnoq."
   ],
   [
    "b",
    "Klient: <b>o'sha natija — <code>io server disconnect</code></b>; ulanish baribir yopildi",
    "Klient terminali o'sha natijani ko'rsatadi: bir lahza connect, keyin io server disconnect, ulanmagan. Disconnect ishladi, ulanish yopildi. Klient tomondan qaraganda hech narsa o'zgarmadi."
   ],
   [
    "c",
    "Server logi: <b><code>panel ulandi</code></b> — rad etilgan klient uchun; to'g'ri kodda bu satr yo'q",
    "Lekin server logiga qarang: Live, panel ulandi. Rad etilgan, tokensiz klient uchun. To'g'ri kodda, uchinchi tajribada, bu satr umuman yo'q edi. Endi log yolg'on gapiryapti: kim ulangani haqida unga ishonib bo'lmaydi."
   ],
   [
    "d",
    "Demak, sabab: <b><code>disconnect()</code> funksiyadan chiqmaydi</b> — keyingi satrlar baribir bajariladi",
    "Demak, sabab bitta: disconnect ulanishni yopadi, lekin funksiyadan chiqmaydi. Return bo'lmasa keyingi satrlar baribir bajariladi: admin belgisi qo'yiladi, log yoziladi. Keyinroq shu yerga xona yoki ruxsat qo'shilsa, rad etilgan klient ularni oladi. Return'ni tiklaymiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "ws1-done tegida serverni ishga tushiring, terminal klienti bilan token, noto'g'ri token va tokensiz ulaning, server logini o'qing",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>ws1-done</code> tegi</b>, <code>.env</code> ga panel tokeni, server va klient",
    "Endi navbat sizga. OrderBotNest papkangizda ws1 done tegiga o'tasiz, env fayliga admin panel tokenini yozasiz, serverni va terminal klientini ishga tushirasiz. Ikkita terminal kerak: biri server, biri klient. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>teg, <code>npm install</code>, <code>.env</code>, <code>npm run start:dev</code></b> — logda <code>/admin</code> yo'llari",
    "Birinchi qadamda git fetch va checkout, keyin npm install: yangi paketlar bor. Ikkinchisida env'ga admin panel token qatorini qo'shasiz, o'zingiz o'ylagan so'z, va npm run start dev. Logda admin yo'llari va server porti chiqishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b>ikkinchi terminalda <code>npm run live</code></b> — token, noto'g'ri, tokensiz; isbot — server logidagi satr",
    "Uchinchi qadamda ikkinchi terminalda npm run live: connect, websocket, server logida panel ulandi. To'rtinchisida noto'g'ri token va tokensiz: io server disconnect. Isbot maydoniga server logidagi panel ulandi satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz serverning doimiy ulanishini terminaldan tekshira olasiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout ws1-done",
     "npm install"
    ],
    "exp": "added … packages"
   },
   {
    "t": "Server",
    "cmds": [
     ".env ga ADMIN_PANEL_TOKEN=<o'z so'zingiz>",
     "npm run start:dev"
    ],
    "exp": "Mapped {/admin/orders, GET} · Server 3000-portda ishlayapti"
   },
   {
    "t": "Klient",
    "cmds": [
     "ikkinchi terminal: npm run live"
    ],
    "exp": "connect · ulangan · transport: websocket · serverda [Live] panel ulandi"
   },
   {
    "t": "Rad",
    "cmds": [
     "npm run live -- notogri",
     "npm run live -- \"\""
    ],
    "exp": "disconnect: io server disconnect · active=false → ulanmagan"
   }
  ],
  "proof": {
   "label": "Server logidagi «panel ulandi» satri",
   "placeholder": "masalan: LOG [Live] panel ulandi: -GKZthhgExVB6fHnAAAA",
   "re": "panel ulandi",
   "flags": "i",
   "wrong": "Server terminalida [Live] panel ulandi: … satrini toping va nusxalang."
  },
  "trouble": [
   [
    "connect_error: xhr poll error cheksiz",
    "server ishlamayapti yoki port boshqa — server terminalini tekshiring; boshqa port bo'lsa LIVE_URL=http://localhost:<port> npm run live"
   ],
   [
    "to'g'ri token bilan ham io server disconnect",
    ".env dagi token bilan klientdagi farq qiladi yoki server .env ni o'qimadi — serverni qayta ishga tushiring"
   ],
   [
    "Cannot find module 'socket.io-client'",
    "npm install qilinmagan (yangi paketlar)"
   ],
   [
    "BOT_TOKEN topilmadi",
    ".env da bot tokeni yo'q — Telegraf darsidagi tokenni yozing"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · hodisa va panel",
  "title": "Bot buyurtmani bazaga yozib bo'lgach orderChanged(order.id, 'new'); admin holatni o'zgartirgach — 'status'. Hodisada ro'yxat yo'q: panel qayta so'raydi",
  "seg": [
   [
    "a",
    "<code>telegram.service.ts</code>: <b><code>await this.orders.place(…)</code> tugagach</b> — <code>orderChanged(order.id, 'new')</code>",
    "Src, api, telegram papkasidagi telegram service ts faylini oching, place order funksiyasi. Avval await orders place: tranzaksiya, buyurtma bazaga yozildi. Faqat shundan keyin live order changed, buyurtma raqami va new. Await tufayli hodisa bazadagi buyurtmadan oldin ketmaydi."
   ],
   [
    "b",
    "Admin tugmasi: <b><code>setStatus</code> tugagach — <code>'status'</code></b> — bot kodi o'zgarmadi, bitta satr qo'shildi",
    "Admin holat tugmasini bosganda ham shu qolip: await orders set status, keyin order changed, status sababi bilan. Bot kodining qolgan qismi o'zgarmadi, ikki joyga bittadan satr qo'shildi. Mijozga Telegram xabari avvalgidek boradi."
   ],
   [
    "c",
    "Hodisada <b>faqat <code>orderId</code> va <code>reason</code></b> — panel yangi ro'yxatni <code>GET /admin/orders</code> dan so'raydi",
    "Hodisa ichida nima bor? Faqat buyurtma raqami va sabab, ro'yxat ham, mijoz telefoni ham yo'q. Panel hodisani olgach get admin orders'ni qayta so'raydi, token bilan. Ma'lumotning manbai bitta: baza. O'quvchi darsida bu konvert deyiladi."
   ],
   [
    "d",
    "Xulosa: hodisa <b>«nimadir o'zgardi»</b> deydi; ma'lumot — token bilan, so'rovda",
    "Xulosa: hodisa tranzaksiya tugagach yuboriladi va faqat nimadir o'zgardi deydi. Ma'lumot token bilan himoyalangan so'rovda keladi. Admin controller'da list funksiyasi: token tekshiriladi, oxirgi yigirma buyurtma, faqat kerakli maydonlar. Endi panel sahifasini ochamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · hodisa va panel",
  "title": "public/admin.html: socket.io klienti serverning o'zidan; io({ auth: { token } }) — ulanish; uch holat; order-changed kelsa yukla()",
  "seg": [
   [
    "a",
    "<code>public/admin.html</code>: <b>socket.io klienti <code>/socket.io/socket.io.js</code> — serverning o'zi beradi</b>",
    "Public papkasidagi admin html faylini oching. Oddiy HTML sahifa, kutubxona alohida o'rnatilmaydi: socket io js faylini serverning o'zi beradi, shu manzildan. Sahifa get admin, ya'ni admin controller'ning page funksiyasi orqali ochiladi."
   ],
   [
    "b",
    "<code>ulan()</code>: <b><code>io({ auth: { token } })</code></b> — token manzilda emas, ulanish ma'lumotida",
    "Ulan funksiyasi: io, auth, token. Token manzil satriga yozilmaydi, ulanish ochilayotgan paytdagi ma'lumotda ketadi: gateway uni handshake auth'dan o'qiydi. Connect bo'lsa belgi ulangan, disconnect bo'lsa active'ga qarab ulanmoqda yoki ulanmagan."
   ],
   [
    "c",
    "Tinglovchi: <b><code>ulanish.on('order-changed', () =&gt; yukla())</code></b> — hodisadan keyin qayta so'rash",
    "Eng muhim satr: ulanish on, order changed, yukla. Hodisa kelganda yukla funksiyasi chaqiriladi: get admin orders, yangi ro'yxat. Yangi qator sariq bo'ladi: id oldingi eng kattasidan katta bo'lsa. Ro'yxat har doim bazadan, hodisadan emas."
   ],
   [
    "d",
    "Xulosa: mijoz ismi Telegram'dan keladi — <b><code>esc()</code> bilan matn sifatida</b> qo'yiladi",
    "Xulosa: panel uch ish qiladi: ulanadi, tinglaydi, qayta so'raydi. Va bitta xavfsizlik qoidasi: mijoz ismi Telegram'dan keladi, ichida HTML bo'lishi mumkin. Esc funksiyasi uni matnga aylantiradi, sahifada kod bo'lib ishlamaydi. Endi haqiqiy oqimni ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · hodisa va panel",
  "title": "Panel ochiq; Bobur botda buyuradi — yangi qator o'zi chiqadi; admin tasdiqlaydi — holat o'zi o'zgaradi; terminal klienti ham ikkala hodisani ko'radi",
  "seg": [
   [
    "a",
    "Panel ochiq, belgi <b>«Ulangan»</b>; ro'yxatda oldingi buyurtmalar",
    "Endi hammasini birga ko'ramiz. Brauzerda admin sahifasi, token kiritildi, belgi ulangan, ro'yxatda oldingi buyurtmalar. Bu haqiqiy brauzer, haqiqiy server va baza. Telegram o'rniga smoke'dagi usul: bot kodi haqiqiy, xabar ichkaridan beriladi."
   ],
   [
    "b",
    "Bobur buyurtma berdi — <b>yangi qator sariq, sahifa yangilanmadi</b>",
    "Bobur botda Klaviatura buyurdi. Panelda eng yuqorida yangi qator, sariq rangda: yangi. Sahifa qayta ochilmadi, hech kim tugma bosmadi. Server hodisa yubordi, panel ro'yxatni qayta so'radi."
   ],
   [
    "c",
    "Admin tasdiqladi — <b>holat «Tasdiqlandi»</b>; terminal klienti ham ikki hodisani ko'rdi",
    "Admin Jasur botda tasdiqlash tugmasini bosdi. Panelda shu qatorning holati tasdiqlandi bo'ldi. O'ngda terminal klienti: ikkita order changed, birinchisi new, ikkinchisi status. Server logida esa bot xabarlari va panel ulandi satri."
   ],
   [
    "d",
    "Xulosa: bu oqim <b>lentada ham tekshiriladi</b> — smoke <code>live</code>, GitHub'da 9/9",
    "Xulosa: bot, tranzaksiya, hodisa, panel, qayta so'rash. Shu oqim smoke'ga ham qo'shildi: npm run smoke live. CI/CD darsidagi lentada smoke job Postgres bilan uni har push'da yurgizadi: GitHub'da to'qqizdan to'qqiz. Endi bitta xatoni o'zingiz topasiz."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu panelda belgi «Ulangan», terminal klienti order-changed ni oladi, lekin brauzerda yangi qator chiqmaydi. Sababchi satrni toping",
  "q": "Panel kodini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu panelda belgi ulangan, terminal klienti hodisani oladi, lekin brauzerda yangi qator chiqmaydi. Bo'lakda bitta satr funksiyani chaqirmaydi, faqat qaytaradi. O'sha satrni bosing.",
  "ok": "To'g'ri. Strelka funksiya yukla'ni qaytaradi, lekin chaqirmaydi: qavs yo'q. Hodisa keladi, tinglovchi ishlaydi, get so'rovi ketmaydi, ro'yxat eski qoladi. Brauzerda o'n besh soniya kutdik, ro'yxat o'zgarmadi, terminal klienti esa ikkala hodisani ko'rdi. Demak, hodisa kelsa-yu ekran o'zgarmasa, tinglovchi ichini tekshiring.",
  "okShort": "<code>() =&gt; yukla</code> — funksiya qaytariladi, chaqirilmaydi. Hodisa keladi, <code>GET</code> ketmaydi.",
  "hint": "Qaysi satrda funksiya nomidan keyin qavs yo'q?",
  "task": "Qoida: hodisa kelganda ro'yxatni qayta so'raydigan funksiya <b>chaqirilishi</b> kerak. Bu bo'lakda bitta satr funksiyani chaqirmaydi, faqat qaytaradi. <b>O'sha satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "Brauzerda /admin ni oching, telefondan botda buyurtma bering — panel o'zi yangilanadimi; keyin /orders dan tasdiqlang",
  "seg": [
   [
    "a",
    "Endi siz: <b>brauzerda panel, telefonda bot</b> — haqiqiy Telegram bilan",
    "Endi navbat sizga. Server ishlab turibdi. Brauzerda admin sahifasini ochasiz, telefoningizda botga buyurtma berasiz va panelning o'zi yangilanishini ko'rasiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>localhost:3000/admin</code>, token</b> — belgi «Ulangan»; botda buyurtma — yangi qator",
    "Birinchi qadamda brauzerda localhost uch ming admin, tokenni kiritasiz: belgi ulangan, ro'yxat chiqadi. Ikkinchisida telefoningizdan botga start, katalog, mahsulot va buyurtma. Panelda yangi qator sariq bo'lib chiqishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b><code>/orders</code> dan tasdiqlang</b> — holat o'zgaradi; <code>npm run smoke -- live</code>; isbot — smoke natijasi",
    "Uchinchi qadamda botda orders va tasdiqlash: paneldagi holat o'zgaradi. To'rtinchisida npm run smoke live: Telegram'siz o'sha oqim, to'rt band. Isbot maydoniga smoke'ning natija satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz botingizga jonli sayt sahifasini ulagansiz va uni o'zingiz sinagansiz."
   ]
  ],
  "steps": [
   {
    "t": "Panel",
    "cmds": [
     "brauzer: http://localhost:3000/admin → token → «Kirish»"
    ],
    "exp": "belgi «Ulangan», ro'yxat"
   },
   {
    "t": "Buyurtma",
    "cmds": [
     "telefon: botga /start → /catalog → mahsulot → /cart → «✅ Buyurtma berish»"
    ],
    "exp": "panelda yangi sariq qator"
   },
   {
    "t": "Tasdiq",
    "cmds": [
     "botda /orders → «✅ Tasdiqlash» (ADMIN_TELEGRAM_IDS da o'z id'ingiz)"
    ],
    "exp": "panelda «Tasdiqlandi»"
   },
   {
    "t": "Smoke",
    "cmds": [
     "npm run smoke -- live"
    ],
    "exp": "NATIJA: 4/4 ✓"
   }
  ],
  "proof": {
   "label": "npm run smoke -- live natija satri",
   "placeholder": "masalan: NATIJA: 4/4 ✓",
   "re": "NATIJA:\\s*4\\/4",
   "flags": "",
   "wrong": "npm run smoke -- live oxiridagi NATIJA: … satrini qo'ying — to'rt band."
  },
  "trouble": [
   [
    "Panelda «Token noto'g'ri»",
    "kiritgan so'z .env dagi ADMIN_PANEL_TOKEN bilan bir xil emas"
   ],
   [
    "Belgi «Ulanmoqda…» o'zgarmaydi",
    "server ishlamayapti yoki boshqa portda — sahifani o'sha portdan oching"
   ],
   [
    "Buyurtma Telegram'da bor, panelda yangi qator yo'q",
    "sahifa eski (ws1-done dan oldingi) — git checkout ws1-done, server qayta; konsolda xato bormi (F12)"
   ],
   [
    "/orders — «Bu buyruq faqat admin uchun»",
    ".env dagi ADMIN_TELEGRAM_IDS da o'z Telegram id'ingiz yo'q"
   ],
   [
    "smoke: baza ulanmagan — live faqat PostgreSQL bilan",
    ".env da DATABASE_URL yo'q"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · ulanish holati",
  "title": "Panel belgisi uch holatda: hodisalar keladi · server javob bermayapti, klient o'zi urinmoqda · server yopdi, klient urinmaydi — farqni active beradi",
  "seg": [
   [
    "a",
    "«Ulangan» — <b>ulanish ochiq, hodisalar keladi</b>; ro'yxat yangi",
    "Paneldagi belgining uch holati bor. Birinchisi ulangan: ulanish ochiq, hodisalar keladi, ro'yxat yangi. Admin ekranga qarab ishonsa bo'ladi."
   ],
   [
    "b",
    "«Ulanmoqda…» — <b><code>active=true</code></b>: server javob bermayapti, klient o'zi qayta urinmoqda",
    "Ikkinchisi ulanmoqda. Ulanish uzildi, lekin socket.io o'zi qayta urinmoqda: active true. Sabab server o'chgani, internet uzilgani yoki server javob bermayotgani. Ro'yxat ekranda qoladi, lekin eskirgan bo'lishi mumkin."
   ],
   [
    "c",
    "«Ulanmagan» — <b><code>active=false</code></b>: server ulanishni yopdi (token), klient urinmaydi",
    "Uchinchisi ulanmagan: active false. Server ulanishni o'zi yopgan, bizda token noto'g'ri bo'lganda. Klient qayta urinmaydi, foydalanuvchi tokenni tuzatishi kerak. Panel buni token noto'g'ri deb ham yozadi."
   ],
   [
    "d",
    "Xulosa: holatni <b><code>disconnect</code> va <code>active</code></b> beradi; panelda bir satr",
    "Xulosa: uch holatni ikki narsa ajratadi: uzilish sababi va active. Panelda bu bitta satr: disconnect bo'lsa, active bo'lsa ulanmoqda, bo'lmasa ulanmagan. Endi server o'chib-yonganini haqiqiy terminalda ko'ramiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ulanish holati",
  "title": "Server to'xtadi: transport close → klient har bir necha soniyada xhr poll error; server yondi — klient o'zi ulandi, hech kim hech narsa bosmadi",
  "seg": [
   [
    "a",
    "Server to'xtadi: <b><code>transport close</code>, <code>active=true</code></b> — belgi «Ulanmoqda…»",
    "Klient ulangan turibdi. Server terminalida Ctrl C, server to'xtadi. Klient darhol: disconnect, transport close, active true, ulanmoqda. Ulanishni tarmoq uzdi, server emas, shuning uchun klient taslim bo'lmaydi."
   ],
   [
    "b",
    "Qayta urinish: <b>har bir necha soniyada <code>xhr poll error</code></b> — oraliq tobora uzayadi",
    "Keyin har bir necha soniyada connect error, xhr poll error: klient polling bilan urinadi, server yo'q. Vaqtlarga qarang: oraliq asta uzayadi, klient serverni bombardimon qilmaydi. Panelda shu vaqt ulanmoqda."
   ],
   [
    "c",
    "Server yondi — <b>klient o'zi ulandi</b>: polling, keyin websocket",
    "Serverni qayta ishga tushirdik. Bir necha soniyadan keyin klient o'zi connect, ulangan, avval polling, keyin websocket. Hech kim sahifani yangilamadi, hech narsa bosmadi. Bu socket.io'ning tayyor xizmati."
   ],
   [
    "d",
    "Xulosa: <b>qayta ulanish o'zi</b> bo'ladi; lekin uzilish paytidagi hodisa — keyingi darsda",
    "Xulosa: server o'chib-yonsa, panel o'zi qayta ulanadi. Lekin bir savol qoldi: server o'chiq paytida buyurtma tushsa, panel uni ko'radimi? Bu keyingi WebSocket darsining mavzusi, uzilishda nima yo'qoladi. Endi qiyinroq holat: server javob bermaydi, lekin uzilmaydi."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Server jarayonini muzlatamiz: ulanish uzilmaydi, javob ham yo'q — klient 43 soniya «ulangan» deb turadi, keyin ping timeout; sabab — 25 + 20 soniya qoidasi",
  "seg": [
   [
    "a",
    "Muzlatamiz: <b>ulanish ochiq, lekin server javob bermaydi</b> — telefon uchish rejimiga o'xshash",
    "Endi qiyinroq holat. Server jarayonini muzlatamiz: kill minus STOP. Ulanish uzilmaydi, lekin server hech narsaga javob bermaydi. Hayotda bu telefon uchish rejimida, Wi-Fi o'chganda yoki server qotib qolganda bo'ladi."
   ],
   [
    "b",
    "Klient <b>43 soniya «ulangan»</b> deb turadi — hech narsa bilmaydi",
    "Klient terminaliga qarang: hech narsa yo'q. Qirq uch soniya davomida u o'zini ulangan deb hisoblaydi. Shu vaqt panel belgisi yashil, lekin hodisalar kelmaydi. Admin ekranga ishonadi, ekran esa eskirgan."
   ],
   [
    "c",
    "Keyin <b><code>ping timeout</code></b> — socket.io har 25 s ping yuboradi, 20 s javob kutadi",
    "Keyin disconnect, ping timeout, ulanmoqda. Socket.io qoidasi: server har yigirma besh soniyada ping yuboradi va yigirma soniya javob kutadi. Javob kelmasa, ulanish o'lik deb topiladi. Shuning uchun eng uzog'i qirq besh soniya. Server davom etgach, klient darhol ulandi."
   ],
   [
    "d",
    "Demak, sabab: <b>javob yo'qligi — uzilish emas</b>; ulanish o'lganini faqat ping aniqlaydi",
    "Demak, sabab bitta: tarmoq javob bermaganda hech kim ulanish uzilganini aytmaydi. Uni faqat ping aniqlaydi, qirq besh soniyagacha kechikish bilan. Sinfda o'quvchi uchish rejimida belgi o'zgarmadi desa, kuting deng. Endi tekshirib olaylik."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Admin noutbukida Wi-Fi o'chdi: ulanish uzilmadi, lekin paket ham o'tmaydi. Panel belgisi qachon «Ulanmoqda…» bo'ladi?",
  "q": "Muzlashni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Admin noutbukida Wi-Fi o'chdi: ulanish uzilmadi, lekin hech narsa o'tmaydi. Panel belgisi qachon ulanmoqda bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish rasman uzilmagan, shuning uchun hech kim darhol aytmaydi. Server har yigirma besh soniyada ping yuboradi va yigirma soniya kutadi; javob kelmasa ping timeout, belgi ulanmoqda. Eng uzog'i qirq besh soniya. Demak, javob bermaydigan tarmoqni faqat ping aniqlaydi, kechikish bilan.",
  "okShort": "Javob bermaydigan tarmoq — <code>ping timeout</code>, 45 s gacha (25 + 20). Darhol emas.",
  "hint": "Ulanish o'lganini kim va qanday aniqlaydi? 15-ekrandagi 25 + 20 ni eslang.",
  "demak": "Javob bermaydigan tarmoqni faqat ping aniqlaydi: <code>ping timeout</code> — 45 s gacha.",
  "correct": 2,
  "opts": [
   "Darhol — brauzer Wi-Fi o'chganini sezib socket.io'ga aytadi",
   "Hech qachon — ulanish uzilmagani uchun belgi yashil qoladi",
   "45 soniyagacha — ping javobsiz qolgach ping timeout",
   "Keyingi hodisa kelganda — server xato qaytaradi"
  ],
  "wrong": {
   "0": "Brauzer har doim sezmaydi; socket.io pingga tayanadi.",
   "1": "Ping javobsiz qolsa, socket.io ulanishni o'zi uzadi — 45 s gacha.",
   "3": "Server hodisani yuboradi, xato qaytmaydi — paket shunchaki yetmaydi."
  }
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: ikki AI'ga bitta oddiy prompt — «jonli panel, WebSocket bilan»; ikkalasi ishlaydigan panel yozdi, ikkalasi bir xil yo'lni tanladi",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>panel yozdi AI, siz qabul qilasiz</b> — oddiy prompt, ishorasiz",
    "Avvalgi darslardagi kabi oxirgi bosqich AI bilan. Prompt oddiy: do'kon admini uchun jonli buyurtmalar paneli, bot buyurtma olsa yoki holat o'zgarsa, sahifa o'zi yangilansin, WebSocket bilan. Socket.io, token, hodisa tarkibi, bu so'zlar promptda yo'q."
   ],
   [
    "b",
    "Ikkalasi <b>xom <code>ws</code></b> tanladi — socket.io emas; qayta ulanishni o'zi yozdi",
    "Ikkala AI ham bir xil yo'lni tanladi: socket.io emas, xom ws kutubxonasi. Brauzerda kutubxonasiz. Ishlaydi, lekin qayta ulanish, ping, polling'ga tushish, bularni o'zi qo'lda yozgan. Shuning uchun birinchisi sakkiz yuz ellik besh satr, ikkinchisi besh yuz o'n ikki."
   ],
   [
    "c",
    "Ikkalasi tokenni o'zi qo'shdi — lekin <b>URL'da: <code>?token=</code></b>; hodisada butun buyurtma",
    "Yaxshi tomoni: promptda yo'q bo'lsa ham, ikkalasi tokenni o'zi qo'shdi, telefon raqamlari bor deb. Lekin token manzilda: savol belgisi token. Va har hodisada butun buyurtma ketadi, mijoz telefoni bilan. Ulanganda esa to'liq ro'yxat keladi."
   ],
   [
    "d",
    "Xulosa: ikkalasi <b>bazasiz, mock bilan sinagan</b> — haqiqiy bazada biz sinab ko'ramiz",
    "Xulosa: ikkala javob ham ishonchli ko'rinadi, testlari yashil. Lekin ikkalasi o'zi aytdi: Postgres yo'q edi, haqiqiy bot, baza va panel oqimi sinalmadi. Keyingi ekranda ikkalasini haqiqiy bazada, haqiqiy bot oqimi bilan sinaymiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Haqiqiy PostgreSQL bilan: ikkalasi ishladi — smoke 5/5, tokensiz yopildi, buyurtma va tasdiq keldi; to'rt joyni esa siz qaror qilasiz",
  "seg": [
   [
    "a",
    "Haqiqiy bazada: <b>ikkalasi ishladi</b> — smoke 5/5, tokensiz ulanish yopildi",
    "Ikkala nusxani haqiqiy Postgres bilan ishga tushirdik. Tsc toza, testlar yashil, smoke beshdan besh. Tokensiz ulanish yopildi: birinchisida to'rt ming to'rt yuz bir kodi, ikkinchisida bir ming sakkiz. Buni tan olamiz: AI yaxshi ishladi."
   ],
   [
    "b",
    "Bot buyurtma oldi: <b>snapshot, created, updated</b> — ichida mijoz ismi va telefoni",
    "Bot buyurtma oldi, admin tasdiqladi. Xom ws klientida uchta xabar: snapshot, nol ta; created va updated, ichida butun buyurtma: mijoz ismi, telefoni, mahsulotlar. Har ulangan panelga, har o'zgarishda. Ishlaydi, lekin telefon raqam har xabarda ketadi."
   ],
   [
    "c",
    "Farq: token <b>manzilda vs ulanish ma'lumotida</b>; hodisada <b>ma'lumot vs konvert</b>",
    "Yonma-yon qarang. Bizda token auth'da, manzilda ko'rinmaydi; AI'da savol belgisi token, manzil satrida, brauzer tarixida, server va hosting loglarida qoladi. Bizda hodisa konvert, ma'lumot token bilan so'rovda; AI'da hodisaning o'zida. Ikkala yo'l ham ishlaydi, lekin bularni siz tanlaysiz."
   ],
   [
    "d",
    "Xulosa: AI real vaqt kodiga <b>to'rt savol</b>: kutubxona · token qayerda · hodisada nima · mavjud fayllardan nima o'zgardi",
    "Xulosa, to'rt savol. Qaysi kutubxona, o'quvchi darsidagi socket.io'mi. Token qayerda, manzilda emasmi. Hodisada nima bor va uni kim oladi. Mavjud fayllardan nimasi o'zgardi: ikkalasi order service va uning testini o'zgartirgan, diff'ni o'qing. Endi tekshirib olaylik."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI paneli ws://…/ws/orders?token=panel-sir ga ulanadi. Ishlaydi, server tokenni tekshiradi. Bu yerda nima xavf?",
  "q": "AI panellarini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI paneli tokenni manzilga qo'shib ulanadi, savol belgisi token. Server uni tekshiradi, hammasi ishlaydi. Bu yerda nima xavf? Variantni tanlang.",
  "ok": "To'g'ri. Tekshiruv ishlaydi, xavf boshqa joyda: manzil ko'p joyga yoziladi. Brauzer tarixi, server va proxy loglari, hosting monitoringi, ularning hammasida token ochiq qoladi. Socket.io'da token auth bilan, ulanish ma'lumotida ketadi. Demak, maxfiy qiymat manzilga emas, sarlavha yoki ulanish ma'lumotiga yoziladi.",
  "okShort": "Manzil loglarga va tarixga yoziladi — token u yerda ochiq qoladi. <code>auth</code> / sarlavha — xavfsizroq.",
  "hint": "Manzil satridagi matn qayerlarga yozilib qoladi?",
  "demak": "Maxfiy qiymat manzilga yozilmaydi: manzil tarix va loglarga tushadi; token — <code>auth</code> yoki sarlavhada.",
  "correct": 0,
  "opts": [
   "Token manzil bilan birga brauzer tarixi va server, proxy loglarida qoladi",
   "Hech qanday — server tokenni tekshiryapti, shu yetarli",
   "WebSocket manzildagi tokenni qabul qilmaydi, ulanish yiqiladi",
   "Token manzilda bo'lsa, server uni har hodisada qayta tekshiradi va sekinlashadi"
  ],
  "wrong": {
   "1": "Tekshiruv bor, lekin token manzil bilan loglarga yoziladi — kim o'qisa, panelga kiradi.",
   "2": "Qabul qiladi — ulanish ishladi (ws1v2-ai/ai2/04); muammo xavfsizlikda.",
   "3": "Token faqat ulanishda tekshiriladi; tezlikka ta'siri yo'q."
  }
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga panelga yangi hodisa qo'shtiring — bekor qilingan buyurtma qizil bo'lsin; to'rt savol bilan qabul qiling, smoke bilan tekshiring",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>aniq shartli prompt</b> — bekor qilingan buyurtma panelda qizil",
    "Endi navbat sizga. O'z AI'ingizga panelga kichik o'zgarish qildirasiz: bekor qilingan buyurtma qatori qizil bo'lsin va panel tepasida bugungi buyurtmalar soni chiqsin. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>to'rt savol</b> — kutubxona, token, hodisa, o'zgargan fayllar",
    "Birinchi qadamda promptni berasiz. Ikkinchisida natijani to'rt savol bilan o'qiysiz: socket.io qoldimi, token manzilga chiqmadimi, hodisada faqat raqam va sababmi, git diff stat'da qaysi fayllar o'zgardi."
   ],
   [
    "c",
    "3–4-qadam: <b><code>npm test</code>, <code>npm run smoke -- live</code></b>, brauzerda bekor qiling; isbot — smoke natijasi",
    "Uchinchi qadamda npm test va npm run smoke live. To'rtinchisida brauzerda panelni ochib, botda buyurtmani bekor qilasiz: qator qizil bo'lishi kerak. Isbot maydoniga smoke'ning natija satrini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan real vaqt kodini to'rt savol bilan qabul qilasiz."
   ]
  ],
  "steps": [
   {
    "t": "Prompt",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga"
    ],
    "exp": "o'zgargan fayllar ro'yxati"
   },
   {
    "t": "To'rt savol",
    "cmds": [
     "git diff --stat — faqat public/admin.html (va kerak bo'lsa admin.controller.ts)",
     "grep -n \"io(\" public/admin.html — auth: { token }",
     "grep -n \"emit\" src/api/live/live.gateway.ts — { orderId, reason }",
     "grep -n \"esc(\" public/admin.html"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Testlar",
    "cmds": [
     "npm test",
     "npm run smoke -- live"
    ],
    "exp": "Tests: 32 passed · NATIJA: 4/4 ✓"
   },
   {
    "t": "Brauzer",
    "cmds": [
     "panel ochiq → botda /orders → «❌ Bekor»"
    ],
    "exp": "qator qizil, son yangilandi"
   }
  ],
  "proof": {
   "label": "npm run smoke -- live natija satri",
   "placeholder": "masalan: NATIJA: 4/4 ✓",
   "re": "NATIJA:\\s*4\\/4",
   "flags": "",
   "wrong": "AI o'zgartirgandan keyin npm run smoke -- live yurgizing va NATIJA: … satrini qo'ying."
  },
  "trouble": [
   [
    "git diff --stat da order.service.ts yoki telegram.service.ts",
    "AI tegmasligi kerak bo'lgan faylga tegdi — git checkout -- src/api/order src/api/telegram, shartni takrorlang"
   ],
   [
    "AI ws paketini o'rnatdi",
    "«socket.io qolsin» bandini takrorlang; git checkout -- package.json package-lock.json"
   ],
   [
    "smoke live ✗ «order-changed null»",
    "hodisa tarkibi yoki nomi o'zgargan — live.gateway.ts diff'ini o'qing"
   ],
   [
    "Qator qizil emas",
    "holat CANCELLED mi? panel ro'yxatni qayta so'radimi (F12 → Network)"
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»",
  "title": "O'quvchi darsi: Maydon Jamoa'dagi «8 / 10» — siz bugun panelda qilgan narsaning telefondagi varianti, socket.io bilan",
  "seg": [
   [
    "a",
    "m10-02 — 20 ekran: <b>Maydon Jamoa, «8 / 10»</b> — ikki telefon, biri eski son ko'rsatadi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m10-02, yigirma ekran. Misol Maydon Jamoa: futbol o'yiniga yozilish ilovasi. Ikki telefon: biri qo'shiladi, ikkinchisida eski sakkizdan o'n turadi. Siz bugun panelda ko'rgan muammo, telefonda."
   ],
   [
    "b",
    "O'quvchi ham <b>socket.io, token, konvert va uch belgi</b> — siz bilgan qoidalar",
    "O'quvchi darsidagi qoidalar sizniki bilan bir xil: socket.io, token ulanishda, konvert ichida son yo'q, ilova qayta so'raydi, va uch belgi. Faqat o'quvchida ilova telefon, server Render'da. Shuning uchun AI xom ws yozsa, o'quvchi darsi bilan to'qnashadi."
   ],
   [
    "c",
    "Bloklar: <b>og'ir joy — 10-ekran kod oynasi va birinchi amaliyot</b>",
    "Bloklar jadvaliga qarang. Og'ir joy o'ninchi ekrandagi kod oynasi va birinchi amaliyot: Backend, ilova va Render birga. Uchinchi, beshinchi, oltinchi ekranlarga ortiqcha vaqt bermang. Har blokda siz qo'shadigan narsa o'ng ustunda."
   ],
   [
    "d",
    "Xulosa: repo <b><code>m12-dars-02</code> da hodisa yo'q, <code>m12-dars-03</code> da bor</b> — o'quvchi farqni ko'rsin",
    "Xulosa: o'quvchi loyihasida ikki teg muhim. Birinchisida ulanish bor, hodisa yo'q: son o'zi o'zgarmaydi, bu xato emas. Ikkinchisida hodisa bor. Sinfda ikkalasini ko'rsating: ulanish bilan hodisa alohida narsa."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Yo'l, konvert, belgi, tinglovchi — atama bilan birga; README «Real vaqt» jadvali: OrderBotNest'da ham, Maydon Jamoa'da ham besh ustun",
  "seg": [
   [
    "a",
    "O'quvchi so'zlari: <b>ochiq yo'l — doimiy ulanish, konvert — hodisa</b>",
    "O'quvchi darsidagi so'zlar: yopiq yo'l so'rov–javob, ochiq yo'l doimiy ulanish, konvert hodisa, belgi ulanish holati, tinglovchi ulanish on. O'quvchi so'zni aytganda, siz yonida atamani ayting: konvert, ya'ni hodisa, bizda order changed."
   ],
   [
    "b",
    "README jadvali: <b>nuqta · kim nima qiladi · hodisa · kim oladi · ekranda nima</b>",
    "OrderBotNest README'sida jonli panel jadvali: real vaqt nuqtasi, kim nima qiladi, hodisa va sabab, kim oladi, panelda nima o'zgaradi. Ikki qator: yangi buyurtma va holat. O'quvchi o'z loyihasi uchun aynan shunday jadval yozadi."
   ],
   [
    "c",
    "Maydon Jamoa'da <b>besh sabab, bitta hodisa</b> — <code>oyin-ozgardi</code>",
    "Maydon Jamoa'da jadval besh qator: qo'shildi, chiqdi, tasdiqladi, navbatga yozildi, e'lon berildi. Hodisa bitta, sabablar besh. Kurs qoidasi: hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish: oyin ozgardi, order changed."
   ],
   [
    "d",
    "Xulosa: o'quvchi kodida <b>tinglovchi <code>connect</code> ichida</b> — bu keyingi darsning birinchi muammosi",
    "Xulosa va bitta ogohlantirish. O'quvchi loyihasining ulanish ts faylida hodisa tinglovchisi connect ichida qo'shiladi. Har qayta ulanishda yana bittasi qo'shiladi. Hozir ishlaydi, keyingi WebSocket darsida buni buzib ko'ramiz. Sinfda tuzatmang, belgilab qo'ying."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Belgidan va server terminalidan sabab topiladi: oltita holat, har biri o'z xabari bilan — va o'quvchi so'raydigan to'rt savol",
  "seg": [
   [
    "a",
    "Birinchi uchtasi <b>belgidan</b> taniladi: qizil, sariq-yashil, o'zgarmagan",
    "Sinfda uchraydigan olti holat. Birinchi uchtasi belgidan taniladi. Belgi bir lahza yashil, keyin qizil: token, qayta kirish. Sariqdan yashilga: server qayta yondi, normal. Uchish rejimida belgi o'zgarmadi: qirq besh soniyagacha kuting."
   ],
   [
    "b",
    "Qolgan uchtasi: <b>son o'zgarmadi, Render cho'zildi, «null»</b> — terminaldan",
    "To'rtinchisi: son o'zi o'zgarmadi, o'quvchi hali hodisasiz tegda, xato emas. Beshinchisi: birinchi ulanish cho'zildi, Render uxlagan, bir daqiqa. Oltinchisi: server terminalida o'yinchi null, sabab return yo'q, oltinchi ekrandagi buzilish."
   ],
   [
    "c",
    "O'quvchi savollari: <b>socket.io nima, nega son yo'q, uzilgan hodisa, token muddati</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: WebSocket va socket.io farqi, nega hodisada son yo'q, uzilgan paytdagi hodisa keyin keladimi, token muddati tugasa nima bo'ladi."
   ],
   [
    "d",
    "Xulosa: <b>avval belgiga, keyin server terminaliga</b> qarang — sabab shu ikkisida",
    "Xulosa: o'quvchi ekran o'zgarmayapti desa, u bilan birga avval belgiga, keyin server terminaliga qarang. Sabab deyarli doim shu ikkisidan birida. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Panel GET /admin/orders ni bir marta so'radi. Keyin bot buyurtma oldi. Oddiy HTTP'da panel nima biladi?",
    "o": [
     "Hech narsa — server so'ralmaguncha javob bermaydi",
     "Server javobni o'zi qayta yuboradi",
     "Brauzer o'zgarishni o'zi sezib yangilaydi",
     "HTTP ulanishi ochiq qoladi va server yangisini o'zi yuboradi"
    ],
    "c": 0,
    "e": "So'rov–javobda server o'zi gapirmaydi.",
    "s": 2
   },
   {
    "q": "Gateway tokenni qayerdan o'qiydi?",
    "o": [
     "So'rov sarlavhasidagi Authorizationdan",
     "client.handshake.auth.token — ulanish ma'lumotidan",
     "Har hodisa bilan kelgan maydondan",
     ".env dagi ADMIN_PANEL_TOKENdan — klient hech narsa yubormaydi"
    ],
    "c": 1,
    "e": "Token ulanish ochilayotganda keladi.",
    "s": 4
   },
   {
    "q": "disconnect() dan keyin return yo'q. Tokensiz klient bilan nima bo'ladi?",
    "o": [
     "Klient ulangan qoladi va keyingi hodisalarni ham oladi, token tekshirilmaydi",
     "Server xato beradi va to'xtaydi",
     "Klient yopiladi, lekin server logi «panel ulandi» yozadi",
     "Klient qayta-qayta ulanishga urinadi"
    ],
    "c": 2,
    "e": "disconnect() funksiyadan chiqmaydi.",
    "s": 6
   },
   {
    "q": "Hodisa order-changed ichida nima bor?",
    "o": [
     "Butun ro'yxat — panel to'g'ridan chizadi",
     "Mijoz ismi, telefoni va mahsulotlari — panel shundan chizadi",
     "Yangi buyurtma HTML'i — sahifaga qo'yiladi",
     "orderId va reason — panel ro'yxatni qayta so'raydi"
    ],
    "c": 3,
    "e": "Konvert: «nimadir o'zgardi».",
    "s": 8
   },
   {
    "q": "ulanish.on('order-changed', () => yukla). Hodisa keldi. Nima bo'ladi?",
    "o": [
     "Ro'yxat yangilanadi, lekin biroz kechikib",
     "Tinglovchi ishlaydi, yukla chaqirilmaydi — ro'yxat eski",
     "Brauzer konsolida xato chiqadi",
     "Hodisa tinglovchiga umuman yetib kelmaydi — server yubormaydi"
    ],
    "c": 1,
    "e": "Qavssiz — funksiya qaytariladi.",
    "s": 11
   },
   {
    "q": "Server to'xtadi. Klient nima ko'radi?",
    "o": [
     "io server disconnect — qayta urinmaydi",
     "ping timeout — 45 soniya kutadi, keyin o'zi qayta ulanadi",
     "transport close, active=true — o'zi qayta urinadi",
     "Hech narsa — ulanish o'zi yopilmaydi"
    ],
    "c": 2,
    "e": "Tarmoq uzdi — klient taslim bo'lmaydi.",
    "s": 14
   },
   {
    "q": "Wi-Fi o'chdi, ulanish rasman uzilmadi. Belgi qachon o'zgaradi?",
    "o": [
     "Darhol — brauzer socket.io'ga aytadi",
     "Hech qachon — uzilish bo'lmagani uchun",
     "Keyingi buyurtmada — server xato qaytaradi",
     "45 soniyagacha — ping timeout bilan"
    ],
    "c": 3,
    "e": "25 + 20 s qoidasi.",
    "s": 15
   },
   {
    "q": "AI paneli …/ws/orders?token=… ga ulanadi va ishlaydi. Asosiy savol?",
    "o": [
     "Token manzilda — tarix va loglarga yoziladi",
     "Ishlayapti — demak qabul qilsa bo'ladi",
     "ws sekin — socket.io tezroq ishlaydi",
     "Manzil uzun — brauzer uni qisqartirib, tokenni kesib yuboradi"
    ],
    "c": 0,
    "e": "Maxfiy qiymat manzilga yozilmaydi.",
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
//  MENTOR KURSI · WebSocket-1 «Jonli panel: server o'zi xabar yuboradi» (v2, F-1104-22)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/19-WS1-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar ws1-start (= cicd2-done) → ws1-done (jonli panel: socket.io gateway, /admin)
//  Kod, terminal, panel holatlari va AI natijalari: 03b-kod.gen.jsx (dev/ws1-kod.py — repo teglari va manba/ws1v2-out, ws1v2-ai dan aynan)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws1/parts/*.jsx > WsBasicsMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws1-01-ulanish-v1'; // M44: id o'zgarmaydi
const LESSON_TITLE = "Jonli panel: server o'zi xabar yuboradi";
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
  gw: 'src/api/live/live.gateway.ts', tok: 'src/api/live/admin-token.ts', ctrl: 'src/api/live/admin.controller.ts', mod: 'src/api/live/live.module.ts',
  gws: 'src/api/live/live.gateway.spec.ts', ctrls: 'src/api/live/admin.controller.spec.ts',
  tg: 'src/api/telegram/telegram.service.ts', tgm: 'src/api/telegram/telegram.module.ts', html: 'public/admin.html', cli: 'scripts/live-client.js',
  env: '.env.example', readme: 'README.md',
};
const BASE_FILES = ['node_modules/', F.html, F.cli, 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', 'src/api/catalog/', F.ctrl, F.ctrls, F.tok, F.gw, F.gws, F.mod, 'src/api/order/', F.tg, F.tgm, 'src/api/user/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', F.env, 'package.json', F.readme];
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
  ['npm run live', 'npm run live'], ['npm run smoke live', 'npm run smoke -- live'], ['npm run start dev', 'npm run start:dev'], ['ws1 done', 'ws1-done'],
  ['get admin orders', 'GET /admin/orders'], ['admin orders', '/admin/orders'], ['localhost uch ming admin', 'localhost:3000/admin'], ['get admin', 'GET /admin'],
  ['live gateway ts', 'live.gateway.ts'], ['admin token ts', 'admin-token.ts'], ['is admin token', 'isAdminToken'], ['admin controller', 'AdminController'], ['live module', 'LiveModule'], ['telegram module', 'TelegramModule'],
  ['telegram service ts', 'telegram.service.ts'], ['admin html', 'admin.html'], ['socket io js', 'socket.io.js'], ['live client', 'live-client'],
  ['WebSocket gateway', '@WebSocketGateway'], ['WebSocket server', '@WebSocketServer'], ['handle connection', 'handleConnection'], ['handshake auth token', 'handshake.auth.token'], ['handshake auth', 'handshake.auth'],
  ['client disconnect', 'client.disconnect()'], ['client data admin true', 'client.data.admin = true'], ['order changed', 'order-changed'], ['orders place', 'orders.place'], ['orders set status', 'orders.setStatus'], ['place order', 'placeOrder'],
  ['server emit', 'server.emit'], ['io server disconnect', 'io server disconnect'], ['transport close', 'transport close'], ['xhr poll error', 'xhr poll error'], ['ping timeout', 'ping timeout'], ['connect error', 'connect_error'],
  ['ulanish on', 'ulanish.on'], ['io, auth, token', 'io({ auth: { token } })'], ['admin panel token', 'ADMIN_PANEL_TOKEN'], ['kill minus STOP', 'kill -STOP'], ['Ctrl C', 'Ctrl+C'],
  ['savol belgisi token', '?token='], ['git diff stat', 'git diff --stat'], ['oyin ozgardi', 'oyin-ozgardi'], ['ulanish ts', 'ulanish.ts'], ['m10-02', 'm10-02'], ['m12-dars', 'm12-dars'],
];
DIGITS.unshift(["uch ming bir yuz", '3100'], ["to'rt ming to'rt yuz bir", '4401'], ["bir ming sakkiz", '1008'], ["sakkiz yuz ellik besh", '855'], ["besh yuz o'n ikki", '512'],
  ["to'rt yuz to'rt", '404'], ["to'rt yuz bir", '401'], ["yigirma besh soniyada", '25 soniyada'], ["yigirma soniya", '20 soniya'], ["qirq besh soniya", '45 soniya'], ["qirq uch soniya", '43 soniya'],
  ["o'n besh soniya", '15 soniya'], ["beshdan besh", '5/5'], ["to'qqizdan to'qqiz", '9/9'], ["oxirgi yigirma", 'oxirgi 20'], ["o'n besh daqiqa", '15 daqiqa'], ["yigirma daqiqa", '20 daqiqa'], ["yigirma ekran", '20 ekran'],
  ["sakkizdan o'n", '8 / 10'], ["Uchinchi, beshinchi, oltinchi ekranlarga", '3, 5, 6-ekranlarga'], ["o'ninchi ekran", '10-ekran'], ["oltinchi ekran", '6-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/io server disconnect/gi, /transport close/gi, /xhr poll error/gi, /ping timeout/gi, /connect error/gi, /order changed/gi, /handle connection/gi, /handshake auth token/gi,
  /WebSocket gateway/gi, /WebSocket server/gi, /client disconnect/gi, /server emit/gi, /polling/g, /websocket/g, /socket\.io/g, /snapshot/g, /created/g, /updated/g, /Ctrl C/g, /kill minus STOP/g);

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
  if (/order-changed|xabar (snapshot|created|updated|order\/)/.test(l)) return `<span class="ev">${escH(l)}</span>`;
  if (/connect · ulangan|transport: websocket|\[Live\] panel ulandi|NATIJA: \d+\/\d+ ✓|^\s*✓|O'ZGARDI|Tests:\s+\d+ passed|PASS |\bopen$/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/io server disconnect|close \d{4}|Cannot GET|"statusCode":404|^401$|O'ZGARMADI|SERVER XATO|✕|✗/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/ulanmoqda|xhr poll error|transport close|ping timeout|transport: polling|— server/.test(l)) return `<span class="wn">${escH(l)}</span>`;
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

// Brauzerdagi panel — HAQIQIY bosqichlardan (KOD.PANEL: headless Chrome, 10-panel.txt). Maket: ko'rinish chizilgan, har qator va belgi haqiqiy.
const PCOLS = ['#', 'Mijoz', 'Telefon', 'Mahsulotlar', 'Jami', 'Holat', 'Vaqt'];
const pstage = (k) => KOD.PANEL.find((x) => x.k === k);
function PanelView({ k, note, small }) {
  const st = pstage(k); if (!st) return null;
  const cls = st.belgi === 'Ulangan' ? 'ulangan' : st.belgi === 'Ulanmagan' ? 'ulanmagan' : 'ulanmoqda';
  return <div className={`c1-br${small ? ' sm' : ''}`}>
    <div className="bar"><span className="dots"><i /><i /><i /></span><span className="url">localhost:3000/admin</span><span className="src">{t("haqiqiy brauzer · ", "настоящий браузер · ")}{st.t}</span></div>
    <div className="hd"><b>Buyurtmalar — jonli panel</b><span className={`belgi ${cls}`}>{st.belgi}</span></div>
    {note && <div className="note">{note}</div>}
    <table><thead><tr>{PCOLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{st.rows.map((r, i) => r.msg ? <tr key={i}><td colSpan={7}>{r.msg}</td></tr> : <tr key={i} className={r.yangi ? 'yangi' : ''}>{r.cells.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
  </div>;
}
// Oqim: bot → tranzaksiya → hodisa → panel → GET → baza
const FLOW = [['bot', 'Bot', "Bobur «Buyurtma berish»", T.blue], ['tx', 'place()', 'tranzaksiya · COMMIT', T.green], ['ev', 'order-changed', '{ orderId, reason }', C1.ws], ['pn', 'Panel', 'tinglovchi → yukla()', C1.live], ['get', 'GET /admin/orders', 'token bilan · bazadan', T.purple]];
function Flow({ hl = [] }) {
  return <div className="c1-flow">{FLOW.map(([k, h, tx, c], i) => <React.Fragment key={k}>
    {i > 0 && <span className="ar">→</span>}
    <div className={hl.includes(k) ? 'hl' : hl.length ? 'dim' : ''} style={{ '--c': c }}><b>{h}</b><small>{tx}</small></div>
  </React.Fragment>)}</div>;
}
// Uch holat kartasi
const STATES = [['ulangan', 'Ulangan', T.green, 'connect · hodisalar keladi', 'ulanish ochiq'], ['ulanmoqda', 'Ulanmoqda…', '#B7791F', 'transport close · xhr poll error · ping timeout', 'active=true — klient o\'zi qayta urinadi'], ['ulanmagan', 'Ulanmagan', T.accent, 'io server disconnect', 'active=false — server yopdi (token), klient urinmaydi']];
function States({ on = -1 }) {
  return <div className="pg-three">{STATES.map(([k, h, c, x, y], i) => <div key={k} className={`c1-state${on === i ? ' hl' : ''}${on >= 0 && on !== i ? ' dim' : ''}`} style={{ '--c': c }}><span className="belgi">{h}</span><code>{x}</code><p>{y}</p></div>)}</div>;
}

// WebSocket-1 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.w1-sq{display:grid;grid-template-columns:66px minmax(0,1fr) minmax(0,1fr);background:#fff;border:1px solid #D7DCE3;border-radius:14px;overflow:hidden}
.w1-sq>div{padding:7px 10px;border-bottom:1px solid #EEF0F3;font-size:13.5px;display:flex;align-items:center;gap:6px;min-height:40px;min-width:0;overflow-wrap:anywhere}
.w1-sq .hd{font:700 12px system-ui,sans-serif;color:#4B5563;background:#F8FAFC}
.w1-sq .tm{font:600 11.5px ui-monospace,Menlo,Consolas,monospace;color:#6B7280;background:#F8FAFC;white-space:nowrap}
.w1-sq.r{grid-template-columns:66px minmax(0,.75fr) minmax(0,1.25fr)}
.w1-sq .r2l{color:#1D4ED8}.w1-sq .l2r{color:#374151;font:12px ui-monospace,Menlo,Consolas,monospace;white-space:nowrap}.w1-sq .push{color:#15803D;font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11.5px;flex-direction:column;align-items:flex-start;gap:0}
.w1-sq .stale{background:#FEF2F2;color:#991B1B;font-weight:600}
.w1-sq .ok{background:#F0FDF4;color:#166534;font-weight:600}
.w1-sq .hl{box-shadow:inset 0 0 0 2px #E2451F}
.w1-a17 td:first-child{font-family:system-ui,sans-serif;font-weight:700;color:#374151;white-space:nowrap}
.w1-a17 td{vertical-align:top}
.w1-a17 tr.w td{background:#FFF7ED}
.w1-a17 .f{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#FFEDD5;color:#C2410C}
.w1-a17 .g{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#DCFCE7;color:#15803D}
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-ws1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: haqiqiy brauzerdagi panel (10b)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', 'Gateway va token', 'Hodisa va panel', 'Ulanish holati', 'AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi; pastki qatorda admin paneli: brauzerdagi /admin serverga doimiy ulanish (socket.io) bilan bog'langan
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const PANEL = { get name() { return t('Admin panel', 'Админ-панель'); }, steps: [['LiveGateway', 'ok'], ['order-changed', 'ok']], res: 'pass', badge: 'Ulangan' };
const LIVE_ON = ['phone', 'telegram', 'order', 'db', 'orders'];
const CHAT_LIVE = ['[✅ Buyurtma berish]', 'Buyurtma #… qabul qilindi!', 'ok'];
const S1M = [
  { on: LIVE_ON, chat: CHAT_LIVE, jest: PANEL },
  { on: ['telegram'], jest: { get name() { return t('Admin panel', 'Админ-панель'); }, steps: [['socket.io', 'ok'], ['token', 'ok']], res: 'pass', badge: 'Ulangan' } },
  { on: LIVE_ON, chat: CHAT_LIVE, jest: PANEL },
  { on: LIVE_ON, chat: CHAT_LIVE, jest: PANEL },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} {...m} tag={t("Bugungi darsning rasmi — bot buyurtma oladi, admin paneli o'zi ko'rsatadi", 'Картина урока — бот получает заказ, админ-панель показывает его сама')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · So'rov–javob: panel so'ramaguncha bilmaydi (ws1v2-out/02)
// ============================================================
const T2A = outRange('02', /1-so'rov/, /— Bobur/).concat(outPick('02', (l) => /— Bobur|qabul qilindi/.test(l)));
const T2B = outRange('02', /2-so'rov/, /tokensiz/);
const T2C = outRange('02', /tokensiz/, null);
// F-1109-06: «ikki yo'l» kartalari va kichik 401 terminali o'rniga ikki ketma-ketlik yonma-yon (ws1v2-out/02, 04 — haqiqiy vaqtlar)
function Seq2({ c }) {
  return <div className="z">
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("Oddiy HTTP — panel so'ramaguncha bilmaydi", "Обычный HTTP — панель не знает, пока не спросит")}</p>
        <div className="w1-sq">
          <div className="hd" /><div className="hd">{t("Panel", "Панель")}</div><div className="hd">{t("Server · bot", "Сервер · бот")}</div>
          <div className="tm">1</div><div className="l2r">GET /admin/orders →</div><div className="zm">[]</div>
          <div className="tm">20:19:16</div><div className="stale">{t("ekran: bo'sh", "экран: пусто")}</div><div>{t("Bobur: «Buyurtma #1 qabul qilindi!»", "Бобур: «Buyurtma #1 qabul qilindi!»")}</div>
          <div className="tm">…</div><div className="stale">{t("ekran eski — so'ramadi", "экран старый — не спросила")}</div><div className="z-mut">{t("bazada #1 bor", "в базе есть #1")}</div>
          <div className="tm">2</div><div className="l2r">GET /admin/orders →</div><div className="zm">[{'{'}"id":1,"customer":"Bobur",…{'}'}]</div>
          <div className={'tm' + (c ? ' hl' : '')}>token?</div><div className={'l2r' + (c ? ' hl' : '')}>{t("tokensiz GET →", "GET без токена →")}</div><div className={c ? 'hl' : ''}><span className="z-tag r">401</span></div>
        </div>
      </div>
      <div className="z-card" style={{ borderColor: '#15803D' }}>
        <p className="z-h" style={{ color: '#15803D' }}>{t("Doimiy ulanish — server o'zi aytadi", "Постоянное соединение — сервер сообщает сам")}</p>
        <div className="w1-sq r">
          <div className="hd" /><div className="hd">{t("Panel", "Панель")}</div><div className="hd">{t("Server · bot", "Сервер · бот")}</div>
          <div className="tm">{t("1 marta", "1 раз")}</div><div className="r2l" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>{t("ulanish ochiladi va ochiq turadi ⇄", "соединение открывается и остаётся открытым ⇄")}</div>
          <div className="tm">20:19:24</div><div className="ok">{t("yangi qator #2", "новая строка #2")}</div><div className="push"><span>← order-changed</span><span>{'{'}"orderId":2,</span><span>&nbsp;"reason":"new"{'}'}</span></div>
          <div className="tm">20:19:26</div><div className="ok">{t("holat o'zgardi", "статус изменён")}</div><div className="push"><span>← order-changed</span><span>{'{'}"orderId":2,</span><span>&nbsp;"reason":"status"{'}'}</span></div>
        </div>
        <span className="z-mut">{t("panel so'ramaydi — server o'zgarish bo'lganda o'zi yuboradi", "панель не спрашивает — сервер сам отправляет при изменении")}</span>
      </div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Panelni jonli qilishning ikki yo'li", "Два способа сделать панель живой")}</p>
      <div className="z-two">
        <div><b>Polling</b>{t(" — har 3 soniyada qayta so'rash. Oddiy, lekin ko'pincha javob o'zgarmagan, kechikish qoladi.", " — переспрашивать каждые 3 секунды. Просто, но ответ часто не меняется, остаётся задержка.")}</div>
        <div><b>{t("Doimiy ulanish", "Постоянное соединение")}</b>{t(" — bir marta ulanadi, server o'zgarishda o'zi xabar beradi.", " — подключается один раз, сервер сам сообщает об изменении.")}</div>
      </div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'a' }, { v: 'b' }, { v: 'two' }, { v: 'c' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("VS Code terminali · curl va server logi", "терминал VS Code · curl и лог сервера")} lines={T2A} />}
    {seg.v === 'b' && <Term title={t("VS Code terminali · curl", "терминал VS Code · curl")} lines={T2B} />}
    {(seg.v === 'two' || seg.v === 'c') && <Seq2 c={seg.v === 'c'} />}
  </>} />;
}

// ============================================================
//  3 · Doimiy ulanish va socket.io: polling → websocket (ws1v2-out/04, 01, 08)
// ============================================================
const T3A = outRange('04', /ulanmoqda…/, /order-changed/);
const T3B = outPick('01', (l) => /Mapped|ishlayapti|LiveModule/.test(l));
const T3EV = outPick('04', (l) => /order-changed/.test(l)).slice(0, 1);
const T3C = outRange('08', /^\$ npm run live/, null);
const S3 = mkS(3, [{ v: 'c' }, { v: 'port' }, { v: 'ev' }, { v: 'start' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'c' && <Term title={t("VS Code terminali · npm run live", "терминал VS Code · npm run live")} lines={T3A} />}
    {seg.v === 'port' && <Term title={t("VS Code terminali · server (npm run start)", "терминал VS Code · сервер (npm run start)")} lines={T3B} />}
    {seg.v === 'ev' && <div style={{ display: 'grid', gap: 10 }}><Term title={t("VS Code terminali · npm run live", "терминал VS Code · npm run live")} lines={T3EV} />
      <div className="pg-two"><Card c={C1.ws} h={t("Hodisa nomi", "Имя события")}><p><code>order-changed</code>{t(" — bo'lib o'tgan ish, kichik harf va chiziqcha", " — о случившемся, строчными буквами через дефис")}</p></Card><Card c={C1.live} h={t("Ichida", "Внутри")}><p><code>orderId</code>{t(" va ", " и ")}<code>reason</code> (<code>new</code> | <code>status</code>{t(") — ro'yxat emas", ") — не список")}</p></Card></div></div>}
    {seg.v === 'start' && <Term title={t("VS Code terminali · ws1-start (gateway yo'q)", "терминал VS Code · ws1-start (нет gateway)")} lines={T3C} er />}
    {/* F-1120-02 (M51): xulosada darsning rasmi — serverda gateway yo'q: panel socket.io bilan urinadi, xhr poll error (T3C) */}
    {seg.v === 'start' && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={['telegram', 'order']} jest={{ get name() { return t('Admin panel', 'Админ-панель'); }, steps: [['socket.io', 'ok'], ['xhr poll error', 'bad']], res: 'fail', get badge() { return t("gateway yo'q", 'нет gateway'); } }} max={1} tag={t("Serverda gateway bo'lmasa — klient cheksiz xhr poll error", 'Нет gateway на сервере — у клиента бесконечный xhr poll error')} /></div>}
  </>} />;
}

// ============================================================
//  4 · Gateway: token ulanish ochilayotganda tekshiriladi (live.gateway.ts, admin-token.ts, modullar)
// ============================================================
const GW = { dec: lineN('GATEWAY', /@WebSocketGateway/), con: lineN('GATEWAY', /handleConnection\(/), oc: lineN('GATEWAY', /orderChanged\(orderId/) };
const S4 = mkS(4, [{ v: 'gw', from: GW.dec, to: GW.dec + 5, f: ['d'] }, { v: 'gw', from: GW.con, to: GW.con + 7, f: ['c'] }, { v: 'tok' }, { v: 'gw', from: GW.oc - 2, to: GW.oc + 2, f: ['e'], mod: true }]);
function Screen4(p) {
  const ids = { ...rngIds(GW.dec, GW.dec + 5, 'd'), ...rngIds(GW.con, GW.con + 7, 'c'), ...rngIds(GW.oc - 2, GW.oc + 2, 'e') };
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'gw' && !seg.mod && <Code k="GATEWAY" ids={ids} from={seg.from} to={seg.to} focus={seg.f} fresh={F.gw} />}
    {seg.v === 'tok' && <Code k="TOKEN" ids={rngIds(5, 11, 't')} focus={['t']} />}
    {seg.mod && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="live.gateway.ts" lines={kod('GATEWAY', ids, seg.from, seg.to)} focus={seg.f} />
      <CodePanel file="telegram.module.ts" lines={kod('TGMOD', { [lineN('TGMOD', /LiveModule/)]: 'm', [lineN('TGMOD', /imports:/)]: 'm' })} focus={['m']} /></div>}
  </>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — tokensiz klient nima ko'radi (ws1v2-out/03)
// ============================================================
function Screen5(p) {
  return MC(p, 5, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="live.gateway.ts" lines={kod('GATEWAY', rngIds(GW.con + 1, GW.con + 4, 'c'), GW.con, GW.con + 4)} focus={['c']} />
      <Term lines={jt('$ npm run live -- ""')} />
    </div>,
    after: <Term title={t('VS Code terminali · npm run live -- ""', 'терминал VS Code · npm run live -- ""')} lines={outRange('03', /^\$ npm run live -- ""/, /# Noto/)} />,
  });
}

// ============================================================
//  6 · Buzamiz: return unutildi — log yolg'on (ws1v2-out/07, 03)
// ============================================================
const RET = lineN('GATEWAY', /^\s+return;$/, GW.con);
const T6CLI = outRange('07', /^\$ npm run live/, /# Server logi/);
const T6SRV = outRange('07', /# Server logi/, null);
const T6OK = outRange('03', /# Server logi/, null);
const CAUSE6 = ['client.disconnect() — ulanish yopiladi, lekin funksiyadan chiqilmaydi', "return yo'q — keyingi satrlar baribir bajariladi", "client.data.admin = true va log «panel ulandi» — rad etilgan klient uchun", "Keyin shu yerga xona yoki ruxsat qo'shilsa — rad etilgan klient ularni oladi"];
// F-1120-02 (M52): 1-segment (x) — mentor client.disconnect() dan keyingi return; ni o'zi bosadi → satr o'chadi
const ACT6 = () => kod('GATEWAY', { [RET]: 'x' }, GW.con, GW.con + 7).map((l) => (l.n === RET ? { ...l, h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : l));
const RetMini = ({ broken, cli, log, pins }) => <N1Mini><FlowMini tag={t('tokensiz klient → gateway → server logi', 'клиент без токена → gateway → лог сервера')}
  boxes={[[t('tokensiz klient', 'клиент без токена'), cli ? 'io server disconnect' : 'npm run live -- ""', ''], ['handleConnection', broken ? t("return yo'q", 'нет return') : 'disconnect() · return', broken ? 'bad' : ''], [t('server logi', 'лог сервера'), !broken ? t("bo'sh — to'g'ri", 'пусто — верно') : log ? '[Live] panel ulandi' : '?', broken && log ? 'bad' : '']]}
  res={broken ? [log ? t("log yolg'on: rad etilgan klient «ulandi»", 'лог врёт: отклонённый клиент «подключён»') : '?', 'bad'] : null} pins={pins} /></N1Mini>;
const S6 = mkS(6, [{ v: 'act' }, { v: 'code' }, { v: 'cli' }, { v: 'log' }, { v: 'cause' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={(b) => <Scene6 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi · 2 klient — o'sha natija · 3 server logi yolg'on, bo'laklar 1·2 · 4 sabab
function Scene6({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'code' : 'act') : seg.v;
  const code = <CodePanel file={t("live.gateway.ts · buzilgan", "live.gateway.ts · сломанная копия")} lines={kod('GATEWAY', { [RET]: 'x' }, GW.con, GW.con + 7, { [RET]: false })} focus={['x']} />;
  const mini = <RetMini broken={v !== 'act'} cli={beat >= 2} log={beat >= 3} pins={beat === 3 ? { 0: 1, 2: 2 } : {}} />;
  return <>
    {v === 'act' && <Ide files={compact(FILES(), F.gw)} active={F.gw}><div onClick={act.onClick}><CodePanel file="live.gateway.ts" lines={ACT6()} focus={['x']} /></div>{mini}</Ide>}
    {v === 'code' && <Ide files={compact(FILES(), F.gw)} active={F.gw}>{code}{mini}</Ide>}
    {v === 'cli' && <div style={{ display: 'grid', gap: 8 }}>{code}{mini}<Term title={t('VS Code terminali · npm run live -- ""', 'терминал VS Code · npm run live -- ""')} lines={T6CLI} /></div>}
    {v === 'log' && mini}
    {v === 'log' && <div className="pg-two"><Term title={t("server logi · return yo'q", "лог сервера · нет return")} lines={T6SRV} er marks={{ [T6SRV.findIndex((l) => /panel ulandi/.test(l.h || ''))]: 'n1-p2' }} /><Term title={t("server logi · to'g'ri kod (03)", "лог сервера · правильный код (03)")} lines={T6OK} /></div>}
    {v === 'cause' && <div style={{ display: 'grid', gap: 10 }}><Term title={t("server logi · return yo'q", "лог сервера · нет return")} lines={T6SRV} er /><Cause items={CAUSE6} on={4} bad={2} /></div>}
  </>;
}

// ============================================================
//  7 · Amaliyot 1 — server va terminal klienti
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: F.env, lines: kod('ENV', { [lineN('ENV', /ADMIN_PANEL_TOKEN/)]: 'e' }) }, { step: 2, file: F.cli, lines: kod('CLIENT'), copy: false }],
});
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} code={P7.code} tree={FILES()} />; }

// ============================================================
//  8 · Hodisa: tranzaksiyadan keyin, ichida faqat «nima o'zgardi» (telegram.service.ts, admin.controller.ts)
// ============================================================
const TG = { pl: lineN('TG', /await this\.orders\.place\(/), st: lineN('TG', /await this\.orders\.setStatus\(/) };
const TG_EMIT_NEW = lineN('TG', /orderChanged\(order\.id, 'new'\)/), TG_EMIT_ST = lineN('TG', /orderChanged\(order\.id, 'status'\)/);
const CT = { list: lineN('CTRL', /@Get\('orders'\)/) };
const S8 = mkS(8, [{ v: 'pl' }, { v: 'st' }, { v: 'flow' }, { v: 'ctrl' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'pl' && <Code k="TG" ids={{ [TG.pl]: 'a', [TG_EMIT_NEW]: 'e', [TG_EMIT_NEW - 1]: 'e' }} from={TG.pl - 3} to={TG_EMIT_NEW + 2} focus={['a', 'e']} />}
    {seg.v === 'st' && <CodePanel file={t("telegram.service.ts · status tugmasi", "telegram.service.ts · кнопка статуса")} lines={kod('TG', { [TG.st]: 'a', [TG_EMIT_ST]: 'e' }, TG.st, TG_EMIT_ST + 1)} focus={['a', 'e']} />}
    {seg.v === 'flow' && <div style={{ display: 'grid', gap: 10 }}><Flow hl={['tx', 'ev', 'get']} /><div className="mk-rule">{t("Hodisada ", "В событии ")}<b>{t("faqat", "только")}</b> <code>orderId</code>{t(" va ", " и ")}<code>reason</code>{t(" — ro'yxat ham, telefon ham yo'q. Ma'lumot manbai bitta: baza (token bilan ", " — нет ни списка, ни телефона. Источник данных один: база (с токеном ")}<code>GET</code>).</div></div>}
    {seg.v === 'ctrl' && <Code k="CTRL" ids={rngIds(CT.list, CT.list + 16, 'l')} from={CT.list - 2} to={CT.list + 16} focus={['l']} />}
  </>} />;
}

// ============================================================
//  9 · Panel sahifasi: ulanish, tinglovchi, qayta so'rash (public/admin.html)
// ============================================================
const H = { scr: lineN('HTML', /socket\.io\/socket\.io\.js"><\/script>/), yk: lineN('HTML', /async function yukla/), ul: lineN('HTML', /function ulan\(\)/), on: lineN('HTML', /ulanish\.on\('order-changed'/), esc: lineN('HTML', /const esc =/), escU: lineN('HTML', /esc\(o\.customer\)/) };
const S9 = mkS(9, [{ v: 'scr' }, { v: 'ul', f: ['i', 'c'] }, { v: 'ul', f: ['o'] }, { v: 'esc' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'scr' && <Code k="HTML" ids={{ [H.scr]: 's', [H.scr - 1]: 's', [H.yk + 1]: 'f' }} from={H.scr - 1} to={H.yk + 1} focus={['s', 'f']} fresh={F.html} />}
    {seg.v === 'ul' && <Code k="HTML" ids={{ [H.ul + 2]: 'i', [H.ul + 4]: 'c', [H.ul + 6]: 'c', [H.on]: 'o' }} from={H.ul} to={H.on + 1} focus={seg.f} />}
    {seg.v === 'esc' && <CodePanel file="admin.html" lines={[...kod('HTML', { [H.esc]: 'e' }, H.esc - 1, H.esc), { h: '<span class="cm">…</span>', n: '' }, ...kod('HTML', { [H.escU]: 'e' }, H.escU, H.escU + 1)]} focus={['e']} />}
  </>} />;
}

// ============================================================
//  10 · Haqiqiy oqim: bot → server → panel (10-panel, 04, 12)
// ============================================================
const T10CLI = outPick('04', (l) => /order-changed|connect · ulangan/.test(l));
const T10SRV = outPick('04', (l) => /\[Live\] panel ulandi|— Bobur|qabul qilindi|— admin|Tasdiqlangan$/.test(l)).slice(0, 6);
const T10CI = outPick('12', (l) => /✓ (test|smoke) in|— live|✓ (tokensiz|yangi|GET|admin)|NATIJA/.test(l));
const S10 = mkS(10, [{ k: '10a' }, { k: '10b' }, { k: '10c', cli: true }, { ci: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {!seg.ci && !seg.cli && <PanelView k={seg.k} note={seg.k === '10a' ? t('token kiritildi — ro\'yxat GET /admin/orders dan', "токен введён — список из GET /admin/orders") : t('bot buyurtma oldi — sahifa yangilanmadi', "бот получил заказ — страница не обновилась")} />}
    {seg.cli && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><PanelView k="10c" small note={t("admin tasdiqladi", "админ подтвердил")} /><div className="pg-two"><Term title="npm run live" lines={T10CLI} /><Term title={t("server logi", "лог сервера")} lines={T10SRV} /></div></div>}
    {/* F-1120-02 (M51): xulosa — lenta logi ostida darsning rasmi: o'sha oqim (bot → server → panel), yakundagi bilan bir xil */}
    {seg.ci && <div style={{ display: 'grid', gap: 10 }}><Term title="GitHub Actions · main · ws1-done (run 41856397400)" lines={T10CI} /><div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={LIVE_ON} chat={CHAT_LIVE} jest={PANEL} max={0.8} tag={t("Bot → server → panel — lentada ham shu oqim tekshiriladi (smoke live)", 'Бот → сервер → панель — в конвейере проверяется тот же поток (smoke live)')} /></div></div>}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck: () => yukla qavssiz (admin.html ulan(), 11b)
// ============================================================
const LC11 = KOD.HTML.lines.filter((l) => l.n >= H.ul && l.n <= H.on).map((l) => ({ h: tsLine(l.n === H.on ? l.t.replace('() => yukla())', '() => yukla)') : l.t), n: l.n }));
const LC11_FIXED = KOD.HTML.lines.filter((l) => l.n >= H.ul && l.n <= H.on).flatMap((l) => l.n === H.on ? [{ h: tsLine(l.t.replace('() => yukla())', '() => yukla)')), n: l.n, gone: true }, { h: tsLine(l.t), n: l.n, neu: true }] : [{ h: tsLine(l.t), n: l.n }]);
const T11X = [...txtLines(KOD.OUT['11b'].split('# brauzer')[1].split('#')[0]).filter((x) => !/^\s*$/.test(x.h)), ...outPick('11b', (l) => /order-changed/.test(l))];
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="admin.html · ulan()" lines={LC11} target={LC11.length - 1}
    fixed={LC11_FIXED} fixedExtra={[{ file: t("brauzer (qavssiz) · 15 s — ro'yxat o'zgarmadi; o'sha paytda npm run live", "браузер (без скобок) · 15 с — список не изменился; в это же время npm run live"), lines: T11X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — brauzerda panel va bot
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []], { code: [{ step: 0, file: F.html, lines: kod('HTML', {}, H.ul, H.on + 1), copy: false }] });
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} code={P12.code} tree={FILES()} />; }

// ============================================================
//  13 · Uch holat (03, 05, 06, 10d, 10e)
// ============================================================
const S13 = mkS(13, [{ on: 0 }, { on: 1 }, { on: 2 }, { sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {!seg.sum && <><States on={seg.on} />{seg.on === 1 && <div style={{ marginTop: 10 }}><PanelView k="10d" small note={t("server to'xtatildi — ro'yxat ekranda qoladi", "сервер остановлен — список остаётся на экране")} /></div>}{seg.on === 2 && <div style={{ marginTop: 10 }}><PanelView k="10e" small note={t("ikkinchi oyna — token «notogri»", "второе окно — токен «notogri»")} /></div>}</>}
    {/* F-1120-02 (M51): xulosada darsning rasmi — panel belgisi bitta satr: holatni disconnect va active beradi */}
    {seg.sum && <div style={{ display: 'grid', gap: 10 }}><States /><CodePanel file="admin.html" lines={kod('HTML', { [H.ul + 6]: 'd', [H.ul + 7]: 'd' }, H.ul + 5, H.ul + 7)} focus={['d']} /><div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={LIVE_ON} jest={{ get name() { return t('Admin panel', 'Админ-панель'); }, steps: [['connect', 'ok'], ['disconnect', ''], ['socket.active', '']], res: 'pass', badge: 'Ulangan' }} max={0.8} tag={t("Holatni disconnect va active beradi; panelda bir satr", 'Состояние дают disconnect и active; в панели одна строка')} /></div></div>}
  </>} />;
}

// ============================================================
//  14 · Server o'chdi va qayta yondi (05)
// ============================================================
const L05 = outLines('05');
const T14A = outRange('05', /^\$ npm run live/, /disconnect: transport close/);
const T14B = outRange('05', /disconnect: transport close/, /connect · ulangan · transport: polling/);
const T14C = outRange('05', /^\$ npm run live/, null);
const STOPAT = (L05.find((l) => /server to'xtatildi/.test(l)) || '').slice(0, 8), STARTAT = (L05.find((l) => /qayta ishga/.test(l)) || '').slice(0, 8);
const S14 = mkS(14, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'q' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t(`npm run live · ${STOPAT} — server to'xtatildi (Ctrl+C)`, `npm run live · ${STOPAT} — сервер остановлен (Ctrl+C)`)} lines={T14A.concat(T14B.slice(0, 1))} />}
    {seg.v === 'b' && <Term title={t("npm run live · qayta urinishlar", "npm run live · повторные попытки")} lines={T14B} />}
    {seg.v === 'c' && <Term title={t(`npm run live · ${STARTAT} — server qayta ishga tushirildi`, `npm run live · ${STARTAT} — сервер снова запущен`)} lines={T14C} />}
    {/* F-1120-02 (M51): xulosada darsning rasmi — server qaytdi, klient o'zi ulandi; uzilish paytidagi buyurtma — ochiq savol (WebSocket-2). Panelning «server o'chgan payt» ko'rinishi 13-ekranda (10d) — 1280 da rasm sig'ishi uchun bu yerda takrorlanmaydi */}
    {seg.v === 'q' && <div style={{ display: 'grid', gap: 10 }}><Card c={C1.live} h={t("Savol — WebSocket-2", "Вопрос — WebSocket-2")}><p>{t("Server o'chiq paytida bot buyurtma olsa, panel qayta ulanganda uni ", "Если бот получил заказ, пока сервер был выключен, панель при переподключении ")}<b>{t("ko'radimi", "увидит его")}</b>{t("? Hodisa o'sha paytda hech kimga yetmagan.", "? Событие в тот момент ни до кого не дошло.")}</p></Card><div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={['telegram', 'order', 'db', 'orders']} note={{ get orders() { return t('uzilishdagi buyurtma — ?', 'заказ во время обрыва — ?'); } }} jest={{ get name() { return t('Admin panel', 'Админ-панель'); }, get steps() { return [['transport close', 'bad'], [t('qayta ulandi', 'переподключился'), 'ok']]; }, res: 'pass', badge: 'Ulangan' }} max={1} tag={t("Qayta ulanish o'zi bo'ladi; uzilish paytidagi hodisa — keyingi darsda", 'Переподключение само; событие во время обрыва — на следующем уроке')} /></div></div>}
  </>} />;
}

// ============================================================
//  15 · «Muzlash»: 45 soniya javobsiz (06)
// ============================================================
const L06 = outLines('06');
const FRZ = (L06.find((l) => /muzlatildi/.test(l)) || '').slice(0, 8), PTO = (L06.find((l) => /ping timeout/.test(l)) || '').slice(0, 8), CONT = (L06.find((l) => /davom ettirildi/.test(l)) || '').slice(0, 8);
const secs = (a, b) => { const s = (x) => x.split(':').reduce((t, v) => t * 60 + Number(v), 0); return a && b ? s(b) - s(a) : 0; };
const T15 = outRange('06', /^\$ npm run live/, /^# 45/);
// F-1109-06: xulosa — to'rt kichik karta o'rniga haqiqiy vaqt o'qi 20:19:50–20:20:55 (ws1v2-out/06), oraliq ajratilgan; 25 + 20 qoidasi
function Time15() {
  const gap = secs(FRZ, PTO);
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("npm run live · server muzlatildi (kill -STOP) — haqiqiy vaqtlar", "npm run live · сервер заморожен (kill -STOP) — настоящее время")}</p>
      <svg className="z-svg" viewBox="0 0 780 250" role="img" aria-label="muzlash vaqt o'qi">
        <rect x="152" y="26" width="444" height="196" fill="#FEF3C7" opacity=".55" />
        <text x="374" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">{gap} s{t(" — klient hech narsa bilmaydi", " — клиент ничего не знает")}</text>
        <line x1="90" y1="222" x2="760" y2="222" stroke="#9CA3AF" />
        <g fontSize="12" fill="#6B7280">
          {[[90, ':19:50'], [193, ':20:00'], [296, ':10'], [399, ':20'], [502, ':30'], [605, ':40'], [708, ':50']].map(([x, l]) => <text key={x} x={x} y="240" textAnchor="middle" className="mono">{l}</text>)}
        </g>
        <text x="8" y="66" fontSize="13" fontWeight="700" fill="#374151">{t("Server", "Сервер")}</text>
        <rect x="90" y="52" width="62" height="22" rx="5" fill="#BBF7D0" />
        <rect x="152" y="52" width="536" height="22" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeDasharray="5 4" />
        <text x="420" y="68" textAnchor="middle" fontSize="12.5" fill="#374151">{t("muzlagan: ulanish ochiq, javob yo'q", "заморожен: соединение открыто, ответа нет")}</text>
        <rect x="688" y="52" width="72" height="22" rx="5" fill="#BBF7D0" /><text x="724" y="68" textAnchor="middle" fontSize="12" fill="#166534">{t("davom", "продолжил")}</text>
        <text x="8" y="126" fontSize="13" fontWeight="700" fill="#374151">{t("Klient", "Клиент")}</text>
        <rect x="131" y="112" width="465" height="22" rx="5" fill="#BBF7D0" />
        <text x="350" y="128" textAnchor="middle" fontSize="12.5" fill="#166534">{t("«ulangan» — belgi yashil, hodisa kelmaydi", "«подключено» — значок зелёный, событий нет")}</text>
        <rect x="596" y="112" width="92" height="22" rx="5" fill="#F3F4F6" stroke="#9CA3AF" strokeDasharray="4 3" /><text x="642" y="128" textAnchor="middle" fontSize="12" fill="#4B5563">{t("ulanmoqda…", "подключается…")}</text>
        <rect x="688" y="112" width="72" height="22" rx="5" fill="#BBF7D0" /><text x="724" y="128" textAnchor="middle" fontSize="12" fill="#166534">{t("ulangan", "подключено")}</text>
        <line x1="596" y1="96" x2="596" y2="150" stroke="#DC2626" strokeWidth="2.5" />
        <text x="596" y="168" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#DC2626">{PTO} ping timeout</text>
        <text x="152" y="190" textAnchor="middle" fontSize="12" fill="#92400E" className="mono">{FRZ} STOP</text>
        <text x="760" y="190" textAnchor="end" fontSize="12" fill="#166534" className="mono">{CONT} CONT{t(" → darhol ulandi", " → сразу подключился")}</text>
      </svg>
    </div>
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("Nega 45 soniyagacha", "Почему до 45 секунд")}</p>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}><span className="z-tag b">pingInterval 25 s</span><b>+</b><span className="z-tag b">pingTimeout 20 s</span><b>=</b><span className="z-tag o">{t("45 s gacha", "до 45 s")}</span></div>
        <span className="z-mut">{t("socket.io standarti: javob yo'qligini faqat ping aniqlaydi", "стандарт socket.io: отсутствие ответа определяет только ping")}</span>
      </div>
      <div className="z-rule">{t("Sinfda: «uchish rejimida belgi o'zgarmadi» — ", "В классе: «в режиме полёта значок не изменился» — ")}<b>{t("kuting, 45 soniyagacha", "подождите, до 45 секунд")}</b>.</div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'frz' }, { v: 'wait' }, { v: 'ping' }, { v: 'sum' }]);
function Screen15(p) {
  const line = <div className="c1-flow"><div style={{ '--c': C1.live }}><b>{FRZ}</b><small>{t("muzlatildi (kill -STOP)", "заморожен (kill -STOP)")}</small></div><span className="ar">→</span><div style={{ '--c': T.ink3 }}><b>+{secs(FRZ, PTO)} s</b><small>{t("javob yo'q — belgi «Ulangan»", "ответа нет — знак «Ulangan»")}</small></div><span className="ar">→</span><div style={{ '--c': T.accent }}><b>{PTO}</b><small>ping timeout</small></div><span className="ar">→</span><div style={{ '--c': T.green }}><b>{CONT}</b><small>{t("davom — darhol ulandi", "продолжение — сразу подключился")}</small></div></div>;
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'frz' && <Term title="npm run live" lines={T15.slice(0, 3)} />}
    {seg.v === 'wait' && <div style={{ display: 'grid', gap: 10 }}><Term title="npm run live" lines={T15.slice(0, 3)} />{line}</div>}
    {seg.v === 'ping' && <div className="pg-two"><Term title="npm run live" lines={T15} /><Card c={C1.ws} h={t("ping qoidasi (socket.io standarti)", "правило ping (стандарт socket.io)")}><p>{t("Server har ", "Сервер каждые ")}<b>25 s</b>{t(" ping yuboradi → klient javob beradi.", " шлёт ping → клиент отвечает.")}</p><p><b>20 s</b>{t(" ichida javob yo'q — ulanish o'lik: ", " нет ответа — соединение мертво: ")}<code>ping timeout</code>.</p><p>{t("Eng uzog'i — ", "Самое долгое — ")}<b>45 s</b>.</p></Card></div>}
    {seg.v === 'sum' && <Time15 />}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — server javob bermasa (06)
// ============================================================
function Screen16(p) {
  return MC(p, 16, {
    above: <Term title={t("npm run live · server muzlatildi", "npm run live · сервер заморожен")} lines={['connect · ulangan · transport: polling', 'muzlatildi', 'ping timeout'].map((w) => outPick('06', (l) => l.includes(w))[0]).filter(Boolean)} />,
    after: <Term title="npm run live" lines={T15} />,
  });
}

// ============================================================
//  17 · AI panel yozdi — ikki to'plam (ws1v2-ai)
// ============================================================
const AIG = (n, k, re) => (KOD.AI[n][k] || '').split('\n').filter((l) => re.test(l));
// F-1109-06: xulosa — ikki iqtibos kartasi o'rniga taqqoslash jadvali (ws1v2-ai/XULOSA.md) va xulosa qoidasi
function Cmp17() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Prompt: «jonli buyurtmalar paneli, sahifa o'zi yangilansin, WebSocket bilan» — ishorasiz", "Промпт: «живая панель заказов, страница обновляется сама, через WebSocket» — без подсказок")}</p>
      <table className="z-tbl w1-a17"><tbody>
        <tr><th /><th>1-AI</th><th>2-AI</th></tr>
        <tr><td>{t("Hajm", "Объём")}</td><td>{t("17 fayl, +855 satr", "17 файлов, +855 строк")}</td><td>{t("15 fayl, +512 satr", "15 файлов, +512 строк")}</td></tr>
        <tr className="w"><td>{t("Transport", "Транспорт")}</td><td>{t("xom ws, socket.io emas", "голый ws, не socket.io")} <span className="f">{t("o'quvchi darsi socket.io", "урок ученика — socket.io")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr><td>{t("Qayta ulanish", "Переподключение")}</td><td>{t("o'zi qo'lda yozgan · 30 s ping", "написал сам вручную · ping 30 s")}</td><td>{t("o'zi qo'lda yozgan", "написал сам вручную")}</td></tr>
        <tr className="w"><td>Token</td><td>{t("o'zi qo'shdi", "добавил сам")} <span className="g">{t("yaxshi", "хорошо")}</span>{t(" — lekin URL'da ?token=", " — но в URL ?token=")} <span className="f">{t("loglarda qoladi", "остаётся в логах")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("Hodisada", "В событии")}</td><td>{t("butun buyurtma, telefon bilan", "весь заказ, с телефоном")} <span className="f">{t("har panelga", "в каждую панель")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("Mavjud kod", "Существующий код")}</td><td>{t("order.service.spec.ts o'zgardi (+4 test)", "order.service.spec.ts изменён (+4 теста)")}</td><td>{t("o'zgardi (+3 test)", "изменён (+3 теста)")}</td></tr>
        <tr className="w"><td>{t("O'z sinovi", "Своя проверка")}</td><td>{t("mock baza · 11/11", "mock-база · 11/11")} <span className="f">{t("Postgres yo'q", "нет Postgres")}</span></td><td>{t("mock servis · 10/10", "mock-сервис · 10/10")} <span className="f">{t("Postgres yo'q", "нет Postgres")}</span></td></tr>
      </tbody></table>
    </div>
    <div className="z-rule">{t("Ikkalasi ishonchli ko'rinadi, testlari yashil — lekin ", "Оба выглядят надёжно, тесты зелёные — но ")}<b>{t("bazasiz sinagan", "проверяли без базы")}</b>{t(". Keyingi ekranda haqiqiy bazada sinaymiz.", ". На следующем экране проверим на настоящей базе.")}</div>
  </div>;
}
const S17 = mkS(17, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'quote' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("gateway, token, hodisa, panel, uch holat", "gateway, токен, событие, панель, три состояния")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("bitta prompt → ikki panel → haqiqiy bazada sinov", "один промпт → две панели → проверка на настоящей базе")}</p></div>
    </div>}
    {seg.v === 'prompt' && <div style={{ marginTop: 10 }}><AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: socket.io, token, hodisa tarkibi yo'q", "без подсказок: нет socket.io, токена, состава события")} /></div>}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<>{KOD.AI.ai1.stat}{t(" · xom ", " · голый ")}<code>ws</code> (<code>@nestjs/platform-ws</code>) · <code>ws://…/admin/ws?token=…</code>{t(" · ulanganda 30 ta (snapshot), keyin ", " · при подключении 30 (snapshot), потом ")}<code>order/created</code>, <code>order/updated</code> — <b>{t("butun buyurtma", "весь заказ")}</b> · <code>OrderService</code>{t(" va uning testi o'zgardi · ", " и его тест изменены · ")}<code>timingSafeEqual</code>, <code>textContent</code></>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<>{KOD.AI.ai2.stat}{t(" · xuddi shu yo'l: xom ", " · тот же путь: голый ")}<code>ws</code> · <code>/ws/orders?token=…</code> · snapshot 50 ta · <code>created</code> / <code>updated</code>{t(" — butun buyurtma · ", " — весь заказ · ")}<code>OrderService</code>{t(" va testi o'zgardi", " и тест изменены")}</>} />
    </div>}
    {seg.v === 'quote' && <Cmp17 />}
  </>} />;
}

// ============================================================
//  18 · AI panellari haqiqiy bazada (ws1v2-ai/*/01–04)
// ============================================================
const AIROW = (n) => {
  const tl = KOD.AI[n]['01'] || '', s = KOD.AI[n]['02'] || '', c = KOD.AI[n]['03'] || '';
  return [(/chiqish kodi: 0/.test(tl) ? '✓' : '✗'), (tl.match(/Tests:\s+(\d+ passed, \d+ total)/) || [])[1] || '?', (s.match(/NATIJA: (\d+\/\d+)/) || [])[1] || '?', (c.match(/close (\d+ [\w ]+)/) || [])[1] || '?'];
};
const T18 = (KOD.AI.ai2['04'] || '').split('\n').filter((l) => /xabar|open/.test(l)).map((l) => ({ h: liveLine(l.length > 190 ? l.slice(0, 190) + '…' : l) }));
const FOUR18 = ["Qaysi kutubxona — o'quvchi darsidagi socket.io'mi?", "Token qayerda — manzilda (?token=) emasmi?", 'Hodisada nima bor — va uni kim oladi?', "Mavjud fayllardan nima o'zgardi — git diff --stat, testlar"];
const S18 = mkS(18, [{ v: 'tab' }, { v: 'log' }, { v: 'vs' }, { v: 'four' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'tab' && <table className="c1-res"><thead><tr><th /><th>tsc</th><th>npm test</th><th>smoke (PostgreSQL)</th><th>{t("tokensiz", "без токена")}</th></tr></thead>
      <tbody>{[['1-AI', 'ai1'], ['2-AI', 'ai2']].map(([h, n]) => <tr key={n}><td>{h}</td>{AIROW(n).map((x, i) => <td key={i} className={i < 3 ? 'ok' : ''}>{x}</td>)}</tr>)}</tbody></table>}
    {seg.v === 'log' && <Term title={t("xom ws klienti · 2-AI · token bilan, bot buyurtma oldi, admin tasdiqladi", "голый клиент ws · 2-й AI · с токеном, бот получил заказ, админ подтвердил")} lines={T18} />}
    {seg.v === 'vs' && <div className="pg-two">
      <div className="c1-state" style={{ '--c': T.green }}><span className="belgi">{t("Bizniki", "Наш")}</span><code>{"io({ auth: { token } })"}</code><p>{t("manzil toza — token ulanish ma'lumotida", "адрес чистый — токен в данных подключения")}</p><code>{'order-changed { orderId, reason }'}</code><p>{t("ma'lumot — token bilan GET'da", "данные — в GET с токеном")}</p></div>
      <div className="c1-state" style={{ '--c': T.accent }}><span className="belgi">AI</span><code>{AIG('ai2', '04', /ulanmoqda.*token=/)[0] ? AIG('ai2', '04', /ulanmoqda.*token=/)[0].replace(/^\S+ ulanmoqda… /, '') : 'ws://…/ws/orders?token=…'}</code><p>{t("token manzilda — tarix va loglarga yoziladi", "токен в адресе — пишется в историю и логи")}</p><code>created {'{ id, customer, phone, items… }'}</code><p>{t("har hodisada mijoz telefoni", "в каждом событии телефон клиента")}</p></div>
    </div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI real vaqt kodini qabul qilish — to'rt savol", "Приём кода реального времени от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR18.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — token URL'da
// ============================================================
function Screen19(p) {
  const ai = AIG('ai2', '04', /ulanmoqda.*token=/)[0] || '';
  const our = outPick('04', (l) => /ulanmoqda…/.test(l))[0];
  return MC(p, 19, {
    above: <div style={{ display: 'grid', gap: 8 }}><Term title={t("xom ws klienti · 2-AI", "голый клиент ws · 2-й AI")} lines={jt(ai)} /><CodePanel file={t("admin.html · bizniki", "admin.html · наш")} lines={kod('HTML', { [H.ul + 2]: 'i' }, H.ul + 2, H.ul + 2)} focus={['i']} /></div>,
    after: <div className="pg-two"><Term title={t("AI — token manzilda", "AI — токен в адресе")} lines={jt(ai)} er /><Term title={t("bizniki — manzil toza", "наш — адрес чистый")} lines={our ? [our] : []} /></div>,
  });
}

// ============================================================
//  20 · Amaliyot 3 — AI'ga aniq prompt (MD 20-ekrandan aynan)
// ============================================================
const PROMPT20 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P20 = mkPractice(20, [[], [0, 1], [2, 3], []], { code: [{ step: 0, file: 'prompt.txt', lines: PROMPT20 }] });
function ScreenP20(p) { return <Practice p={p} S={P20.S} steps={P20.steps} trouble={P20.trouble} proof={P20.proof} code={P20.code} tree={['prompt.txt', F.html, F.gw, F.ctrl]} />; }

// ============================================================
//  21 · m10-02 xaritasi (WebSocketBasicsLesson.jsx — SCREEN_META 20)
// ============================================================
const BLOK21 = [['1 Kirish', 's0 ekran yangilanmaydi · s1 reja', "so'rov–javobda server gapirmaydi (2-ekran)"], ['2 Ulanish', "s2–s4 yo'l yopiq / ochiq · s5–s6 konvert · s7–s8 token", "tokensiz — bir lahza connect (5) · return (6)"], ['3 Tinglovchi', 's9 kod oynasi', '() => yukla qavssiz (11)'], ['4 Holat', "s10–s11 uch belgi, uzilishda hodisa yo'qoladi", '45 s (15)'], ['5 Sxema va amaliyot', "s12–s14 sxema · A1 o'z repo + Render · A2 README", 'Render uxlashi, telefon — sinfda']];
const S21 = mkS(21, [{ v: 'cards' }, { v: 'cards', rule: true }, { v: 'blok' }, { v: 'teg' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m10-02 (20 ekran)", "Ученик · m10-02 (20 экранов)")} hl><p><b>Maydon Jamoa</b>{t(" — ikki telefon, biri eski «8 / 10» · yopiq va ochiq yo'l · konvert ", " — два телефона, на одном старое «8 / 10» · закрытая и открытая дорога · конверт ")}<code>{'oyin-ozgardi { oyinId, sabab }'}</code>{t(" (son yo'q) · token bilan ulanish · tinglovchi · uch belgi · real vaqt sxemasi · amaliyot: ", " (без числа) · соединение с токеном · слушатель · три знака · схема реального времени · практика: ")}<code>maydon-jamoa</code> + Render</p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest panel · gateway · ", "Панель OrderBotNest · gateway · ")}<code>order-changed</code>{t(" · uch holat · ping 45 s · AI", " · три состояния · ping 45 с · AI")}</p>{seg.rule && <p style={{ marginTop: 6 }}><b>{t("Qoidalar bir xil:", "Правила те же:")}</b>{t(" socket.io, token ulanishda, konvert, qayta so'rash, uch belgi.", " socket.io, токен при соединении, конверт, повторный запрос, три знака.")}</p>}</Card>
    </div>}
    {seg.v === 'blok' && <table className="pg-dict"><tbody>{BLOK21.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>}
    {seg.v === 'teg' && <div className="pg-two"><Card c={T.ink3} h="m12-dars-02-done"><p>{t("ulanish bor, ", "соединение есть, ")}<b>{t("hodisa yo'q", "события нет")}</b>{t(" — son o'zi o'zgarmaydi (xato emas)", " — число само не меняется (не ошибка)")}</p></Card><Card c={T.green} h="m12-dars-03-done"><p>{t("hodisa bor — ", "событие есть — ")}<code>oyin-ozgardi</code>{t(", ilova ", ", приложение заново запрашивает ")}<code>GET /oyinlar</code>{t(" ni qayta so'raydi", " ")}</p></Card></div>}
  </>} />;
}

// ============================================================
//  22 · O'quvchi so'zlari va real vaqt sxemasi (README'lar, ulanish.ts)
// ============================================================
const DICT22 = [["yopiq yo'l / ochiq yo'l", "so'rov–javob / doimiy ulanish"], ['konvert', 'hodisa (oyin-ozgardi · bizda order-changed) — ichida son yo\'q'], ['belgi', 'ulanish holati (connected, active)'], ['tinglovchi', 'ulanish.on(…)'], ["qayta so'rash", 'GET /oyinlar · bizda GET /admin/orders']];
const MJ_ON = lineN('MJ_ULANISH', /ulanish\?\.on\('oyin-ozgardi'/), MJ_CON = lineN('MJ_ULANISH', /ulanish\.on\('connect'/);
const S22 = mkS(22, [{ v: 'dict' }, { v: 'ob' }, { v: 'mj' }, { v: 'ul' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT22.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'ob' && <CodePanel file="OrderBotNest · README.md · ws1-done" lines={kod('README', {}, null, null)} />}
    {seg.v === 'mj' && <CodePanel file="maydon-jamoa · README.md · m12-dars-03-done" lines={kod('MJ_README', {}, null, null)} />}
    {seg.v === 'ul' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="maydon-jamoa · mobil/src/ulanish.ts" lines={kod('MJ_ULANISH', { [MJ_CON]: 'c', [MJ_ON]: 'o' }, MJ_CON, MJ_ON + 2)} focus={['c', 'o']} />
      <div className="n2-warn">{t(<>Tinglovchi <code>connect</code> <b>ichida</b></>, <>Слушатель <b>внутри</b> <code>connect</code></>)}{t(" qo'shiladi — har qayta ulanishda yana bittasi. Hozir ishlaydi; WebSocket-2 da buzib ko'ramiz. Sinfda tuzatmang — belgilang.", " добавляется — при каждом переподключении ещё один. Сейчас работает; на WebSocket-2 сломаем. В классе не исправляйте — отметьте.")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const CARDS23 = [['Belgi bir lahza yashil, keyin qizil', 'io server disconnect', 'token — qayta kirish'], ['Belgi sariq, keyin yashil', 'transport close → connect', 'server qayta yondi — normal'], ["Uchish rejimida belgi o'zgarmadi", '45 s gacha ping timeout', 'kuting'], ["Son o'zi o'zgarmadi", "hodisa yo'q (m12-dars-02)", 'xato emas — keyingi teg'], ["Birinchi ulanish cho'zildi", 'Render uxlagan', 'bir daqiqa kuting'], ['Terminalda «null» / «panel ulandi» rad etilganda', "return yo'q", '6-ekran']];
const QA23 = [
  ['«WebSocket va socket.io bir narsami?»', "socket.io — kutubxona: imkon bo'lsa WebSocket orqali, bo'lmasa polling; qayta ulanish va ping tayyor."],
  ["«Nega hodisada son yo'q?»", "Ikki kishi birdan qo'shilsa adashmasin — son har doim Backend'dan."],
  ['«Uzilgan paytdagi hodisa keyin keladimi?»', "Yo'q: socket.io eski hodisani saqlamaydi; qayta ulanganda qayta so'rash kerak — keyingi dars."],
  ['«Token muddati tugasa?»', "Keyingi ulanishda Backend yopadi — «Ulanmagan», qayta kirish."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'a' }, { v: 'b' }, { v: 'qa' }, { v: 'qa' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {(seg.v === 'a' || seg.v === 'b') && <div className="pg-three">{CARDS23.slice(seg.v === 'a' ? 0 : 3, seg.v === 'a' ? 3 : 6).map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${(seg.v === 'a' ? 1 : 4) + i} · ${h}`}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: so'rov–javob, token, return, hodisa tarkibi, tinglovchi, uch holat, ping va AI'ning tokeni. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi ekran o'zgarmayapti desa, avval belgiga, keyin server terminaliga qaraysiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'q', t: "So'rov–javobda server faqat so'ralganda javob beradi; jonli panel uchun doimiy ulanish — socket.io: avval polling, keyin websocket, HTTP bilan bitta portda", st: ['q'] },
  { k: 'gw', t: "Gateway: handleConnection da client.handshake.auth.token — noto'g'ri bo'lsa disconnect() va return (aks holda log yolg'on); token bitta joyda (isAdminToken), bo'sh token ham rad", st: ['gw'] },
  { k: 'ev', t: "Hodisa tranzaksiya tugagach: await place(…) → orderChanged(id, 'new'); ichida faqat { orderId, reason } — panel GET /admin/orders ni token bilan qayta so'raydi (konvert)", st: ['ev'] },
  { k: 'pn', t: "Panel: io({ auth: { token } }) (token manzilda emas), tinglovchi () => yukla() (qavs bilan), matn esc() bilan", st: ['ev'] },
  { k: 'st', t: "Uch holat: ulangan · ulanmoqda (active=true: transport close, xhr poll error, ping timeout ≤ 45 s) · ulanmagan (active=false: io server disconnect — token). Server yongach klient o'zi ulanadi", st: ['st'] },
  { k: 'ai', t: "AI real vaqt kodiga to'rt savol: kutubxona (socket.io'mi) · token qayerda · hodisada nima, kim oladi · mavjud fayllardan nima o'zgardi; haqiqiy baza bilan tekshiring (npm run smoke -- live)", st: ['ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + admin paneli); har band rasmning o'z qismini yoritadi.
// Panel belgilari — admin.html dagi haqiqiy yozuvlar (Ulangan · Ulanmoqda… · Ulanmagan), shuning uchun tarjima qilinmaydi
const PNL = (steps, res, badge) => ({ get name() { return t('Admin panel', 'Админ-панель'); }, steps, res, badge });
const MAP25 = {
  q: { on: ['telegram'], jest: PNL([['GET /admin/orders', ''], ['socket.io', 'ok']], 'pass', 'Ulangan') },
  gw: { on: ['telegram'], jest: PNL([['token', 'ok'], ['disconnect() · return', 'ok']], 'pass', 'Ulangan') },
  ev: { on: LIVE_ON, chat: CHAT_LIVE, jest: PNL([['orderChanged', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
  pn: { on: LIVE_ON, chat: CHAT_LIVE, jest: PNL([["io({ auth: { token } })", 'ok']], 'pass', 'Ulangan') },
  st: { on: ['telegram'], jest: PNL([['transport close', 'bad'], ['xhr poll error', 'bad']], '?', 'Ulanmoqda…') },
  ai: { on: LIVE_ON, chat: CHAT_LIVE, jest: PNL([['npm run smoke -- live', 'ok']], 'pass', 'Ulangan') },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.ev;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — bot buyurtma oladi, panel o'zi ko'rsatadi", 'Сегодняшний урок — бот получает заказ, панель показывает сама')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "API — admin.controller.ts: @Get('stock') — token → mahsulotlar (nom, qoldiq)", c: ['curl -s localhost:3000/admin/stock -H "Authorization: Bearer <token>"'] },
  { t: 'Test — admin.controller.spec.ts: tokensiz 401, token bilan 200 va ro\'yxat', c: ['npm test -- admin'] },
  { t: "Panel — admin.html: yukla() ichida ombor ham qayta so'raladi, ro'yxat pastda (yangi hodisa ochilmaydi)", c: [] },
  { t: "README — «Jonli panel» jadvaliga «ombor qoldig'i» qatori", c: [] },
  { t: 'Topshirish — git push → repo linki platformadagi uyga vazifaga', c: ['git add . && git commit -m "panel: ombor qoldig\'i"', 'git push'] },
];
const CHEATSHEET25 = `# WebSocket — mentor eslatmasi (OrderBotNest, jonli panel)
## Loyiha
git fetch --tags · git checkout ws1-start (= cicd2-done) → ws1-done (src/api/live/, public/admin.html, scripts/live-client.js) · .env: ADMIN_PANEL_TOKEN=<so'z> · npm run start:dev → http://localhost:3000/admin
## So'rov–javob vs doimiy ulanish
GET /admin/orders — server faqat so'ralganda javob beradi (polling — qayta-qayta so'rash) · socket.io — bir marta ulanish, server o'zi yuboradi; avval polling, keyin websocket; HTTP bilan bitta portda
## Gateway qolipi (live.gateway.ts)
@WebSocketGateway() · handleConnection(client): if (!isAdminToken(client.handshake.auth?.token)) { client.disconnect(); return; } · client.data.admin = true · orderChanged(orderId, reason): this.server?.emit('order-changed', { orderId, reason })
return unutilsa: klient yopiladi, lekin keyingi satrlar bajariladi — log «panel ulandi» yolg'on
## Hodisa — tranzaksiyadan keyin, konvert
const order = await this.orders.place(…) → this.live.orderChanged(order.id, 'new') · setStatus → 'status' · ichida faqat { orderId, reason }; panel GET /admin/orders (Authorization: Bearer) ni qayta so'raydi
## Panel qolipi (admin.html)
<script src="/socket.io/socket.io.js"> · ulanish = io({ auth: { token } }) · on('connect') → Ulangan · on('disconnect'|'connect_error') → ulanish.active ? Ulanmoqda : Ulanmagan · on('order-changed', () => yukla()) — qavs bilan! · esc() — Telegram'dan kelgan matn
## Uch holat va xabarlar
Ulangan — connect · Ulanmoqda (active=true) — transport close (server o'chdi), xhr poll error (server yo'q), ping timeout (≤ 45 s javobsiz) · Ulanmagan (active=false) — io server disconnect (token)
ping: server har 25 s, 20 s javob kutadi → 45 s
## Tekshirish
npm run live · npm run live -- notogri · npm run live -- "" · npm run smoke -- live (4 band) · CI smoke job — 9/9
## AI real vaqt kodiga to'rt savol
kutubxona (socket.io'mi — o'quvchi darsi bilan bir xil) · token qayerda (?token= — tarix va loglarda) · hodisada nima (telefonmi?) · mavjud fayllardan nima o'zgardi (OrderService, testlar)
## Sinfga tayyorgarlik (m10-02, 20 ekran)
Maydon Jamoa «8 / 10» · yopiq/ochiq yo'l = so'rov–javob/doimiy ulanish · konvert = hodisa (oyin-ozgardi { oyinId, sabab }) · belgi = holat · tinglovchi = ulanish.on · m12-dars-02 — hodisa yo'q (xato emas), m12-dars-03 — bor · ulanish.ts: tinglovchi connect ichida — WebSocket-2
## Sinfdagi holatlar
bir lahza yashil → qizil: token · sariq → yashil: server qayta yondi · uchish rejimi: 45 s · son o'zgarmadi: m12-dars-02 · Render uxlagan: 1 daqiqa · «null»: return yo'q
## Sizning uyga vazifangiz (40–60 daqiqa)
GET /admin/stock (token, test) · panelda ombor qoldig'i — order-changed dan keyin qayta so'raladi · README jadvali · repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "So'rov–javobda server <b>o'zi gapirmaydi</b>; socket.io — doimiy ulanish", "Birinchi: so'rov–javobda server faqat so'ralganda javob beradi. Jonli panel uchun doimiy ulanish kerak: socket.io, avval polling, keyin websocket, HTTP bilan bitta portda.", { hl: 'q' }),
  sg('b2', "Gateway: token ulanishda, <b>disconnect va return</b>", "Ikkinchi: gateway har ulanishda handshake auth token'ni tekshiradi. Noto'g'ri bo'lsa disconnect va return. Return unutilsa, klient yopiladi, lekin log yolg'on gapiradi.", { hl: 'gw' }),
  sg('b3', "Hodisa <b>tranzaksiyadan keyin</b>, ichida faqat «nima o'zgardi»", "Uchinchi: hodisa tranzaksiya tugagach yuboriladi va ichida faqat buyurtma raqami va sabab. Panel yangi ro'yxatni token bilan qayta so'raydi. Ma'lumotning manbai bitta, baza.", { hl: 'ev' }),
  sg('b4', "Panel: <b>auth'da token</b>, tinglovchida <b>qavs</b>, matn esc bilan", "To'rtinchi: panel tokenni manzilda emas, auth'da yuboradi. Tinglovchida yukla qavs bilan chaqiriladi, qavssiz ro'yxat yangilanmaydi. Mijoz ismi esc bilan, matn sifatida.", { hl: 'pn' }),
  sg('b5', "<b>Uch holat</b>: ulangan · ulanmoqda · ulanmagan; ping 45 s", "Beshinchi: uch holat. Ulanmoqda, active true: server o'chgan, javob bermayapti, ping timeout qirq besh soniyagacha. Ulanmagan, active false: server yopdi, token. Server yongach klient o'zi ulanadi.", { hl: 'st' }),
  sg('b6', "AI real vaqt kodiga <b>to'rt savol</b> va haqiqiy baza", "Oltinchi: AI yozgan real vaqt kodiga to'rt savol: qaysi kutubxona, token qayerda, hodisada nima, mavjud fayllardan nima o'zgardi. Va har doim haqiqiy baza bilan tekshiring: npm run smoke live.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: panelga ombor qoldig'i — yangi hodisasiz", "Uyga vazifa: panelga ikkinchi real vaqt nuqtasi, ombor qoldig'i. Yangi hodisa ochmang: order changed kelganda ombor ham qayta so'ralsin. Buning uchun get admin stock, token bilan, va unga test.", { hl: 'hw' }),
  sg('hw2', "README jadvaliga qator; <b>repo linki platformaga</b>", "README'dagi jonli panel jadvaliga ombor qatorini qo'shing. Buyurtmani bekor qilib, qoldiq o'zi o'sganini ko'ring. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: gateway va panel qoliplari, uch holat, AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: gateway va panel qoliplari, hodisa qoidasi, uch holat va xabarlari, ping, tekshirish buyruqlari, AI'ga to'rt savol, m10-02 lug'ati va sinfdagi holatlar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('websocket-jonli-panel-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" yangi hodisa ochilmagan (", " новое событие не заведено (")}<code>order-changed</code>{t(" yetadi) · ", " хватает) · ")}<code>/admin/stock</code>{t(" token bilan himoyalangan va testlangan · README jadvali.", " защищён токеном и протестирован · таблица README.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("WebSocket: ulanish uzilsa", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Uzilish paytidagi buyurtma, takror tinglovchi va qayta ulanishda qayta so'rash", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · WebSocket", "Курс для менторов · WebSocket")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["so'rov–javob va doimiy ulanish farqini ko'rsatasiz: socket.io, gateway, token", "bot buyurtma olganda hodisa yuborasiz — admin paneli sahifani yangilamasdan ko'rsatadi", "panel belgisi va server logidan uzilish sababini topasiz, AI kodini to'rt savol bilan tekshirasiz"], ['покажете разницу запрос–ответ и постоянного соединения: socket.io, gateway, токен', 'отправите событие, когда бот получил заказ, — админ-панель покажет без перезагрузки', 'найдёте по значку панели и логу сервера причину обрыва, проверите код AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 12-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: CI/CD-2 darsi (OrderBotNest nusxangiz), Telegraf darsidagi bot tokeni va PostgreSQL, Node.js 20+, VS Code, brauzer, AI yordamchi · Loyiha: ws1-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 12-го экрана можно сделать перерыв · Нужно: урок CI/CD-2 (ваша копия OrderBotNest), токен бота и PostgreSQL из урока Telegraf, Node.js 20+, VS Code, браузер, AI-помощник · Проект: тег ws1-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={LIVE_ON} chat={CHAT_LIVE} jest={PANEL} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, ScreenP20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = [ScreenP7, ScreenP12, ScreenP20].filter((S) => SCREENS.includes(S)).length; // 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi
export default function WsBasicsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/ws1-*.json, ru/ws1-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/ws1-sahna.js) ---
// WebSocket-1 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
// Panel yorliqlari (Ulangan / Ulanmoqda… / Ulanmagan) — OrderBotNest admin.html ning haqiqiy matni, o'zgarmaydi.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Gateway и токен', 'Событие и панель', 'Состояние соединения', 'AI', 'Подготовка к классу'] },
};
ru(FLOW, [[null, 'Бот', 'Бобур «Buyurtma berish»', null], [null, null, 'транзакция · COMMIT', null], null, [null, 'Панель', 'слушатель → yukla()', null], [null, null, 'с токеном · из базы', null]]);
ru(STATES, [[null, null, null, 'connect · события приходят', 'соединение открыто'], [null, null, null, null, 'active=true — клиент сам пытается снова'], [null, null, null, null, 'active=false — сервер закрыл (токен), клиент не пытается']]);
ru(CAUSE6, ['client.disconnect() — соединение закрывается, но из функции не выходит', 'нет return — следующие строки всё равно выполняются', 'client.data.admin = true и лог «panel ulandi» — для отклонённого клиента', 'Если потом сюда добавят комнату или право — отклонённый клиент их получит']);
ru(FOUR18, ['Какая библиотека — socket.io, как в уроке ученика?', 'Где токен — не в адресе (?token=)?', 'Что в событии — и кто его получает?', 'Что изменилось в существующих файлах — git diff --stat, тесты']);
ru(BLOK21, [['1 Вступление', 's0 экран не обновляется · s1 план', 'в запросе–ответе сервер не говорит (экран 2)'], ['2 Соединение', 's2–s4 дорога закрыта / открыта · s5–s6 конверт · s7–s8 токен', 'без токена — мгновенный connect (5) · return (6)'], ['3 Слушатель', 's9 окно кода', '() => yukla без скобок (11)'], ['4 Состояние', 's10–s11 три знака, при обрыве событие теряется', '45 с (15)'], ['5 Схема и практика', 's12–s14 схема · A1 свой репозиторий + Render · A2 README', 'Render засыпает, телефон — в классе']]);
ru(DICT22, [['закрытая дорога / открытая дорога', 'запрос–ответ / постоянное соединение'], ['конверт', 'событие (oyin-ozgardi · у нас order-changed) — внутри нет числа'], ['знак', 'состояние соединения (connected, active)'], ['слушатель', null], ['запросить заново', 'GET /oyinlar · у нас GET /admin/orders']]);
ru(CARDS23, [['Знак на мгновение зелёный, потом красный', null, 'токен — войти заново'], ['Знак жёлтый, потом зелёный', null, 'сервер снова включился — нормально'], ['В авиарежиме знак не изменился', 'ping timeout до 45 с', 'подождите'], ['Число само не изменилось', 'нет события (m12-dars-02)', 'не ошибка — следующий тег'], ['Первое соединение затянулось', 'Render спал', 'подождите минуту'], ['В терминале «null» / «panel ulandi» при отказе', 'нет return', 'экран 6']]);
ru(QA23, [
  ['«WebSocket и socket.io — одно и то же?»', 'socket.io — библиотека: если можно, через WebSocket, иначе polling; переподключение и ping готовы.'],
  ['«Почему в событии нет числа?»', 'Чтобы не сбиться, если двое присоединятся сразу — число всегда из Backend.'],
  ['«Событие во время обрыва придёт потом?»', 'Нет: socket.io не хранит старое событие; при переподключении надо запросить заново — следующий урок.'],
  ['«Если истечёт срок токена?»', 'При следующем соединении Backend закроет — «Ulanmagan», войти заново.'],
]);
ru(SUM25, [
  { t: 'В запросе–ответе сервер отвечает, только когда спросили; для живой панели — постоянное соединение — socket.io: сначала polling, потом websocket, на одном порту с HTTP' },
  { t: 'Gateway: в handleConnection client.handshake.auth.token — если неверный, disconnect() и return (иначе лог врёт); токен в одном месте (isAdminToken), пустой тоже отклоняется' },
  { t: 'Событие после транзакции: await place(…) → orderChanged(id, \'new\'); внутри только { orderId, reason } — панель заново запрашивает GET /admin/orders с токеном (конверт)' },
  { t: 'Панель: io({ auth: { token } }) (токен не в адресе), слушатель () => yukla() (со скобками), текст через esc()' },
  { t: 'Три состояния: ulangan · ulanmoqda (active=true: transport close, xhr poll error, ping timeout ≤ 45 с) · ulanmagan (active=false: io server disconnect — токен). Когда сервер включился, клиент подключается сам' },
  { t: 'Четыре вопроса к коду реального времени от AI: библиотека (socket.io?) · где токен · что в событии, кто получает · что изменилось в существующих файлах; проверяйте с настоящей базой (npm run smoke -- live)' },
]);
ru(HOMEWORK25, [
  { t: 'API — admin.controller.ts: @Get(\'stock\') — токен → товары (имя, остаток)' },
  { t: 'Тест — admin.controller.spec.ts: без токена 401, с токеном 200 и список' },
  { t: 'Панель — admin.html: внутри yukla() заново запрашивается и склад, список внизу (новое событие не открывается)' },
  { t: 'README — строка «остаток склада» в таблице «Живая панель»' },
  { t: 'Сдача — git push → ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.TITLE = 'Живая панель: сервер сам присылает сообщение';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 4 проверки · самопроверка 8 вопросов. После экрана 12 можно сделать перерыв', 'Нужно: урок для менторов CI/CD-2 (ваша копия OrderBotNest) · токен бота и PostgreSQL с урока Telegraf · Node.js 20+ · VS Code · браузер · AI-помощник', 'Проект: github.com/Azizbekcrypto/OrderBotNest — ws1-start (= cicd2-done) → ws1-done; каждый вывод — с настоящих сервера, базы и браузера'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: запрос–ответ, токен, return, состав события, слушатель, три состояния, ping и токен у AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет, что экран не меняется, вы сначала посмотрите на знак, потом в терминал сервера.';
RU_S.NEXT_T = 'WebSocket: если соединение оборвалось';
RU_S.NEXT_D = 'Заказ во время обрыва, повторный слушатель и повторный запрос при переподключении';
RU_S.FILE = 'websocket-zhivaya-panel-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['В запросе–ответе сервер <b>сам не говорит</b>; socket.io — постоянное соединение', 'Первое: в запросе–ответе сервер отвечает, только когда спросили. Для живой панели нужно постоянное соединение: socket.io, сначала polling, потом websocket, на одном порту с HTTP.'],
  b2: ['Gateway: токен при соединении, <b>disconnect и return</b>', 'Второе: gateway при каждом соединении проверяет handshake auth token. Если неверный — disconnect и return. Если забыть return, клиент закроется, но лог будет врать.'],
  b3: ['Событие <b>после транзакции</b>, внутри только «что изменилось»', 'Третье: событие отправляется после завершения транзакции, внутри только номер заказа и причина. Новый список панель заново запрашивает с токеном. Источник данных один — база.'],
  b4: ['Панель: <b>токен в auth</b>, у слушателя <b>скобки</b>, текст через esc', 'Четвёртое: панель отправляет токен не в адресе, а в auth. В слушателе yukla вызывается со скобками, без скобок список не обновится. Имя клиента — через esc, как текст.'],
  b5: ['<b>Три состояния</b>: ulangan · ulanmoqda · ulanmagan; ping 45 с', 'Пятое: три состояния. «Подключается», active true: сервер выключен, не отвечает, ping timeout до сорока пяти секунд. «Не подключено», active false: сервер закрыл, токен. Когда сервер включился, клиент подключается сам.'],
  b6: ['<b>Четыре вопроса</b> к коду реального времени от AI и настоящая база', 'Шестое: к коду реального времени от AI — четыре вопроса: какая библиотека, где токен, что в событии, что изменилось в существующих файлах. И всегда проверяйте с настоящей базой: npm run smoke live.'],
  hw: ['<b>Домашнее задание</b>: остаток склада в панели — без нового события', 'Домашнее задание: вторая точка реального времени в панели — остаток склада. Новое событие не открывайте: когда приходит order changed, пусть заново запрашивается и склад. Для этого get admin stock, с токеном, и тест на него.'],
  hw2: ['Строка в таблице README; <b>ссылка на репозиторий — на платформу</b>', 'Добавьте строку склада в таблицу живой панели в README. Отмените заказ и посмотрите, как остаток вырос сам. Выложите на GitHub и вставьте ссылку в домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: шаблоны gateway и панели, три состояния, вопросы к AI — на одной странице', 'Внизу памятка на одну страницу: шаблоны gateway и панели, правило события, три состояния и их сообщения, ping, команды проверки, четыре вопроса к AI, словарь m10-02 и случаи в классе. Скопируйте или скачайте.'],
};
RU_S.CHEAT = `# WebSocket — памятка ментора (OrderBotNest, живая панель)
## Проект
git fetch --tags · git checkout ws1-start (= cicd2-done) → ws1-done (src/api/live/, public/admin.html, scripts/live-client.js) · .env: ADMIN_PANEL_TOKEN=<слово> · npm run start:dev → http://localhost:3000/admin
## Запрос–ответ vs постоянное соединение
GET /admin/orders — сервер отвечает, только когда спросили (polling — переспрашивать снова и снова) · socket.io — подключиться один раз, сервер шлёт сам; сначала polling, потом websocket; на одном порту с HTTP
## Шаблон gateway (live.gateway.ts)
@WebSocketGateway() · handleConnection(client): if (!isAdminToken(client.handshake.auth?.token)) { client.disconnect(); return; } · client.data.admin = true · orderChanged(orderId, reason): this.server?.emit('order-changed', { orderId, reason })
если забыть return: клиент закрывается, но следующие строки выполняются — лог «panel ulandi» врёт
## Событие — после транзакции, конверт
const order = await this.orders.place(…) → this.live.orderChanged(order.id, 'new') · setStatus → 'status' · внутри только { orderId, reason }; панель заново запрашивает GET /admin/orders (Authorization: Bearer)
## Шаблон панели (admin.html)
<script src="/socket.io/socket.io.js"> · ulanish = io({ auth: { token } }) · on('connect') → Ulangan · on('disconnect'|'connect_error') → ulanish.active ? Ulanmoqda : Ulanmagan · on('order-changed', () => yukla()) — со скобками! · esc() — текст из Telegram
## Три состояния и сообщения
Ulangan — connect · Ulanmoqda (active=true) — transport close (сервер выключен), xhr poll error (сервера нет), ping timeout (≤ 45 с без ответа) · Ulanmagan (active=false) — io server disconnect (токен)
ping: сервер каждые 25 с, ждёт ответа 20 с → 45 с
## Проверка
npm run live · npm run live -- notogri · npm run live -- "" · npm run smoke -- live (4 пункта) · job smoke в CI — 9/9
## Четыре вопроса к коду реального времени от AI
библиотека (socket.io ли — как в уроке ученика) · где токен (?token= — в истории и логах) · что в событии (телефон?) · что изменилось в существующих файлах (OrderService, тесты)
## Подготовка к классу (m10-02, 20 экранов)
Maydon Jamoa «8 / 10» · закрытая/открытая дорога = запрос–ответ/постоянное соединение · конверт = событие (oyin-ozgardi { oyinId, sabab }) · знак = состояние · слушатель = ulanish.on · m12-dars-02 — события нет (не ошибка), m12-dars-03 — есть · ulanish.ts: слушатель внутри connect — WebSocket-2
## Случаи в классе
мгновенно зелёный → красный: токен · жёлтый → зелёный: сервер снова включился · авиарежим: 45 с · число не изменилось: m12-dars-02 · Render спал: 1 минута · «null»: нет return
## Ваше домашнее задание (40–60 минут)
GET /admin/stock (токен, тест) · остаток склада в панели — заново запрашивается после order-changed · таблица README · ссылка на репозиторий на платформу`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxati

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · WebSocket",
  "title": "Админ магазина держит панель открытой на компьютере: бот получил заказ — новая строка появляется сама, без обновления страницы — сегодня делаем это",
  "seg": {
   "a": [
    "Бот получает заказ — <b>панель показывает сама, без обновления страницы</b>",
    "Здравствуйте. Сейчас в OrderBotNest админ узнаёт о новом заказе только из сообщения Telegram. Сегодня делаем для магазина живую панель: страницу, которая открыта на компьютере. Клиент сделал заказ в боте — в панели сама появляется новая строка. На экране результат в конце урока, из настоящего браузера."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: запрос–ответ, постоянное соединение и socket.io",
    "Сначала общее понятие: почему с обычным запросом–ответом панель не обновляется сама, что такое постоянное соединение и что делает socket.io. Потом пишем на сервере gateway: класс, который принимает соединения, с токеном."
   ],
   "c": [
    "Потом <b>событие, страница панели и три состояния соединения</b>; в конце AI и класс",
    "На третьем этапе отправляем событие и читаем страницу панели. На четвёртом смотрим, что показывает панель, если сервер выключен или не отвечает. На пятом проверяем на настоящей базе панель, написанную двумя AI. В конце подготовка к классу."
   ],
   "d": [
    "Шесть этапов, три практики; нужны <b>токен бота и Postgres с урока TgPg</b>",
    "Урок — шесть этапов, три практики. Понадобятся токен бота и база Postgres, которые вы создали на уроке Telegraf: панель будете проверять, делая заказ со своего телефона. Не спешите: каждый экран можно прослушать с начала, урок запоминает, где вы остановились. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "В обычном HTTP сервер отвечает, только когда спросили: если панель не спрашивает, она не знает о заказе Бобура — экран остаётся старым",
  "seg": {
   "a": [
    "Панель <b>спросила <code>GET /admin/orders</code> — пусто</b>; потом Бобур сделал заказ в боте",
    "У нас есть обычный путь: get admin orders, с токеном. Панель спросила, ответ — пустой список. В этот момент клиент Бобур сделал заказ в боте: бот ответил «заказ один принят». Знает ли об этом панель? Нет, она получает ответ, только когда спрашивает."
   ],
   "b": [
    "Во втором запросе <b>заказ есть</b> — но пока панель сама не спросила, экран был старым",
    "Второй запрос: теперь в списке первый заказ, Бобур, клавиатура. В базе данные появились сразу после первого запроса, но пока панель не спросила, экран оставался старым. В запросе–ответе сервер не может заговорить сам."
   ],
   "c": [
    "Два пути: <b>переспрашивать каждые несколько секунд (polling)</b> или постоянное соединение",
    "Путей два. Первый: панель переспрашивает каждые три секунды, это называют polling. Просто, но чаще всего ответ не изменился, и задержка остаётся. Второй: панель подключается один раз, соединение остаётся открытым, и сервер сам сообщает, когда что-то изменилось."
   ],
   "d": [
    "Итог: в запросе–ответе <b>сервер сам не говорит</b>; для живой панели нужно постоянное соединение",
    "Итог: в обычном HTTP сервер отвечает, только когда спросили, а на запрос без токена — четыреста один. Чтобы панель обновлялась сама, сервер должен уметь заговорить сам. Для этого нужно постоянное соединение, на следующем экране его библиотека."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · общее понятие",
  "title": "socket.io — библиотека постоянного соединения: сначала обычные HTTP-запросы (polling), потом переходит на WebSocket; сервер и клиент шлют события когда угодно",
  "seg": {
   "a": [
    "Клиент socket.io подключается: <b>сначала <code>polling</code>, через мгновение <code>websocket</code></b>",
    "Для этого в OrderBotNest используем socket.io. Запустили терминальный клиент: npm run live. Сначала «подключается», потом connect, transport polling: обычные HTTP-запросы. Через мгновение transport websocket: перешёл на постоянное соединение. Если в сети WebSocket закрыт, он останется на polling и всё равно будет работать."
   ],
   "b": [
    "Один порт: <b>и пути HTTP, и WebSocket на <code>3100</code></b> — отдельного сервера нет",
    "Посмотрите на лог сервера: пути admin и admin orders, и сервер на порту три тысячи сто. WebSocket тоже на этом порту, отдельный сервер не нужен. В Nest это делает gateway, напишем его на втором этапе."
   ],
   "c": [
    "Событие — <b>имя и небольшие данные</b>: <code>order-changed</code>, какой заказ и почему",
    "В постоянном соединении сообщение называется событием: имя и небольшие данные. У нас одно событие: order changed, внутри номер заказа и причина: новый или статус. Панель его слушает и заново запрашивает список."
   ],
   "d": [
    "Итог: если на сервере <b>нет gateway, клиент бесконечно <code>xhr poll error</code></b> — WebSocket сам не появится",
    "Итог: у socket.io две стороны: gateway на сервере и библиотека на клиенте. На начальном теге урока gateway нет: клиент бесконечно пишет xhr poll error, страница admin — четыреста четыре. Теперь пишем gateway."
   ]
  }
 },
 "4": {
  "kicker": "Этап 2 · gateway и токен",
  "title": "LiveGateway: при каждом новом соединении handleConnection — проверяет токен; если неверный — disconnect() и return; если верный — пишет лог",
  "seg": {
   "a": [
    "<code>src/api/live/live.gateway.ts</code>: <b><code>@WebSocketGateway()</code> — на одном порту с HTTP</b>",
    "В своей папке OrderBotNest откройте папку src, api, live, файл live gateway ts. Над классом декоратор WebSocket gateway: Nest делает этот класс местом, которое принимает соединения, на одном порту с HTTP. Внутри поле WebSocket server: через него все подключённые панели."
   ],
   "b": [
    "<code>handleConnection</code>: <b><code>handshake.auth.token</code> неверный — <code>disconnect()</code> и <code>return</code></b>",
    "Handle connection вызывается при каждом новом соединении. Первое дело: handshake auth token, токен, который панель прислала при подключении. Если неверный — client disconnect, то есть сервер закрывает соединение, и return. Если верный — client data admin true и лог: панель подключилась."
   ],
   "c": [
    "Правило токена <b>в одном месте: <code>isAdminToken</code></b> — <code>ADMIN_PANEL_TOKEN</code> из <code>.env</code>, пустой тоже отклоняется",
    "Проверка токена — в отдельном файле: admin token ts, функция is admin token. Она сравнивает с токеном панели админа из env и пустой токен тоже отклоняет. Одно правило работает в двух местах: при соединении WebSocket и в запросе get admin orders."
   ],
   "d": [
    "Итог: токен проверяется <b>при открытии соединения</b>; <code>orderChanged</code> — событие всем подключённым панелям",
    "Итог: токен проверяется один раз, при открытии соединения, на следующих событиях повторно нет. Второе дело gateway — функция order changed: server emit, событие всем подключённым панелям. Подключаем live module к telegram module, бот вызывает эту функцию."
   ]
  }
 },
 "5": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "npm run live -- \"\" — подключаемся без токена. Gateway делает disconnect(). Что напишет терминальный клиент?",
  "q": "Вы видели gateway, теперь проверим. Первая проверка. Запустили терминальный клиент без токена. Gateway отклоняет токен и делает disconnect. Что выйдет в терминале клиента? Выберите вариант.",
  "ok": "Верно. Соединение сначала открывается, потому что токен проверяется внутри handle connection, уже после открытия соединения. Поэтому на мгновение connect, потом io server disconnect, active false: к соединению, закрытому сервером, клиент сам не переподключается. Значит, в этом случае знак панели «не подключено», причина — токен.",
  "okShort": "На мгновение <code>connect</code> → <code>io server disconnect</code>, <code>active=false</code> — закрыл сервер, клиент не пытается.",
  "hint": "Когда проверяется токен — до открытия соединения или после? Кто закрыл — сервер или сеть?",
  "demak": "<code>io server disconnect</code> — закрыл сервер (токен); клиент не пытается снова — «Ulanmagan».",
  "opts": [
   "Только connect_error — соединение вообще не открывается, клиент пытается снова и снова",
   "На мгновение connect, потом io server disconnect — клиент не пытается снова",
   "ulanmoqda — клиент каждые 3 секунды пытается переподключиться с токеном",
   "connect, и соединение остаётся открытым, просто не приходят события"
  ],
  "wrong": {
   "0": "Соединение открывается: токен проверяется в handleConnection после открытия.",
   "2": "К соединению, закрытому сервером, socket.io сам не переподключается — active=false.",
   "3": "disconnect() закрывает соединение — открытым оно не остаётся."
  }
 },
 "6": {
  "kicker": "Этап 2 · ломаем",
  "title": "После disconnect() нет return: клиент всё равно закрыт, но лог сервера написал «panel ulandi» — логу больше нельзя верить",
  "seg": {
   "a": [
    "Сломано: <b>после <code>client.disconnect();</code> нет <code>return;</code></b>",
    "Вы удалили строку return. Изменение маленькое, код компилируется. Проверяем клиентом без токена: npm run live, две кавычки."
   ],
   "b": [
    "Клиент: <b>тот же результат — <code>io server disconnect</code></b>; соединение всё равно закрыто",
    "Терминал клиента показывает тот же результат: на мгновение connect, потом io server disconnect, не подключено. Disconnect сработал, соединение закрыто. Со стороны клиента ничего не изменилось."
   ],
   "c": [
    "Лог сервера: <b><code>panel ulandi</code></b> — для отклонённого клиента; в правильном коде этой строки нет",
    "Но посмотрите в лог сервера: Live, панель подключилась. Для отклонённого клиента без токена. В правильном коде, в третьем опыте, этой строки не было вообще. Теперь лог врёт: о том, кто подключился, ему верить нельзя."
   ],
   "d": [
    "Значит, причина: <b><code>disconnect()</code> не выходит из функции</b> — следующие строки всё равно выполняются",
    "Значит, причина одна: disconnect закрывает соединение, но не выходит из функции. Без return следующие строки всё равно выполняются: ставится знак admin, пишется лог. Если позже сюда добавят комнату или право, отклонённый клиент их получит. Восстанавливаем return."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченный в коде <code>return;</code>",
    "Gateway работает правильно: клиент без токена закрывается, в логе ничего нет. Теперь ломаем намеренно. Ломаете вы сами: в файле live gateway ts подсвечена строка return после client disconnect, нажмите на неё: строка удалится.",
    "Нажмите на <b><code>return;</code></b> в <b>live.gateway.ts</b> — строка после <code>client.disconnect();</code> удалится."
   ]
  }
 },
 "7": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "На теге ws1-done запустите сервер, подключитесь терминальным клиентом с токеном, с неверным токеном и без токена, прочитайте лог сервера",
  "seg": {
   "a": [
    "Теперь вы: <b>тег <code>ws1-done</code></b>, токен панели в <code>.env</code>, сервер и клиент",
    "Теперь ваша очередь. В своей папке OrderBotNest переходите на тег ws1 done, пишете в env-файл токен панели админа, запускаете сервер и терминальный клиент. Нужны два терминала: один — сервер, другой — клиент. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>тег, <code>npm install</code>, <code>.env</code>, <code>npm run start:dev</code></b> — в логе пути <code>/admin</code>",
    "На первом шаге git fetch и checkout, потом npm install: есть новые пакеты. На втором добавляете в env строку admin panel token, придуманное вами слово, и npm run start dev. В логе должны выйти пути admin и порт сервера."
   ],
   "c": [
    "Шаги 3–4: <b><code>npm run live</code> во втором терминале</b> — с токеном, неверным, без токена; подтверждение — строка лога сервера",
    "На третьем шаге во втором терминале npm run live: connect, websocket, в логе сервера «панель подключилась». На четвёртом — неверный токен и без токена: io server disconnect. В поле подтверждения скопируйте из лога сервера строку «панель подключилась»."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы умеете проверять постоянное соединение сервера из терминала."
   ]
  },
  "steps": [
   {
    "t": "Тег",
    "exp": "added … packages"
   },
   {
    "t": "Сервер",
    "exp": "Mapped {/admin/orders, GET} · Server 3000-portda ishlayapti",
    "cmds": [
     "в .env ADMIN_PANEL_TOKEN=<ваше слово>",
     null
    ]
   },
   {
    "t": "Клиент",
    "exp": "connect · ulangan · transport: websocket · на сервере [Live] panel ulandi",
    "cmds": [
     "второй терминал: npm run live"
    ]
   },
   {
    "t": "Отказ",
    "exp": "disconnect: io server disconnect · active=false → ulanmagan"
   }
  ],
  "proof": {
   "label": "Строка «panel ulandi» в логе сервера",
   "placeholder": "например: LOG [Live] panel ulandi: -GKZthhgExVB6fHnAAAA",
   "wrong": "Найдите в терминале сервера строку [Live] panel ulandi: … и скопируйте её."
  },
  "trouble": [
   [
    "connect_error: xhr poll error бесконечно",
    "сервер не работает или порт другой — проверьте терминал сервера; если порт другой — LIVE_URL=http://localhost:<port> npm run live"
   ],
   [
    "и с верным токеном io server disconnect",
    "токен в .env и в клиенте отличается или сервер не прочитал .env — перезапустите сервер"
   ],
   [
    "Cannot find module 'socket.io-client'",
    "не сделан npm install (новые пакеты)"
   ],
   [
    "BOT_TOKEN topilmadi",
    "в .env нет токена бота — запишите токен с урока Telegraf"
   ]
  ]
 },
 "8": {
  "kicker": "Этап 3 · событие и панель",
  "title": "Записав заказ в базу, бот делает orderChanged(order.id, 'new'); когда админ меняет статус — 'status'. В событии нет списка: панель запрашивает заново",
  "seg": {
   "a": [
    "<code>telegram.service.ts</code>: <b>после завершения <code>await this.orders.place(…)</code></b> — <code>orderChanged(order.id, 'new')</code>",
    "Откройте файл telegram service ts в папке src, api, telegram, функция place order. Сначала await orders place: транзакция, заказ записан в базу. Только после этого live order changed, номер заказа и new. Благодаря await событие не уходит раньше, чем заказ появится в базе."
   ],
   "b": [
    "Кнопка админа: <b>после завершения <code>setStatus</code> — <code>'status'</code></b> — код бота не изменился, добавлена одна строка",
    "Когда админ нажимает кнопку статуса, тот же шаблон: await orders set status, потом order changed с причиной status. Остальной код бота не изменился, в два места добавлено по одной строке. Сообщение Telegram клиенту уходит как раньше."
   ],
   "c": [
    "В событии <b>только <code>orderId</code> и <code>reason</code></b> — новый список панель запрашивает из <code>GET /admin/orders</code>",
    "Что внутри события? Только номер заказа и причина, нет ни списка, ни телефона клиента. Получив событие, панель снова запрашивает get admin orders, с токеном. Источник данных один: база. В уроке ученика это называется конверт."
   ],
   "d": [
    "Итог: событие говорит <b>«что-то изменилось»</b>; данные — в запросе, с токеном",
    "Итог: событие отправляется после завершения транзакции и говорит только «что-то изменилось». Данные приходят в запросе, защищённом токеном. В admin controller функция list: проверяется токен, последние двадцать заказов, только нужные поля. Теперь откроем страницу панели."
   ]
  }
 },
 "9": {
  "kicker": "Этап 3 · событие и панель",
  "title": "public/admin.html: клиент socket.io с самого сервера; io({ auth: { token } }) — соединение; три состояния; пришёл order-changed — yukla()",
  "seg": {
   "a": [
    "<code>public/admin.html</code>: <b>клиент socket.io <code>/socket.io/socket.io.js</code> — отдаёт сам сервер</b>",
    "Откройте файл admin html в папке public. Обычная HTML-страница, библиотека отдельно не ставится: файл socket io js отдаёт сам сервер, по этому адресу. Страница открывается через get admin, то есть функцию page в admin controller."
   ],
   "b": [
    "<code>ulan()</code>: <b><code>io({ auth: { token } })</code></b> — токен не в адресе, а в данных соединения",
    "Функция ulan: io, auth, token. Токен не пишется в адресную строку, он уходит в данных в момент открытия соединения: gateway читает его из handshake auth. Если connect — знак «подключено», если disconnect — в зависимости от active «подключается» или «не подключено»."
   ],
   "c": [
    "Слушатель: <b><code>ulanish.on('order-changed', () =&gt; yukla())</code></b> — после события запросить заново",
    "Самая важная строка: ulanish on, order changed, yukla. Когда приходит событие, вызывается функция yukla: get admin orders, новый список. Новая строка становится жёлтой: если её id больше прежнего максимального. Список всегда из базы, а не из события."
   ],
   "d": [
    "Итог: имя клиента приходит из Telegram — вставляется <b>как текст через <code>esc()</code></b>",
    "Итог: панель делает три дела: подключается, слушает, запрашивает заново. И одно правило безопасности: имя клиента приходит из Telegram, внутри может быть HTML. Функция esc превращает его в текст, на странице оно не работает как код. Теперь посмотрим настоящий поток."
   ]
  }
 },
 "10": {
  "kicker": "Этап 3 · событие и панель",
  "title": "Панель открыта; Бобур заказывает в боте — новая строка появляется сама; админ подтверждает — статус меняется сам; терминальный клиент тоже видит оба события",
  "seg": {
   "a": [
    "Панель открыта, знак <b>«Ulangan»</b>; в списке прежние заказы",
    "Теперь посмотрим всё вместе. В браузере страница admin, токен введён, знак «подключено», в списке прежние заказы. Это настоящий браузер, настоящий сервер и база. Вместо Telegram — способ из smoke: код бота настоящий, сообщение подаётся изнутри."
   ],
   "b": [
    "Бобур сделал заказ — <b>новая строка жёлтая, страница не обновлялась</b>",
    "Бобур заказал в боте клавиатуру. В панели в самом верху новая строка, жёлтым цветом: новая. Страница не открывалась заново, никто не нажимал кнопку. Сервер отправил событие, панель заново запросила список."
   ],
   "c": [
    "Админ подтвердил — <b>статус «Tasdiqlandi»</b>; терминальный клиент тоже видел два события",
    "Админ Жасур нажал в боте кнопку «подтвердить». В панели статус этой строки стал «подтверждён». Справа терминальный клиент: два order changed, первый new, второй status. А в логе сервера сообщения бота и строка «панель подключилась»."
   ],
   "d": [
    "Итог: этот поток <b>проверяется и в конвейере</b> — smoke <code>live</code>, на GitHub 9/9",
    "Итог: бот, транзакция, событие, панель, повторный запрос. Этот поток добавлен и в smoke: npm run smoke live. В конвейере с урока по CI/CD job smoke с Postgres запускает его при каждом push: на GitHub девять из девяти. Теперь одну ошибку найдёте сами."
   ]
  }
 },
 "11": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4 — какая строка с ошибкой?",
  "title": "В этой панели знак «Ulangan», терминальный клиент получает order-changed, но в браузере новая строка не появляется. Найдите строку-виновника",
  "q": "Вы видели код панели, теперь найдите сами. Вторая проверка. В этой панели знак «подключено», терминальный клиент получает событие, но в браузере новая строка не появляется. Одна строка во фрагменте не вызывает функцию, а только возвращает её. Нажмите на эту строку.",
  "ok": "Верно. Стрелочная функция возвращает yukla, но не вызывает: скобок нет. Событие приходит, слушатель срабатывает, get-запрос не уходит, список остаётся старым. Мы ждали в браузере пятнадцать секунд, список не изменился, а терминальный клиент видел оба события. Значит, если событие приходит, а экран не меняется, проверьте, что внутри слушателя.",
  "okShort": "<code>() =&gt; yukla</code> — функция возвращается, а не вызывается. Событие приходит, <code>GET</code> не уходит.",
  "hint": "В какой строке после имени функции нет скобок?",
  "task": "Правило: при событии функция, которая заново запрашивает список, должна быть <b>вызвана</b>. В этом фрагменте одна строка не вызывает функцию, а только возвращает её. <b>Нажмите на эту строку.</b>"
 },
 "12": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Откройте /admin в браузере, сделайте заказ в боте с телефона — обновляется ли панель сама; потом подтвердите из /orders",
  "seg": {
   "a": [
    "Теперь вы: <b>панель в браузере, бот в телефоне</b> — с настоящим Telegram",
    "Теперь ваша очередь. Сервер работает. Открываете в браузере страницу admin, делаете заказ боту со своего телефона и видите, что панель обновляется сама. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b><code>localhost:3000/admin</code>, токен</b> — знак «Ulangan»; заказ в боте — новая строка",
    "На первом шаге в браузере localhost три тысячи admin, вводите токен: знак «подключено», появляется список. На втором со своего телефона боту: start, каталог, товар и заказ. В панели должна появиться новая жёлтая строка."
   ],
   "c": [
    "Шаги 3–4: <b>подтвердите из <code>/orders</code></b> — статус меняется; <code>npm run smoke -- live</code>; подтверждение — результат smoke",
    "На третьем шаге в боте orders и «подтвердить»: статус в панели меняется. На четвёртом npm run smoke live: тот же поток без Telegram, четыре пункта. В поле подтверждения скопируйте строку результата smoke."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы подключили к своему боту живую страницу сайта и сами её проверили."
   ]
  },
  "steps": [
   {
    "t": "Панель",
    "exp": "знак «Ulangan», список"
   },
   {
    "t": "Заказ",
    "exp": "в панели новая жёлтая строка",
    "cmds": [
     "телефон: боту /start → /catalog → товар → /cart → «✅ Buyurtma berish»"
    ]
   },
   {
    "t": "Подтверждение",
    "exp": "в панели «Tasdiqlandi»",
    "cmds": [
     "в боте /orders → «✅ Tasdiqlash» (в ADMIN_TELEGRAM_IDS ваш id)"
    ]
   },
   {
    "t": "Smoke",
    "exp": "NATIJA: 4/4 ✓"
   }
  ],
  "proof": {
   "label": "Строка результата npm run smoke -- live",
   "placeholder": "например: NATIJA: 4/4 ✓",
   "wrong": "Вставьте строку NATIJA: … в конце npm run smoke -- live — четыре пункта."
  },
  "trouble": [
   [
    "В панели «Token noto'g'ri»",
    "введённое слово не совпадает с ADMIN_PANEL_TOKEN в .env"
   ],
   [
    "Знак «Ulanmoqda…» не меняется",
    "сервер не работает или на другом порту — откройте страницу с этого порта"
   ],
   [
    "Заказ в Telegram есть, в панели новой строки нет",
    "старая страница (до ws1-done) — git checkout ws1-done, перезапуск сервера; есть ли ошибка в консоли (F12)"
   ],
   [
    "/orders — «Bu buyruq faqat admin uchun»",
    "в ADMIN_TELEGRAM_IDS в .env нет вашего id Telegram"
   ],
   [
    "smoke: baza ulanmagan — live faqat PostgreSQL bilan",
    "в .env нет DATABASE_URL"
   ]
  ]
 },
 "13": {
  "kicker": "Этап 4 · состояние соединения",
  "title": "Знак панели в трёх состояниях: события приходят · сервер не отвечает, клиент сам пытается · сервер закрыл, клиент не пытается — разницу даёт active",
  "seg": {
   "a": [
    "«Ulangan» — <b>соединение открыто, события приходят</b>; список свежий",
    "У знака в панели три состояния. Первое — «подключено»: соединение открыто, события приходят, список свежий. Админ может верить экрану."
   ],
   "b": [
    "«Ulanmoqda…» — <b><code>active=true</code></b>: сервер не отвечает, клиент сам пытается снова",
    "Второе — «подключается». Соединение оборвалось, но socket.io сам пытается снова: active true. Причина — сервер выключен, пропал интернет или сервер не отвечает. Список остаётся на экране, но может быть устаревшим."
   ],
   "c": [
    "«Ulanmagan» — <b><code>active=false</code></b>: сервер закрыл соединение (токен), клиент не пытается",
    "Третье — «не подключено»: active false. Соединение закрыл сам сервер, у нас — когда токен неверный. Клиент не пытается снова, пользователь должен исправить токен. Панель пишет это и как «токен неверный»."
   ],
   "d": [
    "Итог: состояние дают <b><code>disconnect</code> и <code>active</code></b>; в панели одна строка",
    "Итог: три состояния различают две вещи: причина обрыва и active. В панели это одна строка: если disconnect, то при active — «подключается», иначе — «не подключено». Теперь посмотрим в настоящем терминале, как сервер выключается и включается."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · состояние соединения",
  "title": "Сервер остановился: transport close → клиент каждые несколько секунд xhr poll error; сервер включился — клиент подключился сам, никто ничего не нажимал",
  "seg": {
   "a": [
    "Сервер остановился: <b><code>transport close</code>, <code>active=true</code></b> — знак «Ulanmoqda…»",
    "Клиент подключён. В терминале сервера Ctrl C, сервер остановился. Клиент сразу: disconnect, transport close, active true, «подключается». Соединение оборвала сеть, а не сервер, поэтому клиент не сдаётся."
   ],
   "b": [
    "Повторные попытки: <b>каждые несколько секунд <code>xhr poll error</code></b> — промежуток всё больше",
    "Потом каждые несколько секунд connect error, xhr poll error: клиент пытается через polling, сервера нет. Посмотрите на время: промежуток постепенно растёт, клиент не бомбардирует сервер. Всё это время в панели «подключается»."
   ],
   "c": [
    "Сервер включился — <b>клиент подключился сам</b>: polling, потом websocket",
    "Снова запустили сервер. Через несколько секунд клиент сам: connect, «подключено», сначала polling, потом websocket. Никто не обновлял страницу, ничего не нажимал. Это готовая услуга socket.io."
   ],
   "d": [
    "Итог: <b>переподключение происходит само</b>; а событие во время обрыва — на следующем уроке",
    "Итог: если сервер выключится и включится, панель сама переподключится. Но остался вопрос: если заказ придёт, пока сервер выключен, увидит ли его панель? Это тема следующего урока по WebSocket: что теряется при обрыве. Теперь случай сложнее: сервер не отвечает, но и не отключается."
   ]
  }
 },
 "15": {
  "kicker": "Этап 4 · внутри",
  "title": "Замораживаем процесс сервера: соединение не рвётся, но и ответа нет — клиент 43 секунды стоит «ulangan», потом ping timeout; причина — правило 25 + 20 секунд",
  "seg": {
   "a": [
    "Замораживаем: <b>соединение открыто, но сервер не отвечает</b> — похоже на авиарежим телефона",
    "Теперь случай сложнее. Замораживаем процесс сервера: kill минус STOP. Соединение не рвётся, но сервер ни на что не отвечает. В жизни так бывает, когда телефон в авиарежиме, выключился Wi-Fi или сервер завис."
   ],
   "b": [
    "Клиент <b>43 секунды стоит «ulangan»</b> — ничего не знает",
    "Посмотрите в терминал клиента: ничего. Сорок три секунды он считает себя подключённым. Всё это время знак панели зелёный, но события не приходят. Админ верит экрану, а экран устарел."
   ],
   "c": [
    "Потом <b><code>ping timeout</code></b> — socket.io каждые 25 с шлёт ping, ждёт ответа 20 с",
    "Потом disconnect, ping timeout, «подключается». Правило socket.io: сервер каждые двадцать пять секунд шлёт ping и двадцать секунд ждёт ответа. Если ответа нет, соединение считается мёртвым. Поэтому максимум — сорок пять секунд. Когда сервер продолжил работу, клиент сразу подключился."
   ],
   "d": [
    "Значит, причина: <b>отсутствие ответа — не обрыв</b>; что соединение умерло, определяет только ping",
    "Значит, причина одна: когда сеть не отвечает, никто не сообщает, что соединение оборвалось. Это определяет только ping, с задержкой до сорока пяти секунд. Если в классе ученик скажет, что в авиарежиме знак не изменился, скажите: подождите. Теперь проверим."
   ]
  }
 },
 "16": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4",
  "title": "На ноутбуке админа выключился Wi-Fi: соединение не оборвалось, но и пакеты не проходят. Когда знак панели станет «Ulanmoqda…»?",
  "q": "Вы видели заморозку, теперь проверим. Третья проверка. На ноутбуке админа выключился Wi-Fi: соединение не оборвалось, но ничего не проходит. Когда знак панели станет «подключается»? Выберите вариант.",
  "ok": "Верно. Официально соединение не оборвалось, поэтому сразу никто не скажет. Сервер каждые двадцать пять секунд шлёт ping и ждёт двадцать секунд; если ответа нет — ping timeout, знак «подключается». Максимум — сорок пять секунд. Значит, неотвечающую сеть определяет только ping, с задержкой.",
  "okShort": "Неотвечающая сеть — <code>ping timeout</code>, до 45 с (25 + 20). Не сразу.",
  "hint": "Кто и как определяет, что соединение умерло? Вспомните 25 + 20 с экрана 15.",
  "demak": "неотвечающую сеть определяет только ping: <code>ping timeout</code> — до 45 с.",
  "opts": [
   "Сразу — браузер заметит, что Wi-Fi выключен, и скажет socket.io",
   "Никогда — соединение не оборвалось, знак останется зелёным",
   "До 45 секунд — ping timeout, когда ping останется без ответа",
   "Когда придёт следующее событие — сервер вернёт ошибку"
  ],
  "wrong": {
   "0": "Браузер не всегда замечает; socket.io опирается на ping.",
   "1": "Если ping без ответа, socket.io сам рвёт соединение — до 45 с.",
   "3": "Сервер отправляет событие, ошибка не возвращается — пакет просто не доходит."
  }
 },
 "17": {
  "kicker": "Этап 5 · AI",
  "title": "Продолжение нового навыка: двум AI один простой промпт — «живая панель, на WebSocket»; оба написали рабочую панель, оба выбрали один путь",
  "seg": {
   "a": [
    "Снова этап AI: <b>панель написал AI, вы принимаете</b> — простой промпт, без подсказок",
    "Как на прошлых уроках, последний этап — с AI. Промпт простой: живая панель заказов для админа магазина, если бот получил заказ или изменился статус, страница обновляется сама, на WebSocket. Socket.io, токен, состав события — этих слов в промпте нет."
   ],
   "b": [
    "Оба выбрали <b>голый <code>ws</code></b> — не socket.io; переподключение написали сами",
    "Оба AI выбрали один путь: не socket.io, а голую библиотеку ws. В браузере без библиотеки. Работает, но переподключение, ping, откат на polling они написали вручную. Поэтому у первого восемьсот пятьдесят пять строк, у второго пятьсот двенадцать."
   ],
   "c": [
    "Оба сами добавили токен — но <b>в URL: <code>?token=</code></b>; в событии весь заказ",
    "Хорошая сторона: хоть в промпте этого нет, оба сами добавили токен, потому что есть номера телефонов. Но токен в адресе: знак вопроса token. И в каждом событии уходит весь заказ, с телефоном клиента. А при подключении приходит полный список."
   ],
   "d": [
    "Итог: оба <b>проверяли без базы, с mock</b> — на настоящей базе проверим мы",
    "Итог: оба ответа выглядят надёжно, тесты зелёные. Но оба сами сказали: Postgres не было, настоящий поток бота, базы и панели не проверялся. На следующем экране проверим оба на настоящей базе, с настоящим потоком бота."
   ]
  }
 },
 "18": {
  "kicker": "Этап 5 · внутри",
  "title": "С настоящим PostgreSQL: оба сработали — smoke 5/5, без токена закрылось, заказ и подтверждение пришли; а четыре места решаете вы",
  "seg": {
   "a": [
    "На настоящей базе: <b>оба сработали</b> — smoke 5/5, соединение без токена закрыто",
    "Обе копии мы запустили с настоящим Postgres. Tsc чистый, тесты зелёные, smoke пять из пяти. Соединение без токена закрылось: у первого с кодом четыре тысячи четыреста один, у второго — тысяча восемь. Признаём: AI сработал хорошо."
   ],
   "b": [
    "Бот получил заказ: <b>snapshot, created, updated</b> — внутри имя и телефон клиента",
    "Бот получил заказ, админ подтвердил. В голом клиенте ws три сообщения: snapshot, ноль штук; created и updated, внутри весь заказ: имя клиента, телефон, товары. Каждой подключённой панели, при каждом изменении. Работает, но номер телефона уходит в каждом сообщении."
   ],
   "c": [
    "Разница: токен <b>в адресе vs в данных соединения</b>; в событии <b>данные vs конверт</b>",
    "Посмотрите рядом. У нас токен в auth, в адресе не виден; у AI — знак вопроса token, в адресной строке, остаётся в истории браузера, в логах сервера и хостинга. У нас событие — конверт, данные в запросе с токеном; у AI — в самом событии. Оба пути работают, но выбираете вы."
   ],
   "d": [
    "Итог: коду реального времени от AI — <b>четыре вопроса</b>: библиотека · где токен · что в событии · что изменилось в существующих файлах",
    "Итог, четыре вопроса. Какая библиотека, socket.io ли, как в уроке ученика. Где токен, не в адресе ли. Что в событии и кто его получает. Что изменилось в существующих файлах: оба изменили order service и его тест, читайте diff. Теперь проверим."
   ]
  }
 },
 "19": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "Панель от AI подключается к ws://…/ws/orders?token=panel-sir. Работает, сервер проверяет токен. В чём здесь опасность?",
  "q": "Вы видели панели от AI, теперь проверим. Четвёртая проверка. Панель от AI подключается, добавляя токен в адрес, знак вопроса token. Сервер его проверяет, всё работает. В чём здесь опасность? Выберите вариант.",
  "ok": "Верно. Проверка работает, опасность в другом: адрес записывается во многие места. История браузера, логи сервера и proxy, мониторинг хостинга — во всех них токен остаётся открытым. В socket.io токен уходит через auth, в данных соединения. Значит, секретное значение пишется не в адрес, а в заголовок или данные соединения.",
  "okShort": "Адрес пишется в логи и историю — токен там остаётся открытым. <code>auth</code> / заголовок — безопаснее.",
  "hint": "Куда записывается текст из адресной строки?",
  "demak": "секретное значение не пишется в адрес: адрес попадает в историю и логи; токен — в <code>auth</code> или заголовке.",
  "opts": [
   "Токен вместе с адресом остаётся в истории браузера и логах сервера и proxy",
   "Никакой — сервер проверяет токен, этого достаточно",
   "WebSocket не принимает токен в адресе, соединение упадёт",
   "Если токен в адресе, сервер проверяет его на каждом событии и тормозит"
  ],
  "wrong": {
   "1": "Проверка есть, но токен с адресом пишется в логи — кто прочтёт, войдёт в панель.",
   "2": "Принимает — соединение сработало (ws1v2-ai/ai2/04); проблема в безопасности.",
   "3": "Токен проверяется только при соединении; на скорость не влияет."
  }
 },
 "20": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "Поручите своему AI добавить в панель новое — отменённый заказ пусть будет красным; примите по четырём вопросам, проверьте через smoke",
  "seg": {
   "a": [
    "Теперь вы: даёте AI <b>промпт с точными условиями</b> — отменённый заказ в панели красный",
    "Теперь ваша очередь. Поручаете своему AI небольшое изменение в панели: строка отменённого заказа пусть будет красной, а вверху панели — число заказов за сегодня. Промпт копируете кнопкой ниже. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: промпт и <b>четыре вопроса</b> — библиотека, токен, событие, изменённые файлы",
    "На первом шаге даёте промпт. На втором читаете результат по четырём вопросам: остался ли socket.io, не ушёл ли токен в адрес, в событии только номер и причина, какие файлы изменились в git diff stat."
   ],
   "c": [
    "Шаги 3–4: <b><code>npm test</code>, <code>npm run smoke -- live</code></b>, отмените в браузере; подтверждение — результат smoke",
    "На третьем шаге npm test и npm run smoke live. На четвёртом открываете панель в браузере и отменяете заказ в боте: строка должна стать красной. В поле подтверждения напишите строку результата smoke."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы принимаете код реального времени от AI по четырём вопросам."
   ]
  },
  "steps": [
   {
    "t": "Промпт",
    "exp": "список изменённых файлов",
    "cmds": [
     "промпт выше — своему AI"
    ]
   },
   {
    "t": "Четыре вопроса",
    "exp": "4 ✓",
    "cmds": [
     "git diff --stat — только public/admin.html (и, если нужно, admin.controller.ts)",
     null,
     null,
     null
    ]
   },
   {
    "t": "Тесты",
    "exp": "Tests: 32 passed · NATIJA: 4/4 ✓"
   },
   {
    "t": "Браузер",
    "exp": "строка красная, число обновилось",
    "cmds": [
     "панель открыта → в боте /orders → «❌ Bekor»"
    ]
   }
  ],
  "proof": {
   "label": "Строка результата npm run smoke -- live",
   "placeholder": "например: NATIJA: 4/4 ✓",
   "wrong": "После изменения AI запустите npm run smoke -- live и вставьте строку NATIJA: …."
  },
  "trouble": [
   [
    "в git diff --stat есть order.service.ts или telegram.service.ts",
    "AI тронул файл, который не должен был — git checkout -- src/api/order src/api/telegram, повторите условие"
   ],
   [
    "AI установил пакет ws",
    "повторите пункт «пусть останется socket.io»; git checkout -- package.json package-lock.json"
   ],
   [
    "smoke live ✗ «order-changed null»",
    "изменились состав или имя события — прочитайте diff live.gateway.ts"
   ],
   [
    "Строка не красная",
    "статус CANCELLED? запросила ли панель список заново (F12 → Network)"
   ]
  ]
 },
 "21": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»",
  "title": "Урок ученика: «8 / 10» в Maydon Jamoa — телефонный вариант того, что вы сегодня сделали в панели, на socket.io",
  "seg": {
   "a": [
    "m10-02 — 20 экранов: <b>Maydon Jamoa, «8 / 10»</b> — два телефона, один показывает старое число",
    "Теперь подготовка к классу. Урок ученика m10-02, двадцать экранов. Пример — Maydon Jamoa: приложение записи на футбольную игру. Два телефона: один присоединяется, на другом остаётся старое восемь из десяти. Проблема, которую вы сегодня видели в панели, — на телефоне."
   ],
   "b": [
    "У ученика тоже <b>socket.io, токен, конверт и три знака</b> — правила, которые вы знаете",
    "Правила в уроке ученика те же, что у вас: socket.io, токен при соединении, внутри конверта нет числа, приложение запрашивает заново, и три знака. Только у ученика приложение — телефон, сервер на Render. Поэтому если AI напишет голый ws, это столкнётся с уроком ученика."
   ],
   "c": [
    "Блоки: <b>трудное место — окно кода на 10-м экране и первая практика</b>",
    "Посмотрите на таблицу блоков. Трудное место — окно кода на десятом экране и первая практика: Backend, приложение и Render вместе. На третий, пятый и шестой экраны лишнего времени не давайте. Что вы добавляете в каждом блоке — в правой колонке."
   ],
   "d": [
    "Итог: в репозитории <b>на <code>m12-dars-02</code> события нет, на <code>m12-dars-03</code> есть</b> — пусть ученик увидит разницу",
    "Итог: в проекте ученика важны два тега. На первом есть соединение, но нет события: число само не меняется, это не ошибка. На втором событие есть. В классе покажите оба: соединение и событие — разные вещи."
   ]
  }
 },
 "22": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Дорога, конверт, знак, слушатель — вместе с термином; таблица README «Реальное время»: и в OrderBotNest, и в Maydon Jamoa пять колонок",
  "seg": {
   "a": [
    "Слова ученика: <b>открытая дорога — постоянное соединение, конверт — событие</b>",
    "Слова из урока ученика: закрытая дорога — запрос–ответ, открытая дорога — постоянное соединение, конверт — событие, знак — состояние соединения, слушатель — ulanish on. Когда ученик говорит слово, вы рядом говорите термин: конверт, то есть событие, у нас order changed."
   ],
   "b": [
    "Таблица README: <b>точка · кто что делает · событие · кто получает · что на экране</b>",
    "В README OrderBotNest таблица живой панели: точка реального времени, кто что делает, событие и причина, кто получает, что меняется в панели. Две строки: новый заказ и статус. Ученик пишет ровно такую таблицу для своего проекта."
   ],
   "c": [
    "В Maydon Jamoa <b>пять причин, одно событие</b> — <code>oyin-ozgardi</code>",
    "В Maydon Jamoa в таблице пять строк: присоединился, вышел, подтвердил, записался в очередь, дал объявление. Событие одно, причин пять. Правило курса: имя события — строчными буквами через дефис, о случившемся: oyin ozgardi, order changed."
   ],
   "d": [
    "Итог: в коде ученика <b>слушатель внутри <code>connect</code></b> — это первая проблема следующего урока",
    "Итог и одно предупреждение. В файле ulanish ts проекта ученика слушатель события добавляется внутри connect. При каждом переподключении добавляется ещё один. Сейчас работает, на следующем уроке по WebSocket сломаем это. В классе не исправляйте, отметьте."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Причина находится по знаку и терминалу сервера: шесть случаев, у каждого своё сообщение — и четыре вопроса, которые задаст ученик",
  "seg": {
   "a": [
    "Первые три узнаются <b>по знаку</b>: красный, жёлто-зелёный, не изменился",
    "Шесть случаев, которые встречаются в классе. Первые три узнаются по знаку. Знак на мгновение зелёный, потом красный: токен, войти заново. Из жёлтого в зелёный: сервер включился снова, это нормально. В авиарежиме знак не изменился: подождите до сорока пяти секунд."
   ],
   "b": [
    "Остальные три: <b>число не изменилось, Render затянулся, «null»</b> — по терминалу",
    "Четвёртый: число само не изменилось, ученик ещё на теге без события, это не ошибка. Пятый: первое соединение затянулось, Render спал, минута. Шестой: в терминале сервера игрок null, причина — нет return, поломка с шестого экрана."
   ],
   "c": [
    "Вопросы ученика: <b>что такое socket.io, почему нет числа, событие при обрыве, срок токена</b>",
    "Готовые ответы на вопросы учеников внизу, нажмите, чтобы открыть: разница WebSocket и socket.io, почему в событии нет числа, придёт ли потом событие, случившееся во время обрыва, что будет, когда истечёт срок токена."
   ],
   "d": [
    "Итог: смотрите <b>сначала на знак, потом в терминал сервера</b> — причина в одном из них",
    "Итог: если ученик говорит, что экран не меняется, посмотрите вместе с ним сначала на знак, потом в терминал сервера. Причина почти всегда в одном из них. С этим вы готовы к классу. Теперь проверьте себя."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "Панель один раз запросила GET /admin/orders. Потом бот получил заказ. Что знает панель в обычном HTTP?",
    "e": "В запросе–ответе сервер сам не говорит.",
    "o": [
     "Ничего — пока не спросят, сервер не отвечает",
     "Сервер сам отправит ответ ещё раз",
     "Браузер сам заметит изменение и обновит",
     "HTTP-соединение остаётся открытым, и сервер сам шлёт новое"
    ]
   },
   {
    "q": "Откуда gateway читает токен?",
    "e": "Токен приходит при открытии соединения.",
    "o": [
     "Из Authorization в заголовке запроса",
     "client.handshake.auth.token — из данных соединения",
     "Из поля, пришедшего с каждым событием",
     "Из ADMIN_PANEL_TOKEN в .env — клиент ничего не шлёт"
    ]
   },
   {
    "q": "После disconnect() нет return. Что будет с клиентом без токена?",
    "e": "disconnect() не выходит из функции.",
    "o": [
     "Клиент останется подключённым и получит следующие события, токен не проверяется",
     "Сервер даст ошибку и остановится",
     "Клиент закроется, но лог сервера напишет «panel ulandi»",
     "Клиент будет снова и снова пытаться подключиться"
    ]
   },
   {
    "q": "Что внутри события order-changed?",
    "e": "Конверт: «что-то изменилось».",
    "o": [
     "Весь список — панель рисует напрямую",
     "Имя, телефон и товары клиента — панель рисует из них",
     "HTML нового заказа — вставляется на страницу",
     "orderId и reason — панель запрашивает список заново"
    ]
   },
   {
    "q": "ulanish.on('order-changed', () => yukla). Пришло событие. Что будет?",
    "e": "Без скобок — функция возвращается.",
    "o": [
     "Список обновится, но с небольшой задержкой",
     "Слушатель сработает, yukla не вызовется — список старый",
     "В консоли браузера будет ошибка",
     "Событие вообще не дойдёт до слушателя — сервер не отправит"
    ]
   },
   {
    "q": "Сервер остановился. Что видит клиент?",
    "e": "Оборвала сеть — клиент не сдаётся.",
    "o": [
     "io server disconnect — снова не пытается",
     "ping timeout — ждёт 45 секунд, потом сам переподключится",
     "transport close, active=true — сам пытается снова",
     "Ничего — соединение само не закрывается"
    ]
   },
   {
    "q": "Wi-Fi выключился, официально соединение не оборвалось. Когда изменится знак?",
    "e": "Правило 25 + 20 с.",
    "o": [
     "Сразу — браузер скажет socket.io",
     "Никогда — обрыва же не было",
     "На следующем заказе — сервер вернёт ошибку",
     "До 45 секунд — через ping timeout"
    ]
   },
   {
    "q": "Панель от AI подключается к …/ws/orders?token=… и работает. Главный вопрос?",
    "e": "Секретное значение не пишется в адрес.",
    "o": [
     "Токен в адресе — записывается в историю и логи",
     "Работает — значит, можно принимать",
     "ws медленный — socket.io работает быстрее",
     "Адрес длинный — браузер его обрежет и отрежет токен"
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
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S15, { ...head(15), ...((typeof RU_S !== 'undefined' && RU_S.S15) || {}) });
  ru(S17, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.S17) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
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
  ru(P20.S, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.P20_S) || {}) });
  ru(P20.steps, RU_MDT[20].steps);
  ru(P20.trouble, RU_MDT[20].trouble);
  ru(P20.proof, RU_MDT[20].proof);
  ru(FINAL, RU_MDT[24].final);
})();
