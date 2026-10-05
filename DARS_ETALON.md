# 📐 DARS QURILISH ETALONI — TO'LIQ (Reference Standard)

> **Oltin etalon (full):** `src/1-Modull/Htmllesson1.jsx` va `src/1-Modull/Htmllesson2.jsx` — boy, jonli, brendlangan namunaviy darslar.
> **Jonli-ball qatlami uchun** qo'shimcha manba: `src/InternetLesson.jsx`, `src/PmLesson1.jsx` (bir xil infra); RECAPS namunasi ham InternetLesson'da.
>
> **Maqsad:** qolgan barcha darslarni shu etalon bo'yicha qurish va shu bo'yicha tekshirish.
>
> **Eng muhim qoida (statistika buglari shu yerdan chiqadi):** jonli ball hisoblash **SERVERda**
> bo'ladi. Server javob kalitini mentor sessiya ochganda oladi (`set_quiz_keys`). Kalit yuklanmasa,
> server hamma javobni **"xato"** deb belgilaydi → podium va arena ballari **0 0 0 0** bo'ladi.
> (Aynan shu bug boshida 19 ta darslikda bor edi — 12 va 13-bo'limlarga qarang.)
>
> **Layout standarti (majburiy, istisno yo'q):** barcha darslar bir xil o'lchamda — stage **1100px**,
> padH **60**, avto-zoom `--lz` (11.11-qoida, 15-F retsept). Boshqa kenglik qabul qilinmaydi.

**Belgilar:** 🔴 = majburiy (buzilsa dars ishlamaydi) · 🟡 = muhim (noto'g'ri ko'rinish) · 🟢 = boyituvchi (mashqlar) · ⚪ = kosmetik.

---

## 0. Qanday ishlatiladi

1. Har darsni quyidagi bo'limlar bo'yicha ketma-ket tekshir.
2. Har o'zgarishdan keyin **build toza** ekanini tekshir: `npx esbuild <fayl> --loader:.jsx=jsx --outfile=/dev/null` (yoki `--outfile` scratch faylga).
3. Jonli qismni **yangi PIN bilan** sinash SHART (2 o'quvchi → podium/arena ballari 0 EMAS). Mentor-kod 2026-09-07 da almashgan — joriy qiymat `server/.env.deploy.prod` / `.env.deploy.staging` da (lokal dev — `server/.env`); **kodning o'zi hujjatga yozilmaydi**.
4. Oxirida **14-bo'lim (tekshiruv ro'yxati)**ni to'ldir.

---

## 1. 🔴 TIL VA MATN

> **📖 Batafsil: `MATN_ETALONI.md`** — til/matn sifatining to'liq standarti (siz-forma, «qiyin so'z → sodda so'z»
> lug'ati, ma'no aniqligi, ohang, darslar bo'yicha matn-audit tarixi). Quyida — qisqa xulosa. Matnni chuqur
> tekshirish/tuzatish o'sha faylning tekshiruv ro'yxati bo'yicha qilinadi.
>
> **🎯 QAT'IY EKRAN-UX STANDARTI — `MATN_ETALONI.md` 7-B bo'lim:** har interaktiv ekran boshi
> TOPSHIRIQ (buyruq, 3–6 so'z, savol EMAS) → YO'RIQNOMA (≤20 so'z) → KARTOCHKA (faqat material) →
> VARIANTLAR (qisqa tugmalar). Namuna: `PmPitchLesson.jsx` dagi `TaskHead` komponenti.

- **Faqat lotin o'zbek.** Tasodifiy kirill harflarga yo'l qo'yilmaydi (`а е о с р х у к н г д л ...` lotin ko'rinadi, lekin boshqa belgi). Tekshiruv:
  ```
  grep -nP '[\x{0400}-\x{04FF}]' <fayl>
  ```
  → faqat ataylab **ruscha `ru:` tarjima** (`{ uz: '...', ru: 'Основы HTML' }`) qatorlari chiqishi mumkin. Boshqa har qanday kirill = xato, lotinga o'giriladi.
- **Tushunarli so'zlar:** boshlang'ich o'quvchi uchun. Masalan `<p>` = "matn (paragraf)" (❌ "xatboshi"); skelet bo'laklari uchun aniq maslahatlar ("butun sahifa qobig'i", "ko'rinmas qism").
- **Faqat siz-forma.** O'quvchiga qaratilgan BARCHA matn — tugmalar, nishon tavsiflari, mentor gaplari, xulosa/muvaffaqiyat xabarlari — "siz" shaklida ("bosing", "topdingiz", "o'zingiz"). ❌ "Topding va tuzatding" → ✅ "Topdingiz va tuzatdingiz". Tekshiruv:
  ```
  grep -noE "[a-z']+(ding|lading|gansan|asan|san)\b|o'zing\b|senga|sening" <fayl>
  ```
  **Istisno:** o'quvchining O'ZI mashinaga bergan buyruqlari (dinozavrga "Yur"/"Sakra", AI promptiga "rasm qo'sh") — bu "kod = kompyuterga buyruq" g'oyasini o'rgatadi, sen-formada qoladi.
- **Tugma nomlari — neytral harakat oti:** "Yaratish", "Yuborish", "Tozalash", "Ishga tushirish" (❌ "Yarat", "Tozala", "Ishga tushir"). Tugma nomi o'zgarsa, uni tilga olgan mentor matni va **audio matni** ham birga yangilanadi.
- **Bir xil apostrof:** o'zbek lotin apostrofi manbada ASCII `'` bilan yoziladi (JS string ichida kerak bo'lsa `\u2019` escape). Literal qiyshiq apostrof belgilari (U+2018 ‘, U+2019 ’, U+02BB ʻ) aralashmasin — ko'z ilg'amaydi, lekin matn nomuvofiq bo'ladi. Tekshiruv:
  ```
  grep -n "[‘’ʻ]" <fayl>
  ```
  → hech narsa chiqmasligi kerak.
- **Matn ↔ UI mosligi:** matnda tilga olingan tugma nomi ekrandagi tugma yozuvi bilan AYNAN bir xil bo'lsin. ❌ «"Sayt" tugmasini bosib, ichida nima borligini ko'ring» — vaholanki ichini "Kod" tugmasi ochadi.
- **"Sir"-uslub taqiqlanadi:** o'quvchiga ko'rinadigan matnda "sir", "hozircha sir", 🤫/🙈 kabi sirli-dramatik ifodalar ISHLATILMAYDI — aniq, tinch tushuntirish yoziladi. ✅ "Javobingiz yozib olindi. To'g'ri yoki xato ekani mentor «Natijani ochish»ni bosganda hammada birdan ko'rinadi." Tekshiruv: `grep -nE "hozircha sir|🤫" <fayl>` → bo'sh (kod izohlaridagi "sir" hisobga olinmaydi).
- Mentor matni sodda, do'stona.
- **Audio qatlami (AUDIOSIZ, lekin matnlar majburiy):** ovoz hozircha o'chirilgan, ammo har ekranda
  `useAudio([{ id, text, trigger: 'on_mount', waits_for }])` matni YOZILADI (keyin yoqilganda tayyor bo'lsin) va
  muhim harakat javoblari `pushOneOff("...")` bilan beriladi. **Audio matn ↔ Mentor matn parallel** —
  biri o'zgarsa ikkinchisi ham (tugma nomlari bilan birga). `waits_for` hodisalari (`option_picked`,
  `error_found`, `link_jumped`...) ekrandagi haqiqiy trigger bilan bog'lanadi.

---

## 2. 🔴 JONLI SESSIYA + SERVER-BAHOLASH (eng kritik)

O'quvchi aldab `correct=true` yubora olmasin uchun javoblarni **server baholaydi**. Buning uchun
mentor sessiya ochganda javob kaliti serverga yuklanishi SHART.

### 2.1 `useLiveSession` imzosi — `answerKey` + `keyRef`
```js
function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef(answerKey); keyRef.current = answerKey; // javob kaliti — mentor sessiya ochganda serverga yuklanadi
  const initRef = useRef(undefined);
  ...
```
❌ Xato: `function useLiveSession(lessonId) {` (answerKey/keyRef yo'q).

### 2.2 `set_quiz_keys` — `startMentor` ichida, `liveStore(... mode:'mentor' ...)` dan KEYIN
```js
liveStore(lessonId, { mode: 'mentor', pin: row.pin, token: row.token });
// 🔴 Javob kalitini serverga avto-yuklash — busiz server hammani "xato" deb hisoblaydi (podium 0/5).
if (keyRef.current) liveRpc('set_quiz_keys', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim(), p_keys: keyRef.current }).catch(() => {});
```
❌ Xato: bu qator umuman yo'q → kalit serverga bormaydi.

### 2.3 `answerKey` chaqiruv tomonida quriladi (odatda buzuq darslarda ham bor)
```js
const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
const live = useLiveSession(LESSON_META.lessonId, answerKey);
```

### 2.4 `INLINE_KEYS` ↔ `correctIdx` muvofiqligi
- Shakli: `{ [screenId]: correctIdx }`. Yozma (input) savollar uchun `-1`.
- **Har `INLINE_KEYS[id]` qiymati o'sha ekranning `QuestionScreen`ga uzatilgan `correctIdx` bilan bir xil bo'lishi SHART**, aks holda to'g'ri javob ham "xato" sanaladi.
```js
const INLINE_KEYS = { s4: 2, s5b: 3, s7: -1, s11: 1 }; // Htmllesson1 (s15 olib tashlangan)
```

### 2.5 Server-baholash tamoyili (nega kalit shart)
- O'quvchi `p_picked` (tanlagan indeks) yuboradi; server `p_picked === kalit[p_question_id]` ni tekshirib `correct` ni **o'zi** yozadi.
- Klientning `p_correct` qiymatiga **ishonilmaydi**.
- Isbot: picked=xato + `p_correct=true` yolg'on yuborilsa ham, kalit yuklangan bo'lsa server `correct=false` yozadi.

### 2.6 Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan)
```js
const LIVE_NICK_KEY = 'liveNickname'; // localStorage kaliti — DARSGA EMAS, qurilmaga bog'liq
```
O'quvchi bir darsda yozgan ismi keyingi darslarning LiveGate'ida avtomatik to'ldirilgan chiqadi
(`nickRead()` → input boshlang'ich qiymati). ❌ Xato: kalitni `lessonId` bilan yasash — har darsda qayta so'raladi.

---

## 3. 🔴 `submitAnswer` — imzo va indeks konvensiyalari

Imzo (o'zgartirmang): `submitAnswer(screenIdx, questionId, picked, correct, elapsedMs)` → RPC `submit_answer` (3 martagacha qayta urinish).

| Indeks diapazoni | Nima | `question_id` |
|---|---|---|
| `< 100` | Dars ichidagi testlar | `s4`, `s5b`, ... (SCREEN_META id) |
| `>= 100` (`QUIZ_BASE_IDX + qi`) | Kahoot-jang savollari | `quiz-0`, `quiz-1`, ... |
| `PRACTICE_DONE_BASE (500) + fromScreen` | Praktika "tugatdi" belgisi | `practice-<idx>` |

`liveAnswers(pin)` (indekssiz) faqat `<100`, `liveQuizAnswers(pin)` faqat `>=100` oladi.

---

## 4. 🔴 EKRAN ARXITEKTURASI — `SCREEN_META`, `screens[]`, indeks-maplar

```js
const SCREEN_META = [ { id, type, template, scored, scope }, ... ];      // metadata
const screens = [Screen0, ..., ScreenPodium, ScreenFlashcards, Screen16]; // komponentlar
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);
```

**Muqaddas qoida:** `SCREEN_META` va `screens[]` **bir xil tartibda va bir xil uzunlikda** bo'lishi shart (indeks = massivdagi o'rin). O'quvchi `submit_answer`da `p_screen = screen (massiv indeksi)` yuboradi; podium shu indeks bo'yicha o'qiydi.

### Indeks-kalitli maplar (ekran qo'shish/olib tashlaganda E'TIBOR!)
- `PRACTICE_AFTER = { <idx>: {task, starter} }` — praktika **shu ekrandan keyin** ochiladi (idx = `screens[]` o'rni).
- `Q_LABELS = { <idx>: "..." }` — podium "Savollar bo'yicha" yorliqlari (idx = scored ekran o'rni).
- `INLINE_KEYS` — id bo'yicha (indeksga bog'liq emas).

**Ekran QO'SHISH/OLIB TASHLASH retsepti:**
1. `SCREEN_META` va `screens[]` dan **ikkalasidan** bir xil o'rinda qo'sh/olib tashla.
2. O'zgargan o'rindan **keyingi** barcha indekslar suriladi → `PRACTICE_AFTER` va `Q_LABELS` kalitlarini yangila.
3. Agar qo'shilgan/olingan ekran `scored:true` bo'lsa: `INLINE_KEYS` va `Q_LABELS` dan ham id/kalitni yangila. `scope:'final'` yagona bo'lsa, olib tashlanganda baho umumiy nisbatga o'tadi (graceful).
4. Xavfsiz joy: **hamma indeks-kalit** o'zgarish nuqtasidan **kichik** bo'lsa (masalan oxirga yaqin non-scored ekran qo'shish) — hech qanday map o'zgarmaydi.
5. Build + jonli oqim sinovi (praktika to'g'ri ekrandan ochilyaptimi, podium ishlayaptimi).

> **Misol (bu sessiyada):** `s15` ("ismingizni sarlavha qiling") olib tashlandi — SCREEN_META+screens dan chiqarildi, `INLINE_KEYS`/`Q_LABELS` dan s15 olindi, `PRACTICE_AFTER` 16→15 (yakuniy praktika endi Debugging'dan keyin). `ScreenFlashcards` esa summarydan oldin qo'shildi (idx 17) — hamma kalit <17 bo'lgani uchun maplar o'zgarmadi. (Htmllesson2'da ham xuddi shu retsept bilan s15 olib tashlangan.)

### 4.1 STANDART DARS OQIMI (pedagogik skelet)

Har dars shu qolipda quriladi (HTML-1/HTML-2 tasdiqlangan):
```
s0  HOOK        — qiziqtirish: savol + tanlov (optionalLive)
s1  REJA        — "Bugun N qadam" + dars oxiridagi natija preview ("↩ Natijani ko'rish")
    ... SIKL (3-5 marta): EXPLORATION (1-3 ekran, animatsiya) → TEST (QuestionScreen) → ba'zisidan keyin PRAKTIKA (9.4)
    BUILDER     — "Buyruq bering — kod o'zi yaraladi" (AI-his, kamida 3 bo'lak)
    DEBUGGING   — AI/kod xatosini top va tuzat (nishon: debugger)
s15b PODIUM     — jonli reyting (🥇🥈🥉 + savollar statistikasi)
sflash FLASHCARD — takrorlash (jonlida faqat mentorga — 9.3)
s16 SUMMARY     — yakun (4.2)
```
- `LESSON_META.lessonId` formati: `<fan>-<NN>-v<versiya>` (masalan `html-02-v16`) — sessiya/localStorage shu kalitga bog'lanadi; katta kontent o'zgarishida versiya oshiriladi.
- Ekran tiplari SCREEN_META'da: `hook / rule / exploration / test / case / stats / review / summary`.

### 4.2 YAKUN SAHIFASI (summary) — standart tarkibi
Tartib bilan: **✓ Dars tugadi chip + sarlavha + ScoreRing** → **⚡ CodeStrike CTA** (studentWait/Solo/Live/mentor holatlari — 8-bo'lim) → **split: «Endi siz bilasiz» (RECAP) + «📝 Uyga vazifa» (HOMEWORK)** → **🏅 Nishonlar kolleksiyasi (X/4)**. Nav: «Qaytadan» (reset) + «Modulni yakunlash →» (finishLesson → payload: lessonId, nickname, ballar, davomiylik).

### 4.2-A 🔴 DARS BITTA GAP BILAN YOPILADI — «Bugungi asosiy fikr» (103-qonun, 2026-08-02, F-0802-06)

Dars bir nechta tushunchani o'rgatsa, ular ekranlar bo'ylab **alohida-alohida** yashaydi va
o'quvchi ularni bir-biriga bog'lay olmasdan chiqib ketadi. RECAP buni yopmaydi — u sanoq
ro'yxati, xulosa emas.

📌 **Talab:** har darsning yakun sahifasida **bitta gap** turadi — o'quvchi dars oxirida
**o'z og'zi bilan ayta oladigan** xulosa. Dars loyihalanganda AVVAL shu gap yoziladi, keyin
ekranlar unga olib boradigan qilib quriladi (natija-avval loyihalash).

- **Joyi:** hero + ScoreRing dan KEYIN, CodeStrike CTA dan OLDIN (birinchi ko'zga tushadigan joy).
- **Hajmi:** ataylab kichik — `small` o'lchov, 1 qator ikona + `Bugungi asosiy fikr —` yorlig'i.
  Katta qilinsa RECAP bilan raqobatlashadi va ikkalasi ham o'qilmaydi.
- **Ohangi:** ikki tushuncha bir-biriga **ulanadi**, qayta ta'riflanmaydi.
  ✅ «Har qanday ilova — bu **sistema**. Sistema ichida esa **algoritmlar** ishlaydi.»
  ❌ «Sistema — qismlar va bog'lanishlar, algoritm — qadamlar tartibi» (bu RECAP, xulosa emas).
- **Audio:** yakun-ovozi ham aynan shu gapni aytadi (matn va ovoz bir xil bo'lsin).
- **Flashcardga qo'shilmaydi** — flashcard faqat darsda O'TILGAN atamalarni takrorlaydi;
  yopuvchi fikr — sintez, atama emas (foydalanuvchi qoidasi, 2026-08-02).

> ⚠️ **Kalit so'zlar (GLOSSARY) yakun sahifasida BO'LMAYDI.** Takrorlash uchun alohida **Flashcard** sahifasi bor (`ScreenFlashcards`, summarydan oldin) — glossary uni takrorlar, shuning uchun olib tashlangan. Yakun sahifasi Nishonlar kolleksiyasi bilan tugaydi. (`GLOSSARY` const va `open/setOpen` state ham Screen16'dan olib tashlangan; `.gloss*` CSS ishlatilmaydi.)

---

## 4.3 🔴 TEST-SAVOLI TIPOGRAFIYASI — `.h-ask` (105-qonun, 2026-08-02, F-0802-11)

Savol `.h-title` (`clamp(22px,4vw,38px)` + `.title` dan `line-height: 1.1`) bilan chizilmaydi —
u **qisqa sarlavha** klassi. 10–20 so'zlik savol unda 3–4 qatorga bo'linib, qatorlar
bir-biriga yopishadi. Etalon o'lchov repo ichida bor: **arena** `.qz-q` (28px / lh 1.35).

```css
.h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
```
- Savol-sarlavhasi: `className="title h-ask"` (ilgari `title h-sub` / PM darslarda `title h-title`).
- `.h-title` va `.h-sub` ga **tegilmaydi** — ular sarlavha va yakun-subtitr uchun qoladi.
  (2026-09-15: `.h-title` o'lchami 150-qonun bilan 36px ga o'zgardi — 11-N; bu band savol-sarlavhasi `.h-ask` haqida.)
- Variant tugmasi: `font-size: clamp(15px,1.85vw,17px)` · `line-height: 1.45` ·
  padding `clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)` · variantlar orasi **11px**.
- Savol÷variant nisbati **2.4× → 1.6×** (asosiy ish — variantlarni o'qish — mayda qolmaydi).
- Savol MATNI ham qisqa: 105b-qonun + `MATN_KORPUS.md` 68-bo'lim.

> Dasturiy o'lchov: `title h-ask` ishlatgan har faylda `.h-ask {` e'loni bor (0 ta
> «ishlatgan, e'lon qilmagan»); e'lon faylda bittadan ortiq emas; `.option` da `line-height: 1.45`.
> To'liq matni: `PM_DARS_ETALON.md` 105-qonun. Tatbiq: **111 dars fayli**.

---

## 5. 🔴 `QuestionScreen` — javob berish logikasi

- `mountTs = useRef(Date.now())` — tezlik (savol ochilishidan bosishgacha; teng ballda hal qiladi).
- `firstCorrectRef` — **1-urinish qotiriladi**; qayta urinish bahoni oshirmaydi.
- `oneShot = !!(live && live.mode === 'student')` — jonli darsda bir urinish (xato bossa ham qulflanadi).
- Jonli javobda: `live.submitAnswer(screen, SCREEN_META[screen]?.id || 's'+screen, i, isCorrect, Date.now() - mountTs.current)`.

### 5.5 🟡 NavNext `optionalLive` — jonli darsda animatsiya MAJBURIY EMAS (freeRide)

Jonli darsda mentor animatsiya-mashqni **proyektorda o'zi ko'rsatadi** — har bir o'quvchini
bajarishga majburlash sinfni sekinlashtiradi va bolani mentordan orqada qoldiradi
(manba: `InternetLesson.jsx`).

```js
const NavNext = ({ disabled, label = 'Davom etish', onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  // Jonli dars DAVOMIDA (o'quvchi, sessiya tugamagan, mentor tirik) gate yumshaydi
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  // disabled={(freeRide ? false : disabled) || locked}
  // freeRide && disabled → yorliq majburlovchi matn o'rniga neytral "Davom etish"
```

**Qoidalar:**
- `optionalLive` **FAQAT animatsiya/mashq ekranlariga** beriladi: hook (1-sahifa tanlovi),
  exploration (bosib o'rganish, almashtirish, yurgizish), builder ("buyruq bering"),
  debugging (xato topish).
- ❌ **BERILMAYDI:** testlar (`QuestionScreen` — jonli ballda javob majburiy), yozma test
  ekranlari (input orqali javob), flashcard/podium/summary (ularda gate yo'q yoki o'zi ochiq).
- **Erkin rejimda avto-qaytadi:** sessiya "erkin qilingan" / mentor uzilgan / yakka o'qishda
  `freeRide=false` → gate yana majburiy. Alohida kod kerak emas — formula o'zi hal qiladi.
- `locked` (mentordan oldinga o'tolmaslik) bundan MUSTAQIL ishlaydi — freeRide uni bekor qilmaydi.
- Oqibat: freeRide'da bola bosqich-nishonini (10-bo'lim) o'tkazib yuborishi mumkin — me'yoriy;
  mashqni bajargan bola nishonini oladi.
- Holat: InternetLesson (11 ekran) · Htmllesson1 (9 ekran) · Htmllesson2 (11 ekran) ✅.

---

### 5.6 🟡 MAJBURIY: 📖 RECAPS — har scored test uchun «Qayta tushuntirish» kartalari

`RECAPS = {}` bo'sh qoldirish TAQIQLANADI — busiz test past chiqqanda mentorga «📖 Qayta tushuntirish»
tugmasi, xato qilgan o'quvchiga «Qisqa takrorlash» tugmasi UMUMAN chiqmaydi (infra ishlaydi, kontent yo'q).

```js
const RECAPS = {
  <scoredIdx>: {                    // kalit = scored ekranning screens[] indeksi (Q_LABELS bilan bir xil!)
    title: 'Mavzu nomi', cards: [   // har test uchun AYNAN 3 karta
      { ic: '🖼️',                   // katta emoji
        h: 'Bitta aniq g\'oya',      // sarlavha — bitta gap
        body: <>1–2 sodda gap, <b>muhim so'z</b> qalin, teglar <b className="mono">&lt;img&gt;</b> ko'rinishda</>,
        vis: <RcFlow items={['A', 'B', 'C']} />,  // ko'rgazma (ixtiyoriy, lekin tavsiya)
        ask: "Sinfga og'zaki savol?" },            // jonli muloqot (kamida 1-2 kartada)
    ]
  },
};
```
- Kontent — o'sha testdan OLDINGI nazariya ekranlaridagi metafora/misollar bilan BIR XIL bo'lsin
  (dars "uy" misolini ishlatsa, recap ham "uy" deydi — yangi metafora kiritilmaydi).
- `ask` — mentor proyektorda o'qib, sinf bilan og'zaki muloqot qiladi; backtick ISHLATILMAYDI
  (RecapOverlay `{card.ask}`ni oddiy matn qiladi, chip bo'lmaydi).
- Namuna: `InternetLesson.jsx` 1675-qator (5 test × 3 karta) · Htmllesson1/2 (4 × 3, 2026-07-08).
- ⚠️ String qiymatlarda apostrof bo'lsa — qo'shtirnoq: `h: "body — ko'rinadigan qism"` (aks holda build sinadi).
- Tekshiruv: `RECAPS` kalitlari `SCORED_IDX` bilan to'liq mos (har scored test uchun bittadan).

### 5.7 🔴 KAHOOT-REVEAL — jonli testda natija mentor ochguncha yashirin

Jonli darsda o'quvchi javob bosgach, to'g'ri/xato ekani DARHOL ko'rsatilmaydi — mentor
«🔓 Natijani ochish»ni bosganda proyektorda ham, BARCHA o'quvchi ekranida ham birdan ochiladi.

- **Server maydoni:** `live_sessions.reveal_screen` — mentor `reveal_screen` RPC bilan yozadi,
  o'quvchi pollingda `revealScreen` sifatida oladi (`syncQuiz` ichida).
- **Mentor:** `doReveal()` — optimistik `setMReveal(true)` + `live.mentorReveal(screen)`; sahifa
  yangilansa serverdagi `revealScreen === screen` dan qayta tiklanadi. Reveal'gacha variantlar
  proyektorda NEYTRAL (to'g'risi ajratilmaydi); NavNext `mReveal`gacha qulf («Avval natijani oching»).
- **O'quvchi:** javob qotadi (`oneShot`), kutish holati — ko'k neytral belgi (`option-wait`,
  `frame-wait`, «📨 Javobingiz qabul qilindi» + 1-bo'limdagi tinch matn). Natija ochilish formulasi:
  ```js
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || live.mentorScreen > screen || live.status === 'ended' || !live.mentorAlive));
  ```
  (mentor keyingi sahifaga o'tsa / dars tugasa / mentor uzilsa — natija o'zi ochiladi, bola osilib qolmaydi).
- **MentorTestStats reveal'gacha:** faqat «javob berdi N/M» ko'rinadi — ✅/❌ soni va ustunlar yashirin
  («Natijani ochish»dan keyin chiqadi). Erkin/self rejimda reveal YO'Q — natija darhol ko'rinadi.

### 5.8 🔴 PERSONAJ-ROL TAQIQI — vazifani MENTOR beradi (2026-07-29, foydalanuvchi qarori · F-0729-27)

Darsda o'ylab topilgan personaj (buyurtmachi-do'st, chat-pufakli qahramon: «Diyor» kabi)
ISHLATILMAYDI — na sahifa-matnda, na testlarda, na audio-matnda. Yagona ovoz — **Mentor**:
u yo'nalish beradi va tushuntiradi.

- Bosqich-topshiriq personaj xabari emas, **vazifa-karta** bilan beriladi (HtmlTakrorlash
  etaloni: `TaskCard` — 🎯 belgisi + «Vazifa» yorlig'i + accent chap-chiziq).
- Kod-misollardagi odam ismlari faqat **kontent-ma'lumot** sifatida qoladi (ro'yxat bandi,
  forma qiymati) — ular «gapirmaydi», reaksiya-pufak yozmaydi.
- Sabab: rol-o'yin bolani chalg'itadi, matnni cho'zadi va etalon-darslarda (Htmllesson1)
  bunday qatlam yo'q — vazifa Mentordan kelsa, ohang bir xil qoladi.
- Tekshiruv-grep: dars matnida personaj ismi bilan imzolangan chat-pufak (`dy-msg`,
  `DChat` uslubidagi komponent) bo'lmasin.

### 5.9 🔴 IKKINCHI QADAM AFFORDANSI — ipucha JOYNI aytadi + element pulsatsiya qiladi (2026-08-01, F-0801-11)

Ko'p-qadamli interaktiv mexanikada (belgila → formatla, tanla → qo'y, sudra → tashla)
o'quvchi **birinchi qadamni** o'zi topadi, **ikkinchisida esa qotib qoladi** — chunki yangi
boshqaruv (pop-up menyu, chiqib kelgan tugma) uning ko'z-yo'lidan tashqarida paydo bo'ladi.
Foydalanuvchi dalili: *«Men ham birinchi qarashda xabarni bosaman deb o'yladim. B/I menyusi
bosilishini esa darrov anglamadim»* — muallif ham topolmagan bo'lsa, o'quvchi umuman topmaydi.

Ikkala choraning **ikkalasi ham** qo'yiladi (bittasi yetarli emas):

1. 🔴 **Ipucha element NOMINI va JOYINI aytadi, konteyner nomini emas.**
   ❌ «Ustidagi **menyudan** B (qalin) yoki I (yotiq) tanlang» — «menyu» ekranda yozilmagan
   so'z, o'quvchi uni izlaydi. ✅ «👆 **Yuqoridagi B yoki I tugmasini bosing**» — nima
   (tugma), qayerda (yuqorida), qanday (bosing). Qavs-izohlar (qalin/yotiq) ipuchadan
   olib tashlanadi — ular tugmaning O'Z `title` ida (99-qonun: ko'rsatma bir joyda).
2. 🔴 **Kutilayotgan element «nafas oladi»** — hali bosilmagan boshqaruv ~2 s davrda bir
   marta kattalashib-kichrayadi (`scale(1) → 1.22`, fon yorishadi). Bosilgach pulsatsiya
   **o'chadi** (bosilgan-holat bayrog'i bilan: `usedB`/`usedI`) — aks holda bajarilgan ish
   ham chaqirib turadi. Naqsh: `Htmllesson1.jsx` `.tgm-menu button.pulse` + `@keyframes tgm-breathe`.
3. `prefers-reduced-motion: reduce` da animatsiya **o'chadi, affordans esa qoladi** —
   pulsatsiya o'rniga doimiy yorug' fon. (Harakatni butunlay o'chirib qo'yish = 1-qadamdagi
   muammoni qaytarish.)

📌 Tekshiruv (`darslik-tekshiruvchi` / `darslik-animatsiya`): har ko'p-qadamli mexanikada
**2-qadamning boshqaruvi** — pulsatsiyasi bormi va ipuchada uning aniq nomi turibdimi?

### 5.10 🔴 TASHQI BOG'LIQLIK DARSNI TO'XTATMAYDI — ZAXIRA-YO'L MAJBURIY (2026-08-01, F-0801-12)

Dars o'quvchini **o'z kompyuteridan tashqariga** chiqarsa (sayt ochish, dastur o'rnatish,
ro'yxatdan o'tish), o'sha nuqta **buziladi**: sayt yotadi (`ERR_CONNECTION_RESET`), antivirus
o'rnatuvchini to'xtatadi, administrator huquqi yo'q, internet uziladi, OS boshqa chiqadi.
Bularning **hech biri bizning aybimiz emas — lekin o'quvchi uchun farqi yo'q**: u «dars
buzilibdi» deb o'ylaydi va to'xtaydi. Foydalanuvchi dalili: *«Agar o'quvchi shunday xatoni
ko'rsa, u "dars buzilibdi" deb o'ylaydi. Bu sizning aybingiz bo'lmasa ham, o'quvchi uchun
farqi yo'q.»*

🔴 **Bosh mezon: darsning YAKUNIY VA'DASI bitta tashqi bog'liqlikka osilib qolmaydi.**
«Bugun saytingiz internetga chiqadi» va'da qilingan bo'lsa, u Git o'rnatilmasa ham bajariladi.

1. 🔴 **Har tashqi qadamda `help` bandi** — xatoning **aynan matni** yozilib, ayblov o'quvchidan
   olinadi: «Sayt ochilmasa (masalan `ERR_CONNECTION_RESET`) — **bu sizning xatongiz emas**».
2. 🔴 **Ekran oxirida 🛟 ZAXIRA-YO'L paneli** (`FallbackPanel`, yopiq `details` — kerak bo'lgan
   ochadi, qolganlarga ekranni to'ldirmaydi). Ichida ikki qatlam: **(a)** o'sha ishning boshqa
   yo'li (sayt o'rnida paket-menejer buyrug'i), **(b)** 🔴 **butunlay boshqa marshrut** — natijaga
   olib boradigan, tashqi bog'liqliksiz yo'l.
3. 🔴 **OS-qamrovi.** Buyruq/tugma nomi OS'ga qarab farq qilsa, uchalasi ham yoziladi
   (Windows · macOS · Linux) — bitta OS'ga yozilgan ekran boshqasida shunchaki **noto'g'ri**.
4. 🔴 **Darvoza qulflanmaydi.** Qadamlar «bajardim» belgilanishiga bog'liq bo'lsa, zaxira-panel
   ochiq aytadi: bajarolmagan qadamni ham belgilab, **keyingi ekranga o'ting**. Aks holda
   himoya o'rniga yangi devor quriladi.

📌 Tatbiq-namunasi: `GitLesson.jsx` — `FallbackPanel` + `.dsx-fb*` (o'rnatish ekranida
`winget`/`brew`/`apt`, push-amaliyotida **Add file → Upload files** marshruti).
Tekshiruv (`darslik-tekshiruvchi`): darsdagi har tashqi manzil/o'rnatishni sanab chiqing —
har birida `help` bormi va ekranda zaxira-panel bormi?

## 6. 🟡 `MentorTestStats` — «to'g'ri» sanog'i ustunlar bilan bir manbadan

Serverdagi (eskirishi mumkin) `a.correct`ga tayanmang — ustunlar bilan **bir xil mantiqdan**:
```js
const ok = data.rows.filter(a => a.picked === correctIdx).length;   // ✅ To'g'ri
// const ok = data.rows.filter(a => a.correct).length;              // ❌ ustunga zid chiqishi mumkin
```
Sabab: pastdagi ustunlar `picked === correctIdx` bilan chizadi. (Bu — "1 xato" statistika bugi tuzatuvi, 12-bo'limga qarang.)

---

## 7. 🔴 `ScreenPodium` — reyting
```js
.sort((x, y) => y.okCount - x.okCount || x.time - y.time); // to'g'ri ↓, teng bo'lsa vaqt ↑
```
`okCount = mine.filter(a => a.correct).length` — server-baholangan → **2-bo'lim kaliti yuklangan bo'lsagina to'g'ri**.

---

## 8. 🔴 CODESTRIKE ARENA (Kahoot-jang)

### 8.1 Ball formulasi (o'zgartirmang)
```js
const QUIZ_MS = 15000, QUIZ_BASE_IDX = 100;
const quizPts = (ms) => ms <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(ms, QUIZ_MS) / QUIZ_MS) / 2)));
// quizScore: har to'g'ri javob quizPts + (streak>=2 ? 100 : 0); pts ↓, teng bo'lsa ok ↓
```
- Max 1000 ball (≤500ms), 15s oxirida to'g'ri javob 500. Streak (2+) → +100.
- **Standart hajm: 12 savol** (8.3 taqsimot 3/3/3/3 shunga mo'ljallangan), har biriga **15 soniya** (`QUIZ_MS = 15000` — 2026-07-09 "optimallashdi"da 20s→15s: CodeStrike=jang/tezlik hissi, L1 g'olib. ⚠️ L2/CssLesson1/CssLesson2'da hali 20000 — ko'chirish/keyingi ishlovda 15000 ga tushiriladi).
- `QUIZ_BANK` har elementida `{ q, opts, correct }` — `correct` **haqiqiy indeks** (kalitga kiradi).
- ⚠️ `quizScore` `a.correct`ga tayanadi → kalit yuklanmasa **0 0 0 0**.

### 8.2 CodeStrike brend dizayni (Htmllesson1 etaloni; eski nomi CoddyHoot — ishlatilmasin)
- **Nom:** arena brendi **"CodeStrike"** (`Code<span class="qz-wm-h">Strike</span>` wordmark), CTA: "⚡ CodeStrike jangi".
- **Ranglar:** issiq/moviy CoddyCamp muhiti (`#F0F4FC` fon, accent `#FF4F28`). `QUIZ_COLORS = ['#FF5A2C','#0FA6D6','#F5A623','#22A05C']` (coral/ocean/sun/leaf).
- **Chaqmoq mascot:** `QzBolt` (SVG: gradient kvadrat + oq chaqmoq + uchqunlar) — lobby/CTA/podium. ❌ boyqush (`QzOwl`) eskirdi.
- **Jonli fon:** `QzFX` canvas — suzuvchi uchqunlar + "web" chiziqlari + kod tokenlari. `QZ_BG_SHAPES` = kod tokenlari (`</>`, `{ }`, `href` ...).
- **Plitkalar:** glossy, shakl doirachada; `qz-` CSS to'liq CodeStrike uslubida.
- **Fon tokenlari DARS MAVZUSIDAN (majburiy):** `QZ_BG_SHAPES` (suzuvchi belgilar) va `QzFX` ichidagi `TOK` massivi aynan shu darsda o'rganilgan atamalardan tuziladi — bola arenada "kun bo'yi ko'rgan" so'zlari uchib yurganini his qiladi.
  Misollar: HTML-1 → `</>`, `<h1>`, `</ul>`, `href`, `<a>`, `<p>`; HTML-2 → `<img>`, `src=`, `alt`, `</form>`, `<input>`, `<header>`, `F12`; CSS → `color:`, `{ }`, `.class`; JS → `let`, `=>`, `git`/`commit` (Git darsi).

### 8.3 QUIZ_BANK javob taqsimoti — TENG (3/3/3/3)
Variantlar aralashtirilmaydi (shuffle yo'q) — shuning uchun to'g'ri javoblar 4 pozitsiya
o'rtasida **teng taqsimlanishi SHART** (12 savolda 3/3/3/3). Aks holda ziyrak bola naqshni
sezadi ("javob doim tepada") va o'qimasdan bosadi. Bitta pozitsiyada 0 ta to'g'ri javob = xato.
Tekshiruv:
```
sed -n '/const QUIZ_BANK = \[/,/^\];/p' <fayl> | grep -oE "correct: [0-9]" | sort | uniq -c
```
→ har raqamdan teng (12 savolda 3 tadan). Holat: Htmllesson1 ✅ 3/3/3/3 · Htmllesson2 ✅ 3/3/3/3.

### 8.4 🔴 JAVOB UZUNLIGI TENG — to'g'ri javob uzunligidan bilinmasin (naqsh #2)
Pozitsiya taqsimotidan (8.3) tashqari yana bir naqsh: **to'g'ri javob ko'pincha eng uzun/eng batafsil bo'lib qoladi** (yozuvchi to'g'risini to'liq, xatolarini qisqa yozadi). Ziyrak bola buni sezadi va **o'qimasdan eng uzun variantni** tanlaydi — to'g'ri chiqadi. Bu **inline testlarga ham (`QuestionScreen` `options`), arenaga ham (`QUIZ_BANK` `opts`)** tegishli.

**Qoida:** bitta savoldagi variantlar **taxminan bir xil uzunlikda** bo'lsin. To'g'ri javob boshqalaridan sezilarli uzun (yoki qisqa) bo'lib ajralib turmasin — barchasi bir xil "vazn"da. Xato variantlar ham to'liq, ishonarli yozilsin (qisqa-quruq emas); to'g'ri javob ham ortiqcha cho'zilmasin.
- ❌ To'g'ri: "`<a>` tegi havola yasaydi, `href` ichiga bosilganda ochiladigan manzil yoziladi" · Xatolar: "`<link>`", "`<url>`", "`<web>`" — to'g'risi 5× uzun → bola uzunidan taniydi.
- ✅ Hammasi tegsimon/qisqa yoki hammasi tushuntirishli — bir xil shakl.
- Mas'ul: 🎓 Metodist (variant matnlarini balanslaydi — `correct` indeks va POZITSIYAsiga TEGMAYDI); 🔍 Tekshiruvchi tekshiradi. Ko'z bilan: har savol variantlarini o'qib, to'g'risi uzunidan ajralib turmaganini tasdiqla.
- Holat: **Htmllesson1 ✅** (2026-07-09 audit — QUIZ_BANK Q6/Q9/Q10 balanslandi, inline testlar avvaldan teng).

---

## 9. 🟢 INTERAKTIV REUSABLE KOMPONENTLAR

Har biri **kontentdan ajratilgan** — boshqa darsga faqat ma'lumot almashtiriladi. Hammasi CodeStrike/CoddyCamp uslubida.

### 9.1 🧲 `DragDropOrder` — bo'laklarni to'g'ri tartibda joylash
- Props: `items` (to'g'ri tartibda [{id,label}]), `hints`, `onSolved`.
- **Yagona atomik holat** (`const [st, setSt] = useState({pool, slots})`) — setState ichida setState YO'Q (StrictMode dublikat bug'idan himoya).
- Sudrash: **asl chip DOM transform bilan** suriladi (state emas → pirillamaydi; `position:fixed` klon YO'Q → ekran pastida chiqmaydi). Tap ham ishlaydi.
- Namuna: skelet yig' (Screen5 ichida — `explored` bo'lgach sayt-preview o'rniga chiqadi).

### 9.2 🐞 `DebugChallenge` — buzuq kodni topib tuzatish (jonli preview bilan)
- Props: `lines` (bittasida `bug:true`), `fixed`, `explain`, `renderPreview(ok)`, `onSolved`.
- **Realga yaqin:** kod + JONLI preview yonma-yon. Buzuq preview boshidan xato ko'rinadi (masalan h1 yopilmagani uchun butun matn katta). Xato qator topilganda kod tuzaladi VA preview ko'z oldida to'g'rilanadi.
- Namuna: page 16 "Debugging" (Screen13) — AI kod yozgan, xatoni top.

### 9.3 🃏 `Flashcards` — aktiv takrorlash (3D flip + spaced recall)
- Props: `cards` [{front, back, note}].
- 🔴 **KARTA-MAZMUNI: TO'G'RIDAN-TO'G'RI SAVOL (2026-07-29, F-0729-26 — butun platformada muhrlandi).**
  «Ta'rif → atamani top» topishmoq-qolipi **TAQIQ**: bola nima so'ralayotganini tushunmaydi, faqat taxmin qiladi.
  - `front` = to'liq savol, **`?` bilan tugaydi** (uz ham, ru ham). ❌ «Eng katta sarlavha» → ✅ «Eng katta sarlavhani qaysi teg yozadi?»
  - `back` = qisqa javob (1–4 so'z yoki kod). `note` = bir qatorlik izoh/misol.
  - Kartalar soni: **10–12**. Savollar FAQAT o'sha darsda o'tilgan mavzudan — darsda izohlanmagan atamani kartaga chiqarish taqiq (audit paytida `DOM`, `HTTP`, `URL`, `Primary Key`, `onclick` kabi «o'rgatilmagan» kartalar topilib olib tashlangan).
  - 🔴 **Parallel-matn:** karta-qolipi o'zgarsa, flashcard-ekranining Mentor va audio matni ham birga o'zgaradi («Har kartada bir **savol** — javobini o'ylang»), va old-tomon ishorasi savolni **takrorlamaydi** (❌ «Qaysi teg?» ustiga «Qaysi teg?» — ✅ «Javobni o'ylang»).
  - 🔴 **`tr(card.back)`** majburiy — aks holda javobni ikki tilda yozib bo'lmaydi (11 darsda shu yetishmayotgan edi).
- 3D flip (`transform-style: preserve-3d; rotateY(180deg)`), "Bildim"/"Takrorlash" (takrorlash kartasi navbat oxiriga → spaced recall), progress bar, yakun ("🎉 Hammasini bilasiz!").
- **Quizlet uslubidagi baholash (majburiy ko'rinish):**
  - Tugmalar: `✗ Takrorlash` — qizil (accent hoshiya/matn), `✓ Bildim` — yashil to'ldirilgan;
  - Bosilganda karta rangli **muhr** bilan uchib ketadi: ✓ yashil doira + o'ngga (`fc-out-knew`), ✗ qizil doira + chapga (`fc-out-again`); yangi karta pastdan kirib keladi (`fc-in`, `swapRef` kaliti bilan remount);
  - Tepada ikkita jonli **hisoblagich-pill**: `↻ O'rganilmoqda · N` (qizil-soft) va `✓ Bildim · N` (yashil-soft) — qiymat o'zgarganda pop animatsiya (`fc-pill-pop`);
  - Animatsiya davomida (`exiting`) tugmalar va flip qulflanadi — ikki marta bosish bug'i yo'q.
- **Alohida sahifada** (`ScreenFlashcards`, summarydan oldin) + deck/taxlam effekti (`.fc-cardwrap::before/::after`).
- **Jonli darsda FAQAT MENTORGA** — mentor proyektorda kartalarni ochib sinf bilan JAMOAVIY takrorlaydi ("qaysi teg?" — sinf javob beradi, karta ag'dariladi); jonli o'quvchidan yashirin. Mentor «Erkin qilish» qilgach (yoki uzilsa / yakka o'qishda) o'quvchilarga ham ochiladi — bola orqaga bosib kiradi va individual takrorlaydi.

  | Kim / qachon | Flashcard |
  |---|---|
  | 🧑‍🏫 Mentor, jonli dars payti | **Ko'rinadi** — podiumdan keyin proyektorda ochadi |
  | 👨‍🎓 O'quvchi, jonli dars payti | Ko'rinmaydi (sakrab o'tiladi) |
  | 👨‍🎓 O'quvchi, «🔓 Erkin qilish»dan keyin / mentor uzilsa | **Ko'rinadi** — orqaga bosib kiradi |
  | Yakka o'qish (self) | Doim ko'rinadi |

  Nega shunday: jamoaviy takrorlash (xor usuli) CodeStrike jangidan oldin miyani "isitadi"; individual spaced recall esa erkin rejimda o'z tezligida qoladi. Ballga ta'siri nol (`scored:false`, nishon bog'lanmagan). Navigatsiya darajasida sakrab o'tiladi (komponent ichida emas — orqaga qaytishda ham ishlashi uchun):
  ```js
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () =>
    live.mode === 'student' && live.status !== 'ended' && live.mentorAlive; // faqat jonli o'quvchidan yashirin
  // advance(): n === FLASH_IDX && flashHidden() → n+1;  prev(): → n-1
  ```
  Yon ta'sir (me'yoriy): mentor flashcardda turganida o'quvchi podiumdan keyingi sahifaga (yakun) o'tib olishi mumkin — u yerda CodeStrike CTA baribir «⏳ Mentorni kuting» holatida turadi, sinxronlik buzilmaydi.
- **Flashcardga nishon berilmaydi** — ekran jonli o'quvchidan yashirin, unga bog'langan nishonni jonli o'quvchi dars davomida ololmaydi (10-bo'limdagi taqiq).

### 9.4 ✍️ PRAKTIKA — HtmlCompiler qatlami (student/self/mentor oqimlari)

#### 9.4-B 🔒 KOD NUSXALASH TAQIQI (2026-07-29, foydalanuvchi qarori · F-0729-07)

**Qoida (qat'iy):** dars ekranda ko'rsatgan HAR QANDAY TAYYOR KOD nusxalanmaydi —
o'quvchi uni **qo'lda yozib** o'rganadi. Amalda uchta qulf birga qo'yiladi:

1. **Belgilab bo'lmaydi** — kod ko'rsatiladigan blokka `nocopy` sinfi (`user-select: none`):
   kod-namunalar (`CodeBox`), buzuq-kod ekrani (`.dbg-code`), kompilyatorning shart-paneli
   (`.hc-checklist` — hint'lar ichida tayyor kod bo'ladi).
2. **Ctrl+C ishlamaydi** — o'sha bloklarda `onCopy` / `onCut` / `onDragStart` bloklangan
   (`const noCopy = {...}` yagona obyekt sifatida bir joyda e'lon qilinadi).
3. **Kod maydoniga tashqaridan tayyor kod qo'yib bo'lmaydi** — `<textarea onPaste>` tekshiradi:
   matnda qator-ko'chirish yoki `<teg>` bo'lsa — `preventDefault()`.

**ISTISNO — kod bo'lmagan uzun qiymat.** Rasm manzili (URL), PIN-kod kabi qiymatlar uchun
«Nusxalash» tugmasi QOLADI va bir qatorli matn paste'i ochiq: bu kod emas, uni qo'lda terish
o'rganishga hech narsa qo'shmaydi, faqat xato tug'diradi (HtmlTakrorlash 4-bosqich, rasm manzili).

**Tekshiruv (verifikator):** kompilyator ochiq ekranda `getComputedStyle('.hc-checklist').userSelect`
= `none`; ko'p qatorli matn paste'ida hodisa `defaultPrevented === true`; bir qatorli URL paste'i o'tadi.


> 🔴 **SONI: AYNAN 3 praktika-compiler** (2026-07-09 qaror). 4–5 ta EMAS — dars mavzusining eng kerakli/muhim **3 tasi** olinadi (`PRACTICE_AFTER` uch kalit). Ko'p praktika darsni cho'zadi va charchatadi. Har biri boshqacha ko'nikmani mustahkamlasin (takror emas). Tekshiruv: `sed -n '/const PRACTICE_AFTER = {/,/};/p' <fayl> | grep -cE "^\s*[0-9]+:"` → **3**. (✅ 2026-07-09: L1=Sarlavha+Havola+Yakuniy, L2=Rasm+Forma+Yakuniy, CssLesson1=3 — hammasi 3.)

**Komponent:** `HtmlCompiler({ task, starterCode, onContinue, onBack })` — chapda topshiriq
paneli (shartlar ro'yxati, har birida hint), o'ngda kod maydoni + jonli iframe preview.

**Topshiriq shakli:**
```js
const TASK_X = {
  eyebrow: 'Praktika · mavzu', title: "...", brief: "...",
  requirements: [ { id, label, check: C.attr('img','src', "hint...") }, ... ],
};
const STARTER_X = `<!-- Bu yerga yozing -->\n`;
```
- Shartlar `C.*` bilan **haqiqiy DOM tahlili** (regex emas): `C.has / C.text / C.attr / C.attrs / C.nested / C.count / C.toggle`; **CSS uchun** `C.cssProp(sel, prop)` (xossa bor) / `C.cssValue(sel, prop, val)` (aniq qiymat).
- 🔴 **`parseCss` QISQA XOSSALARni topsin (2026-07-09 bug):** `parseCss` CSSOM ishlatadi — brauzer qisqa xossalarni **longhandga yoyadi** (`gap`→`row-gap`/`column-gap`, `padding`/`margin`→4 tomon, `flex`→3 qism...). Enumeratsiyada faqat longhand chiqadi → `props['gap']` bo'sh → `C.cssProp('.row','gap')` **topa olmaydi** (o'quvchi `gap: 15px` yozsa ham "1/2"). Tuzatish: `parseCss` map ichida qisqa xossalar ro'yxatini `getPropertyValue(sh)` bilan `props`ga qo'sh. **Har CSS praktika sharti — o'quvchi yozadigan har xossa (ayniqsa gap/padding/margin/border) uchun compilator TAYYOR bo'lsin** (qo'lda: har `TASK_*` shartini kompilatorda sinab, to'g'ri yechim ✅ o'tishini tekshir). `C.cssProp` (aniq qiymat emas) ishlatilsin — masalan `gap` uchun `12px`ni majburlaMA.
- **Material HTML — KO'P QATORDA, chekinish bilan** (2026-07-09): index.html material bir uzun qatorda bo'lmasin (o'ngga chiqib ketadi, o'qib bo'lmaydi). Ichma-ich elementlar `\n` + 2-bo'sh chekinish bilan. ❌ `<div class="row"><span>A</span><span>B</span><span>C</span></div>` → ✅ `<div class="row">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>`.
- **CSS praktikasi (2 fayl):** `task.files = [{name:'index.html', lang:'html', starter:'<h1>...</h1>'}, {name:'style.css', lang:'css', starter:'/* Bu yerga yozing */\\n'}]`. index.html — bezaladigan **material** (11.9 tegmaydi, chunki o'quvchi HTML yozmaydi); style.css — o'quvchi yozadigan joy, starter FAQAT `/* Bu yerga yozing */`. Ko'rinish uchun material'ga inline `style="background:..."` berish mumkin (padding/margin ko'rinsin). Namuna: CssLesson1 TASK_COLOR/TASK_TEXT/TASK_BOX (2026-07-08).
- Starter qoidasi (11.9, MAJBURIY): kod maydonida FAQAT `<!-- Bu yerga yozing -->` (yoki CSS'da `/* Bu yerga yozing */`) komment — tayyor teg/matn/ko'rsatma YO'Q; nimani yozish chap paneldagi shartlarda.
- **Pedagogik tartib (MAJBURIY):** praktika shartlari FAQAT shu ekranga qadar O'TILGAN teglarni so'raydi. Hali o'tilmagan teg so'ralmaydi (masalan, sarlavha praktikasida `<p>` so'rash — XATO, chunki `p` keyinroq o'tiladi; o'rniga h1/h2/h6 — narvon mustahkamlanadi). Tekshiruv: har `TASK_*.requirements`dagi teglar dars oqimida praktikadan OLDIN kelgan ekranlarda o'rgatilganini solishtirib chiqing.
- Preview himoyalari (11.4/11.5): `li:empty{display:none}`, `<base target="_blank">`, iframe `sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"`.

**Handoff xaritasi va oqimlar:**
```js
const PRACTICE_AFTER = { <screenIdx>: { task, starter }, ... }; // shu ekrandan KEYIN ochiladi
const next = () => {
  const entry = PRACTICE_AFTER[screen];
  if (!entry) { advance(); return; }
  // 🔴 149-qonun (F-0914-11): jonli sinfda sessiya tugamagan ekan mashq ochiladi — `mentorAlive` bu shartga KIRMAYDI
  if (!(live && (live.mode === 'mentor' || (live.mode === 'student' && live.status !== 'ended')))) { advance(); return; }
  if (live && live.mode === 'mentor') { setMentorPractice({ ...entry, fromScreen: screen }); advance(); }
  else runPractice(entry, screen);
};
const runPractice = (entry, fromScreen) => {
  const done = () => {
    // 🔴 praktika "tugatdim" signali — mentor paneli shu yozuvni sanaydi (3-bo'lim: 500+)
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
    setPractice(null); advance();
  };
  // 🔴 F-0912-04: LMS yo'li HAR DOIM tutiladi — sinxron otilish ham, rad-etish ham.
  const openLocal = () => setPractice({ ...entry, done });          // zaxira: darsning o'z compilatori
  if (typeof onPractice !== 'function') { openLocal(); return; }    // lokal: overlay
  try { Promise.resolve(onPractice(entry.task)).then(done, openLocal); } // production: LMS
  catch { openLocal(); }
};
```

> 🔴 **9.3-A PRAKTIKA-YO'LI TUTILMASDAN QOLMAYDI (F-0912-04, 2026-09-12).**
> ❌ `Promise.resolve(onPractice(entry.task)).then(done);` — `catch` YO'Q.
> LMS tomoni yiqilsa (tarmoq uzilishi, chunk yuklanmasligi, `postMessage` xatosi) rad-etish
> **jim yutilardi**: praktika ochilmas, xato ko'rinmas, `done()` chaqirilmas — dars ham oldinga
> ketmasdi. O'quvchi ekranda qotib qolardi va nima bo'lganini bilmasdi. Sinfda 20 o'quvchidan
> 1 tasida chiqardi (2026-09-11 darslari) — muhitga bog'liq, shuning uchun sinovda ko'rinmasdi.
> ✅ Qoida: **`onPractice` ning HAR uch yiqilish yo'li zaxira-yo'lga tushadi** —
> (1) sinxron otilish → `try/catch`, (2) rad-etish → `.then(done, openLocal)`, (3) `onPractice` yo'q → `openLocal()`.
> Zaxira-yo'l = darsning O'Z compilatori (u baribir faylga yig'ilgan) — mashq bajariladi,
> «tugatdim» signali ham ketadi, mentor paneli to'g'ri sanaydi.
> ⚠️ **Timeout QO'YILMAYDI:** `onPractice` promise'i praktika OCHILGANDA emas, **TUGAGANDA** hal
> bo'ladi — o'quvchi mashqda 10 daqiqa o'tirishi normal. Timeout ochiq praktika ustiga ikkinchi
> compilator ochib yuborardi.
> Uyga vazifa yo'li (`openHomeworkPractice`) ham shu qoidaga bo'ysunadi: ❌ `.catch(() => {})`
> (xatoni yutadi, o'quvchiga hech narsa ochilmaydi) → ✅ `.catch(openLocal)`.
> **Tekshiruv:** `grep -c "then(done);" <fayl>` → **0** · `grep -c "catch(() => {})" <fayl>` → **0**.
- **O'quvchi / self:** "Praktika →" → compilator overlay → shartlar bajarilgach `done()` → signal + keyingi ekran.
- **Jonli mentor:** o'zi compilator ochmaydi — `MentorPracticeOverlay` paneli chiqadi:
  1. *watch* ko'rinishi: «👨‍🎓 Praktikani tugatdi» jonli chiplar («✏️ Ali» → «✓ Ali»), «Tugatdi: N/M» progress, 3s polling `liveAnswers(pin, 500+fromScreen)`;
  2. «🖊 Doskada yozib ko'rsatish» → *demo*: mentor AYNAN shu mashqni proyektorda compilatorda yechib beradi;
  3. «Keyingi mavzuga →» panelni yopadi.
- `reset()` da `setMentorPractice(null)` ham tozalanadi. CSS: `mp-*` klasslar (overlay, card, flow, demo/next tugmalar).
- ❌ Xato: `runPractice(entry)` fromScreen'siz (signal yo'q → mentor panel bo'sh) yoki mentor uchun ham overlay ochish.

#### 9.4-A 🔴 PRAKTIKA-DARVOZASI FAQAT BIR MARTA YOPILADI — takrorlash bepul (2026-07-28, PM 89-qonun bilan bir xil)

> **Muammo (hozirgi holat — TUZATILISHI KERAK):** `next()` izohida ochiq yozilgan: «*agar shu ekrandan keyin praktika bo'lsa — **har safar** compilatorni ochadi (orqaga qaytib qayta bossa ham)*», va bajarilganlik **hech qayerda saqlanmaydi**. Natija: o'quvchi uyda darsni takrorlamoqchi bo'lsa, **uchala praktikani qaytadan** bajarmaguncha oldinga o'tolmaydi. Texnik darsda 3 praktika bo'lgani uchun bu PM darsdan ham og'irroq.

**Talab:**
1. 🔴 **Bajarilganlik saqlanadi.** Har praktika uchun dars-doirasidagi kalit: `localStorage['<lessonId>-practice-<fromScreen>'] = { done: true }` (kod ham saqlansa yanada yaxshi). Kalit **dars-doirasida** bo'lsin (11-qonun formati) — aks holda darslar bir-birining holatini o'qiydi.
2. 🔴 **Qayta kirganda majburlamaydi.** `next()` da: praktika allaqachon bajarilgan bo'lsa — overlay **ochilmaydi**, to'g'ridan-to'g'ri `advance()`. Xohlasa o'zi qayta ochishi mumkin (ixtiyoriy tugma), lekin bu **darvoza emas**.
3. 🔴 **Takrorlash-yo'li** (boshqa qurilma holati): bola sinfda maktab kompyuterida bajargan bo'lsa, dastur buni **BILA OLMAYDI** (login yo'q, PIN dars tugagach yopiladi). Shu YAGONA holat uchun **faqat erkin (self) rejimda** xira **matn-havola** qo'yiladi:
   - matni **umumiy**: «✓ Bu mashqni sinfda bajarganman — davom etish →» (❌ «uy vazifasiga o'tish» — darsda bir nechta praktika bor, keyin nima kelishi har xil);
   - savol-shaklda YOZILMAYDI («bajarganmisiz?» tugmasi nima bo'lishini aytmaydi);
   - **tugma emas, xira havola** — asosiy harakat bilan raqobatlashmasin;
   - 🔴 u **FAQAT eshikni ochadi**: nishon bermaydi · «bajarildi» deb yozmaydi · serverga signal yubormaydi · xotiraga saqlanmaydi (keyingi seansda yana so'raladi — ataylab, aks holda soxta «bajarildi» belgisiga aylanadi);
   - jonli darsda va mentor ekranida **ko'rinmaydi**; bajarilgan bo'lsa ham ko'rinmaydi (darvoza allaqachon ochiq).
4. **Sabab-tamoyil:** jonli darsda o'quvchi praktikani allaqachon o'tkazib yubora oladi (`optionalLive`/freeRide, 5.5) — demak **erkin rejim jonlidan QATTIQROQ bo'lib qolmasligi kerak**.

Namuna-tatbiq: `src/1-Modull/PmLesson2.jsx` → `ScreenCoding` + `.stq-skip`.

> **2026-10-04 TUZATISH (F-1004 2-qism D7, foydalanuvchi qarori A):** 3-band (takrorlash-yo'li «Bu mashqni sinfda bajarganman →») **BEKOR QILINDI** —
> 25 faylda olib tashlandi (suratlar 49, 63 — foydalanuvchi o'zi o'chirgan). Sabab: mustaqil rejimda vazifani bajarmay o'tib ketishga yo'l edi.
> 1-band (bajarilganlik saqlanadi, o'sha qurilmada qayta majburlamaydi) o'z kuchida. Boshqa qurilmada qayta kirgan o'quvchi praktikani yana bajaradi.

---

## 10. 🏅 BADGES (nishonlar) tizimi

> **Nomlash (2026-07-09):** yuqori panel **popover sarlavhasi + tugma aria/title = "Badges"** (inglizcha). ❌ "Achievements" ham, ❌ "🏅 Nishonlar" ham noto'g'ri (popover joyida). Ammo **yakun sahifasi** «🏅 Nishonlaringiz», **bayram** «🏅 Nishon ochildi!», **onboarding** «Nishonlaringiz» — O'ZBEKCHA qoladi (namuna: Htmllesson1). **Nishon NOMLARI (`ACHIEVEMENTS.name`) — inglizcha o'yin-nom** ("Built It!"/"Nice Catch!"/"Level Up!"), o'zbekcha tavsifiy EMAS (❌ "Sahifa quruvchi" — L2'dagi eski uslub). Ichki KOD identifikatorlari o'zgarmaydi (`ACHIEVEMENTS`, `AchCtx`, `.acu-*`). Tekshiruv: `grep -n '"Achievements"\|Achievements —\|🏅 Nishonlar —'` — o'quvchi ko'radigan popover joyida bo'sh (faqat `🏅 Badges —`). ⚠️ **Htmllesson2 hozir ESKIRGAN** (o'zbekcha nom + "Nishonlar" popover) — standartga o'tkazilishi kerak.

3 qatlamli, ko'rinadigan:
1. **🎉 TO'LIQ-EKRAN BAYRAM** (`AchCelebrate`, o'yin uslubi — MAJBURIY, kichik toast EMAS): nishon olinganda butun ekran bo'ylab — spotlight fon + aylanuvchi oltin nur burjlari (`.acu-rays`, conic-gradient, masklangan) + markaziy pulslovchi yorug'lik + ikki zarba to'lqini (`.acu-ring`) + oltin medalyon (emoji, bounce bilan sakrab kiradi + suzadi + shine yugurib o'tadi) + ~14 uchqun radial otiladi (`.acu-spark`, `--a` burchak) + matn ("🏅 Nishon ochildi!" + `name` katta serif + `desc`) ketma-ket ko'tariladi. ~4s, bosib yopiladi, `prefers-reduced-motion` tinch varianti. **Navbatda bittalab** (`AchToasts` faqat `toasts[0]`ni ko'rsatadi — bir nechta nishon ketma-ket). CSS: `.acu-*` blok.
2. **Hisoblagich** — har sahifada "🏅 X/4" (Stage header, progress yonida), yangisida **pulslaydi** (bump); bosilsa popover.
3. **Kolleksiya** — dars oxirida (Screen16) barcha nishonlar (olingan=rangli+tavsif, olinmagan=🔒).

**Arxitektura:**
```js
const ACHIEVEMENTS = { skelet:{icon,name,desc}, firsttag, debugger, graduate }; // AYNAN 4 ta
// name — QISQA, O'YIN USLUBIDAGI INGLIZCHA nom (1-3 so'z, ko'pincha "!" bilan). desc — o'zbekcha, siz-formada nima qilgani.
// ✅ name: "Built It!", "Tag It!", "Nice Catch!", "Level Up!"  ·  desc: "Sahifa skeletini o'zingiz yig'dingiz"
// ❌ name uzun/rasmiy ("HTML bitiruvchisi", "Skelet ustasi") yoki desc inglizcha. Bola o'yindagidek qisqa, quvnoq nom ko'radi.
// Kategoriya→nom uslubi (nishonlar.png): qurish→"Built It!" · birinchi teg→"Tag It!"/"First!" · xato→"Nice Catch!"/"Fixed!" · yakun→"Level Up!"/"Done!"/"Pro!" · xatosiz→"Perfect!"/"On Fire 🔥" · flashcard→"Fast Brain"/"Sharp!"
const ACH_TRIGGERS = { s5:'skelet', s7:'firsttag', s13:'debugger' }; // ekran id → nishon
const AchCtx = createContext(null); // earned Set — Stage hisoblagichi o'qiydi
```
- **Soni: 4 ta** (3 ta dars-bosqich nishoni + `graduate`). Ko'p nishon qiymatini tushiradi, kolleksiyada 🔒lar qolib ketadi.
- **Hammasi darsni oxirigacha o'tgan bolada REAL ochilsin.** ❌ taqiq: jonli darsda yashirin ekranga bog'langan nishon (flashcard — jonli o'quvchi hech qachon ololmaydi) va "100% to'g'ri" (ace) kabi ko'pchilik bajarolmaydigan shart — ikkalasi kolleksiyada doim 🔒 bo'lib turadi.
  > 🔁 **151-qonun (2026-09-18) aniqlashtirdi:** «REAL ochilsin» = har nishonni har o'quvchi **olishi MUMKIN** (yashirin ekran yo'q, imkonsiz shart yo'q). Bu **kafolat emas** — amaliy topshiriq nishoni faqat birinchi urinishga beriladi. Kafolatli yagona nishon — `graduate`.
- Markazlashgan trigger: `recordAnswer` da `if (ACH_TRIGGERS[_m.id] && data.correct) earn(...)`; yakuniy ekranda `earn('graduate')`.
- 🔴 **ACH_TRIGGERS faqat MA'NOLI ekranga bog'lanadi** (2026-07-09 CssLesson2 bug): SCORED test (`type:'test'` — `correct` = to'g'ri javob) yoki haqiqiy challenge (DragDrop/Debug). ❌ **Exploration/toggle ekranga (masalan flex-direction almashtirish) BOG'LANMAYDI** — u yerda `onAnswer({correct:true})` har bosishda yonadi → nishon **tekin** beriladi (o'quvchi bilmasdan «Davom etish» bossa ham oladi). Nishon "biror narsa evaziga" — real ko'nikma ko'rsatilganda ochilsin. Tekshiruv: har `ACH_TRIGGERS` kaliti SCREEN_META'da `type:'test'` yoki challenge ekaniga qara.
- `earn` **`earnedRef` bilan StrictMode-safe** (setState ichida setState emas).
- `AchCtx.Provider value={earned}` root'da; `<Current ... achievements={earned} />`; `<AchToasts .../>` root'da.
- Boshqa darsga: `ACHIEVEMENTS` + `ACH_TRIGGERS` o'sha darsning bosqichlariga moslanadi.

### 10.1 🔴 NISHONLAR MENTOR EKRANIDA (2026-07-29, F-0729-06 — UCHALA qatlam ham o'chadi)

> **Sabab:** nishon — **qurilmaga xos, shaxsiy** narsa. Mentor rejimida mentor testga javob **berolmaydi** (`if (solved || isMentorLive) return;`), shuning uchun proyektordagi hisob mentorning **o'z bosishlarini** sanaydi, sinf ishini emas → **yolg'on son**. To'liq-ekran bayram ham dars oqimini to'xtatib ekranni «yoritib» yuboradi — proyektorda keraksiz (F-0729-06).

| Qatlam | Mentor (proyektor) | O'quvchi |
|---|---|---|
| 1. 🎉 To'liq-ekran bayram (`AchCelebrate`) | ❌ **YO'Q** (2026-07-29 gacha «qoladi» edi — BEKOR) | ✅ bor |
| 2. Hisoblagich (tepadagi 🏅 N/M) | ❌ **YO'Q** | ✅ bor |
| 3. Kolleksiya (yakuniy ekranda ro'yxat) | ❌ **YO'Q** | ✅ bor |

- 📌 Qisqa xulosa: **mentor ekranida badges hech qanday ko'rinishda chiqmaydi** — texnik darsda ham, PM darsda ham.
- ✅ **Platforma bo'ylab bajarilgan (2026-07-29, F-0729-24):** uchala qatlam **79/79 dars faylida** qorovul ostida. Yangi dars qurilganda bu uch qorovul MAJBURIY, aks holda qabulchi qaytaradi.
- **Tatbiq:** hisoblagich komponentining O'ZI qaror qiladi (`if (gate?.live?.mode === 'mentor') return null` — **barcha hooklardan KEYIN**, React qoidasi), shunda bitta tuzatish hamma ekranga tarqaladi. Kolleksiya yakuniy ekranda `{!isMentorL && ...}` qorovuli ostida. Bayram esa root'da: `{live.mode !== 'mentor' && <AchToasts .../>}` (namuna: `src/1-Modull/PmLesson2.jsx`).
- 📌 Qisqa qoida: **mentor ekrani = SAHNA (lahzalar) · o'quvchi qurilmasi = DAFTAR (hisob)** — batafsil 10-B bo'limda.

---

## 10-B. 🖥 MENTOR EKRANI (proyektor) — QAT'IY KO'RINISH (2026-07-28)

> **Nima uchun qat'iy:** mentor ekrani — bu **proyektor**, uni butun sinf ko'radi. U o'quvchi ko'rinishining nusxasi EMAS. Yangi dars qurilganda yoki tekshirilganda quyidagi jadval **band-ma-band** solishtiriladi.

**Ikki tayanch tamoyil:**
1. 🔴 **SHAXSIY narsa proyektorda chiqmaydi** — shaxsiy nishon hisobi, shaxsiy ball. Mentorda ular yolg'on son (10.1 ga qarang).
2. 🔴 **MAG'LUBIYAT-TABLOSI chiqmaydi** — butun sinf oldida «0/4 to'g'ri» ko'rsatish kamsitadi. Mentor bu ma'lumotni **YO'QOTMAYDI**: u dars **PAYTIDA**, aynan test ekranida `MentorTestStats` orqali oladi (6-bo'lim) — o'z joyida va o'z vaqtida.

| Element | Mentor | O'quvchi | Sabab |
|---|---|---|---|
| Nishon-hisoblagichi (🏅 N/M) | ❌ YO'Q | ✅ bor | shaxsiy hisob |
| Yakuniy nishon-kolleksiyasi | ❌ YO'Q | ✅ bor | shaxsiy hisob |
| To'liq-ekran nishon-bayrami | ❌ **YO'Q** (F-0729-06) | ✅ bor | mentorda badges umuman chiqmaydi (10.1) |
| Podiumda «📊 Savollar bo'yicha» (`N/M` per savol) | ❌ **YO'Q** — karta butunlay olib tashlanadi | ❌ yo'q | mag'lubiyat-tablosi |
| Shaxsiy ball-aylanasi (`ScoreRing`) | ❌ YO'Q | ✅ bor (mustaqil rejimda) | shaxsiy hisob |
| Podium reytingi (g'oliblar) | ✅ BOR | ✅ bor | sinf yutug'i — bayram, jazo emas |
| `MentorTestStats` (test paytida) | ✅ **BOR** | ❌ yo'q | mentorning ASOSIY asbobi |
| `MentorPracticeOverlay` / praktika-paneli | ✅ **BOR** | ❌ yo'q | kim tugatdi — mentorga kerak |
| Sinf-pulsi (o'quvchiga «N bajardi») | ❌ yo'q | ✅ bor | mentorda o'rniga to'liq panel |
| Mentor-eslatmalari («faqat sizga») | ✅ BOR (ixcham chip) | ❌ yo'q | yo'riq faqat mentorga |
| Takrorlash-yo'li (9.4-A) | ❌ yo'q | ✅ faqat erkin rejimda | jonli darsda kerak emas |
| Test javobi reveal'gacha | ❌ yashirin | ❌ yashirin | 5.7 Kahoot-reveal |

🔴 **Tekshirish:** dars mentor rejimida ochilib, 12 band ko'z bilan (yoki `live.mode === 'mentor'` qorovullarini grep bilan) tasdiqlanadi. Karta olib tashlanganda uning **CSS'i ham o'lik qolmasin** (`pod-qstats`/`qstat-*` kabi) — residue-grep majburiy. Bittasi mos kelmasa — dars etalon emas.

Namuna-tatbiq: `src/pm/PmUserStoryLesson.jsx` (qstats allaqachon yo'q) · `src/1-Modull/PmLesson2.jsx`.

---

## 11. ⚪ UI TO'G'RILIGI

| # | Qoida | To'g'ri |
|---|---|---|
| 11.1 | 🟡 **Mentor avatari — HOSTLANGAN RASM** (standart, 2026-07-09 qaror) | `<div className="mentor-ava"><img src={MENTOR_IMG} alt="" /></div>` · `const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png'` · CSS: `.mentor-ava{width:40px;height:40px;border-radius:50%;overflow:hidden}` + `.mentor-ava img{width:100%;height:100%;object-fit:cover}`. ❌ emoji 🧑‍🏫 endi ESKI |
| 11.1b | 🟡 **O'quvchi (profil) — qizcha RASMI** (doira) | `PHOTO_SET.profil = { ..., img:'https://go.coddycamp.uz/uploads/media_library/58ebafabd92e2e3a80d86b7bb7e88eda.png', round:true }` — o'quvchi/profil ko'rsatiladigan joyda (1-2 sahifa, natija mockup). Barcha darsda BIR XIL mentor+qizcha (brend izchilligi) |
| 11.2 | h1 natija ko'rinishi qalin | `.pv-h1 { font-weight: 700; ... }` |
| 11.3 | `<p>` tavsifi tushunarli | "matn (paragraf)" (❌ "xatboshi") |
| 11.4 | Bo'sh `<li>` ortiqcha nuqta bermasin | `li:empty{display:none}` (preview CSS) |
| 11.5 | Preview'da havola yangi tabda ochilsin | `<base target="_blank">` + iframe sandbox `allow-popups allow-popups-to-escape-sandbox` |
| 11.6 | **Rang semantikasi:** qizil/accent fon FAQAT xato-ogohlantirish uchun | Xulosa, maslahat, "Sizning loyihangiz" bloklari — yashil `frame-success` (`successSoft` fon + `success` chap chiziq). ❌ `frame-soft`/`accentSoft` bunday joyda — o'quvchi "xato qildim" deb o'ylaydi |
| 11.7 | **Bosiladigan joylar ko'rinsin:** ko'p qismli "bosib o'rgan" ekranlarda | Yo'riqnoma + jonli hisoblagich ("👆 4 ta qismni bosing — 2/4"), bosilmaganlari pulsatsiya (`tap-hint` animatsiya), bosilganlari ✓ belgi |
| 11.8 | **Kod atamalari testlarda chip bilan:** teg/atribut nomlari oddiy matndan ajralib tursin | Savol, variant va izoh satrlarida atama backtick bilan belgilanadi (`` `strong` ``, `` `href` ``, `` `type="email"` ``), `fmtCode()` helper uni `.qcode` mono-chipga aylantiradi. Render joylari: variant tugmasi, izoh matni, "To'g'ri javob: …" satri, arena savoli/plitkalari. Arena plitkasida oq variant: `.qz-tile .qcode` |
| 11.9 | 🟡 **MAJBURIY: Compilator starteri = FAQAT `<!-- Bu yerga yozing -->` — boshqa HECH NARSA** | Barcha praktikada (shu jumladan DEFAULT_FILES va STARTER_FINAL) starter faqat shu bitta kommentdan iborat. ❌ Tayyor teg (`<h1>`, `<a href="">`, `<header>`...), namuna matn, ko'rsatma-gap — hech biri yozilmaydi. Nimani yozish chap paneldagi shartlar ro'yxatida (har shartda o'z hinti). Tekshiruv: har `STARTER_*` va `DEFAULT_FILES` starteri `<!-- Bu yerga yozing -->` + bo'sh qatordan boshqa narsa saqlamaydi |
| 11.10 | **Preview'larda real rasm** (builder, debugging, natija mockuplari) | Emoji-placeholder (🧑‍🚀) EMAS — `PHOTO_SET`dagi LMS media library URL'lari (tog'/mushuk/raketa). Kod namunasi rasm bilan MOS bo'lsin: kodda `src="tog.jpg"` → preview'da tog' rasmi |
| 11.11 | 🟡 **MAJBURIY: Layout kengligi + avto-zoom — BARCHA darslar AYNAN shu o'lchamda, istisno yo'q** | `.stage { max-width: 1100px; height: calc(100dvh / var(--lz, 1)) }` · Stage'da `padH = isMobile ? 12 : 60` · `.lesson-root`da `zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1))` · lesson root'da `--lz` effekti (15-F retsept). ❌ 936px / padH 100 / boshqa har qanday kenglik — RAD ETILADI (eski tor layout). LiveGate `wrap`da ham `minHeight: 'calc(100dvh / var(--lz, 1))'`. Tekshiruv: `grep -n 'max-width: 1100px' <fayl>` — chiqishi SHART; `grep -n 'max-width: 936px'` — bo'sh bo'lishi SHART |

| 11.12 | **Kod namunalarida identifikatorlar INGLIZCHA** | Ekranda ko'rsatiladigan kodda class/id/o'zgaruvchi nomlari inglizcha yoziladi: ✅ `class="card"` ❌ `class="karta"`. Sabab: real dasturlashda nomlar inglizcha — bola boshidan to'g'ri odat oladi. Izoh/kontent matni o'zbekcha qolaveradi |
| 11.13 | 🟢 **Vosita ekranlarida "haqiqiy hayotda sinang" bloki** | DevTools/terminal kabi VOSITA o'rgatilgan ekranda mashq tugagach yashil blok: real misolda sinash taklifi («🌐 Istalgan saytni oching (masalan, kun.uz), F12 bosing...») — mentor proyektorda jonli ko'rsatadi, o'quvchi uyda takrorlaydi. Audio/Mentor matniga ham jumla qo'shiladi |
> ⚠️ **2026-07-10 FOYDALANUVCHI QARORI — onboarding YANGI darslarga QO'SHILMAYDI.** Mavjud darslar (L1, L2, Css1, Css2, Internet, PM1, PM2, PM3, Git, Deploy) yetarli. Auditor buni GAP deb BELGILAMAYDI, Quruvchi YANGI darsga TourGuide qo'shmaydi. 11.14'ning «katta PIN auto-ochilmaydi» qismi esa BARCHA darslarga tegishli bo'lib qolaveradi.

| 11.14 | 🟡 **👋 ONBOARDING — real coach-mark spotlight tur** (`TourGuide`, modal EMAS) | Rejim tanlangach (500ms kechikish bilan) rolga qarab HAQIQIY tugmalarni birma-bir yoritadi: har qadam `[data-tour="..."]` elementni topadi (`getBoundingClientRect`), atrofini spotlight bilan yoritadi (`.tg-hole` box-shadow 9999px), yoniga callout (ikonka+sarlavha+matn+«Keyingisi»). **learner** (self/student): next→mentor→progress→ach. **mentor**: live(PIN)→next→progress. Elementlarga `data-tour="next|mentor|progress|ach|live"` qo'yiladi. 🔴 **Mentor'da katta PIN (`LiveBigCode`) AVTOMATIK OCHILMAYDI — faqat «📺 Ko'rsatish» tugmasi bilan** (`bigOpen` useState `false`; auto-open `useEffect` YO'Q). Aks holda mentor kirishi bilanoq katta PIN ochilib, onboarding tur ortida qolgan kichik `data-tour="live"` badge'ni yoritadi → spotlight **qorong'u ustida BO'SH** chiqadi (2026-07-09 CssLesson2 bug, namuna L1 LiveBadge 1162-q izohi). `localStorage hcOnboarded_<role>`. CSS: `.tg-*`. ❌ eski modal (`.ob-*`, `OnboardingOverlay`) — olib tashlangan |
| 11.15 | 🟡 **Jonli panel (LiveBadge) xira → hover'da tiniq** | Tepadagi mentor/o'quvchi paneli kontentni to'smasin: `.live-badge { opacity: 0.4 }` (odatda xira, ortidagi matn ko'rinadi) → `:hover/:focus-within { opacity: 1 }` (tiniqlashadi). Sensorli qurilmada `@media (hover:none) { opacity: 0.62 }`. Barcha 6 badge holatiga `className="live-badge"` |
| 11.16 | 🟡 **Arenada o'quvchining O'Z bali YASHIL** (qizil emas) | CodeStrike/podiumda o'quvchining o'zi (`.me`) rag'batlantiruvchi yashil bilan belgilanadi, accent-qizil EMAS: `.qz-brow.me` (bg+outline yashil), `.qz-brow.me .qz-brank` `#12A968`, `.qz-pod-col.me .qz-pod-name` `#12A968`, `.qz-mypl b` `#12A968`; ScreenPodium ham: `.pod-row.me` `successSoft`, `.pod-col.me .pod-name`+`.pod-my b` `T.success`. Qizil faqat XATO javob (`.qz-res.bad`, `.qz-tile.lose`) uchun qoladi |

> 11.2–11.5 faqat HTML-kod praktikasi (iframe preview) bor darslarga tegishli.
>
> **✅ HAL QILINDI — mentor avatari (11.1, 2026-07-09):** foydalanuvchi qaror qildi — **hostlangan RASM standart** (emoji emas). Mentor = `MENTOR_IMG`, o'quvchi/profil = `PHOTO_SET.profil` qizcha rasmi (`round:true`). Namuna: `Htmllesson2.jsx` (1908/1928-qatorlar). **Barcha darsga tarqatiladi** (🎨 Dizayn roli qo'shadi) — har darsda BIR XIL mentor+qizcha, brend izchilligi. Eslatma: CssLesson1'da avval emojiga qaytarilgan edi — endi qayta rasmga o'tkaziladi.

---

## 11-D. 🔴 TO'LIQ-EKRAN OYNA HOLATI SAQLANADI (102-qonun, 2026-08-01)

**Muammo.** F-0730-01 progress-saqlovi faqat **ekran raqamini** tiklaydi. Ekran USTIDA turgan
to'liq-ekran qatlam (praktika-kompilyator overlayi) esa oddiy React-state bo'lgani uchun
qayta yuklanishda yo'qoladi — o'quvchi kompilyator ichidan praktika-sahifasiga tushib qoladi.
Texnik darslarda bundan ham yomoni bo'lgan: `HtmlCompiler` yozilgan kodni **hech qayerga
saqlamasdi**, ya'ni bola yozganini butunlay yo'qotardi. Qo'zg'atuvchi — Chrome «Memory Saver»:
fon-tabni xotiradan bo'shatib, qaytganda sahifani jimgina qayta yuklaydi (o'quvchi buni sezmaydi).

**Qoida.** Praktika-oyna ochilishi bilan IKKI narsa saqlanadi:
- **(a) qaysi praktika ochiq** → `ccPractice:<lessonId>` = `{ kind, screen }`. `kind` — `s<N>`
  (dars-ichi, `PRACTICE_AFTER[N]`) yoki `hw` (uyga vazifa). Yopilganda (orqaga / tugatilganda /
  `reset`) o'chiriladi.
- **(b) yozilgan kod** → `ccCode:<lessonId>:<kind>` = `{ codes, savedAt }`, kompilyator ichida
  har **400ms** jonli saqlanadi. Har praktika o'z kaliti bilan (bir darsda bir nechta bor).

**Tiklash.** Dars mount'ida `pracRead` o'qiladi va o'sha praktika QAYTA QURILADI (`done`
funksiyasi saqlanmaydi — u tiklashda yangidan bog'lanadi). `PRACTICE_AFTER[screen]` topilmasa
(dars o'zgargan) saqlov jimgina tashlanadi. `HtmlCompiler` esa `storageKey` propi orqali
kodni tiklaydi — **faqat fayllar to'plami AYNAN mos kelganda** (topshiriq o'zgargan bo'lsa
saqlov e'tiborsiz qoldiriladi, o'quvchi eski kod bilan yangi topshiriqda qolib ketmasin).

🔴 **Ehtiyot (F-0801-01 raundida yo'l qo'yilgan xato):** `codes` boshlang'ich qiymatini
ko'chirishda darsning O'Z ifodasi saqlanadi — `CssLesson1` da u `tr(f.starter)` (UZ-RU),
qolganlarida `f.starter`. Buni `f.starter` ga tekislash UZ-RU mexanizmini buzadi va
`css.trim is not a function` bilan oq ekran beradi.

**Qamrov.** Kompilyator-qobiqli har dars. Tatbiq (2026-08-01): PM 7 dars + texnik 9 dars
(`Htmllesson1/2`, `CssLesson1/2`, `CssPractice`, `HtmlPractice`, `HtmlTakrorlashLesson`,
`VsCodeLesson`, `PracticeLesson1`) + infra-manba `src/compilator/HtmlCompiler.jsx`.
🔴 Har texnik darsning **O'Z ICHKI `HtmlCompiler` nusxasi** bor — infra-manbani tuzatish
darslarga tarqalmaydi, har fayl alohida tuzatiladi.

**Tekshiruv.** Brauzer-testi (`playwright-core`): praktikani ochish → kod yozish →
`page.reload()` → oyna ochiq VA kod joyida bo'lishi shart. Dasturiy o'lchov: har darsda
`pracRead`/`pracWrite`/`pracClear` + `storageKey={practice.codeKey}` + `codesWrite` bor.

---
## 11-A. 🃏 FLASHCARD JAVOBI — 107-QONUN: O'LCHAM JAVOB UZUNLIGIGA MOSLASHADI (2026-08-03, F-0803-13/14)

> Qamrov: **texnik VA PM darslar** — `Flashcards` umumiy komponent (76 dars).

**Muammo (tuzatilgan):** `.fc-tag` hamma javobga bitta katta monoshrift berardi
(`font-family:'JetBrains Mono'; font-size: clamp(30px,6vw,46px)`). Bu o'lcham **bir so'zlik**
javob (`let`, `=`, `string`) uchun tanlangan, lekin 32-73 belgilik javoblarga ham qo'llanardi:
matn 2-3 qatorga bo'linib, **qat'iy balandlikdagi** kartaga (`.fc-card { height: clamp(188px,27vh,268px) }`)
sig'masdi va izoh (`.fc-note`) pastki yumaloq chetga yopishib qolardi.
O'lchov (1280×648): kerak **195px** / bor **188px** → izoh padding qutisidan **4px** pastga chiqardi.

**🔴 Miqyos — bu bitta darsning bugi EMAS edi:** `back:` maydonlari skanerlanganda **891** javobdan
**312 tasi (35%)** 14 belgidan uzun, **74/76** darsda uchradi. Ya'ni har uchinchi karta siqilgan holatda edi.

**Qonun (3 band):**
1. **O'lcham pog'onali** — javob uzunligiga qarab sinf beriladi:
   `t1` ≤8 belgi `clamp(30px,6vw,46px)` · `t2` ≤16 `clamp(24px,4.4vw,34px)` ·
   `t3` ≤32 `clamp(20px,3.4vw,26px)` · `t4` >32 `clamp(17px,2.6vw,22px)` (+`line-height:1.3`).
2. **Kod — mono, gap — Manrope.** `fcIsCode()`: monoshrift FAQAT lug'atdagi kalit so'zga
   (`let, const, var, string, number, boolean, true, false, null, undefined, function, return, for, while, if, else`)
   yoki kod-belgisi (`= ( ) { } ; . [ ] < > + * / % ! & | -`) bo'lgan **yakka** tokenga beriladi.
   Gap — `Manrope` (mono gapni ~25% kengaytiradi). Gap ICHIDAGI kalit so'zlar `.fc-kw` bilan mono qoladi.
   ❌ «o'zgaruvchi» monoshriftda — bu atama, kod emas.
3. **Karta balandligi TEGILMAYDI** (`height`, `min-height` emas): pog'onalash 73 belgilik javobni
   ham sig'dirgani uchun qat'iy balandlik saqlanadi — kartalar almashganda sakramaydi (Quizlet uslubi).

**Tekshiruv (dasturiy, majburiy):**
- `fcAnswer(` ishlatgan har faylda `const fcAnswer =` **va** `.fc-tag.t1 {` e'loni bor — «ishlatgan,
  e'lon qilmagan» **0** bo'lishi shart (76/76/76 ✅ 2026-08-03).
- Eski naqsh qoldig'i: `grep '<span className="fc-tag">'` → **0**.
- Brauzer-o'lchovi: kartani ochib `javob + izoh + padding + gap` ni karta balandligi bilan solishtiring —
  **toshish 0** bo'lsin. Sinov qilingan eng og'irlari: `PmLesson6` (73 blg → t4, 111/188px),
  `PmLesson5` (67 blg), `ClaudeSkillsLesson` (34 blg) — uchalasida ham 0 toshish.

**Sabot:** o'lchamni kontentga emas, **bitta namunaviy holatga** qarab tanlash — takrorlanuvchi xato-sinf.
`.h-ask` (105-qonun) da savol-sarlavha bilan aynan shu bo'lgan: qisqa sarlavha uchun tanlangan o'lcham
10-20 so'zlik savolga qo'llanib, matn yopishib qolgan edi. **Naqsh: matn o'zgaruvchan uzunlikda bo'lsa,
o'lcham ham o'zgaruvchan bo'lishi shart.**

---
## 11-B. 🧵 108-QONUN: BIR DARS — BITTA MISOL-IP · 109-QONUN: TMI TAQIQI (2026-08-03, F-0803-19/20)

> Foydalanuvchi buyrug'i bilan QAT'IY muhrlangan: «keraksiz tekst jalka UI to'ldirib
> o'quvchi tushunmasligiga olib keladi — barcha darslarda shu bo'yicha».

**108-qonun — BIR DARS, BITTA MISOL-IP.**
Darsning barcha asosiy ekranlari (hook → tushuntirish → testlar → yakuniy mashq → flashcard →
arena → uy vazifasi → praktika) **BITTA misol-olamda** yuradi; yangi tushuncha yangi misol
bilan emas, o'sha ipning KENGAYISHI bilan ochiladi.
- ❌ Anti-namuna (tuzatilgan): JsFunctions'da 4 olam ipsiz almashardi — buyurtma-narx →
  salomBer/"Ali" → narxHisobla → kvadrat. O'quvchi hukmi: «mavzu nimaligini bilib bo'lmayapti».
- ✅ Namuna: butun dars `zarar(kuch)` ipida; parametr = kuch, return = hisoblangan zarar,
  ikkinchi parametr = krit bonus — tushuncha o'sdi, olam o'zgarmadi.
- Ikkinchi misolga ruxsat FAQAT qisqa mashq/test bandida (asosiy tushuntirish emas) va u ham
  o'quvchi tanigan olamdan (95-qonun) bo'lsin.
- Ip tanlash foydalanuvchi bilan kelishiladi (2026-08-03: lavash ipi RAD etilgan, o'yin-olami
  tanlangan — «lavash-mavash kerakmas»). Tayyor ip JsVars/JsCond/JsLoops/JsFunctions'da:
  **o'yin olami** (ball, jon, zarar, krit).
- **Tekshiruv (grep-lanadigan):** darsdagi funksiya/o'zgaruvchi nomlarini yig'ib sanang —
  asosiy tushuntirish-ekranlarida 1 ta nom-oila bo'lishi shart. Eski ip qoldig'i:
  `grep "salomBer\|kvadrat\|narxHisobla\|qoshish\|ayir" <fayl>` → 0.
- 🔴 **ISTISNO — SHART DARSI (if/else, m2-04; foydalanuvchi qarori 2026-09-14, F-0914-01).**
  Foydalanuvchi hukmi: «misollar bir xil» — butun dars `yosh >= 12` atrofida aylangan va o'quvchi
  yangi tushuncha kelganini sezmagan. Shart **tabiatan** har joyda uchraydi, darsning sabog'i aynan
  shu. Shuning uchun bu darsda **har bosqich o'z hayotiy misoli** bilan ochiladi va misol **o'sha
  ekranning o'zida** to'liq yakunlanadi (hook — telefon PIN · if — zaryad < 20% · else va boolean —
  ID-karta 16 yosh · else if — baho · debugging — PIN · praktika — radar, tarjima).
  Ip o'rniga **ko'prik** qoladi: debugging hook'dagi PIN'ga qaytadi, boolean else'dagi ID-kartani
  davom ettiradi, shart quruvchi if'dagi zaryadni. Istisno boshqa darslarga **o'z-o'zidan
  tarqalmaydi** — 108-qonun JsVars/JsLoops/JsFunctions uchun kuchida.

**109-qonun — TMI (ortiqcha matn) TAQIQI.** Matn-mezonlari `MATN_KORPUS.md` 74-75-bo'limda
(mentor maks 2 gap · reja-ekran ta'rif aytmaydi · olib tashlash testi · bir g'oya maks
2 marta). Bu yerda TEXNIK tomoni:
- Ekran matni ekran maqsadidan katta bo'lmasin: tushuntirish-ekrani ~600 belgidan, hook
  ~500 belgidan oshsa — auditor GAPga yozadi (JsFunctions s1: 918 → 503 belgi tajribasi).
- Dekorativ blok (ko'prik, qo'shimcha eslatma, kelajak-reklama) mashq-g'alabasi yoniga
  QO'YILMAYDI — g'alaba lahzasi yakka turadi (F-0803-11/12).
- 92-qonun («bir ekran — bir ish») bilan juft: matn ham bir ish atrofida.

**109-qonun — TMI OV-RO'YXATI (2026-08-03, F-0803-25; manba: m2-13 tozalash).** Bitta darsni
tozalaganda ayni bir OLTI sinf qayta-qayta chiqdi — auditor shu ro'yxat bo'yicha yuradi:
1. **Ikki gapli sarlavha.** Sarlavhada FAQAT harakat qoladi («Tushunmaydigan so'zlarni bosing»),
   kontekst-gap (`Bu gap — sizniki`) Mentor qatoriga ko'chadi.
2. **Uchinchi takror.** sarlavha → mentor → yana mono-qator («→ Bugun O'Z saytingiz uchun shuni
   yozasiz») = bir g'oya 3 marta. Uchinchisi o'chiriladi (109: maks 2).
3. **O'lchamaydigan vizual.** Indikator/`Uline` qat'iy qiymatda tursa (78→92, hech narsaga
   bog'lanmagan) — u ma'lumot emas, bezak: o'chiriladi. Vizual faqat o'zgaradigan holatni
   ko'rsatganda qoladi.
4. **Ikkita yopilish matni ketma-ket** (masalan `ks-hook` + `frame-success`) — bittasi qoladi.
5. **Bir ekranda ikki topshiriq.** Ikkinchisi SHARTLI bo'ladi — faqat kerak bo'lganda ochiladi
   (m2-13 s13: reflektsiya-maydoni endi «yarim/tushunmadim» javobidagina chiqadi), aks holda
   alohida ekranga.
6. **Har matn bo'lagiga savol.** Keys/hikoya slaydlarida ball bermaydigan taxmin — **maks 1 ta**;
   qolgani hikoyani uzadi va o'quvchini «yana savolmi» holatiga soladi.
- **Tekshiruv (dasturiy):** `node tools/tmi-shot.mjs <dars-key> <papka>` — har ekranni ochib skrinshot
  oladi va `.screen` matn-uzunligini belgida chiqaradi. m2-13 tozalangandan keyingi o'lchov:
  hamma dars-ekrani **≤354 belgi** (yakun sahifasi 618 — istisno, u to'plovchi ekran).

## 11-C. 🚪 110-QONUN: GATE-EKRAN JIM QOLMAYDI (2026-08-03, F-0803-25)

> Manba: PracticeLesson1 11-sahifa (forma-tekshiruv). O'quvchi ism yozib «Yuborish»ni qayta-qayta
> bosgan — ekran hech qanday yangi reaksiya bermagan, «Davom etish» yopiq qolgan. Hukm:
> «hech qanday o'zgarish bo'lmayapti, keyingi sahifaga o'ta olmayapman».

Har `done`-shartli (o'tish-darvozali) interaktiv ekranda UCHTA majburiy xossa:
1. **Har bosishga ko'rinadigan reaksiya.** Bir xil natija takrorlansa ham xabar/effekt QAYTA
   jonlanadi (React'da: xabar elementiga `key={submitCounter}` — fade/shake har safar o'ynaydi).
   Bosish → sukut = o'quvchi «buzilgan» deb o'qiydi.
2. **Matn-maydonda Enter = yuborish.** Input bor joyda `onKeyDown Enter → submit` shart —
   o'quvchi formada tabiiy ravishda Enter bosadi.
3. **Qolgan qadam NOMMA-NOM aytiladi.** Darvoza bir necha qadamli bo'lsa (masalan «bo'sh holda
   ham, to'liq holda ham sinang»), yarmi bajarilganda ikkala joyda ko'rsatiladi:
   nav-tugma yorlig'i («Endi bo'sh holda yuboring») + ekran ichida bitta qisqa
   yo'l-ko'rsatma qatori. Umumiy yorliq («Ikkala holatni sinang») yetarli EMAS — o'quvchi
   qaysi yarmi qolganini bilmaydi.
- **Tekshiruv:** darvozali ekranda har interaktiv tugmani 2 marta ketma-ket bosing — ikkinchi
  bosishda ham ko'rinadigan reaksiya bo'lishi shart; inputda Enter bosing — submit ishlashi shart.

**110-B — KO'RINISH TEKSHIRUVI DAM OLGAN HOLATDA EMAS, BOSILGANDAN KEYIN QILINADI.**
(2026-08-03, F-0803-26 · m2-09 1-ekrani.) F-0803-19 bandi «vidjet 1280×720 da ko'rinsinmi?»
deb tekshirishni buyuradi — lekin ekran OCHILGAN holatida o'lchansa, u yolg'on «toza» beradi:
javob-variantlari, natija-oynasi, qabul akti va tuzatish tugmasi FAQAT bosishdan keyin
paydo bo'ladi va aynan o'shalar pastga tushib ketadi.
- m2-09 dalili: 1-ekran dam olgan holatda 0px oshgan edi; «Agentga yuborish» bosilgach
  savol-variantlari **394px** pastga tushdi — darsning BIRINCHI sahifasida «Davom etish»
  hech qachon ochilmasdi. 11-ekranda «Rangni ko'kka tuzat» tugmasi 894px da edi.
- **Majburiy usul:** darsni 0-ekrandan oxirigacha **haqiqiy bosishlar bilan** o'tkazuvchi
  skript yozing; har bosishdan OLDIN elementning `getBoundingClientRect().bottom` ni
  `.stage-content` ning `getBoundingClientRect().bottom` i bilan solishtiring. Katta bo'lsa —
  bu topilma. (Naqsh: `clickVisible(locator, nomi)` yordamchisi — avval o'lchaydi, keyin bosadi;
  o'lchov `window.innerHeight` ga emas, `.stage-content` cheti ga qarab qilinadi, chunki
  nav-paneli pastdan ~70px yeydi.)
- Joy yetmasa tartib shu: (1) takroriy matnni kesing (109-qonun) → (2) ustma-ust turgan ikki
  blokni yonma-yon qo'ying → (3) ro'yxatni 2 ustunga bo'ling → (4) faqat oxirida shrift/padding.

**113-qonun — TAKLIF NIMA KO'RSATSA, AYNAN O'SHANI QO'YADI (2026-08-09, F-0809-01).**
Har qanday taklif/tanlov ro'yxati (kompilyator teg-ro'yxati, atribut taklifi, qisqartma) —
qatorda ko'rsatilgan narsani **to'liq holda** qo'yishi shart. Yarim qo'yish taqiqlanadi.
- Dalil: ro'yxat `<h1>` deb ko'rsatib, bosilganda faqat `h1` qo'yardi — bola `>` ni baribir
  o'zi bosardi, ya'ni **tanlash qo'lda yozishdan foydasizroq** edi. O'sha ro'yxatning
  atribut tarmog'i esa `href=""` ni to'liq qo'yardi — bitta menyu ichida ikki xil xulq.
- **Nega bu jim-buzilish sinfi:** hech narsa sinmaydi, esbuild/lint/`vite build` jim —
  faqat foydalanuvchi bosib ko'rganda bilinadi. Shuning uchun har taklif-ro'yxati
  **bosib** sinaladi: ko'rsatilgan matn ↔ tushgan matn ↔ kursor o'rni.
- **Ikkinchi tomoni:** taklif faqat «to'g'ri sintaksis»dan boshlanmasin. Bola `<` ni
  bilmasligi mumkin — qatorda yolg'iz turgan `h1` ham ro'yxatni ochsin. Lekin MATN
  yozilayotgan joyda ochilmasin (shovqin): shart qat'iy — so'z qatorda yolg'iz tursin
  VA kursor matn tegi (`p·h1·li·a·span…`) ichida bo'lmasin.
- **Uchinchi tomoni — SICHQONCHA BILAN KLAVIATURA BIR XIL ISHLASIN (F-0809-02).**
  Ro'yxat sichqoncha bilan bosilganda tanlanib, Enter bosilganda tanlanmasa —
  bu nuqson. Bola VS Code'dagidek Enter bosadi. Har tanlov-ro'yxati uchun majburiy
  juftlik: **bosish = Enter**; Tab qo'shimcha yo'l, Esc — yopish, Shift+Enter — chiqish.
- **To'rtinchi tomoni — «JIM QOL» HOLATI HAR DOIM BO'SHASHI KERAK.** Esc bilan yopilgan
  ro'yxat qaysi shart bilan qayta ochilishi ANIQ yozilsin. Dalil: Esc faqat kursor
  o'rnini eslardi va hech qachon tozalanmasdi — bola o'sha joyga qaytsa ro'yxat
  boshqa chiqmasdi. Matnni eslash ham yetmaydi (harf o'chirilib qayta yozilsa matn
  aynan o'sha bo'ladi) — o'lchov **tahrir raqami** bo'lishi kerak.
- **Beshinchi tomoni — RO'YXAT KESILMASIN, SURILSIN.** Ko'rinadigan bandlar soni
  cheklansa (`slice(0,8)`), strelka esa HAMMA band bo'ylab yursa — tanlangan qator
  ekrandan chiqib ketadi va bola nima tanlaganini ko'rmay Enter bosadi. Bandlar
  to'liq chiqarilsin, quti ichida surilsin, tanlangan qator o'zi ko'rinishga kelsin.
  (`scrollIntoView` ATAYLAB emas — u ota-elementlarni surib butun sahifani sakratadi;
  qo'lda `scrollTop` hisoblanadi.)

**114-qonun — O'CHIRUVCHI TUGMA QAYTARIB BO'LADIGAN BO'LSIN (2026-08-09, F-0809-03).**
O'quvchining ishini yo'q qiladigan har qanday tugma (kompilyatordagi «Qaytadan»,
progress-tozalash, javob-qaytarish) **ikki qadamli** bo'ladi VA qaytarish yo'li
qoldiradi. Dalil: bitta bosish 30 daqiqalik ishni o'chirardi — tasdiq yo'q,
`Ctrl+Z` qaytarmasdi (`setState` brauzer tarixiga tushmaydi) va 400 ms dan keyin
**localStorage'dagi nusxa ham ustidan yozilardi**; qayta yuklansa ish butunlay yo'q.
- Naqsh: 1-bosish → tugma qizarib «⚠ Rostdanmi?» bo'ladi (4 s, keyin o'zi so'nadi) ·
  2-bosish → eski holat `ref` ga nusxalanadi, keyin tozalanadi · 8 soniya davomida
  «↶ Qaytarish» taklifi turadi.
- `Ctrl+Z` ga TAYANMANG: dars ko'p faylli bo'lsa brauzer faqat ochiq faylni biladi.
- Yorliq qisqa qolsin («Rostdanmi?»), tushuntirish yonidagi holat-matnida —
  aks holda pastki panel kengligi sakraydi.

**115-qonun — BLOKLANGAN TUGMANING SABABI DOIM KO'RINSIN (2026-08-09, F-0809-03).**
«Davom etish» yopiq bo'lsa, NEGA yopiqligi ekranda bo'lishi shart. Xatoni «bola hali
yozyapti» deb yashiruvchi har qanday qoida, o'sha xato tugmani bloklayotgan bo'lsa,
**bekor bo'ladi**. Dalil: barcha shart yashil (3/3), «Davom etish» o'lik, yuqorida
xabar bo'sh, pastda esa «Shartlarni bajaring» degan YOLG'ON matn — 4 soniya kutildi,
o'zgarmadi; bola uchun boshi berk ko'cha.
- Uch joy birga to'g'rilanadi: (1) xato yozuvi ko'rsatiladi · (2) holat-matni haqiqatni
  aytadi («Shartlar bajarildi — sintaksis xatosi qoldi») · (3) o'chiq tugmaning
  `title` ida sabab yoziladi.

**116-qonun — NATIJA OYNASI O'QUVCHI QO'LIDAGI ISHNI YO'Q QILMASIN (2026-08-09, F-0809-03).**
Jonli preview har bosishda iframe'ni qayta yuklaydi — HTML/CSS darsida bu zavq,
JS darsida esa zarar: bola o'z tugmasini bosib natijani ko'radi, bitta harf yozadi —
hammasi nolga qaytadi (o'lchandi: preview'ga yozilgan matn 1 belgidan keyin bo'shadi).
- Qoida: **JS fayli bor darsda preview QO'LDA** yangilanadi (`▶ Ishga tushirish`);
  kod o'zgargan bo'lsa nishon «jonli» dan «eskirdi · ▶ bosing» ga o'tadi.
  Birinchi ochilishda bir marta o'zi yuriladi — bola bo'sh ekran ko'rmasin.
- Shart-belgilari (✓) BARIBIR jonli qoladi: ular alohida YASHIRIN iframe'da
  tekshiriladi, ko'rinadigan preview bilan bog'liq emas.

**117-qonun — «TO'G'RI QILDIM, NEGA BUZUQ?» HOLATI TUG'ILMASIN (2026-08-09, F-0809-03).**
Shart yashil yonib, ekranda esa buzuq narsa ko'rinsa — bola o'zini aybdor his qiladi.
Dalil: `<img src="rasm.png" alt="…">` — `src`+`alt` bor, ✓ yonadi, lekin fayl mavjud
emas va brauzer siniq belgi chizadi.
- Yechim yo'nalishi: buzuq holatni **darsga aylantiring**. Rasm yuklanmasa punktir
  quti chiqadi: 🖼 + o'quvchining `alt` matni + «rasm topilmadi — `src` ni tekshiring».
  Bu `alt` nima uchun borligini aynan ko'rsatadi.
- Ehtiyot: bunday o'rin-egallovchi element asl tegni DOM'dan O'CHIRMASIN (yashirsin) —
  aks holda `querySelector('img')` ga tayangan shartlar sinadi. Va u faqat KO'RINADIGAN
  preview'ga qo'yilsin, tekshiruv-hujjatiga emas.

**118-qonun — UMUMIY MODULGA KO'CHIRISHDAN OLDIN U SUPERSET BO'LSIN (2026-08-09, F-0809-04).**
Takrorlangan nusxalarni bitta umumiy modulga yig'ishda nusxalar «eski» deb faraz
qilinmaydi: ba'zisida umumiy modulda **yo'q** yaxshilanish bo'ladi. Ko'chirishdan oldin
har nusxaning umumiy moduldan FARQI o'qib chiqiladi va yetishmagani modulga kiritiladi.
- Dalil: `CssLesson1/2` nusxasida CSS qisqa xossalarini longhanddan tiklash bor edi
  (CSSOM `padding` ni 4 tomonga yoyadi, `cssProp('.box','padding')` topa olmaydi).
  Busiz ko'chirsak — 3 ta CSS darsining shartlari kulrang qolib, o'quvchi qamalardi.
  Yana ikkitasi: `tr(starter)` va `tr(hint)` — busiz RU rejimda `[object Object]`.
- **Superset darvozasi:** ko'chirishdan oldin VA keyin skan — nusxalarda bor, modulda
  yo'q qatorlar ro'yxati. Qolganlarining hammasi eski avlod kodi ekani ISBOTLANSIN.
- 🔴 **SKAN HAR FAYL UCHUN QAYTA YURITILADI, PILOT VIZUAL XOSSANI HAM O'LCHASIN
  (2026-08-10, F-0809-05).** Bir marta skan qilib «boshqalari ham shunday» deb
  o'ylash yetarli emas. Dalil: PM kompilyatorlarini ko'chirishda `previewCss`
  (natija oynasining dars-uslubi) sezilmay QOLDI va PmLesson2 da o'chirib
  yuborildi — pilot sinovi buni tutmadi, chunki u faqat «elementlar soni to'g'rimi»
  deb qarardi. Vizual xossa ko'chirilayotganda sinov **hisoblangan uslubni**
  (`getComputedStyle` — fon rangi, matn rangi) o'lchasin, element sonini emas.

**119-qonun — MODUL-DARAJALI YASHIRIN BOG'LIQLIK KO'CHIRISHDA UZILADI (2026-08-09, F-0809-04).**
Kod dars fayli ichida turganda dars bilan **modul-o'zgaruvchi** ulashadi (bizda `__lang`).
Alohida faylga chiqarilgach u bog'liqlik uziladi — va hech narsa sinmaydi, lint jim
qoladi: shunchaki RU rejimda kompilyator o'zbekcha qolib ketadi. Ko'chirishdan oldin
«bu blok dars-faylining qaysi global holatini o'qiydi?» degan savol beriladi.
- Yechim naqshi: holatni PROP qilib uzatish, va **bitta qoida bilan hamma joyda** —
  `lang={__lang}`. Mahalliy `lang` o'zgaruvchisiga tayanmang: chaqiruv joylarining
  ba'zisi uni olmaydigan komponent ichida bo'ladi (bizda `MentorPracticeOverlay`).
- Yakunda grep-darvoza: chaqiruv bor har joyda prop borligi sanab tekshiriladi.

**120-qonun — KO'CHIRISH VOSITASI SHUBHADA TO'XTASIN, TAXMIN QILMASIN (2026-08-09, F-0809-04).**
Ko'p faylli mexanik ko'chirish skript bilan qilinadi, lekin skript chegarani o'zi
topib, **shubha bo'lsa faylga tegmasdan to'xtaydi**. Avval hamma faylda QURUQ
YUGURISH, keyin bitta PILOT fayl, u tasdiqlangandan keyingina qolganlari.
- Dalil: darvoza 2 marta ishladi va ikkalasi ham foydali bo'ldi — biri soxta signal
  (nom faqat izohda), ikkinchisi haqiqiy nom to'qnashuvi (`const checks` — komponent
  ichidagi butunlay boshqa o'zgaruvchi). Ikkovi ham skriptni aniqroq qildi.
- CRLF: `line === '}'` bilan chegara topish Windows faylida ISHLAMAYDI (`'}\r'`).


**121-qonun — SOLISHTIRUV RAQAMI BITTA MANBADAN CHIQADI (2026-08-19, F-0819-11).**
«Yomon usul» va «yaxshi usul» ekranlari bir xil o'lchovni ko'rsatsa (qator soni, vaqt,
qadam soni), u **bitta konstantadan** hisoblanadi va ikkala ekranda bir xil formula
bilan yoziladi. Qo'lda ikki joyga yozilgan raqam ertami-kechmi bir-biriga zid bo'ladi —
va o'quvchi buni ko'radi.
- Dalil: M3-D1 da 3-ekran badge'i `2 + n*4`, 6-ekrandagi «Oddiy HTML bo'lsa:» ham
  `2 + n*4` — ikkovi alohida yozilgan edi. Biri o'zgarganda ikkinchisi qolib ketardi.
  Yechim: `CARD_LINES = 22` konstantasi, ikkala ekran `n * CARD_LINES`.
- Tekshirish: `grep -n "n \* \|2 + n" <fayl>` — bir xil o'lchovning ikki xil formulasi
  chiqmasin.

**122-qonun — RAQAM EKRANDA TEKSHIRILSIN, AKS HOLDA YASHIRINGANI AYTILSIN (2026-08-19, F-0819-11).**
Badge «22 qator» desa, o'quvchi ekranda 22 qatorni sanay olishi kerak. Kod ixcham
ko'rsatilsa (ko'rsatish TO'G'RI qaror — TMI, 109-qonun), **yashiringan qism izohda
oshkor aytiladi**, shunda arifmetika baribir yopiladi.
- ✅ `<div class="skin">` / `<img …>` / `<h3>…</h3>` / `<!-- narx, like, tugma… yana
  18 qator -->` / `</div>` → 4 ko'rinadi + 18 yashirin = badge'dagi 22.
- ❌ 4 qatorli blok ko'rsatib, badge'da 22 deyish — test-halolligi buziladi.
- Qo'shimcha foyda: «yana 18 qator» yozuvining o'zi «haqiqiy kartochka katta» degan
  sabog'ini beradi.

**123-qonun — NATIJA USTUNI KODDAN KENG, TO'R ESA TESHIKSIZ (2026-08-19, F-0819-08/09).**
Kod va natija yonma-yon turgan ekranda **natija kengroq** bo'ladi (45% kod / 55%
natija, `.split-4555`): o'quvchi avval NIMA chiqqanini ko'radi, keyin qanday
yozilganini. Natija to'ri esa maksimal element sonida **to'liq to'ldirilsin** —
3 ustunga 5 element qo'yilsa oxirgi qator teshik qoladi va «tugallanmagan sayt»
tuyg'usini beradi.
- Dalil: M3-D1 da maks 5 karta + 2 ustun = □□/□□/□ ; 3 ustun + maks 6 karta =
  □□□/□□□ — «marketplace» hissi shundan chiqadi.
- ⚠️ O'lchov `style={{ fontSize: … }}` ichida yozilsa, modifikator klass (`.mk-grid …`)
  UNING USTIDAN O'TOLMAYDI — inline uslub kuchliroq. Kichraytiriladigan har o'lcham
  klassda yashashi shart (`.vcard-name`, `.vthumb-em`), inline'da faqat dinamik
  qiymat (masalan `background: s.bg`) qoladi.


**124-qonun — «KIM YARATGAN» EMAS, «QANDAY HAL QILADI» (2026-08-19, F-0819-13).**
Muammo qo'yilgandan keyingi tanishtiruv ekranining vazifasi — **ko'prik qurish**
(muammo → vosita → asosiy tushuncha), tarix bermaslik. Sarlavha «kim/qachon» deb
so'rasa, ekran o'zi tarixga og'adi va o'quvchi kompaniya nomi bilan yilni yodlashga
tushadi; «qanday» deb so'rasa, javob mexanikaga olib boradi.
- ❌ Sarlavha: «Shu nusxalash muammosini KIM hal qilgan?» · Mentor: «React —
  JavaScript'da yozilgan kutubxona. Uni 2013-yilda Facebook yaratgan…»
- ✅ Sarlavha: «Shu nusxalash muammosi QANDAY hal qilingan?» · Mentor: «Bir xil
  kartochkani qayta-qayta yozish shart emas. React bu muammoni komponentlar yordamida
  hal qiladi. Avval React nima ekanini bilib olaylik — ilovalarni bosib ko'ring.»
- Ta'rif ham shu tartibda: avval **nima uchun kerak**, keyin **atama**.
  ❌ «React = JavaScript kutubxonasi» (13 yoshli uchun quruq atama)
  ✅ «React — saytni tayyor bo'laklardan qurishga yordam beradigan JavaScript
  kutubxonasi» — vazifa oldinda, atama orqada, ikkalasi ham bor.
- Tarix o'chirilmaydi, **pastga tushiriladi**: majburiy Mentor-matnidan ixtiyoriy,
  bosib ochiladigan kartochka ichiga (quyidagi bandga qarang).

**125-qonun — ATAMAGA TEGISHDAN OLDIN UNI KIM TEKSHIRAYOTGANINI GREP QIL (2026-08-19, F-0819-13).**
Tushuntirish-ekranidan atama yoki fakt olib tashlansa, uni **test, flashcard, arena
va yakun-banneri** hali ham so'rayotgan bo'lishi mumkin — natijada o'rgatilmagan
narsa so'raladi (test-halolligi buziladi), arena esa 3/3/3/3 balansidan chiqadi.
- Tartib: `grep -n "<atama>" <fayl>` → topilgan har bir joyni tasnifla
  (tushuntirish · test · flashcard · QUIZ_BANK · yakun) → keyin qaror qil.
- Dalil: M3-D1 3-ekranidan «kutubxona» va «Facebook 2013» olib tashlanmoqchi edi.
  Grep ko'rsatdi: «kutubxona» — 1-test kaliti VA arena Q1 kaliti; «Facebook 2013» —
  flashcard, arena Q2, yakun-banneri, RECAPS kartasi. Yechim: ikkalasi ham qoldi,
  lekin joyi o'zgardi — «kutubxona» ta'rifda vazifadan KEYIN, tarix esa Mentor'dan
  bosiladigan Facebook kartochkasi ichiga tushdi.
- Muqobil yo'l (qimmatroq): faktni butunlay olib tashlash — u holda unga bog'liq
  HAR BIR savol ham o'chadi va arena balansi uchun o'rniga yangisi yoziladi.


**126-qonun — TOPISH-MEXANIKASI O'ZINI TANITSIN (2026-08-19, F-0819-15).**
«Bosib toping» turidagi ekranda o'quvchi birinchi soniyada **nimani, qayerdan va
nechtasini** izlashini bilishi shart. Bilmasa, ekranda qotib qoladi va mexanika
umuman ishlamaydi — dars esa uni bosib o'tgan deb hisoblaydi.
Uch qatlam birga ishlaydi:
1. **Tinmay chorlovchi halqa** — bosiladigan zona bosilmaguncha sekin yonib turadi.
   Halqa juda xira bo'lsa (`rgba(...,0.16)` kabi) — bori ham yo'g'i ham bir xil.
   Ko'rinadigan chegara: tinch holatda ≥0.28, cho'qqida ≥0.6 va ≥3px.
2. **Hover-yorlig'i** — sichqoncha ustiga kelganda zona o'zi aytadi: «✨ Bu ham alohida
   blok». `content: '✨ ' attr(data-hint)` bilan, matn `data-hint` da (tarjima uchun).
   ⚠️ Ichma-ich zonalarda ikkita yorliq chiqmasligi uchun
   `:hover:not(:has(.zone:hover))` bilan faqat ichkarigisi ko'rsatiladi.
3. **Bo'sh holat sanoq beradi** — ❌ «Sahifadan bir qismni bosing» →
   ✅ «Chapdagi sahifada **4 ta** komponent yashiringan. Bosib toping.»
   Miqdor berilmasa o'quvchi qachon tugaganini bilmaydi.
- `prefers-reduced-motion` da halqa yonmaydi, lekin **statik holda ko'rinib turadi** —
  harakat o'chirilsa affordans ham o'chib qolmasin.
- Hisoblagich va tugma yorlig'ida **o'rgatilayotgan atama** ishlatiladi
  («2/4 komponent topildi», «Bloklar» → «Komponentlar»): atama sanoq bilan birga
  quloqqa singadi. Sarlavhada esa tanish so'z qolishi mumkin («nechta blokdan?») —
  tanishdan yangiga ko'prik shunday quriladi.


**127-qonun — EKRANDAGI HAR DETAL MA'NO TASHISIN (2026-08-19, F-0819-42).**
Vizual metafora (mashina, robot, qurilma, sxema) qurilganda o'quvchi ko'radigan
**har bir element biror narsani bildirishi** shart. Bildirmasa — bu bezak emas,
**shovqin**: o'quvchi «buning ma'nosi nima?» deb to'xtaydi va asosiy g'oyadan chalg'iydi.

**Qat'iy taqiq ro'yxati** (metaforadan qat'i nazar):
- ❌ **Ko'zlar / yuz** — qurilmaga «tiriklik» beruvchi bezak
- ❌ **Boltlar, vintlar, zanglar, panel-chiziqlari** — «texnik ko'rinish» uchun
- ❌ **Ma'nosiz indikator chiroqlari** — holatni bildirmasa, yonmasin
- ❌ **Sababsiz uzuq chiziqlar** — «bog'lanish» ni bildirmasa, chizilmasin
  (uzuq chiziq FAQAT: bo'sh joy · joylash zonasi · to'ldiriladigan maydon — 16-qonun)
- ❌ **To'ldiruvchi shakllar** (`▢ ▢`, `···`) — o'rniga real kod/matn ko'rsatiladi

**Tekshirish savoli:** har elementga barmoq qo'yib so'rang — *«bu nimani bildiradi?»*
Javob bir jumlada aytilmasa — element o'chadi.

**Oqim-diagrammasi qoidasi.** Ma'lumot yo'li ko'rsatilsa, u **abstrakt emas, o'qiladigan**
bo'lsin: har qadamda **real kod** tursin va yo'nalish bitta o'qda ko'rinsin.
- ❌ `props ---- {..}` (gorizontal, abstrakt, uzuq chiziq bilan)
- ✅ vertikal, har qatori real:
  `name="Blox Fruits"` ↓ `props` ↓ `{props.name}` ↓ `Blox Fruits`
  O'quvchi **3 soniyada** oqimni o'qishi kerak.

**Rang — ma'no, bezak emas** (4-bo'lim bilan juft):
| Rol | Rang |
|---|---|
| KIRISH (props, tashqaridan keladigan ma'lumot) | yumshoq **amber** `#FBF0DC` / `#DFB068` / `#7A5510` |
| NATIJA (JSX, ekranga chiqadigan) | yumshoq **ko'k** `#EDF1FC` / `#A7B9E8` / `#33478A` |
| ❌ **QIZIL ISHLATILMAYDI** | u XATO rangi — oqim-diagrammasida ziddiyat tug'diradi |

**Metaforani o'ldirmang.** Bezakni olib tashlash ≠ metaforadan voz kechish. Agar bir
qurilma bir necha ekran bo'ylab o'sib borsa (qismlari yonadi → richag tortiladi →
ichiga solinadi → ichi ko'rsatiladi), u **bitta hikoya** bo'lib qolishi kerak: faqat
ma'nosiz qismlari olib tashlanadi, tuzilishi va rejimlari saqlanadi.
- Dalil: M3-D3 `CardMachine` — 4 ekranda (9·10·12·14/23) bitta qurilma. Ko'zlar,
  boltlar, `▢ ▢` va uzuq chiziq olib tashlandi; quyuq robot-fon yorug' kartochkaga
  aylandi; nom-plastinkasi, qolip, kirish teshigi, richag, chiqish latogi — **qoldi**,
  chunki har biri bir tushunchani bildiradi.
- Dalil-2: M3-D6 `CardFactory` — **6 ekranda** bitta fabrika (2026-08-20). Aynan shu
  uch taqiq buzilgan edi: `.cf-bolts` (4 ta bolt) · `.cf-gears` (⚙⚙) · `.cf-window`
  → **`▢ ▢`** — qonunda misol qilib keltirilgan belgi. Uchalasi o'chdi; teshik, varaqa,
  nom-plastinkasi, richag, chiqish latogi, hisoblagich va **6 rejimning hammasi qoldi**.
  Palitra M3-D3 bilan tenglashtirildi (tana `T.paper`, teshik amber `#FBF0DC/#DFB068`).
  
  🔴 **«Ishlayapti» signali bittadan ortiq bo'lmasin.** Fabrikada mashina ishlayotganini
  **to'rtta** narsa aytardi: korpus pulsi · aylanayotgan g'ildirak · `✦ ✦ ✦` · yorishgan
  latok labi. Holat-indikatori o'z-o'zicha ruxsat etilgan, lekin **takrorlansa** u ham
  shovqinga aylanadi — bittasi qoldiriladi.
  
  ⚠️ **Bezak olingach nisbatni tekshiring.** Oyna o'chgach tana 92px dan 62px ga tushdi
  va richag (42px) undan oshib ketdi. Qism o'chirilganda qolgan tuzilma o'lchamlari
  qayta hisoblanadi (`min-height` + markazlash), aks holda metafora «yassilanadi».

- **Dalil-3: M3-D11 `WarpMap` (ROBO-WORLD) — 2026-08-20, F-0820-76.** Modulda uchta
  metafora-qurilma bor edi; ikkitasi yorug'ga o'tkazilgan, uchinchisi quyuq qolgandi
  (`.warp` `#141C2E→#0E1524`, `.warp-scene` `#0B1220`). Foydalanuvchi topilmasi:
  «xaritaning pastida bir qoramtir narsa bor» — uch portal va chiqish eshigi **bitta
  quyuq dog'** bo'lib o'qilardi.

  🔴 **O'lchov aytgan haqiqat — matn kontrasti AYBDOR EMAS edi.** Barcha yozuvlar AA
  dan o'tardi (`4.80` · `5.15` · `8.09` · `14.90`). Sinadigan joy **yuza ajratuvchisi**:
  portal foni o'z idishiga nisbatan **1.14**, chegara **1.35**. Krem olamda kartani
  **soya** ajratadi — quyuq fonda soya ko'rinmaydi, shuning uchun quyuq panelda
  «karta» tushunchasi umuman yasalmaydi.
  📌 Umumiy saboq: quyuq panel ichidagi kartalarni faqat chegara ushlab turadi;
  ajratish kerak bo'lsa yo chegara kuchaytiriladi, yo panel yorug'ga o'tadi.

  **Qaror: yorug'.** Sabab — 127-qonunning o'z testi: *«bu nimani bildiradi?»*
  Sahna = sahifa mazmuni, HUD = URL. Kremdagi sahifa yorug'; quyuqlik atmosfera edi,
  ma'no emas. Palitra M3-D3/M3-D6 bilan tenglashtirildi: tana `T.paper`, portallar
  `T.bg` + `T.line`, sahna «natija» ko'ki (`#EDF1FC → T.bg`). Zona ranglari
  (accent · moviy · yashil) identifikator bo'lib **qoldi**.

  ✅ **Yorug' fonda porlash ishlaydi** — retsept M3-D3 `.cm-plate.cm-on` dan: porlaydigan
  elementning O'ZI to'yingan bo'lsa yetadi. `.warp-zoneicon` → oq halqa + zona-rangli
  halqa + yumshoq soya. `.warp-zap` oq radialdan **rangli halqa**ga o'tdi (oq porlash
  yorug' fonda ko'rinmaydi).

  🔴 **ATAYLAB QUYUQ QOLDIRILDI:** `.warp-flash` (`#060A12`) — `<a href>` ning to'liq
  qayta yuklanishi. Endi u xaritadagi yagona quyuq yuza: **1.06 → 18.03** kontrast.
  Ya'ni darsning bosh farqi (`<Link>` = markaz almashadi · `<a>` = hammasi qorayadi)
  matndan tashqari **ko'z bilan** ham o'qiladi. *Quyuq yuza ma'no tashisa — qoladi.*

  ⚠️ **Yorug'ga o'tkazganda kichik kegldagi matnni qayta o'lchang.** `T.ink3` krem fonda
  atigi **2.22** beradi (quyuq fonda o'sha matn 4.80 edi) — ya'ni «yorug' qildim» degan
  o'zgarish o'qishni **buzishi** mumkin. Ma'noli kichik matn (yo'l, izoh) `T.ink2` ga
  o'tkazildi: **6.23**.

**128-qonun — «OLIB KELISH» VA «YUBORISH» DARSLARI IKKI XIL OBRAZDA (2026-08-20, F-0820-71).**

Bitta modul ichida ikki darsning markaziy metaforasi **boshqa-boshqa** bo'lishi mumkin —
agar ular **teskari yo'nalishdagi** amalni o'rgatsa. Bu izchillik buzilishi emas,
**semantik bo'linish**: obraz amalning yo'nalishini ko'rsatadi.

| Dars turi | Amal | Obraz | Namuna |
|---|---|---|---|
| **olib kelish** | server → o'quvchi (GET) | **ofitsiant**: taom keltiriladi | m3-08 API GET |
| **yuborish** | o'quvchi → server (POST · PUT · DELETE) | **jo'natma**: posilka, yorliq, dispetcher-pulti | m3-09 API POST/PUT/DELETE |

**Nega bitta obraz yetmaydi.** «Ofitsiantga taom berdim» — ma'nosiz gap. Ofitsiant
metaforasi FAQAT olib kelishni ko'taradi; yuborish uchun jo'natma obrazi kerak.
Aksincha ham: GET ni posilka bilan tushuntirish o'quvchini «men nima jo'natdim?»
degan savolga olib keladi.

🔴 **IKKI MAJBURIY SHART** (ularsiz istisno ishlamaydi):

1. **Obrazlar aralashmasin.** Har dars O'Z obrazida toza turadi. «Olib kelish»
   darsida jo'natma so'zi (posilka, yorliq, yuk) **qolmasligi** kerak va aksincha.
   Tekshiruv **o'quvchiga ko'rinadigan matn** bo'yicha: `grep -i 'posilka|ofitsiant' <fayl>` —
   chiqqan qatorlar `tr({uz,ru})` ichidami? Ha bo'lsa — buzilish. CSS klass-nomi va kod-izohi
   (`.parcel`, `/* Posilka */`) obraz emas, identifikator — ular qoidaga kirmaydi.
   *Dalil: m3-08:1051 da «posilka yo'lda…» qolib ketgan edi — GET darsi ikki olamda
   turardi; chalkashlik m3-09 dan emas, aynan shu qoldiqdan kelardi (2026-08-20).*

2. **O'tish ekranida KO'PRIK-GAP majburiy.** Obraz almashadigan darsning reja-ekranida
   va birinchi tushuncha-ekranida o'quvchi almashuvni **aytib** o'tkaziladi:
   «O'tgan darsda ofitsiant taomni olib kelardi — bugun teskarisi: siz jo'natasiz.»
   Ko'prik-gapsiz o'quvchi obraz uzilganini sezmaydi va uni **xato** deb o'qiydi.

⚠️ **Eng xavfli xato — eski obrazga havola.** Yangi darsning matni o'tgan darsni
eslatganda **o'tgan darsning obrazini** aytishi shart. m3-09 ning 4/23 mentori
«o'tgan darsda posilka kelardi» derdi — o'tgan darsda posilka umuman yo'q edi.
Bunday havola ikki darsni ham buzadi: o'quvchi o'zi eslamagan narsani eslashga majbur.

📌 Qonun **obrazga** tegishli, so'zga emas: «posilka» so'zini «jo'natma» ga almashtirish
muammoni hal qilmaydi (obraz o'sha-o'sha) va lug'atni **kitobiyroq** qiladi.

---
🔴 **127-QONUN ISTISNOSI — «BIR MARTALIK MA'NO-CHO'QQISI»** (2026-08-20, F-0820-78).

Quyuq yuza **ma'no tashisa** — qoladi. Ikki tasdiqlangan hol:

| Joy | Nima uchun quyuq |
|---|---|
| `WarpMap` `.warp-flash` (m3-11, 6/22) | `<a href>` ning to'liq qayta yuklanishi — «hammasi qorayib ketdi» hodisasi |
| Yakuniy formula-lavhasi (m3-13, 16/20) | darsning **bir marta** chiqadigan xulosa-cho'qqisi |

**Uch shart — uchalasi ham bajarilishi kerak:**
1. **Bir martalik.** Yuza darsda **bitta** joyda chiqadi. Takrorlansa — u endi «cho'qqi» emas, uslub.
2. **Rangning o'zi xabar.** «Chiroyli» yoki «atmosfera» yetarli asos EMAS (127-qonunning bosh testi).
3. **Atrofi yorug'.** Cho'qqi faqat krem fon ustida ishlaydi. Butun ekran quyuq bo'lsa, u yo'qoladi —
   aynan shu sabab m3-11 da xarita yorug'ga o'tkazilgan edi (kontrast `1.06 → 18.03`).

**Qanday e'lon qilinadi.** Hex-oq ro'yxat ISHLATILMAYDI: `#0E0E10` ni `dark-lint` ning
`SEMANTIC` to'plamiga solish butun detektorni o'chiradi. Istisno **elementning o'zida**
e'lon qilinadi va shu bilan muallif niyati kodda qoladi:

```jsx
<div className="frame" data-dark-ok="ma'no-cho'qqisi" style={{ background: T.ink }}>
```

`dark-lint` `data-dark-ok` ni ko'rsa o'sha qatorni o'tkazadi. Kod-tekshiruvda savol
bitta bo'ladi: *«bu marker haqli ekanini yuqoridagi uch shart tasdiqlaydimi?»*

---

## 11-E. 🎯 112-QONUN: `<p>` GA QO'YILGAN KLASS-QOIDA RESETDAN KUCHSIZ (2026-08-03, F-0803-27)

> Foydalanuvchi rasmi bilan keldi: PmLesson4 2-ekranidagi kartalar «buzulib yotibti».
> Sabab kartada emas edi — CSS **aniqligi** (specificity) da.

Har darsda reset bor:
`.lesson-root h1,…,.lesson-root p,… { margin: 0; padding: 0; }` — aniqligi **(0,1,1)**
(bitta klass + bitta teg). Bitta klassli `.xyz { padding: … }` esa **(0,1,0)** — ya'ni
**KUCHSIZ**. Shuning uchun `<p className="xyz">` da `padding`/`margin` **jimgina o'chadi**,
ammo `background`, `border-radius`, `color`, `font` qoladi.

**Nega bu eng yomon xato-sinfi:** blok «umuman stilsiz» emas, **yarim buzuq** ko'rinadi —
matn fon chetiga yopishadi, «pill» yassilanadi, ota-kartaning `border-radius` + `overflow:hidden`
ostida burchaklar kesiladi. esbuild jim, brauzer konsoli jim, `vite build` jim.
Dalil: `.oc-pain` — mo'ljal `padding: 9px 12px; margin: 0 15px 14px`, brauzerda **0px/0px**;
blok balandligi 38px o'rniga 20px, kartaning tagiga yopishib qolgan.

**Ko'lam (2026-08-03 skaneri):** 78 faylda **136 ta** qoida shu holatda edi — jumladan
o'quvchi ko'radigan kompilyator-ipuchasi `.hc-hint` (14 dars), `.mstats-warn` (79 dars),
`.hint`, `.one-line`, `.s3note` (48px chekinish butunlay yo'qolgan edi).

**Yechim (majburiy naqsh):** selektorni bir pog'ona kuchaytiring —
`.xyz.xyz { … }`. Klassni ikki marta yozish aniqlikni **(0,2,0)** qiladi, lekin
**aynan o'sha elementlarni** tanlaydi (element to'plami o'zgarmaydi) va modifikator
qoidalari (`.xyz.empty`) manba-tartibi bo'yicha ustun qolaveradi. Ota-klass aniq
bo'lsa `.karta .xyz { … }` ham bo'ladi.

**Darvoza:** `npm run lint:jsx` endi buni avtomatik tutadi (5-tekshiruv). Ikki nozik joyi bor,
ular kalibrovka qilingan:
- CSS — JS shablon-satri, `color: ${T.ink}` ichidagi jingalak qavs qoida-tanasini bo'ladi →
  tahlildan oldin `${…}` tokenga almashtiriladi (busiz darvoza jim o'tib ketardi);
- selektor qoida BOSHIDA turishi shart, aks holda `.rel-box .mono` kabi avlod-selektorlari
  yolg'on-signal beradi (ular allaqachon (0,2,0)).

**MARGIN tomoni — qaror o'lchov bilan chiqarilgan (F-0803-29).** Faqat `margin` yo'qotgan
**423** qoida bor. Ular BIR XIL EMAS, ikkiga bo'linadi va qaror shundan kelib chiqadi:
- **Ota-konteynerda `gap` bor → margin ORTIQCHA, tiklash REGRESSIYA.** `.hook-ack` (105 ta,
  2px) `.col { gap: 12–16px }` ichida; `.fc-done-s` (77 ta, 8px) `.fc-done { gap: 5px }`
  ichida. Ya'ni ~43% ida «tiklash» hech kim mo'ljallamagan bo'shliq qo'shadi.
- **Ota oddiy blok, `gap` yo'q → yo'qolgan margin haqiqiy nuqson.** `.hw-note` (90 dars,
  11px): yakun sahifasida uy-vazifa ro'yxati bilan izoh orasidagi oraliq brauzerda
  o'lchanganda **0px** edi. **Faqat SHU tuzatildi** (F-0803-29).
- Qolgani (2–4px) ko'zga tashlanmaydi; mualliflar ko'rinadigan joyni allaqachon inline
  `style={{ marginTop: 8 }}` bilan yopib qo'yishgan — bu ham «qolgani sezilmagan» dalili.
🔧 **Qoida:** margin-topilmasi bo'lsa AVVAL ota-konteynerni tekshiring —
`display:flex` + `gap` bo'lsa, TEGMANG. Shuning uchun lint darvozasi ham faqat `padding`ni
tekshiradi (margin uchun avtomatik hukm chiqarib bo'lmaydi).
📌 Resetni `:where(.lesson-root) p` ga o'tkazish RAD etildi — u 423 qoidani birdan
«tiriltiradi», ya'ni xato tuzatish emas, ko'rib chiqib bo'lmaydigan dizayn-migratsiya.

**Darvozaning KO'R NUQTASI (F-0803-29) — CSS ikki xil joyda yashaydi.** Linter dastlab CSS ni
faqat `<style>{…}</style>` ichidan o'qirdi, lekin bitta dars (`FullSystemProjectLesson`) uni
alohida o'zgaruvchida saqlaydi: `<style>{LESSON_CSS}</style>`. Natijada o'sha fayl backtik
darvozasidan ham, bu qonun darvozasidan ham BUTUNLAY chetda qolgan edi — va aynan o'sha
faylda CSS izohiga backtik tushib, `esbuild` va `vite build` JIM o'tdi (backtiklar juft edi),
darslik esa brauzerda `ReferenceError` bilan qulab tushdi. Endi ikkala shakl ham o'qiladi.
⚠️ Ikkinchi nozik joy: o'zgaruvchi-shaklda yopuvchi backtikni «birinchi uchragani» deb olib
BO'LMAYDI — aynan qidirilayotgan adashgan backtik o'shanda yopuvchi deb qabul qilinadi va
darvoza yana jim qoladi. E'lon oxiri `` `; `` bilan anchorlanadi.

---
## 11-D. ⏱ 111-QONUN: 7–10 SONIYA TESTI · BO'SH JOY · OLIB TASHLASH SAVOLI (2026-08-03, F-0803-28)

> Manba: foydalanuvchi qarori — «o'quvchi bir ko'rganda 7–10 soniyada UI ni ko'rib tushunishi
> kerak · bo'sh joy qoldi deb uni so'z bilan to'ldirmaymiz — u ma'lumot bermasa, umuman kerak
> emas · kartani olib tashlashda savol beramiz: bu bo'lmasa o'quvchi ma'noni tushunmay
> qoladimi?». Bu — texnik darslar kitobidagi qarindoshi: PM tomonida `PM_DARS_ETALON` 106f
> («7 soniya testi») va 106c («olib tashlash testi») allaqachon bor edi, texnik darslarda YO'Q edi.

**(a) 7–10 SONIYA TESTI — qabul KPI si.** Ekran topshirilishidan oldin unga BIRINCHI MARTA
ko'rgan odam ko'zi bilan 7–10 soniya qaraladi. Shu vaqt ichida UCHTA savolga javob chiqishi shart:
1. **Nima qilishim kerak?** (vazifa bittami va ko'rinadimi)
2. **Qayerga bosaman?** (birlamchi harakat qaysi element ekani shubhasizmi)
3. **Bu ekran nimani o'rgatyapti?** (bitta g'oya — 92-qonun bilan juft)

Uchtasidan biri 7–10 soniyada tushunilmasa — ekran **topshirilmaydi**: unda ortiqcha UI yoki
ortiqcha matn bor. Tuzatish tartibi 109-qonun ov-ro'yxati bo'yicha (avval matn, keyin blok,
oxirida shrift/padding). Test **bosilgandan keyingi holatda ham** takrorlanadi — 110-B: ochilgan
paytdagi «toza» ko'rinish yolg'on bo'lishi mumkin.

**(b) BO'SH JOY SO'Z BILAN TO'LDIRILMAYDI.** 🔴 Bo'sh joy — **dizayn elementi**, nuqson emas.
«Ustunning pastida joy qoldi» degan sabab bilan izoh, eslatma, maslahat, motivatsiya-gap yoki
takroriy tushuntirish QO'SHILMAYDI. Har matn bo'lagi ishga yollanadi: u yoki **vazifani aytadi**,
yoki **yangi ma'no beradi**, yoki **javobga yo'l ochadi**. Uchalasi ham yo'q bo'lsa — matn
o'sha joyda turishi UI ni buzadi (o'quvchi keraksizini o'qib, keraklisini tashlab ketadi).
- ❌ «Bu juda muhim, esda tuting» · «Davom etamiz» · «Yaxshi ish!» (harakatsiz, ma'nosiz)
- ✅ bo'sh joy shundoq qoladi — yoki blok markazga/yuqoriga tortiladi (layout bilan hal qilinadi,
  matn bilan emas).

**(c) OLIB TASHLASH SAVOLI — har karta/blok uchun.** Elementni (karta, ipucha, izoh, mini-blok,
dekor-vizual) olib tashlashdan oldin AYNAN shu savol beriladi:

> **«Bu bo'lmasa, o'quvchi ekran ma'nosini tushunmay qoladimi?»**
> **HA** → qoladi (u ma'no tashiydi). · **YO'Q** → **olib tashlanadi** (u faqat joy egallaydi).

- Shubha bo'lsa — **olib tashlanadi**: yetishmagan narsani o'quvchi so'raydi, ortiqchasini esa
  o'qimay tashlaydi va u bilan birga keraklisini ham tashlaydi (korpus 74-bo'lim).
- Savol **butun blokka** beriladi, bitta so'zga emas; blok qolsa — ichidagi matnga 109-qonun.
- Bu 106c/korpus-74 dagi «olib tashlash testi»ning qaror-shakli: u elementni SINAB ko'radi,
  bu esa qarorni YOZIB qo'yadi (auditor GAP-hisobotida har olib tashlangan blok uchun bitta
  qator: nima olindi → savolga javob YO'Q edi).

**O'lchov va tekshiruv (dasturiy):** `node tools/tmi-shot.mjs <dars-key> <papka>` — har ekranni
ochib skrinshot oladi va `.screen` matn-uzunligini belgida chiqaradi (109-qonun mezoni: dars-ekrani
**≤354 belgi**, yakun-sahifasi istisno). Skript `_lessonids.txt` dan dars ro'yxatini oladi va
repo ildizidan ishga tushiriladi.

**Rol-mas'uliyati:** `darslik-auditor` — GAP-hisobotida har ekran uchun 7–10 soniya hukmi
(o'tdi / yiqildi + qaysi savol) · `darslik-qabulchi` — 7–10 soniyada yiqilgan ekran bo'lsa
**QAYTARISH** hukmi (dars prodga chiqmaydi).

---
## 12. 🐛 MA'LUM BUGLAR TARIXI (qaytarilmasin!)

| Bug | Belgi | Sabab | Tuzatish |
|---|---|---|---|
| 🔴 **Gate-vidjet ko'rinish-zonasidan TASHQARIDA** (2026-08-03, F-0803-19) | «Davom etish» ochilmaydi, o'quvchi «dars ishlamayapti / oq bo'lib qolgan» deydi; esbuild/lint hammasi toza | Majburiy vidjet (drag-drop) ikki ustunli splitdan KEYIN to'liq enli chizilgan — 720px oynada `y=766+` ga tushib qoladi; `.lesson-root` da `overflow:hidden` bo'lgani uchun scroll HAM yo'q | Gate-vidjet birinchi ekran-to'ldirishda ko'rinsin: mavjud ustunni ALMASHTIRSIN (JsFunctions s3 naqshi) yoki yuqorida tursin. Tekshiruv: brauzerda 1280×720 va 1280×648 da vidjet `getBoundingClientRect().bottom <= innerHeight` |
| 🔴 **Ikki animatsiya-klass bitta elementda — gate-vidjet KO'RINMAS** (2026-08-03, F-0803-22) | Karta/tugma umuman chizilmaydi (bo'sh joy), o'quvchi bosa olmaydi → «Avval kartani bosing» abadiy qulf, dars o'tmaydi. esbuild · `lint:jsx` · `lint:til` — hammasi TOZA, konsolda xato YO'Q | `className="dc-big tap-hint-card fade-up"` — `.fade-up` (`opacity:0` + `fade-in-up … forwards`) va `.tap-hint-card` (`… infinite`) ikkalasi ham `animation` **shorthand**ini yozadi. CSS'da keyingi e'lon oldingisini butunlay yengadi (birlashtirmaydi): `fade-in-up` hech qachon ishlamaydi, `opacity:0` abadiy qoladi | **Bir elementda bitta `animation` yozuvchi klass.** Ikkalasi kerak bo'lsa: (a) chiqish-animatsiyasini o'rovchi `<div>`ga bering, yoki (b) juft e'lon qiling — `.dc-piece.tap-hint-card { animation: feat-pop …, tap-hint-card …; animation-delay: var(--fd), calc(var(--fd) + .8s) }`. ⚠️ Inline `style={{animationDelay}}` ikkala animatsiyaga birdan tushadi — `--fd` tokeni orqali bering. Shu sinf `@media (prefers-reduced-motion)` bekor qilishini ham buzadi: media-blok KEYINGI e'londan oldin tursa ishlamaydi (spetsifiklik qo'shilmaydi) — `!important` bering yoki oxirida e'lon qiling. **Tekshiruv:** brauzerda 1.5s kutib `getComputedStyle(el).opacity > 0.9` |
| 🔴 **Gate-mezoni ipucha aytgan yechimni RAD etadi** (2026-08-03, F-0803-22) | Mashqni TO'G'RI bajargan o'quvchi «Davom etish»ga yeta olmaydi; mentor `isMentor` bilan, jonli o'quvchi `optionalLive` bilan o'tib ketadi — shuning uchun QA'da ko'rinmaydi, faqat yolg'iz o'qiyotgan bola qamaladi | PmLesson5 kompilyatori chiqishni `out.split(/[·,|]+/)` bilan sanardi (`parts.length===3`), ipucha esa `natija = natija + nomlar[i]` deb aytardi — **ajratgichsiz**. Shart-matni ham ajratgich haqida hech narsa demasdi | **Gate-mezoni ko'rsatma bilan bitta manbadan chiqsin.** Mezonni yozgach: ipucha/topshiriq matnini SO'ZMA-SO'Z bajarib ko'ring — o'tmasa, mezon xato (matn emas). Mezonni SHAKLGA emas MA'NOGA bog'lang: «uch v1-nomi bor, qolgan uchtasi yo'q», formatga bog'liq shart esa `\|\|` bilan qo'shimcha yo'l bo'lib qolsin |
| 🔴 **`<style>` ichida ortiqcha backtick** (2026-07-28) | IDE **yuzlab** xato ko'rsatadi («'}' expected», «Did you mean `{'}'}`»), esbuild esa BITTA xato beradi | `<style>{` … `}</style>` bloki JS **shablon-satri**; uning ichiga (odatda CSS izohiga) yozilgan backtick satrni **erta yopadi** va undan keyingi butun CSS+JSX kod deb o'qiladi | CSS izohlarida backtick ISHLATMANG. 🔴 **Diagnostika:** IDE ro'yxatiga qaramang — **esbuild**ning BIRINCHI xatosiga qarang, ildiz doim bitta. ⚠️ Grep bilan ovlash ishonchsiz (ko'p qatorli izohda backtick 2-3-qatorda bo'lishi mumkin, `{/* … */}` JSX-izohlari esa yolg'on-signal beradi — ular shablon-satridan TASHQARIDA va zararsiz). To'g'ri usul: `<style>{\`` va `` \`}</style> `` orasidagi matnni ajratib, undagi backticklarni sanash — 0 bo'lishi shart. 🔴 **2026-08-02 (F-0802-15): endi bu QO'LDA emas — `npm run lint:jsx` avtomatik tekshiradi.** Sabab: bu qator 2026-07-28 da yozilgani holda, 2026-08-02 da aynan shu xato QAYTA qilindi (CSS izohiga `` `.mt-chip.in` `` yozildi → darslik oq ekran, `ReferenceError: chip is not defined`). Jadvaldagi eslatma o'qilmasa ishlamaydi — **darvoza ishlaydi** |
| 🔴 **Bir-qatorli funksiya ichida `//` izoh** (2026-08-02, F-0802-14) | Skript bilan N faylga naqsh yoyilgach, esbuild **ommaviy** xato beradi (72 fayl) yoki jim o'tib funksiya yarim ishlaydi | Dars kodida ko'p yordamchi bir qatorga sig'diriladi: `const upd = () => { const z = …; document…setProperty(…); };`. Almashtiruvga `// izoh` qo'shilsa, u qatorning **QOLGANINI** yeydi — `setProperty` chaqiruvi yo'qoladi | Bir-qatorli funksiya ichiga `//` izoh QO'YILMAYDI: izoh qatordan **oldin** alohida turadi yoki `/* … */` ishlatiladi. Avtomatik: `npm run lint:jsx` (izohdan keyin o'sha qatorda yopiluvchi `}` bo'lsa — xato; satr-literallar hisobga olinadi, `http://` yolg'on-signal bermaydi) |
| **Kalit yuklanmaydi** | Podium 0/5, arena 0 0 0 0 | `useLiveSession(lessonId)` `answerKey`ni tashlaydi; `set_quiz_keys` yo'q | 2.1 + 2.2 |
| **Mentor stats "1 xato"** | To'g'ri javob "xato" sanaladi (ustunga zid) | Sanoq eskirgan `a.correct`ga tayanadi | 6-bo'lim (`picked === correctIdx`) |
| **DragDrop dublikat** | Chiplar o'nlab ko'payib ketadi | setState ichida setState (StrictMode 2x) | 9.1 (yagona atomik holat) |
| **Drag pirillash/pozitsiya** | Klon ekran pastida, titraydi | `position:fixed` klon transformlangan ajdod ichida | 9.1 (asl chip DOM transform) |
| **`<li/>` ortiqcha nuqta** | Preview'da bo'sh nuqta | Brauzer `<li/>` ni bo'sh li deb o'qiydi | 11.4 |
| **Havola oq oyna** | Link bosilganda oq ekran | iframe sandbox link'ni o'zi ochadi (X-Frame) | 11.5 |
| **Kirill aralashuvi** | Lotin so'zda begona harf | Tasodifiy kirill kiritish | 1-bo'lim (grep + lotinlashtirish) |
| **Sen-forma murojaat** | "Topding", "yozding", "o'zing" | Nishon/xulosa matnlari sen-formada yozilgan | 1-bo'lim (grep + siz-forma) |
| **Matn ↔ tugma nomi mos emas** | «"Sayt" tugmasini bosing» — lekin kodni "Kod" tugmasi ochadi | Matn yozilgach UI o'zgargan/tekshirilmagan | 1-bo'lim (matn ↔ UI mosligi) |
| **Qizil fon xato bo'lmagan joyda** | "Sizning loyihangiz", ul/ol xulosasi qizil fonda | `frame-soft`/`accentSoft` hamma info-blokka qo'yilgan | 11.6 (`frame-success`) |
| **Zerikarli/rasmiy nishon nomlari** | "Skelet ustasi", "HTML qahramoni" | Uzun o'zbekcha nom — o'yin his'i yo'q | 10-bo'lim (qisqa inglizcha "Built It!"/"Level Up!" + o'zbekcha desc) |
| **Bosiladigan joylar noaniq** | O'quvchi skelet ekranida nimani bosishni bilmaydi | Interaktiv qismlarda affordance yo'q | 11.7 (yo'riqnoma+pulsatsiya+✓) |
| **Aralash apostrof** | Manbada `to’liq` (U+2019), `to‘g‘ri` (U+2018) — qolgan matn `'` bilan | Matn terishda tashqi klaviatura/avtokorrekt | 1-bo'lim (`grep -n "[‘’ʻ]"` → bo'sh) |
| **Tugma nomi qisman yangilangan** | "Ishga tushir" → "Ishga tushirish" qilinganda bitta tugma (Brauzer) qolib ketgan; audio/mentor matni eski nomni aytadi | Qidiruv faqat bitta yozilishda qilingan | 1-bo'lim (tugma + matn + audio birga; grep bilan barcha variantlar) |
| **Starterda tayyor kod** | Praktika ochilganda ba'zi shartlar oldindan ✓; o'quvchi o'zi yozmaydi | `STARTER_*`ga namuna teg/matn/ko'rsatma qo'shilgan | 11.9 (faqat `<!-- Bu yerga yozing -->`) |
| **"Sirli" kutish matni** | «To'g'rimi-xatomi — hozircha sir! 🤫» — bola tushunmaydi/bezovta | Kahoot-reveal kutish matni dramatik yozilgan | 1-bo'lim ("sir"-uslub taqiqi) + 15-G |
| **Apostrof tuzatishda build sinishi** | `Expected ")" but found ...` — esbuild yiqiladi | Qiyshiq apostrof single-quoted JS string ichida oddiy `'` bilan almashtirilgan | 15-G (`\'` escape) yoki stringni qo'shtirnoqqa o'tkazish |
| **Kompilyator tab-qaytishda yopiladi** (2026-08-01) | O'quvchi kompilyatorda yozib turib boshqa tabga o'tib qaytsa — kompilyator yopiq, ortidagi praktika-sahifa ochiq; yozilgan kod **butunlay yo'qolgan** | Chrome «Memory Saver» fon-tabni bo'shatib sahifani jimgina qayta yuklaydi. `practice` overlay oddiy React-state edi, `HtmlCompiler` esa kodni hech qayerga saqlamasdi | 11-D (102-qonun): `ccPractice:<lessonId>` + `ccCode:<lessonId>:<praktika>` |

---

## 13. 🔍 AUDIT — HOLAT (2026-07-08, 25 fayl skanerlandi)

**To'liq etalon (namuna):** `Htmllesson1` ✅ · `Htmllesson2` ✅ · `CssLesson1` ✅ (2026-07-08, birinchi to'liq ko'chirilgan — 7 qatlam + DragDrop + CSS praktika-compiler) — qolgan darslar SHU uchtaning ko'rinishiga o'tkaziladi.
**Htmllesson1 qo'shimcha (2026-07-08):** onboarding (11.14) · to'liq-ekran nishon bayrami (10) · inglizcha nishon nomlari (10) · xira LiveBadge (11.15) · matn-audit (MATN_ETALONI 9-jadval). Bular boshqa darslarga ham tarqatiladi.

**Hamma darsda ALLAQACHON bor (tekshirilgan):** set_quiz_keys jonli-ball (2.x) · layout 1100px + `--lz` avto-zoom (11.11) ·
Kahoot-reveal `reveal_screen` · RecapOverlay · optionalLive/freeRide (5.5) · QuizArena (lekin ESKI ko'rinishda).

**21 darsda YETISHMAYDI (ko'chiriladigan qatlam):**
| # | Nima | Etalon bo'limi | Holat |
|---|---|---|---|
| 1 | CodeStrike brend arenasi (QzBolt, QzFX, yorug' fon, brend ranglar) | 8.2 | hamma joyda eski ⚔️ ko'rinish |
| 2 | 🃏 Flashcards ekrani (summarydan oldin, jonlida faqat mentorga) | 9.3 | hech birida yo'q |
| 3 | 🏅 Badges (4 nishon + toast + hisoblagich + kolleksiya) | 10 | hech birida yo'q |
| 4 | fmtCode kod-atama chiplari (savol/variant/izoh/arena) | 11.8 / 15-D | hech birida yo'q |
| 5 | Praktika qatlami (compilator + MentorPracticeOverlay + 500+ signal) | 9.4 | hech birida yo'q (mavzuga qarab) |
| 6 | DragDrop / DebugChallenge interaktivlari | 9.1 / 9.2 | hech birida yo'q (mavzuga qarab) |
| 7 | QUIZ_BANK 3/3/3/3 taqsimoti tekshiruvi | 8.3 | tekshirilmagan |
| 8 | TIL: qiyshiq apostrof (2–56 ta/fayl!), "hozircha sir 🤫" (har birida 2), ba'zida sansirash | 1 | hammasida bor |
| 9 | 📖 RECAPS kontenti (testdagi «Qayta tushuntirish» kartalari) | 5.6 | Htmllesson1/2 ✅ (2026-07-08, 4×3 karta) · InternetLesson/PmLesson1/butun 2-Modull ✅ · **qolgan 1-Modull (Css1/2, Git, Deploy, PM2/3) bo'sh `{}`** — ko'chirishda to'ldiriladi |

**TIL nuqsonlari batafsil (2026-07-08 skaneri):** apostrof eng ko'p — HtmlPractice (56), JsVars (52), CssLesson1 (36),
CssLesson2 (33), JsIntro (31); kirill qatorlari — PmLesson5 (2), PmLesson6 (1), PracticeLesson2 (1);
sansirash namunasi — CssLesson1 "o'rganding". ⚠️ Apostrof tuzatishda EHTIYOT: ko'pi single-quoted JS string
ichida — oddiy `'` bilan almashtirsa string buziladi, `\'` escape ishlatiladi (15-G).

**Maxsus fayllar:** `CssPractice.jsx`, `HtmlPractice.jsx` — jonli qatlamsiz alohida praktika sahifalari
(936px ham emas, infra yo'q) — alohida ko'rib chiqiladi (ehtimol darslarning ichki compilatoriga birlashadi).
`PmLesson1`/`PeanStack` QUIZ_BANK=15 savol (etalon 12) — ko'chirishda 12 ta eng yaxshisi qoladi yoki 15 ligicha
qoldirish to'g'risida foydalanuvchidan so'raladi.

**KO'CHIRISH TARTIBI (modul oqimi bo'yicha, har biri alohida sessiya-qadam):** (1. `CssLesson1` ✅ TUGADI)
2. `CssLesson2` → 3. `GitLesson` → 4. `DeployLesson` → 5. `PmLesson2` → 6. `PmLesson3`
→ 7. `JsIntroLesson` → 8. `JsVarsLesson` → 9. `JsConditionsLesson` → 10. `JsLoopsLesson` → 11. `JsFunctionsLesson`
→ 12. `PeanStackLesson` → 13. `PmLesson4` → 14. `PmLesson5` → 15. `PmLesson6` → 16–19. `PracticeLesson1–4`
→ 20. `PmLesson1` + `InternetLesson` (faqat qolgan interaktiv qatlam; til 2026-07-08 tozalangan).

**Har dars uchun ko'chirish retsepti:** 15-C (interaktiv qatlam L1'dan) + 15-D (fmtCode) + 15-G (til tozalash) + MATN_ETALONI matn-auditi
+ 5.6 RECAPS to'ldirish (bo'sh bo'lsa) + 8.2 arena brendi + 8.3 taqsimot + 9.3 flashcard kontenti (12 karta, mavzudan)
+ 10 nishonlar (4 ta, real bosqichlardan) + **inglizcha o'yin-nom** (Nice Catch!/Level Up! bir xil) + **to'liq-ekran bayram `.acu-*`**
+ 11.12 inglizcha class nomlari + **11.14 onboarding (`.ob-*`)** + **11.15 xira LiveBadge (`.live-badge`)** + QZ_BG_SHAPES tokenlari mavzuga moslash
+ (agar mavzuga mos) 9.1 DragDrop / 9.4 kod-praktika + oxirida 14-checklist to'liq + esbuild + jonli sinov.

---

## 14. ✅ HAR DARS UCHUN TO'LIQ TEKSHIRUV RO'YXATI

```
TIL
[ ] 1    grep -nP '[\x{0400}-\x{04FF}]' — faqat ru: tarjima chiqadi (boshqa kirill yo'q)
[ ] 1    tushunarsiz so'zlar sodda tilga keltirilgan
[ ] 1    siz-forma: grep -noE "(ding|lading|san)\b|o'zing\b" — faqat mashina-buyruqlari qoladi
[ ] 1    tugma nomlari neytral ("Yaratish"); matnda tilga olingan tugma ekrandagisi bilan bir xil (audio ham!)
[ ] 1    apostrof: grep -n "[‘’ʻ]" — hech narsa chiqmaydi (faqat ASCII ' yoki \u2019 escape)
[ ] 1    "sir"-uslub yo'q: grep -nE "hozircha sir|🤫" — bo'sh (o'quvchi matnida sirli-dramatik ifoda yo'q)
[ ] 1    har ekranda useAudio matni bor; audio matn ↔ Mentor matn parallel

JONLI / BALL (🔴 statistika buglari shu yerdan)
[ ] 2.1  function useLiveSession(lessonId, answerKey) + keyRef qatori
[ ] 2.2  startMentor ichida set_quiz_keys (liveStore'dan keyin)
[ ] 2.3  const answerKey = {...INLINE_KEYS, ...quiz}; useLiveSession(id, answerKey)
[ ] 2.4  har scored:true ekran uchun INLINE_KEYS[id] == correctIdx
[ ] 3    submitAnswer imzosi o'zgarmagan; indeks konvensiyasi (<100 / >=100 / 500+)
[ ] 4    SCREEN_META.length == screens.length; PRACTICE_AFTER/Q_LABELS indekslari to'g'ri
[ ] 4.1  dars oqimi skeletga mos: hook → reja → (exploration→test→praktika)× → builder → debugging → podium → flashcard → summary
[ ] 4.2  summary standart: ScoreRing + CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya (glossary YO'Q — 193-qator qoidasi; F-0916-02: ziddiyat yopildi, 22 darsdagi glossary KATTA §39)
[ ] 5    QuestionScreen: 1-urinish qotiriladi (firstCorrectRef), oneShot
[ ] 5.5  animatsiya/mashq ekranlarida NavNext optionalLive (testlarda YO'Q; erkin rejimda majburiy)
[ ] 5.7  Kahoot-reveal: reveal_screen RPC + revealed formula + o'quvchida neytral kutish (option-wait) + mentor NavNext reveal'gacha qulf
[ ] 6    MentorTestStats: ok = rows.filter(a => a.picked === correctIdx).length
[ ] 7    ScreenPodium sort: y.okCount - x.okCount || x.time - y.time
[ ] 8    QUIZ_BANK correct indekslari to'g'ri; quizPts/quizScore o'zgarmagan; QZ_BG_SHAPES mavzuga mos
[ ] 8.1  arena 12 savol · har biriga 15s (QUIZ_MS = 15000, 20000 EMAS)
[ ] 8.3  QUIZ_BANK to'g'ri javoblar 4 pozitsiyaga TENG taqsimlangan (3/3/3/3, birortasi 0 emas)
[ ] 8.4  javob UZUNLIGI teng — to'g'ri javob uzunidan bilinmasin (inline QuestionScreen + arena QUIZ_BANK; qo'lda o'qib)

INTERAKTIV / DIZAYN (🟢 to'liq etalon uchun)
[ ] 8.2  CodeStrike arena (QzBolt, QzFX, brend ranglar; "CoddyHoot"/QzOwl qolmagan)
[ ] 9    DragDrop / DebugChallenge / Flashcards — reusable, kontent moslangan
[ ] 9.3  flashcard: Quizlet-uslub baholash; jonli darsda faqat mentorga, erkin rejimda hammaga
[ ] 📖   RECAPS to'ldirilgan: har scored test uchun 3 karta (ic/h/body/vis/ask) — bo'sh {} EMAS (namuna: InternetLesson 1675-qator)
[ ] 9.4  praktika-compiler soni AYNAN 3 (PRACTICE_AFTER 3 kalit — 4-5 emas)
[ ] 9.4  praktika: TASK/STARTER shakli, practice-done signal (500+), mentor jonli panel (chiplar + doska-demo)
[ ] 9.4  MAJBURIY: praktika shartlarida faqat SHU PAYTGACHA o'tilgan teglar (TASK_*.requirements ↔ dars oqimi)
[ ] 10   Badges — AYNAN 4 nishon (3 bosqich + graduate), hammasi real olinadigan; hisoblagich + kolleksiya; ko'rinadigan yorliq "Badges" (❌ "Achievements")
[ ] 10   nishon nomi QISQA INGLIZCHA o'yin-nom ("Built It!", "Nice Catch!", "Level Up!") + o'zbekcha desc
[ ] 10   TO'LIQ-EKRAN bayram (AchCelebrate, .acu-*) — kichik toast EMAS; navbatda bittalab

PRAKTIKA-DARVOZASI VA MENTOR EKRANI (2026-07-28)
[ ] 9.4-A praktika bajarilganligi SAQLANADI (dars-doirasidagi localStorage kaliti) — qayta kirganda majburlamaydi
[ ] 9.4-A takrorlash-yo'li: FAQAT erkin rejimda, xira matn-havola, matni UMUMIY («davom etish», ❌ «uy vazifasiga»)
[ ] 9.4-A havola FAQAT eshikni ochadi — nishon yo'q, «bajarildi» yozuvi yo'q, server-signal yo'q, saqlanmaydi
[ ] 10.1  mentor ekranida: nishon-hisoblagichi YO'Q · kolleksiya YO'Q · to'liq-ekran bayram BOR
[ ] 10.1  hisoblagich qorovuli komponentning O'ZIDA (return null — barcha hooklardan KEYIN)
[ ] 10-B  podiumda «📊 Savollar bo'yicha» (0/4 kabi) kartasi YO'Q + CSS qoldig'i ham yo'q (pod-qstats/qstat-*)
[ ] 10-B  shaxsiy ScoreRing mentorda YO'Q · MentorTestStats/praktika-paneli BOR · javob reveal'gacha yashirin
[ ] 11   UI qoidalari (emoji, pv-h1, li:empty, base target)
[ ] 11.14 onboarding: coach-mark spotlight tur (TourGuide .tg-*, data-tour), bir marta; katta PIN AUTO-ochilmaydi (faqat «Ko'rsatish» — aks holda tur bilan to'qnashadi)
[ ] 11.15 LiveBadge xira (.live-badge opacity 0.4) → hover'da tiniq
[ ] 11.16 arenada o'z-ball YASHIL (.me highlight #12A968), qizil faqat xato javob
[ ] 11.6 qizil fon faqat xatoda; xulosa/maslahat bloklari frame-success (yashil)
[ ] 11.7 "bosib o'rgan" ekranlarda yo'riqnoma + hisoblagich + pulsatsiya + ✓
[ ] 11.8 test/arena matnlarida kod atamalari backtick + fmtCode chip (QUIZ_BANK, options, explain*)
[ ] 11.9 MAJBURIY: har STARTER_* va DEFAULT_FILES faqat "<!-- Bu yerga yozing -->" — tayyor teg/matn/ko'rsatma YO'Q
[ ] 11.10 preview rasmlar real (PHOTO_SET URL), kod namunasi rasm bilan mos
[ ] 11.12 kod namunalarida class/id/o'zgaruvchi nomlari inglizcha (class="card", karta EMAS)
[ ] 11.11 MAJBURIY layout: stage 1100px + padH 60 + avto-zoom (--lz) — grep 'max-width: 1100px' chiqadi, '936px' chiqmaydi

YAKUNIY
[ ] ✔    build toza: npx esbuild <fayl> --outfile=<scratch>
[ ] ✔    JONLI SINOV: yangi PIN → 2 o'quvchi → podium/arena ballari 0 EMAS (mentor-kod: `server/.env.deploy.*`)
```

---

## 15. 🔧 TUZATISH RETSEPTLARI (mexanik)

**A) set_quiz_keys (jonli-ball) — 2 edit:**
```
1) function useLiveSession(lessonId) {            →  function useLiveSession(lessonId, answerKey) {
   const initRef = useRef(undefined);                const keyRef = useRef(answerKey); keyRef.current = answerKey;
                                                      const initRef = useRef(undefined);
2) liveStore(lessonId, { mode: 'mentor', ... });  →  ...+ keyingi qatorga:
                                                      if (keyRef.current) liveRpc('set_quiz_keys', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim(), p_keys: keyRef.current }).catch(() => {});
```

**B) MentorTestStats sanog'i:**
```
const ok = data.rows.filter(a => a.correct).length;   →   const ok = data.rows.filter(a => a.picked === correctIdx).length;
```

**C) Interaktiv qatlam (to'liq etalon):** `Htmllesson1.jsx` dan `DragDropOrder`, `DebugChallenge`,
`Flashcards`, `ScreenFlashcards`, Badges bloki (ACHIEVEMENTS/ACH_TRIGGERS/AchCtx/AchToasts/AchCounter — kod nomlari o'zgarmaydi),
MentorPracticeOverlay + PRACTICE_DONE_BASE (9.4), fmtCode (D)
va `qz-`/`dd-`/`dbg-`/`fc-`/`ach-`/`mp-` CSS ko'chiriladi; kontent (kartalar, savollar, nishonlar) o'sha darsga moslanadi.

**D) Kod-atama chipi (11.8) — helper + CSS:**
```jsx
// `...` bilan belgilangan kod atamalarini chipga aylantiradi
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;
```
```css
.qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
.qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
```
Render joylari (hammasi `fmtCode(...)` bilan o'raladi): variant tugmasi matni, izoh (`explain*`),
"To'g'ri javob: X — ..." satri, arena savoli `{Q.q}` va plitka `{o}` (ikkala ko'rinishda).

**E) NavNext optionalLive (5.5):** animatsiya-ekran `<NavNext optionalLive disabled={...}>` —
testlarga qo'yilmaydi; freeRide formulasi NavNext ichida allaqachon bor bo'lsa, faqat prop qo'shiladi.

**F) Layout kengligi + avto-zoom (11.11) — 4 edit:**
```
1) Lesson root komponentiga (masalan earn callback'idan keyin) effekt:
   // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
   useEffect(() => {
     const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
     upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
   }, []);
2) .lesson-root { ... height: 100dvh; ... }   →  zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1));
3) .stage { max-width: 936px; ... height: 100dvh; ... }  →  max-width: 1100px; height: calc(100dvh / var(--lz, 1));
4) const padH = isMobile ? 12 : 100;  →  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
```
Eslatma: HtmlCompiler overlay (`.hc-root`, `position:fixed` qatlam) `.lesson-root`dan TASHQARIDA —
unga zoom ta'sir qilmaydi, tegilmaydi. `--lz` mantig'i <=1920px ekranda z=1 (hech narsa o'zgarmaydi,
mobil ham tegilmaydi); faqat 2K/ultrawide'da 1.5x gacha proportsional kattalashadi.

**G) TIL tozalash (1-bo'lim) — python bilan, tartibi MUHIM:**
```python
s = open(fayl).read()
# 1) "sir" kutish matni (double-quoted string — xavfsiz, aynan shu matn hammasida bir xil):
s = s.replace("Javobingiz yozib olindi 🤫 To'g'rimi-xatomi — hozircha sir! Mentor «Natijani ochish»ni bosganda hammada birdan ko'rinadi.",
              "Javobingiz yozib olindi. To'g'ri yoki xato ekani mentor «Natijani ochish»ni bosganda hammada birdan ko'rinadi.")
# 2) Sansirash — har birini alohida, assert count==1 bilan (grep'dan topilganlar)
# 3) Qiyshiq apostrof — ENG OXIRIDA, \' escape bilan (oddiy ' EMAS — single-quoted stringni buzadi!):
for ch in '‘’ʻ': s = s.replace(ch, "\\'")
```
Keyin: `grep -n "[‘’ʻ]"` bo'sh · sansirash grep bo'sh · `npx esbuild` toza. Kirill qatorlari qo'lda lotinlashtiriladi
(faqat `ru:` tarjima qoladi). ⚠️ JSX matn ichida (string emas) `\'` ko'rinsa — noto'g'ri; u joyda oddiy `'` kerak,
shuning uchun almashtirishdan keyin esbuild + `grep -n "\\\\\\'"` natijalarini ko'zdan kechiring.

**H) Yangi UI qatlamlari (onboarding + to'liq-ekran bayram + xira LiveBadge) — L1'dan ko'chiriladi:**
```
1) TO'LIQ-EKRAN BAYRAM (10): AchToastItem/ach-toast'ni AchCelebrate + AchToasts (faqat toasts[0])
   bilan almashtir; .acu-* CSS blokini L1'dan ko'chir (eski .ach-toast* CSS o'chadi). Nishon nomlari inglizcha.
2) ONBOARDING coach-mark (11.14): TOUR data (learner+mentor, selector-based) + TourGuide komponenti + .tg-* CSS;
   real elementlarga data-tour="next|mentor|progress|ach|live" qo'y; root'da [onboard] state + effekt (500ms delay) +
   render <TourGuide role={onboardRole} onClose={closeOnboard} /> + LiveBadge deferBig={onboard}.
3) XIRA LIVEBADGE (11.15): barcha <div style={_liveBadgeS}> → className="live-badge" qo'sh;
   .live-badge { opacity:.4 } :hover/:focus-within { opacity:1 } @media(hover:none){opacity:.62} CSS qo'sh.
4) ARENA O'Z-BALL YASHIL (11.16): .me highlight (qz-brow.me, qz-brank, qz-pod-name, qz-mypl b, pod-row.me...) accent→yashil (#12A968/success).
```
Barchasi ${T.} palitradan foydalanadi (hamma darsda bor). esbuild + brauzerda sinov.

---

## 15-I. 📍 L1 MANBA XARITASI — nima QAYERDA (`Htmllesson1.jsx`)

> Rollar shu bo'limga ishora qiladi (takrorlanmaydi). **Qator raqamlari — v17, 2026-07-09 holati, DRIFT bo'ladi** — shuning uchun har doim **grep-anchor** (identifikator/CSS-marker) bilan toping; qator faqat mo'ljal. Yagona buyruq: `grep -n "<anchor>" src/1-Modull/Htmllesson1.jsx`.

**CONSTLAR** (`grep -n "^const NAME"`):
| Const | ~qator | Kimniki |
|---|---|---|
| `T` (palitra) | 902 | 🎨 Dizayn |
| `LESSON_META` / `SCREEN_META` | 1296 / 1297 | 🏗️ Quruvchi / ⚡ Jonli |
| `RECAPS` | 1440 | 🎓 Metodist |
| `SKELET_PIECES` | 2369 | 🏗️ Quruvchi (DragDrop kontenti) |
| `INLINE_KEYS` | 3274 | ⚡ Jonli |
| `QUIZ_COLORS` / `QZ_BG_SHAPES` | 3387 / 3390 | 🎨 Dizayn |
| `QUIZ_BANK` | 3401 | ⚡ Jonli (correct) / 🎓 Metodist (matn) |
| `PRACTICE_AFTER` / `PRACTICE_DONE_BASE` | 3898 / 958 | 🏗️ Quruvchi |
| `ACHIEVEMENTS` / `ACH_TRIGGERS` | 3907 / 3914 | 🏗️ struktura · 🎓 nomlar |
| `TOUR` | 3950 | 🏗️ Quruvchi (onboarding data) |

**KOMPONENTLAR** (`grep -n "function NAME"`):
| Komponent | ~qator | Kimniki |
|---|---|---|
| `HtmlCompiler` | 526 | 🏗️ Quruvchi (praktika) |
| `useLiveSession` (+`set_quiz_keys` ichida) | 963 | ⚡ Jonli |
| `AchCounter` (yorliq "Badges") | 1332 | 🏗️ struktura · 🎨 ko'rinish |
| `Stage` / `NavNext` (`optionalLive`) | 1360 / 1403 | 🏗️ Quruvchi |
| `RecapOverlay` / `MentorTestStats` | 1505 / 1553 | 🎓 / ⚡ (`picked===correctIdx`) |
| `fmtCode` | 1549 | 🏗️ helper · 🎨 chip · 🎓 backtick |
| `MentorPracticeOverlay` | 1696 | 🏗️ Quruvchi |
| `QuestionScreen` | 1763 | ⚡ Jonli (1-urinish, reveal) |
| `ScoreRing` / `Mentor` | 1863 / 1890 | 🎨 / — |
| `DragDropOrder` / `DebugChallenge` / `Flashcards` | 2375 / 2454 / 2498 | 🏗️ struktura · ✨ harakat |
| `ScreenFlashcards` / `ScreenPodium` | 3176 / 3276 | ✨ / ⚡ (sort) |
| `QzBolt` / `QzFX` | 3447 / 3479 | 🎨 mascot · ✨ canvas |
| `AchCelebrate` / `AchToasts` | 3916 / 3942 | ✨ to'liq-ekran bayram |
| `TourGuide` | 3963 | ✨ tg-* harakat · 🎨 ko'rinish |

**CSS BLOKLAR** (`grep -n "/* ===" ` — emoji marker bilan):
| Marker | ~qator | Kimniki |
|---|---|---|
| `🧲 DRAG&DROP` | 4384 | ✨ Animatsiya |
| `🐞 DEBUG CHALLENGE` | 4407 | ✨ Animatsiya |
| `🃏 FLASHCARDS (3D flip)` | 4421 | ✨ Animatsiya |
| `🏅 ACHIEVEMENTS` + `TO'LIQ-EKRAN NISHON BAYRAMI` (`.acu-*`) | 4472 / 4473 | ✨ Animatsiya |
| `👋 ONBOARDING` (`.tg-*`) | 4547 | ✨ harakat · 🎨 ko'rinish |
| `Jonli panel (LiveBadge)` | 4569 | 🎨 Dizayn |
| `DINOZAVRNI DASTURLASH O'YINI` (`rg-*`) | 4776 | 💡 idea namunasi · ✨ harakat |
| `Konfetti (yakun bayrami)` | 4907 | ✨ Animatsiya |

> **Ishlatish:** yangi darsga qatlam ko'chirayotgan rol shu jadvaldan anchor'ni oladi → `grep -n` bilan L1'da aniq blokni topadi → python/Edit bilan ko'chiradi → mavzuga moslaydi → esbuild. Qator drift bo'lgani uchun HAR SAFAR grep bilan tasdiqlanadi.

---

**128-qonun — `safe center` IKKALA OLAMDA MAJBURIY (2026-08-20, F-0820-67).**
`.stage-content` markazlashtirilgan ustun bo'lsa, `justify-content: center` **kontent
konteynerdan baland bo'lganda yuqori qismini kesib tashlaydi** va u skroll bilan ham
qaytmaydi. Yechim bitta so'z:

```css
.stage-content { … justify-content: safe center; … }
```

`safe` kalit so'zi: sig'sa — markazlashtiradi, sig'masa — `flex-start` ga qaytadi.

**Qamrov.** Ilgari bu faqat texnik darslarda (krem olam) bor edi; PM darslarida (binafsha
olam) **umuman yo'q edi** — `PmLesson8` va `PmLesson9` ning ikkalasida ham. 2026-08-20 da
foydalanuvchi qarori bilan **ikkala olamga ham** majburiy qilindi.

**QAMROV ANIQLASHTIRILDI (2026-08-20, F-0820-93 · foydalanuvchi qarori).** Qoida
`.stage-content` **markazlashtirilgan** bo'lgan darslarga tegishli. Agar faylda
`justify-content` **umuman yo'q** bo'lsa (default `flex-start`), qonun ogohlantirgan
kesilish **yuz bermaydi** — bunday faylga `safe center` **qo'shilmaydi**, chunki u
nuqsonni tuzatmaydi, balki kontent sig'ganda vertikal joylashuvni **o'zgartiradi**.

**Tekshirish (ikki bosqichli) — FAQAT `.stage-content` QOIDASI ICHIDA:**
1. `.stage-content` qoidasini o'qing. Unda `justify-content` **bormi**?
   Yo'q bo'lsa — talab yo'q, **topilma emas** (default `flex-start`, kesilish bo'lmaydi).
2. Bor bo'lsa — u **`safe center`** bo'lishi shart; yalang `center` — 🔴 topilma.

🔴 **Butun-fayl `grep -c "justify-content: center"` ISHLATILMAYDI** — u har qanday
markazlashtirilgan flex-qutini (karta ichi, tugma, badge) tutadi va o'nlab yolg'on signal
beradi (m4-02 da **40** ta). Qoida faqat **`.stage-content`** ga tegishli: kesilish
xavfi sahifa-ustunida bor, karta ichida yo'q.

Yangi dars markazlashtirilgan ustun bilan quriladigan bo'lsa, `.stage-content` darhol
`safe center` bilan yoziladi.

**Misol (m4-01 `DataIntroLesson`):** `grep` → 0, lekin `.stage-content` da
`justify-content` yo'q edi — **yolg'on signal**, tegilmadi.

---

**129-qonun — BO'SH APPARAT KO'RSATILMAYDI (2026-08-20, F-0819-57 dan o'sdi).**
Jonli-sessiya paneli ma'lumot kelmagunicha **hech narsa chizmaydi**. «Yuklanmoqda…»,
«Hali hech kim qo'shilmagan», `— 0/0` sarlavhasi yoki hammasi **0%** turgan diagramma —
bular joy egallaydi, diqqatni tortadi va **hech narsa o'rgatmaydi**.

**Naqsh:**
```js
if (data.players === null || data.players.length === 0) return null;   // mentor paneli
if (!data || data.total === 0) return null;                            // o'quvchi pulsi
{opened && isLive && counts && totalVotes > 0 && ( … )}                 // ovoz-diagrammasi
```

Birinchi o'quvchi qo'shilgach panel **o'zi paydo bo'ladi** (3 soniyalik yangilanish).

**Qamrov:** `MentorPracticeStats` · `StudentPracticePulse` · `MentorTestStats` ·
hook ovoz-diagrammasi. Uchinchisi 2026-08-20 da qo'shildi: `counts` massiv bo'lgani uchun
`truthy` edi va jonli darsning boshida to'rt chiziq ham **0%** bo'lib osilib turardi.

**Tekshirish savoli:** panel ma'lumotsiz holatda **nima o'rgatadi?** Javob «hech narsa»
bo'lsa — u holatda render qilinmaydi.

---

**130-qonun — `position: fixed` QATLAM SAHIFA SARLAVHASINI BOSMASIN (2026-08-20, F-0820-73).**
Ekran ustida suzuvchi panel (progress-treker, holat-strip, yordamchi lenta) `.stage-header`
zonasiga — progress-chizig'i · eyebrow · `NN / NN` hisoblagichi turgan qatorga — kirmasligi
shart. Kirsa, dars **o'z joyini yo'qotadi**: o'quvchi qaysi bo'limda turganini o'qiy olmaydi.

**Dalil (M3-D12 AvtoIjara):** `DeliveryTracker` — `position: fixed; top: 8px; left: 10px;
z-index: 9997; max-width: min(60vw, 620px)`. Ekran-suratida u «● KIRISH · LOYIHA KUNI»
eyebrow'ini butunlay bosib turardi.

**Uch bandli tekshiruv — har `position: fixed` element uchun:**
1. **Joy:** `top < 60px` bo'lsa, `.stage-header` bilan to'qnashadimi? Sahifa tepasi allaqachon
   uchta narsani ko'taradi: progress · eyebrow · hisoblagich. To'rtinchisiga joy yo'q.
2. **Qamrov:** u **necha ekranda** ko'rinadi? Barcha ekranda turgan panel odatda faqat
   bir nechtasida ma'noli — 111-qonun savoli («bu bo'lmasa tushunmay qoladimi?») shu yerda
   beriladi.
3. **Bo'sh holat:** birinchi ekranda u **nima ko'rsatadi**? To'rtta bo'sh `☐` — o'quvchi hali
   o'sha to'rt topshiriq borligini bilmaydi — bu ma'lumot emas, shovqin (129-qonun bilan juft).

**Qaror-tartibi:** avval 2 va 3-bandga javob bering. «Faqat ma'noli ekranlarda ko'rsatish»
yetarli bo'lsa — shunday qiling; ma'noli ekran topilmasa — element **o'chiriladi**.
M3-D12 da uchala band ham kesildi va treker to'liq olib tashlandi.

---

**131-qonun — «TEGMA» CHEGARASI: MEXANIKA HIMOYALANADI, BEZAK EMAS (2026-08-20, F-0820-87).**
Foydalanuvchi biror ekranni «TEGMA» deb belgilasa, bu **mexanika va matn-mazmunni**
himoya qiladi: tanlov-mantiqi, savol-javob oqimi, metafora, misollar, ballar.

**Bezaklar bu himoyaga kirmaydi** — ular umumiy qonunlarga (127 · 129 · 130) bo'ysunadi:
puls-halqalar, yonuvchi ramkalar, ma'nosiz indikatorlar, sababsiz uzuq chiziqlar.
Bezakni olib tashlash ekranning **ishlashini o'zgartirmaydi**, ya'ni «TEGMA» buzilmaydi.

**Pretsedent:** M3-D9 (PmLesson9) 10/16 — foydalanuvchi «kartalarni o'rab turgan katta
yonuvchi ramka» ni **qat'iy** olib tashlashni buyurdi (`.itray` puls-halqasi, F-0820-68).
M3-D14 (PmLesson10) 10/16 da xuddi shu sinf topildi (`.hs` → `hs-pulse` binafsha halqa),
ekran esa «TEGMA» ro'yxatida edi — halqa olib tashlandi, **tanlov-mexanikaga tegilmadi**.

**Shubhada:** «bu elementni o'chirsam, ekran BOSHQACHA ishlaydimi?»
- **Ha** → mexanika, TEGMA amal qiladi, foydalanuvchidan so'raladi.
- **Yo'q** → bezak, umumiy qonun amal qiladi.

Auditda bunday topilma **«bahsli joylar»** bo'limiga chiqariladi — jim o'chirilmaydi.

---

**132-qonun — HOLAT-MODIFIKATORI FONNI ALMASHTIRSA, MATN RANGI HAM BERILADI (2026-08-20, F-0820-79).**
Kontur uslubidagi tugma matnni urg'u rangi bilan yozadi. Holat-modifikatori (`.ready`,
`.on`, `.active`, `.selected`, `.is-*`) faqat **fonni** o'sha urg'u rangiga o'tkazsa va
matn rangini qayta bermasa — accent ustida accent qoladi, **yozuv ko'rinmay ketadi**:

```
.mstats-reveal       { background: #FFFFFF; color: #FF4F28; border: 1px solid #FF4F28; }
.mstats-reveal.ready { background: #FF4F28; }        ← matn ham #FF4F28, kontrast 1:1
```

**Nega kech topildi:** bu **quyuq fon emas**, shuning uchun `dark-lint` ning fon-skani uni
ko'rmasdi. F-29 ni «kontur» variantiga o'tkazishning yon ta'siri — nuqson **tuzatish paytida
tug'ildi** va yopilgan 4 ta darsda (m3-04 · m3-06 · m3-08 · m3-12) prodga yetib bordi.

🔴 **Darvoza:** `dark-lint` **1c-naqsh** — modifikator fonni almashtirsa-yu `color` bermasa,
asosiy qoidaning matn rangi bilan kontrast hisoblanadi; **3:1 dan past** bo'lsa signal beradi
(`◐` belgisi). Buzilgan nusxada sinovdan o'tkazilgan, butun repo bo'ylab yolg'on signal — 0.

**Umumiy shakl:** rang-juftligining **bir yarmi** o'zgarsa, ikkinchi yarmi ham ko'riladi.
Bu `background`↔`color` ga ham, `border`↔`background` ga ham tegishli.

---

**133-qonun — TANLOV-MASHQIDA HUKM SABABI BILAN BERILADI (2026-08-20, F-0820-103).**

Ko'p-tanlovli mashqda («qaysi ustunlar kerak?», «qaysilari mos?») tanlangan variantga
faqat **hukm** yozish yetmaydi: «to'g'ri» / «mos emas» — o'quvchi sababni bilmaydi va
**taxminlab** oxirigacha boradi. Xato tanlov shu yerda **o'rganish-nuqtasi** bo'lishi kerak.

❌ `{on && <span>{o.ok ? 'to'g'ri' : 'mos emas'}</span>}`
✅ hukm + **qisqa sabab**: «mos emas — bu `users` jadvaliga tegishli, `comments`'ga emas»

**Sabab-matni ma'lumot-massivida yashaydi** (`{ k, ok, why: { uz, ru } }`), JSX'da emas —
shunda u tarjimaga tushadi va bir joydan tahrirlanadi. **Sabab yozilgan bo'lsa, u
RENDER qilinishi shart:** m4-01 da `why` maydoni bor edi, lekin hech qayerda
ko'rsatilmasdi — o'lik ma'lumot bo'lib turdi va faqat o'zbekcha edi (F-0820-97).

🔴 **JUFT NUQSON — xato tanlov TO'G'RIdek ko'rinmasin.** Bu qonunni qo'llashda m4-01 da
ochildi: `.pick-row.on` **hamma** tanlangan qatorga `successSoft` (yashil) fon berardi —
ya'ni `narx` ni tanlagan o'quvchi **yashil** qator va kichkina «mos emas» yozuvini
ko'rardi. Rang hukmni **inkor qilardi**. Yechim — alohida modifikator:

```css
.pick-row.on.bad { background: ${T.accentSoft}; box-shadow: …, inset 0 0 0 1.5px ${T.accent}; }
.pick-row.on.bad .pick-box { box-shadow: inset 0 0 0 2px ${T.accent}; … }
```

**Tekshirish.** Har tanlov-mashqida: (1) `why`/sabab maydoni bormi va **render
qilinadimi**; (2) `tr({uz,ru})` da'mi; (3) xato tanlovning **foni** to'g'ri tanlovnikidan
farq qiladimi. 132-qonunning davomi: u fon↔matn kontrastini himoya qiladi, bu esa
fon↔**ma'no** mosligini.

---

**134-qonun — BITTA KLASS — BITTA ROL (2026-08-20, F-0820-116).**

Klass **kim gapiryapti** yoki **element nima ish qiladi** degan savolga javob beradi.
Bir klassni ikkinchi rol uchun qayta ishlatish — undan keyin **inline yamoq** talab qiladi,
va aynan shu yamoq dizayn tizimini yorib chiqadi.

❌ m4-03 da: `.ai-badge` — **AI so'zlovchisi** uslubi (ko'k `T.blue`). O'sha klass
   **«Do'st»** (odam-tengdosh) uchun ham ishlatilib, farqni ko'rsatish uchun
   `style={{ background: T.ink }}` bilan qoraytirilgan edi. Natija: bitta klass, ikki rol,
   ikki rang — va sahifadagi **eng og'ir dog'** (`dark-lint` `●`).
✅ Yangi klass: `.peer-badge` (`background: ${T.ink2}`, oq matn). Inline yamoq **butunlay
   ketadi**, har rol o'z qoidasida yashaydi.

**So'zlovchi-palitrasi (kanon).** Uch rol — uch rang, bir-birini takrorlamaydi:

| Rol | Klass | Rang | Nega |
|---|---|---|---|
| AI | `.ai-badge` | ko'k `T.blue` | mashina-ovozi, neytral-texnik |
| Mentor | mentor bloki | `T.accent` **to'liq** | darsning yetakchi ovozi |
| Odam-tengdosh | `.peer-badge` | `T.ink2` | neytral; **`T.success` BERILMAYDI** |
| **O'quvchining o'zi** | **`.you-badge`** | **`T.accent` KONTUR** (oq fon + accent matn/chegara) | **«Siz» suhbatdagi personaj EMAS** — ekran egasining **navbat-signali**. Kursda «sening harakating» tili doim accent. **To'ldirilgan emas:** u yorliq, tugma emas — to'ldirilsa harakat-tugmasi bilan chalkashadi (F-0820-144) |

🔴 **`T.success` so'zlovchiga berilmaydi** — u **hukm-rangi** («to'g'ri», «bajarildi»).
So'zlovchiga berilsa, o'quvchi uning gapini «to'g'ri javob» deb o'qiydi.

**Tekshirish.** `dark-lint` inline-fon topsa: avval «rangni to'g'rilash» emas, **«bu klass
qaysi rol uchun?»** deb so'raladi. Inline yamoq — deyarli har doim rol-drift belgisi.
Grep: `className="<klass>" style={{ background`.

---

**DEBUGGING-EKRANI PRECEDENTIGA ANIQLIK (2026-08-20, F-0820-89 davomi · foydalanuvchi qarori).**

3-Modulda (commit `43bca2b`) Debugging ekranlaridan `takeaway` bloklari olib tashlangan edi.
Precedent **noto'g'ri o'qilishi mumkin** — go'yo «Debugging ekranida takeaway bo'lmaydi».
Aslida chegara boshqa joydan o'tadi:

🔴 **Taqiqlangan — BO'SH MAQTOV.** O'quvchi hozirgina qilgan ishni takrorlaydi, yangi narsa
qo'shmaydi:
❌ «Topdingiz va tuzatdingiz — bu debugging!»
❌ «Xatoni o'qib, tuzatdingiz — bu debugging!»

✅ **Qoladi — MAZMUNLI QOIDA-ESLATMA.** Ekranda topilgan narsani **qoidaga** aylantiradi,
ya'ni o'quvchi keyingi safar ishlata oladigan bilim beradi:
✅ «Shtamp mos kelmasa — **404**!» (m4-05 `RoutingLesson`)
✅ «404 ni o'qidingiz, manzilni tuzatdingiz!» (m3-08)
✅ «Ko'rinmas xatoni ham topdingiz!» (m3-09)

**Sinov savoli:** blokni o'chirsangiz, o'quvchi biror **bilimni** yo'qotadimi?
Yo'qotsa — qoladi. Faqat maqtov yo'qolsa — ketadi.

Bu 4-bo'lim mezonining («element o'quvchiga biror narsa **tushuntiradimi**?») debugging
ekraniga tatbiqi — alohida qoida emas, o'sha mezonning aniq holati.

---

**135-qonun — KIRISH-ANIMATSIYA VA HOLAT-ANIMATSIYA BIR ELEMENTGA QO'YILMAYDI (2026-08-20, F-0820-136).**

`.fade-up` elementni `opacity: 0` qilib, ko'rinishni **`animation` xususiyatiga** topshiradi
(`fade-in-up … forwards`). Shu elementga `animation` beradigan **ikkinchi** klass qo'shilsa
(`.btn.invite` pulsi, F-0819-34), kaskadda kuchlirog'i butun `animation`ni almashtiradi —
`fade-in-up` hech qachon ishga tushmaydi va element **abadiy ko'rinmas** qoladi. esbuild,
`lint:dark`, ko'z bilan kod o'qish — hech biri tutmaydi; faqat ekran (yoki computed `opacity`).

❌ m3-01 da ikki ekran (09 · 10 / 20) shu sabab **o'tib bo'lmas** edi: yagona harakat-tugma
   `className="btn fade-up delay-2 invite"` — DOMda bor, `opacity = 0`, `animationName = btn-invite`.
✅ Kirish — **o'rovchida**, holat — **elementning o'zida**:
   `<div className="fade-up delay-2"><button className="btn invite">…</button></div>`

**Qoida.** Xavfli juftlik — **«ochuvchi» kirish-klass** (bazasida `opacity: 0` **va**
`animation … forwards|both` — korpusda bu `.fade-up`, 122 faylda) bilan `animation` beradigan
**har qanday boshqa** klass (`invite` · `pulse` · `.gate.open` · `.rp.full` kabi holat-klasslar)
bir `className`da turmaydi. Ikkalasi kerak bo'lsa — kirish **ota-elementga** ko'chadi.
Ikkinchi yo'l — **ta'mir-qoida**, ikkala animatsiyani bitta juft-selektorda berish:
`.fade-up.shake { animation: fade-in-up 0.4s ease-out forwards, shake 0.4s ease; }` — bu ham
qonuniy (vosita tan oladi), lekin holat-klass olib tashlanganda kirish qayta boshlanib
miltillaydi, shuning uchun o'rovchi afzal.

**Qamrov — nima topilma EMAS.** `.fade-step` · `.el-in` kabi **fill'siz** o'tishlar (`opacity: 0`
bazasi yo'q) bosib o'tilsa, faqat kirish o'ynamaydi — element **ko'rinadi**; bu estetik, xavf
emas, topilma emas. Shuningdek: holat-qoida o'zi `opacity` bersa yoki uning `@keyframes`i
`opacity`ni boshqarsa — element ko'rinadi, topilma emas.

**Tekshirish.** `lint:jsx` bandi «KIRISH-ANIMATSIYA + HOLAT-ANIMATSIYA» (faylda 5-raqam,
izohida `F-0820-136, ETALON 135`): kirish-klasslar ro'yxati **qo'lda emas** — darsning o'z
CSS'idan (`opacity: 0` + `animation`) yig'iladi; `className` ichida shu klass + CSS'da
`animation` beradigan boshqa qoida to'liq mos kelsa → topilma. Qo'lda tez tekshiruv:
`grep -n "fade-up[^\"\`]*invite" <fayl>` = 0.

**Toraytirish tarixi (yolg'on-ijobiy 0 ga yetguncha to'rt shart qo'shildi).**
1. Selektorning **oxirgi birikmasi** elementga **to'liq** mos kelsin — `.btn.invite` uchun
   `className`da ikkala klass ham bo'lishi shart (aks holda `.btn` bor har tugma topilma bo'lardi).
2. Psevdo-element (`::before`), `:hover`/`:active`/`:focus`/`:checked` qoidalari hisobga
   olinmaydi — ular bazaviy `animation`ni almashtirmaydi.
3. Qoida o'zi `opacity` bersa yoki `@keyframes`i `opacity`ni boshqarsa — topilma emas.
4. **Bitta-klassli** holat-qoida faqat `.fade-up`dan **KEYIN** yozilgan bo'lsa ustun keladi
   (teng aniqlik — keyingisi yutadi); oldin yozilgani yengilmaydi, topilma emas.
   Qo'shimcha: ta'mir-qoida (`.fade-up.<klass>`) bor bo'lsa — hal qilingan, topilma emas;
   yopilmagan CSS-blok tahlilga kirmaydi.
Eski 4-band (F-0803-22) bu sinfni **tutmasdi**: u faqat yakka-klassli selektorlarni ko'rardi,
`.btn.invite` juftligini esa «muallif ataylab birlashtirgan» deb o'tkazib yuborardi.

**Oxirgi o'lchov (2026-08-20).** `43bca2b` nusxa (bug bilan) → **2** topilma (`:1547` · `:1627`,
aynan ekranda isbotlangan ikki tugma) · tuzatilgan nusxa → **0** · butun `src/` (142 fayl)
→ yolg'on-ijobiy **0**, haqiqiy-ehtimoliy **3** (`FullstackConnectPracticeLesson:1040/1292` ·
`BackendCrudPracticeLesson:900` — holat-klass shakli, ekranda tasdiqlab M4 siklida ko'riladi).

---

**136-qonun — YAKUN-SIGNALLAR HAQIQIY HOLATDAN HISOBLANADI, SHARTSIZ YOZILMAYDI (2026-08-20, F-0820-137).**

Topshiriq bajarilgach serverga yoziladigan signallar — `correct` · `firstAttemptCorrect` ·
`solved` — **turli savollarga** javob beradi va ularni bir xil `true` bilan to'ldirish
statistikani yolg'onga aylantiradi.

| Signal | Savol | Qanday hisoblanadi |
|---|---|---|
| `solved` | Topshiriq oxirigacha bajarildimi? | ekran «done» holatiga yetdimi |
| `correct` | Yakuniy natija to'g'rimi? | **haqiqiy shartdan** (`v === 'c'`, hamma juftlik joyidami) |
| `firstAttemptCorrect` | **Xatosiz** yechdimi? | xato urinishlar sanog'idan: `wrongCount === 0` |

❌ m4-01 `Screen15` (sxemani ulash): uch bog'lanish joylashgach
   `correct: true, firstAttemptCorrect: true` **shartsiz** yozilardi — o'quvchi necha marta
   noto'g'ri ulagan bo'lsa ham «birinchi urinishda topdi» deb qayd etilardi.
✅ Xato urinishlar `useRef` da sanaladi va yakunda: `firstAttemptCorrect: wrongCount === 0`.

**Nega muhim.** Bu 157-korpus-qoidasining («ball bermaslik ≠ halol bo'lmaslik»)
**ball-davomi**. U yerda gap ekrandagi **matn** haqida edi, bu yerda serverga ketadigan
**raqam** haqida: mentor paneli, podium va LMS tahlili shu raqamlardan quriladi. Soxta
`true` — mentorga «sinf tushundi» deb ko'rsatadi, aslida esa yarim sinf uch martadan
urinib topgan bo'lishi mumkin. **Etalon dars yolg'on statistika yozmaydi** — aks holda
undan nusxa oladigan darslar ham yozadi.

**Tekshirish.** Har `onAnswer(…)` chaqiruvida qattiq `true` qidiriladi:
`grep -n "firstAttemptCorrect: true" <fayl>` — topilsa, u **hisoblangan** qiymatga
almashtiriladi. Bajarish-ekranlarida (`practice` · `koding`) `correct: true` **qonuniy**:
u yerda «to'g'ri/noto'g'ri» yo'q, faqat «bajarildi» bor — lekin `firstAttemptCorrect`
u yerda umuman yozilmaydi.

---

**137-qonun — HOOK-EKRANDA «AYNAN!» FAQAT TOPILGANDA (2026-08-20, F-0820-171).**

§157 (`MATN_KORPUS`) ning **hook-ekrandagi maxsus holati**. Alohida raqam olishiga sabab:
nuqson **to'rt darsda takrorlandi** (m4-01 · m4-03 · m4-04 · m4-05) — ya'ni bu tasodif emas,
**naqsh**: hook ball bermaydi, shuning uchun «hamma javob to'g'ri» qilib qo'yish oson.

**Uch shart — uchalasi birga:**

1. 🔴 **Har tanlovga bir xil maqtov TAQIQ.** «Aynan!» / «Topdingiz!» / «To'g'ri!» —
   faqat to'g'ri tanlovga. Xato tanlagan o'quvchi maqtov olsa, **noto'g'ri modeli
   tasdiqlanib** qoladi va dars davomida shu bilan yuradi.
2. 🔴 **`correct` faqat HAQIQIY shartdan:** `correct: v === 'c'`, `correct: v === correct`.
   Qattiq `true` — LMS tahlilini ham buzadi (136-qonun).
3. ✅ **Xato tanlovga KO'PRIK-GAP**, uyaltirish emas: «Aslida bu — **keng tarqalgan
   afsona**… dars oxirida uni **birga buzamiz**». Shunda hook **halol** bo'ladi VA
   keyingi ekranga **intriga** quriladi — dars o'z afsonasini maqtamaydi, **e'lon qiladi**.

**Nega ko'prik shart.** Hook — darsning birinchi ekrani; u yerda «xato» degan hukm
o'quvchini yopadi. Ko'prik aybni javobga emas, **hali o'rganilmagan mavzuga** yo'naltiradi
va o'sha mavzuni **va'da** qilib qo'yadi. m4-03 da bu s14 «Mif-buster» ekraniga,
m4-05 da s14 «to'rt qoida» ekraniga ulandi.

**Istisno — sof so'rovnoma.** Agar hook haqiqatan **fikr so'rasa** (to'g'ri javobi
yo'q, ikki tomon ham asosli), unda `correct: false` **hammaga** yoziladi va maqtov
umuman berilmaydi. m4-02 `PmLesson11` shunday — u to'g'ri qilingan.

**Tekshirish.** Har `stage: 'hook'` chaqiruvida: `correct:` qiymati **o'zgaruvchimi**;
`hook-ack` matni **shoxlanganmi** (`picked === … ? … : …`).

---

**IZOH — NAMUNA VA MUSTAQILLIK (2026-08-20, 2-sessiya nomzodi ⑤, m4-04 B2 qaroridan).**

Bu raqamli qonun emas, **qo'llash izohi**: qaysi ekranda to'liq namuna berish mumkin,
qaysida o'quvchi o'zi yozishi kerak.

- ✅ **Birinchi-marta-marosim ekranlarida to'liq namuna berish MUMKIN.** O'quvchi
  atamani, sintaksisni yoki asbobni **birinchi marta** ko'rayotgan bo'lsa — namuna
  to'siq emas, **kirish zinapoyasi**. Bu yerda «o'zing top» talab qilish o'quvchini
  mavzuga emas, **taxminga** majbur qiladi.
- 🔴 **Takror-mavzularda MUSTAQILLIK talab qilinadi.** O'sha tushuncha ikkinchi-uchinchi
  marta uchrasa, tayyor namuna **o'rganishni almashtiradi**: o'quvchi ko'chiradi va
  o'tib ketadi. Bunda namuna **qisman** beriladi (skelet, birinchi qator) yoki umuman
  berilmaydi.

**Chegara qayerda.** Savol «bu dars uchun birinchimi?» emas, «**o'quvchi uchun**
birinchimi?» — modul-ipi bo'ylab. Shuning uchun qaror `SCREEN_INTENTS` va oldingi
darslarning mazmuniga qarab qabul qilinadi.

---

**138-qonun — QULF-YORLIQ HARAKATNI AYTADI; QULF HOLATIDA «DAVOM ETISH» TAQIQ (2026-08-20, F-0820-181…187 paketi).**

`NavNext` qulflangan bo'lsa, yorliq **nima qilish kerakligini** aytadi. Qulf holatida
«Davom etish» yozib qo'yish — o'quvchini **tugma bosishga** chaqiradi, tugma esa
bosilmaydi: yorliq va xulq bir-birini inkor qiladi.

❌ `disabled={!done} label={done ? 'Davom etish' : 'Davom etish'}`
✅ `disabled={!done && !rescue} label={(done || rescue) ? 'Davom etish' : '5/5 ustun ko'rildi'}`

**UCH DARAJA — har biri o'zidan oldingisini to'ldiradi:**

| # | Daraja | Qachon | Nima qiladi |
|---|---|---|---|
| 1 | **Qulf-yorliq** | doim (qulf holatida) | harakatni **aytadi**: «Zanjirni yuring — 2/5» |
| 2 | **Ipucha** | 40 s yoki 25 s siljishsiz | **chuqurlashtiradi**: darsning o'z mazmunidan aniq keyingi qadam |
| 3 | **Rescue** | 110 s yoki 60 s siljishsiz | **yo'l ochadi**: «Davom etish» ochiladi, ball yo'q |

🔴 **Tartib buzilmaydi.** Yorliq nima qilishni aytmasa, ipucha va klapan **o'zi
yaratgan muammoni davolaydi**: o'quvchi mazmunni bilmagani uchun emas, **UI aytmagani
uchun** tiqiladi. Shuning uchun 1-daraja majburiy, 2–3 esa qulflangan ekranlarda.

**Tekshirish:** `grep -n "label={done ? { uz: 'Davom etish'" <fayl>` — topilsa, ikkala
shoxi ham «Davom etish» bo'lgan qulf-yorliq bor demakdir.

**Manba-tatbiq:** m4-08 `BackendCrudPracticeLesson` — 4 ta qulf-yorliq mazmunli qilindi
va `useStuckValve` bilan ulandi (KATTA_TOZALASH 13-band, birinchi qo'llanish).

**QO'SHIMCHA — YORLIQ QOIDASI RESCUE HOLATIGA HAM TATBIQ ETILADI (2026-08-21, 4a-02).**
Rescue qulfni ochgach yorliq **avtomat «Davom etish» ga o'tib ketmaydi**. Chegara
**ekran ballikmi** — shunga qarab:

| Ekran | Rescue holatidagi yorliq | Nega |
|---|---|---|
| **Ballsiz** (o'rganish/tadqiqot) | «Davom etish» **to'g'ri** | o'quvchi haqiqatan davom etadi, hech narsa qolmaydi |
| 🔴 **Ballik** (`INLINE_KEYS` bilan bog'langan) | «Davom etish» **TAQIQ** — harakat-nom yozilsi | «Davom etish» **bajarildi** degan taassurot beradi; aslida topshiriq **oralab o'tildi**, ball ham berilmadi |

✅ Namuna — 4a-02 `NestArchResourceLesson` Screen17 (ballik debugging ekrani):
`_resc ? tr({ uz: "Qatorlarni birga ko'ramiz →" })` — yorliq keyingi **harakatni**
aytadi va rescue-matni bilan bir gapiradi («Bu qatorlarni keyinroq birga ko'rib
chiqamiz»). O'quvchi qamalib qolmaydi, lekin **nima qolganini biladi**.

---

**139-qonun — OSHKOR-BELGI: ✅/❌ TANLOVDAN OLDIN KO'RINMAYDI (2026-08-21, 2-sessiya nomzodi ①, F-0820-299).**

O'quvchi **hukm chiqarishi kerak** bo'lgan elementning yorlig'ida ✅ · ❌ · ✔ · ☑ belgisi
**hukmdan oldin** turmaydi. Belgi savolga o'quvchi o'rniga **javob berib qo'yadi**:
ballik savol click-testga aylanadi, o'quvchi mazmunni emas, **belgini** o'qiydi.

**136–137–139 uchligi.** 136-qonun: javob **haqiqiy shartdan** kelib chiqsin.
137-qonun: xato tanlovga **maqtov berilmasin**. 139-qonun: to'g'ri tanlov **oldindan
belgilanmasin**. Uchalasi bitta halollikni uch tomondan yopadi — javob, maqtov, savol.

🔴 **TAQIQ zonasi** — o'quvchi tanlaydi/hukm qiladi:
ballik savol variantlari · hook tanlovi · «qaysi to'g'ri?» ekranlari ·
to'g'ri-xato bo'yicha saralanadigan `MatchPairs`/sudrash kartalari.

✅ **RUXSAT zonasi** — to'rt holat, chegarasi aniq:

| Holat | Nega ruxsat |
|---|---|
| **Hukmdan KEYIN** — reveal, feedback, `mstats` chip, podium | belgi **hukm natijasi**, uni ochib bermaydi |
| **Tanlov YO'Q kartalar** — RECAPS, flashcard `ic:`, tushuntirish-kartasi | belgi **ikonka**, javob emas |
| **Tadqiqot tugmasi** — dars **o'zi** «xatosini ham bosing» deb aytgan | belgi **yo'l-ko'rsatkich**: o'quvchi hukm qilmaydi, **ko'rsatmani bajaradi** |
| **O'quv-qiyoslash** — ❌ eski → ✅ yangi jadvali | belgi **o'quv materialining o'zi** |

**Chegara-savoli bitta:** «bu yerda o'quvchi **hukm qilyaptimi**, yoki **ko'rsatmani
bajaryaptimi**?» Hukm qilsa — belgi taqiq; bajarsa — belgi foydali.

**Manba-namuna (RUXSAT, tegilmaydi):** 4a-01 `NestArchAliveLesson:1633` va
4a-02 `NestArchResourceLesson:1205` — `<button>❌ Xato: {…}</button>`. Ikkalasi ham
**ballsiz tadqiqot ekrani**, ipucha esa o'quvchini ataylab shu tugmaga yuboradi
(«avval to'g'ri so'rov, keyin ataylab xato»). Belgi bu yerda **tajribaning nomi**.

**O'lchov:** `node` bilan tanlov-massivi ichida belgi qidiriladi
(`opts|options|VARIANTS|CARDS|CHOICES|answers` massivi ochilishidan yopilishigacha).
**2026-08-21 holati: butun repoda 0 ta** — ya'ni bu **oldini oluvchi** qonun,
tozalash-bandi emas.

**Nega darvoza-band emas.** Gate «hukm qilyaptimi / bajaryaptimi» farqini ko'ra olmaydi;
yuqoridagi ikki tadqiqot tugmasini ham topilma deb baqirar edi. Shuning uchun bu qonun
**auditda o'qib** tekshiriladi (tekshiruvchi rolining ov-bandi), grep esa faqat **nomzod
ro'yxatini** beradi.

---

**140-qonun — CHALG'ITUVCHI DARSNING O'Z QOIDASI BO'YICHA HAM NOTO'G'RI BO'LSIN (2026-08-21, 2-sessiya nomzodi ②, F-0820-300).**

Ballik savolda **har bir noto'g'ri variant** shu darsning **o'zi o'rgatgan qoidasi**
bo'yicha ham noto'g'ri bo'lishi shart. «Kalit emas» — yetarli asos EMAS.

**Nuqson qanday ishlaydi.** Chalg'ituvchi dars o'rgatgan tekshiruvdan **o'tib ketsa**,
u chalg'ituvchi emas — **ikkinchi to'g'ri javob**. Shunda dars **o'z ta'limotini
jazolaydi**: qoidani to'g'ri o'zlashtirgan o'quvchi ikkilanadi yoki o'sha variantni
tanlab, «xato» degan hukm oladi. Bu ballni emas, **ishonchni** buzadi.

**Manba (2-sessiya, 4b-02 `EdgeCasesTestLesson`):** edge-case darsining **finalida**
chalg'ituvchi darsning o'z `0.5` qorovulidan o'tardi — ya'ni edge-case darsi
**o'zining edge-case xatosini** yopib ketmoqchi edi.

**Uch savol — har chalg'ituvchiga:**

1. 🔴 **Dars qoidasi bo'yicha ham noto'g'rimi?** Qoidani/qorovulni **variantga qo'llab
   ko'ring**. O'tib ketsa — variant almashtiriladi (kalit emas!).
2. 🔴 **Nima uchun noto'g'riligi darsda aytilganmi?** Tushuntirilmagan sabab bilan
   noto'g'ri variant — **o'rgatilmagan narsani** so'raydi.
3. ✅ **Ishonarlimi?** Hech kim tanlamaydigan variant — **o'lik yuk**. Yaxshi
   chalg'ituvchi **aniq bir yanglish tasavvurni** gavdalantiradi, imkon bo'lsa —
   darsning o'zi nom bergan yanglishni (137-qonundagi «afsona» ko'prigi bilan juftlashadi).

**Tekshirish — o'qib, grep bilan emas.** Bu semantik qonun: variant matnini **dars
mazmuniga solishtirish** kerak. Shuning uchun u auditning **ballik-savol bandiga** va
tekshiruvchi rolining ov-ro'yxatiga kiradi.

**Qamrov:** faqat **SCORED** savollar (`INLINE_KEYS` bilan bog'langan) va `QUIZ_BANK`.
Hook tanlovi 137-qonun bilan yopilgan (u yerda «noto'g'ri» hukmi umuman berilmaydi).

---

**141-qonun — MAROSIM BITTA VA BIRINCHI-MARTA (2026-08-21, uch takrordan keyin muhrlandi).**

**Marosim** — darsning nishonlash lahzasi: `AchCelebrate` to'liq-ekran bayrami,
`OpeningAct` ochilish lavhasi, konfetti, katta ochilish-animatsiyasi, «birinchi marta
ishladi!» sahnasi.

🔴 **Bir dars/loyihada marosim BITTA bo'ladi va u BIRINCHI-MARTA lahzasiga qo'yiladi.**
Takror-ekranlar — **praktika-done · recap · takrorlash · flashcard-yakuni** — marosimni
**takrorlamaydi**.

**Nega.** Marosim **qiymatini takrordan oladi**: birinchi marta ishlagan narsa hodisa,
uchinchi marta ishlagani — kutilgan natija. Har «bajarildi» ga bayram qo'yilsa,
bayram **fon shovqiniga** aylanadi va haqiqiy birinchi-marta lahzasi **ajralib turmaydi**.
Bu 129-qonun («bo'sh apparat») ning his-tuyg'u tomoni: mazmunsiz marosim ham
**bo'sh apparat**, faqat u ko'zga yoqimliroq ko'rinadi.

**Takror-ekranda nima bo'ladi.** Marosim emas, **tasdiq**: qisqa `done-mini` yozuvi,
`frame-success` bloki, keyingi qadamga yo'naltiruvchi bir gap. Ya'ni «bajarildi» aytiladi,
**nishonlanmaydi**.

| Ekran | Marosim | Nima bo'ladi |
|---|---|---|
| **Birinchi-marta** (birinchi ishga tushirish · birinchi yashil test · loyiha ochilishi) | ✅ **HA** | to'liq marosim, bir marta |
| Praktika-`done` | ❌ yo'q | `done-mini` tasdig'i |
| Recap · takrorlash · flashcard yakuni | ❌ yo'q | qisqa xulosa |
| Dars yakuni (`Screen19`) | ✅ **HA** — bu **boshqa** marosim | modul-darajasidagi yakun, dars ichidagisi bilan raqobatlashmaydi |

**Uch pretsedent (shundan qonun raqami oldi):**
1. **F-0820-193x** (m4-13) — «takrorda mustaqillik»: takror-ekran birinchi-marta kabi
   bezatilgan edi.
2. **m4-13 `OpeningAct`** — ochilish lavhasi qayerga tegishli ekani hal qilindi.
3. **4c-03 B1** — praktika-`done` ga marosim **qo'shilmadi** (to'g'ri qaror, shu qonunni
   uchinchi marta tasdiqladi).

**Tekshirish (audit-bandi):** darsdagi barcha bayram-chaqiruvlarini sanang
(`AchCelebrate` · `confetti` · `OpeningAct` · `celebrate` · to'liq-ekran overlay).
**Ikkitadan ko'p bo'lsa** (dars-ichi + yakun) — har ortiqchasi asoslanishi shart.
Savol: «bu lahza o'quvchi uchun **birinchi marta**mi?» Yo'q bo'lsa — marosim olib
tashlanadi, o'rniga tasdiq qoladi.

---

## 11-F. 👆 142-QONUN: MAJBURIY HARAKAT KO'RINSIN VA NAVBAT AYTILSIN (2026-08-24, F-0824-01)

**Kelib chiqishi:** `ReactPropsReuseLesson` 8-ekrani. `.btn-soft` sinfida
`background: ${T.bg}` (sahifa fonining AYNAN o'zi) + `border: none` edi — tugma
pikselda oddiy matnga aylangan. O'quvchi faqat ko'rinadigan ikkinchi tugmani bosgan,
birinchisi (ataylab **muvaffaqiyatsiz** bo'ladigan qadam) o'tkazib yuborilgan.
Natija: dars dramaturgiyasi (xato → xulosa → to'g'ri yo'l) yo'qolgan, pastki tugma
esa `disabled` holda «Ikkala usulni sinang» deb turgan — **qaysi biri qolganini
aytmagan**. O'quvchi tiqilib qolgan.

### a) Bosiladigan narsa fondan farq qilishi SHART
Har `<button>` uchun kamida bittasi bo'lsin: **to'ldirilgan rang** · **oq yuza + 1px
ramka** · **ko'rinadigan soya**. Taqiq: `background` sahifa foniga teng VA `border: none`
VA soyasiz — bu uchlik affordansni nolga tushiradi. Ikkilamchi tugma «sokin» bo'lishi
mumkin, lekin **ko'rinmas** bo'lolmaydi.

### b) Navbat ko'rsatkichi — e'tibor faqat KEYINGI qadamda
Ekran 2+ harakatni talab qilsa va `NavNext` shunga bog'lansa:

| Qadam holati | Ko'rinishi |
|---|---|
| Navbat shu qadamda | asosiy (accent) + yengil pulsatsiya (`.btn-turn`) |
| Hali navbat kelmagan | sokin ikkilamchi (`.btn-soft`) |
| Bajarilgan | sokin yashil + ✓ (`.btn-did`), e'tibor tortmaydi |

Naqsh: `className={done1 ? 'btn-soft btn-did' : 'btn btn-turn'}`. Holat tugma-tartibiga
emas, **bajarilganlik holatiga** bog'lanadi — o'quvchi tartibni buzib bossa ham
ko'rsatkich o'zini to'g'rilaydi. Pulsatsiya `prefers-reduced-motion: reduce` da o'chadi,
rang-farq qoladi.

### c) Bloklangan `NavNext` yorlig'i qolgan qadamni ATAB aytadi
❌ «Ikkala usulni sinang» → ✅ «1-usulni sinang» / «2-usulni sinang».
Yorliq — yagona bosilmaydigan element, shuning uchun u **ayblov emas, ko'rsatma**
bo'lishi kerak.

**Tekshirish (audit-bandi):** darsdagi har CSS tugma-sinfini fon rangi bilan solishtiring
(`grep -n "btn-\w*\s*{" <fayl>` → `background` qiymati `T.bg` bo'lsa — buzuq).
So'ng `disabled={!done}` bo'lgan har `NavNext` uchun: yorlig'i qolgan qadamni nomma-nom
aytyaptimi? Yo'q bo'lsa — 142-c buzilgan.

---

## 11-G. 🖥 143-QONUN: MENTOR REJIMIDA BLOK KO'RINSIN, JAVOB DOSKAGA CHIQSIN (2026-08-24, F-0824-02)

**Kelib chiqishi:** `PmLesson9` (m3-10) 9-ekrani. Mentor rejimida `tryPlace` boshida
`if (done || isMentor) return;` turadi — bu **to'g'ri qaror** (topshiriqni o'quvchilar
o'z qurilmasida bajaradi, mentor ekrani — proyektor). Lekin kartalarda `disabled`
atributi yo'q edi: hover ishlaydi, kursor ko'rsatkich, ko'rinishi tirik. Mentor bosadi —
javob yo'q. Xulosa: «dars buzuq». Shu faylning o'zida boshqa hamma joyda
(`:760` test varianti · `:975` ilgak · `:2532` arena plitkasi) mentor-bloki `disabled`
bilan **ko'rinadigan** qilingan — bitta ekran naqshdan chetga chiqib qolgan.

### a) `isMentor` bilan bloklangan har element `disabled` ham bo'lsin
Mantiqiy blok (`if (isMentor) return`) **hech qachon yolg'iz turmaydi**. Uning yonida
doim: `disabled={isMentor}` + sinfda `:disabled` uslubi (kursor, xiralik, hover o'chadi).
Jim qaytadigan `onClick` — bu buzuq mahsulot signali, boshqa emas.

### b) Mentor nima uchun bloklanganini O'QISHI kerak
Vazifa-yorlig'i mentor rejimida almashadi: «✋ Qaysi qadam birinchi bo'ladi?» →
«👀 Bu topshiriqni o'quvchilar bajaradi — siz kuzatasiz». `MentorNote` ichidagi uzun
xatboshi buni **hisobga olmaydi** — u ekranning pastida, blok esa tepada.

### c) Har tekshiruv-ekranida mentorga JAVOBNI OCHISH yo'li bo'lsin
Ekranning ma'nosi ko'pincha oxirgi sinf-muhokamasida. Agar mentor to'g'ri javobni
doskaga chiqara olmasa — muhokama o'tkazib bo'lmaydi. Naqsh tayyor:
`MentorTestStats` → `onReveal` (`.mstats-reveal` tugmasi). Yangi mexanika o'ylab
topilmaydi, shu rels ishlatiladi. Ochilish **qadam-baqadam** bo'lsin (bir zumda emas) —
sinf ketma-ketlikni ko'zi bilan kuzatsin.

### d) Reveal javobni MENTOR nomidan yozmaydi
Ochish `onAnswer` / `live.submitAnswer` ni ishga tushirmasligi shart
(`if (done && !isMentor && …)`) — aks holda mentor statistikasi o'z-o'zini bo'yaydi.

**Tekshirish (audit-bandi):** `grep -n "isMentor" <fayl>` → har `return` li blok uchun
o'sha elementda `disabled` bormi? Keyin: `disabled={!done && !isMentor}` bo'lgan har
tekshiruv-ekranida mentor javobni ocha oladimi? Yo'q bo'lsa — 143-c buzilgan.

---

## 11-H. ⌨️ 144-QONUN: KO'CHIRIB YOZILADIGAN KOD SIG'SIN VA AYNAN KO'RINSIN (2026-08-24, F-0824-06)

**Kelib chiqishi:** `NodeServerLesson` (m4-04) 18-ekrani — VS Code amaliyoti. O'quvchi
oltita bosqichni o'z kompyuteriga **qo'l bilan ko'chiradi**. Uchinchi bosqichdagi kod
karta chegarasidan chiqib ketgan, ustiga `=>` ekranda `⇒` bo'lib chizilgan.

### a) Kod-chipi idishidan chiqmasin
Umumiy chip-sinfida `white-space: nowrap` turadi va bu **qisqa chip uchun to'g'ri** —
`npm install` o'rtasidan uzilmasligi kerak. Lekin chip qatordan uzun bo'lsa, u
**ko'chirilmaydi va idishdan tashqariga chiqadi** (idishda `overflow` cheklovi yo'q).
Uzilish faqat chiplar **orasida** bo'ladi, chipning **ichida** hech qachon.

Ko'chirish-ro'yxatida qoida qayta yoziladi:
```
white-space: pre-wrap;        /* kodning o'z bo'shliqlari saqlanadi, bo'shliqda ko'chadi */
overflow-wrap: break-word;    /* bitta uzluksiz so'z qatordan uzun bo'lsa — himoya to'ri */
```
🔴 `nowrap` ni `normal` ga almashtirish **xato**: kod ichidagi ketma-ket bo'shliqlar
yig'ilib ketadi va tekislash buziladi. Aynan `pre-wrap`.

### b) Ligatura ko'chiriladigan joyda o'chadi
JetBrains Mono `=>` ni bitta `⇒` glifiga qo'shadi. O'qish uchun chiroyli, **ko'chirish
uchun zararli**: o'quvchi klaviaturadan `⇒` ni qidiradi. Ko'chiriladigan har joyda:
```
font-feature-settings: "liga" 0, "calt" 0;
```
Pretsedent tayyor edi: `HtmlCompiler.jsx` klaviatura tugmalarida shu allaqachon qo'yilgan.

### c) Chegara — faqat KO'CHIRILADIGAN kontekst
Test, flashcard va proza ichidagi qisqa chiplarga tegilmaydi: u yerda kod **o'qiladi**,
ko'chirilmaydi; `nowrap` ham, ligatura ham zarar qilmaydi. Shuning uchun qoida umumiy
chip-sinfiga emas, ro'yxat-sinfi bilan **juftlab** yoziladi (`.lp-step .qcode` kabi).

**Tekshirish (audit-bandi):** amaliyot/ko'chirish ro'yxatidagi har chipni sanang —
**45 belgidan uzun** bo'lsa, ustunga sig'ishi ekranda tekshiriladi. Kodda `=>` `->`
`>=` `!==` `===` bo'lsa — ligatura o'chirilganini tasdiqlang.

---

## 11-I. 🧩 145-QONUN: `className` E'LONI BILAN JUFT YURADI (2026-08-24, F-0824-10)

**Kelib chiqishi:** m4c-05 (`AiPipelineProjectLesson`) 7-ekrani. Ikki tugma `vcard` ·
`role-ico` · `vlbl` · `vseen` sinflarini ishlatardi — faylda to'rttasining ham e'loni
**nol** edi. Brauzer standart `<button>` ni chizdi: matn markazda, ichki bo'shliqsiz,
soyasiz, radiussiz; `.vseen { margin-left: auto }` yo'qligi uchun ✓ o'ngga ketmadi.
Foydalanuvchi savoli aynan shu edi: «dizayni shunaqami yoki CSS berilmay qolganmi?»

### a) Sinf ishlatilsa — o'sha faylda e'lon qilinishi SHART
Har dars o'z `<style>` blokini olib yuradi (LMS uchun mustaqil bo'lishi kerak). Demak
boshqa darsdan sinf **meros olinmaydi**: nusxa ko'chirilgan JSX bilan birga uning CSS
bloki ham ko'chirilishi kerak. Aks holda ekran «biroz boshqacha» emas, **bezaksiz**
chiqadi.

### b) Bu JIM buzilish — hech bir darvoza ko'rmaydi
`esbuild` ✓ · `lint:jsx` ✓ · `lint:dark` ✓ · `lint:til` ✓ — hammasi toza, ekran esa
buzuq. Sabab: yo'q sinf JS xatosi emas, u shunchaki hech narsa qilmaydi. Shuning uchun
bu sinf **faqat ko'z bilan** yoki maxsus detektor bilan tutiladi.

### c) Tuzatishda qiymat O'YLAB TOPILMAYDI
Sinf loyihada allaqachon mavjud bo'lsa (`.vcard` — **26 darsda**), qiymatlar **o'sha
modulning** darsidan ko'chiriladi. Yangi dizayn o'ylash — modul ichida ikkinchi xil
ko'rinish yaratadi. m4c-05 uchun manba: `4c-Modull/FullPipelineProjectLesson.jsx`.

**Tekshirish (audit-bandi):** faylning `className` larini yig'ing va `<style>` dagi
e'lonlar bilan solishtiring:
```
className="X" bor · .X e'loni yo'q  →  jim buzilish
```
Bu grep bilan tutiladigan sinf — `lint:jsx` ga ov-bandi bo'ladi (`KATTA_TOZALASH` 28-band).
## 11-J. 👆 146-QONUN: TANLOV VA BOSQICH-NAVIGATSIYA — YOZUVGA O'XSHAMASIN (2026-08-27, F-0827-01/02)

**Kelib chiqishi:** PmLesson2.homework 1-bosqichi. Joy-turi chiplari (`border: none`, sahifa
foni bilan bir xil och fon, belgisiz) oddiy yorliqdek ko'rinardi — o'quvchi ularni bosish
mumkinligini bilmasdi. Yuqoridagi bosqich-chiplar («Joy · Yozish · Tartib · Savollar», 12px,
chegarasiz) esa sarlavha-panelda yo'qolib, 4 bosqichli yo'l ekani sezilmasdi. 11.7 («bosiladigan
joylar ko'rinsin») shu ikki elementga qo'llanmagan edi.

### a) Bittasini tanlaydigan element = TANLOV-KARTA, rang bilan farqlash yetarli emas
Radio-ma'noli chip (joy-turi, variant, rejim) uchun **uch belgi birga** bo'lishi shart:
- **radio-doira** (○ → tanlanganda ●) — «bittasini tanlaysiz» umumjahon belgisi;
- **ko'rinadigan chegara** (`1.5px T.line`, fon `T.paper`, hover'da accent-chegara) — sahifa
  fonidan ajralib turadi;
- **belgi/ikonka** (🍞 🍲 📱 ✂️ ✏️ kabi) — 13 yoshli tez o'qiydi.
Yorliqda ishora: «👆 … bittasini bosing». Semantika: `role="radiogroup"` + `role="radio"`
`aria-checked`. ❌ faqat tanlangani rangli, qolgani fon-rangda tekis yozuv.

### b) Bosqich-navigatsiya = STEPPER, nom emas «N-bosqich»
Ko'p bosqichli vazifada yuqori navigatsiya **raqam-doira + «N-bosqich» yorlig'i** (ru:
«N-этап»), oraliqda **bog'lovchi chiziq** (yo'l ekani ko'rinsin), yakunda «Natija · k/N».
Uch holat aniq farqlanadi: **tugagan** = yashil ✓ (chiziq ham yashil) · **joriy** = accent
to'la fon · **kelgusi** = oq fon, kulrang chegara, raqam. Bosqichning mazmun-nomi (Joy/
Yozish…) chipda emas — ekran sarlavhasida va `title` da. ≤640px da yorliq yashirinadi,
raqam-doira qoladi (Natija yorlig'i qoladi).

**Tekshirish (audit-bandi):** tanlov-chiplarda `.chip { border: none }` yoki fon `T.bg` —
RAD; bosqich-navigatsiyada bosqich nomlari («Joy», «Yozish») — RAD. Namuna:
`src/1-Modull/PmLesson2.homework.jsx` (`.chip/.chip-rd/.chip-ic`, `.hw-step/.hw-num/.hw-ln`).

---

## 11-K. 📐 147-QONUN: MATN USTIGA HECH NARSA TUSHMAYDI, MATN IDISHIDAN CHIQMAYDI (2026-09-12, F-0912-03)

**Kelib chiqishi:** foydalanuvchi sinf kuzatuvi — «ba'zi darslarda so'zlar qisilib qolgan,
yopishib qolgan yoki chiqib ketgan». Ilgari bunday topilma **ko'rilgan darsda** tuzatilardi;
sinf bo'ylab yopilmasdi. O'lchov buni fosh qildi (quyida).

### a) Absolyut boshqaruv o'z burchagini BAND QILADI — kontent u yerga kirmaydi

`.zoom-btn` (⛶) `.zoomable` ning o'ng yuqori burchagida turadi: `top: 6px; right: 6px`,
o'lchami `30x30` — ya'ni o'ngdan **36px** ni egallaydi. Shu burchakka tushadigan qator
**40px** o'ng chekinish oladi (36 + 4px nafas):

```
.zb-gap { padding-right: 40px; }     /* qator SINFDA bo'lsa */
paddingRight: 40                     /* qator `padding` ni INLINE bersa (sinf bekor qilinadi) */
```

🔴 **Inline `padding` qisqartmasi CSS sinfini yutadi.** Qator `style={{ padding: '7px 13px' }}`
bilan yozilgan bo'lsa, `.zb-gap` ishlamaydi — chekinish **o'sha inline obyektga** qo'shiladi
(`paddingRight: 40`). Bu PmLesson2 da tutildi.

🔴 **Chegara: kontent SILJIMAYDI.** Zoomable'ning o'ziga `padding-top` berish ⛶ ga alohida
qator ochadi, lekin butun kontentni pastga suradi — dars bir ekranga sig'ishi shart
(60-qonun), shuning uchun bu yo'l RAD. Joy faqat **to'qnashgan qatorda** ajratiladi.

**Ikki usul — to'qnashgan narsa MATNmi yoki TUGMAmi (F-0912-09, 2-modul auditi):**

| To'qnashgan narsa | Usul | Nega |
|---|---|---|
| **Matn** (`p.body` ishora-qutida) | **float-notch**: `.zb-notch::before { content:''; float:right; width:28px; height:28px; }` | Matn tugmani AYLANIB o'tadi — faqat tugma yonidagi qator qisqaradi, qolganlari to'liq kenglikda qoladi. Kenglik hisobi: idishning o'z o'ng chekinishi 15–16px → 36−16=20px yetishmaydi, 28px nafas bilan |
| **Tugma/chip** (qator-ro'yxatning o'ng chekkasida) | **bir xil o'ng zaxira**: `paddingRight: 40` HAMMA qatorga | Notch tugmaga ta'sir qilmaydi (u oqimdagi matn emas). Zaxira faqat BIRINCHI qatorga berilsa tugmalar qiyshayadi — shuning uchun hammasiga BIRDEK beriladi: ustma-ust tekis qoladi, ⛶ bo'sh yo'lakda o'tiradi |

Qamrov (2026-09-12): m1 — `HtmlPractice` (notch); m2 — `JsVarsLesson` s15 · `JsConditionsLesson` s15 ·
`JsFunctionsLesson` s15 (notch), `JsVarsLesson` s8 · `PracticeLesson3` s3/s12/s15 (zaxira);
m3 — `ReactCrudPracticeLesson` s3 (notch, ikki `sk-info`) · s5/s10 (zaxira, hisoblagich qatori);
m4 — `DataIntroLesson` s3 · `NodeServerLesson` s7 · `RoutingLesson` s8 · `FullstackFeedbackLesson` s2 (zaxira);
m4c — `GithubActionsLesson` s13 (zaxira) · `FullProPipelineLesson` s7/s9 (notch); m5 —
`BotStatefulMemoryLesson` s5/s6 · `BotAiProjectLesson` s7 (notch); m6 — `MobileAppPracticeLesson` s7
(zaxira); m7 — **16 nusxa, 12 fayl** (hisoblagich qatori — butun modulga ko'chirilgan shablon).

🔴 **Hisoblagich qatori — takroriy shablon.** «Sarlavha … N / M topildi» qatori
(`display:flex; justify-content:space-between`) 9 faylda uchraydi va o'ng chekkasi aynan ⛶
tugmasi ostiga tushadi. Repoda 12 nusxa bor, ammo **hammasi emas** — faqat `.zoomable` ning
BIRINCHI qatori bo'lgani to'qnashadi. Shuning uchun sivirma «hammasini tuzat» demaydi:
o'lchangani tuzatiladi, qolgani o'lchovda toza chiqqan (m1 va m3 nusxalari).

🔴 **BIR QUTI — BIR NECHA HOLAT-MATNI: chekinish HAMMASIGA qo'yiladi** (F-0912-09 · ru-sivirma,
2026-09-12). Ishora-qutisi bitta joyda turadi, lekin ichidagi matn holatga qarab almashadi
(`!picked` ipucha · `picked` noto'g'ri tanlov · `found` topildi · `fixed` yakun). O'lchov ekranni
**bitta holatda** tutadi — o'sha holatga notch qo'yilsa, qolganlari **himoyasiz qoladi** va til
almashganda chiqadi.

**Dalil:** `JsFunctionsLesson` s15 — uz-sivirmada ipucha-holati tutilib tuzatilgan edi; ru-sivirmada
esa **boshqa** holat chiqdi: «А ошибка — <b>во внутренней строке</b>» ning **95%** i ⛶ ostida
(1280 va 1366 · self va mentor — to'rttasida ham). Sababi: ruscha jumla uzunroq, shuning uchun
`<b>` boshqa qatorga tushadi. Xuddi shu naqsh `JsConditionsLesson` va `JsVarsLesson` da ham bor edi
— har birida faqat **o'lchov tutgan** holat yopilgan.

✅ Qoida: notch bitta holatga emas, **o'sha qutining hamma holat-matniga** qo'yiladi (uchala
tarmoq: ipucha · noto'g'ri tanlov · topildi). Tekshiruv: `grep -c "zb-notch"` = CSS qoidasi (1) +
holatlar soni. Umumiy sabab: **o'lchov — namuna, kafolat emas**; u qaysi holatni tutgani tasodif,
tuzatish esa qutining o'ziga (hamma holatiga) beriladi.

> **🔴 DARS: «KO'RILGAN JOYDA TUZATISH» — TUZATISH EMAS.** `InternetLesson` da bu nuqson
> allaqachon tuzatilgan edi — ammo `@media (max-width: 560px)` ICHIDA: kimdir uni telefonda
> ko'rgan, o'sha yerda yopgan. 1280px da «Qadam» hisoblagichining **32%** i tugma ostida
> yotardi va hech kim ko'rmagan. Qoida: to'qnashuv **o'lchanadi**, keyin qamrov bo'yicha
> yopiladi — bitta ekranda ko'rilgani bilan yopilmaydi (60-qonun (c) bilan bir xil saboq).

### a-2) MAKET BEZAGI KONTENT USTIGA TUSHMAYDI (F-0912-14, 6-modul auditi)

Telefon maketining «tishchasi», brauzer sarlavha-tasmasi, soat-paneli — bularning hammasi
**bezak**. Bezak maket ICHIDAGI matnni yopsa, o'quvchi o'sha matnni o'qiy olmaydi, ammo hech
qanday darvoza buni ko'rmaydi (CSS to'g'ri, JSX to'g'ri).

**Dalil.** `MobileAppPracticeLesson` s0 — `.phone-notch` (`position:absolute; top:9px;
62x15px`) `y 9..24` ni egallaydi; telefon ekrani esa ramkaning 9px chekinishidan, ya'ni
`y 9` dan boshlanadi. Natijada soxta brauzer manzili «🔒 mini-dokon.uz» ning **32%** i
tishcha ostida qolgan.

🔴 **Oila bilan solishtirish — eng tez tekshiruv.** Repoda `.phone-notch` to'qqiz darsda bor:
sakkiztasida u **52x5 yoki 34x5 tasma** (ramka chekinishiga sig'adi), bittasida — 62x15
ekranga tushadigan «tishcha». Ya'ni nomzod nuqson **oiladan chiqib turgani** bilan bilinadi.
Qoida: bir xil nomli bezak darslararo bir xil o'lchamda bo'ladi; farq qilsa — sabab so'raladi.

✅ Yechim: bezak **ramka chekinishi ichida** joylashtiriladi (`top: 2px; height: 5px`),
kontent surilmaydi (60-qonun: dars bitta ekranga sig'ishi shart).

### b) Proporsional kenglikdagi kartada MATN turmaydi

`PmLesson3` vaqt-lentasida karta kengligi vaqtga proporsional (`flex: b.sec`) — eng qisqa
bo'lak 20 soniya, ya'ni ~36px matn joyi. «Keyingi qadam» u yerga hech qachon sig'maydi;
`overflow: hidden` uni kesardi va o'quvchi 6 ta bo'limdan 5 tasining nomini o'qiy olmasdi
(uz va ru — ikkalasida ham, ya'ni til masalasi EMAS).

✅ Qoida: **o'lchami ma'lumotga bog'liq idishga matn qo'yilmaydi.** Idishda faqat o'lcham-
signali qoladi (rangli chiziq, raqam), nomlar esa **tashqaridagi ro'yxatda** — kengligi
matnga qarab o'lchanadi va sig'masa keyingi qatorga o'tadi. Faol holat ikkala joyda ham
ko'rsatiladi (`.tl-seg.now` karta halqasi + `.tl-key.now` nuqta va rang).

🔴 `text-overflow: ellipsis` — **yechim emas, niqob.** U matnni «chiroyli» kesadi, lekin
o'quvchi baribir o'qiy olmaydi. Ataylab qisqartirish faqat **takrorlanadigan/ikkinchi darajali**
ma'lumotga ruxsat (masalan `title` tooltip + nusxalash tugmasi bor URL — `HtmlTakrorlashLesson`
dagi `.img-url`). Nom, sarlavha, topshiriq matni — hech qachon.

### c) Tekshirish — KO'Z bilan emas, O'LCHOV bilan

Bu sinf grep bilan tutilmaydi: CSS to'g'ri, JSX to'g'ri, hamma darvoza toza — buzilish faqat
**chizilgandan keyin** ko'rinadi. Shuning uchun o'lchov brauzerda yuritiladi (`_clip-audit.mjs`
avlodi): har dars, har ekran, `uz`/`ru` x `self`/`mentor`. To'rt detektor:

| | Nimani o'lchaydi |
|---|---|
| A | vertikal qirqilish — `overflow: hidden` idishda oqimdagi matn tubidan oshgan |
| B | blok ustma-ust — ikki quti IKKALA o'q bo'yicha kesishgan (bir qatordagi inline'lar EMAS) |
| C | matn qutisidan chiqqan — matn tugunlari `Range` bilan o'lchanadi, `scrollWidth` EMAS |
| D | boshqaruv matn ustida — absolyut qatlam matnning >8% ini yopgan |

🔴 **Kalibrovka majburiy (yolg'on signalsiz ro'yxatgina ishlatiladi):** shaffof qatlam
(halqa-konturi, ulanish chizig'ini chizadigan `svg`) matnni yopa OLMAYDI — sanalmaydi;
ekranning yarmidan ko'pini yopadigan modal (nishon-bayrami) ataylab yopadi — sanalmaydi;
`backface-visibility: hidden` yuz (flashcard orqasi) — sanalmaydi. Kalibrovkasiz `m1-01`
bitta darsda **30 ta** yolg'on signal berardi.

🔴 **Kalibrovka-2 (F-0912-09, 2-modul auditi) — GEOMETRIYANING O'ZI yolg'on gapiradi:**

| Qoida | Nega | Dalil |
|---|---|---|
| **Burilgan element o'lchanmaydi** (B, C, D detektorlari; ota-element ham sanaladi) | `getBoundingClientRect()` doim O'QQA PARALLEL to'rtburchak qaytaradi — element burilgan bo'lsa bu to'rtburchak haqiqiy egallagan joyidan katta, burchaklari qo'shnisiga kirib turadi. Ya'ni «ustma-ust» geometriyadan chiqadi, ekranda hech narsa buzilmagan | `m2-07` s5/s8 — `.tz-beam` qiyaladigan tarozi (`rotate(±4deg)`) qo'shni kartaga 8px kiradi; `m2-09` s5/s12/s15 — «SAYT» sarlavhasi `rotate(1.4deg)`, bu ATAYLAB qiyshiq qoralama, sabog'ning o'zi |
| **Ko'p qatorga o'ralgan inline element o'lchanmaydi** (C detektori) | O'ralgan inline uchun `getBoundingClientRect()` qator-bo'laklarning BIRLASHMASINI beradi; gorizontal `padding` esa faqat BIRINCHI bo'lakning chapiga va OXIRGI bo'lakning o'ngiga qo'yiladi. Paddingni birlashmadan ayirish — padding yo'q chekkadan ham ayirish — aynan padding qiymaticha soxta «chiqish» beradi | `m2-09` s3 — `<span>` «tugma va kartalar», ikki qator, `padding: 0 5px` → `over = 5` |

Xavfsizlik: o'ralgan matn ta'rifiga ko'ra o'z birlashma-qutisidan chiqa OLMAYDI (o'ralgan bo'lsa —
demak sig'gan), shuning uchun bu qoida haqiqiy nuqsonni yashirmaydi. Aniqlash: 2D matritsa
`matrix(a,b,c,d,e,f)` da sof siljish/masshtabda `b` va `c` NOL; burilish yoki qiyshaytirish
ularni noldan chiqaradi (`matrix3d` da 2- va 5-o'rinda).

🔴 **Kalibrovka-3 (F-0912-10, 3-modul auditi) — ATAYLAB QO'YILGAN NARSA NUQSON EMAS:**

| Qoida | Nega | Dalil |
|---|---|---|
| **Bitta grid katakchasi — sanalmaydi** (B detektori) | `grid-area: 1 / 1` — muallif ikkovini ONGLI ravishda bir katakka qo'ygan: biri so'nadi, ikkinchisi qoladi. Geometriya esa «kesishdi» deydi | `m3-02` s1 — `silo-lbl` (so'nuvchi yorliq) `silo-fill` ustida, 11–14px |
| **Manfiy chekinish bilan ulangan shakl — sanalmaydi** (B, kesishuv ≤ 3px) | `margin-top: -2px` ikki bo'lakni ataylab YOPISHTIRADI (voronka tanasi + nayi). 2px hech qanday matnni yemaydi | `m3-03` s8/s9/s11/s13 · `m3-06` s2…s11 — `cm-body`/`cm-chute`, `cf-body`/`cf-chute` |
| **Idishning O'Z pardasi — sanalmaydi** (D detektori, ≥ 92%) | Qatlam o'z idishini deyarli to'liq yopsa — bu HOLAT-pardasi: yuklanish («sahifa qayta yuklanmoqda» — darsning sabog'i) yoki rentgen qatlami. Ostidagi matn yopilgani — o'sha holatning MA'NOSI. Tasodifiy qoplama (⛶) idishning burchagini egallaydi, 92% ini emas | `m3-01` s11 — `reload-cover` postni 100% yopadi · `m3-06` s0 — `xray-ov` kartani 100% yopadi |

> **🔴 DARS: «TOZA» HUKMI NECHTA EKRAN KO'RILGANIGA BOG'LIQ.** `m3-05` (PmLesson8) auditda
> **bitta** ekran bilan «toza» chiqqan edi: dars «Darsga qo'shilish» darvozasi bilan ochiladi,
> audit uni `_lessonids.txt` dagi id bilan o'tadi — o'sha ro'yxat esa **qo'lda** yuritiladi va
> `pm-m3d5-v1` unga tushmay qolgan. Ya'ni 17 ekranlik dars **1 ekrani** bilan baholangan.
> Yechim: ro'yxat endi **manbadan ham** to'ldiriladi (`lessonId: '...'` grep, `eski` papkalarsiz) —
> yangi dars qo'shilsa o'zi kiradi. Umumiy qoida: **hisobotdagi ⚠ ogohlantirish «toza» dan
> kuchliroq** — ekran soni kutilganidan kam bo'lsa, hukm emas, tergov boshlanadi.

🔴 **Kalibrovka-4 (F-0912-11, 4-modul auditi):**

| Qoida | Nega | Dalil |
|---|---|---|
| **Chetdan chiqadigan PANEL — sanalmaydi** (D detektori: idishning butun bo'yiga/eniga cho'zilgan va yarmidan ko'pini egallagan qatlam) | Yon menyu ataylab ostidagini yopadi — ochilishining MA'NOSI shu. Tasodifiy qoplama esa ikkala o'lchamda kichik: burchakni egallaydi, butun qirrani emas | `m4-14` s9 — telefon maketidagi `drawer` (`top:0; height:100%; width:82%`) tablo raqamlarini 100% yopadi |
| **So'nib ketayotgan element o'lchanmaydi** (B detektori, `opacity < 0.35`) | Animatsiya `both` bilan tugagach element OXIRGI kadrda qotadi. «Xafa mijoz» 26px chetga suriladi va 0,25 shaffoflikka tushadi — ya'ni KETYAPTI. Qo'shnisi bilan kesishuvi — sahnaning o'zi | `m4-04` s2 — `store-cust.cust-sad` / `store-cust`, 22px |

🔴 **Kalibrovka-5 (F-0912-16, 7-modul auditi) — BURILISH QOIDASI A DETEKTORIGA HAM TEGISHLI.**
Kalibrovka-2 burilgan elementni B, C, D dan chiqargan edi; A (qirqilish) esa chetda qolgan va
o'sha yolg'onni qaytadan berdi. Dalil: `m7-01` s0 — «QABUL QILINDINGIZ» muhri `rotate(-8deg)`,
chegara-qutisi **166px** (haqiqiy balandligi ~45px) va «16px qirqildi» degan hukm chiqardi.
Skrinshot bilan tekshirildi: muhr **to'liq ko'rinadi**. Umumiy saboq: kalibrovka qoidasi
**bitta detektorga emas, sababga** bog'lanadi — sabab («o'qqa parallel quti burilgan elementda
yolg'on») to'rttasiga ham tegishli.

🔴 **Kalibrovkani o'zgartirgach — `--selftest` MAJBURIY.** Yangi «sanalmaydi» qoidasi
detektorni jimgina o'ldirishi mumkin, natija esa «toza» bo'lib ko'rinaveradi. Selftest ataylab
toshiruvchi CSS kiritadi va topilma sonini qaytaradi — u o'zgarmasa, detektor tirik.

🔴 **Determinizm — ANIMATSIYA IKKI XIL:** kirish-animatsiyasi (`fade-up` — translateY)
tugamasdan o'lchansa blok o'z joyida bo'lmaydi va yolg'on ustma-ust chiqadi
(`pre.code-box.fade-up / div.frame-dash` ikki yurgizishdan faqat bittasida chiqqan edi).
Shuning uchun:
- **CHEKLI** animatsiya (`iterations !== Infinity`) — OXIRIGACHA kutiladi. Qat'iy shift
  qo'yish XATO: `ip-typing` (0,9 s, kechikish bilan boshlanadi) 900 ms da hali kenglik `0`
  beradi va **+144px yolg'on toshish** chiqadi (m1-01 s7 da o'lchandi: 900 ms → kenglik 0;
  2000 ms → 168px, toshish yo'q).
- **CHEKSIZ** animatsiya (`infinite`) — kutilmaydi, chunki hech qachon tugamaydi; ammo
  u bilan yuruvchi element **umuman o'lchanmaydi**: harakatdagi bezakning qo'shnisi bilan
  kesishuvi layout nuqsoni EMAS. Dalil: `.dc-arrow` (`dc-flow`, 0,85 s infinite) qo'shni
  `.dc-dns` chipi ustidan o'tadi — o'lchov qaysi lahzada tushishiga qarab goh chiqadi,
  goh chiqmaydi. Ota-element ham sanaladi (undagi transform bolalarini qimirlatadi).

🔴 **CHIZILISH TARTIBI — `z-index` ni solishtirish YETMAYDI.** Ikki qatlamning `z-index` i
teng bo'lsa (ikkalasi ham `auto`), DOM'da **KEYIN** turgani ustida chiziladi. Buni hisobga
olmaslik butun bir o'yinni «nuqson» deb ko'rsatadi: dinozavr o'yinida `.rg-sky` (fon,
`absolute; inset:0`) geometrik jihatdan 🍖 ustida turadi, lekin DOM'da undan OLDIN keladi —
demak fon pastda, sprayt ko'rinadi. Solishtirish matnning eng yaqin **pozitsiyalangan otasi**
bo'yicha yuritiladi (pozitsiyasiz kontent har doim pastda).

🔴 **INTERAKTIV HOLATLAR o'lchovga KIRADI.** Foydalanuvchi shikoyati aynan «xato
TO'G'RILANGANDAN keyin bloklar ustma-ust» edi — bu holat bosilgandan keyin paydo bo'ladi va
boshlang'ich o'lchovda UMUMAN ko'rinmaydi. Har ekran ochilgach bosiladigan elementlar
ketma-ket bosiladi va har bosishdan keyin qayta o'lchanadi (to'xtash: element qolmadi ·
ekran almashdi · kompilyator ochildi). ⚠️ Bosish soni **0** bo'lsa hisobot ogohlantiradi —
aks holda «toza» hukmi yarim bo'lib qoladi va buni hech kim sezmaydi.

🔴 **BIR NECHTA EKRAN O'LCHAMI.** Dars `--lz` bilan masshtablanadi, ya'ni layout har
o'lchamda boshqacha. Standart: `1280x773` (sinf kompyuteri) va `1366x768` (arzon noutbuk).

🔴 **O'lchov o'zini sinaydi:** `--selftest` ataylab toshiruvchi CSS kiritadi; detektor uni
TUTMASA, «toza» hukmiga ishonilmaydi. Asbob o'lik bo'lib qolishi mumkin — masalan ekranlar
soni `N / M` ning BIRINCHI mosligidan olinardi va nishon-hisoblagichi (`🏅 0/4`) o'qilib,
18 ekranlik dars **4 ekrani** bilan «toza» deb baholanardi.

### d) SUZUVCHI QATLAM (`position: fixed`) tushadigan YO'LAK o'lchanadi (F-0912-06, 2026-09-12)

Burchakdagi tugma bitta darsning ichida yashaydi; **suzuvchi qatlam esa bitta fayldan
turib 109 darsning ustiga tushadi**. Shuning uchun uning balandligi «chiroyli ko'ringani
uchun» emas, **u tushadigan yo'lakning o'lchovi bo'yicha** tanlanadi.

**Dalil.** Jonli-dars lavhasi (`.live-badge`, `src/live/LiveUI.jsx`) `top: 10` + balandligi
36 edi, ya'ni `y 10..46` ni egallardi. Dars sarlavhasi (`div.chrome > .eyebrow`) esa **har
darsda, har ekran o'lchamida aynan `y 34..51`** da turadi (m1/m2/m4 · 1280 · 1366 · 1024 da
o'lchandi — tasma `--lz` bilan masshtablanmaydi, raqam o'zgarmaydi). Ikkisi **12 px ni
bo'lishib** olardi: ruscha uzun sarlavha lavha ostida qolardi.

🔴 **Kichik ekran — yomonroq, teskari emas.** Lavha markazda: 1280 da `x 492` dan,
**1024 da `x 361`** dan boshlanadi, sarlavha esa doim chapdan boshlanadi. Ya'ni ekran
kichraygani sari to'qnashuv **ko'payadi** — o'quvchining kichik noutbuki eng yomon holat.
Bitta katta ekranda ko'rib «toza» deyish mumkin emas.

**Qoida:**
1. Suzuvchi qatlamning `top` + balandligi yig'indisi u tushadigan birinchi matn qatorining
   yuqori chetidan **kichik** bo'lsin (zaxira ≥ 3 px). O'lchov brauzerda olinadi.
2. Balandlik **ichki chekinishdan** qisqartiriladi, **boshqaruv o'lchamidan emas** — tugma
   22 px bo'lib qolsin (bosish qulayligi 147-qonun hisobiga yo'qotilmaydi).
3. Yo'lakda matnsiz element ham bo'lishi mumkin (progress-chizig'i `y 18..21`) — u
   `innerText` bilan izlanmaydi, shuning uchun yo'lak **hamma element** bo'yicha ko'riladi.
4. Kontentni pastga surib joy ochish **RAD** — sahifa balandligi aynan ekranga teng
   (`scrollHeight == viewport`), surilsa pastdagi tugma qirqiladi (60-qonun).

### e) JAVOBDAN KEYINGI HOLAT HAM PASTKI CHIZIQQA SIG'ADI (F-0913-02, 2026-09-13)

Ekran boshlang'ich holatda sig'ishi **yetmaydi**: izoh qutisi, «📖 Qisqa takrorlash» tugmasi,
ochilgan qadam — hammasi BOSILGANDAN keyin qo'shiladi va aynan shular navigatsiya chizig'i
ostiga tushadi. O'quvchi buni «pastda qirqilib qolgan» deb ko'radi.

**Dalil (GitHub darslari):**

| Ekran | Nima qirqilardi | Qancha |
|---|---|---|
| m4c-03 s18 (debugging) | xato javobda izoh + takrorlash tugmasi | 7–29 px |
| m4c-03 s17 (markaziy) | `ci.yml` va «🚀 Lentaga qo'ying» — **boshlang'ich holatda ham** | 140–158 px |
| m1-09 s13 (amaliyot) | 5-qadam matni + 🛟 zaxira-panel butunlay | 56–94 px |

**Yechim naqshlari (qo'llangan):**
1. **Bo'sh ustunga ko'chirish** — ikki ustunli ekranda bir ustun toshsa, ikkinchisida odatda
   150–240 px bo'sh joy bor. Izoh o'zi haqida gapirgan artefakt OSTIGA qo'yiladi (s18: jurnal
   haqidagi izoh jurnal ostida, telefon o'rnida), yuborish tugmasi natija ustiga (s17).
2. **Kutayotgan qadam ixcham, faol qadam to'liq** — yopiq/bajarilgan qatorning ichki
   chekinishi kichrayadi, faol qadam o'z o'lchamida qoladi (m1-09 s13). Faol qadam 1→N
   siljiganda HAR holat alohida o'lchanadi — eng baland holat ko'pincha o'rtada (yordam
   qatori bor qadam).
3. 🔴 **RAD:** shriftni kichraytirib sig'dirish (o'qilish yo'qoladi) va «baribir skroll bor»
   deb qoldirish (60-qonun). Istisno faqat `.h-title` uchun — 150-qonun (11-N): 36px, pastki chegara 34px.

**O'lchov (brauzerda) — uch yolg'on joy, uchalasi shu seansda tutildi:**
- `scrollHeight − clientHeight` pastki chekinishni (`padding-bottom`) to'liq qo'shmaydi —
  «−34 px» tuzatmasi noto'g'ri chiqdi. To'g'ri o'lchov: ustunlarning `getBoundingClientRect().bottom`
  minus `.stage-content` pastki cheti.
- Yopiq `<details>` tanasi (`.dsx-fb-body`) koordinatada 265 px pastda turadi, lekin ko'rinmaydi —
  ota-qirqishni hisobga olmagan o'lchov yolg'on «qirqilgan» beradi.
- `scrollWidth > clientWidth` butun pikselga yumaloqlanadi: 0,47 px toshish «0» chiqadi, ekranda
  esa uch nuqta turadi (m3-06 «Brookhav…»). Matn eni `Range` bilan o'lchanadi.

🔴 **ASBOBNING KO'R NUQTASI (halol qayd).** `layout-lint.mjs` 109 darsni «toza» degan, lekin bu
sinfni ko'rmagan, chunki: (1) har o'lchovdan oldin skrollni `0` ga qaytaradi va `.stage-content`
toshishini tekshirmaydi; (2) har ekranda **birinchi** bosiladigan elementni bosadi — test
ekranida bu ko'pincha to'g'ri javob, ya'ni **xato javob holati hech qachon o'lchanmagan**.
Butun kurs bo'yicha sivirma: `KATTA_TOZALASH.md` §34.

**Asbob yopildi (2026-09-13, §34):** `layout-lint.mjs` ga **E-detektor** (`.screen` ichidagi eng
pastki ko'rinadigan element − `.stage-content` pastki cheti, ota-qirqish va yopiq `<details>`
hisobga olinadi) + test ekranida **2–4-variant ham** ekran qayta ochilib bosiladi. Hisobotda
uch bo'lim: **haqiqiy** (chiqish kodini yiqitadi) · **o'quvchi ochgan panel** · **yakun ekrani**.
Kalibrovka isboti: tahrirdan oldingi GitHub nusxasida s13/s17/s18 (v1–v3 — xato javob) ushlandi,
tuzatilgan nusxada haqiqiy bo'lim bo'sh; `--selftest` sarlavhani 900px cho'zadi — 13 ekranda ushlandi.
🔴 **Kalibrovka-6 — ochilgan akkordeon yopiladi.** Asbob `<summary>` ni bosib panelni ochsa,
o'lchovdan keyin qayta yopadi: aks holda bitta ochiq panel keyingi hamma holatni «pastga tushgan»
qilib, haqiqiy nuqsonni yashiradi (m1-09 s3: 5 holat «253px» — sababi bitta ochiq 🛟 panel).
🔴 **Kalibrovka-7 — chiziqni faqat ko'rinadigan narsa belgilaydi.** Eng pastki element sifatida
faqat o'z matni, rasm/maydon/tugma, fon, chegara yoki soyasi borlar olinadi; bo'sh o'rovchi `div`
va shaffof (`opacity: 0`) ota ichidagilar sanalmaydi. Dalil: m1-05 s7 — ekranda hammasi sig'adi,
asbob esa `min-height` li 298px bo'sh `div` ni «pastga tushgan» degan.
🔴 **KO'R NUQTA — NAVIGATSIYA JIM YIQILADI (m2-05).** Asbob ekranlar sonini «eng katta N / M
maxraji»dan olardi. m2-05 1-ekranida «0 / 30» xabar-hisoblagichi bor → `total: 30` yozildi;
`progRead` esa `p.total !== TOTAL_SCREENS` bo'lsa yozuvni **jimgina rad etadi** va dars 1-ekrandan
ochiladi. Natija: 19 ekranlik dars 19 marta **bitta ekran** bilan o'lchangan, xato ham chiqmagan.
Tuzatish: ekranlar soni ikki xonali ekran-hisoblagichidan («01 / 19», 109 darsdan 108 tasida bor)
olinadi; har ekranga o'tgach hisoblagich tekshiriladi — mos kelmasa `NAV:` ogohlantirishi yoziladi.
Umumiy saboq (m3-05 dan keyin ikkinchi marta): **asbob o'lchagan ekran — so'ralgan ekranmi,
buni har safar TASDIQLASH shart; «xato chiqmadi» — «to'g'ri o'lchandi» degani emas.**

**Yonma-yon topilgan eski nuqson (F-0913-03):** `GitLesson` terminal-maketi `.term*` sinflari
bilan yozilgan, lakin fayl ichida uslubi YO'Q edi — uch ekranda qatorlar yopishgan oddiy matn
bo'lib chiqardi (HEAD da ham shunday). Tekshiruv: `className="term"` ishlatgan har fayl
`.term {` qoidasini ham saqlashi shart — kursda 21 fayl, hozir hammasi toza.

🔴 **Kalibrovka-8 — yig'ilgan Mentor = o'quvchi ochgan panel (§34 pilot m4a-03, 2026-09-14).** Asbob har
ekranda bosiladigan elementlarni yurib chiqadi; yig'ilgan `DIV.mentor.is-collapsed` ham «bosiladigan»
bo'lgani uchun uni qayta ochib, so'ng «pastga tushgan» deb o'lchardi (ru s13: «84px», yig'ilgan holatda
haqiqiy qoldiq 36px). Qoida: Mentorni ochish — o'quvchi ochgan panel, ekran boshiga bir marta
(`body.dataset.ccMentorDone`), «haqiqiy» bo'limga kirmaydi.
Saboq: birinchi kalibrovka **yolg'on-toza** berdi — yig'ilganda React yangi «▾» tugunini chizadi, u qayta
tanlanib asbob haqiqiy tugmalarga yetmagan («7 holat» birdan yo'qolgan). Shuning uchun har kalibrovkadan
keyin bosish tartibi probe bilan tekshiriladi (`probe_mentor.mjs`); «xato chiqmadi» — «to'g'ri o'lchandi» degani emas.

🔴 **Kalibrovka-9 — ko'rinmas matn D-detektordan chiqariladi.** Ota `opacity: 0` bo'lgan yoki nol balandlikda
qirqilgan matn ustiga boshqa element tushsa, bu «yopib qo'yish» emas — o'quvchi o'sha matnni baribir ko'rmaydi.
Dalil: m4a-03 s10 — yig'ilgan Mentor matni ustida agent tugmasi «61% yopdi», skrinshotda matn yo'q.

🔴 **Ko'r nuqta (ochiq, halol qayd):** asbob faqat yangi ochilgan ekranni o'lchaydi. Bajarilgan ekranga
«Orqaga» bilan qaytilganda ekran boshlang'ich emas, javobdan keyingi holatda chiziladi — bu holat
o'lchanmagan (m4a-03 ru s13 268px · s6 96px · s10 80px). Yopilishi: asbobga «orqaga-yurish» rejimi.

Eslatma: 148-qonun bilan (quyida) Mentor kompyuterda ochiq — Kalibrovka-8 endi faqat tor ekran va
7-modul o'lchovida ishga tushadi, lekin o'z kuchida qoladi.

## 11-L. 🧑‍🏫 148-QONUN: MENTOR KOMPYUTERDA OCHIQ TURADI — JOY YETMASA JOYLASHUV O'ZGARADI, MENTOR EMAS (2026-09-14, F-0914-08)

**Kelib chiqishi:** §34 pilotida (m4a-03) joy tanqisligi Mentor qatorini «kompyuterda ham birinchi bosishda
yig'iladi» (`collapseOn = !mentorStatic`) qilib yopilgan, keyin 110 darsga yoyilgan edi. Foydalanuvchi
darsni o'zi ko'rib qaytardi: «desktopda Mentor yig'ilmasin, mobileda mumkin» (F-0914-08). 7-moduldan
tashqari 98 dars qaytarildi; InternetLesson/PracticeLesson2 ning eski «faqat ayrim ekranlarda» istisnosi
ham olib tashlandi («desktopda yig'ilishi shart emas»).

**Qoida:**
1. Kompyuter kengligida Mentor qatori **ochiq** turadi. Yig'ilish faqat tor ekranda:
   ```
   collapseOn = isNarrow && !mentorStatic
   ```
   Bu qator kursda bir xil — **96 fayl**; InternetLesson (`mentorCollapse`) va PracticeLesson2 (`mentorCollapsible`)
   o'z nomi bilan, mazmuni shu (jami 98). **7-modul (12 fayl, `collapseOn = !mentorStatic`) hali qayta yig'iladi —
   hozir unga e'tibor berilmaydi** (foydalanuvchi, 2026-09-14); qayta yig'ilganda shu qonun bilan quriladi.
2. Ekran sig'masa — **147 (e) naqshlari** bilan yopiladi: bo'sh ustunga ko'chirish · kutayotgan qadam ixcham,
   faol qadam to'liq · uzun kod `CodeFile maxH` (ichki skroll) · takror izoh bitta qutida · bekatlar bir
   qatorda (grid) · agent-karta `<details>` ga. **Mentorni yig'ish — yechim sifatida RAD.**
3. RAD (avvalgidek): shrift kichraytirish · «baribir skroll bor» (60-qonun). `.h-title` uchun yagona istisno —
   150-qonun (11-N): 36px + harf orasi −0.015em + `balance`, pastki chegara 34px, matn so'roqsiz o'zgarmaydi (2026-09-15).
4. Mentor MATNI uzunligi 109-qonun (TMI) va PM_Prompt (400 belgi) bilan chegaralangan — joy tanqisligida
   avval matn ortiqchaligi tekshiriladi, quti emas.

**Nega:** Mentor — darsdagi o'qituvchi ovozi (5.8: vazifani Mentor beradi). Yig'ilgan qator
kompyuterda «bosilmasa ko'rinmaydigan» matn, holbuki joy bor. Tor ekranda esa ko'rinish uchun yig'ilish qoladi.

**O'lchov bilan bog'liqlik (ongli qaror):** Mentor ochiq bo'lgani uchun §34 pilotida yopilgan sig'maslik
holatlari qaytishi mumkin; kurs qayta o'lchovi (sweep34c, self × 1366, uz → ru) shu qoida bilan yuritildi,
qaytgan holatlar joylashuv bilan yopiladi (KATTA §34).

**Tekshiruv (2026-09-14, tasdiqlangan):** `grep -rl "collapseOn = isNarrow && !mentorStatic" src` = 96 fayl;
`grep -rl "collapseOn = !mentorStatic" src` = 12 fayl, hammasi `7-Modull/`; InternetLesson/PracticeLesson2 alohida ko'riladi.

## 11-M. ✍️ 149-QONUN: JONLI SINFDA DARS-ICHI MASHQ MENTOR «TIRIKLIK» BELGISIGA BOG'LANMAYDI (2026-09-15, F-0914-11)

**Kelib chiqishi:** texnik darsda 20 o'quvchidan 1 tasida praktika ochilmasdan keyingi sahifaga o'tildi. Lavha
«Mentor N/18», kirish LMS'dan. Sabab: `next()` mashqni faqat `mentorAlive` rost bo'lganda ochardi (2026-07-29 qoidasi:
«mentor uzilsa mashq OCHILMAYDI»). `mentorAlive` = o'quvchi mijozi mentor qatorining `updated_at` o'zgarishini oxirgi
180 s ichida ko'rganmi. Mentor kompyuteri uxlasa, tab bo'g'ilsa yoki Wi-Fi uzilsa, o'sha oynada «Davom etish» bosgan
o'quvchida mashq **jimgina** tashlab ketilardi. Lahzani serverdan tiklab bo'lmadi (so'rov-log o'chiq, tarix yo'q).

**Qoida:**
1. Dars-ichi mashq (`PRACTICE_AFTER`) jonli sinfdagi o'quvchida **sessiya tugamagan ekan** ochiladi:
   `live.mode === 'student' && live.status !== 'ended'`. `live.mentorAlive` bu shartga **kirmaydi**.
2. Mashqsiz o'tish faqat ikki holatda: mentor «Erkin qilish»ni bosgan (`status === 'ended'`) yoki o'quvchi jonli
   sinfda emas (self/solo/review) — ular uchun mashq yakun-sahifadagi «Uyga vazifa» orqali.
3. `mentorAlive` faqat **yumshatish** uchun ishlatiladi (darvoza-qulf, `freeRide`, flashcard yashirish, javob ochish):
   mentor yo'q bo'lsa o'quvchi erkinroq bo'ladi, lekin hech narsa **olib tashlanmaydi**.
4. Server mentor-jimlikni o'zi yozadi: `live_mentor_gaps` (migratsiya `0008`) — `updated_at` 180 s dan ko'p sakrasa
   bitta satr (pin, dars, boshlanish/tugash, ekran, `mentor`/`session_end`). Klient chegarasi `LIVE_STALE_MS` o'zgarsa —
   yangi migratsiya.

**Nega:** o'quvchi sinfda o'tiribdi, mentor bir necha daqiqaga uzildi — bu o'quvchining aybi emas. Mashqni tashlab
ketish uni boshqalardan orqada qoldiradi va mentor buni ko'rmaydi. Ochilgan mashq esa mentor qaytganda panelga
«tugatdi» signalini baribir yuboradi (`PRACTICE_DONE_BASE + ekran`).

**Tekshiruv (2026-09-15, tasdiqlangan):**
`grep -rn "status !== 'ended' && live.mentorAlive)))) { advance" src --include='*.jsx'` = **0** ·
`grep -rn "inLiveClass = .*mentorAlive" src --include='*.jsx'` = **0** ·
`grep -rl "F-0914-11 (2026-09-15)" src --include='*.jsx'` = **14** (Htmllesson1 · Htmllesson2 · CssLesson1/2 · CssPractice ·
HtmlPractice · HtmlTakrorlash · VsCode · JsVars · JsConditions · JsLoops · JsFunctions · PeanStack · PracticeLesson1).
Yangi dars quriladigan bo'lsa, `next()` shu 14 darsdagi shakl bilan yoziladi.

## 11-N. 🔠 150-QONUN: SARLAVHA — 36px, ZICH HARF ORASI, TENG BO'LINISH; MATN SO'ROQSIZ O'ZGARMAYDI (2026-09-15, F-0915-01)

**Kelib chiqishi:** §34 3-C skrinshotlarida foydalanuvchi sarlavhaning oxirgi so'zi yoki 🏆 ikkinchi qatorga yolg'iz
tushganini ko'rsatdi (m1-14 s14 «Chempionlar» sahifasi tayyor! 🏆). Sabab: 38px shriftda sarlavhaga ajratilgan joy
matndan atigi 1–16 px kichik; 74 darsda h1 ga qo'lda `style={{ maxWidth: N }}` (760–1000 px) joyni yana toraytirgan.
Foydalanuvchi qarori: **sarlavha matni so'roqsiz o'zgartirilmaydi**; shrift me'yorida kichraysa bo'ladi, juda kichraymasin.

**O'lchov — oldin** (7-modulsiz 96 dars · self × 1366 · javobsiz va javobli holat · noyob sarlavha 1457):
| | uz | ru |
|---|---|---|
| ikki+ qatorli | 112 | 242 |
| `maxWidth` olinsa bir qatorga qaytadi | 13 | 16 |
| + harf orasi −0.015em | 28 | 34 |
| + 36px | 52 | 83 |
| + 34px | 65 | 124 |
| joydan > 12% uzun (tabiiy ikki qator) | 49 | 123 |
(+ m3-11 alohida: uz 1 · ru 3 — asbob darvozasi `.lesson-root` dan tashqarida chizilgani uchun qayta o'lchandi.)

**Qoida:**
1. 38px oilasidagi sarlavha: `.h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }`.
2. `.h-title` ga inline `maxWidth` qo'yilmaydi — kenglikni `.screen` / `.head` belgilaydi.
3. **Pastki chegara 34px.** Tanlangan qiymat 36px (−5%, ko'zga deyarli sezilmaydi). 34px RAD: ru'da yana 41 ta sarlavhani
   bir qatorga qaytarardi, lekin kursdagi 1457 sarlavhaning hammasi 10% kichrayardi («juda kichraymasin» sharti).
4. Bir qatorga sig'maydigan sarlavha ikki **teng** qatorga bo'linadi (`balance`) — oxirgi qatorda yolg'iz so'z yoki emoji qolmaydi.
5. Sarlavha **matni** sig'dirish uchun o'zgartirilmaydi — faqat foydalanuvchi roziligi bilan.
6. 147-qonundagi va 148 (3) dagi «shriftni kichraytirib sig'dirish — RAD» oddiy matn uchun o'z kuchida qoladi;
   `.h-title` uchun yagona istisno — shu qonundagi 36px.
7. Qamrovdan tashqari: 7-modul (hali qayta yig'iladi) · PM 26px oilasi `clamp(20px,2.6vw,26px)` va `.h-title.h-center`
   (32px, `balance` allaqachon bor) · `src/eski`, demo papkalari.

**Nega:** sarlavha — ekranning birinchi o'qiladigan qatori. Ikkinchi qatorga yolg'iz tushgan so'z ekrandan bir qatorni
(~40 px) behuda oladi va pastdagi kontentni pastki chiziqdan itaradi (§34), ko'zga esa «buzuq» ko'rinadi.

**Tekshiruv (2026-09-15, tasdiqlangan):**
`grep -rlF ".h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }" src` = **98 fayl** ·
eski `clamp(22px,4vw,38px); }` qoidasi (7-modul/eski/demo'dan tashqari) = **0** · `h-title[^>]*maxWidth` = **0** ·
7-modul/eski/demo 23 fayl tegilmagan · esbuild ✓ · jsx 0 · dark va til chiqishi tahrirdan oldingi bilan **farq 0 qator** · `vite build` ✓.
Asbob: `~/.claude/projects/-home-kali-Desktop-internetLesson/olchov-2026-09-14/titleprobe-kurs.mjs` (har `.h-title` uchun qator soni,
kerak/berilgan kenglik, variantlar, oxirgi qatordagi so'zlar soni) · xulosa `titleprobe-xulosa.mjs` · tahrir `sarlavha-tahrir.mjs --fs 36`.
**Keyin-o'lchov** (oldin ikki qatorli sarlavhasi bo'lgan 81 dars, uz/ru; har tilda noyob sarlavha 1271, oldin bilan 100% mos):
| | ikki+ qatorli oldin → keyin | qatori ko'paygan | oxirgi qatorda yolg'iz so'z (keyin) |
|---|---|---|---|
| uz | 113 → **61** | 0 | **0** |
| ru | 245 → **160** | 0 | **0** |
Qolgan ikki qatorlilar joydan haqiqatan uzun — `balance` bilan teng bo'lingan. 15 dars qayta o'lchanmadi: ularda oldin ham ikki qatorli
sarlavha yo'q edi, qoida esa qator sonini oshira olmaydi (81 darsda «ko'paygan = 0» shuni tasdiqlaydi). Chegara: soxta javob bilan
yiqiladigan 4 darsda (m1-01, m3-03, m4-15, m4a-01 — KATTA §36) o'sha ekranlarning javobli holati o'lchanmagan.
Taqqos: `olchov-2026-09-14/taqqos-oldin-keyin.mjs uz|ru`.

---

## 11-O. 🏅 151-QONUN: AMALIY TOPSHIRIQ NISHONI — FAQAT BIRINCHI URINISHGA (2026-09-18, F-0918-04)

**Kelib chiqishi:** 18.09 LMS sinovida o'quvchi 5 test savolidan 2 tasiga to'g'ri javob berib, **4 nishondan 4 tasini** oldi.
Sabab: DragDrop / o'yin / tartiblash ekranlari `onAnswer` ni faqat muvaffaqiyatda chaqiradi va doim `correct: true`
yuboradi — necha marta adashgani hech qayerda sanalmaydi. Test savolida esa nishon azaldan faqat birinchi urinishga
(`firstAttemptCorrect`). Bitta darsda ikki xil o'lchov yurgan. Foydalanuvchi qarori: «birinchi martada to'g'ri qilsa —
nishon; ikkinchisida emas. Shunda nishon o'quvchiga qiymatli tuyuladi».

**Qoida (6 band):**
1. `ACH_TRIGGERS` ga bog'langan **test bo'lmagan** ekranda (DragDrop, tartiblash, o'yin, debug, koding, amaliy) nishon
   faqat **birinchi urinish to'g'ri** bo'lsa beriladi. Birinchi urinish xato bo'lsa — o'quvchi **bemalol qayta urinadi**,
   topshiriq odatdagidek yopiladi, «to'g'ri» fidbeki chiqadi, lekin nishon berilmaydi.
2. **«Urinish» = tekshirilgan TO'LIQ javob**, har bir harakat emas. Qo'l sirpanishi bilim xatosi emas:

   | Mexanika | Bitta xato urinish |
   |---|---|
   | DragDrop / tartiblash (avto-tekshiruv) | hamma katak to'lib, tartib xato chiqqan on (bo'lakni qaytarib-qo'yish — urinish EMAS) |
   | «Tekshirish» tugmali topshiriq (koding, debug, builder) | tugma bosilib, natija xato chiqqani |
   | O'yin / tanlov (tugun, karta, hotspot) | xato tanlov — ekran «❌ / silkinish» bilan qaytargan har qadam |

3. **Shart OLDINDAN aytiladi** — topshiriq ostida bitta xira qator (`AchRule`): «🏅 Birinchi urinishda to'g'ri
   bajarsangiz — nishon sizniki.» Aytilmagan qoida bilan nishonni olib qo'yish — nohaqlik.
4. **Jazo ohangi yo'q.** Xatodan keyin o'sha qator: «Nishon birinchi urinish uchun edi — endi bemalol to'g'risini
   toping.» Qizil rang, undov, «afsus» — taqiq. Matn-namunalar: `MATN_KORPUS.md` §183.
5. **Imkon qaytmaydi — topshiriq ichida:** «birinchi urinish xato bo'ldi» belgisi progressga (`ccProgress` → `missed`)
   yoziladi; sahifani yangilash (F5) uni o'chirmaydi.
6. **BIRINCHI O'TISH — HISOB, «Qaytadan» — MASHQ** (foydalanuvchi qarori, 18.09: «bir darsdan faqat bir marta jo'natamiz,
   bo'lmasa nishonlar ko'payib ketadi»). Yakun ekranidagi «Qaytadan» bosilgan onda birinchi o'tish **muhrlanadi**
   (`ccProgress` → `firstPass: { answers, durationSec }`) va shundan keyin:
   - **nishonlar muzlaydi** — olingani qoladi, yangisi berilmaydi (`earn` jim qaytadi). Bu **test nishonlariga ham**
     tegishli: mashq-o'tishida javobni bilib olib `firstwin` kabi nishonni «qo'lga kiritish» — eski teshik edi;
   - `AchRule` qatori **ko'rinmaydi** (va'da yolg'on bo'lardi);
   - test javoblari serverga ham, urinish-tarixiga ham **yozilmaydi** (`submitAnswer` / `recordAttempt` chaqirilmaydi);
   - «Darsni yakunlash» → `onFinished` **birinchi o'tish** javoblari, bali va vaqtini yuboradi.
   Dars yakunlanib progress tozalangach yangi urinish noldan boshlanadi — ekranda nishonlar qayta yig'iladi, lekin u
   urinish LMS'ga **ketmaydi**: serverda tanga-qoidasi (solo — azaldan; jonli — 18.09 dan, `BACKEND_REJA_UZ.md` Qoida 3).

**Tegilmaydigan joylar:** test savoli (azaldan birinchi urinishga) · `graduate` (ishtirok nishoni — kafolatli) ·
exploration/toggle ekranlar (ularga nishon umuman bog'lanmaydi — 10-bo'lim; **istisno — 152-qonun: bitta bonus nishon**) · mentor ekrani (10.1: qator ham,
nishon ham ko'rinmaydi) · server va School API payload'i (`achievements` ni dars yuboradi — shart faqat klientda).

**Kod naqshi — etalon `src/1-Modull/InternetLesson.jsx`:**
```jsx
const AchMissCtx = createContext(null);              // { missed:Set<ekran id>, miss(idx) }
// ildiz:
const missTry = useCallback((idx) => { /* ACH_TRIGGERS'da bor · hali belgilanmagan · nishon olinmagan → missed ga */ }, []);
// recordAnswer:
if (... && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
// progWrite: { ..., missed: [...], firstPass: firstPassRef.current }  ·  effekt deps: [screen, answers, earned, missed, practice]
// ekran: xato urinishda achMiss.miss(screen)  ·  topshiriq ostida <AchRule screen={screen} />
// 6-band: const firstPassRef = useRef(saved?.firstPass || null);
//   earn:  if (firstPassRef.current) return;                     // muzlash
//   reset: if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec }; setPractice(true); }   // faqat bir marta
//   QuestionScreen: const practice = useContext(AchMissCtx)?.practice;  if (!practice) live.submitAnswer(...) / recordAttempt(...)
//   finishLesson:   const ans = firstPassRef.current ? firstPassRef.current.answers : answers;   // hamma hisob `ans` dan
```
`missed` va `practice` effekt-deps'da bo'lishi SHART — aks holda xatodan (yoki «Qaytadan»dan) keyin darhol F5 bosgan
o'quvchi belgini yo'qotadi va yana «birinchi» imkonni oladi.

**Tekshiruv (tekshiruvchi/qabulchi):** har test bo'lmagan `ACH_TRIGGERS` kaliti uchun (bonus va mehnat nishoni bundan mustasno — 152-qonun) — (a) ekranda `AchRule` bor;
(b) xato yo'lida `miss(screen)` chaqiriladi; (c) brauzerda olti holat: xato→to'g'ri = nishon yo'q · F5 dan keyin
belgi turibdi · birinchi urinishda to'g'ri = nishon + bayram · «Qaytadan» → `firstPass` muhrlandi, nishonlar o'zgarmadi ·
mashq-o'tishida test nishoni ham berilmadi, `AchRule` yo'q · mashqdan keyin `onFinished` = birinchi o'tish.
Dalil (pilot, 18.09): boshsiz Chrome — oltitasi ham o'tdi, konsol xatosi 0 (`feedback/F-0918-04/ach-test.mjs` + `harness.jsx`).
Ma'lum chegara: `missed` va `firstPass` faqat shu qurilmada (localStorage) — server-progress ularni tashimaydi.

**Qamrov:** 98 darsda 343 trigger; 148 tasi test (halol), **195 tasi test emas — 76 faylda** → `KATTA_TOZALASH.md` §41.


## 11-P. 🎁 152-QONUN: BONUS NISHON — O'QUVCHINI QISMAYMIZ (2026-09-18, F-0918-06)

**Nega.** 151-qonun nishonni halol qildi. Lekin har nishon «birinchi urinishda to'g'ri» shartiga bog'lansa, dars
imtihonga aylanadi va 13 yoshli o'quvchini zeriktiradi. Foydalanuvchi qarori (18.09): «juda qismaylik, ba'zida bonus
berib turaylik». Halollik nishonning kamligida emas — nishon **nima uchun berilganini rost aytishida**.

1. **Son chegarasi.** Bir darsda kafolatli nishon ko'pi bilan **ikkita**: `graduate` va **bitta bonus**. Qolgan
   nishonlar haqiqiy topshiriqqa (151-naqsh) yoki testga bog'lanadi. Ikkinchi tekin nishon chiqsa — u testga yoki xato
   qilish mumkin bo'lgan topshiriqqa ko'chiriladi (namuna: `Htmllesson2` — `struktura` s5 → s5b test, `forma` — bonus).
2. **Bonus qayerda o'rinli.** O'quvchi shu ekranda biror ish qilgan (sinab ko'rdi, ochib chiqdi, to'ldirdi) yoki uzun
   ishning yakuni (masalan, sahifa qurib bo'lingan bayram-ekran). Ekran ochilishining o'zi uchun bonus — faqat
   shunday yakunda.
3. **Tavsif rost aytadi** (KORPUS §133, §184): bonus `desc` faqat **qilingan ishni** aytadi, mahorat da'vo qilmaydi.
   ✅ «…ochdingiz», «…ko'rdingiz», «…joyladingiz», «…o'tkazdingiz» · ❌ «…to'g'ri bog'ladingiz», «…bo'ldingiz»
   (ishni ekran bajargan bo'lsa). Tanlovli ekranda tavsif **hamma yo'lda** rost bo'lishi shart.
4. **`AchRule` qatori bonus ekranida ko'rsatilmaydi** — shart yo'q, va'da ham yo'q. «Sinab ko'ring» deb yozilgan
   ekranda tanlovlardan birini nishonsiz qoldirish taqiqlanadi (so'zga zid).
5. **Mehnat nishoni** — erkin yozma ish (o'z kartasi, o'z matni) va ekrandan tashqarida bajariladigan ish (VS Code'da
   kod). Yagona to'g'ri javob yo'q, shuning uchun «birinchi urinish» ham yo'q; nishon kafolatli emas (yozmasa ololmaydi),
   bonus hisobiga **kirmaydi**; `AchRule` siz.
6. **151-qonunning 6-bandi** («Qaytadan» = mashq, nishonlar muzlaydi) bonus va mehnat nishoniga ham to'liq tegishli.
7. **Aniqlashtirish (foydalanuvchi qarorlari, 18.09 kech — B to'lqin inventari asosida):**
   - **Mehnat nishoni kengaydi:** (a) kompilyatorda yoki `pickKod` / `ScreenCoding` ekranida **kod yozish** — shartlar jonli
     tekshiriladi, diskret urinish yo'q; nishon darvoza-savolga EMAS, kod yozishga tegishli (tavsif kod haqida);
     (b) **yagona to'g'ri javobi bo'lmagan o'z-qaror mashqi** (masalan PmLesson5 «tarozi», «ochilish ro'yxati»).
   - **PM darslarida tekin 4-ekran** (induktiv ochilish: kartalarni ochish, «haftani o'tkazish») — o'sha darsning BONUSI;
     darsda boshqa bonus bo'lmasligi shart (1-band). Tavsif 3-bandga mos bo'lishi shart.
   - **«Faqat xato qator bosiladigan» debug-ekran** bonus EMAS — haqiqiy topshiriqqa aylantiriladi: hamma qator
     bosiladigan, xatosiz qator bosilsa «Bu qatorda xato yo'q — yana qarang.» / «В этой строке ошибки нет — посмотрите
     ещё раз.» + `miss`. Sabab: debug darsining ma'nosi — xatoni TOPISH; bitta bosiladigan qator — tomosha.
   - **Ko'p-bandli topshiriq** (6 karta, 5 qadam): qoida bir xil — bitta bilim-xatosi = nishon yo'q; yumshoqlikni
     bonus + `graduate` beradi. Sirpanish (zonadan tashqari, «qator band», hali ochilmagan joy) — urinish EMAS.
   - **Qayta urinishi yo'q ekran** — `<AchRule screen={screen} once />` (KORPUS §183 uchinchi qatori).

**Reyestr (18.09, KATTA §41 B savat — har ekran kodda o'qilgan):**

| Tur | Dars · ekran · kalit |
|---|---|
| Bonus — o'zgarishsiz | `CssLesson1` s5 `rang` · `HtmlTakrorlashLesson` s12b `built` · `Htmllesson2` s7 `forma` · `JsConditionsLesson` s13 `builder` · `ReactCrudPracticeLesson` s11 `builder` · `PmLesson17` s4 `paceSetter` · `PmLesson19` s4 `innerCircle` · `PmLesson21` s4 `dayTwo` · `DbSqlNosqlLesson` s5 `connector` |
| Bonus — tavsif rostlandi | `BotIntroLesson` s6 `keyMaster` · `PmLesson4` s2 `pairFinder` · `PmLesson5` s2 `splitter` |
| Testga ko'chdi | `Htmllesson2` `struktura`: s5 → s5b |
| Mehnat nishoni | `PmLesson1` s6 `audience` · `PmMetricsLesson` s10 `calcMaster` |
| Aslida tekin emas → 151-naqsh (codemod) | `CssLesson2` s7 · `PmLesson8` s4 · `ApiPostmanLesson` s3 · `NodeServerLesson` s14 |

**Reyestr — B to'lqin (18.09 tun, 178 trigger, 6 partiya; har ekran kodda o'qilgan va brauzer-probda isbotlangan):**

- **151-naqsh ulangan: 100 ekran** (66 dars; pilot 2 bilan) — ro'yxat: `feedback/F-0918-04/b-tolqin/holat-P1…P6.json`
  (`status: "✅"`), isbot: `probe/P1…P6.json` (`scripts/ach-probe.mjs`: S0 · S4 · S5 · S2 · S1a · S1b · S3).
- **Bonus (1-band: darsda ko'pi bilan bitta — hammasida bajarilgan):** `BotIntroLesson` s6 `keyMaster` · `PmLesson6` s2 `jargon` (19.09 D3: dars 2-ekrani, mavzu hali o'rgatilmagan — birinchi urinish sharti omad o'yini bo'lardi) · `CiCdIntroLesson` s9 `clearedForTakeoff` · `ClaudeSkillsLesson` s7 `beforeAfter` (tashqi earn) · `CssLesson1` s5 `rang` · `DbSqlNosqlLesson` s5 `connector` · `HtmlTakrorlashLesson` s12b `built` · `Htmllesson2` s7 `forma` · `JsConditionsLesson` s13 `builder` · `PmLesson10` s4 `silentWatch` · `PmLesson11` s4 `memoryMaker` · `PmLesson12` s4 `eyesOpen` · `PmLesson14` s4 `threeFloors` · `PmLesson16` s4 `cheapFix` · `PmLesson17` s4 `paceSetter` · `PmLesson18` s4 `eagleEye` · `PmLesson19` s4 `innerCircle` · `PmLesson21` s4 `dayTwo` · `PmLesson22` s4 `rightQuestion` · `PmLesson23` s4 `mirrorCheck` · `PmLesson24` s4 `roadBuilder` · `PmLesson25` s4 `slideTalker` · `PmLesson4` s2 `pairFinder` · `PmLesson5` s2 `splitter` · `PmLesson9` s4 `bugHunter` · `ReactCrudPracticeLesson` s11 `builder` · `ReactIntroLesson` s13 `builder` · `ReactRouterPracticeLesson` s9 `builder` · `VsCodeLesson` s3 `pilot`.
- **Mehnat nishoni (5-band + 7-band):** `BackendCrudPracticeLesson` spf · `FullstackConnectPracticeLesson` s16 · `GitLesson` s13, s3 · `JsFunctionsLesson` s13 · `PmJtbdLesson` practice, s10 · `PmLesson1` s6 · `PmLesson10` s10, s8 · `PmLesson11` s8, s10 · `PmLesson12` s8, s10 · `PmLesson13` s8, s10 · `PmLesson14` s8, s10 · `PmLesson15` s10, s8 · `PmLesson16` s10, s8 · `PmLesson17` s8, s10 · `PmLesson18` s8, s10 · `PmLesson19` s8, s10 · `PmLesson2` koding · `PmLesson20` s8, s10 · `PmLesson21` s8, s10 · `PmLesson22` s8, s10 · `PmLesson23` s8, s10 · `PmLesson24` s8, s10 · `PmLesson25` s8 · `PmLesson4` s8, s11 · `PmLesson5` s8, s9 · `PmLesson6` s9, s11 · `PmLesson8` s10, s8 · `PmLesson9` s10, s8 · `PmMetricsLesson` practice, s10 · `PmUserStoryLesson` practice, s10 · `ReactApiGetLesson` s15 · `VsCodeLesson` s2.
- **⏸ qaror kutadi (ikkinchi tekin nishon yoki senariy):** CssLesson1 s13 `bezak` · DbSqlNosqlLesson s3 `packageMaster` · BotApiButtonsLesson s9 `buttonMaster` · BotApiButtonsLesson s11 `rightEnvelope` · BotApiButtonsLesson s12 `neverSilent` · PmLesson19 s9 `fullHouse` · PmLesson20 s4 `goodListener` · PmLesson20 s9 `sharpSifter`.
  **✅ Hammasi hal qilindi (19.09):** `bezak` → s12 testi · `buttonMaster` → s10 testi · `rightEnvelope` → s14 testi («Command Spotter») · `neverSilent` — BotApiButtons bonusi · `fullHouse` — kam beradigan joy = xato urinish · `goodListener` — 151-naqsh · `sharpSifter` — senariy bo'yicha bonus · `packageMaster` → s4 testi (S1-A, kechqurun; tavsif «O'zgaruvchan ma'lumot uchun qulay turni topdingiz»).

**Ulash qoidalari (tunda aniqlangan, hamma partiyada bir xil):**
- Qator topshiriq OSTIDA; qayta urinishli ekranda **yakundan keyin yashiriladi** (`{!done && <AchRule …/>}`), aks holda
  «…endi bemalol to'g'risini toping» muvaffaqiyat bloki ostida osilib qoladi; **`once` ekranda qoladi**.
- Topshiriq ikkinchi bosqichda ochiladigan ekranda qator bosqich-blokdan TASHQARIDA (ustun oxirida) — shart boshidan
  ko'rinsin (3-band).
- Umumiy komponentlar (`DragDropOrder`, `DebugChallenge`, `PickLines`, `NightShift`) — `onWrong` ilgagi; berilmagan
  chaqiruvda xatti-harakat o'zgarmaydi.
- Qator rangi — palitradagi eng xira, lekin fonga kontrast ≥ 4.5:1 (`scripts/codemod-achrule.mjs` tanlaydi).
- Ekrandan tashqari beriladigan nishon (`earn('…')` to'g'ridan-to'g'ri) ham o'sha topshiriqning `missed` belgisiga
  bo'ysunadi (BotIntro `neverSilent`, 18.09).
- **Ball (8-A, T9):** test deb belgilangan TARTIBLASH ekranida `correct` = birinchi TO'LIQ urinish (MCQ bilan bir xil);
  ildiz `missTry` nishonsiz test-ekranni ham yozadi (F5); jonli server kalitni ko'radi — kalit `-1` («doim to'g'ri») → `0`,
  `picked: first ? 0 : 1`.

**Tekshiruv (tekshiruvchi/qabulchi):** har test bo'lmagan `ACH_TRIGGERS` kaliti uchta holatdan biriga tushadi —
(a) 151-naqsh (`miss` + `AchRule`); (b) bonus: darsda yagona, tavsifi 3-bandga mos, `AchRule` yo'q; (c) mehnat nishoni.
Hech biriga tushmagan kalit — topilma. Yangi darsda bonus ixtiyoriy; qo'yilsa — shu besh shart bilan.
Dalil (18.09): `Htmllesson2` boshsiz Chrome — s5 da nishon yo'q · s5b birinchi urinishda to'g'ri → nishon + bayram ·
xato → to'g'ri = nishon yo'q · s7 `forma` bonusi joyida · konsol xatosi 0.

## 11-Q. ⚖️ 153-QONUN: BALL HALOLLIGI — TEST BIRINCHI TO'LIQ URINISHNI SANAYDI, HAMMA KANALDA BIR XIL (2026-09-19)

**Kelib chiqishi:** 18–19.09 B to'lqin inventari. (1) 45 ta maxsus test-ekran (tartiblash, yozma kod, tanlov) natijani DOIM
`correct: true` yozardi — o'quvchi necha marta adashsa ham LMS'ga ketadigan ball oshardi; (2) jonli server `p_correct` ni
emas, `quiz_keys` ni ko'radi — kalit `-1` = «doim to'g'ri»; (3) 13 ta test birinchi urinishni faqat XOTIRADA ushlardi —
F5 bilan chetlab o'tilardi; (4) **uyda (solo) o'tilgan darsda maxsus test javobi serverga UMUMAN ketmasdi** — rasmiy
natijada «javobsiz», maksimal (N-1)/N (brauzerda isbotlangan: `ach-probe --solo`, 15/15 tartiblash testida so'rov yo'q edi).
Foydalanuvchi qarorlari: 8-A (18.09), Q1-A, Q4-A (19.09).

**Qoida:**
1. **Ball = birinchi TO'LIQ urinish** — MCQ (`QuestionScreen`) bilan bir xil o'lchov. «To'liq urinish»: tartiblash — hamma
   katak to'lib tartib xato chiqqan on; tanlov/ulash — rad etilgan tanlov; «Tekshirish»/«Send» — xato natija. Sirpanish
   (bo'lakni qaytarish, qisman javob, method tanlash, tugallanmagan xarita) — urinish EMAS (151-qonun 2-band bilan bir xil).
2. **Javob obyekti shartnomasi (maxsus ball-ekran):** yakunda `solved: true`, `correct` va `firstAttemptCorrect` = birinchi
   urinish, `picked: first ? 0 : 1` (kalit 0) yoki haqiqiy variant indeksi (kalit = to'g'ri variant). Birinchi urinish
   progressdagi `missed` ga ham yoziladi (`achMiss.miss(screen)`; ildiz `missTry` nishonsiz ekranni ham yozadi) — F5 dan
   keyin ham saqlanadi. Ekran holati `storedAnswer.solved || storedAnswer.correct` dan tiklanadi.
3. **Kalit:** `-1` («ishtirok — bajargani to'g'ri») faqat diskret urinishi YO'Q yozma testda (harf terilishi bilan jonli
   tekshiruv). Xato yo'li bor testda kalit — `0` yoki to'g'ri variant indeksi. Kalit serverga mentor darsni ochganda
   (`set_quiz_keys`) boradi — o'zgarish shundan keyin kuchga kiradi.
4. **Uch kanal bir xil:** jonli (`live.mode === 'student'` — ildiz V2 qatori: `data.solved` · `data.picked` · `!!data.correct`),
   **solo** (ildiz `recordAnswer` dagi blok: solo · «Qaytadan» mashqi emas · ball-ekran · yakunlandi · bir marta →
   `submit_answer`, `picked` kalitdan; `scripts/codemod-solo-submit.mjs`) va `onFinished` (`correctAnswers` — birinchi
   urinish; detallarga faqat `correctIndex` li yozuv kiradi — LMS shartnomasi, Y1/Y1b).
5. **«Qaytadan» mashqi** (151-qonun 6-band) — hech bir kanalga yozilmaydi.

**Tekshiruv (har yangi/o'zgargan ball-ekran):** `scripts/ach-probe.mjs` `"test": true` spetsifikatsiya — S2 (to'g'ri →
`correct: true`), S1a (xato → to'g'ri → `correct: false`), S1b (xato → F5 → to'g'ri → `false`), S3 (sirpanish sanalmaydi);
`--solo` — SOLO-togri / SOLO-xato (soxta server; server kabi kalit bo'yicha baholanadi); `smoke-onfinished-all --seal` (I1–I12).
Holat (19.09): 26 tartiblash + 7 diskret + 2 debug testi birinchi urinishga o'tkazildi; solo 63/63 ekranda isbotlandi.


## 12-Q. ⚖️ 154-QONUN: YIG'MA TOPSHIRIQDA UYUM ARALASHTIRILGAN BO'LADI (2026-09-19, D1)

**Kelib chiqishi:** JestUnitTest s9 va EdgeCasesTest s9 — «bloklardan test yig'ish» ekranlari. Pastdagi uyumda to'g'ri
uchta blok **birinchi va aynan kerakli tartibda** turardi: o'quvchi mavzuni bilmasdan, birinchi uchtasini ketma-ket
bosib nishonni olardi (👦 o'quvchi-o'qishi: «o'ylash shart emas»). Foydalanuvchi qarori 19.09: aralashtiramiz.

**Qoida:** bo'lak/blok/karta uyumi ko'rsatilganda **to'g'ri javob uyumning boshida yoki tartib bilan turmaydi**.
Tartib **barqaror** (kodda yozilgan) bo'ladi — tasodifiy emas: shunda sinov va prob takrorlanadi, o'quvchi ham
har kirganda boshqa ekran ko'rmaydi. Kataklarning o'z yozuvlari (masalan «📁 robot papkasi») yo'l ko'rsatishi mumkin —
ular topshiriqning bir qismi.

**Tekshiruv:** prob spetsifikatsiyasining birinchi qadami — `eval` bilan «birinchi blok = javob emas» tekshiruvi
(`probe/P2.json`, EdgeCases s9 · JestUnitTest s9). Yozuvlarni ko'chirganda **vergul**ga e'tibor: eski oxirgi yozuvda
vergul yo'q edi va o'rtaga tushganda sintaksis siniqdi (esbuild darvozasi tutdi).

**Bog'liq:** 151-qonun (nishon birinchi urinishga — uyum aralashtirilmasa shart ma'nosiz) · KORPUS §186 (javob
urinishdan oldin aytilmaydi) · §171 (distraktor yolg'on model ekmasin).

## 12-R. 🛟 155-QONUN: O'QUVCHI BAJARA OLMAYDIGAN QADAM QOLMAYDI (2026-09-21, F-0921-05…13)

**Kelib chiqishi:** 21.09 👦 o'qishi to'rtta ekranda bir xil sinfni topdi — topshiriq **tashqi shartga** bog'langan,
shart bajarilmasa o'quvchi o'sha yerda qoladi va platforma buni ko'rmaydi (qadam o'z-o'zini belgilaydi):
`ReactApiGet` s15 — `robo-api.uz` javob bermaydi (48 joyda ishlatilgan) · `VsCode` s2 — qadamlar faqat Windows uchun ·
`Deploy` s5 — butun qadam AI javobiga bog'langan · `GithubActions` amaliyoti — o'z repo'si va yashil ✓ talab qilinadi.

**Qoida — uch band:**
1. **Tashqi manzil tirik bo'lsin.** Darsda o'quvchi ochadigan yoki so'rov yuboradigan har manzil (`http…`) dars
   yozilganda ham, har muhr oldidan ham tekshiriladi. O'lik manzil — **dars xatosi**, mentor og'zaki tuzatadigan
   narsa emas. Tirilmasa: manzil o'quvchining o'z loyihasidagi faylga (yoki bizning uchimizga) ko'chiriladi.
2. **Zaxira yo'l ekranning O'ZIDA turadi** — `🛟` sarlavhali yopiq `<details>` panel, chap ustunda (o'ngdagi
   qadamlar kartasi ostida ko'rinmay qoladi, F-0913-02). Yopiq: kerak bo'lgan o'quvchi ochadi, qolganiga xalaqit bermaydi.
   Panel **ishlaydigan** yo'l beradi: tayyor kod (nusxa tugmasi bilan), boshqa tizim uchun qadamlar, yoki
   «mentor bilan birga» varianti. «Keyinroq qilasiz» — zaxira yo'l EMAS.
3. **Qadam bajarilmasa ham dars to'xtamaydi.** Zaxira yo'l ham yurmasa, o'quvchi qadamni belgilab keyingi ekranga
   o'tadi — panelning oxirgi qatori shuni aniq aytadi. Ball beradigan ekranlarga bu band **tegmaydi** (153-qonun).

**Tekshiruv (muhr oldidan):** `grep -rhoE "https?://[a-z0-9.-]+" src/<modul>/ | sort -u` → har manzilga bitta so'rov;
2xx/3xx bermagani — ro'yxatga. Zaxira panel bor-yo'qligi: tashqi shartga bog'langan har amaliyot ekranida `dsx-fb`
yoki shunga teng panel.

**Bog'liq:** F-0801-12 (GitLesson birinchi 🛟 paneli — naqsh manbai) · 153-qonun (ball halolligi — zaxira yo'l ball
bermaydi) · KORPUS §188 (panel matni qanday yoziladi).

## 12-S. 🏷️ 156-QONUN: KEYSDAGI BREND BIRINCHI KO'RINISHDA IZOHLANADI (2026-09-21, F-0921-21/22)

**Kelib chiqishi:** foydalanuvchi 21.09: «Facebook–Garvard mavzusida Garvard kelyapti, o'quvchi uni universitet
ekanini tushunmaydi — mos rasm ko'rmaguncha». O'lchov: 35 PM darsida jami **35 ta `<img>` — hammasi mentor avatari**;
biznes-keyslar faqat emoji va matn bilan berilgan. Tekshiruvda ikkinchi bo'shliq chiqdi: brendlarning ko'pi
**izohlanmagan** ham edi (Airbnb, Tesla, Netflix, Dropbox, Notion, Snapchat, Uber, Spotify, Duolingo, Garvard).

**Qoida — uch band:**
1. **Izoh majburiy.** Dars matnida brend/kompaniya/joy nomi **birinchi marta** ko'ringanda yonida bir qatorli izoh
   turadi: nima qiladigan narsa ekani, o'quvchining so'zi bilan. ✅ «Garvard universiteti *(Amerikadagi mashhur
   universitet)*» · «Airbnb — begonaning uyida ijaraga turish xizmati» · «Tesla — elektr avtomobil ishlab
   chiqaradigan kompaniya». ❌ «$80 mlrd kompaniya» — bu **qiymatni** aytadi, **nimaligini** emas.
2. **Har darsda takrorlanadi.** Darslar alohida ochiladi (LMS'da bitta material) — o'quvchi 25-darsni 6-darsni
   ko'rmay ham ochishi mumkin. Shuning uchun izoh har darsda qisqa holda qaytariladi (foydalanuvchi qarori 21.09).
   Ikkinchi marta o'sha darsda takrorlanmaydi.
3. **Izoh javobni aytib qo'ymasin** (KORPUS §186). Brend **javob** bo'lgan ekranda (variant, topishmoq) izoh
   variantga EMAS, **javob ochilgandan keyingi** gapga qo'yiladi. Namuna: `PmLesson28` s0 — «Parij, taksi yo'q»
   ilgagida Uber variantiga izoh qo'yilsa javob bilinib qoladi; izoh «To'g'ri — Uber — mashina chaqirish xizmati»
   qatoriga tushadi.

4. **Maket fotoni kutmaydi** (2026-09-22, F-0922-01). Chizib bo'ladigan referent uchun **foto kutilmaydi** —
   loyihaning o'z maket-an'anasi bilan (`BrowserWin`/`PhoneMock`/`AltairMock` kabi) chiziladi. Afzalligi:
   mualliflik muammosi yo'q · tez ochiladi · qorong'i rejimda to'g'ri · LMS'ga qo'shimcha fayl kerak emas.
   Foto faqat **chizib bo'lmaydigan** referentga qoladi: real joy (Garvard binosi), muhit (qahvaxona ichi),
   haqiqiy kadr (o'yin nosozligi).

**🔴 MAKET FILTRI — o'qitadimi yoki bezaydimi.** Maket faqat **tushunchani olib keladigan** joyga qo'yiladi.
Mezon bitta savol: *maketni olib tashlasak, darsning gapi tushunarsiz qoladimi?*

| Qo'yiladi (o'qitadi) | Qo'yilmaydi (bezak) |
|---|---|
| Referent o'quvchiga notanish (Altair 8800 — 1975-yilgi kompyuter) | Referent tanish (flashka · Stories lentasi · milkshake) |
| Matn «ikki xil» deydi — maket ikkisini yonma-yon qo'yadi (`PmLesson11`) | Maket darsning gapini ko'rsatmaydi, faqat mahsulot ekrani (ilova skrinshoti) |
| Mexanika ko'rinmaydi (streak nega nolga tushadi — `PmLesson21`) | Ekran bo'sh ko'rinadi deb qo'shiladigan rasm |
| Qarama-qarshilik ko'rsatiladi (Burbn ro'yxati ↔ qolgan uchtasi — `PmLesson31`) | — |

Sabab: 109-qonun (TMI) — ortiqcha element UI'ni to'ldirib tushunishga to'siq bo'ladi.

**🔴 MAKET JOYI — §186 bilan juft.** Maket ham matn kabi javobni aytib qo'yadi, ba'zan **matndan tezroq**
(ko'z o'qishdan oldin ko'radi). Shuning uchun:
- bashorat/savol bo'lgan ekranda maket **javob ochilgandan keyin** chiqadi (`PmLesson31` s0: `picked !== null`
  bloki ichida · `PmLesson11`/`PmLesson21`: bashoratdan keyingi kalit-slaydda);
- maket qo'yilganda **keyingi ekran nima so'rashi** tekshiriladi (21.09 Tesla sabog'i).

**Maket matni:** ikki tilli darsda `aria-label` ham **uz+ru** (`tr({uz,ru})`) — ekran-o'quvchisi ruscha rejimda
o'zbekcha eshitmasin. Faqat o'zbekcha dars (`PmLesson19–25`, 7-Modul) — bir tilli qoladi.

**Rasm (tavsiya, majburiy emas):** izoh **nomlaydi**, rasm **ko'rsatadi** — ikkisi juft ishlaydi. Tasavvur qilib
bo'lmaydigan referent (eski kompyuter, chet el universiteti, notanish mahsulot ekrani) uchun rasm qo'yiladi:
naqsh `Htmllesson2` dagi `PHOTO_SET` + `Photo` (URL + emoji + gradient; rasm yuklanmasa dars TO'XTAMAYDI, 155-qonun
3-bandi bilan bir xil mantiq). Rasm faqat loyihaning media-kutubxonasidan; `alt` uz+ru.

**Tekshiruv:** keys-ekrani bor darsda — har brend nomi uchun birinchi ko'rinish joyida izoh bormi.
Maket qo'yilgan bo'lsa — `CLICK='<sel>' SHOT_LANG=ru node scripts/shot-screen.mjs <fayl> <ekran>` bilan
**ko'z bilan** ko'riladi (emoji kontrasti va ustun tekisligi faqat skrinshotda ko'rinadi — F-0922-01).
Ro'yxat va rasm-rejasi: `feedback/F-0921-rasm/RASMLAR.md`.

**Bog'liq:** 95-qonun (o'smir misol-olami) · 155-qonun (bajarib bo'lmaydigan qadam) · KORPUS §186 (javob oldindan
aytilmaydi) · §189 (izoh matni qanday yoziladi).

## 12-T. ⏭️ 157-QONUN: ARENA JAVOB OCHILGACH O'ZI KEYINGI SAVOLGA O'TADI (2026-09-22, F-0922-03)

**Kelib chiqishi:** foydalanuvchi 22.09: «CodeStrike da mentor rejimida keyingi savol bor —
shuni avtomatlashtirish kerak». O'lchov: savol vaqti (`QUIZ_MS` 15 s) va vaqt tugaganda javobni
ochish ALLAQACHON avto edi; qo'lda qolgan yagona o'tish — **javob ochildi → keyingi savol**.

**Qoida — besh band:**
1. **Avto o'tish 6 sekund** (`AUTO_NEXT_MS`, `src/live/useAutoNext.js`). 2 s YETMAYDI: o'quvchilar
   serverni 1200 ms'da bir so'raydi va arena kodida ustiga 700 ms kechikish-kompensatsiyasi bor —
   2 s bo'lsa ba'zi o'quvchi javob ekranini 1 s'dan kam ko'radi va nima xato qilganini bilmay qoladi.
   Javob ekranida to'rt narsa o'qiladi: to'g'ri javob · o'zi topdimi · ball · TOP-5.
2. **Soat faqat MENTOR brauzerida.** O'quvchilar server orqali ergashadi — bu mavjud naqsh
   (vaqt tugaganda ham mentor `ctrl('r')` yuboradi). Har o'quvchi o'zi hisoblasa, sinf uzilib ketadi.
3. **To'xtatish tugmasi YOPISHQOQ.** Javob ochilishi — **tushuntirish payti**; sof avto-o'tish
   mentordan shu daqiqani tortib oladi. Tugma bir marta bosilsa, avto **arena oxirigacha** o'chadi
   (3-savolni tushuntirgan mentor 4-savolni ham tushuntiradi — har safar kurashmasin). Qaytarish: «▶ Avto».
4. **Oxirgi savolda avto YO'Q.** «🏁 G'oliblarni e'lon qilish» — mentorning daqiqasi; podiumga
   avto kirib borish dramani buzadi. Solo (uyda) rejimda ham avto yo'q — u yolg'iz o'quvchini shoshiltiradi.
5. **Ikki marta o'tishdan qulf.** Mentor tugmani taymer bilan bir vaqtda bossa, `ctrl('q', qi+1)`
   ikki marta ketib **bitta savol tashlab ketilardi**. Qo'lda o'tish ham hookdan (`fireNow`) o'tadi.

**Tugma yozuvida `⏸` BELGISI ISHLATILMAYDI** — u shriftda bo'lmasa quti («▮») bo'lib chiqadi
(22.09 skrinshotida tutildi). Matn bilan: «To'xtatish · 5» / «▶ Avto» (`▶` loyihada 107 faylda sinalgan).

**Mexanizm bitta joyda:** mantiq `src/live/useAutoNext.js` da, darslarga `scripts/codemod-auto-next.mjs`
bilan tarqatiladi. Kutish vaqtini o'zgartirish — **bitta faylda**, 97 tasida emas. Yangi CSS kerak emas:
`.qz-btn.ghost` 97/97 darsda allaqachon bor; sinov-selektori `qz-auto` (CSS'siz, barqaror).

**Tekshiruv:** `CHROME=… node scripts/smoke-arena.mjs <fayl…>` — soxta server bilan haqiqiy brauzerda
T1 (javob ochildi) · T2 (avto o'tish) · T3 (yopishqoq to'xtatish). Bu darvoza 22.09 da birinchi
yurishidayoq **ikki eski nuqson** topdi: `PmLesson4` da arena umuman chizilmasdi va
`BotAiProjectLesson` da javob ochilganda dars qulab tushardi (F-0922-06/07).

**Bog'liq:** 152-qonun (nishon) · KORPUS §186 (javob oldindan aytilmaydi).


## 12-U. 🔤 158-QONUN: KOD SHRIFTIDA LIGATURA O'CHIRILADI (2026-09-22, F-0922-19 · F-0808-02/F-0812-03 davomi)

`JetBrains Mono` — **dasturchi shrifti**: `===` `!==` `==` `!=` `>=` `<=` `=>` `->` ni chiroyli
ko'rinsin deb **bitta glifga** qo'shib chizadi. Kattalar uchun bu qulaylik; **13 yoshli o'quvchi uchun
yolg'on**: darsda `===` yozilgan, ekranda esa uch chiziqli begona belgi turadi. Bola kodni ko'chira
olmaydi, klaviaturadan qidiradi va topolmaydi.

**Qonun:** `JetBrains Mono` yozilgan HAR joyda ligatura o'chiriladi.

✅ `.mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }`
✅ inline: `style={{ fontFamily: "'JetBrains Mono', monospace", fontFeatureSettings: '"liga" 0, "calt" 0' }}`
❌ `.mono { font-family: 'JetBrains Mono', monospace; }` — yolg'iz qolgan e'lon

**Uch qattiq shart (uchalasi ham qonga tegib topilgan):**
1. **`font-variant-ligatures` ISHLATILMAYDI** — `font-feature-settings` bilan yonma-yon kelganda
   Chrome butun qatorni tashlab ketadi (qoida umuman qo'llanmaydi).
2. **Guruh-selektorga yozilmaydi** — «.a, .b, .c { … }» ro'yxati unutishga moyil: `JsConditions` da
   dastlab 13 selektor sanalgan, arena elementlari (`.cs-tok`, `.cs-hud`, `.cs-livedot`) tushib qolgan edi.
   Xossa **har e'lonning O'Z ichida** turadi.
3. **Ildizdagi `font-feature-settings: "ss01","cv11"` YETMAYDI** — u meros bo'ladi, lekin ligaturani
   o'chirmaydi. Ikkisi boshqa narsa.

**Darvoza:** `node scripts/codemod-ligatura.mjs --check` — qoldiq 0 bo'lishi shart.
Yangi dars qurilganda yoki mono-e'lon qo'shilganda shu buyruq yurgiziladi.

**O'lchov (2026-09-22 supurish):** 115 fayl · 2402 CSS e'loni + 63 inline uslub yopildi;
avvaldan yopiq edi — 106 (3 dars: `VsCodeLesson`, `JsConditionsLesson`, `JsVarsLesson`).
7-Modul foydalanuvchi qarori bilan tegilmagan (12 fayl · 88 e'lon — `KATTA_TOZALASH.md`).

---

## 12-V. 🧹 159-QONUN: BEZAK-QATLAM VA TAKROR MA'NO YO'Q — stripe · kesik chiziq · bo'sh-holat ramkasi · ico-emoji · qora tugma · takror blok · maydon ustidagi yorliq (2026-09-26, F-0926-01 · F-0926-04)

> Raqam: 26.09 da dastlab «156» deb yozilgan edi — u raqam 21.09 dan brend-izoh qonuniniki (12-S). Eski raqam o'zgarmaydi, bu qonun 159 bo'ldi.

Manba — bridge PILOT_DIZAYN_NAQSH 38–57-bandlar, foydalanuvchi qarorlari 26.09.

Bridge (1–4-o'tish, 7 dars) ko'rigida foydalanuvchi to'rt bezak-sinfini «global — boshqa chiqmasin» deb rad
etdi; 26.09 da xuddi shu qoidalar 5–6-Modulga tatbiq qilindi («PM bridge'da qilganimizdek», «ha albatta
emojini kamaytiramiz»). O'lchov: etalonlarda (BridgeKimUchun · PmLesson2 · Htmllesson1 · CiCdIntro) `ico:` = 0,
emoji ≈170–220; 5–6-Modul texnik darslarida `ico:` qatlami ustiga qo'shilib emoji 300–570, stripe 9–18/fayl.

**Qonun (har dars, texnik va PM):**
1. **Chap rang-chiziq yo'q** — `border-left: 3–6px solid`, `border-left-color`, `box-shadow: inset 2–6px 0 0`.
   Holat (tanlangan/bajarilgan/daraja) — fon (`…Soft`) yoki to'liq halqa `box-shadow: 0 0 0 2px rang`
   (soya bo'lsa vergul bilan qo'shiladi, yo'qolmaydi).
2. **Kesik bezak-chiziq yo'q** — karta/slayd tepasidagi `repeating-linear-gradient` (`.kp-bet::before`).
   Chiziq ma'no tashisa (daftar qatorlari, elak to'ri) — o'sha satrda `/* kesik-ok: sabab */` izohi shart.
3. **Bo'sh-holat ramkasi yo'q** — «… bosing ←» yozuvli `frame-dash`. Chorlov mentor-gapda («Har kartani
   bosing», «Tugmani bosib …») va tugmada; birinchi bosishgacha ustun bo'sh turadi. Ramka ichida HARAKAT
   bo'lsa (tugma: «Daftar biriktirish») — u holat-karta, qoladi. Istisno (F-0926-05 #20, foydalanuvchi): ramkada
   FAQAT bitta boshlash-tugmasi qolsa (yakka rejim taymeri «▶ 30 soniyani boshlash») — ramka olinadi (`.pair-timer.bare`),
   tugma qadam sarlavhasi ostida turadi; taymer ishlaganda/tugaganda ramka qaytadi.
   🔴 Ramka olingach **⛶ bo'sh ustun ustida yolg'iz qolmasin** (F-0926-04: 5–6-Modulda 77 ekran, PM'da 3 ekran) —
   Zoomable o'zini o'lchaydi (`scripts/codemod-zbtn-float.py` → `.z-float`) yoki `<Zoomable off={!active}>`.
   Darvoza: `tools/page-audit.mjs` **ZBTN=0**.
4. **ico-emoji qatlami yo'q** — chip/karta/oqim/jihoz yorliqlari oldidagi `ico:`/`sIco`/`tIco` belgilar,
   `<span className="…-ico">`, `sw-node` diagramma belgilari, `note-h` prefiksi. QOLADI: `ic:` RECAPS
   (etalonlarda bor), olam-matni (Telegram xabari 🍕 🤖 👋 — bot shunday gapiradi), tizim-UI (🏅 151-qonun,
   🏆/🥇 podium, 🔥 streak, ⚡ jonli, 📊 mentor-panel, 📖/🗣️ recap, 📝 uy vazifasi, ✓ ✗ → ←).
5. **Qora tugma yo'q** (F-0819-56 ning davomi) — `.btn/.rc-btn/.lp-done-btn` `background: ${T.accent}; color: #fff`;
   `.mstats-reveal` — `paper/accent/1px accent`, `:hover`/`.ready` da `color: #fff` majburiy (accent ustida
   accent yozuv ko'rinmaydi — BotIntro 26.09 da tutildi).
6. **Takror yo'riq yo'q** (bridge 44/50-band) — mentor aytgan gapni variant ostidagi kursiv qator qaytarmaydi.
   Fleshkarta «bosing» yo'rig'i (`.fc-cue`, `.fc-hint` matni) — **faqat `InternetLesson` ning 1–3-kartasida**
   (`swapRef.current < 3`); boshqa hamma darsda 1-kartada ham YO'Q (foydalanuvchi 26.09: «UI'ni buzadi»).
   Codemod: `scripts/codemod-fc-hint.py`.

**PM global tozalash (F-0926-04, 25 PM dars; foydalanuvchi 26.09 so'zma-so'z ma'nosi):**
7. **Bir sahifada bir ma'no bir marta.** Mentor gapi bilan blok bir xil gapirsa — MENTOR QOLADI, blok ketadi.
   Sarlavha bilan ustun-yorlig'i, qadam-chipi bilan karta sarlavhasi («1-qaror» · «1-qaror»), sarlavha bilan
   🎯 takeaway («Dars oxirida siz …») — bittasi qoladi. Maqsad-ekrani sarlavhasi aniq «Bugun … » gap bo'ladi.
   TaskSpec sarlavhasidagi «3 tadan N tasi yozildi» sanog'i olinadi — holatni qadam-chiplari ko'rsatadi.
8. **Maydonning tepasida HAM ichida HAM yozuv yo'q.** Yorliq qisqa savol bo'lib placeholder ichiga kiradi,
   `aria-label` = to'liq savol. Istisno: oldindan to'lib keladigan maydon — karta boshida bitta qator
   «belgi · Nom · taymer», maydon ichida faqat «masalan: …» (PmLesson3 s13).
9. **Bloklar tepasi bir chiziqda.** Ikki ustunda asosiy qutilar farqi ≤ 2px; ustunni pastga itaradigan
   `justify-content: center` / `margin-top: auto` → `flex-start`. Qarshi ustunda ortiqcha qator bo'lsa —
   `.cc-ghost` (ko'rinmas nusxa) yoki yorliq o'z qutisi ustiga.
   🔴 F-0926-05 (foydalanuvchi: «bloklarni boshlanish balandligi bir xil bo'lishi kerak»): 3–4 ustunli qator ham
   shu qoida; «kod → natija» sxemasi (`.stq`, `.kdx`) — `align-items: flex-start`, strelka `align-self: center`;
   har xil uzunlikdagi kartalar hovuzi (`.mt-pool`) — `align-items: stretch` (tepa ham, balandlik ham bir xil).
   Istisno: bosqich-yorlig'i («1 KIMNI TANLANG») + variantlar yonida karta — yorliq tepasi karta tepasi bilan
   bir chiziqda bo'lsa QOLADI (foydalanuvchi 26.09).
10. **Baland rang yo'q.** Katta to'yingan fon (tanlangan variant to'liq to'ldirilgan) → `…Soft` fon yoki
   `box-shadow: 0 0 0 2px rang` halqa. Accent tugma va kod-oyna tegilmaydi.
11. **Test izohi — qisqa.** Natija yorlig'i («To'g'ri» / «Qaytadan urinib ko'ring») tepada; izoh «To'g'ri — »
   bilan boshlanmaydi va variant matnini qaytarmaydi — faqat nega. «💡 Yordam / ⭐ Qo'shimcha» — uzuq chiziqli
   quti emas, matn-havola (16-qonun). Joy so'zlari («pastda», «chapda») mentor gapida ishlatilmaydi —
   telefonda joylashuv o'zgaradi.
12. **Hech narsa tugmalar qatori orqasida qolmaydi — javobdan KEYINGI holatda ham** (F-0926-05). 1280×800 da
   izoh/namuna ochilgach ham kontent navigatsiya chizig'idan yuqorida tugaydi. Yechim tartibi: (a) ustma-ust
   emas, yonma-yon (rasm + izoh, PmLesson12 s0 `.hopen`); (b) ixchamlash — juftlar 2×2, oraliq kichrayadi
   (PmLesson4 s0 `.hk-pay`, PmLesson2 `PagePreview tight`); (c) matn qisqartirish — oxirgi chora.
   Oldingi foydalanuvchi qarori bilan joylashgan blok (PmLesson4 s0: izoh kartalar USTIDA, F-0916-01 Q12)
   o'rnidan ko'chirilmaydi. RU matn uzunroq — o'lchov ikkala tilda (`--lang=ru`).
13. **Cho'zilgan bo'sh quti yo'q** (F-0926-05 #17/#20, foydalanuvchi: «bitta katta karta bom-bo'shday tuyulmasin»).
   Karta balandligi ichidagiga mos: `flex-grow: 1` / `max-height` bilan ekranni to'ldirish (`.wsp-ed`, `.rcp-flow`) yo'q;
   ko'p bosqichli karta har bosqich bilan o'sadi. Blok qolgan joyning o'rtasiga tushirilmaydi (`margin-top: auto`) —
   mentor gapining shundoq ostida turadi. **Istisno yo'q** (02.10, F-1002-69): maqsad va muhokama ekranining yagona bloki
   ham Mentor ostida, oddiy oraliq + ~12 px (foydalanuvchi: «yopishib ham qolmasin, juda ochiq ham qolmasin»). Yordam/Qo'shimcha havolasi o'z paneli ostida, ustun oyog'ida osilmaydi.
14. **Holat bir marta aytiladi** (F-0926-05 #16). Tugma «✓ Bajarildi» ga aylansa — ostidagi takror yashil yozuv
   (`done-mini`) va panelning yashil ramkasi (`.kdpanel.is-done`) yo'q. Tugma yo'q joyda (kompilyator o'zi tasdiqlaydi)
   `done-mini` — yagona natija xabari, QOLADI.
15. **To'ldirilgan chip** (02.10 QAYTA YOZILDI, F-1002-59 — foydalanuvchi 1-dars ko'rigida: «ranglar o'zgarmasin, oldingilariday
   sarg'ishroq»; 26.09 F-0926-05 #5 «oq fon + 2px chegara» varianti BEKOR). Sudraladigan chip — to'q sariq gradient
   `linear-gradient(170deg, #FF8A3D, accent)`, oq matn, chegarasiz, «⠿» ushlagich, soya `0 8px 16px -8px rgba(255,79,40,.6)`
   (namuna: `src/6-Modull/SystemArchitectureLesson.jsx` `.dd-chip`). 5-Modul 8 darsda qaytarildi; 1–4-Modul 23 fayl —
   `KATTA_TOZALASH.md` F-1002-59. Qadam-raqami doirasi (`.rcp-n`) — `accentSoft` fon + accent raqam + 1.5px halqa.
   Rangli belgilar qatori (5 bo'lim) — `saturate(0.55)`, ranglar farqi qoladi.
16. **Yonma-yon qutilar bir balandlikda — imkon bo'lsa** (F-0926-06, foydalanuvchi 27.09: «boshlanishini bir xil balandlik
   qilaylik … istisno variantlar ham bo'lishi mumkin, majburiy emas, vaziyatdan kelib chiqib»). Tepasi bir chiziqdagi
   o'xshash juft (kod-qutisi ↔ Eslatma) — pastki cheti ham bir chiziqda: ustunlar alohida bo'lsa subgrid
   (`.split.eqh > .col { grid-template-rows: subgrid }`, faqat keng ekranda), holat o'zgarib qutilardan biri baland
   bo'lsa modifikator olinadi (CssLesson1 s3: faqat boshlang'ich holatda). Istisno: biri ikkinchisidan 2× baland —
   cho'zish bo'sh quti yasaydi (13-band). O'lchov: page-audit **EQH** (nomzod).
17. **Javobni oldindan aytadigan yozuv yo'q** (F-0926-06 pilot). Savol ekranida javob tanlashdan OLDIN ko'rinadigan
   izoh/yozuv to'g'ri javobni aytmaydi (CssLesson1 s0: «✨ CSS qo'shilgan…» — olindi).

**Darvoza:** `npm run lint:dizayn -- <fayl>` (D1 stripe · D2 kesik 🔴, D3–D6 🟡, emoji ⚪ o'lchov) + `lint:dark` 0.
**Codemodlar** (quruq yurish → `--write`): `scripts/codemod-stripe.mjs` · `codemod-dark-btn.mjs` ·
`codemod-frame-dash.mjs` (hisobotda eng yaqin mentor-gapni ko'rsatadi — chorlov borligi KO'Z bilan tekshiriladi) ·
`codemod-ico.mjs` · `codemod-ui-clean.py` (yo'riq/tugma/sarlavha/savol-emoji, tepa-bar, bo'sh Zoomable) ·
`codemod-fc-hint.py` · `codemod-taskspec.py` (sanoq · Yordam-quti · «To'g'ri —») · `codemod-zbtn-float.py` (⛶). O'lchov: `tools/page-audit.mjs <fayl> --clicks=4 --shots`
(DUP · ALIGN · INP · LOUD · ZBTN · SCROLL — DUP nomzod, har biri KO'Z bilan tasdiqlanadi; SCROLL 26.09 dan asosiy dars-qutisini o'lchaydi — avval hujjatni o'lchab doim 0 berardi; ALIGN 2–4 ustun, >6px). Bo'shab qolgan holat-qoida (`.x.done { }`) codemoddan keyin QO'LDA halqa/fon oladi.
**O'lchov (26.09, 5-Modul 11 dars):** stripe 139 · qora tugma 60 · frame-dash 41 · ico 278 o'zgarish;
emoji BotIntro 375→280; gates 6/6 · jsx TOZA · dizayn 0 (kesik-ok 3).
**Bog'liq:** 111-qonun (7-soniya/olib-tashlash testi) · F-0819-56 (dark-lint) · bridge PILOT_DIZAYN_NAQSH 8-bo'lim.

---

## 12-W. 🗂️ 160-QONUN: VIZUALGA TEGISHLI MATN VIZUAL BILAN BITTA BLOKDA (2026-09-27, F-0927-01)

**Foydalanuvchi (GitLesson 1-ekran):** «o'ng tomondagi "Bitta joydagi fayllar" va "Fayllar faqat shu kompyuterda turibdi"
degan gaplar o'z blokidan tashqarida chiqib ketibdi — blok ichida bo'lishi kerak. GLOBAL tekshir.» Qaror: **A varianti**.

1. Rasm, sxema yoki oyna **o'z izohi bilan** kelsa (tepada yorliq VA/YOKI tagida izoh-matn), uchalasi **bitta karta**
   (`.vis-card`: paper-fon, 16px radius, bitta soya, ichida 12px gap) ichida turadi. Sahifa fonida sochilgan
   «yorliq — vizual — izoh» uchligi yo'q.
2. Karta ichidagi vizual ikkinchi soya olmaydi — `0 0 0 1px` chegara bilan (karta ichida karta ko'rinmasin).
3. **Istisno — izohsiz ustun-yorlig'i** («NATIJA», «DARS OXIRIDA…», «5 QADAM», «PAPKANGIZDAGI FAYLLAR») vizual ustida
   YOLG'IZ tursa (tagida izoh-matn yo'q), u ustun sarlavhasi: kartaga SOLINMAYDI — vizualda oyna-sarlavhasi bor-yo'qligidan
   qat'i nazar (foydalanuvchi A javobi: «izohsiz ustun-yorlig'i qoladi»). Hamma vizualni kartaga solish har darsda
   karta-ichida-karta yasaydi. Qoida faqat **izoh-matn** bor joyda ishlaydi (yorliq + vizual + izoh yoki vizual + izoh).
4. Boshqaruv elementlari (chip, tugma) kartadan TASHQARIDA qoladi — kartada faqat ko'rsatiladigan narsa va uning izohi.
5. Karta ustun tepasidan boshlanadi — qo'shni ustun bilan tekislik 159/9 bo'yicha qayta o'lchanadi
   (kartaga o'ralgach ko'rinmas yorliq-nusxa kerak bo'lmay qolishi mumkin — GitLesson G4).
6. **O'lchov:** `node tools/page-audit.mjs <dars> --clicks=2` → `LOOSE` (ota karta emas, karta-qo'shniga ≤24px yopishgan
   sof matn). Nomzod — ko'z bilan ajratiladi: `tagida` izohlari asosiy nishon, yolg'iz `tepada` — 3-band istisnosi.
   `tagida` bo'lsa ham qoidaga KIRMAYDI: javobdan keyingi izoh (hook-ack — variantlar ostida, vizual emas), nishon-sharti
   («🏅 Birinchi urinishda…»), bosiladigan/holat tab-legendasi (4-band), yutuq-medali.

1-Modulda qo'llangan (27.09): GitLesson s0 s1 s7 · CssLesson2 s0 s8 s12 · Htmllesson1 s0 s13 · InternetLesson s5 s7 s8 ·
VsCode s0 s7. Qolgan modullar — o'z tozalash to'lqinida.


## 12-X. 🙂 161-QONUN: EMOJI — BELGI, MA'NO EMAS (2026-09-29, F-0929-18)

**Foydalanuvchi (6-Modul v2 ko'rigi):** «vizualda emojilar kam ishlatilsin — ma'no jihatdan qayta-qayta beradigan so'zlarni olib
tashlagandek; soatcha yana soatcha, uning ichida yana soatcha — bunaqalar kerakmas, bitta qolsin; hamma joyga emoji kerakmas —
o'quvchi fikrni o'qib anglolmay qoladi, chalg'itadi». Qaror: 7 band, darvoza `lint:emoji`.

1. **Ma'no tashimaydi.** Har matn emojisiz ham to'liq tushunarli bo'lishi shart: emoji olib tashlansa, ma'no o'zgarmaydi.
2. **Bir ekranda bir xil emoji — bir marta.** Ichma-ich takror yo'q (⏳ ichida ⏳; karta ichida karta belgisi).
3. **Emojisiz joylar:** mentor gapi, savol matni, test variantlari, xato-izohlar, kod va kod izohlari, yakun ro'yxati, kartochkalar.
4. **Faqat sarlavha-belgi:** ekran eyebrow'ida yoki karta sarlavhasida ko'pi bilan bittadan. Ro'yxat bandlari oldida emoji emas —
   raqam yoki oddiy belgi (1 · 2 · 3, ✓, —).
5. **Chegara:** bir ekran (yoki bitta global blok — RECAPS, QUIZ_BANK, kartochkalar) ichida jami ko'pi bilan **4 ta**.
   Tugma-belgilar (▶ ▸ ✓ ✔ ✕ ↻ ← → ⏹ ✎) emoji hisoblanmaydi.
6. **Istisno:** nishon va bayram ekrani (o'yin qatlami, 152-qonun) — u yerda ham bitta.
8. **Istisno — keys-sahna** (02.10, F-1002-70, 165-qonun): PM keys ekranidagi sahnada emoji — illustratsiya (uy, universitet,
   telefon), matn emas. Sahnada ≤4 **tur** emoji, bir xil element takrorlanishi mumkin (to'rtta uy). Matn-kartaga emoji qaytmaydi.
   `lint:emoji` `const KEYS_SCENE` blokida turlarni sanaydi.
9. **Istisno — tushuncha-oqim sahnasi** (02.10, F-1002-82, 167-qonun): xabar yo'li chizmasida har tugunda bitta belgi-illustratsiya
   (modul belgi-lug'atidan), blokda ≤4 tur. Matn, mentor va test ichiga emoji qaytmaydi.
7. **Darvoza:** `npm run lint:emoji -- <fayl>` — blok bo'yicha sanaydi: limitdan oshsa yoki test-matnida emoji bo'lsa — error;
   bir blokda takror emoji — warn. `npm run gates` tarkibida.

**Bog'liq:** 109-qonun (TMI), 159-qonun (bezak-qatlam va takror ma'no yo'q), 11.10 (rasm o'rniga emoji emas).

## 12-Y. 📏 162-QONUN: MATN O'LCHOVLARI — HOOK JAVOBI · XATO-IZOH · YASHIL XULOSA (2026-10-02, F-1002-54/56/58)

**Foydalanuvchi (5-Modul 1-dars ko'rigi):** «bu uzun so'zda o'quvchi maydalab o'qimasa kerak — aniq, kamroq va to'liq tushunarli;
bu GENERAL 1-sahifa qonuni» · «so'z juda uzun, qisqa aniq tushunarli qilishimiz kerak» · «bu sahifada juda uzun matn bo'lmasin —
bittasi uzun bo'lsin, ikkinchisi qisqa». O'lchov 5-Modul 12 darsida: hook 12 javob 3–5 gap (275 belgigacha), xato-izoh 25 ta
60 dan uzun (307 gacha), yashil xulosa 41 ta 110 dan uzun (282 gacha) — hammasi qisqartirildi (F-1002-61/62/63).

1. **Hook javobi** («Aynan!» / «Qiziq fikr!» dan keyingi tasdiq-matn) — **≤2 gap, ≤120 belgi**; ochuvchi so'z gap sanalmaydi.
   «Telegram shunday ta'riflaydi», «Bugun … ko'ramiz» kabi quyruq yo'q. Xato tanlovga ham shu o'lchov: javob ekrandagi dalilni
   ko'rsatadi («Chatga qarang: javob 03:00 da keldi… Demak, javobni bot berdi.»).
2. **Xato-izoh** (`frame-warn`) — **bitta gap, ≤60 belgi**: nima xato ekanini aytadi, javobni aytmaydi (Z-01 / 159.11 o'lchovi).
   Chuqur tushuntirish keyingi ekranda yoki recapda — xato-ramkaga sig'dirilmaydi.
3. **Yashil xulosa** (`frame-success`) — **≤2 gap, ≤110 belgi** (recap kartasi o'lchoviga yaqin). Ekranda asosiy karta uzun bo'lsa,
   xulosa qisqa qoladi («bittasi uzun, ikkinchisi qisqa»). «✓ Tartib to'g'ri: a → b → c» qatori ham shu o'lchovda.
4. **ru** — uz × 1.25 (150 / 75 / 137). Backtik va teglar sanalmaydi.
5. **Darvoza:** `npm run lint:olchov -- <fayl>` — `npm run gates` ichida (10-darvoza `olchov`). 5-Modul va 7+ modullarda error;
   1–4-Modul va 6-Modul (o'z fidbek davrigacha) warn. Ikki sinov: 5-Modul `a171852` — 146 topilma, tuzatilgan — 0.

**Bog'liq:** 109-qonun (TMI), KORPUS §154 (tasdiq-bloki 2 gap), §218, QOIDALAR T-067 · S-048 · T-068.

## 12-Z. 🧩 163-QONUN: MINIMALIZM + BITTA KERAKLI VIZUAL (2026-10-02, F-1002-55/57/60)

**Foydalanuvchi (5-Modul 1-dars ko'rigi):** «ancha toza, minimalizmga zo'r; qo'shimcha: iloji boricha vizualda ham ko'rinsin, ammo
bitta qoida — "vizual ko'rsataman" deb butun ekranni buzib to'ldirib qo'yish kerak emas» · 10-ekran: «jonsiz bo'lib qolibdi —
real botdan /help ketadi, bot javobi ko'rinadi, shunda zo'r bo'ladi; ham minimalist, ham kerakli vizual».

1. **Bitta vizual.** Har tushuncha-ekranda ma'noni ko'rsatadigan **bitta** vizual (chat oynasi, oqim-chizma, maket, kod-natija) —
   u ekranning asosiy ishi bilan bog'liq. Ikkinchi vizual, bezak, to'ldiruvchi blok qo'yilmaydi (159-qonun bilan juft).
2. **Matn-strelka vizual emas.** «→ salom va menyu» kabi matn-oqim jarayonni ko'rsatmaydi — jarayon o'zi ko'rinadi: xabar
   chatga tushadi, bot javob beradi (1-dars 10-ekran: 1-ekrandagi AvtoPizza chati qayta ishlatildi, 6 pufak).
3. **Mavjud komponent qayta ishlatiladi**, yangi dizayn o'ylab topilmaydi (145.c bilan bir xil): darsning o'z chat/maket/oqim
   komponenti bor bo'lsa — o'sha.
4. **Reja ekrani** (F-1002-55): texnik dars kartasi — oq karta, 12px radius, yengil soya, «01» raqam, o'ngda mono teg (`.step-tag`,
   uz+ru); karta **bosilmaydi** (hover va kursor yo'q — 30.09 «tugmaga o'xshaydi» shikoyati qaytmaydi); kirish animatsiyasi
   (stagger) qoladi. 30.09 U1c «oddiy ro'yxat» varianti bekor. PM darslari o'z reja ko'rinishida.
5. **Tekshiruv:** olib tashlash testi (109) — vizual olinsa ekran tushunarsiz bo'lib qolsa, u kerakli; qolsa — bezak.
6. **Namuna ekran** (02.10, F-1002-71 — foydalanuvchi: «juda yaxshi, shunaqa qilishimiz kerak: minimalist, toza, vizual, aniq,
   yoqimli»): 5-Modul 2-dars 9-ekran «Uchta guruhingizni yozing» — tepada bosqich-chiplari (1-guruh ✓ …), chapda bitta
   ish-kartasi, o'ngda yashil bo'lib boradigan tekshiruv-ro'yxati, Mentor bitta qator. Yangi amaliy ekran shu bilan solishtiriladi.
7. **Bir raqam — bir joyda** (02.10, F-1002-72): kartadagi son o'ng ustundagi chip-qatorda va xulosada takrorlanmaydi; jarayon
   («eshitdi → ochdi → ishlatdi») chip-qator bilan emas, qisqarib boradigan chiziq bilan ko'rsatiladi; bo'sh ustun qoldirilmaydi —
   kartalar butun kenglikda bir qatorda (5-Modul 2-dars 10-ekran).

8. **Ketma-ket ochiladigan qadamlar ekranni cho'zmaydi** (02.10, F-1002-93 — foydalanuvchi: «juda pastga tushib ketgan»): har bosishda
   yangi to'liq karta qo'shilmaydi. Chapda qadamlar **ro'yxati** (raqam + nom; o'tilgani yashil ✓, joriysi accent ramka), o'ngda faqat
   **joriy qadamning** kartasi — matn shu karta ichida almashadi; oxirida o'sha karta yashil xulosaga aylanadi. Ekran balandligi
   o'zgarmaydi, bo'sh ustun qolmaydi (5-Modul 5-dars 13-ekran, `.stp` / `.stp-row` / `.stp-card`). Chat ichidagi ketma-ketlik — bu
   qoidaga kirmaydi (169-qonun chegaralaydi).
9. **Sig'im-sahnasi holatni ko'rsatadi** (02.10, F-1002-95 — «animatsiya yoki ma'lumot aniqmas»): sig'imi bor narsa (kontekst oynasi,
   navbat, xotira) **bo'sh kataklari bilan** boshidanoq ko'rinadi, hisoblagich «n / N» kataklar ustida; tartib hayotdagidek (chat: eski
   tepada, yangi pastda); chiqib ketgan element yo'qolmaydi — qayerga ketgani ko'rinadi (oyna ustida kulrang chizilgan «chiqib ketdi»);
   «keyingi chiqadi» belgisi faqat savol javobini sotmaydigan paytda. Ma'noni yozuv emas, harakat beradi — qizil izoh-qatorlar olinadi
   (6-dars 8-ekran, `Desk`).
10. **Solishtirish-sahnasida har tomon o'z shaklida** (02.10, F-1002-96 — «juda minimalist, biroz jon kerak, ortiqcha bo'lmasin»): AI
   gaplari — darsning chat-pufagi (avatar + «Bizda bor:»), baza — jadval kartasi (`menyu · PostgreSQL`, narx ustuni mono); hukm —
   gapga **muhr** (yashil «✓ Rost» / qizil «✗ To'qib chiqarilgan»), mos qatorga chiziq, yo'q qator uchun jadval ostida qizil uzuq qator
   «bazada bunday qator yo'q». Boshqa hech narsa qo'shilmaydi (6-dars 12-ekran, `.ck-ai` / `.ck-db` / `.ck-stamp`).

**Bog'liq:** 109, 111, 145.c, 159, 160, 169-qonunlar; QOIDALAR P-052 · P-015 · P-055/056/057.

## 12-AA. 🔤 164-QONUN: SARLAVHA — BITTA QATOR, IMKONI BO'LSA SAVOL (2026-10-02, F-1002-68/75)

**Foydalanuvchi (5-Modul 2-dars ko'rigi):** «sarlavha juda uzun bo'lmasligi kerak, iloji bo'lsa savol bo'lsin — qiziqarli;
qolgan gapi Mentorning gapiga kiritilib, moslab tushunarli qilinsin; sarlavhani 2 qatorga tushirish birinchidan to'g'ri emas,
ikkinchidan dizayn ham yaxshi ko'rinmaydi. Bu fidbek butun general» · javobida: «xuddi shunday general qoida, qonun qil».

1. **Bitta qator.** Ekran sarlavhasi (`.h-title`) 1280×800 da uz va ru rejimda bitta qatorga sig'adi. Yakuniy hukm — brauzer
   o'lchovi (`npm run lint:sarlavha -- <fayl>`), chunki 36 px serif shriftda kirill harfi va «→» keng: 46 belgilik ru sarlavha
   ham buzildi. Oldindan belgi-tekshiruv (`lint:olchov`, gates 10-darvoza): **uz ≤55, ru ≤60**.
2. **Savol afzal.** Hook, maqsad, keys, sinov va tushuncha-ekranida sarlavha imkoni bo'lsa savol: «Botingizni birinchi kim
   ishlatadi?», «Qaysi bot buyurtmani haqiqatan qabul qiladi?». Mashq va yakun sarlavhasi darak gap bo'lishi mumkin.
3. **Kesilgan qism yo'qolmaydi** — Mentor gapiga ko'chadi («AvtoPizza boti bir haftadan beri ishlayapti. …»); Mentor sarlavhani
   takrorlamaydi (M5-A5). Sarlavhadagi savolni Mentor qayta so'ramaydi.
4. **Qolip:** «Oxirgi qadam: … tartibga soling» — qisqa ot bilan («botning ish siklini», «iteratsiya qadamlarini»).
5. **Qamrov:** 5-Modulda 26 + 10 sarlavha qayta yozildi (02.10); 6-Modul — o'z fidbek davrida (`lint:olchov` 54 warn);
   1–4-Modul — eski darslar, ko'rganda.

**Bog'liq:** 162-qonun (matn o'lchovlari), 150.4 (sarlavha balance), M5-A5; QOIDALAR T-069.

## 12-AB. 🎬 165-QONUN: PM KEYS-SAHNA — VOQEA VIZUALDA HIS QILINADI (2026-10-02, F-1002-70)

**Foydalanuvchi (2-dars Facebook keysi):** «hozir quruq facebook so'zi; biznes hissini vizualda his qildirsin — emojilari bilan,
animatsiyon, minimalist, ammo yaxshi, chiroyli, yoqimli; universitet deyapmiz — shuni ham o'ylab ko'rsatish kerak. Barcha PM darsida».

1. **Bitta sahna** keys ekranida, sarlavha ostida (~104–148 px): voqea har bosqichda rasm kabi o'zgaradi (Facebook: 🏛️ bitta
   universitet → talaba-nuqtalar bir-biriga ulanadi → boshqa 🏛️ va 🏫 maktablar → 🌍). Matn kartada qisqa qoladi.
2. **≤4 tur emoji** + nuqta (odam), chiziq (bog'lanish), qisqa matn-raqam; ranglar: nuqta accent, «boshqa guruh» to'q sariq,
   «yo'qolgan/xira» — kulrang (`:dim`). 161-qonun 8-band istisnosi.
3. **Test halolligi:** bashorat bosqichida javob berilmaguncha sahna `pre` kadrda — javobni ochmaydi (globus 2006 dan oldin yo'q,
   «xira suratlar» javobdan keyin chiqadi); javobdan keyin `post`.
4. **Faqat bank fakti:** sahnadagi raqam yoki sana keys-faktdan; maket raqami (Duolingo 7 → 0) «misol» deb izohda aytiladi.
   Brend logotipi chizilmaydi.
5. **Bitta vizual** (163): keysda boshqa maket bo'lsa, sahna uning o'rnini oladi (12-dars StreakMock → sahna).
6. **Reduced-motion:** kadr darhol, animatsiyasiz. Komponent: `KeysScene` + `KEYS_SCENE` (har kadr bosqichga bittadan).
7. **Qamrov:** 5-Modul 4 PM dars (Facebook · Airbnb · Booking.com · Duolingo) — 02.10 qilindi; 6-Modul 4 PM — o'z fidbek davrida;
   1–4-Modul PM keyslari (16 fayl) — `KATTA_TOZALASH.md` F-1002-70.

**Bog'liq:** 33/56/91b (keys va bashorat), 161 (emoji), 163 (bitta vizual); QOIDALAR P-053.

## 12-AC. 🏅 166-QONUN: NATIJA EKRANI — BITTA KARTA, NISHON «YUTUQ» BO'LIB KO'RINADI (2026-10-02, F-1002-73)

**Foydalanuvchi:** «nishonlarni emojida beramizmi? olganida bunaqa zerikarli chiqmagandi» + kelgan taklif: «kartalar bir-biriga
tekislanmasdan layoutlar g'alati bo'lgandan ko'ra, bitta komponentga ochroq fon berib yig'ib qo'ysachi» · javob: «taklifing ma'qul,
faqat 3/4 aylanacha markazidan joylashsin».

1. **Bitta oq karta** (`.pod-card`, ≤480 px): ball-halqasi karta yuqori chetida, **gorizontal markazda**, raqam halqaning o'rtasida;
   sarlavha ham karta bilan bir o'qda (markazda).
2. **Nishonlar bo'limi** och fonda: olingan nishon — och binafsha katakda, 2 px accent halqa, ostida inglizcha nomi, bir marta
   «pop» (stagger); olinmagani — kulrang 🔒 va «?». Emoji qoladi — bayram oynasida ham aynan shu emoji (o'quvchi taniydi).
3. **Izoh** 💡 belgili och binafsha qatorda, karta ichida. Uch alohida suzuvchi blok yo'q.
4. **Qamrov:** natija ekrani 21 PM darsda bir xil — 5-Modul 4 dars 02.10 qilindi; qolgan 17 tasi `KATTA_TOZALASH.md` F-1002-73.

**Bog'liq:** 152 (o'yin qatlami), 159.13, 163; QOIDALAR U-048.

## 12-AD. 🛤️ 167-QONUN: TUSHUNCHA-OQIM SAHNASI — XABAR YO'LI KO'RINADI (2026-10-02, F-1002-82)

**Foydalanuvchi (5-Modul 3-dars 4-ekran):** «shundayam vizual ko'rsatishimiz kerak va buni ham general qilishimiz kerak — minimalizmda,
ammo vizual ham ko'rinsin, mos bo'lsin, yaxshi bo'lsin» · javobida: «faqat UI to'lib ketmasin, juda bardak qilma».

1. **Yo'l ko'rinadi, aytilmaydi.** Xabar yo'li chizmasi (Telegram → Telegraf → bot.js; hodisa → handler → javob) quruq so'z-quti emas:
   har tugunda bitta belgi + nomi + bitta qisqa izoh; chizma butun kenglikda (3-dars 4-ekran: kartalar, ostida «/start» yo'l bo'ylab
   yuradi, «Salom!» qaytish chizig'idan qaytadi — kirishda va hammasi ochilganda bir marta).
2. **Modul belgi-lug'ati** (bir ma'no — bir belgi, hamma darsda bir xil): 📩 hodisa · 📄 handler / kod-fayl · 💬 javob · 📱 Telegram ·
   📦 Telegraf (kutubxona) · 🧠 AI · 💻 laptop/server · 👤 mijoz. Yangi belgi qo'shilsa shu ro'yxatga yoziladi.
3. **Minimal.** Belgi tugun ichida, alohida bezak-qatlam yo'q; harakat bitta (yuruvchi xabar yoki navbat bilan yonish) — ikkalasi
   birga emas. Chizmada allaqachon navbat bilan yonish bo'lsa (1, 6, 7-dars) faqat belgi qo'shiladi.
4. **Reduced-motion:** yuruvchi xabar ko'rsatilmaydi, chiziq va tugunlar statik.
5. **Qamrov:** 5-Modul 4 xabar-yo'li chizmasi (1-dars s1, 3-dars s3, 6-dars s1, 7-dars s3) — 02.10. Boshqa strelkali chizmalar
   (4-dars holat, 5-dars juftlar, 7-dars deploy) — ko'rganda. 6-Modul — o'z fidbek davrida.

**Bog'liq:** 161.9 (emoji istisnosi), 163 (bitta vizual), 165 (keys-sahna); QOIDALAR P-054.

## 12-AE. 👆 168-QONUN: BOSILADIGAN ELEMENT BOSILISHI BILINADI (2026-10-02, F-1002-83/84)

**Foydalanuvchi (3-dars 4-ekran):** «bosilishi kerakligi ham bilinmadi — oddiy qilingani sababli bo'lsa kerak» · 10-ekran: «biroz aniqsizlik tuyuldi».

1. **Bosib-ochiladigan guruh:** hali ochilmagan element navbat bilan yengil pulslaydi (`.tap-wave`, `outline` bilan — halqa-soyani
   buzmaydi; ochilgach to'xtaydi); har elementda «›», ochilgani «✓»; hisoblagich («1/3») — tugma-yorlig'ida yoki guruh yonida.
   PM darslarida bu vazifani `useTurnHint`/`useTurnWalk` bajaradi.
2. **Puls kirish-animatsiyasi bilan bir elementda emas** (`fade-up` + `.tap-wave` → element ko'rinmas qoladi; `lint:jsx` tutadi):
   kirish o'rovchi blokka beriladi.
3. **Ko'p qadamli mashqda bitta yorqin harakat:** har qadamda faqat keyingi bosiladigan narsa pulslaydi/yorqin; qadam-chiplari
   (① ② ③, tugagani yashil) qayerda ekanini ko'rsatadi; ko'rsatma bitta qisqa qatorda, to'rt joyga bo'linmaydi.
4. **Tizim holati ko'rinadi:** natija yo'q bo'lsa (handler yo'q — bot jim) chatda bir marta kulrang belgi; kerakli tugma («+ handler
   qo'shish») kulrang-o'chiq emas, kerak bo'lganda yorqin; kerak bo'lmaganda «handler yo'q» uzuq ramkada.
5. **Qamrov:** 5-Modul 7 darsda 14 ekran + 3-dars 10-ekran — 02.10; 1–4-Modul texnik darslari o'lchanmagan (ko'rganda).

**Bog'liq:** 152 (tap-hint), 159.15, 163; QOIDALAR U-049 · U-051.

## 12-AF. 💬 169-QONUN: CHAT OYNASI CHO'ZILMAYDI (2026-10-02, F-1002-85)

**Foydalanuvchi (3-dars 10-ekran):** «juda cho'zilib ketdi pastga qarab» — handlersiz «/menu» har bosishda yangi pufak, chat ekrandan uzun.

1. **Balandlik cheklangan:** `.tg-body { max-height: clamp(260px, 48vh, 420px); overflow-y: auto }`; har yangi xabarda eng pastga avtomatik
   tushadi (`TgBody`, reduced-motion'da sakrab). Yangi xabar har doim ko'rinadi.
2. **Takror hodisa yig'ilmaydi:** natijasiz hodisani qayta yuborish holat o'zgarmaguncha o'chadi (168.4); ssenariyli chatda bir xil
   xabar ketma-ket ustma-ust tushmaydi.
3. **Qamrov:** 5-Modul 8 dars chat komponenti — 02.10; 6-Modul — o'z fidbek davrida.
4. **Amaliyot chati ekranga sig'adi (2026-10-04, 5-Modulni yopish Q2 A, F-1004-60):** «kutilgan natija» va «bugun quramiz» chati ekranning
   o'rtasidan boshlanadi — qat'iy `48vh` uni pastki panel ostiga tushirardi (1280×773: 3-dars 17-ekran 62px, 5-dars 2/7-ekran 17/27px; «Ortda
   qoldingizmi» qatori ko'rinmasdi). Endi balandlik **pastki chiziqqacha qolgan joydan** o'lchanadi (`TgChat fit` → `useChatFit`: `.stage-content`
   pastki cheti − chat tepasi − chatdan keyingi qator; `--lz` masshtabi hisobga olinadi; ≥180px), sig'magan xabarlar chat ichida skrol, oxirgi
   xabar ko'rinadi. Telefonda (≤768) va kattalashtirilgan oynada — 1-banddagi CSS chegarasi. 7 dars (3/4/6/10 amaliyot ekrani, 5/7/9 «bugun
   quramiz» + 3 blok). **Tekshiruv:** `lint:layout` E 1280×773 va 1366×768 — chat 0.

**Bog'liq:** 159.13 (cho'zilgan bo'sh quti yo'q), 168; QOIDALAR U-050, U-080.

## 12-AG. 🎯 170-QONUN: TANLOV RANGI BUTUN KURSDA BITTA — ACCENT (2026-10-02, F-1002-92)

**Foydalanuvchi (5-Modul 5-dars):** «oldingi tex darslarga qara — shu tugmalardan birini bosganda qaysi rang bo'ladi, qorami?» · javob: «tavsiya ma'qul, generalne qil».

1. **Tanlangan variant** (`hook-option.on`, radio, chip, karta tanlovi — ball bermaydigan tanlov ham) — kursning tanlov rangi: `accentSoft` fon +
   1.5 px `accent` ramka + `accent` matn, radio nuqtasi `accent`. 1–4c-Modul 43 va 6-Modul 10 darsda shunday; 5-Modul 7 darsdagi «neytral qora
   ramka» (30.09 U1) bekor — 02.10 qaytarildi.
2. **Qora ramka tanlov belgisi emas** (159.5 «qora tugma yo'q» bilan bir qatorda). «Ballsiz tanlov» degani yashil/qizil baho rangi bo'lmasligi;
   accent baho emas, «siz shuni tanladingiz» rangi.
3. **Baho ranglari alohida:** yashil — to'g'ri, qizil — xato, faqat ball yoki tekshiruv natijasida.
4. **Tekshiruv:** `grep -n "\.hook-option\.on" <fayl>` → `${T.accentSoft}` bo'lmasa — nuqson; QOIDALAR U-053.

**Bog'liq:** 159.5, 168 (bosish signali), M5-U1 (bekor qilingan qismi).

## 12-AH. 📐 171-QONUN: TOR USTUN (`narrow`) FAQAT TEST VA NATIJA EKRANIDA (2026-10-02, F-1002-94)

**Foydalanuvchi (5-Modul 5-dars 14-ekran):** «layoutda katta qilish bor — layout o'zgarmasin va bunga o'xshagan baglar bo'lmasin, qat'iy qara, generalne».

1. **`narrow` (680 px markazlashgan ustun)** faqat ikki ekran turida: test (`QuestionScreen`) va natija (`ScreenPodium`). Butun kursda
   shunday (02.10 o'lchov: 119 fayl).
2. **Tushuncha / hayotiy / amaliyot ekrani** kurs layoutida (to'liq kenglik, `.split` ikki ustun yoki bir ustun). Bitta ekran tor bo'lsa
   dars boshqalaridan farq qiladi — o'quvchi «nimadir buzildi» deb o'ylaydi.
3. **Topilma (02.10):** 5-Modul 5-dars 14-ekran «Botingiz g'oyasini tanlang» va 10-dars 4-ekran «Agent sikli» — ikkalasidan olindi.
   1–2-Modulda 8 eski istisno (PmLesson3 ×5 Demo Day, PracticeLesson4 «Tez takror», HtmlTakrorlash «Eslab olish» va «Sahifa tayyor!») —
   KATTA_TOZALASH F-1002-94, warn.
4. **Tekshiruv:** `lint-narrow.mjs` = `gates` 11-darvoza (`npm run lint:narrow`): `<Stage … narrow>` ni o'rab turgan komponent
   `QuestionScreen`/`ScreenPodium` bo'lmasa — 5-Modul va 7+ da error, 1–4 va 6-Modulda warn. QOIDALAR U-054.

**Bog'liq:** 145.c (mavjud komponent), 163 (bitta vizual), 166 (natija ekrani — `narrow` o'rinli).

## 12-AI. 🧱 172-QONUN: LOYIHA KUNI QOLIPI — 8 EKRAN + 3 AMALIYOT BLOKI (2026-10-03, F-1002-101…112)

**Foydalanuvchi (5-Modul 6-dars ko'rigi, CusDev):** «practiceda ko'p ekran nega kerak — o'quvchi 19 ekranni ko'rsinmi yoki praktika qilsinmi
1,5 soatda? 7–8 eng kerakli ekran + practice» · «practicelarni keskin kamaytiramiz — o'quvchilar ulgurmayapti». Qaror Q1 A·Q2 C·Q3 A·Q4 A.

1. **Qamrov:** modulning **loyiha kunlari** (5-Modulda 5, 7, 9) — 20 ekran emas, **8 ekran + 3 amaliyot bloki = 11**: 0 hook (bitta savol) ·
   1 «bugun quramiz» (tayyor natija chati + 3 qadam tex-karta + repo teglari qatori) · 2 tushuncha-1 (bitta vizual) · **A1** · 3 test-1 ·
   4 tushuncha-2 · **A2** · 5 test-2 · **A3** · 6 podium · 7 yakun (kartochkalar shu ekranda, «Keyingi dars» qatori). ≈90 daqiqa, amaliyot ≈58.
   Qolgan kod-darslar 20 ekranda qoladi, faqat amaliyot ekrani 173-qonun bo'yicha. PM darslar o'zgarmaydi.
2. **Bitta natija:** dars oxirida o'quvchining repo'sida aniq bir narsa ishlaydi (o'z g'oyasi bot · bot serverda · v2 serverda) — 1-ekranda ko'rsatiladi,
   bloklarda quriladi, podiumda sanaladi. Bir dars — bitta yangi narsa, qolgani o'tilgandan.
3. **Tushib qolgan ekranlar yo'qolmaydi:** tushunchalar kartochkalarga (12), keyslar/hikoyalar YAKUNIY MD arxiviga; arena `QUIZ_BANK` (12 savol)
   test-ekranlarga bog'liq emas — o'zgarmaydi (faqat darsga zid variant matni, o'rni saqlanadi). `INLINE_KEYS` 2 ta, RECAPS 2 ta.
4. **Nishonlar 3:** ikki test + bitta amaliyot-bonus (A3 oxirgi «Bajardim», birinchi urinish sharti yo'q — memory `nishon-bonus-qismaslik`).
   Uyga vazifa bloki yakundan olinadi — ish repo'da, keyingi dars shu repo ustida.
5. **Jarayon:** MD v2 (retsept F, A-bo'lim = qolip qoidalari, har ekran ostida `✎` eski ekran qayerga ketgani) → GATE M → kod bitta
   anchor-tekshiruvli skript bilan (asl nusxa `arxiv/`ga) → `gates` 11/11 + `lint:jsx` + `lint:sarlavha` → surat (uz + 2–3 ru) → ko'z → foydalanuvchi.
   Suratdan topilgan nuqson MD'ga `⚙` bilan qaytariladi (MD = manba-haqiqat).
6. **Tekshiruv:** SCREEN_META uzunligi 11 va `practice` turi 3 ta; `lint:olchov` (sarlavha ≤55, hook ≤2 gap, xato-izoh ≤60, xulosa ≤110);
   `lint:narrow`; arena 12 savol o'zgarmaganini `git diff` bilan.

**Bog'liq:** 163 (minimalizm), 164 (sarlavha), 169 (chat), 173 (blok), 151 (nishon); QOIDALAR P-058; reja `feedback/F-1002-mexanizm/AMALIYOT_REJA_2026-10-02.md`.

## 12-AJ. 🛠️ 173-QONUN: AMALIYOT BLOKI — REPO USTIDA, 4 QADAM, KUTILGAN NATIJA (2026-10-03, F-1002-106…115)

**Foydalanuvchi:** «Nestjs'da shablon berib, clone qilib ustiga qurishsin» · «aniq amaliyot qilsin Antigravity bilan, ekran o'sha-o'sha, minimalizm».

1. **Shablon-repo:** modulning amaliyoti bitta ochiq repo ustida (`github.com/Azizbekcrypto/TelegramBotNest`: Nest 11 + TypeORM + telegraf + Gemini).
   O'quvchi 3-darsda **Fork → clone** (keyin deploy o'z nusxasidan), `.env` tokeni; har dars oxiri tegi `dars-0N-done`, ortda qolgan — `git checkout -f dars-0N-start`.
   Kod yozish — Antigravity (prompt), tushuncha-savollar — gemini.google.com (memory `sinfda-gemini`). Baza — Neon (bepul, bitta URL), hosting — Render Free
   (kartasiz; 15 daqiqa jimlikda uxlaydi → serverda **webhook**, laptopda **polling**; bitta token ikki joyda ishlamaydi — dars matni buni halol aytadi).
2. **Blok = 4 qadam, har darsda bir xil (`ScreenBlok`):** `1 · Ochish` (papka, `npm run start:dev`) → `2 · Prompt` (`PromptBox`: «Nusxalash», o'quvchi to'ldiradigan
   joy `{…}` accent pill, `|`/`#` qatorlar mono) → `3 · Ishga tushirish` (terminal xatosiz; xato yo'li bitta gap: «Shu xato chiqdi: {xato}. Tuzat.») →
   `4 · Telegramda tekshirish` (aniq buyruq). Qulf: bittadan «Bajardim», ↻ qaytaradi; oxirida yashil xulosa (≤110). Jonli: `PRACTICE_BASE + ekran` zonasi (ball yo'q).
3. **O'ngda kutilgan natija — bitta vizual:** chat (`TgChat` + pufaklar + tugma qatori), terminal (`Term`, git/Render log) yoki fayl-karta (`FIKRLAR.md`).
   Namuna doimo AvtoPizza, yorlig'i «kutilgan natija · namuna: AvtoPizza» — o'quvchi o'zinikini solishtiradi. Pastda `.ab-tail`: zaxira tegi yoki halol izoh
   («bepul server 15 daqiqa jimlikdan keyin uxlaydi»).
4. **Prompt mazmuni:** texnologiya va token aytilmaydi (repo'da); faqat *nima qilsin*: qayerda · nima o'zgarsin · nima buzilmasin (9-dars) — shikoyat emas, vazifa.
   Fikrlar `FIKRLAR.md` da repo ildizida (9-dars → Demo Day dalili).
5. **Texnik tuzoqlar (ov-bandlari, tekshiruvchi):** (a) qadam matnida `**` ishlatilmaydi — `fmtCode` faqat backtikni tushunadi, yulduzcha xom chiqadi («Fork» → «Fork»);
   (b) Mentor JSX'ida backtik yozilmaydi (Mentor `fmtCode` qilmaydi) — `<code className="qcode">`; (c) `tr()` natijasi obyekt bo'lishi mumkin — string metodidan
   oldin `String(tr(l))` (FileCard yiqildi); (d) yangi CSS sinfi faylning eski umumiy qoidasidan **oldin** tursa yutqazadi — ikki sinf (`.dpl.dpl3`) yoki
   o'z sinfi (`.lp-step.ab-cur`); (e) kesib tashlangan yordamchi (`fcAnswer`) esbuild'dan o'tadi — `undef` darvozasi tutadi, cut'dan keyin `grep` bilan tekshiriladi;
   (f) chat tugma yorlig'i bitta qatorda sig'sin («Buyurtmam» → «Buyurtma», «To'rt pishloq» → «Pishloqli») — 169 bilan juft.
6. **Boshqa fayllar har xil primitivli bo'lsa** (chat/terminal imzolari) — blok o'zini o'zi ta'minlaydi (`BlkBtns`, `CodeLines`, o'z CSS'i `</style>` oldiga),
   tashqariga faqat `Stage/Mentor/Col/TgChat/Bubble(from)/MentorPracticeStats/PRACTICE_BASE/LiveGateCtx/fmtCode` ga tayanadi (3/4/6/10-dars).

**Bog'liq:** 172, 145.c (mavjud komponent), 163.6 (amaliy ekran namunasi), 169; QOIDALAR P-059/060, U-055…058; repo README; jurnal F-1002-103…115.


## 12-AK. ⬆️ 174-QONUN: KONTENT HAMISHA TEPADAN BOSHLANADI (2026-10-03, F-1003-01)

**Foydalanuvchi (5-Modul QA, 8-dars 3-ekran surati):** «content hardoim layoutda shu yuqoridan boshlansa — bu yerda o'rtaga tushib qolgan;
generalne qabul qil, bajar va bunga o'xshagan xatolar kutilmasin».

1. `.screen` vertikal markazga olinmaydi — hech qaysi shaklda: inline (`justifyContent: 'center'`), shartli
   (`isMentorLive ? 'flex-start' : 'center'`), `safe center`, CSS (`.screen:has(.pod-card) { justify-content: center }`).
   Hook, test, natija, yakun — hammasi: sarlavha eyebrow ostida, birinchi qatorda.
2. 128-qonun (`safe center`) faqat `.stage-content` kesilishiga himoya — u ekranni markazga olishga ruxsat EMAS.
3. Qamrov (03.10): 12 fayl (5-Modul 2 ekran, 7-Modul 11 test-ekran), 98 fayl test-ekran (`QuestionScreen`, talaba rejimi), 4 fayl natija ekrani (CSS).
4. **Tekshiruv:** `gates:qolip` q1 (statik, uchala shakl) · `lint:layout` F-detektor (birinchi blok `.screen` tepasidan >40px).

**Bog'liq:** 128, 163 (minimalizm), 172; QOIDALAR U-059.

## 12-AL. ✍️ 175-QONUN: YOZISH MAYDONI MATN BILAN O'SADI (2026-10-03, F-1003-03)

**Foydalanuvchi (8-dars 13-ekran):** «ko'p text yozilsa, shu qator davom etib ketaverarkan, visual tarafdan nima yozganini ko'rish qiyin».

1. O'quvchi gap yozadigan maydon `<input>` emas — `GrowInput` (`<textarea rows={1}>`): 1 qatordan boshlanadi, matn bilan 4 qatorgacha o'sadi,
   undan keyin ichida skroll. Enter yangi qator ochmaydi — maydonning o'z `onKeyDown` (saqlash) ishlayveradi.
2. Son maydoni (`type="number"`, `inputMode`) `<input>` bo'lib qoladi.
3. Qamrov: 24 PM fayl, 52 maydon. Komponent har faylda o'zini o'zi ta'minlaydi (fayl tepasida, `Stage` dan oldin).
4. **Tekshiruv:** `gates:qolip` q2.

**Bog'liq:** QOIDALAR U-060.

## 12-AM. 🔒 176-QONUN: «BAJARDIM» QADAMLARGA BOG'LIQ (2026-10-03, F-1003-12)

**QA (9-dars 17-ekran, 10-dars 17-ekran):** «hammasini bosmasa ham shunday chiqishi kerakmi?» · «bittasini tanlab, bajarildi bosilib yashil yonyapti — to'g'ri logicmi? global».

1. Amaliyot ekranida (`ScreenLivePractice`) «Bajardim» hamma qadam belgilanmaguncha yopiq: `disabled={done || checked.size < checklist.length}`,
   yorliq «Yana N qadam» (ru «Ещё шагов: N»), `complete()` ham shu shart bilan qaytadi; yopiq tugma xira (`.lp-done-btn:disabled:not(.is-done)`).
2. 173-qonun bloki (`ScreenBlok`) va 163.8 qadam-ro'yxat (bittadan ochiladi) bu qoidani o'zi bajaradi.
3. Qamrov: 39 fayl (3, 4, 4a–4c, 6-Modul).
4. **Tekshiruv:** `gates:qolip` q3.

**Bog'liq:** 163.8, 173; QOIDALAR P-061.

## 12-AN. 🎯 177-QONUN: NATIJA VA YAKUN — BITTA O'Q, HALQA BIR JOYDA (2026-10-03, F-1003-04/05)

**QA (8-dars 14/16-ekran):** «buyam buzilgan» · «bungayam qara, generalne qat'iy».

1. **Natija ekrani (podium):** sarlavha, halqa, karta bitta vertikal o'qda, markazda (`.head.head-c`); halqa karta ICHIDA (manfiy `top` yo'q).
2. **Yakun ekrani:** halqa (`ScoreRing`) sarlavha yonida turmaydi — sarlavha 2 qatorga o'tsa pastki kartaga tushardi. O'rniga
   «✓ …» chipi yonida `score-chip` «N/M to'g'ri» (ru «верно»); mentor rejimida ko'rinmaydi (`isMentorL` sharti saqlanadi).
3. Qamrov: 109 faol dars (yakun), 98 podium sarlavhasi, 4 PM podium kartasi.
4. **Tekshiruv:** `gates:qolip` q4 (yakun `hero` ichida halqa) · q5 (`.pod-card .ring-wrap` manfiy `top`).

**Bog'liq:** 166 (natija kartasi), 171 (narrow); QOIDALAR U-061.

## 12-AO. 📏 178-QONUN: KARTA ICHIDA MATN CHETGA YOPISHMAYDI (2026-10-03, F-1003-21)

**QA (m5-11 11-ekran «Kod nima qilsin»):** «chapga tiqilib qolgan».

1. Sabab: umumiy reset `.lesson-root ol { padding: 0 }` (0,1,1) sinf-qoidasini `.kdreq { padding-left }` (0,1,0) yeydi — raqamlar karta chetida.
2. Yechim — bitta naqsh barcha PM darslarda: `.lesson-root ol.kdreq` (list-style yo'q) + `li` fonli qator + `li::before` raqam-doira (8-dars naqshi).
3. Umumiy: element-reset (`ol`, `ul`, `p`) sinf-paddingidan kuchli bo'lishi mumkin — yangi ro'yxat/karta sinfi resetdan yuqori o'ziga xoslik bilan yoziladi.
4. Qamrov: 11 PM fayl. **Tekshiruv:** `gates:qolip` q6 · `lint:layout` G-detektor (matn karta ichki chetiga <3px).

**Bog'liq:** 145.c; QOIDALAR U-062.

## 12-AP. 1️⃣ 179-QONUN: SON EKRANDA BIR MARTA (2026-10-03, F-1003-02)

**QA (8-dars 9-ekran):** «5 ta joyda 3 ta savol borligini bildirib turibdi — takrorlik bo'lmagani yaxshi, 6 ta ekan».

1. Miqdor (uch savol, uch kun…) sarlavhada + bitta vizualda (1/2/3 doiralar) aytiladi. Eyebrow «Mustaqil ish» (sonsiz), mentor gapi va
   topshiriq ro'yxati sonni takrorlamaydi («Uch savol yozilgan» bandi — doiralar ko'rsatadi).
2. Qamrov: 14 PM «Mustaqil ish» ekrani (eyebrow), 5 topshiriq bandi, 1 mentor gapi.
3. **Tekshiruv:** `gates:qolip` q7 (warn) · karta (boshqa ekran turlarida eyebrow-son + mentor-son juftligi qo'lda ko'riladi).

**Bog'liq:** 109 (TMI), 163; MATN_KORPUS §223; QOIDALAR P-062.

## 12-AQ. 🔗 180-QONUN: BITTA TUSHUNCHA — BITTA MANBA (2026-10-03, F-1003-16)

**QA (10-dars 4/13/16-ekran):** «bularni bir source-dan olganmizmi yo generate bo'lganmi?»

1. Bir tushuncha (agent sikli, bosqichlar, qadamlar ro'yxati) darsning bir nechta ekranida chiqsa — bitta `const` dan olinadi
   (10-dars: `CYCLE` — Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi?; `PHASES`, `FLOW`, `AGENT_RUN` fazalari shundan).
2. Testda o'rgatilmagan qadam so'ralmaydi: tartib-testi 5 bo'lak so'rasa — tushuncha ekrani ham 5 bo'lakni ko'rsatadi.
3. **Tekshiruv:** karta (tekshiruvchi ov-bandi: bir xil yorliq ikki literal massivda — topilma).

**Bog'liq:** 145.c; QOIDALAR P-063.

## 12-AR. 🔮 181-QONUN: FAQAT BOSILADIGAN EKRANDA — AVVAL BASHORAT (2026-10-03, F-1003-18)

**QA (m5-11 5-ekran):** «o'quvchi hech nima yechmadimi? faqat buttonni bosib o'tirsa o'tib ketaveradimi?»

1. O'quvchi faqat «Keyingi» bosib kuzatadigan ekranda (kunlar, sikl, sahna) asosiy o'zgarishdan OLDIN ballsiz bashorat so'raladi (2–3 variant),
   asosiy tugma bashoratsiz yopiq; natija ochilgach «Taxminingiz: … · haqiqatda: …» qatori.
2. Bashorat baholanmaydi (✓ faqat mos kelsa), keyingi test ekrani tekshiradi.
3. **Tekshiruv:** karta (tushuncha-ekran faqat bosish bo'lsa — topilma).

**Bog'liq:** 33/56 (bashorat), DE-165 `pre/post`; QOIDALAR P-064.

## 12-AS. 🏷️ 182-QONUN: KEYS EKRANI — BITTA QOLIP, BREND O'Z RANGIDA (2026-10-03, F-1003-19; 165-qonunga qo'shimcha)

**Foydalanuvchi:** «bu pageni komponenti har xil bo'p qopti … rasm yoki animatsiya o'sha brendni — o'quvchi ko'rganda his qilsin, eslasin degan edik».

1. Barcha PM keys ekranlari: ixcham karta (`k-fill` yo'q), Stage eyebrow «Biznes olamidan», slayd yorlig'i «{Brend} · N / M».
2. Sahnaning chap burchagida brend nom-yorlig'i o'z rangida (`.ksc-brand`: thefacebook #3B5998 · AirBed & Breakfast #FF5A5F · Booking.com #003580 ·
   duolingo #58CC02). Logotip-rasm emas — nom va rang. Brend sir bo'lgan keysda (2-dars «Bu sayt…») yorliq ochilish qadamida chiqadi (`brand.from`).
3. **Tekshiruv:** surat (4 dars yonma-yon).

**Bog'liq:** 165; QOIDALAR PM-028.

## 12-AT. 🧩 183-QONUN: ASBOB/FUNKSIYA TUSHUNTIRILSA — KODI KO'RINADI (2026-10-03, F-1003-15)

**Foydalanuvchi (10-dars 7-ekran):** «function'ning kodini yozib qo'ysa qanday bo'larkan, faqat shunday qiladi deb yozib qo'ygandan ko'ra».

1. Funksiya/asbob kartasida 3–4 qator kod (`.ag-tool-code`, kod-rangi) + bir gap tavsif. Repo bo'lsa — repo'dagi koddan qisqartiriladi
   (10-dars `checkOrder`/`saveOrder` = `TelegramBotNest/src/api/ai/agent.service.ts`). Izoh-qatorlar `{ uz, ru }`.
2. **Tekshiruv:** karta.

**Bog'liq:** 173 (repo), 145.c; QOIDALAR P-065.

**172-qonunga tuzatish (F-1003-06):** «bugun quramiz» tex-kartasida qadam ostidagi kichik teglar YO'Q — qadam matni o'zi yetadi
(QA «olib tashlaylik», 8 kod darsi). Pastki «repo · dars-0N-start · namuna dars-0N-done» qatori qoladi.
**Tugma joyi (F-1003-13/17):** harakat tugmasi u o'zgartiradigan kartadan KEYIN turadi; jarayon tugagach tugma yashiriladi (ro'yxat pastki panel ostiga
ketmasin) — QOIDALAR U-063, `lint:layout` E.

**178-qonunga tuzatish (F-1004-19, 04.10 — o'z regressiyamiz):** 03.10 naqshi `.kdreq li { display: flex }` band ichidagi har `<code>`/`<b>` ni alohida
flex-ustunga aylantirdi («qayt / di,»). To'g'ri naqsh: `li` — oddiy blok (`position: relative`, chap padding 35px), raqam-doira `li::before` — `position: absolute`
(left 10, top 7). 13 PM fayl. **Tekshiruv:** `gates:qolip` q9 · surat (kod-chipli band bitta qatorda).

## 12-AU. 👆 184-QONUN: TUSHUNCHA-EKRAN — HARAKAT → NATIJA VIZUALDA (2026-10-04, F-1004-06/13/22/23; qaror Q1 A)

**Foydalanuvchi (6-Modul QA):** «faqat button bosib keyingi stepni ochyapti, faqat text o'qiyapmiz» · «nimanidir bosasiz, text yozilgan cardlar o'zgarib
ma'lumot chiqadi, faqat textdan nimadir o'rganish qiyin, boshqa alternativ topish kerak» · «click va text, click va text — boshqacha ilm yo'qdek».

1. Har tushuncha-ekranda o'quvchi **bitta harakat** qiladi (tanlaydi, qo'shadi, sudraydi, o'zgartiradi) va **natija vizualda o'zgaradi**: tugun yonadi, yo'l chiziladi,
   kod qatori qo'shiladi va telefon/brauzer maketi o'zgaradi, qoida qo'shiladi va AI javobi yaxshilanadi. Matn — faqat bitta yashil xulosa (≤110, 162).
2. TAQIQ: «bosasiz → yangi matn-karta ochiladi» (karta ichida tushuntirish matni almashadi). Chip/tugma bosilganda faqat gap chiqsa — qayta quriladi.
3. Avval bashorat (181), ketma-ket qadamlar — 163.8 qadam-ro'yxati + joriy karta. Funksiya/asbob — kodi ko'rinadi (183).
4. Namuna tanlanmaydi tashqi platformadan (F-1004 izohi: 20-surat QA'niki, foydalanuvchi namunasi emas) — manba foydalanuvchi so'zi va 5-Modul ekranlari.
5. Qamrov: 6-Modulning hamma tushuncha-ekrani (≈76) MD v3 → GATE M → kod. **Tekshiruv:** MD v3 da har tushuncha-ekranda «Harakat → Vizual o'zgarish» qatori
   majburiy (yo'q bo'lsa GATE M o'tmaydi); kodda — karta (tekshiruvchi ov-bandi F-1004/1).

**Bog'liq:** 163, 163.8, 181, 183, 109; QOIDALAR P-067.

## 12-AV. 🧼 185-QONUN: TOZA YUZA — EMOJI BELGIDA EMAS, FON FAQAT HOLATDA (2026-10-04, F-1004-14/16/26; qaror Q2 A; 161 ga qo'shimcha)

**Foydalanuvchi:** «pagelarda emojilarni kamaytirib, aniqroq bo'lsa … har elementni background colori bor bo'lib g'alati ko'rinyapti, clean qilish kerak».
161-qonun darvozadan o'tgan (0 xato) bo'lsa ham ekran «emoji ko'p, fon ko'p» ko'rindi — limit yetmaydi.

1. Tugma, variant, chip, ro'yxat bandi matnida emoji YO'Q (✓ → ← ▶ kabi belgilar emoji emas). Emoji faqat eyebrow va sahna-illustratsiyasida (keys maketi, 186).
2. Fon — faqat holat: tanlangan = accent, to'g'ri = yashil, xato = qizil. Qolgan bloklar oq karta + 1px chiziq; bir ekranda ko'pi bilan 2 xil fon (sahifa + karta).
3. O'yin qatlami (arena, podium, nishon hisoblagichi 🏅) tegilmaydi.
4. **Tekshiruv:** `lint:emoji` 185 (tugma/`li`/chip/`label:`) — 6-Modul va yangi papkalarda error, eski modullarda warn; fon-sanoq — surat (darvoza nomzodi
   `lint:layout` I, kalibrovkadan keyin). Variant-belgisi ma'lumot maydonida (`ic:`) bo'lsa statik tekshiruv ko'rmaydi — MD v3 da olinadi.

**Bog'liq:** 161, 170 (accent tanlov), 111; QOIDALAR U-064.

## 12-AW. 🎨 186-QONUN: VOQEA/BREND SAHNASI — CHIZILGAN MAKET, EMOJI EMAS (2026-10-04, F-1004-02/15; qaror Q3 A; 165/182 ga qo'shimcha)

**Foydalanuvchi:** «emojini o'rniga nimadir qo'yilsa … har bir PM darsini shu biznes misollarda rasm yoki brendni his qildiradigan animatsiya» ·
«shuni nima ekanini ko'rsatsa bo'ladimi, emojidan ko'ra».

1. Keys/voqea sahnasida predmet darsning o'z kodida chiziladi (CSS/SVG): Altair paneli, chat oynasi + kulrang ogohlantirish qatori, telefon ekrani — va harakat
   qiladi (chiroq yonadi, qator paydo bo'ladi). Rasm fayli yo'q (LMS paketi o'zgarmaydi, ru oson).
2. Logotip chizilmaydi — brend nomi o'z rangida (182). Matnda aytilgan narsa sahnada ko'rinadi («bitta qator» deyilsa — o'sha qator chiziladi).
3. **Tekshiruv:** surat; `KEYS_SCENE` da emoji-tur 0 ga intiladi (165 limiti 4 — eski darslar uchun).

**Bog'liq:** 165, 182, 184; QOIDALAR PM-029.

## 12-AX. 👉 187-QONUN: ICHKI HARAKAT TUGMASI O'NG CHEKKADA (2026-10-04, F-1004-08)

**Foydalanuvchi:** «button o'ngda bo'lsa qulay, chunki ko'pchilik o'ng qo'li bilan bosadi (mobileda)».

1. Kontent ichidagi harakat tugmasi («Keyingi qadam», «Agentga vazifa berish», «Skanerlash») — u o'zgartiradigan karta/blok OSTIDA, o'ng chekkada
   (`alignSelf: 'flex-end'` yoki `.act-row`). Pastki navigatsiya o'zgarmaydi. Tugash bilan tugma yashirinadi yoki natija bilan almashadi (U-063, 179).
2. **Tekshiruv:** `gates:qolip` q8 (6-Modul va yangi — error).

**Bog'liq:** 168, U-063; QOIDALAR U-065.

## 12-AY. 🧩 188-QONUN: TARTIB-MASHQI — BITTA QOLIP, JAVOB OLDINDAN OCHILMAYDI (2026-10-04, F-1004-10/11)

**Foydalanuvchi:** «bu pageni layouti boshqa darslarda boshqacha … standard bo'lsa» · «odatda shunaqa layoutda edi» (m6-05).

1. `DragDropOrder` — to'liq kenglik: bo'sh joylar chapda (keng), bo'laklar o'ngda. Yoniga izoh-ustun qo'yilmaydi.
2. Tartibni tushuntiradigan matn faqat yechilgandan keyin (yashil xulosa); bo'sh joy belgisi javobni aytmaydi («bu yerga qo'ying» yoki rol-izohi).
3. **Tekshiruv:** `gates:qolip` q10; test halolligi — karta (izoh javobdan oldin ko'rinsa topilma).

**Bog'liq:** 142 (test halolligi), 180; QOIDALAR P-068.

## 12-AZ. ⛶ 189-QONUN: KATTALASHTIRISH TUGMASI MATN USTIGA TUSHMAYDI (2026-10-04, F-1004-12; 147/159 ga qo'shimcha)

1. Keng ekranda (≥1200px) ⛶ kontentdan tashqarida, `Zoomable` ning o'ng chetida (`right: -42px`); torroqda ichkarida — o'ng ustunning birinchi yorlig'iga 40px joy.
2. **Tekshiruv:** `lint:layout` D — ⛶ uchun piksel o'lchovi: bitta harf (≥6px) yopilsa topilma (ulush emas — uzun yorliqda 5% chiqib o'tib ketardi).

**Bog'liq:** 147, 159; QOIDALAR U-066.

## 12-BA. 🖥️ 190-QONUN: KOMPILYATOR EKRANI — BO'SH OYNA YO'Q, TASDIQ BIR MARTA (2026-10-04, F-1004-18/20)

**Foydalanuvchi:** «compilator page sig'may qolgan viewportga» · «kichkina text elementlar takror bo'lyapti, to'g'ri qilganini compilator pageda bildi, yana tashqarida shartmas».

1. Vazifa faqat console'da (HTML fayli yo'q, JS sahifaga yozmaydi) — «Natija» oynasi yo'q, console butun panel (`HtmlCompiler` `consoleOnly`, avtomatik).
2. 1280×773 da tepa kesilmaydi (`safe center`, panel qisqaradi). Starter izoh qatori ≤ 56 belgi (muharrirda o'ngdan kesilmaydi).
3. Kompilyatordan qaytgach tashqarida takror tasdiq yo'q: oldingi bosqich chipi («✓ Belgilandi…»), «✅ Uchala shart bajarildi», «Bajarildi — … sayqallang» — olinadi;
   faqat «Davom etish» yonadi (179).
4. **Tekshiruv:** `gates:qolip` q12; surat (1280×773 + 393).

**Bog'liq:** 179, 147; QOIDALAR U-067.

## 12-BB. 📱 191-QONUN: TELEFON RAMKASI — BITTA, HAQIQIY NISBATDA; WEB — BRAUZER OYNASI (2026-10-04, F-1004-27)

**Foydalanuvchi:** «telefon framelarni sal realistic qiling» · «tellni haqiqiy qilaylik, qaysidir darsda uzunroq normalni bor ekan».

1. Bitta ramka: 196:348 nisbat (joy tor bo'lsa 176×312 yoki 140×246 — o'sha nisbat), tepada status-qatori (9:41, signal, batareya) va kamera-orol, pastda uy-chizig'i;
   ilova mazmuni status-qatoridan pastda. Namuna: `MobileAppPracticeLesson` `Phone`.
2. «Web ko'rinishi» telefon ichida ko'rsatilmaydi — brauzer oynasi (`Browser`: uch nuqta + manzil qatori).
3. **Tekshiruv:** surat; `lint:layout` E (balandroq telefon tugmani pastki chiziqdan tushirmasin).

**Bog'liq:** 147, 163; QOIDALAR U-068.

## 12-BC. 🎫 192-QONUN: YAKUN BANNERLARI — PLATFORMA STANDARTI, QAT'IY (2026-10-04, F-1004-25 → F-1004-57 qayta yozildi)

**Tarix:** F-1004-25 da QA iborasi («biri rounded, biri to'rtburchakroq») bo'yicha 6-Modulda ikkala banner 22px va to'liq enga keltirilgan edi.
**Foydalanuvchi (77, 04.10 kech):** «CODE STRIKE va uyga vazifa boshqacha bo'pti … tex uroklarda qara, bunaqa juda to'rtburchak emas, o'shalardagiday qil
barchasiga va qoidalarimizga qat'iy kirit». O'lchov: 1–5-Modul va PM'dagi 84 dars bir xil shaklda — standart shu.

1. **CODE STRIKE** — kapsula: `.cs-cap { border-radius: 999px }`, to'liq en.
2. **«Uyga vazifa»** — `.hw-big { border-radius: 22px }`, `.hw-big-wrap { align-self: center; width: min(560px, 100%) }` — o'rtada, 560px gacha.
3. Bu shakl hamma darsda AYNAN bir xil; yangi modul ham shundan chiqmaydi.
4. **Tekshiruv:** `gates:qolip` q11 — hamma modulda **error** (04.10: 98 dars toza).

**Saboq (qolip qoidasi):** umumiy element o'zgartirilishidan oldin platformadagi mavjud standart o'lchanadi; ko'pchilik darsdagi shakl — standart, yangi
qonun undan chetga chiqmaydi (foydalanuvchi aytmaguncha).

**Bog'liq:** 177; QOIDALAR U-069.

## 12-BD. 🧱 193-QONUN: UMUMIY QOLIP — DARS 7 EKRAN TURIDAN YIG'ILADI (2026-10-04, F-1004 2-qism D1; D9 pilot — 6-Modul 1-dars)

**QA:** «bir strukturadagi page har darsda har xil … 20 page bo'lsa, 4 xil page darslarda bir xil bo'lsa yaxshi». O'lchov (6-Modul): har dars o'z
komponent nusxalarini saqlaydi (`DragDropOrder` 9 darsda 9 nusxa), shuning uchun bir turdagi ekran har darsda boshqacha chiqadi.

1. Ekran turlari — `src/qolip/` dagi umumiy komponentlar: **QKirish** (sarlavha-savol · Mentor · maket · 2–3 variant) · **QTushuncha** (bashorat? ·
   chapda harakat · o'ngda vizual o'zgaradi · natija qatori · bitta xulosa — 184) · **Test** (darsning `QuestionScreen`i — jonli-ball relsi) ·
   **QKod** (chap: vazifa + Yordam + «Bajardim» o'ngda · o'ng: muharrir · bir balandlik — 190) · **QVoqea** (nuqtalar · slayd-karta + chizilgan maket — 186) ·
   **QMustaqil** (chiplar 1/2/3 · forma · Yordam — bitta ustun) · **QYakun**.
2. Yordamchilar ham umumiy: `QBashorat` (181) · `QTaxmin` (natija qatori) · `QQadamlar` (163.8) · `QXulosa` (162) · `QXato` · `QChip` · `QKarta`.
3. Darsning o'z vizuali (masalan 1-darsning `SysMap`, `SiteMock`) — dars faylida, bitta manbadan (180); bosiladigan qismlari `// qolip-maket:` izohida e'lon qilinadi.
4. **Qamrov:** yangi modul darslari faqat qolipdan (error). 6-Modulning qolgan 13 darsi MD v3 bilan qolipga o'tadi (hozircha warn — navbat).
5. **Tekshiruv:** `gates:qolip` q15 (ScreenN qolip turidan yig'ilmagan) · q16 (qolipsiz dars). Qo'llanma: `src/qolip/QOLIP.md`.

**Bog'liq:** 184, 186, 190, 194–196; QOIDALAR U-070.

## 12-BE. 🔘 194-QONUN: TUGMA IKKI DARAJADA (2026-10-04, F-1004 2-qism D2)

**QA:** «buttonlar 2 ta bo'lsa — primary va secondary — va bir qolipda». O'lchov: 6-Modulda 15 dan ortiq ko'rinish, har darsda 22–28 xil tugma sinfi.

1. **Asosiy** (`QTugma`) — to'la modul rangi, ekrandagi keyingi harakat, ekranda bitta. **Ikkinchi darajali** (`QTugma ikkinchi`) — oq, chegarali.
2. Tanlov — `QChip` (holat: tanlangan · to'g'ri · xato). «Yordam ▸» — tugma emas, matn-ochgich. Navigatsiya («Orqaga» / «Davom etish») — darsning karkasi.
3. Ikkala daraja ham o'ng chetda (187).
4. **Tekshiruv:** `gates:qolip` q14 — qolip-darsda `<button>` klassi qolip/infratuzilma ro'yxatida bo'lmasa (maket tugmasi — `// qolip-maket:` bilan).

**Bog'liq:** 187; QOIDALAR U-071.

## 12-BF. 🎨 195-QONUN: RANG — UCH GURUH, TO'QQIZ TOKEN (2026-10-04, F-1004 2-qism D3)

**QA:** «asosan 3 ta asosiy rang bo'lsa, darslar consistent». O'lchov: har darsda 16–23 rang-token, 68–97 xil rang kodi.

1. **Neytral** (5): bg · paper · line · ink2 · ink. **Modul rangi** (2): accent · accentSoft (texnik — to'q sariq, PM — binafsha). **Holat** (2): ok · err.
2. Palitra `qolipRang('tex' | 'pm')` dan olinadi; blue/honey/grape/violet/amber yo'q. Holat foni — `fon(T.ok)` / `fon(T.err)` (token emas, shaffof qatlam).
3. Istisno: kod bo'yog'i (`CODE`) va o'yin qatlami (arena, podium).
4. **Tekshiruv:** `gates:qolip` q13 — `T.<nom>` ruxsat ro'yxatida emas yoki palitra `qolipRang` dan emas.

**Bog'liq:** 185; QOIDALAR U-072.

## 12-BG. 🚫 196-QONUN: QOLIP-DARSDA EMOJI YO'Q (2026-10-04, F-1004 2-qism D4; 161/185 ning yakuniy shakli)

**QA:** «ortiqcha emoji AI generated slop dek ko'rsatadi». Foydalanuvchi: «emojilarni o'rniga real cardlarni qo'yaylik». O'lchov: 185 dan keyin ham
har darsda 38–63 emoji.

1. Qolip-dars yuzasida emoji umuman yo'q: sarlavha, eyebrow, karta, ro'yxat, tugma, mentor paneli, takrorlash oynasi ham.
2. Ma'no — haqiqiy karta yoki chizilgan maket (186). ✓ ✗ → ↔ ▸ kabi belgilar emoji emas.
3. Istisno faqat o'yin qatlami: nishonlar, arena, podium, bayram.
4. **Tekshiruv:** `lint:emoji` qolip-dars rejimi (har qanday emoji — error).

**Bog'liq:** 161, 185, 186; QOIDALAR U-073.

## 12-BH. 🔁 197-QONUN: SARLAVHA VA MENTOR BIR GAPNI AYTMAYDI (2026-10-04, F-1004-31)

**Foydalanuvchi (44, 56):** «title ham bot ham bitta narsani aytyapti … boshqa pagelarda ham audit qilgani yaxshi». O'lchov: 6-Modulda 33 ekran.

1. Sarlavha qisqa (savol yoki mavzu); Mentor faqat yangi narsani aytadi — sarlavhani qaytarmaydi.
2. O'lchov: sarlavhaning mazmunli so'zlari (≥4 harf, ≥3 ta) ≥50% i keyingi Mentor gapida bo'lsa — topilma.
3. **Tekshiruv:** `lint:olchov` «sarlavha≈Mentor %» — 6-Modul va yangi modullarda error, eski modullarda warn (130 ta, KATTA).

**Bog'liq:** 109, 162, 164; QOIDALAR T-072; KORPUS §225.

## 12-BI. 📏 198-QONUN: KARTA MAZMUN BALANDLIGIDA, YAKUN — BITTA XULOSA (2026-10-04, F-1004-40/42/44/46)

**Foydalanuvchi (58, 60, 62, 65):** karta ekranni to'ldirib cho'zilgan; ustunlar har xil balandlikda; yozgandan keyin ikki gap + «🎯 Bugungi qoida».

1. «flex-grow + max-height» bilan kartani bo'sh joyga cho'zish yo'q — karta mazmun balandligida, natija harakat yonida.
2. Ikki ustunli ekranda ustunlar bir balandlikda (`align-items: stretch`), oxirgi karta qolgan joyni oladi.
3. Hook kartasi va variantlar Mentor bilan bir chetda (bitta ustun kengligi).
4. Yozib bo'lgach — bitta xulosa (≤110, emojisiz). PM 106f(b) ga tuzatish.

**Bog'liq:** 162, 174; PM 106f; QOIDALAR U-074.

## 12-BJ. 🎯 199-QONUN: ISH TUGAGACH — PANEL YOPILADI, NATIJA FOKUSGA CHIQADI (2026-10-04, F-1004-53 — foydalanuvchi: «globalne bu buyruq»)

**Foydalanuvchi (73):** «ishlar tugagach sraze ishlar yopilsin, ula maydonga kelib biroz kattalashib animatsiyada e'tiborni tortsa … shunaqa vaziyatni yoritishing kerak».

1. Tushuncha-ekranda harakat paneli (ishlar ro'yxati, qadamlar, kalitlar, qo'shish tugmalari) vazifa tugagach **yopiladi**.
2. Natija (vizual) butun enga chiqadi va bir lahza kattalashib qaytadi (`q-fokus`, ~0,6 s; `prefers-reduced-motion` da harakatsiz).
3. Oxirgi harakatning natijasi avval ko'rinadi: yopilish 0,7–1,5 s kechikadi (`useTugadi(done, ms)`); qayta kirganda (saqlangan javob) — darhol.
4. Ataylab qoldirish mumkin (maket va natija juftligining o'zi natija bo'lsa) — `tugadi={false}` bilan, sababi izohda.
5. **Tekshiruv:** `gates:qolip` q18 — xulosasi bor `QTushuncha` da `tugadi` yo'q.

**Bog'liq:** 184, 193, 198; QOIDALAR U-075.

## 12-BK. ⛶ 200-QONUN: VIZUAL KATTALASHADI VA JONLI — O'Z TURIGA MOS, ME'YORDA (2026-10-04, F-1004-50/52/54/55/56)

**Foydalanuvchi (70, 72, 74, 75, 76):** «zoomable kerak — faqat o'ng tomondagi», «juda jonsiz bo'lib qolgan … me'yorda vizual ko'rk ham beraylik, minimalist».

1. Vizual har doim ⛶ ichida (`zoom={Zoomable}`) — harakat paneli (qadamlar, ro'yxat) tashqarida.
2. Maket o'z turiga mos ko'rinadi: brauzer — nuqtali sarlavha va manzil qatori; server — qorong'i panel, yonib-o'chadigan holat chirog'i, `$` qatorlari;
   chat — sarlavha, kelgan/yuborilgan pufaklar; telefon — ramka va «orol» (191); tizim xaritasi — tugunlarda chizilgan belgilar.
3. Harakat ma'noni ko'rsatadi, bezak emas: ma'lumot oqayotgan chiziq — oqim; yangi ulanish — chizilib chiqadi; so'rov konverti — modul rangida,
   javob — yashil; yangi qator/element — bir lahza ajralib kiradi; bo'sh joy — sokin skelet.
4. Minimal: rang — 9 token (195), emoji yo'q (196), bitta joyda bitta harakat; `prefers-reduced-motion` da hammasi to'xtaydi.
5. Ketma-ket jarayon bosqichma-bosqich bosiladi — javob ham (so'rov Frontend → Backend → Database, javob Database → Backend → Frontend).
6. **Tekshiruv:** `gates:qolip` q17 (zoom yo'q) · surat 1280 va 393 · harakatni ko'z bilan.

**Bog'liq:** 184, 186, 189, 191; QOIDALAR U-076.

## 12-BL. 🧭 201-QONUN: KIRISH VA REJA — HAMMA DARSDA BIR STANDART (2026-10-04, F-1004-47/48)

**Foydalanuvchi (67, 68):** «1-page hammasida standart bo'lishi kerak … tex uroklardan qara», «qadam ham buzilgan dizayni».

1. Kirish ekrani — texnik darslar standarti: chapda maket (+ ikkinchi darajali «▶ …» tugma, bosilgach «✓ …» izohga aylanadi), o'ngda yorliq-savol va
   **radio-belgili variantlar**, ostida javob (Aynan! / Qiziq fikr!). Hammasi ⛶ ichida.
2. Reja ekrani — chapda «Dars oxirida …» va jonli chizma, o'ngda **«01 · matn · teg»** qadam-kartalari.
3. Dizaynni qolip beradi: dars faqat ma'lumot uzatadi (`QKirish variantlar/tanlov/onTanla`, `QReja qadamlar`) — o'z ko'rinishini yasay olmaydi.

**Bog'liq:** 193; QOIDALAR U-077.

## 12-BM. 💚 202-QONUN (ASOSIY): XULOSA YASHILI — TEXNIK DARSLARDAGI BITTA YASHIL (2026-10-04, F-1004-58)

**Foydalanuvchi (78):** «bu yerdagi background yashilni qonun qilib yozib ol, shtobe tex uroklarimiznikiday yashil rang bo'lsin … buni asosiy qonun qilib ol».
O'lchov: 83 texnik darsning `.frame-success` foni — `#E3F0E8` + yashil soya; PM darslarda `#E4F5EC`; qolip xulosasi esa shaffof (kulrangga o'xshardi).

1. To'g'ri/yakun/xulosa foni hamma joyda **bitta**: `#E3F0E8` (`successSoft` / qolipda `okFon`), soya `0 6px 16px -6px rgba(31,122,77,0.22)`, radius 12px.
2. Qolip: `QXulosa` aynan shu ko'rinishda; `QChip ok` foni ham shu. Xato foni — `#FAE3E0` (`errFon`).
3. Platforma bo'yicha bitta qiymat: 04.10 da 47 PM darsi `#E4F5EC` → `#E3F0E8` (133 fayl bir xil).
4. **Tekshiruv:** `gates:qolip` q19 — `successSoft` boshqa qiymat yoki `.frame-success` foni token emas — hamma modulda **error**.

**Bog'liq:** 185, 195; QOIDALAR U-078.

## 12-BN. 📝 203-QONUN: TEST VA TARTIB-MASHQI — QOLIPDAN, TEXNIK DARSLAR STANDARTIDA (2026-10-04, F-1004-59)

**Foydalanuvchi:** «test ekranlarini ham qolipga o'tkaz».

1. Test ekranining ko'rinishi — qolip `QTest` (savol · A–D variantlar · javob bloki `QTestJavob`): texnik darslardagi test bilan AYNAN bir
   (oq variant, harf; to'g'ri — yashil 202; tanlangan xato — modul rangi; qolgani xira; jonli kutish — modul rangida halqa).
2. Mantiq darsda qoladi: jonli ball, bitta urinish, mentor «Natijani ochish», takrorlash oynasi, kalitlar (INLINE_KEYS) — o'zgarmaydi.
3. Tartib-mashqi — faqat qolip `QTartib` (188 ning yagona manbasi); darsda `DragDropOrder` nusxasi bo'lmaydi.
4. **Tekshiruv:** `gates:qolip` q20 — qolip-darsda `QuestionScreen` `<QTest>` siz yoki `DragDropOrder` nusxasi.

**Bog'liq:** 105 (h-ask), 188, 193, 202; QOIDALAR U-079.

## 12-BO. 🃏 204-QONUN: KARTOCHKA VA YAKUN EKRANI — QOLIPDAN, TEXNIK DARSLAR STANDARTIDA (2026-10-04, F-1004-60 · 6-Modulni yopish Q2 A)

**Qaror:** «kartochkalar va yakun ekrani qolipga — texnik darslar standarti aynan; podium/arena darsda; nusxa bo'lsa — xato».

1. **`QKartochka`** — «O'zingizni sinab ko'ring» mexanikasi va ko'rinishi (navbat, 3D aylanish, «Bildim» / «Takrorlash», uchib chiqish, javob
   o'lchami 4 pog'ona — PM-107 havola) bitta manbada. Dars faqat tarjima qilingan `cards` beradi. Kontent tepadan boshlanadi (174; texnik
   darslarda o'rtada edi — qolipda tuzatildi).
2. **`QYakun`** — yakun ekrani: chiplar (bajarilgan ish + «N/M to'g'ri», F-1003-04) · bitta sarlavha · CODE STRIKE joyi (`cta`) · «Endi siz
   bilasiz» · «Uyga vazifa» banneri (192: 22px, o'rtada, `min(560px,100%)`) + karta · nishonlar to'ri. Qolipning o'z yorliqlari («Bildim»,
   «Uyga vazifa»…) `til` bilan ikki tilda — 14 darsda bir xil.
3. **Darsda qoladi:** CODE STRIKE (`CsWordmark`), arena (`QuizArena`), podium — jonli o'yin qatlami; PM darsining `HwCard` — `uyga` ga tayyor
   karta bo'lib uzatiladi.
4. Eski PM «natija — bitta karta» turi endi `QNatija`.
5. **Tekshiruv:** `gates:qolip` q21 — qolip-darsda `Flashcards`/`.fc-card`/`hw-big` tugmasi/`ach-grid` nusxasi yoki `SummaryScreen` `<QYakun>` siz
   (asl pilot nusxasida 2 ushlandi); q11 endi `src/qolip/qolipCss.js` ni ham o'lchaydi (radius 30px sinovi ushlandi).

**Bog'liq:** 174, 192, 193, 202, 203; QOIDALAR U-081.

## 12-BP. 🏷 205-QONUN: MENYU NOMI = DARS ICHIDAGI NOM (2026-10-04, F-1004-60 · 5-Modulni yopish Q5 A)

1. Menyudagi sarlavha (`App.jsx` va modulning QA-menyusi `src/m*-demo/`, `src/texnik-demo/`) darsning `LESSON_META.lessonTitle` bilan **aynan bir**;
   «Keyingi dars — «…»» qatori va `LiveGate` sarlavhasi ham shu nom. 5-Modulda 3 nom (m5-04 · m5-09 · m5-10 sub) + 4 eskirgan havola tuzatildi.
2. **Qamrov: HAMMA modul** (04.10 kech, yopishdan keyingi Q2 A): App.jsx 61 nom + QA-menyular tenglashdi, farq 0/109. LMS'ga ta'sir yo'q —
   u yerda material nomi allaqachon dars ichidagi nomdan (ROYXAT «Dars ichidagi nom»).

**Bog'liq:** 150 (sarlavha), 164; QOIDALAR T-075.
