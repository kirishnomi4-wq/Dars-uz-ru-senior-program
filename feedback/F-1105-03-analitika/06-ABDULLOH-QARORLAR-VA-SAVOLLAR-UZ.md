# Abdullohga: JSX darslar analitikasi — Shahzoda bilan kelishilgan qarorlar va savollar

**Sana:** 05.11.2026
**Asos:** Shahzodaning 03.11 hujjati («окончательный список», 25 band) va bugungi uch xat almashuvi (fayllar ilovada)
**Bizning tomon:** 172 darsni o'zimiz yangi versiyada yig'ib, LMS'ga o'zimiz yuklaymiz.

Mahsulot tomoni yopildi: Shahzoda hamma bandni qabul qildi va «ishni boshlashingiz mumkin» dedi.
Endi server, LMS va CRM tomonini siz bilan yopishimiz kerak. Siz bilan kelishib olmaguncha kod yozmaymiz.
Javob bo'yicha har band uchun muddatlarni ham sizdan so'raymiz — Shahzoda sana kutyapti.

---

## 0. Hozirgi holat — tekshirilgan faktlar

1. **Prod'da `RESULT_DETAILS=a` yoqilgan** (`/api/v1/health` → `"result_details":"a"`). Konteyner 02.11 taxminan 14:47 UTC dan beri ishlayapti.
   02.11 dagi xatimizda «off» degan edik, demak shu kuni yoqilgan. CRM'da baribir hech narsa ko'rinmayapti.
2. **Jonli sessiya qachon o'zi yopiladi.** Mentor ekrani har 10 soniyada signal yuboradi. Signal `STALE_SESSION_MINUTES` (standart 30) daqiqa kelmasa, sessiya yopiladi.
   Tekshiruv har 15 daqiqada ishlaydi, shuning uchun amalda 30–45 daqiqa o'tadi. Uyda (solo) urinish 7 kunda yopiladi.
3. **Hozir natija qachon ketadi:**
   - server → School API: jonli darsda sessiyaga bitta xabar, sessiya yopilganda; uyda — oxirgi ekranga yetganda;
   - brauzer → LMS-front (`onFinished`): faqat «Darsni yakunlash» bosilganda. Learn qarori shu yerdagi `codestrike` blokidan chiqadi.
4. **Arena darsning oxirgi ekranida** («Tayyor» ekranidagi CodeStrike tugmasi). «Oxirgi ekranga yetdi» har doim arenadan oldin bo'ladi.
5. **Shahzodaning misolidagi `netlify-01-v3` bizning namunamiz edi.** Haqiqiy kod — `netlify-deploy-v19`.

---

## 1. Shahzoda bilan kelishilgan qarorlar — sizga tegishlilari

| # | Qaror | Sizga ta'siri |
|---|---|---|
| Q1 | **Natija tugmaga bog'liq emas.** Oxirgi ekran → dars natijasi avtomatik. Mentor arenani yopdi → CodeStrike natijasi darhol | Yangi yuborish mantiqi — 2-bo'lim savollari |
| Q2 | **Oxirigacha yetmagan o'quvchining ma'lumoti ham ketadi** — sessiya yopilganda | Sessiya yopilishi ishonchli bo'lishi kerak (2.14) |
| Q3 | **Learn testi oxirigacha yetmaganlarga ham ochiladi** (arenada ≥7 olmagan yoki o'ynamagan bo'lsa). Shahzoda uchun eng muhim band | LMS mantiqi — senda |
| Q4 | **Yetkazish — A yo'l:** analitika jamoasi bizning bazani CoddyCamp konnektori orqali faqat o'qiydi, tayyor view'lar bilan. Ism va kontakt yo'q, faqat id | Read-only rol, tarmoq, konnektor ulanishi (3-bo'lim) |
| Q5 | **O'quvchi yozgan matn** (kod, teg, 300 belgigacha) faqat bizning bazada turadi. Konnektorga faqat umumlashgan ro'yxat chiqadi: bir topshiriqda kamida 5 o'quvchida bir xil chiqqan noto'g'ri javob va uning soni | View darajasida qilamiz; bazaga kirish huquqi faqat jamoada |
| Q6 | **Practice:** har qadamning «Bajardim»i alohida; tekshiruvsiz practice'da `correct` bo'sh (`null`), `false` emas | Bazada `answer_attempts.correct` hozir `NOT NULL` — migratsiya kerak |
| Q7 | `opened_at` faqat yangi versiyadan boshlab yoziladi, eskida `null` | Yangi ustun |
| Q8 | **CRM id'lari view'ga reestrdan qo'shiladi:** `lms_question_id` (14085 uz / 14086 ru), Class id (2429), Learn id (3170) | Darsga va LMS'ga tegilmaydi |
| Q9 | **Arena → Learn savoli** tartib raqami bo'yicha bog'lanadi: uz 1–12, ru 13–24 (Netlify: 17935–17946 va 17947–17958). Arena savoli o'zgarsa, Learn qayta yuklanadi va tartib raqamlari saqlanadi | 2.16-savol |
| Q10 | Barcha vaqtlar UTC, ISO-8601 | O'zgarish yo'q |

---

## 2. Yuborish mantiqi — aniqlashtiramiz

Har savolda taklifimiz bor. «Ha» yoki o'z variantingizni yozsangiz yetadi.

**2.1. Qaysi kanal?** a) brauzer (`onFinished`) · b) server (`lesson-results`) · c) ikkalasi.
*Taklif:* asosiy kanal — **server**. Brauzer yopilsa yoki internet uzilsa, brauzerdan xabar ketmaydi. Server `reached_end` va `quiz_done_at` ni o'zi biladi, qayta urinish navbati ham bor. `onFinished` zaxira bo'lib qoladi.
Bunda LMS Learn qarorini server xabaridan olishi kerak — bunga rozimisiz?

**2.2. Jonli darsda 1-xabar.** a) har o'quvchiga alohida, o'zi oxirgi ekranga yetganda · b) butun sinfga bitta, mentor oxirgi ekranga o'tganda.
*Taklif:* (a) — har o'quvchining testi o'z vaqtida ochiladi.

**2.3. Oxirigacha yetmagan o'quvchi.** Sessiya yopilganda unga `completed: false` va «qaysi ekrangacha yetdi» bilan xabar ketadi. LMS Learn'ni unga ochadi (Q3). Shundaymi?

**2.4. 1-xabardan keyin o'quvchi orqaga qaytib javob bersa.** Tanga va ball 1-xabardagidek qoladi, yangi javoblar faqat bazada yoziladi — shundaymi?

**2.5. 1-xabar kelganda LMS Learn bilan nima qiladi?**
- a) darhol ochadi. Bunda o'quvchi testni boshlab qo'ysa-yu, keyin arenada ≥7 olsa nima bo'ladi?
- b) arenani kutadi. Bunda qancha kutadi va arena o'ynalmasa nima bo'ladi?

**Eng muhim savol shu — qolganlari unga bog'liq.**

**2.6. Arena umuman o'ynalmasa.** Sessiya yopilganda `played: false` bilan 2-xabar ketsinmi, LMS kutishni to'xtatishi uchun?

**2.7. Mentor arenani yopmasa** (tabni yopdi, interneti uzildi). *Taklif:* oxirgi savol vaqti tugaganidan N daqiqa keyin yoki sessiya yopilganda arena avtomatik yopiladi. N qancha bo'lsin?

**2.8. Darsda bo'lib, arenaga kirmagan o'quvchi** 2-xabarda `played: false` bilan bo'ladimi?

**2.9. Tanga ikki marta berilmasin.** Ikki xabar ikki xil `event_id` bilan ketadi: dars — `sess_<pin>_<vaqt>`, arena — `sess_<pin>_<vaqt>_arena`.
Dars tangasi faqat 1-xabardan, podium tangasi faqat 2-xabardan — shundaymi? School API ikkinchisini alohida tur deb taniydimi?

**2.10. Takroriy dars.** Hozir bu dars bo'yicha natijasi bor o'quvchi yangi xabardan chiqariladi. Arena xabarida ham shu qoida turadimi?

**2.11. Uyda (solo)** arena 29.10 dan yopiq — faqat 1-xabar ketadi. Tasdiqlaysizmi?

**2.12. «Qaytadan» bosib qayta o'tsa** 1-xabar qayta ketmaydi, birinchi natija turadi. Tasdiqlaysizmi?

**2.13. Arena xabari formati.** Yangi endpoint bo'ladimi yoki o'sha `lesson-results` ichida `arena` bloki? School API (Laravel) validatori yangi maydonlarni qabul qiladimi?

**2.14. Yangi: mentor tabi ochiq qolsa sessiya hech qachon yopilmaydi.** Signal kelaveradi — oxirigacha yetmaganlarning ma'lumoti (Q2) ketmaydi.
*Taklif:* sessiyaga eng ko'p muddat — masalan, boshlanganidan 4 soat o'tgach avtomatik yopiladi. Muddat qancha bo'lsin?

**2.15. Prod'da `STALE_SESSION_MINUTES` qancha?** Shahzoda shu vaqtni hujjatda yozishni so'radi: ular bu vaqtgacha ma'lumotni «hali kelmagan» deb hisoblaydi.

**2.16. Learn savolini almashtirsak, uning id'si o'zgaradi.** 02.11 da (Pre-Demo) eski savol Archive bo'lgan, yangisi o'sha tartib raqami bilan, lekin yangi id bilan yaratilgan.
- CRM'da savolni joyida tahrirlab, id'ni saqlab qolish mumkinmi?
- Mumkin bo'lmasa, Shahzodaga «faqat Active savollarni oling» deymiz — to'g'rimi?

---

## 3. A yo'l — bazaga o'qish huquqi

**3.1.** Read-only rolni va tarmoqni kim qiladi? Konnektor bazaga qanday ulanadi — baza LMS serverida turibdi. View'larni biz yozamiz.

**3.2.** A yo'lda yangi maydonlar faqat bizning bazaga yoziladi, School API'ga yangi narsa yuborilmaydi — shundaymi?
(Istisno faqat 2.13 dagi arena xabari, chunki Learn va tanga uchun kerak.)

**3.3. 02.11 dan beri detallar ketyapti.** School API qanday javob beryapti (200 yoki 422)? Saqlayaptimi?
25.09 da Axadulla ochgan `jsx_lesson_*` jadvallari to'lyaptimi? A yo'l tanlangani uchun bu endi asosiy emas, lekin holatini bilishimiz kerak.

---

## 4. GW 69 tasdig'i (Shahzoda kutyapti)

**4.1.** Sessiyani prod bazadan siz topasizmi yoki bizga kirish berasizmi? SQL tayyor — ilovada.

**4.2.** Oktyabr yig'masi: nechta xabar yaratilgan, yetkazilgan, `skipped`, xato bilan tugagan. SQL ilovada.

**4.3.** Testi «yopiq» qolgan 5 o'quvchining LMS id'larini siz olasizmi yoki Shahzodadan so'raymizmi?

---

## 5. id'lar

**5.1.** Bizdagi `student_id` — LMS tokenidagi `sub`. Shahzoda tekshirgan: CRM'da `student_lesson_access.user_id` va `student_question_practice.student_id` — bu `student_students.id`.
**`sub` = `student_students.id` mi?** Shunday bo'lsa, CRM bilan bog'lashni ular o'zi qiladi.

**5.2.** `lms_participants.crm_id` to'lyaptimi, qayerdan keladi?

(Dars id'lari hal bo'ldi: 2429 — `student_lessons.id` (Class), 14085/14086 — `student_questions.id` (`lesson-runner`), 3170 — Learn.)

---

## 6. `codestrike_source_log_id`

LMS arena bo'yicha avtozachyot qilganda bu ustunga nima yozadi?
*Taklif:* arena xabarining `event_id` si (2.9). Buni LMS tomonida siz qilasizmi?

---

## 7. Ish taqsimoti va muddatlar

**7.1. dars-api kodini kim yozadi?** Taklif: biz yozamiz (yuborish mantiqi, yangi ustunlar, migratsiyalar, view'lar), siz ko'rib chiqasiz va prod'ga chiqarasiz. Shundaymi?

**7.2. Sizning qismlaringiz uchun muddat:** LMS'dagi Learn mantiqi (Q3, 2.5), konnektorga kirish (3.1), `codestrike_source_log_id` (6), prod deploy.

**7.3.** 172 darsni yuklash vaqti — dars paytida emas. Qaysi kun va soat qulay?

---

## Ilova A: xat almashuvi (hammasi `feedback/F-1105-03-analitika/` da)

| Fayl | Kimdan | Mazmuni |
|---|---|---|
| `jsx-dannie-okonchatelno.md` (Telegram) | Shahzoda, 03.11 | 25 band, P1/P2 |
| `01-VOPROSY-Shahzoda-RU.md` | biz | 8 savol |
| `03-OTVETY-Shahzoda-RU.md` | Shahzoda | javoblar + 13 qo'shimcha talab |
| `04-SHAHZODA-QABUL-VA-ANIQLASHTIRISH-UZ.md` | biz | qabul qilingan narsalar + 4 savol |
| `05-SHAHZODA-JAVOB-UZ.md` | Shahzoda | yakuniy qarorlar, «boshlashingiz mumkin» |

## Ilova B: SQL (prod bazada faqat o'qish; ism/nik chiqarilmaydi)

```sql
-- 1) GW 69 sessiyasini topish (21.10, Toshkent vaqti)
select s.id as session_id, s.pin, s.lesson_id, s.gid, s.teacher_id,
       s.started_at, s.finished_at, s.status, s.end_reason, ls.quiz_done_at
  from lms_sessions s
  join live_sessions ls on ls.pin = s.pin
 where s.gid = 1030
   and s.started_at >= '2026-10-21 00:00+05' and s.started_at < '2026-10-22 00:00+05'
 order by s.started_at;

-- 2) Sessiyadagi LMS o'quvchilar: kirgan vaqti, oxirigacha yetdimi, qaysi ekranda qoldi
select p.subject_id, p.crm_id, p.joined_at,
       a.status, a.finish_reason, a.reached_end, sp.screen, sp.total
  from lms_participants p
  left join attempts a          on a.id = p.attempt_id
  left join student_progress sp on sp.attempt_id = a.id
 where p.session_id = :session_id and p.role = 'student'
 order by p.subject_id;

-- 3) Kirganlarning hammasi, PIN bilan (LMS'siz) kirganlar ham
select lp.id as player_id, lp.joined_at, (p.id is not null) as has_lms_account
  from live_players lp
  left join lms_participants p on p.player_id = lp.id
 where lp.pin = :pin;

-- 4) Javoblar: dars savollari (< 100) va arena (>= 100), har urinish bilan
select aa.player_id, aa.question_id, aa.screen_idx, aa.attempt_no,
       aa.correct, aa.elapsed_ms, aa.answered_at
  from answer_attempts aa
 where aa.pin = :pin
 order by aa.player_id, aa.screen_idx, aa.attempt_no;

-- 5) Yuborilgan xabar tanasi va yetkazish holati (School API javobi bilan)
select event_id, status, students_count, send_attempts, last_http_status,
       last_error, delivered_at, response, payload
  from result_events
 where session_id = :session_id;

-- 6) Oktyabr yig'masi: nechta xabar, qaysi holatda
select mode, status, count(*) as events, sum(students_count) as students
  from result_events
 where created_at >= '2026-10-01 00:00+05' and created_at < '2026-11-01 00:00+05'
 group by mode, status
 order by mode, status;

-- 7) 02.11 dan keyin: detallar ketyaptimi va School API nima deyapti
select last_http_status, status, count(*) as events,
       count(*) filter (where payload->'students'->0 ? 'questions') as with_details
  from result_events
 where created_at >= '2026-11-02 14:47Z'
 group by last_http_status, status
 order by events desc;
```

SQL ustunlari migratsiyalar (0001–0010) bilan solishtirilgan, lekin bazada hali yurgizilmagan.
