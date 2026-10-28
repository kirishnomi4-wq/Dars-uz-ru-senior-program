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

## 2026-10-27 17:12 · RU satr-qiymatlar — 1-bosqich: umumiy kompilyator (foydalanuvchi «ha, boshla»)
- `src/compilator/HtmlCompiler.jsx`: runtime tekshiruvlar (logs · logsEach · evalEquals · domAfterClick · toggle) kutilgan qiymatni `{ uz, ru }` ham qabul qiladi. uz rejim — faqat uz; ru rejim — ru, keyin uz (eski saqlangan kod o'tadi). Bosish bir marta, variantlar shu o'qishga solishtiriladi. Satr berilsa — o'zgarishsiz. Avto-label ham ikki tilli.
- Ishoralar: 47 dars import qiladi — hammasi esbuild ✓. Darvozalar 12/13: emoji — eski qarz (HEAD ham 1 error). lint:jsx toza. NUL bayt 2 ta saqlandi.
- Chrome sinovi (eski HEAD vs yangi, iframe harness): satrli tekshiruv 24/24 bir xil; ikki tilli — uz/ru/aralash/yarim/bo'sh holatlar kutilgandek. Eski kompilyator ikki tilli qiymatni o'qiy olmaydi → 2-bosqich darslari shu fayl bilan birga yuklanadi.
- Asl nusxa: scratchpad HtmlCompiler.oldin.jsx. Commit yo'q.

## 2026-10-27 17:27 · RU satr-qiymatlar — 2-bosqich: darslar (jadval tasdiqlandi)
- PracticeLesson1: Kunduz/Tun → День/Ночь, «Ism kiriting» → «Введите имя», «Yuborish» → «Отправить»; yordam-kodi alert ru; kartochka izohi; 6 starter {uz,ru}. Eslatma: TASK_LIKE/TASK_TOGGLE ishlatilmaydi, TASK_FORM faqat zaxira yo'lida (F-1015-332 dan beri dars-ichi mashq yo'q).
- JsConditions: «Вы получили штраф» · «Штрафа нет» · «Предупреждение» · «Большой штраф» (+ brief/label/hint), 3 starter {uz,ru}. «Salom/Hello» qoldi (lang=="uz" ma'nosi).
- JsFunctions: «Привет», «Привет, Азиза/Бобур», 3 starter {uz,ru}.
- JsLoops: яблоко/банан/виноград, 2 starter {uz,ru}.
- PmYearPath: ru starter ma'lumoti (darsdagi ru nomlar bilan bir xil), «-модуль», «Дальше:»; NATIJA_QATOR {uz,ru}; yashirin sinov KOD_UCH bitta — ru kutilgan qiymat shu ma'lumotdan. **Regressiya tuzatildi:** KodNamuna regex hali `vaqtChizigi(royxat, keyin)` ni qidirardi (F-1027-01 dan keyin `next` ajralmay qolgan) → `timeline(list, next)`.
- PmTenIdeas: «Проблема: / Для кого: / Решение:» (starter izohi, tekshiruv, shart, maslahat).
- **To'xtatildi:** PmMuammoIzlash (pm-m2d3-v1) — LMS reestrida yo'q; koding va qo'shni ekranlar umuman tarjimasiz → alohida qaror.
- Tekshiruv: darvozalar — yangi xato 0 (tell/emoji HEAD bilan teng); lint:jsx toza. Chrome: 9 mashq × 2 rejim × 3 kod = 54 holat, hammasi to'g'ri (1 ta «✗» — tilga bog'liq bo'lmagan sarlavha/karta sharti, kutilgandek o'tadi).
- Qolgan sinf: ru-rejimda «// Bu yerga yozing» starter — JsVars 3, PeanStack 2 (jadvaldan tashqari). JsFunctions/JsLoops ruscha EKRANLARI hamon «Salom, Olim» / «olma, banan, uzum» (jonli test bilan) — tegilmadi.
- Asl nusxalar: scratchpad ru-oldin/. Commit yo'q.

## 2026-10-27 17:54 · Noutbuk qayta yoqildi — holat tekshiruvi
- Ish daraxti saqlangan: 10 fayl (7 .jsx + 3 jurnal/KATTA), commit yo'q. esbuild 7/7 ✓, lint:jsx 258 fayl toza. Ochiq qaror: LMS'ga 6 darsmi yoki 45 (kompilyator yig'ma) — foydalanuvchi.

## 2026-10-27 19:51 · Seans saqlandi
- Keyingi seans: feedback/F-1027-01-kod-tili/DAVOM.md (1-ish: commit buyrug'i → 45 dars paketi; 2-ish: Abdulloh javobi). Vaqtinchalik worktree o'chirildi; 172 paket commitdan keyin qayta yig'iladi.
