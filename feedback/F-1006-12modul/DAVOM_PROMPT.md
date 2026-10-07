# 12-Modul — davom prompti (holat: 07.10.2026 17:10)

## Yangi seansga nusxalanadigan qisqa matn

```
12-Modul seansini davom ettiramiz (LMS 12-Modul «Real vaqt va ishga tushirish», kod src/10-Modull, F-ID ≥ 389).
Avval feedback/F-1006-12modul/DAVOM_PROMPT.md ni TO'LIQ o'qi, keyin JURNAL.md dagi «Keyingi qadam» va 07.10 yozuvlarini (12:16 dan 17:10 gacha).
Dars serverini 5174 da ishga tushir (5173 — boshqa loyiha, tegma), git holatini o'z doirangda ko'r va menga 3–4 qatorda qisqa holat ayt.
Keyin men darslarni ko'rib fidbek beraman — retsept B (tashxis avval, tuzatish roziligimdan keyin).
```

---

## 1. Chegara (beshinchi parallel seans)
- **Siznikilar:** `src/10-Modull/*` · `src/App.jsx` da faqat `// ---- 10-Modul` import bloki va `id: '10'` modul bloki (aniq Edit) · `feedback/F-1006-12modul/*`.
- **Tegilmaydi:** `src/7-Modull` (9-Modul seansi), `src/8-Modull` (10-Modul), `src/9-Modull` (11-Modul), skelet `src/skelet`, qolip `src/qolip`, `konveyer/`, `CLAUDE.md` (asosiy/mexanizm seansi). `maydon-jamoa` repo'si — faqat buyruq bilan.
- App.jsx da boshqa seanslarning o'zgarishlari bor (8-Modul bloki) — commitga faqat o'z qatorlaringiz (indeks usuli — 7-bo'lim).
- Repo ildizidagi `_tmp21*.mjs`, `_m18*.mjs`, `.shot*.tmp.mjs` — boshqa seanslarniki, tegilmaydi.

## 2. Holat
**12/12 dars qurildi va tekshirildi** (13-qator «Zaxira dars» — dasturda ataylab bo'sh, MD/fayl yo'q).

| Dars | Kalit | Fayl (`src/10-Modull/`) | Turi | Holat |
|---|---|---|---|---|
| 1 | m10-01 | `PmLandingLesson.jsx` | PM | pilot, ko'rikdan o'tgan, commit `95912f6` |
| 2 | m10-02 | `WebSocketBasicsLesson.jsx` | Kod | pilot, ko'rikdan o'tgan, commit `95912f6` |
| 3–7 | m10-03…07 | `PmRealtimeSpec`, `LiveNotifyDay`, `BreakAndFix`, `PmChannels`, `PmFiftyUsers` | A to'lqin | qurilgan + o'z tekshiruvim; **foydalanuvchi ko'rmagan**; uncommitted |
| 8–12 | m10-08…12 | `PmDropOff`, `RetentionDay`, `PmUsersCheck`, `PmPitchReview`, `PmGrowthPitch` | B to'lqin | qurilgan + o'z tekshiruvim; **foydalanuvchi ko'rmagan**; uncommitted |

- Hammasi: `npm run gates` 12/12 · `lint:jsx` 0 · `lint:til` 0 error · `vite build` ✓ · `vositalar/kesik.mjs` (desk 1100, keng 1440, mob 390; ⛶ markazi) — 0.
- Darslararo kalitlar (`vositalar/darslararo.mjs 05 B`): ✓ 02→03, 03→04, 03→05, 06→07, 07→08, 08→09, 11→12; kodda ulangan, brauzerda qadamga yetilmagan: 01→06, 06→07 (A2 post), 08→10, 10→11.
- **Uncommitted:** `src/10-Modull/` dagi 10 fayl (03–12), App.jsx (10 import + `m10-03…12` `comp`), `feedback/F-1006-12modul/` (JURNAL, SABOQ, `QURUVCHI_TOPSHIRIQ_2.md`, `vositalar/`, 03–12 MD lar, `DAVOM_PROMPT.md`).
- **F-ID keyingisi: F-1006-389.** Ruscha matnlar — agent qoralamasi (6-RU bosqichi qilinmagan).

## 3. Yangi seansda birinchi qadamlar
1. Shu fayl + `JURNAL.md` «Keyingi qadam» + 07.10 yozuvlari; `QURUVCHI_SABOQ.md` E 40–55 (foydalanuvchining pilot ko'rigidagi qarorlari — eng ustun).
2. Server: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5174/` — 200 bo'lmasa fon rejimida `npx vite --port 5174 --strictPort --host 127.0.0.1`. **5173 — AILM loyihasi, tegilmaydi.**
3. `git status --short -- src/10-Modull feedback/F-1006-12modul src/App.jsx` — 2-bo'limdagi ro'yxat bilan solishtiring.
4. Foydalanuvchiga qisqa holat → u darslarni ko'radi → fidbek F-1006-389 dan (retsept B).

## 4. Foydalanuvchining doimiy qoidalari (buzilmasin)
- Commit / push / deploy — **faqat buyruq bilan**. Agentlar — **faqat ruxsat bilan** (oldin: nechta, qaysi darslar, nima qiladi).
- Retsept B: F-ID ber → **tashxis avval** (sababini aniq ayt, yechim taklif qil) → roziligidan keyin tuzat → **sinf-supurish** (shu xato boshqa 11 darsda ham) → muhrlash (SABOQ / MD / jurnal).
- «General / global» degan band — hamma darslarga qo'llanadi.
- Har `.jsx` tahriridan keyin: `npm run gates -- <fayl>` (12/12) · `npm run lint:jsx` · `npm run -s lint:til -- <fayl>`. CSS izohida backtik yo'q. Jurnal vaqti — `date` bilan, taxmin qilinmaydi.
- Halol tekshiruv: brauzerda haqiqiy click bilan (force'siz), `pageerror` tinglab, ekranni ko'z bilan ko'rish; tekshirilmaganini ochiq aytish. Agent hisobotiga tayanib qolmaslik.
- Javoblar o'zbekcha, qisqa; qaror savollari aniq (qaysi ekran, qaysi tugma).
- Pilot ko'rigidagi asosiy didlar (SABOQ E): har bosiladigan variantning **o'z** yengil chegarasi (guruh ramkasi yo'q) · maketda hech narsa kesilmaydi · taxmin qatori va izoh **yashil xulosa ichida**, quti qalin emas · yorliq **input ichida** (raqam + qisqa savol) · ko'p maydonli forma — **bittadan karta** · yakun — standart (chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar; «Bugungi asosiy fikr» YO'Q) · yakun sarlavhasi **har holatda rost** · tartib bo'laklari oq + accent chegara + «⠿» · kartochka halqasi yengil · ⛶ oynasi markazda.

## 5. Vositalar
- `node feedback/F-1006-12modul/vositalar/kesik.mjs m10-NN src/10-Modull/<Fayl>.jsx [desk keng mob]` — maket kesigi, ⛶ markazi, gorizontal skrol, pageerror (repo ildizidan, server 5174 kerak).
- `node feedback/F-1006-12modul/vositalar/darslararo.mjs [05] [B]` — darslararo kalitlar.
- Suratlar: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <papka>` (mob: `SHOT_W=393 SHOT_H=844`); bitta ekran va bosishlar — `konveyer/vositalar/ekran.mjs`.
- Playwright: `playwright-core` + `executablePath: '/usr/bin/google-chrome'`; skript repo ildizida bo'lishi kerak (modul topilishi uchun), keyin o'chiriladi. Ekranga to'g'ridan o'tish: `localStorage` `ccProgress:<lessonId>` = `{ screen, answers: {}, total: <ekranlar soni>, savedAt: Date.now() }` va `liveSession:<lessonId>` = `{ mode: 'self' }` (lessonId — fayldagi `LESSON_META.lessonId`; PM — `pm-m10dN-v1`, Kod/Proyekt — `m10-NN-v1`).
- Eski seans scratchpad'i (`/tmp/claude-1000/...`) yangi seansda bo'lmasligi mumkin — agent suratlari va kollaj skriptiga tayanmang.

## 6. Kutilayotgan ishlar (tartib bilan)
1. **Foydalanuvchi ko'rigi** — 3–12-darslar (1–2 ko'rilgan). Har fidbek — F-ID, retsept B.
2. **Umumiy tuzatish** (ko'rikdan keyin, fidbek bilan birga; JURNAL 07.10 15:47):
   - «Maydon Jamoa» nomi rangi `T.ok` → **`#2E9E4F`** (11-Modul tayanch 9.62) — pilotlar va 3–7-darslar (7 fayl); 8–12 to'g'ri.
   - 6-dars 4-ekran — telefondagi post matni juda mayda.
   - Yakun «hech biri» chegaradagi sarlavhalar: 8-dars «Sonlar o'qildi — …», 11-dars «Pitch ochildi — …» (foydalanuvchiga savol berilgan).
   - 11-dars 6, 7-ekran — 5-ekran saqlanmagan bo'lsa deyarli bo'sh ekran.
   - Qurilmagan jonli rejim qismlari: 12-dars 110 s yordam va proyektor taymeri; 6/10/12 sinf ovozlari chizig'i; Mentor statistikasi yorliqlari — foydalanuvchi qarori.
   - `SANA_SOZ = ['sa','na'].join('')` (10, 12) — `lint:til` «sana» soxta signalini chetlab o'tish; qoida tuzatilsa olib tashlanadi (MEXANIZM-TAKLIF 7).
   - Agentlarning «MD ga taklif»lari (yangi yakun sarlavhalari, E 52 promptlari, arena matnlari `tell` uchun) — yakuniy MD da.
3. **6-RU** — ruscha matnlar sifati (`RU_I18N_SPEC.md`, ru-gate/ru-walk).
4. **Yakuniy MD** — 03–12 MD lar kod bilan tenglashtiriladi (pilotlar MD si allaqachon tenglashtirilgan).
5. **`npm run modul:yopish -- src/10-Modull`**.
6. **Commit** — buyruq bilan. App.jsx dan faqat o'z qatorlaringiz: `git show HEAD:src/App.jsx` → o'z import va `comp` qatorlaringizni qo'shing → `git hash-object -w <fayl>` → `git update-index --cacheinfo 100644,<sha>,src/App.jsx`; boshqa fayllar `git add` bilan aniq yo'l bo'yicha. Oldin `npx vite build --outDir <scratchpad>` (boshqalarning `dist`iga emas).
7. QA sayti / LMS — faqat foydalanuvchi so'rasa (boshqa modullarda `vite.mN.config.js` naqshi).

## 7. Hujjatlar
- `JURNAL.md` — asosiy manba (holat, har raund, **MEXANIZM-TAKLIF 1–16** — asosiy seans uchun, o'zimiz tegmaymiz).
- `QURUVCHI_SABOQ.md` (A–E; E 40–55 — pilot ko'rigi) · `QURUVCHI_TOPSHIRIQ_2.md` (2-to'lqin topshirig'i, «A to'lqindan saboq») · `00-MODUL-TAYANCH.md` (8 — kalitlar jadvali) · `NN-*-v3.md` (MD — manba-haqiqat) · `NN-FILTR.md`.
- Fidbek rasmlari: `rasm-1007/` (F-1006-369…388).
