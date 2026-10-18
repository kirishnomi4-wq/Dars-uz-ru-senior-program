# JURNAL — LMS 2–6 mentor fidbeklari (3-seans, 17.10.2026)

**Chegara:** src/1-Modull · 2-Modull · 3-Modull · 4-Modull · 4a/4b/4c-Modull (LMS 2–6).
TEGILMAYDI: 18 praktika fayli + DeployLesson (1-seans) · src/5…12-Modull (2-seans) · App.jsx, src/mentor, src/live, src/qolip, scripts/, package.json (nazorat).
F-ID: F-1017-200…299. Commit yo'q.

---

## F-1017-200 · «asbob» so'zi — 17.10 12:23 ✅
**Fidbek (mentorlar, 2 surat `F-1017-200-1.png`, `-2.png`):** ReactIntro «tayyor asboblar to'plami», JestUnitTest «Test asbobi kerak — Jest» — o'quvchilar behayo ma'noda tushunib kulishadi. Foydalanuvchi: «biror darsda bo'lmasin»; «vosita ham tushunarsiz».
**Tashxis:** butun `src/` da 229 ta; LMS 2–6 da 52 (16 fayl), 7–14 da ~176. Ildiz — MATN_KORPUS (c) bandida «Express — … **asbob**» ✅ namuna sifatida turgan edi.
**Qaror:** A (LMS 2–6 shu yerda, 7–14 → 2-seansga topshiriq). So'z: narsaning o'z nomi (dastur · paket · bo'lak · muhr). ChatGPT tavsiyasi filtrdan o'tdi: tamoyil Qabul, «vosita» Rad, «UI bo'laklari» Qisman, «maxfiy kalit» Qabul.
**Qilindi (16 fayl, skript `scratchpad/f200.py`, zaxira `scratchpad/oldin-200/`):**
- ReactIntro → «tayyor bo'laklar to'plami» (5 joy, ru «готовых блоков») · ReactFirstComponent (Vite) → dastur
- ApiPostman → «postachi dastur», noto'g'ri variant «maxsus qurilma» · JestUnitTest → «Testlarni ishga tushiradigan dastur kerak» (+2 test varianti, kartochka)
- NodeServer → «Paketlar do'koni», «Express paketi», «paketni chaqir» (14 joy, ru «пакет») · AuthEnv → «bilaguzukdagi muhr shu kalit bilan bosiladi»
- PmLesson18 (o'lchagich) → dastur (7) · PM sarlavha izohlari (PmLesson1/2/3/4/9/11/13/15/17) → «oyna», «kompilyator»
**Darvozalar:** 16 fayl — yiqilgan faqat `tell`/`emoji`, oldin/keyin soni va matni bir xil (eski, tahrir qo'shmagan); lint:jsx toza; lint:prompt toza. Grep LMS 2–6: 0.
**Sinf-supurish:** LMS 2–6 — 16 fayl, 0 qoldi. 7–14 → `TOPSHIRIQ-2seans-asbob.md` (BotAiAgent «asbob sumkasi» metaforasi — qaror kerak). P0 PmUserStory:1552 izoh → nazorat.
**Muhrlandi:** MATN_KORPUS §229 (+ (c) bandidagi eski ✅ tuzatildi) · MATN_ETALONI LUG'AT «asbob» qatori (+ drel izohi «qurilma») · til-lint `asbob` (error).
**Ochiq:** «vosita» (LMS 2–6 da 41 marta: 19 PracticeLesson1 — 1-seans, 22 — 11 dars; chatda avval «24» deb xato aytilgan, tuzatildi) — foydalanuvchi qarori kutilmoqda.

## F-1017-201 · «Ustimga keling» / «Ustimdasiz!» — 17.10 ✅
**Fidbek (mentorlar):** hover-joyda «ustimga keling» bor — o'quvchilar kuladi.
**Tashxis:** m2-08 PracticeLesson1 eski hover-namunasi (51b2045^ :892, LMS prod'dagi versiya). Joriy `src/` da yo'q — 1-seans 16.10 da qayta qurganda olingan (F-1015-332); 18.10 relizda prod'dan ham ketadi. Butun src qidirildi: 0.
**Qaror (foydalanuvchi):** darsga tegilmaydi, faqat lint.
**Muhrlandi:** til-lint `ustimga` (error, `\b[Uu]stim(?:ga|da|dan)`; CSS-izoh «karta ustimda» istisno). Sinov: eski fayl → 🔴 tutildi; joriy PracticeLesson1 va FullstackFeedback → 0.

## F-1017-202 · sudraladigan oq chiplar → gradient (praktika seansi topshirig'i F-1015-361 davomi, qaror 13-A) — 17.10
**Topshiriq:** `feedback/F-1015-amaliyot/PROMPT-3seans-oq-chiplar.md` (DE 159.15, namuna SystemArchitecture `.dd-chip`). 1–4c dagi 17 `.dd-chip` ni praktika seansi 12:17 da qilgan (`XABAR-3seans-dd-chip.md`) — tegilmadi.
**Qilindi (2 fayl, zaxira `scratchpad/oldin-202/`):**
- DataIntro `.cdrag-chip` (09/23): gradient, oq matn, chegara yo'q, padding +2px (chegara o'rni); ⠿ o'z span'ida bor. Hover soyasi gradientga; `.fk` qatori → ichki FK belgisi oq fon + «vilka» oq (gradient ustida o'qilsin).
- NestArchResource `.oc-plate-chip` (14/22, «Mijozni kiriting» dan keyin): gradient; ⠿ matnda. `.held` → oq+accent halqa, `animation: none` (tap-hint pulsatsiyasi halqani bosmasin).
**Karta — o'zgartirilmadi, qaror so'raldi:** DbSqlNosql `.qx-card` (emoji + nom, dars o'zi «karta» deydi, binafsha «weird» varianti ma'noli) · NestArchAlive `.rz-card` (zona yorlig'i + emoji + nom + kod, 3–4 qator).
**Suratlar:** `f202/oldin/` · `f202/keyin/` · `f202/variant/` (karta prototiplari vaqtinchalik nusxadan, nusxa o'chirildi).
**Darvozalar:** 2 fayl — tell/emoji chiqishi zaxira bilan aynan bir xil (eski); lint:jsx toza.
**Kuzatuv:** NestArchResource da gradient chip yonidagi «Mijozni kiriting» tugmasiga o'xshab qoldi (farq — ⠿ va ochroq gradient).
**Qaror sahifasi:** https://claude.ai/artifact/S5vF6eSM2FCRiKNkdhrKdC (1 qx-card · 2 rz-card · 3 «vosita»; manba `scratchpad/qaror/`). Javob kutilmoqda.

## Qarorlar keldi (17.10 ~13:00): 1 = A · 2 = B · 3 = 1
**F-1017-202 davomi — DbSqlNosql `.qx-card` → gradient** (binafsha «weird» o'z qoidasi bilan qoladi; `.reject` halqasi oq+accent). `.rz-card` — oq qoldi (karta). Surat `f202/keyin/DbSqlNosqlLesson.png`.
## F-1017-203 · «vosita» → narsaning o'z nomi ✅ 13:10
**Qilindi (11 dars, 22 joy; skript `scratchpad/f203.py`, zaxira `scratchpad/oldin-203/`):** dastur (Live Server, Node.js, npm, Postman-test variantlari, CiCd variantlari) · usul (JsIntro sistema/algoritm, sikl) · mavzu (JsLoops «2 katta mavzu», ru «темы») · qayta tuzish («qaysi vosita ishlatiladi?» → «nima ishlatiladi?», «Buni qiladigan narsaning nomi — React», DataIntro «kompyuterda chizmoqchimisiz?», PeanStack note «frontend uchun»).
**Darvozalar:** 12 fayl — tell/emoji chiqishi zaxira bilan aynan bir xil (eski); lint:jsx toza; lint:prompt toza. Grep LMS 2–6 (PracticeLesson1 siz): 0.
**Muhrlandi:** til-lint `vosita` (warn, kod o'zgaruvchilari istisno) · LUG'AT «vosita» qatori · KORPUS §229 juftlik + §(sistema/algoritm) namunasi «usul»ga.
**Topshiriqlar:** 1-seans — `feedback/F-1015-amaliyot/TOPSHIRIQ-1seans-vosita.md` (PracticeLesson1, 4 qator) · 2-seans — `TOPSHIRIQ-2seans-asbob.md` ga qo'shimcha (7–14 da 26 joy, 8 fayl).

## F-1017-204 · praktika darsda o'tilmagan narsani so'raydi — TASHXIS → TUZATILDI ✅ (17.10)
**Fidbek (foydalanuvchiga kelgan case):** dars ichidagi kompilyator praktikasida darsda o'tilmagan narsa so'ralgan (uy vazifasi emas).
**Qilindi:** LMS 2–6, 11 texnik dars (30 praktika) + 12 PM KODING. Ro'yxat: `F-1017-204-praktika-otilmagan.md` — 🔴 6 (CssLesson1 text-align/margin — ekran raqami siljigan; console.log 9 praktikada; PmLesson5 `===`; PmLesson6 obyekt; PmLesson17 ichma-ich massiv) · 🟡 4 · ✅ qolgani. Fayllarga tegilmadi.
**Saboq:** avtomatik kalit-so'z skani ishonchsiz (darsning o'z JSX/style kodi va reja-ekrani «o'tilgan» bo'lib chiqadi) — qo'lda kontekst bilan tekshirildi; skriptlar `scratchpad/praktika-tahlil2.py`, `kontekst.py`.
**2-tur (foydalanuvchi: «har biriga kir, halol, shoshilmasdan»):** har praktika — matn, starter, `check`, o'quvchi yechimi, har element qaysi ekranda o'tilgani; `C.logs` mantiqi o'qildi. Yangi topilmalar: console.log JsLoops/JsFunctions-1 da namunada bor (🟡), JsVars/JsConditions da yo'q (🔴); JsVars-1 va JsConditions-1 dars o'zining «qo'lda yozish» ekranidan oldin (🟡); JsFunctions-2 `console.log(zarar(5))` (🟡); VsCode Card CSS qiymatlari izohsiz (🟡). Ro'yxat fayli yangilandi.
**Qaror sahifasi:** https://claude.ai/artifact/S5vF6eSM2FCRiKNkdhrKdC (2-versiya, 6 savol) → javob keldi, hammasi A — pastda.

## F-1017-204 · TUZATILDI (17.10, qarorlar 1–6 = A) ✅
**Qilindi (9 fayl, zaxira `scratchpad/oldin-204/`):**
1. **JsVars s5** (let ekrani): kodga `console.log(score)` qatori + «Konsol» oynasi (`> 25`) + Mentor bir gapi. Surat `f204/JsVars-s5.png`.
2. **CssLesson1** `PRACTICE_AFTER` 10→11, 13→14 (text-align va margin ekranlaridan keyin); izohga «ekran qo'shsangiz — raqamni qayta tekshiring». LMS'ga faqat `entry.task` boradi — raqam xavfsiz.
3. **PmLesson5** c2: `/={2,3}\s*"v1"/` — `==` ham qabul; maslahat «ikki teng belgi … bitta = qiymat soladi».
4. **PmLesson6**: starter obyektsiz — `nomlar` + `javoblar` massivlari, `oddiyGap(i)`; eval c1/c2 qayta yozildi; maslahatlar; Mentor «Obyekt, funksiya va sikl» → «Massiv, …» (yolg'on da'vo edi); ekrandagi `oddiyGap(i)`; saqlov `:code2` + eski obyektli kod tiklanmaydi. Node-sinov: starter [F,F,F], yechim [T,T,T].
5. **PmLesson17**: starter — skelet (`natija`/`hafta`/`kunlar` + sikl), o'quvchi `if (false)` o'rniga shart yozadi (izohda so'z bilan); sarlavha/brief/placeholder uz+ru; saqlov `:code2`. Node-sinov: skelet [T,F,F] (1-shart skeletda yashil — izoh yangilandi), `kunlar + ish.kun > SIGIM` → [T,T,T].
6a. **VsCode Card CSS**: izohlar qiymatni aytadi (eni · tepada 40px, ikki yon teng · burchak · o'ngga 0, pastga 14px, yoyilishi 34px; rgba — xira qora). **Yo'l-yo'lakay topilgan BUG:** satr chizuvchi `replace(';','')` — ekranda `width: 260px  margin: 40px auto;;` chiqardi (o'quvchi ko'chirsa width ishlamaydi, «markazda» sharti o'tmaydi) → har xossa alohida chiziladi. Supurish: shu naqsh boshqa darsda 0. Surat `f204/VsCode-s10.png`.
6c. **JsFunctions** TASK_KVADRAT: `let natija = zarar(5)` + `console.log(natija)` (o'tilgan usul, s7).
6d. **PmLesson9** brief: «har shart uchun alohida if … return false, oxirida return true» (uz+ru).
6e. **PmLesson15** brief: «har qism uchun alohida if … push» (uz+ru).
6b — qoldi (qaror).
**Darvozalar:** 9 fayl — tell/emoji xatolari zaxira bilan aynan bir xil (qator raqamisiz solishtirildi); lint:jsx toza (257); til-lint error 0, warn'lar eski. Xato tutildi: PmLesson9 da `{/* */}` obyekt-literal ichiga qo'yilgan edi → `/* */` ga tuzatildi (darvozadan oldin).
**Muhr ✅ 14:5x:** DARS_ETALON **212-QONUN** «Praktika faqat o'tilganni so'raydi» (12-BW, 5 band; foydalanuvchi «212 to'g'ri bo'lsa yoz»). lint:prompt toza. Avvalgi holat: DE da hozir ikkita «211-QONUN» bor (F-1015-369 va F-1015-164), fayl 14:49 da boshqa seansda tahrirlangan — raqam foydalanuvchi bilan.
> **Nomzod qonun — PRAKTIKA FAQAT O'TILGANNI SO'RAYDI (F-1017-204):** (1) dars ichidagi kompilyator praktikasi (`PRACTICE_AFTER`, KODING) yechimidagi har element — teg, xossa, kalit so'z, operator, `console.log` — praktika ochiladigan ekrangacha shu darsda yoki oldingi darsda ko'rsatilgan VA bir gap bilan tushuntirilgan bo'ladi; reja-ekranida tilga olish yoki kod namunasida izohsiz ko'rinish yetmaydi. (2) Tekshiruv darsda o'tilgan variantni rad etmaydi (`==` o'tilgan bo'lsa `===` ni majburlamaydi). (3) `PRACTICE_AFTER` ekran raqamiga bog'langan — ekran qo'shilsa/olinsa raqam qayta tekshiriladi (CssLesson1: 2 praktika mavzusidan bir ekran oldin ochilardi). (4) O'tilmagan tuzilma (obyekt, ichma-ich massiv, algoritm) kerak bo'lsa — starter skelet beradi, o'quvchi faqat o'tilgan qismni yozadi.

## F-1017-205 · praktika SHARTLARI ortiqcha/qattiq/bo'shmi — TASHXIS → TUZATILDI ✅ (17.10)
**Fidbek (foydalanuvchi):** «praktika kompilyatorda beradigan shartimiz ortiqchami — aniqla, to'liq tekshir».
**Usul:** haqiqiy `HtmlCompiler`da sinov — `vositalar/shart-sinov.mjs` + `shart-holatlar.mjs` (darslar diskda o'zgarmaydi: esbuild plagini xotirada `export __T`). 42 vazifa, 95 holat: kanonik yechim · to'g'ri variantlar (qattiqlikni ushlaydi) · tipik xato (bo'shlikni ushlaydi). Natija `F-1017-205-shart-sinov.json`. 90/95 kutilgandek.
**Topilmalar:**
1. 🔴 **PmLesson3** KOD_TASK — sarlavha va brief PmLesson2 dan ko'chirilgan («OLX», header/main/footer, 4 bo'lim, tartib), shartlar esa boshqa (header ichida h1 + yechim jumlasi p ≥15 belgi, main ichida h2). Brief bo'yicha to'g'ri yozilgan sahifa 2/4. Shartlar + placeholder + ekran gapi bir-biriga mos — xato faqat title/brief'da.
2. 🔴 **VsCode TASK_STYLE** `isGreenish` — rang NOMI (red, blue…) tanilmasa `true` qaytaradi → qizil fon «yashil fon» bo'lib o'tadi.
3. 🟡 **JsVars TASK_BALL** — `let score = 25` o'tadi: «0 → 25 ga o'zgartiring» tekshirilmaydi (praktikaning maqsadi — let o'zgaradi).
4. 🟡 **JsFunctions TASK_QAYTA** — `"Salom, " + ism + "!"` RAD: bitta logs('Salom, Aziza Salom, Bobur') birlashgan matnni talab qiladi.
5. ⚪ **CssLesson1 TASK_BOX** — faqat `margin-top` o'tmaydi (matn aniq `margin` deydi) — qoldirish tavsiya.
6. ⚪ Takror shartlar (zarar emas, bosqichma-bosqich yashil): PmLesson9 `bool` ⊂ `sinov`; PmLesson11/15/17 `royxat` ⊂ natija-sharti.
**Qaror:** foydalanuvchi «taklifing bo'yicha qil».
**TUZATILDI ✅ (foydalanuvchi «taklifing bo'yicha qil»; zaxira `scratchpad/oldin-205/`):**
1. PmLesson3 KOD_TASK sarlavha+brief (uz/ru) shartlarga moslandi: «Yechim jumlangizni sahifa tepasiga chiqaring — header ichida h1 + p, main ichida h2 + p».
2. VsCode `isGreenish`: rang nomi brauzer orqali rgb ga aylantiriladi (red/blue rad, green/lime o'tadi); gradient kabi o'qib bo'lmaydiganlar — avvalgidek yumshoq.
3. JsVars TASK_BALL: 3-shart «score = 25 — qiymat o'zgartirildi» (`let`siz qayta yozish).
4. JsFunctions TASK_QAYTA (= HW_TASK ham): `logs` ikkiga — «Salom, Aziza» · «Salom, Bobur».
5–6 qoldi. Qayta sinov: 97 holat, 96 OK (qolgani — ataylab qoldirilgan margin-top). Darvozalar: 4 fayl tell/emoji zaxira bilan bir xil, til error 0, lint:jsx toza.
**Muhr:** DE 212-qonunga 6-band (shart = matn, na qattiq, na bo'sh) + sinov vositasi; lint:prompt toza.

## F-1017-206 · ism tartibi va katta-kichik harf — TASHXIS → TUZATILDI ✅ (17.10)
**Fidbek (foydalanuvchi):** shartda «avval Azizbek, keyin Jasur» — o'quvchi teskari yozgan, natija to'g'ri, qabul qilinmadi; katta-kichik harf farqi bilan ham rad etadi. Global algoritm kerak.
**Tashxis:** aynan «Azizbek/Jasur» juftligi 2–6 kompilyator shartlarida yo'q (src, uyga-vazifa, lms qidirildi) — misol. Shu sinf: `C.logs` (`HtmlCompiler.jsx` `log_includes`) — barcha chiqishlar probel bilan birlashtirilib, kutilgan matn `indexOf` bilan qidiriladi → (1) KATTA-KICHIK harfga sezgir («hello» ≠ «Hello»), (2) ko'p so'zli kutilgan matn TARTIBGA bog'liq. `C.logs` butun loyihada 14 ta, hammasi LMS 2–6 (5 fayl). Tartibga bog'liqlari: JsFunctions «Salom, Aziza/Bobur» (F-1017-205 da ikkiga bo'lingan — endi tartibsiz ✅), JsLoops «olma banan uzum», PeanStack «Lavash Burger Shashlik» (massiv tartibi), JsLoops «1 2 3 4 5» (sanoq — tartib ma'noli). Harf: «Hello», «Katta jarima», «Salom», «Siz jarimaga tushdingiz», ro'yxatlar.
JS kod-regexlari (`C.js`) harfga sezgir qoladi — JavaScript o'zi sezgir (`Console.log` ishlamaydi); nomlar uchun darslar allaqachon `[sS]` ishlatadi.
**Qaror:** foydalanuvchi «maqul, global, shoshilmasdan».
**TUZATILDI ✅ (foydalanuvchi «taklifing maqul, global, shoshilmasdan»; zaxira `scratchpad/oldin-206/`):**
- ⚠ **UMUMIY FAYL** `src/compilator/HtmlCompiler.jsx` (49 dars import qiladi; o'zgarish faqat `C.logs` probe'i — 5 dars ishlatadi, hammasi 2–6). Umumiy-fayl tartibi: ishoralar ro'yxati → tuzatish → 49 kirish nuqtasi esbuild bilan qurildi: 49/49 toza.
- `log_includes`: ikkala tomon `norm()` — kichik harf, apostrof turlari (‘ ’ ʻ ʼ ` ´ → '), probel yig'iladi. Ko'p so'zli qiymat tartibli qoladi («1 2 3 4 5»).
- Yangi `C.logsEach([...])` / deklarativ `{ logsEach: [...] }` (`log_each`): har qiymat chiqishda bor, tartib muhim emas. Harness: `_rep=String.prototype.replace` native havola (prototip zaharlanishi K-C-11 sinfi). Shablon-satr tuzog'i: `\s` → faylda `\\s` (aks holda `/s+/`).
- JsLoops TASK_MEVA, PeanStack TASK_BAZA → `logsEach`. `C.js` kod-regexlari harfga sezgir qoladi (JS o'zi sezgir).
- Sinov: 108 holat, 107 OK (qolgani — ataylab qoldirilgan margin-top); 206-holatlar: hello/KATTA JARIMA/ikki probel/teskari tartib ✅ o'tadi, «Jarima katta»/ikkita meva/teskari sanoq ✅ o'tmaydi. JsLoops/PeanStack darvozalar: tell/emoji zaxira bilan bir xil; lint:jsx toza.

## F-1017-207 · darslarda ovoz (🔈) — OLIB TASHLANDI + QA DEPLOY ✅ (17.10)
**Fidbek (foydalanuvchi, surat `F-1017-207-ovoz.png`, coddycamp-7modul QA):** test izoh-qutisida karnay tugmasi — «biror modul, biror dars, biror joyda ovoz qo'ymaymiz; butunlay olib tashla, ehtiyotkorlik bilan; 7–8 QA'ga deploy».
**Tashxis:** `src/ovoz/` (ovoz.js WebAudio + OvozTugma.jsx 🔈) — 2-seans avtopiloti 17.10 07:41, F-1015-149 («hammasi A»): to'g'ri/xato javob + dars tugashi signali, `cc_ovoz` localStorage. Ishlatadi: 7–8-M 24 dars (qolipsiz, bir xil 6 qism: 2 import · javobda `ovoz(...)` · `<OvozTugma />` · `ovoz('tugadi')` useEffect · `.q-ovoz` CSS) + `src/qolip/index.jsx` (9–14-M). Memory `ovoz-kerak-emas` (19.09) allaqachon bor edi.
**Qilindi:** 24 dars (src/5-Modull 11 + src/6-Modull 13) — 6 qism olindi (`scratchpad/oldin-207/`); qoldiq grep 0; 24/24 `12/12 darvoza toza`, tell/emoji zaxira bilan bir xil, lint:jsx toza. Tuzoq: CSS `[^}]*` `${T.ink2}` dagi `}` da to'xtab qoidani yarim olardi — aniq chegara (`.q-ovoz {` … `/* F-1015-149 */`) bilan qayta; yozishdan oldin qoldiq-tekshiruv.
**TEGILMADI:** `src/qolip/index.jsx` + `qolipCss.js` (umumiy, 2-seans 16:34 da tahrirlagan — faol) va `src/ovoz/` (qolip import qiladi). Foydalanuvchi qarori kutilmoqda: kim oladi.
**Deploy (16:42–16:43, `deploy-qa.sh 5 6`, S o'z scratchpad'imga):** coddycamp-7modul · coddycamp-8modul — exit 0; jonli bundle'da `q-ovoz|OvozTugma|cc_ovoz` = 0. Smoke: skript kalitlarni 2-seans scratchpad'idagi `kf.txt` dan oladi (menda yo'q) → App.jsx dan `comp` li kalitlar bilan qo'lda: 7-M 24/24, 8-M 28/28 TOZA. Surat (karnaysiz): `f207/BotIntro-s5-xato.png`.
**Ochiq:** qolip (`src/qolip/index.jsx` 197/201/460 + `qolipCss.js` .q-ovoz) va `src/ovoz/` — kim oladi (A: men, 2-seans chiqqach · B: 2-seans). 9–14-M QA saytlarida ovoz hali bor.
**Qolip ✅ (16:5x, foydalanuvchi A, deploy yo'q):** `src/qolip/index.jsx` (2 import, `export { OvozTugma }`, javob-useEffect, `<OvozTugma />`, tugadi-useEffect) + `qolipCss.js` (`.q-test-javob { position: relative }` + `:has(> .q-ovoz)` + `.q-ovoz` qoidalari, 108-satr dumi) — yozishdan oldin mtime 16:34 tekshirildi; `src/ovoz/` o'chirildi (zaxira `scratchpad/oldin-207q/`). Qolipli 79 dars esbuild 79/79; src bo'ylab qoldiq 0; lint:jsx toza. 9–14 QA deploy QILINMADI (foydalanuvchi: «u yoqqa hali tasklar bor»). Saboq: skript ikki faylni birga yozsa, 2-faylning asserti yiqilganda 1-fayl allaqachon yozilgan bo'ladi — yozishni hammasi tekshirilgandan keyinga qo'y.

## F-1017-208 · mentor kompilyatorda yozgan kod yo'qoladi — TUZATILDI ✅ (17.10)
**Fidbek (mentor):** praktika kompilyatorida kod yozib, «nechta o'quvchi yozdi»ni ko'rish uchun chiqsa, qaytganda kompilyator bo'sh.
**Tashxis:** texnik darslarda `<HtmlCompiler>` ikki joyda: o'quvchi praktikasi (`storageKey` bor — saqlanadi) va `MentorPracticeOverlay` (`view` 'watch' ↔ 'demo'; `storageKey` YO'Q → kuzatishga o'tganda kompilyator unmount, kod yo'qoladi; «Davom etish»/«Orqaga» ham `setView('watch')`). 12 texnik dars; PM darslarida (KOD_TASK) saqlov bor edi.
**Qaror (foydalanuvchi):** brauzer-saqlov chegarasi maqul; barcha dars, faqat mentor uchun, o'quvchi paneliga tegilmaydi.
**Qilindi:** 11 fayl (HTML 1–2, Takrorlash, CSS 1–2, VS Code, JsVars/Conditions/Loops/Functions, PEAN) — mentor chaqiruviga `storageKey={codeKeyOf(LESSON_META.lessonId, \`mentor-s${entry.fromScreen}\`)}` (o'quvchi kalitidan alohida — bir brauzerda bosib qo'ymaydi). PracticeLesson1 — 1-seans fayli, praktikasi o'chirilgan — tegilmadi. Zaxira `scratchpad/oldin-208/`. Darvozalar: 11 fayl tell/emoji zaxira bilan bir xil; lint:jsx toza.
**Isbot:** `vositalar/saqlov-sinov.mjs` — CssLesson1 TASK_COLOR mentor kaliti bilan: yozish → unmount → qayta ochish; natija pastda.
**Chegara:** saqlov localStorage (shu brauzer); boshqa kompyuter/maxfiy oyna — bo'sh; «Qaytadan» ataylab tozalaydi. Serverda saqlash — LMS tomoni.
**Isbot natijasi:** kalitsiz → qayta ochganda starter (kod yo'q); kalit bilan → `h1 { color: tomato; background-color: gold; }` aynan qaytdi ✅; localStorage: `ccCode:css-01-v17:mentor-s11`.

## F-1017-209 · PmLesson2 koding: imlo tuzog'i + noaniq vazifa — TUZATILDI ✅ (17.10)
**Fidbek (mentor, 2 surat `F-1017-209-1/2.png`, m1-05 «Struktura» koding):** «aniqroq qiling nima xohlayotganini»; o'quvchilar «muamo/mmuamo/muomo» yozadi — shart yonmaydi, «ona tili darsi bo'lib qoldi».
**Tashxis:** kompilyator BO'SH ochilardi (faqat xira namuna) — o'quvchi 4 bo'lim nomini o'zi yozardi; c4 tartib-sharti nomlarni aynan so'z bo'yicha topardi (`includes`), imlo xatosi → bo'lim topilmaydi. c2 (`h2` + `p`) talabi uzun matnda ko'rinmasdi — rasmda `<p>` yo'q. Dars maqsadi — tartib, imlo emas.
**Qaror (foydalanuvchi):** taklif maqul.
**Qilindi (zaxira `scratchpad/oldin-209/`):** (1) `KOD_PLACEHOLDER` → `KOD_STARTER` (uz/ru): header/footer to'ldirilgan, `main` da 4 bo'lim sarlavhasi TAYYOR, ATAYLAB aralash (Harakat·Isbot·Muammo·Qanday ishlaydi), har biri ostida bo'sh `<p></p>` + izoh-qator; placeholder olindi. (2) Sarlavha «bo'limlarni tartibga keltiring», brief: «Kod tayyor, 4 bo'lim aralash. Ikki ish: tartib (Muammo → Qanday ishlaydi → Isbot → Harakat) va har `<p>` ga bir gap». (3) Holat: bo'sh saqlov → starter; `storageKey :code2`. (4) `checkStructure` c4: `kodNorm` (kichik harf, apostrof, raqam/belgi olinadi, takror harf yig'iladi) + Levenshtein ≤1 (qisqa so'z) / ≤2 (uzun) — «muamo», «MMUAMO», «muomo», «1. Muomo», «Isbott», «ishlidi» o'tadi; «Savol» o'tmaydi.
**Sinov (haqiqiy kompilyator, 7 holat):** starter o'zgarmagan ✗ (c2, c4 qizil) · tartiblandi+p ✓ 4/4 · tartib to'g'ri, p bo'sh ✗ · imlo variantlari ✓ · «Savol» ✗. Jami to'plam 114 → 113 OK. Darvozalar: tell/emoji zaxira bilan bir xil (qator raqamlari surilgan), lint:jsx toza. Surat `f209/PmLesson2-koding.png`.
**Chegara:** c1/c3 (teglar bor, qavat tartibi) skeletda boshidanoq yashil — qo'riqchi shart (o'quvchi skeletni buzsa qizil bo'ladi).

## F-1017-210 · m3-07 rejada «Read qolib ketibdi» — TASHXIS, kod tegilmadi (17.10)
**Fidbek (mentor, `F-1017-210-reja.png`):** «Bugungi 5 qadam»da Read yo'q — ataylabmi, xatomi?
**Tashxis:** surat — LMS proddagi ESKI versiya (HEAD, 22 ekran, STEPS: CRUD · Create · Update · Delete · AI). Read ataylab yo'q edi — ilova boshidanoq ro'yxatni ko'rsatadi (Read tayyor), bugungi ish = C·U·D; lekin reja buni AYTMAGAN → mentor xato deb o'ylagan. YANGI versiya (1-seans, bugun 14:40–15:30 «m3-07 YOPILDI», 8 ekran): reja «Bugungi 3 blok» (Qo'shish · TOP va o'chirish · AI xatosi), Kirishda «Hozircha ilova faqat ko'rsata oladi (Read) — qolgan uchtasini bugun o'rganamiz» (Screen0). Yakshanba 18.10 relizida prodga chiqadi.
**Taklif (1-seans fayli — foydalanuvchi qaroriga):** yangi rejaga bitta qator «Read — tayyor ✓ (ilova ro'yxatni ko'rsatib turibdi)» yoki Kirish gapi yetarli deb qoldirish.

## F-1017-211 · m3-07 «Tirik akvarium» — «qiziqroq, masshtabliroq» — TASHXIS, kod tegilmadi (17.10)
**Fidbek (mentor, `F-1017-211-akvarium.png`):** CRUD 4 tugma + akvarium ekrani zerikarli, kattaroq/qiziqroq narsa kerak.
**Tashxis:** bu ham ESKI versiya ekrani. Yangi versiyada CRUD-4-tugma ekrani YO'Q (praktika haqiqiy VS Code ishiga qisqartirilgan — foydalanuvchi yo'nalishi F-1015-302); `Aquarium` faqat Screen13 «Amaliyot 3 · AI xatosi»da qolgan — kichik (minH 110) «muzlagan surat» (immutatsiya) ko'rsatkichi. Praktika = ekranlarni kamaytirish qaroriga katta interaktiv akvarium qo'shish zid.
**Taklif:** mentorga yangi versiyani (yakshanbadan keyin) ko'rsatish; akvariumni kengaytirish — faqat foydalanuvchi xohlasa, 1-seans orqali.

## F-1017-212 · CssLesson1 (m1-06): 4 mentor fidbeki — TUZATILDI ✅ (17.10)
**Fidbek (mentor, suratlar `F-1017-212-13…16.png`):** (13) text-align praktikagacha o'tilmagan; (14) class/ID/teg selektori aytilmay praktikada `.box` so'raladi; (15) padding o'tilib praktikada margin; (16) «Kontent bilan elementning cheti orasidagi ichki bo'shliq…» — tili qotadigan savol.
**Tashxis:** 13 va 15 — eski prod versiyasi, bugun F-1017-204 da tuzatilgan (`PRACTICE_AFTER` 11/14). 14 — class faqat Sintaksis ekranida «Selektor» qismi BOSILGANDA chiqadigan bir gapda; teg/id atamasi yo'q. 16 — ibora 3 joyda (padding Mentor + audio, 3-savol, izoh).
**Qaror (foydalanuvchi):** maqul.
**Qilindi (zaxira `scratchpad/oldin-212/`):** Sintaksis Mentor gapiga ko'rinadigan jumla: teg selektori (`h1`) · class (`class="box"` → `.box`) · `id` (`#`, keyinroq) — uz/ru; praktika «Qutiga bo'shliq bering» matniga «Quti HTML'da class="box" deb nomlangan — CSS'da nuqta bilan .box { … }»; padding Mentor + audio, 3-savol (uz/ru/audio) va izoh — bitta ibora «quti ichidagi matn bilan qutining cheti orasidagi bo'shliq». «kontent» boshqa ma'nodagi 7 joyda qoldi.
**Darvozalar:** tell/emoji topilmalari zaxira bilan bir xil (qator surilgan); lint:jsx toza. Suratlar `f212/Css1-s3-sintaksis.png`, `Css1-s15-savol.png`.

## F-1017-213 · NestArchAlive s9 «Buyurtma yo'li» — ma'lumot ko'p — TASHXIS → TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-213-buyurtma-yoli.png`):** ekranni kamaytirsak bo'ladimi; vizual ko'p va qiyin.
**Tashxis (ekran tuzilishi):** Mentor 4 gap · kirish taxtasi («Admin · Auth») + 3 chipli ranglar izohi (ZAL/OSHXONA/OMBOR — har kartada o'sha yorliq bor, takror) · 6 bekatli yo'lak + Mijoz · 6 kartali hovuz · nishon qatori · 3 mijoz kartasi, har birida POST/JSON mono satri · natija qutisi · pastda 💡 maslahat (Mentor gapining takrori, 208-qonun). Jami 7 blok, 3 ta matn takror.
**Prototip (vaqtinchalik nusxa, o'chirildi; suratlar `f213/oldin.png`, `keyin.png`):** (1) Mentor 4→2 gap; (2) kirish taxtasi + ranglar izohi olinadi (eshikbon qoladi); (3) mijoz kartasida faqat nom + ▶, POST satri natija qutisiga ko'chadi (bosganda ko'rinadi); (4) pastdagi takror 💡 olinadi. Yo'lak, hovuz, kartalar (kod nomlari) va nishon qatori o'zgarmaydi.
**Qaror sahifasi:** https://claude.ai/artifact/S5vF6eSM2FCRiKNkdhrKdC (3-versiya) → **A** (4 blok ham olinadi).
**Qilindi (zaxira `scratchpad/oldin-213/`):** prototipdagi 4 o'zgarish asl faylga (uz+ru): Mentor 2 gap · kirish taxtasi + legend olindi · mijoz kartasida POST satri yo'q, natija qutisida chiqadi · pastdagi takror 💡 olindi. Darvozalar: undef ✓, tell eski, emoji Screen9 8→6 (🪧💡 ketdi, qolgani eski), lint:jsx toza. Asl surat `f213/asl-keyin.png` prototip bilan solishtirildi.

## F-1017-214 · JsFunctions TASK_QAYTA: salomla("Bobur") avval yozilsa 2-shart yonmaydi — ALLAQACHON TUZATILGAN (17.10)
**Fidbek (mentor, `F-1017-214.png`):** kod to'g'ri (funksiya + ikki chaqiruv, Bobur oldin) — «ikkala salom konsolda» qizil; «o'rnini almashtirib ishlatishga ham talab bormi?»
**Tashxis:** kodda xato yo'q. Eski tekshiruv `C.logs('Salom, Aziza Salom, Bobur')` — bitta birlashgan satr, TARTIBGA bog'liq edi. F-1017-205 da ikkiga bo'lindi (`log1` Aziza · `log2` Bobur, har biri alohida), F-1017-206 da kompilyator normallashgan; sinov «206: teskari tartib Bobur, Aziza» → ✅ o'tadi (haqiqiy kompilyatorda). Mentor proddagi eski versiyani ko'rgan — yakshanba relizida to'g'ri bo'ladi. Kod tegilmadi.

## F-1017-215 · ReactIntro s15 «Sahifa yig'amiz» — «kattaroq, qiziqroq» — TASHXIS → TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-215.png`):** amaliyot ekraniga masshtabi kattaroq narsa qo'shaylik, qiziqroq bo'lsin.
**Tashxis:** 4 blok tugmasi, ixtiyoriy 3 blokdan keyin «Davom etish» ochiladi (maqsad yo'q — nima yig'ish aytilmagan), maket kichik (minH 130, karta 34px), «qayta ishlatish» faqat yashil pill. O'quvchi bir blok bosib o'tib ketadi.
**Prototip (vaqtinchalik nusxa, `scratchpad/f215.py`; suratlar `f215/keyin*.png`):** (1) maqsad — «Namuna: Navbar · SearchBar · SkinCard ×3 · Footer» chiplari, Mentor gapi shunga; (2) «Davom etish» faqat do'kon yig'ilganda (menyu + kamida 2 skin + pastki qism, tartib erkin), tugma yorlig'i «Do'konni namunadek yig'ing», hisob 0/6, «Yetishmayapti: …» qatori; (3) maket 2× katta (260px, karta 52px, nom 13px) — 3 skin (Ninja, Qahramon, Robot) ko'rinib turadi; (4) tugmada ×n hisob; (5) yakun gapi «bitta <SkinCard /> — uch xil karta». Bloklar tarkibi va mexanika (bosish, tozalash) o'zgarmagan.
**Qaror sahifasi:** https://claude.ai/artifact/S5vF6eSM2FCRiKNkdhrKdC (5-versiya) → **A** (prototipdagidek).
**Qilindi (zaxira `scratchpad/oldin-215/`, skript `f215.py`):** 5 o'zgarish asl faylga (uz+ru). Darvozalar: undef ✓, tell/emoji zaxira bilan bir xil, til error 0, lint:jsx toza. Surat `f215/asl-keyin.png`.
**Tuzoq tutildi:** `storedAnswer` tiklanganda eski `['nav','card','card']` — yangi shartda footer yo'q → «Davom etish» yopiq qolardi; tiklash to'liq namunaga (`nav, search, card×3, footer`) o'zgartirildi.

## F-1017-216 · PmLesson5 s8 «Tarozi»: bufet menyusi «asosiy» deb ✓ ko'rsatildi — TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-216-20/21/22.png`):** «bufet menyusi asosiy qism emas-ku», sinfda sharmanda bo'ldim.
**Tashxis:** tarozi ekranida to'g'ri javob yo'q (o'quvchi o'zi baholaydi), lekin (1) tanlangan javob yashil ramkada ✓ bilan — «to'g'ri» deb o'qiladi; (2) oldingi kartaning xulosasi (`lastNote`) yangi karta ostida qolib turadi — hozirgi kartaga tegishli deb o'qiladi (rasmdagi ziddiyat shu); (3) darsning o'zida bufet = «keyingi versiya» (11-ekran namunasi, yakun), tarozi bunga javob bermaydi.
**Qaror (foydalanuvchi): A — 1+2+3.** Zaxira `scratchpad/oldin-216/`.
**Qilindi (uz+ru):** (1) `.tz-done` — «Javobingiz: …» + ↻, neytral rang (ink2, bg, line); ✓ olindi. (2) `commit`: xulosa karta nomi bilan («Bufet menyusi»: …), 3,5 s dan keyin yo'qoladi. (3) `FALLBACK_FEATURES` ga `model` (f1–f3 v1 · f5 v2 · f4, f6 backlog — 11-ekran namunasi bilan bir xil) + `why`; o'quvchi javobi zid bo'lsa 💬 «Namunada «Bufet menyusi» — «Keyingi versiya»: bufet menyusiz ham chipta sotiladi.» (9 s). O'z kartalarida (own*) izoh yo'q, javob o'zgartirilmaydi.
**Darvozalar:** undef ✓, tell/emoji zaxira bilan bir xil, til error 0, lint:jsx toza. Suratlar `f216/bufet-javob.png` (neytral javob), `bufet-xulosa.png` (zid-izoh).

## F-1017-217 · «Ustimga keling» hover tugmasi (rasm) — 201 TAKRORI, kod tegilmadi (17.10)
**Fidbek (mentor, `F-1017-217.png`):** «Ustimga keling» / «Hover hodisasi → rang o'zgaradi» tugmasi.
**Tashxis:** joriy `src/` da yo'q (grep 0), commit'langan HEAD da ham yo'q; faqat LMS prodga 20.09 da yuklangan eski yig'ma (`lms/PracticeLesson1.jsx`) da bor — m2-08 PracticeLesson1 ning eski versiyasi. 1-seans 16.10 da qayta qurgan (F-1015-332), yakshanba 18.10 relizida prod'dan ham ketadi. Lint `ustimga` (error) 201 da qo'yilgan — qaytib kelmaydi.

## F-1017-218 · PracticeLesson1 s15 «Oxirgi sinov»: noto'g'ri juftlikda «Mukammal!» — ALLAQACHON TUZATILGAN (17.10)
**Fidbek (mentor, `F-1017-218.png`):** «Aylantirilganda» + «Hech narsa» tanlangan (ikkala ✗), pastda «Mukammal! … tugma jonlandi».
**Tashxis:** eski prod versiyasi. 16.10 17:33 da alohida seans F-1016-01 bilan tuzatgan (memory `m2-08-screen15-mentor-tuzatish`): hozir yashil quti faqat `passed && ready` (hodisa = bosish VA reaksiya = rang) bo'lganda chiqadi; noto'g'ri tanlovda «Maslahat: maqsad gapini qayta o'qing…». Yakshanba relizida prodga chiqadi. Kod tegilmadi (1-seans fayli).

## F-1017-219 · ReactFirstComponent (m3-03) s2 «O'rnatish»: Node.js yo'q — TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-219-node.png`):** «birinchi qo'shiladigan narsa — bolalar Node.js o'rnatishi kerak».
**Tashxis:** ekran `npm create vite@latest` dan boshlanadi; npm Node.js bilan keladi; 2–5-modullarning hech bir darsida Node o'rnatish aytilmagan (grep 0) — Node yo'q kompyuterda 1-buyruq xato, dars to'xtaydi.
**Qilindi (zaxira `scratchpad/oldin-219/`, uz+ru):** STEPS ga 0-qadam `node -v` + izoh (nodejs.org → LTS → o'rnatish, uyda oldindan ham bo'ladi; `node -v` raqam chiqsa tayyor); 4→5 qadam (holat, yorliq «0/5», sarlavha «besh qadamda», audio); Mentor gapiga Node jumlasi; Reja kartasi «Node.js + uch buyruq». Surat `f219/ornatish-s2.png`.

## F-1017-220 · ReactFirstComponent s20 «Oxirgi qadam»: `<Robo …/>` — shart yonmaydi, izoh yo'q — TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-220-oxirgi.png`):** o'quvchi `<Robo name="salom"/>` yozgan, 1-shart kulrang, mentor «nima desam o'tadi?».
**Tashxis:** tekshiruv aynan `<GameCard name="…" />` talab qiladi (App.jsx da shu funksiya), lekin yorliq «komponent — Katta harf», Mentor gapida nom yo'q; izoh faqat kichik harfli `gamecard` uchun — katta harfli boshqa nomga hech narsa.
**Qilindi:** yorliq «`<GameCard />` — Katta harf»; Mentor gapida namuna `<GameCard name="…" />` (uz+ru); `hasOtherComp` — katta harfli boshqa nom yozilsa izoh «Komponent nomi aynan GameCard — App.jsx da shu funksiya yozilgan; boshqa nomli komponent yo'q». Surat `f219/oxirgi-robo.png`.
**Darvozalar (ikkalasi):** undef ✓, tell/emoji zaxira bilan bir xil, til error 0, lint:jsx toza.
**Ochiq (221):** 23 ekran ko'p — ekranlar ro'yxati bilan qaror sahifasi tayyorlanadi.

## F-1017-221 · ReactFirstComponent (m3-03) — 23 ekran ko'p, sinfda ulgurilmaydi — TASHXIS ⏳ (17.10)
**Fidbek (mentor):** 7 bola bilan 11/23 ga yetib kelgan; praktikani to'liq qildirsa ulgurmaydi.
**Tashxis:** 23 ekran = 4 mazmun-kirish (01–04) · 3 VS Code praktikasi (05, 11, 18) · 6 test/tekshiruv (06, 07, 08, 13, 16, 20) · 6 tushuntirish (09, 10, 12, 14, 15, 19) · 17 dars-ichi props amaliyoti (18 ning takrori) · 3 yakun (21–23). Barcha 23 ekran suratga olindi (`f221/`), varaq `qaror/img/rfc-varaq.jpg`.
**Taklif:** A 23→18 (07, 08, 17 olinadi; 13+16 bitta test; 15+19 birlashadi) · B 23→14 (A + 04→03, 10→09, 14→12, 22 olinadi) · C qoladi. Qaror sahifasi https://claude.ai/artifact/S5vF6eSM2FCRiKNkdhrKdC (6-versiya). Kutilmoqda.
**Qaror: A → tekshiruvda tuzatildi → A′ (foydalanuvchi «maqul»):** jadvalda 07 «Bu HTML'mi yoki JavaScript'mi?» tekshiruv deb noto'g'ri belgilangan edi — u JSX/className ni o'rgatadigan yagona ekran (Debugging xatosi class→className unga tayanadi, 212-qonun). 07 qoladi; **23 → 19**: s5b (className testi), s11 (AI case), s12 (Katta harf testi), s13 (dars-ichi props amaliyoti) olindi.
**Qilindi (zaxira `scratchpad/oldin-221/`):** screens + SCREEN_META 19; komponent bloklari o'chirildi (16+69+16+89 qator); INLINE_KEYS {s4,s9,s15}; ACH_TRIGGERS sharp → s9 (desc «Props testidan o'tdingiz»); RECAPS `recap_kalit` {5→5, 12→11} (7 olindi); «Mashq · 3-savol» → «2-savol» (uz+ru); Debugging Mentor gapiga AI jumlasi (s11 mazmuni, uz+ru). Tuzoq tutildi: kesish `function DebugChallenge` (s13 va s14 orasida) ni yutib yuborgan — `undef` darvozasi ushladi, zaxiradan qaytarildi. progRead `total` bilan tekshiradi — eski saqlov o'zi tashlanadi, lessonId o'zgarmadi.
**Darvozalar:** undef ✓ keys ✓ (nomos 0), tell eski, emoji farqi faqat olingan ekranlar, til error 0, lint:jsx toza. 19 ekran suratga olindi (`f221/yangi/`), varaq `qaror/img/rfc-varaq-19.jpg`.

## F-1017-222 · ReactFirstComponent «Oxirgi qadam»: name='…' (bitta tirnoq) qabul qilinmaydi — TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-222.png`):** `<GameCard name='Minecraft' />` — «name prop» sharti yonmaydi; faqat qo'shtirnoq ishlaydi.
**Tashxis:** ikkala regex (`m` to'liq-moslik va `hasName`) faqat `"` talab qilardi; JSX'da `'` ham to'g'ri. Boshqa darslarda shunday faqat-qo'shtirnoq tekshiruvi yo'q (grep 0).
**Qilindi (zaxira `scratchpad/oldin-222/`):** `(["'])…\1` — ikkala tirnoq, lekin juft bo'lsa (`"Minecraft'` o'tmaydi). 212.6 sinfi (shart o'tilgan variantni rad etmaydi).

## F-1017-223 · PracticeLesson2 (m2-09) «Bitta usul bilan nechta xil sayt» — 4 stil bir xil, faqat fon rasmi — TASHXIS, kod tegilmadi (17.10)
**Fidbek (mentor, `F-1017-223.png`, 13/19):** O'yin/Jamoa/Turnir/Blog — faqat fon rasmi o'zgaradi, bolalar farqni tushunmayapti.
**Tashxis:** eski prod versiyasi — bu ekran joriy kodda YO'Q (1-seans 16.10 da 19→8 ekranga qayta qurgan, F-1015-336), faqat `lms/` eski yig'masida. Yangi versiyada o'rniga PromoMaket: o'quvchi 4 qismli prompt yozadi (mavzu · uslub · rang · bo'limlar), maket jonli o'zgaradi; uslub 3 ta (zamonaviy / quvnoq / sodda) — CSS: hero fon-gradient+blob, chegara, burchak radiusi; rang `--pm`; mavzu matn. Farq bor (sodda — oq+chegara, quvnoq — yumaloq+dog'lar), lekin asosan rang/burchak — mentor shikoyati yangi versiyaga ham qisman tegishli bo'lishi mumkin. 1-seans fayli — foydalanuvchi qaroriga.

## F-1017-224 · Kompilyator: vazifa matnidagi kodni o'quvchi nusxalab qo'yadi — TUZATILDI ✅ (17.10)
**Fidbek (mentor, `F-1017-224.png`, eski PracticeLesson1 «Like»):** tepadagi HTML kodni belgilab nusxalab qo'yishyapti; «user-select qilib qo'ysak»; «shu darsda yana 2–3 joy».
**Tashxis:** rasm — eski prod (joriy Praktika 1 da dars-ichi kompilyator yo'q), lekin sinf umumiy: HAR kompilyator vazifasida brief/shart-chip/💡 maslahat ichida tayyor kod — bitta `HtmlCompiler` dan.
**Qaror (foydalanuvchi): «ha, ehtiyotkorlik bilan».** ⚠ UMUMIY FAYL `src/compilator/HtmlCompiler.jsx` (49 dars). Zaxira `scratchpad/oldin-224/`.
**Qilindi:** bitta CSS qatori (`.hc-checklist` qoidasidan keyin, `${}` siz joy): `.hc-title,.hc-brief,.hc-chip,.hc-hint{user-select:none}`. Kod maydoni/natija/konsol tegilmadi.
**Isbot:** 49/49 esbuild toza, lint:jsx toza; brauzerda (`vositalar/select-sinov.mjs`, CssLesson1 TASK_COLOR): brief/chip/hint — `user-select: none`, belgilanganda 0 belgi; textarea — `auto` (yozish/nusxalash ishlaydi).
**Chegara:** DevTools orqali olish mumkin — oddiy belgilab Ctrl+C ishlamaydi (mentor holati).

## F-1017-225 · PracticeLesson1 (m2-08) yakun ekrani: «CODE STRIKE va Yakunlash ishlamaydi» — TASHXIS, qaror kutilmoqda (17.10)
**Fidbek (mentor, `F-1017-225.png`):** yakun ekrani «Statik saytni jonli saytga aylantirdingiz» — CODE STRIKE va «Yakunlash ✓» bosilganda hech nima bo'lmaydi; «yana shunaqa darslar bormi».
**Tashxis:** eski prod EMAS — yakun ekrani (Screen16) joriy kodda ham, 51b2045 oldida ham bir xil. Mexanizm hamma darsda bitta:
- «Yakunlash ✓» → `finishLesson` → `onFinished` (LMS'ga natija) — dars ichida HECH NARSA o'zgarmaydi (tugma qoladi, xabar yo'q). O'quvchida LMS darsni yopadi; mentor/preview'da LMS bo'sh funksiya beradi (IT javobi §6) → «o'lik». Yakundan keyingi holat 2–6 ning birorta darsida yo'q.
- CODE STRIKE: solo — arena ochiladi (isbot: `vositalar/yakun-sinov.mjs`, scratchpad/yakun-225/*.png); mentor-rejim — `quizControl('lobby')` server xatosi `catch { return; }` bilan JIM yutiladi (umumiy naqsh; PmLesson3·4·6·7, ReactRouterPractice boshqacha yozilgan — alohida ko'riladi); o'quvchi-rejim, arena ochilmagan — xira + «⏳ Mentorni kuting» (ataylab).
- Mentor qaysi rejimda bo'lgani suratdan ko'rinmaydi; Dozzle loglarini o'qishga ruxsat berilmadi (auto-mode «Production Reads»).
**Taklif (qaror sahifasi, o'sha URL):** A — 70 darsda bir xil: Yakunlash bosilgach «Yakunlandi ✓» + xabar; CODE STRIKE mentor-rejim xatosida xabar + solo arena → KATTA ro'yxati, nazorat seansi, reliz (18.10) dan keyin. B — faqat Yakunlash. C — LMS'ga xat. Kod TEGILMADI (PracticeLesson1 — 1-seans fayli, 70 fayl — nazorat).

## F-1017-225 · DAVOM — TUZATILDI ✅ (18.10 00:05–00:40, avtopilot; foydalanuvchi: «maqul … avtomat ishlaysan ertalabgacha … 2-seansni KATTA'da saqlaymiz»)
**Qaror:** A (ikkalasi, hamma darsda bir xil) · hozir (reliz kuni) · umumiy fayllar shu seansda · 7–14-M → KATTA.
**Inventar (2–6-M, uy vazifalarisiz):** 71 dars (1-, 2-, 3-, 4-, 4a/4b/4c-Modull 70 + `src/pm/PmUserStoryLesson.jsx` — App.jsx'da m3 PM darsi, eski PmLesson7 o'rnida). «Yakunlash» tugmasi 71/71 bir xil kod (`btn-white-accent` + `onFinish`), yorliq har xil («Yakunlash ✓» 49 · «Yakunlash» 9 · «Keyingi dars» 4 · «Modulni yakunlash» 5 · «Tamom» 1 · «Tugatish» 1). CODE STRIKE jim-catch 69 (3 yozilish varianti), lobby chaqiruvi yo'q 2 (PmLesson7 — App.jsx'da YO'Q, o'lik, tegilmadi; ReactRouterPractice — arena to'g'ridan ochiladi, o'zgarish shart emas). Uy vazifalari (18) allaqachon «✓ Topshirildi» ko'rsatadi — tegilmadi.
**Umumiy fayllar (faqat YANGI eksport):** `src/live/LiveUI.jsx` — `liveToast(node, ms)` (body'ga qo'shiladigan xabar, z-index 12000 — arena 10500/bayram 11000 ustida; birinchi urinishda 9999 edi, arena ostida ko'rinmadi → tuzatildi) + `FinishBtn` (bosilgach onClick 1 marta, «Yakunlandi ✓» o'chiq, xabar; preview'da «Ko'rish rejimi — natija yozilmaydi»; onClick yiqilsa — xabar YO'Q, faqat konsol, tugma qoladi — foydalanuvchi 18.10 00:5x, pastda); `src/live/index.js` eksport. 7-Modul darsi esbuild toza (umumiy fayl ta'siri).
**Codemod `vositalar/codemod-225.py`** (har faylda sonlar tekshiriladi, farq → yozilmaydi): (1) import qatoriga `FinishBtn, liveToast`; (2) `<button className="btn-white-accent" onClick={onFinish}…>…</button>` → `<FinishBtn …>…</FinishBtn>` (yorliq/uslub o'zgarmaydi); (3) `catch { return; }` / `catch (_e) { return; }` → `console.warn` + toast «Jonli arena ochilmadi: server javob bermadi. Mashq rejimida ochildi — o'quvchilar ekranida ko'rinmaydi.» + `setArenaSolo(true); setArena(true)`; (4) `live={_live || { mode: 'self' }}` → `live={(isMentorL && arenaSolo) ? { mode: 'self' } : (_live || …)}` — mentor obyekti bilan ochilganda arena ichida `isMentor` tarmoqlari qolardi (plitkalar o'chiq, ikkita «Boshlash» — pilotda ko'rildi, surat `f225/`), self-rejimda faqat «▶ Boshlash».
**Pilot:** JsVarsLesson → brauzer (`vositalar/yakun-sinov-225.mjs`, uch holat): solo — «Yakunlandi ✓» o'chiq + xabar, `onFinished` 1 (ikkinchi bosish 0); mentor tarmoqsiz — xabar + mashq arenasi; o'quvchi-rejim — sinov yakun ekraniga yetmaydi (kodda o'quvchi tarmoqlari tegilmagan — diff bilan tasdiqlandi). Keyin 70 fayl + skelet `NamunaDars.jsx` + PmUserStory: 72/72 OK.
**Darvozalar:** 72 fayl `npm run gates` — 2 ta 12/12, qolgani faqat `tell`/`emoji` (eski; zaxira bilan son solishtirildi: 72 faylda farq 0); undef/jsx/keys/dark/til/olchov/narrow/qolip/prompt — hammasida ✓. `lint:jsx` 256 fayl toza; `lint:prompt` toza. Namuna brauzer-sinovi 8 dars (InternetLesson «Tamom» — «🎉 Darsni yakunlash» kartasi ichida, karta ochib sinaldi · CssLesson1 «Keyingi dars» · Htmllesson2 «Modulni yakunlash» · CssPractice «Tugatish» · PmLesson3 `catch (_e)` varianti · ReactRouterPractice · PmUserStory · PracticeLesson1 m2-08 — mentor surati shu dars): solo 8/8 ✓, mentor 7/7 xabar+arena (ReactRouterPractice — lobby yo'q, arena ochiladi, xabar yo'q — eski xulq), pageerror 0. Hamma dars esbuild sweep — natija `f225/esbuild-all.txt`.
**Muhr:** DE **220-qonun** (yakun ekrani jim emas · `catch { return; }` taqiq · liveToast) · tekshiruvchi rol-fayli **24-ov-bandi** · KATTA_TOZALASH **F-1017-225** (7–14-M: 103 fayl, codemod tayyor, 2-seans buyrug'i bilan) · skelet yangilandi (yangi darslar meros oladi).
**Zaxira:** `scratchpad/oldin-225/` + `~/Desktop/internetLesson-zaxira/3seans-1017-oldin/oldin-225/` (75 fayl, ro'yxat `f225/fayl-royxati.txt`). Suratlar `f225/`.
**Chegara:** mentor haqiqiy LMS'da qaysi rejimda bo'lgani hali noma'lum (qaror sahifasi 3-savol «bilmayman») — endi har holatda ekranda javob bor. Reliz 18.10 — 71 dars qayta yig'iladi (foydalanuvchi qarori).

**Qo'shimcha (18.10 00:55, foydalanuvchi: «dars yuklanmadi/yakunlanmadi degan qizilda chiqarmaylik — oldin LMS'ning qizil xabari sinfni xavotirga solgan»):** `FinishBtn` dagi «Natija yuborilmadi — sahifani yangilab…» xato-xabari OLINDI: finishLesson yiqilsa faqat `console.error`, tugma bosilaveradi (eski xulq), o'quvchi hech qanday «yuborilmadi/qabul qilinmadi» xabarini ko'rmaydi. Grep: `src/live` da bunday matn 0 (izohdan tashqari). O'sha eski qizil xabar LMS tomoniniki edi — bizning kodda yo'q.
**Yuklash xavfsizligi:** `node scripts/build-lms.mjs` (haqiqiy LMS yig'masi) JsVarsLesson 489 KB · PracticeLesson1 445 KB ✓; `CHROME=/usr/bin/google-chrome node scripts/smoke-lms.mjs lms/<fayl>` — ikkalasi brauzerda ochildi, dars + kompilyator chizildi, xato 0. PracticeLesson1 brauzer-sinovi qayta: solo ✓, mentor ✓. lint:jsx 256 toza. Eslatma: `lms/JsVarsLesson.jsx` va `lms/PracticeLesson1.jsx` qayta yig'ildi (eski prod-nusxasi git HEAD'da qoladi).

## F-1017-225 · 7–14-MODUL (KATTA bandi) — TUZATILDI ✅ (18.10 00:58–01:15, avtopilot; foydalanuvchi: «1 ni qil»)
**Doira:** `src/5…12-Modull` (LMS 7–14) + `src/pm/PmJtbdLesson.jsx`, `src/pm/PmMetricsLesson.jsx` — 103 dars, hammasi App.jsx'da, uy vazifasi yo'q. Inventar: tugma/lobby/arena naqshi 103/103 bir xil (2–6 bilan teng) — qo'lda qolgan fayl YO'Q.
**Qilindi:** zaxira (`scratchpad/oldin-225b/` + `~/Desktop/internetLesson-zaxira/3seans-1017-oldin/oldin-225-7-14/`, 103 fayl) → `vositalar/codemod-225.py` 103/103 OK (import + FinishBtn + lobby-catch → toast + arena self). Umumiy fayllar o'zgarmadi (2–6 da tayyor edi).
**Isbot:** `npm run gates` 103/103 — 102 ta 12/12, PmJtbdLesson eski tell/emoji (zaxira bilan farq 0; 103 faylda tell/emoji farqi 0). `lint:jsx` 256 toza. Brauzer-sinov 10 namuna (har moduldan bitta + Jtbd + Metrics): solo 10/10 «Yakunlandi ✓» + xabar, onFinished 1; mentor tarmoqsiz 10/10 xabar + mashq arenasi; pageerror 0. `build-lms` + `smoke-lms` PmOneOnOneLesson (383 KB) — brauzerda chizildi, xato 0. Dalillar `f225/7-14/`.
**Deploy YO'Q:** 7–14 QA saytlari (coddycamp-7…14modul.vercel.app) yangilanmadi — buyruqsiz; `lms/PmOneOnOneLesson.jsx` qayta yig'ildi.
**KATTA_TOZALASH F-1017-225 → ✅.** 2-seans doirasi edi — foydalanuvchi 18.10 shu seansga topshirdi; 2-seans jurnaliga yozilmadi (boshqa seansga topshiriq yozilmaydi), KATTA bandida ko'rinadi.

**Kesishma (18.10 02:05, 1-seans — LMS 7–14 / g'oya darslari — javobi, foydalanuvchi uzatdi):** 103 faylning hammasida yangi mexanizm bor, `grep -L "FinishBtn"` bo'sh; uning ikki fayli (m9-02, m9-03) ham to'rtala joyda yangilangan, darvoza 12/12; «yuborilmadi/qabul qilinmadi/yuklanmadi» matni ikki faylida yo'q. **QA:** coddycamp-11modul 01:37–01:59 da ishchi daraxtdan qayta yig'ilgan — «Yakunlash» o'zgarishi u yerga KIRGAN; qolgan 7 QA sayt (7, 8, 9, 10, 12, 13, 14) eski tugma bilan. Foydalanuvchi uxladi (02:07), ertalab ko'radi. Noutbuk batareyasi 4% — hammasi diskda.

## 18.10 03:51 — ochiq bandlar ko'rildi (foydalanuvchi uyg'ondi, qaror)
- **Topshiriq-fayllar:** ikkalasi bajarilgan (tekshirildi: «asbob» 7–14-Modulda 0 fayl; PracticeLesson1 «vosita» qatorlari tuzatilgan, faqat izoh/o'zgaruvchi nomida qoldi) → `arxiv/topshiriqlar-1017/` ga ko'chirildi (TOPSHIRIQ-2seans-asbob.md, TOPSHIRIQ-1seans-vosita.md).
- **7 QA sayt (7, 8, 9, 10, 12, 13, 14) deploy:** KEYINROQ — 1-seans src/9-Modull, boshqa seans src/4a-Modull ga tegmoqda; ishchi daraxtdan yig'ish ularning yarim ishini olib ketadi.
- **Reliz (LMS yuklash):** KEYINROQ.
- **Commit:** buyruq yo'q.

## 🔴🔴🔴 DAVOM — 18.10 09:12, foydalanuvchi noutbukni o'chirib yoqadi, YANGI SEANS shu yerdan
**Holat:** F-1017-200…225 hammasi ✅, chala ish YO'Q. Topshiriq-fayllar arxivda. Ochiq bandlar — faqat foydalanuvchi qarori bilan:
1. **Reliz yig'ish** («reliz yig'» desa): `node scripts/preview-reliz.mjs --out yuklash-2026-10-18 --api prod` — 2–6-Modul 71 dars (uyga vazifa yo'q, m2-16/m3-17 skip), 8 qadam, chiqish papkaga (lms/ ga yozilmaydi), HISOBOT.md; 30–60 daq; yuklash foydalanuvchi qo'lda. Foydalanuvchiga 03:5x da tushuntirildi, kodga tegilmadi. 7–14 (103 dars) uchun zanjir YO'Q — alohida KATTA-band kerak bo'ladi, hali qaror yo'q.
2. **7 QA sayt deploy** (7, 8, 9, 10, 12, 13, 14) — KEYINROQ (boshqa seanslar src/9-Modull, src/4a-Modull da ishlamoqda).
3. **Commit** — buyruq yo'q (594 fayl, 3 seans).
**Keyingi F-ID:** F-1017-226. Yangi seans: avval shu bo'limni o'qi, foydalanuvchiga 3 bandni bir qatorda eslat, buyruq kut.
