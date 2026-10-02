# TEG XARITASI — kompilyator maslahatlari uchun yagona manba (F-1001-91)

> Tuzildi: 2026-10-01, 1-bosqich. Mashina nusxasi: `src/compilator/teg-xaritasi.json` (ro'yxat va darvoza shundan yasaladi).
> Qoida: ro'yxatda faqat shu yerda bo'lgan narsa chiqadi; dars `stage` bersa — faqat o'sha darsgacha o'tilganlari (Q2).
> Usul: skript nomzod berdi (`vositalar/teg-qidir.py`), hukm o'rgatish ekranini o'qib qo'lda. «Ekran» ustuni — dalil.

## 0. Dastur tartibi (1-Modul, App.jsx) va bosqichlar

`m1-01` Internet → `m1-02` PM Auditoriya (kompilyator: tayyor koddagi [KIM] almashtirish — ro'yxat **bo'sh**) → **`m1-03` HTML-1** → **`m1-04` HTML-2** → `m1-14` Takrorlash (yangi teg yo'q) → `m1-05` PM Struktura (header/main/footer koding) → **`m1-06` CSS-1** → **`m1-07` CSS-2** → **`m1-08` HTML Praktika** → **`m1-15` VS Code** → `m1-10` CSS Praktika → … → 2-Modul (JS). 2-Moduldan boshlab ro'yxat to'liq (HTML+CSS), JS o'z xaritasi bilan.

| Imkoniyat | Qaysi darsdan | Sabab |
|---|---|---|
| Teg ro'yxati va `teg`+Tab | m1-03 | birinchi HTML darsi |
| `.class` / `#id` qisqartmasi (Emmet) | m1-06 | `class` CSS-1 da o'rgatiladi (F-1001-90 sabog'i) |
| Emmet (`!`, `>`, `*n`) | m1-15 | VS Code darsida o'rgatiladi |
| CSS maslahati | m1-06 | CSS-1 |
| JS maslahati | m2-02 | JS o'zgaruvchilar |

## 1. HTML teglar (ro'yxatga kiradi)

| Teg | Dars | Ekran (dalil) | Izoh uz | Izoh ru | Matn ichida |
|---|---|---|---|---|---|
| `html` | m1-03 | s5 Struktura | butun sahifa | вся страница |  |
| `head` | m1-03 | s5 Struktura | sahifa sozlamalari (ko'rinmaydi) | настройки страницы (не видно) |  |
| `title` | m1-03 | s5 Struktura | varaq nomi | название вкладки | ha |
| `body` | m1-03 | s5 Struktura | sahifa tanasi (ko'rinadi) | тело страницы (видно) |  |
| `h1` | m1-03 | s6–s8 | eng katta sarlavha | самый большой заголовок | ha |
| `h2` | m1-03 | s8 Sarlavhalar | bo'lim sarlavhasi | заголовок раздела | ha |
| `h3` | m1-03 | s8 Sarlavhalar | kichik sarlavha | малый заголовок | ha |
| `h4` | m1-03 | s8 Sarlavhalar | 4-daraja sarlavha | заголовок 4-го уровня | ha |
| `h5` | m1-03 | s8 Sarlavhalar | 5-daraja sarlavha | заголовок 5-го уровня | ha |
| `h6` | m1-03 | s8 Sarlavhalar | eng kichik sarlavha | самый маленький заголовок | ha |
| `p` | m1-03 | s9 Matn | matn xatboshisi | абзац текста | ha |
| `strong` | m1-03 | s9 Matn | qalin matn | жирный текст | ha |
| `em` | m1-03 | s9 Matn | qiya matn | наклонный текст | ha |
| `ul` | m1-03 | s10 Ro'yxatlar | ro'yxat | список |  |
| `ol` | m1-03 | s10 Ro'yxatlar | raqamli ro'yxat | нумерованный список |  |
| `li` | m1-03 | s10 Ro'yxatlar | ro'yxat bandi | пункт списка | ha |
| `a` | m1-03 | s12 Havolalar | havola | ссылка | ha |
| `img` | m1-04 | s2 Rasm | rasm | картинка |  · void |
| `header` | m1-04 | s5 Struktura | sahifa boshi | шапка страницы |  |
| `main` | m1-04 | s5 Struktura | asosiy qism | основная часть |  |
| `footer` | m1-04 | s5 Struktura | sahifa pasti | подвал страницы |  |
| `div` | m1-04 | s6 div — guruhlash | oddiy quti | обычный блок |  |
| `form` | m1-04 | s7 Forma | forma | форма |  |
| `input` | m1-04 | s7 Forma | yozish maydoni | поле ввода |  · void |
| `label` | m1-04 | s7 Forma | maydon yozuvi | подпись поля | ha |
| `button` | m1-04 | s7 Forma | tugma | кнопка | ha |
| `style` | m1-06 | s3b CSS qayerda yashaydi | CSS shu yerda | CSS здесь |  |
| `link` | m1-06 | s3b CSS qayerda yashaydi · s7b Google Fonts | CSS faylini ulash | подключить CSS |  · void |
| `nav` | m1-08 | s5 Build · Navigatsiya | menyu | меню |  |
| `section` | m1-08 | s7 Build · Men haqimda | bo'lim | раздел |  |
| `span` | m2-08 | PracticeLesson1 TASK_TOGGLE (<span id="son">) | matn ichidagi bo'lak | кусочек внутри текста | ha |

**Ro'yxatga KIRMAYDI** (1–4c darslarida o'rgatilmaydi; o'quvchi qo'lda yozsa avto-yopish baribir ishlaydi): `textarea`, `select`, `option`, `table`, `tr`, `td`, `th`, `article`, `aside`, `fieldset`, `meta`, `hr`, `iframe`, `video`, `audio`, `code`, `pre`, `small`, `b`, `i`, `u`, `br`, `script (JS darslarida script.js alohida fayl; <script> tegi faqat VsCode testida)`

## 2. HTML atributlar

| Teg | Atribut | Dars | Ekran | Izoh uz | Qiymatlar |
|---|---|---|---|---|---|
| `a` | `href` | m1-03 | s12 | qayerga olib boradi |  |
| `img` | `src` | m1-04 | s2 | rasm manzili |  |
| `img` | `alt` | m1-04 | s3 | rasm o'rnidagi matn |  |
| `input` | `type` | m1-04 | s8 input turlari | maydon turi | `text` `email` `password` `number` |
| `input` | `placeholder` | m1-04 | s8 / s13 | xira maslahat |  |
| `input` | `value` | m1-04 | s13 Amaliyot | boshlang'ich qiymat |  |
| `*` | `class` | m1-06 | s3 Sintaksis (selektor) | CSS uchun nom |  |
| `*` | `style` | m1-06 | s3b (inline CSS) | CSS shu yerning o'zida |  |
| `link` | `rel` | m1-06 | s3b / s7b | ulash turi | `stylesheet` |
| `link` | `href` | m1-06 | s3b / s7b | fayl manzili |  |
| `*` | `id` | m1-08 | s7 / s11 (section id) | yagona nom |  |
| `html` | `lang` | m1-15 | Emmet shabloni | sahifa tili |  |

## 3. CSS (2b-bosqich uchun)

| Xossa | Dars | Ekran | Izoh uz | Qiymat takliflari |
|---|---|---|---|---|
| `color` | m1-06 | s3 Sintaksis | matn rangi | `red` `blue` `green` `white` `black` `#…` |
| `background-color` | m1-06 | TASK_COLOR | fon rangi | `#…` `white` `black` |
| `font-size` | m1-06 | TASK_TEXT | shrift kattaligi | `16px` `24px` `32px` |
| `text-align` | m1-06 | TASK_TEXT | matn tekislash | `center` `left` `right` |
| `font-family` | m1-06 | s7b Google Fonts | shrift | `Arial` `Georgia` `sans-serif` |
| `margin` | m1-06 | TASK_BOX | tashqi bo'shliq | `0` `8px` `16px` `auto` |
| `padding` | m1-06 | TASK_BOX | ichki bo'shliq | `8px` `16px` `24px` |
| `display` | m1-07 | s3b Qoida ustaxonasi | ko'rinish turi | `flex` `block` `none` |
| `gap` | m1-07 | TASK_FLEX | elementlar orasi | `8px` `16px` `24px` |
| `justify-content` | m1-07 | TASK_CENTER | gorizontal joylash | `center` `space-between` `flex-start` `flex-end` |
| `align-items` | m1-07 | TASK_CENTER | vertikal joylash | `center` `flex-start` `flex-end` |
| `flex-direction` | m1-07 | TASK_COLUMN | yo'nalish | `row` `column` |
| `height` | m1-07 | TASK_CENTER | balandlik | `100px` `200px` `100vh` |
| `width` | m1-15 | 6-qadam Card CSS | kenglik | `100px` `300px` `100%` |
| `background` | m1-15 | 6-qadam Card CSS | fon | `#…` `white` |
| `border-radius` | m1-15 | 6-qadam Card CSS | burchak yumaloqligi | `8px` `12px` `50%` |
| `box-shadow` | m1-15 | 6-qadam Card CSS | soya | `0 4px 12px rgba(0,0,0,.15)` |

Selektorlar: `element` (m1-06, s3 Sintaksis) · `.class` (m1-06, s3 Sintaksis (class="row" → .row)). Kirmaydi: border, #id selektori, @media, position, grid.

## 4. JS (2c-bosqich uchun) — faqat Tab tanlaydi

| So'z | Dars | Ekran | Izoh uz | Qolip (Tab) |
|---|---|---|---|---|
| `let` | m2-02 | JsVars s1/s5 | o'zgaruvchi (o'zgaradi) | |
| `const` | m2-02 | JsVars s6 | o'zgarmas | |
| `if` | m2-04 | JsConditions s2 | shart | |
| `else` | m2-04 | JsConditions s5 | aks holda | |
| `else if` | m2-04 | TASK_RADAR_LEVELS | yana bir shart | |
| `true` | m2-04 | JsConditions s3 | rost | |
| `false` | m2-04 | JsConditions s3 | yolg'on | |
| `for` | m2-05 | JsLoops s3 | sikl (sanab) | |
| `while` | m2-05 | JsLoops s6 | sikl (shart bo'lguncha) | |
| `function` | m2-06 | JsFunctions s4 | funksiya | |
| `return` | m2-06 | JsFunctions s1/s3 | javob qaytarish | |
| `=>` | m2-08 | PracticeLesson1 (tugma.onclick = () => {) | qisqa funksiya | |
| `console.log` | m2-02 | JsVars TASK_BALL | konsolga chiqarish | `console.log()` |
| `prompt` | m2-04 | JsConditions s14 | foydalanuvchidan so'rash | `prompt("")` |
| `.length` | m2-05 | JsLoops s8 Massiv | nechta element | `` |
| `onclick` | m2-08 | PracticeLesson1 kod qutisi (tugma.onclick = () => {) | bosilganda | `.onclick = () => {⏎  ⏎}` |
| `oninput` | m2-08 | PracticeLesson1 kod qutisi | yozilganda | `.oninput = () => {⏎  ⏎}` |

Qisqartmalar: `log`+Tab → `console.log();` (m2-02) · `if`+Tab → `if () {⏎  ⏎}` (m2-04) · `else`+Tab → `else {⏎  ⏎}` (m2-04) · `for`+Tab → `for (let i = 0; i < 5; i++) {⏎  ⏎}` (m2-05) · `while`+Tab → `while () {⏎  ⏎}` (m2-05) · `fn`+Tab → `function nom() {⏎  ⏎}` (m2-06)

Kirmaydi (hozircha o'rgatilmaydi): `map`, `filter`, `forEach`, `fetch`, `async/await`, `try/catch`, `class`, `this`, `JSON`, `setTimeout`, `Math.random`, `alert`, `Number()`, `.push()`, `typeof`, `document.querySelector`, `addEventListener`, `textContent`, `classList (PracticeLesson1 kod qutisida yo'q — o'quvchi tugma.onclick yozadi)`

## 5. Topshiriq ↔ xarita tekshiruvi (1.6)

2026-10-01: 1–4c kompilyator topshiriqlari so'ragan teglar (TASK_*/KOD_TASK, HW dan tashqari) xaritada o'sha darsgacha bor — 5/5 ✓ (Html1, Html2, Takrorlash, HtmlPractice, VsCode).

## 6. Hukm qilingan bahsli joylar (foydalanuvchi ko'rib chiqadi — avtopilotda shu hukm bilan davom etildi)

| № | Savol | Hukm | Sabab |
|---|---|---|---|
| X1 | `img` HTML-1 quruvchisida (s14) bor, lekin HTML-2 da o'rgatiladi | `img` → m1-04; HTML-1 ro'yxatida chiqmaydi | Q10 (kodga tegilmaydi); HTML-1 quruvchisi tugma bilan ishlaydi, kompilyator emas |
| X2 | `button` HTML-1 kod qutilarida (s0, s3) ko'rinadi | `button` → m1-04 s7 Forma | HTML-1 da tushuntirilmaydi, faqat ko'rsatiladi |
| X3 | `br` | kirmaydi | hech qaysi darsda o'rgatilmaydi (PracticeLesson1 da 1 marta kodda) |
| X4 | `script` tegi | kirmaydi | JS darslarida `script.js` alohida fayl; `<script>` faqat VS Code testida |
| X5 | `input name`, `label for`, `button type` | kirmaydi | HTML-2 da o'rgatilmaydi (`type="submit"` 1 marta kodda) |
| X6 | CSS `border` | kirmaydi | faqat dars dizayn-kodida, o'quvchiga o'rgatilmaydi |
| X7 | CSS `#id` selektori | kirmaydi | HTML'da `id` HTML Praktikada bor, CSS'da `#id` hech qayerda |
| X8 | JS `alert`, `Number()`, `.push()`, `typeof`, `querySelector`, `addEventListener` | kirmaydi | o'quvchi matnida/kod qutisida yo'q; PracticeLesson1 `tugma.onclick = () => {` o'rgatadi |
| X9 | `nav`, `section` PM Struktura (m1-05) podiumida ko'rinadi | → m1-08 HTML Praktika | PM darsida tushuntirilmaydi; m1-05 koding faqat header/main/footer so'raydi |
| X10 | `span` | → m2-08 PracticeLesson1 (`<span id="son">`) | 1-Modulda o'rgatilmaydi; eski ro'yxatda bor edi |
| X11 | `h4`, `h5` | → m1-03 s8 | «h1 dan h6 gacha — darajalar narvoni» (HTML-1); eski ro'yxatda h1–h3 edi |
