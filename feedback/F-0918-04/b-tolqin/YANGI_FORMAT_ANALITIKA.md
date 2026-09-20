# YANGI FORMAT — ANALITIKANI AVTOMATLASHTIRISH (kechki suhbat uchun, 20.09)

> Foydalanuvchi 20.09: «kechga darslarni boshlaymiz yangi format — supabase emas, analitika to'liq avtomatlashtirish,
> yangi versiyaga o'tish». Bu fayl — qaror uchun: hozir nima bor, nima yo'q, qanday variantlar va mendan qanday savollar.
> Hech narsa qilinmagan — faqat o'qib chiqildi (kod + migratsiyalar + admin API).

## 1. Supabase — yopiq

Kodda **hech qanday bog'liqlik yo'q**: `@supabase/*` paketi yo'q, chaqiruv yo'q. Qolgani — faqat izohlardagi tarix
eslatmalari (`src/live/liveClient.js:1`, `server/migrations/0001_live_core.sql:1`) va ildizdagi arxiv `supabase/*.sql`.
Jonli mexanika 2026-09 da o'z serverimizga (`dars-api` + PostgreSQL) to'liq ko'chgan. **Ya'ni «supabase emas» — bu
allaqachon bajarilgan.** Qolgan ish — analitika.

## 2. Hozir ma'lumot qanday yig'ilyapti (zanjir)

| Kanal | Yo'l | Qayerda qoladi |
|---|---|---|
| **Jonli dars** | dars → `submit_answer` / `record_attempt` → server to'g'rilikni **o'zi** hisoblaydi (kalitlar bazada) | `live_answers` (ball), `answer_attempts` (har bosish, 10 tagacha) |
| **Uyda (solo)** | xuddi shu RPC + `PUT /me/progress` (2 s kechikish bilan) | `live_answers`, `student_progress`, `attempts` |
| **Rasmiy natija** | navbat (`result_events`) → ishchi har 5 s → School API | `result_events` (payload + yuborish tarixi, qayta urinishlar) |
| **`onFinished`** | dars brauzerda yig'adi (`resultDetails.js`) → LMS frontiga | **serverga tushmaydi** — faqat brauzerda |

LMS'ga ketadigan yukda: dars, guruh, o'qituvchi, boshlanish/tugash vaqti, savollar soni, har o'quvchi uchun to'g'ri javob,
o'rin, nishonlar, davomiylik, tugatganmi; `RESULT_DETAILS=a` bo'lsa — har savol bo'yicha variantlar, to'g'ri javob va
urinishlar tarixi.

## 3. Bo'shliqlar — ikki xil

**(a) Ma'lumot BOR, ko'rsatadigan joy yo'q** (ya'ni faqat so'rov va ekran yozish kerak):
- guruh va o'qituvchi kesimida hisobot (`gid`, `teacher_id` yozilgan, lekin filtr yo'q)
- vaqt bo'yicha dinamika (hamma vaqt-belgilari bor, kunlik/haftalik yig'ma yo'q)
- **dars qiyinchiligi** — qaysi savolda ko'p adashishadi (`live_answers.question_id + correct` bor)
- **tashlab ketish** — qaysi ekranda to'xtab qolishadi (`student_progress.screen`, `attempts.reached_end`)
- qayta urinishlar tahlili (`answer_attempts` bor, admin faqat sonini ko'rsatadi)
- **mentor jimligi** (`live_mentor_gaps` jadvali to'ladi, lekin uni hech kim o'qimaydi)

**(b) Umuman yig'ilmaydi:**
- nishon statistikasi qator sifatida (nishonlar faqat yuborilgan natija ichida, JSON bo'lib qoladi)
- `onFinished` tafsilotlari (brauzerda qoladi)
- so'rov-loglari o'chirilgan (`disableRequestLogging`)

**Ma'lumot o'chirilmaydi:** javoblar, urinishlar, sessiyalar — hech qachon. Faqat ism 90 kundan keyin o'chadi, tokenlar
va kesh muddatli.

## 4. Variantlar (tavsiya — birinchisi)

### V1 — «Ko'rinadigan analitika» (tavsiya, 1–2 kun, xavfsiz)
Bazaga TEGILMAYDI, faqat o'qish. Admin API'ga 4–5 ta yig'ma so'rov + bitta sahifa:
1. **Guruh/dars kesimi:** har dars bo'yicha o'rtacha ball, tugatganlar ulushi, o'rtacha vaqt.
2. **Savol-qiyinchiligi:** eng ko'p xato qilingan 10 savol (dars bo'yicha) — matn tuzatish uchun eng foydali.
3. **Tashlab ketish:** qaysi ekranda to'xtaganlar ko'p.
4. **Yuborish salomatligi:** navbatdagi xatolar, qayta urinishlar, kechikkan natijalar.
5. **Mentor jimligi:** jonli darsda 3 daqiqadan ortiq to'xtash bo'lgan sessiyalar.
- ✅ Foyda: darsni yaxshilash uchun birinchi marta **raqam** paydo bo'ladi.
- ⚠ Chegara: faqat biz ko'ramiz (admin sahifasi), o'qituvchiga ko'rinmaydi.

### V2 — «Avtomatik hisobot» (V1 ustiga, +1 kun)
Har kuni ertalab avtomatik xulosa (Telegram yoki fayl): kecha nechta dars o'tildi, o'rtacha ball, muammoli savollar,
yuborilmagan natijalar. Shundan keyin analitikani «qarash» kerak emas — o'zi keladi.

### V3 — «Katta versiya» (kelishuv va vaqt talab qiladi)
Alohida analitika sxemasi (tezlik uchun oldindan hisoblangan jadvallar), nishonlarni alohida jadvalga yozish,
`onFinished` tafsilotlarini serverga ham yuborish (LMS jamoasi bilan kelishuv kerak), o'qituvchi uchun alohida panel.

## 5. Kechqurun mendan javob kutadigan savollar

1. **«Yangi format» nimani anglatadi:** (a) faqat analitika avtomatlashtiriladi, darslar o'zgarmaydi · (b) dars
   tuzilishi/formati ham o'zgaradi · (c) ikkalasi.
2. **Kim ko'radi:** faqat siz/men (admin sahifasi) · o'qituvchi ham · CRM ichida.
3. **Qaysi savolga birinchi javob kerak:** «qaysi dars og'ir?» · «kim ortda qolyapti?» · «natijalar yetib bordimi?»
4. **V1 dan boshlaymizmi** yoki to'g'ridan-to'g'ri V3 (katta versiya) rejasini tuzamizmi?
5. **Dushanbadagi CRM-yuklash** shu ishdan oldinmi yoki keyinmi (hozirgi reja: avval CRM, keyin analitika).

## 6. Eslatma (halol chegara)

Bu faylda hech qanday o'lchov qilinmagan — faqat kod va migratsiyalar o'qilgan. Haqiqiy raqamlar (nechta dars, nechta
o'quvchi, qaysi savol og'ir) V1 qilingandan keyin ko'rinadi.

## 7. Ilova — V1 hisobotlarining so'rov-loyihasi (yozilmagan, faqat reja)

Hammasi FAQAT O'QISH (`select`), mavjud jadvallardan. Bazaga yangi jadval ham, migratsiya ham kerak emas.

| # | Hisobot | Manba | Asosiy kesim |
|---|---|---|---|
| 1 | Dars bo'yicha o'rtacha natija | `result_events.payload` (students[]) + `lesson_catalog` | dars · guruh · sana |
| 2 | **Savol-qiyinchiligi** | `live_answers` (question_id, correct) + `quiz_keys` | dars · savol → xato ulushi, urinishlar soni |
| 3 | Tashlab ketish | `attempts` (reached_end, finish_reason) + `student_progress.screen` | dars → qaysi ekranda to'xtaydi |
| 4 | Yuborish salomatligi | `result_events` (status, send_attempts, last_http_status) | kun · status |
| 5 | Mentor jimligi | `live_mentor_gaps` (hozir hech kim o'qimaydi) | sessiya · davomiylik |

Namuna (2-hisobot, eng foydalisi — darsni qayerda tuzatish kerakligini ko'rsatadi):

    select a.question_id,
           count(*)                                    as javob,
           sum(case when a.correct then 0 else 1 end)  as xato,
           round(100.0 * sum(case when a.correct then 0 else 1 end) / count(*), 1) as xato_foiz
      from live_answers a
      join lms_sessions s on s.pin = a.pin
     where s.lesson_id = $1 and a.screen_idx < 100
     group by a.question_id
     order by xato_foiz desc
     limit 10;

Qo'shimcha: `answer_attempts` bilan «birinchi urinishda to'g'ri» ulushini ham chiqarish mumkin — 151/153-qonun amalda
qanday ishlayotganini shu ko'rsatadi (nishon adolatli qiyinmi yoki juda og'irmi).

**Ish hajmi (taxmin):** 5 ta so'rov + admin sahifasiga 5 ta jadval — yarim kun; avtomatik kunlik xabar (V2) — yana yarim kun.
**Xavf:** yo'q darajada — yozish yo'q, mavjud endpointlarga tegilmaydi, faqat yangi `select` qo'shiladi.
