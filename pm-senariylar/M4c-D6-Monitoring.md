# M4c-D6 — Saytingiz hozir ochilyaptimi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/4c-Modull/PmLesson18.jsx` (hozirgi `-v16` chala avlod BUTUNLAY almashadi; yangi
> `lessonId: pm-m4c6-v1`). Fayl nomi va `App.jsx` ulanishi TEGILMAYDI.
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 Batch 3 — yo'lakchadan chiqilmadi.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4c — «CI/CD + Deploy» (oy 8.5–9.5) · modul g'oyasi: «Delivery tezligi = gipotezani tekshirish tezligi» |
| **Dars** | M4c-D6 (modulning 6-darsi, ikkinchi PM darsi) · `key: m4c-06` |
| **Mavzu** | Monitoring — sayt chiqqandan keyin uni kim va nima bilan o'lchab turadi; qaysi signal chin, qaysi quruq |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z saytiga uchta signal-qoidasini **yozadi**; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | 🔴 **YO'Q — ZAXIRA ILGAK** (`PM_Prompt_v8` 1-blok; registr 3/4-bo'lim: bank keysi yo'q, foydalanuvchi ruxsati bor). Naqsh — `M4-D7-Ishonch.md` s6 «HAQIQIY HOLAT» (33/56/100-qonun qolipi): o'quvchi **o'zi, hozir, o'z kompyuterida** tekshira oladigan holat — brauzer har so'rovni o'zi o'lchab turadi (F12 → Network: holat + vaqt). O'ylab topilgan kompaniya, raqam, voqea **YO'Q** |
| **ISHLATILGAN_KEYS** | **—** · M4c ichida band: m4c-02 → K13 (Telegram tezlik). Bu dars bank keysini ishlatmaydi |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | m4c-02 → «haftaga-sig'dirish darvozasi» (Batch 3, parallel) · m4b-02 → «bug-triaj saralash» · M4a-D2 → yuk-tartiblash (raund-saralash) · M4-D15 → qaror-sabab tanlovi · M4-D12 → sxema-shart tekshiruvi. **M4c-D6 = «SIGNAL-SARALASH» — har signalga YO'L tanlash** (📣 hozir xabar / 📒 jurnalga) — hammasidan farq qiladi (26/59-qonun; dalil 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «UCH QAVAT KESIMI» · «YUK-SINOVI» (odam-soni surmasi) · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash · xabardan ortiqcha qatorni olib tashlash · yuk-tartiblash · sxema-shart tekshiruvi · qaror-sabab tanlovi · pitch-oilasi ro'yxati · Batch 3 yo'lakchalari: «SIFAT-TAROZI»/bug-triaj (m4b-02) · «RELIZ-TASMASI»/haftaga-sig'dirish (m4c-02) |
| **Misol-ip (91/108 + 95 + 96c)** | 🌐 **O'quvchining O'Z Netlify-sayti** — M1 da `DeployLesson` orqali chiqargan `nomi.netlify.app`. 95-qonun: bu uning o'z ishi, o'zi chiqargan ✓ · 96c: ip o'quvchining ARTEFAKTIDA — pasport aynan shuni belgilagan; demo-panel saytning nomini `cc-site-url` kalitidan o'qiydi (DeployLesson yozadi), yo'q bo'lsa `mening-saytim.netlify.app` — o'sha darsning o'z namuna-nomi (jim zaxira, §69). 96c(e) to'qnashuv-grep: `netlify` src/ da bosh-misol sifatida faqat texnik `DeployLesson` (manba-dars) da; PmLesson3 (6 marta — Demo Day havolasi), PracticeLesson2/4 (deploy qadami), PmLesson17 (1 marta) — hech biri Netlify-saytni **misol-olam** qilib olmagan ✓. Band olamlar (lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · kutubxona · AvtoStoyanka · konsert-chipta · skuter-ijara · sinfdosh-poyga) — birortasi emas ✓ |
| **Kirish-artefakt** | `pm-m4c2-reliz` = `{ bolaklar: [ { hafta, ish } × 3 ], savedAt }` — m4c-02 chiqishi (bosh-agent muhri, ikki senariy bir shaklni oladi). O'qiladigan joy: **s8** — o'quvchi haftalarga bo'lib yozgan uch ishini bir qatorlik tasmada ko'radi va ko'prik-gap: «chiqqandan keyin ular ishlayaptimi — buni endi o'lchagich aytadi». 🔴 **Jim zaxira:** kalit yo'q bo'lsa tasma render bo'lmaydi, mentor-gapning umumiy shakli chiqadi (bir shakl, bir uzunlik — §69b); «topilmadi / saqlanmagan» matni **YO'Q** |
| **Chiqish-artefakt** | 🔴 `pm-m4c6-signal` = `{ signallar: [ { olchov: 'ochilish' \| 'vaqt' \| 'xato', chegara: son, sabab } × 3 ], savedAt }` · `olchov` tartibi qat'iy (ochilish → vaqt → xato) · `chegara` — o'quvchi yozgan son (birligi `olchov`dan kelib chiqadi: daqiqa · soniya · 100 kirishdan nechtasi) · `sabab` — bitta qator. Taklif: **m4c-07** (`FullProPipelineLesson`, «test+lint+deploy+monitoring») shu uch chegarani o'z monitoring-qadamida namuna-qiymat sifatida ko'rsatadi ⚠️ GATE S 5-savoli |
| **Yordamchi kalitlar** | `pm-m4c6-hook-choice` (faqat YOZILADI — 100c) · `pm-m4c6-kun` (s4 holati: kun ko'rildi + qaysi chegaralar bosildi) · `pm-m4c6-yol` (s9 to'rt yo'l) · `pm-m4c6-code` · `pm-m4c6-reflection` · `pm-m4c6-hw-target` · `ccProgress` · **o'qiladi:** `cc-site-url` (sayt nomi uchun) · `pm-m4c2-reliz` |
| **Koding** | ⌨️ **VS CODE** — R1 navbati (registr: m4c-02 kompilyator → **m4c-06 VS Code**). Senariy buni o'zgartirmaydi. Terminal: `node tekshir.js` — o'quvchi o'z saytini REAL o'lchaydi |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — B2 senariylari bilan bir xil yakun-tuzilma |

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«Monitoring», «uptime», «latency», «error rate», «alert», «dashboard», «metrika» ekranga CHIQMAYDI** (pasport taqig'i + korpus §20: markaziy atama chet so'z bo'lsa o'zbekcha ibora uning o'rnini oladi; «metrika» — M8-D1 ning atamasi, 29-qonun). Inglizcha juftlik faqat flashcard-10 javobida: «Saytni to'xtovsiz o'lchab turish (inglizchasi — monitoring)»;
- 🔴 **«o'lchagich» — darsning yagona bosh nomi.** Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob — o'lchagich»** (§109: zamon-iborasi «chiqqandan keyin», yasama ot emas). Shu ta'rif s2 · flashcard-1 · RECAPS · s15 da so'zma-so'z. So'z o'smirga jismonan tanish — harorat o'lchagich, tezlik o'lchagich; «-gich» = asbob;
- 🔴 **Uch o'lchagich hodisa-tilida, hamma yuzada bir xil yorliq:** 🟢 **«Sayt ochiladimi»** (uptime) · ⏱ **«Javob vaqti»** — bosganingizdan sahifa kelguncha necha soniya (latency) · ❌ **«Xatolar»** — 100 kirishdan nechtasi xato bilan tugadi (error rate). ❌ «ulush», «foiz» (lug'at: «ulush» izohsiz taqiq) — hamma joyda **«100 kirishdan nechtasi»**;
- 🔴 **«signal»** — s4 **yakun-kartasida** tug'iladi (hodisa avval — «xabar keldi», nom keyin). Kanonik ta'rif hamma yuzada so'zma-so'z: **«O'lchagich chegaradan o'tganda keladigan xabar — signal»** (s4 · flashcard-3 · RECAPS s5). O'smirga tanish (svetofor signali, telefon signali). ❌ «ogohlantirish» (kantselyarit), ❌ «alert»;
- 🔴 **«chegara»** — o'quvchi qo'yadigan son; u s4 yakun-kartasida tug'iladi («Siz qo'ygan son — chegara»), savol-kartada hali ishlatilmaydi. «Chegara» so'zi darsda faqat shu ma'noda (§105);
- 🔴 **«chin signal» ↔ «quruq signal»** — s4 yakunida ochiladi: **«Odam sezgan signal — chin; hech kim sezmagan signal — quruq»**. «Quruq» — «quruq gap», «quruq va'da»dan tanish; darsda boshqa ma'noda ishlatilmaydi (§121). ❌ «shovqin» (metafora — o'quvchi izoh talab qiladi, korpus §70), ❌ «yolg'on signal» (ataylab qilingandek eshitiladi), ❌ «haqiqiy signal» — «haqiqiy» s6 eyebrow'ining so'zi, bitta ildiz ikki ma'noda yashamaydi (§121);
- 🔴 **Ikki yo'l (s9) — hamma yuzada bir xil:** **«📣 Hozir xabar berish»** (chin signal uchun) / **«📒 Jurnalga yozish»** (quruq signal uchun — yo'qolmaydi, ertalab ko'riladi). «Jurnal» — 4c lug'atidagi «lenta jurnali» bilan bir oila (yozib qo'yiladigan ro'yxat);
- 🔴 **Fe'l-intizomi (korpus §80):** sayt **ochiladi / ochilmaydi**, javob **keladi** (necha soniyada), odam **kutadi / yopib ketadi / sezadi**, o'lchagich **o'lchaydi**, chegaradan **o'tadi**, signal **keladi**. ❌ «yiqiladi», «quladi», «tushib qoldi», «yotib qoldi», **«to'xtadi / to'xtab qoldi»** — sayt uchun bitta ibora: **«ochilmay qoldi»**. 🔴 **§121 ildiz-tozaligi (metodist-tuzatishi):** «to'xta-» o'zagi darsda FAQAT bitta ma'noda yashaydi — kanonik ta'rifdagi «**to'xtovsiz** o'lchab turadigan». Sayt haqida «to'xtadi» yozilsa, bola ikki ma'noni bitta so'z deb o'qiydi (s0 payoff · s2 kartasi · TEST-1 reveal'ida tuzatildi);
- 🔴 **4c modul-lug'ati (lenta)** — faqat s2 birinchi kartasida, bitta gapda: «Chiqarishgacha kodni lenta tekshiradi — yashil bo'lsa sayt uchadi». Bu boshqa dars metaforasi emas — 4c ning butun modulga yagona lug'ati (`CiCdIntroLesson` shapkasi); dars uni **davomi** sifatida oladi: lenta — chiqarishgacha, o'lchagich — chiqqandan keyin. Boshqa lenta-so'zlari (skaner, o'lcham ramkasi, chamadon) ekranga chiqmaydi;
- ❌ **«server», «hosting», «so'rov-javob sikli», «HTTP», «status kodi»** — o'quvchi matnida ishlatilmaydi; s6 da brauzer ekranida ko'rinadigan so'zlar bilan aytiladi: «holat» (200 · 404) va «vaqt (ms)». `Network` — brauzer panelining o'z nomi (ekranda inglizcha turadi — tarjima qilinmaydi, korpus §79);
- ❌ **«puls», «salomatlik», «tomir», «harorat»** — eski `-v16` faylning tibbiyot-metaforasi (4.1 TAQIQ + til-lint error). Butunlay olib tashlanadi;
- ❌ **«kuzatish»** yolg'iz fe'l sifatida (lug'at: mavhum) — «o'lchab turadi», «ko'rsatadi», «xabar beradi».

🔴 **§40 darvozasi:** o'quvchida Netlify sayti BOR (M1 `DeployLesson`) — dars bo'ylab **«saytingiz»**. Lekin havolasi qurilmada saqlanmagan bo'lishi mumkin: shuning uchun sayt-havolasi **hech qayerda so'ralmaydi** (92d), panel nomni `cc-site-url` dan o'qiydi, bo'lmasa `mening-saytim.netlify.app` — jim (§69). O'quvchiniki bo'lmagan narsa («panelingiz», «signallaringiz») s4 da «-ingiz» olmaydi: panel — darsniki, saqlangan uch qoida — o'quvchiniki (s8 dan keyin «qoidalaringiz»).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «O'LCHAGICH-PANELI»** (23-qonun: har darsda YANGI — registr 5-bo'limidagi birorta band vizual klonlanmaydi).

Ekran ikki qavat. **Tepada** — saytning uchta o'lchagichi, uchta katta karta ko'rinishida (sarlavha-qatorida sayt nomi: `🌐 mening-saytim.netlify.app` yoki `cc-site-url` dagi nom):

| O'lchagich | Nima ko'rsatadi | Oddiy paytdagi ko'rinishi |
|---|---|---|
| 🟢 Sayt ochiladimi | so'nggi kirishda sahifa keldimi | 🟢 «ochilyapti» |
| ⏱ Javob vaqti | bosgandan sahifa kelguncha necha soniya | 0,3–0,6 s orasida tebranadi |
| ❌ Xatolar | 100 kirishdan nechtasi xato bilan tugadi | 100 dan 0 |

**Pastda** — bir kunlik vaqt chizig'i `08:00 ─────────── 20:00` va bitta tugma **«▶ Kunni boshlash»**.

**1-bosqich — kunni ko'rish.** Tugma bosilgach kun ~40 soniyada o'tadi (`prefers-reduced-motion` da qadam-qadam «Keyingi soat» tugmasi bilan). O'lchagichlar jonli o'zgaradi; hodisa paytida chiziqda belgi qoladi va o'lchagich yonida **bitta fakt-qator** chiqadi (korpus §95: har raqamning manbasi ko'rinadi):

| Vaqt | O'lchagich | Fakt-qator |
|---|---|---|
| 09:30 | ⏱ 1,5 s (5 soniya turdi) | Hech kim sezmadi — sahifa odatdagidek ochildi |
| 11:10 | ⏱ 6 s (12 daqiqa turdi) | Kirgan odam: «uzoq kutdim, yopib ketdim» |
| 13:20 | ⏱ 1,2 s (bir zum) | Hech kim sezmadi |
| 14:05 | 🔴 15 daqiqa ochilmadi | Kirganlar sahifa o'rniga xato ko'rdi |
| 16:00 | ❌ 100 dan 1 tasi xato | Bir kishi bo'lmagan manzilni terdi — saytda hamma sahifa joyida |
| 18:40 | ❌ 100 dan 9 tasi xato | Bitta sahifa ochilmay qoldi — kirganlar xato ko'rdi |

**2-bosqich — chegara qo'yish** (kun tugagach ochiladi — 94-qonun progressiv ochilish). Ekranga bitta savol-karta chiqadi: *«Javob necha soniyadan uzoq kelsa, sizga xabar kelsin?»* — uch tugma: **1 s · 3 s · 10 s**. Tanlangach kun tez qayta o'tadi (~6 s), chiziqda 📣 belgilar yonadi va natija-qatori chiqadi.

🔴 **Atama-tartibi (metodist-tuzatishi · §104/§126):** savol-kartada ham, natija-qatorlarida ham «chegara» va «signal» so'zlari YO'Q — u yerda faqat hodisa tili. Ikkala atama ham quyidagi **yakun-kartasida**, ko'rilgan hodisadan keyin tug'iladi:

- **1 s** → «📣 Uch marta xabar keldi — ikkitasini hech kim sezmagan edi (09:30, 13:20).»
- **3 s** → «📣 Bir marta xabar keldi — aynan odam kutib yopib ketgan payt (11:10).»
- **10 s** → «📣 Xabar kelmadi — 6 soniyalik kutish o'tib ketdi; odam sizdan oldin sezgan edi.»

Uchala tugma ham bosilgach (o'quvchi solishtiradi — 88-qonun: bosilmaganlar navbat bilan yonadi) yakun-kartasi ochiladi (69-qonun — xulosa, maqtov emas):

> **Siz qo'ygan son — chegara.** O'lchagich chegaradan o'tganda keladigan xabar — **signal**. Odam sezgan signal — **chin**, hech kim sezmagan signal — **quruq**. Chegara odam seza boshlaydigan joyga qo'yiladi: pastroq bo'lsa quruq signal ko'payadi, balandroq bo'lsa odam sizdan oldin sezadi.

🔴 **Rang-qonuni (palitra-pasporti):** 🔴 «ochilmay qoldi» — **haqiqiy nosozlik holati** (M3-D10 pretsedenti), o'quvchi xatosi EMAS; 2-bosqichdagi «noqulay» chegara (1 s / 10 s) natijasiga qizil baho berilmaydi — neytral indigo, 3 s ga yashil `success`. Signal-belgisi 📣 — accent.

🔴 **Nima uchun aynan shu:** «monitoring»ni o'qib tushunib bo'lmaydi — o'lchagich raqamlarining **odam holatiga** ulanganini KO'RGANDA ma'noga kiradi. Bola kunni o'zi boshlaydi, qaysi sakrashni odam sezganini fakt-qatorlardan o'qiydi, keyin chegarani o'z qo'li bilan qo'yib, uchta chegara qanday signal berishini solishtiradi. Bu — darsning butun qarori («qaysi signal chin, chegarani qayerga qo'yaman») qo'lda o'ynaladigan shakli. Ustiga panel o'quvchining O'Z saytining nomi bilan chiqadi — «bu men haqimda» hissi.

🔴 **Mexanika-farqi (26/59-qonun):** M4a-D2 da o'quvchi **miqdorni surib sinish nuqtasini topardi** (yuk-sinovi: surma + qism-tanlovi); M4-D2 da **tugmani yoqib-o'chirardi**; M3-D10 da **soxta formani bosardi**. Bu yerda o'quvchi **kunni ko'radi va chegara qo'yib signallarni sanaydi** — boshqa obyekt (vaqt chizig'i + chegara), boshqa harakat (chegarani tanlab qayta o'tkazish), boshqa maqsad (chin/quruq farqi). Surma YO'Q — uch qat'iy tugma.

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 2-bosqichda 40–45 soniya harakatsizlikdan keyin bitta qoida-ipuchasi: «Boshqa sonni ham bosib, natijani solishtiring» — «chegara» so'zi bu bosqichda hali tug'ilmagan (§104); javobni AYTMAYDIGAN shakl (korpus §77).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi B2 senariylaridagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Netlify'dagi saytingiz hozir ochilyaptimi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch qoida-qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — chiqarishgacha ↔ chiqqandan keyin | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **O'LCHAGICH-PANELI** (kun + chegara) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | HAQIQIY HOLAT — brauzer o'zi o'lchaydi (4 slayd + 2 bashorat) | 3 | — | keys-slayd qolipi (zaxira ilgak) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 signal-qoidasi** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **SIGNAL-SARALASH** (har signalga yo'l) | 5 | — | 🔴 yangi mexanika |
| s10 | KODING — saytni o'lchaydigan kod (VS Code) | 6 | — | 26/82/87-qonun · VS Code + terminal |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona», «panel-mexanika», «keys» so'zlari o'quvchi ekranida YO'Q** (korpus §84) — senariy-ichi nomlar. «O'LCHAGICH-PANELI» imzo-nomi ham ekranga chiqmaydi — ekranda o'quvchi «saytingizning uch o'lchagichi»ni ko'radi.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 4c — CI/CD + Deploy
DARS: M4c-D6 (6-dars)
DARS_MAVZUSI: Monitoring — sayt chiqqandan keyin uni kim o'lchaydi; chin va quruq signal
ISHLATILGAN_KEYS: —
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Bir necha oy oldin saytingizni Netlify'ga chiqargansiz — havolasi
mening-saytim.netlify.app. Hozir, shu daqiqada, u ochilyaptimi?
(🔴 havola `cc-site-url` dan o'qiladi; kalit bo'lmasa shu namuna-nom turadi — jim zaxira, §69)
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: sayt ochilmay qolsa, sizga hozir hech
kim aytmaydi — birinchi bo'lib begona odam ko'radi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkalasi ham halol javob. Payoff «hech kim aytmaydi»
degan joyda to'xtang: aynan shu bo'shliqni bugungi dars to'ldiradi.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 🟢 Ochilyapti — o'zim vaqti-vaqti bilan kirib turaman | 52 |
| 🤷 Bilmayman — chiqarganimdan beri ochib ko'rmaganman | 52 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi. Lekin sayt hozir ochilmay qolsa — sizga hech kim aytmaydi: uni birinchi bo'lib begona odam ochib ko'radi. Chiqqandan keyin saytni kim tekshirishini bugun o'zingiz hal qilasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (Netlify, `mening-saytim.netlify.app` yoki o'quvchining o'z havolasi) + harakat-fe'l («ochilyaptimi») + o'quvchining o'z holatidan o'sadi (u saytni o'zi chiqargan). Ovoz chiqarib o'smir og'zidan: «saytim hozir ochilyaptimi?» — tabiiy.
> 🔴 **104-qonun + korpus §119:** to'g'ri javob YO'Q — payoff ikkala tanlovda bir xil va hech birini yolg'onga chiqarmaydi: «kirib turaman» degan bola ham, «ochmaganman» degan bola ham «sizga hech kim aytmaydi» gapida o'zini xato deb topmaydi (birinchisiga ham sayt ochilmay qolganini hech kim aytmaydi — u o'zi kirgandagina biladi). ❌ «To'g'ri sezdingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m4c6-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62/126-qonun:** «o'lchagich», «signal» atamalari bu ekranda YO'Q — s2/s4 da ochiladi.
> 🔴 **Spoyler-taqiq:** payoff «hech kim aytmaydi» deydi — QANDAY bilish mumkinligini aytmaydi; s2/s4 kashfiyoti butun qoladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **326 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida saytingiz uchun uchta qoida yozib olasiz: sayt bilan nima bo'lganda
sizga xabar kelishini o'zingiz belgilaysiz.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta qoida-qatori o'z-o'zidan yozilib
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
| Sayt ochilmay qolsa → xabar keladi |
| Sahifa uzoq kelsa → xabar keladi |
| Xato ko'payib ketsa → xabar keladi |

> 🔴 **39/62/126-qonun:** s1 da «o'lchagich», «signal», «chegara» so'zlari **0** — atamalar o'z ekranida ochiladi; demo faqat natijani NOMLAYDI (korpus §125: «Sahifa — ko'rsatadi» naqshi), RAQAM aytmaydi — chegara-raqamlari s4 kashfiyoti.
> 🔴 **Spoyler-taqiq:** demo-qatorlar s4 hodisalarini (1,5 s · 6 s · 15 daqiqa · 9/100) va s9 to'rtligini TAKRORLAMAYDI — ular so'z-shakl, raqamsiz.
> 🔴 **40-qonun / korpus §40:** «yozib olasiz» (artefakt) · «saytingiz» — o'quvchida sayt bor ✓ («qoidalaringiz» hali yo'q — u s8 dan keyin).
> 🔴 **42-qonun:** «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **124 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (o'lchagich-paneli) + 3 × Quiz
EKRAN: Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob — o'lchagich
deyiladi. Uchta o'lchagich bor: sayt ochiladimi · javob necha soniyada keladi ·
100 kirishdan nechtasi xato.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) kunni boshlab o'lchagichlarni
ko'radi, keyin javob vaqtiga uch chegarani navbatma-navbat qo'yib signallarni sanaydi;
(s6) brauzer holatini bashorat bilan ochadi.
JAVOB: s4 — odam sezgan chegara: 3 s (1 signal, chin); 1 s — 3 signal, ikkitasi quruq;
10 s — signal yo'q.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda 1 s ni bosib «signal ko'p — zo'r» deydi. Uchalasini
bosgach so'rang: 09:30 dagi signalni kim sezdi? Javob — hech kim. Chin/quruq shu yerda
tug'iladi, siz aytmang.
```

**s2 — TEORIYA-1: chiqarishgacha ↔ chiqqandan keyin** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Sayt chiqib ketgandan keyin uni kim tekshiradi?»**

Mentor (≤2 gap, 32b):
> Chiqarishgacha kodni lenta tekshirardi. Chiqqandan keyin sayt odamlar qo'lida — ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| ✈️ **Chiqarishgacha** | Kodni lenta tekshiradi — yashil bo'lsa sayt uchadi. Xato bo'lsa, u odamlarga yetmaydi |
| 🌐 **Chiqqandan keyin** | Sayt odamlar qo'lida. Uni endi hech kim tekshirmaydi — ochilmay qolsa, buni birinchi bo'lib kirgan odam ko'radi |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob — o'lchagich deyiladi.** Uchta o'lchagich bor: sayt ochiladimi · javob necha soniyada keladi · 100 kirishdan nechtasi xato.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin «… o'lchagich deyiladi». Sarlavhada yangi atama YO'Q ✓ (§126: bosh atama s1 da emas, s2 da tug'iladi).
> 🔴 **§104:** ta'rif-gap to'liq (hodisa → nom → nima ekani), kesik qurilma emas.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **4c lug'ati:** «lenta» faqat shu kartada, bitta gapda — modul-ipi davomi sifatida (0-bo'lim glossi). «Yashil» — lentaning o'z so'zi; s4 da 🟢 belgi «ochilyapti» ma'nosida — ikki ma'no bir ekranga tushmaydi (s2 da faqat lenta, s4 da faqat o'lchagich).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **341 grapheme** proza (karta matnlari — mashq-materiali) ✓.

**s4 — YADRO: O'LCHAGICH-PANELI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Kunni boshlang va o'lchagichlarni o'qing.»**

Mentor (1 gap — 92a/ETALON 32: «▶ Kunni boshlash» tugmasi ekranda ko'rinib turibdi, takror ko'rsatma olib tashlandi):
> Tepada saytingizning uch o'lchagichi, pastda bir kunlik vaqt chizig'i.

> 🔴 **98b:** mentor qaysi sakrashni odam sezishini AYTMAYDI — fakt-qatorlar hodisa paytida chiqadi, o'quvchi o'qiydi.
> 🔴 **106d/71:** har hodisada javob darhol: belgi (📍 chiziqda) **va** bitta fakt-qator — o'quvchi «buni odam sezdimi?» savoliga javobni o'qiydi, taxmin qilmaydi. Fakt-qator odam holatini aytadi («uzoq kutdim, yopib ketdim») — QOIDA («odam sezgan — chin») ekranda yakun-kartagacha yozilmaydi (§106).
> 🔴 **72-qonun:** «▶ Kunni boshlash» — yorliqli, diqqat-signali bilan; bosilgach signal tinadi. 2-bosqich uch tugmasi — to'lqin (88a1: bittasi tanlanadi, teng emas).
> 🔴 **§95:** chegara-natijalarida vaqtlar (09:30 · 13:20 · 11:10) fakt-qatorlar bilan AYNAN bir xil — raqam manbasi ekranda ko'rinib turadi.
> 🔴 **§104/§105/§126 (atama-tartibi tuzatildi):** «chegara» ham, «signal» ham 2-bosqich savol-kartasi va natija-qatorlarida YO'Q — u yerda faqat hodisa tili («necha soniyadan uzoq kelsa» · «Uch marta xabar keldi»). Ikkala atama **yakun-kartasida**, ko'rilgan hodisadan keyin tug'iladi; 1-bosqichda 📍 belgi «hodisa» deb ham atalmaydi — faqat vaqt.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + yakun-karta = **385 grapheme** ✓ (fakt-qatorlar va natija-qatorlar — mashq-materiali). 🔴 Chegaraga yaqin: yakun-kartaga bitta gap ham qo'shilmaydi — qo'shilsa, ekran 400 dan oshadi.

**s6 — HAQIQIY HOLAT:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Saytingizga uchta qoida yozing.
(mentor, 1 gap · artefakt bor) Haftalarga bo'lib yozgan uch ishingiz endi saytda — ular
ishlayaptimi, buni o'lchagich aytadi.
(mentor, 1 gap · artefakt yo'q) Saytingiz chiqdi va endi odamlar qo'lida — u yaxshi
ishlayaptimi, buni o'lchagich aytadi.
HARAKAT: Uchta qoidani BITTALAB yozadi — har o'lchagichga bittadan (tartib qat'iy:
ochiladimi → javob vaqti → xatolar). Har kartada: chegara-sonini yozadi, sababini yozadi.
Saqlaganda qator o'ngdagi ro'yxatga ko'chadi.
JAVOB: Uchala qoida yozilgan · har chegara son · har sababda odam holati bor
(sezadi/kutadi/yopib ketadi/ko'radi) · «muhim», «kerak», «xavfli» kabi bo'sh so'zlar
sabab emas.
RO'YXAT: Uchta qoida yozilgan · Har chegarada son bor · Har sabab odam sezganini aytadi
YULDUZCHA: Uch chegarangizdan bittasini ikki barobar pasaytirib ko'ring: endi qanday
signallar ko'payadi? Javobingizni bir qatorda yozing.
YORDAM: O'zingizga bitta savol bering: bu raqamda saytga kirgan odam nimani sezadi?
Javob sababingiz bo'ladi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «0 soniya», «1 ta xato ham bo'lmasin» kabi juda past chegaralar chiqadi —
eng foydali xato. Javob-qatori uni tutadi; siz s4 dagi 1 s natijasini eslating: quruq
signallar.
```

🔴 **Kirish-artefakt tarmog'i (korpus §69 — ikki tarmoq bir shaklda, bir uzunlikda; mentor pufagi AYNAN shu bitta gap — ETALON 32):**
- **Artefakt BOR (`pm-m4c2-reliz`):** sarlavha ostida bir qatorlik tasma — «✈️ 1-hafta: … · 2-hafta: … · 3-hafta: …» (`bolaklar[].hafta` + `ish`, uzuni qisqartirilib) + mentor: «Haftalarga bo'lib yozgan uch ishingiz endi saytda — ular ishlayaptimi, buni o'lchagich aytadi.» *(93)*
- **Artefakt YO'Q:** tasma render bo'lmaydi; mentor: «Saytingiz chiqdi va endi odamlar qo'lida — u yaxshi ishlayaptimi, buni o'lchagich aytadi.» *(89)*
- 🔴 «topilmadi / saqlanmagan / bo'sh» so'zlari **0** · yo'qlik haqida gap YO'Q — jim zaxira (pasport talabi).
- 🔴 **Tasma — 92b:** yig'ilgan bir qator (bo'lak nomlari), to'liq matn EMAS; u ko'prik, ish-materiali emas — o'quvchi unga hech narsa yozmaydi.
- 🔴 **Ikki tomonlama shart (F-0803-22-B):** kalit va shakl bosh-agent muhridan (`{ bolaklar: [{hafta, ish}×3], savedAt }`); m4c-02 senariysi shu shaklni yozadi. Kod-nom `bolaklar` — ASCII, apostrofsiz (lug'at `tolov` pretsedenti) ⚠️ GATE S 6-savoli.

🔴 **Yozish-kartasi (80b) — bitta karta, uch o'lchagich uchun uch marta:**

| Qadam | Kartada nima turadi | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|---|
| O'lchagich (o'zgarmas yorliq) | 🟢 Sayt ochiladimi · ⏱ Javob vaqti · ❌ Xatolar | — |
| Chegara (qisqa son-maydon) | «necha daqiqa ochilmasa» · «necha soniyadan uzoq kelsa» · «100 kirishdan nechtasi xato bo'lsa» | `Necha daqiqa?` · `Necha soniya?` · `100 dan nechta?` |
| Sabab (matn) | — | `Nega aynan shu son?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ chegara son + sababda odam holati → «✅ Sababingiz odam nimani sezishini aytyapti.»
- 🤔 chegara maydonida son yo'q → «Chegara — son. Necha daqiqa / soniya / nechta xato — shuni yozing.»
- 🤔 sabab bo'sh sifat (*muhim · kerak · yaxshi · xavfli · zarur*) → «Bu hali sabab emas. Bu sonda saytga kirgan odam nimani sezadi? Shuni yozing.»
- 🤔 chegara juda past (javob vaqti < 1 s yoki xato = 0) → «Bu chegarada har mayda sakrash signal beradi — odam buni sezadimi? Sonni yoki sababni qayta ko'ring.» (bloklamaydi — yo'naltiradi; o'quvchi sababi bilan qoldirsa saqlanadi)
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Sabab-belgilar lug'ati** (qoida-asosidagi tekshiruv — 106d(c), dars o'z so'zlaridan): odam-holati belgilari: *odam · kirgan · sezadi · kutadi · yopib ketadi · ko'radi · xato ko'radi*; bo'sh so'zlar: *muhim · kerak · yaxshi · xavfli · zarur*. Checklist yorlig'ida o'quvchi ko'radigan matn — **«Har sabab odam sezganini aytadi»** (§130 metodist-tuzatishi: mezon AYNAN so'zni emas, MA'NOni so'raydi — bola «odam» so'zini ko'chirish shart deb o'qimasin. Ichki-jargon «odam-belgisi» ham ekranga chiqmaydi). Yordam chipida ikki savol turadi: «Bu sonda saytga kirgan odam nimani sezadi?» · «U kutadimi, yopib ketadimi, xato ko'radimi?»

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **125 grapheme** (artefakt bor) / **120** (artefakt yo'q) ✓ — javob-qatorlar harakatdan keyin, bittadan chiqadi.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (signal-saralash — har signalga yo'l)
EKRAN: (topshiriq) Har signalga yo'l tanlang.
(yo'riqnoma) Tunda va ertalab paneldan to'rt signal keldi. Odam sezgan signal sizni
hozir uyg'otsin, hech kim sezmagani jurnalda kutsin.
HARAKAT: To'rt signal-xabarni BITTALAB o'tadi; har biriga ikki yo'ldan birini bosadi:
«📣 Hozir xabar berish» yoki «📒 Jurnalga yozish». Har tanlovdan keyin javob va bir
qatorlik sabab ochiladi; oxirida to'rttasi xulosa-tasmada.
JAVOB: 1) ⏱ 1,3 s bir zum → 📒 · 2) 🔴 20 daqiqa ochilmayapti → 📣 · 3) ❌ 100 dan
8 tasi xato → 📣 · 4) ❌ 100 dan 1 tasi xato (bir kishi noto'g'ri manzil terdi) → 📒.
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Ikki savol bering: buni saytga kirgan odam sezadimi?
Saytda biror sahifa ochilmay qoldimi?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda: har o'quvchi sherigining uch qoidasini o'qib, har chegaraga «shu sonda
odam nimani sezadi?» deb so'raydi. Javob topilmasa — chegara qayta yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — 4-signal: «xato-ku, demak hozir». Ikkinchi
savolni eslating: saytda biror narsa ochilmay qoldimi? Yo'q — bir kishi manzilni
noto'g'ri terdi.
```

**To'rt signal (yangi sahna: keyingi kun ertalabi, panel tungi signallarni yubordi — s4 hodisalaridan BOSHQA to'plam):**

| # | Signal-xabar (panel shaklida) | To'g'ri yo'l | Javob ochilgandagi sabab-qatori |
|---|---|---|---|
| 1 | ⏱ 02:15 — Javob 1,3 soniyaga chiqdi, 4 soniyadan keyin 0,4 ga qaytdi | 📒 Jurnalga | Hech kim sezmadi — ertalab ko'rasiz |
| 2 | 🔴 06:40 — Sayt 20 daqiqadan beri ochilmayapti | 📣 Hozir | Kirgan har bir odam buni ko'ryapti |
| 3 | ❌ 07:05 — 100 kirishdan 8 tasi xato: «Aloqa» sahifasi ochilmayapti | 📣 Hozir | Bitta sahifa ishlamayapti — kirganlar xato ko'radi |
| 4 | ❌ 07:40 — 100 kirishdan 1 tasi xato: bir kishi bo'lmagan manzilni terdi | 📒 Jurnalga | Saytda hamma sahifa joyida — bu odamning o'z xatosi |

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch qoidangiz tayyor — endi shu qoidani tunda kelgan yangi to'rt signalda qo'llaymiz.

Yakun-qatori (xulosa-tasma ostida):
> ✅ **Odam sezgan signal hozir uyg'otadi; hech kim sezmagan signal jurnalga yoziladi — u yo'qolmaydi, keyin o'qiysiz.**

> 🔴 **26/59-qonun — farq-dalili (pasport talabi):** «tekshiruvchi stoli» (M3-D2) tayyor kartaga **✓/✕ hukm** beradi; M4-D7 xabardan **qatorni olib tashlaydi**; M4-D2 jadval-qatorini **belgilaydi**; M4a-D2 **tartib quradi**; M4-D15 qaror↔sabab **juftlaydi**. Signal-saralashda esa hech narsa baholanmaydi, o'chirilmaydi, tartiblanmaydi, juftlanmaydi — har signalga **HARAKAT-YO'LI** tanlanadi (hozir xabar / jurnalga), ikkala yo'l ham saqlanadi. Boshqa obyekt (kelgan xabar), boshqa harakat (yo'naltirish), boshqa maqsad (kim qachon bilsin).
> 🔴 **§120 (material har shart uchun bitta javobni himoyalaydi):** har xabarda uchala narsa bor — o'lchagich · son · davomiylik/sabab; 4-signalda «bir kishi bo'lmagan manzilni terdi» ochiq yozilgan (s4 16:00 pretsedenti — bola bu holatni bir marta ko'rgan), shuning uchun «xato = hozir» degan yon-mantiq materialdan yiqiladi.
> 🔴 **§107:** yo'llar teng — 2 ta 📣, 2 ta 📒; tartib naqshsiz (📒 📣 📣 📒).
> 🔴 **§116:** YORDAM ikki o'lchovni qamraydi (odam sezadimi? sahifa ochilmay qoldimi?) — 1/2/3/4 ning har biriga to'g'ri yo'lni beradi (4-signalda birinchi savol «ha»ga o'xshab tursa, ikkinchisi «yo'q» — jurnalga).
> 🔴 **106d + korpus §77/§98:** noto'g'ri yo'lda javob DOIM ochiladi: «🤔 Bu signalni hech kim sezmagan — u jurnalga yoziladi» / «🤔 Buni kirgan odam hozir ko'ryapti — hozir xabar»; YORDAM faqat birinchi xatodan keyin.
> 🔴 **61-qonun:** tugmalar baho EMAS (✓/✕ emas) — ikki harakat oti (MATN 6: «berish / yozish»).
> 🔴 **SOFT aynan shu blokda** · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **149 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (VS Code + terminal — R1 navbati)
EKRAN: (sarlavha) Saytingizni o'lchaydigan kod yozamiz.
(mentor, 2 gap) Network'da o'zingiz ko'rgan ikki raqamni endi kod o'lchaydi. Sizga
faqat uchta if qoladi.
HARAKAT: VS Code'da tekshir.js faylini ochadi, MANZIL ga o'z saytini yozadi (bo'lmasa
qoldiradi), uchta if ni yozadi, terminalda `node tekshir.js` bilan ishga tushiradi.
JAVOB: Terminalda holat va vaqt chiqadi; uch holatning har biriga o'z qatori:
'📣 signal: xato …' · '📣 signal: sekin javob' · '✅ Sayt ishlab turibdi'.
RO'YXAT: node tekshir.js holat va vaqtni chiqaradi · Uch if uch xil qator chiqaradi ·
O'z saytingiz uchun natija chiqdi
YULDUZCHA: for bilan 3 marta ketma-ket o'lchang va eng uzun vaqtni alohida chiqaring —
o'lchagich bir marta emas, qayta-qayta o'lchaydi.
YORDAM: Bitta if dan boshlang: javob.status 200 emasmi? Ishlagach vaqt > 3000 ni
qo'shing.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Internet bo'lmasa fetch javob olmaydi — bu ham o'lchagich natijasi («sayt
ochilmadi»), shuni ochiq ayting. Sayt-havolasi yo'q bolalar MANZIL ni o'zgartirmaydi.
```

> 🔴 **87-qonun (o'tilgan texnik material):** `fetch` (M3 `ReactApiGet`), `async/await` (M4 Express `async (req, res)` + `await pool.query`), holat raqamlari 200/404 (M4 `ApiPostman`), `if`, `for`, `console.log`, `node fayl.js` (M4) — hammasi o'tilgan. `Date.now()` — o'tilmagan: u topshiriqqa KIRMAYDI, boshlang'ich kodda TAYYOR turadi va bir qatorli izoh bilan ochilgan (M8-D1 «💡 Yordam — bu so'zlar nima?» pretsedenti) ⚠️ GATE S 8-savoli.
> 🔴 **26-qonun / R1:** m4c-02 kompilyator → **m4c-06 VS Code** — registr navbati, senariy o'zgartirmaydi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»); istisno — MANZIL qatori uchun havola paste bir qatorli (F-0729-07).
> 🔴 **87c (halol ulanish):** PM atamasi (signal) kodda `if` shartiga aylanadi — bu halol: signal aynan chegara-sharti; «o'lchagich» = shu funksiyaning o'zi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **126 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch chegarangizni yoddan ayta olasizmi?
(mentor) Ekranga qaramay javob bering: javob vaqtiga qanday chegara qo'ydingiz va o'sha
sonda odam nimani sezadi? Avval sherigingizga ayting, keyin bir qatorda yozing.
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
MENTORGA: Uchdan biri «odam nimani sezadi» savoliga javob berolmasa — s4 ekranini
qayta oching va 11:10 hodisasini birga ko'ring.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni sinab ko'ring.»** (bu darsda «sin-» ildizi boshqa ma'noda ishlatilmaydi — istisno kerak emas).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, keyin bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.
> 🔴 **106f(b):** yozib bo'lgach mukofot: «Endi siz saytni chiqarib qo'yib ketmaysiz — chiqqandan keyin ham o'lchab turasiz» + qoida-qatori «🎯 Bugungi qoida: chegara odam seza boshlaydigan joyga qo'yiladi».

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda o'lchagich ishini o'zingiz bajarasiz: saytingizni brauzerda ochib,
Network'dagi holat va vaqtni yozib olasiz, keyin ularni chegarangiz bilan
solishtirasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: F12 → Network → saytni uch marta yuklaydi, uch vaqtni va holatni yozadi;
har birini o'z chegarasi bilan solishtirib «signal / signal emas» deb belgilaydi.
JAVOB: —
RO'YXAT: Uch o'lchov yozilgan (holat + vaqt) · Har biri chegara bilan solishtirilgan ·
Signal chiqqan bo'lsa sababi bir gapda
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Saytingizni bir marta oching, Network'dagi holat va vaqtni yozib oling
va u chegarangizdan o'tgan-o'tmaganini bir gapda yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Sayt-havolasi yo'q bolalar istalgan saytda o'lchaydi — qoida o'sha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «uch marta», «uch o'lchov» faqat To'liq-kartada.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — Network ochish s6 da, chegara bilan solishtirish s4/s8 da bajarilgan.
> 🔴 **92d:** sayt-havolasi bo'lmagan o'quvchi «istalgan sayt»da bajaradi — vazifa devor bo'lmaydi (uy-vazifa kartasida bitta qator: «Saytingiz bo'lmasa — istalgan saytda»).
> 🔴 **Korpus §125:** kuzatiladigan hodisa aytiladi («chegarangizdan o'tganini»), mavhum «e'tibor bering» emas.

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
MAVZU: O'lchagich nima va qachon ishlaydi (chiqqandan keyin); uch o'lchagich (ochiladimi ·
javob vaqti · 100 kirishdan nechtasi xato); signal va chegara; chin/quruq signal — odam
sezdimi; chegara juda past/baland bo'lsa nima bo'ladi; hozir xabar / jurnalga yo'llari;
brauzer Network'dagi holat va vaqt (200 · 404 · ms); chiqqandan keyin o'lchashni kim hal
qiladi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'z ≤1) · §118 (cheklov-so'zsiz) · §127 (atama ≥2 variantda yoki hech birida) · §129 (kalit xulosadan so'zma-so'z emas — savol odam harakatiga o'girilgan). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🌙 Kechasi sayt 20 daqiqa ochilmadi, ertalab yana ishlayapti. O'lchagichsiz buni kim bildi?
- A. Dasturchi — ertalab saytni ochib ko'rdi *(39)*
- **B.** O'sha 20 daqiqada saytga kirgan odamlar ✅ *(39)*
- C. Lenta — u kodni chiqarishdan oldin tekshirdi *(44)*

**Reveal:** To'g'ri — o'lchagich bo'lmasa, sayt ochilmay qolganini birinchi bo'lib kirgan odam ko'radi, dasturchi emas.

> 🔴 **§129:** s2 xulosasi ta'rifni aytadi, hook payoffi «begona odam ko'radi» deydi — savol esa VAZIYATNI beradi (kechasi 20 daqiqa, ertalab ishlayapti) va bola qoidani QO'LLAYDI: dasturchi ertalab ochsa — hammasi joyida, u bilmaydi. Kalit so'zma-so'z ko'chirma emas.
> 🔴 **§102:** C — s2 birinchi kartasi ochiq rad etadi (lenta chiqarishgacha) — darsni o'qiganni mukofotlaydi; A — kundalik tasavvur («dasturchi baribir biladi»), s2 ikkinchi kartasi rad etadi. Uzunlik: 39 · 39 · 44 (to'g'ri javob eng uzun emas, narvon yo'q) ✓. Savol 12 so'z, predmeti nomlangan ✓.
> 🔴 **§127:** «o'lchagich» faqat savolda; variantlarda atama yo'q — kalit-so'z bilan topib bo'lmaydi ✓.

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** ⏱ Besh daqiqa davomida sahifa 8 soniyada ochildi. Kirgan odam nima qildi?
- **A.** Kutdi, keyin sahifani yopib ketdi ✅ *(33)*
- B. Odatdagidek sahifani ochib o'qidi *(33)*
- C. Xato yozuvini ko'rib qayta yukladi *(33)*

**Reveal:** To'g'ri — 3 soniyadan uzoq kutish odamga seziladi: bu chin signal.

> 🔴 **§106/§129:** s4 da odam 6 s da «uzoq kutdim, yopib ketdim» dedi; test YANGI son (8 s, 5 daqiqa) beradi va odam HARAKATINI so'raydi — qoida (chin/quruq) reveal'da muhrlanadi, savolda emas.
> 🔴 **§102:** B — s4 09:30/13:20 holatining fe'li («odatdagidek ochildi») — lekin u 1,5 s uchun rost, 8 s uchun emas; darsni ko'rgan bola farqlaydi. C — 8 s kutish xato yozuvi bermaydi (s4 da xato faqat ❌ o'lchagichda); ishonarli, lekin yolg'on. Uzunlik: 33 · 33 · 33 (tell 1.00 ✓).
> 🔴 **§99:** uchalasi ham «odam nima qildi?» savoliga fe'l-gap bilan javob beradi.

### TEST-3 (s7 — s6 dan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🖥 Bir qator 200 · 420 ms, ikkinchisi 404 · 35 ms. Qaysi birida xato bor?
- A. 200 li qatorda — u sekinroq keldi *(33)*
- B. Ikkalasida ham — vaqtlari har xil *(33)*
- **C.** 404 li qatorda — sahifa topilmadi ✅ *(33)*

**Reveal:** To'g'ri — xatoni holat raqami aytadi, vaqt emas: 404 — so'ralgan sahifa yo'q.

> 🔴 **§106:** s6 bashorat-2 «yo'q sahifani so'rasangiz holat nima?» deb so'raydi; test esa IKKI qatorni beradi va bola «xato = holat, sekinlik = vaqt» farqini QO'LLAYDI (420 ms — sekin emas, xato ham emas). Kalit ko'chirma emas.
> 🔴 **§102:** A — «sekin = xato» degan kundalik tasavvur, s4 rad etadi (javob vaqti va xatolar — ikki alohida o'lchagich); B — «ikkalasi ham» mutlaq-ohangli, §110 bo'yicha bitta variantda ✓. Uzunlik: 33 · 33 · 33 ✓.
> 🔴 **§127:** raqam-atamalar 200 va 404 ikkala tomonda (A da 200, C da 404) — kalit-so'z telli yo'q. **§21:** «ms» s6 da ochilgan («vaqt (ms) — millisekund, soniyaning mingdan biri»).

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** ⏱ Javob vaqtiga 0,5 soniya chegara qo'ydingiz. Kun bo'yi kelgan xabarlar qanday bo'ladi?
- A. Kam va aniq — har biri odam sezgan payt *(39)*
- **B.** Ko'p — ko'pini hech kim sezmaydi ✅ *(33)*
- C. Umuman kelmaydi — chegara juda baland *(37)*

**Reveal:** To'g'ri — chegara odam sezadigan joydan pastda: hech kim sezmagan sakrashlar ham signal beradi. Bunday signal — quruq.

> 🔴 **§129:** s4 yakun-kartasi «pastroq bo'lsa quruq signal ko'payadi» deydi; test YANGI son (0,5 s — s4 da yo'q; oddiy tebranish 0,3–0,6 s) beradi va KELGAN XABARLARNI so'raydi — bola qoidani qo'llaydi, xulosani ko'chirmaydi.
> 🔴 **§127 (metodist-tuzatishi):** avvalgi shaklda «quruq» yagona to'g'ri variantda turgan edi — mazmunni bilmagan bola ham atamani kalit-so'z sifatida tanib olardi. Endi darsning birorta atamasi to'g'ri variantda yo'q; «chegara» faqat distraktorda (C) — kalit-so'z to'g'ri javobga olib bormaydi ✓.
> 🔴 **§118 (cheklov-so'zi olib tashlandi):** avvalgi A «**Faqat** odam kutgan paytda xabar beradi» — distraktorni yolg'on qilib turgan narsa «faqat» so'zi edi. Yangi A cheklov-so'zisiz ham yolg'on: 0,5 s da xabarlar kam ham, aniq ham bo'lmaydi.
> 🔴 **§102:** A — s4 dagi 3 s natijasining tavsifi (o'sha son uchun rost, 0,5 s uchun emas); C — 10 s natijasi. Ikkalasi ham darsni O'QIGANNI mukofotlaydi. Uzunlik: 39 · 33 · 37 (tell 1.18 ✓, to'g'ri javob eng uzun EMAS ✓).

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — har biri o'z o'lchagich-belgisi bilan (🟢 · ⏱ · ❌): yozilgani yashil ✓, joriysi indigo miltillashda, kelgusi kulrang-punktir. Bu indikator o'quvchiga qaysi o'lchagichga qoida yozayotganini aytadi — alohida yorliq kerak emas.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: o'lchagich-yorlig'i (o'zgarmas, katta) → chegara son-maydoni (birligi yonida: «daqiqa» / «soniya» / «100 kirishdan») → sabab maydoni + jonli javob-qatori. Uch o'lchagich uchun bir xil karta — bir shakl, uch marta.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `⏱ Javob vaqti → 3 soniyadan uzoq kelsa — odam kutib yopib ketadi` (strelkali juftlik + sabab, s1 demo bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32 · §115 bir tilda):** `«Necha daqiqa?»` · `«Necha soniya?»` · `«100 dan nechta?»` · `«Nega aynan shu son?»` — hammasi qisqa savol; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q. s4 dagi 3 s ham placeholder'da yozilmaydi — o'quvchi o'zi qaror qiladi (10 s yozsa ham, sababi odam haqida bo'lsa saqlanadi).

**106d javob (ikki tomonlama):** ✅ «Sababingiz odam nimani sezishini aytyapti.» · 🤔 «Bu hali sabab emas. Bu sonda saytga kirgan odam nimani sezadi? Shuni yozing.»

**Bo'sh-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *muhim · kerak · yaxshi · xavfli · zarur*. O'quvchi sababga faqat shularni yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**Past-chegara sharti (yumshoq):** javob vaqti < 1 s yoki xato = 0 → hint «har mayda sakrash signal beradi — odam sezadimi?». Bu darsning ikkinchi yarmi: hamma narsaga signal qo'yish ham yechim emas (quruq signallar).

**Kirish-tasma (`pm-m4c2-reliz`):** sarlavha ostida ixcham bir qator, ish-maydoni EMAS; artefakt yo'q bo'lsa — qator yo'q, oradagi joy yopiladi (bo'shliq qolmaydi).

---

## 6. HAQIQIY HOLAT SPETSIFIKATSIYASI (s6 — ZAXIRA ILGAK · 33/56/100-qonun qolipi)

🔴 **Nima uchun keys emas:** bankda monitoring haqida keys yo'q (registr 3-bo'lim: m4c-06 — «YO'Q»); foydalanuvchi zaxira ilgakka ruxsat bergan (registr 4-bo'lim 2-band). Ekran keys-slayd QOLIPINI (freym → slaydlar → bashorat → ko'prik-gap) saqlaydi, mazmuni bank keysi emas — **o'quvchi o'z kompyuterida hozir tekshirib ko'ra oladigan holat**.

🔴 **O'ylab topilgan voqea, kompaniya va raqam YO'Q** (`PM_Prompt_v8` zaxira-ilgak sharti). To'rttala slayd ham o'quvchi ekranida shu daqiqada tasdiqlanadi.

**Freym (91b):** eyebrow — **«🖥 Haqiqiy holat»**. K-kodi ham, kompaniya nomi ham ekranga chiqmaydi.

**Bosqich-hisoblagichi (17-ov b · uzluksiz):** eyebrow har bosqichda bitta hisoblagich bilan turadi — «🖥 Haqiqiy holat · 1/7» … «7/7». Bosqichlar: slayd-1 · bashorat-1 · slayd-2 · bashorat-2 · slayd-3 · slayd-4 · ko'prik-gap. Bashorat javobidan keyin hisoblagich yo'qolmaydi, uzuq raqam qolmaydi (naqsh: `PmLesson9.jsx` s6).

**4 slayd (hikoya tilida — 42-qonun · ovoz chiqarib o'qib tekshirildi):**

1. **Kompyuteringizda saytingizni oching** (bo'lmasa — istalgan saytni). **F12** ni bosing — tanish **DevTools** paneli ochiladi. Undagi **Network** bo'limini tanlang.
2. *(bashorat-1 dan keyin)* **Sahifani qayta yuklang (F5).** Panelda qatorlar paydo bo'ladi — har qator bitta so'rov. Qatorlarda ikkita ustunni toping: **Status** — holat (200) va **Time** — vaqt (**ms** — millisekund, soniyaning mingdan biri). Bu vaqtni brauzeringiz o'zi o'lchab yozgan.
3. *(bashorat-2 dan keyin)* **Endi manzil oxiriga bo'lmagan sahifa nomini yozing:** `mening-saytim.netlify.app/yoq`. Yangi qatorda Status ustunida **404** turadi — brauzer xatoni ham o'zi yozib qo'yadi.
4. **Demak brauzer har kirishda uchala narsani o'zi o'lchaydi:** sahifa keldimi · necha ms da keldi · qaysi holat bilan. Lekin bu raqamlar faqat sizning ekraningizda va faqat siz qaraganda turadi. O'lchagich xuddi shu ishni sizsiz, har daqiqa qiladi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: MANBA — vaqtni kim o'lchaydi):**
**Savol:** «Sahifa necha soniyada kelganini kim o'lchab yozib qo'yadi?»
- «Saytni yozgan dasturchi yozib qo'ygan» *(37)*
- «Saytning o'zi yozib qo'ygan» *(27)*
- «Brauzeringiz o'zi o'lchab yozgan» ✅ *(32)*

**Bashorat-2 (3-slayddan oldin · 2-o'lchov: XATO — bo'lmagan sahifada holat nima):**
**Savol:** «Manzil oxiriga bo'lmagan sahifa nomini yozsangiz, yangi qatorda qanday holat turadi?»
- «200 — sahifa odatdagidek keldi» *(30)*
- «404 — bunday sahifa topilmadi» ✅ *(29)*
- «Hech narsa — qator umuman chiqmaydi» *(35)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — darsga qaytadi) — 🔴 ALOHIDA BOSQICH (7/7), slayd-4 bilan bir vaqtda ekranda turmaydi:** slayd-4 = 243 grapheme, ko'prik = 195; ikkalasi birga chiqsa ekran **438** bo'ladi va 400 chegarasidan oshadi (Intl.Segmenter bilan o'lchandi).
> Brauzer o'lchovni allaqachon qiladi — faqat siz qaraganda. O'lchagich shu raqamlarni to'xtovsiz o'qiydi va chegaradan o'tsa sizga xabar beradi. Endi saytingizga shu chegaralarni o'zingiz yozasiz.

> 🔴 **Hisoblagich — metodist hukmi (17-ov b, tuzatildi):** ov-bandi **jonli son-hisoblagichini** emas, **bosqich-hisoblagichini** so'raydi (`PmLesson9.jsx` s6 naqshi: har bosqichda aynan bitta «n/N», uzuq joysiz). Bu talab o'ylab topilgan raqam taqig'i (§101) bilan to'qnashmaydi — shuning uchun **bajarildi**: eyebrow «🖥 Haqiqiy holat · n/7». Bank raqamini sanaydigan jonli son-hisoblagichi esa bu ekranda YO'Q va bo'lmaydi (bank keysi yo'q — M4-D7 pretsedenti). Bashorat **2 ta, ikki o'lchovda** (manba · xato) — pasport talabi bajarildi ⚠️ GATE S 3-savoli.
> 🔴 **109-qonun 6-band bilan munosabat:** ov-ro'yxati «keys slaydida taxmin maks 1» deydi, 33-qonun/pasport «≥2» deydi — Batch 2 (M4a-D2, M4-D12) 2 bashorat bilan yopilgan; shu pretsedent olindi ⚠️ GATE S 3-savoli.
> 🔴 **Fakt-halolligi (§101/§124 — tekshirildi):** F12 → Network paneli · qayta yuklashda so'rov-qatorlari · «Status» va «Time» ustunlari · 200 · 404 · ms — Chrome/Edge/Firefox'da bir xil, o'quvchi hozir tasdiqlaydi ✓. Odamlar xatti-harakati haqida da'vo YO'Q; «brauzer har saytni o'lchaydi» — ekranda ko'rinadigan fakt.
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch varianti; 1-bashorat distraktorlari hayotda ham, slaydda ham rost emas (vaqtni sayt yoki dasturchi emas, brauzer o'lchaydi); 2-bashorat distraktorlari — «200» va «qator chiqmaydi» — 3-slayd rad etadi. Uzunlik: 37·27·32 (to'g'ri eng uzun emas ✓) · 30·29·35 ✓.
> 🔴 **§123 (bashorat-chipida izohsiz atama yo'q):** «404», «200» — M4 da o'tilgan (`ApiPostman` 200/201/404) va shu ekranning 2-slaydida hodisa bilan ko'rilgan; «ms» 2-slaydda ochilgan.
> 🔴 **62/29-qonun + §79/§112:** brauzer panelining nomlari — `DevTools`, `Network`, `Status`, `Time` — ekranda o'z holicha turadi (ekran-nomi tarjima qilinmaydi), lekin har biri o'sha zahoti o'zbekcha hodisa-so'z bilan tenglashtiriladi: «Status — holat», «Time — vaqt». `DevTools` o'quvchiga M1 dan tanish (`CssLesson2`: «F12 bosib ochasiz… Network — fayllar uchun») — shuning uchun «brauzer o'z paneli» emas, **tanish nom** bilan ataladi (§112 ko'prigi). «HTTP», «so'rov-javob», «server» — 0.
> 🔴 **Fakt-aniqligi (metodist-tuzatishi):** avvalgi matn «har qatorning **oxirida** ikki raqam» degan edi — Network'da holat va vaqt ikki **alohida ustunda** (Status · Time), qator oxirida faqat Time turadi. Endi slayd ustun nomini aytadi — o'quvchi ekranda ko'rganini so'zma-so'z topadi (§95).
> 🔴 **Mentorga (`MentorNote`):** «Hozir kompyuterida F12 bosib ko'rmoqchi bo'lganlar bo'ladi — ruxsat bering, bu darsning eng foydali daqiqasi. Telefonda bu panel yo'q — kompyuterda.»

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · VS Code + terminal)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Holat 200, vaqt 4200 ms keldi. Kod nima chiqarishi kerak?» → «📣 signal: sekin javob» ✅ *(21)* / «✅ Sayt ishlab turibdi» *(21)* / «📣 signal: xato 200» *(18)* — §129: uchala variant ham bir turdagi chiqish-qatori, farq faqat ma'noda.

**Boshlang'ich kod (`tekshir.js` — VS Code-mockup'da, qo'lda yoziladi):**

```js
// tekshir.js — o'lchagichning bir marta ishlashi
const MANZIL = 'https://mening-saytim.netlify.app'; // ← o'z saytingiz havolasi

async function olchagich() {
  const boshlandi = Date.now();          // hozirgi vaqt, millisekundda
  const javob = await fetch(MANZIL);     // saytga so'rov — Network'dagi bitta qator
  const vaqt = Date.now() - boshlandi;   // necha ms da keldi

  console.log('Holat:', javob.status, '· Vaqt:', vaqt, 'ms');

  // 1) javob.status 200 bo'lmasa:  '📣 signal: xato ' + javob.status
  // 2) vaqt 3000 dan katta bo'lsa: '📣 signal: sekin javob'
  // 3) ikkalasi joyida bo'lsa:      '✅ Sayt ishlab turibdi'
}

olchagich();
```

Terminal: `node tekshir.js`

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. `node tekshir.js` holat va vaqtni chiqaradi
2. Uch `if` uch xil qator chiqaradi
3. O'z saytingiz uchun natija chiqdi

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta `if` dan boshlang: `javob.status` 200 emasmi? Ishlagach `vaqt > 3000` ni qo'shing.

**YULDUZCHA:** `for` bilan 3 marta ketma-ket o'lchang va eng uzun vaqtni alohida chiqaring — o'lchagich bir marta emas, qayta-qayta o'lchaydi.

> 🔴 **Sanoq-mosligi (22-qonun):** 3000 ms = s4 dagi 3 s chegarasi; holat 200/404 — s6 raqamlari; «Holat · Vaqt» — Network ustunlari bilan bir tartibda (o'quvchi brauzerda ko'rgan ikki raqamni terminalda qayta ko'radi — korpus §95).
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`olchagich` · `MANZIL` · `javob` · `vaqt`): kodda `olchagich`, prozada «o'lchagich» (lug'at `tolov` pretsedenti).
> 🔴 **87-qonun:** `if`, `for`, `console.log`, `fetch`, `async/await`, `.status` — o'tilgan; `Date.now()` boshlang'ich kodda tayyor, izohli (yozdirilmaydi). `try/catch` talab qilinmaydi — internet yo'q holat mentor eslatmasida.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — brauzer Network'da ko'rilgan ikki raqam endi kod natijasi; `if` — bu chegara, ya'ni signal-qoidasi kodda.
> 🔴 **REAL o'lchov (WOW):** natija o'quvchining O'Z saytiga real so'rov — bu darsdagi yagona haqiqiy o'lchov, va u o'zi yozgan qoida bilan bir tilda.
> 🔴 **82(c):** panel (yo'riq + darvoza-mashq + «✅ Bajardim — signal-qatori chiqdi») CHAPDA, kod O'NGDA · **82(f):** sinf-puls o'quvchiga ko'rinmaydi.
> 🔴 **89-qonun:** takrorlash-yo'li (erkin rejim, matn-havola): «✓ Bu mashqni sinfda bajarganman — davom etish →».

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qoida-qatori CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo raqamsiz — chegara-raqamlari s4 kashfiyoti |
| **s12 REFLEKSIYA** | Sarlavha: «Uch chegarangizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga». Yozgach mukofot (106f-b) |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni sinab ko'ring.» |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob — o'lchagich.» · «Odam sezgan signal — chin; hech kim sezmagan signal — quruq.» · «Chegara odam seza boshlaydigan joyga qo'yiladi.» · «Saytni chiqarish — ishning yarmi; chiqqandan keyin o'lchab turish — ikkinchi yarmi.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |
| **Sayt-nomi** | s4 paneli va s10 kodi sayt nomini `cc-site-url` dan o'qiydi; bo'lmasa `mening-saytim.netlify.app` — jim (§69), «havolangiz yo'q» kabi matn 0 |

### 8-A. Quruvchiga — `SCREEN_INTENTS` va s4/s9 holat-mashinasi (qisqa)

| Ekran | intent | done-sharti (PRACTICE_BASE signali) |
|---|---|---|
| s0 | hook-vote | tanlov bosildi (payoff ochildi) |
| s1 | preview | animatsiya tugadi (avto) |
| s2 | compare-2 | ikkala karta kamida bir marta ochildi (`seen`, 46-qonun) |
| s4 | panel-day | kun tugadi **va** uchala chegara bosildi (yakun-karta ochilgach) |
| s6 | fact-slides | 4 slayd o'tildi (2 bashorat belgilangan) |
| s8 | workshop-3 | 3/3 saqlandi (`pm-m4c6-signal` yozildi) |
| s9 | route-4 | 4/4 yo'l tanlandi (to'g'ri-noto'g'ri farqsiz — bajarilganlik) |
| s10 | vscode-check | «✅ Bajardim — signal-qatori chiqdi» (darvoza-mashq to'g'ri bo'lgach ochiladi) |
| s12 | reflection | bir qator yozildi |

**s4 holat-mashinasi:** `idle` → (▶) `running` (40 s; `t` 08:00→20:00; hodisalar `t`ga bog'liq, fakt-qator `t` yetganda chiqadi va qoladi) → `dayDone` (2-bosqich savol-kartasi ochiladi) → `replay(1|3|10)` (~6 s, 📣 belgilar) → `result(1|3|10)` (natija-qatori; tugma «bosildi» holatiga o'tadi) → uchalasi bosilgach `done` (yakun-karta + `Eagle Eye!`). `prefers-reduced-motion`: `running` o'rniga «Keyingi soat ▸» tugmasi bilan 12 qadam; `replay` bir zumda. Holat `pm-m4c6-kun` ga yoziladi (F-0730-01 progress-saqlov: qayta kirganda `done` bo'lsa yakun-karta ochiq turadi).

**s9 holat-mashinasi:** `i = 0..3` · har kartada ikki tugma → tanlov → javob-qatori (✅/🤔 + sabab) → «Keyingisi ▸» → oxirida `strip` (to'rttasi bir qatorda: belgi + yo'l) + yakun-qatori. Birinchi noto'g'ri tanlovdan keyin YORDAM chipi ochiladi (yig'ma, default-yopiq emas — bir marta ko'rinadi). To'rt yo'l `pm-m4c6-yol` ga yoziladi.

**s6 fakt-slaydlari:** eyebrow «🖥 Haqiqiy holat · n/7» (uzluksiz bosqich-hisoblagichi — 17-ov b) · slayd-1 → bashorat-1 (savol + 3 variant) → natija-qatori → slayd-2 → bashorat-2 → natija-qatori → slayd-3 → slayd-4 → **ko'prik-gap alohida bosqichda** (slayd-4 bilan bir ekranda emas — birga 438 grapheme bo'ladi). Klaviatura-belgilar (`F12`, `F5`) mono-chipda; `mening-saytim.netlify.app/yoq` — `cc-site-url` bo'lsa o'quvchining o'z nomi bilan.

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | To'g'ri idx | Manba |
|---|---|---|---|
| 1 | O'lchagich nima? | 0 | s2 |
| 2 | O'lchagich qachon ishlaydi — chiqarishgacha yoki chiqqandan keyin? | 3 | s2 |
| 3 | «Javob vaqti» o'lchagichi nimani ko'rsatadi? | 2 | s2/s4 |
| 4 | Signal nima? | 1 | s4 |
| 5 | Qaysi signal chin? | 1 | s4 |
| 6 | Kechasi javob bir zumga sekinlashdi, hech kim sezmadi — bu qanday signal? | 0 | s4 |
| 7 | Chegara juda past bo'lsa nima bo'ladi? | 2 | s4/s11 |
| 8 | Chegara juda baland bo'lsa nima bo'ladi? | 3 | s4 |
| 9 | Brauzer Network'da qator oxiridagi ikki raqam nima? | 0 | s6 |
| 10 | Holat 404 nimani bildiradi? | 2 | s6/s7 |
| 11 | Javob bir zumga sekinlashdi va qaytdi — bu signal qayerga yoziladi? | 1 | s9 |
| 12 | Chiqqandan keyin saytni o'lchashni kim hal qiladi? | 3 | s6/s15 |

> 🔴 **§117 (metafora-so'z ballanadigan matnda tug'ilmaydi):** «quruq» va «chin» arenaga s4 yakun-kartasidan keyin keladi — ikkalasi ham dars ichida ochilgan ✓.
> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «monitoring», «uptime», «latency», «server», «status» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «o'lchagich», «signal», «chegara», «chin/quruq», «holat», «vaqt» so'zlari bilan.
> 🔴 **§114:** arena-fon/dekor so'zlari shu dars lug'atidan (o'lchagich · signal · chegara · sayt · holat · vaqt) — 4c lenta-so'zlari fonga chiqmaydi.
> 🔴 **§107 arena varianti:** «chiqarishgacha / chiqqandan keyin» savolida (2) to'rt variant 2/2 (ikki «keyin» — sababi har xil, biri yolg'on).

🔴 **Arena-yozish sharti (metodist · 16-ov + §110/§127 — quruvchiga majburiy):** to'rt variantli savolda **ikki variantlik olam** (yo'l · signal turi) bo'lsa, variantlar **2/2** yoziladi va farq SABABda qoladi — bo'sh to'ldiruvchi variant o'ylab topilmaydi. Ikki eng xavflisi shu yerda to'liq yozildi, qolgan 10 tasi shu qolipda:

**Q6 (to'g'ri idx 0)** — «Kechasi javob bir zumga sekinlashdi, hech kim sezmadi — bu qanday signal?»
- **Quruq — uni hech kim sezmadi** ✅ *(29)* · «Quruq — u kechasi keldi» *(25)* · «Chin — javob sekinlashdi» *(25)* · «Chin — o'lchagich xabar berdi» *(28)*
- 2 «quruq» / 2 «chin» — bola atama-nomini emas, SABABni tanlaydi (§107); ikkinchi «quruq»ning sababi darsda ochiq yolg'on (vaqt emas, odam sezishi hal qiladi).

**Q11 (to'g'ri idx 1)** — «Javob bir zumga sekinlashdi va qaytdi — bu signal qayerga yoziladi?»
- «Hozir xabarga — javob sekinlashdi» *(33)* · **Jurnalga — uni hech kim sezmadi** ✅ *(31)* · «Hozir xabarga — sayt ochilmay qoldi» *(35)* · «Jurnalga — saytda xato ko'paydi» *(31)*
- 2 «jurnalga» / 2 «hozir xabarga»; to'g'ri javob eng uzun emas; har distraktorning sababi savol-materialida yolg'on.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Eagle Eye!** | Odam sezadigan chegarani topdingiz | 34 | s4: uch chegara ham bosildi, yakun-karta ochildi |
| **Rule Writer!** | Uch qoidani sabab bilan yozdingiz | 33 | s8: 3/3 saqlandi |
| **Cool Head!** | To'rt signalni to'g'ri yo'naltirdingiz | 38 | s9: 4/4 to'g'ri yo'l |
| **Site Checker!** | Saytingizni kod bilan o'lchadingiz | 34 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 33–38 belgi ✓ (metodist: «Uch **signal-qoidasini**…» ichki birikma edi — nishon-tavsifi ham o'quvchi ko'radigan matn, sodda «qoida»ga almashtirildi).
> 🔴 **§100 (omonim-tekshiruvi):** «Eagle Eye», «Rule Writer», «Cool Head», «Site Checker» — kursning texnik lug'atida boshqa ma'no bermaydi ✓ (❌ «Signal Router» — Router texnik atama, rad; ❌ «Alert Sorter» — sort texnik atama, rad).
> 🔴 **§93 (tasdiq bajarilgan ishni aytadi):** «topdingiz» (s4 da uchta chegarani solishtirib topdi), «yozdingiz» (s8), «yo'naltirdingiz» (s9), «kod bilan o'lchadingiz» (s10 da real so'rov).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | O'lchagich nima? | Sayt chiqqandan keyin uni to'xtovsiz o'lchab turadigan asbob |
| 2 | Uch o'lchagich nimani ko'rsatadi? | Sayt ochiladimi · javob necha soniyada · 100 kirishdan nechtasi xato |
| 3 | Signal nima? | O'lchagich chegaradan o'tganda keladigan xabar |
| 4 | Qaysi signal chin? | Odam sezgan signal |
| 5 | Qaysi signal quruq? | Hech kim sezmagan signal |
| 6 | Chegara qayerga qo'yiladi? | Odam seza boshlaydigan joyga |
| 7 | Chegara juda past bo'lsa? | Quruq signallar ko'payadi |
| 8 | Chegara juda baland bo'lsa? | Odam sizdan oldin sezadi |
| 9 | Network'da qator oxiridagi ikki raqam nima? | Holat (200 · 404) va vaqt (ms) |
| 10 | Bugungi o'lchagich ishini inglizchada qanday atashadi? | Monitoring — saytni chiqqandan keyin to'xtovsiz o'lchab turish |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · uch o'lchagich · signal · chin · quruq · chegara joyi · past · baland · brauzer o'lchovi · inglizcha juftlik).
> 🔴 **Inglizcha atama faqat 10-kartada** — dars ichida «monitoring» boshqa hech qayerda yo'q (korpus §20).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «O'lchagich — chiqqandan keyin»** — (1) kanonik ta'rif · (2) lenta chiqarishgacha tekshiradi, chiqqandan keyin o'lchagich o'lchaydi · (3) sinfga savol
**s5 · «Odam sezgan signal — chin»** — (1) kanonik ta'rif so'zma-so'z: «O'lchagich chegaradan o'tganda keladigan xabar — signal» · (2) odam sezgan signal — chin, hech kim sezmagan signal — quruq · (3) savol
**s7 · «Brauzer o'zi o'lchaydi»** — (1) Network'da har qator — bitta so'rov: holat + vaqt · (2) 404 — sahifa yo'q; sekinlik xato emas · (3) savol
**s11 · «Chegara — odam seza boshlaydigan joy»** — (1) past chegara — quruq signallar ko'payadi · (2) baland chegara — odam sizdan oldin sezadi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** bu darsda keys yo'q — «Haqiqiy holatda» deb ataladi.

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys — **zaxira ilgak** (bank keysi yo'q, o'ylab topilgan kompaniya/raqam/voqea 0) ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — m4c-02 haftaga-sig'dirish · m4b-02 bug-triaj · M4a-D2 yuk-tartiblash · **M4c-D6 signal-saralash (har signalga yo'l)** ✓
7. Sensirash — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): o'quvchining o'z Netlify-sayti — s0 dan s15 gacha; haqiqiy holat (s6) ham o'sha saytda ✓
- 95 (Toshkent o'smiri): o'zi chiqargan sayt ✓
- 96c: ip o'quvchining ARTEFAKTIDA (`cc-site-url`), demo-olam emas; to'qnashuv-grep shapkada ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m4c-02 kompilyator → m4c-06 VS Code) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2–M4 materiali; `Date.now()` tayyor+izohli (GATE S 8) ✓
- 29 (kelajak-atama oqmaydi): «metrika», «OKR», «uptime», «latency» o'quvchi matnida **0** ✓
- 33/56/100: haqiqiy holat 2 bashorat, ikki o'lchov; natija asl javobni aytadi; «ball emas» va hook-echo yo'q ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 104/§119: hook ikki tanlovi teng (52 ↔ 52), payoff hech birini yolg'onga chiqarmaydi ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap) ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (chegara-son + sabab); sayt-havolasi HECH QAYERDA majburiy emas ✓
- 88: navbat-to'lqini — s4 «Kunni boshlash» → uch chegara to'lqin; s9 ikki yo'l to'lqin; testda javobgacha yo'q ✓
- 89: koding takrorlash-yo'li erkin rejimda ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN §99–129 o'qildi):**
1. **§20/§80/§85:** «o'lchagich» yagona nom, kanonik ta'rif 4 yuzada so'zma-so'z; «monitoring» o'quvchi ekranida 0 (flashcard-10 dan tashqari) ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «kim» · T2 fe'l-gap · T3 «… qatorda» · T4 panel-harakati) ✓
3. **§102:** distraktorlar ekranda rost bo'lib ko'rinmaydi — T2-B/T4-A/T4-C boshqa son uchun rost, so'ralgan son uchun emas ✓
4. **§105/§121:** «signal» faqat dars-ma'nosida · «quruq» faqat signal sifatida · «kirish» faqat sayt-kirish · «yashil» s2 da lenta, s4 da o'lchagich — bir ekranda ikki ma'no yo'q ✓ · 🔴 **«to'xta-» ildizi tozalandi** (metodist-tuzatishi): sayt uchun «to'xtadi/to'xtab qoldi» olib tashlandi (s0 · s2 · TEST-1), ildiz faqat kanonik ta'rifdagi «to'xtovsiz» da qoldi ✓
5. **§106/§129:** T1 vaziyat-qo'llash · T2 yangi son + odam harakati · T3 ikki qator solishtiruvi · T4 yangi son + panel harakati — hech biri xulosa-ko'chirma emas ✓
6. **§107:** ha/yo'q-savol yo'q; s9 yo'llar 2/2 ✓
7. **§108:** hech bir savol rostni rad ettirmaydi ✓
8. **§109:** bosh ta'rif zamon-iborasi bilan («chiqqandan keyin») ✓
9. **§110:** mutlaq so'z bir variantdan oshmaydi («ikkalasida ham» T3-B; T4 dagi «faqat» metodist-raundida olib tashlandi); kulgili-bo'sh variant yo'q ✓
10. **§111:** «degan javob» 0 ✓
11. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi uchala chegara bosilgach; s9 4-signal savoli) ✓
12. **§114:** arena-dekor so'zlari shu dars lug'atidan ✓
13. **§115:** ipuchalar bir gap-turida (uchala «Necha…?» savoli); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?») ✓
14. **§116:** s9 YORDAM-savoli ikkala o'lchovni qamraydi (sezadimi + sahifa ochilmay qoldimi) ✓
15. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi («quruq» s4 yakun-kartasida ochiladi, keyin T4 da) ✓
16. **§118:** distraktorlarda cheklov-so'zi umuman yo'q — T4 qayta yozilgach «faqat» ham ketdi; hech bir distraktor cheklov-so'zi hisobiga yolg'on bo'lib turmaydi ✓
17. **§119:** hook payoffi hech bir tanlovni yolg'onga chiqarmaydi ✓
18. **§120:** s9 har xabarda yetarli material (o'lchagich · son · davomiylik/sabab) ✓
19. **§122/§124:** keys-raqam yo'q — zo'rlash imkoni ham yo'q; inkor-gaplar («hech kim tekshirmaydi») darsning o'z demo-olamiga tegishli, bank haqida emas ✓
20. **§123:** demo-namuna (s1) darsning o'z qoidasiga bo'ysunadi; bashorat-chipida izohsiz atama yo'q; hisoblagich yo'q (raqam yo'q) ✓
21. **§125:** s1 natijani NOMLAYDI, ko'rsatmaydi ✓
22. **§126:** bosh atama s1 da yo'q — s2 da tug'iladi ✓
23. **§127:** har scored-savolda dars atamasi yo yo'q, yo ≥2 variantda ✓ — 🔴 T4 metodist-raundida qayta yozildi (avval «quruq» yagona to'g'ri variantda edi); arena Q6/Q11 2/2 qolipda to'liq yozildi ✓
24. **§128:** shart-yorliqlari darak gapda («Har chegarada son bor») · s1 namunasi s8 shartidan o'tadi (so'z-shakl, s8 esa son so'raydi — namuna raqamsiz bo'lgani uchun uni ko'chirib bo'lmaydi, bola o'zi son yozadi) ✓
25. **§40:** «saytingiz» — o'quvchida bor; «panelingiz» 0 · «qoidalaringiz» faqat s8 dan keyin ✓
26. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
27. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — jim zaxira ✓
28. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 2 karta (s2) · 3 o'lchagich + 6 hodisa + 3 chegara (s4) · 4 slayd + 2 bashorat (s6) · 3 qoida (s8/s12/uy-vazifa) · 4 signal, 2 yo'l (s9) · 3 shart (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
29. **Ekran-prozalari (Intl.Segmenter bilan qayta o'lchandi):** s0 326 · s1 124 · s2 341 · s4 385 · s6 slayd-2 244 · s6 slayd-4 243 · s6 ko'prik 195 · s8 125/120 · s9 149 · s10 126 · s12 197 · uy-vazifa 203 grapheme (chegara 400) ✓ · variant-telllari T1 1.13 · T2 1.03 · T3 1.00 · T4 1.22 (to'g'ri javob eng QISQA) · bashorat 1.37/1.21 · arena Q6 1.26 · Q11 1.13 · hook 1.00 ✓

**Lint natijasi (metodist-korrekturasidan keyin):** `node til-lint.mjs pm-senariylar/M4c-D6-Monitoring.md` — **0 error**; qolgan warn'lar faqat senariy-annotatsiyasida (gloss-bo'limidagi «puls» taqiq-eslatmasi, ETALON 82(f) dan ko'chirilgan «sinf-puls» element-nomi, PM_Prompt_v8 ning majburiy «BLOK 3: YADRO» sarlavhasi, 29-qonun tekshiruvidagi «OKR» misoli) — **o'quvchi matnida bu so'zlarning bittasi ham yo'q** (grep bilan tasdiqlandi). `node prompt-lint.mjs` — toza.

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/4c-Modull/PmLesson18.jsx` → **0 error** shart.

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4c-D6 ga tegishli):
`monitoring` (flashcard-10 dan tashqari **0**) · `uptime` · `latency` · `error rate` · `alert` · `dashboard` · `metrika` (29-qonun) ·
`puls` · `salomatlik` · `tomir` · `harorat` (eski v16 tibbiyot-metaforasi **0**) ·
`server` · `hosting` · `HTTP` · `status kod` · `so'rov-javob` (texnik atama **0**; «holat» va «vaqt») ·
`ulush` · `foiz` (→ «100 kirishdan nechtasi») ·
`ogohlantirish` · `shovqin` · `yolg'on signal` (→ «signal», «quruq signal») ·
`yiqil` · `qulad` · `yotib qol` · `tushib qol` (fe'l-intizomi: faqat «ochilmay qoldi») ·
`kuzat` (yolg'iz fe'l — o'quvchi matnida tekshiriladi) ·
`panelingiz` · `signallaringiz` (§40) · `topilmadi` · `saqlanmagan` (§69) ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`skaner` · `o'lcham ramkasi` · `chamadon` (lenta-so'zlari — faqat «lenta» s2 da bitta gapda) ·
`Router` · `Sorter` (nishon-nomlarida — §100) ·
`odam-belgisi` · `signal-yo'l` (defisli ichki birikma o'quvchi matnida 0).

---

## 13-A. 🎓 METODIST-KORREKTURA (pm-metodist · 2026-08-17 · senariy-korrektura rejimi)

> Senariy qurishga chiqishdan oldin til, atama-tartibi va test-halolligi bo'yicha to'liq
> o'qib chiqildi. Quyida **matnga kirgan** tuzatishlar (oldin → keyin) va metodist hukmlari.
> Ball-kalitlar (`correct` indekslari), ekran-tuzilishi va mexanika TEGILMADI.

### (A) Atama-tartibi — hodisa avval, nom keyin (§104/§126, 39/62-qonun)

| Joy | ❌ Oldin | ✅ Keyin | Sabab |
|---|---|---|---|
| s4 savol-kartasi | «Javob vaqtiga **chegara qo'ying**: necha soniyadan boshlab sizga xabar kelsin?» | «Javob necha soniyadan uzoq kelsa, sizga xabar kelsin?» | «chegara» hali ochilmagan edi — atama hodisadan OLDIN kelardi |
| s4 natija-qatorlari | «📣 **3 ta signal** keldi…» | «📣 **Uch marta xabar** keldi…» | «signal» ham hodisadan oldin turgan edi; endi ikkala atama yakun-kartada tug'iladi |
| s4 yakun-kartasi | «O'lchagich chegaradan o'tganda **paneldan** keladigan xabar — signal.» | «**Siz qo'ygan son — chegara.** O'lchagich chegaradan o'tganda keladigan xabar — signal.» | ikkala atama bir joyda, ko'rilgan hodisadan keyin; «paneldan» olib tashlandi — flashcard-3 va RECAPS s5 bilan endi **so'zma-so'z** bir xil (§20/§52 kaskadi) |

### (B) Ildiz-tozaligi «to'xta-» (§121 — metodist topgan yangi sinf)

Dars ta'rifi «sayt chiqqandan keyin uni **to'xtovsiz** o'lchab turadigan asbob» deydi, ayni
paytda uchta o'quvchi-matni saytning to'xtashini ham «to'xtadi» deb atardi — 13 yoshli bola
ikkalasini bitta so'z deb o'qiydi va ta'rif loyqalanadi.

- s0 payoff: «sayt hozir **to'xtab qolsa**» → «sayt hozir **ochilmay qolsa**» (+ «Ammo» → «Lekin»)
- s2 kartasi: «**to'xtasa**, buni birinchi kirgan odam ko'radi» → «**ochilmay qolsa**, …»
- TEST-1 reveal: «**to'xtashni** birinchi kirgan odam ko'radi» → «**sayt ochilmay qolganini** …»
- 0-bo'lim fe'l-intizomiga «to'xtadi / to'xtab qoldi» taqiq qatori qo'shildi.

### (C) Test-halolligi (16-ov · §110/§118/§127)

**TEST-4 to'liq qayta yozildi.** Eski shaklda ikki nuqson bir joyda edi: «**quruq**» darsning
atamasi bo'lib **faqat to'g'ri variantda** turgan (§127 — bola mazmunni bilmay kalit-so'z
bilan topadi), distraktor A esa «**faqat**» cheklov-so'zi hisobiga yolg'on bo'lib turgan
(§118). Yangi shakl: savol «Kun bo'yi **kelgan xabarlar qanday bo'ladi?**» — uchala variant
ham xabarlar tavsifi (§99), darsning birorta atamasi to'g'ri variantda yo'q, «chegara» faqat
distraktorda; uzunliklar 39 · **33** · 37 (to'g'ri javob eng qisqa).

**Arena.** Ikki savol 4 variantli bo'lgani holda **ikki variantlik olamdan** so'rardi (Q6 —
chin/quruq, Q11 — ikki yo'l): qolgan ikki variant muqarrar to'ldiruvchi bo'lardi (§110).
Ikkalasi ham **2/2 qolipda to'liq yozildi** (farq atama-nomida emas, SABABda — §107) va
9-bo'limga kiritildi; qolgan 10 savol uchun shu qolip majburiy shart qilib qo'yildi.

**TEST-2 savoli** g'aliz edi («Javob 5 daqiqa davomida 8 soniyada keldi») → «**Besh daqiqa
davomida sahifa 8 soniyada ochildi**» — bir nafasda o'qiladi (§68).

### (D) Kognitiv bosqich (S28) va yozish-ekrani diyetasi (ETALON 25/32 · §130)

- **s8 YULDUZCHA kelajakdan so'rardi:** «bittasini "📣 hozir" emas, "📒 jurnalga" yo'liga
  o'tkazing» — ikki yo'l esa s9 da ochiladi. Almashtirildi: «Uch chegarangizdan bittasini
  ikki barobar pasaytirib ko'ring: endi qanday signallar ko'payadi?» (faqat s4 bilimidan).
- **Checklist §130 ni buzardi:** «Har sababda **"odam" so'zi bor**» — bola so'zni ko'chirishi
  shart deb o'qiydi. → «**Har sabab odam sezganini aytadi**» (ma'no so'raladi), ikki
  aniqlovchi savol Yordam chipiga ko'chdi.
- ✅-javob qatori: «Sababingizda odam **ko'rinib turibdi — chegara asosli**» →
  «**Sababingiz odam nimani sezishini aytyapti.**»
- s8 sarlavhasidan ichki birikma ketdi: «uchta **signal-qoidasi**» → «uchta **qoida**».
- s4 mentori 2 gapdan **1 gapga** tushdi — «"Kunni boshlash"ni bosing» tugmaning o'z
  yorlig'ini takrorlardi (ETALON 32).

### (E) Fe'l ↔ ekrandagi jarayon (ETALON 42) va aniq-fe'l qoidasi

- Uy-vazifa: «Uyda **o'lchagichni ishga tushirasiz**» → «Uyda **o'lchagich ishini o'zingiz
  bajarasiz**» (bola hech qanday o'lchagichni ishga tushirmaydi — brauzerdan o'qiydi).
- s10 mentori: «**Hozirgina** brauzer Network'da ko'rgan» → «Network'da **o'zingiz** ko'rgan»
  (oradan uch ekran o'tgan; ega ham noaniq edi).
- s8 mentorlari: «uch ishingiz **chiqib ketdi** — ularning **ishlayotganini** o'lchagich
  aytadi» → «uch ishingiz **endi saytda** — ular **ishlayaptimi**, buni o'lchagich aytadi»
  (ikki tarmoq uzunligi 93 ↔ 89 — jim zaxira shakli saqlandi, §69).
- s12 mukofoti: «saytni chiqarib **qo'ymaydigan** … o'lchab turadigan **odamsiz**» →
  «saytni chiqarib **qo'yib ketmaysiz** — chiqqandan keyin ham **o'lchab turasiz**».
- s10 RO'YXAT: «natija **ko'rildi**» → «natija **chiqdi**».
- Yakun-qatori: «… mahsulotni o'ylaydigan odamning qarori» → «… **ikkinchi yarmi**» (§52).
- s1 maqsad-gapi ma'nosi buzuq edi: «sayt bilan nima bo'lsa — sizga **darhol xabar keladi**»
  (darsning o'z qoidasiga zid: hamma narsaga xabar = quruq signal) → «sayt bilan nima
  bo'lganda sizga xabar kelishini **o'zingiz belgilaysiz**».

### (F) Fakt-halolligi va tanish nom (§95/§112/§79)

- s6 slayd-2 «har qatorning **oxirida** ikki raqam: holat va vaqt» — Network'da bu **ikki
  alohida ustun**; endi slayd ustun nomini aytadi: «**Status** — holat (200) va **Time** —
  vaqt». O'quvchi ekranda ko'rganini so'zma-so'z topadi.
- s6 slayd-1 «brauzer **o'z panelini** ochadi» → «tanish **DevTools** paneli ochiladi» —
  `CssLesson2` (M1) da aynan shu nom bilan o'rgatilgan (§112 ko'prigi).
- Ikkala bashoratda **savol-gapi yo'q edi** (faqat variantlar turardi) — ikkalasiga ham
  aniq savol yozildi, atamasiz.
- Havola-nomi butun darsda bitta shaklga keltirildi: `mening-saytim.netlify.app`
  (s0 · s6 slayd-3 · s10 kodi) — `cc-site-url` bo'lsa o'quvchining o'z nomi, jim (§69).
- Flashcard-10 taftologiya edi (savol = javob): «Saytni to'xtovsiz o'lchab turish qanday
  ataladi?» → «**Bugungi o'lchagich ishini inglizchada qanday atashadi?**» / javob
  «**Monitoring** — saytni chiqqandan keyin to'xtovsiz o'lchab turish» (§76 glossi joyida).
- s9 sahnasi ikki xil aytilardi («Ertalab…» ↔ o'tish-gapida «kechasi») → ikkalasi
  «**tunda va ertalab**» / «tunda kelgan **yangi** to'rt signal» (22-qonun).

### (G) Metodist hukmlari (GATE S ga)

1. **«O'lchagich» + «signal» oilasi — TASDIQLANADI** (14-bo'lim 2-savoliga metodist javobi).
   So'z o'smirga jismonan tanish (harorat/tezlik o'lchagich), «-gich» = asbob; ta'rifi bir
   gapda ochiladi, chala bo'lagi qolmaydi. «Kuzatuvchi» rad — «kuzat-» lug'atda mavhum fe'l
   sifatida allaqachon taqiqlangan. **«Haqiqiy signal» ham rad** — s6 eyebrow'i «Haqiqiy
   holat» bo'lgani uchun bir ildiz ikki ma'noda yashardi (§121); chin ↔ quruq juftligi
   o'smirga «chin gap / quruq gap» orqali tanish.
2. **Hisoblagich masalasi — yopildi (17-ov b noto'g'ri o'qilgan edi).** Ov-bandi jonli
   son-hisoblagichini emas, **bosqich-hisoblagichini** so'raydi; u §101 (o'ylab topilgan
   raqam taqig'i) bilan to'qnashmaydi va endi bajarildi: «🖥 Haqiqiy holat · n/7».
   Bank raqamini sanaydigan jonli hisoblagich yo'q va bo'lmasligi ham to'g'ri.
3. **F12 → Network — QOLSIN** (dalillar 14-bo'lim 4-savolida: xavfsiz, M1 dan tanish,
   bir bosishda qaytariladigan harakat). Soddaroq zaxira variant o'sha yerda yozildi.
4. **s6 ko'prik-gapi alohida bosqich** bo'lishi shart: slayd-4 (243) + ko'prik (195) birga
   chiqsa ekran **438 grapheme** bo'lib 400 dan oshadi.
5. **s4 chegaraga yaqin (385/400)** — yakun-kartasiga yana bir gap qo'shilsa oshadi.
6. **«puls» o'quvchi matnida 0** ✓ (grep bilan tasdiqlandi): qolgan 3 topilma —
   0-bo'limdagi taqiq-eslatmasi, ETALON 82(f) dan ko'chirilgan `sinf-puls` element-nomi va
   residue-grep ro'yxati. Dizayn-tavsifidagi «indigo-pulsda» → «indigo miltillashda»,
   «navbat-pulsi» → «navbat-to'lqini» qilib almashtirildi (JSX ga oqib ketmasin).
7. **Kelajak-atama (m4c-07 `FullProPipelineLesson`: parallel lenta · maxfiy kalit ·
   sinov reysi · eski yukni qaytarish) — darsda 0** ✓ (grep toza).

### (H) Quruvchiga qaytarilgan tuzilma-shartlari

- s6 eyebrow'ida **uzluksiz bosqich-hisoblagichi** `n/7` (bashorat javobidan keyin ham turadi);
- s6 ko'prik-gapi **7/7 alohida bosqich**, slayd-4 bilan bir ekranda emas;
- s8 Yordam chipi default-yopiq, ichida ikki savol (checklist yorlig'i ≤5 so'z);
- arena Q6/Q11 aynan 9-bo'limda yozilgan matn bilan quriladi (2/2 qolip);
- s4 yakun-kartasi matni birorta gap qo'shilmasdan ko'chiriladi (385/400).

---

## 14. ⏳ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq savollar)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi. Bosh-agent avto-GATE S bilan yopishi mumkin.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m4c-06`: title «Monitoring — mahsulot metrikasi» · sub «sayt ishlab turdimi, javob tezligi va xatolar ulushi». «Monitoring» — chet atama (o'quvchi ekranida 0), «metrika» — M8-D1 atamasi (29-qonun), «ulush» — lug'at-taqiq. **Taklif:** title → **«Saytingiz hozir ochilyaptimi?»** · sub → **«chiqqandan keyin saytni kim o'lchaydi»**. Tasdiqlaysizmi?

2. 🔴 **BOSH ATAMA «O'LCHAGICH» + «SIGNAL» (metodist-hukmi so'raladi).** «Monitoring» o'rnini butun darsda **«o'lchagich»** oilasi oladi (o'lchagich · o'lchaydi · chegara · signal · chin/quruq); inglizcha juftlik faqat flashcard-10 da. Sabab: «o'lchagich» o'smirga jismonan tanish (harorat/tezlik o'lchagich), ta'rifi bir gapda ochiladi. Rozimisiz — yoki «kuzatuvchi» kabi boshqa so'z izlansinmi?

3. 🔴 **HAQIQIY HOLAT: 2 BASHORAT (hisoblagich masalasi metodist-raundida yopildi).**
   **(a) Hisoblagich — yopildi, savol qolmadi.** Senariy avval «hisoblagich qo'yilmaydi, chunki bank raqami yo'q» degan edi — bu 17-ov bandini noto'g'ri o'qish edi. Ov-bandi **bosqich-hisoblagichini** (`n/N` progress) so'raydi, jonli son-hisoblagichini emas; u o'ylab topilgan raqam taqig'i (§101) bilan umuman to'qnashmaydi. Endi qo'yildi: eyebrow «🖥 Haqiqiy holat · n/7», bashorat javobidan keyin ham yo'qolmaydi (`PmLesson9` s6 naqshi). Bank raqamini sanaydigan jonli son-hisoblagichi esa yo'q va bo'lmaydi — bank keysi yo'q (M4-D7 pretsedenti).
   **(b) Qolgan yagona savol — bashorat SONI.** Pasport «≥2» deydi, 109-qonun ov-ro'yxatining 6-bandi «keys slaydida taxmin maks 1» deydi. Batch 2 (M4a-D2, M4-D12) pretsedenti bo'yicha **2 ta** olindi va ikkalasi ikki xil o'lchovda (manba · xato), birinchisi ikkinchisining javobini ochmaydi (17-ov c ✓). 2 ta qolsinmi — yoki 1 taga tushirilsinmi?

4. 🔴 **s6 = BRAUZER NETWORK (F12) — metodist hukmi: QOLSIN.** Zaxira ilgak sifatida o'quvchining o'z kompyuterida shu daqiqada tekshiriladigan fakt olindi: F12 → DevTools → Network → **Status** (200/404) va **Time** (ms).
   **Xavfsizlik va tushunarlilik tekshirildi:** (1) F12 hech narsani o'zgartirmaydi — faqat ko'rsatadi, tasodifan sayt yoki fayl buzilmaydi; (2) `DevTools` va `F12` o'quvchiga **M1 dan tanish** — `CssLesson2` da aynan shu so'zlar bilan o'rgatilgan («F12 bosib ochasiz… Network — fayllar uchun»), shuning uchun slayd «brauzer o'z paneli» demaydi, tanish nomni aytadi (§112); (3) uchala qadam ham (F12 · F5 · manzil oxiriga `/yoq`) o'quvchi bir bosishda qaytara oladigan harakat; (4) ustun nomlari **Status/Time** — ekranda inglizcha turadi va o'sha zahoti o'zbekchaga tenglashtiriladi («holat», «vaqt»).
   ⚠️ **Yagona real to'siq — telefon:** bu panel telefonda yo'q. Mentor-eslatmasida bor, slaydda esa «Kompyuteringizda» so'zi birinchi qatorda turadi.
   **Agar baribir soddaroq shakl tanlansa (zaxira variant):** 4 slayd shu qolipda qoladi, lekin F12 o'rniga — «saytingizni oching · sekundomerni sanang: sahifa necha soniyada keldi · endi manzil oxiriga `/yoq` yozing va nima chiqishini ko'ring». Bashorat-2 (404) shundayin ishlaydi, bashorat-1 esa «vaqtni kim o'lchaydi» dan «sahifa necha soniyada keldi» ga o'zgaradi — lekin s10 kodidagi `javob.status` bilan ko'prik yo'qoladi (bola holat raqamini hech qachon ko'rmaydi). Shuning uchun tavsiya: **hozirgi shakl qolsin**. Tasdiqlaysizmi?

5. 🔴 **ARTEFAKT SHAKLI.** `pm-m4c6-signal = { signallar: [ { olchov: 'ochilish'|'vaqt'|'xato', chegara: son, sabab } × 3 ], savedAt }` + saqlash-sharti «har chegara son, har sababda odam holati». Taklif: **m4c-07** (`FullProPipelineLesson`) monitoring-qadamida shu uch chegarani namuna-qiymat sifatida ko'rsatsin. Shu ko'rinishda muhrlansinmi?

6. 🟡 **KIRISH-KALIT KOD-NOMI.** Brifda kalit-nomi qiyshiq (typografik) apostrof bilan yozilgan; senariy `bolaklar` (ASCII, apostrofsiz — `tolov`/`orindiq` pretsedenti) deb oldi. m4c-02 senariysi bilan AYNAN shu yozuv kelishilsin. Tasdiqlaysizmi?

7. 🟡 **DEMO-RAQAMLAR TIZIMI.** Kun (08:00–20:00) · oddiy javob 0,3–0,6 s · hodisalar 1,5 s / 6 s / 1,2 s / 15 daqiqa / 1 dan 100 / 9 dan 100 · chegara-tugmalari 1 s · 3 s · 10 s · kanonik chegara 3 s → koding `vaqt > 3000` · testlar 8 s va 0,5 s. Hammasi demo-qiymat, bank-fakt emas, s4 ↔ s10 ↔ testlar bir tizimda (22-qonun). Tasdiqlaysizmi?

8. 🟡 **KODINGDA `Date.now()`.** O'tilmagan (87a) — shuning uchun boshlang'ich kodda TAYYOR, bir qatorli izohli, o'quvchi yozmaydi; topshiriq faqat uch `if`. Muqobil: vaqtni o'lchamay faqat holatni tekshirish (`javob.status`) — lekin unda «javob vaqti» o'lchagichi kodda yo'qoladi. Hozirgi shaklni tasdiqlaysizmi?

9. 🟡 **s2 DA «LENTA» BITTA GAPDA.** 4c ning modul-lug'ati (yashil bo'lsa uchadi) «chiqarishgacha» kartasida bitta gap bilan tilga olinadi — dars uni davom sifatida oladi (lenta chiqarishgacha, o'lchagich keyin). 38-qonun (boshqa dars metaforasi taqiq)ga zid emas deb baholandi, chunki bu modulga yagona lug'at. Rozimisiz — yoki «lenta» so'zi ham olib tashlansinmi?

10. 🟢 **s4 PANELI REAL O'LCHOVSIZ.** Panel soxta (demo-kun); real o'lchov faqat s10 kodida (`node tekshir.js`). Ixtiyoriy kuchaytirish: s4 da «Hozir tekshirish» tugmasi o'quvchi saytini brauzerdan real o'lchasa (`fetch` no-cors + vaqt) — WOW kuchayadi, lekin sinf-interneti va `cc-site-url` yo'qligi xavfi bor. Hozirgi (soxta panel) qolsinmi?

11. 🟢 **UY-VAZIFA O'Z SAYTIDA, HAVOLA BO'LMASA — ISTALGAN SAYTDA** (92d). Kartada bitta qator: «Saytingiz bo'lmasa — istalgan saytda». Rozimisiz?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (§99–129 bilan) · MATN_ETALONI (lug'at + 7-B) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2 Batch 3 pasporti/R3) bo'yicha yozildi. Keyingi qadam: pm-metodist SENARIY-KORREKTURA → **[GATE S]** — 14-bo'lim savollari (1–11).*

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-17 (foydalanuvchi avtokontrol-ruxsati asosida, bosh-agent; pretsedent-oila: Batch 2 / M4c-D2 / M4b-D2 avto-GATE S)

1. **App.jsx karta TASDIQ:** title **«Saytingiz hozir ochilyaptimi?»** · sub **«chiqqandan keyin saytni kim o'lchaydi»** (bosh-agent kiritdi).
2. **«O'lchagich» oilasi TASDIQ** (o'lchagich · chegara · signal · chin/quruq; «monitoring» faqat flashcard-10 glossida).
3. **(a) Bosqich-hisoblagich «n/7» TASDIQ** (17-ov (b) to'g'ri o'qildi). **(b) 2 bashorat QOLADI** — pretsedent Batch 2 (M4a-D2, M4-D12) + ETALON 33 «kamida 2» (qabulchi shu band bilan M3-D10/M4-D2 ni qaytargan); 109-6 «maks 1» eskirgan talqin — registr/etalon 33 ustun.
4. **s6 = F12 → Network QOLADI** (M1 CssLesson2 dan tanish, xavfsiz, qaytariladigan; s10 `javob.status` ko'prigi saqlanadi). Slaydda «Kompyuteringizda» birinchi qatorda; mentor-eslatmasida telefon-izohi.
5. **Artefakt MUHR:** `pm-m4c6-signal = { signallar: [{olchov:'ochilish'|'vaqt'|'xato', chegara:son, sabab}×3], savedAt }` — m4c-07 taklifi registr 6-bo'limiga yoziladi (bosh-agent), qurilmaydi.
6. **`bolaklar` ASCII kod-nomi TASDIQ** (m4c-02 bilan aynan).
7. **Demo-raqamlar tizimi TASDIQ** (3 s kanonik ↔ `vaqt > 3000`; 22-qonun).
8. **`Date.now()` boshlang'ich kodda tayyor TASDIQ** (87a; o'quvchi faqat uch `if`).
9. **s2 da «lenta» bitta gapda TASDIQ** (4c modul-lug'ati, §112 ko'prik).
10. **s4 soxta panel QOLADI** (real o'lchov s10 da; sinf-interneti xavfi).
11. **Uy-vazifa: sayt bo'lmasa — istalgan saytda TASDIQ** (92d).
12. Registr yangilanadi (bosh-agent): O'LCHAGICH-PANELI · signal-saralash · o'z Netlify-sayti · zaxira ilgak · artefakt-zanjir.
