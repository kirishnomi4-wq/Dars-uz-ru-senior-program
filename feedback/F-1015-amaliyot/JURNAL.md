# F-1015 amaliyot — praktikalar qayta qolipi (3-seans) — jurnal

> Chegara: faqat 18 praktika fayli (2–6-Modul) + shu papka + `arxiv/F-1015-amaliyot-oldin/`. F-ID: F-1015-300…399. Commit YO'Q.
> Oldingi tarix: `feedback/F-1013-amaliyot/DAVOM.md`, `JURNAL.md`.

## 2026-10-15 14:29 · F-1015-300 · 1-qadam: hisobot (kodga tegilmadi)
- Maqsad (foydalanuvchi): praktika «bosdim → bosdim → qildim» emas — o'quvchi 2–3 AI vositasi bilan VS Code + Live Server'da ishni haqiqatan o'zi qiladi; 6–8 ekran.
- O'lchov (`SCREEN_META` turlari, statik): 18 dars, 13–25 ekran; asosiy ekranlarning ~75% haqiqiy ishsiz yoki tekshiruvsiz.
  m2-08…m2-12 — haqiqiy ish 0 (soxta agent / Antigravity simulyatsiyasi); m3-07…m4c-07 — 1–4 amaliyot ekrani, hammasi `ScreenLivePractice` (o'zi belgilaydi → «Bajardim», tekshiruv yo'q);
  m1-10, m2-08 — 3 tadan `HtmlCompiler` vazifasi (avto-tekshiruv, lekin VS Code/AI emas); m1-10 da AI yo'q (nomida bor).
- m1-08: ish haqiqiy (VS Code + Gemini), lekin 16 × «Bajardim» — rad etilgan naqsh; prompt tayyor beriladi; namuna nusxasi bilan aylanib o'tish mumkin.
- Antigravity (18+) ga haqiqiy ish tayangan 4 dars: m3-12, m3-13, m4-13, m4c-05.
- AI tekshiruvi (15.10, rasmiy sahifalar): Gemini 13+ (UZ ro'yxatda ✓, Google akkaunt 13), Copilot Free 13+ (GitHub ToS), ChatGPT 13+ ota-ona roziligi bilan 18 gacha (UZ ✓), Claude 18+, Antigravity 18+;
  **Gemini Code Assist (individual) 18.06.2026 dan to'xtatilgan** (rasmiy FAQ) — VS Code ichidagi Google AI yo'q.
- Isbot variantlari: V1 kod joylash + avto-tekshiruv (`HtmlCompiler` checks), V2 o'z prompti, V3 natijadan qiymat; tavsiya V4 birlashma.
- Qolip: 6 ish ekrani (Maqsad · Tayyorgarlik · A1 Gemini · A2 Copilot · A3 o'zi o'zgartiradi · Topshirish) + Natijalar + Yakun.
- Sahifa (suratlar, 7 qaror savoli): https://claude.ai/artifact/QubJSkwSB5VWm2mmgdC4oQ. Kutilmoqda: «GATE Q-1015» javobi.

## 2026-10-15 14:44 · F-1015-301 · GATE Q-1015 javobi
- Q1 A (birlashma; V3 qiymati o'quvchiga xos bo'lsin — qo'shnidan ko'chirib bo'lmasin) · Q2 A (Gemini + Copilot Free; m1-08, m1-10 da faqat Gemini — GitHub akkaunt m1-09 da ochiladi; Copilot m2-08 dan; ChatGPT yo'q) ·
  Q3 B (6 ish ekrani + 3 standart = 9, kartochka qoladi) · Q4 A (1 baholanadigan savol + arena) · Q5 A (namuna qoladi, isbot o'quvchiga xos) · Q6 A (Antigravity faqat «18+ ixtiyoriy») · Q7 A (m1-08 pilotdan keyin).
- Qo'shimcha: Tayyorgarlik ekranidagi «Live Server manzili» isboti olinadi (hammada bir xil).
- Fakt tekshirildi: App.jsx 2-blok tartibi — m1-08 n:10 → m1-10 n:11 → m1-09 Git n:12 ✓.

## 2026-10-15 14:56 · F-1015-302 · GATE Q-1015 o'zgartirildi (yo'nalish aniqlashtirildi)
- Maqsad — faqat ekranlarni kamaytirish, praktikaga vaqt qolsin; ustoz darsda o'quvchilar bilan birga qiladi va ko'rib turadi.
- Q1 → isbot YO'Q: kod joylash, avto-tekshiruv (V1/V2/V3), «tiqilib qolish» olinadi. Ish ekrani: 1 gap vazifa + prompt bo'yicha maslahat + kutilgan natija surati; o'tish — «Davom etish».
- Q5 → namuna kodi qoladi, qo'shimcha shart yo'q. Q2, Q3, Q4, Q6, Q7 — o'zgarmadi.
- Texnik shartlar: (1) eski progress (20 ekran) 9 ekranli darsda bo'sh ekran/xato bermasin — sinovda; (2) `arxiv/F-1015-amaliyot-oldin/` zaxirasi o'chirilmaydi, ustidan yozilmaydi (pilot tasdiqlanmasa CRM'ga eski nusxa yuklanadi).
- Kod o'qildi: `progRead` (src/live/liveClient.js:140) va `useServerProgress` (`total` farq qilsa → 0-ekran, javoblar tozalanadi) — himoya bor; sinovda tasdiqlanadi.

## 2026-10-15 15:09 · F-1015-303 · m1-10 pilot: zaxira + MD v3 (kodga tegilmadi)
- Foydalanuvchi tuzatishlari: (1) jurnalga faqat Edit/Write yoki `<<'EOF'` (tirnoqsiz heredoc backtick'ni bajardi — F-1015-302 yozuvida) → memory `jurnal-yozish-xavfsiz`;
  (2) nishonlar olinmaydi — bloklarga: a1 → spacer, a2 → layout, a3 → color, graduate — yakunda (bonus, §184; 152-qonun istisnosi — foydalanuvchi qarori).
- Zaxira: `arxiv/F-1015-amaliyot-oldin/CssPractice.jsx` (bir marta, `cmp` — joriy fayl bilan aynan).
- Manba: App.jsx (m1-08 → m1-10 → m1-09 Git) · m1-08 v3.2 (A4 dizayn — m1-10 endi «bezaksiz» holatdan boshlanmaydi) · o'tilgan atamalar grep:
  flex/gap/justify-content — CssLesson2 ✓, border-radius — VsCodeLesson ✓, `:hover` va `Ctrl+H` — hech qayerda yo'q (a1/a3 da ekranda tanishtiriladi).
- MD: `01-m1-10-v3.md` — 9 ekran (s0 · s1 · a1 · a2 · a3 · s16 · spodium · sflash · s17); ballik — faqat s16 (✔ C `display: flex`); arena 12 savol aynan; kartochkalar 10; uyga vazifa VS Code + skrinshot.
  MATN_KORPUS o'qildi (§173, 182–184, 206, 210, 216–225). `lint:til` — 0 error (1 warn — 6-qatordagi muallif izohi, o'quvchiga ko'rinmaydi).
- GATE M sahifasi (prototip + 2 savol): https://claude.ai/artifact/2pv8hKCydkcpcGWmBJ2UxQ. Kutilmoqda: «GATE M m1-10» javobi.

## 2026-10-15 15:20 · F-1015-304 · GATE M m1-10 ✓ (1 A · 2 A — sukut tavsiyalar) + 3 izoh
- (1) Kontrast: sahifa prototipida kod-belgi to'q fonda to'q edi. Sabab: `konveyer/vositalar/gatem/base.css` dagi `code` tungi rejimda fonni (`--code-bg`) almashtiradi, rangni bermaydi;
  doim-och prototip ichida matn qorong'i qoldi. Tuzatildi: prototipga `.pr code` aniq rang (sahifa v2). `base.css` — chegaradan tashqarida, tegilmadi (foydalanuvchiga aytildi).
  Darsning o'zi uchun: MD «KOD» 7-band — har kod-belgi kontrasti ≥ 4.5:1, ikki rejimda o'lchanadi.
- (2) Arena 12 savol mavzulari (o'quvchi-matn grep): 1–11 — m1-06/m1-07 ✓; 12 (`margin: 0 auto`) — m1-15 VS Code darsida ✓ («margin: 40px auto»), m1-06/07 da yo'q. Almashtirish kerak emas; jadval MD da.
- (3) a1 mentor olindi (bandlar va «Masalan» bilan takror). Sinf-supurish (§216, shu MD): a2 mentor — natija ostidagi qator bilan takror → olindi, «CSS darsidagi flexbox» natija ostiga;
  a3 mentor — 1–2-qadamlar bilan takror → olindi, eyebrow «Amaliyot 3 · Gemini'siz». Qolgan ekranlar (s0, s1, s16) ko'rildi — takror yo'q.
- Korpus-juftlik (§216 ga misol) — so'rovda.

## 2026-10-15 15:33 · F-1015-305 · m1-10 CssPractice qurildi (20 → 9 ekran) + korpus §227
- Korpus: `MATN_KORPUS.md` oxiri qayta o'qildi (oxirgi §226) → **§227** «Amaliyot ekranida mentor prompt bandlarini takrorlamaydi» faqat oxiriga qo'shildi; `lint:prompt` toza.
- Fayl: `src/1-Modull/CssPractice.jsx` 3360 → 2645 qator (git: +341 −1050). Zaxira: `arxiv/F-1015-amaliyot-oldin/CssPractice.jsx` (tegilmadi).
  Ekranlar: s0 kirish · s1 reja · a1/a2/a3 (`ScreenAmaliyot`, `AMALIYOT` ma'lumoti) · s16 topshirish (MC, ✔ C) · spodium · sflash · s17.
  Yangi: `PfSahifa` (4 holat), `NAMUNA_HTML`, `NAMUNA_CSS_0/1/2`, `NamunaBtn`, `BLOK_ACH` (a1 spacer · a2 layout · a3 color, «Davom etish»da; mentor rejimida berilmaydi), 10 kartochka, `HOMEWORK` `type: 'file'`.
  Olindi: kompilyator importi va portali, `PRACTICE_AFTER`, `TASK_*`, `prac*`/`codes*`, `PRACTICE_DONE_BASE`, `MentorPracticeOverlay`, eski Screen2–16, `StyledSite`, `Preview`, `Zoomable`, `Pr/Se/Pp/Vl`.
  Saqlandi: `lessonId`, arena 12 savol/kalit aynan, podium, mentor, F-1012 (`maxReached`, `passed`), `onFinished`. `recordAnswer`: MC final ikkinchi marta `picked: 0` bilan yuborilmaydi (`template !== 'MCScreen'`).
- Kontrast (F-1015-304 izohi): o'lchov 86 element, 6 ekran — maket to'q sarig'i `#ff4f28` 3.28, yashil `#1f9d55` 3.49, «Namuna» havolasi 2.98 edi →
  `#d4380d` (4.8) · `#15803d` (5.0) · havola matni `ink`, tagi to'q sariq. Hammasi ≥ 4.5 ✅. Ro'yxat markerlari kartochkadan chiqardi (`.lesson-root ul { padding: 0 }` ustun) — `.lesson-root .am-band` bilan tuzatildi. s16 sarlavhasi `h-ask`.
- Sinov: gates 10/12 — `tell` (arena #2 «background-color» eng uzun) va `emoji` (`CsWordmark` 22 emoji) — **ikkalasi zaxira nusxada ham aynan shunday** (eski umumiy qismlar, arena «aynan» qarori), yangi kodda topilma yo'q ·
  `lint:jsx` 256 toza · `lint:til` toza · 9 ekran 1280 + 4 ekran 390, pageerror 0 · o'z sinovi 29/29: eski progress (`total 20`, `screen 15`, eski nishonlar) → 01/09, ekran to'la, nishon 0; `screen 25` → 09/09;
  oqim s0→s17, namuna nusxalari blok boshidagi kod, 3 nishon, s16 xato→to'g'ri izohlari, `onFinished` 1 savol; 390 px toshish yo'q · navtest2 self — 9 ekran orqaga/oldinga ochiq · mentor: a1/a3 ochiq, s16 «Avval natijani oching» (F-1013-02).
- Qolgan: `smoke-onfinished-all` (umumiy `onfinished-sweep.*` faylini qayta yozadi — so'rovda) · eski CSS qoldiqlari (`pf-*`, `chip`, `zoom-*` — ishlatilmaydi, zararsiz) · RU — qoralama (oxirida).

## 2026-10-15 15:50 · F-1015-306 · pilot qabul ✅ — KATTA, smoke, avatar, lokal manzil
- Foydalanuvchi: pilot qabul; keyingi darsga (m1-08 va boshqalar) va RU ga — pilot tasdig'isiz o'tilmaydi. Yangi CssPractice relizga KIRMAYDI (relizda arxivdagi eski nusxa), keyin alohida yuklanadi.
- KATTA: `KATTA_TOZALASH.md` oxiri qayta o'qildi → F-1015-306 qo'shildi (tell + emoji eski arena/CODE STRIKE; emoji → F-1013-E; o'lchov: lint-tell 1–4c 88 fayl · 212 error · 43 warn).
- Smoke: `onfinished-sweep.{json,md}` → `arxiv/F-1015-305-oldin/` (cmp bir xil), keyin `scripts/smoke-onfinished-all.mjs` argumentsiz: **140/140** (oldin 14.10 — 140/140).
  CssPractice uz/ru: ball-ekran 6 → 1, questions 5/5 → 1/1, to'g'ri 4/6 → 1/1, yutuq 3 ✅. Qolgan 69 dars qatorlari — o'zgarishsiz (diff).
- Avatar (390 px s0 pushti doira): yo'l to'g'ri — `go.coddycamp.uz/.../c7b7116….png` 1024×1024, yuklanishi 2.7–6.6 s; `shots.mjs` qat'iy kutadi va ba'zan rasmdan oldin suratga oladi (fon `accentSoft`). Kod xatosi emas; rasm hamma darslarga umumiy — tegilmadi.
- Lokal: `npx vite --port 5173` (fonda) → http://localhost:5173/#/lesson/m1-10 («Kodsiz, o'zim ko'raman»); ilova ichida pageerror 0.

## 2026-10-15 16:05 · F-1015-307 · m1-10 v2 g'oyasi: CSS Praktikada Demo Day sayti boshlanadi — reja (kodga tegilmadi)
- Foydalanuvchi g'oyasi: CSS Praktika portfolioni takror bezamasin — Demo Day saytining bosh sahifasi shu yerda (HTML'ni Gemini tez, urg'u CSS), Deploy (m1-11) da qolgani ~1 soatda tugab Netlify'ga chiqadi. Javob: tavsiya — ha.
- O'qildi (faqat o'qish): `GitLesson.jsx` — 18 ekran, alohida mashq repo'si (`index.html` + `about.html`), Demo Day/portfolio bilan bog'liq emas;
  `DeployLesson.jsx` — 17 ekran, s3 muammo/yechim + ≥4 sahifa · spages mazmun + 4 uslub · s4 to'liq sayt topshirig'i · s5 `mening-saytim` papkasi · simprove · Netlify; `ccDemoDay` ni o'qiydi/yozadi.
- Chegaradan tashqari tegadiganlar: `DeployLesson.jsx` (6 ekran), `App.jsx` + `src/mentor/lessons.jsx` (m1-10 menyu nomi), `HtmlPractice.jsx` 1820-qator («Keyingi dars — CSS Praktika…», pilot tasdig'idan keyin).
- Reja: `02-m1-10-v2-reja.md`; qaror sahifasi (Deploy suratlari + 5 savol): https://claude.ai/artifact/PWgzMjWw6wetKYfxNKeCst. Kutilmoqda: «GATE V2» javobi.

## 2026-10-15 17:17 · F-1015-308 · 2-M va 3-M partiyalari: zaxira + MD v3 qoralamalari (.jsx ga tegilmadi)
- Ustuvorlik (nazorat): reliz yakshanba 18.10, hamma praktikalar bir yo'la; modul partiyalari, har partiyaga bitta GATE M. Pilot tasdig'ini kutib — 2-M va 3-M MD qoralamalari.
- Zaxira (bir marta, `cmp` ✓): `arxiv/F-1015-amaliyot-oldin/` ← HtmlPractice, PracticeLesson1–4.
- MD: `03-m1-08-v4.md` (13 → 9: 3 blok, test s5 ✔ D; GATE V2 ga bog'liq) · `04-m2-08-v3.md` (Demo Day saytiga JS; Copilot shu darsda o'rnatiladi; test s7 ✔ C) ·
  `05-m2-09-v3.md` (promo sahifa, 4 qism, iteratsiya, Copilot bo'lim; test s7 ✔ B, variantlar tenglashtiriladi) · `06-m2-11-v3.md` (mini-dokon: REJA.md AI'siz → 1-qadam Gemini → Copilot; test s4 ✔ A) ·
  `07-m2-12-v3.md` (savat + jami → tekshirish → Netlify; test s8 ✔ C). Eski test kalit o'rinlari saqlanadi; Antigravity va soxta agentlar olinadi; nishonlar bloklarga.
- `lint:til` 5 fayl: 0 error, 4 warn (AI-prompt ichidagi buyruq — §222 istisnosi; muallif izohi).
- Ochiq tekshiruv (§182): Copilot o'rnatish/kirish UI-yozuvlari — qurishdan oldin VS Code'da ko'z bilan tasdiqlanadi.
- GATE M sahifalari (qoralama, hozirgi holat suratlari bilan): 2-M https://claude.ai/artifact/Hhxm16str39sY89y7XncHW · 3-M https://claude.ai/artifact/WBvPkpKDmDfkhgvB6ZKPnC.

## 2026-10-15 17:47 · F-1015-309 · GATE V2 ✓ (Q1–Q5 A) → CssPractice v2 qurildi: Demo Day bosh sahifasi
- Foydalanuvchi fidbegi (17:2x): «hozir ham o'sha portfolio» — F-1015-307 da faqat reja berilgan, kod o'zgarmagani aniq aytilmagan edi. Tan olindi; GATE V2 javobi olinib, qurildi.
- Zaxira: pilot v1 → `arxiv/F-1015-pilot-v1/CssPractice.jsx` (cmp ✓). MD: `08-m1-10-demoday-v3.md`.
- `CssPractice.jsx` (2705 qator): `PfSahifa` → `DemoSahifa` (xom · uslub · rang × 4 uslub; matn `ccDemoDay` dan, yo'q bo'lsa namuna); `IDEA_BANK` (VsCodeLesson dan aynan), `STYLES` (DeployLesson dan aynan, emojisiz);
  s0 «Saytingizga kirgan odam avval nimani ko'radi?» · s1 g'oya kartasi / bank + `mening-saytim` tayyorlanishi · a1 HTML (jonli «Masalan» — o'quvchi muammo/yechimi) · a2 uslub tanlash (`ccDemoDay.uslub`) + dizayn · a3 Ctrl+H · s16 pilotdagidek.
  Nishonlar: spacer «Kick Off!» · layout «Styled!» · color «Color Master» · graduate. `lessonTitle` — «CSS Praktika — Demo Day saytini bezaymiz» (`lessonId` o'zgarmadi). Uyga vazifa: qolgan 3 sahifani rejalash + skrinshot.
- Sinov: gates 10/12 (tell, emoji — eski arena, KATTA F-1015-306) · lint:til 0 error (1 warn — AI-prompt) · o'z sinovi 34/34 (eski progress → 01/09; bank → ccDemoDay; Masalan'da o'quvchi g'oyasi; uslub saqlanadi va maket o'zgaradi;
  namuna nusxalari; 3 nishon; s16; onFinished 1 savol; kontrast ≥ 4.5 — 105 element; 390 px toshish yo'q) · navtest2 self — ochiq, pageerror 0 · mentor: a1 ochiq, s16 «Avval natijani oching» · 9 + 3 surat.
- Chegaradan tashqari (nazorat ruxsati kutilmoqda): `DeployLesson.jsx` 6 ekran (Q1 A) · `App.jsx` + `mentor/lessons.jsx` nomi (Q5 A, matn MD 08 da) · `HtmlPractice.jsx` 1820 «Keyingi dars» qatori.

## 2026-10-15 18:05 · F-1015-310 · fidbek: «sayt xunuk, prompt aniq emas, nima qilishni to'liqroq ayting» — tashxis (kodga tegilmadi)
- Rasm: `F-1015-310-a3.png` (a3 ekrani, maketda «gcfghjkb gyh gh»).
- Tashxis: (1) maket `ccDemoDay` dagi erkin matnni to'g'ridan-to'g'ri ko'rsatadi — sinov matni PmLesson1/VsCodeLesson/DeployLesson «o'zim» maydonidan; (2) maket dizayni juda oddiy;
  (3) a2 prompti umumiy (shrift, o'lcham, bo'shliq, telefon yo'q) — natija tasodifiy; (4) a1/a2 da javobni qayerga qo'yish va keyingi qadam yozilmagan.
- Taklif va prototiplar (yangi maket 4 uslubda, a2 chap tomoni: 4 qadam + to'liq prompt + «Nusxalash»): https://claude.ai/artifact/31gUg2ns8iicdMRtc7KwBS. Kutilmoqda: F-1015-310 javobi (Q1–Q4).

## 2026-10-15 18:34 · F-1015-311 · F-1015-310 javobi (Q1–Q4 A) + «1-sahifada ham tanlaganda sayt joyi o'zgaradi» — tuzatildi
- Q1 A: `DemoSahifa` doim namuna («To'garak jadvali endi telefoningizda»), yorliq «namuna»; o'quvchi g'oyasi faqat promptga.
- Q2 A: maket — landing: kichik yozuv, katta sarlavha, ikonkali (SVG, emojisiz) 3 karta, soyalar; 4 uslub aniq farqli + «rang» holati har uslubda.
- Q3 A: a1 va a2 — to'liq prompt (`USLUB_SPEC`: shrift, ranglar, menyu, kartalar uslubga qarab) + «Promptni nusxalash» (`PromptBlok`). GATE M m1-10 Q1 A (nusxalashsiz) shu bilan o'zgardi.
- Q4 A: a1/a2 da tugmasiz 4 qadam (yuborish → faylga qo'yish → Ctrl+S → solishtirish); «Promptda ayting» bandlari olindi (prompt o'zi aytadi, §227).
- Siljish: s0 — javob izohiga joy oldindan (`.am-javob-joy`); s1 — bankdan tanlanganda ro'yxat yopilmaydi, tanlangani belgilanadi; maket matni o'zgarmaydi. O'lchov: maket `top,left,height` tanlovdan oldin/keyin bir xil (s0, s1).
- Yon topilmalar (shu yerda tuzatildi): «Promptni nusxalash» qora fonli edi → `dark` darvozasi (qora tugma taqiq) → oq fon + to'q sariq ramka; `.lesson-root p { margin: 0 }` maket sarlavhasini markazdan surardi → selektor kuchaytirildi; xom holatda menyu havolalari yopishgan edi → `gap`.
- Sinov: gates 10/12 (tell, emoji — eski arena) · lint:jsx toza · lint:til 0 error · o'z sinovi 40/40 · kontrast: 117 element + 4 uslub × 2 holat maketi ≥ 4.5 · 390 px toshish yo'q.

## 2026-10-15 18:46 · F-1015-312 · fidbek «1-sahifada loyiha bilan bosadigan joy o'zgargan — kritik xatolarni o'zing ko'r, halol tuzat» → o'z auditi
- Sabab (tan olindi): sinov faqat o'z skriptim bilan edi — qolip qoidasi (`src/qolip/QOLIP.md`) va boshqa dars (HtmlPractice s0) bilan solishtirilmagan.
- Topilgan va tuzatilgan (9): (1) s0 — QKirish: maket chapda bo'lishi kerak, men o'ngga qo'ygandim · (2) s1 — QReja: chapda «Dars oxirida» + maket bo'lishi kerak ·
  (3) a1–a3 — QBlok: «Ortda qoldingizmi» o'ngda bo'lishi kerak · (4) s0 variantlari animatsiyasi 3 s gacha 0.25 shaffoflikda turardi (o'lchandi) va siljirdi → olindi ·
  (5) maket footeri kesilardi → `max-height` olindi · (6) s1 o'ng ustun ekrandan oshardi → bank 2×2, «Tayyorlanish» g'oyadan keyin · (7) a1 «Promptni nusxalash» ekrandan pastda → prompt sarlavhasi yoniga; «Vazifa» kartasi takror (§216) → olindi ·
  (8) mentor «Chapda —» va a2 «o'ngdagi surat» — telefonda joy noto'g'ri (§210/211) → joy so'zisiz; sinf-supurish: MD 05 (m2-09) va 06 (m2-11) dagi «Chapda —» ham tuzatildi ·
  (9) kartochka «hozirgi style.css» (endi index.html) va a3 «namunada #d4380d» (o'quvchi uslubiga qarab rang) — mazmun xatolari.
- Sinov: gates 10/12 (bazaviy) · lint:jsx toza · lint:til 0 error · o'z sinovi 40/40 · 9 ekran 1280 + 3 ekran 390 ko'z bilan, HtmlPractice s0 bilan solishtirildi.
- Muhr (taklif, chegaradan tashqari): «qurilgan ekran `QOLIP.md` joylashuviga solishtiriladi» — tekshiruvchi rol-fayliga ov-bandi (`.claude/agents/role/…`) — nazorat qaroriga.

## 2026-10-15 19:03 · F-1015-313 · fidbek (4 rasm: `F-1015-313-rasm18…21.png`) — «tayyorlachi» → qurildi
- (18) maket haqiqiy rangli sayt: rangli menyu + «Kirish», gradient bosh qism, jadval kartasi, ikki tugma, ikonkali kartalar; sukut uslub — Yorqin.
- (19) «Tayyorlanish» — alohida karta «Avval tayyorlaning» (to'q sariq ramka, katta raqamlar), o'ng ustunda birinchi; telefonda eng tepada. G'oya-banki va eski g'oya kartasi olindi (`IDEA_BANK` ham).
- (20) a1: loyiha nomi eski saqlovdan olinmaydi — forma (nom · muammo · talablar), uchalasi to'lgach «Prompt tayyor — endi Gemini orqali quring» + prompt + qadamlar; `ccDemoDay.css` + `yechim/muammo` ga yoziladi.
- (21) a1/a2 — bosqichma-bosqich ochilish (`.am-ochil` animatsiyasi; reduced-motion — o'chadi); a2 da uslub tanlanmaguncha prompt yopiq.
- Yon topilma: kichik yozuv rangli fonda 4.0–4.4 kontrast → oq pill ichida; xom holatda jadval qatorlari yopishgan → tuzatildi.
- Sinov: gates 10/12 (bazaviy) · lint:jsx toza · lint:til 0 error · o'z sinovi 42/42 (forma → prompt, 2 qator to'lganda yopiq, nusxa, saqlov; a2 yopiq → ochiq) · kontrast 96 element + maket 4 uslub × 2 holat ≥ 4.5 · 1280 + 390 ko'z bilan.

## 2026-10-15 19:20 · F-1015-314 · fidbek «yemadi — rasm qo'yamizmi, lekin ochilishi qiynaladi» — tashxis (kodga tegilmadi)
- Rasm: `F-1015-314-rasm22.png`. Tashxis: bosh qismning o'ng tomoni oddiy oq quti (jadval) — haqiqiy saytdagi katta rasm/illyustratsiya o'rnini bosmaydi.
- Fakt: loyiha qoidasi (DARS_ETALON 11.10) — haqiqiy rasm LMS media kutubxonasidan (go.coddycamp.uz, `PHOTO_SET`); bu server sekin (mentor avatari 2.7–6.6 s, F-1015-306); mos (maktab/to'garak) foto kutubxonada yo'q; `src/` dagi rasmlar — taqdimot skrinshotlari.
- Taklif: A — kod ichida chizilgan SVG illyustratsiya (telefon ichida jadval + robot/shaxmat/futbol belgilari + rangli dog'lar; yuklanmaydi) · B — foydalanuvchi LMS'ga foto yuklaydi.
  Prototip va savol: https://claude.ai/artifact/8QKqG5B8Au8yHizc9Bu3ma. Kutilmoqda: F-1015-314 javobi.

## 2026-10-15 19:25 · F-1015-315 · F-1015-314 javobi: «tavsiyang maqul (A), halol, shoshilmasdan» → qurildi
- `DsIll` — kod ichida chizilgan SVG (telefon ichida «Dushanba» jadvali: Robototexnika / Shaxmat / Futbol; atrofida robot, shaxmat, futbol belgilari; rangli dog'lar); `aria-hidden`; tashqi rasm yo'q.
  Ranglari CSS o'zgaruvchilari (`--il-*`) orqali 4 uslubga va «rang» holatiga moslashadi; xom (CSS'siz) holatda yashirin. Eski oq jadval qutisi (`ds-ill`, `ds-row`) olindi.
- O'lcham: kompyuterda bosh qismning ≈46% (≤270 px), telefonda matn ostida (≤290 px).
- Tekshirildi: 7 holat surati (s0 Yorqin · a2 Minimalist / Qorong'i / Gradient · a3 Qorong'i rang · a1 xom · telefon s0) — ko'z bilan; SVG matn juftliklari kontrasti 12 juft ≥ 4.5 (4.8–16.8);
  gates 10/12 (bazaviy) · lint:jsx toza · lint:til 0 error · o'z sinovi 42/42 · kontrast 96 element ≥ 4.5.

## 2026-10-15 19:48 · F-1015-316 · fidbek (3 rasm: `F-1015-316-rasm23…25.png`) → qurildi
- (23) maydonlar minimalistik (`.am-input`: ingichka ramka, soyasiz, fokusda to'q sariq ramka + halqa); a1 birinchi maydoni avtofokus.
- (24) a1: «Saqlash» → forma yig'iladi (nom · muammo · talablar) + «Tahrirlash» (prompt jonli yangilanadi; `ccDemoDay.css.saqlangan`); o'ngda maket o'rniga Qadamlar; «Ortda qoldingizmi / Namuna kodini nusxalash» va `NAMUNA_*`, `NamunaBtn` olindi.
- (25) kartochkalar ekrani va kodi olindi (`ScreenFlashcards`, `Flashcards`, `CSS_FLASHCARDS`, `fc*`, 59 qator CSS, `FLASH_IDX`); testdan keyin yangi **a4 «Yaxshilash»** (`ScreenYaxshilash`): tekshirish ro'yxati (5) + bitta kamchilik → prompt + «Keyingi kamchilik» (hisob). Ekranlar 9/9.
- Fayl 2641 qator. `lessonId` o'zgarmadi; s16 indeksi (5) o'zgarmadi → `INLINE_KEYS`, `RECAPS`, `PODIUM_LABELS` o'z joyida.
- Sinov: gates 10/12 (bazaviy) · lint:jsx toza · lint:til 0 error · o'z sinovi 49/49 (Saqlash → yig'ilish → Tahrirlash → jonli prompt; a4 prompt, «Keyingi kamchilik» tozalaydi va sanaydi; «Namuna» yo'q; a4 → podium 08/09) ·
  kontrast 85 element ≥ 4.5 · navtest2 — 9 ekran ochiq · mentor: a1, a4 ochiq; s16 «Avval natijani oching» · 1280 + 390 ko'z bilan.
- Sinov skriptidagi 2 xato (selektor `.am-nusxa` — «Tahrirlash» ham shu klassda; tahrirdan keyingi kutilgan nom) — skriptda tuzatildi, darsda xato yo'q edi.

## 2026-10-16 ~11:30 · F-1015-317 · pilot v2 TASDIQLANDI + yangi ish tartibi
- Foydalanuvchi localhost'da ko'rdi: «manga yoqdi». Oldin/keyin tahlili chatda berildi (20 → 9 ekran, 6 → 1 ballik savol, bosish o'rniga VS Code + Gemini).
- Yangi tartib (foydalanuvchi): qolgan 17 praktika AVTOMAT EMAS — har birining har sahifasi qisqa aytiladi, foydalanuvchi o'qib fikr beradi, keyin o'zgartiriladi;
  praktika o'zidan oldingi haqiqiy darsdan kelib chiqadi. Partiya-MD (03–07-*.md) va partiya GATE M rejasi bekor — faqat manba. Memory: `praktika-sahifama-sahifa-kelishuv`.

## 2026-10-16 11:59 · F-1015-318 · CssPractice v2 RU
- Holat: v2 matnlarining hammasida `ru:` allaqachon bor edi. Tekshiruv:
  ru-walk (9 ekran × uz/ru) 18/18 ok · interaktiv RU yurish (17 holat: a1 Saqlash, nusxalangan prompt, a2 uslub, s16 xato/to'g'ri, a4 prompt + «Keyingi», podium, yakun, uyga vazifa) — pageerror 0, `[object Object]` 0, onFinished ok.
- Lotin qoldiqlari: barchasi kod/fayl nomi (`mening-saytim` 11 darsda umumiy — qoldirildi; class `kartalar/karta` — kod). Bitta tuzatish: uyga vazifa RU «например, sahifalar.txt» → «например, в файле pages.txt».
- gates 10/12 (bazaviy tell/emoji, KATTA F-1015-306) · til ✓.
- Topildi, TUZATILMADI (tarjimadan oldin ham bor, eski nusxada ham): yakun ekrani uyga vazifa tugmasida suzuvchi so'zlar (`HW_TOKENS`) CSS'siz — bir qatorga yopishib chiqadi
  («amaliyotloyihamashqnatija»); `.hw-sky/.hw-tok` uslubi faylda yo'q (PracticeLesson2 da bor). 390 px yakun ekranida 4 px gorizontal toshish (`.hw-big-shine`, uz/ru bir xil). Foydalanuvchi qarori kutilmoqda.

## 2026-10-16 12:10 · F-1015-319 · «ha tuzat» → 2 nuqson tuzatildi + chala ishlar yopildi
- Yakun ekrani: uyga vazifa tugmasidagi suzuvchi so'zlarga `.hw-sky`/`.hw-tok` uslubi + `hw-float` qo'shildi (PracticeLesson2 dagidek; reduced-motion'da to'xtaydi).
- 390 px: toshish sababi yaltirash emas, tugma atrofidagi nur halqasi (`.hw-big-wrap::before`, inset −16px) edi → 600 px dan torda `inset: -12px 0`. Endi uz/ru toshish 0.
- Sinov: o'z sinovi 49/49 · gates 10/12 (bazaviy tell/emoji) · lint:jsx toza · RU/UZ interaktiv yurish pageerror 0, toshish 0 · surat ko'z bilan (so'zlar suzadi).
- LMS natija sinovi (smoke-onfinished-all, faqat shu fayl, `--lang both --seal`, natija scratchpad'ga — umumiy `feedback/lms-sinov-2026-09-16/` ga tegilmadi): 2/2 o'tdi.
- Yakuniy MD (konveyer 8-qadam): `YAKUNIY/01-CssPractice.md` — 9 ekran = SCREEN_META; tasodifiy 40 satr: 30 bor, 10 mentor/jonli yozuvi (shablon bo'yicha kirmaydi).
- Sinf-supurish (hw-tok CSS yo'q): qolgan 17 praktika har biri o'z navbatida ko'riladi (yangi tartib) — alohida supurish qilinmadi.

## 2026-10-16 15:08 · F-1015-320 · m1-08 HtmlPractice 13 → 9 ekran (sahifama-sahifa kelishildi, QURILDI)
- Manba: oldingi dars m1-15 VS Code (o'rnatish, papka, `!`+Tab, Go Live, `<link>`, Gemini'ga aniq prompt, oxirida Demo Day loyihasi tanlanadi) + HTML/CSS darslari.
- Chatda 9 sahifa taklif qilindi; foydalanuvchi 4 savolga javob berdi: 1 — portfolio QOLADI · 2 — pilot elementlari (forma → Saqlash/Tahrirlash, o'ngda Qadamlar) qo'llansin ·
  3 — kartochkalar o'rniga «Yaxshilash» · 4 — dizaynda rang maydoni (4 uslub CSS Praktikada).
- Qurildi (`seans-vositalar/qurish/f320.py` + `f320b.py`, har almashtirish count==1): s0 (o'zgarmadi) · s1 QReja + «Avval tayyorlaning» (mentor gapidan keyin, telefonda ham birinchi) ·
  a1 forma (ism · yo'nalish · 2 gap) → Saqlash → prompt · a2 forma (3 loyiha · pochta, xavfsizlik izohi) → prompt (a1 dagi ism footer'ga) · a3 rang → prompt (faqat `style.css`) ·
  s5 yagona ballik (kalit 3 saqlandi, scope final, oldidan «Avval sahifangizni ustozga ko'rsating») · a4 yaxshilash · podium · s6 yakun.
  Olindi: sahifa bo'laklari ekrani, 1-test, havola tushuntirish ekrani, «Bajardim» qadamlari, namuna kodlari, qadam rasmlari, mentorga praktika-signali (500+), kartochkalar.
  Nishonlar blokka: a1 Built It! · a2 Tag It! · a3 Level Up!. O'quvchi yozgani `ccPortfolio` (localStorage) — LMS natijasiga ketmaydi (sinovda tasdiqlandi).
  Yakun: takrorlash 4 band; «kodda yozilgan tartibda» qatori olindi (u olingan ekranga tayanardi); «Keyingi dars — CSS Praktika: Demo Day saytingizni boshlaysiz».
- Qurishda topildi va tuzatildi: a1→a2 o'tishda oq ekran (bir komponent — React holatni olib o'tdi) → `<Current key={screen}>` · maketdagi «Pochta» 3.28 → matn to'q, chizig'i urg'u rangda ·
  lint-qolip q14/q15 (tugmalar → QTugma, s1 → QReja).
- Sinov: gates **12/12** · `tekshir-m108.mjs` 47/48 (bitta ❌ — qolipning asosiy tugmasi `.q-btn` oq/to'q sariq 3.28, quyida nazoratga) · navtest2 9 ekran ochiq, pageerror 0 ·
  mentor: a1/a4 ochiq, s5 «Avval natijani oching» · RU yurish 9 ekran: xato 0, `[object Object]` 0, o'zbekcha qoldiq 0, promptlar ruscha · 390 px toshish 0 · suratlar ko'z bilan.
- Ochiq: `smoke-onfinished-all` (LMS natija sinovi) — ruxsat so'raladi · yakuniy MD (`YAKUNIY/02-HtmlPractice.md`) — foydalanuvchi ko'rigidan keyin.
- ~~Sinf-supurish (hw-tok): qolipda CSS yo'q, 79 dars~~ — **XATO XULOSA, F-1015-325 da tuzatildi:** `.hw-sky/.hw-tok/hw-float` qolipda BOR (`qolipCss.js` 250–252); grep natijasi `head` bilan kesilgan edi. HtmlPractice'dagi takror nusxa olindi.

## 2026-10-16 ~15:45 · F-1015-321…323 · foydalanuvchi ko'rigi (localhost, 3 rasm: `F-1015-321-zoom.png`, `-322-natija.png`, `-323-tor-test.png`)
- **321 ⛶ ishlamaydi:** HtmlPractice'da `.zoom-on` CSS yo'q edi (14.10 versiyada ham) — ⛶ faqat fonni qoraytirardi. Qo'shildi (CssPractice standarti) + kattalashganda `.pf-body` balandlik cheklovisiz.
  O'lchov 1920×960: s0/s1/a3 oyna 880 px, oyna va sayt skroli yo'q, footer ko'rinadi.
  Sinf-supurish: Zoomable bor, `.zoom-on` yo'q — **13 fayl**: HtmlPractice (tuzatildi) · `src/skelet/NamunaDars.jsx` (skelet — yangi darslarga o'tadi; chegaradan tashqari → nazoratga) · 11 tasi `src/2-moodull eski/` (ishlatilmaydi).
- **322 testda «Natijani ochish» yo'q:** dars xatosi emas. Brauzer mentor rejimida (Kod 327 008); MentorTestStats o'quvchilar ro'yxatini `dars-api.coddycamp.uz` dan oladi, server CORS'ni faqat
  `https://lms.coddycamp.uz` ga beradi (OPTIONS: localhost → 404, lms → 204) → panel chiqmaydi → mentor qulflanadi. Lokal ko'rish — «Kodsiz, o'zim ko'raman».
  Taklif (KATTA, hamma darsdagi nusxa): server javob bermasa ham «Natijani ochish» chiqsin → nazoratga.
- **323 test ekrani tor:** foydalanuvchi — «to'liq oyna bo'ylab bo'lsin, mentor va sarlavha yig'ilib qolgan». QuestionScreen'dan `narrow` olindi (faqat shu dars; podium tor qoldi). 1920 da variant eni 980 px.
- Sinov: gates 12/12 · tekshir-m108 47/48 (o'sha bitta ❌ — qolip `.q-btn` 3.28, nazoratda).

## 2026-10-16 ~15:50 · F-1015-324 · test ekrani — boshqa testlar bilan bir xil (rasm `F-1015-324-test-standart.png`)
- Foydalanuvchi (323 dan keyin): «bu page hardoimgi testlarimizday bo'lsin». 323 bekor: `narrow` qaytdi; savol ostidagi mentor qatori («Avval sahifangizni ustozga ko'rsating») olindi —
  «yig'ilib qolgan» ko'rinish shu qatordan edi. Savol bloki eski s5 bilan harfma-harf bir xil (diff toza). gates 12/12 · 1920 da variant 560 px, bosiladi.
- Saboq: test ekranining ko'rinishi platforma standarti — darsga xos qo'shimcha (mentor qatori, keng ekran) kiritilmaydi.

## 2026-10-16 16:00 · F-1015-325 · «Uyga vazifa» burchagi — CODE STRIKE kabi (rasm `F-1015-325-uyga-radius.png`) · QAROR A, NAZORATGA
- Foydalanuvchi: «CODE STRIKE yumshoq, uyga vazifa qattiq — bir xil, yumshoq qilaylik». Bu 192-qonun 2-bandi (22px, 04.10 foydalanuvchining o'zi) — faqat shu darsda o'zgartirish q11 ni yiqitadi.
  Variantlar aytildi → **A (hamma darsda, shoshilmasdan, aniqlikda)**.
- O'lchov: qolip 1 (79 QYakun darsi) + o'z CSS'i 97 fayl (har birida aynan bittadan 22px/34px — tekshirildi; 38 tasida commit'siz o'zgarish) + 4 PM ixcham variant (15px) + lint q11 + qonun.
- Prototip (fayl o'zgarmadi, `sinov/hw-radius-proto.mjs`, suratlar `suratlar/f325/`): 3 dars × 1280/390 — matn chetga tegmaydi, xato 0.
- Vazifa-hujjat: **`F-1015-325-NAZORAT-uyga-vazifa-radius.md`** (aniq regexlar, 209-qonun loyihasi, tekshiruv rejasi, 97 fayl ro'yxati). Bajarish — nazorat seansi.
- Tuzatish (o'z xatoim): 320 dagi «qolipda hw-tok CSS yo'q, 79 dars» — **noto'g'ri**; qolipda bor (250–252), grep `head` bilan kesilgan edi. Jurnal va nazorat ro'yxati tuzatildi,
  HtmlPractice'dagi takror 4 qator olindi (600 px nur halqasi tuzatishi qoldi — u qolipda yo'q). gates 12/12 · tekshir-m108 47/48 (o'sha .q-btn).
- Topildi (o'z doiramda, tuzatilmadi): CssPractice «Uyga vazifa» tugmasi to'q sariq gradient — platforma standarti binafsha (qolgan darslar). Foydalanuvchi qarori kutiladi.

## 2026-10-16 ~16:10 · F-1015-326 · foydalanuvchi: 1 — ixcham variant ham kapsula «ha» · 2 — CssPractice «Uyga vazifa» binafsha «ha»
- 1: vazifa-hujjatga yozildi (`F-1015-325-NAZORAT-…md` 3-band).
- 2: `CssPractice.jsx` — `.hw-big-wrap::before`, `.hw-big`, `.hw-big-t`, `.hw-big-shine`, `@keyframes hw-fire` qolipdagi qatorlar bilan **aynan** almashtirildi (har biri solishtirildi ✓);
  `.hw-big.charging` + `@keyframes hw-charge` qo'shildi (Screen17 klassni qo'yardi, uslubi yo'q edi); reduced-motion qatori qolipdagidek. To'q sariq eski versiyada ham bor edi (arxiv). Radius 22px — nazorat sweep'ida.
- Sinov: gates 10/12 (bazaviy tell/emoji — KATTA F-1015-306) · `tekshir.mjs` 49/49 · surat: binafsha, 560×127, xato 0.

## 2026-10-16 ~16:25 · F-1015-327 · «ha yurgiz» → m1-08 LMS sinovi + yakuniy MD → m1-08 YOPILDI
- smoke-onfinished-all: `--lang both --seal --out <scratchpad>` faqat HtmlPractice — **2/2** (uz, ru: scored 1, 1/1, yutuq 2 — skript ataylab 2 ta urug'laydi, pilot ham 2).
  Umumiy `feedback/lms-sinov-2026-09-16/onfinished-sweep.json` o'zgarmadi (md5 oldin/keyin bir xil).
- Yakuniy MD (konveyer 8): `YAKUNIY/02-HtmlPractice.md` — 9 ekran = SCREEN_META. Tasodifiy 40 ibora: 31 so'zma-so'z; 9 tasi faqat yozilish farqi
  (raqam/harf prefiksi, backtick, `\'`, qolip matni «Endi siz bilasiz»/«Amaliy topshiriqni bajarish», tavsif) — noto'g'ri ko'chirilgan matn 0.
- **m1-08 HtmlPractice YOPILDI** (320 qurish · 321 ⛶ · 323→324 test standart · 327 smoke + MD). Keyingi: 2-M PracticeLesson1.

## 2026-10-16 17:08 · F-1015-328 · m1-11 DeployLesson 17 → 12 ekran (foydalanuvchi bevosita topshirdi; rasm — Reja ekrani)
- Foydalanuvchi: «Demo Day saytingizni yasaysiz emas — davom ettiramiz, CSS'da uje qilyapti; boshida praktika, eskisini davom ettiradi, yanada animatsiyali;
  page juda uzun — 12 ta; boshida praktika, keyin Netlify bitta tushuntiriladi, yuklanadi, tamom». Sahifama-sahifa taklif → javoblar: 1 animatsiya bittasi tanlanadi ·
  2 testlar 3 ta, lekin Netlify qismida · 3 kartochkalar qoladi · 4 «Saytni tugating» uyga vazifaga.
- Nazoratga yozildi (DAVOM «Nazorat seansiga»): fayl 3-seansda. Zaxira `arxiv/F-1015-deploy-oldin/DeployLesson.jsx` (git toza edi).
- Qurildi (`qurish/f328.py`, count==1): s0 (javob «davom ettirasiz») · reja («Saytingizni davom ettirasiz — qolgan sahifalar va animatsiya» + «Avval tayyorlaning», mentorga ~40+30 daq) ·
  **a1 sahifalar** (loyiha nomi CSS Praktikadan `ccDemoDay.css.nom` — tayyor; 3 sahifa: nomi + mazmuni → Saqlash/Tahrirlash → prompt; o'ngda Qadamlar + o'quvchi uslubidagi maket) ·
  **a2 animatsiya** (4 tur: silliq paydo bo'lish · jonli kartalar · harakatdagi fon · yozuv terilishi — tanlanganda maketda jonli qayta o'ynaydi; prompt faqat style.css + reduced-motion) ·
  Netlify tushuntirish · test «Netlify nima qiladi?» · test «bosh sahifa fayli» · **yuklash** (kirish GitHub bilan + papkani sudrash + havola — oldingi 2 ekran bitta, 5 qadam) ·
  yakuniy savol · podium · kartochkalar (olingan ekranlarga tayangan 2 tasi almashdi: animatsiya fayli, href = fayl nomi) · yakun (uyga vazifa 4 band + havola).
  Olindi: g'oya, sahifa mazmuni, uslub+AI topshirig'i, Gemini ekrani, «Yaxshilash», alohida kirish ekrani, «Saytni tugating», DoScreen. Maket/PromptBlok/Qadamlar/am-* CSS — CssPractice dan aynan.
  Kalitlar o'zgarmadi: lessonId, INLINE_KEYS (s2 0 · s6 2 · s12 3), nishonlar, QUIZ_BANK, HOMEWORK; cc-deploy-project/cc-site-url/ccPitch3.link yozilishi saqlandi.
- Sinov: gates 10/12 (tell 3 / emoji 3 error — eski versiyada aynan shu, KATTA F-1015-306; emoji warn 19 → 13) · **`tekshir-m111.mjs` 43/43** (eski progress, CSS ipi, ipsiz holat,
  a1 forma/prompt/tahrir, 4 animatsiya maketda jonli, Netlify qadamlari, havola saqlanishi, onFinished 3 savol, kontrast 81 ≥ 4.5, 390 px 12 ekran) · navtest2 12 ekran · mentor (a1/a2/drop ochiq, test yopiq) ·
  RU yurish 12 ekran toza, a1/a2 promptlari ruscha.
- Nazoratga: App.jsx:238 m1-11 sub «hosting, maktab poddomeni» — darsda poddomen yo'q. Taklif: «saytni davom ettirish, animatsiya, Netlify».
- Ochiq: smoke-onfinished-all (ruxsat bilan) · yakuniy MD `YAKUNIY/03-DeployLesson.md` — foydalanuvchi ko'rigidan keyin.

## 2026-10-16 17:08–17:53 oralig'ida (aniq vaqt yozilmagan) · F-1015-329 · DeployLesson ko'rigi (3 rasm: `F-1015-329-a1-rasm.png`, `-test.png`, `-kartochka.png`) → 12 → 11 ekran
- Foydalanuvchi: a1 dagi sayt rasmi ortiqcha · yana bitta sahifa — scroll bo'lganda fon animatsiyasi kabi «daxshat» narsa (CSS Praktikadagi oxirgi darabotka kabi) ·
  «bosh sahifa fayli» testi kerak emas (ikki test yonma-yon) · kartochkalar kerak emas. Joylashuv savoliga — tavsiya A (a2 dan keyin).
- Qurildi (`qurish/f328b.py`): a1 o'ngda faqat Qadamlar · s6 testi + File Finder! nishoni + uning recap'i olindi (INLINE_KEYS s2 0 · s12 3) · kartochkalar ekrani, Flashcards, FLASH_IDX olindi ·
  **YANGI a3 «Scroll animatsiyasi»**: 4 effekt (scroll'da paydo bo'lish · rang almashuvchi fon · o'qish chizig'i · parallaks), namuna-maket o'zi sekin aylanadi
  (effekt maketda JS bilan — har brauzerda; reduced-motion'da avto-aylanish yo'q), prompt — sof CSS `animation-timeline`, JavaScript'siz; izoh «Chrome va Edge'da ishlaydi».
  Tartib: kirish · reja · sahifalar · animatsiya · scroll · Netlify tushuntirish · test · yuklash · yakuniy · podium · yakun. Recap/Q_LABELS indekslari yangilandi (s2 → 6).
- Sinov: gates 10/12 (bazaviy tell 3 / emoji 3; til warn 2 — AI'ga yoziladigan «…tuzat» iborasi, istisno) · **tekshir-m111 49/49** (4 scroll effektining har biri maketda o'lchandi) ·
  navtest2 11 ekran · mentor (scroll ochiq, test yopiq) · RU 11 ekran toza.

## 2026-10-16 17:08–17:53 oralig'ida (aniq vaqt yozilmagan) · F-1015-330 · DeployLesson: a1 mentor gapi · a2/a3 qadamlari bitta tugmada (rasm `F-1015-330-a1-mentor.png`, `-qadam-tugma.png`)
- Foydalanuvchi: a1 da «qolgan sahifani qo'shing» deyiladi, o'quvchi «qaysi sahifa?» deydi — mentor gapi kerak · qadamlar bitta tugmada, bosilsa ochilsin, o'ngdagi sayt ostida tursin.
- Qilindi: a1 — Mentor: «Bosh sahifangiz tayyor. Endi saytingizda yana qaysi sahifalar bo'lishini o'ylang: har biriga nom va bitta gap yozing — unda nima turadi. Masalan, to'garak sayti uchun: Jadval, Ustozlar, Aloqa.» ·
  a2, a3 — `QadamTugma` («Qadamlar · 3 ▾», yopiq boshlanadi) o'ngdagi namuna ostida, prompt tayyor bo'lgach chiqadi. a1 o'ng ustuni (faqat Qadamlar) o'zgarmadi.
- Sinov: gates 10/12 (baza) · tekshir-m111 **52/52** · RU 11 ekran toza.

## 2026-10-16 17:08–17:53 oralig'ida (aniq vaqt yozilmagan) · F-1015-331 · «yaxshi, davom etsak bo'ladi» → Deploy smoke + yakuniy MD → m1-11 YOPILDI
- smoke-onfinished-all `--lang both --seal --out <scratchpad>` faqat DeployLesson — **2/2** (uz, ru: scored 2, 1/2 — skript juft/toq javob beradi, yutuq 3). Umumiy sweep-fayl md5 o'zgarmadi.
- Yakuniy MD: `YAKUNIY/03-DeployLesson.md` (11 ekran = SCREEN_META). Tasodifiy 40 ibora: 36 so'zma-so'z, 4 tasi yozilish farqi (span/b bo'lishi, raqam prefiksi, tavsif) — noto'g'ri ko'chirilgan 0.
- Topildi (mavzu tekshiruvi, tuzatilmadi — foydalanuvchi qarori): arena **11-savol** («telefonda ham chiroyli … AI topshirig'iga nima yozasiz?») olingan AI-topshiriq ekranining 5-shartiga tayanadi.
  10-savol a1 promptiga mos. Almashtirish taklifi: to'g'ri javob o'rni 3 qolsin.
- **m1-11 DeployLesson YOPILDI** (328…331). Keyingi: 2-M PracticeLesson1.

## 2026-10-16 17:53 · F-1015-332 · m2-08 PracticeLesson1 19 → 9 ekran (sahifama-sahifa kelishildi, QURILDI)
- Topilma: fayl bugun 17:22–17:33 da **boshqa seansda** tahrirlangan (mentor savoli, `F-1016-01-MENTOR-m2-08-Screen15.md` — Screen15 «Oxirgi sinov» tuzatishi). Seans tugagan;
  zaxira — shu tuzatish BILAN: `arxiv/F-1015-practice1-oldin/PracticeLesson1.jsx`. Screen15 bloki zaxira bilan **diff toza** (o'zgarmagan).
- Kelishuv: 1 Copilot (Antigravity 18+ — FAQ 13.10; «yoshni katta qilib belgilang» darsga yozilmaydi) · 2 yagona ballik — Screen15 · 3 a4 «yana bitta vosita» (tavsiyam) · 4 kartochkalar yo'q.
- Qurildi (`qurish/f332.py`): s0 (o'zgarmadi) · s1 reja («Bugun saytingizga JavaScript qo'shasiz», «Avval tayyorlaning» — Copilot o'rnatish bilan, namuna-sayt, 3 blok) ·
  **a1 tungi rejim** (Gemini prompt → script.js, .tungi; namunada tugma ishlaydi; qadamlar tugmada) · **a2 like** (Copilot: index.html qatori + izoh nusxasi, 3 qadam, «Taklif chiqmadimi?») ·
  **a3 10 like tabrik** (AI'siz: qolip `if (son === …)`, «Qiynalyapsizmi?» ichida javob) · **s15** (F-1016-01, aynan) · **a4 vosita** (menyu · jonli salom · forma — namunada sinab ko'riladi, prompt) · podium · yakun.
  Olindi: tushuncha/simulyatsiya ekranlari (s2–s14), 3 MC test + recap, kartochkalar, kompilyator mashqlari (PRACTICE_AFTER bo'sh; mexanizm ildizda qoldi), yakundagi 2-«Uyga vazifa» (kompilyator) tugmasi, Antigravity uyga vazifasi.
  Nishonlar blokka: a1 Code It! · a2 Nice Logic! · a3 It's Alive! (+ Level Up! yakunda). INLINE_KEYS { s15: 0 }. lessonId o'zgarmagan.
- Sinov: gates 10/12 (tell 2 / emoji 2 — eski versiyada aynan, F-1016-01 ham qayd etgan) · **`tekshir-m208.mjs` 36/36** · navtest2 9 ekran · mentor · RU 9 ekran toza
  (6-ekran `sahifa.rang` — Screen15 kod oynasi, o'zgartirilmadi).
- Ochiq: foydalanuvchi ko'rigi (http://localhost:5173/#/lesson/m2-08) · smoke · yakuniy MD · §182 Copilot UI yozuvlari — VS Code'da ko'z bilan (foydalanuvchi rasmi).

## 2026-10-16 18:03 · F-1015-333 · m2-08 ko'rigi (4 rasm `F-1015-333-rasm13…16.png`): reja · oraliq · Screen15 tekshiruvi
- **Screen15 (mentor fidbeki F-1016-01) — TUZALGAN:** `sinov/s15-m208.mjs` 9 juftlik (3 hodisa × 3 reaksiya): tugma hech birida qulflanmaydi; bosish+rang → rang o'zgaradi, «Mukammal!», Davom ochiq;
  hover+rang → sichqoncha kelganda rang o'zgaradi, «Ishladi, lekin…»; o'chir → «Sahifa o'chdi»; aylantirilganda → «hech narsa bo'lmadi»; kod oynasi onclick/onmouseover/onscroll — **9/9**.
  Rasm 16 (mentor yuborgan) — tuzatishdan OLDINGI holat (qulf, noto'g'ri «Mukammal!», `tugma.scroll`).
- **Oraliq:** mentorsiz ekranlarda sarlavha bloklarga yopishib turardi → `.screen > .head + .split` ga yuqoridan 6–10px; o'lchov 1920 da 28px (a1, a4). gates 10/12 (baza).
- **Reja ekrani («Avval tayyorlaning» ochiladigan bo'lsinmi):** variantlar taklif qilindi → F-1015-334 (A).

## 2026-10-16 18:09 · F-1015-334 · «A variant qil, Netlify'ga ham oraliq qo'sh»
- m2-08 reja: «Avval tayyorlaning · 3 qadam ▾» — to'q sariq ramkali ochiladigan tugma (`TayyorTugma`), ochilmaguncha «nafas oladi» (box-shadow pulsi), bir marta bosilgach to'xtaydi; reduced-motion'da yo'q.
  lint:jsx tutdi: `fade-up` + `am-tt-nafas` bir elementda — kirish animatsiyasi bekor bo'lib karta ko'rinmas qolishi mumkin edi → kirish o'rovchi `<div className="fade-up">` ga ko'chirildi.
- m1-11 Deploy: `.screen > .head + .split` oralig'i (6–10px) — m2-08 dagidek.
- Sinov: gates m2-08 10/12 · m1-11 10/12 (baza) · tekshir-m208 **37/37** · tekshir-m111 **52/52**.

## 2026-10-16 18:25 · F-1015-335 · «narmalne yoqdi» → m2-08 smoke + yakuniy MD → m2-08 YOPILDI
- smoke-onfinished-all `--lang both --seal --out <scratchpad>` faqat PracticeLesson1 — **2/2** (scored 1, 1/1, yutuq 3). Umumiy sweep md5 o'zgarmadi.
- Qoldiq tuzatildi: yakun lug'atida «Antigravity — AI agent…» qolgan edi (dars endi ishlatmaydi, 18+) → «Copilot — VS Code ichidagi AI: siz yozgan izohdan kod taklif qiladi». Faylda «Antigravity» 0. gates 10/12 (baza).
- Arena 12 savol — hammasi hozirgi mavzuga mos (rejim, like, menyu, forma, salom) — almashtirish kerak emas.
- Yakuniy MD: `YAKUNIY/04-PracticeLesson1.md` (9 ekran). Tasodifiy 40 ibora: 32 so'zma-so'z, 8 tasi yozilish farqi (backtick, raqam prefiksi, tavsif) — noto'g'ri ko'chirilgan 0.
- **m2-08 PracticeLesson1 YOPILDI** (332…335). Keyingi: m2-09 PracticeLesson2.

## 2026-10-16 18:41 · F-1015-336 · m2-09 PracticeLesson2 19 → 8 ekran (sahifama-sahifa kelishildi, QURILDI)
- Holat: fayl 13.10 dan beri tegilmagan (faqat F-1012/13 kichik tuzatish) — parallel tahrir yo'q. Zaxira: `arxiv/F-1015-practice2-oldin/PracticeLesson2.jsx`.
- Kelishuv: mavzu — o'quvchi o'zi tanlaydi (A, 3 misol) · «AI xatosini topish» qo'shilmaydi (8 ekran) · «ingredient» → «qism» (faqat shu darsda bor edi).
- Qurildi (`qurish/f336.py` + 2 qo'l tuzatish): s0 qoladi («agentga» → «AI'ga», noto'g'ri javobga «Aslida», maketda «stil» → «uslub») ·
  s1 reja («Avval tayyorlaning ▾» m2-08 dagidek — promo papka, Gemini, Copilot belgisi; «Yaxshi prompt — 4 qism»; namuna; 3 blok) ·
  **a1 4 qism** (forma: mavzu + 3 misol chip · uslub · rang · tugma yozuvi · 3 karta → Saqlash/Tahrirlash → prompt; o'ngda `PromoMaket` yozuvdan jonli, yetishmagan qism «?») ·
  **a2 iteratsiya** (pilot «Yaxshilash» shakli, «Yaxshilandi: N») · **a3 Copilot** (izoh nusxasi, 3 qadam, maketda «Qoidalar») · s7 yagona ballik (kalit B; variantlar 46–51 belgi, tell yo'q) · podium · yakun.
  Olindi: s2–s6, s8–s15 (soxta agent, PromoBuilder, 3 test, Antigravity), kartochkalar (kod bilan), PRACTICE_AFTER. Arena: 3 savolda «ingredient/stil» → «qism/uslub», fon so'zlari, to'g'ri o'rinlar o'zgarmadi.
  Nishonlar: a1 Prompt Pro · a2 Iterator · a3 Ship It! · s7 Best Brief. INLINE_KEYS { s7: 1 }. lessonId o'zgarmagan.
- Qurishda tutildi: 4-arena savolida variantni qisqartirib to'g'ri javobni eng uzun qilib qo'ygan edim (tell 15 → 16) → variant uzaytirildi (15 — baza).
- Sinov: gates 10/12 (tell 15 / emoji 2 — baza) · **tekshir-m209 33/33** · navtest2 · mentor · RU 8 ekran toza (namuna ikki tilli qilindi).

## 2026-10-16 19:16 · F-1015-337 · m2-09 ko'rigi (rasm `F-1015-337-reja.png`, `-promo.png`) → 9 ekran
- Foydalanuvchi: «Avval tayyorlaning» default yopiq tursin (shunday edi) · «4 qism» va «bugungi bloklar» bitta kartada · «promo» so'zini o'quvchi tushunmaydi — bir marta qisqa izoh ·
  testdan keyin yana bitta qiziq sahifa — AI bilan «daxshat» animatsiya (9 sahifa).
- Qilindi (`qurish/f337.py`): reja mentori — «Promo sahifa — biror tadbir yoki o'yinni tanishtirib, odamlarni chaqiradigan bitta sahifa…» · o'ngda bitta karta (4 qism + chiziq + 4 blok) ·
  **YANGI a4 «Wow effekt»** (s7 dan keyin): taymer (kun·soat·daqiqa·soniya, har soniya) · konfetti (o'zi bir marta + tugma bosilsa) · uchar zarrachalar · 3D kartalar (sichqoncha bilan egiladi, o'zi tebranib turadi);
  maketda o'quvchining o'z sahifasida jonli; prompt — script.js + style.css, reduced-motion. Yakun takrorlashiga 5-band.
- Sinov: gates 10/12 (baza) · **tekshir-m209 39/39** (har effekt o'lchandi: taymer yuradi, konfetti 26 bo'lak, 16 zarra, kartada rotateY) · navtest2 · RU 9 ekran toza.

## 2026-10-16 19:27 · F-1015-338 · m2-09 reja: sarlavha + karta balandligi (rasm `F-1015-338-reja.png`)
- Sarlavha: «Bugun AI'ga aniq prompt yozishni o'rganasiz.» (ru: «…точный промпт»).
- O'ngdagi «4 qism + bloklar» kartasi chapdagi namuna-sayt bilan bir balandlikdan boshlanadi: ustiga ko'rinmas yorliq-joy (`am-yorliq-joy`, ≤760px da yo'q). O'lchov 1920: chap 373 = o'ng 373; 390 da toshish 0.
- gates 10/12 (baza). Foydalanuvchi: «qolgani narmalne».

## 2026-10-16 19:32 · F-1015-339 · «xa, davom etamiz» → m2-09 smoke + yakuniy MD → m2-09 YOPILDI
- smoke-onfinished-all `--lang both --seal --out <scratchpad>` faqat PracticeLesson2 — **2/2** (scored 1, 1/1, yutuq 2). Umumiy sweep md5 o'zgarmadi.
- Viktorina 8-savol: «(zamonaviy/minimal)» → «(zamonaviy/sodda)» — darsdagi uslub nomlari bilan bir xil (tell 15 — baza).
- Yakuniy MD: `YAKUNIY/05-PracticeLesson2.md` (9 ekran). 40 ibora: 34 so'zma-so'z, 6 qisqartma/backtick/shablon — noto'g'ri 0.
- **m2-09 PracticeLesson2 YOPILDI** (336…339). Keyingi: m2-11 PracticeLesson3.

## 2026-10-16 19:52 · F-1015-340 · m2-11 PracticeLesson3 19 → 8 ekran (sahifama-sahifa kelishildi, QURILDI, ko'rik kutilmoqda)
- Holat: fayl 13.10 dan beri tegilmagan (faqat F-1012/13 kichik tuzatish) — parallel tahrir yo'q. Zaxira: `arxiv/F-1015-practice3-oldin/PracticeLesson3.jsx` (md5 37c823c6…).
- Kelishuv (foydalanuvchi: «tavsiyalaring maqul … shoshilmasdan»): reja `REJA.md` da (A) · nishonlar a1 Planner · a2 MVP · a3 Level Up · test — Architect (birinchi urinish) ·
  arena Q7/Q11/Q12 almashtiriladi (to'g'ri o'rin o'zgarmaydi) · uyga vazifa — «keyin» qadamlarni tartiblash + savat uchun prompt.
- Qurildi (`qurish/f340.py` + 2 tuzatish): s0 qoladi («Agentga yuborish» → «AI'ga yuborish», «Agent quryapti» → «AI quryapti») ·
  s1 reja («Do'konni qaysi qadamdan boshlaysiz?»; «Avval tayyorlaning ▾» — mini-dokon + REJA.md, Gemini, Copilot; chapda namuna do'kon 6 mahsulot; o'ngda bitta karta: «Avval bo'laklang, keyin AI'ni oching.» + 3 blok) ·
  **a1 reja (AI'siz)** — 6 qator: qadam + Shart/Keyin + ↑ (tartib); o'ngda REJA.md maketi jonli («?», «belgi qo'yilmagan»); Saqlash → «REJA.md ni nusxalash» (matn faqat maketda — takrorlanmaydi) ·
  **a2 1-qadam (Gemini)** — do'kon nomi + 4 mahsulot (nom, narx) → prompt «… faqat shu: savat va tugmalar qo'shma»; o'ngda do'kon maketi jonli, «Savat hali yo'q — u rejangizdagi keyingi qadam.» ·
  **a3 Copilot** — izoh nusxasi (Sharbat, 6 000 so'm), 4 qadam (oxirgisi: REJA.md da ✓), «Taklif chiqmadimi?»; maketda o'quvchi do'koni + 2 «Copilot» karta ·
  s4 yagona ballik (kalit A, standart ko'rinish, mentor qatorisiz; «skeytbord» izohi → «Rejangizni eslang…») · podium · yakun («Endi siz ishni reja bilan boshlaysiz», 5 band, uyga vazifa 3 band).
  Olindi: s2, s3, s5–s15 (bo'laklash/shart-keyin/sudrash o'yinlari, soxta agent, to-do, hayotda, Antigravity, restoran finali), s7/s10 testlari, kartochkalar, yakunda avto «graduate».
  Saqlov: `ccDokon` (reja, nom, mahsulot) — keyingi ekranlar o'quvchining o'z do'konini ko'rsatadi. INLINE_KEYS { s4: 0 }. lessonId o'zgarmagan.
- Tuzatishlar (o'z ko'rigim, suratdan): a1 saqlangach REJA.md matni ikki marta ko'rinardi → chapda faqat nusxa tugmasi · a2 promptida «Ruchka — 3000 so'm» qo'sh tire → «Ruchka (3000 so'm)».
- Arena: Q7 «Rejani kim tuzadi?» (✔ Siz, AI'ni ochishdan oldin) · Q11 «Gemini'ga qaysi qadamni berasiz?» (✔ Rejadagi faqat birinchi qadamni) · Q12 ««Keyin» qadamlar qachon quriladi?» (✔ MVP ishlagandan keyin) — tell toza.
- Sinov: gates 10/12 (tell 5→3 / emoji 1 — baza, eski arena va statistika qatori) · **tekshir-m211 40/40** (eski progress 19 → 01/08, ↑ tartib, nusxa matni, reload saqlovi, so'm takrorlanmaydi, nishon 3/4 va 4/4, onFinished 0/1 va 1/1, kontrast 92 element, 390 px toshish 0) ·
  RU 8 ekran toza (`ru-m211.mjs`) · smoke-onfinished `--lang both --seal` **2/2** (scored 1, yutuq 2); lms-sinov md5 o'zgarmadi.

## DAVOM — 2026-10-16 19:52 (keyingi seans shu bo'limdan boshlaydi)
- **19:52 holati:** m2-08 ✅ (332–335) · m2-09 ✅ (336–339) · **m2-11 PracticeLesson3 QURILDI (F-1015-340), foydalanuvchi ko'rigi kutilmoqda** → tasdiqdan keyin yakuniy MD `YAKUNIY/06-PracticeLesson3.md` → keyingi m2-12 PracticeLesson4 (shu `mini-dokon` papkasini davom ettiradi: savat + jami + deploy). Keyingi F-ID: **F-1015-341**.

### Qayerda turibmiz
- **Pilot m1-10 `CssPractice.jsx` YOPILDI:** tasdiq (F-1015-317), RU (318), 2 nuqson + LMS sinovi + yakuniy MD (319). Fayl ishlaydigan holatda, relizga tayyor.
- **m1-08 `HtmlPractice.jsx` YOPILDI** (F-1015-320…327): 9 ekran, smoke 2/2, `YAKUNIY/02-HtmlPractice.md`. Ko'rish: `npx vite --port 5173` → http://localhost:5173/#/lesson/m1-08 («Kodsiz, o'zim ko'raman»).
- **m1-11 DeployLesson YOPILDI** (F-1015-328…331, 11 ekran, smoke 2/2, `YAKUNIY/03-DeployLesson.md`). Ochiq: arena 11-savol almashtirish qarori.
- Keyingi navbat: 2-M PracticeLesson1 (oldingi haqiqiy darsni o'qib, sahifama-sahifa).
- **Yangi ish tartibi (F-1015-317, foydalanuvchi):** qolgan 17 praktika AVTOMAT EMAS. Har biri: oldingi haqiqiy darsni o'qish → har sahifani 1–2 gapda aytish →
  foydalanuvchi fikri → shundan keyin .jsx. Partiya-MD (03–07-*.md) faqat manba. Memory `praktika-sahifama-sahifa-kelishuv`.
- Navbat (App.jsx tartibi): m1-08 HtmlPractice → 2-M PracticeLesson1–4 → 3-M ReactBuildSite, ReactRouterPractice, ReactCrudPractice, ReactProjectDay →
  4-M BackendCrudPractice, FullstackConnectPractice, FullstackFeedback, FullstackProjectDay → 4a NestArchPractice → 4c (3 ta).
- HtmlPractice ichidagi «Keyingi dars — CSS Praktika…» qatori ✅ F-1015-320 da almashdi.

### Nazorat seansiga (chegaradan tashqari — tegilmagan)
- **16.10 16:56 · `src/1-Modull/DeployLesson.jsx` (m1-11) — 3-seans TAHRIRLAYAPTI** (foydalanuvchi bevosita topshirdi, F-1015-328): 17 → 12 ekran. Boshqa seans bu faylga tegmasin.
  Zaxira: `arxiv/F-1015-deploy-oldin/DeployLesson.jsx` (commit b399583 bilan bir xil, git status toza edi).
- **F-1015-325 — «Uyga vazifa» 999px, hamma darsda (foydalanuvchi qarori A):** vazifa-hujjat `F-1015-325-NAZORAT-uyga-vazifa-radius.md`.
- **`src/skelet/NamunaDars.jsx` — `.zoom-on` CSS yo'q** (F-1015-321): skeletdan qurilgan yangi darslarda ⛶ ishlamaydi. Taklif: CssPractice 1864-qatoridagi qoida.
- **MentorTestStats — server javob bermasa mentor qulflanadi** (F-1015-322): `players === null` da panel yo'q → «Natijani ochish» yo'q. Taklif: xatoda ham tugma chiqsin (hamma darsdagi nusxa — KATTA).
- **`src/qolip` `.q-btn` (QTugma asosiy) — oq yozuv `#FF4F28` fonda 3.28** (<4.5; 14.5 px qalin — «katta matn» emas). 78 dars ishlatadi. Qaror nazoratda (rang to'qroq yoki matn to'q).
- App.jsx m1-08 menyu nomi «HTML Praktika — Portfolio sayt», sub «saytni bo'laklaymiz, HTML shablon» — sub endi eskirgan (bo'laklash ekrani olindi). Taklif: «header, menyu, dizayn — Gemini bilan».
- `App.jsx:236` + `src/mentor/lessons.jsx` — m1-10 menyu nomi hali «CSS Praktika — Portfolioni bezaymiz», sub «CSS + kontent + AI bilan tugma».
  Taklif: «CSS Praktika — Demo Day saytini bezaymiz» (MD 08 dagi nom).
- `DeployLesson.jsx` (m1-11) 6 ekrani — reja `02-m1-10-v2-reja.md` (GATE V2 Q1 A): bosh sahifa endi CssPractice'da quriladi; Deploy'da papka yaratish va uslub tanlash takrorlanadi.
- Reliz qarori: zaxira-reja «CssPractice relizga arxiv nusxadan» pilot tasdiqlanmasa uchun edi — pilot tasdiqlandi, v2 relizga.
- Eslatma: `feedback/lms-sinov-2026-09-16/onfinished-sweep.*` 15.10 15:43 da o'zgargan (commit'siz) — bu seans bugun unga tegmadi.

### Ochiq ishlar
- Copilot o'rnatish/kirish UI-yozuvlari (§182) — Copilot ishlatadigan praktika navbatida, VS Code'da ko'z bilan.
- gates tell/emoji (eski arena) — KATTA F-1015-306, bu seansda tuzatilmaydi.

### Havolalar
Hisobot 18 praktika https://claude.ai/artifact/QubJSkwSB5VWm2mmgdC4oQ · GATE V2 https://claude.ai/artifact/PWgzMjWw6wetKYfxNKeCst ·
2-M GATE M (qoralama) https://claude.ai/artifact/Hhxm16str39sY89y7XncHW · 3-M GATE M (qoralama) https://claude.ai/artifact/WBvPkpKDmDfkhgvB6ZKPnC

### Qoidalar (eslatma)
Commit YO'Q · har qadam reja → «ha» · fayl doim ishlaydigan holatda · har tahrirdan keyin `npm run gates -- <fayl>` · jurnalga faqat Edit/Write yoki `<<'EOF'` ·
TEGMA: src/live, src/qolip, src/main.jsx, App.jsx, src/mentor, scripts/, src/compilator, package.json, src/5…12-Modull, praktika bo'lmagan darslar · agentlar faqat ruxsat bilan.
Vositalar: `seans-vositalar/` (README; m1-08: `sinov/tekshir-m108.mjs`, `sinov/ru-m108.mjs`, `qurish/f320*.py`; m2-11: `sinov/tekshir-m211.mjs`, `sinov/ru-m211.mjs`, `qurish/f340.py`). Keyingi F-ID: **F-1015-341**.

### Eski DAVOM (15.10 20:47) — tarix uchun
> ### Qayerda turibmiz
> - **Pilot m1-10 = `src/1-Modull/CssPractice.jsx` (2641 qator) — CSS Praktika v2 «Demo Day saytini bezaymiz», QURILGAN, F-1015-316 gacha.**
>   9 ekran: s0 kirish · s1 reja («Avval tayyorlaning» + maket) · a1 (forma nom·muammo·talablar → Saqlash → yig'iladi + Tahrirlash; prompt; o'ngda Qadamlar) ·
>   a2 (uslub → prompt) · a3 (Ctrl+H rang) · s16 (1 ballik savol) · a4 «Yaxshilash» (5 savollik tekshiruv + kamchilik → prompt, «Keyingi kamchilik») · podium · s17.
>   `lessonId` = `css-practice-portfolio-v3` (o'zgarmagan). Sinov ~20:45 (yangi joydan): o'z sinovi 49/49, navigatsiya 9 ekran ochiq, mentor sinovi toza; gates 10/12 (tell + emoji — eski arena, zaxirada ham, KATTA F-1015-306).
> - **Foydalanuvchi F-1015-316 natijasini hali ko'rmagan/tasdiqlamagan.** Ko'rish: `npx vite --port 5173` → http://localhost:5173/#/lesson/m1-10 → «Kodsiz, o'zim ko'raman».
> - MD manba: `08-m1-10-demoday-v3.md` (F-1015-311…316 ustun bloklari bilan). 2-M/3-M qoralamalari: `03-m1-08-v4.md`, `04…07-*.md` — **yangi qolip elementlari (forma+Saqlash/Tahrirlash, Qadamlar o'ngda, namuna yo'q, kartochka o'rniga Yaxshilash) hali qo'llanmagan.**
> - Zaxiralar (O'CHIRILMAYDI, ustidan yozilmaydi): `arxiv/F-1015-amaliyot-oldin/` (asl 6 fayl — relizda CssPractice shu nusxadan ketadi, yangisi keyin alohida) · `arxiv/F-1015-pilot-v1/CssPractice.jsx` · `arxiv/F-1015-305-oldin/onfinished-sweep.*`.
> - Vositalar: `seans-vositalar/` (README — skriptlar, artifact manbalari, suratlar).
>
> ### Keyingi qadam (tartib bilan)
> 1. Foydalanuvchi pilot v2 ni localhost'da ko'radi → fidbek yoki tasdiq (F-1015-317 dan).
> 2. Tasdiqdan keyin: yangi qolip elementlarini partiya MD'lariga qo'llash — **avval foydalanuvchidan so'rab** → 2-M (m1-08) GATE M → qurish → 3-M (4) → 4-M, 5-M, 6-M (MD hali yo'q).
> 3. Har dars: zaxira → MD v3 → partiya GATE M → qurish → `npm run gates -- <fayl>` + lint:jsx + lint:til + eski progress + navigatsiya + mentor → RU (oxirida, MD tasdiqlangach).
> 4. `smoke-onfinished-all` v2 bo'yicha qayta — faqat ruxsat bilan, argumentsiz, oldin `feedback/lms-sinov-2026-09-16/onfinished-sweep.{json,md}` arxivga.
>
> ### Foydalanuvchidan kutilayotgan qarorlar
> - **Pilot v2 tasdig'i** (F-1015-316 natijasi) — localhost'da.
> - **Yangi qolip elementlari qolgan 17 praktikaga ham qo'llanadimi?** (forma/Saqlash, Qadamlar, Yaxshilash).
> - 2-M GATE M: https://claude.ai/artifact/Hhxm16str39sY89y7XncHW · 3-M GATE M: https://claude.ai/artifact/WBvPkpKDmDfkhgvB6ZKPnC (qoralama — yangi qolipga moslash kerak bo'lishi mumkin).
>
> ### Nazorat seansi ruxsati kutilmoqda (chegaradan tashqari, tegilmagan)
> - `DeployLesson.jsx` 6 ekrani (GATE V2 Q1 A): muammo ko'rsatiladi, bosh sahifa bor → qolgan ≥3 sahifa, uslub tanlovi olinadi, «mening-saytim» papka yaratish olinadi. Reja: `02-m1-10-v2-reja.md`, https://claude.ai/artifact/PWgzMjWw6wetKYfxNKeCst; hozirgi suratlar `seans-vositalar/suratlar/v2/shots/deploy/`.
> - `App.jsx` + `src/mentor/lessons.jsx` — menyu nomi «CSS Praktika — Demo Day saytini bezaymiz».
> - `HtmlPractice.jsx` 1820 «Keyingi dars» qatori.
> - Tekshiruvchi rol-fayliga «QOLIP.md joylashuviga solishtirish» ov-bandi (F-1015-312 taklifi).
>
> ### Ochiq ishlar
> - Copilot o'rnatish/kirish UI-yozuvlari (§182) — qurishdan oldin VS Code'da ko'z bilan tasdiqlanadi.
> - RU tarjima (CssPractice v2 va keyingilar) — MD tasdig'idan keyin.
> - gates tell/emoji (eski arena) — KATTA F-1015-306, bu seansda tuzatilmaydi.
>
> ### Havolalar
> Hisobot 18 praktika https://claude.ai/artifact/QubJSkwSB5VWm2mmgdC4oQ · GATE M m1-10 pilot https://claude.ai/artifact/2pv8hKCydkcpcGWmBJ2UxQ · pilot v1 natija https://claude.ai/artifact/B31fjUiTNhj1o48A8xUC2e ·
> GATE V2 https://claude.ai/artifact/PWgzMjWw6wetKYfxNKeCst · F-1015-310 https://claude.ai/artifact/31gUg2ns8iicdMRtc7KwBS · F-1015-314 rasm https://claude.ai/artifact/8QKqG5B8Au8yHizc9Bu3ma
>
> ### Qoidalar (eslatma)
> Commit YO'Q · har qadam reja → «ha» · fayl doim ishlaydigan holatda · har tahrirdan keyin `npm run gates -- <fayl>` · jurnalga faqat Edit/Write yoki `<<'EOF'` ·
> TEGMA: src/live, src/qolip, src/main.jsx, App.jsx, src/mentor, scripts/, src/compilator, package.json, src/5…12-Modull, 2–6-Modul praktika bo'lmagan darslari, konveyer/vositalar/gatem/base.css · agentlar faqat ruxsat bilan.
> Fon jarayonlar: 5173 vite to'xtatildi (~20:45). 5174 dagi vite — boshqa loyiha (`~/Desktop/AILM`), bu seansniki emas, tegilmadi.
