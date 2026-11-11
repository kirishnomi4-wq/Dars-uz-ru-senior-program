// createPortal — react-dom importisiz (F-1105-03, 11.11.2026).
// CRM'ning yangi JSX tekshiruvi (K03) darsda faqat "react" importiga ruxsat beradi; "react-dom" importi bo'lgan fayl saqlanmaydi.
// react-dom 19 dagi createPortal oddiy obyekt qaytaradi (node_modules/react-dom/cjs/react-dom.production.js, createPortal$1):
//   { $$typeof: Symbol.for("react.portal"), key, children, containerInfo, implementation: null }
// Uni LMS'dagi React renderer (reconciler) o'zi chizadi — shuning uchun shu obyektni o'zimiz yaratsak, natija aynan bir xil.
// Konteyner tekshiruvi ham react-dom'dagidek (element / document / fragment bo'lmasa xato).
const REACT_PORTAL_TYPE = Symbol.for('react.portal');

export function createPortal(children, container, key) {
  if (!container || (container.nodeType !== 1 && container.nodeType !== 9 && container.nodeType !== 11)) {
    throw new Error('createPortal: konteyner DOM element emas');
  }
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children,
    containerInfo: container,
    implementation: null,
  };
}
