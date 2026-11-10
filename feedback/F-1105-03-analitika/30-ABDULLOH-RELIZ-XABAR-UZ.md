# F-1105-03 — Abdullohga: reliz xabari (10.11.2026, tayyor matn — foydalanuvchi yuboradi)

Kristina aralashtirilmaydi (foydalanuvchi qarori 10.11): staging sozlamasini ham Abdulloh hal qiladi, kerak bo'lsa o'zi Kristinaga aytadi.

---

Abdulloh, salom. 25-kontrakt bo'yicha Dars API va darslar tomoni tayyor. Bugun prod'ga chiqaramiz. Quyida nima tayyorligi, qanday yoqilishi va sizdan nima kerakligi.

## 1. Nima tayyor

**Dars API (server):**
- Uch hodisa, har biri bitta LMS o'quvchisiga, `schema_version: 2`:
  - `lesson_result` — `lr_<attempt_id>`: o'quvchi oxirgi ekranga yetganda darhol; yetmagan bo'lsa urinish yopilganda (mentor yopdi, sessiya eskirdi, 2 soat chegarasi, solo — 7 kun, dars versiyasi almashdi).
  - `arena_participation` — `ap_<attempt_id>`: o'quvchi ekranida birinchi arena savoli ko'ringanda (lobbi yoki tugma hisobga olinmaydi; kech kirgan — o'zi ko'rgan birinchi savol).
  - `arena_result` — `ar_<attempt_id>`: arena yakunida (mentor yopdi / 45 daqiqa / oxirgi savoldan 1 daqiqa); arena bo'lmagan bo'lsa sessiya yopilganda `not_started`.
- Yuborish: `POST …/lesson-results`; javob 201/200/409/422/413/401/403/429 (`Retry-After`)/5xx kontraktdagidek ishlanadi.
- Kuzatish: qabul qilingach `GET …/lesson-results/{event_id}` — 1, 5, 15, 60 daqiqada, keyin har soat, 24 soatgacha. 24 soatda qo'llanmasa — bizda tekshiruvga chiqadi.
- Qayta yetkazishda ID, vaqtlar va mazmun o'zgarmaydi. `student_arena_no` eski ID'larni ham hisobga olib bizda beriladi.
- Eski (v1) oqim o'zgarmagan, yangi bilan birga ishlaydi.

**Darslar (172 ta, shu bugun yuklanadi):**
- Har dars fayliga versiyasi yozilgan, u `join` orqali bizning serverga ketadi.
- Yangi formatdagi brauzer yuki (`onFinished`): `schema_version: 2`, `codestrike` yo'q, bog'lanish:
  ```json
  {"schema_version":2,"dars_api":{"attempt_id":"…","session_key":"sess_<pin>_<vaqt>","lesson_version":"v6","lesson_result_event_id":"lr_…"}}
  ```
  Solo'da `session_key: null`. `session_key` server hodisasidagi bilan aynan bir xil, jonli darsdan keyin ko'rish rejimida ham.
- Oxirgi ekranda `onFinished` avtomatik chaqiriladi, tugmani bosish shart emas; bitta urinishda bir marta. Tugma chiqish va navigatsiya uchun qoladi. Sahifadan avtomatik chiqarmaymiz.

**Sinovlar:** server testlari 85 + 124, darslar 172 × 2 til (avto-yakun va eski oqim), brauzerda uchidan-uchigacha sinov — hammasi o'tdi. Staging'da yangi server ishlayapti.

## 2. Yangi oqim qanday yoqiladi — bitta sozlama

Hammasi Dars API'dagi bitta sozlamaga bog'langan: `RESULT_SCHEMA_V2`.
- `off` (bugun prod'da shunday): server faqat eski v1 hodisalarni yuboradi, darslar eski formatdagi yukni beradi. Siz uchun hech narsa o'zgarmaydi.
- `on`: server `lr_` / `ap_` / `ar_` ni yuboradi va o'sha zahoti darslar yangi formatdagi yukka o'tadi (dars server javobidan biladi, darslarni qayta yuklash shart emas).
- Muammo bo'lsa — `off` qilinadi va hammasi eskicha ishlaydi. Hech narsa o'chirilmaydi.

## 3. Bugungi tartib

1. Dars API prod'ga (jonli dars yo'q paytda), `RESULT_SCHEMA_V2=off`.
2. 172 dars LMS'ga (dars vaqtidan tashqari).
3. Eski oqim ishlayveradi — o'quvchi va mukofotlar uchun hech narsa o'zgarmaydi.
4. Siz tayyor bo'lgach: avval staging'da birga sinaymiz, keyin prod'da `on`.

## 4. Sizdan kerak

1. **Staging'da sozlamani yoqish.** Staging Dars API'da `RESULT_SCHEMA_V2=on` (`/srv/dars-api/staging/.env.deploy`, keyin konteynerni qayta ishga tushirish). Tekshiruv: `https://staging-dars-api.coddycamp.uz/api/v1/health` → `"result_schema_v2":"on"`. Buni o'zingiz qilasizmi yoki kimga aytaylik?
2. **Qabul qiluvchi.** Staging va prod'da v2 qabul qiluvchingiz (`POST` va `GET …/lesson-results`) qachon tayyor bo'ladi? Staging tayyor bo'lsa, bitta jonli sinov darsini birga o'tkazamiz.
3. **LMS va brauzer yuki.** Yangi formatdagi `onFinished` yukini (yuqoridagi `dars_api` bilan, `codestrike` siz) LMS qabul qiladimi? Server tasdig'igacha «natija qayta ishlanmoqda» holati LMS tomonida.
4. **Prod'dagi `STALE_SESSION_MINUTES`.** Faolliksiz sessiya necha daqiqadan keyin yopiladi? Kodda sukut — 30 daqiqa, prod'dagi qiymatini bilmaymiz. Shahzodaga yozish uchun kerak.
5. **Konnektor.** Shahzoda uchun faqat o'qish view'lari tayyor (`v_lesson_results`, `v_question_attempts`, `v_practice`, `v_screen_views`, `v_arena`, `v_arena_full_place`, `v_wrong_answers_top`, `v_sessions`) — ism, kontakt va o'quvchi matni yo'q. Faqat o'qish roli SQL'i tayyor, prod baza egasi bajaradi. Tarmoqni ochish — sizda.
6. **Oldingi ikki savol (shoshilinch emas):** 35887 birinchi xabar tasdig'i va prod validatorning SHA'si.
