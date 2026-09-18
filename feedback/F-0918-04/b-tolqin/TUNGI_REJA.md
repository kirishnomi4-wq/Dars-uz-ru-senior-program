# TUNGI REJA — KATTA §41 B to'lqin (18.09 kech → 19.09 ertalab)

> Bu fayl — tungi ishning YAGONA haqiqat manbai. Har uyg'onishda (har ~20 daqiqa yoki fon-ish tugaganda) avval shu fayl
> o'qiladi, keyin navbatdagi band olinadi. Holat belgilari: ⬜ boshlanmagan · 🔄 jarayonda · ✅ bajarildi va sinaldi ·
> ⏭ o'tkazildi (sababi yonida) · ⏸ foydalanuvchini kutadi. Hisobot: `TUNGI_HISOBOT.md` — har band yopilganda yangilanadi,
> shuning uchun foydalanuvchi qachon uyg'onsa ham to'liq holatni ko'radi.

## Foydalanuvchi qarorlari (18.09 ~21:35)

| # | Qaror |
|---|---|
| 1 | Tunda har to'lqin oxirida LOKAL commit — ha. Push / deploy — YO'Q |
| 2 | PM «koding» nishonlari — MEHNAT (kodga tegilmaydi) |
| 3 | «To'g'ri javobi yo'q, o'z qarori» mashqlari — MEHNAT |
| 4 | Ko'p-bandli topshiriq: qoida bir xil — bitta bilim-xatosi = nishon yo'q; sirpanish sanalmaydi |
| 5 | PM darslarda tekin 4-ekran — darsning BONUSI |
| 6 | «Faqat xato qator bosiladigan» debug ekranlar → haqiqiy topshiriq; matn tasdiqlandi: «Bu qatorda xato yo'q — yana qarang.» · «В этой строке ошибки нет — посмотрите ещё раз.» |
| 7 | Matnlar: tunda FAQAT taklif-ro'yxat; darsdagi matnga tegilmaydi (6 va 9 dagi tasdiqlangan qatorlardan tashqari) |
| 8 | Ball: tunda faqat TARTIBLASH testlari (13 ta) — birinchi to'liq urinish sanaladi; 32 yozma test — ertalabga ro'yxat |
| 9 | Bir martalik ekranlar uchun uchinchi matn — ma'qul: «Nishon birinchi urinish uchun edi.» · «Значок давался за первую попытку.» («Badge» — KATTA §42) |
| 10 | Shubhali ekran: halol va yaxshi yo'l aniq bo'lsa — o'zim hal qilaman va hisobotga yozaman; aniq bo'lmasa — o'tkazaman |

**9-javob, «Badge» — yopildi (foydalanuvchi, 21:45: «A boshla»):** tunda uch qatorda «nishon» qoladi (darslarda
«nishon» 238 marta — izchillik); «nishon → Badge» butun loyiha bo'yicha KATTA §42 ga alohida band bo'lib yozildi.

## Temir qoidalar (tun davomida)

1. **Push, deploy, server, GitLab, `lms/` — TEGILMAYDI.** Commit faqat lokal, faqat to'lqin yopilganda, faqat men (fork emas).
2. **Ekran «✅» bo'lishi uchun uchalasi shart:** (a) `npm run gates -- <fayl>` — yangi topilma 0 (`lintcmp.py` HEAD bilan) +
   `lint:jsx` toza; (b) `smoke-achrule` o'sha ekranda o'tdi; (c) ekran-probi o'tdi (xato → nishon yo'q, F5 dan keyin ham;
   toza → nishon bor; sirpanish → sanalmadi). Bittasi yo'q bo'lsa — «✅» yozilmaydi.
3. **Maks 2 urinish.** Ekran ikki marta yiqilsa — o'zgarish QAYTARILADI (fayl toza holatga), ekran ⏭, sababi yoziladi.
4. **Bir fayl — bir muharrir.** Parallel agentlar faqat modul-partiya bo'yicha, fayllari kesishmaydi. Bir vaqtda ko'pi
   bilan 3 ta TAHRIR qiluvchi agent (+1 faqat o'qiydigan).
5. **O'quvchi ko'radigan matn o'zgarmaydi** — tasdiqlangan ikki qator va §183 matnlaridan tashqari. Boshqa matn kerak
   bo'lsa — `MATN_TAKLIFLAR.md` ga, ekran ⏸.
6. **CSS izohiga backtik yo'q · bir qatorli funksiya ichiga `//` izoh yo'q · PM ekranlarida kontekst o'zgaruvchisi `achMiss`.**
7. Jurnalga vaqt yozishdan oldin `date`. Har to'lqin oxirida: `PIPELINE_STATE.md` qatori + shu fayl + `TUNGI_HISOBOT.md`.
8. Kutilmagan holat (build buzildi, smoke ommaviy yiqildi, git chalkashdi) — yangi ish boshlanmaydi: avval oxirgi toza
   commit holatiga qaytiladi, sabab hisobotga yoziladi.

## Bandlar (tartib bilan)

| # | Band | Bajarildi-mezoni | Holat |
|---|---|---|---|
| T0 | **A to'lqinni commit** (3 commit: `feat(live)` muhrlash · `feat(lessons)` 97 dars + B savat + skriptlar + katalog · `docs`) | `git status` toza; `vite build` ✓ | ✅ 21:50 — `16791ee` · `9eda330` · docs (pastda) |
| T1 | **Vositalar:** `scripts/codemod-achrule.mjs` (komponent + CSS — faqat ekran ulanadigan faylga, o'lik kod qolmasin; uz-only variant; `once` — uchinchi matn) · `scripts/smoke-achrule.mjs` (boshida / lost / mentor / mashq / olingan) · `feedback/F-0918-04/b-tolqin/ach-probe.mjs` + spetsifikatsiya formati | pilotda (`InternetLesson` s13b, s13c) uchalasi o'tadi; tegilmagan darsda kutilgandek yiqiladi | ⬜ |
| T2 | **Mini-inventar (fork, faqat o'qish, T1 bilan parallel):** 17 «tashqi» nishon (`earn('…')`, `ACH_EXTRA`) · 45 ball-ekran (13 tartiblash tasdiqlanadi, 32 yozma — ertalabga ro'yxat) | `inventar-tashqi.md` · `inventar-ball.md` | ⬜ |
| T3 | **Ulash-yo'riqnomasi:** `ULASH_YORIQNOMA.md` — agent uchun to'liq brif (qonun, naqsh, vositalar, «bajarildi» mezoni, taqiqlar, hisobot shakli) | pilot bo'yicha tekshirilgan | ⬜ |
| T4 | **Partiya P1** (1-Modull + pm: 10 ekran · 7 fayl) + Q6 debug: CssLesson1 s14 · CssLesson2 s14 · Htmllesson2 s14 | har ekran 2-qoida · commit | ⬜ |
| T5 | **Partiya P3** (3-Modull: 11 ekran · 10 fayl) | 2-qoida · commit | ⬜ |
| T6 | **Partiya P6** (5-Modull: 21 ekran · 10 fayl; 15 tasi C-halol) | 2-qoida · commit | ⬜ |
| T7 | **Partiya P2** (2-Modull + 4a + 4b: 21 ekran · 13 fayl) + Q6: JsConditions s14 | 2-qoida · commit | ⬜ |
| T8 | **Partiya P4** (4-Modull: 23 ekran · 12 fayl) + Q6: ApiPostman s14 | 2-qoida · commit | ⬜ |
| T8b | **Partiya P5** (4c + 6-Modull: 18 ekran · 13 fayl) | 2-qoida · commit | ⬜ |
| T9 | **Ball — tartiblash testlari** (T2 tasdiqlagan ro'yxat; partiyalar tugagach — fayl egasi bo'shagach) + `smoke:onfinished` invarianti · **152-reyestr** (PM 4-ekran bonuslari, kod ≈ 0) | 2-qoida · commit | ⬜ |
| T10 | **Matn takliflari (darsga tegilmaydi):** 34 «javobni oldindan aytadi» + ko'chadigan nishon tavsiflari + rost bo'lmagan tavsiflar → `MATN_TAKLIFLAR.md` (KORPUS avval o'qiladi) | fayl tayyor, har qatorda ❌ eski → ✅ yangi + sabab | ⬜ |
| T11 | **Qonun va hujjatlar:** 152-qonun 5-band (koding · o'z-qaror) + bonus reyestri · 151 jadvaliga yangi mexanikalar · §183 uchinchi matn · KORPUS juftliklari · KATTA §41 holati | `lint:prompt` 0 · commit | ⬜ |
| T12 | **Yakuniy regress:** gates hamma o'zgargan darsda · `lint:jsx` · `lint-keys` · `smoke:onfinished -- --seal` ikki tilda · `smoke-achrule` hamma ekranda · `vite build` · unit | natijalar `TUNGI_HISOBOT.md` da | ⬜ |
| T13 | **Muhr:** `TUNGI_HISOBOT.md` yakuniy · `DAVOM` · xotira · jurnal | — | ⬜ |

**Tartib mantig'i:** partiyalar kichigidan (P1, P3) boshlanadi — naqsh va problar arzon joyda sinaladi; P6 (asosan
C-halol, qolipli) — uchinchi. Birinchi to'lqin: P1 + P3 + P6 parallel; ikkinchisi: P2 + P4 + P5.

**Vaqt taqsimoti (halol):** butun B to'lqin ≈ 75–100 soat; bir tunda hammasi tugamaydi. T10–T13 HAR HOLDA bajariladi:
soat **06:30** dan keyin yangi dars boshlanmaydi — qolgan vaqt regress, hisobot va muhrga. T8 tugamay qolsa — qaysi
modulgacha yetilgani hisobotda aniq turadi.

## Ishlash mexanizmi

- **Bosh agent (men)** — dirijyor: bandni oladi, fork'larga modul bo'yicha topshiradi, ularning ishini QAYTA tekshiradi
  (fork «o'tdi» degani yetmaydi — gates, `lintcmp`, prob natijasi o'zim yurgizib ko'riladi), commit qiladi, fayllarni yangilaydi.
- **Fork'lar** — ijrochi: o'z modulidagi ekranlarni inventar bo'yicha ulaydi, har ekranga prob-spetsifikatsiya yozadi va
  yurgizadi, natijani JSON'ga yozadi. Commit QILMAYDI, o'z modulidan tashqariga TEGMAYDI.
- **Uyg'onish:** fon-ish tugashi — asosiy signal; zaxira — har 20 daqiqada taymer (hech narsa o'zgarmagan bo'lsa ham
  holatni tekshiradi, osilib qolgan fork'ni aniqlaydi).
- **Dev-server** (vite 5173) — bitta, bosh agent yoqadi; problar shu serverga boradi.
- **Kontekst to'lib qolsa** — suhbat avtomatik qisqaradi; shu fayl va `TUNGI_HISOBOT.md` — tiklanish nuqtasi.
