# 6-dars «Foydalanuvchi sizga ma'lumotini ishonadimi?» — yakuniy matn

Fayl: `src/8-Modull/PmTrustAuditLesson.jsx` · 12 ekran · Keyingi dars: «Production deploy: domen, SSL, monitoring»
Holat: 06.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Kirish · ishonch
- Sarlavha: Telefon raqamingizni *bu formaga yozasizmi*?
- Mentor: Siz shanba kuni o'ynamoqchisiz va «Maydon»da 18:00 ni tanladingiz. Ikki javobdan birini tanlang.
- Maket (chap): o'yinchi telefoni — yorliq «Sayt · React» `BandForma.jsx` · manzil `maydon-….netlify.app` · Maydon · Shanba · 18:00–19:00 · Ism (bo'sh) · Telefon («Masalan: +998 90 123 45 67») · Band qilish
- Telefon yonidagi kartada — forma ostidagi gap: Ismingiz va raqamingizni faqat maydon egasi ko'radi: kerak bo'lsa, shu raqamga qo'ng'iroq qiladi. Boshqa o'yinchilar bu vaqtni «band» deb ko'radi. · oxirida uzuq chiziqli bo'sh joy «?»
- Variantlar:
  - Ha — egasi qo'ng'iroq qilishi uchun kerak
  - Avval raqamim qayerga borishini bilaman
- Variant tanlangach: gapning bo'laklari birin-ketin belgilanadi (1, 2, 3) va ostida uchta yorliq chiqadi: 1 Kim ko'radi? ✓ · 2 Nima uchun? ✓ · 3 Qancha saqlanadi? ?
- Javob izohlari:
  - 1-variant tanlansa: **Qiziq fikr!** Raqam qo'ng'iroq uchun kerak — forma ostida shunday yozilgan. Qancha saqlanishi esa yozilmagan.
  - 2-variant tanlansa: **Aynan!** Forma ostidagi gap kim ko'rishini va nima uchun kerakligini aytadi. Qancha saqlanishi esa yozilmagan.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida «Maydon» nima saqlashini *ochiq aytadi*.
- Mentor: O'tgan darsda ega sahifasidagi uch zaiflik yopildi, bugun — o'yinchi ma'lumoti. «Maydon» — namuna: har amaliyot oxirida shu ishni o'z MVP'ingizda qilasiz.
- Chap yorliq: ma'lumot sizib chiqsa — audit va maxfiylik siyosati
- Chap maket (o'zi bir marta yuradi): o'yinchi telefoni tayyor holatda — forma ostida havola «Maxfiylik siyosati» → havola bosiladi → yonida ikkinchi telefon `/maxfiylik` (to'rtta sarlavha chizig'i, matnsiz) → pastda fayl belgisi `AUDIT.md`
- Reja (o'ng):
  - 01 · Ism va telefon qayerga borishini topasiz · shaxsiy ma'lumot
  - 02 · Begona qo'lga o'tsa, nima ko'rinishini ko'rasiz · sizib chiqish
  - 03 · «Maydon»ni olti savol bo'yicha tekshirasiz · audit
  - 04 · O'yinchi o'qiydigan sahifani saytga qo'shasiz · maxfiylik siyosati
- Pastki qator: repo `maydon` · boshlang'ich holat `m10-dars-06-start` · namuna `m10-dars-06-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Ism va telefon yo'li
- Eyebrow: Tushuncha · ism va telefon yo'li
- Sarlavha: Ism va telefon «Maydon»da *qayerga boradi*?
- Mentor: O'yinchi bo'lib «Band qilish»ni bosing va ism bilan telefon qayerda paydo bo'lishini kuzating.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): **Yuborilgan ism va telefon nechta joyda saqlanadi?** · Bitta · Ikkita · To'rtta
  - tanlangach ixcham qator: Taxminingiz · Yuborilgan ism va telefon nechta joyda saqlanadi? · <tanlov>
- Chap: o'yinchi telefoni — forma to'ldirilgan (ism va telefon xira chiziq) · Band qilish; telefondan o'ngga strelka `POST /bandlar`
- O'ng — xarita:
  - Backend · NestJS — `POST /bandlar` `POST /hodisalar`
  - `bandlar` jadvali — kun · soat · ism · telefon
  - `hodisalar` jadvali — nom · brauzer_id · variant · yaratilgan
  - Ega sahifasi — brauzer `maydon-….netlify.app/ega` · Maydon · ega · ‹ Shanba › · «Bu kunda band yo'q.»
  - Umami — analitika — band-qildi · 0
- «Band qilish» bosilgach: konvertlar uchadi; telefonda «Band qilindi: 18:00» va soat kataklari 16:00 … 21:00 (18:00 — band); `bandlar` ga `2026-10-10 · 18:00 · ▒ · ▒`; ega sahifasida «18:00 · ▒ · ▒»; `hodisalar` ga `band-qildi · b41d… · A · 18:02`; Umami — band-qildi · 1
- Keyin beshta joy bittadan bosiladi (›, bosilgach ✓); bosilgan joy ostida:
  - O'yinchi sahifasi (telefondagi 18:00 katagi) — `18:00 · band` · ism va telefon yo'q
  - `bandlar` — saqlanadi
  - Ega sahifasi — ko'rsatiladi · alohida nusxa yo'q, `bandlar` dan o'qiydi (parol va 6 xonali kod bilan)
  - `hodisalar` — ism va telefon yo'q
  - Umami — analitika — ism va telefon yo'q
- Natija: ✓ Taxminingiz to'g'ri chiqdi — yoki — Taxminingiz: <tanlov> · haqiqatda: **bitta — `bandlar` jadvali; ega sahifasi uni ko'rsatadi, o'zida saqlamaydi**
- Joriy qator: Ism va telefon odamni aniqlashga imkon beradi: bunday ma'lumot **shaxsiy ma'lumot** deyiladi.
- Izoh: GDPR (General Data Protection Regulation) — Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan: unda telefon raqami ham shaxsiy ma'lumot.
- Xulosa: Bu misolda ism va telefon `bandlar` da saqlanadi, ega sahifasida ko'rinadi, analitikaga ketmaydi.
- Tugadi: telefon yopiladi, xarita butun enga (`18:00 · band` · `band-qildi · b41d… · A · 18:02` · `band-qildi · 1`), `bandlar` va ega sahifasi fokusda
- Tugma: Avval o'zingiz belgilab ko'ring → Band qiling → Joylarni oching (N/5) → Davom etish

## 3 · 1-savol
- Eyebrow: Tekshiruv · shaxsiy ma'lumot
- Savol: «Maydon»dagi qaysi yozuv *shaxsiy ma'lumot*?
  - `band-qildi` hodisasining nomi
  - Ega telefonidagi 6 xonali kod
  - ✔ Band qilganning telefon raqami
  - Katakdagi «18:00 · band» yozuvi
- Javob izohlari:
  - To'g'ri: Raqam orqali odamni aniqlab, unga qo'ng'iroq qilsa bo'ladi.
  - A: Hodisa nomi hamma o'yinchida bir xil — kimligini aytmaydi.
  - B: Kod maxfiy, lekin u odamni aniqlamaydi.
  - D: «band» yozuvini hamma ko'radi — unda kim band qilgani yo'q.
  - Umumiy: Qaysi yozuv bilan odamni aniqlash mumkin?
- Barcha testlarda umumiy yozuvlar: Javob tanlang → Davom etish · javobdan keyin «To'g'ri» yoki «Qaytadan urinib ko'ring» · «Qisqa takrorlash — mavzuni yana bir ko'rish» · jonli darsda: «Jonli dars — bitta urinish, o'ylab bosing!» · «Javobingiz qabul qilindi» · «Hozir to'g'ri javobni bilib olasiz.» · «✓ To'g'ri javob: …»

## 4 · Sizib chiqish
- Eyebrow: Tushuncha · sizib chiqish
- Sarlavha: Ega sahifasi ochiq qolsa, *begona nimani ko'radi*?
- Mentor: Ega laptopini yopmay ketdi, unda `/ega` ochiq — begona nimani ko'rishini bilish uchun kunlarni orqaga suring.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): **Begona odam qaysi bandlarni ko'ra oladi?** · Bugungi bandlarni · Oxirgi haftadagi bandlarni · Sayt ochilgandan beri hammasini
- Chap — ega sahifasi (brauzer `maydon-….netlify.app/ega`): Maydon · ega · belgi «begona» · ‹ Bugun › (keyin kun nomi — Dushanba, Seshanba, Chorshanba, Payshanba, Juma, Shanba, Yakshanba — va «N kun oldin») · ro'yxat «16:00 · ▒ · ▒», «19:00 · ▒ · ▒» · band bo'lmasa: «Bu kunda band yo'q.»
- O'ng — kunlar chizig'i (surgich, yorliq «Kunlarni orqaga suring»): 60 kun oldin · bugun
  - ostida: Sahifada ‹ har bosilganda bir kun orqaga — surgich shuni tezlashtiradi.
  - `bandlar` jadvali — kun · soat · ism · telefon: 2026-10-10 · 19:00 · 2026-09-28 · 17:00 · 2026-09-05 · 18:00 · 2026-08-13 · 20:00 (ism va telefon xira)
- Surgich chap uchiga yetgach — kalit: O'yin kunidan 30 kun o'tgan bandlar o'chirilsin → chiziqda «30 kun» belgisi va «o'chirildi» qismi; `bandlar` da 30 kundan eski qatorlar so'nadi; eski kunlarda — «Bu kunda band yo'q.»
- Natija: ✓ Taxminingiz to'g'ri chiqdi — yoki — Taxminingiz: <tanlov> · haqiqatda: **hammasini — eski bandlar o'chirilmaydi**
- Joriy qator: Ma'lumot ruxsatsiz begona qo'lga o'tishi **sizib chiqish** deyiladi.
- Izoh (kalitdan keyin): O'zbekistonning «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunida (17-modda): maqsadga erishilganda ma'lumot yo'q qilinadi.
- Xulosa: Bu misolda eski bandni saqlamaslik sizib chiqsa ko'rinadigan ma'lumotni kamaytiradi.
- Oxirgi qator: `bandlar` dan o'chirilgan qator ega sahifasida endi ko'rinmaydi.
- Tugma: Avval o'zingiz belgilab ko'ring → Kunlarni suring → O'chirishni yoqing → Davom etish

## 5 · Audit varag'i
- Eyebrow: Tushuncha · audit varag'i
- Sarlavha: «Maydon»ning qaysi joyini *tuzatish kerak*?
- Mentor: Har savolga «Maydon» kodidan dalil ochiladi — unga qarab «Joyida» yoki «Tuzatish kerak»ni bosing.
- Chap: raqamli chiziq 1 · 2 · 3 · 4 · 5 · 6 · joriy savol kartasi: «N / 6» + yorliq · savol · dalil (kichik chizma + «dalil» + matn; javobdan keyin ✓ yoki ✗ muhri) · tugmalar Joyida · Tuzatish kerak · xato bosilsa — izoh
- O'ng: fayl kartasi «AUDIT.md · Maydon» — № · Savol · Holat (holat ustuni bo'sh, javobdan keyin yozuv tushadi: joyida / tuzatish kerak)
- Savollar:
  1. So'raladigan har shaxsiy ma'lumot kerakmi? · kerakli minimum · dalil: bu MVP'da ism — egaga kim kelishini, telefon — kerak bo'lsa bog'lanishni beradi; boshqa ma'lumot so'ralmaydi · ✔ Joyida · xato izohi: Bu MVP'da ikkalasi ham ishlatiladi — dalilga qarang.
  2. Shaxsiy ma'lumotni kim ko'radi? · kim ko'radi · dalil: o'yinchi sahifasiga `GET /vaqtlar` soat va «band» beradi; `GET /bandlar` — `EgaGuard`, ega kirishi — parol va 6 xonali kod · ✔ Joyida · xato izohi: Ism va telefon ega sahifasida ko'rinadi — parol va kod ortida.
  3. Analitikaga ism yoki telefon ketadimi? · analitika · dalil: `hodisalar` — `band-qildi · 9e07… · B · 18:02`; Umami — «band-qildi» · ✔ Joyida · xato izohi: Hodisada nom, brauzer ID va vaqt bor — ism yo'q.
  4. SQL injection, XSS va kodda maxfiy kalit — yopiqmi? · zaiflik · dalil: telefon qidiruvi — parametrli so'rov · ism oddiy matn bo'lib chiqadi · `JWT_SECRET` bo'lmasa Backend ishga tushmaydi · ✔ Joyida · xato izohi: Uch zaiflik 5-darsda yopilgan — dalilga qarang.
  5. Ma'lumot qancha saqlanadi? · maqsad tugasa o'chirish · dalil: `backend/` da o'chiradigan kod yo'q; `bandlar` da sayt ochilgandan beri hamma band, `hodisalar` da ham hamma qator · ✔ Tuzatish kerak · xato izohi: O'chiradigan kod yo'q — eski bandlar turibdi.
  6. Foydalanuvchi ma'lumoti bilan nima bo'lishini saytda bilib oladimi? · ochiq aytish · dalil: forma ostida bitta gap — kim ko'rishi va nima uchunligi bor, qancha saqlanishi yo'q; alohida sahifa yo'q · ✔ Tuzatish kerak · xato izohi: Gapda qancha saqlanishi yozilmagan, sahifa ham yo'q.
- 6-savol javobidan keyin (`AUDIT.md` ostida): Odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa **maxfiylik siyosati** deyiladi. «Maydon»ning sodda siyosati to'rt savolga javob beradi.
  - Ochiq aytish — rozilikning o'zi emas. Qonunda (18-modda) rozilik ishlov berish shartlaridan biri; u kerak bo'lgan joyda alohida olinadi.
- 6/6 dan keyin: 5-qator yonida «Amaliyot 1», 6-qator yonida «Amaliyot 2»; tugagach 1–4 bitta qatorga yig'iladi: 1–4 · kerakli minimum · kim ko'radi · analitika · zaiflik · joyida
- Joriy qator: Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi **audit** deyiladi.
- Izoh: Bu darsda audit siyosatdagi gapni kod bilan ham solishtiradi.
- Xulosa: Bu misolda audit ikki savolda «tuzatish kerak» topdi: bandlar o'chirilmaydi, siyosat sahifasi yo'q.
- Tugma: Savollarni belgilang (N/6) → Davom etish

## 6 · Amaliyot 1
- Eyebrow: Amaliyot 1 · audit va o'chirish
- Sarlavha: Audit yozilsin, *eski bandlar o'chirilsin*.
- Mentor: Talab tayyor — siz qavs ichini to'ldirasiz; **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`.
  2. **Prompt** — qavs ichiga bandlar qachon o'chirilishini yozing (kunlarni orqaga surgan mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Siz → Antigravity · Nusxalash
     - Qayerda: repo ildizida yangi AUDIT.md; Backend'da bandlar va hodisalar jadvallari (backend/).
     - Nima qilsin: avval repo'ni olti savol bo'yicha tekshir va AUDIT.md ga jadval qilib yoz: savol · dalil («Maydon»da nima bor, fayl nomi bilan) · holat. Holat ustunini bo'sh qoldir — uni men yozaman.
     - Savollar: 1) so'raladigan har shaxsiy ma'lumot kerakmi; 2) shaxsiy ma'lumotni kim ko'radi; 3) analitikaga ism yoki telefon ketadimi; 4) SQL injection, XSS va kodda maxfiy kalit — yopiqmi; 5) ma'lumot qancha saqlanadi; 6) foydalanuvchi ma'lumoti bilan nima bo'lishini saytda bilib oladimi.
     - Keyin o'chirishni qo'sh: {qachon o'chirilsin} bandlar va 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda; o'chirish WHERE bilan; kun Toshkent vaqti bilan.
     - 5-savol dalili ostiga nima qo'shganingni yoz.
     - Nima buzilmasin: POST /bandlar, GET /vaqtlar, /ega (parol va 6 xonali kod), namuna bandlar, hodisalar va /dashboard. Yangi paket o'rnatma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (bosilsa ochiladi): «o'yin kunidan 30 kun o'tgan»
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi, xato yo'q; repo ildizida `AUDIT.md` paydo bo'ldi.
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     - (1) 2-savol: brauzerda `localhost:3000/bandlar` ni oching — ism va telefon emas, `401` chiqsin.
     - (2) 5-savol: Neon'dagi SQL Editor'da eski band qo'shing — bu test ma'lumoti, haqiqiy odamniki emas: `INSERT INTO bandlar (kun, soat, ism, telefon) VALUES ('2026-08-01', '18:00', 'tekshiruv', '+998 00 000 00 00');`
     - Backend terminalida Ctrl+C, keyin yana `npm run start:dev`. So'ng: `SELECT * FROM bandlar WHERE ism = 'tekshiruv';` — javob bo'sh, bitta ham qator yo'q.
     - O'yinchi sahifasida eng yaqin shanba 17:00 va 20:00 hali «band» — yangi bandlar joyida.
     - (3) `AUDIT.md` ni oching va Holat ustunini o'zingiz yozing: har dalilni o'qib — joyida, tuzatildi yoki tuzatish kerak. Dalilda fayl nomi bo'lmasa — agentdan qaysi faylga qarab yozganini so'rang.
     - Mos kelmagan joyni uch qism bilan agentga yozing.
     - Kichik qator: Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.
  5. **O'z g'oyangiz** — o'z MVP'ingiz uchun shu olti savolni belgilang: har biriga «joyida» yoki «tuzatish kerak». «Bajardim» oltitasi belgilangach ochiladi.
     - Forma: raqamli chiziq 1–6 (belgilangani ✓ yoki ✗) · karta «N. <savol>» · tugmalar joyida · tuzatish kerak (savollar — 5-ekrandagi olti savol)
- O'ng — kutilgan natija · namuna: Maydon:
  - «AUDIT.md · Maydon» — № · Savol · Dalil · Holat (yorliq «siz yozasiz»):
    - 1 · So'raladigan har shaxsiy ma'lumot kerakmi? · ism va telefon (`BandForma.jsx`) · joyida
    - 2 · Kim ko'radi? · ega sahifasi, parol va 6 xonali kod (`ega.guard.ts`) · joyida
    - 3 · Analitika · `hodisalar`, Umami — ism va telefon yo'q · joyida
    - 4 · Uch zaiflik · yopiq (5-dars) · joyida
    - 5 · Qancha saqlanadi? · o'chirish kodi: band — o'yin kunidan 30 kun o'tgach, hodisalar — 60 kundan keyin · ✓ tuzatildi
    - 6 · Saytda bilib oladimi? · sahifa yo'q · tuzatish kerak
  - Neon · SQL Editor — `SELECT * FROM bandlar WHERE ism = 'tekshiruv';` → javob bo'sh — bitta ham qator yo'q
  - `AUDIT.md` dagi fayl nomlari sizda boshqacha bo'lishi mumkin — dalil va holat muhim.
- Hammasi bajarilgach: Dalillar yozildi, holatni siz qo'ydingiz; eski band o'chdi, yangilari joyida.
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-06-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · Amaliyot 2
- Eyebrow: Amaliyot 2 · maxfiylik siyosati
- Sarlavha: O'yinchi siyosatni *formadan ochib o'qisin*.
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti; `AUDIT.md` da 6-savol — tuzatish kerak.
  2. **Prompt** — «Nima qilsin» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Siz → Antigravity · Nusxalash
     - Qayerda: saytda yangi /maxfiylik sahifasi va band qilish formasi ostidagi gap (web/); AUDIT.md dagi 6-savol.
     - Nima qilsin: {nima qilsin}
     - Nima buzilmasin: forma va POST /bandlar, /ega, /dashboard, hodisalar; /maxfiylik ochilganda hodisa yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (bosilsa ochiladi): «Nima qilsin: `/maxfiylik` to'rt savolga javob bersin — qaysi ma'lumot (ism va telefon; saytdagi harakatlar — ism va telefonsiz, brauzer ID bilan; Umami'ga ham ism va telefon ketmaydi), nima uchun (ega kim kelishini bilsin va kerak bo'lsa qo'ng'iroq qilsin), kim ko'radi (maydon egasi — parol va 6 xonali kod bilan; Database'ga sayt dasturchisi kira oladi), qancha saqlanadi (band — o'yin kunidan keyin 30 kun, harakatlar — 60 kun). Forma ostidagi gapga 30 kunni qo'sh, «faqat» so'zini olib tashla, yoniga «Maxfiylik siyosati» havolasini qo'y: u yangi oynada ochilsin — forma to'ldirilganicha qolsin. `AUDIT.md` da 6-savol dalilini yangila.»
  3. **Ishga tushirish** — sayt o'zi yangilandi, xato yo'q. Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing, `git commit -m "audit va maxfiylik"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).
  4. **Internetda tekshirish**:
     - Netlify manzilingizni oching va bo'sh katakni bosing: forma ostidagi gapda 30 kun bor, «Maxfiylik siyosati» yangi oynada ochiladi, forma esa to'ldirilganicha qoladi.
     - Manzilga `/maxfiylik` qo'shib ham oching — sahifa to'g'ridan ochilsin. Sinfdoshingiz telefonida havolani ochib, «qancha saqlanadi?» javobini topsin.
     - Hammasi joyida bo'lsa — `AUDIT.md` da 6-savol holatini o'zingiz «tuzatildi» qiling.
     - Netlify yangilanmasa — laptopda `localhost:5173` da tekshiring, push'ni mentor bilan ko'rasiz.
  5. **O'z g'oyangiz**:
     - o'z MVP'ingiz uchun to'rt savolga javob yozing: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi; «nima buzilmasin»ni ham o'zingiz yozasiz.
     - Javoblar qavslarga o'zi qo'yiladi; «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.
     - Forma: tugmalar qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi · nima buzilmasin (to'ldirilgani ✓) · «<savol>:» va javob maydoni · Keyingisi →
     - Javob bo'sh bo'lsa: Bu savolga javob yozing. · «qancha saqlanadi» da muddat bo'lmasa: Maqsad tugagach qachon o'chirilishini yozing.
     - Prompt (Siz → Antigravity (uyda) · Nusxalash / ✓ Nusxalandi):
       - Qayerda: saytda yangi «Maxfiylik siyosati» sahifasi va ma'lumot so'raladigan forma ostida havola.
       - Nima qilsin: sahifa to'rt savolga javob bersin — qaysi ma'lumot: {qaysi ma'lumot}; nima uchun: {nima uchun}; kim ko'radi: {kim ko'radi}; qancha saqlanadi: {qancha saqlanadi}.
       - Forma ostiga shu sahifaga havola qo'y — bosilganda forma to'ldirilganicha qolsin.
       - Nima buzilmasin: {nima buzilmasin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.
- O'ng — kutilgan natija · namuna: Maydon:
  - O'yinchi telefoni (tayyor holat, havola «Maxfiylik siyosati»); ostida yangi gap: Ismingiz va raqamingizni maydon egasi ko'radi: kerak bo'lsa, shu raqamga qo'ng'iroq qiladi. Boshqa o'yinchilar bu vaqtni «band» deb ko'radi. **Band o'yin kunidan keyin 30 kun saqlanadi, keyin o'chiriladi.**
  - Ochilgan sahifa — **Maydon · maxfiylik siyosati**:
    - **Qaysi ma'lumot?** Band qilganda — ism va telefon. Saytdagi harakatlar ham yoziladi: nima qilingani, qachon, qaysi tugma matni ko'rsatilgani va brauzer ID (tasodifiy harf va raqamlar). Ularda ism va telefon yo'q. Saytda Umami analitikasi ham ishlaydi — unga ham ism va telefon yuborilmaydi.
    - **Nima uchun?** Maydon egasi kim kelishini bilsin va kerak bo'lsa qo'ng'iroq qilsin.
    - **Kim ko'radi?** Maydon egasi — parol va 6 xonali kod bilan. Boshqa o'yinchilar vaqtni «band» deb ko'radi, ism va telefonni ko'rmaydi. Database'ga sayt dasturchisi kira oladi.
    - **Qancha saqlanadi?** Band o'yin kunidan keyin 30 kun saqlanadi, keyin avtomatik o'chiriladi. Saytdagi harakatlar 60 kun saqlanadi.
  - Izoh: Siyosatdagi har gap kodda bor: muddatlar — Amaliyot 1 dagi o'chirish, «kim ko'radi» — ega sahifasidagi himoya.
  - Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan.
- Hammasi bajarilgach: Siyosat saytda: o'yinchi formadan ochib, to'rt savolga javob topadi.
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-06-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 8 · 2-savol
- Eyebrow: Tekshiruv · siyosat va kod
- Savol: Siyosatda «30 kun» yozilgan, kod esa bandni o'chirmaydi. *Audit nima deydi*?
  - Joyida — siyosat sahifasi saytda turibdi
  - ✔ Tuzatish kerak — kod siyosatga mos emas
  - Joyida — o'yinchilar kodni ochib ko'rmaydi
  - Tuzatish kerak — 30 kun o'yinchiga juda kam
- Javob izohlari:
  - To'g'ri: Siyosatdagi gap kodda bajarilmayapti — buni tuzatish kerak.
  - A: Sahifa bor — lekin undagi gap kodda bajarilyaptimi?
  - C: Ko'rmasa ham, uning raqami 30 kundan keyin ham turadi.
  - D: Audit 30 kunni baholamaydi — siyosat va kodni solishtiradi.
  - Umumiy: Siyosatdagi gap bilan kod bir xilmi — shuni toping.

## 9 · Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Ostida (birinchi bosishgacha): Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Shaxsiy ma'lumot nima? | Odamni aniqlashga imkon beradigan ma'lumot | «Maydon»da — ism va telefon |
| «Maydon»da ism va telefon qayerda turadi? | bandlar jadvalida; ega sahifasida ko'rinadi | O'yinchi sahifasiga soat va «band» boradi |
| Hodisalar va Umami'ga ism yoki telefon ketadimi? | Yo'q | Hodisada — nom, brauzer ID, variant va vaqt |
| Sizib chiqish nima? | Ma'lumot ruxsatsiz begona qo'lga o'tishi | Masalan, ochiq qolgan ega sahifasi |
| Eski bandlar o'chirilmasa, begona nimani ko'radi? | Sayt ochilgandan beri hamma bandni | O'chirilgan qator ega sahifasida endi ko'rinmaydi |
| «Maydon» bandni qachon o'chiradi? | O'yin kunidan 30 kun o'tgach — avtomatik | Bu kursda tanlangan muddat; mahsulot egasi maqsadga mos belgilaydi |
| O'zbekistonda shaxsiy ma'lumot haqidagi qonun qanday ataladi? | «Shaxsga doir ma'lumotlar to'g'risida»gi Qonun | O'RQ-547, 2019-yil 1-oktabrdan kuchga kirgan |
| Qonunning 17 va 18-moddalarida nima bor? | 17 — maqsadga erishilganda yo'q qilish; 18 — ishlov berish shartlari, ular orasida rozilik | Dars yuridik maslahat bermaydi |
| GDPR nima? | Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan | Unda telefon raqami ham shaxsiy ma'lumot |
| Odam ma'lumotini ishonib berishi uchun qaysi uch fikr kerak? | Ochiq aytish, kerakli minimum, maqsad tugasa o'chirish | Ochiq aytish — rozilikning o'zi emas |
| Audit nima? | Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi | «Maydon»da — AUDIT.md, olti savol |
| Maxfiylik siyosati qaysi savollarga javob beradi? | Qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi | Inglizchasi — privacy policy |

- Tugmalar (kartada): ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Dars tugadi (yonida: n/2 to'g'ri)
- Sarlavha: Audit o'tdi, *maxfiylik siyosati saytda*.
- Asosiy fikr: Odam ma'lumotini ishonib berishi uchun kerakli minimumni yig'asiz, maqsad tugagach o'chirasiz va buni saytda ochiq aytasiz; audit siyosatda yozilganni kod bilan solishtiradi.
- Arena tugmasi: CODE STRIKE · (jonli darsda mentor boshlamaguncha) Mentorni kuting
- ✓ Endi siz bilasiz:
  - Shaxsiy ma'lumot — odamni aniqlashga imkon beradigan ma'lumot: «Maydon»da ism va telefon.
  - Eski bandni saqlamaslik sizib chiqsa ko'rinadigan ma'lumotni kamaytiradi.
  - Odam ma'lumotini ishonib berishi uchun: ochiq aytish, kerakli minimum, maqsad tugasa o'chirish.
  - Audit — ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi; u siyosatda yozilganni kod bilan solishtiradi.
  - «Maydon»ning sodda maxfiylik siyosati to'rt savolga javob beradi: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi.
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilganda karta ochiladi):
  - Uyda nima qilasiz?
  - kim uchun: o'z MVP'ingiz · nechta: audit va siyosat sahifasi · muddat: keyingi darsgacha
  - 1 · Audit varag'ingizdagi «tuzatish kerak» savollarini agentga talab qilib bering va `AUDIT.md` yozdiring.
  - 2 · Maxfiylik siyosati sahifasini qo'shing — to'rt javobingiz Amaliyot 2 dagi promptda.
  - 3 · Bitta sinfdoshingiz siyosatingizni ochib, «qancha saqlanadi?» javobini topsin.
  - Audit varag'ingiz (Amaliyot 1 da belgilangan bo'lsa): olti savol va har birining holati (joyida / tuzatish kerak)
  - Keyingi dars — **«Production deploy: domen, SSL, monitoring»**: sayt yiqilsa, ogohlantirish sizga keladi.
- Nishonlaringiz — n/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- Data Detective! — Shaxsiy ma'lumotni birinchi urinishda topdingiz (3-ekran, 1-savol)
- Auditor! — Audit varag'ida ikki «tuzatish kerak»ni birinchi urinishda topdingiz (5-ekran, 5 va 6-savol)
- Self Audit! — O'z MVP'ingiz uchun audit varag'ini belgiladingiz (6-ekran, 5-qadam)
- Policy Live! — Maxfiylik siyosati saytda: ikki amaliyotni oxirigacha bajardingiz (7-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Hisoblagich (yuqorida, bosilganda): Badges — N/4
- Yakun ekranida: Nishonlaringiz — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Shaxsiy ma'lumot»
   - 1 Shaxsiy ma'lumot — Shaxsiy ma'lumot — odamni aniqlashga imkon beradigan ma'lumot: ism, telefon.
   - 2 Qayerda turadi — «Maydon»da ular `bandlar` jadvalida turadi, ega sahifasida ko'rinadi.
   - 3 Maxfiy kod — 6 xonali kod maxfiy, lekin u odamni aniqlamaydi.
   - Sinfga savol: «Maydon»dagi qaysi yozuv bilan o'yinchini aniqlash mumkin?
2. 2-savol (8-ekran) — «Siyosat va kod»
   - 1 To'rt savol — «Maydon»ning sodda maxfiylik siyosati to'rt savolga javob beradi.
   - 2 Audit nima qiladi — Bu darsdagi audit siyosatdagi gapni kod bilan solishtiradi.
   - 3 Mos kelmasa — Siyosatda «30 kun» yozilgan, kod o'chirmasa — tuzatish kerak.
   - Sinfga savol: Siyosatdagi «30 kun»ni qanday tekshirasiz?

## Jonli viktorina (12 savol)
Savol vaqti 15 soniya. Arena oynasi sarlavhasi: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM
1. Shaxsiy ma'lumot nima?
   - ✔ Odamni aniqlashga imkon beradigan ma'lumot
   - Parol bilan yopilgan sahifadagi hamma yozuv
   - Database jadvaliga yozilgan har bir qator
   - Saytda eng ko'p bosiladigan tugmaning nomi
2. O'yinchi sahifasida band haqida nima ko'rinadi?
   - Band qilgan o'yinchining ismi va soat
   - ✔ Soat va «band» degan bitta yozuv
   - Band qilgan o'yinchining telefoni
   - Ism, telefon va band qilingan kun
3. GDPR qanday qoida?
   - O'zbekiston Respublikasi qonuni, 2019-yildan
   - «Maydon» saytining o'z ichki qoidasi
   - ✔ Yevropa Ittifoqi qoidasi, 2018-yildan
   - Umami analitikasining ichki qoidasi
4. «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunning 17-moddasi nima haqida?
   - Saytga 6 xonali kod bilan kirish tartibi haqida
   - Telefon raqamini to'g'ri yozish haqida
   - Saytga analitika ulash tartibi haqida
   - ✔ Maqsadga erishilgach yo'q qilish haqida
5. Sizib chiqish nima?
   - Ma'lumot Database'dan o'chib ketishi
   - ✔ Ma'lumot ruxsatsiz begona qo'lga o'tishi
   - Sayt Backend'dan javob ololmay qolishi
   - Band qilgan o'yinchi maydonga kelmasligi
6. Ega sahifasi begona qo'lida. Eski bandlar o'chirilmasa-chi?
   - ✔ Begona eng eski bandlarni ham ko'radi
   - Begona bugungi bandlarnigina ko'radi
   - Begona hech qanday bandni ko'rmaydi
   - Sahifa begonadan parolni qayta so'raydi
7. Amaliyotdan keyin «Maydon» bandni qancha saqlaydi?
   - Sayt ishlab turgan butun vaqt davomida
   - Band qilingan kunning oxirigacha
   - O'yinchi saytni yopib chiqquncha
   - ✔ O'yin kunidan 30 kun o'tguncha
8. Kerakli minimum nima degani?
   - Formani iloji boricha qisqa bezash
   - Ma'lumotni imkon qadar qisqa saqlash
   - ✔ Ish uchun keraklisinigina so'rash
   - Parolni eng kam belgidan tuzish
9. Audit nima?
   - ✔ Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi
   - Saytga yangi sahifa qo'shish uchun agentga talab
   - Database'dagi eski bandlarni o'chirib turadigan kod
   - Saytga kirgan brauzerlarni sanab turadigan sahifa
10. Qaysi biri maxfiylik siyosatidagi savol?
   - Sayt qaysi dasturlash tilida yozilgan?
   - Band qilish tugmasi qaysi rangda?
   - Futbol maydonchasi qayerda joylashgan?
   - ✔ Ma'lumot qancha vaqt saqlanadi?
11. Forma ostida siyosat havolasi turibdi. Bu qaysi fikr?
   - Kerakli minimum — kam narsa so'raladi
   - O'chirish — 30 kundan keyin yo'qoladi
   - ✔ Ochiq aytish — nima bo'lishi yozilgan
   - Audit — ro'yxat bo'yicha tekshiriladi
12. Siyosatdagi «30 kun»ni qanday tekshirasiz?
   - Agentdan «o'chiryapsanmi?» deb yana so'raysiz
   - ✔ Neon'da eski bandning o'chganini ko'rasiz
   - Siyosat matnini boshidan yana bir o'qiysiz
   - Kodni ochmasdan keyingi ishga o'tib ketasiz

Arena yozuvlari (umumiy shablon): ▶ Testni boshlash · Mentor testni boshlashini kuting… · O'quvchilar kutilmoqda… · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · Savol n/12 · Javob qabul qilindi — natijani kuting… · +N ball · Siz hozir: N-o'rin · Test yakunlandi!
Mustaqil (yakka) arenada: ▶ Boshlash · Keyingi → · Natijani ko'rish · (jonli dars tugab qolsa) Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish

## Kartochkalar
12 ta — jadval «10 · Kartochkalar» bo'limida.

## Yakun
Dars yakuni — «11 · Yakun» bo'limida. Keyingi dars: «Production deploy: domen, SSL, monitoring» — sayt yiqilsa, ogohlantirish sizga keladi.
