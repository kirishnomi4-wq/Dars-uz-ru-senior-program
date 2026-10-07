# 12-Modul (kod: `src/10-Modull`) · 3-dars (PM + amaliyot) «Ekran o'zi yangilanishi uchun nimani yozasiz?» — MD v3

Fayl: `src/10-Modull/PmRealtimeSpecLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-03` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; tayanch 4 «PM+PRAKT») · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · «Maydon Jamoa» nomi o'z rangida, telefon maketida · ekranga kirganda bo'sh element yo'q ·
ekranda ≤ 3 blok · telefon maketi chapda, talab varag'i o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **D** (`correctIdx 3`) · 8-ekran — **B** (`correctIdx 1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 399–401, DE-205): `m10-02` «WebSocket: ekran o'zi yangilanadigan ulanish» → **`m10-03` «Ekran o'zi yangilanishi uchun nimani yozasiz?»** (osti: «real vaqt talabi: hodisalar, ulanish holatlari, chekka holatlar», `type: 'PM'`) → `m10-04` «Loyiha kuni: jonli xabar va eslatma».
Tur (PM-005): **gibrid — PM qismi 2-tur (sof PM: artefakt — o'quvchining real vaqt talabi) + amaliyot (repo, ikki blok)**. Namuna tuzilmasi — 11-Modul `13-PmAudienceTest-v3.md` (PM+PRAKT, 12 ekran) va 10-Modul `04-PmAbTest-v3.md` hamda ularning FILTR fayllari; atama, sahna va belgi so'zlari — pilot `02-WebSocketBasics-v3.md` bilan bir.
Keys — **keyssiz** (tayanch 5, Qaror-0 22). REPO — `maydon-jamoa` (`m12-dars-03-start` = `m12-dars-02-done` → `m12-dars-03-done`).
**Vaqt: ≈ 90 daqiqa** — kirish va reja ≈ 5 · 2–4-ekranlar ≈ 15 · o'z talabi ≈ 10 · Amaliyot 1 ≈ 25 (Render kutishi shu ichida) · Amaliyot 2 ≈ 18 · yakuniy savol, podium, kartochkalar, arena ≈ 12 · zaxira ≈ 5. Har blokda «Ulgurmasangiz» yo'li; Render'dagi yangi versiyani kutish dars oqimini to'xtatmaydi (A-bo'lim 8).
Manba: `00-MODUL-TAYANCH.md` (1.0 — boshlanish nuqtasi · 1.2 — hodisa, sxema, ulanish belgisi · **1.3 — real vaqt talabi, Mentor holatlari, uch chekka holat, «Nima buzilmasin», bloklar, tekshirish — AYNAN** · 2 — atamalar · 3 — repo, teg 03 · 4 — PM+PRAKT · 6 — socket.io, Render · 7 — oldindan tuzatiladigan sinflar · 8 — `pm-m10d2-sxema`, `pm-m10d3-talab` · **9 — to'lqin kelishuvlari** 1–26; 9.21–9.26 (14:49 qo'shilgan) 3-dars matniga tegmaydi, 9.25 bilan mos: `oyin-ozgardi` faqat `{ oyinId, sabab }`) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 4, 5, 22, 23) · `00-TAQIQLAR.md` · `00-MANBA.md` 5 · 11-Modul tayanchi (1.4 PRD, 1.6 real vaqt nuqtasi, 2, 9.29, 9.34, 9.35, 9.74, 9.81, 9.84, 9.85, 9.88, 9.92) · pilot `02-WebSocketBasics-v3.md` (sahna, belgi, `MENTOR_SXEMA`, `pm-m10d2-sxema`).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «GIBRID: mini-PRD (hodisalar, holatlar, chekka holatlar) → agent jonli yangilanishlarni quradi; natija — jonli yangilanishlar o'z talabi bo'yicha ishlaydi»; tayanch 4: «real vaqt talabi yozilgan; ekran o'zi yangilanadi»):**
   o'quvchi o'z mahsuloti uchun real vaqt talabini yozadi (uch bo'lim: hodisalar · ulanish holatlari · chekka holatlar); agent hodisalarni quradi — o'quvchi telefonda ro'yxat pastga tortmasdan yangilanishini o'zi ko'radi; ulanish holatlari ekranda talabdagidek; talab `README.md` «Real vaqt» bo'limida.
   Saqlanadi: `pm-m10d3-talab` (4, 5-darslar o'qiydi). Repo'da (tayanch 3, `m12-dars-03-done`): Backend besh o'zgarishdan keyin `oyin-ozgardi { oyinId, sabab }` yuboradi · ilova tinglaydi va `GET /oyinlar` ni qayta so'raydi · uch ulanish holati ekranda · `README.md` «Real vaqt»ga «Ulanish holatlari» va «Chekka holatlar» bo'limlari.
   **Chekka holatlar bugun yoziladi va agentga beriladi, tekshirilmaydi** (tayanch 1.3 oxiri): yakunda faqat bajarilgan ish aytiladi — «Talabingizda N chekka holat yozilgan.»; keyingi dars ishi va'da qilinmaydi (T-038). Mentor misoli — namuna va «kutilgan natija», umumiy qolip emas (tayanch 7.2b).
2. **Bugungi asosiy fikr (P-013):** Bu darsda real vaqt talabi uch bo'limdan iborat: hodisalar, ulanish holatlari va chekka holatlar; talabda yozilgani telefonda tekshirilmaguncha bajarilgan ish emas.
   (Yakunda ScoreRing ostida, `small`; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan — qayta o'rgatilmaydi, bir gap bilan eslatiladi (T-052):**
   - 2-dars (shu modul; tayanch 1.2): **doimiy ulanish** · **WebSocket** · **socket.io** · **hodisa** — ulanish orqali yuboriladigan nomli xabar: nomi va ma'lumoti bor · `oyin-ozgardi` — `{ oyinId, sabab }`, besh sabab (`qoshildi` · `chiqdi` · `tasdiqladi` · `navbatga-yozildi` · `elon-berildi`) · **tinglovchi** (`ulanish.on(…)`) ·
     **ulanish belgisi** «Ulangan» · «Ulanmoqda…» · «Ulanmagan» va **ulanish holatlari** (ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda; shu payt bo'lgan hodisalar kelmaydi · ulanmagan — ilova urinmayapti) ·
     **real vaqt oqimi sxemasi** — `README.md` «Real vaqt» jadvali va `pm-m10d2-sxema` (besh ustun: real vaqt nuqtasi · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi) · kanonik gap: «Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.» (bu darsda «Bu misolda …» bilan — tayanch 9.17).
   - 11-Modul: «Maydon Jamoa», tashkilotchi va o'yinchi, «O'yinlar» · «O'yin» ekranlari, «Qo'shilaman», «Kelaman», «O'yindan chiqish», «Hisobdan chiqish», `GET /oyinlar` (yagona ro'yxat yo'li; «O'yin» ekrani ham shu javobdan o'qiydi — 9.29) · **real vaqt nuqtasi** (8-dars) ·
     **PRD** (5-dars; repo'da `PRD.md`) · **talab** — agentga yoziladigan matn, uch qatori: qayerda · nima qilsin · nima buzilmasin (9-Moduldan) · **agent** (Antigravity) · **tekshirish** (o'z ishini ko'rish) · Neon SQL Editor · namuna akkauntlar (9.88) · agent tekshiruv yozuvlari — faqat u aytgan `id` lar bo'yicha o'chiriladi (9.92).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **real vaqt talabi** — talabning real vaqt funksiyasi uchun uch bo'limi: hodisalar · ulanish holatlari · chekka holatlar (2-ekran, uchinchi bo'lim ochilgandan keyin; ekranda: «Talabning real vaqt funksiyasi uchun uch bo'limi — real vaqt talabi.»). «Bu darsda» bilan chegaralanadi — kurs qolipi (tayanch 7.2a).
     PRD bilan ko'prik — bir gap, 2-ekran Mentori (topshiriq): «11-Modulda PRD yozgansiz — u nima qurilishini aytadi; real vaqt talabi esa o'zgarish qanday ko'rinishini.»
   - **chekka holat** — kam uchraydigan, lekin bo'ladigan vaziyat; talabda unda nima bo'lishi yoziladi (4-ekran, uch vaziyat ko'rilgandan keyin). 2-ekranda bo'lim sarlavhasi oddiy so'z bilan — «Kam uchraydigan vaziyatlar»; nom 4-ekranda beriladi va sarlavha «Chekka holatlar»ga almashadi (TAYANCHGA SAVOL 2).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **hodisa** — faqat ulanish hodisasi (2–5, 9-darslar ma'nosi); analitika hodisasi bu darsda yo'q. **holat** — faqat uch birikmada: «ulanish holati» · «chekka holat» · «yangi holat» (Mentorning chekka holat matni va kanonik gap — tayanchdan so'zma-so'z; TAYANCHGA SAVOL 9); «test holati», «holatga qarab» o'quvchi matnida yo'q.
   - **bo'lim** — talabning bo'lagi va `README.md` bo'limi (ikkalasi «hujjat bo'lagi» ma'nosida). **qadam** — bu darsda o'quvchi matnida yo'q (12-Modulda faqat foydalanuvchi yo'li — tayanch 2); amaliyot bloki bo'laklari «1 · Ochish», «2 · Prompt» … deb ataladi.
   - **vaziyat** — chekka holat ta'rifidagi oddiy so'z. **tekshirish** — o'z ishini ko'rish (telefonda, README'da); **sinov** — bu darsda yo'q. **so'raydi · so'rov** — ilova Backend'dan (asosiy fe'l).
   - **xabar** — bu darsda faqat hodisa ta'rifida («nomli xabar»); agentning javobi — «agentning so'zi», «agent javobi». **belgi** — faqat ulanish belgisi. **e'lon** — faqat o'yin e'loni. **push** — faqat `git push`.
   - **taxmin** — faqat o'quvchining bashorati («Taxminingiz: …»). Talabda yozilmagan narsa haqida — «agentning tanloviga qoladi» (hook, 2, 4-ekranlar, yakun, kartochka — bitta ibora; 03-FILTR 37: «agent o'zi tanlaydi» mutlaq edi — agent so'rashi ham mumkin).
   - **Ishlatilmaydi:** mini-PRD, spetsifikatsiya, spec, TZ, edge case, istisno (chekka holat ma'nosida), real-time, event, listener, reconnect, server (prozada), status, offline, onlayn, signal, voqea, «ekran» dars ekrani ma'nosida (T-064), A1/A2, `m10-03`, «Modul 12».
6. **Raqamlar (faqat tayanch 1.0, 1.2, 9.2, 9.20 — «Mentor misolida»):** namuna o'yin **Shanba, 18:00 · Mahalla maydoni · 8 / 10** → «9 / 10» (`oyinId: 1`); besh sabab; uch ulanish holati; uch chekka holat. Boshqa son yo'q, statistika deyilmaydi (T-043).
   Kutish vaqtlari — tayanch 9.19 so'zlari: belgi «Ulanmoqda…»ga o'tishi — «bir daqiqagacha» · qayta ulanish — «odatda bir necha soniyada» · Render'da yangi versiya — «bir necha daqiqa cho'zilishi mumkin».
7. **Xavfsizlik va maxfiylik (`00-TAQIQLAR.md` 2):** talabda, README'da va saqlash kalitida shaxsiy ma'lumot yo'q (odamlar roli bilan: o'yinchi, tashkilotchi) · agentga xato yuborilganda `.env` qiymatlari, token va kalitlar yuborilmaydi · `.env` — `git status` da ko'rinmaydi (A1 1-bo'lak) ·
   agent tekshiruv so'rovini **o'zi ochgan tekshiruv akkauntidan** yuboradi (namuna ma'lumot bilan — haqiqiy ism va raqam emas; tayanch 9.35); akkaunt va yaratgan yozuvlari — faqat u aytgan `id` lar bo'yicha o'chiriladi (umumiy «tekshiruv yozuvlarini o'chir» buyrug'i yo'q — 11-Modul 9.92) · juftlik yo'lida Expo akkaunti ma'lumoti boshqaga berilmaydi, sinfdosh o'z ma'lumotini yozmaydi — 11-Modulda yaratilgan namuna akkaunt bilan kiradi (9.34, 9.88).
8. **Vaqt (tayanch 4 «Vaqt», 7.10):** taqsimot — sarlavha ostida. Bloklar pilotda taymer bilan o'lchanadi; «Ulgurmasangiz» yo'li har blok pastida; yakun sarlavhasi holatga qarab (besh holat, 11-ekran).
   A1 da `git push` dan keyin Render yangi versiyani chiqargunicha (bir necha daqiqa) o'quvchi agent o'zgartirgan fayllardan ikki joyni topadi — kutish ishsiz o'tmaydi.
9. **Amaliyot bloki (tayanch 4):** o'quvchi 4 bo'lakning hammasini **o'z repo'sida, o'z mahsuloti va trekida** bajaradi (trek — `pm-m9d8-platforma.trek`; yo'q bo'lsa — blok tepasida «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi — 11-Modul 9.77); Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam» ortida — to'liq prompt); 5-bo'lak yo'q.
   **Talab zinapoyasi (tayanch 1.3, 4):** A1 — tayyor talab + bitta joy (`{hodisalar}` — mustaqil ishdan oldindan to'ldirilgan, tahrirlanadi) · A2 — bitta qatorni o'quvchi yozadi («Nima buzilmasin»). Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
   Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori). Push odati: `git status` → `git add <fayl>` → commit → `git push` (`git add .` emas). «Ortda qoldingizmi» — `m12-dars-03-done`. Har blokda **web-trek qatori** aniq.
10. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; telefon, Backend tuguni, konvert, talab varag'i — chizilgan (CSS/SVG), logotip yo'q; «Maydon Jamoa» — telefon ramkasida o'z rangida (11-Modul 4-dars quruvchisi tanlagan yashil — 11-Modul 9.62); belgi ranglari — pilot 02 bilan bir: «Ulangan» `ok` · «Ulanmoqda…» `accent` · «Ulanmagan» `ink2`; ✓ ✕ › → — belgilar.
    Matn o'lchovi (python bilan sanalgan, qavsda): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 · test variantlari ±15%.
11. **Fakt-manbalar (o'quvchi ko'rmaydi; to'liq — «Manbalar» bo'limida):** uzilish paytidagi hodisa qayta ulanganda kelmaydi, `connect` qayta ulanishda ham ishlaydi — tayanch 6 (socket.io) · Render'da yangi versiya chiqqanda ulanish uziladi — tayanch 6 ·
    brauzer faol bo'lmagan tabni «muzlatishi» mumkin — socket.io «Troubleshooting connection issues» (06.10 o'zim ochdim) · mobil ilovaning fondagi holati — React Native `AppState` (06.10; ulanish haqida hujjatda gap yo'q → Shubhali 1).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1-darsda lending chiqdi; 2-darsda ilova Backend'ga doimiy ulandi, belgi uch holatni ko'rsatadi, real vaqt oqimi sxemasi README'da — lekin Backend hali hodisa yubormaydi («hozircha faqat ulanish va belgi»). Bugun sxema talabga aylanadi va ro'yxat o'zi yangilanadi.
- **Dars ipi:** 0 — agentga nima yozasiz (ballsiz) → 2 — Mentor talabi bo'lim-bo'lim ochiladi: hodisalar · ulanish holatlari · kam uchraydigan vaziyatlar (bo'sh) → 3 — test: faqat hodisalar yozilsa, talab nimani aytmaydi →
  4 — uch vaziyat sahnada o'ynaydi, har biri talabga qator bo'lib tushadi → nom «chekka holat» → 5 — o'quvchi o'z talabini yozadi → A1 — hodisalar: ro'yxat pastga tortmasdan yangilanadi (boshqa akkaunt o'zgartiradi: mobil trekda — agent, web-trekda — o'zingiz) → A2 — ulanish holatlari va chekka holatlar: ekran va README →
  8 — yakuniy savol: bugun nima tekshirildi → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Talab va telefon»** (`TALAB_SAHNA` const → `TalabSahna`, dars bo'yi, 163/180; bitta manbadan: Mentor talabi, sahna holatlari, uch vaziyat):
  - **chapda telefon** «1-telefon · siz» (ramka ≈170×272, o'lcham barqaror — SABOQ 22; yorliq ramka ustida — SABOQ 23): «Maydon Jamoa» nomi o'z rangida; ekranlar 11-Moduldagidek — **O'yin** («‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · 10 joy: to'la doiralar va uzuq chiziqli bo'sh joylar · «Qo'shilaman») ·
    **O'yinlar** (tepasida ulanish belgisi — nuqta + yozuv, 2-darsdagidek faqat shu ekranda; kartalar). Holat qatorida samolyot belgisi (uchish rejimi), pastda bosh ekran chizig'i. Telefon yonida **Backend tuguni** (ichida «Database: N») va ular orasida chiziq — pilot 02 sahnasi bilan bir (tayanch 9.16).
  - **ikkinchi telefon** «2-telefon · boshqa o'yinchi» — faqat 0 va 4-ekranda (ikki telefonli sahna: chapda 1-telefon, o'rtada Backend, o'ngda 2-telefon — tayanch 9.16).
  - **o'ngda talab varag'i** — «Mentor talabi · Maydon Jamoa»: **Qayerda** · **Nima qilsin** (ichida uch bo'lim: 1 · Hodisalar · 2 · Ulanish holatlari · 3 · Kam uchraydigan vaziyatlar → «Chekka holatlar») · **Nima buzilmasin**. 0, 2, 4, 5, 8-ekranlar va bloklar o'ngi shu varaqni ishlatadi (5-ekranda — o'quvchining o'z varag'i).
  - **konvert** — so'rov («so'rov», «javob») va hodisa (`oyin-ozgardi` yorlig'i); hodisa konverti Backend'dan telefonga ochiq chiziq bo'ylab uchadi. Son almashganda bir lahza kattalashib qaytadi (11-Modul 9.14).
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (ishladi). `prefers-reduced-motion` da konvert yurmaydi, chiziq miltillamaydi — holatlar bir zumda almashadi (DE-200).
  - Ishlatilishi: 0 (ikki telefon + agentga bo'sh quti) · 1 (o'zi yuradi) · 2 (telefon + Backend + varaq) · 4 (ikki telefonli sahna + varaqning 3-bo'limi) · 5 (o'quvchining varag'i, bitta ustun) · A1, A2 o'ngi (telefon + README) · 8 (kichik varaq).
- **Mentor misolining holati (tayanch 3, 1.3):**

| | Dars boshida (`m12-dars-03-start` = `02-done`) | Dars oxirida (`m12-dars-03-done`) |
|---|---|---|
| Ulanish | ilova token bilan ulanadi; «O'yinlar» tepasida belgi | o'zgarmaydi |
| Hodisa | yuborilmaydi («hozircha faqat ulanish va belgi») | Backend besh o'zgarishdan keyin `oyin-ozgardi { oyinId, sabab }` yuboradi; ilova tinglaydi va `GET /oyinlar` ni qayta so'raydi |
| «8 / 10» | ekran ochilganda va pastga tortganda yangilanadi | + hodisa kelganda, pastga tortmasdan |
| Ulanish holatlari | belgi uch yozuvni ko'rsatadi | talabdagidek: ulanmoqda — ro'yxat ekranda qoladi · ulanmagan — pastga tortib yangilash ishlaydi |
| `README.md` «Real vaqt» | sxema jadvali (besh qator) | + «Ulanish holatlari» va «Chekka holatlar» bo'limlari |
| Chekka holatlar | — | talabda va README'da yozilgan; bu darsda tekshirilmagan (agent «bajardim» degan — tayanch 1.3, 1.5) |

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Ekran o'zi yangilanishi uchun nimani yozasiz?** (45) — dars nomi (DE-205)
- Mentor: 2-darsda ilovangiz Backend'ga ulandi, sxemangiz ham tayyor — agentga nima yozishingizni tanlang.
- Maket (chap): ikki telefonli sahna — «1-telefon · siz» va «2-telefon · boshqa o'yinchi», ikkalasida O'yin ekrani «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; o'rtada Backend («Database: 8»), 1-telefon bilan orasida ochiq chiziq (2-darsdagi doimiy ulanish).
  Sahna ostida — agentga yoziladigan bo'sh quti (Antigravity oynasi kabi chizilgan, logotipsiz; yorliq «Agentga talab»), ichida miltillovchi kursor.
- Variantlar (radio, o'ng; bir uzunlikda):
  - A — «Ro'yxat o'zi yangilansin» degan bitta gapni (44)
  - B — Sxemadagi har hodisani alohida qator qilib (42)
  - C — Hodisalarni va ulanish uzilgandagi ekranni (43)
- Javob — C: **Aynan!** Hodisalar va uzilishdagi ekran — talabning ikki bo'limi. Yana bitta bo'lim bor, uni ham ochasiz. (96)
- Javob — B: **Qiziq fikr!** Hodisalar — talabning bir qismi. Ulanish uzilganda ekranda nima turishini ham agent bilishi kerak. (110)
- Javob — A: **Qiziq fikr!** Bitta gapda qaysi o'zgarish va qaysi ekran ekani yozilmagan — bu agentning tanloviga qoladi. (92)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan gap qutiga yozilib chiqadi (harfma-harf); ostida uchta bo'sh qator uyasi chiqadi (uzuq chiziqli, ichida «?» — keyin to'ldiriladigan joy, U-041). Bo'lim nomlari yozilmaydi (2-ekran kashfiyoti, P-036).
  Uchala tanlovda vizual bir xil — payoff hech bir javobni rad etmaydi (KORPUS §21, §119).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant navbatma-navbat to'lqinda; tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: qo'l ko'tartirib so'rang: «2-darsda kimning ilovasida belgi «Ulangan» bo'ldi?» — bo'lmaganlar bugun 2-darsning birinchi amaliyotini tugatadi; ularda bu darsning ikki amaliyoti uyga qoladi — yakun shuni aytadi (03-FILTR 32). Uchala variant teng: hodisalar ham, uzilish ham — Mentor talabida bor.
✎ Hook — o'quvchi o'zi turgan joy (2-darsda ulandi, sxema bor) va o'z savoli (P-016). C javobining ikkinchi gapi va B javobining birinchi gapi bir fikr — yangi narsa ikkalasiga qo'shiladi; A javobi «agentning tanloviga qoladi» iborasini ochadi; C — «Aynan!» (T-067), lekin javob uchinchi bo'lim borligini aytadi: C ham to'liq talab emas (03-FILTR 26).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun agentga talab yozasiz va natijani tekshirasiz.** (52)
- Mentor: 2-darsdagi sxemangiz bugun talabga aylanadi. Kodni agent yozadi, qaror va tekshiruv — sizdan.
- Chap — kulrang yorliq (App.jsx osti, so'zma-so'z — P-015): «real vaqt talabi: hodisalar, ulanish holatlari, chekka holatlar»; ostida vizual bir marta o'zi yuradi (DE-200): talab varag'ining uch bo'limi kulrang, matnsiz → 1-telefonda «8 / 10» → «9 / 10» (pastga tortish belgisisiz). Varaq bo'limlari ochilmaydi (2-ekran kashfiyoti).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Mentor talabini bo'lim-bo'lim ko'rasiz · `talab`
  - 02 · Kam uchraydigan vaziyatlarni ko'rasiz · `chekka holatlar`
  - 03 · O'z mahsulotingiz uchun talab yozasiz · `real vaqt talabi`
  - 04 · Agent quradi, siz telefonda tekshirasiz · `tekshirish`
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m12-dars-03-start` · namuna `m12-dars-03-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: darsning og'ir qismi — Amaliyot 1 (Backend + ilova + Render). 2–4-ekranlarga ortiqcha vaqt bermang. 2-darsdagi sxema saqlanmagan o'quvchi mustaqil ishda hodisa qatorlarini o'zi yozadi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011): «real vaqt talabi», «chekka holatlar» — faqat kulrang yorliq va teglarda (P-015: qiyin atama kulrang yorliqqa); reja ta'rif aytmaydi va 2-ekran bo'limlarini ochmaydi. Mentorning birinchi gapi — 2-dars bilan ko'prik (pilot 02 yakuni: «sxemangizdagi hodisalar talabga aylanadi»).

## 2 · Mentor talabi  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · talab
- Sarlavha: **Mentor talabida real vaqt uchun nima yozilgan?** (46)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval javobingizni belgilang, keyin Mentor talabini bo'lim-bo'lim oching.
  - 0/3–1/3: Varaqdagi «Keyingi bo'lim»ni bosing — telefon shu bo'limni ko'rsatadi.
  - 2/3: Oxirgi bo'limni oching — uning qatorlari hozircha bo'sh.
  - 3/3 dan keyin: 11-Modulda PRD yozgansiz — u nima qurilishini aytadi; real vaqt talabi esa o'zgarish qanday ko'rinishini.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — zinapoya): **Agentga faqat «ro'yxat o'zi yangilansin» deb yozilsa, nechta narsa uning tanloviga qoladi?** · Hech narsa · Bir-ikkitasi · Ko'p narsa
  — tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi.
- Vizual: chapda **telefon** — «O'yinlar» (tepada belgi «Ulangan»; karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10») va yonida **Backend** («Database: 8») · o'ngda **talab varag'i** «Mentor talabi · Maydon Jamoa» — boshida faqat ikki qator kulrang ko'rinadi:
  **Qayerda:** `backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l; `mobil/` — ulanish fayli, «O'yinlar» va «O'yin» ekranlari. ·
  **Nima buzilmasin:** Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. (tayanch 1.3, so'zma-so'z)
  O'rtada **Nima qilsin:** — uch bo'sh bo'lim uyasi (uzuq chiziq, raqam bilan: 1 · 2 · 3). Ekranda uch blok: sahna · varaq · harakat tugmasi (SABOQ 26).
- **Harakat → Vizual o'zgarish** («Keyingi bo'lim» — varaq ostida, halqada; N/3):
  1. **1 · Hodisalar** → Backend'da «Database: 8» → «9», konvert `oyin-ozgardi · qoshildi` telefonga uchadi, telefondan «so'rov» konverti borib-keladi, kartada «8 / 10» → «9 / 10». Varaqda birinchi bo'lim sirg'alib kiradi (~1 s yashil):
     «o'yinchi «Qo'shilaman» ni bosadi · `oyin-ozgardi` · sabab `qoshildi` · hamma ulangan ilova · «8 / 10» → «9 / 10»» va ostida kichik kulrang qator «+ yana 4 qator — 2-darsdagi sxemadan».
  2. **2 · Ulanish holatlari** → telefon belgisi ketma-ket almashadi: «Ulangan» → «Ulanmoqda…» (chiziq uzuq, ro'yxat joyida) → «Ulanmagan» (chiziq yo'q; telefonda «↓» — pastga tortish ishlaydi) → yana «Ulangan»; har almashganda varaqda mos qator yonadi (tayanch 1.3, so'zma-so'z):
     «Ulangan — belgi «Ulangan», o'zgarishlar o'zi ko'rinadi.» · «Ulanmoqda — belgi «Ulanmoqda…», ro'yxat ekranda qoladi (eskirgan bo'lishi mumkin).» · «Ulanmagan — belgi «Ulanmagan», pastga tortib yangilash ishlaydi.»
  3. **3 · Kam uchraydigan vaziyatlar** → bo'lim sarlavhasi chiqadi, ostida uchta bo'sh qator (uzuq chiziq, ichida «?»); telefonda o'zgarish yo'q. Varaq endi to'liq ko'rinadi: Qayerda · Nima qilsin (uch bo'lim) · Nima buzilmasin.
- Nom qatori (3/3 dan keyin, bitta): Talabning real vaqt funksiyasi uchun uch bo'limi — real vaqt talabi. (68)
- Natija qatori (`QTaxmin`, xulosaning birinchi qatori — SABOQ 25): «Taxminingiz: … · Mentor talabida ko'p narsa yozilgan — yozilmasa, ular agentning tanloviga qolardi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu darsda real vaqt talabi uch bo'limdan iborat va «Nima qilsin» qatorini aniq qiladi. (86)
- Tugadi (199): harakat paneli yopiladi; varaq butun enga, fokusda (uchinchi bo'lim qatorlari bo'sh qoladi); vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Keyingi bo'lim (N/3) → Davom etish
- O'qituvchi eslatmasi: «Hodisalar» bo'limi — 2-darsdagi sxemaning o'zi, yangi narsa yozilmaydi. Sinfga savol: «Ulanish holatlari bo'limi yozilmasa, internet uzilganda agent ekranga nima qo'yadi?» — mumkin javob: agentning tanloviga qoladi (bo'sh ro'yxat, xato oynasi yoki boshqa narsa).
  Uchinchi bo'limni bu yerda tushuntirmang — uning qatorlari 4-ekranda vaziyatlar bilan yoziladi.
- ✎ Bitta g'oya (P-008): talabning «Nima qilsin» qatori real vaqt uchun uch bo'limga ochiladi. Holat o'quvchi bosgan bo'limlardan chiziladi (P-046). Atama — uchinchi bo'lim ochilgandan keyin (T-011). PRD ko'prigi — Mentor gapida bir marta (topshiriq).
  Varaqdagi «Qayerda» qatori — MD qarori (tayanchda faqat «Nima buzilmasin» bor; TAYANCHGA SAVOL 1). Jadval kataklaridagi «→» — tayanch 1.2 jadvalidan aynan (pilot 02 bilan bir).

## 3 · 1-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi misol yo'q — o'sha olam, Mentor talabining yarmi — P-002)
- Eyebrow: Mashq · 1-savol (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik varaq: «Nima qilsin: 1 · Hodisalar» — faqat shu bo'lim yozilgan, qolgan ikkitasi yo'q.
- Savol: **Talabda faqat Hodisalar bo'limi yozilgan. Bu talab nimani aytmaydi?** (9 so'z; 03-FILTR 37 — variantlar o'zgarmadi)
  - A — Hodisa qachon yuborilishini (27)
  - B — Hodisani qaysi ilovalar olishini (32)
  - C — Ulanish bor paytdagi o'zgarishni (32)
  - ✔ D — Ulanish yo'q paytdagi ekranni (29)
- Kalit: **D** (index 3). To'rttalasi bir shaklda («… -ni»); «ulanish» C va D da, «hodisa» A va B da; to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Ulanish yo'q paytdagi ekranni Hodisalar bo'limi aytmaydi. (57)
- Xato izohlari (≤60):
  - A: Hodisalar qatorining birinchi katagiga qarang. (46)
  - B: Qatordagi «Kim oladi» katagi nimani aytadi? (43)
  - C: Bu qatorning oxirgi katagida yozilgan. (38)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Gap Finder — birinchi urinishda to'g'ri.
- Izoh (MD): savol 2-ekrandagi bashoratning ballik ko'rinishi emas — boshqa holat (talabning yarmi), slayddan ko'chirib bo'lmaydi (§106). A, B, C — Hodisalar bo'limida bor narsalar (har biri darsning o'z qoidasi bo'yicha noto'g'ri — S-004); D — ulanish holatlari bo'limiga tegishli. Uchinchi bo'lim («Kam uchraydigan vaziyatlar») variantlarda yo'q — u hali bo'sh, nomi berilmagan.

## 4 · Kam uchraydigan vaziyatlar  ← QTushuncha
- Eyebrow: Tushuncha · vaziyat
- Sarlavha: **Ekran qachon kutilganidek yangilanmaydi?** (40)
- Mentor (bosqichga qarab, bitta gap):
  - bashoratgacha: Avval javobingizni belgilang, keyin uch vaziyatni birma-bir ko'ring.
  - 1/3: Birinchi telefonda uchish rejimini yoqing — shu payt boshqa o'yinchi qo'shiladi.
  - 2/3: Ulanish qayta tiklangan — ikkinchi telefonda «Qo'shilaman» ni bosing.
  - 3/3: Birinchi telefonda ilovani fonga olib keting — pastdagi bosh ekran chizig'ini bosing.
  - 3/3 dan keyin: Talab har vaziyatda nima bo'lishi kerakligini aytadi — qanday qilish agentning tanloviga qoladi.
- Bashorat (ballsiz, 181; S-015 — vaqt zinapoyasi): **Internet bir necha soniyaga uzilib qaytdi. Shu payt bo'lgan qo'shilish birinchi telefonda qachon ko'rinadi?** · O'sha zahoti · Ulanish qaytganda · Pastga tortganda — tanlangach yopilmaydi.
- Vizual: chapda **ikki telefonli sahna** (1-telefon «O'yinlar» — tepada belgi, karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · Backend · 2-telefon «O'yin» — «Qo'shilaman»; tayanch 9.16; sahna tepasida kulrang yorliq «Vaziyat N/3 · shunday bo'lishi mumkin») · o'ngda **talab varag'ining uchinchi bo'limi** — «3 · Kam uchraydigan vaziyatlar», uchta bo'sh qator (2-ekrandagi holat). Ekranda uch blok: sahna · bo'lim · harakat tugmasi.
  Har vaziyat boshida sahna yangidan: hamma joyda «8 / 10», «Database: 8», belgi «Ulangan».
- **Harakat → Vizual o'zgarish** (vaziyatlar tartibda, bittasi halqada; N/3):
  1. **Samolyot** (1-telefon holat qatori) → chiziq uziladi (uzuq, kulrang), belgi «Ulanmoqda…»; 2-telefonda «Qo'shilaman» o'zi bosiladi → «Database: 9»; konvert `oyin-ozgardi` uzilgan joyda so'nadi — yorliq «kelmadi»; ~2 s → uchish rejimi o'zi o'chadi, chiziq tiklanadi, belgi «Ulangan»;
     1-telefonda «8 / 10» qoladi, ustida kulrang yorliq «eski». Varaqning birinchi bo'sh qatoriga yoziladi (tayanch 1.3, so'zma-so'z): «Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.»
  2. **«Qo'shilaman»** (2-telefon; vaziyat boshida 1-telefon chizig'i bir lahza uzilib, ↻ bilan tiklanadi — yorliq «qayta tiklangan») → 2-telefonda «9 / 10», «Database: 9»; bitta konvert `oyin-ozgardi` 1-telefonga keladi → 1-telefondan ketma-ket ikki «so'rov» konverti ketadi, «9 / 10» ikki marta yonib o'chadi; telefon ostida kichik hisoblagich «so'rov: 2».
     Varaqda ikkinchi qator: «Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.»
  3. **Bosh ekran chizig'i** (1-telefon) → 1-telefon bosh ekranga o'tadi («Maydon Jamoa» belgisi — matnsiz oddiy yashil shakl + nom); 2-telefonda «Qo'shilaman» o'zi bosiladi → «Database: 9»; 1-telefon tomon konvert chizilmaydi — sahna faqat natijani ko'rsatadi (03-FILTR 5: fondagi ilovada nima bo'lishi bu darsda aytilmaydi); «Maydon Jamoa» belgisi halqaga o'tadi →
     bosilsa ilova ochiladi: «O'yinlar»da «8 / 10», yorliq «eski». Varaqda uchinchi qator: «Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.»
- Nom qatori (3/3 dan keyin, bitta): Kam uchraydigan, lekin bo'ladigan vaziyat — chekka holat: talabda unda nima bo'lishi yoziladi. (94) — shu payt bo'lim sarlavhasi «Kam uchraydigan vaziyatlar» → **«Chekka holatlar»** ga almashadi (bir lahza yashil).
- Natija qatori (`QTaxmin`): «Taxminingiz: … · bu misolda: pastga tortganda — talabda bu vaziyat hali yozilmagan edi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda uchta chekka holat yozildi: har qatorda vaziyat va unda nima bo'lishi kerakligi bor. (95)
- Qator (`QIzoh`, xulosadan keyin, bitta): Talabga yozilgan chekka holat — agentga topshiriq, bajarilgan ish emas. (71)
- Tugadi (199): sahna kichrayib chapga yig'iladi, «Chekka holatlar» bo'limi uch qatori bilan butun enga, fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Vaziyatni ko'ring (N/3) → Davom etish
- O'qituvchi eslatmasi: sahna — uch vaziyatning **mumkin bo'lgan** ko'rinishi (yorliq «shunday bo'lishi mumkin»); har telefonda har safar shunday bo'lmaydi. Vaziyatlar sababini bu darsda aytmang — bugun ular faqat talabga yoziladi.
  Birinchi vaziyat — 2-darsdagi «Ulanmoqda…» paytidagi hodisa (o'sha darsda: «keyin ham kelmaydi»). Sinfga savol: «Sizning ilovangizda qaysi vaziyat bo'lishi mumkin?» — javoblar 5-ekranning uchinchi bo'limiga.
- ✎ T-011 tartibi: avval uch vaziyat sahnada, keyin nom «chekka holat» (topshiriq: «avval vaziyat, keyin atama»). Chekka holat matnlari — tayanch 1.3 dan so'zma-so'z (T-008: olam ichidagi talab matni). Sahna o'quvchi bosgan vaziyatlardan chiziladi (P-046).
  Ikkinchi vaziyatdagi «so'rov: 2» va uchinchi vaziyat sahnasi (konvertsiz — faqat natija) — tayanchda sahnasi yo'q, MD qarori (TAYANCHGA SAVOL 3; Shubhali 1, 2). Bashorat — 1-vaziyatga; javob 2-dars bilimidan (2-dars 11-ekran testi), yangi narsa — talabga qator.

## 5 · O'z talabingiz  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Mahsulotingiz uchun real vaqt talabini yozing.** (46)
- Mentor: Bo'limlarni birma-bir to'ldiring — hodisalar 2-darsdagi sxemangizdan olindi. (`pm-m10d2-sxema` yo'q bo'lsa: «Bo'limlarni birma-bir to'ldiring — sxemangiz saqlanmagan, hodisa qatorlarini o'zingiz yozasiz.»)
- Tepada ixcham chiziq: «1 · Hodisalar · 2 · Ulanish holatlari · 3 · Chekka holatlar» (joriysi accent, tayyori ✓). Bitta ustun; bir vaqtda bitta katta karta, yozilgani yuqoridagi ixcham qatorga uchadi (SABOQ 29).
  - **Karta 1 · Hodisalar** — yo'riq: Bugun qaysi qatorlarni qurasiz? Belgilang.
    `pm-m10d2-sxema.qatorlar` har biri bitta qator (nuqta · hodisa · ekranda — uzun matn qisqartiriladi) va belgilash katagi; sukutda hammasi belgilangan.
    Kalit yo'q bo'lsa — «Qator qo'shish»: to'rt maydon — Kim nima qiladi · Hodisa · Kim oladi · Ekranda nima o'zgaradi (ipucha: Hodisa nomi va sababi); kamida bitta, ko'pi bilan beshta.
  - **Karta 2 · Ulanish holatlari** — yo'riq: Har holatda foydalanuvchi nimani ko'radi? Uch maydon, yorliqlari ekrandagi belgi yozuvi bilan: «Ulangan» · «Ulanmoqda…» · «Ulanmagan» (ipucha har birida: Belgi va ekranda nima turadi?).
  - **Karta 3 · Chekka holatlar** — yo'riq: Vaziyatni va unda nima bo'lishini yozing. Ikki maydon ochiq, «Yana qator» bilan uchinchisi (ko'pi bilan uchta; ipucha: Vaziyat — nima bo'lsin).
  «Keyingi bo'lim» → karta ixcham qatorga uchadi («1 · Hodisalar · 5 qator ✓»), keyingi karta ochiladi. 3-kartadan keyin «Saqlash».
- Tekshiruv (`QXato`, ≤60; bo'sh joy bloklaydi, qolgani — maslahat, qaror o'quvchida — S-008):
  - xato · hodisa belgilanmagan: Kamida bitta hodisa qatorini belgilang. (39)
  - xato · holat bo'sh: Bu holatda foydalanuvchi nimani ko'rishini yozing. (50)
  - xato · chekka holat ikkitadan kam: Kamida ikkita chekka holat yozing. (34)
  - xato · qatorda «—» yo'q (maslahat): Vaziyatdan keyin unda nima bo'lishini yozing. (45)
- Yordam (sukutda yopiq): Mentor talabidan — «Ulangan — belgi «Ulangan», o'zgarishlar o'zi ko'rinadi.» · «Ulanmoqda — belgi «Ulanmoqda…», ro'yxat ekranda qoladi (eskirgan bo'lishi mumkin).» · «Ulanmagan — belgi «Ulanmagan», pastga tortib yangilash ishlaydi.» ·
  «Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.» · «Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.» · «Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.» Ostida: Mentor misolidagi uch vaziyat — internet uzilib qaytishi, ulanish qayta tiklanishi, ilova fonda turishi — ulanishi bor ilovada bo'lishi mumkin: sizning ilovangizda har birida nima bo'lishi kerak?
  Web-trekda: «fonda» o'rniga — sayt brauzerning boshqa oynasida turganda; «pastga tortib yangilash» o'rniga — «Yangilash» tugmasi.
- **Harakat → Vizual o'zgarish:** belgilash → qator yonida ✓ va ixcham chiziqdagi son o'zgaradi; «Keyingi bo'lim» → karta ixcham qatorga uchadi; «Saqlash» → forma yopiladi, o'quvchining talab varag'i butun enga (199): Qayerda · Nima qilsin (uch bo'lim, ixcham) · Nima buzilmasin — «Amaliyot 2 da yozasiz» kulrang yorlig'i bilan; har bo'lim yonida ✎.
- Saqlanadi: `pm-m10d3-talab` — `{ hodisalar: [{ id, kimNima, hodisa, kimOladi, ekranda }], holatlar: { ulangan, ulanmoqda, ulanmagan }, chekka: [{ id, matn }] (2–3), buzilmasin: null }` (tayanch 8; `hodisalar` — belgilangan qatorlarning nusxasi `id` lari bilan, kalit yo'q bo'lsa — o'quvchi yozgan qatorlar, `id` — `q1`…; 3-dars `pm-m10d2-sxema` ga yozmaydi — 03-FILTR 20; `chekka.id` — `c1`, `c2`, `c3`, qayta ishlatilmaydi; `buzilmasin` — A2 da to'ldiriladi). Kalit nomi `ulanmoqda` — tayanch 8 dan aynan (TAYANCHGA SAVOL 5).
- Xulosa: Real vaqt talabingiz saqlandi: hodisalar, ulanish holatlari va chekka holatlar bilan. (85)
- Tugma (pastki): Bo'limlarni to'ldiring (N/3) → Davom etish
- Nishon: Brief Writer — «Saqlash» bosilganda (ish bajarilgan — P-048).
- Mentor rejimida (proyektorda): forma o'rnida Mentor talabi (`TALAB_SAHNA.mentor`) to'ldirilgan holda ko'rinadi.
- O'qituvchi eslatmasi: chekka holat — o'quvchi o'z ilovasida bo'lishi mumkin deb bilgan vaziyat; «to'g'ri» yoki «noto'g'ri» deb baholanmaydi, faqat «vaziyat — nima bo'lsin» shakli so'raladi. Mahsulotida boshqa odam o'zgartiradigan joy bo'lmagan o'quvchi — 2-darsdagi kabi o'zi ikkinchi qurilmada o'zgartiradigan ma'lumot.
  Holatlar maydoniga shaxsiy ma'lumot yozilmaydi — odamlar roli bilan (o'yinchi, tashkilotchi).
- ✎ Kalit oldin bor bo'lsa — kartalar to'ldirilgan holda ochiladi. `pm-m10d2-sxema` yo'q bo'lsa o'quvchi yozgan qatorlar faqat `pm-m10d3-talab.hodisalar` ga yoziladi — 2-dars kaliti o'zgarmaydi (03-FILTR 20).

## A1 · Amaliyot 1 — hodisalar  ← amaliyot bloki (≈25 daq; `screens[6]`)
- Eyebrow: Amaliyot 1 · hodisalar
- Sarlavha: **Ro'yxat pastga tortmasdan o'zi yangilansin.** (43)
- Mentor: Talab tayyor — Hodisalar qatorlari talabingizdan olindi, o'qib chiqing; «1 · Ochish»dan boshlang.
- Bo'laklar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda va trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi (ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»).
     Ilovangizni telefonda oching: belgi «Ulangan» bo'lishi kerak. Belgi yo'q bo'lsa — 2-darsdagi ulanish hali qurilmagan: avval o'sha darsning birinchi amaliyotini tugating.
  2. **Prompt** — «Hodisalar» qatorlarini o'qib chiqing (tahrirlasa bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: Backend — 2-darsdagi gateway va ma'lumot o'zgaradigan yo'llar; ilova — ulanish fayli va shu ma'lumotni ko'rsatadigan ekranlar.
     > Nima qilsin: shu hodisalarni qur (har qator: kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi):
     > **{hodisalar}**
     > Backend o'zgarishni Database'ga yozib tugatgandan keyin hodisani yuborsin; hodisada faqat o'zgargan yozuvning `id` si va sababi bo'lsin. Ilova hodisa kelganda shu qatorning «ekranda nima o'zgaradi» qismidagi ma'lumotni Backend'dan qayta so'rasin; bitta hodisa ochiq ekranni bir marta yangilasin.
     > Nima buzilmasin: avvalgi ekranlar va yo'llar avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     `{hodisalar}` — `pm-m10d3-talab.hodisalar` dagi qatorlar (har biri bir satr); bo'sh bo'lsa kulrang namuna: masalan: o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» o'rniga «9 / 10».
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l: `POST /oyinlar`, `POST /oyinlar/:id/qoshilish`, `POST /oyinlar/:id/tasdiq`, `POST /oyinlar/:id/chiqish`, `POST /oyinlar/:id/navbat`; `mobil/` — `src/ulanish.ts`, «O'yinlar» va «O'yin» ekranlari.
     > Nima qilsin: shu hodisalarni qur (har qator: kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi):
     > o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi
     > o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | oyin-ozgardi · sabab chiqdi | hamma ulangan ilova | son va ro'yxat yangilanadi
     > o'yinchi «Kelaman» ni bosadi | oyin-ozgardi · sabab tasdiqladi | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9»
     > o'yinchi navbatga yoziladi | oyin-ozgardi · sabab navbatga-yozildi | hamma ulangan ilova | «Navbatda: 1»
     > tashkilotchi o'yin e'lon qiladi | oyin-ozgardi · sabab elon-berildi | hamma ulangan ilova | ro'yxatda yangi karta
     > Backend o'zgarishni Database'ga yozib tugatgandan keyin `oyin-ozgardi` ni yuborsin — faqat `{ oyinId, sabab }`. Ilova hodisa kelganda `GET /oyinlar` ni qayta so'rasin va ochiq ekranni yangilasin; bitta hodisadan keyin `GET /oyinlar` bir marta so'ralsin — «O'yinlar» va «O'yin» shu javobdan o'qisin.
     > Nima buzilmasin: Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trek qatori (Yordamda): «Qayerda» — `prototip/` — `src/ulanish.js` va ma'lumot ko'rsatadigan sahifalar; «Nima buzilmasin» — «… «Yangilash» tugmasi qolsin».
  3. **Ishga tushirish** — `git status`: o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing → `git commit -m "real vaqt: hodisalar"` → `git push`.
     Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent o'zgartirgan fayllardan ikki joyni toping: Backend hodisani yuboradigan qator va ilovadagi tinglovchi (`ulanish.on(…)`).
     Yangi versiya chiqqanda ulanish uziladi: belgi bir lahza «Ulanmoqda…» bo'lib, odatda bir necha soniyada «Ulangan» ga qaytadi. Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda Netlify saytni odatda o'zi yangilaydi.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — agent nima desa ham, o'zingiz ko'ring. Avval belgi «Ulangan» ekanini ko'ring (Mentor misolida — «O'yinlar» tepasida), keyin o'zgarish ko'rinadigan ekranni oching (Mentor misolida — «O'yin», «Shanba, 18:00»); ekranga tegmang.
     O'zgarishni boshqa akkaunt qiladi. **Web-trekda — o'zingiz:** kompyuterda saytingizni yashirin oynada oching, 11-Modulda yaratgan ikkinchi namuna akkauntingiz bilan kiring, o'zgarishni qiling, keyin qaytaring — telefon brauzerida son «Yangilash»ni bosmasdan o'zgarishi kerak (03-FILTR 12). **Mobil trekda — agent** (uch xabar):
     (1) Agentga («Nusxalash»): «Tekshiruv uchun ilovaning ro'yxatdan o'tish yo'li bilan yangi akkaunt och — namuna ism va namuna raqam bilan, haqiqiy emas. Shu akkaunt nomidan Render'dagi Backend'ga so'rov yubor: {o'zgarish}. Akkaunt va yaratgan yozuvlaringning `id` larini ayt.»
         Joy yonidagi kulrang namuna: `{o'zgarish}` — masalan: Shanba, 18:00 o'yiniga (`oyinId: 1`) qo'shilish.
         Telefonga qarang: son pastga tortmasdan o'zgarishi kerak — odatda bir necha soniyada.
     (2) Mahsulotingizda o'zgarishni qaytaradigan yo'l bo'lsa (Mentor misolida — o'yindan chiqish), agentga: «Endi o'sha akkaunt nomidan Render'dagi Backend'ga o'zgarishni qaytaradigan so'rovni yubor.» — son yana o'zi o'zgarishi kerak.
     (3) Agentga: «Faqat hozir yaratgan tekshiruv akkauntini va yozuvlarini — aytgan `id` laring bo'yicha — o'chir.»
     Son o'zgarmasa — belgi turgan ekranga qaytib, belgiga qarang. «Ulangan» bo'lsa, agentga: «Tekshiruv so'rovidan keyin telefonda son o'zgarmadi: {nima ko'rdim}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     Agent Render'ga so'rov yubora olmasa yoki juftlikda ishlasangiz: sinfdoshingiz telefonida ilovangizni oching (Android'dagi Expo Go), o'zingiz 11-Modulda yaratgan ikkinchi namuna akkaunt bilan kiring va o'zgarishni sinfdoshingiz qilsin, keyin qaytarsin. Expo akkauntingiz ma'lumotini bermang.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, nom o'z rangida; uch kadr bir marta o'zi yuradi):
  - «O'yin» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» → chetga konvert `oyin-ozgardi` keladi → «9 / 10» (pastga tortish belgisi yo'q) → ikkinchi konvert → «8 / 10»
  - ostida agent javobi kartasi (qisqartirilgan): «Akkaunt: tekshiruv akkaunti (namuna) · O'yin: `oyinId: 1` · akkaunt va yozuv `id` lari aytildi» → «Akkaunt va yozuvlar o'chirildi: aytilgan `id` lar»
  - ostida fayl kartasi: `backend/` — gateway va besh yo'l (o'zgardi) · `mobil/src/ulanish.ts` (o'zgardi) · «O'yinlar», «O'yin» ekranlari (o'zgardi)
- Hammasi bajarilgach (yashil): Ro'yxat pastga tortmasdan yangilandi — buni telefonda o'zingiz ko'rdingiz. (74)
- Ulgurmasangiz (kichik, pastda): `git push` qilib, «3 · Ishga tushirish»gacha yeting va davom eting — telefonda tekshirish uyga qoladi, yakun nima qolganini aytadi.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-03-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi bo'limni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Nishon (bonus): Live List — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: mobil trekda tekshiruv so'rovini agent o'zi ochgan tekshiruv akkauntidan yuboradi — o'quvchi telefonga qaraydi (tayanch 1.3, 9.35); web-trekda o'quvchi o'zgarishni kompyuterdagi yashirin oynadan o'zi qiladi. Agent Render'ga so'rov yubora olishi — «qur» pilotida tekshiriladi. Agent qaysi akkaunt va qaysi `id` larni aytganini o'quvchi yozib oladi; o'chirishni faqat shu `id` lar bilan so'raydi. Telefon Render'dagi Backend'ga ulangan — tekshiruv so'rovi ham o'sha yerga borishi kerak (laptopdagi Backend yuborgan hodisa telefonga yetmaydi). Database bitta, shuning uchun tekshiruv yozuvlari qolmasin.
  Juftlik yo'lida iPhone'li sinfdosh Expo Go'da o'quvchining loyihasini ochmaydi (loyiha egasining Expo akkaunti kerak — 11-Modul) — web havola yoki Android.
- ✎ Talab zinapoyasi (tayanch 4): A1 — tayyor talab + bitta joy (`{hodisalar}` — 5-ekrandagi qarorning o'zi, tahrirlanadi). «Hodisa — qisqa, ilova qayta so'raydi» — modul qarori (Qaror-0 5), o'quvchining tayyor talabida ham (TAYANCHGA SAVOL 11).
  Tekshirish — tayanch 1.3, 9.35: agent o'zi ochgan tekshiruv akkauntidan so'rov yuboradi, `id` larini aytadi (parol manbai — agentning o'zi, 03-FILTR 15); web-trek — o'zi, ikkinchi namuna akkaunt bilan (03-FILTR 12); ikkinchi so'rov (qaytarish) — MD qarori (TAYANCHGA SAVOL 7). Render qatori — tayanch 6, 9.19 (TAYANCHGA SAVOL 12). Agentning «bajardim» degani — da'vo; isbot — telefondagi son (sinf 2c).

## A2 · Amaliyot 2 — holatlar va README  ← amaliyot bloki (≈18 daq; `screens[7]`)
- Eyebrow: Amaliyot 2 · holatlar va README
- Sarlavha: **Ulanish holatlari ekranda, talab README'da bo'lsin.** (51) (03-FILTR 19: blok uch ishni qiladi — holatlar, chekka holatlar talabi, README)
- Mentor: Endi «Nima buzilmasin» qatorini o'zingiz yozasiz — qolgani talabingizdan olindi; «1 · Ochish»dan boshlang.
- Bo'laklar (hammasi o'z repo'ngizda):
  1. **Ochish** — Amaliyot 1 `git push` qilingan, Render'da yangi versiya chiqqan. Ilovangizda belgi turgan ekranni oching. Pastdagi talabda ulanish holatlari va chekka holatlaringiz turibdi — o'qib chiqing.
  2. **Prompt** — «Nima buzilmasin» qatorini o'zingiz yozing: qaysi ishlar avvalgidek qolishi kerak (kulrang namunaga qarang), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: ulanish belgisi turgan ekran (2-darsda qo'yilgan); `README.md` — «Real vaqt» bo'limi.
     > Nima qilsin: ulanish holatlari — har holatda foydalanuvchi shuni ko'rsin:
     > Ulangan — {ulangan}
     > Ulanmoqda — {ulanmoqda}
     > Ulanmagan — {ulanmagan}
     > Chekka holatlar — har birida shunday bo'lsin:
     > {chekka holatlar}
     > `README.md` «Real vaqt» bo'limiga, jadvaldan keyin, ikki bo'lim qo'sh: «Ulanish holatlari» va «Chekka holatlar» — so'zlarimni o'zgartirma.
     > Nima buzilmasin: **{nima buzilmasin}** `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     `{ulangan}`, `{ulanmoqda}`, `{ulanmagan}`, `{chekka holatlar}` — `pm-m10d3-talab` dan oldindan yozilgan (tahrirlanadi). Joy yonidagi kulrang namuna: `{nima buzilmasin}` — masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin.
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — «O'yinlar» ekrani (`src/app/index.tsx`), ulanish belgisi shu yerda; `README.md` — «Real vaqt» bo'limi.
     > Nima qilsin: ulanish holatlari — har holatda foydalanuvchi shuni ko'rsin:
     > Ulangan — belgi «Ulangan», o'zgarishlar o'zi ko'rinadi.
     > Ulanmoqda — belgi «Ulanmoqda…», ro'yxat ekranda qoladi (eskirgan bo'lishi mumkin).
     > Ulanmagan — belgi «Ulanmagan», pastga tortib yangilash ishlaydi.
     > Chekka holatlar — har birida shunday bo'lsin:
     > 1) Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.
     > 2) Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.
     > 3) Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.
     > `README.md` «Real vaqt» bo'limiga, jadvaldan keyin, ikki bo'lim qo'sh: «Ulanish holatlari» va «Chekka holatlar» — so'zlarimni o'zgartirma.
     > Nima buzilmasin: Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trek qatori (Yordamda): «Qayerda» — `prototip/` dagi belgi turgan sahifa; «Ulanmagan» qatorida va «Nima buzilmasin» da — «Yangilash» tugmasi ishlaydi.
  3. **Ishga tushirish** — `git diff` — o'zgarish agent aytgan fayllardami; keyin `git status` → har faylni `git add <fayl>` bilan → `git commit -m "real vaqt: ulanish holatlari, README"` → `git push`. Render'da yangi versiya chiqishini kuting (bir necha daqiqa cho'zilishi mumkin).
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizdagi har holatni ko'ring:
     (1) Belgi «Ulangan» — ekran talabingizdagidek bo'lishi kerak.
     (2) Uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha). Ekranda talabingizda yozilgan narsa turishi kerak (Mentor misolida — ro'yxat joyida qoladi).
     (3) Uchish rejimini o'chiring: belgi «Ulangan» ga qaytishi kerak, odatda bir necha soniyada. Pastga torting — ro'yxat yangilanishi kerak.
     (4) «Ulanmagan» ni telefonda chaqirish qiyin. Agentga yozing: «Belgi qachon «Ulanmagan» bo'ladi va o'shanda ekranda nima turadi? Kodning qaysi fayli va qatori?» — javobni talabingizdagi qator bilan solishtiring. Bu — agentning so'zi va kod qatori: telefonda bu holatni ko'rmadingiz.
     (5) GitHub'da `README.md` ni oching: «Real vaqt» bo'limida ikki yangi bo'lim bor, so'zlaringiz o'zgarmagan.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     Kichik qator (kulrang, bo'lak ostida): Agent chekka holatlarni «bajardim» desa — bu hali uning so'zi: bugun siz ulanish holatlarini va README'ni tekshirdingiz.
     Web-trekda: saytingizni telefon brauzerida oching va uchish rejimini telefonda yoqing — kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi; «Ulanmagan» qatorida — «Yangilash» tugmasi.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤3 blok; bir marta o'zi yuradi):
  - telefon «O'yinlar»: belgi «Ulangan» → holat qatorida samolyot: «Ulanmoqda…», kartalar joyida → samolyot o'chdi: «Ulangan» → pastga tortish belgisi, ro'yxat yangilandi
  - README ko'rinishi (Markdown sahifasi kabi chizilgan): **Real vaqt** · jadval (besh qator, xira) · **Ulanish holatlari** (uch qator — Mentor talabidan) · **Chekka holatlar** (uch qator — tayanch 1.3)
- Hammasi bajarilgach (yashil): Ulanish holatlari talabingizdagidek; talab README'da — chekka holatlar bilan birga. (83)
- Saqlanadi: `pm-m10d3-talab.buzilmasin` — 2-bo'lakdagi qatordan («Nusxalash» bosilganda); dars ichida (ccProgress): `a1` (A1 oxirgi «Bajardim»), `a2` (A2 oxirgi «Bajardim») — yakun sarlavhasi uchun (TAYANCHGA SAVOL 14).
- Ulgurmasangiz (kichik, pastda): Prompt yuborilgan va `git push` qilingan bo'lsa — telefonda tekshirishni uyda qilasiz; yakun nima qolganini aytadi.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-03-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — `README.md` dagi «Ulanish holatlari» va «Chekka holatlar» bo'limlari.
- Nishon (bonus): State Check — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: uchish rejimi paytida boshqa o'zgarish qilinmaydi — bu darsda faqat belgi va ekran ko'riladi. Agent chekka holatlar haqida «bajardim» desa — e'tiroz shart emas, faqat «bu uning so'zi» ekani aytiladi.
  «Nima buzilmasin» — o'quvchining qarori: Mentor qatorini ko'chirgan o'quvchidan «Sizning ilovangizda bu ishlar bormi?» deb so'rang.
- ✎ Talab zinapoyasi: A2 — bitta qatorni o'quvchi yozadi («Nima buzilmasin»; 11-Modul 13-dars A2 naqshi). Holatlar va chekka holatlar — 5-ekrandagi o'quvchi matni (agent ularni so'zma-so'z README'ga ko'chiradi). «Ulanmagan» tekshiruvi — agent javobi + kod qatori (TAYANCHGA SAVOL 8).
  Chekka holatlar — tekshirilmaydi (tayanch 1.3 oxiri); ularni tekshiruvsiz «bajarildi» deb belgilaydigan joy darsda yo'q.

## 8 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; ikki blok birga: A1 tekshiruvi va A2 dagi chekka holatlar)
- Eyebrow: Yakuniy savol (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik talab varag'i (uch bo'lim, ixcham; «Chekka holatlar» yonida kulrang «3 qator»).
- Savol: **Agent «talabdagi hammasi tayyor» dedi. Bugungi tekshiruvda nima ko'riladi?** (9 so'z)
  - A — Internet uzilib qaytgach son yangilanganini (43)
  - ✔ B — Tekshiruv so'rovidan keyin son o'zgarganini (43)
  - C — Bitta o'zgarish bir marta yangilanganini (40)
  - D — Ilova fondan qaytganda yangi son turganini (42)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («… -ni»); «son» uchtasida; to'g'ri variant yolg'iz eng uzun emas. A, C, D — Mentorning uch chekka holati (bugun yozilgan, tekshirilmagan).
- To'g'ri izohi: Bu ko'rildi; chekka holatlar esa bugun tekshirilmadi. (53)
- Xato izohlari (≤60):
  - A: Bu chekka holat — bugun u faqat talabga yozildi. (48)
  - C: Bu ham chekka holat. Bugun uni telefonda ko'rdingizmi? (54)
  - D: Fondan qaytish — chekka holat: bugun faqat yozildi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol yangi holat — slayddan ko'chirib bo'lmaydi (§106); ikkala trekka to'g'ri keladi («tekshiruv so'rovi» — mobil trekda agentniki, web-trekda o'quvchining ikkinchi akkauntidan; 03-FILTR 12). Kalit ibora 3-ekran bilan takrorlanmaydi (S-008: 3 — talab nimani aytmaydi · 8 — talab yozilgani bajarilgani emas). Sinf 2c: yozilgan talab — bajarilgan ish emas.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Talab nimani aytmaydi» · 8 — «2 — Bugun nima tekshirildi»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, tayanch 7.1; belgi ✓ va nishon — faqat birinchi holatda):
  - Sarlavha · A1 ✓, A2 ✓: **Talab yozildi, tekshiruvda ro'yxat o'zi yangilandi.** (51)
  - Sarlavha · A1 ✓, A2 tugamagan: **Ro'yxat o'zi yangilandi — holatlar bo'limi qoldi.** (49)
  - Sarlavha · A1 tugamagan, A2 ✓: **Holatlar tayyor — ro'yxatni tekshirish qoldi.** (45)
  - Sarlavha · talab saqlangan, A1 va A2 tugamagan: **Talab tayyor — agentga berib, tekshirish qoldi.** (47)
  - Sarlavha · talab saqlanmagan: **Talab boshlandi — qolgan bo'limlarni tugating.** (46)
- Sarlavha ostida bitta qator (talab saqlangan bo'lsa, hamma holatda; N — `pm-m10d3-talab.chekka.length`): Talabingizda N chekka holat yozilgan.
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- **[07.10: yakunda KO'RSATILMAYDI — SABOQ E 50 (foydalanuvchi tasdig'i); fikr darsning ichki o'qi bo'lib qoladi]** Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Bu darsda real vaqt talabi uch bo'limdan iborat: hodisalar, ulanish holatlari va chekka holatlar; talabda yozilgani telefonda tekshirilmaguncha bajarilgan ish emas.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Hodisalar bo'limida kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yoziladi.
  - Ulanish holatlari bo'limida har holatda foydalanuvchi nimani ko'rishi yoziladi.
  - Chekka holat — kam uchraydigan, lekin bo'ladigan vaziyat; talabda unda nima bo'lishi yoziladi.
  - Talabda yozilmagan joy agentning tanloviga qoladi.
  - Agent yaratgan tekshiruv yozuvlari faqat u aytgan `id` lar bo'yicha o'chiriladi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z mahsulotingiz · Muddat: keyingi darsgacha
  - ① Darsda qolgan qismni tugating: {holatga qarab — Amaliyot 1 ni telefonda tekshiring · Amaliyot 2 ni bajaring}.
  - ② Uchish rejimini yana bir marta yoqib-o'chiring: belgi va ekran talabingizdagidek bo'ldimi? Farq bo'lsa — nima qildingiz va nima ko'rdingiz, bir qator yozib qo'ying.
  - ③ Talabingizda ikkita chekka holat bo'lsa — ilovangiz uchun uchinchisini o'ylab, darsdagi talabingizga va README'dagi «Chekka holatlar» bo'limiga qo'shing — bu talab: kod hali o'zgarmaydi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: jonli xabar va eslatma».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · chekka holatlar qatori · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): uyga vazifa — PM+PRAKT naqshi (11-Modul 13-dars `HwCard`; tayanch 4). «Keyingi dars» qatori — App.jsx `m10-04` nomi, so'zma-so'z (`00-NOMLAR.md`). ① bandi `a1`, `a2` dan yig'iladi (P-046); hammasi tugagan bo'lsa ① ko'rinmaydi. ③ bandi — talabda uchta chekka holat bo'lsa ko'rinmaydi.
  Yakun sarlavhasi va chekka holatlar qatori — faqat bajarilgan ish (tayanch 1.3: «Talabingizda uch chekka holat yozilgan»); keyingi dars ishi aytilmaydi (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Gap Finder!** (3-ekran, birinchi urinishda) — Talab nimani aytmasligini birinchi urinishda topdingiz
- **Brief Writer!** (5-ekran, «Saqlash») — Mahsulotingiz uchun uch bo'limli real vaqt talabini yozdingiz
- **Live List!** (A1, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan) — Ro'yxat pastga tortmasdan yangilanganini telefonda ko'rdingiz
- **State Check!** (A2, oxirgi «Bajardim» — bonus) — Ulanish holatlarini telefonda tekshirib, talabni README'ga yozdirdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 06.10: Gap Finder · Brief Writer · Live List · State Check — 0; «Spec» olindi — tayanch 2: «spec» ishlatilmaydi).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Talabning bo'limlari** — 1 Hodisalar: kim nima qilganda qaysi hodisa kimga boradi, ekranda nima o'zgaradi. · 2 Ulanish holatlari: har holatda foydalanuvchi nimani ko'radi. ·
  3 Talabda yozilmagan joy agentning tanloviga qoladi.
  — Sinfga savol: Internet uzilganda ekranda nima turishini kim hal qiladi — siz yoki agent?
- **8 · Bugun nima tekshirildi** — 1 Tekshiruv so'rovidan keyin son pastga tortmasdan o'zgardi. · 2 Uchish rejimida belgi va ekran talabdagidek. ·
  3 Chekka holatlar talabga yozildi — bugun tekshirilmadi.
  — Sinfga savol: Agent «hammasi tayyor» desa, nimaga ishonasiz: uning so'zigami yoki telefondagi songami?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Real vaqt talabi nima? | Talabning real vaqt funksiyasi uchun uch bo'limi | Bu darsda: hodisalar, ulanish holatlari, chekka holatlar |
| Hodisalar bo'limining har qatorida nima bor? | Kim nima qiladi, qaysi hodisa, kim oladi, ekranda nima o'zgaradi | 2-darsdagi real vaqt oqimi sxemasidan |
| Ulanish holatlari bo'limida nima yoziladi? | Har holatda foydalanuvchi nimani ko'rishi | Uch holat: ulangan, ulanmoqda, ulanmagan |
| Chekka holat nima? | Kam uchraydigan, lekin bo'ladigan vaziyat | Talabda unda nima bo'lishi yoziladi |
| Talabda yozilmagan joy kimning tanloviga qoladi? | Agentning | Shuning uchun ulanish holatlari ham yoziladi |
| Mentor misolida «Ulanmoqda…» paytida ekranda nima turadi? | Ro'yxat ekranda qoladi | Eskirgan bo'lishi mumkin |
| Mentor misolida «Ulanmagan» bo'lsa, nima ishlaydi? | Pastga tortib yangilash | Web-trekda — «Yangilash» tugmasi |
| Mentor talabida internet uzilib qaytsa, nima bo'lishi kerak? | Ro'yxat yangi holatni ko'rsatishi kerak | Bu misolda uzilish paytidagi hodisa keyin kelmaydi |
| PRD va real vaqt talabining farqi nimada? | PRD nima qurilishini aytadi; real vaqt talabi — o'zgarish qanday ko'rinishini | Bu kursdagi bo'linish; PRD — 11-Modul 5-darsida |
| Agent «chekka holatlarni bajardim» desa, bu nima? | Hali agentning so'zi | Talabda yozilgani — bajarilgani emas |
| Bugun ro'yxat o'zi yangilanishi qanday tekshirildi? | Boshqa akkaunt o'zgarish qildi | Mobil trekda — agent, web-trekda — o'zingiz; son pastga tortmasdan o'zgardi |
| Agent yaratgan tekshiruv yozuvlari qanday o'chiriladi? | Faqat u aytgan `id` lar bo'yicha | Umumiy «hammasini o'chir» buyrug'i berilmaydi |
- §145: har javobdagi so'z darsda bor (uch bo'lim — 2 · qator kataklari — 2, A1 · holatlar — 2, 5, A2 · chekka holat — 4 · agent tanlaydi — 0, 3 · «Ulanmoqda…», «Ulanmagan» — 2, A2 · uzilib qaytsa — 4 · PRD — 2 · agent so'zi — A2, 8 · tekshiruv — A1 · `id` — A1).
- S-027: har old tomon — to'liq savol, «?» bilan. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda.
1. Mentor misolida Backend hodisani qachon yuboradi? (A1)
   - ✔ A — Database'dagi o'zgarish tugagach
   - B — Database'dagi o'zgarishdan oldin
   - C — Ilova ochilib, so'rov kelganda
   - D — O'yinchi ro'yxatni tortganda
2. Mentor misolida «Ulanmoqda…» paytida ro'yxat nima bo'ladi? (2, A2)
   - A — Ekrandan o'chadi, bo'sh joy qoladi
   - ✔ B — Ekranda qoladi, eskirishi mumkin
   - C — O'zi har soniyada yangilanib turadi
   - D — O'rnida xato oynasi chiqib turadi
3. Belgi «Ulanmagan». Mentor misolida ro'yxatni qanday yangilaysiz? (2, A2)
   - A — Ilovani o'chirib qayta o'rnatasiz
   - B — Backend'ni qayta ishga tushirasiz
   - ✔ C — Ekranni pastga tortib yangilaysiz
   - D — Database'da sonni o'zgartirasiz
4. Qaysi biri chekka holat? (4)
   - A — O'yinchi «Qo'shilaman» tugmasini bosdi
   - B — Tashkilotchi yangi o'yin e'lon qildi
   - C — O'yinchi o'yin kuni «Kelaman» ni bosdi
   - ✔ D — Qo'shilish paytida internet uzildi
5. Talabdagi chekka holat qatori nimani aytadi? (4, 5)
   - ✔ A — Vaziyatni va unda nima bo'lishini
   - B — Vaziyatni va uni kim yaratganini
   - C — Vaziyatni va qaysi faylda turishini
   - D — Vaziyatni va necha marta bo'lganini
6. Ulanish yo'q paytda o'yinchi qo'shildi. Bu misolda hodisa keyin keladimi? (2, 4)
   - A — Ha, ulanish qaytgach o'zi keladi
   - ✔ B — Yo'q, qayta ulanganda kelmaydi
   - C — Ha, Backend uni saqlab turadi
   - D — Yo'q, uni ikkinchi telefon oladi
7. Mentor misolida ilova fondan qaytganda nima ko'rinishi kerak? (4)
   - A — Oxirgi ko'rilgan eski son
   - B — Bo'sh ro'yxat, kutish yozuvi
   - ✔ C — O'yinlarning yangi holati
   - D — Ulanish belgisi, ro'yxatsiz
8. Mobil trekda tekshiruv so'rovini kim yuboradi? (A1)
   - A — Notanish odam, o'z telefonidan
   - B — Tashkilotchi, o'z akkauntidan
   - C — Ilovaning o'zi, har daqiqada
   - ✔ D — Agent, tekshiruv akkauntidan
9. Tekshiruvdan keyin agent yaratgan yozuvlar qanday o'chiriladi? (A1)
   - ✔ A — Faqat agent aytgan `id` lar bo'yicha
   - B — Jadvaldagi hamma yozuvlar bilan birga
   - C — Ilova qayta ishga tushganda o'zi
   - D — Oxirgi o'nta yozuv bilan birdaniga
10. Real vaqt talabi PRD'dan farqli ravishda nimani aytadi? (2)
    - A — Mahsulot aynan kim uchun qurilishini
    - ✔ B — O'zgarish ekranda qanday ko'rinishini
    - C — Bosh raqam qanday va qachon sanalishini
    - D — Mahsulot qaysi muammoni hal qilishini
11. Bitta qo'shilish ekranni ikki marta yangiladi. Talabning qaysi qismi bu haqda? (4)
    - A — Hodisalar bo'limidagi qator
    - B — Ulanish holatlari qatori
    - ✔ C — Chekka holatlardagi qator
    - D — «Nima buzilmasin» qatori
12. Web-trekda belgi «Ulanmagan». Ro'yxat nima bilan yangilanadi? (A2)
    - A — Sahifani yopib qo'yish bilan
    - B — Agentga talab yozish bilan
    - C — Backend'ni o'chirish bilan
    - ✔ D — «Yangilash» tugmasi bilan
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran ↔ arena 10 (talab nimani aytmaydi ↔ PRD dan farqi), 8-ekran ↔ arena 8, 9 (nima ko'rildi ↔ kim yuboradi, qanday tozalanadi).
- 6-savolda «Ha» ikkita, «Yo'q» ikkita (S-006); «bu misolda» — socket.io sukut sozlamasi (tayanch 6; uzilishdagi paketni tiklash sukutda yoqilmagan — pilot 02 Manbalar 5). 2, 7-savollar distraktorlari — talabda yozilmagan ekran ko'rinishlari (bitta xato-sinf).
- **Fon so'zlari** (R-008, kodda {uz, ru}): real vaqt talabi · hodisalar · ulanish holatlari · chekka holat · `oyin-ozgardi` · «Ulangan» · «Ulanmoqda…» · «Ulanmagan» · talab · nima buzilmasin · README · Maydon Jamoa. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmRealtimeSpecLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m10d3-v1` (07.10: PM darslar pilot 1 bilan bir — `pm-m10dN-v1`), `lessonTitle` — «Ekran o'zi yangilanishi uchun nimani yozasiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · practice-own (mustaqil) · practice (A1) · practice (A2) · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 3, 8: 1 }; bloklar va mustaqil ish `practice: -1`, signal `PRACTICE_BASE + ekran`.
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2, s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + `QTaxmin`, yopilmaydigan ixcham qator — `TaxminIxcham`) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5 `QMustaqil` (`QQadamlar` 1/2/3 — yorliqlar «Hodisalar · Ulanish holatlari · Chekka holatlar») ·
   s6/s7 `QBlok` + `QPrompt` (`ScreenBlok` ulagichi, 4 bo'lak) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
4. **Bitta vizual `TalabSahna`** (180): `TALAB_SAHNA` const — `namunaOyin` (Shanba, 18:00 · Mahalla maydoni · 8 / 10; `oyinId: 1` — tayanch 9.20), `mentor` — Mentor talabi: `qayerda` (2-ekran qatori), `hodisalar` (besh qator — tayanch 1.2 jadvali, pilot 02 `MENTOR_SXEMA` bilan aynan; nusxa, import emas — darslar mustaqil),
   `holatlar` (uch qator — tayanch 1.3), `chekka` (uch qator — tayanch 1.3), `buzilmasin` (tayanch 1.3) · `vaziyatlar` (4-ekran: uch ssenariy — har biri sahna holatlari ketma-ketligi va vaqtlari) · `belgilar` (uch yozuv, ranglar `ok` · `accent` · `ink2` — pilot 02 bilan bir).
   Komponent: telefon (ramka ≈170×272, yorliq ramka ustida; O'yinlar / O'yin / bosh ekran; holat qatorida samolyot; pastki chiziq — bosh ekran), Backend tuguni («Database: N»), ixtiyoriy ikkinchi telefon, chiziq holatlari (`yoq` · `sorov` · `ochiq` · `uzilgan` · `tiklangan`), konvertlar (`sorov` / `javob` / `hodisa`), talab varag'i (Qayerda · Nima qilsin [3 bo'lim] · Nima buzilmasin).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: rt-bolim rt-samolyot rt-qoshil rt-bosh rt-belgi rt-ikon`). `prefers-reduced-motion` — o'tishsiz (DE-200). Logotip/emoji yo'q (D4).
5. s0: ikki telefon + bo'sh quti; variant tanlanganda gap qutiga harfma-harf yoziladi, ostida uch «?» uyasi.
6. s2: «Keyingi bo'lim» ×3 — (1) sahna: «Database: 9» → hodisa konverti → so'rov → «9 / 10»; varaqda 1-bo'lim (birinchi qator + «+ yana 4 qator — 2-darsdagi sxemadan») · (2) belgi ketma-ketligi (har ~1,2 s) va mos qator yonishi · (3) 3-bo'lim sarlavhasi «Kam uchraydigan vaziyatlar» + uch bo'sh qator. Nom qatori, `QTaxmin`; navbatdagi tugma `.navbat` halqa + pulsatsiya (SABOQ 11).
7. s4: uch ssenariy (avtomatik ketma-ketlik bitta bosishdan; har biri boshida sahna `8 / 10` ga qaytadi): 1 — samolyot → uzilish → 2-telefon qo'shilishi → konvert «kelmadi» → ~2 s → qayta ulanish → «eski» · 2 — ↻ holat → «Qo'shilaman» → bitta hodisa konverti → ikki so'rov, «so'rov: 2» ·
   3 — bosh ekran → 2-telefon qo'shilishi (1-telefonga konvert yo'q — 03-FILTR 5) → ikonka halqada → ochiladi, «eski». Har ssenariydan keyin varaqning N-qatoriga matn yoziladi (`TALAB_SAHNA.mentor.chekka[N]`); 3/3 dan keyin sarlavha «Chekka holatlar»ga almashadi. Sahna tepasida yorliq «Vaziyat N/3 · shunday bo'lishi mumkin».
8. s5 — ketma-ket karta formasi (SABOQ 29): karta 1 — `pm-m10d2-sxema.qatorlar` dan belgilash ro'yxati (sukutda hammasi ✓); kalit yo'q bo'lsa — «Qator qo'shish» (4 maydon, 1–5 qator); saqlashda qatorlar nusxasi faqat `pm-m10d3-talab.hodisalar` ga (`id` — `q1`…; `pm-m10d2-sxema` ga yozilmaydi — 03-FILTR 20) ·
   karta 2 — uch maydon (`ulangan`, `ulanmoqda`, `ulanmagan`) · karta 3 — 2–3 maydon (`/—/` maslahat). Bo'sh joy bloklaydi; qolgani `QXato` maslahat. Saqlash `pm-m10d3-talab` (tayanch 8; `buzilmasin: null`). Mentor rejimida — `TALAB_SAHNA.mentor`.
9. A1/A2 — `ScreenBlok` (skelet) 4 bo'lak; `prompt: [...]`, `{…}` joylar accent pill, kulrang namuna — `QPrompt` `namuna` maydoni (pilot 07 KOD 8 bilan bir). A1: joy `{hodisalar}` ← `pm-m10d3-talab.hodisalar` qatorlari («kimNima | hodisa | kimOladi | ekranda», har biri bir satr), tahrirlanadi.
   A2: oldindan yozilgan qatorlar `{ulangan}` · `{ulanmoqda}` · `{ulanmagan}` (← `holatlar.ulanmoqda`) · `{chekka holatlar}` (raqamlangan), joy `{nima buzilmasin}` → `pm-m10d3-talab.buzilmasin` («Nusxalash» bosilganda).
   **KOD (qolipda yo'q):** A1 4-bo'lakda web-trek yo'li (yashirin oyna, ikkinchi namuna akkaunt — matn) va mobil trek uchun **uchta qo'shimcha xabar qutisi** («Nusxalash» bilan): (1) tekshiruv so'rovi — joy `{o'zgarish}` (kulrang namuna), (2) qaytarish, (3) `id` bo'yicha tozalash · A2 4-bo'lakda **savol qutisi** («Ulanmagan» haqida, «Nusxalash» bilan).
   «Davom etish» 3-bo'lak «Bajardim»idan keyin ochiladi («Ulgurmasangiz» yo'li); dars ichida `a1`, `a2` — oxirgi «Bajardim»da (yakun uchun). Trek (`pm-m9d8-platforma.trek`): `web` — web-trek qatorlari ko'rinadi; kalit yo'q bo'lsa — blok tepasida trek tugmalari (11-Modul 9.77).
   `ortda`: ikkala blokda `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-03-done`.
10. s3/s8 `QTest` — matn yuqoridagidek; s3 ustida kichik varaq (faqat 1-bo'lim), s8 ustida kichik varaq (uch bo'lim). `RECAPS` { 3, 8 } (3 karta + `ask`); `Q_LABELS` { 3, 8 }.
11. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s3 birinchi urinish → Gap Finder · s5 «Saqlash» → Brief Writer · A1 oxirgi «Bajardim» → Live List · A2 oxirgi «Bajardim» → State Check.
12. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — s10 alohida ekranda.
13. s11 `QYakun`: `recap` 5 qator, «Bugungi asosiy fikr» `small`; sarlavha **besh holat** — `a1`, `a2` va `pm-m10d3-talab` borligidan (P-046); ostida «Talabingizda N chekka holat yozilgan.» (`chekka.length`); `uyga` — `HwCard` (alohida `.homework.jsx` yo'q; ① bandi holatdan, ③ — `chekka.length < 3` bo'lsa); `keyingi` — «Loyiha kuni: jonli xabar va eslatma».
14. App.jsx `m10-03` qatoriga `comp: PmRealtimeSpecLesson` — «qur» bosqichida (asosiy seans; nom va osti o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (3, 8).
- Darvozalar: `npm run gates -- src/10-Modull/PmRealtimeSpecLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` · `lint:jsx` 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/390 · surat 1280 + 393; har ekran 4 savol (SABOQ 30) hisobotda.

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m12-dars-03-start` → `m12-dars-03-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m12-dars-03-start`** = `m12-dars-02-done` (tayanch 3): gateway (ulanish token bilan), `mobil/src/ulanish.ts`, «O'yinlar»da belgi, `README.md` «Real vaqt» (sxema jadvali); hodisa yuborilmaydi.
2. **`m12-dars-03-done`** = start + ikki commit (A1, A2) aynan A1/A2 «Yordam» promptlaridagidek: besh yo'l Database'ga yozib tugatgandan keyin `oyin-ozgardi { oyinId, sabab }` ni hamma ulanganlarga yuboradi · ilovada `ulanish.on('oyin-ozgardi', …)` → `GET /oyinlar` qayta so'raladi («O'yinlar», «O'yin») ·
   holatlar: «Ulanmoqda…» da ro'yxat tozalanmaydi; «Ulanmagan» da pastga tortish ishlaydi · `README.md` «Real vaqt»ga «Ulanish holatlari» (uch qator) va «Chekka holatlar» (uch qator) bo'limlari.
3. ⚠️ **Chekka holatlar Mentor kodida** — tayanch 1.5: `m12-dars-05-start` (= `04-done`) da agent «uchala chekka holatni bajardim» degan, tekshiruv esa muammolarni ko'rsatadi (1 — qayta ulanganda qayta so'ralmaydi · 2 — tinglovchi har ulanishda qayta qo'shilgan). Bu ikki muammo `03-done` da ham bor deb oldim: «qur» da agentning chekka holatlar ishi tekshirilmaydi va tuzatilmaydi (TAYANCHGA SAVOL 17).
4. README «Darslar va teglar» jadvaliga 3-dars qatori: «real vaqt talabi: hodisalar yuboriladi va tinglanadi; ulanish holatlari; README — holatlar va chekka holatlar».
5. Muhrdan oldin: Render'da deploy; telefonda «O'yin» ochiq → agent o'zi ochgan tekshiruv akkauntidan `POST /oyinlar/1/qoshilish` → «9 / 10» pastga tortmasdan (qancha vaqtda — jurnalga) → `POST /oyinlar/1/chiqish` → «8 / 10» → tekshiruv akkaunti va yozuvlari `id` bo'yicha o'chirildi; bitta hodisadan keyin `GET /oyinlar` bir marta (5-darsdagi «ikki marta» faqat qayta ulanishdan keyin ko'rinishi uchun — 03-FILTR 11); uchish rejimi → «Ulanmoqda…», ro'yxat joyida → «Ulangan».

## Manbalar (o'zim tekshirgan rasmiy sahifalar — 06.10.2026; o'quvchiga ko'rinmaydi)
- socket.io — `socket.io/docs/v4/troubleshooting-connection-issues/` (06.10 ochdim): «the user may lose connection or switch from WiFi to 4G, in case of a mobile browser» · «the browser itself may freeze an inactive tab» · «When a browser tab is not in focus, some browsers (like Chrome) throttle JavaScript timers, which could lead to a disconnection by ping timeout» → 4-ekran 3-vaziyat va web-trek Yordami («boshqa oynada turganda»).
- React Native — `reactnative.dev/docs/appstate` (06.10 ochdim): `background` — «The app is running in the background. The user is either: in another app · on the home screen …»; `change` hodisasi holat o'zgarganda keladi. Fondagi ilovada ulanish nima bo'lishi bu sahifada yozilmagan → Shubhali 1.
- Tayanch 6 orqali (qayta ochilmadi): socket.io `delivery-guarantees` — «at most once», uzilgan mijoz o'tkazib yuborgan hodisa qayta ulanganda kelmaydi (4-ekran 1-vaziyat, arena 6) · `client-socket-instance` — `connect` qayta ulanishda ham ishlaydi; tinglovchini `connect` ichida qo'shmaslik haqida ogohlantirish (4-ekran 2-vaziyatning mumkin sababi — o'quvchiga aytilmaydi; REPO 3) ·
  Render `docs/websocket` — yangi versiya chiqqanda ulanish uziladi (A1 3-bo'lak) · uzilishni payqash 45 s gacha, qayta ulanish 1 → 5 s — pilot 02 Manbalar 3, 5 (tayanch 9.19 so'zlari).
- Kursdagi so'zlar (grep, 06.10): «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» — 11-Modul `14-FeatureThree-v3.md` (9.92) · PRD ta'rifi va `PRD.md` — 11-Modul `05-PmPrd-v3.md` · namuna akkauntlar va ikkinchi akkaunt — 11-Modul tayanchi 9.34, 9.88 · belgi, sahna, `MENTOR_SXEMA`, `pm-m10d2-sxema` — pilot `02-WebSocketBasics-v3.md`.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor talabining «Qayerda» va «Nima qilsin» qatorlari** — tayanch 1.3 da faqat «Nima buzilmasin» so'zma-so'z bor. Yozdim: «Qayerda: `backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l; `mobil/` — ulanish fayli, «O'yinlar» va «O'yin» ekranlari.» Uch bo'lim — «Nima qilsin» ichida (tayanchdagi «9-Modul uch qatori o'z joyida» ni shunday tushundim). Tayanchga kiritilsinmi?
2. **Uchinchi bo'limning 2-ekrandagi sarlavhasi «Kam uchraydigan vaziyatlar»** (T-011: «chekka holat» — avval vaziyat, keyin atama), 4-ekranda «Chekka holatlar»ga almashadi. Reja ekranining kulrang yorlig'ida «chekka holatlar» App.jsx ostidan aynan turadi (P-015) — bu atamaning birinchi ko'rinishi, lekin izohsiz yorliq. Ma'qulmi?
3. **4-ekran sahnalari** (03-FILTR 4, 5: 3-vaziyat endi konvertsiz — faqat natija «8 / 10 · eski»; 2-vaziyat — «shunday bo'lishi mumkin» yorlig'i bilan qoldi) — tayanchda chekka holat matnlari bor, ularning sahnasi yo'q. 2-vaziyat: bitta hodisadan keyin ikki «so'rov» va «9 / 10» ikki marta yonadi; 3-vaziyat: ilova fonda — hodisa «ilova fonda» yorlig'i bilan so'nadi. Sahna tepasida «shunday bo'lishi mumkin». Sabab aytilmaydi (5-dars mavzusi).
4. **Bloklar bo'linishi:** A1 — Hodisalar bo'limi (joy `{hodisalar}` — 5-ekrandan oldindan to'ldirilgan); A2 — ulanish holatlari + chekka holatlar + README ikki bo'limi, o'quvchi yozadigan qator — «Nima buzilmasin» (→ `pm-m10d3-talab.buzilmasin`). Tayanch 1.3 «A2 — ulanish holatlari ekranda (bitta qatorni o'quvchi yozadi)» — qaysi qator ekani yozilmagan edi.
5. **Kalit `holatlar.ulanmoqda`** — tayanch 8 dan aynan qoldirdim (4, 5-darslar ham shu sxemani o'qiydi). 9.1 bo'yicha holat nomi «ulanmoqda» — kalit `ulanmoqda` ga almashtirilsinmi (8-bo'lim bitta joyda)?
6. ✅ **Hal qilindi (03-FILTR 20):** 3-dars `pm-m10d2-sxema` ga yozmaydi; `pm-m10d3-talab.hodisalar` — qatorlar nusxasi `id` lari bilan (tayanch 8 yangilandi). Eski matn: **`pm-m10d2-sxema` yo'q bo'lsa** — 5-ekranda o'quvchi yozgan hodisa qatorlari shu kalitga ham yoziladi (`id` — `q1`…), shunda `pm-m10d3-talab.hodisalar: [id]` ishlaydi. 3-dars boshqa darsning kalitiga yozadi — ruxsatmi? Muqobil: `pm-m10d3-talab` ga `hodisaQatorlar` maydoni.
7. **A1 tekshiruvidagi ikkinchi so'rov — qaytarish** (Mentor misolida `…/chiqish`): son yana o'zi o'zgaradi (ikkinchi hodisa), keyin tozalash. Tayanch 1.3 da faqat qo'shilish va `id` bo'yicha o'chirish bor. So'rov **Render'dagi** Backend'ga yuboriladi deb aniq yozdim: telefon o'shanga ulangan, laptopdagi Backend yuborgan hodisa telefonga yetmaydi.
8. **«Ulanmagan» tekshiruvi** — telefonda chaqirilmaydi; agentdan «qachon va ekranda nima» va kod qatori so'raladi, «bu agentning so'zi» deb belgilangan (pilot 02 TS 8 bilan bir yo'l).
9. **«holat» uch birikmada** — «ulanish holati», «chekka holat», «yangi holat» (Mentorning chekka holat matnlari va kanonik gap — tayanchdan so'zma-so'z). Topshiriqdagi «holat bu darsda faqat ulanish holati» — «chekka holat» atamasi va «yangi holat» iborasini istisno deb oldim.
10. **«Database'ga yozib tugatgandan keyin hodisani yuborsin»** — o'quvchining tayyor talabida va Mentor Yordamida (02 final tartibi bilan bir: «avval Database'dagi o'zgarish tugaydi, keyin hodisa» — 02-FILTR 2); tayanch 1.3 da yo'q.
11. **«Ilova hodisa kelganda yangi holatni Backend'dan qayta so'rasin»** — o'quvchining tayyor talabida (Qaror-0 5 — modul qarori). O'quvchining hodisasi ma'lumotni o'zi olib kelsa, u bu gapni tahrirlaydi — ✎ da shunday; alohida yo'riq yozmadim.
12. **Render qatori A1 da** — «Yangi versiya chiqqanda ulanish uziladi: belgi bir lahza «Ulanmoqda…» bo'lib, odatda bir necha soniyada «Ulangan» ga qaytadi» (tayanch 6, 9.19). 5-darsning buzish usuliga tegadi, lekin sabab va tuzatish aytilmaydi — o'quvchi belgini ko'rib xavotirlanmasligi uchun.
13. **Juftlik yo'li** — sinfdosh telefonida o'quvchining 11-Modulda yaratgan ikkinchi namuna akkaunti bilan; 7-darsgacha ro'yxatdan o'tishda telefon so'raladi — yangi akkaunt ochilmaydi, shuning uchun raqam yozilmaydi.
14. **Yakun holatlari** (besh sarlavha) va «Talabingizda N chekka holat yozilgan.» qatori; `a1`, `a2` bayroqlari dars ichida (ccProgress) — `pm-m10d3-talab` sxemasida yo'q. 4, 5-darslar «agentga berilganmi» ni bilishi kerak bo'lsa — sxemaga `berildi: bool` qo'shish taklifi. ✅ 03-FILTR 22: grep — 04 faqat `buzilmasin`, 05 faqat `chekka` va `buzilmasin` ni o'qiydi; `a1`, `a2` dars ichida qoladi, maydon qo'shilmaydi.
15. **Uyga vazifa** — uch band (tugatish · uchish rejimini qayta tekshirish · uchinchi chekka holat); mazmuni mening qarorim.
16. **Nishon nomlari** Gap Finder · Brief Writer · Live List · State Check (grep 0).
17. ⚠️ **Mentor repo'si `m12-dars-03-done` da chekka holatlar to'liq bajarilmagan bo'ladi** (REPO 3) — tayanch 1.5 dagi `05-start` holati bilan izchil bo'lishi uchun. «Ortda qoldingizmi» bilan Mentor misolini ochgan o'quvchi ham shu kodni oladi. Tasdiqlansinmi? (03-FILTR 3: auditor qabul qildi, shart — 5-dars aynan shu holatdan boshlanishi tayanchda muhrlansin → tayanch 9.35 c.)
18. **Reja matni va teglar** (`talab` · `chekka holatlar` · `real vaqt talabi` · `tekshirish`); sarlavha «Bugun agentga talab yozasiz va natijani tekshirasiz.»
19. **Hook variantlari** (uch: bitta gap · hodisalar · hodisalar va uzilgandagi ekran) va «Aynan!» — C da (T-067); 03-FILTR 26: C javobi endi «yana bitta bo'lim bor» deydi.
20. **2-ekran bashorati** («nechta narsa agentning tanloviga qoladi» — hech narsa / bir-ikkitasi / ko'p narsa; 03-FILTR 37) va natija «Mentor talabida ko'p narsa yozilgan — yozilmasa, ular agentning tanloviga qolardi».
21. **Mustaqil ish chegaralari:** hodisa qatori 1–5 (kalit yo'q bo'lsa), chekka holat 2–3 (tayanch 8), «—» shakli — faqat maslahat.
22. **Web-trek chekka holatining so'zi** — «sayt brauzerning boshqa oynasida turganda» (socket.io troubleshooting: brauzer faol bo'lmagan tabni muzlatishi mumkin) — Yordamda bir gap.

## Shubhali joylar (ishonchim komil emas)
1. **Ilova fonda — hodisa yetmasligi** (4-ekran 3-vaziyat; 03-FILTR 5 dan keyin sahnada sabab ko'rsatilmaydi — faqat natija): brauzer uchun socket.io hujjatida bor (faol bo'lmagan tab, taymerlar sekinlashishi); React Native ilovasi fonda turganda ulanish uziladimi yoki ochiq qoladimi — `AppState` sahifasida yozilmagan, qurilmada sinalmagan. Sahnada «shunday bo'lishi mumkin»; o'quvchiga «kelmaydi» deyilmagan.
2. **2-vaziyat («so'rov: 2»)** — tinglovchi `connect` ichida qo'shilsa shunday bo'ladi (socket.io ogohlantirishi); agent qanday yozishi noma'lum. Mentor repo'sida shunday bo'lishi «qur» ga bog'liq (TAYANCHGA SAVOL 17).
3. **Agent tekshiruv so'rovini yubora oladimi** — parol masalasi hal qilindi (03-FILTR 15, tayanch 9.35: agent akkauntni o'zi ochadi, parolni o'zi biladi; 11-Modul seed akkauntlari ishlatilmaydi). Ochiq qolgani — tarmoq: agent Render manziliga so'rov yubora oladimi («qur» pilotida); bo'lmasa — juftlik yo'li. Web-trek agentsiz (03-FILTR 12). Yangi akkaunt yaratilsa, 7-darsgacha unga namuna telefon kerak bo'ladi — agent hal qiladi. Agent o'z muhitidan Render manziliga so'rov yubora olishi (tarmoq ruxsati) ham shu yerda; pilotda ko'riladi.
4. **Expo Go + uchish rejimi** (A2 4-bo'lak) — Metro bilan aloqa ham uziladi; ilova ishlayveradimi — qurilmada sinalmagan (pilot 02 Shubhali 1 bilan bir). ⛔ «qur» darvozasi (tayanch 9.34 i; 03-FILTR 17).
5. **«Ulanmoqda…» paytida ro'yxat ekranda qolishi** — 2-darsda agent qanday yozganiga bog'liq (tozalashi yoki xato oynasi chiqarishi mumkin edi); A2 talabi shuni so'raydi, tekshiruv (2) ko'rsatadi.
6. **Belgi «Ulanmoqda…» ga o'tish vaqti** — hujjatda 45 s gacha; o'quvchi matnida «bir daqiqagacha». Render deploy vaqti — «bir necha daqiqa» (o'lchanmagan).
7. **1280×800 ga sig'ish** — 2-ekran varag'i (Qayerda + uch bo'lim + Nima buzilmasin) va 4-ekran (ikki telefonli sahna + bo'lim) — vizual bosqichda; sig'masa 2-ekranda «Qayerda» va «Nima buzilmasin» bir qatorga qisqaradi.
8. **A1 vaqti (≈25 daq)** — Backend + ilova + Render kutishi + uch xabarli tekshiruv; pilotda taymer bilan. «Ulgurmasangiz» yo'li bor.
9. **Agent «Ulanmagan» haqidagi javobi** (A2 4-bo'lak (4)) — tekshirilmagan da'vo; o'quvchi kod qatorini ochib ko'rishi mumkin, lekin 13 yoshli o'quvchi uni o'qiy olishi har doim ham emas.
10. **Juftlik yo'lidagi ikkinchi namuna akkaunt** — har o'quvchida 11-Modulda yaratilganmi (11-Modul 12-darsi, «Hisobdan chiqish» bilan) — bo'lmasa juftlik yo'li o'tkaziladi, asosiy yo'l — agent.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7)
1. [x] Yakun holatga qarab — 11-ekran: besh sarlavha; ✓ va nishon faqat A1 ✓ + A2 ✓ da; sarlavha o'quvchi ishini aytadi; «Talabingizda N chekka holat yozilgan.» — faqat bajarilgan ish; ① uyga vazifa holatdan.
2. [x] Da'vo isbot emas: a) «Bu darsda …» — real vaqt talabi uch bo'limi (2-ekran xulosasi, asosiy fikr, kartochka izohi) · b) Mentor misoli umumiy qolip emas — «Mentor misolida» (A1/A2 Yordam, arena 1–3, 7), `{…}` joylari o'quvchi mahsulotidan, «qaytaradigan yo'l bo'lsa» (A1 (2)), «boshqa odam o'zgartiradigan joy bo'lmasa» (5-ekran eslatmasi) ·
   c) kafolat yo'q — «o'zgarishi kerak», «odatda bir necha soniyada», «bir daqiqagacha cho'zilishi mumkin», «bir necha daqiqa cho'zilishi mumkin», «shunday bo'lishi mumkin» (4-ekran sahnasi) · d) agentning «bajardim» degani — «hali uning so'zi» (A2 4-bo'lak, 8-ekran, kartochka); chekka holatlar tekshirilmagan deb ochiq (8-ekran, yakun); «Ulanmagan» — agent so'zi + kod qatori.
3. [x] Maxfiy qiymat chiqmaydi — A1 1-bo'lak `.env` `git status` da yo'q; har xato gapida «`.env` qiymatlari, token va kalitlarni emas» (A1 3, A2 3); promptlarda «`.env` ga tegma»; Expo akkaunti berilmaydi (A1 juftlik qatori); README va kalitda shaxsiy ma'lumot yo'q (5-ekran eslatmasi).
4. [x] Tashqi xizmat faqat rasmiy hujjat — socket.io va Render faktlari tayanch 6 dan; o'zim ochgan ikki sahifa «Manbalar»da; Render sahifasidagi tugma nomlari yozilmagan («Render sahifasida tugashini kuting»); tekshirilmaganlar — Shubhali 1, 3, 4, 6.
5. [x] Har sonning manbasi va o'lchovi — sonlar faqat Mentor misolidan («8 / 10», `oyinId: 1`, besh sabab); «so'rov: 2» — sahna hisoblagichi (o'lchov birligi — so'rov); kutish vaqtlari — tayanch 9.19 so'zlari; statistika yo'q.
6. [x] Tayanchda yo'q narsa to'qilmaydi — Mentor holatlari, chekka holatlar, «Nima buzilmasin», hodisalar jadvali — tayanchdan aynan; o'zim qaror qilganlar — TAYANCHGA SAVOL 1–22.
7. [x] Saqlash kaliti — `pm-m10d3-talab` tayanch 8 aynan (`hodisalar` — qatorlar nusxasi `id` lari bilan, 2-dars kaliti o'zgarmaydi — 03-FILTR 20; `chekka` — `c1`… qayta ishlatilmaydi; `buzilmasin` — A2 dan); ish fakti (`a1`, `a2`) alohida, dars ichida; kalit yo'q bo'lsa o'quvchi o'zi yozadi (5-ekran, TAYANCHGA SAVOL 6).
8. [x] Test: bitta himoyalanadigan javob — 3-ekran (A, B, C — Hodisalar bo'limida bor), 8-ekran (A, C, D — tekshirilmagan chekka holatlar); «Hech qayerda» turidagi variant yo'q; tashqi xizmat haqidagi arena 6 — «bu misolda» (socket.io sukuti); ha/yo'q teng.
9. [—] Keys — keyssiz dars (Qaror-0 22).
10. [x] 90 daqiqa — taqsimot sarlavha ostida; «Ulgurmasangiz» A1, A2 da; «Ortda qoldingizmi» ikkala blokda; Render kutishi paytida ish bor (A1 3-bo'lak).
11. [x] Bir ma'no — bir so'z — A-bo'lim 5: hodisa (ulanish), holat (uch birikma), qadam (yo'q), tekshirish (sinov yo'q), xabar (faqat ta'rifda), belgi, e'lon, push.
12. [x] Web-trek teng yo'l — A1, A2 «Web-trek» qatorlari (`prototip/`, `src/ulanish.js`, «Yangilash» tugmasi, telefon brauzerida tekshirish, uchish rejimi telefonda); 5-ekran Yordami (boshqa oyna, «Yangilash»); yakuniy test va yakun ikkala trekka; arena 12.
13. [x] Agent va o'quvchi ishi ajratilgan — qarorlar o'quvchida: qaysi hodisalar (5-ekran, karta 1), har holatda nima ko'rinadi (karta 2), chekka holatlar (karta 3), «Nima buzilmasin» (A2); agent quradi; tekshiruvda o'quvchi nimani ko'rishi aniq (son, belgi, README); agent yozuvlari faqat `id` bo'yicha o'chiriladi.
14. [x] O'smir xavfsizligi — shaxsiy ma'lumot so'ralmaydi va yozilmaydi (README, kalit, prompt); tekshiruv — agent ochgan tekshiruv akkauntidan (namuna ma'lumot) yoki web-trekda o'quvchining ikkinchi namuna akkauntidan; juftlikda sinfdosh o'z ma'lumotini yozmaydi, Expo akkaunti berilmaydi; boshqa odamning ilovasi tekshirilmaydi.

## O'lchov — `md03/olchov.py` natijasi (scratchpad; qavsdagi sonlar skript bilan to'ldirilgan, 06.10.2026)
Belgilar — oddiy `len`, bo'shliq bilan, `**` va backtiksiz. Chegaradan oshgan joy yo'q.
```
Sarlavhalar (≤55): 0 — 45 · 1 — 52 · 2 — 46 · 4 — 40 · 5 — 46 · A1 — 43 · A2 — 51 · 10 — 25 · yakun besh holat — 51 · 49 · 45 · 47 · 46
Hook javoblari (≤120): C — 96 · B — 110 · A — 92
Xulosalar (≤110): 2 — 86 · 4 — 95 · 5 — 85 · A1 yashil — 74 · A2 yashil — 83
Nom qatori / QIzoh (o'z mo'ljalim ≤120): 2 — 68 · 4 — 94 · 4 QIzoh — 71
To'g'ri izohlar (≤60): 3 — 57 · 8 — 53
Xato izohlari (≤60): 3 — 46 · 43 · 38 · 8 — 48 · 54 · 51 · 5-ekran QXato — 39 · 50 · 34 · 45
Testlar (variant uzunligi, oraliq = (max−min)/o'rtacha):
  0 hook  A=44 · B=42 · C=42 — 5%
  3       A=27 · B=32 · C=32 · ✔D=29 — 17% (to'g'ri — eng uzun emas)
  8       A=43 · ✔B=43 · C=40 · D=42 — 7% (to'g'ri — yolg'iz eng uzun emas; 03-FILTR dan keyin)
Arena (oraliq; to'g'ri javob yolg'iz eng uzun — hech birida yo'q):
  1 ✔A 13% (03-FILTR dan keyin) · 2 ✔B 9% · 3 ✔C 6% · 4 ✔D 20% · 5 ✔A 9% · 6 ✔B 10% · 7 ✔C 18% · 8 ✔D 7% (03-FILTR dan keyin) · 9 ✔A 15% · 10 ✔B 8% · 11 ✔C 12% · 12 ✔D 11%
  ✔ taqsimoti: A 3 · B 3 · C 3 · D 3 · savollar 4–11 so'z
```
Mentor gaplari ko'z bilan sanaldi: Reja — 2 gap (interaktiv emas); qolgan hamma ekranda va har bosqichda — 1 gap; hech biri sarlavhani takrorlamaydi, «Bu…», «Hammasini…» bilan boshlanmaydi.
Savollar so'z soni: 3-ekran — 9 · 8-ekran — 9 (≤12). Arena 4 va 7 — bosh agent 15:05 da tenglashtirdi (11% va 11%; ✔ o'rni o'zgarmadi) (pilot 07 o'lchovi bilan bir).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-02` «WebSocket: ekran o'zi yangilanadigan ulanish» → **`m10-03` «Ekran o'zi yangilanishi uchun nimani yozasiz?»** (osti — 1-ekran chap yorlig'ida so'zma-so'z) → `m10-04` «Loyiha kuni: jonli xabar va eslatma» (App.jsx 399–401, grep bilan; yakundagi «Keyingi dars» shu nom).
- [x] Bitta misol-ip — «Maydon Jamoa» (hook → Mentor talabi → vaziyatlar → bloklar namunasi); ikkinchi misol yo'q (3-ekran testi — o'sha olam, talabning yarmi). Metafora yo'q. Bitta vizual — `TalabSahna` (0, 1, 2, 4, 5, 8 va bloklar o'ngi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0 (gap qutiga yoziladi, uch uya), 2 (bo'lim → sahna va varaq), 4 (vaziyat → sahna, varaq qatori, sarlavha almashadi), 5 (belgilash, karta → ixcham qator), A1, A2. Matn-karta yo'q.
- [x] SABOQ 11: harakatli ekranlarda navbatdagi element halqa + pulsatsiya, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz. SABOQ 21/26: telefon chapda, varaq o'ngda, ≤3 blok.
- [x] O'lchov (python, `md03/olchov.py`): sarlavhalar ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosalar ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohlari ≤60 · test variantlari — oraliq 5–17% (qavsdagi sonlar).
- [x] Atamalar oldingi darslar bilan bir (pilot 02 va tayanch 2): doimiy ulanish · hodisa · `oyin-ozgardi` · tinglovchi · ulanish belgisi «Ulangan» / «Ulanmoqda…» / «Ulanmagan» (tayanch 9.1) · real vaqt oqimi sxemasi · talab (qayerda · nima qilsin · nima buzilmasin) · agent (Antigravity) · tekshirish; yangi: real vaqt talabi, chekka holat — har biri misoldan keyin ·
  siz-forma; agent promptlari — agentga buyruq (T-002 istisnosi); tugmalar ot-shaklda yoki siz-formada («Keyingi bo'lim», «Vaziyatni ko'ring», «Bo'limlarni to'ldiring», «Saqlash»).
- [x] Testlar: variantlar bir shaklda («… -ni»), uzunlik yaqin (skript), to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda · ✔ o'rni: 3-ekran D, 8-ekran B · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM+PRAKT — yakuniy `QTest`) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q — xulosalar «Bu misolda», «Bu darsda»; tashqi qadamlar «bo'lishi kerak», «odatda», «cho'zilishi mumkin»; sahna — «shunday bo'lishi mumkin».
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «m10-03», «12-Modul», «mini-PRD» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha — «11-Modulda»; «N-ekran» — faqat MD izohlari va O'qituvchi eslatmalarida) · keyssiz · «KOD» (14) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S · PM ko'rildi: T-002/008/009/010/011/014/015/024/029/039/042/043/045/047/048/049/052/064/070 · P-001/002/004/007/008/013/014/015/016/025/026/028/036/046/048/052/059/062/064/067 ·
  S-001/002/004/006/008/010/015/019/020/026/027 · PM-005/017/020/021/030.
- [x] `npm run lint:til feedback/F-1006-12modul/03-PmRealtimeSpec-v3.md` — 0 error, 0 warn (06.10).
- [ ] (ochiq) TAYANCHGA SAVOL 4, 17 — bloklar bo'linishi, Mentor repo'sida chekka holatlar bajarilmagan qolishi (auditor qabul qildi — foydalanuvchi tasdig'i kerak). 5 va 6 — 03-FILTR 20, 21 bilan yopildi. P-011 PM V4 tartibi to'liq emas (keys, koding yo'q) — gibrid dars, 12 ekran (tayanch 4).
