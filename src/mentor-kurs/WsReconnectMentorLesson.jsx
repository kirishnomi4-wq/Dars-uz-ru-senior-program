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

// AVTO: feedback/F-1029-02-mentor-kurs/dev/ws2-kod.py — OrderBotNest ws2-start/ws2-done, maydon-jamoa m12-dars-05, haqiqiy chiqishlar (qo'lda tahrirlanmaydi)
const KOD_HTML = {
 "file": "public/admin.html",
 "tag": "ws2-done",
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
   "t": "  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.",
   "n": 64
  },
  {
   "t": "  async function yukla() {",
   "n": 65
  },
  {
   "t": "    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });",
   "n": 66
  },
  {
   "t": "    if (r.status === 401) {",
   "n": 67
  },
  {
   "t": "      el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";",
   "n": 68
  },
  {
   "t": "      return;",
   "n": 69
  },
  {
   "t": "    }",
   "n": 70
  },
  {
   "t": "    const list = await r.json();",
   "n": 71
  },
  {
   "t": "    const eng = list.length ? list[0].id : 0;",
   "n": 72
  },
  {
   "t": "    el('royxat').innerHTML = list.length",
   "n": 73
  },
  {
   "t": "      ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">",
   "n": 74
  },
  {
   "t": "          <td>${o.id}</td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>",
   "n": 75
  },
  {
   "t": "          <td>${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}</td>",
   "n": 76
  },
  {
   "t": "          <td>${o.total.toLocaleString('ru-RU')} so'm</td><td>${STATUS[o.status] || o.status}</td>",
   "n": 77
  },
  {
   "t": "          <td>${new Date(o.created_at).toLocaleTimeString('ru-RU')}</td></tr>`).join('')",
   "n": 78
  },
  {
   "t": "      : \"<tr><td colspan='7'>Hali buyurtma yo'q</td></tr>\";",
   "n": 79
  },
  {
   "t": "    oxirgiId = eng;",
   "n": 80
  },
  {
   "t": "  }",
   "n": 81
  },
  {
   "t": "",
   "n": 82
  },
  {
   "t": "  function ulan() {",
   "n": 83
  },
  {
   "t": "    if (ulanish) ulanish.close();",
   "n": 84
  },
  {
   "t": "    ulanish = io({ auth: { token } });",
   "n": 85
  },
  {
   "t": "    holatQoy('ulanmoqda');",
   "n": 86
  },
  {
   "t": "    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi",
   "n": 87
  },
  {
   "t": "    ulanish.on('connect', () => {",
   "n": 88
  },
  {
   "t": "      holatQoy('ulangan');",
   "n": 89
  },
  {
   "t": "      yukla();",
   "n": 90
  },
  {
   "t": "    });",
   "n": 91
  },
  {
   "t": "    // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»",
   "n": 92
  },
  {
   "t": "    ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 93
  },
  {
   "t": "    ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 94
  },
  {
   "t": "    // tinglovchi bir marta, connect'dan TASHQARIDA (ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi)",
   "n": 95
  },
  {
   "t": "    ulanish.on('order-changed', () => yukla());",
   "n": 96
  },
  {
   "t": "  }",
   "n": 97
  },
  {
   "t": "",
   "n": 98
  },
  {
   "t": "  el('kirish').addEventListener('submit', (e) => {",
   "n": 99
  },
  {
   "t": "    e.preventDefault();",
   "n": 100
  },
  {
   "t": "    token = el('token').value.trim();",
   "n": 101
  },
  {
   "t": "    localStorage.setItem(\u0027adminToken', token);",
   "n": 102
  },
  {
   "t": "    ulan();",
   "n": 103
  },
  {
   "t": "  });",
   "n": 104
  },
  {
   "t": "",
   "n": 105
  },
  {
   "t": "  if (token) {",
   "n": 106
  },
  {
   "t": "    el('token').value = token;",
   "n": 107
  },
  {
   "t": "    ulan();",
   "n": 108
  },
  {
   "t": "  }",
   "n": 109
  },
  {
   "t": "</script>",
   "n": 110
  },
  {
   "t": "</body>",
   "n": 111
  },
  {
   "t": "</html>",
   "n": 112
  }
 ]
};
const KOD_CLIENT = {
 "file": "scripts/live-client.js",
 "tag": "ws2-done",
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
   "t": "// Panel kabi: har connect'da (birinchi va qayta) ro'yxat qayta so'raladi — uzilish paytidagi hodisa kelmaydi",
   "n": 24
  },
  {
   "t": "async function royxat() {",
   "n": 25
  },
  {
   "t": "  const r = await fetch(`${url}/admin/orders`, {",
   "n": 26
  },
  {
   "t": "    headers: { Authorization: `Bearer ${token}` },",
   "n": 27
  },
  {
   "t": "  });",
   "n": 28
  },
  {
   "t": "  if (!r.ok) return console.log(`${t()} GET /admin/orders → ${r.status}`);",
   "n": 29
  },
  {
   "t": "  const list = await r.json();",
   "n": 30
  },
  {
   "t": "  console.log(",
   "n": 31
  },
  {
   "t": "    `${t()} GET /admin/orders → ${list.length} ta` +",
   "n": 32
  },
  {
   "t": "      (list.length ? `, eng yangisi #${list[0].id}` : ''),",
   "n": 33
  },
  {
   "t": "  );",
   "n": 34
  },
  {
   "t": "}",
   "n": 35
  },
  {
   "t": "s.on('connect', () => {",
   "n": 36
  },
  {
   "t": "  console.log(",
   "n": 37
  },
  {
   "t": "    `${t()} connect · ${holat(s)} · transport: ${s.io.engine.transport.name}`,",
   "n": 38
  },
  {
   "t": "  );",
   "n": 39
  },
  {
   "t": "  s.io.engine.once('upgrade', (tr) =>",
   "n": 40
  },
  {
   "t": "    console.log(`${t()} transport: ${tr.name}`),",
   "n": 41
  },
  {
   "t": "  );",
   "n": 42
  },
  {
   "t": "  royxat().catch((e) => console.log(`${t()} GET xato: ${e.message}`));",
   "n": 43
  },
  {
   "t": "});",
   "n": 44
  },
  {
   "t": "s.on('disconnect', (reason) =>",
   "n": 45
  },
  {
   "t": "  console.log(",
   "n": 46
  },
  {
   "t": "    `${t()} disconnect: ${reason} · active=${s.active} → ${holat(s)}`,",
   "n": 47
  },
  {
   "t": "  ),",
   "n": 48
  },
  {
   "t": ");",
   "n": 49
  },
  {
   "t": "s.on('connect_error', (e) =>",
   "n": 50
  },
  {
   "t": "  console.log(",
   "n": 51
  },
  {
   "t": "    `${t()} connect_error: ${e.message} · active=${s.active} → ${holat(s)}`,",
   "n": 52
  },
  {
   "t": "  ),",
   "n": 53
  },
  {
   "t": ");",
   "n": 54
  },
  {
   "t": "s.on('order-changed', (p) =>",
   "n": 55
  },
  {
   "t": "  console.log(`${t()} order-changed ${JSON.stringify(p)}`),",
   "n": 56
  },
  {
   "t": ");",
   "n": 57
  }
 ]
};
const KOD_TG = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "ws2-done",
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
const KOD_GATEWAY = {
 "file": "src/api/live/live.gateway.ts",
 "tag": "ws2-done",
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
const KOD_BUZISH = {
 "file": "BUZISH.md",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "# Buzish yozuvi",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "Mahsulot: OrderBotNest — jonli buyurtmalar paneli (`/admin`). Da'vo — README «Jonli panel»: «ro'yxat o'zi yangilanadi» (`ws2-start` = `ws1-done`).",
   "n": 3
  },
  {
   "t": "Har urinish: nima qildim · nima kutdim · nima bo'ldi → belgi. Brauzer — Chrome; «Bobur» — sinov mijozi (Telegram o'rniga `bot.handleUpdate`, `npm run smoke` dagi usul), baza — haqiqiy PostgreSQL.",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "| № | Usul | Nima qildim | Nima kutdim | Nima bo'ldi | Belgi | Tuzatish | Qayta tekshiruv |",
   "n": 6
  },
  {
   "t": "|---|---|---|---|---|---|---|---|",
   "n": 7
  },
  {
   "t": "| 1 | Server qayta ishga tushdi | Panel ochiq, ro'yxatda #1. Server terminalida Ctrl+C; server o'chiq paytda Bobur botga yozdi; serverni qayta yoqdim — bot ishga tushishi bilan xabarni bajardi (#2). | Belgi «Ulangan» bo'lgach ro'yxatda #2. | Belgi «Ulangan», ro'yxatda faqat #1; bazada 2 ta. `npm run live` da ham `order-changed` kelmadi. | buzildi | tuzatish qilindi | qayta tekshiruvda takrorlanmadi |",
   "n": 8
  },
  {
   "t": "| 2 | Brauzer Offline, qisqa | DevTools → Network → Offline, ~6 s; shu payt Bobur buyurtma berdi; Offline'ni o'chirdim. | Online'dan keyin ro'yxatda yangi buyurtma. | Belgi o'zgarmadi («Ulangan»); hodisa Online bo'lgan zahoti keldi, ro'yxat yangilandi. | buzilmadi | — | — |",
   "n": 9
  },
  {
   "t": "| 3 | Brauzer Offline, uzoq | Offline ~60 s (33-soniyada belgi «Ulanmoqda…»); shu payt Bobur buyurtma berdi; Offline'ni o'chirdim. | Belgi «Ulangan» bo'lgach ro'yxatda yangi buyurtma. | Belgi «Ulangan», ro'yxatda yo'q; bazada bor. | buzildi | tuzatish qilindi | qayta tekshiruvda takrorlanmadi |",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "«buzilmadi» (2-urinish) — shu kompyuterda, shu urinishda.",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "## Topilgan muammo va tuzatish",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "1. **Uzilishdan keyin yangi buyurtma ko'rinmaydi** (1 va 3-urinish). Sabab: `order-changed` faqat hozir ulangan panellarga yuboriladi; ulanish yo'q paytdagi hodisa qayta ulangach kelmaydi. 1-urinishda bot Telegram navbatidagi xabarni panel qayta ulanishidan oldin bajardi (panel 1–5 s da qayta urinadi).",
   "n": 16
  },
  {
   "t": "   Tuzatish (`public/admin.html`): `connect` ichida `yukla()` — birinchi va har qayta ulanishda ro'yxat `GET /admin/orders` dan qayta so'raladi; Kirish va sahifa ochilishidagi alohida `yukla()` olib tashlandi (ro'yxat ikki joyda: `connect` va `order-changed`). `scripts/live-client.js` ham har `connect` da `GET /admin/orders → N ta` chiqaradi.",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "Server kodi o'zgarmagan.",
   "n": 19
  },
  {
   "t": "",
   "n": 20
  },
  {
   "t": "## Tuzatishda tuzoq",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "`order-changed` tinglovchisini ham `connect` ichiga ko'chirsa, har qayta ulanishda yana bittasi qo'shiladi: ikki qayta yonishdan keyin bitta buyurtmaga 3 ta `GET`, sariq belgi yo'qoladi. Tinglovchi bir marta, `connect` dan tashqarida.",
   "n": 23
  },
  {
   "t": "",
   "n": 24
  },
  {
   "t": "## `connectionStateRecovery` haqida",
   "n": 25
  },
  {
   "t": "",
   "n": 26
  },
  {
   "t": "Sinab ko'rildi (`@WebSocketGateway({ connectionStateRecovery: … })`): tarmoq qisqa uzilganda o'tkazilgan hodisa qayta keladi (`socket.recovered = true`), lekin server qayta yonganda (holat server xotirasida) va klient uzilishdan oldin birorta hodisa olmagan bo'lsa — yo'q. Eng ko'p holat — server qayta yonishi (deploy, xato), shuning uchun yoqilmadi: `connect` da qayta so'rash yetadi.",
   "n": 27
  },
  {
   "t": "",
   "n": 28
  },
  {
   "t": "«Tuzatish qilindi» — kodda o'zgartirish qilindi (ish fakti). «Qayta tekshiruvda takrorlanmadi» — o'sha usul bilan qayta buzib ko'rilgan natija: shu kompyuterda, shu urinishda — hamma holat uchun isbot emas.",
   "n": 29
  }
 ]
};
const KOD_HTML_START = {
 "file": "public/admin.html",
 "tag": "ws2-start",
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
const KOD_HTML_XATO = {
 "file": "public/admin.html",
 "tag": "xato nusxa",
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
   "t": "  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.",
   "n": 64
  },
  {
   "t": "  async function yukla() {",
   "n": 65
  },
  {
   "t": "    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });",
   "n": 66
  },
  {
   "t": "    if (r.status === 401) {",
   "n": 67
  },
  {
   "t": "      el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";",
   "n": 68
  },
  {
   "t": "      return;",
   "n": 69
  },
  {
   "t": "    }",
   "n": 70
  },
  {
   "t": "    const list = await r.json();",
   "n": 71
  },
  {
   "t": "    const eng = list.length ? list[0].id : 0;",
   "n": 72
  },
  {
   "t": "    el('royxat').innerHTML = list.length",
   "n": 73
  },
  {
   "t": "      ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">",
   "n": 74
  },
  {
   "t": "          <td>${o.id}</td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>",
   "n": 75
  },
  {
   "t": "          <td>${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}</td>",
   "n": 76
  },
  {
   "t": "          <td>${o.total.toLocaleString('ru-RU')} so'm</td><td>${STATUS[o.status] || o.status}</td>",
   "n": 77
  },
  {
   "t": "          <td>${new Date(o.created_at).toLocaleTimeString('ru-RU')}</td></tr>`).join('')",
   "n": 78
  },
  {
   "t": "      : \"<tr><td colspan='7'>Hali buyurtma yo'q</td></tr>\";",
   "n": 79
  },
  {
   "t": "    oxirgiId = eng;",
   "n": 80
  },
  {
   "t": "  }",
   "n": 81
  },
  {
   "t": "",
   "n": 82
  },
  {
   "t": "  function ulan() {",
   "n": 83
  },
  {
   "t": "    if (ulanish) ulanish.close();",
   "n": 84
  },
  {
   "t": "    ulanish = io({ auth: { token } });",
   "n": 85
  },
  {
   "t": "    holatQoy('ulanmoqda');",
   "n": 86
  },
  {
   "t": "    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi",
   "n": 87
  },
  {
   "t": "    ulanish.on('connect', () => {",
   "n": 88
  },
  {
   "t": "      holatQoy('ulangan');",
   "n": 89
  },
  {
   "t": "      yukla();",
   "n": 90
  },
  {
   "t": "      ulanish.on('order-changed', () => yukla());",
   "n": 91
  },
  {
   "t": "    });",
   "n": 92
  },
  {
   "t": "    // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»",
   "n": 93
  },
  {
   "t": "    ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 94
  },
  {
   "t": "    ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 95
  },
  {
   "t": "  }",
   "n": 96
  },
  {
   "t": "",
   "n": 97
  },
  {
   "t": "  el('kirish').addEventListener('submit', (e) => {",
   "n": 98
  },
  {
   "t": "    e.preventDefault();",
   "n": 99
  },
  {
   "t": "    token = el('token').value.trim();",
   "n": 100
  },
  {
   "t": "    localStorage.setItem(\u0027adminToken', token);",
   "n": 101
  },
  {
   "t": "    ulan();",
   "n": 102
  },
  {
   "t": "  });",
   "n": 103
  },
  {
   "t": "",
   "n": 104
  },
  {
   "t": "  if (token) {",
   "n": 105
  },
  {
   "t": "    el('token').value = token;",
   "n": 106
  },
  {
   "t": "    ulan();",
   "n": 107
  },
  {
   "t": "  }",
   "n": 108
  },
  {
   "t": "</script>",
   "n": 109
  },
  {
   "t": "</body>",
   "n": 110
  },
  {
   "t": "</html>",
   "n": 111
  }
 ]
};
const KOD_GATEWAY_TIKLASH = {
 "file": "src/api/live/live.gateway.ts",
 "tag": "tiklash nusxa",
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
   "t": "@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })",
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
const KOD_README_START = {
 "file": "README.md",
 "tag": "ws2-start",
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
const KOD_README = {
 "file": "README.md",
 "tag": "ws2-done",
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
  },
  {
   "t": "### Qayta ulanish: uzilish paytidagi hodisa kelmaydi",
   "n": 58
  },
  {
   "t": "socket.io ulanishni o'zi tiklaydi, lekin **ulanish yo'q paytda yuborilgan `order-changed` qayta kelmaydi**: server uni faqat hozir ulangan panellarga yuboradi. Shuning uchun panel **har `connect` da** (birinchi va har qayta ulanishda) ro'yxatni `GET /admin/orders` dan qayta so'raydi. `npm run live` ham shunday: `connect` dan keyin `GET /admin/orders → N ta, eng yangisi #…`.",
   "n": 60
  },
  {
   "t": "- Ro'yxat ikki joyda so'raladi: `connect` va `order-changed`. Tinglovchi **bir marta, `connect` dan tashqarida** qo'shiladi — ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi va bitta hodisaga bir nechta `GET` ketadi.",
   "n": 62
  },
  {
   "t": "- Qanday buziladi va qanday tekshiriladi — `BUZISH.md`.",
   "n": 63
  }
 ]
};
const KOD_MJ_UL_START = {
 "file": "mobil/src/ulanish.ts",
 "tag": "m12-dars-05-start",
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
   "t": "import { kunNomi } from '@/kun';",
   "n": 6
  },
  {
   "t": "import { oxirgiRoyxat, oyinlarniOl, type Oyin } from '@/oyin';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "// Doimiy ulanish (socket.io): ilova Backend'ga bir marta ulanadi, ulanish ochiq turadi.",
   "n": 9
  },
  {
   "t": "// Manzil — o'sha EXPO_PUBLIC_API_URL; ulanayotganda token yuboriladi (auth) — Backend uni shu paytda tekshiradi.",
   "n": 10
  },
  {
   "t": "// Hodisa oyin-ozgardi { oyinId, sabab } kelganda ilova GET /oyinlar ni bir marta qayta so'raydi —",
   "n": 11
  },
  {
   "t": "// «O'yinlar» va «O'yin» shu bitta javobdan yangilanadi (oyin.ts). Hodisa o'zgarish bo'lganini aytadi; yangi holat — Backend'dan.",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "// Uch ulanish holati:",
   "n": 14
  },
  {
   "t": "// ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin) ·",
   "n": 15
  },
  {
   "t": "// ulanmagan — ilova urinmayapti (token yo'q yoki yaroqsiz, yoki hisobdan chiqilgan)",
   "n": 16
  },
  {
   "t": "export type UlanishHolati = 'ulangan' | 'ulanmoqda' | 'ulanmagan';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "let ulanish: Socket | null = null;",
   "n": 19
  },
  {
   "t": "let ilovaHolati: NativeEventSubscription | null = null;",
   "n": 20
  },
  {
   "t": "let holat: UlanishHolati = 'ulanmagan';",
   "n": 21
  },
  {
   "t": "const holatniKuzatuvchilar = new Set<(h: UlanishHolati) => void>();",
   "n": 22
  },
  {
   "t": "",
   "n": 23
  },
  {
   "t": "// «Hozir ko'ryapti»: Backend xonaga yuborgan son — o'yin bo'yicha (korayotganlar-ozgardi { oyinId, soni })",
   "n": 24
  },
  {
   "t": "const korayotganlar = new Map<number, number>();",
   "n": 25
  },
  {
   "t": "const korayotganlarniKuzatuvchilar = new Set<() => void>();",
   "n": 26
  },
  {
   "t": "",
   "n": 27
  },
  {
   "t": "function holatQoy(yangi: UlanishHolati) {",
   "n": 28
  },
  {
   "t": "  holat = yangi;",
   "n": 29
  },
  {
   "t": "  holatniKuzatuvchilar.forEach((k) => k(yangi));",
   "n": 30
  },
  {
   "t": "}",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
   "n": 33
  },
  {
   "t": "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
   "n": 34
  },
  {
   "t": "function uzilishdanKeyin() {",
   "n": 35
  },
  {
   "t": "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
   "n": 36
  },
  {
   "t": "}",
   "n": 37
  },
  {
   "t": "",
   "n": 38
  },
  {
   "t": "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
   "n": 39
  },
  {
   "t": "// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.",
   "n": 40
  },
  {
   "t": "export async function ulan() {",
   "n": 41
  },
  {
   "t": "  if (ulanish) return;",
   "n": 42
  },
  {
   "t": "  const token = await tokenOl();",
   "n": 43
  },
  {
   "t": "  if (!token || ulanish) return;",
   "n": 44
  },
  {
   "t": "",
   "n": 45
  },
  {
   "t": "  ulanish = io(API, { auth: { token } });",
   "n": 46
  },
  {
   "t": "  holatQoy('ulanmoqda');",
   "n": 47
  },
  {
   "t": "  ulanish.on('connect', () => {",
   "n": 48
  },
  {
   "t": "    holatQoy('ulangan');",
   "n": 49
  },
  {
   "t": "    ulanish?.on('oyin-ozgardi', async () => {",
   "n": 50
  },
  {
   "t": "      const oldingi = oxirgiRoyxat();",
   "n": 51
  },
  {
   "t": "      const yangi = await qaytaSora();",
   "n": 52
  },
  {
   "t": "      if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);",
   "n": 53
  },
  {
   "t": "    });",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "  ulanish.on('disconnect', uzilishdanKeyin);",
   "n": 56
  },
  {
   "t": "  ulanish.on('connect_error', uzilishdanKeyin);",
   "n": 57
  },
  {
   "t": "  ulanish.on('korayotganlar-ozgardi', (m: { oyinId: number; soni: number }) => {",
   "n": 58
  },
  {
   "t": "    korayotganlar.set(m.oyinId, m.soni);",
   "n": 59
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.forEach((k) => k());",
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
   "t": "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
   "n": 63
  },
  {
   "t": "  let oldingi: string | null | undefined = AppState.currentState;",
   "n": 64
  },
  {
   "t": "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
   "n": 65
  },
  {
   "t": "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
   "n": 66
  },
  {
   "t": "    oldingi = yangi;",
   "n": 67
  },
  {
   "t": "  });",
   "n": 68
  },
  {
   "t": "}",
   "n": 69
  },
  {
   "t": "",
   "n": 70
  },
  {
   "t": "// Hodisadan keyin — GET /oyinlar bir marta; xato bo'lsa ekranda eski ro'yxat qoladi (pastga tortib yangilash ishlaydi)",
   "n": 71
  },
  {
   "t": "function qaytaSora(): Promise<Oyin[] | null> {",
   "n": 72
  },
  {
   "t": "  return oyinlarniOl().catch(() => null);",
   "n": 73
  },
  {
   "t": "}",
   "n": 74
  },
  {
   "t": "",
   "n": 75
  },
  {
   "t": "// Jonli xabar — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar (_layout.tsx ko'rsatadi).",
   "n": 76
  },
  {
   "t": "// Qaysi xabar — sababga qarab emas: hodisadan keyingi javob oldingisi bilan solishtiriladi.",
   "n": 77
  },
  {
   "t": "// Faqat o'ziga tegishli o'yin uchun (qo'shilgan, navbatda yoki o'zi e'lon qilgan); o'z harakati uchun chiqmaydi; ism yo'q.",
   "n": 78
  },
  {
   "t": "// O'z harakati — javobdagi o'z maydonlarim (menQoshilganman, menNavbatdaman, menTasdiqlaganman) o'zgargan",
   "n": 79
  },
  {
   "t": "// (navbatdan o'yinga o'tish bundan mustasno). Hodisaga yangi maydon qo'shilmagan.",
   "n": 80
  },
  {
   "t": "export function jonliXabarlar(oldingi: Oyin[], yangi: Oyin[]): string[] {",
   "n": 81
  },
  {
   "t": "  const xabarlar: string[] = [];",
   "n": 82
  },
  {
   "t": "  for (const y of yangi) {",
   "n": 83
  },
  {
   "t": "    const o = oldingi.find((x) => x.id === y.id);",
   "n": 84
  },
  {
   "t": "    if (!o) continue; // yangi e'lon — ro'yxatda jim paydo bo'ladi",
   "n": 85
  },
  {
   "t": "    const nom = `${kunNomi(y.kun)}, ${y.soat}`;",
   "n": 86
  },
  {
   "t": "    if (o.menNavbatdaman && y.menQoshilganman) {",
   "n": 87
  },
  {
   "t": "      xabarlar.push(`Navbatdan o'yinga o'tdingiz: ${nom}`);",
   "n": 88
  },
  {
   "t": "      continue;",
   "n": 89
  },
  {
   "t": "    }",
   "n": 90
  },
  {
   "t": "    const tegishli = y.menQoshilganman || y.menNavbatdaman || y.menTashkilotchiman;",
   "n": 91
  },
  {
   "t": "    const ozim =",
   "n": 92
  },
  {
   "t": "      o.menQoshilganman !== y.menQoshilganman ||",
   "n": 93
  },
  {
   "t": "      o.menNavbatdaman !== y.menNavbatdaman ||",
   "n": 94
  },
  {
   "t": "      o.menTasdiqlaganman !== y.menTasdiqlaganman;",
   "n": 95
  },
  {
   "t": "    if (!tegishli || ozim) continue;",
   "n": 96
  },
  {
   "t": "    if (y.qoshilgan > o.qoshilgan) {",
   "n": 97
  },
  {
   "t": "      xabarlar.push(",
   "n": 98
  },
  {
   "t": "        y.qoshilgan >= y.kerak",
   "n": 99
  },
  {
   "t": "          ? `${nom} — o'yin to'ldi: ${y.qoshilgan} / ${y.kerak}`",
   "n": 100
  },
  {
   "t": "          : `${nom} — yana bir o'yinchi qo'shildi: ${y.qoshilgan} / ${y.kerak}`,",
   "n": 101
  },
  {
   "t": "      );",
   "n": 102
  },
  {
   "t": "    } else if (y.qoshilgan < o.qoshilgan) {",
   "n": 103
  },
  {
   "t": "      xabarlar.push(`${nom} — joy bo'shadi: ${y.qoshilgan} / ${y.kerak}`);",
   "n": 104
  },
  {
   "t": "    }",
   "n": 105
  },
  {
   "t": "    // Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar yo'q",
   "n": 106
  },
  {
   "t": "    if (y.tasdiqlagan !== null && o.tasdiqlagan !== null && y.tasdiqlagan > o.tasdiqlagan) {",
   "n": 107
  },
  {
   "t": "      xabarlar.push(`${nom} — kelishini tasdiqladi: ${y.tasdiqlagan} / ${y.qoshilgan}`);",
   "n": 108
  },
  {
   "t": "    }",
   "n": 109
  },
  {
   "t": "  }",
   "n": 110
  },
  {
   "t": "  return xabarlar;",
   "n": 111
  },
  {
   "t": "}",
   "n": 112
  },
  {
   "t": "",
   "n": 113
  },
  {
   "t": "// Ekrandagi jonli xabarlar: har biri bir necha soniyadan keyin o'zi yo'qoladi",
   "n": 114
  },
  {
   "t": "export type JonliXabar = { id: number; matn: string };",
   "n": 115
  },
  {
   "t": "const JONLI_XABAR_SONIYA = 4;",
   "n": 116
  },
  {
   "t": "let jonli: JonliXabar[] = [];",
   "n": 117
  },
  {
   "t": "let keyingiId = 1;",
   "n": 118
  },
  {
   "t": "const jonliKuzatuvchilar = new Set<(x: JonliXabar[]) => void>();",
   "n": 119
  },
  {
   "t": "",
   "n": 120
  },
  {
   "t": "function jonliYangila(yangi: JonliXabar[]) {",
   "n": 121
  },
  {
   "t": "  jonli = yangi;",
   "n": 122
  },
  {
   "t": "  jonliKuzatuvchilar.forEach((k) => k(jonli));",
   "n": 123
  },
  {
   "t": "}",
   "n": 124
  },
  {
   "t": "",
   "n": 125
  },
  {
   "t": "function jonliXabarQosh(matn: string) {",
   "n": 126
  },
  {
   "t": "  const xabar = { id: keyingiId++, matn };",
   "n": 127
  },
  {
   "t": "  jonliYangila([...jonli, xabar]);",
   "n": 128
  },
  {
   "t": "  setTimeout(() => jonliYangila(jonli.filter((x) => x.id !== xabar.id)), JONLI_XABAR_SONIYA * 1000);",
   "n": 129
  },
  {
   "t": "}",
   "n": 130
  },
  {
   "t": "",
   "n": 131
  },
  {
   "t": "export function useJonliXabarlar(): JonliXabar[] {",
   "n": 132
  },
  {
   "t": "  const [x, setX] = useState(jonli);",
   "n": 133
  },
  {
   "t": "  useEffect(() => {",
   "n": 134
  },
  {
   "t": "    jonliKuzatuvchilar.add(setX);",
   "n": 135
  },
  {
   "t": "    return () => {",
   "n": 136
  },
  {
   "t": "      jonliKuzatuvchilar.delete(setX);",
   "n": 137
  },
  {
   "t": "    };",
   "n": 138
  },
  {
   "t": "  }, []);",
   "n": 139
  },
  {
   "t": "  return x;",
   "n": 140
  },
  {
   "t": "}",
   "n": 141
  },
  {
   "t": "",
   "n": 142
  },
  {
   "t": "// Backend'ga hodisa yuborish (masalan, «O'yin» ekrani ochildi / yopildi). Ulanish bo'lmasa — hech narsa qilmaydi.",
   "n": 143
  },
  {
   "t": "export function xabarYubor(nom: string, malumot: unknown) {",
   "n": 144
  },
  {
   "t": "  ulanish?.emit(nom, malumot);",
   "n": 145
  },
  {
   "t": "}",
   "n": 146
  },
  {
   "t": "",
   "n": 147
  },
  {
   "t": "// «O'yin» ekrani uchun: shu o'yin ekranini hozir ochib turgan ulanishlar soni (hali kelmagan bo'lsa — null)",
   "n": 148
  },
  {
   "t": "export function useKorayotganlar(oyinId: number): number | null {",
   "n": 149
  },
  {
   "t": "  const [soni, setSoni] = useState(korayotganlar.get(oyinId) ?? null);",
   "n": 150
  },
  {
   "t": "  useEffect(() => {",
   "n": 151
  },
  {
   "t": "    const k = () => setSoni(korayotganlar.get(oyinId) ?? null);",
   "n": 152
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.add(k);",
   "n": 153
  },
  {
   "t": "    return () => {",
   "n": 154
  },
  {
   "t": "      korayotganlarniKuzatuvchilar.delete(k);",
   "n": 155
  },
  {
   "t": "    };",
   "n": 156
  },
  {
   "t": "  }, [oyinId]);",
   "n": 157
  },
  {
   "t": "  return soni;",
   "n": 158
  },
  {
   "t": "}",
   "n": 159
  },
  {
   "t": "",
   "n": 160
  },
  {
   "t": "// «Hisobdan chiqish»: ulanish yopiladi. Qayta kirilganda ulan() yangi token bilan yangi ulanish ochadi.",
   "n": 161
  },
  {
   "t": "export function uzil() {",
   "n": 162
  },
  {
   "t": "  ilovaHolati?.remove();",
   "n": 163
  },
  {
   "t": "  ilovaHolati = null;",
   "n": 164
  },
  {
   "t": "  ulanish?.removeAllListeners();",
   "n": 165
  },
  {
   "t": "  ulanish?.disconnect();",
   "n": 166
  },
  {
   "t": "  ulanish = null;",
   "n": 167
  },
  {
   "t": "  korayotganlar.clear();",
   "n": 168
  },
  {
   "t": "  holatQoy('ulanmagan');",
   "n": 169
  },
  {
   "t": "}",
   "n": 170
  },
  {
   "t": "",
   "n": 171
  },
  {
   "t": "// Ekranda belgi uchun: hozirgi holat va uning o'zgarishi",
   "n": 172
  },
  {
   "t": "export function useUlanishHolati(): UlanishHolati {",
   "n": 173
  },
  {
   "t": "  const [h, setH] = useState(holat);",
   "n": 174
  },
  {
   "t": "  useEffect(() => {",
   "n": 175
  },
  {
   "t": "    holatniKuzatuvchilar.add(setH);",
   "n": 176
  },
  {
   "t": "    setH(holat);",
   "n": 177
  },
  {
   "t": "    return () => {",
   "n": 178
  },
  {
   "t": "      holatniKuzatuvchilar.delete(setH);",
   "n": 179
  },
  {
   "t": "    };",
   "n": 180
  },
  {
   "t": "  }, []);",
   "n": 181
  },
  {
   "t": "  return h;",
   "n": 182
  },
  {
   "t": "}",
   "n": 183
  }
 ]
};
const KOD_MJ_UL = {
 "file": "mobil/src/ulanish.ts",
 "tag": "m12-dars-05-done",
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
   "t": "import { kunNomi } from '@/kun';",
   "n": 6
  },
  {
   "t": "import { oxirgiRoyxat, oyinlarniOl, type Oyin } from '@/oyin';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "// Doimiy ulanish (socket.io): ilova Backend'ga bir marta ulanadi, ulanish ochiq turadi.",
   "n": 9
  },
  {
   "t": "// Manzil — o'sha EXPO_PUBLIC_API_URL; ulanayotganda token yuboriladi (auth) — Backend uni shu paytda tekshiradi.",
   "n": 10
  },
  {
   "t": "// Hodisa oyin-ozgardi { oyinId, sabab } kelganda ilova GET /oyinlar ni bir marta qayta so'raydi —",
   "n": 11
  },
  {
   "t": "// «O'yinlar» va «O'yin» shu bitta javobdan yangilanadi (oyin.ts). Hodisa o'zgarish bo'lganini aytadi; yangi holat — Backend'dan.",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "// Uch ulanish holati:",
   "n": 14
  },
  {
   "t": "// ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin) ·",
   "n": 15
  },
  {
   "t": "// ulanmagan — ilova urinmayapti (token yo'q yoki yaroqsiz, yoki hisobdan chiqilgan)",
   "n": 16
  },
  {
   "t": "export type UlanishHolati = 'ulangan' | 'ulanmoqda' | 'ulanmagan';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "let ulanish: Socket | null = null;",
   "n": 19
  },
  {
   "t": "let ilovaHolati: NativeEventSubscription | null = null;",
   "n": 20
  },
  {
   "t": "// Hozir ochiq turgan «O'yin» ekrani (yo'q bo'lsa — null)",
   "n": 21
  },
  {
   "t": "let ochiqOyin: number | null = null;",
   "n": 22
  },
  {
   "t": "let holat: UlanishHolati = 'ulanmagan';",
   "n": 23
  },
  {
   "t": "const holatniKuzatuvchilar = new Set<(h: UlanishHolati) => void>();",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "// «Hozir ko'ryapti»: Backend xonaga yuborgan son — o'yin bo'yicha (korayotganlar-ozgardi { oyinId, soni })",
   "n": 26
  },
  {
   "t": "const korayotganlar = new Map<number, number>();",
   "n": 27
  },
  {
   "t": "const korayotganlarniKuzatuvchilar = new Set<() => void>();",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "function holatQoy(yangi: UlanishHolati) {",
   "n": 30
  },
  {
   "t": "  holat = yangi;",
   "n": 31
  },
  {
   "t": "  holatniKuzatuvchilar.forEach((k) => k(yangi));",
   "n": 32
  },
  {
   "t": "}",
   "n": 33
  },
  {
   "t": "",
   "n": 34
  },
  {
   "t": "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
   "n": 35
  },
  {
   "t": "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
   "n": 36
  },
  {
   "t": "function uzilishdanKeyin() {",
   "n": 37
  },
  {
   "t": "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
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
   "t": "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
   "n": 41
  },
  {
   "t": "// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.",
   "n": 42
  },
  {
   "t": "export async function ulan() {",
   "n": 43
  },
  {
   "t": "  if (ulanish) return;",
   "n": 44
  },
  {
   "t": "  const token = await tokenOl();",
   "n": 45
  },
  {
   "t": "  if (!token || ulanish) return;",
   "n": 46
  },
  {
   "t": "",
   "n": 47
  },
  {
   "t": "  ulanish = io(API, { auth: { token } });",
   "n": 48
  },
  {
   "t": "  holatQoy('ulanmoqda');",
   "n": 49
  },
  {
   "t": "  // connect birinchi ulanishda VA har qayta ulanishda ishlaydi — shuning uchun ichida tinglovchi qo'shilmaydi",
   "n": 50
  },
  {
   "t": "  // (aks holda har qayta ulanishda yana bittasi qo'shilib, bitta hodisa ikki marta ishlaydi — takror hodisa).",
   "n": 51
  },
  {
   "t": "  // Ichida faqat: qayta so'rash (uzilish paytida yuborilgan hodisa keyin kelmaydi) va ochiq o'yin xonasiga qayta kirish",
   "n": 52
  },
  {
   "t": "  // (uzilganda ulanish hamma xonadan chiqqan).",
   "n": 53
  },
  {
   "t": "  ulanish.on('connect', () => {",
   "n": 54
  },
  {
   "t": "    holatQoy('ulangan');",
   "n": 55
  },
  {
   "t": "    qaytaSora();",
   "n": 56
  },
  {
   "t": "    if (ochiqOyin !== null) ulanish?.emit('oyin-ochildi', { oyinId: ochiqOyin });",
   "n": 57
  },
  {
   "t": "  });",
   "n": 58
  },
  {
   "t": "  // Tinglovchi bir marta — connect dan tashqarida",
   "n": 59
  },
  {
   "t": "  ulanish.on('oyin-ozgardi', async () => {",
   "n": 60
  },
  {
   "t": "    const oldingi = oxirgiRoyxat();",
   "n": 61
  },
  {
   "t": "    const yangi = await qaytaSora();",
   "n": 62
  },
  {
   "t": "    if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);",
   "n": 63
  },
  {
   "t": "  });",
   "n": 64
  },
  {
   "t": "  ulanish.on('disconnect', uzilishdanKeyin);",
   "n": 65
  },
  {
   "t": "  ulanish.on('connect_error', uzilishdanKeyin);",
   "n": 66
  },
  {
   "t": "  ulanish.on('korayotganlar-ozgardi', (m: { oyinId: number; soni: number }) => {",
   "n": 67
  },
  {
   "t": "    korayotganlar.set(m.oyinId, m.soni);",
   "n": 68
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.forEach((k) => k());",
   "n": 69
  },
  {
   "t": "  });",
   "n": 70
  },
  {
   "t": "",
   "n": 71
  },
  {
   "t": "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
   "n": 72
  },
  {
   "t": "  let oldingi: string | null | undefined = AppState.currentState;",
   "n": 73
  },
  {
   "t": "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
   "n": 74
  },
  {
   "t": "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
   "n": 75
  },
  {
   "t": "    oldingi = yangi;",
   "n": 76
  },
  {
   "t": "  });",
   "n": 77
  },
  {
   "t": "}",
   "n": 78
  },
  {
   "t": "",
   "n": 79
  },
  {
   "t": "// Hodisadan keyin — GET /oyinlar bir marta; xato bo'lsa ekranda eski ro'yxat qoladi (pastga tortib yangilash ishlaydi)",
   "n": 80
  },
  {
   "t": "function qaytaSora(): Promise<Oyin[] | null> {",
   "n": 81
  },
  {
   "t": "  return oyinlarniOl().catch(() => null);",
   "n": 82
  },
  {
   "t": "}",
   "n": 83
  },
  {
   "t": "",
   "n": 84
  },
  {
   "t": "// Jonli xabar — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar (_layout.tsx ko'rsatadi).",
   "n": 85
  },
  {
   "t": "// Qaysi xabar — sababga qarab emas: hodisadan keyingi javob oldingisi bilan solishtiriladi.",
   "n": 86
  },
  {
   "t": "// Faqat o'ziga tegishli o'yin uchun (qo'shilgan, navbatda yoki o'zi e'lon qilgan); o'z harakati uchun chiqmaydi; ism yo'q.",
   "n": 87
  },
  {
   "t": "// O'z harakati — javobdagi o'z maydonlarim (menQoshilganman, menNavbatdaman, menTasdiqlaganman) o'zgargan",
   "n": 88
  },
  {
   "t": "// (navbatdan o'yinga o'tish bundan mustasno). Hodisaga yangi maydon qo'shilmagan.",
   "n": 89
  },
  {
   "t": "export function jonliXabarlar(oldingi: Oyin[], yangi: Oyin[]): string[] {",
   "n": 90
  },
  {
   "t": "  const xabarlar: string[] = [];",
   "n": 91
  },
  {
   "t": "  for (const y of yangi) {",
   "n": 92
  },
  {
   "t": "    const o = oldingi.find((x) => x.id === y.id);",
   "n": 93
  },
  {
   "t": "    if (!o) continue; // yangi e'lon — ro'yxatda jim paydo bo'ladi",
   "n": 94
  },
  {
   "t": "    const nom = `${kunNomi(y.kun)}, ${y.soat}`;",
   "n": 95
  },
  {
   "t": "    if (o.menNavbatdaman && y.menQoshilganman) {",
   "n": 96
  },
  {
   "t": "      xabarlar.push(`Navbatdan o'yinga o'tdingiz: ${nom}`);",
   "n": 97
  },
  {
   "t": "      continue;",
   "n": 98
  },
  {
   "t": "    }",
   "n": 99
  },
  {
   "t": "    const tegishli = y.menQoshilganman || y.menNavbatdaman || y.menTashkilotchiman;",
   "n": 100
  },
  {
   "t": "    const ozim =",
   "n": 101
  },
  {
   "t": "      o.menQoshilganman !== y.menQoshilganman ||",
   "n": 102
  },
  {
   "t": "      o.menNavbatdaman !== y.menNavbatdaman ||",
   "n": 103
  },
  {
   "t": "      o.menTasdiqlaganman !== y.menTasdiqlaganman;",
   "n": 104
  },
  {
   "t": "    if (!tegishli || ozim) continue;",
   "n": 105
  },
  {
   "t": "    if (y.qoshilgan > o.qoshilgan) {",
   "n": 106
  },
  {
   "t": "      xabarlar.push(",
   "n": 107
  },
  {
   "t": "        y.qoshilgan >= y.kerak",
   "n": 108
  },
  {
   "t": "          ? `${nom} — o'yin to'ldi: ${y.qoshilgan} / ${y.kerak}`",
   "n": 109
  },
  {
   "t": "          : `${nom} — yana bir o'yinchi qo'shildi: ${y.qoshilgan} / ${y.kerak}`,",
   "n": 110
  },
  {
   "t": "      );",
   "n": 111
  },
  {
   "t": "    } else if (y.qoshilgan < o.qoshilgan) {",
   "n": 112
  },
  {
   "t": "      xabarlar.push(`${nom} — joy bo'shadi: ${y.qoshilgan} / ${y.kerak}`);",
   "n": 113
  },
  {
   "t": "    }",
   "n": 114
  },
  {
   "t": "    // Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar yo'q",
   "n": 115
  },
  {
   "t": "    if (y.tasdiqlagan !== null && o.tasdiqlagan !== null && y.tasdiqlagan > o.tasdiqlagan) {",
   "n": 116
  },
  {
   "t": "      xabarlar.push(`${nom} — kelishini tasdiqladi: ${y.tasdiqlagan} / ${y.qoshilgan}`);",
   "n": 117
  },
  {
   "t": "    }",
   "n": 118
  },
  {
   "t": "  }",
   "n": 119
  },
  {
   "t": "  return xabarlar;",
   "n": 120
  },
  {
   "t": "}",
   "n": 121
  },
  {
   "t": "",
   "n": 122
  },
  {
   "t": "// Ekrandagi jonli xabarlar: har biri bir necha soniyadan keyin o'zi yo'qoladi",
   "n": 123
  },
  {
   "t": "export type JonliXabar = { id: number; matn: string };",
   "n": 124
  },
  {
   "t": "const JONLI_XABAR_SONIYA = 4;",
   "n": 125
  },
  {
   "t": "let jonli: JonliXabar[] = [];",
   "n": 126
  },
  {
   "t": "let keyingiId = 1;",
   "n": 127
  },
  {
   "t": "const jonliKuzatuvchilar = new Set<(x: JonliXabar[]) => void>();",
   "n": 128
  },
  {
   "t": "",
   "n": 129
  },
  {
   "t": "function jonliYangila(yangi: JonliXabar[]) {",
   "n": 130
  },
  {
   "t": "  jonli = yangi;",
   "n": 131
  },
  {
   "t": "  jonliKuzatuvchilar.forEach((k) => k(jonli));",
   "n": 132
  },
  {
   "t": "}",
   "n": 133
  },
  {
   "t": "",
   "n": 134
  },
  {
   "t": "function jonliXabarQosh(matn: string) {",
   "n": 135
  },
  {
   "t": "  const xabar = { id: keyingiId++, matn };",
   "n": 136
  },
  {
   "t": "  jonliYangila([...jonli, xabar]);",
   "n": 137
  },
  {
   "t": "  setTimeout(() => jonliYangila(jonli.filter((x) => x.id !== xabar.id)), JONLI_XABAR_SONIYA * 1000);",
   "n": 138
  },
  {
   "t": "}",
   "n": 139
  },
  {
   "t": "",
   "n": 140
  },
  {
   "t": "export function useJonliXabarlar(): JonliXabar[] {",
   "n": 141
  },
  {
   "t": "  const [x, setX] = useState(jonli);",
   "n": 142
  },
  {
   "t": "  useEffect(() => {",
   "n": 143
  },
  {
   "t": "    jonliKuzatuvchilar.add(setX);",
   "n": 144
  },
  {
   "t": "    return () => {",
   "n": 145
  },
  {
   "t": "      jonliKuzatuvchilar.delete(setX);",
   "n": 146
  },
  {
   "t": "    };",
   "n": 147
  },
  {
   "t": "  }, []);",
   "n": 148
  },
  {
   "t": "  return x;",
   "n": 149
  },
  {
   "t": "}",
   "n": 150
  },
  {
   "t": "",
   "n": 151
  },
  {
   "t": "// «O'yin» ekrani ochildi / yopildi: Backend o'yin xonasiga qo'shadi / chiqaradi («Hozir ko'ryapti»).",
   "n": 152
  },
  {
   "t": "// Ochiq o'yin eslab qolinadi — qayta ulanganda o'sha xonaga qayta kiriladi.",
   "n": 153
  },
  {
   "t": "export function oyinniOch(oyinId: number) {",
   "n": 154
  },
  {
   "t": "  ochiqOyin = oyinId;",
   "n": 155
  },
  {
   "t": "  ulanish?.emit('oyin-ochildi', { oyinId });",
   "n": 156
  },
  {
   "t": "}",
   "n": 157
  },
  {
   "t": "",
   "n": 158
  },
  {
   "t": "export function oyinniYop(oyinId: number) {",
   "n": 159
  },
  {
   "t": "  if (ochiqOyin === oyinId) ochiqOyin = null;",
   "n": 160
  },
  {
   "t": "  ulanish?.emit('oyin-yopildi', { oyinId });",
   "n": 161
  },
  {
   "t": "}",
   "n": 162
  },
  {
   "t": "",
   "n": 163
  },
  {
   "t": "// «O'yin» ekrani uchun: shu o'yin ekranini hozir ochib turgan ulanishlar soni (hali kelmagan bo'lsa — null)",
   "n": 164
  },
  {
   "t": "export function useKorayotganlar(oyinId: number): number | null {",
   "n": 165
  },
  {
   "t": "  const [soni, setSoni] = useState(korayotganlar.get(oyinId) ?? null);",
   "n": 166
  },
  {
   "t": "  useEffect(() => {",
   "n": 167
  },
  {
   "t": "    const k = () => setSoni(korayotganlar.get(oyinId) ?? null);",
   "n": 168
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.add(k);",
   "n": 169
  },
  {
   "t": "    return () => {",
   "n": 170
  },
  {
   "t": "      korayotganlarniKuzatuvchilar.delete(k);",
   "n": 171
  },
  {
   "t": "    };",
   "n": 172
  },
  {
   "t": "  }, [oyinId]);",
   "n": 173
  },
  {
   "t": "  return soni;",
   "n": 174
  },
  {
   "t": "}",
   "n": 175
  },
  {
   "t": "",
   "n": 176
  },
  {
   "t": "// «Hisobdan chiqish»: ulanish yopiladi. Qayta kirilganda ulan() yangi token bilan yangi ulanish ochadi.",
   "n": 177
  },
  {
   "t": "export function uzil() {",
   "n": 178
  },
  {
   "t": "  ilovaHolati?.remove();",
   "n": 179
  },
  {
   "t": "  ilovaHolati = null;",
   "n": 180
  },
  {
   "t": "  ulanish?.removeAllListeners();",
   "n": 181
  },
  {
   "t": "  ulanish?.disconnect();",
   "n": 182
  },
  {
   "t": "  ulanish = null;",
   "n": 183
  },
  {
   "t": "  korayotganlar.clear();",
   "n": 184
  },
  {
   "t": "  holatQoy('ulanmagan');",
   "n": 185
  },
  {
   "t": "}",
   "n": 186
  },
  {
   "t": "",
   "n": 187
  },
  {
   "t": "// Ekranda belgi uchun: hozirgi holat va uning o'zgarishi",
   "n": 188
  },
  {
   "t": "export function useUlanishHolati(): UlanishHolati {",
   "n": 189
  },
  {
   "t": "  const [h, setH] = useState(holat);",
   "n": 190
  },
  {
   "t": "  useEffect(() => {",
   "n": 191
  },
  {
   "t": "    holatniKuzatuvchilar.add(setH);",
   "n": 192
  },
  {
   "t": "    setH(holat);",
   "n": 193
  },
  {
   "t": "    return () => {",
   "n": 194
  },
  {
   "t": "      holatniKuzatuvchilar.delete(setH);",
   "n": 195
  },
  {
   "t": "    };",
   "n": 196
  },
  {
   "t": "  }, []);",
   "n": 197
  },
  {
   "t": "  return h;",
   "n": 198
  },
  {
   "t": "}",
   "n": 199
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nP HEAD fb8b8b4 ws1-done: jonli buyurtmalar paneli — socket.io gateway (order-changed), /\n M README.md\n M public/admin.html\n M scripts/live-client.js\n@nestjs/core 11.2.8\n@nestjs/websockets 11.2.8\n@nestjs/platform-socket.io 11.2.8\nsocket.io 4.8.4\nsocket.io-client 4.8.4\nGoogle Chrome 148.0.7778.96 \nWed Nov  4 09:37:19 PM +05 2026";
const KOD_OUT_00B = "# nusxalar farqi\n## start → done\n@@ -61,6 +61,7 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.\n   async function yukla() {\n     const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n     if (r.status === 401) {\n@@ -83,10 +84,15 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi\n+    ulanish.on('connect', () => {\n+      holatQoy('ulangan');\n+      yukla();\n+    });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n+    // tinglovchi bir marta, connect'dan TASHQARIDA (ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi)\n     ulanish.on('order-changed', () => yukla());\n   }\n \n@@ -94,13 +100,11 @@\n     e.preventDefault();\n     token = el('token').value.trim();\n     localStorage.setItem(\u0027adminToken', token);\n-    yukla();\n     ulan();\n   });\n \n   if (token) {\n     el('token').value = token;\n-    yukla();\n     ulan();\n   }\n </script>\n## start → xato\n@@ -61,6 +61,7 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.\n   async function yukla() {\n     const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n     if (r.status === 401) {\n@@ -83,24 +84,26 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi\n+    ulanish.on('connect', () => {\n+      holatQoy('ulangan');\n+      yukla();\n+      ulanish.on('order-changed', () => yukla());\n+    });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n-    ulanish.on('order-changed', () => yukla());\n   }\n \n   el('kirish').addEventListener('submit', (e) => {\n     e.preventDefault();\n     token = el('token').value.trim();\n     localStorage.setItem(\u0027adminToken', token);\n-    yukla();\n     ulan();\n   });\n \n   if (token) {\n     el('token').value = token;\n-    yukla();\n     ulan();\n   }\n </script>\n## start → tiklash (live.gateway.ts)\n@@ -16,7 +16,7 @@\n // Yangi holatni panel GET /admin/orders dan qayta so'raydi — hodisa ichida ro'yxat ham, son ham yo'q.\n export type OrderChangeReason = 'new' | 'status';\n \n-@WebSocketGateway()\n+@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })\n export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {\n   private readonly log = new Logger('Live');\n \n## start → done (scripts/live-client.js)\n@@ -21,6 +21,18 @@\n \n const s = io(url, { auth: { token } });\n console.log(`${t()} ulanmoqda… ${url}`);\n+// Panel kabi: har connect'da (birinchi va qayta) ro'yxat qayta so'raladi — uzilish paytidagi hodisa kelmaydi\n+async function royxat() {\n+  const r = await fetch(`${url}/admin/orders`, {\n+    headers: { Authorization: `Bearer ${token}` },\n+  });\n+  if (!r.ok) return console.log(`${t()} GET /admin/orders → ${r.status}`);\n+  const list = await r.json();\n+  console.log(\n+    `${t()} GET /admin/orders → ${list.length} ta` +\n+      (list.length ? `, eng yangisi #${list[0].id}` : ''),\n+  );\n+}\n s.on('connect', () => {\n   console.log(\n     `${t()} connect · ${holat(s)} · transport: ${s.io.engine.transport.name}`,\n@@ -28,6 +40,7 @@\n   s.io.engine.once('upgrade', (tr) =>\n     console.log(`${t()} transport: ${tr.name}`),\n   );\n+  royxat().catch((e) => console.log(`${t()} GET xato: ${e.message}`));\n });\n s.on('disconnect', (reason) =>\n   console.log(";
const KOD_OUT_01 = "# ws2-start (= ws1-done): connect faqat belgini yangilaydi\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:37:30 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:37:30 — server to'xtatildi (Ctrl+C)\n21:37:36 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:37:45 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:37:25.006 brauzer: GET /admin/orders (1)\n21:37:25.026 brauzer: WebSocket ochildi\n21:37:25.642 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:37:26.893 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:37:26.894 brauzer: GET /admin/orders (2)\n21:37:29.966 SURAT 01-qayta-ishga-start-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:37:26\n21:37:30.471 brauzer: WebSocket yopildi\n21:37:30.579 belgi: «Ulangan» → «Ulanmoqda…»\n21:37:31.529 SURAT 01-qayta-ishga-start-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:37:26\n21:37:39.237 brauzer: WebSocket ochildi\n21:37:39.325 belgi: «Ulanmoqda…» → «Ulangan»\n21:37:44.863 SURAT 01-qayta-ishga-start-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:37:26\n21:37:45.480 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 2\n\n## Terminal — npm run live\n$ npm run live\n21:37:26 ulanmoqda… http://localhost:3100\n21:37:26 connect · ulangan · transport: websocket\n21:37:26 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:37:30 disconnect: transport close · active=true → ulanmoqda\n21:37:31 connect_error: xhr poll error · active=true → ulanmoqda\n21:37:34 connect_error: xhr poll error · active=true → ulanmoqda\n21:37:37 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:37:22 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: d7Bg0BEV__qvrHg1AAAA\nLOG [Live] panel ulandi: LFvF9HD52kXfuq8BAAAB\n21:37:26 — Bobur botda buyurtma beradi\n21:37:26 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:37:26 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:37:26 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:37:26 — buyurtma #1 bazada\nLOG [Live] panel uzildi: d7Bg0BEV__qvrHg1AAAA\nLOG [Live] panel uzildi: LFvF9HD52kXfuq8BAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:37:36 Server 3100-portda ishlayapti\n21:37:36 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan)\n21:37:37 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:37:37 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:37:37 — buyurtma #2 bazada\nLOG [Live] panel ulandi: qpS-Amj3qpAfODi2AAAA\nLOG [Live] panel ulandi: Qm-5I_79EmmnLLc6AAAB\nLOG [Live] panel uzildi: Qm-5I_79EmmnLLc6AAAB\nLOG [Live] panel uzildi: qpS-Amj3qpAfODi2AAAA\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_02 = "# ws2-start: brauzer DevTools → Network → Offline (Playwright setOffline — o'sha CDP buyrug'i). Server va bot ishlab turibdi\n\n## Qadamlar\n21:38:39 — Offline yoqildi\n21:38:41 — Bobur buyurtma berdi (Offline paytida)\n21:38:45 — Offline o'chirildi\n21:38:50 — Offline yoqildi — 60 s\n21:38:55 — Bobur buyurtma berdi (Offline paytida)\n21:39:51 — Offline o'chirildi\n\n## Brauzer — panel\n21:38:38.933 brauzer: GET /admin/orders (1)\n21:38:38.961 brauzer: WebSocket ochildi\n21:38:39.573 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:38:39.883 — brauzer: Offline yoqildi (DevTools → Network → Offline)\n21:38:45.410 SURAT 02-offline-1 (1-offline-6s) — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:38:46.025 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:38:46.026 brauzer: GET /admin/orders (2)\n21:38:46.026 — brauzer: Offline o'chirildi\n21:38:50.025 SURAT 02-offline-2 (2-online) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:41\n21:38:50.641 — brauzer: Offline yoqildi (DevTools → Network → Offline)\n21:39:24.086 belgi: «Ulangan» → «Ulanmoqda…»\n21:39:50.655 SURAT 02-offline-3 (3-offline-60s) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:41\n21:39:51.268 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:39:51.268 — brauzer: Offline o'chirildi\n21:39:51.268 brauzer: WebSocket yopildi\n21:39:54.219 brauzer: WebSocket ochildi\n21:39:54.322 belgi: «Ulanmoqda…» → «Ulangan»\n21:39:59.240 SURAT 02-offline-4 (4-online) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:41\n21:39:59.854 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 2\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:38:36 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: laiEowve-I2iSZw3AAAA\n21:38:41 — Bobur botda buyurtma beradi\n21:38:41 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:41 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:38:41 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:38:41 — buyurtma #1 bazada\n21:38:55 — Bobur botda buyurtma beradi\n21:38:55 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:55 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:38:55 — buyurtma #2 bazada\nLOG [Live] panel uzildi: laiEowve-I2iSZw3AAAA\nLOG [Live] panel ulandi: -8pdx3IUvuj7Sem3AAAB\nLOG [Live] panel uzildi: -8pdx3IUvuj7Sem3AAAB";
const KOD_OUT_03 = "# ws2-start: tarmoq uzildi\n# Panel proksi orqali (localhost:3101 → server 3100). Proksi kesilganda ochiq ulanish uziladi, yangisi qabul qilinmaydi; server va bot ishlab turibdi\n\n## Qadamlar\n21:40:05 — tarmoq uzildi (proksi)\n21:40:08 — Bobur buyurtma berdi (panel tarmoqsiz)\n21:40:12 — tarmoq qaytdi\n\n## Brauzer — panel\n21:40:04.849 brauzer: GET /admin/orders (1)\n21:40:04.870 brauzer: WebSocket ochildi\n21:40:05.483 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:40:05.604 brauzer: WebSocket yopildi\n21:40:05.640 belgi: «Ulangan» → «Ulanmoqda…»\n21:40:07.658 SURAT 03-tarmoq-start-1 (1-tarmoq-yoq) — belgi «Ulanmoqda…» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:40:13.613 brauzer: WebSocket ochildi\n21:40:13.619 belgi: «Ulanmoqda…» → «Ulangan»\n21:40:20.389 SURAT 03-tarmoq-start-2 (2-qayta-ulangan) — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:40:20.852 tugadi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q · jami GET: 1\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:03 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: Y2whZ46rcEXlodQqAAAA\nLOG [Live] panel uzildi: Y2whZ46rcEXlodQqAAAA\n21:40:08 — Bobur botda buyurtma beradi\n21:40:08 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:40:08 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:40:08 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:40:08 — buyurtma #1 bazada\nLOG [Live] panel ulandi: FxbJ0MjfHWCjRxaGAAAB\nLOG [Live] panel uzildi: FxbJ0MjfHWCjRxaGAAAB\n\n## Baza (psql): orders — 1 ta, eng yangisi #1";
const KOD_OUT_04 = "# ws2-done: connect ichida yukla() — har ulanishda ro'yxat qayta so'raladi (navbat0: buyurtma port ochilishidan oldin)\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:38:07 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:38:07 — server to'xtatildi (Ctrl+C)\n21:38:13 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:38:22 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:38:01.999 brauzer: WebSocket ochildi\n21:38:02.011 brauzer: GET /admin/orders (1)\n21:38:02.624 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:38:03.888 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:38:03.888 brauzer: GET /admin/orders (2)\n21:38:06.946 SURAT 04-qayta-ishga-done-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:03\n21:38:07.462 brauzer: WebSocket yopildi\n21:38:07.559 belgi: «Ulangan» → «Ulanmoqda…»\n21:38:08.660 SURAT 04-qayta-ishga-done-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:03\n21:38:15.516 brauzer: WebSocket ochildi\n21:38:15.523 brauzer: GET /admin/orders (3)\n21:38:15.544 belgi: «Ulanmoqda…» → «Ulangan»\n21:38:21.995 SURAT 04-qayta-ishga-done-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:13\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:03\n21:38:22.610 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 3\n\n## Terminal — npm run live\n$ npm run live\n21:38:03 ulanmoqda… http://localhost:3100\n21:38:03 connect · ulangan · transport: websocket\n21:38:03 GET /admin/orders → 0 ta\n21:38:03 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:38:07 disconnect: transport close · active=true → ulanmoqda\n21:38:08 connect_error: xhr poll error · active=true → ulanmoqda\n21:38:11 connect_error: xhr poll error · active=true → ulanmoqda\n21:38:13 connect_error: xhr poll error · active=true → ulanmoqda\n21:38:18 connect · ulangan · transport: websocket\n21:38:18 GET /admin/orders → 2 ta, eng yangisi #2\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:37:59 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 48kR4MXvY3S1MA3RAAAA\nLOG [Live] panel ulandi: U8-1nrpgyX9PioJJAAAB\n21:38:03 — Bobur botda buyurtma beradi\n21:38:03 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:03 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:38:03 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:38:03 — buyurtma #1 bazada\nLOG [Live] panel uzildi: 48kR4MXvY3S1MA3RAAAA\nLOG [Live] panel uzildi: U8-1nrpgyX9PioJJAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:38:13 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin)\n21:38:13 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:13 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:38:13 — buyurtma #2 bazada\n21:38:13 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: NJfgBgr7CIwVQh10AAAA\nLOG [Live] panel ulandi: B62ZzdxKkgWhnrLXAAAB\nLOG [Live] panel uzildi: NJfgBgr7CIwVQh10AAAA\nLOG [Live] panel uzildi: B62ZzdxKkgWhnrLXAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_05 = "# ws2-done: tarmoq uzildi\n# Panel proksi orqali (localhost:3101 → server 3100). Proksi kesilganda ochiq ulanish uziladi, yangisi qabul qilinmaydi; server va bot ishlab turibdi\n\n## Qadamlar\n21:40:26 — tarmoq uzildi (proksi)\n21:40:29 — Bobur buyurtma berdi (panel tarmoqsiz)\n21:40:33 — tarmoq qaytdi\n\n## Brauzer — panel\n21:40:25.633 brauzer: WebSocket ochildi\n21:40:25.635 brauzer: GET /admin/orders (1)\n21:40:26.246 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:40:26.407 brauzer: WebSocket yopildi\n21:40:26.557 belgi: «Ulangan» → «Ulanmoqda…»\n21:40:28.572 SURAT 05-tarmoq-done-1 (1-tarmoq-yoq) — belgi «Ulanmoqda…» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:40:37.473 brauzer: WebSocket ochildi\n21:40:37.477 brauzer: GET /admin/orders (2)\n21:40:37.588 belgi: «Ulanmoqda…» → «Ulangan»\n21:40:41.137 SURAT 05-tarmoq-done-2 (2-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:29\n21:40:41.753 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 2\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:24 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 0zMOutxyWCkHtkd5AAAA\nLOG [Live] panel uzildi: 0zMOutxyWCkHtkd5AAAA\n21:40:29 — Bobur botda buyurtma beradi\n21:40:29 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:40:29 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:40:29 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:40:29 — buyurtma #1 bazada\nLOG [Live] panel ulandi: SGH-4_OFP1ab9t_AAAAB\nLOG [Live] panel uzildi: SGH-4_OFP1ab9t_AAAAB\n\n## Baza (psql): orders — 1 ta, eng yangisi #1";
const KOD_OUT_06 = "# xato nusxa: tinglovchi connect ichida (sodda tuzatish) — 00b-nusxalar-farqi.txt\n\n## Qadamlar\n21:40:46 — 1-buyurtma (birinchi ulanish)\n21:40:50 — server qayta ishga tushirildi (1)\n21:41:00 — 2-buyurtma (1 qayta ulanishdan keyin)\n21:41:03 — server qayta ishga tushirildi (2)\n21:41:13 — 3-buyurtma (2 qayta ulanishdan keyin)\n\n## Brauzer — panel\n21:40:46.232 brauzer: WebSocket ochildi\n21:40:46.234 brauzer: GET /admin/orders (1)\n21:40:46.845 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:40:47.032 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:40:47.032 brauzer: GET /admin/orders (2)\n21:40:50.089 SURAT 06-takror-1 (1-birinchi-ulanish) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:47\n21:40:50.609 brauzer: WebSocket yopildi\n21:40:50.700 belgi: «Ulangan» → «Ulanmoqda…»\n21:40:53.765 brauzer: WebSocket ochildi\n21:40:53.775 brauzer: GET /admin/orders (3)\n21:40:53.908 belgi: «Ulanmoqda…» → «Ulangan»\n21:41:00.271 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:41:00.271 brauzer: GET /admin/orders (4)\n21:41:00.271 brauzer: GET /admin/orders (5)\n21:41:03.428 SURAT 06-takror-2 (2-bir-qayta-ulanish) — belgi «Ulangan» · ro'yxat: #2, #1\n    2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:41:00\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:47\n21:41:03.860 brauzer: WebSocket yopildi\n21:41:03.889 belgi: «Ulangan» → «Ulanmoqda…»\n21:41:11.262 brauzer: WebSocket ochildi\n21:41:11.271 brauzer: GET /admin/orders (6)\n21:41:11.369 belgi: «Ulanmoqda…» → «Ulangan»\n21:41:13.523 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":3,\"reason\":\"new\"}]\n21:41:13.524 brauzer: GET /admin/orders (7)\n21:41:13.524 brauzer: GET /admin/orders (8)\n21:41:13.524 brauzer: GET /admin/orders (9)\n21:41:16.604 SURAT 06-takror-3 (3-ikki-qayta-ulanish) — belgi «Ulangan» · ro'yxat: #3, #2, #1\n    3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:41:13\n    2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:41:00\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:47\n21:41:17.220 tugadi — belgi «Ulangan» · ro'yxat: #3, #2, #1 · jami GET: 9\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:45 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: _akFI5auzjkZmwDNAAAA\n21:40:46 — Bobur botda buyurtma beradi\n21:40:47 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:40:47 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:40:47 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:40:47 — buyurtma #1 bazada\nLOG [Live] panel uzildi: _akFI5auzjkZmwDNAAAA\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:53 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 9a5dXu0kfb_SE12YAAAA\n21:41:00 — Bobur botda buyurtma beradi\n21:41:00 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:00 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:41:00 — buyurtma #2 bazada\nLOG [Live] panel uzildi: 9a5dXu0kfb_SE12YAAAA\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:41:06 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: WK5Rw7L7zjZbSSbRAAAA\n21:41:13 — Bobur botda buyurtma beradi\n21:41:13 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:13 bot → 5987654321: Buyurtma #3 qabul qilindi!\n21:41:13 — buyurtma #3 bazada\nLOG [Live] panel uzildi: WK5Rw7L7zjZbSSbRAAAA";
const KOD_OUT_07 = "# tiklash nusxa: @WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 daqiqa } }) — klient socket.recovered ni ko'rsatadi\n\n## Qadamlar\n21:41:23 — A) klient hali hech qanday hodisa olmagan — tarmoq uzildi (proksi)\n21:41:24 — Bobur buyurtma berdi (klient tarmoqsiz)\n21:41:28 — tarmoq qaytdi\n21:41:36 — B) Bobur buyurtma berdi — klient hodisani oladi (oxirgi tartib belgisi bor)\n21:41:39 — B) tarmoq uzildi (proksi)\n21:41:40 — Bobur buyurtma berdi (klient tarmoqsiz)\n21:41:44 — tarmoq qaytdi\n21:41:52 — C) server to'xtatildi\n21:41:55 — server qayta ishga tushirildi (navbat — o'chiq paytda yozilgan buyurtma)\n\n## Klient\n21:41:21 connect · recovered=false · id 0BGx0Q…\n21:41:23 disconnect: transport close\n21:41:23 connect_error: xhr poll error\n21:41:26 connect_error: xhr poll error\n21:41:29 connect · recovered=false · id hIhhHg…\n21:41:36 order-changed {\"orderId\":2,\"reason\":\"new\"}\n21:41:39 disconnect: transport close\n21:41:40 connect_error: xhr poll error\n21:41:42 connect_error: xhr poll error\n21:41:47 order-changed {\"orderId\":3,\"reason\":\"new\"}\n21:41:47 connect · recovered=true · id hIhhHg…\n21:41:52 disconnect: transport close\n21:41:52 connect_error: xhr poll error\n21:41:54 connect_error: xhr poll error\n21:41:57 connect · recovered=false · id RPfAIC…\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:41:20 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 0BGx0QzTjkH_PZrPAAAA\nLOG [Live] panel uzildi: 0BGx0QzTjkH_PZrPAAAA\n21:41:24 — Bobur botda buyurtma beradi\n21:41:24 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:24 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:41:24 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:41:24 — buyurtma #1 bazada\nLOG [Live] panel ulandi: hIhhHg2kU6QO_lHsAAAC\n21:41:36 — Bobur botda buyurtma beradi\n21:41:36 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:36 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:41:36 — buyurtma #2 bazada\nLOG [Live] panel uzildi: hIhhHg2kU6QO_lHsAAAC\n21:41:40 — Bobur botda buyurtma beradi\n21:41:40 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:40 bot → 5987654321: Buyurtma #3 qabul qilindi!\n21:41:40 — buyurtma #3 bazada\nLOG [Live] panel ulandi: hIhhHg2kU6QO_lHsAAAC\nLOG [Live] panel uzildi: hIhhHg2kU6QO_lHsAAAC\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:41:55 Server 3100-portda ishlayapti\n21:41:56 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan)\n21:41:56 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:56 bot → 5987654321: Buyurtma #4 qabul qilindi!\n21:41:56 — buyurtma #4 bazada\nLOG [Live] panel ulandi: RPfAICbTunu2GtS2AAAA\nLOG [Live] panel uzildi: RPfAICbTunu2GtS2AAAA";
const KOD_OUT_08 = "$ npm test\nPASS src/api/live/admin.controller.spec.ts\nPASS src/api/live/live.gateway.spec.ts\nPASS src/api/app.controller.spec.ts\nPASS src/api/order/order.service.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/telegram/phone.spec.ts\nPASS src/api/telegram/texts.spec.ts\nTest Suites: 7 passed, 7 total\nTests:       32 passed, 32 total\n\n$ npm run smoke\n— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor\nTelegram bot ulandi\n  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\n— live: jonli panel — tokensiz ulanish, yangi buyurtma va holat o'zgarishi\nTelegram bot ulandi\n  ✓ tokensiz ulanish — server yopdi: io server disconnect\n  ✓ yangi buyurtma → order-changed {\"orderId\":5,\"reason\":\"new\"}\n  ✓ GET /admin/orders 200 — eng yuqorida #5 · Bobur\n  ✓ admin tasdiqladi → order-changed {\"orderId\":5,\"reason\":\"status\"}\nNATIJA: 9/9 ✓";
const KOD_OUT_09 = "# ws2-done: token «notogri» — alohida yukla() olib tashlangan, ro'yxat faqat connect va order-changed'da\n\n## Brauzer — panel\n21:42:40.194 brauzer: WebSocket ochildi\n21:42:40.197 brauzer: GET /admin/orders (1)\n21:42:40.198 brauzer: WebSocket yopildi\n21:42:50.793 panel ochildi — belgi «Ulanmagan» · ro'yxat: Token noto'g'ri\n21:42:52.050 SURAT 09-notogri-1 (1-notogri-token) — belgi «Ulanmagan» · ro'yxat: Token noto'g'ri\n    Token noto'g'ri\n21:42:52.514 tugadi — belgi «Ulanmagan» · ro'yxat: Token noto'g'ri · jami GET: 1\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:42:37 Server 3100-portda ishlayapti";
const KOD_OUT_11 = "# ws2-done: brauzer DevTools → Network → Offline 60 s (02 ning ikkinchi yarmi, tuzatilgan kod)\n\n## Qadamlar\n21:42:57 — Bobur 1-buyurtma (ulangan paytda)\n21:43:01 — Offline yoqildi — 60 s\n21:43:06 — Bobur buyurtma berdi (Offline paytida)\n21:44:01 — Offline o'chirildi\n\n## Brauzer — panel\n21:42:56.960 brauzer: WebSocket ochildi\n21:42:56.963 brauzer: GET /admin/orders (1)\n21:42:57.575 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:42:57.760 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:42:57.760 brauzer: GET /admin/orders (2)\n21:43:00.817 SURAT 11-offline-done-1 (1-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:42:57\n21:43:01.433 — brauzer: Offline yoqildi (DevTools → Network → Offline)\n21:43:42.039 belgi: «Ulangan» → «Ulanmoqda…»\n21:44:01.447 SURAT 11-offline-done-2 (2-offline-60s) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:42:57\n21:44:02.061 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:44:02.061 — brauzer: Offline o'chirildi\n21:44:02.062 brauzer: WebSocket yopildi\n21:44:03.192 brauzer: WebSocket ochildi\n21:44:03.194 brauzer: GET /admin/orders (3)\n21:44:03.282 belgi: «Ulanmoqda…» → «Ulangan»\n21:44:10.031 SURAT 11-offline-done-3 (3-online) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:43:06\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:42:57\n21:44:10.645 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 3\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:42:55 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: EAtnTU0aL8t1rP-KAAAA\n21:42:57 — Bobur botda buyurtma beradi\n21:42:57 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:42:57 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:42:57 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:42:57 — buyurtma #1 bazada\n21:43:06 — Bobur botda buyurtma beradi\n21:43:06 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:43:06 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:43:06 — buyurtma #2 bazada\nLOG [Live] panel uzildi: EAtnTU0aL8t1rP-KAAAA\nLOG [Live] panel ulandi: kfan4IpOmFIR_GIVAAAB\nLOG [Live] panel uzildi: kfan4IpOmFIR_GIVAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2";
const KOD_OUT_12 = "# GitHub Actions — main e10d0d9 (ws2-done), run 41870843765\n✓ main CI · 41870843765\nTriggered via push about 8 minutes ago\nJOBS\n✓ test in 23s (ID 126717144206)\n✓ smoke in 42s (ID 126717520031)\nANNOTATIONS\n! Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/\ntest: .github#2\n- \"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\"\ntest: .github#1\n! Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/\nsmoke: .github#2\n- \"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\"\nsmoke: .github#1\nFor more information about a job, try: gh run view --job=<job-id>\nView this run on GitHub: https://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41870843765";
const KOD_OUT_AI1 = "# AI nusxasi ai1 (ws2v2-ai/ai1/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma (navbat0)\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:44:24 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:44:24 — server to'xtatildi (Ctrl+C)\n21:44:29 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:44:39 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:44:18.938 brauzer: GET /admin/orders (1)\n21:44:18.963 brauzer: WebSocket ochildi\n21:44:18.965 brauzer: GET /admin/orders (2)\n21:44:19.576 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:44:20.752 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:44:20.752 brauzer: GET /admin/orders (3)\n21:44:23.897 SURAT 10-qayta-ishga-ai1-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:20\n21:44:24.323 brauzer: WebSocket yopildi\n21:44:24.357 belgi: «Ulangan» → «Ulanmoqda…»\n21:44:25.462 SURAT 10-qayta-ishga-ai1-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:20\n21:44:31.438 brauzer: WebSocket ochildi\n21:44:31.448 brauzer: GET /admin/orders (4)\n21:44:31.576 belgi: «Ulanmoqda…» → «Ulangan»\n21:44:38.885 SURAT 10-qayta-ishga-ai1-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:30\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:20\n21:44:39.512 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 4\n\n## Terminal — npm run live\n$ npm run live\n21:44:19 ulanmoqda… http://localhost:3100\n21:44:19 connect · ulangan · transport: websocket\n21:44:20 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:44:24 disconnect: transport close · active=true → ulanmoqda\n21:44:25 connect_error: xhr poll error · active=true → ulanmoqda\n21:44:27 connect_error: xhr poll error · active=true → ulanmoqda\n21:44:32 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:44:17 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: GtBPm42auee8yqRvAAAA\nLOG [Live] panel ulandi: 6VPkJdAEWRQUM1zjAAAB\n21:44:20 — Bobur botda buyurtma beradi\n21:44:20 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:44:20 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:44:20 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:44:20 — buyurtma #1 bazada\nLOG [Live] panel uzildi: GtBPm42auee8yqRvAAAA\nLOG [Live] panel uzildi: 6VPkJdAEWRQUM1zjAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:44:30 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin)\n21:44:30 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:44:30 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:44:30 — buyurtma #2 bazada\n21:44:30 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 4A3yppa6aOF6ykarAAAA\nLOG [Live] panel ulandi: iNLqARshQbBc0fqRAAAB\nLOG [Live] panel uzildi: 4A3yppa6aOF6ykarAAAA\nLOG [Live] panel uzildi: iNLqARshQbBc0fqRAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_AI2 = "# AI nusxasi ai2 (ws2v2-ai/ai2/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma (navbat0)\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:45:10 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:45:10 — server to'xtatildi (Ctrl+C)\n21:45:16 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:45:26 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:45:05.167 brauzer: GET /admin/orders (1)\n21:45:05.208 brauzer: WebSocket ochildi\n21:45:05.214 brauzer: GET /admin/orders (2)\n21:45:05.837 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:45:07.009 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:45:07.009 brauzer: GET /admin/orders (3)\n21:45:10.084 SURAT 10-qayta-ishga-ai2-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:06\n21:45:10.542 brauzer: WebSocket yopildi\n21:45:10.551 belgi: «Ulangan» → «Ulanmoqda…»\n21:45:11.681 SURAT 10-qayta-ishga-ai2-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:06\n21:45:21.676 brauzer: WebSocket ochildi\n21:45:21.686 brauzer: GET /admin/orders (4)\n21:45:21.715 belgi: «Ulanmoqda…» → «Ulangan»\n21:45:25.934 SURAT 10-qayta-ishga-ai2-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:17\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:06\n21:45:26.558 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 4\n\n## Terminal — npm run live\n$ npm run live\n21:45:06 ulanmoqda… http://localhost:3100\n21:45:06 connect · ulangan · transport: websocket\n21:45:07 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:45:10 disconnect: transport close · active=true → ulanmoqda\n21:45:11 connect_error: xhr poll error · active=true → ulanmoqda\n21:45:14 connect_error: xhr poll error · active=true → ulanmoqda\n21:45:19 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:45:02 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: HB5cAN5c4q3l5JaAAAAA\nLOG [Live] panel ulandi: fWW9YI5KfzLNnTp0AAAB\n21:45:06 — Bobur botda buyurtma beradi\n21:45:06 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:45:06 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:45:07 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:45:07 — buyurtma #1 bazada\nLOG [Live] panel uzildi: HB5cAN5c4q3l5JaAAAAA\nLOG [Live] panel uzildi: fWW9YI5KfzLNnTp0AAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:45:17 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin)\n21:45:17 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:45:17 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:45:17 — buyurtma #2 bazada\n21:45:17 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: isLrqSw9Ej_8dBO3AAAA\nLOG [Live] panel ulandi: VhTttmk-vv5qxmHTAAAB\nLOG [Live] panel uzildi: VhTttmk-vv5qxmHTAAAB\nLOG [Live] panel uzildi: isLrqSw9Ej_8dBO3AAAA\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_AI1A = "# AI nusxasi ai1 (ws2v2-ai/ai1/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:19:33 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:19:33 — server to'xtatildi (Ctrl+C)\n21:19:39 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:19:48 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:19:28.215 brauzer: GET /admin/orders (1)\n21:19:28.234 brauzer: WebSocket ochildi\n21:19:28.236 brauzer: GET /admin/orders (2)\n21:19:28.849 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:19:29.927 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:19:29.927 brauzer: GET /admin/orders (3)\n21:19:33.058 SURAT 10-qayta-ishga-ai1-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n21:19:33.506 brauzer: WebSocket yopildi\n21:19:33.519 belgi: «Ulangan» → «Ulanmoqda…»\n21:19:34.657 SURAT 10-qayta-ishga-ai1-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n21:19:40.139 brauzer: WebSocket ochildi\n21:19:40.147 brauzer: GET /admin/orders (4)\n21:19:40.196 belgi: «Ulanmoqda…» → «Ulangan»\n21:19:40.361 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:19:40.361 brauzer: GET /admin/orders (5)\n21:19:48.258 SURAT 10-qayta-ishga-ai1-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n21:19:48.878 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 5\n\n## Terminal — npm run live\n$ npm run live\n21:19:29 ulanmoqda… http://localhost:3100\n21:19:29 connect · ulangan · transport: websocket\n21:19:29 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:19:33 disconnect: transport close · active=true → ulanmoqda\n21:19:34 connect_error: xhr poll error · active=true → ulanmoqda\n21:19:35 connect_error: xhr poll error · active=true → ulanmoqda\n21:19:38 connect_error: xhr poll error · active=true → ulanmoqda\n21:19:43 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:19:25 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: rMWZF8xoSJRTjN6yAAAA\nLOG [Live] panel ulandi: 8IQANn3bNcg1htzMAAAB\n21:19:29 — Bobur botda buyurtma beradi\n21:19:29 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:19:29 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:19:29 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:19:29 — buyurtma #1 bazada\nLOG [Live] panel uzildi: rMWZF8xoSJRTjN6yAAAA\nLOG [Live] panel uzildi: 8IQANn3bNcg1htzMAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:19:40 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: P1R_0G1DJCH2NAVvAAAA\n21:19:40 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan)\n21:19:40 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:19:40 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:19:40 — buyurtma #2 bazada\nLOG [Live] panel ulandi: dWN_sXGnO0-PYXasAAAB\nLOG [Live] panel uzildi: P1R_0G1DJCH2NAVvAAAA\nLOG [Live] panel uzildi: dWN_sXGnO0-PYXasAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2";
const KOD_OUT_MJ05 = "$ node ws2-sinov.js xona eski\n# ilova: ulanish.ts — m12-dars-04-done (agent «bajardim» degan holat) · o'yin 1 «Mahalla maydoni»\n  0.9s  [Ali] ulangan\n  1.3s  [Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  1.3s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---\n  2.3s  [Ali] ulanmoqda  (disconnect: transport close)\n  3.1s  [Ali] ulanmoqda  (connect_error: xhr poll error) …\n  6.1s  [Ali] ulangan\n  7.2s  [Vali] ulangan\n  7.2s  [Vali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  7.5s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  7.5s  [Vali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  9.0s  NATIJA: ikkala telefonda shu o'yin ochiq — kutilgan «Hozir ko'ryapti: 2»\n  9.0s  [Ali] ulanmagan  (disconnect: io client disconnect)\n  9.0s  [Vali] ulanmagan  (disconnect: io client disconnect)";
const KOD_OUT_MJ06 = "$ node ws2-sinov.js xona yangi\n# ilova: ulanish.ts — m12-dars-05-done (tuzatilgan) · o'yin 1 «Mahalla maydoni»\n  0.9s  [Ali] ulangan\n  0.9s  [Ali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  1.3s  [Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  1.3s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---\n  2.3s  [Ali] ulanmoqda  (disconnect: transport close)\n  3.7s  [Ali] ulangan\n  3.7s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  3.8s  [Ali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  4.7s  [Vali] ulangan\n  4.7s  [Vali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  5.1s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  5.1s  [Ali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":2})\n  5.1s  [Vali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":2})\n  6.6s  NATIJA: ikkala telefonda shu o'yin ochiq — kutilgan «Hozir ko'ryapti: 2»\n  6.6s  [Ali] ulanmagan  (disconnect: io client disconnect)\n  6.6s  [Vali] ulanmagan  (disconnect: io client disconnect)";
const KOD_PANEL = [
 {
  "k": "01-1",
  "t": "21:37:29",
  "note": "1-buyurtma-ulangan",
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
     "21:37:26"
    ]
   }
  ]
 },
 {
  "k": "01-2",
  "t": "21:37:31",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
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
     "21:37:26"
    ]
   }
  ]
 },
 {
  "k": "01-3",
  "t": "21:37:44",
  "note": "3-qayta-ulangan",
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
     "21:37:26"
    ]
   }
  ]
 },
 {
  "k": "02-1",
  "t": "21:38:45",
  "note": "1-offline-6s",
  "belgi": "Ulangan",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "02-2",
  "t": "21:38:50",
  "note": "2-online",
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
     "21:38:41"
    ]
   }
  ]
 },
 {
  "k": "02-3",
  "t": "21:39:50",
  "note": "3-offline-60s",
  "belgi": "Ulanmoqda…",
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
     "21:38:41"
    ]
   }
  ]
 },
 {
  "k": "02-4",
  "t": "21:39:59",
  "note": "4-online",
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
     "21:38:41"
    ]
   }
  ]
 },
 {
  "k": "03-1",
  "t": "21:40:07",
  "note": "1-tarmoq-yoq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "03-2",
  "t": "21:40:20",
  "note": "2-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "04-1",
  "t": "21:38:06",
  "note": "1-buyurtma-ulangan",
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
     "21:38:03"
    ]
   }
  ]
 },
 {
  "k": "04-2",
  "t": "21:38:08",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
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
     "21:38:03"
    ]
   }
  ]
 },
 {
  "k": "04-3",
  "t": "21:38:21",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:13"
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
     "21:38:03"
    ]
   }
  ]
 },
 {
  "k": "05-1",
  "t": "21:40:28",
  "note": "1-tarmoq-yoq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "05-2",
  "t": "21:40:41",
  "note": "2-qayta-ulangan",
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
     "21:40:29"
    ]
   }
  ]
 },
 {
  "k": "06-1",
  "t": "21:40:50",
  "note": "1-birinchi-ulanish",
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
     "21:40:47"
    ]
   }
  ]
 },
 {
  "k": "06-2",
  "t": "21:41:03",
  "note": "2-bir-qayta-ulanish",
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
     "21:41:00"
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
     "21:40:47"
    ]
   }
  ]
 },
 {
  "k": "06-3",
  "t": "21:41:16",
  "note": "3-ikki-qayta-ulanish",
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
     "Yangi",
     "21:41:13"
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
     "Yangi",
     "21:41:00"
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
     "21:40:47"
    ]
   }
  ]
 },
 {
  "k": "09-1",
  "t": "21:42:52",
  "note": "1-notogri-token",
  "belgi": "Ulanmagan",
  "rows": [
   {
    "msg": "Token noto'g'ri"
   }
  ]
 },
 {
  "k": "11-1",
  "t": "21:43:00",
  "note": "1-ulangan",
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
     "21:42:57"
    ]
   }
  ]
 },
 {
  "k": "11-2",
  "t": "21:44:01",
  "note": "2-offline-60s",
  "belgi": "Ulanmoqda…",
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
     "21:42:57"
    ]
   }
  ]
 },
 {
  "k": "11-3",
  "t": "21:44:10",
  "note": "3-online",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:43:06"
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
     "21:42:57"
    ]
   }
  ]
 },
 {
  "k": "ai1-1",
  "t": "21:44:23",
  "note": "1-buyurtma-ulangan",
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
     "21:44:20"
    ]
   }
  ]
 },
 {
  "k": "ai1-2",
  "t": "21:44:25",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
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
     "21:44:20"
    ]
   }
  ]
 },
 {
  "k": "ai1-3",
  "t": "21:44:38",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:44:30"
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
     "21:44:20"
    ]
   }
  ]
 },
 {
  "k": "ai2-1",
  "t": "21:45:10",
  "note": "1-buyurtma-ulangan",
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
     "21:45:06"
    ]
   }
  ]
 },
 {
  "k": "ai2-2",
  "t": "21:45:11",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
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
     "21:45:06"
    ]
   }
  ]
 },
 {
  "k": "ai2-3",
  "t": "21:45:25",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:45:17"
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
     "21:45:06"
    ]
   }
  ]
 },
 {
  "k": "ai1a-1",
  "t": "21:19:33",
  "note": "1-buyurtma-ulangan",
  "belgi": "Ulangan",
  "rows": []
 },
 {
  "k": "ai1a-2",
  "t": "21:19:34",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
  "rows": []
 },
 {
  "k": "ai1a-3",
  "t": "21:19:48",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": []
 }
];
const KOD_AI_AI1 = {
 "stat": "2 files changed, 22 insertions(+), 3 deletions(-)",
 "diff": "diff --git a/README.md b/README.md\nindex 9946cbe..5753f72 100644\n--- a/README.md\n+++ b/README.md\n@@ -52,6 +52,7 @@ Hodisa tranzaksiya tugagandan keyin yuboriladi: panel so'raganda buyurtma bazada\n \n - Ulanish — socket.io (`@nestjs/websockets`, `@nestjs/platform-socket.io`), HTTP bilan bitta portda. Token ulanish ochilayotganda tekshiriladi (`auth: { token }`); noto'g'ri bo'lsa server ulanishni yopadi.\n - Panel belgisi: **Ulangan** — hodisalar keladi · **Ulanmoqda…** — server javob bermayapti, klient o'zi qayta urinmoqda · **Ulanmagan** — token noto'g'ri, klient urinmaydi.\n+- Har ulanishda (uzilishdan keyingi qayta ulanishda ham) panel ro'yxatni `GET /admin/orders` dan qayta so'raydi: ulanish yo'q paytda yuborilgan `order-changed` hech kimga yetmaydi (server uni saqlamaydi), shuning uchun server qayta ishga tushganda yoki internet uzilib qaytganda tushgan buyurtma ham ro'yxatda chiqadi.\n - Brauzersiz tekshirish: `npm run live` — terminal klienti (`npm run live -- notogri` — noto'g'ri token bilan).\n - Telegram'siz tekshirish: `npm run smoke -- live`.\n \ndiff --git a/public/admin.html b/public/admin.html\nindex 1101aa4..8ff2b5a 100644\n--- a/public/admin.html\n+++ b/public/admin.html\n@@ -61,13 +61,25 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // Bir vaqtda bir nechta so'rov ketishi mumkin (qayta ulanish + hodisa). Javoblar istalgan tartibda\n+  // qaytadi — eskisi yangisining ustiga yozmasligi uchun faqat ENG OXIRGI so'rov javobi chiziladi.\n+  let soroqRaqami = 0;\n   async function yukla() {\n-    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n+    const men = ++soroqRaqami;\n+    let r, list;\n+    try {\n+      r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n+      if (r.ok) list = await r.json();\n+    } catch {\n+      // tarmoq yo'q — ro'yxat qanday bo'lsa qoladi; ulanish qaytganda «connect» qayta so'raydi\n+      return;\n+    }\n+    if (men !== soroqRaqami) return; // shu orada yangiroq so'rov ketgan — o'sha chizadi\n     if (r.status === 401) {\n       el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";\n       return;\n     }\n-    const list = await r.json();\n+    if (!list) return;\n     const eng = list.length ? list[0].id : 0;\n     el('royxat').innerHTML = list.length\n       ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">\n@@ -83,7 +95,13 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // Har ulanishda (birinchi ham, uzilishdan keyingi ham) ro'yxat qayta so'raladi: ulanish yo'q paytda\n+    // yuborilgan order-changed hech kimga yetmaydi — server uni saqlamaydi. Faqat hodisaga ishonsak,\n+    // server qayta ishga tushganda yoki internet uzilib qaytganda tushgan buyurtma ro'yxatda chiqmay qoladi.\n+    ulanish.on('connect', () => {\n+      holatQoy('ulangan');\n+      yukla();\n+    });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));"
};
const KOD_AI_AI2 = {
 "stat": "1 file changed, 8 insertions(+), 1 deletion(-)",
 "diff": "diff --git a/public/admin.html b/public/admin.html\nindex 1101aa4..6e4342d 100644\n--- a/public/admin.html\n+++ b/public/admin.html\n@@ -61,13 +61,18 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // So'rovlar ustma-ust kelsa (uzilish-qayta ulanish), faqat oxirgisi ekranga chiqadi.\n+  let sorovSoni = 0;\n   async function yukla() {\n+    const bu = ++sorovSoni;\n     const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n+    if (bu !== sorovSoni) return;\n     if (r.status === 401) {\n       el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";\n       return;\n     }\n     const list = await r.json();\n+    if (bu !== sorovSoni) return;\n     const eng = list.length ? list[0].id : 0;\n     el('royxat').innerHTML = list.length\n       ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">\n@@ -83,7 +88,9 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // Ulanish (birinchi marta yoki qayta ulanish) — ro'yxatni qayta so'raymiz: uzilib turgan paytda kelgan\n+    // buyurtma hodisasi qaytmaydi, shuning uchun server «Ulangan» bo'lganda ham ro'yxat eskirgan bo'lishi mumkin.\n+    ulanish.on('connect', () => { holatQoy('ulangan'); yukla(); });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));"
};
const KOD_PROMPT1 = "OrderBotNest'dagi jonli buyurtmalar paneli (/admin) ba'zan yangi buyurtmani ko'rsatmaydi: server qayta ishga tushganda yoki internet uzilib qaytganda belgi «Ulangan» bo'ladi, lekin bot olgan buyurtma ro'yxatda yo'q — sahifani yangilasam chiqadi. Tuzatib ber.";
const KOD = { HTML: KOD_HTML, CLIENT: KOD_CLIENT, TG: KOD_TG, GATEWAY: KOD_GATEWAY, BUZISH: KOD_BUZISH, HTML_START: KOD_HTML_START, HTML_XATO: KOD_HTML_XATO, GATEWAY_TIKLASH: KOD_GATEWAY_TIKLASH, README_START: KOD_README_START, README: KOD_README, MJ_UL_START: KOD_MJ_UL_START, MJ_UL: KOD_MJ_UL, OUT: { '00': KOD_OUT_00, '00b': KOD_OUT_00B, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09, '11': KOD_OUT_11, '12': KOD_OUT_12, 'ai1': KOD_OUT_AI1, 'ai2': KOD_OUT_AI2, 'ai1a': KOD_OUT_AI1A, 'mj05': KOD_OUT_MJ05, 'mj06': KOD_OUT_MJ06 }, PANEL: KOD_PANEL, AI: { ai1: KOD_AI_AI1, ai2: KOD_AI_AI2 }, PROMPT1: KOD_PROMPT1 };

// ============================================================
//  WebSocket-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws2-matn.py (manba: 21-WS2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Panel «o'zi yangilanadi» deydi. Server qayta yonsa yoki tarmoq uzilsa ham shundaymi? Bugun buzib tekshiramiz va tuzatamiz",
  "seg": [
   [
    "a",
    "Server qayta yondi — <b>server o'chiq paytda berilgan buyurtma ham panelda</b>",
    "Assalomu alaykum. Oldingi darsda OrderBotNest'ga jonli panel qildik. Bugun undan qiyinroq savol: server qayta yonsa yoki tarmoq uzilsa, panel hamma buyurtmani ko'rsatadimi? Ekranda dars oxiridagi natija: server o'chiq paytda berilgan buyurtma ham sariq bo'lib chiqqan."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: socket.io nimani o'zi tiklaydi, nimani yo'q",
    "Avval umumiy tushuncha: socket.io qayta ulanishda nimani o'zi tiklaydi va nimani tiklamaydi. Keyin panelning o'zi yangilanadi degan gapini da'vo deb olamiz va uni ataylab buzamiz, buzish yozuvi bilan."
   ],
   [
    "c",
    "Keyin <b>takror tinglovchi, tarmoq va tiklash</b>; oxirida AI va sinf",
    "Uchinchi bosqichda tuzatishdagi tuzoqni ko'ramiz: bitta hodisaga bir necha so'rov. To'rtinchisida tarmoq uzilishi va socket.io'ning tiklash sozlamasi. Beshinchisida ikki AI tuzatishini haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>WebSocket-1 dagi panel, bot va Postgres</b>",
    "Dars olti bosqich, uchta amaliyot. Oldingi darsdagi OrderBotNest nusxangiz kerak: panel, bot tokeni va Postgres. Buzishni o'z noutbukingizda, brauzer va telefon bilan qilasiz. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "socket.io ulanishni o'zi tiklaydi — lekin bu yangi ulanish. Uzilish paytida yuborilgan hodisa unga kelmaydi: server hodisani faqat hozir ulanganlarga beradi",
  "seg": [
   [
    "a",
    "Qayta ulanish — <b>socket.io'ning tayyor xizmati</b>: uzildi, urinadi, o'zi ulanadi",
    "Oldingi darsda ko'rgansiz: server o'chsa klient transport close, keyin bir necha marta xhr poll error, server yongach o'zi connect. Hech kim hech narsa bosmadi. Ekranda bugungi tajribadan o'sha terminal. Savol: uzilish paytida nima bo'lgan edi?"
   ],
   [
    "b",
    "Lekin bu <b>yangi ulanish</b>: uzilish paytidagi hodisa unga kelmaydi",
    "Qayta ulanish bu yangi ulanish. Server order changed'ni faqat hozir ulangan panellarga yuboradi va hech qayerda saqlamaydi. Uzilish paytida buyurtma tushsa, hodisa hech kimga yetmaydi. Panel qayta ulanadi, belgi yashil, lekin ro'yxat eski qoladi."
   ],
   [
    "c",
    "Tiklanadi: <b>ulanish va tinglovchilar</b>; tiklanmaydi: o'tib ketgan hodisa va serverdagi xona",
    "Nima tiklanadi: ulanishning o'zi, token har ulanishda qayta yuboriladi, tinglovchilar klientda turadi. Nima tiklanmaydi: uzilish paytidagi hodisa va serverning shu ulanishga bog'lagan narsasi, masalan xona. Xonani o'quvchi darsida ko'ramiz."
   ],
   [
    "d",
    "Xulosa: ro'yxat <b>bazada</b>; har qayta ulanishda panel uni qayta so'rashi kerak",
    "Xulosa: hodisa faqat nimadir o'zgardi deydi, haqiqiy ro'yxat bazada. Uzilishdan keyin panel nima o'tkazib yuborganini bilmaydi, demak ro'yxatni qayta so'rashi kerak. Hozirgi panel buni qilmaydi. Buni isbotlash uchun avval uni buzamiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "README: «ro'yxat o'zi yangilanadi». Bu da'vo — tekshirilmagan. Tekshiruv — buzib ko'rish va har urinishni to'rt ustunli yozuv bilan qayd qilish",
  "seg": [
   [
    "a",
    "README <b>«o'zi yangilanadi»</b> deydi — oddiy holatda to'g'ri, chekka holatda tekshirilmagan",
    "OrderBotNest README'sida yozilgan: ro'yxat o'zi yangilanadi. Oddiy holatda bu to'g'ri, oldingi darsda ko'rdik. Lekin server qayta yonsa yoki tarmoq uzilsa? Bu tekshirilmagan. O'quvchi darsida bunday gap da'vo deyiladi: aytilgan, isbotlanmagan."
   ],
   [
    "b",
    "Buzish yozuvi: <b>nima qildim · nima kutdim · nima bo'ldi → belgi</b>",
    "Tekshiruv bu buzib ko'rish. Har urinish bir qator: qaysi usul, nima qildim, nima kutdim, nima bo'ldi va belgi: buzildi yoki buzilmadi. Nima bo'ldi ustuniga taxmin emas, ekranda ko'rgan narsa yoziladi. O'quvchi darsidagi BUZISH fayli aynan shu ustunlar."
   ],
   [
    "c",
    "Panel uchun <b>uch usul</b>: server qayta yonadi, brauzer Offline, tarmoq uziladi",
    "Panel uchun uch usul. Birinchisi: server qayta ishga tushadi, deploy yoki xato. Ikkinchisi: brauzerning tarmog'i o'chadi, buni DevTools bilan qilasiz. Uchinchisi: panel boshqa kompyuterda, ular orasidagi tarmoq uziladi. Har birida o'sha paytda buyurtma tushadi."
   ],
   [
    "d",
    "Xulosa: belgi <b>shu kompyuterda, shu urinishda</b> — «buzilmadi» isbot emas",
    "Xulosa: buzildi belgisi muammo borligini ko'rsatadi. Buzilmadi esa faqat shu kompyuterda, shu urinishda degani, isbot emas. Bugun shunday urinishni ko'rasiz: xato bor, lekin o'sha safar yuz bermagan. Birinchi usuldan boshlaymiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · yo'qolgan buyurtma",
  "title": "Panel va terminal klienti ochiq; server to'xtadi; o'chiq paytda Bobur botga yozgan; server yondi — belgi «Ulangan», ro'yxatda faqat #1, bazada esa #2 bor",
  "seg": [
   [
    "a",
    "Panel ochiq, <b>#1 ko'rindi</b>; server terminalida Ctrl+C — belgi «Ulanmoqda…»",
    "Tajriba haqiqiy server, baza va brauzerda. Panel ochiq, Bobur birinchi buyurtmani berdi, panelda birinchi qator chiqdi. Endi server terminalida Ctrl C. Panel darhol ulanmoqda, ro'yxat ekranda qoladi. Shu payt Bobur botga yana buyurtma yozdi."
   ],
   [
    "b",
    "Server yondi — <b>bot navbatdagi buyurtmani darhol bajardi</b>: <code>Buyurtma #2 qabul qilindi!</code>",
    "Serverni qayta yoqdik. Server logiga qarang: ishga tushishi bilan bot Bobur yozgan xabarni bajardi, buyurtma ikki qabul qilindi. Panel ulandi satri esa undan keyin. Ya'ni hodisa yuborilgan paytda hech qaysi panel ulanmagan edi."
   ],
   [
    "c",
    "Panel: <b>belgi «Ulangan», ro'yxatda faqat #1</b>; terminal klientida ham hodisa yo'q",
    "Panelga qarang: belgi ulangan, yashil. Ro'yxatda esa faqat birinchi buyurtma. Terminal klienti ham qayta ulandi, lekin order changed kelmadi. Admin ekranga ishonadi va ikkinchi buyurtmani ko'rmaydi. Sahifani yangilasa chiqadi, lekin admin buni bilmaydi."
   ],
   [
    "d",
    "Xulosa: <b>bazada 2 ta, panelda 1 ta</b> — README'dagi da'vo buzildi",
    "Xulosa: bazada ikki buyurtma, panelda bitta, belgi esa hammasi joyida deydi. Bu eng yomon holat: xato ko'rinmaydi. Buzish yozuviga birinchi qator: server qayta yondi, kutdim ikkinchi buyurtma, bo'ldi faqat birinchi, belgi buzildi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida",
  "title": "Server o'chiq paytda Telegram xabarni saqlab turadi; bot ishga tushishi bilan uni oladi. Panel esa 1–5 soniyada qayta urinadi — ko'pincha kech qoladi, ba'zan ulguradi",
  "seg": [
   [
    "a",
    "Server o'chiq paytda <b>Telegram xabarni saqlab turadi</b>; bot yongach birinchi ishi — navbat",
    "Nega shunday bo'ldi? Telegram server o'chiq paytdagi xabarlarni saqlab turadi. Telegram service faylida on module init ichida bot launch: bot ishga tushishi bilan navbatdagi xabarlarni oladi va darhol bajaradi. Bu bir soniyaga yetmaydi."
   ],
   [
    "b",
    "Panel esa <b>1–5 soniyada qayta urinadi</b> — hodisa ketganda u hali ulanmagan",
    "Panel esa uzilishdan keyin bir soniya, keyin ikki, to'rt, eng ko'pi besh soniya kutib qayta urinadi. Server yongan payt bilan panelning keyingi urinishi orasida bot buyurtmani bajarib, hodisani yuborib bo'ladi. Hodisa nolta panelga ketdi."
   ],
   [
    "c",
    "Ba'zan <b>panel ulguradi</b> — o'sha urinishda xato yuz bermaydi",
    "Lekin har safar emas. AI nusxasini sinaganimizda bir urinishda panel buyurtmadan oldin ulanib ulgurdi va hodisa oddiy yo'l bilan keldi. O'sha urinishda xato umuman yuz bermadi, demak u hech narsani tekshirmadi. Buyurtmachi aytgan ba'zan so'zi shu."
   ],
   [
    "d",
    "Demak, sabab: <b>hodisa vaqtga bog'liq</b>; ro'yxat esa bazada — uni vaqtdan qat'i nazar so'rash kerak",
    "Demak, sabab: hodisa kelishi vaqtga bog'liq, kim tezroq. Buni tezlik bilan yutib bo'lmaydi. Ro'yxat esa bazada, u vaqtga bog'liq emas. Panel ulanishi bilan uni qayta so'rasa, kim tez bo'lganining farqi qolmaydi. Avval yana bir usul: brauzer tarmog'ini o'chiramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · yo'qolgan buyurtma",
  "title": "DevTools → Network → Offline: 6 soniyada belgi o'zgarmadi, hodisa Online'da keldi — buzilmadi. 60 soniyada — yarim daqiqadan keyin «Ulanmoqda…», Online'dan keyin ro'yxat eski — buzildi",
  "seg": [
   [
    "a",
    "Offline <b>DevTools'da bir tugma</b>: Network → No throttling o'rniga Offline",
    "Ikkinchi usulni o'z noutbukingizda qilasiz. Brauzerda F12, Network bo'limi, yuqoridagi No throttling ro'yxatidan Offline. Sahifaning tarmog'i o'chadi, server va bot esa ishlab turadi. Shu paytda telefondan buyurtma berasiz."
   ],
   [
    "b",
    "6 soniya: <b>belgi o'zgarmadi</b>, hodisa Online bo'lganda keldi — buzilmadi",
    "Birinchi urinish: olti soniya Offline, shu payt buyurtma. Belgi ulangan bo'lib turdi. Online qilgan zahoti order changed keldi va ro'yxat yangilandi. Brauzer ochiq ulanishni yopmadi, kadrni ushlab turdi. Belgi buzilmadi, faqat shu urinishda."
   ],
   [
    "c",
    "60 soniya: <b>yarim daqiqadan keyin «Ulanmoqda…»</b>; Online'da kechikkan kadr keldi, lekin tashlandi",
    "Ikkinchi urinish: bir daqiqa. O'ttiz uchinchi soniyada belgi ulanmoqda bo'ldi: ping kelmadi, klient ulanishni o'zi uzdi. Online qildik: kechikkan kadr brauzerga keldi, lekin socket.io uni yopilgan ulanishniki deb tashladi va yangidan ulandi. Ro'yxat so'ralmadi."
   ],
   [
    "d",
    "Xulosa: Offline <b>ping vaqtidan uzun bo'lsa buziladi</b> — 45 soniyadan ko'p kuting",
    "Xulosa: belgi ulangan, ro'yxatda birinchi, bazada ikkinchi ham bor. Buzildi. Ping qoidasini oldingi darsda ko'rgansiz: yigirma besh va yigirma. Amaliyotda Offline'ni belgi ulanmoqda bo'lguncha ushlab turing, aks holda buzilmadi chiqadi."
   ]
  ]
 },
 "7": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Server qayta yondi. Belgi «Ulangan». Bazada #2 bor, panelda yo'q, terminal klientiga ham order-changed kelmadi. Asosiy sabab nima?",
  "q": "Ikki usulda buzilishni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Server qayta yondi, belgi ulangan, bazada ikkinchi buyurtma bor, panelda yo'q. Server logida buyurtma panel ulanishidan oldin. Asosiy sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Server logida buyurtma ikki qabul qilindi, panel ulandi esa keyin. Order changed shu paytda ulangan panellarga ketdi, ular esa nol. Socket.io bunday hodisani saqlamaydi va qayta ulangan panelga bermaydi. Demak, belgi ulangan bo'lsa ham, uzilishdan keyingi ro'yxatga ishonib bo'lmaydi.",
  "okShort": "Hodisa 0 panelga ketdi — server saqlamaydi, qayta ulanganga bermaydi.",
  "hint": "Server logida «Buyurtma #2» va «panel ulandi» qaysi tartibda?",
  "demak": "Uzilish paytidagi hodisa yo'qoladi; qayta ulangan panel nimani o'tkazib yuborganini bilmaydi.",
  "correct": 1,
  "opts": [
   "Bot #2 ni bazaga yozmagan — tranzaksiya qaytarilgan",
   "Hodisa panel ulanmasdan oldin ketgan, server uni saqlamaydi",
   "Panel tokeni eskirgan, server hodisani rad etgan",
   "socket.io hodisani navbatga qo'ygan, keyingisi bilan keladi"
  ],
  "wrong": {
   "0": "Bazada 2 ta — buyurtma yozilgan (psql).",
   "2": "Token to'g'ri: panel ulandi, belgi «Ulangan».",
   "3": "Navbat yo'q: keyingi hodisa faqat o'zi keladi, eskisi bilan emas."
  }
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · yo'qolgan buyurtma",
  "title": "ws2-done: connect ichida yukla() — birinchi va har qayta ulanishda ro'yxat bazadan; alohida yukla() chaqiruvlari olib tashlandi. O'sha tajriba: #2 sariq",
  "seg": [
   [
    "a",
    "<code>admin.html</code>, <code>ulan()</code>: <b><code>connect</code> ichida <code>holatQoy</code> va <code>yukla()</code></b> — ikki satr",
    "Tuzatish kichik. Public papkasidagi admin html, ulan funksiyasi. Connect bo'lganda faqat belgini qo'yardik. Endi ichida yukla ham chaqiriladi. Connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi, demak har safar ro'yxat bazadan keladi."
   ],
   [
    "b",
    "Alohida <b><code>yukla()</code> chaqiruvlari olib tashlandi</b>: ro'yxat ikki joyda — <code>connect</code> va hodisa",
    "Kirish tugmasi va sahifa ochilishidagi alohida yukla chaqiruvlarini olib tashladik, aks holda ochilishda ro'yxat ikki marta so'raladi. Endi faqat ikki joy: connect va order changed. Noto'g'ri tokenda ham ishlaydi: bir lahza connect, so'rov, token noto'g'ri."
   ],
   [
    "c",
    "O'sha tajriba: <b>#2 sariq</b>; terminal klienti ham <code>GET … → 2 ta, eng yangisi #2</code>",
    "To'rtinchi ekrandagi tajribani tuzatilgan kodda qaytardik. Server yongach belgi ulangan va ro'yxatda ikkinchi buyurtma, sariq. Terminal klientiga ham shu qo'shildi: connect'dan keyin get admin orders, nechta va eng yangisi. Amaliyotda isbot shu satr bo'ladi."
   ],
   [
    "d",
    "Xulosa: <b>Offline 60 soniya ham</b> takrorlanmadi — bitta tuzatish ikki usulni yopdi",
    "Xulosa: bir daqiqalik Offline ham tuzatilgan kodda qaytarildi: Online'dan keyin ikkinchi buyurtma chiqdi. Buzish yozuvida ikkala qatorga: tuzatish qilindi, qayta tekshiruvda takrorlanmadi. Server kodi o'zgarmadi, testlar o'ttiz ikki, smoke to'qqizdan to'qqiz."
   ]
  ]
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "ws2-start da panelni Offline bilan buzing (belgi «Ulanmoqda…» bo'lguncha), telefondan buyurtma bering; keyin ws2-done da xuddi shu usul bilan qayta tekshiring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>ws2-start</code>, DevTools Offline va telefon</b> — o'z noutbukingizda",
    "Endi navbat sizga. OrderBotNest papkangizda ws2 start tegiga o'tasiz, panelni ochasiz va brauzer tarmog'ini o'chirasiz. Telefoningizdan botga buyurtma berasiz va Online qilasiz. Keyin ws2 done'da xuddi shunday. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>teg, server, panel; Offline — belgi «Ulanmoqda…» bo'lguncha</b>, keyin buyurtma",
    "Birinchi qadamda teg va server, brauzerda localhost uch ming admin. Ikkinchisida F12, Network, Offline va kuting: belgi ulanmoqda bo'lishi kerak, qirq besh soniyagacha. Shundan keyin telefondan buyurtma, Telegram'da buyurtma qabul qilindi chiqadi."
   ],
   [
    "c",
    "3–4-qadam: <b>Online — ro'yxatda yo'q</b>; <code>ws2-done</code> da qayta — chiqadi; isbot — buyurtma raqami",
    "Uchinchi qadamda Online: belgi ulangan, lekin yangi buyurtma ro'yxatda yo'q. Buzildi. To'rtinchisida ws2 done tegi, server qayta, xuddi shu usul: endi Online'dan keyin buyurtma sariq bo'lib chiqadi. Isbot maydoniga o'sha buyurtma raqamini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz panelning da'vosini o'zingiz buzgansiz va tuzatishni o'sha usul bilan tekshirgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg va panel",
    "cmds": [
     "git fetch --tags",
     "git checkout ws2-start",
     "npm run start:dev",
     "brauzer: http://localhost:3000/admin"
    ],
    "exp": "belgi «Ulangan», ro'yxat"
   },
   {
    "t": "Offline",
    "cmds": [
     "F12 → Network → «No throttling» → «Offline»",
     "belgi «Ulanmoqda…» bo'lguncha kuting",
     "telefondan botga buyurtma"
    ],
    "exp": "Telegram: Buyurtma #… qabul qilindi!"
   },
   {
    "t": "Online",
    "cmds": [
     "«Offline» → «No throttling»"
    ],
    "exp": "belgi «Ulangan», yangi buyurtma ro'yxatda YO'Q (F5 bilan chiqadi)"
   },
   {
    "t": "Qayta tekshiruv",
    "cmds": [
     "git checkout ws2-done",
     "server qayta",
     "1–3-qadam yana"
    ],
    "exp": "Online'dan keyin yangi buyurtma sariq"
   }
  ],
  "proof": {
   "label": "ws2-done da Online'dan keyin chiqqan buyurtma raqami",
   "placeholder": "masalan: #7",
   "re": "#?\\s*\\d+",
   "flags": "",
   "wrong": "ws2-done da Online'dan keyin ro'yxatda chiqqan sariq qatorning raqamini yozing."
  },
  "trouble": [
   [
    "ws2-start da ham buyurtma chiqdi",
    "Offline qisqa bo'lgan — belgi «Ulanmoqda…» bo'lmaguncha buyurtma bermang (6-ekran: 6 s da buzilmaydi)"
   ],
   [
    "Belgi «Ulanmoqda…» bo'lmayapti",
    "Offline yoqilmagan yoki boshqa vkladkada — sahifaning o'z DevTools'ida yoqing; 45 s gacha kuting"
   ],
   [
    "Online'dan keyin ham «Ulanmoqda…»",
    "server to'xtagan — server terminalini tekshiring"
   ],
   [
    "ws2-done da ham ro'yxatda yo'q",
    "sahifa eski — server qayta ishga tushganmi, F5 bilan bir marta yangilang, keyin qayta sinang"
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror tinglovchi",
  "title": "Sodda «tuzatish»: hammasini connect ichiga. Birinchi ulanishda ishlaydi; har qayta ulanishdan keyin bitta hodisaga 2, keyin 3 GET — va sariq belgi yo'qoladi",
  "seg": [
   [
    "a",
    "Sodda tuzatish: <b>tinglovchi ham <code>connect</code> ichiga</b> — «har ulanishda hammasini sozlaymiz»",
    "Endi tuzatishdagi tuzoq. Sodda yo'l: har ulanishda hammasini qaytadan sozlaymiz, tinglovchini ham connect ichiga ko'chiramiz. Kod chiroyli ko'rinadi va birinchi ulanishda to'g'ri ishlaydi. Sinaymiz: server ikki marta qayta yonadi, har safar keyin bitta buyurtma."
   ],
   [
    "b",
    "Network: <b>bitta hodisaga 1, keyin 2, keyin 3 <code>GET</code></b>",
    "Brauzerning Network ro'yxatiga qarang. Birinchi buyurtmaga bitta get admin orders. Bir qayta ulanishdan keyin bitta buyurtmaga ikkita. Ikkinchi qayta ulanishdan keyin uchta. Har qayta ulanishda yana bitta tinglovchi qo'shilgan, hodisa bitta, ishlovchi uchta."
   ],
   [
    "c",
    "Ko'rinadigan belgi: <b>sariq qator yo'qoldi</b> — ikki javobdan ikkinchisi «yangi emas» deydi",
    "Bu faqat ortiqcha so'rov emas. Chapda xato nusxa: ikkinchi buyurtma sariq emas. O'ngda to'g'ri kod: sariq. Ikki so'rov bir vaqtda ketadi, birinchi javob qatorni yangi deb chizadi va eng katta raqamni eslaydi, ikkinchisi esa uni endi yangi emas deb chizadi."
   ],
   [
    "d",
    "Demak, sabab: <b><code>connect</code> har ulanishda ishlaydi</b> — tinglovchi bir marta, tashqarida",
    "Demak, sabab: connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi. Ichidagi on har safar yangi tinglovchi qo'shadi, eskisi o'chmaydi. Qoida: connect ichida faqat qayta so'rash, tinglovchi esa bir marta, tashqarida. Ws2 done'da shunday, izoh bilan."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu panelda server ikki marta qayta yongandan keyin bitta buyurtmaga uchta GET /admin/orders ketadi. Sababchi satrni toping",
  "q": "Tuzoqni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu panelda server ikki marta qayta yongandan keyin bitta buyurtmaga uchta so'rov ketadi. Bo'lakda bitta satr har ulanishda yangi tinglovchi qo'shadi. O'sha satrni bosing.",
  "ok": "To'g'ri. Bu satr connect ichida, connect esa har qayta ulanishda ishlaydi. Ikki qayta ulanishdan keyin uchta tinglovchi, bitta hodisaga uchta so'rov va sariq belgi yo'qoladi. Yukla chaqiruvining o'zi to'g'ri: qayta so'rash connect ichida bo'lishi kerak. Demak, connect ichidagi on, tuzoq.",
  "okShort": "<code>connect</code> ichidagi <code>ulanish.on(…)</code> — har qayta ulanishda yana bitta tinglovchi.",
  "hint": "connect ichida qaysi satr har safar yangi narsa qo'shadi, qaysi biri faqat bir ish qiladi?",
  "task": "Qoida: <code>connect</code> har qayta ulanishda ishlaydi — ichida faqat <b>bir martalik ish</b> bo'ladi. Bu bo'lakda bitta satr har ulanishda <b>yangi tinglovchi qo'shadi</b>. <b>O'sha satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Tinglovchini ataylab connect ichiga ko'chiring, serverni ikki marta qayta yoqing, bitta buyurtma bering va Network'da GET larni sanang; keyin qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: <b>tinglovchini ataylab <code>connect</code> ichiga</b> ko'chirasiz va sanaysiz",
    "Endi navbat sizga. Ws2 done'dagi admin html'da tinglovchini ataylab connect ichiga ko'chirasiz, serverni ikki marta qayta yoqasiz va bitta buyurtma berasiz. Brauzerning Network ro'yxatida so'rovlarni sanaysiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>tinglovchini ko'chiring</b>, F12 → Network, filtr <code>orders</code>",
    "Birinchi qadamda order changed satrini connect ichiga, yukla'dan keyin ko'chirasiz va saqlaysiz. Ikkinchisida panelni qayta oching, F12, Network, filtrga orders deb yozing. Faqat get admin orders qatorlari qoladi."
   ],
   [
    "c",
    "3–4-qadam: <b>server ikki marta qayta, keyin bitta buyurtma</b> — nechta <code>GET</code>; isbot — son",
    "Uchinchi qadamda server terminalida ikki marta Ctrl C va qayta yoqish, har safar belgi ulangan bo'lguncha kuting. Keyin Network'ni tozalang va telefondan bitta buyurtma. To'rtinchisida sanang va kodni qaytaring. Isbot maydoniga so'rovlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror tinglovchini so'rovlar sonidan taniysiz."
   ]
  ],
  "steps": [
   {
    "t": "Buzish",
    "cmds": [
     "public/admin.html: ulanish.on('order-changed', () => yukla()); → connect ichiga, yukla(); dan keyin"
    ],
    "exp": "saqlandi"
   },
   {
    "t": "Network",
    "cmds": [
     "brauzer: panel → F5",
     "F12 → Network → filtr orders"
    ],
    "exp": "birinchi ochilishda bitta orders"
   },
   {
    "t": "Ikki qayta yonish",
    "cmds": [
     "server: Ctrl+C → npm run start:dev (×2, har safar belgi «Ulangan»)",
     "Network → 🚫 tozalash",
     "telefondan bitta buyurtma"
    ],
    "exp": "yangi qator chiqdi"
   },
   {
    "t": "Sanash va qaytarish",
    "cmds": [
     "Network'dagi orders soni",
     "git checkout -- public/admin.html"
    ],
    "exp": "3 ta GET; kod qaytdi"
   }
  ],
  "proof": {
   "label": "Bitta buyurtmadan keyingi GET /admin/orders soni",
   "placeholder": "masalan: 3",
   "re": "^\\D*3\\D*$",
   "flags": "",
   "wrong": "Ikki qayta yonishdan keyin bitta buyurtmaga nechta orders so'rovi ketdi? Uchta bo'lishi kerak — Network'ni buyurtmadan oldin tozalang."
  },
  "trouble": [
   [
    "2 ta GET",
    "server bir marta qayta yongan yoki ikkinchi safar belgi «Ulangan» bo'lishini kutmadingiz"
   ],
   [
    "1 ta GET",
    "sahifa eski kodda — admin.html saqlandimi; F5 bilan yangilang"
   ],
   [
    "Network'da orders yo'q",
    "filtr boshqa yoki Network ochilishidan oldingi so'rovlar — sahifani DevTools ochiq holda yangilang"
   ],
   [
    "Sariq belgi baribir bor",
    "so'rovlar ketma-ket qaytgan — sanash isbot uchun yetarli"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · tarmoq va tiklash",
  "title": "Hayotda server Render'da, panel do'kon kompyuterida: ular orasidagi tarmoq uziladi, server va bot ishlayveradi. Proksi bilan modellashtirdik: ws2-start — ro'yxat bo'sh, ws2-done — #1",
  "seg": [
   [
    "a",
    "Haqiqiy do'konda <b>server Render'da, panel do'konda</b>: tarmoq ular orasida uziladi",
    "Uchinchi usul. Haqiqiy do'konda server Render kabi joyda, panel do'kon kompyuterida. Do'konda Wi-Fi uzilsa, server va bot ishlayveradi, mijozlar buyurtma beradi, panel esa tarmoqsiz. Buni oralig'iga proksi qo'yib modellashtirdik: proksini kesamiz."
   ],
   [
    "b",
    "<code>ws2-start</code>: tarmoq qaytdi — <b>«Ulangan», ro'yxat bo'sh</b>, bazada #1",
    "Eski kodda: tarmoq uzildi, belgi darhol ulanmoqda, chunki ulanish yopildi. Shu payt Bobur buyurtma berdi. Tarmoq qaytdi, belgi ulangan, ro'yxatda esa hali buyurtma yo'q. Bazada birinchi buyurtma bor. Xuddi server qayta yongandagi holat."
   ],
   [
    "c",
    "<code>ws2-done</code>: <b><code>connect</code> dan keyin <code>GET</code> — #1 ro'yxatda</b>",
    "Tuzatilgan kodda o'sha qadamlar: tarmoq qaytgach connect, darhol get admin orders va ro'yxatda birinchi buyurtma. Bitta tuzatish uchala usulni yopdi: server qayta yonishi, brauzer Offline va tarmoq uzilishi."
   ],
   [
    "d",
    "Xulosa: usul uch xil, <b>sabab bitta</b> — qayta ulanish yangi ulanish, hodisa o'tib ketgan",
    "Xulosa: usul uch xil, sabab bitta: qayta ulanish yangi ulanish va uzilish paytidagi hodisa o'tib ketgan. Bu tuzatish mijoz tomonda. Savol tug'iladi: server o'zi o'tkazib yuborilganini qayta bera olmaydimi? Socket.io'da shunday sozlama bor."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Gateway'ga connectionStateRecovery — qisqa uzilishdan keyin o'tkazilgan hodisalar qayta keladi (recovered=true). Lekin klient oldin hodisa olmagan bo'lsa va server qayta yonganda — yo'q",
  "seg": [
   [
    "a",
    "socket.io sozlamasi: <b><code>connectionStateRecovery</code></b> — uzilgan ulanishning holatini 2 daqiqa saqlaydi",
    "Socket.io'da connection state recovery sozlamasi bor. Gateway dekoratoriga qo'shamiz, ikki daqiqa. Server uzilgan ulanishning holatini va shu vaqtda yuborilgan hodisalarni xotirada saqlaydi. Klient qaytib kelsa, socket recovered true va o'tkazilgan hodisalar keladi."
   ],
   [
    "b",
    "Tarmoq uzildi, shu payt #3 — qaytganda <b>#3 keldi, <code>recovered=true</code></b>, id o'sha",
    "Tajriba: klient ikkinchi buyurtma hodisasini oldi, keyin tarmoq uzildi, shu payt uchinchi buyurtma. Tarmoq qaytdi: avval order changed uch keldi, keyin connect, recovered true, ulanish raqami ham o'sha. Haqiqatan ishlaydi, panel qayta so'ramasa ham."
   ],
   [
    "c",
    "Lekin: <b>oldin hodisa olmagan klient</b> va <b>server qayta yonishi</b> — <code>recovered=false</code>",
    "Ikki holatda ishlamadi. Birinchisi: klient uzilishdan oldin hali birorta hodisa olmagan edi, recovered false, o'tkazilgan buyurtma kelmadi. Ikkinchisi: server qayta yondi, recovered false, navbatdagi buyurtma kelmadi. Saqlangan holat server xotirasida edi, server bilan yo'qoldi."
   ],
   [
    "d",
    "Xulosa: tiklash — <b>qo'shimcha</b>; <code>connect</code> da qayta so'rash — majburiy",
    "Xulosa: tiklash qisqa tarmoq uzilishida yordam beradi. Server qayta yonishi esa eng ko'p uchraydigan holat: deploy, xato. U yerda faqat qayta so'rash ishlaydi. Shuning uchun ws2 done'da gateway o'zgarmadi. Tiklashni qo'shsangiz, qayta so'rash baribir qoladi."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Gateway'da connectionStateRecovery yoqilgan, panel connect da qayta so'ramaydi. Deploy: server qayta yondi, o'chiq paytda Bobur buyurtma bergan. Panel uni ko'radimi?",
  "q": "Tiklashni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Gateway'da tiklash yoqilgan, panel esa connect'da qayta so'ramaydi. Deploy bo'ldi, server qayta yondi, o'chiq paytda Bobur buyurtma bergan. Panel uni ko'radimi? Variantni tanlang.",
  "ok": "To'g'ri. Tiklash uzilgan ulanishlarning holatini server jarayonining xotirasida saqlaydi. Server qayta yonganda jarayon yangi, xotira bo'sh: recovered false, navbatdagi buyurtma hodisasi qaytmaydi. Ikki daqiqa muddati bu yerda yordam bermaydi. Demak, deploy va xatodan keyin faqat qayta so'rash ishlaydi.",
  "okShort": "Holat server xotirasida — server qayta yonsa yo'qoladi: <code>recovered=false</code>.",
  "hint": "Tiklash ma'lumotni qayerda saqlaydi — bazada, faylda yoki jarayon xotirasida?",
  "demak": "Tiklash server xotirasida: deploy va qayta yonishdan keyin yo'q — qayta so'rash majburiy.",
  "correct": 2,
  "opts": [
   "Ha — tiklash o'tkazilgan hamma hodisani qaytaradi",
   "Ha, agar server 2 daqiqada yongan bo'lsa",
   "Yo'q — saqlangan holat server xotirasida edi",
   "Yo'q — tiklash faqat polling transportida ishlaydi"
  ],
  "wrong": {
   "0": "Faqat shu server jarayoni saqlagan hodisalarni; yangi jarayonda ular yo'q.",
   "1": "Muddat emas, xotira: jarayon yangi bo'lsa, bir soniyada yongan ham tiklamaydi.",
   "3": "Transportga bog'liq emas — 07 da websocket bilan tikladi."
  }
 },
 "16": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "ws2-done da terminal klientini oching, serverni qayta yoqing — qayta ulanishdan keyingi GET satrini toping; o'z BUZISH.md yozuvingizga uch urinishni yozing",
  "seg": [
   [
    "a",
    "Endi siz: <b>terminal klienti va o'z buzish yozuvingiz</b>",
    "Endi navbat sizga. Ws2 done'da terminal klientini ochib, serverni qayta yoqasiz va klient ro'yxatni qayta so'raganini ko'rasiz. Keyin o'z buzish yozuvingizni yozasiz: bugungi uch urinish. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>npm run live</code>, server Ctrl+C va qayta</b> — <code>connect</code>, keyin <code>GET … → N ta</code>",
    "Birinchi qadamda ikkinchi terminalda npm run live: connect va get admin orders, nechta va eng yangisi. Ikkinchisida server terminalida Ctrl C, klientda transport close va xhr poll error, keyin server yoqiladi va yana connect, get satri."
   ],
   [
    "c",
    "3–4-qadam: <b><code>BUZISH.md</code> — uch qator</b>, <code>ws2-done</code> dagi namuna bilan solishtiring; isbot — <code>GET</code> satri",
    "Uchinchi qadamda o'z papkangizda BUZISH fayli: birinchi va ikkinchi amaliyotdagi urinishlar va bugungi qayta yonish. To'rtinchisida ws2 done'dagi namuna bilan solishtirasiz. Isbot maydoniga qayta ulanishdan keyingi get satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qayta ulanishni terminaldan tekshirasiz va buzish yozuvini o'zingiz yozasiz."
   ]
  ],
  "steps": [
   {
    "t": "Klient",
    "cmds": [
     "git checkout ws2-done",
     "server",
     "ikkinchi terminal: npm run live"
    ],
    "exp": "connect · ulangan · GET /admin/orders → N ta, eng yangisi #…"
   },
   {
    "t": "Qayta yonish",
    "cmds": [
     "server: Ctrl+C",
     "5 s",
     "npm run start:dev"
    ],
    "exp": "klientda transport close → xhr poll error → connect → yana GET … → N ta"
   },
   {
    "t": "Yozuv",
    "cmds": [
     "BUZISH.md: №",
     "Usul",
     "Nima qildim",
     "Nima kutdim",
     "Nima bo'ldi",
     "Belgi — 3 qator"
    ],
    "exp": "uch qator, «Nima bo'ldi» da ko'rganingiz"
   },
   {
    "t": "Solishtirish",
    "cmds": [
     "git show ws2-done:BUZISH.md"
    ],
    "exp": "ustunlar bir xil, belgi «buzildi / buzilmadi»"
   }
  ],
  "proof": {
   "label": "Qayta ulanishdan keyingi GET satri",
   "placeholder": "masalan: 14:05:31 GET /admin/orders → 7 ta, eng yangisi #7",
   "re": "GET \\/admin\\/orders → \\d+ ta",
   "flags": "",
   "wrong": "Klient terminalida qayta connect dan keyingi GET /admin/orders → … ta satrini nusxalang."
  },
  "trouble": [
   [
    "connect bor, GET satri yo'q",
    "ws2-start dagi klient — git checkout ws2-done"
   ],
   [
    "GET /admin/orders → 401",
    "klient tokeni .env dagi ADMIN_PANEL_TOKEN bilan bir xil emas"
   ],
   [
    "connect_error: xhr poll error to'xtamaydi",
    "server ishga tushmadi — server terminalidagi xatoni o'qing"
   ],
   [
    "fetch is not defined",
    "Node 18 dan eski — node -v, kursdagi Node 24"
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Ikki AI'ga buyurtmachining shikoyati, ishorasiz. Ikkalasi sababni to'g'ri topdi — connect da yukla() — va ikkalasi o'zicha «eski javob yangisini bosmasin» himoyasini qo'shdi",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>AI tuzatadi, siz qabul qilasiz</b> — shikoyat bilan, ishorasiz",
    "Beshinchi bosqich, AI. Ikki AI'ga buyurtmachining shikoyatini berdik, xuddi admin aytgandek: ba'zan yangi buyurtma ko'rinmaydi, belgi ulangan, sahifani yangilasam chiqadi. Connect ham, qayta so'rash ham aytilmagan. Kuchli va kuchsizroq model."
   ],
   [
    "b",
    "Prompt — <b>bir gap</b>: belgi «Ulangan», buyurtma yo'q, sahifani yangilasam chiqadi",
    "Prompt bitta gap, ekranda aynan. Sizga o'quvchi yoki do'kon egasi xuddi shunday yozadi. Bunday xabardan sababni topish uchun AI kodni o'qishi va qayta ulanish nima qilishini bilishi kerak."
   ],
   [
    "c",
    "Ikkalasi: <b><code>connect</code> da <code>yukla()</code></b> va o'zicha <b>so'rov raqami</b> — kech kelgan eski javob chizilmasin",
    "Ikkalasi sababni to'g'ri topdi va bizdagi tuzatishni yozdi: connect ichida yukla. Ikkalasi o'zicha yana bir himoya qo'shdi: so'rovga raqam, faqat oxirgisining javobi chiziladi. Ikki so'rov bir vaqtda ketsa, kech kelgan eski ro'yxat yangisini bosmasin. Tinglovchini hech biri connect ichiga ko'chirmadi."
   ],
   [
    "d",
    "Lekin ikkalasi <b>haqiqiy bazasiz</b> sinagan: biri JSON fayl bilan, biri jsdom'da",
    "Ikkalasi o'zi sinadi: birinchisi Chrome'da, baza o'rniga JSON fayl bilan, ikkinchisi brauzer o'rniga jsdom'da. Ikkinchisi sinov papkasini loyihadan tashqarida ochdi, shartda esa faqat shu papka edi. Endi ularni haqiqiy bazada, bizning tajriba bilan sinaymiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Haqiqiy PostgreSQL va brauzerda, buyurtma panel ulanishidan oldin: ikkalasida #2 sariq. Qabul — to'rt savol: qayerda so'raydi · tinglovchi nechta · xato haqiqatan yuz berdimi · nima ortiqcha qo'shildi",
  "seg": [
   [
    "a",
    "Haqiqiy bazada: <b>ikkalasida #2 sariq</b>, hodisa panelga kelmagan — tuzatish ishladi",
    "Ikkala AI nusxasini to'rtinchi ekrandagi tajriba bilan sinadik, haqiqiy Postgres va Chrome'da. Buyurtma ataylab panel ulanishidan oldin. Ikkalasida server yongach ikkinchi buyurtma sariq. Hodisa panelga kelmagan, demak ro'yxatni aynan qayta so'rash chiqardi."
   ],
   [
    "b",
    "So'rov raqami: <b>to'g'ri himoya</b>, lekin bizning tajribalarda bu holat chiqmadi",
    "Qo'shimcha himoya: har so'rovga raqam, javob kelganda raqam eng oxirgisi bo'lmasa, chizilmaydi. Mantiq to'g'ri, ortiqcha zarar yo'q. Lekin bizning tajribalarda javoblar tartibi buzilmadi, birinchi AI buni sekinlashtirilgan server bilan ko'rsatgan. Qabul qilsa bo'ladi, asosiy tuzatish emas."
   ],
   [
    "c",
    "Diqqat: <b>bir urinishda panel ulgurdi</b> — o'sha «o'tdi» hech narsani isbotlamaydi",
    "Eng muhim saboq. AI nusxasini birinchi sinaganimizda panel buyurtmadan oldin ulanib ulgurdi, hodisa oddiy yo'l bilan keldi. Ro'yxat to'g'ri edi, lekin xato umuman yuz bermagan. Eski kod ham o'tardi. Shuning uchun logda hodisa kelmaganini ko'rib, keyin qayta sinadik."
   ],
   [
    "d",
    "Xulosa: AI tuzatishiga <b>to'rt savol</b>: qayerda so'raydi · tinglovchi nechta · xato yuz berdimi · nima ortiqcha",
    "Xulosa: AI'ning qayta ulanish tuzatishiga to'rt savol. Ro'yxat connect'da so'raladimi. Tinglovchi bitta, tashqaridami. Sinovda xato haqiqatan yuz berdimi, ya'ni eski kod o'sha sinovda yiqilganmi. Va nima ortiqcha qo'shildi, kerakmi. Bu safar ikkalasi o'tdi."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Birinchi sinovimizda AI tuzatgan panel #2 ni ko'rsatdi. Panel logida qayta ulanishdan keyin kadr keldi … \"orderId\":2 bor. Bu sinov nimani isbotlaydi?",
  "q": "AI tuzatishlarini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Birinchi sinovimizda AI tuzatgan panel ikkinchi buyurtmani ko'rsatdi. Panel logida esa qayta ulanishdan keyin ikkinchi buyurtma hodisasi kelgan. Bu sinov nimani isbotlaydi? Variantni tanlang.",
  "ok": "To'g'ri. Hodisa kelgan bo'lsa, panel qayta ulanib ulgurgan va oddiy tinglovchi ro'yxatni yangilagan. Eski, tuzatilmagan kod ham shu sinovdan o'tardi. Sinov xatoni tekshirishi uchun eski kod unda yiqilishi kerak. Demak, avval eski kodda buzildi'ni ko'ring, keyin tuzatilganda takrorlanmadi'ni. Birinchi AI o'zi aynan shunday sinagan: eski sahifada xato takrorlandi, yangisida yo'q.",
  "okShort": "Hodisa kelgan — xato yuz bermagan; eski kod ham o'tardi. Sinov avval eski kodni yiqitsin.",
  "hint": "Shu sinovni tuzatilmagan kodda yurgizsak, natija boshqacha bo'larmidi?",
  "demak": "Sinov xatoni tekshiradi, agar eski kod unda yiqilsa; hodisa kelgan urinish — isbot emas.",
  "correct": 3,
  "opts": [
   "Tuzatish ishlaydi — panel #2 ni ko'rsatdi",
   "Xato tuzatilmagan — hodisa ikki marta kelgan, GET ham ikki",
   "Server o'zgargan — endi hodisa saqlanadi",
   "Hech narsani — bu urinishda xato yuz bermagan"
  ],
  "wrong": {
   "0": "Ko'rsatdi, lekin hodisa ham kelgan — eski kod ham ko'rsatardi.",
   "1": "Logda bitta kadr; GET soni oddiy.",
   "2": "Server kodiga tegilmagan — diff-stat: faqat admin.html (va README)."
  }
 },
 "20": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m10-05 · «Ulanish uzilsa: buzamiz va tuzatamiz»",
  "title": "O'quvchi darsi: agent «uchala chekka holatni bajardim» degan — o'quvchi Maydon Jamoa'da uch usul bilan buzadi, yozadi va tuzattiradi",
  "seg": [
   [
    "a",
    "m10-05 — 19 ekran: <b>agent «bajardim» degan</b> — o'quvchi buni da'vo deb tekshiradi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m10-05, o'n to'qqiz ekran. Maydon Jamoa'da agent uchala chekka holatni bajardim degan. O'quvchi buni da'vo deb oladi va uch usul bilan buzadi: internetni uzish, fonga olish va Backend'ning yangi versiyasi."
   ],
   [
    "b",
    "Uch muammo: <b>son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam</b>",
    "O'quvchi uchta muammoni topadi. Son eski: siz bugun ko'rgan uzilishdagi hodisa. Jonli xabar ikki marta: takror tinglovchi, o'quvchi kodida u boshidan connect ichida. Hozir ko'ryapti kam: xona. OrderBotNest'da bunday muammo yo'q, uni o'quvchi kodida ko'ramiz."
   ],
   [
    "c",
    "Bloklar: <b>og'ir joy — 9-ekran kod oynasi va ikki amaliyot</b>",
    "Bloklar jadvaliga qarang. Og'ir joy to'qqizinchi ekrandagi kod oynasi va ikki amaliyot. Uchinchi, beshinchi, yettinchi ekranlarga ortiqcha vaqt bermang. Har blokda siz qo'shadigan narsa o'ng ustunda: bugungi ekran raqami."
   ],
   [
    "d",
    "Xulosa: o'quvchi yozuvida <b>«Nima bo'ldi» — ko'rgani</b>, taxmin emas; vaqtning ko'pi amaliyotga",
    "Xulosa: vaqtning ko'pi ikki amaliyotga. O'quvchi yozuvida nima bo'ldi qatori ekranda ko'rgani bo'lsin, taxmin emas. Tuzatishdan keyin xuddi shu usul bilan qayta buzsin. Ikki teg: o'n ikkinchi modul beshinchi dars start va done."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Ilova o'yin ekranini ochganda xonaga kiradi; uzilganda server uni hamma xonadan chiqaradi; qayta ulanish xonaga o'zi qaytmaydi — ikkinchi telefonda «Hozir ko'ryapti: 1»",
  "seg": [
   [
    "a",
    "Xona: ilova o'yin ekranini ochganda <b><code>oyin-ochildi</code></b> — server uni o'yin xonasiga qo'shadi",
    "Uchinchi muammo OrderBotNest'da yo'q, chunki bizning panel hammaga bitta hodisa oladi. Maydon Jamoa'da esa o'yin ekrani ochilganda ilova oyin ochildi yuboradi, server uni o'sha o'yin xonasiga qo'shadi. Hozir ko'ryapti soni xonadagi ulanishlar."
   ],
   [
    "b",
    "Uzilganda ulanish <b>hamma xonadan chiqadi</b>; qayta ulanish o'zi qaytmaydi — Vali'da «1»",
    "Backend yangi versiyasi chiqdi, Ali qayta ulandi. Lekin yangi ulanish hech qaysi xonada emas: eski ulanish bilan birga xonadan chiqib ketgan. Vali o'yinni ochdi va hozir ko'ryapti bir ko'rindi, ikki emas. Ikkinchi ekranda aytgan narsa: serverdagi xona tiklanmaydi."
   ],
   [
    "c",
    "Tuzatish <b><code>connect</code> ichida</b>: qayta so'rash va ochiq o'yin xonasiga qayta kirish",
    "O'quvchi loyihasidagi tuzatish ulanish ts faylida, connect ichida ikki ish: qayta so'rash va ochiq o'yin bo'lsa, xonaga qayta kirish. Tinglovchi esa tashqariga chiqarilgan. Natija: ikkala telefonda ikki. Backend o'zgarmagan."
   ],
   [
    "d",
    "Xulosa: <code>connect</code> ichida <b>faqat bir martalik ish</b>: qayta so'rash, xonaga qaytish; tinglovchi — tashqarida",
    "Xulosa: uchala muammo bitta joyda, connect atrofida. Ichida faqat har ulanishda bir marta qilinadigan ish: qayta so'rash va xonaga qaytish. Tinglovchi bir marta, tashqarida. Siz bugun ikkitasini OrderBotNest'da qo'lingiz bilan qildingiz, uchinchisi shu qolipning davomi."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "A1: uch usul — uchish rejimi, fonga olish, Render'da qayta chiqarish; o'zgarishni agent boshqa akkauntdan qiladi. A2: yozuv bilan tuzattirish va xuddi shu usul bilan qayta tekshirish",
  "seg": [
   [
    "a",
    "A1 da kod yozilmaydi: <b>o'zgarishni agent boshqa akkauntdan</b> qiladi, kuzatish — o'quvchida",
    "O'quvchi amaliyotining birinchi bloki. Kod yozilmaydi: o'quvchi ilovani buzadi, o'zgarishni esa agent boshqa akkauntdan qiladi, siz bugun telefondan buyurtma berganingizdek. Kuzatish va yozuv o'quvchida."
   ],
   [
    "b",
    "Uchish rejimi — <b>bir daqiqa kutish</b>; siz buni Offline 60 soniyada ko'rdingiz",
    "Birinchi usul uchish rejimi va o'quvchi darsi bir daqiqagacha kuting deydi. Siz sababini bilasiz: ping qoidasi, Offline olti soniyada buzilmadi, bir daqiqada buzildi. O'quvchi erta qaytsa, buzilmadi yozadi va bu ham natija, lekin xato yashirin qoladi."
   ],
   [
    "c",
    "Render'da qayta chiqarish — <b>sizdagi server qayta yonishi</b>; bir necha daqiqa cho'zilishi mumkin",
    "Uchinchi usul Render'da qo'lda qayta chiqarish, siz bugun serverni qayta yoqqaningiz bilan bir xil. Faqat Render'da bu bir necha daqiqa cho'zilishi mumkin. Biz Render'ni sinamadik, tugma nomi o'quvchi darsida rasmiy hujjatdan olingan."
   ],
   [
    "d",
    "Xulosa: A2 da <b>agentning «tuzatdim»i ham da'vo</b> — xuddi shu usul bilan qayta buziladi",
    "Xulosa: ikkinchi blokda o'quvchi yozuvni agentga beradi va tuzattiradi. Agentning tuzatdim degani ham da'vo. Siz bugun ko'rdingiz: AI sinagan urinishda xato yuz bermagan bo'lishi mumkin. O'quvchi buzildi belgili urinishlarni xuddi shu usul bilan qaytarsin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Olti holat, har biri o'z belgisi bilan — va o'quvchi so'raydigan to'rt savol",
  "seg": [
   [
    "a",
    "Birinchi uchtasi — <b>uch muammo</b>: son eski, xabar ikki marta, son kam",
    "Sinfda uchraydigan olti holat. Birinchi uchtasi o'quvchi darsidagi uch muammo. Belgi ulangan, son eski: qayta so'rash yo'q. Jonli xabar ikki marta: tinglovchi connect ichida. Hozir ko'ryapti kam: xonaga qayta kirish yo'q."
   ],
   [
    "b",
    "Qolgan uchtasi: <b>hammasi «buzilmadi», Render uzoq, agent «tuzatdim»</b>",
    "To'rtinchisi: hamma urinish buzilmadi. Uchish rejimi qisqa bo'lgan yoki Expo Go ilovani qayta yuklagan, bu ham natija. Beshinchisi: Render qayta chiqishi bir necha daqiqa. Oltinchisi: agent tuzatdim dedi, uni xuddi shu usul bilan qayta tekshirish kerak."
   ],
   [
    "c",
    "O'quvchi savollari: <b>nega tuzatamiz, server qayta bermaydimi, ikki marta nima yomon, Backend</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: socket.io o'zi qayta ulansa nega tuzatamiz, server o'tkazilganni qayta bera olmaydimi, tinglovchi ikki marta bo'lsa nima yomon, Backend'ni tuzatish kerakmi."
   ],
   [
    "d",
    "Xulosa: har <b>«bajardim» va «tuzatdim»</b> dan keyin — xuddi shu usul bilan qayta buzish",
    "Xulosa va usul: o'quvchi yoki agent bajardim, tuzatdim desa, u bilan birga xuddi shu buzish usulini qaytaring va yozuvdagi nima bo'ldi qatoriga qarang. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "socket.io qayta ulanganda nimani o'zi tiklaydi?",
    "o": [
     "Ulanishni — o'tkazilgan hodisalarni emas",
     "Ulanishni va o'tkazilgan hamma hodisani",
     "Faqat hodisalarni, ulanishni sahifa yangilaydi",
     "Hech narsani — admin sahifani qayta ochadi"
    ],
    "c": 0,
    "e": "Qayta ulanish — yangi ulanish.",
    "s": 2
   },
   {
    "q": "Ulanish yo'q paytda yuborilgan order-changed nima bo'ladi?",
    "o": [
     "Navbatda turadi va qayta ulanganda keladi",
     "Keyingi hodisa bilan birga keladi",
     "Hech kimga yetmaydi va keyin ham kelmaydi",
     "Bazaga yoziladi, panel uni o'zi o'qiydi"
    ],
    "c": 2,
    "e": "server.emit — faqat ulanganlarga.",
    "s": 2
   },
   {
    "q": "Tuzatish qayerda va qanday?",
    "o": [
     "Gateway'da — hodisani bazaga saqlash",
     "admin.html — connect ichida yukla()",
     "Botda — hodisani ikki marta yuborish",
     "Panelda — sahifani har 3 s yangilash"
    ],
    "c": 1,
    "e": "Har ulanishda ro'yxat bazadan.",
    "s": 8
   },
   {
    "q": "Tinglovchi connect ichida. Server ikki marta qayta yondi. Bitta buyurtmada nima bo'ladi?",
    "o": [
     "Hodisa umuman kelmaydi — tinglovchi yo'q",
     "Ulanish yopiladi va qayta ochilmaydi",
     "Token qayta so'raladi, admin qayta kiradi",
     "Uchta GET ketadi, sariq belgi yo'qoladi"
    ],
    "c": 3,
    "e": "Har qayta ulanishda yana bitta tinglovchi.",
    "s": 10
   },
   {
    "q": "DevTools Offline 6 soniya, shu payt buyurtma. Natija?",
    "o": [
     "Buzilmadi — kadr Online'da keldi, ro'yxat yangi",
     "Buzildi — hodisa yo'qoldi, ro'yxat eski",
     "Belgi darhol «Ulanmagan» bo'ldi, qayta urinmadi",
     "Sahifa o'zi qayta yuklandi va ro'yxat yangilandi"
    ],
    "c": 0,
    "e": "Brauzer ochiq ulanishni yopmadi.",
    "s": 6
   },
   {
    "q": "DevTools Offline 60 soniya. Nega buziladi?",
    "o": [
     "Brauzer bir daqiqadan keyin sahifani o'zi yopadi",
     "Ping kelmaydi — klient uzadi, kadr tashlanadi",
     "Server 60 s dan keyin tokenni bekor qiladi",
     "Offline paytida bot buyurtma olmaydi"
    ],
    "c": 1,
    "e": "25 + 20 s qoidasi.",
    "s": 6
   },
   {
    "q": "connectionStateRecovery qachon yordam bermaydi?",
    "o": [
     "Qisqa tarmoq uzilishida — ikki daqiqagacha",
     "Websocket transportida — polling'da ishlaydi",
     "Server qayta yonganda — holat xotirada edi",
     "Klient uzilishdan oldin hodisa olgan bo'lsa"
    ],
    "c": 2,
    "e": "Tiklash — server jarayoni xotirasida.",
    "s": 14
   },
   {
    "q": "AI «sinadim, o'tdi» dedi. Nimani tekshirasiz?",
    "o": [
     "Testlar soni oshdimi va hammasi yashil chiqdimi",
     "Diff qisqami — kam fayl o'zgarganmi",
     "AI kuchli modelmi — javobiga ishonsa bo'ladimi",
     "Sinovda eski kod yiqildimi — xato yuz berdimi"
    ],
    "c": 3,
    "e": "Hodisa kelgan urinish — isbot emas.",
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
//  MENTOR KURSI · WebSocket-2 «Ulanish uzilsa: buzamiz va tuzatamiz» (v2, F-1104-23)
//  Manba-haqiqat: feedback/F-1029-02-mentor-kurs/21-WS2-mentor-v2.md (04.11, to'g'ridan qurildi — foydalanuvchi ruxsati)
//  Loyiha: github.com/Azizbekcrypto/OrderBotNest — teglar ws2-start (= ws1-done) → ws2-done (connect'da qayta so'rash, BUZISH.md)
//  Kod, terminal, panel holatlari va AI natijalari: 03b-kod.gen.jsx (dev/ws2-kod.py — repo teglari va manba/ws2v2-out, ws2v2-ai dan aynan)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws2/parts/*.jsx > WsReconnectMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws2-01-qayta-ulanish-v1'; // M44: id o'zgarmaydi (v1 dagi qiymat)
const LESSON_TITLE = "Ulanish uzilsa: buzamiz va tuzatamiz";
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
  tg: 'src/api/telegram/telegram.service.ts', html: 'public/admin.html', cli: 'scripts/live-client.js', buz: 'BUZISH.md', readme: 'README.md',
};
const BASE_FILES = ['node_modules/', F.html, F.cli, 'scripts/smoke.js', 'src/api/app.module.ts', 'src/api/cart/', 'src/api/catalog/', F.ctrl, F.tok, F.gw, F.mod, 'src/api/order/', F.tg, 'src/api/user/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', '.env.example', 'package.json', F.buz, F.readme];
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
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};
const SPOKEN = [
  ['npm run live', 'npm run live'], ['npm run start dev', 'npm run start:dev'], ['ws2 start', 'ws2-start'], ['ws2 done', 'ws2-done'], ['ws1 done', 'ws1-done'],
  ['get admin orders', 'GET /admin/orders'], ['localhost uch ming admin', 'localhost:3000/admin'],
  ['admin html', 'admin.html'], ['live client', 'live-client'], ['telegram service', 'telegram.service'], ['on module init', 'onModuleInit'], ['bot launch', 'bot.launch'],
  ['order changed', 'order-changed'], ['server emit', 'server.emit'], ['transport close', 'transport close'], ['xhr poll error', 'xhr poll error'], ['ping timeout', 'ping timeout'],
  ['connection state recovery', 'connectionStateRecovery'], ['socket recovered true', 'socket.recovered = true'], ['recovered true', 'recovered=true'], ['recovered false', 'recovered=false'],
  ['No throttling', 'No throttling'], ['Ctrl C', 'Ctrl+C'], ['F12', 'F12'], ['BUZISH fayli', 'BUZISH.md fayli'], ['oyin ochildi', 'oyin-ochildi'], ['ulanish ts', 'ulanish.ts'],
  ['m10-05', 'm10-05'], ['ulanish on', 'ulanish.on'],
];
DIGITS.unshift(["o'n to'qqiz ekran", '19 ekran'], ["o'ttiz ikki", '32'], ["to'qqizdan to'qqiz", '9/9'], ["o'n besh daqiqa", '15 daqiqa'], ["yigirma daqiqa", '20 daqiqa'],
  ["yigirma besh va yigirma", '25 va 20'], ["qirq besh soniya", '45 soniya'], ["olti soniya", '6 soniya'], ["O'ttiz uchinchi soniyada", '33-soniyada'], ["Uchinchi, beshinchi, yettinchi ekranlarga", '3, 5, 7-ekranlarga'], ["to'qqizinchi ekran", '9-ekran'], ["to'rtinchi ekran", '4-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
EN_PHRASES.unshift(/transport close/gi, /xhr poll error/gi, /ping timeout/gi, /order changed/gi, /server emit/gi, /connection state recovery/gi, /socket recovered true/gi, /recovered (true|false)/gi,
  /on module init/gi, /bot launch/gi, /No throttling/g, /Offline/g, /Online/g, /Network/g, /websocket/g, /socket\.io/g, /jsdom/g, /Chrome/g, /Ctrl C/g, /deploy/g);

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
const Term = ({ lines, title = t('VS Code terminali · OrderBotNest', "терминал VS Code · OrderBotNest"), er, beat, focus, style }) => <CodePanel file={title} numbers={false} style={{ background: er ? C1.termEr : C1.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
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

// Brauzerdagi panel — HAQIQIY suratlardan (KOD.PANEL: headless Chrome, ws2v2-panel.mjs SURAT qatorlari). Maket: ko'rinish chizilgan, har qator va belgi haqiqiy.
const PCOLS = ['#', 'Mijoz', 'Telefon', 'Mahsulotlar', 'Jami', 'Holat', 'Vaqt'];
const pstage = (k) => KOD.PANEL.find((x) => x.k === k);
function PanelView({ k, note, small, label }) {
  const st = pstage(k); if (!st) return null;
  const cls = st.belgi === 'Ulangan' ? 'ulangan' : st.belgi === 'Ulanmagan' ? 'ulanmagan' : 'ulanmoqda';
  return <div className={`c1-br${small ? ' sm' : ''}`}>
    <div className="bar"><span className="dots"><i /><i /><i /></span><span className="url">localhost:3000/admin</span><span className="src">{label || t('haqiqiy brauzer', "настоящий браузер")} · {st.t}</span></div>
    <div className="hd"><b>Buyurtmalar — jonli panel</b><span className={`belgi ${cls}`}>{st.belgi}</span></div>
    {note && <div className="note">{note}</div>}
    <table><thead><tr>{PCOLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{st.rows.map((r, i) => r.msg ? <tr key={i}><td colSpan={7}>{r.msg}</td></tr> : <tr key={i} className={r.yangi ? 'yangi' : ''}>{r.cells.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
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

// WebSocket-2 v2 ga xos CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.w2-r13 td,.w2-r14 td,.w2-a2 td{vertical-align:top}
.w2-r13 .bz{display:inline-block;font:700 11.5px system-ui,sans-serif;border-radius:999px;padding:1px 7px;background:#DC2626;color:#fff;white-space:nowrap}
.w2-r13 .tk{display:inline-block;font:700 11.5px system-ui,sans-serif;border-radius:999px;padding:1px 7px;background:#DCFCE7;color:#15803D;white-space:nowrap}
.w2-r13 td.s{background:#FEF2F2}.w2-r13 td.d{background:#F0FDF4}
.w2-r14 .y{color:#15803D;font-weight:700}.w2-r14 .n{color:#DC2626;font-weight:700}.w2-r14 td.c,.w2-r14 th.c{text-align:center}
.w2-a2 td:first-child{font-family:system-ui,sans-serif;font-weight:700;color:#374151;white-space:nowrap}
.w2-a2 tr.w td{background:#FFF7ED}
.w2-a2 .f{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#FFEDD5;color:#C2410C}
.w2-a2 .g{display:inline-block;font:700 11px system-ui,sans-serif;border-radius:999px;padding:1px 7px;margin-left:4px;background:#DCFCE7;color:#15803D}
.w2-b3 td{vertical-align:top}
.w2-b3 tr.w td{color:#9CA3AF}
.w2-b3 .bz{display:inline-block;font:700 12px system-ui,sans-serif;border-radius:999px;padding:2px 8px;background:#DC2626;color:#fff;white-space:nowrap}
.w2-vw-card{background:#fff;border:1px solid #D7DCE3;border-radius:14px;padding:12px 10px 6px}
.w2-vw-card svg{display:block;width:100%;height:auto}
.w2-vw-card .tt{font:12px ui-monospace,Menlo,Consolas,monospace;fill:#6B7280}
.w2-vw-card .ll{font:700 13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;fill:#374151}
.w2-vw-card .ss{font:12.5px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.w2-res{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:10px}
.w2-res>div{border-radius:12px;padding:10px 12px;display:grid;gap:4px;font-size:14px;background:#fff;border:1.5px solid #D7DCE3;align-content:start}
.w2-res small{font:600 11px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B7280}
.w2-res b{font:700 18px ui-monospace,Menlo,Consolas,monospace}
.w2-res .bad{border-color:#E2451F;background:#FFF5F2}
.w2-res .fix{border-color:#0E7490}
.w2-res .fix code{font:13px ui-monospace,Menlo,Consolas,monospace;background:#ECFEFF;color:#0E7490;border-radius:5px;padding:1px 5px}
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
    let s = document.getElementById('mk-css-ws2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish — dars oxiridagi natija: server qayta yongach #2 sariq (ws2v2-out/04, 3-surat)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', "Yo'qolgan buyurtma", 'Takror tinglovchi', 'Tarmoq va tiklash', 'AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + admin paneli; bugungi savol — server qayta yonganda yoki tarmoq uzilganda
// o'chiq paytdagi buyurtma panelga yetadimi. Panel belgisi — admin.html dagi haqiqiy yozuv (tarjima qilinmaydi)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const LIVE_ON = ['phone', 'telegram', 'order', 'db', 'orders'];
const PNL = (steps, res, badge) => ({ get name() { return t('Admin panel', 'Админ-панель'); }, get steps() { return typeof steps === 'function' ? steps() : steps; }, res, badge }); // steps — funksiya bo'lsa render paytida (tarjima)
const S1M = [
  { on: LIVE_ON, note: { get orders() { return t("#2 — server o'chiq paytda", '#2 — пока сервер выключен'); } }, jest: PNL([['connect → yukla()', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
  { on: ['telegram', 'orders', 'db'], note: { get orders() { return t("#2 bazada, panelda yo'q", '#2 в базе, в панели нет'); } }, jest: PNL(() => [['transport close', 'bad'], [t('qayta ulandi', 'переподключился'), 'ok']], 'fail', 'Ulangan') },
  { on: LIVE_ON, jest: PNL(() => [['connect → yukla()', 'ok'], [t('tinglovchi bitta', 'один слушатель'), 'ok']], 'pass', 'Ulangan') },
  { on: LIVE_ON, jest: PNL([['connect → yukla()', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} {...m} tag={t("Bugungi darsning rasmi — uzilishdan keyin panel buyurtmani yo'qotmaydimi", 'Картина урока — не теряет ли панель заказ после обрыва')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Qayta ulanish nimani tiklaydi, nimani yo'q (ws2v2-out/01 — terminal)
// ============================================================
const T2 = sec('01', 'Terminal');
const FLOW2 = [['on', 'Ulangan', "#1 ko'rindi", T.green], ['off', 'Uzildi', "server o'chdi", '#B7791F'], ['ev', 'Buyurtma #2', 'order-changed → 0 panel', T.accent], ['re', 'Qayta ulandi', 'yangi ulanish', C1.ws], ['old', "Ro'yxat eski", 'faqat #1', T.accent]];
// F-1109-06: beshta kichik karta o'rniga katta oqim (uzilishdagi hodisa → 0 panel) va pastda yechim aylanasi
function Lost2({ fix }) {
  return <div className="z">
    <div className={'z-card' + (fix ? '' : ' hl')}>
      <p className="z-h">{t("Uzilish paytida yuborilgan hodisa — kimga yetadi?", "Событие, отправленное во время обрыва, — кому дойдёт?")}</p>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("Ulangan", "Подключено")}</b><span className="z-mut">{t("#1 ko'rindi", "#1 видно")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st bad"><b>{t("Uzildi", "Обрыв")}</b><span className="z-mut">{t("server o'chdi yoki tarmoq", "сервер выключился или сеть")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ac"><b>{t("Buyurtma #2", "Заказ #2")}</b><span className="zm">order-changed</span><span className="z-tag r">{t("0 panel", "0 панелей")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue"><b>{t("Qayta ulandi", "Переподключилась")}</b><span className="z-mut">{t("yangi ulanish", "новое соединение")}</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>{t("Ro'yxat eski", "Список старый")}</b><span className="zm">{t("faqat #1", "только #1")}</span></div>
      </div>
      <span className="z-mut">{t("socket.io ulanishni o'zi tiklaydi — lekin server hodisani faqat ", "socket.io сам восстанавливает соединение — но сервер шлёт событие только ")}<b>{t("hozir ulanganlarga", "подключённым сейчас")}</b>{t(" yuboradi.", ".")}</span>
    </div>
    <div className={'z-card' + (fix ? ' hl' : ' dim')} style={{ borderColor: 'var(--ok)' }}>
      <p className="z-h" style={{ color: 'var(--ok)' }}>{t("Yechim — ro'yxat bazada: har connect da qayta so'raymiz", "Решение — список в базе: при каждом connect запрашиваем заново")}</p>
      <div className="z-flow">
        <div className="z-st blue"><b>connect</b><span className="z-mut">{t("birinchi ham, qayta ham", "и первый, и повторный")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st"><b>GET /admin/orders</b><span className="z-mut">{t("bazadan to'liq ro'yxat", "полный список из базы")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("Ro'yxat to'g'ri", "Список верный")}</b><span className="zm">#2, #1</span><span className="z-mut">{t("uzilishda nima bo'lgani muhim emas", "неважно, что было во время обрыва")}</span></div>
      </div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'term' }, { v: 'flow' }, { v: 'two' }, { v: 'rule' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'term' && <Term title={t("VS Code terminali · npm run live (ws2-start)", "терминал VS Code · npm run live (ws2-start)")} lines={T2} />}
    {seg.v === 'flow' && <Lost2 />}
    {seg.v === 'two' && <div className="pg-two">
      <Card c={T.green} h={t("Tiklanadi", "Восстанавливается")}><p>{t("ulanishning o'zi · token (", "само соединение · токен (")}<code>auth</code>{t(" har ulanishda qayta yuboriladi) · tinglovchilar — klientda turadi", " отправляется заново при каждом подключении) · слушатели — живут в клиенте")}</p></Card>
      <Card c={T.accent} h={t("Tiklanmaydi", "Не восстанавливается")} hl><p>{t("uzilish paytidagi hodisa · serverning shu ulanishga bog'lagan narsasi — masalan, ", "событие во время обрыва · то, что сервер привязал к этому соединению, — например, ")}<b>{t("xona", "комната")}</b>{t(" (o'quvchi darsida)", " (в уроке ученика)")}</p></Card>
    </div>}
    {seg.v === 'rule' && <Lost2 fix />}
  </>} />;
}

// ============================================================
//  3 · «O'zi yangilanadi» — da'vo; buzish yozuvi (README ws2-start, BUZISH.md ws2-done)
// ============================================================
const RD3 = lineN('README_START', /o'zi yangilanadi/);
const BZ_HEAD = KOD.BUZISH.lines.find((l) => /^\| № \|/.test(l.t)).t.split('|').map((x) => x.trim()).filter(Boolean).slice(0, 6);
const METHODS3 = [['Server qayta yondi', 'deploy yoki xato — Ctrl+C va qayta', T.green], ['Brauzer Offline', 'DevTools → Network → Offline', '#B7791F'], ['Tarmoq uzildi', "panel boshqa kompyuterda, server Render'da", C1.ws]];
// F-1109-06: xulosa — ikki ta'rif kartasi o'rniga BUZISH yozuvi jadval bo'lib (1-qator haqiqiy, BUZISH.md), belgi ma'nosi va «da'vo» qoidasi
function Buz3() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("BUZISH yozuvi — har urinish bir qator (o'quvchi darsidagi BUZISH.md ustunlari)", "Запись BUZISH — каждая попытка одна строка (колонки BUZISH.md из урока ученика)")}</p>
      <table className="z-tbl w2-b3"><tbody>
        <tr><th>{t("usul", "способ")}</th><th>{t("nima qildim", "что сделал")}</th><th>{t("nima kutdim", "что ожидал")}</th><th>{t("nima bo'ldi — ekranda", "что произошло — на экране")}</th><th>{t("belgi", "отметка")}</th></tr>
        <tr><td>{t("server qayta yondi", "сервер перезапущен")}</td><td>{t("Ctrl+C, 5 s, qayta yoqdim; o'chiq paytda Bobur buyurtma berdi", "Ctrl+C, 5 s, снова включил; пока был выключен, Бобур сделал заказ")}</td><td>{t("ro'yxatda #2", "в списке #2")}</td><td>{t("«Ulangan» · ro'yxat: #1 · bazada 2 ta", "«Ulangan» · список: #1 · в базе 2")}</td><td><span className="bz">{t("buzildi", "сломалось")}</span></td></tr>
        <tr className="w"><td>{t("brauzer Offline", "браузер Offline")}</td><td>DevTools → Network → Offline</td><td>…</td><td>…</td><td>…</td></tr>
        <tr className="w"><td>{t("tarmoq uzildi", "обрыв сети")}</td><td>{t("panel va server orasidagi proksi kesildi", "прокси между панелью и сервером оборван")}</td><td>…</td><td>…</td><td>…</td></tr>
      </tbody></table>
      <span className="z-mut">{t("«nima bo'ldi» ustuniga taxmin emas — ekranda ko'rilgan narsa yoziladi", "в колонку «что произошло» пишется не догадка — то, что видно на экране")}</span>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}><b style={{ color: 'var(--bad)' }}>{t("buzildi", "сломалось")}</b><span>{t("ko'rilgan narsa kutilgandan farq qildi — muammo bor", "увиденное отличается от ожидаемого — проблема есть")}</span></div>
      <div className="z-card"><b style={{ color: 'var(--ink2)' }}>{t("buzilmadi", "не сломалось")}</b><span>{t("shu kompyuterda, shu urinishda — ", "на этом компьютере, в этой попытке — ")}<b>{t("isbot emas", "не доказательство")}</b></span></div>
    </div>
    <div className="z-rule">{t("README: «ro'yxat o'zi yangilanadi» — ", "README: «список обновляется сам» — ")}<b>{t("da'vo", "заявление")}</b>{t(": aytilgan, isbotlanmagan. Tekshiruv — buzib ko'rish.", ": сказано, не доказано. Проверка — попробовать сломать.")}</div>
  </div>;
}
const S3 = mkS(3, [{ v: 'rd' }, { v: 'cols' }, { v: 'met' }, { v: 'belgi' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'rd' && <CodePanel file="OrderBotNest · README.md · ws2-start" lines={kod('README_START', { [RD3]: 'd' }, RD3 - 2, RD3 + 3)} focus={['d']} />}
    {seg.v === 'cols' && <div style={{ display: 'grid', gap: 10 }}><div className="mk-tag" style={{ margin: 0 }}>{t("Buzish yozuvi — BUZISH.md (o'quvchi darsidagi bilan bir xil ustunlar)", "Запись поломки — BUZISH.md (те же колонки, что в уроке ученика)")}</div>
      <div className="pg-three" style={{ gridTemplateColumns: 'repeat(6,minmax(0,1fr))' }}>{BZ_HEAD.map((h, i) => <div key={h} className="mk-box hl" style={{ '--c': i === 4 ? T.accent : T.blue, padding: '10px 8px', textAlign: 'center', animation: `mk-up .35s ${i * 0.08}s ease both` }}><h4 style={{ margin: 0, fontSize: 13 }}>{h}</h4></div>)}</div>
      <div className="mk-rule">{t("«Nima bo'ldi» — ", "«Что было» — ")}<b>{t("ekranda ko'rgan narsa", "то, что видели на экране")}</b>{t(", taxmin emas.", ", не догадка.")}</div></div>}
    {seg.v === 'met' && <div className="pg-three">{METHODS3.map(([h, tx, c], i) => <Card key={h} c={c} h={`${i + 1} · ${h}`}><p>{tx}</p><p style={{ marginTop: 4 }}>{t("shu paytda — buyurtma", "в этот момент — заказ")}</p></Card>)}</div>}
    {seg.v === 'belgi' && <Buz3 />}
  </>} />;
}

// ============================================================
//  4 · Server qayta yondi: buyurtma bazada, panelda yo'q (ws2v2-out/01)
// ============================================================
const SRV4 = secRaw('01', 'Server logi');
const SRV4B = SRV4.slice(SRV4.findIndex((l, i) => i > SRV4.findIndex((x) => /ishlayapti/.test(x)) && /ishlayapti/.test(l))).map((l) => ({ h: liveLine(l) }));
const BAZA4 = lastLine('01', /^## Baza/).replace(/^## /, ''); const KELDI4 = lastLine('01', /^## Navbatdagi/).replace(/^## /, '');
const S4 = mkS(4, [{ v: 'p' }, { v: 'srv' }, { v: 'p3' }, { v: 'db' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    <PanelView k={seg.v === 'p' ? '01-1' : seg.v === 'srv' ? '01-2' : '01-3'} small label="ws2-start" />
    <div style={{ display: 'grid', gap: 8 }}>
      {seg.v === 'p' && <><PanelView k="01-2" small label={t("ws2-start · Ctrl+C dan keyin", "ws2-start · после Ctrl+C")} /><div className="mk-rule">{t("Server terminalida ", "В терминале сервера ")}<b>Ctrl+C</b>{t(" — belgi «Ulanmoqda…», ro'yxat ekranda qoladi. Shu payt Bobur botga yozdi.", " — знак «Ulanmoqda…», список остаётся на экране. В этот момент Бобур написал боту.")}</div></>}
      {seg.v === 'srv' && <Term title={t("server logi · qayta ishga tushgandan keyin", "лог сервера · после перезапуска")} lines={SRV4B} />}
      {seg.v === 'p3' && <Term title={t("VS Code terminali · npm run live", "терминал VS Code · npm run live")} lines={T2} />}
      {seg.v === 'db' && <><Card c={T.accent} h={t("Baza (psql)", "База (psql)")} hl><p><code>{BAZA4}</code></p></Card><Card c={T.ink3} h={t("Hodisa #2", "Событие #2")}><p>{KELDI4}</p></Card></>}
    </div>
  </div>} />;
}

// ============================================================
//  5 · Nega: Telegram navbati panel ulanishidan tez (telegram.service.ts, 01, ai1a)
// ============================================================
const TG_INIT = lineN('TG', /async onModuleInit\(\)/), TG_L = lineN('TG', /\.launch\(/);
const FLOW5 = [['up', 'Server yondi', 'app.listen', T.green], ['bot', 'Bot navbatni oldi', 'launch → xabar → #2', T.blue], ['ev', 'order-changed', '0 panelga', T.accent], ['try', 'Panel urinadi', '1 → 2 → 4 → 5 s', '#B7791F'], ['on', 'Ulandi', 'hodisa o\'tib ketgan', C1.ws]];
const P5A = sec('01', 'Brauzer', (l) => /WebSocket|belgi:|kadr/.test(l)).slice(-3);
const L1A = KOD.OUT.ai1a.split('\n');
const P5B = L1A.filter((l) => /^\d\d:\d\d:\d\d\.\d+ (brauzer: (WebSocket|kadr))/.test(l)).slice(-2).map((l) => ({ h: liveLine(ms(l)) }));
// F-1109-06: beshta kichik karta o'rniga haqiqiy vaqt o'qi :30–:45 (ws2v2-out/01): #2 bazaga 21:37:37, panel 21:37:39 da ulanadi
function Time5({ res }) {
  const tk = [[90, ':30'], [224, ':33'], [358, ':36'], [492, ':39'], [626, ':42'], [760, ':45']];
  return <div className="z">
    <div className="w2-vw-card">
      <svg viewBox="0 0 780 270" role="img" aria-label="server qayta yonishi vaqt o'qi">
        <rect x="397" y="28" width="98" height="206" fill="#FEE2E2" />
        <text x="446" y="22" textAnchor="middle" className="ss" fill="#B91C1C" fontWeight="700">{t("2,2 s — hodisa yo'qoldi", "2,2 s — событие потеряно")}</text>
        <line x1="90" y1="234" x2="760" y2="234" stroke="#9CA3AF" />
        {tk.map(([x, l]) => <g key={x}><line x1={x} y1="230" x2={x} y2="238" stroke="#D1D5DB" /><text x={x} y="252" textAnchor="middle" className="tt">{l}</text></g>)}
        <text x="8" y="70" className="ll">{t("Server", "Сервер")}</text>
        <rect x="90" y="56" width="268" height="22" rx="5" fill="#FECACA" /><text x="224" y="72" textAnchor="middle" className="ss" fill="#991B1B">{t("o'chiq (Ctrl+C)", "выключен (Ctrl+C)")}</text>
        <rect x="358" y="56" width="402" height="22" rx="5" fill="#BBF7D0" /><text x="560" y="72" textAnchor="middle" className="ss" fill="#166534">{t("ishlayapti", "работает")}</text>
        <text x="8" y="138" className="ll">{t("Bot · baza", "Бот · база")}</text>
        <line x1="90" y1="132" x2="760" y2="132" stroke="#E5E7EB" strokeWidth="2" />
        <circle cx="403" cy="132" r="9" fill="#EA580C" />
        <text x="418" y="122" className="ss" fill="#9A3412" fontWeight="700">{t("#2 bazada", "#2 в базе")}</text>
        <text x="418" y="152" className="ss" fill="#9A3412">{t("order-changed yuborildi", "order-changed отправлено")}</text>
        <text x="8" y="206" className="ll">{t("Panel", "Панель")}</text>
        <line x1="112" y1="200" x2="497" y2="200" stroke="#9CA3AF" strokeWidth="4" strokeDasharray="8 6" />
        <text x="230" y="190" textAnchor="middle" className="ss" fill="#4B5563">«Ulanmoqda…»</text>
        <rect x="497" y="189" width="263" height="22" rx="5" fill="#BFDBFE" /><text x="628" y="205" textAnchor="middle" className="ss" fill="#1E3A8A">{t("«Ulangan» · ro'yxat: #1", "«Ulangan» · список: #1")}</text>
        <line x1="403" y1="141" x2="403" y2="186" stroke="#EA580C" strokeWidth="2" strokeDasharray="4 4" />
        <text x="410" y="178" className="ss" fill="#B91C1C" fontWeight="700">✕</text>
      </svg>
    </div>
    <div className={'w2-res' + (res ? '' : ' dim')}>
      <div><small>{t("Bazada", "В базе")}</small><b>{t("2 ta buyurtma", "2 заказа")}</b></div>
      <div className="bad"><small>{t("Panelda", "В панели")}</small><b>{t("faqat #1", "только #1")}</b></div>
      <div className="fix"><small>{t("ws2-done tuzatishi", "исправление ws2-done")}</small><div>{t("har ", "при каждом ")}<code>connect</code>{t(" da ro'yxatni bazadan qayta so'raydi", " заново запрашивает список из базы")}</div></div>
    </div>
  </div>;
}
const S5 = mkS(5, [{ v: 'code' }, { v: 'flow' }, { v: 'two' }, { v: 'rule' }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="TG" ids={rngIds(TG_L - 1, TG_L + 8, 'l')} from={TG_INIT} to={TG_L + 8} focus={['l']} />}
    {seg.v === 'flow' && <Time5 />}
    {seg.v === 'two' && <div className="pg-two">
      <Term title={t("panel · bu urinishda kech qoldi (01)", "панель · в этой попытке опоздала (01)")} lines={[...P5A, { h: liveLine(t("# order-changed #2 — kelmadi", "# order-changed #2 — не пришло")) }]} er />
      <Term title={t("panel · AI nusxasi, bir urinish — ulgurdi (ai1a)", "панель · копия AI, одна попытка — успела (ai1a)")} lines={P5B} />
    </div>}
    {seg.v === 'rule' && <Time5 res />}
  </>} />;
}

// ============================================================
//  6 · Brauzer Offline: 6 s — buzilmadi, 60 s — buzildi (ws2v2-out/02)
// ============================================================
const P6 = secRaw('02', 'Brauzer');
const OFF2 = P6.findIndex((l, i) => i > P6.findIndex((x) => /Offline yoqildi/.test(x)) && /Offline yoqildi/.test(l));
// panel logi + qadamlardagi «Bobur buyurtma berdi» satri — vaqt bo'yicha birlashtiriladi
const Q6 = secRaw('02', 'Qadamlar').filter((l) => /Bobur/.test(l));
const mix6 = (L) => { const a = L[0].slice(0, 8), b = L[L.length - 1].slice(0, 8); return [...L.map(ms), ...Q6.filter((q) => q.slice(0, 8) >= a && q.slice(0, 8) <= b)].sort((x, y) => (x.slice(0, 8) < y.slice(0, 8) ? -1 : x.slice(0, 8) > y.slice(0, 8) ? 1 : 0)).map((l) => ({ h: liveLine(l) })); };
const P6A = mix6(P6.slice(P6.findIndex((l) => /Offline yoqildi/.test(l)), OFF2));
const P6B = mix6(P6.slice(OFF2).filter((l) => !/tugadi/.test(l)));
const BAZA6 = sec('02', 'Server logi', (l) => /bazada/.test(l)).slice(-1);
function DevTools({ off }) {
  return <div className="c2-dev">
    <div className="tabs"><span>Elements</span><span>Console</span><b>Network</b><span>Application</span></div>
    <div className="tool"><span>☐ Preserve log</span><span className={`sel${off ? ' off' : ''}`}>{off ? 'Offline' : 'No throttling'} ▾</span></div>
    <div className="list"><span>No throttling · Fast 4G · Slow 4G · 3G · <b style={{ color: off ? T.accent : T.ink }}>Offline</b></span><span>model — Chrome DevTools, F12 → Network</span></div>
  </div>;
}
const S6 = mkS(6, [{ v: 'dev' }, { v: 'a' }, { v: 'b' }, { v: 'res' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'dev' && <DevTools off />}
    {seg.v === 'a' && <Term title={t("panel logi · Offline ~6 s (ws2-start)", "лог панели · Offline ~6 s (ws2-start)")} lines={P6A} />}
    {seg.v === 'b' && <Term title={t("panel logi · Offline 60 s (ws2-start)", "лог панели · Offline 60 s (ws2-start)")} lines={P6B} er />}
    {/* F-1120-02 (M51): xulosada darsning rasmi (matnli qoida o'rniga) — Offline 60 s: #2 bazada, panelda yo'q (server logi BAZA6) */}
    {seg.v === 'res' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="02-4" small label={t("ws2-start · Online'dan keyin", "ws2-start · после Online")} /><div style={{ display: 'grid', gap: 8 }}><Term title={t("server logi", "лог сервера")} lines={BAZA6} /><div className="mk-light" style={{ padding: 10 }}><BotMap loc={DB_ALL} on={['telegram', 'orders', 'db']} note={{ get orders() { return t("#2 bazada, panelda yo'q", '#2 в базе, в панели нет'); } }} jest={PNL(() => [['Offline 60 s', 'bad'], [t('qayta ulandi', 'переподключился'), 'ok']], 'fail', 'Ulangan')} max={1} tag={t("Offline ping vaqtidan uzun bo'lsa buziladi — 45 soniyadan ko'p kuting", 'Offline дольше ping — ломается; ждите больше 45 секунд')} /></div></div></div>}
  </>} />;
}

// ============================================================
//  7 · Tekshiruv 1 — belgi «Ulangan», buyurtma yo'q (01)
// ============================================================
function Screen7(p) {
  const L = SRV4B.filter((x) => /Buyurtma #2|panel ulandi|ishlayapti/.test(x.h)).slice(0, 3);
  return MC(p, 7, {
    above: <Term title={t("server logi · qayta ishga tushgandan keyin (01)", "лог сервера · после перезапуска (01)")} lines={L} />,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("baza · psql", "база · psql")} lines={jt(BAZA4)} /><Term title={t("panel logi", "лог панели")} lines={jt(KELDI4)} er /></div>,
  });
}

// ============================================================
//  8 · Tuzatish: connect da qayta so'rash (admin.html, live-client.js ws2-done; 04, 09, 11, 08)
// ============================================================
const H = { c0: lineN('HTML', /ulanish\.on\('connect'/), lo: lineN('HTML', /ulanish\.on\('order-changed'/) };
const HS = { s0: lineN('HTML_START', /addEventListener\('submit'/) };
const HS_END = lineN('HTML_START', /^\s+ulan\(\);$/, lineN('HTML_START', /^\s+if \(token\) \{/));
const HS_EDIT = Object.fromEntries(KOD.HTML_START.lines.filter((l) => l.n > HS.s0 && l.n <= HS_END && l.t.trim() === 'yukla();').map((l) => [l.n, false]));
const T8_09 = sec('09', 'Brauzer', (l) => !/tugadi/.test(l));
const T8_04 = sec('04', 'Terminal', (l) => /connect ·|GET \/admin|disconnect/.test(l)).slice(-3);
const T8_11 = sec('11', 'Brauzer', (l) => /Offline|kadr|GET \/admin|→ «/.test(l) && !/tugadi/.test(l)).slice(-5);
const T8_08 = outPick('08', (l) => /^Tests:|NATIJA/.test(l));
const S8 = mkS(8, [{ v: 'c' }, { v: 'sub' }, { v: '04' }, { v: '11' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'c' && <Code k="HTML" ids={{ ...rngIds(H.c0 - 1, H.c0 + 3, 'n'), ...rngIds(H.lo - 1, H.lo, 'o') }} from={H.c0 - 1} to={H.lo} focus={['n']} title="admin.html · ulan() · ws2-done" />}
    {seg.v === 'sub' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("admin.html · kirish va sahifa ochilishi · ws2-start → ws2-done", "admin.html · вход и открытие страницы · ws2-start → ws2-done")} lines={kod('HTML_START', Object.fromEntries(Object.keys(HS_EDIT).map((n) => [n, 'x'])), HS.s0, HS_END + 1, HS_EDIT)} focus={['x']} /><Term title={t("brauzer · noto'g'ri token (09, ws2-done)", "браузер · неверный токен (09, ws2-done)")} lines={T8_09} /></div>}
    {seg.v === '04' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="04-3" small label={t("ws2-done · server qayta yongach", "ws2-done · после перезапуска сервера")} /><Term title={t("VS Code terminali · npm run live (ws2-done)", "терминал VS Code · npm run live (ws2-done)")} lines={T8_04} /></div>}
    {seg.v === '11' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="11-3" small label={t("ws2-done · Offline 60 s, Online'dan keyin", "ws2-done · Offline 60 с, после Online")} /><Term title={t("panel logi (11)", "лог панели (11)")} lines={T8_11} /><Term title={t("npm test · npm run smoke (08) — server kodi o'zgarmagan", "npm test · npm run smoke (08) — код сервера не менялся")} lines={T8_08} /></div>}
  </>} />;
}

// ============================================================
//  9 · Amaliyot 1 — Offline bilan buzish va tuzatish
// ============================================================
const P9 = mkPractice(9, [[], [0, 1], [2, 3], []], {
  code: [{ step: 3, file: F.html, lines: kod('HTML', rngIds(H.c0 - 1, H.c0 + 3, 'n'), H.c0 - 1, H.lo) }],
});
function ScreenP9(p) { return <Practice p={p} S={P9.S} steps={P9.steps} trouble={P9.trouble} proof={P9.proof} code={P9.code} tree={FILES()} />; }

// ============================================================
//  10 · Buzamiz: tinglovchi connect ichida (xato nusxa — 00b; ws2v2-out/06, 04)
// ============================================================
const X = { u0: lineN('HTML_XATO', /function ulan\(\)/), c0: lineN('HTML_XATO', /ulanish\.on\('connect'/) };
X.bad = lineN('HTML_XATO', /ulanish\.on\('order-changed'/, X.c0);
X.end = lineN('HTML_XATO', /^\s+\}\);$/, X.bad);
const CAUSE10 = ["connect — birinchi ulanishda HAM har qayta ulanishda ishlaydi", "ichidagi ulanish.on(…) har safar YANGI tinglovchi qo'shadi, eskisi o'chmaydi", "ikki qayta ulanishdan keyin — uchta tinglovchi: bitta hodisaga uchta GET", "connect ichida — faqat bir martalik ish (yukla()); tinglovchi bir marta, tashqarida"];
const S10 = mkS(10, [{ v: 'code' }, { v: 'net' }, { v: 'two' }, { v: 'cause' }]);
function Screen10(p) {
  const code = <CodePanel file={t("admin.html · xato nusxa (tinglovchi connect ichida)", "admin.html · копия с ошибкой (слушатель внутри connect)")} lines={kod('HTML_XATO', { [X.bad]: 'x', ...rngIds(X.c0, X.c0 + 2, 'c') }, X.c0, X.end)} focus={['x']} />;
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'code' && <Ide files={compact(FILES(), F.html)} active={F.html}>{code}</Ide>}
    {seg.v === 'net' && <div style={{ display: 'grid', gap: 8 }}>{code}<NetList k="06" /></div>}
    {seg.v === 'two' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="06-2" small label={t("xato nusxa · 1 qayta ulanishdan keyin", "копия с ошибкой · после 1 переподключения")} /><PanelView k="04-3" small label={t("ws2-done · to'g'ri kod", "ws2-done · правильный код")} /></div>}
    {seg.v === 'cause' && <div style={{ display: 'grid', gap: 10 }}><NetList k="06" /><Cause items={CAUSE10} on={4} bad={1} /></div>}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck: connect ichidagi ulanish.on (xato nusxa)
// ============================================================
const LC11 = KOD.HTML_XATO.lines.filter((l) => l.n >= X.u0 && l.n <= X.end).map((l) => ({ h: tsLine(l.t), n: l.n }));
const HD = { u0: lineN('HTML', /function ulan\(\)/) };
const LC11_FIXED = KOD.HTML.lines.filter((l) => l.n >= HD.u0 && l.n <= H.lo).map((l) => ({ h: tsLine(l.t), n: l.n, ...(l.n >= H.lo - 1 ? { neu: true } : {}) }));
const NET11 = netGroups('06').map((g) => ({ h: liveLine(`order-changed #${g.id} · ${g.rc === 0 ? 'birinchi ulanish' : g.rc + ' qayta ulanishdan keyin'} → GET ×${g.n}`) }));
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={t("admin.html · ulan() · xato nusxa", "admin.html · ulan() · копия с ошибкой")} lines={LC11} target={LC11.findIndex((l) => l.n === X.bad)}
    fixed={LC11_FIXED} fixedExtra={[{ file: t('Network · xato nusxa (06): bitta hodisaga GET soni', "Network · копия с ошибкой (06): число GET на одно событие"), lines: NET11 }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — Network'da GET sanash
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.html, lines: kod('HTML_XATO', { [X.bad]: 'x' }, X.c0, X.end), copy: false }],
});
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} code={P12.code} tree={FILES()} />; }

// ============================================================
//  13 · Tarmoq uzildi: panel boshqa kompyuterda (ws2v2-out/03, 05 — proksi)
// ============================================================
const FLOW13 = [['pn', 'Panel', "do'kon kompyuteri", C1.live], ['net', 'Tarmoq', 'proksi 3101 — kesiladi', T.accent], ['srv', 'Server 3100', 'bot va baza ishlaydi', T.green]];
const T13A = sec('03', 'Brauzer', (l) => !/tugadi|SURAT/.test(l));
const T13B = sec('05', 'Brauzer', (l) => !/tugadi|SURAT/.test(l));
const Q13A = sec('03', 'Qadamlar');
// F-1109-06: xulosa — uch karta o'rniga natijalar jadvali (uch usul × ws2-start / ws2-done, haqiqiy yurgizishlar 01–05, 11) va tarmoq sxemasi
function Res13() {
  const bz = <span className="bz">{t("buzildi", "сломалось")}</span>, tk = <span className="tk">{t("takrorlanmadi", "не повторилось")}</span>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Uch usul — oxirgi holat: panel ro'yxati va baza (haqiqiy yurgizishlar)", "Три способа — итоговое состояние: список панели и база (настоящие запуски)")}</p>
      <table className="z-tbl w2-r13"><tbody>
        <tr><th>{t("usul", "способ")}</th><th>ws2-start</th><th>ws2-done</th></tr>
        <tr><td>{t("server qayta yondi", "сервер перезапущен")}</td><td className="s">{t("ro'yxat: #1 · bazada 2 ta ", "список: #1 · в базе 2 ")}{bz}</td><td className="d">{t("ro'yxat: #2, #1 ", "список: #2, #1 ")}{tk}</td></tr>
        <tr><td>{t("brauzer Offline", "браузер Offline")}</td><td className="s">{t("ro'yxat: #1 — Offline paytidagi buyurtma yo'q ", "список: #1 — заказа, сделанного в Offline, нет ")}{bz}</td><td className="d">{t("ro'yxat: #2, #1 ", "список: #2, #1 ")}{tk}</td></tr>
        <tr><td>{t("tarmoq uzildi (proksi)", "обрыв сети (прокси)")}</td><td className="s">{t("ro'yxat: bo'sh · bazada #1 ", "список: пусто · в базе #1 ")}{bz}</td><td className="d">{t("ro'yxat: #1 ", "список: #1 ")}{tk}</td></tr>
      </tbody></table>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Tarmoq uzilishi — haqiqiy do'konda", "Обрыв сети — в настоящем магазине")}</p>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("Server · bot", "Сервер · бот")}</b><span className="z-mut">{t("Render'da — ishlayveradi", "на Render — продолжает работать")}</span></div>
        <div className="z-ar bad">✕</div>
        <div className="z-st bad"><b>{t("Do'kon Wi-Fi", "Wi-Fi магазина")}</b><span className="z-mut">{t("uzildi — proksi bilan modellashtirildi", "оборвался — смоделировано прокси")}</span></div>
        <div className="z-ar bad">✕</div>
        <div className="z-st"><b>{t("Panel", "Панель")}</b><span className="z-mut">{t("do'kon kompyuterida", "на компьютере магазина")}</span></div>
      </div>
    </div>
    <div className="z-rule">{t("Usul uch xil, ", "Способа три, ")}<b>{t("sabab bitta", "причина одна")}</b>{t(": qayta ulanish — yangi ulanish, hodisa o'tib ketgan. Bitta tuzatish uchalasini yopdi.", ": переподключение — новое соединение, событие уже прошло. Одно исправление закрыло все три.")}</div>
  </div>;
}
const S13 = mkS(13, [{ v: 'sx' }, { v: 'a' }, { v: 'b' }, { v: 'rule' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'sx' && <div style={{ display: 'grid', gap: 10 }}><Flow items={FLOW13} hl={['net']} /><Term title={t("qadamlar (03)", "шаги (03)")} lines={Q13A} /></div>}
    {seg.v === 'a' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="03-2" small label={t("ws2-start · tarmoq qaytgach", "ws2-start · после возврата сети")} /><Term title={t("panel logi (03, ws2-start)", "лог панели (03, ws2-start)")} lines={T13A} er /></div>}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="05-2" small label={t("ws2-done · tarmoq qaytgach", "ws2-done · после возврата сети")} /><Term title={t("panel logi (05, ws2-done)", "лог панели (05, ws2-done)")} lines={T13B} /></div>}
    {seg.v === 'rule' && <Res13 />}
  </>} />;
}

// ============================================================
//  14 · connectionStateRecovery: tiklaydi, lekin hammasini emas (ws2v2-out/07)
// ============================================================
const DEC14 = lineN('GATEWAY_TIKLASH', /@WebSocketGateway\(/);
const K7 = secRaw('07', 'Klient');
const C7 = K7.map((l, i) => (/connect ·/.test(l) ? i : -1)).filter((i) => i >= 0);
const K7A = K7.slice(0, C7[1] + 1).map((l) => ({ h: liveLine(l) }));
const K7B = K7.slice(C7[1] + 1, C7[2] + 1).map((l) => ({ h: liveLine(l) }));
const K7C = K7.slice(C7[2] + 1).map((l) => ({ h: liveLine(l) }));
const Q7 = secRaw('07', 'Qadamlar');
const qd = (re) => Q7.filter((l) => re.test(l)).map((l) => ({ h: liveLine(l) }));
// F-1109-06: xulosa — ikki karta o'rniga uch tajriba × ikki mexanizm jadvali (ws2v2-out/07 klient logi)
function Rec14() {
  const y = <td className="c y">✓</td>, n = <td className="c n">✕</td>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("connectionStateRecovery (2 daqiqa) — uch tajriba, klient logi", "connectionStateRecovery (2 минуты) — три опыта, лог клиента")}</p>
      <table className="z-tbl w2-r14"><tbody>
        <tr><th>{t("holat", "случай")}</th><th>{t("klient ko'rdi", "клиент увидел")}</th><th className="c">{t("tiklash", "восстановление")}</th><th className="c">{t("connect da qayta so'rash", "повторный запрос при connect")}</th></tr>
        <tr><td><b>B</b>{t(" · hodisa olgan, tarmoq uzildi, shu payt #3", " · получил событие, сеть оборвалась, в это время #3")}</td><td>21:41:47 order-changed {'{'}"orderId":3{'}'} → connect · <b>recovered=true</b>{t(" · id o'sha", " · id тот же")}</td>{y}{y}</tr>
        <tr><td><b>A</b>{t(" · hali hodisa olmagan, tarmoq uzildi", " · ещё не получал событий, сеть оборвалась")}</td><td>21:41:29 connect · <b>recovered=false</b>{t(" — o'tkazilgan buyurtma kelmadi", " — пропущенный заказ не пришёл")}</td>{n}{y}</tr>
        <tr><td><b>C</b>{t(" · server qayta yondi", " · сервер перезапущен")}</td><td>21:41:57 connect · <b>recovered=false</b>{t(" — holat server xotirasi bilan yo'qoldi", " — состояние пропало вместе с памятью сервера")}</td>{n}{y}</tr>
      </tbody></table>
    </div>
    <div className="z-two">
      <div className="z-card"><b>{t("Tiklash — qo'shimcha", "Восстановление — дополнительно")}</b><span className="z-mut">{t("qisqa tarmoq uzilishida yordam beradi", "помогает при коротком обрыве сети")}</span></div>
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}><b style={{ color: 'var(--ok)' }}>{t("Qayta so'rash — majburiy", "Повторный запрос — обязателен")}</b><span className="z-mut">{t("server qayta yonishi eng ko'p uchraydi: deploy, xato. ws2-done da gateway o'zgarmadi.", "перезапуск сервера случается чаще всего: deploy, ошибка. В ws2-done gateway не менялся.")}</span></div>
    </div>
  </div>;
}
const S14 = mkS(14, [{ v: 'code' }, { v: 'b' }, { v: 'ac' }, { v: 'dec' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    {seg.v === 'code' && <CodePanel file={t("live.gateway.ts · tajriba nusxasi", "live.gateway.ts · копия для опыта")} lines={kod('GATEWAY_TIKLASH', { [DEC14]: 'r' }, DEC14 - 2, DEC14 + 1)} focus={['r']} />}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("qadamlar · B", "шаги · B")} lines={qd(/^\S+ — B\)/)} /><Term title={t("klient · B — oldin hodisa olgan, keyin tarmoq uzildi", "клиент · B — получил событие, потом сеть оборвалась")} lines={K7B} /></div>}
    {seg.v === 'ac' && <div className="pg-two"><Term title={t("A — klient hali hodisa olmagan", "A — клиент ещё не получал событий")} lines={K7A} er /><Term title={t("C — server qayta yondi", "C — сервер перезапустился")} lines={K7C} er /></div>}
    {seg.v === 'dec' && <Rec14 />}
  </>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — tiklash va server qayta yonishi (07 C)
// ============================================================
function Screen15(p) {
  return MC(p, 15, {
    above: <Term title={t("klient · tiklash yoqilgan, server qayta yondi (07 C)", "клиент · восстановление включено, сервер перезапустился (07 C)")} lines={K7C} />,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("qadamlar · C", "шаги · C")} lines={qd(/C\)|qayta ishga tushirildi/)} /><Term title={t("klient · C", "клиент · C")} lines={K7C} er /></div>,
  });
}

// ============================================================
//  16 · Amaliyot 3 — npm run live va buzish yozuvi (live-client.js, BUZISH.md ws2-done)
// ============================================================
const CL = { r0: lineN('CLIENT', /async function royxat\(\)/), c0: lineN('CLIENT', /^s\.on\('connect'/) };
CL.end = lineN('CLIENT', /^\}\);$/, CL.c0);
const BZ = { a: lineN('BUZISH', /^\| № \|/), b: lineN('BUZISH', /^\| 3 \|/) };
const P16 = mkPractice(16, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.cli, lines: kod('CLIENT', {}, CL.r0 - 1, CL.end) }, { step: 3, file: F.buz, lines: kod('BUZISH', {}, BZ.a, BZ.b), copy: false }],
});
function ScreenP16(p) { return <Practice p={p} S={P16.S} steps={P16.steps} trouble={P16.trouble} proof={P16.proof} code={P16.code} tree={FILES()} />; }
// ============================================================
//  17 · AI tuzatdi — ikki javob (ws2v2-ai/*/00-javob.md, diff)
// ============================================================
// F-1109-06: xulosa — ikki iqtibos o'rniga taqqoslash jadvali (ws2v2-ai/XULOSA.md) va xulosa qoidasi
function Cmp17() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Prompt: buyurtmachining shikoyati — ishorasiz", "Промпт: жалоба заказчика — без подсказок")}</p>
      <table className="z-tbl w2-a2"><tbody>
        <tr><th /><th>1-AI</th><th>2-AI</th></tr>
        <tr><td>{t("Sabab", "Причина")}</td><td>{t("topdi", "нашёл")} <span className="g">{t("to'g'ri", "верно")}</span>{t(" — «ulanish yo'q paytda yuborilgan hodisa hech kimga yetmaydi»", " — «событие, отправленное без соединения, никому не доходит»")}</td><td>{t("topdi", "нашёл")} <span className="g">{t("to'g'ri", "верно")}</span></td></tr>
        <tr><td>{t("Tuzatish", "Исправление")}</td><td>connect → holatQoy + yukla()</td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr><td>{t("O'zgargan", "Изменено")}</td><td>admin.html, README.md (+22/−3)</td><td>admin.html (+8/−1)</td></tr>
        <tr><td>{t("Qo'shimcha", "Дополнительно")}</td><td>{t("so'rov raqami — eski javob yangisini bosmasin", "номер запроса — старый ответ не перекроет новый")}</td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("Tinglovchi", "Слушатель")}</td><td>{t("connect ichiga ko'chirilmadi", "не перенесён внутрь connect")} <span className="f">{t("10-ekrandagi tuzoq", "ловушка с экрана 10")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("O'z sinovi", "Своя проверка")}</td><td>{t("headless Chrome, baza o'rniga JSON fayl", "headless Chrome, вместо базы JSON-файл")} <span className="f">{t("bazasiz", "без базы")}</span></td><td>jsdom <span className="f">{t("bazasiz", "без базы")}</span>{t(" · sinov papkasi loyihadan tashqarida", " · папка проверки вне проекта")}</td></tr>
      </tbody></table>
    </div>
    <div className="z-rule">{t("Ikkalasi «eski javob yangisini bosmasin» himoyasini ", "Оба добавили защиту «старый ответ не перекроет новый» ")}<b>{t("o'zi qo'shdi", "сами")}</b>{t(" — lekin ", " — но проверяли ")}<b>{t("haqiqiy bazasiz", "без настоящей базы")}</b>{t(" sinagan.", ".")}</div>
  </div>;
}
const S17 = mkS(17, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'quote' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("da'vo, uch usul, tuzatish, takror tinglovchi, tiklash", "утверждение, три способа, исправление, повторный слушатель, восстановление")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI tuzatadi, siz qabul qilasiz", "Этап 5 · исправляет AI, вы принимаете")}</h4><p>{t("shikoyat → ikki tuzatish → haqiqiy bazada sinov", "жалоба → два исправления → проверка на настоящей базе")}</p></div>
    </div>}
    {seg.v === 'prompt' && <div style={{ marginTop: 10 }}><AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: connect, qayta so'rash, tinglovchi yo'q", "без подсказок: нет connect, повторного запроса, слушателя")} /></div>}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<>{KOD.AI.ai1.stat} · <code>connect</code> → <code>holatQoy</code> + <b><code>yukla()</code></b>{t(" · so'rov raqami (", " · номер запроса (")}<code>soroqRaqami</code>{t(") — faqat oxirgi javob chiziladi · ", ") — рисуется только последний ответ · ")}<code>try/catch</code>{t(" tarmoq xatosida · README'ga bir qator", " при ошибке сети · одна строка в README")}</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<>{KOD.AI.ai2.stat} · <code>connect</code> → <code>holatQoy</code> + <b><code>yukla()</code></b>{t(" · so'rov raqami (", " · номер запроса (")}<code>sorovSoni</code>{t(") · tinglovchi joyida qoldi", ") · слушатель остался на месте")}</>} />
    </div>}
    {seg.v === 'quote' && <Cmp17 />}
  </>} />;
}

// ============================================================
//  18 · AI tuzatishlari haqiqiy bazada (ws2v2-ai/*/01, ai1/01a, ai1 diff)
// ============================================================
const DIFF18 = KOD.AI.ai1.diff.split('\n').filter((l) => /soroqRaqami|const men|men !== /.test(l)).map((l) => ({ h: liveLine(l) }));
const P18A = L1A.filter((l) => /brauzer: (WebSocket|kadr)/.test(l)).slice(-3).map((l) => ({ h: liveLine(ms(l)) }));
const FOUR18 = ["Ro'yxat connect'da so'raladimi?", 'Tinglovchi bittami — connect dan tashqaridami?', 'Sinovda xato haqiqatan yuz berdimi — eski kod yiqildimi?', "Nima ortiqcha qo'shildi — kerakmi?"];
const S18 = mkS(18, [{ v: 'two' }, { v: 'diff' }, { v: 'luck' }, { v: 'four' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'two' && <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'grid', gap: 6 }}><PanelView k="ai1-3" small label={t("1-AI · server qayta yongach", "1-й AI · после перезапуска сервера")} /><Term title="1-AI" lines={jt(lastLine('ai1', /^## Navbatdagi/).replace(/^## /, ''))} /></div>
      <div style={{ display: 'grid', gap: 6 }}><PanelView k="ai2-3" small label={t("2-AI · server qayta yongach", "2-й AI · после перезапуска сервера")} /><Term title="2-AI" lines={jt(lastLine('ai2', /^## Navbatdagi/).replace(/^## /, ''))} /></div>
    </div>}
    {seg.v === 'diff' && <CodePanel file={t("1-AI · admin.html · git diff (so'rov raqami)", "1-й AI · admin.html · git diff (номер запроса)")} lines={DIFF18} />}
    {seg.v === 'luck' && <Term title={t("1-AI nusxasi · birinchi urinish — panel buyurtmadan oldin ulandi (01a)", "копия 1-го AI · первая попытка — панель подключилась до заказа (01a)")} lines={[...P18A, { h: liveLine(t('# hodisa oddiy yo\'l bilan keldi — xato yuz bermagan, eski kod ham o\'tardi', "# событие пришло обычным путём — ошибки не было, старый код тоже прошёл бы")) }]} />}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI'ning qayta ulanish tuzatishini qabul qilish — to'rt savol", "Приём исправления переподключения от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR18.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — hodisa kelgan sinov (ai1/01a — bizning birinchi sinovimiz)
// ============================================================
function Screen19(p) {
  return MC(p, 19, {
    above: <Term title={t("panel logi · 1-AI nusxasi, birinchi urinish (01a)", "лог панели · копия 1-го AI, первая попытка (01a)")} lines={P18A} />,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("qayta sinov — buyurtma panel ulanishidan oldin (ai1/01)", "повторная проверка — заказ до подключения панели (ai1/01)")} lines={jt(lastLine('ai1', /^## Navbatdagi/).replace(/^## /, ''))} /><PanelView k="ai1-3" small label={t("1-AI · qayta sinov", "1-й AI · повторная проверка")} /></div>,
  });
}

// ============================================================
//  20 · m10-05 xaritasi (BreakAndFixLesson.jsx — SCREEN_META 19)
// ============================================================
const BLOK20 = [['1 Kirish', "s0 «bajardim» — da'vo · s1 reja", "README «o'zi yangilanadi» (3-ekran)"], ['2 Uch muammo', 's2–s3 uzilish · s4–s5 takror · s6–s7 xona', '4, 10-ekran; xona — 21-ekran'], ['3 Tinglovchi', 's8 kod oynasi', "connect ichidagi on (11-ekran)"], ['4 Yozuv va qayta tekshiruv', 's9 yozuv · s10 test · s11 qayta tekshiruv · s12 mustaqil', "shu urinishda (3) · hodisa kelgan urinish — isbot emas (19)"], ['5 Amaliyot', "A1 o'z ilovasini buzish · A2 agentga tuzattirish", '22-ekran']];
const S20 = mkS(20, [{ v: 'cards' }, { v: 'cards', three: true }, { v: 'blok' }, { v: 'teg' }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m10-05 (19 ekran)", "Ученик · m10-05 (19 экранов)")} hl><p><b>Maydon Jamoa</b>{t(" — agent «uchala chekka holatni bajardim» · uch usul: internetni uzish · fonga olish · Backend'ning yangi versiyasi · buzish yozuvi · tuzatish ", " — агент «выполнил все три крайних случая» · три способа: отключить интернет · уход в фон · новая версия Backend · запись поломки · исправление в ")}<code>ulanish.ts</code>{t(" da", "")}</p>{seg.three && <p style={{ marginTop: 6 }}><b>{t("Uch muammo:", "Три проблемы:")}</b>{t(" son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam", " число старое · живое сообщение дважды · «Hozir ko'ryapti» меньше")}</p>}</Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest: da'vo · uch usul · ", "OrderBotNest: утверждение · три способа · ")}<code>connect</code>{t(" da qayta so'rash · takror tinglovchi · tiklash · AI", " : повторный запрос · повторный слушатель · восстановление · AI")}</p></Card>
    </div>}
    {seg.v === 'blok' && <table className="pg-dict"><tbody>{BLOK20.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>}
    {seg.v === 'teg' && <div className="pg-two"><Card c={T.ink3} h="m12-dars-05-start"><p>kod = <code>m12-dars-04-done</code>{t(" — agent «bajardim» degan holat; tinglovchi ", " — состояние, когда агент сказал «выполнил»; слушатель внутри ")}<code>connect</code>{t(" ichida", " ")}</p></Card><Card c={T.green} h="m12-dars-05-done"><p><code>BUZISH.md</code>{t(" + tuzatish ", " + исправление ")}<code>mobil/src/ulanish.ts</code>{t(" da; Backend o'zgarmagan", " ; Backend не менялся")}</p></Card></div>}
  </>} />;
}

// ============================================================
//  21 · Maydon Jamoa'dagi uchinchi muammo — xona (manba/ws2-out/05, 06; ulanish.ts m12-dars-05)
// ============================================================
const MJ5 = KOD.OUT.mj05.split('\n').filter((l) => l.trim() && !/^#/.test(l));
const mjl = (L) => L.map((l) => ({ h: liveLine(l.replace(/^\s+/, '')) }));
const MJ5A = mjl(MJ5.slice(0, MJ5.findIndex((l) => /yangi versiyasi/.test(l))));
const MJ5B = mjl(MJ5.slice(MJ5.findIndex((l) => /yangi versiyasi/.test(l))).filter((l) => !/io client disconnect/.test(l)));
const MJ6 = mjl(KOD.OUT.mj06.split('\n').filter((l) => l.trim() && !/^#|^\$|io client disconnect/.test(l)).slice(-7));
const MJC = lineN('MJ_UL', /ulanish\.on\('connect'/);
const MJC_END = lineN('MJ_UL', /^\s+\}\);$/, MJC);
const ROWS21 = [["Son eski (uzilishdagi hodisa)", "bor — 4, 6, 13-ekran", "bor — s2–s3"], ['Takror tinglovchi', "tuzatishdagi tuzoq — 10-ekran", "boshidan bor — s4–s5"], ['Xona («Hozir ko\'ryapti»)', "yo'q — panel hammaga bitta hodisa oladi", "bor — s6–s7"]];
const S21 = mkS(21, [{ v: 'a' }, { v: 'b' }, { v: 'fix' }, { v: 'tab' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("maydon-jamoa · m12-dars-05-start · Backend haqiqiy (05)", "maydon-jamoa · m12-dars-05-start · настоящий Backend (05)")} lines={MJ5A} />}
    {seg.v === 'b' && <Term title={t("maydon-jamoa · yangi versiyadan keyin (05)", "maydon-jamoa · после новой версии (05)")} lines={MJ5B} er />}
    {seg.v === 'fix' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="maydon-jamoa · mobil/src/ulanish.ts · m12-dars-05-done" lines={kod('MJ_UL', rngIds(MJC + 1, MJC_END - 1, 'f'), MJC, MJC_END)} focus={['f']} /><Term title={t("tuzatilgan (06)", "исправлено (06)")} lines={MJ6} /></div>}
    {seg.v === 'tab' && <table className="c1-res"><thead><tr><th>{t("Muammo", "Проблема")}</th><th>OrderBotNest</th><th>{t("Maydon Jamoa (o'quvchi)", "Maydon Jamoa (ученик)")}</th></tr></thead><tbody>{ROWS21.map((r) => <tr key={r[0]}>{r.map((x, i) => <td key={i}>{x}</td>)}</tr>)}</tbody></table>}
  </>} />;
}

// ============================================================
//  22 · A1 va A2 — o'quvchi o'z ilovasini buzadi (BreakAndFixLesson ScreenA1, ScreenA2)
// ============================================================
const A1_22 = [["Uchish rejimi", "«Ulanmoqda…» kuting (bir daqiqagacha) → agent o'zgarish qiladi → uchish rejimini o'chiring"], ['Fonga olish', "boshqa ilovaga o'ting → o'zgarish → bir daqiqadan keyin qayting"], ["Render'da qayta chiqarish", "«Manual Deploy» → «Deploy latest commit» — bir necha daqiqa (⚠ sinalmagan)"]];
const A2_22 = [['Qayerda', 'mobil/src/ulanish.ts va undan foydalanadigan ekran'], ['Nima qilsin', "yozuvdagi «buzildi» qatorlari bo'yicha tuzatish"], ['Nima buzilmasin', "Backend, mavjud hodisa nomlari"]];
const S22 = mkS(22, [{ v: 'a1' }, { v: 'fly' }, { v: 'render' }, { v: 'a2' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {(seg.v === 'a1' || seg.v === 'render') && <div className="pg-three">{A1_22.map(([h, tx], i) => <Card key={h} c={seg.v === 'render' && i === 2 ? T.accent : T.blue} h={`${i + 1} · ${h}`} hl={seg.v === 'render' && i === 2} dim={seg.v === 'render' && i !== 2}><p>{tx}</p></Card>)}</div>}
    {seg.v === 'fly' && <div className="pg-two"><Card c={T.blue} h={t("O'quvchi · uchish rejimi", "Ученик · режим полёта")}><p>{t("«bir daqiqagacha kuting» — erta qaytsa «buzilmadi»", "«подождите до минуты» — если вернуться рано, «buzilmadi»")}</p></Card><Card c={T.accent} h={t("Siz · Offline (6-ekran)", "Вы · Offline (экран 6)")} hl><p>{t("6 s — buzilmadi · 60 s — buzildi: ping 25 + 20 s", "6 s — не сломалось · 60 s — сломалось: ping 25 + 20 s")}</p></Card></div>}
    {seg.v === 'a2' && <div style={{ display: 'grid', gap: 8 }}><div className="pg-three">{A2_22.map(([h, tx]) => <Card key={h} c={C1.ai} h={h}><p>{tx}</p></Card>)}</div><div className="mk-rule">{t("Agentning «tuzatdim»i ham ", "«Исправил» от агента — тоже ")}<b>{t("da'vo", "утверждение")}</b>{t(" — «buzildi» urinishlari xuddi shu usul bilan qaytariladi.", " — попытки «buzildi» повторяются тем же способом.")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const CARDS23 = [["Belgi «Ulangan», son eski", 'uzilishdan keyin', "connect da qayta so'rash yo'q"], ['Jonli xabar ikki marta', 'qayta ulanishdan keyin', 'tinglovchi connect ichida'], ["«Hozir ko'ryapti» kam", 'yangi versiyadan keyin', "xonaga qayta kirish yo'q"], ['Hamma urinish «buzilmadi»', 'uchish rejimi qisqa yoki Expo Go qayta yuklagan ⚠', 'bir daqiqa kuting; bu ham natija'], ['«Ulanmoqda…» uzoq', 'Render qayta chiqyapti ⚠', 'bir necha daqiqa'], ['Agent «tuzatdim» dedi', 'qayta tekshiruv qilinmagan', 'xuddi shu usul bilan qaytarish']];
const QA23 = [
  ["«Socket.io o'zi qayta ulanadi-ku, nega tuzatamiz?»", "Ulanishni tiklaydi, lekin o'tkazib yuborilgan hodisani va xonani tiklamaydi."],
  ["«Server o'tkazilgan hodisani o'zi qayta bersa bo'lmaydimi?»", "socket.io'da connectionStateRecovery bor, lekin u server xotirasida: yangi versiya chiqqanda yo'q. Qayta so'rash baribir kerak."],
  ['«Tinglovchi ikki marta bo\'lsa, nima yomon?»', "Har o'zgarish ikki marta so'raladi, jonli xabar ikki marta chiqadi; har qayta ulanishda yana ko'payadi."],
  ["«Backend'ni tuzatish kerakmi?»", "Yo'q: uchala tuzatish ilovada (ulanish.ts)."],
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: qayta ulanish, uzilishdagi hodisa, tuzatish, takror tinglovchi, Offline, tiklash va AI sinovi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi yoki agent bajardim desa, u bilan birga xuddi shu usul bilan buzib ko'rasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'q', t: "socket.io ulanishni o'zi tiklaydi, lekin bu yangi ulanish: uzilish paytida yuborilgan hodisa unga kelmaydi — server hodisani faqat hozir ulanganlarga beradi", st: ['q'] },
  { k: 'bz', t: "«O'zi yangilanadi» — da'vo; tekshiruv — buzib ko'rish va yozuv: usul · nima qildim · nima kutdim · nima bo'ldi → belgi (shu kompyuterda, shu urinishda)", st: ['bz'] },
  { k: 'm3', t: "Uch usul, bitta sabab: server qayta yonishi (Telegram navbati panel ulanishidan tez), Offline ping vaqtidan uzun (60 s buziladi, 6 s — yo'q), tarmoq uzilishi", st: ['bz'] },
  { k: 'fx', t: "Tuzatish: connect ichida yukla() — birinchi va har qayta ulanishda ro'yxat bazadan; tinglovchi bir marta, connect dan tashqarida (ichida — takror GET)", st: ['fx'] },
  { k: 'rc', t: "connectionStateRecovery — qisqa tarmoq uzilishida yordam beradi; server qayta yonganda va hodisa olmagan klientda — yo'q. Qayta so'rash majburiy, tiklash — qo'shimcha", st: ['rc'] },
  { k: 'ai', t: "AI tuzatishiga to'rt savol: qayerda so'raydi · tinglovchi nechta · sinovda eski kod yiqildimi · nima ortiqcha qo'shildi; hodisa kelgan urinish — isbot emas", st: ['ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + admin paneli); har band rasmning o'z qismini yoritadi
const NOTE2 = { get orders() { return t("#2 bazada, panelda yo'q", '#2 в базе, в панели нет'); } };
const MAP25 = {
  q: { on: ['telegram', 'orders', 'db'], note: NOTE2, jest: PNL(() => [['transport close', 'bad'], [t('qayta ulandi', 'переподключился'), 'ok']], 'fail', 'Ulangan') },
  bz: { on: ['telegram', 'orders', 'db'], note: NOTE2, jest: PNL([['Offline', 'bad'], ['Ulanmoqda…', '']], 'fail', 'Ulanmoqda…') },
  m3: { on: ['telegram', 'orders', 'db'], note: NOTE2, jest: PNL(() => [['restart', 'bad'], ['Offline', 'bad'], [t('tarmoq', 'сеть'), 'bad']], 'fail', 'Ulangan') },
  fx: { on: LIVE_ON, jest: PNL(() => [['connect → yukla()', 'ok'], [t('tinglovchi bitta', 'один слушатель'), 'ok']], 'pass', 'Ulangan') },
  rc: { on: ['telegram'], jest: PNL([['connectionStateRecovery', 'ok'], ['yukla()', 'ok']], 'pass', 'Ulangan') },
  ai: { on: LIVE_ON, jest: PNL([['connect → yukla()', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.fx;
  return <div className="mk-light" style={{ padding: '8px 14px' }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — uzilishdan keyin panel ro'yxatni bazadan qayta so'raydi", 'Сегодняшний урок — после обрыва панель заново запрашивает список из базы')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "Holat — Offline («Ulanmoqda…» bo'lguncha) → admin botda /orders dan tasdiqlaydi → Online: «Tasdiqlandi» ko'rindimi", c: [] },
  { t: "Yozuv — BUZISH.md ga yangi qator: usul · nima qildim · kutdim · bo'ldi · belgi", c: [] },
  { t: "Klient — scripts/live-client.js: connect da recovered qiymatini chiqaring", c: ['console.log(`connect · recovered=${s.recovered}`)'] },
  { t: "Tiklash — gateway'ga connectionStateRecovery: tarmoq uzilishi va server qayta yonishida recovered — ikki qator", c: ['@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })'] },
  { t: "Topshirish — README «Qayta ulanish» ga qaroringiz (bir gap) → git push → repo linki platformaga", c: ['git add . && git commit -m "qayta ulanish: holat va tiklash sinovi"', 'git push'] },
];
const CHEATSHEET25 = `# WebSocket: ulanish uzilsa — mentor eslatmasi (OrderBotNest)
## Loyiha
git fetch --tags · git checkout ws2-start (= ws1-done) → ws2-done (public/admin.html, scripts/live-client.js, BUZISH.md) · npm run start:dev → http://localhost:3000/admin · npm run live
## Umumiy tushuncha
socket.io ulanishni o'zi tiklaydi — bu YANGI ulanish · server.emit faqat hozir ulanganlarga · uzilish paytidagi hodisa keyin kelmaydi · ro'yxat bazada → har connect da qayta so'rash
## Buzish yozuvi (BUZISH.md)
№ · Usul · Nima qildim · Nima kutdim · Nima bo'ldi · Belgi (buzildi / buzilmadi) · Tuzatish · Qayta tekshiruv — «nima bo'ldi» = ko'rgan narsa; «buzilmadi» — shu urinishda, isbot emas
## Uch usul
server qayta yondi (Ctrl+C → start; Telegram navbatidagi xabar panel ulanishidan oldin bajariladi) · DevTools → Network → Offline: 6 s — buzilmaydi (kadr Online'da keladi), 60 s — buziladi (~33–40 s da «Ulanmoqda…») · tarmoq uzildi (panel boshqa kompyuterda)
## Tuzatish (admin.html)
ulanish.on('connect', () => { holatQoy('ulangan'); yukla(); }) · alohida yukla() olib tashlandi — ro'yxat ikki joyda: connect va order-changed · ulanish.on('order-changed', () => yukla()) — BIR MARTA, connect dan tashqarida
## Tuzoq
tinglovchi connect ichida → har qayta ulanishda yana bittasi: bitta hodisaga 1 → 2 → 3 GET (F12 → Network, filtr orders), sariq belgi yo'qoladi
## connectionStateRecovery
@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } }) · tarmoq qisqa uzilsa: recovered=true, o'tkazilgan hodisa keladi · server qayta yonsa yoki klient hodisa olmagan bo'lsa: recovered=false · qayta so'rash majburiy, tiklash — qo'shimcha
## AI tuzatishiga to'rt savol
ro'yxat connect da so'raladimi · tinglovchi bittami, tashqaridami · sinovda xato yuz berdimi (eski kod yiqildimi) · nima ortiqcha qo'shildi (so'rov raqami — zararsiz)
## Sinfga tayyorgarlik (m10-05, 19 ekran)
Maydon Jamoa: agent «bajardim» — da'vo · uch usul: internetni uzish · fonga olish · Backend yangi versiyasi · uch muammo: son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam (xona — uzilganda chiqadi, qayta kirish kerak) · tuzatish ulanish.ts da, Backend o'zgarmaydi · m12-dars-05-start → done
## Sinfdagi holatlar
son eski → qayta so'rash yo'q · xabar ikki marta → tinglovchi connect ichida · «Hozir ko'ryapti» kam → xonaga qaytish yo'q · hammasi «buzilmadi» → uchish rejimi qisqa / Expo Go · Render uzoq · agent «tuzatdim» → xuddi shu usul bilan qaytarish
## Sizning uyga vazifangiz (40–60 daqiqa)
holat o'zgarishini Offline bilan buzish · BUZISH.md qatori · live-client'da recovered · tiklash — ikki holat · README qarori · repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Qayta ulanish — <b>yangi ulanish</b>; uzilishdagi hodisa kelmaydi", "Birinchi: socket.io ulanishni o'zi tiklaydi, lekin bu yangi ulanish. Server hodisani faqat hozir ulanganlarga yuboradi, uzilish paytidagisi keyin kelmaydi.", { hl: 'q' }),
  sg('b2', "«O'zi yangilanadi» — <b>da'vo</b>; tekshiruv — buzish yozuvi", "Ikkinchi: o'zi yangilanadi degan gap da'vo. Tekshiruv buzib ko'rish va har urinishni yozish: usul, nima qildim, nima kutdim, nima bo'ldi va belgi.", { hl: 'bz' }),
  sg('b3', "<b>Uch usul, bitta sabab</b>: qayta yonish, Offline, tarmoq", "Uchinchi: uch usul. Server qayta yonadi, Telegram navbati panel ulanishidan tez. Offline ping vaqtidan uzun, bir daqiqa. Tarmoq uziladi. Sabab bitta: hodisa o'tib ketgan.", { hl: 'm3' }),
  sg('b4', "Tuzatish: <b>connect ichida yukla()</b>; tinglovchi — tashqarida", "To'rtinchi: tuzatish connect ichida yukla, har ulanishda ro'yxat bazadan. Tinglovchi bir marta, connect'dan tashqarida, aks holda har qayta ulanishda yana bittasi qo'shiladi.", { hl: 'fx' }),
  sg('b5', "Tiklash — <b>qo'shimcha</b>; qayta so'rash — majburiy", "Beshinchi: connection state recovery qisqa tarmoq uzilishida yordam beradi. Server qayta yonganda esa holat yo'qoladi. Shuning uchun qayta so'rash majburiy, tiklash faqat qo'shimcha.", { hl: 'rc' }),
  sg('b6', "AI tuzatishiga <b>to'rt savol</b>: xato haqiqatan yuz berdimi", "Oltinchi: AI tuzatishiga to'rt savol. Qayerda so'raydi, tinglovchi nechta, sinovda eski kod yiqildimi, nima ortiqcha qo'shildi. Hodisa kelgan urinish isbot emas.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: holat o'zgarishini buzing; tiklashni sinang", "Uyga vazifa: holat o'zgarishini ham buzib tekshiring. Offline paytida admin buyurtmani tasdiqlasin, keyin Online. Natijani buzish yozuviga qator qilib yozing.", { hl: 'hw' }),
  sg('hw2', "Klientda <b>recovered</b>, gateway'da tiklash — ikki holat; qaror README'ga", "Keyin terminal klientiga recovered qiymatini qo'shing, gateway'da tiklashni yoqing va tarmoq uzilishi hamda server qayta yonishida natijani yozing. Qaroringizni README'ga, linkni platformaga. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: uch usul, tuzatish, tuzoq, tiklash, AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: umumiy tushuncha, buzish yozuvi, uch usul, tuzatish va tuzoq, tiklash chegarasi, AI'ga to'rt savol, m10-05 xaritasi va sinfdagi holatlar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('websocket-qayta-ulanish-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" yozuvda «Nima bo'ldi» — ko'rgani · ", " в записи «Что было» — увиденное · ")}<code>recovered</code>{t(" qiymati ikki holatda · qaror sababi bilan · ", " значение в двух случаях · решение с причиной · ")}<code>connect</code>{t(" da qayta so'rash o'chirilmagan.", " повторный запрос в connect не удалён.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("Webhook", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("To'lov xabari: imzo, takror va rad", RS('NEXT_D'))}</div></div>
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
          {t(["«o'zi yangilanadi» da'vosini buzib tekshirasiz: server qayta yonishi, Offline va tarmoq uzilishi", "connect ichida ro'yxatni qayta so'raysiz va takror tinglovchi xatosini taniysiz", "connectionStateRecovery nimaga yordam berishini va AI tuzatishini to'rt savol bilan tekshirasiz"], ['проверите заявление «обновляется само», ломая: перезапуск сервера, Offline и обрыв сети', 'заново запросите список внутри connect и узнаете ошибку повторного слушателя', 'поймёте, чем помогает connectionStateRecovery, и проверите исправление AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 12-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: WebSocket-1 darsi (jonli panel), Telegraf darsidagi bot tokeni va PostgreSQL, Chrome (DevTools), telefon, AI yordamchi · Loyiha: ws2-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 12-го экрана можно сделать перерыв · Нужно: урок WebSocket-1 (живая панель), токен бота и PostgreSQL из урока Telegraf, Chrome (DevTools), телефон, AI-помощник · Проект: тег ws2-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} {...S1M[0]} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, ScreenP16, Screen17, Screen18, Screen19, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = [ScreenP9, ScreenP12, ScreenP16].filter((S) => SCREENS.includes(S)).length; // 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi
export default function WsReconnectMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/ws2-*.json, ru/ws2-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/ws2-sahna.js) ---
// WebSocket-2 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
// Panel yorliqlari (Ulangan / Ulanmoqda…) — OrderBotNest admin.html ning haqiqiy matni, o'zgarmaydi.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Потерянный заказ', 'Повторный слушатель', 'Сеть и восстановление', 'AI', 'Подготовка к классу'] },
};
ru(FLOW2, [[null, null, '#1 видна', null], [null, 'Оборвалось', 'сервер выключен', null], [null, 'Заказ #2', 'order-changed → 0 панелей', null], [null, 'Переподключилась', 'новое соединение', null], [null, 'Список старый', 'только #1', null]]);
ru(METHODS3, [['Сервер перезапустился', 'deploy или ошибка — Ctrl+C и снова', null], ['Браузер Offline', null, null], ['Оборвалась сеть', 'панель на другом компьютере, сервер на Render', null]]);
ru(FLOW5, [[null, 'Сервер включился', null, null], [null, 'Бот взял очередь', 'launch → сообщение → #2', null], [null, null, '0 панелям', null], [null, 'Панель пытается', '1 → 2 → 4 → 5 с', null], [null, 'Подключилась', 'событие уже прошло', null]]);
ru(CAUSE10, ['connect срабатывает И при первом подключении, И при каждом переподключении', 'ulanish.on(…) внутри каждый раз добавляет НОВОГО слушателя, старый не удаляется', 'после двух переподключений — три слушателя: на одно событие три GET', 'внутри connect — только разовое дело (yukla()); слушатель один раз, снаружи']);
ru(FLOW13, [[null, 'Панель', 'компьютер магазина', null], [null, 'Сеть', 'прокси 3101 — режется', null], [null, 'Сервер 3100', 'бот и база работают', null]]);
ru(FOUR18, ['Запрашивается ли список в connect?', 'Слушатель один — снаружи connect?', 'Проявилась ли ошибка в проверке — упал ли старый код?', 'Что добавлено лишнего — нужно ли?']);
ru(BLOK20, [['1 Вступление', 's0 «выполнил» — утверждение · s1 план', 'README «обновляется сама» (экран 3)'], ['2 Три проблемы', 's2–s3 обрыв · s4–s5 повтор · s6–s7 комната', 'экраны 4, 10; комната — экран 21'], ['3 Слушатель', 's8 окно кода', 'on внутри connect (экран 11)'], ['4 Запись и повторная проверка', 's9 запись · s10 тест · s11 повторная проверка · s12 самостоятельно', 'в этой попытке (3) · попытка, где событие пришло, — не доказательство (19)'], ['5 Практика', 'A1 сломать своё приложение · A2 поручить агенту исправить', 'экран 22']]);
ru(ROWS21, [['Число старое (событие при обрыве)', 'есть — экраны 4, 6, 13', 'есть — s2–s3'], ['Повторный слушатель', 'ловушка в исправлении — экран 10', 'есть с самого начала — s4–s5'], ['Комната («Hozir ko\'ryapti»)', 'нет — панель получает одно событие для всех', 'есть — s6–s7']]);
ru(A1_22, [['Авиарежим', 'ждите «Ulanmoqda…» (до минуты) → агент делает изменение → выключите авиарежим'], ['Уход в фон', 'перейдите в другое приложение → изменение → вернитесь через минуту'], ['Повторный выпуск на Render', '«Manual Deploy» → «Deploy latest commit» — несколько минут (⚠ не проверено)']]);
ru(A2_22, [['Где', 'mobil/src/ulanish.ts и экран, который им пользуется'], ['Что сделать', 'исправление по строкам записи с отметкой «buzildi»'], ['Что не ломать', 'Backend, существующие имена событий']]);
ru(CARDS23, [['Знак «Ulangan», число старое', 'после обрыва', 'нет повторного запроса в connect'], ['Живое сообщение дважды', 'после переподключения', 'слушатель внутри connect'], ['«Hozir ko\'ryapti» меньше', 'после новой версии', 'нет повторного входа в комнату'], ['Все попытки «buzilmadi»', 'авиарежим короткий или Expo Go перезагрузил ⚠', 'подождите минуту; это тоже результат'], ['«Ulanmoqda…» долго', 'Render выпускается заново ⚠', 'несколько минут'], ['Агент сказал «исправил»', 'повторной проверки не было', 'повторить тем же способом']]);
ru(QA23, [
  ['«Socket.io же сам переподключается, зачем исправлять?»', 'Он восстанавливает соединение, но не пропущенное событие и не комнату.'],
  ['«А сервер не может сам заново отдать пропущенное?»', 'В socket.io есть connectionStateRecovery, но он в памяти сервера: при выходе новой версии его нет. Повторный запрос всё равно нужен.'],
  ['«Что плохого, если слушатель дважды?»', 'Каждое изменение запрашивается дважды, живое сообщение выходит дважды; с каждым переподключением их ещё больше.'],
  ['«Нужно ли исправлять Backend?»', 'Нет: все три исправления в приложении (ulanish.ts).'],
]);
ru(SUM25, [
  { t: 'socket.io сам восстанавливает соединение, но это новое соединение: событие, отправленное во время обрыва, до него не дойдёт — сервер шлёт событие только подключённым сейчас' },
  { t: '«Обновляется сама» — утверждение; проверка — поломка и запись: способ · что сделал · что ожидал · что было → отметка (на этом компьютере, в этой попытке)' },
  { t: 'Три способа, одна причина: перезапуск сервера (очередь Telegram быстрее подключения панели), Offline дольше ping (60 с ломается, 6 с — нет), обрыв сети' },
  { t: 'Исправление: yukla() внутри connect — при первом и каждом переподключении список из базы; слушатель один раз, снаружи connect (внутри — повторные GET)' },
  { t: 'connectionStateRecovery помогает при коротком обрыве сети; при перезапуске сервера и у клиента без событий — нет. Повторный запрос обязателен, восстановление — дополнение' },
  { t: 'Четыре вопроса к исправлению от AI: где запрашивает · сколько слушателей · упал ли старый код в проверке · что добавлено лишнего; попытка, где событие пришло, — не доказательство' },
]);
ru(HOMEWORK25, [
  { t: 'Статус — Offline (до «Ulanmoqda…») → админ подтверждает в боте через /orders → Online: видно ли «Tasdiqlandi»' },
  { t: 'Запись — новая строка в BUZISH.md: способ · что сделал · ожидал · было · отметка' },
  { t: 'Клиент — scripts/live-client.js: при connect выведите значение recovered' },
  { t: 'Восстановление — connectionStateRecovery в gateway: recovered при обрыве сети и при перезапуске сервера — две строки' },
  { t: 'Сдача — ваше решение в README «Qayta ulanish» (одно предложение) → git push → ссылка на репозиторий на платформу' },
]);
RU_S.TITLE = 'Если соединение оборвалось: ломаем и чиним';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–60 минут · 4 проверки · самопроверка 8 вопросов. После экрана 12 можно сделать перерыв', 'Нужно: урок для менторов WebSocket-1 (ваша копия OrderBotNest, живая панель) · токен бота и PostgreSQL с урока Telegraf · Chrome (DevTools) · телефон · AI-помощник', 'Проект: github.com/Azizbekcrypto/OrderBotNest — ws2-start (= ws1-done) → ws2-done; каждый вывод — с настоящих сервера, базы и браузера'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: переподключение, событие при обрыве, исправление, повторный слушатель, Offline, восстановление и проверка AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик или агент скажет «выполнил», вы вместе сломаете тем же способом.';
RU_S.NEXT_T = 'Webhook';
RU_S.NEXT_D = 'Сообщение об оплате: подпись, повтор и отказ';
RU_S.FILE = 'websocket-pereklyuchenie-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['Переподключение — <b>новое соединение</b>; событие при обрыве не придёт', 'Первое: socket.io сам восстанавливает соединение, но это новое соединение. Сервер шлёт событие только подключённым сейчас, событие во время обрыва потом не придёт.'],
  b2: ['«Обновляется сама» — <b>утверждение</b>; проверка — запись поломки', 'Второе: слова «обновляется сама» — утверждение. Проверка — сломать и записать каждую попытку: способ, что сделал, что ожидал, что было и отметка.'],
  b3: ['<b>Три способа, одна причина</b>: перезапуск, Offline, сеть', 'Третье: три способа. Сервер перезапускается, очередь Telegram быстрее подключения панели. Offline дольше ping, минута. Обрывается сеть. Причина одна: событие уже прошло.'],
  b4: ['Исправление: <b>yukla() внутри connect</b>; слушатель — снаружи', 'Четвёртое: исправление — yukla внутри connect, при каждом подключении список из базы. Слушатель один раз, снаружи connect, иначе при каждом переподключении добавляется ещё один.'],
  b5: ['Восстановление — <b>дополнение</b>; повторный запрос — обязателен', 'Пятое: connection state recovery помогает при коротком обрыве сети. А при перезапуске сервера состояние теряется. Поэтому повторный запрос обязателен, восстановление — только дополнение.'],
  b6: ['<b>Четыре вопроса</b> к исправлению от AI: проявилась ли ошибка на самом деле', 'Шестое: четыре вопроса к исправлению от AI. Где запрашивает, сколько слушателей, упал ли старый код в проверке, что добавлено лишнего. Попытка, где событие пришло, — не доказательство.'],
  hw: ['<b>Домашнее задание</b>: сломайте смену статуса; проверьте восстановление', 'Домашнее задание: проверьте поломкой и смену статуса. Во время Offline пусть админ подтвердит заказ, потом Online. Запишите результат строкой в запись поломки.'],
  hw2: ['В клиенте <b>recovered</b>, в gateway восстановление — два случая; решение в README', 'Потом добавьте в терминальный клиент значение recovered, включите восстановление в gateway и запишите результат при обрыве сети и при перезапуске сервера. Решение — в README, ссылку — на платформу. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: три способа, исправление, ловушка, восстановление, вопросы к AI — на одной странице', 'Внизу памятка на одну страницу: общее понятие, запись поломки, три способа, исправление и ловушка, граница восстановления, четыре вопроса к AI, карта m10-05 и случаи в классе. Скопируйте или скачайте.'],
};
RU_S.CHEAT = `# WebSocket: если соединение оборвалось — памятка ментора (OrderBotNest)
## Проект
git fetch --tags · git checkout ws2-start (= ws1-done) → ws2-done (public/admin.html, scripts/live-client.js, BUZISH.md) · npm run start:dev → http://localhost:3000/admin · npm run live
## Общее понятие
socket.io сам восстанавливает соединение — это НОВОЕ соединение · server.emit только подключённым сейчас · событие во время обрыва потом не придёт · список в базе → повторный запрос при каждом connect
## Запись поломки (BUZISH.md)
№ · Способ · Что сделал · Что ожидал · Что было · Отметка (buzildi / buzilmadi) · Исправление · Повторная проверка — «что было» = то, что видели; «buzilmadi» — в этой попытке, не доказательство
## Три способа
сервер перезапустился (Ctrl+C → start; сообщение из очереди Telegram выполняется до подключения панели) · DevTools → Network → Offline: 6 с — не ломается (кадр приходит на Online), 60 с — ломается («Ulanmoqda…» на ~33–40 с) · оборвалась сеть (панель на другом компьютере)
## Исправление (admin.html)
ulanish.on('connect', () => { holatQoy('ulangan'); yukla(); }) · отдельные yukla() убраны — список в двух местах: connect и order-changed · ulanish.on('order-changed', () => yukla()) — ОДИН РАЗ, снаружи connect
## Ловушка
слушатель внутри connect → при каждом переподключении ещё один: на одно событие 1 → 2 → 3 GET (F12 → Network, фильтр orders), жёлтая отметка пропадает
## connectionStateRecovery
@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } }) · короткий обрыв сети: recovered=true, пропущенное событие приходит · перезапуск сервера или клиент без событий: recovered=false · повторный запрос обязателен, восстановление — дополнение
## Четыре вопроса к исправлению от AI
запрашивается ли список в connect · слушатель один, снаружи · проявилась ли ошибка в проверке (упал ли старый код) · что добавлено лишнего (номер запроса — безвреден)
## Подготовка к классу (m10-05, 19 экранов)
Maydon Jamoa: агент «выполнил» — утверждение · три способа: отключить интернет · уход в фон · новая версия Backend · три проблемы: число старое · живое сообщение дважды · «Hozir ko'ryapti» меньше (комната — выходит при обрыве, нужен повторный вход) · исправление в ulanish.ts, Backend не меняется · m12-dars-05-start → done
## Случаи в классе
число старое → нет повторного запроса · сообщение дважды → слушатель внутри connect · «Hozir ko'ryapti» меньше → нет возврата в комнату · всё «buzilmadi» → авиарежим короткий / Expo Go · Render долго · агент «исправил» → повторить тем же способом
## Ваше домашнее задание (40–60 минут)
сломать смену статуса через Offline · строка в BUZISH.md · recovered в live-client · восстановление — два случая · решение в README · ссылка на репозиторий на платформу`;
// 2-tur (05.11): Network jurnali izohi (modul darajasida hisoblanadi — t() ishlamaydi)
ru(NET11, netGroups('06').map((g) => ({ h: liveLine(`order-changed #${g.id} · ${g.rc === 0 ? 'первое подключение' : 'после ' + g.rc + '-го переподключения'} → GET ×${g.n}`) })));

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · WebSocket",
  "title": "Панель говорит «обновляется сама». А если сервер перезапустится или оборвётся сеть? Сегодня проверяем поломкой и исправляем",
  "seg": {
   "a": [
    "Сервер перезапустился — <b>в панели и заказ, сделанный, пока сервер был выключен</b>",
    "Здравствуйте. На прошлом уроке мы сделали для OrderBotNest живую панель. Сегодня вопрос сложнее: если сервер перезапустится или оборвётся сеть, покажет ли панель все заказы? На экране результат в конце урока: заказ, сделанный, пока сервер был выключен, тоже появился жёлтым."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: что socket.io восстанавливает сам, а что нет",
    "Сначала общее понятие: что socket.io восстанавливает сам при переподключении, а что не восстанавливает. Потом берём слова панели «обновляется сама» как утверждение и нарочно его ломаем, с записью поломки."
   ],
   "c": [
    "Потом <b>повторный слушатель, сеть и восстановление</b>; в конце AI и класс",
    "На третьем этапе увидим ловушку в исправлении: на одно событие несколько запросов. На четвёртом — обрыв сети и настройка восстановления socket.io. На пятом проверим на настоящей базе исправления двух AI. В конце подготовка к классу."
   ],
   "d": [
    "Шесть этапов, три практики; нужны <b>панель, бот и Postgres с WebSocket-1</b>",
    "Урок — шесть этапов, три практики. Нужна ваша копия OrderBotNest с прошлого урока: панель, токен бота и Postgres. Ломать будете на своём ноутбуке, с браузером и телефоном. Не спешите, каждый экран можно прослушать с начала. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "socket.io сам восстанавливает соединение — но это новое соединение. Событие, отправленное во время обрыва, до него не дойдёт: сервер шлёт событие только тем, кто подключён сейчас",
  "seg": {
   "a": [
    "Переподключение — <b>готовая услуга socket.io</b>: оборвалось, пытается, подключается сам",
    "На прошлом уроке вы видели: если сервер выключается, у клиента transport close, потом несколько раз xhr poll error, а когда сервер включился — сам connect. Никто ничего не нажимал. На экране тот же терминал из сегодняшнего опыта. Вопрос: что происходило во время обрыва?"
   ],
   "b": [
    "Но это <b>новое соединение</b>: событие во время обрыва до него не дойдёт",
    "Переподключение — это новое соединение. Сервер отправляет order changed только тем панелям, которые подключены сейчас, и нигде его не хранит. Если заказ придёт во время обрыва, событие не дойдёт ни до кого. Панель переподключится, знак зелёный, а список останется старым."
   ],
   "c": [
    "Восстанавливается: <b>соединение и слушатели</b>; не восстанавливается: прошедшее событие и комната на сервере",
    "Что восстанавливается: само соединение, токен отправляется заново при каждом соединении, слушатели живут на клиенте. Что не восстанавливается: событие во время обрыва и то, что сервер привязал к этому соединению, например комната. Комнату посмотрим в уроке ученика."
   ],
   "d": [
    "Итог: список — <b>в базе</b>; при каждом переподключении панель должна запросить его заново",
    "Итог: событие говорит только «что-то изменилось», настоящий список — в базе. После обрыва панель не знает, что она пропустила, значит должна запросить список заново. Текущая панель этого не делает. Чтобы это доказать, сначала её сломаем."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · общее понятие",
  "title": "README: «ro'yxat o'zi yangilanadi». Это утверждение — не проверенное. Проверка — поломка и запись каждой попытки в четыре колонки",
  "seg": {
   "a": [
    "README говорит <b>«обновляется сама»</b> — в обычном случае верно, в крайнем не проверено",
    "В README OrderBotNest написано: список обновляется сам. В обычном случае это верно, мы видели на прошлом уроке. А если сервер перезапустится или оборвётся сеть? Это не проверено. В уроке ученика такие слова называются утверждением: сказано, но не доказано."
   ],
   "b": [
    "Запись поломки: <b>что сделал · что ожидал · что было → отметка</b>",
    "Проверка — это поломка. Каждая попытка — одна строка: каким способом, что сделал, что ожидал, что было, и отметка: сломалось или не сломалось. В колонку «что было» пишется не догадка, а то, что видели на экране. Файл BUZISH в уроке ученика — ровно эти колонки."
   ],
   "c": [
    "Для панели <b>три способа</b>: сервер перезапускается, браузер Offline, обрывается сеть",
    "Для панели три способа. Первый: сервер перезапускается, deploy или ошибка. Второй: у браузера пропадает сеть, это делаете через DevTools. Третий: панель на другом компьютере, и сеть между ними обрывается. В каждом — в этот момент приходит заказ."
   ],
   "d": [
    "Итог: отметка — <b>на этом компьютере, в этой попытке</b>; «не сломалось» — не доказательство",
    "Итог: отметка «сломалось» показывает, что проблема есть. А «не сломалось» значит только: на этом компьютере, в этой попытке, это не доказательство. Сегодня увидите такую попытку: ошибка есть, но в тот раз не проявилась. Начинаем с первого способа."
   ]
  }
 },
 "4": {
  "kicker": "Этап 2 · потерянный заказ",
  "title": "Панель и терминальный клиент открыты; сервер остановился; пока он выключен, Бобур написал боту; сервер включился — знак «Ulangan», в списке только #1, а в базе есть #2",
  "seg": {
   "a": [
    "Панель открыта, <b>#1 видна</b>; в терминале сервера Ctrl+C — знак «Ulanmoqda…»",
    "Опыт на настоящих сервере, базе и браузере. Панель открыта, Бобур сделал первый заказ, в панели появилась первая строка. Теперь в терминале сервера Ctrl C. Панель сразу «подключается», список остаётся на экране. В этот момент Бобур написал боту ещё один заказ."
   ],
   "b": [
    "Сервер включился — <b>бот сразу выполнил заказ из очереди</b>: <code>Buyurtma #2 qabul qilindi!</code>",
    "Снова включили сервер. Посмотрите в лог сервера: как только он запустился, бот выполнил сообщение Бобура, заказ два принят. А строка «панель подключилась» — после этого. То есть в момент отправки события ни одна панель не была подключена."
   ],
   "c": [
    "Панель: <b>знак «Ulangan», в списке только #1</b>; в терминальном клиенте тоже нет события",
    "Посмотрите на панель: знак «подключено», зелёный. А в списке только первый заказ. Терминальный клиент тоже переподключился, но order changed не пришёл. Админ верит экрану и второго заказа не видит. Если обновит страницу — появится, но админ этого не знает."
   ],
   "d": [
    "Итог: <b>в базе 2, в панели 1</b> — утверждение в README сломано",
    "Итог: в базе два заказа, в панели один, а знак говорит, что всё в порядке. Это худший случай: ошибку не видно. Первая строка в запись поломки: сервер перезапустился, ожидал второй заказ, было только первый, отметка «сломалось»."
   ]
  }
 },
 "5": {
  "kicker": "Этап 2 · внутри",
  "title": "Пока сервер выключен, Telegram хранит сообщение; как только бот запускается, он его получает. А панель пытается снова через 1–5 секунд — чаще всего опаздывает, иногда успевает",
  "seg": {
   "a": [
    "Пока сервер выключен, <b>Telegram хранит сообщение</b>; первое дело бота после включения — очередь",
    "Почему так вышло? Telegram хранит сообщения, пришедшие, пока сервер был выключен. В файле telegram service внутри on module init — bot launch: как только бот запускается, он забирает сообщения из очереди и сразу выполняет. Это занимает меньше секунды."
   ],
   "b": [
    "А панель <b>пытается снова через 1–5 секунд</b> — когда событие ушло, она ещё не подключена",
    "А панель после обрыва ждёт секунду, потом две, четыре, максимум пять секунд и пытается снова. Между включением сервера и следующей попыткой панели бот успевает выполнить заказ и отправить событие. Событие ушло нулю панелей."
   ],
   "c": [
    "Иногда <b>панель успевает</b> — в этой попытке ошибка не проявляется",
    "Но не каждый раз. Когда проверяли копию от AI, в одной попытке панель успела подключиться раньше заказа, и событие пришло обычным путём. В той попытке ошибка не проявилась вообще, значит, она ничего не проверила. Вот что значит «иногда», о котором говорил заказчик."
   ],
   "d": [
    "Значит, причина: <b>событие зависит от времени</b>; а список в базе — его надо запрашивать независимо от времени",
    "Значит, причина: придёт ли событие, зависит от времени, кто быстрее. Скоростью это не выиграть. А список в базе, он от времени не зависит. Если панель запросит его заново сразу при подключении, разницы, кто был быстрее, не останется. Сначала ещё один способ: выключим сеть браузера."
   ]
  }
 },
 "6": {
  "kicker": "Этап 2 · потерянный заказ",
  "title": "DevTools → Network → Offline: за 6 секунд знак не изменился, событие пришло на Online — не сломалось. За 60 секунд — через полминуты «Ulanmoqda…», после Online список старый — сломалось",
  "seg": {
   "a": [
    "Offline — <b>одна кнопка в DevTools</b>: Network → вместо No throttling — Offline",
    "Второй способ делаете на своём ноутбуке. В браузере F12, раздел Network, в списке No throttling сверху выберите Offline. Сеть страницы выключается, а сервер и бот продолжают работать. В этот момент делаете заказ с телефона."
   ],
   "b": [
    "6 секунд: <b>знак не изменился</b>, событие пришло, когда стало Online — не сломалось",
    "Первая попытка: шесть секунд Offline, в это время заказ. Знак оставался «подключено». Как только включили Online, пришёл order changed, и список обновился. Браузер не закрыл открытое соединение, а придержал кадр. Отметка «не сломалось», только в этой попытке."
   ],
   "c": [
    "60 секунд: <b>через полминуты «Ulanmoqda…»</b>; на Online пришёл опоздавший кадр, но выброшен",
    "Вторая попытка: минута. На тридцать третьей секунде знак стал «подключается»: ping не пришёл, клиент сам оборвал соединение. Включили Online: опоздавший кадр дошёл до браузера, но socket.io счёл его кадром закрытого соединения, выбросил и подключился заново. Список не запрошен."
   ],
   "d": [
    "Итог: Offline ломается, <b>если он дольше времени ping</b> — ждите больше 45 секунд",
    "Итог: знак «подключено», в списке первый, а в базе есть и второй. Сломалось. Правило ping вы видели на прошлом уроке: двадцать пять и двадцать. На практике держите Offline, пока знак не станет «подключается», иначе выйдет «не сломалось»."
   ]
  }
 },
 "7": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "Сервер перезапустился. Знак «Ulangan». В базе есть #2, в панели нет, терминальному клиенту тоже не пришёл order-changed. Главная причина?",
  "q": "Вы видели поломку двумя способами, теперь проверим. Первая проверка. Сервер перезапустился, знак «подключено», в базе второй заказ есть, в панели нет. В логе сервера заказ — раньше подключения панели. Главная причина? Выберите вариант.",
  "ok": "Верно. В логе сервера «заказ два принят», а «панель подключилась» — после. Order changed ушёл панелям, подключённым в тот момент, а их было ноль. Socket.io такое событие не хранит и переподключившейся панели не отдаёт. Значит, даже если знак «подключено», списку после обрыва верить нельзя.",
  "okShort": "Событие ушло 0 панелям — сервер не хранит, переподключившейся не отдаёт.",
  "hint": "В каком порядке в логе сервера «Buyurtma #2» и «panel ulandi»?",
  "demak": "событие во время обрыва теряется; переподключившаяся панель не знает, что пропустила.",
  "opts": [
   "Бот не записал #2 в базу — транзакция откатилась",
   "Событие ушло до подключения панели, сервер его не хранит",
   "Токен панели устарел, сервер отклонил событие",
   "socket.io поставил событие в очередь, оно придёт со следующим"
  ],
  "wrong": {
   "0": "В базе 2 — заказ записан (psql).",
   "2": "Токен верный: панель подключилась, знак «Ulangan».",
   "3": "Очереди нет: следующее событие придёт само, без старого."
  }
 },
 "8": {
  "kicker": "Этап 2 · потерянный заказ",
  "title": "ws2-done: yukla() внутри connect — при первом и каждом повторном подключении список из базы; отдельные вызовы yukla() убраны. Тот же опыт: #2 жёлтая",
  "seg": {
   "a": [
    "<code>admin.html</code>, <code>ulan()</code>: <b>внутри <code>connect</code> — <code>holatQoy</code> и <code>yukla()</code></b> — две строки",
    "Исправление маленькое. Файл admin html в папке public, функция ulan. При connect мы ставили только знак. Теперь внутри вызывается и yukla. Connect срабатывает и при первом подключении, и при каждом переподключении, значит каждый раз список приходит из базы."
   ],
   "b": [
    "Отдельные <b>вызовы <code>yukla()</code> убраны</b>: список в двух местах — <code>connect</code> и событие",
    "Отдельные вызовы yukla у кнопки входа и при открытии страницы убрали, иначе при открытии список запрашивался бы дважды. Теперь только два места: connect и order changed. Работает и с неверным токеном: на мгновение connect, запрос, «токен неверный»."
   ],
   "c": [
    "Тот же опыт: <b>#2 жёлтая</b>; терминальный клиент тоже <code>GET … → 2 ta, eng yangisi #2</code>",
    "Повторили опыт с четвёртого экрана на исправленном коде. После включения сервера знак «подключено», и в списке второй заказ, жёлтый. В терминальный клиент добавлено то же: после connect — get admin orders, сколько и самый новый. На практике подтверждением будет эта строка."
   ],
   "d": [
    "Итог: <b>и Offline 60 секунд</b> не повторился — одно исправление закрыло два способа",
    "Итог: и минутный Offline повторили на исправленном коде: после Online появился второй заказ. В записи поломки в обе строки: исправление сделано, при повторной проверке не повторилось. Код сервера не менялся, тестов тридцать два, smoke девять из девяти."
   ]
  }
 },
 "9": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "На ws2-start сломайте панель через Offline (пока знак не станет «Ulanmoqda…»), сделайте заказ с телефона; потом на ws2-done проверьте тем же способом",
  "seg": {
   "a": [
    "Теперь вы: <b><code>ws2-start</code>, DevTools Offline и телефон</b> — на своём ноутбуке",
    "Теперь ваша очередь. В своей папке OrderBotNest переходите на тег ws2 start, открываете панель и выключаете сеть браузера. Со своего телефона делаете заказ боту и включаете Online. Потом то же на ws2 done. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>тег, сервер, панель; Offline — пока знак не станет «Ulanmoqda…»</b>, потом заказ",
    "На первом шаге тег и сервер, в браузере localhost три тысячи admin. На втором F12, Network, Offline и ждите: знак должен стать «подключается», до сорока пяти секунд. После этого заказ с телефона, в Telegram выходит «заказ принят»."
   ],
   "c": [
    "Шаги 3–4: <b>Online — в списке нет</b>; снова на <code>ws2-done</code> — появляется; подтверждение — номер заказа",
    "На третьем шаге Online: знак «подключено», но нового заказа в списке нет. Сломалось. На четвёртом тег ws2 done, перезапуск сервера, тот же способ: теперь после Online заказ появляется жёлтым. В поле подтверждения напишите номер этого заказа."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы сами сломали утверждение панели и проверили исправление тем же способом."
   ]
  },
  "steps": [
   {
    "t": "Тег и панель",
    "exp": "знак «Ulangan», список"
   },
   {
    "t": "Offline",
    "exp": "Telegram: Buyurtma #… qabul qilindi!",
    "cmds": [
     null,
     "ждите, пока знак не станет «Ulanmoqda…»",
     "с телефона заказ боту"
    ]
   },
   {
    "t": "Online",
    "exp": "знак «Ulangan», нового заказа в списке НЕТ (с F5 появится)"
   },
   {
    "t": "Повторная проверка",
    "exp": "после Online новый заказ жёлтый",
    "cmds": [
     null,
     "сервер заново",
     "шаги 1–3 ещё раз"
    ]
   }
  ],
  "proof": {
   "label": "Номер заказа, появившегося после Online на ws2-done",
   "placeholder": "например: #7",
   "wrong": "Напишите номер жёлтой строки, появившейся в списке после Online на ws2-done."
  },
  "trouble": [
   [
    "и на ws2-start заказ появился",
    "Offline был коротким — не делайте заказ, пока знак не стал «Ulanmoqda…» (экран 6: за 6 с не ломается)"
   ],
   [
    "Знак не становится «Ulanmoqda…»",
    "Offline не включён или в другой вкладке — включите в DevTools самой страницы; ждите до 45 с"
   ],
   [
    "и после Online «Ulanmoqda…»",
    "сервер остановился — проверьте терминал сервера"
   ],
   [
    "и на ws2-done в списке нет",
    "старая страница — перезапущен ли сервер, обновите один раз через F5, потом попробуйте снова"
   ]
  ]
 },
 "10": {
  "kicker": "Этап 3 · повторный слушатель",
  "title": "Простое «исправление»: всё внутрь connect. При первом подключении работает; после каждого переподключения на одно событие 2, потом 3 GET — и жёлтая отметка пропадает",
  "seg": {
   "a": [
    "Простое исправление: <b>и слушатель внутрь <code>connect</code></b> — «при каждом подключении настроим всё»",
    "Теперь ловушка в исправлении. Простой путь: при каждом подключении настраиваем всё заново, и слушатель переносим внутрь connect. Код выглядит красиво и при первом подключении работает правильно. Проверяем: сервер дважды перезапускается, каждый раз после — один заказ."
   ],
   "b": [
    "Network: <b>на одно событие 1, потом 2, потом 3 <code>GET</code></b>",
    "Посмотрите на список Network в браузере. На первый заказ — один get admin orders. После одного переподключения на один заказ — два. После второго — три. При каждом переподключении добавлялся ещё один слушатель: событие одно, обработчиков три."
   ],
   "c": [
    "Видимый признак: <b>пропала жёлтая строка</b> — второй из двух ответов говорит «не новая»",
    "Это не только лишние запросы. Слева копия с ошибкой: второй заказ не жёлтый. Справа правильный код: жёлтый. Два запроса уходят одновременно, первый ответ рисует строку как новую и запоминает самый большой номер, а второй рисует её уже как «не новую»."
   ],
   "d": [
    "Значит, причина: <b><code>connect</code> срабатывает при каждом подключении</b> — слушатель один раз, снаружи",
    "Значит, причина: connect срабатывает и при первом подключении, и при каждом переподключении. Каждый on внутри добавляет нового слушателя, старый не удаляется. Правило: внутри connect только повторный запрос, а слушатель — один раз, снаружи. В ws2 done так и есть, с комментарием."
   ]
  }
 },
 "11": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4 — какая строка с ошибкой?",
  "title": "В этой панели после двух перезапусков сервера на один заказ уходит три GET /admin/orders. Найдите строку-виновника",
  "q": "Вы видели ловушку, теперь найдите её сами. Вторая проверка. В этой панели после двух перезапусков сервера на один заказ уходит три запроса. Одна строка во фрагменте при каждом подключении добавляет нового слушателя. Нажмите на эту строку.",
  "ok": "Верно. Эта строка внутри connect, а connect срабатывает при каждом переподключении. После двух переподключений три слушателя, на одно событие три запроса, и жёлтая отметка пропадает. Сам вызов yukla верный: повторный запрос должен быть внутри connect. Значит, on внутри connect — ловушка.",
  "okShort": "<code>ulanish.on(…)</code> внутри <code>connect</code> — при каждом переподключении ещё один слушатель.",
  "hint": "Какая строка внутри connect каждый раз добавляет новое, а какая делает одно дело?",
  "task": "Правило: <code>connect</code> срабатывает при каждом переподключении — внутри только <b>разовое дело</b>. В этом фрагменте одна строка при каждом подключении <b>добавляет нового слушателя</b>. <b>Нажмите на эту строку.</b>"
 },
 "12": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Нарочно перенесите слушатель внутрь connect, дважды перезапустите сервер, сделайте один заказ и посчитайте GET в Network; потом верните",
  "seg": {
   "a": [
    "Теперь вы: <b>нарочно переносите слушатель внутрь <code>connect</code></b> и считаете",
    "Теперь ваша очередь. В admin html на ws2 done нарочно переносите слушатель внутрь connect, дважды перезапускаете сервер и делаете один заказ. В списке Network браузера считаете запросы. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>перенесите слушатель</b>, F12 → Network, фильтр <code>orders</code>",
    "На первом шаге переносите строку order changed внутрь connect, после yukla, и сохраняете. На втором заново открываете панель, F12, Network, в фильтре пишете orders. Останутся только строки get admin orders."
   ],
   "c": [
    "Шаги 3–4: <b>сервер дважды заново, потом один заказ</b> — сколько <code>GET</code>; подтверждение — число",
    "На третьем шаге в терминале сервера дважды Ctrl C и запуск, каждый раз ждите, пока знак не станет «подключено». Потом очистите Network и сделайте с телефона один заказ. На четвёртом посчитайте и верните код. В поле подтверждения напишите число запросов."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы узнаёте повторный слушатель по числу запросов."
   ]
  },
  "steps": [
   {
    "t": "Поломка",
    "exp": "сохранено",
    "cmds": [
     "public/admin.html: ulanish.on('order-changed', () => yukla()); → внутрь connect, после yukla();"
    ]
   },
   {
    "t": "Network",
    "exp": "при первом открытии один orders",
    "cmds": [
     "браузер: панель → F5",
     null
    ]
   },
   {
    "t": "Два перезапуска",
    "exp": "появилась новая строка",
    "cmds": [
     "сервер: Ctrl+C → npm run start:dev (×2, каждый раз ждите значок «Ulangan»)",
     null,
     "один заказ с телефона"
    ]
   },
   {
    "t": "Подсчёт и возврат",
    "exp": "3 GET; код возвращён",
    "cmds": [
     "число orders в Network",
     null
    ]
   }
  ],
  "proof": {
   "label": "Число GET /admin/orders после одного заказа",
   "placeholder": "например: 3",
   "wrong": "Сколько запросов orders ушло на один заказ после двух перезапусков? Должно быть три — очистите Network перед заказом."
  },
  "trouble": [
   [
    "2 GET",
    "сервер перезапустился один раз или во второй раз вы не дождались знака «Ulangan»"
   ],
   [
    "1 GET",
    "страница на старом коде — сохранён ли admin.html; обновите через F5"
   ],
   [
    "В Network нет orders",
    "другой фильтр или запросы были до открытия Network — обновите страницу с открытым DevTools"
   ],
   [
    "Жёлтая отметка всё равно есть",
    "запросы вернулись по очереди — подсчёта для подтверждения достаточно"
   ]
  ]
 },
 "13": {
  "kicker": "Этап 4 · сеть и восстановление",
  "title": "В жизни сервер на Render, панель на компьютере магазина: сеть между ними обрывается, сервер и бот работают. Смоделировали прокси: ws2-start — список пуст, ws2-done — #1",
  "seg": {
   "a": [
    "В настоящем магазине <b>сервер на Render, панель в магазине</b>: сеть обрывается между ними",
    "Третий способ. В настоящем магазине сервер — на чём-то вроде Render, панель — на компьютере магазина. Если в магазине пропал Wi-Fi, сервер и бот продолжают работать, клиенты заказывают, а панель без сети. Смоделировали это, поставив между ними прокси: режем прокси."
   ],
   "b": [
    "<code>ws2-start</code>: сеть вернулась — <b>«Ulangan», список пуст</b>, в базе #1",
    "В старом коде: сеть оборвалась, знак сразу «подключается», потому что соединение закрылось. В этот момент Бобур сделал заказ. Сеть вернулась, знак «подключено», а в списке заказа всё ещё нет. В базе первый заказ есть. Точно как при перезапуске сервера."
   ],
   "c": [
    "<code>ws2-done</code>: <b>после <code>connect</code> — <code>GET</code>, #1 в списке</b>",
    "В исправленном коде те же шаги: когда сеть вернулась — connect, сразу get admin orders, и в списке первый заказ. Одно исправление закрыло все три способа: перезапуск сервера, Offline браузера и обрыв сети."
   ],
   "d": [
    "Итог: способов три, <b>причина одна</b> — переподключение это новое соединение, событие прошло",
    "Итог: способов три, причина одна: переподключение — новое соединение, а событие во время обрыва прошло. Это исправление на стороне клиента. Возникает вопрос: а сервер сам не может отдать пропущенное заново? В socket.io есть такая настройка."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · внутри",
  "title": "connectionStateRecovery в gateway — после короткого обрыва пропущенные события приходят снова (recovered=true). Но если клиент раньше не получал событий и если сервер перезапустился — нет",
  "seg": {
   "a": [
    "Настройка socket.io: <b><code>connectionStateRecovery</code></b> — 2 минуты хранит состояние оборванного соединения",
    "В socket.io есть настройка connection state recovery. Добавляем её в декоратор gateway, две минуты. Сервер хранит в памяти состояние оборванного соединения и события, отправленные за это время. Если клиент вернётся — socket recovered true, и пропущенные события придут."
   ],
   "b": [
    "Сеть оборвалась, в этот момент #3 — при возврате <b>#3 пришёл, <code>recovered=true</code></b>, id тот же",
    "Опыт: клиент получил событие второго заказа, потом сеть оборвалась, в этот момент третий заказ. Сеть вернулась: сначала пришёл order changed три, потом connect, recovered true, и номер соединения тот же. Действительно работает, даже если панель не запрашивает заново."
   ],
   "c": [
    "Но: <b>клиент, ещё не получавший событий</b>, и <b>перезапуск сервера</b> — <code>recovered=false</code>",
    "В двух случаях не сработало. Первый: клиент до обрыва ещё не получил ни одного события, recovered false, пропущенный заказ не пришёл. Второй: сервер перезапустился, recovered false, заказ из очереди не пришёл. Сохранённое состояние было в памяти сервера и пропало вместе с ним."
   ],
   "d": [
    "Итог: восстановление — <b>дополнение</b>; повторный запрос в <code>connect</code> — обязателен",
    "Итог: восстановление помогает при коротком обрыве сети. А перезапуск сервера — самый частый случай: deploy, ошибка. Там работает только повторный запрос. Поэтому в ws2 done gateway не менялся. Если добавите восстановление, повторный запрос всё равно остаётся."
   ]
  }
 },
 "15": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4",
  "title": "В gateway включён connectionStateRecovery, панель при connect заново не запрашивает. Deploy: сервер перезапустился, пока он был выключен, Бобур сделал заказ. Увидит ли его панель?",
  "q": "Вы видели восстановление, теперь проверим. Третья проверка. В gateway включено восстановление, а панель при connect не запрашивает заново. Был deploy, сервер перезапустился, пока он был выключен, Бобур сделал заказ. Увидит ли его панель? Выберите вариант.",
  "ok": "Верно. Восстановление хранит состояние оборванных соединений в памяти процесса сервера. При перезапуске процесс новый, память пустая: recovered false, событие заказа из очереди не вернётся. Срок в две минуты здесь не помогает. Значит, после deploy и ошибки работает только повторный запрос.",
  "okShort": "Состояние в памяти сервера — при перезапуске пропадает: <code>recovered=false</code>.",
  "hint": "Где восстановление хранит данные — в базе, в файле или в памяти процесса?",
  "demak": "восстановление — в памяти сервера: после deploy и перезапуска его нет — повторный запрос обязателен.",
  "opts": [
   "Да — восстановление вернёт все пропущенные события",
   "Да, если сервер включился за 2 минуты",
   "Нет — сохранённое состояние было в памяти сервера",
   "Нет — восстановление работает только на транспорте polling"
  ],
  "wrong": {
   "0": "Только события, сохранённые этим процессом сервера; в новом процессе их нет.",
   "1": "Дело не в сроке, а в памяти: если процесс новый, не восстановит, даже если включился за секунду.",
   "3": "От транспорта не зависит — в 07 восстановил на websocket."
  }
 },
 "16": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 20 минут",
  "title": "На ws2-done откройте терминальный клиент, перезапустите сервер — найдите строку GET после переподключения; запишите три попытки в свою запись BUZISH.md",
  "seg": {
   "a": [
    "Теперь вы: <b>терминальный клиент и ваша запись поломок</b>",
    "Теперь ваша очередь. На ws2 done открываете терминальный клиент, перезапускаете сервер и видите, что клиент заново запросил список. Потом пишете свою запись поломок: три сегодняшние попытки. Займёт двадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b><code>npm run live</code>, сервер Ctrl+C и заново</b> — <code>connect</code>, потом <code>GET … → N ta</code>",
    "На первом шаге во втором терминале npm run live: connect и get admin orders, сколько и самый новый. На втором в терминале сервера Ctrl C, в клиенте transport close и xhr poll error, потом сервер включается, и снова connect, строка get."
   ],
   "c": [
    "Шаги 3–4: <b><code>BUZISH.md</code> — три строки</b>, сравните с образцом в <code>ws2-done</code>; подтверждение — строка <code>GET</code>",
    "На третьем шаге в своей папке файл BUZISH: попытки из первой и второй практики и сегодняшний перезапуск. На четвёртом сравниваете с образцом в ws2 done. В поле подтверждения скопируйте строку get после переподключения."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы проверяете переподключение из терминала и сами пишете запись поломок."
   ]
  },
  "steps": [
   {
    "t": "Клиент",
    "exp": "connect · ulangan · GET /admin/orders → N ta, eng yangisi #…",
    "cmds": [
     null,
     null,
     "второй терминал: npm run live"
    ]
   },
   {
    "t": "Перезапуск",
    "exp": "в клиенте transport close → xhr poll error → connect → снова GET … → N ta"
   },
   {
    "t": "Запись",
    "exp": "три строки, в «Что было» — то, что вы видели",
    "cmds": [
     null,
     null,
     "Что сделал",
     "Что ожидал",
     "Что было",
     "Отметка — 3 строки"
    ]
   },
   {
    "t": "Сравнение",
    "exp": "колонки одинаковые, отметка «сломалось / не сломалось»"
   }
  ],
  "proof": {
   "label": "Строка GET после переподключения",
   "placeholder": "например: 14:05:31 GET /admin/orders → 7 ta, eng yangisi #7",
   "wrong": "Скопируйте в терминале клиента строку GET /admin/orders → … ta после повторного connect."
  },
  "trouble": [
   [
    "connect есть, строки GET нет",
    "клиент из ws2-start — git checkout ws2-done"
   ],
   [
    "GET /admin/orders → 401",
    "токен клиента не совпадает с ADMIN_PANEL_TOKEN в .env"
   ],
   [
    "connect_error: xhr poll error не прекращается",
    "сервер не запустился — прочитайте ошибку в терминале сервера"
   ],
   [
    "fetch is not defined",
    "Node старше 18 — node -v, в курсе Node 24"
   ]
  ]
 },
 "17": {
  "kicker": "Этап 5 · AI",
  "title": "Двум AI — жалоба заказчика, без подсказок. Оба верно нашли причину — yukla() в connect — и оба сами добавили защиту «старый ответ не перекрывает новый»",
  "seg": {
   "a": [
    "Снова этап AI: <b>исправляет AI, принимаете вы</b> — по жалобе, без подсказок",
    "Пятый этап, AI. Двум AI дали жалобу заказчика, ровно как сказал админ: иногда новый заказ не виден, знак «подключено», если обновлю страницу — появляется. Ни connect, ни повторный запрос не упомянуты. Сильная модель и модель слабее."
   ],
   "b": [
    "Промпт — <b>одно предложение</b>: знак «Ulangan», заказа нет, обновлю страницу — появляется",
    "Промпт — одно предложение, на экране дословно. Именно так вам напишет ученик или владелец магазина. Чтобы найти причину по такому сообщению, AI должен прочитать код и знать, что делает переподключение."
   ],
   "c": [
    "Оба: <b><code>yukla()</code> в <code>connect</code></b> и сами <b>номер запроса</b> — чтобы поздний старый ответ не рисовался",
    "Оба верно нашли причину и написали наше исправление: yukla внутри connect. Оба сами добавили ещё одну защиту: номер у запроса, рисуется ответ только последнего. Если два запроса уйдут одновременно, пусть поздний старый список не перекроет новый. Слушатель внутрь connect не перенёс ни один."
   ],
   "d": [
    "Но оба проверяли <b>без настоящей базы</b>: один с JSON-файлом, другой в jsdom",
    "Оба проверили сами: первый — в Chrome, с JSON-файлом вместо базы, второй — в jsdom вместо браузера. Второй открыл папку проверки вне проекта, а в условии была только эта папка. Теперь проверим их на настоящей базе нашим опытом."
   ]
  }
 },
 "18": {
  "kicker": "Этап 5 · внутри",
  "title": "На настоящих PostgreSQL и браузере, заказ раньше подключения панели: у обоих #2 жёлтая. Приём — четыре вопроса: где запрашивает · сколько слушателей · проявилась ли ошибка · что добавлено лишнего",
  "seg": {
   "a": [
    "На настоящей базе: <b>у обоих #2 жёлтая</b>, событие до панели не дошло — исправление сработало",
    "Обе копии от AI проверили опытом с четвёртого экрана, на настоящем Postgres и в Chrome. Заказ нарочно раньше подключения панели. У обоих после включения сервера второй заказ жёлтый. Событие до панели не дошло, значит список вывел именно повторный запрос."
   ],
   "b": [
    "Номер запроса: <b>верная защита</b>, но в наших опытах этот случай не выходил",
    "Дополнительная защита: у каждого запроса номер, если при ответе номер не последний, он не рисуется. Логика верная, лишнего вреда нет. Но в наших опытах порядок ответов не нарушался, первый AI показал это на замедленном сервере. Принять можно, но это не главное исправление."
   ],
   "c": [
    "Внимание: <b>в одной попытке панель успела</b> — это «прошло» ничего не доказывает",
    "Самый важный урок. Когда мы впервые проверяли копию от AI, панель успела подключиться раньше заказа, событие пришло обычным путём. Список был правильным, но ошибка вообще не проявилась. Старый код тоже прошёл бы. Поэтому, увидев в логе, что событие не пришло, мы проверили заново."
   ],
   "d": [
    "Итог: исправлению от AI — <b>четыре вопроса</b>: где запрашивает · сколько слушателей · проявилась ли ошибка · что лишнего",
    "Итог: исправлению переподключения от AI — четыре вопроса. Запрашивается ли список в connect. Слушатель один и снаружи? Проявилась ли ошибка в проверке на самом деле, то есть упал ли старый код в этой проверке. И что добавлено лишнего, нужно ли оно. На этот раз оба прошли."
   ]
  }
 },
 "19": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "В нашей первой проверке панель, исправленная AI, показала #2. В логе панели после переподключения — кадр … \"orderId\":2. Что это доказывает?",
  "q": "Вы видели исправления от AI, теперь проверим. Четвёртая проверка. В нашей первой проверке панель, исправленная AI, показала второй заказ. А в логе панели после переподключения пришло событие второго заказа. Что доказывает эта проверка? Выберите вариант.",
  "ok": "Верно. Если событие пришло, панель успела переподключиться, и обычный слушатель обновил список. Старый, неисправленный код тоже прошёл бы эту проверку. Чтобы проверка проверяла ошибку, старый код должен на ней падать. Значит, сначала увидьте «сломалось» на старом коде, потом «не повторилось» на исправленном. Первый AI сам проверял именно так: на старой странице ошибка повторилась, на новой — нет.",
  "okShort": "Событие пришло — ошибка не проявилась; старый код тоже прошёл бы. Пусть проверка сначала роняет старый код.",
  "hint": "Если запустить эту проверку на неисправленном коде, был бы результат другим?",
  "demak": "проверка проверяет ошибку, если старый код на ней падает; попытка, где событие пришло, — не доказательство.",
  "opts": [
   "Исправление работает — панель показала #2",
   "Ошибка не исправлена — событие пришло дважды, GET тоже два",
   "Сервер изменился — теперь событие сохраняется",
   "Ничего — в этой попытке ошибка не проявилась"
  ],
  "wrong": {
   "0": "Показала, но и событие пришло — старый код тоже показал бы.",
   "1": "В логе один кадр; число GET обычное.",
   "2": "Код сервера не трогали — diff-stat: только admin.html (и README)."
  }
 },
 "20": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m10-05 · «Ulanish uzilsa: buzamiz va tuzatamiz»",
  "title": "Урок ученика: агент сказал «все три крайних случая выполнил» — ученик ломает в Maydon Jamoa тремя способами, записывает и поручает исправить",
  "seg": {
   "a": [
    "m10-05 — 19 экранов: <b>агент сказал «выполнил»</b> — ученик проверяет это как утверждение",
    "Теперь подготовка к классу. Урок ученика m10-05, девятнадцать экранов. В Maydon Jamoa агент сказал, что выполнил все три крайних случая. Ученик принимает это как утверждение и ломает тремя способами: отключение интернета, уход в фон и новая версия Backend."
   ],
   "b": [
    "Три проблемы: <b>число старое · живое сообщение дважды · «Hozir ko'ryapti» меньше</b>",
    "Ученик находит три проблемы. Число старое: событие во время обрыва, которое вы сегодня видели. Живое сообщение дважды: повторный слушатель, в коде ученика он с самого начала внутри connect. «Сейчас смотрят» меньше: комната. В OrderBotNest такой проблемы нет, увидим её в коде ученика."
   ],
   "c": [
    "Блоки: <b>трудное место — окно кода на 9-м экране и две практики</b>",
    "Посмотрите на таблицу блоков. Трудное место — окно кода на девятом экране и две практики. На третий, пятый и седьмой экраны лишнего времени не давайте. Что вы добавляете в каждом блоке — в правой колонке: номер сегодняшнего экрана."
   ],
   "d": [
    "Итог: в записи ученика <b>«Что было» — то, что видел</b>, а не догадка; большая часть времени — практике",
    "Итог: большая часть времени — на две практики. В записи ученика строка «что было» пусть будет тем, что он видел на экране, а не догадкой. После исправления пусть сломает снова тем же способом. Два тега: двенадцатый модуль, пятый урок, start и done."
   ]
  }
 },
 "21": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Открыв экран игры, приложение входит в комнату; при обрыве сервер выводит его из всех комнат; переподключение само в комнату не возвращает — на втором телефоне «Hozir ko'ryapti: 1»",
  "seg": {
   "a": [
    "Комната: открыв экран игры, приложение шлёт <b><code>oyin-ochildi</code></b> — сервер добавляет его в комнату игры",
    "Третьей проблемы в OrderBotNest нет, потому что наша панель получает одно событие для всех. А в Maydon Jamoa при открытии экрана игры приложение шлёт oyin ochildi, и сервер добавляет его в комнату этой игры. «Сейчас смотрят» — это число соединений в комнате."
   ],
   "b": [
    "При обрыве соединение <b>выходит из всех комнат</b>; переподключение само не возвращается — у Вали «1»",
    "Вышла новая версия Backend, Али переподключился. Но новое соединение не в комнате: оно вышло из комнаты вместе со старым соединением. Вали открыл игру, и «сейчас смотрят» показало один, а не два. То, что я говорил на втором экране: комната на сервере не восстанавливается."
   ],
   "c": [
    "Исправление <b>внутри <code>connect</code></b>: повторный запрос и повторный вход в комнату открытой игры",
    "Исправление в проекте ученика — в файле ulanish ts, внутри connect два дела: повторный запрос и, если игра открыта, повторный вход в комнату. А слушатель вынесен наружу. Результат: на обоих телефонах два. Backend не менялся."
   ],
   "d": [
    "Итог: внутри <code>connect</code> <b>только разовое дело</b>: повторный запрос, возврат в комнату; слушатель — снаружи",
    "Итог: все три проблемы в одном месте, вокруг connect. Внутри — только то, что делается один раз при каждом подключении: повторный запрос и возврат в комнату. Слушатель — один раз, снаружи. Две из них вы сегодня сделали своими руками в OrderBotNest, третья — продолжение того же шаблона."
   ]
  }
 },
 "22": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "A1: три способа — авиарежим, уход в фон, повторный выпуск на Render; изменение делает агент с другого аккаунта. A2: исправление по записи и повторная проверка тем же способом",
  "seg": {
   "a": [
    "В A1 код не пишется: <b>изменение делает агент с другого аккаунта</b>, наблюдает ученик",
    "Первый блок практики ученика. Код не пишется: ученик ломает приложение, а изменение делает агент с другого аккаунта, как вы сегодня делали заказ с телефона. Наблюдение и запись — у ученика."
   ],
   "b": [
    "Авиарежим — <b>ждать минуту</b>; вы видели это в Offline 60 секунд",
    "Первый способ — авиарежим, и урок ученика говорит: ждите до минуты. Вы знаете причину: правило ping, за шесть секунд Offline не сломалось, за минуту — сломалось. Если ученик вернётся рано, запишет «не сломалось», и это тоже результат, но ошибка останется скрытой."
   ],
   "c": [
    "Повторный выпуск на Render — <b>это ваш перезапуск сервера</b>; может занять несколько минут",
    "Третий способ — повторный выпуск вручную на Render, то же самое, что вы сегодня делали с перезапуском сервера. Только на Render это может занять несколько минут. Render мы не проверяли, название кнопки в уроке ученика взято из официальной документации."
   ],
   "d": [
    "Итог: в A2 <b>«исправил» агента — тоже утверждение</b> — ломается снова тем же способом",
    "Итог: во втором блоке ученик отдаёт запись агенту и поручает исправить. «Исправил» от агента — тоже утверждение. Вы сегодня видели: в попытке, которую проверял AI, ошибка могла не проявиться. Пусть ученик повторит попытки с отметкой «сломалось» тем же способом."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Шесть случаев, у каждого свой признак — и четыре вопроса, которые задаст ученик",
  "seg": {
   "a": [
    "Первые три — <b>три проблемы</b>: число старое, сообщение дважды, число меньше",
    "Шесть случаев, которые встречаются в классе. Первые три — три проблемы из урока ученика. Знак «подключено», число старое: нет повторного запроса. Живое сообщение дважды: слушатель внутри connect. «Сейчас смотрят» меньше: нет повторного входа в комнату."
   ],
   "b": [
    "Остальные три: <b>всё «не сломалось», Render долго, агент «исправил»</b>",
    "Четвёртый: все попытки «не сломалось». Авиарежим был коротким или Expo Go перезагрузил приложение, это тоже результат. Пятый: повторный выпуск на Render несколько минут. Шестой: агент сказал «исправил», это нужно перепроверить тем же способом."
   ],
   "c": [
    "Вопросы ученика: <b>зачем исправлять, не отдаст ли сервер заново, что плохого в двойном, Backend</b>",
    "Готовые ответы на вопросы учеников внизу, нажмите, чтобы открыть: зачем исправлять, если socket.io сам переподключается, не может ли сервер отдать пропущенное заново, что плохого, если слушатель двойной, нужно ли исправлять Backend."
   ],
   "d": [
    "Итог: после каждого <b>«выполнил» и «исправил»</b> — снова сломать тем же способом",
    "Итог и способ: если ученик или агент говорит «выполнил», «исправил», повторите вместе с ним тот же способ поломки и посмотрите в записи строку «что было». С этим вы готовы к классу. Теперь проверьте себя."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "Что socket.io сам восстанавливает при переподключении?",
    "e": "Переподключение — новое соединение.",
    "o": [
     "Соединение — но не пропущенные события",
     "Соединение и все пропущенные события",
     "Только события, соединение обновляет страница",
     "Ничего — админ открывает страницу заново"
    ]
   },
   {
    "q": "Что будет с order-changed, отправленным, когда соединения нет?",
    "e": "server.emit — только подключённым.",
    "o": [
     "Встанет в очередь и придёт при переподключении",
     "Придёт вместе со следующим событием",
     "Ни до кого не дойдёт и потом тоже не придёт",
     "Запишется в базу, панель сама его прочитает"
    ]
   },
   {
    "q": "Где и как исправление?",
    "e": "При каждом подключении список из базы.",
    "o": [
     "В gateway — сохранять событие в базу",
     "admin.html — yukla() внутри connect",
     "В боте — отправлять событие дважды",
     "В панели — обновлять страницу каждые 3 с"
    ]
   },
   {
    "q": "Слушатель внутри connect. Сервер дважды перезапустился. Что будет на одном заказе?",
    "e": "При каждом переподключении ещё один слушатель.",
    "o": [
     "Событие вообще не придёт — слушателя нет",
     "Соединение закроется и больше не откроется",
     "Снова запросят токен, админ войдёт заново",
     "Уйдут три GET, жёлтая отметка пропадёт"
    ]
   },
   {
    "q": "DevTools Offline 6 секунд, в этот момент заказ. Результат?",
    "e": "Браузер не закрыл открытое соединение.",
    "o": [
     "Не сломалось — кадр пришёл на Online, список новый",
     "Сломалось — событие потерялось, список старый",
     "Знак сразу стал «Ulanmagan», снова не пытался",
     "Страница сама перезагрузилась, и список обновился"
    ]
   },
   {
    "q": "DevTools Offline 60 секунд. Почему ломается?",
    "e": "Правило 25 + 20 с.",
    "o": [
     "Браузер через минуту сам закрывает страницу",
     "Ping не приходит — клиент рвёт соединение, кадр выбрасывается",
     "Сервер через 60 с отменяет токен",
     "Во время Offline бот не принимает заказы"
    ]
   },
   {
    "q": "Когда connectionStateRecovery не помогает?",
    "e": "Восстановление — в памяти процесса сервера.",
    "o": [
     "При коротком обрыве сети — до двух минут",
     "На транспорте websocket — работает на polling",
     "При перезапуске сервера — состояние было в памяти",
     "Если клиент до обрыва получал события"
    ]
   },
   {
    "q": "AI сказал «проверил, прошло». Что проверите?",
    "e": "Попытка, где событие пришло, — не доказательство.",
    "o": [
     "Выросло ли число тестов и все ли зелёные",
     "Короткий ли diff — мало ли файлов изменилось",
     "Сильная ли модель AI — можно ли верить ответу",
     "Упал ли в проверке старый код — проявилась ли ошибка"
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
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S8, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.S8) || {}) });
  ru(S10, { ...head(10), ...((typeof RU_S !== 'undefined' && RU_S.S10) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S17, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.S17) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S20, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.S20) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P9.S, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.P9_S) || {}) });
  ru(P9.steps, RU_MDT[9].steps);
  ru(P9.trouble, RU_MDT[9].trouble);
  ru(P9.proof, RU_MDT[9].proof);
  ru(P12.S, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.P12_S) || {}) });
  ru(P12.steps, RU_MDT[12].steps);
  ru(P12.trouble, RU_MDT[12].trouble);
  ru(P12.proof, RU_MDT[12].proof);
  ru(P16.S, { ...head(16), ...((typeof RU_S !== 'undefined' && RU_S.P16_S) || {}) });
  ru(P16.steps, RU_MDT[16].steps);
  ru(P16.trouble, RU_MDT[16].trouble);
  ru(P16.proof, RU_MDT[16].proof);
  ru(FINAL, RU_MDT[24].final);
})();
