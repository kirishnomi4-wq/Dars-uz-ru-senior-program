# Jest-1 — haqiqiy chiqishlar (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest1.sh` (repo ildizidan). O'quvchi reposi GitHub'dan yangi papkaga clone qilinadi; mahalliy nusxaga tegilmaydi.
Versiyalar `00`: Node 24.18 · npm 11.16 · repodagi jest 30.4.2 · ts-jest 29.4.11 · typescript 5.9.3. Misol — o'quvchi m4b-01 dagi aynan: `orderTotal(price, quantity)`, `order.ts` + `order.spec.ts`; uyga vazifa `deliveryFee`.

**MUHIM (tuzoq, 01.11):** Jest 30 agent muhitini sezadi (`@jest/core` → `AGENT_ENV_VARS`: `CLAUDECODE`, `CLAUDE_CODE`, `CURSOR_AGENT`…) va **ixcham** chiqaradi: `PASS` qatorlari va test nomlari yo'qoladi. Birinchi yurgizish shu sabab o'quvchi ekraniga mos emas edi — hamma `npm test` endi `env -i` (toza muhit) bilan; bu fayllardagi chiqish o'quvchi terminalidagi bilan bir xil.

| Fayl | Nima |
|---|---|
| 01 | clone · **`npm ci` yiqiladi**: `package.json` va lock sinxron emas (`Missing: @nestjs/jwt … from lock file`) → `npm install` ishlaydi (Nest-2 dagi ham shu) · repodagi `jest` sozlamasi: `rootDir: src`, `testRegex: .*\.spec\.ts$`, `transform: ts-jest` |
| 02 | birorta `.spec.ts` yo'q → `No tests found, exiting with code 1` (`testRegex … 0 matches`) |
| 03 | `src/order.ts` + `src/order.spec.ts` → `PASS src/order.spec.ts` · `✓ 2 kitob narxini hisoblaydi` |
| 04 | `*` → `+` → `FAIL` · `Expected: 20000` · `Received: 10002` · xato satri `>` bilan |
| 05 | `expect` yo'q, faqat `console.log` → `20000` chiqadi, test **PASS** (yolg'on yashil) |
| 06 | noto'g'ri etalon `toBe(10002)` → FAIL, `Expected: 10002 · Received: 20000` (kod to'g'ri) |
| 07 | test fayli `src/` dan tashqarida (loyiha ildizida) → `No tests found` (`rootDir: src`) |
| 08 | fayl nomi `order.test.ts` → `No tests found` (Nest `testRegex` faqat `.spec.ts`) |
| 09 | uyga vazifa `deliveryFee`: 3 test + order → `4 passed` |
| 10 | chegara xatosi `>=` → `>`: `aynan 100 000 — bepul` qizil, `Expected: 0 · Received: 15000` |
| 11 | Nest reposida darsdagi `npm i -D jest ts-jest` → zararsiz: jest 30.4.2→30.5.2, ts-jest 29.4.11→29.4.15, testlar yashil |
| 12 | **bo'sh JS loyiha** (Nest emas) + `npm i -D jest ts-jest` + `"test": "jest"` → `FAIL … Must use import to load ES Module` |
| 13 | + `npx ts-jest config:init` → `TS2593: Cannot find name 'describe'` (`@types/jest` yo'q) |
| 14 | + `npm i -D typescript @types/jest` → **TypeScript 7.0.2** keladi → `does not expose the JavaScript compiler API required by ts-jest` |
| 15 | + `npm i -D typescript@5` → `PASS ./order.spec.ts` |
| 16 | `npx jest --verbose` — ikki fayl, 4 test nomi bilan |
| 17 | (MD KOD 5) yangi clone, `npm install`siz → `sh: 1: jest: not found` (kod 127) |
| 18 | import nomi xato → `Cannot find module './orders' from 'order.spec.ts'` |
| 19 | qavs tushib qolgan → `error TS1005: ')' expected.` |
| 20 | bo'sh loyiha, to'rt paket **bitta buyruqda** → TypeScript **6.0.3** → `@types/jest` bo'lsa ham `TS2593` · `npm ci` versiyani o'zgartirmaydi (6.0.3) · test `.js` nomida → `Jest encountered an unexpected token` |

**Darsga ko'chirishda:** `/tmp/…` yo'llari qisqartiriladi; 13–14 dagi rang kodlari (`[96m…`) olib tashlanadi. Bo'sh loyiha zanjiri (12–15) — o'quvchi «o'z loyihasi» Nest bo'lmasa nima bo'lishini ko'rsatadi.
**Qo'shimcha kuzatuv:** npm 11.16 `allow-scripts` ogohlantirishi (bcrypt `node-gyp rebuild` va boshqalar ishlatilmagan) — Jest'ga ta'sir qilmaydi; bcrypt 6.0.0 tayyor prebuild bilan ishlaydi (`require('bcrypt')` + `hash` tekshirildi), `node-gyp` kerak emas.
