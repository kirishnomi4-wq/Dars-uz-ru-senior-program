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
//  WEBSOCKET-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-matn.py (manba: 19-WS1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Vali qo'shildi. Ali'ning ekrani buni qachon biladi?",
  "seg": [
   [
    "a",
    "Ekran o'zi yangilanishi uchun <b>Backend o'zi xabar yuborishi</b> kerak — bugun shuni ko'ramiz",
    "Assalomu alaykum. Maydon Jamoa ilovasida Vali o'yinga qo'shildi. Ali'ning ekrani buni qachon biladi? Bugun Backend o'zi xabar yuboradigan doimiy ulanishni ko'ramiz."
   ],
   [
    "b",
    "Avval <b>so'rov va ulanish farqi</b>, keyin gateway va token",
    "Avval oddiy so'rov va doimiy ulanish farqi. Keyin Backend'dagi gateway: ulanishni kim qabul qiladi va tokenni qanday tekshiradi."
   ],
   [
    "c",
    "Keyin uch holat va hodisa — hammasi o'quvchi loyihasida, <b>haqiqiy yurgizilgan</b>",
    "Keyin ulanishning uch holati va hodisa. Hammasini o'quvchilar loyihasi maydon jamoa'da haqiqiy yurgizdik, sizda ham shunday bo'ladi."
   ],
   [
    "d",
    "Besh bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars besh bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · ulanish",
  "title": "Vali qo'shildi (201) — Ali'da son eski, faqat pastga tortsa yangilanadi",
  "seg": [
   [
    "a",
    "O'quvchilar 11-Modulda qurgan ilova: son <b>faqat so'rov bilan</b> keladi",
    "Savoldan boshlaymiz: hozir ilova sonni qanday oladi? Maydon Jamoa'ni o'quvchilar o'n birinchi modulda qurgan. Ilova so'raydi, Backend javob beradi. Ali ekranni ochdi: to'qqizdan o'n."
   ],
   [
    "b",
    "Vali qo'shildi — Backend biladi, lekin Ali'ga <b>yubora olmaydi</b>",
    "Vali o'yinga qo'shildi, Backend ikki yuz bir qaytardi va bazada son o'zgardi. Lekin Ali so'ramagan, demak unga yo'l yopiq. Ali'ning ekranida to'qqiz qoldi."
   ],
   [
    "c",
    "Ali pastga tortdi — <b>yangi so'rov</b>, yangi son: o'n",
    "Ali pastga tortdi, ya'ni yangi so'rov yubordi va o'nni oldi. So'ramaguncha yangi son kelmaydi. O'quvchi darsi shu holatdan boshlanadi."
   ],
   [
    "d",
    "Xulosa: so'rov–javobda yo'l <b>faqat ilova so'raganda</b> ochiladi — Backend kutadi",
    "Xulosa: so'rov va javobda yo'l faqat ilova so'raganda ochiladi. Backend o'zi xabar yubora olmaydi. Buning uchun ochiq turadigan yo'l kerak."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · ulanish",
  "title": "Ilova bir marta ulanadi — yo'l ochiq turadi, ikkala tomon yuboradi",
  "seg": [
   [
    "a",
    "Doimiy ulanish: ilova bir marta ulanadi va <b>yo'l ochiq qoladi</b>",
    "Yo'l faqat so'rovda ochilsa, Backend Ali'ga yetolmaydi. Demak ochiq turadigan yo'l kerak. Doimiy ulanishda ilova bir marta ulanadi va yo'l ochiq qoladi, ikkala tomon istagan payt yuboradi."
   ],
   [
    "b",
    "socket.io — kutubxona: imkon bo'lsa <b>WebSocket orqali</b> ulanadi",
    "O'quvchi loyihasida ulanishni socket io kutubxonasi ochadi. Imkon bo'lsa WebSocket orqali ulanadi. Haqiqiy yurgizishda transport websocket chiqdi."
   ],
   [
    "c",
    "Ilovada bitta qator: <code>io(manzil, { auth: { token } })</code> — <b>token ulanishda</b> yuboriladi",
    "Ilova tomonida asosiy qator bitta: io, Backend manzili va auth ichida token. Token so'rov sarlavhasida emas, ulanish ochilayotganda yuboriladi."
   ],
   [
    "d",
    "Xulosa: doimiy ulanish — ochiq yo'l; Backend xabarni <b>o'zi yubora oladi</b>",
    "Xulosa: doimiy ulanish ochiq yo'l, Backend xabarni o'zi yubora oladi. Lekin u yo'lni kimga ochadi? Buni gateway hal qiladi."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Ulanish ochiq turibdi. Backend ilovaga qachon xabar yubora oladi?",
  "q": "Doimiy ulanishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ulanish ochiq turibdi. Backend ilovaga qachon xabar yubora oladi? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish ochiq turganda Backend xabarni istagan paytda yuboradi. So'rov va javobda esa Backend faqat ilova so'raganda javob beradi. Demak, doimiy ulanishning asosiy farqi shu: Backend birinchi bo'lib yoza oladi.",
  "okShort": "Ochiq ulanishda — istagan payt, so'rovsiz.",
  "hint": "Ochiq yo'l — kim uchun ochiq?",
  "correct": 3,
  "opts": [
   "Faqat ilova so'raganda",
   "Faqat ilova ochilganda",
   "Har daqiqada bir marta",
   "Istagan payt — so'rovni kutmaydi"
  ],
  "wrong": {
   "0": "Bu so'rov–javob (2-ekran).",
   "1": "Ochilganda faqat ulanadi; xabar keyin ham keladi.",
   "2": "Jadval yo'q — o'zgarish bo'lganda."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · gateway",
  "title": "Gateway: token yo'q yoki yaroqsiz — disconnect() va return",
  "seg": [
   [
    "a",
    "Gateway — Backend'da <b>ulanishlarni qabul qiladigan klass</b>, HTTP bilan bitta portda",
    "Ilova token bilan ulanishni ko'rdik. Endi Backend tomoni: bu ulanishni kim qabul qiladi? Gateway. Bu NestJS klassi, HTTP server bilan bitta portda turadi. O'quvchi loyihasida u oyinlar gateway."
   ],
   [
    "b",
    "<code>handleConnection</code> — har ulanishda ishlaydi: token <b><code>handshake.auth</code></b> dan olinadi",
    "Handle connection har yangi ulanishda ishlaydi. Token handshake auth ichidan olinadi, ya'ni ilova io'ga bergan auth."
   ],
   [
    "c",
    "Token yo'q yoki yaroqsiz — <b><code>ulanish.disconnect()</code></b> va <b><code>return</code></b>",
    "Token JWT kaliti bilan tekshiriladi, yopiq so'rovlardagi kabi. Yo'q yoki yaroqsiz bo'lsa, Backend ulanishni yopadi va funksiyadan chiqadi."
   ],
   [
    "d",
    "Xulosa: token har so'rovda emas — <b>ulanish ochilayotganda</b> bir marta tekshiriladi",
    "Xulosa: bu yerda token har so'rovda emas, ulanish ochilayotganda bir marta tekshiriladi. Yaroqli bo'lsa, o'yinchi id ulanishga yozib qo'yiladi."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · gateway",
  "title": "Klient bir lahza «ulangan», keyin io server disconnect — «ulanmagan»",
  "seg": [
   [
    "a",
    "Token bilan ulandik: Backend terminalida <b>«ulandi: o'yinchi 11»</b> chiqdi",
    "Gateway kodini o'qidik, endi uni haqiqiy yurgizib sinaymiz. Avval token bilan ulandik. Backend terminalida yozuv chiqdi: ulandi, o'yinchi o'n bir. Bu Ali, u ro'yxatdan o'tgan va kirgan."
   ],
   [
    "b",
    "Tokensiz: klient <b>bir lahza «ulangan»</b> bo'ladi, keyin Backend yopadi",
    "Endi tokensiz. Qiziq tomoni: klient bir lahza ulangan bo'ladi, chunki ulanish ochilib bo'lgan. Keyin Backend tekshiradi va yopadi: io server disconnect."
   ],
   [
    "c",
    "<b><code>active=false</code></b> — ilova o'zi qayta urinmaydi: belgi «Ulanmagan»",
    "Active false: Backend yopgan ulanishga socket io o'zi qayta urinmaydi. Ilovadagi belgi ulanmagan bo'ladi. Soxta token bilan ham aynan shunday."
   ],
   [
    "d",
    "Xulosa: tokensiz ulanish bir lahza ochiladi va <b>darhol yopiladi</b> — ilova «Ulanmagan»",
    "Xulosa: tokensiz yoki soxta token bilan ulanish bir lahza ochiladi va darhol yopiladi. Sinfda belgi bir lahza yashil bo'lib o'chsa, sabab shu."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "maydon-jamoa backend'i lokal: ro'yxat, kirish, token bilan ulanish",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi loyihasining backend'ini <b>o'z kompyuteringizda</b> ishga tushirasiz",
    "Token bilan va tokensiz ulanishni ko'rdingiz, endi navbat sizga. Maydon jamoa backend'ini o'z kompyuteringizda ishga tushirasiz va Node'dagi kichik klient bilan ulanasiz. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: clone, <b><code>m12-dars-02-done</code></b>, <code>npm ci</code>; keyin baza, <code>.env</code> va ishga tushirish",
    "Birinchi: clone, m12 dars ikki done tegi, keyin backend papkasida npm ci. Ikkinchi: lokal PostgreSQL'da maydon jamoa bazasi, env fayli namunadan, keyin npm run start."
   ],
   [
    "c",
    "3–4-qadam: ro'yxat va kirish, keyin klient bilan ulanish; isbot — <b>Backend terminalidagi satr</b>",
    "Uchinchi: curl bilan ro'yxat va kirish, token olinadi. To'rtinchi: klient bilan ulanish. Isbot maydoniga Backend terminalidagi ulandi satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi loyihasining backend'i sizning kompyuteringizda ishlaydi va siz unga token bilan ulangan bo'lasiz."
   ]
  ]
 },
 "8": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Tokensiz ulanishda Backend «ulandi: o'yinchi null» deb yozdi",
  "q": "Gateway'ni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Tokensiz ulanish yopildi, lekin Backend terminali ulandi, o'yinchi null dedi. Funksiya to'xtashi kerak bo'lgan satrni bosing.",
  "ok": "To'g'ri. Beshinchi satr: disconnect'dan keyin return yo'q. Ulanish yopildi, lekin funksiya davom etib, yolg'on yozuv qoldirdi. Return qo'shilsa, tokensiz ulanish yozilmaydi. Demak, ulanishni yopgan satrdan keyin funksiya return bilan to'xtashi kerak.",
  "okShort": "5-satrdan keyin <code>return</code> yo'q — funksiya davom etdi, <code>ulandi: o'yinchi null</code>.",
  "hint": "Ulanish yopilgandan keyin qaysi satrlar baribir ishladi?",
  "task": "Qoida: token yaroqsiz bo'lsa, ulanish yopiladi va funksiya <b>shu yerda to'xtaydi</b>. Bu kodda tokensiz ulanish yopildi, lekin Backend terminalida <code>ulandi: o'yinchi null</code> chiqdi. <b>Funksiya to'xtashi kerak bo'lgan satrni bosing.</b>"
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · holat",
  "title": "Ulangan · Ulanmoqda · Ulanmagan — farq active da",
  "seg": [
   [
    "a",
    "Doimiy ulanish ham uziladi — ilova <b>uch holatni</b> ko'rsatadi",
    "Ulanish ochildi va token tekshirildi. Lekin u doim ochiq turadimi? Yo'q: internet yo'qoladi, Backend qayta ishga tushadi. Shuning uchun ilovada belgi bor va u uch holatni ko'rsatadi."
   ],
   [
    "b",
    "Ulangan — hodisalar keladi; ulanmoqda — socket.io <b>o'zi qayta urinmoqda</b>",
    "Ulangan: yo'l ochiq, hodisalar keladi. Ulanmoqda: yo'l yo'q, lekin socket io o'zi qayta urinyapti. O'quvchi kodi buni active qiymatidan biladi."
   ],
   [
    "c",
    "Ulanmagan — <b>hech kim urinmayapti</b>: Backend yopgan yoki ilova o'zi yopgan",
    "Ulanmagan: hech kim urinmayapti. Backend yopgan, masalan token yaroqsiz, yoki ilovaning o'zi yopgan, masalan hisobdan chiqilgan."
   ],
   [
    "d",
    "Xulosa: «Ulanmoqda» — o'tib ketadi; «Ulanmagan» — <b>kimdir nimadir qilishi kerak</b>",
    "Xulosa: ulanmoqda o'tib ketadigan holat, kutish kifoya. Ulanmagan esa harakat talab qiladi: qayta kirish yoki tokenni yangilash."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · holat",
  "title": "transport close → «Ulanmoqda»: urinish har 5 soniya, Backend yongach o'zi «Ulangan»",
  "seg": [
   [
    "a",
    "Backend'da Ctrl+C: klientda <b><code>transport close</code></b>, <code>active=true</code> — belgi «Ulanmoqda»",
    "Uch holatni nazariyada ko'rdik, endi ulanmoqda holatini haqiqiy chaqiramiz. Backend terminalida Ctrl C bosdik. Klient darhol sezdi: transport close, active true. Belgi ulanmoqda."
   ],
   [
    "b",
    "socket.io o'zi qayta urinadi: avval tez, keyin <b>har 5 soniyada</b>",
    "Keyin socket io o'zi qayta urinadi: avval bir-ikki soniyada, keyin har besh soniyada. Har urinishda connect error, lekin belgi ulanmoqda'da qoladi."
   ],
   [
    "c",
    "Backend yondi — keyingi urinishda o'zi «Ulangan»: <b>5 soniyagacha kechikadi</b>",
    "Backend qayta yondi, klient esa keyingi urinishda o'zi ulandi. Hech kim hech narsa bosmadi. Faqat kechikish bor: Backend tayyor bo'lgach, besh soniyagacha."
   ],
   [
    "d",
    "Xulosa: Backend qayta yonsa, <b>ilova o'zi qaytadi</b> — bir necha soniya sariq normal",
    "Xulosa: Backend qayta ishga tushsa, ilova o'zi qaytadi. O'quvchi belgi bir necha soniya sariq turdi desa, bu xato emas: navbatdagi urinishni kutyapti."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · holat",
  "title": "Javob yo'q, ulanish yopilmagan — socket.io buni 45 soniyada sezdi",
  "seg": [
   [
    "a",
    "O'quvchi darsida telefonda uchish rejimi yoqiladi — belgi <b>darhol o'zgarmasligi mumkin</b>",
    "Backend o'chganda klient darhol sezdi. Uchish rejimida esa unday emas. O'quvchi darsi ogohlantiradi: belgi darhol o'zgarmasligi mumkin, bir daqiqagacha. Nega? Sinab ko'rdik."
   ],
   [
    "b",
    "Ulanish yopilmasa, klient faqat <b>«ping» javobi</b> kelmaganidan biladi",
    "Backend'ni muzlatdik: ulanish yopilmadi, faqat javob kelmaydi. Uchish rejimida ham shunday. Klient buni faqat ping javobi kelmaganidan biladi."
   ],
   [
    "c",
    "45 soniyada <b><code>ping timeout</code></b>: 25 soniya oraliq va 20 soniya kutish",
    "Natija: qirq besh soniyada ping timeout. Socket io standarti: yigirma besh soniya oraliq va yigirma soniya kutish. Backend qaytgach esa darhol ulangan."
   ],
   [
    "d",
    "Xulosa: «uchish rejimi» belgisi <b>45 soniyagacha</b> kech qoladi — bu normal",
    "Xulosa: uchish rejimida belgi qirq besh soniyagacha kech qoladi. O'quvchi «belgi o'zgarmadi» desa, bir daqiqa kutishni ayting."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Token yaroqsiz, Backend ulanishni yopdi. Belgi qaysi holatda qoladi?",
  "q": "Uch holatni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Token yaroqsiz, Backend ulanishni yopdi. Ilovadagi belgi qaysi holatda qoladi? Variantni tanlang.",
  "ok": "To'g'ri, ulanmagan. Backend o'zi yopgan ulanishga socket io qayta urinmaydi, active qiymati false bo'ladi. O'quvchi qayta kirib, yangi token olishi kerak. Demak, Backend o'zi yopgan ulanish o'z-o'zidan tiklanmaydi.",
  "okShort": "Ulanmagan — <code>io server disconnect</code>, <code>active=false</code>.",
  "hint": "Ulanishni kim yopdi — Backend'mi yoki tarmoq?",
  "correct": 2,
  "opts": [
   "Ulangan",
   "Ulanmoqda — ilova o'zi qayta urinadi",
   "Ulanmagan — Backend yopgan ulanishga qayta urinilmaydi",
   "Belgi yo'qoladi"
  ],
  "wrong": {
   "0": "Bir lahza bo'ladi, keyin yopiladi (6-ekran).",
   "1": "Bu Backend o'chganda (10-ekran).",
   "3": "Belgi doim bor — uch holatdan biri."
  }
 },
 "13": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Backend'ni to'xtating va yoqing — klient nima deydi",
  "seg": [
   [
    "a",
    "Endi siz: Backend'ni <b>o'zingiz to'xtatib</b>, klientning holatlarini kuzatasiz",
    "Holatlarni ekranda ko'rdingiz, endi ularni o'zingiz chaqirasiz. O'n daqiqa. Bir terminalda Backend, ikkinchisida klient."
   ],
   [
    "b",
    "1–2-qadam: klient ulangan; Backend'ni <b>Ctrl+C</b> bilan to'xtating — «ulanmoqda»",
    "Birinchi: klientni token bilan yoqing, ulangan. Ikkinchi: Backend terminalida Ctrl C. Klientda ulanmoqda va sababini o'qing."
   ],
   [
    "c",
    "3–4-qadam: Backend'ni yoqing — o'zi «ulangan»; isbot — <b>uzilish sababi</b>",
    "Uchinchi: Backend'ni qayta yoqing, klient o'zi ulanadi. To'rtinchi: tokensiz sinab ko'ring, ulanmagan. Isbot maydoniga ikkinchi qadamdagi uzilish sababini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz Backend o'chganda va qayta yonganda klient qanday holatlardan o'tishini o'z ko'zingiz bilan ko'rgan bo'lasiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · hodisa",
  "title": "oyin-ozgardi { oyinId, sabab }: nima o'zgardi — son esa qayta so'raladi",
  "seg": [
   [
    "a",
    "Repo'ning keyingi tegida Backend o'zi hodisa yuboradi: <b><code>oyin-ozgardi</code></b>",
    "Ulanish tayyor, endi undan nima keladi. O'quvchi repo'sining keyingi tegida Backend hodisa yuboradi: oyin ozgardi. Vali qo'shildi, Ali'ga darhol keldi."
   ],
   [
    "b",
    "Konvertda faqat <code>oyinId</code> va <code>sabab</code> — <b>yangi son yo'q</b>",
    "Hodisa ichida faqat ikki narsa: qaysi o'yin va sabab, qo'shildi. Yangi son yo'q. O'quvchi darsi buni konvert deydi: ichida son yo'q."
   ],
   [
    "c",
    "Ali hodisani olgach <b>o'zi qayta so'radi</b>: 6 / 10 dan 7 / 10",
    "Ali hodisani olgach o'zi qayta so'radi va yettini oldi. Qiziq tomoni: hodisa Valining o'z javobidan ham oldin yetib keldi."
   ],
   [
    "d",
    "Xulosa: hodisa «nima o'zgardi» deydi — haqiqiy son Backend'dan <b>qayta olinadi</b>",
    "Xulosa: hodisa faqat nima o'zgarganini aytadi, haqiqiy son Backend'dan qayta olinadi. Shunda ikki kishi birdan qo'shilsa ham son adashmaydi."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · hodisa",
  "title": "O'quvchi darsi bugun faqat ulanish va belgini yozadi — hodisa yuborilmaydi",
  "seg": [
   [
    "a",
    "<code>m12-dars-02-done</code> gateway izohi: <b>«hozircha hech qanday hodisa yuborilmaydi»</b>",
    "Hodisani m12 dars uch tegida ko'rdik. Lekin ehtiyot bo'ling: o'quvchi darsining tayyor holati m12 dars ikki done. U yerda gateway izohi aniq: hozircha hech qanday hodisa yuborilmaydi."
   ],
   [
    "b",
    "O'quvchi tinglovchini <b>namuna oynada</b> yozadi — u yerda hodisani tugma yuboradi",
    "O'quvchi darsida tinglovchi yoziladi: ulanish on, oyin ozgardi. Lekin bu namuna oynada, u yerda hodisani tugma yuboradi, haqiqiy Backend emas."
   ],
   [
    "c",
    "O'quvchi telefonida bugun son o'zi o'zgarmaydi — <b>bu xato emas</b>",
    "Shuning uchun bugun o'quvchi telefonida son o'zi o'zgarmaydi, faqat belgi. O'quvchi «ekran yangilanmadi» desa, bu xato emas: hodisa repo'ning keyingi tegida qo'shiladi."
   ],
   [
    "d",
    "Xulosa: bugungi natija — <b>ulanish va belgi</b>; hodisa — m12-03 tegida",
    "Xulosa: bugungi o'quvchi natijasi ulanish va belgi. Hodisa m12 dars uch tegida. Ikkalasini ham o'zingiz yurgizib ko'rdingiz."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Ali'ga oyin-ozgardi {\"oyinId\":2,\"sabab\":\"qoshildi\"} keldi. Ilova keyin nima qiladi?",
  "q": "Hodisani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Ali'ga oyin ozgardi keldi: o'yin ikki, sabab qo'shildi. Ilova keyin nima qiladi? Variantni tanlang.",
  "ok": "To'g'ri. Hodisada son yo'q, ilova uni Backend'dan qayta so'raydi. O'zi bittaga oshirsa, ikki kishi birdan qo'shilganda son adashadi. Demak, hodisa faqat nima o'zgarganini aytadi, yangi sonni ilova Backend'dan oladi.",
  "okShort": "Qayta so'raydi: son Backend'dan, hodisadan emas.",
  "hint": "Konvert ichida son bormi?",
  "correct": 0,
  "opts": [
   "GET /oyinlar bilan sonni qayta so'raydi",
   "Sonni o'zi bittaga oshiradi",
   "Butun sahifani qayta yuklaydi",
   "Keyingi hodisani kutadi"
  ],
  "wrong": {
   "1": "Ikki kishi birdan qo'shilsa adashadi.",
   "2": "Faqat son so'raladi.",
   "3": "Bu hodisada ham son yo'q."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "m12-dars-03-done: Vali qo'shilsa — Ali'ga hodisa keladi",
  "seg": [
   [
    "a",
    "Endi siz: repo'ning keyingi tegida hodisani <b>o'z ko'zingiz bilan</b> ko'rasiz",
    "Hodisa kelgach ilova nima qilishini bildingiz. Oxirgi amaliyot: repo'ning keyingi tegida hodisani o'z ko'zingiz bilan ko'rasiz. O'n daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <b><code>m12-dars-03-done</code></b>, <code>npm ci</code> va start; Vali uchun ikkinchi akkaunt",
    "Birinchi: m12 dars uch done tegiga o'ting, npm ci va start. Ikkinchi: Vali uchun ikkinchi akkaunt, ro'yxat va kirish."
   ],
   [
    "c",
    "3–4-qadam: Ali ulanadi, Vali qo'shiladi; isbot — <b>hodisa satri</b>",
    "Uchinchi: Ali'ni klient bilan ulang. To'rtinchi: Vali bilan bitta o'yinga qo'shiling. Isbot maydoniga Ali'ga kelgan hodisa satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bir o'yinchi qo'shilganda ikkinchisiga hodisa qanday kelishini o'z terminalingizda ko'rgan bo'lasiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»",
  "title": "m10-02: yo'l, konvert, belgi va sxema",
  "seg": [
   [
    "a",
    "m10-02 — <b>20 ekran</b>: Maydon Jamoa, yo'l, konvert va belgi",
    "O'zingiz hammasini yurgizdingiz, endi o'quvchi darsi: m10-02, yigirma ekran. Maydon Jamoa misoli: yopiq va ochiq yo'l, konvert, token bilan ulanish, tinglovchi, belgi va real vaqt sxemasi."
   ],
   [
    "b",
    "Darsning <b>og'ir qismi</b> — 9-ekran kod oynasi va A1: Backend, ilova va Render",
    "O'quvchi darsi o'zi ogohlantiradi: og'ir qism to'qqizinchi ekrandagi kod oynasi va birinchi amaliyot: Backend, ilova va Render. Ikkinchi, to'rtinchi, beshinchi ekranlarga ortiqcha vaqt bermang."
   ],
   [
    "c",
    "A1 da Render uyg'onishi va uchish rejimi kechikadi — <b>oldindan ayting</b>",
    "Birinchi amaliyotda ikki kechikish bor. Render'ning bepul xizmati uxlagan bo'lsa, birinchi ulanish cho'ziladi. Uchish rejimida belgi qirq besh soniyagacha kech qoladi. Oldindan ayting."
   ],
   [
    "d",
    "Xulosa: vaqt — <b>A1 ga ko'proq</b>; belgi va ulanish ishlasa, dars maqsadi bajarilgan",
    "Xulosa: vaqtning ko'pini birinchi amaliyotga bering. Belgi ulangan ko'rsatsa va uchish rejimida o'zgarsa, darsning maqsadi bajarilgan."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "title": "README «Real vaqt»: besh ustun — nuqta, kim nima qiladi, hodisa, kim oladi, ekranda",
  "seg": [
   [
    "a",
    "O'quvchi ikkinchi amaliyotda o'z mahsuloti uchun <b>shu jadvalni</b> yozadi",
    "Xaritada oxirgi blok sxema edi, uni ochamiz. Ikkinchi amaliyotda o'quvchi o'z mahsuloti uchun shu jadvalni yozadi. Maydon Jamoa'dagi namuna besh qator."
   ],
   [
    "b",
    "Har qator: qaysi joy, kim nima qiladi, qaysi hodisa, kim oladi, <b>ekranda nima o'zgaradi</b>",
    "Har qatorda besh ustun: real vaqt nuqtasi, kim nima qiladi, hodisa nomi va sababi, kim oladi va ekranda nima o'zgaradi. Bitta hodisa, besh xil sabab."
   ],
   [
    "c",
    "Hodisa nomi — kichik harf va chiziqcha, <b>bo'lib o'tgan ish</b>: <code>oyin-ozgardi</code>",
    "Kurs qoidasi: hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida: oyin ozgardi. O'quvchi «o'yinni yangila» deb yozsa, shu qoidani eslating."
   ],
   [
    "d",
    "Xulosa: sxema — reja; repo m12-03 da hodisalar <b>aynan shu jadvaldagidek</b> yuboriladi",
    "Xulosa: sxema reja. Repo'ning keyingi tegida Backend aynan shu besh sabab bilan hodisa yuboradi, buni o'n to'rtinchi ekranda ko'rdingiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · sinfda",
  "title": "Yo'l, konvert, belgi — va olti holat",
  "seg": [
   [
    "a",
    "O'quvchi darsi yo'l va konvert deydi — siz <b>atamani birga</b> aytasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: yopiq va ochiq yo'l, konvert, belgi va tinglovchi. O'quvchi shu so'zni aytganda, siz yonida atamasini ham ayting: ochiq yo'l bu doimiy ulanish, konvert esa hodisa."
   ],
   [
    "b",
    "Uch holat <b>belgidan taniladi</b>: kulrang, sariq-yashil, o'zgarmagan belgi",
    "Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasini ilovadagi belgidan tanish mumkin. Belgi bir lahza yashil bo'lib, keyin kulrang bo'lsa, Backend tokenni qabul qilmagan va o'quvchi qayta kirishi kerak. Belgi sariqdan yashilga o'tsa, Backend qayta yongan, bu normal. Uchish rejimida belgi darrov o'zgarmasa, qirq besh soniyagacha kuting."
   ],
   [
    "c",
    "Qolgan uchtasi: son o'zgarmadi, Render cho'zildi, <b>«o'yinchi null»</b>",
    "To'rtinchi holat: son o'zi o'zgarmadi. Bu xato emas, o'quvchining shu darsida hodisa hali qo'shilmagan. Beshinchi holat: birinchi ulanish uzoq cho'zildi, chunki Render'dagi server uxlab qolgan, bir daqiqa kuting. Oltinchi holat: Backend terminalida o'yinchi null chiqdi, sababi kodda return yo'q, buni sakkizinchi ekranda ko'rgansiz."
   ],
   [
    "d",
    "Xulosa: avval belgiga, keyin <b>Backend terminaliga</b> qarang — sabab shu ikkisida",
    "Xulosa va usul: avval belgiga, keyin Backend terminaliga o'quvchi bilan birga qarang. Sabab deyarli doim shu ikkisidan birida ko'rinadi. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "21": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "So'rov–javobda Vali qo'shilsa, Ali'ning soni?",
    "o": [
     "so'ramaguncha eski",
     "o'zi yangilanadi",
     "xato chiqadi",
     "nol bo'ladi"
    ],
    "c": 0,
    "e": "Yo'l faqat so'rovda ochiladi.",
    "s": 2
   },
   {
    "q": "Token qachon tekshiriladi?",
    "o": [
     "har hodisada",
     "ulanish ochilayotganda",
     "har daqiqada",
     "hech qachon"
    ],
    "c": 1,
    "e": "handleConnection.",
    "s": 5
   },
   {
    "q": "Tokensiz ulanishda klient nima ko'radi?",
    "o": [
     "hech narsa",
     "faqat ulangan",
     "bir lahza ulangan, keyin io server disconnect",
     "ping timeout"
    ],
    "c": 2,
    "e": "Ulanish ochiladi va yopiladi.",
    "s": 6
   },
   {
    "q": "Backend o'chsa belgi?",
    "o": [
     "ulangan",
     "ulanmagan",
     "yo'qoladi",
     "ulanmoqda — o'zi qayta urinadi"
    ],
    "c": 3,
    "e": "transport close, active=true.",
    "s": 10
   },
   {
    "q": "«Uchish rejimi»ni socket.io qachon sezadi?",
    "o": [
     "~45 s (ping)",
     "darhol",
     "5 daqiqa",
     "hech qachon"
    ],
    "c": 0,
    "e": "25 s + 20 s.",
    "s": 11
   },
   {
    "q": "Token yaroqsiz, Backend yopdi — belgi?",
    "o": [
     "ulanmoqda",
     "ulanmagan",
     "ulangan",
     "sariq"
    ],
    "c": 1,
    "e": "active=false.",
    "s": 12
   },
   {
    "q": "oyin-ozgardi ichida nima bor?",
    "o": [
     "yangi son",
     "butun ro'yxat",
     "oyinId va sabab",
     "token"
    ],
    "c": 2,
    "e": "Son qayta so'raladi.",
    "s": 14
   },
   {
    "q": "m12-dars-02-done da Vali qo'shilsa Ali'ga?",
    "o": [
     "hodisa",
     "xato",
     "yangi son",
     "hech narsa — hodisa hali yo'q"
    ],
    "c": 3,
    "e": "Hodisa m12-03 da.",
    "s": 15
   }
  ]
 },
 "22": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};

// ============================================================
//  MENTOR KURSI · WebSocket-1 «Doimiy ulanish: Backend o'zi xabar yuboradi»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/19-WS1-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/ws1-out/ (00–08) va ws1-amal-out/ (00–09; amaliyotlar mentor yo'lida)
//  O'quvchi loyihasi maydon-jamoa (m12-dars-02-done · m12-dars-03-done): Backend haqiqiy, ilova o'rniga Node socket.io-client
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws1/parts/*.jsx > WsBasicsMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws1-01-ulanish-v1';
const LESSON_TITLE = "Doimiy ulanish: Backend o'zi xabar yuboradi";
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
// O'quvchi reposi maydon-jamoa (m12-dars-02-done) — haqiqiy fayl nomlari; mentorning kichik klienti (ws1-klient.js)
const RF = { gw: 'backend/src/oyinlar.gateway.ts', ul: 'mobil/src/ulanish.ts', app: 'mobil/src/app/index.tsx', env: 'backend/.env' };
const REPO_FILES = tree(['backend/node_modules/', 'backend/src/app.module.ts', 'backend/src/main.ts', RF.gw, 'backend/src/oyinlar.controller.ts', 'backend/src/royxat.controller.ts', 'backend/src/kirish.controller.ts', 'backend/.env.example', RF.env, 'backend/package.json', 'mobil/src/api.ts', RF.app, RF.ul, 'mobil/package.json', 'README.md']);
const KLIENT_FILES = tree(['node_modules/', 'klient.js', 'package.json', 'package-lock.json']);
MKCFG.files = REPO_FILES;

// Segment: MD'dagi ekran matni (03-matn.gen.jsx) + sahna maydonlari (extras — segment tartibida)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
const mkS = (n, extras = [], more = {}) => {
  const m = MDT[n];
  return { kicker: m.kicker, eyebrow: m.eyebrow, title: m.title, ...more, segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {})) };
};

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish. Uzun ibora oldin.
const SPOKEN = [
  ['m12 dars ikki done', 'm12-dars-02-done'], ['m12 dars uch done', 'm12-dars-03-done'], ['m12 dars uch', 'm12-dars-03'],
  ['socket io', 'socket.io'], ['Socket io', 'socket.io'], ['Handle connection', 'handleConnection'], ['handle connection', 'handleConnection'], ['handshake auth', 'handshake.auth'],
  ['oyin ozgardi', 'oyin-ozgardi'], ['oyinlar gateway', 'OyinlarGateway'], ['maydon jamoa', 'maydon-jamoa'], ['ulanish on', 'ulanish.on'],
  ['Active false', 'active=false'], ['active false', 'active=false'], ['active true', 'active=true'], ['connect error', 'connect_error'],
  ['Ctrl C', 'Ctrl+C'], ['env fayli', '.env fayli'], ["io'ga", "io()'ga"], ['m10-02', 'm10-02'],
];
DIGITS.unshift(["o'n birinchi modulda", '11-Modulda'], ["o'yinchi o'n bir", "o'yinchi 11"], ["to'qqizdan o'n", '9 / 10'], ["to'qqiz qoldi", '9 qoldi'], ["o'nni oldi", "10 ni oldi"], ['yettini oldi', '7 ni oldi'],
  ['qirq besh soniya', '45 soniya'], ['yigirma besh soniya', '25 soniya'], ['yigirma soniya', '20 soniya'], ['besh soniya', '5 soniya'], ['bir-ikki soniyada', '1–2 soniyada'],
  ["o'n besh daqiqa", '15 daqiqa'], ["o'n daqiqa", '10 daqiqa'], ["qirq-oltmish daqiqa", '40–60 daqiqa'], ["to'qqizinchi ekrandagi", '9-ekrandagi'], ["o'n to'rtinchi ekranda", '14-ekranda'],
  ["Ikkinchi, to'rtinchi, beshinchi ekranlarga", '2, 4, 5-ekranlarga'], ["o'yin ikki", "o'yin 2"]);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(/io server disconnect/gi, /io client disconnect/gi, /transport close/gi, /ping timeout/gi, /xhr poll error/gi, /connect error/gi);

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
  if (/HODISA|successfully started|^LOG |\bulangan\b|\[HTTP 20\d\]|^added \d+|CREATE DATABASE|HEAD is now/.test(l)) return `<span class="ok">${escH(l)}</span>`;
  if (/\bulanmoqda\b|Retrying|transport:/.test(l)) return `<span class="wn">${escH(l)}</span>`; // connect_error ham sariq — holat «ulanmoqda»
  if (/\bulanmagan\b|ERROR|error:|\[HTTP 4\d\d\]|ECONNREFUSED/.test(l)) return `<span class="er">${escH(l)}</span>`;
  return escH(l);
}
const tm = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: termLine(l), ...(meta[i + 1] || {}) }));
const rng = (a, b, v) => { const o = {}; for (let i = a; i <= b; i++) o[i] = { ...v }; return o; };
const Term = ({ lines, title = 'terminal', er, beat, focus, style }) => <CodePanel file={title} numbers={false} wrap style={{ background: er ? WS.termEr : WS.term, ...(style || {}) }} lines={lines} beat={beat} focus={focus} />;

// Ilova ekrani — MAKET (telefon/Expo'da sinamadik): belgi matni va rangi o'quvchi ilovasidan (mobil/src/app/index.tsx BELGI), sonlar haqiqiy chiqishdan
const BELGI = { ulangan: ['Ulangan', T.green], ulanmoqda: ['Ulanmoqda…', WS.amber], ulanmagan: ['Ulanmagan', WS.grey] };
function Phone({ who, holat = 'ulangan', rows = [], note, mark, badge = true }) {
  const [m, c] = BELGI[holat];
  return <div className={`ws-ph${mark ? ' ' + mark : ''}`}>
    <div className="top"><span className="who">{who}</span><span className="warn">⚠ maket · sonlar haqiqiy</span></div>
    <div className="hd"><b>O'yinlar</b>{badge && <span className="bg" style={{ color: c }}><i style={{ background: c }} />{m}</span>}</div>
    {rows.map(([n, v, hl], i) => <div key={i} className={`rw${hl ? ' ' + hl : ''}`}><span>{n}</span><b>{v}</b></div>)}
    {note && <div className="nt">{note}</div>}
  </div>;
}

// WebSocket-1 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
`;
function useCss3() {
  useEffect(() => {
    let s = document.getElementById('mk-css-ws1');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws1'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Kod va chiqishlar — maydon-jamoa (m12-dars-02-done, a5e3753) aynan; chiqishlar ws1-out / ws1-amal-out dan
//  (yo'llar va vaqt belgilari o'zgartirilmagan; token — «<Ali tokeni>»)
// ============================================================
// Satr raqami — fayldagi haqiqiy raqam (n); qatorlar oddiy qo'shtirnoqda, ichidagi backtick — kod
const tsN = (arr, start, meta = {}) => arr.map((l, i) => ({ h: tsLine(l), n: start + i, ...(meta[i + 1] || {}) }));
const GW_TS = tsN([
  '@WebSocketGateway()',
  'export class OyinlarGateway implements OnGatewayConnection, OnGatewayDisconnect {',
  "  private readonly log = new Logger('Ulanish');",
  '',
  '  @WebSocketServer()',
  '  server: Server;',
  '',
  '  constructor(private readonly jwt: JwtService) {}',
  '',
  '  handleConnection(ulanish: Socket) {',
  '    const token = ulanish.handshake.auth?.token;',
  '    const oyinchiId = this.tokenYaroqli(token);',
  '    if (!oyinchiId) {',
  '      ulanish.disconnect();',
  '      return;',
  '    }',
  "    // Token egasi — keyingi darslarda kerak bo'ladi (xona, o'z harakati)",
  '    ulanish.data.oyinchiId = oyinchiId;',
  "    this.log.log(`ulandi: o'yinchi ${oyinchiId}`);",
  '  }',
  '',
  '  handleDisconnect(ulanish: Socket) {',
  "    if (ulanish.data.oyinchiId) this.log.log(`uzildi: o'yinchi ${ulanish.data.oyinchiId}`);",
  '  }',
], 11, { 1: { id: 'cls' }, 2: { id: 'cls' }, 10: { id: 'hc' }, 11: { id: 'tok' }, 12: { id: 'tok' }, 13: { id: 'dc' }, 14: { id: 'dc' }, 15: { id: 'dc' }, 16: { id: 'dc' }, 18: { id: 'ok' }, 19: { id: 'ok' } });
const GW_NOTE = tsN([
  '// Token ulanish ochilayotganda tekshiriladi: yo\'q yoki yaroqsiz bo\'lsa — ulanish yopiladi',
  '// (Backend yopgan ulanishga ilova o\'zi qayta ulanmaydi — belgi «Ulanmagan»).',
  '// Hozircha hech qanday hodisa yuborilmaydi va tinglanmaydi — faqat ulanish.',
], 8, { 3: { id: 'x' } });
const UL_TS = tsN([
  "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
  "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
  'function uzilishdanKeyin() {',
  "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
  '}',
  '',
  "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
  '// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.',
  'export async function ulan() {',
  '  if (ulanish) return;',
  '  const token = await tokenOl();',
  '  if (!token || ulanish) return;',
  '',
  '  ulanish = io(API, { auth: { token } });',
  "  holatQoy('ulanmoqda');",
  "  ulanish.on('connect', () => holatQoy('ulangan'));",
  "  ulanish.on('disconnect', uzilishdanKeyin);",
  "  ulanish.on('connect_error', uzilishdanKeyin);",
  '}',
], 24, { 3: { id: 'uz' }, 4: { id: 'uz' }, 14: { id: 'io' }, 15: { id: 'st' }, 16: { id: 'st' }, 17: { id: 'st' }, 18: { id: 'st' } });
const UL_IO = UL_TS.slice(8);
// Mentorning klienti (manba/ws1-klient.js — aynan) — ilovadagi ulanish.ts qoidasi, telefon o'rniga terminalda
const KLIENT_JS = tsN([
  "// klient.js — o'quvchi ilovasidagi mobil/src/ulanish.ts qoidasi, telefon o'rniga terminalda.",
  "// connect → ulangan · uzilish yoki xato → socket.io o'zi urinyaptimi (active)? ulanmoqda : ulanmagan",
  '// Ishga tushirish: TOKEN=<token> node klient.js   (to\'xtatish — Ctrl+C)',
  "const { io } = require('socket.io-client');",
  '',
  "const ulanish = io(process.env.API || 'http://localhost:3000', { auth: { token: process.env.TOKEN } });",
  '',
  'const t0 = Date.now();',
  'const yoz = (matn) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s  ${matn}`);',
  'const uzilishdanKeyin' + ' = (sabab) =>', // ikki bo'lak: preview-keys detektori «…Key… = (…) =>» ni saqlov kaliti deb o'ylamasin
  "  yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (${sabab} · active=${ulanish.active})`);",
  '',
  "ulanish.on('connect', () => yoz('ulangan  (connect)'));",
  "ulanish.on('disconnect', (sabab) => uzilishdanKeyin(`disconnect: ${sabab}`));",
  "ulanish.on('connect_error', (xato) => uzilishdanKeyin(`connect_error: ${xato.message}`));",
  "ulanish.on('oyin-ozgardi', (hodisa) => yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)}`));",
], 1);

// ws1-out/05 — m12-dars-02-done: hodisa yo'q
const OUT05 = tm(String.raw`
$ node hodisa-yoq.js
 1.0s  [Ali] GET /oyinlar (ochilganda) → Mahalla maydoni 2026-11-08 17:00: 9 / 10
 1.1s  [Vali] POST /oyinlar/4/qoshilish → 201
 3.6s  [Ali] 2,5 s kutdi — hodisa kelmadi, ekrandagi son o'zgarmadi
 3.6s  [Ali] GET /oyinlar (pastga tortildi) → Mahalla maydoni 2026-11-08 17:00: 10 / 10`, { 2: { id: 'a' }, 3: { id: 'v' }, 4: { id: 'x' }, 5: { id: 'p' } });
// ws1-out/06 — m12-dars-03-done: hodisa bor
const OUT06 = tm(String.raw`
$ node hodisa-bor.js
 1.0s  [Ali] GET /oyinlar (ochilganda) → Maktab maydoni 2026-11-07 20:00: 6 / 10
 1.1s  [Ali] HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}
 1.1s  [Vali] POST /oyinlar/2/qoshilish → 201
 1.1s  [Ali] GET /oyinlar (hodisa kelgach) → Maktab maydoni 2026-11-07 20:00: 7 / 10`, { 2: { id: 'a' }, 3: { id: 'h' }, 4: { id: 'v' }, 5: { id: 'g' } });
// ws1-out/03 — token bilan
const OUT03 = tm(String.raw`
$ node tokenli.js
 0.0s  [Ali] ulanmoqda  (io() chaqirildi)
 0.0s  [Ali] ulangan  (connect)
 0.5s  [Ali] transport: websocket`, { 3: { id: 'c' }, 4: { id: 't' } });
const BE03 = tm(String.raw`
# Backend terminali:
LOG [Ulanish] ulandi: o'yinchi 11`, { 2: { id: 'l' } });
// ws1-out/02 — tokensiz va soxta token
const OUT02 = tm(String.raw`
$ node tokensiz.js
 0.0s  [tokensiz] ulangan  (connect)
 0.0s  [tokensiz] ulanmagan  (disconnect: io server disconnect · active=false)
 0.0s  [soxta token] ulangan  (connect)
 0.0s  [soxta token] ulanmagan  (disconnect: io server disconnect · active=false)`, { 2: { id: 'c' }, 3: { id: 'x' }, 4: { id: 'c' }, 5: { id: 'x' } });
// ws1-amal-out/05 — Ctrl+C, standart qayta urinish
const AMAL05 = tm(String.raw`
$ TOKEN=<Ali tokeni> node klient.js   # 3 s da Backend terminalida Ctrl+C, 15 s dan keyin npm run start
  0.0s  ulangan  (connect)
  2.8s  ulanmoqda  (disconnect: transport close · active=true)
  3.9s  ulanmoqda  (connect_error: xhr poll error · active=true)
  6.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 11.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 16.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 21.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 26.2s  ulangan  (connect)`, { 3: { id: 'tc' }, 4: { id: 'r' }, 5: { id: 'r' }, 6: { id: 'r5' }, 7: { id: 'r5' }, 8: { id: 'r5' }, 9: { id: 'r5' }, 10: { id: 'ok' } });
// ws1-out/07 — Backend muzlatildi (SIGSTOP): ulanish yopilmagan, javob yo'q
const OUT07 = tm(String.raw`
$ node muzlash.js   # 3 s da Backend muzlatildi (SIGSTOP), 60 s dan keyin davom etdi (SIGCONT)
 0.0s  [Ali] ulangan  (connect)
 2.8s  --- Backend muzlatildi (javob bermaydi, ulanish yopilmagan) ---
45.0s  [Ali] ulanmoqda  (disconnect: ping timeout · active=true)
62.8s  --- Backend davom etdi ---
62.8s  [Ali] ulangan  (connect)`, { 3: { id: 'z' }, 4: { id: 'p' }, 6: { id: 'ok' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ["So'rov va doimiy ulanish", 'Gateway va token', 'Uch holat', 'Hodisa', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — Vali qo'shilishi bilan Ali'ga hodisa keladi</div>
    <Term lines={OUT06} focus={['h', 'g']} title="terminal — maydon-jamoa m12-dars-03-done, haqiqiy" />
  </div>} />;
}

// ============================================================
//  2 · So'ramasa — yangilanmaydi (ws1-out/05)
// ============================================================
const S2 = mkS(2, [{ v: 1, f: ['a'] }, { v: 2, f: ['v', 'x'] }, { v: 3, f: ['p'] }, { v: 3, f: [], sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="ws-phones">
      <Phone who="Ali" rows={[['Mahalla maydoni · 08.11 17:00', seg.v >= 3 ? '10 / 10' : '9 / 10', seg.v === 2 ? 'old' : seg.v >= 3 ? 'new' : '']]} note={seg.v === 2 ? "so'ramagan — son eski" : seg.v >= 3 ? 'pastga tortdi → GET /oyinlar' : 'ochilganda → GET /oyinlar'} mark={seg.v === 2 ? 'bad' : seg.v >= 3 ? 'good' : ''} badge={false} />
      {seg.v >= 2 ? <Phone who="Vali" rows={[['Mahalla maydoni · 08.11 17:00', '10 / 10']]} note="Qo'shilaman → 201" badge={false} /> : <div />}
    </div>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={OUT05} focus={seg.f} title="terminal — m12-dars-02-done, haqiqiy" /></div>
    {seg.sum && <div className="mk-rule">So'rov–javobda yo'l <b>faqat ilova so'raganda</b> ochiladi — Backend o'zi yubora olmaydi.</div>}
  </div>} />;
}

// ============================================================
//  3 · Doimiy ulanish (ws1-out/03; mobil/src/ulanish.ts)
// ============================================================
const S3 = mkS(3, [{ v: 'two' }, { v: 'out' }, { v: 'code' }, { v: 'code', sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.ink3 }}><h4>So'rov–javob</h4><p>ilova so'raydi → Backend javob beradi → yo'l yopiladi</p></div>
      <div className="mk-box hl" style={{ '--c': T.green }}><h4>Doimiy ulanish</h4><p>bir marta ulanadi → yo'l ochiq → ikkala tomon istagan payt yuboradi</p></div>
    </div>
    {seg.v === 'out' && <Term lines={OUT03} focus={['c', 't']} title="terminal — token bilan ulanish (haqiqiy)" />}
    {seg.v === 'code' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={RF.ul} wrap lines={UL_IO} focus={seg.sum ? [] : ['io']} /></Ide></div>}
    {seg.sum && <div className="mk-rule">Doimiy ulanish — ochiq yo'l: Backend xabarni <b>o'zi yubora oladi</b>.</div>}
  </div>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: hodisa so'rovsiz keldi (m12-dars-03-done)</div>
      <Term lines={OUT06} focus={['h']} />
    </div>} />;
}

// ============================================================
//  5 · Gateway (backend/src/oyinlar.gateway.ts, 11–34-satr)
// ============================================================
const S5 = mkS(5, [{ f: ['cls'] }, { f: ['hc', 'tok'] }, { f: ['dc'] }, { f: ['ok'], sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={REPO_FILES} active={RF.gw}><CodePanel file={RF.gw} wrap lines={GW_TS} focus={seg.f} style={{ fontSize: 12.5 }} /></Ide>
    {seg.sum && <div className="mk-rule">Token har so'rovda emas — <b>ulanish ochilayotganda</b> bir marta tekshiriladi.</div>}
  </div>} />;
}

// ============================================================
//  6 · Tokensiz va soxta token (ws1-out/02, 03)
// ============================================================
const S6 = mkS(6, [{ v: 'tok' }, { v: 'no', f: ['c', 'x'] }, { v: 'no', f: ['x'], ph: true }, { v: 'no', f: [], ph: true, sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'tok' ? <div className="pg-two">
      <Term lines={OUT03} focus={['c']} title="klient — token bilan" />
      <Term lines={BE03} focus={['l']} title="Backend terminali" />
    </div> : <div className={seg.ph ? 'pg-two' : ''}>
      <Term er lines={OUT02} focus={seg.f} title="klient — tokensiz va soxta token (haqiqiy)" />
      {seg.ph && <Phone who="Ilova (tokensiz)" holat="ulanmagan" rows={[]} note="Backend yopdi — o'zi qayta urinmaydi" />}
    </div>}
    {seg.sum && <div className="mk-rule">Tokensiz ulanish bir lahza ochiladi va <b>darhol yopiladi</b> — belgi «Ulanmagan».</div>}
  </div>} />;
}

// ============================================================
//  7 · Amaliyot 1 — backend lokal, ulanish (ws1-amal-out/01–04)
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Repo — tayyor holat m12-dars-02-done', cmds: ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-02-done', 'cd backend', 'npm ci'], exp: 'added 282 packages' },
  { t: 'Baza va start — .env namunadan, DATABASE_URL dagi parol o\'zingizniki', cmds: ['psql -U postgres -c "CREATE DATABASE maydon_jamoa;"', 'cp .env.example .env', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Ro'yxat va kirish — yangi terminalda", cmds: ['curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d \'{"ism":"Ali","telefon":"+998 90 000 00 01","parol":"parol123"}\'', 'curl -X POST localhost:3000/kirish -H "Content-Type: application/json" -d \'{"telefon":"+998 90 000 00 01","parol":"parol123"}\''], exp: '{"id":11,"ism":"Ali"} · {"token":"eyJ…"}' },
  { t: 'Ulanish — alohida papkada klient', cmds: ['mkdir ws-klient && cd ws-klient', 'npm i socket.io-client', 'TOKEN=<token> node klient.js'], exp: "klient: ulangan  (connect) · Backend: ulandi: o'yinchi 11" },
];
const P1_CODE = [{ file: 'klient.js', step: 3, lines: KLIENT_JS, copy: true }];
const P1_TROUBLE = [
  ["backend papkasi yo'q", "main tarmog'ida faqat README — avval git checkout -f m12-dars-02-done"],
  ["JWT_SECRET yo'q — backend/.env ga yozing", ".env yo'q — cp .env.example .env"],
  ['password authentication failed · Retrying (1)...', ".env dagi DATABASE_URL parolini o'zingizniki bilan almashtiring"],
  ["409 «Bu telefon ro'yxatdan o'tgan»", "ro'yxat bor — to'g'ridan /kirish"],
  ['klient: ulanmagan (io server disconnect)', "token bo'sh yoki eski — /kirish dan qayta oling (6-ekran)"],
];
const P1_PROOF = { label: 'Backend terminalidagi ulanish satri', placeholder: 'Backend terminalidan satrni qo\'ying', check: (v) => /ulandi: o.yinchi \d+/i.test(v), wrong: "Backend terminalida «LOG [Ulanish]» bilan boshlanadigan satrni butunligicha nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={KLIENT_FILES} />; }

// ============================================================
//  8 · Tekshiruv 2 — LineCheck (5-satr: disconnect'dan keyin return yo'q; ws1-out/08)
// ============================================================
const LC8_SRC = [
  'handleConnection(ulanish: Socket) {',
  '  const token = ulanish.handshake.auth?.token;',
  '  const oyinchiId = this.tokenYaroqli(token);',
  '  if (!oyinchiId) {',
  '    ulanish.disconnect();',
  '  }',
  "  // Token egasi — keyingi darslarda kerak bo'ladi (xona, o'z harakati)",
  '  ulanish.data.oyinchiId = oyinchiId;',
  "  this.log.log(`ulandi: o'yinchi ${oyinchiId}`);",
  '}',
];
const LC8 = LC8_SRC.map((l) => ({ h: tsLine(l) }));
const LC8_FIXED = LC8_SRC.map((l, i) => ({ h: tsLine(l), n: i < 5 ? i + 1 : i + 2 }));
LC8_FIXED.splice(5, 0, { h: tsLine('    return;'), n: 6, neu: true });
const LC8_OK = tm(String.raw`
# return bilan, tokensiz (ws1-amal-out/06):
  0.0s  ulanmagan  (disconnect: io server disconnect · active=false)
# Backend terminalida «ulandi» satri yo'q`);
function Screen8(p) {
  const m = MDT[8];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={RF.gw} lines={LC8} target={4}
    tree={{ root: 'maydon-jamoa', files: REPO_FILES, active: RF.gw }}
    fixed={LC8_FIXED} fixedExtra={[{ file: 'klient va Backend — return bilan (haqiqiy)', lines: LC8_OK }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  9 · Uch holat (mobil/src/ulanish.ts; belgi — mobil/src/app/index.tsx)
// ============================================================
const B9 = [
  ['ulangan', T.green, "yo'l ochiq — hodisalar keladi", 'connect'],
  ['ulanmoqda', WS.amber, "yo'l yo'q, socket.io o'zi urinmoqda", 'active=true'],
  ['ulanmagan', WS.grey, 'hech kim urinmayapti — Backend yoki ilova yopgan', 'active=false'],
];
const S9 = mkS(9, [{ hl: [], f: ['st'] }, { hl: [0, 1], f: ['uz'] }, { hl: [2], f: ['uz'] }, { hl: [1, 2], f: [], sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="ws-badges">{B9.map(([k, c, d, code], i) => <div key={k} className={`ws-badge${seg.hl.includes(i) ? ' hl' : (seg.hl.length ? ' dim' : '')}`} style={{ '--c': c }}>
      <span className="bg"><i />{BELGI[k][0]}</span><p>{d}</p><p><code>{code}</code></p>
    </div>)}</div>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={RF.ul} wrap lines={UL_TS} focus={seg.f} style={{ fontSize: 12.5 }} /></Ide></div>
    {seg.sum && <div className="mk-rule">«Ulanmoqda» — o'tib ketadi, kutish kifoya; «Ulanmagan» — <b>kimdir nimadir qilishi kerak</b>: qayta kirish, yangi token.</div>}
  </div>} />;
}

// ============================================================
//  10 · Backend o'chdi va qayta yondi (ws1-amal-out/05, standart sozlama)
// ============================================================
const S10 = mkS(10, [{ f: ['tc'] }, { f: ['r', 'r5'] }, { f: ['ok'] }, { f: [], sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term lines={AMAL05} focus={seg.f} title="klient — socket.io standart sozlamasi (haqiqiy)" />
    <div className="pg-two">
      <Phone who="Ali" holat={seg.f.includes('ok') || seg.sum ? 'ulangan' : 'ulanmoqda'} rows={[]} note={seg.f.includes('ok') || seg.sum ? '26.2 s — o\'zi qaytdi' : 'Backend yo\'q — urinyapti'} />
      <div className="mk-card"><h5>Vaqt</h5><div style={{ fontSize: 14, lineHeight: 1.55 }}>Ctrl+C — 2.8 s · Backend qayta tayyor — ~21.6 s · klient ulandi — <b>26.2 s</b><br /><span style={{ color: T.ink2 }}>urinishlar oralig'i o'sadi va 5 s da to'xtaydi (socket.io standarti)</span></div></div>
    </div>
    {seg.sum && <div className="mk-rule">Backend qayta yonsa, <b>ilova o'zi qaytadi</b> — bir necha soniya «Ulanmoqda…» normal.</div>}
  </div>} />;
}

// ============================================================
//  11 · «Uchish rejimi» — 45 soniya (ws1-out/07; engine.io pingInterval 25000 + pingTimeout 20000)
// ============================================================
const S11 = mkS(11, [{ f: [], v: 0 }, { f: ['z'], v: 1 }, { f: ['p', 'ok'], v: 2 }, { f: ['p'], v: 2, sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 0 ? <div className="mk-card"><h5>O'quvchi darsi m10-02 · A1, 4-qadam (2)</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«Telefonda uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — <b>darhol o'zgarmasligi mumkin</b>: uzilishni aniqlash vaqt oladi (bir daqiqagacha).»</div></div>
      : <Term lines={OUT07} focus={seg.f} title="klient — Backend muzlatildi: ulanish yopilmagan, javob yo'q (haqiqiy)" />}
    {seg.v === 2 && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>pingInterval · 25 s</h4><p>Backend shu oraliqda «ping» yuboradi</p></div>
      <div className="mk-box" style={{ '--c': T.yellow }}><h4>pingTimeout · 20 s</h4><p>javob kelmasa — yana shuncha kutiladi</p></div>
    </div>}
    {seg.v === 2 && <div className="mk-tag" style={{ margin: 0 }}>engine.io standart qiymatlari (node_modules/engine.io) · 25 + 20 = 45 s</div>}
    {seg.sum && <div className="mk-rule">Uchish rejimida belgi <b>45 soniyagacha</b> kech qoladi — bu normal, kuting.</div>}
  </div>} />;
}
// ============================================================
//  12 · Tekshiruv 3 — tokensiz ulanishda belgi
// ============================================================
function Screen12(p) {
  const m = MDT[12];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Term er lines={OUT02} focus={['x']} />
    </div>} />;
}

// ============================================================
//  13 · Amaliyot 2 — holatlarni kuzatish (ws1-amal-out/05, 06)
// ============================================================
const P2 = mkS(13, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Ulanish — Backend yoniq, klient token bilan', cmds: ['TOKEN=<token> node klient.js'], exp: 'ulangan  (connect)' },
  { t: "To'xtatish — Backend terminalida Ctrl+C", cmds: [], exp: 'ulanmoqda  (disconnect: transport close · active=true), keyin connect_error' },
  { t: 'Yoqish — Backend terminalida', cmds: ['npm run start'], exp: '5 s gacha ichida: ulangan  (connect)' },
  { t: 'Tokensiz — klientni Ctrl+C, keyin', cmds: ['TOKEN= node klient.js'], exp: 'ulangan, darhol ulanmagan  (disconnect: io server disconnect · active=false)' },
];
const P2_TROUBLE = [
  ['3-qadamda bir necha soniya yana connect_error', 'Backend yonguncha va navbatdagi urinishgacha (har 5 s) — kuting (10-ekran)'],
  ['4-qadamda ulanmagan bo\'lmadi, ulangan qoldi', "TOKEN= bo'sh emas — eski token qolgan; buyruqni aynan TOKEN= node klient.js deb yozing"],
];
const P2_PROOF = { label: '2-qadamdagi uzilish sababi', placeholder: "disconnect: dan keyingi so'zlarni yozing", check: (v) => /transport close/i.test(v), wrong: "Ctrl+C dan keyingi birinchi «ulanmoqda» satrida qavs ichidagi sababni yozing" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={P1_CODE.map((c) => ({ ...c, step: 0 }))} tree={KLIENT_FILES} />; }

// ============================================================
//  14 · Hodisa — konvertda son yo'q (ws1-out/06; m12-dars-03-done gateway va controller)
// ============================================================
const GW03_TS = tsN([
  'oyinOzgardi(oyinId: number, sabab: OyinSababi) {',
  "  this.server.emit('oyin-ozgardi', { oyinId, sabab });",
  '}',
], 37, { 2: { id: 'e' } });
const CTRL03_TS = tsN([
  "      await this.yoz(jadval, id, men, 'qoshildi', !!qator);",
  "      return { holat: 'qoshildi' };",
  '    });',
  "    // Tranzaksiya tugagach (yozuv Database'da) — hodisa",
  "    this.ulanishlar.oyinOzgardi(id, 'qoshildi');",
], 138, { 1: { id: 'y' }, 4: { id: 'h' }, 5: { id: 'h' } });
const S14 = mkS(14, [{ f: ['a', 'h'], code: 'ctrl' }, { f: ['h'], code: 'gw' }, { f: ['h', 'g'], ph: true }, { f: [], ph: true, sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={OUT06} focus={seg.f} title="terminal — m12-dars-03-done, haqiqiy" /></div>
    {seg.code === 'ctrl' && <CodePanel file="backend/src/oyinlar.controller.ts · m12-dars-03-done" wrap lines={CTRL03_TS} focus={['h']} />}
    {seg.code === 'gw' && <CodePanel file="backend/src/oyinlar.gateway.ts · m12-dars-03-done" wrap lines={GW03_TS} focus={['e']} />}
    {seg.ph && <div className="ws-phones">
      <Phone who="Ali" rows={[['Maktab maydoni · 07.11 20:00', '7 / 10', 'new']]} note="hodisa → GET /oyinlar" mark="good" />
      <div className="mk-card"><h5>Konvert ichida</h5><div style={{ fontFamily: MONO, fontSize: 14 }}>{'{ "oyinId": 2, "sabab": "qoshildi" }'}</div><div style={{ fontSize: 13.5, color: T.ink2, marginTop: 6 }}>son yo'q — ilova o'zi qayta so'raydi</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">Hodisa «nima o'zgardi» deydi — haqiqiy son Backend'dan <b>qayta olinadi</b>.</div>}
  </div>} />;
}

// ============================================================
//  15 · m12-dars-02 — hodisa hali yo'q (ws1-out/05 va 06; o'quvchi darsi s9 — namuna oyna)
// ============================================================
const S15 = mkS(15, [{ v: 'note' }, { v: 'stud' }, { v: 'two' }, { v: 'two', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'note' && <Ide files={REPO_FILES} active={RF.gw}><CodePanel file={RF.gw} wrap lines={GW_NOTE} focus={['x']} /></Ide>}
    {seg.v === 'stud' && <div className="mk-card"><h5>O'quvchi darsi m10-02 · 9-ekran (kod oynasi)</h5><div style={{ fontFamily: MONO, fontSize: 14 }}>ulanish.on('oyin-ozgardi', korsat)</div><div style={{ fontSize: 13.5, color: T.ink2, marginTop: 6 }}>namuna oynada: hodisani tugma yuboradi, haqiqiy Backend emas</div></div>}
    {seg.v === 'two' && <div className="pg-two">
      <div style={{ display: 'grid', gap: 6 }}><div className="mk-tag" style={{ margin: 0 }}>m12-dars-02-done — bugungi o'quvchi natijasi</div><Term lines={OUT05.slice(2)} focus={['x']} /></div>
      <div style={{ display: 'grid', gap: 6 }}><div className="mk-tag" style={{ margin: 0 }}>m12-dars-03-done — hodisa bor</div><Term lines={OUT06.slice(2)} focus={['h']} /></div>
    </div>}
    {seg.sum && <div className="mk-rule">Bugungi natija — <b>ulanish va belgi</b>; hodisa — m12-dars-03 tegida.</div>}
  </div>} />;
}

// ============================================================
//  16 · Tekshiruv 4 — hodisa kelgach
// ============================================================
function Screen16(p) {
  const m = MDT[16];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: hodisadan keyin qayta so'raldi</div>
      <Term lines={OUT06} focus={['h', 'g']} />
    </div>} />;
}

// ============================================================
//  17 · Amaliyot 3 — hodisani ko'rish (ws1-amal-out/07–08)
// ============================================================
const P3 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Teg — Backend terminalida Ctrl+C, keyin (.env joyida qoladi)', cmds: ['git checkout -f m12-dars-03-done', 'npm ci', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Vali — ikkinchi akkaunt (telefon +998 90 000 00 02)", cmds: ['curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d \'{"ism":"Vali","telefon":"+998 90 000 00 02","parol":"parol123"}\'', 'curl -X POST localhost:3000/kirish -H "Content-Type: application/json" -d \'{"telefon":"+998 90 000 00 02","parol":"parol123"}\''], exp: 'ikkinchi token' },
  { t: 'Ali — klient Ali tokeni bilan', cmds: ['TOKEN=<Ali tokeni> node klient.js'], exp: 'ulangan  (connect)' },
  { t: "Qo'shilish — Vali 2-o'yinga", cmds: ['curl -X POST localhost:3000/oyinlar/2/qoshilish -H "Authorization: Bearer <Vali tokeni>"'], exp: '{"holat":"qoshildi"} · Ali klientida: HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}' },
];
const P3_TROUBLE = [
  ['201, lekin hodisa kelmadi', "Backend hali m12-dars-02 kodi bilan — git log --oneline -1 da 64283b2 m12-03 bo'lsin; Ctrl+C va qayta npm run start"],
  ["409 «O'yin to'ldi» yoki «Siz bu o'yinga qo'shilgansiz»", "boshqa o'yin id sini oling: curl localhost:3000/oyinlar -H \"Authorization: Bearer <Vali tokeni>\""],
];
const P3_PROOF = { label: "Ali'ga kelgan hodisa satri", placeholder: 'klient terminalidan HODISA satrini qo\'ying', check: (v) => /oyin-ozgardi.*qoshildi/i.test(v), wrong: "Ali klientida «HODISA oyin-ozgardi» bilan boshlanadigan satrni butunligicha nusxalang" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  18 · m10-02 xaritasi (WebSocketBasicsLesson.jsx — SCREEN_META 20)
// ============================================================
const MAP18 = [
  { t: 'Kirish', s: 's0–s1', d: 'ekran yangilanmaydi · reja', m: "so'rovsiz eski son (2-ekran)" },
  { t: 'Ulanish', s: 's2–s8', d: "yo'l yopiq / ochiq · konvert · token bilan ulanish", m: 'gateway kodi (5-ekran) · tokensiz (6-ekran)' },
  { t: 'Tinglovchi', s: 's9', d: 'kod oynasi (namuna)', m: "m12-02 da hodisa yo'q (15-ekran)" },
  { t: 'Holat', s: 's10–s11', d: "uch belgi · uzilishda hodisa yo'qoladi", m: '5 s va 45 s (10–11-ekran)' },
  { t: 'Sxema va amaliyot', s: 's12–s14, A1, A2', d: "real vaqt sxemasi · A1 o'z repo + Render + telefon · A2 README", m: "Render va telefon — sinfda (biz sinamadik)" },
];
const S18 = mkS(18, [{ hl: [] }, { hl: [2, 4] }, { hl: [3, 4], warn: true }, { hl: [4], sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP18.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.warn && <div className="n2-warn">A1: Render'ning bepul xizmati uxlagan bo'lsa, birinchi ulanish cho'ziladi (o'quvchi darsi: «bir daqiqagacha kuting»); uchish rejimida belgi 45 s gacha kech qoladi. Render va telefonni <b>o'zimiz sinamadik</b>.</div>}
    {seg.sum && <div className="mk-rule">Vaqtning ko'pini <b>A1 ga</b> bering: belgi «Ulangan» va uchish rejimida o'zgarsa — maqsad bajarilgan.</div>}
  </div>} />;
}

// ============================================================
//  19 · Real vaqt sxemasi (maydon-jamoa README «Real vaqt», m12-dars-02-done — aynan)
// ============================================================
const RT19 = [
  ["«8 / 10» va qo'shilganlar ro'yxati", "o'yinchi «Qo'shilaman» ni bosadi", 'qoshildi', "«8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi"],
  ["«8 / 10» va qo'shilganlar ro'yxati", "o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa)", 'chiqdi', "son va ro'yxat yangilanadi"],
  ['«Kelaman» belgilari', "o'yinchi «Kelaman» ni bosadi", 'tasdiqladi', '«Kelishini tasdiqladi: 7 / 9» → «8 / 9»'],
  ['«Navbatda: N»', "o'yinchi navbatga yoziladi", 'navbatga-yozildi', '«Navbatda: 1»'],
  ["o'yinlar ro'yxati", "tashkilotchi o'yin e'lon qiladi", 'elon-berildi', 'ro\'yxatda yangi karta'],
];
const S19 = mkS(19, [{ col: -1 }, { col: 9 }, { col: 2 }, { col: -1, sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <div style={{ display: 'grid', gap: 10 }}>
    <div className="mk-light" style={{ padding: 12, overflow: 'auto' }}>
      <div className="mk-tag">README.md · ## Real vaqt</div>
      <table className="mk-tbl" style={{ fontSize: 12.5 }}><thead><tr>{['Real vaqt nuqtasi', 'Kim nima qiladi', 'Hodisa', 'Kim oladi', "Ekranda nima o'zgaradi"].map((h, i) => <th key={h} style={{ textAlign: 'left', color: seg.col === 9 || seg.col === i ? T.accent : T.ink2 }}>{h}</th>)}</tr></thead>
        <tbody>{RT19.map((r) => <tr key={r[2]}><td>{r[0]}</td><td>{r[1]}</td><td style={{ background: seg.col === 2 ? '#FFF7F3' : 'transparent' }}><code>oyin-ozgardi</code> · sabab <code>{r[2]}</code></td><td>hamma ulangan ilova</td><td>{r[3]}</td></tr>)}</tbody></table>
      <div style={{ fontSize: 13, color: T.ink2, marginTop: 8 }}><code>oyin-ozgardi</code> — <code>{'{ oyinId, sabab }'}</code>. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.</div>
    </div>
    {seg.sum && <div className="mk-rule">Sxema — reja: m12-dars-03 da hodisalar <b>aynan shu besh sabab</b> bilan yuboriladi (14-ekran).</div>}
  </div>} />;
}

// ============================================================
//  20 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT20 = [["yopiq yo'l · ochiq yo'l", "so'rov–javob · doimiy ulanish"], ['konvert', 'hodisa (oyin-ozgardi)'], ['belgi', 'ulanish holati (active)'], ['tinglovchi', "ulanish.on(…)"]];
const STUMBLE20 = [
  ['Bir lahza yashil, keyin kulrang', 'io server disconnect', 'token — qayta kirish'],
  ['Sariq, keyin yashil', 'transport close', 'Backend qayta yondi — 5 s gacha, normal'],
  ["Uchish rejimida o'zgarmadi", '45 s gacha', 'kuting'],
  ["Son o'zi o'zgarmadi", "hodisa yo'q (m12-02)", 'xato emas'],
  ["Birinchi ulanish cho'zildi", "Render uxlagan (sinamadik)", 'bir daqiqa'],
  ["Backend terminali «o'yinchi null»", "return yo'q", '8-ekran'],
];
const QA20 = [
  ['«WebSocket va socket.io bir narsami?»', 'socket.io — kutubxona, imkon bo\'lsa WebSocket orqali ulanadi (3-ekran: transport websocket).'],
  ['«Nega hodisada son yo\'q?»', "ikki kishi birdan qo'shilsa adashmasin — son Backend'dan."],
  ['«Uzilgan paytdagi hodisa keyin keladimi?»', "bu loyihada yo'q — o'quvchi darsi s11: uzilgan paytdagi hodisa keyin ham kelmaydi, son eski qoladi; pastga tortib yangilanadi."],
  ['«Token muddati tugasa?»', "keyingi ulanishda Backend yopadi — «Ulanmagan», qayta kirish."],
];
const S20 = mkS(20, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen20(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <table className="mk-tbl"><tbody>{DICT20.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
    </div> : <div className="mk-qa">
      {STUMBLE20.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Avval <b>belgiga</b>, keyin <b>Backend terminaliga</b> o'quvchi bilan birga qarang — sabab deyarli doim shu ikkisida.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA20.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
// ============================================================
//  21 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[21].final;
function Screen21(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: so'rov va ulanish, token, uch holat va hodisa. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m10-02 dagi ulanish, belgi va sinfdagi holatlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  22 · Yakun (M13)
// ============================================================
const SUM22 = [
  { k: 'yol', t: "So'rov–javobda yo'l faqat so'rovda ochiladi; doimiy ulanishda ikkala tomon istagan payt yuboradi", st: ['app', 'yol', 'be'] },
  { k: 'gw', t: "Gateway: token ulanish ochilayotganda tekshiriladi; yaroqsiz — disconnect() va return", st: ['yol', 'be'] },
  { k: 'tok', t: "Tokensiz: bir lahza «ulangan», keyin «ulanmagan» (io server disconnect, active=false)", st: ['app', 'be'] },
  { k: 'hol', t: "Backend o'chsa «ulanmoqda» va o'zi qaytadi (5 s gacha); uchish rejimi — 45 s gacha", st: ['app', 'yol'] },
  { k: 'hod', t: "Hodisa oyin-ozgardi { oyinId, sabab } — son qayta so'raladi; m12-dars-02 da hodisa yo'q", st: ['be', 'yol', 'app'] },
  { k: 'dars', t: "m10-02: vaqt A1 ga; Render uyg'onishi va uchish rejimi kechikishini oldindan ayting", st: ['app'] },
];
const STATIONS22 = [['app', 'ilova · belgi', T.blue], ['yol', 'doimiy ulanish', T.purple], ['be', 'Backend · gateway', T.green]];
function SummaryMap22({ hl }) {
  const cur = SUM22.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — ulanish yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
      {STATIONS22.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK22 = [
  { t: "Gateway: o'zgarish bazaga yozilgach hodisa — m12-dars-03 dagi oyinOzgardi kabi (o'z loyihangizda yoki maydon-jamoa nusxasida)", c: ["this.server.emit('…', { id, sabab });"] },
  { t: 'Ikki klient: ikki token bilan klient.js — ikkalasi ulangan', c: ['TOKEN=<1-token> node klient.js', 'TOKEN=<2-token> node klient.js'] },
  { t: "Hodisa: o'zgarish → ikkinchi klientda hodisa → GET bilan yangi son", c: [] },
  { t: "Uzilish: Backend'da Ctrl+C → ulanmoqda → npm run start → ulangan", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "real vaqt hodisa"', 'git push'] },
];
const CHEATSHEET22 = `# WebSocket — mentor eslatmasi (doimiy ulanish)
## Ulanish
so'rov–javob: yo'l faqat ilova so'raganda; Backend o'zi yubora olmaydi (Vali 201 — Ali'da 9 / 10 qoladi)
doimiy ulanish: ilova bir marta ulanadi, yo'l ochiq; socket.io imkon bo'lsa WebSocket orqali (transport: websocket)
ilova: io(API, { auth: { token } }) — token ulanish ochilayotganda yuboriladi (mobil/src/ulanish.ts)
## Gateway (backend/src/oyinlar.gateway.ts)
handleConnection: token = ulanish.handshake.auth?.token → tokenYaroqli (JWT_SECRET) → yo'q bo'lsa disconnect(); return;
return unutilsa: Backend «ulandi: o'yinchi null» deb yozadi (klient baribir uzilgan)
## Uch holat (active)
ulangan — connect · ulanmoqda — active=true (transport close, ping timeout, connect_error) · ulanmagan — active=false (io server disconnect, io client disconnect)
Backend Ctrl+C → ulanmoqda, urinish 1 s, 2 s, keyin har 5 s → Backend yongach 5 s gacha ichida ulangan
uchish rejimi / muzlash: ping timeout 45 s da (pingInterval 25 s + pingTimeout 20 s)
## Hodisa
oyin-ozgardi { oyinId, sabab } — sabab: qoshildi · chiqdi · tasdiqladi · navbatga-yozildi · elon-berildi; son yo'q — GET /oyinlar
m12-dars-02-done: hodisa hali yuborilmaydi · m12-dars-03-done: o'zgarish bazaga yozilgach server.emit
## Mentor amaliyoti (lokal)
git checkout -f m12-dars-02-done (main'da backend/ yo'q) · cd backend · npm ci · cp .env.example .env · npm run start
.env yo'q: JWT_SECRET yo'q — backend/.env ga yozing · parol xato: password authentication failed · takror: 409
## O'quvchi darsidagi so'zlar (m10-02)
yopiq / ochiq yo'l · konvert (hodisa) · belgi (holat) · tinglovchi (ulanish.on)
## Sizning uyga vazifangiz
bitta hodisa (o'zgarish yozilgach) + ikki klient + uzilishni ko'rish → GitHub → repo linki platformadagi uyga vazifaga`;
const s22Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "So'rov–javob — yo'l so'rovda; <b>doimiy ulanish</b> — ochiq yo'l", "Birinchi: so'rov va javobda yo'l faqat ilova so'raganda ochiladi. Doimiy ulanishda ikkala tomon istagan payt yuboradi.", { hl: 'yol' }),
  sg('b2', "Gateway: token <b>ulanishda</b> tekshiriladi, keyin return", "Ikkinchi: gateway tokenni ulanish ochilayotganda tekshiradi. Yaroqsiz bo'lsa disconnect va return.", { hl: 'gw' }),
  sg('b3', "Tokensiz — bir lahza ulangan, keyin <b>ulanmagan</b>", "Uchinchi: tokensiz ulanish bir lahza ochiladi va Backend yopadi. Belgi ulanmagan, ilova o'zi qayta urinmaydi.", { hl: 'tok' }),
  sg('b4', "Backend o'chsa <b>ulanmoqda</b>; uchish rejimi — 45 soniya", "To'rtinchi: Backend o'chsa belgi ulanmoqda va ilova o'zi qaytadi. Uchish rejimida belgi qirq besh soniyagacha kech qoladi.", { hl: 'hol' }),
  sg('b5', "Hodisada <b>son yo'q</b> — qayta so'raladi", "Beshinchi: oyin ozgardi hodisasida faqat o'yin va sabab. Yangi son Backend'dan qayta so'raladi. m12 dars ikki done da hodisa hali yo'q.", { hl: 'hod' }),
  sg('b6', "m10-02: vaqtni <b>A1 ga</b> bering", "Oltinchi: o'quvchi darsida vaqtning ko'pi birinchi amaliyotga. Render va uchish rejimidagi kechikishni oldindan ayting.", { hl: 'dars' }),
  sg('hw', "<b>Uyga vazifa</b>: bitta hodisa, ikki klient va uzilish", "Uyga vazifa: o'z loyihangizda yoki maydon jamoa nusxasida bitta hodisa qo'shing: o'zgarish bazaga yozilgach yuborilsin. Ikkinchi klient uni olib, sonni qayta so'rasin. Bir marta Backend'ni o'chirib, holatlarni ko'ring.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: ulanish, gateway, holatlar va hodisa — bir sahifada", "Pastda bir sahifalik eslatma: ulanish, gateway, uch holat va vaqtlar, hodisa, mentor amaliyoti va o'quvchi tili. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen22(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET22;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'websocket-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s22Segments(passed), [passed]);
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
            <SummaryMap22 hl={hl} />
            <div className="mk-plan">{SUM22.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK22.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> token ulanishda · disconnect'dan keyin return · hodisada son yo'q · ikkinchi klient qayta so'raydi.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>WebSocket: ulanish uzilsa</div><div style={{ fontSize: 13.5, color: T.ink2 }}>uzilish, takror hodisa, qayta ulanish</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · WebSocket</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 8-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: NestJS va PostgreSQL darslari o'tilgan (lokal PostgreSQL) · Node.js 20+ · VS Code · ikkita terminal", "Loyiha: o'quvchi reposi maydon-jamoa (m12-dars-02-done va m12-dars-03-done) va kichik klient (klient.js)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP1, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenP2, Screen14, Screen15, Screen16, ScreenP3, Screen18, Screen19, Screen20, Screen21, Screen22];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WsBasicsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
