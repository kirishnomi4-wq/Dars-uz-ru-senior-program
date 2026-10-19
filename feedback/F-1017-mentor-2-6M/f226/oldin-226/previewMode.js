// Preview rejimi (F-1015): o'qituvchi darsni «Bilimlar bazasi»dan darsdan OLDIN o'tib ko'radi.
// Kontrakt: feedback/F-1015-preview/jsx_preview_mode_backend_contract.md (+ IT javobi …_backend_reply_uz.md), A-yechim — preview faqat brauzerda:
//   · dars-api'ga birorta so'rov ketmaydi (liveClient.js shu modulga qaraydi);
//   · brauzerdagi eski jonli holat (liveSession:<id>) tiklanmaydi, liveToken kelsa ham e'tiborsiz (useLiveSession.js);
//   · darsning o'z kalitlari (progress, javoblar, kod) varaq xotirasida — F5 yoki yopilsa noldan.
//
// Belgi — YAGONA manba: prop `visitMode`, faqat aniq "preview" satri (IT jamoa javobi 15.10: «bitta source of truth»;
// LMS URL'dagi visit_mode'ni o'zi o'qib, prop qilib uzatadi; JSX iframe'da emas). Darslar propni uzatmaydi, shuning uchun
// build-lms o'rami `notePreviewProps(props)` ni dars chizilishidan OLDIN chaqiradi (import paytida xotira o'qiydigan dars yo'q).
// URL va `window.__CC_VISIT_MODE__` o'qilmaydi (F-1015-09, F-1015-13).
// Bir marta yoqilsa — sahifa yopilguncha yoqiq qoladi (fail-closed: yarim yo'lda jonli rejimga qaytmaydi).
// Belgi yo'q bo'lsa hech narsa o'zgarmaydi: Storage tegilmaydi, so'rovlar avvalgidek.

const PREVIEW = 'preview';
let on = false;
let runId = null;

// Darsning o'z kalitlari — preview'da varaq xotirasiga ketadi. LMS kalitlari bu ro'yxatga TUSHMAYDI
// (dars LMS bilan bitta sahifada bo'lishi mumkin). Yangi kalit-prefiks qo'shilsa — scripts/preview-keys-check.mjs ushlaydi.
export const OWN_KEY_PREFIXES = [
  'liveSession:', 'liveNickname',
  'ccProgress:', 'ccPractice:', 'ccCode:', 'ccDetails:', 'ccSeal:',
  'ccHomework:', 'ccHwSeal:', 'ccHwQa-',
  'ccDemoDay', 'ccPitch', 'ccBridgeCard', 'cc-site-url', 'cc-deploy-project',
  'pm-', 'bridge-', 'ld-tahrir',
  'inetOnboarded_', 'hcOnboarded_', 'hcFont', 'hcSplit',
];
// Til tanlovi — o'qituvchining tanlovi haqiqiy saqlovdan O'QILADI, lekin preview'da yozuv baribir varaq xotirasiga ketadi
// (IT talabi: preview'da localStorage/sessionStorage'ga HECH NARSA yozilmaydi — F-1015-10)
export const PASS_KEYS = ['cc_lang', 'bridgeLang', 'hwDemoLang'];
export const isOwnKey = (k) => typeof k === 'string' && (PASS_KEYS.includes(k) || OWN_KEY_PREFIXES.some((p) => k.startsWith(p)));

export const isPreview = () => on;

/** Dars kirishidagi proplar (build-lms o'rami) yoki useLiveSession opts — { visitMode, previewRunId } */
export function notePreviewProps(props) {
  if (props && props.visitMode === PREVIEW) {
    if (typeof props.previewRunId === 'string' && /^[A-Za-z0-9_-]{16,128}$/.test(props.previewRunId)) runId = props.previewRunId;
    enable();
  }
  return isPreview();
}

/** previewRunId faqat qabul qilinadi — serverga yuborilmaydi */
export const previewRunId = () => runId;

function enable() {
  if (on) return;
  on = true;
  installOverlay();
}

// Storage ustidan qatlam: faqat window.localStorage / sessionStorage va faqat isOwnKey kalitlar uchun.
// Bo'sh boshlanadi va haqiqiy saqlovdan O'QIMAYDI — eski progress/javob/sessiya preview'ga o'tmaydi.
// Faqat PASS_KEYS (til): xotirada yo'q bo'lsa haqiqiy saqlovdan o'qiladi; o'chirilgani ham xotirada belgilanadi.
function installOverlay() {
  if (typeof Storage === 'undefined' || typeof window === 'undefined') return;
  const P = Storage.prototype;
  if (P.__ccPreview) return;
  const local = new Map(), session = new Map();
  const memOf = (s) => {
    try { if (s === window.localStorage) return local; } catch { /* saqlov yopiq */ }
    try { if (s === window.sessionStorage) return session; } catch { /* saqlov yopiq */ }
    return null;
  };
  const get = P.getItem, set = P.setItem, rem = P.removeItem;
  P.getItem = function (k) {
    const m = memOf(this), key = String(k);
    if (!m || !isOwnKey(key)) return get.call(this, k);
    if (m.has(key)) return m.get(key);
    return PASS_KEYS.includes(key) ? get.call(this, k) : null;
  };
  P.setItem = function (k, v) { const m = memOf(this), key = String(k); if (m && isOwnKey(key)) { m.set(key, String(v)); return; } return set.call(this, k, v); };
  P.removeItem = function (k) { const m = memOf(this), key = String(k); if (m && isOwnKey(key)) { m.set(key, null); return; } return rem.call(this, k); };
  Object.defineProperty(P, '__ccPreview', { value: true });
}

