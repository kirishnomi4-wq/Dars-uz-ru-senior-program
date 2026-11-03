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
//  CI/CD-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-matn.py (manba: 24-CICD2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Lenta yozildi. Endi uni GitHub'da ochib, qizilini o'qiymiz",
  "seg": [
   [
    "a",
    "Oldingi darsdagi lentani GitHub'ga qo'ydik va <b>28 tajriba</b> qildik",
    "Assalomu alaykum. Oldingi darsda lenta faylini yozdik va terminalda sinadik. Bu safar uni haqiqiy GitHub'ga qo'ydik: o'quvchi reposining nusxasida yigirma sakkiz tajriba, har birining logi bilan."
   ],
   [
    "b",
    "Avval Actions oynasi: run, job va qadam, keyin <b>qizil run logi</b>",
    "Avval Actions oynasini o'qishni o'rganamiz: run, job va qadam. Keyin qizil run'ni o'qiymiz: sabab qayerda yozilgan va chiqish kodi nimani bildiradi."
   ],
   [
    "c",
    "Keyin fayl xatolari va o'quvchi darsidagi <b>matrix, cache, secrets haqiqati</b>",
    "Keyin fayl xatolarini ko'ramiz: ba'zida run umuman boshlanmaydi. So'ng o'quvchi darsidagi matrix, cache va secrets namunalarini GitHub'da yurgizib ko'ramiz. Natijalarning ba'zisi kutilmagan."
   ],
   [
    "d",
    "Xulosa: besh bosqich, <b>uch amaliyot</b>; ustoz gapirib bo'lgach Davom ochiladi",
    "Dars besh bosqichdan iborat, uchta amaliyot bor, hammasi o'z reposingizda. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · Actions oynasi",
  "title": "Har push — bitta run: ro'yxatda commit xabari, belgi va vaqt",
  "seg": [
   [
    "a",
    "Repo sahifasidagi Actions bo'limi: har push'dan keyin <b>yangi qator — run</b>",
    "Rejani ko'rdingiz, endi oynaning o'zini ochamiz. GitHub'da repo sahifasida Actions bo'limi bor. Har push'dan keyin u yerda yangi qator paydo bo'ladi. Bu qator run deyiladi: lentaning bitta yurishi."
   ],
   [
    "b",
    "Qator nomi — <b>commit xabari</b>; yonida workflow nomi, tarmoq va push",
    "Qatorning nomi commit xabaringiz. Uning yonida workflow nomi turadi, ya'ni faylning birinchi qatoridagi name: CI. Keyin tarmoq va hodisa, bu yerda push. Shuning uchun commit xabarini tushunarli yozing."
   ],
   [
    "c",
    "Belgi: yashil belgi — hammasi o'tdi, qizil xoch — <b>qaysidir qadam yiqildi</b>",
    "Chap tomonda belgi turadi: yashil belgi hamma qadam o'tdi degani, qizil xoch qaysidir qadam yiqildi degani. Vaqtga ham qarang: to'qqiz soniyalik qizil run odatda o'rnatishgacha ham yetmagan."
   ],
   [
    "d",
    "Xulosa: run'lar <b>tarixi saqlanadi</b> — qizil va undan keyingi yashil ketma-ket ko'rinadi",
    "Xulosa: har push bitta run yaratadi va bu tarix saqlanib qoladi. Ikkinchi run qizil, uchinchisi yashil: xato topildi va tuzatildi. O'quvchi ishini ham shu ro'yxatdan ko'rasiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · Actions oynasi",
  "title": "Run ichida job, job ichida qadamlar; uchtasini GitHub o'zi qo'shadi",
  "seg": [
   [
    "a",
    "Run ichida job ro'yxati: faylda <code>jobs: test:</code> — <b>bitta job <code>test</code></b>",
    "Ro'yxatdagi birinchi run'ni ochamiz. Chap tomonda job'lar ro'yxati turadi. Faylda jobs ostida bitta nom bor, test. Shuning uchun job ham bitta: test. Ikkita nom yozilsa, ikkita job bo'lardi."
   ],
   [
    "b",
    "Job ichida qadamlar: har <code>uses</code> va <code>run</code> — <b><code>Run …</code> nomli qadam</b>",
    "Job ichida esa qadamlar bor. Faylingizdagi har qator qadamga aylangan, oldiga Run so'zi qo'shilgan: run actions checkout, run npm install, run npm test. Eng uzuni o'rnatish qadami, u o'ttiz to'rt soniya davom etdi."
   ],
   [
    "c",
    "<code>Set up job</code>, <code>Post …</code>, <code>Complete job</code> — faylda yo'q, <b>GitHub o'zi qo'shadi</b>",
    "Faylda yo'q qadamlar ham bor. Set up job mashinani tayyorlaydi, Post qadamlari uses'dan keyin tozalaydi, Complete job yakunlaydi. Ularni GitHub o'zi qo'shadi, siz yozmaysiz."
   ],
   [
    "d",
    "Xulosa: o'quvchi <b>«nuqta» desa — job</b>, <b>«amal» desa — qadam</b>",
    "Xulosa: run ichida job, job ichida qadam. O'quvchi darsida nuqta va amal so'zlari ishlatiladi: nuqta bu job, amal bu qadam. Oynada ularni shu nomlar bilan ko'rsating."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · Actions oynasi",
  "title": "uses qadamining logi — tayyor qadam ichida nima bo'lganini aytadi",
  "seg": [
   [
    "a",
    "<code>uses</code> — boshqalar yozgan <b>tayyor qadam</b>; <code>Set up job</code> uni yuklab oladi",
    "Qadamlar ichiga kiramiz. Uses qadami boshqalar yozgan tayyor dastur. Set up job logida ko'rinadi: GitHub actions checkout'ni o'z reposidan yuklab oldi. Shu yerda mashina ham yozilgan: Ubuntu yigirma to'rt."
   ],
   [
    "b",
    "checkout: papkani tozalaydi va repodan <b>faqat oxirgi commit'ni</b> oladi",
    "Checkout logiga qaraymiz: u avval ish papkasini tozalaydi, keyin git init qiladi va repodan faqat oxirgi commit'ni oladi, fetch depth bir. Shuning uchun lentada git tarixi yo'q, faqat joriy kod."
   ],
   [
    "c",
    "setup-node: Node 22 <b>mashinada tayyor turibdi</b> — o'rnatish soniyadan kam",
    "Setup node qadamida node version yigirma ikki so'radik. Mashinada u tayyor turgan ekan: found in cache. Natijada node yigirma ikki va npm o'n o'rnatilgan. Sizning kompyuteringizdagi npm versiyasidan farq qilishi mumkin."
   ],
   [
    "d",
    "Xulosa: <code>uses</code> qadami tushunarsiz bo'lsa — <b>logini oching</b>, u nima qilganini aytadi",
    "Xulosa: uses qadami qora quti emas. Logini ochsangiz, nima qilganini qadamma-qadam aytadi. GitHub yana bir narsani eslatadi: ubuntu latest Ubuntu yigirma oltiga o'tkazilmoqda, versiya o'zgarishi mumkin."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Run'dagi qaysi qadam ci.ymlda yozilmagan — uni GitHub o'zi qo'shgan?",
  "q": "Qadamlarni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Run ichidagi qaysi qadam faylingizda yozilmagan, uni GitHub o'zi qo'shgan? Variantni tanlang.",
  "ok": "To'g'ri. Set up job faylda yo'q: GitHub mashinani tayyorlaydi va uses qadamlarini yuklab oladi. Post qadamlari va Complete job ham GitHub'niki. Demak, run'dagi hamma qadam ham sizning faylingizdan emas: tayyorlash va tozalash qadamlarini GitHub o'zi qo'shadi.",
  "okShort": "<code>Set up job</code> — GitHub'niki: mashina va <code>uses</code> qadamlarini tayyorlaydi.",
  "hint": "Faylingizdagi qatorlar oldiga Run qo'shiladi. Qaysi nomda Run yo'q?",
  "correct": 1,
  "opts": [
   "Run npm install",
   "Set up job",
   "Run actions/checkout@v7",
   "Run npm test"
  ],
  "wrong": {
   "0": "Bu sizning run: npm install qatoringiz.",
   "2": "Bu sizning uses: actions/checkout@v7 qatoringiz.",
   "3": "Bu sizning run: npm test qatoringiz."
  }
 },
 "6": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "O'z reposingizdagi oxirgi run: job, qadamlar va Node versiyasi",
  "seg": [
   [
    "a",
    "Endi siz: oldingi darsda lenta qo'shgan reposingizdagi <b>run'ni ochasiz</b>",
    "Endi navbat sizga. Oldingi darsda lenta qo'shgan reposingizni oching. Lenta bo'lmasa, avval tavsiya faylini qo'shib push qiling. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: Actions → oxirgi run → job <code>test</code> va <b>qadamlar ro'yxati</b>",
    "Birinchi qadamda Actions bo'limida oxirgi run'ni ochasiz. Ikkinchisida job test'ni bosib, qadamlarni sanaysiz: siz yozganlari qaysi, GitHub qo'shganlari qaysi."
   ],
   [
    "c",
    "3–4-qadam: <code>Set up job</code> dagi Ubuntu, <code>setup-node</code> dagi <b><code>node:</code> satri</b> — isbot",
    "Uchinchi qadamda Set up job'ni ochib, Ubuntu versiyasini topasiz. To'rtinchisida setup node qadamidagi environment details guruhini ochasiz. Undagi node satrini isbot maydoniga qo'ying."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'z run'ingizda qaysi qadamni o'zingiz yozganingizni va qaysini GitHub qo'shganini ajrata olasiz."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Qizil run'da sabab izohda emas — qizil qadamning logida",
  "seg": [
   [
    "a",
    "Oldingi darsdagi buzish <b>endi GitHub'da</b>: ko'paytirish o'rniga qo'shish, push",
    "Yashil run'ni o'qidik, endi qizil run'ni ko'ramiz. Oldingi darsda terminalda qilgan buzishni GitHub'ga push qildik: ko'paytirish o'rniga qo'shish. Ro'yxatda ikkinchi run qizil xoch bilan chiqdi."
   ],
   [
    "b",
    "Qizil qadam — <code>npm test</code>; build va <code>Post setup-node</code> — <b>kulrang, yurmadi</b>",
    "Run ichida npm test qadami qizil. Undan keyingi build kulrang, skipped, ya'ni yurmadi. Setup node'ning tozalash qadami ham yurmadi. Lenta birinchi qizilda to'xtaydi, terminaldagi kabi."
   ],
   [
    "c",
    "Izohda faqat «exit code 1»; sabab — <b>qadam logida</b>: <code>Expected</code> va <code>Received</code>",
    "Run sahifasi tepasida izoh bor: process completed with exit code bir. Bu sabab emas, faqat kod. Sababni qizil qadam logidan o'qiymiz: expected yigirma ming, received o'n ming ikki."
   ],
   [
    "d",
    "Xulosa: <b>qizil qadamni oching</b>, logdagi xabarni o'qing — tuzatgach run yashil",
    "Xulosa: avval qizil qadamni oching, xabarni logdan o'qing, izohdan emas. Xatoni tuzatib push qildik: uchinchi run yashil, tests bir passed, build ham o'tdi."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Izohdagi son xato turini aytadi: 1, 127, 254, 2, 128",
  "seg": [
   [
    "a",
    "Izohdagi son — qadam qaytargan chiqish kodi; u <b>xato turini</b> taxminan aytadi",
    "Qizil run'larda izoh doim bir xil: process completed with exit code va son. Bu son qizil qadamning chiqish kodi. Biz yigirma sakkiz tajribada beshta turli kod ko'rdik."
   ],
   [
    "b",
    "Kod 1 — buyruq yurdi va <b>«yo'q» dedi</b>: test yiqildi yoki <code>npm ci</code> rad etdi",
    "Kod bir shuni bildiradi: buyruq ishga tushdi va o'zi yo'q dedi. Masalan test yiqildi yoki npm ci lock fayl mos emas dedi. Eng ko'p uchraydigani shu."
   ],
   [
    "c",
    "127 — <b>buyruq topilmadi</b>; 254 — npm fayl topmadi; 2 va 128 — bash va git",
    "Yuz yigirma yetti bo'lsa, buyruq umuman topilmagan, masalan jest o'rnatilmagan. Ikki yuz ellik to'rt bo'lsa, npm package json'ni topmagan. Ikki bo'lsa, bash qatorni tushunmagan. Yuz yigirma sakkiz esa git xatosi."
   ],
   [
    "d",
    "Xulosa: kod — yo'nalish, sabab — <b>logdagi birinchi <code>error</code> satri</b>",
    "Xulosa: kod yo'nalish beradi, sababni esa logdagi birinchi error satri aytadi. O'quvchi «qizil» desa, avval qaysi qadam va qaysi kod deb so'rang."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "npm ci ikki xil yiqiladi: lock eskirgan yoki lock umuman yo'q",
  "seg": [
   [
    "a",
    "Oldingi darsda terminalda ko'rgan <code>in sync</code> — GitHub'da ham <b>birinchi qadamda qizil</b>",
    "Kodlarni bildik, endi eng ko'p uchraydigan qizilni ko'ramiz: o'rnatish qadami. Oldingi darsda terminalda ko'rgan in sync xatosi GitHub'da ham chiqdi. Run o'n besh soniyada qizil, test'gacha yetmadi."
   ],
   [
    "b",
    "O'quvchi reposi: <b>lock fayl eskirgan</b> — <code>Missing: … from lock file</code>",
    "O'quvchi reposida lock fayl bor, lekin eskirgan: package json'dagi paketlar unda yo'q. Xabarda missing from lock file qatorlari turadi. npm ci bunday holatda hech narsa o'rnatmaydi."
   ],
   [
    "c",
    "«Repongiz yo'qmi?» namunasi: <b>lock umuman yo'q</b> — xabar boshqacha",
    "O'quvchi darsidagi «Repongiz yo'qmi» namunasida lock fayl umuman yo'q. Xabar ham boshqacha: npm ci faqat mavjud package lock bilan ishlaydi. Ikkalasining kodi bir, sababini xabardan ajratasiz."
   ],
   [
    "d",
    "Xulosa: bu repolarda <b><code>npm install</code> yozing</b> — run yashil, 759 paket",
    "Xulosa: o'quvchi repolarida npm install yozing. Shu bilan run yashil bo'ldi, yetti yuz ellik to'qqiz paket o'rnatildi. npm ci kerak bo'lsa, avval lock faylni yangilab push qilish kerak."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Qadam yo'q yoki joyi xato: Could not read package.json va jest: not found",
  "seg": [
   [
    "a",
    "Checkout'siz lenta: oldingi darsdagi bo'sh papka <b>GitHub'da ham bo'sh</b>",
    "O'rnatishdan oldin yana bir qizil bor. Oldingi darsda bo'sh papkada package json topilmagan edi. GitHub'da checkout qadamini olib tashladik: xuddi shu xato, kodi ikki yuz ellik to'rt."
   ],
   [
    "b",
    "Logdagi yo'l — <b>mashinadagi ish papkasi</b>; u yerda repo kodi yo'q",
    "Logdagi yo'lga qarang: home runner work va repo nomi. Bu mashinadagi ish papkasi. Checkout bo'lmasa, u bo'sh qoladi va npm package json'ni topmaydi."
   ],
   [
    "c",
    "Tartib xato: <code>npm test</code> o'rnatishdan oldin — <b><code>jest: not found</code>, kod 127</b>",
    "Ikkinchi holat: npm test'ni npm install'dan oldinga qo'ydik. Jest hali o'rnatilmagan, shuning uchun jest not found chiqdi, kodi yuz yigirma yetti. Qadam nol soniyada yiqildi."
   ],
   [
    "d",
    "Xulosa: tartib — <b>checkout, setup-node, <code>npm install</code>, <code>npm test</code>, build</b>; run yashil",
    "Xulosa: tartib doim bir xil: checkout, setup node, npm install, npm test, build. Tavsiya fayli shu tartibda, run yashil. Endi xato satrni o'zingiz topasiz."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Logda sh: 1: jest: not found, kod 127. Qaysi satr sabab?",
  "q": "Tartib xatosini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Run qizil, npm test qadami nol soniyada yiqildi, logda jest not found. Faylning qaysi satri sabab? Shu satrni bosing.",
  "ok": "To'g'ri. O'n birinchi satr: npm test o'rnatishdan oldin turibdi, jest hali yo'q. Uni npm install'dan keyinga qo'yamiz. Ekranda tuzatilgan tartib va yashil run. Demak, qadam nol soniyada yiqilsa, avval qadamlar tartibini tekshiring.",
  "okShort": "11-satr: <code>npm test</code> o'rnatishdan oldin — <code>npm install</code>dan keyinga.",
  "hint": "jest qayerdan keladi? Uni qaysi buyruq o'rnatadi va u qaysi satrda?",
  "task": "Run qizil: <code>Run npm test</code> qadami 0 soniyada yiqildi, logda <code>jest: not found</code>. <b>Sababchi satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Tartibni ataylab buzing: qizil qadam, kod va tuzatish",
  "seg": [
   [
    "a",
    "Endi siz: qadamlar <b>tartibini buzasiz</b> va izohdagi kodni o'qiysiz",
    "Endi o'z reposingizda tartibni buzasiz. Oldingi darsda testni buzgandingiz, bu safar faylni buzasiz. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>npm test</code> qatorini <b><code>npm install</code>dan oldinga</b> ko'chiring, push",
    "Birinchi qadamda ci yml'dagi npm test qatorini npm install'dan oldinga ko'chirasiz. Ikkinchisida commit va push qilib, Actions'da yangi run qizil bo'lishini kutasiz."
   ],
   [
    "c",
    "3–4-qadam: <b>qizil qadamdagi kod</b> — isbot; keyin tartibni tiklang, yashil",
    "Uchinchi qadamda run sahifasidagi izohdan chiqish kodini o'qib, isbot maydoniga yozasiz. To'rtinchisida tartibni tiklab, push qilasiz va yashil run'ni kutasiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, qadamlar tartibi buzilganda qaysi kod chiqishini o'z run'ingizda ko'rdingiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "3-bosqich · fayl xatolari",
  "title": "Fayl o'qilmasa run darhol qizil: job ham, qadam ham, log ham yo'q",
  "seg": [
   [
    "a",
    "Oldingi darsda tahlilchida ko'rgan uch xato — <b>GitHub'da qanday ko'rinadi</b>",
    "Qadamdagi xatolarni ko'rdik, endi faylning o'zidagi xato. Oldingi darsda uch YAML xatosini tahlilchida ko'rgan edik. Endi o'shalarni GitHub'ga push qildik."
   ],
   [
    "b",
    "Run darhol qizil: nol soniya, ichida <b>job ham, qadam ham, log ham yo'q</b>",
    "Natijada run ro'yxatda paydo bo'ladi va shu zahoti qizil bo'ladi. Ichida job yo'q, qadam yo'q, log yo'q. Mashina ishga ham tushmagan, chunki GitHub faylni o'qiy olmadi."
   ],
   [
    "c",
    "Izohda «Invalid workflow file», <b>qator 4</b> — xato esa <b>8-qatorda</b>",
    "Run sahifasida izoh bor: invalid workflow file. On once va runs on xatosida matn tahlilchidagi bilan bir xil. Surilishda esa faqat yaml syntax va to'rtinchi qator deyiladi. Xato aslida sakkizinchi qatorda: GitHub blok boshini, test job'ini ko'rsatdi."
   ],
   [
    "d",
    "To'rtinchi xato: <code>echo</code> ichidagi <b>ikki nuqta</b> — qo'shtirnoqsiz qatorda YAML'ni buzadi",
    "To'rtinchi xato kutilmagan edi: run echo natija ikki nuqta ok qatori. Qatordagi ikki nuqta va bo'sh joy YAML uchun yangi kalit degani. Tahlilchi nested mappings deydi, GitHub'da run darhol qizil."
   ],
   [
    "e",
    "Xulosa: <b>qadamsiz qizil run — fayl xatosi</b>; aniq qatorni tahlilchida toping, <code>run: |</code> bilan yozing",
    "Xulosa: qadami yo'q qizil run ko'rsangiz, bu fayl xatosi. GitHub ko'rsatgan qatordan pastroqqa ham qarang, aniq qatorni tahlilchi beradi. Ikki nuqtali buyruqni run va tik chiziqdan keyingi qatorga yozing: shunday run yurdi."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "3-bosqich · fayl xatolari",
  "title": "Papka nomi xato — run yo'q; runs-on xato — run cheksiz kutadi",
  "seg": [
   [
    "a",
    "Qizildan ham yomoni bor: <b>run umuman yo'q yoki tugamaydi</b>",
    "Qizil run hech bo'lmasa ko'rinadi. Ikki holatda esa qizil ham yo'q. Birinchisi: papka nomida bitta harf xato, workflow o'rniga workflow, s harfisiz."
   ],
   [
    "b",
    "<code>.github/workflow</code> — <b>GitHub faylni ko'rmaydi</b>: Actions'da hech narsa paydo bo'lmaydi",
    "Push qildik va bir yarim daqiqa kutdik: run soni nol. GitHub faylni faqat workflows papkasidan qidiradi. Xato xabari ham yo'q, shuning uchun o'quvchi uzoq qidiradi."
   ],
   [
    "c",
    "<code>runs-on: my-laptop</code> — bunday mashina yo'q, run <b>uch daqiqadan keyin ham kutmoqda</b>",
    "Ikkinchi holat o'quvchi darsidagi noto'g'ri variantdan chiqadi: runs on my laptop. Tahlilchi buni xato demaydi. GitHub esa shu nomli mashinani kutadi: uch daqiqadan keyin ham queued. Biz uni qo'lda bekor qildik."
   ],
   [
    "d",
    "Xulosa: run yo'q — <b>papka nomi</b>; run sariq va kutmoqda — <b><code>runs-on</code> nomi</b>",
    "Xulosa: run umuman yo'q bo'lsa, papka nomini tekshiring. Run sariq bo'lib kutib tursa, runs on qatorini tekshiring. To'g'ri fayl workflows papkasida va ubuntu latest bilan: run yashil."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi: «Push qildim, run o'n daqiqadan beri sariq, kutmoqda». Sabab?",
  "q": "Kutib turgan run'ni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi push qildi, run o'n daqiqadan beri sariq, kutmoqda. Eng ehtimolli sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Runs on'da GitHub'da yo'q nom yozilgan, masalan my laptop. Run shu mashinani kutadi va o'zi tugamaydi. Nomni ubuntu latest qilib, eski run'ni bekor qiling. Demak, run sariq bo'lib tugamasa, sabab ko'pincha runs on'dagi nomda.",
  "okShort": "Cheksiz kutish — <code>runs-on</code> nomi: <code>ubuntu-latest</code> qiling.",
  "hint": "Run ishga tushmagan — mashina topilmagan. Mashinani qaysi qator tanlaydi?",
  "correct": 2,
  "opts": [
   "Testlar juda sekin",
   "Fayl .github/workflow papkasida",
   "runs-onda GitHub'da yo'q mashina nomi",
   "Checkout qadami yo'q"
  ],
  "wrong": {
   "0": "Testlar sekin bo'lsa, run sariq emas, «yurmoqda» holatida bo'ladi.",
   "1": "Papka xato bo'lsa, run umuman paydo bo'lmaydi.",
   "3": "Checkout'siz run tez qizil bo'ladi, kutib turmaydi."
  }
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsidagi namunalar",
  "title": "O'quvchi darsidagi matrix: uch job yashil, lekin uchalasida Node 22",
  "seg": [
   [
    "a",
    "O'quvchi darsida <code>matrix</code>: bir faylda uch Node versiyasi — <b>uch parallel job</b>",
    "Fayl xatolarini bildik, endi o'quvchi darsidagi qo'shimchalarni ko'ramiz. Birinchisi matrix: unda node o'n sakkiz, yigirma va yigirma ikki yozilgan. GitHub bitta job'dan uchta job yasaydi va ularni parallel yurgizadi."
   ],
   [
    "b",
    "Natija: <code>test (18)</code>, <code>test (20)</code>, <code>test (22)</code> — <b>uchalasi yashil</b>",
    "O'quvchi darsidagi faylni aynan shunday push qildik. Run'da uchta job: test o'n sakkiz, test yigirma, test yigirma ikki. Uchalasi yashil. Bir qarashda hammasi joyidadek."
   ],
   [
    "c",
    "Lekin logda uchalasi <code>v22.23.4</code>: <b>matrix <code>setup-node</code>ga ulanmagan</b>",
    "Lekin har job'da node version'ni chiqardik: uchalasida yigirma ikki. Matrix faqat job nomini o'zgartirgan. Setup node'ga qaysi versiya kerakligi aytilmagan, u mashinadagisini qoldirgan."
   ],
   [
    "d",
    "Xulosa: <code>node-version: ${{ matrix.node }}</code> qo'shilgach — <b>18, 20 va 22 haqiqatan</b>",
    "Xulosa: setup node'ga node version qatorini qo'shing va matrix node'ni bering. Shundan keyin logda o'n sakkiz, yigirma va yigirma ikki chiqdi. O'quvchiga yashil belgi emas, logdagi versiyani ko'rsating."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsidagi namunalar",
  "title": "O'quvchi darsidagi cache qizil: key majburiy. To'g'risi — setup-node cache: npm",
  "seg": [
   [
    "a",
    "O'quvchi darsida <code>actions/cache</code> va <code>path: node_modules</code> — <b>«5 baravar tez»</b>",
    "Ikkinchi qo'shimcha cache. O'quvchi darsida actions cache qadami bor, faqat path yozilgan, va besh baravar tezlashadi deyilgan. Shu faylni o'quvchi reposiga push qildik."
   ],
   [
    "b",
    "Natija: <b>cache qadami qizil</b> — <code>Input required and not supplied: key</code>",
    "Natijada cache qadamining o'zi qizil bo'ldi. Izohda key kiritilmagan deyilgan. Bu qadam uchun key majburiy. O'rnatish ham, build ham yurmadi: o'quvchi faylni ko'chirsa, lentasi tezlashmaydi, to'xtaydi."
   ],
   [
    "c",
    "To'g'risi — <code>setup-node</code>da <b><code>cache: npm</code></b>: o'rnatish 44 soniyadan 16 soniyaga",
    "Oddiyroq yo'l bor: setup node'ga cache npm qatorini qo'shish. O'lchab ko'rdik: cache'siz o'rnatish qirq to'rt soniya davom etdi. Birinchi run'da foyda yo'q, kesh endi saqlanadi. Ikkinchi run'da esa o'n olti soniya."
   ],
   [
    "d",
    "Xulosa: kesh <b>ikkinchi run'dan ishlaydi</b>, o'rnatish taxminan 2,8 baravar tez — 5 emas",
    "Xulosa: kesh ikkinchi run'dan boshlab ishlaydi. Bu repoda o'rnatish taxminan ikki yarim, uch baravar tezlashdi, besh emas. O'quvchiga raqamni o'z run'idan ko'rsating."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsidagi namunalar",
  "title": "Secret logda `",
  "seg": [
   [
    "a",
    "O'quvchi darsi: secret «logda hech qachon ochiq ko'rinmaydi»; <b>tekshirdik</b>",
    "Uchinchi qo'shimcha secrets. O'quvchi darsida kalit faylda emas, seyfda turadi va logda hech qachon ochiq ko'rinmaydi deyilgan. Sinov kaliti qo'yib, logga chiqarib ko'rdik."
   ],
   [
    "b",
    "To'g'ridan chiqarilsa — <b><code>***</code></b>; qadam nomida ham yashiriladi",
    "Kalitni to'g'ridan echo qilsak, logda uchta yulduzcha chiqadi. Qadam nomida ham yulduzcha turadi. GitHub qiymatni aynan shu ko'rinishda qidiradi va yashiradi."
   ],
   [
    "c",
    "Bo'laklab chiqarilsa — kalit logda <b>to'liq ochiq</b>; yo'q secret esa bo'sh qator",
    "Lekin kalitni ikki bo'lakka bo'lib chiqardik: logda to'liq ochiq. Aynan qiymat bo'lmagani uchun yashirilmadi. Yana bir narsa: yozilmagan secret xato bermaydi, bo'sh qator qaytaradi, run yashil."
   ],
   [
    "d",
    "Xulosa: secret'ni <b>logga umuman chiqarmang</b>; yo'q secret run'ni qizil qilmaydi",
    "Xulosa: secret'ni logga umuman chiqarmang, yulduzcha faqat aynan qiymatni yashiradi. Kalit nomi xato bo'lsa, run yashil qoladi, xato keyin chiqadi. Kalit nomini sinchiklab tekshiring."
   ]
  ]
 },
 "19": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'z lentangizga matrix: Node 20 va 22, versiya logda",
  "seg": [
   [
    "a",
    "Endi siz: lentangizni ikki Node versiyasida yurgizasiz va <b>logdan tekshirasiz</b>",
    "Oxirgi amaliyot: lentangizni ikki Node versiyasida yurgizasiz va versiyani yashil belgidan emas, logdan tekshirasiz. Bunga o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>strategy: matrix: node: [20, 22]</code> va <b><code>node-version: ${{ matrix.node }}</code></b>",
    "Birinchi qadamda job ichiga strategy, matrix va node qatorini yozasiz: yigirma va yigirma ikki. Ikkinchisida setup node'dagi node version qatoriga matrix node'ni berasiz. Ekrandagi fayl namuna."
   ],
   [
    "c",
    "3–4-qadam: <code>node --version</code> qadami, push; <b><code>test (20)</code> dagi versiya</b> — isbot",
    "Uchinchi qadamda setup node'dan keyin node version'ni chiqaradigan qadam qo'shib, push qilasiz. To'rtinchisida test yigirma job'ini ochib, chiqqan versiyani isbot maydoniga yozasiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, matrix haqiqatan ishlayotganini yashil belgidan emas, logdagi versiyadan bilasiz."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "O'quvchi darsidagi actions/cache@v4 + path: node_modules ko'chirildi. Nima bo'ladi?",
  "q": "Namunalarni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi darsidagi cache qadamini, faqat path bilan, o'z reposiga ko'chirdi va push qildi. Nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Actions cache uchun key majburiy. Qadam qizil, o'rnatish va build yurmaydi. To'g'risi: setup node'da cache npm, ikkinchi run'dan o'rnatish tezlashadi. Demak, o'quvchi darsidan ko'chirilgan faylni ham GitHub'da yurgizib, natijasini tekshirish kerak.",
  "okShort": "<code>key</code>siz <code>actions/cache</code> — qizil; <code>setup-node</code> <code>cache: npm</code> yozing.",
  "hint": "Izohdagi so'zni eslang: qaysi kirish yetishmadi?",
  "correct": 3,
  "opts": [
   "Ikkinchi run'dan besh baravar tez",
   "Yashil, lekin kesh saqlanmaydi",
   "Fayl xatosi, run qadamsiz qizil",
   "Cache qadami qizil: Input required and not supplied: key"
  ],
  "wrong": {
   "0": "Run kesh qadamida to'xtaydi, tezlik o'lchanmaydi ham.",
   "1": "Yashil bo'lmaydi: qadam majburiy kirishsiz ishlamaydi.",
   "2": "Tahlilchi bu faylni xatosiz deydi: xato faqat qadam yurganda chiqadi."
  }
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4c-03 · «GitHub Actions — yo'l xaritasini yozish»",
  "title": "m4c-03: yo'l xaritasi, nuqta va amal — 23 ekran",
  "seg": [
   [
    "a",
    "m4c-03 — 23 ekran: <b>yo'l xaritasi, nuqta, amal</b> va qo'shimchalar",
    "Endi o'quvchi darsini ko'ramiz: m4c-03, unda yigirma uch ekran bor. Darsda fayl yo'l xaritasi, job nuqta, qadam esa amal deb ataladi. Dars besh blokdan iborat: kirish, YAML, on va runs on, qo'shimchalar va markaziy ekran."
   ],
   [
    "b",
    "O'quvchi darsida <code>@v4</code> — ishlaydi, lekin GitHub <b>har run'da ogohlantiradi</b>",
    "Birinchi farq versiyada: o'quvchi darsida checkout va setup node'ning to'rtinchi versiyasi yozilgan. Sinadik: run yashil, lekin har safar Node yigirma eskirgan degan ogohlantirish chiqadi. Yettinchisini tavsiya qiling."
   ],
   [
    "c",
    "Qo'shimchalar blokida <b>uch tuzatish</b>: matrix'ni ulang, <code>cache: npm</code>, secret'ni chiqarmang",
    "Qo'shimchalar blokida uchta tuzatish aytasiz: matrix'ni setup node'ga ulang, cache uchun setup node'dagi cache npm, secret'ni logga umuman chiqarmang. Dalillari o'n oltinchi, o'n yettinchi va o'n sakkizinchi ekranlarda."
   ],
   [
    "d",
    "Xulosa: o'quvchi yozgan har faylni push qildiring — natijani <b>Actions'da birga o'qing</b>",
    "Xulosa: o'quvchi darsi simulyatsiya, Actions esa haqiqat. Har o'quvchi faylini push qilsin va run'ni siz bilan birga o'qisin. Simulyatsiya qayerda farq qilishini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsidagi to'rt holat GitHub'da boshqacha chiqadi",
  "seg": [
   [
    "a",
    "Simulyatsiyada o'tgan begona qatorlar GitHub'da <b>run'ni qizil qiladi</b>",
    "Xaritani ko'rdingiz, endi farqlarni ko'ramiz. Markaziy ekranda begona qatorlar bor: print test va git push. Simulyatsiya ularni o'tkazadi. GitHub'da ikkalasi qizil: birinchisini bash tushunmaydi, ikkinchisiga ruxsat yo'q."
   ],
   [
    "b",
    "<code>git push</code> — 403: lentadagi token repoga <b>faqat o'qish</b> uchun ruxsat oladi",
    "Git push nega 403? Set up job logida yozilgan: token ruxsati contents read, ya'ni faqat o'qish. Lenta repoga o'zi yozolmaydi. O'quvchi so'rasa, shu satrni ko'rsating."
   ],
   [
    "c",
    "<b>Testsiz lenta — yashil</b>; «Repongiz yo'qmi?» namunasida test doim yashil",
    "Yakuniy ekranda test qadami yo'q lenta qizil deyiladi. Haqiqatda run yashil: tekshirmaydigan lenta xato topmaydi. «Repongiz yo'qmi» namunasida test doim yashil, qizil uchun skriptni exit bir qiling."
   ],
   [
    "d",
    "Xulosa: o'quvchiga ayting — yashil belgi <b>faqat yozilgan qadamlar</b> o'tganini bildiradi",
    "Xulosa: o'quvchiga ayting, yashil belgi faqat yozilgan qadamlar o'tdi degani. Test qadami bo'lmasa, yashil hech narsani kafolatlamaydi. Shuning uchun lentada npm test albatta bo'lsin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "5-bosqich · sinfda",
  "title": "O'quvchi darsidagi so'zni Actions oynasida ko'rsating; sinfdagi olti holat",
  "seg": [
   [
    "a",
    "O'quvchi darsi so'zlarini <b>Actions oynasidagi joy</b> bilan birga ko'rsating",
    "Farqlarni bildingiz, endi sinfda ishlatiladigan so'zlarni ko'ramiz. O'quvchi yo'l xaritasi, nuqta va amal deydi. Siz har so'z bilan Actions oynasidagi joyni ko'rsating: nuqta, ya'ni job."
   ],
   [
    "b",
    "Uch holat <b>run'ning o'zidan</b> taniladi: run yo'q, sariq kutish, qadamsiz qizil",
    "Endi sinfda chiqadigan holatlar. Uchtasi run'ning o'zidan taniladi. Run yo'q bo'lsa, papka nomi xato. Run sariq kutib tursa, runs on xato. Qadamsiz qizil bo'lsa, fayl xatosi."
   ],
   [
    "c",
    "Uch holat <b>kod va logdan</b>: 127, 254 va <code>npm ci</code> dagi kod 1",
    "Qolgan uchtasi kod va logdan taniladi. Kod yuz yigirma yetti bo'lsa, jest yo'q, install'ni oldinroq qo'ying. Ikki yuz ellik to'rt bo'lsa, checkout yo'q. Kod bir va in sync bo'lsa, npm install yozing."
   ],
   [
    "d",
    "Xulosa: javobni aytmang — o'quvchi bilan qizil qadam, kod va logni <b>birga o'qing</b>",
    "Xulosa va usul bitta: javobni darhol aytmang. O'quvchi bilan birga o'qing: qaysi qadam qizil, qaysi kod va logdagi birinchi error satri nima deydi. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Actions'da har push nimani yaratadi?",
    "o": [
     "bitta run",
     "bitta repo",
     "bitta tarmoq",
     "bitta secret"
    ],
    "c": 0,
    "e": "Run nomi — commit xabari.",
    "s": 2
   },
   {
    "q": "Set up job qadami qayerdan keladi?",
    "o": [
     "ci.ymldagi birinchi qator",
     "GitHub o'zi qo'shadi",
     "checkout ichidan",
     "npm installdan"
    ],
    "c": 1,
    "e": "Mashina va uses qadamlarini tayyorlaydi.",
    "s": 3
   },
   {
    "q": "Qizil run'da sababni qayerdan o'qiysiz?",
    "o": [
     "izohdagi «exit code»",
     "run nomidan",
     "qizil qadam logidan",
     "davomiyligidan"
    ],
    "c": 2,
    "e": "Izohda faqat kod.",
    "s": 7
   },
   {
    "q": "npm test npm installdan oldin turibdi — logda?",
    "o": [
     "in sync",
     "Could not read package.json",
     "Received: 10002",
     "jest: not found, kod 127"
    ],
    "c": 3,
    "e": "Jest hali o'rnatilmagan.",
    "s": 10
   },
   {
    "q": "runs-on: my-laptop bilan run?",
    "o": [
     "sariq holda cheksiz kutadi",
     "darhol qizil",
     "yashil",
     "paydo bo'lmaydi"
    ],
    "c": 0,
    "e": "Bunday mashina yo'q, tahlilchi xato demaydi.",
    "s": 14
   },
   {
    "q": "Fayl .github/workflow/ci.yml da (s yo'q)?",
    "o": [
     "qadamsiz qizil run",
     "run umuman yo'q",
     "sariq kutadi",
     "yashil"
    ],
    "c": 1,
    "e": "GitHub faqat workflowsdan qidiradi.",
    "s": 14
   },
   {
    "q": "matrix: node: [18, 20, 22], node-version yo'q?",
    "o": [
     "uch xil versiya",
     "bitta job",
     "uch job, uchalasida Node 22",
     "fayl xatosi"
    ],
    "c": 2,
    "e": "Matrix setup-nodega ulanmagan.",
    "s": 16
   },
   {
    "q": "Secret ikki bo'lakka bo'lib chiqarildi — logda?",
    "o": [
     "***",
     "bo'sh qator",
     "run qizil",
     "to'liq ochiq"
    ],
    "c": 3,
    "e": "Faqat aynan qiymat yashiriladi.",
    "s": 18
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
//  CI/CD-2 RUN MA'LUMOTI — AVTO: dev/cicd2-runlar.py (manba: manba/cicd2-out, GitHub API)
// ============================================================
const RUNS = {"10": {"id": "41311353505", "n": 8, "title": "ci: yo'l xaritasi (o'quvchi amaliyoti, @v4)", "br": "mashq", "sha": "89eb39b", "st": "ok", "dur": "11 s", "at": "2026-11-01T13:27:36Z", "jobs": [{"name": "test", "st": "ok", "dur": "8 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v4", "ok", "1 s"], ["Run actions/setup-node@v4", "ok", "1 s"], ["Run npm install", "ok", "1 s"], ["Run npm test", "ok", "0 s"], ["Post Run actions/setup-node@v4", "ok", "0 s"], ["Post Run actions/checkout@v4", "ok", "1 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "11": {"id": "41311391902", "n": 9, "title": "ci: npm ci (andozadagidek)", "br": "mashq", "sha": "b81cd55", "st": "bad", "dur": "9 s", "at": "2026-11-01T13:28:05Z", "jobs": [{"name": "test", "st": "bad", "dur": "7 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v4", "ok", "1 s"], ["Run actions/setup-node@v4", "ok", "0 s"], ["Run npm ci", "bad", "2 s"], ["Run npm test", "skip", "0 s"], ["Post Run actions/setup-node@v4", "skip", "0 s"], ["Post Run actions/checkout@v4", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["failure", "Process completed with exit code 1."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "12": {"id": "41311425951", "n": 10, "title": "sinov: test ataylab buzildi", "br": "mashq", "sha": "4a6ad83", "st": "bad", "dur": "9 s", "at": "2026-11-01T13:28:31Z", "jobs": [{"name": "test", "st": "bad", "dur": "6 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v4", "ok", "1 s"], ["Run actions/setup-node@v4", "ok", "0 s"], ["Run npm install", "ok", "1 s"], ["Run npm test", "bad", "0 s"], ["Post Run actions/setup-node@v4", "skip", "0 s"], ["Post Run actions/checkout@v4", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["failure", "Process completed with exit code 1."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "13": {"id": "41311460402", "n": 11, "title": "ci: checkout'siz", "br": "mashq", "sha": "bb3a6cd", "st": "bad", "dur": "8 s", "at": "2026-11-01T13:28:58Z", "jobs": [{"name": "test", "st": "bad", "dur": "5 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/setup-node@v4", "ok", "0 s"], ["Run npm install", "bad", "1 s"], ["Run npm test", "skip", "0 s"], ["Post Run actions/setup-node@v4", "skip", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["failure", "Process completed with exit code 254."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "14": {"id": "41311494840", "n": 12, "title": "ci: test qadamisiz", "br": "mashq", "sha": "02d0be0", "st": "ok", "dur": "9 s", "at": "2026-11-01T13:29:25Z", "jobs": [{"name": "test", "st": "ok", "dur": "6 s", "steps": [["Set up job", "ok", "0 s"], ["Run actions/checkout@v4", "ok", "1 s"], ["Run actions/setup-node@v4", "ok", "1 s"], ["Run npm install", "ok", "2 s"], ["Post Run actions/setup-node@v4", "ok", "0 s"], ["Post Run actions/checkout@v4", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "15": {"id": "41311525939", "n": 13, "title": "ci: v7, node 22", "br": "mashq", "sha": "9a8affe", "st": "ok", "dur": "9 s", "at": "2026-11-01T13:29:50Z", "jobs": [{"name": "test", "st": "ok", "dur": "6 s", "steps": [["Set up job", "ok", "0 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "1 s"], ["Run npm test", "ok", "0 s"], ["Post Run actions/setup-node@v7", "ok", "1 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "16": {"id": "41311563024", "n": 14, "title": "ci: print('test') qatori", "br": "mashq", "sha": "8b3e03d", "st": "bad", "dur": "9 s", "at": "2026-11-01T13:30:16Z", "jobs": [{"name": "test", "st": "bad", "dur": "7 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "0 s"], ["Run npm install", "ok", "1 s"], ["Run print('test')", "bad", "0 s"], ["Run npm test", "skip", "0 s"], ["Post Run actions/setup-node@v7", "skip", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["failure", "Process completed with exit code 2."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "17": {"id": "41311602909", "n": 15, "title": "ci: git push qatori", "br": "mashq", "sha": "292c705", "st": "bad", "dur": "8 s", "at": "2026-11-01T13:30:42Z", "jobs": [{"name": "test", "st": "bad", "dur": "5 s", "steps": [["Set up job", "ok", "0 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "0 s"], ["Run git push", "bad", "0 s"], ["Run npm test", "skip", "0 s"], ["Post Run actions/setup-node@v7", "skip", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["failure", "Process completed with exit code 128."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "20": {"id": "41310764794", "n": 1, "title": "ci: lenta (CI/CD-1 tavsiya)", "br": "main", "sha": "adfcfbf", "st": "ok", "dur": "46 s", "at": "2026-11-01T13:20:13Z", "jobs": [{"name": "test", "st": "ok", "dur": "43 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "0 s"], ["Run npm install", "ok", "34 s"], ["Run npm test", "ok", "1 s"], ["Run npm run build", "ok", "3 s"], ["Post Run actions/setup-node@v7", "ok", "1 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "21": {"id": "41310851212", "n": 2, "title": "sinov: buzildi", "br": "main", "sha": "0413276", "st": "bad", "dur": "1 daq 5 s", "at": "2026-11-01T13:21:16Z", "jobs": [{"name": "test", "st": "bad", "dur": "1 daq 3 s", "steps": [["Set up job", "ok", "0 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "57 s"], ["Run npm test", "bad", "1 s"], ["Run npm run build", "skip", "0 s"], ["Post Run actions/setup-node@v7", "skip", "0 s"], ["Post Run actions/checkout@v7", "ok", "1 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["failure", "Process completed with exit code 1."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "22": {"id": "41310963553", "n": 3, "title": "tuzatildi", "br": "main", "sha": "6defd2a", "st": "ok", "dur": "1 daq 8 s", "at": "2026-11-01T13:22:40Z", "jobs": [{"name": "test", "st": "ok", "dur": "1 daq 5 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "0 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "54 s"], ["Run npm test", "ok", "1 s"], ["Run npm run build", "ok", "5 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "1 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "23": {"id": "41311072242", "n": 4, "title": "ci: npm ci", "br": "main", "sha": "efc17af", "st": "bad", "dur": "15 s", "at": "2026-11-01T13:24:04Z", "jobs": [{"name": "test", "st": "bad", "dur": "12 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "4 s"], ["Run npm ci", "bad", "3 s"], ["Run npm test", "skip", "0 s"], ["Run npm run build", "skip", "0 s"], ["Post Run actions/setup-node@v7", "skip", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["failure", "Process completed with exit code 1."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "24": {"id": "41311117764", "n": 5, "title": "ci: tartib xato", "br": "main", "sha": "300612f", "st": "bad", "dur": "9 s", "at": "2026-11-01T13:24:39Z", "jobs": [{"name": "test", "st": "bad", "dur": "6 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm test", "bad", "0 s"], ["Run npm install", "skip", "0 s"], ["Run npm run build", "skip", "0 s"], ["Post Run actions/setup-node@v7", "skip", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["failure", "Process completed with exit code 127."], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "25": {"id": "41311151858", "n": 6, "title": "ci: v4 (o'quvchi darsidagi)", "br": "main", "sha": "3df10be", "st": "ok", "dur": "1 daq 10 s", "at": "2026-11-01T13:25:05Z", "jobs": [{"name": "test", "st": "ok", "dur": "1 daq 8 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v4", "ok", "1 s"], ["Run actions/setup-node@v4", "ok", "0 s"], ["Run npm install", "ok", "57 s"], ["Run npm test", "ok", "1 s"], ["Run npm run build", "ok", "5 s"], ["Post Run actions/setup-node@v4", "ok", "0 s"], ["Post Run actions/checkout@v4", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "26": {"id": "41311265640", "n": 7, "title": "ci: tavsiya", "br": "main", "sha": "ed8aa8b", "st": "ok", "dur": "46 s", "at": "2026-11-01T13:26:30Z", "jobs": [{"name": "test", "st": "ok", "dur": "43 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "0 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "34 s"], ["Run npm test", "ok", "1 s"], ["Run npm run build", "ok", "3 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "30": {"id": "41311640424", "n": 16, "title": "yaml: on once", "br": "yaml", "sha": "630ac32", "st": "bad", "dur": "0 s", "at": "2026-11-01T13:31:08Z", "jobs": [], "ann": []}, "31": {"id": "41311669043", "n": 17, "title": "yaml: runs-on yoq", "br": "yaml", "sha": "2419f11", "st": "bad", "dur": "0 s", "at": "2026-11-01T13:31:28Z", "jobs": [], "ann": []}, "32": {"id": "41311690722", "n": 18, "title": "yaml: surilish", "br": "yaml", "sha": "d86ab12", "st": "bad", "dur": "0 s", "at": "2026-11-01T13:31:45Z", "jobs": [], "ann": []}, "34": {"id": "41311712563", "n": 19, "title": "yaml: echo ichida ikki nuqta", "br": "yaml", "sha": "04d8f31", "st": "bad", "dur": "0 s", "at": "2026-11-01T13:32:00Z", "jobs": [], "ann": []}, "40": {"id": "41312019250", "n": 21, "title": "matrix: o'quvchi darsidagidek", "br": "matrix", "sha": "2599f71", "st": "ok", "dur": "13 s", "at": "2026-11-01T13:35:42Z", "jobs": [{"name": "test (22)", "st": "ok", "dur": "10 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "3 s"], ["Run npm test", "ok", "1 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}, {"name": "test (20)", "st": "ok", "dur": "5 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm test", "ok", "0 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}, {"name": "test (18)", "st": "ok", "dur": "6 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm test", "ok", "0 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "1 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "41": {"id": "41312070181", "n": 22, "title": "matrix: node-version ulandi", "br": "matrix", "sha": "314380f", "st": "ok", "dur": "14 s", "at": "2026-11-01T13:36:20Z", "jobs": [{"name": "test (18)", "st": "ok", "dur": "11 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "5 s"], ["Run npm test", "ok", "0 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "1 s"], ["Complete job", "ok", "0 s"]]}, {"name": "test (22)", "st": "ok", "dur": "6 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "0 s"], ["Run npm test", "ok", "1 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}, {"name": "test (20)", "st": "ok", "dur": "12 s", "steps": [["Set up job", "ok", "0 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "5 s"], ["Run npm test", "ok", "0 s"], ["Post Run actions/setup-node@v7", "ok", "1 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "50": {"id": "41312124240", "n": 23, "title": "cache: o'quvchi darsidagidek", "br": "cache", "sha": "0b68ae1", "st": "bad", "dur": "10 s", "at": "2026-11-01T13:37:01Z", "jobs": [{"name": "test", "st": "bad", "dur": "7 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run actions/cache@v4", "bad", "0 s"], ["Run npm install", "skip", "0 s"], ["Run npm run build", "skip", "0 s"], ["Post Run actions/cache@v4", "skip", "0 s"], ["Post Run actions/setup-node@v7", "skip", "0 s"], ["Post Run actions/checkout@v7", "ok", "1 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["warning", "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/cache@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"], ["failure", "Input required and not supplied: key"], ["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "51": {"id": "41312164455", "n": 24, "title": "cache: cache'siz o'lchov", "br": "cache", "sha": "7aeb008", "st": "ok", "dur": "55 s", "at": "2026-11-01T13:37:32Z", "jobs": [{"name": "test", "st": "ok", "dur": "52 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "44 s"], ["Run npm run build", "ok", "4 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "52": {"id": "41312257467", "n": 25, "title": "cache: setup-node cache npm (1)", "br": "cache", "sha": "bcf9308", "st": "ok", "dur": "1 daq 1 s", "at": "2026-11-01T13:38:42Z", "jobs": [{"name": "test", "st": "ok", "dur": "58 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "1 s"], ["Run npm install", "ok", "45 s"], ["Run npm run build", "ok", "4 s"], ["Post Run actions/setup-node@v7", "ok", "3 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "53": {"id": "41312362682", "n": 26, "title": "cache: 2-run", "br": "cache", "sha": "4a0f97f", "st": "ok", "dur": "34 s", "at": "2026-11-01T13:40:05Z", "jobs": [{"name": "test", "st": "ok", "dur": "30 s", "steps": [["Set up job", "ok", "1 s"], ["Run actions/checkout@v7", "ok", "1 s"], ["Run actions/setup-node@v7", "ok", "3 s"], ["Run npm install", "ok", "17 s"], ["Run npm run build", "ok", "5 s"], ["Post Run actions/setup-node@v7", "ok", "0 s"], ["Post Run actions/checkout@v7", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}, "61": {"id": "41312438092", "n": 27, "title": "secret: logda", "br": "secret", "sha": "1ffb523", "st": "ok", "dur": "6 s", "at": "2026-11-01T13:41:01Z", "jobs": [{"name": "test", "st": "ok", "dur": "3 s", "steps": [["Set up job", "ok", "0 s"], ["Run echo \"Kalit: ***\"", "ok", "0 s"], ["Run echo \"Uzunligi: ${#API_KEY}\"", "ok", "0 s"], ["Run echo \"Yo'q secret: []\"", "ok", "0 s"], ["Complete job", "ok", "0 s"]]}], "ann": [["notice", "\"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\""]]}};

// ============================================================
//  MENTOR KURSI · CI/CD-2 «GitHub Actions»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/24-CICD2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/cicd2-out/ (sinov repo kirishnomi4-wq/mentor-ci-sinov — haqiqiy GitHub Actions run'lari)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx cicd2/parts/*.jsx > GithubActionsMentorLesson.jsx
//  Yordamchilar CI/CD-1 dan nusxa; Actions oynasi — GitHub API'dagi haqiqiy run ma'lumotidan chizilgan (ActionsRun, ActionsList)
// ============================================================
const LESSON_ID = 'mentor-cicd-02-actions-v1';
const LESSON_TITLE = "GitHub Actions: run, log va o'quvchi darsidagi namunalar";
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
  ['nuqta github, workflows papkasidagi yml faylida', '.github/workflows/ci.yml faylida'], ['ci yml', 'ci.yml'],
  ['actions checkout', 'actions/checkout'], ['Actions cache', 'actions/cache'], ['actions cache', 'actions/cache'], ['Setup node', 'setup-node'], ['setup node', 'setup-node'],
  ['package json', 'package.json'], ['package lock', 'package-lock'], ['node modules', 'node_modules'],
  ['ubuntu latest', 'ubuntu-latest'], ['Runs on', 'runs-on'], ['runs on', 'runs-on'], ['On once', 'on: once'], ['on once', 'on: once'], ['my laptop', 'my-laptop'],
  ['in sync', 'in sync'], ['could not read package json', 'Could not read package.json'], ['missing from lock file', 'Missing … from lock file'],
  ['process completed with exit code', 'Process completed with exit code'], ['jest not found', 'jest: not found'], ['found in cache', 'Found in cache'],
  ['fetch depth bir', 'fetch-depth: 1'], ['node version', 'node-version'], ['matrix node', 'matrix.node'], ['cache npm', 'cache: npm'], ['contents read', 'Contents: read'],
  ['environment details', 'Environment details'], ['Set up job', 'Set up job'], ['Complete job', 'Complete job'], ['nested mappings', 'Nested mappings'],
  ['run va tik chiziqdan keyingi qatorga', 'run: | dan keyingi qatorga'], ['run echo natija ikki nuqta ok', 'run: echo "Natija: ok"'],
  ['print test', "print('test')"], ['jobs ostida', 'jobs: ostida'], ['name: CI', 'name: CI'], ['git init', 'git init'],
  ['expected yigirma ming, received o\'n ming ikki', 'Expected 20000, Received 10002'], ['tests bir passed', 'Tests: 1 passed'],
];
DIGITS.unshift(["o'n oltinchi, o'n yettinchi va o'n sakkizinchi ekranlarda", '16, 17 va 18-ekranlarda'], ["ikki yuz ellik to'rt", '254'], ["yuz yigirma yetti", '127'], ["yuz yigirma sakkiz", '128'],
  ["yetti yuz ellik to'qqiz", '759'], ["yigirma sakkiz", '28'], ["yigirma uch ekran", '23 ekran'], ["Ubuntu yigirma oltiga", 'Ubuntu 26 ga'], ["Ubuntu yigirma to'rt", 'Ubuntu 24'], ['Node yigirma ikki', 'Node 22'],
  ["node yigirma ikki, npm o'n", 'node 22, npm 10'], ["o'ttiz to'rt soniya", '34 soniya'], ["qirq to'rt soniya", '44 soniya'], ["o'n olti soniya", '16 soniya'], ["o'n besh soniyada", '15 soniyada'],
  ["o'n sakkiz, yigirma, yigirma ikki", '18, 20, 22'], ["o'n sakkiz, yigirma va yigirma ikki", '18, 20 va 22'], ["test o'n sakkiz, test yigirma, test yigirma ikki", 'test (18), test (20), test (22)'],
  ["test yigirma job'ini", "test (20) job'ini"], ["yigirma va yigirma ikki", '20 va 22'], ["Node yigirma eskirgan", 'Node 20 eskirgan'], ['yigirma ikki', '22'],
  ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'], ["O'n birinchi satr", '11-satr'], ["nol soniyada", '0 soniyada'], ['kod bir', 'kod 1'], ["exit bir", 'exit 1'], ["o'n daqiqadan", '10 daqiqadan']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /process completed with exit code/gi, /could not read package json/gi, /missing from lock file/gi, /found in cache/gi, /jest not found/gi,
  /environment details/gi, /nested mappings/gi, /set up job/gi, /complete job/gi, /fetch depth/gi, /contents read/gi, /in sync/gi, /runner/gi,
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
// GitHub Actions oynalari — sinov reposidagi HAQIQIY run'lar ma'lumotidan (gh api: runs, jobs, steps, log). Skrinshot emas: maket,
// lekin har nom, holat, vaqt va log satri — cicd2-out/ dagi o'sha run'dan. Pastki yozuv qaysi run ekanini aytadi.
const GH_ST = { ok: '✓', bad: '✗', skip: '⊘', wait: '●', off: '○' };
// Actions bo'limi: run'lar ro'yxati (qator ko'rinishi — runlar-royxati-skrinshot.png ga moslangan). rows: [{ st, title, wf, n, sha, br, ago, dur, hl }]
function ActionsList({ rows = [], src }) {
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">mentor-ci-sinov · Actions</span><span className="src">{src}</span></div>
    <div className="lst">
      {rows.map((r, i) => <div key={i} className={`row ${r.st}${r.hl ? ' hl' : ''}${r.dim ? ' dim' : ''}`}>
        <span className="dot">{GH_ST[r.st]}</span>
        <span className="tl"><b>{r.title}</b><small>{r.wf} #{r.n}: Commit {r.sha} pushed by kirishnomi4-wq</small></span>
        <span className="brn">{r.br}</span>
        <span className="tm"><small>{r.ago}</small><small>{r.dur}</small></span>
      </div>)}
    </div>
  </div>;
}
// Bitta run sahifasi: chapda job'lar, o'ngda tanlangan job qadamlari; open — log ochilgan qadam (lines — haqiqiy log satrlari)
function ActionsRun({ run = {}, jobs = [], steps = [], open, lines = [], ann, src, hlStep, empty }) {
  const hs = Array.isArray(hlStep) ? hlStep : hlStep == null ? [] : [hlStep];
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">{run.title}</span><span className="src">{src}</span></div>
    <div className="hd"><span className={`dot ${run.st}`}>{GH_ST[run.st]}</span><b>{run.wf} #{run.n}</b><span>{run.br} · {run.sha}</span><span className="du">{run.dur}</span></div>
    {ann && <div className={`ann${ann.k === 'notice' ? ' nt' : ann.k === 'warning' ? ' wr' : ''}`}><b>{ann.t}</b><span>{ann.m}</span></div>}
    {empty ? <div className="empty">{empty}</div> : <div className="rb">
      <div className="jobs">{jobs.map((j, i) => <div key={i} className={`jb ${j.st}${j.on ? ' on' : ''}`}><span className="dot">{GH_ST[j.st]}</span>{j.name}<small>{j.dur}</small></div>)}</div>
      <div className="steps">
        {steps.map(([n, st, du], i) => <div key={i} className={`st ${st}${hs.includes(i) ? ' hl' : ''}`}>
          <span className="dot">{GH_ST[st]}</span><span className="nm">{n}</span><small>{du}</small>
          {open === i && lines.length > 0 && <pre className="log">{lines.map((l, k) => <span key={k} className={l.c || ''}>{l.t}{'\n'}</span>)}</pre>}
        </div>)}
      </div>
    </div>}
  </div>;
}

// CI/CD-2 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
/* GitHub Actions oynalari (haqiqiy run ma'lumotidan) */
.c2-gh{background:#fff;border:1px solid #D0D7DE;border-radius:10px;overflow:hidden;color:${PG.gh}}
.c2-gh .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#F6F8FA;border-bottom:1px solid #D0D7DE;font:600 12px ${SANS}}
.c2-gh .bar .lg{font-weight:800}
.c2-gh .bar .src{margin-left:auto;font:600 10.5px ${MONO};color:#57606A;background:#fff;border:1px solid #D0D7DE;border-radius:6px;padding:3px 7px}
.c2-gh .dot{display:inline-flex;flex:none;width:18px;height:18px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;color:#fff;background:#8C959F}
.c2-gh .ok>.dot,.c2-gh .dot.ok{background:#1A7F37}
.c2-gh .bad>.dot,.c2-gh .dot.bad{background:#CF222E}
.c2-gh .wait>.dot,.c2-gh .dot.wait{background:#BF8700}
.c2-gh .lst{display:grid}
/* umumiy .ok/.bad rangi bu yerda matnga o'tmasin — faqat belgi (dot) rangli */
.c2-gh .row.ok,.c2-gh .row.bad,.c2-gh .row.skip,.c2-gh .row.wait,.c2-gh .row.off,.c2-gh .jb.ok,.c2-gh .jb.bad,.c2-gh .jb.wait{color:#1F2328}
.c2-gh .st.ok,.c2-gh .st.bad,.c2-gh .st.wait{color:#E6EDF3}
.c2-gh .st.skip,.c2-gh .st.off{color:#8B949E}
.c2-gh .row{display:flex;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px solid #EAEEF2;transition:opacity .3s,background .3s}
.c2-gh .row.hl{background:#FFF8C5}
.c2-gh .row .tl{display:grid;gap:2px;min-width:0}
.c2-gh .row .tl b{font:600 14px ${SANS};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c2-gh .row small{font:12px ${SANS};color:#57606A}
.c2-gh .row .brn{flex:none;font:12px ${MONO};color:#0969DA;background:#DDF4FF;border-radius:6px;padding:2px 7px}
.c2-gh .row .tm{margin-left:auto;display:grid;text-align:right;gap:2px;white-space:nowrap}
.c2-gh .hd{display:flex;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid #EAEEF2;font:13px ${SANS}}
.c2-gh .hd b{font-size:15px}
.c2-gh .hd .du{margin-left:auto;color:#57606A}
.c2-gh .ann{margin:8px 12px 0;padding:8px 10px;border:1px solid #FFCECB;background:#FFEBE9;border-radius:6px;font:12.5px ${MONO};display:grid;gap:3px}
.c2-gh .ann b{font:700 12.5px ${SANS};color:#CF222E}
.c2-gh .ann.nt{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.nt b{color:#9A6700}
.c2-gh .ann.wr{border-color:#D4A72C;background:#FFF8C5}
.c2-gh .ann.wr b{color:#9A6700}
.c2-gh .empty{padding:18px 14px;font:13px ${SANS};color:#57606A;background:#F6F8FA}
.c2-gh .row.dim,.c2-gh .st.dim{opacity:.4}
.c2-grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.c2-grid4{grid-template-columns:1fr 1fr}}
.c2-mk{border-radius:12px;border:1px solid ${T.line};background:${T.paper};padding:12px 14px}
.c2-code{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:center;padding:8px 12px;border:1px solid ${T.line};border-radius:10px;background:${T.paper};transition:opacity .3s,border-color .3s,background .3s}
.c2-code.hl{border-color:${T.accent};background:#FFF7F3}
.c2-code .n{font:800 22px ${MONO};color:${T.accent};text-align:center}
.c2-code .t{display:grid;gap:2px;font-size:13px}
.c2-code .t code{font:12px ${MONO};color:${T.ink2};overflow-wrap:anywhere}
.c2-gh .rb{display:grid;grid-template-columns:150px minmax(0,1fr);gap:0}
.c2-gh .jobs{border-right:1px solid #EAEEF2;padding:8px;display:grid;align-content:start;gap:4px}
.c2-gh .jb{display:flex;gap:6px;align-items:center;font:600 13px ${SANS};padding:5px 6px;border-radius:6px}
.c2-gh .jb.on{background:#F6F8FA}
.c2-gh .jb small{margin-left:auto;font:11px ${SANS};color:#57606A}
.c2-gh .steps{padding:8px 10px;display:grid;gap:2px;background:#0D1117;color:#E6EDF3;min-width:0}
.c2-gh .st{display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:8px;align-items:center;padding:4px 4px;border-radius:6px;font:13px ${MONO}}
.c2-gh .st small{color:#8B949E;font:12px ${MONO}}
.c2-gh .st.skip .nm,.c2-gh .st.off .nm{color:#8B949E}
.c2-gh .st.hl{background:#30363D}
.c2-gh .st .log{grid-column:2/4;margin:4px 0 6px;padding:8px 10px;background:#161B22;border-radius:6px;font:12px/1.5 ${MONO};white-space:pre-wrap;overflow-wrap:anywhere;color:#C9D1D9}
.c2-gh .log .er{color:#FF7B72}
.c2-gh .log .ok{color:#7EE787}
.c2-gh .log .cm{color:#8B949E}
.c2-gh .log .wn{color:#E3B341}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-c2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-c2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Umumiy: Actions oynalari RUNS (04-runlar.gen.jsx) dan; log satrlari — cicd2-out/NN-*.txt dan aynan
// ============================================================
// UTC → Toshkent (+05:00), «01.11 18:20»
const hhmm = (iso) => { if (!iso) return ''; const h = (Number(iso.slice(11, 13)) + 5) % 24; return `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${String(h).padStart(2, '0')}:${iso.slice(14, 16)}`; };
const runRows = (keys, hl = [], dim = []) => keys.map((k) => { const r = RUNS[k]; return { st: r.st, title: r.title, wf: 'CI', n: r.n, sha: r.sha, br: r.br, ago: hhmm(r.at), dur: r.dur, hl: hl.includes(k), dim: dim.includes(k) }; });
const runSrc = (...ks) => `haqiqiy run ma'lumotidan · run #${ks.map((k) => RUNS[k].n).join(', #')}`;
const annOf = (k) => { const a = (RUNS[k].ann || []).find(([lv]) => lv === 'failure'); return a ? { t: 'Annotations · test', m: a[1] } : null; };
// Log satri rangi: xato — qizil, o'tdi — yashil, xizmat satri — kulrang
const lg = (src) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((t) => ({ t,
  c: /Expected:/.test(t) ? 'ok' : /error|FAIL|✕|Received:|not found|fatal|syntax error|failed|Missing:/.test(t) ? 'er' : /PASS|✓|passed|^added \d+|restored|Cache hit|Cache saved/.test(t) ? 'ok' : /warning|deprecated|migrate/.test(t) ? 'wn' : /^>|^\s*with:|^\s{2}[\w-]+: |^Download|^Image|^Version|^Operating|^Ubuntu|^GITHUB_TOKEN|^Contents|^\[command\]/.test(t) ? 'cm' : '' }));
function RunView({ k, job = 0, open, lines, hlStep, ann, steps }) {
  const r = RUNS[k]; const j = r.jobs[job];
  return <ActionsRun run={{ title: r.title, st: r.st, wf: 'CI', n: r.n, br: r.br, sha: r.sha, dur: r.dur }}
    jobs={r.jobs.map((x, i) => ({ name: x.name, st: x.st, dur: x.dur, on: i === job }))}
    steps={steps || (j ? j.steps : [])} open={open} lines={lines} ann={ann === undefined ? annOf(k) : ann} src={runSrc(k)} hlStep={hlStep}
    empty={!r.jobs.length ? "Job yo'q · qadam yo'q · log yo'q — fayl o'qilmadi" : null} />;
}
const MAIN7 = ['26', '25', '24', '23', '22', '21', '20'];
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
      - run: npm run build`, { 1: { id: 'nm' }, 3: { id: 'jb' }, 4: { id: 'jb' }, 7: { id: 'us' }, 8: { id: 'us' }, 9: { id: 'us' }, 10: { id: 'us' }, 11: { id: 'rn' }, 12: { id: 'rn' }, 13: { id: 'rn' } });
const LOG_TEST_BAD = lg(String.raw`
> IntroNestArxitechture@0.0.1 test
> jest
FAIL src/order.spec.ts
  orderTotal
    ✕ 2 kitob narxini hisoblaydi (4 ms)
  ● orderTotal › 2 kitob narxini hisoblaydi
    Expected: 20000
    Received: 10002
Tests:       1 failed, 1 total
##[error]Process completed with exit code 1.`);
const LOG_TEST_OK = lg(String.raw`
> IntroNestArxitechture@0.0.1 test
> jest
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (3 ms)
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total`);

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Actions oynasi', "Qizilni o'qish", 'Fayl xatolari', "O'quvchi darsidagi namunalar", "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>O'quvchi reposining nusxasi GitHub'da — «main» tarmog'idagi 7 run</div>
    <ActionsList rows={runRows(MAIN7)} src={runSrc('20', '26').replace(', #', '–#')} />
  </div>} />;
}

// ============================================================
//  2 · Actions oynasi: run ro'yxati (runlar-api.tsv)
// ============================================================
const S2 = mkS(2, [{ hl: ['26'] }, { hl: ['20'], name: true }, { hl: ['21', '23', '24'] }, { hl: ['21', '22'], sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <ActionsList rows={runRows(MAIN7, seg.hl)} src={runSrc('20', '26').replace(', #', '–#')} />
    {seg.name && <div className="c2-mk" style={{ animation: 'mk-up .4s ease both' }}>
      <div className="pg-row"><span>«ci: lenta (CI/CD-1 tavsiya)»</span><span style={{ color: T.ink3 }}>→</span><span>commit xabari: <code>git commit -m "…"</code></span></div>
      <div className="pg-row" style={{ marginTop: 6 }}><span>CI #1: Commit adfcfbf pushed by …</span><span style={{ color: T.ink3 }}>→</span><span>workflow <code>name: CI</code> · run raqami · commit · kim push qilgan</span></div>
      <div className="pg-row" style={{ marginTop: 6 }}><span>main</span><span style={{ color: T.ink3 }}>→</span><span>tarmoq (o'ngdagi belgi)</span></div>
    </div>}
    {seg.sum && <div className="mk-rule">Har push — <b>bitta run</b>, tarix saqlanadi: #2 qizil → #3 yashil — xato topildi va tuzatildi.</div>}
  </div>} />;
}

// ============================================================
//  3 · Run → job → step (cicd2-out/20)
// ============================================================
const S3 = mkS(3, [{ f: ['jb'], hs: [] }, { f: ['us', 'rn'], hs: [1, 2, 3, 4, 5] }, { f: [], hs: [0, 6, 7, 8] }, { f: [], hs: [], sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={CI_FILES} active={F.ci}><CodePanel file={F.ci} lines={YML_OK} focus={seg.f} /></Ide></div>
      <RunView k="20" hlStep={seg.hs} />
    </div>
    {seg.sum && <div className="pg-three" style={{ animation: 'mk-up .4s ease both' }}>
      <div className="mk-box" style={{ '--c': T.green }}><h4>yo'l xaritasi</h4><p><code>.github/workflows/ci.yml</code></p></div>
      <div className="mk-box" style={{ '--c': T.blue }}><h4>nuqta</h4><p>job — <code>test</code></p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4>amal</h4><p>qadam (step) — <code>Run npm test</code></p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  4 · uses ichida: Set up job, checkout, setup-node logi (cicd2-out/20)
// ============================================================
const LOG_SETUP = lg(String.raw`
Operating System: Ubuntu 24.04.5 LTS
Image: ubuntu-24.04 · Version: 20261025.353.1
GITHUB_TOKEN Permissions: Contents: read
Download action repository 'actions/checkout@v7' (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)
Download action repository 'actions/setup-node@v7' (SHA:949feb2413d6458794dcd2491c4babbbce0c15c1)`);
const LOG_CHECKOUT = lg(String.raw`
with:
  repository: kirishnomi4-wq/mentor-ci-sinov
  fetch-depth: 1
Deleting the contents of '/home/runner/work/mentor-ci-sinov/mentor-ci-sinov'
[command]/usr/bin/git init /home/runner/work/mentor-ci-sinov/mentor-ci-sinov
[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +adfcfbf…:refs/remotes/origin/main
[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main
Switched to a new branch 'main'`);
const LOG_NODE = lg(String.raw`
with:
  node-version: 22
Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64
Environment details
node: v22.23.4
npm: 10.9.9`);
const S4 = mkS(4, [{ open: 0, lines: LOG_SETUP }, { open: 1, lines: LOG_CHECKOUT }, { open: 2, lines: LOG_NODE }, { sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <RunView k="20" open={seg.open} lines={seg.lines || []} hlStep={seg.open} ann={seg.sum ? { k: 'notice', t: 'Izoh (notice) · har run\'da', m: 'The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026.' } : null} />
    {seg.sum && <div className="mk-rule"><code>uses</code> — qora quti emas: <b>logini oching</b>, qadamma-qadam nima qilganini aytadi.</div>}
  </div>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — GitHub qo'shgan qadam
// ============================================================
function Screen5(p) {
  const m = MDT[5];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy run #1: sariq fonda — GitHub qo'shgan qadamlar</div>
      <RunView k="20" hlStep={[0, 6, 7, 8]} />
    </div>} />;
}

// ============================================================
//  6 · Amaliyot 1 — o'z run'ingizni o'qish
// ============================================================
const P1 = mkS(6, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Run — GitHub → repo → Actions → oxirgi run', cmds: [], exp: '✓ yoki ✗ belgili qator' },
  { t: "Job — test → qadamlar ro'yxati", cmds: [], exp: 'Set up job … Complete job' },
  { t: 'Mashina — Set up job → Operating System', cmds: [], exp: 'Ubuntu 24.04.5 LTS (yoki yangiroq)' },
  { t: 'Node — Run actions/setup-node → Environment details', cmds: [], exp: 'node: v22.…' },
];
const P1_TROUBLE = [
  ["Actions'da run umuman yo'q", "fayl .github/workflows/ da emas (s harfi) yoki push qilinmagan (14-ekran)"],
  ['Run sariq, «kutmoqda»', "runs-on'da GitHub'da yo'q mashina nomi (14-ekran)"],
  ['Ubuntu 26 chiqdi', "ubuntu-latest yangilangan — GitHub eslatgan o'tish; xato emas"],
];
const P1_PROOF = { label: "setup-node logidagi node: satri", placeholder: "node satrini qo'ying", check: (v) => /^\s*node:\s*v\d+\.\d+\.\d+\s*$/.test(v), wrong: "Run actions/setup-node qadamida Environment details guruhini oching — node: bilan boshlanadigan satr" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  7 · Qizil run: qadam, log va tuzatish (cicd2-out/21, 22)
// ============================================================
const S7 = mkS(7, [{ v: 'list' }, { v: 'run', hs: [4, 5, 6] }, { v: 'log' }, { v: 'fix', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'list' && <ActionsList rows={runRows(['21', '20'], ['21'])} src={runSrc('20', '21')} />}
    {seg.v === 'run' && <RunView k="21" hlStep={seg.hs} />}
    {seg.v === 'log' && <RunView k="21" open={4} lines={LOG_TEST_BAD} hlStep={4} />}
    {seg.v === 'fix' && <RunView k="22" open={4} lines={LOG_TEST_OK} hlStep={4} />}
    {seg.sum && <div className="mk-rule">Qizil run'da: avval <b>qizil qadamni oching</b>, sababni logdan o'qing — izohda faqat kod.</div>}
  </div>} />;
}

// ============================================================
//  8 · Chiqish kodi — qaysi turdagi xato (izohlar: 21, 23, 24, 13, 16, 17)
// ============================================================
const CODES8 = [
  { n: '1', s: 'npm test', m: 'FAIL · Expected / Received', r: '21', g: 1 },
  { n: '1', s: 'npm ci', m: 'npm error code EUSAGE · in sync', r: '23', g: 1 },
  { n: '127', s: 'npm test', m: 'sh: 1: jest: not found', r: '24', g: 2 },
  { n: '254', s: 'npm install', m: 'npm error enoent Could not read package.json', r: '13', g: 2 },
  { n: '2', s: "print('test')", m: 'syntax error near unexpected token', r: '16', g: 2 },
  { n: '128', s: 'git push', m: "fatal: unable to access … 403", r: '17', g: 2 },
];
const S8 = mkS(8, [{ g: 0 }, { g: 1 }, { g: 2 }, { g: 0, sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    <div className="mk-tag" style={{ margin: 0 }}>Izoh: «Process completed with exit code N» — haqiqiy run'lardan</div>
    {CODES8.map((c, i) => <div key={i} className={`c2-code${seg.g && c.g === seg.g ? ' hl' : ''}`} style={{ opacity: seg.g && c.g !== seg.g ? 0.4 : 1 }}>
      <span className="n">{c.n}</span>
      <span className="t"><b>{c.s} <span style={{ fontWeight: 500, color: T.ink3, fontSize: 12 }}>· run #{RUNS[c.r].n}</span></b><code>{c.m}</code></span>
    </div>)}
    {seg.sum && <div className="mk-rule" style={{ animation: 'mk-up .4s ease both' }}>Formula: <b>qizil qadam → kod → logdagi birinchi error satri</b>. Kod — yo'nalish, sabab — log.</div>}
  </div>} />;
}

// ============================================================
//  9 · O'rnatish qadami qizil: npm ci (cicd2-out/23, 11, 26)
// ============================================================
const LOG_CI_SYNC = lg(String.raw`
npm error code EUSAGE
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm error Missing: @nestjs/jwt@11.0.2 from lock file
npm error Missing: @types/jsonwebtoken@9.0.10 from lock file
npm error Missing: bcrypt@6.0.0 from lock file
npm error …
##[error]Process completed with exit code 1.`.replace(/\\`/g, '`'));
const LOG_CI_NOLOCK = lg(String.raw`
npm error code EUSAGE
npm error The \`npm ci\` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
npm error later to generate a package-lock.json file, then try again.
##[error]Process completed with exit code 1.`.replace(/\\`/g, '`'));
const LOG_INSTALL_OK = lg(String.raw`
added 759 packages, and audited 760 packages in 33s`);
const S9 = mkS(9, [{ v: 'sync', open: null }, { v: 'sync', open: 3 }, { v: 'nolock' }, { v: 'fix', sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'sync' && <RunView k="23" open={seg.open} lines={LOG_CI_SYNC} hlStep={3} />}
    {seg.v === 'nolock' && <><div className="mk-tag" style={{ margin: 0 }}>«Repongiz yo'qmi?» namunasi — package-lock.json yo'q</div><RunView k="11" open={3} lines={LOG_CI_NOLOCK} hlStep={3} /></>}
    {seg.v === 'fix' && <RunView k="26" open={3} lines={LOG_INSTALL_OK} hlStep={3} />}
    {seg.sum && <div className="mk-rule">O'quvchi repolarida — <b>npm install</b>. <code>npm ci</code> uchun avval lock faylni yangilab push qilish kerak.</div>}
  </div>} />;
}
// ============================================================
//  10 · Checkout'siz va tartib xato (cicd2-out/13, 24, 26)
// ============================================================
const LOG_NOCO = lg(String.raw`
npm error code ENOENT
npm error syscall open
npm error path /home/runner/work/mentor-ci-sinov/mentor-ci-sinov/package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
##[error]Process completed with exit code 254.`);
const LOG_ORDER = lg(String.raw`
> IntroNestArxitechture@0.0.1 test
> jest
sh: 1: jest: not found
##[error]Process completed with exit code 127.`);
const S10 = mkS(10, [{ v: 'noco', open: 2 }, { v: 'noco', open: 2, path: true }, { v: 'order', open: 3 }, { v: 'fix', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'noco' && <RunView k="13" open={seg.open} lines={LOG_NOCO} hlStep={seg.open} />}
    {seg.path && <div className="pg-row hl" style={{ animation: 'mk-up .4s ease both' }}><span>/home/runner/work/mentor-ci-sinov/mentor-ci-sinov</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>ish papkasi · checkout'siz bo'sh</span></div>}
    {seg.v === 'order' && <RunView k="24" open={seg.open} lines={LOG_ORDER} hlStep={[3, 4, 5]} />}
    {seg.v === 'fix' && <div className="pg-two">
      <div className="j2-wide-only"><Ide files={CI_FILES} active={F.ci}><CodePanel file={F.ci} lines={YML_OK} /></Ide></div>
      <RunView k="26" hlStep={[1, 2, 3, 4, 5]} />
    </div>}
    {seg.sum && <div className="mk-rule">Tartib: <b>checkout → setup-node → npm install → npm test → build</b>.</div>}
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (11-satr = 10) · run 24
// ============================================================
const YML_ORDER = yml(String.raw`
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
      - run: npm test
      - run: npm install
      - run: npm run build`);
const LC11_FIXED = YML_ORDER.map((l, i) => ({ ...l, n: i + 1, ...(i === 10 ? { gone: true } : {}) }));
LC11_FIXED.splice(12, 0, { h: yamlLine('      - run: npm test'), n: 12, neu: true });
const LC11_EXTRA = lg(['Set up job', 'Run actions/checkout@v7', 'Run actions/setup-node@v7', 'Run npm install', 'Run npm test', 'Run npm run build'].map((n) => { const s = RUNS['26'].jobs[0].steps.find((x) => x[0] === n); return `✓ ${n}  ${s ? s[2] : ''}`; }).join('\n'));
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ci} lines={YML_ORDER} target={10}
    tree={{ root: MKCFG.root, files: CI_FILES, active: F.ci }}
    fixed={LC11_FIXED} fixedExtra={[{ file: `Actions · run #${RUNS['26'].n} (haqiqiy) — ✓ ${RUNS['26'].dur}`, lines: LC11_EXTRA.map((l) => ({ h: `<span class="ok">${escH(l.t)}</span>` })) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — tartibni buzish va kod
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: "Buzish — ci.yml: «- run: npm test» qatorini «- run: npm install» dan oldinga", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push', cmds: ['git commit -am "sinov: tartib"', 'git push'], exp: "Actions'da qizil" },
  { t: "O'qish — qizil Run npm test qadami va izoh", cmds: [], exp: 'jest: not found va kod' },
  { t: 'Tuzatish — tartibni tiklang · commit · push', cmds: ['git commit -am "tartib tiklandi"', 'git push'], exp: 'yashil' },
];
const P2_TROUBLE = [
  ['Run yashil qoldi', "o'zgarish push qilinmagan yoki npm test qatori hali ham npm install'dan keyin"],
  ["Kod 1, jest: not found emas", "testlar yiqildi — avvalgi buzish tuzatilmagan (Expected / Received ni o'qing)"],
  ['Run umuman boshlanmadi', "qator ko'chirilganda surilish buzilgan (13-ekran)"],
];
const P2_PROOF = { label: "3-qadamdagi chiqish kodi (izohdagi son)", placeholder: 'izohdagi sonni yozing', check: (v) => /^\s*127\s*$/.test(v), wrong: "Run sahifasidagi izoh: «Process completed with exit code …» — oxiridagi son" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  13 · Fayl xatosi: run darhol qizil (cicd2-out/30–32, 34, 05; tuzatish — 61)
// ============================================================
// GitHub izohlari — run #16–#19 sahifalari skrinshotlaridan (cicd2-out/30, 31, 32, 34-actions-sahifa-skrinshot.png); tahlilchi — cicd2-out/07
const YERR13 = [
  { k: '30', t: 'on: once', code: 'on: once', msg: "(Line: 2, Col: 5): Unexpected value 'once'", gh: "#L1 · (Line: 2, Col: 5): Unexpected value 'once'", same: true },
  { k: '31', t: "runs-on yo'q", code: '  test:\n    steps:', msg: '(Line: 5, Col: 5): Required property is missing: runs-on', gh: '#L1 · (Line: 5, Col: 5): Required property is missing: runs-on', same: true },
  { k: '32', t: 'surilish', code: '      - uses: actions/checkout@v7\n    - run: npm test', msg: 'A block sequence may not be used as an implicit map key at line 8', gh: '#L4 · You have an error in your yaml syntax on line 4' },
  { k: '34', t: "echo ichida «: »", code: '      - run: echo "Natija: ok"', msg: 'Nested mappings are not allowed in compact mappings at line 8', gh: '#L8 · You have an error in your yaml syntax on line 8' },
];
const YML_BLOCK = yml(String.raw`
      - run: |
          echo "Kalit: \${{ secrets.API_KEY }}"`.replace(/\\\$/g, '$'));
// run #18 (32) sahifasi — foydalanuvchi skrinshoti (cicd2-out/32-actions-sahifa-skrinshot.png): izoh aynan
const YML32 = yml(String.raw`
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
    - run: npm test`, { 4: { id: 'g' }, 8: { id: 'x' } });
const ANN32 = { t: 'Annotations · 1 error', m: 'Invalid workflow file: .github/workflows/ci.yml#L4 — You have an error in your yaml syntax on line 4' };
const S13 = mkS(13, [{ hl: [0, 1, 2] }, { hl: [0, 1, 2], run: '32' }, { hl: [2], run: '32', ann: true }, { hl: [3], run: '34' }, { hl: [], sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="c2-grid4">{YERR13.map((e, i) => <div key={i} className={`mk-box${seg.hl.includes(i) ? ' hl' : ''}`} style={{ '--c': T.accent, opacity: seg.hl.length && !seg.hl.includes(i) ? 0.35 : 1 }}>
      <h4>{e.t} <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11.5, color: T.ink3 }}>run #{RUNS[e.k].n} · ✗ {RUNS[e.k].dur}</span></h4>
      <pre style={{ margin: '6px 0', font: `12px/1.45 ${MONO}`, whiteSpace: 'pre-wrap' }}>{e.code}</pre>
      <p style={{ fontFamily: MONO, fontSize: 11, color: T.ink3 }}>tahlilchi: {e.msg}</p>
      <p style={{ fontFamily: MONO, fontSize: 11.5, color: T.accent, marginTop: 4 }}>GitHub: {e.gh}{e.same ? ' — aynan' : ''}</p>
    </div>)}</div>
    {seg.run && !seg.ann && <RunView k={seg.run} ann={null} />}
    {seg.run && !seg.ann && <div className="mk-tag" style={{ margin: 0 }}>{`Run #${RUNS[seg.run].n} sahifasida (skrinshot): «This workflow graph cannot be shown» · Total duration – · Annotations: Invalid workflow file`}</div>}
    {seg.ann && <div className="pg-two">
      <CodePanel file=".github/workflows/ci.yml (run #18)" lines={YML32} focus={['g', 'x']} />
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <RunView k="32" ann={ANN32} />
        <div className="pg-row"><span>GitHub izohi</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13 }}>4-qator · test:</span></div>
        <div className="pg-row hl"><span>Tahlilchi (at line 8, column 1)</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>8-qator · - run: npm test</span></div>
        <div className="mk-tag" style={{ margin: 0 }}>Izoh — run #18 sahifasining skrinshotidan (01.11 19:27) · #16, #17 da matn tahlilchi bilan aynan</div>
      </div>
    </div>}
    {seg.sum && <div className="pg-two">
      <CodePanel file="ci.yml — tuzatilgan (run: |)" lines={YML_BLOCK} />
      <RunView k="61" hlStep={1} />
    </div>}
    {seg.sum && <div className="mk-rule">Qadamsiz qizil run — <b>fayl xatosi</b>. Ikki nuqtali buyruq — <code>run: |</code> dan keyingi qatorda.</div>}
  </div>} />;
}

// ============================================================
//  14 · Run yo'q yoki cheksiz kutadi (cicd2-out/18, 33, 26)
// ============================================================
const OUT18 = jt(String.raw`
$ find .github -type f
.github/workflow/ci.yml
$ gh run list --commit 75260e4     # push'dan 90 s keyin
(soni: 0)`, { 2: { id: 'p' }, 4: { id: 'z' } });
// 33 — runlar-api.tsv: #20 «yaml: runs-on my-laptop», cancelled (qadamlar yo'q, shuning uchun RUNS da emas)
const RUNS33 = { n: 20 };
const WAIT33 = [['20 s', 'queued'], ['60 s', 'queued'], ['180 s', 'queued'], ['bekor qilindi', 'cancelled']];
const S14 = mkS(14, [{ v: 'none' }, { v: 'none', f: ['p', 'z'] }, { v: 'wait' }, { v: 'fix', sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'none' && <Term title="terminal · .github/workflow (s yo'q)" lines={OUT18} focus={seg.f || []} />}
    {seg.v === 'wait' && <div className="c2-mk" style={{ animation: 'mk-up .4s ease both' }}>
      <div className="mk-tag">runs-on: my-laptop · run #{RUNS33.n} · job test · labels=my-laptop</div>
      <div style={{ display: 'grid', gap: 6 }}>{WAIT33.map(([a, b], i) => <div key={i} className="pg-row"><span>{a}</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 14, color: b === 'queued' ? T.yellow : T.ink3 }}>{b === 'queued' ? '● queued — kutmoqda' : '○ cancelled'}</span></div>)}</div>
    </div>}
    {seg.v === 'fix' && <ActionsList rows={runRows(['26'], ['26'])} src={runSrc('26')} />}
    {seg.sum && <div className="pg-two">
      <div className="pg-row"><span>run yo'q</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13 }}>.github/workflows</span></div>
      <div className="pg-row"><span>sariq, kutmoqda</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13 }}>runs-on: ubuntu-latest</span></div>
    </div>}
  </div>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — sariq run
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: runs-on: my-laptop — 180 s dan keyin ham queued</div>
      <div className="pg-row"><span>runs-on: my-laptop</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>● queued</span></div>
      <div className="pg-row" style={{ borderColor: T.green }}><span>runs-on: ubuntu-latest</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.green }}>✓ run #{RUNS['26'].n}</span></div>
    </div>} />;
}

// ============================================================
//  16 · matrix (cicd2-out/40, 41)
// ============================================================
const YML_MX_BAD = yml(String.raw`
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
      - run: npm test`, { 3: { id: 'm' }, 4: { id: 'm' }, 5: { id: 'm' }, 9: { id: 's' } });
const YML_MX_OK = yml(String.raw`
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: \${{ matrix.node }}
      - run: npm test`.replace(/\\\$/g, '$'), { 10: { id: 's', neu: true }, 11: { id: 's', neu: true } });
const MX_V = { '40': { 'test (18)': 'v22.23.4', 'test (20)': 'v22.23.4', 'test (22)': 'v22.23.4' }, '41': { 'test (18)': 'v18.20.8', 'test (20)': 'v20.20.2', 'test (22)': 'v22.23.4' } };
function MatrixJobs({ k, ver }) {
  const jobs = [...RUNS[k].jobs].sort((a, b) => a.name.localeCompare(b.name));
  return <div className="c2-gh">
    <div className="bar"><span className="lg">GitHub</span><span className="tt">{RUNS[k].title}</span><span className="src">{runSrc(k)}</span></div>
    <div className="lst">{jobs.map((j) => <div key={j.name} className={`row ${j.st}`}><span className="dot">{GH_ST[j.st]}</span><span className="tl"><b>{j.name}</b><small>{j.dur}</small></span>
      {ver && <span className="tm"><b style={{ font: `700 14px ${MONO}`, color: MX_V[k][j.name] === 'v22.23.4' && k === '40' ? '#CF222E' : '#1A7F37' }}>node --version → {MX_V[k][j.name]}</b></span>}
    </div>)}</div>
  </div>;
}
const S16 = mkS(16, [{ k: '40', f: ['m'] }, { k: '40' }, { k: '40', ver: true, f: ['s'] }, { k: '41', ver: true, sum: true }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className={seg.sum ? 'j2-wide-only' : ''}><CodePanel file={seg.k === '41' ? 'ci.yml — ulangan' : "ci.yml — o'quvchi darsi (s13)"} lines={seg.k === '41' ? YML_MX_OK : YML_MX_BAD} focus={seg.f || []} /></div>
      {seg.f && seg.f[0] === 'm' && !seg.ver ? <div className="mk-tag" style={{ margin: 0 }}>Push qilinadi →</div> : <MatrixJobs k={seg.k} ver={seg.ver} />}
    </div>
    {seg.sum && <div className="mk-rule">Matrix ishlashi uchun — <code>node-version: {'${{ matrix.node }}'}</code>. Tekshiruv — <b>logdagi versiya</b>, yashil belgi emas.</div>}
  </div>} />;
}

// ============================================================
//  17 · cache (cicd2-out/50–53)
// ============================================================
const YML_CACHE_BAD = yml(String.raw`
      - uses: actions/cache@v4
        with:
          path: node_modules`, { 1: { id: 'c' }, 2: { id: 'c' }, 3: { id: 'c' } });
const YML_CACHE_OK = yml(String.raw`
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm`, { 4: { id: 'c', neu: true } });
const LOG_CACHE_BAD = lg(String.raw`
with:
  path: node_modules
##[error]Input required and not supplied: key`);
const MEASURE17 = [['51', "cache'siz", '44 s', '52 s', ''], ['52', 'cache: npm · 1-run', '45 s', '58 s', 'oxirida «Cache saved»'], ['53', 'cache: npm · 2-run', '16 s', '30 s', '«Cache restored» · ~57 MB']];
const S17 = mkS(17, [{ v: 'bad' }, { v: 'bad', open: 3 }, { v: 'ok', rows: 2 }, { v: 'ok', rows: 3, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'bad' && <div className="pg-two">
      <CodePanel file="ci.yml — o'quvchi darsi (s14)" lines={YML_CACHE_BAD} focus={['c']} />
      <RunView k="50" open={seg.open} lines={LOG_CACHE_BAD} hlStep={[3, 4, 5]} ann={seg.open != null ? annOf('50') : null} />
    </div>}
    {seg.v === 'ok' && <div className="pg-two">
      <CodePanel file="ci.yml — tavsiya" lines={YML_CACHE_OK} focus={['c']} />
      <div className="c2-mk">
        <div className="mk-tag">O'quvchi reposi · npm install (759 paket) · haqiqiy run'lar</div>
        <div style={{ display: 'grid', gap: 6 }}>{MEASURE17.slice(0, seg.rows).map(([k, a, b, c, d]) => <div key={k} className={`pg-row${k === '53' ? ' hl' : ''}`} style={{ animation: 'mk-up .4s ease both' }}>
          <span>#{RUNS[k].n} {a}</span><span style={{ color: T.ink3, fontSize: 11.5 }}>{d}</span><span className="v" style={{ fontSize: 14, color: k === '53' ? T.green : T.ink }}>{b} · job {c}</span>
        </div>)}</div>
      </div>
    </div>}
    {seg.sum && <div className="mk-rule">Kesh <b>ikkinchi run'dan</b> ishlaydi: o'rnatish 44 → 16 s (taxminan 2,8 baravar), «5 baravar» emas.</div>}
  </div>} />;
}

// ============================================================
//  18 · secrets (cicd2-out/60, 61)
// ============================================================
const LOG61 = {
  1: lg('Kalit: ***'),
  2: lg("env:\n  API_KEY: ***\nUzunligi: 25\nBo'lib yozilsa: sk_test _mentor_sinov_7f3a"),
  3: lg("Yo'q secret: []"),
};
const S18 = mkS(18, [{ open: null }, { open: 1 }, { open: 2, also: 3 }, { open: null, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.open == null && !seg.sum && <div className="c2-mk">
      <div className="mk-tag">Repoga secret qo'yildi (sinov qiymati, 25 belgi)</div>
      <Term lines={jt('$ gh secret set API_KEY -R kirishnomi4-wq/mentor-ci-sinov\n$ gh secret list\nAPI_KEY   2026-11-01T13:40:56Z')} />
      <div className="mk-tag" style={{ margin: '8px 0 0' }}>Repo sahifasida: Settings → Secrets and variables → Actions (⚠ GitHub hujjatidan)</div>
    </div>}
    {seg.open != null && <RunView k="61" open={seg.open} lines={LOG61[seg.open]} hlStep={seg.also ? [seg.open, seg.also] : seg.open} />}
    {seg.also && <div className="n2-warn" style={{ animation: 'mk-up .4s ease both' }}>Bo'laklab chiqarilgan kalit — <b>logda to'liq ochiq</b>. Yozilmagan secret — bo'sh qator: <code>{"Yo'q secret: []"}</code>, run yashil.</div>}
    {seg.sum && <RunView k="61" />}
    {seg.sum && <div className="mk-rule">Secret'ni <b>logga umuman chiqarmang</b>: <code>***</code> faqat aynan qiymatni yashiradi.</div>}
  </div>} />;
}

// ============================================================
//  19 · Amaliyot 3 — matrix'ni ulash (cicd2-out/41)
// ============================================================
const YML_P3 = yml(String.raw`
jobs:
  test:
    strategy:
      matrix:
        node: [20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: \${{ matrix.node }}
      - run: node --version
      - run: npm install
      - run: npm test`.replace(/\\\$/g, '$'));
const P3 = mkS(19, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'matrix — job ichida strategy: matrix: node: [20, 22]', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Ulash — setup-node: node-version: ${{ matrix.node }}', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Push — setup-node dan keyin - run: node --version', cmds: ['git commit -am "ci: matrix"', 'git push'], exp: 'ikki job: test (20), test (22)' },
  { t: 'Log — test (20) → Run node --version', cmds: [], exp: 'v20.…' },
];
const P3_CODE = [{ file: F.ci, step: 0, lines: YML_P3, copy: false }];
const P3_TROUBLE = [
  ["Ikkala job'da ham v22…", "node-version qatori yo'q yoki matrix.node yozilmagan (16-ekran)"],
  ["Job bitta, nomida son yo'q", "strategy job ichida emas — surilishni tekshiring"],
  ['Run qadamsiz qizil', 'fayl xatosi, surilish (13-ekran)'],
];
const P3_PROOF = { label: "test (20) job'idagi node --version natijasi", placeholder: 'versiyani yozing', check: (v) => /^\s*v20\.\d+\.\d+\s*$/.test(v), wrong: "test (20) job'ini oching, Run node --version qadamidagi v bilan boshlanadigan satr" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={CI_FILES} />; }
// ============================================================
//  20 · Tekshiruv 4 — key'siz cache (cicd2-out/50, 53)
// ============================================================
function Screen20(p) {
  const m = MDT[20];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file="ci.yml — o'quvchi darsi (s14)" lines={YML_CACHE_BAD} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: run #{RUNS['50'].n} qizil · to'g'risi — setup-node cache: npm (run #{RUNS['53'].n}: npm install 16 s)</div>
      <RunView k="50" open={3} lines={LOG_CACHE_BAD} hlStep={3} />
    </div>} />;
}

// ============================================================
//  21 · m4c-03 xaritasi (GithubActionsLesson.jsx — SCREEN_META 23)
// ============================================================
const MAP21 = [
  { t: 'Kirish', s: 's0–s1', d: 'chamadon lentada, skaner yurmadi · reja', m: "Actions oynasi, run ro'yxati (2-ekran)" },
  { t: 'Joylashuv va YAML', s: 's2–s7', d: "Actions nima · .github/workflows/ci.yml · YAML bo'sh joy · workflow → job → step · 2 test", m: "workflows — s harfisiz run yo'q (14) · qadamsiz qizil — fayl xatosi (13)" },
  { t: 'on, runs-on, amallar', s: 's8–s12', d: "on: · runs-on · test · uses / run · tartib (@v4)", m: 'my-laptop — cheksiz kutadi (14) · uses logi (4) · tartib xato — kod 127 (10)' },
  { t: "Qo'shimchalar", s: 's13–s16', d: 'matrix · cache · test · secrets', m: 'matrix ulanmagan (16) · cache key\'siz qizil (17) · secret bo\'laklab ochiq (18)' },
  { t: 'Markaziy va yakun', s: 's17–s19', d: "yo'l xaritasini yozish · yakuniy (1 urinish) · amaliyot · kartochkalar · uyga vazifa", m: 'simulyatsiya va haqiqat (22-ekran)' },
];
const S21 = mkS(21, [{ hl: [] }, { hl: [2], v4: true }, { hl: [3] }, { hl: [4], sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP21.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{(seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.v4 && <div className="n2-warn" style={{ animation: 'mk-up .4s ease both' }}>Run #{RUNS['25'].n} (@v4): yashil, lekin izohda — <b>«Node.js 20 is deprecated … forced to run on Node.js 24»</b>. Tavsiya — v7.</div>}
    {seg.sum && <div className="mk-rule">O'quvchi darsi — simulyatsiya, Actions — haqiqat: har o'quvchi faylini <b>push qilsin</b> va run'ni siz bilan birga o'qisin.</div>}
  </div>} />;
}

// ============================================================
//  22 · Simulyatsiya va haqiqiy Actions (cicd2-out/16, 17, 14, 12, 20)
// ============================================================
const LOG16 = lg("/home/runner/work/_temp/da38ae49….sh: line 1: syntax error near unexpected token `'test''\n##[error]Process completed with exit code 2.");
const LOG17 = lg("remote: Write access to repository not granted.\nfatal: unable to access 'https://github.com/kirishnomi4-wq/mentor-ci-sinov/': The requested URL returned error: 403\n##[error]Process completed with exit code 128.");
const SIM22 = [
  { s: "s17: run: print('test')", g: 'syntax error, kod 2 — qizil', k: '16', c: 'bad' },
  { s: 's17: run: git push', g: '403, kod 128 — qizil (token: Contents: read)', k: '17', c: 'bad' },
  { s: "s18: test qadami yo'q — «qizil chiroq»", g: 'run yashil — testsiz lenta hech narsani tekshirmaydi', k: '14', c: 'ok' },
  { s: "«Repongiz yo'qmi?»: echo ok && exit 0", g: "test doim yashil; qizil uchun echo xato && exit 1", k: '12', c: 'ink' },
];
const S22 = mkS(22, [{ hl: [0, 1], run: '16', open: 4, lines: LOG16 }, { hl: [1], run: '17', open: 4, lines: LOG17, perm: true }, { hl: [2, 3], run: '14' }, { hl: [], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div style={{ display: 'grid', gap: 10 }}>
    {SIM22.map((x, i) => <div key={i} className={`pg-row${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.4 : 1 }}>
      <span style={{ minWidth: 0, flex: '1 1 45%' }}>{x.s}</span><span style={{ color: T.ink3 }}>→</span>
      <span style={{ flex: '1 1 45%', color: x.c === 'ok' ? T.green : x.c === 'bad' ? T.accent : T.ink, fontWeight: 700 }}>{x.g} <span style={{ color: T.ink3, fontWeight: 500 }}>· #{RUNS[x.k].n}</span></span>
    </div>)}
    {seg.run && <RunView k={seg.run} open={seg.open} lines={seg.lines || []} hlStep={seg.open} />}
    {seg.perm && <div className="pg-row" style={{ animation: 'mk-up .4s ease both' }}><span>Set up job → GITHUB_TOKEN Permissions</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>Contents: read</span></div>}
    {seg.sum && <div className="mk-rule">Yashil belgi — faqat <b>yozilgan qadamlar o'tdi</b> degani. Lentada <code>npm test</code> albatta bo'lsin.</div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const TIL23 = [['yo\'l xaritasi', '.github/workflows/ci.yml'], ['nuqta · amal', 'job · qadam (step)'], ['lenta mashinasi', 'runs-on · Set up job logi'], ['START SIGNALI', "on: push — run qatorida «push»"], ['YASHIL / QIZIL CHIROQ', 'run belgisi ✓ / ✗'], ['PARALLEL LENTALAR · YAQIN JAVON · SEYF', 'matrix · cache · secrets']];
const STUMBLE23 = [
  ["Run yo'q", "Actions bo'sh", '.github/workflows nomi'],
  ['Sariq, kutmoqda', 'queued', 'runs-on: ubuntu-latest'],
  ['Qadamsiz qizil', "job yo'q", "fayl xatosi — surilish, «: »"],
  ['Kod 127', 'jest: not found', 'npm install oldinroq'],
  ['Kod 254', 'Could not read package.json', 'actions/checkout'],
  ['Kod 1, npm ci', "in sync / lock yo'q", 'npm install'],
];
const QA23 = [
  ['«Run qancha vaqt oladi?»', "o'quvchi reposida taxminan 45 s – 1 daq 10 s; eng uzuni — o'rnatish (run #1–#7)."],
  ['«Nega lenta git push qilolmaydi?»', "token faqat o'qishga ruxsat oladi — Set up job logida Contents: read."],
  ['«Ubuntu versiyasi nega boshqacha?»', "ubuntu-latest Ubuntu 26 ga o'tkazilmoqda — GitHub har run'da eslatadi."],
  ["«Secret'ni ko'rsam bo'ladimi?»", "logda yo'q; qiymatni faqat qo'ygan odam biladi. Logga chiqarmang — bo'laklab chiqarilsa ochiq ko'rinadi."],
];
const S23 = mkS(23, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen23(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z (m4c-03) → Actions oynasida</div>
      <div style={{ display: 'grid', gap: 6 }}>{TIL23.map(([a, b], i) => <div key={i} className="pg-row" style={{ animation: `mk-up .4s ${i * 0.06}s ease both` }}><span style={{ fontFamily: SANS, fontWeight: 700 }}>{a}</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, fontWeight: 600 }}>{b}</span></div>)}</div>
    </div> : <div className="mk-qa">
      {STUMBLE23.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>o'quvchi bilan birga o'qing</b>: qaysi qadam qizil, qaysi kod, logdagi birinchi error satri.</div>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: Actions oynasi, qizil run, fayl xatolari va o'quvchi darsidagi namunalar. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4c-03 dagi yo'l xaritasi va sinfdagi qizil run'lar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
  { k: 'run', t: "Actions: har push — run; run ichida job, job ichida qadam; Set up job, Post, Complete job — GitHub'niki", st: ['push', 'run'] },
  { k: 'uses', t: "uses logi: checkout — faqat oxirgi commit; setup-node — mashinadagi Node; token — Contents: read", st: ['run'] },
  { k: 'qizil', t: "Qizil run: qizil qadam → kod (1, 127, 254) → logdagi birinchi error satri", st: ['run', 'log'] },
  { k: 'fayl', t: "Fayl xatosi — qadamsiz qizil; papka xato — run yo'q; runs-on xato — cheksiz kutadi", st: ['yml', 'run'] },
  { k: 'nam', t: "O'quvchi namunalari: matrix'ni node-version'ga ulang; cache — setup-node cache: npm; secret'ni logga chiqarmang", st: ['yml', 'log'] },
  { k: 'yashil', t: "Testsiz lenta yashil — yashil belgi faqat yozilgan qadamlarni kafolatlaydi", st: ['log'] },
];
const STATIONS25 = [['push', 'git push', T.ink], ['yml', 'ci.yml', T.green], ['run', 'run · job · qadam', T.blue], ['log', 'log va kod', T.accent]];
function SummaryMap25({ hl }) {
  const cur = SUM25.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — push'dan logga</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS25.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK25 = [
  { t: 'matrix: node [20, 22] + node-version: ${{ matrix.node }} (19-ekran)', c: [] },
  { t: "cache: setup-node → cache: npm (17-ekran); 2-run'da «Cache restored»", c: [] },
  { t: 'Qizil: tartib yoki test ataylab buziladi → push → qizil, kod', c: ['git commit -am "sinov: buzildi"', 'git push'] },
  { t: 'Tuzatish: push → yana yashil', c: ['git commit -am "tuzatildi"', 'git push'] },
  { t: "Repo linkini platformadagi uyga vazifangizga qo'ying", c: [] },
];
const CHEATSHEET25 = `# CI/CD-2 — mentor eslatmasi (GitHub Actions: run, log, namunalar)
## Actions oynasi
har push = run (nomi — commit xabari; CI #N · push · tarmoq) · run → job (jobs: test:) → qadam (Run …)
GitHub qo'shadi: Set up job (mashina, uses yuklab olish) · Post Run … (tozalash) · Complete job
Set up job: Ubuntu 24.04.5 LTS · GITHUB_TOKEN Contents: read (lenta git push qilolmaydi — 403) · ubuntu-latest Ubuntu 26 ga o'tkazilmoqda
checkout: papkani tozalaydi, fetch-depth: 1 (faqat oxirgi commit) · setup-node: Found in cache, node v22.23.4, npm 10.9.9
## Qizil run (sabab — qizil qadam logida, izohda faqat kod)
1 — test FAIL (Expected/Received) yoki npm ci (in sync / lock yo'q) · 127 — jest: not found (test install'dan oldin)
254 — Could not read package.json (checkout yo'q) · 2 — bash syntax error (print('test')) · 128 — git (403)
tartib: checkout → setup-node → npm install → npm test → npm run build
## Fayl xatolari
on: once · runs-on yo'q · surilish · run: echo "Natija: ok" → run darhol qizil, job/qadam/log yo'q (tahlilchida tekshiring; ikki nuqtali buyruq — run: | blokida)
.github/workflow (s yo'q) → run umuman yo'q · runs-on: my-laptop → queued, cheksiz kutadi (bekor qiling)
## O'quvchi darsidagi namunalar (m4c-03) — haqiqiy run'da
matrix node [18, 20, 22] node-version'siz → uch job, uchalasi Node 22 · ulangan: node-version: \${{ matrix.node }} → 18.20.8 / 20.20.2 / 22.23.4
actions/cache@v4 key'siz → qizil: Input required and not supplied: key · setup-node cache: npm → npm install 44 → 45 → 16 s (2-run'dan)
secrets: *** — faqat aynan qiymat; bo'laklab chiqarilsa ochiq; yo'q secret — bo'sh qator, run yashil
s17 print('test') / git push → qizil · s18 testsiz lenta → yashil · @v4 — ishlaydi, «Node.js 20 is deprecated»
## Sizning uyga vazifangiz
matrix [20, 22] ulangan · setup-node cache: npm · bitta qizil (tartib yoki test) va tuzatish → repo linki platformadagi uyga vazifaga`.replace(/\\\$/g, '$');
const s25Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Har push — <b>run</b>; ichida job va qadamlar, uchtasi GitHub'niki", "Birinchi: har push bitta run. Run ichida job, job ichida qadam. Set up job, Post va Complete job qadamlarini GitHub o'zi qo'shadi.", { hl: 'run' }),
  sg('b2', "uses logi: checkout, setup-node va <b>token ruxsati</b>", "Ikkinchi: uses qadamining logi nima qilganini aytadi. Checkout faqat oxirgi commit'ni oladi, setup node mashinadagi Node'ni beradi, token faqat o'qishga ruxsat oladi.", { hl: 'uses' }),
  sg('b3', "Qizil run: qizil qadam, <b>kod</b>, logdagi birinchi error", "Uchinchi: qizil run'da avval qizil qadam, keyin kod: bir, yuz yigirma yetti yoki ikki yuz ellik to'rt. Sababni logdagi birinchi error satri aytadi.", { hl: 'qizil' }),
  sg('b4', "Fayl xatosi — <b>qadamsiz qizil</b>; papka va runs-on — boshqa belgi", "To'rtinchi: fayl xatosida run qadamsiz qizil. Papka nomi xato bo'lsa run umuman yo'q, runs on xato bo'lsa cheksiz kutadi.", { hl: 'fayl' }),
  sg('b5', "O'quvchi namunalari: <b>matrix, cache, secrets</b> — to'g'risi bilan", "Beshinchi: o'quvchi darsidagi matrix'ni node version'ga ulang, cache uchun setup node'dagi cache npm yozing, secret'ni logga chiqarmang.", { hl: 'nam' }),
  sg('b6', "Testsiz lenta yashil — <b>yashil belgi</b> faqat yozilganini kafolatlaydi", "Oltinchi: test qadami yo'q lenta yashil. Yashil belgi faqat yozilgan qadamlar o'tdi degani, shuning uchun npm test albatta bo'lsin.", { hl: 'yashil' }),
  sg('hw', "<b>Uyga vazifa</b>: matrix, cache va bitta qizil run — tuzatish bilan", "Uyga vazifa: lentali reposingizda matrix bilan Node yigirma va yigirma ikki, setup node'da cache npm. Bir marta tartibni yoki testni ataylab buzib qizil qiling va tuzating.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. O'ttiz-qirq besh daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: Actions oynasi, kodlar, fayl xatolari va namunalar — bir sahifada", "Pastda bir sahifalik eslatma: Actions oynasi, chiqish kodlari, fayl xatolari va o'quvchi darsidagi namunalarning haqiqiy natijasi. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET25;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'cicd-2-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> Actions tarixida ikki job'li yashil run · test (20) logida v20 · bitta qizil va undan keyingi yashil.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Telegraf + PostgreSQL</div><div style={{ fontSize: 13.5, color: T.ink2 }}>bot eslab qoladi: holat bazada</div></div>
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
        {["Jami taxminan 1 soat: ovoz ~25 daqiqa · uch amaliyot ~35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: «CI/CD nima va nega» mentor darsi o'tilgan · lentali GitHub reposingiz (.github/workflows/ci.yml) · VS Code", "Haqiqiy: har Actions oynasi — o'quvchi reposi nusxasidagi 28 ta GitHub Actions tajribasidan (01.11.2026)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, ScreenP1, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenP2, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, ScreenP3, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function GithubActionsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
