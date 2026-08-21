# 🧹 KATTA TOZALASH — loyiha-darajasidagi ish ro'yxati

> **Nima uchun alohida fayl.** Bu ishlar bitta darsga tegishli emas — 8–122 faylga
> tegadi va **modullab, alohida kunda** bajariladi. Dars ustida ishlayotganda ular
> ko'tarilmaydi: topilsa — shu ro'yxatga yoziladi, o'sha yerda tuzatilmaydi.
>
> **Tartib** foydalanuvchi tomonidan belgilangan (2026-08-19). Yangi band qo'shilsa —
> oxiriga, tartibni foydalanuvchi o'zgartiradi.
>
> Holat: ⬜ boshlanmagan · 🟡 jarayonda · ✅ tugagan

---

## 1 ⬜ `lint:dark` — 32 ta og'ir/qora interaktiv element (8 dars)

**Qoida tayyor:** `DARS_ETALON` F-29 — ichkaridagi harakat-tugmasi `accent` fon + oq
matn; pastdagi navigatsiya `btn-white-accent`. Ikki holatli tugmada holat farqi
saqlanadi (bajarilmagan = accent · bajarilgan = yashil).

**Detektor tayyor:** `npm run lint:dark` (`dark-lint.mjs`) — 0 topilma bo'lishi shart.

Odatda har darsda **4 ta**: `.btn` · `.lp-done-btn` · `.mstats-reveal` · `.rc-btn`.

Bajarilgan: **m3-01 ✅ (2026-08-20 — to'liq yopildi)** · **m3-03 ✅ (2026-08-20 — haqiqatan)** · m3-04 ✅ · m3-05 (PmLesson8) ✅ · **m3-06 (Props) ✅** · **m3-07 (CrudPractice) ✅** · **m3-08 (ApiGet) ✅** · **m3-09 (ApiPost) ✅** · **m3-11 (Router) ✅** · **m3-13 (BuildSite) ✅**

> **2026-08-20 — detektor kuchaytirildi va 8 yopilgan dars qayta yurgizildi.**
> `dark-lint` endi **modifikator-qoidalarni** (`.on`, `.active`, `.selected`, `.is-*`)
> asosiy qoida bilan birga baholaydi (F-0820-73): bosiladigan element ko'pincha ikki
> qoidaga bo'linadi — xulq asosiysida (`cursor: pointer`), quyuq fon esa modifikatorida.
> Shu tufayli m3-11 dagi `.navlink.on` topildi. **Yangi detektor 8 darsda YANGI signal
> bermadi** — quyidagilar avvaldan bor edi:
>
> | Dars | Topilma | Izoh |
> |---|---|---|
> | **m3-01 ReactIntro** | `.mstats-reveal` · `.rc-btn` + 2 inline `#1A2436` | «qisman» deb belgilangan — mos |
> | **m3-03 FirstComponent** | `.lp-done-btn` · `.mstats-reveal` · `.rc-btn` | 🔴 **✅ deb belgilangan, lekin 3 ta turibdi** — 3-band bilan birga qayta yuriladi |
> | m3-04 StateEffect | — | ✅ 2026-08-20 da Agent-rozetkasi tozalandi, endi **0** |
> | m3-05 · m3-06 · m3-07 · m3-08 · m3-09 | — | 0 ✅ |

> **🆕 F-0820-57 — detektorning UCHINCHI ko'r nuqtasi yopildi.** `lint:dark` faqat CSS'ni
> o'qir edi; qoida JSX ichida `style={{ background: T.ink }}` bo'lib turgan bo'lsa —
> ko'rmasdi. Endi inline-skan ham bor. **Darrov ikkita yangi topilma berdi:**
> `m3-06:1539` (tuzatildi) va **`m3-04:1443` — o'sha `.ai-badge` inline qorasi, HALI TURIBDI**
> (m3-04 sikli yopilgan edi). Bir qatorlik tuzatish: `style={{ background: T.ink }}` olib
> tashlansa yetadi — `.ai-badge` klassining o'zi allaqachon moviy.
>
> **Jonli-sessiya infra istisnosi:** `live-badge` ichidagi «Kodni katta ko'rsatish» tugmasi
> (`background: LT.ink`) **122 faylda bir xil** va faqat mentorga ko'rinadi — bitta darsda
> tuzatilmaydi, shuning uchun detektorda ataylab istisno qilindi. U shu bandning ichida qoladi.

> **Eslatma — PmLesson9 (2 ta) va PmLesson10 (4 ta):** detektor topgan, lekin **ataylab tegilmagan**. O'sha darslar o'z siklida kelganda, boshqa tuzatishlar bilan birga yopiladi. PM darslarida «accent» = **`#5B3DE6`** (binafsha), to'q sariq emas.
Qolgan: 3-Modulning 8 ta darsi, keyin 4 · 4a · 4b · 4c · 5 · 6-modullar.

---

## 2 ⬜ Umumiy `theme` fayli — avval AUDIT-SKRIPT

`const T = { … }` **122 ta faylda takrorlangan**, umumiy theme fayli **yo'q**.
Bitta rangni o'zgartirish = 122 faylni tahrirlash.

**Birinchi qadam — birlashtirish EMAS, solishtirish.** Audit-skript yoziladi:
122 ta `T` obyektini o'qib, kalit-qiymatlarni jadval qiladi va farqlarni ko'rsatadi.

> **Yondosh muammo — primitivlar ham takrorlanadi.** Faqat `T` emas: har dars o'z
> tugmalarini qo'lda qayta yozadi. m3-07 da bitta «qo'shish» tugmasi **5 xil** nusxada
> chiqdi (oq `.chip` · qora inline `<span>` · accent `.chip-on` · `.gchip` · yana `.chip`) —
> dars ichida `AddBtn` primitiviga birlashtirildi (2026-08-20). Umumiy `theme` fayli
> ko'tarilganda `AddBtn` kabi primitivlar ham o'sha yerga chiqadi.

*Sabab:* darslar o'z `T` siga **mahalliy qo'shimchalar** kiritgan (masalan m3-01 dagi
`accentRgb`, `accentLite`, m3-03 dagi `successRgb`). Ko'r-ko'rona birlashtirish
ularni yo'qotadi. Farqlar tekislanmaguncha birlashtirilmaydi.

---

## 3 ✅ m3-01 · m3-03 · m3-04 ni YANGI skaner bilan qayta yurgizish — YOPILDI (2026-08-20)

Ular tekshirilgan paytda `dark-lint.mjs` hali yo'q edi va qo'lda skanim
**buzuq parser** bilan ishlagan: `${T.ink}` ning yopuvchi qavsi qoidani yarim
o'qitgan, natijada token orqali berilgan quyuq fonlar ko'rinmagan
(*birinchi skan 12 ta topdi, tuzatilgani 28 ta*).

Ya'ni o'sha darslarning hisoboti **to'liq emas**. `npm run lint:dark` bilan
qaytadan yuritilib, qolgan topilmalar yopiladi.

**✅ 2026-08-20 · YAKUN:** uchalasi ham `lint:dark` **0**. m3-01 (til 6🔴 + dark 4) va m3-03
(dark 3) shu kuni yopildi; m3-04 tekshirilganda allaqachon toza edi — quyidagi yozuv eskirgan.

**Eski yozuv:** ro'yxatga **m3-04 ham qo'shildi** — inline-skan qo'shilgach
unda ham yangi topilma chiqdi (`:1443`). Ya'ni «yopilgan» dars ham yangi darvoza bilan
qayta yuritilishi kerak. Joriy holat: m3-01 🔴1 · m3-03 🔴3 · m3-04 🔴1 · m3-06 ✅ toza.

---

## 4 ⬜ F-51 — kursiv+accent sarlavha (loyiha darajasidagi qaror)

Sarlavhalarda «serif + kursiv + to'q sariq» naqshi deyarli **har ekranda**
ishlatiladi (m3-01: 20 ta · m3-04: ~18 ta). Hamma sarlavha bir xil baqirsa —
hech biri ajralmaydi, urg'u ma'nosini yo'qotadi.

Bu **butun kurs uslubi**, bitta darsda o'zgartirilmaydi. Qaror qabul qilinsa —
tushuncha-o'qidagi ~6–7 ekranda qoldirilib, qolganlarida rang olib tashlanadi
(m3-01 da `.italic-q` varianti sinab ko'rilgan).

---

## 5 ⬜ F-52 / F-53 — soya · radius · rang shkalasi

| O'lchov | Hozirgi holat (namuna: m3-04) |
|---|---|
| Neytral soya | **41 e'lon / 34 xil qiymat** → 3 pog'ona bo'lishi kerak |
| Radius | **18 xil qiymat** → 4 pog'ona |
| Noyob rang | **101 ta · 9 oila** |

«Har element boshqa balandlikda suzadi» tuyg'usining texnik ildizi.
m3-01 uchun «miks» varianti sifatida tayyorlangan va **rad etilgan** —
qaytadan ko'rilishi kerak.

---

## 6 ⬜ PM darslari RU tarjimasi — PmLesson8 · PmLesson9 · PmLesson10

Uchala PM darsi **butunlay o'zbekcha**: `tr({ uz:…, ru:… })` — **0 ta**, kirill harf — **0 ta**.
Solishtirish uchun: `ReactStateEffectLesson` da **564** ta `ru:`.

*Nega muhim:* `coddycamp-3modul.vercel.app` demosi **UZ + RU** deb berilgan. Sinovchi
RU ga o'tsa — React darslari ruschaga o'tadi, PM darslari o'zbekcha qoladi.

*Nega alohida kunga:* bu **tarjima ishi**, dizayn emas. Dizayn sikliga aralashtirilmaydi.
Uchalasi **birga** qilinadi (bir xil atama-lug'at), mexanizm: `RU_I18N_SPEC.md`.

---


---


---

## Ro'yxatga tushmaydigan, lekin qaror kutayotgan

- **CODE STRIKE / uy-vazifa binafsha bannerlari** (`#1B0F3F`, `#3D1F86`) —
  **98 ta darsda**, uchinchi vizual olam. Foydalanuvchi: «TEGMA, qaror keyin».

---

## 7 ⬜ `.hint` uzuq chizig'i — m3-06 va m3-07

`.hint` **ma'lumot-quti** (tashxis/tushuntirish matni), lekin chegarasi `1.5px dashed`.
16-qonun bo'yicha uzuq chiziq FAQAT uchta holatda: bo'sh joy · joylash zonasi ·
to'ldiriladigan maydon. Ma'lumot-qutisiga tekis chegara kerak.

| Dars | Holat |
|---|---|
| m3-04 StateEffect | ✅ `1px solid ${T.line}` — allaqachon tuzatilgan |
| **m3-06 Props** | ✅ 2026-08-20 tuzatildi |
| **m3-07 Crud** | ⬜ `1.5px dashed` — 🔴 **TEGMA:** boshqa sessiya ishlayapti |
| m3-11 Router | ✅ 2026-08-20 tuzatildi |
| m3-13 BuildSite | ✅ 2026-08-20 tuzatildi |
| m3-08 ApiGet | ✅ 2026-08-20 tuzatildi |

Tuzatish bir qatorlik. `.frame-dash` **tegilmaydi** — u haqiqiy placeholder
(«yuqoridan bittasini tanlang»), ya'ni 16-qonunga to'g'ri mos.

---

## 8 ⬜ `RoCard` darslararo har xil — 2-band (theme) ostiga

Bitta modulda o'yin-kartochkasi uch xil ko'rinishda:

| Dars | Kartochkada bor |
|---|---|
| m3-06 Props | `robar` (yoqtirish chizig'i) · `rothumb-play` **▶** · `xray` qatlami |
| m3-08 ApiGet | ikkalasi ham **yo'q** — faqat rasm + nom + statistika |
| m3-04 StateEffect | oraliq variant |

O'quvchi uchun bu bitta sayt bo'lishi kerak (robo-games) — kartochka darsdan darsga
o'zgarmasligi lozim. Bu **theme-band** ishi (2-band): `T` birlashtirilganda `RoCard`
ham bitta manbaga chiqariladi. Alohida tuzatilmaydi — aks holda 122 fayl bo'ylab
yana bir marta qo'lda yurish kerak bo'ladi.

---

## 9 ✅ GameCard palitrasi — Variant D — 3-MODULDA YOPILDI (2026-08-20)

O'yin kartochkalari ikki xil palitrada yashaydi: **Variant D** (pastel, brend oralig'ida) va
**eski to'yingan** (`#FF9DBF`, `#7EA6F4`, `#F4D06A` — oltin/neon tomonga chiqib ketadi).

Variant D ✅: `ReactFirstComponentLesson` · `ReactPropsReuseLesson` · `ReactStateEffectLesson` ·
**`ReactCrudPracticeLesson`** · **`ReactApiPostLesson`** · **`ReactRouterPracticeLesson`** *(2026-08-20)*

**✅ Ikkalasi ham yopildi (2026-08-20):** `ReactApiGetLesson` 7/7 · `ReactProjectDayLesson`
**6/6** — oldingi raundda 4/6 qilingan ekan, qolgan ikkitasi: Jeep Wrangler quyuq grafit
`#6B7280,#1F2430` → iliq grafit `#C6BFB8,#A79E95` · Mini Cooper to'yingan oltin
`#F4D06A,#C99B2E` (T.accent bilan raqobatlashardi) → siyohrang `#D2C0EE,#B6A0E2`.

> Qolgan modullar (1 · 2 · 4 · 5 · 6 · 7) hali ko'rilmagan.

> m3-13 (`ReactBuildSiteLesson`) 2026-08-20 da yopildi — u yerda palitra o'yin-kartochkasi
> emas, **«Yetkaz» taom-kartalari** edi: pitsa `#E6B9A3 → #C98D74` (terrakota-g'isht —
> to'q sariq EMAS, dars accenti bilan raqobatlashmasin), burger `#EFD9A8 → #D6BC85`,
> lavash `#CFD8B2 → #B0BC90` (sage), cola `#BAC4EC → #98A6DC`.

> m3-09 da palitraga **Robo Race** ham qo'shildi (`#F0C9B4 → #D8A184`, shaftoli→terrakota):
> u `GAMES` da umuman yo'q edi va `RoCard` zaxira to'q ko'k-kulrangiga tushardi.

**Lug'at-manba:** `ReactPropsReuseLesson.jsx:848–858` — 8 o'yinning hammasi bor
(Bee Swarm = sage `#CFD8B2 → #B0BC90`, oltin EMAS). Bitta darsda ~8 qator, lekin
**bir kunda hammasi**: yarim ko'chirilgan palitra moduldagi kartochkalarni ikkiga bo'lib qo'yadi.

---

## 10 ⬜ RU tomonida «Вы» / «вы» — butun-kurs konvensiya savoli

Ruscha matnda murojaat shakli **fayldan faylga har xil**:

| Fayl | «Вы» | «вы» |
|---|---|---|
| `ReactApiPostLesson` (m3-09) | **33** | 2 |
| `ReactStateEffectLesson` (m3-04, etalon) | 13 | 13 |

Ruscha me'yorda bosh harfli «Вы» — **shaxsiy murojaat** (xat, ariza) belgisi;
o'quv matnida odatda kichik «вы» ishlatiladi. Hozir kurs ikkala shaklni ham
ishlatadi va **bitta fayl ichida** ham aralashadi.

*Nega alohida kunga:* bu **49+ darsga** tegadigan konvensiya. Bitta darsda
tuzatilsa — qolganlari bilan farq kattalashadi, yaxshilanmaydi. Avval qaror
(«Вы» yoki «вы»), keyin bitta sweep. Mexanizm: `RU_I18N_SPEC.md`.

**Qaror kutilmoqda — hozircha hech qayerda tegilmaydi** (2026-08-20, m3-09 auditida topildi).

---

## 9 ⬜ 111-QONUN SAVOLI — PmLesson9 11/16 o'ng ustuniga «4 sinov» ro'yxati

**Holat:** 2026-08-20 da 11/16 (`ScreenCoding`) ning o'ng ustuni deyarli bo'sh edi
(chapda 8 blok, o'ngda 1 ta). **A varianti** qo'llandi — `StudentPracticePulse` va
`MentorPracticeStats` o'ngga, launch-karta ostiga ko'chdi (yangi kontent qo'shilmadi).

**Ochiq qolgan g'oya (C varianti):** o'ng ustunda o'quvchi kodi **qaysi 4 sinovdan**
o'tishini oldindan ko'rsatish. Foydasi aniq — o'quvchi nima tekshirilishini biladi.

**Nega darrov qilinmadi:** bu **yangi kontent**, ya'ni 111-qonun savoliga tushadi —
*«bu bo'lmasa, o'quvchi ekran ma'nosini tushunmay qoladimi?»* Javob hozircha **YO'Q**:
sinovlar kod oynasining o'zida ko'rinadi. Shubhada — qo'shilmaydi.

**Qaror kimda:** foydalanuvchi. Qo'shilsa — 111-b bandi bo'yicha har qatori vazifa
aytishi shart (sinov nomi + kutilgan natija), shunchaki ro'yxat bo'lmasin.


---

## 11 ⬜ «daftaringiz» — 6 fayl (M5 · M6 · M7)

`til-lint` ga **88-qoida** qo'shildi (`daftar-referenti`, F-0820-79): o'quvchining
daftariga ishora qilinmaydi — unda daftar bo'lmasligi mumkin. Taqiq 2026-07-29 dan beri
kuchda edi, qoidasi esa yo'q edi.

⚠️ **Bu qoida BUGUNDAN boshlab quyidagi 6 faylda `lint:til` ni qizartiradi** — o'sha
modullar ustida ishlayotgan seans buni kutilmagan regressiya deb o'ylamasin:

| Fayl | Qator |
|---|---|
| `5-Modull/BotFeedbackIterationLesson.jsx` | 2526 |
| `5-Modull/BotStatefulMemoryLesson.jsx` | 2375 |
| `6-Modull/AgentArchitectureLesson.jsx` | 2244 |
| `6-Modull/ArchPatternsLesson.jsx` | 2291 |
| `6-Modull/ClaudeSkillsLesson.jsx` | 2375 |
| `7-Modull/PmLesson30.jsx` | 593 |

Beshtasi bir xil naqsh: uy-vazifa kartasining `place={{ uz: 'daftaringizda' }}` propsi.
Tuzatish bir so'zlik, lekin **modul chegarasidan tashqarida** — o'sha modul siklida
qilinadi. Namuna: `MATN_KORPUS` §155.

> **Qoida ATAYLAB tor:** faqat egalik shakli («daftaringiz/daftaringda»). «daftar»
> so'zining o'zi qonuniy — M5 da botning xotira-metaforasi, PM darsida vidjet nomi.
> Keng variant sinab ko'rilgan: 24 faylda 190 topilma, deyarli hammasi yolg'on.

---

## 12 ⬜ AUDIO-QATLAM TAQDIRI — 111 dars, loyiha-qarori kutilmoqda

**Topilgan joy:** m4-01 `DataIntroLesson` auditi (F-0820-102, 2026-08-20).
**Foydalanuvchi qarori:** TEGILMAYDI — bu savol-band, dars sikllarida hal qilinmaydi.

**Fakt (o'lchangan, m4-01 misolida):**

```
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null,
                          waitingFor: null, triggerEvent: () => {}, replay: () => {},
                          toggleMute: () => {} });
```

Ya'ni audio dvigateli **butunlay o'chirilgan stub**. Shunga qaramay har darsda
`audioText` / `audioOk` / `audioWrong` matnlari to'liq yozilib turadi — faqat m4-01 da
**22 ta chaqiruv, ~40 qator matn**. Ular:

- hech qachon ijro etilmaydi (`triggerEvent` — bo'sh funksiya);
- **faqat o'zbekcha** — RU juftligi yo'q, ya'ni UZ-RU pariteti bu qatlamni hisobga olmaydi;
- `lint:til` ularni **tekshiradi** va topilma beradi (m4-01 da 3 tadan 2 tasi shu qatlamda edi).

**Savol (javob kutadi):**
1. Audio dvigateli qaytadimi? Agar HA — matnlar qoladi, lekin **RU juftligi** kerak bo'ladi
   va `lint:til` qamrovi rasman e'lon qilinadi.
2. Agar YO'Q — 111 darsdan `audioText`/`audioOk`/`audioWrong` + `useAudio`/`getAudioEngine`
   + `audioState` propi olib tashlanadi. Bu **8+ fayldan ancha katta** ish, alohida kun.

**Hozircha:** hech qayerda tegilmaydi. Yangi dars quriladigan bo'lsa — mavjud naqsh
takrorlanadi (holat o'zgarmaguncha izchillik muhimroq).

### 🆕 UCHINCHI OQIBAT — O'LIK TTS-MATN YOLG'ON LINT-SIGNALI BERADI (F-0820-172)

**Manba:** 2-sessiya nomzodi ⑤ (m4-04 auditi). **QABUL — alohida band emas, shu bandning
uchinchi oqibati:** ildiz bitta (audio o'chirilgan, matnlar qolgan), yechim ham bitta.

**Fakt:** `useAudio([{ text: … }])` satrlari o'quvchiga **hech qachon ko'rinmaydi**, lekin
`til-lint` ularni **sanaydi**. m4-04 da qator **1243** shunday: `registr-aka-brat` +
`professional` topilmasi — ikkalasi ham **o'lik matnda**. Auditor har safar tekshirib,
«yolg'on signal» deb qo'ldan o'tkazishi kerak. m4-04 da **15 ta** `useAudio([{ id` bloki.

**Bu seansdagi dalil:** m4-01 · m4-03 · m4-05 · m4-06 da ham til-lint topilmalarining
bir qismi audio-matnda edi — masalan m4-06 F-146 (`ekran-nomi-tarjimasi`) **ikki** joyda
chiqdi: biri Mentor (tirik), biri audio (o'lik). Ikkalasi ham tuzatildi, chunki qaysi biri
tirikligini ajratish tuzatishdan qimmatroq edi.

**Ikki yo'l (qaror kutilmoqda) — 12-bandning asosiy savoliga bog'liq:**
1. **Audio qaytmasa** → matnlar o'chiriladi, muammo o'z-o'zidan yo'qoladi.
2. **Audio qaytsa** → matnlar qoladi va **RU juftligi** kerak bo'ladi; u holda
   `til-lint` ularni **tekshirishi kerak** — ya'ni istisno qilish **noto'g'ri** bo'lardi.

🔴 **Shuning uchun `til-lint` ga `useAudio(` istisnosini HOZIR qo'shish RAD ETILADI:**
u 2-variantda zarar keltiradi (tekshirilmagan o'quvchi-matni paydo bo'ladi) va 1-variantda
keraksiz (matn umuman qolmaydi). Istisno — **vaqtinchalik yamoq**, ildiz esa shu bandda.

---

## 13 🟡 `PmLesson11` IPUCHA-ZINAPOYASI + RESCUE-KLAPANI — texnik darslarga ko'chirilsinmi?

**Topilgan joy:** m4-02 `PmLesson11` auditi (2026-08-20). **Bu nuqson emas — yaxshi g'oya.**
Foydalanuvchi qarori: PM-to'lqinni kutmasin, alohida band bo'lsin.

**Naqsh (`src/4-Modull/PmLesson11.jsx`, Screen4):**

```js
const TIP1_SEC = 40,  TIP1_TRY = 3;   // ipucha chiqadi
const TIP2_SEC = 110, TIP2_TRY = 8;   // darvoza-klapan ochiladi
```

Ikki bosqich, **ikki xil o'lchov bilan**:

1. **Ipucha-zinapoyasi.** 40 soniya YOKI 3 ta natijasiz urinishdan keyin aniq ipucha
   chiqadi — va u **umumiy** emas, **navbatdagi** qadamni aytadi:
   «💡 Hali sinalmagan tugma bor: 🎧 … — uni ham yoqib ko'ring.»
2. **Rescue-klapan (darvoza-klapani).** 110 soniya YOKI 8 urinishdan keyin `NavNext`
   **ochiladi**: «Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.»
   Ya'ni o'quvchi ekranda **qamalib qolmaydi**.

🔴 **Eng nozik qismi — taymer bosishga BOG'LIQ EMAS** (M3-D10 saboqi, kod-izohda yozilgan):
u faqat ekran ochiq turganda yuradi. Ikkinchi o'lchov esa — **yangi kashfiyot bermagan**
urinishlar soni (`if (!yangi && !ochdi) setTries(t => t + 1)`), ya'ni to'g'ri yo'ldan
ketayotgan o'quvchi hech qachon «tiqilib qolgan» deb belgilanmaydi.
Mentor rejimida taymer umuman ishlamaydi (`if (done || isMentor) return`).

**Nega qimmatli.** «Davom etish» qulflangan har ekran — potentsial **o'lik nuqta**.
Texnik darslarda bunday qulf ko'p (m4-01 `DataIntroLesson` da: s2 · s3 · s5 · s6 · s6b ·
s7 · s8 · s10 · s11 · s13 · s14 · s15 — **12 ta**), lekin **birortasida ham** na ipucha,
na klapan bor: o'quvchi topa olmasa ekranda qoladi va yordam so'rashdan boshqa yo'l yo'q.

**Savol (qaror kutilmoqda):**
1. Naqsh **umumiy qonunga** aylantirilsinmi (`DARS_ETALON` yangi raqam) — «qulflangan
   har ekranda ipucha-zinapoyasi va klapan bo'lishi shart»?
2. Agar HA — chegaralar (40/3 · 110/8) universalmi yoki ekran-turiga qarab o'zgaradimi
   (test · sudrash · koding)?
3. Qamrov: faqat yangi darslarmi, yoki mavjud 111 darsga sweep? (Ikkinchisi — alohida kun.)

**Hozircha:** hech qayerda ko'chirilmaydi. m4-01 **etalon** bo'lgani uchun, qaror ijobiy
bo'lsa **birinchi navbatda o'sha** oladi, keyin qolganlari.

---

## 14 ⬜ `INLINE_KEYS` O'LIK KALITLARI — 6 fayl · 18 kalit (M1 · M2 · M3)

**Topilgan joy:** m4-05 `RoutingLesson` sikli, D3 darvozasi yozilgach butun repo bo'ylab
yurgizildi (2026-08-20). **Tuzatilmadi — ro'yxat.**

**Darvoza:** `lint:jsx` · `INLINE_KEYS ↔ SCREEN_META` bandi (F-0820-135).

**Nuqson nima.** `INLINE_KEYS` — serverga yuklanadigan javob-kalitining bir qismi
(`answerKey`). Kalit uchta manbadan biriga mos kelishi shart: (1) `scored: true` ekranning
id'si · (2) `submitAnswer(…, '<nom>', …)` ga uzatiladigan literal. Mos kelmasa — kalit
serverga yuboriladi, lekin hech qachon ishlatilmaydi: **esbuild toza, brauzer toza,
jonli-ball esa jimgina noto'g'ri.**

| Fayl | O'lik kalitlar | Izoh |
|---|---|---|
| `1-Modull/DeployLesson.jsx` | `s3` `s4` `s5` `s7` `s8` `s9` `s11` | 🔴 **tuzilma-qayta-qurilish izi, 7 kalit** — ekran-tuzilmasi bir marta qayta qurilgan, kalitlar eskisi bilan qolgan. Eng og'iri; alohida ko'rib chiqiladi |
| `2-Modull/PmLesson5.jsx` | `s8` `s9` `s11` `s12` | |
| `2-Modull/PmLesson4.jsx` | `s8` `s10` `s11` | |
| `1-Modull/GitLesson.jsx` | `s12` `s13` | |
| `1-Modull/PmLesson1.jsx` | `s6` | |
| `3-Modull/ReactApiGetLesson.jsx` | `s15` | 3-Modul yopilgan — qayta ochish qarori kerak |

**Jami: 6 fayl · 18 kalit** (o'lchangan **2026-08-20**, `jsx-lint` barqaror versiyasi bilan;
repo bo'ylab shu banddan **19** chiqadi — 19-si m4-10, u pastda istisno qilingan).
M1 · M2 · M3 modullariga tegadi, ya'ni **modul chegarasidan
tashqarida** — dars-siklida ko'tarilmaydi.

**QAMROVDAN TASHQARIDA (ataylab):** `4-Modull/FullstackConnectPracticeLesson.jsx` → `s16`.
U **faol navbatda** (m4-10), o'z dars-siklida auditi bilan birga hal qilinadi —
`PIPELINE_STATE` ga eslatma yozilgan. `4-Modull/RoutingLesson.jsx` → `s15` esa m4-05 ning
D1 to'plami ichida yopiladi.

**Savol (qaror kutilmoqda):**
1. Bu kalitlar shunchaki **o'chirilsinmi**, yoki har biri uchun «bu ekran ilgari ball
   berarmidi?» deb tekshirilsinmi (ya'ni nuqson kalitdami yoki `scored` bayrog'idami)?
2. `DeployLesson` ning 7 kaliti — bitta qayta-qurilish izi bo'lsa, u alohida ko'riladi.
3. 3-Modul yopilgan: `ReactApiGetLesson` uchun qayta ochish arziydimi?

---

## 15 ⬜ v18 CSS QATLAMI — KO'CHIRMA ORTIQCHASI (nomzod ①, TUZATILGAN shakl)

**Manba:** 2-sessiya (m4-04 auditi) nomzodi. **Egasi tomonidan qabul qilindi, lekin
DA'VO TUZATILDI** — F-0820-167. **O'lchangan: 2026-08-20.**

🔴 **Nomzodda «o'lik CSS» deyilgan edi — o'lchov buni RAD ETDI.** Sanab o'tilgan klasslarning
**birortasi ham repo bo'ylab o'lik emas**; `.ai-code` · `.ai-line` · `.dbg-code` esa hatto
faol ishlatiladi. Haqiqiy muammo boshqa: **v18 CSS qatlami har darsga BUTUNLAY ko'chiriladi**,
shuning uchun har fayl o'zi ishlatmaydigan qoidalarni ham olib yuradi.

| Klass | CSS'da e'lon (fayl) | Jami ishlatilish | **Ishlatilmagan fayl** |
|---|---|---|---|
| `.acu-eyebrow` | 49 | **1** | **48** |
| `.delay-4` | 47 | **1** | **46** |
| `.qz-wm` | 44 | 24 | **21** |
| `.gchip` | 27 | 29 | **12** |
| `.ai-code` | 36 | 35 | **10** |
| `.ai-line` | 36 | 79 | **10** |
| `.dbg-line` | 18 | 10 | **8** |
| `.dbg-code` | 18 | 10 | **8** |

**O'lchov usuli:** `<style>{…}</style>` bloki ajratiladi; klass CSS'da e'lon qilinganu
JSX qismida umuman uchramasa — «shu faylda o'lik». Skript: `scratchpad/deadcss.mjs`.

**Ildiz-sabab — 2-band** (`Umumiy theme fayli`). Har dars o'z CSS'ini qayta yozgani uchun
qatlam nusxalanadi. Klasslarni birma-bir o'chirish **noto'g'ri yechim**: keyingi ko'chirmada
qaytadan paydo bo'ladi. **Shuning uchun bu band 2-bandga bog'liq va undan oldin
bajarilmaydi.**

**Savol (qaror kutilmoqda):**
1. 2-band (umumiy `theme`/CSS moduli) yechilgunicha bu band **kutadimi**?
2. Yoki oraliq qadam: darsdan CSS chiqarilmasa ham, **ko'chirma-qatlamning o'zi**
   bir joyda saqlanib, `import` bilan qo'shilsinmi?
3. `.acu-eyebrow` (49 da e'lon, 1 da ishlatilgan) — bu **bayram-qatlamining** qoldig'imi
   yoki hech qachon ulanmaganmi? Alohida tekshiruv arziydi.

---

## 16 ⬜ `QuestionScreen` `idx` PROPI — ISHLATILMAYDI VA INDEKSGA MOS EMAS

**Manba:** 2-sessiya nomzodi ②. **QABUL** — F-0820-168. **O'lchangan: 2026-08-20** (m4-01 etalonida).

`QuestionScreen` `idx` ni **destrukturizatsiya qiladi, lekin tanasida umuman
ishlatmaydi** (butun komponentda `idx` atigi **1 marta** — e'lonning o'zida).
Chaqiruvlar esa unga qiymat berib turadi.

**Yomonlashtiruvchi holat — qiymatlar HAM noto'g'ri.** m4-01 `DataIntroLesson`:

| Chaqiruvdagi `idx` | Haqiqiy `SCREEN_META` indeksi |
|---|---|
| `idx={4}` | 4 ✓ (tasodifan) |
| `idx={9}` | **11** ✗ |
| `idx={12}` | **14** ✗ |

Ya'ni prop **ishlatilmaydi**, ishlatilganda ham **noto'g'ri ko'rsatardi**. Etalonda 3 ta.

**Nega KATTA_TOZALASH:** naqsh 4-Modul bilan cheklanmaydi — `QuestionScreen` deyarli har
texnik darsda bor. Bitta darsda o'chirish boshqalarda qoldiradi.

**Savol:** prop **o'chirilsinmi** (eng sodda), yoki `screen` dan **hisoblansinmi**
(kelajakda kerak bo'lsa)? Ikkinchisi tanlansa — u holda u **ishlatilishi** ham kerak,
aks holda muammo qaytadi.

### 15-band — TO'LIQ O'LCHOV (2-sessiya nomzodining 20 klassi, 2026-08-20)

Yuqoridagi 8 klass boshlang'ich namuna edi. Nomzodning to'liq ro'yxati o'lchandi:

| Klass | E'lon (fayl) | Ishlatilish | **O'lik-fayl** |
|---|---|---|---|
| `.acu-eyebrow` | 71 | 2 | **70** |
| `.delay-4` | 49 | 1 | **48** |
| **`.qz-logo`** | 42 | **0** | **42** |
| `.frame` | 84 | 1327 | 33 |
| `.qz-brand` · `.qz-wm` · `.qz-wm-h` | 45 | 24 | 22 (har biri) |
| `.ai-code` | 49 | 39 | 20 |
| `.ai-line` | 49 | 98 | 20 |
| `.gchip` | 48 | 73 | 14 |
| `.qz-bolt` | 41 | 30 | 11 |
| `.dbg*` oilasi (7 klass) | 18 | 9–11 | 8–9 (har biri) |
| `.rc-open` | 69 | 209 | 6 |

**JAMI: 396 ta «klass × fayl» o'lik juftligi.**

🔴 **Repo bo'ylab TO'LIQ o'lik — atigi BITTA: `.qz-logo`** (42 faylda e'lon, **0** marta
ishlatilgan). Qolgan hammasi tirik — faqat noto'g'ri joyda. Ya'ni nomzodning «o'lik CSS»
atamasi **bitta klass** uchun to'g'ri, qolgan 19 tasi uchun **ko'chirma-ortiqchasi**.

**Ikki xil ish, ikki xil yechim:**
1. **`.qz-logo`** — haqiqatan o'lik, 42 fayldan **o'chiriladi**. Bu 2-banddan mustaqil,
   hoziroq bajarilishi mumkin.
2. **Qolgan 395 juftlik** — 2-band (umumiy CSS moduli) yechilmaguncha tegilmaydi:
   birma-bir o'chirish keyingi ko'chirmada qaytadan paydo bo'ladi.

**Skript:** `scratchpad/deadcss.mjs` (klass ro'yxati o'zgartirilib qayta yurgiziladi).

---

## 17 ⬜ RU TUGMA-MATNI — «✅ Bajardim» ning TO'RT VARIANTI (47 fayl)

**Manba:** 2-sessiya nomzodi ⑤ (m4-13). **QABUL — F-0820-179. O'lchangan: 2026-08-20.**

UZ tomonda bitta matn — `'✅ Bajardim'` (**47 fayl**). RU tomonda **to'rt xil**:

| RU variant | Nechta | Muammo |
|---|---|---|
| `'✅ Выполнил'` | **37** | 🔴 faqat **erkak** shakli — sinfning yarmini noto'g'ri jinsda ataydi |
| `'✅ Выполнил(а)'` | 6 | qamrovli, lekin tugmada qavs g'ijim |
| `'✅ Готово'` | 3 | ✅ jinssiz, qisqa, tabiiy |
| `'✅ Выполнили:'` | 1 | umuman boshqa ma'no (ko'plik, ro'yxat sarlavhasi) |

**QAROR: hamma joyda `'✅ Готово'`.**

🔴 **Farqlanadigan juftlik SAQLANADI** — ular ikki xil rol:

| Rol | UZ | RU |
|---|---|---|
| Tugma (o'quvchi bosadi) | `✅ Bajardim` | **`✅ Готово`** |
| Keyingi holat (natija) | `✓ Bajarildi — ustozni kuting` | **`✓ Выполнено — ждите наставника`** |

Ya'ni «Выполнено» **o'chirilmaydi** — u holat-matni, tugma emas.

**Nega KATTA_TOZALASH:** 47 faylga tegadi, dars siklida ko'tarilmaydi. Bitta darsda
o'zgartirilsa modul ichida ikki xil tugma paydo bo'ladi.

**Bog'liq:** 10-band (RU «Вы»/«вы» konvensiyasi) — ikkalasi ham **RU-ovoz** masalasi,
birga bajarilsa mantiqan to'g'ri.

**O'lchov buyrug'i:**
`grep -rho "ru: '✅ Выполнил[^']*'" --include=*.jsx src/ | sort | uniq -c`

---

## 18 ✅ 🚧 TO'LIQ-REPO DARVOZA TO'SIG'I — `esbuild` `.png` loader'i (23 fayl)

**Manba:** 1-sessiya, `.qz-logo` sweepidan keyin to'liq-repo esbuild yurgizilganda.
**F-0820-180. O'lchangan: 2026-08-20.**

🔴 **Bu KOD NUQSONI EMAS — DARVOZA CHEKLOVI.** Ayirmani aralashtirmaslik muhim:
`vite build` bu fayllarni **muammosiz** quradi (Vite asset-importni o'zi hal qiladi).
Yiqiladigan narsa — bizning **fayl-darajasidagi `esbuild` darvozamiz**, chunki unga
`.png` uchun loader berilmagan.

```
X [ERROR] No loader is configured for ".png" files: src/assets/common/mentor.png
```

**Qamrov: 23 fayl** — hammasi bitta asset (`assets/common/mentor.png`) ni import qiladi:

| Joy | Fayl |
|---|---|
| `7-Modull/` | **12** (MvpArch · MvpBuild1 · MvpBuild2 · MvpIterate · PmLesson26 · 28–34) |
| `eski/lessons/` | 5 (arxiv) |
| `2-moodull eski/` | 5 (arxiv) |
| `3-Modull/` | 1 (`PmLesson7`) |

**Yechim — bir qatorlik:** darvoza-buyrug'iga loader qo'shiladi:
```
npx esbuild <fayl> --loader:.jsx=jsx --loader:.png=dataurl --loader:.svg=dataurl \
  --bundle --external:react --external:react-dom --outfile=/dev/null
```
**Sinovdan o'tkazildi:** shu bayroq bilan `MvpArchLesson.jsx` **40 ms da toza** quriladi.

**Nega KATTA_TOZALASH (dars siklida emas):**
1. **23 faylga tegadi** va ularning aksari (17 tasi) **arxiv yoki 7-Modul** — joriy navbatdan tashqarida.
2. Asosiysi: tuzatish **fayllarda emas, JARAYONDA**. Darvoza-buyrug'i hozir hujjatlarda
   va odatda yashaydi, **skriptda emas** — shuning uchun uni «bir joyda» tuzatib bo'lmaydi.

**Tavsiya (qaror kutilmoqda):** `package.json` ga `"lint:build": "node esbuild-gate.mjs"`
qo'shilsin — u fayl ro'yxatini olib, **to'g'ri loader'lar bilan** yurgizsin. Shunda
darvoza-buyrug'i **kodda** bo'ladi va har seansda qayta yozilmaydi. Ayni damda
`npm run` da esbuild darvozasi **umuman yo'q** — faqat `lint:til` · `lint:jsx` ·
`lint:dark` · `lint:prompt` bor.

🔴 **Oqibat — bugungi dalil:** to'liq-repo esbuild birinchi marta yurgizilganda 23 ta
«qizil» chiqdi va ularning **hech biri haqiqiy nuqson emas edi**. Darvoza noto'g'ri
sozlanganda **yolg'on qizil** beradi — bu yolg'on yashildan kam zarar emas: auditor
vaqtini oladi va haqiqiy signalni ko'mib yuboradi.

---

### 18-band · ✅ YECHILDI (2026-08-20)

`esbuild-gate.mjs` yozildi va `package.json` ga ikki skript qo'shildi:

| Skript | Nima qiladi |
|---|---|
| `npm run gate:esbuild` | Barcha `.jsx` ni **to'g'ri loader'lar bilan** quradi (`.png`/`.jpg`/`.svg`/`.webp`/`.woff*` → `dataurl`) |
| `npm run gates` | **To'rt darvoza + esbuild bitta buyruqda**: esbuild → `lint:jsx` → `lint:dark` → `lint:til` → `lint:prompt` |

**Isbot:** `node esbuild-gate.mjs src/7-Modull` → **12 fayl, ✓ TOZA**. Ilgari o'sha
12 fayl (+11 arxiv/PmLesson7) «qizil» ko'rinardi — loader yo'qligidan.

🔴 **Asosiy yutuq — darvoza endi KODDA.** Ilgari u har seansda qayta yoziladigan
qo'lda-buyruq edi, shuning uchun loader'lar unutilardi. Endi ro'yxat bitta joyda va
keyingi seans uni **meros qilib oladi**.

### 13-band · 🟡 OCHILDI — qamrov: PRAKTIKA-EKRANLAR (foydalanuvchi qarori, 2026-08-20)

Band **muzlatilgandan chiqarildi**, lekin **tor qamrovda**: `PmLesson11` naqshi
(ipucha-zinapoya + rescue-klapan, ikki o'lchov: **vaqt** + **samarasiz urinish**)
**faqat praktika va qulflangan ekranlarga** qo'llanadi.

**Tatbiq tartibi:**

| Dars | Qachon |
|---|---|
| **m4-08** `BackendCrudPracticeLesson` | **shu siklda** — birinchi qo'llanish; proyekt-dars, eng muhtoji (9 ta qulflangan ekran) |
| **m4-10** · **m4-14** | o'z sikllarida, audit-bandiga kiradi |
| Yopilgan darslar (m4-01/03/04/05/06) | **modul-turdan KEYIN** bitta mini-to'lqin — **hozir tegilmaydi** |

**Matn-manbasi:** ipucha **darsning o'z mazmunidan** (navbatdagi aniq qadamni aytadi,
umumiy maslahat emas); rescue esa «Davom etish»ni **ochadi**.

🔴 **Ball-halolligi (§157 · 136-qonun ruhida):** klapan ochilganda
`solved: true, correct: false` **rost** yoziladi — o'quvchi ekrandan chiqadi, lekin
statistika «topdi» demaydi. Yo'l ochiq, ball yo'q.

---

## 19 ⬜ ARXIV PAPKALARI TAQDIRI — foydalanuvchi qarori kutilmoqda

**F-0820-197. O'lchangan 2026-08-20.** Papkalar **darvoza qamrovidan chiqarildi**
(foydalanuvchi qarori: variant **b**), lekin **o'chirilmadi** — arxivda kerakli material
bo'lishi mumkin, bu alohida so'raladi.

**Qamrovdan chiqqan:** `src/eski/` · `src/2-moodull eski/` — jami **12 fayl**.
Ular `App.jsx` ga **ulanmagan**: hech qachon qurilmaydi, hech kim ko'rmaydi.

**Nima uchun chiqarildi — o'lchov:**

| Darvoza | Arxivdan kelgan topilma | Qamrovdan keyin |
|---|---|---|
| `esbuild-gate` | **5** (buzuq import) | 142 → **130 fayl · ✓ TOZA** |
| `til-lint` | **191** | 745🔴 → **548🔴** |
| `jsx-lint` | **20** | 130 fayl |
| `dark-lint` | **14** | 392 → **378** |

Ya'ni **230 dan ortiq topilma** o'lik koddan kelardi va har auditda haqiqiy signalni
ko'mardi.

### 5 buzuq fayl (o'chirilmadi, ro'yxat)

`src/2-moodull eski/` ichidagi **5 fayl** `'../../assets/common/mentor.png'` yozadi,
lekin bu papka `src/` dan **bir** qavat pastda — yo'l repo ildiziga chiqib ketadi.

| Fayl |
|---|
| `JsConditionsLesson.jsx` · `JsFunctionsLesson.jsx` · `JsIntroLesson.jsx` · `JsLoopsLesson.jsx` · `JsVarsLesson (2).jsx` |

🔴 **Solishtirish:** `src/eski/lessons/` **ikki** qavat pastda va o'sha yo'l u yerda
**to'g'ri** ishlaydi. Ya'ni bu fayllar ko'chirilgan, yo'l esa tuzatilmagan.

**Qaror kutilmoqda:**
1. Arxiv **saqlanadimi**? Agar ha — shu holida qoladi (qamrovdan tashqarida, tegilmaydi).
2. Agar **o'chiriladigan** bo'lsa — `src/eski/` va `src/2-moodull eski/` butunlay ketadi
   va bu band yopiladi.
3. Uchinchi yo'l — arxivni repo'dan chiqarib, alohida vetkaga/zipga olish.

---

## 20 ⬜ NISHON-KO'RIK — 12/24 nishon qo'lda ko'riladi (mini-tur, modul-tur OLDIDAN)

**F-0820-210. O'lchangan 2026-08-20.** 2-sessiya nomzodi (m4-09 da «2/4 tekin») —
egasi butun 4-Modulni o'lchaganda naqsh **6 darsda** takrorlanishi chiqdi.

| Dars | Nishon | Ball bermaydigan ekranda |
|---|---|---|
| `DbSqlNosqlLesson` (m4-03) | 4 | **3** — `s3` · `s5` · `s14` |
| `BackendCrudPracticeLesson` (m4-08) | 4 | **3** — `s5` · `s10` · `spf` |
| `RoutingLesson` (m4-05) | 4 | **2** — `s11` · `s13` |
| `PostgresCrudLesson` (m4-06) | 4 | **2** — `s10` · `s14` |
| `ApiPostmanLesson` (m4-09) | 4 | **2** — `s3` · `s14` |
| **`DataIntroLesson` (m4-01, etalon)** | 4 | **0** ✅ |

**Jami: 24 nishondan 12 tasi.**

🔴 **NEGA AVTOMATIK TEKSHIRUV YETMAYDI.** «Ball bermaydi» ≠ «tekin». Sudrash-mashqi,
debugging ekrani yoki sxema-ulash ball bermaydi, ammo u yerda **xato qilish mumkin** —
nishon haqli. Mezon `scored` bayrog'i emas:

> **Ekranda muvaffaqiyatsizlik yo'li bormi?** Bor bo'lsa — nishon haqli.
> Yo'q bo'lsa (har bosish siljitadi, xato holati yo'q) — nishon **tekin**.

Buni faqat **ekran mazmunini o'qib** aytish mumkin. Shuning uchun 12 tasining har biri
**qo'lda** ko'riladi va har birida **mazmun-qaror** bor: nishonni olib tashlashmi,
ekranga xato-yo'li qo'shishmi, yoki nishonni boshqa ekranga ko'chirishmi.

**Tartib (foydalanuvchi qarori, 2026-08-20):**
1. **HOZIR EMAS** — m4-10 sikli oldin bo'ladi.
2. Keyin **alohida mini-tur**: 12 nishon, 6 dars, har biri bo'yicha qaror.
3. **Qonun-matni shundan KEYIN** yoziladi — o'lchov usuli aniqlangach.
   Hozir qonun yozish erta: mezon hali «qo'lda hukm», grep emas.

**Etalon dalili:** m4-01 da **0** tekin nishon — ya'ni qoida amalda bajarilishi mumkin,
bu «erishib bo'lmaydigan ideal» emas.

---

# 📋 OCHIQ-BANDLAR INVENTARIZATSIYASI (2026-08-20, modul-yakun hisoboti uchun)

> Har band: **holati** · **qamrovi** (o'lchangan, taxmin emas) · **kimga/nimaga bog'liq**.
> O'lchov sanasi: **2026-08-20**, `npm run gates` barqaror versiyasi bilan.
> Texnik o'ntalik yopilgach bu jadval **modul-final xaritasi** bo'ladi.

## Holat bo'yicha xulosa

| Holat | Soni | Bandlar |
|---|---|---|
| ✅ **Yopilgan** | **3** | 3 · 9(GameCard) · 18 |
| 🟡 **Jarayonda** | **1** | 13 (klapan — 2 darsda qo'llandi) |
| ⬜ **Ochiq** | **17** | qolganlari |

## To'liq jadval

| # | Band | Holat | Qamrov (o'lchangan) | Bog'liqlik |
|---|---|---|---|---|
| **1** | `lint:dark` F-29 to'plami | ⬜ | **360 topilma · 130 fayl** | Mustaqil. 4-Modul texnik o'ntaligi **0** ga tushirilgan |
| **2** | Umumiy `theme` fayli | ⬜ | **121 faylda** `const T` takrorlangan | 🔴 **Tugun-band**: 5 · 8 · 15 shunga bog'liq |
| **3** | m3-01/03/04 qayta skan | ✅ | — | Yopilgan 2026-08-20 |
| **4** | F-51 kursiv+accent sarlavha | ⬜ | Butun kurs uslubi | Foydalanuvchi qarori |
| **5** | F-52/53 soya · radius · rang | ⬜ | m3-04 da 41 soya / 18 radius / 101 rang | **2-bandga bog'liq** |
| **6** | PM darslari RU (m3-05/10/14) | ⬜ | 3 dars, `ru:` = 0 | Mustaqil, alohida kun |
| **7** | `.hint` uzuq chizig'i | ⬜ | 🔴 **67 fayl** (band «m3-06 va m3-07» deydi — **eskirgan**) | Mustaqil, bir qatorlik |
| **8** | `RoCard` darslararo har xil | ⬜ | — | **2-bandga bog'liq** |
| **9a** | GameCard Variant D | ✅ | 3-Modulda yopilgan | — |
| **9b** | 🔴 **RAQAM TO'QNASHUVI** — «111-QONUN SAVOLI» ham **9** raqamida | ⬜ | 1 dars (PmLesson9) | 🔴 **Raqami tuzatilishi kerak** |
| **10** | RU «Вы» / «вы» konvensiyasi | ⬜ | Butun kurs | **17-band bilan birga** (ikkalasi RU-ovoz) |
| **11** | «daftaringiz» | ⬜ | 6 fayl (M5 · M6 · M7) | Mustaqil |
| **12** | Audio-qatlam taqdiri | ⬜ | 🔴 **55 faylda** `useAudio([{…}])` | Loyiha-qarori. **4 dalil**: m4-01 · m4-04 · m4-06 · m4-09 |
| **13** | Klapan (ipucha + rescue) | 🟡 | **2/3 bajarildi**: m4-08 (4 ekran) · m4-10 (9 ekran). **Qoldi: m4-14** | Qamrov: praktika/qulflangan ekranlar |
| **14** | `INLINE_KEYS` o'lik kalitlari | ⬜ | **18** (edi 19 — m4-10 da bittasi yopildi) · 6 fayl | Mustaqil, darvoza tayyor |
| **15** | v18 CSS ko'chirma-ortiqchasi | ⬜ | **396 «klass × fayl»** juftligi. `.qz-logo` (42/0) **o'chirildi** | 🔴 **2-bandga bog'liq** |
| **16** | `QuestionScreen` `idx` propi | ⬜ | Deyarli har texnik darsda | Mustaqil |
| **17** | RU tugma «✅ Bajardim» | ⬜ | **47 fayl** · 4 variant (37 + 6 + 3 + 1). **Qaror: «✅ Готово»** | **10-band bilan birga** |
| **18** | esbuild `.png` loader | ✅ | `esbuild-gate.mjs` + `npm run gates` | Yopilgan 2026-08-20 |
| **19** | Arxiv papkalari taqdiri | ⬜ | 12 fayl (5 tasi buzuq import) · **qamrovdan chiqarilgan** | Foydalanuvchi qarori |
| **20** | Nishon-ko'rik | ⬜ | **12/24 nishon · 6 dars** | Mini-tur, **modul-tur oldidan** |

## 🔴 Uch e'tibor

1. **2-band — TUGUN.** Uchta band (**5 · 8 · 15**) undan oldin bajarilmaydi: umumiy CSS
   moduli bo'lmaguncha, birma-bir tuzatish keyingi ko'chirmada qaytadan paydo bo'ladi.
   Ya'ni **17 ochiq banddan 4 tasi bitta qarorga bog'langan**.
2. **7-band eskirgan.** Sarlavhasi «m3-06 va m3-07» deydi, o'lchov esa **67 fayl**
   ko'rsatadi. Qamrov qayta yozilishi kerak.
3. **Raqam to'qnashuvi.** «9» ikki bandda: `GameCard` (✅) va `111-QONUN SAVOLI` (⬜).
   Ikkinchisi **21** ga ko'chirilishi kerak — hozir tegmadim, chunki bu foydalanuvchi
   ro'yxati va tartibni u belgilaydi.

## Modul-yakuniga tayyorlik

**4-Modul texnik o'ntaligi** (03 · 04 · 05 · 06 · 08 · 09 · 10 · 11 · 13 · 14) yopilgach
**hech bir band bloklamaydi** — barchasi modul chegarasidan tashqarida yoki alohida kun.
**Modul-tur oldidan bajariladigan yagona ish — 20-band** (nishon-ko'rik).

---

## 21 ⬜ SOXTA-O'LCHOV — tiklanishda konstanta, haqiqiy yozuv emas (36 fayl)

**Manba:** 2-sessiya nomzodi ① (4B-01). **QABUL — F-0820-252. O'lchangan 2026-08-20.**
🆕 **Yangi sinf** — §157 va 136-qonun oilasining uchinchi a'zosi.

**Naqsh:**

```js
const [seen,  setSeen]  = useState(storedAnswer ? 2  : 0);   // ← 2 QAYERDAN?
const [phase, setPhase] = useState(storedAnswer ? 3  : 0);
const [postId, setPostId] = useState(storedAnswer ? 10 : null);
```

O'quvchi sahifani qayta yuklaganda holat **haqiqiy yozuvdan emas, QATTIQ KONSTANTADAN**
tiklanadi. Ekran «2 ta ko'rdingiz» deb ko'rsatadi — o'quvchi **nechtasini ko'rganidan
qat'i nazar**. Bu **o'lchovni to'qib chiqarish**.

### Oila — uchala a'zoning ildizi bitta

| A'zo | Nima yolg'on | Qayerda |
|---|---|---|
| `MATN_KORPUS` **§157** | **matn** — har javobga «Topdingiz!» | ekranda |
| `DARS_ETALON` **136-qonun** | **signal** — `firstAttemptCorrect: true` shartsiz | serverda |
| 🆕 **F-0820-252** | **o'lchov** — holat konstantadan tiklanadi | ekranda + xotirada |

> **Umumiy ildiz:** ekran haqiqatni emas, **qulay qiymatni** ko'rsatadi.

### Qamrov: 36 fayl

🔴 **Avtomatik tuzatib BO'LMAYDI.** Yechim yo'nalishi aniq — `onAnswer` payloadiga
haqiqiy holat yoziladi (`seen: [...]` · `step: n`) va tiklashda **o'shandan** o'qiladi.
Lekin **har ekranda payload shakli har xil**: qayerda massiv, qayerda son, qayerda
`Set`. Ya'ni 36 fayl **qo'lda** ko'riladi.

**Tartib:** 4a sikllaridan **keyin**. Avval qonun-matni yoziladi (qaysi holat
saqlanadi, qaysisi tiklanmasa ham bo'ladi), keyin qamrov-rejasi.

**O'lchov buyrug'i:** `grep -rn "useState(storedAnswer ? [0-9]" --include=*.jsx src/`

---

## 22 ⬜ RU HURMAT-KAPITALI — gap ichida «Вы/Ваш» (222 ta, 19 fayl)

**Manba:** 2-sessiya nomzodi ③ (4b-02, o'sha faylda 6:1). **QABUL — band, qonun EMAS.**
**O'lchangan 2026-08-21 (1-sessiya, butun repo).**

**Nega qonun emas.** Bu yangi nuqson-sinf emas — **mavjud konvensiyaning bajarilmagan
qismi**: darslik matni o'quvchiga murojaatda kichik «вы» ishlatadi (rasmiy xat emas,
**jonli o'qituvchi ovozi**). Yangi raqam ochish o'rniga bir yo'la tozalanadi.

**O'lchov (butun repo, `src/`, arxivsiz):**

| Ko'rsatkich | Son |
|---|---|
| gap **ichida** katta «Вы/Вам/Ваш…» | **222** |
| katta shakl **jami** (gap boshi bilan) | 1729 |
| kichik «вы/вам/ваш…» jami | 1732 |
| nisbat kichik : gap-ichi-katta | **7.8 : 1** |

Ya'ni repo **allaqachon kichik shaklga og'gan** — 222 ta qolgan izchillik buzilishi.

**Eng zararlangan fayllar:**

| Son | Fayl |
|---|---|
| 33 | `4-Modull/NodeServerLesson.jsx` |
| 31 | `3-Modull/ReactProjectDayLesson.jsx` |
| 27 | `2-Modull/PracticeLesson4.jsx` |
| 26 | `3-Modull/ReactApiPostLesson.jsx` |
| 18 | `2-Modull/PeanStackLesson.jsx` · `5-Modull/BotAiBrainLesson.jsx` |
| 14 | `4-Modull/FullstackProjectDayLesson.jsx` |
| 13 | `4-Modull/FullstackFeedbackLesson.jsx` |
| 12 | `2-Modull/PracticeLesson3.jsx` · `5-Modull/BotAiAgentLesson.jsx` |
| ≤6 | qolgan 9 fayl |

🔴 **Ehtiyot — avto-almashtirish TAQIQ.** Uch tuzoq:
1. **Gap boshidagi** «Вы…» **qonuniy** — u 1729 tadan ~1507 tasi. Faqat gap ichidagisi tegiladi.
2. `\b` **kirill uchun ishlamaydi** (JS `\w` = ASCII) — `/u` bayrog'i va `\p{L}`
   lookaround shart. Bu o'lchov birinchi urinishda **0 ta** deb yolg'on ko'rsatgan edi.
3. **UZ-RU juftlik-sanog'i** buzilmasin (F-244 saboqi) — RU-ga tegilganda `uz:`/`ru:`
   soni o'zgarmaydi, lekin `npm run gates` baribir qayta yurgiziladi.

**Tartib:** 4a/4c sikllaridan **keyin**. Fayl-egaligi qoidasi kuchda —
sweep bitta sessiyada, bitta o'tishda bajariladi.

**O'lchov skripti:** `scratchpad/m3.mjs` (lookaround + `/u`, arxiv-papkalar chiqarilgan).

---

## 23 ⬜ SHABLON-MANBA TOZALASH — olti takror-sinf nusxa bilan ko'chyapti

**Manba:** 4a-MODUL jamlamasi (2026-08-21) + 4c-01 auditi tasdig'i.
🔴 **IJRO — MODUL-KO'RIKDAN KEYIN, foydalanuvchi buyurguncha TEGILMAYDI.**

**Asos.** 4a-modulning uchala darsida ham **bir xil olti sinf** chiqdi. Bu tasodif emas:
yangi dars mavjud darsdan **nusxa olib** quriladi, ya'ni nuqson ham **nusxa bilan
ko'chadi**. 4c-01 tekshirildi — **oltitasi ham o'sha yerda**, ya'ni sinf modul chegarasidan
ham o'tgan.

| # | Sinf | Qonun | 4a-01 | 4a-02 | 4a-03 | 4c-01 |
|---|---|---|---|---|---|---|
| 1 | `MentorPracticeStats` bo'sh apparat (`0/0` da `null` emas) | **129** | ✅ | ✅ | ✅ | ✅ |
| 2 | `StudentPracticePulse` yo'q (+ `.done-mini` CSS) | 45 | ✅ | ✅ | ✅ | ✅ |
| 3 | `.btn` · `.lp-done-btn` · `.mstats-reveal` · `.rc-btn` = `T.ink` | **F-29** + **132** | ✅ | ✅ | ✅ | ✅ |
| 4 | `.hint { 1.5px dashed }` | **16** | ✅ | ✅ | ✅ | ✅ |
| 5 | «professional» (+ RU juftligi) | lug'at | ✅ | ✅ | ✅ | ✅ |
| 6 | «tavsiya etiladi» · «Zo'r!» · «ushbu» | lug'at | ✅ | ✅ | ✅ | ✅ |
| **7** | 🆕 **hook-karkas:** `correct: true` + shoxlanmagan «Aynan!» | **136 · 137** | ✅ | — | ✅ | ✅ |

🔴 **7-a'zo qo'shildi (2026-08-21, 1-sessiya jamlamasidan).** `137`-hook sinfi butun
1-sessiyada **4/5** darsda chiqdi (4a-02 dan boshqa hammasida) va oltilikdan tashqarida
bo'lsa ham **aynan shu tarzda — nusxa bilan** ko'chadi.

> ⚠️ **7-a'zoning tozalash chegarasi boshqacha.** Oltalasi — **karkas**: manbada bir marta
> tuzatilsa, keyingi nusxalarda tayyor keladi. Hook esa **ikki qatlamdan** iborat:
> **karkas shablondan tozalanadi** (`correct: v === '<to'g'ri id>'` + `ACK` xaritasi skeleti +
> `{tr(ACK[picked])}` chaqiruvi), **`ACK`-mazmuni esa har darsda ALOHIDA yoziladi** —
> ko'prik-gaplar darsning **o'z olamidan** kelib chiqadi (137-qonun 3-sharti).
> Ya'ni shablon **halol skeletni** beradi, **mazmunni emas**.

**Ya'ni:** har yangi dars auditi shu yettitasini **qayta topadi va qayta tuzatadi** —
dars boshiga ~6–7 topilma, sof takror ish.

### Nima qilinadi

1. **Nusxa-manba aniqlanadi** — yangi dars qaysi fayldan ko'chirilyapti (bitta fayl emas,
   bir nechta bo'lishi mumkin: har modul o'z «birinchi darsi»dan o'sadi).
2. Shu manbada **yettala** sinf bir marta tuzatiladi (hook — faqat **karkas**).
   🔴 **O'lchov FAYL BO'YICHA olinadi, «7 × N dars» deb emas.** Dalil: 4c-02 da `.hint`
   klassi **umuman yo'q**, «professional» **0 marta** — ya'ni oltilik hamma nusxada bir xil
   emas. Nusxa-manba bitta emas, yoki ba'zi a'zolar keyingi nusxalarda tabiiy ravishda
   tushib qolgan. Har fayl uchun **qaysi a'zo bor** deb alohida sanaladi.
3. Manba fayl `PIPELINE.md` da **shablon-manba** deb belgilanadi — keyingi dars
   o'shandan ko'chiriladi.

🔴 **Nima QILINMAYDI:** mavjud yopilgan darslarga qayta tegilmaydi — ular o'z siklida
allaqachon tuzatilgan. Bu band **kelajakdagi** darslar uchun.

**Kutilayotgan foyda:** har yangi dars auditidan **~6–7 topilma** yo'qoladi.
O'lchangan asos: 1-sessiyaning **66 topilmasidan 28 tasi (42%)** shu sinflardan edi.

**Bog'liq:** 4a-jamlama (`PIPELINE_STATE.md`, 2026-08-21) · 22-band (RU hurmat-kapitali) —
ikkalasi ham «bir marta tozala, keyin takrorlanmasin» toifasidan.
