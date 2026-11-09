# JSX Dars API School API CRM va LMS uchun yakuniy kelishuv

**Sana:** 09.11.2026  
**Holat:** implementatsiya va QA uchun yagona kelishuv.  
**Ishtirokchilar:** JSX/Dars API jamoasi va Abdulloh tomoni — School API, CRM, LMS.

## 1. Hujjatning vazifasi va ustuvorligi

Natijani saqlash o‘quvchining «Darsni yakunlash» tugmasini bosishiga bog‘liq bo‘lmaydi. O‘quv natijasi, arenada qatnashish, arena yakuni va sahifadan chiqish ajratiladi. Learn va CodeStrike bir-biriga muqobil, takroriy coin berilmaydi.

**Ushbu hujjat oldingi 06–24 yozishmalaridagi qarorlar va tuzatishlarni birlashtiradi va qarama-qarshilik bo‘lsa ularning o‘rnini bosadi.** 16 v1.3 dagi savol/urinish tafsilotlari quyidagi aniqliklar bilan ishlatiladi. Tarmoqdagi versiya `schema_version:2`; hujjatning v1.3 nomi tarmoq versiyasi emas.

Reestr manbasi — `16a-REESTR-DARS-CLASS-LEARN.csv` ning `eski_lesson_id` bor oxirgi nashri. Tarixiy tiklash manbasi — `20a-50-XABAR-HISOBOT-V2.csv`; 17/17a eskirgan.

**Yangi mahsulot savollari ochiq qolmagan.** Quyidagi texnik yechimlar qo‘llanadi. Ikkala jamoa ishlab chiqishni boshlaydi; kichik nomlash yoki ichki kod tuzilmasi uchun yangi tasdiq davrasi kerak emas. Kontraktga zid xulq QA xatosi sifatida tuzatiladi. Biznes qoidasi yoki majburiy tarmoq maydoni o‘zgarishi kerak bo‘lsagina kontrakt o‘zgarishi alohida qayd etiladi.

Hujjat production tayyorligi, eski xabar yuborilishi yoki mukofot to‘langani haqidagi dalil emas. Bular 10–12-bo‘limdagi bajariladigan tekshiruvlardir, mahsulot bo‘yicha yangi savol emas.

## 2. O‘quv qismi va Learn

### O‘quv qismi

- O‘quvchi birinchi marta oxirgi o‘quv ekraniga yetganda natija avtomatik yoziladi va yuboriladi. Tugma kutilmaydi, arena oynasi yopilmaydi.
- `participated:true` — o‘quvchi kamida bitta ekran oldinga o‘tgan yoki kamida bitta savolga javob bergan. Mentorning avtomatik ekran almashtirishi o‘zi yetarli emas.
- `completed:true` — `reached_end` qayd etilgan. «Barcha savollarga javob berdi» mustaqil yakunlash mezoni emas. `completed:true` bo‘lsa `participated:true` ham bo‘lishi shart.
- Yakunlamagan o‘quvchi natijasi urinish yopilganda `completed:false` bilan saqlanadi. Class bajarilgan deb belgilanmaydi, o‘quv qismi coin’i berilmaydi.
- Keyinchalik, jumladan uyda, birinchi marta to‘liq yakunlash mumkin. Oldingi `completed:false` mukofot huquqini bekor qilmaydi.
- Birinchi to‘liq yakunlashning natijasi va mukofoti saqlanadi. Orqaga qaytish, «Qaytadan», yangi til yoki versiya uni almashtirmaydi. Keyingi faoliyat tarix uchun saqlanishi mumkin.
- Mukofotga asos bo‘ladigan tugallangan natija Dars’da qayd etilgan birinchi to‘liq yakunlashga tegishli bo‘lsin; transport qayta urinishlari yangi yakunlash deb sanalmasin. Tugallanmagan tarixning oldin kelishi to‘liq natijani to‘smasin.

### Learn

- Tegishli Class o‘quvchiga mavjud bo‘lganda bog‘langan Learn uchun Class yakuni yoki arena natijasini kutish talab qilinmaydi. Kursga kirish huquqlari saqlanadi.
- **Arena boshlanganidan keyin o‘quvchiga birinchi arena savoli ko‘rsatilishi Learn’ni avtomatik hisoblash uchun yetarli.** Lobbi yoki tugmani bosish yetarli emas. Kech kirgan o‘quvchi uchun — o‘zi ko‘rgan birinchi savol.
- Javob berish, to‘g‘ri javob yoki 7 ball sharti yo‘q. Nol javobli qatnashish ham hisoblanadi. Ko‘rsatish xabari yo‘qolib, haqiqiy arena javobi kelgan bo‘lsa, javob qatnashishni tasdiqlaydi.
- Learn bajarilgan deb belgilanadi, ro‘yxatdan yashiriladi, keyingi tegishli darsga yo‘l ochiladi. Bu Class’ni tugatmagan o‘quvchining Class natijasini soxta `completed:true` qilmaydi.
- Learn urinishini qatnashishdan oldin boshlagan o‘quvchi aynan shu urinishni tugatishi mumkin; yangi urinish boshlamaydi. Istisno serverdagi boshlanish yozuvi bilan tekshiriladi, faqat ochiq sahifaga ishonilmaydi.
- Avtomatik hisoblash sababi mustaqil Learn yakunidan alohida saqlanadi. Eski sonli `codestrike_source_log_id` ga satrli `event_id` yozilmaydi; yangi hodisa manbasi uchun alohida bog‘lanish ishlatiladi.
- Solo’da arena yo‘q. Oldin live sabab hisoblanmagan Learn odatdagidek mavjud.

## 3. Coin qoidalari va parallel so‘rovlar

### Uchta alohida faoliyat

| Faoliyat | Mukofot qoidasi |
| --- | --- |
| O‘quv qismi | Faqat `participated:true` va `completed:true`, birinchi to‘liq yakunlash uchun bir marta. Amaldagi CRM hisoblash qoidasi saqlanadi; agregat `correct_answers` dan yangi tarif o‘ylab topilmaydi. |
| Learn | Javoblar uchun amaldagi tartibda hisoblanadi; dars oxiriga ko‘chirilmaydi. CodeStrike bilan quyidagi o‘zaro cheklov qo‘llanadi. |
| CodeStrike | Birinchi yakunlangan arena: amaldagi hisob — to‘g‘ri javobga 3 coin, podium uchun kursdagi sozlama. Podium uchun kamida bitta to‘g‘ri javob bo‘lishi kerak. Learn bilan cheklov javob va podium coin’lariga birdek tegishli. |

O‘quv qismi mukofoti Learn/CodeStrike o‘zaro cheklovidan tashqarida. Points uchun yangi mahsulot qoidasi kiritilmaydi; coin cheklovi points’ni tasodifan o‘chirib yubormasin.

### Learn va CodeStrike o‘zaro cheklovi

1. Learn mustaqil tugatilgan bo‘lsa, CodeStrike coin’i berilmaydi.
2. Learn hali tugatilmagan bo‘lsa ham, shu Learn uchun kamida bitta musbat coin olingan bo‘lsa, CodeStrike javoblari va podium uchun coin berilmaydi.
3. CodeStrike uchun musbat coin berilgan bo‘lsa, bog‘langan Learn’dagi keyingi javoblar saqlanadi, ammo coin bermaydi.
4. Nol coin va faqat points yozuvi musbat to‘lov hisoblanmaydi. Avtohisoblangan Learn CodeStrike mukofotini o‘zi to‘smaydi.
5. Birinchi arena nol natija bergan bo‘lsa, ikkinchi arena yangi mukofot huquqini yaratmaydi. Oldin boshlangan Learn urinishini yakunlash istisnosi saqlanadi.
6. Biznes qarori qo‘llanayotgan paytdagi haqiqiy reyestr va mustaqil yakun holati tekshiriladi. Kech kelgan xabar avval berilgan coin’ni avtomatik qaytarmaydi yoki manbasini almashtirmaydi.

**Kanonik himoya:** o‘quv qismi uchun `(student_id, class_id)`; Learn/CodeStrike cheklovi uchun `(student_id, learn_id)`. Tashqi `lesson_id`, til, versiya, yangi event ID yoki oddiy qayta o‘tish yangi huquq yaratmaydi. Boshqa kurs/lesson turlarining mavjud mukofot qoidalari o‘zgarmaydi.

`student_question_rewards` Learn’dagi haqiqiy to‘lov manbasi sifatida tekshiriladi; CodeStrike reyestri ham hisobga olinadi. Jadvalning o‘zi boshqa turdagi mukofotni avtomatik to‘smaydi. CRM bir xil o‘quvchi uchun umumiy blokirovka va tranzaksiya ichida huquqni tekshiradi, reyestrni yozadi va balansni o‘zgartiradi. Parallel Learn javobi va arena natijasi ikki yo‘ldan to‘lov yaratmasin.

## 4. Hodisalar va yetkazish

**POST:** `/api/v1/integrations/dars-platform/lesson-results`  
**GET:** `/api/v1/integrations/dars-platform/lesson-results/{event_id}`

Amaldagi servis autentifikatsiyasi va client ruxsatlari saqlanadi. V2 har xabarda bitta LMS o‘quvchisiga tegishli. Brauzerga servis tokeni berilmaydi.

| `event_type` | Yaratish lahzasi | `event_id` |
| --- | --- | --- |
| `lesson_result` | Birinchi `reached_end`, aks holda urinish yopilishi | `lr_<attempt_id>` |
| `arena_participation` | Birinchi arena savoli ko‘rsatilishi yoki buni tasdiqlagan javob | `ap_<attempt_id>` |
| `arena_result` | Arena yakuni; boshlanmagan bo‘lsa sessiya yopilishi | `ar_<attempt_id>` |

`attempt_id` — server bergan UUID, o‘quvchi va urinishga bog‘langan. Har bir hodisa turi shu urinish uchun bir marta yaratiladi. Arena ichida o‘quvchining `attempt_id` si o‘zgarmaydi; bitta sessiyada bitta arena. Yangidan o‘quv urinishi yaratilsa yangi UUID beriladi. Allaqachon yakunlangan urinishga qaytish uning eski hodisasini o‘zgartirmaydi.

Server yuboriladigan mazmunni bir marta saqlaydi. Qayta yetkazishda ID, vaqtlar va mazmun o‘zgarmaydi. Hodisalar kelish tartibi kafolatlanmaydi. `arena_result.participated:true` oldin kelsa, u Learn avtomatik hisobini ham ta’minlaydi; keyingi qatnashish hodisasi takroriy ta’sir bermaydi. Bir arena bo‘yicha qatnashganlikka zid yakun kelishi normal holat emas: saqlangan progress bekor qilinmaydi, konflikt tekshiruvga chiqariladi.

`student_arena_no` Dars tomonidan eski ID’larni ham hisobga olib darsning mantiqiy davomiyligi bo‘yicha beriladi. Birinchi qatnashilgan va yakunlangan arena — `1`; keyingilari trening. Qatnashmagan xabar raqam olmaydi va birinchi arena huquqini band qilmaydi. Qabul qiluvchi tarmoqdan birinchi kelgan arenani avtomatik birinchi deb tanlamaydi.

## 5. V2 maydonlari va validatsiya

### Umumiy maydonlar

| Maydon | Yakuniy qoida |
| --- | --- |
| `schema_version` | `2`; yo‘q bo‘lsa amaldagi v1 yo‘li |
| `event_type`, `event_id` | 4-bo‘lim bo‘yicha; ID ≤128 belgi |
| `occurred_at` | Hodisaning mantiqiy vaqti, server belgilaydi; UTC ISO-8601 `Z` |
| `lesson_id`, `lesson_title` | Tashqi dars ID va nom; ID ≤128, nom ≤255 belgi |
| `lesson_version`, `version_source` | Versiya yoki `null`; manba `attempt`, `backfill`, `unknown`. `unknown` bo‘lsa versiya `null` |
| `attempt_id` | UUID; brauzer va serverda bir xil |
| `mode` | `live` yoki `solo`; arena hodisalari faqat `live` |
| `student` | `{student_id: LMS ID, id_type:"lms"}`; ism, kontakt yoki token yo‘q |
| `session_key`, `group_id`, `teacher_id` | Live’da majburiy, solo server hodisasida mavjud emas |
| `lang` | `lesson_result` va `arena_result` uchun `uz` yoki `ru`; tafsilot ham shu tilda |

`lesson_id` tarixiy reestr orqali Class/Learn’ga yechiladi. Qabul qiluvchi reestrda bo‘lmagan yoki bir ma’noli yechilmagan ID’ni boshqa darsga taxmin bilan bog‘lamaydi. `lesson_version:null` o‘zi xato emas: tarixiy versiya noma’lumligini halol saqlaydi. Ishonchli asosiy natija va aniq Class bog‘lanishi bo‘lsa hodisa odatdagidek qayta ishlanadi.

### `lesson_result`

`result` ichida: `attempt_no`, `trigger`, `participated`, `completed`, `opened_at`, `completed_at`, `last_activity_at`, `elapsed_sec`, `processed_at`, `screens:{reached,total}`, `tests:{total_questions,answered,correct_answers}`, `badges`.

- `trigger`: `reached_end`, `session_closed`, `solo_expired`, `version_changed`.
- `attempt_no` — tarixiy tartib, mukofot uchun `1` bo‘lishi shart emas.
- `completed:true` faqat `reached_end`; `completed_at` — shu lahza. Tugallanmagan holatda `completed_at:null`.
- `screens.reached` — 1 dan boshlanadigan eng uzoq yetilgan ekran; orqaga qaytishda kamaymaydi.
- `tests` faqat variantli testlar: `0 ≤ correct_answers ≤ answered ≤ total_questions`. V2’da testsiz dars uchun uchala qiymat `0` bo‘lishi mumkin.
- `badges:[]` normal. O‘quv qismida guruh natijasini kutadigan `rank`, `speedster`, `top_1…3` yuborilmaydi; `participant` zaxira-nishoni talab qilinmaydi.
- `opened_at` yoki boshqa tarixiy vaqt o‘lchanmagan bo‘lsa `null`; vaqtni o‘ylab topmaymiz. `elapsed_sec` hisoblashga asos yo‘q bo‘lsa `null`, `0` emas. Yangi urinishlarda `opened_at` yoziladi.

Top-level `practice:[{screen_id,done,checked,correct}]` — testdan alohida. `done`, `checked` boolean; tekshiruvsiz bo‘lsa `correct:null`, tekshirilgan bo‘lsa boolean. Bo‘sh massiv mumkin. Practice test agregatiga qo‘shilmaydi va o‘zi Class yakunini belgilamaydi. O‘quvchining yozma kodi/matni bu blokka kirmaydi.

### `arena_participation`

`arena:{started_at,questions_total}` va `participation:{student_arena_no,first_question_id,first_question_order,first_shown_at,source}`.

`source:shown` — ko‘rsatish tasdig‘i serverga kelgan vaqt; `source:answer` — tasdiq yo‘qolgan, lekin haqiqiy javob bor, uning server vaqti ishlatiladi. `first_question_order` kech kirgan o‘quvchida 1 bo‘lishi shart emas. Har ikkala holat qatnashishni tasdiqlaydi.

### `arena_result`

`arena:{started_at,finished_at,end_reason,questions_total,questions_shown,players_total}` va `result:{student_arena_no,participated,participated_at,answered,correct_answers,points,place,badges}`.

- `end_reason`: `mentor`, `last_question_timeout`, `arena_limit`, `session_limit`, `session_closed`, `not_started`.
- `questions_total` — bank hajmi, `questions_shown` — arena davomida ko‘rsatilgan savollar soni. `0 ≤ correct_answers ≤ answered ≤ questions_shown ≤ questions_total`.
- `points` — arena o‘yin ballari, LMS coin summasi emas. Pul miqdorini CRM hisoblaydi.
- `place`: 1, 2, 3 yoki `null`. Javobsiz o‘quvchi joy olmaydi. O‘rin umumiy arena qatnashchilari, jumladan PIN orqali kirganlar orasida aniqlanadi. Tenglik: points kamayish tartibi, to‘g‘ri javoblar kamayish tartibi, oldin qo‘shilganlik.
- Kirib javob bermagan: `participated:true`, vaqt va arena raqami bor, javob/ball 0, joy `null`.
- Kirmagan: `participated:false`, qatnashish vaqti va raqami `null`, javob/ball 0, joy `null`.
- `not_started`: `started_at:null`, `finished_at=occurred_at` — sessiya yopilgan vaqt, `questions_shown:0`, `players_total:0`. Har bir LMS o‘quvchisiga yuboriladi.
- Arena boshidan kirish tasdiqlangan bo‘lsa, javoblar 0 ekani uni qatnashmagan qilmaydi.

### Tafsilot

`lesson_result` va `arena_result` da `details:{status,reason,available}` bo‘ladi. `status` — `full` yoki `omitted`; `partial` yo‘q.

- `full`: `reason:null`, `available=questions.length`. O‘quv qismida `kind:test`, arenada `kind:arena`. Savollar soni tegishli `answered` ga, birinchi to‘g‘ri javoblar soni tegishli `correct_answers` ga teng.
- Javob yo‘q: `full`, `available:0`, `questions:[]`.
- `omitted`: `reason` — `size`, `invalid_text` yoki `version_mismatch`; `available` — chiqarishdan oldingi savol yozuvlari soni. `questions` maydoni yuborilmaydi. Asosiy agregat ishonchli bo‘lishi shart; tafsilotni olib tashlash noto‘g‘ri agregatni qonuniy qilmaydi.
- Savol, variant, kalit va urinishlar 16 v1.3 formatida: `question_id`, `kind`, `order`, `question`, `options`, `correct_option`, `correct_answer`, `correct`, `solved`, `attempts`. Variant va kalit mosligi, urinish raqami va javob to‘g‘riligi tekshiriladi. Live’da bitta savol uchun birinchi urinish.
- `achievements` o‘quv qismida, arena hodisasida yo‘q. Bo‘sh massiv normal.
- Maksimal xabar hajmi **1 MiB, 1 048 576 bayt**, UTF-8 JSON. Hajmga sig‘magan tafsilot tashlanadi va belgi qo‘yiladi. Asosiy qismning o‘zi sig‘masa yuborish lokal xato sifatida qayd etiladi; jim qisqartirish yo‘q.

V1 o‘z validatori bilan qoladi. V2’dagi `practice`, nol testlar yoki `details` qoidalari v1 ga yashirin tatbiq qilinmaydi.

## 6. Vaqt va avtomatik yopilish

| Chegara | Mantiqiy yakun |
| --- | --- |
| O‘quv qismi tugadi | Birinchi `reached_end` vaqti; sessiya oxiri kutilmaydi |
| Live sessiya | Boshlanish + 2 soatdan kech emas |
| Arena | Boshlanish + 45 daqiqadan kech emas |
| Arena oxirgi savoli | Uning server taymeri tugashi + 1 daqiqa |
| Solo urinish | Ochilish + 7 kun |

Qo‘lda yoki boshqa amaldagi asos bilan oldin yopilsa, oldingi vaqt ishlatiladi. Arena uchun eng erta chegara g‘olib. Kech boshlangan arenaga to‘liq 45 daqiqa kafolatlanmaydi.

`occurred_at` tegishli hodisaning mantiqiy lahzasi. `processed_at` — Dars natijani birinchi yig‘gan haqiqiy lahza; `lesson_result.result` ichida yuboriladi va qayta yetkazishda o‘zgarmaydi. `elapsed_sec=occurred_at-opened_at`: live’da ko‘pi bilan 7200, solo’da 604800. Worker kechikishi bu vaqtga qo‘shilmaydi. Deadline’dan keyingi yangi harakatlar urinishni davom ettirmaydi; natijaga muddati tugagandan keyingi javob qo‘shilmaydi.

Amaldagi `STALE_SESSION_MINUTES` production qiymatini deployment mas’uli tekshiradi. Bu eski sessiyani mentor signali bo‘yicha yopish mexanizmi; ikki soatlik mutlaq limitni uzaytirmaydi. O‘lchanmagan faol vaqt chiqarilmaydi: `last_activity_at` faol ishlagan daqiqalar sonini bermaydi.

## 7. Qabul javobi va qo‘llash

| HTTP | Ma’no va yuboruvchi harakati |
| --- | --- |
| 201 | Hodisa ishonchli saqlandi va ishlashga qabul qilindi; yetkazish tugadi, qo‘llash holati kuzatiladi |
| 200 | Bir xil ID va mazmun takrori; saqlangan holat qaytariladi |
| 409 | ID oldin boshqa mazmun bilan ishlatilgan; o‘zgartirmasdan qayta yuborish yordam bermaydi, tekshiruv |
| 422 | Maydon yoki ma’no xatosi, o‘quvchi topilmagan, Class bog‘lanishi noma’lum; tuzatish talab qilinadi |
| 401/403 | Servis autentifikatsiyasi/ruxsat muammosi; cheksiz qayta urinish yo‘q, mas’ulga xabar |
| 413 | Hajm cheklovi; payloadni belgilangan hajm qoidasi bilan tuzatish |
| 429, 5xx, tarmoq | Saqlangan ayni payload qayta yuboriladi, `Retry-After` hurmat qilinadi |

V2 POST javobi:

```json
{"data":{"event_id":"lr_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90","event_type":"lesson_result","accepted":true,"duplicate":false,"processing":"queued"}}
```

V2 GET javobida shu identifikatorlar, `processing:queued|applied|failed`, `class_done`, `learn_done`, `coins`, `coins_reason`, `error` bo‘ladi. `queued/failed` paytida hali aniqlanmagan natija maydonlari `null`. `applied` — hodisaga tegishli biznes tekshiruvi yakunlangan; nol coin ham muvaffaqiyatli qo‘llash bo‘lishi mumkin. `class_done` va `learn_done` — qo‘llashdan keyingi tasdiqlangan holatlar; ular yangi to‘lov dalili emas. `coins` aynan shu hodisa yaratgan to‘lov miqdori, umumiy balans emas.

```json
{"data":{"event_id":"lr_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90","event_type":"lesson_result","accepted":true,"processing":"applied","class_done":true,"learn_done":false,"coins":0,"coins_reason":"already_rewarded","error":null}}
```

`coins_reason`: musbat to‘lovda `null`; aks holda `already_rewarded`, `not_completed`, `not_participated`, `learn_rewarded`, `learn_completed`, `codestrike_rewarded`, `training`, `rule`. `rule` — nol to‘g‘ri javob, o‘chirilgan podium yoki mukofotsiz hodisa kabi amaldagi qoidalar. `error` — xatoda `{code,message}`, aks holda `null`; maxfiy ma’lumotlar chiqmaydi.

School API hodisani saqlash va CRM’da qo‘llashni ajratadi. CRM qabul qiluvchisi takrorni tanib, avvalgi natijani qaytaradi. CRM qo‘llab bo‘lgandan keyin javob yo‘qolsa, qayta urinish yana coin bermaydi. School API’ning umumiy legacy read-only ulanishi write ulanishga aylantirilmaydi; biznes yozuvi CRM servisida bajariladi.

Dars GET kuzatuvi: 1, 5, 15, 60 daqiqada, so‘ng soatlik 24 soatgacha. 60 daqiqadan oshgan `queued` — ogohlantirish; 24 soatdan keyin mas’ul ro‘yxat, hodisa yo‘qolmaydi. CRM/School API vaqtinchalik qo‘llash xatosini qayta ishlaydi; biznes konflikti dalil bilan tekshiruvga chiqadi. Dars saqlangan hodisaga yangi ID yaratmaydi.

**Eski v1:** amaldagi `students_accepted`, `rejected_students`, `reward_status` saqlanadi. 201 barcha o‘quvchilar qabul qilingani yoki coin berilganini anglatmaydi. V1 tiklash sinovidan yangi v2 GET maydonlari kutilmaydi.

## 8. Brauzer va LMS

Yangi JSX `onFinished` ni oxirgi ekranda avtomatik chaqiradi, `codestrike` yubormaydi, `schema_version:2` va quyidagi bog‘lanishni yuboradi:

```json
{"schema_version":2,"dars_api":{"attempt_id":"7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90","session_key":"sess_483920_20261110T090012Z","lesson_version":"v5","lesson_result_event_id":"lr_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90"}}
```

Solo brauzer yukida `session_key:null`. O‘quvchi identifikatori LMS autentifikatsiyasidan olinadi. Urinishning boshqa o‘quvchiga yoki darsga tegishli emasligi tekshiriladi.

- Brauzer yuki o‘zi coin yoki yakuniy Class holatini bermaydi, eski mukofot yo‘lini ishga tushirmaydi.
- Server tasdig‘igacha «natija qayta ishlanmoqda» holati; tasdiq kelgach saqlangan holat ko‘rsatiladi.
- Saqlash `onLessonFinish` orqali avtomatik sahifadan chiqarishni boshlamaydi. Arena mavjud qoladi. Tugma chiqish va navigatsiya uchun.
- Oyna yopilgan bo‘lsa server qayta urinishlari davom etadi. Browser callback yuborilishi texnik xatoda shu urinish kaliti bilan qayta urinishi mumkin; yangi mukofot huquqi yaratmaydi.
- LMS o‘z autentifikatsiyalangan API’si orqali qo‘llash holatini oladi. Servis tokeni yoki boshqa o‘quvchilarning hodisalari ochilmaydi.
- Eski JSX yuki o‘tish davrida qo‘llanadi. Yangi kontrakt uchun server reyestri eski brauzer/coin yozuvlarini ham tekshiradi; v2 yoqilishi mukofot tarixini noldan boshlamaydi.

## 9. Versiyalar va o‘tish

Yangi urinish versiyali nashrga biriktiriladi. Kalitlar va kontent eski versiya bo‘yicha saqlanadi, yangi reliz ularni ustidan yozmaydi. Bir versiyadagi ikki til kalitlari ham bir-birini buzmasin.

**Versiyasiz eski urinish uchun yakuniy qaror:** uning nashr/fayl kontenti bilan bir ma’noli bog‘lanishi isbotlangan bo‘lsa `backfill`; aks holda `unknown`. Javob berilgan bir nechta savol matni mosligi yoki yetti kun reliz bo‘lmagani butun fayl versiyasiga mustaqil isbot emas. Bunday holatda mosligi tekshirilgan tarixiy javoblar saqlanadi, lekin versiya o‘ylab topilmaydi.

Eski tab o‘z urinish versiyasi bilan davom etadi. Faqat kelgan versiya urinishning o‘ziga mos kelmasa konflikt. Sahifa yangilanib yangi fayl ochilsa, hali tugallanmagan eski urinish `version_changed/completed:false` bilan yopiladi, yangi UUID yaratiladi. Oldin yakunlangan urinish pasaytirilmaydi yoki ikkinchi hodisa bilan almashtirilmaydi.

T — 172 dars yangi nashri yoqilgan vaqt. Yangi urinishlar v2; navbatdagi v1 o‘zgartirilmasdan yetkaziladi. T+8 — tekshirish nuqtasi. V1 faqat eski faol/qayta urinishlar, `pending/retry_wait`, hal qilinmagan `manual_review` va tarixiy tiklashlar tugagach, ikkala tomon tasdig‘i bilan yopiladi.

## 10. Eski 50 xabar alohida tiklanadi

20a: 229 yozuv, 197 o‘quvchi, 213 nomzod, 46 yuborishga nomzod xabar. Bu raqamlar tekshirildi; nominatsiya yuborish ruxsati emas.

**Bizning tomon bajaradi:** eski server hodisasi, browser `student_question_log`, `student_question_rewards`, CodeStrike reyestri va mavjud hisoblarni solishtirish. Natijada har qatorga: `faqat tarix`, `yetishmagan mukofot`, `oldin qo‘llangan`, yoki `dalil kerak` qarori va hisob asosini yozish. Tarixiy qoidalar bilan hisoblanadi; yangi Learn avtomatik hisobi orqaga tatbiq qilinmaydi. Oldin berilgan coin avtomatik yechilmaydi.

Dars eski va qayta yig‘ilgan payloadni, xato sababini va manba dalilini saqlaydi. O‘sha ID faqat qabul qiluvchida hali saqlanmagan hodisani tuzatib yuborish uchun ishlatiladi. Oldin saqlangan hodisaga `_r1` avtomatik berilmaydi; alohida tiklash operatsiyasi aniqlanadi.

Tasdiqlangan dalillar:

- 31136: browser log 1881580, `pm-m2d13-v1`, savol 14121; 30.09.2026 dagi mukofot 268068 — Class 2444, 3 coin. Hozirgi Learn — 3184; sentyabrdagi Learn bog‘lanishi hali tarixdan tekshiriladi.
- 35887: Class 2432 uchun 30 sentyabrda 3 coin berilgan. `solo_35887_pm-m2d2-v1_20260923T114932Z` — takroriy to‘lovsiz tiklash sinovi uchun nomzod, hozircha yuborishga tasdiqlanmagan.
- 29085: Class 2461 uchun nol coin/3 points va Learn 3198 to‘lovlari bor. Nol yozuv avtomatik qarzdorlik dalili emas.

Tartib: yakunlangan solishtirish va aniq kutiladigan natija → bir xabar → qabul va CRM’dagi haqiqiy ta’sirni tekshirish → qolgan tasdiqlangan qatorlar. V1 sinovida `coins_reason` yo‘qligi xato emas: to‘lov reyestr orqali tekshiriladi. Tiklash va yangi v2 release alohida oqimlar.

## 11. Vazifalar va tekshiriladigan faktlar

| Ish | Egasi | Tayyorlik dalili |
| --- | --- | --- |
| JSX: avtomatik natija, arena qatnashishi, v2 bog‘lanish | JSX/Dars jamoasi | Yig‘ilgan fayl, versiya, tekshiruvlar |
| Versiyali urinish/kalitlar, uch hodisa, deadline, qayta yetkazish | Dars jamoasi | Migratsiya, avtomatik testlar, saqlangan payloadlar |
| V2 POST/GET, v1 mosligi, saqlash va qo‘llash navbati | Bizning tomon | Validator, idempotent saqlash, qayta ishlash testlari |
| CRM: Class/Learn, boshlangan Learn istisnosi, coin himoyasi | Bizning tomon | Tranzaksion integratsion testlar, balans/reyestr solishtiruvi |
| LMS: saqlash/chiqish ajratilishi, holat kuzatuvi | Bizning tomon | Haqiqiy browser QA, desktop va mobile |
| Analitika view’lari | Dars jamoasi | ID’lar, UTC, vaqt/urinish ma’nolari, ruxsat etilgan ustunlar |
| Read-only konnektor va CRM bog‘lanishlari | Bizning tomon | Vakolatli client bilan o‘qish, shaxsiy ma’lumot cheklovlari |
| Production validator SHA, konfiguratsiya, `STALE_SESSION_MINUTES` | Bizning deployment mas’uli | Ishlayotgan artefakt/configdan aniq qiymatlar; faqat kerakli sozlama, secretsiz |
| Eski 50 xabar tekshiruvi va to‘lov hisob-kitobi | Bizning tomon; manba dalili Dars’dan | Qatorlar bo‘yicha qaror, mavjud/to‘lanadigan miqdor |

Production’dagi aniq validator SHA hali tasdiqlanmagan. Lokal `6b3c85d` da tengliklar bor; Dars taqdim etgan 422 dalili tegishli production tekshiruvini ko‘rsatadi, lekin butun build tengligini isbotlamaydi. Buni deployment tekshiruvi yopadi, mahsulot muhokamasi emas.

Analitika uchun oldingi A yo‘li saqlanadi: view’lar orqali read-only. Ism/kontakt yo‘q; o‘quvchi yozgan kod/matn Dars bazasida qoladi. Konnektorda bir topshiriqda kamida 5 o‘quvchida takrorlangan noto‘g‘ri javoblar umumlashtiriladi. `opened_at` eski yozuvlarda o‘lchanmagan bo‘lsa `null`.

## 12. Qabul va release mezonlari

Quyidagi natijalar birgalikda tekshiriladi:

1. Oxirgi ekran, tugma bosilmagan: natija saqlanadi, arena qoladi.
2. Live’da tugatmadi → solo’da birinchi tugatish: o‘quv mukofoti bir marta.
3. Nol javobli arena qatnashishi: Learn avtomatik hisoblanadi, coin o‘zi paydo bo‘lmaydi.
4. Learn’da bitta musbat coin oldin olingan: CodeStrike javob/podium coin’i yo‘q.
5. CodeStrike musbat mukofoti oldin olingan: oldin boshlangan Learn javoblari coinsiz saqlanadi.
6. Learn mustaqil tugatilgan va avtohisoblangan holatlar alohida tekshiriladi.
7. Birinchi arena nol, keyingisi yuqori: birinchi natija/mukofot o‘zgarmaydi.
8. Brauzer/server va Learn/arena parallel: bir marta ta’sir; tranzaksiya xatosida qisman balans qolmaydi.
9. CRM yozganidan keyin tarmoq javobi yo‘qolgan: qayta yetkazish takroriy coin bermaydi.
10. Arena yakuni qatnashishdan oldin: Learn bir marta hisoblanadi.
11. Ikki soat, 45 daqiqa, oxirgi savol +1 daqiqa, solo 7 kun; worker kechiksa o‘yin vaqti uzaymaydi.
12. `not_started`, haqiqiy javobsizlik va `omitted` bir-biridan farqlanadi.
13. Practice tekshirilgan/tekshirilmagan, testlar 0, to‘liq test tengliklari tekshiriladi.
14. Til, versiya, tashqi ID yoki yangi urinish yangi mukofot yaratmaydi.
15. Eski tab, sahifa yangilanishi va `unknown` versiya holati tekshiriladi.
16. 24 soatlik `queued/failed` kuzatuvdan yo‘qolmaydi.
17. V1 va eski JSX regressiyasi, eski mukofotli o‘quvchi bilan v2 tekshiriladi.
18. Tiklashda browser orqali berilgan coin takrorlanmaydi; tarixiy noaniqlik avtomatik to‘lovga aylanmaydi.

Dars testlari soxta qabul qiluvchi bilan; bizning testlar haqiqiy validator va CRM tranzaksiyalari bilan; yakuniy QA haqiqiy JSX va ikkala backend orqali `netlify-deploy-v19` da. LMS — desktop va mobile, CRM paneli — desktop.

Release ketma-ketligi: mos migratsiyalar va v1/v2 qabul qiluvchi → CRM qo‘llash mexanizmi va LMS → birgalikdagi QA → dars vaqtidan tashqari, faol live sessiyasiz barcha 172 dars → yangi oqimni yoqish → qabul, qo‘llash, balans va navbat monitoringi. Alohida production-pilot bosqichi talab qilinmaydi. Nosozlikda yangi oqim flag’i o‘chiriladi, saqlangan hodisa va reyestrlar o‘chirilmaydi, berilgan balans avtomatik qaytarilmaydi.

**Keyingi almashinuvlar:** tayyor kod/artefakt, test dalili, aniqlangan konkret nosozlik va release oynasi. Ushbu hujjatdagi qoidalarni yana bittalab tasdiqlatish talab qilinmaydi. Kalendar muddatlar har jamoaning bajarish bahosi bilan beriladi; bu hujjat tasdiqlanmagan sana va production natijasini va’da qilmaydi.
