# 6-Modul (LMS: 8-Modul) · 13-dars «Loyiha kuni: to'liq tizim» — YANGI MATN (v2)

Fayl: `src/6-Modull/FullSystemProjectLesson.jsx` · 21 ekran · faqat o'zbekcha
Eski matn: `13-FullSystemProject-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=1-variant, s6=3, s10=4, s13=2; arena kaliti o'zgarmaydi) — faqat matn.
⚠️ KOD (Quruvchi): 17-ekran yakuniy topshiriq bo'laklari almashadi (pastda).

---

## A. Darsning tayanchi

**Bosh formula (dars bo'yi):** Yig' → Sina → Xatoni top → Tuzat → Qayta sina → Ishga tushir.
**Rol — bitta:** siz — **tizim arxitektori** (qismlarni yig'asiz, sinaysiz, ishlaydigan tizimni yetkazasiz). «Direktor» — yo'q.
**Bu dars — 1-bosqichning yakuniy loyihasi**, kursning oxiri emas: keyin 14-dars (PM) bor, undan keyin 2-bosqich (7-Modul) boshlanadi. «Kurs tamom» — olib tashlanadi.

**Texnik aniqlik (final dars — noto'g'ri model qolmasin):**
- Buyurtma oqimi: Kanal → Backend → Baza, keyin Backend → Bot (admin xabari). **AI buyurtma oqimida emas** — u alohida: Mijoz savoli → Backend → AI → Javob (8 va 10-darslar bilan bir xil).
- «Bitta backend + bitta baza = bitta tizim» — sodda formula: web, mobil va bot bir xil backend bilan ishlasa, ular bitta tizimning kanallari; **bu loyihada** umumiy ma'lumot bitta PostgreSQL bazasida.
- «Hech narsa ikki marta qurilmaydi» → mavjud backend'dan qayta foydalanamiz; kerak bo'lsa unga yangi endpoint qo'shamiz.
- End-to-end test va 12 katakli matritsa — **bugungi loyiha uchun** tuzilgan; boshqa loyihada qadamlar boshqacha.
- Deploy — serverga joylashtirish; ishga tushirish — foydalanuvchiga berish. «Ship» — yo'q. «24/7» — yo'q.
- `.env` — maxfiy kalitlar: frontend kodiga yozilmaydi, GitHub'ga yuborilmaydi (bot darslaridagi `.gitignore` qoidasi).

**Metafora:** shahar (Arxiv, Hokimlik, Peshtoq, darvoza, fuqaro, ariza, idora) — butunlay olib tashlanadi (1-dars qarori). «Chok» — qoladi, izoh bilan: qismlar ulangan joy.
**So'zlar:** «order trace» → buyurtma yo'li · «launch checklist» → ishga tushirish ro'yxati · «checkout» → buyurtma ekrani · «grand-finali» → yo'q · «slot» → joy.

---

## 0 · Kirish — hamma qism tayyor  `[749]`
- Eyebrow: Kirish · yakuniy loyiha
- Sarlavha: **Hamma qism tayyor. Ishga tushirishdan oldingi oxirgi qadam nima?**
- Mentor: Kurs davomida web, mobil ilova, bot, backend, baza va AI bilan ishladingiz. Bugun ularni bitta tizimga yig'amiz va ishga tushiramiz. Lekin avval bitta narsa shart.
- Blok: **Sizda tayyor turgan qismlar** — 💻 Web · 📱 Mobil · ✈️ Bot · 🟢 Backend · 🐘 Baza · 🤖 AI · Olti qism — lekin ular birga, xatosiz ishlashini hali hech kim tekshirmadi.
- Savol: **Birinchi nima qilamiz?**
  - Darrov e'lon qilamiz — vaqt ketmasin
  - Butun tizimni boshidan oxirigacha sinaymiz
  - Yana yangi funksiyalar qo'shamiz
- Javob — 2-variant: **Aynan!** Avval butun oqimni boshidan oxirigacha sinab, xatolarni tuzatamiz. Bugun: qismlarni yig'amiz, tizimni sinaymiz, xatoni topib tuzatamiz va ishga tushiramiz.
- Javob — 1-variant: **Qiziq fikr!** Lekin sinalmagan tizimni chiqarsangiz, xatoni mijoz topadi. Avval butun oqimni boshidan oxirigacha sinaymiz — bugun shuni qilamiz.
- Javob — 3-variant: **Qiziq fikr!** Yangi funksiya — keyin. Hozir bor qismlar birga ishlashini hech kim tekshirmagan. Avval shuni sinaymiz.

✎ Javob tanlovga qarab uch xil (oldin hammasiga «To'g'ri») · «kursning yakuniy loyiha kuni» → «yakuniy loyiha» (1-bosqich) · to'g'ri variant tenglashtirildi

## 1 · Reja  `[788]`
- Sarlavha: **Yakuniy loyiha kuni: hamma qism — bitta tizim**
- Mentor: Bugun yangi narsa o'rganmaymiz — bilganlarimizni bitta to'liq tizimga yig'amiz va ishga tushiramiz. Bu — 1-bosqichning yakuniy loyihasi.
- Blok «Bugungi maqsad»: **Hamma qism → bitta tizim** — yig'amiz, sinaymiz, tuzatamiz, ishga tushiramiz. · → Siz — tizim arxitektori: butun tizimni yig'asiz va sinaysiz.
- 5 qadam:
  1. Hamma qismni bitta tizimga yig'ish (web + mobil + bot)
  2. Ko'p kanal — bitta backend (buyurtma yo'li) · *jonli*
  3. End-to-end test — butun oqimni sinash · *jonli*
  4. Chokdagi xatoni topish va tuzatish
  5. Ishga tushirish

✎ «grand-finali», «ship», «kursni yakunlash» olib tashlandi

## 2 · To'liq tizim xaritasi  `[821]`
- Sarlavha: **Bularning hammasi bilan ishladingiz**
- Mentor: Mana to'liq tizim: yuqorida 3 ta kanal (kirish yo'li), pastda yadro. Har birini bosing — nima qiladi.
- Kanallar: **Web (React)** — brauzerda mahsulotlar va «Buyurtma» tugmasi · **Mobil (React Native)** — telefonda o'sha do'kon, Expo Go bilan · **Telegram bot** — buyurtma va xabarlar Telegram orqali
- Yadro: **Node.js** · Backend — barcha kanaldan so'rovni qabul qilib boshqaradi · **PostgreSQL** · Baza — mahsulot va buyurtmalarni saqlaydi, bitta joyda · **AI (Claude)** · Yordamchi xizmat — Backend chaqirganda mijoz savoliga javob yozadi, tavsif tayyorlaydi
- Yakun: 6 qism — kurs davomida o'rgangan bilimlaringiz. Endi ularni birga ishlatamiz.

✎ 🔴 FAKT: «6 qism, 6 modul mehnati» va kartalardagi «Modul 3/9/8/4/4/8/9» (6 xil modul emas, raqamlar LMS bilan mos emas) → olib tashlandi · «Hokimlik», «Arxiv», «Ekspert-byuro» yorliqlari olib tashlandi · «Bularning hammasini siz qurdingiz» → «bilan ishladingiz» (AI'ni o'quvchi qurmagan)

## 3 · Ko'p kanal, bitta tizim  `[859]`
- Sarlavha: **Uch kanal — bitta backend**
- Mentor: Mijoz web, mobil yoki bot orqali keladi — lekin uchalasi ham o'sha backend va bazadan foydalanadi. Har kanalni bosing.
- Karta: **«[kanal] kanali»** — Bu kanal ham o'sha Node.js backend'ga so'rov yuboradi va o'sha PostgreSQL bazasidan o'qiydi. Mavjud backend'dan qayta foydalanamiz; kerak bo'lsa unga yangi so'rov yo'li (endpoint) qo'shamiz.
- Xulosa: 1-darsdagi g'oya to'liq ko'rinishda: **ko'p kirish yo'li, bitta tizim**. Ma'lumot bitta joyda — shuning uchun hamma kanal bir xil holatni ko'radi.

✎ «Hech narsa ikki marta qurilmaydi» (qat'iy) → qayta foydalanish + kerak bo'lsa endpoint · «ko'p eshik» → «ko'p kirish yo'li» (1-v2)

## 4 · 1-savol ✅  `[895]`
- Savol: **Nega bu uch kanal bitta tizim?**
  - ✔ Uchalasi bir xil backend va bazadan foydalanadi
  - Har birining o'z alohida backend'i va bazasi bor
  - Ular bir-biriga bog'lanmagan — alohida ishlaydi
  - Faqat ranglari va tashqi ko'rinishi bir xil
- To'g'ri: To'g'ri! Web, mobil, bot — uchala kanal bir xil backend va PostgreSQL bazasidan foydalanadi. Ma'lumot bitta joyda bo'lgani uchun hamma kanal bir xil holatni ko'radi — shuning uchun ular bitta tizimning kanallari.
- Xato izohlari — o'zgarmaydi (umumiy izoh: «Bir xil backend bilan ishlasa — bitta tizimning kanallari»)

✎ «Bitta backend + bitta baza = bitta tizim» (texnik ta'rifdek) → sodda formula ekani ko'rsatildi

## 5 · End-to-end  `[915]`
- Sarlavha: **End-to-end: boshidan oxirigacha**
- Mentor: End-to-end — bitta amalni boshidan (mijoz) oxirigacha (tasdiq) kuzatish. Har qism birga ishlayaptimi — shu sinaladi. Bugungi loyihada buyurtma 5 qadamdan o'tadi. Bosing.
- Oqim (5 qadam) — o'zgarmaydi
- Xulosa: Bugungi loyihada end-to-end test — shu 5 qadamni birga sinash. Bitta qadam ishlamasa — tizim chala. Boshqa loyihada qadamlar boshqacha bo'lishi mumkin, fikr esa o'sha: boshidan oxirigacha.

✎ «End-to-end test = shu 5 qadam» (universal ta'rif) → «bugungi loyihada»

## 6 · 2-savol ✅  `[949]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **End-to-end test nimani sinaydi?**
  - Bitta funksiyani alohida holda
  - Sahifaning ranglari va dizaynini
  - ✔ Bitta amalning barcha qadamlarini birga
  - Backend kodini o'qib chiqib, ishlatmasdan
- To'g'ri: To'g'ri! End-to-end test bitta amalni (masalan, buyurtmani) barcha qadamlari bo'ylab — mijozdan tasdiqqacha — sinaydi. Shunda qismlar orasidagi chokdagi xatolar ko'rinadi.
- Xato izohlari — o'zgarmaydi

✎ Eyebrow «Tekshiruv · Mustahkamlash» → «Mashq · 2-savol» · 🔴 to'g'ri javob 5-ekran sarlavhasini («boshidan oxirigacha») aynan takrorlardi → boshqa so'zlar bilan, uzunligi teng

## 7 · Buyurtma yo'li · jonli (markaziy)  `[969]`
- Eyebrow: Buyurtma yo'li · jonli
- Sarlavha: **Qaysi kanaldan kelsa ham — o'sha tizim javob beradi**
- Mentor: Kanalni tanlang, «Buyurtma yubor» bosing — buyurtma o'sha backend'ga borib, bazaga saqlanadi, bot adminga xabar beradi. Uchala kanalni sinab ko'ring — natija bir xil!
- Sxema: [kanal] → 🟢 Backend → 🐘 Baza · ✈️ Bot
- Har yuborishdan keyin: **[Kanal]dan keldi — tizim ishladi** — bazaga saqlandi · admin xabardor. Boshqa kanal ham xuddi shunday.
- Eslatma: AI buyurtma yo'lida emas — u alohida ishlaydi: mijoz savol yozsa, backend uni AI'ga yuboradi va javob qaytaradi.
- Xulosa (3/3): Uchala kanal — bitta natija. Kirish yo'li ko'p, yadro bitta.

✎ 🔴 TEXNIK: AI buyurtma oqimiga majburan qo'shilgan edi («AI javob berdi») — 2-ekranda AI'ning vazifasi savolga javob; 8 va 10-dars v2 bilan bir xil: AI alohida oqim · «order trace» → «buyurtma yo'li» · «tirik tizim» olib tashlandi · ⚠️ KOD: sxemadan AI tuguni olib tashlanadi

## 8 · Integratsiya choklari  `[1031]`
- Sarlavha: **Tizim choklarda siniydi**
- Mentor: Qismlar alohida yaxshi ishlaydi — xato ko'pincha ular **ulangan joyda** chiqadi. Bu joyni chok deymiz. Har chokni bosing: bu yerda nima buziladi?
- Choklar:
  - **Frontend ↔ Backend** — backend manzili noto'g'ri — «Failed to fetch» (8-darsdagi ulanish xatosi)
  - **Mobil ↔ Backend** — mobil eski manzilga ulanyapti yoki so'rovda maydon yetishmaydi
  - **Bot ↔ Backend** — BOT_TOKEN yo'q yoki xato — bot xabar yubormaydi
  - **Backend ↔ AI** — AI kaliti yo'q yoki limit tugagan — javob kelmaydi
- Xulosa: Ko'p xatolar — bitta yo'qolgan sozlama yoki yetishmagan maydon. End-to-end test aynan shularni tutadi.

✎ «API_URL (.env)» → «backend manzili» (8-dars v2: frontend `.env`/`API_URL` kursda o'tilmagan) · «Aksar bug'lar» → «Ko'p xatolar»

## 9 · Test matritsasi · jonli (markaziy)  `[1071]`
- Sarlavha: **End-to-end test: har kanal × har qadam**
- Mentor: Bugungi loyiha uchun test jadvali tuzdik: 3 kanal × 4 asosiy qadam. «Testni ishga tushir» bosing — kataklar yashil bo'lib boradi. Bittasiga e'tibor bering!
- Matritsa: Web · Mobil · Bot × Buyurtma · Bazada · Bot xabar · Tasdiq
- Natija: **🐞 XATO TOPILDI** — **Mobil × «Bot xabar»** qizil: mobildan buyurtma berilganda admin Telegram xabarini olmadi. Web va bot kanallari ishlaydi — demak chok mobil tomonda.
- Xulosa: Mana end-to-end testning kuchi: 11 katak yashil, 1 qizil — yashirin chok xatosi ko'rindi. Endi tuzatamiz.

✎ Matritsa «bugungi loyiha uchun» (universal usul emas) · 🔴 4-ustun «AI javob» → «Tasdiq» (AI buyurtma oqimida emas; 5-ekrandagi 5-qadam bilan mos) · ⚠️ KOD: ustun nomi

## 10 · 3-savol ✅  `[1122]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Chokdagi xatolarni qanday topamiz?**
  - Bitta kanalni bir marta sinab, qolganini o'tkazib
  - Faqat kodga qarab, ishlatib ko'rmasdan
  - Umuman sinamasdan, to'g'ridan chiqarib
  - ✔ Har kanaldan butun oqimni sinab
- To'g'ri: To'g'ri! Har kanaldan butun oqimni sinaymiz (end-to-end). Jadval ko'rsatadi: qaysi kanal × qaysi qadam buzilgan. Shunday qilib chok qayerda ekanini aniq topamiz.
- Xato izohlari — o'zgarmaydi, «bug» → «xato»: «Bitta kanal kam — xato boshqa kanalda bo'lishi mumkin (mobildagidek).» · «Test qilmaslik — xatoni mijoz topadi.»
✎ QAROR F-0929-27 (Q2-B): savolning o'zi «Chokdagi xatolarni…» deydi — izohda ham «xato»

✎ Eyebrow «2-savol» → «3-savol» · 🔴 «end-to-end» so'zi faqat to'g'ri javobda edi → izohga ko'chdi, variantlar teng

## 11 · Xatoni tuzatish · jonli  `[1142]`
- Eyebrow: Xatoni tuzatish · jonli
- Sarlavha: **Xatoni topdik → sababini aniqlaymiz → tuzatamiz**
- Mentor: Qizil katakni topdik. Endi tizim arxitektori sifatida sababni aniqlaymiz, aniq tuzatish beramiz va qayta sinaymiz. Bosing.
- Sikl:
  1. **1 · XATO** — Jadvalda bitta qizil katak: Mobil × «Bot xabar». Mobildan buyurtma berilganda admin Telegram xabarini olmadi. — *Web ishlaydi, mobil yo'q — demak chok mobil↔backend orasida.*
  2. **2 · SABAB (tekshiruv)** — Uch ehtimol bor: (a) mobil so'rovda ma'lumot to'liq emas; (b) backend bu so'rovni tekshiruvdan o'tkazmayapti; (c) bot chaqiruvi mobil uchun ishlamayapti. Tekshirdik: mobil `POST /orders` so'rovida bitta maydon yetishmayapti — backend shuning uchun bot xabari qadamini o'tkazib yubordi. — *Avval ehtimollarni sanab, keyin tekshirib topasiz.*
  3. **3 · TUZATISH** — «Mobil buyurtma ekrani barcha maydonlarni yuborsin; backend har buyurtmada, kanal qaysi bo'lishidan qat'i nazar, bot xabarini yuborsin.» — *Aniq, kichik tuzatish — butun tizimni qayta yozmaysiz.*
  4. **4 · QAYTA SINOV** — Jadval endi to'liq yashil ✅ — uchala kanaldan ham bot xabari keladi.
- Xulosa: Xatoni top → sababini tekshir → kichik tuzatish → qayta sina. Bitta chok yamaldi, butun tizim yana yashil.

✎ «Sabab mana shu» deb oldindan berilardi → endi 3 ehtimol + tekshiruv (diagnostika fikri) · «direktor sifatida» → «tizim arxitektori» · «checkout» → «buyurtma ekrani» · «nishonli» → «kichik»

## 12 · Ishga tushirish  `[1179]`
- Sarlavha: **Ishga tushirishdan oldin — tekshiruv ro'yxati**
- Mentor: Tizimni ishga tushirishdan oldin shu ro'yxatni belgilang. Hammasi tayyor bo'lsa — ishga tushiramiz!
- Ro'yxat **Ishga tushirish ro'yxati**:
  - Sozlamalar to'g'ri: backend manzili, `DATABASE_URL`, `BOT_TOKEN`, AI kaliti — maxfiylari `.env`da, frontend kodida emas va GitHub'ga yuborilmagan
  - End-to-end test o'tdi — jadval to'liq yashil
  - Mobil ilova Expo Go'da telefonda sinaldi
  - Backend serverga joylashtirildi (deploy) va ishlayotgani tekshirildi
- Natija: 🚀 **Ishga tushirishga tayyor!** — Sozlama to'g'ri, test o'tdi, mobil sinaldi, backend ishlayapti. Endi mijozlar foydalanadi.

✎ 🔴 `.env` xavfsizlik qoidasi qo'shildi (frontend kodiga emas, GitHub'ga emas — bot darslaridagi `.gitignore` qoidasi) · «Backend deploy qilindi — 24/7 ishlaydi» (deploy 24/7 ni kafolatlamaydi) → «joylashtirildi va tekshirildi» · «launch checklist», «ship» → o'zbekcha · deploy CI/CD darslarida o'tilgan (4c-Modul) — atama qoladi

## 13 · 4-savol ✅  `[1212]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Ishga tushirishdan oldin nima shart?**
  - Hech narsa — darrov mijozga chiqaramiz
  - ✔ Butun oqim sinalgan va sozlamalar to'g'ri bo'lishi
  - Ko'proq rang va bezak qo'shilgan bo'lishi
  - Logotip va nom tayyor bo'lishi
- To'g'ri: To'g'ri! Ishga tushirishdan oldin end-to-end test o'tgan (jadval to'liq yashil) va `.env` sozlamalari to'g'ri bo'lishi shart. Aks holda xatoni mijoz topadi.
- Xato izohlari — o'zgarmaydi, bitta so'zdan tashqari: «Darrov chiqarish — xatolarni mijoz ko'radi.»
✎ QAROR F-0929-27 (Q2-B): «bug'lar» → «xatolar» — savol «xatolar» deydi, 8-dars bilan izchil

✎ Eyebrow «3-savol» → «4-savol» · 🔴 «end-to-end» va «.env» faqat to'g'ri javobda edi → izohga ko'chdi

## 14 · Ishga tushdi (case)  `[1232]`
- Sarlavha: **Tizim ishlayapti — bir o'quvchining yo'li**
- Qatorlar: **YIG'DI** — web, mobil, bot — uchala kanalni bitta backend'ga uladi · **SINADI** — har kanaldan buyurtma berib, butun oqimni end-to-end sinadi · **TUZATDI** — chokdagi xatoni topib, kichik tuzatish bilan yamadi · **ISHGA TUSHIRDI** — backend'ni serverga joylashtirdi, tizimni ishga tushirdi — mijozlar uch kanaldan kelyapti. *1-bosqichning yakuniy loyihasi tayyor.*
- Xulosa: Yig' → sina → tuzat → ishga tushir. Endi o'zingiz rejalang.

✎ 🔴 «Kurs tamom!» → «1-bosqichning yakuniy loyihasi» · «ship» → «ishga tushir» · «Ko'p eshik, bitta tizim» olib tashlandi

## 15 · Qoida  `[1263]`
- Sarlavha: **To'liq tizim: yig' · sina · tuzat · ishga tushir**
- Karta: 🧭 **Siz — tizim arxitektori** — qismlarni yig'asiz, sinaysiz, ishlaydigan tizimni yetkazasiz.
- 4 narsani unutmang: YIG' — ko'p kanal, bitta backend · END-TO-END TEST — har kanal × har qadam · XATONI TUZAT — chokni topib, kichik tuzatish · ISHGA TUSHIR — sozlama va test tayyor bo'lsa

## 16 · Amaliyot · VS Code  `[2030]`
- Sarlavha: **Endi navbat sizga — tizimni yig'ing va sinang**
- Topshiriq: O'z loyihangizda barcha kanalni (web / mobil / bot) bitta backend'ga ulang, keyin har kanaldan bitta buyurtma berib, butun oqimni (baza + bot xabari) end-to-end sinab ko'ring.
- Bosqichlar:
  1. Loyihani VS Code'da oching, backend'ni ishga tushiring (`npm run dev`); `.env` sozlamalari to'liqligini tekshiring
  2. Web (yoki mobil) kanaldan bitta buyurtma bering
  3. Buyurtma bazaga tushganini tekshiring
  4. Bot admin xabarini yuborganini tekshiring
  5. Bitta qadam ishlamasa — jadvalda qaysi kanal × qadam qizil ekanini yozing va sababini toping
  6. Tugagach «Bajardim» tugmasini bosing

✎ «Arxivga (bazaga)» → «bazaga» · `.env` tekshiruvi 1-bosqichga qo'shildi

## 17 · Jarayonni yig'ing ✅ (final)  `[1293]`
- Eyebrow: Yakuniy · jarayon
- Sarlavha: **Oxirgi qadam: to'liq tizimni yetkazish jarayonini tartibda yig'ing.**
- Mentor: Bugun bosib o'tgan yo'lni eslang. Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (aralash): Qismlarni yig'ish · End-to-end sinov · Chokdagi xatoni topish · Kichik tuzatish va qayta sinov · Ishga tushirish
- Joylar: har katakda raqam (1…5) + «bu yerga qo'ying»
✎ QAROR F-0929-27 (29.09, foydalanuvchi Q1-B): katak izohi «bu yerga qo'ying» — katakda raqam allaqachon bor, «1 · 1-qadam» takrorlanardi; joylashuv ikki ustun (kataklar chapda, bo'laklar o'ngda)
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri (bir marta): ✓ Jarayon tayyor: **Yig' → Sina → Xatoni top → Tuzat → Ishga tushir**. To'liq tizim shunday yetkaziladi.

✎ 🔴 TEXNIK: «Arxiv → Hokimlik → Peshtoq → Ikkinchi darvoza» — «shaharni ishga tushirishning to'g'ri tartibi» sifatida berilgan edi. Bu qat'iy tartib emas: bot va frontend mustaqil ishga tushadi, mobil esa ro'yxatda yo'q edi. Ustiga shahar so'zlari darsda birinchi marta shu ekranda chiqardi va bo'sh joylardagi ko'rsatmalar tartibni ochib qo'yardi (kodda `hints`). → Yakuniy topshiriq endi darsning haqiqiy, ma'noli tartibi — jarayon (7-dars v2 kabi) · ⚠️ KOD: bo'laklar (5 ta), `hints`, doneText almashadi; INLINE_KEYS `s15: 0` o'zgarmaydi · «slot» → «joy»

## 18 · Natijalar (podium)  `[1853]` — o'zgarmaydi · savol yorliqlari: 1 — Bitta tizim · 2 — End-to-end · 3 — Chokdagi xato · 4 — Ishga tushirish sharti · 5 — Jarayon

## 19 · Takrorlash (kartochkalar)  `[2137]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| Web, mobil va bot qaysi umumiy qismga ulanadi? | Bitta backend'ga | Kirish yo'li uchta, tizim bitta |
| Nega web va bot bir xil buyurtmani ko'radi? | Baza bitta | Bu loyihada hamma buyurtma bitta PostgreSQL bazasida |
| Bitta amalni boshidan oxirigacha sinaydigan test? | End-to-end | Mijozdan boshlanib, tasdiq bilan tugaydi |
| Qismlar alohida ishlab, birga ishlamasa — bu qanday xato? | Chokdagi (integratsiya) xatosi | Qismlar ulangan joyda yashiringan |
| Qaysi kanal qaysi qadamda buzilganini nima ko'rsatadi? | Test jadvali (matritsa) | Har kanal × har qadam — katak; qizili — chok |
| Tizimni serverga joylashtirish qanday ataladi? | Deploy | Ishga tushirish — foydalanuvchiga berish |
| Ishga tushirishdan oldin test jadvali qanday bo'lishi shart? | To'liq yashil | Bitta qizil katak qolsa — ishga tushirilmaydi |
| BOT_TOKEN kabi maxfiy sozlamalar qayerda turadi? | .env faylida | Frontend kodiga yozilmaydi, GitHub'ga yuborilmaydi |
| Buyurtmalar doimiy saqlanadigan joy? | Baza (PostgreSQL) | Backend unga yozadi va o'qiydi |
| Barcha kanaldan so'rovni qabul qilib boshqaradigan qism? | Backend (Node.js) | Baza, bot va AI bilan ham u ishlaydi |
| AI buyurtma oqimida ishtirok etadimi? | Yo'q | U alohida: mijoz savoli → backend → AI → javob |
| To'liq tizimni yetkazish jarayoni? | Yig' → sina → xatoni top → tuzat → ishga tushir | Bugungi darsning bosh formulasi |

✎ Shahar izohlari olib tashlandi · «Deploy (ship)» → deploy va ishga tushirish ajratildi · «Katta ochilish tartibi» kartasi → jarayon · AI kartasi qo'shildi

## 20 · Yakun  `[2150]`
- Eyebrow: 1-bosqich yakuniy loyihasi · Belgi: ✓ Tizim ishlayapti
- Sarlavha: **Endi to'liq tizimni yig'ib, sinab, ishga tushira olasiz.**
- Endi siz bilasiz:
  - Ko'p kanal (web, mobil, bot) — bitta backend bilan ishlasa, bitta tizimning kirish yo'llari
  - End-to-end test bitta amalni barcha qadamlari bo'ylab sinaydi
  - Xato ko'pincha chokda bo'ladi — sababini tekshirib, kichik tuzatish qilasiz
  - Sozlama to'g'ri va test o'tgan bo'lsa — ishga tushirasiz
  - Jarayon: yig' → sina → xatoni top → tuzat → ishga tushir
- Uyga vazifa: **Yig'ing** — loyihangizning barcha kanalini bitta backend'ga ulang · **Sinang** — har kanaldan buyurtma berib, butun oqimni tekshiring · **Ishga tushiring** — `.env` to'g'ri va test o'tgach, backend'ni serverga joylashtiring
- 🎓 1-bosqichning yakuniy loyihasi tayyor: endi o'z g'oyangizni oling, qismlarga bo'ling, yig'ing, sinang va ishga tushiring. Siz buni qila olasiz.
- 🚀 Keyingi dars — PM: **Raqamingiz nimani isbotlaydi?** Loyihangiz haqida bitta raqam va bitta slayd bilan gapirishni o'rganasiz.

✎ 🔴 FAKT: «Kursni tamomladingiz», «Kurs tamom», «Keyingi dars: yo'q» — bu 6-Modulning 13-darsi: keyin 14-dars (PM) bor, 6-Modul esa 1-bosqich yakuni, keyin 2-bosqich (7-Modul) boshlanadi → «1-bosqichning yakuniy loyihasi» + keyingi dars · «Siz endi to'liq tizim quryasiz» (grammatika) tuzatildi · «Shahar ochildi», «ko'p darvoza, bitta shahar», «Katta ochilish tartibi», «deploy / ship» olib tashlandi

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, shahar nomlari mavzuga moslanadi:
- 🔗 **One System** — ko'p kanal, bitta backend g'oyasini topdingiz (1-savol)
- 🧪 **End to End** — butun oqimni sinashni bildingiz (2-savol)
- 🧵 **Seam Finder** — xato chokda bo'lishini topdingiz (3-savol)
- 🚀 **Launch Ready** — ishga tushirish shartini bildingiz (4-savol)

**Qisqa takrorlash oynalari (4):**
1. (4) **Ko'p kanal — bitta tizim:** Web, mobil va bot — uch kirish yo'li, hammasi bitta backend bilan ishlaydi. · Bu loyihada buyurtmalar bitta bazada — shuning uchun hamma kanal bir xil holatni ko'radi. · Har kanal alohida tizim emas — bitta tizim, ko'p kirish yo'li. · Sinfga savol: Nega web va bot bir xil buyurtmani ko'radi?
2. (6) **End-to-end — boshidan oxirigacha:** Bitta amalni (buyurtmani) mijozdan tasdiqqacha kuzatish. · Frontend, backend, baza, bot — hammasi birga ishlayaptimi, shu tekshiriladi. · Bitta qadam ishlamasa — tizim chala; end-to-end aynan shuni tutadi. · Sinfga savol: Nega bitta funksiyani alohida sinash yetarli emas?
3. (10) **Xato — chokda:** Har qism alohida ishlaydi — xato ular ulangan joyda (chok) chiqadi. · Test jadvali chokni ko'rsatadi: har kanal × har qadam; qizil katak — chok o'sha yerda. · Sababini tekshirib, kichik tuzatish qilasiz — butun tizimni qayta yozmaysiz. · Sinfga savol: Chokdagi xato qayerda bo'ladi?
4. (13) **Ishga tushirish sharti:** Avval end-to-end o'tsin — jadval to'liq yashil. · Sozlamalar to'g'ri — maxfiy kalitlar `.env`da, frontend kodida va GitHub'da emas. · Keyin backend serverga joylashtiriladi va ishga tushiriladi. · Sinfga savol: Nima bo'lmasa ishga tushirmaymiz?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Web, mobil va bot «bitta tizim» deyilishining sababi? ✔ Uchalasi bir xil backend va bazadan foydalanadi · Har birida o'z alohida bazasi bor · Ular bir-biriga umuman bog'liq emas · Faqat ranglari o'xshash
2. «Ko'p kirish yo'li, bitta tizim» nimani anglatadi? ✔ Web, bot, mobil — bitta backend · Bitta kanal hammaga yetarli · Har kanalga alohida tizim kerak · Faqat web bo'lishi mumkin
3. End-to-end test nimani sinaydi? Bitta funksiyani alohida · Ranglar va dizaynni · ✔ Bitta amalning barcha qadamlarini · Backend kodini o'qib chiqib
4. Chokdagi (integratsiya) xatosi qayerda bo'ladi? ✔ Qismlar ulangan joyda · Faqat frontend rangida · Hech qachon paydo bo'lmaydi · Faqat bazaning ichida
5. Test jadvalida bitta qizil katak nimani bildiradi? Hammasi to'g'ri — xato yo'q · ✔ O'sha kanal × qadamda xato bor · Dizayn ishlari tugadi · Baza juda tez ishlayapti
6. Chokdagi xatoni qanday tuzatamiz? Butun tizimni noldan qayta yozamiz · Umuman e'tibor bermaymiz · ✔ Sababini topib, kichik tuzatish qilamiz · Faqat rang o'zgartiramiz
7. Tizimni ishga tushirishdan oldin nima SHART? Hech narsa — darrov chiqaramiz · ✔ Butun oqim sinalgan va sozlamalar to'g'ri · Ko'proq rang va bezak · Logotip va nom tayyor
8. «Deploy» nima demak? Kodni butunlay o'chirish · Chiroyli dizayn chizish · ✔ Tizimni serverga joylashtirish · Yangi dasturlash tili o'rganish
9. Buyurtma bir kanaldan berilsa, boshqa kanalda ko'rinadimi? Yo'q — har kanal alohida saqlaydi · Faqat qo'lda ko'chirsa · Buni qilib bo'lmaydi · ✔ Ko'rinadi — ma'lumot bitta bazada
10. Mavjud tizimga yangi kanal (mobil) qo'shishning oson yo'li? Butun tizimni noldan yozish · ✔ Yangi frontend yozib, o'sha backend'ga ulash · Mobil uchun alohida baza qurish · Buni qilib bo'lmaydi
11. AI tizimda qanday rol o'ynaydi? Ma'lumotni doimiy saqlaydi · Barcha qarorni yakka o'zi qiladi · Buyurtmani bazaga o'zi yozadi · ✔ Backend chaqirganda savolga javob, tavsif yozadi
12. To'liq tizimni yetkazish jarayoni qanday? Ishga tushir → sina → yig' → tuzat → xatoni top · Sina → yig' → ishga tushir → xatoni top → tuzat · Tuzat → xatoni top → sina → yig' → ishga tushir · ✔ Yig' → sina → xatoni top → tuzat → ishga tushir

✎ 12-savol «Shaharni ishga tushirish tartibi» → jarayon · 8-savol deploy/ship ajratildi · 11-savol «Ekspert-byuro» olib tashlandi, «buyurtmani o'zi yozadi» tuzoq-varianti qo'shildi

---

## B. Eslatma — kurs tuzilishi
App.jsx bo'yicha: 6-Modul = «1-bosqich yakuni» (oy 11–12.5), 13-darsdan keyin 14-dars (PM) va 15-zaxira bor; 7-Modul = 2-bosqich («Kim uchun va nima uchun»). Shuning uchun «Kursni tamomladingiz» matni o'quvchini chalg'itadi — v2'da «1-bosqichning yakuniy loyihasi». Agar 2-bosqich boshqa dastur bo'lsa va o'quvchi kursni shu yerda tugatsa — ayting, matnni «1-bosqich yakuni» dan «kurs yakuni»ga qaytaraman (lekin 14-dars baribir keyin keladi).
