// F-1105-03 L1 (25 §9): dars fayli qaysi nashr ekanini o'zi biladi — versiya YIG'ISH paytida yoziladi.
// build-lms.mjs esbuild `define` bilan `__LESSON_VERSION__` ni LMS_REESTR.json dagi versiyaga almashtiradi ("v6").
// Vite (dev/QA) va boshqa yig'malarda e'lon qilinmagan — null (server `unknown` deb yozadi). 172 dars fayliga tegilmaydi.
/* global __LESSON_VERSION__ */
export const BUILD_LESSON_VERSION = (typeof __LESSON_VERSION__ !== 'undefined' && __LESSON_VERSION__) ? String(__LESSON_VERSION__).slice(0, 32) : null;
