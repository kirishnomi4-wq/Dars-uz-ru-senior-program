# JSX darslari va CodeStrike bo‘yicha kelishilgan qarorlar

**Sana:** 06.11.2026  
**Kimga:** JSX va Dars API jamoasiga  
**Asos:** 05.11.2026 dagi `06-ABDULLOH-QARORLAR-VA-SAVOLLAR-UZ.md` savollariga javob.

Dars natijasini saqlash o‘quvchining «Darsni yakunlash» tugmasini bosishiga bog‘liq bo‘lmasligi kerak. O‘quv qismi natijasi, arenaga kirish va arena yakuniy natijasi alohida hodisalardir. Natijani saqlash bilan sahifadan chiqish ham ajratiladi.

Quyidagi mahsulot qoidalari kelishildi. API maydonlarining yakuniy formati ikki tomon tomonidan moslashtiriladi; bu hujjat mavjud API yangi hodisalarni hozirdanoq qabul qiladi degani emas.

## 1. Learn va mukofotlar bo‘yicha yangilangan qoida

Bu qoida oldingi «CodeStrike’da kamida 7 ta to‘g‘ri javob bo‘lsa Learn avtomatik yopiladi» qoidasini almashtiradi.

1. **Learn arena natijasini kutmasdan ochiq bo‘ladi.** Bu darsning oxirgi ekraniga yetmagan o‘quvchilarga ham tegishli.
2. **O‘quvchi CodeStrike arenasiga kirishi bilan bog‘langan Learn avtomatik bajarilgan deb belgilanadi, ro‘yxatdan yashiriladi va keyingi darsga yo‘l ochiladi.** Javob berish yoki 7 ball olish shart emas. Arenaga kirib, birorta javob bermagan o‘quvchi ham qatnashgan hisoblanadi.
3. Agar o‘quvchi Learn urinishini oldin boshlab qo‘ygan bo‘lsa, shu urinishni tugatishiga ruxsat beriladi. Arenaga kirgandan keyin Learn’da yangi urinish boshlash mumkin emas.
4. Agar o‘quvchi Learn’ni mustaqil bajarib bo‘lgan bo‘lsa, CodeStrike uchun coin berilmaydi: javoblar uchun ham, podium uchun ham.
5. Agar CodeStrike uchun coin allaqachon berilgan bo‘lsa, Learn uchun coin berilmaydi. Nol coin — mukofot olingan degani emas.
6. CodeStrike’da qatnashish sababli Learn’ning avtomatik bajarilgan deb belgilanishi Learn mukofotini bermaydi va CodeStrike mukofotini to‘sib qo‘ymaydi. Mustaqil bajarish va avtomatik hisoblash sabablari ajratiladi.
7. Mukofotga huquqni tekshirish va coin berish bitta atomar operatsiya bo‘lishi kerak. Learn va CodeStrike bir vaqtda yakunlansa ham ikki marta mukofot berilmasin.

## 2. Yuborish mantiqi bo‘yicha javoblar

### 2.1. Qaysi kanal

Asosiy kanal sifatida **Dars API → qabul qiluvchi API → LMS/CRM** server yo‘lini olamiz. Brauzer zaxira kanal bo‘lsa, bir xil hodisani ikkinchi marta hisoblamasligi kerak.

Uchta mustaqil hodisa kerak:

- o‘quv qismi natijasi;
- o‘quvchining arenaga kirishi;
- arenaning yakuniy natijasi.

`onFinished` orqali saqlash avtomatik ravishda sahifadan chiqarish yoki live-sessiyani yopish bilan bog‘lanmasin. «Darsni yakunlash» tugmasi chiqish uchun qoladi; natijani saqlash bu tugmani kutmaydi.

### 2.2. Jonli darsdagi birinchi xabar

Har bir o‘quvchi uchun alohida: o‘zi oxirgi o‘quv ekraniga birinchi marta yetganda. Mentorning oxirgi ekranga o‘tishini yoki butun sinfni kutmaymiz. Arena shu ekrandan keyin mavjud bo‘lib qolishi kerak.

### 2.3. Oxirigacha yetmagan o‘quvchi

Sessiya yopilganda `completed:false` va qaysi ekrangacha yetgani yuboriladi. Bu ma’lumotni qabul qilish Class darsini avtomatik bajarilgan deb belgilash degani emas. Learn uchun arena yoki sessiya yopilishini kutish talab qilinmaydi.

### 2.4. Birinchi xabardan keyingi javoblar

Birinchi o‘quv natijasi o‘zgarmaydi. Orqaga qaytish va yangi javoblar analitikada alohida saqlanishi mumkin, lekin birinchi natija va unga tegishli mukofot qayta hisoblanmaydi. Arena natijasi o‘quv natijasidan alohida qayd etiladi.

### 2.5. Learn qachon ochiladi

Darhol, arena natijasini kutmasdan. Arenaga kirilganda yuqoridagi 1-bo‘lim qoidalari qo‘llanadi. Kamida 7 ta to‘g‘ri javob talabi Learn’ni yashirish va avtomatik hisoblash uchun bekor qilinadi.

### 2.6. Arena umuman o‘ynalmasa

Sessiya yopilganda qatnashmaganlik aniq qayd etilsin. Learn bu xabarni kutib turmaydi. «Hali arena natijasi yo‘q» va «arena yakunlandi, o‘quvchi qatnashmadi» ikki xil holat.

### 2.7. Mentor arenani yopmasa

Oxirgi savolning serverdagi vaqti tugagach **1 daqiqadan keyin** arena avtomatik yakunlanadi. Bundan tashqari, arena ishga tushganidan **45 daqiqadan oshmasligi** kerak. Qo‘lda yakunlash yoki umumiy sessiya yopilishi bundan oldin bo‘lishi mumkin.

### 2.8. Darsda bor, lekin arenaga kirmagan o‘quvchi

Yakuniy xabarda qatnashmagan sifatida ko‘rsatiladi. Arenaga kirgan, ammo javob bermagan o‘quvchini qatnashmagan deb yubormang: uning qatnashganligi va nol natijasi alohida ifodalanishi kerak. Hozirgi `played` maydoni javoblar sonidan hisoblanadigan bo‘lsa, u kirish hodisasining o‘rnini bosa olmaydi.

### 2.9. Takroriy coin berishni oldini olish

Turli `event_id` berishning o‘zi yetarli emas. Himoya o‘quvchi, bog‘langan Learn va mukofot manbasi bo‘yicha umumiy bo‘ladi. O‘quv qismi xabari kelajakdagi CodeStrike mukofotini yakuniy nol sifatida muzlatib qo‘ymasligi kerak.

CodeStrike javoblari va podium mukofoti yakuniy arena natijasidan hisoblanadi; Learn bilan o‘zaro cheklov 1-bo‘lim bo‘yicha tekshiriladi.

Har o‘quvchi uchun alohida xabar yuborilsa, hodisa identifikatori ham buni ajratishi kerak. Yetkazish qayta urinishida o‘sha hodisaning identifikatori va mazmuni saqlanadi. Bir xil identifikator bilan boshqa mazmun yuborilmaydi.

### 2.10. Takroriy dars va arena

O‘quv qismi natijasi oldin kelgani uchun o‘quvchini keyingi arena xabaridan chiqarib tashlamang. Bu ikki tur natijaning takrorlari alohida aniqlanadi.

**Birinchi yakunlangan arena hisobga olinadi.** Keyingi o‘yinlar mashq uchun: natija va mukofotni o‘zgartirmaydi, hatto birinchi arena nol coin bergan bo‘lsa ham. Yetkazilmagan birinchi hodisani qayta yuborish yangi o‘yin hisoblanmaydi.

### 2.11. Solo

Solo’da arena yopiq qoladi. O‘quv qismi avtomatik saqlanadi. Learn oldingi live-qatnashish sababli avtomatik hisoblanmagan bo‘lsa, odatdagidek mavjud bo‘ladi.

### 2.12. «Qaytadan»

Birinchi natijani almashtirmaydi va takroriy mukofot bermaydi. Saqlashdagi texnik xatodan keyin ayni hodisani qayta yetkazish esa davom etishi kerak.

### 2.13. API formati

Mavjud `lesson-results` qabul qiluvchisini yangi hodisalar uchun kengaytirish kerak. `arena` blokini qo‘shishning o‘zi yetarli emas: validator, saqlash va biznes-mantiq moslashtiriladi.

Implementatsiyadan oldin ikki tomon uch hodisaning versiyalangan JSON namunalarini, majburiy maydonlarini, identifikatorlarini va muvaffaqiyatli qabul javobini kelishadi. Qabul qiluvchidagi qo‘llab-quvvatlash tayyor bo‘lmasdan yangi formatni production’ga yubormang.

### 2.14. Ochiq qolgan mentor tabi

Live-sessiya boshlanganidan **ko‘pi bilan 2 soat** ishlaydi, hatto mentor signali kelishda davom etsa ham. Dars 90 daqiqa, qolgan 30 daqiqa zaxira.

Umumiy sessiya limiti, arena uchun 45 daqiqalik limit va oxirgi savoldan keyingi 1 daqiqalik muddatdan qaysi biri oldin kelsa, shu qo‘llanadi. Kech boshlangan arenaga to‘liq 45 daqiqa kafolatlanmaydi.

### 2.15. Production’dagi `STALE_SESSION_MINUTES`

Amaldagi qiymat hali tasdiqlanmagan. Dars API runtime konfiguratsiyasidan aniq qiymat va tekshiruv jadvalini tasdiqlash kerak. Default qiymatni production qiymati deb yozmaymiz. Solo urinishlarining amaldagi yopilish muddati ham alohida tasdiqlansin.

### 2.16. Learn savollarining ID’lari

CRM’da savolni mavjud ID bilan tahrirlash mumkin. Savolni arxivlab, yangisini yaratish esa boshqa operatsiya va yangi ID beradi.

Joriy savollar ro‘yxati uchun Active savollar olinadi. Tarixiy natijalar esa o‘sha paytdagi asl savol ID’siga bog‘lanib qoladi; arxivdagi savollarni tarixiy tahlildan chiqarib tashlash noto‘g‘ri. Tartib raqami bo‘yicha moslashtirishda til va kontent versiyasi ham hisobga olinsin.

## 3. Analitika va o‘qish huquqi

**3.1.** Kelishilgan A yo‘li saqlanadi. Siz Dars bazasidagi view’larni tayyorlaysiz; bizning tomon read-only ulanish va konnektor integratsiyasini tashkil qiladi. Aniq ulanish parametrlari va ruxsat etilgan view’lar ro‘yxati texnik sozlashda kelishiladi.

**3.2.** Analitik detallar kelishilgan view’lar orqali olinadi. Ishchi hodisalarda progress, qatnashish, avtomatik hisoblash va mukofotlar uchun kerakli ma’lumotlar bo‘lishi shart. Faqat yakuniy arena bloki emas, arenaga kirish hodisasi ham kerak.

**3.3.** School API’ga muvaffaqiyatli yetkazish CRM’dagi `jsx_lesson_*` jadvallari to‘lganini anglatmaydi. Mavjud CRM statistikasi `question_try` yo‘li orqali yoziladi; server integratsiyasi boshqa yo‘l.

02.11 dan keyingi haqiqiy HTTP javoblari va saqlash holati hali tekshirilishi kerak. Dars tomonidan `event_id`, yetkazish holati, HTTP status va shaxsiy ma’lumotsiz xato tafsilotlarini tayyorlang. CRM jadvallarining to‘lishi biz tomonda alohida tekshiriladi.

Avval kelishilgan analitika cheklovlari saqlanadi: ism va kontaktlar chiqarilmaydi; o‘quvchining matni faqat sizning bazangizda qoladi, konnektorga bir topshiriqda kamida 5 o‘quvchida takrorlangan noto‘g‘ri javoblarning umumlashgan ko‘rinishi chiqadi. Tekshiruvsiz practice uchun `correct:null`, eski yozuvlar uchun yangi `opened_at:null`; vaqtlar UTC, ISO-8601.

## 4. GW 69 va tarixiy tekshiruvlar

**4.1–4.2.** Hozir bizga mavjud School Data API katalogida Dars sessiyalari va `result_events` resurslari yo‘q. Siz tomondan GW 69 sessiyasi hamda oktabr yetkazish svodkasining shaxsiy ma’lumotsiz eksporti kerak. Bu hujjat production bazasiga yangi to‘g‘ridan-to‘g‘ri kirish huquqini bermaydi.

**4.3.** Testi yopiq qolgan 5 o‘quvchining aniq LMS ID’larini Shahzodadan olish kerak. Shundan keyin har biri bo‘yicha hodisa va LMS holati solishtiriladi.

## 5. O‘quvchi identifikatorlari

**5.1.** Student roli uchun tokenning `sub` qiymati `student_students.id` — LMS o‘quvchi ID’sidir. Mentor tokeniga bu qoida tatbiq etilmaydi.

**5.2.** Student tokenida `crm_id` alohida beriladi. Dars uni `lms_participants.crm_id` ga amalda yozayotganini siz tomonda tekshirish kerak; token ichida mavjudligi bazaga yozilganini tasdiqlamaydi.

## 6. Avtomatik hisoblash manbasi

`codestrike_source_log_id` hozir sonli `student_question_log.id` uchun ishlatiladi. Unga `sess_..._arena` kabi satrli `event_id` yozilmaydi.

Server hodisasi bilan bog‘lanishni bizning tomon moslashtiradi. Learn avtomatik hisobi uchun manba — **arenaga kirish hodisasi**; mukofot uchun manba — **yakuniy arena natijasi**. Bu manbalar ajratiladi.

## 7. Ish taqsimoti va chiqarish tartibi

**7.1. Sizning tomon:** JSX va Dars API o‘zgarishlari, avtomatik hodisalar, yetkazish qayta urinishlari, timeout’lar, o‘z bazangiz migratsiyalari va analitik view’lar.

**Bizning tomon:** LMS/CRM/School API qabul qiluvchisi, Learn kirishi va avtomatik hisobi, coin himoyasi, hodisa manbalari bilan bog‘lash, analitika ulanishi, tekshiruv va release.

**7.2.** Kalendar muddatlar hali belgilanmagan. Yakuniy API namunalarini kelishib, ikki tomon ish hajmini baholagach sanalarni beramiz.

**7.3.** Avval QA’da bitta dars bilan to‘liq integratsion tekshiruv. Qabuldan keyin **barcha 172 dars dars vaqtidan tashqarida** chiqariladi; alohida production-pilot bosqichi bo‘lmaydi. Aniq kun va soat hali kelishilmagan.

## 8. Qabul uchun majburiy ssenariylar

- Oxirgi ekranga yetib, tugmani bosmaslik: natija saqlanadi, arena ochiq qoladi.
- Arenaga kirib, javob bermaslik: Learn avtomatik hisoblanadi, keyingi dars ochiladi.
- Learn oldin bajarilgan, arena keyin tugagan: CodeStrike javoblari va podium uchun coin yo‘q.
- CodeStrike mukofoti oldin berilgan, avval boshlangan Learn keyin tugagan: Learn uchun coin yo‘q.
- CodeStrike sababli avtomatik hisoblangan Learn CodeStrike mukofotini to‘sib qo‘ymaydi.
- Bir vaqtdagi yakunlashlar, ikki kanal va takroriy yetkazish: qo‘shaloq mukofot yo‘q.
- Birinchi arena nol natija, keyingi arena yuqori natija: birinchi natija va mukofot o‘zgarmaydi.
- Mentor tabini yopish, ochiq qoldirish va oxirgi savolga yetmaslik: tegishli timeout natijalarni yakunlaydi.
- Darsni tugatmagan o‘quvchi: progress saqlanadi, Class yolg‘ondan bajarilgan deb belgilanmaydi.
- Solo, eski JSX kontrakti va ikki tildagi variantlar: regressiya yo‘q.

LMS tekshiruvlari kompyuter va mobil qurilmalarda, CRM interfeysi tekshiruvlari kompyuterda bajariladi.
