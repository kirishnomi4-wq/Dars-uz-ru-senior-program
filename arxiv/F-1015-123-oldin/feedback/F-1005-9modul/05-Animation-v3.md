# 9-Modul · 5-dars «Animatsiya: interfeys javob beradi» — MD v3

Fayl: `src/7-Modull/AnimationLesson.jsx` · 20 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Kalit `m7-05` · TEX (modulning texnik cho'qqisi) · qolip: texnik dars (QTushuncha, QKod, QTest) + bitta amaliyot bloki.
Menyu nomi (DE-205, App.jsx `m7-05`): «Animatsiya: interfeys javob beradi» · oldingi — `m7-04` «Mini-MVP arxitekturasi» · keyingi — `m7-06` «Birinchi odam kirganda nimani ko'rasiz?».
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatga keltiriladi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) kodda o'zgarmaydi.
Vaqt: ≈ 90 daqiqa, shundan amaliyot bloki ≈ 25.

---

Tashqi audit (ChatGPT) Filtri: `05-FILTR.md` — 05.10.2026 (atamalar ta'rifi — 05-q0 javobidan keyin).

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9):** dars oxirida «Maydon» saytining uchta elementi bosishga javob beradi — o'quvchi ularni avval kod oynasida **qo'lda** yozadi
   (QKod, qaror 4), keyin repo `maydon` ga qo'shadi (teg `dars-05-done`):
   1) vaqt katagi bosilganda kichrayib qaytadi (`transform` + `transition`);
   2) band bo'lgan katakning rangi silliq o'zgaradi (`transition`);
   3) «Band qilindi» belgisi Motion bilan chiqadi va so'nib ketadi.
2. **Bugungi asosiy fikr (P-013):** Animatsiya bezak emas: u odamga «bosildi», «o'zgardi», «tayyor» deb javob beradi.
   Ortiqcha harakat va `prefers-reduced-motion` — bitta qisqa joyda (12-ekran).
3. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim):**
   - **sayt** — React ilova (`web/`, `localhost:5173`); **Backend**, **Database** — bugun ishlatilmaydi (band qilish hozircha faqat saytda — TAYANCHGA SAVOL 2).
   - **vaqt katagi** (qisqasi **katak**) — bitta soatlik oraliq, masalan 18:00–19:00. **band qilish · band** — katakni egallash · egallangan katak. **o'yinchi** — saytdan foydalanadigan o'smir.
   - **animatsiya** — interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi; bu darsda — holat o'zgarishini silliq ko'rsatadiganlari (3-ekranda, harakatdan keyin tug'iladi; GATE M 05-q0).
     **mikro-harakat** — foydalanuvchi harakatiga yoki holat o'zgarishiga berilgan kichik vizual javob; bizning misolda — bosilgan katak kichrayadi (5-ekran xulosasida, bir marta + kartochka).
   - **`transform`** — elementni kichraytiradi yoki kattalashtiradi, qo'shni elementlar joyida qoladi (bugun faqat `scale`). **`:active`** — element bosib turilgan payt.
   - **`transition`** — o'zgarishni bir zumda emas, berilgan vaqt ichida silliq bajaradi: qaysi xususiyat va qancha vaqt (`0.15s` — 0.15 soniya).
   - **Motion** — React uchun animatsiya kutubxonasi; matnda **bir marta** (9-ekran): «Motion (oldingi nomi Framer Motion)». Paket `motion`, import `motion/react`.
     `motion.div` · `initial` (chiqishdan oldingi holat) · `animate` (kelib to'xtaydigan holat) · `exit` (ketayotgandagi holat) · `AnimatePresence` (React elementni olib tashlayotganda `exit` animatsiyasini ishlatishga imkon beradi).
   - **`prefers-reduced-motion`** — qurilmada harakatni kamaytirish yoqilganini sayt shu orqali biladi.
   - **belgi** — faqat «Band qilindi» belgisi ma'nosida (tayanch 3-bo'lim). **hodisa** so'zi bu darsda **ishlatilmaydi** — u 6-darsda analitika ma'nosida keladi (T-015).
   - **prompt** — Antigravity'ga yoziladigan matn (6-Moduldan, qaror 8 so'zi); «talab» 7-darsda (TAYANCHGA SAVOL 5).
4. **O'tilgan so'zlar (grep, so'zma-so'z olingan):** Selektor · Xususiyat · Qiymat; klass nuqta bilan `.row`; `color` — matn rangi, `background-color` — fon rangi; hex kod (rang raqami) —
   `src/1-Modull/CssLesson1.jsx` (`m1-06`). `className`, `onClick`, `useState` — 3-Modul React darslari. `npm install` — «kerakli kutubxonalarni yuklab oladi» (`ReactFirstComponentLesson`).
   hover — «sichqoncha ustiga kelganda» (`src/2-Modull/PracticeLesson1.jsx`, faqat arena distraktorida). Antigravity, repo, teg, «Shu xato chiqdi: {xato}. Tuzat.» — 6-Modul bloklari.
   `transition`, `transform`, `:active`, Motion — **yangi** (korpus §39: avval oddiy gap, keyin nom).
5. **Metafora yo'q** (tayanch). Qahramon yo'q — vazifani Mentor beradi.
6. **Toza yuza (185, D4):** tugma, variant va maket ichida emoji yo'q; maket chizilgan (CSS/SVG), logotip yo'q; rang — faqat holat foni.
7. **Manbalar (o'quvchiga ko'rinmaydi):** Motion — https://motion.dev/docs/react-quick-start («Motion for React (previously Framer Motion)», `npm install motion`, `import { motion } from "motion/react"`),
   https://motion.dev/docs/react-animate-presence (`exit` faqat `AnimatePresence` ichida, bevosita bolaga `key`), https://motion.dev/docs/react-accessibility
   (`MotionConfig reducedMotion="user"` — transform va layout animatsiyasini o'chiradi, `opacity` va `backgroundColor` qoladi) — 05.10.2026 tekshirildi.
   `prefers-reduced-motion` — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion («discomfort for those with vestibular motion disorders»; sozlama joylari:
   iOS Settings › Accessibility › Motion · Android Settings › Accessibility › Remove animations · Windows 11 › Accessibility › Visual Effects › Animation Effects) — o'quvchi matniga menyu nomi kirmaydi (P-028).

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. O'tgan darsda skelet ishga tushdi (`dars-04-done`):
  saytda statik vaqt kataklari bor, lekin bosilsa ekranda hech narsa o'zgarmaydi. Bugun shu kataklar javob beradi; kod — repo `maydon`, `dars-05-done`.
- **Hook:** o'quvchi katakni bosadi — ekran jim → «band bo'ldimi?» → sayt band qilgan, ekran ko'rsatmagan.
- **Bitta vizual — «Maydon» maketi** (bitta manba `KATAKLAR`, 163/180) + yonida kod parchasi (`App.css` yoki `App.jsx`); kod va maket birga o'zgaradi (09-dars naqshi):
  - brauzer oynasi (nuqtalar + manzil `localhost:5173`), ichida sarlavha «Maydon», kun yorlig'i «Shanba» (bosilmaydi), 6 ta vaqt katagi, 2 ustunda:
    16:00–17:00 · 17:00–18:00 **band** · 18:00–19:00 · 19:00–20:00 · 20:00–21:00 **band** · 21:00–22:00 (namuna ma'lumot — TAYANCHGA SAVOL 1);
  - katak holatlari: bo'sh (oq) · bosib turilgan (95%) · band (kulrang, kichik yozuv «band»); kataklar ostida belgi joyi: yo'q · chiqmoqda · turibdi · ketmoqda («Band qilindi: 18:00»);
  - maket rejimlari: **jim** (animatsiyasiz) · **javob beradi** (uch element) · **sekin ko'rsatish** (10 baravar sekin, oraliq holatlar xira chiziladi) · **harakat kamaytirilgan**.
  - Ishlatilishi: 0, 1, 2, 3, 6, 9, 10, 12, 14, 16 (A-blok o'ng tomoni — shu maketning kattasi). `prefers-reduced-motion` da maketning o'z harakati ham to'xtaydi (DE-200).
- **Rang yo'li** (bitta manba `RANG_YOLI`, 6-ekran «sekin ko'rsatish» yorliqlari va 15-ekran finali, P-063): O'yinchi katakni bosadi · Katakka `band` klassi qo'shiladi ·
  Brauzer 0.3 soniya oraliq ranglarni chizadi · Katak kulrang bo'lib qoladi.
- **Yakun:** Maydon bosishga javob beradi · keyingi dars — kim saytda nima qilayotganini o'lchash.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Bosganingizdan keyin katak band bo'ldimi?** (41)
- Mentor: O'tgan darsda Maydon sayti ishga tushdi, kataklar ekranda turibdi. Maketda 18:00–19:00 ni bir marta bosing.
- Maket (chap): «Maydon» maketi **jim** rejimda — 6 katak, 17:00–18:00 va 20:00–21:00 kulrang «band», qolgani oq.
- **Harakat → Vizual o'zgarish:** 18:00–19:00 ni bosish → ekranda hech narsa o'zgarmaydi: katak o'lchami ham, rangi ham o'sha, pastda yozuv yo'q. Shundan keyin variantlar faollashadi.
- Variantlar (radio, ballsiz):
  - Ha, endi katak band bo'ldi
  - Yo'q, katak bo'sh qoldi
  - ✔ Ekrandan bilib bo'lmaydi
- Javob — 3-variant: **Aynan!** Sayt katakni band qildi, ekran esa jim qoldi. O'yinchi yana bosadi yoki chiqib ketadi. (93)
- Javob — 1-variant: **Qiziq fikr!** Rost, sayt band qildi — lekin ekranda buni ko'rsatadigan hech narsa o'zgarmadi. (91)
- Javob — 2-variant: **Qiziq fikr!** Aslida sayt band qildi — ekran buni ko'rsatmadi, shuning uchun katak bo'sh ko'rindi. (96)
- Javobdan keyin: maket ostida kulrang qator ochiladi — «Sayt ichida: 18:00–19:00 — band»; katak esa hamon oq (sayt bilgan narsani ekran aytmagani ko'rinadi).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun Maydon'ga uchta animatsiya yozasiz.** (41)
- Mentor: Avval har birini shu yerda sinab ko'rasiz, keyin Maydon repo'siga o'zingiz yozasiz.
- Chap — «Dars oxirida»: maket **javob beradi** rejimida, bir marta o'zi o'ynaydi (DE-200): 18:00–19:00 bosiladi → kichrayib qaytadi → rangi silliq kulranglashadi →
  pastdan «Band qilindi: 18:00» chiqadi va 3 soniyadan keyin so'nadi.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` bilan mos — P-015):
  - 01 · Bosilgan katak kichrayib qaytadi · `transform`
  - 02 · Band katakning rangi silliq o'zgaradi · `transition`
  - 03 · «Band qilindi» belgisi chiqib, so'nadi · `Motion`
  - 04 · Uchalasi Maydon repo'sida ishlaydi · `repo`
- Pastki qator (mono, kichik): repo `maydon` · boshlanish `dars-04-done` · tayyor namuna `dars-05-done`
- Tugmalar: Orqaga · Boshlaymiz

- O'qituvchi eslatmasi (audit, dars hajmi): 2–3 va 6-ekranlarga ortiqcha vaqt bermang — Motion (9–11-ekranlar) darsning yangi va eng qiyin qismi.

## 2 · Katak kichrayadi  ← QTushuncha
- Eyebrow: Tushuncha · transform
- Sarlavha: **Bosilgan katak qanchaga kichraysin?** (35)
- Mentor: Ko'p ilovalarda tugma barmoq ostida biroz cho'kadi — odam shundan bosilganini sezadi. Qiymatni tanlang va 18:00–19:00 ni bosib turing.
- Bashorat (ballsiz, 181): **Katak kichraysa, qo'shni kataklar nima bo'ladi?** · Ular ham suriladi · Joyida qoladi · Ular ham kichrayadi — tanlov saqlanadi.
- Chap — kod (`App.css` parchasi), qiymat tugmalari pulsatsiya halqasi bilan (168): `1` · `0.95` · `0.8`
  ```css
  .katak:active {
    transform: scale(1);
  }
  ```
  Kod yonida kulrang izoh: `:active` — bosib turilgan payt.
- O'ng — maket (**jim** rejim).
- **Harakat → Vizual o'zgarish:** qiymatni bosish → kodda qiymat almashadi; 18:00–19:00 ni bosib turish → katak tanlangan o'lchamga kichrayadi
  (`1` — o'zgarmaydi · `0.95` — biroz cho'kadi · `0.8` — yozuvi bilan birga ancha kichrayadi), qo'yib yuborilganda bir zumda qaytadi.
  Qo'shni kataklar joyidan qimirlamaydi — ularning chegarasi bir lahza yonadi.
- Nom qatori (3/3 dan keyin, bitta): Elementni shunday kichraytirish yoki kattalashtirishni `transform` qiladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: joyida qoldi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: `transform: scale(0.95)` katakni 95% gacha kichraytiradi, qo'shni kataklar joyida qoladi. (87)
- Tugadi (199): qiymatlar paneli yopiladi, maket va kod butun enga; vizual ⛶ ichida (q17).
- Tugma (pastki): 3 qiymatni sinang (N/3) → Davom etish

## 3 · Sakrab yoki silliq  ← QTushuncha
- Eyebrow: Tushuncha · transition
- Sarlavha: **Kichrayish qancha vaqt davom etsin?** (35)
- Mentor: Hozir katak bir zumda cho'kib, bir zumda qaytadi — ko'z buni sakrash deb ko'radi. Vaqtni tanlang va katakni bosing.
- Bashorat (ballsiz): **0.15 soniya ko'zga qanday ko'rinadi?** · Sezilmaydi · Silliq · Sekin (bitta o'lchovning uch darajasi, o'sish tartibida — §43).
- Chap — kod, vaqt tugmalari pulsatsiyada: `0s` · `0.15s` · `1s`; izoh: `s` — soniya.
  ```css
  .katak {
    transition: transform 0s;
  }
  .katak:active {
    transform: scale(0.95);
  }
  ```
- O'ng — maket + kalit «Sekin ko'rsatish»; katak ostida kichik soniya hisoblagichi.
- **Harakat → Vizual o'zgarish:** vaqtni bosish → kodda vaqt almashadi; katakni bosish → `0s` — sakraydi · `0.15s` — silliq cho'kib, silliq qaytadi ·
  `1s` — sekin kichrayadi va qo'yib yuborilgach ham sekin qaytadi, hisoblagich «1.0 s» gacha boradi.
  «Sekin ko'rsatish» yoqilsa `0.15s` 10 baravar sekin o'ynaydi, katak atrofida oraliq o'lchamlar xira chiziladi (100% → 98% → 96% → 95%).
- Nom qatori (3/3 dan keyin): Interfeysdagi shunday ko'rinadigan harakat — animatsiya; bu darsda biz holat o'zgarishini silliq qilamiz. CSS'da unga vaqtni `transition` beradi.
- Natija qatori: «Taxminingiz: … · haqiqatda: silliq».
- Xulosa: `transition` o'zgarishni berilgan vaqt ichida silliq bajaradi. Maydon'da kichrayish — 0.15 soniya. (96)
- Tugadi (199) · Tugma (pastki): 3 vaqtni sinang (N/3) → Davom etish

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Katak bosilganda sakrab kichrayadi. Kodga nima qo'shasiz?** (8 so'z)
  - `scale` ichiga kichikroq son yozaman
  - `transform` ni `.katak` ga ko'chiraman
  - ✔ `.katak` ga `transition` qo'shaman
  - `transform` o'rniga `transition` yozaman
- Kalit: **C** (index 2). Variantlar: 34 · 34 · 30 · 36 belgi; `transform`/`transition` so'zlari uch variantda bor (kalit so'z faqat to'g'rida emas).
- To'g'ri izohi: `transition` kichrayishga vaqt beradi — katak silliq cho'kib qaytadi.
- Xato izohlari (≤60):
  - A: Son kichrayishni oshiradi, sakrash esa qoladi. (46)
  - B: Unda katak bosilmasdan ham doim kichik turadi. (46)
  - D: `transform` bo'lmasa, katak umuman kichraymaydi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 5 · 1-element: bosilgan katak  ← QKod
- Eyebrow: Kod yozish · 1-element
- Sarlavha: **Bosilgan katakni silliq kichraytiradigan kod yozamiz.** (53) — §19 sarlavha oilasi
- Mentor: Kodni o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. `.katak:active` qoidasini yozing: `transform: scale(0.95);`
  2. `.katak` qoidasiga qo'shing: `transition: transform 0.15s;`
  3. Natija oynasida katakni bosing — u silliq kichrayib qaytsin.
- Yordam: Natija o'zgarmasa, `:active` oldida bo'sh joy yo'qligini va `0.15s` da «s» harfi borligini tekshiring.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi.
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; Mentor: kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz) → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <h1>Maydon · Shanba</h1>
    <div class="kataklar">
      <button class="katak">16:00–17:00</button>
      <button class="katak">18:00–19:00</button>
      <button class="katak">19:00–20:00</button>
    </div>
    ```
  - `style.css` — o'quvchi yozadi (boshlang'ich holat):
    ```css
    .katak {
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 14px 18px;
      /* 2) transition shu yerga */
    }
    /* 1) .katak:active qoidasi shu yerga */
    ```
- Kod oynasi sarlavhasi: `style.css — bosilgan katakni kichraytiring`
- Shart xabarlari (≤60):
  - 1 — `.katak:active` ichida `transform: scale(0.95)` bo'lsin. (52)
  - 2 — `.katak` dagi `transition` da `transform` va vaqt bo'lsin. (52)
- **Harakat → Vizual o'zgarish:** o'quvchi yozadi → natija oynasida kataklar; har shart bajarilganda ✓; katakni bosish → silliq kichrayib qaytadi.
  «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Katak bosilganini ko'rsatadi. Harakatga berilgan shunday kichik javob mikro-harakat deyiladi. (91)

## 6 · Rang ham silliq o'zgaradimi?  ← QTushuncha
- Eyebrow: Tushuncha · rang
- Sarlavha: **Band bo'lgan katak rangi qanday o'zgaradi?** (42)
- Mentor: Katak band bo'lsa, unga `band` klassi qo'shiladi va fon kulrang bo'ladi. `transition` ga nima qo'shishni tanlang va bo'sh katakni bosing.
- Bashorat (ballsiz): **`transition: transform 0.15s` turibdi. Rang ham silliq o'zgaradimi?** · Ha, silliq · Yo'q, sakraydi
- Chap — kod:
  ```css
  .katak {
    transition: transform 0.15s;
  }
  .katak.band {
    background-color: lightgray;
  }
  ```
  Izoh (kulrang): `.katak.band` — `katak` va `band` klassi ikkalasi bor element.
  Ostida bitta tugma (pulsatsiya): `, background-color 0.3s` ni qo'shish.
- O'ng — maket + «Sekin ko'rsatish» kaliti.
- **Harakat → Vizual o'zgarish:** 18:00–19:00 ni bosish → katakka `band` qo'shiladi (kodda `.katak.band` qatori yonadi), rang **sakrab** kulrang bo'ladi.
  Shu tugmani bosish → `transition` qatori `transform 0.15s, background-color 0.3s` bo'ladi; 19:00–20:00 ni bosish → rang 0.3 soniyada silliq kulranglashadi.
  «Sekin ko'rsatish» yoqilsa katak ostida `RANG_YOLI` yorliqlari navbat bilan yonadi: O'yinchi katakni bosadi · Katakka `band` klassi qo'shiladi ·
  Brauzer 0.3 soniya oraliq ranglarni chizadi · Katak kulrang bo'lib qoladi; katakda oqdan kulranggacha oraliq ranglar ko'rinadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: sakradi — `transition` da rang yo'q edi».
- Xulosa: `transition` faqat unda yozilgan xususiyatni silliq qiladi; ikkinchisi vergul bilan qo'shiladi. (93)
- Tugadi (199) · Tugma (pastki): 2 katakni band qiling (N/2) → Davom etish

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Band katak rangi sakrab o'zgaryapti. `transition` ga nima yozasiz?** (9 so'z)
  - ✔ `transform 0.15s, background-color 0.3s`
  - `transform 0.15s; background-color 0.3s`
  - `transform 0.15s, background-color 3s`
  - `transform, background-color 0.3s`
- Kalit: **A** (index 0). Variantlar: 38 · 38 · 36 · 32 belgi — hammasi kod, to'g'risi yolg'iz eng uzun emas.
- To'g'ri izohi: Ikki xususiyat vergul bilan yoziladi, har birining o'z vaqti bor.
- Xato izohlari (≤60):
  - B: Nuqta-vergul qatorni tugatadi — rang unga kirmay qoladi. (56)
  - C: 3 soniya silliq, lekin o'yinchi kutib qoladi. (45)
  - D: `transform` vaqtsiz qoldi — kichrayish yana sakraydi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · 2-element: band katak  ← QKod
- Eyebrow: Kod yozish · 2-element
- Sarlavha: **Band katak rangini silliq o'zgartiradigan kod yozamiz.** (54)
- Mentor: Katakka `band` klassini `app.js` qo'shadi — siz faqat CSS'ni yozasiz.
- Chap — vazifa (3 band):
  1. `.katak.band` qoidasini yozing: `background-color: lightgray;`
  2. `transition` ga vergul bilan qo'shing: `background-color 0.3s`
  3. Bo'sh katakni bosing — rangi 0.3 soniyada kulranglashsin.
- Yordam: Ikki klass orasida bo'sh joy yo'q: `.katak.band`. Rang sakrasa, `transition` da vergul turganini tekshiring.
- Tugma (o'ngda): Bajardim
- O'ng — `HtmlCompiler`, fayllar:
  - `index.html` — tayyor: 4 katak, 17:00–18:00 oldindan `class="katak band"`;
  - `app.js` — tayyor, o'zgarmaydi:
    ```js
    document.querySelectorAll('.katak').forEach(k => {
      k.addEventListener('click', () => k.classList.add('band'));
    });
    ```
  - `style.css` — o'quvchining 5-ekrandagi kodi bilan boshlanadi (saqlangan holat; bo'lmasa — namuna yechim).
- Kod oynasi sarlavhasi: `style.css — band katak rangini silliq qiling`
- Shart xabarlari (≤60):
  - 1 — `.katak.band` ichida `background-color` bo'lsin. (44)
  - 2 — `transition` da `background-color` va vaqt bo'lsin. (47)
  - 3 — `transform 0.15s` ham `transition` da qolsin. (41)
- **Harakat → Vizual o'zgarish:** `.katak.band` yozilishi bilan oldindan band 17:00–18:00 darhol kulrang bo'ladi; bo'sh katakni bosish → rang silliq o'zgaradi,
  bosilgan payt kichrayish ham ishlaydi. «Bajardim» → panel yopiladi, natija oynasi fokusga.
- Xulosa: Ikkinchi element tayyor: katak band bo'lganini rangi bilan ko'rsatadi. (70)

## 9 · Belgi qanday ketadi?  ← QTushuncha
- Eyebrow: Tushuncha · Motion
- Sarlavha: **«Band qilindi» belgisi qanday chiqib, qanday ketadi?** (52)
- Mentor: Belgi oldin ekranda yo'q — React uni band qilingandan keyin chizadi va 3 soniyadan keyin olib tashlaydi. Ikkala maketda katakni bosing va kuzating.
- Bashorat (ballsiz): **`transition` bilan belgi qanday ketadi?** · Silliq so'nadi · Birdan yo'qoladi
- Ikki maket yonma-yon (bitta maketning ikki nusxasi, P-057): chap yorliq «`transition` bilan» · o'ng yorliq «Motion bilan»; har birida 18:00–19:00 va belgi joyi.
- **Harakat → Vizual o'zgarish:** chapda katakni bosish → belgi birdan chiqadi, 3 soniyadan keyin birdan yo'qoladi;
  o'ngda katakni bosish → belgi pastdan ko'tarilib aniqlashadi, 3 soniyadan keyin so'nib ketadi. Har maket ostida ikki kichik yorliq yonadi:
  chap «chiqdi: birdan · ketdi: birdan», o'ng «chiqdi: silliq · ketdi: silliq». «Qayta» tugmasi ikkalasini boshlang'ich holatga qaytaradi.
- Nom qatori (2/2 dan keyin): O'ngdagini Motion (oldingi nomi Framer Motion) qiladi — React uchun animatsiya kutubxonasi, paketi `motion`.
- Natija qatori: «Taxminingiz: … · haqiqatda: birdan yo'qoldi».
- Xulosa: Oddiy `transition` olib tashlangan elementni ko'rsatmaydi. Bu misolda Motion kirish va ketishni osonlashtiradi. (106) — audit 4: «CSS qila olmaydi» deyilmaydi (`@keyframes`, `@starting-style` ham bor)
- Tugma (pastki): Ikkala maketda bosing (N/2) → Davom etish

## 10 · Motion kodi  ← QTushuncha
- Eyebrow: Kod · Motion
- Sarlavha: **Belgi qayerdan va qanday kirib keladi?** (38)
- Mentor: `motion.div` oddiy `div` ga o'xshaydi, lekin uch holatni biladi. Qiymatni almashtiring va katakni bosib, belgini qayta chiqaring.
- Chap — kod (repo `App.jsx` dagi parcha, P-065), qatorlar yonida kulrang yorliqlar:
  ```jsx
  import { motion, AnimatePresence } from "motion/react"

  <AnimatePresence>
    {belgi && (
      <motion.div
        key="belgi"
        className="belgi"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        Band qilindi: {belgi}
      </motion.div>
    )}
  </AnimatePresence>
  ```
  Yorliqlar: `initial` — chiqishdan oldingi holat · `animate` — kelib to'xtaydigan holat · `exit` — ketayotgandagi holat · `AnimatePresence` — element olib tashlanayotganda `exit` ni ishlatadi ·
  `y: 8` — 8 piksel pastda · `{belgi && …}` — `belgi` bo'lsa, chiziladi.
  Bosiladigan joylar (pulsatsiya): `initial` qiymati — `{ opacity: 0, y: 8 }` · `{ opacity: 0, y: -8 }` · `{ opacity: 0 }`; kalit «`AnimatePresence`: yoqilgan / o'chirilgan».
- O'ng — maket (**javob beradi** rejimi, belgi joyi katta).
- **Harakat → Vizual o'zgarish:** `initial` qiymatini bosish → kodda qiymat almashadi; katakni bosish → belgi tanlangan tomondan kiradi (pastdan · tepadan · joyida xiradan aniqqa)
  va `animate` holatida to'xtaydi, 3 soniyadan keyin `exit` bo'yicha so'nadi. `AnimatePresence` o'chirilsa → u qatorlar kodda xiralashadi, belgi ketishda birdan yo'qoladi;
  qayta yoqilsa — yana so'nib ketadi.
- Xulosa: `initial` dan `animate` ga — kirish, `exit` — ketish. Ketish ishlashi uchun `AnimatePresence` kerak. (92)
- Tugadi (199) · Tugma (pastki): 2 narsani sinang (N/2) → Davom etish

## 11 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Kodda `exit` bor, lekin belgi birdan yo'qoladi. Sabab nima?** (10 so'z)
  - `initial` qatorida `opacity` yo'q
  - `animate` qatorida `y: 0` yo'q
  - `exit` qatorida vaqt yozilmagan
  - ✔ `<AnimatePresence>` qatori yo'q
- Kalit: **D** (index 3). Variantlar: 29 · 26 · 29 · 29 belgi; to'rttalasi bir shaklda — «`…` qatori(da) … yo'q» (§147, 3-vs-1 yo'q).
- To'g'ri izohi: `exit` faqat `AnimatePresence` ichida ishlaydi — u element olib tashlanayotganda ketish animatsiyasini ishlatadi.
- Xato izohlari (≤60):
  - A: `initial` kirishni boshqaradi, ketishni emas. (43)
  - B: `animate` — to'xtash holati, ketishga tegmaydi. (45)
  - C: Vaqt yozilmasa ham Motion o'z vaqtini oladi. (44)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 12 · Qaysi harakat ortiqcha?  ← QTushuncha (2 qadam, 163.8)
- Eyebrow: Tushuncha · ortiqcha harakat
- Sarlavha: **Qaysi harakat o'yinchiga hech narsa demaydi?** (44)
- Mentor: Harakat «bosildi», «o'zgardi» yoki «tayyor» deb javob bermasa — u ortiqcha. Shundaylarini bosib o'chiring.
- Chapda qadam-ro'yxati (o'tgani ✓, joriysi accent): 1 Ortiqchasini o'chiring · 2 Harakatni kamaytiring; o'ngda faqat joriy qadam kartasi.
- O'ng — maket, beshta harakat bilan: sarlavha yonidagi katta to'p rasmi doim aylanadi · «Maydon» sarlavhasi miltillaydi · bosilgan katak kichrayadi ·
  band katak rangi silliq o'zgaradi · «Band qilindi» belgisi chiqadi. Hisoblagich: «Ortiqcha harakat: 0/2».
- **Harakat → Vizual o'zgarish:**
  - 1-qadam: harakatni bosish → aylanayotgan to'p rasmi yoki miltillayotgan sarlavha to'xtaydi va xiralashadi, hisoblagich oshadi;
    uch javobdan birini bosish → u silkinadi, bir qator (≤60): «Bu harakat o'yinchiga javob beradi — qoldiring.» (47). 2/2 da maketda faqat uch element qoladi.
  - 2-qadam (joriy karta, bitta qator): Ba'zi odamlarga ko'p harakat noqulay — boshi aylanishi mumkin; ular qurilmada harakatni kamaytiradi. Kalitni yoqing.
    Karta ostida chizilgan sozlama kaliti «Harakatni kamaytirish». Yoqilganda: kodda ikki qator yonadi
    ```css
    @media (prefers-reduced-motion: reduce) {
      .katak:active { transform: none; }
    }
    ```
    va `<MotionConfig reducedMotion="user">`; maketda katak bosilganda kichraymaydi, rang baribir silliq o'zgaradi, belgi pastdan ko'tarilmaydi — joyida xiradan aniqqa chiqadi.
- Nom qatori (2-qadamdan keyin): Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.
- Xulosa: O'yinchiga javob beradigan harakat qoladi. Harakatni kamaytirgan odamda rang va shaffoflik qoladi. (98)
- Tugadi (199) · Tugma (pastki): 2 qadamni bajaring (N/2) → Davom etish

## 13 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Harakat kamaytirilsa, bizning Maydon kodimizda nima ishlaydi?** (7 so'z) — audit 5: javob shu kodga tegishli, umumiy qoida emas
  - Hamma animatsiya avvalgidek ishlaydi
  - ✔ Faqat rang va shaffoflik o'zgaradi
  - Hech qanday o'zgarish ko'rinmaydi
  - Faqat katakning kichrayishi ishlaydi
- Kalit: **B** (index 1). Variantlar: 36 · 35 · 33 · 36 belgi; to'g'risi eng uzun emas, «Faqat» ikki variantda.
- To'g'ri izohi: Bu darsdagi kodda kichrayish va surilish o'chadi, rang va shaffoflik esa qoladi.
- Xato izohlari (≤60):
  - A: Sozlama yoqilgan — kichrayish va surilish o'chadi. (50)
  - C: Hammasi o'chsa, o'yinchi yana bosilganini bilmaydi. (51)
  - D: Kichrayish — aynan o'chadigan harakat. (38)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 14 · Nega silliq emas?  ← QTushuncha (xatoni topish, 3 qadam)
- Eyebrow: Xatoni topish
- Sarlavha: **Kod yozildi, lekin katak sakrayapti. Xato qayerda?** (50)
- Mentor: Ko'pincha xato bitta harfda yoki bo'sh joyda bo'ladi. Natijaga qarang va xato qatorni bosing.
- Chapda qadam-ro'yxati (o'tgani ✓): 1 Kichrayish sakraydi · 2 Qaytish sakraydi · 3 Rang o'zgarmaydi
- O'ngda joriy kod parchasi (3–5 qator) va maket; har qadamda maket o'sha xatoni ko'rsatadi:
  1. `.katak { transition: transform 0.15; }` — katak sakrab kichrayadi va sakrab qaytadi.
  2. `transition: transform 0.15s;` `.katak:active` ichida yozilgan — katak silliq cho'kadi, qo'yib yuborilganda sakrab qaytadi.
  3. `.katak .band { background-color: lightgray; }` — bosilgan katak rangi umuman o'zgarmaydi.
- **Harakat → Vizual o'zgarish:** o'quvchi kod qatorini bosadi →
  - to'g'ri qator → qizil bo'ladi, ostida tuzatilgan shakli yashil chiqadi (`0.15s` · `transition` `.katak` ga ko'chdi · `.katak.band`) va «Qayta sinash» tugmasi →
    maketda katak silliq ishlaydi, chapdagi qadam ✓;
  - xatosiz qator → silkinadi, bir qator (§185, ≤60): 1-qadamda «Bu qator to'g'ri. Vaqt qanday yozilgan?» (39) ·
    2-qadamda «Bu qator to'g'ri. Qo'yib yuborilganda qaysi qoida qoladi?» (57) · 3-qadamda «Bu qator to'g'ri. Selektorni harfma-harf o'qing.» (48)
- Xulosa: Kichik xato butun harakatni buzadi: vaqt «s» bilan, `transition` — `.katak` da, klasslar orasida bo'sh joy yo'q. (108)
- Tugadi (199) · Tugma (pastki): 3 xatoni toping (N/3) → Davom etish

## 15 · Bosishdan kulrang katakkacha (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Bosishdan kulrang katakkacha nima bo'ladi?** (42)
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- Bo'laklar (to'g'ri tartibda, `RANG_YOLI` — 6-ekran bilan bitta manba): O'yinchi katakni bosadi · Katakka `band` klassi qo'shiladi · Brauzer 0.3 soniya oraliq ranglarni chizadi ·
  Katak kulrang bo'lib qoladi
- Uyalar: 4 ta, har birida «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib xato — bo'lakni bosib qaytaring. (39)
- Xulosa (yechilgach, bir marta): Bosish klassni o'zgartiradi, `transition` esa eski va yangi rang orasini 0.3 soniyada to'ldiradi. (95)

## 16 · Amaliyot — uch element Maydon'da  ← amaliyot bloki (QBlok + `ScreenBlok`, 172/173 · ≈25 daq)
- Eyebrow: Amaliyot · Maydon repo'si
- Sarlavha: **Uch elementni Maydon saytiga qo'shing.** (38)
- Mentor: Bosish mantiqini Antigravity yozadi, animatsiyani — siz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda: `cd web`, `npm install motion`, keyin `npm run dev`. Brauzerda `localhost:5173` — Shanba kataklari chiqsin.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `web/src/App.jsx`: bo'sh vaqt katagi bosilsa, u band bo'lsin — katakka `band` klassi qo'shilsin.
     > Kataklar ostida «Band qilindi: 18:00» kabi yozuv soati bilan chiqsin va 3 soniyadan keyin yo'qolsin; soat `belgi` nomli state'da tursin, yozuvga `belgi` klassini ber.
     > Band katak qayta bosilmasin. Hozircha hammasi faqat saytda — Backend'ga yuborilmasin.
     > `App.css` ga va animatsiyaga tegma — ularni men yozaman. O'zgargan qatorlarni ayt.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. **CSS — qo'lda** — `web/src/App.css` ni oching va o'zingiz terib yozing (nusxa yo'q): `.katak` ga `transition: transform 0.15s, background-color 0.3s;`,
     yangi qoida `.katak:active { transform: scale(0.95); }`, faylning oxiriga `@media (prefers-reduced-motion: reduce) { .katak:active { transform: none; } }`. Saqlang va katakni bosing:
     kichrayib qaytadi, rangi silliq kulranglashadi.
  4. **Motion — qo'lda** — `App.jsx` tepasiga `import { motion, AnimatePresence, MotionConfig } from "motion/react"` ni yozing. Yozuvning `div` ini `motion.div` qiling
     (`key`, `initial`, `animate`, `exit`, `transition`) va uni `<AnimatePresence>` ichiga oling; butun sahifani `<MotionConfig reducedMotion="user">` ichiga oling.
     Saqlang va katakni bosing: «Band qilindi: 18:00» pastdan chiqadi va 3 soniyadan keyin so'nadi. Ekranda xato chiqsa — matnini Antigravity'ga: «Shu xato chiqdi: {xato}. Tuzat.»
  5. **O'z g'oyangizga** — qavslarni o'z loyihangiz bo'yicha to'ldiring va «Nusxalash» — uyda o'z loyihangizda Antigravity'ga yuborasiz:
     > {sahifa yoki fayl}: {bosiladigan tugma} bosilganda kichrayib qaytsin — `transform: scale(0.95)`, `transition` 0.15 soniya.
     > {holati o'zgaradigan element} rangi 0.3 soniyada silliq o'zgarsin.
     > {tasdiq yozuvi} `motion` paketi bilan chiqib, so'nib ketsin (`AnimatePresence`, `exit`).
     > Qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`, xaritadagi maketning kattasi):
  - Maydon · Shanba
  - 16:00–17:00 · 17:00–18:00 band · 18:00–19:00 band · 19:00–20:00 · 20:00–21:00 band · 21:00–22:00
  - pastda: Band qilindi: 18:00
- Hammasi bajarilgach (yashil): Maydon bosishga javob beradi: bosildi, o'zgardi, band qilindi. (62)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-05-done` (o'z o'zgarishlaringiz o'chadi).
- Nishon (bonus): Live Maydon — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Silliq qaytish» · 7 — «2 — Ikki xususiyat» · 11 — «3 — Belgining ketishi» · 13 — «4 — Kamaytirilgan harakat» · 15 — «5 — Rang yo'li»

## 18 · Takrorlash  ← QKartochka (12 karta, tepadan, savolsiz sarlavha — 174)
- Kartalar — «Kartochkalar (12)» bo'limida. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Maydon javob beradi · {N}/5 to'g'ri
- Sarlavha: **Endi bosishga javob beradigan sayt qila olasiz.** (47)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Animatsiya bezak emas: u odamga «bosildi», «o'zgardi», «tayyor» deb javob beradi.
- Endi siz bilasiz (4):
  - `transform: scale(0.95)` katakni kichraytiradi, qo'shni kataklar joyida qoladi
  - `transition` o'zgarishni berilgan vaqt ichida silliq bajaradi
  - Motion `initial`, `animate`, `exit` bilan chiqish va ketishni silliq qiladi
  - Harakat kamaytirilgan qurilmada kichrayish o'chadi, rang va shaffoflik qoladi
- Uyga vazifa (`uyga`, karta: kim uchun — o'z loyihangiz · muddat — keyingi darsgacha):
  1. **O'z loyihangizda** — amaliyotdagi 5-qadam promptini Antigravity'ga yuboring: uch element bosishga javob bersin
  2. **Tekshiring** — qurilmada harakatni kamaytirishni yoqib, sahifangizni oching: kichrayish o'chdimi?
  3. **Kuzating** — telefoningizdagi bitta ilovada «bosildi», «o'zgardi», «tayyor» javoblarini toping va har birini bir gapda yozing
- Keyingi dars — «Birinchi odam kirganda nimani ko'rasiz?»: Maydon bosishga javob beradi, endi odamlar unda nima qilayotganini ko'rish navbati.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (5) — inglizcha nom va medal (o'yin qatlami)
- **Smooth Press** — katak silliq qaytishi uchun nima kerakligini topdingiz (4-ekran, 1-savol)
- **Two Transitions** — ikki xususiyatni bitta `transition` ga yozdingiz (7-ekran, 2-savol)
- **Exit Ready** — `exit` ishlashi uchun nima kerakligini topdingiz (11-ekran, 3-savol)
- **Calm Motion** — harakatni kamaytirgan odamga nima qolishini bildingiz (13-ekran, 4-savol)
- **Live Maydon** — amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta, emoji o'rniga koddan bitta qator (S-026)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Silliq qaytish uchun `transition`»
   - `:active` — bosib turilgan payt · `.katak:active { transform: scale(0.95); }`
   - `transform` katakni kichraytiradi, qo'shni kataklar joyida qoladi · `scale(0.95)`
   - `transition` kichrayishga vaqt beradi · `transition: transform 0.15s;`
   - Sinfga savol: Nega `transition` siz katak sakraydi?
2. 2-savol (7-ekran) — «Ikki xususiyat — vergul bilan»
   - `band` klassi qo'shilsa, fon kulrang bo'ladi · `.katak.band { background-color: lightgray; }`
   - `transition` faqat unda yozilgan xususiyatni silliq qiladi · `transition: transform 0.15s;`
   - Ikkinchi xususiyat vergul bilan, o'z vaqti bilan · `transform 0.15s, background-color 0.3s`
   - Sinfga savol: Vergul o'rniga nuqta-vergul qo'yilsa nima bo'ladi?
3. 3-savol (11-ekran) — «`exit` — `AnimatePresence` ichida»
   - `initial` dan `animate` ga — belgi kiradi · `initial={{ opacity: 0, y: 8 }}`
   - `exit` — ketayotgandagi holat · `exit={{ opacity: 0 }}`
   - `AnimatePresence` element olib tashlanayotganda `exit` ni ishlatadi · `<AnimatePresence>`
   - Sinfga savol: `AnimatePresence` bo'lmasa, belgi qanday ketadi?
4. 4-savol (13-ekran) — «Harakatni kamaytirgan odam»
   - Sayt buni `prefers-reduced-motion` orqali biladi · `@media (prefers-reduced-motion: reduce)`
   - Kichrayish o'chadi · `.katak:active { transform: none; }`
   - Motion surilishni o'chiradi, shaffoflik qoladi · `reducedMotion="user"`
   - Sinfga savol: Nega rang o'zgarishini o'chirmaymiz?
5. Final (15-ekran) — «Bosishdan kulrang katakkacha»
   - O'yinchi bosadi, katakka `band` klassi qo'shiladi · `className="katak band"`
   - Brauzer 0.3 soniya oraliq ranglarni chizadi · `background-color 0.3s`
   - Katak kulrang bo'lib qoladi · (4)
   - Sinfga savol: `transition` qachon ishga tushadi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Harakat yoki holat o'zgarishiga kichik vizual javob qanday ataladi? | Mikro-harakat | Bizning misolda: bosilgan katak kichrayib qaytadi |
| Katakni 95% gacha qaysi qiymat kichraytiradi? | `transform: scale(0.95)` | Qo'shni kataklar joyida qoladi |
| Bosib turilgan payt CSS'da qanday yoziladi? | `:active` | Masalan: `.katak:active` |
| O'zgarishga vaqtni qaysi xususiyat beradi? | `transition` | Qaysi xususiyat va qancha vaqt |
| `transition: transform 0.15s` dagi «s» nima? | soniya | 1 soniyada o'yinchi kutib qoladi |
| Bitta `transition` ga ikki xususiyat qanday yoziladi? | Vergul bilan | `transform 0.15s, background-color 0.3s` |
| `.katak.band` qaysi elementni topadi? | `katak` va `band` klassi bor elementni | Orasida bo'sh joy bo'lsa — boshqa selektor |
| Motion qaysi buyruq bilan o'rnatiladi? | `npm install motion` | Import: `motion/react` |
| Belgining chiqishdan oldingi holati qayerda yoziladi? | `initial` | Kelib to'xtaydigan holat — `animate` |
| Belgining ketayotgandagi holati qayerda yoziladi? | `exit` | `AnimatePresence` ichida ishlaydi |
| Harakat kamaytirilganini sayt qanday biladi? | `prefers-reduced-motion` | Kichrayish o'chadi, rang qoladi |
| Saytda qaysi harakat qoladi? | O'yinchiga javob beradigani | «Bosildi», «o'zgardi», «tayyor» |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Animatsiya o'yinchiga nimani aytadi? ✔ «Bosildi», «o'zgardi» yoki «tayyor» · Saytda hozir nechta odam borligini · Sahifa qancha vaqtdan beri ochiqligini · Katak qaysi rangda chiroyli turishini
2. `transform: scale(1.1)` nima qiladi? Elementni 10% ga kichraytiradi · ✔ Elementni 10% ga kattalashtiradi · Elementni 10 piksel o'ngga suradi · Element rangini 10% ochroq qiladi
3. Tugma `scale(0.9)` bilan kichraydi. Ostidagi matn nima bo'ladi? Tepaga ko'tariladi · Pastga tushadi · ✔ Joyida qoladi · U ham kichrayadi
4. `transition: transform 0.15s` dagi `0.15s` nimani bildiradi? Katak necha marta kichrayishini · Katak qancha kichrayishini · Katak qachon bosilishini · ✔ O'zgarish qancha davom etishini
5. Bir `transition` da ikki xususiyat qanday ajratiladi? ✔ Vergul bilan · Nuqta-vergul bilan · Bo'sh joy bilan · Ikki nuqta bilan
6. `.katak.band` selektori qaysi elementni topadi? `katak` ichidagi `band` ni · ✔ Ikkala klassi bor elementni · Faqat `band` klassli har elementni · Hamma `katak` klassli elementni
7. Tugma bosib turilgan payt CSS'da qanday yoziladi? `.tugma:hover` · `.tugma.band` · ✔ `.tugma:active` · `.tugma .active`
8. Motion'ni loyihaga qaysi buyruq qo'shadi? `npm run motion` · `npm motion install` · `npx motion` · ✔ `npm install motion`
9. `motion.div` dagi `initial` nimani bildiradi? ✔ Element chiqishidan oldingi holat · Element to'xtaydigan oxirgi holat · Element ketayotgandagi holat · Element bosilgan paytdagi holat
10. Ro'yxatdan qator o'chirilsa, u silliq ketishi uchun nima kerak? `initial` da `opacity: 0` · ✔ `AnimatePresence` va `exit` · `animate` da `y: 0` · CSS'dagi `transition` qatori
11. Do'kon saytida qaysi harakat ortiqcha? Savatga qo'shilganda son o'zgarishi · Bosilgan tugma kichrayib qaytishi · ✔ Doim miltillaydigan «Aksiya» yozuvi · «Buyurtma qabul qilindi» chiqishi
12. `prefers-reduced-motion` nimani bildiradi? Internet sekin ishlayotganini · Telefon quvvati kam qolganini · Ekran yorqinligi pasaytirilganini · ✔ Odam harakatni kamaytirganini

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): `transition` · `transform` · `scale(0.95)` · `:active` · `0.15s` · `.katak.band` · `motion.div` · `initial` · `animate` ·
`exit` · `AnimatePresence` · `prefers-reduced-motion` · `npm install motion` · Maydon

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 20 ekran: hook · rule · exploration ×2 · test · practice(kod) · exploration · test · practice(kod) · exploration ×2 · test ·
   exploration · test · exploration(debug) · test(final, `scope: 'final'`) · practice(blok) · stats · flashcards · summary. `INLINE_KEYS`: s4 **2 (C)** · s7 **0 (A)** · s11 **3 (D)** · s13 **1 (B)** ·
   s15 sentinel **0**; QKod (5, 8) va blok (16) — `practice: -1`. `LESSON_META.lessonId` — `m7-05-animation-v1`.
2. **Bitta manba (180):** `KATAKLAR` (6 katak: soat, holat) va `RANG_YOLI` (4 bo'lak — 6-ekran yorliqlari va 15-ekran finali). 0, 1, 2, 3, 6, 9, 10, 12, 14, 16-ekranlar shundan o'qiydi.
3. **`MaydonMaket`** komponenti: brauzer ramkasi, kun yorlig'i, 6 katak, belgi joyi; rejimlar `jim` · `javob` · `sekin` (×10, oraliq o'lchamlar/ranglar xira) · `kam` (harakat kamaytirilgan);
   bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: mk-katak mk-kun mk-kalit`). Maket o'zi `prefers-reduced-motion` da to'xtaydi (DE-200). Logotip/emoji yo'q (D4); 12-ekrandagi «to'p rasmi» — chizilgan doira (SVG).
4. **Motion darsning o'zida:** platformada `motion` paketi yo'q (`package.json`) — 9, 10, 12-ekran maketlari belgining chiqish/ketishini CSS/JS bilan **taqlid qiladi**, kod parchasi esa repo'dagi
   haqiqiy Motion kodi (TAYANCHGA SAVOL 8). `AnimatePresence` o'chirilgan holat — belgi birdan yo'qoladi.
5. **QKod (5, 8) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `style.css` o'quvchi · 8-ekranda `app.js` tayyor). Yangi CSS tekshiruvlari (stylesheet parse, regex emas):
   `.katak:active` da `transform: scale(x)`, 0.9 ≤ x ≤ 0.98 · `.katak` dagi `transition` ro'yxatida `transform` (yoki `all`) va birligi bor vaqt · 8-ekranda `background-color` vaqti ham, `transform` ham ·
   `.katak.band` da `background-color`. 8-ekran `style.css` 5-ekrandagi saqlangan koddan boshlanadi (`storageKey` umumiy). «Bajardim» shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
   ⚠️ `style.css` starter `.jsx` ichida shablon-satr bo'ladi — CSS izohida backtik yo'q (CLAUDE.md; starterdagi izohlar backtiksiz yozildi).
6. **14-ekran (debug):** uch kod parchasi, qator bosish → tekshirish; xatosiz qator — `QXato` bir qator; tuzatilgan shakl yashil; «Qayta sinash» → maket to'g'ri ishlaydi.
7. **Bashorat ekranlari** (2, 3, 6, 9) — `QBashorat` ballsiz, `onAnswer` ga kirmaydi; natija — `QTaxmin` bitta qator. 12-ekran — `QQadamlar` (2 qadam).
8. **16-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2- va 5-qadam; 5-qadamda `{…}` joylari); 3- va 4-qadamda nusxa tugmasi **yo'q** (qo'lda); o'ngda `MaydonMaket` (javob rejimi, katta).
   `ortda`: `git checkout -f dars-05-done`. `ACH_TRIGGERS`: oxirgi «Bajardim» → Live Maydon.
9. `RECAPS` 5 (kalit = 4, 7, 11, 13, 15) · `Q_LABELS` {4, 7, 11, 13, 15} · `ACHIEVEMENTS` 5 · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 · `HW_TOKENS` fon so'zlari {uz, ru}
   (`hodisa` so'zi skelet namunasida bor — bu darsda **olinadi**, T-015).
10. **Darvozalar:** `npm run gates -- src/7-Modull/AnimationLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 (shu dars) · `lint:emoji` · `lint:layout` 1280/1366/390 · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`dars-04-done` → `dars-05-done`)
1. `web/package.json` — `motion` qaramligi (`npm install motion`).
2. `web/src/App.jsx` — `belgi` state (soat yoki `null`), bo'sh katak bosilsa `band` klassi va belgi, 3 soniyadan keyin `belgi` → `null`; band katak qayta bosilmaydi; faqat saytda (Backend'ga so'rov yo'q).
   Belgi: `<AnimatePresence>{belgi && (<motion.div key="belgi" className="belgi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>Band qilindi: {belgi}</motion.div>)}</AnimatePresence>`;
   butun sahifa `<MotionConfig reducedMotion="user">` ichida.
3. `web/src/App.css` — `.katak { … transition: transform 0.15s, background-color 0.3s; }` · `.katak:active { transform: scale(0.95); }` · `.katak.band { background-color: lightgray; }` (4-darsda bo'lmasa) ·
   `@media (prefers-reduced-motion: reduce) { .katak:active { transform: none; } }`.
4. README «Darslar va teglar» jadvaliga `dars-05-done` qatori: «statik kataklarda uch element jonlangan».
5. **Muhrdan oldin haqiqiy sinov (P-028):** Android va iPhone brauzerida `:active` kichrayishi (iOS Safari'da `:active` faqat sahifada bosish tinglovchisi bo'lsa ishlaydi — React ilovada odatda bor, lekin sinab ko'riladi),
   OS sozlamasida harakatni kamaytirish → kichrayish va surilish o'chadi, rang va shaffoflik qoladi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **4-dars repo holati:** fayl va klass nomlari — `web/src/App.jsx`, `web/src/App.css`, `.katak`, `.katak.band`; namuna ma'lumot — Shanba, 16:00–22:00, band 17:00–18:00 va 20:00–21:00.
   Tayanchda yo'q; 4-dars MD bilan solishtirish kerak (3, 6, 10, 16-ekran va REPO shu nomlarga bog'liq).
2. **5-darsda band qilish faqat saytda** (React state, Backend'ga yozilmaydi, sahifa yangilansa yo'qoladi); haqiqiy `POST /bandlar` (ism + telefon) — 9-darsda. Tayanchdagi «statik kataklarda jonlangan» shunday tushunildi.
3. **Belgi tafsilotlari:** matn «Band qilindi: 18:00» (soati bilan), 3 soniyadan keyin yo'qoladi (ketish animatsiyasini ko'rsatish uchun), state va klass nomi `belgi`. Tayanchda faqat «Band qilindi» belgisi bor.
4. **Blokda ish taqsimoti:** bosish mantiqi — Antigravity prompti (qaror 3), animatsiya — qo'lda (qaror 4); oxirida 5-qadam «o'z g'oyangizga» (qaror 8). Shu tufayli blok 5 qadam (P-059 dagi 4 + qaror 8).
5. **«prompt» va «talab»:** blokda qaror 8 so'zi «prompt» qoldi (6-Moduldan tanish); tayanchdagi «talab» 7-darsda tug'iladi deb hisobladim. Modul bo'yi bitta so'z kerak bo'lsa — 1-2 joy almashadi.
6. **Repo manzili:** tayanchda URL va `git fetch` qatori yo'q — «Ortda qoldingizmi» faqat `git checkout -f dars-05-done`. Teglar upstream'da kurs boshlanishidan oldin bo'lishi kerak (6-Modul REPO 3-band shartidek).
7. **Maydon ranglari:** bo'sh — oq (`white`), band — kulrang (`lightgray`) — tayanchda saytning ranglari yo'q; yashil olinmadi (dars yuzasida yashil = to'g'ri).
8. **Darsning o'zida Motion:** platformada `motion` paketi yo'q — maket taqlid qiladi (KOD 4) yoki paket qo'shiladi (umumiy qaror, asosiy seans).
9. **Kun almashtirish** — 7-darsda; 5-darsda kun yorlig'i «Shanba» faqat ko'rinadi, bosilmaydi.

## Shubhali joylar (ishonchim komil emas)
1. **«javob» ikki ma'noda** (T-015): dars nomi va asosiy fikrda «sayt javob beradi», test eyebrow'ida platforma standarti «To'g'ri javobni tanlang». O'z matnimda test ma'nosida «javob» ishlatmadim; standart yorliq tegilmadi.
2. **«belgi» ildizi:** `QBashorat` qolip yorlig'i «Avval o'zingiz belgilab ko'ring» — «belgilab» fe'li «Band qilindi» belgisidan boshqa ma'no (T-015 chegarasida). Qolip matni o'zgartirilmadi.
3. **Hook 1-varianti** («Ha, endi katak band bo'ldi») faktda rost — shuning uchun javobi «Qiziq fikr! Rost, …» bilan boshlanadi; «Aynan!» ekrandan bilib bo'lmasligiga beriladi (P-016).
4. **11-ekran D-varianti** «`<AnimatePresence>` qatori yo'q» — to'rt variant bir shaklda bo'lishi uchun shunday yozildi; aslida u ochiluvchi va yopiluvchi teg (o'rab turadi). Muqobil: «`AnimatePresence` ichiga olinmagan» (aniqroq, lekin shakli boshqa — §147).
5. **0.15 va 0.3 soniya** — sanoatda keng ishlatiladigan qiymatlar, ilmiy manba emas; matn ularni «Maydon'da» deb aytadi, umumiy qonun qilmaydi (T-043). «1 soniyada o'yinchi kutib qoladi» — kuzatuv, son emas.
6. ~~«boshi aylanadi»~~ — audit bilan «boshi aylanishi mumkin» qilindi; MDN dagi «discomfort … vestibular motion disorders» ning soddalashtirilgani (12-ekran).
7. **9-ekran da'vosi** «React o'chirgan element shu zahoti yo'qoladi» — rost; lekin «`transition` bilan belgi birdan chiqadi» faqat oddiy `transition` uchun rost (`@starting-style` yoki `@keyframes` bilan CSS ham chiqishni silliq qila oladi) —
   shuning uchun xulosa faqat ketish va Motion haqida gapiradi.
8. **14-ekran 1-xato** (`0.15` birliksiz): brauzer butun `transition` qatorini tashlab yuboradi — rost (CSS `<time>` birlik talab qiladi); maketda «sakrab» ko'rsatiladi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-04` «Mini-MVP arxitekturasi» → **`m7-05` «Animatsiya: interfeys javob beradi»** → `m7-06` «Birinchi odam kirganda nimani ko'rasiz?»; reja teglari `sub` «transition, transform, Motion» bilan.
- [x] Bitta misol-ip («Maydon», hook → blok); metafora yo'q; bitta vizual — «Maydon» maketi + kod parchasi (`KATAKLAR`); arena 11 — ikkinchi misol faqat test bandida, tanish olamdan (P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 3, 6, 9, 10, 12, 14 (va 0, 5, 8, 16) — matn-karta yo'q.
- [x] Sarlavhalar ≤55 bitta qator (35–54; brauzerda `lint:sarlavha` bilan yakuniy hukm) · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi (o'z ko'zim bilan; `lint:olchov` kod bosqichida) · xulosalar ≤110 (62–108) · hook javoblari ≤120 (91–96) · xato izohlari ≤60 (38–57).
- [x] Atamalar oldingi darslar bilan bir xil (grep: CssLesson1 — selektor/xususiyat/qiymat, `background-color` — fon rangi, hex kod; 3-Modul — `className`, `onClick`, `npm install`; tayanch — sayt, vaqt katagi, band, o'yinchi) ·
      siz-forma; ketma-ketlik va yorliq ot-shaklda (`RANG_YOLI`, 12-ekran qadamlari), tugma siz-formada; Antigravity promptlari buyruq shaklida (T-002) · «hodisa» bu darsda yo'q (T-015).
- [x] Testlar: variantlar uzunligi yaqin (4: 30–36 · 7: 32–38 · 11: 26–29 · 13: 33–36); `transform`/`transition`/kod belgilari faqat to'g'rida emas; to'g'ri izoh bitta gap, «To'g'ri!» yo'q · ✔: s4 C · s7 A · s11 D · s13 B · arena A·B·C·D ×3.
- [x] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi, yagona sabab-oqibat tartibi (6-ekranda o'rgatilgan — P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — o'quvchi matnida yo'q; «ko'pincha» bitta joyda, 14-ekran Mentor).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, F-ID, T6); ekran raqami faqat MD izohlarida · tarixiy voqea yo'q; texnik faktlar manba bilan (A-7) · «KOD» (10) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 (promptda buyruq shakli) · T-011 (transform, animatsiya, transition, mikro-harakat, Motion — harakatdan keyin) · T-015 (hodisa olindi; «javob», «belgi» — shubhali 1–2) ·
      T-016/017 (metafora yo'q) · T-024 (tugmalar «Bajardim», «Qayta sinash», «Nusxalash») · T-039 (sarlavhalarda o'quvchida yo'q narsa uniki qilinmadi) · T-043 (0.15/0.3 — «Maydon'da») · T-045 (9-ekran da'vosi cheklandi) ·
      T-064 (ko'priklarda «N-ekran» yo'q) · T-070 (kartochka javoblari savol so'zini takrorlamaydi) · P-001/004 · P-008 (har ekranda bitta ish; 12 va 14 — qadamlar bilan) · P-013 · P-015 · P-016 · P-025 · P-028 (REPO 5, OS menyu nomi yo'q) ·
      P-052 · P-059 (+ qaror 8 qadami) · P-063 · P-064 · P-065 · P-067 · S-001 (savollar 8–10 so'z) · S-004 · S-006 · S-010 · S-015 · S-026 · S-040 (14-ekran xatosiz qator izohi).
- [x] `npm run lint:til feedback/F-1005-9modul/05-Animation-v3.md` — 0 error, 0 warn (05.10.2026).

---

## ✎ Kodda chetlashishlar (quruvchi, 05.10.2026 — o'quvchi matni o'zgartirilmadi; MD ga taklif)
1. ✎ `lessonId` — `m7-05-v1` (topshiriqdagi skelet nusxasi, 1 va 7-dars pilot naqshi); KOD 1 dagi `m7-05-animation-v1` olinmadi.
2. ✎ 5-ekran Mentor — asosiy gap va qavsdagi «kod oynasi ochiladi …» gapi bitta Mentor qatorida (2 gap).
3. ✎ 14-ekran — kod parchasi chapda (qadamlar ostida), o'ngda maket: 1280×773 da maket ekrandan tushib qolmasin.
4. ✎ 12-ekran — 1-qadamda uch foydali harakat maketda o'zi aylanib turadi (bosilsa — silkinadi, band qilmaydi); 2-qadam kartasi chapda, hisoblagich maket ustida; kalit yoqilgach maket bir marta o'zi ko'rsatadi.
5. ✎ 10-ekran — `initial` va `AnimatePresence` tanlovlari kod ustida (birinchi ko'rinishda harakat ko'rinsin, SABOQ 11).
6. ✎ 6-ekran — `, background-color 0.3s` tugmasi birinchi band qilishdan keyin ochiladi (sakrash albatta ko'rinsin).
7. ✎ 9-ekran — hisoblagich belgi to'liq ketgandan keyin oshadi (kuzatildi = sanaldi).
8. ✎ 3-ekran — «Sekin ko'rsatish» faqat `0.15s` ni 10 baravar sekinlashtiradi (matn bo'yicha).
9. ✎ 16-ekran — «(o'z o'zgarishlaringiz o'chadi)» izohi chiqmaydi: QBlok «Ortda qoldingizmi» qatorida izoh joyi yo'q. Yakunda uyga vazifa kartasining «kim uchun / muddat» qatori yo'q: QYakun ro'yxat shaklida bu joy yo'q.
10. ✎ Prompt satrlari va kompilyator shartlari backtiksiz chiqadi (QPrompt va HtmlCompiler matnni xom ko'rsatadi); so'zlar o'zgarmadi.
11. ✎ 8-ekran qoralama kaliti — `pm-m7d5-code-s8` (5-ekran: `pm-m7d5-code`); fayllar to'plami har xil bo'lgani uchun bitta kalit ishlamaydi, 8-ekran `style.css` 5-ekran qoralamasidan o'qiladi.
