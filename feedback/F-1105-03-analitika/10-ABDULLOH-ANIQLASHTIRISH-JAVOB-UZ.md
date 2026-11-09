# JSX va Dars API jamoasiga uchta aniqlashtirish bo‘yicha javob

**Sana:** 06.11.2026  
**Asos:** `09-ABDULLOH-ANIQLASHTIRISH-UZ.md`  
**Oldingi qarorlar:** `07-ABDULLOH-JAVOBLAR-VA-QARORLAR-UZ.md`

## 1. CodeStrike Learn uchun muqobil

**1.1. Ball chegarasi kerak emas.** Bu qoidani JSX muallifi bilan shaxsan muhokama qilganmiz va u rozilik bildirgan. Kelishuv: **CodeStrike — Learn uchun muqobil**, qo‘shimcha majburiy test emas.

Shuning uchun o‘quvchining arenada qatnashishi bog‘langan Learn’ni avtomatik bajarilgan deb belgilash va yashirish uchun yetarli. To‘g‘ri javoblar soni bunga ta’sir qilmaydi. Bu qoida faqat ikki marta coin olishni to‘sish uchun kiritilmagan; o‘quvchi uchun ikki muqobil faoliyatdan birini hisobga olish qaroridir.

**1.2. Kamida 7 ta to‘g‘ri javob yoki boshqa ball chegarasini qaytarmaymiz.** JSON namunalarini ball chegarasisiz qoida asosida tayyorlang. Arena ballari analitika va mukofotni hisoblash uchun yuboriladi, Learn’ni avtomatik hisoblash sharti sifatida ishlatilmaydi.

Oldingi istisno saqlanadi: Learn urinishini oldin boshlagan o‘quvchi shu urinishni tugatishi mumkin, lekin arenada qatnashgandan keyin yangi Learn urinishini boshlay olmaydi. Learn va CodeStrike o‘rtasidagi takroriy coin berishni cheklash qoidalari o‘zgarmaydi.

## 2. Arenada qatnashish boshlanadigan lahza

**Siz taklif qilgan (b) variantini qabul qilamiz:** arena boshlanib, o‘quvchi ekranida birinchi savol ko‘rsatilgan lahza.

- CodeStrike tugmasini bosish yoki lobbida kutishning o‘zi qatnashish hisoblanmaydi.
- Arena boshlanmasdan chiqib ketgan o‘quvchi uchun Learn avtomatik hisoblanmaydi.
- Kech qo‘shilgan o‘quvchi uchun qatnashish — u birinchi ko‘rgan arena savoli ko‘rsatilgan lahzadan boshlanadi. Bu arenaning umumiy birinchi savoli bo‘lishi shart emas.
- Javob yuborish shart emas: birinchi savol ko‘rsatilgan bo‘lsa, javoblar soni nol bo‘lsa ham qatnashish qayd etiladi.

Shu hodisa Learn’ni avtomatik hisoblash, ro‘yxatdan yashirish va keyingi darsga yo‘l ochish uchun yuboriladi. `played: answered > 0` bu hodisaning o‘rnini bosmaydi. Qatnashish alohida qayd etilishi kerak; takroriy yetkazish yangi qatnashish yoki mukofot yaratmaydi.

## 3. O‘quv qismi uchun coin

**3.1. O‘quv qismi mukofoti alohida qoladi.** Bir o‘quvchi va bir dars uchun takroriy mukofot berilmaydi. Mukofotni ko‘rib chiqish uchun o‘quv qismi natijasi hodisasi ishlatiladi.

Muhim shart: **qatnashish va yakunlash — alohida holatlar, coin berilishi uchun ikkalasi ham `true` bo‘lishi kerak.** Bu yerda o‘quv qismida qatnashish nazarda tutilgan; CodeStrike’da qatnashish o‘quv qismi mukofoti uchun shart emas.

| O‘quv qismida qatnashgan | O‘quv qismini yakunlagan | O‘quv qismi coin’i |
| --- | --- | --- |
| `true` | `true` | Amaldagi hisoblash qoidalari bo‘yicha beriladi; takroriy mukofot yo‘q |
| `true` | `false` | Berilmaydi |
| `false` | `true` | Berilmaydi; holatlar mos kelmasligini tekshirish kerak |
| `false` | `false` | Berilmaydi |

Bu jadvaldagi nomlar biznes shartlarini ifodalaydi; JSON maydonlarining aniq nomlarini namunalarda kelishamiz. Ikkala shart bajarilishi barcha javoblar uchun avtomatik coin berish degani emas: summa amaldagi mukofot hisoblash qoidalari asosida aniqlanadi.

**3.2. `completed:false` bo‘lsa, coin berilmaydi**, shu paytgacha to‘g‘ri javoblar mavjud bo‘lsa ham. Javoblar va progress analitika uchun saqlanadi. Sessiyaning vaqt bo‘yicha yopilishi o‘quvchi o‘quv qismini tugatganini anglatmaydi.

Yakunlash «Darsni yakunlash» tugmasini bosishni talab qilmaydi: kelishilganidek, birinchi marta oxirgi o‘quv ekraniga yetish bilan avtomatik qayd etiladi.

**3.3. Learn va CodeStrike o‘rtasidagi coin cheklovi o‘quv qismi mukofotiga tatbiq etilmaydi.** O‘quv qismi mukofoti yuqoridagi o‘z shartlari bilan hisoblanadi. Ushbu bo‘limdagi qatnashish va yakunlash talabi arenaga kirish orqali Learn’ni avtomatik hisoblash qoidasini o‘zgartirmaydi.

## Keyingi qadam

Shu aniqliklar asosida uchta hodisaning versiyalangan JSON namunalarini yuboring:

1. O‘quv qismi natijasi — qatnashish va yakunlash alohida ifodalansin, jumladan `completed:false` holati.
2. Arenada qatnashish — o‘quvchiga birinchi arena savoli ko‘rsatilgan lahza.
3. Yakuniy arena natijasi — javoblar, ballar va podium ma’lumotlari.

Namunalar majburiy maydonlar, identifikatorlar, vaqtlar va qabul javobini qamrab olsin. Oldingi hujjatdagi timeout’lar, takroriy yetkazishdan himoya, ish taqsimoti va QA’dan keyin 172 darsni chiqarish tartibi saqlanadi. Namunalar kelishilgach, ikki tomon ish hajmi va muddatlarni belgilaydi.
