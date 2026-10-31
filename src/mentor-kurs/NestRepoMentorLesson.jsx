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
.mk-title{font-size:clamp(20px,2.2vw,28px);line-height:1.2;font-weight:800;margin:0 0 18px;letter-spacing:-.01em}
.mk-cap{flex:1;min-height:0;display:flex;flex-direction:column}
.mk-key{font-size:clamp(22px,2.1vw,30px);line-height:1.25;font-weight:700;color:${T.ink};margin:0;letter-spacing:-.01em;animation:mk-up .45s ease both}
.mk-key b{color:${T.accent}}
.mk-key code{font:0.82em ${MONO};background:${T.code};color:#fff;padding:2px 10px;border-radius:8px;font-weight:600}
.mk-tr{margin:0;padding:0;list-style:none;display:grid;gap:8px;max-height:52vh;overflow:auto;padding-right:6px}
.mk-input{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid ${T.line};border-radius:8px;font:13px/1.4 ${MONO};background:#fff;color:${T.ink}}
.mk-input:focus{outline:2px solid ${T.accent};outline-offset:1px}
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
.mk-ln.gone{opacity:.25;text-decoration:line-through;text-decoration-color:#FCA5A5}
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
.mk-say.mc .mk-opt{font-size:18px;padding:16px 18px}
.mk-body.mc-split{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
.mk-body.mc-split>.mk-say.mc>:first-child{margin-top:0}
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
.mk-cover h1{font-size:clamp(26px,3vw,38px);line-height:1.15;margin:8px 0 10px;letter-spacing:-.02em}
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
// Ovoz matni so'z bilan («to'rt yuz to'rt»), ekran raqam bilan (404): show berilmagan matn uchun
// Tartib muhim: uzun ibora oldin («ming ikki yuz qirq» → 1240, keyin «ikki yuz» → 200 uni buzmaydi)
const DIGITS = [['ming ikki yuz qirq', '1240'], ["to'rt yuz to'rt", '404'], ["to'rt yuz bir", '401'], ["to'rt yuz uch", '403'], ['ikki yuz bir', '201'], ['besh yuz', '500'], ["to'rt yuz", '400'], ['ikki yuz', '200'], ['uch ming', '3000'], ["to'qson to'qqiz", '99'], ['index nol', 'index [0]'],
  ["o'n birinchi versiya", '11-versiya'], ["o'n-o'n besh", '10–15'], ["o'n marta", '10 marta'], ['ikki-besh', '2–5'], ['yigirma ikki', '22'], ["o'ttizdan oltmishgacha", '30–60'], ["oltmishdan to'qsongacha", '60–90'], ['yigirma', '20'], ["o'ttiz", '30'], ["to'qson", '90']];
const digits = (t) => DIGITS.reduce((acc, [w, d]) => acc.replace(new RegExp(w.replace(/'/g, "['’]"), 'gi'), d), t || '');
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
  const [tr, setTr] = useState(false);
  const showManual = !review && (audio.muted || (!audio.isPlaying && !audio.waitingFor && beat < segments.length - 1 && audio.status === 'idle' && !now.ask));
  const asking = now.ask && guess && guess[now.id] === undefined;
  const prevAsk = beat > 0 && segments[beat - 1].ask ? segments[beat - 1] : null;
  return (
    <div className="mk-say">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>{eyebrow && <p className="mk-eyebrow">{eyebrow}</p>}<h2 className="mk-title">{title}</h2></div>
        <button className="mk-btn soft sm" onClick={() => setTr((v) => !v)} title={t("Ustoz gapining to'liq matni", 'Полный текст учителя')}>{tr ? t('Matnni yopish', 'Скрыть текст') : t('Matn', 'Текст')}</button>
      </div>
      <div className="mk-cap">
        {tr ? (
          <ul className="mk-tr">{segments.map((s, i) => <li key={s.id} className={i === beat ? 'on' : (i < beat ? 'done' : '')} dangerouslySetInnerHTML={html(s.show || digits(s.text))} />)}</ul>
        ) : (
          <p className="mk-key" key={now.id} dangerouslySetInnerHTML={html(now.key || now.show || digits(now.text))} />
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
  return (
    <Stage kicker={kicker} idx={idx} total={total} audio={audio} onBack={onBack} onNext={onNext} onRestart={onRestart} nextReady={solved} nextDisabled={!solved} lockHint={t("To'g'ri javobni toping", 'Найдите верный ответ')}>
      {/* F-1031-07: to'g'ri javobdan keyin tuzatilgan kod bo'lsa — ikki ustun (chapda savol, o'ngda kod), sahifa sig'adi */}
      <div className={`mk-body${solved && after ? ' mc-split' : ''}`} style={solved && after ? undefined : { gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        {/* UX-5: savol bloki xavfsiz markazda (sig'masa tepasi kesilmaydi), variantlar 18 px */}
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          <p className="mk-eyebrow">{eyebrow} · {t('1-urinish hisoblanadi', 'считается 1-я попытка')}</p>
          {above}
          <h2 className="mk-title" style={{ fontSize: 'clamp(24px,2.6vw,34px)' }}>{title}</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {opts.map((o, i) => {
              // Topilgach faqat to'g'ri variant qoladi — sahifa toza, tuzatilgan blok darhol ostida (F-1030-27)
              if (solved && i !== correct) return null;
              let cls = 'mk-opt';
              if (solved) cls += ' ok';
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
        {solved && after && <div className="mk-scene top mc-after" style={{ overflow: 'auto', animation: 'mk-up .45s ease both' }}>{after}</div>}
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
          <h2 className="mk-title">{title}</h2>
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
            {proof && <div style={{ marginTop: 10 }}><div className="exp" style={{ marginBottom: 4 }}>{proof.label}</div><input className="mk-input" value={proofVal} placeholder={proof.placeholder} onChange={(e) => onProof(e.target.value)} />{proofVal.trim() && !proofOk && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{proof.wrong}</div>}</div>}
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
              <button type="button" className={`mk-trbtn${beat === S.tableAt && !tOpen ? ' hot' : ''}`} aria-expanded={tOpen} onClick={() => setTOpen((v) => !v)}>
                <span className="q">{t('Boshqacha chiqdimi?', 'Вышло иначе?')}</span>
                {rows.length > 1 && <span className="n">{t(`${rows.length - 1} ta holat va yechim`, `ситуации и решения: ${rows.length - 1}`)}</span>}
                <span className="ar" aria-hidden="true">{tOpen ? '▾' : '▸'}</span>
              </button>
              {tOpen && <div style={{ padding: '0 12px 12px', animation: 'mk-up .3s ease both' }}><table className="mk-tbl"><tbody>{rows.map(([a, c]) => <tr key={a}><td><code>{a}</code></td><td>{c}</td></tr>)}</tbody></table></div>}
            </div></Block>
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  MENTOR KURSI · Nest-2 «O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar»
//  F-1031-01 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/03-Nest2-mentor-v4.md (GATE M 31.10, 30/30)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/nest2-out/ (00–27)
// ============================================================
const LESSON_ID = 'mentor-nest-02-oquvchi-reposi-v1';
const LESSON_TITLE = "O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar";
const N2 = { entity: T.purple, dto: '#C2410C', guard: '#B91C1C', term: '#111827', termEr: '#1F1115' };
MKCFG.root = 'IntroNestArxitechture';
MKCFG.kind = (f) => /\.entity\.ts$/.test(f) ? N2.entity : /\/dto\//.test(f) ? N2.dto : /guard/.test(f) ? N2.guard : null;

// Explorer: VS Code tartibi — har darajada avval papkalar, keyin fayllar (alifbo). Ro'yxat ekranga qarab tanlanadi (sig'ishi uchun).
const byTree = (a, b) => {
  const A = a.split('/'), B = b.split('/');
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] === B[i]) continue;
    const ad = i < A.length - 1, bd = i < B.length - 1;
    if (ad !== bd) return ad ? -1 : 1;
    return A[i].toLowerCase() < B[i].toLowerCase() ? -1 : 1;
  }
  return A.length - B.length;
};
const tree = (...groups) => Array.from(new Set(groups.flat())).sort(byTree);
const F = {
  main: 'src/main.ts', cfg: 'src/config/index.ts', appMod: 'src/api/app.module.ts', appSvc: 'src/api/app.service.ts',
  aMod: 'src/api/admin/admin.module.ts', aCtrl: 'src/api/admin/admin.controller.ts', aSvc: 'src/api/admin/admin.service.ts',
  aCdto: 'src/api/admin/dto/create-admin.dto.ts', aUdto: 'src/api/admin/dto/update-admin.dto.ts', aSdto: 'src/api/admin/dto/signin-admin.dto.ts',
  coreIdx: 'src/core/index.ts', baseEnt: 'src/core/entity/Base.entity.ts', aEnt: 'src/core/entity/admin.entity.ts', aRepo: 'src/core/repository/admin.repository.ts',
  authG: 'src/common/guard/auth.guard.ts', rolesG: 'src/common/guard/roles.guard.ts', rolesD: 'src/common/decorator/roles-decorator.ts',
  baseSvc: 'src/infrastructure/base/base.service.ts', filter: 'src/infrastructure/exception/AllException.filter.ts', okRes: 'src/infrastructure/response/successRes.ts',
  env: '.env', envEx: '.env.example',
  cEnt: 'src/core/entity/car.entity.ts', cCdto: 'src/api/car/dto/create-car.dto.ts', cUdto: 'src/api/car/dto/update-car.dto.ts',
  cSvc: 'src/api/car/car.service.ts', cCtrl: 'src/api/car/car.controller.ts', cMod: 'src/api/car/car.module.ts',
  bMod: 'src/api/book/book.module.ts', bCtrl: 'src/api/book/book.controller.ts', bSvc: 'src/api/book/book.service.ts', bEnt: 'src/core/entity/book.entity.ts',
};
const CAR_ALL = [F.cEnt, F.cCdto, F.cUdto, F.cSvc, F.cCtrl, F.cMod];
const BASE = [F.main, F.appMod, F.appSvc, F.coreIdx];
MKCFG.files = tree(BASE);

// Kod rang beruvchi (Nest-1 sinflari: k kalit so'z · s satr · d decorator/son · c klass · cm izoh). Matn — String.raw, HTML'siz.
const KW = /^(import|from|export|class|extends|implements|const|let|return|async|await|new|private|readonly|if|throw|this|constructor|static|void|type|true|false|null|undefined|abstract|string|number|boolean|try|catch|as|default)$/;
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@\w+)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, dec, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (dec) out += `<span class="d">${escH(dec)}</span>`;
    else if (id) out += KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
// Kod satrlari: meta — {satr raqami (1-dan): {id, at, gone, neu, keep}}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// Terminal: ERROR qizil, Mapped/started yashil, ogohlantirish sariq
const termCls = (l) => /ERROR|Error|error:|Exception|TS\d{4}/.test(l) ? 'er' : /Mapped|successfully|created successfully|runnig onn/.test(l) ? 'ok' : /Retrying|WARN/.test(l) ? 'wn' : '';
const term = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => { const c = termCls(l); return { h: c ? `<span class="${c}">${escH(l)}</span>` : escH(l), ...(meta[i + 1] || {}) }; });
const plainLines = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: escH(l), ...(meta[i + 1] || {}) }));

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish: aytiladigan kod nomlari va raqamlar
const SPOKEN = [
  ['localhost uch ming, slesh api v bir', 'localhost:3000/api/v1'], ['localhost uch ming slesh admin', 'localhost:3000/admin'], ['localhost uch ming', 'localhost:3000'],
  ['api v bir slesh admin', '/api/v1/admin'], ['api v bir slesh car', '/api/v1/car'], ['slesh api v bir', '/api/v1'], ['api v bir', '/api/v1'],
  ['slesh admin', '/admin'], ['slesh car', '/car'], ['car slesh bir', '/car/1'],
  ['env example', '.env.example'], ['NODE ENV', 'NODE_ENV'], ['DEV DB URL', 'DEV_DB_URL'], ['PROD DB URL', 'PROD_DB_URL'],
  ['main ts', 'main.ts'], ['app service ts', 'app.service.ts'], ['app module', 'app.module.ts'], ['core index', 'core/index.ts'], ['index ts', 'index.ts'],
  ['Base service', 'BaseService'], ['Base entity', 'BaseEntity'], ['Car entity', 'CarEntity'], ['Car service', 'CarService'], ['Car controller', 'CarController'], ['Car module', 'CarModule'],
  ['car module', 'car.module.ts'], ['car service', 'car.service.ts'], ['car entity', 'car.entity.ts'],
  ['Book service', 'BookService'], ['Book module', 'BookModule'], ['book module', 'book.module.ts'], ['Book entity Repository', 'BookEntityRepository'], ['Book entity', 'BookEntity'],
  ['Car entity Repository', 'CarEntityRepository'], ['Auth guard', 'AuthGuard'], ['Roles guard', 'RolesGuard'], ['Partial type', 'PartialType'], ['ParseUUIDPipe', 'ParseUUIDPipe'],
  ['is available', 'is_available'], ['admin service', 'admin.service.ts'], ['onModuleInit', 'onModuleInit'], ['server runnig onn port', 'server runnig onn port'],
];
DIGITS.unshift(['ikki yuz qirq', '240'], ['bir yuz qirq besh', '145'], ["o'ttiz yettita", '37 ta'], ["o'ttiz olti", '36'], ["yigirma to'rt soat", '24 soat'], ["to'qqizta", '9 ta'], ["o'n-o'n besh", '10–15']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Segment: id · kalit ibora (HTML) · ovoz matni · qo'shimcha (sahna maydonlari)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /Super admin created successfully/g, /server runnig onn port/g, /Validation failed, uuid is expected/g, /invalid input syntax for type uuid/g,
  /property color should not exist/g, /property should not exist/g, /price must be a number/g, /password is not strong enough/g,
  /username or password incorect/g, /Admin not fount/g, /error in creating super admin/g, /contains null values/g,
  /violates foreign key constraint/g, /Forbidden resource/g, /Unauthorized/g, /database does not exist/g,
);

// Nest-2 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS2 = `
.mk-explorer{overflow:auto}
.n2-path{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 2px}
.n2-path span{font:600 11px/1 ${MONO};letter-spacing:.06em;text-transform:uppercase;padding:6px 9px;border-radius:999px;border:1.5px solid var(--c);color:var(--c);background:${T.paper};opacity:.45;transition:opacity .3s,background .3s,color .3s}
.n2-path span.on{opacity:1;background:var(--c);color:#fff}
.n2-path span.done{opacity:1}
.n2-path i{color:${T.ink3};font-style:normal}
.n2-swg{display:grid;gap:6px}
.n2-swg .r{display:flex;align-items:center;gap:10px;padding:7px 10px;border:1px solid ${T.line};border-radius:8px;background:${T.paper};font:12.5px ${MONO};transition:opacity .3s,border-color .3s,box-shadow .3s}
.n2-swg .r.hl{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.12)}
.n2-swg .r.dim{opacity:.45}
.n2-swg .m{font:700 11px/1 ${MONO};padding:4px 7px;border-radius:5px;color:#fff;min-width:54px;text-align:center}
.n2-swg .lk{margin-left:auto;font-size:13px}
.n2-swg .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px}
.n2-auth{font:600 12px ${SANS};padding:6px 12px;border:1.5px solid #49CC90;color:#2F9E6E;border-radius:6px;background:#fff;transition:box-shadow .3s}
.n2-auth.hl{box-shadow:0 0 0 4px rgba(73,204,144,.25)}
.n2-json{margin:0;font:12px/1.5 ${MONO};white-space:pre-wrap;word-break:break-word;color:${T.ink2};background:#F6F7F9;border:1px solid ${T.line};border-radius:8px;padding:8px 10px}
.n2-st{font:700 11px/1 ${MONO};padding:3px 7px;border-radius:6px;display:inline-block;justify-self:start}
.n2-st.s2{background:#E3F5EC;color:${T.green}}.n2-st.s4{background:#FFF0EB;color:${T.accent}}.n2-st.s5{background:#FDECEC;color:#B91C1C}
.n2-cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.n2-cmp .mk-card h5{margin-bottom:8px}
.n2-mini .mk-panel{font-size:12px;padding:12px 14px}
.n2-grid2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.n2-grid2{grid-template-columns:1fr}}
.n2-table td,.n2-table th{font-size:12.5px}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
`;
function useCss2() {
  useEffect(() => {
    let s = document.getElementById('mk-css-n2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-n2'; document.head.appendChild(s); }
    if (s.textContent !== CSS2) s.textContent = CSS2;
  }, []);
}

// Kichik umumiy sahna bo'laklari (shu dars uchun)
const LAYERS = [['Entity', N2.entity], ['DTO', N2.dto], ['Service', PART.svc], ['Controller', PART.ctrl], ['Module', PART.mod]];
function LayerPath({ at }) {
  return <div className="n2-path">{LAYERS.map(([n, c], i) => <React.Fragment key={n}>{i > 0 && <i>→</i>}<span className={i === at ? 'on' : (i < at ? 'done' : '')} style={{ '--c': c }}>{i < at ? '✓ ' : ''}{n}</span></React.Fragment>)}</div>;
}
const Term = ({ lines, title, er, beat, focus }) => <CodePanel file={title || 'terminal'} numbers={false} wrap style={{ background: er ? N2.termEr : N2.term }} lines={lines} beat={beat} focus={focus} />;
const Json = ({ st, children }) => <div style={{ display: 'grid', gap: 4 }}>{st && <span className={`n2-st s${String(st)[0]}`}>{st}</span>}<pre className="n2-json">{children}</pre></div>;
const METHOD_C = { GET: '#61AFFE', POST: '#49CC90', PATCH: '#50E3C2', DELETE: '#F93E3E' };

// ============================================================
//  1 · Kirish
// ============================================================
const S1 = {
  kicker: 'Kirish', eyebrow: 'Mentor kursi · NestJS', title: "Siz cars-api'ni qurdingiz. Endi o'quvchi reposi.",
  plan: ['Ishga tushirish', "cars-api'dan farqlar", 'Resurs: 5 qatlam', 'Guard va token', 'Buzamiz', "O'quvchi darslariga ko'prik"],
  segments: [
    sg('a', "Nest-1 da loyihani noldan qurdingiz — o'quvchi esa <b>tayyor loyihani clone qiladi</b>", "Assalomu alaykum. Nest birinchi darsida siz cars api'ni bo'sh papkadan qurdingiz. O'quvchingiz esa noldan yozmaydi: u GitHub'dan tayyor loyihani clone qiladi. Bugun aynan shu loyihani ochamiz, unga bitta resurs qo'shamiz va sinfda chiqadigan xatolarni ko'ramiz.", { hl: [] }),
    sg('b', "Dars oxirida loyiha sizda ishlaydi va unga <b>car resursini o'zingiz qo'shgan</b> bo'lasiz", "Dars oxirida loyiha sizning kompyuteringizda bazasi bilan ishlaydi, unga o'zingiz car resursini qo'shgan bo'lasiz. Resursning beshta qatlamini bir marta, tartib bilan yozamiz.", { hl: [0, 2] }),
    sg('c', "Token va rollarni bilasiz: <b>401 va 403</b> nima uchun chiqishini ajratasiz", "Loyiha himoyasini ham bilasiz: token qayerdan keladi, to'rt yuz bir va to'rt yuz uch nima uchun chiqadi. O'quvchi darsining ikkinchi qismi aynan shunga tayanadi.", { hl: [3] }),
    sg('d', "O'quvchi darslaridagi <b>uchta xatoni</b> oldindan bilasiz — sinfda vaqt yo'qotmaysiz", "Va eng muhimi: o'quvchi darslarida uchta joy bor, ular sinfda albatta muammo beradi. Ularni oldindan bilib olasiz va sinfda vaqt yo'qotmaysiz.", { hl: [4, 5] }),
    sg('e', "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi", "Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor, ularni o'z kompyuteringizda qilasiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.", { hl: [] }),
  ],
};
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">{t('Dars oxirida — sizning loyihangizda', 'В конце урока — в вашем проекте')}</div>
      <div className="n2-swg"><div className="r hl"><span className="m" style={{ background: METHOD_C.GET }}>GET</span><span>/api/v1/car</span></div></div>
      <Json st={200}>{`{"statusCode":200,"message":"success","data":[{"brand":"Chevrolet","model":"Malibu","price":250,"is_available":true,…}]}`}</Json>
    </div>
  </div>} />;
}

// ============================================================
//  2 · Loyiha xaritasi va ishga tushirish
// ============================================================
const MAP2 = [F.aMod, F.aCtrl, F.aSvc, F.aCdto, F.appMod, F.appSvc, F.rolesD, F.authG, F.rolesG, F.cfg, F.baseEnt, F.aEnt, F.aRepo, F.coreIdx, F.baseSvc, F.filter, F.okRes, F.main];
const MAP2_DESC = {
  [F.aMod]: 'resurs: Module', [F.aCtrl]: 'resurs: Controller', [F.aSvc]: 'resurs: Service', [F.aCdto]: 'resurs: DTO',
  [F.appMod]: 'bosh modul', [F.appSvc]: 'server shu yerda ishga tushadi', [F.authG]: 'qo\'riqchi', [F.rolesG]: 'qo\'riqchi', [F.rolesD]: 'rol belgisi',
  [F.cfg]: '.env o\'qiladi', [F.aEnt]: 'jadval shakli', [F.baseEnt]: 'umumiy ustunlar', [F.aRepo]: 'Repository tipi',
  [F.baseSvc]: 'tayyor CRUD', [F.filter]: 'xato shakli', [F.okRes]: 'javob shakli',
};
const DIR_OF = { api: 'src/api/', core: 'src/core/', common: 'src/common/', infra: 'src/infrastructure/' };
const ENV_LINES = plainLines(String.raw`
PORT=3000

NODE_ENV=dev

# DB
DEV_DB_URL=postgres://postgres:password@localhost:5432/nestarxitechture
PROD_DB_URL=postgres://postgres:password@localhost:5432/db_prod

# JWT == (openssl rand -base64 32) <= JWT token kaliti yaratib beradi
Access_Token_Key=…
Access_Token_Time=24h

# Superadmin
USER_NAME=superadmin
FULL_NAME=Super Admin
PHONE=+998901234567
PASSWORD=Superadmin1!`, { 6: { id: 'db' }, 13: { id: 'sa' }, 14: { id: 'sa' }, 15: { id: 'sa' }, 16: { id: 'sa' } });
const RUN_TERM = term(String.raw`
$ git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git
Cloning into 'IntroNestArxitechture'...
$ cd IntroNestArxitechture && npm install
added 759 packages, and audited 760 packages in 16s
$ cp .env.example .env
$ createdb -U postgres nestarxitechture
$ npm run start:dev
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized
[Nest] LOG [InstanceLoader] AdminModule dependencies initialized
[Nest] LOG [RoutesResolver] AdminController {/api/v1/admin}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/admin, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/admin/signin, POST} route
…  (jami 9 ta Mapped)
Super admin created successfully
[Nest] LOG [NestApplication] Nest application successfully started
server runnig onn port 3000`, { 1: { at: 1 }, 2: { at: 1 }, 3: { at: 1 }, 4: { at: 1 }, 5: { at: 2 }, 6: { at: 3 }, 7: { at: 3 }, 8: { at: 3 }, 9: { at: 3 }, 10: { at: 3 }, 11: { at: 3 }, 12: { at: 3 }, 13: { at: 3 }, 14: { at: 3 }, 15: { at: 3, id: 'sa' }, 16: { at: 3 }, 17: { at: 3, id: 'port' } });
const S2 = {
  kicker: '1-bosqich · ishga tushirish', title: "To'rt papka, to'rt buyruq, bitta fayl",
  segments: [
    sg('a', "Loyiha <code>src</code>da <b>37 fayl</b>, lekin hammasi <b>to'rt papkada</b> — har birining bitta vazifasi", "cars api'da yettita fayl edi, bu loyihaning src papkasida o'ttiz yettita. Qo'rqmang, hammasi to'rt papkada. api'da resurslar: Module, Controller, Service va DTO. core'da bazaning shakli, Entity'lar. common'da umumiy narsalar, Guard va decorator'lar. infrastructure'da poydevor: Base service, xato filtri, token.", { view: 'map' }),
    sg('b', "<code>git clone</code> va <code>npm install</code>: loyiha va paketlar, <b>bir daqiqacha</b>", "Ishga tushirish uchun to'rt buyruq va bitta fayl kerak. Birinchi ikkitasi: git clone loyihani oladi, npm install paketlarni o'rnatadi, bir daqiqacha.", { view: 'run' }),
    sg('c', "<code>.env</code> namunadan olinadi: <b>parol, baza nomi</b> va <b>Superadmin bloki</b> to'ldiriladi", "Keyin fayl: env. Loyihada namuna bor, env example, undan nusxa olinadi va uch joy to'ldiriladi: baza manzilidagi parol, o'zingizning PostgreSQL parolingiz; baza nomi, nestarxitechture; va Superadmin bloki, nom va kuchli parol. Superadmin bo'sh qolsa nima bo'lishini oltinchi ekranda ko'ramiz.", { view: 'run', focus: ['db', 'sa'] }),
    sg('d', "<code>createdb</code> va <code>start:dev</code>: terminalda <b>superadmin yaratildi</b> va to'qqizta <b>Mapped</b>", "Uchinchi buyruq bazani yaratadi, to'rtinchisi serverni ishga tushiradi. Terminalni o'qing: bazaga ulandi, env'dagi superadmin bazaga yozildi, keyin to'qqizta Mapped satri, hammasi api v bir bilan boshlanadi. Oxirgi satr imlo xatosi bilan: server runnig onn port. Bu xato emas, loyihadagi matn shunday.", { view: 'run' }),
    sg('e', "Xulosa: to'rt buyruq va <code>.env</code>dagi uch joy; superadmin satri <b>faqat birinchi safar</b> chiqadi", "Xulosa: to'rt buyruq va env'dagi uch joy. Bir narsani yodda tuting: superadmin yaratilgani haqidagi satr faqat birinchi ishga tushirishda chiqadi. Keyingi safar superadmin bazada bor, satr chiqmaydi, bu normal.", { view: 'run' }),
  ],
};
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => seg.view === 'map'
    ? <FileTree big files={tree(MAP2)} desc={MAP2_DESC} />
    : <Ide files={tree(BASE, [F.envEx, F.env])} active={F.env}>
        <Term lines={RUN_TERM} beat={beat} focus={beat >= 3 ? ['sa', 'port'] : []} />
        {beat === 2 && <CodePanel file=".env" lines={ENV_LINES} focus={seg.focus || []} />}
        <Block at={4} beat={beat}><div className="mk-rule"><b>server runnig onn port 3000</b> — {t("satr aynan shunday, imlo xatosi bilan: kodda shunday yozilgan. O'quvchi «xato chiqdi» desa — bu muvaffaqiyat satri.", 'строка именно такая, с опечаткой: так написано в коде. Если ученик скажет «вышла ошибка» — это строка успешного запуска.')}</div></Block>
      </Ide>} />;
}

// ============================================================
//  3 · Swagger
// ============================================================
const SWG = [
  ['POST', '/api/v1/admin', 1], ['GET', '/api/v1/admin', 1], ['POST', '/api/v1/admin/signin', 0], ['POST', '/api/v1/admin/token', 0], ['POST', '/api/v1/admin/signout', 0],
  ['GET', '/api/v1/admin/all/admin', 1], ['GET', '/api/v1/admin/{id}', 1], ['PATCH', '/api/v1/admin/{id}', 1], ['DELETE', '/api/v1/admin/{id}', 1],
];
function Swagger({ hl = [], authHl, title = 'Azizbek' }) {
  return <div className="mk-light" style={{ padding: 14 }}>
    <div className="n2-swg">
      <div className="hd"><div><b style={{ fontSize: 18 }}>{title}</b> <span className="mk-tag" style={{ display: 'inline', marginLeft: 6 }}>1.0 · /api/v1</span></div><span className={`n2-auth${authHl ? ' hl' : ''}`}>Authorize 🔓</span></div>
      <div className="mk-tag" style={{ margin: '4px 0 2px' }}>admin</div>
      {SWG.map(([m, u, lock], i) => <div key={i} className={`r${hl.includes(i) ? ' hl' : (hl.length ? ' dim' : '')}`}><span className="m" style={{ background: METHOD_C[m] }}>{m}</span><span>{u}</span>{lock ? <span className="lk" title="token">🔒</span> : <span className="lk" style={{ opacity: .25 }}>—</span>}</div>)}
    </div>
  </div>;
}
const S3 = {
  kicker: '1-bosqich · Swagger', title: "Swagger: localhost:3000/api/v1 — loyihaning menyusi",
  segments: [
    sg('a', "Server ishlayapti — brauzerda <code>/api/v1</code>: <b>Swagger</b> sahifasi ochiladi", "Server ishlayapti. Brauzerda localhost uch ming, slesh api v bir ni ochamiz. Bu Swagger, loyihaning menyusi: o'quvchi m4a-01 darsida shu sahifani ko'rgan. Oddiy localhost uch ming ochilsa to'rt yuz to'rt chiqadi, sababini keyingi bosqichda ko'ramiz.", { hl: [] }),
    sg('b', "<code>admin</code> bo'limida <b>9 route</b>: signin, token, signout va olti CRUD route", "admin bo'limida to'qqizta route: kirish uchun signin, token va signout, qolgan oltitasi adminlarni yaratish, ko'rish, o'zgartirish va o'chirish uchun.", { hl: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
    sg('c', "Qulf — <b>hujjatdagi belgi</b>: <code>token</code> va <code>signout</code>da qulf yo'q, lekin ular ham token so'raydi", "Ba'zi qatorlarda qulf belgisi bor: bu route'ga token kerak, u Authorize tugmasi orqali beriladi. Lekin ehtiyot bo'ling: qulfni dasturchi qo'lda qo'yadi. token va signout'da qulf yo'q, ammo ular ham token so'raydi. Ishonchli manba qulf emas, Guard kodi, uni to'rtinchi bosqichda o'qiymiz.", { hl: [3, 4], auth: true }),
    sg('d', "Xulosa: Swagger'da route, kiruvchi shakl va javob ko'rinadi — <b>o'quvchi uchun asosiy oyna</b>", "Xulosa: Swagger'da hamma route, kiruvchi ma'lumot shakli va javob namunasi bor, Postman kerak emas. Endi o'zingiz shu holatga keling: birinchi amaliyot.", { hl: [] }),
  ],
};
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <>
    <Browser url="localhost:3000/api/v1" out="Swagger UI" />
    <Swagger hl={seg.hl} authHl={seg.auth} />
    <Block at={2} beat={beat}><div className="n2-warn"><b>{t('Qulf', 'Замок')}</b> {t("— Swagger hujjatidagi belgi (dasturchi qo'yadi). Haqiqiy tekshiruv — Guard: tokensiz", '— значок в документации Swagger (ставит разработчик). Реальная проверка — Guard: без токена')} <code>POST /api/v1/admin/token</code> → <b>401</b>.</div></Block>
  </>} />;
}

// ============================================================
//  4 · Amaliyot 1 — o'zingizda ishga tushiring
// ============================================================
const P1 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 10–15 daqiqa", title: "O'quvchi reposini o'zingizda ishga tushiring", tableAt: 3,
  segments: [
    sg('a', "Endi siz: loyihani <b>o'zingizda ishga tushirasiz</b> — to'rt qadam", "Endi navbat sizga: loyihani o'z kompyuteringizda ishga tushirasiz. To'rt qadam, o'n-o'n besh daqiqa. Boshlashdan oldin PostgreSQL ishlab turganini tekshiring.", { hl: [] }),
    sg('b', "1–2-qadam: clone, install, <code>.env</code> — <b>Superadmin blokini to'ldirmasdan</b> ishga tushirmang", "Birinchi: clone va npm install. Ikkinchi: env example'dan env yarating va uch joyni to'ldiring. Superadmin blokini to'ldirmasdan serverni ishga tushirmang, keyin tuzatish qiyinroq.", { hl: [0, 1] }),
    sg('c', "3–4-qadam: baza, server, Swagger; isbot — <code>successfully started</code> satri <b>sanasi bilan</b>", "Uchinchi: bazani yarating va serverni ishga tushiring. To'rtinchi: brauzerda Swagger'ni oching. Isbot maydoniga terminaldagi successfully started satrini butunligicha, sanasi bilan nusxalang.", { hl: [2, 3] }),
    sg('d', "Boshqacha chiqsa — pastdagi <b>«Boshqacha chiqdimi?»</b> tugmasi; katakcha va isbotsiz Davom ochilmaydi", "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: sinfda ham aynan shu holatlar chiqadi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi.", { hl: [] }),
  ],
};
const P1_STEPS = [
  { t: 'Clone va install', cmds: ['git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git', 'cd IntroNestArxitechture', 'npm install'], exp: 'added … packages' },
  { t: '.env', cmds: ['cp .env.example .env'], exp: "DEV_DB_URL (parol, nestarxitechture) · NODE_ENV=dev · USER_NAME, FULL_NAME, PHONE, PASSWORD (kuchli: Superadmin1! kabi)" },
  { t: 'Baza va server', cmds: ['createdb -U postgres nestarxitechture', 'npm run start:dev'], exp: 'Super admin created successfully · 9 ta Mapped {/api/v1/admin…} · server runnig onn port 3000' },
  { t: 'Swagger', cmds: ['localhost:3000/api/v1'], exp: "admin bo'limi, 9 route" },
];
const P1_TROUBLE = [
  ['Unable to connect + ECONNREFUSED / password authentication failed / does not exist', "Nest-1 dagi baza xatolari: PostgreSQL ishlamayapti · parol noto'g'ri · baza yaratilmagan"],
  ['Unable to connect + getaddrinfo ENOTFOUND base', ".env umuman yo'q — 2-qadam"],
  ["error TS2307: Cannot find module 'class-validator'", 'npm install oxirigacha bormagan — qayta npm install'],
  ['EADDRINUSE: address already in use :::3000', 'Nest-1 dagi cars-api ochiq qolgan — uni yoping'],
  ['Super admin created successfully chiqmadi', 'superadmin bazada bor (ilgari ishga tushirgansiz) — normal; kira olmasangiz 6-ekran'],
];
const P1_PROOF = { label: "Isbot: terminaldagi «Nest application successfully started» satri — sanasi bilan", placeholder: "terminaldagi satrni shu yerga qo'ying", check: (v) => /successfully started/i.test(v) && /\b20\d\d\b/.test(v), wrong: "Satr «successfully started» so'zlari va sanasi (yil) bilan bo'lsin — terminaldan butun satrni nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  5 · Farqlar: server joyi, prefiks, javob shakli
// ============================================================
const MAIN_LINES = ts(String.raw`
import { Aplication } from './api/app.service';

void Aplication.main();`);
const APPSVC_LINES = ts(String.raw`
export class Aplication {
  static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionFilter());
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    const api: string = 'api/v1';

    app.setGlobalPrefix(api);
    …
    await app.listen(PORT, () => console.log('server runnig onn port', PORT));
  }
}`, { 1: { id: 'cls' }, 2: { id: 'cls' }, 3: { id: 'cls' }, 5: { id: 'set' }, 6: { id: 'set' }, 7: { id: 'set' }, 8: { id: 'set' }, 9: { id: 'set' }, 10: { id: 'set' }, 11: { id: 'set' }, 12: { id: 'set' }, 13: { id: 'set' }, 14: { id: 'pre' }, 16: { id: 'pre' }, 18: { id: 'listen' } });
const S5 = {
  kicker: '2-bosqich · farqlar', title: "Uch farq: server boshqa faylda, manzil /api/v1 bilan, javob bitta shaklda",
  segments: [
    sg('a', "<code>main.ts</code> uch satr — server <b><code>api/app.service.ts</code></b>dagi <code>Aplication.main()</code>da ishga tushadi", "Loyiha ishlayapti. Endi uni cars api bilan solishtiramiz, uchta farq bor. Birinchisi: main ts'da atigi uch satr, u faqat Aplication klassini chaqiradi. Server api papkasidagi app service ts'da ishga tushadi. Nomi Service, lekin bu Service emas, ichida Nest birinchi darsidagi create va listen.", { file: F.appSvc, focus: ['cls', 'listen'] }),
    sg('b', "Ikkinchi farq — <b>global prefiks</b>: har route oldiga <code>api/v1</code> o'zi qo'shiladi", "Ikkinchisi shu faylda: global prefiks, api v bir. Controller'da admin deb yozilgan, lekin manzil api v bir slesh admin. Shuning uchun slesh admin ochilsa to'rt yuz to'rt. To'g'ri manzilda to'rt yuz bir, ya'ni route bor, faqat token kerak.", { file: F.appSvc, focus: ['pre'] }),
    sg('c', "Uchinchi farq — <b>javob shakli</b>: muvaffaqiyat <code>data</code> ichida, xato <code>error.message</code> ichida", "Uchinchisi: javob shakli. cars api'da Nest o'zining standart shaklini qaytarardi. Bu loyihada muvaffaqiyatli javob statusCode, message va data ko'rinishida, xato esa statusCode va error ichida message. Buni ikki fayl qiladi: successRes va global xato filtri.", { file: F.appSvc, focus: ['set'] }),
    sg('d', "Filtr oddiy xatoni <b>500</b> qiladi, sababini <b>terminalga</b> yozadi; <code>Danggg</code> satri — xato emas", "Filtr haqida yana ikki gap. HttpException oilasidan bo'lmagan har qanday xato besh yuz bo'ladi, Internal server error, haqiqiy sababi esa terminalga yoziladi. Terminalda har xatodan oldin Danggg degan so'z chiqadi: bu filtrdagi console log, xato emas.", { file: F.filter, focus: [] }),
    sg('e', "Xulosa: 404 ko'rsangiz — avval <code>/api/v1</code>; 500 ko'rsangiz — <b>terminalni o'qing</b>", "Xulosa: bu loyihada to'rt yuz to'rt ko'rsangiz, avval manzilda api v bir bor-yo'qligini tekshiring. Besh yuz ko'rsangiz, sababni brauzerdan emas, terminaldan qidiring. O'quvchi app service'ni ochib Service qidirsa, server shu yerda yoqiladi deb ayting.", { file: F.appSvc, focus: [] }),
  ],
};
const FILTER_LINES = ts(String.raw`
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Internal server error';
    console.log(exception);
    if (exception instanceof HttpException) {
      console.log('Danggg', exception.getResponse());
      …
    }
    res.status(status).json({ statusCode: status, error: { message: errorMessage } });
  }
}`, { 4: { id: 'st' }, 5: { id: 'st' }, 6: { id: 'st' }, 7: { id: 'st' }, 9: { id: 'st' }, 10: { id: 'log' }, 12: { id: 'log' }, 15: { id: 'out' } });
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg, beat }) => <Ide files={tree(BASE, [F.filter, F.okRes])} active={beat === 0 ? F.main : seg.file}>
    {beat === 0 && <CodePanel file={F.main} lines={MAIN_LINES} />}
    {seg.file === F.filter
      ? <CodePanel file={F.filter} lines={FILTER_LINES} focus={['st', 'log']} />
      : <CodePanel file={F.appSvc} lines={APPSVC_LINES} focus={seg.focus} />}
    <Block at={1} beat={beat}><div className="n2-grid2">
      <Browser url="localhost:3000/admin" out="404" er /><Browser url="localhost:3000/api/v1/admin" out="401" />
    </div></Block>
    <Block at={2} beat={beat}><div className="n2-grid2">
      <Json st={200}>{`{"statusCode":200,"message":"success","data":[…]}`}</Json>
      <Json st={404}>{`{"statusCode":404,"error":{"message":"Cannot GET /admin"}}`}</Json>
    </div></Block>
  </Ide>} />;
}

// ============================================================
//  6 · Farqlar: .env, config va ikki tuzoq
// ============================================================
const CFG_LINES = ts(String.raw`
dot.config();

export const config = {
  PORT: Number(process.env.PORT),

  DB: {
    url:
      String(process.env.NODE_ENV) === 'dev'
        ? String(process.env.DEV_DB_URL)
        : String(process.env.PROD_DB_URL),
    sync: String(process.env.NODE_ENV) === 'dev' ? true : false,
  },

  Token: {
    access_token_key: String(process.env.Access_Token_Key) || 'secret',
    …
  },

  SuperAdmin: {
    username: String(process.env.USER_NAME),
    password: String(process.env.PASSWORD),
    …
  },
};`, { 1: { id: 'dot' }, 6: { id: 'db' }, 7: { id: 'db' }, 8: { id: 'db' }, 9: { id: 'db' }, 10: { id: 'db' }, 11: { id: 'db' }, 12: { id: 'db' }, 19: { id: 'sa' }, 20: { id: 'sa' }, 21: { id: 'sa' }, 22: { id: 'sa' }, 23: { id: 'sa' } });
const NODEENV_TERM = term(String.raw`
# NODE_ENV=prod, prod bazasi yo'q
[Nest] ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
error: database "nest2_prod" does not exist          ← o'quvchida nomi db_prod
…  (9 marta qayta urinadi, keyin yiqiladi)
# NODE_ENV=prod, baza bor, lekin bo'sh (jadval yaratilmaydi)
InternalServerErrorException: error in creating super admin`);
const BLANK_SA = plainLines(String.raw`
$ psql -d nestarxitechture -c "select username, role from admins"
 username |    role
----------+------------
 ali      | admin
          | superAdmin          ← nomsiz superadmin
# .env to'ldirildi, server qayta yoqildi: «Super admin created» — 0 marta
POST /api/v1/admin/signin  {"username":"superadmin","password":"Superadmin1!"}
{"statusCode":401,"error":{"message":"Admin not fount"}}`, { 5: { id: 'blank' }, 8: { id: 'res' } });
const S6 = {
  kicker: '2-bosqich · farqlar', title: "To'rtinchi farq: hamma sozlama .env'dan — va ikki jim tuzoq",
  segments: [
    sg('a', "<code>config/index.ts</code> <code>.env</code>ni o'qiydi: <b>port, baza, token kaliti, superadmin</b>", "Ikkinchi ekranda env'ni to'ldirdik. Endi uni kim o'qishini ko'ramiz: config papkasidagi index ts. U env'dan port, baza manzili, token kaliti va superadmin ma'lumotlarini oladi. Loyihaning qolgan qismi env'ga emas, shu config'ga murojaat qiladi.", { focus: ['dot'] }),
    sg('b', "<code>NODE_ENV=dev</code> → dev bazasi va <b>jadvallar o'zi yaratiladi</b>; boshqa qiymat → prod bazasi", "Eng muhim qator: NODE ENV dev bo'lsa, dev baza manzili olinadi va synchronize yoqiladi, ya'ni TypeORM jadvallarni o'zi yaratadi. Boshqa har qanday qiymatda prod manzili olinadi va jadvallar yaratilmaydi.", { focus: ['db'] }),
    sg('c', "<code>NODE_ENV</code> noto'g'ri: <b>does not exist</b> yoki <b>error in creating super admin</b> — sabab yashirin", "Sinab ko'rdik: NODE ENV prod bo'lsa va prod bazasi yo'q bo'lsa, server database does not exist deb yiqiladi. Prod bazasi bor, lekin bo'sh bo'lsa, xabar boshqa: error in creating super admin. Haqiqiy sabab, jadval yo'qligi, kod ichida yashirin. Ikkala holatda javob bitta: NODE ENV dev.", { focus: ['db'] }),
    sg('d', "Jim tuzoq: superadmin bo'sh qolsa — bazada <b>nomsiz superadmin</b>; <code>.env</code>ni keyin to'ldirish yordam bermaydi", "Ikkinchi tuzoq jimroq. Superadmin bloki bo'sh qolsa, server xatosiz ishga tushadi va bazaga nomsiz superadmin yozadi. Keyin env to'ldirilsa ham yangisi yaratilmaydi: server superadmin bor deb hisoblaydi. Sinab ko'rdik: env'dagi nom bilan kirilsa to'rt yuz bir, Admin not fount.", { focus: ['sa'] }),
    sg('e', "Xulosa: o'quvchi kira olmasa — <b>bo'sh superadmin satrini o'chirib</b>, serverni qayta yoqing", "Xulosa: env'da NODE ENV dev bo'lsin va superadmin bloki to'liq bo'lsin. O'quvchi to'g'ri nom bilan kira olmasa va bazada nomsiz superadmin bo'lsa, o'sha satrni o'chiring va serverni qayta ishga tushiring. Sinab ko'rdik: superadmin env'dan yangidan yoziladi va signin ishlaydi.", { focus: [] }),
  ],
};
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => <Ide files={tree(BASE, [F.cfg, F.env])} active={F.cfg}>
    <CodePanel file={F.cfg} lines={CFG_LINES} focus={seg.focus} />
    {beat === 2 && <Term er lines={NODEENV_TERM} />}
    {beat >= 3 && <Term lines={BLANK_SA} focus={beat === 3 ? ['blank', 'res'] : []} />}
    <Block at={4} beat={beat}><div className="mk-rule"><b>{t('Yechim:', 'Решение:')}</b> <code>psql -U postgres -d nestarxitechture -c "DELETE FROM admins WHERE role='superAdmin';"</code> → <code>npm run start:dev</code> → <code>Super admin created successfully</code> → signin <b>201</b></div></Block>
  </Ide>} />;
}

// ============================================================
//  7 · Tekshiruv 1 — «/admin ochdim, 404»
// ============================================================
function Screen7(p) {
  return <MCRetry {...p} kicker={t('Tekshiruv 1', 'Проверка 1')} eyebrow={t('Tekshiruv · 1 / 4', 'Проверка · 1 / 4')}
    title={t("O'quvchi: «Brauzerda localhost:3000/admin ochdim — 404». Birinchi nimani tekshirasiz?", 'Ученик: «Открыл в браузере localhost:3000/admin — 404». Что проверите первым?')}
    q={t("Farqlarni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi aytadi: brauzerda localhost uch ming slesh admin ochdim, to'rt yuz to'rt. Server ishlayapti, terminalda xato yo'q. Birinchi nimani tekshirasiz? Variantni tanlang.", 'Вы видели отличия, давайте проверим. Первая проверка. Ученик говорит: открыл в браузере localhost 3000 admin, получил 404. Сервер работает, в терминале ошибок нет. Что вы проверите первым? Выберите вариант.')}
    opts={t(['app.module.ts — AdminModule imports\'da bormi', 'Manzil — prefiks /api/v1 tushib qolgan', '.env — PostgreSQL paroli to\'g\'rimi', 'Swagger — Authorize bosilganmi'], ['app.module.ts — есть ли AdminModule в imports', 'Адрес — пропущен префикс /api/v1', '.env — верный ли пароль PostgreSQL', 'Swagger — нажата ли Authorize'])} correct={1}
    ok={t("Manzil. Bu loyihada hamma route api v bir bilan boshlanadi. Slesh admin degan route yo'q, shuning uchun to'rt yuz to'rt va Cannot GET slesh admin. Terminalda Mapped satrlari api v bir slesh admin deb turibdi. To'g'ri manzilda to'rt yuz bir chiqadi, bu token masalasi.", 'Адрес. В этом проекте все routes начинаются с api v1. Route просто admin нет, поэтому 404 и Cannot GET admin. В терминале строки Mapped показывают api v1 admin. По правильному адресу будет 401, а это уже вопрос токена.')}
    okShort={t("Prefiks: /api/v1/admin. Terminalda Mapped {/api/v1/admin…} — route bor, manzil noto'g'ri.", 'Префикс: /api/v1/admin. В терминале Mapped {/api/v1/admin…} — route есть, адрес неверный.')}
    wrong={t({ 0: "Modul ulanmagan bo'lsa admin uchun Mapped satri bo'lmasdi; u bor.", 2: "Parol noto'g'ri bo'lsa server ishga tushmasdi: Unable to connect.", 3: "Token yo'q bo'lsa javob 401 bo'ladi, 404 emas." }, { 0: 'Если бы модуль не был подключён, строки Mapped для admin не было бы; а она есть.', 2: 'При неверном пароле сервер бы не запустился: Unable to connect.', 3: 'Без токена ответ был бы 401, а не 404.' })} />;
}

// ============================================================
//  3-BOSQICH · resurs: car, 5 qatlam bir marta (8–15)
// ============================================================
const CAR_ENT_LINES = ts(String.raw`
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity('cars')
export class CarEntity extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  price: number;

  @Column({ default: true })
  is_available: boolean;
}`, { 4: { id: 'ent' }, 5: { id: 'ext' }, 6: { id: 'col' }, 7: { id: 'col' }, 9: { id: 'col' }, 10: { id: 'col' }, 12: { id: 'col' }, 13: { id: 'col' }, 15: { id: 'col' }, 16: { id: 'col' } });
const BASE_ENT_LINES = ts(String.raw`
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}`);
const CORE_IDX_LINES = ts(String.raw`
// Entity export
export * from './entity/Base.entity';
export * from './entity/admin.entity';
export * from './entity/car.entity';

// Repository export
export * from './repository/admin.repository';`, { 4: { neu: true, id: 'exp' } });
const S8 = {
  kicker: '3-bosqich · Entity', title: 'car resursi, 1-qatlam: Entity — jadval shakli',
  segments: [
    sg('a', "Loyihaga <b>bitta resurs</b> qo'shamiz — o'quvchi m4a-03 dagi <b>car</b>, besh qatlam bilan", "Loyihani bilasiz. Endi unga bitta resurs qo'shamiz: mashinalar, car. Aynan o'quvchi m4a-03 darsida qiladigan ish, o'sha nomlar bilan. Resurs besh qatlam: Entity, DTO, Service, Controller va Module. Har qatlam yonida loyihadagi admin fayli namuna bo'lib turadi.", { focus: [] }),
    sg('b', "Entity — <b>jadval shakli</b>: klass jadval, <code>@Column</code> yozilgan har maydon — ustun", "Birinchi qatlam Entity, core papkasida. Entity bazadagi jadvalning shakli: klass jadval, ustiga Column decorator'i yozilgan har maydon bitta ustun. SQL yozilmaydi: TypeORM jadvalni shu klassdan o'zi yaratadi.", { focus: ['ent', 'col'] }),
    sg('c', "<code>BaseEntity</code>dan meros — <b>id (uuid) va ikki sana tekin</b>; <code>id</code>ni qayta yozish xato", "Klass Base entity'dan meros oladi va undan uchta ustun tekin keladi: id, yaratilgan va o'zgartirilgan vaqt. id raqam emas, uuid, o'ttiz olti belgili matn. O'quvchi id ustunini qo'lda yozsa, bu takror: o'quvchi darsida aynan shu xato sifatida ko'rsatiladi.", { focus: ['ext'] }),
    sg('d', "To'rt o'z ustuni; yangi Entity <b><code>core/index.ts</code>ga ham</b> yoziladi, aks holda topilmaydi", "O'z ustunlarimiz to'rtta: brand va model matn, price raqam, is available standart qiymati true. Va bitta loyiha qoidasi: core papkasidagi index ts hamma Entity'ni bir joydan beradi, yangi Entity shu yerga qo'shiladi. Qo'shilmasa, boshqa fayllar Car entity'ni topa olmaydi, TypeScript xato beradi.", { focus: ['col'] }),
    sg('e', "Xulosa: Entity — jadval shakli; jadvalning o'zi <b>modul ulangach</b>, server ishga tushganda paydo bo'ladi", "Xulosa: Entity jadval shakli, u core papkasida, Base entity'dan meros bilan. Bazada jadval hozircha yo'q: TypeORM uni server ishga tushganda, resurs moduli ulangandan keyin yaratadi. O'quvchi darsi Entity'ni javon chizmasi deydi.", { focus: [] }),
  ],
};
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => <>
    <LayerPath at={0} />
    <Ide files={tree(BASE, [F.baseEnt, F.aEnt], beat >= 1 ? [F.cEnt] : [])} active={beat >= 3 && seg.id !== 'e' ? F.coreIdx : (beat >= 1 ? F.cEnt : F.aEnt)} fresh={[F.cEnt]}>
      {beat === 0
        ? <CodePanel file={F.aEnt + ' · ' + t('loyihadagi namuna', 'образец из проекта')} lines={ts(String.raw`
@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  hashed_password: string;
  …
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;
}`)} />
        : <CodePanel file={F.cEnt} lines={CAR_ENT_LINES} focus={seg.focus} />}
      {beat === 2 && <CodePanel file={F.baseEnt} lines={BASE_ENT_LINES} />}
      {beat >= 3 && <CodePanel file={F.coreIdx} lines={CORE_IDX_LINES} focus={beat === 3 ? ['exp'] : []} />}
      {beat === 3 && <Term er lines={term(t(String.raw`error TS2305: Module '"src/core"' has no exported member 'CarEntity'.   ← export yozilmasa`, String.raw`error TS2305: Module '"src/core"' has no exported member 'CarEntity'.   ← если не написан export`))} />}
    </Ide>
  </>} />;
}

// ============================================================
//  9 · DTO va ValidationPipe
// ============================================================
const CDTO_LINES = ts(String.raw`
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Chevrolet' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Malibu' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}`, { 5: { id: 'api' }, 6: { id: 'rule' }, 7: { id: 'rule' }, 10: { id: 'api' }, 11: { id: 'rule' }, 12: { id: 'rule' }, 15: { id: 'api' }, 16: { id: 'rule' }, 19: { id: 'api' }, 20: { id: 'rule' }, 21: { id: 'rule' } });
const UDTO_LINES = ts(String.raw`
import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {}`, { 1: { id: 'pkg' }, 4: { id: 'pt' } });
const PIPE_LINES = ts(String.raw`
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`, { 3: { id: 'w' }, 4: { id: 'w' } });
const S9 = {
  kicker: '3-bosqich · DTO', title: "2-qatlam: DTO — kiruvchi ma'lumot qoidalari, 400 shu yerdan",
  segments: [
    sg('a', "Jadval shakli bor. DTO — <b>so'rovdan keladigan</b> ma'lumot shakli va qoidalari", "Jadval shakli tayyor. Ikkinchi qatlam so'rovdan keladigan ma'lumot: DTO. Entity bazadagi jadval, DTO esa so'rovdagi ma'lumot, ikkalasini adashtirmang. DTO'lar resurs papkasining ichidagi dto papkasida turadi.", { focus: [], file: F.cCdto }),
    sg('b', "Har maydonda qoida: <code>brand</code>, <code>model</code> — matn va bo'sh emas, <code>price</code> — raqam, <code>is_available</code> — ixtiyoriy", "Yaratish DTO'sida har maydon ustida qoida: brand va model matn bo'lsin va bo'sh bo'lmasin, price raqam bo'lsin, is available ixtiyoriy. Har maydonda yana bitta decorator bor, Swagger uchun misol: Swagger'dagi tayyor JSON shu misollardan yig'iladi.", { focus: ['rule', 'api'], file: F.cCdto }),
    sg('c', "O'zgartirish DTO'si — <b><code>PartialType</code></b>: o'sha maydonlar, hammasi ixtiyoriy", "O'zgartirish DTO'si bitta qator: Partial type, ya'ni yaratishdagi maydonlar, lekin hammasi ixtiyoriy, PATCH'da faqat o'zgargan maydon yuboriladi. Partial type nestjs swagger paketidan olinadi. Boshqa paketdan olinsa ham ishlaydi, lekin Swagger'da maydonlar yo'qoladi, buni sinab ko'rdik.", { focus: ['pt', 'pkg'], file: F.cUdto }),
    sg('d', "Qoidalarni <b>global ValidationPipe</b> tekshiradi: DTO'da yo'q maydon ham <b>400</b>", "Qoidalarni kim tekshiradi? Loyihada global ValidationPipe yoqilgan. cars api'da bo'sh so'rov ikki yuz bir qaytargan edi; bu loyihada qoida buzilsa to'rt yuz, xabarda hamma buzilgan qoida sanaladi. Yana bir sozlama: DTO'da yo'q maydon kelsa ham to'rt yuz, property should not exist.", { focus: ['w'], file: F.appSvc }),
    sg('e', "Xulosa: 400 ko'rsangiz — xabar DTO'dagi <b>qaysi qoida</b> buzilganini aytadi", "Xulosa: DTO ikki fayl, kiruvchi ma'lumot qoidalari faqat shu yerda. To'rt yuz ko'rsangiz, xabarni o'qing: qaysi maydon, qaysi qoida. Haqiqiy javoblarni o'n uchinchi ekranda ko'ramiz. O'quvchi darsi DTO'ni buyurtma anketasi deydi.", { focus: [], file: F.cCdto }),
  ],
};
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => <>
    <LayerPath at={1} />
    <Ide files={tree(BASE, [F.cEnt, F.cCdto, F.cUdto])} active={seg.file === F.appSvc ? F.appSvc : seg.file} fresh={[F.cCdto, F.cUdto]}>
      {seg.file === F.appSvc
        ? <CodePanel file={F.appSvc + ' · 18–24'} lines={PIPE_LINES} focus={seg.focus} />
        : seg.file === F.cUdto
          ? <><CodePanel file={F.cUdto} lines={UDTO_LINES} focus={seg.focus} /><div className="n2-grid2">
              <div className="mk-card"><h5>@nestjs/swagger</h5><div style={{ fontSize: 13 }}>{t("Swagger'da UpdateCarDto: brand · model · price · is_available", 'В Swagger UpdateCarDto: brand · model · price · is_available')}</div></div>
              <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>@nestjs/mapped-types</h5><div style={{ fontSize: 13 }}>{t("Swagger'da UpdateCarDto: properties: {} — maydonlar yo'q (PATCH baribir 200)", 'В Swagger UpdateCarDto: properties: {} — полей нет (PATCH всё равно 200)')}</div></div>
            </div></>
          : <CodePanel file={F.cCdto} lines={CDTO_LINES} focus={seg.focus} />}
      {beat === 1 && <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">Swagger · Example Value</div><pre className="n2-json">{'{ "brand": "Chevrolet", "model": "Malibu", "price": 250, "is_available": true }'}</pre></div>}
    </Ide>
  </>} />;
}

// ============================================================
//  10 · BaseService
// ============================================================
const BASESVC_LINES = ts(String.raw`
export class BaseService<CreateDto, UpdateDto, Entity> {
  constructor(private readonly repository: Repository<any>) {}

  async create(dto: CreateDto): Promise<ISuccessRes> {
    let data = this.repository.create({ ...dto }) as any as Entity;
    data = await this.repository.save(data);
    return successRes(data, 201);
  }
  async findAll(options?) { … return successRes(data); }
  async findAllWithPagination(options?) { … }
  async findOneBy(options) { … }
  async findOneById(id: string, options?) {
    …
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return successRes(data);
  }
  async update(id: string, dto: UpdateDto) { await this.findOneById(id); … }
  async remove(id: string) { await this.findOneById(id); … return successRes({}); }
}`, { 1: { id: 'cls' }, 2: { id: 'repo' }, 4: { id: 'm' }, 7: { id: 'res' }, 9: { id: 'm' }, 10: { id: 'm' }, 11: { id: 'm' }, 12: { id: 'm' }, 15: { id: 'nf' }, 17: { id: 'res' }, 19: { id: 'm' }, 20: { id: 'm' } });
const S10 = {
  kicker: '3-bosqich · Service', title: 'BaseService — CRUD bir marta yozilgan, hamma resurs meros oladi',
  segments: [
    sg('a', "Nest-1 da CRUD'ni o'zingiz yozgansiz — bu yerda u <b>bir marta, BaseService'da</b> yozilgan", "Uchinchi qatlam Service, lekin avval uning poydevori. Nest birinchi darsida findAll, findOne va create'ni o'zingiz yozgansiz. Bu loyihada ular bir marta, infrastructure papkasidagi Base service'da yozilgan va hamma resurs uchun ishlaydi.", { focus: ['cls', 'repo'] }),
    sg('b', "<b>Yetti metod</b>: yaratish, ro'yxat (oddiy va sahifalab), bittasini topish (ikki usul), o'zgartirish, o'chirish", "Base service'da yettita metod: yaratish, oddiy va sahifalangan ro'yxat, bittasini topishning ikki usuli, o'zgartirish va o'chirish. Yozuv topilmasa hammasi bir xil javob beradi: to'rt yuz to'rt, not found.", { focus: ['m', 'nf'] }),
    sg('c', "Har metod javobni <code>successRes</code> bilan qaytaradi — <b>beshinchi ekrandagi o'sha shakl</b>", "Har metod javobni successRes orqali qaytaradi, beshinchi ekrandagi o'sha shakl: yaratishda statusCode ikki yuz bir, qolganida ikki yuz. Shuning uchun hamma resursning javobi bir xil ko'rinadi.", { focus: ['res'] }),
    sg('d', "Xulosa: CRUD <b>qayta yozilmaydi</b>; o'ziga xos ish bo'lsa — faqat o'sha metod ustiga yoziladi", "Xulosa: yangi resursda CRUD qayta yozilmaydi, u Base service'dan meros. O'ziga xos ish kerak bo'lsa, masalan admin'da parolni shifrlash, faqat o'sha metod ustiga yoziladi. O'quvchi darsi Base service'ni tayyor retsept kitobi deydi.", { focus: [] }),
  ],
};
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg, beat }) => <>
    <LayerPath at={2} />
    <Ide files={tree(BASE, [F.cEnt, F.cCdto, F.cUdto, F.baseSvc, F.okRes])} active={F.baseSvc}>
      <CodePanel file={F.baseSvc} lines={BASESVC_LINES} focus={seg.focus} />
      <Block at={2} beat={beat}><CodePanel file={F.okRes} lines={ts(String.raw`
export const successRes = (data: any, statusCode = 200): ISuccessRes => {
  return { statusCode, message: 'success', data };
};`)} /></Block>
      <Block at={0} beat={beat}><div className="n2-cmp">
        <div className="mk-card"><h5>Nest-1 · cars.service.ts</h5><div style={{ fontSize: 13.5 }}>{t('27 satr: massiv, findAll, findOne, create — har resursda qaytadan', '27 строк: массив, findAll, findOne, create — заново в каждом ресурсе')}</div></div>
        <div className="mk-card" style={{ borderColor: PART.svc }}><h5 style={{ color: PART.svc }}>{t("o'quvchi reposi · car.service.ts", 'репозиторий ученика · car.service.ts')}</h5><div style={{ fontSize: 13.5 }}>{t('ish qismi 8 satr — CRUD BaseService\'dan', 'рабочая часть 8 строк — CRUD из BaseService')}</div></div>
      </div></Block>
    </Ide>
  </>} />;
}

// ============================================================
//  11 · Service va Repository
// ============================================================
const CSVC_LINES = ts(String.raw`
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CarEntity } from 'src/core';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService extends BaseService<CreateCarDto, UpdateCarDto, CarEntity> {
  constructor(
    @InjectRepository(CarEntity) private readonly carRepo: Repository<CarEntity>,
  ) {
    super(carRepo);
  }
}`, { 9: { id: 'inj' }, 10: { id: 'ext' }, 11: { id: 'repo' }, 12: { id: 'repo' }, 13: { id: 'repo' }, 14: { id: 'super' }, 15: { id: 'super' } });
function DiScheme({ on }) {
  const box = (k, c, h, d, f) => <div className={`mk-box${on === k ? ' hl' : ''}`} style={{ '--c': c, opacity: on && on !== k && on !== 'all' ? 0.55 : 1 }}><h4>{h}</h4><p>{d}</p><div style={{ font: `600 11px ${MONO}`, color: T.ink3, marginTop: 6 }}>{f}</div></div>;
  return <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("Repository qayerdan keladi — Nest-1 dagi Dependency Injection, uch qadam", 'Откуда берётся Repository — Dependency Injection из Nest-1, три шага')}</div>
    <div className="mk-row">
      {box('mod', PART.mod, '1 · forFeature([CarEntity])', t('modul: «shu jadval kerak»', 'модуль: «нужна эта таблица»'), 'car.module.ts')}
      <div className="mk-arrow on">→</div>
      {box('orm', N2.entity, '2 · TypeORM', t('Repository<CarEntity> instance yasaydi', 'создаёт instance Repository<CarEntity>'), 'TypeOrmModule')}
      <div className="mk-arrow on">→</div>
      {box('svc', PART.svc, '3 · @InjectRepository', t('konstruktorga beriladi', 'передаётся в конструктор'), 'car.service.ts')}
    </div>
  </div>;
}
const S11 = {
  kicker: '3-bosqich · Service', title: '3-qatlam: Service — meros, Repository va super',
  segments: [
    sg('a', "<code>CarService</code> — <code>@Injectable</code> va BaseService'dan meros: ish qismi <b>sakkiz satr</b>, metod yo'q", "Endi car service. Ustida Injectable, Nest birinchi darsidagidek. Klass Base service'dan meros oladi, uchta tip bilan: ikki DTO va Entity. Ish qismi sakkiz satr, birorta metod yozilmagan.", { focus: ['inj', 'ext'], di: null }),
    sg('b', "Konstruktorda <b>Repository</b> so'raladi va <b><code>super</code></b> orqali BaseService'ga beriladi", "Konstruktorda bitta dependency: shu jadvalning Repository'si, ya'ni bazaga yozish va o'qish metodlari. Keyingi qatorda u super orqali Base service'ga beriladi: endi yetti metod qaysi jadval bilan ishlashni biladi. super unutilsa, TypeScript kompilyatsiyada xato beradi.", { focus: ['repo', 'super'], di: null, err: true }),
    sg('c', "Repository'ni <b>TypeORM yasaydi</b>: modulda <code>forFeature</code> va Service'da <code>InjectRepository</code> — juft", "Repository'ni o'zingiz yozmaysiz, uni TypeORM yasaydi. Buning uchun ikki joy kerak va ular juft: resurs modulida forFeature, Service konstruktorida InjectRepository, ikkalasida ham o'sha Entity. Bu Nest birinchi darsidagi Dependency Injection, faqat instance'ni TypeORM beradi.", { focus: ['repo'], di: 'all' }),
    sg('d', "Loyihadagi namuna — <code>AdminService</code>: tuzilishi xuddi shu, ustiga <b>parol va token</b> ishi", "Yonidagi admin service ham xuddi shunday tuzilgan, faqat ishi ko'proq: parolni shifrlaydi, token beradi va server ishga tushganda superadmin yaratadi. Uning ham CRUD qismi Base service'dan keladi.", { focus: [], di: null, admin: true }),
    sg('e', "Xulosa: Service — <b>meros, Repository va <code>super</code></b>; mashinaga xos logika bo'lsa — shu yerga", "Xulosa: Service uch narsa: Base service'dan meros, Repository va super. Mashinaga xos logika chiqsa, masalan chegirma, u shu yerga yoziladi, Controller'ga emas. O'quvchi kodida CRUD qaytadan yozilgan bo'lsa, ishlaydi, lekin ortiqcha: Base service bor deb ayting.", { focus: [], di: null }),
  ],
};
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <>
    <LayerPath at={2} />
    {seg.di && <DiScheme on={seg.di} />}
    <Ide files={tree(BASE, [F.cEnt, F.cCdto, F.cUdto, F.cSvc], seg.admin ? [F.aSvc] : [])} active={seg.admin ? F.aSvc : F.cSvc} fresh={[F.cSvc]}>
      {seg.admin
        ? <CodePanel file={F.aSvc + ' · ' + t('loyihadagi namuna', 'образец из проекта')} lines={ts(t(String.raw`
@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }
  async onModuleInit() { … }      // superadmin .env'dan
  async create(dto) { … }          // parolni shifrlaydi
  async signIn(dto, res) { … }     // token beradi
}`, String.raw`
@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }
  async onModuleInit() { … }      // superadmin из .env
  async create(dto) { … }          // шифрует пароль
  async signIn(dto, res) { … }     // выдаёт токен
}`))} />
        : <CodePanel file={F.cSvc} lines={CSVC_LINES} focus={seg.focus} />}
      {seg.err && <Term er lines={term(t(String.raw`error TS2377: Constructors for derived classes must contain a 'super' call.   ← super unutilsa`, String.raw`error TS2377: Constructors for derived classes must contain a 'super' call.   ← если забыли super`))} />}
    </Ide>
  </>} />;
}

// ============================================================
//  12 · Controller, Module, AppModule
// ============================================================
const CCTRL_LINES = ts(String.raw`
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}`, { 5: { id: 'r' }, 6: { id: 'dto' }, 7: { id: 'r' }, 10: { id: 'r' }, 11: { id: 'r' }, 12: { id: 'r' }, 15: { id: 'r' }, 16: { id: 'r' }, 17: { id: 'id' }, 20: { id: 'r' }, 21: { id: 'dto' }, 22: { id: 'r' }, 25: { id: 'r' }, 26: { id: 'r' }, 27: { id: 'r' } });
const CMOD_LINES = ts(String.raw`
@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}`, { 2: { id: 'ff' }, 3: { id: 'l' }, 4: { id: 'l' } });
const APPMOD_LINES = ts(String.raw`
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({ … }),
    AdminModule,
    AuthModule,
    CarModule,
  ],`, { 6: { neu: true } });
const CAR_START = term(String.raw`
[Nest] LOG [InstanceLoader] CarModule dependencies initialized
[Nest] LOG [RoutesResolver] CarController {/api/v1/car}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, PATCH} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, DELETE} route
[Nest] LOG [NestApplication] Nest application successfully started`);
const CARS_TABLE = plainLines(String.raw`
$ psql -d nestarxitechture -c "\d cars"
 id           | uuid                        | not null | uuid_generate_v4()
 created_at   | timestamp without time zone | not null | now()
 updated_at   | timestamp without time zone | not null | now()
 brand        | character varying           | not null |
 model        | character varying           | not null |
 price        | integer                     | not null |
 is_available | boolean                     | not null | true`);
const S12 = {
  kicker: '3-bosqich · Controller · Module', title: 'Controller, Module va AppModule — resurs tirik',
  segments: [
    sg('a', "Controller — <b>besh route</b>, har biri bitta satr: Service'ning mos metodini chaqiradi", "To'rtinchi qatlam Controller. Unda beshta route: yaratish, ro'yxat, bittasi, o'zgartirish va o'chirish. Har birining ichida bitta satr, Service'ning mos metodi chaqiriladi, logika yo'q. Bittasini topish metodi Base service'da findOneById deb ataladi, boshqa nom yozilsa TypeScript xato beradi.", { focus: ['r', 'id'], at: 3 }),
    sg('b', "Kirish parametrining tipi <b>DTO</b> — ValidationPipe aynan shu klass qoidalarini tekshiradi", "Yaratish va o'zgartirish route'larida kirish parametrining tipi DTO. Bu shunchaki yozuv emas: ValidationPipe aynan shu klassning qoidalarini tekshiradi. Bu Controller'da Guard yo'q, demak hamma route tokensiz ochiq, o'quvchi darsida ham shunday.", { focus: ['dto'], at: 3 }),
    sg('c', "Module — <b>uch ro'yxat</b>; keyin <b>AppModule</b>'ga ulanadi, aks holda route'lar yo'q", "Beshinchi qatlam Module, uchta ro'yxat: imports'da forFeature, controllers'da Controller, providers'da Service. Va oxirgi qadam bosh modul: app module'ning imports ro'yxatiga Car module. Bu unutilsa, server xatosiz ishga tushadi, lekin car route'lari bo'lmaydi.", { focus: ['ff', 'l'], at: 4 }),
    sg('d', "Terminalda <b>beshta Mapped</b>, bazada <code>cars</code> jadvali — uni <b>hech kim yaratmadi</b>", "Saqlaymiz, server qayta yuklanadi. Terminalda Car controller va beshta Mapped satri. Bazaga qarasak, cars jadvali paydo bo'lgan: id uuid, to'rtta ustun va ikki sana. Uni hech kim yaratmadi, synchronize Entity'dan yasadi.", { focus: [], at: 5 }),
    sg('e', "Xulosa: <b>5 qatlam — 6 fayl</b>, ustiga <code>core/index.ts</code> va AppModule'dagi bitta satr", "Xulosa: besh qatlam olti faylda, chunki DTO ikkita, va yana ikki tahrir: core index'dagi export va app module'dagi bitta satr. Terminalda car uchun Mapped bo'lmasa, birinchi ochadigan fayl app module. Endi so'rov yuboramiz.", { focus: [], at: 5 }),
  ],
};
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => <>
    <LayerPath at={seg.at} />
    <Ide files={tree(BASE, CAR_ALL)} active={beat <= 1 ? F.cCtrl : beat === 2 ? F.cMod : F.appMod} fresh={beat <= 1 ? [F.cCtrl] : beat === 2 ? [F.cMod] : []}>
      {beat <= 1 && <CodePanel file={F.cCtrl} lines={CCTRL_LINES} focus={seg.focus} />}
      {beat === 0 && <Term er lines={term(String.raw`error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?   ← nom boshqacha yozilsa`)} />}
      {(beat === 2 || beat >= 4) && <CodePanel file={F.cMod} lines={CMOD_LINES} focus={beat === 2 ? seg.focus : []} />}
      {beat >= 2 && <CodePanel file={F.appMod + ' · imports'} lines={APPMOD_LINES} />}
      {beat === 3 && <Term lines={CAR_START} />}
      {beat === 3 && <Term title="psql" lines={CARS_TABLE} />}
      {beat >= 4 && <div className="mk-card" style={{ animation: 'mk-up .45s ease both' }}><h5>{t('car resursi — 6 fayl va 2 tahrir', 'ресурс car — 6 файлов и 2 правки')}</h5><div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{t('Yangi fayllar:', 'Новые файлы:')} <code>car.entity.ts</code> · <code>create-car.dto.ts</code> · <code>update-car.dto.ts</code> · <code>car.service.ts</code> · <code>car.controller.ts</code> · <code>car.module.ts</code><br />{t('Tahrir:', 'Правки:')} <code>core/index.ts</code> ({t('export', 'export')}) · <code>app.module.ts</code> (imports: CarModule)</div></div>}
    </Ide>
  </>} />;
}

// ============================================================
//  13 · Haqiqiy so'rovlar
// ============================================================
const REQS13 = [
  { k: 'r1', m: 'POST', u: '/api/v1/car  {"brand":"Chevrolet","model":"Malibu","price":250}', st: 201, body: `{"statusCode":201,"message":"success","data":{"id":"efa80745-74d8-4b56-8ea1-f786f2fff787","created_at":"2026-10-30T21:51:37.138Z","updated_at":"2026-10-30T21:51:37.138Z","brand":"Chevrolet","model":"Malibu","price":250,"is_available":true}}` },
  { k: 'r2', m: 'GET', u: '/api/v1/car', st: 200, body: `{"statusCode":200,"message":"success","data":[{"id":"efa80745-…","brand":"Chevrolet","model":"Malibu","price":250,"is_available":true,…},{"id":"1746997c-…","brand":"Kia","model":"K5","price":320,"is_available":false,…}]}\n(K5 — ikkinchi POST, is_available: false)` },
  { k: 'r3', m: 'PATCH', u: '/api/v1/car/efa80745-…  {"price":240}', st: 200, body: `{"statusCode":200,"message":"success","data":{"id":"efa80745-…","created_at":"2026-10-30T21:51:37.138Z","updated_at":"2026-10-30T21:51:37.228Z","brand":"Chevrolet","model":"Malibu","price":240,"is_available":true}}` },
  { k: 'r4', m: 'DELETE', u: '/api/v1/car/efa80745-…', st: 200, body: `{"statusCode":200,"message":"success","data":{}}\nqayta GET /api/v1/car/efa80745-… → {"statusCode":404,"error":{"message":"not found"}}` },
  { k: 'r5', m: 'POST', u: "/api/v1/car  {} · {…, \"color\":\"oq\"} · {…, \"price\":\"145\"}", st: 400, body: `{}  →  {"statusCode":400,"error":{"message":"brand should not be empty, brand must be a string, model should not be empty, model must be a string, price must be a number conforming to the specified constraints"}}\ncolor  →  {"statusCode":400,"error":{"message":"property color should not exist"}}\n"145"  →  {"statusCode":400,"error":{"message":"price must be a number conforming to the specified constraints"}}` },
  { k: 'r6', m: 'GET', u: '/api/v1/car/1', st: 500, body: `{"statusCode":500,"error":{"message":"Internal server error"}}\nterminal: QueryFailedError: invalid input syntax for type uuid: "1"` },
];
const S13 = {
  kicker: "3-bosqich · so'rovlar", title: "So'rovlar: 201 · 200 · 400 — va /car/1 nega 500", lockHint: "Hamma so'rov tugmasini bosing",
  segments: [
    sg('a', "Resurs tirik: <code>POST</code> → <b>201</b>, <code>id</code> uuid va sanalar o'zi qo'yildi", "Resurs tirik, Swagger'dan so'rov yuboramiz. Mashina qo'shamiz: ikki yuz bir va successRes shaklidagi javob. id uuid, is available true va ikki sana: bularni biz bermadik, ular Base entity'dan va standart qiymatdan.", { open: 'r1' }),
    sg('b', "<code>GET</code> ro'yxat va bittasi, <code>PATCH</code> faqat narx, <code>DELETE</code> — bo'sh <code>data</code>", "GET ro'yxatni va bittasini qaytaradi, ikki yuz. PATCH bilan faqat narxni o'zgartiramiz: ikki yuz, qolgan maydonlar joyida. DELETE: ikki yuz va data bo'sh obyekt. O'chirilgan mashinani qayta so'rasangiz to'rt yuz to'rt.", { open: 'r3' }),
    sg('c', "Qoida buzilsa <b>400</b>: bo'sh so'rov, ortiqcha maydon, qo'shtirnoqdagi raqam", "Endi qoidalarni buzamiz. Bo'sh so'rov: to'rt yuz va hamma buzilgan qoida. Ortiqcha color maydoni: to'rt yuz, property color should not exist. Narx qo'shtirnoq ichida: to'rt yuz, price must be a number. O'quvchi Swagger'dagi misolni o'zgartirganda qo'shtirnoqni ko'p qoldiradi.", { open: 'r5' }),
    sg('d', "<code>/api/v1/car/1</code> → <b>500</b>: id uuid; <code>ParseUUIDPipe</code> qo'shilsa — tushunarli <b>400</b>", "Va o'quvchi odati: cars api'dagidek car slesh bir. Besh yuz. Terminalda sabab: invalid input syntax for type uuid, chunki id raqam emas. Controller'da id parametriga ParseUUIDPipe qo'shilsa, so'rov bazaga yetmaydi: to'rt yuz va tushunarli xabar, Validation failed, uuid is expected.", { open: 'r6', uuid: true }),
    sg('e', "Xulosa: muvaffaqiyat <code>data</code>da, xato <code>error.message</code>da; <b>500 bo'lsa — terminal</b>", "Xulosa: muvaffaqiyat data ichida, xato error message ichida. To'rt yuz bo'lsa xabar DTO qoidasini aytadi, besh yuz bo'lsa sabab terminalda. Endi tugmalarni o'zingiz bosib, har javobni o'qing, keyin Davom ochiladi.", { open: null }),
  ],
};
function Screen13(p) {
  const [open, setOpen] = useState(null);
  const [clicked, setClicked] = useState([]);
  return <Lesson p={p} S={S13} ready={() => clicked.length >= REQS13.length} scene={({ seg }) => {
    const cur = REQS13.find((r) => r.k === (open || seg.open));
    return (<>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("Swagger'dan so'rov — bosing", 'Запрос из Swagger — нажмите')}</div>
        <div className="mk-req">
          {REQS13.map((r) => <button key={r.k} className={(open || seg.open) === r.k ? 'hl' : ''} onClick={() => { setOpen(r.k); setClicked((c) => c.includes(r.k) ? c : [...c, r.k]); }}><span className={`st s${String(r.st)[0]}`}>{r.st}</span><span>{r.m} {r.u}</span></button>)}
        </div>
        {cur && <pre key={cur.k} style={{ animation: 'mk-up .3s ease both' }}>{cur.body}</pre>}
      </div>
      {seg.uuid && <Ide files={tree(BASE, CAR_ALL)} active={F.cCtrl}>
        <CodePanel file={F.cCtrl + ' · findOne'} lines={ts(String.raw`
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carService.findOneById(id);
  }`, { 2: { neu: true } })} />
        <Json st={400}>{`GET /api/v1/car/1  →  {"statusCode":400,"error":{"message":"Validation failed (uuid is expected)"}}`}</Json>
      </Ide>}
    </>);
  }} />;
}

// ============================================================
//  14 · Tekshiruv 2 — qaysi satr boshqa qatlamniki (LineCheck; target 0 dan — 13-satr = 12)
// ============================================================
const LC2_LINES = ts(String.raw`
import { Column, Entity } from 'typeorm';
import { IsNumber } from 'class-validator';
import { BaseEntity } from './Base.entity';

@Entity('cars')
export class CarEntity extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @IsNumber()
  price: number;

  @Column({ default: true })
  is_available: boolean;
}`);
const LC2_FIXED = LC2_LINES.map((l, i) => i === 1 ? { ...l, gone: true } : i === 12 ? { ...l, gone: true } : l)
  .flatMap((l, i) => i === 12 ? [l, { neu: true, h: `  <span class="d">@Column</span>()   <span class="cm">// ustun — Entity'da; @IsNumber — DTO'da</span>` }] : [l]);
function Screen14(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 2', 'Проверка 2')} eyebrow={t('Tekshiruv · 2 / 4 — qaysi satr xato?', 'Проверка · 2 / 4 — какая строка с ошибкой?')}
    title={t("Bu Entity'da bitta satr boshqa qatlamniki", 'В этой Entity одна строка из другого слоя')}
    task={t("Qoida: Entity jadval shaklini belgilaydi — har ustun <code>@Column</code> bilan. Tekshirish qoidalari (<code>@IsString</code>, <code>@IsNumber</code>…) DTO'da turadi. Bu Entity'da bitta satr DTO'niki. <b>O'sha satrni bosing.</b>", "Правило: Entity задаёт форму таблицы — каждая колонка с <code>@Column</code>. Правила проверки (<code>@IsString</code>, <code>@IsNumber</code>…) живут в DTO. В этой Entity одна строка из DTO. <b>Нажмите на эту строку.</b>")}
    q={t("Besh qatlamni ko'rdingiz, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Entity'da har ustun Column bilan, tekshirish qoidalari esa DTO'da. Ekrandagi Entity'da bitta satr DTO'niki. O'sha satrni bosing.", 'Вы видели пять слоёв, теперь проверьте сами. Вторая проверка. Вспомните правило: в Entity каждая колонка с Column, а правила проверки в DTO. В Entity на экране одна строка из DTO. Нажмите на эту строку.')}
    file={F.cEnt} lines={LC2_LINES} target={12}
    tree={{ root: MKCFG.root, files: tree(BASE, CAR_ALL), active: F.cEnt }}
    fixed={LC2_FIXED}
    fixedExtra={[{ file: t('psql · \\d cars — haqiqiy natija', 'psql · \\d cars — реальный результат'), lines: plainLines(t(String.raw`
buzuq holatda:   brand · model · is_available   ← price ustuni YO'Q (synchronize o'chirdi)
POST /api/v1/car {…,"price":250} → 201, javobda va bazada price yo'q
tuzatilgach:     price | integer | not null`, String.raw`
сломано:         brand · model · is_available   ← колонки price НЕТ (synchronize удалил)
POST /api/v1/car {…,"price":250} → 201, в ответе и в базе price нет
исправлено:      price | integer | not null`)) }]}
    ok={t("To'g'ri. O'n uchinchi satr IsNumber, bu tekshirish qoidasi, u DTO'ga tegishli. Bu xato jim ishlaydi, sinab ko'rdik: server xatosiz ishga tushadi, lekin synchronize price ustunini bazadan o'chiradi. POST ikki yuz bir qaytaradi, narx esa hech qayerda saqlanmaydi. Ekranda tuzatilgan holat: Entity'da Column.", 'Верно. Тринадцатая строка IsNumber, это правило проверки, оно относится к DTO. Эта ошибка тихая, мы проверили: сервер запускается без ошибок, но synchronize удаляет колонку price из базы. POST возвращает 201, а цена нигде не сохраняется. На экране исправленный вариант: в Entity Column.')}
    okShort={t("13-satr: @IsNumber — DTO qoidasi. Sinalgan: server ishga tushadi, price ustuni bazadan o'chadi, POST 201, narx yo'q. Tuzatildi: @Column().", 'Строка 13: @IsNumber — правило DTO. Проверено: сервер запускается, колонка price удаляется из базы, POST 201, цены нет. Исправлено: @Column().')}
    hint={t("Bu satr Entity'ning o'z ishi: import, jadval nomi yoki ustun. Ustun yaratmaydigan, qiymatni tekshiradigan decorator'ni qidiring.", 'Эта строка — работа самой Entity: import, имя таблицы или колонка. Ищите decorator, который не создаёт колонку, а проверяет значение.')} />;
}

// ============================================================
//  15 · Amaliyot 2 — car resursini qo'shing
// ============================================================
const P2 = {
  kicker: 'Amaliyot 2 / 4', eyebrow: "Hozir o'zingizda · 20 daqiqa", title: "car resursini o'z loyihangizga qo'shing", tableAt: 3,
  segments: [
    sg('a', "Endi siz <b>car resursini qo'shasiz</b> — o'quvchining «Ochilish kuni», sinfdan oldin", "Endi navbat sizga: car resursini o'z loyihangizga qo'shasiz. Bu o'quvchi darsining Ochilish kuni, siz uni sinfdan oldin bir marta o'zingiz qilib ko'rasiz. Yigirma daqiqacha. Har qadamda Kodni ochish tugmasi bor: bu namuna, kodni o'zingiz yozing.", { hl: [] }),
    sg('b', "1–3-qadam: Entity va <code>core/index.ts</code>, ikki DTO, Service", "Birinchi: Entity va core index'ga export. Ikkinchi: ikki DTO. Uchinchi: Service, super'ni unutmang.", { hl: [0, 1, 2] }),
    sg('c', "4–5-qadam: Controller, Module va AppModule — terminalda <b>beshta Mapped</b>", "To'rtinchi: Controller, beshta route. Beshinchi: Module va bosh modulga ulash. Terminalda beshta Mapped satrini ko'rsangiz, resurs tirik.", { hl: [3, 4] }),
    sg('d', "6-qadam: Swagger'da POST → <b>201</b>; isbot — javobdagi <code>id</code>ning birinchi 8 belgisi", "Oltinchi: Swagger'da bitta mashina qo'shing, ikki yuz bir. Javobdagi id'ning birinchi sakkiz belgisini isbot maydoniga yozing. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. Katakchalar va isbot bo'lmasa, Davom ochilmaydi.", { hl: [5] }),
  ],
};
const P2_STEPS = [
  { t: 'Entity', cmds: [], exp: "src/core/entity/car.entity.ts + src/core/index.ts (export * from './entity/car.entity';)" },
  { t: 'DTO', cmds: [], exp: 'src/api/car/dto/create-car.dto.ts · update-car.dto.ts' },
  { t: 'Service', cmds: [], exp: 'src/api/car/car.service.ts — extends BaseService, super(carRepo)' },
  { t: 'Controller', cmds: [], exp: "src/api/car/car.controller.ts — @Controller('car'), 5 route" },
  { t: 'Module', cmds: [], exp: 'src/api/car/car.module.ts + app.module.ts → imports: [..., CarModule] · terminal: CarController {/api/v1/car} + 5 ta Mapped' },
  { t: 'Swagger', cmds: ['{"brand":"Chevrolet","model":"Malibu","price":250}'], exp: 'POST /api/v1/car → 201 · data.id uuid' },
];
const P2_TROUBLE = [
  ["error TS2305: Module '\"src/core\"' has no exported member 'CarEntity'.", "core/index.ts'ga export yozilmagan (8-ekran)"],
  ["error TS2377: Constructors for derived classes must contain a 'super' call.", "super(carRepo) yo'q (11-ekran)"],
  ["error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?", 'metod nomi findOneById (12-ekran)'],
  ["Nest can't resolve dependencies of the CarService (?) … \"CarEntityRepository\"", "car.module.ts'da forFeature yo'q (20-ekranda batafsil)"],
  ['Server ishladi, car uchun Mapped yo\'q, /api/v1/car → 404 Cannot GET /api/v1/car', "AppModule imports'ida CarModule yo'q"],
  ['400 price must be a number…', 'JSON\'da raqam qo\'shtirnoq ichida'],
];
const P2_PROOF = { label: "Isbot: javobdagi data.id'ning birinchi 8 belgisi", placeholder: "id'ning boshidan 8 belgi, defisgacha", check: (v) => /^[0-9a-f]{8}$/i.test(v) && v.toLowerCase() !== 'efa80745', wrong: "8 ta belgi (0–9, a–f), defisgacha — o'z javobingizdagi id'dan (ekrandagi namuna emas)" };
// Explorer tartibida (VS Code: avval papkalar) — Practice fayllarni shu tartibda ko'rsatadi; step — qaysi qadamning «Kodni ochish» tugmasi
const P2_CODE = [
  { step: 1, file: F.cCdto, lines: CDTO_LINES, copy: false },
  { step: 1, file: F.cUdto, lines: UDTO_LINES, copy: false },
  { step: 3, file: F.cCtrl, lines: CCTRL_LINES, copy: false },
  { step: 4, file: F.cMod, lines: CMOD_LINES, copy: false },
  { step: 2, file: F.cSvc, lines: CSVC_LINES, copy: false },
  { step: 0, file: F.cEnt, lines: CAR_ENT_LINES, copy: false },
];
// F-1031-04: «Kodni ochish» oynasida o'quvchi loyihasining to'liq ko'rinishi (VS Code tartibi: avval papkalar, keyin fayllar);
// faqat car fayllari bosiladi, qolgani xira, yopiq papkalar ochilmaydi.
const P2_TREE = ['dist/', 'node_modules/', 'src/api/admin/', 'src/api/auth/', F.cCdto, F.cUdto, F.cCtrl, F.cMod, F.cSvc, F.appMod, F.appSvc,
  'src/common/', 'src/config/', F.aEnt, F.baseEnt, F.cEnt, 'src/core/repository/', F.coreIdx, 'src/infrastructure/', F.main, 'test/', F.env, F.envEx, 'package.json'];
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={P2_CODE} tree={P2_TREE} />; }

// ============================================================
//  4-BOSQICH · Guard va token (16–19)
// ============================================================
const AUTHG_LINES = ts(String.raw`
canActivate(ctx: ExecutionContext): boolean {
  //  Agar route @Roles('public') bo'lsa — token talab qilinmaydi
  const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
  if (roles?.includes('public')) return true;

  const req = ctx.switchToHttp().getRequest();
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.Token.access_token_key);
    req.user = payload;
    return true;
  } catch {
    throw new UnauthorizedException();
  }
}`, { 2: { id: 'pub' }, 3: { id: 'pub' }, 4: { id: 'pub' }, 6: { id: 'hdr' }, 7: { id: 'hdr' }, 8: { id: 'hdr' }, 10: { id: 'jwt' }, 12: { id: 'jwt' }, 13: { id: 'jwt' }, 16: { id: 'jwt' } });
// So'rov yo'li sxemasi (Explorer'siz — M19 istisno): nuqta Guard'da to'xtaydi
function GuardFlow({ stop, label }) {
  const box = (k, c, h, d) => <div className={`mk-box${stop === k ? ' hl' : ''}`} style={{ '--c': c }}><h4>{h}</h4><p>{d}</p></div>;
  // flex: 0 0 auto — tor ekranda (1280×720) panel siqilmaydi, qatori kesilmaydi; VS Code oynasi o'zi ichida aylanadi
  return <div className="mk-light" style={{ padding: 16, flex: '0 0 auto', maxHeight: 'none' }}>
    <div className="mk-tag">{t("So'rov yo'li — Controller'dan oldin ikki qo'riqchi", 'Путь запроса — два охранника перед Controller')}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr 28px 1fr 28px 1fr', alignItems: 'stretch' }}>
      {box('br', T.ink2, t('Brauzer', 'Браузер'), 'GET /api/v1/admin')}<div className="mk-arrow on">→</div>
      {box('auth', N2.guard, 'AuthGuard', t('token bormi?', 'есть токен?'))}<div className={`mk-arrow${stop === 'auth' ? '' : ' on'}`}>→</div>
      {box('roles', N2.guard, 'RolesGuard', t('rol ro\'yxatdami?', 'роль в списке?'))}<div className={`mk-arrow${stop ? '' : ' on'}`}>→</div>
      {box('ctrl', PART.ctrl, 'Controller', t('ishlaydi', 'работает'))}
    </div>
    {label && <div className="mk-rule" style={{ marginTop: 12 }}>{label}</div>}
  </div>;
}
const S16 = {
  kicker: '4-bosqich · Guard', title: "AuthGuard: token bormi — yo'q bo'lsa 401",
  segments: [
    sg('a', "Car route'lari ochiq edi; admin route'lari <b>himoyalangan</b> — Controller'dan oldin <b>Guard</b> turadi", "Car route'larimiz tokensiz ochiq. Admin route'lari esa himoyalangan: tokensiz to'rt yuz bir. Buni Controller emas, undan oldin turgan Guard qiladi, qo'riqchi. Admin Controller ustida ikkita Guard ulangan: Auth guard va Roles guard. Birinchisidan boshlaymiz.", { focus: [], stop: 'auth' }),
    sg('b', "Nega <code>'public'</code>? Token <b>signin'da beriladi</b> — signin ham token so'rasa, hech kim kira olmasdi", "Auth guard avval route'dagi Roles belgisiga qaraydi: public bo'lsa, tekshirmasdan o'tkazadi. Nega signin'ga public qo'yilgan? Token aynan signin'da beriladi, kirishdan oldin hech kimda token yo'q. Signin ham token so'rasa, hech kim kira olmasdi. Shuning uchun bu to'g'ri qaror, xavfsizlik teshigi emas: kirish eshigi ochiq, qolgan eshiklar yopiq.", { focus: ['pub'], pub: true }),
    sg('c', "Aks holda <code>Authorization: Bearer</code> va yaroqli token kerak — bo'lmasa <b>401</b>", "Qolgan route'larda so'rovda Authorization header'i bo'lishi kerak: Bearer so'zi va token. Header yo'q, token soxta yoki muddati o'tgan bo'lsa, to'rt yuz bir, Unauthorized. Token yaroqli bo'lsa, ichidagi id va rol so'rovga yoziladi, keyingi Guard shuni o'qiydi.", { focus: ['hdr', 'jwt'] }),
    sg('d', "Token signin'da beriladi va <b>24 soat</b> yashaydi; eskirsa — <b>qayta signin</b>", "Token signin'da beriladi va env'dagi sozlamaga ko'ra yigirma to'rt soat yashaydi. Muddati o'tsa nima qilinadi? Sinab ko'rdik: loyihadagi token yangilash route'i ham yaroqli token so'raydi, eskirgan token bilan to'rt yuz bir beradi. Demak yagona yo'l: qayta signin.", { focus: [], expiry: true }),
    sg('e', "Xulosa: 401 — <b>«kim ekaningiz noma'lum»</b>: signin qiling va tokenni Authorize'ga qo'ying", "Xulosa: to'rt yuz bir, kim ekaningiz noma'lum degani. Yechim kodda emas: signin qiling va tokenni Swagger'dagi Authorize oynasiga qo'ying. Endi ikkinchi qo'riqchi: token bor, lekin bu eshik sizga ochiqmi?", { focus: [] }),
  ],
};
const EXPIRY = plainLines(String.raw`
# Access_Token_Time=5s bilan sinov (haqiqiy)
POST /api/v1/admin/signin            → 201 · data.token = eyJ…
GET  /api/v1/admin/all/admin  (token) → 200
… 6 soniya …
GET  /api/v1/admin/all/admin  (token) → 401 Unauthorized
POST /api/v1/admin/token  (cookie + eskirgan token) → 401
POST /api/v1/admin/token  (cookie + yangi signin tokeni) → 201`, { 5: { id: 'x' }, 6: { id: 'x' } });
// F-1031-06: signin nega 'public' — haqiqiy repo, admin.controller.ts 46–53
const SIGNIN_PUB = ts(String.raw`
@Roles('public')
@Post('signin')
signin(
  @Body() signInDto: SignInDto,
  @Res({ passthrough: true }) res: Response,
) {
  return this.adminService.signIn(signInDto, res);
}`, { 1: { id: 'p' } });
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg, beat }) => <>
    <GuardFlow stop="auth" label={beat >= 4 ? <><b>401</b> = {t('AuthGuard: token yo\'q yoki yaroqsiz → signin → Authorize', 'AuthGuard: токена нет или он недействителен → signin → Authorize')}</> : null} />
    <Ide files={tree(BASE, [F.aCtrl, F.authG, F.rolesG])} active={F.authG}>
      <CodePanel file={F.authG} lines={AUTHG_LINES} focus={seg.focus} />
      {beat === 0 && <CodePanel file={F.aCtrl + ' · 31–33'} lines={ts(String.raw`
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {`)} />}
      {seg.pub && <CodePanel file={F.aCtrl + ' · 46–53'} lines={SIGNIN_PUB} focus={['p']} />}
      {seg.pub && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>{t(<><b>'public'</b> — to'g'ri qaror: tokenni shu eshikdan olasiz. Qolgan eshiklar yopiq.</>, <><b>'public'</b> — правильное решение: токен вы получаете через эту дверь. Остальные двери закрыты.</>)}</div>}
      {seg.expiry && <Term lines={EXPIRY} focus={['x']} />}
    </Ide>
  </>} />;
}

// ============================================================
//  17 · RolesGuard: 403, superadmin va admin — har xil rol
// ============================================================
const ROLESG_LINES = ts(String.raw`
// roles-decorator.ts
export const Roles = (...roles: (UserRole | string)[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
if (!roles || roles.includes('public') || roles.length === 0) {
  return true;
}
if (
  (req.user?.role && roles.includes(req.user.role)) ||
  (roles.includes('ID') && req.user?.id === req.params.id)
) {
  return true;
}
return false;`, { 2: { id: 'dec' }, 5: { id: 'p1' }, 6: { id: 'p1' }, 9: { id: 'p2' }, 10: { id: 'p3' }, 12: { id: 'p2' }, 14: { id: 'no' } });
const ROLE_ROWS = [
  ["@Roles('admin') POST", '401', '403 Forbidden resource', '201', 'r1'],
  ["@Roles('public') GET", '200', '200', '200', 'r2'],
  ['@Roles yozilmagan PATCH', '401', '200', '200', 'r3'],
  ['@Roles(UserRole.ADMIN) DELETE', '—', '403', '200', 'r4'],
];
const S17 = {
  kicker: '4-bosqich · Guard', title: "RolesGuard: token bor, lekin bu eshik sizga ochiqmi — yo'q bo'lsa 403",
  segments: [
    sg('a', "<code>@Roles(...)</code> — route ustidagi <b>rollar ro'yxati</b>; Guard uni tokendagi rol bilan solishtiradi", "Ikkinchi qo'riqchi Roles guard. Har route ustida Roles decorator'i bilan rollar ro'yxati yoziladi. Guard shu ro'yxatni tokendagi rol bilan solishtiradi. Rol signin'da bazadan olinadi, mijoz uni o'zi o'zgartira olmaydi.", { focus: ['dec'], row: null }),
    sg('b', "O'tadi: ro'yxat yo'q yoki <code>'public'</code> · rol ro'yxatda · <code>'ID'</code> va o'z yozuvi; <b>qolgani 403</b>", "Guard uch holatda o'tkazadi: ro'yxat yo'q yoki public bo'lsa; tokendagi rol ro'yxatda bo'lsa; ro'yxatda ID so'zi bo'lsa va foydalanuvchi o'z yozuvini so'rasa. Qolgan hamma holat to'rt yuz uch, Forbidden resource.", { focus: ['p1', 'p2', 'p3', 'no'], row: null }),
    sg('c', "Muhim: <b><code>superAdmin</code> va <code>admin</code> — har xil rol</b>: <code>@Roles('admin')</code> eshigiga superadmin ham <b>403</b> oladi", "Endi eng muhim gap, sinfda albatta chiqadi. Loyihada ikki rol bor, superadmin va admin, ular har xil so'z. Ro'yxatda faqat admin yozilgan eshikka superadmin kirsa ham to'rt yuz uch oladi. Sinab ko'rdik: superadmin tokeni bilan to'rt yuz uch, oddiy admin tokeni bilan ikki yuz bir.", { focus: ['p2'], row: 'r1' }),
    sg('d', "<code>@Roles</code> yozilmagan eshik — <b>«tizimga kirganlar uchun»</b>: token kerak, rol tekshirilmaydi", "Va yana bir holat: Roles umuman yozilmagan eshik. Auth guard token so'raydi, tokensiz to'rt yuz bir. Roles guard'da ro'yxat yo'q, u o'tkazadi. Demak bu eshik tizimga kirgan har kim uchun ochiq.", { focus: ['p1'], row: 'r3' }),
    sg('e', "Xulosa: 401 — token yo'q; 403 — <b>rol ro'yxatda yo'q</b>: ro'yxat va kirgan rolni yonma-yon qo'ying", "Xulosa: to'rt yuz bir, token yo'q yoki yaroqsiz; to'rt yuz uch, token bor, lekin rol ro'yxatda yo'q. O'quvchi to'rt yuz uch desa, ikki narsani yonma-yon qo'ying: route ustidagi Roles ro'yxati va u qaysi rol bilan kirgani.", { focus: [], row: 'all' }),
  ],
};
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg, beat }) => <>
    <Ide files={tree(BASE, [F.aCtrl, F.authG, F.rolesG, F.rolesD])} active={F.rolesG}>
      <CodePanel file="roles-decorator.ts · roles.guard.ts" lines={ROLESG_LINES} focus={seg.focus} />
    </Ide>
    <Block at={2} beat={beat}><div className="mk-light" style={{ padding: 12 }}>
      <div className="mk-tag">{t('Haqiqiy javoblar — KitobShop playbook qoidalari bilan sinov', 'Реальные ответы — проверка с правилами playbook KitobShop')}</div>
      <table className="mk-tbl n2-table"><thead><tr><th>{t('eshik', 'дверь')}</th><th>{t('tokensiz', 'без токена')}</th><th>superadmin (superAdmin)</th><th>{t('oddiy admin (admin)', 'обычный админ (admin)')}</th></tr></thead><tbody>
        {ROLE_ROWS.map((r) => <tr key={r[4]} className={seg.row === r[4] || seg.row === 'all' ? 'hl' : ''}><td><code>{r[0]}</code></td><td>{r[1]}</td><td><b style={{ color: /403/.test(r[2]) ? T.accent : T.ink }}>{r[2]}</b></td><td>{r[3]}</td></tr>)}
      </tbody></table>
    </div></Block>
    <Block at={4} beat={beat}><div className="mk-rule"><b>401</b> = AuthGuard ({t('token', 'токен')}) · <b>403</b> = RolesGuard ({t('rol', 'роль')}) · <code>'public'</code> = {t('hamma', 'все')} · <code>@Roles</code> {t("yo'q = tizimga kirganlar", 'нет = вошедшие в систему')} · <code>'ID'</code> = {t("o'z yozuvi", 'своя запись')} · <b>{t('superAdmin va admin — har xil rol', 'superAdmin и admin — разные роли')}</b></div></Block>
  </>} />;
}

// ============================================================
//  18 · Tekshiruv 3 — superadmin bilan 403
// ============================================================
function Screen18(p) {
  const above = <div style={{ marginBottom: 12 }}><Ide files={tree(BASE, [F.bCtrl, F.bMod, F.bSvc])} active={F.bCtrl}>
    <CodePanel file={F.bCtrl} lines={ts(String.raw`
@UseGuards(AuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateBookDto) { … }`, { 4: { id: 'r' } })} focus={['r']} />
    <Json st={403}>{t(`superadmin tokeni bilan POST /api/v1/book  →  {"statusCode":403,"error":{"message":"Forbidden resource"}}`, `с токеном superadmin POST /api/v1/book  →  {"statusCode":403,"error":{"message":"Forbidden resource"}}`)}</Json>
  </Ide></div>;
  const after = <Json st={201}>{t(`ali (role: admin) tokeni bilan POST /api/v1/book  →  {"statusCode":201,"message":"success","data":{…"title":"Test kitob"…}}`, `с токеном ali (role: admin) POST /api/v1/book  →  {"statusCode":201,"message":"success","data":{…"title":"Test kitob"…}}`)}</Json>;
  return <MCRetry {...p} kicker={t('Tekshiruv 3', 'Проверка 3')} eyebrow={t('Tekshiruv · 3 / 4', 'Проверка · 3 / 4')} above={above} after={after}
    title={t("O'quvchi: «KitobShop'da superadmin tokeni bilan kitob qo'shdim — 403». Sabab?", 'Ученик: «В KitobShop добавил книгу с токеном суперадмина — 403». Причина?')}
    q={t("Ikkala qo'riqchini bilasiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi KitobShop'da superadmin tokeni bilan kitob qo'shmoqchi, javob to'rt yuz uch. Ekranda route kodi va javob. Sabab nima? Variantni tanlang.", 'Вы знаете обоих охранников, давайте проверим. Третья проверка. Ученик в KitobShop хочет добавить книгу с токеном superadmin, ответ 403. На экране код route и ответ. В чём причина? Выберите вариант.')}
    opts={t(["Token muddati o'tgan, qayta signin kerak", "Authorize bosilmagan, so'rovda token yo'q", "Ro'yxatda faqat admin, superadminning roli boshqa", "BookModule AppModule'ga ulanmagan"], ['Срок токена истёк, нужен новый signin', 'Authorize не нажата, в запросе нет токена', 'В списке только admin, у superadmin другая роль', 'BookModule не подключён к AppModule'])} correct={2}
    ok={t("Ro'yxatda faqat admin, superadminning roli esa superAdmin, boshqa so'z. Token yaroqli, shuning uchun to'rt yuz bir emas, to'rt yuz uch. Yechim: superadmin bilan oddiy admin yaratib, KitobShop'ni o'sha admin bilan sinash. Ekranda natija: oddiy admin tokeni bilan ikki yuz bir.", 'В списке только admin, а роль superadmin — superAdmin, это другое слово. Токен действующий, поэтому не 401, а 403. Решение: создать через superadmin обычного админа и проверять KitobShop под ним. На экране результат: с токеном обычного админа 201.')}
    okShort={t('superAdmin va admin — har xil rol. Token yaroqli → 403 (401 emas). Oddiy admin bilan → 201.', 'superAdmin и admin — разные роли. Токен действующий → 403 (не 401). С обычным админом → 201.')}
    wrong={t({ 0: "Token eskirgan bo'lsa Auth guard 401 berardi, 403 emas.", 1: "Token yo'q bo'lsa ham 401. 403 — token bor, rol ro'yxatda yo'q.", 3: "Modul ulanmagan bo'lsa route topilmaydi: 404." }, { 0: 'Если бы токен истёк, Auth guard дал бы 401, а не 403.', 1: 'Без токена тоже 401. 403 — токен есть, роли нет в списке.', 3: 'Если модуль не подключён, route не найден: 404.' })} />;
}

// ============================================================
//  19 · Amaliyot 3 — signin, Authorize, oddiy admin
// ============================================================
const P3 = {
  kicker: 'Amaliyot 3 / 4', eyebrow: "Hozir o'zingizda · 10 daqiqa", title: "Superadmin bilan kiring, oddiy admin yarating va farqni ko'ring", tableAt: 3,
  segments: [
    sg('a', "Endi siz: <b>signin, Authorize va oddiy admin</b> — KitobShop darsidan oldingi tayyorgarlik", "Endi navbat sizga. Bu amaliyot KitobShop darsidan oldin har o'quvchi qiladigan tayyorgarlik: superadmin bilan kirish, oddiy admin yaratish va farqni ko'rish. To'rt qadam, o'n daqiqacha.", { hl: [] }),
    sg('b', "1–2-qadam: superadmin bilan <b>signin</b> qiling, tokenni <b>Authorize</b>'ga qo'ying — adminlar ro'yxati 200 bilan ochiladi", "Birinchi: Swagger'da signin, env'dagi superadmin nomi va paroli bilan. Javobdagi tokenni qo'shtirnoqsiz nusxalang. Ikkinchi: tokenni Authorize oynasiga qo'ying va adminlar ro'yxatini so'rang: ikki yuz.", { hl: [0, 1] }),
    sg('c', "3-qadam: <code>POST admin</code> bilan <b>oddiy admin</b> yarating; isbot — uning <code>id</code>sidan 8 belgi", "Uchinchi: POST admin bilan oddiy admin yarating, paroli kuchli bo'lsin. Javob ikki yuz bir, yangi adminning roli admin. Uning id'sidan birinchi sakkiz belgini isbot maydoniga yozing.", { hl: [2] }),
    sg('d', "4-qadam: yangi admin bilan kiring va <code>POST admin</code> qiling — <b>403</b> chiqishi kerak", "To'rtinchi: Authorize'dan chiqing, yangi admin bilan kiring va yana POST admin qiling: to'rt yuz uch, chunki admin yaratish faqat superadmin uchun. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. Katakchalar va isbot bo'lmasa, Davom ochilmaydi.", { hl: [3] }),
  ],
};
const P3_STEPS = [
  { t: 'Signin', cmds: ['{"username":"superadmin","password":"Superadmin1!"}'], exp: 'POST /api/v1/admin/signin → HTTP 201 · body {"statusCode":200,"message":"success","data":{"token":"eyJ…"}}' },
  { t: 'Authorize', cmds: [], exp: "token → «Authorize» → GET /api/v1/admin/all/admin → 200 · data[0].role = superAdmin" },
  { t: 'Oddiy admin', cmds: ['{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"Developer1!"}'], exp: 'POST /api/v1/admin → 201 · "role":"admin"' },
  { t: 'Farq', cmds: ['{"username":"ali","password":"Developer1!"}'], exp: 'Logout → ali bilan signin → Authorize → POST /api/v1/admin → 403 {"statusCode":403,"error":{"message":"Forbidden resource"}}' },
];
const P3_TROUBLE = [
  ['signin → 400 password is not strong enough', ".env'dagi PASSWORD'ni aynan yozing — yozilgan parol kuchsiz"],
  ['signin → 401 Admin not fount', "username .env'dagi bilan bir xil emas (imlo repodan); yoki superadmin bo'sh yaratilgan — 6-ekrandagi yechim"],
  ['signin → 400 username or password incorect', "parol kuchli, lekin noto'g'ri (imlo repodan)"],
  ['401 Unauthorized', "Authorize bosilmagan yoki token qo'shtirnoq bilan qo'yilgan"],
  ['POST admin → 400 Phone Number already exists / Username already exists', 'shu telefon yoki nom band — boshqasini yozing'],
];
const P3_PROOF = { label: "Isbot: yangi admin id'sining birinchi 8 belgisi", placeholder: "id'ning boshidan 8 belgi", check: (v) => /^[0-9a-f]{8}$/i.test(v) && v.toLowerCase() !== 'd4264287', wrong: "8 ta belgi (0–9, a–f), defisgacha — POST admin javobidagi data.id'dan" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  5-BOSQICH · Buzamiz (20–23)
// ============================================================
const FF_BROKEN = ts(String.raw`
@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  imports: [],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}`, { 2: { gone: true }, 3: { neu: true } });
const FF_FIXED = ts(String.raw`
@Module({
  imports: [],
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}`, { 2: { gone: true }, 3: { neu: true } });
const FF_ERR = term(String.raw`
[Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the CarService (?).
Please make sure that the argument "CarEntityRepository" at index [0] is available in the CarModule module.

Potential solutions:
- Is CarModule a valid NestJS module?
- If "CarEntityRepository" is a provider, is it part of the current CarModule?
- If "CarEntityRepository" is exported from a separate @Module, is that module imported within CarModule?`, { 1: { id: 'who' }, 2: { id: 'what' }, 4: { id: 'sol' }, 5: { id: 'sol' }, 6: { id: 'sol' }, 7: { id: 'sol' } });
const S20 = {
  kicker: '5-bosqich · buzamiz 1', title: "forFeature o'chirildi — xabarni uch savol bilan o'qiymiz",
  segments: [
    sg('a', "Ataylab buzamiz: <code>car.module.ts</code>dan <b><code>forFeature</code> olib tashlandi</b> — server yiqildi", "Resurs ishlaydi, himoyani bilasiz. Endi ataylab buzamiz, chunki o'quvchi va uning agenti aynan shu xatolarni qiladi. Car module'dan forFeature satrini olib tashladik. Server yiqildi, xabarni Nest birinchi darsidagi uch savol bilan o'qiymiz.", { focus: [] }),
    sg('b', "Qaysi klass — <b><code>CarService (?)</code></b>: bu safar Service'ning dependency'si topilmadi", "Qaysi klass: Car service. Nest birinchi darsida bu yerda Controller edi, bu safar Service. Qavsdagi so'roq belgisi topilmagan dependency o'rni.", { focus: ['who'] }),
    sg('c', "Qaysi dependency — <b><code>CarEntityRepository</code></b>; qaysi fayl — <b><code>CarModule</code></b>, ya'ni <code>car.module.ts</code>", "Qaysi dependency: Car entity Repository, konstruktordagi birinchi parametr. Qaysi fayl: Car module, ya'ni car module ts. Repository so'zini ko'rdingizmi, demak javob providers'da emas, imports'da: Repository'ni forFeature beradi.", { focus: ['what', 'sol'] }),
    sg('d', "Tuzatamiz: <code>forFeature</code> qaytdi — <b>beshta Mapped</b> va successfully started", "Tuzatamiz: forFeature satrini qaytaramiz va saqlaymiz. Terminal: Car module tayyor, Car controller, beshta Mapped va successfully started.", { focus: [], fixed: true }),
    sg('e', "Xulosa: xabarda <b><code>…Repository</code></b> bo'lsa — modul faylining <code>imports</code>ida <code>forFeature</code> bormi", "Xulosa: can't resolve dependencies xabarida Repository so'zi bo'lsa, modul faylini oching va imports'da shu Entity bilan forFeature bor-yo'qligini tekshiring. Formula o'zgarmaydi: qaysi klass, qaysi dependency, qaysi fayl.", { focus: [], fixed: true }),
  ],
};
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg, beat }) => <Ide files={tree(BASE, CAR_ALL)} active={F.cMod}>
    <CodePanel key={seg.fixed ? 'f' : 'b'} file={F.cMod} lines={seg.fixed ? FF_FIXED : FF_BROKEN} />
    {seg.fixed ? <Term title={t('terminal — tuzatildi', 'terminal — исправлено')} lines={CAR_START} /> : <Term er title={t('terminal — server yiqildi', 'terminal — сервер упал')} lines={FF_ERR} focus={seg.focus} />}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<>Xabarda <code>…Service (?)</code> va <code>…EntityRepository</code> bo'lsa — o'sha resursning <code>module.ts</code> faylida <code>imports: [TypeOrmModule.forFeature([…Entity])]</code> bormi, tekshiring.</>, <>Если в сообщении <code>…Service (?)</code> и <code>…EntityRepository</code> — проверьте, есть ли в <code>module.ts</code> этого ресурса <code>imports: [TypeOrmModule.forFeature([…Entity])]</code>.</>)}</div></Block>
  </Ide>} />;
}

// ============================================================
//  21 · Buzamiz 2: Entity o'zgardi — baza o'zgardi
// ============================================================
const S21 = {
  kicker: '5-bosqich · buzamiz 2', title: "Entity o'zgarsa, baza o'zi o'zgaradi — jim yoki yiqilib",
  segments: [
    sg('a', "<code>synchronize</code> har ishga tushishda bazani <b>Entity'ga moslaydi</b> — qulay ham, xavfli ham", "Ikkinchi holat bazada ko'rinadi. Dev rejimida synchronize yoqilgan: server har ishga tushganda bazani Entity'ga moslaydi. Jadval o'zi yaratilgani qulay edi. Lekin Entity o'zgarsa, baza ham so'ramasdan o'zgaradi.", { v: 'sync' }),
    sg('b', "Ustundan <code>@Column</code> olib tashlansa — ustun bazadan <b>o'chadi</b>: server xatosiz, narx yo'q", "Ikkinchi tekshiruvdagi holatni haqiqatda yurgizdik: price'dan Column olib tashlandi. Server xatosiz ishga tushdi, synchronize price ustunini bazadan o'chirdi. POST ikki yuz bir qaytaradi, lekin narx na javobda, na bazada. Hech qanday xabar chiqmaydi.", { v: 'drop' }),
    sg('c', "Bor jadvalga majburiy ustun qo'shilsa — server <b>yiqiladi</b>: <code>contains null values</code>", "Teskari holat: jadvalda mashinalar bor, Entity'ga esa majburiy yangi ustun qo'shildi, masalan brand'ga bog'lash uchun brandId. Server ishga tushmaydi: column brandId contains null values. Eski satrlarda bu ustun bo'sh, majburiy ustun esa bo'sh bo'la olmaydi.", { v: 'add' }),
    sg('d', "Yechim: yangi ustun <b><code>nullable: true</code></b> — server ishga tushadi, eski ma'lumot joyida", "Yechim: yangi ustunni ixtiyoriy qilish, nullable true. Sinab ko'rdik: shunday qilinsa server ishga tushdi, ustun va tashqi kalit yaratildi, eski mashinalar joyida qoldi.", { v: 'fix' }),
    sg('e', "Xulosa: Entity'ni o'zgartirish — <b>bazani o'zgartirish</b>; «ma'lumot yo'qoldi» desa — Entity'ni so'rang", "Xulosa: Entity'ni o'zgartirish bazani o'zgartirish demak. Ustun olib tashlansa, ma'lumot jim o'chadi; majburiy ustun qo'shilsa, server yiqiladi. O'quvchi ma'lumotlarim yo'qoldi yoki contains null values desa, birinchi savol: Entity'da nimani o'zgartirdingiz?", { v: 'sum' }),
  ],
};
const ENT_DROP = ts(String.raw`
  @Column()
  model: string;

  @IsNumber()        // @Column o'rniga
  price: number;`, { 4: { id: 'x' } });
const ENT_ADD = ts(String.raw`
  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand_rel: BrandEntity;

  @Column()
  brandId: string;`, { 5: { id: 'x' } });
const ENT_FIX = ts(String.raw`
  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand_rel: BrandEntity;

  @Column()
  @Column({ nullable: true })
  brandId: string;`, { 5: { gone: true }, 6: { neu: true } });
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => {
    const v = seg.v;
    return <div style={{ display: 'grid', gap: 10 }}>
      <Ide files={tree(BASE, CAR_ALL)} active={F.cEnt}>
        {v === 'sync' || v === 'sum' ? <CodePanel file={F.cEnt} lines={CAR_ENT_LINES} /> : <CodePanel file={F.cEnt + ' · ' + t("o'zgargan joy", 'изменённое место')} lines={v === 'drop' ? ENT_DROP : v === 'add' ? ENT_ADD : ENT_FIX} focus={v === 'fix' ? [] : ['x']} />}
      </Ide>
      <div style={{ display: 'grid', gap: 10, minWidth: 0 }}>
        {(v === 'sync' || v === 'sum') && <div className="mk-light"><div className="mk-tag">synchronize: true (NODE_ENV=dev)</div><div style={{ fontSize: 14 }}>{t("Har ishga tushishda: Entity → baza. Ustun qo'shilsa — qo'shiladi, olib tashlansa — o'chiriladi.", 'При каждом запуске: Entity → база. Колонку добавили — добавится, убрали — удалится.')}</div></div>}
        {v === 'drop' && <><Term title="psql · \d cars" lines={plainLines(String.raw`
 brand        | character varying | not null
 model        | character varying | not null
                                   ← price ustuni YO'Q`.replace("← price ustuni YO'Q", t("← price ustuni YO'Q", '← колонки price НЕТ')))} /><Json st={201}>{`POST /api/v1/car {"brand":"Chevrolet","model":"Malibu","price":250}\n→ {"statusCode":201,"message":"success","data":{…"brand":"Chevrolet","model":"Malibu","is_available":true}}   ← price yo'q`.replace("← price yo'q", t("← price yo'q", '← price нет'))}</Json></>}
        {v === 'add' && <Term er lines={term(String.raw`QueryFailedError: column "brandId" of relation "cars" contains null values`)} />}
        {v === 'fix' && <Term title="psql · \d cars" lines={term(String.raw`
 brandId      | uuid |   (nullable)
 FOREIGN KEY ("brandId") REFERENCES brands(id) ON DELETE CASCADE
 Nest application successfully started`)} />}
        {v === 'sum' && <div className="mk-rule">{t(<><b>Ma'lumot yo'qoldi</b> yoki <b>contains null values</b> bo'lsa, «Entity'da nimani o'zgartirdingiz?» deb so'rang; yangi ustunga <code>nullable: true</code> qo'ying.</>, <><b>Данные пропали</b> или <b>contains null values</b> — спросите «Что вы изменили в Entity?»; новой колонке поставьте <code>nullable: true</code>.</>)}</div>}
      </div>
    </div>;
  }} />;
}

// ============================================================
//  22 · Tekshiruv 4 — o'quvchi KitobShop'idagi xato
// ============================================================
const BOOK_ERR = term(String.raw`
Nest can't resolve dependencies of the BookService (?).
Please make sure that the argument "BookEntityRepository" at index [0] is available in the BookModule module.`);
const BOOK_START = term(String.raw`
[Nest] LOG [InstanceLoader] BookModule dependencies initialized
[Nest] LOG [RoutesResolver] BookController {/api/v1/book}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/book, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/book, GET} route`);
function Screen22(p) {
  const above = <div style={{ marginBottom: 12, display: 'grid', gap: 6 }}><Term er lines={BOOK_ERR} /><div className="exp" style={{ fontSize: 12.5, color: T.ink3 }}>{t('Xabar shakli haqiqiy (20-ekran), nomlar KitobShop\'ga almashtirilgan.', 'Форма сообщения реальная (экран 20), имена заменены на KitobShop.')}</div></div>;
  const after = <Ide files={tree(BASE, [F.bMod, F.bCtrl, F.bSvc, F.bEnt])} active={F.bMod}>
    <CodePanel file={F.bMod} lines={ts(String.raw`
@Module({
  imports: [],
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  providers: [BookService],
})`, { 2: { gone: true }, 3: { neu: true } })} />
    <Term lines={BOOK_START} />
  </Ide>;
  return <MCRetry {...p} kicker={t('Tekshiruv 4', 'Проверка 4')} eyebrow={t("Tekshiruv · 4 / 4 — xatoni o'qish", 'Проверка · 4 / 4 — чтение ошибки')} above={above} after={after}
    title={t("O'quvchingizning KitobShop'i yiqildi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'KitobShop вашего ученика упал. Какой файл откроете и что исправите?')}
    q={t("Oxirgi tekshiruv, sinfdagi haqiqiy holat. To'rtinchi tekshiruv. O'quvchi agent yozgan kitob resursini ishga tushirdi, server yiqildi, ekranda xabar. U yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'Последняя проверка, реальный случай из класса. Четвёртая проверка. Ученик запустил ресурс книг, написанный агентом, сервер упал, на экране сообщение. Он просит помощи. Какой файл вы откроете и что исправите?')}
    opts={t(["book.module.ts — imports'ga TypeOrmModule.forFeature([BookEntity])", "app.module.ts — providers'ga BookService", "book.service.ts — konstruktordan Repository'ni olib tashlash", "book.entity.ts — @Injectable() qo'shish"], ["book.module.ts — в imports TypeOrmModule.forFeature([BookEntity])", "app.module.ts — в providers BookService", 'book.service.ts — убрать Repository из конструктора', 'book.entity.ts — добавить @Injectable()'])} correct={0}
    ok={t("book module, imports'ga forFeature Book entity bilan. Qaysi klass: Book service. Qaysi dependency: Book entity Repository. Qaysi fayl: Book module. Repository so'zi, demak forFeature. Ekranda tuzatilgan fayl va terminal: Book module tayyor, Book controller va Mapped satrlari.", 'book module, в imports forFeature с Book entity. Какой класс: Book service. Какой dependency: Book entity Repository. Какой файл: Book module. Слово Repository, значит, forFeature. На экране исправленный файл и терминал: Book module готов, Book controller и строки Mapped.')}
    okShort={t('Klass BookService · dependency BookEntityRepository · fayl book.module.ts → forFeature([BookEntity]).', 'Класс BookService · dependency BookEntityRepository · файл book.module.ts → forFeature([BookEntity]).')}
    wrong={t({ 1: "Service bosh modulning providers'iga yozilmaydi; xabar BookModule haqida.", 2: "Repository'siz Service bazaga yoza olmaydi; dependency kerak, uni beradigan satr yetishmayapti.", 3: "@Injectable Entity'ga qo'yilmaydi; xabar Repository topilmaganini aytyapti." }, { 1: 'Service не пишут в providers главного модуля; сообщение про BookModule.', 2: 'Без Repository Service не сможет писать в базу; dependency нужен, не хватает строки, которая его даёт.', 3: '@Injectable на Entity не ставят; сообщение говорит, что не найден Repository.' })} />;
}

// ============================================================
//  23 · Amaliyot 4 — o'zingiz buzing
// ============================================================
const P4 = {
  kicker: 'Amaliyot 4 / 4', eyebrow: "Hozir o'zingizda · 7 daqiqa", title: "O'zingiz buzing, xabarni o'qing, tuzating", tableAt: 2,
  segments: [
    sg('a', "Oxirgi amaliyot: <b>o'zingiz buzasiz</b> — ikki qadam, xabar o'z terminalingizda", "Oxirgi amaliyot: endi o'zingiz buzasiz. Ikki qadam, yetti daqiqacha. Maqsad xabarni o'z terminalingizda ko'rish va o'qish.", { hl: [] }),
    sg('b', "1-qadam: <code>forFeature</code>ni oling, xabardan <b>klass, dependency va faylni</b> isbotga yozing, keyin qaytaring", "Birinchi: car module'dan forFeature satrini olib tashlang va saqlang, server yiqiladi. Xabardan qaysi klass, qaysi dependency, qaysi fayl ekanini toping va vergul bilan isbot maydoniga yozing. Keyin satrni joyiga qaytaring.", { hl: [0] }),
    sg('c', "2-qadam: <code>/api/v1/car/1</code> 500 beradi, sababi terminalda; <b><code>ParseUUIDPipe</code></b> qo'shsangiz — tushunarli 400", "Ikkinchi: Swagger'da car'ni id bir bilan so'rang: besh yuz. Terminalda invalid input syntax for type uuid satrini toping. Keyin Controller'da id parametriga ParseUUIDPipe qo'shing va so'rovni takrorlang: to'rt yuz. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. Katakchalar va isbot bo'lmasa, Davom ochilmaydi.", { hl: [1] }),
  ],
};
const P4_STEPS = [
  { t: "forFeature yo'q", cmds: [], exp: "car.module.ts → imports: [] → saqlang → «can't resolve dependencies of the CarService (?)» … \"CarEntityRepository\" at index [0] … CarModule module → satrni qaytaring → 5 ta Mapped" },
  { t: 'uuid', cmds: ["@Param('id', ParseUUIDPipe) id: string"], exp: 'GET /api/v1/car/1 → 500 + QueryFailedError: invalid input syntax for type uuid: "1" → ParseUUIDPipe → 400 Validation failed (uuid is expected)' },
];
const P4_TROUBLE = [
  ['Qaytardim, baribir xato', 'faylni saqladingizmi? start:dev saqlashda qayta yuklaydi — terminalda yangi satrlarni kuting'],
  ['ParseUUIDPipe topilmadi', "import @nestjs/common'dan"],
  ['/car/1 hali ham 500', "@Param('id', ParseUUIDPipe) — ikkinchi argument findOne'ga yozilganmi"],
  ['Boshqa xato', "uch savol: qaysi klass · qaysi dependency · qaysi fayl; Potential solutions ro'yxati yechimni aytadi"],
];
const P4_PROOF = { label: "Isbot: 1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan)", placeholder: 'klass, dependency, fayl', check: (v) => { const x = v.toLowerCase().replace(/\s/g, ''); return x.includes('carservice') && x.includes('carentityrepository') && (x.includes('car.module') || x.includes('carmodule')); }, wrong: "Xabarni qayta o'qing: «of the ___» — klass, «argument \"___\" at index [0]» — dependency, «in the ___ module» — fayl" };
function ScreenP4(p) { return <Practice p={p} S={P4} steps={P4_STEPS} trouble={P4_TROUBLE} proof={P4_PROOF} />; }

// ============================================================
//  6-BOSQICH · O'quvchi darslariga ko'prik (24–28)
// ============================================================
const MAP03 = [
  { t: 'Kirish va reja', s: '1–3', d: "«Admin tizimi tayyor — avtosalonda mashina yo'q» → alohida resurs; reja — 5 bosqich; mashina shakli — 4 ustun", m: "«Resurs — bir tur ma'lumot, o'z papkasi, o'z 5 bosqichi»; id ustuni yozilmaydi" },
  { t: '5 bosqich, har bosqichdan keyin test', s: '4–15', d: "Har faylda «qaysi qator shu faylga tegishli» (begona qator — boshqa qatlamdan) · Entity → DTO → Service → Controller → Module → «nega /car 404?»", m: "har bosqichdagi qoida: ustun — Entity, qoida — DTO, super(carRepo) — Service, eshik — Controller, ro'yxat — Module" },
  { t: "So'rov yo'li, agent, debugging", s: '16–18', d: "POST /car sayohati · agent 5 faylni yozadi (playbook) · debugging: agent Controller'ga @Column qo'yib yuborgan — topib olib tashlaydi", m: '«Agent aytganingizni yozadi — nazoratchi sizsiz»' },
  { t: 'Ochilish kuni — haqiqiy loyihada', s: '19', d: "VS Code'da IntroNestArxitechture: car resursi 5 bosqich + AppModule, 6 bandli ro'yxat, «Bajardim — ustozni kuting»", m: "eng ko'p vaqt shu yerda: hammaning /api/v1/car 200 bo'lmaguncha o'tmang" },
  { t: 'Podium, kartochkalar, yakun', s: '20–22', d: '12 kartochka: Resurs, Entity, BaseEntity, DTO, 400, PartialType, BaseService, super, @Post, Module, 404, DI', m: 'kartochkalarni birga o\'qing — har biri bugungi bir ekraningiz' },
];
const S24 = {
  kicker: "6-bosqich · ko'prik", eyebrow: "m4a-03 · «Birinchi resursni qo'lda qo'shish — mashinalar»", title: "m4a-03: o'quvchi siz bugun qilgan ishni qiladi",
  segments: [
    sg('a', "m4a-03 — <b>siz bugun qilgan ish</b>: car resursi, besh bosqich, 22 ekran", "Endi darsning asosiy maqsadi: bu mavzuni o'quvchiga o'tish. Ikkita o'quvchi darsi bor. Birinchisi m4a-03: o'quvchi aynan siz bugun qilgan ishni qiladi, car resursini besh bosqichda qo'shadi. Yigirma ikki ekran.", { hl: [] }),
    sg('b', "Har bosqichda o'quvchi <b>shu faylga tegishli qatorni</b> tanlaydi, keyin test, agent va haqiqiy loyiha", "Har bosqichda o'quvchi qatorlarni tanlaydi, qaysi biri shu faylga tegishli, keyin qisqa test. So'ng agent besh faylni yozadi va o'quvchi agent xatosini topadi. Oxirida amaliyot haqiqiy loyihada. Siz har bosqichda qoidani aytasiz: ustun Entity'da, qoida DTO'da, eshik Controller'da.", { hl: [1, 2] }),
    sg('c', "Diqqat: o'quvchi darsida manzil <b><code>/car</code></b> deb yozilgan — haqiqatda <b>404</b>; <code>/api/v1/car</code> deb tuzating", "Diqqat, birinchi xato. O'quvchi darsida manzil hamma joyda prefikssiz, slesh car deb yozilgan, amaliyot ro'yxatida ham: brauzerda slesh car'ni oching, ikki yuz. Haqiqatda bu to'rt yuz to'rt. Darsdan oldin o'quvchilarga ayting: manzil api v bir slesh car.", { hl: [3], warn: true }),
    sg('d', "90 daqiqaning <b>20 tasi haqiqiy loyihaga</b> ketadi — o'quvchilar eng ko'p shu yerda qoqiladi", "Vaqt rejasi, taklif: to'qson daqiqa. Kirish va reja o'n besh, besh bosqich qirq, agent va xato topish o'n, haqiqiy loyiha yigirma, yakun besh. Eng ko'p qoqiladigan joy haqiqiy loyiha: hammaning car route'i ishlamaguncha oldinga o'tmang.", { hl: [], time: true }),
    sg('e', "Xulosa: o'quvchi darsi <b>«5 fayl»</b> deydi — DTO'ni bitta sanaydi; qoqilganga 2-amaliyot jadvali bilan yordam bering", "Xulosa: o'quvchi darsi besh fayl deydi, ikki DTO'ni bitta deb sanaydi, bu xato emas. Haqiqiy loyihada qoqilgan o'quvchiga ikkinchi amaliyotdagi jadvalingiz bilan yordam berasiz: har xabar va uning yechimi o'sha yerda.", { hl: [1, 3] }),
  ],
};
const TIME03 = [['0–15', 'kirish, reja, mashina shakli'], ['15–55', 'besh bosqich + testlar'], ['55–65', "so'rov yo'li, agent, debugging"], ['65–85', 'Ochilish kuni — haqiqiy loyiha', 1], ['85–90', 'podium, kartochkalar, yakun']];
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    {seg.time
      ? <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t('m4a-03 · 90 daqiqa (taklif)', 'm4a-03 · 90 минут (предложение)')}</div>
          <div style={{ display: 'grid', gap: 8 }}>{TIME03.map(([a, b, x]) => <div key={a} className={`mk-step${x ? ' hl' : ''}`}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 64 }}>{a}</span><div className="t">{b}</div></div>)}</div></div>
      : <div style={{ display: 'grid', gap: 8 }}>
          {MAP03.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
            <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{t('ekran', 'экраны')} {b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{seg.hl.includes(i) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{t('Siz: ', 'Вы: ')}{b.m}</div>}</div>
          </div>)}
        </div>}
    {seg.warn && <div className="n2-grid2">
      <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("O'quvchi darsida (amaliyot ro'yxati)", 'В уроке ученика (список практики)')}</h5><div style={{ fontSize: 14 }}>«{t("Brauzerda", 'В браузере')} <code>/car</code> {t("ni oching — 200 javobini ko'ring (404 emas)", 'откройте — увидите ответ 200 (а не 404)')}»</div></div>
      <Json st={404}>{t(`GET localhost:3000/car  →  {"statusCode":404,"error":{"message":"Cannot GET /car"}}\nto'g'risi: localhost:3000/api/v1/car`, `GET localhost:3000/car  →  {"statusCode":404,"error":{"message":"Cannot GET /car"}}\nправильно: localhost:3000/api/v1/car`)}</Json>
    </div>}
  </>} />;
}

// ============================================================
//  25 · O'quvchi tili
// ============================================================
const DICT2 = [
  ['javon chizmasi', 'Entity', 'jadval shakli', 'm4a-03'],
  ['buyurtma anketasi · anketa nusxasi', 'DTO · PartialType', "kiruvchi ma'lumot qoidalari", 'm4a-03'],
  ["nazoratchi to'xtatadi → 400", 'ValidationPipe', 'DTO qoidasi buzildi', 'm4a-03'],
  ["tayyor retsept kitobi · omborni ko'rsatadi", 'BaseService · super(carRepo)', 'tayyor CRUD · qaysi jadval', 'm4a-03'],
  ['omborchi', 'Repository', 'jadval bilan ishlash', 'm4a-01'],
  ['ofitsiant · eshik', 'Controller · route', "so'rovni qabul qiladi", 'm4a-01, m4a-03'],
  ["kirish taxtasi — yozilmagan bo'lim ko'rinmaydi → 404", 'Module · AppModule imports', "ro'yxat", 'm4a-03'],
  ["qo'riqchi · 🔒 faqat admin · 🌐 hamma", "Guard · @Roles('admin') · @Roles('public')", 'token va rol', 'm4a-04'],
  ['yorliq — ko\'p kitob bitta yorliqda, yorliq kitobda', '@ManyToOne', 'categoryId kitob jadvalida', 'm4a-04'],
];
const S25 = {
  kicker: "6-bosqich · ko'prik", title: "O'quvchi tili: javon chizmasi, anketa, retsept kitobi…",
  segments: [
    sg('a', "O'quvchi darslari <b>restoran tilida</b> gapiradi — siz ikkala tilni birga aytasiz", "Ikkinchi darsga o'tishdan oldin til. O'quvchi darslari Nest birinchi darsidagidek restoran tilida gapiradi. Siz ikkala tilni bilasiz va sinfda ularni birga aytasiz.", { rows: [] }),
    sg('b', "Entity <b>javon chizmasi</b> deyiladi, DTO — <b>buyurtma anketasi</b>, 400 esa nazoratchi to'xtatgani", "Entity javon chizmasi. DTO buyurtma anketasi, Partial type uning nusxasi. Anketa qoidasi buzilsa nazoratchi to'xtatadi, to'rt yuz.", { rows: [0, 1, 2] }),
    sg('c', "Qolgan qatlamlar oshxona tilida: <b>retsept kitobi</b>, omborchi, ofitsiant va <b>kirish taxtasi</b>", "Base service tayyor retsept kitobi, super qatori omborni ko'rsatadi. Repository omborchi. Controller ofitsiant, har route eshik. Module kirish taxtasi: taxtada yozilmagan bo'lim ko'rinmaydi, to'rt yuz to'rt.", { rows: [3, 4, 5, 6] }),
    sg('d', "Xulosa: KitobShop'da qo'riqchi va yorliq; <b>ikkala so'zni birga</b> ayting — «javon chizmasi, ya'ni Entity»", "KitobShop'da yana ikki so'z: qo'riqchi, bu Guard; yorliq, bu kitobni kategoriyaga bog'lash. Xulosa: ikkala so'zni birga ayting, masalan javon chizmasi, ya'ni Entity. Metafora vazifani tushuntiradi, kodni emas.", { rows: [7, 8] }),
  ],
};
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg, beat }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("O'quvchi aytadi → siz bilasiz", 'Ученик говорит → вы знаете')}</div>
    <table className="mk-tbl"><thead><tr><th>{t("o'quvchi darsida", 'в уроке ученика')}</th><th>{t('atama', 'термин')}</th><th>{t('vazifa', 'задача')}</th><th>{t('qayerdan', 'откуда')}</th></tr></thead><tbody>
      {DICT2.map(([a, b, c, d], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td><td style={{ color: T.ink2 }}>{c}</td><td style={{ color: T.ink3, fontSize: 12 }}>{d}</td></tr>)}
    </tbody></table>
    <Block at={3} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>{t(<>Ikkala so'zni birga ayting: <b>«javon chizmasi, ya'ni Entity»</b>. Metafora vazifani tushuntiradi, kodni emas.</>, <>Говорите оба слова вместе: <b>«чертёж стеллажа, то есть Entity»</b>. Метафора объясняет задачу, а не код.</>)}</div></Block>
  </div>} />;
}

// ============================================================
//  26 · m4a-04 KitobShop va tayyorgarlik
// ============================================================
const MAP04 = ['kirish', 'reja · 3 resurs, Copilot Agent', 'Amaliyot 1 — aniq buyruq', 'Amaliyot 2 — 3 playbook: Category → Book → Order', "Amaliyot 3 — @Roles: qaysi eshik ochiq", "Amaliyot 4 — eshik sinovi: POST /order → 'public'", 'test', 'podium', 'yakun'];
const PREP04 = [
  ['signin va Authorize', "o'quvchi darslarida o'rgatilmagan — 19-ekrandagi ishni sinf bilan birga qiling"],
  ['har o\'quvchida oddiy admin', "playbook'da @Roles('admin'): superadmin bilan 403 — superadmin bilan admin yaratib, KitobShop'ni shu admin bilan sinash"],
  ['kategoriya kitobdan oldin', "yo'q kategoriya bilan 500 (foreign key), id formati noto'g'ri bo'lsa 400"],
];
const BOOK_ENT = ts(String.raw`
@Entity('books')
export class BookEntity extends BaseEntity {
  @Column() title: string;
  @Column() author: string;
  @Column() price: number;
  @Column({ default: false }) is_featured: boolean;

  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column() categoryId: string;
}`, { 8: { id: 'm' }, 9: { id: 'm' }, 10: { id: 'm' }, 12: { id: 'm' } });
const S26 = {
  kicker: "6-bosqich · ko'prik", eyebrow: "m4a-04 · «Praktika — KitobShop backend»", title: "KitobShop: o'quvchi buyuradi, agent yozadi — sizning tayyorgarligingiz",
  segments: [
    sg('a', "m4a-04 — <b>uch resurs agent bilan</b>: o'quvchi buyuradi, tekshiradi va shundan keyin qabul qiladi", "Ikkinchi dars m4a-04, KitobShop. Besh qadamni endi Copilot agenti qiladi, uch resurs uchun: kategoriya, kitob va buyurtma. O'quvchi yozmaydi: buyuradi, natijani tekshiruv ro'yxati bilan solishtiradi va shundan keyingina qabul qiladi.", { prep: -1, v: 'map' }),
    sg('b', "Diqqat: o'quvchi darslari <b>token va Authorize'ni o'rgatmaydi</b> — darsning boshida siz ko'rsatasiz", "Diqqat, ikkinchi xato. KitobShop'da yopiq eshiklar bor, ular token so'raydi. Lekin o'quvchi darslarining hech birida signin, token va Authorize o'rgatilmagan. Darsning boshida uchinchi amaliyotdagi ishni o'quvchilar bilan birga qiling: signin va Authorize.", { prep: 0, v: 'prep' }),
    sg('c', "Diqqat: playbook'da <code>@Roles('admin')</code> — <b>superadmin bilan 403</b>; har o'quvchi avval oddiy admin yaratsin", "Uchinchi xato. Playbook'larda yopiq eshiklarga faqat admin yozilgan. Superadmin bilan kirgan o'quvchi kitob qo'sha olmaydi, to'rt yuz uch oladi. Yechim: darsdan oldin har o'quvchi superadmin bilan oddiy admin yaratsin va KitobShop'ni shu admin bilan sinasin.", { prep: 1, v: 'prep' }),
    sg('d', "Yangi narsa — <b><code>ManyToOne</code></b>: kitob kategoriyaga bog'lanadi; yo'q kategoriya → 500, noto'g'ri id → 400", "Darsdagi yangi narsa: kitobni kategoriyaga bog'lash, ManyToOne. Kitob jadvalida kategoriya id'si ustuni va tashqi kalit paydo bo'ladi. Sinab ko'rdik: mavjud bo'lmagan kategoriya bilan besh yuz, terminalda violates foreign key constraint. Id formati noto'g'ri bo'lsa to'rt yuz. Avval kategoriya, keyin kitob.", { prep: 2, v: 'code' }),
    sg('e', "Xulosa: darsdan oldin uch narsa — <b>signin va Authorize</b>, <b>oddiy admin</b>, kategoriya kitobdan oldin", "Xulosa: KitobShop'dan oldin uch narsani tayyorlang: signin va Authorize'ni ko'rsatish, har o'quvchida oddiy admin, va kategoriya kitobdan oldin yaratilishi. Vaqt, taklif: to'qson daqiqaning qirqi uch playbook'ka ketadi, eng xavfli bo'lak, chunki hammaning agenti ishlashi kerak.", { prep: 9, v: 'prep' }),
  ],
};
function Screen26(p) {
  return <Lesson p={p} S={S26} scene={({ seg }) => <>
    {seg.v === 'map' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("m4a-04 · 9 ekran", 'm4a-04 · 9 экранов')}</div>
      <div className="mk-plan">{MAP04.map((x, i) => <div key={i} className={i === 3 ? 'hl' : ''}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></div>)}</div></div>}
    {seg.v !== 'map' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag" style={{ color: T.accent }}>{t('Darsdan oldin — sizning tayyorgarligingiz', 'Перед уроком — ваша подготовка')}</div>
      <div style={{ display: 'grid', gap: 8 }}>{PREP04.map(([h, d], i) => <div key={i} className={`mk-step${seg.prep === i || seg.prep === 9 ? ' hl' : ''}`} style={{ opacity: seg.prep !== 9 && seg.prep !== i && i > seg.prep ? 0.4 : 1 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span><div className="t"><b>{h}</b><div style={{ fontSize: 13 }}>{d}</div></div></div>)}</div></div>}
    {seg.v === 'code' && <Ide files={tree(BASE, [F.bEnt, 'src/core/entity/category.entity.ts', F.bMod, F.bCtrl, F.bSvc])} active={F.bEnt}>
      <CodePanel file={F.bEnt} lines={BOOK_ENT} focus={['m']} />
      <Term title="psql · \d books" lines={plainLines(String.raw`
 categoryId  | uuid | not null
 FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE CASCADE`)} />
      <Term er lines={term(String.raw`
POST /api/v1/book {…,"categoryId":"aa8481e7-…b108"}  → 500 Internal server error
QueryFailedError: insert or update on table "books" violates foreign key constraint "FK_a0f13454de3df36e337e01dbd55"
POST /api/v1/book {…,"categoryId":"1"}  → 400 categoryId must be a UUID`)} />
    </Ide>}
  </>} />;
}

// ============================================================
//  27 · Sinfdagi 6 holat va o'quvchi savollari
// ============================================================
const STUMBLE2 = [
  ["O'quvchi darsidagi /car", '404 Cannot GET /car', 'manzil /api/v1/car'],
  ['Kira olmayapti', '401 Admin not fount · bazada nomsiz superadmin', ".env Superadmin bloki; bo'sh yaratilgan bo'lsa — satrni o'chirib qayta yoqish"],
  ["Resurs ko'rinmaydi", "Mapped yo'q + 404 · yoki can't resolve … \"CarEntityRepository\"", 'app.module.ts imports · forFeature'],
  ['Raqamli id', '500 + invalid input syntax for type uuid: "1"', "id — javobdagi uuid"],
  ['Token va rol', '401 Unauthorized · 403 Forbidden resource', "Authorize · @Roles ro'yxati (superadmin va admin — har xil rol)"],
  ["Entity o'zgardi", "column \"…\" contains null values · ma'lumot jim yo'qoldi", "yangi ustun nullable: true · Entity'da nima o'zgarganini so'rang"],
];
const QA2 = [
  ['Nega id raqam emas?', "uuid taxmin qilib bo'lmaydigan noyob matn, ikki server bir vaqtda yozsa ham to'qnashmaydi; BaseEntity'da bir marta yozilgan."],
  ['Nega javob data ichida?', "successRes: hamma muvaffaqiyat bir shaklda, frontend doim data'ni o'qiydi; xato — error.message."],
  ['Terminalda Danggg nima?', "xato filtridagi console.log, loyiha muallifining izi; xato emas."],
  ['Nega javobda hashed_password ko\'rinadi?', "all/admin Entity'dagi hamma ustunni qaytaradi; sahifalangan GET /api/v1/admin'da select bilan faqat id, username, is_active olinadi — parol shunday yashiriladi."],
];
const S27 = {
  kicker: '6-bosqich · sinfda', title: 'Sinfda albatta chiqadigan 6 holat va tayyor javoblar',
  segments: [
    sg('a', "Sinfda <b>albatta</b> chiqadigan olti holat — hammasini bugun o'zingiz ko'rdingiz", "Ikkala darsni bilasiz. Endi reja buziladigan joylar: sinfda albatta chiqadigan oltita holat. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa.", { hl: [] }),
    sg('b', "<code>/car</code> manzili <b>404</b> beradi; kira olmaslik sababi — <code>.env</code> va bo'sh superadmin satri", "Birinchi: o'quvchi darsidagi slesh car, to'rt yuz to'rt, manzil api v bir slesh car. Ikkinchi: o'quvchi tizimga kira olmayapti. Env'dagi superadmin blokini tekshiring; superadmin bo'sh yaratilgan bo'lsa, bazadagi satrni o'chirib, serverni qayta ishga tushiring.", { hl: [0, 1] }),
    sg('c', "Resurs ko'rinmasa AppModule yoki <code>forFeature</code>'ni, 500 chiqsa <b>uuid</b> formatini tekshiring", "Uchinchi: resurs ko'rinmaydi. Mapped satri yo'q bo'lsa bosh modul, can't resolve va Repository bo'lsa forFeature. To'rtinchi: car slesh bir, besh yuz, chunki id uuid: javobdagi id'ni nusxalash kerak.", { hl: [2, 3] }),
    sg('d', "401 bo'lsa Authorize, 403 bo'lsa <b>rol</b>, server yiqilsa yangi ustunga <code>nullable</code> qo'ying", "Beshinchi: to'rt yuz bir, Authorize; to'rt yuz uch, Roles ro'yxatida bu rol yo'q, ko'pincha superadmin bilan kirilgan. Oltinchi: Entity'ga majburiy ustun qo'shilgan va server yiqilgan, ustunni ixtiyoriy qiling.", { hl: [4, 5] }),
    sg('e', "Xulosa: xato chiqsa avval <b>statusga</b> qarang — u xato qaysi qatlamdan kelganini aytadi", "Xulosa va usul: xato chiqsa avval statusga qarang. To'rt yuz to'rt manzil yoki modul, to'rt yuz DTO, to'rt yuz bir va uch Guard, besh yuz terminal. Javobni aytmang, xabarni o'quvchi bilan birga o'qing. Pastdagi kartalarda o'quvchi savollariga tayyor javob bor.", { hl: [], qa: true }),
  ],
};
function Screen27(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S27} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE2.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>{t(<><b>404</b> — manzil yoki modul · <b>400</b> — DTO qoidasi · <b>401 / 403</b> — Guard · <b>500</b> — terminalni o'qing. Javobni aytmang: xabarni o'quvchi bilan birga o'qing.</>, <><b>404</b> — адрес или модуль · <b>400</b> — правило DTO · <b>401 / 403</b> — Guard · <b>500</b> — читайте терминал. Не говорите ответ: читайте сообщение вместе с учеником.</>)}</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">{t("O'quvchi so'rasa — bosing", 'Если ученик спросит — нажмите')}</div>
      <div className="mk-qa">{QA2.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  28 · O'z-sinov — 8 savol (Nest-1 Screen27 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = [
  { q: "O'quvchi loyihasida server qaysi faylda ishga tushadi?", o: ['src/main.ts', 'src/api/app.service.ts', 'src/api/app.module.ts', 'src/config/index.ts'], c: 1, e: "main.ts faqat Aplication.main()ni chaqiradi; server app.service.ts'da.", s: 5 },
  { q: "POST /api/v1/car bo'sh {} bilan yuborildi. Javob?", o: ["201, bo'sh mashina yaratiladi", '404, route topilmadi', '500, server xatosi', "400, buzilgan qoidalar ro'yxati"], c: 3, e: 'Global ValidationPipe DTO qoidalarini tekshiradi.', s: 13 },
  { q: 'GET /api/v1/car/1 — nima bo\'ladi?', o: ['500, terminalda uuid xatosi', '404, mashina topilmadi', '200, birinchi mashina', '400, DTO qoidasi buzildi'], c: 0, e: "id uuid; «1» bazada xato beradi, filtr uni 500 qiladi.", s: 13 },
  { q: 'Tokensiz GET /api/v1/admin yuborildi. Javob?', o: ['403, rol yetmaydi', "404, route yo'q", "401, token yo'q", "200, adminlar ro'yxati"], c: 2, e: "AuthGuard: Authorization yo'q → 401.", s: 16 },
  { q: "Entity'da price'dan @Column olib tashlandi, server qayta yoqildi. Nima bo'ladi?", o: ['Server yiqiladi, xato chiqadi', "Ustun bazadan jim o'chadi", "Ustun bazada o'zgarmay qoladi", 'Faqat DTO xato beradi'], c: 1, e: "synchronize bazani Entity'ga moslaydi — ustun o'chadi, xabar yo'q.", s: 21 },
  { q: "O'quvchi m4a-03 bo'yicha localhost:3000/car'ni ochdi — 404, terminalda car uchun 5 ta Mapped bor. Nima deysiz?", o: ["Manzil /api/v1/car bo'lishi kerak", "CarModule'ni AppModule'ga ulang", 'Serverni qayta ishga tushiring', "Authorize'ga token qo'ying"], c: 0, e: "Mapped bor — route bor; o'quvchi darsida prefiks yozilmagan.", s: 24 },
  { q: "KitobShop: superadmin tokeni bilan POST /book — 403. O'quvchiga nima deysiz?", o: ['Qayta signin qiling, token eskirgan', "Authorize'ga tokenni qayta qo'ying", "BookModule'ni AppModule'ga ulang", 'Oddiy admin yarating va u bilan kiring'], c: 3, e: "@Roles('admin') — superAdmin ro'yxatda yo'q; token yaroqli, shuning uchun 403.", s: 26 },
  { q: "O'quvchi .env'ni keyin to'ldirdi, lekin kira olmayapti; bazada nomsiz superadmin bor. Nima qilasiz?", o: [".env'ni yana bir marta saqlang", 'Serverni ikki marta qayta yoqing', "Bazadagi o'sha satrni o'chirib, qayta yoqing", "USER_NAME'ni boshqa nomga o'zgartiring"], c: 2, e: "Superadmin bor bo'lsa onModuleInit yangisini yaratmaydi.", s: 6 },
];
function Screen28(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult
      ? 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов, три из них по урокам ученика. На каждый вопрос одна попытка, после ответа открывается верный вариант и пояснение. Шесть и больше — урок усвоен. Если меньше, вернётесь к указанным экранам и пройдёте тест заново.'
      : sc >= 6
        ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan uchtasi o'quvchi darslari bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi darslariga kirsangiz, sinfdagi xatolar sizga tanish bo'ladi.", 'Урок усвоен. Теперь, когда вы откроете уроки ученика, ошибки в классе будут вам знакомы.') : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker={t("O'z-sinov", 'Самопроверка')} idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">{t("O'z-sinov · natija", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>
            <h2 className="mk-title" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{score} / {FINAL.length} — {score >= 6 ? t("dars o'zlashtirildi", 'урок усвоен') : t("yana bir ko'rib chiqing", 'посмотрите ещё раз')}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{t(`${f.s}-ekran`, `экран ${f.s}`)}</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>{t('Sinovni qayta topshirish', 'Пройти тест заново')}</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>{t('Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.', 'Если вернётесь к экрану и нажмёте «Далее», попадёте обратно к этому результату.')}</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">{t("O'z-sinov", 'Самопроверка')} · {i + 1} / {FINAL.length} · {t("bitta urinish · to'g'ri:", 'одна попытка · верно:')} {score}</p>
            <h2 className="mk-title" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? t("To'g'ri", 'Верно') : t("Noto'g'ri — to'g'risi yashil", 'Неверно — правильный ответ зелёный')}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? t('Keyingi savol →', 'Следующий вопрос →') : t("Natijani ko'rish →", 'Посмотреть результат →')}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  29 · Yakun (M13): Barakalla → xulosa → uyga vazifa → eslatma → «Darsni yakunlash»
// ============================================================
const SUM2 = [
  { k: 'farq', t: "O'quvchi loyihasi: server app.service.ts'da, manzil /api/v1, javob data'da, xato error.message'da, sozlama .env'dan", st: ['pre'] },
  { k: 'layer', t: 'Resurs — 5 qatlam: Entity · DTO · Service (BaseService + Repository) · Controller · Module (+ core/index.ts, AppModule)', st: ['ctrl', 'svc', 'repo', 'db'] },
  { k: 'err', t: '400 — DTO qoidasi yoki ortiqcha maydon; 500 — terminalni o\'qing (/car/1 — id uuid)', st: ['pipe'] },
  { k: 'guard', t: "401 — token yo'q; 403 — rol ro'yxatda yo'q; superadmin va admin — har xil rol", st: ['guard'] },
  { k: 'sync', t: "Entity o'zgarsa baza o'zgaradi: ustun jim o'chadi, majburiy ustun serverni yiqitadi", st: ['db'] },
  { k: 'bridge', t: "O'quvchi darslarida 3 xato: /car → /api/v1/car · token va Authorize'ni siz ko'rsatasiz · KitobShop'dan oldin oddiy admin", st: ['br'] },
];
const STATIONS = [['br', t2('Brauzer', 'Браузер'), T.ink2], ['pre', '/api/v1', T.ink2], ['guard', 'Guard', N2.guard], ['pipe', 'ValidationPipe', N2.dto], ['ctrl', 'Controller', PART.ctrl], ['svc', 'Service', PART.svc], ['repo', 'Repository', N2.entity], ['db', t2('jadval', 'таблица'), N2.entity]];
function t2(uz, ruTxt) { return { uz, ru: ruTxt }; }
function SummaryMap2({ hl }) {
  const cur = SUM2.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">{t("Bugungi dars — bitta so'rovning to'liq yo'li", 'Сегодняшний урок — полный путь одного запроса')}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0,1fr))', gap: 6 }}>
      {STATIONS.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{typeof n === 'string' ? n : t(n.uz, n.ru)}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK2 = [
  { t: "brand resursi — 5 qadam: brand.entity.ts (name, country) + core/index.ts · dto/ · brand.service.ts · brand.controller.ts (4 eshik) · brand.module.ts + AppModule", c: [] },
  { t: "Swagger: POST /api/v1/brand → 201 · bo'sh name → 400 name should not be empty…", c: [] },
  { t: "car → brand: car.entity.ts'ga @ManyToOne(() => BrandEntity) + @JoinColumn({ name: 'brandId' }) + @Column({ nullable: true }) brandId — server ishga tushadi, cars'da brandId va tashqi kalit", c: [] },
  { t: "Ataylab buzing: brand.module.ts'dan forFeature'ni oling → «can't resolve dependencies of the BrandService (?)» → qaytaring", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "brand resursi"', 'git push'] },
];
const CHEATSHEET2 = `# Nest-2 — mentor eslatmasi (o'quvchi reposi IntroNestArxitechture)
## Ishga tushirish
git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git · npm install · cp .env.example .env · createdb -U postgres nestarxitechture · npm run start:dev → localhost:3000/api/v1 (Swagger)
## .env — uch blok
DEV_DB_URL (parol, nestarxitechture) · NODE_ENV=dev (boshqasi → prod bazasi, jadval yaratilmaydi) · Access_Token_Key · Superadmin: USER_NAME, FULL_NAME, PHONE, PASSWORD (kuchli)
Bo'sh superadmin yaratilgan bo'lsa: DELETE FROM admins WHERE role='superAdmin'; → qayta npm run start:dev → «Super admin created successfully»
## cars-api'dan farqlar
server: src/api/app.service.ts → Aplication.main() (main.ts faqat chaqiradi) · prefiks /api/v1 · muvaffaqiyat {statusCode, message:'success', data} · xato {statusCode, error:{message}} · oddiy Error → 500, sabab terminalda («Danggg» — console.log)
## Resurs — 5 qatlam, 6 fayl + 2 tahrir
src/core/entity/car.entity.ts (+ core/index.ts export) · src/api/car/dto/create-car.dto.ts · update-car.dto.ts (PartialType @nestjs/swagger'dan) · car.service.ts (extends BaseService, super(carRepo)) · car.controller.ts (findOneById) · car.module.ts (forFeature) + AppModule imports
## Status jadvali
400 DTO qoidasi / ortiqcha maydon («property … should not exist») · 401 token yo'q (Authorize) · 403 rol ro'yxatda yo'q · 404 manzil (/api/v1) yoki modul (Mapped yo'q) · 500 terminalni o'qing (/car/1 → invalid input syntax for type uuid; ParseUUIDPipe → 400)
## Guard
'public' — hamma · @Roles yozilmagan — tizimga kirganlar · 'ID' — o'z yozuvi · superAdmin va admin — har xil rol (@Roles('admin') → superadmin 403) · token 24 soat, eskirsa — qayta signin (/admin/token eskirganni tiklamaydi)
## synchronize tuzoqlari
@Column olib tashlansa — ustun bazadan jim o'chadi · bor jadvalga majburiy ustun → «contains null values» → nullable: true
## O'quvchi darslaridagi 3 xato
m4a-03: /car → /api/v1/car · token/Authorize o'rgatilmagan — siz ko'rsatasiz · m4a-04: KitobShop'dan oldin oddiy admin
## O'quvchi tili
javon chizmasi=Entity · anketa=DTO · nazoratchi=ValidationPipe · retsept kitobi=BaseService · omborchi=Repository · ofitsiant=Controller · kirish taxtasi=Module · qo'riqchi=Guard · yorliq=@ManyToOne
## Sizning uyga vazifangiz
brand resursi + car → brand (@ManyToOne, brandId nullable) + forFeature'ni buzib tuzatish → GitHub → repo linki platformadagi uyga vazifaga`;
// UZ-RU: ruscha segmentlar nest2/parts/08-ru.jsx dagi S29_RU dan (id bo'yicha; 'a' — o'tgan/o'tmagan ikki varianti)
const s29Ru = (passed, segs) => (LANG === 'ru' ? segs.map((s) => ({ ...s, ...(S29_RU[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) })) : segs);
const s29Segments = (passed) => s29Ru(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "O'quvchi loyihasi: server <b>app.service.ts</b>'da, manzil <b>/api/v1</b>, javob shakllari bitta", "Birinchi: o'quvchi loyihasida server app service ts faylida ishga tushadi, manzil api v bir bilan boshlanadi, javob data ichida, xato error message ichida, sozlama env'dan.", { hl: 'farq' }),
  sg('b2', "Resurs — <b>5 qatlam</b>: Entity, DTO, Service, Controller, Module", "Ikkinchi: resurs besh qatlam. Entity, DTO, Base service'dan meros olgan Service, Controller va Module, ustiga core index va bosh modul.", { hl: 'layer' }),
  sg('b3', "<b>400</b> — DTO qoidasi; <b>500</b> — terminalni o'qing", "Uchinchi: to'rt yuz DTO qoidasidan keladi, besh yuz bo'lsa sabab terminalda, masalan id uuid bo'lgani uchun.", { hl: 'err' }),
  sg('b4', "<b>401</b> — token yo'q, <b>403</b> — rol yo'q; superadmin va admin — har xil rol", "To'rtinchi: to'rt yuz bir token yo'q, to'rt yuz uch rol ro'yxatda yo'q. Superadmin va admin har xil rol.", { hl: 'guard' }),
  sg('b5', "Entity o'zgarsa <b>baza o'zgaradi</b> — jim yoki yiqilib", "Beshinchi: Entity o'zgarsa baza ham o'zgaradi. Ustun olib tashlansa ma'lumot jim o'chadi, majburiy ustun qo'shilsa server yiqiladi.", { hl: 'sync' }),
  sg('b6', "O'quvchi darslarida <b>3 xato</b> — sinfda siz tuzatasiz", "Oltinchi, sinf uchun eng muhimi: o'quvchi darslarida uchta xato bor. Slesh car o'rniga api v bir slesh car, token va Authorize'ni siz ko'rsatasiz, KitobShop'dan oldin oddiy admin.", { hl: 'bridge' }),
  sg('hw', "<b>Uyga vazifa</b>: brand resursi, car'ni brand'ga bog'lash va bitta buzib-tuzatish", "Uyga vazifa. O'z loyihangizga brand resursini qo'shing, aynan o'quvchining uyga vazifasi: name va country, DTO qoidalari, Base service'dan meros, to'rt eshik va bosh modul. Keyin car'ni brand'ga bog'lang, yangi ustun ixtiyoriy bo'lsin. Bir marta ataylab forFeature'ni olib tashlang, xabarni o'qing va tuzating.", { hl: 'hw' }),
  sg('hw2', "Topshirish: GitHub'dagi repo linkini <b>platformadagi uyga vazifaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: .env, farqlar, 5 qatlam, statuslar, 3 xato — bir sahifada", "Pastda bir sahifalik eslatma: env ro'yxati, farqlar, besh qatlam, status jadvali, Guard qoidalari va o'quvchi darslaridagi uchta xato. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen29(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET2, CHEATSHEET2_RU);
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('nest-2-mentor-eslatma.md', 'nest-2-pamyatka-mentora.md'); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s29Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap2 hl={hl} />
            <div className="mk-plan">{SUM2.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK2.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> brand resursi to'liq · extends BaseService · AppModule · brandId ixtiyoriy va tashqi kalit bor · 201/400 ishlaydi.</>, <><b>Проверяющий смотрит:</b> ресурс brand полностью · extends BaseService · AppModule · brandId необязателен и есть внешний ключ · 201/400 работают.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t('Jest — birinchi unit-test', 'Jest — первый unit-тест')}</div></div>
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
      <p className="mk-eyebrow">{t('Mentor kursi · NestJS', 'Курс для менторов · NestJS')}</p>
      <h1>{t(LESSON_TITLE, 'Репозиторий ученика: один ресурс, Guard и ошибки в классе')}</h1>
      <p>{t("Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.", 'Урок озвучен. На каждом экране говорит учитель, экран меняется вместе с ним. Проверьте наушники или громкость.')}</p>
      <ul>
        {t(["Jami taxminan 1 soat 20 daqiqa: ovoz ~35 daqiqa · to'rt amaliyot 35–45 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 15-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Nest-1 darsi o'tilgan · Node.js 20+ · PostgreSQL ishlab turgan · Git · VS Code", "Loyiha: o'quvchi reposi IntroNestArxitechture — darsda uni o'zingizda ishga tushirasiz"], ['Всего около 1 часа 20 минут: озвучка ~35 минут · четыре практики 35–45 минут · 4 проверки · самопроверка 8 вопросов. После экрана 15 можно сделать перерыв', 'Нужно: пройден урок Nest-1 · Node.js 20+ · запущенный PostgreSQL · Git · VS Code', 'Проект: репозиторий ученика IntroNestArxitechture — на уроке вы запустите его у себя']).map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>{t('Boshlash →', 'Начать →')}</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, ScreenP1, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenP2, Screen16, Screen17, Screen18, ScreenP3, Screen20, Screen21, Screen22, ScreenP4, Screen24, Screen25, Screen26, Screen27, Screen28, Screen29]; // F-1031-09: o'quvchi uyga vazifasini tekshirish ekrani olib tashlandi (mentor tekshirmaydi)
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function NestRepoMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss2();
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

// ============================================================
//  RU — ruscha matn (M24). O'zbekcha matn nest2/parts/03–06 da etalon holida turadi;
//  bu yerda faqat ruschasi: ru(obj, {…}) → setLang('ru') ildizda obyektning o'zini almashtiradi.
//  Segmentlar id bo'yicha (key · text · show), kod satrlari va qatorlar indeks bo'yicha. Yozilmagan maydon — o'zbekcha qoladi.
//  Uslub: «Вы», mentor imtihoni — dasturlash atamalari inglizcha (Controller, Service, route, dependency…);
//  ovoz matnida kod va belgilar o'qilmaydi, raqam raqam bilan (TTS o'qiydi). show — ekrandagi to'liq matn (ovoz bilan bir xil).
// ============================================================
const rs = (key, text) => ({ key, text, show: text });

// --- 03 · 1–7-ekran, Amaliyot 1 ---
ru(S1, {
  kicker: 'Вступление', eyebrow: 'Курс для менторов · NestJS', title: 'Вы собрали cars-api. Теперь — репозиторий ученика.',
  plan: ['Запуск', 'Отличия от cars-api', 'Ресурс: 5 слоёв', 'Guard и токен', 'Ломаем', 'Мост к урокам ученика'],
  segments: {
    a: rs('В Nest-1 вы собрали проект с нуля — ученик же <b>клонирует готовый проект</b>', 'Здравствуйте. На первом уроке по Nest вы собрали cars api с пустой папки. Ваш ученик с нуля не пишет: он клонирует готовый проект с GitHub. Сегодня откроем именно этот проект, добавим в него один ресурс и посмотрим ошибки, которые появляются в классе.'),
    b: rs('К концу урока проект работает у вас, и вы <b>сами добавили в него ресурс car</b>', 'К концу урока проект будет работать на вашем компьютере вместе с базой, и вы сами добавите в него ресурс car. Пять слоёв ресурса напишем один раз, по порядку.'),
    c: rs('Разберётесь в токенах и ролях: будете различать, <b>почему 401, а почему 403</b>', 'Разберётесь и в защите проекта: откуда берётся токен, почему появляется 401, а почему 403. На это опирается вторая часть урока ученика.'),
    d: rs('Заранее узнаете <b>три ошибки</b> в уроках ученика — не потеряете время в классе', 'И самое важное: в уроках ученика есть три места, которые в классе обязательно дадут проблему. Вы узнаете их заранее и не потеряете время в классе.'),
    e: rs('Шесть этапов, четыре практики. <b>Не спешите</b>: «Далее» откроется, когда учитель договорит', 'Урок состоит из шести этапов, между ними четыре практики, их вы делаете на своём компьютере. Не спешите: каждый экран можно прослушать сначала и прочитать его текст. «Далее» откроется, когда учитель договорит. Начинаем.'),
  },
});
ru(MAP2_DESC, {
  'src/api/admin/admin.module.ts': 'ресурс: Module', 'src/api/admin/admin.controller.ts': 'ресурс: Controller', 'src/api/admin/admin.service.ts': 'ресурс: Service', 'src/api/admin/dto/create-admin.dto.ts': 'ресурс: DTO',
  'src/api/app.module.ts': 'главный модуль', 'src/api/app.service.ts': 'здесь запускается сервер', 'src/common/guard/auth.guard.ts': 'охранник', 'src/common/guard/roles.guard.ts': 'охранник', 'src/common/decorator/roles-decorator.ts': 'метка роли',
  'src/config/index.ts': 'читает .env', 'src/core/entity/admin.entity.ts': 'форма таблицы', 'src/core/entity/Base.entity.ts': 'общие колонки', 'src/core/repository/admin.repository.ts': 'тип Repository',
  'src/infrastructure/base/base.service.ts': 'готовый CRUD', 'src/infrastructure/exception/AllException.filter.ts': 'форма ошибки', 'src/infrastructure/response/successRes.ts': 'форма ответа',
});
ru(RUN_TERM, { 13: { h: '<span class="ok">…  (всего 9 строк Mapped)</span>' } });
ru(ENV_LINES, { 8: { h: '# JWT == (openssl rand -base64 32) &lt;= генерирует ключ JWT-токена' } });
ru(S2, {
  kicker: 'Этап 1 · запуск', title: 'Четыре папки, четыре команды, один файл',
  segments: {
    a: rs('В <code>src</code> проекта <b>37 файлов</b>, но все они в <b>четырёх папках</b> — у каждой одна задача', 'В cars api было семь файлов, в папке src этого проекта тридцать семь. Не пугайтесь, всё лежит в четырёх папках. В api ресурсы: Module, Controller, Service и DTO. В core форма базы, Entity. В common общее: Guard и decorator. В infrastructure фундамент: Base service, фильтр ошибок, токен.'),
    b: rs('<code>git clone</code> и <code>npm install</code>: проект и пакеты, <b>около минуты</b>', 'Для запуска нужны четыре команды и один файл. Первые две: git clone забирает проект, npm install ставит пакеты, около минуты.'),
    c: rs('<code>.env</code> делается из образца: заполняются <b>пароль, имя базы</b> и <b>блок Superadmin</b>', 'Потом файл env. В проекте есть образец, env example: из него делается копия и заполняются три места. Пароль в адресе базы, ваш пароль от PostgreSQL; имя базы, nestarxitechture; и блок Superadmin, имя и надёжный пароль. Что будет, если Superadmin оставить пустым, увидим на шестом экране.'),
    d: rs('<code>createdb</code> и <code>start:dev</code>: в терминале <b>superadmin создан</b> и девять строк <b>Mapped</b>', 'Третья команда создаёт базу, четвёртая запускает сервер. Читайте терминал: подключился к базе, superadmin из env записан в базу, дальше девять строк Mapped, все начинаются с api v1. Последняя строка с опечаткой: server runnig onn port. Это не ошибка, так написано в проекте.'),
    e: rs('Вывод: четыре команды и три места в <code>.env</code>; строка о superadmin появляется <b>только в первый раз</b>', 'Вывод: четыре команды и три места в env. Запомните одно: строка о том, что superadmin создан, появляется только при первом запуске. В следующий раз superadmin уже в базе, строки нет, это нормально.'),
  },
});
ru(S3, {
  kicker: 'Этап 1 · Swagger', title: 'Swagger: localhost:3000/api/v1 — меню проекта',
  segments: {
    a: rs('Сервер работает — в браузере <code>/api/v1</code> открывается страница <b>Swagger</b>', 'Сервер работает. Открываем в браузере localhost 3000, api v1. Это Swagger, меню проекта: ученик видел эту страницу на уроке m4a-01. Если открыть просто localhost 3000, будет 404, почему, увидим на следующем этапе.'),
    b: rs('В разделе <code>admin</code> <b>9 routes</b>: signin, token, signout и шесть CRUD routes', 'В разделе admin девять routes: для входа signin, token и signout, остальные шесть для создания, просмотра, изменения и удаления админов.'),
    c: rs('Замок — <b>пометка в документации</b>: у <code>token</code> и <code>signout</code> замка нет, но токен они тоже требуют', 'У некоторых строк есть замок: этому route нужен токен, он передаётся через кнопку Authorize. Но осторожно: замок программист ставит вручную. У token и signout замка нет, но и они требуют токен. Надёжный источник не замок, а код Guard, его прочитаем на четвёртом этапе.'),
    d: rs('Вывод: в Swagger видны routes, форма входных данных и ответ — <b>главное окно для ученика</b>', 'Вывод: в Swagger есть все routes, форма входных данных и пример ответа, Postman не нужен. Теперь доведите проект до этого состояния сами: первая практика.'),
  },
});
ru(P1, {
  kicker: 'Практика 1 / 4', eyebrow: 'Сейчас у вас · 10–15 минут', title: 'Запустите репозиторий ученика у себя',
  segments: {
    a: rs('Теперь вы: <b>запускаете проект у себя</b> — четыре шага', 'Теперь ваша очередь: запустите проект на своём компьютере. Четыре шага, десять-пятнадцать минут. Перед началом проверьте, что PostgreSQL работает.'),
    b: rs('Шаги 1–2: clone, install, <code>.env</code> — <b>не запускайте, не заполнив блок Superadmin</b>', 'Первое: clone и npm install. Второе: сделайте env из env example и заполните три места. Не запускайте сервер, не заполнив блок Superadmin, потом исправлять сложнее.'),
    c: rs('Шаги 3–4: база, сервер, Swagger; подтверждение — строка <code>successfully started</code> <b>с датой</b>', 'Третье: создайте базу и запустите сервер. Четвёртое: откройте Swagger в браузере. В поле подтверждения скопируйте строку successfully started из терминала целиком, с датой.'),
    d: rs('Вышло иначе — внизу кнопка <b>«Вышло иначе?»</b>; без отметок и подтверждения «Далее» не откроется', 'Если что-то вышло иначе, нажмите внизу кнопку «Вышло иначе»: в классе будут именно эти случаи. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется.'),
  },
});
ru(P1_STEPS, [
  { t: 'Clone и install', exp: 'added … packages' },
  { t: '.env', exp: 'DEV_DB_URL (пароль, nestarxitechture) · NODE_ENV=dev · USER_NAME, FULL_NAME, PHONE, PASSWORD (надёжный: например Superadmin1!)' },
  { t: 'База и сервер', exp: 'Super admin created successfully · 9 строк Mapped {/api/v1/admin…} · server runnig onn port 3000' },
  { t: 'Swagger', exp: 'раздел admin, 9 routes' },
]);
ru(P1_TROUBLE, [
  [null, 'Ошибки базы из Nest-1: PostgreSQL не запущен · неверный пароль · база не создана'],
  [null, '.env вообще нет — шаг 2'],
  [null, 'npm install не дошёл до конца — повторите npm install'],
  [null, 'В Nest-1 остался открытым cars-api — закройте его'],
  ['Super admin created successfully не появилось', 'superadmin уже в базе (вы запускали раньше) — это нормально; если не можете войти — экран 6'],
]);
ru(P1_PROOF, { label: 'Подтверждение: строка «Nest application successfully started» из терминала — с датой', placeholder: 'вставьте сюда строку из терминала', wrong: 'Нужна строка со словами «successfully started» и датой (годом) — скопируйте из терминала всю строку' });
ru(S5, {
  kicker: 'Этап 2 · отличия', title: 'Три отличия: сервер в другом файле, адрес с /api/v1, ответ одной формы',
  segments: {
    a: rs('<code>main.ts</code> — три строки, сервер запускается в <code>Aplication.main()</code> из <b><code>api/app.service.ts</code></b>', 'Проект работает. Теперь сравним его с cars api, отличий три. Первое: в main ts всего три строки, он только вызывает класс Aplication. Сервер запускается в app service ts из папки api. Название Service, но это не Service: внутри create и listen из первого урока по Nest.'),
    b: rs('Второе отличие — <b>глобальный префикс</b>: к каждому route сам добавляется <code>api/v1</code>', 'Второе в этом же файле: глобальный префикс, api v1. В Controller написано admin, но адрес api v1 admin. Поэтому на просто admin будет 404. По правильному адресу 401: route есть, просто нужен токен.'),
    c: rs('Третье отличие — <b>форма ответа</b>: успех внутри <code>data</code>, ошибка внутри <code>error.message</code>', 'Третье: форма ответа. В cars api Nest возвращал свою стандартную форму. В этом проекте успешный ответ выглядит как statusCode, message и data, а ошибка как statusCode и message внутри error. Это делают два файла: successRes и глобальный фильтр ошибок.'),
    d: rs('Фильтр превращает обычную ошибку в <b>500</b>, а причину пишет <b>в терминал</b>; строка <code>Danggg</code> — не ошибка', 'Ещё два слова о фильтре. Любая ошибка не из семейства HttpException становится 500, Internal server error, а настоящая причина пишется в терминал. Перед каждой ошибкой в терминале выводится слово Danggg: это console log в фильтре, не ошибка.'),
    e: rs('Вывод: видите 404 — сначала <code>/api/v1</code>; видите 500 — <b>читайте терминал</b>', 'Вывод: увидели в этом проекте 404, сначала проверьте, есть ли в адресе api v1. Увидели 500, ищите причину не в браузере, а в терминале. Если ученик откроет app service и будет искать там Service, скажите: здесь включается сервер.'),
  },
});
ru(NODEENV_TERM, {
  0: { h: '# NODE_ENV=prod, базы prod нет' },
  2: { h: '<span class="er">error: database "nest2_prod" does not exist          ← у ученика она называется db_prod</span>' },
  3: { h: '…  (9 попыток переподключения, потом падает)' },
  4: { h: '# NODE_ENV=prod, база есть, но пустая (таблицы не создаются)' },
});
ru(BLANK_SA, {
  4: { h: '          | superAdmin          ← superadmin без имени' },
  5: { h: '# .env заполнен, сервер перезапущен: «Super admin created» — 0 раз' },
});
ru(S6, {
  kicker: 'Этап 2 · отличия', title: 'Четвёртое отличие: все настройки из .env — и две тихие ловушки',
  segments: {
    a: rs('<code>config/index.ts</code> читает <code>.env</code>: <b>порт, база, ключ токена, superadmin</b>', 'На втором экране мы заполнили env. Теперь посмотрим, кто его читает: index ts в папке config. Он берёт из env порт, адрес базы, ключ токена и данные superadmin. Остальной проект обращается не к env, а к этому config.'),
    b: rs('<code>NODE_ENV=dev</code>: база dev и <b>таблицы создаются сами</b>; любое другое значение — база prod', 'Самая важная строка: если NODE ENV равно dev, берётся адрес базы dev и включается synchronize, то есть TypeORM сам создаёт таблицы. При любом другом значении берётся адрес prod, и таблицы не создаются.'),
    c: rs('<code>NODE_ENV</code> неверный: <b>does not exist</b> или <b>error in creating super admin</b> — причина скрыта', 'Мы проверили: если NODE ENV равно prod, а базы prod нет, сервер падает с database does not exist. Если база prod есть, но пустая, сообщение другое: error in creating super admin. Настоящая причина, отсутствие таблицы, спрятана в коде. В обоих случаях ответ один: NODE ENV dev.'),
    d: rs('Тихая ловушка: пустой блок superadmin — в базе <b>superadmin без имени</b>; заполнить <code>.env</code> потом не поможет', 'Вторая ловушка тише. Если блок superadmin оставить пустым, сервер запускается без ошибок и пишет в базу superadmin без имени. Даже если потом заполнить env, новый не создаётся: сервер считает, что superadmin уже есть. Мы проверили: вход с именем из env даёт 401, Admin not fount.'),
    e: rs('Вывод: ученик не может войти — <b>удалите строку пустого superadmin</b> и перезапустите сервер', 'Вывод: в env должно быть NODE ENV dev и полностью заполненный блок superadmin. Если ученик не может войти с правильным именем, а в базе superadmin без имени, удалите эту строку и перезапустите сервер. Мы проверили: superadmin заново записывается из env, и signin работает.'),
  },
});

// --- 04 · 8–15-ekran, Amaliyot 2 ---
ru(S8, {
  kicker: 'Этап 3 · Entity', title: 'Ресурс car, слой 1: Entity — форма таблицы',
  segments: {
    a: rs('Добавляем в проект <b>один ресурс</b> — <b>car</b> из урока ученика m4a-03, пять слоёв', 'Проект вы знаете. Теперь добавим в него один ресурс: машины, car. Ровно то, что ученик делает на уроке m4a-03, с теми же именами. Ресурс — это пять слоёв: Entity, DTO, Service, Controller и Module. Рядом с каждым слоем образцом стоит файл admin из проекта.'),
    b: rs('Entity — <b>форма таблицы</b>: класс — таблица, каждое поле с <code>@Column</code> — колонка', 'Первый слой Entity, в папке core. Entity — форма таблицы в базе: класс это таблица, каждое поле с decorator Column — одна колонка. SQL не пишется: TypeORM сам создаёт таблицу по этому классу.'),
    c: rs('Наследование от <code>BaseEntity</code> — <b>id (uuid) и две даты бесплатно</b>; писать <code>id</code> заново — ошибка', 'Класс наследует Base entity и бесплатно получает три колонки: id, время создания и время изменения. id не число, а uuid, строка из 36 символов. Если ученик пишет колонку id вручную, это повтор: в уроке ученика это показано именно как ошибка.'),
    d: rs('Своих колонок четыре; новую Entity добавляют <b>и в <code>core/index.ts</code></b>, иначе её не найдут', 'Своих колонок четыре: brand и model строки, price число, у is available значение по умолчанию true. И одно правило проекта: index ts в папке core отдаёт все Entity из одного места, новая Entity добавляется туда. Не добавили, и другие файлы не найдут Car entity, TypeScript выдаст ошибку.'),
    e: rs('Вывод: Entity — форма таблицы; сама таблица появится <b>после подключения модуля</b>, при запуске сервера', 'Вывод: Entity — форма таблицы, она в папке core и наследует Base entity. Таблицы в базе пока нет: TypeORM создаст её при запуске сервера, когда модуль ресурса будет подключён. В уроке ученика Entity называется чертежом стеллажа.'),
  },
});
ru(S9, {
  kicker: 'Этап 3 · DTO', title: 'Слой 2: DTO — правила входных данных, 400 отсюда',
  segments: {
    a: rs('Форма таблицы есть. DTO — форма и правила данных, <b>приходящих в запросе</b>', 'Форма таблицы готова. Второй слой — данные из запроса: DTO. Entity это таблица в базе, а DTO данные в запросе, не путайте их. DTO лежат в папке dto внутри папки ресурса.'),
    b: rs('У каждого поля правило: <code>brand</code>, <code>model</code> — непустые строки, <code>price</code> — число, <code>is_available</code> — необязательно', 'В DTO создания над каждым полем правило: brand и model строки и не пустые, price число, is available необязательно. На каждом поле есть ещё один decorator, пример для Swagger: готовый JSON в Swagger собирается из этих примеров.'),
    c: rs('DTO изменения — <b><code>PartialType</code></b>: те же поля, все необязательные', 'DTO изменения — одна строка: Partial type, то есть поля из создания, но все необязательные, в PATCH отправляется только изменённое поле. Partial type берётся из пакета nestjs swagger. Из другого пакета тоже работает, но в Swagger пропадают поля, мы это проверили.'),
    d: rs('Правила проверяет <b>глобальный ValidationPipe</b>: поле, которого нет в DTO, тоже <b>400</b>', 'Кто проверяет правила? В проекте включён глобальный ValidationPipe. В cars api пустой запрос возвращал 201; здесь при нарушении правил будет 400, и в сообщении перечислены все нарушенные правила. Ещё одна настройка: пришло поле, которого нет в DTO, тоже 400, property should not exist.'),
    e: rs('Вывод: видите 400 — сообщение говорит, <b>какое правило</b> DTO нарушено', 'Вывод: DTO — два файла, правила входных данных только здесь. Видите 400, читайте сообщение: какое поле, какое правило. Реальные ответы посмотрим на тринадцатом экране. В уроке ученика DTO называется бланком заказа.'),
  },
});
ru(S10, {
  kicker: 'Этап 3 · Service', title: 'BaseService — CRUD написан один раз, все ресурсы наследуют',
  segments: {
    a: rs('В Nest-1 вы писали CRUD сами — здесь он написан <b>один раз, в BaseService</b>', 'Третий слой Service, но сначала его фундамент. На первом уроке по Nest вы сами писали findAll, findOne и create. В этом проекте они написаны один раз, в Base service из папки infrastructure, и работают для всех ресурсов.'),
    b: rs('<b>Семь методов</b>: создание, список (обычный и постраничный), поиск одного (два способа), изменение, удаление', 'В Base service семь методов: создание, обычный и постраничный список, два способа найти одну запись, изменение и удаление. Если запись не найдена, все отвечают одинаково: 404, not found.'),
    c: rs('Каждый метод возвращает ответ через <code>successRes</code> — <b>та самая форма с пятого экрана</b>', 'Каждый метод возвращает ответ через successRes, та самая форма с пятого экрана: при создании statusCode 201, в остальных 200. Поэтому ответы всех ресурсов выглядят одинаково.'),
    d: rs('Вывод: CRUD <b>не пишут заново</b>; особая работа — только поверх этого метода', 'Вывод: в новом ресурсе CRUD заново не пишется, он наследуется от Base service. Нужна особая работа, например шифрование пароля в admin, пишется только поверх этого метода. В уроке ученика Base service называется готовой книгой рецептов.'),
  },
});
ru(S11, {
  kicker: 'Этап 3 · Service', title: 'Слой 3: Service — наследование, Repository и super',
  segments: {
    a: rs('<code>CarService</code> — <code>@Injectable</code> и наследование от BaseService: рабочая часть <b>восемь строк</b>, методов нет', 'Теперь car service. Над ним Injectable, как на первом уроке по Nest. Класс наследует Base service с тремя типами: два DTO и Entity. Рабочая часть восемь строк, ни одного метода.'),
    b: rs('В конструкторе запрашивается <b>Repository</b> и через <b><code>super</code></b> передаётся в BaseService', 'В конструкторе один dependency: Repository этой таблицы, то есть методы записи и чтения базы. Следующей строкой он через super передаётся в Base service: теперь семь методов знают, с какой таблицей работать. Забыли super, и TypeScript выдаст ошибку при компиляции.'),
    c: rs('Repository <b>делает TypeORM</b>: <code>forFeature</code> в модуле и <code>InjectRepository</code> в Service — пара', 'Repository вы не пишете сами, его делает TypeORM. Для этого нужны два места, и они парные: forFeature в модуле ресурса и InjectRepository в конструкторе Service, в обоих та же Entity. Это Dependency Injection из первого урока по Nest, только instance даёт TypeORM.'),
    d: rs('Образец в проекте — <code>AdminService</code>: устроен так же, плюс работа с <b>паролем и токеном</b>', 'Admin service рядом устроен так же, только работы больше: шифрует пароль, выдаёт токен и при запуске сервера создаёт superadmin. Его CRUD тоже приходит из Base service.'),
    e: rs('Вывод: Service — <b>наследование, Repository и <code>super</code></b>; логика про машины — сюда', 'Вывод: Service это три вещи: наследование от Base service, Repository и super. Появится логика про машины, например скидка, она пишется здесь, а не в Controller. Если в коде ученика CRUD написан заново, это работает, но лишнее: скажите, что есть Base service.'),
  },
});
ru(S12, {
  kicker: 'Этап 3 · Controller · Module', title: 'Controller, Module и AppModule — ресурс ожил',
  segments: {
    a: rs('Controller — <b>пять routes</b>, в каждом одна строка: вызывает нужный метод Service', 'Четвёртый слой Controller. В нём пять routes: создание, список, одна запись, изменение и удаление. Внутри каждого одна строка, вызывается нужный метод Service, логики нет. Метод поиска одной записи в Base service называется findOneById, другое имя — и TypeScript выдаст ошибку.'),
    b: rs('Тип входного параметра — <b>DTO</b>: ValidationPipe проверяет правила именно этого класса', 'В routes создания и изменения тип входного параметра — DTO. Это не просто запись: ValidationPipe проверяет правила именно этого класса. В этом Controller нет Guard, значит, все routes открыты без токена, в уроке ученика тоже.'),
    c: rs('Module — <b>три списка</b>; потом подключается к <b>AppModule</b>, иначе routes нет', 'Пятый слой Module, три списка: в imports forFeature, в controllers Controller, в providers Service. И последний шаг — главный модуль: Car module в список imports у app module. Забыли, и сервер запустится без ошибок, но routes для car не будет.'),
    d: rs('В терминале <b>пять строк Mapped</b>, в базе таблица <code>cars</code> — её <b>никто не создавал</b>', 'Сохраняем, сервер перезагружается. В терминале Car controller и пять строк Mapped. Смотрим в базу: появилась таблица cars: id uuid, четыре колонки и две даты. Её никто не создавал, это synchronize сделал по Entity.'),
    e: rs('Вывод: <b>5 слоёв — 6 файлов</b>, плюс <code>core/index.ts</code> и одна строка в AppModule', 'Вывод: пять слоёв в шести файлах, потому что DTO два, и ещё две правки: export в core index и одна строка в app module. Если в терминале нет Mapped для car, первым открывайте app module. Теперь отправим запросы.'),
  },
});
ru(REQS13, [
  {}, { body: '{"statusCode":200,"message":"success","data":[{"id":"efa80745-…","brand":"Chevrolet","model":"Malibu","price":250,"is_available":true,…},{"id":"1746997c-…","brand":"Kia","model":"K5","price":320,"is_available":false,…}]}\n(K5 — второй POST, is_available: false)' },
  {}, { body: '{"statusCode":200,"message":"success","data":{}}\nповторный GET /api/v1/car/efa80745-… → {"statusCode":404,"error":{"message":"not found"}}' },
]);
ru(S13, {
  kicker: 'Этап 3 · запросы', title: 'Запросы: 201 · 200 · 400 — и почему /car/1 даёт 500', lockHint: 'Нажмите все кнопки запросов',
  segments: {
    a: rs('Ресурс ожил: <code>POST</code> — <b>201</b>, <code>id</code> uuid и даты поставились сами', 'Ресурс ожил, отправляем запросы из Swagger. Добавляем машину: 201 и ответ в форме successRes. id uuid, is available true и две даты: их дали не мы, они из Base entity и значения по умолчанию.'),
    b: rs('<code>GET</code> список и одна запись, <code>PATCH</code> только цена, <code>DELETE</code> — пустая <code>data</code>', 'GET возвращает список и одну запись, 200. Через PATCH меняем только цену: 200, остальные поля на месте. DELETE: 200 и пустой объект в data. Запросите удалённую машину ещё раз, будет 404.'),
    c: rs('Нарушено правило — <b>400</b>: пустой запрос, лишнее поле, число в кавычках', 'Теперь нарушаем правила. Пустой запрос: 400 и все нарушенные правила. Лишнее поле color: 400, property color should not exist. Цена в кавычках: 400, price must be a number. Ученик, меняя пример в Swagger, часто оставляет кавычки.'),
    d: rs('<code>/api/v1/car/1</code> — <b>500</b>: id это uuid; с <code>ParseUUIDPipe</code> — понятный <b>400</b>', 'И привычка ученика: как в cars api, car 1. 500. Причина в терминале: invalid input syntax for type uuid, потому что id не число. Если в Controller добавить параметру id ParseUUIDPipe, запрос не дойдёт до базы: 400 и понятное сообщение, Validation failed, uuid is expected.'),
    e: rs('Вывод: успех в <code>data</code>, ошибка в <code>error.message</code>; <b>500 — смотрите терминал</b>', 'Вывод: успех внутри data, ошибка внутри error message. При 400 сообщение называет правило DTO, при 500 причина в терминале. Теперь сами нажмите кнопки и прочитайте каждый ответ, потом откроется «Далее».'),
  },
});
ru(LC2_FIXED, { 13: { h: `  <span class="d">@Column</span>()   <span class="cm">// колонка — в Entity; @IsNumber — в DTO</span>` } });
ru(P2, {
  kicker: 'Практика 2 / 4', eyebrow: 'Сейчас у вас · 20 минут', title: 'Добавьте ресурс car в свой проект',
  segments: {
    a: rs('Теперь вы <b>добавляете ресурс car</b> — «День открытия» ученика, до урока', 'Теперь ваша очередь: добавьте ресурс car в свой проект. Это «День открытия» из урока ученика, вы один раз пройдёте его сами до урока. Около двадцати минут. У каждого шага есть кнопка «Открыть код»: это образец, код пишите сами.'),
    b: rs('Шаги 1–3: Entity и <code>core/index.ts</code>, два DTO, Service', 'Первое: Entity и export в core index. Второе: два DTO. Третье: Service, не забудьте super.'),
    c: rs('Шаги 4–5: Controller, Module и AppModule — в терминале <b>пять строк Mapped</b>', 'Четвёртое: Controller, пять routes. Пятое: Module и подключение к главному модулю. Увидели в терминале пять строк Mapped, ресурс ожил.'),
    d: rs('Шаг 6: POST в Swagger — <b>201</b>; подтверждение — первые 8 символов <code>id</code> из ответа', 'Шестое: добавьте одну машину в Swagger, 201. Впишите в поле подтверждения первые восемь символов id из ответа. Если вышло иначе, нажмите внизу кнопку «Вышло иначе». Без отметок и подтверждения «Далее» не откроется.'),
  },
});
ru(P2_STEPS, [{}, {}, {}, {}, { exp: 'src/api/car/car.module.ts + app.module.ts → imports: [..., CarModule] · терминал: CarController {/api/v1/car} + 5 строк Mapped' }, {}]);
ru(P2_TROUBLE, [
  [null, 'в core/index.ts не написан export (экран 8)'],
  [null, 'нет super(carRepo) (экран 11)'],
  [null, 'метод называется findOneById (экран 12)'],
  [null, 'в car.module.ts нет forFeature (подробно — экран 20)'],
  ['Сервер запустился, Mapped для car нет, /api/v1/car → 404 Cannot GET /api/v1/car', 'в imports у AppModule нет CarModule'],
  [null, 'в JSON число в кавычках'],
]);
ru(P2_PROOF, { label: 'Подтверждение: первые 8 символов data.id из ответа', placeholder: 'первые 8 символов id, до дефиса', wrong: '8 символов (0–9, a–f) до дефиса — из id в вашем ответе (а не из образца на экране)' });

// --- 05 · 16–23-ekran, Amaliyot 3–4 ---
ru(AUTHG_LINES, { 1: { h: `  <span class="cm">//  Если у route @Roles('public') — токен не требуется</span>` } });
ru(S16, {
  kicker: 'Этап 4 · Guard', title: 'AuthGuard: есть ли токен — нет, значит 401',
  segments: {
    a: rs('Routes car были открыты; routes admin <b>защищены</b> — перед Controller стоит <b>Guard</b>', 'Наши routes car открыты без токена. А routes admin защищены: без токена 401. Это делает не Controller, а стоящий перед ним Guard, охранник. На admin Controller подключены два Guard: Auth guard и Roles guard. Начнём с первого.'),
    b: rs("Почему <code>'public'</code>? Токен <b>выдаётся на signin</b> — если бы signin тоже требовал токен, никто бы не вошёл", 'Auth guard сначала смотрит на метку Roles у route: если там public, пропускает без проверки. Почему на signin стоит public? Токен выдаётся именно на signin, до входа токена ни у кого нет. Если бы signin тоже требовал токен, никто бы не смог войти. Поэтому это правильное решение, а не дыра в безопасности: дверь для входа открыта, остальные двери закрыты.'),
    c: rs('Иначе нужен <code>Authorization: Bearer</code> и действующий токен — нет, значит <b>401</b>', 'На остальных routes в запросе должен быть header Authorization: слово Bearer и токен. Нет header, токен поддельный или просроченный, будет 401, Unauthorized. Если токен действующий, id и роль из него записываются в запрос, их читает следующий Guard.'),
    d: rs('Токен выдаётся на signin и живёт <b>24 часа</b>; истёк — <b>снова signin</b>', 'Токен выдаётся на signin и по настройке в env живёт 24 часа. Что делать, если срок истёк? Мы проверили: route обновления токена в проекте тоже требует действующий токен и с просроченным даёт 401. Значит, единственный путь: снова signin.'),
    e: rs('Вывод: 401 — <b>«неизвестно, кто вы»</b>: сделайте signin и вставьте токен в Authorize', 'Вывод: 401 означает «неизвестно, кто вы». Решение не в коде: сделайте signin и вставьте токен в окно Authorize в Swagger. Теперь второй охранник: токен есть, но открыта ли вам эта дверь?'),
  },
});
ru(EXPIRY, { 0: { h: '# проверка с Access_Token_Time=5s (реальная)' }, 3: { h: '… 6 секунд …' }, 5: { h: 'POST /api/v1/admin/token  (cookie + просроченный токен) → 401' }, 6: { h: 'POST /api/v1/admin/token  (cookie + токен нового signin) → 201' } });
ru(ROLE_ROWS, { 2: ['@Roles не указан PATCH'] });
ru(S17, {
  kicker: 'Этап 4 · Guard', title: 'RolesGuard: токен есть, но открыта ли вам эта дверь — нет, значит 403',
  segments: {
    a: rs('<code>@Roles(...)</code> — <b>список ролей</b> над route; Guard сравнивает его с ролью в токене', 'Второй охранник Roles guard. Над каждым route decorator Roles задаёт список ролей. Guard сравнивает этот список с ролью в токене. Роль берётся из базы на signin, клиент сам изменить её не может.'),
    b: rs("Пропускает: списка нет или <code>'public'</code> · роль в списке · <code>'ID'</code> и своя запись; <b>остальное 403</b>", 'Guard пропускает в трёх случаях: списка нет или там public; роль из токена есть в списке; в списке слово ID и пользователь запрашивает свою запись. Во всех остальных случаях 403, Forbidden resource.'),
    c: rs("Важно: <b><code>superAdmin</code> и <code>admin</code> — разные роли</b>: на двери <code>@Roles('admin')</code> superadmin тоже получает <b>403</b>", 'Теперь самое важное, в классе это точно всплывёт. В проекте две роли, superadmin и admin, это разные слова. На двери, где в списке только admin, superadmin тоже получает 403. Мы проверили: с токеном superadmin 403, с токеном обычного admin 201.'),
    d: rs('Дверь без <code>@Roles</code> — <b>«для вошедших в систему»</b>: токен нужен, роль не проверяется', 'И ещё один случай: дверь, где Roles не указан вовсе. Auth guard требует токен, без токена 401. В Roles guard списка нет, он пропускает. Значит, эта дверь открыта для любого, кто вошёл в систему.'),
    e: rs('Вывод: 401 — нет токена; 403 — <b>роли нет в списке</b>: положите рядом список и роль, с которой вошли', 'Вывод: 401, токена нет или он недействителен; 403, токен есть, но роли нет в списке. Если ученик говорит 403, положите рядом две вещи: список Roles над route и роль, с которой он вошёл.'),
  },
});
ru(P3, {
  kicker: 'Практика 3 / 4', eyebrow: 'Сейчас у вас · 10 минут', title: 'Войдите как superadmin, создайте обычного админа и посмотрите разницу',
  segments: {
    a: rs('Теперь вы: <b>signin, Authorize и обычный админ</b> — подготовка к уроку KitobShop', 'Теперь ваша очередь. Эту подготовку каждый ученик делает перед уроком KitobShop: вход как superadmin, создание обычного админа и разница между ними. Четыре шага, около десяти минут.'),
    b: rs('Шаги 1–2: <b>signin</b> как superadmin, вставьте токен в <b>Authorize</b> — список админов откроется с 200', 'Первое: signin в Swagger с именем и паролем superadmin из env. Скопируйте токен из ответа без кавычек. Второе: вставьте токен в окно Authorize и запросите список админов: 200.'),
    c: rs('Шаг 3: создайте <b>обычного админа</b> через <code>POST admin</code>; подтверждение — 8 символов его <code>id</code>', 'Третье: создайте обычного админа через POST admin, пароль надёжный. Ответ 201, роль нового админа admin. Впишите в поле подтверждения первые восемь символов его id.'),
    d: rs('Шаг 4: войдите новым админом и сделайте <code>POST admin</code> — должно быть <b>403</b>', 'Четвёртое: выйдите из Authorize, войдите новым админом и снова сделайте POST admin: 403, потому что создавать админов может только superadmin. Если вышло иначе, нажмите внизу кнопку «Вышло иначе». Без отметок и подтверждения «Далее» не откроется.'),
  },
});
ru(P3_STEPS, [{}, {}, { t: 'Обычный админ' }, { t: 'Разница', exp: 'Logout → signin как ali → Authorize → POST /api/v1/admin → 403 {"statusCode":403,"error":{"message":"Forbidden resource"}}' }]);
ru(P3_TROUBLE, [
  [null, 'пишите PASSWORD из .env точно — указанный пароль слабый'],
  [null, 'username не совпадает с .env (опечатка из репозитория); или superadmin создан пустым — решение на экране 6'],
  [null, 'пароль надёжный, но неверный (опечатка из репозитория)'],
  [null, 'Authorize не нажата или токен вставлен с кавычками'],
  [null, 'такой телефон или имя заняты — укажите другие'],
]);
ru(P3_PROOF, { label: 'Подтверждение: первые 8 символов id нового админа', placeholder: 'первые 8 символов id', wrong: '8 символов (0–9, a–f) до дефиса — из data.id в ответе POST admin' });
ru(S20, {
  kicker: 'Этап 5 · ломаем 1', title: 'forFeature удалён — читаем сообщение тремя вопросами',
  segments: {
    a: rs('Ломаем намеренно: из <code>car.module.ts</code> <b>убран <code>forFeature</code></b> — сервер упал', 'Ресурс работает, защиту вы знаете. Теперь ломаем намеренно, потому что ученик и его агент делают именно эти ошибки. Убрали из car module строку forFeature. Сервер упал, читаем сообщение тремя вопросами из первого урока по Nest.'),
    b: rs('Какой класс — <b><code>CarService (?)</code></b>: на этот раз не найден dependency у Service', 'Какой класс: Car service. На первом уроке по Nest здесь был Controller, на этот раз Service. Знак вопроса в скобках — место ненайденного dependency.'),
    c: rs('Какой dependency — <b><code>CarEntityRepository</code></b>; какой файл — <b><code>CarModule</code></b>, то есть <code>car.module.ts</code>', 'Какой dependency: Car entity Repository, первый параметр конструктора. Какой файл: Car module, то есть car module ts. Видите слово Repository, значит, ответ не в providers, а в imports: Repository даёт forFeature.'),
    d: rs('Исправляем: <code>forFeature</code> вернули — <b>пять строк Mapped</b> и successfully started', 'Исправляем: возвращаем строку forFeature и сохраняем. Терминал: Car module готов, Car controller, пять строк Mapped и successfully started.'),
    e: rs('Вывод: в сообщении <b><code>…Repository</code></b> — есть ли <code>forFeature</code> в <code>imports</code> файла модуля', "Вывод: если в сообщении can't resolve dependencies есть слово Repository, откройте файл модуля и проверьте, есть ли в imports forFeature с этой Entity. Формула не меняется: какой класс, какой dependency, какой файл."),
  },
});
ru(S21, {
  kicker: 'Этап 5 · ломаем 2', title: 'Изменилась Entity — база меняется сама, тихо или с падением',
  segments: {
    a: rs('<code>synchronize</code> при каждом запуске <b>подгоняет базу под Entity</b> — удобно и опасно', 'Второй случай виден в базе. В режиме dev включён synchronize: при каждом запуске сервер подгоняет базу под Entity. Было удобно, что таблица создалась сама. Но если Entity меняется, база тоже меняется без спроса.'),
    b: rs('Убрали у колонки <code>@Column</code> — колонка <b>удаляется</b> из базы: сервер без ошибок, цены нет', 'Случай из второй проверки мы запустили по-настоящему: у price убрали Column. Сервер запустился без ошибок, synchronize удалил колонку price из базы. POST возвращает 201, но цены нет ни в ответе, ни в базе. Никакого сообщения.'),
    c: rs('Добавили обязательную колонку в таблицу с данными — сервер <b>падает</b>: <code>contains null values</code>', 'Обратный случай: в таблице есть машины, а в Entity добавили новую обязательную колонку, например brandId для связи с brand. Сервер не запускается: column brandId contains null values. В старых строках эта колонка пустая, а обязательная колонка пустой быть не может.'),
    d: rs('Решение: новая колонка <b><code>nullable: true</code></b> — сервер запускается, старые данные на месте', 'Решение: сделать новую колонку необязательной, nullable true. Мы проверили: так сервер запустился, колонка и внешний ключ созданы, старые машины остались на месте.'),
    e: rs('Вывод: изменить Entity — значит <b>изменить базу</b>; «данные пропали» — спросите про Entity', 'Вывод: изменить Entity значит изменить базу. Убрали колонку, и данные тихо удаляются; добавили обязательную, и сервер падает. Если ученик говорит «пропали данные» или contains null values, первый вопрос: что вы изменили в Entity?'),
  },
});
ru(ENT_DROP, { 3: { h: `  <span class="d">@IsNumber</span>()        <span class="cm">// вместо @Column</span>` } });
ru(P4, {
  kicker: 'Практика 4 / 4', eyebrow: 'Сейчас у вас · 7 минут', title: 'Сломайте сами, прочитайте сообщение, исправьте',
  segments: {
    a: rs('Последняя практика: <b>ломаете вы</b> — два шага, сообщение в вашем терминале', 'Последняя практика: теперь ломаете вы. Два шага, около семи минут. Цель — увидеть и прочитать сообщение в своём терминале.'),
    b: rs('Шаг 1: уберите <code>forFeature</code>, впишите в подтверждение <b>класс, dependency и файл</b>, потом верните', 'Первое: уберите из car module строку forFeature и сохраните, сервер упадёт. Найдите в сообщении, какой класс, какой dependency и какой файл, и впишите их через запятую в поле подтверждения. Потом верните строку на место.'),
    c: rs('Шаг 2: <code>/api/v1/car/1</code> даёт 500, причина в терминале; добавите <b><code>ParseUUIDPipe</code></b> — понятный 400', 'Второе: запросите в Swagger car с id 1: 500. Найдите в терминале строку invalid input syntax for type uuid. Потом добавьте в Controller параметру id ParseUUIDPipe и повторите запрос: 400. Если вышло иначе, нажмите внизу кнопку «Вышло иначе». Без отметок и подтверждения «Далее» не откроется.'),
  },
});
ru(P4_STEPS, [
  { t: 'Нет forFeature', exp: "car.module.ts → imports: [] → сохраните → «can't resolve dependencies of the CarService (?)» … \"CarEntityRepository\" at index [0] … CarModule module → верните строку → 5 строк Mapped" },
  {},
]);
ru(P4_TROUBLE, [
  ['Вернул, но всё равно ошибка', 'файл сохранили? start:dev перезагружается при сохранении — дождитесь новых строк в терминале'],
  ['ParseUUIDPipe не найден', 'import из @nestjs/common'],
  ['/car/1 всё ещё 500', '@Param(\'id\', ParseUUIDPipe) — второй аргумент записан в findOne?'],
  ['Другая ошибка', 'три вопроса: какой класс · какой dependency · какой файл; список Potential solutions подсказывает решение'],
]);
ru(P4_PROOF, { label: 'Подтверждение: из сообщения шага 1 — какой класс, какой dependency, какой файл? (через запятую)', placeholder: 'класс, dependency, файл', wrong: 'Перечитайте сообщение: «of the ___» — класс, «argument "___" at index [0]» — dependency, «in the ___ module» — файл' });

// --- 06 · 24–29-ekran: ko'prik, sinov, yakun ---
ru(MAP03, [
  { t: 'Вступление и план', d: '«Система админов готова — в автосалоне нет машин» → отдельный ресурс; план — 5 этапов; форма машины — 4 колонки', m: '«Ресурс — один вид данных, своя папка, свои 5 этапов»; колонку id не пишут' },
  { t: '5 этапов, после каждого тест', d: 'В каждом файле «какая строка относится к этому файлу» (чужая строка — из другого слоя) · Entity → DTO → Service → Controller → Module → «почему /car 404?»', m: 'правило на каждом этапе: колонка — Entity, правило — DTO, super(carRepo) — Service, дверь — Controller, список — Module' },
  { t: 'Путь запроса, агент, debugging', d: 'путешествие POST /car · агент пишет 5 файлов (playbook) · debugging: агент поставил @Column в Controller — найти и убрать', m: '«Агент пишет то, что вы сказали, — проверяете вы»' },
  { t: 'День открытия — в реальном проекте', d: 'IntroNestArxitechture в VS Code: ресурс car за 5 этапов + AppModule, список из 6 пунктов, «Сделал — жду учителя»', m: 'больше всего времени уходит здесь: не идите дальше, пока у всех /api/v1/car не даёт 200' },
  { t: 'Подиум, карточки, итог', d: '12 карточек: Ресурс, Entity, BaseEntity, DTO, 400, PartialType, BaseService, super, @Post, Module, 404, DI', m: 'читайте карточки вместе — каждая из них ваш экран сегодня' },
]);
ru(TIME03, [[null, 'вступление, план, форма машины'], [null, 'пять этапов + тесты'], [null, 'путь запроса, агент, debugging'], [null, 'День открытия — реальный проект'], [null, 'подиум, карточки, итог']]);
ru(S24, {
  kicker: 'Этап 6 · мост', eyebrow: 'm4a-03 · «Первый ресурс вручную — машины»', title: 'm4a-03: ученик делает то, что вы сделали сегодня',
  segments: {
    a: rs('m4a-03 — <b>то, что вы сделали сегодня</b>: ресурс car, пять этапов, 22 экрана', 'Теперь главная цель урока: передать эту тему ученику. Уроков ученика два. Первый, m4a-03: ученик делает ровно то, что вы сделали сегодня, добавляет ресурс car за пять этапов. Двадцать два экрана.'),
    b: rs('На каждом этапе ученик выбирает <b>строку, относящуюся к этому файлу</b>, потом тест, агент и реальный проект', 'На каждом этапе ученик выбирает строки, какая относится к этому файлу, потом короткий тест. Затем агент пишет пять файлов, и ученик находит ошибку агента. В конце практика в реальном проекте. Вы на каждом этапе называете правило: колонка в Entity, правило в DTO, дверь в Controller.'),
    c: rs('Внимание: в уроке ученика адрес записан как <b><code>/car</code></b> — на деле <b>404</b>; исправьте на <code>/api/v1/car</code>', 'Внимание, первая ошибка. В уроке ученика адрес везде без префикса, просто car, и в списке практики тоже: откройте в браузере car, будет 200. На деле это 404. Перед уроком скажите ученикам: адрес api v1 car.'),
    d: rs('Из 90 минут <b>20 уходят на реальный проект</b> — там ученики спотыкаются чаще всего', 'План по времени, предложение: девяносто минут. Вступление и план пятнадцать, пять этапов сорок, агент и поиск ошибки десять, реальный проект двадцать, итог пять. Чаще всего спотыкаются на реальном проекте: не идите дальше, пока route car не работает у всех.'),
    e: rs('Вывод: урок ученика говорит <b>«5 файлов»</b> — считает DTO одним; застрявшему помогите таблицей из практики 2', 'Вывод: урок ученика говорит «пять файлов», два DTO он считает одним, это не ошибка. Ученику, застрявшему в реальном проекте, вы поможете таблицей из второй практики: там каждое сообщение и его решение.'),
  },
});
ru(DICT2, [
  ['чертёж стеллажа', null, 'форма таблицы'],
  ['бланк заказа · копия бланка', null, 'правила входных данных'],
  ['контролёр останавливает → 400', null, 'нарушено правило DTO'],
  ['готовая книга рецептов · показывает склад', null, 'готовый CRUD · какая таблица'],
  ['кладовщик', null, 'работа с таблицей'],
  ['официант · дверь', null, 'принимает запрос'],
  ['табличка у входа — незаписанного отдела не видно → 404', null, 'список'],
  ['охранник · 🔒 только admin · 🌐 все', null, 'токен и роль'],
  ['ярлык — много книг на одном ярлыке, ярлык в книге', null, 'categoryId в таблице книг'],
]);
ru(S25, {
  kicker: 'Этап 6 · мост', title: 'Язык ученика: чертёж стеллажа, бланк, книга рецептов…',
  segments: {
    a: rs('Уроки ученика говорят <b>языком ресторана</b> — вы называете оба языка вместе', 'Перед вторым уроком — о языке. Уроки ученика, как и первый урок по Nest, говорят языком ресторана. Вы знаете оба языка и в классе называете их вместе.'),
    b: rs('Entity называют <b>чертежом стеллажа</b>, DTO — <b>бланком заказа</b>, а 400 — это контролёр остановил', 'Entity — чертёж стеллажа. DTO — бланк заказа, Partial type — его копия. Нарушено правило бланка, и контролёр останавливает, 400.'),
    c: rs('Остальные слои на языке кухни: <b>книга рецептов</b>, кладовщик, официант и <b>табличка у входа</b>', 'Base service — готовая книга рецептов, строка super показывает склад. Repository — кладовщик. Controller — официант, каждый route — дверь. Module — табличка у входа: отдела, которого нет на табличке, не видно, 404.'),
    d: rs('Вывод: в KitobShop охранник и ярлык; называйте <b>оба слова вместе</b> — «чертёж стеллажа, то есть Entity»', 'В KitobShop ещё два слова: охранник, это Guard; ярлык, это связь книги с категорией. Вывод: называйте оба слова вместе, например чертёж стеллажа, то есть Entity. Метафора объясняет задачу, а не код.'),
  },
});
ru(MAP04, ['вступление', 'план · 3 ресурса, Copilot Agent', 'Практика 1 — точная команда', 'Практика 2 — 3 playbook: Category → Book → Order', 'Практика 3 — @Roles: какая дверь открыта', "Практика 4 — проверка двери: POST /order → 'public'", 'тест', 'подиум', 'итог']);
ru(PREP04, [
  ['signin и Authorize', 'в уроках ученика не изучаются — сделайте с классом то, что делали на экране 19'],
  ['у каждого ученика обычный админ', "в playbook @Roles('admin'): с superadmin 403 — создать через superadmin админа и проверять KitobShop под ним"],
  ['категория раньше книги', 'с несуществующей категорией 500 (foreign key), при неверном формате id 400'],
]);
ru(S26, {
  kicker: 'Этап 6 · мост', eyebrow: 'm4a-04 · «Практика — бэкенд KitobShop»', title: 'KitobShop: ученик командует, агент пишет — ваша подготовка',
  segments: {
    a: rs('m4a-04 — <b>три ресурса с агентом</b>: ученик командует, проверяет и только потом принимает', 'Второй урок m4a-04, KitobShop. Пять шагов теперь делает агент Copilot, для трёх ресурсов: категория, книга и заказ. Ученик не пишет: он командует, сверяет результат со списком проверки и только после этого принимает.'),
    b: rs('Внимание: уроки ученика <b>не учат токену и Authorize</b> — в начале урока покажете вы', 'Внимание, вторая ошибка. В KitobShop есть закрытые двери, они требуют токен. Но ни в одном уроке ученика signin, токен и Authorize не изучаются. В начале урока сделайте с учениками то, что было в третьей практике: signin и Authorize.'),
    c: rs("Внимание: в playbook <code>@Roles('admin')</code> — <b>с superadmin 403</b>; пусть каждый ученик сначала создаст обычного админа", 'Третья ошибка. В playbook на закрытых дверях указан только admin. Ученик, вошедший как superadmin, не сможет добавить книгу и получит 403. Решение: перед уроком каждый ученик создаёт через superadmin обычного админа и проверяет KitobShop под ним.'),
    d: rs('Новое — <b><code>ManyToOne</code></b>: книга связана с категорией; нет категории — 500, неверный id — 400', 'Новое на уроке: связь книги с категорией, ManyToOne. В таблице книг появляется колонка с id категории и внешний ключ. Мы проверили: с несуществующей категорией 500, в терминале violates foreign key constraint. При неверном формате id 400. Сначала категория, потом книга.'),
    e: rs('Вывод: до урока три вещи — <b>signin и Authorize</b>, <b>обычный админ</b>, категория раньше книги', 'Вывод: перед KitobShop подготовьте три вещи: показать signin и Authorize, обычный админ у каждого ученика и создание категории раньше книги. Время, предложение: сорок минут из девяноста уходят на три playbook, это самая рискованная часть, потому что агент должен заработать у всех.'),
  },
});
ru(STUMBLE2, [
  ['/car из урока ученика', null, 'адрес /api/v1/car'],
  ['Не может войти', '401 Admin not fount · в базе superadmin без имени', 'блок Superadmin в .env; если создан пустым — удалить строку и перезапустить'],
  ['Ресурс не виден', 'нет Mapped + 404 · или can\'t resolve … "CarEntityRepository"', 'imports в app.module.ts · forFeature'],
  ['Числовой id', null, 'id — это uuid из ответа'],
  ['Токен и роль', null, 'Authorize · список @Roles (superadmin и admin — разные роли)'],
  ['Изменилась Entity', 'column "…" contains null values · данные тихо пропали', 'новая колонка nullable: true · спросите, что изменили в Entity'],
]);
ru(QA2, [
  ['Почему id не число?', 'uuid — уникальная строка, её не угадать, и две записи с двух серверов одновременно не столкнутся; написан один раз в BaseEntity.'],
  ['Почему ответ внутри data?', 'successRes: любой успех одной формы, фронтенд всегда читает data; ошибка — error.message.'],
  ['Что за Danggg в терминале?', 'console.log в фильтре ошибок, след автора проекта; не ошибка.'],
  ['Почему в ответе виден hashed_password?', 'all/admin возвращает все колонки Entity; в постраничном GET /api/v1/admin select берёт только id, username, is_active — так пароль и скрывают.'],
]);
ru(S27, {
  kicker: 'Этап 6 · в классе', title: '6 случаев, которые точно будут в классе, и готовые ответы',
  segments: {
    a: rs('Шесть случаев, которые <b>точно</b> будут в классе, — все вы сегодня видели сами', 'Оба урока вы знаете. Теперь места, где план ломается: шесть случаев, которые в классе будут обязательно. Все вы сегодня видели сами, поэтому коротко.'),
    b: rs('Адрес <code>/car</code> даёт <b>404</b>; не может войти — причина в <code>.env</code> и пустой строке superadmin', 'Первый: car из урока ученика, 404, адрес api v1 car. Второй: ученик не может войти. Проверьте блок superadmin в env; если superadmin создан пустым, удалите строку в базе и перезапустите сервер.'),
    c: rs('Ресурс не виден — проверьте AppModule или <code>forFeature</code>; 500 — формат <b>uuid</b>', "Третий: ресурс не виден. Нет строки Mapped, значит, главный модуль; can't resolve и Repository, значит, forFeature. Четвёртый: car 1, 500, потому что id это uuid: нужно скопировать id из ответа."),
    d: rs('401 — Authorize, 403 — <b>роль</b>, упал сервер — поставьте новой колонке <code>nullable</code>', 'Пятый: 401, Authorize; 403, этой роли нет в списке Roles, чаще всего вошли как superadmin. Шестой: в Entity добавили обязательную колонку и сервер упал, сделайте колонку необязательной.'),
    e: rs('Вывод: ошибка — сначала смотрите на <b>статус</b>, он говорит, из какого слоя пришла ошибка', 'Вывод и способ: при ошибке сначала смотрите на статус. 404 — адрес или модуль, 400 — DTO, 401 и 403 — Guard, 500 — терминал. Не говорите ответ, читайте сообщение вместе с учеником. В карточках ниже готовые ответы на вопросы учеников.'),
  },
});
ru(FINAL, [
  { q: 'В каком файле проекта ученика запускается сервер?', e: 'main.ts только вызывает Aplication.main(); сервер — в app.service.ts.' },
  { q: 'POST /api/v1/car отправлен с пустым {}. Ответ?', o: ['201, создаётся пустая машина', '404, route не найден', '500, ошибка сервера', '400, список нарушенных правил'], e: 'Глобальный ValidationPipe проверяет правила DTO.' },
  { q: 'GET /api/v1/car/1 — что будет?', o: ['500, в терминале ошибка uuid', '404, машина не найдена', '200, первая машина', '400, нарушено правило DTO'], e: '«1» не uuid, база выдаёт ошибку, фильтр превращает её в 500.' },
  { q: 'Отправлен GET /api/v1/admin без токена. Ответ?', o: ['403, не хватает роли', '404, route нет', '401, нет токена', '200, список админов'], e: 'AuthGuard: нет Authorization → 401.' },
  { q: 'В Entity у price убрали @Column, сервер перезапустили. Что будет?', o: ['Сервер упадёт с ошибкой', 'Колонка тихо удалится из базы', 'Колонка останется в базе как была', 'Ошибку даст только DTO'], e: 'synchronize подгоняет базу под Entity — колонка удаляется, сообщения нет.' },
  { q: 'Ученик по m4a-03 открыл localhost:3000/car — 404, в терминале 5 строк Mapped для car. Что скажете?', o: ['Адрес должен быть /api/v1/car', 'Подключите CarModule к AppModule', 'Перезапустите сервер', 'Вставьте токен в Authorize'], e: 'Mapped есть — route есть; в уроке ученика не указан префикс.' },
  { q: 'KitobShop: POST /book с токеном superadmin — 403. Что скажете ученику?', o: ['Сделайте signin заново, токен истёк', 'Вставьте токен в Authorize ещё раз', 'Подключите BookModule к AppModule', 'Создайте обычного админа и войдите под ним'], e: "@Roles('admin') — superAdmin нет в списке; токен действующий, поэтому 403." },
  { q: 'Ученик заполнил .env потом, но не может войти; в базе superadmin без имени. Что сделаете?', o: ['Ещё раз сохраните .env', 'Перезапустите сервер дважды', 'Удалите эту строку в базе и перезапустите', 'Смените USER_NAME на другое имя'], e: 'Если superadmin уже есть, onModuleInit нового не создаёт.' },
]);
ru(SUM2, [
  { t: 'Проект ученика: сервер в app.service.ts, адрес /api/v1, ответ в data, ошибка в error.message, настройки из .env' },
  { t: 'Ресурс — 5 слоёв: Entity · DTO · Service (BaseService + Repository) · Controller · Module (+ core/index.ts, AppModule)' },
  { t: '400 — правило DTO или лишнее поле; 500 — читайте терминал (/car/1 — id это uuid)' },
  { t: '401 — нет токена; 403 — роли нет в списке; superadmin и admin — разные роли' },
  { t: 'Изменилась Entity — меняется база: колонка тихо удаляется, обязательная колонка роняет сервер' },
  { t: 'В уроках ученика 3 ошибки: /car → /api/v1/car · токен и Authorize показываете вы · перед KitobShop обычный админ' },
]);
ru(HOMEWORK2, [
  { t: 'ресурс brand — 5 этапов: brand.entity.ts (name, country) + core/index.ts · dto/ · brand.service.ts · brand.controller.ts (4 двери) · brand.module.ts + AppModule' },
  { t: 'Swagger: POST /api/v1/brand → 201 · пустой name → 400 name should not be empty…' },
  { t: "car → brand: в car.entity.ts @ManyToOne(() => BrandEntity) + @JoinColumn({ name: 'brandId' }) + @Column({ nullable: true }) brandId — сервер запускается, в cars есть brandId и внешний ключ" },
  { t: "Сломайте специально: уберите forFeature из brand.module.ts → «can't resolve dependencies of the BrandService (?)» → верните" },
  { t: 'Выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе', c: ['git add . && git commit -m "ресурс brand"', null] },
]);
// 29-ekran: segmentlar render paytida yig'iladi (o'tgan/o'tmagan) — ruschasi id bo'yicha, s29Ru() qo'yadi
const S29_RU = {
  a_pass: rs('<b>Отлично!</b> Вы хорошо прошли урок — соберём сегодняшний урок одним взглядом', 'Отлично! Вы хорошо прошли урок. Теперь соберём всё, что узнали сегодня, одним взглядом.'),
  a_fail: rs('Вы дошли до конца урока — советую <b>пройти тест заново</b>', 'Вы дошли до конца урока. В итоговом тесте нужно было шесть баллов, перед завершением советую пройти тест заново. А сейчас соберём сегодняшний урок одним взглядом.'),
  b1: rs('Проект ученика: сервер в <b>app.service.ts</b>, адрес <b>/api/v1</b>, одна форма ответа', 'Первое: в проекте ученика сервер запускается в файле app service ts, адрес начинается с api v1, ответ внутри data, ошибка внутри error message, настройки из env.'),
  b2: rs('Ресурс — <b>5 слоёв</b>: Entity, DTO, Service, Controller, Module', 'Второе: ресурс — пять слоёв. Entity, DTO, Service с наследованием от Base service, Controller и Module, плюс core index и главный модуль.'),
  b3: rs('<b>400</b> — правило DTO; <b>500</b> — читайте терминал', 'Третье: 400 приходит от правила DTO, при 500 причина в терминале, например потому что id это uuid.'),
  b4: rs('<b>401</b> — нет токена, <b>403</b> — нет роли; superadmin и admin — разные роли', 'Четвёртое: 401, нет токена, 403, роли нет в списке. Superadmin и admin — разные роли.'),
  b5: rs('Изменилась Entity — <b>меняется база</b>: тихо или с падением', 'Пятое: изменилась Entity, меняется и база. Убрали колонку, данные тихо удаляются, добавили обязательную, сервер падает.'),
  b6: rs('В уроках ученика <b>3 ошибки</b> — в классе их исправляете вы', 'Шестое, самое важное для класса: в уроках ученика три ошибки. Вместо car — api v1 car, токен и Authorize показываете вы, перед KitobShop обычный админ.'),
  hw: rs('<b>Домашнее задание</b>: ресурс brand, связь car с brand и одна поломка с исправлением', 'Домашнее задание. Добавьте в свой проект ресурс brand, ровно домашнее задание ученика: name и country, правила DTO, наследование от Base service, четыре двери и главный модуль. Потом свяжите car с brand, новая колонка пусть будет необязательной. Один раз специально уберите forFeature, прочитайте сообщение и исправьте.'),
  hw2: rs('Сдача: вставьте ссылку на репозиторий GitHub <b>в домашнее задание на платформе</b> — больше ничего не нужно', 'Выложите на GitHub и вставьте ссылку на репозиторий в домашнее задание на платформе, больше ничего не нужно. Сорок-шестьдесят минут.'),
  c: rs('<b>Возьмите памятку</b>: .env, отличия, 5 слоёв, статусы, 3 ошибки — на одной странице', 'Внизу памятка на одну страницу: список env, отличия, пять слоёв, таблица статусов, правила Guard и три ошибки в уроках ученика. Скопируйте или скачайте, пусть будет под рукой в классе.'),
  z: rs('Спасибо! Нажмите кнопку <b>«Завершить урок»</b>', 'Спасибо. Нажмите кнопку «Завершить урок», урок будет отмечен как пройденный.'),
};
const CHEATSHEET2_RU = `# Nest-2 — памятка ментора (репозиторий ученика IntroNestArxitechture)
## Запуск
git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git · npm install · cp .env.example .env · createdb -U postgres nestarxitechture · npm run start:dev → localhost:3000/api/v1 (Swagger)
## .env — три блока
DEV_DB_URL (пароль, nestarxitechture) · NODE_ENV=dev (другое → база prod, таблицы не создаются) · Access_Token_Key · Superadmin: USER_NAME, FULL_NAME, PHONE, PASSWORD (надёжный)
Если superadmin создан пустым: DELETE FROM admins WHERE role='superAdmin'; → снова npm run start:dev → «Super admin created successfully»
## Отличия от cars-api
сервер: src/api/app.service.ts → Aplication.main() (main.ts только вызывает) · префикс /api/v1 · успех {statusCode, message:'success', data} · ошибка {statusCode, error:{message}} · обычный Error → 500, причина в терминале («Danggg» — console.log)
## Ресурс — 5 слоёв, 6 файлов + 2 правки
src/core/entity/car.entity.ts (+ export в core/index.ts) · src/api/car/dto/create-car.dto.ts · update-car.dto.ts (PartialType из @nestjs/swagger) · car.service.ts (extends BaseService, super(carRepo)) · car.controller.ts (findOneById) · car.module.ts (forFeature) + imports в AppModule
## Таблица статусов
400 правило DTO / лишнее поле («property … should not exist») · 401 нет токена (Authorize) · 403 роли нет в списке · 404 адрес (/api/v1) или модуль (нет Mapped) · 500 читайте терминал (/car/1 → invalid input syntax for type uuid; ParseUUIDPipe → 400)
## Guard
'public' — все · @Roles не указан — вошедшие в систему · 'ID' — своя запись · superAdmin и admin — разные роли (@Roles('admin') → superadmin 403) · токен 24 часа, истёк — снова signin (/admin/token просроченный не восстанавливает)
## Ловушки synchronize
убрали @Column — колонка тихо удаляется из базы · обязательная колонка в таблице с данными → «contains null values» → nullable: true
## 3 ошибки в уроках ученика
m4a-03: /car → /api/v1/car · токен/Authorize не изучаются — показываете вы · m4a-04: перед KitobShop обычный админ
## Язык ученика
чертёж стеллажа=Entity · бланк=DTO · контролёр=ValidationPipe · книга рецептов=BaseService · кладовщик=Repository · официант=Controller · табличка у входа=Module · охранник=Guard · ярлык=@ManyToOne
## Ваше домашнее задание
ресурс brand + car → brand (@ManyToOne, brandId nullable) + сломать и исправить forFeature → GitHub → ссылка на репозиторий в домашнее задание на платформе`;
