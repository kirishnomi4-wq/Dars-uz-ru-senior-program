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
//  PG-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg2-matn.py (manba: 08-PostgreSQL2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · PostgreSQL",
  "title": "Jadval tayyor. Endi uni boshqaramiz — PostgreSQL terminalida va Express ichida.",
  "seg": [
   [
    "a",
    "PostgreSQL-1 da jadval yaratdingiz — bugun undagi ma'lumotni <b>to'rt buyruq bilan boshqaramiz</b>",
    "Assalomu alaykum. Oldingi darsda PostgreSQL'ni o'rnatdingiz, jadval yaratdingiz va bog'ladingiz. Bugun jadvaldagi ma'lumotni boshqaramiz: qo'shish, ko'rish, o'zgartirish va o'chirish. Buni CRUD deyishadi, uning nimaligini keyingi ekranda aniq ko'ramiz."
   ],
   [
    "b",
    "Avval PostgreSQL terminalida qo'lda: o'quvchi m4-06 dagi <b>do'konning o'zi bilan</b>",
    "Avval bu buyruqlarni PostgreSQL terminalida qo'lda yozamiz. Misol o'quvchi m4-06 darsidagi do'konning aynan o'zi: klaviatura, sichqoncha, quloqchin. Sinfda o'quvchi ekranda ko'radigan narsani siz bazada ko'rgan bo'lasiz."
   ],
   [
    "c",
    "Keyin o'sha so'rovlar <b>Express ichida</b> — o'quvchi m4-08 da AvtoIjara serverini quradi",
    "Keyin xuddi shu so'rovlarni Express serveri ichiga qo'yamiz. O'quvchi m4-08 darsida AvtoIjara uchun server quradi, kodini Gemini yozadi. Siz bu serverni o'zingiz ishga tushirasiz, ataylab buzasiz va tuzatasiz."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor. Oxirida ikki o'quvchi darsini qanday o'tishni ko'ramiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
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
    "PostgreSQL'da har amalning o'z buyrug'i bor. Yaratish insert, o'qish select, o'zgartirish update, o'chirish esa delete. Har buyruqdan keyin baza qisqa javob qaytaradi, masalan insert nol bir yoki update bir. Bu javobni o'qishni bugun alohida o'rganamiz."
   ],
   [
    "c",
    "Serverda xuddi shu to'rt amal <b>endpoint bo'ladi</b>: <code>POST</code>, <code>GET</code>, <code>PUT</code>, <code>DELETE</code>",
    "Serverda xuddi shu to'rt amal endpoint bo'ladi. Yaratish POST, o'qish GET, o'zgartirish PUT, o'chirish DELETE. Har endpoint ichida o'sha SQL buyrug'i turadi. Postman javobida esa status chiqadi: yaratilganda ikki yuz bir, qolganlarida ikki yuz."
   ],
   [
    "d",
    "Xulosa: har amalning bazada bitta buyrug'i, serverda <b>bitta endpoint'i bor</b>",
    "Xulosa: CRUD to'rtta amaldan iborat. Har amalning PostgreSQL'da bitta buyrug'i va serverda bitta endpoint'i bor. Demak, bugun avval buyruqlarni PostgreSQL terminalida qo'lda yozamiz, keyin xuddi shularni Express serveri ichiga qo'yamiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
  "title": "products — o'quvchi darsidagi jadval aynan",
  "seg": [
   [
    "a",
    "O'quvchi m4-06 da <b>shu jadvalni ko'radi</b>: id, nom, narx va qoldiq",
    "Jadvaldan boshlaymiz. O'quvchi m4-06 darsida aynan shu jadvalni ko'radi. Uning nomi products, unda to'rtta ustun bor: id o'zi o'sadi, nomi matn, narxi va qoldig'i esa butun son. Siz shop degan bazada uni PostgreSQL terminalida yaratasiz."
   ],
   [
    "b",
    "Bitta <code>INSERT</code> bilan uch qator; javobdagi oxirgi raqam — <b>qo'shilgan qatorlar soni</b>",
    "Bitta insert bilan uchta mahsulot qo'shamiz, xuddi o'quvchi darsidagidek. Baza javobi insert, nol, uch. Oxirgi raqam nechta qator qo'shilganini aytadi. Keyin to'rtinchi mahsulotni qo'shamiz: Mishka, narxi ellik ming so'm."
   ],
   [
    "c",
    "<code>SELECT *</code> — hamma ustun; <code>id</code> larni biz yozmadik, <b>baza o'zi berdi</b>",
    "Select yulduzcha hamma ustunni ko'rsatadi. id ustunini biz yozmadik, baza o'zi bir, ikki, uch, to'rt deb berdi. O'quvchi «id'ni qayerdan oldik?» desa, javob shu: serial."
   ],
   [
    "d",
    "Xulosa: jadval va ma'lumot o'quvchi darsidagidek — lekin ustunlarda <b><code>NOT NULL</code> yo'q</b>",
    "Xulosa: bazangizda o'quvchi darsidagi do'konning aynan o'zi bor. Bitta narsani eslab qoling: bu jadvalda not null qoidasi yo'q. Nima bo'lishini uchinchi bosqichda ko'ramiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
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
    "Minglab mahsulotdan faqat keraklisini olish uchun where yoziladi. Narxi yuz mingdan kam bo'lganlarini so'raymiz: sichqoncha, quloqchin va mishka, ya'ni uchta qator. O'quvchi darsida bu filtr tugma bilan, siz esa uni so'rovda yozdingiz."
   ],
   [
    "c",
    "<code>WHERE stock &lt; 6</code> — tugayotgan mahsulot: <b>faqat quloqchin</b>",
    "Ikkinchi filtr qoldig'i oltidan kam, ya'ni tugayotgan mahsulotlarni topadi. Natijada faqat quloqchin chiqdi, undan beshta qolgan. Do'kon menejeri aynan shu so'rov bilan nimani buyurtma qilishni biladi."
   ],
   [
    "d",
    "Xulosa: <code>SELECT</code> faqat o'qiydi; <b><code>WHERE</code> qatorlarni tanlaydi</b>",
    "Xulosa: select hech narsani o'zgartirmaydi, faqat o'qiydi. Where qaysi qatorlar kerakligini aytadi. Bu ikkisini yaxshi tushungan o'quvchi update va delete'ni ham oson tushunadi, chunki ularda ham aynan shu where ishlaydi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
  "title": "UPDATE 1, DELETE 1 — javobdagi son nechta qator tegilganini aytadi",
  "seg": [
   [
    "a",
    "Klaviatura arzonladi: <code>UPDATE … WHERE id = 1</code> — javob <b><code>UPDATE 1</code></b>, bitta qator",
    "O'quvchi darsidagi voqea: klaviatura narxi to'qson to'qqiz mingga tushdi. Buyruq shunday: update, set price, where id bir. Baza javobi update bir, ya'ni bitta qator o'zgardi. Javobdagi son doim nechta qator tegilganini aytadi."
   ],
   [
    "b",
    "Quloqchin sotuvdan chiqdi: <code>DELETE … WHERE id = 3</code> — <b><code>DELETE 1</code></b>",
    "Quloqchin sotuvdan chiqdi, uni o'chiramiz: delete from products, where id uch. Baza javobi delete bir. Endi select bilan jadvalni ko'ramiz."
   ],
   [
    "c",
    "Diqqat: Klaviatura ro'yxat oxiriga tushdi — <code>ORDER BY</code> bo'lmasa <b>tartib kafolatlanmaydi</b>",
    "Natijaga qarang: klaviatura birinchi emas, oxirida turibdi. Bu xato emas. Order by yozilmasa, baza qatorlarni istalgan tartibda qaytarishi mumkin. Sinfda o'quvchi «mahsulot o'rni o'zgardi» desa, javob shu. Tartib kerak bo'lsa, oxiriga order by id yoziladi."
   ],
   [
    "d",
    "Bunday <code>id</code> yo'q bo'lsa — <b>xato emas</b>, <code>UPDATE 0</code> va <code>DELETE 0</code>",
    "To'qson to'qqizinchi mahsulotni o'zgartirib ko'ramiz. Xato chiqmaydi, javob update nol. Delete ham nol qaytaradi. Baza «bunday qator yo'q» deb aytmaydi, shunchaki hech narsaga tegmaydi. Shuning uchun javobdagi sonni o'qish kerak."
   ],
   [
    "e",
    "Xulosa: har <code>UPDATE</code> va <code>DELETE</code>dan keyin <b>javobdagi sonni o'qing</b>",
    "Xulosa: update va delete'dan keyin javobdagi sonni o'qing. Bir bo'lsa, kutganingiz bo'ldi. Nol bo'lsa, where hech narsaga mos kelmadi. Kutilmagan katta son bo'lsa, where noto'g'ri yoki umuman yozilmagan. Buni keyingi bosqichda ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "O'quvchi: «UPDATE products SET price = 1 WHERE id = 99; yozdim — xato chiqmadi, UPDATE 0». Nima bo'ldi?",
  "q": "Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi to'qson to'qqizinchi mahsulot narxini o'zgartirmoqchi bo'ldi. Xato yo'q, javob: update nol. Nima bo'ldi? Variantni tanlang.",
  "ok": "To'g'ri. Where id to'qson to'qqiz hech qanday qatorga mos kelmadi, shuning uchun nol qator o'zgardi. Baza buni xato deb hisoblamaydi. O'quvchiga ayting: avval select bilan bunday id bor-yo'qligini tekshirsin. Demak, update nol xato emas: bu where hech qaysi qatorga mos kelmaganini bildiradi.",
  "okShort": "<code>UPDATE 0</code> — <code>WHERE</code> hech bir qatorga mos kelmadi. Xato emas: avval <code>SELECT … WHERE id = 99</code> bilan tekshiring.",
  "hint": "Javobdagi son nimani sanaydi? WHERE qaysi qatorni topishi kerak edi?",
  "correct": 0,
  "opts": [
   "id = 99 qator yo'q — WHERE hech narsaga mos kelmadi",
   "Narxni o'zgartirishga ruxsat yo'q",
   "Jadval bo'shab qoldi",
   "Narx o'zgardi, lekin hali saqlanmadi"
  ],
  "wrong": {
   "1": "Ruxsat yo'q bo'lsa ERROR:  permission denied for table products chiqardi; bu yerda xato yo'q.",
   "2": "Jadval joyida: UPDATE 0 hech narsani o'chirmaydi.",
   "3": "Tranzaksiyasiz UPDATE darhol saqlanadi; son esa nechta qator tegilganini aytadi."
  }
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "shop bazasi va CRUD — o'quvchi darsidagi to'rt voqea",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi darsidagi to'rt voqeani <b>o'z bazangizda bajarasiz</b>",
    "Endi navbat sizga. O'quvchi darsidagi to'rt voqeani o'z bazangizda bajarasiz: jadval yaratasiz, mahsulot qo'shasiz, filtrlaysiz, keyin narxni o'zgartirib, bitta mahsulotni o'chirasiz. Bunga o'n-o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–3-qadam: baza, jadval, mahsulotlar va <b>ikki filtr</b>",
    "Birinchi qadamda shop bazasi va products jadvalini yaratasiz. Ikkinchisida to'rtta mahsulot qo'shasiz. Uchinchisida ikkita filtr yozasiz: arzonlarini va tugayotganlarini. Har buyruqdan keyin javob satrini o'qing."
   ],
   [
    "c",
    "4-qadam: narx va o'chirish; isbot — oxirgi <code>SELECT</code>dagi <b>qatorlar soni</b>",
    "To'rtinchi qadamda klaviatura narxini o'zgartiring va quloqchinni o'chiring, keyin select yulduzcha. Isbot maydoniga oxirgi select natijasi ostidagi qatorlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz CRUD'ning to'rt buyrug'ini o'z bazangizda yozgan va har javobdagi sonni o'qigan bo'lasiz."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · xavfsiz sinash",
  "title": "WHERE unutilsa — UPDATE 3, DELETE 3. Xavfsiz sinash: BEGIN … ROLLBACK",
  "seg": [
   [
    "a",
    "O'quvchi darsi ogohlantiradi: <code>WHERE</code>'siz — <b>hamma qator</b>. Buni xavfsiz ko'ramiz",
    "O'quvchi darsida qizil ogohlantirish bor: update yoki delete'da where unutilsa, hamma qator o'zgaradi. Siz buni o'z ko'zingiz bilan ko'rishingiz kerak, lekin bazani buzmasdan. Usul: avval begin, ya'ni tranzaksiya ochamiz."
   ],
   [
    "b",
    "<code>WHERE</code>'siz <code>UPDATE</code> — <b><code>UPDATE 3</code></b>: hamma mahsulot to'qson to'qqiz ming",
    "Begin'dan keyin where'siz update. Baza javobi update uch. Select qilsak, hamma mahsulot to'qson to'qqiz ming so'm: sichqoncha ham, mishka ham. Mana o'quvchi darsidagi ogohlantirishning o'zi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz <code>DELETE</code> — <code>DELETE 3</code>, <b>jadval bo'sh</b>",
    "Undan ham yomoni where'siz delete. Baza javobi delete uch, select esa nol qator qaytaradi. Haqiqiy do'konda bu butun katalog yo'qolgani."
   ],
   [
    "d",
    "<code>ROLLBACK</code> — <b>hammasi joyida</b>: tranzaksiya ichidagi o'zgarish bekor bo'ldi",
    "Endi rollback yozamiz va select qilamiz: uchala mahsulot joyida, narxlari ham eski. Tranzaksiya ichida qilingan hamma narsa bekor bo'ldi. PostgreSQL-1 da tranzaksiya do'konni himoya qilgan edi, bu yerda u sizning sinov maydoningiz."
   ],
   [
    "e",
    "Xulosa: xavfli <code>UPDATE</code>/<code>DELETE</code>ni avval <b><code>BEGIN</code> ichida sinang</b>, <code>SELECT</code> bilan ko'ring",
    "Xulosa: xavfli update yoki delete'ni avval begin ichida yurgizing, select bilan natijani ko'ring. To'g'ri bo'lsa commit, noto'g'ri bo'lsa rollback. Sinfda o'quvchiga ham shuni o'rgating: bu bitta qator, lekin butun jadvalni saqlab qoladi."
   ]
  ]
 },
 "9": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "BEGIN; → DELETE FROM products; (DELETE 3) → ROLLBACK; → SELECT * FROM products;. Nima chiqadi?",
  "q": "Xavfsiz sinashni ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Begin, where'siz delete, javob delete uch. Keyin rollback va select. Jadvalda nima bor? Variantni tanlang.",
  "ok": "To'g'ri. Delete tranzaksiya ichida edi, rollback uni bekor qildi. Uchala mahsulot joyida. Commit yozilmaguncha o'zgarish saqlanmaydi. Demak, begin va rollback xavfli buyruqni bazani buzmasdan sinash imkonini beradi.",
  "okShort": "<code>ROLLBACK</code> — tranzaksiya ichidagi hamma o'zgarish bekor: uch qator joyida.",
  "hint": "ROLLBACK tranzaksiya ichidagi o'zgarishlar bilan nima qiladi?",
  "correct": 2,
  "opts": [
   "Nol qator — DELETE 3 bajarilgan edi",
   "Faqat bitta qator — oxirgisi qaytadi",
   "Uchala mahsulot — ROLLBACK o'chirishni bekor qildi",
   "ERROR — o'chirilgan jadvaldan o'qib bo'lmaydi"
  ],
  "wrong": {
   "0": "DELETE 3 tranzaksiya ichida edi va COMMIT qilinmadi.",
   "1": "ROLLBACK bitta qatorni emas, butun tranzaksiyani bekor qiladi.",
   "3": "DELETE qatorlarni o'chiradi, jadvalni emas; jadval doim joyida."
  }
 },
 "10": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 5–10 daqiqa",
  "title": "WHERE'siz UPDATEni xavfsiz sinang",
  "seg": [
   [
    "a",
    "Endi siz: <code>WHERE</code>'siz <code>UPDATE</code>ni o'z bazangizda, lekin <b>tranzaksiya ichida</b> qilasiz",
    "Endi o'zingiz: where'siz update'ni o'z bazangizda qilasiz, lekin tranzaksiya ichida. Bunga besh-o'n daqiqa ketadi. Bu mashqni sinfda o'quvchilarga ham ko'rsatasiz."
   ],
   [
    "b",
    "1–2-qadam: <code>BEGIN</code>, <code>WHERE</code>'siz <code>UPDATE</code> va <code>SELECT</code> — <b>hamma narx bir xil</b>",
    "Birinchi qadamda begin yozasiz. Ikkinchisida where'siz update qilib, select bilan hamma narx bir xil bo'lganini ko'rasiz. Commit yozmang."
   ],
   [
    "c",
    "3–4-qadam: <code>ROLLBACK</code> va <code>SELECT</code>; isbot — <b>klaviaturaning narxi</b>",
    "Uchinchi qadamda rollback yozasiz, to'rtinchisida yana select qilasiz. Isbot maydoniga klaviaturaning hozirgi narxini yozing, rollback'dan keyingisini."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz where'siz update qanday xavfli ekanini ko'rdingiz va rollback bilan hammasini qaytarishni o'rgandingiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · xatolar",
  "title": "Beshta xato — har birini xabarning o'zi aytadi",
  "seg": [
   [
    "a",
    "AI xatosi o'quvchi darsida bor: <code>product</code> — <b>bitta <code>s</code> yetmaydi</b>, jadval «yo'q»",
    "Endi sinfda chiqadigan xatolar. Birinchisi o'quvchi darsida ham bor: AI products o'rniga product deb yozgan. Baza relation product does not exist deb javob beradi. Jadval bor, faqat nomi bitta harfga farq qiladi."
   ],
   [
    "b",
    "Ustun nomi xato: <code>narx</code> — <code>HINT</code> esa <b>noto'g'ri ustunni taklif qiladi</b>",
    "Ikkinchisi ustun nomida. O'quvchi narx deb yozdi. Baza column narx does not exist deb javob beradi, ostida esa hint: perhaps you meant name. Diqqat: hint taxmin qiladi va bu yerda adashgan, kerakli ustun price. Hint'ni emas, jadval tuzilishini teskari chiziqcha d bilan tekshiring."
   ],
   [
    "c",
    "Son o'rniga matn va tushib qolgan qiymat — <b><code>invalid input syntax</code></b>, <code>more target columns</code>",
    "Uchinchisi: narx ustuniga arzon degan so'z yozilgan, baza invalid input syntax for type integer deydi. To'rtinchisi: uchta ustun yozilgan, qiymat esa ikkita, baza insert has more target columns than expressions deydi. Ikkalasida ham strelka xato joyni ko'rsatadi."
   ],
   [
    "d",
    "O'zbekcha apostrof satrni yopadi: <code>syntax error at or near \"yinchoq\"</code> — <b>ikki marta yoziladi</b>",
    "Beshinchisi, o'zbek sinfida eng ko'p uchraydigani: apostrof. O'yinchoq so'zidagi apostrof satrni yopib qo'yadi, baza yinchoq so'zida adashadi. Tuzatish: apostrofni ikki marta yozish. Shunda mahsulot saqlanadi."
   ],
   [
    "e",
    "Xulosa: xabar ichidagi nomni <b>jadval tuzilishi bilan solishtiring</b> — <code>\\d products</code>",
    "Xulosa: bu xatolarning hammasida xabar ichida nom yoki qiymat turadi. Uni jadval tuzilishi bilan solishtiring, teskari chiziqcha d products. Apostrof uchun bitta qoida: so'z ichidagi apostrof ikki marta yoziladi."
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "3-bosqich · xatolar",
  "title": "Qoida yozilmagan bo'lsa, baza qo'riqlamaydi: nomsiz mahsulot xato bermay saqlandi",
  "seg": [
   [
    "a",
    "PostgreSQL-1 da baza bo'sh nomni rad etgan edi — bu jadvalda esa <b>xato yo'q</b>",
    "PostgreSQL-1 da bo'sh username'ni baza rad etgan edi. Bu jadvalda sinab ko'ramiz: nomsiz mahsulot qo'shamiz. Xato chiqmadi, baza javobi insert nol bir."
   ],
   [
    "b",
    "<code>WHERE name IS NULL</code> — <b>bo'sh nomli qator</b> do'kon katalogida turibdi",
    "Where name is null bilan qidiramiz. Beshinchi qator chiqdi: nomi bo'sh, narxi o'ttiz ming. Saytda bu nomsiz mahsulot bo'lib chiqadi."
   ],
   [
    "c",
    "Sabab: o'quvchi darsidagi jadvalda <code>NOT NULL</code> yo'q — baza <b>faqat yozilgan qoidani</b> qo'riqlaydi",
    "Sabab jadvalning o'zida: o'quvchi darsidagi products'da not null yo'q. Baza faqat yozilgan qoidani qo'riqlaydi. PostgreSQL-1 dagi «baza o'zi tekshiradi» degan gap qoida yozilgandagina to'g'ri."
   ],
   [
    "d",
    "Xulosa: o'quvchi darsini o'zgartirmaysiz, lekin o'z jadvalida <b><code>NOT NULL</code> yozishni</b> maslahat berasiz",
    "Xulosa: o'quvchi darsidagi jadvalni o'zgartirmaysiz, u sodda bo'lishi uchun shunday. Lekin amaliyotda o'quvchi o'z do'koni jadvalini yaratadi. O'shanda maslahat bering: nom va narxga not null yozsin."
   ]
  ]
 },
 "13": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi VALUES ('O'yinchoq', 30000, 4) yozdi va syntax error at or near \"yinchoq\" oldi. Nima deysiz?",
  "q": "Xatolarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi o'yinchoq degan mahsulot qo'shmoqchi, baza syntax error, yinchoq so'zida. Unga nima deysiz? Variantni tanlang.",
  "ok": "To'g'ri. SQL'da matn bir tirnoq ichida, so'z ichidagi apostrof uni erta yopadi. Ikki marta yozilsa, baza uni bitta apostrof deb tushunadi va mahsulot o'yinchoq nomi bilan saqlanadi. Demak, SQL matnidagi har bir apostrof ikki marta yoziladi.",
  "okShort": "<code>'O''yinchoq'</code> — so'z ichidagi apostrof ikki marta. Saqlanganda bitta bo'ladi: <code>O'yinchoq</code>.",
  "hint": "Matn qaysi belgi bilan boshlanib, qaysi belgi bilan tugaydi? Apostrof shu belgining o'zi.",
  "correct": 1,
  "opts": [
   "Mahsulot nomini lotincha emas, kirillda yozing",
   "So'z ichidagi apostrofni ikki marta yozing: 'O''yinchoq'",
   "Nomni qo'shtirnoqqa oling: \"O'yinchoq\"",
   "name ustunining turini VARCHAR qiling"
  ],
  "wrong": {
   "0": "Muammo harfda emas, apostrofda: u matnni erta yopyapti.",
   "2": "Qo'shtirnoq SQL'da ustun yoki jadval nomi uchun — sinab ko'rdik: column \"O'yinchoq\" does not exist.",
   "3": "Ustun turi bu xatoga aloqasiz: xato matn yozilishida."
  }
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "m4-08: cars jadvali o'quvchining o'zi yozadi, server.js ni Gemini",
  "seg": [
   [
    "a",
    "PostgreSQL terminalidagi CRUD endi <b>server ichida</b>: o'quvchi m4-08 da AvtoIjara uchun quradi",
    "PostgreSQL terminalida qo'lda qildingiz, endi xuddi shu so'rovlar server ichida. O'quvchi m4-08 darsida avval cars jadvalini PostgreSQL terminalida o'zi yozadi: model, kunlik narx, yil va ijaradami. Keyin server kodini Gemini yozadi."
   ],
   [
    "b",
    "<code>Pool</code> — bazaga ulanish sozlamalari: foydalanuvchi, parol, baza nomi <b>bir joyda</b>",
    "Kodning tepasida pg paketidan Pool olinadi. Unga foydalanuvchi, parol, baza nomi, host va port beriladi. Parolni o'quvchi o'zi yozadi, PostgreSQL o'rnatilganda berilgan parol. Shuning uchun sinf paroli hammada bir xil bo'lsa, ishingiz oson."
   ],
   [
    "c",
    "<code>GET /api/cars</code>: <code>pool.query</code> so'rovni bazaga olib boradi, <b><code>rows</code></b> — javobga ketadi",
    "Endi GET api cars endpoint'i. Pool query select'ni bazaga olib boradi, natijaning rows qismi, ya'ni qatorlar, res json bilan qaytadi. Postman'da ikki yuz va uchta mashina. Bu PostgreSQL terminalidagi select'ning o'zi, faqat javob JSON ko'rinishida."
   ],
   [
    "d",
    "Xatoda <code>catch</code>: <b>status 500 va xato matni</b> — o'quvchi uni Postman'da ko'radi",
    "Pastda catch turibdi: xato bo'lsa, server besh yuz status va xato matnini qaytaradi. Bu muhim: sinfdagi xatolarning ko'pini o'quvchi aynan shu javobda ko'radi. Beshinchi bosqichda shu yo'l bilan buzamiz."
   ],
   [
    "e",
    "Xulosa: <code>Pool</code> → <code>pool.query</code> → <code>rows</code> → <code>res.json</code> — <b>server bazaga shu yo'l bilan ulanadi</b>",
    "Xulosa: so'rov serverdan bazaga to'rt qadamda boradi. Pool ulanadi, pool query so'rov yuboradi, rows qatorlarni oladi, res json javob qaytaradi. O'quvchi darsidagi test savoli ham shu haqda: serverni bazaga pool query ulaydi."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "To'rt endpoint — to'rt SQL buyruq; javob statusi bilan",
  "seg": [
   [
    "a",
    "<code>POST</code> — <code>INSERT … RETURNING *</code>: yangi qator javobda, <b>status 201</b>",
    "GET o'qiydi, qolgan uchtasi yozadi. POST'da insert, oxirida returning yulduzcha: baza yangi qatorni, id bilan, qaytaradi. Status ikki yuz bir, ya'ni yaratildi. Chevrolet Spark to'rtinchi id bilan qo'shildi."
   ],
   [
    "b",
    "<code>is_rented: null</code> — <code>POST</code>da berilmagan ustun bo'sh qoladi, <b><code>DEFAULT</code> yo'q</b>",
    "Javobga qarang: is rented null. POST'da bu ustun berilmadi, jadvalda esa default qiymat yo'q. Sinfda o'quvchi «nega null?» desa, javob shu. Kerak bo'lsa, jadvalda default false yoziladi."
   ],
   [
    "c",
    "<code>PUT</code> — <code>UPDATE … WHERE id = $2</code>, <code>DELETE</code> — <code>WHERE id = $1</code>: <b>200</b>",
    "PUT ikkinchi mashina narxini yangiladi, ikki yuz va yangilangan qator. DELETE birinchi mashinani o'chirdi, ikki yuz. Ikkalasida ham where bor, faqat id endi URL'dan keladi."
   ],
   [
    "d",
    "Yo'q <code>id</code>: kod <code>rowCount</code>ni tekshiradi va 404 qaytaradi — bu namunaning <b>to'g'ri qarori</b>",
    "To'qson to'qqizinchi mashina: to'rt yuz to'rt, mashina topilmadi. Nega? Baza update nol qaytaradi, xato emas. Bu namunada kod rowCount nolmi deb tekshiradi va to'rt yuz to'rt beradi. To'g'ri qaror: aks holda o'quvchi ikki yuz ko'rib, «o'zgardi» deb o'ylaydi. Gemini buni har doim ham yozmaydi."
   ],
   [
    "e",
    "Xulosa: GET — 200, POST — 201, PUT/DELETE — 200, <b>topilmasa — 404</b>, xato — 500",
    "Xulosa: GET ikki yuz, POST ikki yuz bir, PUT va DELETE ikki yuz qaytaradi; qator topilmasa to'rt yuz to'rt, xato bo'lsa besh yuz. Har biri PostgreSQL terminalidagi bitta buyruq. Javobdagi son, ya'ni rowCount, PostgreSQL terminalidagi update bir yoki update nol'ning o'zi."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "Yopishtirilgan SQL: 1 OR 1=1 — uchala mashina o'chdi. $1 bilan — 500, jadval joyida",
  "seg": [
   [
    "a",
    "O'quvchi testida savol bor: «Nega <code>$1</code>?». <b>Sinab ko'rdik</b> — javob ekranda",
    "O'quvchi darsining testida savol bor: nega dollar bir ishlatamiz? Javob: matn kod bo'lib qolmasin. Bu quruq gap emas, sinab ko'rdik. Delete'da id'ni SQL matniga to'g'ridan-to'g'ri yopishtirdik."
   ],
   [
    "b",
    "URL'ga <code>1 OR 1=1</code> yozildi — so'rov «hammasi» bo'lib qoldi: <b><code>deleted: 3</code></b>",
    "Endi URL'da id o'rniga bir or bir teng bir yuborildi. Yopishtirilgan satr shunday SQL bo'ldi: where id bir, yoki bir teng bir. Bir teng bir doim to'g'ri. Javob ikki yuz, deleted uch, ya'ni jadval bo'sh qoldi. Buni SQL injection deyishadi."
   ],
   [
    "c",
    "<code>$1</code> bilan xuddi shu so'rov: <code>invalid input syntax for type integer</code> — 500, <b>jadval joyida</b>",
    "Endi dollar bir bilan. Qiymat SQL matniga kirmaydi, alohida beriladi. Baza bir or bir teng bir'ni son sifatida o'qishga urinadi va rad etadi: invalid input syntax for type integer. Besh yuz, lekin jadval joyida, uchala mashina bor."
   ],
   [
    "d",
    "Xulosa: qiymat doim <b><code>$1, $2</code> bilan</b> — Gemini promptida ham shunday yozilgan",
    "Xulosa: foydalanuvchidan kelgan har qiymat dollar bir, dollar ikki bilan beriladi. O'quvchi darsidagi Gemini promptida ham shunday talab bor: qiymatlarni SQL matniga yopishtirma. Gemini boshqacha yozsa, o'quvchi buni tekshirishi kerak, siz esa shu misolni ko'rsatasiz."
   ]
  ]
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 15–20 daqiqa",
  "title": "car_rental va server.js — o'quvchi m4-08 dagi ish",
  "seg": [
   [
    "a",
    "Endi siz: m4-08 dagi ishni <b>o'zingiz qilasiz</b> — jadval qo'lda, server Gemini bilan yoki namunadan",
    "Endi o'zingiz qilasiz, o'quvchi m4-08 da qiladigan ishni. Jadvalni PostgreSQL terminalida qo'lda yozasiz. Server kodini o'quvchi promptlari bilan Gemini'dan oling yoki namunani o'zingiz yozing. O'n besh-yigirma daqiqa."
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
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi bosqichda bu xatolarning hammasini buzib ko'ramiz. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda o'quvchi m4-08 da quradigan server ishlab turadi va siz uni Postman bilan sinagan bo'lasiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "column \"price\" of relation \"cars\" does not exist — kodda price, jadvalda daily_price",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi AI xatosini o'zimiz takrorlaymiz: <b><code>INSERT</code>da <code>price</code></b>",
    "Buzishni o'quvchi darsidagi xatodan boshlaymiz. Gemini insert'da daily price o'rniga price yozgan. Serverni ishga tushiramiz: xato yo'q, server ishlayapti deb yozadi. Xato faqat POST yuborilganda chiqadi."
   ],
   [
    "b",
    "POST → 500, xabarda <b>jadval va ustun</b>: <code>\"price\"</code> · <code>\"cars\"</code>",
    "POST yuboramiz, javob besh yuz. Xabarni o'qiymiz: column price of relation cars does not exist. Ustun price, jadval esa cars. O'quvchi darsida xabar qisqaroq yozilgan, haqiqiysi shu, relation cars bilan."
   ],
   [
    "c",
    "Tuzatish: kodda <code>daily_price</code> — serverni qayta ishga tushirib, <b>POST → 201</b>",
    "Jadval tuzilishiga qaraymiz: ustun daily price. Kodda tuzatamiz, serverni to'xtatib, qayta ishga tushiramiz. POST yuboramiz: javob ikki yuz bir, yangi mashina id bilan qaytdi."
   ],
   [
    "d",
    "Xulosa: 500 bo'lsa — <code>error</code> matnidagi nomni <b><code>\\d cars</code> bilan solishtiring</b>",
    "Xulosa: besh yuz chiqsa, xato matnini o'qing, ichida ustun va jadval nomi bor. Uni PostgreSQL terminalidagi teskari chiziqcha d cars bilan solishtiring. Kod o'zgargandan keyin serverni albatta qayta ishga tushiring."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Cannot destructure property 'model' of 'req.body' — so'rov tanasi o'qilmagan",
  "seg": [
   [
    "a",
    "Bitta satrni olib tashlaymiz: <code>app.use(express.json())</code> — <b>server baribir ishga tushadi</b>",
    "Endi ikkinchi buzish. Gemini ba'zan bitta satrni unutadi: app use express json. Shu satrni olib tashlaymiz. Server xatosiz ishga tushadi, GET ham ishlaydi. Muammo faqat tanasi bor so'rovlarda."
   ],
   [
    "b",
    "POST → 500: <code>req.body</code> — <b><code>undefined</code></b>, <code>model</code>ni olib bo'lmaydi",
    "POST yuboramiz, javob besh yuz. Xabar shunday: cannot destructure property model of req body as it is undefined. Ya'ni req body umuman yo'q: Express so'rov tanasini o'qimagan, chunki json'ni o'qiydigan qism ulanmagan."
   ],
   [
    "c",
    "Tuzatish: satr qaytariladi, <code>app</code> yaratilgandan keyin — <b>POST → 201</b>",
    "Tuzatish uchun app use express json satrini app yaratilgandan keyin, endpoint'lardan oldin qaytaramiz. Server qayta ishga tushadi, POST ikki yuz bir."
   ],
   [
    "d",
    "Xulosa: <code>req.body</code> <code>undefined</code> bo'lsa — birinchi qaraladigan joy <b><code>express.json()</code></b>",
    "Xulosa: req body undefined degan xato chiqsa, birinchi qaraladigan joy app use express json. GET ishlab, POST va PUT ishlamasa ham shu satr. O'quvchi darsidagi Gemini promptining birinchi bandi aynan shu."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Server «ishlayapti» deydi — parol, baza va PostgreSQL xatosi birinchi so'rovda chiqadi",
  "seg": [
   [
    "a",
    "<code>Pool</code> darhol ulanmaydi: server ishga tushadi, <b>xato birinchi so'rovda</b>",
    "Parol xatosini ko'rdik, endi uning g'alati tomoni. Pool server ishga tushganda bazaga ulanmaydi, birinchi so'rovda ulanadi. Shuning uchun parol xato bo'lsa ham terminalda server ishlayapti deb yoziladi. O'quvchi «server ishlayapti, lekin besh yuz» desa, xabarni o'qing."
   ],
   [
    "b",
    "Parol xato — <b><code>password authentication failed</code></b>; parol bo'sh — <b><code>client password must be a string</code></b>",
    "Parol xato bo'lsa: password authentication failed for user postgres. Parol umuman berilmasa, masalan process env'dan o'qilmagan bo'lsa: client password must be a string. Ikkinchisi g'alati ko'rinadi, lekin ma'nosi oddiy: parol o'zgaruvchisi bo'sh."
   ],
   [
    "c",
    "Baza nomi xato — <code>database \"carrental\" does not exist</code>: <b>pastki chiziq tushib qolgan</b>",
    "Baza nomida pastki chiziq tushib qolsa: database carrental does not exist. Baza bor, faqat nomi car pastki chiziq rental. PostgreSQL terminalidagi teskari chiziqcha l bilan aniq nomni ko'ring."
   ],
   [
    "d",
    "PostgreSQL o'chiq — xato matni bo'sh; <code>console.error(err)</code> — <b><code>ECONNREFUSED</code> ko'rinadi</b>",
    "Eng chalkashi: PostgreSQL ishlamasa, javob besh yuz, lekin error bo'sh, terminalda ham bo'sh qator. Sinab ko'rdik: console error'ga err message emas, err'ning o'zini bersak, ECONNREFUSED chiqadi, ya'ni ulanish rad etildi. Yechim: PostgreSQL'ni ishga tushiring."
   ],
   [
    "e",
    "Xulosa: «ishlayapti» — <b>faqat Express</b>; baza xatosini birinchi so'rov va terminal aytadi",
    "Xulosa: terminaldagi ishlayapti degan satr faqat Express haqida. Bazaga ulanish birinchi so'rovda tekshiriladi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. PostgreSQL'ni ishga tushirish: Windows'da Services, Mac'da Postgres.app."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Ikkinchi node server.js ham «ishlayapti» deydi — javobni esa eski server beradi",
  "seg": [
   [
    "a",
    "Sinfdagi eng chalkash holat: «kodni tuzatdim, <b>hech narsa o'zgarmadi</b>»",
    "Sinfdagi eng chalkash holat: o'quvchi kodni tuzatadi, serverni yana ishga tushiradi, lekin javob o'zgarmaydi. Sabab ko'pincha bitta: birinchi server boshqa terminalda hali ishlab turibdi."
   ],
   [
    "b",
    "Sinab ko'rdik: ikkinchi server ham «ishlayapti» deb yozdi va <b>xato bermay chiqib ketdi</b>",
    "Sinab ko'rdik. Birinchi server ishlab turganda ikkinchi oynada node server js. Kutganimiz port band degan xato edi. Haqiqatda ikkinchi server ham ishlayapti deb yozdi va xato bermay chiqib ketdi. So'rovlarga birinchi, eski server javob beradi."
   ],
   [
    "c",
    "Sabab Express 5 da: xato <code>listen</code> callback'iga beriladi, namunadagi <b>callback uni o'qimaydi</b>",
    "Sabab Express beshinchi versiyasida: listen xatoni callback'ga beradi. Gemini yozgan callback esa xatoni o'qimaydi, faqat ishlayapti deb chiqaradi. Bu namuna kodidagi kamchilik, Express'niki emas, lekin sinfda aynan shunday ko'rinadi."
   ],
   [
    "d",
    "Xulosa: bitta loyiha — <b>bitta terminal</b>; qayta ishga tushirishdan oldin <code>Ctrl+C</code>",
    "Xulosa: sinfda qoida qo'ying, bitta loyiha uchun bitta terminal. Qayta ishga tushirishdan oldin Ctrl C bilan eski serverni to'xtating. O'quvchi «o'zgarmadi» desa, birinchi savol: boshqa terminalda server ochiq qolmadimi?"
   ]
  ]
 },
 "22": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4 — qaysi satr xato?",
  "title": "POST 500: column \"price\" of relation \"cars\" does not exist. Xato satrni toping",
  "q": "Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Jadval ustunlarini eslang: id, model, daily price, year, is rented. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. O'sha satrni bosing.",
  "ok": "To'g'ri. To'rtinchi satrda insert'da price yozilgan, jadvalda esa daily price. Uchinchi satrdagi daily price faqat JavaScript o'zgaruvchisi, baza uni ko'rmaydi, u SQL matnidagi nomni ko'radi. Ekranda tuzatilgan holat: daily price, POST ikki yuz bir. Demak, besh yuz chiqsa, SQL matnidagi har nomni jadval ustunlari bilan solishtiring.",
  "okShort": "4-satr: SQL'da <code>price</code> — jadvalda <code>daily_price</code>. 3-satrdagi <code>daily_price</code> — JS o'zgaruvchisi, baza ko'rmaydi.",
  "hint": "Baza JavaScript o'zgaruvchilarini ko'rmaydi — faqat qo'shtirnoq ichidagi SQL matnini. O'sha matndagi ustun nomlarini qidiring.",
  "task": "Qoida: SQL'dagi ustun nomlari jadvaldagi bilan aynan bir xil bo'ladi — <code>cars</code>: <code>id, model, daily_price, year, is_rented</code>. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. <b>O'sha satrni bosing.</b>"
 },
 "23": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Ikki buzish, ikki tuzatish — o'z serveringizda",
  "seg": [
   [
    "a",
    "Endi siz: o'z serveringizda ikkita xatoni <b>ataylab chiqarasiz va tuzatasiz</b>",
    "Oxirgi amaliyot: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz. O'n daqiqa. Sinfda xuddi shu xatolar chiqqanda, ularni birinchi marta ko'rayotgan bo'lmaysiz."
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
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, sinfda bu ikki xato chiqqanda siz ularni birinchi marta ko'rayotgan bo'lmaysiz va xabardan sababini darhol topasiz."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4-06 · «PostgreSQL so'rovlar — CRUD + AI bilan»",
  "title": "m4-06: o'quvchi do'konni tugmalar bilan boshqaradi, amaliyotda — haqiqiy PostgreSQL terminalida",
  "seg": [
   [
    "a",
    "m4-06 da o'quvchi do'konni tugmalar bilan boshqaradi — amaliyotda esa <b>haqiqiy PostgreSQL terminali</b>",
    "Endi o'quvchi darslarini ko'ramiz. Birinchisi m4-06, unda yigirma bir ekran bor. Ko'p qismida o'quvchi do'konni tugmalar bilan boshqaradi: insert, select, where, update, delete. Lekin amaliyotda u haqiqiy PostgreSQL terminali yoki VS Code'da AI bilan o'z do'koni jadvalini yaratadi. Demak bu darsda PostgreSQL har kompyuterda ishlab turishi shart."
   ],
   [
    "b",
    "CRUD bloki — siz bugun qo'lda qilgan ish; har <code>UPDATE</code>da <b>javobdagi sonni so'rang</b>",
    "CRUD bloki siz bugun qo'lda qilgan ishning o'zi. Qo'shimcha gapingiz: javobdagi son va begin, rollback. O'quvchi where'siz update'ni faqat ogohlantirishda ko'radi, siz uni proyektorda xavfsiz ko'rsating."
   ],
   [
    "c",
    "AI bloki: o'quvchi AI yozgan SQL'ni tekshiradi — sizning misollaringiz <code>product</code> va <b>noto'g'ri <code>HINT</code></b>",
    "AI bloki: o'quvchi AI yozgan SQL'ni tekshirishni o'rganadi, o'quvchi darsidagi misol product xatosi. Sizda yana bir misol bor: hint ham adashadi. Xulosa bitta: AI yozadi, o'quvchi tekshiradi."
   ],
   [
    "d",
    "Xulosa: amaliyot oldidan har kompyuterda <b>PostgreSQL terminali ochilishini</b> tekshiring; apostrof va <code>NOT NULL</code>ni ayting",
    "Xulosa: amaliyot oldidan har kompyuterda PostgreSQL terminali ochilishini tekshiring. O'quvchi o'z do'konini yaratayotganda ikki narsani ayting: so'z ichidagi apostrof ikki marta yoziladi, nom va narxga not null qo'yiladi. Vaqt, taklif: to'qson daqiqaning yigirma beshi amaliyotga."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4-08 · «Praktika: Backend CRUD — AvtoIjara»",
  "title": "m4-08: jadval qo'lda, server Gemini bilan — darsdagi to'rt farqni oldindan biling",
  "seg": [
   [
    "a",
    "m4-08 — <b>to'qqiz ekran</b>: jadvalni o'quvchi yozadi, serverni Gemini, Postman bilan sinaladi",
    "Ikkinchi dars m4-08, AvtoIjara, unda to'qqiz ekran bor. O'quvchi cars jadvalini PostgreSQL terminalida o'zi yozadi, server kodini Gemini'dan oladi, Postman bilan sinaydi va AI xatosini topadi. Siz bugun xuddi shuni qildingiz."
   ],
   [
    "b",
    "Farq 1: darsdagi xato matni qisqartirilgan; Farq 2: Gemini kodi <b>har kimda boshqacha</b>",
    "Darsdagi to'rt farqni oldindan biling. Birinchisi: xato matni darsda qisqaroq, haqiqiysida relation cars ham bor. Ikkinchisi: Gemini har o'quvchiga boshqacha kod yozadi. Topilmasa nima qaytishi, bitta yoki ikkita satr har xil bo'ladi. Promptdagi talablar bajarilganini tekshiring, satrma-satr bir xillikni emas."
   ],
   [
    "c",
    "Farq 3: <code>is_rented</code> — <code>null</code>; Farq 4: <b>port band bo'lsa ham «ishlayapti»</b>",
    "Uchinchisi: POST'dan keyin is rented null chiqadi, chunki u berilmaydi. To'rtinchisi: ikki terminalda ikki server ochilsa, xato chiqmaydi, eski server javob beradi. Ikkalasini ham o'quvchilarga oldindan ayting."
   ],
   [
    "d",
    "Xulosa: darsdan oldin — parol, Postman va <b>bitta terminal qoidasi</b>",
    "Xulosa: m4-08 dan oldin uch narsani tayyorlang. Sinf paroli hammaga ma'lum, Postman o'rnatilgan, va qoida: bitta loyiha, bitta terminal. Vaqt, taklif: to'qson daqiqaning qirqi server va Postman'ga, chunki eng ko'p qoqiladigan joy shu."
   ]
  ]
 },
 "26": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan <b>olti holat</b> — hammasini bugun o'zingiz ko'rdingiz",
    "Ikki o'quvchi darsini bilasiz. Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "Nom xatosi va apostrof — <code>\\d</code> bilan solishtiring, <b>apostrof ikki marta</b>",
    "Birinchi holat jadval yoki ustun nomidagi xato: xabar ichidagi nomni teskari chiziqcha d bilan solishtiring, hint'ga ishonmang. Ikkinchisi apostrof: u ikki marta yoziladi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz va ulanish xatolari — <code>BEGIN</code>, parol va <b>bo'sh xabar</b>",
    "Uchinchisi where'siz update yoki delete: uning oldi begin bilan olinadi. To'rtinchisi parol yoki baza nomidagi xato: uni Pool sozlamalarida qidiring. Beshinchisi: xabar bo'sh bo'lsa, console error'ga butun xatoni bering va PostgreSQL'ni tekshiring."
   ],
   [
    "d",
    "Xulosa: o'zgarmasa — ikkinchi terminal; avval <b>xabarni o'quvchi bilan birga o'qing</b>",
    "Oltinchisi: o'quvchi «o'zgarmadi» desa, ikkinchi terminalda eski server qolganini tekshiring. Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "27": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "UPDATE products SET price = 99000; — WHERE yo'q. Javob?",
    "o": [
     "UPDATE 1",
     "ERROR",
     "UPDATE 3 — hamma qator",
     "UPDATE 0"
    ],
    "c": 2,
    "e": "WHERE'siz — jadvaldagi hamma qator.",
    "s": 8
   },
   {
    "q": "BEGIN; → DELETE FROM products; → ROLLBACK; → SELECT *. Natija?",
    "o": [
     "Hamma mahsulot joyida",
     "(0 rows)",
     "Faqat birinchi qator",
     "ERROR"
    ],
    "c": 0,
    "e": "ROLLBACK tranzaksiyani bekor qiladi.",
    "s": 8
   },
   {
    "q": "WHERE id = 99 — bunday qator yo'q. UPDATE javobi?",
    "o": [
     "ERROR: not found",
     "UPDATE 0",
     "UPDATE 1",
     "DELETE 0"
    ],
    "c": 1,
    "e": "Mos qator yo'q — 0, xato emas.",
    "s": 5
   },
   {
    "q": "VALUES ('O'yinchoq', 30000, 4) → syntax error. Tuzatish?",
    "o": [
     "\"O'yinchoq\"",
     "VARCHAR qilish",
     "Kirillda yozish",
     "'O''yinchoq'"
    ],
    "c": 3,
    "e": "So'z ichidagi apostrof ikki marta.",
    "s": 11
   },
   {
    "q": "Express'da bazaga SQL nima bilan yuboriladi?",
    "o": [
     "pool.query(sql, [qiymatlar])",
     "res.json",
     "app.listen",
     "console.log"
    ],
    "c": 0,
    "e": "Pool — server bazaga shu yo'l bilan ulanadi.",
    "s": 14
   },
   {
    "q": "Server «ishlayapti», GET ishlaydi, POST — Cannot destructure property 'model' of 'req.body'. Sabab?",
    "o": [
     "Parol xato",
     "app.use(express.json()) yo'q",
     "Jadval yo'q",
     "Port band"
    ],
    "c": 1,
    "e": "req.body o'qilmagan.",
    "s": 19
   },
   {
    "q": "POST 500, {\"error\":\"\"}, terminalda bo'sh qator. Birinchi qadam?",
    "o": [
     "Serverni o'chirish",
     "Gemini'dan yangi kod",
     "console.error(err) — butun xatoni ko'rish",
     "npm install"
    ],
    "c": 2,
    "e": "Bo'sh xabar — ECONNREFUSED yashiringan.",
    "s": 20
   },
   {
    "q": "O'quvchi: «Kodni tuzatdim, node server.js qildim — javob o'zgarmadi». Birinchi savolingiz?",
    "o": [
     "Gemini'dan qayta so'radingmi?",
     "Bazani o'chirdingmi?",
     "Postman yangilandimi?",
     "Boshqa terminalda server ochiq qolmadimi?"
    ],
    "c": 3,
    "e": "Express 5 da ikkinchi server ham «ishlayapti» deydi.",
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
//  MENTOR KURSI · PostgreSQL-2 «CRUD so'rovlar va Express'dan bazaga»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/08-PostgreSQL2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/pg2-out/ (00–20)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg2/parts/*.jsx > PgCrudMentorLesson.jsx
//  Yordamchilar PG-1 dan nusxa (pg1/parts/04-yordam.jsx) — darslar bir-biriga bog'liq emas
// ============================================================
const LESSON_ID = 'mentor-pg-02-crud-express-v1';
const LESSON_TITLE = "CRUD so'rovlar va Express'dan bazaga";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', win: '#0067C0', post: '#FF6C37' };
MKCFG.root = 'avto-ijara-server';
MKCFG.kind = (f) => /\.js$/.test(f) ? T.yellow : /\.sql$/.test(f) ? PG.pg : /\.json$/.test(f) ? T.ink2 : null;
MKCFG.files = ['node_modules/', 'package.json', 'server.js'];

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['psql minus U postgres', 'psql -U postgres'], ['teskari chiziqcha d products', '\\d products'], ['teskari chiziqcha d cars', '\\d cars'],
  ['teskari chiziqcha l', '\\l'], ['teskari chiziqcha d', '\\d'], ['teskari chiziqcha c', '\\c'],
  ['app use express json', 'app.use(express.json())'], ['express json', 'express.json()'], ['pool query', 'pool.query'], ['res json', 'res.json'],
  ['req body', 'req.body'], ['node server js', 'node server.js'], ['server js', 'server.js'], ['console error', 'console.error'], ['err message', 'err.message'],
  ['daily price', 'daily_price'], ['is rented', 'is_rented'], ['car rental', 'car_rental'], ['avto ijara server', 'avto-ijara-server'], ['rowCount', 'rowCount'],
  ['dollar bir, dollar ikki', '$1, $2'], ['dollar bir', '$1'], ['dollar ikki', '$2'], ['bir or bir teng bir', '1 OR 1=1'],
  ['order by id', 'ORDER BY id'], ['order by', 'ORDER BY'], ['returning yulduzcha', 'RETURNING *'], ['select yulduzcha', 'SELECT *'],
  ['insert, nol, uch', 'INSERT 0 3'], ['insert nol bir', 'INSERT 0 1'], ['update bir', 'UPDATE 1'], ['update nol', 'UPDATE 0'], ['update uch', 'UPDATE 3'],
  ['delete bir', 'DELETE 1'], ['delete uch', 'DELETE 3'], ['deleted uch', 'deleted: 3'], ['not null', 'NOT NULL'], ['default false', 'DEFAULT false'],
  ['where name is null', 'WHERE name IS NULL'], ['process env', 'process.env'], ['Ctrl C', 'Ctrl+C'], ['npm init', 'npm init -y'],
];
DIGITS.unshift(["to'qson to'qqiz ming", '99 000'], ['yuz ming', '100 000'], ['ellik ming', '50 000'], ["o'ttiz ming", '30 000'],
  ["to'qson to'qqizinchi", '99-'], ['yigirma bir', '21'], ['yigirma beshi', '25 tasi'], ["o'n besh-yigirma", '15–20'], ["besh-o'n", '5–10'],
  ['bir, ikki, uch, to\'rt', '1, 2, 3, 4'], ['id bir', 'id 1'], ['id uch', 'id 3'], ["to'qqiz ekran", '9 ekran']);
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
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const mergeMeta = (...ms) => ms.reduce((acc, m) => { Object.keys(m).forEach((k) => { acc[k] = { ...(acc[k] || {}), ...m[k] }; }); return acc; }, {});

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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-pg2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-pg2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ["CRUD PostgreSQL terminalida", 'WHERE va xavfsiz sinash', 'Sinfdagi SQL xatolari', "Express'dan bazaga", 'Buzamiz', "O'quvchi darslarini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — sizning serveringizda</div>
    <PostmanCard m="POST" url="localhost:3000/api/cars" body={'{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'} st={201} res={'{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}'} />
  </div>} />;
}

// ============================================================
//  2 · CRUD: to'rt amal — to'rt SQL buyruq — to'rt endpoint (F-1102-21, M39)
//  Haqiqiy: pg2-out/01 (INSERT 0 1, 4 rows) · 03 (UPDATE 1, DELETE 1) · 11-crud-sorovlar (POST 201 · GET/PUT/DELETE 200)
// ============================================================
const CRUD = [
  ['C', 'Create', 'yaratish', 'INSERT', 'INSERT 0 1', 'POST /api/cars', '201'],
  ['R', 'Read', "o'qish", 'SELECT', '(4 rows)', 'GET /api/cars', '200'],
  ['U', 'Update', "o'zgartirish", 'UPDATE', 'UPDATE 1', 'PUT /api/cars/2', '200'],
  ['D', 'Delete', "o'chirish", 'DELETE', 'DELETE 1', 'DELETE /api/cars/1', '200'],
];
const S2CRUD = mkS(2, [{ sql: false, ex: false }, { sql: true, ex: false }, { sql: true, ex: true }, { sql: true, ex: true, rule: true }]);
function ScreenCrud(p) {
  return <Lesson p={p} S={S2CRUD} scene={({ seg, beat }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: '6px 12px' }}>
      <table className="pg-crud"><thead><tr>
        <th>CRUD</th><th>ma'nosi</th>
        <th className="sql">PostgreSQL</th><th className="sql">baza javobi</th>
        <th className="ex">Express</th><th className="ex">status</th>
      </tr></thead><tbody>
        {CRUD.map(([l, en, uz, q, ans, ep, st]) => <tr key={l}>
          <td><span style={{ color: T.accent, fontSize: 20 }}>{l}</span><span style={{ fontWeight: 600, color: T.ink2 }}>{en.slice(1)}</span></td>
          <td>{uz}</td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{q}</code></td>
          <td className={`sql${seg.sql ? '' : ' off'}`}><code>{ans}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{ep}</code></td>
          <td className={`ex${seg.ex ? '' : ' off'}`}><code>{st}</code></td>
        </tr>)}
      </tbody></table>
    </div>
    <Block at={3} beat={beat}><div className="mk-rule">Bitta amal — bazada <b>bitta SQL buyruq</b>, serverda <b>bitta endpoint</b>. Bugun avval terminalda qo'lda, keyin Express ichida.</div></Block>
  </div>} />;
}

// ============================================================
//  3 · shop bazasi: jadval va INSERT
// ============================================================
const PRODUCTS0 = [['1', 'Klaviatura', '120000', '8'], ['2', 'Sichqoncha', '75000', '15'], ['3', 'Quloqchin', '95000', '5'], ['4', 'Mishka', '50000', '10']];
const PCOLS = ['id', 'name', 'price', 'stock'];
const T2 = psql(String.raw`
shop=# CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
CREATE TABLE
shop=# INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);
INSERT 0 3
shop=# INSERT INTO products (name, price, stock) VALUES ('Mishka', 50000, 10);
INSERT 0 1
shop=# SELECT * FROM products;
 id |    name    | price  | stock
----+------------+--------+-------
  1 | Klaviatura | 120000 |     8
  2 | Sichqoncha |  75000 |    15
  3 | Quloqchin  |  95000 |     5
  4 | Mishka     |  50000 |    10
(4 rows)`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 6, { at: 1 }), rng(7, 14, { at: 2 }), { 1: { id: 'ddl' }, 4: { id: 'n' }, 6: { id: 'n' }, 7: { id: 'sel' } }));
const S2 = mkS(3, [{ focus: ['ddl'] }, { focus: ['n'] }, { focus: ['sel'] }, { focus: ['ddl'] }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={T2} beat={beat} focus={seg.focus} />
    <div className="pg-two">
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">O'quvchi darsida — jadval «chizmasi»</div><div style={{ fontSize: 13.5, lineHeight: 1.6 }}><code>id</code> SERIAL PRIMARY KEY · <code>name</code> TEXT · <code>price</code> INTEGER · <code>stock</code> INTEGER</div></div>
      <Block at={3} beat={beat}><div className="n2-warn" style={{ fontSize: 14 }}>Bu jadvalda <b>NOT NULL yo'q</b> — 12-ekranda nima bo'lishini ko'ramiz.</div></Block>
    </div>
  </>} />;
}

// ============================================================
//  4 · SELECT va WHERE
// ============================================================
const T3a = psql(String.raw`
shop=# SELECT name, price FROM products;
    name    | price
------------+--------
 Klaviatura | 120000
 Sichqoncha |  75000
 Quloqchin  |  95000
 Mishka     |  50000
(4 rows)`);
const T3b = psql(String.raw`
shop=# SELECT * FROM products WHERE price < 100000;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  3 | Quloqchin  | 95000 |     5
  4 | Mishka     | 50000 |    10
(3 rows)`, { 1: { id: 'w' } });
const T3c = psql(String.raw`
shop=# SELECT * FROM products WHERE stock < 6;
 id |   name    | price | stock
----+-----------+-------+-------
  3 | Quloqchin | 95000 |     5
(1 row)`, { 1: { id: 'w' } });
const S3 = mkS(4, [{ v: 'a', rows: [] }, { v: 'b', rows: [1, 2, 3] }, { v: 'c', rows: [2] }, { v: 'c', rows: [] }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <>
    <MiniTable name="products" cols={PCOLS} rows={PRODUCTS0} hlRow={seg.rows} dimRow={seg.rows.length ? [0, 1, 2, 3].filter((i) => !seg.rows.includes(i)) : []} hlCol={seg.v === 'b' ? [2] : seg.v === 'c' && beat === 2 ? [3] : []} />
    {seg.v === 'a' && <Psql title="psql — shop" lines={T3a} />}
    {seg.v === 'b' && <Psql title="psql — shop" lines={T3b} focus={['w']} />}
    {seg.v === 'c' && <Psql title="psql — shop" lines={T3c} focus={beat === 2 ? ['w'] : []} />}
    <Block at={3} beat={beat}><div className="mk-rule"><b>SELECT</b> faqat o'qiydi · <b>WHERE</b> qatorlarni tanlaydi — UPDATE va DELETE'da ham aynan shu WHERE ishlaydi</div></Block>
  </>} />;
}

// ============================================================
//  5 · UPDATE va DELETE
// ============================================================
const T4 = psql(String.raw`
shop=# UPDATE products SET price = 99000 WHERE id = 1;
UPDATE 1
shop=# DELETE FROM products WHERE id = 3;
DELETE 1
shop=# SELECT * FROM products;
 id |    name    | price | stock
----+------------+-------+-------
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
  1 | Klaviatura | 99000 |     8
(3 rows)
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0
shop=# DELETE FROM products WHERE id = 99;
DELETE 0`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 4, { at: 1 }), rng(5, 11, { at: 2 }), rng(12, 15, { at: 3 }), { 2: { id: 'u' }, 4: { id: 'd' }, 10: { id: 'kl' }, 13: { id: 'z' }, 15: { id: 'z' } }));
const S4 = mkS(5, [{ focus: ['u'] }, { focus: ['d'] }, { focus: ['kl'] }, { focus: ['z'] }, { focus: ['u', 'd', 'z'] }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => <>
    <Psql title="psql — shop" lines={T4} beat={beat} focus={seg.focus} />
    <Block at={2} beat={beat}><div className="mk-tag" style={{ margin: 0, color: T.accent }}>Klaviatura oxirida — ORDER BY yozilmagan, tartib kafolatlanmaydi · kerak bo'lsa: SELECT * FROM products ORDER BY id;</div></Block>
    <Block at={4} beat={beat}><div className="mk-rule">Javobdagi son: <b>1</b> — kutganingiz · <b>0</b> — WHERE hech narsaga mos kelmadi · <b>kutilmagan katta son</b> — WHERE noto'g'ri yoki yo'q</div></Block>
  </>} />;
}

// ============================================================
//  6 · Tekshiruv 1 — UPDATE 0
// ============================================================
function Screen5(p) {
  const m = MDT[6];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Avval tekshirish — bunday id bormi</div>
      <Psql title="psql — shop" lines={psql(String.raw`
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0
shop=# SELECT * FROM products;
 id |    name    | price | stock
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
  1 | Klaviatura | 99000 |     8
(3 rows)`)} />
      <div className="mk-rule">Jadvalda id <b>99</b> yo'q — <code>UPDATE 0</code>. Xato emas: baza hech bir qatorga tegmadi.</div>
    </div>} />;
}

// ============================================================
//  7 · Amaliyot 1 — do'konni o'zingiz boshqaring
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Baza va jadval', cmds: ['psql -U postgres', 'CREATE DATABASE shop;', '\\c shop', 'CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);'], exp: 'CREATE DATABASE · CREATE TABLE' },
  { t: 'Mahsulotlar', cmds: ["INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);", "INSERT INTO products (name, price, stock) VALUES ('Mishka', 50000, 10);"], exp: 'INSERT 0 3 · INSERT 0 1' },
  { t: 'Filtrlar', cmds: ['SELECT * FROM products WHERE price < 100000;', 'SELECT * FROM products WHERE stock < 6;'], exp: '3 qator · 1 qator (Quloqchin)' },
  { t: "Narx va o'chirish", cmds: ['UPDATE products SET price = 99000 WHERE id = 1;', 'DELETE FROM products WHERE id = 3;', 'SELECT * FROM products;'], exp: 'UPDATE 1 · DELETE 1 · (… rows)' },
];
const P1_TROUBLE = [
  ['ERROR:  database "shop" already exists', 'baza oldin yaratilgan — \\c shop'],
  ['ERROR:  relation "products" does not exist', 'boshqa bazadasiz (prompt postgres=#) — \\c shop'],
  ['INSERT 0 3 ikki marta', "mahsulotlar ikki marta qo'shilgan — id lar 1–8; 4-qadamda id ni SELECT bo'yicha tanlang"],
  ['UPDATE 0 / DELETE 0', "bunday id yo'q — avval SELECT * bilan id ni ko'ring"],
  ['ERROR:  syntax error at or near "…"', "^ ko'rsatgan joydan oldin vergul, qavs yoki tirnoq tushib qolgan"],
];
const P1_PROOF = { label: 'Isbot: oxirgi SELECT * natijasidagi qatorlar soni', placeholder: 'natija ostidagi sonni yozing', check: (v) => /^\s*\(?\s*3\b/.test(v), wrong: "4 ta mahsulotdan bittasi (Quloqchin) o'chirilgach nechta qoladi? Natija ostidagi qavsdagi sonni yozing" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  8 · WHERE'siz — hamma qator (pg2-out/04, bitta seans)
// ============================================================
const T7 = psql(String.raw`
shop=# BEGIN;
BEGIN
shop=*# UPDATE products SET price = 99000;
UPDATE 3
shop=*# SELECT * FROM products;
  2 | Sichqoncha | 99000 |    15
  4 | Mishka     | 99000 |    10
  1 | Klaviatura | 99000 |     8
shop=*# DELETE FROM products;
DELETE 3
shop=*# SELECT * FROM products;
(0 rows)
shop=*# ROLLBACK;
ROLLBACK
shop=# SELECT * FROM products;
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
  1 | Klaviatura | 99000 |     8`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 8, { at: 1 }), rng(9, 12, { at: 2 }), rng(13, 18, { at: 3 }), { 1: { id: 'b' }, 4: { id: 'u' }, 10: { id: 'd' }, 12: { id: 'd' }, 14: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'r' }, 18: { id: 'r' } }));
const S7 = mkS(8, [{ focus: ['b'], st: 'ok' }, { focus: ['u'], st: 'up' }, { focus: ['d'], st: 'del' }, { focus: ['r'], st: 'ok' }, { focus: [], st: 'ok' }]);
const ROWS7 = { ok: [['2', 'Sichqoncha', '75000', '15'], ['4', 'Mishka', '50000', '10'], ['1', 'Klaviatura', '99000', '8']], up: [['2', 'Sichqoncha', '99000', '15'], ['4', 'Mishka', '99000', '10'], ['1', 'Klaviatura', '99000', '8']], del: [] };
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg, beat }) => <div className="pg-two">
    <Psql title="psql — shop" lines={T7} beat={beat} focus={seg.focus} />
    <div style={{ display: 'grid', gap: 10 }}>
      <MiniTable name={seg.st === 'ok' ? 'products' : 'products · tranzaksiya ichida'} cols={PCOLS} rows={ROWS7[seg.st]} hlCol={seg.st === 'up' ? [2] : []} color={seg.st === 'ok' ? PG.pg : T.accent} />
      {seg.st === 'del' && <div className="n2-warn"><b>(0 rows)</b> — butun katalog yo'q. Tranzaksiya hali ochiq.</div>}
      <Block at={4} beat={beat}><div className="mk-rule">Xavfli UPDATE/DELETE — avval <code>BEGIN</code> ichida · <code>SELECT</code> bilan ko'ring · to'g'ri bo'lsa <code>COMMIT</code>, noto'g'ri bo'lsa <code>ROLLBACK</code></div></Block>
    </div>
  </div>} />;
}

// ============================================================
//  9 · Tekshiruv 2 — ROLLBACK dan keyin
// ============================================================
function Screen8(p) {
  const m = MDT[9];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Psql title="psql — shop" lines={T7.slice(12)} />
    </div>} />;
}

// ============================================================
//  10 · Amaliyot 2 — BEGIN … ROLLBACK
// ============================================================
const P2 = mkS(10, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Tranzaksiya', cmds: ['BEGIN;'], exp: 'BEGIN · prompt shop=*#' },
  { t: "WHERE'siz", cmds: ['UPDATE products SET price = 1;', 'SELECT * FROM products;'], exp: 'UPDATE 3 · hamma narx 1' },
  { t: 'Bekor', cmds: ['ROLLBACK;'], exp: 'ROLLBACK · prompt shop=#' },
  { t: 'Tekshirish', cmds: ['SELECT * FROM products;'], exp: 'narxlar eski' },
];
const P2_TROUBLE = [
  ['WARNING:  there is no transaction in progress (ROLLBACK da)', "BEGIN yozilmagan — o'zgarish allaqachon saqlangan; narxlarni 1-amaliyotdagi UPDATE lar bilan tiklang"],
  ['narx 120000', "1-amaliyotning 4-qadami (99 000) bajarilmagan — 1-amaliyotni tugating"],
  ['prompt shop=!#', 'tranzaksiya ichida xato bo\'ldi — ROLLBACK; yozing'],
];
const P2_PROOF = { label: "Isbot: ROLLBACK dan keyingi Klaviatura narxi", placeholder: 'klaviatura narxini yozing', check: (v) => /^\s*99\s?000\s*$/.test(v), wrong: "ROLLBACK dan keyin narx 1-amaliyotdagidek bo'ladi — SELECT natijasidan Klaviatura qatorini o'qing" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  11 · Sinfdagi SQL xatolari
// ============================================================
const E10 = [
  psql(String.raw`
shop=# SELECT * FROM product WHERE price < 100000;
ERROR:  relation "product" does not exist
LINE 1: SELECT * FROM product WHERE price < 100000;
                      ^`),
  psql(String.raw`
shop=# SELECT * FROM products WHERE narx < 100000;
ERROR:  column "narx" does not exist
LINE 1: SELECT * FROM products WHERE narx < 100000;
                                     ^
HINT:  Perhaps you meant to reference the column "products.name".`, { 5: { id: 'h' } }),
  psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet', 'arzon', 3);
ERROR:  invalid input syntax for type integer: "arzon"
shop=# INSERT INTO products (name, price, stock) VALUES ('Planshet', 300000);
ERROR:  INSERT has more target columns than expressions`),
  psql(String.raw`
shop=# INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);
ERROR:  syntax error at or near "yinchoq"
LINE 1: ...ERT INTO products (name, price, stock) VALUES ('O'yinchoq', ...
                                                             ^
shop=# INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
 id |   name    | price | stock
----+-----------+-------+-------
  6 | O'yinchoq | 30000 |     4
(1 row)`, { 5: { neu: true, id: 'f' }, 9: { id: 'f' } }),
];
const D10 = psql(String.raw`
shop=# \d products
 Column |  Type   | Nullable
--------+---------+----------
 id     | integer | not null
 name   | text    |
 price  | integer |
 stock  | integer |`);
const S10 = mkS(11, [{ e: 0 }, { e: 1, focus: ['h'] }, { e: 2 }, { e: 3, focus: ['f'] }, { e: 9 }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.e <= 3 && <Psql title="psql — shop" er={seg.e !== 3} lines={E10[seg.e]} focus={seg.focus || []} />}
    {seg.e === 1 && <div className="n2-warn">HINT <b>taxmin</b> qiladi: <code>name</code> ni taklif qildi, kerakli ustun esa <code>price</code>. Ishonchli manba — <code>\d products</code>.</div>}
    {seg.e === 9 && <><div className="mk-tag" style={{ margin: 0 }}>Haqiqiy jadval tuzilishi (o'quvchi darsidagi DDL)</div><Psql title="psql — shop" lines={D10} /><div className="mk-rule">Xabardagi nomni <code>\d products</code> bilan solishtiring · so'z ichidagi apostrof — <b>ikki marta</b>: <code>'O''yinchoq'</code></div></>}
  </>} />;
}

// ============================================================
//  12 · NOT NULL yo'q — nomsiz mahsulot
// ============================================================
const T11 = psql(String.raw`
shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
INSERT 0 1
shop=# SELECT * FROM products WHERE name IS NULL;
 id | name | price | stock
----+------+-------+-------
  5 |      | 30000 |     4
(1 row)`, mergeMeta(rng(1, 2, { at: 0 }), rng(3, 7, { at: 1 }), { 2: { id: 'i' }, 6: { id: 'n' } }));
const PG1_USERS = psql(String.raw`
blog=# INSERT INTO users (username) VALUES (NULL);
ERROR:  null value in column "username" of relation "users" violates not-null constraint`);
const S11 = mkS(12, [{ focus: ['i'] }, { focus: ['n'] }, { focus: [] }, { focus: [] }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg, beat }) => <>
    <div className="pg-two">
      <div><div className="pg-lab">PostgreSQL-1 · users — NOT NULL bor</div><Psql title="psql — blog" er lines={PG1_USERS} /></div>
      <div><div className="pg-lab">Bugun · products — NOT NULL yo'q <span className="tm">xato yo'q</span></div><Psql title="psql — shop" lines={T11} beat={beat} focus={seg.focus} /></div>
    </div>
    <Block at={2} beat={beat}><div className="pg-cmp">
      <div className="mk-card"><h5>blog · users</h5><code>username TEXT NOT NULL UNIQUE</code></div>
      <div className="mk-card" style={{ borderColor: T.accent }}><h5>shop · products</h5><code>name TEXT</code> — qoida yo'q</div>
    </div></Block>
    <Block at={3} beat={beat}><div className="mk-rule">Baza faqat <b>yozilgan</b> qoidani qo'riqlaydi. O'quvchi o'z do'koni jadvalini yaratganda: <code>name TEXT NOT NULL</code>, <code>price INTEGER NOT NULL</code>.</div></Block>
  </>} />;
}

// ============================================================
//  13 · Tekshiruv 3 — apostrof
// ============================================================
function Screen12(p) {
  const m = MDT[13];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — haqiqiy natija</div>
      <Psql title="psql — shop" lines={E10[3].slice(4)} />
    </div>} />;
}

// ============================================================
//  Server kodi — pg2-out/11-server.js aynan (port 5436 → 5432). Gemini promptiga mos BITTA NAMUNA (shartli)
// ============================================================
const SERVER_SRC = String.raw`
// server.js — AvtoIjara backend (Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');

// Bazaga ulanish sozlamalari
const USER = 'postgres';
const PASSWORD = 'password'; // o'z parolingizni yozing
const DATABASE = 'car_rental';

const pool = new Pool({ user: USER, password: PASSWORD, database: DATABASE, host: 'localhost', port: 5432 });
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
    const result = await pool.query('INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);
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
    const result = await pool.query('UPDATE cars SET daily_price = $1 WHERE id = $2 RETURNING *', [daily_price, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — mashinani o'chirish
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json({ message: "O'chirildi", deleted: result.rowCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));`;
// Kod satrlari (1-dan): bo'laklar id bilan — sahna segment bo'yicha yoritadi
const SRV_META = mergeMeta(
  rng(2, 3, { id: 'req' }), rng(5, 10, { id: 'pool' }), { 11: { id: 'app' }, 12: { id: 'json' } },
  rng(14, 23, { id: 'get' }), { 17: { id: 'getq' }, 18: { id: 'getq' } }, rng(19, 22, { id: 'catch' }),
  rng(25, 35, { id: 'post' }), { 29: { id: 'postq' } }, rng(37, 48, { id: 'put' }), { 42: { id: 'nf' } },
  rng(50, 60, { id: 'del' }), { 53: { id: 'delq' }, 54: { id: 'nf' } }, { 62: { id: 'listen' } });
const SERVER_LINES = js(SERVER_SRC, SRV_META);
const SRV_FILES = MKCFG.files;
// Bo'lak ko'rsatilsa ham satr raqami fayldagidek qoladi (n); tor ustunda — wrap
const SrvIde = ({ focus = [], lines = SERVER_LINES, children, from = 0, to, wrap }) => <Ide files={SRV_FILES} active="server.js">
  <CodePanel file="server.js" lines={lines.slice(from, to).map((l, i) => (l.n != null ? l : { ...l, n: from + i + 1 }))} focus={focus} wrap={wrap} style={{ fontSize: 12.5 }} />
  {children}
</Ide>;
const shamaNote = <div className="mk-tag" style={{ margin: 0 }}>Shartli namuna — Gemini har safar boshqacha yozadi, mazmuni shu (m4-08 promptlari)</div>;

// ============================================================
//  14 · Express'dan bazaga: Pool va GET
// ============================================================
const CARS13 = psql(String.raw`
car_rental=# CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);
CREATE TABLE
car_rental=# SELECT * FROM cars;
 id |      model       | daily_price | year | is_rented
----+------------------+-------------+------+-----------
  1 | Chevrolet Cobalt |      280000 | 2022 | f
  2 | Chevrolet Malibu |      520000 | 2023 | f
  3 | Kia K5           |      610000 | 2023 | f
(3 rows)`);
const GET13 = '[{"id":1,"model":"Chevrolet Cobalt","daily_price":280000,"year":2022,"is_rented":false},\n {"id":2,"model":"Chevrolet Malibu",…}, {"id":3,"model":"Kia K5",…}]';
const S13 = mkS(14, [{ v: 'tab' }, { v: 'code', focus: ['pool'] }, { v: 'code', focus: ['getq'], pm: true }, { v: 'code', focus: ['catch'] }, { v: 'code', focus: ['pool', 'getq'], sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'tab' && <><div className="pg-lab">1-qadam · o'quvchi o'zi, PostgreSQL terminalida</div><Psql title="psql — car_rental" lines={CARS13} /></>}
    {seg.v === 'code' && <SrvIde focus={seg.focus} to={23}>{shamaNote}</SrvIde>}
    {seg.pm && <PostmanCard m="GET" url="localhost:3000/api/cars" st={200} res={GET13} />}
    {seg.sum && <div className="mk-rule"><b>Pool</b> → <code>pool.query(sql)</code> → <code>result.rows</code> → <code>res.json</code> — server bazaga shu yo'l bilan ulanadi</div>}
  </>} />;
}

// ============================================================
//  15 · POST, PUT, DELETE
// ============================================================
const S14 = mkS(15, [{ focus: ['postq'], from: 24, to: 35, pm: 'post' }, { focus: ['postq'], from: 24, to: 35, pm: 'post', nul: true }, { focus: ['put', 'del'], from: 36, to: 60, pm: 'pd' }, { focus: ['nf'], from: 36, to: 60, pm: 'nf' }, { focus: [], from: 24, to: 60, pm: 'sum' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="pg-two">
    <SrvIde focus={seg.focus} from={seg.from} to={seg.to} wrap />
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {(seg.pm === 'post' || seg.pm === 'sum') && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'} st={201} res={'{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}'} hl={seg.nul} />}
      {seg.nul && <div className="n2-warn"><b>is_rented: null</b> — POST'da berilmagan, jadvalda <code>DEFAULT</code> yo'q. Kerak bo'lsa: <code>is_rented BOOLEAN DEFAULT false</code>.</div>}
      {(seg.pm === 'pd' || seg.pm === 'sum') && <><PostmanCard m="PUT" url="/api/cars/2" body={'{ "daily_price": 480000 }'} st={200} res={'{"id":2,"model":"Chevrolet Malibu","daily_price":480000,"year":2023,"is_rented":false}'} /><PostmanCard m="DELETE" url="/api/cars/1" st={200} res={'{"message":"O\'chirildi","deleted":1}'} /></>}
      {(seg.pm === 'nf' || seg.pm === 'sum') && <><PostmanCard m="PUT" url="/api/cars/99" body={'{ "daily_price": 1 }'} st={404} res={'{"error":"Mashina topilmadi"}'} hl={seg.pm === 'nf'} />{seg.pm === 'nf' && <div className="mk-rule">Baza <code>UPDATE 0</code> — xato emas. Kod <code>rowCount === 0</code> ni tekshirib <b>404</b> beradi — to'g'ri qaror: aks holda 200 «o'zgardi» deb aldaydi.</div>}</>}
    </div>
  </div>} />;
}

// ============================================================
//  16 · Nega $1 (pg2-out/17)
// ============================================================
const INJ_BAD = js(String.raw`
const result = await pool.query('DELETE FROM cars WHERE id = ' + req.params.id);  // ← yopishtirilgan`, { 1: { id: 'x' } });
const INJ_OK = js(String.raw`
const result = await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);`, { 1: { id: 'x', neu: true } });
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
const S15 = mkS(16, [{ v: 'bad0' }, { v: 'bad' }, { v: 'both' }, { v: 'both', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <div className="pg-lab" style={{ color: T.accent }}>Yopishtirilgan</div>
      <CodePanel file="server.js · DELETE" lines={INJ_BAD} focus={['x']} wrap style={{ fontSize: 12.5 }} />
      {seg.v !== 'bad0' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={200} res={'{"message":"O\'chirildi","deleted":3}'} hl={seg.v === 'bad'} /><Psql title="psql — car_rental" er lines={INJ_AFTER_BAD} /></>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start', opacity: seg.v === 'both' ? 1 : 0.35 }}>
      <div className="pg-lab" style={{ color: T.green }}>$1 bilan</div>
      <CodePanel file="server.js · DELETE" lines={INJ_OK} wrap style={{ fontSize: 12.5 }} />
      {seg.v === 'both' && <><PostmanCard m="DELETE" url="/api/cars/1 OR 1=1" st={500} res={'{"error":"invalid input syntax for type integer: \\"1 OR 1=1\\""}'} hl /><Psql title="psql — car_rental · jadval joyida" lines={INJ_AFTER_OK} /></>}
      {seg.sum && <div className="mk-rule">Foydalanuvchidan kelgan har qiymat — <code>$1, $2</code> + massiv. m4-08 promptida ham: «qiymatlarni SQL matniga yopishtirma».</div>}
    </div>
  </div>} />;
}

// ============================================================
//  17 · Amaliyot 3 — AvtoIjara server
// ============================================================
const P3 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Jadval', cmds: ['CREATE DATABASE car_rental;', '\\c car_rental', 'CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);', "INSERT INTO cars (model, daily_price, year, is_rented) VALUES ('Chevrolet Cobalt', 280000, 2022, false), ('Chevrolet Malibu', 520000, 2023, false), ('Kia K5', 610000, 2023, false);"], exp: 'INSERT 0 3' },
  { t: 'Loyiha', cmds: ['mkdir avto-ijara-server', 'cd avto-ijara-server', 'npm init -y', 'npm install express pg'], exp: 'added … packages' },
  { t: "Server — namuna yoki Gemini (m4-08 promptlari); parolingizni yozing", cmds: ['node server.js'], exp: 'Server 3000-portda ishlayapti' },
  { t: 'Postman', cmds: ['GET localhost:3000/api/cars', 'POST localhost:3000/api/cars   { "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'], exp: '200 · 3 mashina · POST — id bilan' },
];
const P3_CODE = [{ file: 'server.js', step: 2, lines: SERVER_LINES, copy: false }];
const P3_TROUBLE = [
  ['500 password authentication failed for user "postgres"', "PASSWORD — o'rnatishda berilgan parol (20-ekran)"],
  ['500 client password must be a string', "parol bo'sh / process.env o'qilmagan (20-ekran)"],
  ['500 database "…" does not exist', 'DATABASE nomi xato yoki baza yaratilmagan (20-ekran)'],
  ['500 {"error":""}', "PostgreSQL ishlamayapti — console.error(err) bilan ECONNREFUSED ko'rinadi (20-ekran)"],
  ["500 Cannot destructure property 'model' of 'req.body'", "app.use(express.json()) yo'q (19-ekran)"],
  ['500 column "price" of relation "cars" does not exist', 'kodda ustun nomi xato (18-ekran)'],
  ["kod o'zgardi, javob o'zgarmadi", 'eski server ishlab turibdi — 21-ekran'],
];
const P3_PROOF = { label: 'Isbot: POST javobining statusi', placeholder: "Postman ko'rsatgan statusni yozing", check: (v) => /^\s*201\b/.test(v), wrong: "Muvaffaqiyatli POST statusi uch xonali son — Postman'da javob ustida yozilgan" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={MKCFG.files} />; }

// ============================================================
//  18 · Buzamiz 1: price ustuni (pg2-out/12, 19)
// ============================================================
const POST_LINES = (bad, fixed) => {
  const src = SERVER_LINES.slice(24, 35).map((l, i) => ({ ...l, n: 25 + i }));
  return src.map((l, i) => {
    if (i !== 4) return l;
    if (bad) return { ...l, h: jsLine("    const result = await pool.query('INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);"), id: 'x' };
    return { ...l, id: 'x', neu: !!fixed };
  });
};
const PRICE_TERM = psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti
column "price" of relation "cars" does not exist`, { 3: { id: 'e' } });
const S17 = mkS(18, [{ st: 'bad' }, { st: 'bad', pm: 500 }, { st: 'fix', pm: 201 }, { st: 'fix', pm: 201, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div className="pg-two">
    <SrvIde lines={POST_LINES(seg.st === 'bad', seg.st === 'fix')} focus={['x']} wrap />
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.pm === 500 && <><PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={500} res={'{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}'} hl /><Psql title="terminal — node server.js" er lines={PRICE_TERM} focus={['e']} /></>}
      {seg.pm === 201 && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={201} res={'{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}'} hl />}
      {seg.sum && <div className="mk-rule">500 → <code>error</code> ichidagi nom (<code>"price"</code> · <code>"cars"</code>) → <code>\d cars</code> bilan solishtirish → tuzatish → serverni <b>qayta ishga tushirish</b></div>}
    </div>
  </div>} />;
}

// ============================================================
//  19 · Buzamiz 2: express.json() yo'q (pg2-out/13)
// ============================================================
const JSON_LINES = (gone) => SERVER_LINES.slice(9, 12).map((l, i) => ({ ...l, n: 10 + i, ...(i === 2 ? { id: 'j', gone: gone === 'gone', neu: gone === 'fix' } : {}) }));
const S18 = mkS(19, [{ st: 'gone' }, { st: 'gone', pm: 500 }, { st: 'fix', pm: 201 }, { st: 'fix', pm: 201, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    <SrvIde lines={JSON_LINES(seg.st)} focus={['j']}>
      {seg.pm === 500 && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={500} res={'{"error":"Cannot destructure property \'model\' of \'req.body\' as it is undefined."}'} hl />}
      {seg.pm === 201 && <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'} st={201} res={'{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}'} />}
    </SrvIde>
    {seg.st === 'gone' && !seg.pm && <div className="mk-tag" style={{ margin: 0 }}>Server baribir «Server 3000-portda ishlayapti» · GET ishlaydi — muammo faqat tanasi bor so'rovlarda (POST, PUT)</div>}
    {seg.sum && <div className="mk-rule"><code>req.body</code> — <b>undefined</b> → birinchi qaraladigan joy <code>app.use(express.json())</code> (app yaratilgandan keyin, endpointlardan oldin)</div>}
  </>} />;
}

// ============================================================
//  20 · Ulanish xatolari — birinchi so'rovda (pg2-out/14, 15)
// ============================================================
const CONN19 = [
  { k: 'pw', h: "Parol xato", code: "const PASSWORD = 'notogri';", st: 500, res: '{"error":"password authentication failed for user \\"postgres\\""}', fix: "o'rnatishda berilgan parol" },
  { k: 'pw', h: "Parol bo'sh (process.env o'qilmagan)", code: 'const PASSWORD = process.env.DB_PASSWORD;', st: 500, res: '{"error":"SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"}', fix: "parol o'zgaruvchisi bo'sh" },
  { k: 'db', h: 'Baza nomi xato', code: "const DATABASE = 'carrental';", st: 500, res: '{"error":"database \\"carrental\\" does not exist"}', fix: '\\l bilan aniq nom: car_rental' },
  { k: 'off', h: "PostgreSQL o'chiq", code: '— (server to\'xtatilgan)', st: 500, res: '{"error":""}', fix: 'console.error(err) → ECONNREFUSED → PostgreSQL\'ni ishga tushiring' },
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
const S19 = mkS(20, [{ show: [] , start: true }, { show: [0, 1] }, { show: [2] }, { show: [3], econn: true }, { show: [0, 1, 2, 3] }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    <Psql title="terminal — har to'rt holatda" lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} />
    {seg.start && <div className="mk-rule">Pool server ishga tushganda ulanmaydi — <b>birinchi so'rovda</b>. «Ishlayapti» faqat Express haqida.</div>}
    <div className="pg-two">{CONN19.map((c, i) => seg.show.includes(i) && <div key={i} style={{ display: 'grid', gap: 6, animation: 'mk-up .4s ease both' }}>
      <div className="pg-lab">{c.h} · <code style={{ textTransform: 'none' }}>{c.code}</code></div>
      <PostmanCard m="GET" url="/api/cars" st={c.st} res={c.res} />
      <div className="exp" style={{ fontSize: 12.5, color: T.green }}>Tuzatish: {c.fix}</div>
    </div>)}</div>
    {seg.econn && <Psql title="terminal — butun xato obyekti" er lines={ECONN} focus={['e']} />}
  </>} />;
}

// ============================================================
//  21 · Port band — «ishlayapti», lekin eski server (pg2-out/16, 20)
// ============================================================
const PORT20 = psql(String.raw`
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
const S20 = mkS(21, [{ v: 'q' }, { v: 'two' }, { v: 'src' }, { v: 'sum' }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'q' && <div className="pg-two"><div className="mk-card"><h5>O'quvchi</h5><div style={{ fontSize: 15 }}>«Kodni tuzatdim, <code>node server.js</code> qildim — javob o'zgarmadi»</div></div><div className="mk-card"><h5>Sabab ko'pincha</h5><div style={{ fontSize: 15 }}>birinchi server boshqa terminalda hali ishlab turibdi</div></div></div>}
    {seg.v !== 'q' && <div className="pg-two">
      <div><div className="pg-lab">1-oyna · eski server</div><Psql title="terminal 1" lines={psql(String.raw`
$ node server.js
Server 3000-portda ishlayapti`)} /></div>
      <div><div className="pg-lab">2-oyna · yangi kod <span className="tm">xato yo'q</span></div><Psql title="terminal 2" lines={PORT20} focus={seg.v === 'two' ? ['x'] : []} /></div>
    </div>}
    {(seg.v === 'src' || seg.v === 'sum') && <CodePanel file="nega — Express manbasi" lines={EXPRESS_SRC} focus={seg.v === 'src' ? ['e', 'cb'] : []} wrap style={{ fontSize: 12.5 }} />}
    {seg.v === 'sum' && <div className="mk-rule">Bitta loyiha — <b>bitta terminal</b>. Qayta ishga tushirishdan oldin <code>Ctrl+C</code>. «O'zgarmadi» desa — birinchi savol: boshqa terminalda server ochiq qolmadimi?</div>}
  </>} />;
}

// ============================================================
//  22 · Tekshiruv 4 — qaysi satr 500 beradi (LineCheck; target 0 dan — 4-satr = 3)
// ============================================================
const LC21 = js(String.raw`
app.post('/api/cars', async (req, res) => {
  try {
    const { model, daily_price, year } = req.body;
    const result = await pool.query('INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }`);
const LC21_FIXED = LC21.map((l, i) => ({ ...l, n: i + 1, ...(i === 3 ? { gone: true } : {}) })); // n — fayldagi raqam (qo'shilgan satrdan keyin siljimasin)
LC21_FIXED.splice(4, 0, { h: jsLine("    const result = await pool.query('INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);"), n: 4, neu: true });
function Screen21(p) {
  const m = MDT[22];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="server.js" lines={LC21} target={3}
    tree={{ root: MKCFG.root, files: MKCFG.files, active: 'server.js' }}
    fixed={LC21_FIXED} fixedExtra={[{ file: 'Postman — haqiqiy javob', lines: plainLinesPm(`POST /api/cars → 201\n{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}`) }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}
function plainLinesPm(src) { return src.split('\n').map((l) => ({ h: `<span class="ok">${escH(l)}</span>` })); }

// ============================================================
//  23 · Amaliyot 4 — o'zingiz buzing
// ============================================================
const P4 = mkS(23, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P4_STEPS = [
  { t: 'Buzish', cmds: ['INSERT INTO cars (model, price, year) …   ← server.js da', 'node server.js'], exp: '500 column "price" of relation "cars" does not exist' },
  { t: 'Tuzatish', cmds: ['price → daily_price', 'node server.js'], exp: '201' },
  { t: 'Ikki server', cmds: ['node server.js   ← 2-terminalda, 1-si ishlab turibdi'], exp: 'ikkinchisi ham «Server 3000-portda ishlayapti»' },
  { t: "To'xtatish", cmds: ['Ctrl+C   ← ikkala terminalda'], exp: "Postman: GET — javob yo'q (server yo'q)" },
];
const P4_TROUBLE = [
  ['1-qadamda 201', "server qayta ishga tushmagan — eski kod ishlayapti (21-ekran)"],
  ['column "price" does not exist (of relation siz)', "SELECT/UPDATE da xato qilingan — INSERT dagi ustunni o'zgartiring"],
  ['3-qadamda listen EADDRINUSE: address already in use :::3000', "sizning server.js ingizda callback xatoni o'qiydi (Gemini boshqacha yozgan) — bu yaxshi; ikkala terminalni ham to'xtating"],
  ['4-qadamda javob bor', 'yana bir terminal ochiq qolgan — hammasini Ctrl+C'],
];
const P4_PROOF = { label: "Isbot: 1-qadamdagi 500 xabari", placeholder: "Postman'dagi error matnini qo'ying", check: (v) => /column\s+\\?"?price\\?"?\s+of relation\s+\\?"?cars\\?"?\s+does not exist/i.test(v), wrong: "Xabar to'liq bo'lsin: qaysi ustun va qaysi jadval (of relation …) — Postman'dagi error qiymatini nusxalang" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }

// ============================================================
//  24 · m4-06 xaritasi
// ============================================================
const MAP06 = [
  { t: 'Kirish', s: 's0–s1', d: "«mahsulotlar qayerda saqlanadi?» → baza · reja (5 qadam)", m: '' },
  { t: 'CRUD', s: 's2–s9', d: "jadval chizmasi · INSERT · SELECT · WHERE · UPDATE (WHERE'siz ogohlantirish) · DELETE · 3 test", m: "javobdagi son (5-ekran) · BEGIN … ROLLBACK (8-ekran) · ORDER BY" },
  { t: 'Menejer navbati', s: 's10', d: "to'rt hodisa → to'g'ri buyruq", m: '' },
  { t: 'AI bilan', s: 's11–s14', d: "vazifa → SQL → tekshir · test · users jadvali · AI xatosi product", m: 'HINT ham adashadi (11-ekran)' },
  { t: 'Yakun', s: 's15–s16', d: "o'z INSERT'i · amaliyot: VS Code yoki PostgreSQL terminalida AI bilan o'z do'koni jadvali + CRUD · kartochkalar", m: "apostrof (11-ekran) · NOT NULL maslahati (12-ekran)" },
];
const S23 = mkS(24, [{ hl: [] }, { hl: [1] }, { hl: [3] }, { hl: [4] }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP06.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    <div className="n2-warn">Amaliyotda o'quvchi <b>haqiqiy psql</b>'da ishlaydi — har kompyuterda PostgreSQL ishlab turishi shart (PostgreSQL-1, sinf ro'yxati).</div>
  </div>} />;
}

// ============================================================
//  25 · m4-08 xaritasi va farqlar
// ============================================================
const MAP08 = ['kirish — kod ichidagi ro\'yxat', 'reja va tayyorgarlik (psql -U postgres, Gemini)', 'Amaliyot 1 · cars jadvali — o\'zingiz, psql', 'Amaliyot 2 · server.js GET — Gemini', 'Amaliyot 3 · POST, PUT, DELETE — Gemini, Postman', 'Amaliyot 4 · AI xatosi: price → daily_price', 'test', 'podium', 'yakun'];
const DIFF08 = [
  ["Xato matni qisqartirilgan", 'darsda: column "price" does not exist · haqiqiysi: … of relation "cars" does not exist'],
  ['Gemini kodi har kimda boshqacha', "promptdagi talablarni tekshiring ($1, 201, express.json), satrma-satr bir xillikni emas"],
  ['is_rented — null', "POST'da berilmaydi, DEFAULT yo'q"],
  ['Port band — «ishlayapti»', "Express 5: ikkinchi server xato bermay chiqadi, eski server javob beradi — bitta terminal, Ctrl+C"],
];
const S24 = mkS(25, [{ v: 'map', d: [] }, { v: 'diff', d: [0, 1] }, { v: 'diff', d: [2, 3] }, { v: 'diff', d: [0, 1, 2, 3], sum: true }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    {seg.v === 'map' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">m4-08 · 9 ekran</div>
      <div className="mk-plan">{MAP08.map((x, i) => <div key={i} className={i >= 2 && i <= 5 ? 'hl' : ''}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></div>)}</div></div>}
    {seg.v === 'diff' && <div style={{ display: 'grid', gap: 8 }}>{DIFF08.map(([h, d], i) => <div key={i} className={`mk-step${seg.d.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.d.includes(i) ? 1 : 0.45 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span><div className="t"><b>{h}</b><div style={{ fontSize: 13 }}>{d}</div></div></div>)}</div>}
    {seg.sum && <div className="mk-rule">m4-08 dan oldin: <b>sinf paroli</b> hammaga ma'lum · <b>Postman</b> o'rnatilgan · qoida — <b>bitta loyiha, bitta terminal</b></div>}
  </>} />;
}

// ============================================================
//  26 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const STUMBLE25 = [
  ['Jadval/ustun nomi', 'relation "product" · column "narx" (+ HINT)', '\\d jadval bilan solishtirish'],
  ['Apostrof', 'syntax error at or near "yinchoq"', "''"],
  ["WHERE'siz", 'UPDATE 3 / DELETE 3', "BEGIN … ROLLBACK; o'chgan bo'lsa — qayta INSERT"],
  ['Parol/baza', 'password authentication failed · client password must be a string · database … does not exist', 'Pool sozlamalari, sinf paroli'],
  ["Bo'sh xato", '{"error":""}', "console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring"],
  ["O'zgarmadi", 'javob eski', 'ikkinchi terminal; Ctrl+C'],
];
const QA25 = [
  ["«Nega mahsulot o'rni o'zgardi?»", 'ORDER BY yo\'q — tartib kafolatlanmaydi; ORDER BY id.'],
  ['«$1 nima?»', "qiymat alohida beriladi, SQL matniga kirmaydi; 1 OR 1=1 misoli (16-ekran)."],
  ['«Postman shartmi?»', "yo'q, so'rov yuboradigan istalgan dastur; darsda Postman, chunki sinf uchun qulay."],
  ["«NestJS'da ham shunday yozamizmi?»", "yo'q: Nest'da Repository bu so'rovlarni o'zi yozadi (find, save…). Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz."],
  ['«SQL katta harfda yozilishi shartmi?»', "yo'q, kalit so'zlar kichik harfda ham ishlaydi (sinab ko'rdik: select … from PRODUCTS); katta harf — o'qish oson bo'lishi uchun odat."],
];
const S25 = mkS(26, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5], qa: true }]);
function Screen25(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S25} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE25.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>xabarni o'quvchi bilan birga o'qing</b>: jadval/ustun nomi, status, terminal.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA25.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  27 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[27].final;
function Screen26(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan ikkitasi sinfdagi holatlar bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4-06 va m4-08 dagi xatolar sinfda sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  28 · Yakun (M13)
// ============================================================
const SUM27 = [
  { k: 'crud', t: 'CRUD = INSERT · SELECT · UPDATE · DELETE; javobdagi son — nechta qator tegildi; ORDER BY siz tartib kafolatlanmaydi', st: ['psql'] },
  { k: 'where', t: "WHERE'siz — hamma qator; xavfli so'rov BEGIN … ROLLBACK ichida sinaladi", st: ['psql', 'jad'] },
  { k: 'err', t: "Xatolar: nom (\\d), apostrof (''), son o'rniga matn; NOT NULL yo'q — baza qo'riqlamaydi", st: ['jad'] },
  { k: 'exp', t: 'Express: Pool → pool.query(sql, [$1…]) → rows → res.json; 200 · 201 · 404 · 500', st: ['pm', 'srv', 'pool'] },
  { k: 'brk', t: "Server xatolari: ustun nomi · express.json() · parol/baza birinchi so'rovda · bo'sh xabar → console.error(err) · ikkinchi server «ishlayapti»", st: ['srv', 'pool'] },
  { k: 'class', t: "Sinf: m4-06 amaliyoti haqiqiy PostgreSQL terminalida; m4-08 dan oldin parol, Postman, bitta terminal", st: ['pm', 'psql'] },
];
const STATIONS27 = [['pm', 'Postman', '#FF6C37'], ['srv', 'Express', T.ink], ['pool', 'Pool · $1', T.purple], ['psql', 'SQL', T.accent], ['jad', 'Jadval', PG.pg]];
function SummaryMap27({ hl }) {
  const cur = SUM27.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — so'rovning bazagacha yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 6 }}>
      {STATIONS27.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK27 = [
  { t: "Jadval: schema.sql — o'z do'koningiz jadvali, NOT NULL (nom, narx)", c: ['psql -U postgres -d <baza> -f schema.sql'] },
  { t: 'Server: server.js — GET · POST (201, RETURNING *) · PUT · DELETE (rowCount → 404), hamma qiymat $1 bilan', c: ['node server.js'] },
  { t: "Sinov: Postman'da 4 so'rov + yo'q id — 200 · 201 · 200 · 200 · 404", c: [] },
  { t: "Xavfsiz sinash: PostgreSQL terminalida BEGIN → WHERE'siz UPDATE → SELECT → ROLLBACK — README'ga UPDATE n va ROLLBACK", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "shop-api"', 'git push'] },
];
const CHEATSHEET27 = `# PostgreSQL-2 — mentor eslatmasi (CRUD va Express)
## CRUD (psql)
INSERT INTO products (name, price, stock) VALUES (…) → INSERT 0 n · SELECT * / SELECT name, price · WHERE price < 100000 · UPDATE … SET … WHERE id = 1 → UPDATE 1 · DELETE … WHERE id = 3 → DELETE 1
Javobdagi son: 1 — kutganingiz · 0 — WHERE hech narsaga mos kelmadi (xato emas) · katta son — WHERE noto'g'ri/yo'q
ORDER BY yo'q — tartib kafolatlanmaydi (UPDATE dan keyin qator oxiriga tushishi mumkin) → ORDER BY id
## Xavfsiz sinash
BEGIN; → xavfli UPDATE/DELETE → SELECT bilan ko'rish → ROLLBACK; (yoki COMMIT;) · prompt: =*# ochiq · =!# xato bo'ldi
## Sinfdagi SQL xatolari
relation "product" / column "narx" → \\d jadval bilan solishtirish (HINT ham adashadi) · 'arzon' → invalid input syntax for type integer · apostrof → '' (O''yinchoq) · ustun/qiymat soni → more target columns than expressions · NOT NULL yo'q → nomsiz qator xato bermay saqlanadi
## Express → baza
const { Pool } = require('pg') · new Pool({ user, password, database, host, port }) · pool.query(sql, [qiymatlar]) → result.rows / result.rowCount · res.json · GET 200 · POST 201 (RETURNING *) · PUT/DELETE 200 · rowCount 0 → 404 · catch → 500
Nega $1: yopishtirilgan '… WHERE id = ' + id + "1 OR 1=1" → hamma qator o'chdi; $1 bilan → 500 invalid input syntax, jadval joyida
## Server xatolari
column "price" of relation "cars" does not exist → kodda ustun nomi · Cannot destructure property 'model' of 'req.body' → app.use(express.json()) · password authentication failed → parol · client password must be a string → parol bo'sh (process.env) · database "…" does not exist → nom · {"error":""} → console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring
Pool birinchi so'rovda ulanadi — «Server … ishlayapti» faqat Express haqida
Port band: Express 5 da ikkinchi server ham «ishlayapti» deb xato bermay chiqadi — eski server javob beradi → bitta terminal, Ctrl+C
## Sinf
m4-06: amaliyot haqiqiy PostgreSQL terminalida (AI bilan o'z do'koni) — har kompyuterda PostgreSQL; apostrof va NOT NULL maslahati
m4-08: sinf paroli, Postman, bitta terminal; darsdagi xato matni qisqa — haqiqiysida "of relation cars"; is_rented null — DEFAULT yo'q; Gemini kodi har xil
## Sizning uyga vazifangiz
shop-api: schema.sql (NOT NULL) + server.js (4 endpoint, $1, 404) + README (5 so'rov va javobi, BEGIN … ROLLBACK) → GitHub → repo linki platformadagi uyga vazifaga`;
const s27Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CRUD — to'rt buyruq; <b>javobdagi son</b> nechta qator tegilganini aytadi", "Birinchi: CRUD to'rt buyruq, insert, select, update va delete. Javobdagi son nechta qator tegilganini aytadi, nol xato emas. Order by yozilmasa, tartib kafolatlanmaydi.", { hl: 'crud' }),
  sg('b2', "<b>WHERE'siz — hamma qator</b>; xavfli so'rov BEGIN … ROLLBACK ichida", "Ikkinchi: where'siz update yoki delete hamma qatorga tegadi. Xavfli so'rovni avval begin ichida sinang, select bilan ko'ring, keyin rollback yoki commit.", { hl: 'where' }),
  sg('b3', "SQL xatolarida <b>nomni jadval bilan</b> solishtiring; apostrof ikki marta", "Uchinchi: sinfdagi SQL xatolarida xabar ichidagi nomni teskari chiziqcha d bilan solishtiring, hint'ga ishonmang. Apostrof ikki marta yoziladi. Not null yozilmagan bo'lsa, baza qo'riqlamaydi.", { hl: 'err' }),
  sg('b4', "Express: <b>Pool → pool.query → rows → res.json</b>, qiymat doim $1 bilan", "To'rtinchi: Express'dan bazaga yo'l, Pool, pool query, rows va res json. Qiymatlar doim dollar bir bilan, yopishtirilgan so'rov butun jadvalni o'chirishi mumkin.", { hl: 'exp' }),
  sg('b5', "Server xatolarini <b>status, error va terminal</b> aytadi", "Beshinchi: server xatolari. Ustun nomi, express json, parol va baza birinchi so'rovda chiqadi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. Ikkinchi server ham ishlayapti deydi, bitta terminal qoidasi.", { hl: 'brk' }),
  sg('b6', "Sinf: m4-06 amaliyoti <b>haqiqiy PostgreSQL terminalida</b>, m4-08 dan oldin parol va Postman", "Oltinchi, sinf uchun: m4-06 amaliyoti haqiqiy PostgreSQL terminalida, har kompyuterda PostgreSQL kerak. m4-08 dan oldin sinf paroli, Postman va bitta terminal qoidasi.", { hl: 'class' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z do'koningiz uchun shop-api — jadval, server va README", "Uyga vazifa: o'z do'koningiz uchun shop api. Schema faylida o'z jadvalingiz, not null bilan. Server js'da to'rt endpoint, hamma qiymat dollar bir bilan, topilmasa to'rt yuz to'rt. README'da har endpoint uchun bitta so'rov va javobi.", { hl: 'hw' }),
  sg('hw2', "Bir marta xavfsiz sinang va <b>repo linkini platformaga</b> qo'ying", "Bir marta where'siz update'ni begin ichida sinab, rollback qiling va natijani README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: CRUD, xavfsiz sinash, xatolar va server — bir sahifada", "Pastda bir sahifalik eslatma: CRUD, xavfsiz sinash, sinfdagi SQL xatolari, Express yo'li, server xatolari va ikki o'quvchi darsi tayyorgarligi. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen27(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET27;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'postgresql-2-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s27Segments(passed), [passed]);
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
            <SummaryMap27 hl={hl} />
            <div className="mk-plan">{SUM27.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK27.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> NOT NULL · $1 (yopishtirish yo'q) · 404 · README'da 5 so'rov va ROLLBACK.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>NestJS arxitekturasi — Module, Controller, Service</div><div style={{ fontSize: 13.5, color: T.ink2 }}>Express'dagi shu CRUD Nest'da qanday tartib bilan yoziladi</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · PostgreSQL</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat 10 daqiqa: ovoz ~23 daqiqa · to'rt amaliyot 40–50 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 13-ekrandan keyin tanaffus qilsangiz bo'ladi", 'Kerak: PostgreSQL-1 darsi o\'tilgan · PostgreSQL ishlab turgan · Node.js 20+ · VS Code · Postman', "Loyihalar: shop bazasi (o'quvchi m4-06) va AvtoIjara serveri (o'quvchi m4-08)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, ScreenCrud, Screen2, Screen3, Screen4, Screen5, ScreenP1, Screen7, Screen8, ScreenP2, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenP3, Screen17, Screen18, Screen19, Screen20, Screen21, ScreenP4, Screen23, Screen24, Screen25, Screen26, Screen27];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function PgCrudMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
