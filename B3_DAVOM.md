# 🔁 B3_DAVOM — 2026-08-17 seans-chekpointi

> ✅ **2026-08-18 YOPILDI:** 5-bo'lim tartibi to'liq bajarildi — PmLesson18 metodist-mikro (3/3) → verifikator PASS ∥ qabulchi PASS 28/28 → STATE yozuvi. **BATCH 3 = 3/3.** Endi ochiq band faqat **GATE 3** (10 dars, foydalanuvchi imzosi) va 4-bo'limdagi qarorlar. Quyidagi 1–4-bo'limlar tarix sifatida qoladi.

> Foydalanuvchi: «Ertaga qilamiz — qayerga kelganimizni bitta MD'da to'liq yoz, PmLesson18 bilan; yangi seansda
> "davom et" deganimda darhol tayyor bo'lsin». Bu fayl shuning uchun. O'qib bo'lgach → 5-bo'limdagi tartibni bajaring.

---

## 1. BUGUN NIMA BO'LDI (2026-08-17, bitta seans, avtokontrol ruxsati bilan)

### 1.1 BATCH 2 — 3 dars TO'LIQ YOPILDI (qabulchi PASS 28/28)
| Dars | Fayl | Verifikator | Qabulchi | Skrinshotlar (scratchpad, seans-mahalliy — yo'qolgan bo'lishi mumkin) |
|---|---|---|---|---|
| M4-D12 «Ilova nimani yozib qoladi?» | `src/4-Modull/PmLesson13.jsx` (3779 q, `pm-m4d12-v1`) | PASS 16/16 | **28/28** | 73 ta |
| M4-D15 «"Qanday ishlaydi?" deb so'rashsa» | `src/4-Modull/PmLesson14.jsx` (3711 q, `pm-m4d15-v1`) | PASS 15/15 | **28/28** | 30 ta |
| M4a-D2 «Hamma birdan kirsa, sayt chidaydimi?» | `src/4a-Modull/PmLesson15.jsx` (3840 q, `pm-m4a2-v1`) | PASS | **28/28** | 64 ta |

M4 moduli PM darslari to'liq (D2/D7/D12/D15), M4a ochildi.

### 1.2 BATCH 3 — senariylar avto-GATE S, 2/3 dars YOPILDI, 1 dars oxirgi bosqichda
| Dars | Fayl | Holat |
|---|---|---|
| M4c-D2 «Hammasini birdan chiqaraymi — yoki har hafta bo'lak?» | `src/4c-Modull/PmLesson17.jsx` (4008 q, `pm-m4c2-v1`) | verifikator PASS · **qabulchi 28/28** ✅ |
| M4b-D2 «Bitta xato — nechta odam ketadi?» | `src/4b-Modull/PmLesson16.jsx` (3951 q, `pm-m4b2-v1`) | verifikator PASS · **qabulchi 28/28** ✅ |
| **M4c-D6 «Saytingiz hozir ochilyaptimi?»** | `src/4c-Modull/PmLesson18.jsx` (~3990 q, `pm-m4c6-v1`) | 🔧 **TUGALLANMAGAN — 2-bo'limga qarang** |

Senariylar (`pm-senariylar/`): `M4b-D2-Sifat.md` · `M4c-D2-Tezlik.md` · `M4c-D6-Monitoring.md` — uchalasi 13-A korrektura + AVTO-GATE S bo'limi bilan yopiq.

### 1.3 Muhrlangan umumiy fayllar (repo ichida, saqlangan)
- `MATN_KORPUS.md` **§126–133** (F-0817-01…06) — bugungi 6 dars raundlaridan chiqqan sinflar.
- `PM_KEYS_MEXANIKA_REGISTRI.md` — Batch 3 mexanika-muhrlari (RELIZ-TASMASI/darvoza · SIFAT-TAROZI/NOSOZLIK-NAVBATI · O'LCHAGICH-PANELI/signal-saralash), artefakt-zanjir (`pm-m4b2-sifat` · `pm-m4c2-reliz {bolaklar:[{hafta,ish}×3]}` → `pm-m4c6-signal`), Batch 3 avto-GATE S yozuvi, zanjir-olam izohi.
- `src/App.jsx` — 6 karta yangilandi (m4-12, m4-15, m4a-02, m4b-02, m4c-02, m4c-06) + R3-8 supurgisi (m5-11, m6-12); esbuild ✅.
- `_lessonids.txt` — 6 ID (`pm-m4d12-v1 pm-m4d15-v1 pm-m4a2-v1 pm-m4b2-v1 pm-m4c2-v1 pm-m4c6-v1`).
- `PM_PIPELINE_STATE.md` — har dars uchun to'liq raund-yozuvlar (2026-08-17 bo'limlari).
- **`pipeline-b3/`** (YANGI, scratchpad'dan ko'chirildi — seans-mahalliy emas):
  - `QURUVCHI_BRIF.md` (7-bo'lim = B3 qo'shimchasi) · `SENARIY_BRIF_B3.md` · **`b2-check.mjs`** (bosh-agent darvoza-skripti) · `SAVOLLAR.md` (foydalanuvchiga) · `QOLDIQLAR.md`.
- Xotira: `memory/batch2-b3-konveyer.md`.

**HAMMASI UNCOMMITTED. Commit faqat foydalanuvchi buyrug'i bilan.**

---

## 2. PmLesson18 (M4c-D6) — AYNAN QAYERDA TO'XTADI

**O'tilgan zanjir:** quruvchi (3784 q) ✅ → dizayn (O'LCHAGICH-PANELI ranglar/led/📣 sanoq, 96 holat skroll 0) ✅ → jonli (0 tahrir) ✅ → 👦1 16/16 (5 tuzilma) ✅ → quruvchi-mayda (s4 «⏱ Javob vaqti» + ☝️ qatori · s10 Yordam-ko'prigi node/fetch · s8 savol karta-qatorida · s0 jim zaxira) ✅ → metodist (§133 F-0817-06; s3/s5 qayta, «o'tib ketdi»→«10 soniyaga yetmadi», «so'rov» gloss, jurnal gloss, telefon-eslatma) ✅ → quruvchi-mikro (s8 birlik «tasi (100 kirishdan)», fakt-jurnali yig'ma, `.tl-cnt/.gauge-v`) ✅ → 👦2 **O'TDI** (0/0/0/16/2) ✅ → **tekshiruvchi QAYTARILDI** ⬅ shu yerda

**Tekshiruvchi hukmi (2 🔴 + 3 🟡):**
1. 🔴 s4 yakun-kartasi `.xul` (:~1280) 3-chegara bosilgach ekrandan tashqarida (1280×800 da butunlay ko'rinmaydi, +148px; 1440×900 da yarmi) — 77-qonun avto-scroll yo'q (PmLesson17.jsx:1127–1133 `xulRef` naqshi) + vizual yig'ish. → **quruvchi** (avto-scroll 5 joyga: s2 xulosa, s4 `.xul`, s8 ro'yxat, s9 `.bdone`, s15 `hwOpen`) + s4 done-holatida 1280×800 skroll 0.
2. 🔴 47-qonun: s4/s8/s9/s10 sarlavhalari savol shaklida (metodist o'girgan; senariy 8-bo'lim «`?</h2>` bu 4 ekranda 0»). → **quruvchi**: senariy matniga qaytarish («Kunni boshlang va o'lchagichlarni o'qing.» · «Saytingizga uchta qoida yozing.» · «Har signalga yo'l tanlang.» · «Saytingizni o'lchaydigan kod yozamiz.»).
3. 🟡 :~1091 TEST-1 to'g'ri variant savolning «20 daqiqa» sonini echo qiladi → «O'sha paytda saytga kirgan odamlar» (§129/§106). → **metodist**
4. 🟡 :~2182 arena Q5 distraktori «Panel qizil rangda ko'rsatgan signal» — darsdagi har qizil holat chin (§102/16-ov) → almashtirilsin. → **metodist**
5. 🟡 :~1834 s10 Yordam «Serverni `node server.js`…» — «server» so'zi senariyda taqiq (§112 ko'prigi sifatida oqlash mumkin — hukm metodistniki). → **metodist**

**Chekpoint paytidagi HOLAT (agent TaskStop bilan to'xtatildi, fayl o'lchandi):** esbuild ✅ · til-lint 0 · `?</h2>` = 4 (faqat s1/s2/s6/s12) → **2-band BAJARILGAN** · avto-scroll `xulRef.scrollIntoView` s2 (:1064) / s4 (:1204, :1212) / s8 (:1547) / s9 (:1712) / s15 (:2777) → **1-bandning avto-scroll qismi BAJARILGAN**. TASDIQLANMAGAN: s4 done-holatida 1280×800 da skroll 0 (vizual yig'ish) — verifikator o'lchaydi; kerak bo'lsa quruvchi/dizayn mikro.

---

## 3. HAMMA DARS BO'YICHA UMUMIY JADVAL (GATE 3 uchun tayyor)

| # | Dars | Fayl | Qabulchi | Holat |
|---|---|---|---|---|
| B1 | M3-D10 | PmLesson9 | 28/28 (08-13) | GATE 3 imzo kutmoqda |
| B1 | M3-D14 | PmLesson10 | 28/28 (08-13) | GATE 3 imzo kutmoqda |
| B1 | M4-D2 | PmLesson11 | 28/28 (08-13) | GATE 3 imzo kutmoqda |
| B1 | M4-D7 | PmLesson12 | 28/28 (08-13) | GATE 3 imzo kutmoqda |
| B2 | M4-D12 | PmLesson13 | 28/28 (08-17) | GATE 3 imzo kutmoqda |
| B2 | M4-D15 | PmLesson14 | 28/28 (08-17) | GATE 3 imzo kutmoqda |
| B2 | M4a-D2 | PmLesson15 | 28/28 (08-17) | GATE 3 imzo kutmoqda |
| B3 | M4c-D2 | PmLesson17 | 28/28 (08-17) | GATE 3 imzo kutmoqda |
| B3 | M4b-D2 | PmLesson16 | 28/28 (08-17) | GATE 3 imzo kutmoqda |
| B3 | M4c-D6 | PmLesson18 | 28/28 (08-18) | GATE 3 imzo kutmoqda |

**Prod-shartlari (barchasiga):** jonli PIN-sinovi (MENTOR-2026, ≥2 o'quvchi, podium/arena ≠ 0) · GATE 3 foydalanuvchi-imzosi · commit faqat buyruq bilan.

---

## 4. FOYDALANUVCHIGA SAVOLLAR (`pipeline-b3/SAVOLLAR.md` — bloklamaydi)
1. 🟢 M4b-D2 K10 bashorat-2 «qancha vaqtga?» M3-D10 4-slaydi fakti bilan kesishadi (bank 3 faktli). Avto-qaror: QOLADI (ballanmaydi; 4-chip qo'shildi, to'g'risi o'rtada).
2. 🟡 `coddycamp-3-4-modul-senior` (m34-demo) 4a/4b/4c modullarini olmaydi — PmLesson15/16/17/18 demo-URL'da ochilmaydi. Kerak bo'lsa m34 registriga 4a–4c qo'shib qayta deploy (buyruq bilan).
3. 🟡 Platforma-sweep: kompilyator fixed-qobiq `zoom: calc(1/var(--lz))` (2560×1440 tuzatishi) — PmLesson15/17 da bor, PmLesson1/2/3/4/9/11/13 da yo'q.
4. 🟡 Platforma-sweep: koding-darvoza `stage2 = gpick || isMentor || done` — mentor rejimida darvoza-javob chipi ko'rinadi (PmLesson11 PASS dan kelgan oila-naqshi, 7 darsda). Oilaviy tuzatish yoki qoldirish — sizning hukmingiz.
5. 🟡 `StudentPracticePulse` koding-ekranida (82f ga zid) — PmLesson12/16 va oilada bir xil.
6. 🟡 Mentor rejimida test-ekranlarida MentorTestStats +75…93px skroll — oila-bo'ylab.
7. 🟡 HtmlCompiler yashirin iframe `localStorage sandboxed` konsol-xatosi (kompilyator qobig'i, dars emas) — compilator-tiketi.

---

## 5. KEYINGI SEANSDA «DAVOM ET» DEYILGANDA — QADAMMA-QADAM

```
0. Shu faylni + PM_PIPELINE_STATE.md ning oxirgi 2026-08-17 bo'limlarini o'qish. CLAUDE.md retsept B/C amal qiladi.
1. PmLesson18 holatini o'lchash:
     node pipeline-b3/b2-check.mjs src/4c-Modull/PmLesson18.jsx        (esbuild/lint:jsx/lint:til/QUIZ/… hammasi yashil bo'lishi kerak)
     grep -c "?</h2>" src/4c-Modull/PmLesson18.jsx                       (4 bo'lishi kerak: s1/s2/s6/s12; s4/s8/s9/s10 da 0)
     grep -n "xulRef\|scrollIntoView\|scrollTo(" src/4c-Modull/PmLesson18.jsx   (avto-scroll 5 joyda bormi: s2/s4/s8/s9/s15)
   (chekpointda: esbuild ✅, sarlavhalar ✅, avto-scroll 6 joyda ✅ — 2-qadamga o'ting; s4 1280×800 skroll-o'lchovi 3-qadam verifikatorida.)
2. pm-metodist MIKRO — 2-bo'lim 3–5 🟡 bandlari (correct indekslari tegilmaydi; esbuild + til-lint 0).
3. PARALLEL: darslik-verifikator (16/16 render, konsol 0, s4 `.xul` viewport ichida 1280×800, `pm-m4c6-signal` yozildimi,
   ccProgress reload, mentor rejimi; `npx vite build` — m34 config 4c ni olmaydi) ∥ pm-qabulchi (28 band; pretsedent:
   STATE'dagi PmLesson16/17 PASS hisobotlari). Ikkalasi read-only.
4. PASS bo'lsa: PM_PIPELINE_STATE.md ga «M4c-D6 QABULCHI PASS 28/28 — 🏁 BATCH 3 TO'LIQ YOPILDI (3/3)» yozuvi (naqsh:
   PmLesson16/17 yozuvlari).
5. Foydalanuvchiga GATE 3 HISOBOTI: 3-bo'lim jadvali (10 dars) + 4-bo'lim savollari + prod-shartlari. Foydalanuvchi qarorlari:
   GATE 3 imzo · jonli PIN-sinovi · platforma-sweep · commit (faqat buyruq!) · B4 (M5, 3 dars: registr R2 «BATCH 4») boshlashmi.
6. B4 boshlansa: SENARIY_BRIF_B3.md (B4 uchun ham amal qiladi, pasport R2 Batch 4) → 3 yozuvchi parallel → pm-metodist
   korrektura ×3 → avto-GATE S (agar ruxsat davom etsa) → 3 quruvchi (QURUVCHI_BRIF 7-bo'lim bilan) → zanjirlar.
```

## 6. KONVEYER-TARTIBI (bugun ishlagan, o'zgartirmang)
Har dars: quruvchi → **bosh-agent `b2-check`** → dizayn → jonli → 👦1 → (quruvchi-mayda, tuzilma bo'lsa) → metodist → 👦2
(GATE 2 avto: 0 bilmadim · 0 gloss'siz · niyat ≥15/16 · qayta-o'qish ≤2) → tekshiruvchi → (qaytarish: quruvchi/metodist
MIKRO) → **verifikator ∥ qabulchi** (parallel, read-only) → STATE yozuvi. Bir fayl — bir muharrir; parallelizm faqat darslar
orasida. Har roldan keyin `b2-check`; matn tegilgan roldan keyin `lint:til` 0 error. Sinf-tarqalish (F-0813-09): bir darsda
topilgan yangi sinf darhol opa-singil fayllarda grep qilinadi (bugun 3 marta ishladi: o'suvchi correct-o'nlik · uzunlik-narvoni ·
savol-sarlavha s4/s8/s9/s10). Umumiy fayllar (registr/korpus/STATE/App.jsx) — faqat bosh-agent.

## 7. AGENT-BRIF NAQSHLARI (nusxa olib ishlating)
- **Quruvchi (yangi dars):** senariy + maqsad-fayl + lessonId + karta-nomi + koding-turi + artefakt + imzo/tekshiruv-mexanika +
  `pipeline-b3/QURUVCHI_BRIF.md` (1-bo'lim o'qish-tartibi + 7-bo'lim) + manba-naqsh (kompilyatorli: PmLesson11 infra + PmLesson15
  fixed-qobiq/zoom; VS Code: PmLesson12 + PmLesson14 DRAFT_KEY) + PmLesson9 s6 keys-naqshi; «faqat shu fayl», LF, hisobot ≤25 qator.
- **Dizayn:** rol-fayl + PM_DARS_ETALON 1-bo'lim + quruvchi qoldiqlari; 58/60-qonun 1440×900/1280×800 (+2560) skroll 0; o'lik CSS
  ikki tomonlama sanoq (dinamik oilalar himoya); reduced-motion; «faqat ko'rinish/harakat».
- **Jonli:** INLINE_KEYS ↔ correctIdx ↔ senariy; QUIZ 3/3/3/3, tsikl 0,3,2,1·1,0,2,3·0,2,1,3 (tegilmaydi), narvon; set_quiz_keys;
  Kahoot-reveal; F-0812-04; 88(d) turnBusy; sentinel nomlari.
- **👦 1-/2-o'qish:** OQUVCHI_DARVOZA.md; 1-o'qishda 4 savol + niyat N/16 + 🔴; 2-o'qishda o'tish-shartlari raqam bilan + har
  1-o'qish topilmasi YOPILDI/OCHIQ + hukm.
- **Metodist:** 👦 hisoboti bandma-band TUZATILDI/OQLANDI/RAD + sabab; MATN_KORPUS §99–133 avval o'qiladi; ball/correct/tuzilma
  tegilmaydi; QURUVCHIGA tuzilmaviylar alohida; korpus-taklif (bosh-agent F-ID bilan muhrlaydi).
- **Tekshiruvchi:** barcha ov-bandlari (16/17/18/14/15/13/54); mayda o'zi, tuzilmaviy mas'ul rolga (file:line); correct tegilmaydi;
  hukm «verifikatorga tayyor»/«qaytarish».
- **Verifikator / Qabulchi:** read-only; verifikator — esbuild, vite build (S42 hajm), 16/16 render konsol 0, kalit ekranlar,
  artefakt, ccProgress reload, mentor rejimi, skrinshotlar; qabulchi — 28 band, pretsedent STATE.
