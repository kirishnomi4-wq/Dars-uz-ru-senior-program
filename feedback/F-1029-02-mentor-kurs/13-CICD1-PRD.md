# Mentor darsi · CI/CD-1: CI/CD nima va nega — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib №7 (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/cicd1-out/` (skript `manba/drive-cicd1.sh`, ci.yml variantlari `manba/cicd1-yml/`).

**O'quvchi darsi:** **m4c-01** «CI/CD nima va nega kerak» (`src/4c-Modull/CiCdIntroLesson.jsx`, 21 ekran). Metafora — aeroport lentasi: chamadon (kod) → 📦 Yig'ish (`npm install`) → 🔍 Skaner (`npm test`) → 📐 O'lcham ramkasi (`eslint .`) → 🎁 O'rash (`npm run build`) → ✈️ Uchirish (deploy). Tartib: qo'lda 5 qadam → lenta → CI (har push tekshiriladi, «birlashtirish») → CD (Delivery — tasdiq bilan · Deployment — o'zi) → lenta nuqtalari va buyruqlar → lenta o'yini (qizil nuqtada to'xtaydi) → nega (tezlik · ishonch · jamoa) → ikki holat (lentasiz/lenta bilan) → `ci.yml` bo'shliqlari (`on: push` · `runs-on: ubuntu-latest` · `run: npm test`) → yakuniy (nuqtalar tartibi) → amaliyot: o'z repoga `.github/workflows/ci.yml` (`npm install` + `npm test`), push, Actions'ni kuzatish · uyga vazifa — test (5 savol).
**Oldin:** Jest-2. **Keyin:** GitHub Actions (m4c-03 — `uses`, `actions/checkout`, `setup-node`, tartib; kurs jadvali §4).

1. **Biladi (3 gap):** CI — har push'da toza mashinada aynan sizning terminal buyruqlaringiz (`npm install`, `npm test`, `npm run build`) yuradi; chiqish kodi 1 bo'lsa lenta to'xtaydi. CD — tekshirilgan yukni chiqarish: Delivery (tasdiq bilan) va Deployment (o'zi). O'quvchi reposida lenta qayerda qizil bo'lishini biladi: `npm ci` (lock sinxron emas), test yo'q (`No tests found`), lint (46 error), `ci.yml`da checkout yo'q (papka bo'sh).
2. **Qo'li bilan (3 amaliyot):** P1 «lenta qo'lda» — toza clone'da `npm install && npm test && npm run build` → isbot · P2 o'z GitHub reposiga `ci.yml` (checkout bilan) → Actions'da yashil → isbot `Tests:` satri · P3 buzish (`*` → `+`) → Actions qizil → isbot `Received`.
3. **Haqiqiy loyiha:** o'quvchi reposi, `drive-cicd1.sh` → `cicd1-out/` 12 fayl (toza clone, `env -i`, `CI=true`). `ci.yml` — GitHub'ning rasmiy tahlilchisi `@actions/workflow-parser` 0.3.61 bilan (schema). **GitHub Actions'ning o'zi yurgizilmagan** (push kerak — ruxsat so'ralmagan) — Actions ekrani bilan bog'liq hamma joy ⚠.
4. **Buzamiz:** `npm ci` (lock) · test yo'q · checkout yo'q (bo'sh papka, `ENOENT package.json`) · lint qadami (46 error, `--fix` 14 faylni o'zgartiradi) · test qizil → `&&` zanjiri to'xtaydi · YAML xatolari (`on: once`, `runs-on` yo'q, surilish).
5. **Ko'prik:** m4c-01 xaritasi · o'quvchi tili (lenta nuqtalari = buyruqlar) · sinfdagi holatlar · m4c-03 bilan chegara (checkout u yerda o'rgatiladi).
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'z Jest-1/Jest-2 reposiga `ci.yml` (checkout · setup-node · install · test · build), bir marta qizil → yashil → faqat GitHub linki (M30).
8. **Hajm (taxmin):** ~25 ekran · ovoz ~20 daq · amaliyot ~35 daq · jami ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — Actions'ning haqiqiy ekrani: sizning ruxsatingiz bilan **shaxsiy sinov reposi** ochib (`kirishnomi4-wq` hisobi, private), uch `ci.yml` (to'g'ri · checkout'siz · `npm ci`) push qilinadi va haqiqiy loglar olinadi. Ruxsatsiz — Actions maket + «⚠ rasmiy hujjatdan, sinalmagan».
   - **Q2** — o'quvchi reposi uchun tavsiya `ci.yml`: checkout · setup-node 22 · **`npm install`** (`npm ci` emas) · `npm test` · `npm run build`; lint qadami **yo'q** (46 error) — mentor sababini biladi.
   - **Q3** — o'quvchi m4c-01 amaliyotidagi `ci.yml`da `actions/checkout` yo'q → GitHub'da `npm install` yiqiladi (hujjat bo'yicha; lokal — bo'sh papkada `ENOENT`). Mentor darsida: «amaliyotda bitta qator qo'shing». O'quvchi darsini tuzatish — alohida qaror (tegilmadi).
