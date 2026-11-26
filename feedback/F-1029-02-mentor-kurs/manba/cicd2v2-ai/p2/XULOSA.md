# CI/CD-2 · 2-topshiriq «CI tilida» — XULOSA (F-1125-01, 26.11)

Topshiriq: `../p2-prompt.txt` — smoke alohida job, faqat testlar yashil bo'lsa; PostgreSQL job ichida vaqtinchalik, tayyor bo'lgach smoke; `DATABASE_URL` faqat smoke qadamiga. `services`, `needs`, `secrets` so'zlari yo'q. Asos va modellar 1-topshiriq bilan bir xil: OrderBotNest `cicd1-done` (b842475, tavsiya `ci.yml`), git tarixsiz `git archive` nusxa (tarmoq `main`); 1-AI Opus, 2-AI Haiku. Javoblar aynan — `ai*/00-javob.md`.

| | Oddiy (p1, 04.11) · 1-AI / 2-AI | CI tilida (p2, 26.11) · 1-AI / 2-AI |
|---|---|---|
| O'zgarish | +20 / +17 satr | +32 / +33 satr (`diff-stat`) |
| Smoke | oxirgi qadam (bitta job) | alohida `smoke` job, `needs: test` — ikkalasida |
| PostgreSQL | `services: postgres:18` + healthcheck (README'dan) / xuddi shu | `services: postgres:18` + healthcheck / **`docker run … postgres:16`** + `pg_isready` kutish sikli + `if: always()` tozalash |
| `DATABASE_URL` | smoke qadamida / job darajasida | ikkalasida faqat smoke qadamida |
| GitHub run (ci-sinov) | 40 ✓ · 41 ✓ | **42 ✓ (#47) · 43 ✓ (#48)** — smoke `NATIJA: 5/5 ✓` ikkalasida (26.11, foydalanuvchi ruxsati bilan push) |

## Saboq
1. Mavzu tilidagi topshiriq tuzilishni tavsiyadagidek berdi: alohida job, `needs: test`, `env` faqat smoke qadamida — ikkala AI'da.
2. Kalit so'z aytilmasa, AI boshqa yo'l tanlashi mumkin: 2-AI `services` o'rniga `docker run` + qo'lda kutish sikli yozdi — ishladi (run 43).
3. **Topilma:** 2-AI versiyani loyihadan olmadi — `postgres:16`, README'da «PostgreSQL 18» (1-topshiriqda ikkala AI 18 ni README'dan olgan). Lenta yashil, lekin boshqa versiyani sinaydi — CI/CD-1 dagi `node-version` kabi. Darsda «Tekshiruv 5» (`ai2/.github/workflows/ci.yml` 29-satr).
4. Tuzatish yurgizilgan: shu loyihaning smoke'i PostgreSQL 18.4 da `NATIJA: 5/5 ✓` (`ai2/smoke-pg18-lokal.txt`, lokal vaqtinchalik klaster); GitHub'da `postgres:18` bilan — run 42 (1-AI fayli). 2-AI faylining 18 bilan GitHub run'i yo'q (ruxsat 4 ta workflow uchun edi).

## Halol cheklov
- Lokal smoke yozuvida chiqish kodi yo'q (zsh `PIPESTATUS`), natija — `NATIJA: 5/5 ✓` qatori.
- «Telegram bot ulandi» qatori — smoke `Telegraf.launch` ni soxtalaydi (GitHub run 40, 42 loglarida ham bor), tarmoqqa so'rov emas.
