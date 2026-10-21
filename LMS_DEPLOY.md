# LMS DEPLOY — qisman yuklash mexanizmi (F-1019-13, 19.10.2026)

**Muammo:** fidbeklar doim tushadi, darslar tuzatiladi, lekin LMS'ga 172 darsni har safar qayta yuklab bo'lmaydi.
**Yechim:** oxirgi yuklangan holat reestrda; «nima o'zgardi» — yig'ilgan faylning md5'i bilan aniqlanadi (yig'ma deterministik); faqat o'zgargan darslar paketlanadi.

| Fayl | Tur | Nima |
|---|---|---|
| `LMS_REESTR.json` | HOLAT | har darsning LMS'dagi versiyasi (-vN), md5, commit, yuklangan sana, CRM bo'lim/material id; server holati; `chetda`, `crm_tashqari`. **Faqat skript yozadi.** |
| `LMS_DEPLOY_JURNAL.md` | HOLAT | har yuklash — bir qator (muhrla yozadi) |
| `scripts/lms-farq.mjs` | VOSITA | `farq` · `paket` · `muhrla` |
| `YUKLASH_PROTOKOLI.md` | JARAYON | yuklovchi Claude seansi uchun doimiy ko'rsatma |
| `scripts/preview-reliz.mjs` | VOSITA | TO'LIQ reliz (hamma dars) — umumiy modul o'zgarganda yoki birinchi yuklashda |

## Oqim (odatiy: 5 dars ≈ 15 daqiqa)
1. Fidbek → tuzatish (retsept B) → `npm run gates` → **commit** (paket commit'siz ishlamaydi; reestr commit'ga bog'lanadi).
2. `node scripts/lms-farq.mjs` — FARQ (≈10 s): o'zgargan / yangi / id o'zgargan / ketgan darslar; sabab (dars fayli · umumiy modul); **server kerakmi** (katalog: yangi id, nom, nishon).
3. `node scripts/lms-farq.mjs paket --out yuklash-<sana>-prod` — faqat o'zgargan darslar, versiya +1 (`09-VsCodeLesson-v4.jsx`), har modulda `ROYXAT.md` (CRM bo'lim id, eski → yangi fayl, md5), `README.md` (server sharti, tartib), `yuklangan.csv`; `lint:jsx` + smoke-lms + smoke-preview faqat shu darslarga; `HISOBOT.md`.
4. Server kerak bo'lsa (README «AVVAL SHART»): foydalanuvchi `! bash scripts/sync-dars-api.sh main` → GitLab deploy job ▶ → health `catalog` soni. **Yuklashdan OLDIN.**
5. Yuklovchi Claude seansiga: paket papkasi + `YUKLASH_PROTOKOLI.md`. U yuklaydi, md5 tekshiradi, `yuklangan.csv` ni to'ldiradi.
6. `node scripts/lms-farq.mjs muhrla yuklash-<sana>-prod/yuklangan.csv --kim <seans> [--server <gitlab-sha>]` — reestr + jurnal. `--server` health versiyasini tekshiradi.
7. Commit (`LMS_REESTR.json`, `LMS_DEPLOY_JURNAL.md`) — foydalanuvchi buyrug'i bilan.

## Qoidalar
- **lesson_id o'zgarmaydi** (tuzilma o'zgarsa ham — progress tizimi `total` farqini o'zi ko'taradi). O'zgarsa — skript `#` bilan ogohlantiradi: eski id serverda nofaol, o'quvchi progressi yo'qoladi; server deploy'dan keyin BIRINCHI yuklanadi.
- **Versiya har darsga alohida** — CRM'dagi nom necha marta yangilanganini ko'rsatadi; o'zgarmagan dars v3 ligicha qoladi.
- **Umumiy modul** (`src/live`, `src/qolip`, `src/compilator`, build-lms) o'zgarsa — hamma dars o'zgaradi → to'liq reliz (`preview-reliz`), skript buni ochiq aytadi.
- **Qaytarish:** yig'ma deterministik — reestrdagi oldingi `commit` dan dars qayta yig'iladi (`git worktree` yoki `git show`), eski paket papkalari o'chirilmaydi.
- **Parallel seanslar** reestrga tegmaydi; nima o'zgarganini md5 topadi — jurnal yozuviga ishonilmaydi.
- QA Vercel saytlari (`feedback/F-1015-7-14M/vositalar/deploy-qa.sh`) — alohida oqim, LMS emas.
