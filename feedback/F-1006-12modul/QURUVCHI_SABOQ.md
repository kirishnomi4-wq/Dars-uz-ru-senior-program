# 12-Modul — quruvchi saboqlari (MAJBURIY)

> Har quruvchi / vizual / tuzatuvchi agent topshirig'iga shu fayl qo'shiladi. To'rt manba: (A) 9-Modul pilotlari · (B) 10-Modul pilot ko'rigi · (D) 11-Modul pilot ko'rigi — foydalanuvchining qat'iy qoidalari;
> (C) 12-Modul MD lari, ChatGPT auditi Filtrlari (`NN-FILTR.md`) va GATE M (`GATE_M_JAVOB.md`) — quruvchiga tegishli kelishuvlar. Umumiy qonunga muhrlash — asosiy seansda.

## A, B, D. Oldingi modullar saboqlari — TO'LIQ o'qing

1. `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` (1–18) · `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` (A, B, **C 19–31**) · `feedback/F-1005-11modul/QURUVCHI_SABOQ.md` (**D 32–39**) — uchalasi shu modulga to'liq tegishli.
   U yerdagi atamalar va kalitlar (`pm-m8dN-…`, `pm-m9dN-…`) — O'SHA modullarniki; bu modulda — tayanch 2 va 8 (pastda C).
2. Fidbek rasmlari: `feedback/F-1005-10modul/rasm/F-1005-174-*`, `F-1005-175-*` va `feedback/F-1005-11modul/rasm/F-1006-270-1dars-*.png` — o'z ekran turingizga o'xshashini Read bilan ko'ring:
   foydalanuvchi aynan nimani «jonsiz», «ko'p element», «bo'sh ustun», «tebranish oshib ketgan», «barchasi bo'sh turadimi» degan.
3. Eng muhimlari (unutilsa — ekran RAD): navbatdagi harakat doim ko'rinadi (halqa + **yengil** puls: scale ≤ 1.03, shaffoflik ≤ 0.35, sikl ≥ 2 s; bir guruhda BITTA halqa) · bashorat tanlangach ixcham qator bo'lib qoladi ·
   kartochkalar alohida ekran, Mentorsiz, «Kartani bosing — javob ochiladi» · jonli ekran (kirishda navbat bilan, bosishda narsa uchadi, holat animatsiya bilan) · bo'sh ustun yo'q · ekranda ≤ 3 blok ·
   yakuniy holat bitta natija bloki, 1280×800 ga sig'adi · telefon maketi CHAPDA va o'lchami barqaror (≈170×272) · matnsiz bo'sh chiziqlar yo'q · yashirin bosish yo'q · odamlar real ko'rinishda ·
   ⛶ ishlaydi (`.zoom-on { position: fixed; … }`) · stilsiz element yo'q (`python3 feedback/F-1005-10modul/stilsiz.py <fayl>`) · har ekran «4 savol» (SABOQ 30).

## C. 12-Modul kelishuvlari

- **MD = manba-haqiqat (GATE M 06.10.2026 — tasdiqlangan).** O'quvchi ko'radigan har `uz` satr MD dan so'zma-so'z. «✎», «Izoh (MD)», «Harakat → Vizual o'zgarish», «KOD», «REPO», «Manbalar», «TAYANCHGA SAVOL», «Shubhali joylar», «O'lchov», «GATE M — o'z tekshiruvim» — ko'rsatma, ekranga chiqmaydi.
  «O'qituvchi eslatmasi» — faqat MD aytgan joyda (Mentor rejimi). Matn noqulay tuyulsa — o'zgartirmang, hisobotda «MD ga taklif» (SABOQ 15).
  MD boshidagi «NN-FILTR dan keyingi holat» qatori va matn ichidagi «(NN-FILTR k)» havolalari — nega shunday yozilganining izohi; shubha bo'lsa o'z `NN-FILTR.md` ni oching.
- **MD ↔ SABOQ ziddiyati (vizual).** MD lar 11-Modul pilot ko'rigidan (SABOQ D 32–39) OLDIN yozilgan. Vizual ko'rsatma SABOQ ga zid kelsa — **SABOQ ustun**, matn esa MD dan o'zgarmaydi; har holat hisobotda «MD dan chetlashish (SABOQ N)»:
  - MD «tanlov guruhida har variantda yumshoq halqa» deydi → SABOQ 32: guruhda bitta halqa, yengil puls.
  - MD reja va kirish vizualida «matnsiz kulrang qatorlar / skelet» deydi → SABOQ 33: bo'sh chiziqlar o'rnida haqiqiy mazmun (Mentor misolidagi nomlar, bo'lak nomlari); faqat keyingi ekranning kashfiyoti (javobi) ochilmasin — nima qo'yilganini hisobotda yozing.
    Uzuq chiziqli «to'ldiriladigan joy» (U-041) faqat o'quvchi o'zi to'ldiradigan maydonda qoladi.
  - MD «siluet», «bosh-siluet» deydi (odam, zal) → SABOQ 36: bosh, soch, yuz belgisi, rangli kiyim; iliq ranglar.
  - MD «Ortda qoldingizmi» ni har blokda yozgan → SABOQ 39: darsda bir marta, birinchi blokda.
  - Kod oynasi shartlari → SABOQ 37 (namuna obyekti bilan tekshirish, qatorlar ≤ 70 belgi, shart yiqilsa — nima yetishmayotgani).
- **Atamalar** — `00-MODUL-TAYANCH.md` 2-bo'lim aynan (bir ma'no — bir so'z): «Backend», «Database» (prozada «server», «baza» yo'q) · «hodisa» — darsga qarab bitta ma'no (tayanch 2) · «jonli xabar», «eslatma» («push» — faqat `git push`) ·
  ulanish belgisi yozuvlari «Ulangan» · «Ulanmoqda…» · «Ulanmagan» · «lending» · «asosiy tugma» · «tekshiruv fayli» · agent asbobi — «Antigravity» (o'quvchi matnida «VS Code» yo'q). Taqiqlar — `00-TAQIQLAR.md`.
  Kafolat so'zlari («har doim», «darrov», «100%», «albatta», «hech qachon») yo'q; xulosa «Bu misolda…», «Bu darsda…», «Bizda…».
- **Saqlanadigan natija kalitlari** — tayanch 8 jadvali aynan (`pm-m10dN-…`; maydon nomlari ham; kod qoralamasi `pm-m10dN-code`). Boshqa dars o'qiydigan kalitni o'zgartirmang; kalitga ism, login, telefon yozilmaydi.
  11-Moduldan o'qiladigan kalitlar (`pm-m9d4-final`, `pm-m9d5-prd`, `pm-m9d8-platforma`, `pm-m9d16-pitch`) bo'lmasa ham ekran ishlaydi (o'quvchi o'zi yozadi yoki ikkala trek qatori ko'rinadi).
- **Hook javobi** — MD qanday desa: «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067), olib tashlanmaydi; 11-darsda `QKirish` sof so'rovnoma (J-026).
- **Mentor misoli** — «Maydon Jamoa» (repo `maydon-jamoa`): nom telefon maketida va sahifa tepasida o'z rangida (11-Modul 9.62 yashili — `src/9-Modull` darslaridagi rang bilan bir), logotip yo'q. Namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
  Telefon maketi — 11-Modul ko'rinishi (`src/9-Modull/FoundationDayLesson.jsx`, `FeatureOneLesson.jsx` — faqat ko'rish; kod bo'lagi ko'chirilmaydi, darslar mustaqil).
- **PM keys brendi** (1 — Instagram, 6 — Facebook, 8 — Netflix, 10 — Duolingo, 12 — Uzum): nom o'z rangida, logotipsiz, tanish maket, bosqich gapi Mentorda, sahna bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi (son, matn, mexanika).
  Namuna — `src/6-Modull/PmLesson22.jsx` `AltairMock`, `PmLesson25.jsx` `DeckMock`, 11-Modul 1-dars Starbucks sahnasi (faqat ko'rish).
- **Amaliyot bloklari:** `ScreenBlok` + `QBlok` + `QPrompt`; blok — Mentor misoli, umumiy qolip emas; hammasi o'quvchining o'z repo'sida. `{…}` yonidagi kulrang «masalan: …», oldindan yozilgan qiymat, «Yordam», «Ulgurmasangiz» —
  `QPrompt` / `QBlok` da yo'q: o'z faylingizda kichik o'rovchi bilan, **`src/qolip` ga tegilmaydi**, hisobotda «qolip taklifi». Agentga yoziladigan prompt matni sen-formada (MD aynan) — `lint:til` ogohlantirishi kutilgan, error emas.
  Blok «bajarildi» bayrog'i — faqat oxirgi (tekshiruv) «Bajardim»idan; «Ulgurmasangiz» yo'lida «Davom etish» oldinroq ochilsa ham bayroq qo'yilmaydi (tayanch 9.36 h); yakun sarlavhasi shu bayroqlardan.
  Repo hali ochilmagan — ekranda faqat matn; quruvchi repo yaratmaydi, GitHub'ga, Netlify'ga, Render'ga hech narsa yubormaydi.
- **Trek** — `pm-m9d8-platforma.trek` (`mobil` | `web`): MD dagi trek qatorlari; kalit yo'q bo'lsa — MD aytgan yo'l (tanlov chipi yoki ikkala qator).
- **Yakun** — holatga qarab sarlavhalar (MD dagi hamma holat), belgi ✓ va nishon faqat to'liq holatda; uyga vazifa — `HwCard` (yangi; alohida `.homework.jsx` yo'q); ichki skroll qutisi yo'q.
- **Skelet tuzoqlari** (skelet 05.10 dan beri tuzatilmagan — o'z faylingizda hal qiling): test ustidagi «To'g'ri javobni tanlang» yo'q · `bashorat={!taxmin && …}` ishlatilmaydi ·
  `practice: ou(title)` → `ou(eyebrow)` · `QZ_BG_SHAPES` — darsning o'z atamalari (MD «Fon so'zlari»), emoji va «Frontend/Backend» yo'q · `rgba(255,79,40,…)` → `fon(T.accent)` ·
  `QKod` o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi · global `.mentor` klassi bilan to'qnashmang (dars elementiga o'z prefiksi) · ⛶ (`Zoomable`) telefonda mazmunni yopmasin · `.zoom-on` qoidasi faylda bo'lsin ·
  `HtmlCompiler` faqat birinchi JS faylni ulaydi va tekshiruv 50 ms da async ni kutmaydi (MEXANIZM navbati 11) — ko'p faylli kod oynasida shuni hisobga oling va sinab ko'ring.
  LiveGate sarlavhasi (`tr(LESSON_META.lessonTitle)`), `LESSON_META`, export nomi va palitra — fayl nusxasida allaqachon qo'yilgan.
- **Agent tuzog'i:** Write/Bash `\uXXXX` ni harfga aylantirishi mumkin — kirill va belgilarni to'g'ridan-to'g'ri yozing, `lint:prompt` / `gates` bilan tekshiring. CSS shablon-satri ichida (izohda ham) BACKTIK yo'q.
- **Lokal server** `localhost:5173` ishlab turibdi va boshqa seanslar bilan umumiy — to'xtatmang, qayta ishga tushirmang, portni band qilmang.
- **Hali sinalmagan narsalar («qur» darvozalari — tayanch 9.34–9.44 oxirlari):** haqiqiy telefon, Expo Go, brauzer ko'rinishi, `HtmlCompiler` dan o'qish. Dars fayli MD bo'yicha quriladi; sinov natijasi boshqacha chiqsa, MD va dars keyin birga tuzatiladi — quruvchi buni o'zi «tuzatib» qo'ymaydi.

## E. 12-Modul pilot ko'rigidan — foydalanuvchi fidbeki (07.10.2026, F-1006-368…388)

40. 🔴 **Har bosiladigan variantning o'z chegarasi — guruh atrofida ramka YO'Q** («donavoy», «#GENERALNE»). Variantlar (QKirish), bashorat chiplari, sabab/trek chiplari:
    har biriga yengil accent chegara (chip — border-color accent 0.6; q-variant — inset 1.5px ring), puls navbatma-navbat 2 marta, kattalashishsiz. **D bo'limidagi SABOQ 32 «bir guruhda bitta halqa» bandi bekor** (tebranish yengilligi qoladi).
    Bitta tugma (navbatdagi qadam) — halqa, puls 3 marta, `scale` YO'Q (cheksiz `scale` puls Playwright'da ham «element not stable» beradi). Namuna: `src/10-Modull/WebSocketBasicsLesson.jsx` «ws-chorla».
41. 🔴 **Maketda hech narsa kesilmaydi** (telefon brauzer-sahifa ramkasi ichida pastdan kesilgan edi — «global»). Ramka qat'iy balandlikda bo'lsa — ichki element kichrayadi (sahifadagi telefon `zoom: 0.72`)
    yoki ramka mazmunga moslashadi. Tekshiruv: DOM detektori — chegarali/yumaloq element `overflow: hidden` ota-blokdan chiqib turmasin (desk 1100, 1440 va mob 390, hamma ekran).
42. 🔴 **Taxmin natijasi yashil xulosa qutisi ichida** — birinchi kichik qator: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …» (tanlangan javob qaytarilmaydi); QIzoh ham shu qutining
    oxirgi kichik qatori (ingichka ajratgich). Quti qalin bo'lmasin: kichik qatorlar 12.5–13px. Qolipning `natija` propi ishlatilmaydi (kulrang qator alohida osilib qolardi).
43. 🔴 **Yorliq input ichida** (jadval/forma; 159/2, 8-Modul «bitta varaq» naqshi): doimiy raqam belgisi + qisqa savol placeholder'da; tepada alohida yorliq va tavsif yo'q;
    «masalan» namunalari «Yordam» ichida (Mentor misoli). Tugmalar bir qatorda: asosiy · ikkinchi · o'ngda «Yordam»; ikki tugma bir ishni qilmaydi («Qator tayyor» qatorni yopadi, «+ Yana qator» — yangisini ochadi).
44. 🔴 **Tartib (QTartib) bo'laklari — texnik darslar naqshi**: oq fon, 2px accent chegara, boshida «⠿», Manrope (kod qismi mono), uyalar ≤ 46px. Qolipdagi to'liq accent fonli mono bo'lak — «juda baland».
45. 🔴 **Jadval «ma'lumot» bo'lib, tanlov kartasi «bosiladigan» bo'lib ko'rinsin**: jadval — to'q sarlavha qatori (nom + n / N), katak chiziqlari, kulrang fon, soyasiz; tanlov kartasi — oq, accent chegara, soya.
46. 🔴 **Sahna: bog'langan narsalar bir-biriga tegadi.** Kod kartalari telefon/Backend ustuniga qo'yilmaydi (ustun kengayib, chiziq havoda qolardi) — sahna ostida ikki ustunda.
    Ulanish/so'rov konverti chiziq bo'ylab ko'rinib uchadi (yorlig'i bilan), qabul qiluvchi tugun natijani o'zi ko'rsatadi (qabul — yashil, rad — qizil, bir qator).
47. 🔴 **Bosiladigan tugma ota-blokning pointer capture'i ichida qolmasin**: sudraladigan konteyner `setPointerCapture` qilsa, ichidagi tugmaga click yetmaydi (2-dars 2-ekran — o'quvchi to'xtab qolgan).
    `onPointerDown` da `e.target.closest('button')` bo'lsa capture olinmaydi. Har harakatli tugmani brauzerda HAQIQIY click bilan (force'siz ham) sinang.
48. 🔴 **⛶ oynasi: `.zoomable.zoom-on`** (ikki klassli selektor). Skeletdagi `.zoomable { position: relative }` keyinroq turadi va bir klassli `.zoom-on { position: fixed }` ni bekor qiladi —
    oyna joyidan siljib, ekran chetidan kesiladi (ikkala pilotda bor edi). Tekshiruv: oyna `getBoundingClientRect()` — gorizontal markazda (±2px).
49. **Kartochka halqasi yengil** — ingichka accent chegara, puls 3 marta (10-Modul naqshi); ikki qavat halqa + cheksiz puls «juda oshib ketibdi».
50. **Yakun — texnik darslar standarti**: «Bugungi asosiy fikr» qutisi texnik darsda yo'q (11-Modul FeatureOne kabi). PM darsi uchun — foydalanuvchi qarori kutilmoqda (1-dars F-1006-375).
51. **Yozish oqimi brauzerda oxirigacha, `pageerror` bilan; holatni effektda tiklamang** (F-1006-368: bo'lak almashgan birinchi chizishda eski qiymat yangi shaklga tushib oq ekran berdi — qiymat o'z kaliti bilan saqlansin).
52. **Real prompt amaliyotda**: texnologiya darsida o'quvchi o'z loyihasida kodni ko'radigan prompt ham bo'lsin (masalan, «yozgan fayllaringda … qatorni fayl nomi va qator raqami bilan ko'rsat; kodni o'zgartirma») — F-1006-378.
53. 🔴 **Ko'p maydonli bo'lak — bittadan** (1-dars F-1006-373; 9-Modul SABOQ 9/13 qayta buzilgan edi): «uch foyda» kabi takrorlanuvchi juftlar bir vaqtda BITTA karta («N / 3»), «Saqlash» → natija maketga uchadi,
    keyingisi kirib keladi; saqlanganlar ixcham ✓ qator (bosib tahrirlanadi). Tekshiruv juftga; holat shakli bo'lak bilan birga saqlanadi (51-band).
54. 🔴 **Yakun sarlavhasi har holatda rost**: «hech narsa qilinmagan» holatiga alohida sarlavha («… hali yozilmagan»); qisman bajarilgani saqlanmasa — «boshlandi»/«boshlanmagan» emas, «hali tugamagan».
    «Yig'ildi/ishlaydi» — tegishli qadam bajarilgandan keyingina (1-dars: 3-qadam «Ishga tushirish»).
55. **«Vaqt qolsa» bloki (A2 kabi) o'quvchini ushlab qolmaydi**: «Davom etish» birinchi qadamdan keyin ochiladi; asosiy blokda (A1) — tekshiruvdan oldingi qadamdan keyin (07.10, A2 taklifi rad).
