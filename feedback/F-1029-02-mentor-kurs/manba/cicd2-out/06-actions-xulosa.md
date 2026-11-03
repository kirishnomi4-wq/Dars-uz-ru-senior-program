# GitHub Actions — haqiqiy run'lar jamlanmasi (F-1029-02, 01.11.2026 18:20–18:43)

Repo: `kirishnomi4-wq/mentor-ci-sinov` (private) · run linki: `https://github.com/kirishnomi4-wq/mentor-ci-sinov/actions/runs/<id>`.
Skript: `manba/drive-cicd2-actions.sh <nest|mashq|yaml|matrix|cache|secret|papka>`. Har run'ning to'liq logi, qadamlari (API) va annotatsiyalari — `NN-*.txt`.
Server (har run'da): `Image: ubuntu-24.04` · `Version: 20261025.353.1` · Node `v22.23.4` (oldindan o'rnatilgan, «Found in cache»).
Har run'da GitHub eslatmasi: «The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026» — 01.11 da hali 24.04 keldi.

## 1. O'quvchi reposi (IntroNestArxitechture 45071ac + order testi) — `main`

| # | Nima sinaldi | Natija | Yiqilgan qadam · logdagi asosiy satr | run |
|---|---|---|---|---|
| 20 | CI/CD-1 tavsiya `ci.yml` (v7, Node 22, install → test → build) | ✅ success, 43 s | `npm install` 34 s · `PASS src/order.spec.ts` · `Tests: 1 passed, 1 total` | 41310764794 |
| 21 | `price * quantity` → `price + quantity` | ❌ failure | `Run npm test` · `FAIL src/order.spec.ts` · `Expected: 20000` · `Received: 10002` · `exit code 1`; `Run npm run build` — skipped | 41310851212 |
| 22 | tuzatildi | ✅ success | — | 41310963553 |
| 23 | `npm install` → `npm ci` | ❌ failure | `Run npm ci` · `npm error code EUSAGE` · «package.json and package-lock.json … in sync» · `Missing: @nestjs/jwt@11.0.2 from lock file` | 41311072242 |
| 24 | `npm test` `npm install`'dan oldin | ❌ failure | `Run npm test` · `sh: 1: jest: not found` · `exit code 127` | 41311117764 |
| 25 | o'quvchi m4c-03 dagi `@v4` (node-version'siz) | ✅ success | ⚠ ogohlantirish: «Node.js 20 is deprecated … actions/checkout@v4, actions/setup-node@v4 … forced to run on Node.js 24» | 41311151858 |
| 26 | tavsiyaga qaytildi | ✅ success | — | 41311265640 |

Qadam nomlari (API): `Set up job` → `Run actions/checkout@v7` → `Run actions/setup-node@v7` → `Run npm install` → `Run npm test` → `Run npm run build` → `Post Run actions/setup-node@v7` → `Post Run actions/checkout@v7` → `Complete job`. Yiqilgan qadamdan keyingilari `skipped`.

## 2. «Repongiz yo'qmi?» `ci-mashq` namunasi (lock faylsiz) — `mashq`

| # | Nima sinaldi | Natija | Asosiy satr | run |
|---|---|---|---|---|
| 10 | o'quvchi amaliyotidagi `ci.yml` aynan (`@v4`, `npm install`, `npm test`) | ✅ success | `ok` · Node 20 ogohlantirishi | 41311353505 |
| 11 | `npm ci` (GitHub Node andozasi), lock yo'q | ❌ failure | `npm error code EUSAGE` · «The `npm ci` command can only install with an existing package-lock.json» | 41311391902 |
| 12 | `"test": "echo xato && exit 1"` | ❌ failure | `xato` · `exit code 1` | 41311425951 |
| 13 | `actions/checkout` qadami yo'q (m4c-01 amaliyotidagidek) | ❌ failure | `Run npm install` · `npm error enoent Could not read package.json` | 41311460402 |
| 14 | `npm test` qadami yo'q (o'quvchi s18 «skaner tashlab ketilgan») | ✅ **success** | testsiz lenta **yashil** | 41311494840 |
| 15 | `@v7`, `node-version: 22` | ✅ success | ogohlantirish yo'q | 41311525939 |
| 16 | `run: print('test')` (o'quvchi s17 begona qatori) | ❌ failure | `syntax error near unexpected token 'test'` · `exit code 2` | 41311563024 |
| 17 | `run: git push` (o'quvchi s17 begona qatori) | ❌ failure | `fatal: unable to access … error: 403` · `exit code 128` | 41311602909 |
| 18 | `ci.yml` noto'g'ri papkada: `.github/workflow/` (s yo'q) | run **yo'q** | 90 s ichida 0 ta run | — |

## 3. YAML xatolari — `yaml`

| # | Nima sinaldi | Natija |
|---|---|---|
| 30 | `on: once` | ❌ failure, darhol |
| 31 | `runs-on` qatori yo'q | ❌ failure, darhol |
| 32 | `- run:` 2 bo'sh joy chapga surilgan | ❌ failure, darhol |
| 34 | `run: echo "Natija: ok"` (qo'shtirnoqsiz qatorda `: `) | ❌ failure, darhol |
| 33 | `runs-on: my-laptop` | ⏳ `queued` 20/60/180 s — cheksiz kutadi (bunday runner yo'q), qo'lda `cancelled` |

30–32, 34: job ham, qadam ham, log ham **yo'q**; run nomi «CI» emas, fayl yo'li `.github/workflows/ci.yml`; `gh run view`: «This run likely failed because of a workflow file issue». Aniq xato matni API'da yo'q — faqat Actions sahifasida (⚠ ko'rilmagan).

## 4. matrix — `matrix`

| # | `ci.yml` | Natija | Har lentadagi `node --version` |
|---|---|---|---|
| 40 | o'quvchi s13: `matrix: node: [18, 20, 22]`, `setup-node`ga **ulanmagan** | ✅ 3 lenta `test (18)`, `test (20)`, `test (22)` | **v22.23.4 · v22.23.4 · v22.23.4** |
| 41 | `node-version: ${{ matrix.node }}` | ✅ 3 lenta | v18.20.8 · v20.20.2 · v22.23.4 |

## 5. cache — `cache` (o'quvchi reposi, 759 paket)

| # | `ci.yml` | Natija | `npm install` | job |
|---|---|---|---|---|
| 50 | o'quvchi s14: `actions/cache@v4`, `path: node_modules`, `key:` **yo'q** | ❌ failure | yurmadi | `Run actions/cache@v4` · `Input required and not supplied: key` |
| 51 | cache'siz | ✅ | 44 s | 52 s |
| 52 | `setup-node` `cache: npm`, 1-run | ✅ | 45 s | 58 s · run oxirida «Cache saved» |
| 53 | `cache: npm`, 2-run | ✅ | **16 s** | **30 s** · «Cache restored», ~57 MB |

Kesh: `npm install` ≈ 2,8 baravar, job ≈ 1,7 baravar tez; 1-run'da foyda yo'q. «5 baravar» — tasdiqlanmadi.

## 6. secrets — `secret` (soxta qiymat `sk_test_mentor_sinov_7f3a`, 25 belgi)

| Qadam | Logda |
|---|---|
| `echo "Kalit: ${{ secrets.API_KEY }}"` | qadam nomi ham `Run echo "Kalit: ***"`, chiqish `Kalit: ***` |
| `env: API_KEY` → `${#API_KEY}` | `Uzunligi: 25` |
| bo'lib chiqarish `${API_KEY:0:7} ${API_KEY:7}` | **`Bo'lib yozilsa: sk_test _mentor_sinov_7f3a`** — to'liq ochiq |
| yo'q secret `${{ secrets.YOQ_KALIT }}` | `Yo'q secret: []` — bo'sh, xato yo'q, run yashil |

GitHub qiymatni faqat aynan shu ko'rinishda yashiradi; bo'lak/o'zgartirilgan ko'rinishi logda ochiq chiqadi.

## 7. O'quvchi darsi m4c-03 uchun (faqat ro'yxat — darsga tegilmadi)

1. s13 matrix — `node-version`ga ulanmagan: 3 yashil lenta, uchalasi Node 22 (`40`).
2. s14 cache — `key:` yo'q: lenta qizil (`50`); «5 baravar» — o'lchovda ~2,8 (`51–53`).
3. s16 «jurnalda hech qachon ochiq ko'rinmaydi» — bo'laklab chiqarilsa ochiq (`61`).
4. s17 begona `print('test')`, `git push` — haqiqiy Actions'da lenta qizil (`16`, `17`).
5. s18 «Qizil chiroq yondi» (skaner yo'q) — haqiqatda yashil (`14`).
6. Amaliyot «Repongiz yo'qmi?» — `echo ok && exit 0`: qizil run uchun skriptni o'zgartirish kerak (`12`).
7. `@v4` — ishlaydi, lekin har run'da Node 20 eskirgani haqida ogohlantirish (`10`, `25`).
