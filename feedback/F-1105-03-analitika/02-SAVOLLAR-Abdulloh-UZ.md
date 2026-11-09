# Abdullohga savollar: JSX darslar analitikasi (server · LMS · CRM)

**Sana:** 05.11.2026
**Asos:** Shahzodaning 03.11 hujjati «Данные JSX-уроков, которых нет в CRM: окончательный список»
**Bizning tomon:** 172 darsni o'zimiz yangi versiyada yig'ib, LMS'ga o'zimiz yuklaymiz.

Mahsulotga oid savollar (practice/code, checkpoint kaliti, til, o'rin) Shahzodaga alohida ketdi.
Bu faylda faqat server, LMS va CRM tomonidagi savollar.

---

## 0. Hozirgi holat — 05.11 da tekshirilgan faktlar

1. **Prod'da `RESULT_DETAILS=a` yoqilgan.** `https://dars-api.coddycamp.uz/api/v1/health` → `"result_details":"a"`.
   Konteyner uptime bo'yicha 02.11 taxminan 14:47 UTC dan beri ishlayapti.
   02.11 dagi xatimizda «prod'da `off`» degan edik. Demak shu kuni kimdir yoqqan.
2. **Bizning bazada bor jadvallar:** `lms_sessions` (guruh, mentor, vaqtlar) · `lms_participants` (o'quvchi, `crm_id`, kirgan vaqti) ·
   `live_players` (PIN bilan kirganlar ham) · `live_answers` (birinchi javob) · `answer_attempts` (har urinish, matnlar) ·
   `attempts` + `student_progress` (`reached_end`, joriy ekran) · `live_sessions.quiz_done_at` (arena yopilgan vaqt, 28.10 dan) ·
   `result_events` (har xabar: holati, HTTP javobi, `response`).
   Javoblar o'chirilmaydi — 90 kundan keyin faqat ismlar o'chadi.
3. **Arena darsning oxirgi ekranida turadi** (CodeStrike tugmasi «Tayyor» ekranida).
   Demak «oxirgi ekranga yetdi» har doim arenadan oldin bo'ladi.
4. **Hozir natija qachon ketadi:**
   - server → School API: jonli darsda **sessiyaga bitta xabar** — mentor sessiyani yopganda yoki sessiya eskirib yopilganda; uyda — oxirgi ekranga yetganda;
   - brauzer → LMS-front (`onFinished`): o'quvchi «Darsni yakunlash»ni bosganda, bir marta (yuk muhrlanadi). Learn testi qarori shu yerdagi `codestrike` blokidan chiqadi.
5. **Shahzodaning misolidagi `netlify-01-v3` bizning 02.11 xatimizdagi namuna edi, haqiqiy kod emas.**
   Haqiqiy kod — `netlify-deploy-v19`. Shahzodaga ham shuni yozdik.

---

## 1. Yangi mantiq: tugmasiz avtomatik yuborish

**Kelishuvimiz:**
- o'quvchi oxirgi ekranga yetdi → dars natijasi avtomatik ketadi (CodeStrike'siz);
- jonli darsda mentor arenani yopdi → darhol ikkinchi xabar, CodeStrike natijasi bilan.

Quyidagi holatlarni aniqlab olishimiz kerak. Har birida taklifimiz bor.

**1.1. Qaysi kanal orqali?**
- a) brauzer (`onFinished` → LMS-front);
- b) server (`lesson-results` → School API);
- c) ikkalasi ham.

*Taklif:* asosiy kanal — **server**. Brauzer yopilsa yoki internet uzilsa, brauzerdan xabar ketmaydi. Server esa `reached_end` va `quiz_done_at` ni o'zi biladi, qayta urinish navbati ham bor.
`onFinished` zaxira bo'lib qoladi. Lekin bunda LMS Learn qarorini server xabaridan olishi kerak bo'ladi — bunga rozimisan?

**1.2. Jonli darsda 1-xabar kimga, qachon ketadi?**
- a) har o'quvchiga alohida — o'zi oxirgi ekranga yetgan zahoti;
- b) butun sinfga bitta — mentor oxirgi ekranga o'tganda.

*Taklif:* (a). Har o'quvchining testi o'z vaqtida ochiladi.

**1.3. Oxirgi ekranga yetmagan o'quvchi** (chiqib ketdi, telefoni o'chdi). Sessiya yopilganda unga `completed: false` bilan xabar ketsinmi? Learn testi unga ochiladimi?

**1.4. 1-xabardan keyin o'quvchi orqaga qaytib javob bersa.** Tanga va ball 1-xabardagidek qoladi, yangi javoblar faqat bazada yoziladi — shundaymi?

**1.5. 1-xabar kelganda LMS Learn testi bilan nima qiladi?**
- a) darhol ochadi. Bunda o'quvchi testni boshlab qo'ysa-yu, keyin arenada ≥7 olsa — nima bo'ladi?
- b) arena natijasini kutadi. Bunda qancha kutadi, arena o'ynalmasa nima bo'ladi?

**1.6. Arena umuman o'ynalmasa.** Sessiya yopilganda `played: false` bilan 2-xabar ketsinmi, LMS kutishni to'xtatishi uchun? Yoki 2-xabar umuman ketmaydimi?

**1.7. Mentor arenani yopmasa** (tabni yopdi, interneti uzildi). 2-xabar qachon ketadi?
*Taklif:* oxirgi savol vaqti tugaganidan N daqiqa o'tgach yoki sessiya yopilganda arena avtomatik yopiladi. N qancha bo'lsin?

**1.8. Darsda bo'lib, arenaga kirmagan o'quvchi.** 2-xabarda u `played: false` bilan bo'ladimi?

**1.9. Tanga ikki marta berilmasin.** Ikki xabar ikki xil `event_id` bilan ketadi, masalan:
- dars: `sess_<pin>_<vaqt>`;
- arena: `sess_<pin>_<vaqt>_arena`.

School API ikkinchisini alohida tur deb taniydimi? Dars tangasi faqat 1-xabardan, podium tangasi faqat 2-xabardan — shundaymi?

**1.10. Takroriy dars.** Hozir bu dars bo'yicha natijasi bor o'quvchi yangi xabardan chiqariladi. Arena xabarida ham shu qoida turadimi?

**1.11. Uyda (solo).** Arena 29.10 dan beri uyda yopiq, demak faqat 1-xabar ketadi. Tasdiqlaysanmi?

**1.12. «Qaytadan» bosib qayta o'tsa.** 1-xabar qayta ketmaydi, birinchi natija turadi. Tasdiqlaysanmi?

**1.13. Arena xabari formati.** Yangi endpoint bo'ladimi yoki o'sha `lesson-results` ichida `arena` bloki? School API (Laravel) validatori yangi maydonlarni qabul qiladimi?

---

## 2. A yoki B yo'l, yangi maydonlar qayerga

**2.1. A yo'l** — dars-api bazasini CoddyCamp konnektoriga faqat o'qish huquqi bilan ochish. Shuni tanlaymizmi?
Agar ha: view'larni biz yozamiz. Read-only rolni va tarmoqni (konnektor bazaga qanday ulanadi) kim qiladi?

**2.2. A tanlansa, yangi maydonlar qayerga yoziladi?** Gap `joined_at`, `skipped`, `opened_at`, `arena` bloki, practice/code va doimiy checkpoint kaliti haqida.
- a) faqat bizning bazaga — School API'ga yubormaymiz;
- b) bazaga ham, School API'ga ham.

**2.3. B qismi: detallar 02.11 dan beri ketyapti.**
- School API ularga qanday javob beryapti (200 yoki 422)?
- Saqlayaptimi?
- 25.09 da Axadulla `school` bazasida 4 ta jadval ochgan edi: `jsx_lesson_results`, `jsx_lesson_questions`, `jsx_lesson_attempts`, `jsx_lesson_achievements`. Ular to'lyaptimi? Konnektorda nega ko'rinmayapti?

---

## 3. GW 69 tekshiruvi (Shahzoda hujjatining 5-bo'limi)

**3.1.** Sessiyani bazadan kim topadi: sen yurgizasanmi (prod bazaga kirishing bor) yoki bizga kirish berasanmi? SQL tayyor — pastda, ilovada.

**3.2.** Oktyabr yig'masi uchun ham SQL tayyor: nechta xabar yaratilgan, yetkazilgan, `skipped`, xato bilan tugagan.

**3.3.** Testi «yopiq» qolgan 5 o'quvchining LMS id'lari kerak. Ularni sen LMS'dan olasanmi yoki Shahzodadan so'raymizmi?

---

## 4. id'lar

**4.1. O'quvchi.** Bizdagi `student_id` — LMS tokenidagi `sub`. CRM'da `student_students` jadvali bor (`user_id` = `student_list.ID`).
`sub` = `student_students.id` mi? Agar shunday bo'lsa, LMS → CRM mosligi CRM ichida tayyor, biz qo'shimcha hech narsa qilmaymiz.

**4.2.** Bizdagi `lms_participants.crm_id` to'lyaptimi? Qayerdan keladi?

**4.3. Dars.** Shahzodaning hujjatida dars `2429` (`student_lessons.id`), bizning reestrda shu dars `14085` (uz) va `14086` (ru). Bular qanday bog'langan?

---

## 5. `codestrike_source_log_id`

LMS arena bo'yicha avtozachyot qilganda bu ustunga nima yozadi?
*Taklif:* arena xabarining `event_id` si (1.9) yoki `game_id` (jonli sessiya id'si).
Buni LMS tomonda sen qilasanmi?

---

## 6. Bizning tomonda nima qilinadi (ma'lumot uchun)

Javoblardan keyin umumiy `src/live` modulida qilamiz:
- oxirgi ekranga yetganda avtomatik yuborish;
- arena yopilganda alohida xabar;
- practice/code yozuvlari;
- `opened_at`;
- doimiy checkpoint kaliti;
- arena savollari matni.

Server tomonida: `joined_at`, `skipped`, `arena` bloki, to'liq o'rin, A yo'l uchun view'lar.

Avval bitta darsda sinaymiz, keyin 172 darsni yig'amiz.

**6.1.** 172 darsni yuklash vaqtini sen bilan kelishamiz — dars paytida emas. Qaysi vaqt qulay?

---

## Ilova: SQL (prod bazada faqat o'qish; ism/nik chiqarilmaydi)

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
