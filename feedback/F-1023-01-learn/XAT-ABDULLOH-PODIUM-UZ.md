# CodeStrike podium — QA namunasi (28.10.2026)

Abdulloh, siz so'ragan podium namunasi tayyor. Bu fayl birinchi «Tamom»da yuboriladigan `codestrike` ichiga
`podium { game_id, place, finalized }` maydonini qo'shadi.

```text
Fayl:    internet-01-v18-codestrike-podium-20261028.jsx  (493 042 bayt)
SHA-256: ee456aa39f55421b792a09762c387e0060e83c7f36911301b3d37650a2c5e877
MD5:     2cc219e343d215412a64daafcade0c04
```

Bu fayl v2 namunaning (`ba2268cf…`) ustiga qurilgan. Learn mantig'i va BUG-01 tuzatishlari o'zgarmagan.
Ularga faqat podium qo'shilgan.

## Yuk namunasi

```json
"codestrike": {
  "played": true, "total": 12, "answered": 12, "correct": 9, "percent": 75, "passed": true, "mode": "student",
  "podium": { "game_id": "6f1c2e9a-…-944455556666", "place": 2, "finalized": true }
}
```

| Maydon | Qiymati |
|---|---|
| `game_id` | Dars API'dagi jonli sessiya id'si (UUID). O'quvchiga LMS orqali qo'shilganda `/api/v1/lms/join` javobidagi `session_id` dan olinadi. Bir sinfdagi barcha o'quvchilarda bir xil bo'ladi. |
| `place` | O'quvchi arena yakunida ekranda ko'rgan o'rni (1, 2, 3, …). Hamma o'quvchiga yuboriladi, faqat 1–3-o'rinlarga emas. Bonus kimga berilishini LMS hal qiladi. |
| `finalized` | `true`: o'rin mentor testni yakunlagandan keyin (`quiz_state = done`) yozilgan. |

## Qachon yuboriladi, qachon yuborilmaydi

Podium **yuboriladi**, agar:
- o'quvchi LMS orqali jonli darsga kirgan bo'lsa (`mode: student`);
- birinchi o'yin shu jonli test bo'lsa;
- o'quvchi kamida bitta savolga javob bergan bo'lsa;
- mentor testni yakunlab bo'lgach, o'quvchi «Tamom»ni bossa.

Podium **yuborilmaydi** (`codestrike` ichida `podium` kalitining o'zi bo'lmaydi), agar:
- o'quvchi solo yoki mashq rejimida o'ynagan bo'lsa (o'rin yo'q);
- birinchi o'yin solo bo'lib, keyin jonli testga qo'shilgan bo'lsa (birinchi o'yin hal qiladi, BUG-01 qoidasi);
- o'quvchi birorta savolga javob bermagan bo'lsa;
- o'quvchi «Tamom»ni mentor testni yakunlashidan **oldin** bosgan bo'lsa. Yuk birinchi «Tamom»da muhrlanadi,
  undan keyin kelgan o'rin unga qo'shilmaydi. Bu sizning «birinchi onFinished» qoidangizga mos.
- o'quvchi LMS'siz, PIN bilan kirgan bo'lsa (sessiya id'si noma'lum).

O'rin bir marta yozilgach saqlovda turadi. Sahifa qayta yuklansa yoki yangi urinish boshlansa ham o'zgarmaydi.

## Ikkita muhim eslatma

1. **O'rinni o'quvchining brauzeri hisoblaydi.** Ya'ni uni qo'lda o'zgartirib yuborish mumkin. Coin berishdan oldin
   server tomonda solishtirishni tavsiya qilamiz. Dars API'da shu sessiyaning arena javoblari bor
   (`/api/v1/live/answers/<pin>?range=arena`), `game_id` orqali tekshirish mumkin.
2. **O'rin ekrandagi ball bo'yicha hisoblanadi.** Ball javob tezligi va ketma-ket to'g'ri javoblar bonusidan tuziladi.
   Dars API natija-modulidagi `arena_top_N` belgisi esa boshqacha hisoblanadi: to'g'ri javoblar soni, keyin vaqt.
   Ba'zan ikkalasi farq qiladi. Biz o'quvchi o'z ko'zi bilan ko'rgan o'rinni yuboramiz.

## Biz tomonda tekshirildi

**Brauzerda** (Playwright, soxta Dars API + LMS join, 3 o'yinchi, o'quvchi 2-o'rinda):

| Stsenariy | Natija |
|---|---|
| LMS orqali kirish → arena → javob → mentor yakunladi → «Tamom» | ekranda «Siz — 2-o'rin», yukda `podium { game_id: <session_id>, place: 2, finalized: true }` ✓ |
| «Tamom» mentor yakunlashidan oldin bosildi | `podium` yo'q ✓ |
| PIN bilan kirish (LMS'siz) | `podium` yo'q ✓ |

**Unit testlar** (`resultDetails.test.mjs`): 40/40, shundan 4 tasi yangi podium testlari. Mutatsiya tekshiruvida
4 himoyaning har biri o'chirilganda testlar yiqildi: PIN/rejim, javobsiz, yakuniy o'rinni almashtirish, yangi urinishda saqlash.

**Boshqa tekshiruvlar:** jsx-lint toza; mentor arenasi brauzerda o'tdi (avto-o'tish, ⏸); LMS smoke ✓;
preview rejimi ✓ (mentor paneli yo'q, saqlov o'zgarmagan, Dars API'ga so'rov 0).

## Sizdan iltimos — QA'da tekshirish

- **P1.** Uch o'quvchi bilan jonli arena, mentor yakunlaydi, har biri «Tamom» bosadi. Kutilgan natija:
  uchalasida bir xil `game_id`, `place` 1/2/3 ekrandagidek, `finalized: true`.
- **P2.** O'quvchi «Tamom»ni arena yakunlanishidan oldin bosadi. Kutilgan natija: `podium` yo'q, bonus yo'q.
- **P3.** Solo o'yin. Kutilgan natija: `podium` yo'q.
- **P4.** Mentor yakunlagandan keyin sahifani qayta yuklab, «Tamom» bosiladi. Kutilgan natija: o'sha `place`.

Hammasi OK bo'lsa, podiumni 172 darsning hammasiga qo'shib, ommaviy yuklash paketini yig'amiz.
Yangi SHA ro'yxatini yuboramiz: `src/live` o'zgargani uchun barcha fayllarning SHA'si o'zgaradi.
