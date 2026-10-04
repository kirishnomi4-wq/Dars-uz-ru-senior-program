# 09 — Tekshiruv-skriptlar inventari (2026-10-02)

| Skript | npm buyruq | `gates`da? | Nimani aniqlaydi | Qoida-sinflar | Kirish | Ekran o'lchami |
|---|---|---|---|---|---|---|
| `esbuild-gate.mjs` | `gate:esbuild` | ha (esbuild) | Har .jsx ni to'g'ri loader'lar (.jsx/.js=jsx, .png/.jpg=dataurl) bilan esbuild orqali yig'ib SINTAKSIS xatosini topadi; arxiv papkalar (eski) qamrovdan tashqari. | sintaksis, esbuild, yolg'on-qizil (loader) | `src/**/*.jsx`, papka yoki fayllar | — |
| `jsx-lint.mjs` | `lint:jsx` | ha (jsx) | Esbuild ko'rmaydigan "jim" buzilishlar: CSS ichida backtik, bir-qatorli funksiyada `//` izoh, useStuckValve yo'q, SCREEN_META/screens uzunligi nomuvofiqligi, INLINE_KEYS kaliti nomuvofiqligi, `tr()` aniqlanmagan, regex ichida boshqaruv-belgi, kirish-animatsiya (opacity:0+forwards) to'qnashuvi, arena/homework/YAKUN tuzilma qonunlari (54-qonun va b.). | backtik, `//` izoh, INLINE_KEYS, SCREEN_META, tr(), animation shorthand, oq ekran, ustma-ust (animatsiya) | `src/**/*.jsx` yoki fayllar | — |
| `dark-lint.mjs` | `lint:dark` | ha (dark) | Quyuq/qora fonli tugma/element: `background` XOSSASI bo'yicha (CSS, `${T.x}` tokenlari qiymatga almashtirilib, JSX inline `style`), ruxsat ro'yxati (kod oynasi, arena, podium va h.k.) istisno. | dark, qora tugma, inline style, token | `src/**/*.jsx` yoki fayllar | — |
| `til-lint.mjs` | `lint:til` | ha (til) | `til-lint-rules.json` regex-qoidalarini dars matniga qo'llaydi (izoh, `/* */`, `<style>` CSS o'tkazib yuboriladi; `ru:` zonasida `kirill*` qoidalar o'chiriladi); error>0 → exit 1; `--report fayl.md` bilan MD hisobot. | apostrof, kirill, lug'at, so'z-taqiq (qoidalar JSON'da), ru-zona | `src/**/*.jsx`, fayl, `--report` | — |
| `lint-tell.mjs` | `lint:tell` | ha (tell) | Test javobi "sotilib" qolganini: to'g'ri variant eng uzun (1.25 warn / 1.45 error), yagona texnik atamali, yagona strelka/qavsli, savolni takrorlaydi. QuestionScreen va QUIZ_BANK, faqat `uz:` (DARS_ETALON 8.4). | tell, uzunlik, javob-sotilishi, QuizBank | `src/**/*.jsx` yoki fayllar | — |
| `lint-emoji.mjs` | `lint:emoji` | ha (emoji) | 161-qonun: blokdagi `uz:` emoji > 4 error; bir xil emoji ≥2 warn; test matnida (options/explain/questionText/QUIZ_BANK) emoji error; tugma-belgilar (WHITELIST) sanalmaydi. | emoji, 161-qonun | `src/**/*.jsx` yoki fayllar | — |
| `prompt-lint.mjs` | `lint:prompt` | ha (prompt; .jsx argumentlar o'tkazilmaydi) | Hujjat-gigiena: BITTA so'z ichida lotin+kirill aralashgan homoglif («ekranга»); sof-kirill va hujjatlangan misollar (`→`) istisno; `--fix` o'zbek-lotinga tuzatib yozadi. | homoglif, aralash yozuv, kirill | rol/qonun/jarayon MD (`.claude/agents`, CLAUDE.md, *_ETALON, PIPELINE…) yoki fayllar | — |
| `scripts/lint-keys.mjs` | `lint:keys` | ha (keys) | INLINE_KEYS dagi `s<N>` kalitlar to'plami == SCREEN_META `scored:true` ekranlar; ishtirok-kalit (-1) scored bo'lmasa s-qolipda bo'lmasin (server total_questions uchun). | INLINE_KEYS, scored, jonli-ball | `src/**/*.jsx` (INLINE_KEYS'li) yoki fayllar | — |
| `layout-lint.mjs` | `lint:layout` | YO'Q (nomzod; vite+Chrome kerak, daqiqalar ketadi) | Brauzerda o'lchaydi: A qirqilish (overflow:hidden), B ustma-ust (ikki o'q kesishishi), C chiqish (matn qutidan), D yopilish (absolyut qatlam matnni >8% yopadi, ⛶). Kirish-animatsiya tugashi kutiladi; kalibrovka istisnolari. | qirqilish, ustma-ust, chiqish, yopilish, ⛶, 147-qonun | `http://localhost:5300/#/lesson/<key>` (vite `--port 5300`), `--keys --lang --mode --vp --interact --selftest`; env CHROME | `--vp` bilan (bir nechta: 1280x773, 1366x768…); asos 1280x773 |
| `lint-dizayn.mjs` | `lint:dizayn` | YO'Q (nomzod; faqat grep, Chrome/server kerak emas) | Bridge-tozalik regex qoidalari: D1 chap rang-chiziq, D2 repeating-linear-gradient, D3 tepa rang-chiziq (::before/after), D4 maydon tepasida savol-yorliq, D5 «bosing», D6 yo'riq-yorliq («👆»), D7 emoji soni (info). | dizayn, rang-chiziq, kesik chiziq, bosing, emoji (o'lchov) | fayllar (majburiy argument) | — |
| `scripts/lint-teg-royxat.mjs` | — | YO'Q (kompilyator-ro'yxat uchun alohida) | Kompilyator maslahat-ro'yxati `teg-xaritasi.json` bilan bir xilmi: gen --check, uz+ru izoh, `dars` tartibda, topshiriq so'ragan teglar o'tilgan darsgacha xaritada, 1-Modul kompilyatorli darsi `stage` beradi. | teg-xaritasi, stage, uz/ru izoh | `src/compilator/teg-xaritasi.json`, `src/App.jsx`, dars fayllari | — |
| `tools/page-audit.mjs` | — | YO'Q (nomzod; Chrome kerak) | Darsni ekranma-ekran + bosishlar bilan ochib o'lchaydi (tuzatmaydi): INP/INP2 (yorliq maydon tepasida/ikki marta), ALIGN (ustun tekisligi >6px), SCROLL (sig'maslik), EQH, LOOSE (yorliq blokdan tashqarida), DUP (ikki matn-blok bir ma'noda). | INP, ALIGN, SCROLL, LOOSE, DUP, bridge-tozalik | `<lesson.jsx>` (esbuild bilan yig'iladi), `--out --clicks --lang --shots`; env CHROME_PATH | 1280x800 |
| `tools/ru-gate.mjs` | — | YO'Q (nomzod; Chrome kerak EMAS) | UZ-regressiya: normalize(tarjima) esbuild-kanonik matni == normalize(baseline) (tarjima UZ matn va mantiqni o'zgartirmagan); plyus `ru:` dan tashqarida RU-qoldiq skaneri. | ru, i18n, regressiya, tr(), `{uz,ru}` | `<baseline.jsx> <translated.jsx>`, `--unwrap --out` | — |
| `tools/ru-walk.mjs` | — | YO'Q (Chrome kerak) | Darsni uz+ru ekranma-ekran ochadi: pageerror/console.error, `.lesson-root` chizildimi; RU rejimda o'zbekcha qoldiq, UZ rejimda kirill qoldig'i (ma'lumot). Exit 0/1/2/3. Dev-server kerak emas (file://). | ru, uz-qoldiq, kirill, pageerror, oq ekran | `<lesson.jsx>`, `--shots --langs --screens --wait`; env CHROME_PATH (default Windows yo'li!) | 1280x800 |
| `tools/tmi-shot.mjs` | — | YO'Q (tekshiruv emas, skrinshot) | Bitta darsning har ekranini skrinshotga oladi (TMI ko'zdan kechirish); pageerror yig'adi. CHROME va BASE qattiq yozilgan (Windows yo'li). | TMI, skrinshot | `http://localhost:5173/#/lesson/<key>`, argv: key, chiqish papkasi; `_lessonids.txt` | 1280x773 |
| `scripts/smoke-arena.mjs` | — | YO'Q (sekin, har savol 15 s) | Arena avto-o'tishi: T1 vaqt tugasa `quiz_control` 'r'; T2 javobdan keyin AUTO_NEXT_MS → 'q' q+1; T3 ⏸ bosilsa avto-o'tish yo'q. Soxta HTTP-server jonli sessiyani saqlaydi, mentor rejim. | arena, avto-o'tish, jonli-sessiya | fayl(lar) (esbuild), soxta 127.0.0.1 server; env CHROME, SHOT | 1440x900 |
| `scripts/ach-probe.mjs` | — | YO'Q (spec JSON kerak) | 151-qonun nishon/AchRule ekran-probi: S0–S5 holatlar (qator bor/yo'q, xato→to'g'ri, F5-saqlov, sirpanish); `--solo` — serverga javob ketdimi; spec JSON bilan. | nishon, AchRule, 151-qonun, F5, missed | spec.json, esbuild yig'ma file://, soxta server; env CHROME; `--smoke --solo --lang --out --shots` | 1280x800 |
| `scripts/shot-screen.mjs` | — | YO'Q (skrinshot vositasi) | Dars faylining bitta ekranini ccProgress orqali ochib skrinshot oladi (CLICK= ekran ichida bosish, SHOT_LANG). | skrinshot, dizayn-ko'rik | `<fayl.jsx> <ekran>`; env CHROME (default Windows!), SHOT_W/H/WAIT/LANG | 1440x900 (SHOT_W/H) |
| `_smoke.mjs` | `smoke` | YO'Q (nomzod; vite+Chrome kerak) | App.jsx `comp:` li har dars kalitini brauzerda ochib pageerror/console.error va `.lesson-root` chizilganini tekshiradi (`tr is not defined` kabi). | smoke, oq ekran, ReferenceError | `http://localhost:5300/#/lesson/<key>`, `src/App.jsx`, `_lessonids.txt`; env CHROME (default Windows!) | 1280x773 |
| `oxlint-undef.json` | `lint:undef` | ha (undef; oxlint bin) | oxlint `no-undef`: e'lon qilinmagan o'zgaruvchi (bosilgandan keyin oq ekran, JsVars s5 bug'i); globals: process, __lang, __DARS_API_URL__; eski papkalar ignore. | undef, oq ekran | `src` (default) | — |

## feedback/F-0928-QA-5modul/vositalar/ (README bor)
| Skript | Nima qiladi |
|---|---|
| `shots.mjs` | Darsni esbuild+Chrome bilan ochib ekranma-ekran skrinshot; har ekranda pageerror (env SHOT_LANG, SHOT_W/H, SHOT_WAIT, FULL, CLICK, TAG, EVAL, RDIR). |
| `ru-wl.mjs` | RU ish-ro'yxati (HEAD bilan farq qilgan uz satrlari), `--apply` bilan tarjimani qo'yadi. |
| `final-check.sh` | Yakuniy tekshiruv: gates, ball kalitlari HEAD bilan, ru-gate, uz/ru smoke (`LIST=`). |
| `site-smoke.mjs` | `dist-m5` lokal sayt: har dars uz/ru ochiladimi. |
| `live-smoke.mjs` | Jonli saytda xuddi shu tekshiruv. |
| `sweep.py` | 12 faylga bir xil CSS/matn tozalash (F-1001-69) — namuna. |

## feedback/F-0929-LMS-yuklash/vositalar/
| Fayl | 1 gap |
|---|---|
| `click-walk.mjs` | LMS paketidagi .jsx ni ekranma-ekran ochib bosiladiganlarni bosadi, pageerror/ErrorBoundary yig'adi. |
| `hc-avto-sinov.mjs` | Kompilyator avto-to'ldirish sinovi, 46 holat (F-1001-91), faqat o'qiydi. |
| `hc-dars-ekran.mjs` | Paketdagi har kompilyatorli darsni LMS CSS bilan ochib, `stage` bo'yicha kutilgan natijani sinaydi. |
| `hc-paket-sinov.sh` | Paketdagi har kompilyatorli faylni hc-avto-sinov bilan to'liq sinaydi. |
| `shot.mjs` | LMS paket faylini ochib harakatlar ketma-ketligi + skrinshot (LMS=1 — haqiqiy host.css). |
| `verify-fixed.mjs` | LMS CSS bilan `.is-fixed` qator oqimda, blokdan chiqmagan, ✓ qirqilmaganini o'lchaydi. |
| `vf2.mjs` | verify-fixed ning 2-versiyasi (LMS CSS bilan tekshiruv, chiqish /tmp/lms-tekshir). |
| `codemod-izoh.py` | Test izohi va recap ko'rinishini qisqartiruvchi kod-qatlam codemod (S8/S9/S10). |
| `izoh.py` | Izoh/recap matnini extract/apply qiluvchi vosita (JSON orqali). |
| `faqat-izoh.py` | Dars faylida izoh/recap matnidan boshqa hech narsa o'zgarmaganini isbotlaydi. |
| `collide3.py` | LMS host CSS (Tailwind) bilan dars klasslari to'qnashuvini aniqlaydi. |
| `lms-md5.py` | LMS'ga yuklangan fayllarni paket bilan md5 orqali solishtiradi (REJA 5.2). |
| `teg-qidir.py` | Dars ekranlaridan HTML teg/CSS/JS kalit so'z dayjesti (teg-xaritasi nomzodlari). |
| `lms-host.css`, `lms-host-Cxf12j0x.css`, `hc-proto/` | Skript emas: LMS host CSS nusxalari va kompilyator prototipi. |

## Xulosa
- Jadvaldagi asosiy skriptlar: 20 (+ oxlint konfig); QA-5modul 6 fayl; LMS-yuklash 13 skript.
- gates'da: 9 (esbuild, undef, jsx, keys, dark, til, tell, emoji, prompt).
- Gates'ga kirmagan, nomzodlar: layout, dizayn, page-audit, ru-gate (+ _smoke, lint-teg-royxat).
  - `lint:dizayn` — eng oson: Chrome/server shart emas, faqat fayl argumenti kerak (tez, grep). Gates'ga qo'shsa bo'ladi, lekin 🟡 warn/⚪ info bor, faqat D1/D2 error.
  - `lint:layout` — vite `npx vite --port 5300` ishlab turishi, Chrome (`/usr/bin/google-chrome`, env CHROME), playwright-core; ~20 s/dars → gates uchun og'ir, modul-oxiri darvozasi.
  - `page-audit` — Chrome (CHROME_PATH, default /usr/bin/google-chrome), esbuild, playwright-core; server kerak emas; fayl bo'yicha; tuzatmaydi, faqat ro'yxat (exit-kod mantig'i tekshirilmagan).
  - `ru-gate` — Chrome/server kerak emas; ikki fayl (baseline + tarjima) kerak, shuning uchun argumentli gates oqimiga mos emas (bitta fayl berilmaydi).
- Muhit tuzoqlari: `ru-walk`, `shot-screen`, `_smoke`, `tmi-shot` da default Chrome yo'li Windows (`ru-walk`: CHROME_PATH; shot-screen/_smoke: CHROME; tmi-shot: qattiq yozilgan, env yo'q).
