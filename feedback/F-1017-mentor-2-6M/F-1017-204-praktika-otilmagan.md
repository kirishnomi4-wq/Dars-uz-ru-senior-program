# F-1017-204 · Dars ichidagi kompilyator praktikasi darsda o'tilmagan narsani so'raydi — TO'LIQ ro'yxat (17.10)

**Qamrov:** LMS 2–6 dagi `HtmlCompiler` praktikalari (uy vazifasi emas): 11 texnik dars (30 praktika) + 12 PM dars (KODING).
React/Node/Nest texnik darslarida (3–4c) dars ichidagi kompilyator praktikasi yo'q.
**Usul (2-tur, har praktikaga kirib):** praktika matni + starter + har talab (`check`) → o'quvchi yozadigan to'liq yechim → yechimdagi HAR element
praktika ochiladigan ekrangacha (`PRACTICE_AFTER[ekran]` — «Davom etish» bosilganda) shu darsda yoki oldingi darsda qaysi ekranda, qanday gap bilan o'tilgan.
Reja-ekranida faqat tilga olingani «o'tilgan» emas. Tekshiruv-mantiq ham o'qildi (`C.logs` — chiqishlar probel bilan qo'shilib, ichida bormi). Fayllarga tegilmadi.

## Praktikama-praktika

### LMS 2
| Dars | Praktika (qaysi ekrandan keyin) | Holat |
|---|---|---|
| Htmllesson1 | Sarlavhalar h1/h2/h6 (s9) · Havola (s13) · Yakuniy sahifa (s14) | ✅ hammasi o'sha ekranlarda o'tilgan |
| Htmllesson2 | Rasm src/alt (s3) · Forma (s9) · Yakuniy (s15) | ✅ img/src s2, alt s3, header s5, form/input/button s8 |
| HtmlTakrorlash | 5 bosqich | ✅ takrorlash — hammasi 1–2-darsda |
| CssLesson1 | Ranglar (s8) | ✅ color/background-color s6, style.css s4, `h1 { }` s3 |
| CssLesson1 | Matnni kattalashtiring va **tekislang** (s10 «Google Fonts») | 🔴 `text-align: center` — KEYINGI ekran (s11 «Qalinlik · tekislash») |
| CssLesson1 | Qutiga bo'shliq bering (s13, padding ekrani) | 🔴 `margin` — KEYINGI ekran (s14) |
| CssLesson2 | Flex+gap (s8) · Markaz (s10) · Ustun (s13) | ✅ |
| VsCode | Card HTML (s9) | ✅ div, class, ichma-ich — s9 |
| VsCode | Card CSS (s10) | 🟡 `width`, `margin: 40px auto`, `box-shadow: 0 14px 34px rgba(…)` — faqat s10 da bir og'iz izoh bilan; qiymatlar tushuntirilmagan |

### LMS 3
| Dars | Praktika | Holat |
|---|---|---|
| JsVars | 1) `let score=0` → `score=25` → `console.log(score)` (s6) | 🔴 `console.log` va «konsol» hech qayerda yo'q · 🟡 dars o'zi «birinchi marta so'z bilan yozasiz»ni s16 da aytadi — bu praktika undan oldin |
| JsVars | 2) `console.log(5+5)` · `console.log("5"+"5")` (s13) | 🔴 `console.log` (✅ "5"+"5" — s12) |
| JsVars | 3) `let name`, `let age`, `const birth_year` (s16) | ✅ |
| JsConditions | 1) Radar `if/else` + `console.log` (s6) | 🔴 `console.log` faqat reja-namunasida · 🟡 dars `if (…) {` ni qo'lda yozishni s14, `} else {` ni s15 da o'rgatadi |
| JsConditions | 2) `==` til (s12) | 🔴 `console.log` (✅ `==` s11) |
| JsConditions | 3) `else if` + `<=` (s15) | 🔴 `console.log` (✅ else if s8, `<=` s3) |
| JsLoops | 1) for 1..5 (s6) | 🟡 `console.log(i)` s2 dan namunalarda, izohsiz (✅ for/i++/<=) |
| JsLoops | 2) massiv + sikl (s15) | 🟡 xuddi shu (✅ massiv, [i], .length s9–s12) |
| JsFunctions | 1) `function salom()` + chaqirish (s6) | 🟡 `console.log` ma'nosi s8 da (praktikadan KEYIN) |
| JsFunctions | 2) `return kuch*3` + `console.log(zarar(5))` (s13) | 🟡 chaqiruvni log ichiga yozish ko'rsatilmagan (o'tilgan: `let ochko = zarar(…)`) |
| JsFunctions | 3) `"Salom, " + ism`, 2 chaqiruv (s16) | ✅ |
| PeanStack | Narx funksiyasi · Bazadagi ro'yxat | ✅ oldingi darslar |

### PM darslar (KODING)
| Dars | Vazifa | Holat |
|---|---|---|
| PmLesson1 (m1-02) | [KIM]/[MUAMMO]/[YECHIM] matnini almashtirish | ✅ bilim talab qilmaydi |
| PmLesson2, PmLesson3 | header/main/footer + h2/p | ✅ Htmllesson2 |
| PmLesson4 | `<li><b>…</b> — …</li>` | ✅ namuna starterda |
| PmMuammoIzlash | li + `.birinchi { background }` | ✅ |
| PmLesson5 (m2-07) | sikl ichida shart | 🔴 tekshiruv `===` talab qiladi, `==` ni rad etadi; darsda faqat `==` |
| PmLesson6 (m2-13) | qatlamlarni gapga aylantirish | 🔴 obyekt `{kalit: ""}` va `nomlar[qatlam]` — M2 da obyekt o'tilmagan |
| PmLesson9 (m3-10) | 3 shartli funksiya | 🟡 `&&` o'rgatilmagan (bir nechta `if` bilan yechiladi) |
| PmLesson11, PmLesson13 | massiv+obyekt filtr · obyektga maydon | ✅ ReactCrud, DataIntro |
| PmLesson15 (m4a-02) | sig'imdan oshganlar | 🟡 obyekt ustidan sikl o'rgatilmagan (3 `if` bilan yechiladi) |
| PmLesson17 (m4c-02) | haftalarga taqsimlash | 🔴 massiv ichida massiv + yig'indi bilan taqsimlash algoritmi — hech qayerda |

**Ildiz (CssLesson1):** praktika ekran RAQAMI bilan bog'langan; yangi ekranlar qo'shilganda siljigan (koddagi eski izoh «7=Rang formatlari · 9=Qalinlik · 12=margin»).
**Ma'lumot:** PracticeLesson1 da 3 eski praktika kodda bor, `PRACTICE_AFTER = {}` — ko'rinmaydi.
