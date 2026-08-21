# 4-MODULNI BOSHLASH — yangi seansga kirish matni

> Bu faylni yangi seansda **birinchi xabar** sifatida yuboring (yoki mazmunini nusxalang).
> Ish tugagach o'chirib yuborsangiz bo'ladi — u faqat topshirish-xati.

---

## 1. Qayerdamiz

**3-Modul yopildi va prodga chiqdi** (2026-08-20). 14 darsning hammasi:
`lint:til` 0🔴 · `lint:dark` 0 · `lint:jsx` 0 · esbuild toza · `SCREEN_META ↔ screens` mos ·
jonli relslar (`set_quiz_keys` · `useLiveSession` · `ccProgress` · podium) to'liq ·
UZ-RU parite 1:1 (har darsda `uz:` va `ru:` soni teng).

- Demo: **https://coddycamp-3modul.vercel.app** (loyiha `coddycamp-3modul`, scope `azizbek10`)
- Commitlar: `2144fdf` (3-Modul yopish) · `34473fa` (PmLesson10 RU) · `0c66e81` (dist-m3 ignore)
- `main` ga push qilingan, ish daraxti toza.

**Endi 4-Modul.** 3-Modulga qaytilmaydi (agar skrinshot-turda nuqson topilmasa).

---

## 2. Vazifa — 4-Modul, 17 dars

Katalog `src/App.jsx:217–233`. 15 tasi qurilgan, 16-si zaxira, 17-si Demo Day.

| # | Tur | Dars | Fayl (`src/4-Modull/`) |
|---|---|---|---|
| m4-01 | Kod | Ma'lumot nima | `DataIntroLesson.jsx` |
| m4-02 | PM | Ma'lumot ham mahsulot qarori | `PmLesson11.jsx` |
| m4-03 | Kod | SQL vs NoSQL — PostgreSQL | `DbSqlNosqlLesson.jsx` |
| m4-04 | Kod | Node.js — birinchi server | `NodeServerLesson.jsx` |
| m4-05 | Kod | Routing — Express / Nest | `RoutingLesson.jsx` |
| m4-06 | Kod | PostgreSQL so'rovlari | `PostgresCrudLesson.jsx` |
| m4-07 | PM | Xavfsizlik — foydalanuvchi ishonchi | `PmLesson12.jsx` |
| m4-08 | Proyekt | Praktika: Backend CRUD | `BackendCrudPracticeLesson.jsx` |
| m4-09 | Kod | API nima + Postman | `ApiPostmanLesson.jsx` |
| m4-10 | Proyekt | Praktika: React + Node ulash | `FullstackConnectPracticeLesson.jsx` |
| m4-11 | Kod | Autentifikatsiya va .env | `AuthEnvLesson.jsx` |
| m4-12 | PM | Ilova nimani yozib qoladi? | `PmLesson13.jsx` |
| m4-13 | Proyekt | Fullstack loyiha kuni | `FullstackProjectDayLesson.jsx` |
| m4-14 | Proyekt | Fikr bo'yicha yaxshilash | `FullstackFeedbackLesson.jsx` |
| m4-15 | PM | «Qanday ishlaydi?» deb so'rashsa | `PmLesson14.jsx` |

**4a · 4b · 4c modullari (`src/4a-Modull/`, `4b`, `4c`) — TEGILMAYDI.** Ular alohida
modullar, o'z navbatida keladi.

---

## 3. O'LCHANGAN holat (2026-08-20, taxmin emas)

| Darvoza | 4-Modul (15 fayl) |
|---|---|
| `lint:jsx` | **0** ✅ |
| `lint:til` | **54🔴 · 65🟡** — 15 faylning hammasida bor |
| `lint:dark` | **64 topilma** — 15 faylning hammasida (2–8 tadan) |
| RU tarjima | **11/15 tayyor**, 4 ta PM darsi **butunlay o'zbekcha**: `PmLesson11` (m4-02) · `PmLesson12` (m4-07) · `PmLesson13` (m4-12) · `PmLesson14` (m4-15) |

Har fayl ~3200–3800 qator.

**`lint:til` eng og'ir:** `NodeServerLesson` 10🔴 · `PostgresCrudLesson` 5🔴 ·
`RoutingLesson` 5🔴 · `ApiPostman` / `AuthEnv` / `DbSqlNosql` / `FullstackProjectDay` 4🔴.
**`lint:dark` eng og'ir:** `PostgresCrudLesson` 8 · `AuthEnvLesson` 6 ·
`FullstackConnectPracticeLesson` 6.

---

## 4. 🔴 VOSITA-NUQSONI — birinchi ish shu

`dark-lint.mjs` va `jsx-lint.mjs` **papkani qabul qilmaydi**, lekin xato ham bermaydi:

```
node dark-lint.mjs src/4-Modull        ->  "✓ TOZA"   ← YOLG'ON
node dark-lint.mjs src/4-Modull/*.jsx  ->  64 topilma ← HAQIQAT
```

Sabab: `files = args.length ? args : walk('src')` — papka `readFileSync` ga tushadi,
istisno `catch { continue }` bilan yutiladi. **Darvoza yolg'on gapiradi.**
`til-lint.mjs` da bu muammo yo'q (u papkani `walk` qiladi).

Tuzatish kichik: argument papka bo'lsa `walk` qilinsin. Buni birinchi qilib qo'ying,
aks holda «4-Modul toza» degan noto'g'ri xulosa chiqadi.

---

## 5. Ish tartibi (bu seansda ishlagan usul)

1. **Tashxis avval, yechim keyin.** Muammoni o'lchab AYT, yechim taklif qil,
   **[GATE]** — foydalanuvchi tasdig'isiz hech narsa o'zgartirilmaydi.
2. **Ro'yxatdan tashqari topilma — tuzatilmaydi, aytiladi.** Yo'l-yo'lakay topilgan
   nuqsonlar alohida ro'yxatga chiqariladi, ruxsat so'raladi.
3. **Har tahrirdan keyin darvozalar:** `esbuild` + `lint:jsx` + `lint:til` + `lint:dark`.
   `esbuild` faqat sintaksisni ko'radi — ma'no buzilishini `lint:jsx` tutadi.
4. **Umumiy faylga (`src/pm/…`, `src/lms/…`) tegish — ikki bosqichda:** avval unga kim
   ishora qilishini ro'yxatla, keyin tuzat, oxirida bog'liq kirish nuqtalarini qurib
   ko'rsat. Modul chegarasidan tashqaridagi faylga tegilmaydi.
5. **Topilma-sinfi qonunga muhrlanadi:** matn → `MATN_KORPUS.md` juftlik (❌→✅ + sabab
   + F-ID) · UX/dizayn → `DARS_ETALON.md` yangi raqamli qonun · takror bug → rol-fayli ·
   8+ faylga tegadigan ish → `KATTA_TOZALASH.md`.
6. **Jurnal:** `PIPELINE_STATE.md` (texnik) / `PM_PIPELINE_STATE.md` (PM) ga
   F-ID bilan raund-yozuv: nima topildi → nima qilindi → qayerga muhrlandi.
7. **Commit / deploy — FAQAT buyruq bilan.**

---

## 6. Yaqinda qo'shilgan qonunlar (4-Modulda ham amal qiladi)

- **`DARS_ETALON` 132-qonun** — holat-modifikatori (`.ready`/`.on`/`.active`/`.is-*`)
  fonni almashtirsa, **matn rangi ham beriladi**. Kontur uslubidagi tugmada aks holda
  accent-ustida-accent qoladi va yozuv ko'rinmaydi. Darvoza: `dark-lint` 1c-naqsh (`◐`).
- **`DARS_ETALON` 130-qonun** — `position: fixed` qatlam sahifa sarlavhasini bosmasin.
- **`DARS_ETALON` 131-qonun** — «TEGMA» mexanikani himoya qiladi, bezakni emas.
- **`til-lint` 88-qoida `daftar-referenti`** — o'quvchining daftariga ishora qilinmaydi
  («daftaringiz/daftaringda»). «daftar» so'zining o'zi (metafora, vidjet nomi) mumkin.
  → `MATN_KORPUS` §155.
- **F-29 to'plami** — ichkaridagi harakat-tugmasi accent fon + oq matn. Odatda har darsda
  4 ta: `.btn` · `.lp-done-btn` · `.mstats-reveal` · `.rc-btn`. PM darslarida accent
  **binafsha `#5B3DE6`**, texnik darslarda **to'q sariq `#FF4F28`**.
- **`data-dark-ok="sabab"`** — ataylab quyuq yuza (kod oynasi kabi) shu atribut bilan
  belgilanadi, detektor uni o'tkazadi. Hex-oq ro'yxatga qo'shish XATO.

---

## 7. 4-Modulga tegishli ochiq bandlar (`KATTA_TOZALASH.md`)

- **1-band** — `lint:dark` F-29: 3-Modul yopildi, navbat **4 · 4a · 4b · 4c · 5 · 6** da.
- **11-band** — «daftaringiz» 6 faylda (M5/M6/M7), 4-Modulda yo'q.
- **2-band** — umumiy `theme` fayli (122 faylda `T` takrorlangan) — hali yechilmagan,
  4-Modulda ham har dars o'z palitrasini qayta yozadi.
- **9-band** — GameCard Variant D: 3-Modul yopildi, qolgan modullar ko'rilmagan.
- **10-band** — RU tomonida «Вы»/«вы» — butun-kurs konvensiya savoli, **qaror kutilmoqda**,
  hozircha hech qayerda tegilmaydi.

---

## 8. Yo'q narsalar (o'ylab topilmasin)

- **`AUDIT_PROMPT.md` repo'da YO'Q**, garchi `CLAUDE.md` unga ishora qilsa ham.
  Audit `.claude/agents/role/darslik-auditor.md` formati bo'yicha yurgiziladi.
  Foydalanuvchi matnini yuborsa — o'shanda yaratiladi.
- 4-Modulning alohida demo-URLi yo'q. `modul34.html` + `vite.m34.config.js` M3+M4 ni
  birga ko'rsatadi; 3-Modul demosi esa `M34DemoApp` ni `only={['m3']}` bilan chaqiradi.

---

## 9. Boshlash uchun tavsiya

1. `dark-lint`/`jsx-lint` papka-nuqsonini tuzat (4-bo'lim) — darvoza rost gapirsin.
2. Bitta darsdan boshla (masalan **m4-01 `DataIntroLesson`** — modul kirishi, 3🔴 til / 4 dark).
   To'liq audit → GAP-hisobot → **[GATE]** → tuzatish → darvozalar → jurnal.
3. Modul ohangi bir xil bo'lishi uchun birinchi dars **etalon** qilib yopiladi,
   qolganlari o'shanga tortiladi (3-Modulda shunday ishladik).
4. **4 ta PM darsining RU tarjimasi** (m4-02 · m4-07 · m4-12 · m4-15) — alohida kun,
   to'rttasi birga, mexanizm `RU_I18N_SPEC.md`. Dizayn sikliga aralashtirilmaydi.

---

## 10. Nusxalanadigan birinchi xabar

> 4-Modulni boshlaymiz. `4-MODUL_BOSHLASH.md` ni o'qi va holatni o'zing qayta o'lcha
> (raqamlarga ishonma — tekshir). Birinchi ish: `dark-lint.mjs`/`jsx-lint.mjs` ning
> papka-nuqsoni. Keyin m4-01 `DataIntroLesson` ni to'liq audit qilib, GAP-hisobot ber —
> tasdig'imsiz hech narsa o'zgartirma.
