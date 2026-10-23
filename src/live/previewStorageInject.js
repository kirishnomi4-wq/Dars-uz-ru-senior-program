// build-lms inject fayli (F-1021-10): yig'madagi `localStorage` / `sessionStorage` (va `window.` bilan) shu nomlarga
// almashtiriladi (define) — har dars yig'masi previewMode'ning O'Z adapteriga qaraydi, Storage.prototype tegilmaydi.
export { previewLocalStorage as __ccLocalStorage, previewSessionStorage as __ccSessionStorage } from './previewMode.js';
