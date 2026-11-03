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
//  PG-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg1-matn.py (manba: 06-PostgreSQL1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · PostgreSQL",
  "title": "Siz Mongo'ni bilasiz. Bugun o'sha blog PostgreSQL'da.",
  "seg": [
   [
    "a",
    "Siz Mongo'da blog yozgansiz — bugun <b>xuddi shu blogni PostgreSQL'da</b> quramiz",
    "Assalomu alaykum. Siz MongoDB bilan, Mongoose orqali ishlagansiz: modellar, ref, populate. AI Startup kursidagi o'quvchilar PostgreSQL bilan ishlaydi. Bugun siz bilgan narsadan boshlaymiz: Mongo'dagi oddiy blogni olamiz va uni PostgreSQL'da qaytadan quramiz."
   ],
   [
    "b",
    "Dars oxirida PostgreSQL sizda ishlaydi, <b>ikki jadval va JOIN</b> o'z qo'lingizda",
    "Dars oxirida PostgreSQL kompyuteringizda o'rnatilgan bo'ladi. Ikki bog'langan jadvalni o'zingiz yaratasiz, baza qaytargan xatolarni o'qiysiz va JOIN bilan ikki jadvalni bitta javobda ko'rasiz."
   ],
   [
    "c",
    "O'quvchi darsidagi «oxirgi telefon»ni ikki oynada <b>o'z ko'zingiz bilan</b> ko'rasiz",
    "O'quvchi darsida bitta telefonni ikki kishi bir vaqtda sotib olmoqchi bo'ladigan misol bor. Uni gap bilan emas, ikkita terminal oynasida o'zingiz sinab ko'rasiz va nima uni saqlab qolishini aniq bilasiz."
   ],
   [
    "d",
    "Sinf kompyuterlariga PostgreSQL'ni <b>siz o'rnatasiz</b> — o'quvchi darsida bu qism yo'q",
    "Yana bir muhim narsa: o'quvchi darslarida PostgreSQL'ni o'rnatish o'rgatilmaydi. Sinf kompyuterlariga uni siz o'rnatasiz, keyingi darslar shunga tayanadi. Buni ham, o'quvchi darsini qanday o'tishni ham oxirgi bosqichda ko'ramiz."
   ],
   [
    "e",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor, ularni o'z kompyuteringizda qilasiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "SQL va NoSQL: bitta ma'lumot ikki xil shaklda saqlanadi",
  "seg": [
   [
    "a",
    "Bazalar ikki katta oilaga bo'linadi: SQL va NoSQL — <b>farqi ma'lumot shaklida</b>",
    "Mongo'ni PostgreSQL bilan solishtirishdan oldin bitta asosiy farqni aniq ko'rib olamiz. Bazalar ikki katta oilaga bo'linadi: SQL va NoSQL. MongoDB NoSQL bazasi, PostgreSQL esa SQL bazasi. Ularning asosiy farqi ma'lumot qanday shaklda saqlanishida."
   ],
   [
    "b",
    "MongoDB'da har yozuv — <b>jingalak qavs ichidagi hujjat</b>, hujjatlar <code>collection</code>ga yig'iladi",
    "Chapda MongoDB. Bu yerda har bir yozuv hujjat, inglizchasi document: jingalak qavs ichida maydon va qiymat, masalan username, ali. Hujjatlar collection'ga yig'iladi. Qarang: vali'ning hujjatida shahar degan qo'shimcha maydon bor, ali'nikida yo'q. Mongo buni qabul qiladi: hujjatlar har xil shaklda bo'lishi mumkin."
   ],
   [
    "c",
    "PostgreSQL'da ma'lumot jadvalda: <b>tepada ustunlar, har yozuv bitta qator</b>",
    "O'ngda o'sha ma'lumot PostgreSQL'da. Bu yerda ma'lumot jadvalda, inglizchasi table. Tepada ustunlar, ya'ni column: id va username. Har bir yozuv bitta qator, ya'ni row: bir, ali. Har qatorda ustunlar bir xil. Shaharni yozib ko'rdik: jadvalda bunday ustun yo'q, shuning uchun PostgreSQL xato berdi."
   ],
   [
    "d",
    "SQL — <b>jadvalga so'rov yozish tili</b>; NoSQL — «SQL emas», hujjat bilan ishlaydi",
    "Endi nomlarning ma'nosi. SQL bu jadvalga so'rov yozish tili: select, insert, update. Ekranda shunday so'rov: ikkinchi foydalanuvchining username'ini so'radik, javob vali. PostgreSQL shu tilda ishlagani uchun SQL bazasi deyiladi. NoSQL esa «SQL emas» degani: MongoDB jadval o'rniga hujjat bilan ishlaydi."
   ],
   [
    "e",
    "Xulosa: Mongo — <code>collection</code> va hujjat, PostgreSQL — <b>jadval, ustun va qator</b>",
    "Xulosa: MongoDB'da ma'lumot hujjat ko'rinishida turadi va hujjatlar collection'ga yig'iladi. PostgreSQL'da ma'lumot jadvalda: ustunlar va qatorlar. Demak, Mongo'dagi bitta hujjat PostgreSQL'dagi bitta qatorga, hujjatdagi maydon esa ustunga to'g'ri keladi. Darsning qolgan hammasi shu farqdan kelib chiqadi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "Mongo'dagi blog: ikki model, bitta ref, bitta populate",
  "seg": [
   [
    "a",
    "Boshlanish nuqtasi — <b>siz bilgan Mongo</b>: ikki model, foydalanuvchi va uning posti",
    "Shakldagi farqni ko'rdik, endi uni tanish koddan boshlab ochamiz. Ekranda Mongoose'dagi oddiy blog: ikkita model. User'da faqat username, Post'da muallif va izoh. Bu kodni haqiqiy MongoDB'da yurgizib ko'rdik."
   ],
   [
    "b",
    "Post'dagi <code>author</code> — ObjectId va <b><code>ref: 'User'</code></b>: post shu foydalanuvchiga bog'langan",
    "Post modelidagi author maydoniga qarang: turi ObjectId, yonida ref, User. Ya'ni postda foydalanuvchining o'zi emas, faqat uning id'si saqlanadi, ref esa bu id qaysi modelga tegishli ekanini aytadi."
   ],
   [
    "c",
    "<code>populate('author')</code> id o'rniga <b>butun foydalanuvchi hujjatini</b> javobga qo'yib beradi",
    "populate so'rov paytida shu id bo'yicha foydalanuvchini topadi va javobga qo'yib beradi. Terminalga qarang: author ichida endi id emas, butun hujjat, username ali."
   ],
   [
    "d",
    "Xulosa: <code>ref</code> — bog'lanish, <code>populate</code> — birlashtirish; PostgreSQL'da <b>ikkalasi ham bor</b>",
    "Xulosa: Mongo'da bog'lanish ikki qismdan iborat. ref ikki modelni bog'laydi, populate ularni bitta javobda birlashtiradi. PostgreSQL'da ham xuddi shu ikki qism bor, faqat nomlari boshqa. Lekin avval Mongo xato bermay o'tkazib yuboradigan ikki holatni ko'raylik."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "Mongo ikki holatda xato bermaydi: yo'q muallif va har xil hujjat",
  "seg": [
   [
    "a",
    "Mongo'da tartibni kim saqlaydi? <b>Ikki tajriba</b> bilan tekshirib ko'ramiz",
    "Mongo'da bog'lanish bor ekan. Endi savol: bu bog'lanishni kim qo'riqlaydi? Ikkita tajriba qildik. Ikkalasida ham MongoDB xato bermadi, va aynan shu xato bermaslik PostgreSQL bilan asosiy farq."
   ],
   [
    "b",
    "Mavjud bo'lmagan muallifga post saqlandi, <code>populate</code> esa <b><code>author: null</code></b> qaytardi",
    "Birinchi tajriba: postni bazada yo'q foydalanuvchining id'si bilan yaratdik. Mongo uni saqladi, xato yo'q. populate qilganda esa author null bo'lib chiqdi. Ya'ni muallifi yo'q post bazada turibdi va bu haqda hech qanday xato chiqmadi."
   ],
   [
    "c",
    "Sxemani chetlab yozilgan hujjat <b>boshqa maydonlar bilan</b> o'sha kolleksiyaga tushdi",
    "Ikkinchi tajriba: Mongoose sxemasini chetlab, kolleksiyaning o'ziga boshqa maydonli hujjat yozdik: muallif, matn va like. Bu boshqa skript yoki boshqa xizmat yozganday holat. Kolleksiya uni ham qabul qildi: endi bitta posts ichida har xil shakldagi hujjatlar."
   ],
   [
    "d",
    "Xulosa: Mongo'da tartibni Mongoose kodi saqlaydi, PostgreSQL'da — <b>bazaning o'zi</b>",
    "Xulosa: oddiy holatda, alohida tekshiruv yozilmagan bo'lsa, Mongo'da tartibni sizning kodingiz, Mongoose sxemasi saqlaydi. Kodni chetlab o'tgan yozuvni baza qabul qiladi. PostgreSQL'da qoida jadvalning o'zida yoziladi va uni hech kim chetlab o'ta olmaydi. Buni uchinchi bosqichda sinab ko'ramiz."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "Siz bilgan har so'zning PostgreSQL'dagi jufti",
  "seg": [
   [
    "a",
    "Har Mongo tushunchasining PostgreSQL'da <b>jufti bor</b> — lug'atni bir marta ko'rib olamiz",
    "Mongo qayerda xato bermasligini ko'rdik. Endi lug'at: siz bilgan har so'zning PostgreSQL'dagi jufti. Bu lug'at sinfda ham kerak bo'ladi, chunki o'quvchi darsi ham jadval va hujjatni solishtiradi."
   ],
   [
    "b",
    "Collection — jadval, document — qator, maydon esa <b>turi aniq ustun</b>",
    "Collection jadval bo'ladi, document jadvaldagi bitta qator. Maydon ustun bo'ladi, lekin bitta farq bor: ustunning turi oldindan yoziladi, son yoki matn. Jadvaldagi har qatorda ustunlar bir xil."
   ],
   [
    "c",
    "<code>_id</code> o'rnida o'zi o'sadigan raqam, <code>ref</code> — <b>tashqi kalit</b>, <code>populate</code> — <b><code>JOIN</code></b>",
    "Mongo'dagi id o'rnida PostgreSQL'da odatda o'zi o'sadigan raqam: bir, ikki, uch. ref'ning jufti tashqi kalit, inglizchasi foreign key: posts jadvalidagi user id ustuni users jadvaliga ishora qiladi. populate'ning jufti esa JOIN."
   ],
   [
    "d",
    "Mongoose sxemasi kodda turadi, <code>CREATE TABLE</code> esa jadval qoidasini <b>bazaning o'ziga</b> yozadi",
    "Eng katta farq shu qatorda. Mongoose sxemasi sizning kodingizda turadi. CREATE TABLE esa jadvalni va uning qoidalarini bazaning o'ziga yozadi: bo'sh bo'lmasin, takrorlanmasin, muallif mavjud bo'lsin. mongosh o'rnida esa PostgreSQL terminali, uning dastur nomi psql."
   ],
   [
    "e",
    "Xulosa: tushunchalar deyarli bir xil — farq <b>qoidalar qayerda turishida</b>",
    "Xulosa: tushunchalarning ko'pi sizga tanish, faqat nomi boshqa. Asosiy farq qoidalar qayerda turishida: Mongo'da kodda, PostgreSQL'da jadvalda. O'quvchi «Mongo'dagi populate qani?» desa, javob: JOIN. Tekshirib olaylik."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Mongo'da ref ham, populate ham bor edi. PostgreSQL'da populate o'rnida qaysi biri?",
  "q": "Lug'atni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Mongo'da ikki narsa bor edi: ref bog'laydi, populate esa so'rov paytida birlashtiradi. PostgreSQL'da populate'ning ishini qaysi biri qiladi? Variantni tanlang.",
  "ok": "To'g'ri, JOIN. U so'rov paytida ikki jadvalni ulaydi va bitta javob beradi, populate kabi. REFERENCES esa ref'ning jufti: u faqat bog'lanishni belgilaydi va qo'riqlaydi, javobga hech narsa qo'shmaydi. Demak, PostgreSQL'da bog'lanishni REFERENCES belgilaydi, ikki jadvalni bitta javobga esa JOIN birlashtiradi.",
  "okShort": "<code>JOIN</code> — so'rov paytida ulaydi (populate). <code>REFERENCES</code> — bog'lanishni belgilaydi va qo'riqlaydi (ref).",
  "hint": "So'rov paytida ishlaydigan va ikki jadvalni bitta javobga yig'adigan buyruqni qidiring.",
  "correct": 2,
  "opts": [
   "REFERENCES users(id)",
   "SERIAL PRIMARY KEY",
   "JOIN … ON …",
   "CREATE TABLE"
  ],
  "wrong": {
   "0": "Bu refning jufti: bog'lanishni belgilaydi, lekin so'rov natijasini birlashtirmaydi.",
   "1": "Bu _idning jufti: qatorning raqami.",
   "3": "Bu Schemaning jufti: jadval va uning qoidalarini yaratadi."
  }
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'rnatish",
  "title": "Windows: postgresql.org → o'rnatuvchi → parol, port, PATH",
  "seg": [
   [
    "a",
    "Mongo bilan solishtirdik — endi o'rnatamiz; Windows yo'li <b>rasmiy saytdan</b> boshlanadi",
    "Tushunchalar tayyor, endi PostgreSQL'ni o'rnatamiz. Avval Windows, keyingi ekranda macOS. Sizda qaysi bo'lishidan qat'i nazar ikkalasini ham ko'ring: sinf kompyuterlari boshqacha bo'lishi mumkin. Windows'da postgresql org saytidagi download sahifasidan rasmiy o'rnatuvchi olinadi, eng yangi barqaror versiyasi o'n sakkiz."
   ],
   [
    "b",
    "Komponentlar: Server, pgAdmin va <b>Command Line Tools kerak</b>, Stack Builder kerak emas",
    "Komponentlar oynasida to'rtta band bor. Server, ya'ni bazaning o'zi. pgAdmin, grafik oyna, ixtiyoriy. Command Line Tools: PostgreSQL terminali shu yerda, u albatta kerak. Stack Builder qo'shimcha dasturlar uchun, bizga kerak emas."
   ],
   [
    "c",
    "<b>Parolni yozib qo'ying</b>: o'quvchi keyingi darslarda aynan shu parolni so'raydi",
    "Keyin parol: bu postgres foydalanuvchisining paroli. Uni albatta yozib qo'ying, o'quvchi keyingi darslarda PostgreSQL terminalini ochganda va loyiha sozlamasida aynan shu parolni so'raydi. Port besh ming to'rt yuz o'ttiz ikki, o'zgartirmang. Qolgan oynalarni o'zgartirmasdan o'tkazing."
   ],
   [
    "d",
    "O'rnatuvchi <b>PATH'ga qo'shmaydi</b>: <code>bin</code> papkasini qo'lda qo'shing yoki SQL Shell'ni oching",
    "Muhim joy: o'rnatuvchi psql buyrug'ini PATH'ga qo'shmaydi. Shuning uchun terminalda psql yozilsa, Windows uni tanimaydi. Ikki yo'l bor: PostgreSQL'ning bin papkasini Path'ga qo'shib, terminalni yangidan ochish, yoki Start menyusidan SQL Shell, ya'ni PostgreSQL terminalini ochish."
   ],
   [
    "e",
    "Xulosa: Windows'da <b>uch narsani tekshiring</b> — parol yozilgan, port 5432, PATH'da <code>bin</code>",
    "Xulosa: Windows'da o'rnatgandan keyin uch narsani tekshiring. Parol yozib qo'yilgan, port besh ming to'rt yuz o'ttiz ikki, va bin papkasi Path'da. Sinfda eng ko'p uchraydigan muammo uchinchisi bo'ladi: psql buyrug'i tanilmaydi."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'rnatish",
  "title": "macOS: Postgres.app — Initialize, PATH va parolsiz postgres",
  "seg": [
   [
    "a",
    "Mac'da eng sodda yo'l — <b>Postgres.app</b>: dastur, server va <code>psql</code> bitta faylda",
    "Windows'ni ko'rdik, endi macOS. Mac uchun eng sodda yo'l Postgres.app. Bu bitta dastur: ichida server ham, PostgreSQL terminali ham bor. postgresapp com saytidan yuklab olinadi va Applications papkasiga ko'chiriladi."
   ],
   [
    "b",
    "Dasturni ochib <b>Initialize</b> bosiladi — server ishga tushadi, port yana 5432",
    "Dasturni ochib, Initialize tugmasini bosasiz. Server ishga tushadi, port yana besh ming to'rt yuz o'ttiz ikki. Parol so'ralmaydi: o'z kompyuteringizdan parolsiz ulanasiz. Postgres.app postgres foydalanuvchisini ham o'zi yaratadi."
   ],
   [
    "c",
    "Terminal <code>psql</code>ni topishi uchun <b>bitta PATH buyrug'i</b>, keyin terminalni yangidan oching",
    "Terminal psql buyrug'ini topishi uchun rasmiy saytda bitta buyruq bor, u Postgres.app papkasini PATH'ga qo'shadi. Uni bir marta yurgizasiz, kompyuter parolingizni so'raydi. Keyin terminalni yopib, yangidan oching."
   ],
   [
    "d",
    "Homebrew bilan o'rnatilsa <b><code>postgres</code> roli yo'q</b> — <code>createuser -s postgres</code> bilan tuzatiladi",
    "Ehtiyot bo'ling: ba'zi mentorlar Homebrew bilan o'rnatadi. U holda server bazaga sizning Mac foydalanuvchi nomingiz bilan kiradi, postgres degan foydalanuvchi bo'lmaydi. Sinab ko'rdik: psql minus U postgres xato beradi. Tuzatish bitta buyruq: createuser minus s postgres. Shundan keyin ulanish ishlaydi."
   ],
   [
    "e",
    "Xulosa: Mac'da Postgres.app; Homebrew bo'lsa — avval <b><code>postgres</code> foydalanuvchisini yarating</b>",
    "Xulosa: Mac'da Postgres.app'ni o'rnating, Initialize bosing va PATH buyrug'ini yurgizing. Homebrew bilan o'rnatilgan bo'lsa, createuser minus s postgres yozing. O'quvchi darslari psql minus U postgres buyrug'ini kutadi, shuning uchun bu foydalanuvchi har kompyuterda bo'lishi shart."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "2-bosqich · ulanish",
  "title": "psql -U postgres: parol, prompt, birinchi so'rov",
  "seg": [
   [
    "a",
    "O'rnatildi — endi ulanamiz: <code>psql</code> siz bilgan <b><code>mongosh</code> kabi</b> buyruq oynasi",
    "PostgreSQL o'rnatildi, endi unga ulanamiz. PostgreSQL terminali, dastur nomi psql, mongosh kabi: terminalda bazaga buyruq yozasiz, javob shu yerda chiqadi. Buyruq: psql minus U postgres, ya'ni postgres foydalanuvchisi nomidan."
   ],
   [
    "b",
    "Windows parol so'raydi; yozayotganda ekranda <b>belgi chiqmaydi</b> — bu normal",
    "Windows'da parol so'raladi, o'rnatishda yozgan parolingiz. Diqqat: yozayotganingizda ekranda hech qanday belgi chiqmaydi, yulduzcha ham. Bu normal, yozib Enter bosing. Mac'da Postgres.app bilan parol so'ralmaydi. Kirgach prompt chiqadi: postgres, panjara. Bu siz hozir postgres bazasidasiz degani."
   ],
   [
    "c",
    "Har buyruq <b>nuqta-vergul bilan</b> tugaydi; unutilsa prompt <code>postgres-#</code> bo'lib kutadi",
    "Birinchi so'rov: select version. Har SQL buyrug'i nuqta-vergul bilan tugaydi. Unutsangiz, PostgreSQL terminali xato bermaydi, prompt'dagi panjara oldida tire paydo bo'ladi va davomini kutadi. Shunchaki nuqta-vergul yozib Enter bosing. Sinfda bu eng ko'p beriladigan savol."
   ],
   [
    "d",
    "<code>\\l</code> — <b>bazalar ro'yxati</b>: <code>postgres</code> va ikki shablon; <code>\\q</code> — PostgreSQL terminalidan chiqish",
    "Teskari chiziqcha bilan boshlanadigan buyruqlar PostgreSQL terminalining o'zi uchun, ularga nuqta-vergul kerak emas. Teskari chiziqcha l bazalar ro'yxatini ko'rsatadi: postgres va ikkita template, ya'ni shablon. Shablonlarga tegmaysiz. Teskari chiziqcha q PostgreSQL terminalidan chiqaradi."
   ],
   [
    "e",
    "Xulosa: prompt <b>qaysi bazada turganingizni</b> aytadi; SQL — nuqta-vergul bilan, <code>\\</code> buyruqlari — usiz",
    "Xulosa: prompt'ga doim qarang, u qaysi bazada turganingizni aytadi. SQL buyrug'i nuqta-vergul bilan tugaydi, teskari chiziqchali buyruqlar esa usiz. Endi o'zingiz o'rnatib, ulanib ko'ring."
   ]
  ]
 },
 "10": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 15–20 daqiqa",
  "title": "PostgreSQL'ni o'rnating va psql bilan ulaning",
  "seg": [
   [
    "a",
    "Endi siz: PostgreSQL'ni <b>o'z kompyuteringizga</b> o'rnatib, birinchi so'rovni yurgizasiz",
    "Endi navbat sizga: PostgreSQL'ni o'z kompyuteringizga o'rnatasiz. To'rt qadam, o'n besh-yigirma daqiqa. Windows bo'lsa yettinchi ekrandagi yo'l, Mac bo'lsa sakkizinchi ekrandagi yo'l."
   ],
   [
    "b",
    "1–2-qadam: o'rnatish va PATH; <b>parolni yozib qo'ymasdan</b> oldinga o'tmang",
    "Birinchi: o'rnatish. Windows'da parolni albatta yozib qo'ying. Ikkinchi: PATH. Windows'da bin papkasini Path'ga qo'shing, Mac'da rasmiy buyruqni yurgizing, keyin terminalni yangidan oching."
   ],
   [
    "c",
    "3–4-qadam: <code>psql -U postgres</code>, <code>SELECT version();</code>; isbot — <b>natija qatorining boshi</b>",
    "Uchinchi: psql minus U postgres bilan ulaning. To'rtinchi: select version so'rovini yurgizing va teskari chiziqcha l bilan bazalarni ko'ring. Isbot maydoniga version natijasini nusxalang, PostgreSQL so'zidan boshlab."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: yechimlar oynasi ochiladi, sinf kompyuterlarida ham aynan shu holatlar chiqadi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin PostgreSQL kompyuteringizda o'rnatilgan va siz unga terminaldan ulana olasiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · jadval va bog'lanish",
  "title": "CREATE DATABASE blog → \\c blog → users jadvali",
  "seg": [
   [
    "a",
    "Ulandik — endi o'quvchi amaliyotidagi namuna: <code>users</code> va <code>posts</code>, <b>ikki bog'langan jadval</b>",
    "PostgreSQL terminali ishlayapti. Endi Mongo'dagi blogni PostgreSQL'da quramiz. Namuna tasodifiy emas: o'quvchi m4-03 amaliyotida qog'ozda aynan shu ikki jadvalni yozadi, users va posts. Siz ularni haqiqiy bazada yaratasiz."
   ],
   [
    "b",
    "Mongo'da baza o'zi paydo bo'lardi, bu yerda avval <b><code>CREATE DATABASE</code></b>, keyin <code>\\c</code>",
    "Mongo'da baza birinchi yozuvda o'zi paydo bo'lardi. PostgreSQL'da uni avval yaratasiz: create database blog. Keyin teskari chiziqcha c blog bilan unga o'tasiz. Prompt'ga qarang: endi postgres emas, blog."
   ],
   [
    "c",
    "<code>users</code>: <code>id</code> <b>o'zi o'sadi</b> va takrorlanmaydi, <code>username</code> <b>bo'sh bo'lmaydi</b> va takrorlanmaydi",
    "Birinchi jadval users. id ustuni serial primary key: raqam o'zi o'sadi va hech qachon takrorlanmaydi. username matn, yonida ikki qoida: not null, ya'ni bo'sh bo'lmaydi, va unique, ya'ni ikki foydalanuvchida bir xil nom bo'lmaydi."
   ],
   [
    "d",
    "Yozishda ikki xato tez-tez chiqadi: <b>jadval allaqachon bor</b> va <b>tushib qolgan vergul</b>",
    "Qo'lda yozganda ikki xato tez-tez chiqadi. Jadval allaqachon bor bo'lsa, already exists: demak siz uni oldin yaratgansiz. Vergul tushib qolsa, syntax error, va PostgreSQL terminali strelka bilan qaysi so'z oldida xato borligini ko'rsatadi. Vergulni qo'yib, buyruqni qayta yurgizasiz."
   ],
   [
    "e",
    "Xulosa: baza avval yaratiladi; <code>syntax error</code> bo'lsa — <b>strelka ko'rsatgan so'zdan oldin</b> qarang",
    "Xulosa: PostgreSQL'da baza oldin yaratiladi va unga teskari chiziqcha c bilan o'tiladi. Ustunning turi va qoidalari jadval bilan birga yoziladi. Syntax error chiqsa, strelka ko'rsatgan so'zdan oldingi joyni tekshiring, odatda u yerda vergul yo'q."
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "3-bosqich · jadval va bog'lanish",
  "title": "REFERENCES users(id) — Mongo'dagi ref, lekin bazaning o'zida",
  "seg": [
   [
    "a",
    "<code>users</code> jadvali tayyor. Endi ikkinchi jadval — <code>posts</code>: har post <code>user_id</code> orqali <b>muallifiga bog'lanadi</b>",
    "users jadvali tayyor. Endi ikkinchi jadvalni yaratamiz: postlar saqlanadigan posts jadvali. Har postda muallifning id'si saqlanadi, xuddi Mongo'dagi author kabi. Farqi user id qatorining oxirida: references users id. Bu tashqi kalit: user id ustunida faqat users jadvalida bor id turishi mumkin."
   ],
   [
    "b",
    "<code>\\d posts</code> — jadval tuzilishi; pastda baza o'zi nom bergan <b>tashqi kalit qatori</b>",
    "Teskari chiziqcha dt jadvallar ro'yxatini, teskari chiziqcha d posts esa jadval tuzilishini ko'rsatadi: ustunlar, turlari, bo'sh bo'la oladimi. Eng pastda Foreign-key constraints qatori. Nomini baza o'zi berdi: jadval, ustun va fkey. Bu nomni keyin xato xabarida ko'rasiz."
   ],
   [
    "c",
    "Uch foydalanuvchi va uch post qo'shildi: <code>INSERT 0 3</code> — oxirgi raqam <b>qatorlar soni</b>",
    "Endi ma'lumot. Uch foydalanuvchi: ali, vali va sardor. Uch post: ikkitasi ali'niki, bittasi vali'niki. sardor'ning posti yo'q, bu to'rtinchi bosqichda kerak bo'ladi. Javobdagi insert, nol, uch: oxirgi raqam qo'shilgan qatorlar soni."
   ],
   [
    "d",
    "Boshqa bazada tursangiz jadval «yo'q» bo'ladi: prompt'ga qarang va <b><code>\\c blog</code></b> qiling",
    "Sinfda eng ko'p chiqadigan xatolardan biri. O'quvchi PostgreSQL terminalini qayta ochadi va darhol select qiladi: relation posts does not exist. Jadval bor, faqat u postgres bazasida turibdi. Prompt'ga qarang: postgres. Teskari chiziqcha c blog qilinsa, o'sha so'rov uchala postni ko'rsatadi."
   ],
   [
    "e",
    "Xulosa: tashqi kalit bog'lanishni <b>bazaga yozadi</b>; <code>does not exist</code> bo'lsa — avval prompt",
    "Xulosa: references bog'lanishni bazaning o'ziga yozadi, Mongo'dagi ref'dan farqi shu. Teskari chiziqcha d bilan istalgan jadval tuzilishini ko'rasiz. Relation does not exist chiqsa, jadvalni qayta yaratishga shoshilmang: avval prompt'dagi baza nomini tekshiring."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "3-bosqich · jadval va bog'lanish",
  "title": "Mongo xato bermagan joyda PostgreSQL ERROR beradi",
  "seg": [
   [
    "a",
    "Mongo'dagi ikki tajribani PostgreSQL'da takrorlaymiz — xabarni <b>uch savol bilan</b> o'qiymiz",
    "To'rtinchi ekranda Mongo yo'q muallifga postni xato bermay saqlagan edi. Endi o'sha tajribalarni PostgreSQL'da qilamiz. Har xato xabarini uch savol bilan o'qiymiz: qaysi jadval, qaysi qoida va qaysi qiymat. To'rtta xato bor, hammasini haqiqiy bazada oldik."
   ],
   [
    "b",
    "Bo'sh <code>username</code> va takrorlangan <code>ali</code>: <b><code>NOT NULL</code></b> va <b><code>UNIQUE</code></b> rad etdi",
    "Birinchi ikkitasi oddiy. Bo'sh username: users jadvali, not null qoidasi, yozuv saqlanmadi. Yana ali: unique qoidasi, detail qatorida aniq qiymat, ali allaqachon bor. Mongo'da bu qoidalar Mongoose sxemasida edi, bu yerda jadvalning o'zida."
   ],
   [
    "c",
    "Yo'q muallifga post: Mongo saqlagan edi, PostgreSQL <b>tashqi kalit bilan rad etdi</b>",
    "Endi asosiysi: to'qson to'qqizinchi foydalanuvchiga post. Mongo buni xato bermay saqlagan edi. PostgreSQL rad etdi. O'qiymiz: jadval posts, qoida posts user id fkey, ya'ni tashqi kalit, qiymat esa detail qatorida: user id to'qson to'qqiz users jadvalida yo'q."
   ],
   [
    "d",
    "Teskari tomoni ham qo'riqlanadi: <b>posti bor foydalanuvchini</b> o'chirib bo'lmaydi",
    "Tashqi kalit teskari tomondan ham ishlaydi. ali'ni o'chirib ko'rdik: rad etildi, chunki uning postlari bor. Detail qatori aytadi: id bir hali ham posts jadvalidan ishora qilinmoqda. Ya'ni bazada egasiz post qolmaydi."
   ],
   [
    "e",
    "Xulosa: xabarda jadval, qoida nomi va <b><code>DETAIL</code>dagi qiymat</b> — sababi shu uchtasida",
    "Xulosa: PostgreSQL'da qoida buzilsa, yozuv saqlanmaydi va xabar sababni o'zi aytadi. O'quvchi xato ko'rsatsa, uchta savol bilan birga o'qing: qaysi jadval, qoida nomi va detail qatoridagi qiymat. Javob deyarli doim detail qatorida."
   ]
  ]
 },
 "14": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "O'quvchi DELETE FROM users WHERE id = 1; yozdi va shu xabarni oldi. Nega?",
  "q": "Xatolarni o'qishni ko'rdingiz, endi o'zingiz o'qing. Ikkinchi tekshiruv. O'quvchi birinchi foydalanuvchini o'chirmoqchi bo'ldi va ekrandagi xabarni oldi. Uch savolni eslang: qaysi jadval, qaysi qoida, qaysi qiymat. Nega o'chmadi? Variantni tanlang.",
  "ok": "To'g'ri. Qoida posts user id fkey, tashqi kalit. Detail qatori aytadi: id bir hali ham posts jadvalidan ishora qilinmoqda, ya'ni bu foydalanuvchining postlari bor. Baza egasiz post qoldirmaydi. Demak, foydalanuvchini o'chirish kerak bo'lsa, avval uning postlari, keyin uning o'zi o'chiriladi.",
  "okShort": "<code>posts_user_id_fkey</code>: <code>Key (id)=(1)</code> hali <code>posts</code>da bor — avval postlar, keyin foydalanuvchi.",
  "hint": "Xabardagi qoida nomini va DETAIL qatorini o'qing: qaysi jadval hali bu foydalanuvchiga ishora qilyapti?",
  "correct": 0,
  "opts": [
   "Bu foydalanuvchining postlari bor — posts unga ishora qiladi",
   "users jadvali blog bazasida yo'q",
   "id = 1 bo'lgan foydalanuvchi topilmadi",
   "DELETE uchun boshqa foydalanuvchining paroli kerak"
  ],
  "wrong": {
   "1": "Jadval yo'q bo'lsa xabar relation \"users\" does not exist bo'lardi.",
   "2": "Topilmasa xato bo'lmaydi: DELETE 0. Bu yerda baza qoida nomini aytyapti.",
   "3": "Xabarda parol haqida hech narsa yo'q. Qoida nomini o'qing."
  }
 },
 "15": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "blog bazasi: users, posts va tashqi kalit",
  "seg": [
   [
    "a",
    "Endi siz: <code>blog</code> bazasini va ikki bog'langan jadvalni <b>o'zingiz yaratasiz</b>",
    "Endi o'zingiz qilasiz: blog bazasi, users va posts jadvallari, keyin ma'lumot. Besh qadam, o'n-o'n besh daqiqa. Buyruqlarni nusxalash mumkin, lekin har birini o'qib, nima qilishini aytib ko'ring."
   ],
   [
    "b",
    "1–4-qadam: baza, ikki jadval va ma'lumot; har buyruqdan keyin <b>javob satrini tekshiring</b>",
    "Birinchi: baza va teskari chiziqcha c. Ikkinchi va uchinchi: users, keyin posts. Tartib muhim: posts users'ga ishora qiladi, shuning uchun users birinchi. To'rtinchi: uch foydalanuvchi va uch post."
   ],
   [
    "c",
    "5-qadam: tashqi kalit xatosini <b>o'zingiz chiqaring</b>; isbot — <code>\\d posts</code>dagi kalit qatori",
    "Beshinchi: to'qson to'qqizinchi foydalanuvchiga post yozib, tashqi kalit xatosini o'zingiz chiqaring va detail qatorini o'qing. Isbot maydoniga teskari chiziqcha d posts natijasidagi Foreign-key qatorini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda ikki bog'langan jadval bor va baza noto'g'ri yozuvni o'zi rad etishini o'z ko'zingiz bilan ko'rasiz."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · JOIN",
  "title": "JOIN … ON users.id = posts.user_id — PostgreSQL'dagi populate",
  "seg": [
   [
    "a",
    "Ikki jadval bog'langan — endi «har post muallifi bilan» <b>bitta javobda</b> kerak",
    "Ikki jadval bor va ular bog'langan. Endi Mongo'dagi populate kabi natija kerak: har post yonida muallifning nomi. PostgreSQL'da buni bitta so'rov qiladi, JOIN."
   ],
   [
    "b",
    "<code>FROM posts</code> — asosiy jadval, <code>JOIN users</code> — qo'shiladigan, <b><code>ON</code></b> — qaysi ustun qaysiga teng",
    "So'rovni bo'lakma-bo'lak o'qiymiz. Select qaysi ustunlar kerakligini aytadi: muallif nomi va izoh. From posts, asosiy jadval. Join users, unga qo'shiladigan jadval. On satri esa eng muhimi: users jadvalidagi id posts'dagi user id'ga teng bo'lsin. Natija uch qator, har post o'z muallifi bilan."
   ],
   [
    "c",
    "<code>sardor</code> ko'rinmadi: posti yo'q; <b><code>LEFT JOIN</code></b> juftsiz foydalanuvchini ham chiqaradi",
    "Natijada sardor yo'q, chunki uning posti yo'q. JOIN faqat jufti topilgan qatorlarni chiqaradi. Hamma foydalanuvchi kerak bo'lsa, users'dan boshlaymiz va left join yozamiz. Endi to'rt qator, sardor'ning izohi bo'sh."
   ],
   [
    "d",
    "O'quvchi darsida JOIN — «ikki jadvalni id orqali bog'lash»; siz <b><code>ON</code> satrini</b> ko'rsatasiz",
    "O'quvchi darsida JOIN kodsiz ko'rsatiladi: ikki jadvalni id orqali bog'lash. Sinfda o'quvchi so'rasa, siz aynan shu on satrini ko'rsatasiz: qaysi jadvalning qaysi ustuni qaysisiga teng. Xatoning ko'pi ham shu satrda bo'ladi."
   ],
   [
    "e",
    "Xulosa: <code>JOIN</code> — juftlari borlar, <code>LEFT JOIN</code> — chapdagining hammasi; tekshiruv <b><code>ON</code> satrida</b>",
    "Xulosa: JOIN faqat jufti borlarni chiqaradi, left join esa chapdagi jadvalning hamma qatorini. On satrida tashqi kalit, user id, boshqa jadvalning id'siga tenglanadi. Bu satr xato yozilsa nima bo'lishini keyingi tekshiruvda ko'rasiz."
   ]
  ]
 },
 "17": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "So'rov xatosiz ishladi, lekin «Bugun Nest o'rgandim»ni vali yozgandek chiqdi",
  "q": "JOIN'ni ko'rdingiz, endi xato topamiz. Uchinchi tekshiruv. Bu so'rov xato bermadi, baza javob qaytardi. Lekin natija noto'g'ri: «Bugun Nest o'rgandim» ali'niki, bu yerda esa vali'niki bo'lib chiqqan. Qoidani eslang: on satri tashqi kalitni tenglaydi. Xato satrni bosing.",
  "ok": "To'g'ri. Uchinchi satrda users id posts'ning o'z id'siga tenglangan, tashqi kalitga emas. Baza xato bermaydi, chunki ikkalasi ham son: u shunchaki birinchi postni birinchi foydalanuvchiga, ikkinchisini ikkinchisiga ulaydi. Ekranda tuzatilgan holat: posts user id, va natija to'g'ri. Demak, on satrida doim tashqi kalit ustuni turadi, ya'ni posts user id.",
  "okShort": "3-satr: <code>posts.id</code> — postning raqami, muallif emas. Xato chiqmaydi, lekin natija noto'g'ri. Tuzatildi: <code>posts.user_id</code>.",
  "hint": "1- va 2-satr nimani va qayerdan olishni aytadi. Ikki jadval qaysi ustunlar bo'yicha ulanayotganini qidiring.",
  "task": "Qoida: <code>ON</code> satri <code>posts</code>dagi tashqi kalitni — <code>user_id</code>ni — <code>users.id</code>ga tenglaydi. Bu so'rov xato bermadi, lekin natija noto'g'ri: ikkinchi postni ali yozgan, natijada esa vali. <b>Xato satrni bosing.</b>"
 },
 "18": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "JOIN, xato ON va LEFT JOIN — o'z bazangizda",
  "seg": [
   [
    "a",
    "Endi siz: o'z <code>blog</code> bazangizda uch so'rovni yurgizasiz va <b>natijalarni solishtirasiz</b>",
    "Endi o'z blog bazangizda uchta so'rov yurgizasiz. O'n daqiqa. Har birining natijasini oldingisi bilan solishtiring: qaysi qatorlar bor, qaysi biri yo'q va nega."
   ],
   [
    "b",
    "1–2-qadam: to'g'ri <code>JOIN</code>, keyin <code>ON</code>ni <b>ataylab buzing</b> va natijani solishtiring",
    "Birinchi: to'g'ri JOIN, uch qator. Ikkinchi: on satrida user id o'rniga id yozing. Xato chiqmaydi, lekin mualliflar almashadi. Buni o'z ko'zingiz bilan ko'ring, sinfda o'quvchiga aynan shuni ko'rsatasiz."
   ],
   [
    "c",
    "3–4-qadam: <code>LEFT JOIN</code> va sardor; isbot — natija ostidagi <b>qatorlar soni</b>",
    "Uchinchi: left join, users'dan boshlab. sardor bo'sh izoh bilan chiqishi kerak. To'rtinchi: natija ostida qavs ichida qatorlar soni yozilgan. Isbot maydoniga left join natijasidagi qatorlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, JOIN natijasining to'g'riligini on satri hal qiladi: xato on xato bermaydi, lekin mualliflarni almashtirib yuboradi."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ishonchlilik",
  "title": "Bitta telefon, ikki xaridor: ikkinchisi kutadi va UPDATE 0 oladi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi eng esda qoladigan misol: <b>bitta telefon, ikki xaridor</b> bir lahzada",
    "Endi o'quvchi darsidagi eng esda qoladigan misol. Do'konda bitta telefon qoldi, ikki kishi bir lahzada sotib olish tugmasini bosdi. O'quvchi darsi aytadi: SQL uni faqat bittasiga sotadi. Biz buni ikkita PostgreSQL terminali oynasida haqiqatan sinab ko'rdik."
   ],
   [
    "b",
    "<code>products</code> jadvali: <code>stock</code> — qoldiq, <b><code>CHECK (stock &gt;= 0)</code></b> — manfiy bo'lishi taqiq",
    "Avval jadval: products. Nomi va stock, ya'ni omborda nechta qolgani. stock yonida check qoidasi: qoldiq noldan kichik bo'lmasin. Telefondan bitta."
   ],
   [
    "c",
    "1-xaridor telefonni oldi, tranzaksiya hali ochiq; 2-xaridorning so'rovi <b>kutib turibdi</b>",
    "Birinchi xaridor: begin, keyin update: stock'ni bittaga kamaytir, faqat stock noldan katta bo'lsa. Javob: qoldiq nol, update bir. Tranzaksiya hali yopilmagan. Bir soniyadan keyin ikkinchi xaridor xuddi shu update'ni yuboradi. U javob olmaydi, kutib turadi: birinchi xaridor bu qatorni band qilgan."
   ],
   [
    "d",
    "1-xaridor <code>COMMIT</code> qildi — 2-xaridor darhol <b><code>UPDATE 0</code></b>: telefon tugagan",
    "Uchinchi soniyada birinchi xaridor commit qiladi. Shu zahoti ikkinchi xaridorning so'rovi davom etadi, shartni qayta tekshiradi: stock endi nol, noldan katta emas. Javob: nol qator, update nol. Ilova shu nolni ko'rib «Kechirasiz, mahsulot tugagan» deydi. Oxirida stock nol, telefon bitta sotildi."
   ],
   [
    "e",
    "Xulosa: telefonni so'rovdagi <b>shart va qator qulfi</b> saqladi; <code>CHECK</code> — ikkinchi himoya",
    "Xulosa: telefonni ikki narsa saqladi. Birinchisi so'rovdagi shart, stock noldan katta. Ikkinchisi qator qulfi: ikkinchi xaridor birinchisini kutdi. Shart yozilmasa, check qoidasi to'xtatadi: sinab ko'rdik, qoldiq minus bir bo'ladigan update rad etildi."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · ishonchlilik",
  "title": "Tranzaksiya: buyurtma va ombor birga yoziladi — yoki birortasi ham yozilmaydi",
  "seg": [
   [
    "a",
    "Haqiqiy do'konda sotish <b>ikki ish</b>: buyurtma yoziladi va ombor kamayadi",
    "Oxirgi telefonni bitta update himoya qildi. Lekin haqiqiy do'konda sotish ikki ish: orders jadvaliga buyurtma yoziladi va products'da qoldiq kamayadi. Biri bajarilib, ikkinchisi bajarilmasa, bazada yolg'on paydo bo'ladi: buyurtma bor, telefon esa omborda turibdi."
   ],
   [
    "b",
    "<code>BEGIN</code> ichida buyurtma yozildi, ombor esa <b><code>CHECK</code> bilan rad etildi</b> — telefon allaqachon tugagan",
    "Telefon allaqachon sotilgan, stock nol. vali uchun ikkala ishni bitta tranzaksiyada qilamiz. Begin, buyurtma yozildi, insert bir. Keyin ombor: check qoidasi rad etdi, qoldiq minus bir bo'lardi."
   ],
   [
    "c",
    "<code>COMMIT</code> yozildi, lekin baza <b><code>ROLLBACK</code></b> qildi: <code>orders</code> bo'sh, yarim ish saqlanmadi",
    "Endi commit yozamiz. Lekin javobga qarang: commit emas, rollback. Tranzaksiya ichida xato bo'lgani uchun baza hammasini bekor qildi. orders jadvali bo'sh: vali'ning buyurtmasi ham saqlanmadi. Bu hammasi yoki hech narsa degani."
   ],
   [
    "d",
    "Halol solishtirish: oxirgi telefonni <b>Mongo ham bittaga sotdi</b>, farq — bir nechta jadvalda",
    "Endi halol solishtirish. Oxirgi telefonni MongoDB'da ham sinadik: shartli update bilan u ham bittaga sotdi, chunki bitta hujjatni o'zgartirish Mongo'da ham bo'linmaydi. Farq bir nechta hujjatda: oddiy o'rnatilgan MongoDB serverida tranzaksiya ishlamadi. PostgreSQL'da esa bir nechta jadval oddiy o'rnatishda ham bitta tranzaksiyada."
   ],
   [
    "e",
    "Xulosa: bir nechta jadval birga o'zgarsa — <code>BEGIN … COMMIT</code>; xato bo'lsa <b>hammasi bekor</b>",
    "Xulosa: bir nechta jadval birga o'zgarishi kerak bo'lsa, ularni begin va commit orasiga olasiz. Ichida bitta xato bo'lsa, baza hammasini bekor qiladi. O'quvchi darsi oxirgi telefonni tranzaksiya deb atagan, bu soddalashtirish: buni yigirma yettinchi ekranda ko'ramiz."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · ishonchlilik",
  "title": "jsonb ustuni: har qatorda har xil maydon — jadval ichida",
  "seg": [
   [
    "a",
    "Mongo'da har hujjat har xil edi — PostgreSQL'da ham <b>shunday ustun bor</b>",
    "O'quvchi darsida PostgreSQL'ning yana bir afzalligi aytiladi: JSON ham saqlaydi. To'rtinchi ekranda Mongo'da har hujjat har xil bo'lishini ko'rgan edik. PostgreSQL'da ham shunday joy bor: jsonb turidagi ustun."
   ],
   [
    "b",
    "<code>ALTER TABLE</code> bilan <b><code>extra JSONB</code></b> ustuni qo'shildi — eski qatorlar bo'sh qoladi",
    "products jadvaliga alter table bilan extra degan ustun qo'shamiz, turi jsonb. Jadval o'zgardi, telefon qatorida bu ustun bo'sh."
   ],
   [
    "c",
    "Futbolkada rang va o'lcham, quloqchinda rang va bluetooth — <b>bitta jadvalda</b>",
    "Ikki mahsulot qo'shamiz. Futbolkada rang va o'lcham, quloqchinda rang va bluetooth. Maydonlar har xil, lekin ikkalasi bitta jadvalda. Nom va qoldiq esa oddiy ustunlarda, ularning qoidalari joyida qoladi."
   ],
   [
    "d",
    "<b>JSON ichidagi maydon bo'yicha</b> qidirish mumkin: rangi qora mahsulot — futbolka",
    "JSON ichidagi maydon bo'yicha qidirish ham mumkin. Strelka va ikki burchak qavs bilan rang maydonining matnini olamiz va qora rangni qidiramiz. Javob: futbolka."
   ],
   [
    "e",
    "Xulosa: asosiy maydon — ustun va qoida bilan, <b>erkin qo'shimcha</b> — <code>jsonb</code>da",
    "Xulosa: muhim va hamma qatorda bor maydon oddiy ustunda turadi, qoidasi bilan. Har mahsulotda har xil bo'ladigan qo'shimcha esa jsonb'da. O'quvchi «PostgreSQL JSON ham saqlaydi» degan gapni so'rasa, aynan shu misolni ko'rsating."
   ]
  ]
 },
 "22": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "BEGIN → buyurtma yozildi → ombor CHECK xatosi → COMMIT. orders jadvalida nima bor?",
  "q": "Tranzaksiyani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Tranzaksiya ichida buyurtma yozildi, insert bir, keyin ombor check qoidasi bilan rad etildi va commit yozildi. orders jadvalida nima qoldi? Variantni tanlang.",
  "ok": "To'g'ri, hech narsa. Tranzaksiya ichida xato bo'lgani uchun commit'ga baza rollback deb javob berdi va hammasini bekor qildi. insert bir chiqqan edi, lekin u hali tasdiqlanmagan edi. orders bo'sh, nol qator. Demak, tranzaksiya ichida bitta xato bo'lsa, undagi hamma o'zgarish bekor bo'ladi.",
  "okShort": "<code>COMMIT</code> → <code>ROLLBACK</code>: xatoli tranzaksiya to'liq bekor. <code>orders</code> — <code>(0 rows)</code>.",
  "hint": "Xatoli tranzaksiyada COMMIT nima deb javob berishini eslang — 20-ekranning 3-qadami.",
  "correct": 1,
  "opts": [
   "vali'ning buyurtmasi, chunki INSERT 0 1 chiqqan edi",
   "Hech narsa: baza hammasini bekor qildi, ROLLBACK",
   "Buyurtma va stock = -1",
   "Buyurtma bor, lekin COMMIT xato beradi"
  ],
  "wrong": {
   "0": "INSERT 0 1 tranzaksiya ichida edi va tasdiqlanmagan. COMMITning javobiga qarang.",
   "2": "CHECK qoidasi -1 ni rad etdi — bunday qator yozilmaydi.",
   "3": "COMMIT xato bermaydi, javobi boshqa so'z. U nima deydi?"
  }
 },
 "23": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "Oxirgi telefonni ikki terminal oynasida o'zingiz soting",
  "seg": [
   [
    "a",
    "Endi siz: <b>ikki terminal oynasini</b> yonma-yon ochib, oxirgi telefonni o'zingiz sotasiz",
    "Oxirgi amaliyot, eng qiziqarlisi. Ikkita terminal oynasini yonma-yon oching, ikkalasida PostgreSQL terminalini ochib, teskari chiziqcha c blog yozing. Biri birinchi xaridor, ikkinchisi ikkinchi xaridor. O'n-o'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <code>products</code> va bitta telefon; 1-oynada <code>BEGIN</code> va <code>UPDATE</code>, <b><code>COMMIT</code>siz</b>",
    "Birinchi: products jadvali va bitta telefon. Ikkinchi: birinchi oynada begin, keyin update. Qoldiq nol bo'ladi. Muhim: commit'ni hali yozmang, tranzaksiya ochiq tursin."
   ],
   [
    "c",
    "3–4-qadam: 2-oyna kutadi, 1-oynada <code>COMMIT</code>; isbot — <b>2-oynadagi oxirgi satr</b>",
    "Uchinchi: ikkinchi oynada xuddi shu update'ni yuboring. U javob bermaydi, kutib turadi. To'rtinchi: birinchi oynada commit yozing va ikkinchi oynaga qarang. Isbot maydoniga ikkinchi oynada chiqqan oxirgi satrni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi qadam ixtiyoriy, jsonb. To'rtta majburiy katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, oxirgi telefonni shart va tranzaksiya saqlab qoladi: ikkinchi xaridor kutadi va hech narsa olmaydi."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "Sinf kompyuterlari: har birida psql -U postgres ochilsin",
  "seg": [
   [
    "a",
    "O'zingizda ishladi — endi sinf: o'quvchi kompyuterlariga PostgreSQL'ni <b>siz o'rnatasiz</b>",
    "Mavzuni o'zingiz qo'l bilan o'tdingiz. Endi sinf. O'quvchi darslarida PostgreSQL'ni o'rnatish hech qayerda o'rgatilmaydi: m4-08 darsi psql minus U postgres buyrug'ini va o'rnatishda berilgan parolni tayyor deb kutadi. Shuning uchun sinf kompyuterlariga uni siz o'rnatasiz."
   ],
   [
    "b",
    "m4-03 kodsiz — PostgreSQL m4-06 dan kerak; o'rnatishni <b>m4-03 dan keyin, m4-06 dan oldin</b> qiling",
    "Vaqti: m4-03 kodsiz dars, unda baza kerak emas. m4-06 da o'quvchi so'rov yozishni boshlaydi. Demak, o'rnatishni m4-03 va m4-06 orasida qiling. Har kompyuterga yettinchi va sakkizinchi ekrandagi yo'l bilan, PATH'ni unutmang."
   ],
   [
    "c",
    "Hamma kompyuterda <b>bitta parol</b>: o'quvchi uni loyiha sozlamasiga yozadi",
    "Parol hamma kompyuterda bir xil bo'lsin va o'quvchilarga aytiladi, chunki keyingi darslarda u loyihaning env faylida kerak. Bir fakt: kursdagi Nest loyihasining env example faylida parol password deb yozilgan. Sinf paroli shu bo'lsa, o'quvchi faylni o'zgartirmaydi."
   ],
   [
    "d",
    "Har kompyuterda <b>bitta buyruq bilan</b> tekshiring — kompyuterni qayta yoqqandan keyin ham",
    "Tekshiruv har kompyuterda bitta buyruq: psql minus U postgres, minus c va select version. PostgreSQL versiyasi chiqsa, kompyuter tayyor. Kompyuterni qayta yoqib, yana bir marta tekshiring: server o'zi ishga tushishi kerak."
   ],
   [
    "e",
    "Xulosa: m4-06 dan oldin <b>har kompyuterda</b> — o'rnatish, PATH, bitta parol, tekshiruv buyrug'i",
    "Xulosa: m4-06 dan oldin har sinf kompyuterida to'rt narsa. PostgreSQL o'rnatilgan, psql buyrug'i PATH'da, parol hammada bir xil va tekshiruv buyrug'i qayta yoqilgandan keyin ham versiyani ko'rsatadi. Xato chiqsa, birinchi amaliyotdagi jadval sizga yordam beradi."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4-03 · «SQL vs NoSQL — nega PostgreSQL»",
  "title": "m4-03: kodsiz dars — siz bugun hammasini qo'l bilan qildingiz",
  "seg": [
   [
    "a",
    "m4-03 kodsiz: o'quvchi jadval va hujjatni ko'radi, lekin <b><code>psql</code> ochmaydi</b>",
    "Endi o'quvchi darsi, m4-03, yigirma bir ekran. U kodsiz: o'quvchi jadval va hujjatni ko'radi, solishtiradi, tanlaydi, lekin PostgreSQL terminalini ochmaydi. Siz bugun hammasini qo'l bilan qildingiz, shuning uchun har blokda bitta qo'shimcha gapingiz bor."
   ],
   [
    "b",
    "Kirish va shakl: <b>«ikkalasi ham to'g'ri»</b>, keyin jadval va hujjat farqi",
    "Dars savol bilan boshlanadi: SQL ko'rinishimi yoki NoSQL? To'g'ri javob: ikkalasi ham, vazifaga bog'liq. Keyin ikki tur va shakl: o'quvchi kartalarni jadval ustunlariga joylaydi. Siz qo'shasiz: jadvalda ustun turi oldindan yoziladi, hujjatda esa maydon erkin."
   ],
   [
    "c",
    "Kuchlar bloki — siz bugun ko'rgan <b>JOIN va oxirgi telefon</b>; chat esa NoSQL kuchi",
    "Uchinchi blok sizga eng tanish: JOIN, oxirgi telefon va chat oqimi. O'quvchi JOIN'ni id orqali bog'lash deb ko'radi, siz on satrini aytasiz. Chat misolida NoSQL kuchi: juda ko'p oddiy xabar, bog'lanish kam. Buni inkor qilmang, bu to'g'ri."
   ],
   [
    "d",
    "Qaror ko'rsatkichi <b>to'rtta savoldan iborat</b>; amaliyotda o'quvchi o'z loyihasi uchun bazani tanlaydi",
    "To'rtinchi va beshinchi blokda o'quvchi qaror qabul qilishni o'rganadi. Qaror ko'rsatkichi to'rtta savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi va ulkan, oddiy, tez saqlash kerakmi. Keyin nega PostgreSQL tanlanganini va AI tavsiyasini loyihaga moslashtirishni ko'radi. Amaliyotda o'quvchi o'z loyihasi uchun bazani tanlaydi va ikki jadvalni qog'ozda yozadi: namunasi siz bugun yaratgan users va posts."
   ],
   [
    "e",
    "Xulosa: o'quvchi tanlashni o'rganadi, siz har gapni <b>bazada ko'rsata olasiz</b>",
    "Xulosa: m4-03 da o'quvchi tanlashni o'rganadi, kod yozmaydi. Vaqt, taklif: to'qson daqiqa. Kirish va shakl yigirma, kuchlar yigirma besh, qaror va nega PostgreSQL yigirma, mustahkamlash va amaliyot yigirma, yakun besh. Kuchli o'quvchi so'rasa, bugungi PostgreSQL terminalingizni ochib ko'rsating."
   ]
  ]
 },
 "26": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi — siz ularni atama bilan bog'laysiz",
  "seg": [
   [
    "a",
    "O'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi, siz esa <b>ikkalasini birga aytasiz</b>",
    "Endi o'quvchi darsida qanday so'zlar ishlatilishini ko'ramiz. AI Startup kursidagi o'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi: jadval o'rniga Excel jadvali, hujjat o'rniga papkadagi qog'ozlar. Siz ikkalasini bilasiz va sinfda birga aytasiz: avval o'quvchi darsidagi so'z, keyin haqiqiy atama."
   ],
   [
    "b",
    "Jadval — <b>Excel jadvali</b>, hujjat — <b>papkadagi turli qog'ozlar</b>",
    "Jadval Excel jadvaliga o'xshaydi: har qatorda bir xil ustunlar. Hujjat esa papkadagi turli qog'ozlar kabi: har birida o'z maydonlari, jingalak qavs ichida. MongoDB va Firebase o'quvchi darsida hujjatli baza misoli."
   ],
   [
    "c",
    "O'quvchi darsida JOIN — «id orqali bog'lash», oxirgi telefon esa <b>«SQL nazorati»</b> deb ataladi",
    "O'quvchi darsida JOIN ikki jadvalni id orqali bog'lash deb tushuntiriladi. Oxirgi telefon misoli esa SQL nazorati deb ataladi, uning atamasi tranzaksiya. Darsdagi qaror ko'rsatkichi to'rtta savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi va ulkan, oddiy, tez saqlash kerakmi. O'quvchi shu to'rt savolni yodda tutishi kerak."
   ],
   [
    "d",
    "Xulosa: <b>avval o'quvchining so'zi, keyin atama</b> — «Excel jadvaliga o'xshaydi, ya'ni table»",
    "Xulosa: sinfda so'zlarni juft qilib ayting, masalan: Excel jadvaliga o'xshaydi, buning atamasi table, har qator bitta yozuv. O'xshatish vazifani tushuntiradi. Farqini esa siz ko'rsatasiz: Excel qoidani tekshirmaydi, PostgreSQL esa bo'sh nomni ham, yo'q muallifni ham rad etadi."
   ]
  ]
 },
 "27": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Ikki soddalashtirish va o'quvchining besh savoli — tayyor javoblar",
  "seg": [
   [
    "a",
    "Darsning ikki joyi <b>soddalashtirilgan</b> — sinovda ko'rganingiz bilan solishtiramiz",
    "Oxirgi tayyorgarlik. O'quvchi darsida ikki joy soddalashtirilgan. Bu xato emas, o'smir uchun shunday aytilgan. Lekin siz haqiqatni bilishingiz kerak, chunki kuchli o'quvchi albatta so'raydi."
   ],
   [
    "b",
    "Oxirgi telefon: darsda «tranzaksiya», aslida <b>shart va qulf</b> — Mongo ham bittaga sotdi",
    "Birinchisi oxirgi telefon. Darsda uni SQL nazorati, tranzaksiya saqlaydi deyiladi. Sinovda ko'rdingiz: telefonni so'rovdagi shart va qator qulfi saqladi, Mongo ham bittaga sotdi. Darsdagi gap yetarli. So'rashsa ayting: baza shartni qayta tekshiradi, ikkinchi xaridor kutadi."
   ],
   [
    "c",
    "NoSQL'da bog'lash bor, lekin uni baza emas, <b>kod qo'riqlaydi</b>",
    "Ikkinchisi: darsda NoSQL'da hujjatlarni bog'lash qiyin deyiladi. Aslida bog'lash bor, populate'ni o'zingiz bilasiz. Farqi boshqa joyda: Mongo yo'q muallifni xato bermay saqladi. Sinfda shunday ayting: bog'lash mumkin, lekin to'g'riligini kod saqlaydi, baza emas."
   ],
   [
    "d",
    "O'quvchining <b>besh savoli</b>: Mongo, MySQL, Excel, Firebase va qisqa <code>id</code>",
    "Pastda o'quvchining besh savoliga tayyor javoblar bor: Mongo yomonmi, MySQL'dan farqi, Excel'ning o'zi emasmi, Firebase nima va nega id qisqa. Kartani bosib o'qing. Eng ko'p beriladigani Excel haqidagi savol."
   ],
   [
    "e",
    "Xulosa: <b>Mongo'ni yomonlamang</b> — tanlov to'rt savol bilan, farqni bazada ko'rsating",
    "Xulosa: sinfda Mongo'ni yomonlamang, o'zingiz ko'rdingiz, u ko'p narsani qila oladi. Tanlovni doim qaror ko'rsatkichining to'rt savoli bilan asoslang. Farqni so'z bilan emas, PostgreSQL terminalida ko'rsating: yo'q muallifga post yozing va xabarni birga o'qing."
   ]
  ]
 },
 "28": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Mongo'dagi populate() PostgreSQL'da nima bilan qilinadi?",
    "o": [
     "REFERENCES",
     "JOIN … ON …",
     "CREATE TABLE",
     "SERIAL"
    ],
    "c": 1,
    "e": "JOIN so'rov paytida ikki jadvalni ulaydi; REFERENCES — refning jufti.",
    "s": 5
   },
   {
    "q": "Mac'da psql -U postgres → role \"postgres\" does not exist. Nima qilasiz?",
    "o": [
     "createuser -s postgres",
     "Parolni qayta kiritaman",
     "Postgres.app'ni qayta Initialize qilaman",
     "CREATE DATABASE postgres;"
    ],
    "c": 0,
    "e": "Homebrew bilan o'rnatilgan: superuser — Mac foydalanuvchisi, postgres roli yo'q.",
    "s": 8
   },
   {
    "q": "usersda 99-foydalanuvchi yo'q. INSERT INTO posts (user_id, izoh) VALUES (99, '…'); nima qaytaradi?",
    "o": [
     "INSERT 0 1, muallif bo'sh",
     "usersga 99 qo'shiladi",
     "Tashqi kalit xatosi, post saqlanmaydi",
     "NOT NULL xatosi"
    ],
    "c": 2,
    "e": "posts_user_id_fkey: Key (user_id)=(99) is not present in table \"users\".",
    "s": 13
   },
   {
    "q": "Prompt postgres=#. SELECT * FROM posts; → relation \"posts\" does not exist, lekin jadvalni yaratgansiz. Nima qilasiz?",
    "o": [
     "Jadvalni qayta yarataman",
     "Serverni qayta ishga tushiraman",
     "Parolni tekshiraman",
     "\\c blog"
    ],
    "c": 3,
    "e": "Jadval blog bazasida; prompt boshqa bazani ko'rsatyapti.",
    "s": 12
   },
   {
    "q": "Postsiz foydalanuvchi ham natijada chiqishi kerak. Qaysi so'rov?",
    "o": [
     "FROM users LEFT JOIN posts ON …",
     "FROM posts JOIN users ON …",
     "JOINsiz SELECT * FROM users, posts",
     "ON satrini olib tashlash"
    ],
    "c": 0,
    "e": "LEFT JOIN chapdagi jadvalning hamma qatorini chiqaradi; sardor — bo'sh izoh bilan.",
    "s": 16
   },
   {
    "q": "1-xaridor BEGIN + UPDATE … WHERE stock > 0 qildi, COMMIT hali yo'q. 2-xaridor xuddi shu UPDATEni yubordi. Nima bo'ladi?",
    "o": [
     "Darhol UPDATE 1, telefon ikkalasiga",
     "Kutadi, 1-xaridor COMMITdan keyin UPDATE 0",
     "Darhol CHECK xatosi",
     "stock = -1 bo'ladi"
    ],
    "c": 1,
    "e": "Qator band — 2-xaridor kutadi, keyin shartni qayta tekshiradi: stock 0.",
    "s": 19
   },
   {
    "q": "Tranzaksiya ichida xato chiqdi, keyin COMMIT; yozildi. psql nima deb javob beradi?",
    "o": [
     "COMMIT",
     "ERROR",
     "Hech narsa",
     "ROLLBACK"
    ],
    "c": 3,
    "e": "Xatoli tranzaksiya bekor qilinadi: COMMIT; → ROLLBACK, orders bo'sh.",
    "s": 20
   },
   {
    "q": "O'quvchi: «NoSQL zamonaviyroq, onlayn do'konimga MongoDB olaman». Nima deysiz?",
    "o": [
     "To'g'ri, NoSQL yangiroq",
     "MongoDB sekin, olmang",
     "4 savol: buyurtma, mahsulot, to'lov bog'langan, xato qimmat — PostgreSQL",
     "Farqi yo'q, istaganini oling"
    ],
    "c": 2,
    "e": "Tanlov modaga emas, vazifaga qarab; do'konda 3 mezon SQL tomonda.",
    "s": 27
   }
  ]
 },
 "29": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  MENTOR KURSI · PostgreSQL-1 «Siz bilgan Mongo'dan PostgreSQL jadvallariga»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/06-PostgreSQL1-mentor-v1.md (MD v1, GATE M kutilmoqda)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/pg1-out/ (00–24)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg1/parts/*.jsx > PgIntroMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-pg-01-mongo-dan-postgresql-v1';
const LESSON_TITLE = "Siz bilgan Mongo'dan PostgreSQL jadvallariga";
const PG = { mongo: '#13AA52', pg: '#336791', term: '#111827', termEr: '#1F1115', win: '#0067C0' };
MKCFG.root = 'mongo-blog';
MKCFG.kind = (f) => /\.js$/.test(f) ? T.yellow : /\.sql$/.test(f) ? PG.pg : /\.json$/.test(f) ? T.ink2 : null;
MKCFG.files = ['node_modules/', 'blog.js', 'package.json'];

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['psql minus U postgres, minus c va select version', 'psql -U postgres -c "SELECT version();"'],
  ['psql minus U postgres', 'psql -U postgres'], ['createuser minus s postgres', 'createuser -s postgres'],
  ['teskari chiziqcha c blog', '\\c blog'], ['teskari chiziqcha d posts', '\\d posts'], ['teskari chiziqcha dt', '\\dt'],
  ['teskari chiziqcha l', '\\l'], ['teskari chiziqcha q', '\\q'], ['teskari chiziqcha c', '\\c'], ['teskari chiziqcha d', '\\d'],
  ['create database blog', 'CREATE DATABASE blog'], ['serial primary key', 'SERIAL PRIMARY KEY'], ['references users id', 'REFERENCES users(id)'],
  ['posts user id fkey', 'posts_user_id_fkey'], ['user id', 'user_id'], ['users id', 'users.id'],
  ['insert, nol, uch', 'INSERT 0 3'], ['update nol', 'UPDATE 0'], ['update bir', 'UPDATE 1'], ['insert bir', 'INSERT 0 1'],
  ['select version', 'SELECT version();'], ['alter table', 'ALTER TABLE'], ['left join', 'LEFT JOIN'],
  ['postgresql org', 'postgresql.org'], ['postgresapp com', 'postgresapp.com'], ['env example', '.env.example'],
];
DIGITS.unshift(["besh ming to'rt yuz o'ttiz ikki", '5432'], ["to'qson to'qqizinchi", '99-'], ['yigirma oltinchi', '26-'], ['yigirma bir', '21'],
  ['yigirma besh', '25'], ["o'n sakkiz", '18'], ["o'n besh-yigirma", '15–20'], ['bir, ikki, uch', '1, 2, 3'], ['id bir', 'id 1']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /violates foreign key constraint/g, /is not present in table/g, /is still referenced from table/g, /violates check constraint/g,
  /violates not-null constraint/g, /duplicate key value/g, /already exists/g, /syntax error/g, /Connection refused/g,
  /Foreign-key constraints/g, /Command Line Tools/g, /Stack Builder/g, /SQL Shell/g, /Environment Variables/g,
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
function MiniTable({ name, cols, rows, hlRow = [], hlCol = [], color = PG.pg, dimRow = [], hlHead = false }) {
  return <div className="pg-mt" style={{ '--c': color }}>
    <div className="nm">{name}</div>
    <table><thead><tr>{cols.map((c, i) => <th key={c} className={hlHead || hlCol.includes(i) ? 'hl' : ''}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className={`${hlRow.includes(i) ? 'hl' : ''}${dimRow.includes(i) ? ' dim' : ''}`}>{r.map((c, j) => <td key={j} className={hlCol.includes(j) ? 'hlc' : ''}>{c}</td>)}</tr>)}</tbody></table>
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-pg1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-pg1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Mongo bilan solishtirish', "O'rnatish va ulanish", "Jadval va bog'lanish", 'JOIN', 'Ishonchlilik: oxirgi telefon', "O'quvchi darsini o'tish"];
const JOIN_OK = psql(String.raw`
blog=# SELECT users.username, posts.izoh
blog-# FROM posts
blog-# JOIN users ON users.id = posts.user_id;
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 ali      | Bugun Nest o'rgandim
 vali     | Salom hammaga
(3 rows)`);
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1, 2, 3] }, { hl: [4] }, { hl: [5] }, { hl: [] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — sizning kompyuteringizda</div>
    <Psql lines={JOIN_OK} />
  </div>} />;
}

// ============================================================
//  2 · SQL va NoSQL: bitta ma'lumot — ikki shakl (F-1102-21)
//  Haqiqiy: manba/pg1-out/25-sqlnosql-mongo.txt (mongosh) · 26-sqlnosql-pg.txt (PostgreSQL 18)
// ============================================================
const SQL_ERR = psql(String.raw`
blog=# INSERT INTO users (username, shahar) VALUES ('sardor', 'Toshkent');
ERROR:  column "shahar" of relation "users" does not exist`);
const SQL_SEL = psql(String.raw`
blog=# SELECT username FROM users WHERE id = 2;
 username
----------
 vali
(1 row)`, { 1: { id: 'q' }, 4: { id: 'a' } });
const S2SQL = mkS(2, [{}, { mongo: true }, { mongo: true, pg: true }, { mongo: true, pg: true, sql: true }, { mongo: true, pg: true, sql: true, rule: true }]);
function ScreenSqlNosql(p) {
  return <Lesson p={p} S={S2SQL} scene={({ seg, beat }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className="mk-card" style={{ borderColor: PG.mongo }}>
        <h5 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><i style={{ width: 10, height: 10, borderRadius: '50%', background: PG.mongo, display: 'inline-block' }} />MongoDB · NoSQL</h5>
        {seg.mongo ? <div style={{ display: 'grid', gap: 8, animation: 'mk-up .4s ease both' }}>
          <div className="pg-lab">users — collection · 2 ta hujjat (document)</div>
          <Doc>{`{ _id: ObjectId('6ae8…e666'),\n  username: 'ali' }`}</Doc>
          <Doc odd>{`{ _id: ObjectId('6ae8…e667'),\n  username: 'vali',\n  shahar: 'Toshkent' }   ← qo'shimcha maydon`}</Doc>
          <div style={{ fontSize: 13.5, color: T.ink2 }}>Har yozuv — <b>hujjat</b>: jingalak qavs ichida <b>maydon: qiymat</b>. Shakli har xil bo'lishi mumkin.</div>
        </div> : <div className="pg-lab" style={{ margin: 0 }}>ma'lumot — hujjat ko'rinishida</div>}
      </div>
      <div className="mk-card" style={{ borderColor: PG.pg }}>
        <h5 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><i style={{ width: 10, height: 10, borderRadius: '50%', background: PG.pg, display: 'inline-block' }} />PostgreSQL · SQL</h5>
        {seg.pg ? <div style={{ display: 'grid', gap: 8, animation: 'mk-up .4s ease both' }}>
          <MiniTable name="users — jadval (table)" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali']]} hlHead={beat === 2} hlRow={beat === 2 ? [0] : []} />
          <div style={{ fontSize: 13.5, color: T.ink2 }}>Tepada — <b>ustunlar (column)</b>: id, username. Har yozuv — bitta <b>qator (row)</b>: 1 | ali.</div>
          <Psql er title="psql — blog · shahar ustuni yo'q" lines={SQL_ERR} />
        </div> : <div className="pg-lab" style={{ margin: 0 }}>ma'lumot — jadval ko'rinishida</div>}
      </div>
    </div>
    {seg.sql && <div style={{ animation: 'mk-up .4s ease both' }}>
      <div className="pg-lab">SQL — jadvalga so'rov yozish tili</div>
      <Psql lines={SQL_SEL} focus={beat === 3 ? ['q', 'a'] : []} />
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">Moslik: <b>collection</b> ↔ <b>jadval</b> · <b>hujjat (document)</b> ↔ <b>qator (row)</b> · <b>maydon (field)</b> ↔ <b>ustun (column)</b></div></Block>
  </div>} />;
}

// ============================================================
//  3 · Siz bilgan Mongoose
// ============================================================
const BLOG_JS = js(String.raw`
const User = mongoose.model('User', new mongoose.Schema({ username: String }));
const Post = mongoose.model('Post', new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  izoh: String
}));

await Post.find().populate('author');`, { 1: { id: 'm' }, 2: { id: 'm' }, 3: { id: 'ref' }, 4: { id: 'm' }, 5: { id: 'm' }, 7: { id: 'pop' } });
const POP_OUT = psql(String.raw`
$ node blog.js
[ { "_id": "6ae62798721f5b830b674729",
    "author": { "_id": "6ae62798721f5b830b674728", "username": "ali", "__v": 0 },
    "izoh": "Birinchi post", "__v": 0 } ]`, { 3: { id: 'au' } });
const S2 = mkS(3, [{ focus: ['m', 'ref'] }, { focus: ['ref'] }, { focus: ['pop'], out: true }, { focus: [], out: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => <Ide files={MKCFG.files} active="blog.js">
    <CodePanel file="blog.js" lines={BLOG_JS} focus={seg.focus} />
    <div className="mk-tag" style={{ margin: 0 }}>Sinov skriptidan, qisqartirilgan · MongoDB 6.0 · Mongoose 9.11</div>
    {seg.out && <Psql title="terminal" lines={POP_OUT} focus={beat === 2 ? ['au'] : []} />}
    <Block at={3} beat={beat}><div className="mk-rule"><b>ref</b> — bog'lanish (post ichida faqat id) · <b>populate</b> — birlashtirish (so'rov paytida id o'rniga hujjat)</div></Block>
  </Ide>} />;
}

// ============================================================
//  4 · Mongo xato bermaydigan joylar
// ============================================================
const BLOG3_JS = js(String.raw`
const User = mongoose.model('User', new mongoose.Schema({ username: String }));
const Post = mongoose.model('Post', new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  izoh: String
}));

// 1-tajriba: bazada yo'q foydalanuvchining id'si bilan post
await Post.create({ author: new mongoose.Types.ObjectId(), izoh: "Muallifi yo'q post" });
await Post.find().populate('author');

// 2-tajriba: Mongoose sxemasini chetlab, kolleksiyaning o'ziga
await mongoose.connection.db.collection('posts').insertOne({ muallif: 'vali', matn: 'Salom', like: 5 });`,
  { 3: { id: 'ref' }, 7: { at: 1 }, 8: { at: 1, neu: true, id: 'e1' }, 9: { at: 1, id: 'e1' }, 10: { at: 2 }, 11: { at: 2 }, 12: { at: 2, neu: true, id: 'e2' } });
const NULL_OUT = psql(String.raw`
$ node blog.js
… { "author": { "username": "ali" }, "izoh": "Birinchi post" },
  { "_id": "6ae62798721f5b830b67472b", "author": null, "izoh": "Muallifi yo'q post", "__v": 0 } ]`, { 3: { id: 'nl' } });
const S3 = mkS(4, [{ focus: ['ref'] }, { focus: ['e1'] }, { focus: ['e2'] }, { focus: [] }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <Ide files={MKCFG.files} active="blog.js">
    <CodePanel file="blog.js" lines={BLOG3_JS} beat={beat} focus={seg.focus} />
    {beat === 1 && <Psql title="terminal — xato yo'q" lines={NULL_OUT} focus={['nl']} />}
    {beat >= 2 && <div style={{ display: 'grid', gap: 6 }}>
      <div className="pg-lab">posts kolleksiyasi — uch hujjat <span className="tm">xato yo'q</span></div>
      <div className="pg-three">
        <Doc>{`{ "author": "…a728",\n  "izoh": "Birinchi post" }`}</Doc>
        <Doc>{`{ "author": "…a72a",\n  "izoh": "Muallifi yo'q post" }`}</Doc>
        <Doc odd>{`{ "muallif": "vali",\n  "matn": "Salom",\n  "like": 5 }`}</Doc>
      </div>
    </div>}
    <Block at={3} beat={beat}><div className="pg-cmp">
      <div className="mk-card"><h5><i style={{ background: PG.mongo }} />MongoDB</h5><div style={{ fontSize: 14 }}>Qoida — <b>kodda</b> (Mongoose sxemasi). Kodni chetlab yozilgan hujjat ham qabul qilinadi.</div></div>
      <div className="mk-card" style={{ borderColor: PG.pg }}><h5><i style={{ background: PG.pg }} />PostgreSQL</h5><div style={{ fontSize: 14 }}>Qoida — <b>jadvalda</b>: <code>NOT NULL</code>, <code>REFERENCES</code>… Uni hech kim chetlab o'ta olmaydi.</div></div>
    </div></Block>
  </Ide>} />;
}

// ============================================================
//  5 · Mongo ↔ PostgreSQL lug'ati
// ============================================================
const DICT4 = [
  ['baza', 'baza (database) — \\l'], ['collection posts', 'jadval (table) posts'], ['document', 'qator (row)'], ['maydon (field)', 'ustun (column) — turi bilan: INT, TEXT'],
  ['_id (ObjectId)', 'id SERIAL PRIMARY KEY — 1, 2, 3'], ["ref: 'User'", 'REFERENCES users(id) — tashqi kalit'], ['populate()', 'JOIN'],
  ['Schema — kodda', 'CREATE TABLE — bazada'], ['required: true · unique: true', 'NOT NULL · UNIQUE'], ['mongosh', 'psql'],
];
const POSTS_DDL = sql(String.raw`
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  izoh TEXT NOT NULL
);`, { 1: { id: 'ddl' }, 2: { id: 'pk' }, 3: { id: 'fk' }, 4: { id: 'col' }, 5: { id: 'ddl' } });
const S4 = mkS(5, [{ rows: [], focus: [] }, { rows: [0, 1, 2, 3], focus: ['col'] }, { rows: [4, 5, 6], focus: ['pk', 'fk'] }, { rows: [7, 8, 9], focus: ['ddl', 'fk', 'col'] }, { rows: [], focus: [] }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div className="pg-two">
    <div className="mk-light" style={{ padding: 12 }}>
      <table className="pg-dict"><thead><tr><th style={{ color: PG.mongo }}>MongoDB (Mongoose)</th><th /><th style={{ color: PG.pg }}>PostgreSQL</th></tr></thead><tbody>
        {DICT4.map(([a, b], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : (seg.rows.length ? 'dim' : '')}><td><code>{a}</code></td><td>↔</td><td><code>{b}</code></td></tr>)}
      </tbody></table>
    </div>
    <div style={{ display: 'grid', gap: 10 }}>
      <Psql title="CREATE TABLE posts" lines={POSTS_DDL} focus={seg.focus} />
      <div className="mk-rule">Mongo'da qoida <b>kodda</b> (Mongoose sxemasi), PostgreSQL'da <b>jadvalda</b>. O'quvchi «populate qani?» desa — <b>JOIN</b>.</div>
    </div>
  </div>} />;
}

// ============================================================
//  6 · Tekshiruv 1 — populate ning jufti
// ============================================================
function Screen5(p) {
  const m = MDT[6];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>JOIN — so'rov paytida ikki jadval bitta javobda (populate kabi)</div>
      <Psql lines={JOIN_OK} />
      <div className="mk-rule"><code>REFERENCES</code> — <b>ref</b>ning jufti: bog'lanishni belgilaydi va qo'riqlaydi, javobga hech narsa qo'shmaydi.</div>
    </div>} />;
}

// ============================================================
//  7 · Windows: rasmiy o'rnatuvchi
// ============================================================
const S6 = mkS(7, [{ v: 'dl' }, { v: 'comp' }, { v: 'pw' }, { v: 'path' }, { v: 'sum' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'dl' && <Win title="postgresql.org/download/windows/">
      <h4>Download PostgreSQL · Windows</h4>
      <div style={{ fontSize: 14, marginBottom: 8 }}>Interactive installer by <b>EDB</b> → Download the installer</div>
      <div className="pg-chk"><div style={{ borderColor: T.accent }}><b>18</b>eng yangi barqaror versiya — shuni tanlang</div><div className="off"><b>19</b>hali RC (sinov versiyasi), 31.10.2026</div></div>
    </Win>}
    {seg.v === 'comp' && <Win title="Setup — PostgreSQL 18 · Select Components">
      <h4>Select Components</h4>
      <div className="pg-chk">
        <div><b>☑</b>PostgreSQL Server — bazaning o'zi</div>
        <div><b>☑</b>pgAdmin 4 — grafik oyna (ixtiyoriy)</div>
        <div className="off"><b>☐</b>Stack Builder — kerak emas</div>
        <div style={{ borderColor: T.accent }}><b>☑</b>Command Line Tools — psql shu yerda, <b>albatta kerak</b></div>
      </div>
    </Win>}
    {seg.v === 'pw' && <Win title="Setup — PostgreSQL 18 · Password / Port" hl>
      <h4>Password</h4>
      <div className="pg-field"><span>Password</span><span>••••••••</span></div>
      <div className="pg-field"><span>Retype password</span><span>••••••••</span></div>
      <div className="pg-field"><span>Port</span><span>5432</span></div>
      <div className="n2-warn" style={{ marginTop: 10, fontSize: 14 }}><b>Parolni yozib qo'ying</b> — o'quvchi keyingi darslarda <code>psql</code>da va loyiha sozlamasida aynan shu parolni so'raydi.</div>
    </Win>}
    {seg.v === 'path' && <Win title="Environment Variables → Path → Edit">
      <h4>Edit environment variable · Path</h4>
      <div className="pg-chk"><div>C:\Windows\system32</div><div>C:\Program Files\nodejs\</div><div style={{ borderColor: T.green, background: '#E3F5EC' }}><b>+</b><code>C:\Program Files\PostgreSQL\18\bin</code></div></div>
      <div style={{ fontSize: 13.5, color: T.ink2, marginTop: 8 }}>Keyin terminalni <b>yangidan</b> oching. Muqobil: Start → <b>SQL Shell (psql)</b>.</div>
    </Win>}
    {seg.v === 'sum' && <div className="mk-light"><div className="mk-tag">Windows — o'rnatgandan keyin uch narsa</div>
      <div className="mk-plan"><div><b>01</b><span>Parol yozib qo'yilgan</span></div><div><b>02</b><span>Port <code>5432</code></span></div><div className="hl"><b>03</b><span><code>…\PostgreSQL\18\bin</code> — Path'da (aks holda <code>psql</code> tanilmaydi)</span></div></div>
    </div>}
    <div className="mk-tag" style={{ margin: 0, color: T.yellow }}>Maket — rasmiy hujjatdan (postgresql.org, EDB qo'llanmasi); bu kompyuterda sinalmagan</div>
  </>} />;
}

// ============================================================
//  8 · macOS: Postgres.app va Homebrew tuzog'i
// ============================================================
const APP_OUT = psql(String.raw`
$ psql -U postgres -c "SELECT current_user;"
 current_user
--------------
 postgres
(1 row)`);
const MAC_PATH = psql(String.raw`
$ sudo mkdir -p /etc/paths.d &&
  echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
Password:
/Applications/Postgres.app/Contents/Versions/latest/bin`);
const BREW_OUT = psql(String.raw`
$ psql -U postgres
psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  role "postgres" does not exist
$ createuser -s postgres
$ psql -U postgres -c "SELECT current_user;"
 current_user
--------------
 postgres
(1 row)`, { 2: { id: 'er' }, 3: { id: 'fix', neu: true } });
const S7 = mkS(8, [{ v: 'app' }, { v: 'init' }, { v: 'path' }, { v: 'brew' }, { v: 'sum' }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    {(seg.v === 'app' || seg.v === 'init') && <Win os="mac" title="Postgres.app" hl={seg.v === 'init'}>
      {seg.v === 'app'
        ? <><h4>postgresapp.com → Download</h4><div style={{ fontSize: 14 }}>Yuklab olingan <b>Postgres.app</b> → <b>Applications</b> papkasiga ko'chiriladi → ochiladi</div></>
        : <><h4>Postgres.app</h4><div style={{ fontSize: 14 }}>Server · Port <code>5432</code> · <span style={{ color: T.green, fontWeight: 700 }}>Running</span></div><span className="pg-btn">Initialize</span></>}
    </Win>}
    {seg.v === 'init' && <><div className="mk-tag" style={{ margin: 0 }}>Haqiqiy: Postgres.app kabi sozlangan server (parol so'ralmaydi)</div><Psql title="terminal" lines={APP_OUT} /></>}
    {seg.v === 'path' && <><Psql title="terminal — rasmiy PATH buyrug'i" lines={MAC_PATH} /><div className="mk-tag" style={{ margin: 0, color: T.yellow }}>⚠ rasmiy hujjatdan (postgresapp.com), bu kompyuterda sinalmagan · keyin terminalni yopib, yangidan oching</div></>}
    {seg.v === 'brew' && <><div className="mk-tag" style={{ margin: 0 }}>Haqiqiy: Homebrew kabi sozlangan server (superuser — kompyuter foydalanuvchisi)</div><Psql title="terminal — Homebrew" lines={BREW_OUT} focus={['er', 'fix']} /></>}
    {seg.v === 'sum' && <div className="mk-light"><div className="mk-tag">macOS — xulosa</div>
      <div className="mk-plan"><div><b>01</b><span>Postgres.app → Applications → <b>Initialize</b></span></div><div><b>02</b><span>PATH buyrug'i, terminal yangidan</span></div><div className="hl"><b>03</b><span>Homebrew bo'lsa: <code>createuser -s postgres</code> — o'quvchi darslari <code>psql -U postgres</code> kutadi</span></div></div>
    </div>}
  </>} />;
}

// ============================================================
//  9 · Birinchi ulanish: psql
// ============================================================
const FIRST8 = psql(String.raw`
$ psql -U postgres
Password for user postgres:
psql (18.4 (Debian 18.4-1+b1), server 17.2 (Debian 17.2-1+b2))
Type "help" for help.

postgres=# SELECT 1
postgres-# ;
 ?column?
----------
        1
(1 row)

postgres=# SELECT version();
 PostgreSQL 18.4 (Debian 18.4-1+b1) on x86_64-pc-linux-gnu, compiled by … 64-bit
(1 row)

postgres=# \l
   Name    |  Owner   | Encoding | …
-----------+----------+----------+
 postgres  | postgres | UTF8     |
 template0 | postgres | UTF8     |
 template1 | postgres | UTF8     |
(3 rows)

postgres=# \q`, mergeMeta(rng(1, 1, { at: 0 }), rng(2, 6, { at: 1 }), rng(7, 16, { at: 2 }), rng(17, 25, { at: 3 }), { 2: { id: 'pw' }, 6: { id: 'pr' }, 7: { id: 'semi' }, 13: { id: 'ver' }, 14: { id: 'ver' }, 17: { id: 'l' }, 21: { id: 'l' }, 22: { id: 'l' }, 23: { id: 'l' }, 25: { id: 'q' } }));
const S8 = mkS(9, [{ focus: [] }, { focus: ['pw', 'pr'] }, { focus: ['semi', 'ver'] }, { focus: ['l', 'q'] }, { focus: [] }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => <>
    <Psql title="terminal — psql" lines={FIRST8} beat={beat} focus={seg.focus} />
    <Block at={2} beat={beat}><div className="mk-tag" style={{ margin: 0 }}>Bu yerda Linux. Sizda <code>PostgreSQL 18…</code> dan keyin Windows yoki macOS yozuvi bo'ladi.</div></Block>
    <Block at={4} beat={beat}><div className="mk-rule">Prompt — qaysi bazadasiz (<code>postgres=#</code>) · <code>-#</code> — davomini kutyapti · SQL — <b>nuqta-vergul</b> bilan · <code>\l</code> <code>\c</code> <code>\d</code> <code>\q</code> — usiz</div></Block>
  </>} />;
}

// ============================================================
//  10 · Amaliyot 1 — o'rnating va ulaning
// ============================================================
const P1 = mkS(10, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "O'rnatish — Windows: postgresql.org → EDB installer 18 (Server · pgAdmin 4 · Command Line Tools; parol; port 5432) · Mac: postgresapp.com → Applications → Initialize", cmds: [], exp: "o'rnatuvchi tugadi / Postgres.app'da «Running»" },
  { t: "PATH — Windows: C:\\Program Files\\PostgreSQL\\18\\bin → Path, yangi terminal · Mac: rasmiy buyruq, yangi terminal", cmds: ['sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp', 'psql --version'], exp: 'psql (PostgreSQL) 18…' },
  { t: 'Ulanish', cmds: ['psql -U postgres'], exp: 'Windows: Password for user postgres: → postgres=# · Mac: darhol postgres=#' },
  { t: "Birinchi so'rov", cmds: ['SELECT version();', '\\l', '\\q'], exp: 'PostgreSQL 18… · 3 baza: postgres, template0, template1' },
];
const P1_TROUBLE = [
  ['FATAL:  password authentication failed for user "postgres"', "parol noto'g'ri: o'rnatishda yozgan parolingiz; klaviatura tilini (EN/RU) va katta harfni tekshiring"],
  ['Connection refused · Is the server running on that host and accepting TCP/IP connections?', "PostgreSQL ishlamayapti — PostgreSQL'ni ishga tushiring: Windows: Services → postgresql-x64-18 → Start ⚠ · Mac: Postgres.app → Start"],
  ['connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory', "Mac: Postgres.app ochilmagan yoki server to'xtagan — dasturni oching, Start"],
  ['FATAL:  role "postgres" does not exist', "Homebrew bilan o'rnatilgan — createuser -s postgres (8-ekran)"],
  ["'psql' is not recognized as an internal or external command ⚠ · zsh: command not found: psql ⚠", "PATH: 2-qadam, keyin terminalni yangidan oching; Windows'da vaqtincha Start → SQL Shell (psql)"],
  ['WARNING: Console code page (866) differs from Windows code page (1251) ⚠', "Windows ogohlantirishi: ishga xalaqit bermaydi, davom eting"],
  ['Prompt postgres-# bo\'lib qoldi', "nuqta-vergul unutilgan — ; yozib Enter"],
];
const P1_PROOF = { label: "Isbot: SELECT version(); natijasi — PostgreSQL so'zidan boshlab", placeholder: "natija qatorini shu yerga qo'ying", check: (v) => /^\s*PostgreSQL \d{2}/.test(v), wrong: "Natija «PostgreSQL» so'zi va versiya raqami bilan boshlanadi — terminaldan butun qatorni nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  11 · blog bazasi va users jadvali
// ============================================================
const DB10 = psql(String.raw`
postgres=# CREATE DATABASE blog;
CREATE DATABASE
postgres=# \c blog
blog=# CREATE TABLE users (
blog(#   id SERIAL PRIMARY KEY,
blog(#   username TEXT NOT NULL UNIQUE
blog(# );
CREATE TABLE`, mergeMeta(rng(1, 3, { at: 1 }), rng(4, 8, { at: 2 }), { 3: { id: 'c' }, 4: { id: 'c' }, 5: { id: 'id' }, 6: { id: 'un' } }));
const ERR10 = psql(String.raw`
blog=# CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);
ERROR:  relation "users" already exists

blog=# CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);
ERROR:  syntax error at or near "name"
LINE 1: CREATE TABLE tags (id SERIAL PRIMARY KEY name TEXT);
                                                 ^`, { 4: { id: 'se' }, 5: { id: 'se' }, 6: { id: 'se' }, 7: { id: 'se' } });
const FIX10 = psql(String.raw`
blog=# CREATE TABLE tags (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE`, { 1: { neu: true } });
const S10 = mkS(11, [{ focus: [] }, { focus: ['c'] }, { focus: ['id', 'un'] }, { err: true, focus: ['se'] }, { err: true, focus: [] }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg, beat }) => <>
    {beat === 0 && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi m4-03 amaliyotidagi namuna — qog'ozda</div>
      <div className="pg-two"><MiniTable name="users" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali'], ['3', 'sardor']]} /><MiniTable name="posts" cols={['id', 'user_id', 'izoh']} rows={[['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']]} /></div>
    </div>}
    {beat >= 1 && !seg.err && <Psql title="psql" lines={DB10} beat={beat} focus={seg.focus} />}
    {seg.err && <><Psql title="psql — blog" er lines={ERR10} focus={seg.focus} /><Psql lines={FIX10} /></>}
    <Block at={4} beat={beat}><div className="mk-rule">Baza <b>oldin yaratiladi</b> (<code>CREATE DATABASE</code>), unga <code>\c</code> bilan o'tiladi · ustun turi va qoidalari jadval bilan birga · <code>syntax error</code> — <code>^</code> ko'rsatgan so'zdan <b>oldin</b> qarang</div></Block>
  </>} />;
}

// ============================================================
//  12 · posts va tashqi kalit
// ============================================================
const POSTS11 = psql(String.raw`
blog=# CREATE TABLE posts (
blog(#   id SERIAL PRIMARY KEY,
blog(#   user_id INT NOT NULL REFERENCES users(id),
blog(#   izoh TEXT NOT NULL
blog(# );
CREATE TABLE`, { 3: { id: 'fk' } });
const D11 = psql(String.raw`
blog=# \dt
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | posts | table | postgres
 public | users | table | postgres
(2 rows)

blog=# \d posts
 Column  |  Type   | Nullable |              Default
---------+---------+----------+-----------------------------------
 id      | integer | not null | nextval('posts_id_seq'::regclass)
 user_id | integer | not null |
 izoh    | text    | not null |
Foreign-key constraints:
    "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)`, { 14: { id: 'fk' }, 15: { id: 'fk' } });
const INS11 = psql(String.raw`
blog=# INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');
INSERT 0 3
blog=# INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');
INSERT 0 3`, { 2: { id: 'n' }, 4: { id: 'n' } });
const REL11 = psql(String.raw`
postgres=# SELECT * FROM posts;
ERROR:  relation "posts" does not exist
LINE 1: SELECT * FROM posts;
                      ^
postgres=# \c blog
blog=# SELECT * FROM posts;
 id | user_id |         izoh
----+---------+----------------------
  1 |       1 | Birinchi post
  2 |       1 | Bugun Nest o'rgandim
  3 |       2 | Salom hammaga
(3 rows)`, { 1: { id: 'pr' }, 2: { id: 'pr' }, 5: { id: 'fix', neu: true }, 6: { id: 'fix' } });
const S11 = mkS(12, [{ v: 'ddl', focus: ['fk'] }, { v: 'd', focus: ['fk'] }, { v: 'ins', focus: ['n'] }, { v: 'rel', focus: ['pr', 'fix'] }, { v: 'rel', focus: [] }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg, beat }) => <>
    {seg.v === 'ddl' && <Psql lines={POSTS11} focus={seg.focus} />}
    {seg.v === 'd' && <Psql lines={D11} focus={seg.focus} />}
    {seg.v === 'ins' && <><Psql lines={INS11} focus={seg.focus} /><div className="mk-tag" style={{ margin: 0 }}>SQL matnida apostrof ikki marta yoziladi: <code>o''rgandim</code></div>
      <div className="pg-two"><MiniTable name="users" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali'], ['3', 'sardor']]} hlRow={[2]} /><MiniTable name="posts" cols={['id', 'user_id', 'izoh']} rows={[['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']]} hlCol={[1]} /></div></>}
    {seg.v === 'rel' && <Psql title="psql — qayta ochildi" lines={REL11} focus={seg.focus} />}
    <Block at={4} beat={beat}><div className="mk-rule"><code>REFERENCES</code> bog'lanishni <b>bazaga</b> yozadi · <code>\d jadval</code> — tuzilish · <code>does not exist</code> — avval <b>prompt</b>dagi baza nomi</div></Block>
  </>} />;
}

// ============================================================
//  13 · Baza o'zi tekshiradi
// ============================================================
const E12 = [
  psql(String.raw`
blog=# INSERT INTO users (username) VALUES (NULL);
ERROR:  null value in column "username" of relation "users" violates not-null constraint
DETAIL:  Failing row contains (4, null).

blog=# INSERT INTO users (username) VALUES ('ali');
ERROR:  duplicate key value violates unique constraint "users_username_key"
DETAIL:  Key (username)=(ali) already exists.`),
  psql(String.raw`
blog=# INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');
ERROR:  insert or update on table "posts" violates foreign key constraint "posts_user_id_fkey"
DETAIL:  Key (user_id)=(99) is not present in table "users".`),
  psql(String.raw`
blog=# DELETE FROM users WHERE id = 1;
ERROR:  update or delete on table "users" violates foreign key constraint "posts_user_id_fkey" on table "posts"
DETAIL:  Key (id)=(1) is still referenced from table "posts".`),
];
// Xabarning uch bo'lagi: qaysi jadval · qaysi qoida · qaysi qiymat
const READ12 = [
  null,
  [['users', 'jadval'], ['not-null · unique', 'qoida'], ['(4, null) · (ali)', 'qiymat']],
  [['on table "posts"', 'jadval'], ['"posts_user_id_fkey"', 'qoida'], ['Key (user_id)=(99)', 'qiymat']],
  [['on table "users" … "posts"', 'jadval'], ['"posts_user_id_fkey"', 'qoida'], ['Key (id)=(1)', 'qiymat']],
];
const S12 = mkS(13, [{ e: -1 }, { e: 0 }, { e: 1 }, { e: 2 }, { e: 9 }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => <>
    <div className="mk-light" style={{ padding: 12 }}>
      <div className="mk-tag">Xabarni o'qish — uch savol</div>
      <div className="pg-three">{(READ12[seg.e === 9 ? 2 : beat] || [['qaysi jadval', 'jadval'], ['qaysi qoida', 'qoida'], ['qaysi qiymat (DETAIL)', 'qiymat']]).map(([v, k], i) => <div key={i} className="mk-box" style={{ '--c': [PG.pg, T.accent, T.yellow][i] }}><h4>{['Qaysi jadval', 'Qaysi qoida', 'Qaysi qiymat'][i]}</h4><p><code>{v}</code></p></div>)}</div>
    </div>
    {seg.e >= 0 && seg.e <= 2 && <Psql er lines={E12[seg.e]} />}
    {seg.e === 1 && <div className="pg-cmp">
      <div className="mk-card"><h5><i style={{ background: PG.mongo }} />MongoDB — 4-ekran</h5><Doc>{`{ "author": null, "izoh": "Muallifi yo'q post" }   ← saqlandi`}</Doc></div>
      <div className="mk-card" style={{ borderColor: PG.pg }}><h5><i style={{ background: PG.pg }} />PostgreSQL</h5><Doc er>{'ERROR … foreign key constraint   ← saqlanmadi'}</Doc></div>
    </div>}
    {seg.e === 9 && <Psql er lines={E12[1]} />}
    {seg.e === 9 && <div className="mk-rule">Qoida buzilsa yozuv <b>saqlanmaydi</b>. O'quvchi bilan birga o'qing: jadval · qoida nomi · <b>DETAIL</b> qatoridagi qiymat — javob deyarli doim shu qatorda.</div>}
  </>} />;
}

// ============================================================
//  14 · Tekshiruv 2 — DELETE rad etildi
// ============================================================
function Screen13(p) {
  const m = MDT[14];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Psql er lines={E12[2]} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatish — avval postlar, keyin foydalanuvchi (haqiqiy natija)</div>
      <Psql lines={psql(String.raw`
blog=# DELETE FROM posts WHERE user_id = 1;
DELETE 2
blog=# DELETE FROM users WHERE id = 1;
DELETE 1`, { 1: { neu: true }, 3: { neu: true } })} />
      <div className="mk-rule">Bunday <code>id</code> yo'q bo'lsa xato chiqmaydi: <code>DELETE 0</code>. Xato — qoida buzilganda.</div>
    </div>} />;
}

// ============================================================
//  15 · Amaliyot 2 — ikki bog'langan jadval
// ============================================================
const P2 = mkS(15, [{ hl: [] }, { hl: [0, 1, 2, 3] }, { hl: [4] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Baza', cmds: ['psql -U postgres', 'CREATE DATABASE blog;', '\\c blog'], exp: 'CREATE DATABASE · prompt blog=#' },
  { t: 'users', cmds: ['CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE);'], exp: 'CREATE TABLE' },
  { t: 'posts', cmds: ['CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), izoh TEXT NOT NULL);', '\\dt'], exp: 'CREATE TABLE · 2 jadval' },
  { t: "Ma'lumot", cmds: ["INSERT INTO users (username) VALUES ('ali'), ('vali'), ('sardor');", "INSERT INTO posts (user_id, izoh) VALUES (1, 'Birinchi post'), (1, 'Bugun Nest o''rgandim'), (2, 'Salom hammaga');"], exp: 'INSERT 0 3 · INSERT 0 3' },
  { t: 'Xatoni o\'zingiz chiqaring', cmds: ["INSERT INTO posts (user_id, izoh) VALUES (99, 'Muallifi yo''q post');", '\\d posts'], exp: 'violates foreign key constraint "posts_user_id_fkey" · Key (user_id)=(99) is not present' },
];
const P2_TROUBLE = [
  ['ERROR:  relation "users" already exists', "jadval oldin yaratilgan — \\d users bilan ko'ring, keyingi qadamga o'ting"],
  ['ERROR:  syntax error at or near "…"', "^ ko'rsatgan so'zdan oldin vergul yoki qavs tushib qolgan"],
  ['ERROR:  relation "posts" does not exist', 'boshqa bazadasiz (prompt postgres=#) — \\c blog'],
  ['ERROR:  database "blog" already exists', "baza oldin yaratilgan — \\c blog va davom eting"],
  ['Prompt postgres-# / blog-#', "; unutilgan — ; yozib Enter"],
  ['5-qadamda INSERT 0 1', "REFERENCES users(id) yozilmagan — \\d posts'da kalit qatori yo'q; DROP TABLE posts; va 3-qadamni qayta"],
];
const P2_PROOF = { label: "Isbot: \\d posts natijasidagi Foreign-key qatori", placeholder: "\\d posts chiqishidan kalit qatorini shu yerga qo'ying", check: (v) => /posts_user_id_fkey/.test(v) && /references\s+users\s*\(id\)/i.test(v), wrong: "Qatorda kalit nomi (posts_user_id_fkey) va REFERENCES users(id) bo'lsin — \\d posts natijasining oxirgi qatori" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  16 · JOIN va LEFT JOIN
// ============================================================
const LEFT15 = psql(String.raw`
blog=# SELECT users.username, posts.izoh
blog-# FROM users
blog-# LEFT JOIN posts ON posts.user_id = users.id;
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 ali      | Bugun Nest o'rgandim
 vali     | Salom hammaga
 sardor   |
(4 rows)`, { 3: { id: 'lj' }, 9: { id: 'sa' } });
const JOIN15 = psql(String.raw`
blog=# SELECT users.username, posts.izoh
blog-# FROM posts
blog-# JOIN users ON users.id = posts.user_id;
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 ali      | Bugun Nest o'rgandim
 vali     | Salom hammaga
(3 rows)`, { 1: { id: 'sel' }, 2: { id: 'from' }, 3: { id: 'on' } });
const S15 = mkS(16, [{ v: 'tab', on: false }, { v: 'join', on: true, focus: ['sel', 'from', 'on'] }, { v: 'left', on: true, focus: ['lj', 'sa'] }, { v: 'join', on: true, focus: ['on'] }, { v: 'join', on: true, focus: [] }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg, beat }) => <>
    <div className="pg-two">
      <MiniTable name="posts" cols={['id', 'user_id', 'izoh']} rows={[['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']]} hlCol={seg.on ? [1] : []} />
      <MiniTable name="users" cols={['id', 'username']} rows={[['1', 'ali'], ['2', 'vali'], ['3', 'sardor']]} hlCol={seg.on ? [0] : []} hlRow={seg.v === 'left' ? [2] : []} />
    </div>
    {seg.on && <div className="mk-tag" style={{ margin: 0, color: T.accent }}>ON: users.id = posts.user_id — users'dagi id posts'dagi user_id'ga teng</div>}
    {seg.v === 'join' && <Psql lines={JOIN15} focus={seg.focus} />}
    {seg.v === 'left' && <Psql lines={LEFT15} focus={seg.focus} />}
    <Block at={4} beat={beat}><div className="mk-rule"><b>JOIN</b> — faqat jufti borlar · <b>LEFT JOIN</b> — chapdagi jadvalning hammasi · <code>ON</code>da tashqi kalit (<code>user_id</code>) boshqa jadvalning <code>id</code>'siga tenglanadi</div></Block>
  </>} />;
}

// ============================================================
//  17 · Tekshiruv 3 — xatosiz, lekin noto'g'ri natija (LineCheck; target 0 dan — 3-satr = 2)
// ============================================================
const LC16 = sql(String.raw`
SELECT users.username, posts.izoh
FROM posts
JOIN users ON users.id = posts.id;`);
const LC16_FIXED = [
  { h: sqlLine('SELECT users.username, posts.izoh'), n: 1 },
  { h: sqlLine('FROM posts'), n: 2 },
  { h: sqlLine('JOIN users ON users.id = posts.id;'), n: 3, gone: true },
  { h: sqlLine('JOIN users ON users.id = posts.user_id;') + '  <span class="cm">-- tashqi kalit</span>', n: 3, neu: true },
];
// Noto'g'ri natija — topshiriq matni ichida (bosiladigan kod satrlari orasida emas: jadval qatori «xato satr» deb bosilmasin)
const WRONG16_TXT = String.raw`
 username |         izoh
----------+----------------------
 ali      | Birinchi post
 vali     | Bugun Nest o'rgandim      ← noto'g'ri
 sardor   | Salom hammaga             ← noto'g'ri
(3 rows)`;
const WRONG16_HTML = '<pre class="pg-doc er" style="margin-top:12px;font-size:12px">' + escH(WRONG16_TXT.replace(/^\n/, '')) + '</pre>';
function Screen16(p) {
  const m = MDT[17];
  return <>
    <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task + WRONG16_HTML} q={m.q} file="psql — blog · so'rov" lines={LC16} target={2}
      fixed={LC16_FIXED} fixedExtra={[{ file: "natija — to'g'ri (haqiqiy)", lines: JOIN15.slice(3) }]}
      ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />
  </>;
}

// ============================================================
//  18 · Amaliyot 3 — JOIN
// ============================================================
const P3 = mkS(18, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'JOIN', cmds: ['SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.user_id;'], exp: '3 qator: ali · ali · vali' },
  { t: 'Xato ON', cmds: ['SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.id;'], exp: "xato yo'q; ali · vali · sardor — mualliflar noto'g'ri" },
  { t: 'LEFT JOIN', cmds: ['SELECT users.username, posts.izoh FROM users LEFT JOIN posts ON posts.user_id = users.id;'], exp: 'sardor — bo\'sh izoh bilan' },
  { t: 'Sanash', cmds: [], exp: '3-qadam natijasining oxirgi satri: (… rows)' },
];
const P3_TROUBLE = [
  ['ERROR:  relation "posts" does not exist', 'boshqa bazadasiz — \\c blog'],
  ['(0 rows)', "INSERT'lar boshqa bazada qilingan yoki qilinmagan — SELECT * FROM posts; bilan tekshiring, Amaliyot 2 ning 4-qadami"],
  ['ERROR:  syntax error at or near "…"', "^ ko'rsatgan joydan oldin vergul yoki nuqta tushib qolgan"],
  ["sardor LEFT JOIN'da ham yo'q", 'FROM posts LEFT JOIN users yozilgan — FROM users dan boshlang'],
];
const P3_PROOF = { label: 'Isbot: LEFT JOIN natijasidagi qatorlar soni', placeholder: 'natija ostidagi sonni yozing', check: (v) => /^\s*\(?\s*4\b/.test(v), wrong: "LEFT JOIN natijasi ostida qavs ichida qatorlar soni yozilgan — sardor ham sanaladi" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  19 · Oxirgi telefon — ikki oyna yonma-yon (pg1-out/12: 2-xaridor 1 s da boshladi, 3,08 s da tugadi)
// ============================================================
const PROD18 = psql(String.raw`
blog=# CREATE TABLE products (
blog(#   id SERIAL PRIMARY KEY,
blog(#   nomi TEXT NOT NULL,
blog(#   stock INT NOT NULL CHECK (stock >= 0)
blog(# );
CREATE TABLE
blog=# INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);
INSERT 0 1`, { 4: { id: 'ck' } });
const X1_18 = psql(String.raw`
blog=# BEGIN;
BEGIN
blog=*# UPDATE products SET stock = stock - 1
blog-*#   WHERE id = 1 AND stock > 0 RETURNING stock;
 stock
-------
     0
(1 row)

UPDATE 1
blog=*# COMMIT;
COMMIT`, mergeMeta(rng(1, 10, { at: 2 }), rng(11, 12, { at: 3 }), { 11: { id: 'cm' }, 12: { id: 'cm' } }));
const X2_18 = psql(String.raw`
blog=# UPDATE products SET stock = stock - 1
blog-#   WHERE id = 1 AND stock > 0 RETURNING stock;
 stock
-------
(0 rows)

UPDATE 0`, mergeMeta(rng(1, 2, { at: 2 }), rng(3, 7, { at: 3 }), { 7: { id: 'z' } }));
const CHECK18 = psql(String.raw`
blog=# UPDATE products SET stock = stock - 1 WHERE id = 1;
ERROR:  new row for relation "products" violates check constraint "products_stock_check"
DETAIL:  Failing row contains (1, Telefon, -1).`);
const S18 = mkS(19, [{ v: 'intro' }, { v: 'tab' }, { v: 'two' }, { v: 'two' }, { v: 'sum' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg, beat }) => <>
    <div className="pg-row"><span>products · id 1 · Telefon</span><span className={`v${beat >= 3 ? ' z' : ''}`}>stock {beat >= 3 ? 0 : 1}</span></div>
    {seg.v === 'intro' && <div className="pg-two">
      <div className="mk-card"><h5>1-xaridor · Ali</h5><div style={{ fontSize: 15 }}>«Sotib olish» — 0 s</div></div>
      <div className="mk-card"><h5>2-xaridor · Vali</h5><div style={{ fontSize: 15 }}>«Sotib olish» — 1 s</div></div>
    </div>}
    {seg.v === 'tab' && <Psql lines={PROD18} focus={['ck']} />}
    {(seg.v === 'two' || seg.v === 'sum') && <div className="pg-two">
      <div><div className="pg-lab">1-oyna · 1-xaridor <span className="tm">0 s</span></div><Psql lines={X1_18} beat={beat >= 4 ? 3 : beat} focus={beat === 3 ? ['cm'] : []} /></div>
      <div><div className="pg-lab">2-oyna · 2-xaridor <span className="tm">1 s</span></div><Psql lines={X2_18} beat={beat >= 4 ? 3 : beat} focus={beat === 3 ? ['z'] : []} />
        {beat === 2 && <div style={{ marginTop: 8 }}><span className="pg-wait">⏳ kutyapti — qator 1-oynada band</span></div>}
        {beat >= 3 && <div className="mk-tag" style={{ marginTop: 8 }}>3,08 s da tugadi — 1-oyna COMMIT qilguncha kutdi</div>}
      </div>
    </div>}
    {seg.v === 'sum' && <><Psql er lines={CHECK18} /><div className="mk-rule">Telefonni <b>so'rovdagi shart</b> (<code>stock &gt; 0</code>) va <b>qator qulfi</b> saqladi. Shart yozilmasa — <code>CHECK</code> to'xtatadi.</div></>}
  </>} />;
}

// ============================================================
//  20 · Hammasi yoki hech narsa
// ============================================================
const ORD19 = psql(String.raw`
blog=# CREATE TABLE orders (
blog(#   id SERIAL PRIMARY KEY,
blog(#   product_id INT NOT NULL REFERENCES products(id),
blog(#   xaridor TEXT NOT NULL
blog(# );
CREATE TABLE`);
const TX19 = psql(String.raw`
blog=# BEGIN;
BEGIN
blog=*# INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
INSERT 0 1
blog=*# UPDATE products SET stock = stock - 1 WHERE id = 1;
ERROR:  new row for relation "products" violates check constraint "products_stock_check"
blog=!# COMMIT;
ROLLBACK
blog=# SELECT * FROM orders;
 id | product_id | xaridor
----+------------+---------
(0 rows)`, mergeMeta(rng(1, 6, { at: 1 }), rng(7, 12, { at: 2 }), { 3: { id: 'ins' }, 4: { id: 'ins' }, 6: { id: 'er' }, 8: { id: 'rb' }, 12: { id: 'rb' } }));
const S19 = mkS(20, [{ v: 'ddl' }, { v: 'tx', focus: ['ins', 'er'] }, { v: 'tx', focus: ['rb'] }, { v: 'mongo' }, { v: 'tx', focus: [], sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg, beat }) => <>
    <div className="pg-two">
      <MiniTable name="orders" cols={['id', 'product_id', 'xaridor']} rows={beat === 1 ? [['1', '1', 'vali  · tasdiqlanmagan']] : []} hlRow={beat === 1 ? [0] : []} />
      <MiniTable name="products" cols={['id', 'nomi', 'stock']} rows={[['1', 'Telefon', '0']]} hlCol={beat === 1 ? [2] : []} />
    </div>
    {seg.v === 'ddl' && <Psql lines={ORD19} />}
    {seg.v === 'tx' && <Psql lines={TX19} beat={seg.sum ? 2 : beat} focus={seg.focus} />}
    {seg.v === 'tx' && beat >= 1 && <div className="mk-tag" style={{ margin: 0 }}>Prompt: <code>blog=*#</code> — tranzaksiya ochiq · <code>blog=!#</code> — tranzaksiyada xato bo'ldi</div>}
    {seg.v === 'mongo' && <div className="pg-cmp">
      <div className="mk-card"><h5><i style={{ background: PG.mongo }} />MongoDB — oxirgi telefon</h5><Doc>{`updateOne({ stock: { $gt: 0 } }, { $inc: { stock: -1 } })\nxaridor1 → modifiedCount: 0\nxaridor2 → modifiedCount: 1\nstock: 0   ← bittaga sotildi`}</Doc>
        <Doc er>{`tranzaksiya (oddiy mongod):\nXATO: This MongoDB deployment does not support\nretryable writes.`}</Doc></div>
      <div className="mk-card" style={{ borderColor: PG.pg }}><h5><i style={{ background: PG.pg }} />PostgreSQL</h5><div style={{ fontSize: 14, lineHeight: 1.5 }}>Bir nechta jadval (<code>orders</code> + <code>products</code>) <b>bitta tranzaksiyada</b> — oddiy o'rnatishda ham. Xato bo'lsa — <code>ROLLBACK</code>, yarim ish qolmaydi.</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">Bir nechta jadval birga o'zgarsa — <code>BEGIN … COMMIT</code>. Ichida xato bo'lsa, <code>COMMIT</code> javobi <b>ROLLBACK</b>: hammasi bekor.</div>}
  </>} />;
}

// ============================================================
//  21 · JSON ham saqlaydi
// ============================================================
const ALT20 = psql(String.raw`
blog=# ALTER TABLE products ADD COLUMN extra JSONB;
ALTER TABLE`);
const INS20 = psql(String.raw`
blog=# INSERT INTO products (nomi, stock, extra) VALUES
blog-#   ('Futbolka', 12, '{"rang": "qora", "olcham": "M"}'),
blog-#   ('Quloqchin', 5, '{"rang": "oq", "bluetooth": true}');
INSERT 0 2
blog=# SELECT nomi, extra FROM products;
   nomi    |               extra
-----------+-----------------------------------
 Telefon   |
 Futbolka  | {"rang": "qora", "olcham": "M"}
 Quloqchin | {"rang": "oq", "bluetooth": true}
(3 rows)`);
const Q20 = psql(String.raw`
blog=# SELECT nomi, extra->>'rang' AS rang FROM products WHERE extra->>'rang' = 'qora';
   nomi   | rang
----------+------
 Futbolka | qora
(1 row)`, { 1: { id: 'q' } });
const S20 = mkS(21, [{ v: 'mongo' }, { v: 'alt' }, { v: 'ins' }, { v: 'q' }, { v: 'q', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'mongo' && <div style={{ display: 'grid', gap: 8 }}><div className="pg-lab">4-ekran: Mongo'da har hujjat har xil</div><div className="pg-three"><Doc>{`{ "author": "…", "izoh": "…" }`}</Doc><Doc>{`{ "author": "…", "izoh": "…" }`}</Doc><Doc odd>{`{ "muallif": "vali", "matn": "Salom", "like": 5 }`}</Doc></div></div>}
    {seg.v !== 'mongo' && <Psql lines={ALT20} />}
    {(seg.v === 'ins' || seg.v === 'q') && <Psql lines={INS20} />}
    {seg.v === 'q' && <Psql lines={Q20} focus={['q']} />}
    {seg.sum && <div className="mk-rule">Hamma qatorda bor muhim maydon — <b>oddiy ustun</b> (qoidasi bilan) · har xil qo'shimcha — <code>jsonb</code>. «PostgreSQL JSON ham saqlaydi» — mana shu misol.</div>}
  </>} />;
}

// ============================================================
//  22 · Tekshiruv 4 — buyurtma qayerda?
// ============================================================
const TX21 = psql(String.raw`
blog=# BEGIN;
BEGIN
blog=*# INSERT INTO orders (product_id, xaridor) VALUES (1, 'vali');
INSERT 0 1
blog=*# UPDATE products SET stock = stock - 1 WHERE id = 1;
ERROR:  new row for relation "products" violates check constraint "products_stock_check"
blog=!# COMMIT;
?        ← baza COMMIT'ga nima deb javob berdi? Variantni tanlang`);
function Screen21(p) {
  const m = MDT[22];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Psql lines={TX21} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Psql lines={psql(String.raw`
blog=!# COMMIT;
ROLLBACK
blog=# SELECT * FROM orders;
 id | product_id | xaridor
----+------------+---------
(0 rows)`)} />
    </div>} />;
}

// ============================================================
//  23 · Amaliyot 4 — ikki oyna
// ============================================================
const P4 = mkS(23, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4] }], { tableAt: 3 });
const P4_STEPS = [
  { t: 'Jadval', cmds: ['CREATE TABLE products (id SERIAL PRIMARY KEY, nomi TEXT NOT NULL, stock INT NOT NULL CHECK (stock >= 0));', "INSERT INTO products (nomi, stock) VALUES ('Telefon', 1);"], exp: 'CREATE TABLE · INSERT 0 1' },
  { t: '1-oyna — COMMITsiz', cmds: ['BEGIN;', 'UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;'], exp: 'stock 0 · UPDATE 1 · tranzaksiya ochiq qolsin' },
  { t: '2-oyna', cmds: ['UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0 RETURNING stock;'], exp: "javob yo'q — kutyapti" },
  { t: '1-oyna — COMMIT', cmds: ['COMMIT;'], exp: '1-oyna: COMMIT · 2-oyna: (0 rows) va oxirgi satr' },
  { t: '(ixtiyoriy) jsonb', cmds: ['ALTER TABLE products ADD COLUMN extra JSONB;'], exp: "21-ekrandagi INSERT va SELECT → Futbolka | qora; bajarmasangiz ham katakchani belgilang" },
];
const P4_TROUBLE = [
  ['2-oyna kutmadi, darhol UPDATE 0', "1-oynada COMMIT allaqachon yozilgan (yoki BEGIN yo'q) — telefon oldin sotilgan; UPDATE products SET stock = 1 WHERE id = 1; va 2-qadamdan qayta"],
  ['2-oyna kutdi, lekin UPDATE 1', "telefon 1 tadan ko'p (INSERT ikki marta) — SELECT id, nomi, stock FROM products; bilan ko'ring, UPDATE products SET stock = 1 WHERE id = 1; va 2-qadamdan qayta"],
  ['violates check constraint "products_stock_check"', "WHERE … stock > 0 tushib qolgan — CHECK to'xtatdi (19-ekran, 5-qadam)"],
  ['ERROR:  relation "products" does not exist', '2-oyna boshqa bazada — \\c blog'],
  ['ERROR:  relation "products" already exists', "jadval oldin yaratilgan (masalan 21-ekrandan) — 2-qadamga o'ting"],
];
const P4_PROOF = { label: '2-oynadagi oxirgi satr', placeholder: 'ikkinchi oynada chiqqan oxirgi satrni yozing', check: (v) => /^\s*update\s+0\s*$/i.test(v), wrong: "2-oyna 1-oyna COMMIT qilgandan keyin javob beradi — eng oxirgi satrni aynan yozing" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }

// ============================================================
//  24 · Sinf kompyuterlari: m4-06 dan oldin
// ============================================================
const CHECK23 = ['PostgreSQL 18 o\'rnatilgan (Windows: EDB · Mac: Postgres.app)', 'psql PATH\'da — yangi terminalda psql --version', 'Sinf paroli — hamma kompyuterda bir xil', 'psql -U postgres -c "SELECT version();" — qayta yoqilgandan keyin ham'];
const VER23 = psql(String.raw`
$ psql -U postgres -c "SELECT version();"
                                version
-------------------------------------------------------------------------
 PostgreSQL 18.4 … 64-bit
(1 row)`);
const S23 = mkS(24, [{ v: 'line', on: 0 }, { v: 'line', on: 1 }, { v: 'list', on: 3 }, { v: 'list', on: 4, ver: true }, { v: 'list', on: 4 }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'line' && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darslari — PostgreSQL qayerdan kerak</div>
      <div className="mk-plan">
        <div className={seg.on === 1 ? '' : ''}><b>m4-03</b><span>SQL vs NoSQL — kodsiz, baza kerak emas</span></div>
        <div className={seg.on === 1 ? 'hl' : ''}><b>→</b><span><b>Shu oraliqda:</b> sinf kompyuterlariga PostgreSQL'ni siz o'rnatasiz</span></div>
        <div><b>m4-06</b><span>CRUD — o'quvchi so'rov yozishni boshlaydi</span></div>
        <div className={seg.on === 0 ? 'hl' : ''}><b>m4-08</b><span>AvtoIjara: <code>psql -U postgres</code> va «o'rnatishda berilgan parol» — tayyor deb kutiladi</span></div>
      </div>
    </div>}
    {seg.v === 'list' && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag" style={{ color: T.accent }}>Darsdan oldin — har sinf kompyuterida</div>
      <div style={{ display: 'grid', gap: 8 }}>{CHECK23.map((x, i) => <div key={i} className={`mk-step${i < seg.on ? '' : ' '}${(seg.on === 3 && i === 2) || (seg.on === 4 && i === 3) ? ' hl' : ''}`} style={{ opacity: i < seg.on ? 1 : 0.45 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: i < seg.on ? T.green : T.ink3, minWidth: 20 }}>{i < seg.on ? '☑' : '☐'}</span><div className="t"><b>{x}</b></div></div>)}</div>
    </div>}
    {seg.on === 3 && <div className="n2-warn">Fakt: kursdagi Nest loyihasining <code>.env.example</code> faylida — <code>postgres://postgres:<b>password</b>@localhost:5432/…</code>. Sinf paroli shu bo'lsa, o'quvchi faylni o'zgartirmaydi.</div>}
    {seg.ver && <Psql title="terminal — sinf kompyuteri" lines={VER23} />}
  </>} />;
}

// ============================================================
//  25 · m4-03 xaritasi
// ============================================================
const MAP03 = [
  { t: 'Kirish', s: 's0–s1', d: "«SQL ko'rinishimi, NoSQL ko'rinishimi?» → «Ikkalasi ham to'g'ri — vazifaga bog'liq» · reja (5 qadam)", m: "Mongo bilan ishlagan bo'lsangiz — bir gap bilan ayting (3-ekran)" },
  { t: 'Ikki tur va shakl', s: 's2–s4', d: 'jadval / hujjat · kartalarni jadvalga joylash · test', m: 'jadvalda ustun turi oldindan, hujjatda erkin (5-ekran)' },
  { t: 'Kuchlar', s: 's5–s7', d: 'JOIN — id orqali bog\'lash · test · oxirgi telefon · chat oqimi (NoSQL — hajm)', m: "ON satri (16-ekran) · telefonni nima saqlashi (19-ekran)" },
  { t: 'Qaror', s: 's8–s12', d: "4 mezon: bog'lanish · shakl · ishonchlilik · hajm · test (bank) · nega PostgreSQL (5 sabab) · AI tavsiyasi · test", m: "«JSON ham saqlaydi» — jsonb misoli (21-ekran)" },
  { t: 'Mustahkamlash', s: 's13–s16', d: "moslashtirish (bank, chat, do'kon, loglar) · mif-buster · yakuniy · amaliyot · kartochkalar · yakun", m: 'amaliyotdagi 2 jadval — siz bugun yaratgan users / posts' },
];
const TIME03 = [['0–20', 'kirish, ikki tur va shakl'], ['20–45', 'kuchlar: JOIN, oxirgi telefon, chat'], ['45–65', 'qaror ko\'rsatkichi, nega PostgreSQL, AI'], ['65–85', 'moslashtirish, mif, yakuniy, amaliyot', 1], ['85–90', 'yakun']];
const S24 = mkS(25, [{ hl: [] }, { hl: [0, 1] }, { hl: [2] }, { hl: [3, 4] }, { hl: [], time: true }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => seg.time
    ? <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">m4-03 · 90 daqiqa (taklif)</div>
        <div style={{ display: 'grid', gap: 8 }}>{TIME03.map(([a, b, x]) => <div key={a} className={`mk-step${x ? ' hl' : ''}`}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 64 }}>{a}</span><div className="t">{b}</div></div>)}</div></div>
    : <div style={{ display: 'grid', gap: 8 }}>
        {MAP03.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
          <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{(seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
        </div>)}
      </div>} />;
}

// ============================================================
//  26 · O'quvchi darsidagi so'zlar
// ============================================================
const DICT25 = [
  ["jadval — «Excel jadvaliga o'xshaydi», har qatorda bir xil ustunlar", 'table · row · column', 's2'],
  ["hujjat — «papkadagi turli qog'ozlar kabi», { }", 'document (MongoDB, Firebase)', 's2, kartochkalar'],
  ["ikki jadvalni id orqali bog'lash", 'JOIN … ON …, tashqi kalit', 's5'],
  ["oxirgi telefon — «SQL bir lahzada faqat bittasiga sotadi», «SQL nazorati»", 'shartli UPDATE + qator qulfi; tranzaksiya', 's6, kartochkalar'],
  ["qaror ko'rsatkichi — 4 savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi, ulkan-oddiy-tez kerakmi", 'baza tanlash mezonlari', 's8, s15'],
  ["«NoSQL zamonaviyroq» — mif", "tanlov vazifaga bog'liq", 's14'],
  ['«JSON ham saqlaydi»', 'jsonb', 's10'],
];
const S25 = mkS(26, [{ rows: [] }, { rows: [0, 1] }, { rows: [2, 3, 4] }, { rows: [5, 6] }]);
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg, beat }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama</th><th>qayerdan</th></tr></thead><tbody>
      {DICT25.map(([a, b, c], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td><td style={{ color: T.ink3, fontSize: 12 }}>{c}</td></tr>)}
    </tbody></table>
    <Block at={3} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>Birga ayting: <b>«Excel jadvaliga o'xshaydi, ya'ni table»</b>. Farqini siz ko'rsatasiz: Excel qoidani tekshirmaydi, PostgreSQL bo'sh nomni ham, yo'q muallifni ham rad etadi.</div></Block>
  </div>} />;
}

// ============================================================
//  27 · Darsdagi soddalashtirishlar va o'quvchi savollari
// ============================================================
const SIMP26 = [
  { d: "Oxirgi telefonni «SQL nazorati — tranzaksiya» saqlaydi", a: "so'rovdagi shart (stock > 0) + qator qulfi; tranzaksiya — bir nechta ishni birga bajarish; Mongo ham bitta hujjatda bittaga sotdi", s: "darsdagi gap yetarli; kuchli o'quvchi so'rasa — «baza shartni qayta tekshiradi, ikkinchi xaridor kutadi»" },
  { d: "NoSQL'da «alohida hujjatlarni bog'lash qiyin»", a: "bog'lash bor (populate), lekin baza bog'lanishni qo'riqlamaydi: author: null xato bermay saqlandi", s: "«bog'lash mumkin, lekin to'g'riligini kod saqlaydi, baza emas»" },
];
const QA26 = [
  ['«Mongo yomonmi?»', "Yo'q. Chat, loglar kabi juda ko'p oddiy ma'lumotda qulay. Tanlov vazifaga bog'liq: buni qaror ko'rsatkichining 4 savoli bilan tekshiring."],
  ["«MySQL'dan farqi nima?»", "Ikkalasi ham SQL: jadval, JOIN, qoidalar bir xil g'oya. Kursda PostgreSQL, chunki keyingi darslardagi loyihalar shu bilan ishlaydi."],
  ["«Excel'ning o'zi-ku?»", "Ko'rinishi o'xshaydi. Lekin baza qoidani o'zi tekshiradi (bo'sh nom, yo'q muallif — rad) va bir vaqtda ko'p odam yozsa ham adashmaydi (oxirgi telefon)."],
  ['«Firebase nima?»', "Google'ning hujjatli bazasi, NoSQL; darsda MongoDB bilan birga misol."],
  ["«Nega id 1, 2, 3, Mongo'dagidek uzun emas?»", "SERIAL — o'zi o'sadigan raqam; Mongo'da _id ObjectId. Ikkalasi ham noyob."],
];
const S26 = mkS(27, [{ hl: [] }, { hl: [0] }, { hl: [1] }, { hl: [], qa: true }, { hl: [], qa: true }]);
function Screen26(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S26} scene={({ seg }) => <>
    <div style={{ display: 'grid', gap: 8 }}>{SIMP26.map((x, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
      <div className="t"><b>Darsda: {x.d}</b><div style={{ fontSize: 13 }}><b style={{ display: 'inline', color: T.green }}>Aslida:</b> {x.a}</div><div className="exp" style={{ color: T.accent, marginTop: 4 }}>Sinfda: {x.s}</div></div></div>)}</div>
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA26.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  28 · O'z-sinov — 8 savol (Nest-1/Nest-2 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[28].final;
function Screen27(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan ikkitasi sinf va o'quvchi darsi bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi sinf kompyuterlarini tayyorlab, m4-03 ni bemalol o'ta olasiz." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  29 · Yakun (M13): Barakalla → xulosa → uyga vazifa → eslatma → «Darsni yakunlash»
// ============================================================
const SUM28 = [
  { k: 'mongo', t: "Mongo ↔ PostgreSQL: collection — jadval, document — qator, ref — REFERENCES, populate — JOIN; qoida Mongo'da kodda, PostgreSQL'da jadvalda", st: ['jad'] },
  { k: 'inst', t: "O'rnatish: Windows — EDB o'rnatuvchisi, parol, port 5432, bin PATH'ga; Mac — Postgres.app; Homebrew bo'lsa createuser -s postgres", st: ['psql'] },
  { k: 'rule', t: "Baza o'zi tekshiradi: NOT NULL · UNIQUE · tashqi kalit · CHECK; xabar — qaysi jadval · qaysi qoida · qaysi qiymat (DETAIL)", st: ['rule'] },
  { k: 'join', t: "JOIN: ON'da tashqi kalit id'ga tenglanadi; xato ON — xatosiz, lekin noto'g'ri natija; LEFT JOIN — juftsizlar ham", st: ['join'] },
  { k: 'tx', t: "Oxirgi telefon: shart + qator qulfi → UPDATE 0; tranzaksiya — hammasi yoki hech narsa; jsonb — erkin qo'shimcha", st: ['jad', 'rule'] },
  { k: 'class', t: "Sinf: m4-06 dan oldin har kompyuterda psql -U postgres -c \"SELECT version();\"; m4-03 kodsiz — har blokda bitta qo'shimcha gapingiz bor", st: ['req', 'res'] },
];
const STATIONS28 = [['req', "So'rov", T.ink2], ['psql', 'psql', T.ink], ['rule', 'Qoidalar', T.accent], ['jad', 'Jadval', PG.pg], ['join', 'JOIN', T.purple], ['res', 'Javob', T.green]];
function SummaryMap28({ hl }) {
  const cur = SUM28.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — ma'lumotning yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 6 }}>
      {STATIONS28.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK28 = [
  { t: "Repo va g'oya: blog-db (yoki o'z nomingiz) · README.md — g'oya bir gapda + qaror ko'rsatkichining 4 savoliga javob (bog'langanmi, shakli qat'iymi, xato qimmatmi, ulkan-oddiy-tez kerakmi) + tanlov va sabab", c: [] },
  { t: "schema.sql: 2 bog'langan jadval — PRIMARY KEY, kamida bitta NOT NULL, bitta UNIQUE, REFERENCES → \\d jadvalda Foreign-key qatori", c: ['psql -U postgres -c "CREATE DATABASE <baza>;"', 'psql -U postgres -d <baza> -f schema.sql'] },
  { t: "data.sql: har jadvalga 3+ qator, bitta qator juftsiz (sardor kabi)", c: ['psql -U postgres -d <baza> -f data.sql'] },
  { t: "queries.sql: JOIN va LEFT JOIN — LEFT JOIN'da qatorlar JOIN'dan bittaga ko'p", c: ['psql -U postgres -d <baza> -f queries.sql'] },
  { t: "Ataylab buzing: yo'q id bilan INSERT → «violates foreign key constraint» → DETAIL satrini README'ga yozing", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "blog-db"', 'git push'] },
];
const CHEATSHEET28 = `# PostgreSQL-1 — mentor eslatmasi (Mongo'dan PostgreSQL'ga)
## Mongo ↔ PostgreSQL
collection = jadval (table) · document = qator (row) · maydon = ustun (column, turi bilan) · _id = id SERIAL PRIMARY KEY · ref = REFERENCES (tashqi kalit) · populate = JOIN · Schema (kodda) = CREATE TABLE (bazada) · required/unique = NOT NULL/UNIQUE · mongosh = psql
## O'rnatish
Windows: postgresql.org/download/windows → EDB installer 18 · Server + pgAdmin 4 + Command Line Tools (Stack Builder kerak emas) · parolni yozib qo'ying · port 5432 · Path'ga C:\\Program Files\\PostgreSQL\\18\\bin (yoki Start → SQL Shell (psql))
Mac: postgresapp.com → Applications → Initialize · PATH: sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp · parolsiz
Homebrew: role "postgres" does not exist → createuser -s postgres
## psql
psql -U postgres · -d <baza> · -c "<so'rov>" · -f fayl.sql · \\l bazalar · \\c blog o'tish · \\dt jadvallar · \\d posts tuzilish · \\q chiqish
SQL — nuqta-vergul bilan; postgres-# — davomini kutyapti; =*# — tranzaksiya ochiq; =!# — tranzaksiyada xato
## Jadval va qoidalar
CREATE DATABASE blog; · CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE); · CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), izoh TEXT NOT NULL);
Xabarni o'qish: qaysi jadval · qaysi qoida (posts_user_id_fkey) · qaysi qiymat (DETAIL: Key (user_id)=(99))
## JOIN
SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.user_id; · LEFT JOIN — chapdagining hammasi · ON users.id = posts.id — xato yo'q, natija noto'g'ri
## Ishonchlilik
Oxirgi telefon: UPDATE … WHERE id = 1 AND stock > 0 — 2-xaridor kutadi, keyin UPDATE 0 · CHECK (stock >= 0) — ikkinchi himoya
BEGIN … COMMIT — hammasi yoki hech narsa; ichida xato bo'lsa COMMIT → ROLLBACK · jsonb: extra->>'rang'
## Ulanish xatolari
password authentication failed → parol · Connection refused / No such file (socket) → PostgreSQL'ni ishga tushiring (Windows: Services → postgresql-x64-18 → Start · Mac: Postgres.app → Start) · relation … does not exist → prompt'dagi baza, \\c blog · 'psql' is not recognized → PATH, yangi terminal
## Sinf kompyuterlari (m4-03 dan keyin, m4-06 dan oldin)
PostgreSQL 18 · psql buyrug'i PATH'da · bitta sinf paroli (Nest loyihasi .env.example'da — password) · psql -U postgres -c "SELECT version();" — qayta yoqilgandan keyin ham
## m4-03 va ikki soddalashtirish
kodsiz, 21 ekran: kirish · ikki tur va shakl · kuchlar (JOIN, oxirgi telefon, chat) · qaror (4 mezon, nega PostgreSQL, AI) · mustahkamlash
«tranzaksiya saqlaydi» — aslida shart + qator qulfi · «NoSQL'da bog'lash qiyin» — bog'lash bor, baza qo'riqlamaydi
## O'quvchi darsidagi so'zlar
Excel jadvali = table · papkadagi turli qog'ozlar = document · id orqali bog'lash = JOIN · SQL nazorati = tranzaksiya · qaror ko'rsatkichi = 4 mezon
## Sizning uyga vazifangiz
blog-db: README (4 mezon) + schema.sql + data.sql + queries.sql (JOIN, LEFT JOIN) + FK xatosining DETAIL satri → GitHub → repo linki platformadagi uyga vazifaga`;
const s28Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Mongo ↔ PostgreSQL: <b>qoida Mongo'da kodda, PostgreSQL'da jadvalda</b>", "Birinchi: siz bilgan Mongo tushunchalarining hammasi PostgreSQL'da bor. Collection jadval, document qator, ref tashqi kalit, populate JOIN. Asosiy farq: qoida Mongo'da kodda, PostgreSQL'da jadvalning o'zida.", { hl: 'mongo' }),
  sg('b2', "O'rnatish: Windows'da <b>parol va PATH</b>, Mac'da Postgres.app", "Ikkinchi: o'rnatish. Windows'da rasmiy o'rnatuvchi, parolni yozib qo'yish va bin papkasini Path'ga qo'shish. Mac'da Postgres.app. Homebrew bo'lsa, createuser minus s postgres.", { hl: 'inst' }),
  sg('b3', "Baza o'zi tekshiradi — xabar <b>jadval, qoida va qiymatni</b> aytadi", "Uchinchi: qoida buzilsa baza yozuvni saqlamaydi va sababni o'zi aytadi. Xabarni uch savol bilan o'qing: qaysi jadval, qaysi qoida, qaysi qiymat. Javob detail qatorida.", { hl: 'rule' }),
  sg('b4', "JOIN'da hammasi <b>ON satrida</b>; LEFT JOIN — juftsizlar ham", "To'rtinchi: JOIN'da hammasi on satrida, tashqi kalit boshqa jadvalning id'siga tenglanadi. Xato on xato bermaydi, lekin natijani buzadi. Left join juftsiz qatorlarni ham chiqaradi.", { hl: 'join' }),
  sg('b5', "Oxirgi telefon: <b>shart va qator qulfi</b>; tranzaksiya — hammasi yoki hech narsa", "Beshinchi: oxirgi telefonni so'rovdagi shart va qator qulfi saqlaydi, ikkinchi xaridor update nol oladi. Bir nechta jadval birga o'zgarsa, tranzaksiya: xato bo'lsa hammasi bekor.", { hl: 'tx' }),
  sg('b6', "Sinf: m4-06 dan oldin <b>har kompyuterda psql</b> ochilsin", "Oltinchi, sinf uchun eng muhimi: m4-06 dan oldin har sinf kompyuterida PostgreSQL ishlab tursin, bitta parol bilan. m4-03 kodsiz, lekin har blokda sizning bitta qo'shimcha gapingiz bor.", { hl: 'class' }),
  sg('hw', "<b>Uyga vazifa</b>: o'quvchi amaliyotini o'zingiz — haqiqiy bazada", "Uyga vazifa: o'quvchining amaliyotini o'zingiz to'liq qiling, lekin haqiqiy bazada. Bitta loyiha g'oyasini oling, masalan onlayn do'kon. README'da to'rt savolga javob yozing va bazani tanlang. Keyin uchta fayl: schema'da ikki bog'langan jadval, data'da ma'lumot, queries'da JOIN va left join. Bir marta tashqi kalit xatosini ataylab chiqaring.", { hl: 'hw' }),
  sg('hw2', "Topshirish: GitHub'dagi repo linkini <b>platformadagi uyga vazifaga</b> qo'ying — boshqa hech narsa kerak emas", "Xatoning detail qatorini README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: lug'at, o'rnatish, psql, qoidalar, JOIN — bir sahifada", "Pastda bir sahifalik eslatma: Mongo lug'ati, o'rnatish yo'llari, psql buyruqlari, qoidalar, JOIN, oxirgi telefon, ulanish xatolari va sinf kompyuterlari ro'yxati. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET28;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'postgresql-1-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s28Segments(passed), [passed]);
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
            <SummaryMap28 hl={hl} />
            <div className="mk-plan">{SUM28.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK28.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> README'da 4 javob va asoslangan tanlov · schema.sql'da REFERENCES · queries.sql'da JOIN va LEFT JOIN · README'da haqiqiy DETAIL satri. <code>-f</code> bilan yurgizilganda xato oldiga <code>psql:schema.sql:N:</code> qo'shiladi — bu qaysi satr ekanini aytadi.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>PostgreSQL: CRUD so'rovlar</div><div style={{ fontSize: 13.5, color: T.ink2 }}>INSERT, SELECT, UPDATE, DELETE — o'quvchi m4-06 darsi va m4-08 AvtoIjara loyihasi uchun</div></div>
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
        {["Jami taxminan 1 soat 10 daqiqa: ovoz ~30 daqiqa · to'rt amaliyot 35–45 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 15-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: kompyuterda internet (PostgreSQL'ni yuklab olish uchun) · Windows yoki macOS · terminal", "Loyiha: blog bazasi — users va posts, o'quvchi m4-03 amaliyotidagi namuna"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, ScreenSqlNosql, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP1, Screen10, Screen11, Screen12, Screen13, ScreenP2, Screen15, Screen16, ScreenP3, Screen18, Screen19, Screen20, Screen21, ScreenP4, Screen23, Screen24, Screen25, Screen26, Screen27, Screen28];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function PgIntroMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
