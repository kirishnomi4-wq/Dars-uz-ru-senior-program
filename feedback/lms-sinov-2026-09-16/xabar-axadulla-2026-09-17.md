# Axadulla'ga xabar (2026-09-17) — foydalanuvchi yuboradi

Assalomu alaykum, Axadulla.

15-sentabr javobingizni oldik, hammasi tushunarli. Bizning tomondan qisqacha:

**1. MVP — kelishdik.** Hozircha batafsil natijani `onFinished`dan olasiz. U 92 dars-faylda tayyor: ichida `lang`, `questions[]`
(test va arena, `kind` bilan) va `achievements[]` bor. Ballni `totalQuestions` / `correctAnswers` dan olishingiz to'g'ri —
`questions.length` dan emas (amaliy ball-ekranlar `questions[]`ga kirmaydi, lekin `totalQuestions`da sanaladi).

**2. «Har savolni sinab ko'rdingizmi?»** — ha, 16-sentabrda hamma 70 darsni ikki tilda (uz, ru) har bir ball-savol bilan avtomatik
o'tkazdik: 140 yugurishdan 140 tasi o'tdi. Jadval ilova: `onfinished-sweep.md`. Jonli yo'lni ham alohida tekshirdik: jonli darsda
test savoli bitta urinish bilan, arena savoli `kind: "arena"` bilan, serverdagi javob bilan bir xil.

Shu sinov bitta nuqsonni ochdi: 38 darsda serverdan ketadigan `lesson-results` ichida `total_questions` oshib ketar ekan
(amaliy ekranlar sanalib qolgan: ekranda 4, hodisada 8). Tuzatdik, staging'da 17-sentabrdan turadi. `onFinished`ga bu ta'sir qilmagan.
Shuning uchun sinovda `total_questions` ekrandagi «N / jami» bilan bir xil bo'ladi.

**3. A-variant.** Bizning kod tayyor, `RESULT_DETAILS` hozir `off`. Siz «staging qabul qiladi» deganingizda Kristinadan staging'da
yoqishni so'raymiz, keyin sizning §5 bo'yicha 30 daqiqalik sinov. Sinovda ikki dars: «Internet qanday ishlaydi» (5 test + 12 arena)
va bitta PM dars (`pm-m3d14-v1`) — unda `total_questions` tuzatilganini ko'rasiz. Takror-sinov (200 / 409) uchun bizda tayyor
buyruq bor. Taklif-vaqt: <kun> <soat> Toshkent.

**4. §4 jonli `onFinished` namunasi** (31352, 10-sentabr) — kutamiz, kelishi bilan tekshiramiz.

**5. Rotatsiya.** Tartibingiz bizning runbook bilan bir xil (ikki kalit parallel, 12 soat, keyin eskisi o'chadi). Kanal taklifi:
yangi qiymatlarni Kristinaga fayl sifatida (u `.env`ga qo'yadi) va bizga parol-menejer orqali; chatga yozilmaydi. Vaqti — prod'da
A-variant ishlagandan keyingi kun.

Rahmat.

---
Ilova: `onfinished-sweep.md` (70 dars × 2 til, 140/140).
