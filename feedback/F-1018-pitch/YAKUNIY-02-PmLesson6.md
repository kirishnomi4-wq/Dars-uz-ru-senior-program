# YAKUNIY · m2-13 «Sistemani qanday pitch qilish» (src/2-Modull/PmLesson6.jsx) — 18 → 11 ekran · F-1018-03 · 2026-10-18
Manba-haqiqat (MD = kod). 222-qonun qo'llanishi (foydalanuvchi: «unga ham qo'llaymiz», reja 11 ekran tasdiqlangan). lessonId `pm-m2d13-v1` → **`pm-m2d13-v2`**.
Zaxira `arxiv/F-1018-03-oldin/PmLesson6.jsx`. Qurish `qurish/f1018c.py` (zaxiradan, 8 bosqich + o'lik CSS). O'quvchi loyihasi: m2-11/m2-12 mini-do'kon (`ccDokon`: nom, katalog, havola) — endi dars uni o'qiydi.

## Ekranlar (11)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish — bir suhbat, tushunish chizig'i | ▶ bosadi, savolga javob tanlaydi | — |
| 2 | s1 | Reja — 5 bo'lakli pitch namunasi | mentor: «o'z do'koningiz haqida yozasiz, ikki marta ovoz chiqarib aytasiz — avval o'zingiz, keyin sherigingizga — va Demo Day saytingizni tekshirasiz» | — |
| 3 | s2 | So'z-elagi | o'z gapidagi 3 kasbiy so'zni bosadi → sodda almashtiruvchi | Jargon Buster! |
| 4 | s3 | Uch qatlam o'xshatishi | har qatlamga do'kon dunyosidan o'xshatish (peshtaxta · oshpaz · javon) | — |
| 5 | s4 | Pitch matni — 5 bo'lak, bittalab | tepada «Demo Day do'koningiz: {nom} · {havola} — pitch shu do'kon haqida»; Kim uchun · Qanday muammo · Nima qiladi · Nega ishlaydi · Nima so'rayman; tekshiruv (kasbiy so'z, «hamma», takror, o'xshatish, so'rov) | Plain Talker! (kasbiy so'zsiz) |
| 6 | s5 | Test — «Do'kon egasi "tushunmadim" dedi, avval nimani tekshirasiz?» | 4 variant, to'g'ri A (kasbiy so'z qolganini); RECAPS {5} | 1 (final, s5: 0) |
| 7 | s6 | Repetitsiya 1 — bitta gap | 5 bo'lak bitta gapga yig'iladi, ovoz chiqarib o'qiydi, ✎ tahrirlash | — |
| 8 | s7 | Repetitsiya 2 — sherikka yoddan | ekranga qaramay sherikka aytadi; sherik «Tushundim / Yarim / Tushunmadim»; yarim/tushunmadim → qaysi bo'lakni soddalashtirasiz (1 qator) | Good Ear! («sherigingizga yoddan aytdingiz») |
| 9 | s8 | Amaliyot — Demo Day do'koningizda kamchilik bormi? (YANGI) | «Saytni ochish ↗» (`ccDokon.havola`, maydon ham); 3 tekshiruv: katalog + narx so'mda · «Savatga» + jami · telefonda sig'adi; «✓ Joyida» / «✗ Kamchilik bor» → «✓ To'g'riladim»; «Gemini'ga so'rov namunasi» (index.html, style.css, script.js) + Nusxalash | Site Checked! |
| 10 | s9 | Natijalar / arena | solo 1/1; jonli podium + CODE STRIKE (QUIZ_BANK 12, 3/3/3/3) | — |
| 11 | s10 | Yakun | «Endi siz bilasiz» 4 band · Uyga vazifa · nishonlar 4/4 · Yakunlash | — |

## Olingan (18 → 11)
Test 1–3 (s3, s6, s8) · «Tinglovchi javobi» 3 boshlanish (s4) · Airbnb keysi (s5) · «Tinglovchi kursisi» viktorinasi (s10) · Koding + HtmlCompiler importi, KOD_*, KODING_KEY (s11) · kartochkalar (PITCH_FLASHCARDS, Flashcards, ScreenFlashcards) · HW_STEPS (o'lik) · AchRule (o'lik) · 88 o'lik CSS klassi (112 qator). Fayl 3 641 → 2 995 qator.

## O'zgargan
Nishon System Speaker! (koding) → **Site Checked!**; Good Ear! tavsifi (kursi → sherik). ACH_TRIGGERS {s2, s4, s7, s8}. RECAPS {5}, Q_LABELS {5}, INLINE_KEYS {s5: 0, ustaxona: −1}. QUIZ_BANK: Airbnb 2 savol → «Sherik "Yarim tushundim" dedi» · «Saytni nega telefonda ham ochasiz?» (3/3/3/3). Reja (s1) mentor matni. Pitch matni (s4) do'kon eslatmasi.

## Sinov
- `npm run gates` 11/13: tell/emoji — zaxira bilan farq 0 (eski); qolgani ✓. `lint:jsx` 0 · `lint:qolip` error 0.
- `sinov/tekshir-m213.mjs` **32/32** (`natija-m213.txt`): eski v1 progress → 01/11 · oqim 11 ekran (so'z-elagi 3/3, o'xshatish 3/3, pitch 5/5, test, gap o'z matnidan, sherik, sayt havola ccDokon, nishonlar 4/4, onFinished tq 1 · final 1/1 · passed) · kod-mosligi (RECAPS, INLINE_KEYS, screens 11, o'lik import yo'q) · 390 px 5 ekran.
- `sinov/ru-m213.mjs` 11/11 toza (pageerror 0, [object Object] 0; «pitch» dekor-tokeni eski).
- Suratlar `suratlar/m213/`.

## Tuzoqlar
1. QUIZ_BANK yozuvi ko'p qatorli bo'lishi mumkin — almashtirishda keyingi `{ q:` yoki `];` gacha kesiladi (bir qatorni almashtirish esbuild xatosi berdi).
2. `flow-label` uppercase — sinovda matn `/…/i` bilan.
3. So'z-elagi: bir so'zni qayta bosish hech narsa qilmaydi — sinov har so'zni bir marta bosadi; o'xshatish: noto'g'ri belgisi almashinadi — variantlar tartib bilan, karta nomi o'zgarguncha.
