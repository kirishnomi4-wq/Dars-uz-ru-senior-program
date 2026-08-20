// i18n-stend: BIR XIL root'da lang propini almashtirish uchun (mountHC unmount qiladi — bu emas)
import React from 'react';
import { createRoot } from 'react-dom/client';
import HtmlCompiler from '../../src/compilator/HtmlCompiler.jsx';
window.__events = [];
let root = null;
window.renderHC = (props = {}) => {
  if (!root) root = createRoot(document.getElementById('root'));
  root.render(React.createElement(HtmlCompiler, { onContinue: () => window.__events.push('continue'), onBack: () => window.__events.push('back'), ...props }));
  return true;
};
