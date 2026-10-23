# JSX preview: mustaqil JSX'lar orasidagi izolyatsiya tuzatildi (21.10.2026 qayta QA'ga javob)

Hamkasblar, salom!

`JSX-preview-QA-feedback-20261021.zip` ni ko'rib chiqdik. Rahmat, sinov va dalillar juda aniq.

## 1. Qisqacha

Defektni tasdiqlaymiz. Ikki modul sinovini «sun'iy» deb yozgansiz, lekin bu holat real ishda ham bo'ladi: har dars JSX'iga `previewMode.js` ning o'z nusxasi kiradi. Demak LMS'da A dars va B dars — aynan ikki mustaqil modul.

Ko'zgu holat ham bor edi: **A preview → B jonli (mentor)**. A ning qatlami hali yoqiq bo'lgani uchun jonli B ning progressi va `liveSession` yozuvi haqiqiy saqlovga emas, A ning xotirasiga ketardi. Mentor F5 bossa, holat yo'qolardi. Bu ham yopildi.

## 2. Tuzatish (siz taklif qilgan yo'l)

- `Storage.prototype` endi **umuman tegilmaydi**: overlay olib tashlandi.
- Har JSX yig'masida `localStorage` / `sessionStorage` (`window.` va `globalThis.` bilan ham) shu yig'maning o'z adapteriga ulanadi (esbuild define + inject). Dars manbasi o'zgarmaydi.
- Adapter faqat **o'z** modulining rejimi va xotirasiga qaraydi. Boshqa JSX'ning holati unga ta'sir qilmaydi.
- Preview o'chiq bo'lsa, adapter chaqiruvni to'g'ridan-to'g'ri haqiqiy saqlovga uzatadi.

Bitta modul ichida eski asinxron chaqiruv haqida: dars saqlovga faqat chizilgan komponent (effekt/handler) orqali yozadi. Komponent unmount bo'lgach, React ularni yurgizmaydi.

## 3. Tekshiruv

Sizning `recheck-fixed.mjs` skriptingiz yangi faylda (QA LMS frontend, 22.10). Natija: **7/7 PASS**.

| Sinov | Natija |
|---|---|
| two-independent-bundles-preview-memory | PASS (B `null` o'qiydi) |
| bundle-A-live-then-bundle-B-preview-native-storage | PASS (haqiqiy saqlovda `null`) |
| bundle-A-preview-then-bundle-B-live-native-storage (yangi, ko'zgu holat) | PASS (jonli B yozuvi haqiqiy saqlovda) |
| fixed-new-preview-run | PASS (02/22 → 01/22) |
| fixed-preview-to-mentor | PASS (preview belgisi yo'q, `/lms/join` urinishi bor) |
| browser-independent-source-preview-native-storage | PASS (haqiqiy saqlovga yozuv 0) |
| fixed-return-to-preview | PASS (01/22) |

Skriptga uchta o'zgarish kiritildi, brauzer qismining mantig'i o'zgarmadi:

1. Fayl nomi `…20261022.jsx`.
2. Chrome manzili `CHROME` muhit o'zgaruvchisidan olinadi.
3. Ikki `vm` sinovi dars kodi kabi modulning adapteri orqali yozadi va o'qiydi (`previewLocalStorage`). Bo'lim chegarasi yangi tartibga moslandi. Eski skript yangi faylda `vm` qismida yiqiladi, chunki u global `localStorage` ni almashtirish arxitekturasiga bog'langan. Haqiqiy dalil — brauzer sinovi.

Bizning sinovlar: unit 26/26 (ikki mustaqil modul: A→B preview, A preview → A jonli → B preview, A preview → B jonli; `Storage.prototype` o'zgarmagani) · e2e preview 14/14 (lokal server + soxta LMS) · SPA e2e 4/4 · smoke-lms · smoke-preview.

## 4. Fayl

Hammasi bitta sahifada: **https://coddycamp-jsx-qa.vercel.app** (fayl, SHA, skript, natija JSON, ishga tushirish buyruqlari).

`internet-01-v18-preview-fix-20261022.jsx`

```text
SHA-256: df6ad36005bc5102808065ca665d313c56bec50b81fd65cd3ee769bd6782f150
```

Prod Dars API manzili bilan yig'ilgan (avvalgidek). Kechagi fayldan farq faqat preview-moduli va saqlov chaqiruvlari (`localStorage.X` → `previewLocalStorage.X`). Faylning birinchi `react` importi endi preview-modulidan keyin (140-qator) turadi: ESM'da bu bir xil, sizning QA LMS'ingiz ham uni yuklab ishlatdi.

Qayta tekshirish (fayl va skript bitta papkada bo'lishi kerak):

```sh
curl -O https://coddycamp-jsx-qa.vercel.app/internet-01-v18-preview-fix-20261022.jsx
curl -O https://coddycamp-jsx-qa.vercel.app/recheck-fixed-20261022.mjs
npm install --no-save playwright && npx playwright install chromium
node recheck-fixed-20261022.mjs
```

## 5. Ommaviy qayta yig'ish haqida

Qolgan JSX'lar hali eski overlay bilan. Ular aralash yuklansa (eski dars preview → yangi dars), eski dars qatlami sahifada qoladi. Shuning uchun 6-bandga to'liq qo'shilamiz: sizning QA OK'ingizdan keyin hamma JSX bir yo'la qayta yig'iladi va yuklanadi.
