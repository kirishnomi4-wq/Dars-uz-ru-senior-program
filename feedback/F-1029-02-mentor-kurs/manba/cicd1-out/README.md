# CI/CD-1 — haqiqiy chiqishlar (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd1.sh` (repo ildizidan). O'quvchi reposi GitHub'dan yangi papkaga; har buyruq toza muhitda (`env -i … CI=true`) — CI mashinasidagi kabi toza clone. **GitHub Actions'ning o'zi yurgizilmagan** (push kerak — ruxsat so'ralmagan): `ci.yml` faqat GitHub'ning rasmiy tahlilchisi `@actions/workflow-parser` 0.3.61 bilan (schema) tekshirilgan; Actions ekrani haqidagi har gap — ⚠ hujjat bo'yicha.
Versiyalar `00`: Node 24.18 · npm 11.16 · repo `45071ac` (2026-06-15). GitHub `ubuntu-latest` = Ubuntu 24.04.5, unda Node.js 22.23.4 (`12`).

| Fayl | Nima |
|---|---|
| 01 | **`npm ci` yiqiladi**: `can only install packages when your package.json and package-lock.json … are in sync` · `Missing: @nestjs/jwt@11.0.2 from lock file` … (chiqish kodi 1) |
| 02 | `npm install` — ishlaydi (`added 759 packages`) |
| 03 | test fayli yo'q reposda `npm test` → `No tests found, exiting with code 1` (chiqish kodi 1) |
| 04 | `npm run build` (`nest build`) — yashil (0) |
| 05 | `npm run lint` (skriptda `--fix`) → **`✖ 49 problems (46 errors, 3 warnings)`**, chiqish kodi 1; `--fix` 14 faylni o'zgartirdi (`git status`) |
| 06 | `--fix`siz `npx eslint …` → `✖ 120 problems (116 errors, 4 warnings)` |
| 07 | Jest-1 `order` testi qo'shilgach `npm test` — PASS (0) |
| 08 | `*` → `+` — FAIL `Expected: 20000 · Received: 10002` (chiqish kodi 1) |
| 09 | `npm test && npm run build && echo UCHIRISH` — test qizil: hech narsa chiqmaydi, kod 1; test yashil: `UCHIRISH`, kod 0 |
| 10 | `ci.yml` variantlari (`manba/cicd1-yml/`) rasmiy tahlilchida: o'quvchi darsidagi (checkout'siz) — **xato yo'q**; tavsiya (checkout@v7 · setup-node@v7 · Node 22 · install · test · build) — xato yo'q; `npm ci`li — xato yo'q (schema), lekin 01 bo'yicha bu repoda qizil; `on: once` → `Unexpected value 'once'`; `runs-on` yo'q → `Required property is missing: runs-on`; surilish xatolari → `A block sequence may not be used as an implicit map key` |
| 11 | checkout'siz holat: bo'sh papkada `npm install`/`npm test` → `npm error enoent Could not read package.json` (lokal; GitHub'dagi ish papkasi checkout'siz bo'sh — `12`dagi actions/checkout README) |
| 12 | GitHub hujjatidan (`gh api`, o'qish): `ubuntu-latest` → Ubuntu 24.04; Node.js 22.23.4; checkout v7.0.1, setup-node v7.1.0 (so'nggi relizlar); checkout README: «checks-out your repository under `$GITHUB_WORKSPACE`»; **GitHub'ning rasmiy Node.js andozasi** (`starter-workflows/ci/node.js.yml`): `checkout@v4` · `setup-node@v4` · **`npm ci`** · `npm run build --if-present` · `npm test` — o'quvchi reposida shu andoza birinchi qadamda qizil (01) |
