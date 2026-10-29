# CodeStrike podium — tuzatilgan namuna (28.10.2026, PODIUM-01…04 ga javob)

Abdulloh, aniq tekshiruv uchun rahmat. To'rttala topilma ham tasdiqlandi va tuzatildi.
Qayta qabul ro'yxatingizni biz tomonda bandma-band o'tkazdik, natijalari pastda.

```text
Fayl:    internet-01-v18-codestrike-podium-v2-20261028.jsx  (498 990 bayt)
SHA-256: a30ae77a2781b04c0ec0d3d8cfb102460a3f34d63d2f3f0af53541ab185e18cb
MD5:     06d2f1391abc32c62453e74eef7afe2e
```

Oldingi namuna (`ee456aa3…`) bekor qilinadi.

## Nima o'zgardi

**PODIUM-01 (4-o'rin va pasti):** `place` endi faqat `1`, `2`, `3` yoki `null` bo'ladi. 4-o'rin va undan pastda
`podium: { game_id, place: null, finalized: true }` ketadi: o'quvchi o'yinda qatnashgan, lekin sovrinli o'rin yo'q.
Ekranda o'quvchi o'zining haqiqiy o'rnini ko'raveradi («Siz — 4-o'rin»).

**PODIUM-02 (eskirgan o'rin):** o'rin endi arena oynasida emas, umumiy modulda (`src/live/useLiveSession.js` + `src/live/podium.js`) hisoblanadi.
- Dars `quiz_state: "done"` ni ko'rgandan **keyin** o'yinchilar va javoblar jadvalini serverdan qaytadan yuklaydi va o'rinni faqat shu jadvaldan hisoblaydi. Oraliq jadval hech qachon yakuniy deb yozilmaydi.
- Yuklash xato bilan tugasa, o'rin yozilmaydi. So'rov 1,5 s dan 15 s gacha oraliq bilan qayta yuboriladi.
- O'quvchi arena oynasini yopgan bo'lsa ham bu jarayon ishlaydi.

**PODIUM-03 (erta «Tamom»):** podium kutilayotgan o'quvchi «Tamom»ni bossa, yuk darhol yuborilmaydi. Ekranda
«CodeStrike o'rinlari hisoblanmoqda» oynasi chiqadi. Yakuniy o'rin yozilishi bilan yuk o'zi ketadi, qayta bosish shart emas.
Bu holatda «Dars yakunlandi, oynani yopsangiz bo'ladi» xabari ham yuk haqiqatda ketgan paytda chiqadi.

Podium faqat quyidagi shartlarning hammasi bajarilganda kutiladi:
- o'quvchi LMS orqali kirgan (`session_id` bor);
- birinchi o'yin jonli (`student`) va o'sha PIN bilan;
- o'quvchi kamida bitta savolga javob bergan;
- o'rin hali yozilmagan.

Solo rejim, javobsiz o'yin, PIN bilan (LMS'siz) kirish va preview'da kutish yo'q.

Kutish quyidagi hollarda tugaydi:
- o'rin yozildi;
- mentor arenani yakunlamasdan sinfni yopdi (`status: ended`) yoki mentor uzildi. Bunda dars podiumsiz yakunlanadi, chunki podium mumkin emas.

**Biz qo'shgan zaxira:** kutish 45 soniyadan oshsa, oynada «Kutmasdan yakunlash» tugmasi paydo bo'ladi.
Uning ostida «Bunda CodeStrike o'rni uchun bonus berilmaydi» degan izoh turadi. Tugma bosilsa, natija `podium`siz saqlanadi.
Bu o'quvchi tarmoq uzoq ishlamay qolganda qotib qolmasligi uchun. Kerak bo'lmasa, olib tashlaymiz.

**PODIUM-04 (o'rin almashadi):** o'rin yakuniy jadvaldan **bir marta** yoziladi. Keyingi chaqiruvlar uni o'zgartirmaydi:
boshqa o'rin, boshqa `game_id`, sahifani qayta yuklash, yangi urinish yoki qayta o'yin.

**Teng ochko:** tartib quyidagicha: ochko ↓ → to'g'ri javoblar soni ↓ → oldin qo'shilgan (`joined_at` ↑) → `player_id`.
Arena ekranidagi jadval ham, LMS'ga ketadigan o'rin ham shu bitta funksiyadan chiqadi (`arenaOrder`). Natijada hamma
o'quvchida o'rinlar bir xil chiqadi va sovrinli o'rin ikki kishiga tushmaydi.

Dars API va LMS tomonida o'zgarish kerak emas.

## Qayta qabul ro'yxati — biz tomonda natija

Brauzerda tekshirildi: Chrome, soxta Dars API va LMS join. Sinfda 3 o'yinchi (5-o'rin sinovida 5 ta). Dars bizning
manba kodimizdan yig'ilgan, ya'ni aynan shu namuna bilan bir xil kod.

| # | Sizning mezoningiz | Natija |
|---|---|---|
| 1 | 1–3-o'rin: ekran = birinchi `onFinished` | ekranda «2-o'rin» → `place: 2` ✓ · teng ochkoda «1-o'rin» → `place: 1` ✓ |
| 2 | 4-o'rin va pasti saqlanadi, bonus yo'q | ekranda «4-o'rin» → `place: null, finalized: true` ✓ |
| 3 | Yakuniy jadval 6 s kechikadi | «Tamom» ushlandi, oyna chiqdi, yuk 0 → jadval kelgach `place: 2` ✓ (oraliq jadvalda 1-o'rin edi, 1 ketmadi) |
| 4 | Jadval yuklashda xato | 3 marta HTTP 500 → o'rin yozilmadi, qayta urinildi → `place: 2` ✓ |
| 5 | Erta «Tamom» | ushlandi → mentor yakunladi → `place: 2` ✓ · mentor arenani yakunlamay sinfni yopdi → podiumsiz yakun, qotib qolmadi ✓ |
| 6 | Qayta yuklash va qayta yuborish | o'rin yozilgach sahifa qayta yuklandi, serverdagi jadval o'zgartirildi → baribir `place: 2`, `game_id` o'sha ✓ · qayta «Tamom» — aynan o'sha yuk (unit: muhr testi) ✓ |
| 7 | Qayta o'yin birinchisini almashtirmaydi | unit: qayta o'yin, yangi urinish, qayta yuklash → birinchi o'rin qoladi ✓ |
| 8 | Solo va javobsiz o'yin bloklamaydi | unit: podium yo'q, kutish yo'q ✓ · brauzer: PIN bilan kirish → darhol yakun, podium yo'q ✓ |
| 9 | Teng ochko | unit: 4 o'yinchi, uchtasi teng → o'rinlar 1, 2, 3, 4 takrorsiz; ro'yxat tartibi o'zgarsa ham o'sha ✓ |
| 10 | BUG-01, Learn, preview | resultDetails 42/42 (BUG-01 testlari ham ichida) ✓ · `codestrike.passed` o'zgarmagan ✓ · preview: Dars API'ga so'rov 0, saqlov o'zgarmagan ✓ |
| + | Zaxira tugma | 30 s da yo'q, 47 s da bor → bosilsa podiumsiz yakun ✓ |
| + | Ekran o'lchami | kutish oynasi 1440×900 va 390×844 da tekshirildi ✓ |

**Unit testlar:**
- `resultDetails` 42/42 · `podium` 3/3 · `previewMode` 8/8.
- Ochko formulasi darsning o'zidagi `quizScore` bilan 3 xil darsda (jumladan `QUIZ_MS = 20000` bo'lgan darsda) 6000 ta tasodifiy holatda solishtirildi, farq 0. 183 darsda formula matni bir xil.
- **Mutatsiya:** 7 himoyaning har biri ataylab o'chirib ko'rildi, har safar test yiqildi. Himoyalar: bir marta yozish, 4+ → `null`, `null` saqlovdan tiklanishi, yangi urinishda saqlash, teng ochko qoidasi, seriya bonusi, javobsiz o'yinda kutmaslik.

**Boshqa tekshiruvlar:** 182 dars esbuild ✓ (`src/live` hammasiga tegadi) · jsx-lint toza · mentor arenasi brauzerda ✓ · LMS smoke ✓.

## Halol chegara

- Haqiqiy Dars sessiyasi va QA'dagi coin hisoblash biz tomonda yurgizilmadi. Backend validatori (`CodeStrikeRewardService::validate()`) bizda yo'q, shuning uchun 422 holati faqat shartnoma bo'yicha (`place` 1–3 yoki `null`) tekshirildi.
- Bir nechta haqiqiy klientning bir vaqtda o'rin hisoblashi unit testda tekshirildi (bitta funksiya, bitta tartib), haqiqiy sinfda emas.

Hammasi OK bo'lsa, shu o'zgarishni 172 darsning hammasiga yoyamiz. Keyin yangi SHA ro'yxatini yuboramiz.
