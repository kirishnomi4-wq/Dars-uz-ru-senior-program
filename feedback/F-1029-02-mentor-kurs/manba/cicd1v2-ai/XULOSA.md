# CI/CD-1 v2 · AI tajribasi — xulosa (F-1104-20, 04.11)

Loyiha: OrderBotNest `jest2-done` (e15a44c, workflow yo'q). Har agent alohida nusxada (scratchpad `cicd1-ai1`, `cicd1-ai2`), bitta oddiy prompt (`p1-prompt.txt`):
«Bu NestJS loyihasi uchun GitHub Actions workflow yozib ber: har push'da testlar yursin.» — ishorasiz: `npm ci`, `checkout`, `setup-node`, `tsc`, `cache`, `build`, versiya so'zlari yo'q.
Mashina: Node 24.18 · npm 11.16 (`cicd1v2-out/00`).

| | 1-AI (Opus) | 2-AI (Haiku) |
|---|---|---|
| Fayl | `.github/workflows/test.yml` (22 satr) | `.github/workflows/ci.yml` (26 satr) |
| `on` | `push` | `push` |
| Qadamlar | checkout@v4 · setup-node@v4 (`node-version: 22`, `cache: npm`) · `npm ci` · `npm test` | xuddi shu + `permissions: contents: read`, job nomi «Jest testlar» |
| Qadam nomlari | o'zbekcha («Kodni yuklab olish», «Node.js 22 o'rnatish», «Kutubxonalarni o'rnatish», «Testlar») | o'zbekcha («Kodni olish», «Node.js o'rnatish», «Bog'liqliklarni o'rnatish», «Testlarni ishga tushirish») |
| Kodga tegdimi | yo'q (`git status`: faqat `.github/`) | yo'q |
| `tsc` qadami | **yo'q** | **yo'q** |
| `build` qadami | **yo'q** | **yo'q** |
| `node-version` | **22** (mashinada 24 — so'ramadi) | **22** |
| YAML (rasmiy tahlilchi) | ✓ | ✓ |

## Haqiqiy lentada (`ci-sinov`, `drive-cicd1v2-actions-ai.sh`)

| Run | Workflow | Natija | Qayerda |
|---|---|---|---|
| `19-ai1` | 1-AI, o'zgartirilmagan | ✗ failure | `Kutubxonalarni o'rnatish` (`npm ci`): `Missing: webpack@5.112.2 from lock file` — runner Node 22 → npm 10 (`10a` bilan bir xil) |
| `20-ai2` | 2-AI, o'zgartirilmagan | ✗ failure | `Bog'liqliklarni o'rnatish` (`npm ci`): o'sha xato |
| `21-ai1-node24` | 1-AI, faqat `node-version: 22 → 24` | ✓ success | `npm ci` ✓, `npm test` ✓ (25 test). Qadam nomi hali «Node.js 22 o'rnatish» — nom raqamga ergashmadi |

## Xulosa (darsga kiradi — 18, 19, 20-ekranlar)
1. Ikkala AI **to'g'ri ko'rinadigan** fayl yozdi: checkout, setup-node, `npm ci`, `npm test`, YAML xatosiz. Prompt «testlar yursin» dedi — AI aynan shuni qildi, ortig'ini emas.
2. Ikkalasi **mashinani so'ramadi**: `node-version: 22` (odatiy raqam). Shu loyihada bu qizil: runner'dagi npm 10 lock'ni boshqacha o'qiydi. AI buni bilishi mumkin emas edi.
3. Ikkalasida **`tsc` va `build` yo'q**: tur xatosi (`cicd1v2-out/06`, run `14`) bu lentada yashil o'tadi — yolg'on yashil.
4. Bitta raqam (22 → 24) qizilni yashilga aylantirdi — AI fayli yomon emas, **boshlanish nuqtasi**.
5. Mentor uchun to'rt savol (19-ekran): `checkout` bormi · `node-version` = `node --version` · `npm ci`mi · `tsc` va `build` bormi. Keyin push va run.

Fayllar: `ai1/.github/workflows/test.yml`, `ai2/.github/workflows/ci.yml`, `ai*/git-status.txt`, `ai*/diff.patch` (bo'sh — yangi fayl, tracked emas), `cicd1v2-out/19-ai1.txt`, `20-ai2.txt`, `21-ai1-node24.txt`.
