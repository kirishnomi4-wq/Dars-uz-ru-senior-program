# QOLIP — umumiy dars qolipi (F-1004 2-qism, 04.10.2026)

Qaror: D1 ekran turlari · D2 ikki tugma · D3 to'qqiz token · D4 emojisiz yuza · D9 pilot — 6-Modul 1-dars (`SystemArchitectureLesson.jsx`).
Qonunlar: DARS_ETALON 193–198 · PM 107. Darvoza: `gates:qolip` q13–q16 · `lint:emoji` qolip-rejim · `lint:olchov` (takror, `xulosa=`).

## 1. Ulash

```jsx
import { qolipRang, fon, qolipCss, QTugma, QChip, QKarta, QBashorat, QTaxmin, QQadamlar, QXato, QIzoh,
         QKirish, QTushuncha, QKod, QVoqea, QMustaqil, QNatija, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';

const T = { ...qolipRang('tex'), shadowBase: '58, 53, 48' };   // PM darsi: qolipRang('pm')
// <style> ichida, reset qoidasidan keyin:  ${qolipCss(T)}
```

Darsning karkasi (Stage, NavNext, Mentor, QuestionScreen, jonli-ball) o'zida qoladi. Qolip ekranning **tanasini** beradi.

## 2. Yetti ekran turi (D1)

| Tur | Komponent | Joylashuv |
|---|---|---|
| Kirish | `QKirish` | sarlavha-savol · Mentor · maket (chap) · radio-variantlar + javob (o'ng) — ma'lumot: `variantlar=[{id,t}] tanlov onTanla yopiq savol` (DE-201) |
| Reja | `QReja` | chap: «Dars oxirida …» + chizma · o'ng: «01 · matn · teg» — ma'lumot: `qadamlar=[{t,teg}]` (DE-201) |
| Tushuncha-tajriba | `QTushuncha` | bashorat? · harakat (chap) · vizual o'zgaradi (o'ng) · natija qatori · bitta xulosa |
| Test | `QTest` + `QTestJavob` (ko'rinish) · darsning `QuestionScreen` (mantiq) | texnik darslar test standarti; ball/jonli mantiq darsda (DE-203, q20) |
| Tartib-mashqi | `QTartib` | uyalar chapda, bo'laklar o'ngda; sudrash yoki bosish (188, DE-203) |
| Kod | `QKod` | vazifa + Yordam + «Bajardim» o'ngda (chap) · muharrir (o'ng) · bir balandlik |
| Voqea | `QVoqea` | nuqtalar · slayd-karta + chizilgan maket · bashorat |
| Mustaqil ish | `QMustaqil` | chiplar 1/2/3 · forma · Yordam — bitta ustun |
| Natija (PM) | `QNatija` | bitta karta |
| Amaliyot bloki | `QBlok` (+ `QPrompt`) | chap: qadamlar bittadan («Bajardim» qulfi, bajarilgani bir qatorga yig'iladi, ↻ qaytarish) · prompt qutisi `{…}` + «Nusxalash» · yashil yakun · o'ng: kutilgan natija maketi + «Ortda qoldingizmi» buyruqlari — holat/jonli signal darsdagi `ScreenBlok` ulagichida (namuna: `src/skelet/NamunaDars.jsx` `ScreenBlok`, `ScreenA1`; 172/173, GATE M M-q4) |
| Kartochkalar | `QKartochka` | «O'zingizni sinab ko'ring»: navbat · 3D aylanish · «Bildim»/«Takrorlash» · tepadan (174) — ma'lumot: `cards=[{front,back,note}]` (tarjima qilingan) `til` (DE-204, q21) |
| Yakun | `QYakun` | chiplar + sarlavha · `cta` (CODE STRIKE + arena — darsdan) · `recap` · `uyga` ([{b,t}] yoki PM `HwCard`) + `keyingi` · `hwTokens` · `nishonlar` (mentorda `null`) — texnik darslar standarti aynan (192, 202, DE-204, q21) |

`QTushuncha` parametrlari:
- `zoom={Zoomable}` — vizual ⛶ ichida (DE-200, majburiy — q17);
- `tugadi` — ish tugagach harakat paneli yopiladi, vizual butun enga chiqib fokusga keladi (DE-199, majburiy — q18). Odatda `useTugadi(done, 700…1500, !!storedAnswer)`;
  ataylab qoldirish — `tugadi={false}` va izoh;
- `keng` (bitta ustun) · `harakatAvval` (keng rejimda harakat tepada) · `vizualAvval={false}` (telefonda harakat tepada — saralash, xarita-harakat).

## 3. Yordamchilar

- `QTugma` — asosiy (to'la rang, ekranda bitta); `QTugma ikkinchi` — chegarali. Ikkalasi o'ng chetda (187).
- `QChip holat="on|ok|err"` — tanlov; `silk` — xato bosishda silkinadi.
- `QBashorat yorliq savol variantlar tanlov onTanla` — ballsiz bashorat (181). Yorliq: «Avval o'zingiz belgilab ko'ring» (79).
- `QTaxmin togri` — «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- `QQadamlar qadamlar joriy` — ketma-ket qadamlar (163.8).
- `QXulosa` (≤110 belgi, ≤2 gap) · `QXato` (≤60) · `QIzoh` — bitta qator.

## 3b. Jonli maket (DE-200)

Maket o'z turiga mos va me'yorda harakatda: brauzer (nuqtalar + manzil), server (qorong'i, holat chirog'i, `$` qatorlari), chat (pufaklar), telefon (ramka),
tizim xaritasi (chizilgan belgilar, oqayotgan chiziq, so'rov/javob konverti). Bo'sh joy — sokin skelet; yangi element — bir lahza ajralib kiradi.
Hammasi `prefers-reduced-motion` da to'xtaydi. Namuna: 1-dars `SysMap`, `SiteMock`, `TgMock`, 5-ekran brauzer/server, 10-ekran uch kirish yo'li.

## 4. Darsning o'z vizuali

Har dars bitta vizualga ega (163) va uni bitta manbadan o'qiydi (180). Masalan 1-dars: `SYS_NODES` → `SysMap` (tizim xaritasi) va `SiteMock` (sayt maketi).
Vizualning bosiladigan qismlari tugma darajasi emas — faylda e'lon qilinadi:

```js
// qolip-maket: smap-n sm-joy fb-tomon
```

## 5. Rang (D3) va emoji (D4)

- Tokenlar: `bg paper line ink2 ink` · `accent accentSoft` · `ok err`. Holat foni: `fon(T.ok)`, `fon(T.err)`. Boshqa `T.<nom>` — q13 xato.
- Yuzada emoji yo'q. ✓ ✗ → ↔ ▸ — belgilar. Istisno: nishon, arena, podium, bayram.

## 6. Tadqiqot (D5) — kirish, qonun emas

Manba: `feedback/F-0929-QA-6modul/D5_TADQIQOT.md` (04.10, inglizcha). W3Schools sahifasi va Codecademy hujjati ochilib tekshirildi; Brilliant va Khan Academy darslari kirishsiz ochilmadi —
ular haqidagi bandlar qidiruv parchalari va umumiy bilimga tayanadi (tekshirilmagan).

| Naqsh | Bizdagi tur | Qoida | Manba |
|---|---|---|---|
| Bitta g'oya — keyin ishlaydigan misol | Tushuncha, Kod | ekranda bitta g'oya, 60 so'zgacha | W3Schools (tekshirilgan) |
| Avval harakat, keyin tushuntirish | Tushuncha | bashorat/harakat birinchi, xulosa keyin | Brilliant (tekshirilmagan) |
| Asosiy tugma harakatgacha qulf | Tushuncha | «Davom etish» harakatdan keyin ochiladi | Brilliant (tekshirilmagan) |
| Boshqaruv bosilganda vizual darhol o'zgaradi | Tushuncha | «ko'rsatish» tugmasi yo'q, o'zgarish shu zahoti | Khan (tekshirilmagan) |
| Vazifa + raqamli qadamlar, muharrir yonida | Kod | 2–4 qatorli qadam, o'zi belgilanadi | Codecademy (tekshirilgan) |
| Xato nima ekanini aytadi | Kod, Test | «xato» emas — sabab | Codecademy (tekshirilgan) |
| Bitta brend rangi + yashil/qizil | hammasi | 9 token (D3) | umumiy |

Olinmagan: alohida «Try it» oynasi (W3Schools) — harakat shu ekranda bo'ladi; video-birinchi oqim (Khan) — sekin va passiv;
bir ekranda 3–5 panel (Codecademy) — telefonda va 13 yoshda og'ir.

## 7. Yangi darsga o'tkazish tartibi

1. MD v3 (har tushuncha-ekranda «Harakat → Vizual o'zgarish» qatori) → GATE M.
2. Palitra `qolipRang`, CSS `qolipCss(T)`, ekranlar qolip turlaridan.
3. `npm run gates -- <fayl>` 12/12 (q13–q16 shu yerda) · `npm run lint:jsx` · surat 1280 va 393.
