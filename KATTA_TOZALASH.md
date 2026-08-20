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

**Birinchi qadam — birlashtirish EMAS, solishtirish.** Audit-skript yozilади:
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
