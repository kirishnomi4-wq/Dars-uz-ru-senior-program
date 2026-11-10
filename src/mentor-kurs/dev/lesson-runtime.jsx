// ============================================================
// @lesson/runtime — LOKAL SHIM (faqat dev, F-1029-02 mentor kursi).
// Platformada haqiqiy runtime (ElevenLabs TTS, SFX, AI, assets) ishlaydi; bu fayl
// o'sha API'ni lokal takrorlaydi: useAudio(segments) → segmentlar navbat bilan
// dev TTS-serverdan (/tts?text=…, edge-tts Sardor) o'qiladi. Maydonlar sekin-lab
// stub'i va LESSON_PROMPT_WITH_UNLOCK.md bo'yicha: isPlaying · muted · waitingFor ·
// currentId · triggerEvent · replay · pushOneOff · toggleMute.
// Dars fayli bu shim'ni bilmaydi — u faqat '@lesson/runtime' dan import qiladi.
// ============================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TTS = (text) => `/tts?text=${encodeURIComponent(text)}`;

// Statik rejim (03.11, Vercel ko'rik sayti): TTS-server yo'q — mp3 `/tts/<sha1>.mp3` dan olinadi.
// Kesh nomi dev/tts-server.py bilan AYNAN bir xil: sha1(voice + rate + clean(text)).
const STATIC_TTS = import.meta.env.VITE_TTS_STATIC === '1';
const TTS_TAG = /\[[^\]]{1,40}\]/g;
const TTS_SUBS = [['@', ''], ['·', ','], ['→', ''], ['`', ''], ['**', '']];
function ttsClean(text) {
  let s = text.replace(TTS_TAG, ' ');
  for (const [a, b] of TTS_SUBS) s = s.split(a).join(b);
  return s.replace(/\s+/g, ' ').trim();
}
const URL_CACHE = new Map();
function ttsUrl(text) {
  if (!STATIC_TTS) return Promise.resolve(TTS(text));
  if (URL_CACHE.has(text)) return URL_CACHE.get(text);
  const ru = text.replace(/^\s+/, '').startsWith('[Русское произношение]');
  const key = (ru ? 'ru-RU-DmitryNeural+0%' : 'uz-UZ-SardorNeural-5%') + ttsClean(text);
  const pr = crypto.subtle.digest('SHA-1', new TextEncoder().encode(key))
    .then((b) => `/tts/${[...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')}.mp3`);
  URL_CACHE.set(text, pr);
  return pr;
}

// Bitta global pleyer: ekran almashganda oldingi ovoz to'xtaydi (runtime ham shunday).
let PLAYER = null;
function player() {
  if (!PLAYER) { PLAYER = new Audio(); PLAYER.preload = 'auto'; }
  return PLAYER;
}
let MUTED = false;
const muteListeners = new Set();

// Oldindan yuklash: keyingi segmentlar audio'si brauzer keshiga tushsin (dev TTS sekin bo'lishi mumkin)
function prefetch(text) { try { ttsUrl(text).then((u) => fetch(u, { cache: 'force-cache' })).catch(() => {}); } catch (e) {} }

// Dev-tekshiruv (F-1030-38): ovozga berilgan hamma matn window.__ttsTexts ga yoziladi — RU qoldiq-skripti o'qiydi
const rec = (text) => { try { (window.__ttsTexts = window.__ttsTexts || new Set()).add(text); } catch (e) {} };
export function useAudio(segments) {
  const segs = Array.isArray(segments) ? segments : [];
  segs.forEach((s) => s && s.text && rec(s.text));
  const [isPlaying, setPlaying] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [waitingFor, setWaiting] = useState(null); // { type, target } yoki null
  const [muted, setMutedState] = useState(MUTED);
  const idx = useRef(-1);          // hozirgi segment indeksi
  const alive = useRef(true);
  const oneOff = useRef(null);     // pushOneOff navbati
  const lastPlayed = useRef(null); // replay uchun matn

  const playText = useCallback((text, id, onEnd) => {
    const p = player();
    try { p.pause(); } catch (e) {}
    p.onended = null; p.onerror = null;
    lastPlayed.current = { text, id };
    setCurrentId(id);
    if (MUTED) { setPlaying(false); const t = setTimeout(() => alive.current && onEnd && onEnd(), 400); return () => clearTimeout(t); }
    const done = () => { if (!alive.current) return; setPlaying(false); onEnd && onEnd(); };
    const start = (url) => {
      if (lastPlayed.current && lastPlayed.current.text !== text) return; // kutish orasida boshqa ovoz boshlandi
      p.src = url; p.muted = false;
      p.onended = done;
      p.onerror = () => { console.warn('[lesson-runtime] audio xato:', text.slice(0, 40)); done(); };
      p.play().then(() => alive.current && setPlaying(true)).catch((e) => { console.warn('[lesson-runtime] autoplay rad:', e && e.message); done(); });
    };
    if (STATIC_TTS) ttsUrl(text).then(start, done); else start(TTS(text));
    return undefined;
  }, []);

  // Segment zanjiri
  const runFrom = useCallback((i) => {
    if (!alive.current) return;
    if (i >= segs.length) { idx.current = segs.length; setCurrentId(null); setWaiting(null); return; }
    idx.current = i;
    const s = segs[i];
    if (segs[i + 1]) prefetch(segs[i + 1].text);
    setWaiting(null);
    playText(s.text, s.id, () => {
      if (!alive.current || idx.current !== i) return;
      if (s.waits_for) { setWaiting(s.waits_for); setCurrentId(null); }
      else runFrom(i + 1);
    });
  }, [segs, playText]);

  // on_mount: birinchi segment (brauzer autoplay'ni birinchi ishoradan keyin ruxsat beradi)
  useEffect(() => {
    alive.current = true; idx.current = -1;
    const first = segs.findIndex((s) => !s.trigger || s.trigger === 'on_mount');
    if (first >= 0) runFrom(first);
    return () => { alive.current = false; try { const p = player(); p.pause(); p.onended = null; } catch (e) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segs.map((s) => s.id + '|' + s.text).join('\n')]);

  const triggerEvent = useCallback((type, target) => {
    const w = waitingFor;
    if (!w) return;
    if (w.type !== type) return;
    if (w.target && target && w.target !== target) return;
    runFrom(idx.current + 1);
  }, [waitingFor, runFrom]);

  const pushOneOff = useCallback((text) => {
    rec(text);
    if (!text) return;
    const resume = idx.current; // one-off tugagach zanjir davom etmaydi (runtime ham davom ettirmaydi)
    oneOff.current = text;
    playText(text, '__oneoff', () => { if (alive.current) setCurrentId(null); void resume; });
  }, [playText]);

  const replay = useCallback(() => {
    const i = Math.max(0, Math.min(idx.current, segs.length - 1));
    if (segs[i]) runFrom(i);
    else if (lastPlayed.current) playText(lastPlayed.current.text, lastPlayed.current.id, () => setCurrentId(null));
  }, [segs, runFrom, playText]);

  const toggleMute = useCallback(() => {
    MUTED = !MUTED; setMutedState(MUTED); muteListeners.forEach((f) => f(MUTED));
    try { const p = player(); if (MUTED) { p.pause(); setPlaying(false); setCurrentId(null); if (segs[idx.current] && segs[idx.current].waits_for) setWaiting(segs[idx.current].waits_for); else runFromSoon(); } } catch (e) {}
    function runFromSoon() { setTimeout(() => alive.current && runFrom(idx.current + 1), 300); }
  }, [segs, runFrom]);

  useEffect(() => { const f = (m) => setMutedState(m); muteListeners.add(f); return () => muteListeners.delete(f); }, []);

  return useMemo(() => ({
    isPlaying, playing: isPlaying, paused: false, muted, waitingFor, currentId,
    status: isPlaying ? 'playing' : (waitingFor ? 'waiting' : 'idle'), failed: false,
    triggerEvent, replay, pushOneOff, toggleMute,
  }), [isPlaying, muted, waitingFor, currentId, triggerEvent, replay, pushOneOff, toggleMute]);
}

export function useSfx() {
  return useMemo(() => {
    const beep = (f, ms) => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.frequency.value = f; g.gain.value = 0.08; o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(() => { o.stop(); ctx.close(); }, ms); } catch (e) {} };
    return { playCorrect: () => beep(880, 140), playWrong: () => beep(220, 220), playCheer: () => beep(1320, 200) };
  }, []);
}

export function useGrader() {
  return useCallback(async () => { await new Promise((r) => setTimeout(r, 500)); return { correct: true, feedback: '(dev) AI tekshiruv o\'chiq.', transcript: '' }; }, []);
}

const ASSETS = {};
export function resolveAssetUrl(a, base) { if (!a || typeof a.path !== 'string') return null; return /^https?:\/\//.test(a.path) ? a.path : `${base || '/assets/'}${a.path}`; }
export function useAssets() { return useMemo(() => ({ assets: ASSETS, resolveUrl: (k) => resolveAssetUrl(typeof k === 'string' ? ASSETS[k] : k) }), []); }

export function useNextLessonAccess() { return useCallback(async () => ({}), []); }
