import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from "/home/kali/Desktop/internetLesson/src/4a-Modull/NestArchResourceLesson.jsx";
const q = new URLSearchParams(location.search);
const lang = q.get('lang') || 'uz', s = Number(q.get('s') || 0), id = q.get('id') || '', total = Number(q.get('total') || 0);
try { localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() }));
  localStorage.setItem('cc_lang', lang); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang }));
