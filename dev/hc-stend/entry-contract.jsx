// t-contract stend-kirish: createRoot + StrictMode + ikki-kompilyator + qayta-render qobig'i
import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import HtmlCompiler, { checks, highlight, formatHtml } from '../../src/compilator/HtmlCompiler.jsx';
window.React = React; window.createRoot = createRoot;
window.HC = { HtmlCompiler, checks, highlight, formatHtml };
window.__events = [];
const roots = {};
const el = (id) => { let d = document.getElementById(id); if (!d) { d = document.createElement('div'); d.id = id; document.body.appendChild(d); } return d; };
// mountAt(id, props, {strict, rerenderMs, taskFactory}) — id-konteynerga alohida root
window.mountAt = (id, props = {}, opts = {}) => {
  if (roots[id]) roots[id].unmount();
  const r = createRoot(el(id)); roots[id] = r;
  const base = { onContinue: (x) => window.__events.push(['continue', id, x]), onBack: () => window.__events.push(['back', id]) };
  const Wrap = () => {
    const [n, setN] = useState(0);
    useEffect(() => { if (!opts.rerenderMs) return; const t = setInterval(() => setN((k) => k + 1), opts.rerenderMs); return () => clearInterval(t); }, []);
    const p = { ...base, ...(window.__propsOverride?.[id] || props) };
    if (opts.inlineTask) p.task = { ...opts.inlineTask, requirements: opts.inlineTask.requirements.map((q) => ({ ...q })) }; // har renderda YANGI obyekt
    window.__renders = (window.__renders || 0) + 1;
    return React.createElement(HtmlCompiler, p);
  };
  window.__wraps = window.__wraps || {}; window.__wraps[id] = { Wrap, strict: !!opts.strict }; if (window.__propsOverride) delete window.__propsOverride[id];
  let node = React.createElement(Wrap);
  if (opts.strict) node = React.createElement(StrictMode, null, node);
  r.render(node); return true;
};
window.unmountAt = (id) => { if (roots[id]) { roots[id].unmount(); delete roots[id]; } };
window.mountHC = (props = {}) => window.mountAt('root', props);
window.unmountHC = () => window.unmountAt('root');
// rerender same root with new props (til almashish sinovi)
window.rerenderAt = (id, props = {}) => {
  const r = roots[id], w = window.__wraps?.[id]; if (!r || !w) return false;
  window.__propsOverride = window.__propsOverride || {}; window.__propsOverride[id] = props;
  let node = React.createElement(w.Wrap); if (w.strict) node = React.createElement(StrictMode, null, node);
  r.render(node); return true;
};
