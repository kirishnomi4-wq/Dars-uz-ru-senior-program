# ☀️ ERTALABKI HISOBOT — 2026-09-23 (tungi avtopilot, F-0923-03)

Reja: `AVTOPILOT_REJA_2026-09-23.md`. Batafsil yozuv: `PIPELINE_STATE.md` → «03:20 (23.09)».

## Qisqasi
- **GitHub:** `a867a6f` push qilindi (siz qo'lda qildingiz, 00:5x). O'shandan beri **push yo'q**.
- **Regress — hammasi toza.**
- **Yuklash papkasi `yuklash-2026-09-23/` tayyor** — yuklashni o'zingiz qilasiz.
- Dars-kodiga tunda **tegilmadi**; 6-bo'lim qarorlariga **tegilmadi**.

## 1. Layout (VAZIFA 1)
Tashxis 23.09 00:34 da yakunlangan: 12 alohida xato emas, **umumiy komponentlarning eski qarzi**
(`ach-coll` · `gloss` · `frame-soft` · `button.hw-big`); tegilmagan darslar ham toshadi.
**Tuzatilgani: 0** — `KATTA_TOZALASH.md` «LAYOUT TOSHISHI (F-0923-01)» da, qaror sizda.

## 2. `variable` (VAZIFA 2)
`JsVarsLesson` — «(peremennaya)» → «(variable)», 2 joy. Bajarilgan (00:34), qayta tekshirildi.

## 3. Yakuniy regress (VAZIFA 3)
| Sinov | Natija |
|---|---|
| `lint:jsx` | 157 fayl · **0** |
| esbuild | 118 fayl · **toza** |
| `vite build` | ✓ |
| `lint:prompt` | ✓ |
| `lint:keys` | 97 dars · **nomos 0** |
| ekran-probi | **160/160** |
| solo | **27/27** (quyida izoh) |
| `smoke-homework` | **36/36** |
| `smoke-arena` | **97/97** (javob ochildi · 6 s avto-o'tish · ⏸ yopishqoq) |

**Solo izohi:** birinchi yurish 26/27 edi. Yiqilgan — `JsVarsLesson s15`. Dars **buzilmagan**:
22.09 da B-seans o'zgaruvchilarni inglizchaga o'tkazgan (`let ism` → `let name`), prob-spetsifikatsiyasi
esa eski placeholderni qidirardi. Spetsifikatsiya yangilandi (selektor endi matnga bog'lanmaydi) →
1/1 ✓. Qolgan 6 ta shunday selektor tekshirildi — eskirgani yo'q.

**Kichik kuzatuv (qaror sizda):** `scripts/smoke-arena.mjs` izohi «fayl berilmasa — barcha darslar»
deydi, kod esa fayl so'rab to'xtaydi. Tuzatmadim; 97 faylni qo'lda berdim.

## 4. Yuklash papkasi (VAZIFA 4)
`yuklash-2026-09-23/` — **88 fayl · 7 modul**. `TEKSHIRUV.log`:
brauzerda uz+ru **176/176** · md5 **88/88** · katalog **70/70 dars**.

- 88 faylning hammasi LMS'dagi 21.09 nusxasidan farq qiladi (ligatura supurishi + arena avto-o'tish — kutilgan).
- `CssLesson1` (m1-06, papkada **07-** raqami) ekran soni **21 → 22** — darsni yarmida qoldirgan
  o'quvchining progressi tozalanadi. Siz aytgandek: o'quvchilar dars qilmayotgan paytda yuklang.
- `yuklash-2026-09-22/` endi keraksiz (eskirgan) — o'chirish sizning qaroringiz.

## 5. Commit holati
- `a867a6f` — GitHub'da.
- Tungi ish (spetsifikatsiya · STATE · shu hisobot) — **lokal commit**, push qilinmagan.
- `yuklash-2026-09-23/` commit qilinmagan (21.09 papkasi kabi kiritilsinmi — ayting).

## 6. 🔴 Ochiq qarorlar (o'zgarmagan)
1. `m2-02` hisoblagichlari «1-karta · 2-karta · 3-karta» — tasdiq kutadi.
2. `PmLesson5` (m2-07) — «imkoniyat» 45 joy, konteksti boshqa — tegilmagan.
3. `m2-12` «Shipped It!» — «MVP'ni dunyoga chiqardingiz» qoldirilgan.
4. `m2-12` «jilolash/jilolangan» — 2 joy, tegilmagan.
5. 7-Modul — ligatura qoldig'i (12 fayl · 88 e'lon), «dunyoga chiqarish» — `KATTA_TOZALASH.md` da.
6. Push / deploy — faqat sizning buyrug'ingiz bilan.

## 7. Siz bilan (avtopilot qilmadi)
**LMS sinovi:** `Ctrl+Shift+R` → savolda ataylab xato → to'g'rilash → oxirigacha →
«Dars muvaffaqiyatli yakunlandi» kutiladi. Yiqilsa: vaqt · dars ID · Network'dagi
`question_try` va `next_lesson_access` javoblari (tokensiz).
