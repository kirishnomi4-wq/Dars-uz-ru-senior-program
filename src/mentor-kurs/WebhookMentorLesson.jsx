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
//  WEBHOOK MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-matn.py (manba: 23-WH-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Webhook",
  "title": "To'lov o'tdi. Backend buni kimdan biladi?",
  "seg": [
   [
    "a",
    "To'lov o'tganini Backend ilovadan emas, <b>to'lov xizmatidan biladi</b> — bugun shu yo'l",
    "Assalomu alaykum. Ulanish darslaridan keyin endi pul. Tashkilotchi Pro uchun to'ladi. Backend buni kimdan biladi? Ilovadan emas, to'lov xizmatining o'zidan. Bugun shu yo'l."
   ],
   [
    "b",
    "Avval xabar va imzo: kim yuboradi va <b>soxtasi qanday to'xtatiladi</b>",
    "Avval to'lov xabari: kim kimga yuboradi. Keyin imzo: manzil ochiq bo'lsa, soxta xabar qanday to'xtatiladi."
   ],
   [
    "c",
    "Keyin takror, rad va kalit — hammasi o'quvchi loyihasida, <b>haqiqiy yurgizilgan</b>",
    "Keyin takror xabar, rad etilgan to'lov va maxfiy kalit. Hammasini o'quvchilar loyihasida haqiqiy yurgizdik. Pul yechilmaydi, bu mashq."
   ],
   [
    "d",
    "To'rt bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars to'rt bosqichdan iborat, uchta amaliyot bor. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · xabar",
  "title": "Ilova sahifani ochadi, xizmat Backend'ga yozadi: POST /tolov/webhook",
  "seg": [
   [
    "a",
    "To'lov oqimida <b>to'rt ishtirokchi</b>: ilova, tashkilotchi, xizmat, Backend",
    "Avval kim kimga nima yuborishini ko'raylik. O'quvchi README'sidagi rejada to'rt qator: ilova, tashkilotchi, to'lov xizmati va Backend."
   ],
   [
    "b",
    "Ilova faqat sahifani ochadi; karta ma'lumoti <b>faqat xizmatda</b>",
    "Ilova faqat to'lov sahifasini ochadi. Tashkilotchi o'sha sahifada to'laydi yoki rad etadi. Karta ma'lumoti faqat xizmatda, Backend uni ko'rmaydi."
   ],
   [
    "c",
    "Natijani xizmat Backend'ga <b>o'zi yuboradi</b> — bu to'lov xabari, texnik nomi webhook",
    "Natijani esa xizmat Backend manziliga o'zi yuboradi. Bu to'lov xabari, texnik nomi webhook. Telegram ham yangi xabarni bot manziliga xuddi shunday yuboradi."
   ],
   [
    "d",
    "Xulosa: «to'landi» degan gap — faqat xizmatdan; ilovaning gapi <b>dalil emas</b>",
    "Xulosa: to'landi degan gapni Backend faqat xizmatdan qabul qiladi. Ilovaning gapi dalil emas, uni har kim yuborishi mumkin."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · xabar",
  "title": "«Mashq to'lov» — xizmat o'rnida, Backend'ning o'zida; karta so'ralmaydi",
  "seg": [
   [
    "a",
    "Haqiqiy to'lov xizmati yo'q — uning o'rnida <b>mashq sahifasi</b>, Backend'ning o'zida",
    "Yo'lni ko'rdik, endi uni sinaydigan joy. Kursda haqiqiy to'lov xizmati yo'q, pul yechilmaydi. Uning o'rnida mashq sahifasi turibdi, uni Backend'ning o'zi beradi."
   ],
   [
    "b",
    "<b>To'rt tugma</b>: to'lash, rad etish, ikki marta va imzosiz yuborish",
    "To'rt tugma: to'lash, rad etish, ikki marta yuborish va imzosiz yuborish. Har biri bitta haqiqiy holatni chaqiradi."
   ],
   [
    "c",
    "Tugma bosilsa Backend xabarni imzolab, o'z <b><code>POST /tolov/webhook</code></b> iga yuboradi",
    "Tugma bosilganda Backend xabarni yasaydi, maxfiy kalit bilan imzolaydi va o'zining webhook manziliga haqiqiy so'rov qiladi. Kalit brauzerga chiqmaydi."
   ],
   [
    "d",
    "Xulosa: «To'lash» → <b><code>200 {\"ok\":true}</code></b>, jadvalda bitta qator",
    "Xulosa: to'lash bosildi, javob ikki yuz, ok true. Jadvalda bitta qator paydo bo'ldi. Endi shu yo'lni qadam-baqadam ochamiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Ilova Backend'ga «to'landi» deb yozdi. Pro'ni ochamizmi?",
  "q": "Xabar yo'lini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ilova Backend'ga to'landi deb yozdi. Pro'ni ochamizmi? Variantni tanlang.",
  "ok": "To'g'ri. Ilovaning gapini har kim yasashi mumkin. Dalil faqat xizmatning imzoli xabari. Token esa faqat kim yozayotganini aytadi, to'laganini emas. Demak, to'lov faqat xizmatning imzoli xabari kelganda tasdiqlanadi.",
  "okShort": "Yo'q — dalil faqat imzoli xizmat xabari.",
  "hint": "To'lov o'tganini kim aniq biladi?",
  "correct": 2,
  "opts": [
   "Ha — ilova bilgan",
   "Ha, agar summa to'g'ri bo'lsa",
   "Yo'q — faqat imzoli xizmat xabari dalil",
   "Ha, token bilan kelgan bo'lsa"
  ],
  "wrong": {
   "0": "Ilova so'rovini har kim yasaydi.",
   "1": "Summani ham yozish mumkin.",
   "3": "Token — kim, to'lov emas."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "X-Imzo = HMAC SHA-256 (xom tana, TOLOV_KALITI) — 64 belgi",
  "seg": [
   [
    "a",
    "Manzil internetda ochiq — <b>begona odam</b> ham «to'landi» deb yuborishi mumkin",
    "To'lov xabarini kim yuborganini Backend qanday biladi? Webhook manzili internetda ochiq, begona odam ham unga to'landi deb yozishi mumkin. Shuning uchun imzo kerak."
   ],
   [
    "b",
    "Imzo — tana va maxfiy kalitdan <b>HMAC</b>: kalitni faqat xizmat va Backend biladi",
    "Imzo xabar matni va maxfiy kalitdan hisoblanadi, HMAC SHA-256. Kalitni faqat ikki tomon biladi: xizmat va Backend. Natija oltmish to'rt belgi."
   ],
   [
    "c",
    "Backend xuddi shunday hisoblaydi va solishtiradi: avval shakl, keyin <b><code>timingSafeEqual</code></b>",
    "Backend xuddi shu hisobni o'zi qiladi va sarlavhadagi imzo bilan solishtiradi. Avval shaklini tekshiradi, keyin timing safe equal bilan solishtiradi."
   ],
   [
    "d",
    "Xulosa: kalitsiz to'g'ri imzo yasab bo'lmaydi; kalit bo'sh bo'lsa — <b>hech bir xabar o'tmaydi</b>",
    "Xulosa: kalitni bilmasdan to'g'ri imzo yasab bo'lmaydi. Kalit bo'sh bo'lsa, hech bir xabar qabul qilinmaydi. Bu ataylab shunday yozilgan."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "Imzosiz, abc, boshqa kalit, summasi o'zgargan — hammasi 401, jadvalda 0",
  "seg": [
   [
    "a",
    "Imzosiz va <code>X-Imzo: abc</code> — <b>401 «Imzo mos emas»</b>",
    "Imzoni ko'rdik, endi uni buzib sinaymiz. Imzosiz xabar: to'rt yuz bir, imzo mos emas. Abc degan imzo bilan ham to'rt yuz bir, shakli noto'g'ri."
   ],
   [
    "b",
    "<b>Boshqa kalit</b> bilan imzolangan — 401: kalitni bilmasa, imzo mos kelmaydi",
    "Boshqa kalit bilan to'g'ri shakldagi imzo: yana to'rt yuz bir. Kalitni bilmagan odam mos imzo yasay olmaydi."
   ],
   [
    "c",
    "To'g'ri imzo, lekin <b>summa 10 000 dan 1 ga o'zgartirilgan</b> — 401",
    "Eng qiziq holat: imzo to'g'ri kalit bilan, lekin keyin summa o'n mingdan birga o'zgartirildi. Yana to'rt yuz bir: imzo butun matndan hisoblangan."
   ],
   [
    "d",
    "Xulosa: to'rtala soxta xabar 401; jadvalda <b>bitta ham yozuv yo'q</b>",
    "Xulosa: to'rtala soxta xabar to'rt yuz bir oldi va jadvalga bitta ham qator yozilmadi. Imzo tekshiruvi eng birinchi turgani uchun."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "Ma'nosi bir xil, bo'sh joyi boshqa JSON — 401; rawBody yo'q bo'lsa haqiqiy to'lov ham 401",
  "seg": [
   [
    "a",
    "Imzo matndan hisoblanadi: bo'sh joyli JSON — <b>boshqa matn</b>, 401",
    "Soxta xabarlar to'xtadi. Endi nozik joy: imzo matnning har bir belgisidan hisoblanadi. Ma'nosi bir xil, lekin bo'sh joylari boshqa JSON, to'rt yuz bir oldi."
   ],
   [
    "b",
    "Shuning uchun Backend so'rovning xom tanasidan hisoblaydi — <b><code>rawBody: true</code></b>",
    "Shuning uchun Backend imzoni so'rovning xom tanasidan, kelgan baytlardan hisoblaydi. NestJS'da buning uchun main ts da raw body true yoziladi."
   ],
   [
    "c",
    "<code>rawBody</code> olib tashlandi — <b>haqiqiy «To'lash» ham 401</b>",
    "Sinab ko'rdik: raw body olib tashlandi. Natija: mashq sahifasidagi haqiqiy to'lash ham to'rt yuz bir oldi. Backend xom tanani ko'rmaydi, imzo hech qachon mos kelmaydi."
   ],
   [
    "d",
    "Xulosa: o'quvchi «hamma xabar 401» desa — <b>avval kalit, keyin <code>rawBody</code></b>",
    "Xulosa: o'quvchi hamma xabar to'rt yuz bir desa, avval env'dagi kalitni, keyin main ts dagi raw body'ni tekshiring."
   ]
  ]
 },
 "8": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Imzosiz xabar 401 oldi — lekin jadvalda yangi qator paydo bo'ldi",
  "q": "Tartib qanchalik muhimligini endi o'zingiz topasiz. Ikkinchi tekshiruv. Imzosiz xabar to'rt yuz bir oldi, lekin jadvalda yangi qator paydo bo'ldi. O'rni noto'g'ri turgan satrni bosing.",
  "ok": "To'g'ri. Oltinchi satr: imzo tekshiruvi yozuvdan keyin turibdi. Xabar avval jadvalga yozildi, keyin rad etildi. Imzo birinchi tursa, soxta xabar hech narsaga tegmaydi. Demak, imzo tekshiruvi jadvalga yozishdan oldin turishi shart.",
  "okShort": "6-satr: imzo yozuvdan keyin — 401 qaytdi, lekin qator yozilib bo'ldi.",
  "hint": "Javob 401 bo'lishidan oldin qaysi satr jadvalga yozib ulgurdi?",
  "task": "Qoida: tartib — <b>avval imzo</b>, keyin maydonlar, takror va yozuv. Bu kodda imzosiz xabar <code>401</code> oldi, lekin <code>tolovlar</code> da yangi <code>tolandi</code> qatori bor. <b>O'rni noto'g'ri turgan satrni bosing.</b>"
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "m13-dars-03-done: kalit, start, mashq sahifasi — To'lash va Rad etish",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi loyihasining to'lov yo'lini <b>o'z kompyuteringizda</b> yurgizasiz",
    "Imzo va tartibni ko'rdingiz, endi navbat sizga. O'quvchi loyihasining to'lov yo'lini o'z kompyuteringizda yurgizasiz. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <code>m13-dars-03-done</code>, <code>npm ci</code>, <code>.env</code> da <b><code>TOLOV_KALITI</code></b>, start",
    "Birinchi: m13 dars uch done tegi va npm ci. Ikkinchi: env fayliga tasodifiy kalit yozing, buyrug'i tayyor. Kalitni hech kimga ko'rsatmang. Keyin npm run start."
   ],
   [
    "c",
    "3–4-qadam: <b>ro'yxat (login)</b>, mashq sahifasi — To'lash va Rad etish; isbot — sahifadagi satr",
    "Uchinchi: ro'yxatdan o'ting, bu tegda login bilan. To'rtinchi: brauzerda mashq sahifasi, to'lash va rad etish. Isbot maydoniga rad etish satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi loyihasining to'lov yo'li sizning kompyuteringizda ishlaydi va siz to'lash va rad etish javoblarini o'zingiz ko'rgan bo'lasiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror",
  "title": "Bir xil xabar ikki marta: ok, keyin takror — jadvalda bitta qator",
  "seg": [
   [
    "a",
    "Javob yo'qolsa xizmat o'sha xabarni qayta yuboradi — Backend uni <b>ikkinchi marta yozmasin</b>",
    "Imzo o'tdi, endi boshqa xavf. Javob yo'qolsa, xizmat o'sha xabarni qayta yuboradi. Backend uni ikkinchi marta yozmasligi kerak, aks holda Pro ikki marta uzayadi."
   ],
   [
    "b",
    "«Ikki marta yuborish»: birinchisi <code>ok</code>, ikkinchisi <b><code>takror</code></b> — ikkalasi 200",
    "Ikki marta yuborish tugmasi: birinchi javob ok, ikkinchisi takror. Ikkalasi ham ikki yuz, xizmat qayta yubormasin. Jadvalda bitta qator."
   ],
   [
    "c",
    "Bir vaqtda ikki xabar — tekshiruvdan ikkalasi o'tadi, <b>noyoblik ikkinchisini to'xtatadi</b>",
    "Ikki xabar aynan bir vaqtda kelsa, ikkalasi tekshiruvdan o'tib ketadi, PostgreSQL logida buni ko'rdik. Lekin to'lov raqami noyob: ikkinchisini baza to'xtatadi va kod uni ham takror deb qaytaradi."
   ],
   [
    "d",
    "Xulosa: takrorning <b>ikki himoyasi</b> — oldindan tekshiruv va jadvaldagi noyob raqam",
    "Xulosa: takrordan ikki himoya bor. Avval to'lov raqami tekshiriladi, oxirgi himoya esa bazadagi noyob ustun."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror",
  "title": "To'lov o'tmasa ham xabar keladi: holat: rad yoziladi, hech narsa ochilmaydi",
  "seg": [
   [
    "a",
    "To'lov o'tmasa ham xizmat xabar yuboradi — <b>holat <code>rad</code></b>",
    "Takrorni ko'rdik, endi to'lov o'tmagan holat. Xizmat bunda ham xabar yuboradi, faqat holat rad. Backend uni ham qabul qiladi."
   ],
   [
    "b",
    "Rad ham yoziladi — tashkilotchi «to'lovim qayerda?» desa, <b>javob jadvalda</b>",
    "Rad ham jadvalga yoziladi. Tashkilotchi to'lovim qayerda desa, javob shu yerda: urinish bo'lgan, lekin o'tmagan."
   ],
   [
    "c",
    "<b>Pro hali ochilmaydi</b> — README: «Pro va ilova hali o'zgarmaydi»",
    "Ehtiyot bo'ling: o'quvchi darsidagi sxemada Backend Pro muddatini uzaytiradi deb yozilgan. Bu reja. Repo'da hozir faqat yozuv bor, Pro hali o'zgarmaydi."
   ],
   [
    "d",
    "Xulosa: rad — yoziladigan natija; bugungi qurilgan qism — <b>qabul va yozuv</b>",
    "Xulosa: rad ham yoziladigan natija. Bugun qurilgan qism: xabarni qabul qilish va yozish. Pro'ni ochish keyingi ish."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Xizmat bir xil xabarni ikkinchi marta yubordi. Backend nima qaytaradi?",
  "q": "Takrorni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Xizmat bir xil xabarni ikkinchi marta yubordi. Backend nima qaytaradi? Variantni tanlang.",
  "ok": "To'g'ri. Backend ikki yuz va takror true qaytaradi, jadvalga hech narsa yozilmaydi. Agar xato kodi qaytsa, xizmat xabarni yana va yana yuboraveradi. Demak, takror xabarga ham muvaffaqiyat javobi qaytariladi, faqat yozuv takrorlanmaydi.",
  "okShort": "<code>200 { takror: true }</code> — xizmat qayta yubormasin.",
  "hint": "Javob 200 bo'lmasa xizmat nima qiladi?",
  "correct": 3,
  "opts": [
   "409 — bu to'lov bor",
   "500 — noyoblik xatosi",
   "200 va ikkinchi qator",
   "200 { takror: true } — yozuvsiz"
  ],
  "wrong": {
   "0": "Xizmat yana yuboradi.",
   "1": "Kod uni takror qiladi (10-ekran).",
   "2": "Raqam noyob."
  }
 },
 "13": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 5 daqiqa",
  "title": "Mashq sahifasida «Ikki marta yuborish» va «Imzosiz yuborish»",
  "seg": [
   [
    "a",
    "Endi siz: <b>takror va imzosiz</b> xabarni o'z sahifangizda ko'rasiz",
    "Takror va soxta xabarni ko'rdingiz, endi o'zingiz bosasiz. Besh daqiqa. O'sha mashq sahifasi ochiq."
   ],
   [
    "b",
    "1–2-qadam: «Ikki marta yuborish», «Imzosiz yuborish»; isbot — <b>ikkinchi javob</b>",
    "Birinchi: ikki marta yuborish, ikkinchi satrga qarang. Ikkinchi: imzosiz yuborish, to'rt yuz bir. Isbot maydoniga ikki marta yuborishning ikkinchi satrini qo'ying."
   ],
   [
    "c",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Ikkala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror xabar va imzosiz xabarga Backend qanday javob berishini o'z sahifangizda ko'rgan bo'lasiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "3-bosqich · kalit",
  "title": "TOLOV_KALITI — .env va Render'da; agentga, chatga, README'ga yozilmaydi",
  "seg": [
   [
    "a",
    "Kalit kimda bo'lsa, o'sha <b>«to'landi» xabarini yasay oladi</b>",
    "Imzo kalitga tayanadi. Demak kalit kimda bo'lsa, o'sha to'landi xabarini yasay oladi. Shuning uchun u faqat env faylida va Render sozlamasida turadi."
   ],
   [
    "b",
    "O'quvchi darsi: kalit agentga, chatga, README'ga va <b>skrinshotga yozilmaydi</b>",
    "O'quvchi darsi qat'iy: kalit agentga, chatga, README'ga va skrinshotga yozilmaydi. Agent faqat uning nomini biladi."
   ],
   [
    "c",
    "<code>.env</code> bo'sh qolsa — <b>har xabar 401</b>: «To'lash» ham o'tmaydi",
    "Sinfdagi tez-tez holat: env'da kalit bo'sh. Natija: mashq sahifasidagi to'lash ham to'rt yuz bir. Kod buni ataylab qiladi."
   ],
   [
    "d",
    "Xulosa: <code>git ls-files backend/.env</code> bo'sh bo'lsin; kalit chiqib qolsa — <b>yangisi</b>",
    "Xulosa: git ls files bilan env Git'da yo'qligini tekshiring. Kalit qayerdadir ko'rinib qolsa, yangisi qo'yiladi, eskisi ishlatilmaydi."
   ]
  ]
 },
 "15": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "main.ts dan rawBody ni olib tashlang — keyin qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: xom tana o'qilmasa nima bo'lishini <b>o'zingiz buzib ko'rasiz</b>",
    "Oxirgi amaliyot: xom tanani o'zingiz buzasiz. O'n daqiqa. Sinfda hamma xabar to'rt yuz bir desa, sababni tez topasiz."
   ],
   [
    "b",
    "1–2-qadam: <code>main.ts</code> da <b><code>{ rawBody: true }</code></b> ni o'chiring, qayta start, «To'lash»",
    "Birinchi: main ts da raw body true qismini o'chiring va Backend'ni qayta yoqing. Ikkinchi: mashq sahifasida to'lash."
   ],
   [
    "c",
    "3–4-qadam: 401 ni ko'ring, qaytaring — <b>yana 200</b>; isbot — buzilgan javob",
    "Uchinchi: to'rt yuz bir chiqdi, imzo mos emas. To'rtinchi: raw body'ni qaytaring, qayta start, to'lash, ikki yuz. Isbot maydoniga to'rt yuz birli satrni qo'ying."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz raw body bo'lmasa haqiqiy to'lov ham to'rt yuz bir olishini o'zingiz buzib ko'rgan bo'lasiz."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "O'quvchi .env ga TOLOV_KALITI ni yozmagan. Mashq sahifasida «To'lash» nima beradi?",
  "q": "Kalitni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi env fayliga kalitni yozmagan. Mashq sahifasida to'lash nima beradi? Variantni tanlang.",
  "ok": "To'g'ri, to'rt yuz bir. Kod kalit bo'sh bo'lsa hech bir xabarni qabul qilmaydi. Backend esa ishlab turadi, shuning uchun sabab darrov ko'rinmaydi. Demak, hamma xabar to'rt yuz bir olsa, avval env faylidagi kalitni tekshiring.",
  "okShort": "<code>401</code> — kalit bo'sh: hech bir xabar o'tmaydi.",
  "hint": "imzo.ts da kalit bo'sh bo'lsa nima qaytadi?",
  "correct": 1,
  "opts": [
   "200 — kalitsiz ham ishlaydi",
   "401 — kalit bo'sh bo'lsa hech bir xabar qabul qilinmaydi",
   "500 — Backend yiqiladi",
   "Backend ishga tushmaydi"
  ],
  "wrong": {
   "0": "Bo'sh kalit — hech narsa o'tmaydi (14-ekran).",
   "2": "Yiqilmaydi, 401.",
   "3": "Ishga tushadi; JWT_SECRET bo'lmasa boshqa gap."
  }
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»",
  "title": "m11-03: xabar, imzo, takror, rad va sxema",
  "seg": [
   [
    "a",
    "m11-03 — <b>20 ekran</b>: xabar, imzo, takror, rad va to'lov oqimi sxemasi",
    "Hammasini o'zingiz yurgizdingiz, endi o'quvchi darsi: m11-03, yigirma ekran. Xabar, imzo, takror, rad, test rejim va to'lov oqimi sxemasi."
   ],
   [
    "b",
    "<b>Og'ir qism</b> — 8-ekran kod oynasi va ikki blok; har blokda Render kutiladi",
    "O'quvchi darsi o'zi ogohlantiradi: og'ir qism sakkizinchi ekrandagi kod oynasi va ikki blok, har birida Render'da yangi versiya kutiladi. Uchinchi va o'n ikkinchi ekranlarga ortiqcha vaqt bermang."
   ],
   [
    "c",
    "<b>Pul chegarasi</b>: hech kim haqiqiy xizmatga ulanmaydi, karta yozilmaydi",
    "Pul chegarasi qat'iy: darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta yozmaydi. O'quvchi Payme ulasam bo'ladimi desa, o'n birinchi ekrandagi javobni o'qing."
   ],
   [
    "d",
    "Xulosa: A1 da <b>kalit gigiyenasi</b>, A2 da uch tekshiruv — Render'da <code>RENDER_EXTERNAL_URL</code>",
    "Xulosa: birinchi blokda kalit gigiyenasini kuzating, ikkinchisida uch tekshiruvni. Render'da mashq sahifasi o'z manzilini o'zi topadi, biz buni sinamadik."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "4-bosqich · sinfda",
  "title": "Xabar, imzo, takror — va olti holat",
  "seg": [
   [
    "a",
    "O'quvchi «to'lov xabari», «imzo», «takror» deydi — siz <b>koddagi joyini</b> bilasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: to'lov xabari, imzo va kalit, takror xabar va test rejim. Siz har birining kodda qayerda turishini bilasiz."
   ],
   [
    "b",
    "Birinchi uchta holat — <b>401 bilan bog'liq</b>: kalit, <code>rawBody</code>, tartib",
    "Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasi imzo bilan bog'liq. Hamma xabar to'rt yuz bir olsa, kalit bo'sh. Haqiqiy to'lash ham to'rt yuz bir olsa, raw body yoqilmagan. Javob to'rt yuz bir, lekin jadvalga qator yozilgan bo'lsa, tekshiruv tartibi buzilgan."
   ],
   [
    "c",
    "Qolgan uchtasi: ro'yxatda <b><code>login</code></b>, noto'g'ri <code>oyinchi</code>, <code>.env</code> Git'da",
    "To'rtinchi holat: ro'yxat to'rt yuz qaytaradi, chunki bu tegda login maydoni kerak. Beshinchi holat: manzildagi oyinchi qiymati noto'g'ri. Oltinchi holat: env fayli Git'ga tushib qolgan, bunda kalitlar darhol almashtiriladi."
   ],
   [
    "d",
    "Xulosa: 401 bo'lsa — kalit, <code>rawBody</code>, tartib; qolganida — <b>xabar matnini o'qing</b>",
    "Xulosa va usul: javob to'rt yuz bir bo'lsa, shu tartibda tekshiring: kalit, raw body, keyin tekshiruv tartibi. Qolgan holatlarda javob matnini o'quvchi bilan birga o'qing."
   ]
  ]
 },
 "19": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "To'lov o'tganini Backend kimdan biladi?",
    "o": [
     "to'lov xizmati xabaridan",
     "ilovadan",
     "tashkilotchidan",
     "README'dan"
    ],
    "c": 0,
    "e": "Ilovaning gapi dalil emas.",
    "s": 2
   },
   {
    "q": "Imzo nimadan hisoblanadi?",
    "o": [
     "faqat summadan",
     "xom tana va maxfiy kalitdan",
     "tokendan",
     "to'lov raqamidan"
    ],
    "c": 1,
    "e": "HMAC SHA-256.",
    "s": 5
   },
   {
    "q": "Summasi o'zgartirilgan xabar (imzo eski)?",
    "o": [
     "200",
     "400",
     "401 — imzo mos emas",
     "500"
    ],
    "c": 2,
    "e": "Imzo butun matndan.",
    "s": 6
   },
   {
    "q": "rawBody: true yo'q bo'lsa?",
    "o": [
     "hech narsa o'zgarmaydi",
     "faqat soxtasi o'tadi",
     "Backend yonmaydi",
     "haqiqiy to'lov ham 401"
    ],
    "c": 3,
    "e": "Xom tana yo'q.",
    "s": 7
   },
   {
    "q": "Imzo tekshiruvi qayerda turadi?",
    "o": [
     "eng birinchi",
     "yozuvdan keyin",
     "takrordan keyin",
     "oxirida"
    ],
    "c": 0,
    "e": "Aks holda soxta xabar yoziladi.",
    "s": 8
   },
   {
    "q": "Ikkinchi bir xil xabarga javob?",
    "o": [
     "409",
     "200 { takror: true }",
     "500",
     "200 va yangi qator"
    ],
    "c": 1,
    "e": "Xizmat qayta yubormasin.",
    "s": 10
   },
   {
    "q": "Rad etilgan to'lov xabari?",
    "o": [
     "e'tiborsiz qoldiriladi",
     "401",
     "yoziladi, hech narsa ochilmaydi",
     "Pro ochiladi"
    ],
    "c": 2,
    "e": "«To'lovim qayerda?»",
    "s": 11
   },
   {
    "q": "TOLOV_KALITI qayerda turadi?",
    "o": [
     "README'da",
     "agent promptida",
     "kodda",
     ".env va Render'da"
    ],
    "c": 3,
    "e": "Kalit — dalil yasash huquqi.",
    "s": 14
   }
  ]
 },
 "20": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  MENTOR KURSI · Webhook «To'lov xabari: imzo, takror va rad»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/23-WH-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/wh-out/ (00–13) va wh-amal-out/ (00–05; amaliyotlar brauzerda bosilgan)
//  O'quvchi loyihasi maydon-jamoa (m13-dars-03-done): POST /tolov/webhook va «Mashq to'lov» sahifasi — haqiqiy, lokal
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx wh/parts/*.jsx > WebhookMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-wh-01-tolov-xabari-v1';
const LESSON_TITLE = "To'lov xabari: imzo, takror va rad";
const WS = { term: '#111827', termEr: '#1F1115', amber: '#D08A1E', grey: '#8A94A3' };
MKCFG.root = 'maydon-jamoa';
MKCFG.kind = (f) => /\.gateway\.ts$/.test(f) ? T.purple : /\.service\.ts$/.test(f) ? T.green : /\.module\.ts$/.test(f) ? T.yellow : /\.(ts|tsx|js)$/.test(f) ? T.blue : /\.json$|^\.env|\.env/.test(f) ? T.yellow : null;
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
// O'quvchi reposi maydon-jamoa (m13-dars-03-done) — haqiqiy fayl nomlari (to'lov qismi)
const RF = { imzo: 'backend/src/tolov/imzo.ts', ctrl: 'backend/src/tolov/tolov.controller.ts', mashq: 'backend/src/tolov/mashq.controller.ts', ent: 'backend/src/tolov/tolov.entity.ts', main: 'backend/src/main.ts', env: 'backend/.env', envx: 'backend/.env.example' };
const REPO_FILES = tree(['backend/node_modules/', 'backend/src/app.module.ts', RF.main, 'backend/src/kirish.controller.ts', 'backend/src/royxat.controller.ts', 'backend/src/oyinlar.controller.ts', RF.imzo, RF.mashq, RF.ctrl, RF.ent, RF.envx, RF.env, 'backend/package.json', 'mobil/', 'README.md']);
MKCFG.files = REPO_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['m13 dars uch done', 'm13-dars-03-done'], ['raw body true', 'rawBody: true'], ['raw body', 'rawBody'], ['main ts', 'main.ts'], ['timing safe equal', 'timingSafeEqual'],
  ['git ls files', 'git ls-files'], ['env fayliga', '.env fayliga'], ['env faylida', '.env faylida'], ["env'dagi", ".env'dagi"], ["env'da", ".env'da"], ['env Git', '.env Git'],
  ['ok true', '{ ok: true }'], ['takror true', '{ takror: true }'], ['Ctrl C', 'Ctrl+C'],
];
DIGITS.unshift(["oltmish to'rt belgi", '64 belgi'], ["o'n mingdan birga", '10 000 dan 1 ga'], ["sakkizinchi ekrandagi", '8-ekrandagi'], ["Uchinchi va o'n ikkinchi ekranlarga", '3 va 12-ekranlarga'],
  ["o'n birinchi ekrandagi", '11-ekrandagi'], ["O'n besh daqiqa", '15 daqiqa'], ["Besh daqiqa", '5 daqiqa'], ["O'n daqiqa", '10 daqiqa'], ["qirq-oltmish daqiqa", '40–60 daqiqa'],
  ["Oltinchi satr", '6-satr']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin


const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TS_KW = /^(import|from|export|function|return|const|let|class|implements|private|readonly|constructor|this|if|new|typeof|as|any|type|null|true|false|async|await|void)$/;
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)|(@?[A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (id) out += TS_KW.test(id) ? `<span class="k">${id}</span>` : /^@/.test(id) ? `<span class="d">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// Terminal: klient holatlari — ulangan yashil, ulanmoqda sariq, ulanmagan qizil; HODISA yashil; Backend LOG yashil, ERROR qizil
function termLine(l) {
  if (/^\$ /.test(l)) return `<span class="p">$ </span><span class="m">${escH(l.slice(2))}</span>`;
  if (/^\s*#/.test(l) || /^\s*[\d.]+s\s+---/.test(l)) return `<span class="cm">${escH(l)}</span>`;
  if (/ — 4\d\d \{|"holat":4\d\d/.test(l)) return `<span class="er">${escH(l)}</span>`; // mashq sahifasi: 401/400 javoblari qizil
  if (/ — 20\d \{|^\{"ok":true\}|^\{"takror":true\}/.test(l)) return `<span class="ok">${escH(l)}</span>`; // 200 javoblari yashil
  if (/HODISA|successfully started|^LOG |\bulangan\b|\[HTTP 20\d\]|^added \d+|CREATE DATABASE|HEAD is now/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/\bulanmoqda\b|Retrying|transport:/.test(l)) return `<span class="wn">${escH(l)}</span>`; // connect_error ham sariq — holat «ulanmoqda»
  if (/\bulanmagan\b|ERROR|error:|\[HTTP 4\d\d\]|ECONNREFUSED/.test(l)) return `<span class="er">${escH(l)}</span>`;
  return escH(l);
}
const tm = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: termLine(l), ...(meta[i + 1] || {}) }));
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const Term = ({ lines, title = 'terminal', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? WS.termEr : WS.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Webhook ga xos qo'shimcha CSS (WebSocket darslaridan nusxa + mashq sahifasi maketi; dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS3 = `
.mk-explorer{overflow:auto}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
.pg-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.pg-two{grid-template-columns:1fr}}
.pg-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}
@media (max-width:1300px){.pg-three{grid-template-columns:1fr}}
.pg-qa{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:1300px){.pg-qa{grid-template-columns:1fr}}
.pg-qa button{text-align:left;border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px 14px;cursor:pointer;font:inherit;color:${T.ink}}
.pg-qa b{display:block;font-size:14px}
.pg-qa p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
/* Xulosa qadamida tor ekranda (1280) katta oyna yashiriladi — xulosa ko'rinib tursin */
@media (max-width:1300px){.j2-wide-only{display:none}}
/* Ilova ekrani maketi (ikki telefon yonma-yon) */
.ws-phones{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
.ws-ph{background:#fff;border:1px solid ${T.line};border-radius:18px;padding:10px 12px 12px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.ws-ph.bad{border-color:${T.accent}}
.ws-ph.good{border-color:${T.green}}
.ws-ph .top{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.ws-ph .who{font:700 13px ${SANS};color:${T.ink}}
.ws-ph .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:2px 6px}
.ws-ph .hd{display:flex;align-items:center;gap:8px;padding:6px 2px 8px;border-bottom:1px solid ${T.line}}
.ws-ph .hd b{font-size:16px}
.ws-ph .bg{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font:700 12.5px ${SANS}}
.ws-ph .bg i{width:9px;height:9px;border-radius:50%;display:inline-block}
.ws-ph .rw{display:flex;gap:8px;align-items:center;padding:9px 2px;border-bottom:1px dashed ${T.line};font-size:13.5px}
.ws-ph .rw b{margin-left:auto;font:800 16px ${MONO}}
.ws-ph .rw.old b{color:${T.accent}}
.ws-ph .rw.new b{color:${T.green}}
.ws-ph .nt{margin-top:8px;font:12px ${MONO};color:${T.ink3}}
/* Uch holat belgisi */
.ws-badges{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ws-badge{border:1px solid ${T.line};border-radius:12px;background:${T.paper};padding:12px;transition:opacity .3s,border-color .3s}
.ws-badge.hl{border-color:var(--c);box-shadow:0 0 0 2px var(--c) inset}
.ws-badge.dim{opacity:.4}
.ws-badge .bg{display:inline-flex;align-items:center;gap:7px;font:800 15px ${SANS};color:var(--c)}
.ws-badge .bg i{width:11px;height:11px;border-radius:50%;background:var(--c);display:inline-block}
.ws-badge p{margin:6px 0 0;font-size:13px;color:${T.ink2};line-height:1.45}
.ws-badge code{font-size:12px}
/* «Mashq to'lov» sahifasi maketi (matnlar repo'dagi HTML'dan aynan) */
.wh-pay{background:#fff;border:1px solid ${T.line};border-radius:14px;overflow:hidden}
.wh-pay .url{display:flex;gap:8px;align-items:center;padding:7px 12px;background:#F1F3F5;border-bottom:1px solid ${T.line};font:12px ${MONO};color:${T.ink2}}
.wh-pay .url .warn{margin-left:auto;font:600 10.5px ${MONO};color:${T.yellow};background:#FFF6E2;border:1px solid #F1D38A;border-radius:6px;padding:2px 6px}
.wh-pay .in{padding:14px 18px}
.wh-pay h3{margin:0 0 4px;font-size:20px}
.wh-pay .test{margin:0 0 8px;font-size:13px;color:${T.ink2}}
.wh-pay .nima{margin:0 0 10px;font-size:14.5px}
.wh-pay .tg{display:flex;flex-wrap:wrap;gap:8px}
.wh-pay .tg span{border:1.5px solid #2E9E4F;color:#2E9E4F;border-radius:9px;padding:6px 11px;font:600 13px ${SANS};transition:background .3s,color .3s}
.wh-pay .tg span.on{background:#2E9E4F;color:#fff}
.wh-pay ul{margin:12px 0 0;padding-left:18px;font:12.5px ${MONO};color:${T.ink}}
.wh-pay li{margin:3px 0}
.wh-pay li.er{color:${T.accent}}
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-wh');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-wh'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Kod va chiqishlar — maydon-jamoa m13-dars-03-done (6a1ed16) aynan; chiqishlar wh-out / wh-amal-out dan
//  (TOLOV_KALITI qiymati hech qayerda ko'rsatilmaydi)
// ============================================================
const tsN = (arr, start, meta = {}) => arr.map((l, i) => ({ h: tsLine(l), n: start + i, ...(meta[i + 1] || {}) }));
// backend/src/tolov/imzo.ts — to'liq (16 satr)
const IMZO_TS = tsN([
  "import { createHmac, timingSafeEqual } from 'node:crypto';",
  '',
  "// To'lov xabarining imzosi: HMAC SHA-256 (tana, TOLOV_KALITI), hex — 64 belgi.",
  "// Kalit faqat backend/.env va Render'da (TOLOV_KALITI); kodga, logga va README'ga yozilmaydi.",
  'export function imzola(tana: string | Buffer, kalit: string): string {',
  "  return createHmac('sha256', kalit).update(tana).digest('hex');",
  '}',
  '',
  "// Imzo mos keldimi. Kalit bo'sh bo'lsa — hech bir xabar qabul qilinmaydi.",
  "// Avval shakli (64 belgili hex) tekshiriladi: timingSafeEqual uzunligi har xil buferda xato tashlaydi.",
  'export function imzoTogrimi(xomTana: Buffer | undefined, imzo: unknown): boolean {',
  '  const kalit = process.env.TOLOV_KALITI;',
  "  if (!kalit || !xomTana || typeof imzo !== 'string' || !/^[0-9a-f]{64}$/i.test(imzo)) return false;",
  "  const kutilgan = Buffer.from(imzola(xomTana, kalit), 'hex');",
  "  return timingSafeEqual(Buffer.from(imzo, 'hex'), kutilgan);",
  '}',
], 1, { 5: { id: 'h' }, 6: { id: 'h' }, 7: { id: 'h' }, 12: { id: 'k' }, 13: { id: 'k' }, 14: { id: 's' }, 15: { id: 's' } });
// backend/src/main.ts 8–9
const MAIN_TS = tsN([
  "  // rawBody — to'lov xabarining imzosi (13-Modul 3-dars) so'rovning xom tanasidan hisoblanadi: req.rawBody (Buffer)",
  '  const app = await NestFactory.create(AppModule, { rawBody: true });',
], 8, { 2: { id: 'r' } });
// README «To'lov» → «Reja: to'lov oqimi» (aynan)
const REJA2 = [
  ['Ilova', "«To'lovga o'tish» bosilganda to'lov sahifasini ochadi", 'Brauzer'],
  ['Tashkilotchi', "to'lov sahifasida to'laydi yoki rad etadi; karta ma'lumoti faqat xizmatda", "To'lov xizmati"],
  ["To'lov xizmati", "to'lov xabarini yuboradi: POST /tolov/webhook", 'Backend'],
  ['Backend', "imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, 200 qaytaradi", "To'lov xizmati"],
];
// «Mashq to'lov» sahifasi — maket (matnlar repo HTML'idan aynan), javob satrlari — brauzerda bosilgan haqiqiy natija
const PAY_LI = {
  tolash: "To'lash (mashq) · m-1793494311872 — 200 {\"ok\":true}",
  rad: "Rad etish (mashq) · m-1793494313096 — 200 {\"ok\":true}",
  ikki1: "Ikki marta yuborish · m-1793494315387 — 200 {\"ok\":true}",
  ikki2: "Ikki marta yuborish · m-1793494315387 — 200 {\"takror\":true}",
  imzosiz: 'Imzosiz yuborish · m-1793494316611 — 401 {"message":"Imzo mos emas","error":"Unauthorized","statusCode":401}',
};
function PayPage({ on = [], li = [] }) {
  const T4 = [['tolash', "To'lash (mashq)"], ['rad', 'Rad etish (mashq)'], ['ikki', 'Ikki marta yuborish'], ['imzosiz', 'Imzosiz yuborish']];
  return <div className="wh-pay">
    <div className="url"><span>localhost:3000/tolov-mashq?oyinchi=11&amp;summa=10000</span><span className="warn">⚠ oyna maket · matn va javoblar haqiqiy</span></div>
    <div className="in">
      <h3>Mashq to'lov</h3>
      <p className="test">Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.</p>
      <p className="nima"><b>Maydon Jamoa</b> — Pro, 30 kun · 10 000 so'm</p>
      <div className="tg">{T4.map(([k, t]) => <span key={k} className={on.includes(k) ? 'on' : ''}>{t}</span>)}</div>
      {li.length > 0 && <ul>{li.map((k) => <li key={k} className={/401/.test(PAY_LI[k]) ? 'er' : ''}>{PAY_LI[k]}</li>)}</ul>}
    </div>
  </div>;
}
const TOLOVLAR3 = tm(String.raw`
$ psql -c "SELECT tolov_raqami, holat FROM tolovlar;"
  tolov_raqami   |  holat
-----------------+---------
 m-1793494311872 | tolandi
 m-1793494313096 | rad`, { 4: { id: 't' }, 5: { id: 'r' } });
const OUT07 = tm(String.raw`
# tana: {"tolovRaqami":"soxta-1","holat":"tolandi","summa":10000,"oyinchiId":11}
$ curl … (X-Imzo yo'q)
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ curl … -H "X-Imzo: abc"
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ curl … -H "X-Imzo: <boshqa kalit bilan imzo>"
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ curl … -H "X-Imzo: <to'g'ri kalit, summa 10000 bilan imzo>" -d '{…"summa":1…}'   # summa o'zgartirildi
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ psql: soxta-1 yozildimi?   → count 0`, { 2: { id: 'a' }, 3: { id: 'a' }, 4: { id: 'a' }, 5: { id: 'a' }, 6: { id: 'b' }, 7: { id: 'b' }, 8: { id: 'c' }, 9: { id: 'c' }, 10: { id: 'z' } });
const OUT08 = tm(String.raw`
# imzo shu matndan:  {"tolovRaqami":"m-xom-1","holat":"tolandi","summa":10000,"oyinchiId":11}
# yuborilgan matn:   { "tolovRaqami": "m-xom-1", "holat": "tolandi", "summa": 10000, "oyinchiId": 11 }
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
# xuddi o'sha matn yuborildi:
{"ok":true} [HTTP 200]`, { 3: { id: 'x' }, 5: { id: 'ok' } });
const OUT12 = tm(String.raw`
# src/main.ts: NestFactory.create(AppModule) — rawBody yo'q
$ … tolov-mashq/yubor {"tur":"tolash"}     # haqiqiy «To'lash»
{"tolovRaqami":"m-1793494250782","javoblar":[{"holat":401,"tana":{"message":"Imzo mos emas",…}}]}`, { 3: { id: 'x' } });
// wh-amal-out/05 — rawBody qaytarildi
const OUT12_OK = tm(String.raw`
# src/main.ts qaytarildi:  NestFactory.create(AppModule, { rawBody: true })
To'lash (mashq) · m-1793494329491 — 200 {"ok":true}`, { 2: { id: 'ok' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ["To'lov xabari", 'Imzo', 'Takror, rad va kalit', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2] }, { hl: [3] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — har javobning sababini bilasiz</div>
    <PayPage on={[]} li={['tolash', 'ikki1', 'ikki2', 'imzosiz']} />
  </div>} />;
}

// ============================================================
//  2 · Kim kimga yuboradi (README «Reja: to'lov oqimi»)
// ============================================================
const S2 = mkS(2, [{ hl: [0, 1, 2, 3] }, { hl: [0, 1] }, { hl: [2], tana: true }, { hl: [2], tana: true, sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 12 }}>
      <div className="mk-tag">README.md · ### Reja: to'lov oqimi</div>
      <table className="mk-tbl" style={{ fontSize: 13.5 }}><thead><tr><th style={{ textAlign: 'left' }}>Kim</th><th style={{ textAlign: 'left' }}>Nima qiladi</th><th style={{ textAlign: 'left' }}>Kimga</th></tr></thead>
        <tbody>{REJA2.map((r, i) => <tr key={i} style={{ opacity: seg.hl.includes(i) ? 1 : 0.4, background: seg.hl.length < 4 && seg.hl.includes(i) ? '#FFF7F3' : 'transparent' }}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table>
    </div>
    {seg.tana && <div className="mk-card"><h5>POST /tolov/webhook · tana</h5><div style={{ fontFamily: MONO, fontSize: 14 }}>{"{ tolovRaqami, holat: 'tolandi' | 'rad', summa, oyinchiId }"}</div><div style={{ fontSize: 13, color: T.ink2, marginTop: 4 }}>sarlavha X-Imzo — 5-ekran</div></div>}
    {seg.sum && <div className="mk-rule">«To'landi» — faqat xizmat xabaridan; ilovaning gapi <b>dalil emas</b>.</div>}
  </div>} />;
}

// ============================================================
//  3 · Mashq to'lov: to'rt tugma (wh-out/01; wh-amal-out/02)
// ============================================================
const S3 = mkS(3, [{ on: [], li: [] }, { on: ['tolash', 'rad', 'ikki', 'imzosiz'], li: [] }, { on: ['tolash'], li: [] }, { on: ['tolash'], li: ['tolash'], db: true, sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <PayPage on={seg.on} li={seg.li} />
    {seg.on.length === 1 && !seg.db && <div className="mk-card"><h5>Tugma bosilganda</h5><div style={{ fontSize: 14, lineHeight: 1.55 }}>sahifa → <code>POST /tolov-mashq/yubor</code> → Backend xabarni yasaydi va <b>imzolaydi</b> → o'zining <code>POST /tolov/webhook</code> iga haqiqiy so'rov. Kalit brauzerga chiqmaydi.</div></div>}
    {seg.db && <Term lines={TOLOVLAR3.slice(0, 4)} focus={['t']} title="psql — maydon_jamoa (haqiqiy)" />}
  </div>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>README · Reja: to'lov oqimi</div>
      <div className="mk-card"><div style={{ fontSize: 14 }}><b>To'lov xizmati</b> → to'lov xabarini yuboradi: POST /tolov/webhook → <b>Backend</b></div></div>
    </div>} />;
}

// ============================================================
//  5 · Imzo: tana + kalit (backend/src/tolov/imzo.ts)
// ============================================================
const S5 = mkS(5, [{ f: [] }, { f: ['h'] }, { f: ['s'] }, { f: ['k'], sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.imzo}><CodePanel file={RF.imzo} wrap lines={IMZO_TS} focus={seg.sum ? [] : seg.f} style={{ fontSize: 12.5 }} /></Ide></div>
    {seg.sum && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>tana + kalit → HMAC</h4><p>64 belgili hex — X-Imzo sarlavhasida</p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>kalit bo'sh</h4><p>hech bir xabar qabul qilinmaydi (401)</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  6 · Soxta xabarlar — 401 (wh-out/07)
// ============================================================
const S6 = mkS(6, [{ f: ['a'] }, { f: ['b'] }, { f: ['c'] }, { f: ['z'], sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term er lines={OUT07} focus={seg.f} title="terminal — haqiqiy Backend, soxta xabarlar" />
    {seg.sum && <div className="mk-rule">To'rtala soxta xabar <b>401</b>; jadvalga bitta ham qator yozilmadi.</div>}
  </div>} />;
}

// ============================================================
//  7 · Xom tana va rawBody (wh-out/08, 12; main.ts 8–9)
// ============================================================
const S7 = mkS(7, [{ v: 'xom' }, { v: 'main' }, { v: 'yoq' }, { v: 'yoq', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'xom' && <Term lines={OUT08} focus={['x', 'ok']} title="terminal — xom tana (haqiqiy)" />}
    {seg.v !== 'xom' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.main}><CodePanel file={RF.main} wrap lines={MAIN_TS} focus={seg.v === 'main' ? ['r'] : []} /></Ide></div>}
    {seg.v === 'yoq' && <Term er lines={OUT12} focus={seg.sum ? [] : ['x']} title="rawBody olib tashlandi (haqiqiy)" />}
    {seg.sum && <Term lines={OUT12_OK} focus={['ok']} title="rawBody qaytarildi (haqiqiy)" />}
    {seg.sum && <div className="mk-rule">«Hamma xabar 401» — avval <b>kalit</b>, keyin <b>rawBody</b>.</div>}
  </div>} />;
}

// ============================================================
//  8 · Tekshiruv 2 — LineCheck (wh-out/13: imzo tekshiruvi yozuvdan keyin)
// ============================================================
const LC8_SRC = [
  'async webhook(sorov, imzo) {',
  '  const tana = (sorov.body ?? {}) as Record<string, unknown>;',
  '  // … maydonlar tekshiruvi (400)',
  '  if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };',
  '  await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });',
  '  if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException("Imzo mos emas");',
  '  return { ok: true };',
  '}',
];
const LC8 = LC8_SRC.map((l) => ({ h: tsLine(l) }));
const LC8_FIXED = [
  { h: tsLine(LC8_SRC[0]), n: 1 },
  { h: tsLine(LC8_SRC[5]), n: 2, neu: true },
  { h: tsLine(LC8_SRC[1]), n: 3 }, { h: tsLine(LC8_SRC[2]), n: 4 }, { h: tsLine(LC8_SRC[3]), n: 5 }, { h: tsLine(LC8_SRC[4]), n: 6 },
  { h: tsLine(LC8_SRC[5]), n: '', gone: true },
  { h: tsLine(LC8_SRC[6]), n: 7 }, { h: tsLine(LC8_SRC[7]), n: 8 },
];
const LC8_OUT = tm(String.raw`
# tartib buzilgan (wh-out/13): «Imzosiz yuborish» → 401, lekin jadvalda yangi qator
  m-1793494254980 | tolandi
# to'g'ri tartib (wh-amal-out/03): «Imzosiz» → 401, jadvalda yozuv yo'q (3 qator qoldi)`, { 2: { id: 'x' } });
function Screen8(p) {
  const m = MDT[8];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={`${RF.ctrl} · qisqartirilgan`} lines={LC8} target={5}
    tree={{ root: 'maydon-jamoa', files: REPO_FILES, active: RF.ctrl }}
    fixed={LC8_FIXED} fixedExtra={[{ file: 'oldin va keyin (haqiqiy)', lines: LC8_OUT }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  9 · Amaliyot 1 — To'lash va Rad etish (wh-amal-out/01–02)
// ============================================================
const P1 = mkS(9, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Repo — maydon-jamoa papkasida', cmds: ['git checkout -f m13-dars-03-done', 'cd backend', 'npm ci'], exp: 'added … packages' },
  { t: 'Kalit va start — natijani .env ga TOLOV_KALITI= qatoriga yozing (hech kimga ko\'rsatmang)', cmds: ['node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Ro'yxat — bu tegda login bilan", cmds: ['curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d \'{"ism":"Ali","login":"ali","parol":"parol123"}\''], exp: '{"id":11,"ism":"Ali"}' },
  { t: "Mashq sahifasi — brauzerda; «To'lash (mashq)», keyin «Rad etish (mashq)»", cmds: ['localhost:3000/tolov-mashq?oyinchi=11&summa=10000'], exp: '… — 200 {"ok":true} — ikki satr' },
];
const P1_TROUBLE = [
  ['Ism, login va parolni yozing', "bu tegda ro'yxat login bilan — telefon emas"],
  ['409 «Bu login band»', "ro'yxat bor — id avvalgi javobda; esdan chiqqan bo'lsa boshqa login bilan ro'yxatdan o'ting"],
  ['sahifada 401 … Imzo mos emas', ".env da TOLOV_KALITI bo'sh yoki Backend kalitsiz yoqilgan — kalitni yozib, qayta start (16-ekran)"],
  ['400 … oyinchiId — mavjud hisob', "manzildagi oyinchi= — ro'yxatdagi id emas"],
];
const P1_PROOF = { label: 'Rad etish satri', placeholder: 'sahifadagi satrni nusxalang', check: (v) => /Rad etish.*200/.test(v), wrong: "Sahifada «Rad etish (mashq) · m-…» bilan boshlanadigan satrni butunligicha nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }
// ============================================================
//  Chiqishlar va kod: takror (wh-out/03, 10), kalit (wh-out/11), rawBody (wh-amal-out/04–05)
// ============================================================
const CTRL_TAKROR = tsN([
  '    if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };',
  '    try {',
  '      await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });',
  '    } catch (e) {',
  "      // Ikki bir xil xabar bir vaqtda keldi: ikkinchisini jadvaldagi noyoblik to'xtatdi — u ham takror (500 emas)",
  "      if ((e as { code?: string }).code === '23505') return { takror: true };",
  '      throw e;',
  '    }',
], 51, { 1: { id: 't' }, 5: { id: 'u' }, 6: { id: 'u' } });
const OUT10 = tm(String.raw`
# ikki curl bir vaqtda: {"tolovRaqami":"m-bir-vaqtda","holat":"tolandi","summa":10000,"oyinchiId":11}
{"ok":true} [HTTP 200]
{"takror":true} [HTTP 200]
$ psql: m-bir-vaqtda qatorlari → count 1
# PostgreSQL logi (ikkinchisi tekshiruvdan o'tib ketgan, uni noyob ustun to'xtatgan):
ERROR:  duplicate key value violates unique constraint "UQ_8d49ab7ce320a778ace3fb848bd"
DETAIL:  Key (tolov_raqami)=(m-bir-vaqtda) already exists.`, { 2: { id: 'a' }, 3: { id: 'b' }, 4: { id: 'b' }, 5: { id: 'c' }, 7: { id: 'c' }, 8: { id: 'c' } });
const ENVX = tm(String.raw`
# backend/.env.example — to'lov qismi (aynan)
# To'lov xabarining maxfiy kaliti (13-Modul 3-dars): «Mashq to'lov» sahifasi xabarni shu kalit bilan imzolaydi (HMAC SHA-256),
# POST /tolov/webhook imzoni shu kalit bilan tekshiradi. Bo'sh bo'lsa — hech bir to'lov xabari qabul qilinmaydi (401).
# Qiymat repo'ga, agentga va chatga yozilmaydi: .env ga va Render'ga o'zingiz qo'yasiz. Laptop uchun ham tasodifiy kalit:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
TOLOV_KALITI=`, { 5: { id: 'q' }, 6: { id: 'k' } });
const OUT11 = tm(String.raw`
# TOLOV_KALITI= (bo'sh) bilan Backend — haqiqiy «To'lash»
{"tolovRaqami":"m-1793494246616","javoblar":[{"holat":401,"tana":{"message":"Imzo mos emas",…}}]}`, { 2: { id: 'x' } });
const OUT11_OK = tm(String.raw`
# .env da TOLOV_KALITI yozilgach (wh-amal-out/02):
To'lash (mashq) · m-1793494311872 — 200 {"ok":true}`, { 2: { id: 'ok' } });

// ============================================================
//  10 · Takror xabar
// ============================================================
const S10 = mkS(10, [{ v: 'pay', li: [] }, { v: 'pay', li: ['ikki1', 'ikki2'] }, { v: 'run' }, { v: 'code', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'pay' && <PayPage on={['ikki']} li={seg.li} />}
    {seg.v === 'run' && <Term lines={OUT10} focus={['a', 'b', 'c']} title="terminal — bir vaqtda ikki xabar (haqiqiy)" />}
    {seg.v === 'code' && <div className="j2-wide-only"><Ide files={REPO_FILES} active={RF.ctrl}><CodePanel file={RF.ctrl} wrap lines={CTRL_TAKROR} focus={[]} style={{ fontSize: 12.5 }} /></Ide></div>}
    {seg.sum && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>1 · oldindan tekshiruv</h4><p>shu to'lov raqami bormi → 200 {'{ takror: true }'}</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>2 · noyob ustun</h4><p>tolov_raqami unique → 23505 → ham takror</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  11 · Rad etilgan to'lov (wh-amal-out/02; README «Hozir ishlaydi»)
// ============================================================
const S11 = mkS(11, [{ li: ['rad'] }, { li: ['rad'], db: true }, { li: [], readme: true }, { li: [], readme: true, sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.li.length > 0 && <PayPage on={['rad']} li={seg.li} />}
    {seg.db && <Term lines={TOLOVLAR3} focus={['r']} title="psql — maydon_jamoa (haqiqiy)" />}
    {seg.readme && <div className="mk-card" style={{ borderColor: T.accent }}><h5>README · To'lov</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«Hozir ishlaydi: to'lov xabari <code>POST /tolov/webhook</code> da qabul qilinadi va <code>tolovlar</code> ga yoziladi; <b>Pro va ilova hali o'zgarmaydi</b>. Test rejim: pul yechilmaydi.»</div></div>}
    {seg.sum && <div className="mk-rule">Rad — <b>yoziladigan natija</b>; bugungi qurilgan qism — qabul va yozuv.</div>}
  </div>} />;
}

// ============================================================
//  12 · Tekshiruv 3
// ============================================================
function Screen12(p) {
  const m = MDT[12];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: «Ikki marta yuborish»</div>
      <PayPage on={['ikki']} li={['ikki1', 'ikki2']} />
    </div>} />;
}

// ============================================================
//  13 · Amaliyot 2 — Ikki marta va Imzosiz (wh-amal-out/03)
// ============================================================
const P2 = mkS(13, [{ hl: [] }, { hl: [0, 1] }, { hl: [] }], { tableAt: 2 });
const P2_STEPS = [
  { t: "Ikki marta — mashq sahifasida «Ikki marta yuborish»", cmds: [], exp: '… — 200 {"ok":true} va … — 200 {"takror":true} (bir xil m- raqam)' },
  { t: "Imzosiz — «Imzosiz yuborish»", cmds: [], exp: '… — 401 {"message":"Imzo mos emas",…}' },
];
const P2_TROUBLE = [
  ['Ikkinchisi ham ok', "ikki xil m- raqam bilan bosilgan — «Ikki marta yuborish» tugmasini bosing, «To'lash» ni ikki marta emas"],
  ['Imzosiz 200', 'Backend eski kod bilan — git log --oneline -1 da 6a1ed16 bo\'lsin'],
];
const P2_PROOF = { label: 'Ikki marta yuborishning ikkinchi satri', placeholder: 'sahifadagi satrni nusxalang', check: (v) => /takror/.test(v), wrong: "«Ikki marta yuborish · m-…» bilan boshlanadigan ikkinchi satrni nusxalang" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  14 · Kalit: faqat .env va Render'da (.env.example; wh-out/11)
// ============================================================
const S14 = mkS(14, [{ v: 'env', f: ['k'] }, { v: 'env', f: ['q'] }, { v: 'bosh' }, { v: 'git', sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'env' && <Term lines={ENVX} focus={seg.f} title={RF.envx} />}
    {seg.v === 'bosh' && <Term er lines={OUT11} focus={['x']} title="terminal — kalitsiz Backend (haqiqiy)" />}
    {seg.v === 'bosh' && <Term lines={OUT11_OK} focus={['ok']} title="kalit bilan (haqiqiy)" />}
    {seg.v === 'git' && <div className="mk-card"><h5>O'quvchi darsi · A1, 1-qadam</h5><div style={{ fontSize: 14, lineHeight: 1.6 }}>Terminalda <code>git status</code>: <code>.env</code> fayllari ro'yxatda ko'rinmasin.<br />Keyin <code>git ls-files backend/.env</code> — natija <b>bo'sh</b> bo'lishi kerak; fayl nomi chiqsa — kalitlar almashtiriladi.</div></div>}
    {seg.sum && <div className="mk-rule">Kalit chiqib qolsa — <b>yangisi</b> qo'yiladi (<code>.env</code> va Render), eskisi ishlatilmaydi.</div>}
  </div>} />;
}

// ============================================================
//  15 · Amaliyot 3 — rawBody ni buzamiz (wh-amal-out/04–05)
// ============================================================
const P3 = mkS(15, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: "Buzish — src/main.ts: NestFactory.create(AppModule, { rawBody: true }) → NestFactory.create(AppModule); Backend'da Ctrl+C, keyin", cmds: ['npm run start'], exp: 'Nest application successfully started' },
  { t: "To'lash — sahifada «To'lash (mashq)»", cmds: [], exp: '… — 401 {"message":"Imzo mos emas",…}' },
  { t: "Qaytarish — { rawBody: true } ni qaytaring; Ctrl+C, keyin", cmds: ['npm run start'], exp: 'start ✓' },
  { t: "Tekshirish — «To'lash (mashq)»", cmds: [], exp: '… — 200 {"ok":true}' },
];
const P3_TROUBLE = [
  ['2-qadamda ham 200', 'Backend qayta yoqilmagan — Ctrl+C va qayta npm run start'],
  ['4-qadamda ham 401', 'rawBody: true to\'liq qaytmagan — git diff src/main.ts bo\'sh bo\'lsin'],
];
const P3_PROOF = { label: '2-qadamdagi satr', placeholder: 'sahifadagi satrni nusxalang', check: (v) => /401/.test(v), wrong: "«To'lash (mashq) · m-… — 401» satrini nusxalang" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  16 · Tekshiruv 4
// ============================================================
function Screen16(p) {
  const m = MDT[16];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija va kod</div>
      <Term er lines={OUT11} focus={['x']} />
      <CodePanel file={RF.imzo} wrap lines={IMZO_TS.slice(11, 13)} focus={['k']} />
    </div>} />;
}

// ============================================================
//  17 · m11-03 xaritasi (PaymentWebhookLesson.jsx — SCREEN_META 20)
// ============================================================
const MAP17 = [
  { t: 'Kirish', s: 's0–s1', d: 'reja · pul chegarasi', m: 'ilovaning gapi dalil emas (4-ekran)' },
  { t: 'Xabar va imzo', s: 's2–s5', d: "to'lov xabari · test · imzo · test", m: 'soxta 401, xom tana (6–7-ekran)' },
  { t: 'Takror', s: 's6–s8', d: 'javob yo\'qoldi · kod oynasi · test', m: 'bir vaqtda ikki xabar (10-ekran)' },
  { t: 'Rad va test rejim', s: 's9–s11', d: 'rad · test · test rejim', m: "Pro hali yo'q (11-ekran)" },
  { t: 'Sxema va amaliyot', s: 's12–s14, A1, A2', d: "to'lov oqimi sxemasi · sinov · o'z Backend'i · mashq sahifa", m: 'kalit, rawBody, Render (14–15-ekran)' },
];
const S17 = mkS(17, [{ hl: [] }, { hl: [2, 4] }, { hl: [0, 3], warn: true }, { hl: [4], sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP17.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.warn && <div className="n2-warn">Pul chegarasi: darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi va karta yozmaydi. «Payme ulasam bo'ladimi?» — real ishga tushirish ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; <b>AI Startup kursida emas</b> (o'quvchi darsi s1).</div>}
    {seg.sum && <div className="mk-rule">A1 — <b>kalit gigiyenasi</b>, A2 — uch tekshiruv; Render'da mashq sahifa <code>RENDER_EXTERNAL_URL</code> ga yuboradi (biz sinamadik).</div>}
  </div>} />;
}

// ============================================================
//  18 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT18 = [["to'lov xabari", 'webhook · POST /tolov/webhook'], ['imzo · kalit', 'HMAC SHA-256 · TOLOV_KALITI'], ['takror xabar', 'tolov_raqami noyob · { takror: true }'], ["test rejim · mashq to'lov", "pul yechilmaydi; xizmat o'rnida Backend sahifasi"]];
const STUMBLE18 = [
  ['Hamma xabar 401', 'Imzo mos emas', "kalit bo'sh"],
  ["Haqiqiy to'lash ham 401", 'Imzo mos emas', "rawBody yo'q"],
  ['401, lekin jadvalda qator', '—', 'imzo yozuvdan keyin'],
  ["Ro'yxat 400", 'Ism, login va parolni yozing', 'login maydoni'],
  ['400 oyinchiId — mavjud hisob', '—', "manzildagi oyinchi= noto'g'ri"],
  [".env Git'da", "git ls-files da fayl nomi", 'kalitlar almashtiriladi'],
];
const QA18 = [
  ["«Payme ulasam bo'ladimi?»", "AI Startup kursida emas: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (o'quvchi darsi s1 eslatmasi)."],
  ['«Nega takrorga ham 200?»', 'xato kodi qaytsa, xizmat qayta yuboraveradi.'],
  ['«Nega rad yoziladi?»', "«to'lovim qayerda?» savoliga javob."],
  ["«Kalitni agentga bersam tezroq bo'lardi-ku?»", "kalit kimda bo'lsa, o'sha «to'landi» yasaydi."],
];
const S18 = mkS(18, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen18(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <table className="mk-tbl"><tbody>{DICT18.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
    </div> : <div className="mk-qa">
      {STUMBLE18.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>401 bo'lsa — shu tartibda: <b>kalit, rawBody, tekshiruv tartibi</b>; qolganida javob matnini birga o'qing.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA18.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
// ============================================================
//  19 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[19].final;
function Screen19(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: to'lov xabari, imzo, xom tana, tartib, takror, rad va kalit. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m11-03 dagi to'lov xabari, imzo va takror sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  20 · Yakun (M13)
// ============================================================
const SUM20 = [
  { k: 'xabar', t: "To'lov xabarini xizmat o'zi yuboradi; ilovaning «to'landi» degani dalil emas", st: ['xiz', 'be'] },
  { k: 'imzo', t: "Imzo — xom tana + kalit (HMAC SHA-256); soxta xabar 401 va yozuvsiz", st: ['xiz', 'be'] },
  { k: 'raw', t: "rawBody: true — xom tana; yo'q bo'lsa haqiqiy to'lov ham 401", st: ['be'] },
  { k: 'tartib', t: "Tartib: imzo → maydonlar → takror → yozuv", st: ['be', 'db'] },
  { k: 'takror', t: "Takror — 200 { takror: true }, noyob raqam; rad ham yoziladi", st: ['be', 'db'] },
  { k: 'kalit', t: "Kalit faqat .env va Render'da; m11-03 — pul chegarasi, A1 kalit, A2 uch tekshiruv", st: ['be'] },
];
const STATIONS20 = [['xiz', "to'lov xizmati · mashq sahifa", T.blue], ['be', 'Backend · imzo', T.purple], ['db', 'tolovlar', T.green]];
function SummaryMap20({ hl }) {
  const cur = SUM20.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — to'lov xabari yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
      {STATIONS20.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK20 = [
  { t: "Buzish: imzo tekshiruvini insert dan keyinga ko'chiring → «Imzosiz yuborish» — 401, lekin tolovlar da qator", c: [] },
  { t: 'Qaytarish: imzo — birinchi → «Imzosiz» — 401 va qator yo\'q', c: [] },
  { t: "Uch tekshiruv: Imzosiz · Ikki marta · Rad — 401 · ok va takror · rad qatori", c: [] },
  { t: "Kalit: .env Git'da yo'qligini tekshiring", c: ['git ls-files backend/.env'] },
  { t: "GitHub'ga chiqaring (kalitsiz) va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "tolov xabari: tartib tekshiruvi"', 'git push'] },
];
const CHEATSHEET20 = `# Webhook — mentor eslatmasi (to'lov xabari)
## Yo'l
ilova → to'lov sahifasi · tashkilotchi to'laydi yoki rad etadi · xizmat → POST /tolov/webhook · Backend → 200
ilovaning «to'landi» degani dalil emas; dalil — xizmatning imzoli xabari
## Imzo (backend/src/tolov/imzo.ts)
X-Imzo = HMAC SHA-256 (xom tana, TOLOV_KALITI), hex 64; avval shakl, keyin timingSafeEqual; kalit bo'sh → hech bir xabar o'tmaydi
soxta: imzosiz · abc · boshqa kalit · summasi o'zgargan → 401, jadvalda 0
xom tana: bo'sh joyli JSON → 401; main.ts: NestFactory.create(AppModule, { rawBody: true }) — yo'q bo'lsa haqiqiy to'lov ham 401
## Tartib (tolov.controller.ts)
imzo → maydonlar (400) → takror (200 { takror: true }) → yozuv (200 { ok: true }); imzo yozuvdan keyin bo'lsa: 401, lekin qator yozilgan
bir vaqtda ikki xabar: noyob tolov_raqami + 23505 → takror
rad ham yoziladi; Pro hali o'zgarmaydi (README «Hozir ishlaydi»)
## Mentor amaliyoti (lokal)
git checkout -f m13-dars-03-done · npm ci · .env: TOLOV_KALITI (node -e …randomBytes(32)…) · npm run start · /royxat {ism, login, parol}
localhost:3000/tolov-mashq?oyinchi=11&summa=10000 — To'lash · Rad etish · Ikki marta yuborish · Imzosiz yuborish
## O'quvchi darsidagi so'zlar (m11-03)
to'lov xabari · imzo · kalit · takror xabar · rad etilgan to'lov · test rejim · mashq to'lov; pul chegarasi — haqiqiy xizmat yo'q
## Sizning uyga vazifangiz
tartibni buzib ko'rish va qaytarish + uch tekshiruv + .env Git'da yo'q → GitHub → repo linki platformadagi uyga vazifaga`;
const s20Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "To'lov xabarini <b>xizmat o'zi</b> yuboradi", "Birinchi: to'lov xabarini xizmat o'zi yuboradi. Ilovaning to'landi degani dalil emas.", { hl: 'xabar' }),
  sg('b2', "Imzo — <b>xom tana + kalit</b>; soxtasi 401", "Ikkinchi: imzo xabar matni va maxfiy kalitdan hisoblanadi. Soxta xabar to'rt yuz bir oladi va hech narsa yozilmaydi.", { hl: 'imzo' }),
  sg('b3', "<b>rawBody</b> yo'q — hamma 401", "Uchinchi: Backend imzoni xom tanadan hisoblaydi. Raw body yo'q bo'lsa, haqiqiy to'lov ham to'rt yuz bir.", { hl: 'raw' }),
  sg('b4', "Tartib: <b>avval imzo</b>, keyin yozuv", "To'rtinchi: tartib, avval imzo, keyin maydonlar, takror va yozuv. Imzo keyin tursa, soxta xabar yozilib qoladi.", { hl: 'tartib' }),
  sg('b5', "Takror — <b>200, yozuvsiz</b>; rad ham yoziladi", "Beshinchi: takror xabarga ikki yuz va takror true, ikkinchi qator yo'q. Rad etilgan to'lov ham yoziladi.", { hl: 'takror' }),
  sg('b6', "Kalit — faqat <b>.env va Render'da</b>", "Oltinchi: kalit faqat env faylida va Render'da. O'quvchi darsida pul chegarasi qat'iy: haqiqiy xizmat yo'q.", { hl: 'kalit' }),
  sg('hw', "<b>Uyga vazifa</b>: tartibni buzish, qaytarish va uch tekshiruv", "Uyga vazifa: o'z Backend'ingizda yoki maydon jamoa nusxasida imzo tekshiruvini yozuvdan keyinga ko'chiring va imzosiz yuborishda qator yozilib qolishini ko'ring. Keyin qaytaring va uch tekshiruvni qiling.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — kalitsiz", "GitHub'ga kalitsiz chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: yo'l, imzo, tartib va takror — bir sahifada", "Pastda bir sahifalik eslatma: to'lov yo'li, imzo va xom tana, tekshiruv tartibi, takror, mentor amaliyoti va o'quvchi tili. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen20(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET20;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'webhook-tolov-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s20Segments(passed), [passed]);
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
            <SummaryMap20 hl={hl} />
            <div className="mk-plan">{SUM20.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK20.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> imzo birinchi · takror 200 · rad yoziladi · kalit repo'da yo'q.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kurs mavzulari</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Bu — ro'yxatdagi oxirgi mavzu</div><div style={{ fontSize: 13.5, color: T.ink2 }}>o'quvchi darslarini boshidan o'tishga tayyorsiz</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · Webhook</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~30 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 9-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: NestJS va PostgreSQL darslari o'tilgan (lokal PostgreSQL) · Node.js 20+ · VS Code · brauzer · ikkita terminal", "Loyiha: o'quvchi reposi maydon-jamoa (m13-dars-03-done) — to'lov xabari va «Mashq to'lov» sahifasi. Pul yechilmaydi"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP1, Screen10, Screen11, Screen12, ScreenP2, Screen14, ScreenP3, Screen16, Screen17, Screen18, Screen19, Screen20];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WebhookMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
