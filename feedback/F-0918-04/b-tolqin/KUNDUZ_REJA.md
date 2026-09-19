# KUNDUZ REJA — 19.09 (shanba) · foydalanuvchi kechqurun keladi

> Foydalanuvchi 06:15: «ishlayver, ishingni to'liq tugatgach bitta md da savollaring va holatimizni saqla; kechqurun
> hammasiga javob beraman; har 20 daqiqada aniqlab davom ettir». Taymer: har :07 :27 :47.
> Qoida: tasdiq talab qiladigan hech narsa qilinmaydi (o'quvchi matni, push, deploy, CRM) — `SAVOLLAR_VA_HOLAT.md` ga savol.

## Ertalab bajarilgan (commitlar)

| Nima | Commit |
|---|---|
| Q1 solo teshigi — 97 dars ildiziga blok; brauzerda 63/63 ekran isbotlandi (`ach-probe --solo`) | `9cdf279` · isbot `c0e51d5` |
| Q3 a/c/e + Q5 (PmLesson15 qulf, o'lik earn 4) | `193632a` |
| M2 (Command Spotter) · M3 (fullHouse, uz + ru) | `df11830` |
| Q4 — 7 diskret test, Routing s15, NestArch F5 | `c0e51d5` |

## Bandlar

| # | Band | Holat |
|---|---|---|
| K1 | **Adversarial tekshiruv** — bugungi o'zgarishlar (solo-blok 97 dars · Q3/Q4/Q5/M2/M3): probdan o'tib ketadigan nuqsonlar | 🔄 06:19 — agent ishlayapti |
| K2 | **LMS yig'ma tayyorgarligi** — `lms/` va `lms-staging/` qanday yig'iladi (skript, manzil, md5, CRM ro'yxati); staging'da haqiqiy solo sinovi uchun nima kerak — faqat o'rganish va yo'riqnoma (yig'ish — matnlar tasdig'idan keyin) | ✅ 06:20 — `build-lms` (`DARS_API_URL`, `LMS_OUT_DIR`); staging-yig'ma: `staging-sinov/AgentArchitectureLesson.jsx` (md5 93b22a27…, smoke-lms ✓); `lms/` ga tegilmadi |
| K3 | **Hujjatlar** — 151/152-qonun (solo qoidasi, test-ekran bali, ertalabgi qarorlar), KATTA §41, jurnal, DAVOM, xotira | 🔄 06:21 — 153-qonun (ball halolligi) + KATTA §41 yozildi; jurnal/DAVOM/xotira — K5 bilan |
| K4 | **Yakuniy regress** — hamma prob (oddiy + `--solo`), `--seal` CRM uz+ru, gates, lintcmp (`BASE=655cd93`), lint-keys, unit, server, vite build | ⬜ |
| K5 | **`SAVOLLAR_VA_HOLAT.md`** — bitta faylda: holat + hamma savollar (kechqurun javob uchun) | ⬜ |
