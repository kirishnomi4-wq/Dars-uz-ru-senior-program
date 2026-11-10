# Dars v2 — bizning tomon QA’da tayyor

10 noyabr 2026 · 30-hujjatga javob

Salom. 25-kontrakt bo‘yicha School API, CRM va LMS tomonini amalga oshirdik va QA’ga chiqardik. Staging Dars yangi qabul qiluvchiga ulangan, **RESULT_SCHEMA_V2=on**. Keyingi qadam — birgalikda jonli darsni boshidan oxirigacha tekshirish. Biz tomondan production’ga chiqarish yoki uning sozlamalarini o‘zgartirish bajarilmadi.

## 1. Staging ulanishi tayyor

LMS: https://qa-lms.coddycamp.uz  
CRM: https://qa-crm.coddycamp.uz  
Dars health: https://staging-dars-api.coddycamp.uz/api/v1/health

Health’da result_schema_v2: on tasdiqlandi. Staging Dars uchun natijalarni yuborish, QA o‘quvchi kontekstini o‘qish, JWT va QA domenlarining CORS ruxsatlari sozlandi. Tokenlarni qayta yuborishingiz kerak emas.

**POST:**  
https://qa-crm.coddycamp.uz/dars-school-api/api/v1/integrations/dars-platform/lesson-results

**GET:** shu manzilga /{event_id} qo‘shiladi.

## 2. Uch hodisa va mukofot qoidalari

lesson_result, arena_participation va arena_result alohida saqlanadi. GET queued/applied/failed holatini, tasdiqlangan natijani va xato holatini qaytaradi. Qayta yetkazish ikkinchi to‘lov yaratmaydi; bir ID bilan boshqa mazmun yuborilsa konflikt qaytadi.

CodeStrike’da birinchi savolni ko‘rish Learn avtozachyoti uchun yetarli, javoblar soniga chegara qo‘yilmadi. Class yakuni alohida: qatnashish va tugatish ikkalasi true bo‘lishi kerak. Arena ishtiroki Class’ni o‘z-o‘zidan tugatmaydi.

Learn va CodeStrike uchun ikki marta coin olish bloklandi. Learn’dan qisman coin olingani ham student_question_rewards orqali hisobga olinadi. Learn mustaqil tugatilgan bo‘lsa ham arena mukofoti berilmaydi. CodeStrike uchun coin berilgan bo‘lsa, tegishli Learn uchun qayta coin berilmaydi. Faqat avtozachyotning o‘zi arena mukofotini bloklamaydi. Bir vaqtdagi Learn/arena so‘rovlari umumiy blokirovka va tranzaksiya bilan himoyalangan.

## 3. LMS yangi onFinished yukini qabul qiladi

schema_version:2 va dars_api bog‘lanishi qabul qilinadi. LMS server tasdig‘ini kutadi, brauzer orqali qayta coin hisoblamaydi va avtomatik ravishda dars yoki arenadan chiqarib yubormaydi. Eski v1 oqimi saqlangan.

## 4. Nimalar tekshirildi

API validatsiyasi, takroriy yetkazish, konflikt, hodisalarning teskari tartibi, javobsiz arena, oldin boshlangan Learn, tranzaksiya qaytarilishi va bir vaqtdagi Learn/arena hisoblashlari tekshirildi. V2 API testlari: 8 test, 42 tekshiruv. CRM CI va LMS build muvaffaqiyatli yakunlandi.

LMS komponenti kompyuter va mobil o‘lchamlarda tekshirildi. E’lon qilingan QA LMS’da ikkala o‘lchamda ham kirish ishlaydi; JavaScript xatosi va gorizontal siljish aniqlanmadi. QA CRM bergan token staging Dars tomonidan qabul qilindi.

Staging’dan kelgan 5 hodisa yakuniy holatga yetdi: bittasi applied, coins=0, coins_reason=not_completed; to‘rttasi dars_lesson_access_unavailable bilan rad etildi — tegishli QA o‘quvchilarida talab qilinadigan dars/kurs ruxsati yo‘q. GET barcha holatlarni tasdiqladi. Qo‘llangan hodisaning takroriy POST’i duplicate=true qaytardi.

QA tekshiruvida topilgan CRM sxemasiga mos kelmaslik tuzatildi. Vaqt validatsiyasi ham sizning yuboruvchingizga moslashtirildi: millisekundlar saqlanadi, elapsed_sec vaqtlar farqidan soniyaga yaxlitlanadi.

## 5. Endi birgalikda jonli tekshiruv

To‘liq jonli darsni siz bilan hali o‘tkazmadik. Yuqoridagi lokal komponent testlari bunday jonli tekshiruv o‘rniga ko‘rsatilmayapti.

Iltimos, amaldagi v2 JSX bilan QA’da sinash uchun dars havolasini va qulay vaqtni yuboring. Testdan oldin QA o‘quvchisining kerakli Class/kursga ruxsati borligini tekshiramiz. Yangi biznes-qoidalarni kelishish talab qilinmaydi — 25-kontrakt bo‘yicha quyidagilarni tasdiqlaymiz:

1. Oxirgi ekranga yetish → tugma bosilmasdan lr_ hodisasi, applied va Class yakuni; arena sahifada qoladi.
2. Birinchi arena savoli → ap_ hodisasi va Learn avtozachyoti, jumladan javobsiz ishtirok.
3. Arena yakuni → ar_ hodisasi, to‘g‘ri coin natijasi; takroriy yuborishda qo‘shimcha to‘lov yo‘q.
4. Learn’dan qisman coin olgan holat va CodeStrike’dan keyingi Learn holatida ikkinchi mukofot berilmaydi.


## 6. Production va oldingi alohida bandlar

Production qabul qiluvchisi hali ushbu reliz bilan yangilanmagan. QA’dagi jonli qabuldan keyin production chiqarilishi alohida kelishiladi; staging’dagi on production uchun ruxsat degani emas.

Production’dagi STALE_SESSION_MINUTES qiymati bu ish doirasida tekshirilmadi, uni tasdiqlangan deb ko‘rsatmaymiz. Shahzoda uchun read-only analitika konnektori va production tarmoq ruxsatlari ushbu QA reliziga kirmadi. 35887 tasdig‘i, production validator SHA’si va 20a bo‘yicha tarixiy tiklash ham hali yopilmadi; ular jonli QA testini to‘xtatmaydi.

## 7. Versiyalar va dalil

CRM QA: a4e9afb7f33ec9718fadbbb8eec84dd43d535cfb  
School API QA: 2650a98712243f6ba66d49faa32082eb66f138f6  
LMS QA: 3abb33b94301881447f43e5169dbcf37bca45b61  
Dars staging: f65573c5

CRM CI:  
https://gitlab.com/azimkhon/coddycamp-crm/-/pipelines/3048491018  
LMS chiqarilishi:  
https://github.com/AzamkhonKh/coddycamp-frontend/actions/runs/42772036935
