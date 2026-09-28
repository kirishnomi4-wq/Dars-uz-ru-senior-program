# Dars (JSX) yakunida LMS'ga nima bera olamiz — to'liq ro'yxat

**Kimga:** Shaxzod (product manager) · Axadulla (LMS integratsiya)
**Kimdan:** dars-platforma jamoasi · 2026-09-23
**Asos:** 97 darsning kodi (`src/live/resultDetails.js`, `finishLesson`), 18 uyga vazifa paketi, 2026-09-08 da kelishilgan `onFinished` shakli (TZ §4/§9)

> Qisqacha: dars tugaganda `onFinished` orqali LMS'ga **bitta JSON** ketadi. Unda har savol, har bosish (urinish), vaqt va nishonlar bor. Bu ma'lumot **hozir ham** ketyapti — uni o'qish va saqlash LMS tomonida. Pastda: 1) hozir ketayotgan hamma maydon, 2) shundan qanday analitika chiqadi, 3) darsda bor, lekin hali yuborilmayotgan narsalar (so'rasangiz qo'shamiz), 4) umuman bera olmaydigan narsalar.

---

## 1. Hozir `onFinished` da ketayotgan maydonlar (dars)

### 1.1 Umumiy (yuqori daraja)

| Maydon | Ma'nosi |
|---|---|
| `lessonId` | Dars kodi, versiyasi bilan (`pm-m3d2-v3`) |
| `lessonTitle` | Dars nomi `{uz, ru}` |
| `lang` | O'quvchi darsni qaysi tilda o'tdi: `uz` yoki `ru`. Pastdagi hamma matn shu tilda |
| `durationSec` | Dars ochilganidan yakungacha o'tgan vaqt, soniyada |
| `totalQuestions` | Ballik test savollari soni (arena kirmaydi) |
| `correctAnswers` | Birinchi urinishda to'g'ri javob berilgan savollar soni |
| `scorePercent` | `correctAnswers / totalQuestions`, foizda |
| `finalScore`, `finalTotal` | Yakuniy (mustahkamlash) savollari bo'yicha ball |
| `passed` | Ball mezoni: yakuniy savollarning ≥60% birinchi urinishda to'g'ri. 22.09 dan bu «dars yakunlandi» degani EMAS — yakunlanish signali `onFinished` ning o'zi |
| `questions[]` | Har savol bo'yicha batafsil (1.2) |
| `achievements[]` | Darsda olingan nishonlar (1.3) |
| `answers[]` | Xom javob-obyektlar (1.4) — `questions[]` bilan bir xil ma'lumot, eski shakl; ba'zi darslarda ustaxona artefaktini ham o'z ichiga oladi |
| `nickname`, `livePin`, `liveMode` | Faqat 27 darsda bor: jonli darsdagi ism, PIN va rejim (`mentor` · `student` · `self`). Qolgan 70 darsda yo'q — so'rasangiz, hammasiga bir xil qilamiz |

### 1.2 `questions[]` — har savol bo'yicha

| Maydon | Ma'nosi |
|---|---|
| `question_id` | Savolning dars ichidagi barqaror kodi (`s4`, `quiz-3`) |
| `kind` | `test` — ballga kiradi · `arena` — yakuniy jang (CodeStrike), ballga kirmaydi, faqat jonli darsda |
| `order` | Darsdagi tartib raqami |
| `question` | Savol matni (o'quvchi tilida) |
| `options[]` | Variantlar matni (≤6) |
| `correct_option`, `correct_answer` | To'g'ri variant indeksi va matni |
| `correct` | **Birinchi urinishda** to'g'rimi |
| `solved` | **Oxir-oqibat** to'g'riga yetdimi (har qancha urinishdan keyin) |
| `attempts[]` | Har bosish, tartib bilan (≤10): |
| · `n` | urinish raqami |
| · `option`, `answer` | bosilgan variant indeksi va matni |
| · `correct` | bu urinish to'g'rimi |
| · `elapsed_ms` | savol ko'ringanidan bosishgacha o'tgan vaqt, millisekund |
| · `at` | bosish vaqti (UTC ISO) |

Jonli darsda har savolga bitta urinish (`solved = correct`). Mustaqil rejimda o'quvchi to'g'ri topguncha bosadi — hamma bosish yoziladi.

### 1.3 `achievements[]` — nishonlar

| Maydon | Ma'nosi |
|---|---|
| `id` | Nishon kodi (`storybuilder`, `graduate` …) |
| `name` | O'yin-nomi (`Story Pro!`, `Level Up!`) |
| `title` | Nima uchun berilgani, o'quvchi tilida («Ustaxonada 3/3 User Story yozdingiz») |
| `earned_at` | Olingan vaqt (UTC ISO) |

Har darsda 4 ta nishon, hammasi **real** harakatga beriladi: birinchi to'g'ri javob · ustaxona artefakti · koding topshirig'i · darsni yakunlash (darsga qarab farq qiladi).

### 1.4 `answers[]` — xom javoblar (eski shakl, saqlanib qolgan)

Har element: `stage` (savol turi: `module-mikro` · `final` · `practice`), `screenIdx`, `question`, `options`, `correctIndex`, `correctAnswer`, `picked`, `studentAnswer`, `correct`, `firstAttemptCorrect`, `solved`, `lastPicked`.
Ustaxona (practice) ekranida: `practice` (ustaxona nomi) va **`cards`** — o'quvchi yozgan artefakt (masalan 3 ta User Story matni). Bu hamma darsda bir xil emas — PM darslarining ko'pida bor, texnik darslarda kamroq.
Mentor javobni doskaga chiqargan bo'lsa: `mentorRevealed: true`.

### 1.5 Uyga vazifa paketi (18 ta) — alohida `onFinished`

| Maydon | Ma'nosi |
|---|---|
| `lessonId` | Paket kodi (`pm-m1-02`) |
| `kind` | `homework` |
| `done` | Bajarildimi (bosqichlar yetarli bo'lsa) |
| `stages` | `"4/4"` — nechta bosqich bajarildi |
| `place` | O'quvchi yozgan asosiy javob (masalan KIM qatori) |
| `durationSec` | Sarflangan vaqt |

Bosqichlar ichidagi matnlar (suhbat javoblari, xulosa) hozir yuborilmaydi — qo'shsa bo'ladi (3-bo'lim).

### 1.6 Eslatma: School API orqali ketayotgani (bizning server, jonli LMS darslari)

Bu `onFinished` dan alohida kanal, u allaqachon ishlayapti: `student_id`, `correct_answers`, `answered`, `rank` (1–3), `badges[]` (`first_try`, `speedster`, `top_1..3`, `graduate`, `comeback`, `arena_top_N`, `participant`), `duration_sec`, `completed`. Bu yerda o'zgarish kerak emas.

---

## 2. Shu maydonlardan qanday analitika chiqadi (tayyor formulalar)

| Savol | Qayerdan olinadi |
|---|---|
| O'quvchi nechta xato qilib, keyin to'g'ri topdi? | `solved = true` va `correct = false` → xatolar soni = `attempts.length − 1` |
| Qaysi savolda sinf eng ko'p xato qiladi? | Har savol bo'yicha `correct = false` ulushi (`question_id` barqaror — darslar orasida solishtirsa bo'ladi) |
| Qaysi noto'g'ri variantga ko'p bosiladi? | `attempts[].option` taqsimoti, `correct_option` dan boshqa |
| Savolga qancha o'ylab javob berdi? | `attempts[0].elapsed_ms` (birinchi bosish) · o'rtacha `elapsed_ms` |
| Tez, lekin xato bosdimi (taxmin qildimi)? | `elapsed_ms` kichik + `correct = false` |
| Dars qancha vaqt oldi? | `durationSec` · `attempts[].at` bo'yicha savollar orasidagi oraliq |
| Nishonlarni qachon oldi? | `achievements[].earned_at` |
| Arena (jang) natijasi? | `kind = arena` savollar: to'g'ri/xato, vaqt |
| Mustaqil yoki jonli o'tdimi? | `liveMode` (27 dars) · yoki `attempts.length > 1` bo'lsa mustaqil |
| Qaysi tilda o'qidi? | `lang` |
| Artefaktda nima yozdi? | `answers[].cards` (bor darslarda) |
| Uyga vazifani bajardimi, qanchasini? | `done`, `stages`, `place` |

---

## 3. Darsda BOR, lekin hali yuborilmayapti — so'rasangiz qo'shamiz

Hammasi umumiy modulda (`src/live/`) qilinadi va 97 darsga bir xil tarqaladi. Muddat — kelishilgach.

| # | Nima | Qayerda turibdi | Qo'shish |
|---|---|---|---|
| 1 | **Qaytadan o'tish** — o'quvchi «Qaytadan» bosdimi, ikkinchi o'tishda natija qanday | `firstPass` saqlovi; hozir faqat birinchi o'tish ketadi | oson |
| 2 | **Nechanchi ekranga yetdi / jami ekran** — darsning qayerida turgan | `progress` saqlovi (`screen`, `total`) | oson — yakunda; **yakunlamagan o'quvchi uchun** alohida hodisa kerak (4-bo'lim) |
| 3 | **Refleksiya matni** — «bugun nimani o'rgandim» qatori | PM darslarida localStorage | oson |
| 4 | **Ustaxona artefaktlari** — hamma darsda bir xil shaklda (`cards`) | hozir ba'zi darslarda `answers` ichida, ba'zilarida yo'q | o'rtacha (darslarni bir xil qilish) |
| 5 | **Koding topshirig'i** — bajarildimi, nechta urinish, yozgan kodi | kompilyator holati; hozir faqat nishon orqali bilinadi | o'rtacha |
| 6 | **Uyga vazifa bosqichlari matni** — suhbat javoblari, xulosa | paket saqlovi (`data`) | oson |
| 7 | **`nickname` / `livePin` / `liveMode`** — hamma 97 darsda bir xil | 27 darsda bor | oson |
| 8 | **Ekranda qancha vaqt turdi** (har ekran uchun) | hozir hisoblanmaydi | o'rtacha (yangi hisoblagich) |
| 9 | **Flashcard (takrorlash kartalari) ochildimi, nechta** | hozir hisoblanmaydi | o'rtacha |
| 10 | **Kompilyatorda maslahat (hint) nechta marta ochildi** | hozir hisoblanmaydi | o'rtacha |
| 11 | **Xato qilingan savollar ro'yxati** (`missed`) alohida maydon sifatida | saqlovda bor; `questions[]` dan ham chiqadi | oson (aslida kerak emas — 2-bo'lim formulasi bor) |

---

## 4. Halol cheklovlar — bera olmaydigan yoki boshqacha bo'ladigan narsalar

1. **Yakunlamagan o'quvchi haqida `onFinished` da hech narsa ketmaydi.** `onFinished` faqat oxirgi ekranda ishlaydi. O'quvchi darsni yarmida tashlab ketsa, LMS hech narsa olmaydi. Buning yechimi bitta: LMS tomonida oraliq hodisa (masalan `onProgress`) qabul qilinsa, biz har ekranda holatni yuboramiz. Hozirgi kontraktda bunday hodisa yo'q.
2. **Ma'lumot brauzerda yig'iladi.** Urinishlar tarixi `localStorage` da turadi; o'quvchi boshqa kompyuterdan davom etsa, oldingi urinishlar tarixi yo'qoladi (ball va `correct` saqlanadi, `attempts[]` qisqaradi).
3. **`elapsed_ms` — savol ko'ringanidan bosishgacha.** O'quvchi tabni almashtirib ketgan vaqt ham shu ichida. «Sof o'ylash vaqti» emas.
4. **Ko'rish rejimida qayta ochilsa `onFinished` yana ketishi mumkin** (aynan o'sha yuk). Takrorni LMS tomonida `lessonId + student` bo'yicha ajratish kerak; xohlasangiz, biz tugagan urinishda qayta yuborishni to'samiz.
5. **O'quvchi kimligini biz bilmaymiz.** JSX'da ism, guruh, ID yo'q — bularni LMS o'zi biriktiradi.
6. **Arena faqat jonli darsda yoziladi.** Mustaqil rejimda arena mashq, natijasi ketmaydi.
7. **Artefakt va refleksiya hamma darsda yo'q.** Texnik darslarda (HTML, JS, React, Node) ustaxona — kompilyatordagi kod, matnli karta emas; u yerda «artefakt» kod bo'ladi (3-bo'lim, 5-band).
8. **Ma'lumot faqat dars ichida bo'lgan narsa haqida.** O'quvchi darsdan oldin va keyin LMS'da nima qilgani, sahifani necha marta ochgani, qaysi qurilmadan kirgani — bizga ko'rinmaydi.
9. **Hech qanday ovoz, kamera, ekran yozuvi yo'q va bo'lmaydi.**
10. **Shakl chegaralari (08.09 da kelishilgan):** ≤200 savol, bir savolga ≤10 urinish, ≤6 variant, matn ≤300 belgi, ≤20 nishon. Undan ko'pi saqlanmaydi.

---

## 5. Sizdan nima kerak

1. 3-bo'limdan qaysi bandlar kerak — raqamlarini ayting.
2. Yakunlamagan o'quvchi ma'lumoti kerak bo'lsa — LMS tomonida oraliq hodisani qabul qilish mumkinmi?
3. Shaxzod: analitikada qaysi savollarga javob kutyapsiz — 2-bo'lim jadvaliga solishtirib, yetishmaganini aytamiz.
