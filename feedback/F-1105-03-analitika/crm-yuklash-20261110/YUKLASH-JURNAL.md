# YUKLASH JURNALI — 10.11.2026 prod paket (172 dars → CRM), F-1105-03

Yuklovchi seans. Manba: `YUKLOVCHI-PROMPT-20261110.md`, `yuklash-20261110-prod/` (commit 9f9951b9).

## 2026-11-10 22:04 — sinov qatori 13381: ❌ O'TMADI, ish TO'XTATILDI

**Qilindi:**
- Yordamchi server 127.0.0.1:5399 ishga tushdi, `/files/2-Modul/01-InternetLesson-v6.jsx` → 200 (lokal md5 64fcdab1… = xarita).
- Bo'lim 2374: 13381 qatori fayli `01-InternetLesson-v5.jsx` = xaritadagi `eski` ✓ (holat Active, 14091 ham v5, Active).
- `__yukla(13381, '2-Modul/01-InternetLesson-v6.jsx', '01-InternetLesson-v6.jsx')` → status 200, type lesson-runner, lang uz, size 558706,
  LEKIN javobdagi qator matnida fayl hali `01-InternetLesson-v5.jsx`.
- Bo'limni qayta o'qib md5: 13381 = 6d961628… (ESKI v5), 14091 = 6d961628… (tegilmagan). Fayl ALMASHMAGAN.

**Tashxis (faqat o'qish bilan):** CRM edit-formasi 02.11 dan keyin o'zgargan — yangi maydonlar:
`edit_lesson_runner_revision` (hidden, 64-hex), «JSX tekshiruv / Проверка JSX» bloki (Исходник/Браузер: «не проверено»),
`js-lesson-media` (resurslar, `edit_lesson_runner_first_asset_keys`, alohida ekranlar `chunks[]`).
Formadagi ogohlantirish: «Kontent o'zgarsa, dars Draft bo'ladi: tekshirib, qayta aktivlashtiring.»
`jsx_validation_report.php`: 13381 va 14091 — ikkalasi `validation_id: null` (POST tekshiruv navbatini ham yaratmagan).
POST javobining HTML'i saqlanmagan (`__yukla` uni qaytarmaydi) — rad sababi noma'lum.

**Holat:** CRM'da hech narsa o'zgarmagan (13381 v5, Active). `yuklangan.csv` ga yozilmadi. Qolgan 343 qator boshlanmadi.
Dump: `dump/sinov-13381-keyin.json`, `dump/forma-tahlil.json`, `dump/diag-13381-14091.json`.

**Qaror kerak (foydalanuvchi):** (1) Draft-qoidasi — yuklash 172 darsni Draft qiladimi, kim qayta aktivlashtiradi;
(2) yangi forma bo'yicha yuklash yo'li (CRM jamoasi bilan) yoki javob-HTML'ni saqlaydigan bitta diagnostik qayta urinish.

## 2026-11-10 22:48 — sabab aniqlandi: CRM server xatosi, KUTISH

- `yukla-sahifa.js` 29.10 va 02.11 dagi bilan bir xil (diff — faqat izoh satri); 02.11 da shu skript bilan 8/8 md5 ✓ bo'lgan.
- Analitika JURNAL.md (22:37) va `38-ABDULLOH-CRM-JSX-YUKLASH-XATO-UZ.md`: 22:36 foydalanuvchi 13381 ni qo'lda, CRM UI orqali
  «Saqlash» qildi → qizil xato **«Cannot create catalogue lock»**. Demak muammo skriptda emas, CRM saqlashida (server tomoni).
- Yangi forma «Saqlash» ni `_jsx_async=1` + `_jsx_file_count` bilan yuboradi, javob JSON `{ok,error}`.
- Yuklovchi seans hech narsa qilmaydi: CRM tuzatilgach — 13381 sinovi qaytadan, keyin modulma-modul.

## 2026-11-10 23:02 — lock tuzatildi, yangi to'siq: R04 (tashqi media)

- 23:00 Abdulloh «fiks bo'ldi» dedi; foydalanuvchi 13381 ni qo'lda saqladi → qizil xato:
  «JSX: R04: Медиа на внешнем сервере — LMS не принимает https://go.coddycamp.uz/uploads/media_library/c7b71161….png»
  (rasm: `dump/R04-xato-13381-2300.png`). Qator hamon v5, Active.
- Paketdan qidiruv (faqat o'qish): `MENTOR_IMG` = shu c7b71161….png — **172/172 dars**da. Hozir CRM'dagi v5 da ham bor (ya'ni yangi narsa emas, yangi CRM qoidasi).
  Qo'shimcha media_library rasmlari 4 darsda (9 ta): 02-PmLesson1, 04-Htmllesson2, 05-HtmlTakrorlash (2-M), 10-PracticeLesson2 (3-M).
  Matn/kod-misol ichidagi URL (yuklanmaydigan): vercel logo/futbol (2-M 04, 05), GitHub badge `LOGIN/REPO` (6-M 11).
- Xulosa: R04 shu holicha 172 darsning hammasini to'xtatadi. Yo'l: (A) CRM — o'z domeni `go.coddycamp.uz/uploads/media_library` ni R04 dan ozod qilish; (B) bizda — 172 dars kodini `resolveUrl` + «Dars resurslari»ga o'tkazish (src/ — yuklovchi doirasidan tashqari, KATTA ish). Qaror foydalanuvchida.

## 2026-11-10 23:46 — R04 tuzatildi; 13381 to'g'ri fayl bilan yuklandi, Active kutilmoqda

- 23:38 foydalanuvchi qo'lda sinov qildi: 13381 ga `02-PmLesson1.jsx` (paketdan emas, md5 a4eff60a…) tushdi, Draft;
  foydalanuvchi ruxsati: «yuklagach darhol Active qilib ketaver».
- CRM yangi saqlash: fayl `uploads/lessons/lesson_runner/versions/<id>/lesson.jsx` + `publication.json` (CRM esbuild bilan yig'adi);
  Active — `ajax/student_courses/change_question_status.php` (status=active), status badge'idagi bilan bir xil.
- Yangi skript `yukla-sahifa-v2.js` (`__qator`: oldin-tekshiruv → `_jsx_async` saqlash → bayt-solishtiruv paket bilan → Active → keyin-holat).
- 13381 → `01-InternetLesson-v6.jsx`: saqlash ok, CRM fayli paketdagi bilan **bayt-bayt bir xil (558706)**; tartib/til/nom o'zgarmagan; holat **Draft**.
- Active rad etildi: 422 «JSX tekshirilmagan. Formani saqlang va tekshiruv tugashini kuting.» Manba-tekshiruv tayyor (OGOH: xato 0, ogoh 5 — Chromium 79 CSS/JS),
  «Браузер» tekshiruvi hali yo'q (`dump/hisobot-13381.json`). Kutilmoqda; 14091 va qolgan qatorlarga tegilmadi.

## 2026-11-10 23:47 — 13381 Active qilib BO'LMAYDI: brauzer-tekshiruv XATO → ommaviy yuklash TO'XTATILDI

- Brauzer-tekshiruv 23:46:44 da tugadi (yuklashdan ~3 daq): **XATO 8** (`dump/hisobot-13381-browser.json`):
  B07 ×7 «tugmani bosib bo'lmaydi» — ustida darsning o'z qatlami (`.tg-root`, `.tg-call`, `.zoom-backdrop`);
  B18 ×1 «dars tashqi serverga murojaat qiladi» — `fonts.googleapis.com/css2`. Ogoh 9 (Chromium 79, markFirstScreenReady, LMS «X» ostida matn, startAt).
- Active so'rovi → 422 «JSX tekshiruvida xatolar bor. Hisobotni tekshiring.» 13381: v6 (bayt ✓), **Draft**.
- Paket bo'yicha: Google Fonts **171/172** darsda, `.zoom-backdrop` 152/172 → deyarli hamma dars B18 (va ehtimol B07) bilan to'xtaydi.
  Ommaviy yuklash = 172 dars Draft va qayta yoqib bo'lmaydi → BOSHLANMADI. 14091 va boshqa qatorlarga tegilmadi.
- Orqaga qaytarish ham yo'q: v5 ni qayta yuklash ham tekshiruvdan o'tadi (v5 da ham Google Fonts) → Active bo'lmaydi.
  13381 ni faqat CRM tomoni (Abdulloh) qayta yoqa oladi.

## 2026-11-11 02:04 — yuklash analitika seansida davom etdi (foydalanuvchi qarori 11.11 ~01:50; yuklovchi seans yopilgan)

- 01:39 gacha (foydalanuvchi rasmi): CRM tomoni B07/B18 ni ogohlantirishga tushirgan, 13381 Active (yuklovchi seans faollashtirgan, bu yerda yozilmagan edi).
- Tekshiruv (faqat o'qish): 13381 = `01-InternetLesson-v6.jsx`, Active, CRM fayli paket bilan bayt-bayt ✓ (558706), hisobot Исходник OGOH / Браузер OGOH, xato 0.
- Yangi skript `yukla-sahifa-v3.js`: v2 + CRM tekshiruvini kutish (`jsx_validation_report.php` — Исходник + Браузер tugaguncha) → XATO yo'q bo'lsa Active. v2 saqlagach darhol faollashtirardi (422).
- 14091 (ru): saqlandi (3 s), bayt ✓, Draft → shu fayl mazmuni 00:33 da tekshirilgan edi (tekshiruv mazmun bo'yicha keshlanadi) → darhol Active ✓.
- 2-Modul: 02, 03, 06, 07, 08, 09 — saqlandi, bayt ✓, tekshiruv navbatda. «Браузер» tekshiruvi ketma-ket, ~2:47–3:05 / fayl; uz va ru bir xil fayl → bitta tekshiruv.
- **Rad etildi (saqlashda, qator o'zgarmagan — v5 Active):** 04-Htmllesson2, 05-HtmlTakrorlash — **R04** tashqi rasm (`coddycamp-uyga-vazifa-v2.vercel.app`, uyga vazifa rasmi); 10-HtmlPractice — **K03** «Недопустимый импорт `react-dom`». Paket bo'yicha: K03 32 dars (`createPortal`), R04 3 dars, jami bloklangan 34 → `konveyer/bloklangan.json`. Abdullohga matn: `../39-ABDULLOH-CRM-K03-R04-UZ.md` (foydalanuvchi yuboradi).
- Konveyer (foydalanuvchi tasdig'i ~02:00): `konveyer/konveyer.js` + `konveyer-server.mjs` (5398) — kutuvchi tabda yashirin iframe'da bo'lim → `__darsSaqla` → `__kut`; bir vaqtda ≤2 dars kutishda; to'xtash: saqlash rad · faollash to'xtadi · `konveyer/PAUZA` fayli. Ro'yxat `konveyer/royxat.json` — 131 dars. Sinov (chegara 1): 2-M 12-GitLesson iframe orqali saqlandi, uz/ru bayt ✓.

## 2026-11-11 02:43 — 2-Modul holati, 3-Modul TO'XTATILDI (foydalanuvchi), Abdullohga 40-hujjat

- Konveyer (davom rejimi) 2-M 12, 14 va 3-M 01, 02, 04, 05 ni yukladi. Foydalanuvchi ~02:34: «3-Modulga tegmaymiz, 2-Modulni to'liq hal qilamiz» → `konveyer/PAUZA` + `__kv.pauza`.
- **2-Modul (CRM'dan tekshirildi 02:3x):** v6 Active — 01, 02, 03, 06, 07, 08, 12, 14 (8); **Draft — 09 VsCode** (B06 XATO, 14097/14100); eski v5 Active — 04, 05, 10, 11, 13.
- **3-Modul:** 01, 02, 04 Active (OGOH); **05 JsConditions Draft** — 02:30 saqlangan, `validation_id` bor, `static/browser: null` 15+ daqiqa (tekshiruv navbati to'xtagan ko'rinadi; 04-JsVars 02:33 da oxirgi muvaffaqiyatli).
- B06 takrorlanmadi: `konveyer/b06-tekshir.mjs` (1440×900 + 390×844, 20 ekran, shriftsiz) — toza; LMS preview 1440×900 — toza.
- K03/R04 tuzatildi (src): `src/live/portal.js` (react-dom'dagi bilan bir xil portal obyekt), 32 darsda import almashdi; 04/05 rasmlari CRM media kutubxonasiga (9676868e….png, 65bb6ee3….png — md5 ✓); 6-M 11 badge satri bo'lindi, LEKIN yig'mada esbuild qayta qo'shadi — hali R04 ga tushadi (6-Modul, keyin).
- Yangi paket `yuklash-20261111-prod` (--majbur, commit YO'Q): 172 dars, kechagidan aynan 34 tasi farq qiladi (138 bayt-bayt bir xil), react-dom 0. 2-M 5 dars: smoke-lms 5/5, smoke-preview 5/5, portal oynasi (CssPractice) ✓. Gates 11/13 — tell/emoji yiqilishi eski (HEAD da ham 26/46 xuddi shunday).
- **2-M 04, 05, 10, 11, 13 YUKLANMADI** — tekshiruv navbati ishlamasa Draft'da qoladi. Abdullohga: `../40-ABDULLOH-CRM-DRAFT-QOLGAN-DARSLAR-UZ.md` (39 o'rniga; foydalanuvchi yuboradi).

## 2026-11-11 03:02 — seans to'xtadi
- 03:02 holat: 14110/14109 (3-M 05) va 14097/14100 (2-M 09) — Draft; 3-M 05 tekshiruvi `static: null`. Dump: `dump/yakuniy-holat-0300.json`. Tablar yopildi, `__yk3*` localStorage'dan o'chirildi, serverlar to'xtatildi. Davom: analitika `DAVOM.md` eng yuqori blok.

## 2026-11-11 12:38 — Abdulloh 43-javob: CRM tekshiruvi endi yuklashni to'xtatmaydi; v4 asboblar

- Javob: `../43-ABDULLOH-JSX-ACTIVE-JAVOB-UZ.md`. Tekshiruv xato/ogohlantirishlari saqlash va Active'ni bloklamaydi;
  **Active qatorga yangi fayl saqlansa qator Active qoladi — yangi versiya darhol o'quvchida.** Hali bloklaydi: sintaksis xatosi,
  fayl yo'qligi, xavfsiz bo'lmagan yuklash, ruxsat, bir vaqtda tahrir. Nashrlar tarixi: `jsx_publication_history.php`.
- CRM'da tekshirildi (faqat o'qish, 12:4x): 14097/14100 `09-VsCodeLesson-v6.jsx` Active · 14109/14110 `05-JsConditionsLesson-v6.jsx` Active
  (fayl katagida «Опубликовано / сохранено с замечаниями» — nashr paytidagi tarix: static not_checked, browser tool_error).
- 🔴 Xavf: CRM endi to'siq emas → buzuq fayl ham darhol o'quvchiga chiqadi; yagona to'siq — bizning paket smoke'i.
- K03/R04 tuzatishlari commit `a9823949` (35 fayl, pathspec; boshqa seansning staged 4 fayli — tekshiruv sayti — indeksda qoldi).
- Paket `yuklash-20261111-prod` qayta yig'ilmoqda (`--majbur` — faqat o'sha 4 begona staged fayl tufayli; darslar a9823949 dan).
  Eski paket zaxirasi: scratchpad `paket-20261111-eski`.
- Topilma: v3 konveyerdagi `__darsSaqla`/`__kut` faqat localStorage'da edi (03:02 da o'chirilgan, faylda yo'q) → yangi diskdagi asboblar:
  `konveyer/yukla-v4.js` (saqlash → bayt ✓ → Active; tekshiruv kutilmaydi; fayl nomi havola matnidan — katakda endi ogohlantirish bloki bor),
  `konveyer/konveyer-v4.js` (birinchi muammoda to'xtaydi, `opt.modullar`, PAUZA; `__tekshiruvYig` — modul hisoboti uchun),
  `konveyer/royxat-v4.py` (yangi paket csv + yuklash-xarita.json → `royxat-v4.json`).

## 2026-11-11 13:29 — 2-Modul YOPILDI: 14/14 dars yangi versiyada (konveyer-v4)

- Paket `yuklash-20261111-prod` qayta yig'ildi (commit `a9823949`, `--majbur` faqat begona staged 4 fayl tufayli): smoke-lms ✓ · smoke-preview 172/172 · HISOBOT «O'TDI ✓».
  Eski paket bilan 172/172 md5 bir xil. `konveyer/royxat-v4.json` 172 dars (xarita↔csv qatorlari mos, md5 ✓).
- Oldin yuklangan 13 dars (2-M 01,02,03,06,07,08,09,12,14 · 3-M 01,02,04,05) — 26 qator Active, yangi fayl, CRM fayli yangi paket bilan bayt-bayt ✓.
- Serverlar: yordamchi 5399 (`YAKKA=…/yuklash-20261111-prod/yakka`, md5 ✓), konveyer 5398. Eski `konveyer/PAUZA` o'chirilmadi — v4 `TOXTAT-V4` ga qaraydi, chegara `modullar: [2]`.
- 13:28 `__konveyer4(2-Modul, {modullar:[2]})`: **yuklandi 5** — 04 Htmllesson2, 05 HtmlTakrorlash, 10 HtmlPractice (v7), 11 CssPractice, 13 Deploy;
  har biri uz+ru 5–7 s, saqlash ok, bayt ✓, qator **Active qoldi** (faollashtirish chaqirilmadi — 43-javobdagidek). 9 tasi allaqachon. Xato 0.
- Mustaqil qayta tekshiruv (13:29): 2-Modul **28/28 qator Active + yangi fayl + bayt ✓**.
- CRM tekshiruvi (bloklamaydi, `dump/tekshiruv-m2-1335.json`): «Браузер» 18/28 tugagan (yangi 5 dars navbatda); XATO faqat 09 VsCode B06 (ma'lum, ogohlantirish sifatida o'tgan).
- To'xtadi (foydalanuvchi qarori 13:0x): 3-Modulga o'tilmaydi — foydalanuvchi qaytib hisobotni ko'rgach buyruq beradi.
- 13:44 CRM tekshiruvi (`dump/tekshiruv-m2-1345.json`): «Браузер» 26/28 tugagan (13 Deploy navbatda). Yangi 5 dars: 04, 05, 10 — OGOH (xato 0);
  **11 CssPractice — XATO 3 × B07** «🏅 1/4, 2/4, 3/4 tugmasini bosib bo'lmaydi — ustida `.acu-overlay`».
  Tashxis: bu yuqori paneldagi nishon hisoblagichi (`AchCounter`), ustidagi — blok «Davom etish»dan keyingi to'liq-ekran nishon bayrami
  (`AchCelebrate`, 4 s da o'zi yopiladi yoki bosilganda) → ataylab qilingan, o'quvchi uchun nosozlik emas; K03 portal o'zgarishiga aloqasi yo'q
  (portal faqat «Avval tayyorlaning» oynasida). Kechagi 13381 B07 (darsning o'z qatlami) bilan bir sinf. `acu-overlay` 202 faylda — keyingi modullarda ham chiqishi mumkin.
  Tuzatilmadi (foydalanuvchi qarori: xatoni aniqlab aytaman).
- 13:49 CRM tekshiruvi 28/28 tugadi (`dump/tekshiruv-m2-1349.json`): 13 Deploy OGOH (xato 0). 2-Modulda XATO faqat 2 dars: 09 VsCode (B06, ma'lum) va 11 CssPractice (B07 nishon bayrami, yuqorida). Qolgan 12 dars OGOH.
  Serverlar (5398, 5399) va Chrome tab ochiq qoldirildi — 3-Modul buyrug'i uchun.

## 2026-11-11 14:01 — 3-Modul YOPILDI: 13/13 yangi versiyada; 4-Modul boshlandi

- Foydalanuvchi 13:58 «xa boshla» (3-Modul), 14:00 «avtomat 4 ga ham, aniqlikda, to'liq 3 ni bitirib o'tib ketaver» → 3 → 4, keyin to'xtab hisobot.
- 13:59 `__konveyer4(3-Modul, {modullar:[3]})`: **yuklandi 9** — 06 JsLoops, 07 JsFunctions, 08 PmLesson5, 09 PracticeLesson1, 10 PracticeLesson2,
  11 PeanStack, 12 PracticeLesson3, 13 PracticeLesson4, 14 PmLesson6 (5–21 s/dars, Active qoldi); 4 tasi allaqachon (01, 02, 04, 05). Xato 0.
- Mustaqil qayta tekshiruv (14:01): 3-Modul **26/26 qator Active + yangi fayl + bayt ✓** → shu zahoti 14:01 `__konveyer4(4-Modul, {modullar:[4]})`.
- 4-Modul (14:01–14:03): **yuklandi 12** — 01, 02, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13 (5–9 s/dars, Active qoldi, bayt ✓).
  **14 ReactBuildSite — konveyer TO'XTADI:** uz 16380 ✓; ru 16381 saqlash so'rovi 50 s dan keyin «js: Failed to fetch» (bitta urinish, qayta yuborilmagan).
  Tekshiruv (14:04, faqat o'qish): ru 16381 **Active, `14-ReactBuildSiteLesson-v7.jsx`, bayt yangi paket bilan ✓**, tartib 2 / ru — CRM saqlagan, javob
  bizga yetmagan (ulanish uzilgan). 5398/5399 va go.coddycamp.uz 14:04 da javob beradi. Zarar yo'q. Qolgan: **15 PmLesson10** (4-Modulning oxirgisi) —
  foydalanuvchi qarori kutilmoqda (xatoda to'xtash qoidasi).

## 2026-11-11 14:35 — 4-Modul YOPILDI: 14/14 yangi versiyada; 2–4-Modul 82/82 qator ✓

- Foydalanuvchi «xa davom et» → 14:33 konveyer qayta: 13 allaqachon, **15 PmLesson10 yuklandi** (8 s, uz+ru Active, bayt ✓).
- Mustaqil yakuniy tekshiruv (14:34): **2-M 28/28 · 3-M 26/26 · 4-M 28/28** qator Active + yangi fayl + bayt ✓.
- CRM tekshiruvi: 3-M «Браузер» 26/26 tugagan (`dump/tekshiruv-m3-1435.json`) — XATO faqat **13 PracticeLesson4 B07** «Mentor · подсказка»
  tugmasi ustida `.ach-pop-row`. Tashxis: nishon hisoblagichi bosilganda ochiladigan ro'yxat oynasi (`AchCounter`, `onMouseLeave` bilan yopiladi) —
  tekshiruv o'zi ochgan oyna keyingi tugmani yopgan; regressiya emas. Kichik haqiqiy kamchilik: sensorli ekranda mouseleave yo'q → oyna hisoblagich qayta
  bosilmaguncha ochiq qoladi (183 faylda shu shakl) — tuzatilmadi, KATTA_TOZALASH taklifi foydalanuvchiga.
  4-M «Браузер» 4/28 tugagan (navbat ~3 daq/fayl) — keyin yig'iladi (`__tekshiruvYig`).
- To'xtadi: 5-Modulga o'tilmadi (foydalanuvchi so'zi: 3 → 4, keyin hisobot).

## 2026-11-11 14:47 — 5–14-Modul avtomat zanjir (foydalanuvchi qarori)

- Foydalanuvchi: «5 dan 14 gacha avtomat davom et» · B07 bo'yicha Abdullohga — keyin, umumiy xabarda · 6-M 11 FullPipelineProject (paket faylida
  `github.com/…/badge.svg` hali bor → R04 rad etishi mumkin): «o'tkazib davom et» — faqat SAQLASHDA rad etilsa va ikkala qator eski faylda Active bo'lsa.
- `konveyer-v4.js` ga: `opt.otkaz` (yuqoridagi shart bilan) + `__zanjir4(R, modullar, {otkaz})` — har modul: konveyer → mustaqil qayta o'qish
  (holat + bayt; o'tkazilgan dars eski faylda Active) → muammo bo'lsa TO'XTAYDI. Holat: `dump/zanjir-holat.json`.
- 14:47 zanjir 5-Modulda TO'XTADI (zanjir tekshiruvi: 2/30). Sabab — BIZNING skript xatosi: `konveyer-v4.js` dagi `kv` IIFE yuklanganda bir marta olingan
  (o'sha payt 4-M qayta yurishining holati, i=14) → zanjir `window.__kv4` ni yangilasa ham konveyer i=14 dan boshladi → 5-Modulda faqat 15 PmLesson14 yuklandi.
  Tekshirildi (14:48): 15 PmLesson14 uz+ru Active, yangi, bayt ✓; 01–14 eski faylda Active (tegilmagan). Zarar yo'q.
  Tuzatish: har `__konveyer4` chaqiruvi yangi holatdan (i=0) boshlaydi; o'tganlar «allaqachon» bilan o'tkaziladi. Zanjir qayta ishga tushirildi (foydalanuvchi ruxsati: 5–14 avtomat).

## 2026-11-11 15:09 — 172 DARS CRM'DA YANGI VERSIYADA (344/344 qator ✓)

- Zanjir (qayta, 14:48–15:08, `dump/zanjir-holat.json`): 5-M 14 (+1 allaqachon) 30/30 · 6-M 14 28/28 · 7-M 12 24/24 · 8-M 14 28/28 · 9-M 12 24/24 ·
  10-M 11 22/22 · 11-M 16 32/32 · 12-M 12 24/24 · 13-M 12 24/24 · 14-M 13 26/26 (har modul: konveyer → holat + bayt qayta o'qish). O'tkazilgan dars YO'Q:
  **6-M 11 FullPipelineProject ham saqlandi** (R04 rad etmadi — CRM endi tashqi rasmni bloklamaydi ko'rinadi).
- Yakuniy mustaqil o'qish (15:09, `dump/yakuniy-holat-172.json`): **172 dars, 344/344 qator Active + yangi fayl**, muammo 0.
- CRM «Браузер» tekshiruvi ketma-ket (~3 daq/fayl) — 5–14-M 131 yangi fayl uchun soatlab davom etadi; natija keyin `__tekshiruvYig` bilan yig'iladi (bloklamaydi).
- Keyingi (foydalanuvchi so'zi bilan): `yuklangan.csv` to'ldirish → `muhrla … --server ab1bfa3` → commit → `savol-kalitlari.mjs --yoz` + prod `--yukla` (foydalanuvchi `!`) → 37-hujjat → v2 on.

## 2026-11-11 15:24 — muhr va savol kalitlari (foydalanuvchi: «1-qadamdan boshlab, aniq, halol, shoshilmasdan»)

- Mustaqil shell md5 audit (`konveyer/audit-v4.py`, CRM fayllari terminaldan yuklab olindi): **344/344 qator ✓** (md5 + nom + til + Active), 172/172 dars.
- `yuklash-20261111-prod/yuklangan.csv`: 172/172 `yuklandi=2026-11-11` (boshqa ustunlar o'zgarmagan; crm qatorlari, md5, fayl royxat-v4 bilan mos).
- `lms-farq muhrla … --kim claude-F-1105-03 --server ab1bfa3` → reestr 172 dars @ a9823949, server ab1bfa3; qayta `lms-farq`: **o'zgarmagan 172 · o'zgargan 0**. Commit `47590dc2`.
- Savol kalitlari: SAVOL_MATNLARI.json 10.11 10:18 dan; keyingi kontent commitlaridagi 6 dars (CssPractice, PmGrowthPitch, ApiPostman, PostgresCrud, MvpComplete, LiveDashboard)
  test matnlari brauzerda qayta yig'ildi — farq 0. `savol-kalitlari.mjs --yoz`: faqat `lesson_version` +1 (2565 qator), src/live o'zgarmagan. Commit `686f034c`.
  Prod'ga yuklash — foydalanuvchi `!` (kutilmoqda).
- 37-hujjat yangilandi: sana 11.11, 43 uchun rahmat, 172 dars (344 qator, md5), §6 B07 iltimosi (foydalanuvchi o'chirishi mumkin) + B06 ochiq savol. Yuborish — foydalanuvchi.
- 2026-11-11 15:27 — foydalanuvchi `!`: `savol-kalitlari.mjs --yukla https://dars-api.coddycamp.uz` → **«yuklandi: 2565 qator»** (kutilgani bilan bir xil). Keyingi: 37-hujjat Abdullohga (foydalanuvchi) → v2 on → birinchi dars kuzatuvi.

## 2026-11-12 17:43 (`date`) · 172 dars v+1 — paket `yuklash-20261112-prod` (commit f3b7495c, F-1112-01/02/03), 2-Moduldan boshlandi

- Oldin: smoke-lms ✓ · smoke-preview 172/172 · onFinished 344/344 · avto-yakun uz/ru 172/172 · esbuild 172/172 · import ro'yxati eski paket bilan bir xil · B06 (13 o'zgargan amaliyot darsi) 13/13 toza (eski paket ham 13/13). Prod server `8a7d42f3` (0018).
- royxat-v4.json `eski` = LMS_REESTR joriy fayl (F-1111-05 dagi 3 dars: v8/v7/v9). Serverlar 5398/5399 (YAKKA=yuklash-20261112-prod/yakka, md5 ✓).
- Foydalanuvchi: «tekshiruv toza bo'lsa sraze yuklashni boshlaymiz»; CRM'ga kirishni foydalanuvchi o'zi qildi (sessiya noutbuk o'chganda tugagan).
- **17:46 — 2-Modul ✅ 14/14** (konveyer-v4, to'xtash 0): mustaqil qayta o'qish 28/28 qator Active + yangi fayl (v7). CRM javobi «Опубликовано / сохранено с замечаниями» (ogohlantirishlar — bloklamaydi, 43-javob). 3-Modul — foydalanuvchi so'zi bilan.
- **2026-11-12 18:28 — 172 DARS ✅** · 3-M 26/26 · 4-M 28/28 · 5-M 30/30 · 6-M 28/28 · 7-M 24/24 · 8-M 28/28 · 9-M 24/24 · 10-M 22/22 · 11-M 32/32 · 12-M 24/24 · 13-M 24/24 · 14-M 26/26 (har modul mustaqil qayta o'qilgan). Yakuniy audit **344/344** (fayl + Active + bayt paket bilan bir xil).
  · Yo'ldagi muammo: asosiy tab (CRM bo'lim sahifasi, keyin robots.txt 404 ham) 3 marta o'zi qayta yuklandi — sabab yashirin iframe'dagi CRM sahifasi yuqori oynani qayta yuklashi. Zarar yo'q (chala saqlash yo'q, 12-M 05 «Failed to fetch» — saqlanmagan, v6 qolgan edi). Yechim: iframe `sandbox="allow-scripts allow-same-origin allow-forms"` (yuqori oynani navigatsiya qila olmaydi, alert yo'q) + neytral sahifa (go.coddycamp.uz/robots.txt) — shundan keyin uzilish 0.
  · **F-1112-05** (mening xatom): paket toza worktree'da yig'ilgan → build-lms `__LESSON_VERSION__` ni worktree'dagi commit qilingan reestrdan oldi (F-1111 seansining muhri commit'siz edi) → 3 dars ichki versiyasi fayl nomidan 1 past (js-functions v9/"v8", react-intro v8/"v7", react-build-site v10/"v9"). Tuzatish: `yuklash-20261112-prod-b` (asosiy reestr nusxasi bilan, 3 dars v10/v9/v11; farq faqat versiya satri) → 6 qator qayta yuklandi, bayt ✓, 344/344 Active qayta tekshirildi.
  · Muhr: 172 → f3b7495c, server 8a7d42f (katalog toza nusxadan, 183) · 3 → claude-F-1112-05. lms-farq: o'zgarmagan 172. Savol kalitlari `--yoz`: 2565 (faqat versiya + 3 ta F-1111-04 ru variant reviziyasi), practiceMeta o'zgarmagan.
  · Darslik: keyingi relizda paketni toza worktree'da yig'ishdan oldin asosiy reestrni u yerga nusxalash yoki commit qilish shart.
