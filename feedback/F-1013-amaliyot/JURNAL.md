# F-1013 amaliyot qolipi — jurnal

## 2026-10-13 14:56 · m1-08 HTML Praktika — qurildi (GATE M ✓)
- Fayl: `src/1-Modull/HtmlPractice.jsx` — skeletdan (JR-14), 20 → 12 ekran; asl nusxa `arxiv/F-1013-amaliyot-oldin/`.
- Saqlandi: lessonId · arena 12 savol (kalitlar 3 2 0 1 2 1 2 0 3 3 1 0 — aynan) · test kalitlari o'rni (s16→2, s6→3) · HOMEWORK eksporti · F-1012 (maxReached, gate.passed, mentorLock) · nishon id lari (built, coder, graduate).
- Tekshiruv: gates 12/12 · lint:jsx toza · 12 ekran surati xatosiz (1280 va 390) · oqim: bo'laklar (xato → qayta → to'g'ri), havola (xato tanlov → to'g'ri → pochta),
  A1→A2→A3 kod davomiyligi va blok yopilishi, Level Up nishoni, nusxalash · navtest2 self ✅ (student serversiz — eski dars bilan bir xil «Mentorni kuting») ·
  mentor: tushuncha/blok ochiq, 2 testda «Natijani ochish» → ochiq, «Kim bajardi» bor · smoke-onfinished: total 12 · scored 2 · pageerror 0.
- Topilma: kompilyator natija oynasida `#…` havola ishlamaydi (`<base target="_blank">`) — umumiy fayl, qaror kutilmoqda.
- RU: matnlar qoralama (6-RU bosqichi keyin). Commit yo'q.

## 2026-10-13 15:01 · Kompilyator: «#bo'lim» havolasi (qaror A)
- Muammo: `HtmlCompiler` natija oynasida `<base target="_blank">` — `#aloqa` ham yangi bo'sh oynada ochilardi; m1-08 A2/A3 qadamlari shu harakatni so'raydi.
- Tuzatish: `src/compilator/HtmlCompiler.jsx` +16 qator — `ANCHOR_NAV` skripti (faqat ko'rinadigan preview; tekshiruv-hujjati tegilmagan). Zaxira: `arxiv/F-1013-amaliyot-oldin/HtmlCompiler.jsx`.
- Sinov: `#aloqa` → oyna 0 → 436 px, yangi oyna yo'q · `href="#"` → tepaga · tashqi `https://` havola avvalgidek yangi oynada · JS xato xabari eski/yangi bir xil ·
  gates m1-08 12/12 · lint:jsx 252 toza · CssLesson2 gates 11/12 (emoji — eski qarz, fayl tegilmagan).
- Sinf-supurish: kompilyatorni 52 dars ishlatadi; kodida `#` havola bor — 2 tasi (HtmlPractice, CssLesson2), ikkalasi endi to'g'ri ishlaydi.

## 2026-10-13 15:41 · 1-bosqich: 2-Modul tartibi — VS Code (m1-15) HTML Praktikadan (m1-08) oldin
- Qaror (foydalanuvchi, 13.10): ish tartibi VS Code + gemini.google.com + aniq prompt; Antigravity ixtiyoriy (rasmiy FAQ: 18 yoshdan kichiklarga yopiq).
- O'zgardi: `src/App.jsx` (m1-15 n:9, m1-08 n:10) · `src/compilator/teg-xaritasi.json` tartib · `HtmlCompiler.jsx` TEG_TARTIB (generator, 1 qator) ·
  `src/mentor/lessons.jsx` (mentor zaxira sayti, deploy qilinmagan) · `HtmlPractice.jsx` yakun «Keyingi dars — CSS Praktika» + MD. Zaxira: `arxiv/F-1013-tartib-oldin/`.
- Tekshirildi: CssLesson2 va VsCodeLesson «Keyingi dars» — faqat tugma yozuvi; CssPractice «O'tgan darsda HTML bilan qurdingiz» — yangi tartibda to'g'ri;
  CssPractice «o'tgan darsdagi flexbox» — eski xato, 4-bosqichda. Demo saytlar (m1-demo, texnik-demo) tegilmadi.
- Sinov: lint-teg-royxat toza · gates HtmlPractice 12/12 · VsCodeLesson 10/12 (tell, emoji — eski qarz, fayl tegilmagan) · lint:jsx toza · ilova menyusi 8→9 VS Code→10 HTML Praktika→11, pageerror 0.
- LMS: m1-15 va m1-08 o'rni foydalanuvchi tomonidan, umumiy yuklash kuni.

## 2026-10-13 16:04 · 2-bosqich: VS Code darsi (m1-15) — «AI bilan: aniq prompt» qurildi (GATE M ✓, q0–q2 A)
- Fayl: `src/1-Modull/VsCodeLesson.jsx` 19 → 20 ekran; asl nusxa `arxiv/F-1013-amaliyot-oldin/VsCodeLesson.jsx`.
- Yangi 13-ekran `ScreenAi` (id `sai`): Gemini / Prompt / Faylga maketlari + «Nusxalash» + 4 qadam `StepChecklist`; Antigravity — ixtiyoriy qator. Maqsad 7 qadam · final 5-band · yakun +1 · uyga vazifa 1-band (+ `HOMEWORK` eksporti) · 1 kartochka · arena 4 savol varianti.
- Indekslar: `RECAPS[13]`, `Q_LABELS[13]` → 14; `INLINE_KEYS` (id) va `PRACTICE_AFTER` (9, 10) o'zgarmagan; arena kalitlari aynan (1 0 2 3 1 2 0 3 0 3 1 2).
- Sinov: gates 11/12 (emoji — eski qismlar, KATTA F-1013-E) · tell 0 · olchov 0 error (7 warn — eski ekranlar) · lint:jsx toza · 20 ekran surati (1280) + 390 · yangi ekran oqimi
  (nusxa = to'liq prompt; 4 «Bajardim» → «Davom etish» ochiq, yashil xulosa; pageerror 0) · navtest2 self 38 holat ochiq · mentor: yangi ekranda qulfsiz, «Bajardim» faqat ko'rinadi ·
  smoke-onfinished-all 140/140 (VsCode uz/ru · scored 4).
- Yon ta'sir va tiklash: `smoke-onfinished-all` faqat 2 fayl bilan yurgizilganda `feedback/lms-sinov-2026-09-16/onfinished-sweep.{json,md}` 4 natija bilan ustidan yozildi → to'liq qayta yurgizildi, 140/140 bilan tiklandi.
- Eslatma (eski skript): `scripts/smoke-onfinished.mjs` VsCode darsida yakun tugmasini topmaydi («tugma bosildi: false») — eski nusxada ham aynan shunday; `-all` varianti o'tadi.

## 2026-10-13 16:17 · 3-bosqich: m1-08 MD v3.1 — GATE M ✓ (q0 A, q1 A); qurish keyingi seansda
- `01-m1-08-v3.1.md`: A1–A3 VS Code + Gemini (QBlok + QPrompt, «Bajardim»), A2/A3 promptida hozirgi kod, dizayn faqat A3 da; kompilyator darsdan olinadi; uyga vazifa VS Code'da.
- Holat `DAVOM.md` ga yozildi (foydalanuvchi 1–2 soatdan keyin yangi seansda davom ettiradi).

## 2026-10-14 07:49 · 3-bosqich: m1-08 HTML Praktika — bloklar VS Code + Gemini'da qurildi (MD v3.1, GATE M ✓ q0 A, q1 A)
- Fayl: `src/1-Modull/HtmlPractice.jsx` 2548 → ≈2420 qator, 12 ekran o'zgarmadi. Zaxira: `arxiv/F-1013-m108-kompilyatorli/HtmlPractice.jsx` (kompilyatorli nusxa).
- A1–A3: `QBlok` + `QPrompt` («Siz → Gemini», `{…}` joylar, «Nusxalash»), qadamlar bittadan «Bajardim» bilan (↻ qaytaradi); oxirgi «Bajardim» → `blokDone` (javob, 500+ signal, A3 da «Level Up!»).
  A2/A3 promptida «Mana hozirgi kodim: {…}»; dizayn faqat A3 da; A3 «Yordam» faqat prompt qadamida. «Ortda qoldingizmi» → «Namuna kodini nusxalash» (butun index.html): A1 — bo'sh boshlanish (`!`+Tab, style.css ulangan), A2 — A1 natijasi, A3 — A2 natijasi.
- Olib tashlandi: `HtmlCompiler` importi, `createPortal`, `TASK_A1–A3`, `TASK_HW`, `BLOKLAR`, `openBlok`, `openHomeworkPractice`, `readBlokCode`, `pracRead/Write/Clear`, kompilyator portali, `onPractice` prop. `HtmlCompiler.jsx` tegilmadi (`ANCHOR_NAV` qoladi).
- `PfSite` ga `dizayn` holati (och fon, oq kartochkalar, soya, sarlavhalar modul rangida) — A3 natijasi. 0-ekran javobi «qurasiz» (ikkala variantda), 1-ekran pastki qatori VS Code. Uyga vazifa kartasi — VS Code, 3 band (3-band Gemini dizayn so'rovi), skrinshot; «Uyga vazifani ochish» tugmasi olindi. `HOMEWORK` — `type: 'file'`.
- Sinov: gates 12/12 · lint:jsx 252 toza · lint-teg-royxat toza · 12 ekran surati 1280 + 4 ekran 390 (pageerror 0) · blok oqimi (A1/A2/A3: «Avval bajaring» yopiq → 4 «Bajardim» → yashil xulosa, «Davom etish» ochiq, namuna nusxasi to'g'ri kod, prompt nusxasi to'liq, qayta yuklashda bajarilgan holat saqlanadi, A3 da `graduate`) ·
  navtest2 self 11 — orqaga/oldinga hammasi ochiq, pageerror 0 · mentor (3, 6, 8): 4 qadam ochiq, «Bajardim» yo'q, «Davom etish» ochiq · smoke-onfinished-all 140/140 (argumentsiz; html-practice uz/ru ✅).
- RU — qoralama (7-bosqichda ko'riladi).
- 14.10 (foydalanuvchi qarori): 1-ekran mentori «Har bo'limni o'zingiz qurasiz» · A1 promptining 1-qatori «Portfolio sahifam uchun index.html'ni yozib ber.» (`<link>` head'da turadi). gates 12/12 · lint:jsx toza.
- 14.10: A1 3-qadam «Keyin `index.html` dagi kodning o'rniga qo'ying, `Ctrl+S`.» (Gemini endi to'liq fayl beradi). gates 12/12 · lint:jsx toza.

## 2026-10-14 08:30 · F-1014 fidbek qabul qilindi (7 band) — qaror sahifasi yuborildi
- Ro'yxat: `feedback/F-1014-m108-fidbek/QABUL.md`; variantlar artifact'da (https://claude.ai/artifact/HACVrvJtsqqTbKLWDkkt3u). Kodga tegilmadi.

## 2026-10-14 09:31 · F-1014 m1-08 fidbeki tuzatildi (GATE F-1014: 01a B · 01b-2 A · 02 A · 04a A · 04b A · 05 A · 06 A · 07 A)
- Fayl: `src/1-Modull/HtmlPractice.jsx` 12 → 13 ekran (yangi A4 · Dizayn, id `a4`). Zaxira: `arxiv/F-1014-oldin/` (HtmlPractice + MD v3.1). MD: `01-m1-08-v3.2.md`.
- 01a: `PfSite` sukut — dizaynli maket (qorong'i header, oq kartochkalar); A1–A3 natijasi `xom` (CSS'siz — A4 gacha CSS yo'q). 01b-2: 0-ekran «Bu sayt nima uchun kerak?» + 3 variant.
- 02/03: 2-ekran — «Footer'ni tepaga ko'chirish» → «Joyiga qaytarish»; yakundagi ikki ortiqcha qator olindi. 04: `Bashorat` (dars ichida, qolipga tegilmadi) — navbat bilan yonadi + javob darrov.
- 05: 5-ekran — menyudagi «Aloqa» va `href="?"` halqa bilan, tugmalar ustida «1/2 · …», «2/2 · …». 07: qadamlar bitta qator + o'ngda qadam rasmi (VS Code → Gemini → fayl → natija).
- Yon tuzatish: A2 natijasidagi menyu «Men haqimda · Loyihalarim» edi → «Men haqimda · Aloqa» (promptga mos).
- Indekslar: RECAPS / Q_LABELS (4, 7) va INLINE_KEYS (s3 = 2, s5 = 3) o'zgarmadi; `graduate` — a4 da; `PRACTICE_BASE + 9` — A4 signali.
- Sinov: gates 12/12 · lint:jsx 252 toza · 13 ekran surati 1280 · oqim 1280 + 390 (0/2/5-ekran va A1–A4 bosib o'tildi, prompt va namuna nusxasi, qayta yuklashda holat, Level Up!; pageerror 0) ·
  navtest2 self 12 — orqaga/oldinga hammasi ochiq · mentor (0, 2, 5, 3, 6, 8, 9): qulfsiz, «Bajardim» yo'q · smoke-onfinished-all 140/140 (argumentsiz; html-practice uz/ru ✅).
- RU — qoralama (7-bosqich). Korpus/qonunga muhrlash va sinf-supurish — foydalanuvchi qaroriga.

## 2026-10-14 10:20 · F-1014 3-tur: 6-ekran (havola) «buzildi → tuzatdik» + 2-ekranda teg yorliqlari
- Fidbek: 08 «bu page tushunarsiz, undan oldingi tanlaydigani ham» · 10 A2 — yaxshi. Qaror sahifasi yuborildi; foydalanuvchi: «o'zing tavsiya qil, qilaver» → A.
- 6-ekran: taxmin kartasi, ikkinchi `?` va pochta qadami olindi; bosish → qimirlamadi (silkinish, qizil qator) → `#aloqa` tanlash → yana bosish → bo'limga tushadi.
- 09: «undan oldingi» ehtimol 1-savol testi — F-1014-03 da «bo'lim — <section>» qatori olingach javob hech qayerda ko'rinmasdi; 2-ekran saytiga teg yorliqlari qo'shildi.
- Sinov: gates 12/12 · lint:jsx 254 toza · 6-ekran oqimi 1280 + 390 (xato izohi, qayta yuklashda holat; pageerror 0) · navtest2 self 12 ochiq · mentor (2, 5) qulfsiz · smoke-onfinished-all 140/140.
