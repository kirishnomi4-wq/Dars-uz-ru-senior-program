# 13-dars «Loyiha kuni: to'liq tizim» — yakuniy matn

Fayl: `src/6-Modull/FullSystemProjectLesson.jsx` · 21 ekran · Keyingi dars: «Raqamingiz nimani isbotlaydi?»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish — yakuniy loyiha
- Eyebrow: Kirish · yakuniy loyiha
- Sarlavha: Ishga tushirishdan oldingi oxirgi qadam nima?
- Mentor: Kurs davomida web, mobil ilova, bot, backend, Database va AI bilan ishladingiz. Bugun ularni bitta tizimga yig'amiz va ishga tushiramiz. Lekin avval bitta narsa shart.
- Karta «Sizda tayyor turgan qismlar»: Web · Mobil · Bot · Backend · Database · AI
  - Olti qism — lekin ular birga, xatosiz ishlashini hali hech kim tekshirmadi.
- Savol: Birinchi nima qilamiz?
  - Darrov e'lon qilamiz — vaqt ketmasin
  - ✔ Butun tizimni boshidan oxirigacha sinaymiz
  - Yana yangi funksiyalar qo'shamiz
- Javob izohlari:
  - 2-variant: **Aynan!** Avval butun oqimni boshidan oxirigacha sinab, xatolarni tuzatamiz. Bugun: qismlarni yig'amiz, tizimni sinaymiz, xatoni topib tuzatamiz va ishga tushiramiz.
  - 1-variant: **Qiziq fikr!** Lekin sinalmagan tizimni chiqarsangiz, xatoni mijoz topadi. Avval butun oqimni boshidan oxirigacha sinaymiz — bugun shuni qilamiz.
  - 3-variant: **Qiziq fikr!** Yangi funksiya — keyin. Hozir bor qismlar birga ishlashini hech kim tekshirmagan. Avval shuni sinaymiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Yakuniy loyiha kuni: hamma qism — bitta tizim
- Mentor: Bugun yangi narsa o'rganmaymiz — bilganlarimizni **bitta to'liq tizimga** yig'amiz va ishga tushiramiz. Bu — 1-bosqichning yakuniy loyihasi.
- Yorliq: Bugungi maqsad
  - Karta: Hamma qism → bitta tizim — Yig'amiz, sinaymiz, tuzatamiz, ishga tushiramiz.
  - → Siz — tizim arxitektori: butun tizimni yig'asiz va sinaysiz.
- Yorliq: 5 qadam
  1. Hamma qismni bitta tizimga yig'ish (web + mobil + bot)
  2. Ko'p kanal — bitta backend (buyurtma yo'li) · jonli
  3. End-to-end test — butun oqimni sinash · jonli
  4. Ulanish joyidagi xatoni topish va tuzatish
  5. Ishga tushirish
- Tugmalar (telefonda): 5 qadamni ko'rish · ↩ Maqsadni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · To'liq tizim xaritasi
- Eyebrow: To'liq tizim xaritasi
- Sarlavha: Bularning hammasi bilan ishladingiz
- Mentor: Mana to'liq tizim: yuqorida 3 ta kanal (kirish yo'li), pastda yadro. Har birini bosing — nima qiladi.
- Tugmalar (bosilgani ✓ bilan belgilanadi, o'ngda nomi va vazifasi chiqadi):
  - Kanal (kirish):
    - Web (React) · Web sahifa — Brauzerda mahsulotlar va «Buyurtma» tugmasi.
    - Mobil (React Native) · Mobil ilova — Telefonda o'sha do'kon, Expo Go bilan.
    - Telegram bot · Bot kanal — Buyurtma va xabarlar Telegram orqali.
  - Yadro:
    - Node.js · Backend — Barcha kanaldan so'rovni qabul qilib boshqaradi.
    - PostgreSQL · Database — Mahsulot va buyurtmalarni saqlaydi, bitta joyda.
    - AI (Gemini) · Yordamchi xizmat — Backend chaqirganda mijoz savoliga javob yozadi, tavsif tayyorlaydi.
- Hammasi ko'rilgach: 6 qism — kurs davomida o'rgangan bilimlaringiz. Endi ularni birga ishlatamiz.
- Tugmalar: Orqaga · N/6 komponentni ko'ring → Davom etish

## 3 · Ko'p kanal, bitta tizim
- Eyebrow: Ko'p kanal, bitta tizim
- Sarlavha: Uch kanal — bitta backend
- Mentor: Mijoz web, mobil yoki bot orqali keladi — lekin uchalasi ham o'sha backend va Database'dan foydalanadi. Har kanalni bosing.
- Tugmalar: Web · Mobil · Bot (ko'rilgani ✓ bilan; boshida Web ochiq)
- Chizma: Web · Mobil · Bot → Backend + Database (tanlangan kanal chizig'i yonadi)
- Karta «<kanal> kanali» (Web kanali · Mobil kanali · Bot kanali): Bu kanal ham **o'sha** Node.js backend'ga so'rov yuboradi va **o'sha** Database'dan (PostgreSQL) o'qiydi. Mavjud backend'dan qayta foydalanamiz; kerak bo'lsa unga yangi so'rov yo'li (endpoint) qo'shamiz.
- Uchalasi ko'rilgach: 1-darsdagi g'oya to'liq ko'rinishda: **ko'p kirish yo'li, bitta tizim**. Ma'lumot bitta joyda — shuning uchun hamma kanal bir xil holatni ko'radi.
- Tugmalar: Orqaga · Kanallarni ko'ring (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Nega bu uch kanal bitta tizim?
  - ✔ Uchalasi bir xil backend va Database'dan foydalanadi
  - Har birining o'z alohida backend'i va Database'i bor
  - Ular bir-biriga bog'lanmagan — alohida ishlaydi
  - Faqat ranglari va tashqi ko'rinishi bir xil
- Javob izohlari:
  - To'g'ri: To'g'ri! Web, mobil, bot — uchala kanal bir xil backend va Database'dan (PostgreSQL) foydalanadi. Ma'lumot bitta joyda bo'lgani uchun hamma kanal bir xil holatni ko'radi — shuning uchun ular bitta tizimning kanallari.
  - 2-variant: Alohida backend emas — bitta backend hamma kanalga xizmat qiladi.
  - 3-variant: Aynan bog'liq — bitta backend orqali.
  - 4-variant: Rang emas — umumiy backend va Database.
- Test ekranlarining umumiy yozuvlari (4, 6, 10, 13-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · End-to-end
- Eyebrow: End-to-end
- Sarlavha: End-to-end: boshidan oxirigacha
- Mentor: End-to-end — bitta amalni boshidan (mijoz) oxirigacha (tasdiq) kuzatish. Har qism birga ishlayaptimi — shu sinaladi. Bugungi loyihada buyurtma 5 qadamdan o'tadi. Bosing.
- Oqim (har bosishda bitta qadam yonadi, oralarida ↓):
  1. Mijoz mobildan «Buyurtma» bosadi
  2. Backend so'rovni qabul qiladi
  3. Buyurtma Database'ga saqlanadi
  4. Bot adminga xabar yuboradi
  5. Mijozga tasdiq qaytadi
- Tugma: ▶ Oqimni boshlash → Keyingi qadam →
- Oxirida: Bugungi loyihada end-to-end test — shu 5 qadamni birga sinash. Bitta qadam ishlamasa — tizim chala. Boshqa loyihada qadamlar boshqacha bo'lishi mumkin, fikr esa o'sha: boshidan oxirigacha.
- Tugmalar: Orqaga · Oqimni kuzating (N/5) → Davom etish

## 6 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: End-to-end test nimani sinaydi?
  - Bitta funksiyani alohida holda
  - Sahifaning ranglari va dizaynini
  - ✔ Bitta amalning barcha qadamlarini birga
  - Backend kodini o'qib chiqib, ishlatmasdan
- Javob izohlari:
  - To'g'ri: To'g'ri! End-to-end test bitta amalni (masalan, buyurtmani) barcha qadamlari bo'ylab — mijozdan tasdiqqacha — sinaydi. Shunda qismlar ulangan joydagi xatolar ko'rinadi.
  - 1-variant: Bitta funksiya emas — butun zanjirni birga.
  - 2-variant: Rang emas — oqim ishlayaptimi.
  - 4-variant: Faqat o'qish kam — amalda sinash kerak.
- Umumiy yozuvlar — 4-ekrandagidek.

## 7 · Buyurtma yo'li
- Eyebrow: Buyurtma yo'li · jonli
- Sarlavha: Qaysi kanaldan kelsa ham — o'sha tizim javob beradi
- Mentor: «▶ Webdan buyurtma yuboring» tugmasini bosing — buyurtma o'sha backend'ga borib, Database'ga saqlanadi, bot adminga xabar beradi. Keyin Mobil va Bot kanallarini ham sinab ko'ring — natija bir xil!
- Tugmalar: Web · Mobil · Bot (sinalgani ✓ bilan)
- Chizma: <kanal> → Backend → Database · Bot (buyurtma yuborilgach yonadi)
- Tugma: ▶ Webdan buyurtma yuboring · ▶ Mobildan buyurtma yuboring · ▶ Botdan buyurtma yuboring → (yuborilgach) Yana yuboring →
- Yuborilayotganda: Buyurtma oqyapti…
- Natija kartasi: Webdan keldi — tizim ishladi (Mobildan… · Botdan…) — Database'ga saqlandi · admin xabardor. Boshqa kanal ham xuddi shunday.
- Izoh: **Eslatma:** AI buyurtma yo'lida emas — u alohida ishlaydi: mijoz savol yozsa, backend uni AI'ga yuboradi va javob qaytaradi.
- Uchalasi sinalgach: Uchala kanal — bitta natija. **Kirish yo'li ko'p, yadro bitta.**
- Tugmalar: Orqaga · Uch kanalni sinang (N/3) → Davom etish

## 8 · Ulanish joylari
- Eyebrow: Ulanish joylari
- Sarlavha: Tizim ulanish joylarida siniydi
- Mentor: Qismlar alohida yaxshi ishlaydi — xato ko'pincha ular **ulangan joyda** chiqadi. Har ulanish joyini bosing: bu yerda nima buziladi?
- Tugmalar (bosilgani ✓ bilan) va karta «BU YERDA NIMA BUZILADI»:
  - Frontend ↔ Backend — Backend manzili noto'g'ri — «Failed to fetch» (8-darsdagi ulanish xatosi)
  - Mobil ↔ Backend — Mobil eski manzilga ulanyapti yoki so'rovda maydon yetishmaydi
  - Bot ↔ Backend — BOT_TOKEN yo'q yoki xato — bot xabar yubormaydi
  - Backend ↔ AI — AI kaliti yo'q yoki limit tugagan — javob kelmaydi
- Bosilmaguncha: Bir ulanish joyini bosing — u yerda nima buzilishini ko'rasiz.
- Hammasi ko'rilgach: Ko'p xatolar — bitta yo'qolgan sozlama yoki yetishmagan maydon. End-to-end test aynan shularni tutadi.
- Tugmalar: Orqaga · Ulanish joylarini ko'ring (N/4) → Davom etish

## 9 · Test jadvali
- Eyebrow: Test matritsasi · jonli
- Sarlavha: End-to-end test: har kanal × har qadam
- Mentor: Jadvalda 12 katak — har biri bitta sinov. «Testni ishga tushiring» tugmasini bosing — kataklar yashil bo'lib boradi. Bittasiga e'tibor bering!
- Jadval (ustunlar: Buyurtma · Database'da · Bot xabar · Tasdiq; qatorlar: Web · Mobil · Bot) — kataklar birma-bir ✓ bo'ladi, Mobil × Bot xabar — ✗
- Tugma: ▶ Testni ishga tushiring → Sinalyapti…
- Izoh (test tugaguncha): Har katak = bitta kanaldan bitta qadam. Yashil — ishladi, qizil — xato.
- Karta «XATO TOPILDI»: **Mobil × «Bot xabar»** qizil: mobildan buyurtma berilganda admin Telegram xabarini olmadi. Web va bot kanallari ishlaydi — demak xato mobil tomondagi ulanish joyida.
- Oxirida: Mana end-to-end testning kuchi: 11 katak yashil, 1 qizil — ulanish joyidagi yashirin xato ko'rindi. Endi tuzatamiz.
- Tugmalar: Orqaga · Testni ishga tushiring → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Ulanish joyidagi xatolarni qanday topamiz?
  - Bitta kanalni bir marta sinab, qolganini o'tkazib
  - Faqat kodga qarab, ishlatib ko'rmasdan
  - Umuman sinamasdan, to'g'ridan chiqarib
  - ✔ Har kanaldan butun oqimni sinab
- Javob izohlari:
  - To'g'ri: To'g'ri! Har kanaldan butun oqimni sinaymiz (end-to-end). Jadval ko'rsatadi: qaysi kanal × qaysi qadam buzilgan. Shunday qilib xato qaysi ulanish joyida ekanini aniq topamiz.
  - 1-variant: Bitta kanal kam — xato boshqa kanalda bo'lishi mumkin (mobildagidek).
  - 2-variant: Faqat o'qish kam — amalda sinash kerak.
  - 3-variant: Test qilmaslik — xatoni mijoz topadi.
- Umumiy yozuvlar — 4-ekrandagidek.

## 11 · Xatoni tuzatish
- Eyebrow: Xatoni tuzatish · jonli
- Sarlavha: Xatoni topdik → sababini aniqlaymiz → tuzatamiz
- Mentor: Qizil katakni topdik. Endi tizim arxitektori sifatida sababni aniqlaymiz, aniq tuzatish beramiz va qayta sinaymiz. Bosing.
- Chap — 4 bosqich (o'tilgani ✓): 1 · XATO · 2 · SABAB (tekshiruv) · 3 · TUZATISH · 4 · QAYTA SINOV
- O'ng — joriy bosqich kartasi:
  1. 1 · XATO — Jadvalda bitta qizil katak: Mobil × «Bot xabar». Mobildan buyurtma berilganda admin Telegram xabarini olmadi.
     - Web ishlaydi, mobil yo'q — demak xato mobil↔backend ulanish joyida.
  2. 2 · SABAB (tekshiruv) — Uch ehtimol bor:
     - (a) mobil so'rovda ma'lumot to'liq emas;
     - (b) backend bu so'rovni tekshiruvdan o'tkazmayapti;
     - (c) bot chaqiruvi mobil uchun ishlamayapti.
     - **Tekshirdik:** mobil `POST /orders` so'rovida bitta maydon yetishmayapti — backend shuning uchun bot xabari qadamini o'tkazib yubordi.
     - Avval ehtimollarni sanab, keyin tekshirib topasiz.
  3. 3 · TUZATISH — «Mobil buyurtma ekrani barcha maydonlarni yuborsin; backend har buyurtmada, kanal qaysi bo'lishidan qat'i nazar, bot xabarini yuborsin.»
     - Aniq, kichik tuzatish — butun tizimni qayta yozmaysiz.
  4. 4 · QAYTA SINOV — Jadval endi to'liq yashil — uchala kanaldan ham bot xabari keladi.
- Tugma: ▶ Tuzatishni boshlash → Keyingi qadam →
- Oxirida: Xatoni topish → sababini tekshirish → kichik tuzatish → qayta sinash. Bitta ulanish joyi tuzatildi, butun tizim yana yashil.
- Tugmalar: Orqaga · Siklni kuzating (N/4) → Davom etish

## 12 · Ishga tushirish
- Eyebrow: Ishga tushirish
- Sarlavha: Ishga tushirishdan oldin — tekshiruv ro'yxati
- Mentor: Har bandni belgilang. Hammasi tayyor bo'lsa — tizimni ishga tushiramiz!
- Karta «Ishga tushirish ro'yxati» (bosib belgilanadi):
  - Sozlamalar to'g'ri: backend manzili, `DATABASE_URL`, `BOT_TOKEN`, AI kaliti — maxfiylari `.env`da, frontend kodida emas va GitHub'ga yuborilmagan
  - End-to-end test o'tdi — jadval to'liq yashil
  - Mobil ilova Expo Go'da telefonda sinaldi
  - Backend serverga joylashtirildi (deploy) va ishlayotgani tekshirildi
- Izoh (belgilanguncha): Har bandni bosib belgilang. Bular bo'lmasa — tizim mijozda buziladi.
- Hammasi belgilangach: Ishga tushirishga tayyor! — Sozlama to'g'ri, test o'tdi, mobil sinaldi, backend ishlayapti. Endi mijozlar foydalanadi.
- Tugmalar: Orqaga · Belgilang (N/4) → Davom etish

## 13 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Ishga tushirishdan oldin nima shart?
  - Hech narsa — darrov mijozga chiqaramiz
  - ✔ Butun oqim sinalgan va sozlamalar to'g'ri bo'lishi
  - Ko'proq rang va bezak qo'shilgan bo'lishi
  - Logotip va nom tayyor bo'lishi
- Javob izohlari:
  - To'g'ri: To'g'ri! Ishga tushirishdan oldin end-to-end test o'tgan (jadval to'liq yashil) va `.env` sozlamalari to'g'ri bo'lishi shart. Aks holda xatoni mijoz topadi.
  - 1-variant: Darrov chiqarish — xatolarni mijoz ko'radi.
  - 3-variant: Rang muhim, lekin test va sozlama shart.
  - 4-variant: Logotip yetarli emas — tizim ishlashi kerak.
- Umumiy yozuvlar — 4-ekrandagidek.

## 14 · Ishga tushdi — bir o'quvchining yo'li
- Eyebrow: Ishga tushdi
- Sarlavha: Tizim ishlayapti — bir o'quvchining yo'li
- Mentor: Mana bir o'quvchi to'liq tizimni qanday yetkazdi — 4 qadam. Har qatorni bosing.
- Karta «Yig'ish → sinash → tuzatish → ishga tushirish» (qator bosilsa, o'ngda izohi chiqadi):
  - YIG'DI — Web, mobil, bot — uchala kanalni bitta backend'ga uladi — Hammasi o'sha Database va mantiqdan foydalanadi.
  - SINADI — Har kanaldan buyurtma berib, butun oqimni end-to-end sinadi — Bitta amal butun tizimni boshidan oxirigacha tekshiradi.
  - TUZATDI — Ulanish joyidagi xatoni topib, kichik tuzatish bilan yamadi — Xato qaysi ulanish joyida ekanini topib, faqat o'sha joyni tuzatdi.
  - ISHGA TUSHIRDI — Backend'ni serverga joylashtirdi, tizimni ishga tushirdi — mijozlar uch kanaldan kelyapti — 1-bosqichning yakuniy loyihasi tayyor.
- Hammasi ko'rilgach: Yig'ish → sinash → tuzatish → ishga tushirish. Endi o'zingiz rejalang.
- Tugmalar: Orqaga · N/4 ko'ring → Endi navbat sizga →

## 15 · Qoida
- Eyebrow: Qoida
- Sarlavha: To'liq tizim: yig'ish · sinash · tuzatish · ishga tushirish
- Mentor: Yodda tuting: hamma qismni yig'ing, butun oqimni end-to-end sinab ko'ring, ulanish joyidagi xatoni tuzating, keyin ishga tushiring.
- Karta: Siz — tizim arxitektori — Qismlarni yig'asiz, sinaysiz, ishlaydigan tizimni yetkazasiz.
- Zanjir (oralarida ↓):
  1. Yig'ish — ko'p kanal, bitta backend
  2. End-to-end test — har kanal × har qadam
  3. Xatoni tuzatish — ulanish joyini topib, kichik tuzatish
  4. Ishga tushirish — sozlama va test tayyor bo'lsa
- Tugmalar: Orqaga · Yakuniy ishga →

## 16 · Amaliyot · VS Code
- Eyebrow: Amaliyot · VS Code
- Sarlavha: Endi navbat sizga — tizimni yig'ing va sinang
- Mentor: Bu topshiriqni **o'z kompyuteringizda (VS Code)** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'z loyihangizda barcha kanalni (web / mobil / bot) bitta backend'ga ulang, keyin har kanaldan bitta buyurtma berib, butun oqimni (Database + bot xabari) end-to-end sinab ko'ring.
- Yorliq: Bosqichlar — belgilab boring (har biri bosib belgilanadi, belgilangani ✓):
  1. Loyihani VS Code'da oching, backend'ni ishga tushiring (`npm run dev`); `.env` sozlamalari to'liqligini tekshiring
  2. Web (yoki mobil) kanaldan bitta buyurtma bering
  3. Buyurtma Database'ga tushganini tekshiring
  4. Bot admin xabarini yuborganini tekshiring
  5. Bitta qadam ishlamasa — jadvalda qaysi kanal × qadam qizil ekanini yozing va sababini toping
  6. Tugagach «Bajardim» tugmasini bosing
- Tugma: Yana N qadam → Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach: Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Yakuniy — jarayon
- Eyebrow: Yakuniy · jarayon
- Sarlavha: Oxirgi qadam: to'liq tizimni yetkazish jarayonini tartibda yig'ing.
- Mentor: Bugun bosib o'tgan yo'lni eslang. Bo'laklarni to'g'ri tartibda joylang.
- Joylar: 1 · 2 · 3 · 4 · 5 (har birida: bu yerga qo'ying)
- Bo'laklar (aralash chiqadi) — to'g'ri tartib:
  1. Qismlarni yig'ish
  2. End-to-end sinov
  3. Ulanish joyidagi xatoni topish
  4. Kichik tuzatish va qayta sinov
  5. Ishga tushirish
- Javob izohlari:
  - To'g'ri: ✓ Jarayon tayyor: **Yig'ish → Sinash → Xatoni topish → Tuzatish → Ishga tushirish**. To'liq tizim shunday yetkaziladi.
  - Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 18 · Natijalar (podium) — jonli reyting

## 19 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar — «Kartochkalar» bo'limida (12 ta)
- Tugmalar: Orqaga · Yakunlash →

## 20 · Yakun
- Eyebrow: 1-bosqich yakuniy loyihasi
- Belgi: ✓ Tizim ishlayapti · N/5 to'g'ri
- Sarlavha: Endi to'liq tizimni yig'ib, sinab, ishga tushira olasiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz:
  - Ko'p kanal (web, mobil, bot) — bitta backend bilan ishlasa, bitta tizimning kirish yo'llari
  - End-to-end test bitta amalni barcha qadamlari bo'ylab sinaydi
  - Xato ko'pincha ulanish joyida bo'ladi — sababini tekshirib, kichik tuzatish qilasiz
  - Sozlama to'g'ri va test o'tgan bo'lsa — ishga tushirasiz
  - Jarayon: yig'ish → sinash → xatoni topish → tuzatish → ishga tushirish
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilgach, karta «Uyga vazifa»):
  - **Yig'ing** — loyihangizning barcha kanalini bitta backend'ga ulang
  - **Sinang** — har kanaldan buyurtma berib, butun oqimni tekshiring
  - **Ishga tushiring** — .env to'g'ri va test o'tgach, backend'ni serverga joylashtiring
  - 1-bosqichning yakuniy loyihasi tayyor: endi o'z g'oyangizni oling, qismlarga bo'ling, yig'ing, sinang va ishga tushiring. Siz buni qila olasiz.
  - Keyingi dars — PM: **Raqamingiz nimani isbotlaydi?** Loyihangiz haqida bitta raqam va bitta slayd bilan gapirishni o'rganasiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Kartochkalar
Oyna: Takrorlash — kartochkalar. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Web, mobil va bot qaysi umumiy qismga ulanadi? | Bitta backend'ga | Kirish yo'li uchta, tizim bitta |
| Nega web va bot bir xil buyurtmani ko'radi? | Database bitta | Bu loyihada hamma buyurtma bitta Database'da (PostgreSQL) |
| Bitta amalni boshidan oxirigacha sinaydigan test? | End-to-end | Mijozdan boshlanib, tasdiq bilan tugaydi |
| Qismlar alohida ishlab, birga ishlamasa — bu qanday xato? | Integratsiya xatosi — ulanish joyida | Qismlar ulangan joyda yashiringan |
| Qaysi kanal qaysi qadamda buzilganini nima ko'rsatadi? | Test jadvali (matritsa) | Har kanal × har qadam — katak; qizili — xato joyi |
| Tizimni serverga joylashtirish qanday ataladi? | Deploy | Ishga tushirish — foydalanuvchiga berish |
| Ishga tushirishdan oldin test jadvali qanday bo'lishi shart? | To'liq yashil | Bitta qizil katak qolsa — ishga tushirilmaydi |
| BOT_TOKEN kabi maxfiy sozlamalar qayerda turadi? | .env faylida | Frontend kodiga yozilmaydi, GitHub'ga yuborilmaydi |
| Buyurtmalar doimiy saqlanadigan joy? | Database (PostgreSQL) | Backend unga yozadi va o'qiydi |
| Barcha kanaldan so'rovni qabul qilib boshqaradigan qism? | Backend (Node.js) | Database, bot va AI bilan ham u ishlaydi |
| AI buyurtma oqimida ishtirok etadimi? | Yo'q | U alohida: mijoz savoli → backend → AI → javob |
| To'liq tizimni yetkazish jarayoni? | Yig'ish → sinash → xatoni topish → tuzatish → ishga tushirish | Bugungi darsning bosh formulasi |

- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash

## Nishonlar
- One System — Ko'p kanal, bitta backend g'oyasini topdingiz (4-ekran, 1-savol)
- End to End — Butun oqimni sinashni bildingiz (6-ekran, 2-savol)
- Seam Finder — Xato ulanish joyida bo'lishini topdingiz (10-ekran, 3-savol)
- Launch Ready — Ishga tushirish shartini bildingiz (13-ekran, 4-savol)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yuqori paneldagi hisoblagich: Badges — N/4
- Yakun ekranida: Nishonlaringiz — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Ko'p kanal — bitta tizim»
   - 1 · Markaz bitta — Web, mobil va bot — uch kirish yo'li, hammasi bitta backend bilan ishlaydi.
   - 2 · Ma'lumot bitta joyda — Bu loyihada buyurtmalar bitta Database'da — shuning uchun hamma kanal bir xil holatni ko'radi.
   - 3 · Ko'p kirish yo'li, bitta tizim — Har kanal alohida tizim emas — bitta tizim, ko'p kirish yo'li.
   - Sinfga savol: Nega web va bot bir xil buyurtmani ko'radi?
2. 2-savol (6-ekran) — «End-to-end — boshidan oxirigacha»
   - 1 · Bitta amalni to'liq kuzatish — Bitta amalni (buyurtmani) mijozdan tasdiqqacha kuzatish.
   - 2 · Barcha qism birga — Frontend, backend, Database, bot — hammasi birga ishlayaptimi, shu tekshiriladi.
   - 3 · Ulanish joyini sinaydi — Bitta qadam ishlamasa — tizim chala; end-to-end aynan shuni tutadi.
   - Sinfga savol: Nega bitta funksiyani alohida sinash yetarli emas?
3. 3-savol (10-ekran) — «Xato — ulanish joyida»
   - 1 · Qismlar yaxshi, ulanish yomon — Har qism alohida ishlaydi — xato ular ulangan joyda chiqadi.
   - 2 · Jadval ulanish joyini ko'rsatadi — Test jadvali buzilgan ulanish joyini ko'rsatadi: har kanal × har qadam; qizil katak — xato o'sha yerda.
   - 3 · Kichik tuzatish — Sababini tekshirib, kichik tuzatish qilasiz — butun tizimni qayta yozmaysiz.
   - Sinfga savol: Integratsiya xatosi qayerda bo'ladi?
4. 4-savol (13-ekran) — «Ishga tushirish sharti»
   - 1 · Avval end-to-end o'tsin — Avval end-to-end o'tsin — jadval to'liq yashil.
   - 2 · Sozlama to'g'ri — Sozlamalar to'g'ri — maxfiy kalitlar `.env`da, frontend kodida va GitHub'da emas.
   - 3 · Keyin ishga tushirish — Keyin backend serverga joylashtiriladi va ishga tushiriladi.
   - Sinfga savol: Nima bo'lmasa ishga tushirmaymiz?

## Jonli viktorina (12 savol)
Savol vaqti 15 soniya.
1. Web, mobil va bot «bitta tizim» deyilishining sababi?
   - ✔ Uchalasi bir xil backend va Database'dan foydalanadi
   - Har birida o'z alohida Database'i bor
   - Ular bir-biriga umuman bog'liq emas
   - Faqat ranglari o'xshash
2. «Ko'p kirish yo'li, bitta tizim» nimani anglatadi?
   - ✔ Web, bot va mobil bitta backend'ga ulanadi
   - Bitta kanal hammaga yetarli
   - Har kanalga alohida tizim kerak
   - Faqat web bo'lishi mumkin
3. End-to-end test nimani sinaydi?
   - Bitta funksiyani alohida
   - Ranglar va dizaynni
   - ✔ Bitta amalning barcha qadamlarini
   - Backend kodini o'qib chiqib
4. Integratsiya xatosi qayerda bo'ladi?
   - ✔ Qismlar ulangan joyda
   - Faqat frontend rangida
   - Hech qachon paydo bo'lmaydi
   - Faqat Database'ning ichida
5. Test jadvalida bitta qizil katak nimani bildiradi?
   - Hammasi to'g'ri — xato yo'q
   - ✔ O'sha kanal × qadamda xato bor
   - Dizayn ishlari tugadi
   - Database juda tez ishlayapti
6. Ulanish joyidagi xatoni qanday tuzatamiz?
   - Butun tizimni noldan qayta yozamiz
   - Umuman e'tibor bermaymiz
   - ✔ Sababini topib, kichik tuzatish qilamiz
   - Faqat rang o'zgartiramiz
7. Tizimni ishga tushirishdan oldin nima SHART?
   - Hech narsa — darrov chiqaramiz
   - ✔ Butun oqim sinalgan va sozlamalar to'g'ri
   - Ko'proq rang va bezak
   - Logotip va nom tayyor
8. «Deploy» nima demak?
   - Kodni butunlay o'chirish
   - Chiroyli dizayn chizish
   - ✔ Tizimni serverga joylashtirish
   - Yangi dasturlash tili o'rganish
9. Buyurtma bir kanaldan berilsa, boshqa kanalda ko'rinadimi?
   - Yo'q — har kanal alohida saqlaydi
   - Faqat qo'lda ko'chirsa
   - Buni qilib bo'lmaydi
   - ✔ Ko'rinadi — ma'lumot bitta Database'da
10. Mavjud tizimga yangi kanal (mobil) qo'shishning oson yo'li?
    - Butun tizimni noldan yozish
    - ✔ Yangi frontend yozib, o'sha backend'ga ulash
    - Mobil uchun alohida Database qurish
    - Buni qilib bo'lmaydi
11. AI tizimda qanday rol o'ynaydi?
    - Ma'lumotni doimiy saqlaydi
    - Barcha qarorni yakka o'zi qabul qiladi
    - Buyurtmani Database'ga o'zi yozadi
    - ✔ Backend chaqirganda savolga javob, tavsif yozadi
12. To'liq tizimni yetkazish jarayoni qanday?
    - Ishga tushirish → sinash → yig'ish → tuzatish → xatoni topish
    - Sinash → yig'ish → ishga tushirish → xatoni topish → tuzatish
    - Tuzatish → xatoni topish → sinash → yig'ish → ishga tushirish
    - ✔ Yig'ish → sinash → xatoni topish → tuzatish → ishga tushirish
- Arena yozuvlari: Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · ball · N/12 to'g'ri · eng uzun streak xN · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish
