# AVTOPILOT · CI/CD-2 «GitHub Actions» · 01.11 11:05 → 17:00 (foydalanuvchi bozorda)

> **01.11 20:08 — YAKUNLANDI (foydalanuvchi bilan birga, 17:53 dan):** `workflow` huquqi olindi (18:19) → 28 GitHub Actions tajribasi (`cicd2-out/06-actions-xulosa.md`) → CI/CD-1 C1–C13 tuzatildi (tasdiq) → MD v1 → dars qurildi → ko'rik https://claude.ai/artifact/5PbVbhMFUnaL534efvcBtZ → [GATE M] kutilmoqda. Pastdagi 16:55 hisoboti — tarix.

> Foydalanuvchi: «17:00 gacha avtopilotda ishlaysan … vaziyatdan kelib chiqib halol hal qilib davom ettir, har 20 minut».
> Cron 5c07636d: har soatning :07, :27, :47 da (11–16).

## YAKUNIY HISOBOT (01.11 16:55)
**Natija: GitHub Actions'da birorta ham run qilinmadi.** Sabab — `gh` tokenida `workflow` huquqi yo'q (`gist, read:org, repo`); GitHub `.github/workflows/` faylini bunday token bilan push qilishni rad etadi (11:04). Ikki marta device-kod olindi (45B2-F4ED, E1B3-697D) — ikkalasi tasdiqlanmay muddati o'tdi; foydalanuvchi bozorda bo'lgani uchun keyin yangi kod yasalmadi. Kuzatuvchi 11:51–16:55 har daqiqada tekshirdi — huquq kelmadi.
**Run'siz tayyorlandi (taxmin bilan biror Actions da'vosi yozilmadi):**
- `manba/drive-cicd2-actions.sh` — 6 qism, ~27 run (o'quvchi reposi yashil→qizil→yashil, `npm ci`, tartib xato, `@v4`; `ci-mashq` namunasi; YAML xatolari + `my-laptop`; matrix; cache; secrets), har run → `cicd2-out/NN-*.txt` + `runlar.tsv`.
- `manba/cicd2-xulosa.py` — run fayllaridan qisqa xulosa.
- `manba/cicd2-yml/` + `cicd2-out/05` — o'quvchi darsidagi 6 `ci.yml` rasmiy tahlilchida; topilma: `run: echo "Kalit: …"` → `Nested mappings are not allowed in compact mappings`.
- `manba/cicd2-oquvchi-xarita.md` — m4c-03 23 ekran va qaysi run nimani tekshiradi.
- `dev/cicd2-matn.py` (generator) · `src/mentor-kurs/cicd2/parts/04-yordam.jsx` (ActionsList/ActionsRun — haqiqiy run ma'lumotidan; hali yig'ilmagan, esbuild sinalmagan).
- `24-CICD2-mentor-v1.md` **v0 QORALAMA** — pasport, tayanch, 25 ekran rejasi, 21 va 23-ekran; qolgani ⏳.
- CI/CD-1 tekshiriladigan 13 joy (C1–C13) — pastda; CI/CD-1 ga **tegilmadi** (o'zgartirish run'dan keyin).
**Qaytganingizda — 1 buyruq:** `! gh auth refresh -h github.com -s workflow` (brauzerda kod → Authorize). Keyin: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd2-actions.sh nest` (va mashq, yaml, matrix, cache, secret) → xulosa → CI/CD-1 C1–C13 → MD v1 → qurish → ko'rik → [GATE M].
**Tegilmadi:** parts/01–02, Nest-1/Nest-2, CI/CD-1, o'quvchi darslari (`git diff` bo'sh). Commit/push/LMS — yo'q. Sinov repo bo'sh turibdi (o'chirilmadi). Cron 5c07636d o'chirildi.

## Qarorlar (foydalanuvchi, 11:03)
- Actions oynasi — **GitHub API'dagi haqiqiy run ma'lumotidan maket** («haqiqiy run ma'lumotidan» belgisi); repo private qoladi; skrinshot keyin berilsa almashtiriladi.
- CI/CD-1 — haqiqiy log bo'yicha **MD + qayta qurish** (commit yo'q), har o'zgarish «oldin → keyin» ro'yxati bilan (pastda).

## Holat
- Sinov repo: https://github.com/kirishnomi4-wq/mentor-ci-sinov (private, 10:59 yaratildi).
- **BLOKER (11:04):** push rad etildi — `refusing to allow an OAuth App to create or update workflow .github/workflows/ci.yml without workflow scope`. Token scope: `gist, read:org, repo`. Tuzatish: `gh auth refresh -h github.com -s workflow` (brauzerda tasdiq — faqat foydalanuvchi). 11:05 da urinish to'xtatildi, scope qo'shilmadi.
- Skript tayyor: `manba/drive-cicd2-actions.sh <nest|mashq|yaml|matrix|cache|secret>` → `manba/cicd2-out/NN-*.txt` + `runlar.tsv`.

## Navbat
| # | Ish | Holat |
|---|---|---|
| 1 | Haqiqiy run'lar (scope kerak) | ⏸ bloker |
| 2 | Bloker paytida: o'quvchi m4c-03 to'liq xaritasi (23 ekran), da'volar ro'yxati — qaysi biri run bilan tekshiriladi | ⏳ |
| 3 | Lokal tekshiriladiganlar: `@actions/workflow-parser` bilan matrix/cache/secrets yml (schema), o'quvchi s18 holati | ⏳ |
| 4 | MD 24 skeleti (CI/CD-1 formatida) — Actions'ga bog'liq joylar «⚠ RUN KUTILMOQDA» | ⏳ |
| 5 | Scope bo'lsa: run'lar → CI/CD-1 tekshiruv → MD to'ldirish → qurish → ko'rik → GATE M | — |

## O'quvchi m4c-03 dagi tekshiriladigan da'volar (dastlabki, 11:05)
- s13 `matrix: node: [18, 20, 22]` — `setup-node`ga `${{ matrix.node }}` ulanmagan; uch lenta bir xil Node'da yuradi (run bilan tekshiriladi).
- s14 `actions/cache@v4` + `path: node_modules` — `key:` yo'q (actions/cache uchun majburiy); «5 baravar tezlashdi» — o'lchanadi.
- s16 «kalit jurnalda ham hech qachon ochiq ko'rinmaydi» — `***` niqobi; bo'laklab chiqarilsa? (run bilan).
- s18 «Qizil chiroq yondi», jurnalda hammasi ✓, test qadami yo'q — haqiqiy Actions'da test qadami yo'q run **yashil** bo'ladi (run bilan tasdiqlanadi).
- amaliyot «Repongiz yo'qmi?»: `echo ok && exit 0` — uyga vazifadagi qizil run imkonsiz (PRD Q2).

## MD 24 reja (qoralama, 11:15 — run natijalari bilan aniqlanadi)
CI/CD-1 da bor (takrorlanmaydi, faqat ko'prik): CI/CD tushunchasi, toza papka + chiqish kodi, `ci.yml` uch qismi, checkout keragi, tavsiya fayl, lint 46, YAML tahlilchi xabarlari, Delivery/Deployment.
CI/CD-2 — **Actions'ning o'zi**: oyna, log o'qish, `uses` ichida nima bo'ladi, tartib, o'quvchi darsidagi matrix/cache/secrets haqiqati, m4c-03 ko'prigi.
| # | Ekran | Tur | Bosqich | Run |
|---|---|---|---|---|
| 1 | Kirish | Lesson | — | 20 |
| 2 | Actions oynasi: run ro'yxati (commit, tarmoq, vaqt, rang) | Lesson | 1 · Actions oynasi | 20–26 |
| 3 | Run → job → step; GitHub qo'shadigan qadamlar (Set up job, Post…, Complete job) | Lesson | 1 | 20 |
| 4 | `uses` ichida: checkout va setup-node logi nima deydi | Lesson | 1 | 20 |
| 5 | Tekshiruv 1 | MCRetry | 1 | |
| 6 | Amaliyot 1 — birinchi yashil run va logni ochish | Practice | 1 | 20 / 10 |
| 7 | Qizil run: logdan qadam va sababni topish (Expected/Received, annotatsiya) | Lesson | 2 · qizilni o'qish | 21 |
| 8 | Tuzatish va yashil — tarixda uchta run | Lesson | 2 | 22 |
| 9 | Install xatolari: `npm ci` (lock eskirgan / lock yo'q) | Lesson | 2 | 23, 11 |
| 10 | Checkout'siz va tartib xato | Lesson | 2 | 13, 24 |
| 11 | Tekshiruv 2 (LineCheck) | LineCheck | 2 | |
| 12 | Amaliyot 2 — qizil → yashil, log satri isbot | Practice | 2 | 21–22 |
| 13 | YAML xatosi: run boshlanmaydi — Actions nima ko'rsatadi | Lesson | 3 · fayl xatolari | 30–32, 34 |
| 14 | `runs-on: my-laptop` — run kutib qoladi | Lesson | 3 | 33 |
| 15 | Tekshiruv 3 | MCRetry | 3 | |
| 16 | matrix: o'quvchi darsidagi va to'g'risi | Lesson | 4 · o'quvchi darsidagi qo'shimchalar | 40–41 |
| 17 | cache: `key` yo'q va haqiqiy vaqt | Lesson | 4 | 50–53 |
| 18 | secrets: logda `***` | Lesson | 4 | 61 |
| 19 | Amaliyot 3 — matrix ulash | Practice | 4 | 41 |
| 20 | Tekshiruv 4 | MCRetry | 4 | |
| 21 | m4c-03 xaritasi | Lesson | 5 · ko'prik | — |
| 22 | s17/s18 va «Repongiz yo'qmi?» — simulyatsiya ↔ haqiqat | Lesson | 5 | 10–17 |
| 23 | O'quvchi tili va sinfdagi holatlar | Lesson | 5 | |
| 24 | O'z-sinov 8 | Screen27 | — | |
| 25 | Yakun (uyga vazifa: matrix + qizil/yashil, link) | Screen28 | — | |

## CI/CD-1 — run bilan tekshiriladigan joylar (11:52 ro'yxat; «keyin» ustuni run'dan keyin to'ldiriladi)
| # | Joy (MD satri · kod) | Hozir (oldin) | Qaysi run tekshiradi | Keyin |
|---|---|---|---|---|
| C1 | MD 18 pasport «Actions'ning o'zi yurgizilmagan» | ⚠ | hammasi | |
| C2 | MD 114 · 4-ekran `ubuntu-latest` = Ubuntu 24.04, Node 22.23.4 «⚠ hujjat» | hujjatdan | `20` «Set up job» logi (Runner Image) | |
| C3 | MD 251 · 11-ekran ovozi «GitHub'da o'zimiz sinamadik» · `06-s10-s19.jsx:82` teg | lokal bo'sh papka | `13` (checkout'siz) | |
| C4 | MD 279 · 12-ekran «to'rtinchisini sinamadik» · `06:101` «@v4 (sinalmagan)» | ⚠ | `10`, `25` | |
| C5 | MD 324 · 14-amaliyot 3-qadam «⚠ yashil belgi (hujjat bo'yicha)» · `06:128` | ⚠ | `20` | |
| C6 | MD 326 · 14-amaliyot isbot `/Tests:\s+\d+ passed,\s+\d+ total/` — Actions logida shu satr bormi | lokal Jest | `20` log | |
| C7 | MD 354 · 16-ekran Actions maketi — qadam nomlari `Run actions/checkout@v7` … `Run npm run build` ○ · `06:196` | maket ⚠ | `21` jobs/steps API | |
| C8 | MD 379 · 17-ekran «⚠ Actions oynasida matn biroz boshqacha bo'lishi mumkin» · `06:218` | tahlilchi | `30`–`32` | |
| C9 | MD 406, 408 · 19-amaliyot «⚠ Actions'da qizil / yashil» · `06:243, 245` | ⚠ | `21`, `22` | |
| C10 | MD 515–517 · uyga vazifa «⚠ yashil / qizil» | ⚠ | `20`–`22` | |
| C11 | MD 472, 487 · «Actions bo'sh — papka nomi» | fikr | (sinalmaydi — ⚠ qoladi yoki alohida run) | |
| C12 | MD 532, 537, 539 — «Ochiq savollar 1», o'quvchi darslari 1, 3 | ⚠ | `13`, `10`, `25` | |
| C13 | `04-yordam.jsx:143` `ActionsMaket` «⚠ rasmiy hujjatdan, sinalmagan» → CI/CD-2 dagi `ActionsRun` (haqiqiy run ma'lumoti) | maket | `21` | |

## CI/CD-1 o'zgarishlari (oldin → keyin)
(hali yo'q — run'lar kutilmoqda)

## Jurnal
- 11:05 — avtopilot boshlandi; bloker: workflow scope; cron 5c07636d.
- 11:08 — foydalanuvchi rejani tasdiqladi («sifat muhim»); device flow fonda (`gh auth refresh -s workflow`, kod 45B2-F4ED, ~11:24 gacha) — foydalanuvchi tasdig'i kutilmoqda.
- 11:12 — `cicd2-yml/` 6 variant rasmiy tahlilchida (`cicd2-out/05`): matrix/cache (keysiz) schema bo'yicha xatosiz — xato faqat run'da chiqadi; **topilma:** `run: echo "Kalit: …"` — qo'shtirnoqsiz qatorda «: » → `Nested mappings are not allowed in compact mappings` (skriptda `run: |` ga o'tkazildi; GitHub'dagi xabari `34` da sinaladi).
- 11:14 — skriptga s17 begona qatorlari (`16` print('test'), `17` git push) qo'shildi; `manba/cicd2-oquvchi-xarita.md` — m4c-03 23 ekran xaritasi + qaysi run nimani tekshiradi.
- 11:15 — cron uyg'onishi: scope hali yo'q (device flow kutyapti); MD 24 ekran rejasi (qoralama) yozildi.
- 11:29 — 1-kod muddati o'tdi (context deadline exceeded); yangi kod E1B3-697D (~11:43 gacha), push-bildirishnoma yuborilmadi (terminal faol). Fon kuzatuvchi: scope paydo bo'lsa nest→mashq→yaml→matrix→cache→secret avtomatik (log scratchpad/runlar.log). Skript: eski lokal main bilan orphan xatosi va jim push xatosi tuzatildi.
- 11:31 — scope hali yo'q (kod E1B3-697D kutilmoqda). Run'dan mustaqil: `src/mentor-kurs/cicd2/parts/04-yordam.jsx` (CI/CD-1 yordamchilari nusxasi + ActionsList/ActionsRun — API ma'lumotidan Actions oynasi, CSS c2-gh); ActionsMaket olib tashlandi.
- 11:50 — 2-kod ham muddati o'tdi (11:43); yangi kod yasalmadi (foydalanuvchi yo'q). Uzoq kuzatuvchi `scratchpad/kut-va-yurgiz.sh` (16:55 gacha, har 60 s) — scope paydo bo'lsa 6 qism avtomatik. `dev/cicd2-matn.py` generator; CI/CD-1 tekshiriladigan 13 joy (C1–C13) ro'yxati.
- 11:51 — `manba/cicd2-xulosa.py` (run fayllaridan qisqa xulosa); MD `24-CICD2-mentor-v1.md` v0 QORALAMA: pasport, tayanch (lokal faktlar 00–05), 25 ekran rejasi, 21 va 23-ekran (run'siz qism); 1–20, 22, 24, 25 — ⏳ run'dan keyin (taxmin yozilmadi). lint:til 0 error (1 warn — xizmat qatori), lint:prompt 0. Keyingi: scope kutiladi; run'siz qolgan ish yo'q darajada — har cron'da holat tekshiruvi.
- 11:52 — cron: scope yo'q, kuzatuvchi ishlayapti; yangi ish yo'q.
- 12:10 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 12:30 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 12:50 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 13:10 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 13:30 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 13:50 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 14:10 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 14:30 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 14:50 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 15:10 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 15:30 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 15:50 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 16:10 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 16:30 — cron: scope yo'q, kuzatuvchi ishlayapti.
- 16:55 — kuzatuvchi 16:55 da to'xtadi (scope kelmadi); YAKUNIY HISOBOT yozildi (fayl tepasida); cron o'chirildi.
