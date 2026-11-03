# m4c-03 «GitHub Actions — yo'l xaritasini yozish» — o'quvchi darsi xaritasi (CI/CD-2 mentor darsi uchun manba)

Manba: `src/4c-Modull/GithubActionsLesson.jsx` (SCREEN_META 23 ta, o'qildi 01.11 11:10). Darsga TEGILMAGAN — faqat o'qish.

| # | id | Ekran | O'quvchi nima qiladi | Mentor uchun haqiqat (run bilan tekshiriladi — `cicd2-out/`) |
|---|---|---|---|---|
| 1 | s0 | Hook: chamadon lentaga qo'yildi, skaner yurmadi | 3 variant: qo'lda / Actions / testsiz | — |
| 2 | s1 | Reja: 4 qadam | — | — |
| 3 | s2 | GitHub Actions nima — «bepul, alohida server kerak emas» | lentasiz ↔ lenta bilan | private repo: tarif ulushidan (`cicd1-out/12`) |
| 4 | s3 | `.github/workflows/ci.yml` — joylashuv | papkalarni ochish | har `.yml` — alohida workflow |
| 5 | s4 | Test 1 — fayl qayerda | MC | — |
| 6 | s5 | YAML: bo'sh joy = ierarxiya | savollar | surilish xatosi → `32` |
| 7 | s6 | Workflow → Job (nuqta) → Step (amal) | savollar | Actions oynasida aynan shu uch daraja (`20`) |
| 8 | s7 | Test 2 | MC | — |
| 9 | s8 | `on:` — push / pull_request / schedule | uchala signal | `on: once` → `30` |
| 10 | s9 | `runs-on: ubuntu-latest` | tugma | `runs-on` yo'q → `31`; `my-laptop` → `33` |
| 11 | s10 | Test 3 — on va runs-on | MC | — |
| 12 | s11 | `uses` va `run` | ikkalasini bosish | — |
| 13 | s12 | DragDrop: checkout → setup-node → install → test (`@v4`) | sudrash | tartib xato → `24`; `@v4` → `10`, `25` |
| 14 | s13 | matrix: `node: [18, 20, 22]` | «3 lenta ishlab bo'ldi» | **`node-version`ga ulanmagan** → `40`, ulangan → `41` |
| 15 | s14 | cache: `actions/cache@v4` + `path: node_modules`, «5 baravar» | solishtirish | **`key:` yo'q** → `50`; o'lchov `51–53` |
| 16 | s15 | Test 4 — uses/run/matrix/cache | MC | — |
| 17 | s16 | secrets: ochiq ↔ `${{ secrets.API_KEY }}`; «jurnalda ham hech qachon ochiq ko'rinmaydi» | ikkalasini sinash | logda `***` → `61` |
| 18 | s17 | MARKAZIY: yo'l xaritasini yozish (on, runs-on, steps; begona `git push`, `print('test')`) | qurish → simulyatsiya | begona qatorlar haqiqiy Actions'da → `16`, `17`; testsiz → `14` |
| 19 | s18 | YAKUNIY: «Qizil chiroq yondi» — jurnalda SKANER yo'q | 1 urinish | testsiz run rangi → `14` |
| 20 | practice | O'z repoga `ci.yml` (checkout, setup-node, install, test) + «Repongiz yo'qmi?» `ci-mashq` | push → yashil | `10`; `npm ci` → `11`; qizil yo'li → `12` |
| 21 | podium | Natijalar | — | — |
| 22 | sflash | 11 kartochka (`.github/workflows/`, `on:`, `runs-on`, job, step, uses, run, `actions/checkout@v4`, matrix, cache, secrets, «lenta jurnalidan») | — | — |
| 23 | s19 | Yakun + uyga vazifa (HW 6-10): yashil → qizil → yashil, «jurnaldan sababni toping», 3 run linki | — | `20–22` (o'quvchi reposi) / `10, 12` (`ci-mashq`) |

## O'quvchi metafora lug'ati (4c bo'ylab) → mentor buyrug'i
push = lentaga qo'yish · pipeline = LENTA · workflow `ci.yml` = YO'L XARITASI · job = NUQTA · step = AMAL · runner (`runs-on`) = LENTA MASHINASI · `on: push` = START SIGNALI · install = 📦 YIG'ISH · test = 🔍 SKANER · build = 🎁 O'RASH · deploy = ✈️ UCHIRISH · log = LENTA JURNALI · yashil/qizil = YASHIL/QIZIL CHIROQ · secrets = SEYF · matrix = PARALLEL LENTALAR · cache = YAQIN JAVON · status badge = TABLO.
