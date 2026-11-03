# Mentor darsi · GitHub Actions (CI/CD-2) — PRD v0 (01.11 avtopilot; MD YOZILMAGAN — bloker bor)

> PRD Ilova A shabloni · kursdagi ichki tartib №8 (M31: raqam yozilmaydi). Lokal chiqishlar `manba/cicd2-out/` (skript `manba/drive-cicd2.sh`).

## Bloker (avval shu hal bo'ladi)
Bu darsning asosiy mavzusi — **GitHub Actions'ning o'zi**: Actions oynasi, run ro'yxati, job/step logi, qizil run sababi. Haqiqiy chiqish (M10) uchun workflow'ni **GitHub'da yurgizish** kerak — bu push va repo ochish (tashqi harakat), avtopilotda ruxsat so'ralmagan. Shuning uchun MD yozilmadi: maket bilan yozilgan dars «haqiqiy dars» bo'lmaydi.
**Taklif:** ruxsat bersangiz — `kirishnomi4-wq` hisobida **shaxsiy (private) sinov reposi**, 5–6 ta push: (1) to'g'ri `ci.yml` → yashil; (2) checkout'siz → qizil; (3) `npm ci` (o'quvchi reposi) → qizil; (4) test buzilgan → qizil; (5) YAML xatosi → run boshlanmaydi; (6) qadamlar tartibi xato. Har run logi `gh run view --log` bilan olinadi. Keyin CI/CD-1 dagi ⚠ joylar ham haqiqiy log bilan almashtiriladi.

**O'quvchi darsi:** **m4c-03** «GitHub Actions — yo'l xaritasini yozish» (`src/4c-Modull/GithubActionsLesson.jsx`, 23 ekran). Tushunchalar: `.github/workflows/ci.yml` · `name/on/jobs/runs-on/steps` · `uses` (tayyor amal: `actions/checkout@v4`, `actions/setup-node@v4`) va `run` · tartib checkout → setup-node → install → test (DragDrop) · lenta mashinasi (toza muhit) · `matrix` · lenta jurnali (log) · amaliyot: o'z repoga `ci.yml` · «Repongiz yo'qmi?» — brauzerda `ci-mashq` reposi (`package.json` + `ci.yml`) · uyga vazifa: yashil → qizil → yashil, uchala run linki.
**Oldin:** CI/CD-1. **Keyin:** Telegraf+PG (kurs jadvali §4).

## Lokal topilmalar (haqiqiy, `cicd2-out/`)
1. **«Repongiz yo'qmi?» namunasi** (`"test": "echo ok && exit 0"`, lock fayl yo'q): `npm install` — ishlaydi, `npm test` — `ok`, kod 0 (`03`).
2. Shu repoda **`npm ci` yiqiladi**: `The npm ci command can only install with an existing package-lock.json` (`02`). GitHub'ning tayyor Node.js andozasi aynan `npm ci` ishlatadi (`cicd1-out/12`) → o'quvchi andozani bossa, lenta qizil.
3. **Uyga vazifadagi «ataylab testni buzing»** bu namunada imkonsiz: test doim `exit 0`. Buzish uchun skriptni `echo xato && exit 1` ga o'zgartirish kerak (`04`: kod 1). O'quvchi o'z test loyihasida (Jest) qilsa — muammo yo'q.
4. O'quvchi darsida `@v4`; hozirgi so'nggi — checkout v7.0.1, setup-node v7.1.0 (`cicd1-out/12`); GitHub'ning o'z andozasi hali `@v4` (`cicd1-out/12`) — v4 ishlashi Actions'da sinalishi kerak.
5. CI/CD-1 bilan chegara: CI/CD-1 — «nima va nega» + o'quvchi reposi lentadan qo'lda; bu dars — Actions oynasi, log o'qish, `uses`, tartib, `matrix`.

## Reja (bloker hal bo'lgach)
1. **Biladi:** Actions oynasida run → job → step; logdan qizil qadam va sababni topish; `uses` va `run`; tartib nega shunday; `matrix` (bir nechta Node versiyasi).
2. **Qo'li bilan (3–4 amaliyot):** o'z repoda lenta → yashil; checkout'ni olib → qizil, log; testni buzish → qizil, log; (ixtiyoriy) `matrix: node-version: [20, 22]`.
3. **Buzamiz:** checkout yo'q · `npm ci` · tartib xato (test install'dan oldin) · YAML xatosi (run umuman boshlanmaydi) · `echo ok` testi hech qachon qizil bo'lmaydi.
4. **Ko'prik:** m4c-03 xaritasi · o'quvchi tili (yo'l xaritasi, lenta jurnali, tayyor amal) · «Repongiz yo'qmi?» yo'lidagi tuzoqlar.
5. **Hajm (taxmin):** ~24 ekran · ~1 soat.

## Ochiq savollar
- **Q1** — sinov reposi ruxsati (yuqorida).
- **Q2** — o'quvchi darsiga alohida ish (tegilmadi): «Repongiz yo'qmi?» namunasida test doim yashil — uyga vazifaning «qizil run» qadami uchun skriptni o'zgartirish yo'lini aytish kerakmi?
