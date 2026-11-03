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
.mk-ln.wrap{white-space:pre-wrap}
.mk-ln.clk{cursor:pointer}
.mk-ln.clk:hover{background:rgba(232,234,240,.08)}
.mk-ln.bad{background:rgba(226,69,31,.28);box-shadow:inset 3px 0 0 #FCA5A5}
.mk-ln.good{background:rgba(18,128,90,.3);box-shadow:inset 3px 0 0 #86EFAC}
.k{color:#C792EA}.s{color:#C3E88D}.d{color:#FFCB6B}.c{color:#82AAFF}.m{color:#89DDFF}.cm{color:#6B7280;font-style:italic}
.p{color:#7DD3FC}.ok{color:#86EFAC}.er{color:#FCA5A5}.wn{color:#FDE68A}
.mk-light{flex:0 1 auto;max-height:100%;min-height:0;background:${T.paper};border:1px solid ${T.line};border-radius:16px;padding:20px;position:relative;overflow:auto}
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
.mk-say.mc .mk-opt{font-size:16px;padding:13px 16px}
.mk-body.mc-split{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
.mk-body.mc-split>.mk-say.mc>:first-child{margin-top:0}
.mk-title.mc-q{font-size:clamp(19px,1.5vw,22px);font-weight:600;color:${T.ink}}
.mc-wait{border:1.5px dashed ${T.line};border-radius:12px;padding:16px 18px;color:${T.ink3};font-size:14px;background:${T.paper}}
@media (max-width:1300px){.mk-body.mc-split{grid-template-columns:1fr;grid-auto-rows:max-content;overflow:auto}.mk-body.mc-split>.mk-say.mc,.mk-body.mc-split>.mc-after{overflow:visible!important}}
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
.mk-step .cmd{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0}
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
.mk-cover ul{margin:0 0 26px;padding:0;list-style:none;display:grid;gap:8px;color:${T.ink2};font-size:15px}
.mk-cover li::before{content:"—";color:${T.accent};margin-right:10px}
.mk-req{display:grid;gap:8px}
.mk-req button{display:flex;gap:10px;align-items:center;border:1px solid ${T.line};border-radius:10px;background:${T.paper};padding:9px 12px;cursor:pointer;font:600 13px ${MONO};color:${T.ink};text-align:left;transition:border-color .3s}
.mk-req button.hl{border-color:${T.accent}}
.mk-req .st{font:700 11px ${MONO};padding:2px 7px;border-radius:6px;background:#EEF0F4;color:${T.ink2}}
.mk-req .st.s2{background:#E3F5EC;color:${T.green}}.mk-req .st.s4{background:#FFF0EB;color:${T.accent}}
.mk-req pre{margin:6px 0 0;font:12px/1.45 ${MONO};white-space:pre-wrap;color:${T.ink2}}
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
];
const voice = (t) => {
  const keep = [];
  let out = t || '';
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
function CodePanel({ file, lines, beat = 99, focus = [], numbers = true, wrap = false, style, onLine, marks = {} }) {
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
          const cls = `mk-ln${wrap ? ' wrap' : ''}${v ? ' in' : ''}${hl ? ' hl' : (anyFocus && v && !l.keep ? ' dim' : '')}${l.gone ? ' gone' : ''}${l.neu ? ' new' : ''}${onLine ? ' clk' : ''}${mk ? ' ' + mk : ''}`;
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
function MCRetry({ idx, total, onBack, onNext, onRestart, stored, onAnswer, review, kicker, eyebrow, title, q, opts, correct, ok, okShort, wrong, above, after }) {
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
  const fbOk = solved && last === correct;
  // F-1102-16: tuzatilgan/haqiqiy natija bloki bo'lsa — ekran BOSHIDAN ikki ustun va joyi qimirlamaydi:
  // chapda savol va variantlar, o'ngda xabar (above) va javobdan keyin uning ostida natija (after).
  // Javobdan keyin variantlar o'z joyida qoladi (to'g'risi yashil, qolgani xira) — hech narsa sakramaydi.
  const split = !!after;
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
              return <button key={i} className={cls} disabled={solved || bad.includes(i)} onClick={() => pick(i)}><span className="l">{String.fromCharCode(65 + i)}</span><span>{o}</span></button>;
            })}
          </div>
          {last !== null && (
            <div className="mk-fb" key={last + (solved ? 'ok' : 'bad')} style={{ '--c': fbOk ? T.green : T.accent, '--bg': fbOk ? '#E3F5EC' : '#FFF0EB' }}>
              <b>{fbOk ? t("To'g'ri", 'Верно') : t("Unday emas — yana o'ylab ko'ring", 'Не совсем — подумайте ещё раз')}</b>
              <span>{fbOk ? (okShort || digits(ok)) : digits(wrong[last])}</span>
            </div>
          )}
        </div>
        {split && <div className="mk-scene top mc-after" style={{ overflow: 'auto', display: 'grid', gap: 12, alignContent: 'start' }}>
          {above}
          {solved
            ? <div style={{ animation: 'mk-up .45s ease both' }}>{after}</div>
            : <div className="mc-wait">{t("To'g'ri javobni topganingizdan keyin shu yerda haqiqiy natija ochiladi", 'Когда найдёте верный ответ, здесь откроется реальный результат')}</div>}
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
          below={<div className="mk-card" style={{ background: allDone ? '#E3F5EC' : T.paper, borderColor: allDone ? T.green : T.line }}><h5>{t('Bajarildi', 'Выполнено')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{checked.length} / {steps.length} {t('qadam', 'шагов')}{proof ? (proofOk && proofVal.trim() ? t(' · isbot ✓', ' · подтверждение ✓') : t(' · isbot kutilmoqda', ' · ждём подтверждение')) : ''}{allDone ? (b.done ? t(' — Davom bosing', ' — нажмите «Далее»') : t(' — ovoz tugagach Davom ochiladi', ' — «Далее» откроется после озвучки')) : ''}</div>
            {/* F-1102-20: isbot maydoni to'ldirilmaguncha yumshoq yonib-o'chadi — «shu yerga yozing» ko'rinib tursin */}
            {proof && <div style={{ marginTop: 10 }}><div className="exp" style={{ marginBottom: 4, fontWeight: 700, color: proofOk && proofVal.trim() ? T.green : T.ink }}>{t('Isbot', 'Подтверждение')}: {String(proof.label).replace(/^(Isbot|Подтверждение)\s*:\s*/, '')}</div><input className={`mk-input${proofOk && proofVal.trim() ? '' : ' need'}`} value={proofVal} placeholder={proof.placeholder} onChange={(e) => onProof(e.target.value)} />{proofVal.trim() && !proofOk && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{proof.wrong}</div>}</div>}
          </div>} />
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
                    {c && <div style={{ margin: '4px 0 6px' }}><button className="mk-btn soft sm" style={{ borderColor: T.ink, color: T.ink }} onClick={() => setOpenFile(c.file)}>{t('Kodni ochish', 'Открыть код')} · {baseName(c.file)}{c.copy === false ? t(' (namuna)', ' (образец)') : ''}</button></div>}
                    <div className="exp">{t('Kutilgan:', 'Ожидается:')} {s.exp}</div>
                  </div>
                </div>
              ); })}
            </div>
            <Block at={S.tableAt} beat={beat}><div className="mk-light mk-trouble" style={{ padding: 0, marginTop: 10 }}>
              <button type="button" className={`mk-trbtn${beat === S.tableAt && !tOpen ? ' hot' : ''}`} aria-haspopup="dialog" aria-expanded={tOpen} onClick={() => setTOpen(true)}>
                <span className="q">{t('Boshqacha chiqdimi?', 'Вышло иначе?')}</span>
                {rows.length > 1 && <span className="n">{t(`${rows.length - 1} ta holat va yechim`, `ситуации и решения: ${rows.length - 1}`)}</span>}
                <span className="ar" aria-hidden="true">↗</span>
              </button>
            </div></Block>
            {/* F-1102-12: jadval sahifa ichida emas — ustida oyna (popup). ✕, tashqarisi yoki Esc yopadi; tugma joyida qoladi */}
            {tOpen && <TroubleModal rows={rows} onClose={() => setTOpen(false)} />}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  CI/CD-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-matn.py (manba: 14-CICD1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Testlar bor. Ularni har push'da kim yurgizadi?",
  "seg": [
   [
    "a",
    "Testlarni har safar qo'lda yurgizish shart emas — <b>buni lenta qiladi</b>",
    "Assalomu alaykum. Jest darslarida test yozdingiz va har safar npm test'ni o'zingiz yurgizdingiz. Bugun buni har push'da avtomatik qiladigan lentani ko'ramiz: CI/CD."
   ],
   [
    "b",
    "Avval tushuncha, keyin o'quvchi reposini <b>lentadan qo'lda o'tkazamiz</b>",
    "Avval tushunchani ko'ramiz: CI nima va CD nima. Keyin o'quvchi reposini toza papkada lentadan qo'lda o'tkazamiz va qaysi qadamda qizil bo'lishini ko'ramiz."
   ],
   [
    "c",
    "Keyin <code>ci.yml</code> faylini o'qiymiz va uni <b>ataylab buzib</b>, xabarlarni ko'ramiz",
    "Keyin lenta faylini, ci yml'ni o'qiymiz, uni ataylab buzamiz va xabarlarni ko'ramiz. Oxirida chiqarish turlarini va o'quvchi darsini ko'ramiz."
   ],
   [
    "d",
    "Olti bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · tushuncha",
  "title": "Har push'dan keyin besh qadam: o'rnatish, test, lint, build, chiqarish",
  "seg": [
   [
    "a",
    "Qo'lda: har push'dan keyin <b>besh buyruqni</b> o'zingiz, tartib bilan yurgizasiz",
    "Kod yozildi va push qilindi. Endi qo'lda besh ish qilinadi: paketlarni o'rnatish, testlarni yurgizish, kod yozilish qoidasini tekshirish, build va saytni chiqarish. Bularning hammasi har push'da, tartib bilan qilinadi."
   ],
   [
    "b",
    "Muammo: sekin, zerikarli va bir kuni <b>bittasini unutasiz</b>",
    "Muammo shu: bu sekin va zerikarli. Bir kuni shoshilib testni tashlab ketasiz, buzuq kod foydalanuvchiga chiqadi. O'quvchi darsi ham aynan shu holatdan boshlanadi."
   ],
   [
    "c",
    "Lenta — xuddi shu besh qadamni har push'da <b>o'zi bajaradi</b>",
    "Lenta, inglizchasi pipeline, xuddi shu qadamlarni har push'da o'zi bajaradi. Yangi buyruq yo'q: lentada sizning terminalingizdagi buyruqlar yuradi."
   ],
   [
    "d",
    "Xulosa: lenta yangi narsa emas — <b>terminal buyruqlarini avtomatik</b> va tartib bilan yurgizadi",
    "Xulosa: lenta yangi narsa emas. U terminal buyruqlarini avtomatik va har safar bir xil tartibda yurgizadi. O'quvchi darsida bu nuqtalar aeroport nomlari bilan atalgan, ularni oxirida ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · tushuncha",
  "title": "Continuous Integration: har kimning kodi umumiy repoga qo'shiladi va tekshiriladi",
  "seg": [
   [
    "a",
    "CI — Continuous Integration: kod umumiy repoga qo'<b>shilishi bilan tekshiriladi</b>",
    "Lenta har push'da aylanadi, demak avval push'ning o'zi. CI bu Continuous Integration, ya'ni uzluksiz birlashtirish. Har kim o'z kompyuterida yozadi, push qiladi, kod umumiy repoga qo'shiladi va shu zahoti tekshiriladi."
   ],
   [
    "b",
    "Tekshirishni hech kim so'ramaydi: lentani <b>push'ning o'zi</b> darhol boshlab beradi",
    "Tekshirishni hech kim so'ramaydi va hafta oxirini kutmaydi. Push'ning o'zi lentani boshlaydi. Kuniga o'n marta push bo'lsa, lenta o'n marta aylanadi."
   ],
   [
    "c",
    "Hamma <b>bir xil sharoitda</b>: «mening kompyuterimda ishlayapti» muammosi tugaydi",
    "Eng muhimi: hammaning kodi bir xil toza mashinada sinaladi. Vali uyida ishlagan, lentada qizil bo'lsa, xato uyidagi sozlamada yashiringan bo'ladi."
   ],
   [
    "d",
    "Xulosa: CI har push'ni <b>bir xil toza sharoitda</b>, darhol tekshiradi",
    "Xulosa: CI har push'ni darhol va bir xil toza sharoitda tekshiradi. Toza sharoit nimani anglatishini keyingi ekranda ko'ramiz, chunki o'quvchi reposidagi ko'p qizillar shundan keladi."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · tushuncha",
  "title": "Lenta mashinasi har safar bo'sh papkadan boshlaydi va chiqish kodiga qaraydi",
  "seg": [
   [
    "a",
    "Lenta mashinasi — GitHub'dagi <b>toza kompyuter</b>, sizniki emas",
    "Lenta qayerda yuradi? GitHub'dagi alohida kompyuterda, inglizchasi runner. Hozir ubuntu latest degani Ubuntu yigirma to'rt, unda Node yigirma ikki o'rnatilgan. Sizning kompyuteringiz o'chiq bo'lsa ham ishlaydi."
   ],
   [
    "b",
    "Har safar <b>bo'sh papka</b>: <code>node_modules</code> ham, <code>.env</code> ham yo'q",
    "Har safar bo'sh papkadan boshlaydi. Sizning node modules papkangiz ham, env faylingiz ham u yerda yo'q. Shuning uchun lentada o'rnatish qadami albatta bor."
   ],
   [
    "c",
    "Har buyruq <b>chiqish kodi</b> qaytaradi: 0 — yashil, 1 — qizil",
    "Lenta qanday biladi: o'tdimi yoki yo'qmi? Har buyruq tugaganda bitta son qaytaradi, uni chiqish kodi deyishadi. Test yashil bo'lsa nol, qizil bo'lsa bir. Lenta faqat shu songa qaraydi."
   ],
   [
    "d",
    "Xulosa: lenta = <b>toza papka</b> + sizning buyruqlaringiz + <b>chiqish kodi</b>",
    "Xulosa: lenta bu toza papka, sizning buyruqlaringiz va chiqish kodi. Nol bo'lmagan kod chiqqan qadamdan keyin lenta to'xtaydi. Endi buni tekshirib olaylik."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Lentada npm test chiqish kodi 1 qaytardi. Keyin nima bo'ladi?",
  "q": "Lenta mashinasini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Lentada npm test chiqish kodi bir qaytardi. Keyin nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Bir qizil degani. Lenta shu qadamda to'xtaydi, build ham, chiqarish ham yurmaydi. Foydalanuvchi eski, ishlayotgan saytni ko'radi, buzuq yuk uchmaydi. Demak, nol bo'lmagan chiqish kodi chiqqan joyda lenta to'xtaydi va keyingi qadamlar yurmaydi.",
  "okShort": "Kod 1 — qizil: lenta to'xtaydi, buzuq yuk chiqmaydi.",
  "hint": "Chiqish kodi 0 emas — qizil. Qizil qadamdan keyin lenta nima qiladi?",
  "correct": 2,
  "opts": [
   "Lenta davom etadi, build va chiqarish ham yuradi",
   "Lenta xatoni o'zi tuzatadi",
   "Lenta to'xtaydi, keyingi qadamlar yurmaydi, eski sayt joyida qoladi",
   "Sayt o'chib qoladi"
  ],
  "wrong": {
   "0": "Davom etsa, tekshirilmagan kod chiqadi — lenta buning teskarisi uchun bor.",
   "1": "Lenta kod yozmaydi: tuzatish dasturchining ishi.",
   "3": "Chiqarish yurmagani uchun eski versiya joyida qoladi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'quvchi reposi",
  "title": "CI andozalarining o'rnatish buyrug'i — npm ci. O'quvchi reposida u yiqiladi",
  "seg": [
   [
    "a",
    "Endi o'quvchi reposini lentadagidek o'tkazamiz: <b>toza clone</b>, toza muhit",
    "Endi o'quvchi reposini lentadagidek o'tkazamiz: GitHub'dan yangi clone, toza papka, toza muhit. Lentaning birinchi qadami paketlarni o'rnatish."
   ],
   [
    "b",
    "GitHub'ning tayyor Node.js andozasida ham <code>npm ci</code> turadi — u <b>lock faylga qat'iy</b> amal qiladi",
    "GitHub Actions'dagi tayyor Node.js andozasini tanlasangiz ham, o'rnatish buyrug'i npm ci bo'ladi. U package lock fayliga qat'iy amal qiladi: ikkala fayl mos bo'lmasa, hech narsa o'rnatmaydi."
   ],
   [
    "c",
    "O'quvchi reposida lock fayl eskirgan: <code>npm ci</code> — <b><code>in sync</code> xatosi</b>, kod 1",
    "O'quvchi reposida lock fayl eskirgan: unda yangi paketlar yo'q. Natijada in sync xatosi chiqadi, chiqish kodi bir. Lenta birinchi qadamdayoq qizil bo'ladi, test'gacha yetmaydi."
   ],
   [
    "d",
    "Xulosa: o'quvchi reposida o'rnatish — <b><code>npm install</code></b>; <code>npm ci</code> bilan lenta qizil",
    "Xulosa: bu repoda o'rnatish qadami npm install bo'lsin. U ishlaydi va yetti yuz ellik to'qqiz paketni o'rnatadi. Jest birinchi darsida ham shu sabab bilan npm install ishlatgan edik."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'quvchi reposi",
  "title": "Test fayli yo'q repoda npm test — No tests found, kod 1",
  "seg": [
   [
    "a",
    "Ikkinchi qadam — test. O'quvchi reposida hali <b>bitta ham test yo'q</b>",
    "Ikkinchi qadam testlar. Toza clone'da o'quvchi reposida bitta ham test fayli yo'q: testlarni o'quvchi o'zi qo'shadi."
   ],
   [
    "b",
    "<code>No tests found, exiting with code 1</code> — lenta buni <b>qizil deb biladi</b>",
    "Natijada no tests found, exiting with code one chiqadi. Jest testni topmasa, chiqish kodi bir bilan tugaydi. Lenta buni xato deb biladi va to'xtaydi."
   ],
   [
    "c",
    "Jest-1 dagi <code>order.spec.ts</code> qo'shilgach — <b>PASS va kod 0</b>",
    "Jest birinchi darsidagi order spec faylini qo'shamiz. Natijada PASS chiqadi: bitta test o'tdi, chiqish kodi nol. Endi lenta keyingi qadamga o'tadi."
   ],
   [
    "d",
    "Xulosa: lentaga test qadami qo'yishdan oldin repoda <b>kamida bitta test</b> bo'lsin",
    "Xulosa: lentaga test qadamini qo'yishdan oldin repoda kamida bitta test bo'lsin. Aks holda lenta birinchi kundanoq qizil bo'ladi. Sinfda bu o'quvchilarda albatta chiqadi."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'quvchi reposi",
  "title": "npm run build yashil. && zanjiri — lenta qoidasining o'zi",
  "seg": [
   [
    "a",
    "Uchinchi qadam — build: <code>nest build</code>, <b>xatosiz, kod 0</b>",
    "Uchinchi qadam build. Nest build TypeScript'ni JavaScript'ga aylantiradi. O'quvchi reposida xatosiz o'tadi, chiqish kodi nol."
   ],
   [
    "b",
    "<code>&amp;&amp;</code> — oldingi buyruq <b>yashil bo'lsagina</b> keyingisi yuradi",
    "Lenta qoidasini terminalda ko'rish mumkin. Buyruqlar orasidagi ikki ampersand shuni bildiradi: oldingi buyruq nol qaytarsagina keyingisi yuradi. Uch buyruqni shunday ulaymiz, oxiriga esa uchirish so'zini chiqaradigan buyruq qo'yamiz."
   ],
   [
    "c",
    "Test qizil — build ham, «UCHIRISH» ham <b>yurmadi</b>; test yashil — hammasi yurdi",
    "Kodni ataylab buzdik: test qizil bo'ldi, build yurmadi, uchirish yozuvi chiqmadi, chiqish kodi bir. Tuzatgandan keyin hammasi yurdi va oxirida uchirish chiqdi. Lenta aynan shunday ishlaydi."
   ],
   [
    "d",
    "Xulosa: lenta — <code>&amp;&amp;</code> bilan ulangan buyruqlar; <b>birinchi qizilda to'xtaydi</b>",
    "Xulosa: lentani ikki ampersand bilan ulangan buyruqlar deb tasavvur qiling. Birinchi qizil qadamda to'xtaydi. Endi buni o'zingiz yurgizasiz."
   ]
  ]
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Toza clone'da uch qadam va && zanjiri",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi reposini toza papkada <b>lentadagidek</b> o'tkazasiz",
    "Endi navbat sizga. O'quvchi reposini yangi papkaga clone qiling va lentadagidek uch qadamdan o'tkazing. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: clone va <code>npm ci</code> — <b><code>in sync</code></b> xatosini ko'ring, keyin <code>npm install</code>",
    "Birinchi qadamda reponi yangi papkaga clone qilasiz. Ikkinchisida avval npm ci qilib, in sync xatosini o'qiysiz, keyin npm install qilasiz."
   ],
   [
    "c",
    "3–4-qadam: <code>order</code> fayllari va zanjir; isbot — <b>oxirgi satr</b>",
    "Uchinchi qadamda Jest birinchi darsidagi ikki order faylini qo'shasiz. To'rtinchisida zanjirni yurgizasiz. Isbot maydoniga oxirgi satrni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'quvchi reposi qaysi qadamda qizil bo'lishini va qanday tuzatilishini o'z qo'lingiz bilan ko'rdingiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · ci.yml",
  "title": "ci.yml: qachon (on), qayerda (runs-on), nima (steps)",
  "seg": [
   [
    "a",
    "Lenta qayerda yoziladi: repodagi <b><code>.github/workflows/ci.yml</code></b> faylida, GitHub uni o'zi topadi",
    "Lenta qayerda yoziladi? Repodagi nuqta github, workflows papkasidagi yml faylida. GitHub shu papkani o'zi topadi. O'quvchi darsida bu fayl yo'l xaritasi deyiladi."
   ],
   [
    "b",
    "<code>on: push</code> — <b>qachon</b>: har push'da lenta o'zi boshlanadi",
    "Birinchi qator on push lenta qachon boshlanishini aytadi: har push'da u o'zi boshlanadi. Bu start signali."
   ],
   [
    "c",
    "<code>runs-on</code> — <b>qaysi mashinada</b>; <code>steps</code> — <b>qaysi buyruqlar</b>, yuqoridan pastga",
    "Runs on qaysi mashinada yurishini aytadi: ubuntu latest. Steps esa qaysi buyruqlar yurishini aytadi: har chiziqcha bitta qadam, ular yuqoridan pastga bajariladi. Surilish muhim: har qator kimning ichida turganini ko'rsatadi."
   ],
   [
    "d",
    "Xulosa: <code>on</code> · <code>runs-on</code> · <code>steps</code> — o'quvchi darsidagi <b>uch bo'shliq</b> aynan shular",
    "Xulosa: faylning asosi uchta: on, runs on va steps. O'quvchi darsida aynan shu uch joy bo'sh qoldirilgan va o'quvchi to'ldiradi. Lekin bu faylda bitta muhim qadam yetishmaydi, uni keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · ci.yml",
  "title": "Rasmiy tahlilchi «xato yo'q» deydi — lekin mashinadagi papka bo'sh",
  "seg": [
   [
    "a",
    "Faylni GitHub'ning rasmiy tahlilchisida tekshirdik: u <b>«xato yo'q»</b> deb javob berdi",
    "O'quvchi darsidagi faylni GitHub'ning rasmiy tahlilchisida tekshirdik. Natija: xato yo'q, ya'ni fayl to'g'ri yozilgan. Lekin yozilishi to'g'ri degani, ishlaydi degani emas."
   ],
   [
    "b",
    "Lenta mashinasi bo'sh papkada: repodagi kodni <b><code>actions/checkout</code></b> olib keladi",
    "Eslang: mashina bo'sh papkadan boshlaydi. Repodagi kodni u yerga olib keladigan qadam actions checkout. Hujjati shunday deydi. O'quvchi faylida bu qadam yo'q."
   ],
   [
    "c",
    "Checkout'siz <code>npm install</code> — <b><code>Could not read package.json</code></b>",
    "Bo'sh papkada npm install'ni yurgizdik va could not read package json xatosini oldik. Package json yo'q, chunki kod kelmagan. GitHub'da ham sinadik: checkout'siz lentada xuddi shu xato, lenta qizil."
   ],
   [
    "d",
    "Xulosa: har lentaning birinchi qadami — kodni olib keladigan <b><code>actions/checkout</code></b>",
    "Xulosa: har lentaning birinchi qadami actions checkout. O'quvchilarga checkout m4c-03 da o'rgatiladi, amaliyot esa m4c-01 da. Shuning uchun amaliyotda bu qatorni o'zingiz qo'shtirasiz."
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "3-bosqich · ci.yml",
  "title": "Checkout, Node, install, test, build — besh qadam, tahlilchida xatosiz",
  "seg": [
   [
    "a",
    "<code>uses</code> — <b>tayyor qadam</b>: checkout kodni olib keladi, setup-node Node'ni o'rnatadi",
    "Checkout kerakligini ko'rdik, endi to'liq fayl. Unda uses bilan yozilgan ikki yangi qadam bor: bular boshqalar yozib qo'ygan tayyor qadamlar. Checkout kodni olib keladi. Setup node kerakli Node versiyasini o'rnatadi, bu yerda yigirma ikki."
   ],
   [
    "b",
    "<code>run</code> — <b>sizning buyruqlaringiz</b>: <code>npm install</code>, <code>npm test</code>, <code>npm run build</code>",
    "Qolgan qadamlar run bilan yoziladi, ular sizning buyruqlaringiz: npm install, npm test va npm run build. Bular amaliyotda terminalda yurgizgan uchta buyrug'ingiz."
   ],
   [
    "c",
    "Versiyalar: hozir checkout va setup-node — <b>v7</b>; o'quvchi darsida <b>v4</b> yozilgan",
    "Endi versiyalar haqida. GitHub'da hozirgi so'nggi versiya yettinchi. O'quvchi m4c-03 darsida to'rtinchi versiya yozilgan. To'rtinchisi ham ishlaydi, lekin GitHub har safar eskirgan deb ogohlantiradi. Shuning uchun yettinchisini tavsiya qilamiz."
   ],
   [
    "d",
    "Xulosa: bu fayl o'quvchi reposi uchun — <b>lint qadamisiz</b>, sababini 15-ekranda ko'ramiz",
    "Xulosa: o'quvchi reposi uchun shu besh qadam yetadi. Lint qadami ataylab yo'q, sababini o'n beshinchi ekranda ko'ramiz. Fayl tahlilchida xatosiz."
   ]
  ]
 },
 "13": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Fayl to'g'ri yozilgan, lekin o'quvchi reposida lenta birinchi run qadamida qizil",
  "q": "Faylni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu fayl yozilishi bo'yicha to'g'ri, lekin o'quvchi reposida lenta birinchi buyruqdayoq qizil. Shu satrni bosing.",
  "ok": "To'g'ri. O'n birinchi satr, npm ci. O'quvchi reposida lock fayl eskirgan, npm ci in sync xatosi bilan to'xtaydi. Bu repoda npm install yozamiz. Ekranda tuzatilgan holat. Demak, lock fayli eskirgan repoda lentaning o'rnatish qadami npm install bo'ladi.",
  "okShort": "11-satr: <code>npm ci</code> — lock sinxron emas. Bu repoda <code>npm install</code>.",
  "hint": "Lentaning birinchi buyrug'i qaysi? Toza clone'da u nima degan edi (6-ekran)?",
  "task": "Bu <code>ci.yml</code> tahlilchida xatosiz. Lekin o'quvchi reposida lenta birinchi buyruqdayoq qizil bo'ladi. <b>Shu satrni bosing.</b>"
 },
 "14": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'z reposingizga lenta: push va Actions'ni kuzatish",
  "seg": [
   [
    "a",
    "Endi siz: o'z GitHub reposingizga lenta qo'shasiz va <b>birinchi yashilni</b> ko'rasiz",
    "Endi o'z reposingizga lenta qo'shasiz. Jest darslaridagi repo bo'lsa yaxshi, unda testlar bor. Bunga o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>.github/workflows/ci.yml</code> — tavsiya fayl; <b>commit va push</b>",
    "Birinchi qadamda nuqta github, workflows papkasida ci yml faylini yaratasiz: o'n ikkinchi ekrandagi fayl. Ikkinchisida commit va push qilasiz."
   ],
   [
    "c",
    "3–4-qadam: Actions bo'limi, qadamlar ro'yxati; isbot — <code>npm test</code> qadamidagi <b><code>Tests:</code> satri</b>",
    "Uchinchi qadamda GitHub'da Actions bo'limini ochib, lentani kuzatasiz. To'rtinchisida npm test qadamini ochib, Tests satrini isbot maydoniga nusxalaysiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning reposingizda har push'da o'zi yuradigan lenta bor."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "O'quvchi darsidagi «O'lcham ramkasi» — o'quvchi reposida lint 46 error",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi lentada lint nuqtasi bor — o'quvchi reposida <b>sinab ko'rdik</b>",
    "O'quvchi darsidagi lentada o'lcham ramkasi bor, ya'ni lint: kod yozilish qoidasi. O'quvchi reposida npm run lint'ni yurgizdik."
   ],
   [
    "b",
    "Natija: <b>46 error</b>, chiqish kodi 1 — lint qadami qo'yilsa, lenta har safar qizil",
    "Natijada qirq olti error chiqdi, chiqish kodi bir. Repoda yozilish qoidasi buzilgan joylar ko'p. Lentaga lint qadami qo'yilsa, u har safar qizil bo'ladi, kod ishlasa ham."
   ],
   [
    "c",
    "Diqqat: skriptda <code>--fix</code> bor — u <b>14 faylni o'zgartirib</b> qo'ydi",
    "Yana bir narsa: o'quvchi reposidagi lint skriptida fix bor. U o'n to'rt faylni o'zi o'zgartirib qo'ydi. Lentada fayl o'zgartiradigan buyruq bo'lmasligi kerak."
   ],
   [
    "d",
    "Xulosa: bu repoda lint — <b>alohida ish</b>; lentaga test va build yetadi",
    "Xulosa: bu repoda lint alohida ish, avval xatolar tozalanadi. Hozircha lentaga test va build yetadi. O'quvchi lint haqida so'rasa, shu raqamni ayting."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "* o'rniga +: lentada FAIL, build yurmaydi",
  "seg": [
   [
    "a",
    "Jest-1 dagi buzish: <b><code>price + quantity</code></b> — lentada nima bo'ladi?",
    "Jest birinchi darsidagi buzishni lentada ko'ramiz: ko'paytirish o'rniga qo'shish yozamiz va push qilamiz."
   ],
   [
    "b",
    "Test qadami qizil: Expected 20000, <b>Received 10002</b>, kod 1",
    "Test qadami qizil: expected yigirma ming, received o'n ming ikki, chiqish kodi bir. Jest birinchi darsidagi xabarning o'zi, faqat endi u lenta logida."
   ],
   [
    "c",
    "Build va chiqarish kulrang — yurmadi; foydalanuvchi <b>eski saytni</b> ko'radi",
    "Keyingi qadamlar, build ham, chiqarish ham, yurmadi. Buzuq kod foydalanuvchiga yetmadi, eski versiya ishlab turibdi. Dasturchi qizilni ko'radi va tuzatadi."
   ],
   [
    "d",
    "Xulosa: qizil lenta — yomon emas; u xatoni foydalanuvchidan <b>oldin ushladi</b>",
    "Xulosa: qizil lenta yomon narsa emas. U xatoni foydalanuvchidan oldin ushladi. O'quvchiga shuni ayting: qizil, lenta ishlayapti degani."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "on: once, runs-on yo'q, surilish — uch xato va ularning xabari",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi noto'g'ri variantlar: <code>once</code>, <code>my-laptop</code> — <b>tahlilchida sinadik</b>",
    "O'quvchi darsida noto'g'ri variantlar bor: once, my laptop. Ularni va o'quvchilar ko'p qiladigan xatolarni rasmiy tahlilchida sinadik."
   ],
   [
    "b",
    "<code>on: once</code> — <b><code>Unexpected value</code></b>; <code>runs-on</code> yo'q — <b><code>Required property is missing</code></b>",
    "On once yozilsa, tahlilchi unexpected value deydi, ya'ni kutilmagan qiymat. Runs on qatori bo'lmasa, required property is missing deydi, ya'ni majburiy qator yetishmaydi. Ikkalasida ham qator raqami ko'rsatiladi."
   ],
   [
    "c",
    "Surilish xatosi — xabar tushunarsiz, lekin <b>qator raqami to'g'ri</b>",
    "Eng ko'p uchraydigani surilish: bitta chiziqcha boshqa joyga siljigan. Uning xabari tushunarsiz: block sequence, implicit map key. Lekin qator raqami to'g'ri ko'rsatiladi, o'sha qatorga qarang."
   ],
   [
    "d",
    "Xulosa: YAML xabarida avval <b>qator raqamini</b> o'qing, keyin surilishni solishtiring",
    "Xulosa: YAML xatosida avval qator raqamini o'qing, keyin o'sha qatorning surilishini yuqoridagi qator bilan solishtiring. GitHub'da bunday faylda lenta darhol qizil bo'ladi, ichida qadam ham, log ham yo'q. GitHub sahifasida surilish xatosi umumiy yaml syntax xabari bo'lib chiqadi va qator raqami blok boshini ko'rsatishi mumkin."
   ]
  ]
 },
 "18": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi: «Lentam birinchi qadamda qizil: npm ci can only install packages when … in sync». Sabab?",
  "q": "Buzishlarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi lentasi birinchi qadamda qizil, xabarda in sync. Sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Lock fayl package json'ga mos emas, npm ci bunday holatda hech narsa o'rnatmaydi. O'quvchi reposida aynan shunday. Yechim: npm install yozish yoki lock faylni yangilab push qilish. Demak, in sync xatosi chiqsa, sabab kodda emas, lock faylda.",
  "okShort": "<code>in sync</code> — lock fayl mos emas: <code>npm install</code> yoki lock'ni yangilash.",
  "hint": "Xabardagi ikki fayl nomini o'qing: qaysi ikki fayl mos emas?",
  "correct": 1,
  "opts": [
   "Testlar yiqildi",
   "Lock fayl package.jsonga mos emas — bu repoda npm install",
   "Checkout qadami yo'q",
   "GitHub ishlamayapti"
  ],
  "wrong": {
   "0": "Test'gacha yetmadi: xato o'rnatish qadamida.",
   "2": "Checkout'siz xabar boshqacha: Could not read package.json.",
   "3": "Xabar npm'dan keldi va sababini aniq aytyapti."
  }
 },
 "19": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Ataylab buzing, qizil lentani o'qing, tuzating",
  "seg": [
   [
    "a",
    "Endi siz: kodni ataylab buzasiz va lentaning qizilini <b>o'z ko'zingiz bilan</b> ko'rasiz",
    "Oxirgi amaliyot: kodni ataylab buzasiz va lentaning qizilini o'zingiz ko'rasiz. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>*</code> o'rniga <code>+</code>, push — <b>Actions'da qizil</b>",
    "Birinchi qadamda order ts'da ko'paytirish o'rniga qo'shish yozasiz. Ikkinchisida commit va push qilib, Actions'da lenta qizil bo'lishini kutasiz."
   ],
   [
    "c",
    "3–4-qadam: qizil qadamdagi <code>Received</code>, keyin tuzatish va yashil; isbot — <b><code>Received</code> qiymati</b>",
    "Uchinchi qadamda qizil qadamni ochib, received qiymatini o'qiysiz. To'rtinchisida xatoni tuzatib, push qilasiz va yashil lentani ko'rasiz. Isbot maydoniga received qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz qizil lentaning logini o'qib, xatoni tuzatib, lentani yana yashilga qaytardingiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · CD",
  "title": "CD — tekshirilgan yukni chiqarish: tasdiq bilan yoki o'zi",
  "seg": [
   [
    "a",
    "CI tekshiradi; CD — tekshiruvdan o'tgan yukni foydalanuvchiga <b>chiqaradi</b>",
    "Lentamiz kodni build'gacha tekshirdi, bu CI. CD esa tekshiruvdan o'tgan yukni chiqaradi. O'quvchi darsida ikki rejim bor va ular faqat oxirgi qadamda farq qiladi."
   ],
   [
    "b",
    "Continuous Delivery — hammasi tayyor, lekin chiqarishni <b>odam tasdiqlaydi</b>",
    "Continuous Delivery, ya'ni yetkazishda lenta oxirigacha yetadi va yuk tayyor turadi. Chiqarishni mas'ul odam tasdiqlaydi. Pul o'tkazish ilovasi kabi joylarda shunday."
   ],
   [
    "c",
    "Continuous Deployment — hamma qadam yashil bo'lsa, <b>o'zi chiqaradi</b>",
    "Continuous Deployment'da esa hamma qadam yashil bo'lsa, hech kimdan so'ramay o'zi chiqaradi. Chiqarish uchun parol va kalitlar kerak, ular faylda emas, GitHub Secrets'da saqlanadi."
   ],
   [
    "d",
    "Xulosa: Delivery — <b>tasdiq bilan</b>, Deployment — <b>o'zi</b>; chiqarishni kursda keyin qilamiz",
    "Xulosa: Delivery'da chiqarishni odam tasdiqlaydi, Deployment'da lenta o'zi chiqaradi. Bugun lentamiz build'da tugaydi. Haqiqiy chiqarishni o'quvchilar loyiha kunlarida qiladi."
   ]
  ]
 },
 "21": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Pul o'tkazish ilovasi: har yangilanishni mas'ul xodim ko'rib chiqadi. Qaysi rejim?",
  "q": "Chiqarish rejimlarini ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Pul o'tkazish ilovasida har yangilanishni mas'ul xodim ko'rib chiqadi. Qaysi rejim mos? Variantni tanlang.",
  "ok": "To'g'ri, Delivery. Tekshiruvni lenta qiladi, chiqarishni xodim tasdiqlaydi. Deployment bo'lsa, xodim ko'rib chiqishga ulgurmaydi. Demak, chiqarishni odam tasdiqlasa Delivery, lenta o'zi chiqarsa Deployment.",
  "okShort": "Delivery: lenta tekshiradi, xodim tasdiqlaydi.",
  "hint": "Shartdagi kalit so'z: «ko'rib chiqadi». Qaysi rejimda tasdiq bor?",
  "correct": 0,
  "opts": [
   "Delivery — tekshiruvdan keyin tasdiq bilan chiqadi",
   "Deployment — o'zi chiqadi",
   "Lentasiz — hammasi qo'lda",
   "Faqat CI, chiqarish umuman yo'q"
  ],
  "wrong": {
   "1": "Tasdiqsiz chiqsa, xodim ko'rishga ulgurmaydi.",
   "2": "Tekshiruvni lenta qilsa ham bo'ladi — faqat chiqarish tasdiq bilan.",
   "3": "Ilova yangilanishi baribir chiqishi kerak."
  }
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4c-01 · «CI/CD nima va nega kerak»",
  "title": "m4c-01: aeroport lentasi, chamadon va yo'l xaritasi",
  "seg": [
   [
    "a",
    "m4c-01 — 21 ekran: <b>aeroport lentasi</b>, chamadon va yo'l xaritasi",
    "Endi o'quvchi darsini ko'ramiz: m4c-01, unda yigirma bir ekran bor. Darsda kod chamadonga, lenta aeroport lentasiga, ci yml esa yo'l xaritasiga o'xshatiladi. Lentada beshta nuqta bor: yig'ish, skaner, o'lcham ramkasi, o'rash va uchirish."
   ],
   [
    "b",
    "Amaliyotdagi <code>ci.yml</code>da <b>checkout yo'q</b> — o'quvchilarga bu qatorni qo'shtiring",
    "Eng muhim ogohlantirish: amaliyotdagi ci yml'da checkout yo'q. Uni yozmasa, lenta qizil bo'ladi. O'quvchilarga birinchi qadam sifatida actions checkout'ni qo'shtiring va o'rnatishni npm install bilan qoldiring."
   ],
   [
    "c",
    "O'quvchi lentasida lint nuqtasi bor — o'quvchi reposida u qizil, <b>oldindan ayting</b>",
    "Lenta o'yinida lint nuqtasi bor. O'quvchi uni lentaga qo'shmoqchi bo'lsa, oldindan ayting: bu repoda lint qirq olti error beradi."
   ],
   [
    "d",
    "Xulosa: vaqt — amaliyotga ko'proq; har o'quvchi Actions'da <b>bitta yashil</b> ko'rsin",
    "Xulosa: vaqt bo'yicha taklif, to'qson daqiqaning o'ttizini amaliyotga bering. Har o'quvchi Actions'da bitta yashil lentani o'z ko'zi bilan ko'rsin, qolgani shundan keyin oson."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Lenta nuqtalari — buyruqlar; olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "O'quvchi darsi aeroport so'zlarini ishlatadi — siz <b>buyruqni birga aytasiz</b>",
    "Xaritani ko'rdingiz, endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz. O'quvchi darsi aeroport so'zlarini ishlatadi: yig'ish, skaner, o'rash. Siz har so'z bilan buyruqni birga ayting: skaner, ya'ni npm test."
   ],
   [
    "b",
    "<b>Uch xabar uch sabab</b>: <code>Could not read package.json</code>, <code>in sync</code>, <code>No tests found</code>",
    "Endi sinfda albatta chiqadigan holatlar. Birinchi uchtasi xabardan taniladi. Could not read package json chiqsa, checkout yo'q. In sync chiqsa, sabab npm ci. No tests found chiqsa, repoda test yo'q."
   ],
   [
    "c",
    "Lint 46 error, YAML qator raqami, Actions bo'sh — sababi <b>bir qarashda</b>",
    "Lint qirq olti error bersa, uni lentadan olib turing. YAML xatosida avval qator raqamini o'qing. Actions bo'limi bo'sh bo'lsa, papka nomi noto'g'ri yozilgan."
   ],
   [
    "d",
    "Xulosa: lenta logini o'quvchi bilan <b>birga o'qing</b> — qaysi qadam qizil, keyin xabar",
    "Xulosa va usul bitta: javobni darhol aytmang, lenta logini o'quvchi bilan birga o'qing. Avval qaysi qadam qizil ekanini toping, keyin uning xabarini o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Lenta qadam qizilligini nimadan biladi?",
    "o": [
     "chiqish kodi 0 emas",
     "log uzunligi",
     "vaqt",
     "fayl hajmi"
    ],
    "c": 0,
    "e": "0 — yashil, boshqasi — qizil.",
    "s": 4
   },
   {
    "q": "Lenta mashinasi har safar qanday papkadan boshlaydi?",
    "o": [
     "sizning papkangizdan",
     "bo'sh papkadan",
     "oldingi lentadan",
     "node_modules bilan"
    ],
    "c": 1,
    "e": "Shuning uchun checkout va install kerak.",
    "s": 4
   },
   {
    "q": "O'quvchi reposida npm ci nima beradi?",
    "o": [
     "PASS",
     "No tests found",
     "in sync xatosi, kod 1",
     "759 paket"
    ],
    "c": 2,
    "e": "Lock fayl eskirgan.",
    "s": 6
   },
   {
    "q": "Test fayli yo'q repoda npm test?",
    "o": [
     "PASS",
     "build yuradi",
     "hech narsa",
     "No tests found, kod 1"
    ],
    "c": 3,
    "e": "Lenta qizil.",
    "s": 7
   },
   {
    "q": "ci.ymlda actions/checkout yo'q bo'lsa?",
    "o": [
     "papka bo'sh — Could not read package.json",
     "tahlilchi xato beradi",
     "lenta yuradi",
     "testlar o'tadi"
    ],
    "c": 0,
    "e": "Tahlilchi xato bermaydi — yozilishi to'g'ri.",
    "s": 11
   },
   {
    "q": "O'quvchi reposida lint qadami lentada?",
    "o": [
     "yashil",
     "46 error — qizil",
     "yurmaydi",
     "faqat ogohlantirish"
    ],
    "c": 1,
    "e": "--fix ham 14 faylni o'zgartiradi.",
    "s": 15
   },
   {
    "q": "npm test && npm run build, test qizil — build?",
    "o": [
     "yuradi",
     "yarim yuradi",
     "yurmaydi",
     "ikki marta yuradi"
    ],
    "c": 2,
    "e": "&& — oldingisi yashil bo'lsa.",
    "s": 8
   },
   {
    "q": "Har yangilanish tasdiq bilan chiqadi — bu?",
    "o": [
     "Deployment",
     "CI",
     "lentasiz",
     "Delivery"
    ],
    "c": 3,
    "e": "Delivery — tasdiq bilan.",
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
//  MENTOR KURSI · CI/CD-1 «CI/CD nima va nega: lenta o'quvchi reposida»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/14-CICD1-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/cicd1-out/ (00–12; toza clone, env -i, CI=true)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd1/parts/*.jsx > CiCdIntroMentorLesson.jsx
//  Yordamchilar Jest-2 dan nusxa + YAML rang beruvchi, lenta chizig'i, Actions oynasi (haqiqiy run qadamlaridan, cicd2-out/21)
// ============================================================
const LESSON_ID = 'mentor-cicd-01-lenta-v1';
const LESSON_TITLE = "CI/CD nima va nega: lenta o'quvchi reposida";
const PG = { term: '#111827', termEr: '#1F1115', gh: '#1F2328' };
MKCFG.root = 'IntroNestArxitechture';
MKCFG.kind = (f) => /\.ya?ml$/.test(f) ? T.green : /\.spec\.ts$/.test(f) ? T.purple : /\.ts$/.test(f) ? T.blue : /\.json$/.test(f) ? T.yellow : null;
// O'quvchi reposining to'liq Explorer'i (M27): mavzuga aloqasiz papkalar yopiq
const REPO_BASE = ['dist/', 'node_modules/', 'src/api/', 'src/common/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', 'test/', '.env.example', 'eslint.config.mjs', 'nest-cli.json', 'package.json', 'package-lock.json', 'tsconfig.json'];
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
const F = { ord: 'src/order.ts', ordSpec: 'src/order.spec.ts', ci: '.github/workflows/ci.yml', pkg: 'package.json' };
const ORD_FILES = tree(REPO_BASE, [F.ord, F.ordSpec]);
const CI_FILES = tree(REPO_BASE, [F.ord, F.ordSpec, F.ci]);
MKCFG.files = ORD_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['nuqta github, workflows papkasidagi yml faylida', '.github/workflows/ci.yml faylida'], ['nuqta github, workflows papkasida ci yml', '.github/workflows/ci.yml'],
  ['ci yml', 'ci.yml'], ['actions checkout', 'actions/checkout'], ['Setup node', 'setup-node'], ['setup node', 'setup-node'], ['npm ci', 'npm ci'],
  ['package json', 'package.json'], ['package lock', 'package-lock'], ['node modules', 'node_modules'], ['env faylingiz', '.env faylingiz'],
  ['ubuntu latest', 'ubuntu-latest'], ['Runs on', 'runs-on'], ['runs on', 'runs-on'], ['On once', 'on: once'], ['on once', 'on: once'], ['on push', 'on: push'],
  ['in sync', 'in sync'], ['could not read package json', 'Could not read package.json'], ['no tests found, exiting with code one', 'No tests found, exiting with code 1'],
  ['order spec', 'order.spec.ts'], ['order ts', 'order.ts'], ['Nest build', 'nest build'], ['npm run lint', 'npm run lint'],
  ['Ikki ampersand', '&&'], ['ikki ampersand', '&&'], ['my laptop', 'my-laptop'], ['unexpected value', 'Unexpected value'], ['required property is missing', 'Required property is missing'],
  ['expected yigirma ming, received o\'n ming ikki', 'Expected 20000, Received 10002'], ['received qiymatini', 'Received qiymatini'],
];
DIGITS.unshift(["yetti yuz ellik to'qqiz", '759'], ["qirq olti", '46'], ["o'n to'rt", '14'], ["Ubuntu yigirma to'rt", 'Ubuntu 24.04'], ['Node yigirma ikki', 'Node 22'],
  ['yigirma ikki', '22'], ["to'qson daqiqaning o'ttizi", '90 daqiqaning 30 tasi'], ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'],
  ["o'n beshinchi ekran", '15-ekran'], ["o'n ikkinchi ekran", '12-ekran'], ["O'n birinchi satr", '11-satr'], ['yigirma bir ekran', '21 ekran'],
  ['chiqish kodi bir', 'chiqish kodi 1'], ['chiqish kodi nol', 'chiqish kodi 0'], ['kod bir', 'kod 1'], ["o'n marta", '10 marta']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /could not read package json/gi, /no tests found, exiting with code one/gi, /continuous integration/gi, /continuous delivery/gi, /continuous deployment/gi,
  /required property is missing/gi, /unexpected value/gi, /block sequence/gi, /implicit map key/gi, /in sync/gi, /pipeline/gi, /runner/gi,
);

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
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };

const TS_KW = /^(import|from|export|function|return|const|let|describe|it|expect|number|string|boolean|true|false|null|undefined|if|throw|new|typeof|as|any)$/;
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^(toBe|toEqual|toThrow)$/.test(id) ? `<span class="d">${id}</span>` : /^(Error|Number)$/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// YAML (ci.yml) rang beruvchi: kalit — binafsha, qiymat — yashil, izoh — kulrang, «- » ro'yxat belgisi
function yamlLine(src) {
  const m = /^(\s*)(- )?([\w-]+)(:)(.*)$/.exec(src);
  if (!m) return /^\s*#/.test(src) ? `<span class="cm">${escH(src)}</span>` : escH(src);
  const [, ind, dash, key, colon, rest] = m;
  const cm = rest.indexOf(' #');
  const val = cm >= 0 ? rest.slice(0, cm) : rest, com = cm >= 0 ? rest.slice(cm) : '';
  return `${ind}${dash ? '<span class="p">- </span>' : ''}<span class="k">${escH(key)}</span>${colon}${val.trim() ? `<span class="s">${escH(val)}</span>` : escH(val)}${com ? `<span class="cm">${escH(com)}</span>` : ''}`;
}
const yml = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: yamlLine(l), ...(meta[i + 1] || {}) }));
// Terminal: npm/jest/eslint chiqishlari. Kod satrlari (N |) birinchi; PASS/✓/UCHIRISH yashil; xato qizil
function jestLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l) || /^\s+\|\s+\^/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*\d+ \|/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*at /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/\[chiqish kodi: 0\]/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/\[chiqish kodi: [1-9]\d*\]/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*PASS\b|✓|passed, \d+ total$|^UCHIRISH$|^added \d+ packages/.test(l) && !/failed/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Expected:/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Received:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/warning|WARN/.test(l) && !/error/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*FAIL\b|●|✕|failed|error|No tests found|✖|XATO/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^>|^Snapshots|^Time|^Ran all|^---|^#|^\s*expect\(received\)|^In |files checked|testMatch|testPath|testRegex|Pattern|Run with/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const jt = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = 'terminal', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Lenta chizig'i — o'quvchi darsidagi besh nuqta (m4c-01): holat — 'ok' | 'bad' | 'off' | 'skip' | undefined
const LENTA = [
  { k: 'install', ic: '1', n: "Yig'ish", c: 'npm install' },
  { k: 'test', ic: '2', n: 'Skaner', c: 'npm test' },
  { k: 'lint', ic: '3', n: "O'lcham ramkasi", c: 'eslint .' },
  { k: 'build', ic: '4', n: "O'rash", c: 'npm run build' },
  { k: 'deploy', ic: '5', n: 'Uchirish', c: 'deploy' },
];
const LENTA_ST = { ok: '✓ yashil', bad: '✗ qizil', skip: '— yurmadi', off: "— lentada yo'q" };
function Lenta({ st = {}, hl = [], only }) {
  const items = only ? LENTA.filter((x) => only.includes(x.k)) : LENTA;
  return <div className="c1-lenta" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
    {items.map((x) => <div key={x.k} className={`${st[x.k] || ''}${hl.includes(x.k) ? ' hl' : ''}`}>
      <span className="ic">{x.ic}</span><b>{x.n}</b><code>{x.c}</code>
      {st[x.k] && <small>{LENTA_ST[st[x.k]]}</small>}
    </div>)}
  </div>;
}
// GitHub Actions oynasi — haqiqiy run qadamlaridan (01.11.2026, cicd2-out/21: nomlar va holatlar aynan)
function ActionsMaket({ title = 'Actions', steps = [], status = 'ok', note }) {
  return <div className="c1-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">{title}</span><span className="warn">haqiqiy run ma'lumotidan</span></div>
    <div className="bd">
      <div className={`run ${status}`}><span className="dot">{status === 'ok' ? '✓' : status === 'bad' ? '✗' : '●'}</span><b>test</b><span className="nm">{note}</span></div>
      {steps.map(([n, s], i) => <div key={i} className={`st ${s}`}><span className="dot">{s === 'ok' ? '✓' : s === 'bad' ? '✗' : '○'}</span>{n}</div>)}
    </div>
  </div>;
}

// CI/CD-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
/* ogohlantirish qutisi — Nest-2 dagi bilan bir xil (u bo'lak bu darsga kirmaydi) */
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-three{grid-template-columns:1fr}}
.pg-row{display:flex;gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper};font:13px ${MONO};transition:opacity .3s,border-color .3s,background .3s}
.pg-row.hl{border-color:${T.accent};background:#FFF7F3}
.pg-row .v{margin-left:auto;font-weight:800;font-size:16px}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1300px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
/* Xulosa qadamida tor ekranda (1280) kod oynasi yashiriladi — xulosa ko'rinib tursin */
@media (max-width:1300px){.j2-wide-only{display:none}}
/* Lenta chizig'i — besh nuqta */
.c1-lenta{display:grid;gap:8px}
.c1-lenta>div{border:1.5px solid ${T.line};border-radius:12px;background:${T.paper};padding:10px 8px;text-align:center;transition:opacity .3s,border-color .3s,background .3s}
.c1-lenta .ic{display:inline-flex;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font:700 12px ${MONO};color:#fff;background:${T.ink3}}
.c1-lenta .ok .ic{background:${T.green}}
.c1-lenta .bad .ic{background:${T.accent}}
.c1-lenta b{display:block;font-size:13.5px;margin-top:4px;color:${T.ink}}
.c1-lenta code{display:inline-block;font:12px ${MONO};margin-top:4px;color:${T.ink2}}
.c1-lenta small{display:block;font:600 11.5px ${SANS};margin-top:4px}
.c1-lenta .ok{border-color:${T.green};background:#E3F5EC}
.c1-lenta .ok small{color:${T.green}}
.c1-lenta .bad{border-color:${T.accent};background:#FFF0EB}
.c1-lenta .bad small{color:${T.accent}}
.c1-lenta .skip,.c1-lenta .off{opacity:.45}
.c1-lenta .hl{box-shadow:0 0 0 3px rgba(226,69,31,.18);border-color:${T.accent}}
/* GitHub Actions maketi */
.c1-gh{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden}
.c1-gh .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE;font:600 12px ${SANS};color:${PG.gh}}
.c1-gh .bar .lg{font-weight:800}
.c1-gh .bar .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.green};background:#EAF6EE;border:1px solid #A9D9B5;border-radius:6px;padding:3px 7px}
.c1-gh .bd{padding:10px 12px;display:grid;gap:4px;font:13px ${MONO};color:${PG.gh}}
.c1-gh .run{display:flex;gap:8px;align-items:center;font:600 14px ${SANS};padding-bottom:6px;border-bottom:1px solid #EAEEF2;margin-bottom:4px}
.c1-gh .run .nm{font:400 12.5px ${SANS};color:#57606A}
.c1-gh .dot{display:inline-flex;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;color:#fff;background:#8C959F}
.c1-gh .ok .dot{background:#1A7F37}
.c1-gh .bad .dot{background:#CF222E}
.c1-gh .st{display:flex;gap:8px;align-items:center;padding:2px 0;color:${PG.gh}}
.c1-gh .st.skip{color:#8C959F}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Umumiy kod va chiqishlar (cicd1-out — toza clone, env -i, CI=true; /tmp yo'llari …/lenta-sinov ga qisqartirilgan)
// ============================================================
const ORDER_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}`, { 2: { id: 'op' } });
const ORDER_SPEC = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
});`);
const CHAIN_OK = jt(String.raw`
$ npm test && npm run build && echo "UCHIRISH"
UCHIRISH
[chiqish kodi: 0]`, { 2: { id: 'u' } });
const CHAIN_BAD = jt(String.raw`
$ npm test && npm run build && echo "UCHIRISH"
[chiqish kodi: 1]`, { 2: { id: 'x' } });
const TEST_OK = jt(String.raw`
$ npm test
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (5 ms)

Tests:       1 passed, 1 total
[chiqish kodi: 0]`, { 2: { id: 'p' }, 6: { id: 't' }, 7: { id: 'k' } });
const TEST_BAD = jt(String.raw`
$ npm test
FAIL src/order.spec.ts
  ● orderTotal › 2 kitob narxini hisoblaydi

    Expected: 20000
    Received: 10002

Tests:       1 failed, 1 total
[chiqish kodi: 1]`, { 2: { id: 'f' }, 5: { id: 'r' }, 6: { id: 'r' }, 9: { id: 'k' } });
const NPM_CI = jt(String.raw`
$ npm ci
npm error code EUSAGE
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm error Missing: @nestjs/jwt@11.0.2 from lock file
npm error Missing: bcrypt@6.0.0 from lock file
npm error Missing: class-validator@0.14.4 from lock file
npm error …  (jami 26 ta Missing)
[chiqish kodi: 1]`.replace(/\\`/g, '`'), { 3: { id: 's' }, 8: { id: 'k' } });
const NPM_INSTALL = jt(String.raw`
$ npm install
added 759 packages in 8s
[chiqish kodi: 0]`, { 2: { id: 'a' } });
const NO_TESTS = jt(String.raw`
$ npm test
> jest

No tests found, exiting with code 1
Run with \`--passWithNoTests\` to exit with code 0
In …/lenta-sinov/src
  37 files checked.
  testRegex: .*\.spec\.ts$ - 0 matches
[chiqish kodi: 1]`.replace(/\\`/g, '`'), { 4: { id: 'n' }, 9: { id: 'k' } });
const BUILD = jt(String.raw`
$ npm run build
> nest build

[chiqish kodi: 0]`, { 4: { id: 'k' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['CI/CD nima', "Lenta o'quvchi reposida", 'ci.yml', 'Buzamiz', 'CD: chiqarish', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — lenta o'quvchi reposida qayerda qizil bo'lishini bilasiz</div>
    <Term lines={CHAIN_OK} />
  </div>} />;
}

// ============================================================
//  2 · Qo'lda besh qadam va lenta
// ============================================================
const S2 = mkS(2, [{ st: {}, hl: ['install', 'test', 'lint', 'build', 'deploy'] }, { st: { test: 'skip' }, warn: true }, { st: { install: 'ok', test: 'ok', lint: 'ok', build: 'ok', deploy: 'ok' } }, { st: { install: 'ok', test: 'ok', lint: 'ok', build: 'ok', deploy: 'ok' }, sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag">{seg.st.install ? 'Lenta — har push\'da o\'zi' : "Qo'lda — har push'dan keyin"}</div>
      <Lenta st={seg.st} hl={seg.hl || []} />
    </div>
    {seg.warn && <div className="n2-warn">Shoshilib <b>Skaner</b> tashlab ketildi — tekshirilmagan kod foydalanuvchiga chiqadi (o'quvchi darsi, 2-ekran).</div>}
    {seg.sum && <div className="mk-rule">Lentada yangi buyruq yo'q — <b>terminal buyruqlaringiz</b>, avtomatik va har safar bir xil tartibda.</div>}
  </div>} />;
}

// ============================================================
//  3 · CI: har push tekshiriladi
// ============================================================
const DEVS3 = [['Ali', 'savatcha', 'ok'], ['Vali', 'login', 'bad'], ['Sora', "mahsulot ro'yxati", 'ok']];
const S3 = mkS(3, [{ v: 'push' }, { v: 'lenta' }, { v: 'res' }, { v: 'res', sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-three">{DEVS3.map(([n, f, r]) => <div key={n} className="mk-box" style={{ '--c': seg.v === 'res' ? (r === 'ok' ? T.green : T.accent) : T.blue }}>
      <h4>{n}</h4><p>{f} · <code>git push</code></p>
      {seg.v !== 'push' && <p style={{ marginTop: 6, fontFamily: MONO, fontSize: 12.5 }}>→ lenta {seg.v === 'res' ? (r === 'ok' ? '✓ yashil' : '✗ qizil') : '…'}</p>}
    </div>)}</div>
    {seg.v !== 'push' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">Bitta lenta — har push uchun, bir xil toza mashinada</div><Lenta only={['install', 'test', 'build']} st={seg.v === 'res' ? { install: 'ok', test: 'ok', build: 'ok' } : {}} /></div>}
    {seg.v === 'res' && !seg.sum && <div className="n2-warn">Vali: «Uyimda ishlagan edi». Lentada qizil — xato uyidagi sozlamada yashiringan.</div>}
    {seg.sum && <div className="mk-rule"><b>CI</b> — har push'ni <b>darhol</b> va bir xil toza sharoitda tekshiradi.</div>}
  </div>} />;
}

// ============================================================
//  4 · Lenta mashinasi: toza papka va chiqish kodi (cicd1-out/07, 08, 12)
// ============================================================
const S4 = mkS(4, [{ v: 'm' }, { v: 'm', empty: true }, { v: 'k' }, { v: 'k', sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'm' && <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag">Lenta mashinasi (runner) — haqiqiy run logidan</div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div className="pg-row"><span>runs-on: ubuntu-latest</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 14 }}>Ubuntu 24.04.5</span></div>
        <div className="pg-row"><span>Node.js (oldindan o'rnatilgan)</span><span className="v" style={{ fontSize: 14 }}>22.23.4</span></div>
        {seg.empty && <div className="pg-row hl"><span>Ish papkasi boshida</span><span className="v" style={{ fontSize: 14, color: T.accent }}>bo'sh — node_modules, .env yo'q</span></div>}
      </div>
      <div className="mk-tag" style={{ margin: '10px 0 0' }}>Manba: GitHub Actions run logi «Set up job» (01.11.2026) · GitHub eslatmasi: ubuntu-latest Ubuntu 26 ga o'tkazilmoqda</div>
    </div>}
    {seg.v === 'k' && <div className="pg-row"><span>ubuntu-latest · har safar bo'sh papka</span><span style={{ color: T.ink3 }}>→</span><span>npm test</span><span className="v" style={{ fontSize: 14 }}>chiqish kodi: 0 yoki 1</span></div>}
    {seg.v === 'k' && <div className="pg-two">
      <Term lines={TEST_OK} focus={['k']} />
      <Term er lines={TEST_BAD} focus={['k']} />
    </div>}
    {seg.sum && <div className="mk-rule">Lenta = <b>toza papka</b> + sizning buyruqlaringiz + <b>chiqish kodi</b>. 0 emas — lenta to'xtaydi.</div>}
  </div>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — chiqish kodi
// ============================================================
function Screen5(p) {
  const m = MDT[5];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={TEST_BAD.slice(7)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: test qizil — keyingi qadamlar yurmadi</div>
      <Term er lines={CHAIN_BAD} focus={['x']} />
      <Lenta only={['install', 'test', 'build', 'deploy']} st={{ install: 'ok', test: 'bad', build: 'skip', deploy: 'skip' }} />
    </div>} />;
}

// ============================================================
//  6 · Toza clone: npm ci yiqildi (cicd1-out/01, 02)
// ============================================================
const S6 = mkS(6, [{ v: 'clone' }, { v: 'ci', f: [] }, { v: 'ci', f: ['s', 'k'] }, { v: 'inst' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term lines={jt(String.raw`
$ git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git lenta-sinov
$ cd lenta-sinov`)} />
    {seg.v !== 'clone' && <Term er lines={NPM_CI} focus={seg.f || []} />}
    {seg.v === 'inst' && <><Term lines={NPM_INSTALL} focus={['a']} /><div className="mk-rule">Bu repoda o'rnatish — <b>npm install</b>. <code>npm ci</code> bilan lenta birinchi qadamda qizil.</div></>}
  </div>} />;
}

// ============================================================
//  7 · npm test: test yo'q bo'lsa qizil (cicd1-out/03, 07)
// ============================================================
const S7 = mkS(7, [{ v: 'none' }, { v: 'none', f: ['n', 'k'] }, { v: 'ok' }, { v: 'ok', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div className="pg-two">
    <Ide files={seg.v === 'ok' ? ORD_FILES : REPO_BASE} active={seg.v === 'ok' ? F.ordSpec : 'src/main.ts'} fresh={seg.v === 'ok' ? [F.ord, F.ordSpec] : []}>
      {seg.v === 'ok' ? <CodePanel file={F.ordSpec} wrap lines={ORDER_SPEC} /> : <div className="mk-tag" style={{ padding: 14 }}>src/ — bitta ham .spec.ts yo'q</div>}
    </Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'none' && <Term er lines={NO_TESTS} focus={seg.f || []} />}
      {seg.v === 'ok' && <Term lines={TEST_OK} focus={['p', 'k']} />}
      {seg.sum && <div className="mk-rule">Lentaga test qadamini qo'yishdan oldin repoda <b>kamida bitta test</b> bo'lsin.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  8 · Build va && (cicd1-out/04, 09)
// ============================================================
const S8 = mkS(8, [{ v: 'build' }, { v: 'chain' }, { v: 'both' }, { v: 'both', sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'build' && <Term lines={BUILD} focus={['k']} />}
    {seg.v === 'chain' && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">&& — oldingisi 0 qaytarsa, keyingisi yuradi</div>
      <div className="pg-row"><code>npm test</code><span style={{ color: T.ink3 }}>&amp;&amp;</span><code>npm run build</code><span style={{ color: T.ink3 }}>&amp;&amp;</span><code>echo "UCHIRISH"</code></div>
    </div>}
    {seg.v === 'both' && <div className="pg-two">
      <div style={{ display: 'grid', gap: 8 }}><div className="mk-tag" style={{ color: T.accent, margin: 0 }}>order.ts: price + quantity</div><Term er lines={CHAIN_BAD} focus={['x']} /><Lenta only={['test', 'build', 'deploy']} st={{ test: 'bad', build: 'skip', deploy: 'skip' }} /></div>
      <div style={{ display: 'grid', gap: 8 }}><div className="mk-tag" style={{ color: T.green, margin: 0 }}>order.ts: price * quantity</div><Term lines={CHAIN_OK} focus={['u']} /><Lenta only={['test', 'build', 'deploy']} st={{ test: 'ok', build: 'ok', deploy: 'ok' }} /></div>
    </div>}
    {seg.sum && <div className="mk-rule">Lenta — <b>&amp;&amp; bilan ulangan buyruqlar</b>: birinchi qizilda to'xtaydi.</div>}
  </div>} />;
}

// ============================================================
//  9 · Amaliyot 1 — lentani qo'lda yurgizish
// ============================================================
const P1 = mkS(9, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Toza clone', cmds: ['git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git lenta-sinov', 'cd lenta-sinov'], exp: 'papka yaratildi' },
  { t: "O'rnatish — avval npm ci (xato), keyin npm install", cmds: ['npm ci', 'npm install'], exp: 'in sync · keyin added … packages' },
  { t: "Test fayli — src/order.ts + src/order.spec.ts (Jest-1)", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Zanjir', cmds: ['npm test && npm run build && echo "UCHIRISH"'], exp: 'oxirgi satr UCHIRISH' },
];
const P1_CODE = [{ file: F.ord, step: 2, lines: ORDER_TS, copy: false }, { file: F.ordSpec, step: 2, lines: ORDER_SPEC, copy: false }];
const P1_TROUBLE = [
  ['npm ci ham ishladi', "lock fayl repoda yangilangan bo'lishi mumkin — yaxshi, davom eting"],
  ['No tests found', "order.spec.ts src/ ichida emas yoki nomi .test.ts (Jest-1, 4-ekran)"],
  ['UCHIRISH chiqmadi, FAIL', 'order.ts dagi hisob — price * quantity'],
];
const P1_PROOF = { label: 'Zanjirning oxirgi satri', placeholder: 'oxirgi satrni yozing', check: (v) => /^\s*"?UCHIRISH"?\s*$/i.test(v), wrong: "Zanjir oxirida echo nima chiqaradi? Uchala buyruq yashil bo'lsagina chiqadi" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={ORD_FILES} />; }
// ============================================================
//  ci.yml variantlari (manba/cicd1-yml; tahlil — cicd1-out/10)
// ============================================================
const YML_OQ = yml(String.raw`
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
      - run: npm test`, { 1: { id: 'on' }, 4: { id: 'ro' }, 5: { id: 'st' }, 6: { id: 'st' }, 7: { id: 'st' } });
const YML_OK = yml(String.raw`
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: npm test
      - run: npm run build`, { 7: { id: 'co' }, 8: { id: 'sn' }, 9: { id: 'sn' }, 10: { id: 'sn' }, 11: { id: 'run' }, 12: { id: 'run' }, 13: { id: 'run' } });
const YML_CI = yml(String.raw`
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`);
const TAHLIL_OQ = jt(String.raw`
$ node tekshir (@actions/workflow-parser 0.3.61) ci.yml
--- 1-oquvchi-darsi.yml
  ✓ xato yo'q (schema bo'yicha to'g'ri)`, { 3: { id: 'v' } });
const TAHLIL_OK = jt(String.raw`
--- 2-tavsiya.yml
  ✓ xato yo'q (schema bo'yicha to'g'ri)`);
const BOSH = jt(String.raw`
# bo'sh papka — checkout qadami yo'q bo'lsa
$ ls -a
.  ..
$ npm install
npm error code ENOENT
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '…/bosh-papka/package.json'
[chiqish kodi: 254]`, { 3: { id: 'e' }, 6: { id: 'm' }, 7: { id: 'k' } });
const CI_FILES_ONLY = tree(REPO_BASE, [F.ord, F.ordSpec, F.ci]);

// ============================================================
//  10 · ci.yml tuzilishi
// ============================================================
const S10 = mkS(10, [{ focus: [] }, { focus: ['on'] }, { focus: ['ro', 'st'] }, { focus: ['on', 'ro', 'st'], sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={CI_FILES_ONLY} active={F.ci} fresh={[F.ci]}><CodePanel file={F.ci} lines={YML_OQ} focus={seg.focus} /></Ide>
    {seg.sum && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.blue }}><h4><code>on</code></h4><p>qachon — har push</p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4><code>runs-on</code></h4><p>qayerda — lenta mashinasi</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4><code>steps</code></h4><p>nima — buyruqlar, tartib bilan</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  11 · Checkout yo'q — papka bo'sh (cicd1-out/10, 11, 12)
// ============================================================
const S11 = mkS(11, [{ v: 'parse' }, { v: 'doc' }, { v: 'empty' }, { v: 'empty', sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><CodePanel file={F.ci} lines={YML_OQ} focus={seg.v === 'parse' || seg.sum ? [] : ['st']} /></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'parse' && <Term title="GitHub'ning rasmiy tahlilchisi" lines={TAHLIL_OQ} focus={['v']} />}
      {seg.v === 'doc' && <div className="mk-card"><h5>actions/checkout — hujjatidan</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«This action <b>checks-out your repository</b> under <code>$GITHUB_WORKSPACE</code>, so your workflow can access it.»</div><div className="mk-tag" style={{ margin: '8px 0 0' }}>Bu faylda checkout qadami yo'q → ish papkasi bo'sh</div></div>}
      {seg.v === 'empty' && <Term er lines={BOSH} focus={['m', 'k']} />}
      {seg.v === 'empty' && <div className="mk-tag" style={{ margin: 0 }}>Bo'sh papkada lokal · GitHub'da ham sinaldi: checkout'siz lenta — xuddi shu xato, qizil</div>}
      {seg.sum && <div className="mk-rule">Har lentaning <b>birinchi qadami</b> — <code>actions/checkout</code>. Amaliyotda o'quvchilarga qo'shtiring.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  12 · Tavsiya ci.yml (cicd1-yml/2-tavsiya.yml)
// ============================================================
const S12 = mkS(12, [{ focus: ['co', 'sn'] }, { focus: ['run'] }, { focus: ['co', 'sn'], ver: true }, { focus: [], sum: true }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <div className="pg-two">
    <Ide files={CI_FILES_ONLY} active={F.ci}><CodePanel file={F.ci} lines={YML_OK} focus={seg.focus} /></Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {!seg.ver && !seg.sum && <Lenta only={['install', 'test', 'build']} hl={seg.focus.includes('run') ? ['install', 'test', 'build'] : []} />}
      {seg.ver && <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">So'nggi relizlar (GitHub, 01.11.2026)</div>
        <div className="pg-row"><span>actions/checkout</span><span className="v" style={{ fontSize: 14 }}>v7.0.1</span></div>
        <div className="pg-row" style={{ marginTop: 6 }}><span>actions/setup-node</span><span className="v" style={{ fontSize: 14 }}>v7.1.0</span></div>
        <div className="mk-tag" style={{ margin: '8px 0 0' }}>O'quvchi m4c-03 da — @v4: ishlaydi, lekin har run'da «Node.js 20 is deprecated» ogohlantirishi</div>
      </div>}
      {seg.sum && <><Term lines={TAHLIL_OK} /><div className="mk-rule">O'quvchi reposi uchun besh qadam; <b>lint qadami yo'q</b> — sababi 15-ekranda.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  13 · Tekshiruv 2 — LineCheck (11-satr = 10)
// ============================================================
const LC13_FIXED = YML_CI.map((l, i) => ({ ...l, n: i + 1, ...(i === 10 ? { gone: true } : {}) }));
LC13_FIXED.splice(11, 0, { h: yamlLine('      - run: npm install'), n: 11, neu: true });
function Screen13(p) {
  const m = MDT[13];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ci} lines={YML_CI} target={10}
    tree={{ root: MKCFG.root, files: CI_FILES_ONLY, active: F.ci }}
    fixed={LC13_FIXED} fixedExtra={[{ file: 'terminal (haqiqiy, toza clone)', lines: jt('$ npm ci\nnpm error `npm ci` can only install packages when … are in sync.\n[chiqish kodi: 1]').concat(NPM_INSTALL) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  14 · Amaliyot 2 — ci.yml GitHub'da
// ============================================================
const P2 = mkS(14, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Fayl — .github/workflows/ci.yml (12-ekrandagi)', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push', cmds: ['git add .github && git commit -m "ci: lenta"', 'git push'], exp: "push o'tdi" },
  { t: "Actions — GitHub → repo → Actions → oxirgi lenta", cmds: [], exp: 'yashil belgi' },
  { t: 'Log — test ishi ichida npm test qadamini oching', cmds: [], exp: 'Tests: … passed' },
];
const P2_CODE = [{ file: F.ci, step: 0, lines: YML_OK, copy: true }];
const P2_TROUBLE = [
  ["Actions'da lenta umuman yo'q", "papka nomi aniq .github/workflows emas yoki fayl push qilinmagan"],
  ['in sync', 'npm ci yozilgan — npm install (13-ekran)'],
  ['Could not read package.json', "checkout qadami yo'q (11-ekran)"],
  ['No tests found', "repoda test fayli yo'q (7-ekran)"],
];
const P2_PROOF = { label: "npm test qadamidagi Tests: satri", placeholder: "Tests satrini qo'ying", check: (v) => /Tests:\s+\d+ passed,\s+\d+ total/.test(v), wrong: "Lenta logida npm test qadamini oching — Tests: bilan boshlanadigan satrni nusxalang" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={P2_CODE} tree={CI_FILES_ONLY} />; }

// ============================================================
//  15 · Lint qadami: 46 error (cicd1-out/05, 06)
// ============================================================
const LINT_OUT = jt(String.raw`
$ npm run lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix

…/src/api/admin/admin.controller.ts
  11:3  error  'HttpStatus' is defined but never used  @typescript-eslint/no-unused-vars
…/src/api/auth/auht.service.ts
  25:11  error  Unsafe assignment of an \`any\` value  @typescript-eslint/no-unsafe-assignment
  …

✖ 49 problems (46 errors, 3 warnings)
[chiqish kodi: 1]`.replace(/\\`/g, '`'), { 10: { id: 'n' }, 11: { id: 'k' } });
const LINT_GIT = jt(String.raw`
$ git status --short
 M src/api/admin/admin.service.ts
 M src/api/app.module.ts
 M src/main.ts
 …  (jami 14 fayl + package-lock.json)`, { 1: { id: 'g' } });
const LINT_NOFIX = jt(String.raw`
$ npx eslint "{src,apps,libs,test}/**/*.ts"
✖ 120 problems (116 errors, 4 warnings)
[chiqish kodi: 1]`);
const S15 = mkS(15, [{ v: 'lenta' }, { v: 'out' }, { v: 'git' }, { v: 'git', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'lenta' && <Lenta hl={['lint']} />}
    {seg.v === 'out' && <Term er lines={LINT_OUT} focus={['n', 'k']} />}
    {seg.v === 'git' && <div className="pg-two">
      <Term lines={LINT_GIT} />
      <div style={{ display: 'grid', gap: 10 }}><div className="mk-tag" style={{ margin: 0 }}>--fix siz (o'zgartirmasdan)</div><Term er lines={LINT_NOFIX} /></div>
    </div>}
    {seg.sum && <div className="mk-rule">Bu repoda lint — <b>alohida ish</b>: avval xatolar tozalanadi. Lentaga hozircha test va build.</div>}
  </div>} />;
}

// ============================================================
//  16 · Test qizil — lenta to'xtaydi (cicd1-out/08, 09)
// ============================================================
const ORDER_BAD = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price + quantity;
}`, { 2: { id: 'x' } });
const S16 = mkS(16, [{ v: 'code' }, { v: 'fail' }, { v: 'lenta' }, { v: 'fix', sum: true }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={seg.v === 'fix' ? ORDER_TS.map((l, i) => (i === 1 ? { ...l, neu: true } : l)) : ORDER_BAD} focus={seg.v === 'fix' ? [] : ['x']} /></Ide></div>
      {seg.v !== 'code' && seg.v !== 'fix' && <Term er lines={TEST_BAD} focus={['r', 'k']} />}
      {seg.v === 'fix' && <Term lines={TEST_OK} focus={['k']} />}
    </div>
    {seg.v === 'lenta' && <div className="pg-two">
      <Lenta only={['install', 'test', 'build', 'deploy']} st={{ install: 'ok', test: 'bad', build: 'skip', deploy: 'skip' }} />
      <ActionsMaket title="Actions · sinov: buzildi" status="bad" note="lenta qizil" steps={[['Run actions/checkout@v7', 'ok'], ['Run actions/setup-node@v7', 'ok'], ['Run npm install', 'ok'], ['Run npm test', 'bad'], ['Run npm run build', 'skip']]} />
    </div>}
    {seg.v === 'fix' && <Lenta only={['install', 'test', 'build']} st={{ install: 'ok', test: 'ok', build: 'ok' }} />}
    {seg.sum && <div className="mk-rule">Qizil lenta — <b>yomon emas</b>: xato foydalanuvchidan oldin ushlandi. Tuzatib push qilingach — yana yashil.</div>}
  </div>} />;
}

// ============================================================
//  17 · YAML xatolari (cicd1-out/10; cicd1-yml/3…5)
// ============================================================
const YERR = [
  { t: 'on: once', code: 'on: once', msg: "Unexpected value 'once'", line: '(Line: 1, Col: 5)' },
  { t: "runs-on yo'q", code: 'test:\n    steps:', msg: 'Required property is missing: runs-on', line: '(Line: 4, Col: 5)' },
  { t: 'surilish', code: '    - run: npm install\n      - run: npm test', msg: 'A block sequence may not be used as an implicit map key', line: 'at line 7, column 1' },
];
const S17 = mkS(17, [{ hl: [0] }, { hl: [0, 1] }, { hl: [2] }, { hl: [0, 1, 2], sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-three">{YERR.map((e, i) => <div key={i} className={`mk-box${seg.hl.includes(i) && !seg.sum ? ' hl' : ''}`} style={{ '--c': T.accent, opacity: seg.hl.includes(i) ? 1 : 0.35 }}>
      <h4>{e.t}</h4><pre style={{ margin: '6px 0', font: `12px/1.45 ${MONO}`, whiteSpace: 'pre-wrap' }}>{e.code}</pre>
      <p style={{ fontFamily: MONO, fontSize: 12, color: T.accent }}>{e.msg}</p><p style={{ fontFamily: MONO, fontSize: 11.5, color: T.ink3, marginTop: 4 }}>{e.line}</p>
    </div>)}</div>
    <div className="mk-tag" style={{ margin: 0 }}>Xabarlar — GitHub'ning rasmiy tahlilchisidan (@actions/workflow-parser 0.3.61)</div>
    {seg.sum && <div className="n2-warn" style={{ animation: 'mk-up .4s ease both' }}>GitHub sahifasida: <code>on: once</code> va <code>runs-on</code> — matn aynan shu. Surilish — umumiy <code>You have an error in your yaml syntax on line N</code>, va <b>N blok boshini ko'rsatishi mumkin</b> (sinov run'ida: 4-qator, xato 8-qatorda).</div>}
    {seg.sum && <div className="pg-row" style={{ borderColor: T.green }}><span>Tuzatilgan: on: push · runs-on: ubuntu-latest · «- run» bir xil surilishda</span><span className="v" style={{ fontSize: 13, color: T.green }}>✓ xato yo'q</span></div>}
    {seg.sum && <div className="mk-rule">YAML xatosida avval <b>qator raqami</b>, keyin o'sha qatorning surilishini yuqoridagi qator bilan solishtiring.</div>}
  </div>} />;
}

// ============================================================
//  18 · Tekshiruv 3 — in sync
// ============================================================
function Screen18(p) {
  const m = MDT[18];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={NPM_CI.slice(0, 4)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: shu repoda npm install ishlaydi</div>
      <Term lines={NPM_INSTALL} focus={['a']} />
    </div>} />;
}

// ============================================================
//  19 · Amaliyot 3 — GitHub'da qizil va yashil
// ============================================================
const P3 = mkS(19, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Buzish — src/order.ts: price * quantity → price + quantity', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push', cmds: ['git commit -am "sinov: buzildi"', 'git push'], exp: "Actions'da qizil" },
  { t: "O'qish — qizil npm test qadamini oching", cmds: [], exp: 'Expected: 20000 · Received: 10002' },
  { t: 'Tuzatish — price * quantity · commit · push', cmds: ['git commit -am "tuzatildi"', 'git push'], exp: 'yashil' },
];
const P3_TROUBLE = [
  ['Lenta yashil qoldi', "o'zgarish push qilinmagan yoki order.spec.ts yo'q"],
  ['Build qadami ham qizil', "build test'dan oldin turibdi — tartib: install → test → build"],
];
const P3_PROOF = { label: '3-qadamdagi Received qiymati', placeholder: 'Received yonidagi sonni yozing', check: (v) => /^\s*10\s?002\s*$/.test(v), wrong: "Received — funksiya qaytargan qiymat: 10 000 va 2 ni qo'shganda nima chiqadi?" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }
// ============================================================
//  20 · CD: Delivery va Deployment
// ============================================================
const S20 = mkS(20, [{ v: 'ci' }, { v: 'del' }, { v: 'dep' }, { v: 'both', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Lenta st={{ install: 'ok', test: 'ok', lint: 'off', build: 'ok', deploy: seg.sum ? 'off' : undefined }} hl={seg.v === 'ci' ? ['install', 'test', 'build'] : ['deploy']} />
    {seg.v !== 'ci' && <div className="pg-two">
      <div className={`mk-box${seg.v === 'del' || seg.v === 'both' ? ' hl' : ''}`} style={{ '--c': T.blue }}><h4>Continuous Delivery</h4><p>tayyor — chiqarishni mas'ul odam tasdiqlaydi</p></div>
      <div className={`mk-box${seg.v === 'dep' || seg.v === 'both' ? ' hl' : ''}`} style={{ '--c': T.green }}><h4>Continuous Deployment</h4><p>hammasi yashil bo'lsa — o'zi chiqaradi</p></div>
    </div>}
    {(seg.v === 'dep' || seg.sum) && <div className="n2-warn">Chiqarish uchun parol va kalitlar — <b>ci.yml'da emas</b>, GitHub Secrets'da (o'quvchi kartochkasi «Secret»).</div>}
    {seg.sum && <div className="mk-rule">Bugungi lenta <b>build'da tugaydi</b>. Haqiqiy chiqarish — o'quvchilarning loyiha kunlarida (m4c-04, m4c-07).</div>}
  </div>} />;
}

// ============================================================
//  21 · Tekshiruv 4 — qaysi rejim
// ============================================================
function Screen21(p) {
  const m = MDT[21];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Delivery: lenta tekshiradi → xodim tasdiqlaydi → chiqadi</div>
      <Lenta only={['install', 'test', 'build', 'deploy']} st={{ install: 'ok', test: 'ok', build: 'ok' }} hl={['deploy']} />
    </div>} />;
}

// ============================================================
//  22 · m4c-01 xaritasi (CiCdIntroLesson.jsx — SCREEN_META 21)
// ============================================================
const MAP22 = [
  { t: 'Kirish', s: 's0–s1', d: "qo'lda uchirish · reja", m: 'lenta = terminal buyruqlari (2-ekran)' },
  { t: 'Tushuncha', s: 's2–s8', d: 'muammo · lenta · test · CI · CD · nuqtalar va buyruqlar · test', m: 'chiqish kodi (4-ekran)' },
  { t: "O'yin", s: 's9–s11', d: "lenta o'yini (qizil nuqtada to'xtaydi) · test · nega", m: '&& zanjiri (8-ekran)' },
  { t: 'ci.yml', s: 's12–s14', d: "ikki holat · ci.yml bo'shliqlari (on · runs-on · run) · test", m: 'checkout (11-ekran) · npm install (13-ekran)' },
  { t: 'Yakun', s: 's15–s16', d: "lentani yig'ish · amaliyot (o'z repoga ci.yml) · kartochkalar · uyga vazifa (test)", m: "Actions'da qizil va yashil (19-ekran)" },
];
const S22 = mkS(22, [{ hl: [] }, { hl: [3, 4], warn: true }, { hl: [2] }, { hl: [4], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP22.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.warn && <div className="n2-warn">Amaliyotdagi <code>ci.yml</code>da <b>checkout yo'q</b> — birinchi qadam qilib <code>- uses: actions/checkout@v7</code> qo'shtiring; o'rnatish — <code>npm install</code>.</div>}
    {seg.sum && <div className="mk-rule">Vaqt (taklif): 90 daqiqaning <b>30 tasi</b> — amaliyotga. Har o'quvchi Actions'da <b>bitta yashil</b> lentani ko'rsin.</div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const STUMBLE23 = [
  ["Lenta yo'q", 'Actions bo\'sh', '.github/workflows nomi'],
  ["Checkout yo'q", 'Could not read package.json', 'actions/checkout'],
  ['npm ci', 'in sync', 'npm install'],
  ["Test yo'q", 'No tests found', 'bitta test'],
  ['Lint', '46 error', 'lentadan olib turish'],
  ['YAML', 'qator raqami', 'surilish'],
];
const QA23 = [
  ['«Lenta pulli emasmi?»', "GitHub hujjatida (01.11.2026): ochiq repoda standart mashina bepul; yopiq repoda tarifdagi bepul ulushdan sarflanadi, oshsa — pullik."],
  ['«Kompyuterim o\'chiq bo\'lsa ham ishlaydimi?»', 'ha — lenta GitHub mashinasida yuradi.'],
  ['«Qizil lenta — yomonmi?»', "yo'q — xato foydalanuvchidan oldin ushlandi."],
  ['«.env lentada bormi?»', "yo'q — maxfiy qiymatlar GitHub Secrets'da."],
];
const S23 = mkS(23, [{ v: 'til' }, { hl: [1, 2, 3] }, { hl: [0, 4, 5] }, { hl: [], qa: true }]);
function Screen23(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <Lenta />
      <div className="mk-tag" style={{ margin: '10px 0 0' }}>chamadon = kod · yo'l xaritasi = ci.yml · lenta mashinasi = runner</div>
    </div> : <div className="mk-qa">
      {STUMBLE23.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>lenta logini o'quvchi bilan birga o'qing</b>: avval qaysi qadam qizil, keyin xabar.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA23.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
// ============================================================
//  24 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[24].final;
function Screen24(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: lenta, o'quvchi reposidagi tuzoqlar va chiqarish. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4c-01 dagi lenta va sinfdagi tuzoqlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker="O'z-sinov" idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? 'Savollarga javob bering' : 'Natijani oching'}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">O'z-sinov · natija{attempt > 1 ? ` · ${attempt}-urinish` : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? "dars o'zlashtirildi" : "yana bir ko'rib chiqing"}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{f.s}-ekran</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>Sinovni qayta topshirish</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">O'z-sinov · {i + 1} / {FINAL.length} · bitta urinish · to'g'ri: {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? "To'g'ri" : "Noto'g'ri — to'g'risi yashil"}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? 'Keyingi savol →' : "Natijani ko'rish →"}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  25 · Yakun (M13)
// ============================================================
const SUM25 = [
  { k: 'ci', t: "CI — har push toza mashinada tekshiriladi; CD — chiqarish: Delivery (tasdiq bilan) · Deployment (o'zi)", st: ['push', 'lenta'] },
  { k: 'kod', t: "Lenta = toza papka + buyruqlar + chiqish kodi; birinchi qizilda to'xtaydi (&&)", st: ['lenta', 'res'] },
  { k: 'repo', t: "O'quvchi reposi: npm ci — in sync, npm install ishlaydi; test yo'q — qizil; build yashil", st: ['lenta'] },
  { k: 'yml', t: "ci.yml: on · runs-on · steps; birinchi qadam — actions/checkout", st: ['yml'] },
  { k: 'buz', t: "Buzamiz: lint 46 error; YAML xatosida — qator raqami", st: ['yml', 'res'] },
  { k: 'oq', t: "O'quvchi darsi: aeroport so'zlari = buyruqlar; amaliyotga checkout qo'shtiring", st: ['push', 'yml'] },
];
const STATIONS25 = [['push', 'git push', T.ink], ['yml', 'ci.yml', T.green], ['lenta', 'lenta mashinasi', T.blue], ['res', 'yashil / qizil', T.accent]];
function SummaryMap25({ hl }) {
  const cur = SUM25.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — lenta yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS25.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK25 = [
  { t: "Lenta: Jest darslaridagi reposingizga .github/workflows/ci.yml (12-ekran)", c: [] },
  { t: "Yashil: push → Actions'da yashil lenta", c: ['git add .github && git commit -m "ci: lenta"', 'git push'] },
  { t: 'Qizil: testni ataylab buzing → push → qizil, Received', c: ['git commit -am "sinov: buzildi"', 'git push'] },
  { t: 'Tuzatish: push → yana yashil', c: ['git commit -am "tuzatildi"', 'git push'] },
  { t: "Repo linkini platformadagi uyga vazifangizga qo'ying", c: [] },
];
const CHEATSHEET25 = `# CI/CD-1 — mentor eslatmasi (lenta o'quvchi reposida)
## Tushuncha
CI — har push toza mashinada tekshiriladi (install → test → build) · CD — chiqarish: Delivery (tasdiq bilan), Deployment (o'zi)
Lenta mashinasi: ubuntu-latest = Ubuntu 24.04, Node 22 (GitHub Actions run logi, 01.11.2026; Ubuntu 26 ga o'tkazilmoqda); har safar BO'SH papka
Chiqish kodi: 0 — yashil, 0 emas — qizil; qizil qadamdan keyin lenta to'xtaydi (npm test && npm run build — xuddi shunday)
## O'quvchi reposi (toza clone'da sinalgan)
npm ci → "can only install packages when … in sync" (lock eskirgan) → npm install ishlaydi (759 paket)
test fayli yo'q → "No tests found, exiting with code 1" → lenta qizil; Jest-1 order.spec.ts bilan PASS
npm run build — yashil · npm run lint — 46 error (--fix 14 faylni o'zgartiradi); --fix siz 116 error
## Tavsiya ci.yml (.github/workflows/ci.yml)
name: CI / on: push / jobs: test: runs-on: ubuntu-latest / steps: actions/checkout@v7 · actions/setup-node@v7 (node-version: 22) · npm install · npm test · npm run build
checkout'siz: papka bo'sh → "Could not read package.json" (o'quvchi m4c-01 amaliyotidagi faylda checkout YO'Q — qo'shtiring)
## YAML xatolari (rasmiy tahlilchi)
on: once → Unexpected value 'once' · runs-on yo'q → Required property is missing: runs-on · surilish → block sequence … implicit map key (qator raqamiga qarang)
## O'quvchi darsidagi so'zlar (m4c-01)
Yig'ish = npm install · Skaner = npm test · O'lcham ramkasi = eslint · O'rash = npm run build · Uchirish = deploy · chamadon = kod · yo'l xaritasi = ci.yml
## Sizning uyga vazifangiz
o'z reposingizga ci.yml → yashil → ataylab qizil → tuzatish → repo linki platformadagi uyga vazifaga`;
const s25Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CI har push'ni tekshiradi; CD — <b>chiqarish</b>, tasdiq bilan yoki o'zi", "Birinchi: CI har push'ni toza mashinada tekshiradi. CD tekshirilgan yukni chiqaradi: Delivery tasdiq bilan, Deployment o'zi.", { hl: 'ci' }),
  sg('b2', "Lenta: toza papka, buyruqlar va <b>chiqish kodi</b>", "Ikkinchi: lenta bu toza papka, sizning buyruqlaringiz va chiqish kodi. Birinchi qizil qadamda to'xtaydi.", { hl: 'kod' }),
  sg('b3', "O'quvchi reposi: <b>npm install</b>, kamida bitta test", "Uchinchi: o'quvchi reposida npm ci yiqiladi, npm install ishlaydi. Test fayli bo'lmasa lenta qizil. Build yashil.", { hl: 'repo' }),
  sg('b4', "ci.yml: on, runs-on, steps — birinchi qadam <b>checkout</b>", "To'rtinchi: ci yml'da on, runs on va steps. Birinchi qadam doim actions checkout, aks holda papka bo'sh.", { hl: 'yml' }),
  sg('b5', "Buzamiz: <b>lint 46 error</b>, YAML'da qator raqami", "Beshinchi: o'quvchi reposida lint qirq olti error beradi, lentaga hozircha qo'yilmaydi. YAML xatosida avval qator raqamiga qarang.", { hl: 'buz' }),
  sg('b6', "O'quvchi darsi: aeroport so'zlari — <b>buyruqlar</b>", "Oltinchi: o'quvchi darsidagi aeroport so'zlari buyruqlarning o'zi. Amaliyotda checkout qatorini qo'shtiring.", { hl: 'oq' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z reposingizga lenta — yashil, qizil, yana yashil", "Uyga vazifa: Jest darslaridagi reposingizga lenta qo'shing: checkout, setup node, npm install, npm test va npm run build. Avval yashilni ko'ring, keyin testni ataylab buzib qizilni, so'ng tuzatib yana yashilni.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. O'ttiz-qirq besh daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: tushuncha, o'quvchi reposi, ci.yml va tuzoqlar — bir sahifada", "Pastda bir sahifalik eslatma: tushunchalar, o'quvchi reposidagi natijalar, tavsiya ci yml, YAML xatolari va o'quvchi tili. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET25;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'cicd-1-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s25Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker="Yakun" idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel="Darsni yakunlash" lockHint="Ustoz gapirib bo'lgach ochiladi">
      <div className="mk-body">
        <Say title={passed ? 'Barakalla! Endi siz bilasiz' : 'Endi siz bilasiz'} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap25 hl={hl} />
            <div className="mk-plan">{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 30–45 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> ci.yml to'g'ri papkada · checkout birinchi · npm install · Actions tarixida bitta qizil va undan keyingi yashil.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>GitHub Actions</div><div style={{ fontSize: 13.5, color: T.ink2 }}>run, log va o'quvchi darsidagi namunalar</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">Mentor kursi · CI/CD</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 13-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Jest darslari o'tilgan · o'quvchi reposi (IntroNestArxitechture) · GitHub hisobi va o'z reposingiz · Node.js 20+ · VS Code", "Loyiha: o'quvchi reposi — toza clone'da lentani qo'lda, keyin o'z reposingizda GitHub Actions bilan"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP1, Screen10, Screen11, Screen12, Screen13, ScreenP2, Screen15, Screen16, Screen17, Screen18, ScreenP3, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
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
  if (!started) return <Cover onStart={() => setStarted(true)} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
