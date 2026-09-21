---
name: uyga-vazifa-etalon
description: "PmLesson2.homework ETALON (2026-08-27) + shu naqshda m1-02 Auditoriya va m1-12 Demo Day PM uy vazifalari (2026-08-28, deploy ✓, UNCOMMITTED); M1 Tex paketlar uyga-vazifa/ da; qolgani = LMS'ga yuklash"
metadata: 
  node_type: memory
  type: project
  originSessionId: feb3da80-bcbe-46ed-80f3-c82da629c420
  modified: 2026-09-02T10:40:02.660Z
---

**Etalon:** `src/1-Modull/PmLesson2.homework.jsx` (v2.2, ~975 q) + `lms/PmLesson2.homework.shared.jsx` —
2026-08-27 da 34 fidbek bilan etalon holatga keltirildi va https://coddycamp-uyga-vazifa.vercel.app
ga chiqarildi. Branch `uyga-vazifa-pilot`, **commit cf05cc8 (2026-08-27 18:14)** — deploy-bundle = lokal dist-hw (2026-08-28 tekshirildi).

**Etalon-naqsh (yangi uy vazifalari SHU bo'yicha quriladi):**
- 4 bosqich + Natija; stepper «1-bosqich … Natija · k/4» (raqam-doira, bog'lovchi chiziq, 3 holat)
- Mentor-avatar YO'Q; har bosqich: markaziy sarlavha (`h-center`, aksent-chiziq) → (bir qatorli `.h-sub` izoh) → ish-maydoni
- Tanlov-karta: belgi + chegara + tanlangan-holat (radio YO'Q, hint YO'Q) — 3 tur (novvoyxona/oshxona/kanstovar), misollar turga ergashadi
- Bo'sh majburiy input pulsatsiya (`.inp.hint`), to'lganda yashil chegara; placeholder «Masalan: …»
- Nav: «Davom etish →» asosiy (tugamaguncha nofaol), «Keyinroq tugataman →» kichik ikkilamchi
- Test: birma-bir (Kahoot), 3 savol, to'g'ri → 1.5s → keyingisi uchib keladi; xato → silkinish
- Natija ≥3/4: to'liq-ekran bayram (indigo parda, AchCelebrate sahnasi, faqat «Uyga vazifa bajarildi!»), keyin 🏆 + o'z sayti preview + «Vazifani topshirish» → «✓ Topshirildi». <3/4: ro'yxat + «Tugatish →», topshirish YO'Q
- Payload: `{lessonId, kind:'homework', done:true, stages, place, durationSec}` — reflection YO'Q, done:false yuborilmaydi
- Matn: «biznes» (joy emas), «Asosiy mijoz kim?», «konversiya»/«chala» so'zlari yo'q; qonun 146 (DARS_ETALON 11-J)

**Ish-tartibi (har tahrirdan keyin):** `npm run gates -- <fayl>` → `node scripts/build-lms.mjs --shared <URL> <fayl>` →
`.vercel`/`.env.local` zaxira → `npx vite build --config vite.hw.config.js` → tiklash → `cd dist-hw && npx vercel deploy --prod --yes`.
Lokal ko'rik: `npx vite preview --config vite.hw.config.js --port 4179`. Demo UZ/RU tugmasi `src/hw-demo/main.jsx`da (LMS'da yo'q).

**2026-08-28 bajarildi:** `PmLesson1.homework.jsx` (HW_ID pm-m1-02, senariy `pm-senariylar/M1-D2-Auditoriya-UY.md`) va
`PmLesson3.homework.jsx` (pm-m1-14, `M1-D12-Pitch-UY.md`) etalon-naqshda qurildi — 5/5 darvoza, Playwright ✓, shared yig'ildi,
**UNCOMMITTED**. Demo-sayt (coddycamp-uyga-vazifa) FAQAT PmLesson2 + UZ/RU (vazifa-tanlov RAD). Ikkalasi darsdagi saqlovdan
avto-to'ladi (`pm-m1d2-cards` — MASSIV, `ccPitch3`). Mikrofon-yozuv YO'Q (qaror).
🔴 **Ogohlik:** m1-02 = `PmLesson1.jsx` (App.jsx), `PmAudienceLesson.jsx` — eski, o'chirilgan versiya (papkada qolgan). Dars-fayl
nomini har doim App.jsx `key → comp` orqali tekshirish; ertalab shu xato bo'lgan edi.
**Bugungi etalon-qarorlar (uchala vazifada):** mezon 4/4 (3/4 EMAS — 3-bosqich yagona haqiqiy tekshiruv) · bo'lim-chip bitta rang,
qora-bold, ikonka aksent, fon accentSoft · to'lgan input = o'ngda ✓ (yashil chegara yo'q) · fon `#F7F6FC` · stepper joriy = yashil
to'la · test-almashish onAnimationEnd (soya-bug). Fon-sinov (oq-kulrang/indigo) RAD. Ochiq: input-sharti (F-22), 3-bosqich
preview javob-sizish tashxisi. M1 Tex darslar (11 ta) paketlari `uyga-vazifa/<key>-…md` —
nomi dars KALITI bilan, tartib-raqami emas (m1-14 Takrorlash = 5-dars, foydalanuvchi shu sabab topolmagan).
Etalon-qoldiqlar (joy→biznes `:127/:415/HOMEWORK`, o'lik CSS `.acu-desc/.ck`, F-22 uzunlik-mezoni) — foydalanuvchi qarori
bilan TEGILMADI («etalon shu holida qoladi»). Ochiq: 3 PM shared-modulni LMS'ga yuklash; Tex paketlarni CRM'ga kiritish.
**2026-09-02 — M2 (JS-modul) Tex paketlari to'liq (UNCOMMITTED, foydalanuvchi hukmi kutilmoqda):**
10 paket `uyga-vazifa/m2-*.md`: m2-01 Text (sistema/algoritm) · m2-03..06 Kompilyator-JS
(natija FAQAT konsolda — darslar DOM o'rgatmaydi, rasm = konsol-nusxa, namuna-yechimlar node'da
ijro etilib tekshirildi) · m2-08 Kompilyator HTML+JS (natija sahifada, rasm «ochilganda 0 →
3 bosishda 3», Playwright'da isbotlandi) · m2-09/10/11/12 Text (prompt-4-ingredient, PERN-detektiv,
dekompozitsiya, MVP+deploy-havola — m1-11 naqshi). Rasm-qoida (foydalanuvchi 2026-09-02): rasm
majburiy EMAS — faqat halol ko'rsatib bo'lsa qo'yiladi. m2-06 tuzoq: sarlavhada «Array+Object»
tursa ham dars faqat funksiya/parametr/return o'rgatadi. lint:til 10 faylda 0 error (3 kontekst-
false-positive ifodani almashtirib yechildi: «jon kirit», «robot-usta», «o'z so'zingiz»).
**2026-09-02 (2) — M2 PM uy vazifalari (UNCOMMITTED, foydalanuvchi ko'rigi kutilmoqda):**
PmLesson4/5/6.homework.jsx (pm-m2-02/07/13) etalon-naqshda qurildi — 5/5 darvoza, Playwright 22/18/21,
shared yig'ildi, smoke PASS; senariylar pm-senariylar/M2-D2·D7·D13-*-UY.md. Avto-to'lish kalitlari:
pm-m2d2-features · pm-m2d7-mvp.v1 · pm-m2d13-pitch. Validatorlar DARSDAN AYNAN (FLAT/DECOR, levelOf,
findJargon+ANALOGY) — «vazifa darsdan qat'iyroq ham, yumshoqroq ham emas» qoidasi. Halol-qulflar:
tarozi darajani o'zi chiqaradi; 😐/😕 da «o'zgartirmayman» yopiq. F-0828-09 hurmat-shakl katta
tinglovchiga har yangi suhbat-bosqichda MAJBURIY tekshiriladi (shu safar ham tutildi).
**2026-09-02 (3) — M3 Tex paketlari to'liq (UNCOMMITTED):** 10 paket m3-01..13.
🔴 M3-kashfiyot: React LMS-kompilyatorda ISHLAMAYDI (HtmlCompiler'da babel/jsx yo'q, React darslari
uni import qilmaydi) — praktika VS Code+Antigravity'da. Yechim: «Text + kod-joylash» turi — o'quvchi
App.jsx kodini javobga ko'chiradi, AI-prompt darsning ScreenLivePractice checklist-bandlarini kod
ichidan qidiradi (useState/map/spread/method:'POST'/Link...). m3-01 sof Text (tushuncha), m3-12 reja+
prompt (deploy YO'Q — darsda yo'q), m3-13 deploy-havola (m1-11 naqshi). M3 PM (m3-02/05/10/14) —
darslarda tayyor uy-kapsula + artefakt-kalitlar (pm-m3d2-stories/hw-target · pm-m3d5-board ·
pm-m3d10-shartlar · pm-m3d14-pitch); .homework.jsx rejasi foydalanuvchi GATE'ida.
**2026-09-02 (4) — M3 PM uy vazifalari 4/4 tayyor (UNCOMMITTED):** PmUserStoryLesson.homework (pm-m3-02,
src/pm/) · PmLesson8/9/10.homework (pm-m3-05/10/14, src/3-Modull/) — 5/5 darvoza, Playwright 25/20/22/20,
shared+smoke PASS, senariylar M3-D2·D5·D10·D14-*-UY.md. Avto-kalitlar: pm-m3d2-stories+hw-target ·
pm-m3d5-board · pm-m3d10-shartlar · pm-m3d14-pitch (faqat O'QILADI, P0 tegilmagan). Dars-validatorlar
aynan: validateStory/canSave · bahoKatak/BAHO_SABAB · juftlikOxshash/BAHO_SOZ(warn) · ekranniTakror(warn)/
1–5-so'z-harakat. Ochiq qaror (senariyda): m3-10 «son yoki aniq harakat» → tekshirsa bo'ladigan qismi =
kamida bitta SONLI shart. M1+M2+M3 uy-vazifa qatlami endi TO'LIQ: 21 tex-paket + 9 PM .homework.jsx.
**2026-09-02 (5) — M4 Tex paketlari 11/11 (UNCOMMITTED):** m4-01,03,04,05,06,08,09,10,11,13,14 —
Text yoki Text+kod-joylash (server.js/SQL/App.jsx), lint 0 error. m4-11 da xavfsizlik-rels: maxfiy
kalit QIYMATI javobga joylanmaydi (faqat nomi), AI birinchi qoidasi — qiymat ko'rinsa kalitni
almashtirishni aytish. m4-13 da deploy YO'Q (darsda localhost). M4 PM (m4-02/07/12/15 =
PmLesson11–14): darslarda kapsula + artefaktlar (pm-m4d2-data · pm-m4d7-ishonch · pm-m4d12-sxema ·
pm-m4d15-pitch), validatorlar hujjatlashtirildi; .homework.jsx rejasi foydalanuvchi GATE'ida.
**2026-09-02 (6) — M4 PM uy vazifalari 4/4 tayyor (UNCOMMITTED):** PmLesson11–14.homework
(pm-m4-02/07/12/15, src/4-Modull/) — 5/5 darvoza, Playwright 17/19/19/17, shared+smoke PASS,
senariylar M4-D2·D7·D12·D15-*-UY.md. Avto-kalitlar: pm-m4d2-data · pm-m4d7-ishonch · pm-m4d12-sxema ·
pm-m4d15-pitch. Dars-validatorlar aynan (UMUMIY_SOZ · ODAM_RE/BAHO_SOZ · takrorNom/juftOxshash ·
TEXNIK_RE). Yangi halol-mexanikalar: javobda bo'lim-nomi so'z-qidiruvi (m4-02) · bir-🔒 mezoni +
uchchala-👁 halol eslatmasi (m4-07) · uch-shart halol chipi (m4-12). **UMUMIY HOLAT: M1–M4 uy-vazifa
qatlami TO'LIQ — 32 tex-paket + 13 PM .homework.jsx.** Qolgan: foydalanuvchi ko'rigi (M2–M4),
commit, LMS/CRM-yuklash, M5+ modullari.
**2026-09-02 (7) — 4a/4b/4c Tex paketlari 10/10 (UNCOMMITTED):** m4a-01,03,04 · m4b-01,03 ·
m4c-01,03,04,05,07 — Text yoki Text+kod-joylash (ci.yml/spec.ts/playbook), lint 0 error (topilma:
uz-matnda kirill «да» homoglifi — qo'l-terish xatosi, prompt-lint bilan ham tekshirildi).
Xavfsizlik-rels m4c-04/07 da ham: ochiq token ko'rinsa AI birinchi ishi — kalit almashtirishni aytish.
PM (m4a-02/m4b-02/m4c-02/m4c-06 = PmLesson15–18): artefaktlar pm-m4a2-yuk · pm-m4b2-sifat ·
pm-m4c2-reliz · pm-m4c6-signal, validatorlar hujjatlashtirildi; .homework.jsx rejasi GATE'da.
**Why:** foydalanuvchi «UI toza tursin» — har ortiqcha matn/element olib tashlandi; yangi vazifalar shu tozalikda bo'lsin.
**How to apply:** yangi homework yozishda PmLesson2.homework.jsx dan nusxa-naqsh; TMI qo'shmaslik; matnni foydalanuvchi bilan ekranma-ekran tasdiqlash.
[[tmi-taqiq-bitta-ip]] [[lms-shared-modul]] [[m1-ish-royxati]]
**2026-09-02 (8) — BUTUN KURS UY-QATLAMI YOPILDI (UNCOMMITTED):** oxirgi 4 PM homework qurildi —
PmLesson15 (pm-m4a-02, yuk-qarorlari; saqlov 'kuchaytiramiz'/'oddiy'!) · PmLesson16 (pm-m4b-02,
nosozlik-karta+javon avto-hukm) · PmLesson17 (pm-m4c-02, 4-hafta bo'lagi + «bosganda nima bo'ladi») ·
PmLesson18 (pm-m4c-06, Network 3-o'lchov, hukmni son chiqaradi). Hammasi: gates 5/5, Playwright
28/29/26/30 PASS, shared+smoke PASS. Jami: 42 tex-paket + 17 PM .homework.jsx (M1…4c). Qolgan:
foydalanuvchi ko'rigi, commit buyrug'i, LMS/CRM-yuklash. Muhim saboq: dars-artefakt qiymatlarini
(enum-satrlar) YOZISHDAN OLDIN grep bilan tasdiqlash — 'kuch' taxmini xato chiqqan edi.
