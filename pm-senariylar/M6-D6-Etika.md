# M6-D6 — Ilova o'zi qaror qilsa, kimga tegadi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/6-Modull/PmLesson23.jsx` (hozirgi v16 avlod BUTUNLAY almashadi; yangi `lessonId: pm-m6d6-v1`).
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 Batch 5 — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 6 — «To'liq tizim: front + back + baza + AI + bot» |
| **Dars** | M6-D6 (modulning 6-darsi, ikkinchi PM darsi) · `key: m6-06` |
| **Mavzu** | Etika va javobgarlik: AI-mahsulotda nima noto'g'ri ketishi mumkin va qayerga chegara qo'yiladi |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z chegara-qarorlarini **yozadi**; artefakt = matn, keyingi darsga o'tadi (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | ⛔ **YO'Q — ZAXIRA ILGAK.** Registr 3-bo'limi m6-06 ni qoplanmagan uch darsdan biri deb belgilagan (`m4c-06` · `m6-06` · `m7-05`); registr 4-bo'lim 2-bandi bu darsga zaxira ilgakni oldindan ruxsat bergan. Sabab quyida — «Keys-qarori» bandi |
| **ISHLATILGAN_KEYS** | **—** (bu darsda bank keysi ishlatilmaydi) |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | **m6-02** → katak-tekshiruv (Batch 5, parallel yozilmoqda) · **m5-11** → kun-belgilash · **m4-15** → «QAROR-SABAB TANLOVI». **M6-D6 = «oqibat-juftlash»** — uchalasidan farq qiladi (26/59-qonun; asos: 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'limi to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «QAROR-SABAB TANLOVI» · «YUK-SINOVI» · «SIFAT-TAROZI» · «RELIZ-TASMASI» · «O'LCHAGICH-PANELI» · «BIRINCHI 20» · «INTERVYU-STOLI» · «QAYTISH-KALENDARI» · Hotspot · Timeline · **MatchPairs** · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · nosozlik-navbati · signal-saralash · savol-elak · joy-quvuri · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | 🛒 **O'quvchining O'Z mini-do'koni** — M6 modul-ipi (registr R2 Batch 5: front + back + baza + AI + bot). 95-qonun: Toshkent o'smiri onlayn do'kondan O'ZI buyurtma beradi va shu do'konni shu modulda o'zi quradi ✓ · 96c(a): ip o'quvchining artefaktida, mentor demosida emas · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · 🏀 maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · 🅿️ AvtoStoyanka · konsert-chipta sayti · skuter-ijara · sinfdosh-poyga · Netlify-sayt · o'quvchining Telegram-boti — **mini-do'kon band emas** ✓. Grep-dalili: `grep -ril "mini-do'kon" src/` → M6 fayllari (`ArchPatternsLesson`, `ClaudeSkillsLesson`, `ReactNative*`, `MobileAppPracticeLesson`) va M2 praktikalari — ya'ni bu **modulning o'z mahsuloti**, boshqa darsning demo-olami emas |
| **Kirish-artefakt** | `pm-m6d2-prd` = `{ prd: { muammo, kim, yechim, metrika }, savedAt }` — m6-02 da o'quvchi bir varaqqa yozgan to'rt katak. 🔴 **Jim zaxira** (pasport): «BOR» tarmog'i TO'LIQ yoziladi (s8 tepasida bir qatorlik varaq-kartasi: `kim` + `yechim`), «YO'Q» tarmog'ida ekran o'sha kartani ko'rsatmaydi va oldingi dars haqida **umuman gapirmaydi** — «topilmadi / saqlanmagan / bo'sh» so'zlari **0** (korpus §69). m6-02 shu batchda qayta quriladi, artefakt AMALDA mavjud bo'ladi |
| **Chiqish-artefakt** | 🔴 `pm-m6d6-chegara` = `{ chegaralar: [ { qaror, jabr } × 3 ], savedAt }` — muhrlangan shakl (registr R2 Batch 5), senariy o'zgartirmaydi. `qaror` — ilova o'zi qilmaydigan ish (o'quvchi matni) · `jabr` — shu qaror tegadigan bitta aniq odam (o'quvchi matni). m6-12 (roadmap) shu uch qatorni o'qiydi |
| **Yordamchi kalitlar** | `pm-m6d6-hook-choice` (faqat YOZILADI — 100c) · `pm-m6d6-kozgu` (s4 holati: ochilgan qarorlar + chegara-tanlovi) · `pm-m6d6-juft` (s9 holati) · `pm-m6d6-code` · `pm-m6d6-reflection` · `pm-m6d6-hw-target` · `ccProgress` |
| **Koding** | 🖥 **KOMPILYATOR** — R1 navbati (registr: m6-02 VS Code → **m6-06 kompilyator** → m6-12 VS Code). Sof JS, `previewUrl` YO'Q, shartlar xulq-atvorda, starter yashil emas (18-ov). Qobiq `zoom: 'calc(1 / var(--lz, 1))'` bekori bilan tug'iladi (etalon `PmLesson15`/`PmLesson17`) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10/M4-D2 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

### 🔴 Keys-qarori: nega zaxira ilgak

Registr 3-bo'limi `m6-06` ga birorta keys **biriktirmagan** — u qoplanmagan uch darsdan biri.
Bank ustidan qayta yurilganda ham holat o'zgarmadi, uchta sabab bilan:

1. **Bankda AI-mahsulotning odamga tegishi haqida bironta fakt YO'Q.** 19 keysning
   birortasida ham «mahsulot qaror qildi — odam jabr ko'rdi» voqeasi yozilmagan.
2. **Eng yaqin nomzod — K10 Cyberpunk 2077 — band va boshqa tomonda.** Uning nosozlik-tomoni
   M3-D10 da, sifat-tomoni `m4b-02` da muhrlangan; bankda esa uning etika tomoni haqida
   gap yo'q. Uni bu darsga bog'lash uchun **bankda yozilmagan narsani** aytish kerak bo'lardi
   (10-qonun devori, korpus §101).
3. **96c(b):** K10 dasturda uch darsda ko'rinadi; to'rtinchi marta chiqishi «yana shumi?»
   hissini beradi.

**Qaror:** `PM_Prompt_v8` 1-blokdagi **zaxira ilgak** olinadi.
🔴 **Zaxira ilgak taqiqi ham amal qiladi:** kompaniya, raqam va voqeani o'ylab topish har qanday
holatda taqiq. Shuning uchun s6 da o'ylab topilgan kompaniya-voqea YO'Q — o'quvchi **o'z
telefonida o'n soniyada tekshirib ko'ra oladigan** holat olinadi (6-bo'limga qarang).
Ekranda birorta statistika, foiz yoki sana yo'q.

### 🔴 M4-D7 «ishonch» darsidan farq-dalili (pasport talabi)

`M4-D7` (`PmLesson12`) ham «yomon narsa bo'lishi mumkin» oilasidan, lekin **boshqa savolga**
javob beradi — ikkovi to'qnashmaydi:

| | M4-D7 · ishonch | **M6-D6 · chegara** |
|---|---|---|
| Savol | Bu qatorni begona ko'rsa nima bo'ladi? | Ilova bu ishni o'zi qilsa, kimga tegadi? |
| Obyekt | **Ma'lumot** (ism, baho, telefon raqami) | **Qaror** (ilova o'zi bajaradigan ish) |
| Harakat | Qatorni ochiq yoki yopiq qilish | Ishni ilovadan olib, odamga qaytarish |
| Natija | Ishonchni QURISH | Ishni **to'xtatish joyini** belgilash |
| Artefakt | `{maydon, ruxsat, sabab}` | `{qaror, jabr}` |

🔴 Shundan kelib chiqadigan qat'iy taqiq: **«ochiq / yopiq ma'lumot», «maxfiylik», «kim
ko'radi», «parol», «shaxsiy ma'lumot» bu darsda ISHLATILMAYDI** — ular M4-D7 niki. Bu darsda
ma'lumot himoyasi umuman o'rgatilmaydi.

### Atama-glosslar (62/39-qonun + korpus §20/§104/§126 — avval hodisa, keyin nom)

- 🔴 **«chegara» — darsning yagona bosh atamasi.** Kanonik ta'rif dars bo'ylab AYNAN bir xil:
  **«Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara.»**
  (§109: zamon-iborasi bilan, yasama ot emas). Shu ta'rif s2 xulosa-kartasi · flashcard-1 ·
  RECAPS · s15 ro'yxatida so'zma-so'z takrorlanadi. «Chegara» o'smirga jismonan tanish so'z —
  maydonchaning chizig'i, xonaning devori; gap o'z-o'zidan ochiladi;
- 🔴 **Atama s2 da tug'iladi, s1 da YO'Q** (§126): maqsad-ekran natijani sodda so'z bilan
  **nomlaydi** — «uchta qaror yozib olasiz»; «chegara» so'zi u yerda **0**;
- 🔴 **§112 ko'prigi (bir gapda, birinchi ishlatilishda):** o'quvchi `m6-04` da agentga
  **vakolat chegarasi** qo'ygan. Shuning uchun s2 xulosa-kartasining ikkinchi gapi:
  «Agentga qo'ygan vakolat chegarangiz — ilovaning bitta joyidagi chegara edi; bugun butun
  mahsulotingizga chegara qo'yasiz.» Ikkita nom bitta narsagami degan savol shu gapda yopiladi;
- 🔴 **Fe'l-intizomi (korpus §80/§121 — bir mashq, bir fe'l):** qaror **tegadi** (kimga) ·
  odam **jabr ko'radi** · siz chegara **qo'yasiz** · ilova ishni **o'zi qiladi** yoki
  **odamdan so'raydi**. ❌ «zarar», «ziyon», «xavf», «yomonlik», «zarar yetkazadi» —
  ishlatilmaydi: jabr uchun BITTA fe'l. Artefakt kaliti `jabr` va ekrandagi so'z **bir xil**;
- 🔴 **«jabr ko'radigan odam» — DOIM bitta aniq odam** (qizil band 1): «buyurtma bergan
  mijoz», «telefonini yostiq yonida qoldiradigan mijoz». ❌ «odamlar», «hamma», «mijozlar»,
  «jamiyat», «foydalanuvchilar» — mavhum guruh sifatida ishlatilmaydi; s8 tekshiruvi ham
  aynan shuni tutadi;
- 🔴 **«mijoz» — do'kondan buyurtma beradigan odam.** Dars bo'ylab bitta nom (§80);
  ❌ «xaridor», «klient», «yuzer» — almashtirilmaydi;
- 🔴 **«AI» — kursning o'z atamasi**, `m6-01`/`m6-04`/`m6-05` da ochilgan; qo'shimcha gloss
  shart emas. 🔴 **«guardrails» esa faqat gloss bilan** va faqat flashcard-10 javobida:
  «Vakolat chegarasi (inglizchasi — guardrails)»;
- ❌ **«etika», «axloq», «mas'uliyat», «javobgarlik» o'quvchi ekranida ISHLATILMAYDI** —
  kattalar-hujjatlarining mavhum otlari, o'smir ularni birinchi o'qishda hodisa sifatida
  ko'rmaydi (§103: qoida yasama ot bilan emas, fe'l bilan). O'rnida to'g'ridan-to'g'ri gap:
  **«Qarorni ilova emas, mahsulotni o'ylaydigan odam qiladi.»** `App.jsx` sub-sarlavhasi
  hozir «Etika va mas'uliyat» — 14-bo'lim 1-bandiga qarang;
- ❌ **«ufq», «hozir / uch oy / olti oy», «yo'l-xaritasi»** — `m6-12` niki (29-qonun) ·
  ❌ **«metrika-slaydi», «isbot-raqami»** — `m6-14` niki · ❌ **«React Native», «Expo»,
  «mobil versiya»** — `m6-09…11` niki;
- ❌ **«model», «prompt», «kontekst», «token», «hallutsinatsiya», «bias»** — texnik kalka,
  bu darsda kerak emas; AI ning bilmagan narsaga javob yozishi **hodisa tilida** aytiladi:
  «bilmasa ham javob yozadi»;
- ❌ **«ustaxona» o'quvchi ekranida YO'Q** (korpus §84) — senariy-ichi blok nomi ·
  ❌ **«daftar» YO'Q** (F-0729-04) · ❌ **«chala» YO'Q** (7-B.3);
- ❌ **`til-lint-rules.json` dagi barcha error-darajali taqiq-so'zlar YO'Q** — manba bitta:
  qurilgandan keyin `npm run lint:til src/6-Modull/PmLesson23.jsx` → **0 error** shart.

🔴 **§40 darvozasi — BRIF-TUZATISHI (GATE S 2-savoli).** Brif «o'quvchining tizimi AI bilan
javob qaytaradi» degan edi; dars tartibi tekshirildi va bu **hali rost emas**:
`m6-06` dan OLDIN faqat `m6-01` (tizim sxemasi) · `m6-02` (PRD) · `m6-03` (arxitektura
naqshlari) · `m6-04` (AI-agent — qaror sikli, vakolat chegarasi) · `m6-05` (Claude Skills —
nima ekani) o'tilgan. O'z Skill'ini yozish `m6-07` da, AI ni haqiqatda ulash `m6-08` da,
to'liq tizim `m6-13` da. Ya'ni **mini-do'kon hali ishlab turgani yo'q**.
Shuning uchun dars bo'ylab: **«quradigan mini-do'koningiz»**, **«mini-do'kon»** — hech qachon
«ishlab turgan do'koningiz» yoki «AI javob berayotgan do'koningiz». O'quvchiniki bo'lgan
ikki narsa: `m6-02` da yozgan **varag'i** va bugun yozadigan **uch chegarasi**
(«chegaralaringiz»). Pretsedent: `m5-02` — «quradigan botingiz» (registr B4 qaydi).

🔴 **Ohang darvozasi (66 + 101 + qizil band 1):** bu mavzuda eng oson buziladigan ikki narsa —
**va'z o'qish** va **qo'rqitish**. Darsda: AI yovuz emas · birorta halokat, pul yo'qotish,
sud yoki qonun yo'q · jabr har doim **oddiy va tuzatsa bo'ladigan** («quti ochilganda
zaryadlagich yo'q edi», «uyqusi bo'lindi», «bekorga kutdi») · «kerak emas», «qilmang»,
«yomon» kabi baho-so'zlari o'rniga savol turadi: **«bu qaror kimga tegadi?»** · va darsning
ikkinchi yarmi ochiq aytadi: **hamma ishga chegara qo'ysangiz, do'kon to'xtab qoladi.**

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «OQIBAT-KO'ZGUSI»** (23-qonun: har darsda YANGI — registr 5-bo'limidagi
birorta band vizual klonlanmaydi; ayniqsa «UCH KIRISH — BIR SAHIFA» va «O'LCHAGICH-PANELI»
yaqin ko'ringani uchun quyida ochiq ajratilgan).

Ekran ikkiga bo'linadi. **Chapda** — mini-do'kon ilovasining **uch ishi**, uch karta
ko'rinishida; har kartada ikki tugmali bitta tanlov turadi. **O'ngda** — **ko'zgu**: shu
qarordan jabr ko'radigan odamning kartasi.

| Ilovaning ishi | Ikki tanlov |
|---|---|
| 💬 Mijozning savoliga javob | «AI o'zi yozib yuboradi» / «Javobni do'kon egasi o'qib chiqadi» |
| ✍️ Mahsulot tavsifi | «AI yozib, saytga o'zi chiqaradi» / «Do'kon egasi o'qib, keyin chiqaradi» |
| 🚫 Tushunarsiz manzilli buyurtma | «Ilova o'zi bekor qiladi» / «Ilova mijozdan so'raydi» |

🔴 **Rang-legendasi ekranda (§134/§135 — rangga ma'no yuklansa, ma'no o'quvchi MATNIDA
aytiladi):** ko'zgu tepasida doim bitta qator turadi:
**«🔴 — bu qaror shu odamning kunini buzadi: u jabr ko'radi · ⚪ — bu qaror uning kunini buzmaydi»**.

**1-bosqich — ko'zgu.** O'quvchi har kartada «ilova o'zi qiladi» tugmasini bosadi. Shu zahoti
o'ngdagi ko'zguda **bitta aniq odam** paydo bo'ladi va yonida **bitta fakt-qator** chiqadi:

| Ilovaning ishi | Ko'zgudagi odam | Fakt-qator |
|---|---|---|
| 💬 Javobni AI o'zi yozib yuboradi | 🔴 «Zaryadlagich qo'shib berasizmi?» deb so'ragan mijoz | AI «qo'shib beramiz» deb yozdi; quti ochilganda zaryadlagich yo'q edi |
| ✍️ Tavsifni AI o'zi chiqaradi | 🔴 Tavsifni o'qib olgan mijoz | Tavsifda «suvga chidaydi» deb turgan edi; quloqchin yomg'irda ishlamay qoldi |
| 🚫 Buyurtmani ilova o'zi bekor qiladi | 🔴 Manzilini qisqa yozgan mijoz | Buyurtmasi bekor bo'ldi; u kechgacha kutib o'tirdi |

Ikkinchi tugma bosilsa, o'sha odamning kartasi **⚪** ga o'tadi va fakt-qator o'rniga bitta
qator chiqadi: «Do'kon egasi o'qib chiqdi — xato mijozga yetib bormadi» (mos ravishda
«Ilova so'radi — mijoz manzilini to'g'irladi»).

🔴 **Ko'zgu javobni AYTMAYDI (98b):** qaysi ishga chegara qo'yish kerakligini ekran hech
qayerda yozmaydi — u faqat **kim jabr ko'rishini** ko'rsatadi. Umumiy qoidani o'quvchi
2-bosqichda va s5 testida o'zi chiqaradi (§106).

**2-bosqich — chegara-qarori** (uchala ish ham bir marta ko'rilgach ochiladi — 94-qonun
progressiv ochilish). Ekranga bitta savol-karta chiqadi:

> *«Do'kon egasining vaqti oz: uch ishdan faqat **bittasini** o'zi o'qib chiqa oladi.
> Qay birini olib qo'yasiz?»*

- **💬 Javob tanlansa:** «✅ Endi xato javob mijozga yetib bormaydi. Qolgan ikki ishni AI
  o'zi qilaveradi — do'kon sekinlashmadi.»
- **Boshqasi tanlansa:** «Bu ham chegara — lekin bilmagan savolga yozilgan javob har kuni
  takrorlanadi, tavsif esa bir marta yoziladi.» (56-qonun: ball yo'q, qizil baho yo'q, asl
  javob DOIM ochiladi; qayta tanlash ochiq.)

Uchala ishga birdan chegara qo'ymoqchi bo'lsa (uchala tugma ham «odam o'qiydi» holatida):
> «Uchala ishni ham do'kon egasi o'qisa, har buyurtma uni kutib turadi — do'kon to'xtab
> qoladi. Bittasini AI ga qaytaring.»

Yakun-qatori (bitta gap):
> **«✅ Buni o'zingiz topdingiz: chegara ilovani to'xtatmaydi — bitta ishni odamga qaytaradi.»**

🔴 **Nima uchun aynan shu:** «AI xato qilishi mumkin» degan gapni **o'qib** tushunib bo'lmaydi —
u mavhum qoladi va va'zga aylanadi. Ko'zgu esa qarorni **bitta odamning boshiga** tushiradi:
bola tugmani bosadi va o'ng tomonda kimdir paydo bo'ladi. Keyin unga vaqt chegarasi
qo'yiladi — va u **tanlashga majbur bo'ladi**, ya'ni «hammasini taqiqlaymiz» yo'li yopiladi.
Darsning butun qarori shu ikki qadamda qo'lda o'ynaladi.

🔴 **Mexanika-farqi (26/59-qonun — uchta yaqin nomzod bilan yonma-yon):**
**M4-D7 «UCH KIRISH — BIR SAHIFA»** da o'quvchi **kim ochganini** almashtirib **bitta sahifani**
qayta chizdirardi (obyekt — ma'lumot qatori). **m4c-06 «O'LCHAGICH-PANELI»** da u **chegara
sonini** surib signal sanardi (obyekt — o'lchagich). **m4a-02 «YUK-SINOVI»** da **miqdorni**
oshirib sinish nuqtasini topardi. Bu yerda obyekt — **qaror**, harakat — **qarorni ilovadan
odamga o'tkazish**, natija — **boshqa ekranda paydo bo'ladigan odam**. Ko'zgu — javob emas,
oqibat: uchala eski mexanikada ekran holatni ko'rsatardi, bu yerda ekran **odamni** ko'rsatadi.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta
qoida-ipuchasi: «Yana bir kartada "AI o'zi qiladi" tomonini bosib ko'ring — o'ng tomonga
qarang» — javobni AYTMAYDIGAN shaklda (korpus §77).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10/M4-D2 dagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Ilova siz o'rningizga qaror qildi» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch qaror-qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — ilova so'raydimi yoki o'zi qiladimi | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **OQIBAT-KO'ZGUSI** (uch qaror + chegara-tanlovi) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | HAQIQIY HOLAT — zaxira ilgak (4 slayd + 1 bashorat) | 3 | — | keys-slayd qolipi (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 chegara** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **OQIBAT-JUFTLASH** | 5 | — | 🔴 qaror ↔ odam juftlash (yangi mexanika) |
| s10 | KODING — chegara kerak ishlarni topadigan kod | 6 | — | 26/82/87-qonun · kompilyator |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ko'zgu», «ustaxona», «oqibat-juftlash» so'zlari o'quvchi ekranida YO'Q** (korpus §84) —
bular senariy-ichi nomlar. Ekranda o'ng ustun sarlavhasi — **«Bu qaror kimga tegadi»**,
s9 sarlavhasi esa aniq buyruq (5-bo'lim va 8-bo'limga qarang).

🔴 **47-qonun:** interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida —
`?</h2>` shu to'rt ekranda **0**; teoriya/hook/refleksiya ekranlarida (s0 · s2 · s12)
sarlavha — savol-murojaat.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 6 — To'liq tizim: front + back + baza + AI + bot
DARS: M6-D6 (6-dars)
DARS_MAVZUSI: Ilova o'zi qaror qilsa kimga tegadi va qayerga chegara qo'yiladi
ISHLATILGAN_KEYS: —
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Ba'zan ilova siz uchun o'zi qaror qiladi: so'ramay tanlab qo'yadi, so'ramay
xabar yuboradi, so'ramay obunani uzaytiradi. Shunday bo'lganda sizga qanday tuyulgan?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: farq ilovada emas, bitta savolda —
shu qaror kimga tegadi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkala tomonning ham hayotiy dalili bor. Shu bo'linishning
o'zi darsga eshik: qulaylik ham rost, so'ramaslik ham rost.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🙂 Qulay bo'lgan — vaqtimni tejadi | 33 |
| 😕 Yoqmagan — o'zim tanlamoqchi edim | 35 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi: ba'zi ishni ilova o'zi qilsa qulay, ba'zisini odam o'zi qilmoqchi. Farq bitta savolda: **shu qaror kimga tegadi**. Bugun shu savolni o'z mahsulotingizga berasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsalar (tanlab qo'yish, xabar, obuna) + harakat-fe'llari + o'quvchining o'z holatidan o'sadi — o'smir buni telefonida o'zi ko'rgan.
> 🔴 **104-qonun:** to'g'ri javob YO'Q — payoff ikkala tanlovda bir xil; ❌ «To'g'ri o'yladingiz…» yozilmaydi.
> 🔴 **119-qonun:** payoff hech bir tanlovni yolg'onga chiqarmaydi — «ikkalasi ham bo'ladi» deb ochiq boshlanadi, keyin ikkalasiga ham YANGI narsa qo'shadi (savolning o'zi).
> 🔴 **100-qonun:** tanlov `pm-m6d6-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/126-qonun:** «chegara» atamasi bu ekranda YO'Q — u s2 da tug'iladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ohang:** hookda birorta yomon oqibat yo'q — faqat «qanday tuyulgan?». Qo'rqitish s0 da boshlanmaydi.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **330 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida quradigan mahsulotingiz uchun uchta qarorni o'zingiz yozib olasiz:
ilova qaysi ishni o'zi qilmaydi — va bu qaror kimga tegadi.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta qaror-qatori o'z-o'zidan yozilib
chiqadi, har birining yoniga ✅ qo'yiladi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — strelkali juftlik, ustun-sarlavhasiz (korpus §67d):**

| Ekranda ko'rinadigan qator |
|---|
| Narxni o'zi o'zgartirmaydi → Eski narxni ko'rgan mijoz |
| Sharhni o'zi o'chirmaydi → Sharh yozgan mijoz |
| Buyurtmani o'zi to'lovga yubormaydi → Hali o'ylab turgan mijoz |

> 🔴 **39/62/126-qonun:** s1 da «chegara» so'zi **0** — atama o'z ekranida (s2) tug'iladi; maqsad-ekran natijani sodda so'z bilan NOMLAYDI («uchta qaror»).
> 🔴 **§125:** preview yadro-kashfiyotini oshkor qilmaydi — u faqat qator SHAKLINI ko'rsatadi (ish → odam), s4 dagi uch ishning javobini emas.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchlik s4 uchligiga ham (javob · tavsif · buyurtma), s9 to'rtligiga ham KIRMAYDI — ular do'konning boshqa ishlari.
> 🔴 **§123/§128 (demo o'z qoidasidan o'tadi):** uchala qator ham «… qilmaydi» shaklida va har birida BITTA aniq odam turadi — s8 mashqi aynan shu ikki shartni talab qiladi, ya'ni demoni ko'chirgan bola o'tadi.
> 🔴 **40-qonun / korpus §40:** «quradigan mahsulotingiz» — o'quvchida ishlab turgan do'kon YO'Q; «do'koningiz ishlayapti» YOZILMAYDI.
> 🔴 **42-qonun:** suyuqlik-fe'li yo'q — «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **148 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (oqibat-ko'zgusi) + 3 × Quiz
EKRAN: Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara.
Agentga qo'ygan vakolat chegarangiz — ilovaning bitta joyidagi chegara edi; bugun butun
mahsulotingizga chegara qo'yasiz.
(Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) uch ishning «o'zi qiladi» tugmasini
bosib, o'ng tomonda kim paydo bo'lishini ko'radi, so'ng bitta ishni odamga qaytaradi;
(s6) haqiqiy holat slaydlarini bashorat bilan ochadi.
JAVOB: s4 — uch ishda ham jabr ko'radigan odam mijoz; chegara birinchi navbatda
mijozning savoliga yoziladigan javobga qo'yiladi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar uchala tugmani ham «odam o'qiydi» holatiga o'tkazib qo'yadi —
bu eng foydali xato. Ekranning o'zi to'xtatadi; siz so'rang: har buyurtma do'kon
egasini kutib tursa, do'kon ishlaydimi?
```

**s2 — TEORIYA-1: ilova so'raydimi yoki o'zi qiladimi** (korpus §73: ikki holatni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Ilova o'zi qaror qilsa, kimga tegadi?»**

Mentor (≤2 gap, 32b):
> Ilovaning har ishi oxirida bitta odam turadi. Ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 🙋 **Ilova so'raydi** | Avval odamdan so'raydi, keyin qiladi — xato bo'lsa odam to'xtatadi |
| 🤖 **Ilova o'zi qiladi** | So'ramay qiladi — tez bo'ladi, lekin xato bo'lsa hech kim to'xtatmaydi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara.** Agentga qo'ygan vakolat chegarangiz — ilovaning bitta joyidagi chegara edi; bugun butun mahsulotingizga chegara qo'yasiz.

> 🔴 **39/104-qonun qolipi:** avval hodisa (ikki karta), keyin «… shu qaror chegara». Sarlavhada yangi atama YO'Q ✓; ta'rif-gap kesik emas — nima ekani o'sha gapda aytilgan.
> 🔴 **§109:** ta'rif zamon-iborasi bilan («qaysi ishni o'zi qilmasligini … hal qilasiz»), yasama ot emas.
> 🔴 **§112 (yangi nom o'tgan dars nomi bilan bir gapda tenglashtiriladi):** «vakolat chegarasi» — `m6-04` atamasi; ikkinchi gap ikkovini bitta gapda bog'laydi, shundan keyin «chegara» yolg'iz yuradi.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **328 grapheme** proza (karta matnlari — mashq-materiali, sanalmaydi) ✓.

**s4 — YADRO: OQIBAT-KO'ZGUSI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Har ishda "AI o'zi qiladi" tugmasini bosing va o'ng tomonga qarang.»**

Mentor (≤2 gap, 92a):
> Chapda ilovaning uch ishi, har birida ikki tanlov. O'ng tomon — shu qaror tegadigan odam.

> 🔴 **98b:** mentor kim paydo bo'lishini AYTMAYDI — odam va fakt-qator harakatdan KEYIN chiqadi.
> 🔴 **106d/71:** har bosishda javob darhol: belgi (🔴 yoki ⚪) **va** bitta fakt-qator — o'quvchi nima bo'lganini o'qiydi, o'ylab topmaydi.
> 🔴 **§134/§135 (rang-legendasi majburiy):** ko'zgu tepasida doim turadigan qator — «🔴 — bu qaror shu odamning kunini buzadi: u jabr ko'radi · ⚪ — bu qaror uning kunini buzmaydi». Legendasiz rang hech qayerda ma'no tashimaydi.
> 🔴 **§106 (test ko'chirma bo'lmasin):** fakt-qatorlar ISH-darajasida gapiradi («quti ochilganda zaryadlagich yo'q edi»); umumiy QOIDA («chegara ilova o'zi qiladigan ishga qo'yiladi») ekranda yozilmaydi — uni bola s5 testida o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **Muvozanat ekranda, va'zsiz:** uchala tugma «odam o'qiydi» holatiga o'tsa, ekran o'zi to'xtatadi («do'kon to'xtab qoladi»). Bu darsning ikkinchi yarmi va qo'rqitishning teskarisi.
> 🔴 **Ohang darvozasi:** uch fakt-qatorning uchalasi ham oddiy va tuzatsa bo'ladigan jabr; pul, sud, halokat yo'q.
> 🔴 **72-qonun:** birinchi karta diqqat-signali bilan ochiladi; birinchi bosishdan keyin signal tinadi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + legenda + yakun-qatori = **282 grapheme** ✓.

**s6 — HAQIQIY HOLAT:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Mahsulotingizga uchta chegara yozing.
(mentor, 1 gap) Har ishga bitta savol bering: ilova buni o'zi qilsa, kim jabr ko'radi?
HARAKAT: Uchta chegarani BITTALAB yozadi. Har kartada: ilova o'zi qilmaydigan ishni
yozadi, so'ng shu qaror tegadigan bitta odamni yozadi. Saqlaganda qator o'ngdagi
ro'yxatga ko'chadi.
JAVOB: Uchala chegara yozilgan · har biri «... qilmaydi» shaklida · har birida bitta
aniq odam turadi · guruh nomi («hamma», «odamlar», «mijozlar») odam o'rnini bosmaydi ·
uch ish bir-biridan farq qiladi.
RO'YXAT: Uchta chegara yozilgan · Har chegara «…maydi» bilan tugaydi ·
Har chegarada bitta aniq odam
YULDUZCHA: Ilova o'zi qilaversa ham bo'ladigan bitta ishni toping. Nega unga chegara
kerak emas — bir qatorda yozing.
YORDAM: Ikki savol bering: ilova buni so'ramay qilsa nima bo'ladi? Bu bitta odamning
kuniga qanday tushadi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Ilova hech qanday xato qilmasin» degan qatorlar chiqadi — bu eng foydali
xato. Javob-qatori uni tutadi, siz so'rang: bu qaysi ISH haqida?
```

🔴 **Kirish-artefakt tarmog'i (pasport: jim zaxira, ikki tomonlama shart-tekshiruvi):**

| Holat | Ekranda |
|---|---|
| `pm-m6d2-prd` BOR | Sarlavha ostida bir qatorlik varaq-kartasi: **«📄 O'z varag'ingizdan: {kim} uchun — {yechim}»** va tagida «Shu mahsulotga uchta chegara yozasiz.» |
| `pm-m6d2-prd` YO'Q | Varaq-kartasi umuman KO'RINMAYDI; ekran to'g'ridan-to'g'ri «Mahsulotingizga uchta chegara yozing.» dan boshlanadi. 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** (korpus §69), oldingi dars haqida bir og'iz gap yo'q. Yozish predmeti — shu darsning O'Z olami, ya'ni mini-do'kon (96c(d)) |

🔴 **Yozish-kartasi (80b) — bitta karta, ikki qadam ichida:**

| Qadam | Ipucha (placeholder — korpus §32/§115: qisqa savol, tayyor javob YO'Q) |
|---|---|
| Ilova o'zi qilmaydigan ish (matn) | `Ilova qaysi ishni o'zi qilmaydi?` |
| Bu qaror tegadigan odam (matn) | `Bu qaror kimga tegadi?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama; §130 — yashil qator faqat TEKSHIRILGAN narsani aytadi):**
- ✅ ikkala maydon to'la va odam guruh-nomi emas → «✅ Ish ham, odam ham yozildi.»
- 🤔 ish inkor shaklida emas (ichida «-maydi / -masin / -may» yo'q) → «Chegara — ilova nima **qilmasligi**. «…maydi» shaklida yozing.»
- 🤔 odam maydonida faqat guruh nomi (*hamma · odamlar · mijozlar · foydalanuvchilar · bolalar · jamiyat*) → «Bu hali bitta odam emas. Qaysi mijoz? O'sha paytda u nima qilayotgan edi?»
- 🤔 ish yuqoridagi qator bilan bir xil → «Bu ish yuqorida allaqachon yozilgan — boshqa ishni oling.»
- 🤔 uchinchi karta saqlanayotganda uchala odam ham bir xil yozilgan → «Uchala qator bitta odamga tegyapti — do'konda boshqa odam ham bor.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Tekshiruv qoida-asosida ishlaydi (106d(c), dars o'z so'zlaridan):** inkor-belgisi (`-maydi`, `-masin`, `-may`) va guruh-nomlari ro'yxati. Bloklamaydi — yo'naltiradi.

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **112 grapheme** ✓ (javob-qatorlar harakatdan keyin, bittadan chiqadi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (oqibat-juftlash)
EKRAN: (topshiriq) Har qarorni jabr ko'radigan odamga qo'shing.
(yo'riqnoma) Do'konning boti to'rt ishni o'zi qiladi. Chapdan qarorni bosing, so'ng
o'ngdan shu qaror tegadigan odamni bosing.
HARAKAT: To'rt qaror, to'rt odam. O'quvchi uch juftlikni o'zi tuzadi, to'rtinchisi
o'z-o'zidan qo'shiladi. Har juftlikdan keyin javob va bir qatorlik sabab ochiladi.
JAVOB: Kechasi tasdiq xabari → yostiq yonidagi telefon; har o'n daqiqada qayta yozish →
dars paytida telefonini o'chiradigan mijoz; javob bermagan buyurtmani o'zi bekor qilish →
kasal bo'lib yotib qolgan mijoz; chegirmani faqat ko'p buyurtma berganlarga yuborish →
birinchi marta buyurtma bergan mijoz.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Ikki savol bering: bu odam qaysi paytda telefoniga
qaray oladi? Bot undan nimani kutyapti?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining uch chegarasini o'qib, har biriga
«bu qaror kimga tegadi?» deb so'raydi. Odam nomlanmasa — qator qayta yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — ikkinchi va uchinchi juftlik: ikkalasida ham
mijoz botga javob bermaydi. Farq nega javob bermaganida: biri darsda, biri kasal.
```

**To'rt qaror va to'rt odam (yangi sahna: do'konning boti — s4 uchligidan BOSHQA to'plam):**

| # | Botning qarori | Jabr ko'radigan odam | Javob ochilgandagi sabab-qatori |
|---|---|---|---|
| 1 | 🌙 Buyurtma tasdig'ini kechasi soat ikkida yuboradi | Telefonini yostiq yonida qoldiradigan mijoz | Xabar ertalab ham yetardi — uyqusi bo'lindi |
| 2 | 🔁 Javob kelmasa, har o'n daqiqada qayta yozadi | Dars paytida telefonini o'chirib qo'yadigan mijoz | Darsdan chiqqanda telefoni bir xil xabarlarga to'lib ketgan edi |
| 3 | 🧹 Bir hafta javob bermagan buyurtmani o'zi bekor qiladi | Kasal bo'lib yotib qolgan mijoz | Tuzalib qaraganda buyurtmasi bekor bo'lgan edi |
| 4 | 🏷 Chegirma xabarini faqat ko'p buyurtma berganlarga yuboradi | Birinchi marta buyurtma bergan mijoz | Chegirma bo'lganini umuman bilmadi |

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch chegarangiz tayyor — endi shu savolni do'konning botiga beramiz.

Yakun-qatori:
> ✅ **To'rtala qarorni ham bot o'zi qildi — to'rtala odam ham buni so'ramagan edi.**

> 🔴 **26/59-qonun — uch yaqin mexanikadan farqi (pasport talabi bo'yicha asoslanadi):** **MatchPairs 🔴band** (M7-D2, M8-D1) — u yerda **atama ↔ ta'rif** juftlanadi, ya'ni obyekt NOM va javob yodda turadi. Bu yerda **qaror ↔ odam** juftlanadi: to'g'ri javobni topish uchun bola ikki belgini solishtirishi kerak — bu odam qaysi PAYTDA telefoniga qaray oladi va bot undan NIMA kutyapti. Nom-mosligi hech qayerda ishlamaydi (to'rtala karta ham «mijoz» so'zi bilan tugaydi — §127). **m4-15 «QAROR-SABAB TANLOVI»** dan farqi: u yerda o'quvchi O'Z qaroriga sabab tanlardi (obyekt — sabab, bittalab yozish); bu yerda begona to'rt qaror odamga qo'shiladi. **M3-D5 rang-juftlash darvozasi** dan farqi: u yerda rang mezon edi, bu yerda rang faqat legenda (§134).
> 🔴 **§120 (material har shart uchun bitta javobni himoyalasin):** har odam-kartasi o'z holatini O'ZI aytadi (yostiq yonida / dars paytida / bir hafta kasal / birinchi marta) — hech bir juftlikni ikki xil himoyalab bo'lmaydi; oldingi ekrandan qolgan qoida ham teskari javobga olib bormaydi.
> 🔴 **106d + korpus §77/§98:** noto'g'ri juftlikda javob DOIM ochiladi: «🤔 Bu odam ham bot bilan uchrashadi — lekin boshqa paytda. Qaysi qaror aynan shu paytga tushadi?» — qoida beriladi, to'g'ri odam AYTILMAYDI; YORDAM faqat birinchi xatodan keyin.
> 🔴 **Sahna yangi, olam o'sha (91-qonun):** do'kon ilovasi (s4) → do'konning boti (s9) — bitta ip ichida ikki qism; to'rtlik s4 uchligini takrorlamaydi (§102).
> 🔴 **§135-A + §135-C (metodist-tuzatishi — ikki nuqson birdan):** (a) sabab-qatori «o'n to'rtta bir xil xabar» der edi, lekin s9 juftlash-ekranida bot-oynasi ham, o'n to'rtta qator ham chizilmaydi — son manbasiz qolardi; endi sanoqsiz: «telefoni bir xil xabarlarga to'lib ketgan edi». (b) uchinchi juftlikda «bir hafta» qaror-kartasida ham, odam-kartasida ham turardi — juftlikni ma'nosiga qaramay so'z-echosi bilan topsa bo'lardi; odam-kartasi endi «Kasal bo'lib yotib qolgan mijoz» (u javob bermagani — sababi kartaning o'zida).
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **196 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator — R1 navbati)
EKRAN: (sarlavha) Chegara kerak ishlarni topadigan kod yozamiz.
(mentor, 2 gap) Hozirgina har qarorni odamiga qo'shdingiz — endi o'sha ishni kod
bajaradi. Ikki ro'yxat s4 va s9 dagi ishlardan olingan.
HARAKAT: chegaraKerak(ishlar) funksiyasini to'ldiradi: ilova o'zi qiladigan va odamga
tegadigan ishlarning nomini qaytaradi. Ikki ro'yxatda ko'radi.
JAVOB: Do'kon ro'yxatidan javobYozish va buyurtmaBekor qaytadi; bot ro'yxatidan
faqat kechasiXabar qaytadi.
RO'YXAT: Do'kon ro'yxatidan javobYozish qaytdi · Do'kon ro'yxatidan buyurtmaBekor
qaytdi, hisobotYigish esa qaytmadi · Bot ro'yxatidan faqat kechasiXabar qaytdi
YULDUZCHA: narxOzgartirish ishining oziQiladi qiymatini true ga o'zgartiring va do'kon
ro'yxati endi nima berishini ko'ring — chegara ro'yxati o'sadi.
YORDAM: Bitta ishdan boshlang: javobYozish ni ilova o'zi qiladimi? Bu ish odamga
tegadimi? Ikkalasi ham ha bo'lsa — nomi ro'yxatga tushadi.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s4 dagi ishning to'g'ridan-to'g'ri tarjimasi, shuni ochiq ayting:
qo'lda bosgan tugma endi obyektdagi ikki qiymat.
```

> 🔴 **87-qonun (o'tilgan texnik material):** obyekt, massiv, `if`, `push`, funksiya, `console.log` — hammasi M2 da o'tilgan; `filter`/`map` bilan yozgan o'quvchiga ham ruxsat (M3). AI-agent kodi, Skills fayllari, `claude` chaqiruvi topshiriqqa KIRMAYDI — bu PM darsi.
> 🔴 **26-qonun / R1:** m6-02 VS Code → **m6-06 kompilyator** — registr navbati, senariy o'zgartirmaydi.
> 🔴 **Kompilyator-qobig'i:** `previewUrl` YO'Q (sof JS, brauzer-oynasi yo'q) · qobiqqa `zoom: 'calc(1 / var(--lz, 1))'` bekori MAJBURIY (etalon `PmLesson15`/`PmLesson17`).
> 🔴 **18-ov (starter yashil emas):** uchala shart ham boshlang'ich kod bilan **qizil** — har biri aniq nomning ro'yxatda paydo bo'lishini talab qiladi; bo'sh ro'yxat hech bir shartni yoqmaydi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **147 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch chegarangizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: ilova qaysi ishni o'zi qilmaydi va bu
kimga tegadi? Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
HARAKAT: (s11) yakuniy testga javob beradi; (s12) juftlikda aytadi va bir qator
yozadi; (s14) 10 ta takrorlash kartasini o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biri odamni nomlay olmasa — s4 ekranini qayta oching va o'ng
tomondagi kartani birga o'qing.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — platformadagi odatiy **«O'zingizni sinab ko'ring.»** (bu darsda «sin-» ildizi band emas — §121 tekshirildi).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda ro'yxatingizni davom ettirasiz: mahsulotingizning yana bir ishini
topib, chegarasini va bu qaror kimga tegishini yozasiz. Qancha vaqtingiz bor —
o'zingiz tanlaysiz.
HARAKAT: To'rtinchi chegarani yozadi; chegaralaridan qay biri eng aniq odamni
aytishini belgilaydi va sababini bir gap bilan yozadi.
JAVOB: —
RO'YXAT: To'rtinchi chegara yozilgan · Chegara «…maydi» bilan tugaydi ·
Chegarada bitta aniq odam
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Uch chegarangizdan qay biri eng aniq odamni aytadi — belgilang va
sababini bir gap bilan yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — navbatdagi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «to'rtinchi», «uch chegara» sanoqlari faqat kartalarda.
> 🔴 **§125 (uy-vazifa kuzatiladigan hodisani aytadi):** «eng aniq odamni aytadi» — o'quvchi ko'ra oladigan belgi, «yaxshi yozilgan» kabi baho emas.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — chegara+odam yozish s8 da, qarorni odamga qo'shish s9 da bajarilgan.

### === BLOK 9: CODESTRIKE ===
```
VAQT: 8
KOMPONENT: Quiz (arena)
EKRAN: —
HARAKAT: 12 savol · har biri 15 soniya · sinf reytingi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: Chegara nima va u qaysi ishga qo'yiladi; ilova o'zi qiladigan ish bilan
odamdan so'raydigan ishning farqi; uch qarordan kim jabr ko'rgani (javob, tavsif,
bekor qilingan buyurtma); hamma ishga chegara qo'yilsa nima bo'ladi; ekranning
pastidagi kichkina qator nima uchun turadi; botning to'rt qarori va to'rt odami;
chegara kerak ishni koddan topish; qarorni kim qiladi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'z / kulgili-bo'sh yo'q) · §118 (cheklov-so'zsiz) · §127 (dars atamasi faqat to'g'ri variantda yashamasin) · §129 (kalit oldingi ekran xulosasidan emas). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🛒 Uchala do'konda ham mijozga AI javob yozadi. Qaysi birida chegara bor?
- A. Javobni AI yozib, o'zi yuboradigan do'konda *(38)*
- **B.** Javobni AI yozib, egasi yuboradigan do'konda ✅ *(39)*
- C. Javobni AI ikki marta yozadigan do'konda *(37)*

**Reveal:** To'g'ri — chegara AI ni to'xtatmaydi, uni odamdan o'tkazadi.

> 🔴 **§106/§129:** s2 xulosasi ta'rifni beradi, savol esa uni ikki holatga **qo'llaydi** — javob so'zma-so'z ko'chirib olinmaydi.
> 🔴 **§102:** C — «ikki marta yozsa ishonchli bo'ladi» degan kundalik tasavvur; s2 kartasi uni ochiq rad etadi («xato bo'lsa hech kim to'xtatmaydi» — takrorlash odamni qo'ymaydi). A esa aynan chegarasiz holat.
> 🔴 **Sanoq-mosligi (22-qonun, metodist-tuzatishi):** lead «Ikkala do'konda» deb boshlanardi, ekranda esa uch variant — uch do'kon turadi. Endi «Uchala do'konda».
> 🔴 **§99/§127:** uchala variant ham «… do'konda» bilan tugaydi; «chegara» atamasi faqat savolda turadi, birorta variantda emas — ya'ni kalit so'z bilan topilmaydi. Uzunlik: 38 · 39 · 37 (tell 1.05 ✓), to'g'ri javob eng uzun emas ✓.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** ⚖️ Chegara birinchi navbatda qaysi ishga qo'yiladi?
- A. Ilova mijozdan so'rab qiladigan ishga *(35)*
- B. Do'kon egasi qo'lda qiladigan ishga *(34)*
- **C.** Ilova o'zi qilib qo'yadigan ishga ✅ *(33)*

**Reveal:** To'g'ri — so'ralgan ishni odam to'xtata oladi; ilova o'zi qiladigan ishni esa hech kim to'xtatmaydi.

> 🔴 **§106:** bu qoida s4 ekranida YOZILMAGAN — u yerda faqat ish-darajasidagi fakt-qatorlar bor; bola formulani shu yerda o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **§102/§110:** A va C ikkalasi ham ishonarli, lekin s4 ularni ochiq rad etadi — «so'raydi» tomoni bosilganda ko'zgu ⚪ ga o'tadi, ya'ni jabr yo'q. Kulgili-bo'sh variant yo'q, mutlaq so'z yo'q.
> 🔴 **§99:** uchalasi ham «… ishga» bilan tugaydi. Uzunlik: 35 · 33 · 34 (tell 1.06 ✓), to'g'ri javob eng qisqa emas va eng uzun emas ✓.

### TEST-3 (s7 — s6 haqiqiy holatidan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** ✍️ AI mahsulot tavsifini yozdi. Chegara qaysi ikki qadam orasiga qo'yiladi?
- **A.** Yozilgandan keyin, saytga chiqishdan oldin ✅ *(43)*
- B. Saytga chiqqandan keyin, mijoz o'qishidan oldin *(48)*
- C. Mijoz o'qigandan keyin, buyurtma berishdan oldin *(49)*

**Reveal:** To'g'ri — AI yozadi, odam o'qib chiqadi. Xato tavsif saytga chiqmasdan turib tutiladi.

> 🔴 **§106 qolipi:** s6 slaydlari **faktni** beradi (AI yozadi, tekshirishni odam qiladi), formulani reveal chiqaradi; savol o'sha faktni o'quvchining O'Z mahsulotiga **qo'llaydi**.
> 🔴 **§34 (metodist-tuzatishi):** eski savol «Tavsif saytga qanday chiqadi?» do'konning holatini da'vo qilardi — s4 ning 2-bosqichida do'kon egasi uch ishdan faqat BITTASINI o'qiy oladi, ya'ni tavsifni o'qimasligi ham to'g'ri qaror. Savol darsning o'z mexanikasiga zid tushardi; endi u holatni emas, chegaraning JOYINI so'raydi.
> 🔴 **§102:** B va C — «tekshirishni keyinroq ham qilsa bo'ladi» degan ishonarli tasavvur; s6 uni rad etadi — qator javob O'QILISHIDAN oldin turadi, ya'ni tekshirish chiqishdan oldin bo'ladi.
> 🔴 **§99/§135-C:** uchala variant ham «…dan keyin, …dan oldin» shaklida; birorta so'z yolg'iz to'g'ri variantda uchramaydi. Uzunlik: 43 · 48 · 49 (tell 1.14 ✓), to'g'ri javob eng uzun emas ✓.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📋 Do'kon egasi hamma ishga chegara qo'ydi. Endi nima bo'ladi?
- A. Mijozlarga xato javob ko'proq boradi *(35)*
- **B.** Har ish odam o'qishini kutib turadi ✅ *(35)*
- C. AI ishlarni ikki barobar tez qiladi *(35)*

**Reveal:** To'g'ri — hamma ishga chegara qo'ysangiz, do'kon to'xtab qoladi. Chegara odamga eng og'ir tegadigan ishga qo'yiladi.

> 🔴 **34-qonun (dars o'z ta'limiga zid emas):** darsning ikkinchi yarmi aynan shu — «hammasini taqiqlash» yechim emas; yakuniy test shuni ballaydi, ya'ni bola darsni «AI yomon» deb yodda saqlamaydi.
> 🔴 **§102:** A — s4 da ataylab tutiladigan xato-yo'nalish (chegara ko'paysa xato ko'payadi degan teskari mantiq), o'quvchi uni bir marta ko'rgan; C darsning hech bir ekranida rost emas.
> 🔴 **§135-C (metodist-tuzatishi):** eski B «Har ish **do'kon egasini** kutib turadi» savol-sarlavhadagi «do'kon egasi» ni yolg'iz o'zi qaytarardi — kalit so'z-echo bilan topilardi. Endi: «Har ish odam o'qishini kutib turadi».
> 🔴 **§99/§110:** uchalasi ham «Endi nima bo'ladi?» savoliga hodisa bilan javob beradi; mutlaq so'z bir variantdan oshmaydi. Uzunlik: 36 · 35 · 35 (tell 1.03 ✓), to'g'ri javob eng uzun emas ✓.

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).
> 🔴 **Kalit-taqsimoti:** **B · C · A · B** — bitta indeks ketma-ket takrorlanmaydi (shakl-telli yo'q, §107 ruhi); arena kalitlari alohida tartibda (9-bo'lim).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi aksent halqada, kelgusi kulrang-punktir.

**Yozuv-kartasi (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: ish-maydoni → odam-maydoni + jonli javob-qatori. Ikkala maydon ham teng vaznda; birortasi «asosiy» deb ajratilmaydi.

**Varaq-kartasi (kirish-artefakt):** sarlavha ostida, bitta qator, o'qish holatida (tahrir yo'q) — 4-blokdagi jadvalga qarang. `pm-m6d2-prd` yo'q bo'lsa u umuman chizilmaydi.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `Bilmagan savolga javob yozmaydi → Javobga ishonib buyurtma bergan mijoz` (strelkali juftlik, s1 demosi bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32/§115):** `«Ilova qaysi ishni o'zi qilmaydi?»` · `«Bu qaror kimga tegadi?»` — ikkalasi ham savol-shaklda, bir gap-turida; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q.

**106d javob (ikki tomonlama, §130 halolligi bilan):** ✅ «Ish ham, odam ham yozildi.» · 🤔 «Bu hali bitta odam emas. Qaysi mijoz? O'sha paytda u nima qilayotgan edi?»

**Guruh-nomlari ro'yxati** (106d(c), dars o'z lug'atidan): *hamma · odamlar · mijozlar · foydalanuvchilar · bolalar · jamiyat*. O'quvchi odam maydoniga faqat shulardan birini yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**Inkor-sharti:** ish maydonida `-maydi` / `-masin` / `-may` o'zaklaridan biri bo'lishi kutiladi. Yo'q bo'lsa — bitta yo'naltiruvchi qator, keyin baribir saqlanadi.

**Muvozanat esi:** bu ekranda «kamida bittasi chegarasiz qolsin» sharti YO'Q — muvozanat s4 ning ikkinchi bosqichida va s11 testida o'rgatiladi, YULDUZCHA esa uni yozdirib ko'radi. Sabab: artefakt-shakli muhrlangan (`chegaralar × 3`) va unga to'rtinchi maydon qo'shilmaydi.

---

## 6. HAQIQIY HOLAT SPETSIFIKATSIYASI (s6 — ZAXIRA ILGAK · 33/56/100-qonun qolipi)

🔴 **Nima uchun keys emas:** 0-bo'limdagi «Keys-qarori» bandiga qarang. Bu ekran keys-slayd QOLIPINI (freym → slaydlar → bitta bashorat → ko'prik-gap) saqlaydi, lekin mazmuni bank keysi emas.

🔴 **O'ylab topilgan voqea, kompaniya va raqam YO'Q** (`PM_Prompt_v8` zaxira-ilgak sharti). Ekran o'quvchi **o'z telefonida o'n soniyada tekshirib ko'ra oladigan** holatni ko'rsatadi. Ekranda birorta foiz, sana yoki statistika yo'q.

**Freym (91b):** eyebrow — **«📱 Haqiqiy holat»**. Birorta mahsulot yoki kompaniya nomi ekranga chiqmaydi.

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **Telefoningizda AI bilan yozishadigan ilova bor.** Savol yozasiz — javob bir necha soniyada keladi.
2. **Ekranning pastida kichkina bitta qator turadi.** U hech qachon yo'qolmaydi.
3. *(bashorat)* **Sizningcha, o'sha qator u yerda nima uchun turadi?**
4. **Qator bitta ish uchun turadi:** javobni o'qigan odam uni tekshirib ko'rsin. Javobni AI yozdi — javobga ishonadigan esa odam.

**Bashorat (3-slayddan oldin, zinapoya tartibida — korpus §43 · bitta savol: qator NEGA u yerda turadi):**
- «Ilovani yozganlarning nomi ko'rinib tursin» *(42)*
- «Javob necha so'z bo'lgani ko'rinib tursin» *(41)*
- «O'qigan odam javobni tekshirib ko'rsin» ✅ *(38)*

**Natija-qatori (56/100-qonun):** topsa «🎯 Topdingiz! O'qigan odam javobni tekshirib ko'rsin» — quyruqsiz; adashsa «Adashdingiz — asl javob: o'qigan odam javobni tekshirib ko'rsin». 🔴 «Bu ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — darsga qaytadi):**
> Demak AI javob yozadi, tekshirishni odam qiladi — buni ilovaning o'zi ochiq yozib qo'ygan. Quradigan mini-do'koningizda ham shu savol turadi: qaysi ishni AI o'zi qilaversin, qaysi biri odamdan o'tsin. Bu qarorni ilova emas, mahsulotni o'ylaydigan odam qiladi — endi u sizniki.

> 🔴 **109-qonun (TMI ov-ro'yxati 6-bandi):** ball bermaydigan bashorat — **maks 1 ta** ✓ (bitta).
> 🔴 **Korpus §36 (raqam manbasi):** bu ekranda birorta raqam YO'Q — o'ylab topilgan statistika taqiq.
> 🔴 **Fakt-halolligi:** to'rttala slayd ham o'quvchi o'z telefonida tasdiqlay oladigan narsani aytadi (ilova bor · ekranning pastida qator bor · qator yo'qolmaydi · qator o'qiydigan odamga qaratilgan). Odamlarning xatti-harakati haqidagi tekshirib bo'lmaydigan da'vo («ko'pchilik uni o'qimaydi») YOZILMAYDI.
> 🔴 **Bashorat halolligi (17/43/64):** uchala variant ham «qator nega turadi» savoliga javob beradi; 1-2 variantlar na slaydda, na hayotda rost emas — to'g'ri belgilagan bola «Adashdingiz» olmaydi. Uzunlik: 42 · 41 · 38 (tell 1.11 ✓).
> 🔴 **§99 (metodist-tuzatishi — shakl-telli):** eski uchlikda ikkita variant «qator NIMA deydi» («necha so'zdan chiqqanini aytadi», «o'z eslatmasi»), to'g'ri javob esa yolg'iz o'zi «NEGA turadi» shaklida edi — mazmunga qaramay shakl bilan topilardi. Endi uchalasi ham maqsad-shaklida («… tursin / … ko'rsin»).
> 🔴 **§21/§117:** bashorat matnida izohsiz chet so'z yo'q; qatorning rasmiy nomi (ilovadagi ogohlantirish yorlig'i) ekranga CHIQMAYDI — u o'quvchi ko'radigan so'zlar bilan ataladi: «ekranning pastidagi kichkina qator». 🔴 **Metodist-tuzatishi (fakt-halolligi):** eski shakl «har javobning ostida» der edi — ko'p ilovada qator har javob ostida emas, ekranning pastida bir marta turadi; slayd endi o'quvchi telefonida chindan ko'radigan holatni aytadi.
> 🔴 **§40:** ko'prikda «quradigan mini-do'koningiz» — hali ishlab turgan do'kon yo'q.
> 🔴 **Ohang:** ekran AI ni ayblamaydi va qo'rqitmaydi — u faqat ilovaning O'ZI yozib qo'ygan qatorni o'qitadi.
> 🔴 **Mentorga:** «Hozir telefonini ochib ko'rmoqchi bo'lganlar bo'ladi — ruxsat bering, bu darsning eng foydali o'ttiz soniyasi» (`MentorNote`).
> 🔴 **Ekran-o'lchovi:** slayd-matnlari mashq-materiali; freym + bashorat savoli + ko'prik = **342 grapheme** ✓.

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · kompilyator)

**Darvoza-mashq (82e):** bitta savol darsning O'Z texnik bilimidan (`m6-04` — AI-agent qaror sikli):
«Agent xavfli ishni bajarishdan oldin nima qiladi?» → «Odamdan tasdiq so'raydi» ✅ *(23)* / «Ishni ikki marta bajaradi» *(24)* / «Xabarni jurnalga yozib qo'yadi» *(27)*

> 🔴 **8.4 uzunlik-tell:** 23 · 24 · 27 → tell 1.17 ✓; to'g'ri javob eng uzun emas ✓.
> 🔴 **§112 ko'prigi shu yerda ham ishlaydi:** darvoza-mashqi `m6-04` ning «vakolat chegarasi» qadamini eslatadi — kod shundan keyin shu qadamni RO'YXAT qilib chiqaradi.

**Boshlang'ich kod (qo'shtirnoq bilan — korpus §135: bir tirnoqli starterga o'zbek matni qo'yilsa kod sinadi):**

```js
// Har ish uchun ikki qiymat: ilova buni o'zi qiladimi va bu ish kimga tegadi
// tegadi: "" — bu ish hech kimga tegmaydi (do'konning ichki ishi)
const dokonIshlari = [
  { nom: "javobYozish",     oziQiladi: true,  tegadi: "mijoz" },
  { nom: "narxOzgartirish", oziQiladi: false, tegadi: "mijoz" },
  { nom: "buyurtmaBekor",   oziQiladi: true,  tegadi: "mijoz" },
  { nom: "hisobotYigish",   oziQiladi: true,  tegadi: "" }
];

const botIshlari = [
  { nom: "kechasiXabar",  oziQiladi: true,  tegadi: "mijoz" },
  { nom: "adminXabar",    oziQiladi: true,  tegadi: "" },
  { nom: "chegirmaXabar", oziQiladi: false, tegadi: "mijoz" }
];

function chegaraKerak(ishlar) {
  // Ilova o'zi qiladigan va odamga tegadigan ishlarning nomini qaytaring
  return [];   // <- bu joyni siz to'ldirasiz
}

console.log(chegaraKerak(dokonIshlari));
console.log(chegaraKerak(botIshlari));
```

Kutilgan natija: `['javobYozish', 'buyurtmaBekor']` va `['kechasiXabar']`.

**Uch shart (RO'YXAT bilan bir xil so'zlarda — hammasi xulq-atvorda, 18-ov):**
1. Do'kon ro'yxatidan `javobYozish` qaytdi
2. Do'kon ro'yxatidan `buyurtmaBekor` qaytdi, `hisobotYigish` esa qaytmadi
3. Bot ro'yxatidan faqat `kechasiXabar` qaytdi

> 🔴 **18-ov (starter yashil emas) — tekshirildi:** boshlang'ich kod bo'sh ro'yxat qaytaradi, ya'ni uchala shart ham **qizil** boshlanadi. Har shart aniq NOMNING paydo bo'lishini talab qiladi; «bo'sh ro'yxat qaytaradi» yoki «massiv qaytaradi» kabi shart ATAYLAB yozilmadi — u starterda allaqachon bajarilgan bo'lardi.
> 🔴 **`previewUrl` YO'Q** — sof JS topshirig'i; kompilyator qobig'ida brauzer-oynasi chizilmaydi.
> 🔴 **Qobiq bekori (majburiy):** `zoom: 'calc(1 / var(--lz, 1))'` — etalon `PmLesson15`/`PmLesson17`; 25 fayllik sweep hali ochiq, yangi dars tuzatilgan naqsh bilan tug'iladi.

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta ishdan boshlang: `javobYozish` ni ilova o'zi qiladimi? Bu ish odamga tegadimi? Ikkalasi ham ha bo'lsa — nomi ro'yxatga tushadi.

**YULDUZCHA:** `narxOzgartirish` ishining `oziQiladi` qiymatini `true` ga o'zgartiring va do'kon ro'yxati endi nima berishini ko'ring — chegara ro'yxati o'sadi.

> 🔴 **Sanoq-mosligi (22-qonun):** kod nomlari s4 va s9 dagi ishlardan olingan — `javobYozish` va `buyurtmaBekor` s4 ning uchligidan, `kechasiXabar` s9 ning to'rtligidan; `tegadi: ""` bo'lgan ikki ish (`hisobotYigish`, `adminXabar`) — ekranda ko'rinmagan, lekin do'konda bor ichki ishlar, ular chegarani KERAK QILMAYDI. Bu farqni mentor bir gapda aytadi.
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`oziQiladi` · `hisobotYigish` · `dokonIshlari`): kodda apostrofsiz, prozada «o'zi qiladi», «hisobot yig'ish», «do'kon ishlari». Bir tushuncha, ikki ko'rinish — kod va matn (korpus §135: imlosi buzuq so'z o'quvchiga ko'rinmasin, shuning uchun kod-nomlari **atama emas, o'zgaruvchi nomi**).
> 🔴 **87-qonun:** obyekt + `if` + massiv-`push` — M2 materiali; `filter` + `map` bilan yozgan o'quvchiga ham ruxsat, ikkala yo'l JAVOB shartini bajaradi.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — s4 da qo'lda bosgan tugma endi obyektdagi `oziQiladi` qiymati, o'ng tomonda ko'rgan odam esa `tegadi` qiymati.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qaror-qatori CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchlik s4 va s9 to'plamlariga KIRMAYDI · «chegara» so'zi bu ekranda 0 (§126) |
| **s9 TEKSHIRUV** | Sarlavha buyruq shaklida: «Har qarorni jabr ko'radigan odamga qo'shing.» · chapda 4 qaror, o'ngda 4 odam · uch juftlik o'quvchiniki, to'rtinchisi o'z-o'zidan qo'shiladi · har juftlikdan keyin sabab-qatori (5-bo'lim jadvali) |
| **s12 REFLEKSIYA** | Sarlavha: «Uch chegarangizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha — platformadagi odatiy «O'zingizni sinab ko'ring.» |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara.» · «Chegara ilova o'zi qilib qo'yadigan ishga qo'yiladi.» · «Har qaror bitta aniq odamga tegadi — o'sha odam chegarani belgilaydi.» · «Qarorni ilova emas, mahsulotni o'ylaydigan odam qiladi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/hook/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |
| **Platforma-matnlari** | 🔴 §130 (ildiz platforma-matnida ham): «chegara» ildizi tizim-matnlarida boshqa ma'noda turmasin — yuklanish, podium va arena matnlarida «chegaralangan», «vaqt chegarasi» kabi qatorlar ISHLATILMAYDI; taymer matni «15 soniya» ko'rinishida qoladi |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s · 4 variant)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.
> 🔴 **Kalit-tartibi (quruvchiga majburiy):** `0,3,2,1` · `1,0,2,3` · `0,2,1,3` — 12 savol bo'ylab shu ketma-ketlikda.

| # | Savol (qisqa) | Kalit | Manba |
|---|---|---|---|
| 1 | Chegara nima? | 0 | s2 |
| 2 | Ilova so'raydigan ish bilan o'zi qiladigan ishning farqi nimada? | 3 | s2 |
| 3 | Chegara birinchi navbatda qaysi ishga qo'yiladi? | 2 | s4 + s5 |
| 4 | AI bilmagan savolga javob yozsa, kim jabr ko'radi? | 1 | s4 |
| 5 | Tavsif hech kim o'qimay saytga chiqsa, nima bo'ladi? | 1 | s4 |
| 6 | Buyurtmani ilova o'zi bekor qilsa, kim jabr ko'radi? | 0 | s4 |
| 7 | Ekranning pastidagi kichkina qator nima uchun turadi? | 2 | s6 |
| 8 | Bot tasdiqni kechasi yuborsa, kim jabr ko'radi? | 3 | s9 |
| 9 | Kasal bo'lib yotib qolgan mijozga botning qaysi qarori tegdi? | 0 | s9 |
| 10 | Birinchi marta buyurtma bergan mijozga botning qaysi qarori tegdi? | 2 | s9 |
| 11 | Hamma ishga chegara qo'yilsa, do'konda nima bo'ladi? | 1 | s4 + s11 |
| 12 | Ilovaning qarorini kim qiladi? | 3 | s6 + s15 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q. «AI» — kursning o'z atamasi (`m6-01`/`m6-04`/`m6-05` da ochilgan), qo'shimcha gloss shart emas. 🔴 **«guardrails» arena savollariga ham, variantlariga ham KIRMAYDI** — u faqat flashcard-10 javobida, gloss bilan.
> 🔴 **29-qonun:** «ufq», «yo'l-xaritasi», «metrika-slaydi», «React Native» arena matniga kirmaydi.
> 🔴 **§114 (fon-dekor darsning o'z lug'atidan):** arena fonida suzadigan so'zlar shu darsniki — `chegara · qaror · mijoz · bot · javob`; boshqa darsning atamalari (`yuk`, `sig'im`, `signal`, `nosozlik`) qolmasin.
> 🔴 **§134:** birorta variant rang-holatiga tayanmaydi — ko'zgudagi 🔴/⚪ ma'nosi ekranda o'rgatilgan bo'lsa ham, arena savoli **hodisa tilida** yoziladi.
> 🔴 4, 6, 8-savollarning distraktorlari **boshqa savolning to'g'ri odami** bo'lmasin (§102): har savolda bitta odam to'g'ri, qolgan uchtasi shu sahnada ko'rinmagan odamlar.
> 🔴 **Savol-shakli takrorlanmasin (metodist-tuzatishi):** avval 12 savoldan oltitasi bir xil «kim jabr ko'radi?» qolipida edi — arena zerikarli bo'lardi, ustiga to'g'ri javoblarning oltitasi ham «… mijoz» bilan tugardi va bola mazmunga qaramay tanlab ketardi. Endi qolip uchtada (4, 6, 8), 9 va 10 teskari yo'nalishda (odam → qaysi qaror), 5 esa oqibat so'raydi.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Mirror Check!** | Qaror kimga tegishini o'zingiz ko'rdingiz | 40 | s4: uchala ish ochildi va chegara-qarori tanlandi |
| **Rule Maker!** | Uch chegarani odami bilan yozdingiz | 35 | s8: 3/3 saqlandi |
| **Pair Finder!** | To'rt qarorni odamiga qo'shdingiz | 33 | s9: 3/3 juftlik to'g'ri |
| **Limit Coder!** | Chegara kerak ishlarni kod bilan topdingiz | 42 | s10: uchala shart yashil |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 33–42 belgi (§63 oralig'i) ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Mirror», «Rule», «Pair», «Limit», «Maker», «Finder», «Coder» — kursning texnik lug'atida boshqa ma'no bermaydi ✓. «Line» so'zi ATAYLAB olinmadi — u kod qatori bilan to'qnashardi.
> 🔴 **§93/§130/§133 (tasdiq faqat REAL bajarilgan ishni aytadi):** «ko'rdingiz» (s4 da chindan ko'rdi) · «yozdingiz» (s8 da yozdi) · «qo'shdingiz» — trigger 3/3 **to'g'ri** juftlikda, ya'ni xato javobda nishon berilmaydi · «kod bilan topdingiz» (s10 da uchala shart yashil bo'lganda).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Chegara nima? | Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror |
| 2 | Chegara birinchi navbatda qaysi ishga qo'yiladi? | Ilova o'zi qilib qo'yadigan ishga |
| 3 | Chegara yozishdan oldin qaysi savol beriladi? | Bu qaror kimga tegadi? |
| 4 | Jabr ko'radigan odam qanday yoziladi? | Bitta aniq odam bo'lib — «hamma» deb emas |
| 5 | AI yozgan tavsif saytga chiqishidan oldin nima bo'ladi? | Do'kon egasi o'qib chiqadi |
| 6 | Hamma ishga chegara qo'yilsa nima bo'ladi? | Har ish odamni kutib turadi — do'kon to'xtaydi |
| 7 | Bot tasdiqni kechasi yuborsa, kim jabr ko'radi? | Telefonini yostiq yonida qoldiradigan mijoz |
| 8 | AI bilmagan savolga javob yozsa, kim jabr ko'radi? | Javobga ishonib buyurtma bergan mijoz |
| 9 | Ilovaning qarorini kim qiladi? | Mahsulotni o'ylaydigan odam |
| 10 | Agentga qo'yilgan chegara nima deb ataladi? | Vakolat chegarasi (inglizchasi — guardrails) |

> 🔴 **Korpus §20/§52:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **§76/§132:** 10-karta old tomoni **o'zbekcha tushunchani** so'raydi, inglizcha nom javobda gloss bilan turadi — «…ning inglizcha nomi?» shakli ISHLATILMAGAN.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · joy · savol · odam aniqligi · AI+odam ketma-ketligi · muvozanat · ikki sahna misoli · qarorning egasi · agent ko'prigi).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Chegara — oldindan qilingan qaror»** — (1) kanonik ta'rif · (2) chegara ilovani to'xtatmaydi, ishni odamdan o'tkazadi · (3) sinfga savol
**s5 · «Chegara o'zi qiladigan ishga qo'yiladi»** — (1) so'ralgan ishni odam to'xtata oladi · (2) o'zi qilinadigan ishni hech kim to'xtatmaydi · (3) savol
**s7 · «AI yozadi, odam o'qib chiqadi»** — (1) ilovaning o'zi ekran pastiga shu qatorni yozib qo'ygan · (2) chegara AI yozgan payt bilan mijoz o'qigan payt orasiga tushadi · (3) savol
**s11 · «Har qaror bitta odamga tegadi»** — (1) chegarani odamga eng og'ir tegadigan ish oladi · (2) hamma ishga chegara qo'yilsa, do'kon to'xtaydi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **§133:** xulosa-bandlarining birortasi keyingi testning kalitini so'zma-so'z bermaydi — s7 kartasi T4 ni, s5 kartasi T3 ni oldindan aytmaydi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **YO'Q** — zaxira ilgak, sabab 0-bo'limda hujjatlangan; o'ylab topilgan kompaniya, raqam va voqea **0** ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — m6-02 katak-tekshiruv · m5-11 kun-belgilash · m4-15 qaror-sabab tanlovi · MatchPairs (M7-D2, M8-D1) · **M6-D6 oqibat-juftlash (qaror ↔ odam)** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): mini-do'kon — s0 dan s15 gacha; s6 haqiqiy holati o'z freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): onlayn do'kondan buyurtma — o'smir buni o'zi qiladi; ustiga bu M6 da uning O'Z loyihasi ✓
- 96c(a)/(e): ip o'quvchining artefaktida; demo-olam band ro'yxatning hech biri emas (grep bilan tasdiqlandi — shapka) ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m6-02 VS Code → m6-06 kompilyator) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2 materiali (obyekt · massiv · `if` · `push`); AI-kod topshiriqqa kirmaydi ✓
- 29 (kelajak-atama oqmaydi): «ufq», «yo'l-xaritasi», «metrika-slaydi», «React Native», «Expo» o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104: hook ikki tanlovi teng (33 ↔ 35 belgi) ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap); ball bermaydigan bashorat — 1 ta ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (ish nomi va odam — ikkalasi ham darsning o'zidan yoki o'quvchining varag'idan) ✓
- 92(a) (bir ekran — bir ish): s8 da faqat yozish, s9 da faqat juftlash, s4 da faqat bosish ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi — §99–136 bilan birga):**
1. **§20/§80/§85/§121:** «chegara» yagona nom, kanonik ta'rif 4 yuzada so'zma-so'z; ildiz-grep bo'yicha «chegaralangan», «vaqt chegarasi» platforma-matnida ham 0 ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «… do'konda» · T2 «… ishga» · T3 chiqish-yo'li · T4 hodisa) ✓
3. **§102:** distraktorlar ekranda rost bo'lib ko'rinmaydi; T2-A va T2-B ni s4 ochiq rad etadi, T3-B va T3-C ni s6 rad etadi (tekshirish chiqishdan OLDIN) ✓
4. **§104/§126:** bosh atama maqsad-ekranda YO'Q, s2 da ta'rif-gap bilan tug'iladi (kesik qurilma emas) ✓
5. **§105/§121 (kalit so'z bir ma'noda):** «chegara» faqat qaror ma'nosida · «tegadi» faqat oqibat ma'nosida (❌ «tugma tegadi») · «javob» — AI yozadigan matn; javobgarlik esa «qarorni kim qiladi» shaklida aytiladi, ya'ni bitta so'z ikki ma'no bermaydi ✓
6. **§106/§129:** T1 s2 ta'rifini qo'llatadi · T2 formulasi s4 da yozilmagan · T3 s6 faktini chegaraning JOYIGA o'giradi (13-A, 2-band) · T4 muvozanatni so'raydi ✓
7. **§107:** ha/yo'q-savol yo'q ✓
8. **§108:** hech bir savol rostni rad ettirmaydi ✓
9. **§109:** bosh ta'rif zamon-iborasi bilan ✓
10. **§110/§118:** mutlaq so'z bir variantdan oshmaydi; kulgili-bo'sh variant yo'q; «faqat», «hech qachon» ballanadigan variantlarda takrorlanmaydi ✓
11. **§111:** «degan javob» qurilmasi 0 ✓
12. **§112:** «vakolat chegarasi» ↔ «chegara» ko'prigi s2 da, bir gapda ✓
13. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi ekran to'xtatgandan keyin, s9 turtkisi ikkinchi-uchinchi juftlikda) ✓
14. **§114:** arena fon-so'zlari shu dars lug'atidan (chegara · qaror · mijoz · bot · javob) ✓
15. **§115:** ikkala ipucha ham savol-shaklda; uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
16. **§116:** s9 YORDAM-savoli ikkala o'lchovni qamraydi (odam qaysi paytda telefoniga qaray oladi + bot undan nima kutyapti) — to'rtala juftlikka ham olib boradi ✓
17. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi; yo'nalish-fe'llari real yo'nalishda («chegara ishga qo'yiladi», «qaror odamga tegadi») ✓
18. **§119:** hook payoffi hech bir tanlovni yolg'onga chiqarmaydi ✓
19. **§120:** s9 materialida har odam o'z holatini o'zi aytadi — har juftlik uchun bitta himoyalanadigan javob ✓
20. **§122/§124:** keys yo'q — bank-raqami ham yo'q; s6 da ballanadigan javob umuman berilmaydi (bashorat ballanmaydi) ✓
21. **§123/§128:** s1 demosi darsning O'Z ikki shartidan o'tadi («… qilmaydi» + bitta aniq odam) ✓
22. **§127:** dars atamasi faqat to'g'ri variantda yashamaydi — T1 da «chegara» birorta variantda yo'q, u savolda turadi ✓
23. **§130:** yashil ✅-qatori faqat tekshirilganini aytadi («Ish ham, odam ham yozildi») ✓
24. **§131:** karta-sarlavhalari atamani gloss'dan oldin nomlamaydi — s2 kartalari «Ilova so'raydi» / «Ilova o'zi qiladi», ya'ni hodisaning o'zi ✓
25. **§132:** flashcard-10 inglizcha nomni SO'RAMAYDI, javobda beradi ✓
26. **§133:** ikki ma'noli fe'l yo'q; nishon-tavsiflari real tekshirilgan ishni aytadi ✓
27. **§134/§135 (metodist-raundida qayta ko'rildi):** rang-legendasi o'quvchi matnida va u yerda «jabr» atamasi tug'iladi (s4) · ekranda tekshirib bo'lmaydigan birorta son qolmadi — s9 sabab-qatoridagi «o'n to'rtta» olib tashlandi (13-A, 7-band) ✓
28. **§135-B:** dars ishlatadigan har atama ta'riflangan — «chegara» s2 da, «vakolat chegarasi» ko'prikda, «jabr ko'radigan odam» s4 legendasida ✓
29. **§136 / MATN_ETALONI 7-C (F-0818-03 adabiy norma):** butun senariy ovoz-testidan o'tkazildi — `kant-*` oilasining beshala qoidasi (7-C.2) bo'yicha 0 topilma, `sheva-*` oilasining to'rttasi (7-C.3 — qisqargan shakl, gap oxiridagi yuklamalar, hozirgi zamon shakli, so'zlashuv to'ldiruvchilari) bo'yicha ham 0; registr faqat «siz», maqtov adabiy («Topdingiz», «To'g'ri»), `registr-*` warn yo'q ✓
30. **§40:** «ishlab turgan do'koningiz» 0 — o'quvchida hali tizim yo'q; uniki bo'lgan narsalar «uch chegarangiz» va `m6-02` varag'i ✓
31. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
32. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — kirish-artefakt jim zaxira ✓
33. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 3 ish (s4) · 4 slayd + 1 bashorat (s6) · 3 chegara (s8/s12/uy-vazifa) · 4 qaror va 4 odam (s9) · 2 ro'yxat + 3 shart (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
34. **Ekran-prozalari (metodist-raundidan keyin qayta o'lchandi — Intl.Segmenter):** s0 330 · s1 148 · s2 314 · s4 317 (1-bosqich 234 + 2-bosqich kartasi 103; yakun-qatori 2-bosqich kartasining O'RNIGA chiqadi — quruvchiga shart) · s6 341 · s8 107 · s9 157 · s10 147 grapheme (chegara 400) ✓

35. **Darvoza natijasi:** `node til-lint.mjs pm-senariylar/M6-D6-Etika.md` → **0 error / 3 warn** ·
    `node prompt-lint.mjs` → toza. Uchala warn ham senariy-annotatsiyasiga tegishli va o'quvchi
    matniga chiqmaydi: `yadro-jargon` ×2 — PM_Prompt_v8 ning uchinchi blok-nomi (2-bo'lim
    jadvali va 3-bo'lim sarlavhasi) · murojaat-qoidasi ×1 — o'z-tekshiruvning 7-bandi, ya'ni
    taqiqning O'ZI haqidagi qator. Pretsedent: M4a-D2 (3 warn, aynan shu ikki sinf).

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/6-Modull/PmLesson23.jsx` → **0 error** shart (87 qoida) · `npm run lint:jsx` → 0 topilma.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M6-D6 ga tegishli):
`etika` · `axloq` · `mas'uliyat` · `javobgarlik` (o'quvchi matnida **0** — mavhum otlar) ·
`zarar` · `ziyon` · `xavf` · `yomonlik` (fe'l-intizomi: faqat «jabr ko'radi») ·
`ochiq ma'lumot` · `yopiq ma'lumot` · `maxfiy` · `parol` · `shaxsiy ma'lumot` (M4-D7 niki — **0**) ·
`ufq` · `yo'l-xarita` · `roadmap` · `RICE` (m6-12 niki, 29-qonun) ·
`metrika-slayd` · `isbot-raqam` (m6-14 niki) · `React Native` · `Expo` (m6-09…11 niki) ·
`model` · `prompt` · `kontekst` · `token` · `hallutsinatsiya` · `bias` (texnik kalka **0**) ·
`guardrails` (faqat flashcard-10 javobida, gloss bilan — arena/test/bashoratda **0**) ·
`do'koningiz ishla` · `AI javob berayotgan` (§40 — **0**) ·
`chegaralangan` · `vaqt chegarasi` (§121/§130 — ildiz platforma-matnida ham boshqa ma'noda turmasin) ·
`hamma odamlar` · `jamiyat` · `foydalanuvchilar` (mavhum guruh — jabr ko'radigan odam DOIM bitta) ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`topilmadi` · `saqlanmagan` (§69) · `ustaxona` · `ko'zgu` · `oqibat-juftlash` (senariy-ichi nomlar — o'quvchi matnida **0**) ·
`daftar` · `chala` va `til-lint-rules.json` dagi barcha error-darajali o'zaklar (manba bitta — ro'yxat bu yerda takrorlanmaydi; `lint:til` ularni o'zi tutadi) ·
🔴 Bu ro'yxatda taqiq-so'zlarning O'ZI yozilmaydi — senariy faylining o'zi ham `lint:til` dan
o'tadi, ya'ni ro'yxat-ko'chirma o'zi xato beradi (F-0819 sinfi). Manba bitta:
`til-lint-rules.json` va `MATN_ETALONI.md` 3-bo'lim lug'ati.

---

## 13-A. METODIST-KORREKTURA (2026-08-19 · F-0819-01 · senariy-bosqichi)

> Quruvchidan OLDINGI til/pedagogika raundi. Kalit-indekslar (to'g'ri javob POZITSIYASI) **tegilmadi** —
> T1 B · T2 C · T3 A · T4 B va arena `0,3,2,1 · 1,0,2,3 · 0,2,1,3` o'z joyida qoldi; mexanika,
> ekran soni va artefakt-shakli ham o'zgarmadi. Faqat MATN tuzatildi.

**A · Test va bashorat halolligi (5 tuzatish)**
1. **T1 sanoq-mosligi (22-qonun):** lead «**Ikkala** do'konda ham mijozga AI javob yozadi» der edi, ekranda esa uch variant — uch do'kon turadi. → «**Uchala** do'konda…».
2. **T3 darsning O'Z mexanikasiga zid edi (34-qonun):** eski savol «Tavsif saytga qanday chiqadi?» + to'g'ri javob «Do'kon egasi o'qib chiqqanidan keyin» do'konning holatini da'vo qilardi — lekin s4 ning 2-bosqichida do'kon egasi uch ishdan faqat **bittasini** o'qiy oladi, ya'ni tavsifni o'qimaslik ham to'g'ri qaror. Bolani o'z qarori uchun jazolaydigan savol edi. → savol endi holatni emas, **chegaraning joyini** so'raydi: «Chegara qaysi ikki qadam orasiga qo'yiladi?» · A «Yozilgandan keyin, saytga chiqishdan oldin» ✅ · B/C — kechroq ikki nuqta. Uchala variant bir shaklda, kalit-echo yo'q (43 · 48 · 49 — tell 1.14).
3. **T4-B so'z-echosi (§135-C):** «Har ish **do'kon egasini** kutib turadi» — savol-sarlavhadagi «do'kon egasi» faqat to'g'ri variantda qaytardi. → «Har ish **odam o'qishini** kutib turadi».
4. **s6 bashorati — shakl-telli (§99):** ikki variant «qator NIMA deydi», to'g'ri javob yolg'iz o'zi «NEGA turadi» shaklida edi. → uchalasi ham maqsad-shaklida: «Ilovani yozganlarning nomi ko'rinib tursin» · «Javob necha so'z bo'lgani ko'rinib tursin» · «O'qigan odam javobni tekshirib ko'rsin» ✅ (42 · 41 · 38).
5. **Arena bir qolipga tushib qolgan edi:** 12 savoldan **oltitasi** «…, kim jabr ko'radi?» va oltala to'g'ri javob «… mijoz» bilan tugardi — mazmunga qaramay tanlash yo'li ochiq edi. → qolip uchtada qoldi (4 · 6 · 8), **9 va 10 teskari yo'nalishga** o'girildi (odam → qaysi qaror), **5** oqibat so'raydi. Kalitlar o'z joyida.

**B · s9 «oqibat-juftlash» — juftlik mazmun bilan topilsin**
6. **So'z-echosi (§135-C):** 3-qaror «**Bir hafta** javob bermagan buyurtmani o'zi bekor qiladi» ↔ odam-kartasi «**Bir hafta** kasal bo'lib yotgan mijoz» — juftlik ikki so'zni ko'rib topilardi. → odam-kartasi «**Kasal bo'lib yotib qolgan mijoz**», sabab-qatori «Tuzalib qaraganda buyurtmasi bekor bo'lgan edi».
7. **Manbasiz son (§135-A):** «Darsdan chiqqanda **o'n to'rtta** bir xil xabar turardi» — s9 juftlash-ekranida bot-oynasi ham, o'n to'rtta qator ham chizilmaydi; son ekranda tekshirilmasdi. → «…telefoni bir xil xabarlarga to'lib ketgan edi».
8. **Yo'riqnoma qisqardi** (o'zi ko'rinib turgan qadam olib tashlandi) va sarlavha kelishigi to'g'irlandi: «jabr ko'radigan odam**iga** qo'shing» → «…odam**ga** qo'shing» (2 joyda).

**C · Atama-intizomi va rang-legendasi**
9. **🔴 Legenda darsning o'z qoidasiga zid edi (§134/§135):** «⚪ — bu qaror unga **tegmaydi**» der edi, dars esa oxirigacha «**har qaror bitta odamga tegadi**» deb o'rgatadi (s15 qatori) — bitta fe'l ikki ma'noda. Ustiga «jabr» so'zi hech qayerda ochilmagan edi (§135-B: dars ishlatadigan atama ta'rifsiz qolmasin). → legenda endi **atamani tug'diradi**: «🔴 — bu qaror shu odamning **kunini buzadi: u jabr ko'radi** · ⚪ — bu qaror uning kunini buzmaydi». «Kun» tanlandi, chunki s8 YORDAMI ham «bu bitta odamning **kuniga** qanday tushadi?» deb so'raydi; «ish» olinmadi — u bu darsda ilovaning vazifasi.
10. **Darsning O'Z taqiq-so'zi o'z markaziy ekranida turardi:** s4 2-bosqich kartasi «Do'kon egasining vaqti **chegaralangan**» — 8-bo'lim bu ildizni platforma-matnida ham taqiqlagan (§121/§130). → «Do'kon egasining vaqti **oz**». Shu yerdayoq bosh-harfli urg'u «faqat BITTASINI» → **qalin** (bosh harf o'zbek matnida baqirish bo'lib o'qiladi).
11. **s2 xulosasidagi noaniq olmosh:** «…bitta joyidagi chegara; bugun **uni** butun mahsulotga qo'yasiz» → «…bitta joyidagi chegara **edi**; bugun butun **mahsulotingizga chegara qo'yasiz**» (3 joyda — shapka §112 bandi, blok-gapi, s2 kartasi).
12. **Siqilgan ibora:** «Chegara **jabr eng aniq ko'ringan** ishga qo'yiladi» (T4 reveal + s11 RECAP) → «Chegara **odamga eng og'ir tegadigan** ishga qo'yiladi».
13. **Do'kon holatini da'vo qilgan yana ikki yuza** (2-band kaskadi): s7 RECAP «tavsif ham, javob ham odamdan o'tadi» → «chegara AI yozgan payt bilan mijoz o'qigan payt orasiga tushadi» · flashcard-5 savoli «AI tavsif yozdi. **Keyin** nima bo'ladi?» → «AI yozgan tavsif **saytga chiqishidan oldin** nima bo'ladi?».

**D · So'z-tanlov, fakt-halolligi, ekran matni**
14. **s4 sarlavhasi:** «"AI o'zi qiladi" **tomonini** bosing va **o'ng tomonga** qarang» — «tomon» bir gapda ikki ma'noda (tugma tomoni / ekran tomoni) → «**tugmasini** bosing…» (1-bo'lim tavsifi va blok-3 HARAKATi ham). Mentor bir bo'lak qisqardi (ekran-o'lchovi uchun).
15. **s1 demosi:** «Narxni o'zi o'zgartirmaydi → **Narxni ko'rib qo'ygan** mijoz» (chigal) → «→ **Eski narxni ko'rgan** mijoz».
16. **s6 2-slaydi tekshirib bo'lmaydigan da'vo edi:** «Javobning **ostida** kichkina qator turadi. U **har javobdan keyin** o'sha yerda qoladi» — ko'p ilovada qator har javob ostida emas, **ekranning pastida** bir marta turadi; o'quvchi telefonini ochib qarasa, slayd yolg'on chiqardi. → «**Ekranning pastida** kichkina bitta qator turadi. U hech qachon yo'qolmaydi». Kaskad: arena-7, CodeStrike MAVZU, s7 RECAP, §21 izohi, GATE S 8-bandi.
17. **s6 ko'prigi:** bir abzatsda ikki «Buni…» bor edi va oxirgi gap darsning kanonik gapidan chetga chiqardi → endi yakun-ro'yxati bilan bir xil: «**Bu qarorni ilova emas, mahsulotni o'ylaydigan odam qiladi** — endi u sizniki».
18. **Checklist o'z tekshiruvchisiga zid edi:** yorliq «Har chegara **«qilmaydi»** bilan tugaydi», ekrandagi namuna esa «…javob **yozmaydi**» va tekshiruv «-maydi / -masin / -may» ni qidiradi — bola aynan «qilmaydi» so'zini yozishi kerakdek tushunardi. → «Har chegara **«…maydi»** bilan tugaydi» (s8 RO'YXATi, uy-vazifa RO'YXATi, 🤔-qatori); 🤔-qatoridagi bosh-harfli «QILMASLIGI» → qalin.
19. **s8 YULDUZCHASI** chigal qo'shma gap edi va «**To'rtinchi qatorni** yozing» deb artefaktda yo'q maydonni va'da qilardi → «Ilova o'zi qilaversa ham bo'ladigan bitta ishni toping. Nega unga chegara kerak emas — bir qatorda yozing» (quruvchiga savol quyida).
20. **Kodingdagi jim tuzoq:** `tegadi: ""` ning ma'nosi hech qayerda aytilmagan edi — bola bo'sh satrni «yozilmay qolgan» deb o'qishi mumkin. Starterga bitta izoh qo'shildi: hech kimga tegmaydigan ichki ish ekani; birinchi izohdagi «qiladimi, va» vergul-bog'lovchisi to'g'irlandi. Starter qo'shtirnoqda ✓ (korpus §135-D), kod-nomlari ASCII ✓.
21. **Uy-vazifa:** «Uyda **chegaralaringizni** davom ettirasiz» (chegarani davom ettirib bo'lmaydi) → «Uyda **ro'yxatingizni** davom ettirasiz».

**E · Ohang bo'yicha hukm (bu darsning bosh xavfi)**
Va'z, qo'rqitish va ayblash **yo'q**: AI yovuz deb aytilmaydi, birorta pul-yo'qotish, sud yoki sog'liq voqeasi kiritilmadi, darsning ikkinchi yarmi «hammasini taqiqlash» yo'lini o'zi yopadi (s4 2-bosqichi + T4). Uch jabr-misolining og'irligi o'smirga **mos** (zaryadlagich · yomg'irda ishlamagan quloqchin · kechgacha kutish) — kuchaytirish shart emas. Bitta qoqilish nuqtasi bor edi va tuzatildi: **«jabr»** — ayblov ohangi kuchli so'z; endi u ekranda **«kunini buzadi»** bilan birga tug'iladi, ya'ni bola uni zulm emas, **buzilgan kun** deb o'qiydi. Kalit `jabr` holicha qoldi (artefakt muhrlangan) — kalit ↔ ekran so'zi bir xil.

**F · Qayta o'lchandi:** ekran-prozalari s0 330 · s1 148 · s2 314 · s4 234 (+ 2-bosqich kartasi 103) · s6 341 · s8 107 · s9 157 · s10 147 grapheme (chegara 400 ✓) · variant-telllari T1 1.05 · T2 1.06 · T3 1.14 · T4 1.03 · darvoza 1.17 · bashorat 1.11 (chegara 1.4 ✓) · nishon tavsiflari 33–42 belgi ✓. `node til-lint.mjs pm-senariylar/M6-D6-Etika.md` → **0 error / 3 warn** (uchalasi ham senariy-annotatsiyasiga tegishli: «YADRO» blok-nomi ×2 va o'z-tekshiruvning «Sen murojaati — 0» qatori) · `node prompt-lint.mjs` → toza.

**G · QURUVCHIGA (matn emas, tuzilma — GATE S dan keyin)**
- **s4 ikki bosqichi bitta ekranda yig'ilib qolmasin:** 1-bosqich matni 234 grapheme; 2-bosqich kartasi (103) ochilganda mentor-gapi yopilsin, yakun-qatori esa 2-bosqich kartasining **o'rniga** chiqsin — aks holda ekran 400 dan oshadi.
- **s8 YULDUZCHASI qayerga yoziladi:** artefaktda 3 ta chegara maydoni bor, to'rtinchisi yo'q. Yulduzcha javobi artefaktga **saqlanmaydi** — ekranda ochiladigan qo'shimcha maydonmi yoki og'zakimi, quruvchi tanlasin.
- **s9 dan bot-oyna talabi olib tashlandi:** endi ekranda sanaladigan xabar-qatorlari chizilishi shart emas (7-band).

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-19)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m6-06`: title «Etika va mas'uliyat» · sub «AI-mahsulotda nima noto'g'ri ketishi mumkin». «Etika» va «mas'uliyat» — o'smir uchun mavhum kattalar-otlari (§103: qoida fe'l bilan yoziladi); sub esa savol emas, da'vo. **Taklif:** title → **«Ilova o'zi qaror qilsa, kimga tegadi?»** · sub → **«chegara — mahsulot qarori»**. Tasdiqlaysizmi?

2. 🔴 **BRIF-TUZATISHI (§40) — eng muhim savol.** Brifda «o'quvchining tizimi AI bilan javob qaytaradi» deyilgan edi; dars tartibi tekshirildi va bu hali rost emas: `m6-06` dan oldin faqat `m6-01`…`m6-05` o'tilgan, AI ni haqiqatda ulash `m6-08` da, o'z Skill'i `m6-07` da. Shuning uchun senariy bo'ylab **«quradigan mini-do'koningiz»** shakli olindi (pretsedent: `m5-02` — «quradigan botingiz»). Shu tuzatishni tasdiqlaysizmi — yoki dars m6-08 dan keyingi holatni nazarda tutsinmi?

3. 🔴 **BOSH ATAMA «CHEGARA» + `m6-04` KO'PRIGI.** Butun dars «chegara» oilasida yuradi (chegara qo'yasiz · qaror tegadi · odam jabr ko'radi); s2 xulosasining ikkinchi gapi uni `m6-04` ning «vakolat chegarasi» atamasi bilan bir gapda bog'laydi (§112). Sabab: ildizi bir xil ikki nom izohsiz qolsa, bola «ikkita nom bitta narsagami?» degan savolda qoladi. Rozimisiz — yoki ko'prik olib tashlanib, «chegara» mustaqil atama sifatida qolsinmi?

4. 🟡 **«JABR KO'RADI» FE'LI.** Muhrlangan artefakt kaliti `jabr` bo'lgani uchun ekrandagi fe'l ham «jabr ko'radi» qilib olindi (kalit ↔ matn bir so'z). Muqobil «zarar ko'radi» edi, lekin u M4-D7 ning lug'atidan va o'sha darsni eslatadi. Tasdiqlaysizmi — yoki ekranda «zarar ko'radi» bo'lib, kalit `jabr` holicha qolsinmi?

5. 🔴 **DEMO-OLAM = MINI-DO'KON, IKKI SAHNA.** s4 — do'kon ilovasining uch ishi (javob · tavsif · buyurtma), s9 — o'sha do'konning boti (to'rt qaror). Bitta olam, ikki sahna (91-qonun ichida — M4a-D2 pretsedenti). Bu M6 modul-ipining o'zi, ya'ni demo emas, o'quvchining loyihasi. OQLANADIMI?

6. 🔴 **s4 IKKI BOSQICHLI.** Pasportdagi imzo-vizual («qaror → kim jabr ko'radi») 1-bosqich sifatida aynan bajarildi; unga **2-bosqich** qo'shildi: «Do'kon egasining vaqti yetadi — uch ishdan BITTASINI olib qo'ying». Sabab: jabrni KO'RISH hali qaror emas, va 2-bosqichsiz dars «hammasini taqiqlaymiz» degan xulosaga tushib qoladi (qizil band 1 — va'z o'qimaslik). Qo'shimchani tasdiqlaysizmi?

7. 🔴 **OQIBAT-JUFTLASH ↔ MatchPairs (band mexanika).** Pasport «oqibat-juftlash» ni buyurgan, MatchPairs esa 🔴band (M7-D2, M8-D1). Farq-dalili: MatchPairs da **atama ↔ ta'rif** juftlanadi (nom-mosligi), bu yerda **qaror ↔ odam** juftlanadi va to'rtala odam-kartasi ham «mijoz» so'zi bilan tugaydi — ya'ni nom bilan topib bo'lmaydi, ikki belgini (payt + bot nimani kutyapti) solishtirish kerak. Bu chegara yetarlimi?

8. 🟡 **ZAXIRA ILGAK MAZMUNI (s6).** O'ylab topilgan kompaniya-voqea o'rniga o'quvchi **o'z telefonida** tekshiradigan holat olindi: ekranning pastidagi kichkina qator va u nima uchun turgani. Ekranda birorta raqam, foiz yoki sana yo'q. Sinfda telefon bo'lmasa ham ekran ishlaydi (slaydlar holatni o'zi tasvirlaydi, tekshirish — ixtiyoriy). Tasdiqlaysizmi?

9. 🟡 **UCH JABR-MISOLINING OG'IRLIGI (ohang darvozasi).** Uchala misol ham ataylab **oddiy va tuzatsa bo'ladigan**: qutida zaryadlagich yo'q · quloqchin yomg'irda ishlamadi · buyurtma bekor bo'ldi, mijoz kechgacha kutdi. Pul yo'qotish, sud, sog'liq va halokat YO'Q. Shu daraja to'g'rimi — yoki bittasi biroz kuchliroq bo'lsinmi?

10. 🟡 **ARTEFAKT SHAKLI (muhrlangan — faqat tasdiq).** `pm-m6d6-chegara = { chegaralar: [{ qaror, jabr } × 3], savedAt }`. Senariy uni o'zgartirmadi; muvozanat («hamma ishga chegara qo'ymang») to'rtinchi maydon sifatida EMAS, s4 ning 2-bosqichi, T4 va YULDUZCHA orqali o'rgatiladi. Shu taqsimot tasdiqlansinmi?

11. 🟡 **KODING RAQAM-TIZIMI.** Ikki ro'yxat (do'kon 4 ish · bot 3 ish), uch shart, hammasi xulq-atvorda va starter bilan **qizil** (18-ov). `tegadi: ""` bo'lgan ikki ish (`hisobotYigish`, `adminXabar`) — chegarani kerak qilmaydigan ichki ishlar; ular ekranda ko'rinmagan, lekin farqni mentor bir gapda aytadi. Tasdiqlaysizmi?

12. 🟢 **UY-VAZIFA O'QUVCHINING O'Z MAHSULOTIDA QOLADI** (to'rtinchi chegara) — demo-olamga ko'chirilmaydi, chunki artefakt `m6-12` ga o'tadi. Rozimisiz?

**Metodist raundi qo'shgan savollar (2026-08-19 · F-0819-01):**

13. 🔴 **T3 BUTUNLAY ALMASHDI.** Eski savol («AI tavsif yozdi. Tavsif saytga qanday chiqadi?» → «Do'kon egasi o'qib chiqqanidan keyin») s4 ning 2-bosqichiga zid edi: u yerda do'kon egasi uch ishdan faqat **bittasini** o'qiy oladi, ya'ni tavsifni o'qimaslik ham to'g'ri qaror — bola o'z qarori uchun «xato» olardi. Yangi savol: «AI mahsulot tavsifini yozdi. Chegara qaysi ikki qadam orasiga qo'yiladi?» (A ✅ «Yozilgandan keyin, saytga chiqishdan oldin»). Kalit indeksi A=0 o'z joyida. Shu almashuvni tasdiqlaysizmi — yoki savol s6 faktiga («ekran pastidagi qator nima uchun turadi») burilsinmi?

14. 🔴 **«JABR» ENDI EKRANDA TA'RIFLANADI** (4-band bilan bog'liq). Ilgari «jabr ko'radi» hech qayerda ochilmasdan besh yuzada ishlatilardi, legenda esa «⚪ — bu qaror unga **tegmaydi**» der edi va darsning «har qaror bitta odamga tegadi» qoidasiga zid tushardi. Yangi legenda atamani tug'diradi: **«🔴 — bu qaror shu odamning kunini buzadi: u jabr ko'radi · ⚪ — bu qaror uning kunini buzmaydi»**. Shu bilan «jabr» ayblov-so'zi emas, **buzilgan kun** bo'lib o'qiladi va artefakt kaliti `jabr` bilan bir xil qoladi. Tasdiqlaysizmi?

15. 🟡 **ARENA SAVOL-SHAKLI XILMA-XIL BO'LDI.** 12 savoldan oltitasi bir xil «…, kim jabr ko'radi?» qolipida edi va oltala javob ham «… mijoz» bilan tugardi. Endi: qolip uchtada (4 · 6 · 8), 9 va 10 **teskari yo'nalishda** («Kasal bo'lib yotib qolgan mijozga botning qaysi qarori tegdi?»), 5 esa oqibat so'raydi («Tavsif hech kim o'qimay saytga chiqsa, nima bo'ladi?»). Kalit-tartibi `0,3,2,1 · 1,0,2,3 · 0,2,1,3` o'zgarmadi. Rozimisiz?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–136) · MATN_ETALONI (lug'at + 7-C adabiy norma) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 5 pasporti · R3 protokoli) bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-19 · F-0819-01 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–15).*

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-19 (bosh-agent · foydalanuvchi avtokontrol-ruxsati asosida)

**Pretsedent bilan avto-yopilgan bandlar:** s4 ga ikki bosqichli qo'shimcha (B1–B4 da to'rt marta
tasdiqlangan naqsh) · demo-olam tanlovi va 96c grep-dalili · muhrlangan artefakt-shakllari
(o'zgartirilmadi) · keys «raqamsiz» siyosati va bosqich-hisoblagichi (M4-D7 · M4c-D6 · M5-D8) ·
bosh atamaning hodisadan keyin tug'ilishi (§104/§126) · ekran-so'zi ↔ JSON-kaliti ajratmasi
(m5-02 `kanal`↔«joy» pretsedenti) · uy-vazifaning o'quvchi mahsulotida qolishi · metodist-korrektura
bandlari (13-A bo'limi — hammasi qoida-asosli) · TEKSHIRUV mexanikasining band primitivlardan
farq-dalili · nishon/flashcard qarorlari.

**Foydalanuvchi hukmi (3 band, 2026-08-19):**
1. **Karta-sarlavhalari TASDIQLANDI** va `src/App.jsx` ga kiritildi (esbuild ✅):
   m6-02 «Bitta gapni uch kishi bir xil tushunadimi?» / «kod yozishdan oldin — bitta varaq, to'rt katak» ·
   m6-06 «Ilova o'zi qaror qilsa, kimga tegadi?» / «chegara — mahsulot qarori» ·
   m6-12 «Bugun qaysi ish boshlanadi?» / «uch ufq: hozir, uch oydan keyin, olti oydan keyin» ·
   m6-14 «Raqamingiz nimani isbotlaydi?» / «bitta raqam — bitta slayd».
2. **m6-06 ohang-darajasi TASDIQLANDI** — uch jabr-misoli yengil va tuzatsa bo'ladigan holicha qoladi
   (pul yo'qotish, sog'liq, sud yo'q). Kuchaytirilmaydi.
3. **m6-02 s9 O'ZGARDI:** uch varaqdan **bittasi butunlay to'g'ri** bo'ladi — o'quvchi «doim bittasi
   javobsiz» naqshini o'rganib qo'ymasin, har varaqni haqiqatan o'qishi kerak. Pretsedent: M4-D12
   «sxema-shart tekshiruvi» (3 shartdan 2 nuqson). 🔴 QURUVCHIGA majburiy band.

**Qurishga ruxsat berildi.**
