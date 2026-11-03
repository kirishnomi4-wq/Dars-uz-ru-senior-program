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
//  TELEGRAF+PG MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-matn.py (manba: 17-TgPg-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Telegraf",
  "title": "Bot javob beradi. Lekin bir daqiqa oldingi gapni eslaydimi?",
  "seg": [
   [
    "a",
    "Telegraf'ni bilasiz — bugun botga xotira beramiz: <b>holat bazada</b>",
    "Assalomu alaykum. Telegraf'ni bilasiz: handler, reply, BotFather. Bugun botga xotira beramiz: suhbat qaysi bosqichda ekanini bot eslab qolsin, server qayta ishga tushsa ham."
   ],
   [
    "b",
    "Avval holatsiz bot, keyin xotiradagi holat va <b>nega u yo'qoladi</b>",
    "Avval holatsiz bot qanday adashishini ko'ramiz. Keyin holatni dastur xotirasida saqlaymiz va qayta ishga tushirganda nima bo'lishini ko'ramiz."
   ],
   [
    "c",
    "Keyin PostgreSQL'da holat, uni <b>ataylab buzamiz</b> va o'quvchi reposini ishga tushiramiz",
    "Keyin holatni PostgreSQL'ga ko'chiramiz, uni ataylab buzamiz va o'quvchi reposini o'z kompyuteringizda ishga tushiramiz."
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
  "kicker": "1-bosqich · holat",
  "title": "«Pepperoni» — «Tushunmadim»: bot o'z savolini eslamaydi",
  "seg": [
   [
    "a",
    "O'quvchi darsi shu suhbatdan boshlanadi: bot savol beradi, <b>javobni tushunmaydi</b>",
    "O'quvchi darsi shu suhbatdan boshlanadi. Aziza pitsa buyurtma qilmoqchi. Bot qaysi pitsa deb so'raydi, Aziza pepperoni deydi, bot esa tushunmadim deydi."
   ],
   [
    "b",
    "Har xabar alohida keladi: handler <b>oldingi xabarni bilmaydi</b>",
    "Nega? Telegraf'da har xabar alohida keladi va handler faqat shu xabarni ko'radi. Pepperoni so'zi kelganda bot o'zi pitsa so'raganini bilmaydi."
   ],
   [
    "c",
    "Javob matnlari <b>haqiqiy Telegraf</b> handler'idan — Telegram oynasi esa maket",
    "Ekrandagi javoblar haqiqiy Telegraf handler'idan olingan. Telegram serveriga ulanmadik: xabarni kod bilan berdik va botning javobini ushladik. Chat oynasi esa maket."
   ],
   [
    "d",
    "Xulosa: holatsiz bot har xabarni <b>birinchi xabardek</b> ko'radi — suhbat qayerdaligini bilmaydi",
    "Xulosa: holatsiz bot har xabarni birinchi xabardek ko'radi. Suhbat qayerda turganini biladigan yozuv kerak. Uni holat deymiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · holat",
  "title": "holat[chat.id]: bot savolini eslab qoldi — suhbat davom etdi",
  "seg": [
   [
    "a",
    "Holatsiz botdan keyin eng oddiy yechim: <b>holatni obyektda saqlash</b>",
    "Eng oddiy yechim: holatni oddiy obyektda saqlash. Kalit chat id, qiymat suhbat bosqichi, masalan pitsa kutyapman."
   ],
   [
    "b",
    "Har xabarda bot <b>avval holatga qaraydi</b>, keyin javob beradi va holatni o'zgartiradi",
    "Endi har xabarda bot avval holatga qaraydi. Pitsa kutayotgan bo'lsa, kelgan so'z pitsa nomi. Javob beradi va holatni o'lcham kutyapman qiladi."
   ],
   [
    "c",
    "Natija: «Pepperoni — yaxshi tanlov!», xotirada esa holat <b><code>OLCHAM_KUTYAPMAN</code></b> bo'ldi",
    "Natija: pepperoni, yaxshi tanlov, qaysi o'lchamda. Suhbat davom etdi. Xotirada esa Azizaning holati: o'lcham kutyapman."
   ],
   [
    "d",
    "Xulosa: holat bilan bot suhbatni davom ettiradi — lekin bu holat <b>dastur xotirasida</b> turibdi",
    "Xulosa: holat bilan bot suhbatni davom ettiradi. Lekin bu obyekt dastur xotirasida, RAM'da turibdi. Keyingi ekranda botni qayta ishga tushiramiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · holat",
  "title": "Bot qayta ishga tushdi — «Katta» ga «Salom! Qaysi pitsa?»",
  "seg": [
   [
    "a",
    "Server vaqti-vaqti bilan <b>qayta ishga tushadi</b>: yangi versiya yoki nosozlikdan keyin",
    "Bot serveri vaqti-vaqti bilan qayta ishga tushadi: yangi versiya chiqqanda yoki nosozlikdan keyin. Biz ham botni to'xtatib, qayta ishga tushirdik."
   ],
   [
    "b",
    "Aziza «Katta» deb yozdi — bot uni <b>yangi mijozdek</b> kutib oldi",
    "Aziza o'lchamni yozdi: katta. Bot esa salom, qaysi pitsa deydi. Obyekt bo'sh boshlandi, Azizaning holati yo'q, bot uni yangi mijoz deb o'yladi."
   ],
   [
    "c",
    "RAM — dastur yashaganicha; jarayon tugasa, <b>obyekt ham yo'qoladi</b>",
    "Sabab: obyekt dastur xotirasida, jarayon tugasa u ham yo'qoladi. O'quvchi darsi buni ikki quti bilan ko'rsatadi: dastur xotirasi vaqtinchalik, PostgreSQL doimiy."
   ],
   [
    "d",
    "Xulosa: qayta ishga tushirishdan keyin faqat <b>bazaga yozilgan holat</b> qoladi",
    "Xulosa: qayta ishga tushirishdan keyin faqat bazaga yozilgan holat qoladi. Shuning uchun haqiqiy botda holat PostgreSQL'da turadi."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Bot qayta ishga tushdi. Qaysi holat saqlanib qoladi?",
  "q": "Qayta ishga tushirishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Bot qayta ishga tushdi. Qaysi holat saqlanib qoladi? Variantni tanlang.",
  "ok": "To'g'ri, PostgreSQL'dagisi. Baza ma'lumotni diskka yozadi, bot qayta ishga tushsa ham u joyida. Obyekt va o'zgaruvchi dastur xotirasida, ular yo'qoladi. Demak, bot qayta ishga tushgandan keyin ham kerak bo'ladigan holat bazaga yoziladi.",
  "okShort": "PostgreSQL — diskda, qoladi. Obyekt — RAM'da, yo'qoladi.",
  "hint": "Qaysi biri diskka yoziladi?",
  "correct": 1,
  "opts": [
   "Koddagi obyektga yozilgan holat",
   "PostgreSQL'dagi users jadvaliga yozilgan holat",
   "Handler ichidagi o'zgaruvchi",
   "Hech qaysi"
  ],
  "wrong": {
   "0": "Obyekt RAM'da: qayta ishga tushganda bo'sh boshlanadi (4-ekran).",
   "2": "Handler o'zgaruvchisi keyingi xabargacha ham yashamaydi.",
   "3": "Bazaga yozilgani qoladi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · alohida",
  "title": "Bitta tanlov o'zgaruvchisi: Aziza Jasurning Margaritasini oldi",
  "seg": [
   [
    "a",
    "Bitta mijoz bilan ishladi — endi <b>ikki mijoz</b> bir vaqtda yozadi",
    "Bitta mijoz bilan holat ishladi. Lekin botga bir vaqtda o'nlab odam yozadi. O'quvchi darsidagi holat: Aziza va Jasur."
   ],
   [
    "b",
    "Holat bitta umumiy o'zgaruvchida: har yangi xabar oldingisining <b>ustiga yozadi</b>",
    "Bu kodda tanlov bitta umumiy o'zgaruvchida, hamma uchun bitta. Aziza pepperoni yozdi, keyin Jasur margarita yozdi va uning ustiga yozildi."
   ],
   [
    "c",
    "Aziza «Katta» deydi — bot <b>«Buyurtma: Margarita, katta»</b> javobini beradi",
    "Aziza katta deb yozdi va javob oldi: buyurtma margarita, katta. Aziza margarita so'ramagan. Xato hech qayerda chiqmadi, buyurtma xato bermay aralashdi."
   ],
   [
    "d",
    "Xulosa: umumiy o'zgaruvchi — ikki mijozning suhbati <b>xato bermay aralashadi</b>",
    "Xulosa: umumiy o'zgaruvchida ikki mijozning suhbati xato bermay aralashadi. Har mijozning holati alohida turishi kerak."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · alohida",
  "title": "Har mijozning holati o'z chat.id si ostida: obyekt kaliti yoki jadval qatori",
  "seg": [
   [
    "a",
    "Har mijozning Telegram raqami bor: shaxsiy chatda u <b><code>ctx.chat.id</code></b>",
    "Aralashmaslik uchun har mijozni raqami bilan ajratamiz. Telegram'da har mijozning raqami bor, shaxsiy chatda u ctx chat id."
   ],
   [
    "b",
    "3-ekrandagi obyekt shunday edi: kalit — <code>chat.id</code>, har mijozga <b>o'z holati</b>",
    "Uchinchi ekrandagi obyekt aynan shunday edi: kalit chat id, qiymat holat. Azizaning holati Jasurnikiga tegmaydi."
   ],
   [
    "c",
    "Bazada ham xuddi shu: har mijozga <b>bitta qator</b>, <code>telegram_id</code> ustuni bilan topiladi",
    "Bazada ham xuddi shunday: users jadvalida har mijozga bitta qator. Bot qatorni telegram id ustuni bilan topadi."
   ],
   [
    "d",
    "Xulosa: sessiya — bitta mijozning alohida holati; kaliti — <b><code>chat.id</code></b>",
    "Xulosa: bitta mijozning alohida holati sessiya deyiladi, uning kaliti chat id. O'quvchi darsi shu so'zni ishlatadi."
   ]
  ]
 },
 "8": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Umumiy tanlov: Aziza «Pepperoni», Jasur «Margarita», Aziza «Katta». Azizaga qanday javob keladi?",
  "q": "Aralashishni ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Tanlov bitta umumiy o'zgaruvchida. Aziza pepperoni, Jasur margarita, keyin Aziza katta deb yozdi. Azizaga qanday javob keladi? Variantni tanlang.",
  "ok": "To'g'ri, margarita. Jasurning xabari umumiy o'zgaruvchining ustiga yozildi. Xato chiqmaydi, shuning uchun bunday xatoni sezish qiyin. Demak, har mijozning holati uning chat id'si bo'yicha alohida saqlanishi kerak.",
  "okShort": "Margarita — Jasurniki ustiga yozildi, xato chiqmadi.",
  "hint": "Oxirgi marta tanlov ga kim yozdi?",
  "correct": 2,
  "opts": [
   "«Buyurtma: Pepperoni, katta»",
   "Xato chiqadi, bot to'xtaydi",
   "«Buyurtma: Margarita, katta»",
   "Bot javob bermaydi"
  ],
  "wrong": {
   "0": "Pepperoni Jasurning xabarida ustidan yozildi.",
   "1": "Kod to'g'ri ishlaydi — faqat holat umumiy.",
   "3": "Handler javob beradi, lekin noto'g'ri pitsa bilan."
  }
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · PostgreSQL",
  "title": "telegram_id BIGINT NOT NULL UNIQUE: Telegram raqami 32 bitga sig'maydi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi jadval: har mijoz — <b>bitta qator</b>, holati shu qatorda",
    "Endi holatni PostgreSQL'ga ko'chiramiz. O'quvchi darsidagi jadval: users. Har mijoz bitta qator, uning ismi va holati shu qatorda."
   ],
   [
    "b",
    "<code>telegram_id</code> — <code>BIGINT</code>: Telegram hujjati raqam <b>32 bitdan katta</b> bo'lishi mumkin deydi",
    "Telegram id ustuni big int. Nega oddiy int emas? Telegram Bot API hujjati aytadi: bu raqam o'ttiz ikki bitdan katta bo'lishi mumkin. Oddiy int esa o'ttiz ikki bit."
   ],
   [
    "c",
    "<code>NOT NULL UNIQUE</code> — har mijozga <b>faqat bitta qator</b>, ikkinchisini baza o'zi rad etadi",
    "Not null unique: raqamsiz qator yo'q va bitta mijozga faqat bitta qator. Ikkinchi qatorni baza o'zi rad etadi, buni o'n beshinchi ekranda ko'ramiz."
   ],
   [
    "d",
    "Xulosa: jadval tayyor — <code>telegram_id</code> bilan qator topiladi, <code>holat</code> ustunida <b>suhbat bosqichi</b>",
    "Xulosa: jadval tayyor. Telegram id bilan mijozning qatori topiladi, holat ustunida suhbat bosqichi turadi."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · PostgreSQL",
  "title": "Har xabarda: avval o'qish, yangi mijozga INSERT, keyin yangi holat UPDATE bilan",
  "seg": [
   [
    "a",
    "Har xabarda birinchi ish — <b>SELECT</b>: bu mijozning qatori bormi, holati qanday",
    "Bazali bot har xabarda birinchi bo'lib o'qiydi: select, telegram id shu raqam bo'lgan qator. Qator bor bo'lsa, holat ma'lum."
   ],
   [
    "b",
    "Qator yo'q bo'lsa — yangi mijoz: <b>INSERT</b>, holat <code>ISM_KUTYAPMAN</code>, «Ismingiz nima?»",
    "Qator topilmasa, bu yangi mijoz. Insert bilan qator qo'shamiz, holat ism kutyapman. Javob: ismingiz nima."
   ],
   [
    "c",
    "Holat <code>ISM_KUTYAPMAN</code> bo'lsa — kelgan matn ism: <b>UPDATE</b>, holat <code>TAYYOR</code>",
    "Keyingi xabarda holat ism kutyapman bo'lsa, kelgan matn ism. Update bilan ismni yozamiz va holatni tayyor qilamiz."
   ],
   [
    "d",
    "Xulosa: SELECT → (yo'q bo'lsa INSERT) → javob → UPDATE; <b>tartibni almashtirib</b> bo'lmaydi",
    "Xulosa: avval select, yo'q bo'lsa insert, keyin javob va update. O'quvchi darsida bu tartib bo'laklardan yig'iladi: update select'dan oldin bo'lsa, bot holatni bilmay turib yozib yuboradi."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · PostgreSQL",
  "title": "Bot qayta ishga tushdi — «Yana salom, Aziza!», Jasur o'z joyidan davom etdi",
  "seg": [
   [
    "a",
    "4-ekrandagi sinovni takrorlaymiz: bot to'xtaydi va <b>qayta ishga tushadi</b>",
    "To'rtinchi ekrandagi sinovni bazali bot bilan takrorlaymiz. Aziza ismini aytdi, Jasur esa endigina start bosdi. Botni to'xtatib, qayta ishga tushiramiz."
   ],
   [
    "b",
    "Aziza /start — <b>«Yana salom, Aziza!»</b>: ism bazadan o'qildi",
    "Aziza start bosdi: yana salom, Aziza. Bot ismni bazadan o'qidi, qayta ishga tushirish hech narsani o'chirmadi."
   ],
   [
    "c",
    "Jasur ismini yozdi — bot uni ism deb tushundi, chunki <b>holat bazada qolgan</b>",
    "Jasur qayta ishga tushgandan keyin ismini yozdi. Bot uni ism deb tushundi, chunki uning holati, ism kutyapman, bazada qolgan edi."
   ],
   [
    "d",
    "Xulosa: holat bazada — qayta ishga tushirish ham, ikki mijoz ham <b>muammo emas</b>",
    "Xulosa: holat bazada bo'lsa, qayta ishga tushirish ham, ikki mijoz ham muammo emas. Endi buni o'z botingizda qilasiz."
   ]
  ]
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'z botingiz: users jadvali, ism va qayta ishga tushirish",
  "seg": [
   [
    "a",
    "Endi siz: kichik bot yasaysiz, u ismingizni <b>bazada eslab qoladi</b>",
    "Endi navbat sizga. Kichik bot yasaysiz, u ismingizni bazada eslab qoladi. Baza: PostgreSQL birinchi darsda o'rnatgan PostgreSQL'ingiz. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: jadval va bot fayli — <b>BotFather tokeni</b>, lokal baza",
    "Birinchi: PostgreSQL terminalida botdb bazasi va users jadvali. Ikkinchi: yangi papka, telegraf va pg paketlari, bot js fayli. Token BotFather'dan, o'zingiz bilasiz."
   ],
   [
    "c",
    "3–4-qadam: /start va ism, keyin <b>Ctrl+C</b> va qayta ishga tushirish; isbot — javob matni",
    "Uchinchi: botni yoqing, start bosing, ismingizni yozing. To'rtinchi: Ctrl C bilan to'xtating, yana yoqing, start bosing. Isbot maydoniga botning javobini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz ismingizni bazada saqlaydi va qayta ishga tushgandan keyin ham uni eslab qoladi."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "telegram_id INTEGER — ERROR: integer out of range",
  "seg": [
   [
    "a",
    "Birinchi buzish: o'quvchi <code>BIGINT</code> o'rniga odatdagi <b><code>INTEGER</code></b> yozadi",
    "Birinchi buzish, sinfda albatta chiqadi. O'quvchi yoki AI telegram id uchun big int emas, odatdagi integer yozadi."
   ],
   [
    "b",
    "Katta raqamli mijoz yozdi — <b><code>integer out of range</code></b>, qator saqlanmadi",
    "Besh milliard bilan boshlanadigan raqamli mijoz yozdi. Natija: integer out of range. Qator saqlanmadi va bot bu mijozga javob bera olmaydi."
   ],
   [
    "c",
    "Kichik raqamli akkaunt bilan sinasa — hammasi ishlaydi, <b>xato keyin chiqadi</b>",
    "Xavfli tomoni: o'quvchining o'z akkaunti eski bo'lsa, raqami kichik va hammasi ishlaydi. Xato boshqa mijoz kelganda chiqadi. Tuzatish: ustun big int."
   ],
   [
    "d",
    "Xulosa: <code>telegram_id</code> — <b>doim <code>BIGINT</code></b>; <code>INTEGER</code> bilan xato yangi mijozda chiqadi",
    "Xulosa: telegram id doim big int. Tuzatilgan jadvalda shu raqam saqlandi, to'qqizinchi ekrandagi jadval aynan shunday."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "node-pg BIGINTni matn qaytaradi: '5123456789' === 5123456789 — false",
  "seg": [
   [
    "a",
    "Ikkinchi tuzoq: bazadan o'qilgan <code>telegram_id</code> <b>son emas, matn</b>",
    "Ikkinchi tuzoq yashirinroq. Bazadan o'qilgan telegram id son emas, matn bo'lib keladi. Node pg big int'ni JavaScript soniga aylantirmaydi."
   ],
   [
    "b",
    "Natija: <code>===</code> bilan solishtirish <b><code>false</code></b> — masalan admin tekshiruvi ishlamaydi",
    "Natija: uch tenglik bilan ctx chat id ga solishtirsangiz, false. Masalan, admin raqamini shunday tekshirsa, bot adminni tanimaydi va xato chiqmaydi."
   ],
   [
    "c",
    "O'quvchi reposida entity'da <code>telegram_id: string</code> — <b>muallif buni bilgan</b>",
    "O'quvchi reposida entity'da telegram id string deb yozilgan, servisda esa raqam string'ga aylantirib qidiriladi. Bu to'g'ri qaror: TypeORM ham big int'ni matn qaytaradi."
   ],
   [
    "d",
    "Xulosa: bazadagi <code>telegram_id</code> — matn; solishtirishdan oldin <b><code>Number()</code></b> yoki <b><code>String()</code></b>",
    "Xulosa: bazadan kelgan telegram id matn. Solishtirishdan oldin ikkalasini bir turga keltiring: Number yoki String. Tuzatilganda natija true."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Ikkinchi /start'da yana INSERT — duplicate key value violates unique constraint",
  "seg": [
   [
    "a",
    "Uchinchi buzish: /start har safar INSERT qiladi, <b>SELECT yo'q</b>",
    "Uchinchi buzish: o'quvchi start handler'ida faqat insert yozadi, avval select qilmaydi. Birinchi start ishlaydi."
   ],
   [
    "b",
    "Ikkinchi /start — <code>duplicate key … already exists</code>: <b>UNIQUE uni to'xtatdi</b>",
    "Ikkinchi start'da baza rad etadi: duplicate key, already exists. To'qqizinchi ekrandagi unique aynan shu yerda ishladi: bitta mijozga ikkita qator bo'lmaydi."
   ],
   [
    "c",
    "Xabar <b><code>DETAIL</code></b> qatorida: qaysi ustun va qaysi raqam takrorlandi",
    "Xabarni o'qing: detail qatorida qaysi ustun va qaysi raqam takrorlangani yozilgan. Telegram id, besh milliard bir yuz yigirma uch million. Demak, kodda select yo'q."
   ],
   [
    "d",
    "Xulosa: tuzatish — <b>avval SELECT</b>, qator topilsa INSERT qilinmaydi",
    "Xulosa: tuzatish o'ninchi ekrandagi oqim: avval select, topilsa insert qilinmaydi. Tuzatilgan bot ikkinchi start'ga yana salom deydi."
   ]
  ]
 },
 "16": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Yangi mijoz yozdi — ERROR: integer out of range",
  "q": "Buzishlarni ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Yangi mijoz yozdi va baza integer out of range dedi. Sabab bo'lgan satrni bosing.",
  "ok": "To'g'ri, uchinchi satr. Integer o'ttiz ikki bit, Telegram raqami esa undan katta bo'lishi mumkin. Big int bo'lsa saqlanadi, tuzatilgan jadval ekranda ko'rinib turibdi. Demak, Telegram raqami saqlanadigan ustun doim big int bo'ladi.",
  "okShort": "3-satr: <code>INTEGER</code> — 32 bit. To'g'risi <code>BIGINT</code>.",
  "hint": "Xabar raqam turidan: qaysi satr raqamni saqlaydi?",
  "task": "Qoida: Telegram raqami 32 bitdan katta bo'lishi mumkin. Bu jadvalda yangi mijozning raqami saqlanmadi: <code>integer out of range</code>. <b>Shu xatoga sabab bo'lgan satrni bosing.</b>"
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "INTEGER va takror INSERT — xabarlarni o'z bazangizda o'qing",
  "seg": [
   [
    "a",
    "Endi siz: o'z bazangizda <b>ikki xatoni ataylab</b> chiqarasiz va xabarlarni o'qiysiz",
    "Endi o'z bazangizda ikki xatoni ataylab chiqarasiz. O'n daqiqa. Har xabarni o'qing, o'quvchi aynan shularni ko'rsatadi."
   ],
   [
    "b",
    "1–2-qadam: <code>INTEGER</code> jadval va katta raqam — <b><code>integer out of range</code></b>",
    "Birinchi: botdb'da integer ustunli sinov jadvali. Ikkinchi: besh milliard bilan boshlanadigan raqamni qo'shing va xabarni o'qing."
   ],
   [
    "c",
    "3–4-qadam: <code>users</code> ga <b>takror INSERT</b>, keyin sinov jadvalini o'chirish; isbot — xabar",
    "Uchinchi: users jadvalingizga o'z raqamingizni yana bir marta insert qiling, duplicate key chiqadi. To'rtinchi: sinov jadvalini o'chiring. Isbot maydoniga ikkinchi qadamdagi xatoni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz integer out of range va duplicate key xabarlarini o'z bazangizda ko'rgan bo'lasiz va o'quvchida chiqqanda darhol taniysiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi reposi",
  "title": "TelegramBotNest: entity, topOrYarat va holat — xuddi shu oqim, TypeORM bilan",
  "seg": [
   [
    "a",
    "O'quvchi amaliyoti TelegramBotNest reposida: AI shu kodni yozadi, tayyor yechim <b><code>dars-04-done</code></b>",
    "O'quvchi amaliyoti TelegramBotNest reposida. O'quvchi AI'ga prompt beradi, tayyor yechim esa dars to'rt done tegida. Shu kodni ochamiz."
   ],
   [
    "b",
    "Entity: <code>telegram_id</code> — <b><code>bigint</code></b>, <code>unique</code>; <code>holat</code> — default <code>'yangi'</code>",
    "Entity'da telegram id big int va unique, ism bo'sh bo'lishi mumkin, holat boshida yangi. Jadvalni TypeORM o'zi yaratadi, synchronize yoqilgan."
   ],
   [
    "c",
    "<b><code>topOrYarat</code></b> — SELECT va kerak bo'lsa INSERT; handler holatga qarab javob beradi",
    "Top yoki yarat: avval qidiradi, topilmasa qator qo'shadi. Handler esa holatga qaraydi: ism kutilmoqda bo'lsa, matnni ism qiladi. O'ninchi ekrandagi oqimning o'zi."
   ],
   [
    "d",
    "Xulosa: shu kodni <b>haqiqiy PostgreSQL</b> bilan yurgizdik — qayta ishga tushgach «Yana salom»",
    "Xulosa: shu repo kodini haqiqiy PostgreSQL bilan yurgizdik. Qayta ishga tushgandan keyin yana salom, Aziza. Ikki mijoz alohida qoldi."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi reposi",
  "title": "«Server ishlayapti», lekin «Telegram ulanmadi: 401» — bot javob bermaydi",
  "seg": [
   [
    "a",
    "Sinfda eng ko'p chiqadigan holat: o'quvchi <b>«bot javob bermayapti»</b> deydi",
    "Repo kodini ko'rdik, endi sinfda eng ko'p chiqadigan holat. O'quvchi bot javob bermayapti deydi. Terminalda server ishlayapti yozuvi turibdi."
   ],
   [
    "b",
    "Ikki satrni o'qing: server ishlaydi, Telegram esa <b><code>401: Unauthorized</code></b>",
    "Ikki satrni birga o'qing. Server uch ming portda ishlayapti, lekin Telegram ulanmadi, to'rt yuz bir. Token noto'g'ri: server ishlaydi, bot esa javob bermaydi. Biz soxta token bilan sinadik."
   ],
   [
    "c",
    "<code>.env</code> yo'q bo'lsa server umuman yonmaydi: <b><code>DATABASE_URL topilmadi</code></b>",
    "Env fayli yo'q bo'lsa, server umuman yonmaydi: database url topilmadi. Bu xabarni repo muallifi o'zi yozgan, nima qilishni ham aytadi."
   ],
   [
    "d",
    "Xulosa: «bot javob bermaydi» bo'lsa — avval <b>«Telegram bot ulandi»</b> satri bormi, qarang",
    "Xulosa: bot javob bermasa, terminalda Telegram bot ulandi satrini qidiring. Yo'q bo'lsa, uning o'rnidagi xato sababni aytadi. Repo README'sida xatolar jadvali ham bor."
   ]
  ]
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "dars-04-done ni o'z kompyuteringizda: lokal baza, o'z tokeningiz",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi yechimini <b>o'z kompyuteringizda</b> ishga tushirasiz",
    "Oxirgi amaliyot: o'quvchi yechimini o'z kompyuteringizda ishga tushirasiz. Neon o'rniga lokal PostgreSQL. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: clone, <code>dars-04-done</code>, <code>npm ci</code>; <code>.env</code> — <b>token va lokal baza</b>",
    "Birinchi: clone, dars to'rt done, npm ci. Ikkinchi: env fayli: o'z tokeningiz va lokal bazaning manzili. Bazani avval yarating."
   ],
   [
    "c",
    "3–4-qadam: /start, ism, qayta ishga tushirish; isbot — <b><code>holat</code> ustuni</b>",
    "Uchinchi: npm run start, Telegram'da start va ismingiz. To'rtinchi: qayta ishga tushiring, yana start. Isbot maydoniga PostgreSQL terminalidagi holat ustuni qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi yechimi sizning kompyuteringizda ishlaydi va siz uning holatini bazadan o'qiy olasiz."
   ]
  ]
 },
 "21": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Terminal: «Server 3000-portda ishlayapti» va «Telegram ulanmadi: 401: Unauthorized». Sabab?",
  "q": "Repo xatolarini ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Server ishlayapti, lekin Telegram ulanmadi, to'rt yuz bir. Sabab nima? Variantni tanlang.",
  "ok": "To'g'ri, token. To'rt yuz bir, ruxsat yo'q: Telegram tokenni tanimadi. Server va baza ishlayapti, shuning uchun server ishlayapti yozuvi bor. Tokenni BotFather'dan qayta nusxalang. Demak, server ishga tushgan, lekin bot javob bermasa, birinchi navbatda tokenni tekshiring.",
  "okShort": "401 — token noto'g'ri; server va baza ishlayapti.",
  "hint": "401 — kim kimni tanimadi?",
  "correct": 3,
  "opts": [
   "PostgreSQL ishlamayapti",
   "Port 3000 band",
   "users jadvali yo'q",
   "BOT_TOKEN noto'g'ri"
  ],
  "wrong": {
   "0": "Baza ishlamasa server yonmaydi.",
   "1": "Port band bo'lsa «Server ishlayapti» chiqmaydi.",
   "2": "TypeORM jadvalni o'zi yaratadi (synchronize)."
  }
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m5-04 · «Bot eslab qoladi»",
  "title": "m5-04: AvtoPizza, ikki quti va users jadvali",
  "seg": [
   [
    "a",
    "m5-04 — 21 ekran: <b>AvtoPizza bot</b>, ikki quti va <code>users</code> jadvali",
    "Endi o'quvchi darsi, m5-04, yigirma bir ekran. AvtoPizza bot, Aziza va Jasur, dastur xotirasi va PostgreSQL qutilari, users jadvali."
   ],
   [
    "b",
    "O'quvchi amaliyoti Neon'da: <code>DATABASE_URL</code> oxiridagi <b><code>sslmode=require</code></b> o'chirilmasligi kerak",
    "O'quvchi amaliyoti Neon'da, internetdagi bepul bazada. Ulanish manzili oxiridagi sslmode require qolishi kerak, repo kodi shunga qarab ssl yoqadi. Neon'ni biz sinamadik."
   ],
   [
    "c",
    "AI kod yozadi: <code>telegram_id</code> turi va <b>SELECT borligini</b> o'quvchi bilan birga tekshiring",
    "Kodni AI yozadi. Siz ikki narsani o'quvchi bilan birga tekshiring: telegram id big int'mi va start'da avval qidirish bormi. Sinfdagi xatolarning ko'pi shu ikkisidan."
   ],
   [
    "d",
    "Xulosa: vaqt — ikki mijoz va qayta ishga tushirishni <b>sinfda jonli</b> ko'rsating",
    "Xulosa: vaqt, taklif: ikki mijoz va qayta ishga tushirishni sinfda jonli ko'rsating, ikki telefon yoki ikki akkaunt bilan. O'quvchi aralashishni o'z ko'zi bilan ko'rsin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Holat, sessiya, holatli bot — va olti holat",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi so'zlar: holat, sessiya, holatli bot — siz <b>inglizchasini birga</b> aytasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: holat, sessiya va holatli bot. O'quvchi shu so'zni aytganda, siz inglizchasini ham ayting: state va stateful."
   ],
   [
    "b",
    "Uch holat xabarsiz yoki xabar bilan: <b>unutish, aralashish</b>, <code>integer out of range</code>",
    "Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi ikkisida xato xabari chiqmaydi: bot ismni unutadi yoki ikki mijozning buyurtmasi aralashadi. Uchinchisida baza integer out of range xatosini beradi."
   ],
   [
    "c",
    "Qolgan uchtasi <b>xabardan taniladi</b>: <code>duplicate key</code>, <code>401</code>, <code>DATABASE_URL topilmadi</code>",
    "To'rtinchi holat: duplicate key xatosi, sababi kodda select yo'q. Beshinchi holat: to'rt yuz bir, ya'ni token noto'g'ri. Oltinchi holat: database url topilmadi, bunda env fayli yo'q yoki o'qilmagan."
   ],
   [
    "d",
    "Xulosa: xato chiqmasa — holat <b>qayerda saqlanayotganiga</b> qarang",
    "Xulosa va usul: xato chiqmagan holatlar eng qiyin. O'quvchi bilan birga holat qayerda saqlanayotganiga qarang: obyektdami, bazadami. Pastda savollarga tayyor javoblar."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Holatsiz bot «Pepperoni» ni nega tushunmadi?",
    "o": [
     "oldingi xabarni bilmaydi",
     "internet sekin",
     "token xato",
     "Telegram aralashtirdi"
    ],
    "c": 0,
    "e": "Har xabar alohida keladi.",
    "s": 2
   },
   {
    "q": "Obyektdagi holat bot qayta ishga tushgach?",
    "o": [
     "saqlanadi",
     "yo'qoladi",
     "bazaga o'tadi",
     "ikki baravar bo'ladi"
    ],
    "c": 1,
    "e": "RAM — jarayon bilan birga.",
    "s": 4
   },
   {
    "q": "Umumiy tanlov bilan Aziza nima oladi?",
    "o": [
     "o'z buyurtmasini",
     "xato",
     "Jasurning pitsasini",
     "javob yo'q"
    ],
    "c": 2,
    "e": "Ustiga yozildi, xatosiz.",
    "s": 6
   },
   {
    "q": "Holat qaysi kalit bilan ajratiladi?",
    "o": [
     "ism",
     "vaqt",
     "token",
     "chat.id"
    ],
    "c": 3,
    "e": "Raqam takrorlanmaydi.",
    "s": 7
   },
   {
    "q": "Har xabarda birinchi SQL?",
    "o": [
     "SELECT",
     "INSERT",
     "UPDATE",
     "DELETE"
    ],
    "c": 0,
    "e": "Avval holatni o'qish.",
    "s": 10
   },
   {
    "q": "telegram_id INTEGER — katta raqamda?",
    "o": [
     "saqlanadi",
     "integer out of range",
     "matn bo'ladi",
     "duplicate key"
    ],
    "c": 1,
    "e": "Telegram id 32 bitdan katta bo'lishi mumkin.",
    "s": 13
   },
   {
    "q": "node-pg'dan kelgan telegram_id turi?",
    "o": [
     "number",
     "boolean",
     "string (matn)",
     "object"
    ],
    "c": 2,
    "e": "=== bilan solishtirish false.",
    "s": 14
   },
   {
    "q": "«Server ishlayapti», «Telegram ulanmadi: 401» — sabab?",
    "o": [
     "baza",
     "port",
     "jadval",
     "token"
    ],
    "c": 3,
    "e": "401 — token tanilmadi.",
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
//  MENTOR KURSI · Telegraf + PostgreSQL «Bot eslab qoladi: holat bazada»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/17-TgPg-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/tgpg-out/ (00–13; haqiqiy Telegraf + PostgreSQL, Telegram serverisiz)
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx tgpg/parts/*.jsx > TgPgMentorLesson.jsx
//  Yordamchilar CI/CD-1 dan nusxa + SQL/psql (PG darslaridan) + Telegram chat maketi (⚠)
// ============================================================
const LESSON_ID = 'mentor-tgpg-01-holat-v1';
const LESSON_TITLE = "Bot eslab qoladi: holat bazada";
const PG = { term: '#111827', termEr: '#1F1115', tg: '#5B8DB8', tgBg: '#DCE7F0' };
MKCFG.root = 'bot-holat';
MKCFG.kind = (f) => /\.sql$/.test(f) ? T.green : /\.entity\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|js)$/.test(f) ? T.blue : /\.json$|^\.env/.test(f) ? T.yellow : null;
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
// Mentorning kichik boti (12-amaliyot) va o'quvchi reposi TelegramBotNest (dars-04-done, haqiqiy fayllar ro'yxati — tgpg-out/12)
const BOT_FILES = tree(['node_modules/', 'bot.js', 'package.json', 'package-lock.json']);
const RF = { ent: 'src/core/entity/user.entity.ts', base: 'src/core/entity/base.entity.ts', usv: 'src/api/user/user.service.ts', tg: 'src/api/telegram/telegram.service.ts', db: 'src/infrastructure/database.module.ts', env: '.env' };
const REPO_FILES = tree(['dist/', 'node_modules/', 'src/api/app.controller.ts', 'src/api/app.module.ts', 'src/api/telegram/telegram.module.ts', RF.tg, 'src/api/user/user.module.ts', RF.usv, 'src/config/', RF.base, RF.ent, RF.db, 'src/main.ts', '.env', '.env.example', 'Dockerfile', 'nest-cli.json', 'package.json', 'README.md', 'tsconfig.json']);
MKCFG.files = BOT_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['ctx chat id', 'ctx.chat.id'], ['chat id', 'chat.id'], ['Telegram id', 'telegram_id'], ['telegram id', 'telegram_id'], ['Big int', 'BIGINT'], ['big int', 'BIGINT'],
  ['Not null unique', 'NOT NULL UNIQUE'], ['integer out of range', 'integer out of range'], ['duplicate key', 'duplicate key'], ['already exists', 'already exists'],
  ['ism kutyapman', 'ISM_KUTYAPMAN'], ["o'lcham kutyapman", 'OLCHAM_KUTYAPMAN'], ['pitsa kutyapman', 'PITSA_KUTYAPMAN'], ['ism kutilmoqda', 'ism_kutilmoqda'],
  ['dars to\'rt done', 'dars-04-done'], ['Top yoki yarat', 'topOrYarat'], ['database url topilmadi', 'DATABASE_URL topilmadi'], ['sslmode require', 'sslmode=require'],
  ['env fayli', '.env fayli'], ['Env fayli', '.env fayli'], ['bot js', 'bot.js'], ['npm run start', 'npm run start'], ['Ctrl C', 'Ctrl+C'], ['uch tenglik', '==='],
  ['select', 'SELECT'], ['insert', 'INSERT'], ['update', 'UPDATE'], ['Insert', 'INSERT'], ['Update', 'UPDATE'], ['Number yoki String', 'Number() yoki String()'],
];
DIGITS.unshift(["to'rt yuz bir", '401'], ["uch ming portda", '3000-portda'], ["besh milliard bir yuz yigirma uch million", '5 123 456 789'], ['besh milliard', '5 000 000 000'],
  ["o'ttiz ikki bit", '32 bit'], ["yigirma bir ekran", '21 ekran'], ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'],
  ["o'n beshinchi ekran", '15-ekran'], ["o'ninchi ekran", '10-ekran'], ["to'qqizinchi ekran", '9-ekran'], ["to'rtinchi ekran", '4-ekran'], ["Uchinchi ekran", '3-ekran'], ["o'nlab", "o'nlab"]);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(/integer out of range/gi, /duplicate key/gi, /already exists/gi, /not null unique/gi, /stateful/gi);

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
const Psql = ({ lines, title = 'psql — botdb', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? PG.termEr : PG.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;
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

// Telegram chat — MAKET (Telegram serveriga ulanmadik): javob matnlari haqiqiy Telegraf handler'idan (tgpg-out), oyna esa maket
function TgChat({ title = 'AvtoPizza bot', items = [], note }) {
  return <div className="c1-tg">
    <div className="bar"><span className="av">🍕</span><span className="tt">{title}</span><span className="warn">⚠ Telegram oynasi maket · javoblar haqiqiy</span></div>
    <div className="bd">{items.map(([who, t, extra], i) => who === 'sep' ? <div key={i} className="sep">{t}</div> : <div key={i} className={`m ${who}${extra ? ' ' + extra : ''}`}>{t}</div>)}</div>
    {note && <div className="nt">{note}</div>}
  </div>;
}

// Telegraf+PG ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
/* Telegram chat maketi */
.c1-tg{background:${PG.tgBg};border:1px solid #C5D3E0;border-radius:12px;overflow:hidden}
.c1-tg .bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#fff;border-bottom:1px solid #D7E0EA;font:600 13px ${SANS};color:${T.ink}}
.c1-tg .bar .av{width:24px;height:24px;border-radius:50%;background:${PG.tg};display:inline-flex;align-items:center;justify-content:center;font-size:13px}
.c1-tg .bar .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:3px 7px}
.c1-tg .bd{padding:12px;display:flex;flex-direction:column;gap:6px}
.c1-tg .m{max-width:78%;padding:7px 11px;border-radius:12px;font-size:14px;line-height:1.4;background:#fff;color:${T.ink};box-shadow:0 1px 1px rgba(0,0,0,.06)}
.c1-tg .m.u{align-self:flex-end;background:#E1FEC6}
.c1-tg .m.b{align-self:flex-start}
.c1-tg .m.bad{border:1.5px solid ${T.accent}}
.c1-tg .m.ok{border:1.5px solid ${T.green}}
.c1-tg .sep{align-self:center;font:600 11px ${MONO};color:#5E6B78;background:rgba(255,255,255,.7);border-radius:10px;padding:3px 10px}
.c1-tg .nt{padding:6px 12px 10px;font:12px ${MONO};color:#5E6B78}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-tg');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-tg'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Kod va chiqishlar (tgpg-out — haqiqiy Telegraf 4.16.3 + PostgreSQL 18.4, Telegram serverisiz)
// ============================================================
const HOLATSIZ_JS = js(String.raw`
bot.hears(/pitsa/i, (ctx) => ctx.reply('Ajoyib! Qaysi pitsa?'));
bot.on('text', (ctx) => ctx.reply(` + '`Nima «${ctx.message.text}»? Tushunmadim.`' + String.raw`));`, { 2: { id: 'x' } });
const XOTIRA_JS = js(String.raw`
const holat = {}; // har chatning holati — oddiy obyektda (RAM)

bot.on('text', (ctx) => {
  const id = ctx.chat.id, t = ctx.message.text;
  if (!holat[id]) { holat[id] = 'PITSA_KUTYAPMAN'; return ctx.reply('Salom! Qaysi pitsa?'); }
  if (holat[id] === 'PITSA_KUTYAPMAN') { holat[id] = 'OLCHAM_KUTYAPMAN'; return ctx.reply(` + '`${t} — yaxshi tanlov! Qaysi o\'lchamda?`' + String.raw`); }
  if (holat[id] === 'OLCHAM_KUTYAPMAN') { holat[id] = 'MANZIL_KUTYAPMAN'; return ctx.reply('Manzilni yuboring.'); }
});`, { 1: { id: 'o' }, 4: { id: 'k' }, 5: { id: 'r' }, 6: { id: 'r' }, 7: { id: 'r' } });
const BAZA_JS = js(String.raw`
const { Telegraf } = require('telegraf');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [ctx.chat.id]);
  if (rows.length === 0) {
    await pool.query('INSERT INTO users (telegram_id, holat) VALUES ($1, $2)', [ctx.chat.id, 'ISM_KUTYAPMAN']);
    return ctx.reply('Ismingiz nima?');
  }
  return ctx.reply(` + '`Yana salom, ${rows[0].ism}!`' + String.raw`);
});

bot.on('text', async (ctx) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [ctx.chat.id]);
  const u = rows[0];
  if (u && u.holat === 'ISM_KUTYAPMAN') {
    await pool.query('UPDATE users SET ism = $1, holat = $2 WHERE telegram_id = $3', [ctx.message.text, 'TAYYOR', ctx.chat.id]);
    return ctx.reply(` + '`Tanishganimdan xursandman, ${ctx.message.text}!`' + String.raw`);
  }
  return ctx.reply('Buyruqni tanlang: /start');
});

bot.launch();`, { 7: { id: 'sel' }, 16: { id: 'sel' }, 8: { id: 'ins' }, 9: { id: 'ins' }, 10: { id: 'ins' }, 11: { id: 'ins' }, 18: { id: 'upd' }, 19: { id: 'upd' }, 20: { id: 'upd' }, 21: { id: 'upd' }, 25: { id: 'l' } });
const USERS_SQL = sql(String.raw`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL UNIQUE,
  ism TEXT,
  holat TEXT,
  tanlov TEXT
);`, { 3: { id: 'tg' }, 5: { id: 'h' } });
const OUT01 = jt(String.raw`
$ node holatsiz.js
Aziza (5123456789): Pitsa buyurtma qilaman
  bot → 5123456789: Ajoyib! Qaysi pitsa?
Aziza (5123456789): Pepperoni
  bot → 5123456789: Nima «Pepperoni»? Tushunmadim.`, { 5: { id: 'x' } });
const OUT02A = jt(String.raw`
$ node xotira.js 1      # 1-ishga tushirish
Aziza (5123456789): Salom
  bot → 5123456789: Salom! Qaysi pitsa?
Aziza (5123456789): Pepperoni
  bot → 5123456789: Pepperoni — yaxshi tanlov! Qaysi o'lchamda?
  [xotiradagi holat] {"5123456789":"OLCHAM_KUTYAPMAN"}`, { 5: { id: 'r' }, 6: { id: 'h' } });
const OUT02B = jt(String.raw`
# bot to'xtatildi va qayta ishga tushirildi (yangi jarayon)
$ node xotira.js 2
Aziza (5123456789): Katta
  bot → 5123456789: Salom! Qaysi pitsa?
  [xotiradagi holat] {"5123456789":"PITSA_KUTYAPMAN"}`, { 4: { id: 'x' }, 5: { id: 'x' } });
const OUT03 = jt(String.raw`
$ node umumiy.js
Aziza (5123456789): Pepperoni
  bot → 5123456789: Pepperoni. O'lcham?
Jasur (6234567890): Margarita
  bot → 6234567890: Margarita. O'lcham?
Aziza (5123456789): Katta
  bot → 5123456789: Buyurtma: Margarita, katta`, { 4: { id: 'j' }, 7: { id: 'x' } });
const UMUMIY_JS = js(String.raw`
let tanlov = null; // HAMMA UCHUN BITTA
bot.hears(/^(Pepperoni|Margarita)$/, (ctx) => { tanlov = ctx.message.text; return ctx.reply(` + '`${tanlov}. O\'lcham?`' + String.raw`); });
bot.hears(/^(Katta|Kichik)$/, (ctx) => ctx.reply(` + '`Buyurtma: ${tanlov}, ${ctx.message.text.toLowerCase()}`' + String.raw`));`, { 1: { id: 'x' }, 2: { id: 'w' } });
const OUT05 = jt(String.raw`
$ node baza.js 1      # 1-ishga tushirish
Aziza (5123456789): /start
  bot → 5123456789: Ismingiz nima?
Aziza (5123456789): Aziza
  bot → 5123456789: Tanishganimdan xursandman, Aziza!
Jasur (6234567890): /start
  bot → 6234567890: Ismingiz nima?

# bot to'xtatildi va qayta ishga tushirildi
$ node baza.js 2
Aziza (5123456789): /start
  bot → 5123456789: Yana salom, Aziza!
Jasur (6234567890): Jasur
  bot → 6234567890: Tanishganimdan xursandman, Jasur!`, { 12: { id: 'a' }, 14: { id: 'j' } });
const PSQL05 = psql(String.raw`
botdb=# SELECT telegram_id, ism, holat FROM users;
 telegram_id |  ism  | holat
-------------+-------+--------
  5123456789 | Aziza | TAYYOR
  6234567890 | Jasur | TAYYOR
(2 rows)`, { 4: { id: 'r' }, 5: { id: 'r' } });
const CHAT_HOLATSIZ = [['u', 'Pitsa buyurtma qilaman'], ['b', 'Ajoyib! Qaysi pitsa?'], ['u', 'Pepperoni'], ['b', 'Nima «Pepperoni»? Tushunmadim.', 'bad']];

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Holat', 'Har mijozga alohida', "Holat PostgreSQL'da", 'Buzamiz', "O'quvchi reposi", "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — bot qayta ishga tushsa ham eslaydi</div>
    <TgChat items={[['sep', 'bot qayta ishga tushirildi'], ['u', '/start'], ['b', 'Yana salom, Aziza! Menyu uchun /menu ni bosing.', 'ok']]} />
  </div>} />;
}

// ============================================================
//  2 · Holatsiz bot (tgpg-out/01)
// ============================================================
const S2 = mkS(2, [{ v: 'chat' }, { v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      <TgChat items={CHAT_HOLATSIZ} />
      {seg.sum && <div className="mk-rule">Holatsiz bot har xabarni <b>birinchi xabardek</b> ko'radi — suhbat qayerdaligini bilmaydi.</div>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v !== 'chat' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-holat" files={tree(['node_modules/', 'holatsiz.js', 'package.json'])} active="holatsiz.js"><CodePanel file="holatsiz.js" wrap lines={HOLATSIZ_JS} focus={seg.v === 'code' ? ['x'] : []} /></Ide></div>}
      {seg.v === 'out' && <Term lines={OUT01} focus={['x']} title="terminal — haqiqiy Telegraf, Telegram serverisiz" />}
    </div>
  </div>} />;
}

// ============================================================
//  3 · Holat obyektda (tgpg-out/02, 1-jarayon)
// ============================================================
const S3 = mkS(3, [{ f: ['o', 'k'] }, { f: ['r'] }, { f: [], out: true }, { f: [], out: true, sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-holat" files={tree(['node_modules/', 'xotira.js', 'package.json'])} active="xotira.js"><CodePanel file="xotira.js" wrap lines={XOTIRA_JS} focus={seg.f} /></Ide></div>
    {seg.out && <Term lines={OUT02A} focus={['r', 'h']} />}
    {seg.sum && <div className="mk-rule">Holat bilan suhbat davom etdi — lekin obyekt <b>dastur xotirasida</b> (RAM).</div>}
  </div>} />;
}

// ============================================================
//  4 · Qayta ishga tushirish — RAM bo'shadi (tgpg-out/02, 2-jarayon)
// ============================================================
const S4 = mkS(4, [{ v: 'r' }, { v: 'out' }, { v: 'box' }, { v: 'box', sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'r' && <Term lines={OUT02A.slice(-1).concat(jt('# Ctrl+C → node xotira.js 2'))} title="terminal" />}
    {seg.v !== 'r' && <div className="pg-two">
      <Term er lines={OUT02B} focus={['x']} />
      <TgChat items={[['u', 'Pepperoni'], ['b', "Pepperoni — yaxshi tanlov! Qaysi o'lchamda?"], ['sep', 'bot qayta ishga tushirildi'], ['u', 'Katta'], ['b', 'Salom! Qaysi pitsa?', 'bad']]} />
    </div>}
    {seg.v === 'box' && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.accent }}><h4>Dastur xotirasi (RAM)</h4><p>vaqtinchalik — jarayon tugasa, obyekt bo'sh boshlanadi</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>PostgreSQL</h4><p>doimiy — diskda, qayta ishga tushirishdan keyin ham joyida</p></div>
    </div>}
    {seg.sum && <div className="mk-rule">Qayta ishga tushirishdan keyin faqat <b>bazaga yozilgan</b> holat qoladi.</div>}
  </div>} />;
}

// ============================================================
//  5 · Tekshiruv 1
// ============================================================
function Screen5(p) {
  const m = MDT[5];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: bazadagi holat qayta ishga tushirishdan keyin ham bor</div>
      <Term lines={OUT05.slice(9, 13)} focus={['a']} />
      <Psql lines={PSQL05} focus={['r']} />
    </div>} />;
}

// ============================================================
//  6 · Umumiy o'zgaruvchi (tgpg-out/03)
// ============================================================
const S6 = mkS(6, [{ v: 'two' }, { v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'two' ? <div className="pg-two">
        <TgChat title="Aziza" items={[['u', 'Pepperoni'], ['b', "Pepperoni. O'lcham?"]]} />
        <TgChat title="Jasur" items={[['u', 'Margarita'], ['b', "Margarita. O'lcham?"]]} />
      </div> : <Ide root="bot-holat" files={tree(['node_modules/', 'umumiy.js', 'package.json'])} active="umumiy.js"><CodePanel file="umumiy.js" wrap lines={UMUMIY_JS} focus={seg.v === 'code' ? ['x', 'w'] : ['x']} /></Ide>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out' && <><Term er lines={OUT03} focus={['j', 'x']} /><TgChat title="Aziza" items={[['u', 'Pepperoni'], ['b', "Pepperoni. O'lcham?"], ['u', 'Katta'], ['b', 'Buyurtma: Margarita, katta', 'bad']]} /></>}
      {seg.sum && <div className="mk-rule">Umumiy o'zgaruvchi — ikki mijozning suhbati <b>xato bermay aralashadi</b>: xato chiqmaydi.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  7 · chat.id bo'yicha alohida
// ============================================================
const S7 = mkS(7, [{ v: 'id' }, { v: 'obj' }, { v: 'db' }, { v: 'db', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>Aziza</h4><p><code>ctx.chat.id</code> = 5123456789</p></div>
      <div className="mk-box" style={{ '--c': T.purple }}><h4>Jasur</h4><p><code>ctx.chat.id</code> = 6234567890</p></div>
    </div>
    {seg.v === 'obj' && <Term lines={jt(String.raw`
# 3-ekrandagi obyekt — kalit chat.id
{ "5123456789": "OLCHAM_KUTYAPMAN",
  "6234567890": "PITSA_KUTYAPMAN" }`)} title="xotira.js — holat" />}
    {seg.v === 'db' && <Psql lines={PSQL05} focus={['r']} />}
    {seg.sum && <div className="mk-rule"><b>Sessiya</b> — bitta mijozning alohida holati; kaliti — <code>chat.id</code>.</div>}
  </div>} />;
}

// ============================================================
//  8 · Tekshiruv 2
// ============================================================
function Screen8(p) {
  const m = MDT[8];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file="umumiy.js" wrap lines={UMUMIY_JS} focus={['x']} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Term er lines={OUT03} focus={['x']} />
    </div>} />;
}

// ============================================================
//  9 · users jadvali va BIGINT (tgpg-out/04, 09)
// ============================================================
const S9 = mkS(9, [{ f: [] }, { f: ['tg'], doc: true }, { f: ['tg'] }, { f: ['tg', 'h'], sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Psql title="psql — botdb" lines={USERS_SQL} focus={seg.f} />
    {seg.doc && <div className="mk-card"><h5>Telegram Bot API — User.id va Chat.id</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«This number may have <b>more than 32 significant bits</b> … a 64-bit integer … are safe»</div><div className="mk-tag" style={{ margin: '8px 0 0' }}>core.telegram.org/bots/api · 01.11.2026</div></div>}
    {seg.sum && <div className="mk-rule"><code>telegram_id</code> bilan qator topiladi, <code>holat</code> ustunida suhbat bosqichi.</div>}
  </div>} />;
}

// ============================================================
//  10 · Oqim: SELECT → INSERT / UPDATE
// ============================================================
const S10 = mkS(10, [{ f: ['sel'] }, { f: ['ins'] }, { f: ['upd'] }, { f: ['sel', 'ins', 'upd'], sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-holat" files={BOT_FILES} active="bot.js"><CodePanel file="bot.js" wrap lines={BAZA_JS} focus={seg.sum ? [] : seg.f} /></Ide></div>
    {seg.sum && <div className="pg-three">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>1 · SELECT</h4><p>holatni o'qish</p></div>
      <div className="mk-box" style={{ '--c': T.yellow }}><h4>2 · INSERT</h4><p>faqat yangi mijozga</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>3 · UPDATE</h4><p>yangi holat</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  11 · Qayta ishga tushgach — «Yana salom» (tgpg-out/05)
// ============================================================
const S11 = mkS(11, [{ v: 'one' }, { v: 'two', f: ['a'] }, { v: 'two', f: ['j'] }, { v: 'two', f: ['a', 'j'], sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={seg.v === 'one' ? OUT05.slice(0, 7) : OUT05} focus={seg.sum ? [] : (seg.f || [])} /></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'two' && <TgChat title="Aziza" items={[['u', '/start'], ['b', 'Ismingiz nima?'], ['u', 'Aziza'], ['b', 'Tanishganimdan xursandman, Aziza!'], ['sep', 'bot qayta ishga tushirildi'], ['u', '/start'], ['b', 'Yana salom, Aziza!', 'ok']]} />}
      {seg.sum && <><Psql lines={PSQL05} focus={['r']} /><div className="mk-rule">Holat bazada — qayta ishga tushirish ham, ikki mijoz ham <b>muammo emas</b>.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  12 · Amaliyot 1 — bot eslab qolsin
// ============================================================
const P1 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "Jadval — PostgreSQL terminalida botdb va users (9-ekran)", cmds: ['psql -U postgres', 'CREATE DATABASE botdb;', '\\c botdb'], exp: 'CREATE TABLE' },
  { t: 'Bot — yangi papka, paketlar, bot.js', cmds: ['mkdir bot-holat && cd bot-holat', 'npm init -y', 'npm i telegraf pg'], exp: 'fayl saqlandi' },
  { t: 'Ism — botni yoqing, Telegram: /start → ismingiz', cmds: ['BOT_TOKEN=… DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/botdb node bot.js'], exp: '«Tanishganimdan xursandman, …!»' },
  { t: 'Qayta ishga — Ctrl+C, xuddi shu buyruq, /start', cmds: [], exp: '«Yana salom, …!»' },
];
const P1_CODE = [{ file: 'jadval.sql', step: 0, lines: USERS_SQL, copy: true }, { file: 'bot.js', step: 1, lines: BAZA_JS, copy: false }];
const P1_TROUBLE = [
  ['password authentication failed for user "postgres"', "DATABASE_URL dagi parol — PostgreSQL-1 da o'rnatgan parolingiz"],
  ['relation "users" does not exist', "jadval boshqa bazada — \\c botdb dan keyin yarating"],
  ['Bot javob bermaydi, terminalda 401: Unauthorized', "token noto'g'ri nusxalangan (19-ekran)"],
  ['Qayta ishga tushgach yana «Ismingiz nima?»', "ism UPDATE bo'lmagan — holat ISM_KUTYAPMAN da qolgan; SELECT * FROM users;"],
];
const P1_PROOF = { label: '4-qadamdagi bot javobi', placeholder: 'botning javobini yozing', check: (v) => /Yana salom, .+!/i.test(v), wrong: "Qayta ishga tushirilgandan keyin /start bosing — bot ismingiz bilan salomlashadi; o'sha gapni yozing" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={tree(BOT_FILES, ['jadval.sql'])} />; }
// ============================================================
//  Buzamiz chiqishlari (tgpg-out/06, 07, 08) va o'quvchi reposi (TelegramBotNest dars-04-done — 10…13)
// ============================================================
const OUT06 = psql(String.raw`
botdb=# CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);
CREATE TABLE
botdb=# INSERT INTO users_int (telegram_id) VALUES (5123456789);
ERROR:  integer out of range`, { 4: { id: 'x' } });
const OUT06_OK = psql(String.raw`
botdb=# INSERT INTO users (telegram_id, holat) VALUES (5123456789, 'ISM_KUTYAPMAN');
INSERT 0 1`);
const BIGINT_JS = js(String.raw`
const { rows } = await pool.query('SELECT telegram_id FROM users WHERE telegram_id = $1', [5123456789]);
const v = rows[0].telegram_id;
console.log('rows[0].telegram_id =', JSON.stringify(v), '· typeof:', typeof v);
console.log('v === 5123456789 →', v === 5123456789);
console.log('Number(v) === 5123456789 →', Number(v) === 5123456789);`, { 4: { id: 'x' }, 5: { id: 'ok' } });
const OUT07 = jt(String.raw`
$ node bigint.js
rows[0].telegram_id = "5123456789" · typeof: string
v === 5123456789 → false
Number(v) === 5123456789 → true`, { 2: { id: 's' }, 3: { id: 'x' }, 4: { id: 'ok' } });
const OUT08 = psql(String.raw`
botdb=# INSERT INTO users (telegram_id, holat) VALUES (5123456789, 'ISM_KUTYAPMAN');
ERROR:  duplicate key value violates unique constraint "users_telegram_id_key"
DETAIL:  Key (telegram_id)=(5123456789) already exists.`, { 2: { id: 'x' }, 3: { id: 'd' } });
const START_INSERT = js(String.raw`
bot.start(async (ctx) => {
  await pool.query('INSERT INTO users (telegram_id, holat) VALUES ($1, $2)', [ctx.chat.id, 'ISM_KUTYAPMAN']);
  return ctx.reply('Ismingiz nima?');
});`, { 2: { id: 'x' } });
const ENTITY_TS = ts(String.raw`
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

// 4-dars: users jadvali — kim yozdi, ismi nima, suhbat qaysi holatda
@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'telegram_id', type: 'bigint', unique: true })
  telegram_id: string;

  @Column({ type: 'varchar', nullable: true })
  ism: string | null;

  @Column({ type: 'varchar', default: 'yangi' })
  holat: string; // 'yangi' → 'ism_kutilmoqda' → 'tayyor'
}`, { 7: { id: 'tg' }, 8: { id: 'tg' }, 13: { id: 'h' }, 14: { id: 'h' } });
const USVC_TS = ts(String.raw`
  // Bor bo'lsa topadi, bo'lmasa yangi qator ochadi
  async topOrYarat(telegramId: number): Promise<User> {
    const id = String(telegramId);
    const bor = await this.repo.findOne({ where: { telegram_id: id } });
    if (bor) return bor;
    return this.repo.save(this.repo.create({ telegram_id: id }));
  }

  async ismQoy(user: User, ism: string): Promise<User> {
    user.ism = ism;
    user.holat = 'tayyor';
    return this.repo.save(user);
  }`, { 3: { id: 's' }, 4: { id: 'sel' }, 5: { id: 'sel' }, 6: { id: 'ins' }, 9: { id: 'upd' }, 10: { id: 'upd' }, 11: { id: 'upd' }, 12: { id: 'upd' } });
USVC_TS.forEach((l, i) => { l.n = i < 7 ? 12 + i : 24 + (i - 7); }); // fayldagi raqamlar: topOrYarat 12–18, (holatQoy 20–23 tushirilgan), ismQoy 25–29
const TGSVC_TS = ts(String.raw`
    this.bot.start(async (ctx) => {
      const user = await this.users.topOrYarat(ctx.from.id);
      if (user.ism) {
        await ctx.reply(` + '`Yana salom, ${user.ism}! Menyu uchun /menu ni bosing.`' + String.raw`);
        return;
      }
      await this.users.holatQoy(user, 'ism_kutilmoqda');
      await ctx.reply('Salom! Ismingiz nima?');
    });
    ...
    this.bot.on('text', async (ctx) => {
      const user = await this.users.topOrYarat(ctx.from.id);
      if (user.holat === 'ism_kutilmoqda') {
        await this.users.ismQoy(user, ctx.message.text.trim());`, { 2: { id: 'h' }, 3: { id: 'h' }, 12: { id: 'h' }, 13: { id: 'h' } });
const OUT12 = jt(String.raw`
$ node sinov-nest.js   # dars-04-done kodi, haqiqiy PostgreSQL, Telegram serverisiz
# 1-ishga tushirish
Telegram bot ulandi
Aziza (5123456789): /start
  bot → 5123456789: Salom! Ismingiz nima?
Aziza (5123456789): Aziza
  bot → 5123456789: Xush kelibsiz, Aziza! Endi sizni eslab qolaman.
Jasur (6234567890): /start
  bot → 6234567890: Salom! Ismingiz nima?
# bot to'xtatildi (app.close) va qayta ishga tushirildi
Telegram bot ulandi
Aziza (5123456789): /start
  bot → 5123456789: Yana salom, Aziza! Menyu uchun /menu ni bosing.
Jasur (6234567890): Jasur
  bot → 6234567890: Xush kelibsiz, Jasur! Endi sizni eslab qolaman.`, { 13: { id: 'a' }, 15: { id: 'j' } });
const PSQL12 = psql(String.raw`
botnest=# \d users
   Column    |            Type             | Collation | Nullable |          Default
-------------+-----------------------------+-----------+----------+----------------------------
 id          | uuid                        |           | not null | uuid_generate_v4()
 created_at  | timestamp without time zone |           | not null | now()
 updated_at  | timestamp without time zone |           | not null | now()
 telegram_id | bigint                      |           | not null |
 ism         | character varying           |           |          |
 holat       | character varying           |           | not null | 'yangi'::character varying
    "UQ_1a1e4649fd31ea6ec6b025c7bfc" UNIQUE CONSTRAINT, btree (telegram_id)
botnest=# SELECT telegram_id, ism, holat FROM users;
 telegram_id |  ism  | holat
-------------+-------+--------
  5123456789 | Aziza | tayyor
  6234567890 | Jasur | tayyor
(2 rows)`, { 7: { id: 't' }, 10: { id: 't' }, 14: { id: 'r' }, 15: { id: 'r' } });
const OUT13 = jt(String.raw`
$ npm run start   # BOT_TOKEN=123:SOXTA, DATABASE_URL — lokal PostgreSQL
Server 3000-portda ishlayapti
Telegram ulanmadi: 401: Unauthorized — README, «Xatolar» jadvali`, { 2: { id: 's' }, 3: { id: 'x' } });
const OUT11 = jt(String.raw`
$ npm run start   # .env yo'q
…/dist/infrastructure/database.module.js:14
    throw new Error('DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing (README, 4-dars).');
Error: DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing (README, 4-dars).`, { 4: { id: 'x' } });

// ============================================================
//  13 · INTEGER sig'maydi (tgpg-out/06)
// ============================================================
const S13 = mkS(13, [{ v: 'sql' }, { v: 'err' }, { v: 'err', small: true }, { v: 'fix', sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Psql er={seg.v !== 'sql' && seg.v !== 'fix'} lines={seg.v === 'sql' ? OUT06.slice(0, 2) : OUT06} focus={seg.v === 'err' ? ['x'] : []} />
    {seg.small && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.green }}><h4>INTEGER</h4><p>eng katta: 2 147 483 647</p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>Mijoz raqami</h4><p>5 123 456 789 — sig'maydi</p></div>
    </div>}
    {seg.v === 'fix' && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — BIGINT ustunli users jadvali (9-ekran)</div><Psql lines={OUT06_OK} /><div className="mk-rule"><code>telegram_id</code> — doim <b>BIGINT</b>.</div></>}
  </div>} />;
}

// ============================================================
//  14 · BIGINT matn bo'lib keladi (tgpg-out/07)
// ============================================================
const S14 = mkS(14, [{ v: 'code', f: [] }, { v: 'out', f: ['s', 'x'] }, { v: 'repo' }, { v: 'fix', f: ['ok'], sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'repo' ? <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.ent}><CodePanel file={RF.ent} wrap lines={ENTITY_TS} focus={['tg']} /></Ide>
        : <Ide root="bot-holat" files={tree(BOT_FILES, ['bigint.js'])} active="bigint.js"><CodePanel file="bigint.js" wrap lines={BIGINT_JS} focus={seg.v === 'fix' ? ['ok'] : ['x']} /></Ide>}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v !== 'code' && seg.v !== 'repo' && <Term er={seg.v === 'out'} lines={OUT07} focus={seg.f} />}
      {seg.v === 'repo' && <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.usv}><CodePanel file={RF.usv} wrap lines={USVC_TS} focus={['s']} /></Ide>}
      {seg.sum && <div className="mk-rule">Bazadagi <code>telegram_id</code> — <b>matn</b>; solishtirishdan oldin <code>Number()</code> yoki <code>String()</code>.</div>}
    </div>
  </div>} />;
}

// ============================================================
//  15 · SELECT'siz takror INSERT (tgpg-out/08)
// ============================================================
const S15 = mkS(15, [{ v: 'code' }, { v: 'err', f: ['x'] }, { v: 'err', f: ['d'] }, { v: 'fix', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div className="pg-two">
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide root="bot-holat" files={BOT_FILES} active="bot.js"><CodePanel file="bot.js" wrap lines={seg.v === 'fix' ? BAZA_JS.slice(5, 13) : START_INSERT} focus={seg.v === 'fix' ? [] : ['x']} /></Ide></div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'err' && <Psql er lines={OUT08} focus={seg.f} />}
      {seg.v === 'fix' && <><div className="mk-tag" style={{ color: T.green, margin: 0 }}>Tuzatildi — avval SELECT (10-ekran): ikkinchi /start</div><Term lines={OUT05.slice(10, 12)} focus={['a']} /><div className="mk-rule">Avval <b>SELECT</b> — qator topilsa INSERT qilinmaydi.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — LineCheck (3-satr = 2)
// ============================================================
const LC16 = sql(String.raw`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id INTEGER NOT NULL UNIQUE,
  ism TEXT,
  holat TEXT
);`);
const LC16_FIXED = LC16.map((l, i) => ({ ...l, n: i + 1, ...(i === 2 ? { gone: true } : {}) }));
LC16_FIXED.splice(3, 0, { h: sqlLine('  telegram_id BIGINT NOT NULL UNIQUE,'), n: 3, neu: true });
function Screen16(p) {
  const m = MDT[16];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="jadval.sql" lines={LC16} target={2}
    tree={{ root: 'bot-holat', files: tree(BOT_FILES, ['jadval.sql']), active: 'jadval.sql' }}
    fixed={LC16_FIXED} fixedExtra={[{ file: 'psql — botdb (haqiqiy, BIGINT jadval)', lines: OUT06_OK }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  17 · Amaliyot 2 — ikki buzish
// ============================================================
const P2 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Sinov jadvali — INTEGER ustun', cmds: ['CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);'], exp: 'CREATE TABLE' },
  { t: 'Katta raqam', cmds: ['INSERT INTO users_int (telegram_id) VALUES (5123456789);'], exp: 'ERROR:  integer out of range' },
  { t: "Takror — users dagi o'z raqamingiz bilan yana INSERT", cmds: ['SELECT telegram_id FROM users;'], exp: 'duplicate key value violates unique constraint' },
  { t: 'Tozalash', cmds: ['DROP TABLE users_int;'], exp: 'DROP TABLE' },
];
const P2_TROUBLE = [
  ['2-qadamda INSERT 0 1', 'raqam kichik yozilgan — 5123456789 kabi 2147483647 dan katta raqam'],
  ['3-qadamda INSERT 0 1', "jadvalda bu raqam yo'q edi — avval SELECT dagi raqamni oling"],
];
const P2_PROOF = { label: '2-qadamdagi xato xabari', placeholder: "ERROR qatorini qo'ying", check: (v) => /integer out of range/i.test(v), wrong: 'ERROR: bilan boshlanadigan satrni butunligicha nusxalang' };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  18 · O'quvchi reposi dars-04-done (tgpg-out/10, 12)
// ============================================================
const S18 = mkS(18, [{ v: 'out1' }, { v: 'ent' }, { v: 'svc' }, { v: 'out2', sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div className="pg-two">
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'out1' && <Term lines={jt(String.raw`
$ git clone https://github.com/Azizbekcrypto/TelegramBotNest.git
$ git checkout -f dars-04-done
46c67e7 4-dars: users jadvali (PostgreSQL), bot ismni so'raydi va eslab qoladi (dars-04-done)
$ npm ci
added 394 packages, and audited 395 packages in 4s`)} />}
      {seg.v === 'ent' && <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.ent}><CodePanel file={RF.ent} wrap lines={ENTITY_TS} focus={['tg', 'h']} /></Ide>}
      {seg.v === 'svc' && <Ide root="TelegramBotNest" files={REPO_FILES} active={RF.usv}><CodePanel file={RF.usv} wrap lines={USVC_TS} focus={['sel', 'ins']} /></Ide>}
      {seg.v === 'out2' && <Term lines={OUT12} focus={['a', 'j']} />}
    </div>
    <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
      {seg.v === 'ent' && <><div className="mk-tag" style={{ margin: 0 }}>TypeORM yaratgan jadval (synchronize) — \d users dan parcha</div><Psql title="psql — botnest" lines={[PSQL12[0], PSQL12[6], PSQL12[8], PSQL12[9]]} focus={['t']} /></>}
      {seg.v === 'svc' && <CodePanel file={RF.tg + ' (parcha)'} numbers={false} wrap lines={TGSVC_TS} focus={['h']} />}
      {seg.v === 'out2' && <><Psql title="psql — botnest" lines={PSQL12.slice(10)} focus={['r']} /><div className="mk-rule">O'quvchi yechimi haqiqiy PostgreSQL bilan — qayta ishga tushgach <b>«Yana salom»</b>, ikki mijoz alohida.</div></>}
    </div>
  </div>} />;
}

// ============================================================
//  19 · Token xato va .env yo'q (tgpg-out/11, 13)
// ============================================================
const S19 = mkS(19, [{ v: 'tok', f: ['s'] }, { v: 'tok', f: ['s', 'x'] }, { v: 'env' }, { v: 'env', sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term er lines={OUT13} focus={seg.v === 'tok' ? seg.f : []} />
    {seg.v === 'env' && <Term er lines={OUT11} focus={['x']} />}
    {seg.sum && <div className="mk-rule">Bot javob bermasa — <b>«Telegram bot ulandi»</b> satrini qidiring; yo'q bo'lsa, o'rnidagi xato sababni aytadi (repo README — «Xatolar»).</div>}
  </div>} />;
}

// ============================================================
//  20 · Amaliyot 3 — o'quvchi reposi
// ============================================================
const P3 = mkS(20, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Repo — clone, dars-04-done, npm ci', cmds: ['git clone https://github.com/Azizbekcrypto/TelegramBotNest.git', 'cd TelegramBotNest', 'git checkout -f dars-04-done', 'npm ci'], exp: 'added … packages' },
  { t: ".env — o'z tokeningiz va lokal baza", cmds: ['psql -U postgres -c "CREATE DATABASE botnest;"'], exp: 'CREATE DATABASE · .env: BOT_TOKEN=… · DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/botnest' },
  { t: 'Ishga — Telegram: /start → ismingiz', cmds: ['npm run start'], exp: 'Telegram bot ulandi · «Xush kelibsiz, …!»' },
  { t: 'Qayta ishga — Ctrl+C, npm run start, /start, keyin psql', cmds: ['psql -U postgres -d botnest -c "SELECT ism, holat FROM users;"'], exp: '«Yana salom, …!» · tayyor' },
];
const P3_TROUBLE = [
  ['DATABASE_URL topilmadi', ".env fayli loyiha ildizida emas yoki nomi .env.example (19-ekran)"],
  ['Telegram ulanmadi: 401: Unauthorized', "token — BotFather'dan qayta nusxalang (19-ekran)"],
  ['409: Conflict ⚠', "shu bot boshqa terminalda ham ishlayapti (12-amaliyotdagi bot.js) — eskisini to'xtating (README; sinalmagan)"],
  ['holat — ism_kutilmoqda', "ism yozilmagan — Telegram'da ismingizni yuboring"],
];
const P3_PROOF = { label: 'holat ustunidagi qiymat', placeholder: 'psql natijasidagi holatni yozing', check: (v) => /^\s*tayyor\s*$/i.test(v), wrong: 'psql natijasida ism yonidagi ikkinchi ustun — holat; ism yozilgandan keyin u nima bo\'ladi?' };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  21 · Tekshiruv 4
// ============================================================
function Screen21(p) {
  const m = MDT[21];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><Term er lines={OUT13.slice(1)} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>To'g'ri token bilan — repo kodidagi satr</div>
      <Term lines={jt('Telegram bot ulandi')} />
    </div>} />;
}
// ============================================================
//  22 · m5-04 xaritasi (BotStatefulMemoryLesson.jsx — SCREEN_META 21)
// ============================================================
const MAP22 = [
  { t: 'Kirish', s: 's0–s1', d: 'adashgan suhbat · reja', m: 'holatsiz handler (2-ekran)' },
  { t: 'Holat', s: 's2–s6, s8', d: "holatsiz · holat bilan · test · obyekt · qayta ishga tushirish (ikki quti) · test", m: "RAM'da yo'qolishi haqiqiy (4-ekran)" },
  { t: 'Alohida', s: 's7, s9–s10', d: 'ikki mijoz · ikkalasi birdan · test', m: 'yashirin aralashish (6-ekran)' },
  { t: 'Baza', s: 's11–s15', d: "users jadvali · qadam-baqadam holat · SQL bo'shliqlari · test · oqim tartibi", m: 'BIGINT va matn (13–14-ekran) · takror INSERT (15-ekran)' },
  { t: 'Yakun', s: 's16', d: 'amaliyot (Neon + AI + TelegramBotNest) · kartochkalar · uyga vazifa', m: 'token, .env (19-ekran)' },
];
const S22 = mkS(22, [{ hl: [] }, { hl: [4], neon: true }, { hl: [3] }, { hl: [1, 2], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP22.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.neon && <div className="n2-warn">Neon: <code>DATABASE_URL</code> oxiridagi <code>?sslmode=require</code> qolsin — repo kodi shunga qarab <code>ssl</code> yoqadi (<code>database.module.ts</code>). Neon'ni o'zimiz sinamadik.</div>}
    {seg.sum && <div className="mk-rule">Ikki mijoz va qayta ishga tushirishni sinfda <b>jonli</b> ko'rsating — ikki akkaunt bilan.</div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT23 = [['holat · holatli bot', 'state · stateful bot'], ['sessiya', 'bitta mijozning holati, kaliti chat.id'], ['dastur xotirasi · PostgreSQL qutisi', 'RAM · disk']];
const STUMBLE23 = [
  ['Ism unutildi', 'qayta ishga tushgach «Ismingiz nima?»', 'holat RAM\'da — bazaga'],
  ['Buyurtma aralashdi', "xato yo'q", 'umumiy o\'zgaruvchi — chat.id'],
  ['Katta raqam', 'integer out of range', 'BIGINT'],
  ['Ikkinchi /start', 'duplicate key', 'avval SELECT'],
  ['Bot javob bermaydi', '401: Unauthorized', 'token'],
  ['Server yonmaydi', 'DATABASE_URL topilmadi', '.env'],
];
const QA23 = [
  ['«Holatni JSON faylda saqlasa bo\'lmaydimi?»', "bitta jarayonda ishlaydi, lekin bir vaqtda ko'p yozuvda va serverni almashtirganda baza ishonchli."],
  ['«Nega ctx.chat.id, ism emas?»', "ism takrorlanadi, raqam — yo'q."],
  ["«Neon'ni o'chirsam, holat nima bo'ladi?»", "baza bilan birga yo'qoladi."],
  ['«Telegram raqam beradi-ku, nega matn bo\'lib keldi?»', "node-pg va TypeORM bigint'ni matn qaytaradi (14-ekran)."],
];
const S23 = mkS(23, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen23(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <table className="mk-tbl"><tbody>{DICT23.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
    </div> : <div className="mk-qa">
      {STUMBLE23.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Xato chiqmasa — o'quvchi bilan birga <b>holat qayerda saqlanayotganiga</b> qarang: obyektdami, bazadami.</div>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: holat, alohida sessiya, baza va tuzoqlar. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m5-04 dagi holat va sinfdagi tuzoqlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
  { k: 'hol', t: "Holat — suhbat bosqichi; holatsiz bot har xabarni birinchi xabardek ko'radi", st: ['msg', 'hol'] },
  { k: 'ram', t: "RAM'dagi holat qayta ishga tushganda yo'qoladi, PostgreSQL'dagi qoladi", st: ['hol', 'db'] },
  { k: 'id', t: "Har mijoz chat.id bo'yicha; umumiy o'zgaruvchi xato bermay aralashtiradi", st: ['msg', 'hol'] },
  { k: 'oqim', t: "Oqim: SELECT → (yo'q bo'lsa INSERT) → javob → UPDATE", st: ['hol', 'db', 'msg'] },
  { k: 'buz', t: "Tuzoqlar: BIGINT (INTEGER sig'maydi), bazadan matn keladi, SELECT'siz takror INSERT", st: ['db'] },
  { k: 'repo', t: "O'quvchi reposi dars-04-done; token 401 — server ishlaydi, bot javob bermaydi", st: ['msg', 'db'] },
];
const STATIONS25 = [['msg', 'xabar · chat.id', T.blue], ['hol', 'holat', T.purple], ['db', 'PostgreSQL · users', T.green], ['msg2', 'javob', T.ink]];
function SummaryMap25({ hl }) {
  const cur = SUM25.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k) || (k === 'msg2' && cur.st.includes('msg'));
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — xabar yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS25.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK25 = [
  { t: 'Ustun: telefon raqami uchun', c: ['ALTER TABLE users ADD COLUMN telefon TEXT;'] },
  { t: 'Holat: ISM_KUTYAPMAN → TELEFON_KUTYAPMAN → TAYYOR (12-amaliyotdagi bot.js da)', c: [] },
  { t: "Qayta ishga: telefon bosqichida Ctrl+C → qayta yoqing → raqam yuboring — bot davom etsin", c: [] },
  { t: 'Buzish: INTEGER sinovi (17-amaliyot) — integer out of range', c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "bot holati"', 'git push'] },
];
const CHEATSHEET25 = `# Telegraf + PostgreSQL — mentor eslatmasi (bot eslab qoladi)
## Holat
holat — suhbat bosqichi (ISM_KUTYAPMAN, OLCHAM_KUTYAPMAN …); holatsiz bot: «Pepperoni» → «Tushunmadim»
obyektdagi holat (RAM) qayta ishga tushganda yo'qoladi; PostgreSQL'dagi qoladi
har mijoz ctx.chat.id bo'yicha; umumiy let tanlov → Aziza «Buyurtma: Margarita, katta» (xatosiz aralashish)
## Jadval va oqim
CREATE TABLE users (id SERIAL PRIMARY KEY, telegram_id BIGINT NOT NULL UNIQUE, ism TEXT, holat TEXT, tanlov TEXT);
har xabar: SELECT * FROM users WHERE telegram_id = $1 → yo'q bo'lsa INSERT (holat ISM_KUTYAPMAN) → javob → UPDATE users SET ism = $1, holat = $2 WHERE telegram_id = $3
## Tuzoqlar (haqiqiy xabarlar)
INTEGER: ERROR: integer out of range (Telegram id 32 bitdan katta bo'lishi mumkin — Bot API hujjati) → BIGINT
node-pg / TypeORM bigint → matn: '5123456789' === 5123456789 → false → Number() yoki String()
SELECT'siz takror INSERT: duplicate key value violates unique constraint "users_telegram_id_key"
## O'quvchi reposi TelegramBotNest (dars-04-done)
git checkout -f dars-04-done · npm ci · .env: BOT_TOKEN, DATABASE_URL (Neon: ?sslmode=require qolsin)
entity: telegram_id bigint unique (TS'da string), holat default 'yangi'; UserService.topOrYarat — SELECT + kerak bo'lsa INSERT
token xato: «Server 3000-portda ishlayapti» + «Telegram ulanmadi: 401: Unauthorized» — bot javob bermaydi · .env yo'q: DATABASE_URL topilmadi
## O'quvchi darsidagi so'zlar (m5-04)
holat (state) · holatli bot (stateful) · sessiya · dastur xotirasi (RAM) va PostgreSQL qutisi
## Sizning uyga vazifangiz
ikki bosqichli holat (ism → telefon) + qayta ishga tushirishdan keyin davom + INTEGER sinovi → GitHub → repo linki platformadagi uyga vazifaga`;
const s25Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Holat — <b>suhbat bosqichi</b>; holatsiz bot adashadi", "Birinchi: holat suhbat bosqichi. Holatsiz bot har xabarni birinchi xabardek ko'radi va adashadi.", { hl: 'hol' }),
  sg('b2', "RAM'dagi holat yo'qoladi, <b>PostgreSQL'dagi qoladi</b>", "Ikkinchi: obyektdagi holat qayta ishga tushganda yo'qoladi. Bazaga yozilgani qoladi.", { hl: 'ram' }),
  sg('b3', "Har mijoz <b>chat.id</b> bo'yicha alohida", "Uchinchi: har mijozning holati chat id bo'yicha alohida. Umumiy o'zgaruvchi suhbatlarni xato bermay aralashtiradi.", { hl: 'id' }),
  sg('b4', "Oqim: <b>SELECT</b>, kerak bo'lsa INSERT, keyin UPDATE", "To'rtinchi: har xabarda avval select, yangi mijozga insert, javobdan keyin update.", { hl: 'oqim' }),
  sg('b5', "Tuzoqlar: <b>BIGINT</b>, matn, takror INSERT", "Beshinchi: telegram id big int bo'lsin, bazadan matn bo'lib keladi, select'siz insert takrorlanadi.", { hl: 'buz' }),
  sg('b6', "O'quvchi reposi: <b>dars-04-done</b>; 401 — bot javob bermaydi", "Oltinchi: o'quvchi reposida tayyor yechim dars to'rt done. Token xato bo'lsa server ishlaydi, bot esa javob bermaydi.", { hl: 'repo' }),
  sg('hw', "<b>Uyga vazifa</b>: ikki bosqichli holat va qayta ishga tushirish", "Uyga vazifa: o'n ikkinchi amaliyotdagi botingizga ikkinchi bosqich qo'shing: ismdan keyin telefon raqamini so'rasin. Telefon bosqichida botni qayta ishga tushiring, bot davom etsin. Bir marta integer bilan buzib ko'ring.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: holat, jadval, oqim va tuzoqlar — bir sahifada", "Pastda bir sahifalik eslatma: holat, jadval va oqim, haqiqiy xato xabarlari, o'quvchi reposi va o'quvchi tili. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET25;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'telegraf-pg-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> holat bazada · chat.id bo'yicha · avval SELECT · telegram_id BIGINT.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>WebSocket: doimiy ulanish</div><div style={{ fontSize: 13.5, color: T.ink2 }}>Backend o'zi xabar yuboradi</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · Telegraf</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~40 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: PostgreSQL darslari o'tilgan (lokal PostgreSQL) · BotFather'dan sinov bot tokeni · Node.js 20+ · VS Code", "Loyiha: kichik bot (bot-holat) va o'quvchi reposi TelegramBotNest (dars-04-done)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenP1, Screen13, Screen14, Screen15, Screen16, ScreenP2, Screen18, Screen19, ScreenP3, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function TgPgMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
