# 1-Modul m1-10 «CSS Praktika — Demo Day saytini bezaymiz» — yakuniy matn

Fayl: `src/1-Modull/CssPractice.jsx` · 9 ekran · Keyingi dars: «Git va GitHub»; sayt Netlify darsida tugatiladi
Holat: 2026-10-16 — kodga mos (F-1015-319 dan keyin). `lessonId` = `css-practice-portfolio-v3` (LMS kaliti, o'zgarmagan)

## 0 · Kirish
- Eyebrow: CSS Praktika · kirish · Sarlavha: Saytingizga kirgan odam avval nimani ko'radi?
- Mentor: Bugun Demo Day saytingizning bosh sahifasi shunday bo'ladi. Unga qarang va javobni tanlang.
- Chapda maket «Bugun oxirida · namuna» (mening-saytim · Live Server): To'garak jadvali · menyu Jadval, Aloqa, Kirish ·
  «Maktab to'garaklari · 2026» · sarlavha «To'garak jadvali endi telefoningizda» · «Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.» ·
  tugmalar «Jadvalni ko'rish», «Batafsil» · telefon ichida Dushanba: Robototexnika 15:00 · 204-xona; Shaxmat 16:30 · 112-xona; Futbol 17:00 · Stadion ·
  3 karta: Jadval — Hamma to'garak vaqti bitta sahifada. · Manzil — Qaysi xonada bo'lishini bilasiz. · Telefonda — Uydan ham, yo'lda ham ochiladi. · footer «To'garak jadvali · 2026»
- Savol (ballsiz):
  - ✔ Sayt qaysi muammoni hal qilishini
  - Saytning hamma sahifalari ro'yxatini
  - Saytni kim yasaganini
- Javob izohlari: to'g'ri — «Aynan! Bosh sahifa bir qarashda aytadi: qanday muammo va sayt uni qanday hal qiladi.» · boshqasi — «Qiziq fikr! Sarlavhaga qarang: u muammoga yechimni aytadi — odam shuni birinchi ko'radi.»
- Tugma: Javobni tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja · Sarlavha: Bugun Demo Day saytingizni boshlaysiz
- Mentor: Bugun bosh sahifa: HTML'ni Gemini tez yozadi, asosiy vaqt — dizaynga. Qolgan sahifalar — Netlify darsida.
- Chapda maket «Dars oxirida · namuna» (0-ekrandagi sayt).
- Karta «Avval tayyorlaning»:
  1. Ish stolida mening-saytim papkasini yarating va VS Code'da oching.
  2. Ichida index.html va style.css yarating; index.html da ! + Tab, Go Live.
  3. Boshqa oynada gemini.google.com'ni oching.
  - Tayyor bo'lsa — «Davom etish».
- «Bugungi 3 blok»: 01 Loyiha va bosh sahifa (HTML) · 02 Dizayn (uslub) · 03 O'z rangingiz (Ctrl+H)

## 2 · Amaliyot 1 — HTML (a1)
- Eyebrow: Amaliyot 1 · HTML · Sarlavha: Loyihangizni yozing — Gemini HTML'ni quradi.
- Forma «Loyihangiz»:
  - Loyihangiz nomi — masalan: To'garak jadvali
  - Qanday muammoni hal qiladi? — masalan: jadval faqat devorda — uydan ko'rib bo'lmaydi
  - Saytda nima bo'lsin? (talablaringiz) — masalan: to'garaklar jadvali, xona raqami, ustoz ismi
  - Tugma: Uchala qatorni to'ldiring → Saqlash. Saqlangach forma yig'iladi (nom · Muammo: … · Talablar: …) + «Tahrirlash».
- «Prompt tayyor — endi Gemini orqali quring.» · Prompt (Promptni nusxalash):
```
Demo Day loyiham — «{nom}» — uchun bosh sahifa: index.html'ni yoz.
Muammo: {muammo}.
Saytda bo'lsin: {talablar}.
Tuzilishi:
– tepada: chapda sayt nomi, o'ngda menyu (Bosh sahifa, Aloqa) va bitta tugma;
– bosh qism: kichik yozuv, katta sarlavha (saytim nima qilishini aytsin), muammo haqida bitta gap, ikki tugma;
– 3 ta karta: talablarimdan 3 tasi, har birida qisqa sarlavha va bitta gap;
– eng pastda footer: sayt nomi va yil.
Har qismga tushunarli class nomi ber: header, hero, kartalar, karta, footer.
style.css <link> bilan ulangan bo'lsin. CSS yozma, faqat HTML. To'liq faylni qaytar.
```
- O'ngda «Qadamlar»:
  1. Loyihangizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.
  2. «Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.
  3. Javobdagi kodni index.html ga qo'ying (bor kod o'rniga), Ctrl+S.
  4. Live Server'da qarang: menyu, sarlavha, tugmalar, 3 karta, footer — hammasi bormi? Yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».
- «Davom etish» — nishon Kick Off!

## 3 · Amaliyot 2 — dizayn (a2)
- Eyebrow: Amaliyot 2 · Dizayn · Sarlavha: Saytingiz uchun uslub tanlang.
- «Uslub»: Minimalist — oq fon, tinch · Yorqin — quvnoq ranglar · Qorong'i — to'q fon, oq matn · Gradient — rang o'tishlari
  - Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.
- Prompt (uslub tanlangach ochiladi; Promptni nusxalash):
```
Bosh sahifamga zamonaviy dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.
Uslub: {uslub} — {tavsif}
Ranglar: {ranglar}.
Shrift: Google Fonts'dagi «{shrift}» (style.css boshida @import bilan); sarlavhalar qalin.
Menyu: chapda sayt nomi, o'ngda havolalar; {menyu}.
Bosh qism: sahifa markazida, sarlavha 48px, ostida kulrang matn; tugma urg'u rangda, yumaloq burchak, sichqoncha ustida biroz to'qroq.
3 ta karta: bir qatorda, orasida 24px; {karta}.
Sahifa eni 1000px dan oshmasin, markazda. Telefonda kartalar ustma-ust tursin.
Mana kodim: {index.html kodini shu yerga qo'ying}
```
  | Uslub | Shrift | Ranglar | Menyu | Karta |
  |---|---|---|---|---|
  | Minimalist | Inter | fon #ffffff, matn #16181d, urg'u rang #d4380d | pastida ingichka kulrang chiziq | oq fon, ingichka ramka, yumshoq soya, burchak 12px |
  | Yorqin | Nunito | fon #fff8ef, matn #16181d, menyu foni ko'k #1d4ed8 (oq yozuv), urg'u rang #c2410c | ko'k fonda oq yozuv | oq fon, rangli ramka, katta soya, burchak 16px |
  | Qorong'i | Poppins | fon #0f172a, matn #f1f5f9, kartalar #1e293b, urg'u rang #34d399 (tugma yozuvi to'q) | pastida to'q kulrang chiziq | to'q fon #1e293b, ingichka ramka, burchak 12px |
  | Gradient | Poppins | fon #fdf4ff, matn #16181d, bosh qism foni binafsha-pushti gradient (#ede9fe → #fce7f3), urg'u rang #7e22ce | pastida ingichka chiziq | oq fon, yumshoq binafsha soya, burchak 16px |
- «Qadamlar»:
  1. «Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi {…} o'rniga index.html kodingizni qo'ying.
  2. Javobdagi kodni style.css ga qo'ying, Ctrl+S.
  3. Live Server'dagi natijani «Kutilgan natija» surati bilan solishtiring.
- O'ngda «Kutilgan natija · namuna» — tanlangan uslubdagi maket; kartalar qatori belgilangan.
- Ostida: Gemini javobida kartalarni yonma-yon qo'ygan `display: flex` va `gap` ni toping.
- «Davom etish» — nishon Styled!

## 4 · Amaliyot 3 — o'z rangingiz (a3)
- Eyebrow: Amaliyot 3 · Gemini'siz · Sarlavha: Saytga o'zingiz tanlagan rangni bering.
- «Qadamlar»:
  1. `style.css` da asosiy rangni toping — tugma va sarlavhalarda takrorlanadigan kod (sizning uslubingizda — `{urg'u rang}`).
  2. `Ctrl+H` bosing: yuqori qatorga eski rangni, pastkisiga yangisini yozing va `Ctrl+Alt+Enter` bosing — hammasi birdan almashadi.
  3. `Ctrl+S` — Live Server'da sahifaga qarang.
- Rang kodini bilmasangiz — VS Code'da rang kodi yonidagi kichik kvadratni bosing, rang tanlagich ochiladi.
- O'ngda «Kutilgan natija · masalan» — boshqa rangdagi maket.
- «Davom etish» — nishon Color Master

## 5 · Topshirish (s16, 1 ball)
- Eyebrow: Topshirish · Sarlavha: Kartochkalarni bir qatorga qaysi qoida tizadi?
- Mentor: Avval sahifangizni ustozga ko'rsating. Keyin savolga javob bering.
- Variantlar:
  - A `ul { text-align: center; }`
  - B `li { margin: 0 auto; }`
  - ✔ C `ul { display: flex; }`
  - D `li { padding: 16px; }`
- Izohlar: to'g'ri — `display: flex` ichidagi elementlarni bir qatorga tizadi. · A — `text-align` matnni joylaydi, kartochkalarni emas. · B — `margin: 0 auto` bitta blokni markazga qo'yadi. · D — `padding` — kartochka ichidagi bo'shliq. · Maslahat: Elementlarni yonma-yon qo'yadigan qoidani eslang.
- Xato javobdan keyin tugma: To'g'ri javobni toping

## 6 · Amaliyot 4 — yaxshilash (a4)
- Eyebrow: Amaliyot 4 · Yaxshilash · Sarlavha: Saytingizni tekshiring va yaxshilang.
- «Bitta kamchilik»: Nima yoqmadi? — masalan: telefonda kartalar sig'mayapti · Qanday bo'lsin? — masalan: telefonda kartalar ustma-ust tursin
- «Prompt tayyor — Gemini'ga yuboring.» · Prompt (Promptni nusxalash):
```
Saytimni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.
Yoqmagani: {nima yoqmadi}.
Qanday bo'lsin: {qanday bo'lsin}.
O'zgargan faylni to'liq qaytar.
Mana kodim: {index.html va style.css kodini shu yerga qo'ying}
```
- Tugma «Keyingi kamchilik» — maydonlar tozalanadi, hisob «Yaxshilandi: N».
- O'ngda «Saytingizni tekshiring»: Menyudagi havolalar bosiladimi? · Oynani toraytiring: telefonda kartalar sig'adimi? · Hamma matn sizning loyihangiz haqidami? · Tugma va sarlavhalar bir xil rangdami? · Eng pastda footer bormi?
- «Qadamlar»:
  1. Ro'yxat bo'yicha saytingizga qarang va bitta kamchilikni tanlang.
  2. Uni yozing — prompt yig'iladi.
  3. «Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, Ctrl+S.
  4. «Keyingi kamchilik» — va yana. Dars oxirigacha.

## 7 · Natijalar
Natijalar (podium) — jonli reyting

## Nishonlar
- Kick Off! — Demo Day saytingiz bosh sahifasini boshladingiz
- Styled! — Saytingizga o'zingiz tanlagan uslubni berdingiz
- Color Master — Saytga o'zingiz tanlagan rangni berdingiz
- Designer — CSS praktikani oxirigacha bajardingiz

## Qisqa takrorlash oynalari
s16 «Eslatma» — Yonma-yon: display: flex va gap
- display: flex — bir qatorga: `display: flex` ichidagi elementlarni bir qatorga tizadi.
- gap va padding: `gap` — kartochkalar orasidagi bo'shliq, `padding` — kartochka ichidagi.
- O'zingizni tekshiring: Qoida ro'yxatning o'ziga (`ul`) beriladi — kartochkalarga emas.

## Jonli viktorina (12 savol)
CODE STRIKE · Testni ishlash
1. Matn (harflar) rangini qaysi xususiyat beradi? — ✔ color · background-color · font-size · text-align
2. Element orqa fon rangini qaysi xususiyat beradi? — color · border · ✔ background-color · margin
3. Matnni markazga qaysi qiymat qo'yadi? — text-align: left · ✔ text-align: center · text-align: middle · align: center
4. Havolalarni bir qatorga tizadigan qoida? — display: block · display: none · text-align: center · ✔ display: flex
5. Flex elementlar orasidagi bo'shliqni nima ochadi? — ✔ gap · padding · margin-top · border
6. Element ICHIDAGI bo'shliq qaysi xususiyat? — margin · gap · ✔ padding · text-align
7. Elementlar ORASIDAGI (tashqi) bo'shliq qaysi xususiyat? — padding · gap · border · ✔ margin
8. CSS qoidasida `h1` — bu qaysi qism? — xususiyat · ✔ selektor · qiymat · izoh
9. CSS qoidasida `color` — bu qaysi qism? — ✔ xususiyat · selektor · qiymat · teg
10. Har bir CSS satri qaysi belgi bilan tugaydi? — vergul , · nuqta . · ikki nuqta : · ✔ nuqta-vergul ;
11. Flex menyuni gorizontal markazga qaysi xususiyat qo'yadi? — align-items: center · ✔ justify-content: center · text-align: center · gap: center
12. Kartani ekran markaziga qo'yuvchi qiymat? — margin: 0 · margin: center · ✔ margin: 0 auto · padding: auto

## Kartochkalar
Yo'q — foydalanuvchi qarori F-1015-316 (o'rniga 6-ekran «Yaxshilash»).

## Yakun
- Eyebrow: Tayyor · «CSS praktika tugadi» · «{N}/1 to'g'ri» · Sarlavha: Siz dizayner bo'ldingiz.
- CODE STRIKE · Testni ishlash →
- «Endi siz bezay olasiz»: Gemini'ga HTML'ni qismlari bilan aniq so'raysiz · Uslubni so'z bilan tasvirlab, dizayn olasiz · display: flex + gap — kartalar bir qatorda · Rangni butun faylda Ctrl+H bilan o'zingiz almashtirasiz · Saytni ro'yxat bo'yicha tekshirib, aniq so'rov bilan yaxshilaysiz
- Uyga vazifa (Topshiriqni ko'rish →): Saytingizning qolgan sahifalarini rejalang — VS Code'da:
  - Saytingizda yana qaysi 3 sahifa bo'lishini yozing (masalan, sahifalar.txt)
  - Har sahifaga bir gap: unda nima turadi
  - Bosh sahifa skrinshotini platformaga yuklang. Keyingi dars — Git va GitHub; Netlify darsida saytni tugatib, internetga chiqarasiz.
- Tugmalar: Orqaga · Qaytadan · Tugatish ✓
