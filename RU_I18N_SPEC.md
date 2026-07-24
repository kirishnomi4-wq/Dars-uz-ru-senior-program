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
| Modul-darajali data (QUIZ_BANK, RECAPS, FLASHCARDS, STEPS, OPTS, BADGES…) | Maydon qiymati `{ uz: '…', ru: '…' }` obyekt bo'lib SAQLANADI; **tr() faqat render-joyda** chaqiriladi: `{tr(item.label)}` |
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
| `InternetLesson.jsx` | ✅ | ✅ | 434 ru-juft, esbuild toza, kalitlar HEAD bilan aynan (2026-07-24). MAXSUS: infra oldindan bor edi (`useLang`/`useT` kontekst) — ustiga spec `tr()`/`__lang` qo'yildi; RECAPS/QUIZ_BANK/Flashcards/DragDrop/Podium/arena/TourGuide notekis qolgan edi — to'ldirildi. 3 ta yashirin CRASH tuzatildi: `Q_LABELS[q]`, `a.desc`, `ach.desc` render'da `tr()` siz obyekt edi |
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

### 3-Modul (React, PM'siz — 2026-07-23 yakunlandi: 10/10 ✅, ~4 640 ru-juft; yakuniy sweep: 10/10 esbuild toza, 10/10 kalit-qiymatlari (INLINE_KEYS/correct/correctIdx) HEAD bilan aynan)
| Dars | Infra (tr/__lang) | Kontent RU | Izoh |
|---|---|---|---|
| `ReactIntroLesson.jsx` | ✅ | ✅ | 575 ru-juft, esbuild toza, kalitlar diff'da o'zgarmagan (2026-07-23) |
| `ReactFirstComponentLesson.jsx` | ✅ | ✅ | 566 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). S15 final-check regex/placeholder kod holicha |
| `ReactPropsReuseLesson.jsx` | ✅ | ✅ | 545 ru-juft, esbuild toza, kalitlar diff'da o'zgarmagan (2026-07-23). S15 checks-regex va DragDrop/Debug kod-qatorlari UZ/kod holicha |
| `ReactStateEffectLesson.jsx` | ✅ | ✅ | 383 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). S15 regex-checklar/placeholder kod holicha |
| `ReactApiGetLesson.jsx` | ✅ | ✅ | 572 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23) |
| `ReactApiPostLesson.jsx` | ✅ | ✅ | 439 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). S16 compiler-check placeholder/regex kod holicha |
| `ReactRouterPracticeLesson.jsx` | ✅ | ✅ | 553 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). MAXSUS: S11 `added.page` matn-taqqoslash → `added.path === '/about'` (til-mustaqil) |
| `ReactCrudPracticeLesson.jsx` | ✅ | ✅ | 385 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). S14 setGames-regex/tagpill kod holicha |
| `ReactBuildSiteLesson.jsx` | ✅ | ✅ | 398 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). MAXSUS: S2 SCREENS `{v,t}` (ichki qiymat UZ — chosen/valid-Set relslari), S13 JOURNEY barqaror `id` |
| `ReactProjectDayLesson.jsx` | ✅ | ✅ | 423 ru-juft, esbuild toza, kalitlar tekshirildi (2026-07-23). LivePractice payload'da UZ-etalon (`title.uz`) |

### 4-Modul (backend/fullstack, PM'siz — 2026-07-23 yakunlandi: 11/11 ✅, ~4 100 ru-juft; yakuniy sweep: 11/11 esbuild toza, 11/11 kalit-qiymatlari (INLINE_KEYS/correct/correctIdx) HEAD bilan aynan; LivePractice payload 11/11 UZ-etalonga birxillashtirildi)
| Dars | Infra (tr/__lang) | Kontent RU | Izoh |
|---|---|---|---|
| `ApiPostmanLesson.jsx` | ✅ | ✅ | 361 ru-juft (2026-07-23). `produts→products` debug click-target va server xato-regex kod holicha |
| `AuthEnvLesson.jsx` | ✅ | ✅ | 393 ru-juft (2026-07-23). S15 `JWT_SECRET=` regex/namuna til-mustaqil kod holicha |
| `BackendCrudPracticeLesson.jsx` | ✅ | ✅ | 475 ru-juft (2026-07-23). JSON mock-javoblar kod bilan sinxron; CHAIN render `key={c}`→`key={i}` (obyekt-key xavfi) |
| `DataIntroLesson.jsx` | ✅ | ✅ | 378 ru-juft (2026-07-23). USERS/POSTS simulyatsiya-datasi UZ holicha (DataTable xom chizadi); S11 jadval-nom extract til-mustaqil (`t.uz.split`) |
| `DbSqlNosqlLesson.jsx` | ✅ | ✅ | 590 ru-juft (2026-07-23). SQL-namuna/DB-data sinxron holicha; `ynbtn` ichki `'ha'/'yoq'` kod, ko'rinadigan «Да/Нет» tarjima |
| `FullstackConnectPracticeLesson.jsx` | ✅ | ✅ | 371 ru-juft (2026-07-23). MAXSUS: CIRCLE `includes('→')` → `c.uz.includes` (til-mustaqil); real CORS xato-satri inglizcha |
| `FullstackFeedbackLesson.jsx` | ✅ | ✅ | 390 ru-juft (2026-07-23). PART_OPTS solishtiruv-kalitlari UZ, ko'rinadigan yorliq `PART_LABELS` render-xaritada; `confirm`-regex holicha |
| `FullstackProjectDayLesson.jsx` | ✅ | ✅ | 559 ru-juft (2026-07-23). S16 yozma sinov SQL-regex/tagpill kod holicha |
| `NodeServerLesson.jsx` | ✅ | ✅ | 555 ru-juft (2026-07-23). S15 `hasGet/hasPath/hasSend` regex va `'Salom, dunyo!'` kod-literallar holicha; UZ-regressiya unwrap-diff bilan tekshirildi |
| `PostgresCrudLesson.jsx` | ✅ | ✅ | 372 ru-juft (2026-07-23). SQL kalit-so'z/namunalar aslicha; S15 INSERT/VALUES parse-regex holicha |
| `RoutingLesson.jsx` | ✅ | ✅ | 362 ru-juft (2026-07-23). URL-path/dekoratorlar aslicha; QuestionScreen `ou()` helper — payload options/javoblar UZ-etalon |

### 4a/4b/4c-Modul (Nest/Test/CI-CD, PM'siz — 2026-07-23 yakunlandi: 10/10 ✅, ~5 200 ru-juft; yakuniy sweep: 10/10 esbuild toza, 10/10 kalit-qiymatlari ish-oldi baseline `4a135c8` bilan aynan (HEAD sessiya ichida siljigan), LivePractice payload 10/10 UZ-etalon formula)
> Bu to'lqinda `ou()`/`ouz()` helper-konvensiya mustahkamlandi: QuestionScreen analytics-payload (`options`/`correctAnswer`/`studentAnswer`) doim UZ-etalon.
| Dars | Infra (tr/__lang) | Kontent RU | Izoh |
|---|---|---|---|
| `4a/NestArchResourceLesson.jsx` | ✅ | ✅ | 417 ru-juft (2026-07-23). FLOW `key={i}` (obyekt-key xavfi); restoran-metafora RU'da to'liq |
| `4a/NestArchPracticeLesson.jsx` | ✅ | ✅ | 621 ru-juft (2026-07-23). SHOP_FLOW `key={i}`; kitob nomlari RU o'rnashgan tarjimada |
| `4a/NestArchAliveLesson.jsx` | ✅ | ✅ | 596 ru-maydon (2026-07-23). CSS bayt-aynan; s9 bekat-nomi ichma-ich tr bilan til-mustaqil |
| `4b/EdgeCasesTestLesson.jsx` | ✅ | ✅ | 412 ru-juft (2026-07-23). Jest-terminal simulyatsiya/kod-literallar kod bilan sinxron holicha; DD id-asosli |
| `4b/JestUnitTestLesson.jsx` | ✅ | ✅ | 534 ru-juft (2026-07-23). `it('...')` test-nomlari kod holicha; CARD_CORRECT aynan |
| `4c/CiCdIntroLesson.jsx` | ✅ | ✅ | 570 ru-juft (2026-07-23). YAML aslicha; BELT_ITEMS label obyektga qayta qurilgan (DragDrop id-asosli) |
| `4c/GithubActionsLesson.jsx` | ✅ | ✅ | 638 ru-juft (2026-07-23). MAXSUS: BeltRun `includes('UCHIRISH')` → `(s.label.uz||s.label).includes` (til-mustaqil); jurnal rang-heuristikasi emoji-asosli |
| `4c/AiPipelineProjectLesson.jsx` | ✅ | ✅ | 589 ru-juft (2026-07-23). Simulyatsion LENTA JURNALI tarjima qilindi (check-bog'lanmagani tasdiqlangan); ci.yml aslicha |
| `4c/FullProPipelineLesson.jsx` | ✅ | ✅ | 555 ru-juft (2026-07-23). Aeroport-metafora RU'da izchil (лента/чемодан/сейф) |
| `4c/FullPipelineProjectLesson.jsx` | ✅ | ✅ | 546 ru-juft (2026-07-23). Metafora-lug'at GithubActions bilan sinxron (КОНВЕЙЕР/СТАРТ-СИГНАЛ); S13 validatorlari tegilmagan |

### 1-Modul PM darslari (v2, PM pipeline)
| Dars | Infra (tr/__lang) | Kontent RU | Izoh |
|---|---|---|---|
| `PmAudienceLesson.jsx` | ✅ | ✅ | 356 juft, esbuild+vite toza, kalitlar tekshirildi (2026-07-23). MAXSUS: kompilyator starter RU (`[КТО]/[ПРОБЛЕМА]/[РЕШЕНИЕ]`) + UNION-check (ikkala til placeholderi) — til almashganda saqlangan kod buzilmaydi; `AUD_MAVHUM` regex RU («все/всех») qamraydi |
| `PmStructureLesson.jsx` | ⬜ | ⬜ | navbatda |
| `PmPitchLesson.jsx` | ⬜ | ⬜ | navbatda |
