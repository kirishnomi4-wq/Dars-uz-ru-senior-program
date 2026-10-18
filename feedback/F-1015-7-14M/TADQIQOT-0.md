# F-1015-100…107 · 0-bosqich · A — Tadqiqot (15.10.2026)

Maqsad (D1 A): 7–14-Modul darslarini qayta qurishdan oldin — boshqa ta'lim platformalari **bitta ekran / bitta mashq** ni qanday tuzishini aniqlash.
Usul: rasmiy sahifalar va o'zlari e'lon qilgan qoidalar o'qildi (WebFetch, 15.10). Kirishsiz ochiladigan sahifa — faqat w3schools (surat `tadqiqot/w3-*.jpg`).
Brilliant, Codecademy, Khan darslarining ichi kirishsiz ochilmaydi — ular uchun faqat o'zlari yozgan qoidalar va sharhlar. **Taxmin bilan to'ldirilmadi.**

> **Cheklov (nazorat, 15.10):** Brilliant, Codecademy va Khan darslari **to'g'ridan-to'g'ri ko'rilmagan** — standartdagi ularga oid har band «e'lon qilingan qoida / sharh» darajasida.
> Foydalanuvchi akkaunti orqali dars suratlari kelsa — 2-bo'limdagi jadval yangilanadi (sana va F-ID bilan).

## 0. Oldingi tadqiqot (04.10) — kech topildi

`feedback/F-0929-QA-6modul/D5_TADQIQOT.md` (F-1004, inglizcha) — xuddi shu 4 platforma; natijasi qolipga (`src/qolip/QOLIP.md` §6) va 193–199-qonunlarga kirgan
(«ekranda bitta g'oya, 60 so'zgacha», 2 tugma, 9 token, emoji yo'q). **0-bosqich boshida qidirilmadi** — bu tadqiqot uni takrorlaydi va to'ldiradi:
yangi — Codecademy raqamlari (dars 6 mashq, mashq 3–5 daq, matn ≤250 so'z, checkpoint = bitta vazifa, hint yechimsiz, sarlavha ≤5 so'z, undovsiz),
Brilliant qadam tuzilishi (chizma + savol + 3 javob → chizma o'zgaradi → izoh) va 0-bosqich o'lchovi (qoida bor, lekin o'lchanmagan).

## 1. Manbalar va topilganlar

### w3schools (ochiq sahifa, o'zim ko'rdim)
- Sahifa: sarlavha → bitta jumla izoh → kod qutisi → «Try it Yourself» → keyingi kichik sarlavha… JS `if…else`: 3 bo'lim, **har bo'limda izoh — bitta jumla**, 3 misol + 2 sintaksis qolipi, 3 ta «Try it».
- HTML «Paragraphs»: 8 bo'lim, izoh 1–5 jumla, har bo'limdan keyin misol. Matnda emoji **yo'q**.
- Tugmalar: **ikki xil** — konturli «❮ Previous» va to'liq rangli «Next ❯».
- Mashq alohida sahifada: bo'sh joyni to'ldirish va test, mavzuga 3–9 savol; xato bo'lsa «qayta urinish» yoki «Show Answer».
- Ohang: «Use the `else` statement to specify a block of code to be executed if a condition is false.» — to'g'ridan-to'g'ri, misolsiz kirish yo'q.

### Codecademy (o'quv dasturi standartlari — ochiq e'lon qilingan)
- Dars = **6 ta mashq** (10 tagacha mumkin); mashq **3–5 daqiqa**. Kirish bilan boshlanadi, takrorlash bilan tugaydi, murakkablik asta oshadi.
- Har mashq = **matn + kamida bitta ish maydoni** (kod muharriri, terminal, rasm yoki video). Matn ekranning chap uchdan birida.
- Matn **250 so'zdan qisqa** («Strive for concision!»). Atama va uning ta'rifi + misol, o'xshatish yoki hikoya.
- Har tekshiruv-qadam (**checkpoint**) — **bitta vazifa**; nega muhimligini aytadi; **tayyor yechim kodini bermaydi**.
- Yordam (hint) — faqat kerak bo'lsa, yashirin turadi, yechimni bermaydi, yangi narsa o'rgatmaydi.
- Sarlavha **5 so'zgacha**. Undov o'rniga nuqta. «oson», «aniq-ku», «shunchaki» kabi so'zlar taqiqlangan.
- Har yangi mavzuda **«nega o'rganyapmiz» — misol yoki vaziyat** bo'lishi shart.
- Manbalar: https://curriculum-documentation.codecademy.com/exercises/exercise-standards/ · …/lessons/lesson-standards/ · …/content-guidelines/editorial-pedagogy/

### Brilliant (o'z sahifasi + uchinchi tomon sharhi)
- «Learn by doing»: video va ma'ruza o'rniga **har qadamda masala**. Mavzu **bittadan** («one concept at a time»).
- Bitta qadam: **chizma + uning ostida bitta savol + 3 javob**. Javob bosilgach chizma **harakatlanib natijani ko'rsatadi**, keyin «nega to'g'ri» izohi. Keyingi qadam oldingisiga bitta narsa qo'shadi.
- Dars **5–15 daqiqa**, kurs 20–40 dars. Matn — «qisqa bloklar» (aniq son e'lon qilinmagan).
- Darhol fidbek va xato bo'lsa — maqsadli qo'shimcha mashq.
- Manbalar: https://brilliant.org/ · https://beginnersinai.org/brilliant-explained/ (sharh; «6x samaraliroq» da'vosi manbasiz — ishlatilmaydi)

### Khan Academy (blog va e'lonlar)
- Har yangi tushuncha uch qadamda: **kod o'qish** (dastur qanday bajarilishini kuzatish) → **yo'naltirilgan mashq** (qadam-baqadam, avtomatik tekshiruv) → **erkin loyiha**.
- Manba: https://blog.khanacademy.org/introducing-khan-academys-new-intro-to-computer-science-course-with-python (2014-yilgi format eskirgan bo'lishi mumkin — ishlatilmaydi)

## 2. To'rttasida umumiy naqsh

| # | Naqsh | w3s | Codecademy | Brilliant | Khan |
|---|---|---|---|---|---|
| N1 | Ekranda **bitta asosiy g'oya**; izoh qisqa (1–5 jumla / ≤250 so'z) | ✓ | ✓ | ✓ | ✓ |
| N2 | **Tushuntirishdan keyin darhol harakat** (Try it · checkpoint · savol) | ✓ | ✓ | ✓ | ✓ |
| N3 | Bosilganda **natija o'zgaradi** (kod ishlaydi / chizma harakatlanadi) — matn ochilmaydi | ✓ | ✓ | ✓ | ✓ |
| N4 | Aniq misol yoki kod **birinchi**, atama keyin yoki birga | ✓ | ✓ | ✓ | ✓ |
| N5 | Fidbek darhol; yordam yashirin, yechimni bermaydi | ~ | ✓ | ✓ | ✓ |
| N6 | Bezak yo'q: emoji matnda ishlatilmaydi | ✓ | (nuqta, undovsiz) | ? | ? |
| N7 | Tugma: ikki xil (asosiy va ikkinchi daraja) | ✓ | — | — | — |
| N8 | Dars qisqa bo'laklardan: 6 mashq × 3–5 daq / 5–15 daq | — | ✓ | ✓ | — |

«?» — kirishsiz tekshirib bo'lmadi.

## 3. Bizning darsga ko'chirish (1-bosqich — standart uchun xomaki)

1. **Ekran qolipi 4–5 ta** (D5/D6): Kirish (savol + vaziyat) · Tushuncha (chizma/kod + bitta savol, javobda chizma o'zgaradi — Brilliant N3) · Mashq (bitta vazifa, yashirin yordam — Codecademy checkpoint) · Test · Yakun.
2. **Matn chegarasi**: sarlavha ≤ 5–7 so'z (bizda «≤55 belgi» bor), mentor gapi 1–2 jumla, ekranda bitta asosiy blok. O'lchov (B) qancha ekran oshishini ko'rsatadi.
3. **Asosiy tushuntirish bosish ortida yashirilmaydi** (N3; nazorat tuzatishi 15.10): ekranning asosiy g'oyasi ochiq turadi. Bosish ortida faqat — «Yordam» maslahati, javobni ko'rsatish, test izohi (w3schools «Show Answer», Brilliant maslahati). Imkon bo'lsa bosish natijani o'zgartiradi (chizma, kod natijasi, sanoq).
4. **Emoji yo'q** (D2 A, N6): w3s va Codecademy matnida emoji ham, undov ham yo'q.
5. **Tugmalar** (D4 B): harakat — 2 tur (w3s: kontur + to'liq rang), javob-chip — alohida tur.
6. **Kod birinchi** (D8 A, N4): texnik ekranda avval kod va natija, keyin atama.

## 4. Ochiq qolgan (1-bosqichda)
- Brilliant, Codecademy va Khan ekranlarining **o'z suratlari** yo'q (kirish kerak). Agar akkaunt bo'lsa — 1 ta dars ko'rib suratga olish mumkin.
- Matn chegarasining aniq soni — B o'lchovidan keyin (bizda hozir ekranda o'rtacha nechta so'z).
