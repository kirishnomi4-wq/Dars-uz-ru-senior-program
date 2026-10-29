// ============================================================
//  MENTOR KURSI · 1-dars «NestJS arxitekturasi: Module, Controller, Service»
//  F-1029-02 · ovozli, segment-sinxron dars. YIG'ILGAN FAYL — manba: parts/01…06
//  (yig'ish: cat parts/*.jsx > NestArchMentorLesson.jsx). Platforma SDK: bitta .jsx,
//  import faqat react + '@lesson/runtime' (LESSON_PROMPT_WITH_UNLOCK.md).
//  Metodika: chapda USTOZ GAPI (faqat hozirgi segment), o'ngda SAHNA; segment = qadam:
//  element kiradi / yoritiladi / xiralashadi; ovoz tugagach «Davom» yonadi.
// ============================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAudio, useSfx, useNextLessonAccess } from '@lesson/runtime';

const LESSON_ID = 'mentor-nest-01-arxitektura-v1';
const UZ = "[O'zbekcha tallaffuz] ";

const T = {
  bg: '#F5F6F8', paper: '#FFFFFF', ink: '#0F1115', ink2: '#4B5162', ink3: '#8A90A2', line: '#E3E6EC',
  accent: '#E2451F', blue: '#0E7FB8', green: '#12805A', yellow: '#B57A00', purple: '#6D3BE4',
  code: '#0F1115', codeInk: '#E8EAF0', codeDim: 'rgba(232,234,240,0.38)', codeHl: 'rgba(226,69,31,0.16)',
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
.mk-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(320px,5fr) 7fr;gap:28px;padding:22px 28px}
@media (max-width:900px){.mk-body{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:14px;padding:14px}}
.mk-say{display:flex;flex-direction:column;min-height:0}
.mk-eyebrow{font:600 11px/1 ${MONO};letter-spacing:.12em;text-transform:uppercase;color:${T.accent};margin:0 0 10px}
.mk-title{font-size:clamp(20px,2.2vw,28px);line-height:1.2;font-weight:800;margin:0 0 18px;letter-spacing:-.01em}
.mk-cap{flex:1;min-height:0;display:flex;flex-direction:column}
.mk-key{font-size:clamp(22px,2.1vw,30px);line-height:1.25;font-weight:700;color:${T.ink};margin:0;letter-spacing:-.01em;animation:mk-up .45s ease both}
.mk-key b{color:${T.accent}}
.mk-key code{font:0.85em ${MONO};background:#EEF0F4;padding:1px 7px;border-radius:6px;font-weight:600}
.mk-tr{margin:0;padding:0;list-style:none;display:grid;gap:8px;max-height:52vh;overflow:auto;padding-right:6px}
.mk-input{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid ${T.line};border-radius:8px;font:13px/1.4 ${MONO};background:#fff;color:${T.ink}}
.mk-input:focus{outline:2px solid ${T.accent};outline-offset:1px}
.mk-tr li{font-size:14px;line-height:1.5;color:${T.ink3};padding:6px 10px;border-radius:8px;border-left:3px solid transparent}
.mk-tr li.on{color:${T.ink};background:#FFF7F3;border-left-color:${T.accent}}
.mk-tr li.done{color:${T.ink2}}
.mk-tr code{font:0.92em ${MONO};background:#EEF0F4;padding:0 5px;border-radius:5px}
.mk-ask{margin-top:18px;padding:14px 16px;border:1.5px solid ${T.accent};border-radius:12px;background:#FFF7F3;animation:mk-up .4s ease both}
.mk-ask p{margin:0 0 10px;font-weight:600}
.mk-ask .row{display:flex;gap:10px;flex-wrap:wrap}
.mk-ask .res{margin-top:10px;font-size:14px;color:${T.ink2}}
.mk-now{font-size:clamp(17px,1.45vw,21px);line-height:1.6;color:${T.ink};margin:0;animation:mk-up .45s ease both}
.mk-now b{color:${T.accent};font-weight:700}
.mk-now code,.mk-prev code{font:0.92em ${MONO};background:#EEF0F4;padding:0 5px;border-radius:5px}
.mk-dots{display:flex;gap:6px;margin:16px 0 0}
.mk-dots i{width:22px;height:4px;border-radius:2px;background:${T.line};display:inline-block;transition:background .3s}
.mk-dots i.on{background:${T.accent}}
.mk-dots i.done{background:${T.ink3}}
.mk-below{margin-top:18px}
.mk-scene{min-height:0;display:flex;flex-direction:column;justify-content:center;gap:14px}
.mk-scene.top{justify-content:flex-start}
.mk-panel{flex:0 1 auto;max-height:100%;min-height:0;background:${T.code};color:${T.codeInk};border-radius:16px;padding:18px 20px;font:13px/1.55 ${MONO};overflow:auto;position:relative;box-shadow:0 10px 30px rgba(15,17,21,.12)}
.mk-panel .fn{position:absolute;top:10px;right:14px;font-size:11px;color:${T.codeDim};letter-spacing:.06em}
.mk-ln{display:flex;gap:14px;padding:1px 8px;border-radius:6px;white-space:pre;opacity:0;transform:translateY(6px);transition:opacity .35s,transform .35s,background .35s}
.mk-ln.in{opacity:1;transform:none}
.mk-ln.dim{opacity:.38}
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
.mk-btn.ready{background:${T.accent};border-color:${T.accent};animation:mk-pulse 1.6s ease-in-out infinite}
.mk-audio{display:flex;align-items:center;gap:6px}
.mk-audio button{background:transparent;border:1px solid ${T.line};border-radius:8px;padding:5px 8px;cursor:pointer;color:${T.ink2};font:12px/1 ${SANS};display:inline-flex;align-items:center;gap:6px}
.mk-audio .live{color:${T.accent};border-color:${T.accent}}
.mk-bars{display:inline-flex;gap:2px;align-items:flex-end;height:12px}
.mk-bars i{width:3px;background:currentColor;border-radius:1px;animation:mk-eq .9s ease-in-out infinite}
.mk-bars i:nth-child(2){animation-delay:.15s}.mk-bars i:nth-child(3){animation-delay:.3s}
.mk-in{opacity:0;transform:translateY(8px);transition:opacity .4s,transform .4s}
.mk-in.on{opacity:1;transform:none}
.mk-in.dim{opacity:.35}
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
const HELP_ROW = ['Hech biri emas', "Skrinshot + xato matnini mentor-kurs Telegram guruhiga yuboring; darsni to'xtatmang, keyingi ekranga o'ting"];
const vis = (at, beat) => at == null || at <= beat;

// useAudio(segments) → currentId. Qadam faqat oldinga o'sadi. `ask` segmenti: ovoz savol beradi va
// tugma bosilguncha kutadi (waits_for button_click/step) — bashorat.
function useBeats(segments) {
  const segs = useMemo(() => segments.map((s, i) => ({ id: s.id, text: UZ + s.text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: s.ask ? { type: 'button_click', target: 'step' } : s.waits_for })), [segments]);
  const audio = useAudio(segs);
  const [beat, setBeat] = useState(0);
  const [done, setDone] = useState(false);
  const [guess, setGuess] = useState({});
  const started = useRef(false);
  useEffect(() => {
    const i = segments.findIndex((s) => s.id === audio.currentId);
    if (i >= 0) { started.current = true; setBeat((b) => Math.max(b, i)); }
  }, [audio.currentId, segments]);
  useEffect(() => {
    if (!audio.isPlaying && !audio.waitingFor && started.current && beat >= segments.length - 1) setDone(true);
  }, [audio.isPlaying, audio.waitingFor, beat, segments.length]);
  const stepManual = useCallback(() => { setBeat((b) => { const n = Math.min(b + 1, segments.length - 1); if (n === segments.length - 1) setDone(true); return n; }); }, [segments.length]);
  // Bashorat: tugma ovoz paytida ham bosiladi; runtime hali kutmayotgan bo'lsa, kutishga o'tganda yuboriladi
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

function AudioChip({ audio }) {
  return (
    <div className="mk-audio">
      <button className={audio.isPlaying ? 'live' : ''} onClick={audio.toggleMute} title={audio.muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}>
        {audio.isPlaying ? <span className="mk-bars"><i /><i /><i /></span> : <span>{audio.muted ? '🔇' : '🔈'}</span>}
        {audio.muted ? "o'chiq" : (audio.isPlaying ? 'ustoz gapiryapti' : 'ovoz')}
      </button>
      <button onClick={audio.replay} title="Qaytarish">↺</button>
    </div>
  );
}

function Stage({ kicker, idx, total, audio, children, onBack, onNext, nextReady, nextDisabled, nextLabel = 'Davom', extra }) {
  return (
    <div className="mk-stage">
      <div className="mk-head">
        <div className="mk-prog"><div style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
        <div className="mk-chrome">
          <div className="mk-kicker"><i />{kicker}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {audio && <AudioChip audio={audio} />}
            <span className="mk-count">{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      {children}
      <div className="mk-nav">
        {onBack ? <button className="mk-btn ghost" onClick={onBack}>← Orqaga</button> : <span />}
        {extra}
        <button className={`mk-btn${nextReady && !nextDisabled ? ' ready' : ''}`} disabled={!!nextDisabled} style={{ marginLeft: 'auto' }} onClick={onNext}>{nextLabel} →</button>
      </div>
    </div>
  );
}

// Chap ustun: sarlavha + KALIT IBORA (hozirgi segment) + qadam chiziqchalari + «Matn» (butun transkript) + bashorat
function Say({ eyebrow, title, segments, beat, audio, stepManual, below, guess, answerAsk }) {
  const now = segments[beat];
  const [tr, setTr] = useState(false);
  const showManual = audio.muted || (!audio.isPlaying && !audio.waitingFor && beat < segments.length - 1 && audio.status === 'idle' && !now.ask);
  const asking = now.ask && guess && guess[now.id] === undefined;
  const prevAsk = beat > 0 && segments[beat - 1].ask ? segments[beat - 1] : null;
  return (
    <div className="mk-say">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>{eyebrow && <p className="mk-eyebrow">{eyebrow}</p>}<h2 className="mk-title">{title}</h2></div>
        <button className="mk-btn soft sm" onClick={() => setTr((v) => !v)} title="Ustoz gapining to'liq matni">{tr ? 'Matnni yopish' : 'Matn'}</button>
      </div>
      <div className="mk-cap">
        {tr ? (
          <ul className="mk-tr">{segments.map((s, i) => <li key={s.id} className={i === beat ? 'on' : (i < beat ? 'done' : '')} dangerouslySetInnerHTML={html(s.show || digits(s.text))} />)}</ul>
        ) : (
          <p className="mk-key" key={now.id} dangerouslySetInnerHTML={html(now.key || now.show || digits(now.text))} />
        )}
        <div className="mk-dots">{segments.map((s, i) => <i key={s.id} className={i === beat ? 'on' : (i < beat ? 'done' : '')} />)}</div>
        {asking && (
          <div className="mk-ask"><p>{now.ask.q}</p><div className="row">{now.ask.opts.map((o, i) => <button key={i} className="mk-btn ghost sm" onClick={() => answerAsk(now.id, i)}>{o}</button>)}</div></div>
        )}
        {prevAsk && guess && guess[prevAsk.id] !== undefined && (
          <div className="mk-ask" style={{ borderColor: guess[prevAsk.id] === prevAsk.ask.answer ? T.green : T.ink3, background: guess[prevAsk.id] === prevAsk.ask.answer ? '#E3F5EC' : '#F0F2F5' }}>
            <div className="res">Sizning bashoratingiz: <b>{prevAsk.ask.opts[guess[prevAsk.id]]}</b> — {guess[prevAsk.id] === prevAsk.ask.answer ? "to'g'ri" : "aslida: " + prevAsk.ask.opts[prevAsk.ask.answer]}</div>
          </div>
        )}
        {showManual && <div style={{ marginTop: 14 }}><button className="mk-btn soft sm" onClick={stepManual}>Keyingi qadam →</button></div>}
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
  // Kichik ekran (1366×768 va past): panel ichida aylansa — yoritilgan yoki shu qadamda kirgan satr ko'rinib tursin
  useEffect(() => {
    const p = ref.current; if (!p || p.scrollHeight <= p.clientHeight + 4) return;
    const hls = Array.from(p.querySelectorAll('.mk-ln.hl'));
    const first = hls[0] || Array.from(p.querySelectorAll('.mk-ln.in')).filter((n) => n.dataset.at === String(beat)).pop();
    if (!first) return;
    const last = hls.length ? hls[hls.length - 1] : first;
    const top = first.offsetTop - 12, bottom = last.offsetTop + last.offsetHeight + 12, h = p.clientHeight;
    if (top >= p.scrollTop && bottom <= p.scrollTop + h) return;            // butun blok ko'rinib turibdi
    const want = (bottom - top > h || top < p.scrollTop) ? top : bottom - h; // sig'masa — boshidan; pastga chiqsa — oxirini ko'rsat
    p.scrollTo({ top: Math.max(0, want), behavior: 'smooth' });
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
  return <div className={`mk-in${vis(at, beat) ? ' on' : ''}${dim ? ' dim' : ''} ${className}`} style={style}>{children}</div>;
}

// Oddiy ekran qolipi: Say + sahna
function Lesson({ p, S, scene, below, ready }) {
  const b = useBeats(S.segments);
  const ok = ready ? ready(b) : true;
  return (
    <Stage kicker={S.kicker} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onNext} nextReady={b.done && ok} nextDisabled={b.done && !ok}>
      <div className="mk-body">
        <Say eyebrow={S.eyebrow} title={S.title} segments={S.segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} below={below ? below(b) : null} />
        <div className="mk-scene">{scene(b)}</div>
      </div>
    </Stage>
  );
}

// Tekshiruv (tanlov): xato variant yopiladi, to'g'risini topguncha bosadi
function MCRetry({ idx, total, onBack, onNext, stored, onAnswer, kicker, eyebrow, title, q, opts, correct, ok, okShort, wrong, above }) {
  const segs = useMemo(() => [{ id: 'q', text: UZ + q, trigger: 'on_mount', waits_for: { type: 'option_picked' } }], [q]);
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
      setTimeout(() => audio.pushOneOff(UZ + ok), 300);
    } else {
      const nb = [...bad, i]; setBad(nb); setLast(i); sfx.playWrong();
      setTimeout(() => audio.pushOneOff(UZ + (wrong[i] || 'Unday emas.') + " Yana o'ylab ko'ring."), 300);
    }
  };
  const fbOk = solved && last === correct;
  return (
    <Stage kicker={kicker} idx={idx} total={total} audio={audio} onBack={onBack} onNext={onNext} nextReady={solved} nextDisabled={!solved}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 860, width: '100%', margin: '0 auto' }}>
        <div className="mk-say" style={{ justifyContent: 'center' }}>
          <p className="mk-eyebrow">{eyebrow} · 1-urinish hisoblanadi</p>
          {above}
          <h2 className="mk-title" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{title}</h2>
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
              <b>{fbOk ? "To'g'ri" : "Unday emas — yana o'ylab ko'ring"}</b>
              <span>{fbOk ? (okShort || digits(ok)) : digits(wrong[last])}</span>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
}

// Tekshiruv (qaysi satr xato): kod ko'rsatiladi, mentor satrni bosadi, topguncha bosadi
function LineCheck({ idx, total, onBack, onNext, stored, onAnswer, kicker, eyebrow, title, q, file, lines, target, ok, okShort, hint }) {
  const targets = Array.isArray(target) ? target : [target];
  const segs = useMemo(() => [{ id: 'q', text: UZ + q, trigger: 'on_mount', waits_for: { type: 'option_picked' } }], [q]);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [bad, setBad] = useState(stored ? stored.bad || [] : []);
  const [solved, setSolved] = useState(!!(stored && stored.correct));
  const marks = {}; bad.forEach((i) => { marks[i] = 'bad'; }); if (solved) targets.forEach((t) => { marks[t] = 'good'; });
  const onLine = (i, l) => {
    if (solved || bad.includes(i) || !l.h.trim()) return;
    if (bad.length === 0) audio.triggerEvent('option_picked');
    if (targets.includes(i)) { setSolved(true); sfx.playCorrect(); onAnswer({ picked: i, correct: true, tries: bad.length + 1, firstTry: bad.length === 0, bad, type: 'mc' }); setTimeout(() => audio.pushOneOff(UZ + ok), 300); }
    else { setBad((b) => [...b, i]); sfx.playWrong(); setTimeout(() => audio.pushOneOff(UZ + hint), 300); }
  };
  return (
    <Stage kicker={kicker} idx={idx} total={total} audio={audio} onBack={onBack} onNext={onNext} nextReady={solved} nextDisabled={!solved}>
      <div className="mk-body">
        <div className="mk-say">
          <p className="mk-eyebrow">{eyebrow} · 1-urinish hisoblanadi</p>
          <h2 className="mk-title">{title}</h2>
          <p className="mk-now">Kodda bitta xato bor. Xato satrni bosing.</p>
          {(bad.length > 0 || solved) && (
            <div className="mk-fb" key={bad.length + (solved ? 'ok' : '')} style={{ '--c': solved ? T.green : T.accent, '--bg': solved ? '#E3F5EC' : '#FFF0EB' }}>
              <b>{solved ? "To'g'ri" : "Bu satr emas"}</b><span>{solved ? (okShort || digits(ok)) : digits(hint)}</span>
            </div>
          )}
        </div>
        <div className="mk-scene"><CodePanel file={file} lines={lines} onLine={solved ? undefined : onLine} marks={marks} /></div>
      </div>
    </Stage>
  );
}

// Amaliyot ekrani: qadamlar (katakcha, nusxalash), «boshqacha chiqsa» jadvali, ixtiyoriy kod ko'rinishi
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return <button className="mk-copy" onClick={() => { try { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); } catch (e) {} }}>{ok ? 'nusxalandi' : 'nusxalash'}</button>;
}
const plain = (lines) => lines.map((l) => l.h.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\\`/g, '`').replace(/\\\$/g, '$')).join('\n');
function Practice({ p, S, steps, trouble, code, proof }) {
  const b = useBeats(S.segments);
  const { seg, beat } = b;
  const [checked, setChecked] = useState(p.stored && p.stored.checked ? p.stored.checked : []);
  const [proofVal, setProofVal] = useState(p.stored && p.stored.proof ? p.stored.proof : '');
  const [showCode, setShowCode] = useState(false);
  const proofOk = !proof || proof.check(proofVal.trim());
  const report = (n, pv) => p.onAnswer({ type: 'practice', checked: n, proof: pv, proofOk: !proof || proof.check(pv.trim()), done: n.length === steps.length && (!proof || proof.check(pv.trim())) });
  const toggle = (i) => { const n = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i]; setChecked(n); report(n, proofVal); };
  const onProof = (v) => { setProofVal(v); report(checked, v); };
  const allDone = checked.length === steps.length && proofOk;
  const rows = trouble ? [...trouble, HELP_ROW] : [HELP_ROW];
  return (
    <Stage kicker={S.kicker} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onNext} nextReady={b.done && allDone}
      extra={code ? <button className={`mk-btn soft${showCode ? ' ready' : ''}`} onClick={() => setShowCode((v) => !v)}>{showCode ? 'Qadamlarga qaytish' : 'Kod'}</button> : null}>
      <div className="mk-body">
        <Say eyebrow={S.eyebrow} title={S.title} segments={S.segments} beat={beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk}
          below={<div className="mk-card" style={{ background: allDone ? '#E3F5EC' : T.paper, borderColor: allDone ? T.green : T.line }}><h5>Bajarildi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{checked.length} / {steps.length} qadam{proof ? (proofOk && proofVal.trim() ? ' · isbot ✓' : ' · isbot kutilmoqda') : ''}{allDone ? " — Davom bosing" : ''}</div>
            {proof && <div style={{ marginTop: 10 }}><div className="exp" style={{ marginBottom: 4 }}>{proof.label}</div><input className="mk-input" value={proofVal} placeholder={proof.placeholder} onChange={(e) => onProof(e.target.value)} />{proofVal.trim() && !proofOk && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{proof.wrong}</div>}</div>}
          </div>} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {showCode ? code.map((c) => <div key={c.file}><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 4, alignItems: 'center' }}>{c.copy === false ? <span className="mk-tag" style={{ margin: 0, color: T.accent }}>namuna — o'zingiz yozing, nusxalash yo'q</span> : <CopyBtn text={plain(c.lines)} />}<span style={{ fontSize: 12, color: T.ink3 }}>{c.file}</span></div><CodePanel file={c.file} lines={c.lines} style={{ fontSize: 12, marginBottom: 12 }} /></div>) : (<>
            <div style={{ display: 'grid', gap: 8 }}>
              {steps.map((s, i) => (
                <div key={i} className={`mk-step${(seg.hl || []).includes(i) ? ' hl' : ''}`} style={{ opacity: (seg.hl || []).length && !seg.hl.includes(i) ? 0.55 : 1 }}>
                  <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} />
                  <div className="t"><b>{i + 1}. {s.t}</b>
                    {s.cmds.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}
                    <div className="exp">Kutilgan: {s.exp}</div>
                  </div>
                </div>
              ))}
            </div>
            <Block at={S.tableAt} beat={beat}><div className="mk-light" style={{ padding: 12, marginTop: 10 }}>
              <div className="mk-tag">Boshqacha chiqdimi?</div>
              <table className="mk-tbl"><tbody>{rows.map(([a, c]) => <tr key={a}><td><code>{a}</code></td><td>{c}</td></tr>)}</tbody></table>
            </div></Block>
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  1–2-BOSQICH · S1–S5b
//  Ovoz qoidasi: kod o'qilmaydi, nima bo'layotgani aytiladi; «/» va «@» so'z bilan.
// ============================================================
const S1 = {
  kicker: 'Kirish', eyebrow: 'Mentor kursi · 1-dars', title: "Siz Express'ni bilasiz. Endi Nest.",
  plan: ['Nega Nest', "Uch bo'lak: Controller · Service · Module", 'Dependency Injection', 'cars manzilini quramiz', "Buzamiz va xatoni o'qiymiz", "Amaliyot (to'rt bo'lak)", "O'quvchi darsiga ko'prik"],
  segments: [
    { id: 'a', key: "Express bilimingiz ustiga <b>Nest</b> qo'yamiz", text: "Assalomu alaykum. Siz Express bilan server yozgansiz: marshrut ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi.", hl: [] },
    { id: 'b', key: "Dars oxirida: <b>ishlaydigan server</b>", text: "Dars oxirida siz bo'sh papkadan boshlab mashinalar ro'yxatini qaytaradigan server qurasiz.", hl: [3] },
    { id: 'c', key: "Nest xatolarini <b>o'qiy olasiz</b>", text: "Nest'ning xato xabarlarini o'qiy olasiz: kim, nima yetishmayapti, qayerda.", hl: [4] },
    { id: 'd', key: "O'quvchi darsining <b>tilini</b> bilasiz", text: "Va o'quvchi darsida qaysi so'z nimani anglatishini bilasiz.", hl: [6] },
    { id: 'e', key: "Yetti bosqich. Shoshilmang.", text: "Dars yetti bosqichdan iborat. Shoshilmang: har ekranda ovozni to'xtatish, qaytarish va matnini o'qish mumkin. Tayyor bo'lsangiz, Davom tugmasini bosing.", hl: [] },
  ],
};
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div className="mk-light"><div className="mk-plan">
    {S1.plan.map((t, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{t}</span></div>)}
  </div></div>} />;
}

// --- S2 Express: 38 qator → o'sgan loyiha (misol) ---
const EXPRESS_LINES = [
  { h: `<span class="k">const</span> express = <span class="c">require</span>(<span class="s">'express'</span>);` },
  { h: `<span class="k">const</span> app = <span class="c">express</span>();` },
  { h: `app.<span class="c">use</span>(express.<span class="c">json</span>());` },
  { h: `<span class="k">let</span> cars = [{ id: <span class="d">1</span>, brand: <span class="s">'Chevrolet'</span>, model: <span class="s">'Malibu'</span> }];` },
  { h: `` },
  { id: 'route1', h: `app.<span class="c">get</span>(<span class="s">'/cars'</span>, (req, res) => {` },
  { id: 'route1', h: `  res.<span class="c">json</span>(cars);` },
  { id: 'route1', h: `});` },
  { id: 'route2', h: `app.<span class="c">get</span>(<span class="s">'/cars/:id'</span>, (req, res) => {` },
  { id: 'route2', h: `  <span class="k">const</span> car = cars.<span class="c">find</span>(c => c.id === <span class="c">Number</span>(req.params.id));` },
  { id: 'route2', h: `  <span class="k">if</span> (!car) <span class="k">return</span> res.<span class="c">status</span>(<span class="d">404</span>).<span class="c">json</span>({ message: <span class="s">'topilmadi'</span> });` },
  { id: 'route2', h: `  res.<span class="c">json</span>(car);` },
  { id: 'route2', h: `});` },
  { id: 'route3', h: `app.<span class="c">post</span>(<span class="s">'/cars'</span>, (req, res) => {` },
  { id: 'route3', h: `  <span class="k">const</span> car = { id: cars.length + <span class="d">1</span>, ...req.body };` },
  { id: 'route3', h: `  cars.<span class="c">push</span>(car);` },
  { id: 'route3', h: `  res.<span class="c">status</span>(<span class="d">201</span>).<span class="c">json</span>(car);` },
  { id: 'route3', h: `});` },
  { h: `` },
  { h: `app.<span class="c">listen</span>(<span class="d">3000</span>);` },
];
const GROWN_LINES = [
  { n: 212, h: `app.<span class="c">post</span>(<span class="s">'/auth/register'</span>, <span class="k">async</span> (req, res) => {` },
  { n: 213, h: `  <span class="k">const</span> hash = <span class="k">await</span> bcrypt.<span class="c">hash</span>(req.body.password, <span class="d">10</span>);` },
  { n: 214, h: `  <span class="cm">// ... 40 qator tekshiruv</span>` },
  { n: 588, h: `app.<span class="c">post</span>(<span class="s">'/orders'</span>, upload.<span class="c">single</span>(<span class="s">'file'</span>), <span class="k">async</span> (req, res) => {` },
  { n: 589, h: `  <span class="cm">// ... to'lov, email, baza — hammasi shu yerda</span>` },
  { n: 990, id: 'login', h: `<span class="cm">// login qayerda??? 1000 qator pastda...</span>` },
  { n: 1187, h: `app.<span class="c">post</span>(<span class="s">'/auth/login'</span>, <span class="k">async</span> (req, res) => {` },
  { n: 1240, h: `app.<span class="c">listen</span>(<span class="d">3000</span>);` },
];
const S2 = {
  kicker: '1-bosqich · Nega Nest', title: "Express: tanish manzara va og'riq",
  segments: [
    { id: 'a', key: "Tanish fayl: <code>server.js</code>", text: "Mana sizga tanish fayl. Express, bitta server js.", focus: [] },
    { id: 'b', key: "Ro'yxat: <b>GET /cars</b>", text: "cars manziliga GET kelsa, ro'yxatni qaytaramiz.", show: "<code>/cars</code> manziliga GET kelsa, ro'yxatni qaytaramiz.", focus: ['route1'] },
    { id: 'c', key: "Bittasi: <b>GET /cars/:id</b>", text: "cars manzilidan keyin id kelsa, bittasini qidiramiz.", show: "<code>/cars/:id</code> kelsa, bittasini qidiramiz.", focus: ['route2'] },
    { id: 'd', key: "Yangisi: <b>POST /cars</b>. 38 qator, muammo yo'q", text: "POST kelsa, yangisini qo'shamiz. Hammasi o'ttiz sakkiz qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", show: "<code>POST /cars</code> kelsa, yangisini qo'shamiz. Hammasi 38 qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", focus: ['route3'] },
    { id: 'e', key: "Loyiha o'sdi: <b>1240 qator</b> (shartli misol). Login qayerda?", text: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar qo'shildi, kirish va ro'yxatdan o'tish qo'shildi, buyurtmalar, to'lov, fayl yuklash. Mana shartli misol, haqiqiy loyiha emas: fayl ming ikki yuz qirq qator deylik. Login qayerda edi? Qidirasiz.", show: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar, kirish, buyurtmalar, to'lov, fayl yuklash. Mana <b>shartli misol</b> (haqiqiy loyiha emas): fayl <b>1240 qator</b>. Login qayerda edi? Qidirasiz.", focus: ['login'], grow: true },
    { id: 'f', key: "Sinab bo'lmaydi, to'qnashuv. <b>Nest shu og'riq uchun</b>", text: "Bitta marshrut ichida ham so'rovni o'qish, ham tekshirish, ham bazaga yozish bor. Shu bo'lakni alohida sinab bo'lmaydi, chunki u marshrutdan ajralmagan. Ikki kishi bir faylda ishlasa, har kuni to'qnashuv. Siz buni his qilgansiz. Nest aynan shu og'riq uchun yaratilgan. O'quvchi darsi ham aynan shu misoldan boshlanadi.", focus: [], grow: true },
  ],
};
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => {
    const grown = !!seg.grow;
    const lines = grown ? [...EXPRESS_LINES.slice(0, 6).map((l) => ({ ...l, id: null })), { n: '…', h: `<span class="cm">// … 200 qator</span>` }, ...GROWN_LINES] : EXPRESS_LINES;
    return <CodePanel key={grown ? 'g' : 'n'} file={grown ? "server.js · 1240 qator (shartli misol, haqiqiy loyiha emas)" : 'server.js · 38 qator'} lines={lines} focus={seg.focus} />;
  }} />;
}

// --- S3 Nest nima beradi ---
const S3 = {
  kicker: '1-bosqich · Nega Nest', title: 'Nest nima beradi: majburiy tartib',
  segments: [
    { id: 'a', key: "Express'da har jamoa <b>o'zicha</b> bo'ladi", text: "Tajribali Express dasturchi ham faylni bo'ladi: marshrutlar papkasi, kontrollerlar papkasi, servislar papkasi. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi.", show: "Tajribali Express dasturchi ham faylni bo'ladi: <code>routes/</code>, <code>controllers/</code>, <code>services/</code>. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi." },
    { id: 'b', key: "Nest: tartib <b>majburiy va bir xil</b>", text: "Nest shu tartibni majburiy va bir xil qiladi. U uchta bo'lakka nom beradi: Controller, Service, Module." },
    { id: 'c', key: "Toshkent yozdi, Berlin bir daqiqada tushundi", text: "Har Nest loyihasida ular bir xil joyda, bir xil nomda turadi. Shuning uchun Toshkentdagi jamoa yozgan loyihani Berlindagi dasturchi ochsa, qayerda nima turganini bir daqiqada topadi." },
    { id: 'd', key: "Ichida <b>o'sha Express</b> ishlaydi", text: "Yana bir muhim fakt: Nest ichida o'sha Express ishlaydi. So'rovni haqiqatda Express qabul qiladi, Nest esa uni to'g'ri bo'lakka yo'naltiradi. Demak siz bilgan hech narsa bekor bo'lmaydi." },
  ],
};
function Screen3(p) {
  const teams = [['routes/', 'controllers/', 'services/'], ['api/', 'handlers/', 'logic/'], ['src/', 'lib/', 'utils/']];
  return <Lesson p={p} S={S3} scene={({ beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 1}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Express · har jamoa o'zicha</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {teams.map((t, i) => <div key={i} className="mk-card"><h5>{i + 1}-jamoa</h5>{t.map((f) => <div key={f} className="mk-file" style={{ padding: '2px 0' }}><i style={{ background: T.ink3 }} />{f}</div>)}</div>)}
      </div>
    </div></Block>
    <Block at={1} beat={beat}><div className="mk-light" style={{ padding: 16, border: `2px solid ${beat >= 3 ? T.line : T.accent}`, transition: 'border-color .4s' }}>
      <div className="mk-tag" style={{ color: T.accent }}>NestJS · tartib va nomlar — hamma loyihada bir xil</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[['Controller', PART.ctrl, "so'rovni qabul qiladi"], ['Service', PART.svc, 'ishni bajaradi'], ['Module', PART.mod, "ro'yxat: nima bor"]].map(([n, c, d], i) => (
          <div key={n} className="mk-box" style={{ '--c': c, animation: beat >= 1 ? `mk-up .45s ${i * 0.18}s ease both` : 'none' }}><h4>{n}</h4><p>{d}</p></div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: beat >= 3 ? '#FFF0EB' : '#F0F2F5', border: `1px solid ${beat >= 3 ? T.accent : T.line}`, transition: 'all .4s', fontSize: 14 }}>
        <b style={{ color: beat >= 3 ? T.accent : T.ink2 }}>Ichida: Express (platform-express)</b>{beat >= 3 && <span style={{ color: T.ink2 }}> — so'rovni haqiqatda Express qabul qiladi, Nest yo'naltiradi.</span>}
      </div>
    </div></Block>
  </>)} />;
}

// --- S4 TypeScript va dekorator ---
const DECO_LINES = [
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="cm">/* … */</span> }` },
  { h: `}` },
];
const S4 = {
  kicker: '1-bosqich · Nega Nest', title: 'TypeScript va dekorator: @ belgisi',
  segments: [
    { id: 'a', key: "TypeScript = JavaScript + <b>tiplar</b>", text: "Nest loyihalari TypeScript'da yoziladi. TypeScript bu JavaScript'ning o'zi, faqat tiplari bor: string, number va shunga o'xshash. Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz.", focus: [] },
    { id: 'b', key: "Yangi narsa: <b>@ belgili satr = dekorator</b>", text: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: et belgisi bilan boshlanadigan satrlar. Masalan, Controller dekoratori, qavsda cars. Bu dekorator deyiladi.", show: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: <b>@</b> belgisi bilan boshlanadigan satrlar. Masalan, <code>@Controller('cars')</code>. Bu <b>dekorator</b> (decorator) deyiladi.", focus: ['l-ctrl'] },
    { id: 'c', key: "Dekorator Nest'ga aytadi: <b>«bu nima»</b>", text: "Dekorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: bu klass Controller, uning manzili cars. Get dekoratori esa metod ustida turadi: GET so'rov kelsa, shu metod.", show: "Dekorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: «bu klass Controller, uning manzili cars». <code>@Get</code> esa metod ustida turadi: «GET so'rov kelsa, shu metod».", focus: ['l-get'] },
    { id: 'd', key: "Belgi yo'q — Nest <b>tanimaydi</b>", text: "Dekorator kodni bajarmaydi, u belgi qo'yadi. Nest ishga tushganda shu belgilarni o'qib, hamma bo'lakni joyiga qo'yadi. Shuni eslab qoling: dekorator yo'q bo'lsa, Nest o'sha klassni tanimaydi. Buni keyinroq ataylab buzib ham ko'rsatamiz.", focus: [] },
  ],
};
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => (<>
    <Block at={0} beat={beat}><div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
      <span className="mk-card" style={{ fontSize: 13 }}><b>JavaScript</b> → <code>let price = 250</code></span>
      <span className="mk-card" style={{ fontSize: 13 }}><b>TypeScript</b> → <code>let price: number = 250</code></span>
    </div></Block>
    <CodePanel file="cars.controller.ts" lines={DECO_LINES} focus={seg.focus} style={{ fontSize: 15 }} />
    <Block at={3} beat={beat}><div className="mk-rule"><b>Dekorator</b> (decorator) — klass yoki metod ustidagi <b>@</b> belgi. Kod bajarmaydi, Nest'ga «bu nima» deb aytadi. Belgi yo'q — Nest klassni tanimaydi.</div></Block>
  </>)} />;
}

// --- S5a Fayllar ---
const FILES5 = [
  { n: 'src/main.ts', k: 'main', c: T.ink2, d: 'ilovani ishga tushiradi' },
  { n: 'src/app.module.ts', k: 'module', c: PART.mod, d: "ro'yxat" },
  { n: 'src/app.controller.ts', k: 'controller', c: PART.ctrl, d: "so'rovni qabul qiladi" },
  { n: 'src/app.service.ts', k: 'service', c: PART.svc, d: 'ishni bajaradi' },
  { n: 'src/app.controller.spec.ts', k: 'spec', c: T.ink3, d: 'test (Jest darsida)' },
];
const S5a = {
  kicker: "2-bosqich · Uch bo'lak", title: 'Tirik loyiha: nest new nimani yaratdi',
  segments: [
    { id: 'a', key: "<code>nest new cars-api</code> — fayllar", text: "Endi haqiqiy loyihaga qaraymiz. nest new cars-api buyrug'i mana shu fayllarni yaratdi. src papkasida to'rtta asosiy fayl bor.", hl: [] },
    { id: 'b', key: "<b>main</b> — ishga tushiradi", text: "main ts: ilovani ishga tushiradi, boshqa hech narsa qilmaydi.", hl: ['main'] },
    { id: 'c', key: "<b>app.module</b> — ro'yxat", text: "app module ts: ro'yxat. Nest shu ro'yxatga qarab hamma narsani yig'adi.", hl: ['module'] },
    { id: 'd', key: "<b>app.controller</b> — so'rovni qabul qiladi", text: "app controller ts: so'rovni qabul qiladi.", hl: ['controller'] },
    { id: 'e', key: "<b>app.service</b> — ishni bajaradi", text: "app service ts: ishni bajaradi. Beshinchi fayl, spec, bu test, unga Jest darsida qaytamiz.", hl: ['service', 'spec'] },
    { id: 'f', key: "Uch rang — <b>uch bo'lak</b>, dars bo'yi", text: "Uchta rangni eslab qoling: ko'k Controller, yashil Service, sariq Module. Dars davomida shu uch rang bilan yuramiz. Keyingi ekranda siz ham shu loyihani o'zingizda yaratib qo'yasiz, o'rnatilguncha dars davom etadi.", hl: [] },
  ],
};
function Screen5a(p) {
  return <Lesson p={p} S={S5a} scene={({ seg }) => <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">cars-api / src</div>
    <div style={{ display: 'grid', gap: 8 }}>
      {FILES5.map((f, i) => <div key={f.k} className="mk-step" style={{ borderColor: seg.hl.includes(f.k) ? f.c : T.line, boxShadow: seg.hl.includes(f.k) ? `0 0 0 3px rgba(226,69,31,.12)` : 'none', opacity: seg.hl.length && !seg.hl.includes(f.k) ? 0.45 : 1, animation: `mk-up .4s ${i * 0.1}s ease both` }}>
        <i style={{ width: 10, height: 10, borderRadius: 3, background: f.c, marginTop: 6, flex: '0 0 auto' }} />
        <div className="t"><b style={{ fontFamily: MONO, fontSize: 13 }}>{f.n}</b><div className="exp">{f.d}</div></div>
      </div>)}
    </div>
  </div>} />;
}

// --- S5b So'rov yo'li ---
const S5b = {
  kicker: "2-bosqich · Uch bo'lak", title: "Bitta so'rovning yo'li",
  segments: [
    { id: 'a', key: "Brauzer: <code>localhost:3000</code>", text: "Bitta so'rovning yo'lini kuzataylik. Brauzer localhost uch ming manziliga keldi.", dot: 'browser', boxes: ['browser'] },
    { id: 'b', key: "<b>Controller</b> qabul qildi", text: "So'rovni AppController qabul qildi, chunki unda GET uchun metod bor.", dot: 'ctrl', boxes: ['browser', 'ctrl'], box: 'ctrl' },
    { id: 'c', key: "Controller <b>Service'dan so'raydi</b>", text: "Controller o'zi javob o'ylab topmaydi, u AppService'dan so'raydi. Service Hello World matnini qaytaradi.", dot: 'svc', boxes: ['browser', 'ctrl', 'svc'], box: 'svc' },
    { id: 'd', key: "Javob <b>brauzerga qaytdi</b>", text: "Controller shu matnni brauzerga yuboradi.", dot: 'browser', boxes: ['browser', 'ctrl', 'svc'], box: 'ctrl', reply: true },
    { id: 'e', key: "<b>Module</b> ikkalasini ro'yxatda ushlaydi", text: "AppModule esa bu ikkalasini bitta ro'yxatda ushlab turadi, Nest shu ro'yxatga qarab ularni yig'adi.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'], box: 'mod' },
    { id: 'f', key: "So'rov → Controller → Service → javob", text: "Mana shu yo'lni, so'rov, Controller, Service, javob, dars davomida ko'p marta ko'rasiz. Keyingi uch ekranda har faylni ochib o'qiymiz.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'] },
  ],
};
const DOT_LEFT = { browser: 'calc((100% - 88px) / 6)', ctrl: '50%', svc: 'calc(100% - (100% - 88px) / 6)' };
function Screen5b(p) {
  return <Lesson p={p} S={S5b} scene={({ seg }) => {
    const boxes = seg.boxes;
    const boxStyle = (k, c) => ({ '--c': c, opacity: boxes.includes(k) ? (seg.box && seg.box !== k ? 0.4 : 1) : 0, transform: boxes.includes(k) ? 'none' : 'translateY(10px)' });
    const cls = (k) => `mk-box${seg.box === k ? ' hl' : ''}`;
    return <div className="mk-light" style={{ padding: 20 }}>
      <div className="mk-tag">So'rov yo'li</div>
      <div className="mk-flow">
        <div className={`mk-dot${seg.dot ? ' in' : ''}${seg.reply ? ' back' : ''}`} style={{ left: DOT_LEFT[seg.dot || 'browser'] }} />
        <div className="mk-row">
          <div className={cls('browser')} style={boxStyle('browser', T.ink2)}><h4 style={{ color: T.ink }}>Brauzer</h4><p>GET localhost:3000</p></div>
          <div className={`mk-arrow${seg.dot === 'ctrl' || seg.dot === 'svc' ? ' on' : ''}${seg.reply ? ' back' : ''}`}>{seg.reply ? '←' : '→'}</div>
          <div className={cls('ctrl')} style={boxStyle('ctrl', PART.ctrl)}><h4>AppController</h4><p>so'rovni qabul qiladi, Service'ni chaqiradi</p></div>
          <div className={`mk-arrow${seg.dot === 'svc' ? ' on' : ''}${seg.reply ? ' back' : ''}`}>{seg.reply ? '←' : '→'}</div>
          <div className={cls('svc')} style={boxStyle('svc', PART.svc)}><h4>AppService</h4><p>ishni bajaradi → 'Hello World!'</p></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <div className={cls('mod')} style={{ ...boxStyle('mod', PART.mod), minWidth: '62%' }}><h4>AppModule</h4><p><code>controllers: [AppController]</code> · <code>providers: [AppService]</code></p></div>
        </div>
      </div>
    </div>;
  }} />;
}

// --- Amaliyot 1/4: Nest'ni o'rnating, nest new ni boshlab qo'ying (o'rnatilguncha dars davom etadi) ---
const P0 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa (o'rnatish fonda)", title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 4,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: o'rnatib, nest new ni boshlab qo'yasiz", text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz: uchta qadam. O'rnatish bir-uch daqiqa oladi, kutmaysiz, Davom bosib darsni davom ettirasiz, loyiha fonda o'rnatiladi.", hl: [] },
    { id: 'b', key: "1 · Node <b>20 yoki yuqori</b>", text: "Birinchi: node versiyasini tekshiring. Nest o'n birinchi versiya Node yigirma yoki undan yuqorisini talab qiladi. Past bo'lsa, jadvaldagi yo'l bilan yangilang.", hl: [0] },
    { id: 'c', key: "2 · Nest CLI: <code>npm i -g @nestjs/cli</code>", text: "Ikkinchi: Nest CLI'ni global o'rnating va versiyasini tekshiring. Chiqqan raqamni pastdagi isbot maydoniga yozing.", hl: [1] },
    { id: 'd', key: "3 · <code>nest new cars-api</code> — boshlab qo'ying", text: "Uchinchi: nest new cars-api. Paket menejeri so'ralsa npm'ni tanlang. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqdimi — jadval", text: "Biror narsa boshqacha chiqsa, pastdagi jadvalga qarang. Uchala katakcha va isbot to'ldirilgach, davom eting.", hl: [] },
  ],
};
const P0_STEPS = [
  { t: 'Node', cmds: ['node --version'], exp: 'v20 yoki undan yuqori (Nest 11 talabi)' },
  { t: 'Nest CLI', cmds: ['npm i -g @nestjs/cli', 'nest --version'], exp: '11.x.x' },
  { t: "Loyiha — boshlab qo'ying", cmds: ['nest new cars-api'], exp: "paket menejeri: npm · o'rnatish 1–3 daqiqa — kutmang, Davom bosing" },
];
const P0_TROUBLE = [
  ['node: v18 yoki past', "nodejs.org dan LTS (20+) o'rnating, terminalni qayta oching, node --version ni qaytaring"],
  ['nest: command not found', "CLI o'rnatilmagan yoki terminal yangilanmagan: 2-qadamni qaytaring, terminalni qayta oching"],
  ['npm install uzoq / xato', "internetni tekshiring; nest new --skip-install, keyin papkada npm install"],
];
const P0_PROOF = { label: "Isbot: nest --version nima chiqardi?", placeholder: '11.0.10', check: (v) => /^v?11\./.test(v), wrong: "Kutilgan 11.x.x — CLI o'rnatilmagan yoki eski versiya" };
function ScreenP0(p) { return <Practice p={p} S={P0} steps={P0_STEPS} trouble={P0_TROUBLE} proof={P0_PROOF} />; }

// ============================================================
//  2–3-BOSQICH · S6–S9, Amaliyot 1, S10, S11
// ============================================================
const CTRL_LINES = [
  { id: 'l-import', h: `<span class="k">import</span> { Controller, Get } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { id: 'l-import', h: `<span class="k">import</span> { AppService } <span class="k">from</span> <span class="s">'./app.service'</span>;` },
  { h: `` },
  { id: 'l-decorator', h: `<span class="d">@Controller</span>()` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">AppController</span> {` },
  { id: 'l-ctor', h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> appService: <span class="c">AppService</span>) {}` },
  { h: `` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-method', h: `  <span class="c">getHello</span>(): <span class="k">string</span> {` },
  { id: 'l-return', h: `    <span class="k">return</span> <span class="k">this</span>.appService.<span class="c">getHello</span>();` },
  { id: 'l-method', h: `  }` },
  { h: `}` },
];
const S6 = {
  kicker: '2-bosqich · Controller', title: "Controller — so'rovni qabul qiladi",
  segments: [
    { id: 'a', key: "<b>Controller dekoratori</b>: manzil ildiz", text: "app controller ts. To'rtinchi satrda Controller dekoratori, qavsi bo'sh. Demak bu Controller'ning manzili ildiz manzil. Qavsga cars yozsak, uning hamma metodlari cars manzili bilan boshlanadi.", show: "app.controller.ts. To'rtinchi satr: <code>@Controller()</code>, qavsi bo'sh. Demak bu Controller'ning manzili ildiz, ya'ni <code>/</code>. Qavsga cars yozsak, uning hamma metodlari <code>/cars</code> bilan boshlanadi.", focus: ['l-decorator'] },
    { id: 'b', key: "Oddiy klass: <b>AppController</b>", text: "Keyin oddiy klass: AppController.", focus: ['l-class'] },
    { id: 'c', key: "Konstruktor: <b>«menga AppService kerak»</b>", text: "Konstruktorda bitta satr bor: unda AppService nomli bo'lak so'raladi. Buni hozircha shunday tushuning: bu Controller'ga AppService kerak. Qanday kelishini alohida ekranda gaplashamiz.", show: "Konstruktorda bitta satr: <code>private readonly appService: AppService</code>. Buni hozircha shunday tushuning: «bu Controller'ga AppService kerak». Qanday kelishini alohida ekranda gaplashamiz.", focus: ['l-ctor'] },
    { id: 'c2', key: "<code>private readonly</code> = maydon <b>o'zi yaratiladi</b>", text: "Bir TypeScript qisqa yozuvi: konstruktor parametri oldida private readonly tursa, u avtomatik klassning maydoni bo'ladi. JavaScript'da this nuqta appService teng appService deb yozardingiz, bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", show: "TypeScript qisqa yozuvi: parametr oldida <code>private readonly</code> tursa, u avtomatik klass maydoni bo'ladi. JavaScript'dagi <code>this.appService = appService</code> satri yozilmaydi, u o'zi bajariladi.", focus: ['l-ctor'] },
    { id: 'd', key: "<b>Get dekoratori</b> = GET kelsa shu metod", text: "Pastda Get dekoratori. U metod ustida turibdi va aytyapti: GET so'rov kelsa, shu metodni chaqir. Express'dagi app get bilan bir xil ma'no, faqat endi metodning ustida.", show: "Pastda <code>@Get()</code>. U metod ustida turibdi va aytyapti: «GET so'rov kelsa, shu metodni chaqir». Express'dagi <code>app.get</code> bilan bir xil ma'no, faqat endi metodning ustida.", focus: ['l-get', 'l-method'] },
    { id: 'e', key: "Bitta ish: <b>Service'ni chaqirib natijani qaytarish</b>", text: "Metod ichida bitta ish: Service'ning metodini chaqirib, natijasini qaytarish.", show: "Metod ichida bitta ish: <code>this.appService.getHello()</code> natijasini qaytarish.", focus: ['l-return'] },
    { id: 'f', key: "Controller <b>yupqa</b>: oldi, chaqirdi, qaytardi", text: "E'tibor bering: Controller'da mantiq yo'q. U so'rovni oldi, kerakli Service'ni chaqirdi, javobni qaytardi. Controller shunday yupqa bo'lishi kerak.", focus: [] },
  ],
};
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => (<>
    <CodePanel file="src/app.controller.ts" lines={CTRL_LINES} focus={seg.focus} />
    <Block at={6} beat={beat}><div className="mk-rule"><b>Controller yupqa:</b> so'rovni oladi → Service'ni chaqiradi → javobni qaytaradi. If yo'q, hisob yo'q, baza yo'q.</div></Block>
  </>)} />;
}

// --- S7 Service ---
const SVC_LINES = [
  { h: `<span class="k">import</span> { Injectable } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `` },
  { id: 'l-injectable', h: `<span class="d">@Injectable</span>()` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">AppService</span> {` },
  { id: 'l-method', h: `  <span class="c">getHello</span>(): <span class="k">string</span> {` },
  { id: 'l-method', h: `    <span class="k">return</span> <span class="s">'Hello World!'</span>;` },
  { id: 'l-method', h: `  }` },
  { h: `}` },
];
const S7 = {
  kicker: '2-bosqich · Service', title: 'Service — ishni bajaradi',
  segments: [
    { id: 'a', key: "<b>Injectable</b> = «yetkazib berish mumkin»", text: "app service ts. Ustida Injectable dekoratori. Bu so'z inglizcha, yetkazib berish mumkin degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga yetkazib bersa bo'ladi.", show: "app.service.ts. Ustida <code>@Injectable()</code>. Bu so'z inglizcha, «yetkazib berish mumkin» degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga yetkazib bersa bo'ladi.", focus: ['l-injectable'] },
    { id: 'b', key: "<b>Haqiqiy ish Service'da</b>: hisob, qoida, baza", text: "Ichida getHello metodi, u Hello World qaytaradi. Hozir bu juda kichkina, lekin qoida katta loyihada ham o'zgarmaydi: haqiqiy ish Service'da bo'ladi. Narxni hisoblash, qoidani tekshirish, bazaga yozish, hammasi shu yerda.", focus: ['l-method'] },
    { id: 'c', key: "Service so'rov haqida <b>bilmaydi</b> → serversiz sinaladi", text: "Bir narsaga e'tibor bering: Service so'rov haqida hech narsa bilmaydi. Unda req ham, res ham yo'q. Shuning uchun uni alohida sinash oson: metodni chaqirasiz, natijani tekshirasiz, server shart emas. Jest darsida aynan shuni qilasiz.", focus: [] },
    { id: 'd', key: "Bitta Service — <b>ikki joyda</b> ishlatiladi", text: "Va shuning uchun bitta Service'ni ikki joy ishlatishi mumkin: HTTP Controller ham, Telegram bot ham.", focus: [] },
  ],
};
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg, beat }) => (<>
    <CodePanel file="src/app.service.ts" lines={SVC_LINES} focus={seg.focus} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={1} beat={beat}><div className="mk-card" style={{ borderColor: PART.svc }}><h5 style={{ color: PART.svc }}>Service'da bor</h5><div style={{ fontSize: 14 }}>hisob · qoida · bazaga murojaat</div></div></Block>
      <Block at={2} beat={beat}><div className="mk-card"><h5>Service'da yo'q</h5><div style={{ fontSize: 14 }}><code>req</code> · <code>res</code> · manzil — shuning uchun serversiz sinaladi</div></div></Block>
    </div>
    <Block at={3} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-row">
        <div className="mk-box" style={{ '--c': PART.ctrl }}><h4>HTTP Controller</h4><p>brauzer so'rovi</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box hl" style={{ '--c': PART.svc }}><h4>CarsService</h4><p>bitta nusxa, bitta mantiq</p></div>
        <div className="mk-arrow on">←</div>
        <div className="mk-box" style={{ '--c': T.purple }}><h4>Telegram bot</h4><p>bot buyrug'i</p></div>
      </div>
    </div></Block>
  </>)} />;
}

// --- S8 Module ---
const MOD_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { AppController } <span class="k">from</span> <span class="s">'./app.controller'</span>;` },
  { h: `<span class="k">import</span> { AppService } <span class="k">from</span> <span class="s">'./app.service'</span>;` },
  { h: `` },
  { id: 'l-module', h: `<span class="d">@Module</span>({` },
  { id: 'l-imports', h: `  imports: [],` },
  { id: 'l-controllers', h: `  controllers: [<span class="c">AppController</span>],` },
  { id: 'l-providers', h: `  providers: [<span class="c">AppService</span>],` },
  { id: 'l-module', h: `})` },
  { h: `<span class="k">export class</span> <span class="c">AppModule</span> {}` },
];
const S8 = {
  kicker: '2-bosqich · Module', title: "Module — ro'yxat",
  segments: [
    { id: 'a', key: "<b>Module dekoratori</b>: uchta ro'yxat", text: "app module ts. Module dekoratori va ichida uchta ro'yxat.", focus: ['l-module'] },
    { id: 'b', key: "<code>controllers</code> · <code>providers</code> (= Service'lar)", text: "controllers: shu modulga tegishli Controller'lar. providers: shu modul yaratib beradigan narsalar, hozircha bu Service'lar. provider so'zini eslab qoling, Nest Service'ni shunday ataydi.", focus: ['l-controllers', 'l-providers'] },
    { id: 'c', key: "<code>imports</code> — boshqa modullar. <b>Ro'yxat hal qiluvchi</b>", text: "imports: boshqa modullar, hozir bo'sh. Module hech qanday ish qilmaydi, u ro'yxat. Lekin bu ro'yxat hal qiluvchi: Nest faqat shu yerda yozilgan narsani ko'radi.", focus: ['l-imports'] },
    { id: 'd', key: "Ro'yxatda yo'q = <b>Nest uchun yo'q</b>", text: "Controller yozib, uni controllers ro'yxatiga qo'shmasangiz, u yo'qdek. Service yozib, providers'ga qo'shmasangiz, Nest uni yetkazib bera olmaydi.", focus: [] },
    { id: 'e', key: "<b>AppModule</b> tepada, qolganlari <code>imports</code> orqali", text: "Loyihada bir nechta modul bo'ladi: cars uchun, users uchun, orders uchun. Hammasining tepasida AppModule turadi va qolganlarini imports orqali o'ziga ulaydi.", focus: ['l-imports'] },
  ],
};
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => (<>
    <CodePanel file="src/app.module.ts" lines={MOD_LINES} focus={seg.focus} />
    <Block at={3} beat={beat} dim={beat >= 4}><div className="mk-rule"><b>Ro'yxatda yo'q = Nest uchun yo'q.</b> Controller → <code>controllers</code>, Service → <code>providers</code>, boshqa modul → <code>imports</code>.</div></Block>
    <Block at={4} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Modullar daraxti</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><div className="mk-box hl" style={{ '--c': PART.mod, minWidth: 220 }}><h4>AppModule</h4><p><code>imports: [CarsModule, UsersModule, OrdersModule]</code></p></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {['CarsModule', 'UsersModule', 'OrdersModule'].map((m, i) => <div key={m} className="mk-box" style={{ '--c': PART.mod, animation: `mk-up .4s ${0.15 + i * 0.15}s ease both` }}><h4>{m}</h4><p>controllers · providers</p></div>)}
      </div>
    </div></Block>
  </>)} />;
}

// --- S9 main.ts va jurnal ---
const MAIN_LINES = [
  { h: `<span class="k">import</span> { NestFactory } <span class="k">from</span> <span class="s">'@nestjs/core'</span>;` },
  { h: `<span class="k">import</span> { AppModule } <span class="k">from</span> <span class="s">'./app.module'</span>;` },
  { h: `` },
  { h: `<span class="k">async function</span> <span class="c">bootstrap</span>() {` },
  { id: 'main-create', h: `  <span class="k">const</span> app = <span class="k">await</span> NestFactory.<span class="c">create</span>(<span class="c">AppModule</span>);` },
  { id: 'main-listen', h: `  <span class="k">await</span> app.<span class="c">listen</span>(process.env.PORT ?? <span class="d">3000</span>);` },
  { h: `}` },
  { h: `<span class="c">bootstrap</span>();` },
];
const LOG_LINES = [
  { at: 1, h: `<span class="p">$</span> npm run start:dev` },
  { at: 2, id: 'log1', h: `[Nest] LOG [NestFactory] Starting Nest application...` },
  { at: 2, id: 'log2', h: `[Nest] LOG [InstanceLoader] <span class="ok">AppModule dependencies initialized</span>` },
  { at: 3, id: 'log3', h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
  { at: 3, id: 'log4', h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/, GET} route</span>` },
  { at: 3, id: 'log5', h: `[Nest] LOG [NestApplication] Nest application successfully started` },
];
const S9 = {
  kicker: '2-bosqich · main.ts', title: 'main.ts va ishga tushish jurnali',
  segments: [
    { id: 'a', key: "Bosh modul Nest'ga beriladi, <b>Nest yig'adi</b>", text: "Hammasi main ts dan boshlanadi. Birinchi satr: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", show: "Hammasi main.ts dan boshlanadi. <code>NestFactory.create(AppModule)</code>: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", focus: ['main-create'], lf: [] },
    { id: 'b', key: "Port 3000 tinglanadi. Terminal: <code>npm run start:dev</code>", text: "Keyin uch ming portni tinglaydi, Express'dagi kabi. Endi terminalga qarang, npm run start dev yozdik.", show: "Keyin <code>listen(3000)</code>: Express'dagi kabi portni tinglaydi. Endi terminalga qarang, <code>npm run start:dev</code> yozdik.", focus: ['main-listen'], lf: [] },
    { id: 'c', key: "Jurnal: <b>bog'liqliklar tayyor</b>", text: "Birinchi satr: Nest ilovasi ishga tushmoqda. Ikkinchi: AppModule'ning bog'liqliklari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", show: "Starting Nest application. <b>AppModule dependencies initialized</b>: AppModule'ning bog'liqliklari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", focus: [], lf: ['log1', 'log2'] },
    { id: 'd', key: "Jurnal: <b>Mapped</b> = marshrut ulandi", text: "Keyin: AppController topildi va unga ildiz manzil berildi. Mapped satri: ildiz manzilga GET marshruti ulandi. Va oxirgisi: ilova muvaffaqiyatli ishga tushdi.", show: "<code>AppController {/}</code>: Controller topildi va unga manzil berildi. <b>Mapped {/, GET} route</b>: ildiz manzilga GET marshruti ulandi. Nest application successfully started.", focus: [], lf: ['log3', 'log4', 'log5'] },
    { id: 'e', key: "Odat: marshrut ishlamasa — <b>avval jurnal</b>", text: "Bu satrlarni o'qishni odat qiling. Keyinchalik biror marshrut ishlamasa, birinchi qiladigan ishingiz shu jurnalga qarash bo'ladi: Mapped satri bormi, yo'qmi.", focus: [], lf: ['log4'] },
    { id: 'f', key: "Brauzer: <b>Hello World!</b>", text: "Brauzerda localhost uch ming, javob: Hello World.", show: "Brauzerda <code>localhost:3000</code>, javob: <b>Hello World!</b>", focus: [], lf: [] },
  ],
};
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => (<>
    <CodePanel file="src/main.ts" lines={MAIN_LINES} focus={seg.focus} />
    <Block at={1} beat={beat}><CodePanel file="terminal" lines={LOG_LINES} beat={beat} focus={seg.lf} numbers={false} wrap style={{ background: '#111827' }} /></Block>
    <Block at={5} beat={beat}><div className="mk-light" style={{ padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
      <span className="mk-card" style={{ fontFamily: MONO, fontSize: 13, padding: '6px 12px' }}>localhost:3000</span>
      <span style={{ fontSize: 22, fontWeight: 800 }}>Hello World!</span>
    </div></Block>
  </>)} />;
}

// --- Amaliyot 1: loyihani yarating va ishga tushiring ---
const P1 = {
  kicker: 'Amaliyot 2 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa", title: "Ishga tushiring va jurnalni o'qing", tableAt: 4,
  segments: [
    { id: 'a', key: "Loyihangiz o'rnatildi — endi <b>ishga tushiring</b>", text: "Yana navbat sizga. Birinchi amaliyotda boshlab qo'ygan loyihangiz o'rnatilib bo'lgan bo'lsa kerak. Uch qadam: ishga tushirasiz, jurnalni o'qiysiz, brauzerda ko'rasiz.", hl: [] },
    { id: 'b', key: "1 · <code>npm run start:dev</code>", text: "Birinchi: papkaga kiring va npm run start dev yozing.", hl: [0] },
    { id: 'c', key: "2 · jurnalda <b>Mapped</b> satrini toping", text: "Ikkinchi: jurnalda Mapped satrini toping va uni aynan nusxalab, pastdagi isbot maydoniga qo'ying.", hl: [1] },
    { id: 'd', key: "3 · brauzer: <b>Hello World</b>", text: "Uchinchi: brauzerda localhost uch ming, Hello World ni ko'ring.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqdimi — jadval", text: "Boshqacha chiqsa, jadvalga qarang. Uchala katakcha va isbot to'ldirilgach, davom eting.", hl: [] },
  ],
};
const P1_STEPS = [
  { t: 'Ishga tushirish', cmds: ['cd cars-api', 'npm run start:dev'], exp: 'oxirida «Nest application successfully started»' },
  { t: 'Jurnal', cmds: [], exp: 'Mapped {/, GET} route satri — nusxalab isbot maydoniga qo\'ying' },
  { t: 'Brauzer', cmds: [], exp: 'localhost:3000 → Hello World!' },
];
const P1_TROUBLE = [
  ['nest new hali tugamagan', "Terminalda «Successfully created project» chiqishini kuting; 5 daqiqadan oshsa — internet yoki npm install uzoq (--skip-install, keyin npm install)"],
  ['EADDRINUSE :::3000', "3000-portda boshqa server ochiq: uni yoping yoki PORT=3001 npm run start:dev"],
  ['Mapped satri yo\'q, xato bor', "Xato matnini o'qing: qizil TypeScript xatosi bo'lsa fayl:satr ko'rsatilgan; nest new tugamagan bo'lsa kuting"],
];
const P1_PROOF = { label: 'Isbot: jurnaldagi Mapped satrini nusxalang', placeholder: 'Mapped {/, GET} route', check: (v) => /Mapped\s*\{\s*\/\s*,\s*GET\s*\}/i.test(v), wrong: "Kutilgan: Mapped {/, GET} route — jurnaldagi satrni aynan nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// --- S10 Tekshiruv 1 ---
function Screen10(p) {
  return <MCRetry {...p} kicker="Tekshiruv 1" eyebrow="Tekshiruv · 1 / 5"
    title="Mashina narxiga chegirma hisoblaydigan kodni qayerga yozasiz?"
    q="Birinchi tekshiruv. Faraz qiling, mashina narxiga chegirma hisoblash kerak. Bu kod qayerga yoziladi? Variantni tanlang."
    opts={['Controller metodi ichiga', 'Service metodi ichiga', 'AppModule ichiga', 'main.ts ichiga']} correct={1}
    ok="Service. Hisob, qoida va bazaga murojaat Service'da turadi. Controller faqat so'rovni oladi va Service'ni chaqiradi. Shunda chegirmani serversiz ham sinab ko'rish mumkin."
    okShort="Service: hisob, qoida, baza — shu yerda. Controller faqat oladi va chaqiradi."
    wrong={{ 0: "Controller yupqa qoladi: u so'rovni oladi va uzatadi, hisoblamaydi.", 2: "Module ro'yxat, unda ish bajaradigan kod yozilmaydi.", 3: "main.ts faqat ilovani ishga tushiradi." }} />;
}

// --- S11 Dependency Injection ---
const S11 = {
  kicker: '3-bosqich · Dependency Injection', title: "Service Controller'ga qanday keladi",
  segments: [
    { id: 'a', key: "Konstruktordagi <b>o'sha satr</b>", text: "Endi konstruktordagi o'sha satrga qaytamiz: Controller'ga AppService kerak deb yozilgan joy.", show: "Endi konstruktordagi o'sha satrga qaytamiz: <code>constructor(private readonly appService: AppService)</code>." },
    { id: 'b', key: "Express: o'zingiz yaratardingiz. Nest: <b>«menga kerak»</b> deysiz", text: "Express'da siz Service'ni o'zingiz chaqirardingiz: require qilib, new bilan yaratib, har kerakli faylda qaytadan. Nest'da siz yaratmaysiz. Siz faqat aytasiz: menga AppService kerak." },
    { id: 'c', key: "Nest <b>bir marta yaratadi</b>, konstruktorga beradi", text: "Nest ishga tushganda providers ro'yxatiga qaraydi, AppService'ni bir marta yaratadi va kimga kerak bo'lsa, konstruktor orqali qo'liga beradi." },
    { id: 'd', key: "<b>Dependency Injection</b> = bog'liqlikni yetkazib berish", text: "Bu usul Dependency Injection deyiladi, bog'liqlikni yetkazib berish. Bog'liqlik, chunki Controller Service'ga bog'liq. Yetkazib berish, chunki uni Nest olib keladi." },
    { id: 'e', key: "Foyda: <b>1 nusxa · test oson · bog'lanmagan</b>", text: "Nega bu yaxshi? Birinchidan, butun loyihada bitta nusxa. Ikkinchidan, test paytida haqiqiy Service o'rniga soxtasini berish mumkin, Controller buni sezmaydi. Uchinchidan, Controller Service qayerdan kelganini bilishi shart emas." },
    { id: 'f', key: "Tip = <b>buyurtma varaqasi</b>", text: "Konstruktordagi tip, AppService, Nest uchun buyurtma varaqasi: tipga qarab nimani berishni biladi." },
  ],
};
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ beat }) => (<>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={1} beat={beat} dim={beat >= 2}><CodePanel file="Express · 3 faylda qaytadan" numbers={false} lines={[
        { h: `<span class="k">const</span> CarsService = <span class="c">require</span>(<span class="s">'./cars.service'</span>);` },
        { h: `<span class="k">const</span> service = <span class="k">new</span> <span class="c">CarsService</span>();` },
        { h: `<span class="cm">// orders.js da yana… users.js da yana…</span>` }]} /></Block>
      <Block at={0} beat={beat} dim={beat === 1}><CodePanel file="Nest · bir satr" numbers={false} lines={[
        { h: `<span class="k">constructor</span>(` },
        { id: 't', h: `  <span class="k">private readonly</span> appService: <span class="c">AppService</span>` },
        { h: `) {}` }]} focus={beat >= 5 ? ['t'] : []} /></Block>
    </div>
    <Block at={2} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Nest konteyneri</div>
      <div className="mk-row">
        <div className="mk-box" style={{ '--c': PART.mod }}><h4>providers</h4><p><code>[AppService]</code> — ro'yxat</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box hl" style={{ '--c': PART.svc }}><h4>AppService</h4><p><b>1 nusxa</b> — Nest yaratdi</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box" style={{ '--c': PART.ctrl }}><h4>AppController</h4><p>konstruktor orqali oldi</p></div>
      </div>
    </div></Block>
    <Block at={3} beat={beat}><div className="mk-rule"><b>Dependency Injection</b> — bog'liqlikni yetkazib berish: siz yaratmaysiz, Nest <code>providers</code>'ga qarab yaratadi va konstruktorga beradi.</div></Block>
    <Block at={4} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {[['1 nusxa', 'butun loyihada bitta'], ['Test oson', 'soxta Service beriladi, Controller sezmaydi'], ["Bog'lanmagan", 'Controller qayerdan kelganini bilmaydi']].map(([h, d], i) => <div key={h} className="mk-card" style={{ animation: `mk-up .4s ${i * 0.15}s ease both` }}><h5>{h}</h5><div style={{ fontSize: 13 }}>{d}</div></div>)}
    </div></Block>
  </>)} />;
}

// ============================================================
//  4-BOSQICH · S12–S17, LineCheck 1, Amaliyot 2
// ============================================================
const CLI_LINES = [
  { at: 0, id: 'cmd1', h: `<span class="p">$</span> nest g module cars` },
  { at: 1, id: 'out1', h: `<span class="ok">CREATE</span> src/cars/cars.module.ts (81 bytes)` },
  { at: 1, id: 'out1u', h: `<span class="wn">UPDATE</span> src/app.module.ts (308 bytes)` },
  { at: 2, h: `` },
  { at: 2, id: 'cmd2', h: `<span class="p">$</span> nest g controller cars --no-spec` },
  { at: 2, id: 'out2', h: `<span class="ok">CREATE</span> src/cars/cars.controller.ts (97 bytes)` },
  { at: 2, id: 'out2', h: `<span class="wn">UPDATE</span> src/cars/cars.module.ts (166 bytes)` },
  { at: 3, h: `` },
  { at: 3, id: 'cmd3', h: `<span class="p">$</span> nest g service cars --no-spec` },
  { at: 3, id: 'out3', h: `<span class="ok">CREATE</span> src/cars/cars.service.ts (88 bytes)` },
  { at: 3, id: 'out3', h: `<span class="wn">UPDATE</span> src/cars/cars.module.ts (240 bytes)` },
];
const DIFF_LINES = [
  { h: `<span class="d">@Module</span>({` },
  { neu: true, h: `  imports: [<span class="c">CarsModule</span>],` },
  { h: `  controllers: [<span class="c">AppController</span>],` },
  { h: `  providers: [<span class="c">AppService</span>],` },
  { h: `})` },
];
const S12 = {
  kicker: '4-bosqich · CLI', title: 'CLI bilan cars modulini yaratamiz',
  segments: [
    { id: 'a', key: "<code>nest g module cars</code> — g = generate", text: "Endi o'zimiz quramiz. Mashinalar uchun alohida modul kerak. Nest CLI buni uch buyruq bilan yaratadi. Birinchisi: nest g module cars. g bu generate, yaratish.", focus: ['cmd1'] },
    { id: 'b', key: "CLI bosh modulga <b>o'zi yozdi</b>: UPDATE", text: "Natija ikki satr: CREATE, cars module yaratildi, va UPDATE, app module o'zgartirildi. Ikkinchi satrga e'tibor bering: CLI bosh modulga o'zi kirib, imports ro'yxatiga CarsModule'ni qo'shib qo'ydi. Qo'l bilan qilsangiz, aynan shuni unutasiz.", focus: ['out1u'] },
    { id: 'c', key: "<code>nest g controller cars</code> — ro'yxatga yozildi", text: "Ikkinchi buyruq: nest g controller cars. no-spec qo'shimchasi test faylini hozircha yaratma degani, Jest darsida qaytamiz. Controller yaratildi va cars modulining controllers ro'yxatiga yozildi.", show: "<code>nest g controller cars --no-spec</code>. <code>--no-spec</code>: test faylini hozircha yaratma, Jest darsida qaytamiz. Controller yaratildi va cars modulining <code>controllers</code> ro'yxatiga yozildi.", focus: ['cmd2', 'out2'] },
    { id: 'd', key: "<code>nest g service cars</code> — providers'ga yozildi", text: "Uchinchi buyruq: nest g service cars. Service yaratildi va providers ro'yxatiga yozildi.", focus: ['cmd3', 'out3'] },
    { id: 'e', key: "3 buyruq → 3 CREATE + 3 UPDATE. <b>Nima qilganini biling</b>", text: "Uch buyruq, oltita o'zgarish va hamma ro'yxat to'g'ri. CLI'ga ishonish mumkin, lekin u nima qilganini bilish shart, chunki buzilganda qo'l bilan tuzatasiz.", focus: [] },
  ],
};
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => (<>
    <CodePanel file="terminal" lines={CLI_LINES} beat={beat} focus={seg.focus} numbers={false} style={{ background: '#111827' }} />
    <Block at={1} beat={beat} dim={beat >= 2}><CodePanel file="src/app.module.ts · CLI o'zi o'zgartirdi" lines={DIFF_LINES} numbers={false} /></Block>
    <Block at={4} beat={beat}><div className="mk-rule"><b>3 buyruq → 3 CREATE + 3 UPDATE.</b> Har ro'yxat (imports · controllers · providers) CLI tomonidan to'ldirildi.</div></Block>
  </>)} />;
}

// --- S13 Bo'sh fayllar (+ bashorat) ---
const S13 = {
  kicker: "4-bosqich · bo'sh fayllar", title: "Controller ro'yxatda, lekin marshrut yo'q",
  segments: [
    { id: 'a', key: "<b>cars.module.ts</b>: ikkala ro'yxat to'ldirilgan", text: "Yaratilgan fayllarga qarang. cars module: controllers'da CarsController, providers'da CarsService." },
    { id: 'b', key: "Bashorat: CLI yaratgan fayllar bilan server…", text: "Fayllarni ochishdan oldin bashorat qiling. CLI hozirgina yaratgan Controller va Service bilan serverni ishga tushirsak, nima bo'ladi? Uchta variantdan birini bosing.", ask: { q: "CLI yaratgan fayllar bilan server nima qiladi?", opts: ['Xato bilan yiqiladi', "Ishga tushadi, /cars → 404", "Ishga tushadi, /cars → 200, bo'sh ro'yxat"], answer: 1 } },
    { id: 'c', key: "Controller va Service: <b>bo'sh klasslar</b>", text: "Fayllarga qaraymiz. cars controller: Controller dekoratori, qavsda cars, va bo'sh klass. cars service: Injectable dekoratori va bo'sh klass. Ichida bitta ham metod yo'q.", show: "<b>cars.controller.ts</b>: <code>@Controller('cars')</code> va bo'sh klass. <b>cars.service.ts</b>: <code>@Injectable()</code> va bo'sh klass. Ichida bitta ham metod yo'q." },
    { id: 'd', key: "Controller ko'rindi, lekin <b>Mapped yo'q</b>", text: "Jurnalda yangi satr bor: CarsController, qavs ichida cars manzili. Nest Controller'ni ko'rdi va unga manzil berdi. Lekin Mapped satri yo'q, chunki klass ichida hali bitta ham metod yo'q.", show: "Jurnalda yangi satr: <code>CarsController {/cars}</code>. Nest Controller'ni ko'rdi va unga manzil berdi. Lekin <b>Mapped satri yo'q</b>, chunki klass ichida hali bitta ham metod yo'q." },
    { id: 'e', key: "cars manzili: <b>404</b>, eshik bor, ichida hech kim yo'q", text: "Brauzerda cars manzilini ochsak: to'rt yuz to'rt, Cannot GET cars. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.", show: "Brauzerda /cars ochsak: <b>404, Cannot GET /cars</b>. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q." },
    { id: 'f', key: "Tartib: avval <b>Service</b>, keyin <b>Controller</b>", text: "Keyingi ikki ekranda avval Service'ni, keyin Controller'ni to'ldiramiz. Tartib aynan shunday: avval ishni bajaradigan bo'lak, keyin uni chaqiradigan bo'lak." },
  ],
};
function Screen13(p) {
  const mini = (file, lines) => <CodePanel file={file} numbers={false} lines={lines} style={{ padding: '14px 14px', fontSize: 12.5 }} />;
  return <Lesson p={p} S={S13} scene={({ beat }) => (<>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
      <Block at={0} beat={beat} dim={beat === 2}>{mini('cars.module.ts', [{ h: `<span class="d">@Module</span>({` }, { h: `  controllers: [<span class="c">CarsController</span>],` }, { h: `  providers: [<span class="c">CarsService</span>]` }, { h: `})` }, { h: `<span class="k">export class</span> <span class="c">CarsModule</span> {}` }])}</Block>
      <Block at={2} beat={beat}>{mini('cars.controller.ts', [{ h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` }, { h: `<span class="k">export class</span> <span class="c">CarsController</span> {}` }])}</Block>
      <Block at={2} beat={beat}>{mini('cars.service.ts', [{ h: `<span class="d">@Injectable</span>()` }, { h: `<span class="k">export class</span> <span class="c">CarsService</span> {}` }])}</Block>
    </div>
    <Block at={3} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} beat={beat} lines={[
      { at: 3, h: `[Nest] LOG [InstanceLoader] CarsModule dependencies initialized` },
      { at: 3, id: 'x', h: `[Nest] LOG [RoutesResolver] <span class="ok">CarsController {/cars}:</span>` },
      { at: 3, h: `[Nest] LOG [NestApplication] Nest application successfully started` },
      { at: 4, h: `` },
      { at: 4, h: `<span class="p">GET /cars</span> → <span class="er">404</span>  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}` }]} focus={beat === 3 ? ['x'] : []} /></Block>
    <Block at={5} beat={beat}><div className="mk-rule">Tartib: avval <b>Service</b> (ishni bajaradigan), keyin <b>Controller</b> (uni chaqiradigan).</div></Block>
  </>)} />;
}

// --- S14 Service kodi ---
const CARS_SVC_LINES = [
  { at: 0, h: `<span class="k">import</span> { Injectable, NotFoundException } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { at: 0, h: `` },
  { at: 0, id: 'l-interface', h: `<span class="k">export interface</span> <span class="c">Car</span> {` },
  { at: 0, id: 'l-interface', h: `  id: <span class="k">number</span>;  brand: <span class="k">string</span>;  model: <span class="k">string</span>;  price: <span class="k">number</span>;` },
  { at: 0, id: 'l-interface', h: `}` },
  { at: 1, h: `` },
  { at: 1, h: `<span class="d">@Injectable</span>()` },
  { at: 1, h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
  { at: 1, id: 'l-array', h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [` },
  { at: 1, id: 'l-array', h: `    { id: <span class="d">1</span>, brand: <span class="s">'Chevrolet'</span>, model: <span class="s">'Malibu'</span>, price: <span class="d">250</span> },` },
  { at: 1, id: 'l-array', h: `    { id: <span class="d">2</span>, brand: <span class="s">'Kia'</span>, model: <span class="s">'K5'</span>, price: <span class="d">320</span> },` },
  { at: 1, id: 'l-array', h: `  ];` },
  { at: 2, h: `` },
  { at: 2, id: 'l-findAll', h: `  <span class="c">findAll</span>(): <span class="c">Car</span>[] { <span class="k">return this</span>.cars; }` },
  { at: 2, h: `` },
  { at: 2, id: 'l-findOne', h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
  { at: 2, id: 'l-findOne', h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
  { at: 3, id: 'l-notfound', h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
  { at: 2, id: 'l-findOne', h: `    <span class="k">return</span> car;` },
  { at: 2, id: 'l-findOne', h: `  }` },
  { at: 4, h: `` },
  { at: 4, id: 'l-create', h: `  <span class="c">create</span>(data: <span class="c">Omit</span>&lt;<span class="c">Car</span>, <span class="s">'id'</span>&gt;): <span class="c">Car</span> {` },
  { at: 4, id: 'l-create', h: `    <span class="k">const</span> car: <span class="c">Car</span> = { id: <span class="k">this</span>.cars.length + <span class="d">1</span>, ...data };` },
  { at: 4, id: 'l-create', h: `    <span class="k">this</span>.cars.<span class="c">push</span>(car);` },
  { at: 4, id: 'l-create', h: `    <span class="k">return</span> car;` },
  { at: 4, id: 'l-create', h: `  }` },
  { at: 1, h: `}` },
];
const S14 = {
  kicker: '4-bosqich · Service', title: "Service: ro'yxat va uch metod",
  segments: [
    { id: 'a', key: "<b>Car interfeysi</b>: id, brand, model, price — shakl", text: "cars service ni to'ldiramiz. Avval Car interfeysi: mashinada id, brand, model va price bo'ladi. Interface TypeScript'ning shakl tavsifi, bazadagi jadval emas, hozircha shunchaki shakl.", focus: ['l-interface'] },
    { id: 'b', key: "Ro'yxat xotirada: Malibu, K5. <b>Baza hali yo'q</b>", text: "Keyin ro'yxat: ikkita mashina, Chevrolet Malibu va Kia K5, narxi million so'mda. Baza hali yo'q, ma'lumot xotirada turibdi, bu dars uchun yetarli.", focus: ['l-array'] },
    { id: 'c', key: "<code>findAll</code> — hammasi · <code>findOne</code> — id bo'yicha", text: "findAll ro'yxatni qaytaradi. findOne id bo'yicha qidiradi.", focus: ['l-findAll', 'l-findOne'] },
    { id: 'd', key: "Topilmasa: <b>NotFoundException</b> → Nest o'zi 404 qiladi", text: "Topilmasa, NotFoundException tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi to'rt yuz to'rt javobga aylantiradi, statusi va xabari bilan. Express'da buni qo'lda, status to'rt yuz to'rt va json deb yozardingiz.", show: "Topilmasa, <b>NotFoundException</b> tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi 404 javobga aylantiradi, statusi va xabari bilan. Express'da buni <code>res.status(404).json</code> deb qo'lda yozardingiz.", focus: ['l-notfound'] },
    { id: 'e', key: "<code>create</code> qo'shadi. <code>Omit&lt;Car,'id'&gt;</code> = Car'ning id'siz shakli", text: "create yangi mashinani ro'yxatga qo'shadi va qaytaradi. Qavsdagi Omit Car vergul id, TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz o'zimiz beramiz. Yana bir marta qarang: bu faylda so'rov haqida bitta so'z ham yo'q. Faqat mashinalar va ular bilan ishlaydigan uch metod.", show: "<code>create</code> yangi mashinani qo'shadi va qaytaradi. <code>Omit&lt;Car, 'id'&gt;</code> — TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz beramiz. Bu faylda so'rov haqida bitta so'z ham yo'q.", focus: ['l-create'] },
  ],
};
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg, beat }) => <CodePanel file="src/cars/cars.service.ts" lines={CARS_SVC_LINES} beat={beat} focus={seg.focus} />} />;
}

// --- S15 Controller kodi ---
const CARS_CTRL_LINES = [
  { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { CarsService } <span class="k">from</span> <span class="s">'./cars.service'</span>;` },
  { h: `` },
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-ctor', h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
  { h: `` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.carsService.<span class="c">findAll</span>(); }` },
  { h: `` },
  { id: 'l-getid', h: `  <span class="d">@Get</span>(<span class="s">':id'</span>)` },
  { id: 'l-param', h: `  <span class="c">findOne</span>(<span class="d">@Param</span>(<span class="s">'id'</span>) id: <span class="k">string</span>) {` },
  { id: 'l-param', h: `    <span class="k">return this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));` },
  { id: 'l-getid', h: `  }` },
  { h: `` },
  { id: 'l-post', h: `  <span class="d">@Post</span>()` },
  { id: 'l-body', h: `  <span class="c">create</span>(<span class="d">@Body</span>() body: { brand: <span class="k">string</span>; model: <span class="k">string</span>; price: <span class="k">number</span> }) {` },
  { id: 'l-body', h: `    <span class="k">return this</span>.carsService.<span class="c">create</span>(body);` },
  { id: 'l-post', h: `  }` },
  { h: `}` },
];
const EXN_ROWS = [
  { at: 1, e: "app.get('/cars', …)", n: '@Get()' },
  { at: 2, e: 'req.params.id', n: "@Param('id') id" },
  { at: 3, e: 'req.body', n: '@Body() body' },
  { at: 3, e: 'app.use(express.json())', n: 'kerak emas — yoqilgan' },
];
const S15 = {
  kicker: '4-bosqich · Controller', title: 'Controller: uch marshrut',
  segments: [
    { id: 'a', key: "Manzil <b>cars</b>; konstruktor: «menga CarsService kerak»", text: "cars controller. Controller dekoratori, qavsda cars: hamma metod cars manzili bilan boshlanadi. Konstruktor: menga CarsService kerak.", show: "cars.controller.ts. <code>@Controller('cars')</code>: hamma metod /cars bilan boshlanadi. Konstruktor: «menga CarsService kerak».", focus: ['l-ctrl', 'l-ctor'] },
    { id: 'b', key: "Bo'sh <code>@Get()</code> = <b>GET /cars</b> → findAll", text: "Get dekoratori bo'sh: GET cars. Metod Service'ning findAll'ini chaqiradi.", show: "<code>@Get()</code> bo'sh: <b>GET /cars</b>. Metod findAll'ni chaqiradi.", focus: ['l-get'] },
    { id: 'c', key: "<code>@Get(':id')</code> = <b>GET /cars/:id</b> · <b>@Param</b> = req.params, qiymat — matn", text: "Get dekoratori ikki nuqta id bilan: cars manzilidan keyin raqam, masalan cars besh. Param dekoratori Express'dagi req params id ning o'zi, faqat dekorator orqali olinadi. Manzildan kelgan qiymat har doim matn, shuning uchun Number bilan raqamga o'tkazamiz.", show: "<code>@Get(':id')</code>: <b>GET /cars/5</b> kabi manzil. <code>@Param('id') id</code>: Express'dagi <code>req.params.id</code> ning o'zi, faqat dekorator orqali olinadi. Manzildan kelgan qiymat har doim matn, shuning uchun <code>Number</code> bilan raqamga o'tkazamiz.", focus: ['l-getid', 'l-param'] },
    { id: 'd', key: "<code>@Post()</code> = <b>POST /cars</b> · <b>@Body</b> = req.body, express.json kerak emas", text: "Post dekoratori: POST cars. Body dekoratori Express'dagi req body. Nest'da express json ni qo'lda ulash shart emas, u ichida yoqilgan.", show: "<code>@Post()</code>: <b>POST /cars</b>. <code>@Body() body</code>: Express'dagi <code>req.body</code>. Nest'da <code>express.json()</code> ni qo'lda ulash shart emas, u ichida yoqilgan.", focus: ['l-post', 'l-body'] },
    { id: 'e', key: "Uch metod bir shaklda: <b>ol → chaqir → qaytar</b>", text: "Qarang, uchala metod ham bir xil shaklda: so'rovdan kerakli qismni olish, Service metodini chaqirish, natijani qaytarish. Controller'da if yo'q, hisob yo'q, baza yo'q.", focus: [] },
  ],
};
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <CodePanel file="src/cars/cars.controller.ts" lines={CARS_CTRL_LINES} focus={seg.focus} />}
    below={({ beat }) => beat >= 1 && <table className="mk-tbl"><thead><tr><th>Express</th><th>Nest</th></tr></thead><tbody>
      {EXN_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.e}</code></td><td><code>{r.n}</code></td></tr>)}
    </tbody></table>} />;
}

// --- Tekshiruv 2: qaysi satr xato (Controller) ---
const LC1_LINES = [
  { h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
  { h: `` },
  { h: `  <span class="d">@Get</span>()` },
  { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.carsService.<span class="c">findAll</span>(); }` },
  { h: `` },
  { h: `  <span class="d">@Get</span>(<span class="s">':id'</span>)` },
  { h: `  <span class="c">findOne</span>(<span class="d">@Param</span>(<span class="s">'id'</span>) id: <span class="k">string</span>) {` },
  { h: `    <span class="k">const</span> car = <span class="k">this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));` },
  { h: `    <span class="k">if</span> (car.price > <span class="d">300</span>) car.price = car.price * <span class="d">0.9</span>;` },
  { h: `    <span class="k">return</span> car;` },
  { h: `  }` },
  { h: `}` },
];
function ScreenLC1(p) {
  return <LineCheck {...p} kicker="Tekshiruv 2" eyebrow="Tekshiruv · 2 / 5 — qaysi satr xato?" title="Bu Controller ishlaydi, lekin bitta satr noto'g'ri joyda"
    q="Ikkinchi tekshiruv. Ekrandagi Controller ishlaydi, xato chiqarmaydi. Lekin bitta satr bu faylda turmasligi kerak. Qaysi satr? Bosing."
    file="src/cars/cars.controller.ts" lines={LC1_LINES} target={10}
    ok="Chegirma hisobi Controller'da turibdi. Ishlaydi, lekin bu mantiq, u Service'ga tegishli: alohida sinab bo'lmaydi va Telegram bot shu chegirmani ololmaydi. Controller oladi, chaqiradi, qaytaradi."
    okShort="11-satr: chegirma hisobi — mantiq, u Service'ga tegishli. Controller oladi, chaqiradi, qaytaradi."
    hint="Bu satr Controller'ning ishi: so'rovni olish, Service'ni chaqirish yoki qaytarish. Hisob qayerda?" />;
}

// --- S16 Jurnal va javoblar ---
const REQS = [
  { k: 'r1', m: 'GET', u: '/cars', st: 200, body: `[{"id":1,"brand":"Chevrolet","model":"Malibu","price":250},\n {"id":2,"brand":"Kia","model":"K5","price":320}]` },
  { k: 'r2', m: 'GET', u: '/cars/1', st: 200, body: `{"id":1,"brand":"Chevrolet","model":"Malibu","price":250}` },
  { k: 'r3', m: 'GET', u: '/cars/99', st: 404, body: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` },
  { k: 'r4', m: 'POST', u: '/cars  {brand:"Chevrolet", model:"Cobalt", price:145}', st: 201, body: `{"id":3,"brand":"Chevrolet","model":"Cobalt","price":145}` },
  { k: 'r5', m: 'POST', u: '/cars  {}  (bo\'sh)', st: 201, body: `{"id":4}` },
];
const S16 = {
  kicker: '4-bosqich · ishga tushdi', title: 'Jurnal va javoblar',
  segments: [
    { id: 'a', key: "Uchta <b>Mapped</b>: uchala marshrut ulangan", text: "Server ishga tushdi. Jurnalda uchta yangi Mapped satri: cars GET, cars id GET, cars POST. Uchala marshrut ulangan. Endi so'rov yuboramiz.", open: null },
    { id: 'b', key: "<code>GET /cars</code> → <b>200</b>, JSON o'zi yasaladi", text: "GET cars: ikki yuz va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz JSON stringify yozmadik, Nest obyektni o'zi JSON qiladi.", show: "<code>GET /cars</code>: <b>200</b> va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz <code>JSON.stringify</code> yozmadik, Nest obyektni o'zi JSON qiladi.", open: 'r1' },
    { id: 'c', key: "<code>GET /cars/1</code> → <b>200</b>, Malibu", text: "GET cars bir: ikki yuz va Malibu.", show: "<code>GET /cars/1</code>: <b>200</b> va Malibu.", open: 'r2' },
    { id: 'd', key: "<code>GET /cars/99</code> → <b>404</b> + xabar", text: "GET cars to'qson to'qqiz: to'rt yuz to'rt va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: message, error, statusCode.", show: "<code>GET /cars/99</code>: <b>404</b> va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: <code>message</code>, <code>error</code>, <code>statusCode</code>.", open: 'r3' },
    { id: 'e', key: "<code>POST /cars</code> → <b>201 Created</b> o'zi qo'yiladi", text: "POST cars bilan Cobalt yuboramiz: ikki yuz bir Created va yangi mashina, id uch. E'tibor bering, biz ikki yuz birni yozmadik. Nest POST uchun uni o'zi qo'yadi, Express'da ikki yuz bo'lardi.", show: "<code>POST /cars</code> bilan Cobalt yuboramiz: <b>201 Created</b> va yangi mashina, id 3. Biz 201 yozmadik, Nest POST uchun o'zi qo'yadi; Express'da 200 bo'lardi.", open: 'r4' },
    { id: 'f', key: "<code>POST /cars {}</code> → <b>201, {id:4}</b>. Tekshiruv yo'q", text: "Yana bir sinov: bo'sh POST yuboramiz, ichida hech narsa yo'q. Nest baribir ikki yuz bir qaytaradi va faqat id to'rt bo'lgan mashina yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha. Tekshiruv keyingi darsda, DTO bilan.", show: "Bo'sh <code>POST /cars {}</code>: Nest baribir <b>201</b> qaytaradi va faqat <code>{id:4}</code> yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha — tekshiruv keyingi darsda, DTO bilan.", open: 'r5' },
    { id: 'g', key: "Besh tugmani <b>o'zingiz bosing</b> — keyin Davom", text: "Endi beshala tugmani o'zingiz bosib, har javobni o'qing. Davom besh tugmadan keyin ochiladi.", open: null },
  ],
};
function Screen16(p) {
  const [open, setOpen] = useState(null);
  const [clicked, setClicked] = useState([]);
  return <Lesson p={p} S={S16} ready={() => clicked.length >= REQS.length} scene={({ seg, beat }) => {
    const cur = REQS.find((r) => r.k === (open || seg.open));
    return (<>
      <CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [RoutesResolver] CarsController {/cars}:` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars/:id, GET} route</span>` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, POST} route</span>` },
        { h: `[Nest] LOG [NestApplication] Nest application successfully started` }]} />
      <Block at={1} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">So'rov yuborish — bosing</div>
        <div className="mk-req">
          {REQS.map((r) => <button key={r.k} className={(open || seg.open) === r.k ? 'hl' : ''} onClick={() => { setOpen(r.k); setClicked((c) => c.includes(r.k) ? c : [...c, r.k]); }}><span className={`st s${String(r.st)[0]}`}>{r.st}</span><span>{r.m} {r.u}</span></button>)}
        </div>
        {cur && <pre key={cur.k} style={{ animation: 'mk-up .3s ease both' }}>{cur.body}</pre>}
      </div></Block>
    </>);
  }} />;
}

// --- S17 Tekshiruv 3 — bashorat ---
function Screen17(p) {
  return <MCRetry {...p} kicker="Tekshiruv 3" eyebrow="Tekshiruv · 3 / 5 — bashorat"
    title="Kodimiz hozirgi holatda. GET /cars/abc so'rovi kelsa, javob qanday bo'ladi?"
    q="Uchinchi tekshiruv, bashorat qiling. Kimdir cars manzilidan keyin abc deb yubordi. Kodimiz hozirgi holatda. Javob qanday bo'ladi?"
    opts={["200 va bo'sh obyekt", '500 Internal server error', '404 va «Car with id NaN not found»', '400 Bad Request']} correct={2}
    ok="To'rt yuz to'rt va Car with id NaN not found. Number abc natijasi NaN. Ro'yxatda id NaN bo'lgan mashina yo'q, shuning uchun findOne NotFoundException tashlaydi. Ishlaydi, lekin xabar chiroyli emas: foydalanuvchi NaN so'zini ko'rmasligi kerak. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha; buni keyingi darsda DTO bilan qilasiz."
    okShort="404, «Car with id NaN not found»: Number('abc') = NaN → findOne topmaydi → NotFoundException. Tekshiruv yo'q — DTO keyingi darsda."
    wrong={{ 0: "find hech narsa topmasa undefined qaytaradi, bizning kod esa bu holatda xato tashlaydi.", 1: "Besh yuz faqat biz kutmagan xato bo'lganda chiqadi; bu yerda xatoni o'zimiz NotFoundException bilan tashladik.", 3: "To'rt yuzni hech kim qaytarmaydi, chunki tekshiruv yozilmagan." }} />;
}

// --- Amaliyot 2: cars modulini quring ---
const P2 = {
  kicker: 'Amaliyot 3 / 4', eyebrow: "Hozir o'zingizda · 10–15 daqiqa", title: 'cars modulini quring', tableAt: 5,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: cars moduli, to'rt qadam", text: "Yana navbat sizga. Hozirgina ko'rgan cars modulini o'z loyihangizda qurasiz: to'rt qadam, o'n-o'n besh daqiqa.", hl: [] },
    { id: 'b', key: "1 · uch CLI buyrug'i", text: "Birinchi: uch buyruq bilan modul, controller va service yarating. Terminalda uchta CREATE va uchta UPDATE chiqishi kerak.", hl: [0] },
    { id: 'c', key: "2 · Service — <b>nusxalang</b> («Kod»)", text: "Ikkinchi: Service'ni darsdagi kod bilan to'ldiring. U pastdagi Kod tugmasida turibdi, nusxalab qo'ying.", hl: [1] },
    { id: 'd', key: "3 · Controller — <b>o'zingiz yozing</b>, 20 qator", text: "Uchinchi: Controller'ni o'zingiz yozing, yigirma qator. Namuna Kod tugmasida ko'rinadi, lekin nusxalanmaydi, ataylab. Dekorator va konstruktorni qo'lingiz his qilsin. Jurnalda uchta Mapped satri chiqsin.", hl: [2] },
    { id: 'e', key: "4 · to'rt so'rov: 200 · 200 · 404 · 201", text: "To'rtinchi: brauzer yoki Postman bilan to'rtta so'rovni yuboring va javoblarni darsdagi bilan solishtiring: ikki yuz, ikki yuz, to'rt yuz to'rt, ikki yuz bir. cars to'qson to'qqiz javobidagi xabarni isbot maydoniga yozing.", hl: [3] },
    { id: 'f', key: "Boshqacha chiqdimi — jadval", text: "Boshqacha chiqsa, jadvalga qarang. To'rtala katakcha va isbot to'ldirilgach, davom eting.", hl: [] },
  ],
};
const P2_STEPS = [
  { t: 'cars moduli', cmds: ['nest g module cars', 'nest g controller cars --no-spec', 'nest g service cars --no-spec'], exp: '3 CREATE, 3 UPDATE' },
  { t: 'Service — nusxalang', cmds: [], exp: 'cars.service.ts — «Kod» tugmasidan nusxalang' },
  { t: "Controller — o'zingiz yozing", cmds: [], exp: "cars.controller.ts — 20 qator, namuna «Kod»da (nusxalanmaydi) · jurnalda 3 ta Mapped {/cars…}" },
  { t: "So'rovlar", cmds: [], exp: 'GET /cars · /cars/1 · /cars/99 · POST /cars → 200 · 200 · 404 · 201' },
];
const P2_PROOF = { label: 'Isbot: GET /cars/99 javobidagi message maydoni', placeholder: 'Car with id 99 not found', check: (v) => /not found/i.test(v) && /99/.test(v), wrong: 'Kutilgan: Car with id 99 not found — javobdagi message qiymatini aynan yozing' };
const P2_TROUBLE = [
  ['Qizil TypeScript xatosi (fayl:satr)', "Nusxalashda satr tushib qolgan: ko'rsatilgan satrni «Kod» bilan solishtiring"],
  ['Cannot GET /cars', "Jurnalda Mapped {/cars…} bormi? Yo'q bo'lsa app.module.ts → imports: [CarsModule]"],
  ['POST da body undefined', "Postman'da Body → raw → JSON tanlanganmi? Content-Type: application/json"],
];
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={[{ file: 'src/cars/cars.service.ts', lines: CARS_SVC_LINES }, { file: 'src/cars/cars.controller.ts', lines: CARS_CTRL_LINES, copy: false }]} />; }

// ============================================================
//  5-BOSQICH · S18–S23, LineCheck 2, Amaliyot 3
// ============================================================
const MODULE_BROKEN = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { gone: true, h: `  providers: [<span class="c">CarsService</span>]` },
  { neu: true, h: `  providers: []` },
  { h: `})` },
];
const ERR1 = [
  { at: 1, id: 'e-who', h: `ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class="er">CarsController (?)</span>.` },
  { at: 2, id: 'e-what', h: `Please make sure that the argument <span class="er">CarsService at index [0]</span> is available` },
  { at: 3, id: 'e-where', h: `in the <span class="er">CarsModule</span> module.` },
  { at: 4, h: `` },
  { at: 4, id: 'e-solutions', h: `Potential solutions:` },
  { at: 4, id: 'e-solutions', h: `- Is CarsModule a valid NestJS module?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is a provider, is it part of the current CarsModule?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is exported from a separate @Module, is that module imported within CarsModule?` },
];
const S18 = {
  kicker: '5-bosqich · buzamiz 1', title: "Buzamiz 1: providers bo'sh",
  segments: [
    { id: 'a', key: "Ataylab buzamiz: <b>providers bo'sh</b>", text: "Endi ataylab buzamiz, chunki o'quvchilaringiz aynan shu xatolarni qiladi, siz esa ularni o'qiy olishingiz kerak. Birinchi holat: cars module da providers ro'yxatidan CarsService'ni o'chirdik.", focus: [] },
    { id: 'b', key: "<b>Kim?</b> CarsController. (?) = topilmagan joy", text: "Serverni ishga tushiramiz, u yiqiladi. Xabarni bo'lak-bo'lak o'qiymiz. Birinchi bo'lak: Nest CarsController'ning bog'liqliklarini topa olmadi. Qavsdagi so'roq belgisi bu topilmagan joy.", show: "Serverni ishga tushiramiz, u yiqiladi. Xabarni bo'lak-bo'lak o'qiymiz. <b>Nest can't resolve dependencies of the CarsController</b>: Nest CarsController'ning bog'liqliklarini topa olmadi. Qavsdagi <b>(?)</b> bu topilmagan joy.", focus: ['e-who'] },
    { id: 'c', key: "<b>Nima yetishmayapti?</b> CarsService, index 0", text: "Ikkinchi bo'lak: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService, mavjud emas.", show: "<b>argument CarsService at index [0] is available</b>: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService, mavjud emas.", focus: ['e-what'] },
    { id: 'd', key: "<b>Qayerda?</b> CarsModule", text: "Uchinchi bo'lak: qaysi modulda qidirdi, CarsModule'da. Mana, uch savolga javob bor: kim, nima yetishmayapti, qayerda.", show: "<b>in the CarsModule module</b>: qaysi modulda qidirdi, CarsModule'da. Mana, uch savolga javob bor: <b>kim, nima yetishmayapti, qayerda</b>.", focus: ['e-where'] },
    { id: 'e', key: "Nest yechimlarni <b>o'zi sanaydi</b>", text: "Pastda Nest o'zi yechimlarni sanaydi: CarsService provider bo'lsa, u shu modulda bormi? Javob: cars module ni ochamiz, providers'ga CarsService'ni qaytaramiz.", focus: ['e-solutions'] },
    { id: 'f', key: "Eng ko'p uchraydigan xato → <b>modul faylini oching</b>", text: "Bu Nest'dagi eng ko'p uchraydigan xato. Uni ko'rsangiz, har doim modul faylini oching.", focus: [] },
  ],
};
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg, beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 1 && beat <= 4}><CodePanel file="src/cars/cars.module.ts" numbers={false} lines={MODULE_BROKEN} /></Block>
    <Block at={1} beat={beat}><CodePanel file="terminal — server yiqildi" numbers={false} wrap style={{ background: '#1F1115' }} beat={beat} lines={ERR1} focus={seg.focus} /></Block>
    <Block at={5} beat={beat}><div className="mk-rule"><b>Kim · nima · qayerda.</b> «can't resolve dependencies» ko'rsangiz — modul faylini oching, <code>providers</code>'ni tekshiring.</div></Block>
  </>)} />;
}

// --- S19 jim xato (+ bashorat) ---
const S19 = {
  kicker: '5-bosqich · buzamiz 2', title: "Buzamiz 2: imports'da CarsModule yo'q",
  segments: [
    { id: 'a', key: "Bosh modul <code>imports</code>'idan CarsModule o'chirildi", text: "Ikkinchi holat. app module da imports ro'yxatidan CarsModule'ni olib tashladik." },
    { id: 'b', key: "Bashorat: server ishga tushadimi?", text: "Bashorat qiling: serverni ishga tushirsak, xato chiqib yiqiladimi, yoki ishga tushadimi?", ask: { q: 'Server nima qiladi?', opts: ['Xato bilan yiqiladi', 'Ishga tushadi'], answer: 1 } },
    { id: 'c', key: "<b>Ishga tushdi</b>, xato yo'q", text: "Server ishga tushdi, muvaffaqiyatli deb yozdi, hamma narsa yaxshidek. Xato yo'q." },
    { id: 'd', key: "Lekin cars → <b>404</b>. Ildiz ishlaydi", text: "Lekin cars manzilini so'rasak, to'rt yuz to'rt, Cannot GET cars. Ildiz manzil esa ishlaydi.", show: "Lekin <code>/cars</code> so'rasak, <b>404, Cannot GET /cars</b>. <code>/</code> esa ishlaydi." },
    { id: 'e', key: "Nest cars papkasini <b>umuman o'qimadi</b>", text: "Nima bo'ldi? AppModule CarsModule'ni ulamadi, shuning uchun Nest cars papkasini umuman o'qimadi. Xato yo'q, chunki Nest uchun u modul shunchaki yo'q. Bu jim xato, eng xavflisi." },
    { id: 'f', key: "Jurnalda <b>CarsController satri yo'q</b>", text: "Buni qanday topasiz? Jurnalga qarang: CarsController satri yo'q, cars uchun Mapped satri yo'q. Jurnalni o'qishni odat qiling degan edim, sabab mana shu." },
    { id: 'g', key: "Qoida: 404 + kod to'g'ri → <b>jurnal, keyin imports</b>", text: "Qoida: marshrut to'rt yuz to'rt bersa va kodingiz to'g'ri ko'rinsa, avval jurnalda Mapped satrini qidiring, keyin bosh modulning imports ro'yxatini tekshiring." },
  ],
};
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 2 && beat !== 4}><CodePanel file="src/app.module.ts" numbers={false} lines={[{ h: `<span class="d">@Module</span>({` }, { gone: true, h: `  imports: [<span class="c">CarsModule</span>],` }, { neu: true, h: `  imports: [],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }]} /></Block>
    <Block at={2} beat={beat}><CodePanel file="terminal — xato YO'Q" numbers={false} wrap style={{ background: '#111827' }} beat={beat} lines={[
      { at: 2, h: `[Nest] LOG [InstanceLoader] AppModule dependencies initialized` },
      { at: 2, h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
      { at: 2, h: `[Nest] LOG [RouterExplorer] Mapped {/, GET} route` },
      { at: 5, id: 'miss', keep: true, h: `<span class="er">⟵ bu yerda CarsController {/cars} va Mapped {/cars…} bo'lishi kerak edi — yo'q</span>` },
      { at: 2, id: 'ok', h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
      { at: 3, h: `` },
      { at: 3, h: `<span class="p">GET /cars</span> → <span class="er">404</span>  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}` },
      { at: 3, h: `<span class="p">GET /</span>     → <span class="ok">200</span>  Hello World!` }]} focus={beat === 2 ? ['ok'] : (beat === 5 ? ['miss'] : [])} /></Block>
    <Block at={6} beat={beat}><div className="mk-rule"><b>404 + kod to'g'ri ko'rinadi?</b> 1) jurnalda <code>Mapped</code> satrini qidiring · 2) bosh modulning <code>imports</code>'ini tekshiring.</div></Block>
  </>)} />;
}

// --- S20 Controller dekoratori yo'q ---
const S20 = {
  kicker: '5-bosqich · buzamiz 3', title: "Buzamiz 3: Controller dekoratori yo'q",
  segments: [
    { id: 'a', key: "Dekorator o'chirildi, klass qoldi → <b>yiqiladi</b>", text: "Uchinchi holat: cars controller da Controller dekoratorini o'chirdik, klass joyida qoldi. Server yiqiladi." },
    { id: 'b', key: "«<b>Invalid controller</b>»: belgi yo'q, lekin ro'yxatda bor", text: "Xabar: noto'g'ri controller aniqlandi. CarsController'da Controller dekoratori yo'q, lekin u qaysidir modulning controllers ro'yxatida turibdi.", show: "<b>An invalid controller has been detected.</b> CarsController does not have the @Controller() decorator, but it is being listed in the controllers array of some module." },
    { id: 'c', key: "Belgi bo'lmasa Nest <b>tanimaydi</b>", text: "Nest aniq aytyapti: siz uni ro'yxatga yozgansiz, lekin klassda belgi yo'q. Dekoratorlar ekranida aytganimni eslang: belgi bo'lmasa, Nest klassni tanimaydi." },
    { id: 'd', key: "Yechim: <b>bitta satr</b>, dekoratorni qaytarish", text: "Yechim bitta satr: dekoratorni qaytarish. O'quvchilar buni ko'pincha kodni nusxalab yozganda, birinchi satrni tushirib qoldirganda qiladi." },
  ],
};
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ beat }) => {
    const fixed = beat >= 3;
    return (<>
      <CodePanel key={fixed ? 'f' : 'b'} file="src/cars/cars.controller.ts" lines={[
        { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
        { h: `` },
        fixed ? { neu: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` } : { gone: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)   <span class="cm">← o'chirildi</span>` },
        { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
        { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
        { h: `  <span class="cm">// …</span>` },
        { h: `}` }]} />
      <Block at={1} beat={beat} dim={fixed}><CodePanel file="terminal — server yiqildi" numbers={false} wrap style={{ background: '#1F1115' }} lines={[
        { h: `UnknownRequestMappingException [Error]: <span class="er">An invalid controller has been detected.</span>` },
        { h: `"CarsController" <span class="er">does not have the @Controller() decorator</span>` },
        { h: `but it is being listed in the "controllers" array of some module.` }]} /></Block>
      <Block at={3} beat={beat}><div className="mk-rule"><b>Yechim: bitta satr.</b> Dekoratorni qaytaring. Nusxalashda birinchi satr tushib qolgan bo'ladi.</div></Block>
    </>);
  }} />;
}

// --- S21 Injectable yo'q (+ bashorat) ---
const S21 = {
  kicker: '5-bosqich · buzamiz 4', title: "Buzamiz 4: Injectable dekoratori yo'q",
  segments: [
    { id: 'a', key: "Service'dan <b>Injectable</b> o'chirildi", text: "To'rtinchi holat. cars service dan Injectable dekoratorini o'chirdik. Service'ning o'zida konstruktor yo'q, u hech kimga bog'liq emas." },
    { id: 'b', key: "Bashorat: ishlaydimi?", text: "Bashorat qiling: serverni ishga tushirsak, cars manzili ishlaydimi?", ask: { q: 'Injectable dekoratorisiz /cars ishlaydimi?', opts: ['Ha, ishlaydi', "Yo'q, xato chiqadi"], answer: 0 } },
    { id: 'c', key: "<b>Ishlayapti.</b> Nega?", text: "Kutilmagan natija: hammasi ishlayapti, cars manzili ikki yuz qaytaryapti. Nega? CarsService'ning o'zining konstruktorida hech qanday bog'liqlik yo'q. Nest uni bog'liqliksiz yaratib qo'ya oldi." },
    { id: 'd', key: "Injectable = «konstruktorga qarab <b>nima kerakligini aniqla</b>»", text: "Injectable aslida Nest'ga shuni aytadi: bu klassning konstruktoriga qarab, unga nima kerakligini aniqlang. Belgi bo'lmasa, Nest konstruktorga qaramaydi." },
    { id: 'd2', key: "Bog'liqlik qo'shsak: <b>server ishga tushadi</b>, so'rovda <b>500</b>. Jim xato", text: "Endi sinab ko'ramiz: shu Injectable'siz Service'ga bog'liqlik qo'shamiz, konstruktorida PricingService so'raladi. Natija kutilmagan: server xatosiz ishga tushadi, Mapped satrlari joyida. Lekin cars so'rovi besh yuz qaytaradi, jurnalda TypeError: undefined ning withDiscount xossasini o'qib bo'lmaydi. Nest bog'liqlikni jimgina yetkazmadi, maydon bo'sh qoldi. Bu jim xato: ishga tushishda emas, birinchi so'rovda chiqadi.", show: "Injectable'siz Service'ga bog'liqlik qo'shdik (<code>constructor(private pricing: PricingService)</code>). Server <b>xatosiz ishga tushadi</b>, lekin <code>GET /cars</code> → <b>500</b>, jurnalda <code>TypeError: Cannot read properties of undefined (reading 'withDiscount')</code>. Nest bog'liqlikni jimgina yetkazmadi — maydon bo'sh. <b>Jim xato</b>: ishga tushishda emas, birinchi so'rovda." },
    { id: 'e', key: "Qoida: <b>har Service'ga yoziladi</b>, kerak bo'lmasa ham", text: "Shuning uchun qoida sodda: Injectable har Service'ga yoziladi, hozir kerak bo'lmasa ham. O'quvchi men o'chirdim, ishlayapti, demak kerak emas desa, siz nega kerakligini tushuntira olasiz: bog'liqlik paydo bo'lganda xato ishga tushishda emas, so'rov paytida chiqadi, uni topish qiyin." },
  ],
};
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ beat }) => (<>
    <CodePanel file="src/cars/cars.service.ts" lines={[
      { gone: true, h: `<span class="d">@Injectable</span>()   <span class="cm">← o'chirildi</span>` },
      { h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
      { id: 'ctor', h: `  <span class="cm">// konstruktor yo'q — hech kimga bog'liq emas</span>` },
      { h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [ <span class="cm">…</span> ];` },
      { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.cars; }` },
      { h: `}` }]} focus={beat === 0 || beat === 2 ? ['ctor'] : []} />
    <Block at={2} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
      { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
      { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
      { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]` }]} /></Block>
    <Block at={4} beat={beat} dim={beat >= 5}><CodePanel file="terminal — Injectable'siz + bog'liqlik (haqiqiy chiqish)" numbers={false} wrap style={{ background: '#1F1115' }} lines={[
      { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
      { h: `<span class="p">GET /cars</span> → <span class="er">500</span>  {"statusCode":500,"message":"Internal server error"}` },
      { h: `[Nest] ERROR [ExceptionsHandler] <span class="er">TypeError: Cannot read properties of undefined (reading 'withDiscount')</span>` },
      { h: `    at CarsService.findAll (src/cars/cars.service.ts:21:22)` }]} /></Block>
    <Block at={5} beat={beat}><div className="mk-rule"><b>Qoida:</b> <code>@Injectable()</code> har Service'ga yoziladi, bog'liqligi bo'lmasa ham. Bo'lmasa — bog'liqlik paydo bo'lganda <b>jim xato</b>: server ishga tushadi, so'rovda 500.</div></Block>
  </>)} />;
}

// --- Tekshiruv 4: qaysi satr xato (modul) ---
const LC2_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { OrdersController } <span class="k">from</span> <span class="s">'./orders.controller'</span>;` },
  { h: `<span class="k">import</span> { OrdersService } <span class="k">from</span> <span class="s">'./orders.service'</span>;` },
  { h: `<span class="k">import</span> { PaymentService } <span class="k">from</span> <span class="s">'./payment.service'</span>;` },
  { h: `` },
  { h: `<span class="d">@Module</span>({` },
  { h: `  imports: [],` },
  { h: `  controllers: [<span class="c">OrdersController</span>, <span class="c">PaymentService</span>],` },
  { h: `  providers: [<span class="c">OrdersService</span>],` },
  { h: `})` },
  { h: `<span class="k">export class</span> <span class="c">OrdersModule</span> {}` },
];
function ScreenLC2(p) {
  return <LineCheck {...p} kicker="Tekshiruv 4" eyebrow="Tekshiruv · 4 / 5 — qaysi satr xato?" title="Server yiqiladi: «can't resolve dependencies of the OrdersController»"
    q="To'rtinchi tekshiruv. Bu modul bilan server yiqiladi: OrdersController'ning bog'liqligi topilmadi deydi. Xato qaysi satrda? Bosing."
    file="src/orders/orders.module.ts" lines={LC2_LINES} target={[7, 8]}
    ok="PaymentService Service, u controllers ro'yxatiga yozilgan, providers'da esa yo'q. Ikkala satr birga tuzatiladi: sakkizinchi satrdan PaymentService olinadi, to'qqizinchi satrga, providers'ga, qo'shiladi. Controllers'da faqat OrdersController qoladi."
    okShort="8 va 9-satr birga: PaymentService controllers'dan olinadi (8), providers'ga qo'shiladi (9)."
    hint="Xato ro'yxatlarda. Har narsa o'z ro'yxatidami: Controller controllers'da, Service providers'da?" />;
}

// --- S22 Error vs HttpException ---
const S22 = {
  kicker: '5-bosqich · xato turi', title: 'Xatoning ikki turi: Error va HttpException',
  segments: [
    { id: 'a', key: "findOne'da oddiy <b>Error</b> tashladik", text: "Oxirgi holat xato haqida. findOne ichida NotFoundException o'rniga oddiy Error tashladik, matni topilmadi." },
    { id: 'b', key: "Javob: <b>500</b>, matnimiz yo'qoldi — to'g'ri shunday", text: "Javob: besh yuz, Internal server error. Bizning topilmadi matnimiz yo'qoldi. Nest kutilmagan xatoni foydalanuvchiga ko'rsatmaydi, bu to'g'ri: ichki tafsilot tashqariga chiqmasligi kerak." },
    { id: 'c', key: "<b>HttpException oilasi</b>: Nest taniydi, status + xabar", text: "NotFoundException esa Nest'ning HttpException oilasidan. Nest uni taniydi va to'g'ri status bilan, xabari bilan qaytaradi." },
    { id: 'd', key: "400 · 401 · 403 · 404", text: "Oilada boshqalari ham bor: BadRequest to'rt yuz, Unauthorized to'rt yuz bir, Forbidden to'rt yuz uch, NotFound to'rt yuz to'rt." },
    { id: 'e', key: "Qoida: foydalanuvchi bilishi kerak → HttpException. «Nega 500?» → <b>qanday xato tashladingiz?</b>", text: "Qoida: foydalanuvchi bilishi kerak bo'lgan xato HttpException bilan tashlanadi, qolgani besh yuz bo'lib qoladi. O'quvchi nega besh yuz chiqyapti desa, birinchi savolingiz: qanday xato tashladingiz?" },
  ],
};
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ beat }) => (<>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={0} beat={beat} dim={beat >= 2 && beat <= 3}><CodePanel file="oddiy Error" numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">Error</span>(<span class="s">'topilmadi'</span>);` },
        { at: 1, h: `` },
        { at: 1, h: `<span class="p">GET /cars/99</span> → <span class="er">500</span>` },
        { at: 1, h: `{"statusCode":500,"message":"Internal server error"}` },
        { at: 1, h: `<span class="cm">// «topilmadi» yo'qoldi — yashirildi</span>` }]} /></Block>
      <Block at={2} beat={beat}><CodePanel file="HttpException oilasi" numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">'Car with id 99 not found'</span>);` },
        { h: `` },
        { h: `<span class="p">GET /cars/99</span> → <span class="ok">404</span>` },
        { h: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` }]} /></Block>
    </div>
    <Block at={3} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
      {[['BadRequestException', 400], ['UnauthorizedException', 401], ['ForbiddenException', 403], ['NotFoundException', 404]].map(([n, c], i) => <div key={n} className="mk-card" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}><h5 style={{ color: T.accent }}>{c}</h5><code style={{ fontSize: 12 }}>{n}</code></div>)}
    </div></Block>
    <Block at={4} beat={beat}><div className="mk-rule"><b>Foydalanuvchi bilishi kerak</b> → HttpException (404/400/401/403). Qolgani → 500, xabari yashirin.</div></Block>
  </>)} />;
}

// --- S23 Tekshiruv 5 — xatoni o'qish ---
function Screen23(p) {
  const above = <CodePanel numbers={false} wrap style={{ marginBottom: 18, background: '#1F1115' }} lines={[
    { h: `Nest can't resolve dependencies of the OrdersController (<span class="er">?</span>, OrdersService).` },
    { h: `Please make sure that the argument <span class="er">PaymentService at index [0]</span> is available` },
    { h: `in the <span class="er">OrdersModule</span> module.` }]} />;
  return <MCRetry {...p} kicker="Tekshiruv 5" eyebrow="Tekshiruv · 5 / 5 — xatoni o'qish" above={above}
    title="Bu o'quvchingizning loyihasi. Qaysi faylni ochasiz va nimani tuzatasiz?"
    q="Beshinchi tekshiruv. Ekrandagi xabarni o'qing. Bu sizning emas, o'quvchingizning loyihasi, u yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?"
    opts={["orders.controller.ts — konstruktordan OrdersService'ni o'chirish", "orders.module.ts — providers'ga PaymentService qo'shish", "app.module.ts — imports'ga OrdersController qo'shish", "payment.service.ts — Controller dekoratori qo'shish"]} correct={1}
    ok="orders module, providers ro'yxatiga PaymentService. Xabarda hamma narsa yozilgan: kim, OrdersController; nima yetishmayapti, PaymentService, index nol; qayerda, OrdersModule. Qavsda so'roq belgisi birinchi o'rinda, OrdersService ikkinchi o'rinda topilgan. Demak faqat PaymentService yetishmayapti."
    okShort="orders.module.ts → providers: [OrdersService, PaymentService]. Kim: OrdersController · nima: PaymentService, index [0] · qayerda: OrdersModule."
    wrong={{ 0: "OrdersService topilgan, muammo unda emas.", 2: "Controller imports'ga yozilmaydi, imports faqat modullar uchun.", 3: "Controller dekoratori Service'ga qo'yilmaydi; bu xabar PaymentService modul ro'yxatida yo'qligini aytyapti." }} />;
}

// --- Amaliyot 3: o'zingiz buzing va tuzating ---
const P3 = {
  kicker: 'Amaliyot 4 / 4', eyebrow: "Hozir o'zingizda · 5 daqiqa", title: "O'zingiz buzing va tuzating", tableAt: 3,
  segments: [
    { id: 'a', key: "Endi <b>siz buzasiz</b>: ikki holat", text: "Oxirgi amaliyot: endi siz buzasiz. Ikki holat, besh daqiqa. Maqsad xatoni o'z ko'zingiz bilan ko'rish va o'qish.", hl: [] },
    { id: 'b', key: "1 · providers'ni bo'shating → xatoni o'qing → qaytaring", text: "Birinchi: cars module da providers ro'yxatini bo'shating, serverni ishga tushiring, xatodan kim, nima, qayerda ni toping. Xabardagi in the nuqta nuqta module so'zlari orasidagi modul nomini isbot maydoniga yozing, keyin qaytaring.", hl: [0] },
    { id: 'c', key: "2 · imports'dan CarsModule'ni oling → jurnalga qarang", text: "Ikkinchi: app module da imports'dan CarsModule'ni olib tashlang. Server ishga tushadi. Jurnalda qaysi satr yo'qolganini toping, cars manzilini so'rang, keyin qaytaring.", hl: [1] },
    { id: 'd', key: "Isbot: <b>skrinshot</b> (Mapped satrlari + cars 99 javobi)", text: "Hammasi qaytarilgach, jurnaldagi Mapped satrlari va cars to'qson to'qqiz javobi ko'ringan skrinshotni saqlab qo'ying. Bu sizning bajarganingiz isboti, platformada amaliyotni yuklash oynasi bo'ladi.", hl: [2] },
  ],
};
const P3_STEPS = [
  { t: "providers bo'sh", cmds: [], exp: "«Nest can't resolve dependencies of the CarsController (?)» → kim · nima · qayerda → providers: [CarsService] qaytaring" },
  { t: "imports'da CarsModule yo'q", cmds: [], exp: "server ishga tushadi · jurnalda CarsController satri YO'Q · GET /cars → 404 → imports: [CarsModule] qaytaring" },
  { t: 'Skrinshot', cmds: [], exp: 'jurnalda 3 ta Mapped {/cars…} + GET /cars/99 → 404 JSON' },
];
const P3_TROUBLE = [
  ['Qaytardim, baribir xato', "Faylni saqladingizmi? start:dev saqlashda o'zi qayta yuklaydi; terminalda yangi jurnalni kuting"],
  ['Boshqa xato chiqdi', "Xabarni bo'lak-bo'lak o'qing: kim · nima · qayerda. Potential solutions ro'yxati yechimni aytadi"],
];
const P3_PROOF = { label: 'Isbot: xabardagi «in the ___ module» — modul nomi', placeholder: 'CarsModule', check: (v) => /^carsmodule$/i.test(v.replace(/\s/g, '')), wrong: "Xabarni qayta o'qing: «in the … module» orasidagi nom" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  7-BOSQICH · ko'prik (2), o'tish rejasi (3), savollar, o'z-sinov, yakun + ILDIZ
// ============================================================
const TREE = [
  { t: 'IntroNestArxitechture/', f: true }, { t: '  src/main.ts', g: 'g' },
  { t: '  src/api/', f: true }, { t: '    app.module.ts', g: 'g' }, { t: '    admin/admin.module.ts', g: 'g' }, { t: '    admin/admin.controller.ts', g: 'g' }, { t: '    admin/admin.service.ts', g: 'g' }, { t: '    admin/dto/create-admin.dto.ts', g: 'y' }, { t: '    auth/ (kirish)', g: 'r' },
  { t: '  src/core/', f: true }, { t: '    entity/admin.entity.ts', g: 'y' }, { t: '    repository/admin.repository.ts', g: 'y' },
  { t: '  src/common/', f: true }, { t: '    guard/auth.guard.ts', g: 'r' }, { t: '    guard/roles.guard.ts', g: 'r' }, { t: '    decorator/', g: 'r' },
  { t: '  src/infrastructure/', f: true }, { t: '    lib/BaseService.ts', g: 'r' }, { t: '    lib/token/Token.ts', g: 'r' }, { t: '    response/successRes.ts', g: 'r' }, { t: '    pagination/', g: 'r' },
];
const S25a = {
  kicker: "7-bosqich · ko'prik", title: "O'quvchi clone qiladigan loyiha",
  segments: [
    { id: 'a', key: "O'quvchi <b>noldan yozmaydi</b>: tayyor loyihani clone qiladi", text: "Endi o'quvchi darsiga qaraymiz, chunki u bu mavzuni boshqacha ko'radi. O'quvchi noldan yozmaydi: GitHub'dan tayyor loyihani clone qiladi, IntroNestArxitechture, va uni ishga tushiradi.", lit: null },
    { id: 'b', key: "Kattaroq: <code>api</code> · <code>core</code> · <code>common</code> · <code>infrastructure</code>", text: "Loyiha kattaroq: api, core, common, infrastructure papkalari.", lit: 'f' },
    { id: 'c', key: "<b>Yashil</b> — bugun to'liq bilasiz", text: "Yashil belgilangan joylarni siz bugun to'liq bilasiz: admin module, admin controller, admin service, main. Ular aynan bizning cars fayllarimiz, faqat admin uchun va kattaroq.", lit: 'g' },
    { id: 'd', key: "<b>Sariq</b> — keyingi dars: entity, dto, repository", text: "Sariq joylar keyingi darsda: entity, bu bazadagi jadval shakli; dto, kiruvchi ma'lumot shakli; repository, baza bilan gaplashuvchi.", lit: 'y' },
    { id: 'e', key: "<b>Kulrang</b> — keyinroq: auth, guard, BaseService, token, javob shakli", text: "Kulrang joylar undan keyin: auth moduli, guard, BaseService, token, bir xil javob shakli. Bu fayllarning kodini bu darsda ko'rmaysiz, bu ataylab. O'quvchi ularni so'rasa, javob: nom va vazifa, kod keyingi darslarda. Hozir faqat qayerda turganini biling.", show: "Kulrang joylar undan keyin: auth, guard, BaseService, token, bir xil javob shakli. Bu fayllarning kodini bu darsda ko'rmaysiz — ataylab. O'quvchi so'rasa: <b>nom va vazifa, kod keyingi darslarda</b>.", lit: 'r' },
  ],
};
function Screen25a(p) {
  return <Lesson p={p} S={S25a} scene={({ seg, beat }) => {
    const lit = (g) => (g === 'g' && beat >= 2) || (g === 'y' && beat >= 3) || (g === 'r' && beat >= 4);
    return <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">github.com/Azizbekcrypto/IntroNestArxitechture</div>
      <div className="mk-tree" style={{ fontSize: 13.5 }}>{TREE.map((n, i) => <div key={i} className={n.f ? (beat >= 1 ? 'f' : '') : (n.g && lit(n.g) ? n.g : '')} style={{ opacity: beat >= 1 || n.f ? 1 : 0.6, outline: seg.lit && n.g === seg.lit && lit(n.g) ? `2px solid ${T.accent}` : 'none', outlineOffset: -2 }}>{n.t}</div>)}</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 12 }}><span className="mk-tree"><span className="g" style={{ padding: '1px 6px' }}>bugun</span></span><span className="mk-tree"><span className="y" style={{ padding: '1px 6px' }}>keyingi dars</span></span><span className="mk-tree"><span className="r" style={{ padding: '1px 6px' }}>keyinroq</span></span></div>
    </div>;
  }} />;
}

const DICT = [['ofitsiant', 'Controller', "so'rovni oladi, oshxonaga uzatadi"], ['oshpaz', 'Service', 'ishni bajaradi'], ['omborchi', 'Repository', 'baza bilan gaplashadi'], ['javon chizmasi', 'Entity', 'jadval shakli'], ['buyurtma anketasi', 'DTO', "kiruvchi ma'lumot shakli"], ['nazoratchi', 'Guard', 'tokenni tekshiradi'], ['bir xil lagan', 'successRes', 'javob shakli'], ['shtat jadvali', 'Module', "ro'yxat"]];
const S25b = {
  kicker: "7-bosqich · ko'prik", title: "O'quvchi darsining tili: restoran",
  segments: [
    { id: 'a', key: "O'quvchi darsi <b>restoran tilida</b> gapiradi", text: "O'quvchi darsi restoran tilida gapiradi: Controller ofitsiant, Service oshpaz, Repository omborchi, Guard nazoratchi, Module shtat jadvali. O'quvchi shu so'zlarda o'ylaydi.", n: 8 },
    { id: 'b', key: "«oshpaz» desa — siz <b>Service</b> ekanini bilasiz", text: "Siz endi ikkala tilni bilasiz: o'quvchi oshpaz desa, siz Service ekanini bilasiz va to'g'ri faylni ko'rsatasiz. Darsda ikkala so'zni birga ayting: oshpaz, ya'ni Service.", n: 8 },
    { id: 'c', key: "Metafora chegarasi: <b>vazifa</b> o'xshaydi, kod emas", text: "Bitta ogohlantirish: metafora vazifani tushuntiradi, kodni emas. O'quvchi ofitsiant oshxonaga kirmaydi deganda, Controller Service'ni chaqiradi, lekin ichida hisob qilmaydi degan ma'noni tushunsin. Shu chegarani siz ushlab turasiz.", n: 8 },
  ],
};
function Screen25b(p) {
  return <Lesson p={p} S={S25b} scene={({ beat }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi eshitadi → atama → vazifa</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama</th><th>vazifa</th></tr></thead><tbody>
      {DICT.map(([a, b, c], i) => <tr key={a} style={{ animation: `mk-up .35s ${i * 0.08}s ease both` }}><td>{a}</td><td><code>{b}</code></td><td style={{ color: T.ink2 }}>{c}</td></tr>)}
    </tbody></table>
    <Block at={2} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>Ikkala so'zni birga ayting: <b>«oshpaz, ya'ni Service»</b>. Metafora vazifani tushuntiradi, kodni emas.</div></Block>
  </div>} />;
}

// --- O'tish rejasi 1: o'quvchi darsining xaritasi (m4a-01, 22 ekran) ---
const MAP = [
  { t: 'Kirish', s: 's0–s1', d: "1240 qatorli server.js og'rig'i → «tayyor loyihani clone qilamiz», 4 qadam rejasi", m: "Siz buni shu darsning 2-ekranida ko'rdingiz: o'quvchi ham aynan shu og'riqdan boshlaydi. Nest nomini erta aytmang, avval og'riq." },
  { t: 'Clone va ishga tushirish', s: 's2–s4', d: "git clone + npm install, .env to'ldirish, start:dev; test: kalit qayerda turadi", m: "Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang." },
  { t: 'Swagger va bino xaritasi', s: 's5–s8', d: 'Swagger eshiklari (endpointlar), papkalar daraxti; test: Controller vazifasi', m: "«Ofitsiant» so'zi shu yerda kiradi. Daraxtda yashil fayllarni (module/controller/service) o'zingiz ko'rsating." },
  { t: "Buyurtma yo'li", s: 's9–s10', d: 'Guard → Controller → Service → Repository → successRes tartibi sudrab teriladi; test', m: "Bu bizning «so'rov yo'li» ekranimiz, faqat ikki bekat ko'p: Guard va Repository. Nega ko'p — keyingi dars deb ayting." },
  { t: 'Qatlamlar', s: 's11–s16', d: 'Entity/BaseEntity, DTO (201/400), BaseService (CRUD tayyor), Module (smena), 5 qadam tartibi; test', m: "Chuqur emas: nom va vazifa. Entity va DTO keyingi darsda qo'l bilan yoziladi." },
  { t: 'Qurish va yakun', s: 's18–s20', d: "AI 5 faylni yozadi, yakuniy debugging (xato qatorni olib tashlash), amaliy topshiriq, arena, kartochkalar", m: "Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi." },
];
const R1 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · «Nest arxitektura — tirik ko'rish»", title: "O'quvchi darsining xaritasi: 6 blok, 22 ekran",
  segments: [
    { id: 'a', key: "O'quvchi darsi: <b>6 blok, 22 ekran</b>", text: "Endi o'quvchi darsini o'zini ko'ramiz, chunki siz uni o'tasiz. Yigirma ikki ekran, oltita blok. Har blok uchun o'quvchi nima qiladi va siz nima deysiz.", hl: [] },
    { id: 'b', key: "1 · Kirish: <b>o'sha og'riq</b>", text: "Birinchi blok, kirish: o'quvchi ming ikki yuz qirq qatorli faylni ko'radi va tayyor loyihani clone qilish rejasini oladi. Siz buni shu darsning boshida ko'rdingiz. Nest nomini erta aytmang, avval og'riq.", hl: [0] },
    { id: 'c', key: "2 · Clone va ishga tushirish: <b>eng ko'p vaqt</b>", text: "Ikkinchi blok, clone va ishga tushirish: git clone, npm install, env fayli, start dev. Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang.", hl: [1] },
    { id: 'd', key: "3 · Swagger va bino xaritasi: <b>«ofitsiant» kiradi</b>", text: "Uchinchi blok: Swagger'da eshiklarni ko'radi, keyin papkalar daraxtini. Ofitsiant so'zi shu yerda kiradi. Daraxtda module, controller, service fayllarini o'zingiz ko'rsating.", hl: [2] },
    { id: 'e', key: "4 · Buyurtma yo'li: <b>bizning so'rov yo'li + 2 bekat</b>", text: "To'rtinchi blok, buyurtma yo'li: o'quvchi nazoratchi, ofitsiant, oshpaz, omborchi, lagan tartibini sudrab teradi. Bu bizning so'rov yo'li ekranimiz, faqat ikki bekat ko'p: Guard va Repository. Nega ko'p, keyingi dars deb ayting.", hl: [3] },
    { id: 'f', key: "5 · Qatlamlar: <b>nom va vazifa</b>, chuqur emas", text: "Beshinchi blok, qatlamlar: Entity, DTO, BaseService, Module va besh qadam tartibi. Chuqur emas: nom va vazifa. Entity va DTO keyingi darsda qo'l bilan yoziladi.", hl: [4] },
    { id: 'g', key: "6 · Qurish va yakun: <b>debugging'da bugungi qoida</b>", text: "Oltinchi blok: o'quvchi AI'ga beshta faylni yozdiradi, keyin yakuniy debugging, xato qatorni topib olib tashlaydi, so'ng amaliy topshiriq va arena. Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi.", hl: [5] },
  ],
};
function ScreenR1(p) {
  return <Lesson p={p} S={R1} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{seg.hl.includes(i) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz: {b.m}</div>}</div>
    </div>)}
  </div>} />;
}

// --- O'tish rejasi 2: o'quvchi qoqiladigan joylar ---
const STUMBLE = [
  { q: 'git clone ishlamaydi', a: "Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring." },
  { q: 'npm install uzoq yoki xato', a: "Sabr: 2–5 daqiqa normal. Xato bo'lsa Node versiyasini tekshiring (20+), node_modules'ni o'chirib qayta urining." },
  { q: ".env to'ldirilmagan — server yiqiladi", a: "Loyiha PostgreSQL'ga ulanadi: «Unable to connect to the database» — ikkinchi satr sababni aytadi (keyingi ekranda to'rt xabar). .env.example'dan nusxa oling, PostgreSQL darsidagi bazani yoqing." },
  { q: 'Port 3000 band', a: "Oldingi dars serveri ochiq qolgan. Uni yoping yoki PORT=3001 bilan ishga tushiring." },
  { q: "«can't resolve dependencies»", a: "Siz endi o'qiy olasiz: kim, nima, qayerda. O'quvchi bilan birga jurnalni o'qing, javobni aytmang, savol bering: qaysi modul? qaysi ro'yxat?" },
  { q: '«Nega Express emas?» yoki metafora chalkashdi', a: "Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring: oshpaz, ya'ni Service." },
];
const R2 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · darsda nima bo'ladi", title: "O'quvchi qoqiladigan 6 joy",
  segments: [
    { id: 'a', key: "Sinfda <b>albatta</b> uchraydigan 6 holat", text: "Darsda albatta uchraydigan oltita holat. Har biriga tayyor javobingiz bo'lsin.", hl: [] },
    { id: 'b', key: "1 · clone ishlamaydi → <b>ZIP zaxirasi</b>", text: "Birinchi: git clone ishlamaydi. Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring.", hl: [0] },
    { id: 'c', key: "2 · npm install → <b>sabr, Node 20+</b>", text: "Ikkinchi: npm install uzoq yoki xato. Ikki-besh daqiqa normal. Xato bo'lsa Node versiyasini tekshiring, yigirma yoki undan yuqori bo'lsin, node modules papkasini o'chirib qayta urining.", hl: [1] },
    { id: 'd', key: "3 · .env va PostgreSQL → <b>server yiqiladi</b>", text: "Uchinchi, eng muhimi: env fayli to'ldirilmagan. Loyiha PostgreSQL'ga ulanadi. Bazaning manzili bo'lmasa yoki PostgreSQL ishlamasa, server ishga tushmaydi: Unable to connect to the database. Keyingi ekranda shu xatoning uch ko'rinishini o'qiymiz.", hl: [2] },
    { id: 'e', key: "4 · port band → <b>oldingi serverni yoping</b>", text: "To'rtinchi: port uch ming band. Oldingi dars serveri ochiq qolgan. Uni yoping yoki boshqa port bilan ishga tushiring.", hl: [3] },
    { id: 'f', key: "5 · can't resolve → <b>birga o'qing, javobni aytmang</b>", text: "Beshinchi: can't resolve dependencies xatosi. Siz endi o'qiy olasiz: kim, nima, qayerda. O'quvchi bilan birga jurnalni o'qing, javobni aytmang, savol bering: qaysi modul, qaysi ro'yxat.", hl: [4] },
    { id: 'g', key: "6 · «Nega Express emas?» → <b>bitta gap</b>", text: "Oltinchi: nega Express emas degan savol yoki metafora chalkashuvi. Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring.", hl: [5] },
  ],
};
function ScreenR2(p) {
  return <Lesson p={p} S={R2} scene={({ seg }) => <div className="mk-qa">
    {STUMBLE.map((s, i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {s.q}</b>{(seg.hl.includes(i) || seg.hl.length === 0) && <p>{s.a}</p>}</button>)}
  </div>} />;
}

// --- O'tish rejasi 2b: sinfda chiqadigan xato — baza ulanmadi (haqiqiy chiqishlar: manba/nest-out/15–18) ---
const DB_ERRS = [
  { at: 1, id: 'db1', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 1, id: 'db1', h: `Error: connect <span class="er">ECONNREFUSED</span> 127.0.0.1:5432` },
  { at: 2, h: `` },
  { at: 2, id: 'db2', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 2, id: 'db2', h: `Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: <span class="er">client password must be a string</span>` },
  { at: 3, h: `` },
  { at: 3, id: 'db3', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 3, id: 'db3', h: `error: <span class="er">password authentication failed for user "postgres"</span>` },
  { at: 4, h: `` },
  { at: 4, id: 'db4', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 4, id: 'db4', h: `error: <span class="er">database "cars_db" does not exist</span>` },
  { at: 5, h: `` },
  { at: 5, id: 'db5', h: `ERROR [TypeOrmModule] Unable to connect to the database. Retrying (10)...` },
  { at: 5, id: 'db5', h: `<span class="er">ERROR [ExceptionHandler] error: …</span>   <span class="cm">← 10 urinishdan keyin server yiqiladi</span>` },
];
const DB_ROWS = [
  { at: 1, m: 'connect ECONNREFUSED 127.0.0.1:5432', s: "PostgreSQL ishlamayapti yoki port noto'g'ri", f: "pg_isready yoki xizmatni yoqing; .env'dagi port 5432 mi" },
  { at: 2, m: 'client password must be a string', s: ".env yo'q yoki DEV_DB_URL o'qilmagan (parol undefined)", f: ".env.example'dan .env nusxalang, serverni qayta ishga tushiring" },
  { at: 3, m: 'password authentication failed for user', s: ".env'dagi parol yoki foydalanuvchi noto'g'ri", f: "psql bilan shu parolni sinang, .env'ni to'g'rilang" },
  { at: 4, m: 'database "…" does not exist', s: "ulanish va parol to'g'ri, lekin shu nomli baza yaratilmagan", f: "createdb bilan bazani yarating yoki .env'dagi nomni tekshiring" },
];
const RDB = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · sinfda eng ko'p chiqadigan xato", title: "Baza ulanmadi: to'rt xabar, to'rt sabab",
  segments: [
    { id: 'a', key: "O'quvchi loyihasi <b>PostgreSQL'ga ulanadi</b> — sinfdagi 1-xato shu", text: "Bugun to'rt Nest xatosini o'rgandingiz. Lekin sinfda eng ko'p chiqadigani boshqa: o'quvchi loyihasi PostgreSQL'ga ulanadi, va ulanish ko'pincha birinchi urinishda bo'lmaydi. Xabar har doim bir xil boshlanadi: Unable to connect to the database, Retrying. Sabab esa ikkinchi satrda. To'rtta haqiqiy holat." },
    { id: 'b', key: "1 · <b>ECONNREFUSED</b> → PostgreSQL ishlamayapti yoki port", text: "Birinchi: connect ECONNREFUSED, manzil va port. Demak shu portda hech kim javob bermayapti: PostgreSQL ishlamayapti yoki env faylida port noto'g'ri. Yechim: xizmatni yoqing, portni tekshiring.", show: "<b>connect ECONNREFUSED 127.0.0.1:5432</b>: shu portda hech kim javob bermayapti — PostgreSQL ishlamayapti yoki .env'dagi port noto'g'ri. Yechim: xizmatni yoqing, portni tekshiring." },
    { id: 'c', key: "2 · <b>client password must be a string</b> → .env yo'q", text: "Ikkinchi, eng chalg'ituvchisi: client password must be a string. Bu parol noto'g'ri degani emas. Parol umuman yo'q, undefined: env fayli yo'q yoki DEV DB URL o'qilmagan. Yechim: env example dan nusxa oling, serverni qayta ishga tushiring.", show: "<b>client password must be a string</b> — eng chalg'ituvchisi: parol noto'g'ri emas, parol <b>umuman yo'q</b> (undefined): .env yo'q yoki DEV_DB_URL o'qilmagan. Yechim: .env.example → .env, serverni qayta." },
    { id: 'd', key: "3 · <b>password authentication failed</b> → parol/foydalanuvchi", text: "Uchinchi: password authentication failed for user. Bu endi haqiqatan parol yoki foydalanuvchi nomi noto'g'ri. Yechim: env faylidagi qiymatlarni tekshiring, psql bilan sinang.", show: "<b>password authentication failed for user \"postgres\"</b>: endi haqiqatan parol yoki foydalanuvchi noto'g'ri. Yechim: .env qiymatlarini psql bilan sinang." },
    { id: 'd2', key: "4 · <b>database … does not exist</b> → baza yaratilmagan", text: "To'rtinchi: database, nomi, does not exist. Ulanish bor, parol ham to'g'ri, lekin PostgreSQL'da bunday nomli baza yo'q: uni hali hech kim yaratmagan. Yechim: bazani yarating yoki env faylidagi nomni tekshiring.", show: "<b>database \"cars_db\" does not exist</b>: ulanish va parol to'g'ri, lekin bunday nomli baza <b>yaratilmagan</b>. Yechim: <code>createdb cars_db</code> yoki .env'dagi nomni tekshiring." },
    { id: 'e', key: "Qoida: «Unable to connect» → <b>kodga tegmang</b>: .env va PostgreSQL", text: "TypeORM o'n marta qayta urinadi, keyin server yiqiladi. Qoida: Unable to connect ko'rsangiz, kodga tegmang, muammo kodda emas. Ikkinchi satrni o'qing, env faylini va PostgreSQL'ni tekshiring. Bu to'rt xabar eslatmada ham bor." },
  ],
};
function ScreenRdb(p) {
  return <Lesson p={p} S={RDB} scene={({ seg, beat }) => (<>
    <CodePanel file="terminal — o'quvchi loyihasi, haqiqiy chiqishlar" numbers={false} wrap style={{ background: '#1F1115' }} beat={beat} lines={DB_ERRS} focus={beat >= 1 && beat <= 5 ? ['db' + beat] : []} />
    <Block at={1} beat={beat}><table className="mk-tbl"><thead><tr><th>xabar (2-satr)</th><th>sabab</th><th>yechim</th></tr></thead><tbody>
      {DB_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.m}</code></td><td>{r.s}</td><td>{r.f}</td></tr>)}
    </tbody></table></Block>
    <Block at={5} beat={beat}><div className="mk-rule"><b>«Unable to connect»</b> → kodga tegmang: 2-satrni o'qing, <code>.env</code> va PostgreSQL'ni tekshiring.</div></Block>
  </>)} />;
}

// --- O'tish rejasi 3: 90 daqiqa ---
const PLAN90 = [
  { t: '0–10', n: "Kirish va og'riq", d: 'server.js misoli, 4 qadam rejasi' },
  { t: '10–30', n: 'Clone va ishga tushirish', d: "hammada server ishlaguncha; .env va PostgreSQL" },
  { t: '30–45', n: 'Swagger, bino xaritasi, 1–2-test', d: 'eshiklar, papkalar, «ofitsiant»' },
  { t: '45–60', n: "Buyurtma yo'li, 3-test", d: 'Guard → Controller → Service → Repository → successRes' },
  { t: '60–75', n: 'Qatlamlar, 4-test', d: 'Entity, DTO, BaseService, Module — nom va vazifa' },
  { t: '75–90', n: 'AI qurish, debugging, arena', d: "bugungi qoida: Controller'da hisob yo'q" },
];
const R3 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: 'm4a-01 · 90 daqiqa (taklif)', title: "Vaqt rejasi va uch qoida",
  segments: [
    { id: 'a', key: "90 daqiqa: <b>oltita bo'lak</b>", text: "Taklif qilingan vaqt rejasi: to'qson daqiqa, oltita bo'lak. Bu taklif, sinfingizga qarab o'zgartirasiz.", hl: [] },
    { id: 'b', key: "0–30: kirish va <b>hammada server ishlaguncha</b>", text: "Birinchi o'ttiz daqiqa: kirish va clone. Eng xavfli bo'lak clone va ishga tushirish, shuning uchun unga yigirma daqiqa.", hl: [0, 1] },
    { id: 'c', key: "30–60: Swagger, xarita, <b>buyurtma yo'li</b>", text: "O'ttizdan oltmishgacha: Swagger, bino xaritasi, buyurtma yo'li va uchta test.", hl: [2, 3] },
    { id: 'd', key: "60–90: qatlamlar, <b>AI qurish, debugging</b>", text: "Oltmishdan to'qsongacha: qatlamlar, AI bilan qurish, yakuniy debugging va arena.", hl: [4, 5] },
    { id: 'e', key: "Uch qoida: <b>server · ikki so'z · jurnal birga</b>", text: "Va uch qoida. Birinchi: hammaning serveri ishlamaguncha oldinga o'tmang. Ikkinchi: metafora va atamani birga ayting, oshpaz, ya'ni Service. Uchinchi: xato chiqsa jurnalni o'quvchi bilan birga o'qing, javobni aytmang.", hl: [] },
  ],
};
function ScreenR3(p) {
  return <Lesson p={p} S={R3} scene={({ seg, beat }) => (<>
    <div style={{ display: 'grid', gap: 8 }}>
      {PLAN90.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1, alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 56 }}>{b.t}</span>
        <div className="t"><b style={{ marginBottom: 0 }}>{b.n}</b><div className="exp">{b.d}</div></div>
      </div>)}
    </div>
    <Block at={4} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {[['Server avval', "hammada ishlamaguncha oldinga o'tmang"], ["Ikki so'z birga", '«oshpaz, ya\'ni Service»'], ['Jurnal birga', "javobni aytmang, savol bering"]].map(([h, d], i) => <div key={h} className="mk-card" style={{ borderColor: T.accent, animation: `mk-up .4s ${i * 0.15}s ease both` }}><h5 style={{ color: T.accent }}>{h}</h5><div style={{ fontSize: 13 }}>{d}</div></div>)}
    </div></Block>
  </>)} />;
}

// --- S26 O'quvchi so'raydigan savollar ---
const QA = [
  ['Nega Express emas, Nest?', "Loyiha katta bo'lganda tartib kerak; Nest tartibni majburiy qiladi, ichida esa o'sha Express."],
  ["Dekorator nima o'zi?", "Klass yoki metod ustidagi belgi; Nest'ga shu narsa nima ekanini aytadi, kod bajarmaydi."],
  ['providers nima?', "Shu modul yaratib beradigan narsalar, asosan Service'lar."],
  ["Service'ni nega alohida qildik?", "Alohida sinash va qayta ishlatish uchun; Controller yupqa qoladi."],
  ["Nest Express'dan tezmi?", "Yo'q, tezlik bir xil, ichida Express. Nest tezlik emas, tartib beradi."],
  ["Injectable'ni o'chirdim, ishlayapti. Kerak emasmi?", "Bog'liqligi bo'lmagani uchun ishladi; bog'liqlik paydo bo'lganda server ishga tushadi, lekin so'rovda 500 TypeError — jim xato. Shuning uchun doim yoziladi."],
];
const S26 = {
  kicker: "7-bosqich · savollar", title: "O'quvchi so'raydigan savollar",
  segments: [
    { id: 'a', key: "Sizga beriladigan <b>6 savol</b>", text: "Darsda sizga beriladigan savollar taxminan shular bo'ladi.", hl: [] },
    { id: 'q1', key: "1 · Nega Express emas? → <b>tartib</b>", text: "Birinchisi: nega Express emas, Nest? Javob: loyiha katta bo'lganda tartib kerak, Nest tartibni majburiy qiladi, ichida esa o'sha Express.", hl: [0] },
    { id: 'q2', key: "2 · Dekorator? → <b>belgi</b>", text: "Ikkinchisi: dekorator nima? Klass yoki metod ustidagi belgi, Nest'ga shu narsa nima ekanini aytadi.", hl: [1] },
    { id: 'q3', key: "3 · providers? → <b>Service'lar</b>", text: "Uchinchisi: providers nima? Shu modul yaratib beradigan narsalar, asosan Service'lar.", hl: [2] },
    { id: 'q4', key: "4 · Nega alohida Service? → <b>sinash, qayta ishlatish</b>", text: "To'rtinchisi: Service'ni nega alohida qildik? Alohida sinash va qayta ishlatish uchun, Controller esa yupqa qoladi.", hl: [3] },
    { id: 'q5', key: "5 · Tezmi? → <b>yo'q, tartib</b>", text: "Beshinchisi: Nest tezmi? Yo'q, tezlik bir xil, chunki ichida Express. Nest tezlik emas, tartib beradi.", hl: [4] },
    { id: 'q6', key: "6 · Injectable'siz ishlayapti? → <b>hozircha, keyin jim xato</b>", text: "Oltinchisi: Injectable'ni o'chirdim, ishlayapti. Bog'liqligi bo'lmagani uchun; bog'liqlik paydo bo'lganda server ishga tushadi, lekin so'rovda besh yuz, jim xato. Shuning uchun doim yoziladi.", hl: [5] },
    { id: 'z', key: "Har kartani <b>bosib</b> o'qing", text: "Har kartani bosib, javobni o'qing. O'zingiz javob bera olmaydigan savol kelsa, darsdagi shu ekranga qayting.", hl: [], closeAll: true },
  ],
};
function Screen26(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S26} scene={({ seg }) => {
    const isOpen = (i) => seg.hl.includes(i) || (!seg.closeAll ? false : open.includes(i)) || open.includes(i);
    return <div className="mk-qa">
      {QA.map(([q, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{i + 1}. {q}</b>{isOpen(i) && <p>{a}</p>}</button>)}
    </div>;
  }} />;
}

// --- S27 O'z-sinov — 8 savol, HAR SAVOLDA BITTA URINISH ---
const FINAL = [
  { q: "Nest ichida so'rovni haqiqatda qaysi kutubxona qabul qiladi?", o: ["Nest'ning o'z HTTP serveri", 'Express (platform-express)', 'Node http moduli bevosita', 'Har doim Fastify'], c: 1, e: "Nest Express ustidagi qatlam; Fastify'ga almashtirish mumkin, lekin standart Express.", s: 3 },
  { q: "@Controller('cars') va @Get(':id') birga qaysi manzilni ochadi?", o: ['/cars?id=5', '/id/cars', '/cars/5', '/:id/cars'], c: 2, e: "Controller prefiksi + metod yo'li.", s: 18 },
  { q: 'POST metodida status yozilmagan. Nest nima qaytaradi?', o: ['200', '201', '204', '202'], c: 1, e: "Nest POST uchun 201 ni o'zi qo'yadi.", s: 20 },
  { q: "«Nest can't resolve dependencies of the X (?)» — so'roq belgisi nimani bildiradi?", o: ["Noma'lum modul", "Topilmagan argument o'rni", 'Sintaksis xatosi', "Marshrut yo'q"], c: 1, e: 'Qavs ichida konstruktor argumentlari, ? — topilmagani.', s: 23 },
  { q: "Server «successfully started», /cars 404, jurnalda Mapped {/cars…} yo'q. Eng ehtimoliy sabab?", o: ["CarsModule AppModule imports'ida yo'q", "Injectable yo'q", 'Port band', "Service'da xato"], c: 0, e: "Jim xato: modul ulanmagan, Nest papkani o'qimagan.", s: 24 },
  { q: "Service ichida throw new Error('x'). Mijozga nima boradi?", o: ['404 va «x»', '500 Internal server error', '400', 'Hech narsa, server yiqiladi'], c: 1, e: 'Oddiy Error → 500, xabar yashiriladi.', s: 28 },
  { q: "Yangi xabar: «Nest can't resolve dependencies of the UsersService (?, JwtService). Please make sure that the argument ConfigService at index [0] is available in the UsersModule module.» Nima qilasiz?", o: ["users.module.ts — providers'ga ConfigService (yoki ConfigModule import)", "users.service.ts — konstruktordan JwtService'ni o'chirish", "app.module.ts — controllers'ga UsersService", "UsersService'ga @Injectable() qo'shish"], c: 0, e: "Kim: UsersService · nima: ConfigService, index [0] · qayerda: UsersModule. JwtService topilgan (ikkinchi o'rin), muammo unda emas.", s: 23 },
  { q: "orders.module.ts: controllers: [OrdersController], providers: [] — OrdersController konstruktorida OrdersService so'ralgan. Server nima qiladi?", o: ["Ishga tushadi, /orders → 404", "Yiqiladi: can't resolve dependencies of the OrdersController (?)", "Ishga tushadi, /orders → 500", "Yiqiladi: invalid controller detected"], c: 1, e: "providers bo'sh → Nest OrdersService'ni topa olmaydi → ishga tushishda yiqiladi (1-buzish bilan bir xil).", s: 23 },
];
function Screen27(p) {
  const segs = useMemo(() => [{ id: 'intro', text: UZ + "Yakuniy sinov, sakkiz savol. Bu o'zingizni halol o'lchash: har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz.", trigger: 'on_mount' }], []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const st = p.stored || {};
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(UZ + (sc >= 6 ? "Dars o'zlashtirildi. Endi o'quvchi darsiga kirsangiz, har so'z tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring. Bu normal holat, Nest birinchi kunda hammaga ham o'tirmaydi.")), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker="O'z-sinov" idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} nextReady={finished && showResult} nextDisabled={!finished}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 860, width: '100%', margin: '0 auto' }}>
        <div className="mk-say" style={{ justifyContent: 'center' }}>
          {showResult ? (<>
            <p className="mk-eyebrow">O'z-sinov · natija{attempt > 1 ? ` · ${attempt}-urinish` : ''}</p>
            <h2 className="mk-title" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{score} / {FINAL.length} — {score >= 6 ? "dars o'zlashtirildi" : "yana bir ko'rib chiqing"}</h2>
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
            <h2 className="mk-title" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>{q.q}</h2>
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

// --- S28 Yakun + eslatma ---
const CHEATSHEET = `# Nest 1-dars — mentor eslatmasi
## Buyruqlar
npm i -g @nestjs/cli · nest new cars-api · npm run start:dev
nest g module cars · nest g controller cars --no-spec · nest g service cars --no-spec
## Uch bo'lak
Controller — so'rovni oladi, Service'ni chaqiradi, qaytaradi (yupqa)
Service — ish: hisob, qoida, baza; req/res yo'q; @Injectable()
Module — ro'yxat: imports · controllers · providers; ro'yxatda yo'q = Nest uchun yo'q
## Dependency Injection
constructor(private readonly carsService: CarsService) — siz yaratmaysiz, Nest providers'dan yaratib beradi (1 nusxa)
## 4 xato
1 «can't resolve dependencies of the X (?) … argument Y at index [0] … in the Z module» → Z modulining providers'iga Y
2 server ishga tushdi, /cars 404, jurnalda Mapped {/cars…} yo'q → AppModule imports: [CarsModule]
3 «invalid controller … does not have the @Controller() decorator» → dekoratorni qaytaring
4 @Injectable'siz ishlaydi (bog'liqlik yo'q) → bog'liqlik qo'shilsa: server ishga tushadi, so'rovda 500 TypeError (jim xato) → baribir yoziladi
## Baza ulanmadi (o'quvchi loyihasi, TypeORM — «Unable to connect to the database. Retrying (1)…», 10 urinish, keyin yiqiladi)
connect ECONNREFUSED 127.0.0.1:5432 → PostgreSQL ishlamayapti yoki port noto'g'ri · SASL … client password must be a string → .env yo'q/o'qilmagan · password authentication failed for user → .env'dagi parol/foydalanuvchi noto'g'ri · database "…" does not exist → baza yaratilmagan (createdb) yoki .env'dagi nom noto'g'ri
## Yordam
Hech biri mos kelmasa: skrinshot + xato matni → mentor-kurs Telegram guruhi
## Xato turi
HttpException oilasi (NotFound 404, BadRequest 400, Unauthorized 401, Forbidden 403) → status + xabar · oddiy Error → 500, xabar yashirin
## Javoblar
GET /cars 200 · GET /cars/1 200 · GET /cars/99 404 · POST /cars 201 (o'zi) · /cars/abc → 404 «NaN» (tekshiruv yo'q — DTO keyingi dars)
## O'quvchi darsi tili
ofitsiant=Controller · oshpaz=Service · omborchi=Repository · javon chizmasi=Entity · anketa=DTO · nazoratchi=Guard · shtat jadvali=Module
## Uch qoida (dars o'tishda)
hammada server ishlaguncha oldinga o'tmang · «oshpaz, ya'ni Service» · xato chiqsa jurnalni birga o'qing, javobni aytmang`;
const S28 = {
  kicker: 'Yakun', title: 'Endi siz bilasiz',
  items: ["Nest — Express ustidagi majburiy tartib", "Controller so'rovni oladi va yupqa qoladi", "Service ishni bajaradi va so'rov haqida bilmaydi", "Module — ro'yxat, Nest faqat ro'yxatdagini ko'radi", 'Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi', "Nest xatolari o'qiladi: kim · nima · qayerda"],
  segments: [
    { id: 'a', key: "Darsni yakunlaymiz", text: "Darsni yakunlaymiz. Endi siz bilasiz.", hl: [] },
    { id: 'b1', key: "Nest = Express + <b>majburiy tartib</b>", text: "Nest bu Express ustidagi majburiy tartib.", hl: [0] },
    { id: 'b2', key: "Controller <b>yupqa</b>", text: "Controller so'rovni oladi va yupqa qoladi.", hl: [1] },
    { id: 'b3', key: "Service <b>ishlaydi</b>, so'rovni bilmaydi", text: "Service ishni bajaradi va so'rov haqida bilmaydi.", hl: [2] },
    { id: 'b4', key: "Module <b>ro'yxat</b>", text: "Module ro'yxat, Nest faqat ro'yxatdagini ko'radi.", hl: [3] },
    { id: 'b5', key: "DI: <b>Nest beradi</b>", text: "Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi.", hl: [4] },
    { id: 'b6', key: "Xatolar <b>o'qiladi</b>: kim · nima · qayerda", text: "Va eng muhimi: Nest xatolari o'qiladi, ularda kim, nima, qayerda yozilgan.", hl: [5] },
    { id: 'c', key: "<b>Eslatmani oling</b>. Keyingi dars: Entity, DTO, Repository", text: "Pastda bir sahifalik eslatma: buyruqlar, to'rt xato, qoidalar va o'quvchi darsi lug'ati. Nusxalab yoki yuklab oling. Keyingi dars: birinchi resursni qo'lda qo'shish, mashinalar: Entity, DTO va Repository. U yerda bugungi cars moduli haqiqiy PostgreSQL bazasiga ulanadi. Rahmat.", hl: [] },
  ],
};
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const download = () => { try { const b = new Blob([CHEATSHEET], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'nest-1-dars-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const b = useBeats(S28.segments);
  // Kichik ekran: eslatma 7-qadamda kiradi va sahnadan pastda qoladi — ovoz u haqida gapirganda ko'rinishga aylantiriladi
  const sceneRef = useRef(null);
  useEffect(() => {
    const s = sceneRef.current; if (!s || b.beat < 7 || s.scrollHeight <= s.clientHeight + 4) return;
    const t = s.querySelector('.mk-light'); if (!t) return;
    s.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top - s.getBoundingClientRect().top + s.scrollTop - 8), behavior: 'smooth' });
  }, [b.beat]);
  return (
    <Stage kicker={S28.kicker} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} nextReady={b.done} nextLabel="Darsni yakunlash">
      <div className="mk-body">
        <Say title={S28.title} segments={S28.segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} />
        <div className="mk-scene top" style={{ overflow: 'auto' }} ref={sceneRef}>
          <div className="mk-plan">{S28.items.map((t, i) => <div key={i} className={b.seg.hl.includes(i) ? 'hl' : (b.seg.hl.length ? 'dim' : '')} style={{ opacity: b.beat === 0 ? 0.35 : undefined }}><b>0{i + 1}</b><span>{t}</span></div>)}</div>
          <Block at={7} beat={b.beat}><div className="mk-light" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={CHEATSHEET} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 220, overflow: 'auto' }}>{CHEATSHEET}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Keyingi dars</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Birinchi resursni qo'lda qo'shish — mashinalar</div><div className="exp">Entity, DTO, Repository — CRUD · bugungi cars moduli haqiqiy PostgreSQL bazasiga ulanadi</div></div>
          </div></Block>
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  MUQOVA + ILDIZ
// ============================================================
function Cover({ onStart }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">Mentor kursi · 1-dars</p>
      <h1>NestJS arxitekturasi: Module, Controller, Service</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        <li>Jami 60–70 daqiqa: ovoz 25 daqiqa · to'rt amaliyot 25 daqiqa · 5 tekshiruv · o'z-sinov 8 savol</li>
        <li>Kerak: Node.js 20+, VS Code, terminal — amaliyot dars ichida, har amaliyotda isbot maydoni</li>
        <li>Har ekranda: ovozni qaytarish, o'chirish, «Matn» tugmasi</li>
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5a, ScreenP0, Screen5b, Screen6, Screen7, Screen8, Screen9, ScreenP1, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenLC1, Screen16, Screen17, ScreenP2, Screen18, Screen19, Screen20, Screen21, ScreenLC2, Screen22, Screen23, ScreenP3, Screen25a, Screen25b, ScreenR1, ScreenR2, ScreenRdb, ScreenR3, Screen26, Screen27, Screen28];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function NestArchMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  useCss();
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const finish = () => {
    if (finished.current) return; finished.current = true;
    const vals = Object.values(answers);
    const checks = vals.filter((a) => a && a.type === 'mc');
    const fin = vals.find((a) => a && a.type === 'final');
    const practices = vals.filter((a) => a && a.type === 'practice');
    const score = fin ? fin.score : 0, totalQ = FINAL.length;
    const practiceDone = practices.length === PRACTICE_COUNT && practices.every((x) => x.done);
    onFinished && onFinished({
      lessonId: LESSON_ID, lessonTitle: 'NestJS arxitekturasi: Module, Controller, Service',
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
  return <S key={idx} idx={idx} total={total} lang={lang} stored={answers[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => setIdx((i) => i - 1) : null} onFinish={finish} onGoto={goto} />;
}
