# Sadoqat-tekshiruvi: kod ↔ MD v2 (faqat O'QISH, TUZATMAYSIZ)

Siz yengil tekshiruvchisiz. Bitta savol: **darsdagi o'quvchi ko'radigan o'zbekcha matn tasdiqlangan MD v2 bilan aynan mosmi?**
Hech qanday faylni tahrirlamaysiz. Faqat Read / Grep / Bash (`git diff`, `grep`, `sed -n`).

## Kirish
- MD: `feedback/F-0929-QA-6modul/<NN>-<NOM>-v2.md` (to'liq o'qing).
- Kod: `src/6-Modull/<FAYL>.jsx` (bo'lib bir marta o'qing; keyin grep/sed).
- O'zgarishlar: `git diff -- src/6-Modull/<FAYL>.jsx`.

## Nimani tekshirasiz (ekranma-ekran, MD tartibida)
Har ekran va har «Qo'shimcha matnlar» bo'limi (nishonlar, RECAPS, QUIZ_BANK, kartochkalar) uchun:
1. **QOLIB KETGAN** — MD'dagi matn (sarlavha, mentor, karta, variant, izoh, tugma, xulosa) kodda yo'q yoki eski holatda qolgan.
2. **CHETLASHGAN** — kodda bor, lekin ma'nosi MD'dan farq qiladi (so'z almashgani emas, MA'NO). Emoji-limit (161-qonun) yoki
   `lint:tell` sababli qilingan kichik o'zgarishlar CHETLASHISH EMAS, agar ma'no saqlangan bo'lsa — ularni «OQLANGAN» deb yozing.
3. **ORTIQCHA / ESKI QOLDIQ** — `uz` matnda MD'da yo'q eski metafora so'zlari yoki eski gaplar (masalan shahar so'zlari, «keyingi modulda», «Kurs tamom»).
4. **KOD bandlari** — MD'da «KOD» / ⚠️ KOD / 🔴 deb belgilangan har tuzilma o'zgarishi bajarilganmi (ha / yo'q / qisman).
5. **Kalitlar** — `git diff` da `INLINE_KEYS`, `correctIdx`, `QUIZ_BANK` `correct:` qiymatlari O'ZGARMAGANINI va har testda MD ✔ variant
   kodda o'sha pozitsiyada ekanini tekshiring.
6. **Siz-forma** — o'quvchiga qaratilgan buyruqlar «-ing / -ng» shaklida (sen-shakl yo'q).
Ruscha (`ru:`) TEKSHIRILMAYDI — alohida bosqich.

## Hisobot (qisqa, jadval)
| ekran | tur (QOLIB KETGAN / CHETLASHGAN / QOLDIQ / KOD / KALIT / SIZ-FORMA) | file:line | MD'da | kodda |
Oxirida: jami topilmalar soni; «OQLANGAN» kichik o'zgarishlar ro'yxati (1 qatordan); yakuniy hukm: **MOS** (0 topilma) yoki **QAYTARISH** (ro'yxat).
Turn-byudjeti ≤35 tool-chaqiruv.
