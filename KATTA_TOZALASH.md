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

---

## 24 ⬜ KOD OYNASI PAST EKRANDA QIRQILADI — qat'iy geometriya (30 dars)

**Pretsedent:** F-0824-04, m3-10 (`PmLesson9`) koding-ekrani. Foydalanuvchi xabari:
«100% zoomda sahifa tiqilib qoladi, 80% da yaxshi». Ikki mashinada ikki xil ochilgan.

**Sabab — `HtmlCompiler.jsx` geometriyasi qat'iy:**
```
:2335  .hc-root  { height: calc(100dvh / var(--lz,1)); overflow:hidden;
                   display:flex; flex-direction:column; justify-content:center; }
:2363  .hc-split { flex:none; height: calc(62dvh / var(--lz,1)); }
```
Muharrir balandlikning **62%** ini oladi; qolgan qismlar — sarlavha, tavsif, 3 chip,
`.hc-msg` (**qat'iy 40px**), pastki tugmalar — **piksel** bilan o'lchanadi va past
ekranda qisqarmaydi. Taxminiy hisob: o'zgarmas qism ≈ **360px**, demak
`0.62·H + 360 ≤ H` → **H ≥ ~950 CSS px** kerak. Noutbukda 100% zoomda odatda 650–800px;
Windows displey masshtabi 125% bo'lsa — kafolatli sinadi.

**Oqibat bloklovchi:** `justify-content:center` + `overflow:hidden` → ortiqcha kontent
**ikki tomondan** qirqiladi: tepadan eyebrow va sarlavha, pastdan «Davom etish».
O'quvchi mashqni **tugata olmaydi**.

**Qamrov:**
```
HtmlCompiler'ni import qiladigan fayllar:  30
'--lz' formulasining nusxasi (97 fayl):    Math.max(1, ...) — pastga tushmaydi
```
Ya'ni **har koding-ekrani** shu latent nuqson bilan yuribdi.

**Yechim (kompilyatorda 2 qator):**
1. `.hc-split` → `flex:1 1 auto; min-height:240px` — joy yetmasa **muharrir** qisqarsin,
   tugmalar emas.
2. `.hc-root` → past ekranda `justify-content:flex-start` (naqsh tayyor: `:2540` da
   `max-width:860px` uchun allaqachon shunday qilingan — faqat **balandlik** bo'yicha
   himoya yo'q edi). Masalan `@media (max-height:960px)`.

**Vaqtinchalik yamoq allaqachon qo'yilgan (faqat m3-10):** `PmLesson9.jsx:1781` — kod
oynasi qobig'iga alohida `--lz` beriladi (dars masshtabi 1 dan katta bo'lsa TEGILMAYDI,
chunki `.lesson-root` ham zoom qo'llaydi — ikkovi ko'payib ketmasligi kerak). Bu chegarani
suradi, ildizni olmaydi; shu band bajarilgach yamoqni **olib tashlash mumkin**.

🔴 **Avval o'lchov.** `~950` — koddan hisoblangan, o'lchanmagan raqam. Kod oynasi ochiq
turganda konsolda:
```js
const r = document.querySelector('.hc-root');
({ kerak: r.scrollHeight, bor: r.clientHeight, yetmaydi: r.scrollHeight - r.clientHeight })
```
Konstantalar (`min-height`, `max-height` chegarasi) shu o'lchovdan keyin qo'yiladi.

**Bog'liq:** umumiy faylga tegish tartibi — avval ishoralar ro'yxati, keyin tuzatish,
oxirida bog'liq kirish nuqtalari qurilishi (30 ta dars + demo-konfiglar).

---

## 25 ⬜ «ISHONASIZMI / TASAVVUR QILING» — sotuv qurilmasi (40 fayl, nomzod)

**Qoida tayyor:** `MATN_KORPUS.md` **§162** — reja/anons ekrani **va'da beradi, reklama
qilmaydi**. «Ishonasizmi · Tasavvur qiling · Hayron qolasiz» — sotuv qurilmasi; darsda
ikki zarar: va'daga shubha soladi va o'quvchi vaqtini bekorga oladi (109-qonun).

**Nega ro'yxatga tushdi:** qonun 2026-08-22 da m4-03 dan muhrlangan edi, lekin
**2026-08-24 da m4-04 s1 da qaytadan topildi** (F-0824-05) — ya'ni bir darsga qo'llanib,
qolganiga yoyilmagan.

**Qamrov (grep, nomzodlar):**
```
grep -rln "Ishonasizmi\|Tasavvur qiling\|Поверите ли\|Представьте" src/    →  40 fayl
```

🔴 **Bu ro'yxat buzilishlar ro'yxati EMAS.** Grep — nomzodlar. «Tasavvur qiling» rolli
topshiriqda («o'zingizni buyurtmachi o'rniga qo'ying») **o'rinli**; taqiq faqat
**reja/anons/hook** ekranidagi ishontirish-ohangiga tegishli. Har topilma alohida
ko'riladi, ommaviy avto-almashtirish **qilinmaydi**.

**Tartib:** fayl-ro'yxatini modullab bo'lib chiqing → har birida iborani atrofidagi
ekran turini aniqlang (reja/anons/hook = buzilish · rolli topshiriq = o'rinli) →
buzilishlarni §162 dagi ❌→✅ juftligi bo'yicha qayta yozing → `npm run lint:til`.

**Keyingi qadam (ixtiyoriy):** ibora `til-lint-rules.json` ga **kontekstsiz** qoida
sifatida qo'shib bo'lmaydi (o'rinli holatlar bor). Agar qo'shilsa — faqat 🟡 warn
darajasida, «tekshiring» ma'nosida.

**Bog'liq:** `MATN_KORPUS.md` §162 (ohang) · §178 (reja-ekran mazmuni).

---

## 26 ⬜ KO'CHIRILADIGAN KOD CHIPI IDISHDAN CHIQADI (48 fayl) + ligatura savoli (98 fayl)

**Qoida tayyor:** `DARS_ETALON.md` **144-qonun** (11-H) — ko'chirib yoziladigan kod
sig'sin va aynan ko'rinsin.

**Pretsedent:** F-0824-06, m4-04 s18. Uchinchi bosqichdagi 58 belgilik chip
(`app.get('/salom', (req, res) => res.send('Salom, dunyo!'))`) karta chegarasidan
chiqib ketgan; `=>` esa ligatura tufayli `⇒` bo'lib chizilgan.

**Qamrov — O'LCHANDI (2026-08-24, F-0824-09):**
```
.qcode { … white-space: nowrap }      →  98 fayl
ko'chirish ro'yxati bo'lgan darslar    →  42 fayl
shundan chipi 45 belgidan uzun        →   9 fayl   ← faqat shular sinadi
```

| Holat | Soni | Fayllar |
|---|---|---|
| ✅ tuzatilgan | **6** | `NodeServerLesson` · `EdgeCasesTestLesson` · `BackendCrudPracticeLesson` (chip **94** belgi!) · `ReactPropsReuseLesson` · `ReactCrudPracticeLesson` · `DataIntroLesson` |
| ⬜ qolgan | **3** | `5-Modull/BotAiProjectLesson` (54) · `6-Modull/ReactNativeAppLesson` (53) · `5-Modull/BotAiBrainLesson` (49) |

3-, 4-, 4a-, 4b-, 4c-modullarda (FB-demo) **xavfli fayl qolmadi**. Qolgan 3 tasi
5- va 6-modulda — alohida demo-yuzasi.

**O'lchash usuli (takrorlanadi):** har faylning `checklist={[ … ]}` bloklaridagi
teskari-apostrof orasidagi matnlar ajratiladi va uzunligi sanaladi; 45 dan uzuni —
xavfli. Shu mantiq `lint:jsx` ov-bandiga aynan ko'chiriladi.

**Ish (48 fayl):** har darsning CSS blokiga bitta qator qo'shiladi —
```
.lp-step .qcode { white-space: pre-wrap; overflow-wrap: break-word;
                  font-feature-settings: "liga" 0, "calt" 0; }
```
m4-04 da allaqachon qo'yilgan (`NodeServerLesson.jsx:2832`) — namuna shundan olinadi.

**Detektor qo'shiladi (shundan keyin sinf qaytmaydi):** `lint:jsx` ga ov-bandi —
`checklist` massividagi teskari-apostrof orasidagi matn **45 belgidan uzun** bo'lsa
🟡 warn. Bu grep bilan tutiladigan sinf, ya'ni avtomatlashtiriladi.

🔴 **Ochiq qaror — ligaturani qayerda o'chirish.** Hozir faqat ko'chirish-ro'yxatida
o'chirildi (144-c). Umuman butun chip-sinfida o'chirish **izchilroq** bo'lardi, lekin
bu 98 faylga tegadigan vizual qaror: test va proza ichidagi kod ham ko'rinishini
o'zgartiradi. **Foydalanuvchi qarori kerak**, avtomatik qilinmaydi.

**Bog'liq:** 24-band (kod oynasi past ekranda qirqiladi) — ikkalasi ham «umumiy CSS
sinfi bitta kontekstga to'g'ri, boshqasiga noto'g'ri» toifasidan.

---

## 27 🟡 KOD OYNASI MASSHTABI — yagona naqshga o'tkazish (21 fayl qoldi)

**Qoida/naqsh tayyor:** `src/compilator/useCompilerScale.js` (F-0824-08, 2026-08-24).
Kompilyator **tegilmaydi** — u tashqaridan atigi ikki narsani o'qiydi (`var(--lz,1)` va
ota-zoom), ikkalasi ham darsning qo'lida. Naqsh ikkala nuqsonni bir vaqtda yopadi:
baland ekrandagi **qo'sh-zoom** va past ekrandagi **qirqilish**.

**Dars tomonida ikki qator:**
```
import { useCompilerScale } from '../compilator/useCompilerScale.js';
const hcScale = useCompilerScale();            // ScreenCoding ichida
<div style={{ position:'fixed', inset:0, zIndex:2000, background:T.bg, ...hcScale }}>
```

**Holat (2026-08-24):** 30 ta fixed-qobiqdan —

| Holat | Soni | Fayllar |
|---|---|---|
| ✅ yangi naqsh | **5** | `PmLesson9 · 11 · 13 · 15 · 17` (3 · 4 · 4a · 4c moduli) |
| 🟡 eski naqsh A (`calc(1 / var(--lz,1))`) | **4** | `PmLesson19 · 21 · 23 · 25` (5 · 6 moduli) |
| ⬜ hech narsa | **21** | butun 1-Modul (11) · butun 2-Modul (9) · `pm/PmUserStoryLesson` (P0!) |

**Tartib:** eski naqsh A bor 4 fayl — `zoom: 'calc(1 / var(--lz, 1))'` o'chiriladi,
o'rniga `...hcScale` (natija baland ekranda **bir xil**, past ekranda tuzaladi).
Qolgan 21 faylga naqsh qo'shiladi. Har fayldan keyin `npm run gates -- <fayl>`.

🔴 **A va yangi naqshni BITTA elementda aralashtirmang.** `zoom: calc(1/var(--lz))` +
o'sha elementga `--lz` qo'yilsa, zoom **yangi** qiymatni o'qib o'zini bekor qiladi.
Shuning uchun naqshda `zoom` — JS'dan **raqam**, `calc/var` emas.

🔴 **Konstanta o'lchanmagan.** `HC_NEED = 1000` koddan hisoblangan. O'lchov (kod oynasi
ochiq turganda): `const r=document.querySelector('.hc-root'); r.scrollHeight - r.clientHeight`
— 0 dan katta bo'lsa `HC_NEED` ko'tariladi (bitta joyda, yordamchi faylda).

**Bu band 24-bandni ALMASHTIRMAYDI.** 24-band (`.hc-split` flex, `justify-content`)
kompilyatorning ichki geometriyasini tuzatadi va **juda past** oynalarda (0.62 polidan
pastda) kerak bo'ladi. Bu band esa kompilyatorga tegmasdan chegarani suradi.

---

## 28 ⬜ E'LON QILINMAGAN CSS SINFLARI — jim buzilish (64 fayl, 164 sinf)

**Qoida tayyor:** `DARS_ETALON.md` **145-qonun** (11-I) — `className` e'loni bilan juft
yuradi. Har dars o'z `<style>` blokini olib yuradi, ya'ni sinf boshqa darsdan **meros
olinmaydi**; nusxa ko'chirilgan JSX bilan CSS bloki ham ko'chirilishi shart.

**Pretsedent:** F-0824-10 — m4c-05 va m4c-01 da `vcard/role-ico/vlbl/vseen` (4 sinf,
e'lon nol). Ikkalasi ham tuzatildi: qiymatlar `4c-Modull/FullPipelineProjectLesson.jsx`
dan ko'chirildi, `npm run gates` → 5/5 toza.

🔴 **Nega bu alohida band:** bu **jim** buzilish — `esbuild` · `lint:jsx` · `lint:dark` ·
`lint:til` **hammasi toza** o'tadi, ekran esa bezaksiz chiqadi. Hech bir mavjud darvoza
uni ko'rmaydi.

**Skaner natijasi (2026-08-24):** 133 fayl · **64 tasida teshik** · jami **164** e'lonsiz
sinf. Eng og'irlari:

```
29  5-Modull\BotFeedbackIterationLesson.jsx        fs · fs-pool · fs-pool-done · fs-chip-wrap · fs-chip · fs-quick · fs-quick-btn · fs-wrong-why · fs-baskets · fs-basket · fs-basket-h · fs-basket-body · fs-placed · fn-row · fn-lbl · fn-track · fn-fill · agent-card · agent-lbl · agent-msg · fs-preview · fs-preview-chip · fn-funnel · fn-step · fn-step-n · fn-step-l · prompt-card · prompt-who · prompt-text
10  5-Modull\BotApiButtonsLesson.jsx               editor · editor-bar · editor-tab · editor-body · editor-code · gloss · gloss-head · lbl · gloss-toggle · gloss-body
 6  1-Modull\GitLesson.jsx                         term · term-row · term-prompt · term-cmd · term-ok · term-out
 6  2-Modull\PracticeLesson2.jsx                   lp-draft · lg-dot · takeaway · ta-bulb · ta-h · ta-sub
 6  3-Modull\ReactFirstComponentLesson.jsx         prop-flow · prop-arrow · prop-step · prop-dot · prop-txt · prop-token
 5  2-Modull\PracticeLesson4.jsx                   takeaway · ta-bulb · ta-h · ta-sub · in
 4  1-Modull\Htmllesson1.jsx                       tg-post · ladder-stair · hw-sky · hw-tok
 4  3-Modull\PmLesson8.jsx                         no · karta · rang · hw
 3  1-Modull\CssLesson1.jsx                        in · hw-sky · hw-tok
```

`BotFeedbackIterationLesson` qo'lda tasdiqlandi: `.fs-basket` **7 marta** ishlatilgan,
e'loni **yo'q** — ya'ni butun bir mexanika bezaksiz turibdi. O'sha faylda `.vcard` esa
bor, demak skaner to'g'ri ajratyapti.

⚠️ **Skaner hozircha KAM ko'rsatadi.** E'lonlarni butun fayldan `.nom` naqshi bilan
yig'adi, shuning uchun `T.paper` kabi obyekt-maydonlari ham «e'lon» deb sanaladi va
ba'zi haqiqiy teshiklar yashirinadi. `lint:jsx` ga ov-bandi qilinganda e'lonlar faqat
`<style>` bloki ichidan olinishi kerak — o'shanda raqam **oshadi**.

**Tartib:** har fayl uchun — sinf loyihada boshqa darsda bormi? Bor bo'lsa **o'sha
modulning** darsidan ko'chiriladi (o'ylab topilmaydi, 145-c). Yo'q bo'lsa: sinf haqiqatan
keraksizmi (JSX'dan olib tashlanadi) yoki yangi blok yoziladi — bu dizayn qarori.

**Bog'liq:** 23-band (shablon-manba tozalash) — ikkalasi ham «nusxa ko'chirishda bir
bo'lak tushib qolgan» toifasidan.
## 28. DragDropOrder klon-bug sweep (F-0826-01) — 19 fayl
**Topilma:** chip O'Z slotining ustiga sudrab qaytarilsa `occ === id` bo'lib pool'ga
nusxasi qo'shiladi (6 chip; yakun-hisobda ortiqcha klon qoladi). Foydalanuvchi
PmLesson2.homework'da jonli tutdi; naqsh `const occ = ns[slotIdx]` bilan 20 faylga
ko'chirilgan, homework'da tuzatildi — qolgan 19 fayl kutmoqda.
**Tuzatish (bir xil, 2 qator):** `place()` boshiga
`if (typeof from === 'number' && from === slotIdx) return { pool, slots };`
va `if (occ)` sharti → `if (occ && occ !== id)`.
**Fayllar:** `grep -rln "const occ = ns\[slotIdx\]" src/` (PmLesson2.homework.jsx dan
tashqari hammasi). Har faylda tuzatishdan keyin esbuild + tegishli .shared qayta yig'ish.
## 29. LMS yig'malarini yangi `resultDetails.js` bilan qayta yig'ish (F-0909-02/03) — 100 fayl
**Topilma:** `src/live/resultDetails.js` 2026-09-09 da tuzatildi (urinishlar tarixi localStorage'da
saqlanadi; `solved = attempts.some(correct)`). Umumiy modul har LMS yig'masiga ICHIGA kiradi, shuning
uchun `lms/` dagi 100 fayl (ildiz + 4-M/5-M/6-M, .shared.jsx ham) hali ESKI mantiq bilan turibdi.
Faqat `lms/InternetLesson.jsx` (CRM test-materiali) staging manzili bilan qayta yig'ildi.
**Tuzatish:** cutover kuni to'liq qayta yig'ish — `node server/tools/cutover-mashq.mjs --url https://dars-api.coddycamp.uz --out lms --smoke`
(prod manzili). Staging'da ko'proq dars sinab ko'rish kerak bo'lsa — `DARS_API_URL=<staging> node scripts/build-lms.mjs <fayl>`.
**Tekshiruv:** har yig'mada `grep -c 'ccDetails:'` = 1; `smoke-lms` ✓; eski manzil 0.
**QURUQ MASHQ O'TDI (2026-09-09 16:10)** — `SCRATCH=<tmp> node scripts/cutover-mashq.mjs --url <staging> --out <tmp>/lms-mashq`
(`lms/` ga tegilmadi): **90/90 yig'ildi** (3 s, 34 MB, 0 xato) · `ccDetails:` **90/90** · `solved: attempts.some` **90/90** ·
supabase qoldig'i 0 · manzil 90/90. Brauzer-smoke: `CHROME=/usr/bin/google-chrome LMS_DIR=<mashq> node scripts/smoke-lms.mjs`
→ **68/68 ✓**; `smoke-shared.mjs` bilan 22 ta `.shared.jsx` → **22/22 ✓**. Ya'ni cutover kuni bu ish **bir buyruq** —
faqat `--url` prod manziliga va `--out lms` ga almashadi. Eslatma: Kali'da `CHROME` env majburiy (skriptlarda Windows yo'li yozilgan).

**2026-09-10 F-0910-01:** `src/live/` yana o'zgardi (`useLiveSession.js` solo→jonli 20 s so'rov, `LiveUI.jsx` belgi, `liveClient.js` `LMS_SOLO_RECHECK_MS`) — o'sha qayta yig'ish shu tuzatishni ham olib chiqadi (tekshiruv: `grep -c LMS_SOLO_RECHECK_MS` ≥ 1). Pilot `lms/InternetLesson.jsx` staging bilan qayta yig'ildi.

**Bog'liq:** SINOV_PROTOKOLI_LMS.md §7 · memory/holat-2026-09-09.

## 30. ✅ onFinished arena-matnlari — 96 darsga `arenaBank: QUIZ_BANK` (2026-09-10, BAJARILDI 20:15)
**Topilma:** arena (CodeStrike) javoblari onFinished `questions[]` ga `kind: "arena"` bilan qo'shildi — umumiy modulda
(`src/live/resultDetails.js` `logArena`, `useLiveSession.submitAnswer`), shuning uchun 97 darsda ham ishlaydi (hammasi
`submitAnswer(QUIZ_BASE_IDX + qi, \`quiz-${qi}\`, i, correct, elapsed)` naqshida). Lekin savol/variant MATNI darsning
`QUIZ_BANK`idan olinadi — u `buildResultDetails({ …, arenaBank: QUIZ_BANK })` bilan uzatiladi. Hozir faqat pilot
`InternetLesson.jsx` da; qolgan 96 darsda arena savollari matnsiz (id + variant raqami) ketadi — yaroqli, lekin to'liq emas.
**Tuzatish (bir buyruq, 97 satr bir xil):**
`grep -l "achievements: ACHIEVEMENTS })" src/*/*.jsx | xargs sed -i 's/achievements: ACHIEVEMENTS })/achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })/'`
— faqat `QUIZ_BANK` nomi darsda borligi tekshiriladi (`grep -L "const QUIZ_BANK"` bo'sh bo'lsin), keyin `npm run lint:jsx` + esbuild 97/97.
Cutover qayta-yig'ish (§29) bilan birga chiqadi. Tekshiruv: yig'mada `grep -c "arenaBank: QUIZ_BANK"` = 1.
**Bog'liq:** TZ_LESSON_RESULT_DETAILS_RU §9 · `feedback/lms-sinov-2026-09-10/xabar-axadulla-2026-09-10-arena.md`.

**BAJARILDI (2026-09-10 20:15, UNCOMMITTED):** bir buyruq bilan 96 darsga qo'shildi (oldindan tekshiruv: 96 faylda naqsh
aynan 1 marta, `const QUIZ_BANK` hammasida bor). Darvozalar: `arenaBank: QUIZ_BANK` 97/97 (har faylda 1) · eski naqsh 0 ·
unit `resultDetails.test.mjs` 6/6 · `lint:jsx` 156 fayl toza · `esbuild-gate` src/** — 96 tahrirlangan fayl toza ·
`npm run smoke` 109/109 · `smoke-onfinished` JsConditions + ApiPostman payload ✓. **Yon topilma (tegilmadi, tahrirdan
oldin ham bor edi — HEAD'da stash bilan tasdiqlandi):** `esbuild-gate src/main.jsx` qizil — `src/7-Modull/MvpBuild2Lesson.jsx:127`
`'\''` va `"'"` bir xil kalit (esbuild `duplicate-object-key` ogohlantirishi, darvoza uni xato deb sanaydi). M7 konveyeriga
(darslik-jonli, 13 dars) qo'shib yechiladi; bitta kalitni o'chirish kifoya. Cutover qayta-yig'ish (§29) endi arena-matnlarini
ham olib chiqadi (tekshiruv: yig'mada `grep -c "arenaBank: QUIZ_BANK"` = 1).
**21:00 qo'shimcha:** yon topilma yopildi — `MvpBuild2Lesson.jsx` dagi `map` obyekti umuman ishlatilmagan (o'lik kod, slug regex bilan
olinadi) → satr o'chirildi. Keyin `esbuild-gate src/main.jsx` boshqa sababdan qizil chiqdi: darvoza `--outfile=/dev/null` ga yozadi,
CSS import qiladigan kirish-nuqta esa `/dev/null.css` ga yozmoqchi bo'lib «permission denied» beradi (YOLG'ON QIZIL, 18-band sinfi).
Tuzatildi: `esbuild-gate.mjs` endi tmp-papkaga yozadi va oxirida o'chiradi → **butun `src/**` 156/156 toza**. Cutover quruq mashqi
qayta o'tdi: 90/90 yig'ildi, smoke 68 yakka + 22 shared, har yig'mada `arenaBank` 1 · `LMS_SOLO_RECHECK_MS` ≥ 1 · `ccDetails` 1 · supabase 0.

## 31 ⬜ RU'DA O'ZBEKCHA QO'SHIMCHA — «{n}-hafta» (≈58 nomzod, 15+ fayl)

**Topilishi (F-0912-12, 2026-09-13):** 4-modul layout auditida `PmLesson17` s?
`<span className="pyg-w mono">{w.n}-hafta</span>` — qo'shimcha `tr()` dan **tashqarida**.
Ruscha rejimda o'quvchi «3-hafta» deb o'zbekcha ko'radi.

**O'lchov (grep, `eski` papkalarsiz):**
- `}-hafta|kun|karta|kishi|soat|daqiqa|marta|qadam|bosqich` — jami **149** hit
- shundan `tr({` yozuvi bo'lmagan qatorda — **58** (nomzod; qolgani `tr()` ning uz-tarmog'ida,
  ya'ni to'g'ri)
- eng ko'p: `PmLesson21` (10) · `PmLesson17` (7) · `PmMetricsLesson` (5) · `PmJtbdLesson` (3) ·
  `PmLesson19/20/22/23/24/25` (2 tadan)

**Nega bu yerda:** 15+ faylga tegadi — dars ustida ishlaganda ko'tarilmaydi (CLAUDE.md).
**Qanday yopiladi:** har nomzod qo'lda ko'riladi (qaysi biri chindan ham `tr()` dan tashqarida),
so'ng `tr({ uz: `${n}-hafta`, ru: `${n}-я неделя` })` shakliga o'tkaziladi. Son-kelishik
ruschada murakkab (1-я / 2-я / 5-я) — shuning uchun **avtomatik almashtirish RAD**, qo'lda.
**Darvoza:** yopilgandan keyin shu grep 0 bermasa ham bo'ladi (uz-tarmoqlari qoladi) —
tekshiruv `npm run lint:layout --lang ru` va ko'z bilan.

## 32 ✅ {uz,ru} OBYEKTI tr() SIZ CHIZILADI — DARSNI YIQITADI (YOPILDI 2026-09-14 · 267 nomzod → 6 haqiqiy tuzatildi, 261 xavfsiz)

**Topilishi (F-0912-13, 2026-09-13):** 4a/4b/4c layout sivirmasida audit **sahifa-xatosini**
qayd etdi: `Objects are not valid as a React child (found: object with keys {uz, ru})`.
Bu — layout emas, **ishlashdagi buzilish**: React o'sha daraxtni chiza olmaydi.

**Tasdiqlangan va TUZATILGAN (4 joy, 2 dars):**
- `PmLesson16.jsx:1269,1270` — `{cur.kmsg}` · `{cur.omsg}` (ish stoli: noto'g'ri javobdan keyingi izoh)
- `PmLesson16.jsx:1379,1409` — `<b>{k.ic} {k.t}</b>` (ikki tarmoqda: mentor-ochilishi va yakun)
- `PmLesson17.jsx:901,916,949` — `{KATTA_YAKUN.nom}` · `{w.nom}` · `{cur.nom}` (poyga kataklari)

**🔴 NEGA HECH KIM SEZMAGAN.** Xato faqat **aniq bosish ketma-ketligida** chiqadi (m4b-02:
8-ekran → «Hammada» → «Ba'zilarda»). To'g'ridan-to'g'ri o'sha ekranga o'tilsa — chiqmaydi.
Ya'ni qo'lda sinash bu sinfni tutmaydi; uni **audit interaktiv yurishi** tutdi.

**Asbob:** `raw-tr-scan.mjs` (repoda) — fayl ichida `maydon: { uz: … }` deb e'lon qilingan
nomlarni yig'adi, so'ng JSX-bola o'rnida `{X.maydon}` ni `tr()` siz qidiradi.
Shablon-satr (`${…}` — CSS) va prop-o'rni (`q={x.q}`) tashlab yuboriladi.

**Holat:** 95 nomzod. **Yolg'on ulushi yuqori** — ko'p faylda ma'lumot ta'rifining O'ZIDA
`tr()` bor (`label: tr({ uz… })`), skaner esa buni bir xil nom bo'yicha ajrata olmaydi
(masshtab tahlili kerak). Shuning uchun ro'yxat **qo'lda** ko'riladi: har nomzod uchun
«bu maydon qaysi massivdan keladi va u yerda `tr()` bormi» savoli beriladi.

**Ishonchli detektor — audit.** `npm run lint:layout` har yurishda sahifa-xatolarini
ro'yxatlaydi (`⚠️ sahifa-xatolari`). 1–4-modullarda bu bo'lim **bo'sh** — ya'ni o'sha
modullarda bu sinf yo'q (yurilgan yo'llar bo'yicha).


**Yopildi (2026-09-14 kech, foydalanuvchi ruxsati: «ehtiyotkorlik bilan, halol, sifatli»):** skaner qayta yurgizildi — bugun
**267** nomzod («95» eskirgan). Har nomzod alohida agentda (faqat o'qish) manba-massivigacha kuzatildi:
**HAQIQIY 6 · XAVFSIZ 261 · NOANIQ 0**. Oltovi ham `PmLesson18.jsx` (4c; HEAD'da ham bor edi — prodga chiqqan xato):
`:955` `{c.t}` `{c.res}` (CHEGARA) · `:1022` `{e.val}` `{e.fakt}` (HODISA) va shablon-satr `(${e.dav})` → «[object Object]» ·
`:1034` `{c.t}` · `:1878` `{v.t}` (HW_VARIANT). Nega audit tutmagan: 955/1022/1034 faqat «Kunni boshlash» bosilgandan
keyingi fakt-jurnali va chegara-tugmalarida; 1878 — yakun-sahifada uyga vazifa ochilganda.
Tuzatish: 7 joy `tr(...)` ga o'raldi (4 qator), matn va tuzilma o'zgarmagan. Darvozalar: esbuild ✓ jsx ✓ prompt ✓ ·
dark HEAD bilan diff 0 · til diff 0. Skaner qayta: to'rt qatorda nomzod yo'q; faylda qolgan 4 nomzod xavfsiz
(`gaugeHolat` va `save()` maydonni `tr()` bilan yozadi — o'qib tasdiqlandi).
Yolg'on-ijobiylarning uch sinfi (skanerga masshtab-tahlil qo'shilsa 267 → 6): `ACHIEVEMENTS.name` (18 fayl · 54 band,
hammasi satr) · ta'rifining o'zida `tr()` bo'lgan `HOMEWORK/GLOSSARY/OPTS/TASKS` · faqat satr saqlaydigan foydalanuvchi
ro'yxatlari (`list`/`saved`). Batafsil jadval (296 qator): `~/.claude/projects/-home-kali-Desktop-internetLesson/S32_SARALASH_2026-09-14.md`.
Commit YO'Q.
## 33 ✅ ARALASH YOZUV DARS MATNIDA — o'zbekcha so'z ichida kirill harflar (YOPILDI 2026-09-13 · F-0913-01)

> **YOPILISH (2026-09-13, F-0913-01):** 321 so'z almashtirildi — 7-modul 6 dars (MvpIterate 94 ·
> PmLesson34 93 · MvpBuild2 75 · PmLesson33 30 · MvpBuild1 19 · PmLesson32 8) + 2 kod izohi
> (Htmllesson1:3139, PmJtbdLesson:3865). Har o'zgargan qator ko'zdan o'tkazildi.
> **Raqam aniqlashtirildi:** pastdagi «233 · 18 fayl» `kirill-lotin-matnda` qoidasining keng
> sanog'i edi (qonuniy ruscha matn ham kirgan); so'z-darajasidagi aniq sanoq — **322**, shundan
> 1 tasi qonuniy (`PmLesson6` regex'ida `вс` + lotin `e`). 7-moduldan tashqaridagi qolgan 133
> «aralash» tokenning hammasi qonuniy (`\n` + ruscha so'z, `ru:` ichida) — tegilmadi.
> **Darvoza:** rejadagi «🟡→🔴 ko'tarish» o'rniga **yangi tor qoida** `aralash-yozuv-soz` 🔴
> qo'shildi (sabab va sinov: `MATN_KORPUS.md` §180). Darvozalar: 8 faylda esbuild ✓ jsx ✓ prompt ✓,
> `dark`/`til` 🔴 soni tahrirdan oldingi bilan bir xil (faqat 🟡 ogohlantirishlar kamaydi).
> **Aloqasiz, tegilmagan imlo:** `MvpBuild2:891` «Aziznang» · `PmLesson34:462` «qaerda».

**Topilishi (F-0912-15, 2026-09-13):** 7-modul layout auditida topilma matni o'qilganda
ko'rindi: «3/5 sinov**чи**da qoqildi». Tekshirilganda — bu yakka holat emas.

**Dalillar (o'quvchi ekranda shunday ko'radi):**
- `MvpIterateLesson:127` — «Metrik**ага** qara: yaxshilandimi?»
- `MvpIterateLesson:147` — «5 sinovchidan 3 tasi bir xil joy**да** qoqildi»
- `MvpIterateLesson:148` — «Metrika yoki pattern**га** bog'liq emas»

**O'lchov (`npm run lint:til`, `kirill-lotin-matnda` qoidasi):**

| Fayl | Soni | Fayl | Soni |
|---|---|---|---|
| `7-Modull/PmLesson34` | 59 | `7-Modull/PmLesson32` | 8 |
| `7-Modull/MvpIterateLesson` | 54 | `1-Modull/PmLesson1` | 6 |
| `7-Modull/MvpBuild2Lesson` | 46 | `pm/PmUserStoryLesson` | 4 |
| `7-Modull/PmLesson33` | 20 | qolgan 11 fayl | 1–3 tadan |
| `7-Modull/MvpBuild1Lesson` | 17 | **JAMI** | **233 · 18 fayl** |

**204 tasi 7-modulda** — ya'ni bu modul yozilganda matn ruscha manbadan ko'chirilgan va
harflar aralashib qolgan.

**Nega darvoza to'xtatmagan:** `lint:til` buni 🟡 (ogohlantirish) darajasida beradi, chunki
qoida `ru:` maydonlaridagi qonuniy kirill bilan farqni aniq ajrata olmaydi. Ya'ni darvoza
**ko'rgan, lekin to'xtatmagan**.

**Qanday yopiladi:** avtomatik almashtirish **ehtiyot bilan** — bu homoglif emas,
transliteratsiya (`ч→ch`, `ш→sh`, `ў→o'`, `қ→q`, `ғ→g'`, `ҳ→h`, `и→i`, `н→n`, `а→a`, `с→s`).
`ru:` maydonlariga TEGILMAYDI — ular chin kirill. Har o'zgargan qator qo'lda ko'riladi.
Yopilgandan keyin `lint:til` da bu qoida 🔴 ga ko'tariladi (aks holda qaytadi).

## 34 🔄 JAVOBDAN KEYINGI HOLAT PASTKI CHIZIQDAN TUSHADI — butun kurs sivirmasi (F-0913-02)

> **JARAYONDA (2026-09-13, foydalanuvchi: «§34 ni boshla, butun kursni tekshir»).**
> Asbob tayyor va kalibrlangan (`DARS_ETALON.md` 147 (e) «Asbob yopildi»). Sivirma: 109 dars ×
> **eng og'ir kombinatsiya** — `self` × `1366x768` × uz/ru (GitHub o'lchovida 1366 har holatda 1280 dan
> ~5px, self mentordan 10–40px ko'p toshgan). Topilgan har ekran keyin 8 kombinatsiyada tekshiriladi.
> Tuzatish — hisobot va foydalanuvchi tasdig'idan keyin.
>
> **1-urinish YAROQSIZ deb topildi (2026-09-13 22:24).** uz sivirmasi «288 ekran · 84 dars» dedi;
> namuna skrinshot bilan tekshirilganda ikki asbob-nuqsoni chiqdi: (1) bo'sh `min-height` li `div`
> chiziqni belgilagan (m1-05 s7 — yolg'on); (2) m2-05 da ekran-hisoblagich o'rniga «0 / 30»
> olingani uchun `progRead` yozuvni rad etgan — 19 ekran o'rniga 1-ekran 19 marta o'lchangan.
> Kalibrovka-7 + navigatsiya tasdig'i qo'shildi (`DARS_ETALON.md` 147 (e)). Isbot: m2-05 — 19 turli
> ekran, `NAV` 0 · m1-05 s7 yolg'oni yo'qoldi · m1-02 s11 haqiqiy qoldi · GitHub ikki darsi toza ·
> selftest tirik. Ruscha 1-urinish xotira tanqisligidan o'ldi. **2-urinish (uz+ru) boshlandi;**
> asbob endi har guruhdan keyin natijani diskka yozadi.
>
> **Uzilish sababi aniqlandi (22:55):** `systemd-oomd` foydalanuvchi sessiyasini kuzatadi — xotira
> bosimi **20 s davomida 50%** dan oshsa eng katta cgroup'ni o'ldiradi (Claude fon ishlari + vite
> birga ketadi). Bo'sh xotira 4 GB bo'lsa ham bo'ladi — mezon bosim, hajm emas. Tizim sozlamasiga
> tegilmadi. Yechim: `--par 1` + **`--resume`** (natija faylidagi dars × rejim × ekran o'tkazib
> yuboriladi) — o'ldirilsa, xuddi shu buyruq qolgan joyidan davom etadi. 2-urinish 6 darsda
> o'ldirildi; shu joydan `--resume` bilan davom ettirildi.
>
> **uz 2-urinish TUGADI (2026-09-14 01:46) — oraliq, skrinshot-tasdig'isiz raqamlar:** 109 dars ·
> 2078 ekran · 9092 bosish. **Haqiqiy E: 269 ekran · 84 dars** (≤10px 19 · 11–30 68 · 31–80 74 ·
> 81–200 83 · >200 25; boshlang'ich holatda 126, bosishdan keyin 143). Eng katta sinflar: izoh
> qutilari `frame-success/soft/frame` 117 · amaliyot «Bajardim» `lp-done-btn` 25 (10 tasi 7–8px
> chegarada) · `dd-pool` 13 · `bp-window` 13. Panel 2 · yakun-skroll 100 dars. A–D: 1 (m2-05 s15 cover).
> ⚠ m1-05 (12/17 ekran) va m1-14 (14/18) — 22:54 dagi o'ldirishda chala qolgan, qayta o'lchanadi.
> ru 2-urinish 01:46 da boshlandi. Namuna-tasdiq ru tugagach (brauzerli ishlar parallel emas).
>
> **O'LCHOV YOPILDI (2026-09-14 ~05:10) — tuzatish tasdiq kutadi.** uz 270 ekran · 84 dars · ru 327
> ekran · 92 dars (chala yurish 0, NAV 0; m1-05/m1-14 qayta o'lchandi). **Birlashma 335 ekran ·
> 92 dars:** kritik (>80px) 130 · o'rta 184 · kichik (≤10) 21. 28 namuna: cut↔scrollHeight
> ziddiyat 0/28, 12 tasi skrinshotda ko'z bilan tasdiqlandi (yolg'on topilmadi). To'liq jadval va
> naqshlar — hisobot-sahifada; yozuv `PIPELINE_STATE.md` (2026-09-13 → 14 §34).
>
> **PILOT — m4a-03 YOPILDI (2026-09-14, commit YO'Q).** Eng og'ir dars: 44 holat → **0** (uz/ru ×
> self/mentor × 1280/1366, `realFound=false` hammasida). Foydalanuvchi qarori: **Mentor kompyuterda ham
> birinchi bosishda yig'iladi** (`collapseOn = !mentorStatic` — 108 faylda bir xil qator, kursga ko'chirish
> shu yerdan). Asbobga 2 kalibrovka (yig'ilgan Mentor = panel · ko'rinmas matn D-dan chiqadi), selftest tirik.
> ⚠ Ko'r nuqta: bajarilgan ekranga «Orqaga» bilan qaytilgan holat o'lchanmaydi (ru s13 268px).
> Keyingi: Mentor-yig'ishni kursga yoyish → qolgan 91 dars qayta o'lchov → naqshma-naqsh.
> Tafsilot: `PIPELINE_STATE.md` «2026-09-14 — §34 PILOT».

**Topilishi (2026-09-13):** foydalanuvchi «GitHub darsida qirqilgan joy bor, debugging sahifasini
tekshir» dedi. 109 darslik layout-audit bu darslarni «toza» degan edi. Qo'lda skrinshot bilan
ko'rilganda uchta ekran chiqdi: m4c-03 s18 (xato javobda izoh 7–29 px) · m4c-03 s17 (yuborish
tugmasi 140–158 px pastda) · m1-09 s13 (5-qadam + zaxira-panel 56–94 px). Uchalasi tuzatildi.

**Nega audit ko'rmadi** (`DARS_ETALON.md` 147-qonun (e)):
1. `layout-lint.mjs` o'lchovdan oldin skrollni 0 ga qaytaradi va `.stage-content` toshishini
   o'lchamaydi — matn o'z qutisidan chiqmasa, ekran pastidan tushishi «toza».
2. Har ekranda **birinchi** bosiladigan element bosiladi; test ekranida bu ko'pincha to'g'ri
   javob — **xato javob holati** (izoh + «📖 Qisqa takrorlash») hech bir darsda o'lchanmagan.

**Nima qilinadi (buyruq bilan):**
- `layout-lint.mjs` ga E-detektor: ustunlar pastki cheti − `.stage-content` pastki cheti
  (ota-qirqish va yopiq `<details>` hisobga olinadi; yakun/summary ekranlari ataylab skroll —
  alohida bo'limda) + test ekranida **har variant** bosilib o'lchanadi.
- `--selftest` ga pastga toshiruvchi holat qo'shiladi.
- 109 dars uz/ru × self/mentor × 1280/1366 qayta yuritiladi; topilma sinfma-sinf tuzatiladi.

**Hajm taxmini:** GitHub ikki darsida 44 ekrandan 3 tasi haqiqiy (yakun ekranlaridan tashqari).
Shu nisbatda kursda ~15–25 ekran kutiladi — o'lchanmaguncha raqam aytilmaydi.

**Tayyor skretch-asboblar (seans skretchida, repoga olinmagan):** `overflow-sweep.mjs` (skroll
nomzodlari) · `precise.mjs`/`inspect.mjs` (ota-qirqishli aniq o'lchov) · `prog.mjs` (DoSteps
qadam-holatlari) · `fbinner.mjs` (izoh qutisi ichki qirqilishi — GitHub darslarida 0).

## 35 ✅ SAQLANGAN JAVOB TURI TEKSHIRILMAYDI — matn maydoni oq ekran berishi mumkin (F-0914-10, 2026-09-14)

**Topilishi:** m2-04 skrinshot-sinovida soxta `picked: true` javobi «if yozing» ekraniga tushdi →
`value.trim is not a function` → React butun darsni chizolmadi (oq ekran). O'quvchi o'zi bunday qiymat
yozmaydi; xavf faqat dars ekranlari **soni o'zgarmay joyi almashtirilganda** (eski indeksdagi boshqa turdagi
javob yozma mashqqa tushadi). Server javobni JSON'da o'zgartirmasdan qaytaradi — server tomonidan xavf yo'q.

**Yopildi (foydalanuvchi: «shu ishni hozir qilamiz»):** 26 joy · 22 fayl —
`useState(storedAnswer?.X || '')` / `?? ''` → `typeof storedAnswer?.X === 'string' ? storedAnswer.X : ''`.
Fayllar: CssLesson1 CssPractice Htmllesson1 HtmlPractice VsCodeLesson JsFunctionsLesson JsVarsLesson ReactApiPostLesson ReactBuildSiteLesson ReactCrudPracticeLesson ReactFirstComponentLesson ReactProjectDayLesson ReactPropsReuseLesson ReactRouterPracticeLesson ReactStateEffectLesson FullPipelineProjectLesson GithubActionsLesson AuthEnvLesson FullstackFeedbackLesson FullstackProjectDayLesson NodeServerLesson PostgresCrudLesson 
Tekshiruv: 22 fayl darvozalari — esbuild ✓ · jsx ✓ · prompt ✓ · dark 44 = 44 (HEAD) · til 31/63 = 31/63 (HEAD).
Kurs o'lchovi tahrir paytida m4-06 (PostgresCrud) ni o'lchayotgan edi — yozuvi to'liq (21/21, NAV 0), qayta o'lchov shart emas.

**Massiv-tur yopildi (2026-09-14 kech, foydalanuvchi: «KATTA'dagi 4 tasi, keyin qolganini; sifat biz uchun muhim»):**
ro'yxatdagi «4 fayl» aslida **31 qator · 16 fayl · 33 ifoda** chiqdi. Grep uch bosqichda kengaytirildi, har bosqich yangi shakl ochdi:
`storedAnswer?.X || []` (10 joy) → `|| [null, null, null]` va to'g'ridan `.slice()/.length` (5) →
`(storedAnswer && storedAnswer.X) || []`, zaxira-zanjirli `|| hol.X || []` / `|| readCheck() || []` bilan birga (15) →
`(storedAnswer?.cards || readFullCards()).filter` (1). Hammasi `Array.isArray(storedAnswer?.X) ? storedAnswer.X : <eski zaxira>`
ko'rinishiga keltirildi, zaxira-zanjir saqlandi (`: (hol.X || [])`). Har joy o'qib tasdiqlandi — hammasida massiv-metod ishlatiladi.
Fayllar: GitLesson GithubActionsLesson JsIntroLesson HtmlPractice PmLesson9 JsVarsLesson PmUserStoryLesson PmMetricsLesson
PmJtbdLesson PmLesson24 PmLesson16 PmLesson4 PmLesson14 PmLesson22 PmLesson12 PmLesson1.
Isbot: node'da eski/yangi ifoda `true`/obyekt/matn bilan sinaldi — eski `.includes/.map/.every/.find/new Set` da yiqiladi, yangi hech qachon.
Darvozalar 16 fayl: esbuild ✓ jsx ✓ prompt ✓ · dark chiqishi HEAD bilan diff 0 · til sonlari HEAD bilan teng · `vite build` toza (P0 ikki-bosqich).
`storedAnswer ? [doimiy] : []` shakli (CssPractice, RoutingLesson, ReactPropsReuse…) ataylab tegilmadi — saqlangan qiymat massiv sifatida ishlatilmaydi.
Saboq: «4 fayl» hisobi tor regex'dan chiqqan edi (faqat `[]`); keyingi sinf-ovida grep har shaklga kengaytirilib, qoldiq nolga tushguncha takrorlanadi.

**Matn-sinfi (KODING `code:`) yopildi (2026-09-14 kech, foydalanuvchi ruxsati):** 16 joy · 16 fayl —
`code: (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null) || (saved && saved.code) || STARTER` —
zaxira-zanjir aynan saqlandi (bo'sh matn avvalgidek STARTER'ga tushadi). Uch yakka joy ham: PmLesson13:844 `links`
(obyekt-tekshiruv), PmLesson13:1333 `si` (son), PmLesson24:835 `qaror` (matn). Jami **19 qator · 17 fayl**.
Halol qayd: `code` uchun yiqilish-yo'li tekshirildi (PmLesson6) — `ensureHelper` matn bo'lmagan qiymatni matnga
qo'shib yuboradi, ya'ni oq ekran EMAS, muharrirga «true» kabi axlat tushadi; himoya shuni oldini oladi.
Tartib: 13 fayl darhol, 4 ta m1 fayli ru-o'lchov m1 dan o'tgach (vite HMR o'lchanayotgan sahifaga tushmasin).
Darvozalar 17 fayl: esbuild ✓ jsx ✓ prompt ✓ · dark HEAD bilan diff 0 · til sarlavhasiz diff 0 · `vite build` ✓ (ikki marta, P0) · `lint:jsx` 156 fayl 0.
Tegilmagan (ataylab): `picked ?? null` / `pick || null` / `place || {}` — solishtirish va indeks, noto'g'ri tur yiqitmaydi.
**§35 to'liq yopiq: matn 26 + massiv 31 + KODING 19 = 76 qator.**

## 36 ✅ SAQLANGAN JAVOBDAN OBYEKT-QIDIRUV / INDEKS HIMOYASIZ — ekran yiqiladi (F-0915-02, 2026-09-15)

**Topilishi:** F-0915-01 sarlavha-o'lchovi soxta `{picked:true}` javob bilan m1-01 ni yiqitdi. §35 matn/massiv/KODING
shakllarini yopgan, lekin «saqlangan qiymat bo'yicha `.find()` yoki `ARR[qiymat]`, natija tekshirilmaydi» shakli qolgan.
Real xavf: ekranlar joyi almashsa, eski indeksdagi boshqa turdagi javob shu ekranga tushadi.

**Ro'yxat (yuklanishda yiqiladi — 14 joy · 8 fayl):**
| Fayl | Ekran | Yiqiladigan qator | Tetik qiymat |
|---|---|---|---|
| InternetLesson | s3 | 895/896 `cur.l` | `picked: true` |
| InternetLesson | s5 | 947/949 `cur.name/.tld/.note` | `picked: true` |
| PmLesson14 | s0 | 748 `HOOK_OPTS[picked].t` | `picked: true` / `2` |
| CssLesson1 | s6 | 1176–1178 `cur.hex/.n` | `sel: 8` / `true` |
| CssLesson1 | s7 | 1211/1215 `cur.css/.ff` | `font: 'arial'` |
| PmLesson17 | s9 | 1377/1380 `raund.*` | `ri: true` / `-1` |
| PmLesson11 | s9 | 1275 `cur.bolim` | `ri: true` / `-1` |
| PmLesson25 | s9 | 1346 `raund.juft.map` | `raund: true` |
| PmLesson25 | s4 | 913 `S4_DUO[pick].why` | `tanlov: 2` |
| PmLesson23 | s9 | 1324 `.find(…).t` | `pairs: { q1: true }` |
| PmLesson8 | s9 · s4 · ScreenBaho · s8 | 1398 · 1019 · 946 · 1251 `cells[k].push` | `{ id: true }` |
Bosishda yiqiladigan (yuklanishda emas): PmLesson15 s9 (1347/1353), PmLesson21 s9 (1321).
§35 massiv-qoldig'i: PmMetrics:1086 `(storedAnswer?.cards || …).slice`, PmJtbd:1036 `src.filter`.
§35 matn-qoldig'i (sarlavha-o'lchovi vite-jurnalida tutildi): ReactFirstComponentLesson (m3-03) s15 — 2338 `useState(storedAnswer?.picked || '')`
→ 2340 `value.replace` (`picked: true` bo'lsa yiqiladi). §35 grepi `picked` kalitini qamramagan — yopishda kurs bo'yicha
`useState(storedAnswer?.picked || '')` + matn-metodi shakli ham qidiriladi.
Xuddi shu sinf: NestArchAliveLesson (m4a-01) s18 — 1529 `resName = storedAnswer.picked || 'Task'` → 1545 `R.toLowerCase` (`picked: true` bo'lsa yiqiladi).
Sarlavha-o'lchovi (soxta javob) tutgan yiqilishlar jami 5 dars: m1-01 · m3-03 · m4-15 (PmLesson14 s0, yuqoridagi ro'yxatda) · m4a-01 · (m3-11 — alohida, yuklanmaydi).

**Tasdiq:** tasnif faqat-o'qish agentida (57 o'qish); 3 joy qo'lda tasdiqlandi (InternetLesson:895, CssLesson1:1215, PmLesson14:748).
Tekshirilib XAVFSIZ chiqqanlar va sabablari: PIPELINE_STATE «F-0915-02».

**Nima qilinadi (buyruq bilan):** har joyda natija tekshiriladi, qiymat noto'g'ri bo'lsa ekran boshlang'ich holatda ochiladi
(`const cur = …find(…); const done = !!cur;` · `ARR[i]` uchun `Number.isInteger(i) && ARR[i]`). Matn va ball o'zgarmaydi.
Tekshiruv: har fayl `npm run gates` + soxta javob bilan brauzer-probe (yiqilish 0).

**Qo'shimcha topilma (16.09, probe tutdi, ro'yxatda yo'q edi):** PmMetrics `ScreenMetricWorkshop` (m8-01 s7) — `storedAnswer.northStar` matn bo'lmasa `validateNorthStar(...).trim` yiqiladi → tuzatildi (typeof string). **§36 TUZATILDI 2026-09-16:** 14 fayl · 22 joy, boshlang'ich-holat sanitizatsiyasi (`f2-fix.mjs`); probe `f2-probe.mjs` 14 dars × har ekran, soxta noto'g'ri-turdagi javob: yiqilish 0. Ov-bandi: darslik-/pm-tekshiruvchi.

## 37 🔄 SARLAVHA IKKINCHI QATORGA TUSHADI — oxirgi so'z / 🏆 yolg'iz qoladi (F-0915-01, 2026-09-15)

**Topilishi:** foydalanuvchi §34 3-C varaqlarida (m1-14 s14 🏆). Kurs o'lchovi: 7-modulsiz 96 dars, noyob sarlavha 1457 —
ikki+ qatorli uz 112 · ru 242. Sabab: 38px da joy 1–16 px yetmaydi + 74 darsda h1 ga qo'lda `maxWidth`.

**Bajarildi (foydalanuvchi: «74 ta faylga ehtiyotkorlik va aniqlikda», matn so'roqsiz o'zgarmaydi, shrift juda kichraymasin):**
- 74 qator · 74 fayl: `className="title h-title…" style={{ maxWidth: N }}` → style olindi.
- 98 fayl: `.h-title { font-size: clamp(22px,4vw,38px); }` → `clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance;`.
- Skript sanoqni tekshiradi (74/74/98 bo'lmasa yozmaydi): `olchov-2026-09-14/sarlavha-tahrir.mjs --fs 36`.
- Qonun: `DARS_ETALON.md` 11-N **150-qonun**.

**Tekshiruv:** yangi qoida 98 · eski qoida 0 · `maxWidth` qoldig'i 0 · 7-modul/eski/demo 23 fayl tegilmagan · esbuild ✓ · jsx 0 ·
dark/til chiqishi tahrirdan oldingi bilan farq 0 · `vite build` ✓.
**Keyin-o'lchov (2026-09-15 23:41, 81 dars, 1271 noyob sarlavha):** ikki qatorli uz 113 → **61** · ru 245 → **160** ·
qatori ko'paygan 0 · oxirgi qatorda yolg'iz so'z **0**. Qolganlar haqiqatan uzun, `balance` bilan teng bo'lingan.
**3-qadam yopildi (2026-09-16, F-0916-01):** 13 nishon-ekrandan 12 tasi tuzatildi (haqiqiy bosishlar bilan o'lchangan); layout-lint kritik uz 12 → 5 · ru 16 → 6 (qolganlar: tegilmaydigan m8-01 s6 / m1-01 s15, Q1 qaror, m2-02 dizayn, m1-01 s1, m1-14 s14 ru). Q1 (m8-01 s11) va Q5 (§38) ochiq.
**Qamrovdan tashqari:** 7-modul (12 fayl) — qayta yig'ilganda 150-qonun bilan quriladi.

## 38 ⬜ PM KODING PANELI — bajarilgach «Nima bajarilishi kerak» kartasi yig'ilmaydi (F-0916-01 Q5, 2026-09-16)

**Topilishi:** m4b-02 (PmLesson16) s10 layout-o'lchovi: Yordam ochiq +116 · bajarilgach +124 px (chegara 690).
`kdpanel` = PM KODING qolipi, 18 faylda bir xil. Yulduzcha (⭐) qo'shimcha vazifa tarif kartasiga tayanadi — kartani
butunlay yashirib bo'lmaydi.
**Foydalanuvchi qarori (2026-09-16, Q5-A):** bajarilgach tarif kartasi YIG'ILADIGAN bo'ladi (sarlavha qoladi, bosilsa
ochiladi); 18 faylga tegadi → alohida kunda, bu yerdan. Darsga 16.09 da tegilmadi.
**Nima qilinadi:** `kdpanel` ichida `is-done` holatida tarif/shartlar bloki `<details>`-naqshiga o'tadi (yopiq), Yordam/⭐
o'z joyida; har faylda gates + haqiqiy-bosish skrinshoti (shot-klik2.mjs).

## 39 ⬜ YAKUN EKRANIDA GLOSSARY — 193-qator qoidasiga zid 22 dars (F-0916-02, 2026-09-16)

**Topilishi:** tungi o'lchov m1-01 s21 da 404px `div.gloss` topdi; DARS_ETALON 193-qator «glossary yakunda BO'LMAYDI»
↔ 1441 checklist 4.2 «+ glossary» — o'ziga zid edi. **Foydalanuvchi qarori (G-A):** 193-qator to'g'ri; checklist 4.2
tuzatildi (16.09). Flashcard sahifasi glossary'ni takrorlaydi, yakun Nishonlar kolleksiyasi bilan tugaydi.
**Ro'yxat (22 faol dars, `className="gloss`):** InternetLesson · CssLesson1 · Htmllesson2 · JsFunctionsLesson ·
PracticeLesson1 · PmLesson5 · PmLesson6 · PmLesson7 · ReactApiGetLesson · BotApiButtonsLesson · 7-Modul: MvpArch ·
MvpBuild1 · MvpBuild2 · MvpIterate · PmLesson26 · 28 · 29 · 30 · 31 · 32 · 33 · 34.
**Nima qilinadi (alohida kun):** yakun ekranidan glossary bloki + `GLOSSARY` const + `open/setOpen` + `.gloss*` CSS olinadi
(m1-01 namunasi: 193-qator izohi); atamalar Flashcard sahifasida borligi tekshiriladi (yo'q bo'lsa flashcard'ga
qo'shiladi — atama yo'qolmaydi); har fayl gates + smoke.

## 40 ⬜ ARENA MATNI SERVERGA HAM YOZILSIN — 97 dars (F-0918-02, 2026-09-18)

**Nima:** jonli arena (CodeStrike, `quiz-N`) javobida dars serverga faqat raqam yuboradi (`submit_answer`: option/correct/elapsed); dars-testlarida esa `recordAttempt` matnlarni (`question/options/picked/correct/lang`) ham yozadi. School API (Laravel) har savol-yozuvda matn-maydonlarini `required` deb tekshiradi → 18.09 staging'da 8 arena-yozuv × 5 = 40 xato, hodisa 422. Server hozircha matnsiz yozuvni `questions[]`ga kiritmaydi (himoya), arena natijasi faqat `arena_top_N` nishonda.

**Foydalanuvchi qarori (18.09):** Axadulla MVP'da onFinished'dan oladi (u to'liq, o'zgarmaydi), lekin serverga HAM yoziladi — «ikkalasi tayyor, istasang ol». 

**Qanday:** `src/live/useLiveSession.js` `submitAnswer` (yoki yangi `submitArena`) arena uchun `recordAttempt`ga o'xshab `texts` qabul qilsin → `record_attempt` RPC (screen = `QUIZ_BASE_IDX + qi`, matn `QUIZ_BANK[qi]`dan: savol, variantlar, tanlangan, to'g'ri, lang) → server `byScreen` orqali matnni topadi, arena-yozuv to'liq chiqadi (int-test `results_details` «quiz-0 matn bilan» allaqachon isbotlangan). Har darsda bitta chaqiruv-joyi (`live.submitAnswer(QUIZ_BASE_IDX + qi, \`quiz-${qi}\`, i, correct, elapsed)`) → codemod 97 dars + `build-lms` qayta yig'ish (`lms/` 102 + `lms-staging/` 2) → CRM'ga yuklash SHUNDAN KEYIN (ikki marta yuklamaslik uchun) yoki hozir yuklab keyin almashtirish — foydalanuvchi tanlovi.

**Darvoza:** `npm run gates -- <fayl>` har darsda · `smoke:onfinished` 140/140 (onFinished o'zgarmasligi) · E2E 22/22 · staging'da bitta jonli sinov: arena-yozuvlar `questions[]`da matn bilan, 201.

## 41 🔄 NISHON FAQAT BIRINCHI URINISHGA (76 dars, 195 trigger) + «QAYTADAN» = MASHQ (98 dars) (F-0918-04, 2026-09-18)

**Nima:** DragDrop / tartiblash / o'yin / debug / koding ekranlari `onAnswer` ni faqat muvaffaqiyatda, doim
`correct: true` bilan chaqiradi → necha marta adashsa ham nishon beriladi («tekin nishon»). 18.09 LMS sinovi:
testda 2/5, nishon 4/4. Qonun: `DARS_ETALON.md` **151-qonun**; matn: `MATN_KORPUS.md` §183.

**O'lchov (18.09):** `ACH_TRIGGERS` 98 faylda, jami 343 trigger. Test — 148 (azaldan birinchi urinishga, tegilmaydi).
**Test emas — 195 trigger, 76 faylda:** exploration 61 · practice 50 · case 29 · koding 23 · rule 11 · builder 10 ·
challenge 6 · debug 3 · do 1 · game 1. DragDrop ishlatadigan fayl — 44.

**Pilot ✅ (18.09):** `src/1-Modull/InternetLesson.jsx` — s13b (o'yin: xato server) + s13c (tartiblash: to'liq xato
joylash) + **6-band «birinchi o'tish — hisob, Qaytadan — mashq»** (`firstPass` muhri, `earn` muzlashi, mashqda
`submitAnswer`/`recordAttempt` yo'q, `finishLesson` birinchi o'tishni yuboradi). Boshsiz Chrome'da olti holat o'tdi,
konsol xatosi 0. `npm run gates` — yangi topilma 0. Server tomoni (takror jonli natija yuborilmaydi) alohida yopildi —
`BACKEND_REJA_UZ.md` Qoida 3, 18.09 yangilanishi.

**19.09 ERTALAB (foydalanuvchi qarorlari Q1–Q6):** ✅ **solo ball teshigi yopildi** (97 dars ildiziga blok; brauzerda 63/63
ekran — `ach-probe --solo`) · ✅ Q4: 7 diskret test + Routing s15 + NestArch F5 · ✅ Q3 a/c/e + M2/M3 · ✅ Q5 · 153-qonun
(ball halolligi). **QOLDI:** `MATN_TAKLIFLAR.md` (Q2 — tasdiq) · M1 + F-0919-01 («qadoq» → sodda so'z — tasdiq) · staging'da
haqiqiy solo sinovi (yig'ma tayyor: `b-tolqin/staging-sinov/`) · `lms/` qayta yig'ish → server-deploy (katalog) → CRM.

**B TO'LQIN ✅ (18.09 tun) — 100 ekran, 66 dars:** 178 trigger 6 partiyada bittalab o'qildi (`b-tolqin/inventar-P1…P6`), har
ulangan ekran brauzer-probda 7 holat bilan isbotlandi (`scripts/ach-probe.mjs`, `b-tolqin/probe/`), bosh agent har partiyani
mustaqil qayta tekshirdi (prob · gates · lintcmp · lint-keys · `--seal`). ⏭ 0 · ⏸ 8 (ikkinchi tekin nishon / senariy —
qaror). Mehnat 56 trigger / 32 dars · bonus 28 dars (hammasida ko'pi bilan bitta). Q6: 5 debug-ekran haqiqiy topshiriq.
T9 ball (8-A): tartiblash testlari birinchi to'liq urinishga. Reja/hisobot: `b-tolqin/TUNGI_REJA.md`, `TUNGI_HISOBOT.md`.
**QOLDI:** matn to'lqini (`MATN_TAKLIFLAR.md` — 49 taklif, tasdiq) · ⏸ 8 qaror · 7 diskret-tanlov testi (8-A dan tashqari) ·
23 yozma test (diskret urinish yo'q) · **solo ball teshigi** (`solo-ball.md`, qaror) · o'lik `earn` (4) · `lms/` qayta yig'ish.

**A TO'LQIN ✅ KOD YOZILDI (18.09 tun, F-0918-07 + 6-band) — 97 dars:** `scripts/codemod-first-pass.mjs` (quruq rejim standart;
takror yurishda SKIP; `saved` va React-import himoyasi). Pilot 1 · G1 69 · G2 22 (skript) · G3 5 (qo'lda: JsIntro / PmLesson5 /
FullstackFeedback — `reset` endi nishonlarni o'chirmaydi; EdgeCasesTest / JestUnitTest — ikkinchi test-komponent `Screen16` ham
`fpPractice` bilan). Har darsda: `firstPassRef` + `fpPractice`, `earn` muzlashi, `QuestionScreen` mashqda serverga yozmaydi,
`finishLesson` birinchi o'tishni yuboradi, progressda `missed` + `firstPass`, umumiy `missed` infratuzilmasi (UI'siz — B to'lqin
uchun tayyor), **`onFinished(sealPayload(id, payload))`**. Markaz: `src/live/resultDetails.js` (`sealPayload` / `unsealPayload`;
kalit = dars + PIN + rejim; mount'da tozalanadi; JSON-nusxa). Doimiy sinov: `npm run smoke:onfinished -- --seal` (I10 qayta
bosish = aynan o'sha yuk · I11 «Qaytadan» → mashq → yakun = birinchi o'tish). **QOLDI:** (1) **B to'lqin** — `AchRule` + CSS +
`miss()` nuqtalari 76 darsda (o'lchanmagan; A savatdagi har ekran ochib tasdiqlanadi); (2) `PmLesson7` + `7-Modull` 12 dars —
`onFinished(payload)` muhrsiz (shakli boshqa, `lms/` da yo'q); (3) ~~uy-vazifa fayllari~~ ✅ ko'rildi: 18 tasining hammasida `if (finished) return; setFinished(true)` — natija bir
ochilishda bir marta ketadi, muhrlash kerak emas; (4) F5 dan keyingi muhr (Axadulla javobiga bog'liq — kerak bo'lsa faqat `resultDetails.js`);
(5) `review` rejimi ko'rilmagan; (6) `lms/` qayta yig'ish.

**B savat ✅ YOPILDI (18.09 kech, F-0918-06 → `DARS_ETALON.md` 152-qonun):** 19 «tekin» triggerdan 15 tasi haqiqatan
tekin — **12 tasi bonus bo'lib qoldi** (9 o'zgarishsiz · 3 tasida faqat tavsif rostlandi: BotIntro `keyMaster`,
PmLesson4 `pairFinder`, PmLesson5 `splitter`) · **1 tasi testga ko'chdi** (Htmllesson2 `struktura` s5 → s5b; brauzerda
to'rt holat ✓) · **2 tasi mehnat nishoni** (PmLesson1 s6, PmMetrics s10). **4 tasi aslida tekin emas → A savatga**
(CssLesson2 s7 · PmLesson8 s4 · ApiPostman s3 · NodeServer s14). Reyestr — 152-qonunda. Tahlil:
`feedback/F-0918-04/b-savat-takliflar.md`. ⚠ Saralash skripti `hint` / `reject` / `frame-warn` / `!== TARGET` ni
xato-belgi deb tanimagan — **A savatda teskari xato (aslida tekin ekran) bo'lishi mumkin**: codemod paytida har A ekran
ochib tasdiqlanadi; tekin chiqsa — 152-qonun bo'yicha (darsda bonus yo'q bo'lsa bonus, bor bo'lsa ko'chirish).
**Yo'l-yo'lakay topilmalar (tuzatilmagan):** JsConditions s15 `firstif` meta'da `test`, mexanika — harf terish (mehnat) ·
CssLesson2 `markaz` tavsifi vazifaga mos emas («markazga» ↔ `space-between`) · NodeServer s14 da Mentor/audio javobni
topshiriqdan oldin aytadi.

**Qanday (sweep):**
1. **Avval saralash, keyin kod.** 61 ta `exploration` va 29 ta `case` triggerining ko'pi — 10-bo'lim taqiqiga zid
   bog'langan bo'lishi mumkin (toggle/kashfiyot ekraniga nishon). Har trigger uch savatdan biriga tushadi:
   (a) haqiqiy challenge → 151-naqsh; (b) xato qilib bo'lmaydigan ekran → nishon boshqa ma'noli ekranga ko'chadi
   yoki shart o'zgaradi (**foydalanuvchi qarori kerak — ro'yxat bilan**); (c) test → tegilmaydi.
2. Umumiy bo'laklar (`AchMissCtx`, `AchRule`, ildizdagi `missTry`) har darsda bir xil — etalondan ko'chiriladi;
   darsga xos qism faqat «xato urinish qayerda yonadi» (151-qonun jadvali bo'yicha).
2a. **6-band HAMMA 98 darsga tegadi** (test-nishonli darslarga ham): ildizda `firstPassRef/practice`, `earn` va `reset`,
   `QuestionScreen`da `practice` sharti, `finishLesson`da `ans`. `finishLesson` darslarda deyarli bir xil — codemod
   bilan (97 darslik `recordAttempt` codemod'i namunasi), keyin har darsda gates.
3. `AchRule` matni o'zgartirilmaydi (§183 — hamma darsda aynan bir xil ikki gap, uz+ru).
4. LMS yig'malari (`lms/`, `lms-staging/`) sweep tugagach bir yo'la qayta yig'iladi — orada CRM'ga yuklanmaydi.

**Darvoza:** `npm run gates -- <fayl>` har darsda (yangi topilma 0) · `npm run lint:jsx` 0 · har mexanika turidan
kamida bitta darsda brauzer-sinovi (to'rt holat) · `smoke:onfinished` (onFinished `achievements` shakli o'zgarmaydi).

## 42 ⬜ «NISHON» → «BADGE» — BUTUN LOYIHA BO'YICHA (foydalanuvchi, 2026-09-18)

**Nima:** foydalanuvchi 18.09 da 151-qonun qatorlari uchun «Nishon emas, Badge yoki Badge'lar deylik» dedi. O'lchov:
o'quvchi ko'radigan o'zbekcha matnda «nishon» — 238 marta, «Badges» — 15 marta (asosan sarlavha). Bir darsda ikki so'z
yurmasligi uchun (bir tushuncha — bir nom) tunda uch qator «nishon» bilan qoldi; almashtirish BUTUN loyihada bir yo'la.
**Qanday:** (1) foydalanuvchi bilan aniq shakllar: «Badge» / «Badge'lar» / «badge'ingiz» (apostrof-qo'shimcha qoidasi
MATN_ETALONI bilan); (2) MATN_ETALONI LUG'AT + `til-lint-rules.json` qoidasi; (3) codemod — faqat o'quvchi matnida
(`uz:` qiymatlari, audio-matnlar), kod nomlari (`earn`, `ACH_*`) tegilmaydi; (4) KORPUS §63, §183, §184 matnlari;
(5) `lint:til` + 👦 o'qish. ru: «значок» — alohida qaror.


## 43 ⬜ SUDRASH-TARTIBLASH: BLOK O'Z KATAGIGA QAYTSA — TAKRORLANADI (39 dars, F-0922-54, 2026-09-22)

**Nima:** `DragDropOrder` komponentining `place()` funksiyasida bitta shart to'liq emas:

```js
let np = from === 'pool' ? pool.filter(x => x !== id) : pool.slice();
if (occ) np = [...np, occ];        // ← occ = KATAKDA turgan blok
```

Blok o'z katagidan olinib, **o'sha katakka** qayta tashlanganda (`from === slotIdx`) `occ` — o'sha blokning
o'zi bo'ladi. Kod avval katakni bo'shatadi, blokni qaytadan qo'yadi, keyin `occ` ni «siqib chiqarilgan blok»
deb pastdagi ro'yxatga qaytaradi → blok bir vaqtda **ham katakda, ham ro'yxatda** qoladi. Ro'yxatda takror
`key` paydo bo'lgani uchun React ham noto'g'ri chizadi. Mentor topdi (ReactIntro, 17-ekran): shoshib
sudraganda ikkita blok ko'payib ketgan.

**Yechim (bitta shart):** `if (occ && occ !== id) np = [...np, occ];`
Boshqa to'rt holat (bo'sh katakka · band katakka · katakdan katakka · to'la doskada) o'zgarishsiz —
`place()` mantig'i koddan ko'chirib alohida sinaldi, 6/6 holat takrorsiz va yo'qotishsiz o'tdi.

**O'lchov:** `grep -rl "if (occ) np = \[...np, occ\];" src/ --include="*.jsx"` → **40 fayl**.
Ulardan `src/3-Modull/ReactIntroLesson.jsx` 2026-09-22 da tuzatildi (F-0922-54) — **qolgani 39 fayl**.
`DragDropOrder` har darsga nusxalangan (umumiy modul emas), shuning uchun tuzatish ham nusxa-nusxa boradi.

**Qanday:** codemod bilan bir yo'la (satr aynan bir xil), keyin har tegilgan faylga `npx esbuild` +
`npm run lint:jsx`; namuna-darsda sudrab-qo'yib ko'z bilan tekshiruv. Sinf qonuni: takror `key` beradigan
har qanday ro'yxat-holati — tekshiruvchi rol-fayliga ov-bandi bo'lib qo'shilsin.

## 7-MODUL — LIGATURA QOLDIG'I (F-0922-19, 2026-09-22)

2026-09-22 da butun loyihada `JetBrains Mono` ligaturasi o'chirildi (158-qonun): **115 fayl ·
2402 CSS e'loni + 63 inline uslub**. **7-Modul foydalanuvchi qarori bilan chetda qoldirildi**
(«hozir umuman o'ylama»).

**Qoldiq: 12 fayl · 88 e'lon** — `MvpArchLesson` 7 · `MvpBuild1Lesson` 9 · `MvpBuild2Lesson` 8 ·
`MvpIterateLesson` 8 · `PmLesson26` 10 · `PmLesson28` 6 · `PmLesson29` 5 · `PmLesson30` 5 ·
`PmLesson31` 7 · `PmLesson32` 13 · `PmLesson33` 5 · `PmLesson34` 5.

**Qanday:** bir buyruq — `node scripts/codemod-ligatura.mjs src/7-Modull/*.jsx`
(skriptning o'zi 7-Modulni atayin chetlab o'tadi, shuning uchun fayllar OCHIQ beriladi).
Keyin: `npm run gate:esbuild -- src/7-Modull/*.jsx` + `npm run lint:jsx` +
`node scripts/codemod-ligatura.mjs --check` + bitta darsda kod-ekrani skrinshoti.

**Qachon:** 7-Modul ustida ish boshlanganda, birinchi qadam sifatida.

## 7-MODUL — «dunyoga chiqarish» qoldig'i (F-0922-21, 2026-09-22)

`m2-12` da deploy izohi bittaga keltirildi: **«internetga chiqarish»** (KORPUS §196).
7-Modul tegilmagani uchun bitta qoldiq bor:
`src/7-Modull/MvpBuild2Lesson.jsx:792` — «Vercel mahsulotingizni **dunyoga chiqarmoqda**…»

**Qanday:** 7-Modul ochilganda «dunyoga» → «internetga» (1 joy), keyin `npm run gates -- <fayl>`.

## PM ZANJIRI — «imkoniyat/qiyinchilik» atamasi (F-0922-22, 2026-09-22)

`m2-02` (`PmLesson4` + uy vazifasi) atamasi **«muammo → yechim»** ga o'tkazildi (KORPUS §198):
449 almashtirish, ikki tilda. Sabab: dars nomi («Muammodan yechimga»), mexanika (`mt-pain` sinfi)
va mentor topilmasi — uchalasi ham shu so'zni talab qilardi.

**Qolgan 7 fayl · imkoniyat 74 · qiyinchilik 56:**

| Fayl | imkoniyat | qiyinchilik |
|---|---|---|
| `2-Modull/PmLesson5.jsx` (m2-07) | 45 | 1 |
| `2-Modull/PmLesson5.homework.jsx` | 15 | 0 |
| `pm/PmUserStoryLesson.jsx` | 9 | 0 |
| `6-Modull/PmLesson25.jsx` | 0 | 30 |
| `1-Modull/PmLesson1.jsx` | 0 | 19 |
| `1-Modull/PmLesson3.jsx` | 2 | 3 |
| `hw-demo/main.jsx` | 3 | 3 |

**🔴 AVVAL QAROR, KEYIN ISH — ko'r-ko'rona almashtirilmaydi.** `PmLesson5` (m2-07 «Dekompozitsiya»)
da kontekst BOSHQA: «Har imkoniyatni **tarozidan** o'tkazing» — bu prioritetlash, u yerda
«imkoniyat» (nima qurish **mumkinligi**) o'rinli bo'lishi mumkin. Har faylni alohida ko'rish kerak:
atama «feature» ma'nosidami yoki «imkon» ma'nosidami.

**Qanday (qaror bo'lgach):** `PmLesson4` da ishlatilgan **aynan-ibora jadvali**
(`scratchpad/pm4-term.py` naqshi) qayta ishlatiladi; ruscha uchun **§199** majburiy —
rod/kelishik/olmosh; oxirida matnni **o'qib chiqish** (22.09 da 5 xato faqat shunda topilgan).

## LAYOUT TOSHISHI — umumiy komponentlar (F-0923-01, 2026-09-23)

`layout-lint --lang ru` 12 darsda nuqson ko'rsatdi. **Element bo'yicha guruhlanganda
ma'lum bo'ldi: bu 12 alohida xato emas, bir nechta UMUMIY KOMPONENT.**

| Sinf | hodisa | toshish | nima |
|---|---|---|---|
| `div.card.ach-coll` | 42 | 205–313px | 🏅 nishon-kartasi (yakun ekrani) |
| `div.frame-soft` | 18 | 5–22px | «Yana urinib ko'ring» — xato-javob izohi |
| `div.gloss.fade-up` | 12 | **383–421px** | 💡 kalit so'zlar (glossary) |
| `div.frame-success.fade-step` | 11 | 22–52px | yashil muvaffaqiyat qutisi |
| `div.ms-row.p` | 7 | 112px | mentor-statistika qatori |
| `button.btn.cc-run` | 6 | 22–169px | ▶ RUN tugmasi |
| `div.card.fade-up` | 6 | 303px | umumiy karta |
| `button.hw-big` | 12 | 134–155px | uy-vazifa tugmasi |
| qolgani (frame · hint · term · cl-shelf · hk-card) | ~14 | 6–47px | chegarada |

**🔴 BUGUNGI ISHDAN EMAS — isbotlangan.** Tegilmagan darslar ham o'lchandi
(`m3-05`, `m4-02` — 22.09 da hech kim tegmagan): ular ham toshadi (`button.hw-big`, 12 hodisa).
Ya'ni bu **loyiha bo'ylab eski qarz**: ruscha matn o'zbekchadan uzun, umumiy komponentlar
esa qat'iy balandlikda.

**Nega to'planib qolgan:** `layout-lint` `npm run gates` ichida EMAS — vite kerak va
daqiqalar ketadi; asbobning o'z izohida «modul yakunida va relizdan oldin yuritiladi
(MODUL_TUR bandi)» deb yozilgan.

**Qanday tuzatiladi (ustuvorlik bilan):**
1. `div.gloss.fade-up` — 383–421px, eng yomoni
2. `div.card.ach-coll` — eng ko'p tarqalgani (42 hodisa)
3. `div.card.fade-up` · `button.hw-big` — 134–303px
4. Qolganlari 5–52px — ikkinchi navbat

Har sinf uchun: qat'iy balandlik o'rniga `min-height` + `overflow` qoidasini ko'rib chiqish,
yoki ruscha matn uchun `font-size`/`line-height` moslash. Tuzatilgach har dars uchun
`layout-lint --keys <kalit> --lang ru` **0** bo'lishi shart + skrinshot.

**Dalillar:** `feedback/F-0922-fidbek/tekshiruv/LAYOUT_TAHLIL.md` ·
`layout-ru-2026-09-23.log` · `layout-baza-tegilmagan.log`

## 160-QONUN — VIZUAL + IZOH BITTA KARTADA, qolgan modullar (F-0927-01, 2026-09-27)

Foydalanuvchi (GitLesson s0): «blokidan tashqarida chiqib ketibdi — GLOBAL tekshir». Qaror **A**: yorliq + vizual + izoh
(yoki vizual + izoh) bitta `.vis-card`; izohsiz ustun-yorlig'i qoladi (DARS_ETALON 160, 1–6-bandlar).

- ✅ **1-Modul** (27.09): 14 ekran, 5 dars — PIPELINE_STATE 27.09 yozuvi.
- ⬜ **2-Modul · 3-Modul · 4-Modul · 4a/4b/4c** — har biri o'z F-0926-06 tozalash to'lqinida (agent yo'riqnomasiga band qo'shiladi).
- ⬜ **PM darslar (25) · 5–6–7-Modul · bridge** — alohida qaror: ular 26.09 da boshqa to'lqinda tozalangan; qo'llash foydalanuvchi bilan kelishiladi.

**Qanday topiladi:** `node tools/page-audit.mjs <dars> --clicks=2` → `LOOSE`. 1-Modulda 175 nomzoddan 14 ekran haqiqiy chiqdi —
`tepada` yolg'iz yorliqlar (3-band) va `tagida` javob-izoh/nishon-sharti/tab-legendalar (6-band) — nomzod, KO'Z bilan ajratiladi.
**Qanday tuzatiladi:** o'sha dars CSS'iga `.vis-card` (+ ichki vizual soyasiz `0 0 0 1px`), uchlik o'raladi, izoh `margin: 0`;
qo'shni ustun tekisligi qayta o'lchanadi (ko'rinmas yorliq-nusxa keraksiz bo'lib qolishi mumkin).

## F-0926-06 · PM 7–8-Modul tozalanmagan (2026-09-28 tun, o'lchov)
10 fayl: `src/7-Modull/PmLesson26,28–34.jsx` · `src/pm/PmJtbdLesson.jsx` · `src/pm/PmMetricsLesson.jsx`.
gates: dark 🔴 (10/10), til 🔴 (9/10; error 2–14), RU yo'q (tr 0–1). 26.09 PM tozalash (159-qonun) faqat 1–6-Modul edi.
Holat (28.09 07:49 qaror PM1-A · PM-T3-A): **hozir o'tilmaydi — shu yerda turadi**. Tungi dark-btn + til 🔴→0 qoldi (PM78-A).
Qolgan: RU to'lqini (10 dars) · «Aziz» qahramoni (12 fayl, PM-T3/T4) — PM1 bilan birga, modul navbatga kelganda.
Didga oid dark (PmLesson26 `.grave`, PmLesson32 :871, PmMetrics `.match-slot-chip.bad`) — PM-DK-A: qoladi, lint:dark 🔴 shu sababli.

## F-0928-01 · Bajarilgan tugma — yumshoq yashil (U1, 2026-09-28 qaror)
Qaror U1-A: bosilgandan keyingi «✓ Ko'rdingiz»-tipidagi tugma **xira accent (`disabled`, opacity 0.4) emas**, yumshoq yashil
(`.btn.is-done`, namuna: `src/4a-Modull/NestArchAliveLesson.jsx`). Sabab: V1 «yashil — faqat bajarilgan holat»; xira tugma «ishlamayapti» deb o'qiladi.
Doira: 1–3-Modul + GithubActions va boshqa texnik darslar (8+ fayl) — bir yo'la codemod bilan. Holat: NAVBATDA, qilinmagan.


## F-0928-07 · 6-Modul PM darslarida setLiveLang yo'q (2026-09-28)
`src/6-Modull/PmLesson22–25.jsx` — ruscha rejimda payload `lang:'uz'`. Tuzatish: import + `setLiveLang(lang)` (PmLesson21 naqshi), keyin `smoke-onfinished-all --lang both`. 6-Modul QA/LMS'ga chiqishdan oldin shart.


## F-0929-19 · «kompilyator» → «kod oynasi» — o'quvchi matnida (D2, 2026-09-29 qaror)
Texnik xato: chapda kod, o'ngda natija ko'rinadigan oyna kompilyator emas. Kursda 47 fayl / 345 uchrash (`grep -li ompilyator src/*/*.jsx`).
Doira: faqat o'quvchi ko'radigan `uz:` matn va lug'at izohi; komponent/CSS nomlari (`.compiler`, `Compiler`) tegilmaydi. Codemod bilan bir yo'la,
6-Modul razrabotkasidan keyin. Holat: ⬜ NAVBATDA.

## F-0929-20 · Starter loyiha (Expo + navigatsiya) va ishlaydigan backend — 10/11/13-dars amaliyoti (D6, 2026-09-29)
Kursda navigatsiya kutubxonasi o'rnatish hech qayerda ko'rsatilmagan; 10, 11, 13-dars amaliyoti «ustoz bergan tayyor loyiha» deb yozildi.
Kerak: (1) Expo + React Navigation sozlangan starter repo (List/Detail bo'sh), (2) backend darslaridagi Node.js + PostgreSQL serverning
ishlaydigan nusxasi (`/products`, `/orders`), (3) LMS'ga yuklash yo'li. Razrabotka bilan parallel. Holat: ⬜ NAVBATDA (kim/qachon — foydalanuvchi).

## F-0929-21 · Umumiy shablon so'zlari: «sessiya» (podium), «eng uzun streak» (arena) — barcha darslar (2026-09-29)
Lug'at: sessiya → dars; streak → ketma-ket to'g'ri javob. Bitta shablon-komponentda tuziladi, 100+ faylga tegadi. Holat: ⬜ NAVBATDA.

## F-1002-59 · Sudraladigan chip to'ldirilgan gradient — 1–4-Modul 23 fayl (02.10 qaror, DE-159.15 qayta yozildi)
Foydalanuvchi 5-Modul 1-dars ko'rigida: «ranglar o'zgarmasin — oldingilariday sarg'ishroq». 26.09 (F-0926-05 #5) «oq fon + 2px chegara» varianti BEKOR.
Yangi ko'rinish = 6-Modul `.dd-chip` (gradient `170deg #FF8A3D → accent`, oq matn, chegarasiz, «⠿» ushlagich) — 5-Modul 8 darsda qo'llandi (F-1002-66).
Qolgan 23 fayl (`grep -l "\.dd-chip {.*border: 2px solid" src/*/*.jsx`): src/1-Modull/HtmlTakrorlashLesson.jsx CssLesson2 InternetLesson Htmllesson1 CssPractice HtmlPractice CssLesson1 PmLesson2 VsCodeLesson · src/2-Modull/PeanStackLesson PracticeLesson3 PracticeLesson4 JsFunctionsLesson · src/3-Modull/ReactApiPostLesson ReactIntroLesson ReactRouterPracticeLesson · src/4-Modull/RoutingLesson · src/4a-Modull/NestArchAliveLesson · src/4c-Modull/FullProPipelineLesson GithubActionsLesson CiCdIntroLesson AiPipelineProjectLesson FullPipelineProjectLesson.
Codemod: `.dd-chip {…}` va `.dd-chip::before` qatorlari 5-Modul naqshiga (bir xil satr, `BotIntroLesson.jsx` dan). Keyin `npm run gates` har faylga. Holat: ⬜ NAVBATDA.

## F-1002-70 · PM keys-sahna — 1–4-Modul PM keyslari (16 fayl) (02.10 qaror, 165-qonun)
Foydalanuvchi 5-Modul 2-dars ko'rigida: «biznes hissini vizualda his qildirsin — emojilar, animatsiya, minimalist; barcha PM darsida».
5-Modul 4 PM darsda qilindi (`KeysScene` + `KEYS_SCENE`, namuna: `src/5-Modull/PmLesson19.jsx`). 6-Modul 4 PM — o'z fidbek davrida.
Qolgan (`grep -l "k-slide-body" src/*/*.jsx`): src/2-Modull/PmLesson4 PmLesson5 PmMuammoIzlash · src/3-Modull/PmLesson8 PmLesson9 PmLesson10 ·
src/4-Modull/PmLesson11 PmLesson12 PmLesson13 PmLesson14 · src/4a-Modull/PmLesson15 · src/4b-Modull/PmLesson16 · src/4c-Modull/PmLesson17 PmLesson18 ·
src/pm/PmJtbdLesson PmUserStoryLesson. Har biriga voqeasidan sahna (≤4 tur emoji, bashoratda `pre`/`post`), keyin `npm run gates`. Holat: ⬜ NAVBATDA.

## F-1002-73 · Natija ekrani — bitta karta (17 PM fayl) (02.10 qaror, 166-qonun)
Natija ekrani («Bugungi natijangiz») 21 PM darsda bir xil. 5-Modul 4 darsda qilindi (`.pod-card`, namuna: `src/5-Modull/PmLesson19.jsx` ScreenPodium).
Qolgan 17 (`grep -l "shaxsiy natijangiz" src/*/*.jsx`): src/3-Modull/PmLesson8 PmLesson9 PmLesson10 · src/4-Modull/PmLesson11 PmLesson12 PmLesson13 PmLesson14 ·
src/4a-Modull/PmLesson15 · src/4b-Modull/PmLesson16 · src/4c-Modull/PmLesson17 PmLesson18 · src/6-Modull/PmLesson22 PmLesson23 PmLesson24 PmLesson25 ·
src/pm/PmUserStoryLesson PmJtbdLesson. Codemod: 5-Moduldagi blok almashtirish + CSS (`.pod-card*`, `.pcb*`), eski `.pod-solo*` olinadi. Holat: ⬜ NAVBATDA.

## F-1002-91 · 5-Modul AMALIYOT QATLAMI — Nest-starter + mini-mashq + Antigravity + uyga vazifa (02.10 qaror, 02.10 16:36)
**Foydalanuvchi:** «tg botdan oldin Nest arxitekturani qilgan edik; Nest bilan tg botni AI Antigravity bilan zo'r qilsa bo'ladi; practicelar juda ko'p
bo'lishi kerak; 4a dagidek repo URL berib clone qildirish mumkin». Qarorlar: **TypeScript** (4a bilan bir xil) · **Antigravity** amaliyotlarda ·
**vaqti — 5–12-dars fidbeki tugagach, bir yo'la** (6 darsga chuqur tegadi, MD-birinchi yo'l, retsept F).

Hozirgi holat (02.10 o'lchov): bot oddiy Node + Telegraf `bot.js` (CommonJS); Nest haqida 0 gap (3-dars ko'prik gapi F-1002-63 da qisqartirishda
olib tashlangan — QAYTARILADI); har kod-darsda 1 amaliyot (8 dan 4 tasi kod emas: qog'oz, Gemini chat, matn fayli, deploy rejasi); brauzer ichida
kod-mashq 0; starter repo yo'q (3-dars «loyiha papkasida npm install»); uyga vazifa paketi 5-Modulga yo'q; AI vositasi gemini/aistudio, Antigravity 0.

Reja:
1. **Starter repo `TelegramBotNest`** (GitHub, foydalanuvchi joylaydi, 4a `IntroNestArxitechture` kabi): Nest + TypeScript + PostgreSQL + `.env`;
   `src/bot/bot.service.ts` ichida oddiy Telegraf (`bot.command/action/hears`, `ctx.reply`) — dars kod-ekranlari o'zgarmaydi; `nestjs-telegraf`
   dekoratorlari YO'Q. README: clone → `npm i` → `.env` → `npm run start:dev`. `users` jadvali (holat ustunisiz — 4-darsda qo'shiladi), `AiService` skeleti.
2. **Ko'prik ekran** 3-dars amaliyotida: chapda `bot.js`, o'ngda `bot.service.ts`, bir xil handlerlar; F-1002-63 da olingan «katta loyihada handlerlar
   NestJS service ichida» gapi shu yerda qaytadi.
3. **Mini-mashq komponenti `BotSim`** — darsdagi chat-simulyator + kod oynasi: o'quvchi handler yozadi, soxta Telegraf (`bot.command/hears/action/on`,
   `ctx.reply`) uni sandbox'da yurgizadi, chat javob beradi; token/internet kerak emas. Har kod-darsda 2 ta (3, 4, 5, 6, 7-dars = ~10). K-005
   («3 praktika-kompilyator») ruhida; shartlar xulq-atvorda tekshiriladi (K-006).
4. **Amaliyot qayta yoziladi (MD v2 → GATE M → kod):** 3-dars — clone, `.env`, start, handlerlar; 4-dars — qog'oz o'rniga starterda `holat` ustuni +
   SELECT/UPDATE; 5-dars — Gemini chat nusxasi o'rniga Antigravity playbook (4a-04 naqshi) bilan starterda bot; 6-dars — Gemini tajriba qoladi + `AiService`
   (kalit `.env`); 7-dars — «deploy rejasi» o'rniga haqiqiy deploy (bepul hosting — foydalanuvchi tanlaydi); 10-dars/Demo Day — bot shu repodan.
   1, 9-dars va PM darslari o'zgarmaydi. Antigravity nomi — 2/3/4c amaliyotlari bilan bir xil («sinfda Gemini» qoidasi: kontseptual AI-chat qadamlari
   gemini/aistudio da qoladi, kod yozish — Antigravity).
5. **Uyga vazifa** — 8 kod-darsga paket (`uyga-vazifa/5-Modull/`, 1–4b shaklida).
Tartib: starter repo → BotSim → 3-dars MD v2 (pilot, GATE M) → qolgan 4 dars → uyga vazifa → Demo Day. Holat: ⬜ NAVBATDA (5–12-dars fidbekidan keyin).

## F-1002-94 · `narrow` tushuncha-ekranlarda — 1–2-Modul 3 fayl, 8 ekran (02.10 qaror, 171-qonun)
Qoida: tor ustun faqat `QuestionScreen` va `ScreenPodium`. 5-Moduldagi ikkitasi 02.10 tuzatildi; eski modullarda `lint:narrow` warn beradi:
`src/1-Modull/PmLesson3.jsx` (Demo Day: Screen2 «Muammo-qidiruv», Screen4 «Birinchi savol», Screen5 «Yechim», Screen6 «Jonli demo» `narrow={!done}`,
Screen13 «Repetitsiya» `narrow={!edit}`), `src/2-Modull/PracticeLesson4.jsx` (ScreenFlashcards «Tez takror»), `src/1-Modull/HtmlTakrorlashLesson.jsx`
(ScreenBlitz «Eslab olish», ScreenParty «Sahifa tayyor!»). Har biri ko'rib chiqiladi: Demo Day nutq-ekranlari va yakun-bayram ataylab tor bo'lishi mumkin —
shunda ALLOWED ro'yxatiga komponent nomi bilan qo'shiladi, qolgani kurs layoutiga qaytadi. Holat: ⬜ NAVBATDA (1–2-Modul tozalash raundida).

## F-1002-114 · Amaliyot bloki qolipi (173-qonun) — 1–4-Modul va 6-Modul amaliyot ekranlariga (03.10 qaror, keyin)

5-Modulda hamma amaliyot ekrani repo ustidagi `ScreenBlok` ga o'tdi (5/7/9 to'liq qolip, 3/4/6/10 bitta blok). Boshqa modullarda
`ScreenLivePractice` oflayn ro'yxati qoladi: 2-Modul JS (0 amaliyot-tur), 4-Modul (1), 6-Modul (8/11/13 loyiha kunlari — o'z fidbek davrida
172-qonun bo'yicha ko'riladi: `PipelineProjectLesson`, `MobileAppPracticeLesson`, `FullSystemProjectLesson`). Har modulning o'z shablon-repo'si
kerakmi — modul fidbek davrida hal qilinadi. Qamrov: ~20 fayl.

## F-1002-91 YOPILDI (03.10): 5-Modul amaliyot qatlami — rejadagi 4 qism (Nest-starter · BotSim · Antigravity · uyga vazifa) → amaliyot-qolip (172/173)
bilan hal: Nest-starter = `TelegramBotNest` (8 teg), BotSim o'rniga kutilgan-natija chati, Antigravity = blok 2-qadam; uyga vazifa paketi — reja 7-bosqich (keyin).



## F-1003 · 5-Modul QA fidbeki (03.10) — boshqa modullarga qolgan qism

Global tuzatilgan (hammasi qilindi, `gates:qolip` 109 faol darsda toza): ekran-markaz (12 + 98 + 4 fayl), «Bajardim» qulfi (39), natija/yakun halqasi (109),
yozish maydoni (24 PM, 52 maydon), ro'yxat-chet (11 PM), son-takror eyebrow (14 PM). Asl nusxa: `arxiv/f1003-oldin-2026-10-03/` (109 fayl).
**Qolgan (o'z modul fidbek davrida):**
- **F-1003-07 sen-forma** — `til-lint sen-imperativ` (warn): 20 fayl, 71 qator — 6-Modul 5 fayl (21; 6-Modul fidbekida), 7-Modul 7 (17), 3-Modul 2 (11), 4-Modul 2 (8),
  4b 1 (6), 2-Modul 1 (4), 4a 1 (3), 1-Modul 1 (`InternetLesson` «Yubor» tugmasi). Masalan: «Tayyorla → Chaqir → Tekshir», «yoz → sina → tuzat», «reja → qur → tekshir».
  ru da ham ты-forma («Проверь»). Qaror: har modul fidbekida, yoki bir yo'la — foydalanuvchi.
- **bridge/** 5 dars `reflect-input` `<input>` (alohida ilova, coddycamp-bridge) — 175-qonun hali qo'llanmagan; bridge seansida.
- **O'lik fayllar** `3-Modull/PmLesson7.jsx`, `7-Modull/PmLesson28.jsx` (App.jsx ga ulanmagan) — q1/q4 eski holatda; o'chirish yoki qoldirish — KATTA 19-band bilan birga.
- **Oldindan bor darvoza qarzi** (F-1003 dan oldin ham aynan shunday, `arxiv/` bilan solishtirildi): 1–4/7-Modulda `dark` (6), `til` error (39), `tell` (1), `emoji` (15).
- **lint:layout F/G** yangi — butun ro'yxat bo'yicha yurgizilmagan (vite + daqiqalar). Modul oxirida: `LESSON_URL=http://localhost:5173 node layout-lint.mjs --keys <modul> --interact 0`.

## F-1004 · 6-Modul QA fidbeki (04.10) — 1–5-Modul (va 7-Modul, PM etalonlar) ga qolgan qism (qaror Q4 B)

6-Modulda bajarildi va darvoza qo'yildi; boshqa modullarda — warn rejimida, LMS qayta yuklash bilan birga bir yo'la (1–4-Modul LMS prodda).
- **q8 tugma-chap (DE-187):** ichki `btn`/`btn-soft` `alignSelf: 'flex-start'` → `'flex-end'`. `node lint-qolip.mjs` warn ro'yxati.
- **q11 banner-shakl (DE-192):** CODE STRIKE `border-radius: 999px` → 22px; «Uyga vazifa» `width: min(560/520px)` → 100% — 92 fayl.
- **q12 takror-tasdiq (DE-190):** PM kompilyator ekranlari — «✓ Belgilandi» chip, «Bajarildi — … sayqallang».
- **q10 tartib-ustun (DE-188):** 1 fayl.
- **185 toza yuza (DE-185):** tugma/`li`/chip/variant emoji — `node lint-emoji.mjs src` warn (eski modullar). Kodmod `scratchpad/emoji_strip.py` (`--dry` avval!) naqshi.
- **QA qobiqlari (F-1004-09):** `src/m5-demo`, `m3/m4/fb/internet/kompilyator` demo qobiqlari — telefonda ⌂/UZ-RU «Orqaga» ustida (6-Modul va App.jsx tuzatilgan).
- **Natija kartasi telefonda (F-1004-21):** 5-Modul `pod-card` da 4 nishon 3+1 bo'lib tushadi — 6-Modul `@media (max-width: 440px)` qatori ko'chiriladi.
- **Kompilyator:** umumiy — hammaga tegdi (Q4 B istisnosi), qo'shimcha ish yo'q; starter izohlari >56 belgi boshqa modullarda — karta.

## F-1004 (2-qism) · Umumiy qolip va QA umumiy fidbeki (04.10 kech) — eski modullarga qolgan qism

Qaror D1–D9 hammasi A (jurnal: `feedback/F-0929-QA-6modul/JURNAL.md`). 6-Modulda bajarildi; quyidagilar 1–5-Modul (4a/4b/4c), eski 7-Modul va PM etalonlarida
**warn** bo'lib qoldi — dars ustida ishlaganda ko'tarilmaydi, modul qayta qurilganda (MD v3 → qolip) yopiladi:

| Band | O'lchov (04.10) | Darvoza | Izoh |
|---|---|---|---|
| Sarlavha≈Mentor takrori (DE-197) | 130 ekran (1-M 31 · 2-M 22 · 3-M 17 · 4-M 26 · 4a 3 · 4b 6 · 4c 13 · 5-M 8 · bridge 3 · pm 1) | `lint:olchov` takror | 6-Modul 0 (1-dars pilotda yopildi) |
| Sen-forma zanjir «·/—» + ru (KORPUS §224) | 105 warn (uz + ru) | `til` sen-imperativ(-ru) | 6-Modul 0 |
| Tugma chapda (q8, regex teshigi yopildi) | 300 warn (279 → 300: `=>` li tugmalar ham) | `gates:qolip` q8 | 6-Modul 0 |
| Qolipga o'tish (DE-193) | 6-Modul 13 dars warn (q16) | `gates:qolip` q16 | MD v3 navbati; yangi modullar — error |
| Emoji 0 (DE-196) | qolip-darslardagina error | `lint:emoji` qolip-rejim | eski darslar qolipga o'tganda |

**D7 (havola olib tashlandi) — LMS:** 1–4-Modul (17 PM fayl) o'zgardi → LMS'dagi nusxa eskirdi. Qayta yuklash — foydalanuvchi qarori bilan (commit/deploy buyruqsiz yo'q).
1–4-Modulda kompilyator ekrani endi mustaqil rejimda majburiy (89 (b)–(g) bekor) — o'quvchi uchun Yordam yetarliligi keyingi QA'da ko'riladi.

**04.10 kech (F-1004-57/58):** q11 bannerlar — eski modullardagi 168 warn YOPILDI (192 platforma standartiga qaytarildi, 6-Modul 14 dars standartga);
yashil `#E3F0E8` — 47 PM darsida token almashtirildi (1–4-Modul PM fayllari LMS nusxasidan yana farq qiladi — qayta yuklash ro'yxatiga).

## F-1004-60 · 5 va 6-Modulni yopish (04.10 tun) — boshqa modullarga qolgan qism

- **Fon so'zlari ru da o'zbekcha (R-008, RU §10):** 5-Modul YOPILDI (8 dars). ✅ **04.10 kech (yopishdan keyingi Q1 A): 1–4c va PM 9 fayl ham YOPILDI** (PmLesson5/6/8/16, PmMuammoIzlash, PracticeLesson4, ReactBuildSite, AiPipelineProject, PmJtbd — 65 juftlik; LMS paket qayta yig'ildi). Qoldi: 6-Modul 7 fayl — Q3 guruhlarida. Boshqa modullarda skaner topgani (kod-belgilar chiqarilgan):
  2-Modull PmLesson5 (iteratsiya) · PmLesson6 (peshtaxta, javon, oshpaz, jargon, sistema, qatlam) · PmMuammoIzlash (kuzatuv, sharh, muammo, kuchi) ·
  PracticeLesson4 (savat, jami, narx) · 3-Modull PmLesson8 (katak, vaqt, foyda, darrov, reja, navbat) · ReactBuildSiteLesson (komponent) ·
  4b PmLesson16 (nosozlik, karta, navbat, javon, tarozi, skuter, sifat) · 4c AiPipelineProjectLesson (jurnal, so'rov, yordamchi, tekshir) ·
  pm/PmJtbdLesson (vazifa, funksional, ijtimoiy, emotsional, komponent, tur, savol, markaz) · 6-Modull AgentArchitecture (asbob), ArchPatterns (monolit,
  mikroservis), ClaudeSkills (kontekst, uslub), FullSystemProject (baza), PmLesson23 (7 so'z), PmLesson25 (8 so'z), WriteSkill (kontekst) — 6-Modul
  Q3 guruhlarida; 1-dars pilot (tizim) — YOPILDI. 1–4c va PM — LMS'ga tegadi: qaror bilan.
- **Menyu ↔ dars nomi (DE-205):** ✅ **04.10 kech (Q2 A): HAMMASI tenglashdi** — App.jsx 61 + QA-menyular (m1-demo 22, mentor 22, m34-demo 22, texnik-demo 46, m5-demo 3); App.jsx da farq 0/109. QA saytlari menyusi keyingi deployda yangilanadi. (eski yozuv:) 5-Modul 0 farq. Qolgan 61: 1-Modul 10 · 2-Modul 10 · 3-Modul 10 · 4-Modul 13 · 4a 3 · 4b 1 · 4c 3 · 6-Modul 2 (m6-09, m6-11) ·
  7-Modul 8. Ko'pi «qisqa menyu ↔ to'liq nom» — LMS nomlariga tegadi, foydalanuvchi qarori.
- **Podium yorlig'i (q22, J-029):** ✅ **04.10 kech (Q3 A) YOPILDI** — CssLesson1 11/14/17 → 12/15/18, PmLesson8 5/7/11 → 6/8/12 (tartib bir xil, ekran qo'shilganda siljigan); q22 0.
- **Test izohi pastki chiziqda (lint:layout E, 04.10 o'lchov) — Q4 A: har modul qolipga o'tganda o'zi yo'qoladi (QTestJavob o'zi suriladi), eski darslarga alohida tegilmaydi:** javobdan keyin izoh qutisi 1280×773 da pastki chiziq ostiga kiradi — 3-dars 8-ekran 10px,
  11-ekran 13px · 10-dars 4-ekran 7px (matn va tugma ko'rinadi, qutining pastki chekkasi) · 6-dars 3-ekran 51px, 9-ekran 40–86px (xulosa yarmi skrolda).
  `QuestionScreen` izohi texnik darslar standarti — butun platformada bir xil sinf bo'lishi mumkin; keyingi QA davrida o'lchanadi (DE-199 yo'li: natija fokusga).
- **1–4c LMS qayta yuklash ro'yxati** (5-Modulni yopish Q10/Q11): F-1003 70 dars + D7/yashil 17+47 PM fayl + sen-forma 13 fayl — paket bitta, commitdan keyin.

## F-1004-66 — `lint:tell` QuestionScreen'ni yarim o'qir edi (yashirin «to'g'ri javob eng uzun/qisqa») — 05.10.2026 01:02
**Topildi (6-Modul kichik tuzatish agentlari m6-02, m6-14):** `lint-tell.mjs` blok oxirini birinchi `/>` deb olardi; `question={<TestQ … />}` naqshli testlarda
variantlar o'qilmasdi — tekshiruv jimgina o'chgan. To'g'ri o'qish (keyingi `<QuestionScreen` yoki yuqori darajadagi e'longacha) bilan: **222 → 315 error, 69 → 91 warn, 36 fayl**.
**Holat:** to'g'ri o'qish `node lint-tell.mjs --toliq` bilan ixtiyoriy; sukut (va `npm run gates`) — eski o'qish, hech bir dars yiqilmaydi.
**Yopish:** har faylda variant uzunligini tenglash (✔ o'rni o'zgarmaydi, uz+ru) → `--toliq` sukutga o'tadi. LMS'dagi 1–4-Modul fayllari ham bor — qayta yuklash kerak bo'ladi (qaror foydalanuvchida).
Fayllar (eski → yangi error): 1-Modull/CssLesson1.jsx 6→8 · 1-Modull/DeployLesson.jsx 3→4 · 1-Modull/InternetLesson.jsx 2→4 · 1-Modull/PmLesson3.jsx 5→6 · 2-Modull/JsIntroLesson.jsx 3→4 · 2-Modull/JsVarsLesson.jsx 6→7 · 2-Modull/PmLesson6.jsx 3→6 · 2-Modull/PracticeLesson2.jsx 15→19 · 3-Modull/PmLesson7.jsx 0→7 · 3-Modull/ReactApiGetLesson.jsx 4→6 · 3-Modull/ReactApiPostLesson.jsx 7→9 · 3-Modull/ReactBuildSiteLesson.jsx 11→16 · 3-Modull/ReactCrudPracticeLesson.jsx 5→6 · 3-Modull/ReactIntroLesson.jsx 2→3 · 3-Modull/ReactProjectDayLesson.jsx 8→13 · 3-Modull/ReactRouterPracticeLesson.jsx 2→3 · 3-Modull/ReactStateEffectLesson.jsx 7→10 · 4a-Modull/NestArchPracticeLesson.jsx 2→3 · 4a-Modull/NestArchResourceLesson.jsx 4→6 · 4b-Modull/EdgeCasesTestLesson.jsx 3→4 · 4b-Modull/JestUnitTestLesson.jsx 5→6 · 4b-Modull/PmLesson16.jsx 1→3 · 4c-Modull/AiPipelineProjectLesson.jsx 1→2 · 4c-Modull/FullProPipelineLesson.jsx 1→2 · 4-Modull/ApiPostmanLesson.jsx 5→8 · 4-Modull/DataIntroLesson.jsx 2→3 · 4-Modull/DbSqlNosqlLesson.jsx 3→4 · 4-Modull/FullstackConnectPracticeLesson.jsx 5→7 · 4-Modull/NodeServerLesson.jsx 3→5 · 4-Modull/PostgresCrudLesson.jsx 5→6 · 5-Modull/BotAiProjectLesson.jsx 0→1 · 6-Modull/AgentArchitectureLesson.jsx 0→1 · 6-Modull/MobileAppPracticeLesson.jsx 0→3 · 6-Modull/PipelineProjectLesson.jsx 0→1 · 6-Modull/ReactNativeAppLesson.jsx 0→1 · 6-Modull/ReactNativeBasicsLesson.jsx 0→1

## F-1004-67 — PM refleksiya taymeri LMS solo rejimida juftlik variantini ko'rsatadi — 05.10.2026 01:05
**Topildi (m6-02 yakuniy MD agenti):** `const yakka = !live || live.mode === 'self'` — `useLiveSession` izohi: «'student'/'mentor' bo'lmagan har rejim 'self' kabi»
(`solo`, `review` — LMS). LMS'da yakka o'tayotgan o'quvchi «Sherigingizga ayting», A/B navbatli juftlik versiyasini oladi.
**Qamrov (19 fayl, hammasi PM):** PmLesson6 (`isSolo`), 9, 10, 11, 12, 13, 14, 15, 16 (×2: `solo`, `yakka`), 17, 18, 19, 20, 21, 22, 23, 24, 25, PmMetrics.
**Tuzatish:** `const yakka = !live || (live.mode !== 'student' && live.mode !== 'mentor');` (va PmLesson6 `isSolo`, PmLesson16 `solo` — xuddi shunday).
LMS'dagi 2–4-Modul fayllari bor — qayta yuklash kerak (qaror foydalanuvchida). Sinov: `useLiveSession` rejimi `solo` bilan refleksiya ekrani surati.
**Qo'shimcha (05.10, supurish):** podium «Natijalar kelmoqda…» `tr()` siz — `4a-Modull/PmLesson15.jsx:2404`, `4c-Modull/PmLesson17.jsx:2442` (ruschada o'zbekcha chiqadi; 6-Modulda tuzatildi). LMS qayta yuklash bilan birga.

## F-1004-68 — `font-family: 'Georgia, serif'` — ikki nom bitta qo'shtirnoqda (brauzer Times'ga tushadi) — 05.10.2026 01:07
**Topildi (m6-08 yakuniy MD agenti, `.crit` case qatorlari):** butun stek bitta nom deb o'qiladi → Georgia emas, sukut serif (Times). Platformada **14 fayl, 122 joy** — o'quvchilar
yillar davomida shu ko'rinishni ko'rgan; tuzatish ko'rinishni o'zgartiradi (Georgia). Fayllar: 1-Modull/CssLesson1.jsx 1-Modull/CssLesson2.jsx 1-Modull/PmLesson1.jsx 1-Modull/Htmllesson2.jsx 1-Modull/HtmlTakrorlashLesson.jsx 1-Modull/Htmllesson1.jsx 1-Modull/InternetLesson.jsx 1-Modull/GitLesson.jsx 1-Modull/VsCodeLesson.jsx 3-Modull/PmLesson7.jsx 2-Modull/PmLesson6.jsx 6-Modull/FullSystemProjectLesson.jsx 6-Modull/MobileAppPracticeLesson.jsx 6-Modull/PipelineProjectLesson.jsx 
**Yopish:** `font-family: Georgia, serif` (qo'shtirnoqsiz) — bitta codemod + ko'z bilan tekshiruv; qaror foydalanuvchida (ko'rinish o'zgaradi, LMS fayllari bor).

## F-1004-70 — 6-Modul B guruhi: 16 ta mantiq/mazmun/layout kamchiligi (oldindan bor) — 05.10.2026 07:12
**Qaror (foydalanuvchi, tasdiq sahifasi Q3 = C):** modul hozir yopiladi, bular keyingi fidbek davriga navbatda turadi.
Ro'yxat va takliflar: `feedback/F-0929-QA-6modul/KUZATUVLAR_2026-10-05.md` → B jadvali (B1–B16). Qisqacha:
B1 m6-02 s0/s4 «uch xil ilova» yo'q · B2 m6-12 s9 xato izohi · B3 m6-12 ufq nomlari ikki xil · B4 m6-12 arena 9/kartochka 2006 · B5 m6-08 s7 «Davom etish» erta ·
B6 Node/Node.js · B7 m6-09 o'lik holat/boshlang'ich kod · B8 m6-10 9-darsga ishora, bo'sh div · B9 m6-11 savat 0→2 · B10 m6-13 amaliyot VS Code↔Antigravity ·
B11 nishon sharti (qoldirish tavsiya) · B12 m6-08 ⛶ telefon · B13 amaliyot ekrani tugmasi pastda (m6-05/07/08/09/10/13) · B14 m6-12 s10 kod paneli ·
B15 m6-08 s3 tugmalar · B16 m6-09/10 yashil xulosa pastda.
**Q4 = A:** F-1004-66/67/68 va podium tarjimasi (LMS fayllari) — alohida seansda, yangi modullardan keyin.

