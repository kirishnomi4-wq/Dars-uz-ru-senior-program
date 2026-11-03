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
//  JEST-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-matn.py (manba: 10-Jest1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "Kodni o'zgartirdingiz. Hisob hali ham to'g'rimi — buni test aytadi.",
  "seg": [
   [
    "a",
    "Kod o'zgarganda eski hisoblar buzilmaganini har safar <b>qo'lda tekshirib bo'lmaydi</b>",
    "Assalomu alaykum. Loyihada kod har kuni o'zgaradi. Har o'zgarishdan keyin eski hisoblar buzilmaganini qo'lda tekshirib bo'lmaydi: beshta hisob bo'lsa ham, ellikta bo'lsa ham. Bu ishni kompyuterga topshirish mumkin. Bu unit-test deyiladi, uni Jest ishga tushiradi."
   ],
   [
    "b",
    "Bugun o'quvchi reposida <b>birinchi testni yozasiz</b> va natijasini o'qiysiz",
    "Bugun Nest darslaridagi o'quvchi reposida birinchi testni yozasiz. Misol o'quvchi darsidagi aynan funksiya: KitobShop'dagi buyurtma summasi. Test yashil bo'lganda va qizil bo'lganda terminal nima deyishini o'qishni o'rganasiz."
   ],
   [
    "c",
    "Testni ataylab buzamiz: <b>yolg'on yashil</b> va <b>noto'g'ri qizil</b> — ikkalasini tanib olasiz",
    "Keyin testni ataylab buzamiz. Ba'zi test hech narsani tekshirmasa ham yashil bo'ladi, ba'zisi kod to'g'ri bo'lsa ham qizil. O'quvchi AI'dan test so'raydi, shuning uchun bu ikkisini tanish sizga albatta kerak."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Oxirida sinfdagi sozlash tuzoqlarini va o'quvchi darsini qanday o'tishni ko'ramiz. Dars olti bosqichdan iborat, to'rtta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · unit-test",
  "title": "Funksiya kirishni oladi, natija qaytaradi — test shu juftni tekshiradi",
  "seg": [
   [
    "a",
    "O'quvchi darsi funksiyani <b>mashina</b> deb tushuntiradi: kirish beriladi, natija chiqadi",
    "Testga o'tishdan oldin funksiyaga boshqacha qaraymiz. O'quvchi darsi uni mashina deb tushuntiradi: kirish berasiz, u natija qaytaradi. orderTotal'ga narx va soni beriladi, u summani qaytaradi. Masalan, o'n ming va ikkini bersak, natija yigirma ming bo'ladi."
   ],
   [
    "b",
    "Unit-test — shu juftni yozib qo'yish: <b>«shu kirishga aynan shu chiqish»</b>",
    "Unit-test shu juftni yozib qo'yadi: shu kirishga aynan shu chiqish bo'lishi kerak. Bir marta yoziladi va har safar bitta buyruq bilan tekshiriladi. Unit bitta bo'lak degani: test bitta funksiyani bazasiz va serversiz sinaydi."
   ],
   [
    "c",
    "Funksiyaning o'zi uch satr: <b><code>src/order.ts</code></b> — narx ko'paytirish soni",
    "Funksiyaning o'zi uch satr, o'quvchi reposida src papkasidagi order ts faylida turadi. U narxni soniga ko'paytiradi. Hozir bu oddiy, lekin keyinroq ichiga chegirma yoki soliq qo'shilsa, test eski hisoblar buzilmaganini aytadi."
   ],
   [
    "d",
    "Xulosa: unit-test — bitta funksiya, bitta kirish, <b>bitta kutilgan natija</b>",
    "Xulosa: unit-test bitta funksiyani alohida sinaydi. Unda uch narsa bor: kirish, kutilgan natija va ularni solishtiradigan bitta tasdiq. Kutilgan natijani bugun etalon deb ataymiz, o'quvchi darsida u etalon kartochkasi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · unit-test",
  "title": "package.jsondagi jest bo'limi: src ichida, nomi .spec.ts",
  "seg": [
   [
    "a",
    "Nest loyihasi Jest bilan birga yaratiladi — o'quvchi reposida u <b>allaqachon sozlangan</b>",
    "Avval yaxshi xabar: Nest loyihasi Jest bilan birga yaratiladi. O'quvchi reposining package json faylida test buyrug'i ham, jest bo'limi ham tayyor. Hech narsa o'rnatish shart emas, npm install yetarli."
   ],
   [
    "b",
    "Uch satr muhim: <code>rootDir</code> — <b><code>src</code></b>, <code>testRegex</code> — <b><code>.spec.ts</code></b>, <code>transform</code> — <code>ts-jest</code>",
    "Jest bo'limida uchta satr muhim. Birinchisi root dir src: Jest faqat src papkasi ichini qaraydi. Ikkinchisi test regex: fayl nomi spec ts bilan tugashi kerak. Uchinchisi transform ts jest: TypeScript faylni Jest tushunadigan ko'rinishga o'tkazadi."
   ],
   [
    "c",
    "Hozir <code>npm test</code> — <b><code>No tests found</code></b>: repoda hali birorta test yo'q",
    "Hozir npm test qilsak, Jest no tests found deydi, ya'ni test topilmadi, chiqish kodi esa bir. Jest o'ttiz yettita faylni ko'rdi, lekin ularning hech biri spec ts emas. Bu xato emas: o'quvchi birinchi testini yozmaguncha shunday bo'ladi."
   ],
   [
    "d",
    "Xulosa: test fayli — <b><code>src/</code> ichida</b> va nomi <code>.spec.ts</code> bilan tugaydi",
    "Xulosa: o'quvchi reposida Jest tayyor, faqat ikki shart bor. Test fayli src papkasi ichida turadi va nomi spec ts bilan tugaydi. Bu ikki shartdan biri buzilsa, Jest testni ko'rmaydi. Sinfdagi eng ko'p savol aynan shu."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "O'quvchi order.spec.ts yozdi va npm test qildi — No tests found. Birinchi nimani tekshirasiz?",
  "q": "Jest sozlamasini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi order spec ts faylini yozdi va npm test qildi, javob esa no tests found bo'ldi. Fayl ichidagi kod to'g'ri. Birinchi nimani tekshirasiz? Variantni tanlang.",
  "ok": "To'g'ri, birinchi navbatda faylning joyini tekshirasiz. Sinab ko'rdik: xuddi shu fayl loyiha ildizida tursa, Jest uni ko'rmaydi va no tests found deydi, chunki root dir src. Fayl src ichiga ko'chirilsa, test topiladi. Nomi ham muhim: order test ts bo'lsa ham topilmaydi. Demak, no tests found chiqsa, avval test fayli src ichida turganini va nomi spec ts bilan tugashini tekshiring.",
  "okShort": "<code>rootDir: src</code> — <code>src/</code>dan tashqaridagi fayl ko'rinmaydi. Nomi ham: <code>.test.ts</code> emas, <code>.spec.ts</code>.",
  "hint": "Xabar «test topilmadi» deyapti, «xato» emas. Jest testni qayerdan va qaysi nom bilan qidiradi?",
  "correct": 2,
  "opts": [
   "npm install qayta qilinsin",
   "expect to'g'ri yozilganmi",
   "Fayl qayerda turibdi — src/ ichidami",
   "Jest versiyasi"
  ],
  "wrong": {
   "0": "Jest o'rnatilmagan bo'lsa jest: not found chiqardi, No tests found emas.",
   "1": "expect xato bo'lsa test topilib, FAIL bo'lardi.",
   "3": "Versiya topish qoidasiga ta'sir qilmaydi — qoida package.jsonda."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "order.spec.ts — to'rt qism: import, describe, it, expect",
  "seg": [
   [
    "a",
    "Test fayli <b>funksiya yonida</b>: <code>order.ts</code> — <code>order.spec.ts</code>, ikkalasi <code>src/</code> ichida",
    "Test fayli funksiyaning yonida turadi: order ts yonida order spec ts. Birinchi qatordagi import funksiyani test fayliga olib kiradi. Jest bu faylni nomidan topadi va ichidagi testlarni ishga tushiradi."
   ],
   [
    "b",
    "<code>describe</code> — <b>guruh</b>: bitta funksiyaning testlari bir joyda, nomi bilan",
    "Describe bitta funksiyaning hamma testlarini guruhlaydi. Uning birinchi argumenti guruh nomi: orderTotal. Natijada shu nom ko'rinadi, shuning uchun qaysi funksiya xato berganini darhol bilasiz."
   ],
   [
    "c",
    "<code>it</code> — <b>bitta holat</b>, nomi oddiy gap bilan: «2 kitob narxini hisoblaydi»",
    "It bitta holatni sinaydi. Nomi oddiy gap bilan yoziladi: ikki kitob narxini hisoblaydi. Test qizil bo'lganda aynan shu gap chiqadi, shuning uchun nom tushunarli bo'lishi kerak."
   ],
   [
    "d",
    "<code>expect(result).toBe(20000)</code> — <b>tasdiq</b>: natija etalonga teng bo'lishi shart",
    "Eng muhim qator shu: expect, result, to be yigirma ming. Bu tasdiq: natija aynan yigirma ming bo'lishi kerak. Tepadagi qator funksiyani chaqiradi, bu qator tekshiradi. Tayyorlash, chaqirish, tekshirish: o'quvchi darsida bu uch qadam deyiladi."
   ],
   [
    "e",
    "Xulosa: <code>describe</code> — kim sinaladi, <code>it</code> — qaysi holat, <b><code>expect</code> — nima kutiladi</b>",
    "Xulosa: describe qaysi funksiya sinalayotganini aytadi, it qaysi holatni, expect esa nima kutilayotganini. Testda haqiqatan tekshiradigan yagona qator expect. Uchinchi bosqichda ko'rasiz: expect'ni unutgan test hech narsani tekshirmaydi."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "PASS src/order.spec.ts — fayl, guruh, holat va jami",
  "seg": [
   [
    "a",
    "<code>npm test</code> — <code>package.json</code>dagi <code>jest</code> buyrug'i: <b>fayl topildi va yurdi</b>",
    "Testni yozdik, endi npm test buyrug'ini beramiz. Bu package json'dagi jest buyrug'ini ishga tushiradi. Birinchi yashil satrda PASS va fayl yo'li turibdi: src order spec ts. Fayl topildi va undagi hamma test o'tdi."
   ],
   [
    "b",
    "Ostida guruh nomi va holat: <code>orderTotal</code> → <b><code>✓ 2 kitob narxini hisoblaydi</code></b>",
    "Uning ostida describe nomi, orderTotal, yozilgan, undan pastda esa belgi bilan it nomi: ikki kitob narxini hisoblaydi, ikki millisekundda. Nomlar aynan siz yozgan gaplar, shuning uchun ular tushunarli yozilishi kerak."
   ],
   [
    "c",
    "Pastda jami: <code>Test Suites</code> — fayllar, <code>Tests</code> — <b><code>it</code>lar soni</b>",
    "Eng pastda jami turadi. Test suites fayllar sonini aytadi: bitta fayl, u o'tdi. Tests esa it'lar sonini aytadi: bitta. Testlar ko'paygach, sinfda o'quvchi bilan shu ikki satrga qaraysiz: nechta o'tdi, nechta yiqildi."
   ],
   [
    "d",
    "Xulosa: PASS — fayl va holatlar o'tdi; <code>Tests:</code> satri — <b>nechta <code>it</code> tekshirildi</b>",
    "Xulosa: PASS fayl va undagi hamma holat o'tganini bildiradi. Tests satri nechta it tekshirilganini aytadi. Lekin diqqat: PASS faqat expect'lar to'g'ri bo'lsa ma'noli. Buni uchinchi bosqichda isbotlaymiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "O'quvchi reposida order.ts va order.spec.ts",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi reposida birinchi testni yozib, <b>yashil PASS</b>'ni ko'rasiz",
    "Endi navbat sizga. O'quvchi reposida birinchi testni yozasiz. Nest darsidagi repo sizda bo'lsa, o'shani oching; bo'lmasa clone va npm install qiling. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>npm test</code> — avval <b><code>No tests found</code></b>, keyin <code>src/order.ts</code>",
    "Birinchi qadamda hech narsa yozmasdan npm test qiling va no tests found chiqishini ko'ring. Ikkinchisida src papkasida order ts faylini ochib, uch satrli funksiyani yozing."
   ],
   [
    "c",
    "3–4-qadam: <code>src/order.spec.ts</code> va <code>npm test</code>; isbot — <b><code>Tests:</code> satri</b>",
    "Uchinchi qadamda uning yonida order spec ts faylini oching va kodni nusxalamasdan o'zingiz yozing. To'rtinchisida npm test qiling. Isbot maydoniga natijadagi Tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi reposida sizning birinchi testingiz bor va siz PASS natijasini o'qiy olasiz."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "* o'rniga + — Expected: 20000, Received: 10002",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi tajriba: ko'paytirish o'rniga qo'shish — <b>test buni tutadimi?</b>",
    "O'quvchi darsidagi tajribani qilamiz: funksiyada ko'paytirish o'rniga xato bilan qo'shish yozildi. Kod ishlaydi, xato bermaydi, lekin natija noto'g'ri. npm test buni tutadimi?"
   ],
   [
    "b",
    "<code>FAIL</code> va <code>●</code> satri: qaysi fayl, qaysi guruh va <b>qaysi holat yiqildi</b>",
    "Test buni tutdi: qizil FAIL chiqdi. Undan pastda nuqta bilan boshlangan satr bor: orderTotal, strelka, ikki kitob narxini hisoblaydi. U qaysi guruh va qaysi holat yiqilganini aytadi. Nomlar tushunarli bo'lsa, faylni ochmasdan ham nima buzilganini bilasiz."
   ],
   [
    "c",
    "<code>Expected</code> — etalon, <code>Received</code> — funksiya qaytargani: <b>20000 kutildi, 10002 keldi</b>",
    "Endi eng muhim ikki satr. Expected, ya'ni kutilgan qiymat yigirma ming: bu siz yozgan etalon. Received, ya'ni olingan qiymat o'n ming ikki: buni funksiya qaytardi, chunki o'n mingga ikki qo'shildi. Farqni ko'rib, xato qayerdaligini taxmin qilasiz."
   ],
   [
    "d",
    "<code>&gt;</code> belgisi va <code>order.spec.ts:6:20</code> — testdagi <b>qaysi satr yiqilganini</b> ko'rsatadi",
    "Pastda test faylining bo'lagi ko'rinadi, strelka oltinchi satrni, ya'ni expect'ni ko'rsatadi. Eng oxirida fayl, satr va ustun yozilgan: order spec ts, olti, yigirma. Diqqat: bu test yiqilgan joy, xato esa funksiyada, order ts'da. Funksiyada yana ko'paytirishni yozamiz va test yashil bo'ladi."
   ],
   [
    "e",
    "Xulosa: <b>FAIL o'qish tartibi</b> — <code>●</code> satr, <code>Expected</code>/<code>Received</code>, keyin funksiyaning o'zi",
    "Xulosa: FAIL'ni shu tartibda o'qing. Avval nuqtali satrdan qaysi holat yiqilganini o'qing. Keyin expected va received'dan nima kutilgani va nima kelganini ko'ring. Oxirida funksiyani oching. Sinfda o'quvchiga javobni aytmang, shu uch qadamni birga o'qing."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "toBe(10002) — Expected: 10002, Received: 20000: xato testning o'zida",
  "seg": [
   [
    "a",
    "Endi aksincha: funksiya to'g'ri, lekin <b>etalon xato yozildi</b> — 10002",
    "Endi aksincha: funksiya to'g'ri, unda ko'paytirish turibdi. Lekin testda etalon xato yozildi: o'n ming ikki. Bu o'quvchi darsidagi burilish: robot etalonga ishonadi."
   ],
   [
    "b",
    "FAIL: <code>Expected: 10002</code>, <code>Received: 20000</code> — o'rinlari 8-ekrandagiga <b>teskari</b>",
    "Natija yana qizil. Lekin qarang: expected o'n ming ikki, received yigirma ming. Bu sakkizinchi ekrandagiga teskari. Funksiya to'g'ri hisobladi, test noto'g'ri narsani kutdi."
   ],
   [
    "c",
    "Qizil test har doim <b>kod xato degani emas</b>: avval etalonni qo'lda tekshiring",
    "Demak qizil test har doim kod xato degani emas. Avval etalonni qo'lda hisoblang: o'n ming ko'paytirish ikki, yigirma ming. Etalon xato bo'lsa, testni tuzatasiz, kodni emas. Aks holda o'quvchi to'g'ri kodni buzib qo'yadi."
   ],
   [
    "d",
    "Xulosa: FAIL'da — <b>kim xato</b>: funksiyami yoki etalonmi? Etalonni qo'lda hisoblang",
    "Xulosa: FAIL chiqqanda birinchi savol: kim xato, funksiyami yoki etalonmi. Etalonni qo'lda hisoblang. Etalon to'g'ri bo'lsa, funksiyani tuzating. Noto'g'ri bo'lsa, testni tuzating."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "console.log bor, expect yo'q — test hech narsani tekshirmay yashil bo'ldi",
  "seg": [
   [
    "a",
    "Eng xavfli test — <code>expect</code>siz: natija chiqariladi, lekin <b>solishtirilmaydi</b>",
    "Endi eng xavfli holat. Testda expect o'rniga console log yozildi: natija ekranga chiqadi, lekin hech narsa bilan solishtirilmaydi. AI ham, o'quvchi ham buni ko'p qiladi."
   ],
   [
    "b",
    "Natija: <code>console.log 20000</code> va yashil PASS — test <b>hech narsani tekshirmadi</b>",
    "Natijada terminalga console log orqali yigirma ming chiqdi va yashil PASS turibdi. Ikki kitob narxini hisoblaydi degan holat ham tasdiq belgisi bilan. Lekin bu test hech narsani tekshirmadi. Funksiya bir million qaytarsa ham yashil bo'lardi."
   ],
   [
    "c",
    "Jest qoidasi: <code>it</code> ichida xato chiqmasa — holat o'tdi; tekshiruvni <b>faqat <code>expect</code></b> qiladi",
    "Nega yashil? Jest uchun qoida oddiy: it ichida xato chiqmasa, holat o'tdi. Xato chiqaradigan narsa faqat expect: natija etalonga teng bo'lmasa, u FAIL beradi. Expect yo'q bo'lsa, yiqilish ham yo'q."
   ],
   [
    "d",
    "Xulosa: har <code>it</code>da kamida bitta <code>expect</code> — aks holda <b>PASS yolg'on</b>",
    "Xulosa: har it ichida kamida bitta expect bo'lishi shart. Sinfda yashil natijaga ishonishdan oldin it ichiga qarang: expect bormi? O'quvchi darsida buni yolg'on test deyishadi."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu test doim yashil — hech narsani tekshirmaydi",
  "q": "Yolg'on testni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Qoidani eslang: test natijani etalon bilan solishtirishi kerak. Bu testda solishtirish yo'q, u doim yashil. Tekshiruv o'rnida turgan satrni bosing.",
  "ok": "To'g'ri. Oltinchi satr console log: natijani faqat chiqaradi. Uning o'rnida expect, result, to be yigirma ming bo'lishi kerak. Ekranda tuzatilgan holat: endi funksiya buzilsa, test qizil bo'ladi. Demak, har it ichida natijani etalon bilan solishtiradigan expect bo'lishi shart.",
  "okShort": "6-satr: <code>console.log</code> faqat chiqaradi. O'rniga <code>expect(result).toBe(20000)</code>.",
  "hint": "Import, describe va funksiyani chaqirish — kerakli qismlar. Natija bilan nima qilinayotganiga qarang: solishtiriladimi yoki faqat chiqariladimi?",
  "task": "Qoida: test natijani etalon bilan solishtirishi kerak — <code>expect(…).toBe(…)</code>. Bu testda solishtirish yo'q, u doim PASS beradi. <b>Tekshiruv o'rnida turgan satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Kodni, etalonni va expectni buzing — natijani o'qing",
  "seg": [
   [
    "a",
    "Endi siz: o'z testingizni <b>uch xil buzasiz</b> va har natijani o'qiysiz",
    "Endi o'z testingizni uch xil buzasiz. Bunga o'n daqiqa ketadi. Har buzishdan keyin npm test va natijani ovoz chiqarib o'qing, sinfda xuddi shunday qilasiz."
   ],
   [
    "b",
    "1–2-qadam: funksiyada <code>+</code> — <b>FAIL</b>; tuzatib, etalonni 10002 qiling — FAIL",
    "Birinchi qadamda order ts'da ko'paytirish o'rniga qo'shish yozing va FAIL'ni ko'ring. Received qiymatini eslab qoling. Ikkinchisida funksiyani tuzatib, testdagi etalonni o'n ming ikki qiling: yana FAIL chiqadi, lekin qiymatlar teskari bo'ladi."
   ],
   [
    "c",
    "3–4-qadam: <code>expect</code> o'rniga <code>console.log</code> — PASS; tiklang; isbot — 1-qadamdagi <b><code>Received</code></b>",
    "Uchinchi qadamda expect o'rniga console log yozing: test yashil bo'ladi, lekin yolg'on. To'rtinchisida testni asl holiga qaytaring. Isbot maydoniga birinchi qadamdagi received qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz FAIL'ning ikki xilini va yolg'on PASS'ni o'z ko'zingiz bilan ko'rdingiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · chegara",
  "title": "Aynan 100 000 — >= va > farqi faqat chegarada ko'rinadi",
  "seg": [
   [
    "a",
    "O'quvchi uyga vazifasi: <b>100 000 dan</b> — yetkazish bepul, kam bo'lsa — 15 000",
    "Chegara shartini qayerda ko'ramiz? O'quvchining uyga vazifasida, delivery fee funksiyasida. Buyurtma yuz ming va undan ko'p bo'lsa, yetkazish bepul, kam bo'lsa o'n besh ming. Funksiya bir satrdan iborat, unga uchta test yozamiz: yuz ellik ming, aynan yuz ming va to'qson to'qqiz ming uchun."
   ],
   [
    "b",
    "Uch test va jami 4 o'tdi; ikki fayl bo'lsa nomlar faqat <b><code>--verbose</code></b> bilan chiqadi",
    "npm test qilamiz: ikki fayl, order va delivery, to'rtta test, hammasi yashil. Diqqat: fayl ikkita bo'lsa, Jest test nomlarini ko'rsatmaydi, faqat PASS va fayl. Nomlarni ko'rish uchun npx jest minus minus verbose."
   ],
   [
    "c",
    "<code>&gt;=</code> o'rniga <code>&gt;</code> — faqat <b>«aynan 100 000» qizil</b>: <code>Expected: 0</code>, <code>Received: 15000</code>",
    "Endi kichik xato qilamiz: katta yoki teng o'rniga faqat katta yozamiz. Yuz ellik ming ham, to'qson to'qqiz ming ham o'zgarmadi, ular yashil. Faqat aynan yuz ming qizil bo'ldi: nol kutilgan edi, o'n besh ming keldi. Shu test bo'lmaganda, bu xatoni hech kim sezmasdi."
   ],
   [
    "d",
    "Xulosa: shartli funksiyada uch test — chegaradan yuqori, <b>aynan chegara</b>, chegaradan past",
    "Xulosa: shart bor joyda kamida uchta test. Biri chegaradan yuqori, biri aynan chegarada, biri chegaradan past. Aynan chegara eng muhimi, xato ko'pincha shu yerda yashiringan. O'quvchi vazifasini tekshirganda shu uchta test bormi, shunga qarang."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · chegara",
  "title": "AI'ning testiga ikki savol: expect bormi? Etalon to'g'rimi?",
  "seg": [
   [
    "a",
    "O'quvchi darsida AI beshta test yozadi — ulardan <b>faqat ikkitasi haqiqiy</b>",
    "O'quvchi darsida AI orderTotal uchun beshta test yozadi. O'quvchi ulardan haqiqiylarini tanlaydi. Bugun ko'rgan ikki xatoni endi AI testlarida qidiramiz."
   ],
   [
    "b",
    "Birinchi savol: <b><code>expect</code> bormi?</b> Yo'q bo'lsa — test doim yashil",
    "Birinchi savol: testda expect bormi? Ikkita testda u yo'q: birida funksiya faqat chaqiriladi, birida console log turibdi. Ikkalasi ham doim yashil bo'ladi, o'ninchi ekrandagidek."
   ],
   [
    "c",
    "Ikkinchi savol: <b>etalon to'g'rimi?</b> Qo'lda hisoblang — 10002 noto'g'ri",
    "Ikkinchi savol: etalon to'g'rimi? Qo'lda hisoblaymiz: o'n ming ko'paytirish ikki yigirma ming bo'ladi, besh ming ko'paytirish uch esa o'n besh ming. O'n ming ikki degan etalon noto'g'ri, bu test to'g'ri kodni qizil qiladi."
   ],
   [
    "d",
    "Xulosa: AI test yozadi — o'quvchi har biriga <b>ikki savol</b> beradi",
    "Xulosa: AI test yozishi mumkin, lekin har testga ikki savol beriladi: expect bormi va etalon qo'lda hisoblaganda to'g'rimi. Sinfda bu qoidani doskaga yozing, o'quvchi uni har AI testida ishlatsin."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "FAIL · Expected: 10002 · Received: 20000. orderTotal(10000, 2). Kim xato?",
  "q": "FAIL o'qishni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi testi qizil: expected o'n ming ikki, received yigirma ming. Funksiyaga o'n ming va ikki berilgan. Kim xato? Variantni tanlang.",
  "ok": "To'g'ri, xato etalonda. Funksiya yigirma ming qaytardi, bu to'g'ri: o'n ming ko'paytirish ikki. Test o'n ming ikki kutgan, etalon xato. Testni tuzatasiz, kodga tegmaysiz. Demak, FAIL chiqqanda avval etalonni qo'lda hisoblang, keyin kodga qarang.",
  "okShort": "<code>Received: 20000</code> — to'g'ri hisob. <code>Expected: 10002</code> — etalon xato. Testni tuzating.",
  "hint": "Received — funksiya qaytargan qiymat. Uni qo'lda hisoblaganingiz bilan solishtiring.",
  "correct": 1,
  "opts": [
   "Funksiya — + yozilgan",
   "Etalon — 10000 × 2 = 20000, test 10002 kutgan",
   "Jest — versiya eski",
   "Hech kim — qayta npm test"
  ],
  "wrong": {
   "0": "+ bo'lsa Received: 10002 bo'lardi — bu yerda Received 20000.",
   "2": "Jest faqat solishtiradi; versiya natijani o'zgartirmaydi.",
   "3": "Kod va test o'zgarmasa, natija ham o'zgarmaydi."
  }
 },
 "16": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Uch test va chegara xatosi",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi uyga vazifasini o'zingiz qilasiz — uch test va <b>bitta chegara xatosi</b>",
    "Endi o'quvchi uyga vazifasini o'zingiz qilasiz: delivery fee funksiyasiga uchta test yozasiz, keyin chegarani ataylab buzasiz. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>delivery.ts</code> va <code>delivery.spec.ts</code> — uch <code>it</code>, <code>npm test</code> — <b>4 passed</b>",
    "Birinchi qadamda src papkasida delivery ts faylini yozasiz. Ikkinchisida delivery spec ts faylida uchta it yozasiz: yuz ellik ming, aynan yuz ming va to'qson to'qqiz ming uchun. npm test to'rtta yashil test ko'rsatadi."
   ],
   [
    "c",
    "3–4-qadam: <code>&gt;=</code> → <code>&gt;</code>, <code>npm test</code>; isbot — <b>qizil testning nomi</b>",
    "Uchinchi qadamda katta yoki teng o'rniga faqat katta yozib, npm test qilasiz. To'rtinchisida qaysi test qizil bo'lganini nuqtali satrdan o'qib, isbot maydoniga yozasiz. Keyin funksiyani tiklang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, chegaradagi xatoni faqat aynan chegara uchun yozilgan test tutishini o'zingiz ko'rdingiz."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · tuzoqlar",
  "title": "Uch tuzoq: src/dan tashqari, .test.ts, npm ci",
  "seg": [
   [
    "a",
    "Sinfda test yozilgan, lekin ishlamaydi — sabab ko'pincha <b>koddan tashqarida</b>",
    "Sinfda eng ko'p vaqt test kodiga emas, sozlashga ketadi. Uchta tuzoqni oldindan bilsangiz, ularni bir daqiqada tuzatasiz."
   ],
   [
    "b",
    "Fayl loyiha ildizida yoki nomi <code>.test.ts</code> — ikkalasida <b><code>No tests found</code></b>",
    "Birinchi va ikkinchi tuzoq fayl joyi va nomida. Sinab ko'rdik: test fayli loyiha ildizida tursa, Jest no tests found deydi. Nomi order test ts bo'lsa ham shu javob chiqadi. Xabardagi test regex satri shuni aytadi: nol mos fayl."
   ],
   [
    "c",
    "<code>npm ci</code> bu repoda yiqiladi — lock fayl sinxron emas; <b><code>npm install</code> ishlaydi</b>",
    "Uchinchi tuzoq: ba'zi o'quvchi npm ci deb yozadi. Bu repoda u yiqiladi: package json va lock fayl sinxron emas. Npm install ishlaydi. Bu repo muallifining kamchiligi, o'quvchining xatosi emas."
   ],
   [
    "d",
    "Xulosa: <code>No tests found</code> — <b>joy va nom</b>; <code>npm ci</code> xatosi — <code>npm install</code>",
    "Xulosa: no tests found ko'rsangiz, fayl joyi va nomini tekshiring, src ichida va spec ts. Npm ci yiqilsa, npm install qiling. Ikkalasi ham kodda emas, sozlamada."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · tuzoqlar",
  "title": "Bo'sh loyihada darsdagi ikki buyruq yetmaydi: to'rt xato ketma-ket",
  "seg": [
   [
    "a",
    "O'quvchi Nest emas, oddiy loyihada sinasa — <b>darsdagi buyruqlar yetmaydi</b>",
    "Ba'zi o'quvchi testni Nest emas, oddiy bo'sh loyihada sinaydi. O'quvchi darsida ikki qadam bor: npm i minus D jest ts jest va test: jest. Sinab ko'rdik: bo'sh loyihada bu yetmaydi, to'rtta xato ketma-ket chiqadi."
   ],
   [
    "b",
    "1-xato: <b><code>Must use import to load ES Module</code></b> — Jest TypeScript'ni o'qishni bilmaydi",
    "Birinchi xato: must use import to load ES module. Jest TypeScript faylni o'qishni bilmaydi, unga sozlama kerak. Yechim: npx ts jest config init, u jest config faylini yaratadi."
   ],
   [
    "c",
    "2-xato: <code>Cannot find name 'describe'</code> — <code>@types/jest</code> kerak; 3-xato: <b>TypeScript 6 yoki 7</b>",
    "Ikkinchi xato: cannot find name describe, chunki Jest turlari yo'q. Yechim types jest va typescript paketlarini o'rnatish. Lekin shunda uchinchi xato chiqadi: eng yangi TypeScript o'rnatiladi. Alohida o'rnatilsa yettinchi, boshqa paketlar bilan birga oltinchi. Ikkalasida ham ts jest ishlamaydi."
   ],
   [
    "d",
    "Yechim: <b><code>typescript@5</code></b> — bo'sh loyiha ham yashil: <code>PASS ./order.spec.ts</code>",
    "Yechim: typescript beshinchi versiyasini o'rnatish. Shundan keyin bo'sh loyiha ham yashil. Jami uchta qo'shimcha buyruq kerak bo'ldi: config init, types jest va typescript besh. Nest loyihasida bularning hammasi tayyor."
   ],
   [
    "e",
    "Xulosa: test — <b>Nest loyihasida</b>; bo'sh loyihada — <code>config:init</code>, <code>@types/jest</code>, <code>typescript@5</code>",
    "Xulosa: sinfda testni o'quvchi reposida yozdiring, u yerda hammasi tayyor. O'quvchi baribir bo'sh loyihada sinasa, uchta buyruq: ts jest config init, types jest va typescript besh. Oltinchi va yettinchi TypeScript bilan ts jest hozircha ishlamaydi."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Bo'sh loyiha: The TypeScript compiler \"typescript\" (version 7.0.2) does not expose … required by ts-jest. Nima qilasiz?",
  "q": "Zanjirni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi bo'sh loyihada TypeScript o'rnatdi va xabar oldi: TypeScript yettinchi versiya ts jest uchun kerakli qismni bermaydi. Nima qilasiz? Variantni tanlang.",
  "ok": "To'g'ri. Ts jest hozircha TypeScript beshinchi versiyasi bilan ishlaydi. Typescript besh o'rnatilgach, sinab ko'rdik, test yashil. Nest reposida TypeScript besh allaqachon turibdi, shuning uchun u yerda bu xato chiqmaydi. Demak, ts jest bilan TypeScript beshinchi versiyasi ishlatiladi.",
  "okShort": "<code>typescript@5</code> → <code>PASS</code>. Nest reposida TypeScript 5.9 allaqachon bor.",
  "hint": "Xabar versiya haqida: qaysi versiya ts-jest bilan ishlaydi?",
  "correct": 3,
  "opts": [
   "ts-jestni o'chirish",
   "npm ci",
   "Test faylini .js qilish",
   "npm i -D typescript@5"
  ],
  "wrong": {
   "0": "ts-jestsiz Jest TypeScript faylni o'qiy olmaydi — birinchi xatoga qaytasiz.",
   "1": "npm ci lock fayldagi versiyani qayta o'rnatadi, yangisini tanlamaydi — sinab ko'rdik, versiya o'zgarmadi.",
   "2": ".js nomida Jest TypeScript'ni o'qiy olmaydi — sinab ko'rdik: Jest encountered an unexpected token."
  }
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 5 daqiqa",
  "title": "Fayl joyi va nomi — ikki tuzoqni qo'l bilan ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: sinfdagi eng ko'p savolni o'zingiz chiqarasiz — <b><code>No tests found</code></b>",
    "Oxirgi amaliyot qisqa, besh daqiqalik. Sinfdagi eng ko'p uchraydigan xabarni, no tests found'ni, o'zingiz chiqarasiz."
   ],
   [
    "b",
    "1–2-qadam: <code>order.spec.ts</code>ni <b>loyiha ildiziga</b> ko'chiring — <code>No tests found</code>",
    "Birinchi qadamda order spec ts'ni src'dan loyiha ildiziga ko'chirib, importni moslang. Ikkinchisida npm test qiling: no tests found chiqadi. Xabardagi testRegex satrini o'qing."
   ],
   [
    "c",
    "3–4-qadam: <code>src/</code>ga qaytarib, nomini <b><code>.test.ts</code></b> qiling; isbot — xabarning birinchi satri",
    "Uchinchi qadamda faylni src'ga qaytaring, lekin nomini order test ts qiling: yana no tests found chiqadi. To'rtinchisida nomini spec ts'ga qaytaring, test yashil bo'ladi. Isbot maydoniga xabarning birinchi satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, sinfda no tests found chiqsa, siz sababini fayl joyi va nomidan darhol topasiz."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4b-01 · «Unit-test: Jest»",
  "title": "m4b-01: Jestbot, varaqa va etalon — amaliyot o'quvchi loyihasida",
  "seg": [
   [
    "a",
    "m4b-01 — 21 ekran: ko'p qismida o'quvchi <b>Jestbot</b> bilan o'ynaydi, terminalni amaliyotda ko'radi",
    "Endi o'quvchi darsini ko'ramiz: m4b-01, unda yigirma bir ekran bor. Ko'p qismida o'quvchi Jestbot degan robot bilan ishlaydi: varaqa yig'adi, etalon qo'yadi, kodni buzadi. Haqiqiy terminalni u faqat amaliyotda, o'z loyihasida ko'radi."
   ],
   [
    "b",
    "Yozish bloki: o'quvchi darsi haqiqiy chiqishni ko'rsatmaydi — siz <b>6-ekrandagini ko'rsatasiz</b>",
    "Yozish blokida o'quvchi darsi natijani kartochka bilan ko'rsatadi, haqiqiy terminal chiqishini emas. Siz proyektorda oltinchi ekrandagi haqiqiy PASS'ni ko'rsating: fayl, guruh, holat va jami."
   ],
   [
    "c",
    "Buzish bloki: FAIL o'qish tartibi va <b>«kim xato» savoli</b> — ikkalasi sizdan",
    "Buzish blokida o'quvchi expected va received'ni ko'radi. Siz o'qish tartibini o'rgatasiz: avval nuqtali satr, keyin expected va received, oxirida funksiya. Va har FAIL'da savol: kim xato, kodmi yoki etalonmi."
   ],
   [
    "d",
    "Xulosa: amaliyot oldidan — repo <code>npm install</code> bilan, test <b><code>src/</code> ichida</b>, nomi <code>.spec.ts</code>",
    "Xulosa: amaliyot oldidan uch narsani tekshiring. Repo npm install bilan o'rnatilgan, test fayli src ichida, nomi spec ts bilan tugaydi. Vaqt, taklif: to'qson daqiqaning yigirma beshi amaliyotga, chunki sozlashda vaqt ketadi."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsidagi so'zlar: Jestbot, robot papkasi, sinov varaqasi, etalon kartochkasi",
  "seg": [
   [
    "a",
    "O'quvchi darsi testni <b>robot misolida</b> tushuntiradi — siz har so'zni atamasi bilan birga aytasiz",
    "Endi o'quvchi darsida qanday so'zlar ishlatilishini ko'ramiz. AI Startup kursidagi o'quvchi darsi testni robot misolida tushuntiradi, robotning ismi Jestbot. Siz har so'zni ham, uning atamasini ham bilasiz va sinfda ikkalasini birga aytasiz."
   ],
   [
    "b",
    "Papka — <code>describe</code>, varaqa — <code>it</code>, <b>etalon kartochkasi — <code>expect</code></b>",
    "Robot papkasi bu describe: u qaysi mashina sinalayotganini aytadi. Sinov varaqasi bu it: u nima tekshirilishini aytadi. Etalon kartochkasi bu expect: u qanday natija kutilishini aytadi. Mashina esa funksiyaning o'zi."
   ],
   [
    "c",
    "Yolg'on test va uch qadam — o'quvchi bularni so'z bilan ham, <b>kodda ham taniydi</b>",
    "Yolg'on test deganda etalon kartochkasi yo'q yoki noto'g'ri test tushuniladi. Uch qadam esa tayyorlash, chaqirish va tekshirish. O'quvchi bularni kodda ham tanishi kerak, shuning uchun har so'zni ekrandagi kod satri bilan ko'rsating."
   ],
   [
    "d",
    "Xulosa: «etalon kartochkasi, ya'ni <code>expect</code>» — so'zni <b>kod satri bilan birga</b> ko'rsating",
    "Xulosa: so'zlarni birga ayting, masalan etalon kartochkasi, ya'ni expect, va o'sha satrni ko'rsating. Metafora testni tushuntiradi, lekin terminaldagi so'zlar inglizcha: PASS, FAIL, expected, received."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "Darsdagi o'rnatish qadami Nest reposida keraksiz, lekin zararsiz",
  "seg": [
   [
    "a",
    "O'quvchi darsi Jest'ni o'rnatishni buyuradi — Nest reposida u <b>allaqachon bor</b>",
    "O'quvchi darsining beshinchi ekrani Jest'ni o'rnatishni buyuradi: npm i minus D jest ts jest va test: jest. Nest reposida ikkalasi allaqachon bor. O'quvchi «nega o'rnatyapmiz, bor-ku?» desa, javob tayyor bo'lsin."
   ],
   [
    "b",
    "Sinab ko'rdik: faqat versiyalar ko'tarildi, testlar yashil — <b>zarari yo'q</b>",
    "Sinab ko'rdik: buyruqdan keyin jest va ts jest kichik versiyaga ko'tarildi, testlar yashil qoldi. Zarari yo'q. Ikkinchi qism, test: jest, package json'da allaqachon shunday yozilgan."
   ],
   [
    "c",
    "Tavsiya: o'quvchi buyruqni bajarsin, siz <b>«Nest buni oldindan qo'ygan»</b> deb izohlang",
    "Tavsiya: o'quvchi buyruqni bajaraversin, zarar yo'q. Siz bir gap qo'shing: Nest loyihasi Jest'ni oldindan qo'ygan, bu buyruq uni yangilaydi. O'quvchi bo'sh loyihada qilsa, o'n sakkizinchi ekrandagi zanjir."
   ],
   [
    "d",
    "Xulosa: Nest reposida — zararsiz; bo'sh loyihada — <b>yetarli emas</b>",
    "Xulosa: darsdagi o'rnatish qadami Nest reposida zararsiz, bo'sh loyihada esa yetarli emas. Shuning uchun sinfda testni o'quvchi reposida yozdiring."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan <b>olti holat</b> — hammasini bugun o'zingiz ko'rdingiz",
    "Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "Topilmadi va o'rnatish — joy, nom va <b><code>npm install</code></b>",
    "Birinchi holat no tests found: fayl joyi va nomini tekshiring. Ikkinchisi: npm ci yiqilsa, npm install qiling."
   ],
   [
    "c",
    "Yolg'on yashil, qizil to'g'ri kod va chegara — <code>expect</code>, etalon, <b>uch test</b>",
    "Uchinchisi: test yashil, lekin ichida expect yo'q. To'rtinchisi: test qizil, lekin kod to'g'ri, bunda etalonni qo'lda hisoblang. Beshinchisi: faqat aynan chegaradagi test qizil, shuning uchun har shartga uchta test yoziladi."
   ],
   [
    "d",
    "Xulosa: bo'sh loyiha — o'quvchi reposiga qaytaring; avval <b>xabarni birga o'qing</b>",
    "Oltinchisi bo'sh loyihadagi xatolar zanjiri: eng tez yo'l testni o'quvchi reposida yozdirish. Xulosa va usul bitta: javobni darhol aytmang, terminaldagi xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "25": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "O'quvchi reposida Jest test faylini qayerdan qidiradi?",
    "o": [
     "butun loyihadan, istalgan nom",
     "src/ ichidan, nomi .spec.ts",
     "test/ papkasidan",
     "faqat package.json yonidan"
    ],
    "c": 1,
    "e": "rootDir: src, testRegex: .*\\.spec\\.ts$.",
    "s": 3
   },
   {
    "q": "Testda expect yo'q, faqat console.log(result). Natija?",
    "o": [
     "PASS — hech narsa tekshirilmadi",
     "FAIL",
     "No tests found",
     "SyntaxError"
    ],
    "c": 0,
    "e": "it ichida xato tashlanmasa — o'tdi.",
    "s": 10
   },
   {
    "q": "Expected: 20000 · Received: 10002. Nima bo'lgan?",
    "o": [
     "Etalon xato",
     "Jest eskirgan",
     "Funksiya noto'g'ri hisobladi (+)",
     "Test topilmadi"
    ],
    "c": 2,
    "e": "Received — funksiya qaytargan; 10000 + 2.",
    "s": 8
   },
   {
    "q": "Expected: 10002 · Received: 20000, orderTotal(10000, 2). Nima qilasiz?",
    "o": [
     "Funksiyani o'zgartiraman",
     "npm install",
     "Testni o'chiraman",
     "Etalonni 20000 ga tuzataman"
    ],
    "c": 3,
    "e": "Funksiya to'g'ri — etalon xato.",
    "s": 9
   },
   {
    "q": "deliveryFee: >= o'rniga > yozildi. Qaysi test qizil?",
    "o": [
     "aynan 100 000",
     "150 000",
     "99 000",
     "hammasi"
    ],
    "c": 0,
    "e": "Farq faqat chegarada.",
    "s": 13
   },
   {
    "q": "O'quvchi npm ci qildi — in sync xatosi. Nima deysiz?",
    "o": [
     "Jest'ni qayta o'rnating",
     "npm install qiling",
     "Repoyni o'chiring",
     "Node'ni yangilang"
    ],
    "c": 1,
    "e": "Lock fayl sinxron emas — npm install.",
    "s": 17
   },
   {
    "q": "Bo'sh loyiha: TypeScript 7.0.2 — does not expose … required by ts-jest. Yechim?",
    "o": [
     "ts-jestni o'chirish",
     "npm ci",
     "npm i -D typescript@5",
     "faylni .js qilish"
    ],
    "c": 2,
    "e": "ts-jest TypeScript 5 bilan ishlaydi (6 va 7 bilan — yo'q).",
    "s": 18
   },
   {
    "q": "AI 5 ta test yozdi. Har biriga qaysi ikki savol?",
    "o": [
     "Tezmi va qisqami?",
     "Nomi inglizchami?",
     "Nechta satr?",
     "expect bormi va etalon to'g'rimi?"
    ],
    "c": 3,
    "e": "Yolg'on testning ikki turi.",
    "s": 14
   }
  ]
 },
 "26": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  MENTOR KURSI · Jest-1 «Birinchi unit-test: o'quvchi reposida»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/10-Jest1-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/jest1-out/ (00–20; har npm test toza muhitda)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx jest1/parts/*.jsx > JestUnitMentorLesson.jsx
//  Yordamchilar PG-2 dan nusxa + Nest-2 dagi TypeScript rang beruvchi
// ============================================================
const LESSON_ID = 'mentor-jest-01-birinchi-unit-test-v1';
const LESSON_TITLE = "Birinchi unit-test: o'quvchi reposida";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', win: '#0067C0', post: '#FF6C37' };
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
const F = { ord: 'src/order.ts', ordSpec: 'src/order.spec.ts', del: 'src/delivery.ts', delSpec: 'src/delivery.spec.ts', pkg: 'package.json' };
MKCFG.files = tree(REPO_BASE);

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['order spec ts', 'order.spec.ts'], ['order test ts', 'order.test.ts'], ['order ts', 'order.ts'], ['delivery spec ts', 'delivery.spec.ts'], ['delivery ts', 'delivery.ts'],
  ['delivery fee', 'deliveryFee'], ['package json', 'package.json'], ['root dir src', 'rootDir: src'], ['root dir', 'rootDir'], ['test regex', 'testRegex'],
  ['spec ts', '.spec.ts'], ['ts jest config init', 'ts-jest config:init'], ['ts jest', 'ts-jest'], ['types jest', '@types/jest'], ['typescript besh', 'typescript@5'],
  ['npm i minus D jest ts jest', 'npm i -D jest ts-jest'], ['test: jest', '"test": "jest"'], ['expect, result, to be yigirma ming', 'expect(result).toBe(20000)'],
  ['no tests found', 'No tests found'], ['console log', 'console.log'], ['test suites', 'Test Suites'], ['must use import to load ES module', 'Must use import to load ES Module'],
  ['cannot find name describe', "Cannot find name 'describe'"], ['npx jest minus minus verbose', 'npx jest --verbose'], ['jest config', 'jest.config.js'], ['npm ci', 'npm ci'],
];
DIGITS.unshift(["yuz ellik ming", '150 000'], ["to'qson to'qqiz ming", '99 000'], ["o'n ming ikki", '10002'], ['yigirma ming', '20000'], ["o'n besh ming", '15 000'],
  ["besh ming", '5000'], ["o'n ming", '10 000'], ['yuz ming', '100 000'], ["o'ttiz yettita", '37 ta'], ['yigirma bir ekran', '21 ekran'], ["o'n sakkizinchi", '18-'],
  ["olti, yigirma", '6:20'], ["o'n besh", '15']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /No tests found/g, /Must use import to load ES Module/g, /Cannot find name 'describe'/g, /does not expose the JavaScript compiler API/g,
  /Test Suites/g, /Cannot find module/g, /can only install packages when/g, /Object\.is equality/g, /Jest encountered an unexpected token/g,
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
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});

const TS_KW = /^(import|from|export|function|return|const|let|describe|it|expect|number|string|boolean|true|false|null|undefined)$/;
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^(toBe|toEqual)$/.test(id) ? `<span class="d">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// Jest terminali: PASS/✓ yashil, FAIL/●/✕ qizil, Expected yashil, Received qizil, > satr sariq
function jestLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*PASS\b|✓|passed, \d+ total$/.test(l) && !/failed/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*FAIL\b|●|✕|failed|error|Error|No tests found|not found|Cannot find|Must use|does not expose|unexpected token/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*Expected:/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/^\s*Received:/.test(l)) return `<span class="er">${escH(l)}</span>`;
  if (/^\s*>\s*\d+ \||^\s+\|\s+\^|^\s+~+/.test(l)) return `<span class="wn">${escH(l)}</span>`;
  if (/^>|^\s*at |^\s*\d+ \||^Snapshots|^Time|^Ran all|^In |files checked|testMatch|testPath|Pattern|Run with|console\.log|^---/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  return escH(l);
}
const jt = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: jestLine(l), ...(meta[i + 1] || {}) }));
const Term = ({ lines, title = 'terminal — npm test', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
const Psql = ({ lines, title = 'psql — blog', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
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
    <div className="top"><span className="lg">Postman</span><span className="m" style={{ background: METHOD_C[m] }}>{m}</span><span className="u">{url}</span><span className="tg">haqiqiy javob</span></div>
    {body && <pre className="b">{body}</pre>}
    <div className="r"><span className={`st s${c}`}>{st}</span><pre>{res}</pre></div>
  </div>;
}
const Doc = ({ children, odd, er }) => <pre className={`pg-doc${odd ? ' odd' : ''}${er ? ' er' : ''}`}>{children}</pre>;

// PG-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
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
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-three{grid-template-columns:1fr}}
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
@media (max-width:1300px){.pg-qa{grid-template-columns:1fr}}
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-j1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-j1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  Umumiy kod va chiqishlar (jest1-out — toza muhit; /tmp yo'llari qisqartirilgan)
// ============================================================
const ORDER_TS = ts(String.raw`
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}`, { 2: { id: 'op' } });
const ORDER_SPEC = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    const result = orderTotal(10000, 2);
    expect(result).toBe(20000);
  });
});`, { 1: { id: 'imp' }, 3: { id: 'desc' }, 8: { id: 'desc' }, 4: { id: 'it' }, 7: { id: 'it' }, 5: { id: 'act' }, 6: { id: 'exp' } });
const PASS_OUT = jt(String.raw`
$ npm test
> IntroNestArxitechture@0.0.1 test
> jest

PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.389 s, estimated 1 s
Ran all test suites.`, { 5: { id: 'pass' }, 6: { id: 'name' }, 7: { id: 'name' }, 9: { id: 'tot' }, 10: { id: 'tot' } });
const FAIL_OUT = jt(String.raw`
FAIL src/order.spec.ts
  ● orderTotal › 2 kitob narxini hisoblaydi

    expect(received).toBe(expected) // Object.is equality

    Expected: 20000
    Received: 10002

      4 |   it('2 kitob narxini hisoblaydi', () => {
      5 |     const result = orderTotal(10000, 2);
    > 6 |     expect(result).toBe(20000);
        |                    ^
      7 |   });

      at Object.<anonymous> (order.spec.ts:6:20)

Tests:       1 failed, 1 total`, { 1: { id: 'f' }, 2: { id: 'f' }, 6: { id: 'er' }, 7: { id: 'er' }, 11: { id: 'ln' }, 12: { id: 'ln' }, 15: { id: 'ln' } });
const NOTESTS = jt(String.raw`
$ npm test
> jest

No tests found, exiting with code 1
Run with \`--passWithNoTests\` to exit with code 0
In …/IntroNestArxitechture/src
  37 files checked.
  testMatch:  - 0 matches
  testPathIgnorePatterns: /node_modules/ - 37 matches
  testRegex: .*\.spec\.ts$ - 0 matches
Pattern:  - 0 matches`.replace(/\\`/g, '`'), { 4: { id: 'nt' }, 11: { id: 'rx' } });
const SPEC_FILES = tree(REPO_BASE, [F.ord, F.ordSpec]);

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Unit-test va Jest', 'Birinchi test', "Buzamiz: FAIL va yolg'on testlar", 'Chegara va AI testi', 'Sinfdagi tuzoqlar', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4, 5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — o'quvchi reposida</div>
    <Term lines={PASS_OUT.slice(4, 10)} />
  </div>} />;
}

// ============================================================
//  2 · Unit-test: funksiya — mashina
// ============================================================
const PAIRS2 = [['orderTotal(10000, 2)', '20000'], ['orderTotal(5000, 3)', '15000'], ['orderTotal(120000, 1)', '120000']];
const S2 = mkS(2, [{ v: 'm' }, { v: 'pair' }, { v: 'code' }, { v: 'code', sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    <div className="mk-light" style={{ padding: 16 }}>
      <div className="mk-tag">Funksiya — mashina: kirish → natija</div>
      <div style={{ display: 'grid', gap: 8 }}>{PAIRS2.map(([a, b], i) => <div key={i} className="pg-row" style={{ opacity: seg.v === 'm' && i > 0 ? 0.35 : 1 }}><span>{a}</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 16, color: T.green }}>{b}</span></div>)}</div>
      {seg.v !== 'm' && <div className="mk-rule" style={{ marginTop: 10 }}>Unit-test — <b>shu juftni yozib qo'yish</b>: «shu kirishga aynan shu chiqish». Bitta funksiya, bazasiz, serversiz.</div>}
    </div>
    {seg.v === 'code' && <Ide files={tree(REPO_BASE, [F.ord])} active={F.ord}><CodePanel file={F.ord} lines={ORDER_TS} focus={['op']} /></Ide>}
  </>} />;
}

// ============================================================
//  3 · Jest o'quvchi reposida allaqachon bor
// ============================================================
const PKG3 = js(String.raw`
"scripts": {
  "test": "jest",
  …
},
"jest": {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "testEnvironment": "node"
}`, { 2: { id: 't' }, 7: { id: 'r' }, 8: { id: 'r' }, 9: { id: 'r' } });
const S3 = mkS(3, [{ focus: ['t'] }, { focus: ['r'] }, { focus: [], nt: true }, { focus: ['r'], nt: true, sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <Ide files={MKCFG.files} active={F.pkg}>
    <CodePanel file="package.json" lines={PKG3} focus={seg.focus} />
    {seg.nt && <Term er lines={NOTESTS} focus={seg.sum ? ['nt', 'rx'] : []} />}
    {seg.sum && <div className="mk-rule">Test fayli — <code>src/</code> ichida va nomi <b>.spec.ts</b> bilan tugaydi. Biri buzilsa — <code>No tests found</code>.</div>}
  </Ide>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: fayl ildizda yoki .test.ts — topilmaydi; src/order.spec.ts — topiladi</div>
      <Ide files={tree(REPO_BASE, ['order.spec.ts', F.ord, F.ordSpec])} active={F.ordSpec}>
        <Term lines={PASS_OUT.slice(4, 7)} />
      </Ide>
    </div>} />;
}

// ============================================================
//  5 · Birinchi test: describe · it · expect
// ============================================================
const S5 = mkS(5, [{ focus: ['imp'] }, { focus: ['desc'] }, { focus: ['it'] }, { focus: ['act', 'exp'], aaa: true }, { focus: ['exp'] }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <Ide files={SPEC_FILES} active={F.ordSpec} fresh={[F.ordSpec]}>
    <CodePanel file={F.ordSpec} lines={ORDER_SPEC} focus={seg.focus} />
    {seg.aaa && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>Tayyorlash</h4><p>10000, 2</p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4>Chaqirish</h4><p><code>orderTotal(10000, 2)</code></p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>Tekshirish</h4><p><code>expect(…).toBe(20000)</code></p></div>
    </div>}
  </Ide>} />;
}

// ============================================================
//  6 · PASS'ni o'qish
// ============================================================
const S6 = mkS(6, [{ focus: ['pass'] }, { focus: ['name'] }, { focus: ['tot'] }, { focus: ['pass', 'tot'], sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    <Term lines={PASS_OUT} focus={seg.focus} />
    {seg.sum && <div className="mk-rule"><b>PASS</b> — fayl va holatlar o'tdi · <code>Tests:</code> — nechta <code>it</code> · lekin PASS faqat <code>expect</code> bo'lsa ma'noli (10-ekran)</div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — birinchi test
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Repo va bo\'sh test', cmds: ['git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git', 'npm install', 'npm test'], exp: 'No tests found, exiting with code 1' },
  { t: 'Funksiya — src/order.ts', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Test — src/order.spec.ts (namuna — o\'zingiz yozing)', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Ishga tushirish', cmds: ['npm test'], exp: 'PASS src/order.spec.ts · ✓ 2 kitob narxini hisoblaydi' },
];
const P1_CODE = [{ file: F.ord, step: 1, lines: ORDER_TS, copy: false }, { file: F.ordSpec, step: 2, lines: ORDER_SPEC, copy: false }];
const P1_TROUBLE = [
  ['npm ci … can only install packages when your package.json and package-lock.json … are in sync', 'bu repoda lock fayl sinxron emas — npm install'],
  ['No tests found (fayl yozilgandan keyin)', 'fayl src/ dan tashqarida yoki nomi .test.ts — 4-ekran'],
  ["Cannot find module './orders' from 'order.spec.ts'", "import'dagi nom fayl nomiga mos emas — ikkalasi src/ ichida, yonma-yon"],
  ['FAIL · Expected: 20000', "order.ts dagi hisobni tekshiring — 8-ekran"],
];
const P1_PROOF = { label: 'Isbot: natijadagi Tests: satri', placeholder: 'natijadagi Tests satrini qo\'ying', check: (v) => /Tests:\s+1 passed,\s+1 total/.test(v), wrong: "Satr «Tests:» bilan boshlanadi va nechta test o'tganini aytadi — terminaldan butun satrni nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={SPEC_FILES} />; }

// ============================================================
//  8 · FAIL'ni o'qish: kod buzildi
// ============================================================
const ORDER_BAD = [ORDER_TS[0], { ...ORDER_TS[1], gone: true }, { h: tsLine('  return price + quantity;'), neu: false, id: 'bad', n: 2 }, ORDER_TS[2]];
const S8 = mkS(8, [{ v: 'bad' }, { v: 'fail', focus: ['f'] }, { v: 'fail', focus: ['er'] }, { v: 'fail', focus: ['ln'] }, { v: 'fix' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <div className="pg-two">
    <Ide files={SPEC_FILES} active={F.ord}>
      <CodePanel file={F.ord} wrap lines={seg.v === 'fix' ? ORDER_TS.map((l, i) => i === 1 ? { ...l, neu: true } : l) : ORDER_BAD} focus={seg.v === 'fix' ? [] : ['bad']} />
    </Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'fail' && <Term er lines={FAIL_OUT} focus={seg.focus} />}
      {seg.v === 'fix' && <><Term lines={PASS_OUT.slice(4, 7)} /><div className="mk-rule">FAIL o'qish: <b>●</b> satr → <b>Expected</b> / <b>Received</b> → funksiya. Javobni aytmang — birga o'qing.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  9 · Noto'g'ri etalon
// ============================================================
const SPEC_BADREF = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(10002);
  });
});`, { 5: { id: 'x' } });
const FAIL_REF = jt(String.raw`
FAIL src/order.spec.ts
  ● orderTotal › 2 kitob narxini hisoblaydi

    Expected: 10002
    Received: 20000

    > 5 |     expect(orderTotal(10000, 2)).toBe(10002);
        |                                  ^`, { 4: { id: 'e' }, 5: { id: 'e' } });
const S9 = mkS(9, [{ v: 'code' }, { v: 'fail' }, { v: 'fail', calc: true }, { v: 'fix', calc: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div className="pg-two">
    <Ide files={SPEC_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={seg.v === 'fix' ? SPEC_BADREF.map((l, i) => i === 4 ? { h: tsLine('    expect(orderTotal(10000, 2)).toBe(20000);'), neu: true } : l) : SPEC_BADREF} focus={seg.v === 'fix' ? [] : ['x']} /></Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v !== 'code' && <Term er={seg.v === 'fail'} lines={seg.v === 'fix' ? PASS_OUT.slice(4, 7) : FAIL_REF} focus={['e']} />}
      {seg.calc && <div className="pg-row"><span>Qo'lda: 10 000 × 2</span><span className="v" style={{ color: T.green }}>= 20 000</span></div>}
      {seg.v === 'fix' && <div className="mk-rule">FAIL'da birinchi savol: <b>kim xato</b> — funksiyami yoki etalonmi?</div>}
    </div>
  </div>} />;
}

// ============================================================
//  10 · Yolg'on PASS: expect yo'q
// ============================================================
const SPEC_LOG = ts(String.raw`
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    const result = orderTotal(10000, 2);
    console.log(result);
  });
});`, { 6: { id: 'x' } });
const LOG_OUT = jt(String.raw`
  console.log
    20000

      at Object.<anonymous> (order.spec.ts:6:13)

PASS src/order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (14 ms)

Tests:       1 passed, 1 total`, { 6: { id: 'p' }, 8: { id: 'p' } });
const S10 = mkS(10, [{ v: 'code' }, { v: 'out' }, { v: 'out', why: true }, { v: 'out', why: true, sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div className="pg-two">
    <Ide files={SPEC_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} wrap lines={SPEC_LOG} focus={['x']} /></Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out' && <Term lines={LOG_OUT} focus={['p']} />}
      {seg.why && <div className="n2-warn">Jest qoidasi: <code>it</code> ichida xato chiqmasa — holat o'tdi. Xato chiqaradigan yagona narsa — <b>expect</b>.</div>}
      {seg.sum && <div className="mk-rule">Har <code>it</code>da kamida bitta <code>expect</code> — aks holda PASS <b>yolg'on</b>.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (target 0 dan: 6-satr = 5)
// ============================================================
const LC11_FIXED = SPEC_LOG.map((l, i) => ({ ...l, n: i + 1, ...(i === 5 ? { gone: true } : {}) })); // n — fayldagi raqam (qo'shilgan satrdan keyin siljimasin)
LC11_FIXED.splice(6, 0, { h: tsLine('    expect(result).toBe(20000);'), n: 6, neu: true });
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={F.ordSpec} lines={SPEC_LOG.map((l) => ({ ...l, id: undefined }))} target={5}
    tree={{ root: MKCFG.root, files: SPEC_FILES, active: F.ordSpec }}
    fixed={LC11_FIXED} fixedExtra={[{ file: 'terminal — npm test (haqiqiy)', lines: PASS_OUT.slice(4, 7) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — uch xil buzish
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Kodni buzish — order.ts: price + quantity', cmds: ['npm test'], exp: 'FAIL · Expected: 20000 · Received: …' },
  { t: "Etalonni buzish — order.ts tiklang, order.spec.ts: toBe(10002)", cmds: ['npm test'], exp: 'FAIL · Expected: 10002 · Received: 20000' },
  { t: "expect'siz — expect(…) o'rniga console.log(result)", cmds: ['npm test'], exp: 'console.log 20000 · PASS' },
  { t: 'Tiklash — expect(result).toBe(20000);', cmds: ['npm test'], exp: 'PASS' },
];
const P2_TROUBLE = [
  ['1-qadamda PASS', 'fayl saqlanmagan — Ctrl+S, qayta npm test'],
  ["error TS1005: ')' expected.", "qavs tushib qolgan — xabardagi satr va ~ belgisi joyni ko'rsatadi"],
  ['3-qadamda FAIL', 'expect hali qolgan — u satrni butunlay almashtiring'],
];
const P2_PROOF = { label: '1-qadamdagi Received qiymati', placeholder: 'Received yonidagi sonni yozing', check: (v) => /^\s*10\s?002\s*$/.test(v), wrong: "Received — funksiya qaytargan qiymat: 10 000 va 2 ni qo'shganda nima chiqadi?" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  13 · Chegara: deliveryFee va 100 000 (jest1-out/09, 10)
// ============================================================
const DEL_TS = (bad) => ts(String.raw`
export function deliveryFee(total: number): number {
  return total ${bad ? '>' : '>='} 100000 ? 0 : 15000;
}`, { 2: { id: 'c', neu: bad === false ? false : undefined } });
const DEL_SPEC = ts(String.raw`
import { deliveryFee } from './delivery';

describe('deliveryFee', () => {
  it('150 000 — yetkazish bepul', () => {
    expect(deliveryFee(150000)).toBe(0);
  });
  it('aynan 100 000 — bepul', () => {
    expect(deliveryFee(100000)).toBe(0);
  });
  it('99 000 — 15 000', () => {
    expect(deliveryFee(99000)).toBe(15000);
  });
});`, { 7: { id: 'a' }, 8: { id: 'a' }, 9: { id: 'a' } });
const DEL_PASS = jt(String.raw`
PASS src/delivery.spec.ts
PASS src/order.spec.ts

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total`);
const DEL_FAIL = jt(String.raw`
FAIL src/delivery.spec.ts
  ● deliveryFee › aynan 100 000 — bepul

    Expected: 0
    Received: 15000

    >  8 |     expect(deliveryFee(100000)).toBe(0);
         |                                 ^

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 3 passed, 4 total`, { 2: { id: 'x' }, 4: { id: 'x' }, 5: { id: 'x' } });
const DEL_FILES = tree(REPO_BASE, [F.ord, F.ordSpec, F.del, F.delSpec]);
const S13 = mkS(13, [{ v: 'code', file: F.del }, { v: 'pass', file: F.delSpec }, { v: 'fail', file: F.del }, { v: 'fail', file: F.delSpec, sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div className="pg-two">
    <Ide files={DEL_FILES} active={seg.file} fresh={[F.del, F.delSpec]}>
      {seg.file === F.del ? <CodePanel file={F.del} wrap lines={DEL_TS(seg.v === 'fail')} focus={seg.v === 'fail' ? ['c'] : []} /> : <CodePanel file={F.delSpec} wrap lines={DEL_SPEC} focus={seg.sum ? ['a'] : []} />}
    </Ide>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'pass' && <Term lines={DEL_PASS} />}
      {seg.v === 'fail' && <Term er lines={DEL_FAIL} focus={['x']} />}
      {seg.sum && <div className="mk-rule">Shart bor joyda <b>uch test</b>: chegaradan yuqori · <b>aynan chegara</b> · chegaradan past</div>}
    </div>
  </div>} />;
}

// ============================================================
//  14 · AI yozgan testni tekshirish (o'quvchi darsi Screen15 — 5 test)
// ============================================================
const AI14 = [
  ["expect(orderTotal(10000, 2)).toBe(20000)", true, '10000 × 2 = 20000 ✓', 'haqiqiy'],
  ['const r = orderTotal(10000, 2);', false, '—', "yolg'on — doim yashil"],
  ['expect(orderTotal(10000, 2)).toBe(10002)', true, '✗ 20000 bo\'lishi kerak', "noto'g'ri etalon"],
  ['console.log(orderTotal(5000, 3))', false, '—', "yolg'on"],
  ['expect(orderTotal(5000, 3)).toBe(15000)', true, '5000 × 3 = 15000 ✓', 'haqiqiy'],
];
const S14 = mkS(14, [{ q: 0 }, { q: 1 }, { q: 2 }, { q: 3 }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">AI orderTotal uchun yozgan 5 test (o'quvchi darsidan)</div>
    <table className="mk-tbl"><thead><tr><th>test</th><th>expect bormi</th><th>etalon</th><th>hukm</th></tr></thead><tbody>
      {AI14.map(([c, e, r, h], i) => {
        const bad1 = !e, bad2 = r.startsWith('✗');
        const show = seg.q === 0 ? false : seg.q === 1 ? bad1 : seg.q === 2 ? bad2 : true;
        return <tr key={i} className={show && (bad1 || bad2) ? 'hl' : ''}><td><code>{c}</code></td><td style={{ color: seg.q >= 1 ? (e ? T.green : T.accent) : T.ink3 }}>{seg.q >= 1 ? (e ? 'ha' : "yo'q") : '?'}</td><td style={{ color: seg.q >= 2 ? (bad2 ? T.accent : T.ink2) : T.ink3 }}>{seg.q >= 2 ? r : '?'}</td><td style={{ fontWeight: 700, color: seg.q >= 3 ? (h === 'haqiqiy' ? T.green : T.accent) : T.ink3 }}>{seg.q >= 3 ? h : ''}</td></tr>;
      })}
    </tbody></table>
    {seg.q === 3 && <div className="mk-rule" style={{ marginTop: 12 }}>Har AI testiga <b>ikki savol</b>: <code>expect</code> bormi? Etalon qo'lda hisoblaganda to'g'rimi?</div>}
  </div>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — kim xato
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={FAIL_REF.slice(0, 5)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — etalon 20000</div>
      <Ide files={SPEC_FILES} active={F.ordSpec}><CodePanel file={F.ordSpec} lines={ORDER_SPEC} focus={['exp']} /><Term lines={PASS_OUT.slice(4, 7)} /></Ide>
    </div>} />;
}

// ============================================================
//  16 · Amaliyot 3 — deliveryFee
// ============================================================
const P3 = mkS(16, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Funksiya — src/delivery.ts', cmds: [], exp: 'fayl saqlandi' },
  { t: 'Testlar — src/delivery.spec.ts, 3 ta it', cmds: ['npm test'], exp: 'Tests: 4 passed, 4 total' },
  { t: 'Chegarani buzish — total >= 100000 → total > 100000', cmds: ['npm test'], exp: '1 failed, 3 passed' },
  { t: "O'qish va tiklash — ● satr, >= qaytaring", cmds: ['npm test'], exp: '4 passed' },
];
const P3_CODE = [{ file: F.del, step: 0, lines: DEL_TS(false), copy: false }, { file: F.delSpec, step: 1, lines: DEL_SPEC, copy: false }];
const P3_TROUBLE = [
  ['3-qadamda hammasi yashil', "aynan 100 000 testi yo'q — vazifadagi uchinchi holatni qo'shing"],
  ['3-qadamda ikki test qizil', "99 000 testida etalon xato (15 000 bo'lishi kerak)"],
  ['Tests: 3 passed', "order.spec.ts o'chirilgan — mayli, uchtasi ham yetarli"],
];
const P3_PROOF = { label: 'Qizil testning nomi (● satridan)', placeholder: 'qizil it nomini yozing', check: (v) => /100\s?000/.test(v) && /bepul/i.test(v), wrong: "● satridagi › belgisidan keyingi nomni yozing — u qaysi summani sinaydi?" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={DEL_FILES} />; }

// ============================================================
//  17 · Sinfdagi tuzoqlar: joy, nom, npm ci
// ============================================================
const CI17 = jt(String.raw`
$ npm ci
npm error code EUSAGE
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: @nestjs/jwt@11.0.2 from lock file
npm error Missing: bcrypt@6.0.0 from lock file
$ npm install
…  (o'rnatildi)`.replace(/\\`/g, '`'), { 3: { id: 'c' } });
const TRAP17 = [
  ['Fayl loyiha ildizida', 'order.spec.ts (src/ dan tashqarida)', 'No tests found — rootDir: src'],
  ['Nomi .test.ts', 'src/order.test.ts', 'No tests found — testRegex: .spec.ts'],
  ['npm ci', 'lock fayl sinxron emas', 'npm install'],
];
const S17 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2] }, { hl: [0, 1, 2] }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    <div className="pg-three">{TRAP17.map(([h, w, r], i) => <div key={i} className={`mk-box${seg.hl.includes(i) ? ' hl' : ''}`} style={{ '--c': [T.accent, T.yellow, PG.pg][i], opacity: seg.hl.length && !seg.hl.includes(i) ? 0.4 : 1 }}><h4>{h}</h4><p><code>{w}</code></p><p style={{ marginTop: 6 }}>{r}</p></div>)}</div>
    {(seg.hl.includes(0) && !seg.hl.includes(2)) && <Term er lines={NOTESTS.slice(3)} focus={['nt', 'rx']} />}
    {seg.hl.includes(2) && seg.hl.length === 1 && <Term er lines={CI17} focus={['c']} />}
    {seg.hl.length === 3 && <div className="mk-rule"><code>No tests found</code> — joy va nom · <code>npm ci</code> xatosi — <code>npm install</code>. Ikkalasi kodda emas, sozlamada.</div>}
  </>} />;
}

// ============================================================
//  18 · Nest bo'lmagan loyiha: to'rt qadamli zanjir (jest1-out/12–15, 20)
// ============================================================
const CHAIN18 = [
  { cmd: 'npm i -D jest ts-jest · "test": "jest"', out: 'Must use import to load ES Module', fix: 'npx ts-jest config:init' },
  { cmd: 'npx ts-jest config:init', out: "TS2593: Cannot find name 'describe'", fix: 'npm i -D @types/jest typescript' },
  { cmd: 'npm i -D typescript @types/jest', out: 'The TypeScript compiler "typescript" (version 7.0.2) does not expose the JavaScript compiler API required by ts-jest', fix: 'npm i -D typescript@5' },
  { cmd: 'npm i -D typescript@5', out: 'PASS ./order.spec.ts · ✓ 2 kitob narxini hisoblaydi', fix: '', ok: true },
];
const S18 = mkS(18, [{ upto: -1 }, { upto: 0 }, { upto: 2 }, { upto: 3 }, { upto: 3, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div className="pg-two">
    <Ide root="bosh" files={["node_modules/", "jest.config.js", "order.spec.ts", "order.ts", "package.json"]} active="order.spec.ts"><CodePanel file="order.spec.ts" wrap lines={ORDER_SPEC} /></Ide>
    <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
      {CHAIN18.map((c, i) => i <= seg.upto && <div key={i} className="mk-step" style={{ animation: 'mk-up .4s ease both', borderColor: c.ok ? T.green : T.accent }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: c.ok ? T.green : T.accent, minWidth: 20 }}>{i + 1}</span>
        <div className="t"><b><code>{c.cmd}</code></b><div style={{ fontFamily: MONO, fontSize: 12, color: c.ok ? T.green : T.accent, margin: '4px 0' }}>{c.out}</div>{c.fix && <div className="exp">→ keyingi: <code>{c.fix}</code></div>}</div>
      </div>)}
      {seg.upto >= 2 && <div className="mk-tag" style={{ margin: 0 }}>To'rt paket bitta buyruqda o'rnatilsa — TypeScript 6.0.3; u ham TS2593 beradi. ts-jest uchun — TypeScript 5.</div>}
      {seg.sum && <div className="mk-rule">Testni <b>o'quvchi reposida</b> yozdiring — u yerda hammasi tayyor (TypeScript 5.9).</div>}
    </div>
  </div>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — TypeScript 7
// ============================================================
function Screen19(p) {
  const m = MDT[19];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija — bo'sh loyiha</div>
      <Term lines={jt(String.raw`
$ npm i -D typescript@5
typescript 5.9.3
$ npm test
PASS ./order.spec.ts
  orderTotal
    ✓ 2 kitob narxini hisoblaydi (2 ms)`)} />
    </div>} />;
}

// ============================================================
//  20 · Amaliyot 4 — No tests found
// ============================================================
const P4 = mkS(20, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P4_STEPS = [
  { t: "Ildizga — order.spec.ts → loyiha ildizi, import './src/order'", cmds: [], exp: "fayl ko'chdi" },
  { t: 'Sinash', cmds: ['npm test'], exp: 'No tests found, exiting with code 1' },
  { t: 'Nom — src/order.test.ts', cmds: ['npm test'], exp: 'No tests found' },
  { t: 'Tiklash — src/order.spec.ts', cmds: ['npm test'], exp: 'PASS' },
];
const P4_TROUBLE = [
  ['2-qadamda PASS', "src/ da eski nusxa qolgan (ikkita fayl) — bittasini o'chiring"],
  ['delivery.spec.ts ham yurdi', "PASS src/delivery.spec.ts — u joyida, bu normal; order yo'qligiga qarang"],
];
const P4_PROOF = { label: 'Xabarning birinchi satri', placeholder: 'npm test natijasining birinchi qatorini qo\'ying', check: (v) => /No tests found/i.test(v), wrong: "Jest testni topmaganda nima deydi? O'sha birinchi qatorni nusxalang" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }

// ============================================================
//  21 · m4b-01 xaritasi
// ============================================================
const MAP21 = [
  { t: 'Kirish', s: 's0–s1', d: 'qo\'lda vs test · reja (4 qadam)', m: '' },
  { t: 'Tushuncha', s: 's2–s4', d: 'funksiya — mashina · Jestbot poygasi (5 hisob qo\'lda vs bitta buyruq) · test', m: "Jest reposida tayyor (3-ekran)" },
  { t: 'Yozish', s: 's5–s11', d: "o'rnatish (npm i -D jest ts-jest) · test fayli (4 qism) · expect · varaqa (yolg'on PASS) · npm test · 2 test", m: 'joy va nom (4, 17-ekran) · haqiqiy PASS chiqishi (6-ekran)' },
  { t: 'Buzish', s: 's12–s15', d: "AAA · FAIL (* → +) · test · AI yolg'on testlari", m: "FAIL o'qish tartibi (8-ekran) · kim xato (9-ekran)" },
  { t: 'Yakun', s: 's16–s17', d: "etalon kartochkasi + noto'g'ri etalon · amaliyot o'z loyihasida · kartochkalar · uyga vazifa deliveryFee", m: 'chegara (13-ekran)' },
];
const S21 = mkS(21, [{ hl: [] }, { hl: [2] }, { hl: [3] }, { hl: [4], sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP21.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.sum && <div className="mk-rule">Amaliyot oldidan: repo <code>npm install</code> bilan · test <code>src/</code> ichida · nomi <code>.spec.ts</code></div>}
  </div>} />;
}

// ============================================================
//  22 · O'quvchi darsidagi so'zlar
// ============================================================
const DICT22 = [
  ['mashina — kirish → chiqish', 'funksiya'], ['Jestbot — sinovchi robot', 'Jest (npm test)'], ['robot papkasi — qaysi mashina sinaladi', 'describe'],
  ['sinov varaqasi — nima tekshiriladi', 'it'], ['etalon kartochkasi — qanday chiqish kutiladi', 'expect(…).toBe(…)'], ["yolg'on test", "expect'siz yoki noto'g'ri etalon"],
  ['Tayyorlash → Chaqirish → Tekshirish', 'AAA'],
];
const S22 = mkS(22, [{ rows: [] }, { rows: [0, 2, 3, 4] }, { rows: [5, 6] }, { rows: [4], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama</th></tr></thead><tbody>
      {DICT22.map(([a, b], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td></tr>)}
    </tbody></table>
    {seg.sum && <div style={{ marginTop: 12, display: 'grid', gap: 8 }}><CodePanel file="order.spec.ts" lines={ORDER_SPEC} focus={['exp']} /><div className="mk-rule">«Etalon kartochkasi, <b>ya'ni expect</b>» — va shu satrni ko'rsating. Terminalda so'zlar inglizcha: PASS, FAIL, Expected, Received.</div></div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi npm i -D jest ts-jest (jest1-out/11)
// ============================================================
const INST23 = jt(String.raw`
--- oldin   jest 30.4.2 · ts-jest 29.4.11
$ npm i -D jest ts-jest
--- keyin   jest 30.5.2 · ts-jest 29.4.15
$ npm test
PASS src/delivery.spec.ts
PASS src/order.spec.ts
Tests:       4 passed, 4 total`, { 1: { id: 'v' }, 3: { id: 'v' } });
const S23 = mkS(23, [{ v: 'card' }, { v: 'run' }, { v: 'run', tip: true }, { v: 'run', tip: true, sum: true }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    <div className="pg-two">
      <div className="mk-card"><h5>O'quvchi darsi · 5-ekran</h5><div style={{ fontSize: 14, lineHeight: 1.6 }}><code>npm i -D jest ts-jest</code> · <code>package.json</code>: <code>"test": "jest"</code></div></div>
      <div className="mk-card" style={{ borderColor: T.green }}><h5 style={{ color: T.green }}>O'quvchi reposida allaqachon</h5><div style={{ fontSize: 14, lineHeight: 1.6 }}>jest 30 · ts-jest 29 · <code>"test": "jest"</code> · <code>jest</code> bo'limi</div></div>
    </div>
    {seg.v === 'run' && <Term lines={INST23} focus={['v']} />}
    {seg.tip && <div className="mk-rule">O'quvchi buyruqni bajaraversin — zarari yo'q. Siz: «Nest loyihasi Jest'ni oldindan qo'ygan, bu buyruq uni yangilaydi».</div>}
    {seg.sum && <div className="n2-warn">Bo'sh loyihada bu ikki qadam <b>yetarli emas</b> — 18-ekrandagi zanjir.</div>}
  </>} />;
}

// ============================================================
//  24 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const STUMBLE24 = [
  ['Test topilmadi', 'No tests found', 'src/ ichida, .spec.ts'],
  ["O'rnatish", 'npm ci … in sync', 'npm install'],
  ["Yolg'on yashil", "PASS, lekin expect yo'q", 'har it da expect'],
  ["Qizil, kod to'g'ri", "Expected noto'g'ri", 'etalonni qo\'lda hisoblash'],
  ['Chegara', 'faqat aynan qiymat qizil', 'uch test: yuqori · aynan · past'],
  ["Bo'sh loyiha", "ESM · describe · TypeScript 6/7", "o'quvchi reposida yozish yoki 3 buyruq"],
];
const QA24 = [
  ['«Test kodni tuzatadimi?»', "yo'q, faqat xabar beradi; tuzatish — sizniki."],
  ['«Har funksiyaga test kerakmi?»', "hisob, shart va pul bor joyga — albatta; oddiy uzatuvchi funksiyaga shart emas."],
  ['«toBe va === farqi?»', "toBe ham qat'iy solishtiradi (Object.is), lekin natijani Jest'ga xabar qiladi: PASS yoki FAIL; === faqat true/false."],
  ['«Jest faqat Nest uchunmi?»', "yo'q, istalgan JavaScript/TypeScript loyihasi; Nest'da tayyor sozlangan."],
  ['«AI test yozsa bo\'ladimi?»', "ha, lekin har testga ikki savol: expect bormi, etalon to'g'rimi."],
];
const S24 = mkS(24, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5], qa: true }]);
function Screen24(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE24.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>terminaldagi xabarni o'quvchi bilan birga o'qing</b>.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA24.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
// ============================================================
//  25 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[25].final;
function Screen25(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan uchtasi sinfdagi tuzoqlar bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4b-01 dagi testlar va sinfdagi tuzoqlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  26 · Yakun (M13)
// ============================================================
const SUM26 = [
  { k: 'ut', t: "Unit-test — bitta funksiya, kirish va etalon; Jest o'quvchi reposida tayyor: src/ ichida, .spec.ts", st: ['fn', 'spec'] },
  { k: 'die', t: "describe — kim, it — qaysi holat, expect(…).toBe(…) — nima kutiladi; yagona tekshiruvchi — expect", st: ['spec'] },
  { k: 'pass', t: "PASS: fayl · guruh · ✓ holat · Tests: jami", st: ['run', 'res'] },
  { k: 'fail', t: "FAIL: ● satr → Expected / Received → funksiya; kim xato — kodmi, etalonmi", st: ['res', 'fn'] },
  { k: 'fake', t: "Yolg'on testlar va chegara: expect'siz yashil · noto'g'ri etalon qizil · shartga uch test; AI testiga ikki savol", st: ['spec', 'res'] },
  { k: 'trap', t: "Sinf: No tests found — joy va nom · npm ci → npm install · bo'sh loyihada config:init, @types/jest, typescript@5", st: ['run'] },
];
const STATIONS26 = [['fn', 'order.ts', T.blue], ['spec', 'order.spec.ts', T.purple], ['run', 'npm test', T.ink], ['res', 'PASS / FAIL', T.green]];
function SummaryMap26({ hl }) {
  const cur = SUM26.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — test yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS26.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK26 = [
  { t: "Funksiya: src/discount.ts — o'z shartingiz (masalan 200 000 dan oshsa −10 %)", c: [] },
  { t: 'Testlar: src/discount.spec.ts — 3 ta it: yuqori · aynan chegara · past', c: ['npm test'] },
  { t: 'Buzish: shartni buzing → aynan chegara qizil → tuzating', c: ['npm test'] },
  { t: "Uyga vazifa namunasi: src/delivery.ts + src/delivery.spec.ts (o'quvchi vazifasi)", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "unit-testlar"', 'git push'] },
];
const CHEATSHEET26 = `# Jest-1 — mentor eslatmasi (o'quvchi reposida birinchi unit-test)
## Jest o'quvchi reposida tayyor (package.json)
"test": "jest" · "rootDir": "src" · "testRegex": ".*\\.spec\\.ts$" · "transform": ts-jest → test fayli src/ ichida, nomi .spec.ts
O'rnatish: npm install (npm ci bu repoda yiqiladi — lock sinxron emas)
## Test fayli
import { orderTotal } from './order'; · describe('orderTotal', () => { it('2 kitob narxini hisoblaydi', () => { expect(orderTotal(10000, 2)).toBe(20000); }); });
AAA: Tayyorlash → Chaqirish → Tekshirish
## Natijani o'qish
PASS src/order.spec.ts → guruh → ✓ holat → Tests: 1 passed, 1 total
FAIL: ● guruh › holat → Expected (etalon) / Received (funksiya qaytargan) → > satr → order.spec.ts:6:20 (test yiqilgan joy; xato funksiyada bo'lishi mumkin)
## Yolg'on testlar
expect yo'q (console.log) → doim PASS · noto'g'ri etalon (10002) → to'g'ri kod bilan FAIL → «kim xato?» — etalonni qo'lda hisoblang
AI testiga ikki savol: expect bormi? etalon to'g'rimi?
## Chegara
deliveryFee: total >= 100000 ? 0 : 15000 → uch test: 150 000 · aynan 100 000 · 99 000; >= o'rniga > — faqat aynan 100 000 qizil
## Sinfdagi tuzoqlar
No tests found — fayl src/ dan tashqarida yoki nomi .test.ts · Cannot find module './orders' — import nomi · TS1005 — qavs
Bo'sh loyiha (Nest emas): Must use import to load ES Module → npx ts-jest config:init → Cannot find name 'describe' → npm i -D @types/jest → TypeScript 6/7 ts-jest bilan ishlamaydi → npm i -D typescript@5
O'quvchi darsidagi npm i -D jest ts-jest — Nest reposida zararsiz (versiya ko'tariladi)
## O'quvchi darsidagi so'zlar
mashina = funksiya · Jestbot = Jest · robot papkasi = describe · sinov varaqasi = it · etalon kartochkasi = expect · yolg'on test
## Sizning uyga vazifangiz
discount.ts + 3 test (chegara bilan) + bir marta qizil → yashil + deliveryFee testlari → GitHub → repo linki platformadagi uyga vazifaga`;
const s26Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Unit-test — bitta funksiya; Jest o'quvchi reposida <b>tayyor</b>", "Birinchi: unit-test bitta funksiyani kirish va etalon bilan sinaydi. Jest o'quvchi reposida tayyor, test fayli src ichida va nomi spec ts bilan.", { hl: 'ut' }),
  sg('b2', "describe, it va <b>expect</b> — yagona tekshiruvchi expect", "Ikkinchi: describe qaysi funksiya, it qaysi holat, expect nima kutilayotganini aytadi. Haqiqatan tekshiradigan yagona qator expect.", { hl: 'die' }),
  sg('b3', "PASS: fayl, guruh, <b>holat va jami</b>", "Uchinchi: PASS natijasida fayl, guruh, belgi bilan holat va pastda jami. Tests satri nechta it tekshirilganini aytadi.", { hl: 'pass' }),
  sg('b4', "FAIL: <b>Expected va Received</b>, keyin «kim xato» savoli", "To'rtinchi: FAIL'ni tartib bilan o'qing. Nuqtali satr, expected va received, keyin funksiya. Har FAIL'da savol: kod xatomi yoki etalon.", { hl: 'fail' }),
  sg('b5', "Yolg'on testlar va <b>chegara</b> — uch test va ikki savol", "Beshinchi: expect'siz test doim yashil, noto'g'ri etalon to'g'ri kodni qizil qiladi. Shart bor joyda uchta test, aynan chegara bilan. AI testiga ikki savol.", { hl: 'fake' }),
  sg('b6', "Sinf: <b>joy va nom</b>, npm install, bo'sh loyiha zanjiri", "Oltinchi, sinf uchun: no tests found bo'lsa joy va nom. Npm ci yiqilsa npm install. Bo'sh loyihada uch qo'shimcha buyruq, TypeScript besh bilan.", { hl: 'trap' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z funksiyangiz va uchta test, chegara bilan", "Uyga vazifa: o'quvchi reposida o'z funksiyangizni yozing, masalan chegirma: summa ikki yuz mingdan oshsa o'n foiz. Shart bor, shuning uchun uchta test: yuqori, aynan chegara va past. Bir marta chegarani ataylab buzib qizilni ko'ring, keyin tuzating.", { hl: 'hw' }),
  sg('hw2', "Delivery fee testlarini qo'shing va <b>repo linkini platformaga</b> qo'ying", "Delivery fee testlarini ham qo'shing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: sozlama, test fayli, PASS/FAIL va tuzoqlar — bir sahifada", "Pastda bir sahifalik eslatma: Jest sozlamasi, test fayli namunasi, natijani o'qish, yolg'on testlar, chegara va sinfdagi tuzoqlar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen26(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET26;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jest-1-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s26Segments(passed), [passed]);
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
            <SummaryMap26 hl={hl} />
            <div className="mk-plan">{SUM26.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK26.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> har it da expect · chegara qiymati sinalgan · etalonlar qo'lda hisoblanganga mos.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Jest: edge cases va error path</div><div style={{ fontSize: 13.5, color: T.ink2 }}>toThrow — xato holatlarni sinash, o'quvchi m4b-03 uchun</div></div>
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
        {["Jami taxminan 1 soat: ovoz ~21 daqiqa · to'rt amaliyot 35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Nest darslari o'tilgan · o'quvchi reposi (IntroNestArxitechture) · Node.js 20+ · VS Code", "Loyiha: o'quvchi reposi — testlar src/ ichida, misol o'quvchi m4b-01 dagi orderTotal"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP1, Screen8, Screen9, Screen10, Screen11, ScreenP2, Screen13, Screen14, Screen15, ScreenP3, Screen17, Screen18, Screen19, ScreenP4, Screen21, Screen22, Screen23, Screen24, Screen25, Screen26];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function JestUnitMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
