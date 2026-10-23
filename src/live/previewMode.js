// Preview rejimi (F-1015): o'qituvchi darsni «Bilimlar bazasi»dan darsdan OLDIN o'tib ko'radi.
// Kontrakt: feedback/F-1015-preview/jsx_preview_mode_backend_contract.md (+ IT javobi …_backend_reply_uz.md), A-yechim — preview faqat brauzerda:
//   · dars-api'ga birorta so'rov ketmaydi (liveClient.js shu modulga qaraydi);
//   · brauzerdagi eski jonli holat (liveSession:<id>) tiklanmaydi, liveToken kelsa ham e'tiborsiz (useLiveSession.js);
//   · darsning o'z kalitlari (progress, javoblar, kod) shu ishga tushirish xotirasida — F5, yopish yoki yangi ishga tushirishda noldan.
//
// Belgi — YAGONA manba: prop `visitMode`, faqat aniq "preview" satri (IT jamoa javobi 15.10: «bitta source of truth»;
// LMS URL'dagi visit_mode'ni o'zi o'qib, prop qilib uzatadi; JSX iframe'da emas). Darslar propni uzatmaydi, shuning uchun
// build-lms o'rami `startLessonRun(props)` ni har mount'da BIR MARTA, dars chizilishidan OLDIN chaqiradi.
// URL va `window.__CC_VISIT_MODE__` o'qilmaydi (F-1015-09, F-1015-13).
//
// F-1021-08/09 (LMS QA, 21.10): rejim sahifaga emas, ISHGA TUSHIRISHGA tegishli. LMS sahifani qayta yuklamasdan (SPA)
// darsni almashtiradi — avval rejim «sahifa yopilguncha yoqiq» edi: yangi preview eski ekrandan davom etardi, preview'dan
// keyingi oddiy dars ham preview bo'lib qolardi. Endi har mount o'z rejimini proplardan oladi:
//   · preview + yangi previewRunId → yangi bo'sh xotira;  · preview + o'sha previewRunId → o'sha xotira (re-mount);
//   · preview proplari yo'q → rejim o'chadi, saqlov odatdagidek.
// Bitta mount ichida rejim o'zgarmaydi (fail-closed: yarim yo'lda jonli rejimga qaytmaydi).
// Belgi umuman kelmagan sahifada hech narsa o'zgarmaydi: saqlov va so'rovlar avvalgidek. Storage.prototype hech qachon
// tegilmaydi (F-1021-10) — rejim va xotira faqat shu yig'maning adapterida, quyida.

const PREVIEW = 'preview';
const RUN_ID_RE = /^[A-Za-z0-9_-]{16,128}$/;
let on = false;
let runId = null;
let mem = null; // { local: Map, session: Map } — joriy preview ishga tushirishining xotirasi
const runListeners = new Set();

// Darsning o'z kalitlari — preview'da varaq xotirasiga ketadi. LMS kalitlari bu ro'yxatga TUSHMAYDI
// (dars LMS bilan bitta sahifada bo'lishi mumkin). Yangi kalit-prefiks qo'shilsa — scripts/preview-keys-check.mjs ushlaydi.
export const OWN_KEY_PREFIXES = [
  'liveSession:', 'liveNickname',
  'ccProgress:', 'ccPractice:', 'ccCode:', 'ccDetails:', 'ccSeal:',
  'ccHomework:', 'ccHwSeal:', 'ccHwQa-',
  'ccDemoDay', 'ccPitch', 'ccBridgeCard', 'cc-site-url', 'cc-deploy-project',
  'pm-', 'bridge-', 'ld-tahrir',
  'inetOnboarded_', 'hcOnboarded_', 'hcFont', 'hcSplit',
  'ccDokon', 'ccAvtoMustaqil', 'ccStoyankaFikr', 'ccPortfolio', 'ccPromo', // F-1017-226: PracticeLesson4 · FullstackConnectPractice · FullstackFeedback (reliz 18.10 keys-check)
];
// Til tanlovi — o'qituvchining tanlovi haqiqiy saqlovdan O'QILADI, lekin preview'da yozuv baribir varaq xotirasiga ketadi
// (IT talabi: preview'da localStorage/sessionStorage'ga HECH NARSA yozilmaydi — F-1015-10)
export const PASS_KEYS = ['cc_lang', 'bridgeLang', 'hwDemoLang'];
export const isOwnKey = (k) => typeof k === 'string' && (PASS_KEYS.includes(k) || OWN_KEY_PREFIXES.some((p) => k.startsWith(p)));

export const isPreview = () => on;

/** Boshqa modullar (resultDetails) o'z xotirasini yangi ishga tushirishda tozalashi uchun */
export function onRunChange(fn) { runListeners.add(fn); return () => runListeners.delete(fn); }

/**
 * build-lms o'rami: har mount'da bir marta. Yangi ishga tushirishning rejimini proplardan belgilaydi.
 * O'sha previewRunId bilan qayta chaqirilsa (re-mount, sinov-urug'i) — xotira saqlanadi.
 */
export function startLessonRun(props) {
  const preview = !!props && props.visitMode === PREVIEW;
  const id = preview && typeof props.previewRunId === 'string' && RUN_ID_RE.test(props.previewRunId) ? props.previewRunId : null;
  if (preview && on && id && id === runId) return true;
  runListeners.forEach((fn) => { try { fn(); } catch { /* tinglovchi xatosi rejimni buzmasin */ } });
  if (preview) { runId = id; mem = { local: new Map(), session: new Map() }; on = true; }
  else { on = false; runId = null; mem = null; }
  return on;
}

/** useLiveSession opts — { visitMode, previewRunId }. Joriy ishga tushirish ichida faqat YOQADI, o'chirmaydi. */
export function notePreviewProps(props) {
  if (props && props.visitMode === PREVIEW && !on) startLessonRun(props);
  return isPreview();
}

/** previewRunId faqat qabul qilinadi — serverga yuborilmaydi */
export const previewRunId = () => runId;

// Saqlov ADAPTERI (F-1021-10, LMS QA 21.10). Avval preview umumiy `Storage.prototype` metodlarini almashtirardi — sahifada
// bitta, lekin har dars yig'masida previewMode'ning O'Z nusxasi bor: qatlamni birinchi o'rnatgan dars yig'masi sahifa
// yopilguncha hukmron edi (A preview → A jonli → B preview: B yozuvi haqiqiy saqlovga; A preview → B jonli: B yozuvi
// A xotirasiga). Endi Storage tegilmaydi: build-lms har yig'mada `localStorage`/`sessionStorage` nomlarini shu yig'maning
// adapteriga ulaydi (scripts/build-lms.mjs, define + inject) — har yig'ma faqat o'z rejimi va xotirasiga qaraydi.
// Adapter: preview yoqiq paytda faqat isOwnKey kalitlar joriy ishga tushirish xotirasida; bo'sh boshlanadi va haqiqiy
// saqlovdan O'QIMAYDI. Faqat PASS_KEYS (til): xotirada yo'q bo'lsa haqiqiy saqlovdan o'qiladi; o'chirilgani ham
// xotirada belgilanadi. Preview o'chiq — chaqiruv to'g'ridan-to'g'ri haqiqiy saqlovga.
// Haqiqiy obyekt hisoblangan nom bilan olinadi: nuqtali yozuvni build-lms shu adapterning o'ziga almashtiradi.
const realStore = (name) => { try { return (typeof window !== 'undefined' ? window : globalThis)[name] || null; } catch { return null; } };

function makeStore(name, part) {
  const memOf = () => (on && mem ? mem[part] : null);
  return {
    getItem(k) {
      const m = memOf(), key = String(k);
      if (!m || !isOwnKey(key)) { const r = realStore(name); return r ? r.getItem(k) : null; }
      if (m.has(key)) return m.get(key);
      if (!PASS_KEYS.includes(key)) return null;
      const r = realStore(name); return r ? r.getItem(k) : null;
    },
    setItem(k, v) { const m = memOf(), key = String(k); if (m && isOwnKey(key)) { m.set(key, String(v)); return; } const r = realStore(name); if (r) r.setItem(k, v); },
    removeItem(k) { const m = memOf(), key = String(k); if (m && isOwnKey(key)) { m.set(key, null); return; } const r = realStore(name); if (r) r.removeItem(k); },
    // Darslar ishlatmaydi; to'liqlik uchun — preview'da faqat xotira tozalanadi, haqiqiy saqlov sanog'i ko'rsatiladi
    clear() { const m = memOf(); if (m) { m.clear(); return; } const r = realStore(name); if (r) r.clear(); },
    key(i) { const r = realStore(name); return r ? r.key(i) : null; },
    get length() { const r = realStore(name); return r ? r.length : 0; },
  };
}

export const previewLocalStorage = makeStore('localStorage', 'local');
export const previewSessionStorage = makeStore('sessionStorage', 'session');
