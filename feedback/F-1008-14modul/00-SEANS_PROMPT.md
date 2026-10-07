# 14-Modul seansi uchun prompt — TUNGI AVTOPILOT (08.10.2026)

> Tayyorladi: 12-Modul seansi (55e53e99), 13-Modul prompti (`feedback/F-1007-13modul/00-SEANS_PROMPT.md`) naqshida + 12-Modulni yopish saboqlari.
> **F-1008-550** — foydalanuvchi buyrug'i (08.10, ~01:30): «14-Modul MD larini avtopilotda tuzdiraylik, men ertalabgacha uxlayman; to'liq, aniq, halol prompt; har 15 daqiqada cron tekshiruvi».
> Foydalanuvchi javoblari (shu buyruqda, qaror savollariga): **agentlar 3 + 10** · **qaror savollari — tavsiya bilan davom, «TAXMIN» belgisi bilan** · **commit — lokal, push yo'q** · **uyqu bloki + 12-Modul seansidan mustaqil nazorat**.

> ⚠️ **08.10 02:30 holati:** yangi seans ochilmadi (foydalanuvchi uxlab qoldi) — avtopilotni **12-Modul seansi (internetlesson-6d, 55e53e99) o'zi bajarmoqda**, shu prompt bo'yicha.
> Agar siz yangi seans bo'lsangiz va `JURNAL.md` da shu yozuv bo'lsa — **hech narsa yozmang/tahrirlamang**, faqat foydalanuvchiga «avtopilot boshqa seansda ishlayapti» deng.

## Yangi seansga nusxalanadigan qisqa matn
```
14-Modul (LMS) tungi avtopilot: feedback/F-1008-14modul/00-SEANS_PROMPT.md ni TO'LIQ o'qing va aynan bajaring.
Foydalanuvchi uxlayapti — savol bermaysiz; qarorlar promptda. Birinchi ish: jurnal + xotira yozuvi, keyin 15 daqiqalik cron (6-bo'lim), keyin 0-bosqich.
```

---

## 1. Siz kimsiz va nima qilasiz
LMS **14-Modul «Bitiruvchi + performance»** (dastur v9: «14-modul · BITIRUVCHI (Выпускник) + PERFORMANCE», 15.5–16.5-oy, kurs yakuni) uchun **MD v3 bosqichini** konveyer bo'yicha noldan qilasiz:
manba → qaror sahifasi → nomlar → tayanch + taqiqlar → 3 pilot MD → o'z auditi → 10 MD → o'zaro tekshiruv → GATE M sahifasi → ertalabgi hisobot.
**«Qur» (dars `.jsx`) — YO'Q.** GATE M ni foydalanuvchi ertalab tasdiqlaydi; ChatGPT auditi ham ertalab. Siz MD larni audit uchun tayyor holga keltirasiz.

Raqamlash (kod = LMS − 2): kod papkasi `src/12-Modull` (bu bosqichda yaratilmaydi) · App.jsx `id: '12'` bloki · kalit `m12-NN` · saqlash `pm-m12dN-…` · papka **`feedback/F-1008-14modul/`** · F-ID **F-1008-NN, NN 550 dan** (13-Modul 450–549) · dev server kerak bo'lsa port **5176** (5173 AILM · 5174 12-Modul · 5175 13-Modul · 5300 11-Modul — band).

## 2. Dastur — 17 qator (manba; `CoddyCamp_Senior_2026_v9_14modul .html`, python3 bilan matnga — 0-YANGI-MODUL 3-bo'lim)
Maqsad: investorlar hakamlar hay'ati oldida final himoya; mahsulot texnik jihatdan «yarqiraydi». Texnik cho'qqi: performance + polish + agent bilan demo-test. TEX 3 · AI-PRAKT 1 · PM+PRAKT 1 · PM 9 · Demo Day 1 + marosim · Rezerv 1 = 17.
| № | Tip | Mavzu (ru) | Mazmun | Natija |
|---|---|---|---|---|
| 1 | PM | Структура питча инвестору | Muammo → Bozor → Yechim → Metrikalar → Jamoa → Keyin; YC Demo Day tahlili | Pitchning birinchi chernoviki |
| 2 | PM | Storytelling: история продукта | 5 daqiqa pitch — hikoya, ficha ro'yxati emas | O'zini videoga yozadi |
| 3 | TEX | Performance: скорость продукта (CHO'QQI) | Lighthouse, lazy load, bundle hajmi | Mahsulot tezroq: oldin/keyin o'lchov |
| 4 | AI-PRAKT | Финальный polish: анимации демо | Demo uchun mikro-o'zaro ta'sirlar (9-Modul mahorati maksimumda) | Mahsulot demoda «yarqiraydi» |
| 5 | PM | Питч-тренинг 1 | Guruh oldida pitch — qattiq fidbek | Tuzatishlar ro'yxati |
| 6 | TEX | Подготовка демо продукта | Stresssiz jonli ko'rsatish; texnik risklar, B reja; feature freeze | Repetitsiya qilingan demo |
| 7 | PM+PRAKT | Демо-тест: продукт глазами инвестора | GIBRID: demo-risklar chek-listi → agent bilan progon: o'quvchi buzadi (tarmoq uzilishi, bo'sh data, ikki klik), agent tuzatadi | Demo 3 progonni xatosiz o'taydi + B reja ishlaydi |
| 8 | PM | Питч-тренинг 2 (финальный) | Tuzatishlar + taymer bilan final repetitsiya | Final pitch tayyor |
| 9 | TEX | Видео-портфолио | O'zi va mahsuloti haqida 3 daqiqalik video (frilans/stajirovka uchun) | Tayyor video-portfolio |
| 10 | PM | Что дальше: фриланс и стажировка | Birinchi buyurtma (Upwork, lokal bozor) + kompaniyaga xat, suhbat | Birinchi buyurtma rejasi + 2 kompaniyaga xat |
| 11 | PM | Международные программы | Y Combinator, Diamond Challenge, lokal grantlar | 1 dastur + boshlangan ariza |
| 12 | PM | Финальная 1-на-1 с ментором | Keyingi 6 oyga shaxsiy reja | Yozma reja |
| 13 | PM | Генеральная репетиция | Real hakamlar oldidan to'liq progon | — |
| 14 | REZERV | Подготовка зала | Tashkiliy dars | — |
| 15 | PM | Встреча выпускников | O'tgan bitiruvchilar bilan networking | — |
| 16 | DEMO | Demo Day 8 — Bitiruv himoyasi | Hakamlar: 5–7 investor va tadbirkor | 5 daqiqa pitch + Q&A |
| 17 | MAROSIM | Выпускной — Bitiruv marosimi | Sertifikatlar, video-portfolio, g'oliblar | — |
**MD yoziladigan darslar — 1–13 (13 ta). 14, 15, 16, 17 — App.jsx da `comp` siz qator** (11-Modul «Demo Day 7», 13-Modul «Zaxira dars» naqshi) — foydalanuvchi shunday tasdiqladi.
15 «Встреча выпускников» — bu kursning birinchi oqimi, o'tgan bitiruvchi yo'q: qaror sahifasida halol savol (tavsiya: `comp` siz tadbir qatori, mazmuni tashkilotchi bilan; dars qurilmaydi).

## 3. Boshlashdan oldin o'qing (bir marta, shu tartibda; faqat o'qish)
1) `konveyer/0-YANGI-MODUL.md` (9-Modul uchun yozilgan: 7 → 12, m7 → m12, F-1005-9modul → F-1008-14modul deb o'qing) · `konveyer/README.md` · `konveyer/1-MD.md` (MD v3 formati, GATE M ro'yxati, «Filtr») · `konveyer/QURISH_KARTASI.md` · `src/qolip/QOLIP.md`.
2) `MATN_KORPUS.md` 1–720-qatorlar (taqlid-manba) · `QOIDALAR.md` (T-, P-, S-, PM- ID lar) · `PM_Prompt_v8.md` (keyslar faqat K1–K19, PM-016).
3) **13-Modul — bevosita poydevor** (`feedback/F-1007-13modul/`; u seans hali ishlayapti — faqat o'qing, hech narsa yozmang): 00-MODUL-TAYANCH.md (misol-ip, Mentor sonlari, atamalar, ruscha lug'at, kalitlar, oldindan tuzatiladigan sinflar) ·
   GATE_M_JAVOB.md · 00-NOMLAR.md · 00-TAQIQLAR.md · MD_AGENT_TOPSHIRIQ.md · MD_TOPSHIRIQ_2.md · 01…09-FILTR.md (10–12 tunda yozilmoqda — tayanch tugagach bor bo'lsa o'qing) · 11-PmReflection-v3.md · 12-StabilizeDay-v3.md ·
   `vositalar/` (mdtekshir.py, qisqa.py, rulugat.py, filtr-sinflar.md — nusxalab o'z `vositalar/` papkangizda ishlating, asl fayllarga tegmang). Qaysi holatini o'qiganingizni jurnalga yozing (`git log -1 --format=%h -- feedback/F-1007-13modul` va fayl mtime).
4) 12-Modul (yopilgan): `feedback/F-1006-12modul/` 00-MODUL-TAYANCH.md (1.13 Mentor sonlari 20 → 38 → 44), 01…12-FILTR.md, QURUVCHI_SABOQ.md (E 40–55 — foydalanuvchi didi), 12-PmGrowthPitch-v3.md va `YAKUNIY/12-PmGrowthPitch.md` (metrikali pitch, 5 daqiqa, besh bo'lak — 14-Modul pitch darslari shundan davom etadi, takrorlamasdan), 11-PmPitchReview-v3.md (yakkama-yakka).
5) 11-Modul: `feedback/F-1005-11modul/16-PmPrototypePitch-v3.md` (Demo Day 7 pitchi), 15-PmOneOnOne-v3.md (yakkama-yakka), `QURUVCHI_TOPSHIRIQ_3.md` (ruscha lug'at qanday o'lchanadi).
6) 9-Modul animatsiya darslari (4-dars «polish» shulardan): `feedback/F-1005-9modul/` dagi animatsiya MD lari (grep: animatsiya, mikro, Framer, transition) — atama va daraja (takror emas, «maksimum»).
7) Xotira (memory/): qatiy-keyingi-harakat-kartochka · pm-vizual-brend-maket · agentlar-faqat-ruxsat-bilan · tashqi-audit-filtr · qaror-vizual-artifact · sinonim-taqiq-bir-mano-bir-soz · konveyer-yagona-yol · personaj-rol-taqiq · auditoriya-toshkent-osmiri · seans-13modul-2026-10-07.

## 4. Chegara (bir necha seans parallel ishlayapti — 13-Modul seansi ham tunda ishlaydi va App.jsx dagi `id: '11'` blokini tahrirlaydi)
- O'zgartirasiz FAQAT: `feedback/F-1008-14modul/*` · App.jsx dagi o'z bloklaringiz (`// ---- 12-Modul` izoh qatori va `id: '12'` modul bloki, `id: '11'` blokidan keyin — `comp` siz qatorlar, 13-Modul e3d665b naqshi).
  App.jsx: har tahrirdan OLDIN qayta o'qing, faqat aniq Edit (Write yo'q), boshqa bloklarga tegmang, tahrirdan keyin `npx esbuild ./src/App.jsx --loader:.jsx=jsx --log-level=error > /dev/null` va `npm run -s lint:jsx`.
- Tegmaysiz: `src/*` (App.jsx dagi o'z blokingizdan tashqari) · `konveyer/*` · `src/qolip` · `src/skelet` · `scripts` · `lint-*` · `tools` · `package.json` · qonun fayllari (QOIDALAR, DARS_ETALON, PM_DARS_ETALON, MATN_KORPUS, MATN_ETALONI, PM_Prompt_v8, RU_I18N_SPEC, til-lint-rules.json) · CLAUDE.md · KATTA_TOZALASH.md · boshqa modullar papkalari · `maydon-jamoa` repo'si · boshqa seanslarning repo ildizidagi vaqtinchalik fayllari.
- Mexanizmga o'zgarish kerak bo'lsa — jurnalingizdagi **«MEXANIZM-TAKLIF»** bo'limiga (nima · nega · qaysi fayl); o'zingiz tegmaysiz.
- Vaqtinchalik fayllar — faqat o'z scratchpad'ingizda. Repo ildiziga yozsangiz (playwright moduli uchun) — `_m12*.tmp.mjs` nomi bilan va ishdan keyin o'chiring.

## 5. Birinchi ishlar (shu tartibda)
1) `feedback/F-1008-14modul/JURNAL.md` — chegara, holat jadvali (bosqichlar 0–6), «Keyingi qadam», «Yozuvlar», «TAXMINLAR», «MEXANIZM-TAKLIF». Vaqt faqat `date` bilan.
   Xotira: `memory/seans-14modul-2026-10-08.md` (frontmatter: name, description, metadata.type: project) + `MEMORY.md` da BITTA qator. Har bosqich oxirida ikkalasini yangilang — noutbuk o'chsa, keyingi seans faqat shulardan davom etadi.
2) Cron (6-bo'lim) — darhol, bir marta.
3) 0-bosqich.

## 6. Avtopilot tsikli va 15 daqiqalik cron
`CronCreate` — `cron: "7,22,37,52 * * * *"`, `recurring: true`, prompt aynan quyidagi matn (cron faqat seans bo'sh turganda ishga tushadi — ish paytida navbatda kutadi):
```
[14-Modul avtopilot · 15 daqiqalik tekshiruv] feedback/F-1008-14modul/00-SEANS_PROMPT.md 6-bo'lim bo'yicha:
1) `date`; JURNAL «Keyingi qadam» va oxirgi yozuvni o'qing.
2) Ishlayotgan agentlar bormi? Har biri uchun: natija fayli bormi, mtime va hajmi. «Osilgan» deb faqat ikki ketma-ket tekshiruvda hech narsa o'zgarmasa va agent tugamagan bo'lsa yozing (bitta signal bilan emas); u holda jurnalga yozing va o'sha MD ni o'zingiz yozishni rejalashtiring.
3) Tugagan har natijani O'ZINGIZ tekshiring (agent hisobotiga tayanmasdan): `npm run -s lint:til -- <md>` 0 error · `## N ·` sarlavhalar soni reja jadvalidagi ekranlar soniga teng · arena ✔ 3/3/3/3 (qisqa.py) · «Keyingi dars» nomi 00-NOMLAR bilan aynan · taqiqlar grep 0 · TAXMIN belgilari joyida.
4) Hech narsa ishlamayotgan va keyingi qadam bo'lsa — darhol davom eting (to'xtab turmang). Bloklangan bo'lsa — sababini jurnalga yozing va boshqa mustaqil ishga o'ting.
5) JURNAL «Nazorat» bo'limiga bitta qator: vaqt · bosqich · nima tekshirildi · natija.
6) Hammasi tugagan bo'lsa (7-bo'lim, 6-bosqich) — ertalabgi hisobot yozilganini tekshiring, CronList → shu cron'ni CronDelete qiling va to'xtang.
Hech narsani tekshirmasdan «tayyor» demang.
```
Bosqichlar orasida to'xtamaysiz (foydalanuvchi uxlayapti) — lekin har bosqich oxirida: o'z tekshiruvi → jurnal yozuvi (F-ID bilan) → xotira qatori → **lokal commit** (8-bo'lim). Keyin keyingi bosqich.
12-Modul seansi (55e53e99) sizni mustaqil kuzatadi: har 15 daqiqada jurnalingiz va fayllaringizni o'zi tekshiradi; muammo topsa sizga xabar yuboradi — xabarni tekshiring, rost bo'lsa tuzating, jurnalga yozing.

## 7. Bosqichlar
**0 · Manba (agentsiz)** → `00-MANBA.md`: 17 qator (2-bo'lim) · 13-Modul oxiri (12, 13-qator va YAKUNIY/holat) · o'tilgan atamalar grep (9–13-Modul MD/tayanch/YAKUNIY, src/):
pitch, investor, hakam, metrika, MAU, storytelling, Lighthouse, lazy load, bundle, kesh, performance, polish, animatsiya, mikro-o'zaro ta'sir, feature freeze, B reja, demo, progon/repetitsiya, video, portfolio, frilans, stajirovka, rezyume, Upwork, Y Combinator, grant, mentor, roadmap — qaysi modulda, qaysi so'z bilan (uz va ru).
Tashqi faktlar (rasmiy hujjat, sana bilan; tekshira olmasangiz — «tekshirilmadi», taxmin YO'Q, P-028): Lighthouse (Chrome DevTools) o'lchovlari va nomlari · Vite/Expo bundle o'lchash · **Upwork yosh chegarasi** (o'smir akkaunt ocha oladimi) ·
**Y Combinator va Diamond Challenge** — kim qatnasha oladi (yosh, maktab o'quvchisi), muddatlar · O'zbekistondagi yoshlar grantlari/tanlovlari (faqat rasmiy manba bilan) · video uchun bepul vositalar. Natija tayanchning «Tekshirilgan faktlar» bo'limiga.
**1 · Qaror sahifasi (artifact, javob qatori bilan; `qaror-0.json` → `python3 konveyer/vositalar/gatem/sahifa.py qaror-0.json feedback/F-1008-14modul <scratchpad>/qaror.html` → Artifact — 12 va 13-Modul `qaror-0.json` naqshi; JSON shakli o'sha fayllardan)** — har savolda variantlar, +/−, **tavsiya**. Foydalanuvchi ertalab javob beradi; **siz kechasi tavsiya bilan davom etasiz** va har qarorni jurnalning «TAXMINLAR» bo'limiga yozasiz (T1, T2 …: savol · olingan variant · qaysi MD larga ta'sir qiladi). MD larda shu joy `<!-- TAXMIN Tn -->` bilan belgilanadi (ertalab javob boshqacha bo'lsa — aniq shu joylar tuzatiladi). Savollar kamida:
   misol-ip (Mentor misoli «Maydon Jamoa» final pitchi — 12-Modul 1.13 va 13-Modul sonlari bilan; yangi son to'qilmaydi) · o'quvchi qaysi mahsulot bilan himoya qiladi (o'z final mahsuloti) · repo/teglar (`maydon-jamoa` davomi, `m14-dars-NN-start/-done`) ·
   3-dars performance: web-trek (Lighthouse) va mobil trek (Expo) — ikkalasiga nima o'lchanadi · 9-dars video: o'smirning yuzi/ismi/ovozi — ixtiyoriy, ota-ona roziligi, qayerga joylanadi (ommaviy emas — havola orqali) ·
   10-dars frilans: yosh cheklovi bo'lsa — halol yo'l (ota-ona nazorati, lokal bozor, tanish buyurtmachi), real pul va shartnoma masalasi · 11-dars dasturlar: faqat rasmiy shartlari tekshirilganlari · 12-dars yakkama-yakka — 11-Modul 15 va 12-Modul 11-darsdan farqi ·
   1-dars «YC Demo Day tahlili» — keys banki K1–K19 dan tashqari bo'lsa: bankdagi mos keys yoki Mentor misoli (tavsiya) · 13-dars general repetitsiya va 16-qator Demo Day 8 chegarasi · 15-qator (2-bo'lim) · dars nomlari (→ 00-NOMLAR.md; PM — savol-sarlavha, TEX — mavzu nomi, ≤55 belgi).
**2 · `00-NOMLAR.md` + App.jsx `id: '12'` bloki** (17 qator, hammasi `comp` siz; 4-bo'lim qoidasi bilan).
**3 · `00-MODUL-TAYANCH.md` + `00-TAQIQLAR.md`** (13-Modulnikidan, 14-Modulga moslab): misol-ip va har darsga bitta qatorli reja · atamalar (bir ma'no — bir so'z) · **ruscha lug'at** (har atama oldingi modullardan grep bilan o'lchanadi — 12-Modul `QURUVCHI_TOPSHIRIQ_3.md` jadvali va «1-to'lqin saboqlari» tayyor manba) ·
   repo/teglar · saqlash kalitlari `pm-m12dN-…` · tekshirilgan faktlar (havola + sana) · keyslar · **«Oldindan tuzatiladigan sinflar»** — 12 va 13-Modul FILTR fayllarida bir necha darsda takror Qabul qilinganlar (o'zingiz sanab, sinfga ajratasiz) · to'lqin kelishuvlari.
   + `MD_AGENT_TOPSHIRIQ.md` (13-Modul naqshi): umumiy qoidalar + har dars qatori (tip, ekranlar soni, natija, kalitlar, «Keyingi dars»).
**4 · 1-to'lqin — 3 pilot MD (3 agent, parallel, fon):** 1-dars (PM, pitch tuzilmasi) · 3-dars (TEX, performance — cho'qqi) · 7-dars (PM+PRAKT, demo-test). Har agent bitta MD, faqat o'z fayli, yordamchi fayllar scratchpad `md<NN>/` da. Natija: `NN-<Nom>-v3.md`.
   Ekranlar soni: PM — 13-Modul PM darslari kabi · TEX — 12-Modul 2/5-dars kabi · PM+PRAKT — 12 (nazariya → 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun) · loyiha kuni (AI-PRAKT) — 8 ekran + 3 blok + kartochkalar = 12.
**5 · O'z auditi (ChatGPT o'rniga, agentsiz)** — har pilot uchun `NN-OZ-AUDIT.md`: 1-MD.md GATE M ro'yxati + 12/13-Modul FILTR sinflari + qisqa.py o'lchovlari + taqiqlar + faktlar → har band «Tuzatildi / Oqlandi + sabab».
   Pilotlarda topilgan takror sinflar → tayanch «to'lqin kelishuvlari» va `MD_TOPSHIRIQ_2.md` («pilotlardan saboq»). Keyin **2-to'lqin — 10 agent** (2, 4, 5, 6, 8, 9, 10, 11, 12, 13), parallel; har biriga ham `NN-OZ-AUDIT.md` (o'zingiz).
**6 · O'zaro tekshiruv va GATE M sahifasi:** 13 MD — «Keyingi dars» zanjiri (13 → 14-qator), saqlash kalitlari, atama tartibi, Mentor sonlari bitta jadvaldan, arena ✔ 3/3/3/3, `lint:til` 0 error ×13 ·
   GATE M sahifasi (`python3 konveyer/vositalar/gatem/sahifa.py …` → Artifact; TAXMIN savollari ham shu sahifada) · **`ERTALAB_HISOBOT.md`** (pastda) · jurnal + xotira + commit · cron'ni o'chirish.
**Ertalabgi hisobot** (`feedback/F-1008-14modul/ERTALAB_HISOBOT.md`, qisqa, o'zbekcha): nima tayyor (fayllar ro'yxati) · har MD: ekranlar soni, lint:til, o'z auditida topilgan va tuzatilganlar soni · TAXMINLAR ro'yxati (foydalanuvchi javob beradigan) · tekshirilmagan faktlar · bloklangan joylar · qaror va GATE M sahifalari havolalari · keyingi qadam («audit → Filtr → GATE M → qur»).

## 8. Qoidalar
- **Agentlar:** ruxsat bor — faqat 1-to'lqin 3 ta va 2-to'lqin 10 ta MD agenti (har biri bitta MD). Boshqa agent (auditor, quruvchi) — YO'Q. Agent ishlayotgan faylga tegmaysiz; tuzatish agent tugagach. Agent ikki marta yiqilsa — o'sha MD ni o'zingiz yozasiz va jurnalga.
- **Commit:** har bosqich oxirida lokal commit, **push yo'q**. Faqat o'z papkangiz: `git add feedback/F-1008-14modul && git commit -m "docs(m14): <bosqich> (F-1008-NN)" -- feedback/F-1008-14modul` (boshqa seanslarning fayllari va App.jsx commitga kirmaydi; App.jsx dagi o'z blokingiz ertalab foydalanuvchi buyrug'i bilan). Commit oxirida Co-Authored-By qatori. `index.lock` band bo'lsa — 1 daqiqa kutib, bir marta qayta urinish; bo'lmasa jurnalga yozib davom eting.
- **Halollik:** keyslar faqat K1–K19 · tashqi xizmatlar (Upwork, YC, Diamond Challenge, Lighthouse, Vercel/Netlify, Expo/EAS) imkoniyati, yosh chegarasi, muddati, tugma nomlari — faqat rasmiy hujjatdan, sana bilan; tekshirilmagani «tekshirilmadi» deb yoziladi · Mentor misolining sonlari faqat tayanch jadvalidan · o'ylab topilgan qahramon yo'q, vazifani Mentor beradi · real odamlar (hakamlar, sinfdoshlar, ota-ona) bilan ishda bosim va soxta natija yo'q · o'smirning shaxsiy ma'lumoti (yuz, ism, telefon) — faqat ixtiyoriy, ommaviy joylanmaydi.
- **Til va matn:** matn yozishdan oldin MATN_KORPUS · bir ma'no — bir so'z (uz va ru) · har MD `npm run -s lint:til -- <md>` 0 error · hujjatlar tahrirlangach seans oxirida `npm run -s lint:prompt` 0.
- **Foydalanuvchining qat'iy qonunlari (05.10):** har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi · kartochkalar alohida ekranda (podium → kartochkalar → yakun) · brend/mahsulot nomi o'z rangida, tanish maketda (matnli karta rad) · yakun standart (12-Modul SABOQ E 50, 54: «Bugungi asosiy fikr» yo'q, sarlavha har holatda rost) · agent MD matnini o'zboshimcha o'zgartirmaydi.
- **To'xtash shartlari:** «qur», deploy, push, boshqa modul fayllari, qonun fayllari — bu tunda YO'Q. Muammo hal bo'lmasa — jurnalga «TO'XTADI: sabab» va keyingi mustaqil ishga o'ting; aylanib qolmang (bir xil urinish ikki martadan ko'p emas).
- Javob va hisobot — o'zbekcha, qisqa; darslar LMS raqami bilan («14-Modul 3-darsi»).
