// Sinov-jabduq: darsni onFinished ushlagich bilan o'rnatadi (dev-ilova onFinished bermaydi). Faqat ach-test.mjs ishlatadi.
import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from '/src/1-Modull/InternetLesson.jsx';
export function mount() {
  document.body.innerHTML = '<div id="h"></div>';
  window.__fin = [];
  createRoot(document.getElementById('h')).render(<Lesson lang="uz" onFinished={(p) => window.__fin.push(p)} />);
}
