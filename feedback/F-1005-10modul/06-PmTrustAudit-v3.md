# 10-Modul (kod: `src/8-Modull`) · 6-dars (PM + amaliyot) «Foydalanuvchi sizga ma'lumotini ishonadimi?» — MD v3

Fayl: `src/8-Modull/PmTrustAuditLesson.jsx` (yangi) · kalit `m8-06` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; kartochkalar alohida — SABOQ 12; tayanch 4, PM+PRAKT) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yo'q edi — hamma ekran noldan. Eng yaqin namuna: `feedback/F-1005-9modul/08-PmDesignMotion-v3.md` va `08-FILTR.md` (tuzilish; matn ko'chirilmadi); izchillik — `01-PmOkr-v3.md`, `03-LiveDashboard-v3.md`.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran = **C** (`correctIdx 2`) · 8-ekran = **B** (`correctIdx 1`); arena A·B·C·D har biri 3 marta.
Vaqt: ≈ 85 daqiqa — PM qismi (0–5) ≈ 23 · Amaliyot 1 ≈ 25 (o'z g'oyasi qadami bilan) · Amaliyot 2 ≈ 25 (push va sinfdosh bilan tekshirish) · yakuniy savol, podium, yakun ≈ 12.
Tuzilma (tayanch 4, `MD_AGENT_TOPSHIRIQ.md`): PM nazariya 0–5 → A1 · A2 → yakuniy savol · podium · kartochkalar (alohida ekran — SABOQ 12) · yakun. Uyga vazifa — yakun kartasida, `.homework.jsx` yo'q.
Dastur v9 (6-dars): «Xavfsizlik — ishonch + audit: 20 daqiqa — ma'lumot sizib chiqishi; keyin audit + maxfiylik siyosati e'lon qilinadi» · natija — «Audit o'tilgan, siyosat saytda».
Menyu nomi (DE-205): App.jsx `m8-06` «Foydalanuvchi sizga ma'lumotini ishonadimi?» · osti «ma'lumot sizib chiqsa — audit va maxfiylik siyosati» ·
oldingi `m8-05` «Kiberxavfsizlik: zaiflikni topib yopamiz» · keyingi `m8-07` «Production deploy: domen, SSL, monitoring» (`00-NOMLAR.md`; App.jsx 8-blok, `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija (dastur v9, 6-dars; tayanch 3 `m10-dars-06-done`):** dars oxirida `maydon` repo'sida —
   - repo ildizida **`AUDIT.md`** — audit varag'idagi 6 savol bo'yicha jadval (savol · «Maydon»da nima bor · holat);
   - Backend o'yin kunidan **30 kun** o'tgan bandlarni o'chiradi (ishga tushganda va har 24 soatda);
   - saytda **`/maxfiylik`** sahifasi — «Maydon»ning sodda maxfiylik siyosati to'rt asosiy savolga javob beradi; band qilish formasi ostidagi gap yangilangan (30 kun qo'shilgan) va yonida havola «Maxfiylik siyosati» (yangi oynada ochiladi);
   - push qilingan: siyosat Netlify'da ochiladi (dastur: «siyosat e'lon qilinadi»).
   Teglar: `m10-dars-06-start` (= `m10-dars-05-done`) → `m10-dars-06-done`. Kodni agent (Antigravity) yozadi, talab va tekshiruv — o'quvchidan.
   Saqlanadi: **`pm-m8d6-audit`** (tayanch 8: `{ savollar: [{ savol, holat }] }`) — o'quvchining o'z MVP'i uchun audit varag'i (A1, 5-qadam); 8-dars o'qiydi.
2. **Bugungi asosiy fikr (P-013):** Odam ma'lumotini ishonib berishi uchun kerakli minimumni yig'asiz, maqsad tugagach o'chirasiz va buni saytda ochiq aytasiz; audit siyosatda yozilganni kod bilan solishtiradi.
   (Yakunda ScoreRing'dan keyin, `small` o'lchovda; kartochkaga qo'shilmaydi.)
3. **Uch asosiy fikr (tayanch 6):** **ochiq aytish** · **kerakli minimum** · **maqsad tugasa o'chirish**. Ochiq aytish rozilikning o'zi emas: qonunda (18-modda) rozilik — ishlov berish shartlaridan biri,
   u kerak bo'lgan joyda alohida olinadi (06-FILTR 1). Dars yuridik maslahat bermaydi.
   O'quvchi matnida ular audit savollarining kulrang yorliqlari (5-ekran) va yakunda bitta qator bo'lib chiqadi; umumiy nom («uch qoida») berilmaydi — «qoida» so'zi GDPR uchun ishlatiladi (T-015).
4. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **shaxsiy ma'lumot** — odamni aniqlashga imkon beradigan ma'lumot (ism, telefon). 2-ekran joriy qatori — o'quvchi ism va telefon qayerga borishini ko'rgandan keyin.
     Qonun nomi — so'zma-so'z: O'zbekistonning «Shaxsga doir ma'lumotlar to'g'risida»gi Qonuni; prozada — «shaxsiy ma'lumot».
   - **sizib chiqish** — ma'lumot ruxsatsiz begona qo'lga o'tishi. 4-ekran joriy qatori — begona eski bandlarni ko'rib chiqqandan keyin.
   - **maxfiylik siyosati** — odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa (`/maxfiylik`); «Maydon»ning sodda siyosati to'rt savolga javob beradi (06-FILTR 2: to'liq huquqiy tarkib emas). 5-ekran, 6-savol javobidan keyin. «privacy policy» — kartochkada bir marta.
   - **audit** — ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi; bu darsda siyosatdagi gaplar kod bilan mosligini ham tekshiradi; natija — `AUDIT.md`. 5-ekran joriy qatori, olti savol belgilangandan keyin.
   - **audit varag'i** — audit savollari ro'yxati (6 savol, bitta manba `AUDIT_SAVOLLAR`; Maydon'da ham, o'quvchi MVP'ida ham shu savollar).
5. **O'tilgan atamalar (tayanch 2, aynan):** sayt · Backend · Database · vaqt katagi · band qilish / band · o'yinchi · maydon egasi (qisqa — «ega») · hodisa (`ochdi` · `vaqt-tanladi` · `band-qildi`) ·
   brauzer ID (tasodifiy harf va raqamlar: bitta brauzerni ajratadi, odamning ismini ham, telefonini ham bildirmaydi) · talab (qayerda · nima qilsin · nima buzilmasin) · prompt · agent (Antigravity) ·
   **maxfiy kalit** (`JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI`) · **2FA** — ikki bosqichli kirish: parol + telefon ilovasidagi 6 xonali kod (5-dars) · **zaiflik · yopish** · SQL injection · XSS (5-dars) · token (4-Modul) · Umami (9-Modul 6-dars).
6. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«band»** — faqat band qilish ma'nosida. Audit ro'yxatining bo'laklari o'quvchi matnida **«savol»** (kod kaliti `bandlar` — faqat kodda, TAYANCHGA SAVOL 1).
     Test ekranlarining eyebrow'ida «savol» so'zi yo'q — «Tekshiruv · …».
   - **«holat»** — faqat `AUDIT.md` ustuni: **joyida** · **tuzatish kerak** · **tuzatildi**. Vaqt katagi haqida o'quvchi matnida «holat» yozilmaydi — «soat va «band»» (kod ichida `holat` — ha).
   - **«gap»** — forma ostidagi matn (repo `web/src/BandForma.jsx`, `.izoh`). «qator» — faqat jadval qatori va prompt qatori (03 bilan bir xil); «maydon» — faqat «Maydon» sayti va «maydon egasi» ma'nosida,
     forma qismlari «maydon» deb atalmaydi («forma ism va telefon so'raydi»).
   - **«joy»** — faqat ma'lumot turgan joy (2-ekran). Prompt ichidagi bo'sh joy — «qavs ichi» (9-Modul 8-dars shakli).
   - **«begona»** — ruxsatsiz odam; «buzilgan» o'rniga — «begona qo'lga o'tdi» (`00-TAQIQLAR.md` 3). «Hujum», «buzish» so'zlari yo'q.
   - **«qancha saqlanadi»** — siyosatning 4-savoli; «muddat» so'zi faqat uyga vazifa kartasida (standart) va O'qituvchi eslatmasida.
   - **«vaqt chizig'i»** ishlatilmaydi (tayanch: 10-dars atamasi) — 4-ekrandagi chiziq nomsiz, uchlarida «bugun» va «60 kun oldin».
   - **Ishlatilmaydi:** personal data · utechka · teshik · sir · hujum · buzilgan · faol foydalanuvchi · sessiya · baza · server (prozada).
7. **Mutlaq gaplar (T-020, tayanch 7.1):** «faqat», «har doim», «hech qachon» o'quvchi matnida yo'q. Istisno: repo'dagi forma gapi so'zma-so'z (olam ichidagi matn, T-008; 0-ekran maketida) va
   tayanchdagi majburiy gap «Bu tekshiruvni faqat o'z saytingizda qilasiz…» (A1). Yangilangan forma gapida «faqat» olinadi — Database'ga sayt dasturchisi ham kira oladi, siyosat bilan zid bo'lmasin (TAYANCHGA SAVOL 3).
8. **Metafora yo'q. Keyssiz** (tayanch 5: bankda ma'lumot sizib chiqishi haqida keys yo'q). Real kompaniya voqeasi va tashqi statistika yo'q. Sizib chiqish «Maydon» misolida — ega laptopida `/ega` ochiq qolgan holat (4-ekran).
   Ikkinchi olam faqat testda va arenada emas — bu darsda testlar ham «Maydon»da (ikkinchi olam kerak bo'lmadi).
9. **Xavfsizlik qoidasi (tayanch 3):** faqat himoya tomoni — ma'lumot qayerda turadi, begona qo'lga o'tsa nima ko'rinadi, qanday kamaytiriladi va qanday ochiq aytiladi. Hujum yo'riqlari, boshqa saytni tekshirish yo'q.
   Tekshiruvlar — faqat o'z saytida (`localhost`, o'z Netlify manzili, o'z Neon'i). Majburiy gap A1 da bir marta.
10. **Raqamlar:** Mentor raqamlari (tayanch 1) bu darsda kerak bo'lmadi. Dars raqamlari: **30 kun** (tayanch 3) · **6 xonali kod**, **12 soat** (token, repo `app.module.ts`) · **6 savol** · **4 savol** (siyosat).
   Qonun sanalari — faqat tayanch 6. 4-ekran maketidagi «60 kun oldin» — maket chegarasi, statistika emas (TAYANCHGA SAVOL 11). Namuna brauzer ID lar: 2-ekran `b41d…`, 5-ekran `9e07…` (tayanch 9.7).
11. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; maketlar chizilgan (CSS), logotip yo'q. Ism va telefon maketlarda **xira chiziq** bo'lib chiqadi — haqiqiy yoki o'ylab topilgan ism va raqam yozilmaydi
    (o'ylab topilgan odam yo'q — `00-TAQIQLAR.md` 2; repo namuna bandlaridagi ismlar ham ko'rsatilmaydi). O'yin qatlami (arena, nishon medali, podium) — mustasno.
12. **Kod yozish — Antigravity (9.1: `m8-06` — repo bloklari).** Prompt matni — agentga buyruq shaklida (T-002 istisnosi). Xato yo'li har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
    Talab zinapoyasi (tayanch 9.2): **A1 — tayyor talab + bitta joy** (`{qachon o'chirilsin}`) · **A2 — bitta qator** («Nima qilsin»). Har blokning 5-qadami — «O'z g'oyangiz».
13. **Xavfli buyruq (tayanch 9.6):** o'chirish kodi — `WHERE` bilan (`kun` bo'yicha), butun jadval tozalanmaydi. Tekshiruv uchun qo'shiladigan qator — `ism = 'tekshiruv'` (9.6 naqshi); o'quvchi qo'lda `DELETE` yozmaydi.

**Fakt-manbalar (o'quvchi matnida havola yo'q, faqat shu yerda):**
- **Qonun** — tayanch 6 (lex.uz/docs/4396419). 05.10 da sahifa ochilib solishtirildi: nomi «Shaxsga doir ma'lumotlar to'g'risida», O'RQ-547, qabul — 2019-yil 2-iyul, kuchga kirgan — 2019-yil 1-oktabr;
  4-modda — ta'rif («muayyan jismoniy shaxsga taalluqli bo'lgan yoki uni identifikatsiya qilish imkonini beradigan … axborot»); 17-modda — yo'q qilish (holatlar orasida: maqsadga erishilganda, rozilik qaytarib olinganda);
  18-modda — ishlov berish shartlari (asoslar orasida: odamning roziligi; boshqa asoslar ham bor — shuning uchun darsda «shartlardan biri»).
- **GDPR** — tayanch 6: Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan; telefon raqami ham shaxsiy ma'lumot. Qisqartma ochilishi — General Data Protection Regulation (T-036).
- **«Maydon» kodi** — repo `dars-11-done` (faqat o'qildi): `web/src/BandForma.jsx` (forma: ism, telefon; gap: «Ismingiz va raqamingizni faqat maydon egasi ko'radi: kerak bo'lsa, shu raqamga qo'ng'iroq qiladi.
  Boshqa o'yinchilar bu vaqtni «band» deb ko'radi.») · `web/src/Ega.jsx` (parol → token; kunlar ‹ › — o'tgan kunlar ham ochiladi; «Bu kunda band yo'q.»; «Chiqish») ·
  `backend/src/vaqtlar.controller.ts` (`GET /vaqtlar` — soat va holat, ism va telefon bormaydi) · `backend/src/bandlar.controller.ts` (`GET /bandlar` — `EgaGuard`; `kun` berilmasa hamma bandlar; o'chirish kodi yo'q) ·
  `backend/src/app.module.ts` (token 12 soat) · `.gitignore` (`.env`) · `App.jsx` (Umami: `data-umami-event`, `umami.track('band-qildi')` — ism va telefon yuborilmaydi).
- **5-dars yakuni** (tayanch 3, `m10-dars-05-done`): uch zaiflik yopilgan (telefon qidiruvi — parametrli so'rov · ism oddiy matn · `JWT_SECRET` zaxirasi olingan), ega kirishi — parol + 6 xonali kod.

## Darsning ipi va bitta vizual

- **Ip:** «Maydon» (tayanch 1). O'tgan darsda ega sahifasidagi uch zaiflik yopildi va ega kirishiga 6 xonali kod qo'shildi. Bugun — o'yinchining ism va telefoni:
  ular qayerda turadi (2) → begona qo'lga o'tsa nima ko'rinadi (4) → audit varag'i ikki kamchilikni topadi (5) → A1: `AUDIT.md` va 30 kunlik o'chirish → A2: `/maxfiylik` va forma ostidagi havola, push.
  O'quvchining o'z MVP'i — A1 5-qadamdagi audit varag'i va A2 5-qadamdagi to'rt javob; uyga vazifa shulardan.
- **Hook savoli** — o'quvchining o'z savoli (P-016): «Telefon raqamingizni bu formaga yozasizmi?» → forma ostidagi gap kim ko'rishini va nima uchunligini aytadi, **qancha saqlanishi** esa yozilmagan.
  Bu ochiq savol butun dars bo'yi qoladi va A2 da yopiladi (forma gapida — «band o'yin kunidan keyin 30 kun saqlanadi, keyin o'chiriladi»).
- **Bitta vizual — «Maydon: ism va telefon yo'li»** (`MalumotXarita`, dars bo'yi, 163/180; bitta manba `MAYDON_MALUMOT` + `NAMUNA_BANDLAR` + `AUDIT_SAVOLLAR`):
  - **O'yinchi telefoni** (telefon ramkasi, 191): «Maydon» · «Shanba · 18:00–19:00» · forma (Ism, Telefon — xira chiziq) · forma ostidagi gap · «Band qilish». Holatlar: forma → «Band qilindi: 18:00» va katak «18:00 · band».
  - **Backend** qutisi (`POST /bandlar`) → **`bandlar` jadvali** kartasi (`kun · soat · ism · telefon`; ism va telefon xira) → **ega sahifasi** (brauzer ramkasi `maydon-….netlify.app/ega`: «Maydon · ega» · «‹ Shanba ›» · «Shanba · bandlar» ro'yxati «18:00 · ism · telefon», xira).
  - Yon tarmoq: **`hodisalar` jadvali** (`nom · brauzer_id · variant · yaratilgan`) va **Umami** qutisi (yorliq: «Umami — analitika»).
  - Qatlamlar (o'sha komponent): tugun ustida yorliq «ism va telefon bor» (accent) / «ism va telefon yo'q» (kulrang) — 2-ekran · ega sahifasi ustida «begona» belgisi (chizilgan ko'z, emoji emas) va ostida kunlar chizig'i — 4-ekran ·
    `bandlar` jadvalida 30 kundan eski qatorlar kulrang «o'chirildi» — 4-ekran 2-bosqich · tugunlar ustida audit belgilari ✓ / ✗ — 5-ekran dalillari · forma ostida havola «Maxfiylik siyosati» va `/maxfiylik` sahifasi — 1, A2, yakun.
  - Ishlatiladi: 0 (faqat o'yinchi telefoni, forma) · 1 (tayyor holat) · 2 (to'liq xarita) · 4 (ega sahifasi + `bandlar`) · 5 (dalillar — xaritaning bo'laklari) · 6, 7 (o'ng — kutilgan natija). `prefers-reduced-motion` da konvert va chiziq harakatsiz, holat birdan.
- **Yakun:** audit o'tdi, siyosat saytda · keyingi dars — «Production deploy: domen, SSL, monitoring».

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · ishonch
- Sarlavha: **Telefon raqamingizni bu formaga yozasizmi?** (42)
- Mentor: Siz shanba kuni o'ynamoqchisiz va «Maydon»da 18:00 ni tanladingiz. Ikki javobdan birini tanlang.
- Maket (chap): o'yinchi telefoni — «Maydon» · «Shanba · 18:00–19:00» · forma: Ism (bo'sh) · Telefon (bo'sh, «Masalan: +998 90 123 45 67») · forma ostidagi gap (repo'dan so'zma-so'z):
  «Ismingiz va raqamingizni faqat maydon egasi ko'radi: kerak bo'lsa, shu raqamga qo'ng'iroq qiladi. Boshqa o'yinchilar bu vaqtni «band» deb ko'radi.» · «Band qilish».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Ha — egasi qo'ng'iroq qilishi uchun kerak (41)
  - Avval raqamim qayerga borishini bilaman (39)
- Javob — 2-variant: **Aynan!** Forma ostidagi gap kim ko'rishini va nima uchun kerakligini aytadi. Qancha saqlanishi esa yozilmagan. (108)
- Javob — 1-variant: **Qiziq fikr!** Raqam qo'ng'iroq uchun kerak — forma ostida shunday yozilgan. Qancha saqlanishi esa yozilmagan. (107)
- **Harakat → Vizual o'zgarish:** variantni tanlash → forma yonida uchta savol-yorliq birin-ketin chiqadi va forma ostidagi gapga chiziq bilan ulanadi:
  «Kim ko'radi?» ✓ (gapning birinchi bo'lagi accent) · «Nima uchun?» ✓ (gapning «qo'ng'iroq qiladi» bo'lagi accent) · «Qancha saqlanadi?» — uzuq chiziqli bo'sh joy va «?» (U-041: keyin to'ldiriladigan joy).
  Ikkala tanlovda vizual bir xil — payoff hech bir javobni rad etmaydi (KORPUS 119).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: Sinfdan so'rang: «Notanish saytga raqam yozishdan oldin nimaga qaraysiz?» Javoblarni taxtaga yozib qo'ying — ular keyin audit savollariga o'xshab chiqadi.
✎ Hook — o'quvchi o'zi kecha qilgan ish (saytga raqam yozish) va o'z savoli (P-016). Ikkala variant teng uzunlikda; javob matnlarining ikkinchi gapi bir xil — yangi narsa ikkalasiga ham bir xil qo'shiladi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Dars oxirida «Maydon» nima saqlashini ochiq aytadi.** (51)
- Mentor: O'tgan darsda ega sahifasidagi uch zaiflik yopildi, bugun — o'yinchi ma'lumoti. «Maydon» — namuna: har amaliyot oxirida shu ishni o'z MVP'ingizda qilasiz.
- Chap — kulrang yorliq (App.jsx osti, so'zma-so'z — P-015): «ma'lumot sizib chiqsa — audit va maxfiylik siyosati»; ostida o'yinchi telefoni **tayyor** holatda, bir marta o'zi yuradi (DE-200):
  forma ostidagi gap kulrang chiziqlar bilan (matnsiz — 30 kun 4-ekran kashfiyoti, P-015) va havola «Maxfiylik siyosati» → havola bosiladi → yonida `/maxfiylik` sahifasi ochiladi: to'rtta sarlavha-chizig'i (matnsiz) ·
  pastda `AUDIT.md` fayl belgisi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Ism va telefon qayerga borishini topasiz · `shaxsiy ma'lumot`
  - 02 · Begona qo'lga o'tsa, nima ko'rinishini ko'rasiz · `sizib chiqish`
  - 03 · «Maydon»ni olti savol bo'yicha tekshirasiz · `audit`
  - 04 · O'yinchi o'qiydigan sahifani saytga qo'shasiz · `maxfiylik siyosati`
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `m10-dars-06-start` · namuna `m10-dars-06-done`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); atamalar — kulrang teglarda (P-015 «qiyin atama kulrang yorliqqa»). Mentorning birinchi gapi — 5-dars bilan ko'prik (P-020).

## 2 · Ism va telefon yo'li  ← QTushuncha
- Eyebrow: Tushuncha · ism va telefon yo'li
- Sarlavha: **Ism va telefon «Maydon»da qayerga boradi?** (41)
- Mentor: O'yinchi bo'lib «Band qilish»ni bosing va ism bilan telefon qayerda paydo bo'lishini kuzating.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»): **Yuborilgan ism va telefon nechta joyda saqlanadi?** · Bitta · Ikkita · To'rtta — tanlov saqlanadi. (06-FILTR 3: saqlash va ko'rsatish — har xil)
- Chap (harakat): o'yinchi telefoni — forma to'ldirilgan (ism va telefon — xira chiziq), «Band qilish» bosiladigan.
- O'ng (vizual): xarita — Backend · `bandlar` jadvali · ega sahifasi · `hodisalar` jadvali · Umami (hammasi bo'sh, kulrang).
- **Harakat → Vizual o'zgarish:**
  1. «Band qilish» → telefondan Backend'ga konvert `POST /bandlar` (`kun · soat · ism · telefon`) → `bandlar` jadvaliga yangi qator ajralib kiradi `2026-10-10 · 18:00 · ▒▒▒ · ▒▒▒` →
     ega sahifasidagi «Shanba · bandlar» ro'yxatida yangi qator «18:00 · ▒▒▒ · ▒▒▒». Shu paytda telefonda «Band qilindi: 18:00», katak «18:00 · band»;
     yon tarmoqda `hodisalar` ga `band-qildi · b41d… · A · 18:02`, Umami qutisiga «band-qildi» kiradi.
  2. Shundan keyin beshta joy bosiladigan bo'ladi (doimiy «›», bosilgach ✓ — U-013; tugma hisoblagichi N/5). Bosilgan joy ostida bitta qator chiqadi:
     - O'yinchi sahifasi — «18:00 · band» · kulrang yorliq: ism va telefon yo'q
     - `bandlar` jadvali — `kun · soat · ism · telefon` · accent yorliq: **saqlanadi**
     - Ega sahifasi — «18:00 · ism · telefon» · accent-och yorliq: **ko'rsatiladi** — alohida nusxa yo'q, `bandlar` dan o'qiydi (parol va 6 xonali kod bilan)
     - `hodisalar` jadvali — `band-qildi · b41d… · A · 18:02` · kulrang yorliq: ism va telefon yo'q
     - Umami — «band-qildi» · kulrang yorliq: ism va telefon yo'q
  Holat o'quvchi bosgan joylardan chiziladi (P-046).
- Joriy qator (5/5 dan keyin, bitta): Ism va telefon odamni aniqlashga imkon beradi: bunday ma'lumot shaxsiy ma'lumot deyiladi. (89)
- Izoh-qator (`QIzoh`, kulrang, joriy qator ostida): GDPR (General Data Protection Regulation) — Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan: unda telefon raqami ham shaxsiy ma'lumot.
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: bitta — `bandlar` jadvali; ega sahifasi uni ko'rsatadi, o'zida saqlamaydi» ✎ (06.10, A-7, F-1005-190) yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda ism va telefon `bandlar` da saqlanadi, ega sahifasida ko'rinadi, analitikaga ketmaydi. (97)
- Tugma (pastki): Band qiling → Joylarni oching (N/5) → Davom etish · `tugadi`: telefon va harakat paneli yopiladi, xarita butun enga, ikki accent tugun fokusda (199); vizual ⛶ ichida (q17).
- O'qituvchi eslatmasi: «Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» darsida yopiq ma'lumot o'tilgan: begona ko'rsa, egasi zarar ko'radigan ma'lumot. Telefon raqami — ham yopiq, ham shaxsiy ma'lumot.
  Brauzer ID haqida «shaxsiy ma'lumot emas» demang: u ism va telefonni bildirmaydi, lekin ba'zi qoidalarda brauzerni ajratadigan raqamlar ham shaxsiy ma'lumot bo'lishi mumkin — bu dars buni hal qilmaydi.
✎ «Backend» joy sifatida sanalmaydi: u ism va telefonni Database'ga uzatadi, o'zida saqlamaydi va ko'rsatmaydi (bashorat savolidagi «saqlanadi yoki ko'rinadi» sharti). Bashorat 1 · 2 · 4 — o'sish tartibida (S-015).

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · shaxsiy ma'lumot
- Savol: **«Maydon»dagi qaysi yozuv shaxsiy ma'lumot?** (5 so'z)
  - A · `band-qildi` hodisasining nomi (30)
  - B · Ega telefonidagi 6 xonali kod (29)
  - ✔ C · Band qilganning telefon raqami (30)
  - D · Katakdagi «18:00 · band» yozuvi (31)
- To'g'ri izohi: Raqam orqali odamni aniqlab, unga qo'ng'iroq qilsa bo'ladi. (59)
- Xato izohlari (≤60):
  - A — Hodisa nomi hamma o'yinchida bir xil — kimligini aytmaydi. (58)
  - B — Kod maxfiy, lekin u odamni aniqlamaydi. (39)
  - D — «band» yozuvini hamma ko'radi — unda kim band qilgani yo'q. (59)
  - (umumiy) Qaysi yozuv bilan odamni aniqlash mumkin? (41)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): «telefon» B va C da (S-003 — kalit so'z faqat to'g'rida emas); B — «maxfiy = shaxsiy» yanglishi, A — «Database'da turgani = shaxsiy», D — «band haqidagi yozuv = shaxsiy» (S-004).
  Har uchala noto'g'ri yozuv «Maydon»da haqiqatan bor (2-ekran va 5-darsdan) — distraktor yolg'on fakt emas. Brauzer ID variantlarga qo'yilmadi (2-ekran O'qituvchi eslatmasi).

## 4 · Sizib chiqish  ← QTushuncha
- Eyebrow: Tushuncha · sizib chiqish
- Sarlavha: **Ega sahifasi ochiq qolsa, begona nimani ko'radi?** (46) — 06-FILTR 12
- Mentor: Ega laptopini yopmay ketdi, unda `/ega` ochiq — begona nimani ko'rishini bilish uchun kunlarni orqaga suring.
- Bashorat (ballsiz, 181): **Begona odam qaysi bandlarni ko'ra oladi?** · Bugungi bandlarni · Oxirgi haftadagi bandlarni · Sayt ochilgandan beri hammasini — tanlov saqlanadi.
- Chap (harakat): surgich «Kunlarni orqaga suring» (0 → 60 kun oldin); ostida kichik izoh: «Sahifada ‹ har bosilganda bir kun orqaga — surgich shuni tezlashtiradi.»
- O'ng (vizual): ega sahifasi (brauzer ramkasi `maydon-….netlify.app/ega`, burchakda chizilgan «begona» belgisi): «Maydon · ega» · kun «‹ Bugun ›» · ro'yxat «16:00 · ▒▒▒ · ▒▒▒», «19:00 · ▒▒▒ · ▒▒▒» (xira).
  Ostida chiziq: o'ng uchida «bugun», chap uchida «60 kun oldin».
- **Harakat → Vizual o'zgarish:**
  1. Surgich surilganda ega sahifasida kun almashadi (kun nomi va kichik kulrang «N kun oldin»), ro'yxatda o'sha kunning bandlari (ism va telefon — xira) ko'rinadi; chiziqda o'tilgan qism accent rangga kiradi.
     30 kundan ham, 60 kundan ham oldingi kunlarda bandlar ko'rinaveradi — to'xtatadigan narsa yo'q. Surgich chap uchiga yetganda 1-bosqich tugaydi.
  2. 2-bosqich (shu ekranda): kalit (switch) **«O'yin kunidan 30 kun o'tgan bandlar o'chirilsin»** → chiziqda 30 kundan eski qism kulrang bo'ladi, ustida yorliq «o'chirildi»;
     `bandlar` jadvali kartasi (ega sahifasi ostida, kichik) — eski qatorlar kulrang bo'lib so'nadi. Surgich yana surilsa: 30 kungacha bandlar ko'rinadi, undan oldingi kunlarda — «Bu kunda band yo'q.» (repo `Ega.jsx` matni).
- Natija qatori (`QTaxmin`, 1-bosqichdan keyin): «Taxminingiz: … · haqiqatda: hammasini — eski bandlar o'chirilmaydi» yoki «Taxminingiz to'g'ri chiqdi».
- Joriy qator (1-bosqichdan keyin, bitta): Ma'lumot ruxsatsiz begona qo'lga o'tishi sizib chiqish deyiladi. (64)
- Izoh-qator (`QIzoh`, 2-bosqichdan keyin): O'zbekistonning «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunida (17-modda): maqsadga erishilganda ma'lumot yo'q qilinadi.
- Xulosa: Bu misolda eski bandni saqlamaslik sizib chiqsa ko'rinadigan ma'lumotni kamaytiradi. (84)
- Qator (`QIzoh`, xulosadan keyin): `bandlar` dan o'chirilgan qator ega sahifasida endi ko'rinmaydi. (66)
- Tugma (pastki): Kunlarni suring → O'chirishni yoqing → Davom etish · `tugadi`: surgich va kalit yopiladi, ega sahifasi va chiziq butun enga, kulrang «o'chirildi» qismi fokusda (199); vizual ⛶ ichida.
- O'qituvchi eslatmasi: 30 kun — bu kursda «Maydon» uchun tanlangan muddat, qonun talabi emas; real mahsulotda muddat aniq ehtiyoj bilan asoslanadi. Sinfdan so'rang: «Ma'lumot qachongacha kerak?»
  Mahsulot egasi muddatni maqsadga mos belgilaydi va siyosatda ochiq yozadi;
  bu dars yuridik maslahat bermaydi. Begona qo'lga o'tishning yana bir yo'li — parol: 5-darsdagi 6 xonali kod parolning o'zi yetmasligi uchun qo'yilgan.
  Ega token bilan 12 soat ishlaydi; «Chiqish» bosilsa, sahifa yana parol so'raydi. «Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» darsidagi qoida: yuborilmagan ma'lumot sizib ketmaydi — bugun unga saqlanmagan ma'lumot qo'shiladi.
✎ Sizib chiqish — himoya tomonidan: begona hech narsa «qilmaydi», ochiq qolgan sahifani ko'radi, xolos (tayanch 3; hujum yo'rig'i yo'q). «Bugun 30 kun» bashoratda yo'q — u 2-bosqichda tug'iladi (P-036).
  Bashorat variantlari — bitta o'lchovning uch darajasi, o'sish tartibida (S-015). Holat surgich qiymatidan chiziladi (P-046).

## 5 · Audit varag'i  ← QTushuncha (qadamlar — P-055)
- Eyebrow: Tushuncha · audit varag'i
- Sarlavha: **«Maydon»ning qaysi joyini tuzatish kerak?** (41)
- Mentor: Har savolga «Maydon» kodidan dalil ochiladi — unga qarab «Joyida» yoki «Tuzatish kerak»ni bosing.
- Bashorat yo'q: ekran faol qarordan iborat, kuzatuv ekrani emas (P-064 faqat «Keyingi» bosiladigan ekranga).
- Chap (harakat, P-055): savollar ro'yxati — raqam + qisqa nom (o'tilgani ✓ yashil yoki ✗ qizil-och, joriysi accent); o'ngroqda **joriy savol kartasi**: savol · kulrang yorliq · dalil (xaritaning bo'lagi yoki 1–2 qator kod) ·
  ikki tugma «Joyida» / «Tuzatish kerak» (`QChip`, xato bosilsa `silk` + `QXato`, qayta tanlash mumkin — ballsiz).
- O'ng (vizual): **`AUDIT.md`** fayl kartasi (mono sarlavha «AUDIT.md · Maydon») — jadval: № · Savol · Holat; holat ustuni bo'sh (uzuq chiziq, U-041), har javobdan keyin unga yozuv tushadi («joyida» — yashil fon, «tuzatish kerak» — qizil-och fon).
- **Savollar (`AUDIT_SAVOLLAR`, bitta manba; A1 promptida, A1 5-qadamida va 8-darsda ham shu matn):**
  1. **So'raladigan har shaxsiy ma'lumot kerakmi?** · yorliq `kerakli minimum` · dalil: bu MVP'da ism — egaga kim kelishini, telefon — kerak bo'lsa bog'lanishni beradi; boshqa ma'lumot so'ralmaydi ✎ (06.10, A-6: «maydon» faqat «Maydon» sayti) · ✔ Joyida
     · xato izohi (Tuzatish kerak bosilsa): Bu MVP'da ikkalasi ham ishlatiladi — dalilga qarang. (55)
  2. **Shaxsiy ma'lumotni kim ko'radi?** · yorliq `kim ko'radi` · dalil: o'yinchi sahifasiga `GET /vaqtlar` soat va «band» beradi; `GET /bandlar` — `EgaGuard`, ega kirishi — parol va 6 xonali kod · ✔ Joyida
     · xato izohi: Ism va telefon ega sahifasida ko'rinadi — parol va kod ortida. (59)
  3. **Analitikaga ism yoki telefon ketadimi?** · yorliq `analitika` · dalil: `hodisalar` — `band-qildi · 9e07… · B · 18:02`; Umami — «band-qildi» · ✔ Joyida
     · xato izohi: Hodisada nom, brauzer ID va vaqt bor — ism yo'q. (48)
  4. **SQL injection, XSS va kodda maxfiy kalit — yopiqmi?** · yorliq `zaiflik` · dalil: telefon qidiruvi — parametrli so'rov · ism oddiy matn bo'lib chiqadi · `JWT_SECRET` bo'lmasa Backend ishga tushmaydi · ✔ Joyida
     · xato izohi: Uch zaiflik 5-darsda yopilgan — dalilga qarang. (47)
  5. **Ma'lumot qancha saqlanadi?** · yorliq `maqsad tugasa o'chirish` · dalil: `backend/` da o'chiradigan kod yo'q; `bandlar` da sayt ochilgandan beri hamma band, `hodisalar` da ham hamma qator (chiziq — 4-ekrandagidek, muddatsiz) · ✔ Tuzatish kerak
     · xato izohi (Joyida bosilsa): O'chiradigan kod yo'q — eski bandlar turibdi. (45)
  6. **Foydalanuvchi ma'lumoti bilan nima bo'lishini saytda bilib oladimi?** · yorliq `ochiq aytish` · dalil: forma ostida bitta gap — kim ko'rishi va nima uchunligi bor, qancha saqlanishi yo'q; alohida sahifa yo'q · ✔ Tuzatish kerak
     · xato izohi: Gapda qancha saqlanishi yozilmagan, sahifa ham yo'q. (52)
     6-savol javobidan keyin karta ichida (accent, bitta qator): Odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa maxfiylik siyosati deyiladi. «Maydon»ning sodda siyosati to'rt savolga javob beradi.
     Ostida kulrang izoh: Ochiq aytish — rozilikning o'zi emas. Qonunda (18-modda) rozilik ishlov berish shartlaridan biri; u kerak bo'lgan joyda alohida olinadi.
- **Harakat → Vizual o'zgarish:** tugma bosiladi → `AUDIT.md` ning shu qatoriga holat yoziladi, xaritaning tegishli tugunida ✓ yoki ✗ yonadi, ro'yxatda keyingi savol accent bo'ladi.
  6/6 dan keyin: 5 va 6-qator yonida kichik yorliq «Amaliyot 1» va «Amaliyot 2» (qaysi blok tuzatishi).
- Joriy qator (6/6 dan keyin, bitta): Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi audit deyiladi. (67)
  Ostida kulrang: Bu darsda audit siyosatdagi gapni kod bilan ham solishtiradi. (61)
- Xulosa: Bu misolda audit ikki savolda «tuzatish kerak» topdi: bandlar o'chirilmaydi, siyosat sahifasi yo'q. (99)
- Tugma (pastki): Savollarni belgilang (N/6) → Davom etish · `tugadi`: savol kartasi yopiladi, `AUDIT.md` butun enga, 5 va 6-qator fokusda (199); vizual ⛶ ichida.
- O'qituvchi eslatmasi: Audit savollarini o'quvchi har loyihada qayta ishlatadi — A1 da o'z MVP'i uchun belgilaydi. Yorliqlardagi uch fikr — ochiq aytish, kerakli minimum, maqsad tugasa o'chirish — siyosatda yoziladi. Olti savol — kurs varag'i, to'liq huquqiy audit emas.
  Sinfdan so'rang: «4-savol nega maxfiylik ro'yxatida turibdi?» (javob: zaiflik yopiq bo'lmasa, ism va telefon begona qo'lga o'tishi mumkin).
- Nishon: Auditor (5 va 6-savolda birinchi urinishda «Tuzatish kerak»).
✎ Ikki atama bir ekranda, lekin har biri o'z lahzasida: «maxfiylik siyosati» — 6-savol javobidan keyin (karta ichida), «audit» — 6/6 dan keyin (joriy qator). Miqdor (6) faqat ro'yxatda va hisoblagichda (P-062).

## 6 · Amaliyot 1 — audit va eski bandlar  ← amaliyot bloki (QBlok, ≈25 daq — o'z g'oyasi qadami bilan)
- Eyebrow: Amaliyot 1 · audit va o'chirish
- Sarlavha: **Audit yozilsin, eski bandlar o'chirilsin.** (41)
- Mentor: Talab tayyor — siz qavs ichini to'ldirasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`.
  2. **Prompt** — qavs ichiga bandlar qachon o'chirilishini yozing (kunlarni orqaga surgan mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: repo ildizida yangi `AUDIT.md`; Backend'da `bandlar` va `hodisalar` jadvallari (`backend/`).
     > Nima qilsin: avval repo'ni olti savol bo'yicha tekshir va `AUDIT.md` ga jadval qilib yoz: savol · dalil («Maydon»da nima bor, fayl nomi bilan) · holat. Holat ustunini bo'sh qoldir — uni men yozaman.
     > Savollar: 1) so'raladigan har shaxsiy ma'lumot kerakmi; 2) shaxsiy ma'lumotni kim ko'radi; 3) analitikaga ism yoki telefon ketadimi; 4) SQL injection, XSS va kodda maxfiy kalit — yopiqmi;
     > 5) ma'lumot qancha saqlanadi; 6) foydalanuvchi ma'lumoti bilan nima bo'lishini saytda bilib oladimi.
     > Keyin o'chirishni qo'sh: **{qachon o'chirilsin}** bandlar va 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda; o'chirish `WHERE` bilan; kun Toshkent vaqti bilan.
     > 5-savol dalili ostiga nima qo'shganingni yoz.
     > Nima buzilmasin: `POST /bandlar`, `GET /vaqtlar`, `/ega` (parol va 6 xonali kod), namuna bandlar, hodisalar va `/dashboard`. Yangi paket o'rnatma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — namuna): «o'yin kunidan 30 kun o'tgan»
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi, xato yo'q; repo ildizida `AUDIT.md` paydo bo'ldi. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     (1) 2-savol: brauzerda `localhost:3000/bandlar` ni oching — ism va telefon emas, `401` chiqsin.
     (2) 5-savol: Neon'dagi SQL Editor'da eski band qo'shing — bu test ma'lumoti, haqiqiy odamniki emas:
         `INSERT INTO bandlar (kun, soat, ism, telefon) VALUES ('2026-08-01', '18:00', 'tekshiruv', '+998 00 000 00 00');`
         Backend terminalida Ctrl+C, keyin yana `npm run start:dev`. So'ng: `SELECT * FROM bandlar WHERE ism = 'tekshiruv';` — javob bo'sh, bitta ham qator yo'q.
         O'yinchi sahifasida eng yaqin shanba 17:00 va 20:00 hali «band» — yangi bandlar joyida.
     (3) `AUDIT.md` ni oching va Holat ustunini o'zingiz yozing: har dalilni o'qib — joyida, tuzatildi yoki tuzatish kerak. Dalilda fayl nomi bo'lmasa — agentdan qaysi faylga qarab yozganini so'rang.
     Mos kelmagan joyni uch qism bilan agentga yozing.
     Kichik qator (kulrang, qadam ostida): Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.
  5. **O'z g'oyangiz** — o'z MVP'ingiz uchun shu olti savolni belgilang: har biriga «joyida» yoki «tuzatish kerak». «Bajardim» oltitasi belgilangach ochiladi.
     (Forma: savollar `AUDIT_SAVOLLAR` dan, «Maydon» dalillarisiz; har qatorda ikki chip. Saqlanadi — `pm-m8d6-audit`; yakundagi uyga vazifa «tuzatish kerak» savollarini ko'rsatadi.)
- O'ng tomon — «kutilgan natija · namuna: Maydon»:
  - `AUDIT.md` fayl kartasi (ustunlar: Savol · Dalil · Holat; Holat ustuni ustida kichik yorliq «siz yozasiz»): 1 · So'raladigan har shaxsiy ma'lumot kerakmi? · ism va telefon (`BandForma.jsx`) · joyida ·
    2 · Kim ko'radi? · ega sahifasi, parol va 6 xonali kod (`ega.guard.ts`) · joyida · 3 · Analitika · `hodisalar`, Umami — ism va telefon yo'q · joyida ·
    4 · Uch zaiflik · yopiq (5-dars) · joyida · 5 · Qancha saqlanadi? · o'chirish kodi: band — o'yin kunidan 30 kun o'tgach, hodisalar — 60 kundan keyin · **tuzatildi** · 6 · Saytda bilib oladimi? · sahifa yo'q · **tuzatish kerak**
  - ostida karta «Neon · SQL Editor»: `SELECT * FROM bandlar WHERE ism = 'tekshiruv';` → bo'sh
  - kichik izoh: `AUDIT.md` dagi fayl nomlari sizda boshqacha bo'lishi mumkin — dalil va holat muhim.
- Hammasi bajarilgach (yashil): Dalillar yozildi, holatni siz qo'ydingiz; eski band o'chdi, yangilari joyida. (77)
- O'qituvchi eslatmasi: Holatni agent emas, o'quvchi qo'yadi — agent dalil topadi, qarorni odam qiladi. Backend uxlab qolsa (Render), o'chirish keyingi ishga tushishda bajariladi —
  shuning uchun siyosatda «30 kun saqlanadi, keyin o'chiriladi» deyiladi, aniq soat aytilmaydi.
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-06-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- Nishon: Self Audit (5-qadam, olti savol belgilandi).
- Izoh (MD): `{qachon o'chirilsin}` — 4-ekrandagi kalit matni («o'yin kunidan 30 kun o'tgan»); 03 dagi `{qanday sanasin}` naqshi (bitta joy — o'tilgan qoida).
  `'2026-08-01'` — dars qaysi oyda o'tsa ham 30 kundan eski sana (dastur: 11–12-oy). Tekshiruv qatori o'chirish kodining o'zi bilan o'chadi — o'quvchi `DELETE` yozmaydi (9.6).
  60 kun — hodisalar uchun (06-FILTR 4; 05.10 GATE M 06-q0 A — tasdiqlandi): 1-dars oy maqsadi va o'tgan oy, 8-dars A/B yakuni sig'adi; o'quvchi slotida emas (bitta slot — o'tilgan qoida).
  Holat ustuni o'quvchida (06-FILTR 6): agent dalil topadi, qarorni o'quvchi qiladi.
  Push bu blokda yo'q — A2 da bitta push (Render ham, Netlify ham shundan yangilanadi).

## 7 · Amaliyot 2 — maxfiylik siyosati  ← amaliyot bloki (QBlok, ≈25 daq)
- Eyebrow: Amaliyot 2 · maxfiylik siyosati
- Sarlavha: **O'yinchi siyosatni formadan ochib o'qisin.** (42)
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti; `AUDIT.md` da 6-savol — tuzatish kerak.
  2. **Prompt** — «Nima qilsin» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytda yangi `/maxfiylik` sahifasi va band qilish formasi ostidagi gap (`web/`); `AUDIT.md` dagi 6-savol.
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: forma va `POST /bandlar`, `/ega`, `/dashboard`, hodisalar; `/maxfiylik` ochilganda hodisa yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — namuna qator): «Nima qilsin: `/maxfiylik` to'rt savolga javob bersin — qaysi ma'lumot (ism va telefon; saytdagi harakatlar — ism va telefonsiz, brauzer ID bilan; Umami'ga ham ism va telefon ketmaydi),
     nima uchun (ega kim kelishini bilsin va kerak bo'lsa qo'ng'iroq qilsin), kim ko'radi (maydon egasi — parol va 6 xonali kod bilan; Database'ga sayt dasturchisi kira oladi),
     qancha saqlanadi (band — o'yin kunidan keyin 30 kun, harakatlar — 60 kun). Forma ostidagi gapga 30 kunni qo'sh, «faqat» so'zini olib tashla, yoniga «Maxfiylik siyosati» havolasini qo'y:
     u yangi oynada ochilsin — forma to'ldirilganicha qolsin. `AUDIT.md` da 6-savol dalilini yangila.»
  3. **Ishga tushirish** — sayt o'zi yangilandi, xato yo'q. Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing, `git commit -m "audit va maxfiylik"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Internetda tekshirish** — Netlify manzilingizni oching va bo'sh katakni bosing: forma ostidagi gapda 30 kun bor, «Maxfiylik siyosati» yangi oynada ochiladi, forma esa to'ldirilganicha qoladi.
     Manzilga `/maxfiylik` qo'shib ham oching — sahifa to'g'ridan ochilsin. Sinfdoshingiz telefonida havolani ochib, «qancha saqlanadi?» javobini topsin.
     Hammasi joyida bo'lsa — `AUDIT.md` da 6-savol holatini o'zingiz «tuzatildi» qiling.
     Netlify yangilanmasa — laptopda `localhost:5173` da tekshiring, push'ni mentor bilan ko'rasiz.
  5. **O'z g'oyangiz** — o'z MVP'ingiz uchun to'rt savolga javob yozing: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi; «nima buzilmasin»ni ham o'zingiz yozasiz.
     Javoblar qavslarga o'zi qo'yiladi; «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.
     > Qayerda: saytda yangi «Maxfiylik siyosati» sahifasi va ma'lumot so'raladigan forma ostida havola.
     > Nima qilsin: sahifa to'rt savolga javob bersin — qaysi ma'lumot: **{qaysi ma'lumot}**; nima uchun: **{nima uchun}**; kim ko'radi: **{kim ko'radi}**; qancha saqlanadi: **{qancha saqlanadi}**.
     > Forma ostiga shu sahifaga havola qo'y — bosilganda forma to'ldirilganicha qolsin.
     > Nima buzilmasin: **{nima buzilmasin}**. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     (Tekshiruv: javob bo'sh — «Bu savolga javob yozing.» (bloklaydi) · «qancha saqlanadi» da muddat yo'q yoki «abadiy» — «Maqsad tugagach qachon o'chirilishini yozing.» (maslahat, bloklamaydi). PM-020: har qiymat «savol: javob» shaklida.)
- O'ng tomon — «kutilgan natija · namuna: Maydon»: chapda o'yinchi telefoni — forma, ostida yangi gap:
  «Ismingiz va raqamingizni maydon egasi ko'radi: kerak bo'lsa, shu raqamga qo'ng'iroq qiladi. Boshqa o'yinchilar bu vaqtni «band» deb ko'radi. Band o'yin kunidan keyin 30 kun saqlanadi, keyin o'chiriladi.» · havola «Maxfiylik siyosati»;
  o'ngda ochilgan `maydon-….netlify.app/maxfiylik`:
  - **Maydon · maxfiylik siyosati**
  - **Qaysi ma'lumot?** Band qilganda — ism va telefon. Saytdagi harakatlar ham yoziladi: nima qilingani, qachon, qaysi tugma matni ko'rsatilgani va brauzer ID (tasodifiy harf va raqamlar).
    Ularda ism va telefon yo'q. Saytda Umami analitikasi ham ishlaydi — unga ham ism va telefon yuborilmaydi.
  - **Nima uchun?** Maydon egasi kim kelishini bilsin va kerak bo'lsa qo'ng'iroq qilsin.
  - **Kim ko'radi?** Maydon egasi — parol va 6 xonali kod bilan. Boshqa o'yinchilar vaqtni «band» deb ko'radi, ism va telefonni ko'rmaydi. Database'ga sayt dasturchisi kira oladi.
  - **Qancha saqlanadi?** Band o'yin kunidan keyin 30 kun saqlanadi, keyin avtomatik o'chiriladi. Saytdagi harakatlar 60 kun saqlanadi.
- Qator (`QIzoh`, natija ostida): Siyosatdagi har gap kodda bor: muddatlar — Amaliyot 1 dagi o'chirish, «kim ko'radi» — ega sahifasidagi himoya. (110)
- Hammasi bajarilgach (yashil): Siyosat saytda: o'yinchi formadan ochib, to'rt savolga javob topadi. (68)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-06-done`
  (Render va Netlify o'zingizniki — 9-Moduldagi deploy'dan.)
- Nishon (bonus): Policy Live — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- Izoh (MD): Havola yangi oynada — «Maydon»dagi tanlov (o'yinchi siyosatni o'qib, to'ldirilgan formaga qaytadi), umumiy qoida emas: o'z g'oyasi promptida maqsad bilan yozilgan (TAYANCHGA SAVOL 7, 06-FILTR 10). «faqat» olinishi — A-bo'lim 7. Siyosat matni — olam ichidagi matn (T-008), lekin adabiy tilda.
  Siyosatda «yurist tekshirgan» yoki «qonunga to'liq mos» degan da'vo yo'q (dars yuridik maslahat bermaydi).

## 8 · 2-savol  ← QTest (✔ B, `correctIdx 1`; yakuniy — siyosat va audit birga)
- Eyebrow: Tekshiruv · siyosat va kod
- Savol: **Siyosatda «30 kun» yozilgan, kod esa bandni o'chirmaydi. Audit nima deydi?** (11 so'z)
  - A · Joyida — siyosat sahifasi saytda turibdi (40)
  - ✔ B · Tuzatish kerak — kod siyosatga mos emas (39)
  - C · Joyida — o'yinchilar kodni ochib ko'rmaydi (42)
  - D · Tuzatish kerak — 30 kun o'yinchiga juda kam (43)
- To'g'ri izohi: Siyosatdagi gap kodda bajarilmayapti — buni tuzatish kerak. (59)
- Xato izohlari (≤60):
  - A — Sahifa bor — lekin undagi gap kodda bajarilyaptimi? (51)
  - C — Ko'rmasa ham, uning raqami 30 kundan keyin ham turadi. (54)
  - D — Audit 30 kunni baholamaydi — siyosat va kodni solishtiradi. (59)
  - (umumiy) Siyosatdagi gap bilan kod bir xilmi — shuni toping. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): tire to'rttala variantda; «Joyida» 2 · «Tuzatish kerak» 2 (S-006); to'g'ri variant eng uzun emas. D — «audit raqamni baholaydi» yanglishi (S-004: 30 kunni sayt egasi tanlaydi — 4-ekran eslatmasi).
  Savol yangi holat (siyosat bor, kod yo'q) — A1/A2 dagi tartibning teskarisi, ekrandan ko'chirib bo'lmaydi (§106).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Shaxsiy ma'lumot» · 8 — «2 — Siyosat va kod»

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- ✎ SABOQ 12 (9-Modul F-1005-88, foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta, matn o'zgarmagan (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 10 · Dars yakuni  ← QYakun (kartochkalar — oldingi alohida ekranda)
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha: **Audit o'tdi, maxfiylik siyosati saytda.** (39)
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Asosiy fikr (ScoreRing'dan keyin, kichik — P-013): Odam ma'lumotini ishonib berishi uchun kerakli minimumni yig'asiz, maqsad tugagach o'chirasiz va buni saytda ochiq aytasiz; audit siyosatda yozilganni kod bilan solishtiradi.
- Endi siz bilasiz:
  - Shaxsiy ma'lumot — odamni aniqlashga imkon beradigan ma'lumot: «Maydon»da ism va telefon.
  - Eski bandni saqlamaslik sizib chiqsa ko'rinadigan ma'lumotni kamaytiradi.
  - Odam ma'lumotini ishonib berishi uchun: ochiq aytish, kerakli minimum, maqsad tugasa o'chirish.
  - Audit — ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi; u siyosatda yozilganni kod bilan solishtiradi.
  - «Maydon»ning sodda maxfiylik siyosati to'rt savolga javob beradi: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi.
- Uyga vazifa (karta, P-025):
  - Sarlavha: Uyda nima qilasiz?
  - Kim uchun: o'z MVP ingiz · Nechta: audit va siyosat sahifasi · Muddat: keyingi darsgacha
  - 1 · Audit varag'ingizdagi «tuzatish kerak» savollarini agentga talab qilib bering va `AUDIT.md` yozdiring.
  - 2 · Maxfiylik siyosati sahifasini qo'shing — to'rt javobingiz Amaliyot 2 dagi promptda.
  - 3 · Bitta sinfdoshingiz siyosatingizni ochib, «qancha saqlanadi?» javobini topsin.
  - (Audit varag'ingiz shu yerda ko'rinadi — Amaliyot 1 dagi olti belgi; «tuzatish kerak» lari accent.)
- Keyingi dars — «Production deploy: domen, SSL, monitoring»: sayt yiqilsa, ogohlantirish sizga keladi.
- Nishonlaringiz — N/4 (mentor rejimida yo'q)
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): «Keyingi dars» qatorining ikkinchi qismi — App.jsx `m8-07` osti, so'zma-so'z (`00-NOMLAR.md`). Birinchi «Endi siz bilasiz» qatori — ta'rif, 2-ekran va kartochka bilan so'zma-so'z (T-042).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Data Detective!** — Shaxsiy ma'lumotni birinchi urinishda topdingiz (3)
- **Auditor!** — Audit varag'ida ikki «tuzatish kerak»ni birinchi urinishda topdingiz (5)
- **Self Audit!** — O'z MVP ingiz uchun audit varag'ini belgiladingiz (6, 5-qadam)
- **Policy Live!** — Maxfiylik siyosati saytda: ikki amaliyotni oxirigacha bajardingiz (7) — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Shaxsiy ma'lumot** — 1 Shaxsiy ma'lumot — odamni aniqlashga imkon beradigan ma'lumot: ism, telefon. · 2 «Maydon»da ular `bandlar` jadvalida turadi, ega sahifasida ko'rinadi. ·
  3 6 xonali kod maxfiy, lekin u odamni aniqlamaydi. — Sinfga savol: «Maydon»dagi qaysi yozuv bilan o'yinchini aniqlash mumkin?
- **8 · Siyosat va kod** — 1 «Maydon»ning sodda maxfiylik siyosati to'rt savolga javob beradi. · 2 Bu darsdagi audit siyosatdagi gapni kod bilan solishtiradi. ·
  3 Siyosatda «30 kun» yozilgan, kod o'chirmasa — tuzatish kerak. — Sinfga savol: Siyosatdagi «30 kun»ni qanday tekshirasiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Shaxsiy ma'lumot nima? | Odamni aniqlashga imkon beradigan ma'lumot | «Maydon»da — ism va telefon |
| «Maydon»da ism va telefon qayerda turadi? | `bandlar` jadvalida; ega sahifasida ko'rinadi | O'yinchi sahifasiga soat va «band» boradi |
| Hodisalar va Umami'ga ism yoki telefon ketadimi? | Yo'q | Hodisada — nom, brauzer ID, variant va vaqt |
| Sizib chiqish nima? | Ma'lumot ruxsatsiz begona qo'lga o'tishi | Masalan, ochiq qolgan ega sahifasi |
| Eski bandlar o'chirilmasa, begona nimani ko'radi? | Sayt ochilgandan beri hamma bandni | O'chirilgan qator ega sahifasida endi ko'rinmaydi |
| «Maydon» bandni qachon o'chiradi? | O'yin kunidan 30 kun o'tgach — avtomatik | Bu kursda tanlangan muddat; mahsulot egasi maqsadga mos belgilaydi |
| O'zbekistonda shaxsiy ma'lumot haqidagi qonun qanday ataladi? | «Shaxsga doir ma'lumotlar to'g'risida»gi Qonun | O'RQ-547, 2019-yil 1-oktabrdan kuchga kirgan |
| Qonunning 17 va 18-moddalarida nima bor? | 17 — maqsadga erishilganda yo'q qilish; 18 — ishlov berish shartlari, ular orasida rozilik | Dars yuridik maslahat bermaydi |
| GDPR nima? | Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan | Unda telefon raqami ham shaxsiy ma'lumot |
| Odam ma'lumotini ishonib berishi uchun qaysi uch fikr kerak? | Ochiq aytish, kerakli minimum, maqsad tugasa o'chirish | Ochiq aytish — rozilikning o'zi emas |
| Audit nima? | Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi | «Maydon»da — `AUDIT.md`, olti savol |
| Maxfiylik siyosati qaysi savollarga javob beradi? | Qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi | Inglizchasi — privacy policy |

## Jonli viktorina (arena, 12 savol) — kalitlar: A · B · C · D · B · A · D · C · A · D · C · B (har harf 3 marta)
1. Shaxsiy ma'lumot nima? · ✔ Odamni aniqlashga imkon beradigan ma'lumot · Parol bilan yopilgan sahifadagi hamma yozuv · Database jadvaliga yozilgan har bir qator · Saytda eng ko'p bosiladigan tugmaning nomi
2. O'yinchi sahifasida band haqida nima ko'rinadi? · Band qilgan o'yinchining ismi va soat · ✔ Soat va «band» degan bitta yozuv · Band qilgan o'yinchining telefoni · Ism, telefon va band qilingan kun
3. GDPR qanday qoida? · O'zbekiston Respublikasi qonuni, 2019-yildan · «Maydon» saytining o'z ichki qoidasi · ✔ Yevropa Ittifoqi qoidasi, 2018-yildan · Umami analitikasining ichki qoidasi
4. «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunning 17-moddasi nima haqida? · Saytga 6 xonali kod bilan kirish tartibi haqida · Telefon raqamini to'g'ri yozish haqida · Saytga analitika ulash tartibi haqida · ✔ Maqsadga erishilgach yo'q qilish haqida
5. Sizib chiqish nima? · Ma'lumot Database'dan o'chib ketishi · ✔ Ma'lumot ruxsatsiz begona qo'lga o'tishi · Sayt Backend'dan javob ololmay qolishi · Band qilgan o'yinchi maydonga kelmasligi
6. Ega sahifasi begona qo'lida. Eski bandlar o'chirilmasa-chi? · ✔ Begona eng eski bandlarni ham ko'radi · Begona bugungi bandlarnigina ko'radi · Begona hech qanday bandni ko'rmaydi · Sahifa begonadan parolni qayta so'raydi
7. Amaliyotdan keyin «Maydon» bandni qancha saqlaydi? · Sayt ishlab turgan butun vaqt davomida · Band qilingan kunning oxirigacha · O'yinchi saytni yopib chiqquncha · ✔ O'yin kunidan 30 kun o'tguncha
8. Kerakli minimum nima degani? · Formani iloji boricha qisqa bezash · Ma'lumotni imkon qadar qisqa saqlash · ✔ Ish uchun keraklisinigina so'rash · Parolni eng kam belgidan tuzish
9. Audit nima? · ✔ Ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi · Saytga yangi sahifa qo'shish uchun agentga talab · Database'dagi eski bandlarni o'chirib turadigan kod · Saytga kirgan brauzerlarni sanab turadigan sahifa
10. Qaysi biri maxfiylik siyosatidagi savol? · Sayt qaysi dasturlash tilida yozilgan? · Band qilish tugmasi qaysi rangda? · Futbol maydonchasi qayerda joylashgan? · ✔ Ma'lumot qancha vaqt saqlanadi?
11. Forma ostida siyosat havolasi turibdi. Bu qaysi fikr? · Kerakli minimum — kam narsa so'raladi · O'chirish — 30 kundan keyin yo'qoladi · ✔ Ochiq aytish — nima bo'lishi yozilgan · Audit — ro'yxat bo'yicha tekshiriladi
12. Siyosatdagi «30 kun»ni qanday tekshirasiz? · Agentdan «o'chiryapsanmi?» deb yana so'raysiz · ✔ Neon'da eski bandning o'chganini ko'rasiz · Siyosat matnini boshidan yana bir o'qiysiz · Kodni ochmasdan keyingi ishga o'tib ketasiz

- Fon so'zlari (R-008, kodda {uz, ru}): shaxsiy ma'lumot · sizib chiqish · audit · maxfiylik siyosati · ochiq aytish · `AUDIT.md` · `/maxfiylik` · 30 kun · GDPR · `/ega` · Maydon (+ ✅ 🎯 — o'yin qatlami).
- Izoh (MD): ekran testlari (3, 8), kartochkalar va arena — uch xil savol (§144): arena 1, 5, 9 — ta'riflar; 2, 6 — xarita va sizib chiqish holati; 3, 4 — qonun va GDPR (tayanch 6); 7, 8, 11 — uch fikr; 10, 12 — siyosat va tekshiruv.
  Variant uzunliklari (belgi, python): 1 · 42/43/41/42 · 2 · 37/32/33/33 · 3 · 44/36/37/35 · 4 · 47/38/37/39 · 5 · 36/40/38/40 · 6 · 37/36/35/39 · 7 · 38/32/32/30 · 8 · 34/36/33/31 ·
  9 · 51/48/51/49 · 10 · 38/33/38/31 · 11 · 37/37/33/37 · 12 · 45/41/42/43 — to'g'ri variant hech qayerda yolg'iz eng uzun emas (9-savolda C bilan teng).
  Savollar ≤12 so'z. 11-savolda tire to'rttala variantda. 8-savol B — uch fikrning boshqasi («rost, lekin mos emas», S-004). 3-savol A — O'zbekiston qonuni (rost fakt, lekin GDPR emas).
  Arena 6: ega sahifasi ochiq qolgan holat (4-ekran), D — token 12 soat amal qiladi, ochiq sahifa parol so'ramaydi.

---

## KOD — qurish bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. **Yangi fayl** `src/8-Modull/PmTrustAuditLesson.jsx` — skeletdan; palitra `qolipRang('pm')`; `SCREEN_META` 12:
   hook · plan · concept · test · concept · concept · practice · practice · test · stats · flashcards · summary (kartochkalar alohida — SABOQ 12). `LESSON_META.lessonId` — `m8-06-v1`, `lessonTitle` — «Foydalanuvchi sizga ma'lumotini ishonadimi?».
2. **Ekran turlari:** s0 `QKirish` · s1 `QReja` · s2/s4/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6/s7 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s9 `QNatija` · `sflash` `QKartochka` (alohida) · s10 `QYakun`.
3. **Bitta vizual `MalumotXarita`** (180): `MAYDON_MALUMOT` (tugunlar `oyinchi` · `backend` · `bandlar` · `ega` · `hodisalar` · `umami`; har birida `nima` qatori va `ismTelefon: bor|yo'q`) +
   `NAMUNA_BANDLAR` (kun oldin → soatlar; 0…60; ism va telefon — xira chiziq, matn yo'q) + `AUDIT_SAVOLLAR` (6: `id`, `savol`, `yorliq`, `dalil`, `togri: 'joyida'|'tuzatish kerak'`, `xato`) →
   `FormaTel` · `EgaSahifa` (kun, ro'yxat, «Bu kunda band yo'q.») · `BandJadval` · `AuditFayl` · `SiyosatSahifa`. s0, s1, s2, s4, s5, s6/s7 (o'ng) shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). «Begona» belgisi — chizilgan (SVG), emoji emas. `prefers-reduced-motion` — o'tishsiz.
4. **KOD — darsga xos:** s0 javobdan keyin uch savol-yorliq (`Kim ko'radi?` ✓ · `Nima uchun?` ✓ · `Qancha saqlanadi?` bo'sh) · s2 «Band qilish» → konvertlar → 5 tugun (U-013, `seen`) →
   joriy qator + GDPR `QIzoh` · s4 surgich (0–60) → `EgaSahifa.kun`; 2-bosqich switch → 30 kundan eski qism kulrang, `BandJadval` qatorlari so'nadi · s5 P-055 qadamlar, `QChip` + `silk` + `QXato`,
   6-savoldan keyin karta ichida siyosat atamasi, 6/6 da audit atamasi va «Amaliyot 1/2» yorliqlari.
5. **KOD — qolipda yo'q bo'lishi mumkin:** `QBlok` 5 qadam (9-Modul 6, 8-darslar naqshi). A1 5-qadam — 6 qatorli chip-forma (ikki chip); A2 5-qadam — 5 maydonli forma → prompt qavslari (`GoyaForma` naqshi).
   A1 4-qadam — uch kichik tekshiruv bir qadam ichida (03 A1 naqshi) + kulrang «faqat o'z saytingizda» qatori.
6. **Saqlash:** A1 5-qadam → **`pm-m8d6-audit`** `{ savollar: [{ savol, holat }] }` (`holat` — `joyida` | `tuzatish kerak`; 8-dars `tuzatildi` ni ham o'qiydi; tayanch 8) + `ccProgress`.
   A2 5-qadam javoblari — `ccProgress` (uyga vazifa kartasida ko'rinadi). Kirish kaliti yo'q (6-dars oldingi PM natijasini o'qimaydi).
7. **Testlar:** `INLINE_KEYS` s3 → 2, s8 → 1; `RECAPS` 3/8 (`ask` + 3 karta, `ic` 1/2/3); `Q_LABELS` {3, 8}; to'g'ri izoh ≤60, xato izohlari ≤60.
8. `QUIZ_BANK` 12 (kalitlar A B C D B A D C A D C B → indeks 0 1 2 3 1 0 3 2 0 3 2 1); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`.
9. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s3 birinchi urinish → dataDetective · s5 5 va 6-savol birinchi urinish → auditor · A1 5-qadam 6/6 → selfAudit · A2 oxirgi «Bajardim» → policyLive.
10. **Amaliyot bloklari:** `ortda` — A1 `m10-dars-06-start`, A2 `m10-dars-06-done` (`ORTDA_FETCH` — `git fetch https://github.com/Azizbekcrypto/maydon --tags`); `XATO_YOLI`; «Yordam» — A1 namuna ibora, A2 namuna qator.
    O'ng: A1 — `AuditFayl` (5 tuzatildi, 6 tuzatish kerak) + Neon karta; A2 — `FormaTel` (yangi gap + havola) + `SiyosatSahifa`.
11. Uyga vazifa — `HwCard` yakun ekranida (3 qadam + `pm-m8d6-audit` dan «tuzatish kerak» savollari); alohida `.homework.jsx` yo'q.
12. App.jsx `m8-06` qatoriga `comp` — «qur» bosqichida, asosiy seans (nom va osti yozuvi o'zgarmaydi, DE-205 ✓).
13. `narrow` faqat 3, 8, 9-ekranlarda (171). Darvozalar: `npm run gates -- src/8-Modull/PmTrustAuditLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

## REPO — `maydon`, `m10-dars-06-start` → `m10-dars-06-done` (tayanch 3; yozish — «qur» da, 9-Modul repo'si yopilgandan keyin, qaror 3)
1. **`m10-dars-06-start`** = `m10-dars-05-done` (uch zaiflik yopilgan, ega kirishi — parol + 6 xonali kod).
2. **`m10-dars-06-done`** = start + A1 va A2 namunasi (Mentor misoli):
   - `AUDIT.md` (repo ildizida) — jadval: № · Savol (`AUDIT_SAVOLLAR` matni) · Dalil (fayl nomi bilan) · Holat (o'quvchi yozadi; namunada: 1–4 — joyida · 5 — tuzatildi · 6 — tuzatildi).
   - `backend/` — eski bandlarni o'chirish: Backend ishga tushganda (`OnApplicationBootstrap`) va keyin har 24 soatda (`setInterval`, yangi paket yo'q):
     `bandlar` dan `kun < chegara` qatorlar o'chiriladi (`WHERE`), chegara = Toshkent vaqti (`Asia/Tashkent`) bo'yicha bugun − 30 kun (`YYYY-MM-DD`). Log: «Eski bandlar o'chirildi: N».
     `hodisalar` dan `yaratilgan` 60 kundan eski qatorlar o'chiriladi (`WHERE`). Log: «Eski hodisalar o'chirildi: N». Muhrdan oldin: 61 kun oldingi test hodisa → qayta ishga tushirish → o'chdi.
     Namuna bandlar (eng yaqin shanba 17:00, 20:00) tegilmaydi. Fayl nomi «qur»da (boshqa darslarga tegmaydi).
   - `web/src/Maxfiylik.jsx` — `/maxfiylik`: «Maydon · maxfiylik siyosati», to'rt savol (matn — 7-ekrandagi namuna, so'zma-so'z). `main.jsx` — yo'l; `/maxfiylik` hodisa yozmaydi.
   - `web/src/BandForma.jsx` — gap yangilandi («faqat» olindi, «30 kun saqlanadi, keyin o'chiriladi» qo'shildi) + havola «Maxfiylik siyosati» (`target="_blank"`, `rel="noopener noreferrer"`).
   - README: «Darslar va teglar» jadvaliga 6-dars qatori; «Xatolar» jadvaliga: `/maxfiylik` Netlify'da ochilmaydi — `web/public/_redirects` joyida emas ·
     eski band o'chmadi — Backend qayta ishga tushmagan yoki band o'yin kunidan 30 kun o'tmagan.
3. **Shart:** teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida).
4. **Bog'liqlik:** 8-dars prod ro'yxati `AUDIT.md` va `pm-m8d6-audit` ni o'qiydi · 7-dars UptimeRobot `/health` ni har 5 daqiqada so'rasa, Render uxlamaydi — o'chirish har 24 soatda bajariladi (tayanch 6: yon ta'sir).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **`pm-m8d6-audit` = `{ savollar: [{ savol, holat }] }`** (06-FILTR 11) — avvalgi `bandlar` kaliti «band» (band qilish) bilan to'qnashardi (T-015); tayanch 8 yangilandi.
   `holat` qiymatlari: `joyida` · `tuzatish kerak` · `tuzatildi`. 8-dars A3 5-qadami «tuzatish kerak» savollarini oladi (8-dars MD si moslandi).
2. **Audit varag'i — 6 savol** (`AUDIT_SAVOLLAR`): kerakli minimum · kim ko'radi · analitika · uch zaiflik · qancha saqlanadi · saytda o'qiy oladimi. Tayanchda ro'yxat yo'q; 8-dars shu savollarga tayanadi.
   3-savol ataylab «ism yoki telefon» deb yozildi («shaxsiy ma'lumot» emas) — brauzer ID ni «shaxsiy ma'lumot emas» deb aytmaslik uchun (Shubhali joylar 1).
3. **Forma ostidagi gap `dars-11-done` da allaqachon bor** (`web/src/BandForma.jsx`, 9-dars commit `102db34`; 9-Modul 9-dars MD sida tilga olinmagan). 6-dars yangi gap qo'shmaydi — uni yangilaydi:
   30 kun qo'shiladi, «faqat» olinadi (Database'ga sayt dasturchisi ham kira oladi — siyosat bilan zid bo'lmasin), yoniga havola. Tayanchdagi misol («ism va telefon faqat maydon egasiga ko'rinishi») shu sababdan «faqat»siz.
4. **O'chirish qachon ishlaydi** — ishga tushganda va har 24 soatda (yangi paket yo'q); Render uxlasa — uyg'onganda. Chegara — Toshkent vaqti bo'yicha bugun − 30 kun (3-dars «Toshkent vaqti» qarori bilan bir xil). Tayanchda faqat «30 kun o'tgan bandlar o'chiriladi».
5. ✅ **(05.10 GATE M 06-q0 A)** **`hodisalar` saqlash muddati — 60 kun** (06-FILTR 4). Sabab: 1-dars oy maqsadi va o'tgan oy solishtiruvi, 8-dars A/B yakuni (B ishga tushgandan beri, taxminan 2 hafta) sig'adi.
   Siyosatda: «Saytdagi harakatlar 60 kun saqlanadi». O'chirish — A1 dagi o'sha kod (o'quvchi slotida emas).
6. **`/maxfiylik` hodisa yozmaydi** — `ochdi` faqat o'yinchi sahifasida (tayanch 3: `/ega`, `/dashboard` yozmaydi). 2-dars `main.jsx` dagi yo'l tanlashi shuni ko'tarishi kerak.
7. **Havola yangi oynada** (`target="_blank"`) — to'ldirilgan forma yo'qolmasin. Tayanchda yo'q.
8. **Siyosatdagi «kim ko'radi»** — maydon egasi + Database'ga kira oladigan sayt dasturchisi. Tayanchda yo'q; halollik uchun qo'shdim («Maydon»da dasturchi va ega — boshqa-boshqa odam deb olindi).
9. **O'chirishni so'rash yo'li** (o'yinchi o'z bandini o'chirtirishi, ega bilan aloqa) — siyosatda yo'q: ega aloqasi tayanchda yo'q. Kerakmi?
10. **Rozilik uchun belgilash katagi** qo'shilmadi — tayanch: «havola va bir qator». Dars havola va siyosatni «ochiq aytish» deydi, rozilik demaydi (06-FILTR 1; 5-ekran kulrang izohi, arena 11).
11. **4-ekran maketi:** kunlar 0…60 kun oldin — maket chegarasi («Maydon» qachon ochilgani tayanchda yo'q); har kunda 1–3 xira band — namuna, statistika emas.
12. **5-dars yakuni holati** (2FA, uch zaiflik yopilgan, telefon bo'yicha qidiruv) — 5-dars MD si bilan solishtirish kerak: audit 2 va 4-savol dalillari shunga tayanadi.
13. **Ko'prik LMS 5-Modul `m4-07`** («Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?»): «yopiq ma'lumot», «yuborilmagan ma'lumot sizib ketmaydi» — faqat O'qituvchi eslatmasida.
    Atama «sizib chiqish» (tayanch); `m4-07` da fe'l «sizib ketmaydi» — modul bo'yi bitta shakl kerakmi?
14. **«Bu tekshiruvni faqat o'z saytingizda qilasiz…»** — tayanch «Darsda bir marta» (3-bo'lim, 5 va 6-darslar qoidasi ostida). 6-darsda ham A1 4-qadamda bir marta qo'ydim.
15. **GDPR qisqartmasi ochildi** (General Data Protection Regulation, T-036) — tayanchda faqat «Yevropa Ittifoqi qoidasi».

## Shubhali joylar (ishonchim komil emas)
1. **Brauzer ID va GDPR.** Ba'zi qoidalarda brauzerni ajratadigan raqamlar ham shaxsiy ma'lumot bo'lishi mumkin. Shuning uchun darsda «brauzer ID shaxsiy ma'lumot emas» deyilmaydi:
   audit 3-savoli «ism yoki telefon», testda brauzer ID varianti yo'q. Siyosat endi brauzer ID ni ochiq nomlaydi va «ism va telefon yo'q» deydi — «shaxsiy ma'lumotsiz» deyilmadi.
2. **18-modda.** Lex.uz bo'yicha 18-modda — ishlov berish shartlari, rozilik ulardan biri (shartnoma, qonun asoslari ham bor). Darsda «shartlardan biri — odamning roziligi» deb yozdim; tayanchdagi «ishlov berish odamning roziligi bilan» dan bir oz aniqroq.
3. **17-modda** — «maqsadga erishilganda» — yo'q qilish holatlaridan biri. Qonun aniq kun sonini aytadimi — tekshirmadim; darsda «30 kun qonun talabi» degan da'vo yo'q.
4. **`INSERT` va `yaratilgan` ustuni** — TypeORM `CreateDateColumn` Database'da sukut qiymat (`now()`) bilan yaratiladi deb oldim; bo'lmasa `INSERT` xato beradi va ustun qo'shilishi kerak. «Qur»da tekshiriladi.
5. **Render uxlasa** — o'chirish faqat Backend uyg'onganda bajariladi; 30 kun o'tgan band bir oz kechroq o'chishi mumkin. Siyosat endi «30 kun saqlanadi, keyin o'chiriladi» — aniq soat aytilmaydi (06-FILTR 7).
6. **Umami** — kodda ism va telefon yuborilmaydi (rost). Siyosat Umami'ni nomlaydi va faqat shuni aytadi; Umami o'zi yana nimalarni yig'ishi (IP, qurilma) haqida da'vo yo'q — tekshirmadim.
7. **Ega sahifasi ochiq qolgan holat** — `/ega` tokeni sahifa xotirasida, 12 soat amal qiladi (repo); begona shu vaqt ichida o'tgan kunlarni ochadi (`Ega.jsx` da ‹ o'tgan kunga ham o'tadi). 5-dars ega sahifasini o'zgartirsa (qidiruv), maket moslanadi.
8. **«Bir necha daqiqa»** (Render va Netlify yangilanishi) — soni manbasiz, aniq son yozmadim.
9. **Hook javoblari** — ikkala tanlovga ham «Aynan!» / «Qiziq fikr!» qoidasi (tayanch 7.7); bu fikr-so'rovi bo'lgani uchun auditor «ikkalasi teng-ku» deyishi mumkin — payoff ikkalasida bir xil yangilik qo'shadi.

---

## Qurilish (06.10.2026, F-1005-186) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- Bitta vizual «Maydon: ism va telefon yo'li» (`TUGUNLAR`; komponentlar `Telefon`, `EgaBrauzer`/`EgaMini`, `KunChizigi`, `BandJadval`, `AuditFayl`, `SiyosatSahifa`) — telefon chapda, «Sayt · React».
- 0-ekran: gap bo'laklari chizilib boradigan tagchiziq va 1/2/3 belgisi; matn telefon yonidagi kattalashtirilgan kartada (170 px telefonga sig'maydi).
- 4-ekran: ega sahifasi chapda, kunlar chizig'i (surgich) o'ngda (MD — teskari; SABOQ 21). 5-ekran: savollar ro'yxati o'rniga raqamli ixcham chiziq (SABOQ 29); 1-ekran: `/maxfiylik` ikkinchi telefonda.
- A2 5-qadam: javoblar bittadan, prompt qavslariga o'zi tushadi (o'z ko'rinishi, QPrompt emas). «o'z MVP ingiz» → «MVP'ingiz»; A2 «9-Moduldagi» → «o'tgan moduldagi» (T-036).
- RECAPS sarlavhalari (MD da yo'q): «Shaxsiy ma'lumot · Qayerda turadi · Maxfiy kod» va «To'rt savol · Audit nima qiladi · Mos kelmasa». `lessonTitle.ru` «Доверяет ли вам пользователь свои данные?».
- **MD ga taklif (agent) — qabul (06.10, F-1005-190):** 2-ekran natijasidagi «ega sahifasi uni **faqat** ko'rsatadi» A-7 ga zid edi → «uni ko'rsatadi, o'zida saqlamaydi» (kod va MD). 1-savol dalili «boshqa maydon» → «boshqa ma'lumot» — tuzatildi ✎.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-05` «Kiberxavfsizlik: zaiflikni topib yopamiz» → **`m8-06` «Foydalanuvchi sizga ma'lumotini ishonadimi?»** (osti so'zma-so'z 1-ekran chap yorlig'ida) →
  `m8-07` «Production deploy: domen, SSL, monitoring» (yakunda osti so'zma-so'z).
- [x] Bitta misol-ip — «Maydon»; metafora yo'q; keyssiz (tayanch 5); bitta vizual — `MalumotXarita` (forma, Backend, `bandlar`, ega sahifasi, `hodisalar`, Umami — bitta manbadan); `AuditFayl` va `SiyosatSahifa` — shu manbaning ko'rinishlari.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (Band qilish → konvertlar, 5 tugun), 4 (surgich → kun va ro'yxat; kalit → kulrang qism), 5 (tugma → `AUDIT.md` qatori, tugun ✓/✗); 0, 6, 7 ham o'zgaradi. Matn-karta yo'q.
- [x] Sarlavha ≤55 bitta qator (39–51) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosa ≤110 (97, 84, 99) · hook javobi ≤120 (107, 108) ·
  to'g'ri izoh ≤60 (59, 59) · xato izohlari ≤60 (39–59) — python bilan sanaldi.
- [x] Atamalar tayanch bilan bir xil: shaxsiy ma'lumot · sizib chiqish · audit · maxfiylik siyosati · maxfiy kalit · 2FA · zaiflik · hodisa · brauzer ID · talab · agent; «sir», «baza», «server», «sessiya», «buzilgan», «hujum» yo'q ·
  siz-forma; Antigravity promptlari agentga buyruq shaklida (T-002 istisnosi) · tugmalar ot-shaklda yoki siz-formada («Band qiling», «Kunlarni suring», «O'chirishni yoqing», «Savollarni belgilang»).
- [x] Testlar: variantlar 29–31 va 39–43 belgi, to'g'ri variant eng uzun emas; «telefon» s3 da B va C da; tire s8 da to'rttala variantda; «Joyida» 2 · «Tuzatish kerak» 2 · ✔ o'rni: 3-ekran C, 8-ekran B · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM + amaliyot darsi; yakuniy — s8 `QTest`) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol», «hech qachon» — o'quvchi matnida yo'q; «faqat» — faqat repo gapi va tayanchdagi majburiy gapda).
- [x] Ichki kodlar o'quvchi matnida yo'q («m8-06», «10-Modul», «A1», «K9» yo'q; blok o'quvchiga «Amaliyot 1»; «5-darsda», «O'tgan darsda» — dars raqami, namuna MD dagidek) · qonun va GDPR — faqat tayanch 6 dan, A-bo'limda manba ·
  real kompaniya voqeasi yo'q · «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S · PM: T-002/008/011/014/015/016/020/029/039/042/043/047/048/052/064 · P-001/008/010/013/014/015/016/020/026/028/036/046/052/055/059/062/063/064/067 ·
  S-001/002/003/004/006/008/009/010/015/018/020/025/026/031/034 · PM-020/021/030 — ko'rildi.
- [ ] P-028 qisman: Neon SQL Editor va Netlify yangilanishi — 9-Modul va 2-dars MD sidagi nomlar bilan bir xil, lekin dars oldidan bir marta ko'rib chiqish kerak (Shubhali joylar 4, 8).
- [ ] Tayanchda yo'q qarorlar (savollar ro'yxati, «faqat»siz gap, o'chirish vaqti, havola yangi oynada, «kim ko'radi»da dasturchi) — TAYANCHGA SAVOL 2–4, 7, 8; 5 va 8-dars MD lari bilan solishtirish kerak.
