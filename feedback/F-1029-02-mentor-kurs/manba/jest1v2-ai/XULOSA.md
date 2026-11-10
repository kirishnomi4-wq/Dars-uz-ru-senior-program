# Jest-1 v2 · AI tajribasi — XULOSA (F-1104-01, 04.11)

Prompt (ikkalasiga bir xil, ishorasiz): «src/api/telegram/texts.ts va keyboards.ts uchun jest testlar yozib ber. npm test yashil bo'lsin.» — `00-promptlar.md`.
Loyiha: OrderBotNest `tgpg-done` (f2eca2f), har agent alohida nusxada. Natijalar: `ai1/` (Opus), `ai2/` (Haiku) — `diff.patch`, `diff-stat.txt`, test fayllari.

## Nima qildi
| | Opus (ai1) | Haiku (ai2) |
|---|---|---|
| Fayllar | faqat 2 ta `.spec.ts` (290 qator), kodga tegmadi | faqat 2 ta `.spec.ts` (304 qator), kodga tegmadi |
| Natija | 36 test, yashil · `tsc --noEmit` toza | 33 test, yashil · `tsc --noEmit` toza |
| Bo'linmas probel | sezdi; `norm()` — U+00A0 va U+202F ni oddiy probelga almashtirib solishtiradi | sezdi; etalonga **ko'rinmas belgining o'zini** qo'ydi (`od -c`: `302 240`) — o'qigan odam oddiy probel deb o'ylaydi |
| Etalon | qo'lda yozilgan | ko'p joyda **koddan olingan**: `` `Jami: ${som(50000)}` ``, `` `Holati: ${STATUS_UZ.NEW}` `` |
| Da'vo | «Node versiyasiga qarab U+202F bo'lishi mumkin» — **tekshirilmagan** (bizdagi Node 24.18 da ru-RU → U+00A0, `jest1v2-out/03`) | «Telegraf `hide: false` qo'shadi — toMatchObject ishlatdim» — haqiqiy (`jest1v2-out/08` Received ichida `"hide": false`) |

## Buzib tekshirish (`../jest1v2-mutatsiya.sh`, natija `mutatsiya.txt`)
Kod 5 joyda ataylab buziladi, har safar nechta test qizarishi sanaladi (0 = buzilish sezilmadi):

| Buzish | Men (10 test) | Opus (36) | Haiku (33) |
|---|---|---|---|
| B1 `som`: ru-RU → en-US («120,000») | 1 | 8 | 1 |
| B2 savat qatori: buyurtma narxi o'rniga hozirgi narx | **0** | 1 | 1 |
| B3 `orderKeyboard`: CANCELLED da ham tugma | 1 | 1 | 1 |
| B4 `catalogKeyboard`: oxirgi sahifada ham ▶ | 2 | 3 | 3 |
| B5 `STATUS_UZ.NEW` matni o'zgardi | **0** | **0** | 1 |

## Darsga saboq
1. Ikkala AI ham kodga tegmadi, «yashil» va'dasini halol bajardi — klassik «kodni testga moslab buzish» xatosi chiqmadi. Darsda o'ylab topilmaydi.
2. **Test soni sifat emas.** 36 test (Opus) B5 ni sezmadi: «har status uchun matn bor» testi faqat `toBeTruthy` — matn o'zgarsa ham yashil. 10 test (men) B2 va B5 ni sezmadi — `texts` ning faqat `som` qismi sinalgan.
3. **Etalon koddan olinsa — test o'zini o'zi tasdiqlaydi.** Haiku: B1 da 33 dan faqat 1 test qizardi — qolganlari etalonni `som()` ning o'zidan yasaydi (buzilgan `som` buzilgan etalon beradi).
4. **Ko'rinmas belgi testda** (Haiku) — ishlaydi, lekin keyingi odam qayta yozsa sinadi; `\u00a0` ochiq yozilishi kerak.
5. **AI da'vosi tekshiriladi** (Opus U+202F) — haqiqiy yurgizish bilan.
6. Mentor tekshiruvi: test sonini emas — **kodni buzib ko'ring, test qizaradimi**.
