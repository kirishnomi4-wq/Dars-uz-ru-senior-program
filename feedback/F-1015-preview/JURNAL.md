# F-1015 · LMS preview rejimi — jurnal (1-seans «IT jamoa bilan ish»)

Manba: `jsx_preview_mode_backend_contract.md`, `jsx_preview_mode_user_story_acceptance.md` (repo ildizi).
Chegara: `src/live/*`, `src/main.jsx`, `src/qolip`, `src/mentor`, `App.jsx`, `scripts/`, `package.json`;
dars fayllari faqat `src/1…4-Modull`, `4a/4b/4c`, 18 praktika faylidan tashqari. Commit YO'Q.

---

## F-1015-01 · 15.10.2026 ~12:30 — qaror

Savol-sahifa: https://claude.ai/artifact/Xpkwp2NoAYix2sE5XdKe1D

Foydalanuvchi javoblari:
1. **A** — preview faqat brauzerda, serverga murojaat yo'q.
2. O'qituvchi paneli yo'q, tepada kichik «Oldindan ko'rish» belgisi.
3. Uyga vazifa — noma'lum, IT jamoadan so'raladi.
4. Sinov: avval lokalda, keyin staging.
5. Hodisa — noma'lum, IT jamoadan so'raladi.

Qo'shimcha talablar:
- `visitMode="preview"` kelsa, `liveToken` kelsa ham e'tiborsiz — preview doim ustun.
- `visitMode` yo'q bo'lsa — xatti-harakat 100% hozirgidek; har qadamdan keyin oddiy jonli rejim ham sinaladi
  (`src/live` ni 183 dars ishlatadi; 2-seans parallel sinayapti).
- 18 praktika fayliga tegilmaydi (3-seans).

## F-1015-02 · 15.10.2026 12:47 — tahlil, xat, 1-qadam rejasi (kodga TEGILMAGAN)

**Koddan aniqlangan faktlar:**
- Dars-serverga faqat `src/live/` murojaat qiladi (`liveClient.js`: `liveRpc`, `lmsJoin`, `lmsMe`, `lmsRestart`, `progressPut`).
  Darslardagi `fetch(...)` lar — faqat matn ichidagi kod-misollar.
- `LiveGate` va `LiveBadge` ni 183 dars `src/live/LiveUI.jsx` dan oladi → PIN-oyna va belgi BITTA joyda.
- `useLiveSession(id, key, { liveToken })` — darslar `visitMode`ni uzatmaydi (0/183). Belgini bitta joyda olish
  uchun URL yoki global belgi kerak → IT jamoaga 2-savol.
- Darslar LMS'ga `scripts/build-lms.mjs` bilan yig'ilib ketadi (`src/live` har fayl ichiga kiradi) →
  o'zgarish kuchga kirishi uchun hamma darslar qayta yig'ilib, CRM'ga qayta yuklanadi.
- Brauzer xotirasi: 161 faylda bevosita `localStorage`, 20+ kalit-prefiks (`liveSession:`, `ccProgress`,
  `ccHomework:`, `ccHwSeal:`, `pm-m…`, `bridge-b…`, `inetOnboarded_`, `ccDemoDay`, `cc_lang` …).
- `onFinished` ni darslar o'zi chaqiradi (183 fayl) — preview'da LMS bo'sh funksiya beradi (kontrakt 2.2).

**Xat:** `feedback/F-1015-preview/XAT-IT-01.md` (RU + UZ tarjima).

**Kontraktda savollardan tashqari ochiq joylar** (foydalanuvchiga ko'rsatildi):
1. Reliz tartibi (§5: backend → JSX → LMS → CRM) — A'da backend qadami yo'q, lekin hamma darslarni qayta
   yuklash shart; eski fayl preview'da PIN-oyna chiqaradi → xatga qo'shildi («CRM'ni keyin yoqing»).
2. Dars LMS bilan bitta hujjatdami (iframe emasmi) — brauzer-xotira himoyasi shunga bog'liq → 2-savolga qo'shildi.
3. DoD: QA video/skrinshot (preview finali + o'quvchining toza starti) — kim tayyorlaydi?
4. `visitMode` ning boshqa qiymatlari keladimi? Biz faqat aniq `"preview"` ni taniymiz.
5. §6 dagi 10 contract-test o'rniga A uchun bizning testlar ro'yxati kerakmi (ular qabul qilish uchun)?

**1-qadam rejasi** — pastda «1-QADAM» bo'limida; IT jamoa javobidan keyin «ha» kutiladi.

### 1-QADAM — `src/live` yadrosi (preview bayrog'i + himoya), ~1.5 kun

| Fayl | Nima o'zgaradi |
|---|---|
| `src/live/previewMode.js` (YANGI) | `isPreview()` — bir marta aniqlanadi. Manbalar: `opts.visitMode`, URL `visit_mode=preview`, global belgi (IT javobiga qarab). Faqat aniq `"preview"`. Preview'da xotira-qatlam: bizning kalit-prefikslarimiz `Storage` o'rniga varaq xotirasidagi `Map`ga yoziladi va undan o'qiladi (bo'sh boshlanadi, haqiqiy xotiradan o'qimaydi); LMS kalitlariga tegilmaydi. |
| `src/live/index.js` | `previewMode.js` birinchi import qilinadi; `isPreview` eksport. |
| `src/live/liveClient.js` | Ikkinchi himoya qatlami: preview'da `liveRpc`/`lmsFetch`/`progressPut` tarmoqqa chiqmasdan rad etadi. |
| `src/live/useLiveSession.js` | Preview'da: `liveRead` tiklanmaydi, rejim `preview` (darslar uni `self` kabi ko'radi), `liveToken` effekti va solo-recheck o'chiq, `opts.visitMode` qabul qilinadi. |
| `src/live/progressSync.js` | Preview'da kanal ochilmaydi. |
| `src/live/LiveUI.jsx` | `LiveGate` preview'da hech narsa chiqarmaydi; `LiveBadge` preview'da kichik «Oldindan ko'rish / Предпросмотр». |
| `src/live/previewMode.test.mjs` (YANGI) | Node-test: 0 tarmoq so'rovi, eski `liveSession` tiklanmaydi, token e'tiborsiz, xotiraga yozuv yo'q; preview yo'q → avvalgidek. |
| `scripts/` (YANGI skript) | Darslardagi hamma xotira-kalitlarini yig'ib, prefiks ro'yxati to'liqligini tekshiradi. |

**Sinov:**
1. `node src/live/previewMode.test.mjs` + mavjud `node src/live/resultDetails.test.mjs`.
2. `npm run gates -- src/1-Modull/InternetLesson.jsx` (jonli modul shu dars ichida yig'iladi).
3. Oddiy rejim regressiyasi (lokal jonli stek): mentor PIN, o'quvchi qo'shilishi, solo, onFinished —
   InternetLesson + bitta 5–12-modul darsi (faqat ochib ko'riladi). Tarmoq so'rovlari o'zgarishdan oldingi bilan bir xil.
4. Preview lokalda: `?visit_mode=preview` bilan ochiladi → dars-api'ga 0 so'rov, PIN-oyna yo'q, xotira kalitlari oldin/keyin bir xil.

**Keyingi qadamlar (taxmin, jami 5 ish kuni):** 2) lokal soxta LMS'da `/preview` sahifasi + lokal E2E (1 kun) ·
3) hamma darslarni qayta yig'ish + oddiy rejim regressiyasi (1 kun) · 4) staging'da IT jamoa bilan (1 kun) · 5) zaxira (0.5 kun).
Eslatma: `src/live` o'zgarishi 2-seans darslariga ham yig'ishda kiradi — boshlashdan oldin nazorat seansiga aytiladi.

## F-1015-03 · 15.10.2026 — xatga 3 tuzatish (foydalanuvchi)

- «Срок: 5 рабочих дней…» olib tashlandi; qoldi: «включать visit_mode=preview только после перезаливки уроков — старые файлы покажут PIN-окно».
- 2-savol qisqardi: uch manbadan qaysi biri ishonchli + iframe ha/yo'q.
- 8-savol: qayta yuklashgacha CRM «Bilimlar bazasi»dan ochilganda `liveToken` bermay tursinmi (hodisa darhol to'xtaydi).
- Ochiq joylar 3–5 xatga kirmaydi (video/skrinshot — o'zimiz; faqat aniq "preview"; testlar — 1-savol ichida).
Fayl: `XAT-IT-01.md` (RU+UZ). Javob kutilmasdan 1-qadam boshlandi (foydalanuvchi buyrug'i).

## F-1015-04 · 15.10.2026 — 1-QADAM bajarildi: `src/live` yadrosi + yig'ish o'rami (commit YO'Q)

Baza nusxasi (solishtirish uchun): `feedback/F-1015-preview/baza/` (src/live + build-lms.mjs, o'zgarishdan oldin).

| Fayl | O'zgarish |
|---|---|
| `src/live/previewMode.js` (yangi) | Belgi 3 manbadan (prop · URL `visit_mode=preview` · `window.__CC_VISIT_MODE__`), faqat aniq "preview", yoqilgach o'chmaydi. Storage-qatlam: faqat bizning kalit-prefikslar (22 ta) varaq xotirasida, bo'sh boshlanadi; LMS kalitlari va til (`cc_lang` …) tegilmaydi. `previewRunId` faqat qabul qilinadi. |
| `src/live/index.js` | `previewMode.js` birinchi import; `isPreview`, `notePreviewProps` eksport. |
| `src/live/liveClient.js` | 6 ta `fetch` → `net()`: preview'da tarmoqqa chiqmasdan `preview_offline` bilan rad. |
| `src/live/useLiveSession.js` | Preview'da: `liveToken` = null (prop kelsa ham), `liveSession` tiklanmaydi, rejim `'self'` (yangi nom emas — 20 dars `live.mode === 'self'` ni tekshiradi), `preview: true` qaytadi. |
| `src/live/progressSync.js` | Preview'da server-progress kanali ochilmaydi. |
| `src/live/LiveUI.jsx` | `LiveGate` preview'da null (AC-07); `LiveBadge` preview'da «Oldindan ko'rish / Предпросмотр» (emojisiz — fayl emoji soni bazadagidek 14). |
| `scripts/build-lms.mjs` | Default eksport o'rami `CcLessonEntry(props)` → `notePreviewProps(props)` → dars. 183 dars fayliga tegilmadi. |
| `src/live/previewMode.test.mjs` (yangi) | 5 holat, har biri alohida jarayonda: oddiy · URL · global · prop · hook opts. |
| `scripts/preview-keys-check.mjs` (yangi) | Darslardagi saqlov-kalitlari himoya ro'yxatida bormi (287 fayl, 501 kalit). |
| `scripts/smoke-preview.mjs` (yangi) | Haqiqiy brauzer: build-lms → NAZORAT (preview'siz) va PREVIEW; eski mentor sessiya + progress + LMS kaliti oldindan yoziladi. |

**Sinov natijalari:**
- `node --test src/live/previewMode.test.mjs src/live/resultDetails.test.mjs` → 23/23 (baza 18/18 + yangi 5).
  Mutatsiya: himoyasiz nusxada yangi testlar 3/5 yiqildi — testlar haqiqiy.
- `node scripts/preview-keys-check.mjs` → hamma kalit qoplangan; `pm-` prefiksi olib tashlansa yiqiladi (sinaldi).
- `smoke-preview` InternetLesson + PmLesson6 → 8/8 + 8/8. NAZORAT hozirgi xavfni ko'rsatdi: preview'siz dars eski mentor
  sessiyasini (PIN 123 456) tiklab heartbeat yuboradi; PREVIEW'da dars-api so'rovi 0, belgi «Oldindan ko'rish», PIN-oyna yo'q,
  haqiqiy saqlov o'zgarmagan. Skrinshot: `InternetLesson.jsx-preview.png`, `…-nazorat.png` (shu papkada).
- `smoke-lms` (oddiy rejim, yangi o'ram bilan yig'ilgan) InternetLesson ✓, PmLesson4 ✓ (kompilyator ham ochildi).
- Oddiy jonli rejim regressiyasi — lokal stek (soxta LMS 3999 + server 3001 + sayt 5300), `tools/e2e-lms.mjs`:
  yangi kod 19/20 · **baza kodi ham 19/20, aynan o'sha band** (F-1015-06) → regressiya yo'q.
- Darvozalar: useLiveSession/liveClient/previewMode/progressSync/index — 12/12; LiveUI — emoji (bazada ham 14, o'zgarmadi);
  scripts/*.mjs — esbuild/undef (bazaviy build-lms va smoke-lms da ham — darvoza node-skript uchun emas). `lint:jsx src/live` toza.

## F-1015-05 · 15.10.2026 — topilma: o'ram o'zini chaqirdi (tutildi, tuzatildi)

`stdin.sourcefile` darsning o'z nomi bo'lganda esbuild `import … from <dars>` ni o'ramning o'ziga uladi →
`CcLessonEntry` o'zini cheksiz chizdi (sahifa ochilmadi). `sourcefile: lms-entry:<nom>` bilan tuzatildi, izoh kodda.
Faqat vaqtinchalik papkada yig'ilgan — `lms/` ga hech narsa yozilmagan.

## F-1015-06 · 15.10.2026 — OLDINDAN BOR: e2e «NATIJA» bandi (→ quyida YOPILDI)

`tools/e2e-lms.mjs` oxirgi band: soxta School API'ga faqat Vali (34175) natijasi keladi, Ali (jonli) va Sobir (solo) — yo'q.
Baza `src/live` bilan ham aynan shunday → preview ishiga aloqasi yo'q. Sabab tekshirilmadi (server/ — bu seans chegarasidan tashqari);
foydalanuvchiga aytildi.

**Keyingi:** 2-qadam — lokal soxta LMS'da `/preview` sahifasi (IT jamoa javobidan keyin aniqlash qismi to'g'rilanadi).
`src/live` o'zgarishi boshqa seanslarning yig'ishiga ham kiradi — nazorat seansiga aytilishi kerak.

## F-1015-06 · 15.10.2026 13:35 — YOPILDI: test eskirgan, bag yo'q (nazorat tekshirdi)

Ali (34174) doimiy id, 12.10 23:09 da completed natija olgan → tanga-qoidasi (F-0918-04, `RESULT_LIVE_REPEAT=skip` standart)
uni har keyingi yugurishda chiqaradi; Vali 12.10 da completed:false bo'lgani uchun o'tardi. Sobir tekshirilmagan edi
(ids-band birinchi yiqilib, solo-bandga yetmasdi).
Qayta sinov: server `RESULT_LIVE_REPEAT=send` bilan (faqat lokal), yangi `src/live` kodi bilan → `tools/e2e-lms.mjs` **22/22 O'TDI**
(NATIJA: Ali/Vali jonli + Sobir solo ✓; avval yetib borilmagan F-0910-01 solo→jonli va konsol-xato bandlari ham ✓).
Oddiy jonli rejim regressiyasi yo'q. Lokal xizmatlar to'xtatildi (3001/3999/5300 bo'sh).

## F-1015-07 · 15.10.2026 14:17 — topilma: sinov vositasidagi ikki yolg'on-o'tish (tutildi, tuzatildi)

1. **Urug' (seed) jim ishlamadi:** dars `ccProgress` ni faqat `total` = ekranlar soni (22) va `maxReached` bo'lsa qabul qiladi —
   usiz 0-ekranga qaytadi. Birinchi yugurishda AC-01 «o'tdi», lekin hisoblagich 01/22 da edi (yolg'on). Endi har urug'dan keyin
   ekran raqami tekshiriladi (05 / 22 / 22), aks holda band yiqiladi.
2. **Vite keshi:** yig'ma `node_modules/.cache/…` da o'sha manzilga qayta yozilganda vite eski faylni berardi (node_modules kuzatilmaydi) —
   mutatsiya-sinovi (baza src/live) 10/10 «o'tdi». Endi har yugurish yangi papka (`…/lms-preview/<vaqt>/`) — mutatsiya **4/10 yiqiladi**.

## F-1015-08 · 15.10.2026 14:17 — 2-QADAM bajarildi: lokal LMS /preview + E2E (commit YO'Q)

| Fayl | Nima |
|---|---|
| `preview/index.html`, `preview/main.jsx` (yangi, faqat dev) | LMS `/preview` simulyatori: YIG'ILGAN dars faylini ochadi (prop-o'ram shu faylda), `visitMode="preview"`, har ochilishda yangi `previewRunId` (crypto.randomUUID), `liveToken=null`, bo'sh `onFinished` (hisoblagich bilan). Sinov parametrlari: `global=1`, `forceToken=1`, `id&seedScreen&total`. |
| `scripts/e2e-preview.mjs` (yangi) | AC-01…07 lokal stekda (soxta LMS 3999 + server 3001 RESULT_LIVE_REPEAT=send + sayt 5300). |

`src/lms-harness` ga tegilmadi (chegaradan tashqari, e2e-lms uni ishlatadi). Yig'ma — `node_modules/.cache/lms-preview/` (git e'tiborsiz).

**Natija:** `node scripts/e2e-preview.mjs` → **10/10** · baza src/live bilan **4/10** (test haqiqiy).
- AC-05/07: 861-guruhda jonli dars ketayotganda o'sha brauzerda preview (CRM xato qilib mentor token ham bersa) — dars-api 0 so'rov,
  PIN-oyna yo'q, o'yinchilar soni va sessiya ekrani o'zgarmadi, mentor varag'i «Kod:» holatida qoldi.
- AC-03: ikki varaq — A da javob [4], B da [] · har varaqda o'z previewRunId.
- AC-04: F5 → yangi previewRunId, javob [4] → [], ekran 05 → 01.
- AC-01/06: 22/22-ekranda «Tamom» → onFinished (LMS no-op) 1 marta; School API natijalari soni o'zgarmadi; dars-api 0.
- window.__CC_VISIT_MODE__ yolg'iz ham ishlaydi.
- AC-02: o'sha kompyuterda haqiqiy saqlovda preview izi yo'q (urug' ekranlari, javob, ccSeal/ccDetails); yangi o'quvchi solo 01/22 dan.
- Oddiy jonli rejim: `tools/e2e-lms.mjs` **22/22** (src/live qaytarilgandan keyin).
- Darvozalar: `preview/main.jsx` 12/12; `lint:jsx preview` toza. Lokal xizmatlar to'xtatildi.

**Ochiq savol (foydalanuvchiga):** preview'da tanishtiruv-oynasi (onboarding) har ochilishda chiqadi — uning kaliti
(`inetOnboarded_`, `hcOnboarded_`) ham varaq xotirasida. Bu UI-sozlama (o'quvchi ma'lumoti emas): haqiqiy saqlovga o'tkazilsa,
o'qituvchi uni bir marta ko'radi. Qaror kutilmoqda.

**Keyingi:** 3-qadam — hamma darslarni yig'ish (build:lms) + oddiy rejim regressiyasi; IT javobi kelsa aniqlash qismi.

## F-1015-09 · 15.10.2026 14:47 — IT javobi (`jsx_preview_mode_backend_reply_uz.md`): A tasdiqlandi; `window` manbasi olib tashlandi

IT: JSX iframe'da emas, LMS URL'dagi `visit_mode` ni o'qib `visitMode` prop qilib uzatadi; `window.__CC_VISIT_MODE__` kerak emas
(«bitta source of truth»); uyga vazifalar scope'da emas; `previewRunId` yuborilmaydi; preview jim; reliz: staging → 174 dars qayta
yuklash → LMS staging → birga E2E → prod → CRM oxirida.
- `src/live/previewMode.js`: `fromGlobal` o'chirildi. Manba: prop (asosiy) + URL `visit_mode` (zaxira — foydalanuvchi qarori kutilmoqda).
- Tekshirildi: modul yuklanishida (import paytida) xotira o'qiydigan dars YO'Q (174 dars + src/live) — prop yolg'iz yetarli.
- Testlar: `window` yolg'iz → preview YOQILMAYDI (unit + e2e-preview); faqat prop (URL'siz) → yoqiladi (e2e-preview).

## F-1015-10 · 15.10.2026 14:47 — til kalitlari ham yozilmaydi (IT: «localStorage va sessionStorage'ga hech narsa yozilmasin»)

Avval `cc_lang`, `bridgeLang`, `hwDemoLang` preview'da haqiqiy saqlovga o'tib ketardi. Endi: o'qish haqiqiy saqlovdan
(o'qituvchi tanlagan til), yozish va o'chirish — varaq xotirasida. Unit-test: `cc_lang` o'qiladi 'ru', yoziladi 'uz' → haqiqiy 'ru' qoladi.

## F-1015-11 · 15.10.2026 14:47 — IT'ning 6 majburiy testi ↔ bizning sinovlar

| # | IT testi | Qayerda | Natija |
|---|---|---|---|
| 1 | `/lms/join`, `/lms/me`, `/me/progress`, live-room'ga so'rov yo'q | `src/live/previewMode.test.mjs` (4 funksiya `preview_offline`, fetch 0) · `scripts/smoke-preview.mjs` (brauzer; nazorat > 0) · `scripts/e2e-preview.mjs` (har preview-varaq: dars-api 0) | ✓ |
| 2 | `localStorage` va `sessionStorage`'ga hech narsa yozilmaydi | unit (progress, liveSession, til, sessionStorage, o'chirish) · smoke-preview **to'liq surat L+S** (YANGI) · e2e-preview **IT-2: to'liq surat, javob + «Tamom» bilan** (YANGI) · AC-02 | ✓ |
| 3 | F5 → dars noldan | e2e-preview AC-04 (yangi previewRunId, javob [4]→[], ekran 05→01) | ✓ |
| 4 | PIN-oyna va mentor paneli yo'q | smoke-preview (PIN; **mentor paneli** — YANGI, nazoratda bor) · e2e-preview AC-05 (PIN + **mentor paneli**, nazorat — mentor varag'i) | ✓ |
| 5 | `visitMode="preview"` + `liveToken` → token ishlatilmaydi | unit (url, hook opts: `hasLmsToken=false`, rejim self) · smoke-preview (token beriladi) · e2e-preview AC-05 (haqiqiy mentor JWT, eski mentor sessiya brauzerda) | ✓ |
| 6 | Davomat va o'quvchi flow o'zgarmaydi | `tools/e2e-lms.mjs` 22/22 · `scripts/preview-regress.mjs` (174 dars, baza↔yangi) | e2e-lms ✓ · 174 — F-1015-13 |

Natijalar (15.10.2026 14:47): unit 23/23 · smoke-preview InternetLesson 11/11, PmLesson6 ✓ · e2e-preview **12/12** · e2e-lms **22/22**.
Topilma: IT-2 birinchi yurishda test-urug'i sababli yiqildi (sessionStorage'dagi «bir marta» belgisi yangi varaqda yo'q →
`Date.now()` bilan qayta urug'lardi); urug' o'zgarmas qiymatli, belgi localStorage'da — 12/12.

## F-1015-12 · 15.10.2026 14:47 — hodisa sababi taxmini TUZATILDI

Eski taxmin (14.10): «CRM har JSX bosishda mentor JWT beradi → `joinMentor` jonli sessiya ochadi». IT javobi (8-band):
`Bilimlar bazasi` mentor JWT **bermaydi** — JWT faqat Davomat live-flow'ida. Demak sabab — **R1**: o'qituvchi shu brauzerda avval
jonli dars o'tkazgan bo'lsa, dars `liveSession:<id>` dagi eski mentor holatini tiklab, o'sha jonli xonaga qayta ulanadi
(smoke-preview nazorati buni ko'rsatadi: preview'siz dars eski PIN bilan heartbeat yuboradi). 1-qadamda yopilgan:
preview'da `liveRead` chaqirilmaydi, xotira-qatlam eski kalitni ko'rsatmaydi, tarmoq yopiq.

## F-1015-13 · 15.10.2026 15:17 — URL zaxirasi ham olib tashlandi: YAGONA manba — `visitMode` prop (foydalanuvchi qarori)

Sabab: IT «bitta source of truth»; amalda URL bor-u prop yo'q holat bo'lmaydi (CRM `visit_mode` ni LMS FE prod'dan keyin yoqadi).
- `src/live/previewMode.js`: `fromUrl` va modul-yuklanishdagi tekshiruv o'chirildi; `isPreview = () => on` — faqat `notePreviewProps` yoqadi.
- Tekshirildi (F-1015-09): import paytida xotira o'qiydigan dars yo'q → o'ram dars chizilishidan oldin qatlamni o'rnatadi, yetarli.
- Testlar: unit — URL yolg'iz va `window` yolg'iz → preview EMAS (6/6); `preview/main.jsx` `urlOnly=1` → e2e «URL yolg'iz — YOQILMAYDI».
- Topilma (sinov sahifasi): urug' endi o'ram chizilishidan OLDIN yozilardi → haqiqiy saqlovga tushdi (AC-02 ushladi).
  Sinov yo'lida o'ram bir marta oddiy funksiya sifatida chaqiriladi (faqat `CcLessonEntry` bo'lsa), keyin urug'.
- 174 dars qayta yig'ildi va oldingi (URL'li) yig'ma bilan solishtirildi: **174 faylda farq bir xil, faqat 13 qator** (`fromUrl` o'chishi);
  boshqa farq yo'q → F-1015-16 regressiya natijasi hozirgi kodga ham tegishli.

## F-1015-14 · 15.10.2026 15:17 — O'Z XATOIM: sinov yig'malari prod dars-api manzili bilan yig'ilgan edi (tuzatildi)

`build-lms` `DARS_API_URL`siz → sukut `https://dars-api.coddycamp.uz`. `smoke-preview` NAZORATI (preview'siz, eski mentor
sessiyasi) va baza-mutatsiyasi soxta PIN (123456, …) bilan prod'ga `GET /live/session/<pin>`, `GET /live/players/<pin>` yubordi;
`POST …/session_heartbeat` brauzer CORS-preflight'ida to'xtadi. Faqat o'qish, mavjud bo'lmagan PIN — ma'lumot o'zgarmagan.
Tuzatish: `smoke-preview` yig'masi yopiq lokal portga (`http://127.0.0.1:9`), `e2e-preview` va `preview-baza-build` — lokal `DARS_API_URL`;
ikkala testga himoya: `(dars-api|school-api|lms).coddycamp.uz` ga har so'rov = xato. Qayta yurgizildi — PROD so'rov 0.
(`go.coddycamp.uz/uploads/…` — dars ichidagi rasm, server so'rovi emas; himoya undan toraytirildi.)

## F-1015-15 · 15.10.2026 15:17 — yangi testlar mutatsiya-sinovi (baza — NUSXADAN, src/live joyida qoldi)

`scripts/preview-baza-build.mjs` (yangi): dars `feedback/F-1015-preview/baza/live` bilan, o'ramsiz yig'iladi (esbuild plagini);
`smoke-preview` va `e2e-preview` `BAZA_LIVE=<nusxa>` bilan. Har yurishdan keyin `git diff --stat src/live` o'zgarmagan.

| Sinov | Yangi kod | Baza kod (nusxadan) | Yangi testlar bazada |
|---|---|---|---|
| `smoke-preview` InternetLesson | 11/11 | 7/11 | mentor paneli ✗ · saqlov to'liq surat ✗ |
| `e2e-preview` (lokal stek, 5310) | **14/14** | 5/14 | IT-4 mentor paneli ✗ · IT-2 saqlov ✗ («ccProgress», «ccDetails» yozildi) |

Port: 5300 ni boshqa jarayon (pid 193737, menga tegishli emas) egallagan — tegilmadi; sayt 5310 da, server CORS 5310.
`tools/e2e-lms.mjs` (BASE 5310): **22/22**. Unit 24/24 · kalit-tekshiruv ✓ · gates previewMode/index/preview-main 12/12 · lint:jsx toza.

## F-1015-16 · 15.10.2026 15:17 — 3-QADAM: 174 dars oddiy rejim regressiyasi (faqat vaqtinchalik papka; `lms/` o'zgarmadi — git status 0)

`scripts/preview-regress.mjs`: har dars BAZA (nusxadan) va YANGI (build-lms) — `smoke-lms` ikkalasida, solishtiriladi.
- Yig'ilmadi: **baza 0 · yangi 0** (174/174 ikkalasida).
- smoke-lms ✓: baza 154 · yangi 152; farq 2 — `5-Modull/BotFullProjectLesson`, `BotIntroLesson`: yangida «screenshot timeout»
  (o'sha paytda parallel e2e yurgan). Alohida qayta: ikkalasi ✓; BotFullProject 287/289 belgi — tasodifiy (animatsiya, Math.random),
  keyingi yurishda farq 0. **Regressiya yo'q.**
- **Oldindan bor, baza = yangi (bizdan emas) — 20 dars, hammasi 2-seans hududi (7–11-Modul), TUZATILMADI:** dars ochiladi
  («dars: ha»), `smoke-lms` kompilyator-qadami yiqiladi («KOMPILYATOR OCHILMADI»; sabab tekshirilmadi — urug' naqshi yoki dars):
  7-M: AnimationLesson, PmFiveInterviewsLesson, PmProductProblemLesson, PmUsabilityTestLesson, PmUserStoryPitchLesson ·
  8-M: EventTrackingLesson, PmYearPathLesson, SecurityBasicsLesson ·
  9-M: ExpoPrototypeLesson, LivePrototypeLesson, PlatformChoiceLesson, PmInterviewsOneLesson, PmRoadmapLesson, PmTenIdeasLesson ·
  10-M: BreakAndFixLesson, PmChannelsLesson, PmGrowthPitchLesson, WebSocketBasicsLesson · 11-M: PaymentWebhookLesson, PmUnitEconomicsLesson.
- 18 praktika fayli va 1–4-Modul: hammasi ✓, farqsiz.
Natija fayli: scratchpad `regress-174/natija.json`. `lms/` ga yakuniy yig'ish — nazorat ruxsati bilan.

## F-1015-17 · 15.10.2026 15:25 — RELIZ REJASI (faqat reja — BAJARILMAGAN)

**Boshlash shartlari (nazorat kutyapti):** (1) foydalanuvchidan «Bilimlar bazasi»dagi darslar ro'yxati (IT scope:
`student_questions.type = lesson-runner`; uyga vazifalar kirmaydi); (2) relizdan oldingi commit — foydalanuvchi buyrug'i bilan.

**Har yurishda:** `ss -ltn` bilan bo'sh port (5300 — boshqa seansniki; men 5310 yoki bo'sh boshqasi); prod-himoya yoqiq qoladi
(`smoke-preview`/`e2e-preview`: `(dars-api|school-api|lms).coddycamp.uz` ga so'rov = xato); sinov yig'malari lokal `DARS_API_URL` bilan.

### R1. Ro'yxat → manba
«Bilimlar bazasi» ro'yxati (lesson_id) → `src/App.jsx` registri (`key`, `comp`) → `src/…` fayl. Har fayl: manbadagi `lessonId` =
ro'yxatdagi; id server-katalogida (`cutover-mashq` shu tekshiruvni qiladi). Ro'yxatda yo'q dars yig'ilmaydi.

### R2. CssPractice (m1-10) — ESKI nusxadan
- Manba: `arxiv/F-1015-amaliyot-oldin/CssPractice.jsx` (md5 `24bc36aeb9bb87713899efa1dbb4bd32`, lessonId `css-practice-portfolio-v3`;
  15.10 da `src/1-Modull/CssPractice.jsx` bilan bayt-bayt bir xil edi; 3-seans src'dagini qayta quryapti — unga TEGILMAYDI).
- Muammo: `build-lms` dars importlarini (`../live/index.js`, `../compilator/HtmlCompiler.jsx`) fayl turgan papkaga nisbatan hal qiladi —
  arxivdan to'g'ridan-to'g'ri yig'ilmaydi; nusxani `src/1-Modull` ga qo'yish = 3-seans hududi (taqiq).
- Yechim (kod — RELIZDAN OLDIN, alohida «ha» bilan): `build-lms` ga `--as`:
  `node scripts/build-lms.mjs arxiv/F-1015-amaliyot-oldin/CssPractice.jsx --as src/1-Modull/CssPractice.jsx`
  — esbuild `onLoad` plagini faylni arxivdan o'qiydi, `resolveDir` = `src/1-Modull` (importlar hozirgi src/live + kompilyator bilan);
  chiqish nomi va OUT_MAP — `--as` yo'li bo'yicha; banner: «Manba: arxiv/… (md5 …)». Eski nusxa joriy `src/live` eksportlari bilan mos
  (importlari: useLiveSession … useAutoNext — hammasi `index.js` da bor; 174-regressiyada shu bayt-kod ✓ o'tgan).
- Tekshiruv: chiqishda lessonId `css-practice-portfolio-v3`, banner md5, `notePreviewProps` bor; `smoke-lms` (kompilyator qatlami),
  `smoke-preview`; yuklash-papka'da `--skip m1-10` + shu alohida fayl.
- CRM_YUKLASH_ROYXATI.md da CssPractice IKKI variantda (76–77-qator): `CssPractice.jsx` (yakka) va `CssPractice.shared.jsx` —
  ikkalasi `--as` bilan yig'iladi (shared: `--shared <URL> … --as …`), qaysi biri CRM'da faol — nazorat bilan aniqlanadi.

### R3. Yig'ish buyruqlari
- **Mashq (vaqtinchalik papka, lms/ ga tegmaydi):** `node scripts/yuklash-papka.mjs --out <tmp> --moduls <ro'yxatdagi modul id'lari> --skip m1-10`
  ⚠ skript sukuti eskirgan: `--moduls 1,2,3,4,4a,4b,4c` va CRM-xarita 2026-09 holatida, App.jsx id'lari esa 08.10 dan beri 2…14
  (memory app-modul-raqamlari-lms) — id ro'yxati qo'lda beriladi, mashqda `ROYXAT.md` sanog'i ro'yxat bilan solishtiriladi.
- **lms/ ga (nazorat ruxsati bilan):** staging — `DARS_API_URL=https://staging-dars-api.coddycamp.uz node scripts/build-lms.mjs <fayllar>`;
  prod — `DARS_API_URL` bo'sh. CRM'da `.shared.jsx` bo'lganlar — `--shared <kompilyator URL>` (CRM_YUKLASH_ROYXATI.md bo'yicha);
  1–6-M uchun tayyor yo'l: `node scripts/cutover-mashq.mjs --url <manzil> --out lms --smoke` (90 fayl ro'yxati).
- ⚠ OCHIQ (nazorat qarori): `build-lms` OUT_MAP'da `src/5…12-Modull` yo'q → 7–14-M fayllari `lms/` ILDIZIGA tushib 1–2-M bilan aralashadi.
  Ro'yxatda 7–14-M bo'lsa: OUT_MAP ga `7-M…14-M` qo'shish (scripts/ — 1-seans) yoki faqat yuklash-papka chiqishi.
- ⚠ OCHIQ: `--shared` rejimi + preview-o'ram hali sinalmagan → mashqda `smoke-shared` majburiy.

### R4. Yig'ishdan keyin (har fayl)
`notePreviewProps` bor · `visit_mode`/`__CC_VISIT_MODE__` o'qilmaydi · API-manzil to'g'ri (staging/prod, Supabase yo'q) ·
`smoke-lms`/`smoke-shared` · `preview-keys-check` · `preview-regress` (baza↔yangi, ro'yxat fayllari) · `smoke-preview` (har modul 1 dars) ·
lokal `e2e-preview` 14/14 + `e2e-lms` 22/22 · md5-ro'yxat (`ROYXAT.md`).

### R5. Staging tekshiruv ro'yxati (IT bilan birga; IT reliz tartibi 1–3)
1. Biz: umumiy modul + ro'yxatdagi darslar staging-manzil bilan qayta yuklanadi. 2. IT: LMS FE staging.
3. `/preview?jsx=…&visit_mode=preview` — darsda «Предпросмотр/Oldindan ko'rish» belgisi (prop yetdi).
4. DevTools Network: dars-api'ga 0 so'rov (`/lms/join`, `/lms/me`, `/me/progress`, `/live/*`).
5. PIN-oyna va mentor paneli yo'q.
6. Application: localStorage + sessionStorage — oldin/keyin surat bir xil.
7. Preview oxirigacha («Tamom») → School API'da natija yo'q; test-o'quvchida completion/urinish/ochilgan dars yo'q (AC-06).
8. F5 → noldan; ikki varaq mustaqil (AC-03/04).
9. **Asosiy E2E (IT 5-band):** o'qituvchi preview'ni oxirigacha o'tadi → test-o'quvchi o'sha darsni LMS'dan ochadi → boshlang'ich holat (AC-02).
10. **R1 holati:** o'qituvchi brauzerida avval Davomat'dan jonli dars → keyin Bilimlar bazasi preview → jonli xonaga kirmaydi, o'yinchilar o'zgarmaydi.
11. Davomat live-flow (test-guruh, mentor JWT): PIN'siz kirish, o'quvchi qo'shiladi, «Erkin qilish», natija School API'ga (AC-08);
    o'quvchi solo-flow va onFinished (AC-09).
12. Tanlanma: har moduldan 1 dars + kompilyatorli (`.shared`) dars.
13. Prod-himoya: staging sinovida prod `dars-api` ga so'rov yo'q.
### R6. Prod (IT tartibi 4–7) va qaytish
Prod yig'ish (`DARS_API_URL` bo'sh) → qayta yuklash → IT: LMS FE prod → **oxirida** CRM `visit_mode=preview` → test-guruh smoke.
Qaytish: eski fayllar commit'da — qayta yuklash; preview belgisi bo'lmasa yangi fayllar ham avvalgidek ishlaydi (174-regressiya).

## F-1015-18 · 15.10.2026 15:31 — RELIZ RO'YXATI: LMS'dagi 2–6-Modul = **70 dars** (IT'ga «174» o'rniga shu son)

Manba: LMS'ga oxirgi yuklash `yuklash-2026-10-04/*/ROYXAT.md` (88 fayl = 70 dars + 18 uyga vazifa; «Nom — uz» = CRM'dagi material nomi),
`src/App.jsx` registri (fayl), `lms/` (joriy yig'malar). Avtomatik solishtirish: src topilmagan 0 · lessonId farqi 0 · `lms/` da yo'q 0 ·
`.shared` varianti borlari 22. 7–14-Modul relizga KIRMAYDI (foydalanuvchi qarori). Uyga vazifalar — IT scope'da emas.
Registrda bor, LMS'da yo'q (30.09 da `--skip`): `m2-16` PmMuammoIzlash, `m3-17` PmJtbdLesson — relizga kirmaydi.
🔧 = 18 praktika faylidan (3-seans hududi); ★ = CssPractice — arxivdagi eski nusxadan (`build-lms --as`).

| # | LMS modul | № | Bilimlar bazasidagi nom (uz) | src | lms/ | lesson_id | shared |
|---|---|---|---|---|---|---|---|
| 1 | LMS 2-Modul (CRM: M1 ildiz) | 01 | Internet qanday ishlaydi | `src/1-Modull/InternetLesson.jsx` | `lms/InternetLesson.jsx` | `internet-01-v18` | — |
| 2 | LMS 2-Modul (CRM: M1 ildiz) | 02 | Kim mening foydalanuvchim? | `src/1-Modull/PmLesson1.jsx` | `lms/PmLesson1.jsx` | `pm-m1d2-v1` | ha |
| 3 | LMS 2-Modul (CRM: M1 ildiz) | 03 | HTML asoslari | `src/1-Modull/Htmllesson1.jsx` | `lms/Htmllesson1.jsx` | `html-01-v17` | ha |
| 4 | LMS 2-Modul (CRM: M1 ildiz) | 04 | HTML: rasm, struktura, forma, DevTools | `src/1-Modull/Htmllesson2.jsx` | `lms/Htmllesson2.jsx` | `html-02-v16` | ha |
| 5 | LMS 2-Modul (CRM: M1 ildiz) | 05 | Takrorlash: HTML ustaxonasi | `src/1-Modull/HtmlTakrorlashLesson.jsx` | `lms/HtmlTakrorlashLesson.jsx` | `html-takrorlash-01-05-v2` | ha |
| 6 | LMS 2-Modul (CRM: M1 ildiz) | 06 | Struktura — foydalanuvchi uchun qilingan qulaylik | `src/1-Modull/PmLesson2.jsx` | `lms/PmLesson2.jsx` | `pm-m1d6-v1` | ha |
| 7 | LMS 2-Modul (CRM: M1 ildiz) | 07 | CSS asoslari: ranglar, shriftlar, bo'shliqlar | `src/1-Modull/CssLesson1.jsx` | `lms/CssLesson1.jsx` | `css-01-v17` | ha |
| 8 | LMS 2-Modul (CRM: M1 ildiz) | 08 | CSS: layout, flexbox, DevTools | `src/1-Modull/CssLesson2.jsx` | `lms/CssLesson2.jsx` | `css-02-v18` | ha |
| 9 | LMS 2-Modul (CRM: M1 ildiz) | 09 | 🔧 HTML Praktika — Portfolio sayt | `src/1-Modull/HtmlPractice.jsx` | `lms/HtmlPractice.jsx` | `html-practice-portfolio-v2` | ha |
| 10 | LMS 2-Modul (CRM: M1 ildiz) | 10 | VS Code — professional start | `src/1-Modull/VsCodeLesson.jsx` | `lms/VsCodeLesson.jsx` | `vscode-start-01-v1` | ha |
| 11 | LMS 2-Modul (CRM: M1 ildiz) | 11 | ★ CSS Praktika — Portfolioni bezaymiz | `src/1-Modull/CssPractice.jsx` | `lms/CssPractice.jsx` | `css-practice-portfolio-v3` | ha |
| 12 | LMS 2-Modul (CRM: M1 ildiz) | 12 | Git va GitHub — kodni internetga chiqaramiz | `src/1-Modull/GitLesson.jsx` | `lms/GitLesson.jsx` | `git-github-v19` | — |
| 13 | LMS 2-Modul (CRM: M1 ildiz) | 13 | Netlify va deploy | `src/1-Modull/DeployLesson.jsx` | `lms/DeployLesson.jsx` | `netlify-deploy-v19` | — |
| 14 | LMS 2-Modul (CRM: M1 ildiz) | 14 | Demo Day — 3 daqiqalik nutq | `src/1-Modull/PmLesson3.jsx` | `lms/PmLesson3.jsx` | `pm-pitch-03-v19` | ha |
| 15 | LMS 3-Modul (CRM: M2 ildiz) | 01 | Sistema va Algoritm | `src/2-Modull/JsIntroLesson.jsx` | `lms/JsIntroLesson.jsx` | `js-intro-01-v18` | — |
| 16 | LMS 3-Modul (CRM: M2 ildiz) | 02 | Muammodan yechimga | `src/2-Modull/PmLesson4.jsx` | `lms/PmLesson4.jsx` | `pm-m2d2-v1` | ha |
| 17 | LMS 3-Modul (CRM: M2 ildiz) | 04 | JavaScript — O'zgaruvchilar | `src/2-Modull/JsVarsLesson.jsx` | `lms/JsVarsLesson.jsx` | `js-vars-01-v18` | ha |
| 18 | LMS 3-Modul (CRM: M2 ildiz) | 05 | JavaScript — if/else | `src/2-Modull/JsConditionsLesson.jsx` | `lms/JsConditionsLesson.jsx` | `js-cond-01-v18` | ha |
| 19 | LMS 3-Modul (CRM: M2 ildiz) | 06 | JavaScript — Sikllar (for, while) | `src/2-Modull/JsLoopsLesson.jsx` | `lms/JsLoopsLesson.jsx` | `js-loops-01-v18` | ha |
| 20 | LMS 3-Modul (CRM: M2 ildiz) | 07 | JavaScript — Funksiya, parametr, return | `src/2-Modull/JsFunctionsLesson.jsx` | `lms/JsFunctionsLesson.jsx` | `js-functions-01-v18` | ha |
| 21 | LMS 3-Modul (CRM: M2 ildiz) | 08 | Dekompozitsiya — ochilish ro'yxati | `src/2-Modull/PmLesson5.jsx` | `lms/PmLesson5.jsx` | `pm-m2d7-v1` | ha |
| 22 | LMS 3-Modul (CRM: M2 ildiz) | 09 | 🔧 Praktika 1 — Saytni jonlantiramiz | `src/2-Modull/PracticeLesson1.jsx` | `lms/PracticeLesson1.jsx` | `practice-01-jonlantirish-v18` | ha |
| 23 | LMS 3-Modul (CRM: M2 ildiz) | 10 | 🔧 Praktika 2 — AI bilan tez sayt | `src/2-Modull/PracticeLesson2.jsx` | `lms/PracticeLesson2.jsx` | `practice-02-ai-promo-v18` | — |
| 24 | LMS 3-Modul (CRM: M2 ildiz) | 11 | PERN Stack — 4 texnologiya, bitta jamoa | `src/2-Modull/PeanStackLesson.jsx` | `lms/PeanStackLesson.jsx` | `pean-stack-01-v18` | ha |
| 25 | LMS 3-Modul (CRM: M2 ildiz) | 12 | 🔧 Praktika 3 — Dekompozitsiya (mini-do'kon) | `src/2-Modull/PracticeLesson3.jsx` | `lms/PracticeLesson3.jsx` | `practice-03-decompose-v18` | — |
| 26 | LMS 3-Modul (CRM: M2 ildiz) | 13 | 🔧 Praktika 4 — MVP tayyor (deploy) | `src/2-Modull/PracticeLesson4.jsx` | `lms/PracticeLesson4.jsx` | `practice-04-mvp-deploy-v18` | — |
| 27 | LMS 3-Modul (CRM: M2 ildiz) | 14 | Sistemani qanday pitch qilish | `src/2-Modull/PmLesson6.jsx` | `lms/PmLesson6.jsx` | `pm-m2d13-v1` | ha |
| 28 | LMS 4-Modul (4-M) | 01 | React nima va nima uchun? | `src/3-Modull/ReactIntroLesson.jsx` | `lms/4-M/ReactIntroLesson.jsx` | `react-intro-01-v18` | — |
| 29 | LMS 4-Modul (4-M) | 02 | User Story: kim va nima uchun? | `src/pm/PmUserStoryLesson.jsx` | `lms/4-M/PmUserStoryLesson.jsx` | `pm-m3d2-v3` | ha |
| 30 | LMS 4-Modul (4-M) | 04 | Birinchi komponent: Vite, JSX, props | `src/3-Modull/ReactFirstComponentLesson.jsx` | `lms/4-M/ReactFirstComponentLesson.jsx` | `react-first-component-02-v18` | — |
| 31 | LMS 4-Modul (4-M) | 05 | State va Effect: useState + useEffect | `src/3-Modull/ReactStateEffectLesson.jsx` | `lms/4-M/ReactStateEffectLesson.jsx` | `react-state-effect-03-v18` | — |
| 32 | LMS 4-Modul (4-M) | 06 | Qaysi ishni birinchi qilasiz? | `src/3-Modull/PmLesson8.jsx` | `lms/4-M/PmLesson8.jsx` | `pm-m3d5-v1` | — |
| 33 | LMS 4-Modul (4-M) | 07 | Props va qayta ishlatish | `src/3-Modull/ReactPropsReuseLesson.jsx` | `lms/4-M/ReactPropsReuseLesson.jsx` | `react-props-reuse-04-v18` | — |
| 34 | LMS 4-Modul (4-M) | 08 | 🔧 Praktika: CRUD — to'liq boshqariladigan ilova | `src/3-Modull/ReactCrudPracticeLesson.jsx` | `lms/4-M/ReactCrudPracticeLesson.jsx` | `react-crud-practice-p1-v18` | — |
| 35 | LMS 4-Modul (4-M) | 09 | API bilan ishlash: GET — serverdan ma'lumot olish | `src/3-Modull/ReactApiGetLesson.jsx` | `lms/4-M/ReactApiGetLesson.jsx` | `react-api-get-05-v18` | — |
| 36 | LMS 4-Modul (4-M) | 10 | API: POST/PUT/DELETE — serverga ma'lumot yuborish | `src/3-Modull/ReactApiPostLesson.jsx` | `lms/4-M/ReactApiPostLesson.jsx` | `react-api-post-06-v18` | — |
| 37 | LMS 4-Modul (4-M) | 11 | Qachon «tayyor» deb ayta olamiz? | `src/3-Modull/PmLesson9.jsx` | `lms/4-M/PmLesson9.jsx` | `pm-m3d10-v1` | ha |
| 38 | LMS 4-Modul (4-M) | 12 | 🔧 Praktika: React Router — ko'p sahifali ilova | `src/3-Modull/ReactRouterPracticeLesson.jsx` | `lms/4-M/ReactRouterPracticeLesson.jsx` | `react-router-practice-p2-v18` | — |
| 39 | LMS 4-Modul (4-M) | 13 | 🔧 Praktika: Loyiha kuni — AvtoIjara | `src/3-Modull/ReactProjectDayLesson.jsx` | `lms/4-M/ReactProjectDayLesson.jsx` | `react-project-day-p3-v18` | — |
| 40 | LMS 4-Modul (4-M) | 14 | 🔧 Praktika: Istalgan saytni qurish — bo'laklash + aniq prompt | `src/3-Modull/ReactBuildSiteLesson.jsx` | `lms/4-M/ReactBuildSiteLesson.jsx` | `react-build-site-final-p4-v18` | — |
| 41 | LMS 4-Modul (4-M) | 15 | Ishlayotgan saytingizni qanday ko'rsatasiz? | `src/3-Modull/PmLesson10.jsx` | `lms/4-M/PmLesson10.jsx` | `pm-m3d14-v1` | — |
| 42 | LMS 5-Modul (5-M) | 01 | Ma'lumot va bog'lanishlar: JSON, jadval, sxema | `src/4-Modull/DataIntroLesson.jsx` | `lms/5-M/DataIntroLesson.jsx` | `data-intro-04-01-v18` | — |
| 43 | LMS 5-Modul (5-M) | 02 | Ilova nimani eslab qolsin? | `src/4-Modull/PmLesson11.jsx` | `lms/5-M/PmLesson11.jsx` | `pm-m4d2-v1` | — |
| 44 | LMS 5-Modul (5-M) | 03 | SQL vs NoSQL — nega PostgreSQL | `src/4-Modull/DbSqlNosqlLesson.jsx` | `lms/5-M/DbSqlNosqlLesson.jsx` | `db-sql-nosql-04-02-v18` | — |
| 45 | LMS 5-Modul (5-M) | 04 | Node.js — birinchi serveringiz | `src/4-Modull/NodeServerLesson.jsx` | `lms/5-M/NodeServerLesson.jsx` | `node-server-04-03-v18` | — |
| 46 | LMS 5-Modul (5-M) | 05 | Routing: server so'rovni qanday topadi | `src/4-Modull/RoutingLesson.jsx` | `lms/5-M/RoutingLesson.jsx` | `nest-routing-04-04-v18` | — |
| 47 | LMS 5-Modul (5-M) | 06 | PostgreSQL so'rovlar — CRUD + AI bilan | `src/4-Modull/PostgresCrudLesson.jsx` | `lms/5-M/PostgresCrudLesson.jsx` | `pg-crud-04-05-v18` | — |
| 48 | LMS 5-Modul (5-M) | 07 | Sinfdoshingiz sahifangizni ochsa, nimani ko'radi? | `src/4-Modull/PmLesson12.jsx` | `lms/5-M/PmLesson12.jsx` | `pm-m4d7-v1` | — |
| 49 | LMS 5-Modul (5-M) | 08 | 🔧 Praktika: Backend CRUD — AvtoIjara | `src/4-Modull/BackendCrudPracticeLesson.jsx` | `lms/5-M/BackendCrudPracticeLesson.jsx` | `backend-crud-practice-p1-v18` | — |
| 50 | LMS 5-Modul (5-M) | 09 | API va Postman — front backend bilan qanday gaplashadi | `src/4-Modull/ApiPostmanLesson.jsx` | `lms/5-M/ApiPostmanLesson.jsx` | `api-postman-04-06-v18` | — |
| 51 | LMS 5-Modul (5-M) | 10 | 🔧 Praktika: Fullstack ulash — AvtoIjara | `src/4-Modull/FullstackConnectPracticeLesson.jsx` | `lms/5-M/FullstackConnectPracticeLesson.jsx` | `fullstack-connect-practice-p2-v18` | — |
| 52 | LMS 5-Modul (5-M) | 11 | Autentifikatsiya va .env — login, JWT, maxfiy kalitlar | `src/4-Modull/AuthEnvLesson.jsx` | `lms/5-M/AuthEnvLesson.jsx` | `auth-env-04-07-v18` | — |
| 53 | LMS 5-Modul (5-M) | 12 | Ilova nimani yozib qoladi? | `src/4-Modull/PmLesson13.jsx` | `lms/5-M/PmLesson13.jsx` | `pm-m4d12-v1` | — |
| 54 | LMS 5-Modul (5-M) | 13 | 🔧 Praktika: Loyiha kuni — AvtoStoyanka | `src/4-Modull/FullstackProjectDayLesson.jsx` | `lms/5-M/FullstackProjectDayLesson.jsx` | `fullstack-projectday-p3-v18` | — |
| 55 | LMS 5-Modul (5-M) | 14 | 🔧 Praktika: Feedback bilan yaxshilash — AvtoStoyanka | `src/4-Modull/FullstackFeedbackLesson.jsx` | `lms/5-M/FullstackFeedbackLesson.jsx` | `fullstack-feedback-p4-v18` | — |
| 56 | LMS 5-Modul (5-M) | 15 | «Qanday ishlaydi?» deb so'rashsa | `src/4-Modull/PmLesson14.jsx` | `lms/5-M/PmLesson14.jsx` | `pm-m4d15-v1` | — |
| 57 | LMS 6-Modul (6-M) | 01 | Nest arxitektura — tirik ko'rish | `src/4a-Modull/NestArchAliveLesson.jsx` | `lms/6-M/NestArchAliveLesson.jsx` | `nest-arch-alive-4a-01-v18` | — |
| 58 | LMS 6-Modul (6-M) | 02 | Hamma birdan kirsa, sayt chidaydimi? | `src/4a-Modull/PmLesson15.jsx` | `lms/6-M/PmLesson15.jsx` | `pm-m4a2-v1` | — |
| 59 | LMS 6-Modul (6-M) | 03 | Birinchi resursni qo'lda qo'shish — mashinalar | `src/4a-Modull/NestArchResourceLesson.jsx` | `lms/6-M/NestArchResourceLesson.jsx` | `nest-arch-resource-4a-02-v18` | — |
| 60 | LMS 6-Modul (6-M) | 04 | 🔧 Praktika — KitobShop backend | `src/4a-Modull/NestArchPracticeLesson.jsx` | `lms/6-M/NestArchPracticeLesson.jsx` | `nest-arch-practice-4a-03-v18` | — |
| 61 | LMS 6-Modul (6-M) | 01 | Unit-test: Jest | `src/4b-Modull/JestUnitTestLesson.jsx` | `lms/6-M/JestUnitTestLesson.jsx` | `jest-unit-04b-01-v18` | — |
| 62 | LMS 6-Modul (6-M) | 02 | Bitta xato — nechta odam ketadi? | `src/4b-Modull/PmLesson16.jsx` | `lms/6-M/PmLesson16.jsx` | `pm-m4b2-v1` | — |
| 63 | LMS 6-Modul (6-M) | 03 | Edge cases va error path | `src/4b-Modull/EdgeCasesTestLesson.jsx` | `lms/6-M/EdgeCasesTestLesson.jsx` | `edge-cases-04b-02-v18` | — |
| 64 | LMS 6-Modul (6-M) | 01 | CI/CD nima va nega kerak | `src/4c-Modull/CiCdIntroLesson.jsx` | `lms/6-M/CiCdIntroLesson.jsx` | `cicd-intro-4c-01-v18` | — |
| 65 | LMS 6-Modul (6-M) | 02 | Hammasini birdan chiqaraymi — yoki har hafta bo'lak? | `src/4c-Modull/PmLesson17.jsx` | `lms/6-M/PmLesson17.jsx` | `pm-m4c2-v1` | — |
| 66 | LMS 6-Modul (6-M) | 03 | GitHub Actions — yo'l xaritasini yozish | `src/4c-Modull/GithubActionsLesson.jsx` | `lms/6-M/GithubActionsLesson.jsx` | `github-actions-4c-02-v18` | — |
| 67 | LMS 6-Modul (6-M) | 04 | 🔧 Loyiha kuni — to'liq lentani qurish | `src/4c-Modull/FullPipelineProjectLesson.jsx` | `lms/6-M/FullPipelineProjectLesson.jsx` | `cicd-full-pipeline-4c-03-v18` | — |
| 68 | LMS 6-Modul (6-M) | 05 | 🔧 AI bilan lentani boshqarish | `src/4c-Modull/AiPipelineProjectLesson.jsx` | `lms/6-M/AiPipelineProjectLesson.jsx` | `cicd-ai-pipeline-4c-05-v18` | — |
| 69 | LMS 6-Modul (6-M) | 06 | Saytingiz hozir ochilyaptimi? | `src/4c-Modull/PmLesson18.jsx` | `lms/6-M/PmLesson18.jsx` | `pm-m4c6-v1` | — |
| 70 | LMS 6-Modul (6-M) | 07 | 🔧 Loyiha kuni: ishonchli lenta | `src/4c-Modull/FullProPipelineLesson.jsx` | `lms/6-M/FullProPipelineLesson.jsx` | `full-pro-pipeline-4c-04-v18` | — |

Sanoq: LMS 2-Modul (CRM: M1 ildiz): 14 · LMS 3-Modul (CRM: M2 ildiz): 13 · LMS 4-Modul (4-M): 14 · LMS 5-Modul (5-M): 15 · LMS 6-Modul (6-M): 14 · jami 70 · shulardan praktika (3-seans) 18.

## F-1015-19 · 15.10.2026 15:35 — COMMIT REJASI (commit QILINMADI — nazorat tekshiradi, buyruq foydalanuvchidan)

Manba: `git status --untracked-files=all` (relizga tegishli yo'llar). Har guruhga «kim o'zgartirgan» — diffdagi F-ID bo'yicha.

### A. Preview (shu seans, F-1015) — KIRADI (31 fayl)
- `src/live/`: `LiveUI.jsx`, `index.js`, `liveClient.js`, `progressSync.js`, `useLiveSession.js` (M) · `previewMode.js`, `previewMode.test.mjs` (yangi)
- `scripts/`: `build-lms.mjs` (M — o'ram, `--as`) · yangi: `e2e-preview.mjs`, `smoke-preview.mjs`, `preview-regress.mjs`, `preview-baza-build.mjs`, `preview-keys-check.mjs`
- `preview/index.html`, `preview/main.jsx` (yangi, faqat dev — vite prod build'ga kirmaydi)
- `feedback/F-1015-preview/` (16): `JURNAL.md`, `XAT-IT-01.md`, `XAT-IT-01-UZ.md`, 2 skrinshot, `baza/` (o'zgarishdan oldingi src/live + build-lms nusxasi — mutatsiya-sinovi manbasi)
- ❓ repo ildizidagi IT hujjatlari: `jsx_preview_mode_backend_contract.md`, `…_user_story_acceptance.md`, `…_backend_reply_uz.md` (untracked) — kiritish yoki `feedback/F-1015-preview/` ga ko'chirish (nazorat qarori)

### B. Dars fayllari — oldingi seanslar (F-1012/F-1013 navigatsiya: mentor qulflanmaydi, maxReached) — KIRADI (52 fayl)
Shu seans tegmagan; seans boshida ham `M` edi. Hammasida faqat F-1012/F-1013 izli o'zgarish (avtomatik tekshirildi):
- `1-Modull`: CssLesson1 (+12/−6), CssLesson2 (+12/−6), DeployLesson (+10/−5), GitLesson (+10/−5), HtmlTakrorlashLesson (+12/−6), Htmllesson1 (+12/−6), Htmllesson2 (+10/−5), InternetLesson (+12/−6), PmLesson1 (+10/−5), PmLesson2 (+12/−6), PmLesson3 (+10/−5), VsCodeLesson (+147/−21)
- `2-Modull`: JsConditionsLesson (+10/−5), JsFunctionsLesson (+12/−6), JsIntroLesson (+10/−5), JsLoopsLesson (+10/−5), JsVarsLesson (+10/−5), PeanStackLesson (+12/−6), PmLesson4 (+10/−5), PmLesson5 (+11/−6), PmLesson6 (+10/−5)
- `3-Modull`: PmLesson10 (+12/−6), PmLesson8 (+12/−6), PmLesson9 (+12/−6), ReactApiGetLesson (+11/−5), ReactApiPostLesson (+13/−6), ReactFirstComponentLesson (+11/−5), ReactIntroLesson (+11/−5), ReactPropsReuseLesson (+11/−5), ReactStateEffectLesson (+11/−5)
- `4-Modull`: ApiPostmanLesson (+11/−5), AuthEnvLesson (+11/−5), DataIntroLesson (+11/−5), DbSqlNosqlLesson (+11/−5), NodeServerLesson (+11/−5), PmLesson11 (+12/−6), PmLesson12 (+12/−6), PmLesson13 (+12/−6), PmLesson14 (+12/−6), PostgresCrudLesson (+11/−5), RoutingLesson (+13/−6)
- `4a-Modull`: NestArchAliveLesson (+27/−13), NestArchResourceLesson (+11/−5), PmLesson15 (+12/−6)
- `4b-Modull`: EdgeCasesTestLesson (+11/−5), JestUnitTestLesson (+11/−5), PmLesson16 (+13/−7)
- `4c-Modull`: CiCdIntroLesson (+13/−6), GithubActionsLesson (+13/−6), PmLesson17 (+13/−7), PmLesson18 (+13/−7)
- `pm`: PmUserStoryLesson (+12/−6)

### C. 3-seans hududi (18 praktika) — NAZORAT QARORI
- **CssPractice** — ish nusxasi commitga KIRMAYDI (3-seans qayta quryapti, F-1015); relizga `arxiv/F-1015-amaliyot-oldin/CssPractice.jsx` dan `--as` bilan (arxivda F-1012/F-1013 bor — boshqa darslar bilan bir asosda).
- **HtmlPractice** — katta qayta yozish (+1613/−2462; F-1004, F-1005, F-1012, F-1013, F-1014). ⚠ 3-seans tasdig'isiz kirmasin: ish nusxasi chala bo'lishi mumkin; mashq yig'masi aynan shu nusxadan.
- **16 praktika** — faqat F-1012/F-1013 kichik tuzatish (+10…13/−5…6), 3-seans hali tegmagan: PracticeLesson1, PracticeLesson2, PracticeLesson3, PracticeLesson4, ReactBuildSiteLesson, ReactCrudPracticeLesson, ReactProjectDayLesson, ReactRouterPracticeLesson, BackendCrudPracticeLesson, FullstackConnectPracticeLesson, FullstackFeedbackLesson, FullstackProjectDayLesson, NestArchPracticeLesson, AiPipelineProjectLesson, FullPipelineProjectLesson, FullProPipelineLesson. Tavsiya: B bilan birga (3-seans roziligi bilan).

### D. Boshqa — shu seans tegmagan, egasi aniqlansin
- `src/App.jsx` — m1-08 HtmlPractice ↔ m1-15 VsCode o'rni (n 9/10). ⚠ LMS'dagi tartib (04.10 ROYXAT) boshqacha: commit qilinsa `yuklash-papka` NN raqamlari o'zgaradi.
- `src/compilator/HtmlCompiler.jsx` (+17/−1), `src/compilator/teg-xaritasi.json` (1 qator) — yakka yig'maga kiradi (kompilyator ichida); shared variant tashqi modulni (`lms/html-compiler.jsx`, LMS'dagi) ishlatadi.
- `package.json` — `pitch` skripti (14.10 pitch-dars) — relizga aloqasi yo'q.


## F-1015-20 · 15.10.2026 15:40 — `build-lms --as` (foydalanuvchi «ha») + RELIZ-MASHQI (vaqtinchalik papka; `lms/` o'zgarmadi — git status 0)

**`--as`:** `node scripts/build-lms.mjs <nusxa> --as <src-yo'l>` — esbuild `onLoad` plagini nusxani o'qiydi, `resolveDir` = src-yo'l papkasi;
chiqish nomi/OUT_MAP — src-yo'l bo'yicha; banner: haqiqiy manba + md5 + «--as», «Qayta yig'ish» qatorida ham `--as`. `--shared` bilan ishlaydi.
Isbot: arxiv nusxasi src/live+compilator havolali soya-papkada oddiy yig'ilganda — `--as` yig'masi bilan kodda farq 0 (faqat esbuild yo'l-izohlari).
CssPractice: 15.10 kechqurun `src` dagi md5 `78fe…` (3-seans o'zgartirmoqda), arxiv `24bc36ae…` — relizga arxiv.
`smoke-preview`: `fayl=src-yo'l` (--as) va `SHARED_SPEC` (tashqi modul → lokal `lms/html-compiler.jsx`, tarmoqsiz).

**Mashq** (skript: scratchpad `mashq.sh`; prod URL bilan yig'ildi — sinovlar seed/yopiq-port, prod'ga so'rov yo'q):
| Qadam | Buyruq | Natija |
|---|---|---|
| yakka | `yuklash-papka.mjs --out <tmp> --moduls 2,3,4,5,6 --skip m1-10,m2-16,m3-17` | 69 dars + 18 uyga vazifa = 87 fayl |
| CssPractice yakka | `build-lms.mjs arxiv/…/CssPractice.jsx --as src/1-Modull/CssPractice.jsx` | ✓ (jami dars 70) |
| shared | `build-lms.mjs --shared <URL> <21 src>` + CssPractice `--as` | 22/22 ✓ |
| o'ram | `grep -L notePreviewProps` | o'ramsiz 0 · `__CC_VISIT_MODE__` 0 · supabase 0 |
| smoke-lms | yakka 87 + CssPractice | hammasi ✓ (CssPractice kompilyator ✓) |
| smoke-shared | 22 ta | ✓ 22 · ✗ 0 |
| smoke-preview yakka | Internet, JsVars, ReactIntro, NodeServer, PmLesson15, PmLesson18, CssPractice(--as) | 7/7 ✓ (har biri 11 tekshiruv) |
| smoke-preview shared | CssLesson2, CssPractice(--as) | 2/2 ✓ |

**Nazorat/foydalanuvchiga savollar:**
1. HtmlPractice — ish nusxasi (3-seans katta qayta yozish) relizga kiradimi yoki u ham arxiv/commit holatidan (`--as`)? Mashq hozirgi ish nusxasidan.
2. F-1012 izohi: «mentor (jonli dars va **LMS preview**) topshiriqqa qulflanmaydi» — 12.10 da preview = mentor deb o'ylangan. Endi preview = `self`:
   o'qituvchi preview'da topshiriqlarga o'quvchi kabi qulflanadi (AC-01 bajariladi — javob berib oxirigacha o'tadi). Preview'da erkin o'tish kerakmi?
   (Kerak bo'lsa — darslardagi `NavNext` ga tegadi: ommaviy tahrir → alohida qaror.)
3. `src/App.jsx` tartib o'zgarishi (HtmlPractice ↔ VsCode) commit qilinsa — LMS'dagi 04.10 tartibidan farq qiladi.
4. IT'ga son: **70 dars** (LMS 2–6-Modul), uyga vazifalar scope'dan tashqari (lekin yuklash paketida 18 ta bor — yuklanadimi?).

## F-1015-21 · 15.10.2026 16:15 — nazorat qarorlari bajarildi; YAKUNIY commit ro'yxati (commit QILINMADI — foydalanuvchi buyrug'i kutiladi)

**Qarorlar:** HtmlPractice — foydalanuvchi qarori kutiladi (a: hozirgi 14.10 ish nusxasi — nazorat tavsiyasi / b: HEAD) ·
preview'da topshiriq-qulfi — hozirgidek (o'qituvchi o'quvchi kabi; NavNext'ga tegilmaydi) · App.jsx tartibi commit'ga kiradi
(LMS tartibini foydalanuvchi CRM'da o'zi almashtiradi) · uyga vazifalar (18) qayta YUKLANMAYDI · IT'ga son — **70 dars** (ro'yxat bilan).

**Bajarildi:**
- IT hujjatlari (3) repo ildizidan `feedback/F-1015-preview/` ga ko'chirildi (untracked edi — `mv`); kod izohlaridagi yo'l yangilandi
  (`src/live/previewMode.js`, `scripts/e2e-preview.mjs`); previewMode gates 12/12.
- `scripts/yuklash-papka.mjs`: yangi bayroq `--uyga-vazifasiz` (sukut qiymatlari o'zgarmadi). Mashq: 69 fayl, uyga vazifa 0, ROYXAT'da
  uyga-vazifa qatori 0, README'da «bu paketda yo'q» qatori; bayroqsiz rejim avvalgidek (tekshirildi).
- `feedback/F-1015-preview/IT-ROYXAT-70.md` — IT uchun ruscha ro'yxat (№, modul, uz/ru nom, lesson_id), manba 04.10 ROYXAT.

**Reliz buyruqlari (yangilangan R3):** yakka — `yuklash-papka.mjs --out <papka> --moduls 2,3,4,5,6 --skip m1-10,m2-16,m3-17 --uyga-vazifasiz`
+ `build-lms.mjs arxiv/F-1015-amaliyot-oldin/CssPractice.jsx --as src/1-Modull/CssPractice.jsx`; shared — `build-lms.mjs --shared <URL> <21 src>`
+ CssPractice `--as` (qaysi variant faol — foydalanuvchi CRM'dan aytadi). HtmlPractice (b) tanlansa — `--as` bilan HEAD nusxasidan.

### Commit ro'yxati
**A — preview (KIRADI):**
- `src/live/`: LiveUI.jsx, index.js, liveClient.js, progressSync.js, useLiveSession.js (M) · previewMode.js, previewMode.test.mjs (yangi)
- `scripts/`: build-lms.mjs, yuklash-papka.mjs (M) · e2e-preview.mjs, smoke-preview.mjs, preview-regress.mjs, preview-baza-build.mjs, preview-keys-check.mjs (yangi)
- `preview/`: index.html, main.jsx (yangi, faqat dev)
- `feedback/F-1015-preview/`: hammasi (JURNAL, XAT-IT-01 (+UZ), IT-ROYXAT-70, 3 IT hujjati, 2 skrinshot, baza/ nusxa)
**B — 52 dars (KIRADI):** `src/1-Modull/CssLesson1.jsx`, `src/1-Modull/CssLesson2.jsx`, `src/1-Modull/DeployLesson.jsx`, `src/1-Modull/GitLesson.jsx`, `src/1-Modull/HtmlTakrorlashLesson.jsx`, `src/1-Modull/Htmllesson1.jsx`, `src/1-Modull/Htmllesson2.jsx`, `src/1-Modull/InternetLesson.jsx`, `src/1-Modull/PmLesson1.jsx`, `src/1-Modull/PmLesson2.jsx`, `src/1-Modull/PmLesson3.jsx`, `src/1-Modull/VsCodeLesson.jsx`, `src/2-Modull/JsConditionsLesson.jsx`, `src/2-Modull/JsFunctionsLesson.jsx`, `src/2-Modull/JsIntroLesson.jsx`, `src/2-Modull/JsLoopsLesson.jsx`, `src/2-Modull/JsVarsLesson.jsx`, `src/2-Modull/PeanStackLesson.jsx`, `src/2-Modull/PmLesson4.jsx`, `src/2-Modull/PmLesson5.jsx`, `src/2-Modull/PmLesson6.jsx`, `src/3-Modull/PmLesson10.jsx`, `src/3-Modull/PmLesson8.jsx`, `src/3-Modull/PmLesson9.jsx`, `src/3-Modull/ReactApiGetLesson.jsx`, `src/3-Modull/ReactApiPostLesson.jsx`, `src/3-Modull/ReactFirstComponentLesson.jsx`, `src/3-Modull/ReactIntroLesson.jsx`, `src/3-Modull/ReactPropsReuseLesson.jsx`, `src/3-Modull/ReactStateEffectLesson.jsx`, `src/4-Modull/ApiPostmanLesson.jsx`, `src/4-Modull/AuthEnvLesson.jsx`, `src/4-Modull/DataIntroLesson.jsx`, `src/4-Modull/DbSqlNosqlLesson.jsx`, `src/4-Modull/NodeServerLesson.jsx`, `src/4-Modull/PmLesson11.jsx`, `src/4-Modull/PmLesson12.jsx`, `src/4-Modull/PmLesson13.jsx`, `src/4-Modull/PmLesson14.jsx`, `src/4-Modull/PostgresCrudLesson.jsx`, `src/4-Modull/RoutingLesson.jsx`, `src/4a-Modull/NestArchAliveLesson.jsx`, `src/4a-Modull/NestArchResourceLesson.jsx`, `src/4a-Modull/PmLesson15.jsx`, `src/4b-Modull/EdgeCasesTestLesson.jsx`, `src/4b-Modull/JestUnitTestLesson.jsx`, `src/4b-Modull/PmLesson16.jsx`, `src/4c-Modull/CiCdIntroLesson.jsx`, `src/4c-Modull/GithubActionsLesson.jsx`, `src/4c-Modull/PmLesson17.jsx`, `src/4c-Modull/PmLesson18.jsx`, `src/pm/PmUserStoryLesson.jsx`
**C — praktika:** 16 ta KIRADI: `src/2-Modull/PracticeLesson1.jsx`, `src/2-Modull/PracticeLesson2.jsx`, `src/2-Modull/PracticeLesson3.jsx`, `src/2-Modull/PracticeLesson4.jsx`, `src/3-Modull/ReactBuildSiteLesson.jsx`, `src/3-Modull/ReactCrudPracticeLesson.jsx`, `src/3-Modull/ReactProjectDayLesson.jsx`, `src/3-Modull/ReactRouterPracticeLesson.jsx`, `src/4-Modull/BackendCrudPracticeLesson.jsx`, `src/4-Modull/FullstackConnectPracticeLesson.jsx`, `src/4-Modull/FullstackFeedbackLesson.jsx`, `src/4-Modull/FullstackProjectDayLesson.jsx`, `src/4a-Modull/NestArchPracticeLesson.jsx`, `src/4c-Modull/AiPipelineProjectLesson.jsx`, `src/4c-Modull/FullPipelineProjectLesson.jsx`, `src/4c-Modull/FullProPipelineLesson.jsx` · `src/1-Modull/CssPractice.jsx` — KIRMAYDI · `src/1-Modull/HtmlPractice.jsx` — qarorga qarab.
**D — KIRADI:** `src/App.jsx`, `src/compilator/HtmlCompiler.jsx`, `src/compilator/teg-xaritasi.json` · **KIRMAYDI:** `package.json`.


## F-1015-22 · 15.10.2026 17:17 — YAKSHANBA RELIZ (18.10.2026) — tayyorgarlik

**Foydalanuvchi qarori:** reliz yakshanba 18.10, bir yo'la — preview + yangi praktikalar (3-seans) + VsCodeLesson yangi versiyasi.
Hozir `lms/` ga yig'ish YO'Q. HtmlPractice a/b savoli bekor (3-seansda yangi qolipga o'tadi). Commit — foydalanuvchi alohida aytadi.
Shundan: **praktikalar (CssPractice ham) — o'sha kungi src'dan**; `build-lms --as` (arxiv) endi ZAXIRA yo'li (3-seans kechiksa).
F-1015-21 commit-ro'yxatidagi «CssPractice KIRMAYDI / HtmlPractice qarorga qarab» — yakshanbagacha 3-seans holatiga qarab qayta ko'riladi.

### Bitta buyruq
```
node scripts/preview-reliz.mjs --out <papka> --api staging|prod [--tez]
```
- `--out`: `lms/`, `src/`, repo ildizi — rad etiladi (sinaldi). `--api staging` → `https://staging-dars-api.coddycamp.uz`, `prod` → sukut.
- Qadamlar (har biri ✓/✗, `<out>/HISOBOT.md`, chiqish kodi 1 = yiqildi):
  1. ro'yxat: App.jsx registri 2–6 (`--skip m2-16,m3-17`) → 70 dars; `lesson_id` lar `IT-ROYXAT-70.md` bilan — yangi id
     (yangi praktika versiyasi) bo'lsa ✗ + lokal katalogda bor-yo'qligi (serverda bo'lmasa LMS'da join 404 → server katalogini yangilash kerak)
  2. unit-testlar (24) + `preview-keys-check` (yangi praktikalar yangi xotira-kalit qo'shsa — ushlaydi)
  3. yakka: `yuklash-papka --moduls 2,3,4,5,6 --skip m2-16,m3-17 --uyga-vazifasiz` (NN-raqamli, ROYXAT.md + md5)
  4. shared: `lms/` da `.shared` varianti bor darslar (22) — `build-lms --shared <kompilyator URL>`
  5. statik: har faylda o'ram, `window`-belgi yo'q, API manzili mos, supabase yo'q
  6. `smoke-lms` (yakka) · 7. `smoke-shared` (har shared) · 8. `smoke-preview` (yakka + shared; yopiq lokal port, prod-himoya)
- Sinov (15.10, `--tez`, staging, scratchpad): **10/10 ✓** — 70 dars, 22 shared, statik 92 fayl, smoke-lms ✗0, smoke-shared 22/22, preview 5+1.
  To'liq rejim (70+22 preview) — F-1015-23.

### Yakshanba tartibi
1. **Oldin:** nazorat — 3-seans praktikalari va VsCodeLesson tayyor (fayllar yopiq, darvozalar toza); commit (foydalanuvchi buyrug'i).
2. **Staging yig'ma:** `node scripts/preview-reliz.mjs --out yuklash-2026-10-18-staging --api staging` → HISOBOT ✓ bo'lmasa — TO'XTA.
   ⚠ «ro'yxat» qadami ✗ bo'lsa (yangi lesson_id) — IT/server katalogi yangilanmaguncha yuklanmaydi.
3. **Lokal E2E** (bo'sh port tekshiriladi: `ss -ltn`; 5300 — boshqa seansniki): soxta LMS 3999 + server 3001 (`RESULT_LIVE_REPEAT=send`,
   `CORS_ORIGINS` = tanlangan port) + sayt (`DARS_API_URL=http://127.0.0.1:3001 npx vite --port <bo'sh>`) →
   `BASE=http://localhost:<port> node scripts/e2e-preview.mjs` (14/14) va `BASE=… node tools/e2e-lms.mjs` (22/22).
4. **Staging'ga yuklash** (foydalanuvchi, CRM): `yuklash-2026-10-18-staging/` — 70 dars (CRM'da faol variant: yakka yoki shared — foydalanuvchi).
5. **Staging tekshiruvi** — F-1015-17 R5 ro'yxati (13 band; IT bilan birga): preview belgisi, dars-api 0 so'rov, PIN/mentor paneli yo'q,
   saqlov o'zgarmagan, «Tamom» → natija yo'q, F5/ikki varaq, **o'qituvchi preview → test-o'quvchi toza boshlaydi**, R1 holati,
   Davomat live-flow va o'quvchi solo-flow, har moduldan 1 dars + shared, prod'ga so'rov yo'q.
   + yangi: 3-seans praktikalari va VsCodeLesson — kompilyator ochiladi, preview'da xotira-kaliti qolmaydi.
6. **Prod:** `node scripts/preview-reliz.mjs --out yuklash-2026-10-18-prod --api prod` → ✓ → yuklash → IT: LMS FE prod →
   **oxirida** CRM `visit_mode=preview` → test-guruh smoke.
7. **Qaytish:** eski fayllar `yuklash-2026-10-04/` (LMS'dagi joriy) — qayta yuklash; preview belgisi bo'lmasa yangi fayllar ham avvalgidek ishlaydi.

## F-1015-23 · 15.10.2026 17:34 — `preview-reliz.mjs` TO'LIQ rejim sinovi (staging, scratchpad; `lms/` o'zgarmadi — git status 0)

`node scripts/preview-reliz.mjs --out <scratchpad>/reliz-toliq --api staging` → **10/10 ✓, chiqish 0**:
ro'yxat 70/70 · unit 24/0 · preview-keys-check ✓ · yakka 70 · shared 22/22 · statik 92 fayl ✓ · smoke-lms ✗0 · smoke-shared 22/22 ·
**smoke-preview yakka 70/70 · shared 22/22** (har biri: dars-api 0, belgi, PIN/mentor paneli yo'q, saqlov surati o'zgarmagan; nazorat qismi — hisoblagich va mentor paneli bor).
Holat 15.10 kechqurungi src (CssPractice — 3-seansning joriy nusxasi). Yakshanbada praktikalar o'zgaradi — buyruq o'sha kuni qayta yuriladi.
Sinalmagan: skriptning «ro'yxat ✗» yo'li (yangi lesson_id) — hozir id'lar mos, shu sabab ishlab ko'rilmadi.
