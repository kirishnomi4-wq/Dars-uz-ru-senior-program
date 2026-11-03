# F-1102-01 — Demo Day oldidan PM darsi juda uzun (mentor fidbeki)

## 02.11.2026 11:36 · Tashxis + MD v3
- **Fidbek (mentor):** «Frontend-React pre demo day mavzusi juda cho'zilib ketibdi, 16 ta slayd. Demo Day'ga kerak bo'ladigan asosiy
  tushunchalarni berib, qolganini olib tashlash kerak. Bolalar pitch qilishga ulgurmayapti».
- **Dars:** m3-14 `src/3-Modull/PmLesson10.jsx` «Ishlayotgan saytingizni qanday ko'rsatasiz?» (LMS v6, 29.10).
- **Tashxis:** senariy vaqti 82 + 8 bufer = 90 daq — chiqishga vaqt rejalanmagan; senariyda «mikrofon/taymer YO'Q» (M1-D14 dan farq uchun)
  — bola sinf oldida chiqmaydi; 16 ekrandan 7 tasi Demo Day uchun shart emas (s2–s3 takror, s6–s7 Airbnb, s10 VS Code, s12, s14).
- **Foydalanuvchi qarori:** «olib tashlaymiz, haqiqiy darsga aylantiramiz, keraksizi kerak emas; boshqa darsda ham shu muammo bo'lsa navbat bilan».
- **Qilindi:** MD v3 — `15-PmLesson10-v3.md` (16 → 10 ekran, yangi s16 «Sahna»). `.jsx` ga tegilmagan.
- **Holat:** GATE M kutilmoqda.
- **Sinf-supurish (o'lchov):** Demo Day oldidan PM darslari — PmLesson3 10 · PmLesson6 11 · PmLesson10 16 · PmLesson14 16 → navbatdagi: PmLesson14 (m4-15).

## 02.11.2026 11:52 · GATE M tasdiqlandi → kod
- **Qaror:** foydalanuvchi «maqul, tasdiqlayman». Ochiq 3 savol tavsiya bo'yicha: har bolaga 2 daqiqa · kartochkalar chiqdi · Sahna podiumdan keyin.
- **Kod (`src/3-Modull/PmLesson10.jsx`, 3524 → ~3000 qator):** s2, s3, s6, s7, s10, s12, s14 va ularning CSS'i o'chirildi; yangi `ScreenSahna` (s16) —
  uch kadr kartasi (o'qish holati, «✎ Tahrirlash» → s8), tinglovchi kartasi, yakkada 2 daqiqalik taymer, mentorda katta taymer + «Ko'rsatganlar»
  (`MentorPracticeStats`), «Ko'rsatdim» → `sahna: -1` ishtirok-signali. RECAPS/Q_LABELS qayta indekslandi (3, 6); INLINE_KEYS; nishon 4 → 3
  (nishon to'ri 3 ustun); CodeStrike: 3 savol almashdi (✔ A/B/D saqlandi); yakun sarlavhasi va MentorNote; `onGo` prop (s8 ga qaytish).
- **Darvozalar:** gates 12/13 — esbuild · undef · jsx · keys · dark · til · tell · olchov · narrow · qolip · prompt ✓;
  🔴 emoji — 3 ta ESKI topilma (s4 · s8 · s9, o'zgartirilmagan ekranlar; HEAD da 5 ta edi, Sahna 4 ta limit ichida). `lint:jsx` 0 · `lint:til` 0 error ·
  ru-walk 10/10 TOZA. Suratlar: 1280 (10 ekran) · Sahna kadr bilan/bosilgan/bo'sh · 390 · ru 1366 — scratchpad.
- **Holat:** UNCOMMITTED. LMS'ga chiqarilmagan (v6 turibdi) — buyruq bilan G retsepti + CRM'da CodeStrike savollari (3 ta yangi).
- **Mentor rejimi** (proyektor taymeri) jonli sessiyasiz suratga olinmadi — jonli sinovda ko'riladi.
- **Navbatdagi (sinf-supurish):** m4-15 `PmLesson14` (16 ekran).

## 02.11.2026 · Foydalanuvchi qarori + navbatdagi dars
- **Qaror:** LMS'ga yuklash va Learn'dagi CodeStrike savollarini tahrirlash — **oxirida, hamma darslar bilan birga**. Hozir faqat darslar tuzatiladi.
- **m4-15 `src/4-Modull/PmLesson14.jsx`** — tashxis: m3-14 bilan bir qolip (16 ekran, 82 + 8 = 90 daq, «sahna-taymeri YO'Q»).
  MD v3: `16-PmLesson14-v3.md` (16 → 11 ekran: s3, s6–s7 Airbnb, s10 VS Code, s12, s14 chiqadi; s16 Sahna). GATE M kutilmoqda. `.jsx` ga tegilmagan.

## 02.11.2026 12:06 · m4-15 PmLesson14 — GATE M tasdiqlandi → kod
- **Qaror:** «Uch qaror — uch sabab» (s9) qoladi; MD tasdiqlandi.
- **Kod (`src/4-Modull/PmLesson14.jsx`, +174 / −608):** s3, s6–s7, s10, s12, s14 va CSS'i o'chdi (o'chirilgan ekranlarning o'lik qoidalari —
  oldindan bor bo'lgan VS Code/keys/kartochka qoldiqlari bilan birga); yangi `ScreenSahna` (s16) — m3-14 naqshi, ma'lumot `pm-m4d15-pitch.qavatlar`,
  tinglovchi savoli «texnik so'z ishlatdimi?»; RECAPS 4/7 · Q_LABELS · INLINE_KEYS (`sahna: -1`) · nishon 4 → 3 (to'r 3 ustun) · CodeStrike 3 savol
  (✔ A/C/D saqlandi) · yakun sarlavhasi «Uch gapingiz tayyor — Demo Day'da shuni aytasiz» · uy-vazifa MentorNote uz+ru · `onGo` prop.
- **Darvozalar:** gates 12/13 (emoji — 2 ta ESKI topilma s8/s9, HEAD da 4 ta edi) · `lint:jsx` 0 · `lint:til` 0 · ru-walk 11/11 TOZA ·
  suratlar 1280 (11 ekran) · Sahna gap bilan/bosilgan · 390 · ru 1366 — xatosiz.
- **m3-14 qo'shimcha:** `.lp-done-btn.is-done` o'lik qoidasi o'chirildi (tugma endi bosilgach yo'qoladi). Gates o'zgarmadi.
- **Holat:** UNCOMMITTED. LMS + CRM Learn (CodeStrike 6 savol: m3-14 dan 3, m4-15 dan 3) — oxirida birga.
- **Sinf-supurish yopildi:** Demo Day oldidan PM darslari — PmLesson3 (10) va PmLesson6 (11) da bu muammo yo'q (ekran soni kam). Qidirildi: 4 dars, tuzatildi: 2.

## 02.11.2026 · Qonunlashtirish
- Foydalanuvchi roziligi bilan `PM_DARS_ETALON.md` ga **113-qonun** yozildi: Demo Day oldidan PM darsi — repetitsiya (nazariya ~40 daq, «Sahna» ekrani podiumdan keyin, 2 daq taymer, Demo'da kerak bo'lmagan qatlam yo'q). `lint:prompt` toza.

## 02.11.2026 18:00 · Commit
- `c3e409fd` — PmLesson10 + PmLesson14 (kod), MD v3 ×2, jurnal, 113-qonun, senariy yozuvlari. Foydalanuvchi buyrug'i («commit qil»).
- Keyin `node scripts/codestrike-savollar.mjs --yoz` — ikki darsning CodeStrike JSON'lari (3+3 yangi savol, uz+ru) va `server/data/lesson-catalog.json` (nishon 4 → 3) qayta yig'ildi; seans shu yerda uzilgan (notebuk).

## 02.11.2026 18:27 · Yuklashga tayyorlov (foydalanuvchi: «yuklashdan oldin to'liq holatni aniq qilib, tayyor qilaylik, bir martaga yuklaymiz»)
- **Commit `5e44a3c2`** — CodeStrike JSON ×6 + ROYXAT + katalog (oldingi seansdan qolgan). `--tekshir` 172 bir xil · 0 farq.
- **FARQ** (`lms-farq`): 168 o'zgarmagan · **4 o'zgargan** — m3-14 v6→v7, m4-15 v6→v7 (bizniki) **+ m4a-03 v5→v6, m4a-04 v5→v6** (c9706d63, 31.10 — Swagger/`/api/v1` yo'li, F-1031-13; LMS'ga chiqmagan). Server: nishon o'zgargan 2 → **sync + deploy KERAK** (katalog soni 183 o'zgarmaydi).
- **Paket `yuklash-20261102-prod/`** (`--moduls 4-6 --majbur` — commit qilinmagan 16 fayl faqat `src/mentor-kurs/`, LMS darslariga aloqasiz): 4 dars, lint:jsx ✓, smoke-lms ✓, smoke-preview 4/4, **O'TDI**. CRM qatorlari (reestrdan): m3-14 uz 16382 / ru 16383 · m4-15 uz 16413 / ru 16412 · m4a-03 16419/16418 · m4a-04 16421/16420.
- **Learn savollari** — `learn-savollar/REJA.md` + 4 fayl: Learn **3198** (bo'lim 74) uz 10·11·12 / ru 22·23·24; Learn **3213** (bo'lim 75) uz 9·10·12 / ru 21·22·24 — jami 12 qator. Usul A (joyida tahrir, qid saqlanadi) / B (o'chirib bulk) — CRM tahrir oynasi ko'rilgach tanlanadi.
- **Ochiq (foydalanuvchi qarori):** (1) m4a-03/04 shu paketda ketadimi (tavsiya: ha); (2) server sync `bash scripts/sync-dars-api.sh main` + GitLab deploy ▶ (yuklashdan OLDIN); (3) Learn usuli A/B; (4) `feedback/F-1023-01-learn/{JURNAL,DAVOM}.md` 29.10 yozuvlari hali commit qilinmagan — muhr commit'iga qo'shiladi. Mentor-kurs (27 fayl) — alohida, bu yerga tegmaydi.

## 02.11.2026 19:48 · Server sync + prod deploy ✅ (foydalanuvchi: 1) m4a-03/04 paketda ketadi · 2) server avval · 3) Learn — joyida tahrir A)
- `sync-dars-api.sh main --check` darvoza OK (begona commit yo'q) → sync: GitLab main **`7c5e2ea`** (faqat `data/lesson-catalog.json`: m3-14 «Live Proof!» va m4-15 «On Screen!» nishonlari chiqdi, generated_at). Pipeline #3018079778 test ✓ build ✓.
- Deploy job (main — `when: manual`): Claude'ning bosishini auto-rejim klassifikatori «Production Deploy» deb rad etdi → foydalanuvchi o'zi «Run job» bosdi (GitLab'ga Chrome tabida o'zi kirdi). Job Passed.
- Health 19:47:35: prod **`0.1.0+7c5e2ea6`**, migrations 10, catalog 183, uptime 2 s. `muhrla` uchun `--server 7c5e2ea6`.
- Keyingi: 4 darsni CRM'ga yuklash (paket `yuklash-20261102-prod/`, 29.10 usuli — section sahifasida `editQuestion` + fayl lokal yordamchi serverdan), keyin Learn 3198/3213 da 12 savolni joyida tahrirlash.

## 02.11.2026 20:05 · CRM YUKLASH TUGADI — 4 dars / 8 qator ✅ + MUHR
- Ruxsat rejimi: auto-rejimda birinchi POST klassifikator tomonidan rad etildi (29.10 dagidek) → foydalanuvchi oddiy rejimga o'tdi («davom»), har yuborish tasdiq bilan.
- Usul 29.10 bilan bir xil: section sahifasida `editQuestion(qid)` → fayl lokal yordamchi serverdan (127.0.0.1:5399, faqat `yuklash-20261102-prod/yakka`) → `FormData(editForm, editSubmit)` → POST. Vositalar: `crm-yuklash-20261102/` (yordamchi-server.mjs, yukla-sahifa.js, dump/).
- OLDIN tekshiruv: 8 qator (sid 2461 · 2477 · 2763 · 2764) — qid, til, tur lesson-runner, Active, eski fayl nomi ro'yxat bilan mos; CRM'dagi eski fayllar md5 = 29.10 yuklangani (4/4). `dump/crm-oldin.json`.
- Yuklash: 16382/16383 → `15-PmLesson10-v7.jsx` · 16413/16412 → `15-PmLesson14-v7.jsx` · 16419/16418 → `03-NestArchResourceLesson-v6.jsx` · 16421/16420 → `04-NestArchPracticeLesson-v6.jsx`. Har biri POST 200, qatorda yangi nom; har fayl CRM'dan qaytarib yuklab olinib md5 = ROYXAT **8/8 ✓**.
- Mustaqil keshsiz qayta o'qish (`dump/crm-keyin.json`) vs oldin: tartib/til/tur/holat o'zgarmagan, qator soni o'zgarmagan, hash yangi, md5 8/8 ✓, xato 0. Paketdan tashqari qatorga tegilmagan.
- `yuklangan.csv` yuklandi = 2026-11-02 (4). **MUHR:** `lms-farq muhrla … --kim claude-F-1102-01 --server 7c5e2ea6` → MUHRLANDI 4 dars (reestr 172 dars; server 7c5e2ea6 / monorepo 5e44a3c2 / katalog 183). `LMS_DEPLOY_JURNAL.md` qatori 2026-11-02.
- Keyingi: Learn 3198 / 3213 — 12 savolni joyida tahrirlash (A usuli). Commit — buyruq bilan.

## 03.11.2026 11:28 · Learn savollari — kechagi uzilgan ishning tashxisi (keshsiz o'qish, saqlanmasdan)
- Kecha 20:27 da Learn **3198** ga joyida tahrir (A usuli) ketgan, jurnalga yetib kelmagan (seans uzilgan; `dump/learn-3198-natija.json` — 5 POST 200, « » farqi).
- **3198 hozir:** 6/6 qator (18616 · 18617 · 18618 · 18628 · 18629 · 18630) yangi savol — matn, 4 variant, izoh, to'g'ri javob `learn-12.json` bilan mos.
  **Nuqson:** « » qo'shtirnoqlari `'` bo'lib saqlangan — 4 joyda: 18617 variantlar (4), 18618 savol, 18629 variantlar (4), 18630 savol.
  28.10 bulk upload bilan kirgan eski savollarda (18609, 18621) « » butun — demak joyida tahrir yo'li (CRM yoki kechagi skript) « » ni `'` ga aylantirgan.
- **3213 hozir:** 6 savol eski (18975 · 18976 · 18978 · 18987 · 18988 · 18990), 18 boshqasi joyida, 24/24 Active. Almashadigan 6 savolning hammasida « » bor.
- Dalil: `dump/learn-keshsiz-20261103.json`. Foydalanuvchi qarori kutilmoqda: sinov-POST (18618 ni « » bilan qayta) → CRM saqlasa A usuli, saqlamasa « » li qatorlar B usuli (o'chirish foydalanuvchida, bulk upload Claude'da).

## 03.11.2026 11:50 · Sinov-POST + bulk quruq sinov (foydalanuvchi: «xa» — 1-qadam)
- **Sinov (A usuli, 18618):** FormData'da « » yuborildi (`yuborilgan.q` tekshirildi) → POST 200 → jadval va tahrir oynasida yana `'` (U+0027). **CRM'ning tahrir yo'li « » ni `'` ga aylantiradi** — kechagi skript aybdor emas. A usuli « » li matn uchun yaroqsiz.
- **Bulk «Tekshirish» (quruq, yozmaydi):** tur «Faqat savollar» · kurs 20 · modul 75 · Learn 3213 · uz · «Kurs savollari» · `3213-m4-15-uz.json` (3 savol, kanonik sha256 `72582fc2…` mos) → natija: Xato 3 — faqat «order_number=9/10/12 lesson_id=3213 da allaqachon mavjud»; savol soni/format e'tirozi YO'Q, «Yuklash» o'chiq qoldi. Demak 2–3 savolli fayl qabul qilinadi, qatorlar o'chirilgach to'siq qolmaydi. Sahifa: «Ma'lumotlar active statusida yaratiladi».
- **Tayyor fayllar** (`learn-savollar/`): `B-3198-uz-11-12.json` (2) · `B-3198-ru-23-24.json` (2) · `3213-m4-15-uz.json` (3) · `3213-m4-15-ru.json` (3). 18616 (uz 10) va 18628 (ru 22) — « » yo'q, A usuli bilan to'g'ri, tegilmaydi.
- **Keyingi:** foydalanuvchi 10 qatorni o'zi o'chiradi (3198: 18617 · 18618 · 18629 · 18630; 3213: 18975 · 18976 · 18978 · 18987 · 18988 · 18990) → Claude 4 bulk yuklash (har biri: tanlov + hash + «Tekshirish» Xato 0 + «N ta» → tasdiq) → keshsiz qayta o'qish.

## 03.11.2026 12:40 · LEARN SAVOLLARI TUGADI — 3198 + 3213, 12/12 ✅ (B usuli: foydalanuvchi arxivladi, Claude bulk yukladi)
- **CRM «o'chirish» = Archive** (qator yo'qolmaydi, holati Archive bo'ladi). Foydalanuvchi 10 qatorni arxivladi: 3198 — 18617 · 18618 · 18629 · 18630; 3213 — 18975 · 18976 · 18978 · 18987 · 18988 · 18990 (keshsiz tasdiqlandi, boshqa qatorga tegilmagan).
- Bulk «Tekshirish» arxiv qatorni band deb hisoblamaydi (3213 uz: Xato 0, «3 ta savol»).
- **4 bulk yuklash** (tur «Faqat savollar» · kurs 20 · «Kurs savollari» · Learn · til; har birida maydon JSON kanonik sha256 = fayl, «Tekshirish» Xato 0 + «N ta savol», tasdiq «N ta yozuv saqlanadi» → «Qo'shildi: N, Xato: 0»):
  3213 uz (modul 75) 3 → 21775 (9) · 21776 (10) · 21777 (12); 3213 ru 3 → 21778 (21) · 21779 (22) · 21780 (24);
  3198 uz (modul 74) 2 → 21781 (11) · 21782 (12); 3198 ru 2 → 21783 (23) · 21784 (24). Yangi savollar Active (sahifa: «active statusida yaratiladi»).
- Texnik topilma: tasdiq-oyna `position:fixed` — `offsetParent` bilan ko'rinmaydi (birinchi kutuvchi vaqt tugadi, yuklanmagan edi); 2-yuklashda tasdiq bosilgach oyna ochiq qolgan — yuklash bir marta bo'lgan (CRM: aynan 3 yangi qator), oyna `modal('hide')` bilan yopildi, qayta bosilmadi. Keyingi yuklashlar `__yukla3` (ko'rinish `getComputedStyle`, tugash sharti «Qo'shildi: N»).
- **Yakuniy keshsiz tekshiruv** (`dump/learn-yakuniy-20261103.json`, solishtiruv skript natijasi): 12 savol (tahrir oynasi — matn, 4 variant, izoh, to'g'ri javob) `learn-12.json` bilan 12/12 mos, « » 30/30 joyida; har Learn'da Active 24, tartib 1–12 uz + 13–24 ru, takror yo'q; tegilmagan 18+18 qator (qid/tartib/til/matn) kechagi/ertalabki holat bilan bir xil; Archive aynan 4 + 6. **Xato 0.**
- F-1102-01 LMS qismi to'liq yopildi: 4 dars (02.11) + Learn 12 savol (03.11). Commit — buyruq bilan (reestr, deploy-jurnal, F-1102 jurnal, learn-savollar/ B-fayllar, F-1023-01-learn 29.10 yozuvlari).
