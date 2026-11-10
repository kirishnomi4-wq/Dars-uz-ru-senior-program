# F-1105-03 S13 — Shahzodaga: band-ma-band holat va muddatlar (QORALAMA, 10.11.2026)

Bu fayl — qoralama. Hech kimga yuborilmagan. Sanalar Abdullohning ETA'si kelgach qo'yiladi (`[T]` — reliz kuni, uni foydalanuvchi aytadi).
Manba: `04-…` (1.1–1.9), `05-…` (2.1–2.4), `25-…` (Abdulloh yakuniy kontrakti).

---

**Kimga:** Shahzoda, o'quv bo'limining mahsulot jamoasi
**Kimdan:** JSX darslar jamoasi
**Mavzu:** JSX darslar ma'lumoti — har band qachon ishlaydi

## 1. Umumiy sana

| Bosqich | Kim | Sana |
|---|---|---|
| Dars API (bizning server) tayyor, staging'da sinalgan | biz | ✅ 09.11 |
| CoddyCamp tomonida yangi natijani qabul qilish | Abdulloh | `[ETA]` |
| Staging'da birgalikdagi sinov | biz + Abdulloh | `[ETA + 1–2 kun]` |
| Reliz: server → 172 dars → yangi oqim yoqiladi | biz + Abdulloh | `[T]` |
| Konnektor orqali tekshirishni boshlashingiz mumkin | siz | `[T + 1 kun]` |
| Tekshirish nuqtasi (eski oqim yopiladimi) | hammasi | `[T + 8 kun]` |

Yangi ma'lumot `[T]` kundan boshlab yoziladi. Undan oldingi yozuvlarda yangi maydonlar bo'sh (`null`) bo'ladi.

## 2. Band-ma-band

| Band | Nima | Holat | Qachondan |
|---|---|---|---|
| 1.1 | Natija avtomatik ketadi, tugmaga bog'liq emas | Tayyor | `[T]` |
| 1.1 | Sessiya o'zi eskirib yopilishi | Faolliksiz **30 daqiqa**dan keyin yopiladi (prod qiymatini Abdulloh tasdiqlaydi). Mentor yopmagan jonli dars uchun eng uzog'i — 2 soat. Uydagi (solo) dars — 7 kun | `[T]` |
| 1.1 | Learn oxiriga yetmagan o'quvchiga ham ochiladi | Abdulloh tasdiqladi (25-kontrakt, 2-bo'lim): Class yakuni kutilmaydi; jonli darsda o'quvchi arenaning birinchi savolini ko'rsa, Learn avtomatik bajarilgan deb belgilanadi | `[T]` |
| 1.2 | Doimiy kalit va reviziya | Tayyor. Jadval JSON va CSV ko'rinishida (`SAVOL_KALITLARI`), 172 dars, 2565 kalit | `[T]` |
| 1.3 | Tekshiruvsiz practice: «Bajardim», `correct` bo'sh | Tayyor | `[T]` |
| 1.3 | Tekshiriladigan topshiriq: har «Tekshirish» — urinish | Qisman: urinish va natija yoziladi; har bosish alohida — `[keyingi bosqich]` | `[sana]` |
| 1.3 | O'quvchi yozgan matn (300 belgigacha) | `[keyingi bosqich]` — darsning o'zida o'zgarish kerak | `[sana]` |
| 1.4 | `opened_at`, UTC, ISO-8601 | Tayyor | `[T]` |
| 1.5 | Reestr: dars kodi, uz/ru, Class, Learn, yuklangan sana | Tayyor | `[T]` |
| 1.6 | CodeStrike: `joined`, `answered`, to'liq o'rin, o'rin olganlar soni | Tayyor | `[T]` |
| 1.7 | Savol matni va til | Har yozuvda o'zbekcha matn (bitta savolga bitta matn — uz va ru o'quvchilar bitta kalitga qo'shiladi) va `lang` — o'quvchi qaysi tilda o'tgani. Ruscha matn savol kalitlari jadvalida (`text_ru`, ekranda ko'ringan matn). 172 darsning hammasida bir xil | `[T]` |
| 1.8 | Konnektor (A yo'l), faqat o'qish | Bizda tayyor: view'lar va faqat o'qish roli. Tarmoqni Abdulloh ochadi | `[ETA]` |
| 1.9 | GW 69 | Kerak emas (07.11 qarori) | — |
| 2.1a | Har qadamning «Bajardim»i alohida | `[keyingi bosqich]` | `[sana]` |
| 2.1b | Tugmasiz practice ekran — `kind: practice`, «bajardi» bo'sh | Tayyor | `[T]` |
| 2.2 | Matn faqat bizda; konnektorda faqat ≥5 o'quvchidagi bir xil xato | View tayyor (`v_wrong_answers_top`) | `[T]` |
| 2.3 | Har yozuvda `lms_question_id` | Tayyor | `[T]` |
| 2.4 | `quiz-N` → Learn jadvali | Tayyor (`QUIZ_LEARN.csv`); relizda tartib raqamlari saqlanadi (uz 1–12, ru 13–24) | `[T]` |

## 3. Practice ekranlar — ikki ro'yxat (2.1b so'rovingiz)

Ilova: `AMALIYOT_ROYXATI.csv` (172 dars, 286 ekran).
- **Tekshiriladigan** — 46 ekran: «bajarildi» belgisi bor, `correct` yoziladi.
- **Tekshiruvsiz** — 240 ekran: faqat ochilgan va o'tilgan vaqt, «bajardi» bo'sh (`null`).

## 4. Konnektordagi view'lar

`v_lesson_results` · `v_question_attempts` · `v_practice` · `v_screen_views` · `v_arena` · `v_arena_full_place` · `v_wrong_answers_top` · `v_sessions`.
Hammasida faqat id'lar: ism, kontakt va o'quvchi yozgan matn yo'q. Vaqtlar UTC.
