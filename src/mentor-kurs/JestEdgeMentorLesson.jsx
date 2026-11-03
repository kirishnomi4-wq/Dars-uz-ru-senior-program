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
//  JEST-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-matn.py (manba: 12-Jest2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "Test to'g'ri kirishni sinadi. Noto'g'ri kirish-chi?",
  "seg": [
   [
    "a",
    "Jest-1 da to'g'ri kirishni sinadingiz — bugun <b>noto'g'ri kirishni sinaymiz</b>",
    "Assalomu alaykum. Jest birinchi darsida orderTotal'ni oddiy kirish bilan sinadingiz: o'n ming va ikki. Lekin haqiqiy do'konda mijoz nol yozadi, minus yozadi, raqam o'rniga so'z yozadi. Bugun aynan shu noto'g'ri kirishni sinaymiz."
   ],
   [
    "b",
    "Himoyasiz funksiya xato bermaydi, balki <b>noto'g'ri natija qaytaradi</b>",
    "Avval ko'ramiz: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri natija qaytaradi. Keyin funksiyaga himoya qo'yamiz va bu himoyani test bilan tekshiramiz."
   ],
   [
    "c",
    "Xato tashlaydigan funksiyani sinash yo'li boshqacha — uni <b>ataylab buzamiz</b>",
    "Xato tashlaydigan funksiyani sinash yo'li boshqacha, va o'quvchilar aynan shu yerda adashadi. Uni uch xil buzamiz. Keyin TypeScript tuzog'ini va o'quvchining uyga vazifasini ko'ramiz."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, to'rtta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · edge",
  "title": "Oddiy yo'l — 2 kitob. Chegaradagi qiymatlar — 0, manfiy, 1",
  "seg": [
   [
    "a",
    "<b>Happy path</b> — hamma narsa rejadagidek: mijoz to'g'ri ma'lumot kiritadi",
    "Ikki so'zdan boshlaymiz. Birinchisi happy path, ya'ni oddiy yo'l: hamma narsa rejadagidek, mijoz ikki kitob oladi. Jest birinchi darsida aynan shuni sinadingiz."
   ],
   [
    "b",
    "<b>Edge case</b> — chegaradagi qiymat: 0, manfiy va eng kichik haqiqiy qiymat 1",
    "Ikkinchisi edge case, ya'ni chegara holati: oddiy qiymatlarning chetida turgan qiymatlar. Masalan nol dona, minus bir dona va eng kichik haqiqiy buyurtma, ya'ni bir dona. Xatolar ko'pincha aynan shu chetlarda yashiringan."
   ],
   [
    "c",
    "<b>Noto'g'ri tur</b> ham edge case: raqam o'rniga so'z yoki bo'sh qiymat",
    "Chegara holatining yana bir turi noto'g'ri ma'lumot: raqam o'rniga ikki degan so'z yoki umuman bo'sh qiymat, ya'ni null. Formada xato bo'lsa, server aynan shunday ma'lumot olishi mumkin."
   ],
   [
    "d",
    "Xulosa: har funksiya uchun — bitta oddiy holat va <b>bir nechta chegara holati</b>",
    "Xulosa: har funksiya uchun bitta oddiy holat va bir nechta chegara holati. O'quvchi darsi shunday deydi: chegara nol bilan bir orasida. Endi himoyasiz funksiya bu holatlarda nima qilishini ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · edge",
  "title": "Himoyasiz price * quantity: xato yo'q — natija noto'g'ri",
  "seg": [
   [
    "a",
    "Nol dona — 0 so'm: <b>bepul buyurtma</b>, xato yo'q",
    "Himoyasiz funksiyani chaqiramiz. Nol dona bersak, natija nol so'm bo'ladi: bepul buyurtma, va hech qanday xato yo'q. Funksiya o'z ishini qildi: o'n ming ko'paytirish nol."
   ],
   [
    "b",
    "Minus bir — minus o'n ming: <b>do'kon mijozga pul to'laydimi?</b>",
    "Minus bir dona bersak, natija minus o'n ming: ya'ni do'kon mijozga pul to'lashi kerak. Yana xato yo'q. Bir dona esa to'g'ri hisoblanadi, o'n ming. Demak, chegara nol bilan bir orasida."
   ],
   [
    "c",
    "So'z — NaN, null — 0: eng xavflisi, chunki <b>hech kim sezmaydi</b>",
    "Ikki degan so'z bersak, natija NaN, ya'ni not a number, son emas. Null esa nolga aylanadi: yana bepul buyurtma. O'quvchi darsi bu haqda «hech kim sezmaydi» deydi. Eng xavflisi shu: dastur ishlayveradi, xato hech qayerda chiqmaydi."
   ],
   [
    "d",
    "Xulosa: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki <b>noto'g'ri ishlaydi</b>",
    "Xulosa: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri ishlaydi. To'g'ri yo'l: noto'g'ri kirishni darhol rad etish, ya'ni xato tashlash. Buni ikkinchi bosqichda qilamiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Himoyasiz orderTotal(10000, -1) nima qaytaradi?",
  "q": "Yashirin buzilishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Funksiyada hech qanday himoya yo'q, faqat narx ko'paytirish soni. Unga minus bir dona berildi. Nima qaytadi? Variantni tanlang.",
  "ok": "To'g'ri, minus o'n ming. Funksiya shunchaki ko'paytiradi, manfiy son uni to'xtatmaydi. Xato yo'q, natija esa noto'g'ri: do'kon mijozga pul to'laydigan bo'ldi. Demak, himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri hisoblaydi, shuning uchun himoya kerak.",
  "okShort": "−10000 — xato yo'q, lekin natija noto'g'ri. Himoya (guard) kerak.",
  "hint": "Funksiya faqat ko'paytiradi: 10000 × (−1) = ?",
  "correct": 1,
  "opts": [
   "Error — manfiy son taqiqlangan",
   "−10000 — xato yo'q, lekin natija noto'g'ri",
   "0",
   "NaN"
  ],
  "wrong": {
   "0": "Xato tashlash uchun funksiyada throw bo'lishi kerak — himoyasiz funksiyada yo'q.",
   "2": "0 ni 0 dona beradi; −1 da natija manfiy.",
   "3": "NaN — son bo'lmagan kirishda ('ikki'); −1 esa son."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · guard",
  "title": "toThrow() kutdi — Received function did not throw",
  "seg": [
   [
    "a",
    "<b>Test avval yoziladi</b>: «0 dona — xato bo'lishi kerak», funksiya hali himoyasiz",
    "Avval test yozamiz: nol dona va minus bir dona xato bo'lishi kerak. Funksiya hali himoyasiz. Expect ichida yangi narsa bor: to throw, ya'ni xato tashlashi kerak. Uning yozilishini sakkizinchi ekranda batafsil ko'ramiz."
   ],
   [
    "b",
    "Natija: <b>ikki edge testi qizil</b>, happy path yashil",
    "npm test qilamiz: oddiy holat yashil, ikki chegara holati qizil. Fayl bitta bo'lgani uchun test nomlari ko'rinadi: belgi bilan o'tganlari, iks bilan yiqilganlari."
   ],
   [
    "c",
    "<code>Received function did not throw</code> — <b>funksiya xato tashlamadi</b>",
    "Xabarni o'qiymiz: received function did not throw. Bu funksiya xato tashlamadi degani, test esa buni kutgan edi. Bu FAIL'da expected va received raqami yo'q, chunki solishtirilgan narsa xato bo'ldi."
   ],
   [
    "d",
    "Xulosa: <code>did not throw</code> — funksiyada <b>himoya yo'q yoki shart noto'g'ri</b>",
    "Xulosa: did not throw ko'rsangiz, sabab ikkitadan biri. Yo funksiyada himoya umuman yo'q, yo shart bu qiymatni o'tkazib yubordi. Ikkinchisini o'ninchi ekranda ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · guard",
  "title": "Funksiya boshida shart: noto'g'ri bo'lsa — xato, to'g'ri bo'lsa — hisob",
  "seg": [
   [
    "a",
    "Guard — funksiya boshidagi himoya: <b>avval shart, keyin xato, keyin hisob</b>",
    "Did not throw, chunki himoya yo'q. Endi uni qo'yamiz. Himoya, inglizchasi guard, funksiyaning boshida turadi. Uning tartibi uch qadamdan iborat: avval shart, keyin xato tashlash, keyin oddiy hisob. O'quvchi darsida bu tartibni bloklardan yig'adi."
   ],
   [
    "b",
    "Shart <b>uchta tekshiruv</b>: son emasmi, NaN'mi, nol yoki manfiymi",
    "Shartda uchta tekshiruv bor: quantity son emasmi, NaN emasmi va nol yoki undan kichikmi. Biri to'g'ri bo'lsa, funksiya to'xtaydi. Matn ham, minus ham, nol ham shu yerda ushlanadi."
   ],
   [
    "c",
    "<code>throw new Error('…')</code> — <b>funksiyani to'xtatadi</b>, xabar sababni aytadi",
    "Throw new error funksiyani shu joyda to'xtatadi, return'gacha bormaydi. Xabarni tushunarli yozing, masalan: quantity musbat raqam bo'lsin. Keyin testda aynan shu xabarni tekshirish mumkin."
   ],
   [
    "d",
    "Natija: <b>beshala test yashil</b> — happy, 1 dona, 0, manfiy va matn",
    "npm test qilamiz: beshala test yashil. Ikki dona va bir dona hisoblanadi, nol, minus va matn esa xato beradi. Bir dona testi muhim: himoya to'g'ri buyurtmani to'sib qo'ymaganini ko'rsatadi."
   ],
   [
    "e",
    "Xulosa: guard qo'yilgach — xato holatlari ham, <b>eng kichik to'g'ri holat ham</b> sinaladi",
    "Xulosa: guard qo'yilgach ikki tomon sinaladi. Noto'g'ri kirish xato beradi, eng kichik to'g'ri kirish hisoblanadi. Faqat birini sinasangiz, himoya juda qattiq yoki juda yumshoq bo'lib qolganini bilmaysiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "Avval qizil edge testlari, keyin guard va yashil",
  "seg": [
   [
    "a",
    "Endi siz: avval edge testlarini yozasiz va <b>qizilni ko'rasiz</b>, keyin himoya qo'yasiz",
    "Endi navbat sizga. Jest birinchi darsidagi order fayllarini oching. Avval edge testlarini yozasiz va qizilni ko'rasiz, keyin himoya qo'yasiz. Bunga o'n-o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: 0 va manfiy uchun <code>toThrow</code> testlari — <b><code>did not throw</code></b>",
    "Birinchi qadamda nol va minus bir uchun ikkita test yozasiz: expect ichida o'ralgan funksiya va to throw. Ikkinchisida npm test qilib, did not throw xabarini o'qiysiz."
   ],
   [
    "c",
    "3–4-qadam: guard va 1 dona testi; isbot — <b><code>Tests:</code> satri</b>",
    "Uchinchi qadamda funksiya boshiga himoya qo'yasiz. To'rtinchisida bir dona va matn testlarini qo'shib, npm test qilasiz. Isbot maydoniga Tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz test avval qizil, himoyadan keyin yashil bo'lishini o'z kodingizda ko'rdingiz."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "expect(orderTotal(10000, 0)).toThrow() — test xatoning o'zi bilan qulaydi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi savol: qaysi yozuv to'g'ri — <b>o'ralganmi yoki o'ralmaganmi?</b>",
    "O'quvchi darsida savol bor: qaysi yozuv to'g'ri? Expect ichida funksiyani to'g'ridan-to'g'ri chaqirishmi yoki strelkali funksiya ichiga o'rashmi? Sinab ko'ramiz: o'rashni olib tashlaymiz."
   ],
   [
    "b",
    "O'ralmagan: funksiya expect'dan oldin ishlaydi va <b>xato testni qulatadi</b>",
    "O'ralmagan holatda funksiya expect'ga yetmasdan ishlaydi va xato tashlaydi. Expect uni tutishga ulgurmaydi. Natijada test qizil, lekin xabarda expected va received yo'q, funksiyaning o'z xatosi turibdi: quantity musbat raqam bo'lsin."
   ],
   [
    "c",
    "Belgi: FAIL xabarida <code>at orderTotal (order.ts:…)</code> — xato <b>funksiya ichidan uchdi</b>",
    "Qanday tanib olasiz: FAIL xabarida expect so'zi yo'q, o'rniga sizning xato xabaringiz va at orderTotal, order ts, uchinchi satr. Ya'ni xato test ichida tutilmadi, funksiyadan to'g'ridan-to'g'ri uchib chiqdi."
   ],
   [
    "d",
    "Xulosa: xato kutilsa — funksiya <b><code>() =&gt;</code> ichida</b>; aks holda test o'zi qulaydi",
    "Xulosa: xato kutilayotgan bo'lsa, funksiya doim strelka ichiga o'raladi. Shunda Jest uni o'zi chaqiradi va xatoni tutadi. O'quvchi darsida bu o'rab berish deyiladi."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "Expected substring va Received message — xato bor, lekin boshqa xato",
  "seg": [
   [
    "a",
    "<code>toThrow()</code> faqat «xato bo'ldimi» deydi — <code>toThrow('matn')</code> <b>qaysi xato ekanini</b> tekshiradi",
    "O'rash bilan xato tutildi. Endi qaysi xato tutilganini tekshiramiz. Bo'sh to throw faqat xato bo'ldimi, shuni tekshiradi. Qavs ichiga matn yozilsa, xabar shu matnni o'z ichiga olishi kerak. Bu muhim: funksiya boshqa sabab bilan yiqilsa ham bo'sh to throw yashil bo'lardi."
   ],
   [
    "b",
    "Xabar mos emas: <code>Expected substring</code> — kutilgani, <b><code>Received message</code></b> — kelgani",
    "Testda narx xato deb yozdik, funksiya esa quantity musbat raqam bo'lsin deydi. Natija qizil: expected substring, ya'ni kutilgan bo'lak, va received message, ya'ni kelgan xabar. Bu Jest birinchi darsidagi expected va received'ning xato uchun ko'rinishi."
   ],
   [
    "c",
    "Xulosa: xabarni tekshiring — u xato <b>qaysi shartdan kelganini</b> aytadi",
    "Xulosa: xato kutilgan joyda xabarni ham tekshiring. Bir funksiyada bir nechta himoya bo'lsa, xabar qaysi biri ishlaganini aytadi. Sinfda buni o'quvchiga ko'rsating: xabar aniq yozilsa, test ham aniq bo'ladi."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "Shartsiz throw — oddiy holat ham qizil; < 0 — nol o'tib ketadi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi tuzoq: <code>throw</code> bor, lekin <b><code>if</code> yo'q</b> — har chaqiriq xato beradi",
    "O'quvchi darsida bloklarni yig'ishda tuzoq bor: throw qo'yilgan, lekin shart yo'q. Sinab ko'rdik: endi funksiya har chaqiriqda xato beradi."
   ],
   [
    "b",
    "Natija: xato testlari yashil, lekin <b>happy va 1 dona — qizil</b>",
    "Natija avvaliga g'alati ko'rinadi: xato kutgan testlar yashil, lekin ikki dona va bir dona qizil. Shuning uchun oddiy holat testi kerak: u himoya juda qattiq bo'lib qolganini ushlaydi."
   ],
   [
    "c",
    "<code>&lt;= 0</code> o'rniga <code>&lt; 0</code> — faqat <b>«0 dona» testi qizil</b>: <code>did not throw</code>",
    "Ikkinchi buzish yumshoqroq: kichik yoki teng o'rniga faqat kichik yozamiz. Minus ham, matn ham ushlanadi, lekin nol o'tib ketadi. Faqat nol dona testi qizil, xabari did not throw. Bu Jest birinchi darsidagi chegara xatosining aynan o'zi."
   ],
   [
    "d",
    "Xulosa: happy testi himoyaning <b>qattiqligini</b>, edge testi <b>yumshoqligini</b> ushlaydi",
    "Xulosa: ikki xil test ikki xil xatoni ushlaydi. Oddiy holat testi himoya juda qattiq bo'lsa qizil bo'ladi. Chegara testi esa himoyada teshik bo'lsa qizil bo'ladi. Ikkalasi ham kerak."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "0 dona — xato qizil: Received function did not throw",
  "q": "Buzishlarni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Nol dona testi qizil: did not throw. Qoida: nol dona ham noto'g'ri buyurtma. Nolni o'tkazib yuborgan satrni bosing.",
  "ok": "To'g'ri. Ikkinchi satrda faqat kichik yozilgan: nol noldan kichik emas, shuning uchun shart o'tkazib yuboradi. Kichik yoki teng bo'lsa, nol ham ushlanadi. Ekranda tuzatilgan holat, beshala test yashil. Demak, chegara shartida kichik yoki teng yoziladi, aks holda nol o'tib ketadi.",
  "okShort": "2-satr: <code>quantity &lt; 0</code> — 0 o'tadi. To'g'risi <code>quantity &lt;= 0</code>.",
  "hint": "Xato qaysi qiymatda: 0. Qaysi satr qiymatni tekshiradi va 0 uchun nima qaytaradi?",
  "task": "Qoida: 0 dona ham noto'g'ri buyurtma — guard uni ushlashi kerak. Bu funksiyada <code>orderTotal(10000, 0)</code> xato tashlamadi. <b>0 ni o'tkazib yuborgan satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "() =>siz, noto'g'ri xabar va < 0",
  "seg": [
   [
    "a",
    "Endi siz: o'z testingizni <b>uch xil buzasiz</b> va har xabarni o'qiysiz",
    "Endi o'z testingizni uch xil buzasiz. Bunga o'n daqiqa ketadi. Har buzishdan keyin npm test qilib, xabarni o'qing."
   ],
   [
    "b",
    "1–2-qadam: <b><code>() =&gt;</code>ni olib tashlang</b>, keyin <code>toThrow</code>ga boshqa xabar yozing",
    "Birinchi qadamda nol dona testida strelkani olib tashlang: test funksiyaning o'z xatosi bilan qulaydi. Keyin strelkani qaytaring. Ikkinchisida matn testida to throw ichiga narx xato deb yozing va received message'ni o'qing."
   ],
   [
    "c",
    "3–4-qadam: guardda <code>&lt; 0</code>, keyin tiklang; isbot — <b><code>Received message</code> satri</b>",
    "Uchinchi qadamda guardda kichik yoki teng o'rniga faqat kichik yozing: did not throw chiqadi. To'rtinchisida hammasini tiklang. Isbot maydoniga ikkinchi qadamdagi received message satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, xato kutiladigan testdagi uch xil xabarni endi bir qarashda ajrata olasiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · tuzoqlar",
  "title": "orderTotal(10000, 'ikki'): npm test yuradi, VS Code esa TS2345",
  "seg": [
   [
    "a",
    "O'quvchi darsi <code>'ikki'</code> va <code>null</code>ni sinaydi — <b>TypeScript faylda</b> bu nima bo'ladi?",
    "O'quvchi darsida ikki degan so'z va null bilan sinash bor. Lekin test fayli TypeScript: funksiya son kutadi. Sinab ko'rdik, natija kutilmagan."
   ],
   [
    "b",
    "<code>npm test</code> <b>turlarni tekshirmaydi</b>: test yuradi, <code>Received: NaN</code>",
    "Npm test turlarni tekshirmaydi: o'quvchi reposining sozlamasida isolated modules yoqilgan, shuning uchun ts jest faylni tekshirmasdan o'tkazadi. Test yuradi: matn NaN beradi, null esa nol."
   ],
   [
    "c",
    "VS Code esa <b>qizil chizadi</b>: <code>TS2345: Argument of type 'string' is not assignable…</code>",
    "Shu fayl VS Code'da qizil chiziq bilan ko'rinadi. Tsc buyrug'i ham shuni aytadi: string turidagi argument number'ga mos emas, null ham mos emas. O'quvchi qizilni ko'radi, lekin test baribir ishlayveradi va u adashadi."
   ],
   [
    "d",
    "Xulosa: noto'g'ri turni ataylab sinashda — <b><code>'ikki' as any</code></b>; qizil chiziq yo'qoladi",
    "Xulosa: noto'g'ri turni ataylab sinamoqchi bo'lsangiz, as any yozing: ikki as any. TypeScript'ga bu ataylab ekanini aytasiz, qizil chiziq yo'qoladi. Sinab ko'rdik, guard bilan bu test yashil."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · tuzoqlar",
  "title": "Ikki test fayli bo'lsa — faqat PASS fayl; nomlar --verbose bilan",
  "seg": [
   [
    "a",
    "Bitta faylda Jest har test nomini ko'rsatadi — ikkinchi fayl qo'shilganda <b>ko'rsatmaydi</b>",
    "Endi kichik, lekin sinfda albatta chiqadigan holat. Fayl bitta bo'lsa, Jest har test nomini ko'rsatadi. Ikkinchi test fayli qo'shilganda faqat PASS va fayl nomi qoladi. O'quvchi «testlarim qayoqqa ketdi?» deydi."
   ],
   [
    "b",
    "Testlar joyida — jami soni o'zgarmadi; nomlarni ko'rish uchun <b><code>npx jest --verbose</code></b>",
    "Testlar joyida: pastdagi jami o'n bir. Nomlarni ko'rish uchun npx jest minus minus verbose qiling. Shunda har fayl ostida nomlar va belgilar chiqadi."
   ],
   [
    "c",
    "Xulosa: nom ko'rinmasa — <b>xato emas</b>; jami sonni va <code>--verbose</code>ni ko'rsating",
    "Xulosa: nomlar ko'rinmasa, bu xato emas. Avval jami songa qarang, kerak bo'lsa verbose bilan yurgizing. FAIL bo'lganda esa qizil test nomi baribir chiqadi."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi: «Received function did not throw chiqdi». Bu nima degani?",
  "q": "Tuzoqlarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi testi qizil: received function did not throw. Bu nima degani? Variantni tanlang.",
  "ok": "To'g'ri. Funksiya xato tashlamadi, test esa kutgan edi. Sabab ikkita: guard umuman yo'q yoki shart bu qiymatni o'tkazib yubordi, masalan nol. Funksiyani oching va shu qiymat bilan shartni qo'lda tekshiring. Demak, did not throw — himoya yo'qligi yoki shart teshikligi haqida xabar.",
  "okShort": "Funksiya xato tashlamadi: guard yo'q yoki shart qiymatni o'tkazdi.",
  "hint": "«did not throw» — so'zma-so'z: funksiya … qilmadi.",
  "correct": 0,
  "opts": [
   "Funksiya xato tashlamadi — guard yo'q yoki shart bu qiymatni o'tkazdi",
   "Funksiya xato tashladi, lekin boshqa xabar bilan",
   "Test fayli topilmadi",
   "() => yozilmagan"
  ],
  "wrong": {
   "1": "Boshqa xabar bo'lsa Expected substring / Received message chiqadi.",
   "2": "Fayl topilmasa No tests found bo'ladi.",
   "3": "() =>siz test funksiyaning o'z xatosi bilan qulaydi — did not throw emas."
  }
 },
 "16": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 5–10 daqiqa",
  "title": "Qizil chiziq, lekin test yuradi — o'zingiz ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: TypeScript tuzog'ini <b>o'z ko'zingiz bilan</b> ko'rasiz — VS Code va terminal",
    "Endi TypeScript tuzog'ini o'zingiz ko'rasiz. Bunga besh-o'n daqiqa ketadi. VS Code'ni ham, terminalni ham kuzating."
   ],
   [
    "b",
    "1–2-qadam: guardni vaqtincha oling, <code>'ikki'</code> testi — VS Code qizil, <b><code>npm test</code> yuradi</b>",
    "Birinchi qadamda guard satrlarini vaqtincha izohga oling. Ikkinchisida matn testidagi as any'ni olib tashlang. VS Code qizil chizadi, lekin npm test yuradi va received NaN deydi."
   ],
   [
    "c",
    "3–4-qadam: <code>as any</code> va guardni qaytaring; isbot — 2-qadamdagi <b><code>Received</code> qiymati</b>",
    "Uchinchi qadamda as any'ni qaytaring: qizil chiziq yo'qoladi. To'rtinchisida guardni qaytaring: hammasi yashil bo'ladi. Isbot maydoniga ikkinchi qadamdagi received qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, VS Code'dagi qizil chiziq va terminaldagi natija har xil narsa ekanini o'zingiz ko'rdingiz."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · uyga vazifa misoli",
  "title": "0 va 100 — ishlaydi; −1 va 101 — xato: chegaraning ikki tomoni",
  "seg": [
   [
    "a",
    "O'quvchi uyga vazifasi: kupon — summadan foiz chegirma, <b>0 dan 100 gacha</b>",
    "Endi o'quvchining uyga vazifasi: apply coupon funksiyasi. U summadan foiz chegirma hisoblaydi. Unda ikki himoya bor: summa son bo'lishi kerak, foiz esa nol bilan yuz orasida. Sinab ko'rdik, beshta emas, oltita test chiqdi."
   ],
   [
    "b",
    "<b>Olti test</b>: oddiy (10 %), chegaralar 0 va 100, chegaradan tashqari 101 va −1, matn",
    "Oltita test bor. Oddiy holat: o'n foiz, natija to'qson ming. Chegaraning ichki tomoni, nol foiz va yuz foiz, ishlaydi. Tashqi tomoni, yuz bir va minus bir, xato beradi. Oxirgisi matn summa. Hammasi yashil: ikki fayl bilan o'n bir test."
   ],
   [
    "c",
    "<code>&gt;</code> o'rniga <code>&gt;=</code> — faqat <b>«chegara 100 %» qizil</b>, o'z xatosi bilan",
    "Endi chegara xatosini qilamiz: katta o'rniga katta yoki teng yozamiz. Natijada faqat yuz foiz testi qizil, xabari esa funksiyaning o'z xatosi: percent noldan yuzgacha bo'lsin. Yuz foiz endi taqiqlangan bo'lib qoldi."
   ],
   [
    "d",
    "Xulosa: <b>chegaraning ikki tomoni</b> — ichkarida ishlaydi (0, 100), tashqarida xato (−1, 101)",
    "Xulosa: chegaraning ikki tomonini sinang. Ichkaridagi qiymatlar, nol va yuz, ishlashi kerak. Tashqaridagilar, minus bir va yuz bir, xato berishi kerak. O'quvchi vazifasini tekshirganda shu to'rt qiymat bormi, shunga qarang."
   ]
  ]
 },
 "18": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "applyCoupon guardida percent > 100 o'rniga percent >= 100. Qaysi test qizil bo'ladi?",
  "q": "Chegarani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Kupon funksiyasida katta o'rniga katta yoki teng yozildi. Oltita testdan qaysi biri qizil bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri, yuz foiz. Katta yoki teng bo'lsa, yuz ham taqiqlanadi va funksiya xato tashlaydi. Test esa nol natija kutgan edi. Yuz bir baribir xato beradi, u yashil qoladi. Demak, chegarani sinash uchun aynan chegaradagi qiymat testi kerak.",
  "okShort": "<code>&gt;= 100</code> — 100 ham xato; <code>chegara 100 %</code> qizil, qolgan 5 yashil.",
  "hint": "Ikki shart faqat bitta qiymatda farq qiladi — qaysi biri?",
  "correct": 2,
  "opts": [
   "101 % — xato",
   "0 %",
   "chegara 100 % — 0",
   "hammasi"
  ],
  "wrong": {
   "0": "101 ikkala shartda ham xato — test yashil qoladi.",
   "1": "0 ga bu shart tegmaydi.",
   "3": "Faqat chegaradagi qiymat farq qiladi."
  }
 },
 "19": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'quvchi uyga vazifasi — guard va olti test",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi uyga vazifasini o'zingiz qilasiz — <b>guard va olti test</b>",
    "Oxirgi amaliyotda o'quvchi uyga vazifasini o'zingiz qilasiz: kupon funksiyasi, ikki himoya va oltita test. Bunga o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>coupon.ts</code> va <code>coupon.spec.ts</code>, <code>npm test</code> — <b>hammasi yashil</b>",
    "Birinchi qadamda coupon ts faylida ikki himoya va hisobni yozasiz. Ikkinchisida coupon spec ts faylida oltita test yozasiz. npm test qilganda hammasi yashil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <code>&gt;</code> → <code>&gt;=</code>, <b>qizil test nomini</b> o'qing; isbot — o'sha nom",
    "Uchinchi qadamda katta o'rniga katta yoki teng yozib, npm test qilasiz. To'rtinchisida qizil testning nomini nuqtali satrdan o'qib, isbot maydoniga yozasiz va funksiyani tiklaysiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'quvchi uyga vazifasini to'liq qildingiz va uning to'rt chegara qiymatini bilasiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4b-03 · «Edge cases va error path»",
  "title": "m4b-03: shumtaka mijoz, guard va o'rash",
  "seg": [
   [
    "a",
    "m4b-03 — 21 ekran: o'quvchi <b>«shumtaka mijoz»</b> kiritgan g'alati buyurtmalarni sinaydi",
    "Endi o'quvchi darsini ko'ramiz: m4b-03, unda yigirma bir ekran bor. O'quvchi shumtaka mijoz kiritgan g'alati buyurtmalarni ko'radi, himoya yig'adi va xatoni test bilan sinashni o'rganadi."
   ],
   [
    "b",
    "Guard bloki: o'quvchi o'rashni tanlaydi — siz <b>o'ralmagan holatning xabarini</b> ko'rsatasiz",
    "Guard blokida o'quvchi to'g'ri yozuvni tanlaydi: o'ralgan funksiya. Siz proyektorda o'ralmaganini yurgizib ko'rsating: test funksiyaning o'z xatosi bilan qulaydi. Ko'rgan o'quvchi buni unutmaydi."
   ],
   [
    "c",
    "Amaliyot oldidan: <code>'ikki'</code> testida <b><code>as any</code></b> — aks holda VS Code qizil chizadi",
    "Amaliyot va uyga vazifadan oldin bitta ogohlantirish: matn testida as any yozilsin. Yozilmasa, VS Code qizil chizadi, test esa baribir yuradi va o'quvchi adashadi."
   ],
   [
    "d",
    "Xulosa: vaqt — guard va o'rashga ko'proq; uyga vazifada <b>to'rt chegara qiymati</b>",
    "Xulosa: vaqt, taklif: to'qson daqiqaning yigirma beshi guard va o'rashga, chunki eng ko'p adashish shu yerda. Uyga vazifani tekshirganda to'rt qiymatga qarang: nol, yuz, minus bir va yuz bir."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsidagi so'zlar: shumtaka mijoz, «hech kim sezmaydi», guard bloklari, o'rab berish",
  "seg": [
   [
    "a",
    "O'quvchi darsi «shumtaka mijoz» deydi — siz <b>«edge case»</b> atamasini birga aytasiz",
    "Xaritani ko'rdingiz, endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz. O'quvchi darsi shumtaka mijoz va g'alati buyurtma deydi. Siz uning yonida atamani ham ayting: edge case, ya'ni chegara holati."
   ],
   [
    "b",
    "«Hech kim sezmaydi», kartochkada «jim buzilish» — xatosiz noto'g'ri natija; guard esa uch blok: <b>shart, xato, hisob</b>",
    "Xato chiqmasdan natija noto'g'ri bo'lgan holat haqida o'quvchi darsi «hech kim sezmaydi» deydi, kartochkasida esa «jim buzilish» deb yozilgan. Siz buni yashirin buzilish deysiz, ikkalasi bitta narsa. Guard o'quvchi darsida uch blokdan iborat: shart, xato tashlash va to'g'ri hisob. Kodda ular aynan if, throw va return."
   ],
   [
    "c",
    "Xulosa: «o'rab berish, ya'ni <code>() =&gt;</code>» — so'zni <b>kod bilan birga</b> ko'rsating",
    "Xulosa: o'rab berish deganda strelkali funksiya tushuniladi. So'zni aytganda ekranda kodni ham ko'rsating. Terminal so'zlari esa inglizcha qoladi: did not throw, received message."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan <b>olti holat</b> — hammasini bugun o'zingiz ko'rdingiz",
    "Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz."
   ],
   [
    "b",
    "Uch xabar <b>uch sabab</b>: <code>did not throw</code>, funksiya xatosi, <code>Received message</code>",
    "Birinchi uchtasi xabardan taniladi. Did not throw chiqsa, himoya yo'q. Funksiyaning o'z xabari chiqsa, strelka yo'q. Received message chiqsa, boshqa xato tutilgan."
   ],
   [
    "c",
    "Happy qizil, <code>'ikki'</code> qizil chiziq, nomlar yo'q — shart, <b><code>as any</code></b>, <code>--verbose</code>",
    "To'rtinchisi: oddiy holat qizil bo'lsa, himoya juda qattiq. Beshinchisi: matn testida qizil chiziq bo'lsa, as any yozing. Oltinchisi: nomlar ko'rinmasa, sabab ikkita fayl."
   ],
   [
    "d",
    "Xulosa: <b>xabarni o'quvchi bilan birga o'qing</b> — har xabar boshqa sababni aytadi",
    "Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Bu darsda har xabar boshqa sababni aytadi. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "23": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Himoyasiz orderTotal(10000, 0) nima qaytaradi?",
    "o": [
     "Error",
     "0 — xatosiz",
     "NaN",
     "10000"
    ],
    "c": 1,
    "e": "Yashirin buzilish: bepul buyurtma.",
    "s": 3
   },
   {
    "q": "Received function did not throw nimani bildiradi?",
    "o": [
     "funksiya xato tashlamadi",
     "boshqa xabar",
     "fayl topilmadi",
     "() => yo'q"
    ],
    "c": 0,
    "e": "Guard yo'q yoki shart qiymatni o'tkazdi.",
    "s": 5
   },
   {
    "q": "Xato kutilayotgan testning to'g'ri yozuvi?",
    "o": [
     "expect(f(0)).toThrow()",
     "f(0).toThrow()",
     "expect(() => f(0)).toThrow()",
     "expect(f(0)).toBe(0)"
    ],
    "c": 2,
    "e": "Jest o'ralgan funksiyani o'zi chaqiradi.",
    "s": 8
   },
   {
    "q": "() =>siz toThrow — natija?",
    "o": [
     "PASS",
     "did not throw",
     "No tests found",
     "test funksiyaning o'z xatosi bilan qulaydi"
    ],
    "c": 3,
    "e": "Funksiya expect'dan oldin ishlaydi.",
    "s": 8
   },
   {
    "q": "Guardda <= 0 o'rniga < 0. Qaysi test qizil?",
    "o": [
     "0 dona — xato",
     "manfiy — xato",
     "2 kitob",
     "matn — xato"
    ],
    "c": 0,
    "e": "Faqat 0 da farq.",
    "s": 10
   },
   {
    "q": ".spec.tsda orderTotal(10000, 'ikki') — o'quvchi reposida nima bo'ladi?",
    "o": [
     "npm test yurmaydi",
     "VS Code qizil, test yuradi — NaN",
     "hech narsa",
     "No tests found"
    ],
    "c": 1,
    "e": "isolatedModules — ts-jest turlarni tekshirmaydi.",
    "s": 13
   },
   {
    "q": "applyCouponda > 100 o'rniga >= 100. Qaysi test qizil?",
    "o": [
     "101 %",
     "0 %",
     "chegara 100 %",
     "hammasi"
    ],
    "c": 2,
    "e": "100 ham taqiqlanadi.",
    "s": 17
   },
   {
    "q": "Kupon uchun chegaraning ikki tomoni — qaysi to'rt qiymat?",
    "o": [
     "10, 20, 30, 40",
     "1, 2, 3, 4",
     "50, 60, 70, 80",
     "0, 100, −1, 101"
    ],
    "c": 3,
    "e": "Ichkari ishlaydi, tashqari xato.",
    "s": 17
   }
  ]
 },
 "24": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  MENTOR KURSI · Jest-2 «Edge cases va error path: noto'g'ri kirishni sinash»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/12-Jest2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/jest2-out/ (00–16; har npm test toza muhitda)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest2/parts/*.jsx > JestEdgeMentorLesson.jsx
//  Yordamchilar Jest-1 dan nusxa (SQL/psql/Postman qismlari olib tashlangan — bu darsda kerak emas)
// ============================================================
const LESSON_ID = 'mentor-jest-02-edge-cases-v1';
const LESSON_TITLE = "Edge cases va error path: noto'g'ri kirishni sinash";
const PG = { term: '#111827', termEr: '#1F1115' };
MKCFG.root = 'IntroNestArxitechture';
MKCFG.kind = (f) => /\.spec\.ts$/.test(f) ? T.purple : /\.ts$/.test(f) ? T.blue : /\.json$/.test(f) ? T.yellow : null;
// O'quvchi reposining to'liq Explorer'i (M27): mavzuga aloqasiz papkalar yopiq; test fayllari ekranga qarab qo'shiladi
const REPO_BASE = ['dist/', 'node_modules/', 'src/api/', 'src/common/', 'src/config/', 'src/core/', 'src/infrastructure/', 'src/main.ts', 'test/', '.env.example', 'nest-cli.json', 'package.json', 'tsconfig.json'];
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
const F = { ord: 'src/order.ts', ordSpec: 'src/order.spec.ts', cup: 'src/coupon.ts', cupSpec: 'src/coupon.spec.ts', ts: 'tsconfig.json' };
const ORD_FILES = tree(REPO_BASE, [F.ord, F.ordSpec]);
const CUP_FILES = tree(REPO_BASE, [F.ord, F.ordSpec, F.cup, F.cupSpec]);
MKCFG.files = ORD_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['received function did not throw', 'Received function did not throw'], ['expected substring', 'Expected substring'], ['received message', 'Received message'],
  ['expected va received', 'Expected va Received'], ['Throw new error', 'throw new Error'], ['throw new error', 'throw new Error'],
  ['isolated modules', 'isolatedModules'], ['ts jest', 'ts-jest'], ['Npm test', 'npm test'], ['Tsc buyrug', 'tsc buyrug'],
  ['npx jest minus minus verbose', 'npx jest --verbose'], ['ikki as any', "'ikki' as any"], ['coupon spec ts', 'coupon.spec.ts'], ['coupon ts', 'coupon.ts'],
  ['apply coupon', 'applyCoupon'], ['order ts', 'order.ts'], ['to throw', 'toThrow'], ['Ikki degan so', "'ikki' degan so"], ['ikki degan so', "'ikki' degan so"],
];
DIGITS.unshift(["minus o'n ming", '−10 000'], ["o'n ming ko'paytirish nol", '10 000 × 0'], ["o'n ming va ikki", '10 000 va 2'], ["to'qson ming", '90 000'],
  ["minus bir dona", '−1 dona'], ['minus bir', '−1'], ['nol dan yuz gacha', '0 dan 100 gacha'], ['nol bilan yuz', '0 bilan 100'], ['nol bilan bir', '0 bilan 1'],
  ['nol va yuz', '0 va 100'], ['yuz bir', '101'], ['yuz foiz', '100 %'], ["o'n foiz", '10 %'], ['nol foiz', '0 %'], ['nol dona', '0 dona'], ["nol so'm", "0 so'm"],
  ['bir dona', '1 dona'], ['ikki dona', '2 dona'], ['ikki kitob', '2 kitob'], ["o'n bir", '11'], ['yigirma bir', '21'], ["to'qson daqiqaning yigirma beshi", '90 daqiqaning 25 tasi'],
  ["besh-o'n daqiqa", '5–10 daqiqa'], ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'], ["sakkizinchi ekran", '8-ekran'], ["o'ninchi ekran", '10-ekran']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /received function did not throw/gi, /did not throw/gi, /expected substring/gi, /received message/gi, /not a number/gi, /isolated modules/gi,
  /happy path/gi, /edge case/gi, /throw new error/gi,
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
// VS Code qizil to'lqin chizig'i (maket, 13-ekran): rang beruvchi chiqargan HTML ichida 'ikki' va null ni o'raydi
const wavy = (line) => ({ ...line, h: line.h.replace(`<span class="s">'ikki'</span>`, `<span class="s j2-wavy">'ikki'</span>`).replace(`<span class="k">null</span>`, `<span class="k j2-wavy">null</span>`) });
// Jest terminali: kod satrlari (N |) birinchi — ular ichidagi «Error» qizil bo'lmasin; PASS/✓ yashil, FAIL/●/✕ qizil
function jestLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*>\s*\d+ \|/.test(l) || /^\s+\|\s+\^/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*\d+ \|/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*at /.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/^\s*PASS\b|✓|passed, \d+ total$/.test(l) && !/failed/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Expected( substring)?:/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Received( message)?:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/WARN/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^\s*FAIL\b|●|✕|failed|error|did not throw|musbat raqam|gacha bo'lsin|suite failed/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^>|^Snapshots|^Time|^Ran all|^---|^\s*expect\(received\)/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const jt = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = 'terminal — npm test', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Jest-2 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
/* VS Code qizil to'lqin chiziq maketi — 13-ekran */
.j2-wavy{text-decoration:underline wavy #F14C4C;text-decoration-thickness:1.5px;text-underline-offset:4px}
.j2-edge{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
@media (max-width:1300px){.j2-edge{grid-template-columns:repeat(3,minmax(0,1fr))}}
.j2-edge div{border:1.5px solid ${T.line};border-radius:10px;background:${T.paper};padding:10px 8px;text-align:center;font:600 14px ${MONO};transition:opacity .3s,border-color .3s}
.j2-edge div small{display:block;font:500 11.5px ${SANS};color:${T.ink3};margin-top:4px}
.j2-edge div.on{border-color:${T.accent}}
.j2-line{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:6px}
.j2-line div{border-radius:10px;padding:10px 8px;text-align:center;font:700 15px ${MONO};border:1.5px solid}
.j2-line div small{display:block;font:500 12px ${SANS};margin-top:4px}
.j2-line .in{color:${T.green};border-color:${T.green};background:#E3F5EC}
.j2-line .out{color:${T.accent};border-color:${T.accent};background:#FFF0EB}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Umumiy kod va chiqishlar (jest2-out — toza muhit)
// ============================================================
const ORDER_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}`, { 2: { id: 'op' } });
const GUARD_SRC = (cond) => String.raw`
export function orderTotal(price: number, quantity: number): number {
  if (typeof quantity !== 'number' || Number.isNaN(quantity) || ${cond}) {
    throw new Error("quantity musbat raqam bo'lsin");
  }
  return price * quantity;
}`;
const ORDER_GUARD = ts(GUARD_SRC('quantity <= 0'), { 2: { id: 'if' }, 3: { id: 'th' }, 4: { id: 'if' }, 5: { id: 'ret' } });
// Edge testlari — himoyasiz funksiyaga (jest2-out/04)
const SPEC_EDGE = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
  it('0 dona — xato', () => {
    expect(() => orderTotal(10000, 0)).toThrow();
  });
  it('manfiy — xato', () => {
    expect(() => orderTotal(10000, -1)).toThrow();
  });
});`, { 7: { id: 'e' }, 8: { id: 'e' }, 9: { id: 'e' }, 10: { id: 'e' }, 11: { id: 'e' }, 12: { id: 'e' } });
// To'liq test fayli — guard bilan (jest2-out/05; satr raqamlari 06, 07, 09 dagi bilan bir xil)
const SPEC_FULL = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
  it('1 dona — eng kichik haqiqiy buyurtma', () => {
    expect(orderTotal(10000, 1)).toBe(10000);
  });
  it('0 dona — xato', () => {
    expect(() => orderTotal(10000, 0)).toThrow();
  });
  it('manfiy — xato', () => {
    expect(() => orderTotal(10000, -1)).toThrow();
  });
  it("matn — xato", () => {
    expect(() => orderTotal(10000, 'ikki' as any)).toThrow("quantity musbat raqam bo'lsin");
  });
});`, { 7: { id: 'one' }, 8: { id: 'one' }, 11: { id: 'zero' }, 17: { id: 'txt' } });
const PASS5 = jt(String.raw`
$ npm test
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✓ 1 dona — eng kichik haqiqiy buyurtma (1 ms)
    ✓ 0 dona — xato (5 ms)
    ✓ manfiy — xato (1 ms)
    ✓ matn — xato (1 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total`, { 2: { id: 'p' }, 11: { id: 'tot' } });
const FAIL_EDGE = jt(String.raw`
$ npm test
FAIL src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✕ 0 dona — xato (1 ms)
    ✕ manfiy — xato (1 ms)

  ● orderTotal › 0 dona — xato

    expect(received).toThrow()

    Received function did not throw

    >  8 |     expect(() => orderTotal(10000, 0)).toThrow();
         |                                        ^

Tests:       2 failed, 1 passed, 3 total`, { 2: { id: 'n' }, 3: { id: 'n' }, 4: { id: 'n' }, 5: { id: 'n' }, 6: { id: 'n' }, 8: { id: 'm' }, 10: { id: 'm' }, 12: { id: 'm' }, 14: { id: 'm' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Edge case va yashirin buzilish', 'Guard', 'Buzamiz: toThrow', "TypeScript tuzog'i", 'Uyga vazifa misoli', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — o'quvchi reposida: noto'g'ri kirish ham sinalgan</div>
    <Term lines={PASS5.slice(1, 8)} />
  </div>} />;
}

// ============================================================
//  2 · Happy path va edge case
// ============================================================
const EDGE2 = [['0', 'nol dona', 'b'], ['-1', 'manfiy', 'b'], ['1', 'eng kichik', 'b'], ["'ikki'", "so'z", 'c'], ['null', "bo'sh", 'c']];
const S2 = mkS(2, [{ on: '' }, { on: 'b' }, { on: 'bc' }, { on: 'bc', sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag" style={{ color: T.green }}>Happy path — oddiy yo'l</div>
      <div className="pg-row"><span>orderTotal(10000, 2)</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ color: T.green }}>20000</span></div>
    </div>
    {seg.on && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .4s ease both' }}>
      <div className="mk-tag" style={{ color: T.accent }}>Edge case — chegara holati: orderTotal(10000, …)</div>
      <div className="j2-edge">{EDGE2.map(([v, d, g]) => <div key={v} className={seg.on.includes(g) && !seg.sum ? 'on' : ''} style={{ opacity: seg.on.includes(g) ? 1 : 0.25 }}>{v}<small>{d}</small></div>)}</div>
    </div>}
    {seg.sum && <div className="mk-rule">Har funksiya uchun: <b>bitta oddiy holat</b> va <b>bir nechta chegara holati</b>. O'quvchi darsi: «chegara 0 bilan 1 orasida».</div>}
  </div>} />;
}

// ============================================================
//  3 · Yashirin buzilish (jest2-out/01)
// ============================================================
const ROWS3 = [['2', '20000', 0], ['0', '0', 'a'], ['-1', '-10000', 'b'], ['1', '10000', 'b'], ["'ikki'", 'NaN', 'c'], ['null', '0', 'c']];
const S3 = mkS(3, [{ on: 'a' }, { on: 'ab' }, { on: 'abc' }, { on: 'abc', sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={tree(REPO_BASE, [F.ord])} active={F.ord}><CodePanel file={F.ord} lines={ORDER_TS} focus={['op']} /></Ide>
    <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Himoyasiz funksiya — haqiqiy natijalar</div>
      <div style={{ display: 'grid', gap: 6 }}>{ROWS3.map(([a, r, g]) => {
        const shown = g === 0 || seg.on.includes(g);
        const bad = g !== 0 && a !== '1';
        return <div key={a} className={`pg-row${shown && bad && !seg.sum && seg.on.endsWith(g) ? ' hl' : ''}`} style={{ opacity: shown ? 1 : 0.25 }}>
          <span>orderTotal(10000, {a})</span><span style={{ color: T.ink3 }}>→</span>
          <span className="v" style={{ color: !shown ? T.ink3 : bad ? T.accent : T.green }}>{shown ? r : '?'}</span>
          {shown && <span style={{ fontFamily: SANS, fontSize: 12, color: bad ? T.accent : T.green, minWidth: 92, textAlign: 'right' }}>{bad ? 'xato yo\'q' : "to'g'ri"}</span>}
        </div>;
      })}</div>
    </div>
    {seg.sum && <div className="mk-rule">Himoyasiz funksiya noto'g'ri kirishda <b>xato bermaydi</b>, balki noto'g'ri ishlaydi. To'g'ri yo'l: darhol rad etish.</div>}
  </div>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file={F.ord} lines={ORDER_TS} focus={['op']} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija — himoyasiz funksiya</div>
      <div className="pg-row hl"><span>orderTotal(10000, -1)</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ color: T.accent }}>-10000</span></div>
      <div className="mk-rule">Xato yo'q, natija noto'g'ri — <b>himoya (guard)</b> kerak.</div>
    </div>} />;
}

// ============================================================
//  5 · Edge testlari: did not throw (jest2-out/04)
// ============================================================
const S5 = mkS(5, [{ focus: ['e'] }, { out: true, f: ['n'] }, { out: true, f: ['m'] }, { out: true, f: ['m'], sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={ORD_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={SPEC_EDGE} focus={seg.out ? [] : seg.focus} /></Ide></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.out && <Term er lines={FAIL_EDGE} focus={seg.f} />}
      {seg.sum && <div className="mk-rule"><b>did not throw</b> — funksiyada himoya yo'q yoki shart bu qiymatni o'tkazib yubordi.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  6 · Guard: if → throw → return (jest2-out/05)
// ============================================================
const S6 = mkS(6, [{ focus: ['if', 'th', 'ret'], steps: true }, { focus: ['if'] }, { focus: ['th'] }, { focus: [], out: true }, { focus: [], out: true, sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={ORDER_GUARD} focus={seg.focus} /></Ide>
    {seg.steps && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.yellow }}><h4>1 · Shart</h4><p><code>if (…)</code></p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>2 · Xato</h4><p><code>throw new Error(…)</code></p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>3 · Hisob</h4><p><code>return price * quantity</code></p></div>
    </div>}
    {seg.out && <Term lines={PASS5} focus={seg.sum ? ['tot'] : []} />}
    {seg.sum && <div className="mk-rule">Ikki tomon sinaladi: noto'g'ri kirish — <b>xato</b>, eng kichik to'g'ri kirish (1 dona) — <b>hisob</b>.</div>}
  </div>} />;
}

// ============================================================
//  7 · Amaliyot 1 — edge testlari va guard
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "Edge testlari — order.spec.ts: 0 va -1 uchun expect(() => …).toThrow()", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Qizil', cmds: ['npm test'], exp: 'Received function did not throw (2 ta)' },
  { t: "Guard — order.ts boshiga (namuna — o'zingiz yozing)", cmds: [], exp: 'fayl saqlandi' },
  { t: "Yashil — 1 dona va 'ikki' as any testlari", cmds: ['npm test'], exp: 'Tests: 5 passed, 5 total' },
];
const P1_CODE = [{ file: F.ordSpec, step: 0, lines: SPEC_EDGE, copy: false }, { file: F.ord, step: 2, lines: ORDER_GUARD, copy: false }, { file: F.ordSpec, step: 3, lines: SPEC_FULL, copy: false }];
const P1_TROUBLE = [
  ["Tests: 8 passed yoki boshqa son, nomlar yo'q", "Jest-1 dagi delivery/discount testlari ham yurdi — npm test -- order (faqat order testlari)"],
  ['2-qadamda test xato matni bilan yiqildi', "() => yozilmagan — 8-ekran"],
  ["4-qadamda «1 dona» qizil, quantity musbat raqam bo'lsin", 'shart quantity <= 1 — 1 ham taqiqlangan; quantity <= 0 bo\'lsin'],
  ['«matn — xato» qizil, Received: NaN…', "typeof / Number.isNaN tekshiruvi yo'q — guardning 2-satri"],
];
const P1_PROOF = { label: 'Isbot: natijadagi Tests: satri', placeholder: "natijadagi Tests satrini qo'ying", check: (v) => /Tests:\s+5 passed,\s+5 total/.test(v), wrong: "Satr «Tests:» bilan boshlanadi; beshala test o'tgan bo'lishi kerak. Boshqa son bo'lsa — «Boshqacha chiqdimi?»" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={ORD_FILES} />; }

// ============================================================
//  8 · () => nega kerak (jest2-out/06)
// ============================================================
const WRAP_BAD = ts(String.raw`
  it('0 dona — xato', () => {
    expect(orderTotal(10000, 0)).toThrow();
  });`, { 2: { id: 'x' } });
const WRAP_OK = ts(String.raw`
  it('0 dona — xato', () => {
    expect(() => orderTotal(10000, 0)).toThrow();
  });`, { 2: { id: 'x' } });
const UNWRAP_OUT = jt(String.raw`
FAIL src/order.spec.ts
    ✕ 0 dona — xato

  ● orderTotal › 0 dona — xato

    quantity musbat raqam bo'lsin

    > 3 |     throw new Error("quantity musbat raqam bo'lsin");
        |           ^

      at orderTotal (order.ts:3:11)
      at Object.<anonymous> (order.spec.ts:11:22)

Tests:       1 failed, 4 passed, 5 total`, { 4: { id: 'm' }, 6: { id: 'm' }, 11: { id: 'at' }, 12: { id: 'at' } });
const S8 = mkS(8, [{ v: 'both' }, { v: 'bad', f: ['m'] }, { v: 'bad', f: ['at'] }, { v: 'both', sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="mk-tag" style={{ color: T.accent, margin: 0 }}>O'ralmagan</div>
      <CodePanel file={F.ordSpec} wrap lines={WRAP_BAD} focus={['x']} />
      {seg.v === 'both' && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>O'ralgan — () =&gt;</div><CodePanel file={F.ordSpec} wrap lines={WRAP_OK} focus={['x']} /></>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'bad' && <Term er lines={UNWRAP_OUT} focus={seg.f} />}
      {seg.v === 'both' && !seg.sum && <div className="mk-card"><h5>Savol</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>Qaysi yozuv to'g'ri? Sinab ko'ramiz: <b>o'rashni olib tashlaymiz</b>.</div></div>}
      {seg.sum && <><Term lines={PASS5.slice(1, 8)} /><div className="mk-rule">Xato kutilsa — funksiya <b>() =&gt; ichida</b>: Jest uni o'zi chaqiradi va xatoni tutadi.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  9 · toThrow('xabar'): xabar mos emas (jest2-out/07)
// ============================================================
const MSG_SPEC = ts(String.raw`
  it("matn — xato", () => {
    expect(() => orderTotal(10000, 'ikki' as any)).toThrow('narx xato');
  });`, { 2: { id: 'x' } });
const MSG_OUT = jt(String.raw`
FAIL src/order.spec.ts
    ✕ matn — xato (11 ms)

  ● orderTotal › matn — xato

    expect(received).toThrow(expected)

    Expected substring: "narx xato"
    Received message:   "quantity musbat raqam bo'lsin"

      at orderTotal (order.ts:3:11)

Tests:       1 failed, 4 passed, 5 total`, { 8: { id: 'm' }, 9: { id: 'm' } });
WRAP_BAD.forEach((l, i) => { l.n = 10 + i; });
WRAP_OK.forEach((l, i) => { l.n = 10 + i; });
MSG_SPEC.forEach((l, i) => { l.n = 16 + i; });
const S9 = mkS(9, [{ v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <Ide files={ORD_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={MSG_SPEC} focus={['x']} /></Ide>
      {seg.v === 'code' && <div className="pg-two">
        <div className="mk-box" style={{ '--c': T.ink3 }}><h4><code>toThrow()</code></h4><p>xato bo'ldimi?</p></div>
        <div className="mk-box" style={{ '--c': T.green }}><h4><code>toThrow('matn')</code></h4><p>qaysi xato?</p></div>
      </div>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out' && <Term er lines={MSG_OUT} focus={['m']} />}
      {seg.sum && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — toThrow("quantity musbat raqam bo'lsin")</div><Term lines={PASS5.slice(7, 8).concat(PASS5.slice(10))} /></>}
      {seg.sum && <div className="mk-rule">Xato kutilgan joyda <b>xabarni ham</b> tekshiring — u qaysi shartdan kelganini aytadi.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  10 · Shartsiz throw va < 0 (jest2-out/08, 09)
// ============================================================
const NOIF_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  throw new Error("quantity musbat raqam bo'lsin");
  return price * quantity;
}`, { 2: { id: 'x' } });
const LT_TS = ts(GUARD_SRC('quantity < 0'), { 2: { id: 'x' } });
const NOIF_OUT = jt(String.raw`
FAIL src/order.spec.ts
  orderTotal
    ✕ 2 kitob narxini hisoblaydi (2 ms)
    ✕ 1 dona — eng kichik haqiqiy buyurtma
    ✓ 0 dona — xato (2 ms)
    ✓ manfiy — xato (1 ms)
    ✓ matn — xato (4 ms)

Tests:       2 failed, 3 passed, 5 total`, { 3: { id: 'x' }, 4: { id: 'x' } });
const LT_OUT = jt(String.raw`
FAIL src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✓ 1 dona — eng kichik haqiqiy buyurtma
    ✕ 0 dona — xato (1 ms)
    ✓ manfiy — xato (2 ms)
    ✓ matn — xato (1 ms)

  ● orderTotal › 0 dona — xato

    Received function did not throw

Tests:       1 failed, 4 passed, 5 total`, { 5: { id: 'x' }, 9: { id: 'x' }, 11: { id: 'x' } });
const S10 = mkS(10, [{ v: 'noif' }, { v: 'noif', out: true }, { v: 'lt', out: true }, { v: 'lt', out: true, sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="mk-tag" style={{ color: T.accent, margin: 0 }}>{seg.v === 'noif' ? "1-buzish: throw bor, if yo'q" : '2-buzish: <= 0 o\'rniga < 0'}</div>
      {seg.v === 'noif'
        ? <Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={NOIF_TS} focus={['x']} /></Ide>
        : <CodePanel file={F.ord} wrap lines={LT_TS.slice(0, 3)} focus={['x']} />}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.out && <Term er lines={seg.v === 'noif' ? NOIF_OUT : LT_OUT} focus={['x']} />}
      {seg.sum && <div className="pg-row" style={{ borderColor: T.green }}><span>Tiklandi: if bilan, quantity &lt;= 0</span><span className="v" style={{ fontSize: 13, color: T.green }}>Tests: 5 passed, 5 total</span></div>}
      {seg.sum && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="mk-box" style={{ '--c': T.green }}><h4>Happy testi</h4><p>himoya <b>juda qattiq</b> bo'lsa qizil</p></div>
        <div className="mk-box" style={{ '--c': T.accent }}><h4>Edge testi</h4><p>himoya <b>teshik</b> bo'lsa qizil</p></div>
      </div>}
    </div>
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (target 0 dan: 2-satr = 1)
// ============================================================
const LC11_FIXED = LT_TS.map((l, i) => ({ ...l, id: undefined, n: i + 1, ...(i === 1 ? { gone: true } : {}) }));
LC11_FIXED.splice(2, 0, { h: tsLine("  if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity <= 0) {"), n: 2, neu: true });
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ord} lines={LT_TS.map((l) => ({ ...l, id: undefined }))} target={1}
    tree={{ root: MKCFG.root, files: ORD_FILES, active: F.ord }}
    fixed={LC11_FIXED} fixedExtra={[{ file: "2-satrdagi o'zgarish", lines: [{ h: `${tsLine('quantity < 0')}   →   ${tsLine('quantity <= 0')}` }] }, { file: 'terminal — npm test (haqiqiy)', lines: PASS5.slice(1, 8).concat(PASS5.slice(10)) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — uch buzish
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: "() =>siz — 0 dona testida: expect(orderTotal(10000, 0)).toThrow();", cmds: ['npm test'], exp: "quantity musbat raqam bo'lsin · at orderTotal (order.ts:3:11)" },
  { t: "Boshqa xabar — () => ni qaytaring; matn testida toThrow('narx xato')", cmds: ['npm test'], exp: 'Expected substring · Received message' },
  { t: '< 0 — order.ts: quantity <= 0 → quantity < 0', cmds: ['npm test'], exp: '0 dona — xato · did not throw' },
  { t: 'Tiklash — hammasini qaytaring', cmds: ['npm test'], exp: '5 passed' },
];
const P2_TROUBLE = [
  ['1-qadamda PASS', "o'zgarish boshqa testda qilingan — «0 dona» testidagi () => ni oling"],
  ['2-qadamda PASS', "toThrow() bo'sh qolgan — qavs ichiga matn yozing"],
];
const P2_PROOF = { label: "2-qadamdagi Received message satri", placeholder: "Received message qatorini qo'ying", check: (v) => /Received message:\s*"?quantity musbat raqam/i.test(v), wrong: "Satr «Received message:» bilan boshlanadi va funksiyaning o'z xabarini ko'rsatadi — butun satrni nusxalang" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }
// ============================================================
//  13 · TypeScript: test yuradi, VS Code qizil (jest2-out/02, 03, 05)
// ============================================================
const TS_SPEC = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
  it('matn kelsa', () => {
    expect(orderTotal(10000, 'ikki')).toBe(0);
  });
  it('null kelsa', () => {
    expect(orderTotal(10000, null)).toBe(0);
  });
});`, { 8: { id: 'x' }, 11: { id: 'x' } });
const TS_SPEC_WAVY = TS_SPEC.map((l, i) => (i === 7 || i === 10 ? wavy(l) : l));
const TS_RUN = jt(String.raw`
$ npm test
FAIL src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✕ matn kelsa (2 ms)
    ✓ null kelsa

  ● orderTotal › matn kelsa

    Expected: 0
    Received: NaN

Tests:       1 failed, 2 passed, 3 total`, { 5: { id: 'x' }, 6: { id: 'x' }, 11: { id: 'x' } });
const TSC_OUT = jt(String.raw`
$ npx tsc --noEmit -p tsconfig.json
src/order.spec.ts(8,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/order.spec.ts(11,30): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.`);
const ASANY = ts(String.raw`
  it("matn — xato", () => {
    expect(() => orderTotal(10000, 'ikki' as any)).toThrow("quantity musbat raqam bo'lsin");
  });`, { 2: { id: 'x' } });
ASANY.forEach((l, i) => { l.n = 16 + i; });
const S13 = mkS(13, [{ v: 'code' }, { v: 'run' }, { v: 'tsc', wavy: true }, { v: 'any', sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div className={seg.v === 'any' ? '' : 'pg-two'} style={seg.v === 'any' ? { display: 'grid', gap: 10 } : undefined}>
    {seg.v !== 'any' && <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <Ide files={ORD_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={seg.wavy ? TS_SPEC_WAVY : TS_SPEC} focus={['x']} /></Ide>
      {seg.wavy && <div className="mk-tag" style={{ margin: 0 }}>Qizil to'lqin chiziq — VS Code ko'rinishi maketi; xabar matni — haqiqiy tsc chiqishi</div>}
    </div>}
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'code' && <div className="mk-card"><h5>Funksiya son kutadi</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}><code>orderTotal(price: number, quantity: number)</code> — testda esa <code>'ikki'</code> va <code>null</code>.</div></div>}
      {seg.v === 'run' && <Term er lines={TS_RUN} focus={['x']} />}
      {seg.v === 'run' && <div className="mk-tag" style={{ margin: 0 }}>tsconfig.json: "isolatedModules": true — ts-jest turlarni tekshirmaydi</div>}
      {seg.v === 'tsc' && <Term er title="terminal — tsc (VS Code ko'radigani)" lines={TSC_OUT} />}
      {seg.v === 'any' && <><CodePanel file={F.ordSpec} wrap lines={ASANY} focus={['x']} /><Term lines={PASS5.slice(7, 8)} /><div className="mk-rule">Noto'g'ri turni <b>ataylab</b> sinashda — <code>'ikki' as any</code>: qizil chiziq yo'qoladi, guard bilan test yashil.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  14 · Ikki fayl — test nomlari ko'rinmaydi (jest2-out/11, 15)
// ============================================================
const TWO_OUT = jt(String.raw`
$ npm test
PASS src/order.spec.ts
PASS src/coupon.spec.ts

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total`, { 2: { id: 'f' }, 3: { id: 'f' }, 6: { id: 't' } });
const VERB_OUT = jt(String.raw`
$ npx jest --verbose
PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)
    ✓ 1 dona — eng kichik haqiqiy buyurtma (1 ms)
    ✓ 0 dona — xato (5 ms)
    ✓ manfiy — xato
    ✓ matn — xato (1 ms)

PASS src/coupon.spec.ts
  applyCoupon
    ✓ 100 000 dan 10 % — 90 000
    ✓ chegara 0 % — o'zgarmaydi
    ✓ chegara 100 % — 0
    ✓ 101 % — xato (2 ms)
    ✓ -1 % — xato (1 ms)
    ✓ total matn — xato

Tests:       11 passed, 11 total`, { 1: { id: 'c' }, 19: { id: 't' } });
const S14 = mkS(14, [{ v: 'two', f: ['f'] }, { v: 'verb', f: ['c', 't'] }, { v: 'verb', f: [], sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <Term lines={TWO_OUT} focus={seg.v === 'two' ? seg.f : ['t']} />
      {seg.v === 'two' && <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>O'quvchi</h5><div style={{ fontSize: 14.5 }}>«Testlarim qayoqqa ketdi?»</div></div>}
      {seg.sum && <div className="mk-rule">Nom ko'rinmasa — <b>xato emas</b>: avval jami son, keyin <code>--verbose</code>. FAIL'da qizil test nomi baribir chiqadi.</div>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'verb' && <Term lines={VERB_OUT} focus={seg.f} />}
    </div>
  </div>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — did not throw
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={FAIL_EDGE.slice(7, 12)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Uch xabar — uch sabab (haqiqiy)</div>
      <div className="pg-three">
        <div className="mk-box hl" style={{ '--c': T.accent }}><h4>did not throw</h4><p>xato tashlanmadi — guard yo'q yoki shart teshik</p></div>
        <div className="mk-box" style={{ '--c': T.yellow }}><h4>Received message</h4><p>xato bor, lekin boshqa xabar</p></div>
        <div className="mk-box" style={{ '--c': T.blue }}><h4>funksiya xabari + at orderTotal</h4><p>() =&gt; yozilmagan</p></div>
      </div>
      <Ide files={ORD_FILES} active={F.ord}><CodePanel file={F.ord} wrap lines={ORDER_GUARD} focus={['if']} /></Ide>
    </div>} />;
}

// ============================================================
//  16 · Amaliyot 3 — 'ikki' va as any (jest2-out/02, 03, 05, 14)
// ============================================================
const P3 = mkS(16, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: "Guardni olish — order.ts: if (…) { throw … } satrlarini izohga oling", cmds: [], exp: 'return price * quantity qoldi' },
  { t: "as any'siz — matn testi: expect(orderTotal(10000, 'ikki')).toBe(0);", cmds: ['npm test'], exp: "VS Code: qizil chiziq · terminal: Received: NaN" },
  { t: "as any — 'ikki' as any", cmds: [], exp: "qizil chiziq yo'q" },
  { t: 'Tiklash — guard va toThrow testi', cmds: ['npm test'], exp: '5 passed' },
];
const P3_TROUBLE = [
  ['2-qadamda Received: 0', 'null testini sinadingiz — matn testini oling'],
  ['2-qadamda Test suite failed to run · TS2345', "tsconfig.json da isolatedModules: false — ts-jest turlarni tekshiradi (o'quvchi reposida true); as any yozing"],
];
const P3_PROOF = { label: '2-qadamdagi Received qiymati', placeholder: 'Received yonidagini yozing', check: (v) => /^\s*NaN\s*$/i.test(v), wrong: "Received — funksiya qaytargan qiymat: 10 000 ni so'zga ko'paytirsak, son chiqadimi?" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  17 · applyCoupon: chegaraning ikki tomoni (jest2-out/11, 12)
// ============================================================
const CUP_SRC = (op) => String.raw`
export function applyCoupon(total: number, percent: number): number {
  if (typeof total !== 'number' || Number.isNaN(total)) {
    throw new Error('total son bo\'lsin');
  }
  if (percent < 0 || percent ${op} 100) {
    throw new Error("percent 0 dan 100 gacha bo'lsin");
  }
  return total - (total * percent) / 100;
}`;
const CUP_TS = ts(CUP_SRC('>'), { 2: { id: 'g1' }, 3: { id: 'g1' }, 5: { id: 'g2' }, 6: { id: 'g2' }, 8: { id: 'r' } });
const CUP_BAD = ts(CUP_SRC('>='), { 5: { id: 'x' } });
const CUP_SPEC = ts(String.raw`
import { applyCoupon } from './coupon';

describe('applyCoupon', () => {
  it('100 000 dan 10 % — 90 000', () => {
    expect(applyCoupon(100000, 10)).toBe(90000);
  });
  it('chegara 0 % — o\'zgarmaydi', () => {
    expect(applyCoupon(100000, 0)).toBe(100000);
  });
  it('chegara 100 % — 0', () => {
    expect(applyCoupon(100000, 100)).toBe(0);
  });
  it('101 % — xato', () => {
    expect(() => applyCoupon(100000, 101)).toThrow();
  });
  it('-1 % — xato', () => {
    expect(() => applyCoupon(100000, -1)).toThrow();
  });
  it("total matn — xato", () => {
    expect(() => applyCoupon('ikki' as any, 10)).toThrow();
  });
});`, { 7: { id: 'in' }, 8: { id: 'in' }, 10: { id: 'in' }, 11: { id: 'in' }, 13: { id: 'out' }, 14: { id: 'out' }, 16: { id: 'out' }, 17: { id: 'out' } });
const CUP_FAIL = jt(String.raw`
$ npm test
PASS src/order.spec.ts
FAIL src/coupon.spec.ts
  ● applyCoupon › chegara 100 % — 0

    percent 0 dan 100 gacha bo'lsin

    > 6 |     throw new Error("percent 0 dan 100 gacha bo'lsin");
        |           ^

      at applyCoupon (coupon.ts:6:11)
      at Object.<anonymous> (coupon.spec.ts:11:23)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 10 passed, 11 total`, { 4: { id: 'x' }, 6: { id: 'x' }, 15: { id: 'x' } });
const LINE17 = [['0 %', 'ishlaydi', 'in'], ['100 %', 'ishlaydi', 'in'], ['−1 %', 'xato', 'out'], ['101 %', 'xato', 'out']];
const S17 = mkS(17, [{ v: 'code', file: F.cup }, { v: 'pass', file: F.cupSpec }, { v: 'fail', file: F.cup }, { v: 'line', file: F.cupSpec, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={CUP_FILES} active={seg.file} fresh={[F.cup, F.cupSpec]}>
      {seg.file === F.cup
        ? <CodePanel file={F.cup} wrap lines={seg.v === 'fail' ? CUP_BAD : CUP_TS} focus={seg.v === 'fail' ? ['x'] : ['g1', 'g2']} />
        : <CodePanel file={F.cupSpec} wrap lines={CUP_SPEC} />}
    </Ide></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'pass' && <Term lines={TWO_OUT} focus={['t']} />}
      {seg.v === 'fail' && <Term er lines={CUP_FAIL} focus={['x']} />}
      {seg.v === 'line' && <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">Chegaraning ikki tomoni</div>
        <div className="j2-line">{LINE17.map(([v, d, k]) => <div key={v} className={k}>{v}<small>{d}</small></div>)}</div>
      </div>}
      {seg.sum && <div className="mk-rule">O'quvchi vazifasida shu <b>to'rt qiymat</b> bormi — 0, 100, −1, 101.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  18 · Tekshiruv 4 — >= 100
// ============================================================
function Screen18(p) {
  const m = MDT[18];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file={F.cup} wrap lines={CUP_BAD} focus={['x']} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Term er lines={CUP_FAIL} focus={['x']} />
    </div>} />;
}

// ============================================================
//  19 · Amaliyot 4 — applyCoupon
// ============================================================
const P4 = mkS(19, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P4_STEPS = [
  { t: "Funksiya — src/coupon.ts (namuna — o'zingiz yozing)", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Testlar — src/coupon.spec.ts, 6 ta it', cmds: ['npm test'], exp: 'PASS src/coupon.spec.ts' },
  { t: 'Buzish — percent > 100 → percent >= 100', cmds: ['npm test'], exp: '1 failed' },
  { t: "O'qish va tiklash — ● satr, > ni qaytaring", cmds: ['npm test'], exp: 'hammasi yashil' },
];
const P4_CODE = [{ file: F.cup, step: 0, lines: CUP_TS, copy: false }, { file: F.cupSpec, step: 1, lines: CUP_SPEC, copy: false }];
const P4_TROUBLE = [
  ['3-qadamda hammasi yashil', "100 % testi yo'q — chegaraning ichki tomonini qo'shing"],
  ["90000 kutilgan joyda boshqa son", 'formula: total - (total * percent) / 100'],
  ["'ikki' qatorida qizil chiziq", "'ikki' as any (13-ekran)"],
];
const P4_PROOF = { label: 'Qizil testning nomi (● satridan)', placeholder: '● satrdagi test nomini yozing', check: (v) => /100\s?%/.test(v), wrong: "● satridagi › belgisidan keyingi nomni yozing — u qaysi foizni sinaydi?" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} code={P4_CODE} tree={CUP_FILES} />; }
// ============================================================
//  20 · m4b-03 xaritasi (EdgeCasesTestLesson.jsx — SCREEN_META 21)
// ============================================================
const MAP20 = [
  { t: 'Kirish', s: 's0–s1', d: "g'alati buyurtmalar · reja (4 qadam)", m: '' },
  { t: 'Edge', s: 's2–s5', d: "happy path · edge (0, manfiy, 1) · test · noto'g'ri ma'lumot (NaN, null)", m: 'yashirin buzilish natijalari (3-ekran)' },
  { t: 'Guard', s: 's6–s9', d: "throw · o'rash () => · test · guard yig'ish (if → throw → return)", m: "() =>siz nima bo'ladi (8-ekran) · shartsiz throw (10-ekran)" },
  { t: 'Mustahkamlash', s: 's10–s15', d: 'testlar va haqiqiy edge testlarini tanlash', m: "toThrow('xabar') (9-ekran) · < 0 (11-ekran)" },
  { t: 'Yakun', s: 's16–s17', d: 'boundary etalon · amaliyot · kartochkalar · uyga vazifa applyCoupon', m: "TypeScript tuzog'i (13-ekran) · chegaraning ikki tomoni (17-ekran)" },
];
const S20 = mkS(20, [{ hl: [] }, { hl: [2] }, { hl: [4] }, { hl: [2, 4], sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP20.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.sum && <div className="mk-rule">Vaqt (taklif): 90 daqiqaning <b>25 tasi</b> — guard va o'rashga. Uyga vazifada to'rt qiymat: <b>0, 100, −1, 101</b>.</div>}
  </div>} />;
}

// ============================================================
//  21 · O'quvchi darsidagi so'zlar
// ============================================================
const DICT21 = [
  ["shumtaka mijoz · g'alati buyurtma", "edge case, noto'g'ri kirish"],
  ["«hech kim sezmaydi» (NaN kartochkasi)", 'xatosiz noto\'g\'ri natija (0, −10000, NaN)'],
  ["guard · 🚧 shart · 🧯 xato tashlash · ✅ to'g'ri hisob", 'if → throw new Error → return'],
  ["o'rab berish", 'expect(() => f()).toThrow()'],
  ['happy path', 'oddiy, kutilgan kirish'],
];
const S21 = mkS(21, [{ rows: [0] }, { rows: [1, 2] }, { rows: [3], sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama / kod</th></tr></thead><tbody>
      {DICT21.map(([a, b], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td></tr>)}
    </tbody></table>
    {seg.sum && <div style={{ marginTop: 12, display: 'grid', gap: 8 }}><CodePanel file={F.ordSpec} wrap lines={WRAP_OK} focus={['x']} /><div className="mk-rule">«O'rab berish, <b>ya'ni () =&gt;</b>» — va shu satrni ko'rsating. Terminal so'zlari inglizcha qoladi: did not throw, Received message.</div></div>}
  </div>} />;
}

// ============================================================
//  22 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const STUMBLE22 = [
  ["Himoya yo'q", 'Received function did not throw', 'guard'],
  ["() => yo'q", 'test funksiya xatosi bilan qulaydi', 'expect(() => …)'],
  ['Boshqa xabar', 'Expected substring / Received message', 'xabarni moslang'],
  ['Happy qizil', 'guard shartsiz yoki juda qattiq', 'if sharti'],
  ["'ikki' qizil chiziq", 'VS Code TS2345, test esa yuradi', 'as any'],
  ["Nomlar yo'q", 'ikki fayl', 'jami son · --verbose'],
];
const QA22 = [
  ["«Nega xato tashlaymiz, 0 qaytarsa bo'lmaydimi?»", "0 — yashirin buzilish (bepul buyurtma); xato darhol ko'rinadi va keyingi qadamni to'xtatadi."],
  ["«toThrow() va toThrow('…') farqi?»", "biri «xato bo'ldimi», ikkinchisi «qaysi xato»."],
  ['«as any yomon emasmi?»', 'kodda — ha; testda ataylab noto\'g\'ri tur berish uchun — joiz.'],
  ['«Hamma funksiyaga guard kerakmi?»', "foydalanuvchidan yoki tashqaridan ma'lumot oladigan funksiyaga — ha."],
];
const S22 = mkS(22, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen22(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE22.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>xabarni o'quvchi bilan birga o'qing</b>: har xabar boshqa sababni aytadi.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA22.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
// ============================================================
//  23 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[23].final;
function Screen23(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: yashirin buzilish, guard, o'rash va chegaralar. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4b-03 dagi guard, o'rash va sinfdagi tuzoqlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  24 · Yakun (M13)
// ============================================================
const SUM24 = [
  { k: 'edge', t: "Happy path va edge case: 0, manfiy, 1, so'z, null; himoyasiz funksiya — yashirin buzilish (0, −10000, NaN, null → 0)", st: ['fn'] },
  { k: 'guard', t: "Guard: if → throw new Error → return; 1 dona testi himoya to'g'ri buyurtmani to'smaganini ko'rsatadi", st: ['fn', 'res'] },
  { k: 'wrap', t: "expect(() => …).toThrow(); () =>siz test funksiya xatosi bilan qulaydi; toThrow('xabar') — qaysi xato", st: ['spec', 'res'] },
  { k: 'dnt', t: "did not throw — himoya yo'q yoki shart teshik (< 0); shartsiz throw — happy qizil", st: ['fn', 'res'] },
  { k: 'ts', t: "TypeScript: npm test yuradi, VS Code qizil — 'ikki' as any; ikki fayl — nomlar --verbose bilan", st: ['spec', 'run'] },
  { k: 'edge2', t: "Chegaraning ikki tomoni: 0 va 100 — ishlaydi, −1 va 101 — xato", st: ['spec', 'res'] },
];
const STATIONS24 = [['fn', 'order.ts · guard', T.blue], ['spec', 'order.spec.ts · toThrow', T.purple], ['run', 'npm test', T.ink], ['res', 'PASS / FAIL', T.green]];
function SummaryMap24({ hl }) {
  const cur = SUM24.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — noto'g'ri kirish yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS24.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK24 = [
  { t: "Guard: Jest-1 dagi discount.ts (yoki o'z funksiyangiz) — tur va chegara, aniq xabar", c: [] },
  { t: "Testlar: ichki va tashqi chegara + toThrow('xabar') + '…' as any", c: ['npm test'] },
  { t: "Buzish: () => ni olib tashlang → qulash → tiklang", c: ['npm test'] },
  { t: 'Kupon: src/coupon.ts + src/coupon.spec.ts (6 test)', c: ['npm test'] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "edge testlar"', 'git push'] },
];
const CHEATSHEET24 = `# Jest-2 — mentor eslatmasi (edge cases va error path)
## Happy path va edge case
happy: orderTotal(10000, 2) → 20000 · edge: 0, -1, 1 (eng kichik haqiqiy), 'ikki', null
Himoyasiz price * quantity: 0 → 0 · -1 → -10000 · 'ikki' → NaN · null → 0 — hammasi XATOSIZ (yashirin buzilish)
## Guard
if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity <= 0) { throw new Error("quantity musbat raqam bo'lsin"); }
return price * quantity;  — tartib: shart → xato → hisob; 1 dona testi ham shart
## Xatoni sinash
expect(() => orderTotal(10000, 0)).toThrow();  · xabar bilan: toThrow("quantity musbat raqam bo'lsin")
() =>siz: expect(orderTotal(10000, 0)).toThrow() → test funksiya xatosi bilan qulaydi (at orderTotal (order.ts:3:11))
## Xabarlar
Received function did not throw — guard yo'q yoki shart teshik (< 0 o'rniga <= 0)
Expected substring / Received message — xato bor, boshqa xabar
Happy testlar qizil — guard shartsiz (if yo'q) yoki juda qattiq (<= 1)
## TypeScript tuzog'i (o'quvchi reposi)
tsconfig: isolatedModules: true → npm test turlarni tekshirmaydi: orderTotal(10000, 'ikki') yuradi → Received: NaN
VS Code / tsc: TS2345 — qizil chiziq → testda 'ikki' as any
Ikki test fayli — nomlar chiqmaydi: jami son yoki npx jest --verbose; faqat order: npm test -- order
## Chegaraning ikki tomoni (applyCoupon)
if (percent < 0 || percent > 100) throw … · ichkari: 0 %, 100 % ishlaydi · tashqari: -1 %, 101 % xato
> o'rniga >= → faqat «chegara 100 %» qizil
## O'quvchi darsidagi so'zlar
shumtaka mijoz / g'alati buyurtma = edge case · «hech kim sezmaydi» = xatosiz noto'g'ri natija · guard (🚧 shart · 🧯 xato · ✅ hisob) · o'rab berish = () =>
## Sizning uyga vazifangiz
o'z funksiyangizga guard + ikki tomonli chegara testlari + toThrow('xabar') + as any + applyCoupon (6 test) → GitHub → repo linki platformadagi uyga vazifaga`;
const s24Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Happy path va edge case; himoyasiz funksiya — <b>yashirin buzilish</b>", "Birinchi: bitta oddiy holat va bir nechta chegara holati. Himoyasiz funksiya noto'g'ri kirishda xato bermaydi: nol, minus o'n ming, NaN.", { hl: 'edge' }),
  sg('b2', "Guard: <b>shart, xato, hisob</b> — va 1 dona testi", "Ikkinchi: guard funksiya boshida. Shart, xato tashlash, keyin hisob. Bir dona testi himoya to'g'ri buyurtmani to'smaganini ko'rsatadi.", { hl: 'guard' }),
  sg('b3', "Xato kutilsa — funksiya <b>() =&gt; ichida</b>; xabarni ham tekshiring", "Uchinchi: xato kutilsa, funksiya strelka ichiga o'raladi. O'ralmasa, test funksiyaning o'z xatosi bilan qulaydi. Xabar bilan to throw qaysi xato ekanini tekshiradi.", { hl: 'wrap' }),
  sg('b4', "<b>did not throw</b> — himoya yo'q yoki shart teshik", "To'rtinchi: did not throw, himoya yo'q yoki shart qiymatni o'tkazib yubordi. Oddiy holat qizil bo'lsa, himoya juda qattiq.", { hl: 'dnt' }),
  sg('b5', "TypeScript: test yuradi, VS Code qizil — <b>as any</b>", "Beshinchi: o'quvchi reposida npm test turlarni tekshirmaydi, VS Code esa qizil chizadi. Ataylab noto'g'ri turda as any. Ikki faylda nomlar uchun verbose.", { hl: 'ts' }),
  sg('b6', "Chegaraning <b>ikki tomoni</b>: 0 va 100 ishlaydi, −1 va 101 xato", "Oltinchi: chegaraning ikki tomonini sinang. Ichkarisi ishlaydi, nol va yuz. Tashqarisi xato beradi, minus bir va yuz bir.", { hl: 'edge2' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z funksiyangizga guard va ikki tomonli testlar", "Uyga vazifa: Jest birinchi darsidagi o'z funksiyangizga himoya qo'ying. Noto'g'ri tur va chegaradan tashqari qiymatlar xato bersin, xabar aniq bo'lsin. Har chegara uchun ikki tomonli test. Bir marta strelkani olib tashlab qulashni ko'ring.", { hl: 'hw' }),
  sg('hw2', "Apply coupon testlarini qo'shing va <b>repo linkini platformaga</b> qo'ying", "Apply coupon testlarini ham qo'shing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: guard, toThrow, xabarlar va tuzoqlar — bir sahifada", "Pastda bir sahifalik eslatma: guard namunasi, xatoni sinash, uch xabar va ularning sababi, TypeScript tuzog'i va chegaralar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen24(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET24;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jest-2-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s24Segments(passed), [passed]);
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
            <SummaryMap24 hl={hl} />
            <div className="mk-plan">{SUM24.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK24.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> guard funksiya boshida · chegaraning ikki tomoni · () =&gt; bilan toThrow · matn holati as any bilan.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>CI/CD nima va nega</div><div style={{ fontSize: 13.5, color: T.ink2 }}>testlar har push'da o'zi yursin</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · Jest</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~19 daqiqa · to'rt amaliyot ~40 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Jest-1 mentor darsi o'tilgan · o'quvchi reposi (IntroNestArxitechture) va Jest-1 dagi order fayllari · Node.js 20+ · VS Code", "Loyiha: o'quvchi reposi — misol o'quvchi m4b-03 dagi orderTotal (0, manfiy, so'z) va uyga vazifa applyCoupon"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP1, Screen8, Screen9, Screen10, Screen11, ScreenP2, Screen13, Screen14, Screen15, ScreenP3, Screen17, Screen18, ScreenP4, Screen20, Screen21, Screen22, Screen23, Screen24];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function JestEdgeMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
