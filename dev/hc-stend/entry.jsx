import React from 'react';
import { createRoot } from 'react-dom/client';
import HtmlCompiler, { checks, highlight, formatHtml } from '../../src/compilator/HtmlCompiler.jsx';
window.React = React; window.HC = { HtmlCompiler, checks, highlight, formatHtml };
window.__events = [];
let root = null;
// window.mountHC(props) — props.task/starterCode/storageKey/lang; onContinue/onBack loglanadi
window.mountHC = (props = {}) => {
  if (root) { root.unmount(); }
  const el = document.getElementById('root');
  root = createRoot(el);
  root.render(React.createElement(HtmlCompiler, {
    onContinue: () => window.__events.push('continue'),
    onBack: () => window.__events.push('back'),
    ...props,
  }));
  return true;
};
window.unmountHC = () => { if (root) { root.unmount(); root = null; } };
