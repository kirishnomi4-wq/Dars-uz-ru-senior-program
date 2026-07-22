# 🌐 RU_I18N_SPEC — darslarni UZ-RU ikki tilga o'tkazish konvensiyasi

> **Maqsad:** har bir dars `lang` prop (`'uz'` | `'ru'`) bilan ochilganda BUTUN ko'rinadigan matn shu tilda chiqsin.
> `App.jsx`da global UZ/RU tanlagich bor (localStorage `cc_lang`), dars komponentiga `<C lang={lang} />` uzatiladi.
> Namuna (pilot): `src/1-Modull/Htmllesson1.jsx`.

## 1. Mexanizm (har darsda BIR XIL)

Har dars faylida `useT` ta'rifidan keyin shu blok turadi (Htmllesson1'dan aynan ko'chiriladi):

```js
// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
```

Va default export komponent tanasining ENG BOSHIda (`const lang = langProp || 'uz';` qatoridan keyin):

```js
__lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
```

## 2. Yozuv qoidalari (pattern'lar)

| Holat | Qanday yoziladi |
|---|---|
| JSX ichidagi oddiy matn | `<p>Matn</p>` → `<p>{tr({ uz: 'Matn', ru: 'Текст' })}</p>` |
| Atribut (placeholder, title, label, aria-label) | `placeholder={tr({ uz: '…', ru: '…' })}` |
| Ichida `<b>`/`<span>` bor boy matn | `tr({ uz: <>… <b>x</b> …</>, ru: <>… <b>х</b> …</> })` — tr JSX'ni ham qaytaradi |
| Modul-darajali data (QUIZ_BANK, RECAPS, FLASHCARDS, STEPS, OPTS, BADGES…) | Maydon qiymati `{ uz: '…', ru: '…' }` obyekt bo'lib SAQLANADI; **tr() faqat render-joyда** chaqiriladi: `{tr(item.label)}` |
| Shablon-string ichida matn | Bo'lib chiqarish: `` `${tr({uz:'Savol',ru:'Вопрос'})} ${n}` `` |
| lessonTitle | Allaqachon `{uz,ru}` — render joyida `tr(LESSON_META.lessonTitle)` |

**QAT'IY:** `tr()` ni modul-darajasida (data ta'rifi ichida) chaqirish MUMKIN EMAS — u import paytida, til o'rnatilishidan OLDIN ishlaydi va doim 'uz' qaytaradi. Data obyekt saqlaydi, render tarjima qiladi.

## 3. NIMA tarjima qilinadi (ko'rinadigan hamma narsa)

- Ekran sarlavhalari, eyebrow'lar, Mentor gaplari, tugma yorliqlari (`Davom etish`, `Tekshirish`…)
- Test savollari, variantlar matni, izoh/feedback matnlari, RECAPS kartalari
- Flashcards old/orqa tomoni, Badges nom+tavsif+toast, TourGuide/onboarding matnlari
- DragDrop/Debug topshiriq yorliqlari va maslahatlari, praktika TASK label'lari va check hint'lari
- Podium/arena UI matnlari, summary/yakun ekrani, xato-xabarlar, placeholder'lar
- Kod-namunalar ichidagi KONTENT matni (masalan `<h1>Xush kelibsiz</h1>` → RU rejimda `<h1>Добро пожаловать</h1>`) — FAQAT agar hech bir check/regex/DragDrop-tekshiruv shu matnga bog'lanmagan bo'lsa (avval tekshiriladi!)

## 4. NIMAGA TEGILMAYDI (buzilish xavfi)

- `id`, `key`, `lessonId`, `SCREEN_META`, class nomlari, palitra/uslub
- **Jonli-ball relslari:** `INLINE_KEYS`, `set_quiz_keys`, `correct`/`correctIdx` indekslar, `answerKey`, screen_idx
- `checks.*` regex/selektorlari va ular qiyoslaydigan qiymatlar (faqat foydalanuvchiga ko'rinadigan `hint` matni tarjima qilinadi — obyekt sifatida, render'da tr)
- `useAudio([...])` segment matnlari — audio o'chirilgan (AUDIOSIZ), ko'rinmaydi → UZ holicha qoladi
- Kod-kommentlar, console matnlari
- Tarjima natijasida biror tekshiruv (DragDrop to'g'ri-tartib, Debug kutilgan-qiymat, compiler check) matnga bog'liq bo'lsa — o'sha matn TARJIMA QILINMAYDI yoki tekshiruv ham tilga moslanadi (ikkalasini sinxron)

## 5. RU tarjima uslubi

- «Вы»-forma, o'smirga do'stona, jonli so'zlashuv (MATN_ETALONI ruhi, lekin ruscha tabiiy)
- So'zma-so'z emas — ma'noga tarjima; metafora saqlanadi (dinozavr, restoran…)
- Texnik atamalar: `тег`, `атрибут`, `ссылка`, `заголовок`; kod-entity'lar (`<h1>`, `href`) aslicha
- Emoji va formatlash (bold, italic) UZ bilan bir xil joyda
- UZ matnga TEGILMAYDI (u etalon holida qoladi)

## 6. Apostrof/escape xavfi (DARS_ETALON 15-G)

UZ matnda `'` (o'zbekcha apostrof) ko'p — `{uz:'…', ru:'…'}` yozganda single-quote string ichida `\'` escape yoki qo'shtirnoq ishlatilsin. Har 30-40 tahrirdan keyin build tekshirilsin:

```
npx esbuild src/1-Modull/<Fayl>.jsx --loader:.jsx=jsx --outfile=C:\Users\ADMIN\AppData\Local\Temp\claude\esb_check.js
```

## 7. Tayyorlik mezoni (har dars uchun)

1. esbuild toza (exit 0)
2. `grep -c "ru:"` — fayl bo'ylab yuzlab (kontent qamrovi), modul-data'da tr() chaqiruvi YO'Q
3. UZ rejim vizual o'zgarmagan (default `__lang='uz'` + tr string-passthrough = eski xatti-harakat)
4. Jonli-ball kalitlari diff'da o'zgarmagan (`INLINE_KEYS`, `correct`, `set_quiz_keys` qatorlari)

## 8. Qamrov holati

| Dars | Infra (tr/__lang) | Kontent RU | Izoh |
|---|---|---|---|
| `Htmllesson1.jsx` | ✅ | ✅ | pilot — 540+ juft, esbuild toza |
| `Htmllesson2.jsx` | ✅ | ✅ | 446 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `CssLesson1.jsx` | ✅ | ✅ | 469 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `CssLesson2.jsx` | ✅ | ✅ | 418 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `HtmlPractice.jsx` | ✅ | ✅ | ~595 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `GitLesson.jsx` | ✅ | ✅ | 613 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `CssPractice.jsx` | ✅ | ✅ | 411 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `DeployLesson.jsx` | ✅ | ✅ | 385 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |

### 2-Modul (texnik, PM'siz — 2026-07-22 yakunlandi: 10/10 ✅, ~5 700 ru-juft; yakuniy sweep: 10/10 esbuild toza, 10/10 kalitlar HEAD bilan aynan)
> Qo'shimcha tuzatishlar shu yurishda: `JsLoopsLesson.jsx` — eskidan mavjud `useAudio`/`getAudioEngine` ReferenceError (no-op stub qo'shildi); `JsVarsLesson.jsx` — `import React` yo'q edi (React.Fragment/isValidElement uchun tuzatildi).
| Dars | Infra (tr/__lang) | Kontent RU | Izoh |
|---|---|---|---|
| `JsIntroLesson.jsx` | ✅ | ✅ | 620 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `JsVarsLesson.jsx` | ✅ | ✅ | 351 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `JsConditionsLesson.jsx` | ✅ | ✅ | 526 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `JsLoopsLesson.jsx` | ✅ | ✅ | 559 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `JsFunctionsLesson.jsx` | ✅ | ✅ | 565 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `PeanStackLesson.jsx` | ✅ | ✅ | 592 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `PracticeLesson1.jsx` | ✅ | ✅ | 638 juft, esbuild toza, kalitlar/checks tekshirildi (2026-07-22) |
| `PracticeLesson2.jsx` | ✅ | ✅ | 656 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `PracticeLesson3.jsx` | ✅ | ✅ | 587 juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
| `PracticeLesson4.jsx` | ✅ | ✅ | 587 ru:-juft, esbuild toza, kalitlar tekshirildi (2026-07-22) |
