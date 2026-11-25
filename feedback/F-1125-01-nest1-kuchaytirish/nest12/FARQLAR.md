# F-1125-01 · Nest 12 sinovi — mentor Nest-1 darsi (25.11.2026, 15:54)

**Savol:** mentor Nest-1 darsi Nest 11 chiqishlari bilan yozilgan. Bugun `npm i -g @nestjs/cli` 12.x beradi. Darsdagi nima buziladi?

**Usul.** Asl sinov skriptlari (`F-1029-02-mentor-kurs/manba/drive.sh`, `drive2.sh`, `drive3.sh`) bitta skriptga jamlandi — `drive-nest12.sh` — va ikki xil Nest 12 loyihasida yurgizildi. Chiqishlar eski (`F-1029-02-mentor-kurs/manba/nest-out/`) bilan `solishtir.py` orqali solishtirildi (PID, vaqt, yo'l, stek tekislangan). Kompyuterdagi global CLI 11.0.10 ga tegilmadi — `npx @nestjs/cli@12`.

| Papka | Loyiha qanday yaratilgan |
|---|---|
| `out-enter/` | `nest new cars-api`, to'rttala savolga Enter (standart javoblar) |
| `out-cjs/` | `nest new cars-api -p npm --type cjs --no-observe --skip-skills` |
| `qolip-n11/` · `qolip-n12-enter/` · `qolip-n12-cjs/` | boshlang'ich fayllar va daraxt |

Versiyalar (`10-versions.txt`): node v24.18.0 · nest 12.0.15 · @nestjs/core 12.6.1 · typescript 6.0.3. Nest 12.0.0 chiqqan sana: 27.08.2026 (`npm view @nestjs/cli time`).

## 1. `nest new` — Nest 12 da to'rtta savol (`out-enter/00-nest-new.txt`)

1. Which package manager would you ❤️ to use? — npm · yarn · pnpm · bun
2. Would you like to set up @nestjs/observe (…)? (Y/n) — standart **Yes**
3. Which coding agents should get the official NestJS agent skills? — standart **all**
4. Which module system would you like to use? — standart **ESM (with vitest)**, ikkinchisi CJS (with jest)

Nest 11 da faqat 1-savol bor edi. Darsda aytilgan yagona gap: «Paket menejeri so'ralsa npm'ni tanlang».

## 2. Hamma savolga Enter bosilsa (`out-enter/`) — dars buziladi

| Nima | Darsda (Nest 11) | Nest 12, standart javoblar | Dalil |
|---|---|---|---|
| Dars kodi (3-amaliyot, Controller) | ishlaydi | **kompilyatsiya xatosi** `error TS2307: Cannot find module './cars.service'` — ESM'da import `.js` bilan yoziladi | `02x-dars-kodi-aynan.log` |
| `app.module.ts` | 9 qator, `imports: []` | 22 qator, `ObserveModule.forRoot({...})`, importlar `.js` bilan | `qolip-n12-enter/app.module.ts` |
| `main.ts` | `NestFactory.create(AppModule)` · `bootstrap();` | `create(AppModule, { instrument: ObserveInstrument })` · `await bootstrap();` | `qolip-n12-enter/main.ts` |
| Ishga tushish satrlari | 5 satr | 8 satr: + `DiscoveryModule`, `ObserveModule dependencies initialized`, uzun `ObserveAgentWorker` xabari | `00-fresh.log` |
| `nest g module cars` chiqishi | `UPDATE src/app.module.ts (308 bytes)` | `(901 bytes)`; `cars.module.ts` 169/246 bayt | `01-cli.txt` |
| Testlar | Jest | Vitest | `qolip-n12-enter/package.json` |
| Isbot maydoni (`nest --version`) | `11.` kutiladi | 12.0.15 — **«Davom» ochilmaydi** | `src/mentor-kurs/parts/03-s01-s05.jsx:241` |

## 3. Bayroqlar bilan yaratilsa (`out-cjs/`) — dars deyarli o'zgarmaydi

Buyruq: `nest new cars-api -p npm --type cjs --no-observe --skip-skills` — bitta ham savol chiqmaydi, 63 soniyada tugadi, oxirida «🚀 Successfully created project cars-api» (`out-cjs/00-nest-new.txt`).

**Bir xil chiqdi (Nest 11 bilan satrma-satr):** toza loyiha satrlari va javoblari (00) · CLI yaratgan fayllar va bayt sonlari 81/308/97/166/88/240 (01) · ishlaydigan modul, 200/200/404/201 (02) · «can't resolve dependencies … in the CarsModule module» va Potential solutions (03) · `@Injectable()`'siz ishlashi (04) · imports'siz 404, Mapped yo'q (05) · «invalid controller» xabari (06) · oddiy Error → 500 (07) · `/cars/abc` → 404 NaN (09) · bo'sh POST → 201 (11) · `@Injectable`'siz + dependency → so'rovda 500 TypeError `reading 'withDiscount'` (12) · `@Inject` bilan ishlashi (13) · ParseIntPipe → 400 «Validation failed (numeric string is expected)» (20) · DTO + ValidationPipe → 400 (21) · `npm run start:dev` satrlari (22).

**Farq qilgani:**

| # | Nima | Nest 11 | Nest 12 (CJS) | Darsda ko'rinadimi |
|---|---|---|---|---|
| 1 | `main.ts` oxirgi satri | `bootstrap();` | `void bootstrap();` | **Ha** — 11-ekran, `04-s06-s11.jsx:119` |
| 2 | `nest --version` | 11.x | 12.x | **Ha** — 6-ekran isbot, qadam, ovoz, RU |
| 3 | Yaratilgan fayllar | `eslint.config.mjs` | `.oxlintrc.json`, `AGENTS.md`, `.gitattributes`, `jest.config.ts` qo'shilgan, eslint yo'q | Yo'q — 5-ekran faqat 8 faylni ko'rsatadi, hammasi bor |
| 4 | `package.json` scripts | `jest` | `node --experimental-vm-modules …jest.js`, `deploy`, `lint = oxlint` | Yo'q |
| 5 | «invalid controller» stek satri | `router-explorer.js:54` | `file://…router-explorer.js:55` | Yo'q — darsda faqat xabar matni |
| 6 | Node talabi | ≥ 20 | CLI ≥ 20.11, core ≥ 20 | Ha — 6-ekran «v20 yoki undan yuqori (Nest 11 talabi)» |

07-holatdagi `ERROR [ExceptionsHandler] Error: topilmadi` satri eski logda yo'q, yangisida bor — bu Nest farqi emas: eski skript serverni javobdan keyin darhol o'chirgan, satr yozilib ulgurmagan. Mijozga boradigan javob ikkalasida bir xil.

## 4. Eski CLI bilan yangi buyruq

Global CLI 11 da `nest new cars-api -p npm --type cjs --no-observe --skip-skills` → `error: unknown option '--type'`. Demak buyruq faqat CLI 12 da ishlaydi; 2-qadam CLI 12 ni kafolatlashi kerak.

## 5. Boshqa mentor darslari (sinf-supurish)

- Versiyaga bog'langan isbot — faqat Nest-1 da (`grep "check: (v)"`, 12 dars). PG-1 `PostgreSQL \d{2}` — istalgan versiya; Nest-2 — «successfully started» + yil.
- Global o'rnatish (`npm i -g`) — faqat Nest-1 da. Nest-2 da `nest g` va global CLI ishlatilmaydi; o'quvchi loyihasi (`IntroNestArxitechture`) o'z ichida `@nestjs/cli ^11` va CommonJS.
- Kuzatuvda (xato emas): Jest-1 `npm i -D jest ts-jest`, Jest-2 `npm i -D supertest @types/supertest` — versiyasiz, lekin isbotga bog'lanmagan va OrderBotNest ichida.

## 6. Sinov vositasidagi ikki xato (dars uchun emas, keyingi sinovlar uchun)

`pty-run.py` (interaktiv buyruqni soxta terminalda yozib oladi) ikki marta `nest new`ni «qotirdi» — ikkalasi vositaning xatosi edi, Nest'niki emas:
1. Bufer cheksiz yig'ilgan → o'qish sekinlashgan → buyruq terminalga yozishda to'xtab qolgan.
2. Soxta terminalga o'lcham berilmagan (0 ustun) → spinner qatorlarni cheksiz o'chirgan (500 soniyada 1,2 GB chiqish).
Ikkalasi tuzatildi (bufer 20 ming belgi, o'lcham 40×120). Shu sabab «o'rnatish 8 daqiqa» degan birinchi o'lchov noto'g'ri — haqiqiysi 63 soniya.

## Qayta yurgizish

```bash
S=<vaqtinchalik papka>; F=feedback/F-1125-01-nest1-kuchaytirish/nest12
(cd $S && npx -y @nestjs/cli@12 new cars-api -p npm --type cjs --no-observe --skip-skills)
bash $F/drive-nest12.sh $S/cars-api $F/out-cjs cjs 3000
python3 $F/solishtir.py feedback/F-1029-02-mentor-kurs/manba/nest-out $F/out-cjs
```
