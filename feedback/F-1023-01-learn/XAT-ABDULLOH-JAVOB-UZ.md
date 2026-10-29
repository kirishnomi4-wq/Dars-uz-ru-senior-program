# CodeStrike → Learn: savollarga javob (27.10.2026)

Salom!

Tekshiruvlar va ma’lumotlar uchun rahmat. Biz tomonda siz ko‘rsatgan v2 faylning
qabul sinovlari o‘tgan. 26-oktabrdagi yakuniy reliz protokoliga ko‘ra,
Learn’ni avtomatik yakunlash va yashirish backend’i hamda kerakli migratsiya
QA va production’ga chiqarilgan. Quyida savollaringizga javob va barcha
darslarni yangilashdan oldin aniqlashtiriladigan bandlar bor.

## 1. T1–T6 va BUG-01

Tekshirilgan fayl sizning xatingizdagi fayl bilan bir xil:

```text
Fayl:    internet-01-v18-codestrike-bug01-v2-20261023.jsx
Hajmi:   490 810 bayt
SHA-256: ba2268cfcac0ccc5a230d46d9fecc539b6c022992ed67c8ceb7a09f036a30627
```

| Holat | Tekshiruv natijasi |
|---|---|
| T1: sinfda 8/12 | `codestrike.passed: true`; keyingi Learn avtomatik yakunlanib, o‘quvchidan yashiriladi. |
| T2: sinfda 5/12 | `codestrike.passed: false`; Learn yashirilmaydi, odatiy kirish qoidalari saqlanadi. |
| T3: arena boshlanmagan | `codestrike.played: false`; Learn yashirilmaydi. |
| T4: uyda 7/12 | `codestrike.passed: true`, `codestrike.mode: "solo"`; keyingi Learn avtomatik yakunlanadi va yashiriladi. |
| T5: avval 3/12, qayta o‘yinda 12/12 | Birinchi 3/12 va `passed: false` saqlanadi; Learn yashirilmaydi. |
| T6: tugagan darsni qayta ochib yakunlash | Birinchi natija va Learn bo‘yicha qaror o‘zgarmaydi. |

BUG-01 bo‘yicha v2 tekshiruvlari ham o‘tgan: taymautdan keyingi qayta o‘yin,
arenani yopib qayta ochish, sahifani yangilash, birinchi o‘yinda barcha savollarni
o‘tkazib yuborish, «Qaytadan» va solo → jonli rejimga o‘tish birinchi natijani
almashtirmaydi yoki unga yangi javoblarni qo‘shmaydi. Birinchi muvaffaqiyatli
natija keyingi muvaffaqiyatsiz o‘yindan keyin ham saqlanadi.

Sinovlarda haqiqiy JSX va LMS backend ishlatilgan, tashqi Dars sessiyalari esa
test javoblari bilan modellashtirilgan. Haqiqiy Dars jonli sessiyalarining
sinxronizatsiyasi bu tekshiruv bilan tasdiqlanmagan.

Bu tasdiq yuqoridagi v2 faylga tegishli. Siz bildirgan 44/44 test, 182 darsning
yig‘ilishi va 14 darsning brauzer tekshiruvini biz mustaqil qayta tekshirmaganmiz.

## 2. LMS production’da tayyormi?

Ha, 26-oktabrdagi reliz protokoliga ko‘ra, `codestrike` natijasini o‘qib,
keyingi Learn’ni yashiradigan backend production’ga chiqarilgan.

Muhim aniqlik: **7/12 chegarasini JSX hisoblaydi**. Backend quyidagi signalga
qaraydi:

```json
{
  "codestrike": {
    "played": true,
    "passed": true,
    "mode": "student"
  }
}
```

Bu faqat Learn’ni yashirish uchun tekshiriladigan maydonlar parchasi;
to‘liq natijadagi boshqa maydonlarni olib tashlash kerak emas.
`mode: "solo"` ham qabul qilinadi. `played` va `passed` aynan boolean bo‘lishi
kerak. Dars natijasining eng yuqori darajasidagi `passed` buning o‘rnini bosmaydi.

Qaror o‘quvchi va JSX darsi bo‘yicha **birinchi saqlangan natijadan**, LMS’da
dars yakunlanganda olinadi. Qayta o‘yin, boshqa til yoki qayta yuborish uni
almashtirmaydi. Agar eski birinchi natijada `codestrike` bo‘lmasa, keyingi
muvaffaqiyatli urinish Learn’ni avtomatik yakunlamaydi. Tarix ommaviy qayta
hisoblanmaydi.

Muvaffaqiyatsiz yoki o‘yinsiz natijada Learn avtomatik yakunlanmaydi va
yashirilmaydi; uning odatiy kirish qoidalari saqlanadi. Bu har qanday holatda
Learn’ga darhol o‘tish degani emas: Davomat rejimida LMS kurs ro‘yxatiga qaytishi
mumkin.

## 3. Learn’siz darslarda nima bo‘ladi?

Learn’ni tanlash faqat Class bilan bog‘langanligiga qarab ishlamaydi.
Backend **shu moduldagi `order` qiymati kattaroq bo‘lgan birinchi faol darsni**
oladi:

- U Learn bo‘lsa, muvaffaqiyatli CodeStrike uni shu o‘quvchi uchun yakunlaydi va yashiradi.
- U Practice, Class yoki boshqa tur bo‘lsa, keyinroq joylashgan Learn qidirilmaydi.
- Keyingi faol dars bo‘lmasa, yashiriladigan Learn ham yo‘q.

`BELONGS` bog‘lanishi bu tanlov uchun shart emas. Shuning uchun «Learn
bog‘lanmagan bo‘lsa, maydon hech narsaga ta’sir qilmaydi» degan jumlani aynan
shu shaklda tasdiqlay olmaymiz: modul va darslar tartibini ham tekshirish kerak.
Xatingizdagi Class 2848 → Learn 3152 juftligi uchun ham shu qoida amal qiladi;
bu juftlikni ushbu javobni tayyorlashda alohida tekshirmadik.

Avtomatik yakunlangan Learn uchun alohida javoblar yoki mukofot yaratilmaydi.

## 4. Learn savollarining JSON formati

Har dars uchun 12 ta savolning uz va ru variantlarini topshirish hamda CRM’ga
import qilish formati hozircha kelishilmagan. Learn’ni yashirish funksiyasi
bunday import formatini belgilamaydi; yuqoridagi `codestrike` JSON esa savollar
formati emas, o‘yin natijasidir.

Shuning uchun hozir tasdiqlangan import namunasi sifatida JSON bera olmaymiz.
Savol turi, javob variantlari, to‘g‘ri javob va ikki tildagi moslikni ifodalovchi
formatni alohida kelishib olish kerak. Barcha savollarni yakuniy formatda
tayyorlashdan oldin shu bandni yopaylik.

## Qo‘shimcha: CodeStrike mukofotlari

Learn’ni yashirishdan tashqari, CodeStrike javoblari va 1–3-o‘rinlar uchun coin
berish ham qo‘shilgan. 26-oktabrdagi oxirgi mukofotlar hisobotiga ko‘ra, bu qism
hozircha faqat QA’da chiqarilgan; uni production’da tayyor deb hisoblamaslik kerak.

V2 javoblar sonini allaqachon uzatadi. O‘rinlar uchun bonusga esa
`codestrike.podium` kerak: `game_id`, `place`, `finalized`. Yakuniy o‘rin
**birinchi `onFinished` ichida** kelishi kerak; keyin yuborilsa, qo‘shimcha bonus
berilmaydi. Amaldagi v2 bu obyektni hali yubormaydi. Bu Learn’ni yashirish uchun
talab emas, mukofotlar bo‘yicha alohida qo‘shimcha.

## Barcha darslarni yangilashdan oldin

LMS’da Learn’ni yashirish backend’i tayyorligi va yuqoridagi v2 qabul sinovlari
o‘tganini tasdiqlaymiz. Barcha 182 faylning ommaviy yuklanishini tasdiqlashdan
oldin quyidagilarni yuboring:

1. Yangilanadigan fayllar ro‘yxati va har birining SHA-256 qiymati.
2. JSX/Class → Learn mosligi, modul va darslar tartibi. Learn bo‘lmagan holatlarni ham ko‘rsating.
3. Yangi yig‘malarda amaldagi preview logikasi saqlangani haqidagi tasdiq.

Oldingi production tekshiruvida Internet JSX ichida yangi preview logikasi
bor edi. Uni v2 bilan almashtirishda shu funksiyani yo‘qotmaslik kerak.
Biz tomondagi backend relizi barcha JSX fayllarining ommaviy yangilanganini
anglatmaydi.

Hurmat bilan,
Abdulloh
