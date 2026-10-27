# F-1027-01 — Kodda aralash til (m3-02 «User Story», ruscha rejim)

Rasm: `F-1027-01-userstory-ru-koding.png` (foydalanuvchi, 27.10).

| Vaqt | Nima |
|---|---|
| 27.10 11:28 | Fidbek: ru rejimda `function hikoyaYasa(kim, nima, natija)` + `// Шаблон истории…` — «3–4 xil til». Tashxis va 3 variant aytildi (A — nom inglizcha, B — ruscha translit, C — o'zbekcha + ruscha izoh). |
| 27.10 ~11:30 | Foydalanuvchi: «tavsiyang maqul» → A. Nom `makeStory(who, what, result)`. Faqat m3-02 hozir, qolgani KATTA. |
| 27.10 11:35 | Kod: `src/pm/PmUserStoryLesson.jsx` — 12 joy (starter uz/ru, hint c2/c3, fayl nomi, probe, brief, mentor, vizual + izoh-qator + CSS). Probe: `(typeof makeStory==="function"?makeStory:hikoyaYasa)(…)` — eski saqlangan kod ham o'tadi. Tekshiruv-sinovi 7/7 (starter uz/ru ✗✗✗, yangi ✓✓✓, eski ✓✓✓, ru qolip ✓✓✓, buzuq qolip ✓✗✗, 1 log ✓✓✗). |
| 27.10 11:37 | `npm run gates` 11/13: `tell` 2 va `emoji` 7 — tahrirdan oldingi nusxada ham aynan shu (eski qarz, tegilmadi). Skrinshot s11 uz/ru + kompilyator ichi uz/ru — 2 til, xato yo'q. |
| 27.10 11:42 | Muhr: PM 112 · DARS 11.12 izoh · RU §9 tuzatma · 2 tekshiruvchi ov-bandi · KATTA «F-1027-01» (57 dars, `supurish-2026-10-27.txt`, detektor `kod-nom-supur.mjs`). |
| 27.10 ~11:50 | Foydalanuvchi: «barcha darslarni tekshirda shtobe qolib ketmasin» + baza nomlari «Ha, hammasi». Ikki commit (24.10 muhri `ebc24bf4`, m3-02 `0b85444e`); m3-02 paketi `yuklash-2026-10-27-prod` O'TDI (bu reliz bilan almashadi). |
| 27.10 12:00–13:15 | `kodnom.mjs` (scan/decl/apply) + `fayl-hisobot.mjs` + `pmkod.mjs` + `sinov.mjs`. 59 dars tuzatildi (ro'yxat — KATTA «F-1027-01»), uyga vazifa 2-10/3-6/3-11/3-12. Repo topildi: o'quvchi loyiha repolari o'zbekcha nomlarda (`repo-nomlar.txt`) → 22 dars repolar bilan birga, qaror foydalanuvchida. Yakuniy qoldiq: `qoldiq-2026-10-27.txt`. |

**2026-10-27 15:43 · CRM'ga yuklandi (bosh seans yuklovchi sifatida, foydalanuvchi o'zi kirdi).**
- Yuklashdan oldin: CRM'dagi 118 eski fayl md5 = reestr (118/118), fayl nomi va til ROYXAT bilan mos, hammasi Active.
- Usul: yashirin fayl maydoni → editQuestion(id) → forma har safar qayta qidiriladi → faqat JSX fayl almashtiriladi → bo'lim sahifasiga POST.
- Natija: 59 dars / 118 qator almashtirildi; har qatorda CRM'dagi fayl yuklab olinib md5 = paket (118/118).
  Yakuniy qayta o'qish: 118/118 qatorda yangi fayl, sarlavha/tartib/til/holat o'zgarmagan, boshqa qatorlarga tegilmagan.
- Tuzoq: 14122 sarlavhasi CRM'da oldidan tab belgisi bilan saqlangan — tekshiruv endi butun qatorni solishtiradi (faqat fayl nomi farq qilishi mumkin).
- Uyga vazifa 4/4: 2-10 joyida tahrir (16449/16450); 3-6, 3-11, 3-12 — yangi bandlar 17629–17634 Active, starter kod 6/6 va rasm 4/4 mos.
  Eski 6 band (17333/17334, 17349/17350, 17351/17352) — uyga-vazifa-v2/lms/OCHIRILADI.md, foydalanuvchi o'chiradi. Ungacha o'quvchi ikkala vazifani ko'radi.
- yuklangan.csv: yuklandi = 2026-10-27 (59/59). Muhr nusxada sinaldi (59 dars, server f05bc084) — asl muhr foydalanuvchi ruxsatini kutmoqda. Commit/push yo'q.

## 2026-10-27 16:41 · Muhr (foydalanuvchi ruxsati bilan)
- `node scripts/lms-farq.mjs muhrla yuklash-2026-10-27-prod/yuklangan.csv --kim claude-F-1027-01 --server f05bc084` → MUHRLANDI: 59 dars, reestr 172 dars, server f05bc084.
- Natija quruq-yurish (nusxa) bilan bir xil. LMS_DEPLOY_JURNAL.md ga 1 qator (commit ea88d096).
- Commit/push qilinmadi. 6 eski kompilyator bandi (17333/34, 17349/50, 17351/52) foydalanuvchi o'chirishini kutmoqda.
