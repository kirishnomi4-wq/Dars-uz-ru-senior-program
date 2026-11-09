# JSX va Dars API jamoasiga natijalar va JSON kontrakti bo‘yicha javob

**Sana:** 09.11.2026  
**Asos:** `14-ABDULLOH-TOLIQ-UZ.md` va `14a-OXIRGI-100-XABAR.csv`

Uchta hodisaga ajratish va taklif qilingan asosiy yo‘nalishni qabul qilamiz. Quyida tasdiqlar, ikkita qo‘shimcha qaror va yakuniy kontrakt uchun zarur tuzatishlar bor. Hozircha namunalarni o‘zgarishsiz yakuniy kontrakt deb hisoblamang.

## 1. Rad etilgan 50 ta xabar

Maqsad — eski natijalarni va haqiqatan berilmay qolgan coin’larni tiklash. Oldin berilgan mukofot qayta berilmaydi. Learn’ni qatnashish bo‘yicha avtomatik hisoblashning yangi qoidasi eski natijalarga orqaga qarab qo‘llanmaydi.

**1.1. O‘sha `event_id` bilan qayta yuborish:** ha, agar hodisa validatsiyada rad etilib, qabul qiluvchida saqlanmagan va keyinchalik ham qabul qilinmagan bo‘lsa. Buni qayta yuborishdan oldin tekshiramiz. Oldin qabul qilingan hodisaning mazmunini o‘sha ID bilan almashtirmaymiz; yangi ID yaratish ham takroriy mukofot himoyasini chetlab o‘tmasligi kerak.

**1.2. Eski natija va coin:** tiklashni qo‘llab-quvvatlaymiz, lekin «qayta yuborsak odatdagidek coin tushadi» deb hisoblamaymiz. Avval server va brauzer kanallari orqali saqlangan natijalar hamda haqiqiy mukofot yozuvlari solishtiriladi. Faqat yetishmayotgan, tarixiy qoidalar bo‘yicha tegishli mukofot hisoblanadi.

**1.3. Keyinroq yetkazilgan o‘quvchini chiqarish:** sizning tekshiruvingiz foydali, ammo yetarli emas. Qabul qiluvchi ham LMS o‘quvchisi va tegishli CRM darsi bo‘yicha tarixni, brauzerdan kelgan natijalarni va coin reyestrini tekshiradi. Natijani tarix uchun saqlash bilan unga mukofot berish alohida qarorlardir.

**1.4. Guruh xabarini qayta yuborish:** ha, tarkibi va tuzatilgan mazmuni tekshirilgach. Taklif qilingan tartib mos: yubormasdan qayta yig‘ish → natijani ko‘rib chiqish → bitta xabar → natija va coin’ni tekshirish → qolganlari. Bu javob production’ga darhol yuborish topshirig‘i emas; avval hisob-kitob va tekshiruv natijalarini kelishamiz.

Tuzatishda `correct` faqat o‘quvchi ko‘rgan savol versiyasining kalitidan hisoblanishi kerak. Hozirgi kalit bilan eski javobni qayta baholash uchun savol va variantlar versiyasi mosligi isbotlangan bo‘lsin. Tafsilotlarni olib tashlash asosiy hisob noto‘g‘ri bo‘lsa uni to‘g‘ri qilib qo‘ymaydi: agregat natija manbasi ham tekshirilsin.

229 — hozircha rad etilgan xabarlardagi o‘quvchi natijalari soni. Bu 229 ta noyob o‘quvchi yoki ularning natijasi LMS’ga hech qaysi kanal orqali kelmaganini isbotlamaydi.

## 2. JSON savollariga javoblar

| Savol | Javob |
| --- | --- |
| **2.1** | Ha: mavjud `lesson-results`, `schema_version:2` va uchta `event_type`. Eski format alohida qo‘llab-quvvatlanadi. |
| **2.2** | Ha: uchala hodisa har bir LMS o‘quvchisi uchun alohida yuboriladi. |
| **2.3** | HTTP kodlari yo‘nalishi mos. Saqlash va biznes natijasini qo‘llash ma’nosini quyidagi 3-bo‘lim bo‘yicha aniqlashtirish kerak. |
| **2.4** | Ha: darhol yuboriladigan o‘quv natijasida guruh yakunini talab qiladigan `rank`, `speedster`, `top_1…3` bo‘lmaydi. Arena podiumi alohida saqlanadi. |
| **2.5** | Taklif mos: o‘quvchi kamida bitta ekran oldinga o‘tgan yoki kamida bitta savolga javob bergan. Bu o‘quvchining harakati bo‘lsin; mentorning avtomatik ekran almashtirishi o‘zi yetarli emas. |
| **2.6** | **(b): birinchi haqiqiy yakunlash hisobga olinadi.** Jonli darsdagi `completed:false` keyin uyda yakunlash uchun mukofotni bekor qilmaydi. Mukofot uchun birinchi `participated:true` va `completed:true` natija olinadi; keyingi yakunlashlar takroriy mukofot bermaydi. |
| **2.7** | Ha: `badges:[]` ruxsat etiladi. Hozirgi API buni rad etgan konkret payload, javob va `request_id` ni yuboring: ko‘rilgan lokal validatorda bo‘sh massivga umumiy taqiq yo‘q. |
| **2.8** | Ha: oxirgi ekranda avtomatik saqlash, undan `codestrike` blokini chiqarish va oynani yopmaslik. Lekin brauzer va server uchun umumiy hodisa bog‘lanishi hamda mukofot himoyasi shart; faqat blokni olib tashlash yetmaydi. |
| **2.9** | Ha: o‘tish davrida v1 va v2 qabul qilinadi. V1 yangi darslar yuklangani uchungina darhol o‘chirilmaydi: oldin ochilgan urinishlar va eski yetkazish navbati ham hisobga olinadi. |
| **2.10** | Ha: arena savolining `quiz-N` identifikatori va versiya, til, tartib raqami orqali tarixiy view mosligi saqlanadi. Bu butun Class → Learn bog‘lanishini aniqlashdan alohida vazifa. |

**2.6 bo‘yicha aniqlik:** bu oldingi «birinchi natija qotadi» jumlasini aniqlashtiradi. Birinchi to‘liq yakunlash qotadi; undan oldingi tugallanmagan natijalar tarixda qoladi. Shuning uchun `attempt_no == 1` mukofotning majburiy sharti bo‘lmasin. Qarorni qabul qiluvchi reyestr asosida chiqaradi.

CodeStrike qoidasi o‘zgarmaydi: birinchi arena savoli ko‘rsatilganda Learn avtomatik hisoblanadi, ball chegarasi yo‘q. Birinchi yakunlangan arena hisobga olinadi, keyingi arenalar mashq uchun.

## 3. Yakuniy kontraktga kiritiladigan tuzatishlar

### 3.1. Class va Learn bilan bog‘lanish

`lesson_id` va `lesson_version` dan qaysi CRM Class va bog‘langan Learn topilishini aniq belgilaymiz. Versiyalangan moslik reyestri kerak. Bir darsning til yoki JSX versiyasi o‘zgarishi yangi mukofot huquqini yaratmasin. Savollarni analitika uchun bog‘laydigan view bu biznes bog‘lanishining o‘rnini bosmaydi.

### 3.2. Ikki kanal va hodisalar tartibi

Brauzer natijasini ayni server natijasi bilan bog‘lash uchun umumiy identifikator yoki aniq moslashtirish kaliti JSON namunalarida ko‘rsatilsin. Hozirgi CRM’da `codestrike` bo‘lmasa eski mukofot yo‘li ishlashi mumkin; biz buni yangi kontraktga moslashtiramiz.

`arena_result` qatnashish hodisasidan oldin kelishi mumkinligini qabul qilamiz. Yakuniy natijada qatnashish tasdiqlansa, Learn holati to‘g‘ri qo‘llansin; keyingi `arena_participation` takroriy ta’sir yaratmasin. Birinchi arena o‘rniga tarmoqdan birinchi kelgan arenani tanlab qo‘ymaslik kerak.

### 3.3. Solo davomiyligi

`duration_sec` hozir 0…86400 deb berilgan, lekin «ochilgandan natijagacha» vaqt solo’da 7 kun bo‘lishi mumkin. Shu ziddiyatni bartaraf eting: urinishning kalendar davomiyligi va faol ishlash vaqtini ajrating yoki maydon chegarasini uning ma’nosiga moslashtiring. Qiymatni jim kesib tashlamang.

### 3.4. Arena boshlanmagan holat

`end_reason:not_started` uchun to‘liq JSON yuboring. Arena boshlanmagan bo‘lsa `started_at` kabi maydonlar qanday `null` bo‘lishi, `finished_at` nimani anglatishi va hisoblagichlar aniq ko‘rsatilsin. Faqat `result` fragmenti yetarli emas.

### 3.5. To‘liq bo‘lmagan tafsilotlar

`questions` hajm yoki xato sabab chiqarib tashlansa, alohida belgi va sabab yuborilsin. Qabul qiluvchi «javoblar yo‘q» bilan «javoblar bor, lekin tafsilot yuborilmadi»ni ajrata olsin. Asosiy natija ishonchli bo‘lsa saqlanadi; tafsilot yo‘qligi natijani qayta hisoblash uchun ishlatilmaydi.

### 3.6. Kontent yangilanganda ochiq urinishlar

Oldin ochilgan urinish o‘z kontent versiyasi va javob kalitlari bilan yakunlana olishi kerak. Yangi savollar eski urinishga aralashmasin. 172 dars yangilanganda ochiq solo urinishlari, eski brauzer tablari va navbatdagi v1 hodisalar uchun o‘tish tartibini yozing. V1 qabul qilishni to‘xtatish sharti shundan kelib chiqadi.

### 3.7. Qabul javobining ma’nosi

`201 accepted:true` hodisa faqat saqlanganini bildiradimi yoki progress va mukofot ham qo‘llanganini — aniq belgilaymiz. Qo‘llash asinxron bo‘lsa, uning kuzatiladigan holati, xatosi va qayta ishlash mexanizmi bo‘lsin. Saqlangan hodisa biznes-operatsiya xatosi sabab yo‘qolmasin.

V1 va v2 javoblari ajratilsin: ko‘rilgan v1 implementatsiyasi ayrim o‘quvchilar rad etilganda ham hodisani 201 bilan saqlashi va `rejected_students` qaytarishi mumkin. V2’da yagona o‘quvchi topilmasa 422 berish taklifi mos, lekin bu mavjud v1 xulqi deb yozilmasin.

## 4. CSV va production ma’lumotlari

CSV tekshirildi: **100 ta noyob hodisa, 88 solo va 12 live, jami 195 ta o‘quvchi natijasi yozuvi**. Hammasida `delivered`, HTTP 201 va bo‘sh `error`. Vaqt oralig‘i: 07.11 06:24 — 08.11 20:03 UTC.

CSV School API coin berganini yoki guruh ichidagi barcha o‘quvchilar qabul qilinganini tasdiqlamaydi: unda javob tanasi yo‘q. Ko‘rilgan lokal School API javobida `students_accepted`, `rejected_students` va `reward_status:pending_policy` bor. Haqiqiy natija va coin alohida tekshiriladi.

**4.1.** `STALE_SESSION_MINUTES` production runtime qiymati hali ochiq tekshiruv. Kristina faqat shu sozlamaning samarali qiymatini va ishlayotgan versiyani tasdiqlasin; butun environment yoki maxfiy sozlamalarni yuborish kerak emas. Kod default’i production’dagi fakt sifatida qabul qilinmaydi.

**4.2 / GW 69.** Tekshiruv yangi kontraktni tayyorlashni to‘xtatmaydi. Biroq yangi qoida eski noto‘g‘ri holatlarni o‘z-o‘zidan tuzatmaydi; tarixiy masala alohida qoladi.

300/300 `crm_id` to‘lgani va sessiya davomiyligi statistikalarini siz bergan tekshiruv natijasi sifatida qayd etdik. Kelishilgan 2 soatlik sessiya va 45 daqiqalik arena limitlari saqlanadi.

## 5. Keyingi qadam va qabul tekshiruvlari

Tuzatilgan JSON namunalarini, brauzer-server bog‘lanishini va ochiq urinishlar uchun o‘tish tartibini yuboring. Eski 50 xabar uchun alohida yubormasdan hisoblangan hisobot tayyorlang: har o‘quvchi/dars bo‘yicha eski va tuzatilgan ko‘rsatkich, chiqarilgan tafsilot sababi va manba versiyasi bo‘lsin. Biz mavjud natija va mukofotlar bilan solishtiramiz.

Oldingi 10 ta ssenariyga quyidagilar qo‘shilsin:

- live’da tugatmagan → solo’da birinchi yakunlash → mukofot bir marta;
- arena yakuni qatnashish hodisasidan oldin kelishi;
- server va brauzer bir xil natijani parallel yuborishi;
- 7 kunlik solo davomiyligi va umuman boshlanmagan arena;
- tafsiloti tushirilgan natija bilan haqiqatan javobsiz natijani ajratish;
- eski versiyada ochiq urinish paytida yangi dars nashri;
- eski xabarni tiklashda brauzer orqali oldin berilgan coin takrorlanmasligi.

JSON va o‘tish tartibi kelishilgach, ikki tomon ish hajmi va muddatlarni belgilaydi. QA qabulidan keyin 172 darsni dars vaqtidan tashqarida chiqarish kelishuvi saqlanadi.
