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
//  WEBSOCKET-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws2-matn.py (manba: 21-WS2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Agent «bajardim» dedi. Uch usul bilan buzib ko'ramiz",
  "seg": [
   [
    "a",
    "Agent «bajardim» degan ishni <b>uch usul bilan buzib</b>, tekshirib ko'ramiz",
    "Assalomu alaykum. Oldingi darsda ulanish va belgini ko'rdik. Endi agent «uchala chekka holatni bajardim» degan ilovani uch usul bilan buzib, tekshirib ko'ramiz."
   ],
   [
    "b",
    "Avval talab va <b>buzish yozuvi</b>, keyin internet uzilishi",
    "Avval talab va buzish yozuvi: nima qildim, nima kutdim, nima bo'ldi. Keyin birinchi usul, internetni uzish."
   ],
   [
    "c",
    "Keyin Backend'ning yangi versiyasi: ikki xato va <b>bitta faylda tuzatish</b>",
    "Keyin Backend'ning yangi versiyasi. U ikki xatoni ochadi. Uchala xato bitta faylda tuzatiladi, Backend o'zgarmaydi."
   ],
   [
    "d",
    "Uch xato — haqiqiy yurgizilgan; uch amaliyot. <b>Shoshilmang</b>: Davom ustozdan keyin",
    "Uchala xatoni o'quvchilar loyihasida haqiqiy yurgizdik. Uchta amaliyot bor. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · talab",
  "title": "README'da uch chekka holat; agent «bajardim» degan — hech kim tekshirmagan",
  "seg": [
   [
    "a",
    "README'da <b>uchta chekka holat</b> yozilgan: uzilish, takror, fon",
    "Avval talabni ko'raylik. Maydon Jamoa README'sida uchta chekka holat yozilgan. Birinchi: internet uzilib qaytsa, ro'yxat yangi holatni ko'rsatsin."
   ],
   [
    "b",
    "Ikkinchisi — bitta o'zgarish <b>bir marta</b>; uchinchisi — fondan qaytganda yangi holat",
    "Ikkinchi: bitta o'zgarish ekranni bir marta yangilasin, qayta ulangandan keyin ham. Uchinchi: ilova fonda bo'lganda o'zgarish bo'lsa, qaytganda yangi holat ko'rinsin."
   ],
   [
    "c",
    "Agent «bajardim» dedi — <b>bu da'vo</b>: kodda qayta ulanish maxsus boshqarilmaydi",
    "Agent uchalasini bajardim dedi. Lekin bu da'vo, hech kim tekshirmagan. Repo yozuvida ochiq yozilgan: qayta ulanish maxsus boshqarilmaydi."
   ],
   [
    "d",
    "Xulosa: «bajardim» — tekshiruv emas; tekshiruv — <b>buzib ko'rish</b>",
    "Xulosa: agentning bajardim degani tekshiruv emas. Tekshiruv bitta: shu holatni ataylab chaqirib, ekranga qarash. O'quvchi darsi shu fikrdan boshlanadi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · talab",
  "title": "Har urinish: nima qildim · nima kutdim · nima bo'ldi → belgi",
  "seg": [
   [
    "a",
    "Buzish yozuvi — har urinishga <b>bitta qator</b>, besh ustun",
    "Talabni ko'rdik, endi uni qanday tekshirib yozish. Buzish yozuvida har urinishga bitta qator: usul, nima qildim, nima kutdim, nima bo'ldi va belgi."
   ],
   [
    "b",
    "«Nima kutdim» — talabdan; «Nima bo'ldi» — ekranda ko'rgan, <b>taxmin emas</b>",
    "Nima kutdim, talabdan olinadi. Nima bo'ldi, ekranda ko'rganingiz, taxmin emas. Belgi shu ikkisini solishtirib qo'yiladi: buzildi yoki buzilmadi."
   ],
   [
    "c",
    "Mentor misolida: ikki usul buzdi, <b>fonga olish buzmadi</b>",
    "Mentor misolida uch urinishdan ikkitasi buzdi: internetni uzish va yangi versiya. Fonga olib qaytarish buzmadi. Nega, o'n beshinchi ekranda ko'ramiz."
   ],
   [
    "d",
    "Xulosa: «buzilmadi» — <b>shu telefonda, shu urinishda</b>; hamma telefon uchun isbot emas",
    "Xulosa: buzilmadi degani faqat shu telefonda va shu urinishda. Bu hamma telefon uchun isbot emas. O'quvchi ham shunday yozadi."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · uzilish",
  "title": "Belgi yana «Ulangan», lekin ekranda 6 / 10 — Backend'da 7 / 10",
  "seg": [
   [
    "a",
    "Birinchi usul: Ali'ning <b>internetini uzdik</b> — belgi «Ulanmoqda»",
    "Yozuv qanday bo'lishini bildik, endi birinchi urinish: internetni uzish. Ali ilovani ochdi: olti. Keyin uning internetini uzdik. Belgi ulanmoqda bo'ldi, bu kutilgan."
   ],
   [
    "b",
    "Uzilish paytida Sardor qo'shildi — Backend 201 qaytardi va <b>hodisa yubordi</b>",
    "Shu paytda Sardor o'yinga qo'shildi. Backend ikki yuz bir qaytardi va hamma ulangan ilovaga hodisa yubordi. Ali esa hozir ulanmagan."
   ],
   [
    "c",
    "Internet qaytdi, belgi «Ulangan» — lekin <b>Ali'da 6, Backend'da 7</b>",
    "Internet qaytdi, belgi yana ulangan. Lekin Ali'ning ekranida hali olti, Backend'da esa yetti. Talab buzildi: ro'yxat yangi holatni ko'rsatmayapti."
   ],
   [
    "d",
    "Xulosa: belgi «Ulangan» — bu ekrandagi <b>son to'g'ri degani emas</b>",
    "Xulosa: belgi ulangan bo'lishi ekrandagi son to'g'ri degani emas. Mentor misolidagi buzish yozuvi ham aynan shuni yozgan: buzildi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · uzilish",
  "title": "Uzilish paytidagi hodisa keyin kelmaydi — qayta ulanganda GET /oyinlar",
  "seg": [
   [
    "a",
    "Backend hodisani <b>faqat hozir ulangan</b> ilovalarga yuboradi — navbatga qo'ymaydi",
    "Nega son eski qoldi? Backend hodisani faqat hozir ulangan ilovalarga yuboradi. Uzilgan ilova uchun navbatga qo'ymaydi. Qayta ulangach ham u kelmaydi."
   ],
   [
    "b",
    "Tuzatish: <code>connect</code> ichida bitta qator qo'shiladi — ro'yxatni qayta so'rash <b><code>qaytaSora()</code></b>",
    "Tuzatish bitta qator: connect ichida qayta so'rash. Connect har qayta ulanishda ishlaydi, demak ulanish tiklangan zahoti ilova yangi sonni oladi."
   ],
   [
    "c",
    "Tuzatilgan ilova: qayta ulandi va <b>darhol 8 / 10</b> — Backend bilan bir xil",
    "Tuzatilgan ilovada xuddi shu sinov: uzilish paytida Jasur qo'shildi, qayta ulangach darhol so'radi va sakkiz oldi. Backend'da ham sakkiz."
   ],
   [
    "d",
    "Xulosa: qayta ulanish — <b>«nima o'tkazib yubordim?»</b> deb qayta so'rash payti",
    "Xulosa: qayta ulanish, nimani o'tkazib yubordim deb qayta so'rash payti. O'quvchi darsi buni bir gap bilan aytadi: uzilish paytidagi hodisa keyin kelmaydi."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Uzilish paytida Sardor qo'shildi. Belgi yana «Ulangan». Eski ilovada ekranda nima?",
  "q": "Uzilish xatosini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Uzilish paytida Sardor qo'shildi, belgi yana ulangan. Tuzatilmagan ilovada ekranda nima turadi? Variantni tanlang.",
  "ok": "To'g'ri. Hodisa faqat ulangan ilovaga ketdi, keyin kelmaydi. Shuning uchun ekranda eski son qoladi. Tuzatish shunday: ilova qayta ulanganda sonni Backend'dan qayta so'raydi. Demak, uzilish paytida o'tkazib yuborilgan hodisa qaytib kelmaydi, ma'lumotni qayta so'rash kerak.",
  "okShort": "Eski son: uzilish paytidagi hodisa keyin kelmaydi.",
  "hint": "Hodisa yuborilganda Ali ulangan edimi?",
  "correct": 1,
  "opts": [
   "Yangi son — hodisa qayta ulangach keladi",
   "Eski son — uzilish paytidagi hodisa kelmaydi",
   "Xato xabari",
   "Bo'sh ro'yxat"
  ],
  "wrong": {
   "0": "Haqiqiy natijada kelmadi (4-ekran).",
   "2": "Xato yo'q, lekin natija buzilgan.",
   "3": "Ro'yxat joyida, faqat son eski."
  }
 },
 "7": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror",
  "title": "Yangi versiyadan keyin bitta hodisa — tinglovchi ikki marta",
  "seg": [
   [
    "a",
    "Uchinchi usul: Backend'ning yangi versiyasi — ulanish uziladi va <b>o'zi tiklanadi</b>",
    "Ikkinchi usulga keyin qaytamiz. Hozir uchinchisi: Backend'ning yangi versiyasi. Backend qayta ishga tushdi, ulanish uzildi va bir soniyada o'zi tiklandi."
   ],
   [
    "b",
    "Keyin Bekzod qo'shildi — bitta hodisa, lekin tinglovchi <b>ikki marta ishladi</b>",
    "Keyin Bekzod qo'shildi. Bitta o'zgarish, bitta hodisa. Lekin Ali'da tinglovchi ikki marta ishladi va ro'yxat ikki marta so'raldi. Telefonda jonli xabar ikki marta chiqadi."
   ],
   [
    "c",
    "Sabab: tinglovchi <b><code>connect</code> ichida</b> — har qayta ulanishda yana bittasi qo'shiladi",
    "Sabab kodda: oyin ozgardi tinglovchisi connect ichida qo'shilgan. Connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi. Har safar yana bitta tinglovchi."
   ],
   [
    "d",
    "Xulosa: <code>connect</code> ichiga faqat <b>har ulanishda</b> qilinadigan ishni yozing",
    "Xulosa: connect ichiga faqat har ulanishda qayta qilinadigan ishni yozing. Tinglovchi bir marta, tashqarida qo'shiladi."
   ]
  ]
 },
 "8": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Qayta ulangandan keyin jonli xabar ikki marta chiqdi",
  "q": "Sababni ko'rdingiz, endi kodda toping. Ikkinchi tekshiruv. Qayta ulangandan keyin jonli xabar ikki marta chiqdi. Har qayta ulanishda yana bitta tinglovchi qo'shadigan satrni bosing.",
  "ok": "To'g'ri. Ellikinchi satr: tinglovchi connect ichida. Har qayta ulanishda u yana qo'shiladi. Tuzatishda u connect'dan tashqariga chiqadi va bir marta qo'shiladi. Demak, har qayta ulanishda ishlaydigan joyga tinglovchi qo'yilmaydi.",
  "okShort": "50-satr: tinglovchi <code>connect</code> ichida — har qayta ulanishda yana bittasi.",
  "hint": "Qaysi satr connect bilan birga har safar qayta ishlaydi va yangi narsa qo'shadi?",
  "task": "Qoida: tinglovchi <b>bir marta</b> qo'shiladi; <code>connect</code> har qayta ulanishda qayta ishlaydi. Backend qayta chiqqach bitta o'zgarish tinglovchini ikki marta ishlatdi. <b>Har qayta ulanishda yana bitta tinglovchi qo'shadigan satrni bosing.</b>"
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "m12-dars-05-start: Backend'ni qayta yoqing — bitta hodisa ikki marta",
  "seg": [
   [
    "a",
    "Endi siz: takror tinglovchi xatosini o'z kompyuteringizda <b>o'zingiz chaqirasiz</b>",
    "Satrni topdingiz, endi xatoni o'zingiz chaqirasiz. O'n besh daqiqa. Backend o'quvchi loyihasidan, ilova o'rnida kichik klient, u ulanish ts ning eski qoidasini aynan takrorlaydi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>m12-dars-05-start</code></b>, <code>npm ci</code>, start; klient Ali tokeni va <code>OYIN=3</code> bilan",
    "Birinchi: m12 dars besh start tegi, npm ci va start. Ikkinchi: klientni Ali tokeni bilan yoqing, o'yin uch ochiq. Hozir ko'ryapti: bir."
   ],
   [
    "c",
    "3–4-qadam: Backend'da Ctrl+C va start; Vali qo'shiladi — isbot: <b>«ishladi (2)»</b>",
    "Uchinchi: Backend'da Ctrl C, keyin yana start, klient o'zi ulanadi. To'rtinchi: Vali uchinchi o'yinga qo'shiladi. Isbot maydoniga ikkinchi marta ishlagan satrni qo'ying."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror tinglovchi xatosini o'z kompyuteringizda chaqirgan va bitta hodisa ikki marta ishlaganini ko'rgan bo'lasiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "4-bosqich · xona",
  "title": "Ikki telefonda o'yin ochiq, lekin «Hozir ko'ryapti: 1» — Ali xonaga qaytmagan",
  "seg": [
   [
    "a",
    "<b>«Hozir ko'ryapti»</b> — o'yin xonasidagi ulanishlar soni; ekran ochilganda xonaga kiriladi",
    "Takror tinglovchini ko'rdik, yangi versiya yana bir xatoni ochadi. Hozir ko'ryapti, o'yin xonasidagi ulanishlar soni. O'yin ekrani ochilganda ilova oyin ochildi yuboradi va xonaga kiradi."
   ],
   [
    "b",
    "Uzilganda ulanish <b>hamma xonadan chiqadi</b> — qayta ulanish o'zi kirmaydi",
    "Backend kodida yozilgan: ulanish uzilganda u hamma xonadan o'zi chiqadi. Qayta ulangan ilova esa xonaga o'zi qaytmaydi. Ekran ochiq, lekin xonada emas."
   ],
   [
    "c",
    "Yangi versiyadan keyin Vali o'yinni ochdi — <b>2 o'rniga 1</b>",
    "Natija: yangi versiyadan keyin Vali shu o'yinni ochdi. Ikki telefonda ham ochiq, lekin Vali bir ko'rdi. Tuzatilgan ilovada ikkalasi ikki ko'radi."
   ],
   [
    "d",
    "Xulosa: qayta ulanganda ilova ochiq o'yin <b>xonasiga qayta kiradi</b>",
    "Xulosa: ilova qaysi o'yin ochiqligini eslab qoladi va qayta ulanganda o'sha xonaga qayta kiradi. Backend o'zgarmaydi."
   ]
  ]
 },
 "11": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Ali o'yin ekranida. Backend qayta chiqdi. Keyin Vali shu o'yinni ochdi. Eski ilovada Vali nechani ko'radi?",
  "q": "Xonani ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Ali o'yin ekranida, Backend qayta chiqdi, keyin Vali shu o'yinni ochdi. Tuzatilmagan ilovada Vali nechani ko'radi? Variantni tanlang.",
  "ok": "To'g'ri, bir. Ali uzilganda xonadan chiqdi va qayta ulangach xonaga qaytmadi, shuning uchun xonada faqat Vali bor. Tuzatish shunday: ilova qayta ulanganda ochiq o'yin xonasiga qayta kiradi. Demak, qayta ulanish xonani tiklamaydi, xonaga kirishni ilova o'zi takrorlashi kerak.",
  "okShort": "Bir — Ali xonaga qaytmagan.",
  "hint": "Qayta ulangan Ali oyin-ochildi yubordimi?",
  "correct": 0,
  "opts": [
   "Bir — Ali xonaga qaytmagan",
   "Ikki",
   "Nol",
   "Uch — eski ulanish ham sanaladi"
  ],
  "wrong": {
   "1": "Bu tuzatilgan ilovada (10-ekran).",
   "2": "Vali o'zi sanaladi.",
   "3": "Uzilgan ulanish xonadan chiqqan."
  }
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 5 daqiqa",
  "title": "Vali klienti o'yinni ochadi — «Hozir ko'ryapti» nechani ko'rsatadi",
  "seg": [
   [
    "a",
    "Endi siz: ikkinchi telefon o'rnida <b>Vali klientini</b> yoqasiz",
    "Xatoni tushundingiz, endi uni o'zingiz ko'rasiz. Besh daqiqa. Ali klienti birinchi amaliyotdan beri ishlab turibdi, u qayta ulangan."
   ],
   [
    "b",
    "1–2-qadam: Ali klienti ishlab turibdi; ikkinchi terminalda Vali klienti <b><code>OYIN=3</code></b>",
    "Birinchi: Ali klienti ishlab turganini tekshiring. Ikkinchi: yangi terminalda Vali klientini xuddi shu o'yin bilan yoqing. Isbot maydoniga Vali ko'rgan sonni yozing."
   ],
   [
    "c",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Ikkala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qayta ulangan Ali xonaga qaytmaganini Vali'dagi son orqali o'z ko'zingiz bilan ko'rgan bo'lasiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · tuzatish",
  "title": "ulanish.ts: connect ichida qayta so'rash va xonaga qaytish, tinglovchi tashqarida",
  "seg": [
   [
    "a",
    "Uchala xato bitta faylda — <code>mobil/src/ulanish.ts</code>; <b>Backend o'zgarmagan</b>",
    "Uch xatoni ko'rdik, endi tuzatish. Uchalasi ham ilovadagi bitta faylda: ulanish ts. Backend'ga tegilmagan, repo farqida backend papkasi yo'q."
   ],
   [
    "b",
    "<code>connect</code> ichida: holat, qayta so'rash va ochiq o'yin xonasiga <b>qayta kirish</b>",
    "Connect ichida endi uchta ish: belgi ulangan, ro'yxatni qayta so'rash va ochiq o'yin bo'lsa, xonaga qayta kirish. Hammasi har ulanishda qayta qilinishi kerak bo'lgan ishlar."
   ],
   [
    "c",
    "<code>oyin-ozgardi</code> tinglovchisi — <code>connect</code> dan tashqarida, <b>bir marta</b>",
    "Oyin ozgardi tinglovchisi esa connect'dan tashqarida, faylda bir marta. Ochiq o'yin esa o'yin ekrani ochilganda eslab qolinadi."
   ],
   [
    "d",
    "Xulosa: «har ulanishda» va «bir marta» <b>ishlarni ajrating</b>",
    "Xulosa: kodda ikki xil ish bor. Har ulanishda qayta qilinadigani connect ichida, bir marta qilinadigani tashqarida. O'quvchi agentga tuzattirganda shuni tekshiring."
   ]
  ]
 },
 "14": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "klient.js ni tuzating va xuddi shu usul bilan qayta buzing",
  "seg": [
   [
    "a",
    "Endi siz: klientni tuzatasiz va xuddi shu usul bilan <b>qayta buzasiz</b>",
    "Tuzatishni ko'rdingiz, endi o'zingiz yozasiz. O'n besh daqiqa. Ikki klientni ham Ctrl C bilan yoping va Ali klientining klient js faylini tuzating."
   ],
   [
    "b",
    "1–2-qadam: <code>connect</code> ichida qayta so'rash va xona; <b>tinglovchi tashqarida</b>; Ali klienti",
    "Birinchi: connect ichida faqat qayta so'rash va xonaga kirish qolsin, tinglovchini tashqariga chiqaring. Namuna kod oynasida, nusxalamang. Ikkinchi: Ali klientini yoqing."
   ],
   [
    "c",
    "3–4-qadam: Backend'ni qayta yoqing, Vali'ni oching — isbot <b>«Hozir ko'ryapti: 2»</b>",
    "Uchinchi: Backend'da Ctrl C va start. Ali qayta ulanadi. To'rtinchi: Vali klientini yoqing va Vali'ni o'yindan chiqaring. Isbot: Vali ko'rgan son."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin klient tuzatilgan va siz xuddi shu usul bilan qayta buzib, tuzatish ishlashini isbotlagan bo'lasiz."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Ikkinchi usul — fonga olib qaytarish — mentor misolida buzilmadi. Nega?",
  "q": "Uch xatoning ikkitasi yangi versiyadan chiqdi. Endi buzilmagan usul. To'rtinchi tekshiruv. Fonga olib qaytarish mentor misolida buzilmadi. Nega? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish ts faylida ilova holati kuzatiladi: ilova fondan qaytganda ro'yxat qayta so'raladi. Bu kod m12 dars uch tegidan beri bor. Shuning uchun mentor misolida, shu telefonda va shu urinishda buzilmadi. Demak, ilova fondan qaytganda ma'lumotni qayta so'rasa, fonga olish xatoga olib kelmaydi.",
  "okShort": "Fondan qaytganda <code>AppState</code> — qayta so'rash.",
  "hint": "Ulanish ts da AppState nima qiladi?",
  "correct": 2,
  "opts": [
   "Fonda ulanish uzilmaydi",
   "Hodisa navbatda kutib turadi",
   "Ilova fondan qaytganda ro'yxatni o'zi qayta so'raydi",
   "Backend fonni sezadi"
  ],
  "wrong": {
   "0": "Uzilishi mumkin — telefonga bog'liq.",
   "1": "Navbat yo'q (5-ekran).",
   "3": "Backend o'zgarmagan."
  }
 },
 "16": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m10-05 · «Ulanish uzilsa: buzamiz va tuzatamiz»",
  "title": "m10-05: avval Maydon Jamoa'da topish, keyin o'z ilovasida",
  "seg": [
   [
    "a",
    "m10-05 — <b>19 ekran</b>: avval Maydon Jamoa'da uch muammo, keyin o'z ilovasi",
    "Uchala xatoni o'zingiz yurgizdingiz, endi o'quvchi darsi: m10-05, o'n to'qqiz ekran. Avval Maydon Jamoa'da uch muammo va sababi, keyin xuddi shu ish o'z ilovasida."
   ],
   [
    "b",
    "Darsning <b>og'ir qismi</b> — 8-ekran kod oynasi va ikki blok",
    "O'quvchi darsi o'zi ogohlantiradi: og'ir qismlar sakkizinchi ekrandagi kod oynasi va ikki blok. Ikkinchi, to'rtinchi, oltinchi ekranlarga ortiqcha vaqt bermang."
   ],
   [
    "c",
    "<b>Juftlikda qulay</b> — sherik telefonida «Hozir ko'ryapti» ikkini ko'rsatadi",
    "Juftlikda ishlash qulay: sherik telefonida ham shu ekran ochiq bo'lsa, Hozir ko'ryapti xatosi ko'rinadi. Sherik bo'lmasa, agent boshqa akkauntdan o'zgarish qiladi."
   ],
   [
    "d",
    "Xulosa: vaqtni bloklarga bering; o'quvchi yozuvida «taxmin» emas, <b>«ko'rdim»</b> bo'lsin",
    "Xulosa: vaqtning ko'pi ikki blokka. O'quvchi yozuvida nima bo'ldi qatori taxmin emas, ekranda ko'rgani bo'lsin. Shuni tekshiring."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "title": "A1: uch usul, agent boshqa akkauntdan; A2: yozuv bilan tuzattirish va qayta tekshirish",
  "seg": [
   [
    "a",
    "A1 da <b>kod yozilmaydi</b>: o'zgarishni agent boshqa akkauntdan qiladi, kuzatish — o'quvchida",
    "Xaritadagi beshinchi blokni ochamiz, darsning asosiy qismi. Birinchi blokda kod yozilmaydi: o'zgarishni agent boshqa akkauntdan qiladi, kuzatish va yozuv o'quvchida."
   ],
   [
    "b",
    "Uchinchi usul — Render'da <b>qo'lda qayta chiqarish</b>; bir necha daqiqa cho'zilishi mumkin",
    "Uchinchi usulda o'quvchi Render'da Backend'ni qo'lda qayta chiqaradi. Bu bir necha daqiqa cho'zilishi mumkin. Biz Render'ni sinamadik, dars ham tugma nomini rasmiy hujjatdan olgan."
   ],
   [
    "c",
    "Expo Go uchish rejimidan keyin ilovani qayta yuklasa — 1-xato <b>ko'rinmay qolishi mumkin</b>",
    "Ehtiyot bo'ling: o'quvchi darsi ogohlantiradi, Expo Go uchish rejimidan keyin ilovani boshidan yuklasa, birinchi xato ko'rinmay qolishi mumkin. Unda belgi buzilmadi bo'ladi va bu ham natija."
   ],
   [
    "d",
    "Xulosa: A2 da agentga yozuv yuboriladi; tuzatishdan keyin <b>xuddi shu usul bilan</b> qayta buziladi",
    "Xulosa: ikkinchi blokda o'quvchi yozuvni agentga yuboradi va tuzattiradi. Keyin buzildi belgili urinishlarni xuddi shu usul bilan qaytaradi. Agentning tuzatdim degani ham da'vo."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · sinfda",
  "title": "Da'vo, buzish, belgi — va olti holat",
  "seg": [
   [
    "a",
    "O'quvchi «da'vo», «buzildi», «xona» deydi — siz <b>koddagi joyini</b> bilasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: da'vo, buzildi va buzilmadi, qayta ulanish va xona. Siz har birining kodda qayerda turishini bilasiz."
   ],
   [
    "b",
    "Birinchi uchta holat — <b>uch xato</b>: son eski, xabar ikki marta, son kam",
    "Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasi bugun ko'rgan uch xato. Birinchisi: belgi ulangan, lekin son eski qolgan. Ikkinchisi: jonli xabar ikki marta chiqadi. Uchinchisi: hozir ko'ryapti degan son kam chiqadi."
   ],
   [
    "c",
    "Qolgan uchtasi: hammasi «buzilmadi», Render uzoq, <b>agent «tuzatdim»</b>",
    "To'rtinchi holat: hamma urinishda ilova buzilmadi. Bunda Expo Go ilovani qayta yuklagan bo'lishi mumkin. Beshinchi holat: Render'dagi server qayta ishga tushishi uzoq vaqt oladi. Oltinchi holat: agent tuzatdim dedi, lekin buni xuddi shu usul bilan qayta tekshirish kerak."
   ],
   [
    "d",
    "Xulosa: har «bajardim» va «tuzatdim» dan keyin — xuddi shu usul bilan <b>qayta buzish</b>",
    "Xulosa va usul: o'quvchi bajardim yoki tuzatdim deganidan keyin u bilan birga xuddi shu buzish usulini qaytaring. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "19": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Agent «bajardim» dedi. Bu nima?",
    "o": [
     "da'vo — tekshirilmagan",
     "tekshiruv",
     "isbot",
     "tuzatish"
    ],
    "c": 0,
    "e": "Tekshiruv — buzib ko'rish.",
    "s": 2
   },
   {
    "q": "Buzish yozuvida «Nima bo'ldi» qatori?",
    "o": [
     "talabdan",
     "ekranda ko'rgani",
     "agent aytgani",
     "taxmin"
    ],
    "c": 1,
    "e": "Taxmin emas.",
    "s": 3
   },
   {
    "q": "Uzilish paytidagi hodisa?",
    "o": [
     "qayta ulangach keladi",
     "navbatda turadi",
     "keyin kelmaydi",
     "ikki marta keladi"
    ],
    "c": 2,
    "e": "Faqat ulangan ilovaga ketadi.",
    "s": 4
   },
   {
    "q": "Uzilish xatosining tuzatishi?",
    "o": [
     "Backend'da navbat",
     "tinglovchini o'chirish",
     "sahifani yangilash",
     "connect da qayta so'rash"
    ],
    "c": 3,
    "e": "Har ulanishda yangi son.",
    "s": 5
   },
   {
    "q": "connect qachon ishlaydi?",
    "o": [
     "birinchi va har qayta ulanishda",
     "faqat birinchi ulanishda",
     "faqat hodisada",
     "hech qachon"
    ],
    "c": 0,
    "e": "Shuning uchun tinglovchi tashqarida.",
    "s": 7
   },
   {
    "q": "Tinglovchi connect ichida bo'lsa?",
    "o": [
     "hodisa kelmaydi",
     "bitta hodisa ikki marta ishlaydi",
     "ulanish yopiladi",
     "xato chiqadi"
    ],
    "c": 1,
    "e": "Har qayta ulanishda yana bittasi.",
    "s": 8
   },
   {
    "q": "Qayta ulangach «Hozir ko'ryapti» kam — nega?",
    "o": [
     "Backend xato",
     "tinglovchi ikki marta",
     "ilova xonaga qayta kirmagan",
     "token eskirgan"
    ],
    "c": 2,
    "e": "Uzilganda hamma xonadan chiqadi.",
    "s": 10
   },
   {
    "q": "Uchala tuzatish qayerda?",
    "o": [
     "Backend gateway'da",
     "README'da",
     "Render'da",
     "ilovadagi ulanish.ts da"
    ],
    "c": 3,
    "e": "Backend o'zgarmagan.",
    "s": 13
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
//  MENTOR KURSI · WebSocket-2 «Ulanish uzilsa: buzamiz va tuzatamiz»
//  F-1029-02 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/21-WS2-mentor-v1.md (MD v1, GATE M kutilmoqda; 01.11 avtopilot)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/ws2-out/ (00–06) va ws2-amal-out/ (00–04; amaliyotlar mentor yo'lida)
//  O'quvchi loyihasi maydon-jamoa (m12-dars-05-start = 04-done kodi · m12-dars-05-done): Backend haqiqiy, ilova o'rniga Node klient
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx ws2/parts/*.jsx > WsReconnectMentorLesson.jsx
// ============================================================
const LESSON_ID = 'mentor-ws2-01-qayta-ulanish-v1';
const LESSON_TITLE = "Ulanish uzilsa: buzamiz va tuzatamiz";
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
// O'quvchi reposi maydon-jamoa (m12-dars-05-done) — haqiqiy fayl nomlari; mentorning kichik klienti (ws2-klient.js)
const RF = { gw: 'backend/src/oyinlar.gateway.ts', ul: 'mobil/src/ulanish.ts', app: 'mobil/src/app/index.tsx', oyin: 'mobil/src/app/oyin/[id].tsx', buz: 'BUZISH.md', env: 'backend/.env' };
const REPO_FILES = tree(['backend/node_modules/', 'backend/src/app.module.ts', 'backend/src/main.ts', RF.gw, 'backend/src/oyinlar.controller.ts', 'backend/src/royxat.controller.ts', 'backend/src/kirish.controller.ts', 'backend/.env.example', RF.env, 'backend/package.json', 'mobil/src/api.ts', RF.app, RF.oyin, RF.ul, 'mobil/package.json', RF.buz, 'README.md']);
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
  ['m12 dars besh start', 'm12-dars-05-start'], ['m12 dars besh done', 'm12-dars-05-done'], ['m12 dars uch', 'm12-dars-03'],
  ['socket io', 'socket.io'], ['Socket io', 'socket.io'], ['oyin ozgardi', 'oyin-ozgardi'], ['Oyin ozgardi', 'oyin-ozgardi'], ['oyin ochildi', 'oyin-ochildi'],
  ['ulanish ts', 'ulanish.ts'], ['Ulanish ts', 'ulanish.ts'], ['klient js', 'klient.js'], ['Connect', 'connect'], ['Ctrl C', 'Ctrl+C'],
];
DIGITS.unshift(["ikki yuz bir", '201'], ["o'n to'qqiz ekran", '19 ekran'], ["o'n beshinchi ekranda", '15-ekranda'], ["sakkizinchi ekrandagi", '8-ekrandagi'],
  ["Ikkinchi, to'rtinchi, oltinchi ekranlarga", '2, 4, 6-ekranlarga'], ["Ellikinchi satr", '50-satr'], ["o'n besh daqiqa", '15 daqiqa'], ["Besh daqiqa", '5 daqiqa'],
  ["qirq-oltmish daqiqa", '40–60 daqiqa'], ["o'yin uch", "o'yin 3"], ["uchinchi o'yinga", "3-o'yinga"], ['ekranda olti', 'ekranda 6'], ['ilovani ochdi: olti', 'ilovani ochdi: 6'],
  ['hali olti', 'hali 6'], ["Backend'da esa yetti", "Backend'da esa 7"], ['sakkiz oldi', '8 ni oldi'], ["Backend'da ham sakkiz", "Backend'da ham 8"], ['Vali bir ko\'rdi', "Vali 1 ni ko'rdi"],
  ['ikkalasi ikki ko\'radi', "ikkalasi 2 ni ko'radi"], ['Hozir ko\'ryapti: bir', "Hozir ko'ryapti: 1"], ['To\'g\'ri, bir', "To'g'ri, 1"]);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(/transport close/gi, /xhr poll error/gi);

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
function Phone({ who, holat = 'ulangan', rows = [], note, mark, badge = true, ekran = "O'yinlar" }) {
  const [m, c] = BELGI[holat];
  return <div className={`ws-ph${mark ? ' ' + mark : ''}`}>
    <div className="top"><span className="who">{who}</span><span className="warn">⚠ maket · sonlar haqiqiy</span></div>
    <div className="hd"><b>{ekran}</b>{badge && <span className="bg" style={{ color: c }}><i style={{ background: c }} />{m}</span>}</div>
    {rows.map(([n, v, hl], i) => <div key={i} className={`rw${hl ? ' ' + hl : ''}`}><span>{n}</span><b>{v}</b></div>)}
    {note && <div className="nt">{note}</div>}
  </div>;
}

// WebSocket-2 ga xos qo'shimcha CSS (WebSocket-1 dan nusxa; dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
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
    let s = document.getElementById('mk-css-ws2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-ws2'; document.head.appendChild(s); }
    if (s.textContent !== CSS3) s.textContent = CSS3;
  }, []);
}
// ============================================================
//  Kod va chiqishlar — maydon-jamoa m12-dars-04-done (= 05-start kodi) va m12-dars-05-done aynan;
//  chiqishlar ws2-out / ws2-amal-out dan (vaqt belgilari o'zgartirilmagan; token — «<Ali tokeni>»)
// ============================================================
// Satr raqami — fayldagi haqiqiy raqam (n); qatorlar oddiy qo'shtirnoqda, ichidagi backtick — kod
const tsN = (arr, start, meta = {}) => arr.map((l, i) => ({ h: tsLine(l), n: start + i, ...(meta[i + 1] || {}) }));
// m12-dars-04-done · mobil/src/ulanish.ts 48–55 (agent «bajardim» degan holat)
const UL04_SRC = [
  "  ulanish.on('connect', () => {",
  "    holatQoy('ulangan');",
  "    ulanish?.on('oyin-ozgardi', async () => {",
  '      const oldingi = oxirgiRoyxat();',
  '      const yangi = await qaytaSora();',
  '      if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);',
  '    });',
  '  });',
];
const UL04 = tsN(UL04_SRC, 48, { 1: { id: 'c' }, 3: { id: 't' }, 4: { id: 't' }, 5: { id: 't' }, 6: { id: 't' }, 7: { id: 't' }, 8: { id: 'c' } });
// m12-dars-05-done · mobil/src/ulanish.ts 50–64 (tuzatilgan)
const UL05_SRC = [
  "  // connect birinchi ulanishda VA har qayta ulanishda ishlaydi — shuning uchun ichida tinglovchi qo'shilmaydi",
  "  // (aks holda har qayta ulanishda yana bittasi qo'shilib, bitta hodisa ikki marta ishlaydi — takror hodisa).",
  "  // Ichida faqat: qayta so'rash (uzilish paytida yuborilgan hodisa keyin kelmaydi) va ochiq o'yin xonasiga qayta kirish",
  '  // (uzilganda ulanish hamma xonadan chiqqan).',
  "  ulanish.on('connect', () => {",
  "    holatQoy('ulangan');",
  '    qaytaSora();',
  "    if (ochiqOyin !== null) ulanish?.emit('oyin-ochildi', { oyinId: ochiqOyin });",
  '  });',
  '  // Tinglovchi bir marta — connect dan tashqarida',
  "  ulanish.on('oyin-ozgardi', async () => {",
  '    const oldingi = oxirgiRoyxat();',
  '    const yangi = await qaytaSora();',
  '    if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);',
  '  });',
];
const UL05 = tsN(UL05_SRC, 50, { 5: { id: 'c' }, 6: { id: 'c' }, 7: { id: 'q' }, 8: { id: 'x' }, 9: { id: 'c' }, 11: { id: 't' }, 12: { id: 't' }, 13: { id: 't' }, 14: { id: 't' }, 15: { id: 't' } });
// m12-dars-04-done · backend/src/oyinlar.gateway.ts 58–65 va 76–81
const GW04 = tsN([
  "  @SubscribeMessage('oyin-ochildi')",
  '  async ochildi(@ConnectedSocket() ulanish: Socket, @MessageBody() malumot: { oyinId?: unknown }) {',
  '    const oyinId = Number(malumot?.oyinId);',
  '    if (!ulanish.data.oyinchiId || !Number.isInteger(oyinId)) return;',
  '    await ulanish.join(xona(oyinId));',
  '    ulanish.data.ochiq.add(oyinId);',
  '    await this.korayotganlarniYubor(oyinId);',
  '  }',
], 58, { 5: { id: 'j' } }).concat([{ h: '<span class="cm">  …</span>', n: '' }], tsN([
  "  // Ulanish uzilganda u hamma xonadan o'zi chiqadi — u ochib turgan har o'yin xonasiga yangi son",
  '  async handleDisconnect(ulanish: Socket) {',
  '    if (!ulanish.data.oyinchiId) return;',
  "    this.log.log(`uzildi: o'yinchi ${ulanish.data.oyinchiId}`);",
  '    for (const oyinId of ulanish.data.ochiq as Set<number>) await this.korayotganlarniYubor(oyinId);',
  '  }',
], 76, { 1: { id: 'u' } }));
// m12-dars-04-done · mobil/src/ulanish.ts 63–68 (fondan qaytganda — qayta so'rash; 3-darsdan beri)
const APPSTATE04 = tsN([
  "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
  '  let oldingi: string | null | undefined = AppState.currentState;',
  "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
  "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
  '    oldingi = yangi;',
  '  });',
], 63, { 4: { id: 'a' } });
// Mentorning klienti (manba/ws2-klient.js — aynan): m12-04 qoidasi
const KLIENT_JS = tsN([
  "// klient.js — o'quvchi ilovasidagi mobil/src/ulanish.ts (m12-dars-04-done) qoidasi, telefon o'rniga terminalda.",
  "// OYIN=<id> berilsa — «O'yin» ekrani ochiq: Backend'ga oyin-ochildi yuboriladi, «Hozir ko'ryapti» chiqadi.",
  "// Ishga tushirish: TOKEN=<token> OYIN=3 node klient.js   (to'xtatish — Ctrl+C)",
  "const { io } = require('socket.io-client');",
  '',
  "const API = process.env.API || 'http://localhost:3000';",
  'const TOKEN = process.env.TOKEN;',
  'const OYIN = process.env.OYIN ? Number(process.env.OYIN) : null;',
  'const ulanish = io(API, { auth: { token: TOKEN } });',
  '',
  'const t0 = Date.now();',
  'const yoz = (matn) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s  ${matn}`);',
  'let marta = 0;',
  '',
  'async function qaytaSora(sabab) {',
  "  const javob = await fetch(API + '/oyinlar', { headers: { Authorization: 'Bearer ' + TOKEN } });",
  '  const o = (await javob.json()).find((x) => x.id === (OYIN || 1));',
  '  yoz(`GET /oyinlar (${sabab}) → ${o.maydon}: ${o.qoshilgan} / ${o.kerak}`);',
  '}',
  '',
  "ulanish.on('connect', () => {",
  "  yoz('ulangan');",
  "  ulanish.on('oyin-ozgardi', async (hodisa) => {",
  '    marta++;',
  '    yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)} — tinglovchi ishladi (${marta})`);',
  "    await qaytaSora('hodisa kelgach');",
  '  });',
  '});',
  "ulanish.on('disconnect', (sabab) => yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (disconnect: ${sabab})`));",
  "ulanish.on('korayotganlar-ozgardi', (m) => yoz(`Hozir ko'ryapti: ${m.soni}`));",
  '',
  "// «O'yin» ekrani ochildi — ilova ochilgandagi birinchi ulanishda bir marta",
  "if (OYIN) ulanish.once('connect', () => ulanish.emit('oyin-ochildi', { oyinId: OYIN }));",
], 1);

// BUZISH.md (m12-dars-05-done) — aynan
const BUZ = [
  ['1', 'Internetni uzish', "Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim.", "Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi.", "Belgi «Ulangan», lekin «8 / 10» qoldi.", 'buzildi'],
  ['2', 'Fonga olib qaytarish', "Boshqa ilovaga o'tdim; shu payt agent tekshiruv akkauntidan qo'shildi; bir daqiqadan keyin qaytdim.", "Qaytganimda «9 / 10» ko'rinadi.", "Qaytganimda «9 / 10», belgi «Ulangan».", 'buzilmadi'],
  ['3', "Backend'ning yangi versiyasi", "Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi.", "Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2».", "Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1».", 'buzildi'],
];
function BuzTable({ cols = [0, 1, 2, 3, 4, 5], hl = [], rows = [0, 1, 2], small }) {
  const H = ['№', 'Usul', 'Nima qildim', 'Nima kutdim', "Nima bo'ldi", 'Belgi'];
  return <div className="mk-light" style={{ padding: 12, overflow: 'auto' }}>
    <div className="mk-tag">BUZISH.md · m12-dars-05-done</div>
    <table className="mk-tbl" style={{ fontSize: small ? 12 : 13 }}><thead><tr>{cols.map((c) => <th key={c} style={{ textAlign: 'left', color: hl.includes(c) ? T.accent : T.ink2 }}>{H[c]}</th>)}</tr></thead>
      <tbody>{BUZ.filter((_, i) => rows.includes(i)).map((r) => <tr key={r[0]}>{cols.map((c) => <td key={c} style={c === 5 ? { fontWeight: 800, color: r[5] === 'buzildi' ? T.accent : T.green } : (hl.includes(c) ? { background: '#FFF7F3' } : {})}>{r[c]}</td>)}</tr>)}</tbody></table>
  </div>;
}

// ws2-out — haqiqiy chiqishlar
const OUT01 = tm(String.raw`
$ node ws2-sinov.js uzilish eski     # ilova: ulanish.ts — m12-dars-04-done
  0.9s  [Ali] ulangan
  1.0s  [Ali] GET /oyinlar (ekran ochildi) → Maktab maydoni: 6 / 10
  1.8s  --- internet uzildi ---
  1.8s  [Ali] ulanmoqda  (disconnect: transport close)
  2.4s  [Ali] ulanmoqda  (connect_error: xhr poll error) …
  3.3s  [Sardor] POST /oyinlar/2/qoshilish → 201
  4.8s  --- internet qaytdi ---
  5.3s  [Ali] ulangan
  6.8s  NATIJA: Ali ekranida 6 / 10 · Backend'da 7 / 10`, { 3: { id: 'g' }, 4: { id: 'u' }, 5: { id: 'u' }, 7: { id: 's' }, 9: { id: 'k' }, 10: { id: 'n' } });
const OUT02 = tm(String.raw`
$ node ws2-sinov.js uzilish yangi    # ilova: ulanish.ts — m12-dars-05-done
  2.1s  --- internet uzildi ---
  3.6s  [Jasur] POST /oyinlar/2/qoshilish → 201
  5.1s  --- internet qaytdi ---
  6.0s  [Ali] ulangan
  6.0s  [Ali] GET /oyinlar (qayta ulanganda) → Maktab maydoni: 8 / 10
  7.5s  NATIJA: Ali ekranida 8 / 10 · Backend'da 8 / 10`, { 6: { id: 'g' }, 7: { id: 'n' } });
const OUT03 = tm(String.raw`
$ node ws2-sinov.js versiya eski     # ilova: ulanish.ts — m12-dars-04-done
  1.8s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
  1.8s  [Ali] ulanmoqda  (disconnect: transport close)
  2.9s  [Ali] ulangan
  4.0s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (1)
  4.0s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (2)
  4.0s  [Bekzod] POST /oyinlar/3/qoshilish → 201
  4.0s  [Ali] GET /oyinlar (hodisa kelgach) → Park maydoni: 5 / 8
  4.0s  [Ali] GET /oyinlar (hodisa kelgach) → Park maydoni: 5 / 8
  5.5s  NATIJA: bitta o'zgarish — Ali'da tinglovchi 2 marta ishladi`, { 2: { id: 'v' }, 3: { id: 'v' }, 4: { id: 'v' }, 5: { id: 't' }, 6: { id: 't' }, 7: { id: 'b' }, 8: { id: 'g' }, 9: { id: 'g' }, 10: { id: 'n' } });
const OUT04 = tm(String.raw`
$ node ws2-sinov.js versiya yangi    # ilova: ulanish.ts — m12-dars-05-done
  5.8s  [Ali] ulangan
  6.8s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (1)
  6.9s  [Aziz] POST /oyinlar/3/qoshilish → 201
  8.4s  NATIJA: bitta o'zgarish — Ali'da tinglovchi 1 marta ishladi`, { 3: { id: 't' }, 5: { id: 'n' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Talab va buzish yozuvi', 'Internet uzildi', 'Yangi versiya: takror tinglovchi', 'Yangi versiya: xona va tuzatish', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Mentor misolining natijasi — uch urinish</div>
    <BuzTable cols={[0, 1, 5]} />
  </div>} />;
}

// ============================================================
//  2 · «Bajardim» — da'vo (README «Chekka holatlar», m12-dars-04-done)
// ============================================================
const EDGE2 = ["Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.", 'Bitta o\'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.', "Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin."];
const S2 = mkS(2, [{ hl: [0] }, { hl: [1, 2] }, { hl: [], claim: true }, { hl: [], claim: true, sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">README.md · ### Chekka holatlar</div>
      <div style={{ display: 'grid', gap: 8 }}>{EDGE2.map((t, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1})</span><div className="t">{t}</div></div>)}</div>
    </div>
    {seg.claim && <div className="pg-two">
      <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>da'vo · tekshirilmagan</h5><div style={{ fontSize: 14.5 }}>Agent: «uchala chekka holatni bajardim»</div></div>
      <div className="mk-card"><h5>README · m12-dars-04-done qatori</h5><div style={{ fontSize: 14 }}>«… Qayta ulanish maxsus boshqarilmaydi»</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">«Bajardim» — tekshiruv emas; tekshiruv — <b>buzib ko'rish</b> va ekranga qarash.</div>}
  </div>} />;
}

// ============================================================
//  3 · Buzish yozuvi (BUZISH.md)
// ============================================================
const S3 = mkS(3, [{ hl: [1, 2, 3, 4, 5] }, { hl: [3, 4] }, { hl: [5] }, { hl: [5], sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <BuzTable hl={seg.hl} small />
    {seg.sum && <div className="mk-rule">«Buzilmadi» — <b>shu telefonda, shu urinishda</b>; hamma telefon uchun isbot emas.</div>}
  </div>} />;
}

// ============================================================
//  4 · Internet uzildi — son eski (ws2-out/01)
// ============================================================
const S4 = mkS(4, [{ f: ['g', 'u'] }, { f: ['s'] }, { f: ['k', 'n'], ph: true }, { f: [], ph: true, sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={OUT01} focus={seg.f} title="terminal — haqiqiy Backend, eski ilova (m12-dars-04-done)" /></div>
    {seg.ph && <div className="ws-phones">
      <Phone who="Ali" rows={[['Maktab maydoni', '6 / 10', 'old']]} note="belgi «Ulangan», son eski" mark="bad" />
      <div className="mk-card" style={{ borderColor: T.green }}><h5>Backend (GET /oyinlar)</h5><div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 800, color: T.green }}>7 / 10</div><div style={{ fontSize: 13, color: T.ink2 }}>Sardor uzilish paytida qo'shilgan</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">Belgi «Ulangan» — bu ekrandagi son <b>to'g'ri degani emas</b>.</div>}
  </div>} />;
}

// ============================================================
//  5 · Sabab va tuzatish: qayta so'rash (ws2-out/02; m12-dars-05-done ulanish.ts 54–58)
// ============================================================
const S5 = mkS(5, [{ v: 'why' }, { v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'why' && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.green }}><h4>Ulangan ilovalar</h4><p>oyin-ozgardi keladi</p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>Uzilgan Ali</h4><p>hodisa yo'q — keyin ham kelmaydi (navbat yo'q)</p></div>
    </div>}
    {seg.v !== 'why' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={`${RF.ul} · m12-dars-05-done`} wrap lines={UL05.slice(4, 9)} focus={seg.sum ? [] : ['q']} /></Ide></div>}
    {seg.v === 'out' && <Term lines={OUT02} focus={['g', 'n']} title="terminal — tuzatilgan ilova (haqiqiy)" />}
    {seg.sum && <div className="mk-rule">Qayta ulanish — <b>«nima o'tkazib yubordim?»</b> deb qayta so'rash payti.</div>}
  </div>} />;
}

// ============================================================
//  6 · Tekshiruv 1
// ============================================================
function Screen6(p) {
  const m = MDT[6];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: eski va tuzatilgan ilova</div>
      <Term er lines={OUT01.slice(-1)} />
      <Term lines={OUT02.slice(-2)} />
    </div>} />;
}

// ============================================================
//  7 · connect har ulanishda ishlaydi (ws2-out/03; m12-dars-04-done ulanish.ts 48–55)
// ============================================================
const S7 = mkS(7, [{ f: ['v'], c: [] }, { f: ['t', 'b'], c: [] }, { f: ['t'], c: ['t'] }, { f: [], c: [], sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={`${RF.ul} · m12-dars-04-done`} wrap lines={UL04} focus={seg.c} /></Ide></div>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term er={seg.f.includes('t')} lines={OUT03} focus={seg.f} title="terminal — haqiqiy Backend, eski ilova" /></div>
    {seg.sum && <div className="mk-rule"><code>connect</code> ichiga faqat <b>har ulanishda</b> qayta qilinadigan ishni yozing.</div>}
  </div>} />;
}

// ============================================================
//  8 · Tekshiruv 2 — LineCheck (50-satr: tinglovchi connect ichida)
// ============================================================
const LC8 = UL04_SRC.map((l, i) => ({ h: tsLine(l), n: 48 + i }));
// Tuzatilgan ko'rinish — m12-dars-05-done 54–64-satr (raqamlar haqiqiy faylniki); o'chgan ichki tinglovchi — chizilgan, raqamsiz
const LC8_FIXED = [
  { h: tsLine(UL05_SRC[4]), n: 54 }, { h: tsLine(UL05_SRC[5]), n: 55 },
  ...UL04_SRC.slice(2, 7).map((l) => ({ h: tsLine(l), n: '', gone: true })),
  { h: tsLine(UL05_SRC[6]), n: 56, neu: true }, { h: tsLine(UL05_SRC[7]), n: 57, neu: true }, { h: tsLine(UL05_SRC[8]), n: 58 },
  ...UL05_SRC.slice(9, 15).map((l, i) => ({ h: tsLine(l), n: 59 + i, neu: true })),
];
function Screen8(p) {
  const m = MDT[8];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={RF.ul} lines={LC8} target={2}
    tree={{ root: 'maydon-jamoa', files: REPO_FILES, active: RF.ul }}
    fixed={LC8_FIXED} fixedExtra={[{ file: 'tuzatilgan ilova — bitta o\'zgarish (haqiqiy)', lines: OUT04 }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  9 · Amaliyot 1 — takror tinglovchi (ws2-amal-out/01–02)
// ============================================================
const P1 = mkS(9, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "Backend — maydon-jamoa papkasida (.env WebSocket-1 dan qoladi)", cmds: ['git checkout -f m12-dars-05-start', 'cd backend', 'npm ci', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Ali klienti — ws-klient papkasida, klient.js ni almashtiring", cmds: ['TOKEN=<Ali tokeni> OYIN=3 node klient.js'], exp: "ulangan · Hozir ko'ryapti: 1" },
  { t: 'Yangi versiya — Backend terminalida Ctrl+C, keyin', cmds: ['npm run start'], exp: 'klient: ulanmoqda (disconnect: transport close), keyin ulangan' },
  { t: "O'zgarish — uchinchi terminalda", cmds: ['curl -X POST localhost:3000/oyinlar/3/qoshilish -H "Authorization: Bearer <Vali tokeni>"'], exp: '{"holat":"qoshildi"} · klient: tinglovchi ishladi (1) va (2)' },
];
const P1_CODE = [{ file: 'klient.js', step: 1, lines: KLIENT_JS, copy: true }];
const P1_TROUBLE = [
  ['Faqat (1)', "klient qayta ulanmasdan oldin qo'shildingiz — «ulangan» ikkinchi marta chiqqanini kuting (5 s gacha)"],
  ["409 «Siz bu o'yinga qo'shilgansiz»", "Vali allaqachon qo'shilgan — .../oyinlar/3/chiqish qiling, keyin 3-qadamdan qayta"],
  ["JWT_SECRET yo'q — backend/.env ga yozing", ".env yo'q — cp .env.example .env (WebSocket-1, 7-ekran)"],
];
const P1_PROOF = { label: 'Ikkinchi marta ishlagan satr', placeholder: 'klient terminalidan HODISA satrini qo\'ying', check: (v) => /ishladi \(2\)/.test(v), wrong: "«tinglovchi ishladi (2)» bilan tugaydigan satrni butunligicha nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={KLIENT_FILES} />; }
// ============================================================
//  Chiqishlar: ws2-out/05–06 (xona), ws2-amal-out/02–04 (amaliyotlar mentor yo'lida)
// ============================================================
const OUT05 = tm(String.raw`
$ node ws2-sinov.js xona eski        # ilova: ulanish.ts — m12-dars-04-done
  1.3s  [Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }
  1.3s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})
  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
  6.1s  [Ali] ulangan
  7.5s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }
  7.5s  [Vali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})`, { 2: { id: 'o' }, 3: { id: 'o' }, 4: { id: 'v' }, 5: { id: 'v' }, 7: { id: 'x' } });
const OUT06 = tm(String.raw`
$ node ws2-sinov.js xona yangi       # ilova: ulanish.ts — m12-dars-05-done
  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
  3.7s  [Ali] ulangan
  3.7s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})
  5.1s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }
  5.1s  [Ali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {"oyinId":1,"soni":2})
  5.1s  [Vali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {"oyinId":1,"soni":2})`, { 4: { id: 'r' }, 6: { id: 'ok' }, 7: { id: 'ok' } });
const AMAL03 = tm(String.raw`
$ TOKEN=<Vali tokeni> OYIN=3 node klient.js   # Ali klienti ham ishlab turibdi, 3-o'yin ochiq
  0.0s  ulangan
  0.0s  Hozir ko'ryapti: 1`, { 3: { id: 'x' } });
const AMAL04 = tm(String.raw`
$ TOKEN=<Ali tokeni> OYIN=3 node klient.js   # tuzatilgan klient
  1.8s  ulanmoqda  (disconnect: transport close)
 12.8s  ulangan
 12.8s  Hozir ko'ryapti: 1
 12.8s  GET /oyinlar (ulanganda) → Park maydoni: 5 / 8
 14.6s  Hozir ko'ryapti: 2
 16.4s  HODISA oyin-ozgardi {"oyinId":3,"sabab":"chiqdi"} — tinglovchi ishladi (1)`, { 3: { id: 'r' }, 4: { id: 'r' }, 5: { id: 'r' }, 6: { id: 'ok' }, 7: { id: 'ok' } });
// Namuna (manba/ws2-klient-tuzatilgan.js — aynan, 21–33-satr): o'zingiz yozing, nusxalash yo'q
const KLIENT_FIX = tsN([
  "// connect har ulanishda ishlaydi: ichida faqat qayta so'rash va ochiq o'yin xonasiga qayta kirish",
  "ulanish.on('connect', () => {",
  "  yoz('ulangan');",
  "  qaytaSora('ulanganda');",
  "  if (OYIN) ulanish.emit('oyin-ochildi', { oyinId: OYIN });",
  '});',
  '// Tinglovchi bir marta — connect dan tashqarida',
  "ulanish.on('oyin-ozgardi', async (hodisa) => {",
  '  marta++;',
  '  yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)} — tinglovchi ishladi (${marta})`);',
  "  await qaytaSora('hodisa kelgach');",
  '});',
  "ulanish.on('disconnect', (sabab) => yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (disconnect: ${sabab})`));",
  "ulanish.on('korayotganlar-ozgardi', (m) => yoz(`Hozir ko'ryapti: ${m.soni}`));",
], 21);

// ============================================================
//  10 · Xona — «Hozir ko'ryapti: 1» (ws2-out/05–06; gateway 58–65, 76–81)
// ============================================================
const S10 = mkS(10, [{ v: 'gw', c: ['j'] }, { v: 'gw', c: ['u'] }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'gw' ? <Ide files={REPO_FILES} active={RF.gw}><CodePanel file={`${RF.gw} · m12-dars-04-done`} wrap lines={GW04} focus={seg.c} style={{ fontSize: 12.5 }} /></Ide>
      : <div className="pg-two">
        <Term er lines={OUT05} focus={['v', 'x']} title="eski ilova (haqiqiy)" />
        <Term lines={OUT06} focus={['r', 'ok']} title="tuzatilgan ilova (haqiqiy)" />
      </div>}
    {seg.v === 'out' && <div className="ws-phones">
      <Phone who="Vali · eski ilova" ekran="O'yin · Mahalla maydoni" rows={[["Hozir ko'ryapti", '1', 'old']]} mark="bad" />
      <Phone who="Vali · tuzatilgan" ekran="O'yin · Mahalla maydoni" rows={[["Hozir ko'ryapti", '2', 'new']]} mark="good" />
    </div>}
    {seg.sum && <div className="mk-rule">Qayta ulanganda ilova ochiq o'yin <b>xonasiga qayta kiradi</b> — Backend o'zgarmaydi.</div>}
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 3
// ============================================================
function Screen11(p) {
  const m = MDT[11];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija — eski ilova</div>
      <Term er lines={OUT05} focus={['x']} />
    </div>} />;
}

// ============================================================
//  12 · Amaliyot 2 — ikkinchi telefon (ws2-amal-out/03)
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [] }], { tableAt: 2 });
const P2_STEPS = [
  { t: 'Ali — 1-amaliyotdagi klient yopilmagan', cmds: [], exp: 'oxirgi satrlar: ulangan va tinglovchi ishladi (2)' },
  { t: 'Vali — yangi terminalda, ws-klient papkasida', cmds: ['TOKEN=<Vali tokeni> OYIN=3 node klient.js'], exp: "ulangan · Hozir ko'ryapti: 1" },
];
const P2_TROUBLE = [
  ["Hozir ko'ryapti: 2", "Ali klienti qayta ulanishdan oldin yopilib qayta yoqilgan (yangi jarayon xonaga kiradi) — 1-amaliyotning 3-qadamini qaytaring"],
];
const P2_PROOF = { label: "Vali'dagi «Hozir ko'ryapti» soni", placeholder: 'faqat sonni yozing', check: (v) => /^1$/.test(v), wrong: "Vali klienti terminalidagi «Hozir ko'ryapti:» dan keyingi sonni yozing" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  13 · Tuzatish: bitta fayl, uch joy (m12-dars-05-done ulanish.ts 50–64)
// ============================================================
const DIFF13 = tm(String.raw`
$ git diff --stat m12-dars-04-done m12-dars-05-done
 BUZISH.md                   | 25 +++++++++++++++++++++++++
 README.md                   |  5 +++++
 mobil/src/app/index.tsx     |  4 ++--
 mobil/src/app/oyin/[id].tsx |  7 ++++---
 mobil/src/ulanish.ts        | 32 ++++++++++++++++++++++++--------
# backend/ — yo'q`, { 6: { id: 'u' }, 7: { id: 'b' } });
const S13 = mkS(13, [{ v: 'diff' }, { v: 'code', c: ['c', 'q', 'x'] }, { v: 'code', c: ['t'] }, { v: 'code', c: [], sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'diff' ? <Term lines={DIFF13} focus={['u', 'b']} title="terminal — maydon-jamoa" />
      : <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={`${RF.ul} · m12-dars-05-done`} wrap lines={UL05} focus={seg.c} style={{ fontSize: 12.5 }} /></Ide></div>}
    {seg.sum && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>connect ichida — har ulanishda</h4><p>belgi · qayta so'rash · xonaga qayta kirish</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>tashqarida — bir marta</h4><p>oyin-ozgardi tinglovchisi</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  14 · Amaliyot 3 — tuzatib qayta tekshirish (ws2-amal-out/04)
// ============================================================
const P3 = mkS(14, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: "Tuzatish — ikkala klientni Ctrl+C bilan yoping; klient.js: connect ichida faqat qayta so'rash va xona, tinglovchi tashqarida", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Ali', cmds: ['TOKEN=<Ali tokeni> OYIN=3 node klient.js'], exp: "ulangan · Hozir ko'ryapti: 1 · GET /oyinlar (ulanganda)" },
  { t: 'Yangi versiya — Backend terminalida Ctrl+C, keyin', cmds: ['npm run start'], exp: "Ali: ulangan · Hozir ko'ryapti: 1 · GET /oyinlar (ulanganda)" },
  { t: "Vali — klient, keyin o'yindan chiqish", cmds: ['TOKEN=<Vali tokeni> OYIN=3 node klient.js', 'curl -X POST localhost:3000/oyinlar/3/chiqish -H "Authorization: Bearer <Vali tokeni>"'], exp: "ikkalasida Hozir ko'ryapti: 2 · Ali: tinglovchi ishladi (1)" },
];
const P3_CODE = [{ file: 'klient.js', step: 0, lines: KLIENT_FIX, copy: false }];
const P3_TROUBLE = [
  ["Vali'da yana 1", "connect ichida oyin-ochildi yo'q yoki OYIN tekshirilmagan — namunaga qarang"],
  ["Ali'da (1) va (2)", 'tinglovchi hali connect ichida'],
  ["Ali'da (1) yo'q", "Vali chiqmagan (409) — avval qo'shiling, keyin chiqing"],
];
const P3_PROOF = { label: "Vali'dagi «Hozir ko'ryapti» soni", placeholder: 'faqat sonni yozing', check: (v) => /^2$/.test(v), wrong: "Vali klienti terminalidagi «Hozir ko'ryapti:» dan keyingi sonni yozing" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={KLIENT_FILES} />; }

// ============================================================
//  15 · Tekshiruv 4 — fonga olish nega buzilmadi (m12-dars-04-done ulanish.ts 63–68)
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Kodda: m12-dars-03 dan beri (telefonda sinamadik)</div>
      <CodePanel file={`${RF.ul} · m12-dars-04-done`} wrap lines={APPSTATE04} focus={['a']} />
    </div>} />;
}

// ============================================================
//  16 · m10-05 xaritasi (BreakAndFixLesson.jsx — SCREEN_META 19)
// ============================================================
const MAP16 = [
  { t: 'Kirish', s: 's0–s1', d: "«bajardim» — da'vo · reja", m: 'README «Chekka holatlar» (2-ekran)' },
  { t: 'Uch muammo', s: 's2–s7', d: 'uzilish · takror · xona — har biri test bilan', m: 'haqiqiy chiqishlar (4, 7, 10-ekran)' },
  { t: 'Tinglovchi', s: 's8', d: 'kod oynasi (namuna, uzilish — tugma)', m: '50-satr (8-ekran)' },
  { t: 'Yozuv va qayta tekshiruv', s: 's9–s12', d: 'buzish yozuvi · test · qayta tekshiruv · mustaqil', m: '«shu telefonda, shu urinishda» (3-ekran)' },
  { t: 'Amaliyot', s: 'A1, A2', d: "o'z ilovasini buzish · agentga tuzattirish", m: 'Render, Expo Go (17-ekran)' },
];
const S16 = mkS(16, [{ hl: [] }, { hl: [2, 4] }, { hl: [1] }, { hl: [3, 4], sum: true }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP16.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.sum && <div className="mk-rule">Vaqtning ko'pi <b>ikki blokka</b>; «Nima bo'ldi» qatorida taxmin emas — ko'rgani.</div>}
  </div>} />;
}

// ============================================================
//  17 · A1 va A2 (o'quvchi darsi ScreenA1, ScreenA2 — aynan, qisqartirib)
// ============================================================
const A1_17 = [
  ["(1) Internetni uzish", "uchish rejimini yoqing va belgi «Ulanmoqda…» bo'lishini kuting (bir daqiqagacha). Keyin o'zgarish qilinsin; bo'lgach uchish rejimini o'chiring."],
  ['(2) Fonga olib qaytarish', "boshqa ilovaga o'ting va o'zgarish qilinsin. Bir daqiqadan keyin ilovaga qayting."],
  ["(3) Backend'ning yangi versiyasi", "Render sahifasida: «Manual Deploy» → «Deploy latest commit». Belgi «Ulanmoqda…» ga o'tib, yana «Ulangan» bo'lishi kerak."],
];
const S17 = mkS(17, [{ hl: [] }, { hl: [2], warn: 'r' }, { hl: [0], warn: 'e' }, { hl: [], a2: true, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 10 }}>
    <div className="mk-tag" style={{ margin: 0 }}>A1 · o'z mahsulotingiz — o'zgarishni boshqa akkaunt qiladi (sherik yoki agent) · qadamlar qisqartirilgan</div>
    {A1_17.map(([h, t], i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}><div className="t"><b>{h}</b><div style={{ fontSize: 13.5 }}>{t}</div></div></div>)}
    {seg.warn === 'r' && <div className="n2-warn">Render'da qayta chiqarish <b>bir necha daqiqa</b> cho'zilishi mumkin; tugma nomi rasmiy hujjatdan. Render'ni o'zimiz sinamadik.</div>}
    {seg.warn === 'e' && <div className="n2-warn">Expo Go uchish rejimidan keyin ilovani qayta yuklasa (ekran boshidan ochilsa), 1-urinishda muammo <b>ko'rinmay qolishi mumkin</b> — o'quvchi darsida «pilotda tekshiriladi».</div>}
    {seg.a2 && <div className="mk-card"><h5>A2 · agentga prompt bandlari (qisqartirilgan)</h5><div style={{ fontSize: 13.5, lineHeight: 1.55 }}><b>Qayerda:</b> <code>mobil/</code> — ulanish fayli va real vaqt ekranlari. Backend'ga tegma.<br /><b>Nima qilsin:</b> buzish yozuvida «buzildi» belgili har urinishni tuzat; har muammoning sababini bir gap bilan ayt.<br /><b>Nima buzilmasin:</b> kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin.</div></div>}
    {seg.sum && <div className="mk-rule">Agentning «tuzatdim» degani ham da'vo — <b>xuddi shu usul bilan</b> qayta buzib ko'riladi.</div>}
  </div>} />;
}

// ============================================================
//  18 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT18 = [["da'vo · tekshirilmagan", "agent «bajardim» dedi"], ['buzildi · buzilmadi', "ko'rilgan kutilgandan farq qildi yoki qilmadi"], ['qayta ulanish', 'connect (har ulanishda)'], ['xona', "oyin-{id} · «Hozir ko'ryapti»"]];
const STUMBLE18 = [
  ['Belgi «Ulangan», son eski', 'uzilishdan keyin', "connect da qayta so'rash yo'q"],
  ['Jonli xabar ikki marta', 'qayta ulangandan keyin', 'tinglovchi connect ichida'],
  ["«Hozir ko'ryapti» kam", 'yangi versiyadan keyin', 'xonaga qayta kirish yo\'q'],
  ['Hamma urinish «buzilmadi»', 'Expo Go qayta yuklagan bo\'lishi mumkin (sinamadik)', 'bu ham natija'],
  ['«Ulanmoqda…» uzoq', "Render qayta chiqyapti (sinamadik)", "bir necha daqiqa"],
  ['Agent «tuzatdim» dedi', 'qayta tekshiruv qilinmagan', 'xuddi shu usul bilan qaytarish'],
];
const QA18 = [
  ["«Socket.io o'zi qayta ulanadi-ku, nega tuzatamiz?»", "ulanishni tiklaydi, lekin o'tkazib yuborilgan hodisani va xonani tiklamaydi."],
  ['«Qayta ulanish necha marta urinadi?»', "sukutda cheklanmagan; kutish ≈1 s dan ikki barobar o'sadi, 5 s dan oshmaydi (o'quvchi darsi s1 eslatmasi; WebSocket-1 da o'lchangan)."],
  ['«Tinglovchi ikki marta bo\'lsa, nima yomon?»', "har o'zgarish ikki marta so'raladi, jonli xabar ikki marta chiqadi; har qayta ulanishda yana ko'payadi."],
  ["«Backend'ni tuzatish kerakmi?»", "yo'q: uchala tuzatish ilovada (13-ekran)."],
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
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Har «bajardim» va «tuzatdim» dan keyin — o'quvchi bilan <b>xuddi shu usulni</b> qaytaring.</div>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: da'vo va buzish yozuvi, uch xato va ularning tuzatishi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m10-05 dagi uch muammo va buzish yozuvi sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
  { k: 'davo', t: "«Bajardim» — da'vo; tekshiruv — buzib ko'rish va yozuv (shu telefonda, shu urinishda)", st: ['app'] },
  { k: 'uz', t: "Uzilish paytidagi hodisa keyin kelmaydi → connect da qayta so'rash", st: ['app', 'yol', 'be'] },
  { k: 'tak', t: "connect har ulanishda ishlaydi → tinglovchi tashqarida, bir marta", st: ['app', 'yol'] },
  { k: 'xona', t: "Uzilganda hamma xonadan chiqadi → qayta ulanganda ochiq o'yin xonasiga qaytish", st: ['yol', 'be'] },
  { k: 'fayl', t: "Uchala tuzatish ilovadagi ulanish.ts da — Backend o'zgarmagan", st: ['app'] },
  { k: 'dars', t: "m10-05: A1 — o'z ilovasini buzish, A2 — agent tuzatadi, keyin xuddi shu usul bilan qayta tekshiruv", st: ['app'] },
];
const STATIONS20 = [['app', 'ilova · ulanish.ts', T.blue], ['yol', 'qayta ulanish', T.purple], ['be', 'Backend · xona', T.green]];
function SummaryMap20({ hl }) {
  const cur = SUM20.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — uzilish va qayta ulanish</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
      {STATIONS20.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK20 = [
  { t: "Usul: Backend'ni qayta yoqish (Ctrl+C → npm run start) yoki internetni uzish — bittasi", c: [] },
  { t: "Yozuv: BUZISH.md ga bitta qator — usul · nima qildim · nima kutdim · nima bo'ldi · belgi", c: [] },
  { t: "Tuzatish: ulanish faylida connect ichida qayta so'rash / xona; tinglovchi tashqarida", c: [] },
  { t: 'Qayta tekshiruv: xuddi shu usul — natijani yozuvga qo\'shing', c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "buzish yozuvi va tuzatish"', 'git push'] },
];
const CHEATSHEET20 = `# WebSocket — mentor eslatmasi (ulanish uzilsa)
## Da'vo va yozuv
agent «bajardim» — da'vo; tekshiruv — buzib ko'rish. README «Chekka holatlar»: uzilish · bir marta · fon
BUZISH.md: usul · nima qildim · nima kutdim (talabdan) · nima bo'ldi (ko'rgani, taxmin emas) · belgi — shu telefonda, shu urinishda
## Uch xato (maydon-jamoa m12-dars-05-start → 05-done; Backend o'zgarmagan)
1) uzilish paytidagi hodisa keyin kelmaydi → belgi «Ulangan», son eski (6 / 10, Backend 7 / 10) → connect da qaytaSora()
2) tinglovchi connect ichida → yangi versiyadan keyin bitta hodisa 2 marta (jonli xabar ikki marta) → tinglovchi tashqarida
3) uzilganda ulanish hamma xonadan chiqadi → «Hozir ko'ryapti: 1» (kutilgan 2) → connect da oyin-ochildi (ochiqOyin)
fonga olish buzmadi: AppState — fondan qaytganda qaytaSora (m12-dars-03 dan)
## Qayta ulanish
socket.io: ≈1 s, keyin ikki barobar, 5 s dan oshmaydi, cheklanmagan; ulanishni tiklaydi — hodisa va xonani emas
## Mentor amaliyoti (lokal)
git checkout -f m12-dars-05-start · npm run start · TOKEN=<Ali> OYIN=3 node klient.js · Ctrl+C → npm run start · curl …/oyinlar/3/qoshilish (Vali) → «ishladi (2)»
## O'quvchi darsidagi so'zlar (m10-05)
da'vo · buzildi / buzilmadi · qayta ulanish · xona · qayta tekshiruv
## Sizning uyga vazifangiz
bitta usul → BUZISH.md qatori → tuzatish → xuddi shu usul bilan qayta tekshiruv → GitHub → repo linki platformadagi uyga vazifaga`;
const s20Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "«Bajardim» — <b>da'vo</b>; tekshiruv — buzib ko'rish", "Birinchi: agentning bajardim degani da'vo. Tekshiruv, shu holatni ataylab chaqirib, ekranga qarash va yozib qo'yish.", { hl: 'davo' }),
  sg('b2', "Uzilishdan keyin <b>qayta so'rash</b>", "Ikkinchi: uzilish paytidagi hodisa keyin kelmaydi. Qayta ulanganda ilova ro'yxatni qayta so'raydi.", { hl: 'uz' }),
  sg('b3', "Tinglovchi <b>connect'dan tashqarida</b>", "Uchinchi: connect har qayta ulanishda ishlaydi. Tinglovchi uning ichida bo'lsa, ko'payadi. U tashqarida, bir marta qo'shiladi.", { hl: 'tak' }),
  sg('b4', "Qayta ulanganda <b>xonaga qaytish</b>", "To'rtinchi: uzilganda ulanish hamma xonadan chiqadi. Qayta ulanganda ilova ochiq o'yin xonasiga qayta kiradi.", { hl: 'xona' }),
  sg('b5', "Uchala tuzatish — <b>ulanish.ts</b> da", "Beshinchi: uchala tuzatish ilovadagi bitta faylda. Backend o'zgarmagan.", { hl: 'fayl' }),
  sg('b6', "m10-05: buzish, tuzatish, <b>qayta tekshiruv</b>", "Oltinchi: o'quvchi o'z ilovasini uch usul bilan buzadi, agentga tuzattiradi va xuddi shu usul bilan qayta tekshiradi.", { hl: 'dars' }),
  sg('hw', "<b>Uyga vazifa</b>: bitta usul, yozuv, tuzatish va qayta tekshiruv", "Uyga vazifa: o'z loyihangizda yoki maydon jamoa nusxasida bitta usulni tanlang. Buzish yozuviga bitta qator yozing, xatoni tuzating va xuddi shu usul bilan qayta tekshiring.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: uch xato, tuzatish va yozuv — bir sahifada", "Pastda bir sahifalik eslatma: da'vo va yozuv, uch xato va tuzatishi, qayta ulanish raqamlari, mentor amaliyoti va o'quvchi tili. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen20(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET20;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'websocket-qayta-ulanish-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> yozuvda taxmin yo'q · tinglovchi bir marta · qayta ulanganda qayta so'rash · qayta tekshiruv natijasi.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Webhook</div><div style={{ fontSize: 13.5, color: T.ink2 }}>to'lov xabari: imzo, takror va rad</div></div>
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
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 9-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: WebSocket darsi (doimiy ulanish) o'tilgan · lokal PostgreSQL · Node.js 20+ · VS Code · uchta terminal", "Loyiha: o'quvchi reposi maydon-jamoa (m12-dars-05-start va m12-dars-05-done) va kichik klient (klient.js)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP1, Screen10, Screen11, ScreenP2, Screen13, ScreenP3, Screen15, Screen16, Screen17, Screen18, Screen19, Screen20];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WsReconnectMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
