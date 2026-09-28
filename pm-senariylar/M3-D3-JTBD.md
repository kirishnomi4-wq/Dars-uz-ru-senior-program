# M3-D3 — Bitta natija, uch xil sabab (SENARIY, PM_Prompt_v8 · ARALASH TUR)

> Holat: YOZILDI (senariy-bosqichi, 2026-09-28, F-0928-06) → pm-metodist SENARIY-KORREKTURASI → **[GATE S]** kutmoqda.
> Manba: v9 dasturi (`CoddyCamp_Senior_2026_v9_14modul .html`, 4-Modul №3): «Jobs-to-be-Done — глубоко» ·
> mazmun «Funksional, ijtimoiy, emotsional Jobs» · natija «3 mahsulot + o'z komponentlari uchun JTBD».
> Fayl: `src/pm/PmJtbdLesson.jsx` **qayta quriladi** (eski `pm-m7d2-v2`, m7-02 o'rni) — yangi `lessonId: pm-m3d3-v1`.
> Joy: bizning 3-Modul, `m3-02 PmUserStoryLesson` (P0) dan KEYIN, `m3-03 ReactFirstComponentLesson` dan OLDIN.
> Eski senariy `pm-senariylar/M7-D2-JTBD.md` repoda YO'Q — qayta ishlatiladigan qismlar to'g'ridan-to'g'ri
> `PmJtbdLesson.jsx` dan olindi (14-bo'lim). Format-namuna: `M3-D5-Prioritet.md`.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 3 — «Frontend — React» (oy 3–4.5) · modul g'oyasi «Komponent = imkoniyat. Foydalanuvchi hikoyasi koddan OLDIN yoziladi.» |
| **Dars** | M3-D3 (P0 dan keyingi dars) · `key` — GATE S 4-qaror (App.jsx raqamlash) |
| **Mavzu** | Bir natija — uch tur vazifa: **funksional · ijtimoiy · emotsional** — va har vazifa saytda o'z komponentini oladi |
| **TUR** | 🔀 **ARALASH** (1-B): nazariya 2-TURdan (keys-slayd K18, bashorat bilan) · amaliyot 1-TURdan (o'quvchi **ajratadi, yo'naltiradi, tuzatadi**). Yozuv — faqat komponent nomlari + bitta yangi vazifa-qatori (s9). Sabab: mavzu — **ajratish**; u uzun yozuv bilan emas, tanlov va yo'naltirish bilan o'rgatiladi |
| **Bosh keys** | **K18 · STARBUCKS** «uchinchi joy» (temalar: *JTBD · ценность продукта · для кого и зачем*) — registr :64 shu darsga band qilgan |
| **ISHLATILGAN_KEYS (3-Modulda band)** | K11 · K15 (M3-D2) · K14 (M3-D5) · K10 (M3-D10) · K12 (M3-D14) → **K18 3-Modulda birinchi marta** ✓ (10-qonun) |
| **Oldingi PM dars (M3-D2) TEKSHIRUV mexanikasi** | Hotspot/xato-topish + tekshiruvchi stoli + klinika — **uchalasi ham takrorlanmaydi** |
| **Keyingi PM dars (M3-D5)** | koding VS Code · TEKSHIRUV «kartani boshqa katakka ko'chirish» — bu dars ikkalasini ham olmaydi |
| **Band mexanikalar (TAQIQ, registr :181)** | story-silosi · JTBD shtampi («✓ YOLLANDI») · Metrika alangasi · ikki o'qli doska · ishga-tushirib-ko'rish formasi · **MatchPairs** · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · kartani ko'chirish · PairTimer · **klinika** · **tekshiruvchi stoli (peer)** · **prioritet-doska** · Timeline (M3-D10) · Hotspot (M3-D14) · `hikoyaYasa` kompilyatori |
| **Misol-ip (91 + 95 + 96c)** | 🇬🇧 **Maktab yonidagi ingliz tili markazining sayti.** Butun dars shu markaz ustida: hook — «nega pul to'lab markazga boradi?», teoriya — markazga borish sabablari, komponentlar — markaz saytining bloklari, tekshiruv — markazning eski sayti, koding — markaz saytining kodi. 3-Modul oilasi «maktab yonidagi joy sayti» (o'yin-klub · bufet · maydoncha) davom etadi, joy **yangi**. 95-qonun: Toshkent o'smiri maktabdan keyin o'quv markaziga **o'zi boradi** (ko'pchilik haftasiga 2–3 marta) ✓ · 96c(e) to'qnashuv-grep (`ingliz tili`, `o'quv markaz`, `IELTS` — `pm-senariylar/`, `src/pm`, `src/3-Modull`, `src/bridge`): **bosh-misol sifatida 0** ✓ |
| **Kirish-artefakt** | `pm-m3d2-stories` (M3-D2 da yozilgan **aynan 3 ta** `{kim, nima, natija}`) — s9 da har hikoyaning **NATIJA** bo'lagi uch turdan biriga ajratiladi. 🔴 Faqat O'QILADI — bu dars `pm-m3d2-stories` ga **yozmaydi** (M3-D5 ham shu kalitni o'qiydi) |
| **Chiqish-artefakt** | 🔴 `pm-m3d3-jobs` = `{ stories: [{kim, nima, natija, tur, komponent}] ×3, yangi: {komponent, vazifa, tur}, savedAt }` — v9 natijasi «o'z komponentlari uchun JTBD» shu yerda yopiladi |
| **Yordamchi kalitlar** | `pm-m3d3-hook-choice` (faqat YOZILADI — 100c) · `pm-m3d3-code` · `pm-m3d3-reflection` · `ccProgress` (F-0730-01) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **17 ta** (s0…s16); scored: 3 ichki test + 1 yakuniy + CodeStrike arena (yakun-ekran ichida) |

**«3 mahsulot» (v9) qayerda:** markaz saytining uch komponenti — `<Jadval />` · `<Natijalar />` · `<SinovDarsi />` (s8) — har biri o'z vazifasi va turi bilan; modul g'oyasi «komponent = imkoniyat» bo'yicha har komponent — alohida mahsulot-bo'lak. Koding (s11) ham aynan shu uchtasi ustida.

**Atama-glosslar (62/39-qonun — avval hodisa, keyin nom):**
- 🔴 **P0 ga tayanish — BITTA gap** (audit 1-band): «Odam mahsulotning o'zini emas, u beradigan natijani oladi — buni Jobs-to-be-Done (JTBD) deb bilasiz.» (s2 mentori). Shu g'oya darsda **qayta o'rgatilmaydi**: na keysda, na testda, na arenada (residue-grep: `natijani sotib oladi|devorga rasm|drel` → 0).
- 🔴 **«vazifa» — darsning bosh so'zi** (MATN_ETALONI lug'at :101, F-0727-12): «ish» JTBD-tarjimasi sifatida ekranga CHIQMAYDI. Gloss bir marta (s2): «mahsulot odam uchun bajaradigan narsa — **vazifa**». Yollash-metaforasi («yollandi», «ishga qabul») bu darsda **ishlatilmaydi** — ikkinchi metafora yuk bo'lardi (111/109).
- 🔴 **Uch tur — avval SAVOL, keyin NOM** (s2): 🔧 «Amalda nima bajariladi?» → **funksional** · 👥 «Boshqalar oldida qanday bo'laman?» → **ijtimoiy** · 💗 «O'zimni qanday his qilaman?» → **emotsional**. Uch savol butun dars bo'ylab **so'zma-so'z bir xil** (bir tushuncha — bir nom, korpus §80); testlar, arena, flashcard shu savollarga tayanadi.
- 🔴 **Raqibsiz** (F-0727-12(6)): «raqib», «o'rniga nima olardi», raqib-maydoni — **0**. Hook-savoldagi «telefonda bepul darslar» raqib sifatida TAHLIL QILINMAYDI — u faqat savolni qo'zg'atadi va s2 da bitta gap bilan yopiladi.
- 🔴 **«komponent»** — m3-01 dan tanish so'z (u yerda: «Bu bo'laklar komponentlar deb ataladi»). Gloss qayta berilmaydi, faqat ko'prik (s8): «Sahifa komponentlardan yig'ilishini bilasiz».
- 🔴 **7-Modul atamalari 0:** MVP · custdev · «mijozlar bilan suhbat» · «o'z MVP'ingiz» — residue-grep 0 (audit 5-band).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «UCH NUR»** (23-qonun: P0 story-silosi · eski JTBD shtampi · Metrika alangasi · M3-D5 ikki o'qli doska klonlanmaydi).

Chapda — bitta **mahsulot-karta** (markaz, keyin komponent, keyin o'quvchining hikoyasi). Undan o'ngga **uch rangli nur** chiqadi; har nur oxirida bitta uya:

```
                    ┌─ 🔧  Amalda nima bajariladi?        [ ............ ]
 [ 🇬🇧 Markaz ] ────┼─ 👥  Boshqalar oldida qanday bo'laman? [ ............ ]
                    └─ 💗  O'zimni qanday his qilaman?      [ ............ ]
```

Vazifa uyaga tushganda o'sha nur **yonadi** (xira → to'liq rang, bir marta yaltiraydi); vazifasi yo'q nur **xira va punktirsiz** qoladi (159/2: kesik bezak-chiziq yo'q — xiralik o'zi «bo'sh» degani). 🔴 «Nur» so'zi o'quvchi matnida **ishlatilmaydi** (41-qonun: metafora-so'z izoh talab qiladi) — matnda faqat «tur». Vizual o'zi gapiradi.

**Qayerda ishlaydi:** s1 (o'zi yoziladi) · s2 (uch savol ochilganda nurlar yonadi) · s4 (6 gapni uyalarga joylash) · s6 keys (Starbucks — uch nur birdan) · s8 (komponent bosilsa o'z nuri yonadi) · s9 (o'z hikoyalari) · s10 (eski saytda ikki nur bo'sh) · s11 (koding preview).

**Rang-semantikasi (71-qonun — butun dars bo'ylab BIR XIL):**
| Tushuncha | Rang |
|---|---|
| 🔧 Funksional | `blue` #0E86C4 |
| 👥 Ijtimoiy | amber (P0 NIMA-slot tokeni) |
| 💗 Emotsional | `accent` #5B3DE6 |
| Bo'sh nur | `line` #E7E3F4 |

🔴 `success` yashili nurga berilmaydi — u «to'g'ri/bajarildi» ma'nosida band. `err` qizili faqat haqiqiy noto'g'ri bosishda (s4/s10 xato joylash) — bo'sh nur **xato emas**.

**Nima uchun aynan shu:** P0 hikoyani **uch bo'lakka** ajratgan edi (KIM/NIMA/NATIJA). Bu dars o'sha NATIJA bo'lagini olib, uni **uch turga** ajratadi — ya'ni P0 ni takrorlamaydi, **bir qavat chuqurlashtiradi** (v9 sarlavhasidagi «chuqur» shu).

---

## 2. EKRAN-RO'YXATI (17 ekran)

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Telefonda bepul dars bor — nega markazga boradi?» | 1 | — | 3 karta · ovoz · payoff shu ekranda |
| s1 | MAQSAD — markaz kartasidan uch nur o'zi yozilib chiqadi | 2 | — | jonli natija-preview (18/23-qonun) |
| s2 | TEORIYA-1 — **uch savol** | 3 | — | 3 savol-karta · bosib ochish (46-qonun toggle) · xulosa-karta |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | SARALASH — markaz o'quvchilarining 6 gapi uch turga | 3 | — | tanla → uyani bos (75-qonun) |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K18 Starbucks (4 slayd + 2 bashorat) | 3 | — | keys-slayd (33/56/91b) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | TEORIYA-2 — **har vazifa — o'z komponenti** (markaz sayti) | 3 | — | sayt-maket · komponentni bosib ochish (m3-01 ko'prigi) |
| s9 | MUSTAQIL ISH — o'z 3 hikoyasi: tur + komponent + yetishmagan tur | 4 | — | bittalab karta (●○○) + bitta yangi qator |
| s10 | TEKSHIRUV — **«Markazning eski sayti»**: 4 mehmon savoli → komponentga yoki «mos komponent yo'q» | 5 | — | 🔴 yangi mexanika: mehmonni yo'naltirish-simulyatsiyasi |
| s11 | KODING — **kodni o'qib tuzatish**: `vazifalar` massividagi 2 xato `tur` | 6 | — | 🔴 Debug Challenge (qatorni bosish + qiymatni qo'lda yozish) |
| s12 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s13 | REFLEKSIYA — juftlikda ayting + bir qator | 7 | — | 2 qadam (54e) |
| s14 | PODIUM | 9 | — | — |
| s15 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s16 | **YAKUN** — CodeStrike arenasi + uy-vazifa eslatmasi bir sahifada | 8 + 9 | ✅ (arena) | etalon yakun-tuzilmasi (M3-D5 §2) |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s12 — ketma-ket emas, har biri o'z teoriyasidan keyin.
🔴 **Yakun-tuzilmasi:** koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada). Arena alohida `SCREEN_META` yozuvi EMAS (`jsx-lint.mjs` 3a).

### 2-A. SCREEN_INTENTS (quruvchi `export const SCREEN_INTENTS` ga so'zma-so'z ko'chiradi)

```js
s0:  "Bola «telefonda bepul dars bor, unda nega markazga boradi?» savoliga ovoz berib, sinfda ovozlar uchga bo'linganini ko'radi",
s1:  "Bola dars oxirida har natijaning turini ajrata olishini — uch nur o'zi yozilib chiqqanidan — oldindan ko'radi",
s2:  "Bola uch savolni ochib, har sabab boshqa savolga javob berishini va ularning nomi funksional, ijtimoiy, emotsional ekanini biladi",
s3:  "Bola «boshqalar oldida qanday bo'laman?» savoliga javob beradigan sababni topadi",
s4:  "Bola markaz o'quvchilarining 6 gapini uch turga o'zi joylaydi",
s5:  "Bola yangi xona misolida emotsional vazifani taniydi",
s6:  "Bola Starbucks bitta joyda uch tur vazifani birga bajarishini biladi",
s7:  "Bola Starbucks'dagi qaysi narsa emotsional vazifa ekanini topadi",
s8:  "Bola markaz saytidagi har komponent bitta vazifaga xizmat qilishini, vazifasiz komponent yo'qligini ko'radi",
s9:  "Bola o'z 3 hikoyasining natijasini turga ajratadi, har biriga komponent nomini beradi va kam uchragan tur uchun yangi komponent qo'shadi",
s10: "Bola eski saytga 4 mehmonni yo'naltirib, ikki tur vazifaga komponent yo'qligini o'zi topadi",
s11: "Bola markaz kodidagi ikki noto'g'ri turni topib, to'g'risini qo'lda yozadi",
s12: "Bola hikoya natijasining turini aniqlab, bugungi darsni P0 hikoyasi bilan bog'laydi",
s13: "Bola bugun o'z hikoyalarida qaysi tur kam ekanini sherigiga aytib, bir qatorda yozadi",
s14: "Bola o'z natijasini (jonlida — sinf reytingini) ko'radi",
s15: "Bola 10 kartada uch savol, uch tur va komponent-vazifa bog'lanishini o'zi takrorlaydi",
s16: "Bola darsni yakunlab, CodeStrike arenasini ochadi va uy-vazifa qadamlarini ko'radi"
```

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 3 — Frontend: React
DARS: M3-D3 (P0 dan keyingi dars)
DARS_MAVZUSI: Jobs-to-be-Done — chuqur: funksional, ijtimoiy, emotsional vazifa
ISHLATILGAN_KEYS: K18
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish sahnasi)
EKRAN: Telefonda bepul ingliz tili darslari ko'p. Unda nega sinfdoshlaringiz
pul to'lab, maktab yonidagi markazga borishadi? Sizningcha, asosiy sabab qaysi?
HARAKAT: O'quvchi 3 kartadan bittasini tanlaydi. Tanlagach sinf ovozlari
ko'rinadi va bitta payoff-qator chiqadi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: «Uchala sabab ham rost — va har
biri boshqa-boshqa.»
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar uchga bo'linadi — shu darsning o'zagi. «Qaysi biri to'g'ri?» deb
bahslashtirmang: keyingi ekranda uchalasi o'z savolini oladi.
```

**3 karta (86a: desktopda bir qatorga sig'adi · teng uzunlik):**

| Karta | Ichki tur (ekranda YOZILMAYDI) |
|---|---|
| 📜 Sertifikat olib, universitetga kirish | funksional |
| 👥 Sinfdoshlardan orqada qolmaslik | ijtimoiy |
| 😌 Imtihondan qo'rqmay tayyorlanish | emotsional |

> 🔴 **97-qonun:** savol o'smir og'zidan tabiiy chiqadi — «bepul bor-ku, nega pul to'laydi?». Aniq narsa (telefon, markaz) + harakat fe'li (pul to'lab boradi) ✓. Savol↔variant mosligi (97d): savol «nega boradi?» — variantlar sabab ✓.
> 🔴 **91a:** hook obyekti (markaz) = o'qitish obyekti; savol s2 da to'liq yopiladi.
> 🔴 **54a/100c:** ovoz ostida mentor-izoh YO'Q; tanlov `pm-m3d3-hook-choice` ga yoziladi, hech qayerda **o'qilmaydi**.
> 🔴 **Raqibsiz:** «telefon» faqat savolni qo'zg'atadi — telefon bilan markaz solishtirilmaydi, «raqib» so'zi 0.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Bugun odamlar nima uchun kelishini uch turga ajratamiz — va saytda qaysi
vazifa yetishmayotganini topamiz.
HARAKAT: Kuzatadi: markaz kartasidan uch nur chiqadi, uchala uyaga bittadan
vazifa o'zi yozilib chiqadi, nurlar birin-ketin yonadi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Nurlar yonib bo'lguncha gapirmang — vizual o'zi tanishtiradi.
```

> 🔴 **159/7:** maqsad-sarlavhasi «Bugun …» gapi, `takeaway` bilan TAKRORLANMAYDI (bittasi qoladi — sarlavha) · 54b/c: ost-qator va «sizniki ham shunday bo'ladi» captioni YO'Q.
> 🔴 **42-qonun:** fe'l «o'zi yozilib chiqadi» (matn), nur — «yonadi».
> 🔴 **Preview-matni** uch nur uyasida (tur nomi hali YO'Q — 39-qonun, nom s2 da): «sertifikat olish» · «sinfdoshlardan orqada qolmaslik» · «imtihondan qo'rqmaslik».

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (uch savol) + Drag&Drop (6 gap → 3 tur) + keys-slayd + 3 × Quiz
EKRAN: Bitta markazga odamlar uch xil sabab bilan keladi. Har sababga uch
savoldan biri javob beradi — shu savol uning turini aytadi.
HARAKAT: (s2) 3 savol-kartani ochadi; (s4) 6 gapni uch turga joylaydi;
(s6) keys-slaydlarni bashorat bilan ochadi; (s8) markaz saytidagi 3 komponentni
bosib, har birining vazifasi va turini ko'radi.
JAVOB: s4 — jadval quyida; s8 — hamma komponent ochilgan.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da «guruhda eng kuchli bo'lib ko'rinaman» bahs bo'ladi: unda his ham bor.
Savolni qayta o'qing: gap boshqalar KO'ZI haqidami yoki o'zingizning HISSINGIZ haqidami?
```

**s2 — TEORIYA-1 «Uch savol»** (induktiv: hook-sabablari → savol → nom)

Mentor (2 gap — 109, **P0 ga tayanadigan yagona gap shu**):
> Oldingi darsda ko'rdingiz: odam mahsulotning o'zini emas, u beradigan natijani oladi — bu Jobs-to-be-Done (JTBD) g'oyasi. Bugun mahsulot odam uchun bajaradigan shu narsani **vazifa** deb ataymiz.

Sarlavha: «Uch sabab — uch xil savolga javob.» · Uch savol-karta (46-qonun: bosilsa ochiladi/yopiladi; darvoza `seen` 3/3):

| Savol-karta (yopiq) | Ochilganda (hook kartasi + nur yonadi) |
|---|---|
| 🔧 Amalda nima bajariladi? | 📜 Sertifikat olib, universitetga kirish |
| 👥 Boshqalar oldida qanday bo'laman? | 👥 Sinfdoshlardan orqada qolmaslik |
| 💗 O'zimni qanday his qilaman? | 😌 Imtihondan qo'rqmay tayyorlanish |

Uchalasi ochilgach **xulosa-karta** (69-qonun — maqtov emas, xulosa; bu yerda NOM birinchi marta):
> **Uch savol — uch tur vazifa.** Birinchisi — **funksional**, ikkinchisi — **ijtimoiy**, uchinchisi — **emotsional**. Telefon faqat tilni o'rgatadi, markaz esa uchala savolga javob beradi.

> 🔴 **Hook shu yerda yopiladi** (91a) — xulosa-kartaning oxirgi gapi hook-savolining javobi.
> 🔴 **Ekran-budjeti:** mentor ≈180 + sarlavha ≈40 + xulosa ≈210 ≈ **~430 jami, proza ≤400** — karta-matnlari ish-maydoni (9-qonun aniqlashtirishi). Qurishda Intl.Segmenter bilan o'lchanadi; oshsa xulosaning 3-gapi qisqaradi, mentor emas.

**s4 — SARALASH «Markaz o'quvchilari nima deydi?»** (Drag&Drop, unscored)

Sarlavha (buyruq, 47): «Olti gapni o'z turiga joylang.» · Mentor (1 gap): «Avval gapni tanlang, so'ng u javob beradigan savolni bosing.» · Idish-yorliq (72): «✋ Olti gap ↓».

| # | Gap (markaz o'quvchisidan, ismsiz — 5.8) | To'g'ri tur |
|---|---|---|
| 1 | «Uyga yaqin — avtobussiz boraman» | 🔧 funksional |
| 2 | «Dars vaqti maktabimga to'g'ri keladi» | 🔧 funksional |
| 3 | «Guruhda eng kuchli bo'lib ko'rinaman» | 👥 ijtimoiy |
| 4 | «Do'stlarim bilan bir guruhdaman» | 👥 ijtimoiy |
| 5 | «Darsdan keyin o'zimga ishonchim ortadi» | 💗 emotsional |
| 6 | «Imtihon yaqinlashsa ham qo'rqmayman» | 💗 emotsional |

Idishdagi tartib aralash: 3 · 1 · 6 · 4 · 2 · 5 (to'g'ri tur ketma-ketligi naqsh bermaydi).
Noto'g'ri joylashda (98b: mentor emas, komponentning O'Z `hints`i): gap qaytadi va o'sha **savol** yonadi — «Bu gap boshqa savolga javob beradi. Uni qayta o'qib, uch savolni birma-bir bering.»
Yakun-qatori (106e): «✅ Olti gap o'z joyida — har tur o'z savoliga javob beradi.»

> 🔴 **Prioritet-doskadan farq** (audit 2-band): ustunlar «muhimlik darajasi» emas, **savol**; tartib yo'q, sig'im cheklovi yo'q, «birinchi» tanlanmaydi. Vizual — ustun emas, nur-uyalari.
> 🔴 **151-qonun:** «Type Sorter!» nishoni faqat birinchi TO'LIQ urinish xatosiz bo'lsa; `AchRule` qatori topshiriq ostida.

**s6 — KEYS:** 6-bo'limga qarang. **s8 — TEORIYA-2:** 5-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH ===
```
VAQT: 16
KOMPONENT: Simulation (o'z hikoyalari uch nurda) + qisqa yozuv-maydonlari
EKRAN: Endi o'z loyihangiz navbati. O'tgan darsda yozgan uchta hikoyangiz pastda —
har birining natijasi qaysi turga kiradi?
HARAKAT: Hikoyalar BITTALAB (●○○): natijaga tur tanlaydi → shu hikoyani
bajaradigan komponent nomini yozadi. Uchalasidan keyin — eng kam uchragan tur
uchun bitta yangi komponent va uning vazifasini yozadi.
JAVOB: 3 hikoyaga tur tanlangan · 3 komponent nomi bor · yangi komponent kam
uchragan turga xizmat qiladi va vazifa-qatori bo'sh emas.
RO'YXAT: Uch natija turga ajratilgan · Har hikoyaning komponenti bor · Kam turga
yangi komponent
YULDUZCHA: Bir hikoyangiz ikki savolga ham javob beradimi? Ikkinchi turini ham belgilang.
YORDAM: Natijani o'qing: u amalda nima bajarilishi, boshqalar oldida qanday bo'lish yoki qanday his qilish haqidami? Mos kelgani — uning turi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ko'pchilikda hamma hikoya funksional chiqadi — bu xato emas, darsning
eng muhim topilmasi. Uni yangi komponent qadamida o'zlari ko'rsin.
```

**Qadamlar (94-qonun bosqichli ochilish; chip ≤4 so'z — 32a):**
1. «Turini tanlang» — hikoya-karta (P0 formula-gapi, NATIJA bo'lagi ajratilgan) + uch savol-tugma. Tanlangach **bitta echo-qator** (106d — tanlov javobsiz qolmaydi): «Siz «ijtimoiy» dedingiz: bu natija boshqalar oldida qanday bo'lishingiz haqida.» — tanlangan turning O'Z savoli bilan; ↻ bilan qayta tanlash mumkin.
2. «Komponentini nomlang» — `<` ___ ` />` ko'rinishidagi bitta maydon · `placeholder="Komponent nomi"` (92c: namuna-javob maydonda turmaydi).
3. (uchala hikoyadan keyin) «Yangi komponent» — tizim eng kam uchragan turni o'zi hisoblaydi (teng bo'lsa tartib: emotsional → ijtimoiy → funksional) va aytadi: «Hikoyalaringizda «emotsional» vazifa kam. Shu tur uchun bitta komponent qo'shing.» · 2 maydon: komponent nomi · «U qanday vazifani bajaradi?»

Yakun-chip (32d): «✅ Uchta hikoya va bitta yangi komponent — «Vazifalarim»ga saqlandi.» (73: kelajak-va'da YO'Q)
Artefakt-strip (35/39): nomi **«Vazifalarim»**, s9 dan chiqadi (bo'sh 0/3 holatda oldin ko'rinmaydi).

🔴 **Kirish-artefakt tarmog'i (69-korpus — ikkala tarmoq bir shaklda, «topilmadi/saqlanmagan» 0):**
- **Artefakt BOR:** «O'tgan darsda yozgan uchta hikoyangiz pastda turibdi.»
- **Artefakt YO'Q:** «Boshlash uchun markaz saytining uchta hikoyasini olamiz — ularni o'z loyihangizniki kabi ajrating.»
- Zaxira-hikoyalar **shu darsning olamidan** (96c(d)) — P0 formula-qolipida:
  1. «Men yangi o'quvchi sifatida dars jadvalini ko'rishni xohlayman, maktabimga mos guruhni tanlash uchun.»
  2. «Men guruh a'zosi sifatida oylik reytingni ko'rishni xohlayman, do'stlarimdan orqada qolmaslik uchun.»
  3. «Men imtihonga tayyorlanayotgan o'quvchi sifatida sinov imtihonini topshirishni xohlayman, asl imtihon kuni qo'rqmaslik uchun.»
- 🔴 **40-qonun:** EKRAN «uchta hikoyangiz» deydi — faqat artefakt BOR tarmog'ida; YO'Q tarmog'ida EKRANning 2-gapi zaxira-gapi bilan almashadi.

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (mehmonni yo'naltirish)
EKRAN: Bu — markazning eski sayti: unda uchta komponent bor. Saytga to'rt mehmon
keldi. Har birini o'z savoliga javob beradigan komponentga yuboring.
HARAKAT: Mehmon-kartani tanlaydi → komponentni yoki «➕ Mos komponent yo'q»
tugmasini bosadi. To'rttasi yo'naltirilgach nurlar holati ochiladi.
JAVOB: 1 → <Jadval /> · 2 → <Narxlar /> · 3 → Mos komponent yo'q (ijtimoiy) ·
4 → Mos komponent yo'q (emotsional)
RO'YXAT: —
YULDUZCHA: —
YORDAM: Mehmon savoliga uch savolimizdan qaysi biri mos? Keyin shu turdagi komponentni qidiring.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda: biringiz mehmon bo'lib savolni ovoz chiqarib o'qing, sherigingiz
saytdan komponentni ko'rsatsin. Keyingi mehmonda almashing.
MENTORGA: Bitta fikr: eski sayt faqat «amalda nima bajariladi?» savoliga javob
bergan. Ikki tur vazifa komponentsiz qoldi — mehmonlar shuning uchun ketadi.
```

**Eski sayt (3 komponent, uchalasi funksional):** `<Jadval />` · `<Narxlar />` · `<Manzil />`

| Mehmon (ismsiz — 5.8) | To'g'ri yo'nalish | Tur |
|---|---|---|
| 1 · «Shanba kuni dars bormi?» | `<Jadval />` | funksional |
| 2 · «Bir oyi qancha turadi?» | `<Narxlar />` | funksional |
| 3 · «O'qib bo'lgach, do'stlarimga ko'rsatadigan sertifikat berasizlarmi?» | ➕ Mos komponent yo'q | ijtimoiy |
| 4 · «Men xato qilishdan qo'rqaman. Birinchi darsda qiynalib qolsam-chi?» | ➕ Mos komponent yo'q | emotsional |

Yakun-qatori (bitta gap): «✅ Eski sayt faqat funksional vazifani bajargan — ikki tur komponentsiz qoldi.» Nurlar: 🔧 yonadi, 👥 va 💗 xira.

> 🔴 **26/59-qonun:** M3-D2 TEKSHIRUVi Hotspot/tekshiruvchi stoli/klinika · M3-D5 — kartani ko'chirish · M3-D10 — Timeline · M3-D14 — Hotspot. Bu — **yo'naltirish-simulyatsiyasi** (mehmon → komponent yoki «yo'q»): registrda band emas ✓.
> 🔴 **MatchPairs'dan farq:** chap-o'ng juftlash ustunlari va chiziqlar YO'Q; to'rt mehmondan ikkitasining to'g'ri javobi — **«mos komponent yo'q»**, ya'ni mashq juftlikni emas, **bo'shliqni** topishni tekshiradi.
> 🔴 **Mehmon 4 tozaligi (17-qonun):** «ustimdan kulishmaydimi» varianti rad etildi — u boshqalar ko'zini ham tilga oladi (ijtimoiy bilan chalkashadi). «Xato qilishdan qo'rqaman» — faqat his.
> 🔴 **151-qonun:** «Gap Spotter!» — birinchi to'liq yo'naltirish xatosiz bo'lsa.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Debug Challenge (kodni o'qib tuzatish — 26/87-qonun)
EKRAN: Markaz sayti uchta komponentdan yig'ilgan. Pastdagi kodda har komponentning
vazifasi va turi yozilgan — ikki qatorda tur noto'g'ri. Topib, to'g'risini yozing.
HARAKAT: Noto'g'ri qatorni bosadi → o'sha qatorning `tur` qiymati yozuv-joyiga
aylanadi → to'g'ri turni qo'lda yozadi. Ikkala qator tuzalgach saytda
har komponent o'z nuri bilan yonadi.
JAVOB: Natijalar → 'ijtimoiy' · SinovDarsi → 'emotsional'
RO'YXAT: Ikki xato qator topilgan · Ikkala tur qo'lda to'g'ri yozilgan · Saytda
uchala tur yondi
YULDUZCHA: Massivga o'z saytingizdan bitta qator qo'shing: komponent, vazifa va tur.
YORDAM: Har qatorning vazifasini o'qing va uch savolni bering. Qaysi qatorda tur savolga mos emas?
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod ko'chirilmaydi — qiymat qo'lda yoziladi. Tuzatish bitta so'z, lekin
uni topish uchun vazifani o'qish kerak — shu darsning o'zi.
```

> 🔴 **87-qonun (o'tilgan material):** m3-01 — sahifa komponentlardan yig'iladi, `<App>` ichida `<Navbar />` kabi teglar (m3-01 «O'z saytingizni bloklardan quring» ekrani) va xato-komponentni topish (m3-01 `DebugChallenge`) · m2-06 — **massiv + obyekt** (`[{ … }]`). Topshiriqda shulardan tashqari hech narsa YO'Q: JSX-funksiya, props (m3-06), `map()`, `useState` — **0**.
> 🔴 **87b (bo'shliq):** m3-01 komponentni **nima ko'rinishi** bo'yicha ajratgan (Navbar, Card). Qaysi komponent **qaysi vazifa uchun** turishini hech bir texnik dars so'ramagan — koding aynan shu bo'shliqni yopadi.
> 🔴 **26-qonun (mexanika almashadi):** P0 (oldingi PM) — to'liq-ekran **kompilyator** (`hikoyaYasa`) · M3-D5 (keyingi PM) — **VS Code-topshirig'i**. Bu dars — **uchinchi mexanika: Debug Challenge**. Ketma-ket takror YO'Q ✓. ⚠️ 3-qonun («real kompilyator») bilan munosabat — GATE S 1-qaror.
> 🔴 **Nima «koding» qiladi (3-qonun ruhi):** o'quvchi haqiqiy kod qatorini o'qiydi, xato qatorni o'zi topadi va qiymatni **qo'lda yozadi** (tanlov-tugma EMAS — `'ijtimoiy'` so'zi klaviaturada teriladi; bo'sh joy, katta-kichik harf va qo'shtirnoq kechiriladi). Textarea YO'Q (3-qonun: yarim-sahifa textarea o'tmaydi) — yozuv-joyi faqat bosilgan qatorning `tur` qiymatida.
> 🔴 **82-qonun:** sarlavha «…digan **kod**» oilasi — «Har komponent vazifasini aytadigan **kod**ni tuzating.» · panel CHAPDA (topshiriq), kod O'NGDA · nusxalash bloklangan · honor-checklist YO'Q — ikkala xato tuzalganda ekran O'ZI bajariladi (real signal, `PRACTICE_BASE+screen`).
> 🔴 **96b ko'prigi:** mashq bajarilgach (oldin EMAS) — «🔗 Loyihaga ko'prik» kartasi: o'quvchining `pm-m3d3-jobs` dagi 3 komponenti **xuddi shu shaklda** (`{ komponent, vazifa, tur }`), faqat o'qish. 40-qonun 3-holat: bo'sh → zaxira-hikoyalar komponentlari; yarim → borlari; to'liq → uchtasi.
> 🔴 **151-qonun:** «Bug Fixer!» — birinchi urinishda ikkala qator ham to'g'ri topilib, to'g'ri yozilsa. «Urinish» = qator bosilib qiymat yozilgan on; xato qatorni bosish ham urinish.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Quiz + Reflection + Flashcard
EKRAN: Ekranga qaramasdan, yoddan aytib bering: hikoyalaringizda qaysi tur
vazifa kam edi va unga qaysi komponent qo'shdingiz? Avval sherigingizga
ayting, keyin bir qatorda yozing.
HARAKAT: (s12) yakuniy testga javob beradi; (s13) juftlikda 1 daqiqa aytadi,
keyin bir qator yozadi; (s15) 10 kartani o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biridan ko'pi turini ayta olmasa — s2 dagi uch savol-kartani
qayta oching va bitta hikoyani birga uch savoldan o'tkazing.
```

> 🔴 **54e:** 2 qadam (ayting + yozing). **76-qonun:** sarlavha — «Hikoyalaringizda qaysi tur kam edi — **yoddan** ayta olasizmi?» · **99-qonun:** s15 da mentor-pufak YO'Q, sarlavha «O'zingizni sinab ko'ring.»

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda saytingizdagi yangi komponentning vazifasini bir oila a'zosiga
o'qib bering va so'rang: «Bu sizga qaysi savolga javob beradi?» Javobini yozing.
HARAKAT: Yakun-ekranidagi topshiriq-kartani ko'radi (3 raqamli qadam + muddat).
JAVOB: —
RO'YXAT: Yangi komponent o'qib berilgan · Javob yozilgan · Tur mos keldimi — belgilangan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Yangi komponentingizning turini bir gapda asoslab yozing.
SOFT: —
MENTORGA: Faqat eslatma — to'liq uy-vazifa paketi alohida (`uyga-vazifa/` · PM uy
vazifasiga bu senariy tegmaydi). Muddat — keyingi darsgacha.
```

> 🔴 **Doira:** bu senariy uy-vazifani faqat **eslatadi** (topshiriq ichida). Paket-senariysi — alohida `M3-D3-JTBD-UY.md` (bu ishga kirmaydi; memory «PM uy vazifasiga tegilmaydi»).
> 🔴 **57-qonun:** yorliqlar hajm bilan — «To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa». **73-qonun:** kelajak-gap faqat MUDDAT bandida. **11-korpus:** yakun-ekranda aynan shu 3 qadam va muddat.

### === BLOK 9: CODESTRIKE ===
```
VAQT: 8
KOMPONENT: Quiz (arena)
EKRAN: —
HARAKAT: 12 savol · har biri 15 soniya · sinf reytingi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: JTBD — mahsulot odam uchun bajaradigan vazifa; uch savol va uch tur
(funksional · ijtimoiy · emotsional); bitta joy uch vazifani birga bajarishi
(Starbucks «uchinchi joy», K18); har vazifa saytda o'z komponentini olishi;
komponentsiz qolgan vazifani topish; kodda noto'g'ri turni tuzatish.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy — ball beriladigan)

> 74-qonun (test-qolipi) · 17-qonun (faqat BITTA himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (savol ≤12 so'z) · 21 (jargonsiz) · 34 (darsga zid emas). **Javob sizmasligi (159/6 · 98b):** to'g'ri variant savol yoki kartochka matnida so'zma-so'z takrorlanmaydi; har test o'zidan oldingi ekranning **aynan o'sha** misolini emas, yangi misolini oladi. Uzunlik-tell ≤1.4× — qurishda o'lchanadi.

| Ekran | INLINE_KEYS | To'g'ri indeks |
|---|---|---|
| s3 · TEST-1 | `s3: 2` | C |
| s5 · TEST-2 | `s5: 1` | B |
| s7 · TEST-3 | `s7: 0` | A |
| s12 · TEST-4 (final) | `s12: 1` | B |
| s4 · s9 · s10 · s11 | `practice: -1` sentinel (12-qonun) | — |

### TEST-1 (s3 — s2 «uch savol»dan keyin) — to'g'ri: **C (2)**
**Savol:** Qaysi sabab «Boshqalar oldida qanday bo'laman?» savoliga javob beradi?
- A. Dars jadvalini bir qarashda bilish
- B. Imtihon oldidan xotirjam bo'lish
- **C.** Sertifikatni sinfdoshlarga ko'rsatish ✅

**Reveal (≤15 so'z):** To'g'ri — bu yerda gap boshqalar sizni qanday ko'rishi haqida.
> Tuzoqlar — qolgan ikki tur (bitta xato-sinf: «turni adashtirish»); hook-kartalari takrorlanmaydi.

### TEST-2 (s5 — s4 saralashdan keyin) — to'g'ri: **B (1)**
**Kartochka:** Markaz yangi xona ochdi: yumshoq kreslo, sokin musiqa. Imtihon oldidan shu yerga kelib, tinchlanib olish mumkin.
**Savol:** Bu xona asosan qaysi tur vazifani bajaradi?
- A. Funksional
- **B.** Emotsional ✅
- C. Ijtimoiy

**Reveal:** To'g'ri — xona odamga tinchlanish hissini beradi: «o'zimni qanday his qilaman?»
> 🔴 **17-qonun tekshiruvi:** xonada boshqalar yo'q (ijtimoiy emas), dars ham o'tilmaydi (funksional emas) — kartochkaning o'zi «tinchlanib olsa» deb qaratib turibdi.

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **A (0)**
**Savol:** Starbucks'dagi qaysi narsa emotsional vazifani bajaradi?
- **A.** Uyda o'tirgandek bemalol bo'lish ✅
- B. Noutbuk ochib, dars tayyorlash
- C. Do'stlar bilan ko'rishib turish

**Reveal:** To'g'ri — bu odamning o'z hissi; dars tayyorlash funksional, ko'rishish ijtimoiy vazifa.
> 🔴 **Bashoratlardan farq:** bashorat-1 «qanday joy», bashorat-2 «nechta tur» deb so'raydi — TEST-3 esa bitta **turni ajratishni** so'raydi (76-qonun mustahkamlash, takror emas).

### TEST-4 (s12 — yakuniy · `scope: final`) — to'g'ri: **B (1)**
**Kartochka:** «Men yangi o'quvchi sifatida o'tgan darsni videoda ko'rishni xohlayman, dars qoldirsam ham xavotir olmaslik uchun.»
**Savol:** Bu hikoyaning natijasi qaysi tur vazifa?
- A. Funksional
- **B.** Emotsional ✅
- C. Ijtimoiy

**Reveal:** To'g'ri — natija «xavotir olmaslik»: bu o'zingizni qanday his qilishingiz haqida.
> 🔴 Yakuniy test ikki darsni bog'laydi: P0 formula-gapi (tanish) + bugungi uch tur. Natija qismi NATIJA bo'lagi sifatida o'qiladi — s9 dagi o'quvchining o'z harakati bilan bir xil.
> 🔴 **55/105:** savol yalang'och (hoshiya/marker YO'Q) · `className="title h-ask"`.

---

## 5. TEORIYA-2 SPETSIFIKATSIYASI (s8 — «Har vazifa — o'z komponenti»)

Sarlavha: «Markaz saytidagi har komponentni bosing.» · Mentor (2 gap, 98a — o'quvchi ko'rgan so'z bilan):
> Sahifa komponentlardan yig'ilishini bilasiz. Endi har komponent qaysi vazifani bajarishini ko'ramiz.

**Sayt-maket (markazning YANGI sayti, 3 komponent):** bosilganda (46-qonun toggle) komponent ustida m3-01 uslubidagi teg-yorliq chiqadi va o'ngdagi nur yonadi.

| Komponent (teg-yorliq) | Ochilganda: vazifa | Nur |
|---|---|---|
| `<Jadval />` | dars vaqtini tez topish | 🔧 |
| `<Natijalar />` | sertifikatni do'stlarga ko'rsatish | 👥 |
| `<SinovDarsi />` | birinchi darsdan qo'rqmaslik | 💗 |

Uchalasi ochilgach xulosa-karta (69):
> **Har vazifa — o'z komponenti.** Uch tur vazifa bo'lsa, saytda uch xil komponent kerak. Komponenti yo'q vazifa bajarilmay qoladi.

> 🔴 **Javob sizmasligi:** s8 vazifalari s10 mehmon-savollari bilan so'zma-so'z bir xil EMAS (s10 — mehmonning o'z savoli, s8 — komponentning vazifasi). s11 kodidagi `vazifa` qatorlari s8 dagi bilan BIR XIL (ataylab — o'quvchi kodda tanish so'zni taniydi, 88-korpus), lekin `tur` bu yerda nur-rangida, kodda so'z bilan — xato qiymatni o'quvchi o'zi o'qib topadi.
> 🔴 **Ekran-budjeti (106):** sarlavha → mentor → maket + nurlar → (bajargach) xulosa. Boshqa blok YO'Q.

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K18 · 91b/33/42/43/56/100)

**Freym:** eyebrow **«☕ Haqiqiy voqea»** · kirish-gapi «Biznes olamidan mashhur voqea:». K-kodi, «keys» so'zi ekranga CHIQMAYDI.
Sarlavha: «Starbucks'da kofe bor — boshqa joyda ham bor. Nega odamlar u yerda soatlab o'tirishadi?»

**4 slayd (hikoya tilida — 42; raqamsiz keys, sana ham yo'q — 10-qonun):**
1. **Kofe hamma joyda bor.** Starbucks'da ham, qo'shni kafeda ham. Lekin odamlar aynan Starbucks'da soatlab o'tirishadi.
2. *(bashorat-1 dan keyin)* **«Uchinchi joy».** Starbucks'ni rivojlantirgan Govard Shuls uni oddiy kofe do'koni qilmadi. U «uchinchi joy» qurdi: uy va ish yoki maktabdan tashqari yana bitta joy — kelib o'tirish, ishlash yoki dars qilish, uchrashish uchun.
3. *(bashorat-2 dan keyin)* **Bitta joy — uch vazifa.** 🔧 Stol va Wi-Fi — o'tirib dars qilish. 👥 Do'stlar bilan uchrashadigan joy. 💗 O'zini uydagidek erkin his qilish. Uchalasi bir joyda.
4. **Ko'prik (91b, 44 — ichki atamasiz):** Markaz ham shunday: sertifikat, sinfdoshlar davrasi va xotirjamlik — uch vazifa bitta joyda. Odamlar qaytib keladigan joy uchala savolga birdan javob beradi.

**Bashorat-1 (2-slayddan oldin, zinapoya — 43):** «Sizningcha, Starbucks o'zini qanday joy deb qurgan?»
- «tez kofe olinadigan joy» · «arzon kofe do'koni» · «kelib o'tiriladigan joy» ✅

**Bashorat-2 (3-slayddan oldin):** «Starbucks odam uchun nechta tur vazifani bajaradi?»
- «bittasini» · «ikkitasini» · «uchalasini» ✅

**Natija-qatori (56/100):** topsa «🎯 Topdingiz! Uchalasini» — quyruqsiz · adashsa «Aslida — uchalasini» · «ball emas» izohi YO'Q · hook-echo YO'Q · tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring» (79).

> 🔴 **Audit 1-band (P0 takrori) yopilishi:** eski 3-slayd «Odamlar pulni ichimlikka emas, joy va muhitga to'laydi» — P0 xulosasining («odam natijani sotib oladi») aynan takrori edi → **olib tashlandi**. Keys endi faqat uch turni ko'rsatadi.
> 🔴 **Keys-sadoqat (10):** bank matni — «третье место между домом и работой/школой: посидеть, поработать, встретиться» — slayd 2 shu uch fe'lni saqlaydi («ishlash yoki dars qilish»: bank sadoqati + o'smir-ko'prigi; «ishlash» fe'l — JTBD-«ish» emas, 13-bo'lim istisnosi). Shaxsiy boylik/raqam YO'Q.

---

## 7. KODING SPETSIFIKATSIYASI (s11 — Debug Challenge)

**Ko'rinish:** chapda topshiriq-panel (32a TaskSpec: 3 chip ≤4 so'z — «Xato qatorni toping» · «Turini qo'lda yozing» · «Saytni tekshiring»), o'ngda kod-oyna (JetBrains Mono, `fmtCode`, nusxalash bloklangan), ostida mini sayt-preview (uch komponent + nurlar).

**Kod (o'qish uchun; faqat `tur` qiymati bosilgan qatorda yozuv-joyiga aylanadi):**

```jsx
// App — markaz sayti shu uch komponentdan yig'ilgan
<App>
  <Jadval />
  <Natijalar />
  <SinovDarsi />
</App>
```

```js
// vazifalar — har komponent qaysi vazifani bajaradi
const vazifalar = [
  { komponent: 'Jadval',     vazifa: "dars vaqtini tez topish",            tur: 'funksional' },
  { komponent: 'Natijalar',  vazifa: "sertifikatni do'stlarga ko'rsatish", tur: 'emotsional' },
  { komponent: 'SinovDarsi', vazifa: "birinchi darsdan qo'rqmaslik",       tur: 'funksional' },
];
```

**Xatolar (2):** 2-qator `tur: 'emotsional'` → **`'ijtimoiy'`** · 3-qator `tur: 'funksional'` → **`'emotsional'`**. 1-qator to'g'ri (bosilsa: «Bu qator to'g'ri: dars vaqtini topish — funksional vazifa.» — urinish sanaladi, 151).

**Preview-mantiq:** har komponent o'z `tur`i rangida; xato qatorda komponent **noto'g'ri nurda** turadi (o'quvchi ko'rib sezadi). Ikkala tuzatishdan keyin uch nur ham yonadi va bitta qator: «✅ Uch komponent — uch tur vazifa.»

**Qiymat-tekshiruvi:** kichik harf · bo'sh joy va qo'shtirnoq kechiriladi · faqat `funksional|ijtimoiy|emotsional` qabul qilinadi; boshqa so'z — «Faqat uch turdan birini yozing: funksional, ijtimoiy yoki emotsional.» (12-korpus: nima noto'g'ri + qanday tuzatish).

**YORDAM (javobni AYTMAYDI — 77-korpus):** «Har qatorning vazifasini o'qing va uch savolni bering.»
**YULDUZCHA (yig'ma chip, default yopiq — 25):** massiv oxiriga bo'sh 4-qator ochiladi — `{ komponent: '…', vazifa: "…", tur: '…' }` uchala maydon o'quvchi tomonidan yoziladi (o'z saytidan). Tekshiruv: uchala maydon bo'sh emas, `tur` uch turdan biri.

> 🔴 **49-korpus:** kod-izohi keyingi harakatni emas, kodning o'zini aytadi (ikki izoh-qator yuqorida) — «xato shu yerda» kabi ishora-izoh YO'Q (98b: javob mashq ustida yozilmaydi).
> 🔴 **88-korpus:** kodda maydon nomlari ekrandagi so'zlar bilan bir xil: `komponent` · `vazifa` · `tur`.
> 🔴 **21-qonun:** `massiv` so'zi ekranga chiqsa — «💡 Yordam — bu so'zlar nima?» chipida gloss (lug'at :239): «massiv — kvadrat qavs ichidagi ro'yxat».

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Nurlar CSS-taymlayn bilan birin-ketin yonadi (18). Statik siluet / `rotate()` TAQIQ. `prefers-reduced-motion`: darhol to'liq holat |
| **s13 REFLEKSIYA** | Juftlik-taymer (1 daqiqa, yakka rejimda ramkasiz — 159/3) + Reflection bir qator (`pm-m3d3-reflection`). Mentor niyatni ochiq aytadi (76) |
| **s14 PODIUM** | Matn etalondan grep bilan (93): jonli «Bugungi g'oliblarimiz», yakka «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q (90) |
| **s15 FLASHCARD** | Mentor-pufak YO'Q (99a). «bosing» yo'rig'i 1-kartada ham YO'Q (159/6) |
| **s16 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 tugal gap (52-korpus) → `CsWordmark` (arena overlay) → uy-vazifa kartasi (3 qadam + muddat, 11-korpus) → nishonlar (mentorda YO'Q — 1-D) |
| **Barcha interaktiv ekranlar** | 47-qonun: s2 · s4 · s8 · s9 · s10 · s11 sarlavhasi buyruq yoki aniq gap — `\?</h2>` shu ekranlarda **0**. Savol-sarlavha ruxsat: s0 · s6 · s13 · testlar (49) |
| **Mentor-diyeta** | teoriya ≤2 gap · yozish/interaktiv ≤1 gap (32b) · mentor javobni aytmaydi (98b) · MentorNote faqat s4/s9/s10 da (20) |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 65-qonun: har savol yonida uni AYTGAN ekran. 9-qonun: seq naqshsiz — to'g'ri indekslar **2,0,3,1,1,3,0,2,3,0,2,1** (har indeks 3 marta, sikl yo'q). Uzunlik-tell ≤1.4× (qurishda o'lchanadi). 21: jargonsiz.

| # | Savol | Variantlar (✅ = to'g'ri) | Manba |
|---|---|---|---|
| 1 | Mahsulot odam uchun bajaradigan narsa nima deyiladi? | narxi · rangi · **vazifasi ✅** · nomi | s2 |
| 2 | «Amalda nima bajariladi?» — qaysi tur savoli? | **funksional ✅** · ijtimoiy · emotsional · hech qaysi | s2 |
| 3 | «Boshqalar oldida qanday bo'laman?» — qaysi tur savoli? | funksional · emotsional · hech qaysi · **ijtimoiy ✅** | s2 |
| 4 | «O'zimni qanday his qilaman?» — qaysi tur savoli? | ijtimoiy · **emotsional ✅** · funksional · hech qaysi | s2 |
| 5 | «Uyga yaqin — avtobussiz boraman» qaysi tur? | ijtimoiy · **funksional ✅** · emotsional · hech qaysi | s4 |
| 6 | «Imtihon yaqinlashsa ham qo'rqmayman» qaysi tur? | funksional · ijtimoiy · hech qaysi · **emotsional ✅** | s4 |
| 7 | «Guruhda eng kuchli bo'lib ko'rinaman» qaysi tur? | **ijtimoiy ✅** · funksional · emotsional · hech qaysi | s4 |
| 8 | Starbucks o'zini qanday joy deb qurgan? | eng arzon kofe do'koni · tez olib ketiladigan joy · **uchinchi joy ✅** · faqat ichimlik do'koni | s6 |
| 9 | Starbucks nechta tur vazifani birga bajaradi? | bittasini · ikkitasini · hech birini · **uchalasini ✅** | s6 |
| 10 | Saytda har vazifani nima bajaradi? | **o'z komponenti ✅** · alohida sayt · yangi rang · yangi nom | s8 |
| 11 | Saytda faqat jadval va narxlar bor. Qaysi tur vazifa bajarilmaydi? | funksional · hech qaysi · **emotsional ✅** · hammasi bajariladi | s10 |
| 12 | Kodda «qo'rqmaslik» vazifasiga `tur: 'funksional'` yozilgan. Nima qilinadi? | qator o'chiriladi · **tur 'emotsional' qilinadi ✅** · vazifa o'chiriladi · hech narsa qilinmaydi | s11 |

> 🔴 **Q11 17-qonun:** to'g'ri javob «ijtimoiy» ham bo'lishi mumkin edi — shuning uchun variantlarda «ijtimoiy» YO'Q, qolgan ikki distraktor funksional-oilasidan (jadval, narxlar — o'zi funksional). Bitta himoyalanadigan javob ✓.
> 🔴 **Q12:** `tur: 'funksional'` kod-bo'lagi — arena `fmtCode` bilan; o'quvchi s11 da aynan shu qatorni tuzatgan.

---

## 10. NISHONLAR (4 ta — 6/101/151-qonun: inglizcha o'yin-nom · tavsif ≤48 belgi · REAL trigger · test bo'lmagan ekranda faqat birinchi urinish)

| Nom | Tavsif (uz) | Belgi | Trigger |
|---|---|---|---|
| **Type Sorter!** | Olti gapni uch turga ajratdingiz | 32 | s4: birinchi to'liq joylash xatosiz |
| **Job Finder!** | Hikoyalaringiz turini aniqladingiz | 34 | s9: `pm-m3d3-jobs` 3 tur + yangi komponent saqlandi |
| **Gap Spotter!** | Komponentsiz vazifani topdingiz | 31 | s10: birinchi to'liq yo'naltirish xatosiz |
| **Bug Fixer!** | Koddagi ikki xatoni tuzatdingiz | 31 | s11: birinchi urinishda ikkala qator |

> 🔴 Mentor rejimida nishon umuman ko'rinmaydi (1-D). `acu-eyebrow` YO'Q (101a). `ACH_TRIGGERS` ↔ `ACHIEVEMENTS` 4/4 (40-qonun).

---

## 11. FLASHCARD (10 ta — old tomoni SAVOL · 76-korpus)

| # | Savol | Javob |
|---|---|---|
| 1 | Mahsulot odam uchun bajaradigan narsa nima deyiladi? | Vazifa (Jobs-to-be-Done — «bajarilishi kerak bo'lgan vazifa») |
| 2 | Funksional vazifa qaysi savolga javob beradi? | Amalda nima bajariladi? |
| 3 | Ijtimoiy vazifa qaysi savolga javob beradi? | Boshqalar oldida qanday bo'laman? |
| 4 | Emotsional vazifa qaysi savolga javob beradi? | O'zimni qanday his qilaman? |
| 5 | «Sertifikat olib, universitetga kirish» — qaysi tur? | Funksional |
| 6 | «Imtihondan qo'rqmay tayyorlanish» — qaysi tur? | Emotsional |
| 7 | Starbucks o'zini qanday joy deb qurgan? | Uchinchi joy — uy va maktabdan tashqari, kelib o'tiradigan joy |
| 8 | Starbucks nechta tur vazifani birga bajaradi? | Uchalasini |
| 9 | Komponenti yo'q vazifa bilan nima bo'ladi? | U bajarilmay qoladi |
| 10 | Hikoyalaringizda qaysi tur kam bo'lsa, nima qilasiz? | Shu tur uchun yangi komponent qo'shaman |

> 🔴 **90(e/f):** javoblar darsdagi ASOSIY so'z bilan bir xil; har karta darsda bor, darsdagi har qoida kartada bor.

---

## 12. RECAPS (4 qator — har biri o'z scored ekranining teoriyasini qayta tushuntiradi)

1. **Uch savol — uch tur** *(s3 ← s2).* Har sababga uch savol beriladi: amalda nima bajariladi — funksional; boshqalar oldida qanday bo'laman — ijtimoiy; o'zimni qanday his qilaman — emotsional.
2. **Savol turni aytadi** *(s5 ← s4).* Gapni o'qing va so'rang: u amalda nima bajarilishi, boshqalar oldida qanday bo'lish yoki qanday his qilish haqidami? Mos kelgan savol turini aytadi.
3. **Bitta joy — uch vazifa** *(s7 ← s6).* Starbucks'da stol va Wi-Fi bor, do'stlar bilan uchrashsa bo'ladi, odam o'zini uydagidek erkin his qiladi — uch tur vazifa bitta joyda.
4. **Har vazifa — o'z komponenti** *(s12 ← s8–s11).* Saytda har vazifani bitta komponent bajaradi. Komponenti yo'q vazifa bajarilmay qoladi — uni hikoyalardan topib qo'shasiz.

---

## 13. 🔴 AUDIT-YOPILISH (6 band — auditor topilmasi → shu senariydagi yechim)

| # | Audit topilmasi | Yopilish (qayerda) | Tekshiruv (grep/o'lchov) |
|---|---|---|---|
| 1 | «Odam mahsulotni emas, natijani oladi» P0 da o'rgatilgan (`PmUserStoryLesson.jsx` :113, :1008, K11) — JTBD uni qayta o'rgatadi | P0 ga **bitta gap** bilan tayanadi (s2 mentori). O'zak — **uch tur** (P0 da yo'q). Eski drel-RECAPS, «formada bo'lish» TEST-1, Starbucks «ichimlikka emas, joyga to'laydi» slaydi, arena Q1–Q3 olib tashlandi | `grep -nE "natijani (sotib )?oladi\|drel\|devorga rasm\|formada bo'lish"` → faqat s2 mentori (1 ta) |
| 2 | Ekran-ketma-ketligi P0 klon (`SCREEN_META` :79–98 ↔ P0 :84–100); `peer`, `clinic`, MatchPairs band; `priority` P0 va PmLesson8 ni takrorlaydi | Yangi 17-ekran oqimi (2-bo'lim, FARQ jadvali 14-A). `peer` · `clinic` · `priority` · MatchPairs · ustaxona-bittalab-yozish **0**. TEKSHIRUV — yangi yo'naltirish-simulyatsiyasi (s10) | `grep -nE "id: '(peer\|clinic\|priority)'\|MatchPairs"` → 0 |
| 3 | Koding: PmLesson8 VS Code, P0 kompilyator — boshqa va o'tilgan doirada bo'lsin (props m3-06 da) | **Debug Challenge** (s11): `<App>` teg-ro'yxati (m3-01) + massiv-obyekt (m2-06); xato `tur` qiymati qo'lda yoziladi. Props · JSX-funksiya · `map` · `useState` 0 (87-qonun) | `grep -nE "props\|\.map\(\|useState\|function [A-Z]" ` kod-namunasida → 0 |
| 4 | Misol-olam generik (drel, quloqchin/velosiped/telefon); 3-Modul iplariga bog'lanmagan; 95 | Bitta ip — **maktab yonidagi ingliz tili markazi sayti** (3-Modul «maktab yonidagi joy sayti» oilasi). Kirish — `pm-m3d2-stories`: har hikoyaning NATIJAsi uch turga ajratiladi (s9). Starbucks faqat freymli keys (K18) | `grep -nE "quloqchin\|velosiped\|telefon\b\|drel\|krossovka"` → faqat hook-savolidagi «Telefonda» (1 ta) |
| 5 | 7-Modul konteksti: MVP, custdev, «keyingi dars — mijozlar bilan suhbat» (73), «o'z MVP'i» | Hammasi olib tashlandi; kelajak-bog'lam faqat uy-vazifa MUDDATida | `grep -niE "mvp\|custdev\|suhbat\|keyingi darsda"` → 0 (MUDDAT «keyingi darsgacha» — ruxsat) |
| 6 | JTBD qoidasi (2026-07-27): ko'rinadigan matnda «ish» → «vazifa»; raqibsiz | Bosh so'z «vazifa» (s2 glossi); yollash-metafora ham YO'Q; raqib-maydoni, «raqib», «o'rniga nima olardi» 0 | `grep -nE "\bish\b\|ISH\b\|raqib\|yolla"` o'quvchi-matnda → 0 (`ishonch`, `ishlash` fe'li — istisno) |

---

## 14. FARQ-DALILI VA QAYTA ISHLATILGAN QISMLAR

### 14-A. FARQ-DALILI (klon emasligi)

| Solishtiruv | Farq |
|---|---|
| 🔴 **P0 `PmUserStoryLesson` (M3-D2) dan** | P0: hikoya → **uch bo'lak** (KIM/NIMA/NATIJA) · ustaxona YOZADI · peer/klinika/prioritet · kompilyator · K11 milkshake. M3-D3: NATIJA bo'lagini → **uch tur** · o'quvchi AJRATADI va komponent NOMLAYDI · yo'naltirish-simulyatsiyasi · Debug Challenge · K18. Ekran-oqimi: TEST-1 darhol s2 dan keyin (P0 da s3 konstruktordan keyin) · keys oqim o'rtasida (s6) · teoriya-2 (komponent) · yakuniy test (P0 da yo'q) · flashcard ekrani |
| 🔴 **Eski `PmJtbdLesson` (m7-02) dan** | Starbucks hook → **markaz hook** · shtamp-karta «✓ YOLLANDI» → **uch nur** · 3 umumiy mahsulot (quloqchin/velosiped/telefon) → **o'quvchining 3 hikoyasi** · MatchPairs TEST-3 → TestQ · peer/clinic/priority → YO'Q · VS Code `JtbdCard` (props) → Debug Challenge (props'siz) · «MVP», «suhbat» → 0 · 17 → 17 ekran, lekin oqim boshqa |
| 🔴 **M3-D5 `PmLesson8` (keyingi PM) dan** | M3-D5: ikki o'qli doska, kartani katakka joylash, hafta-chizig'i, VS Code, o'yin-klub. M3-D3: savol-uyalari (tartib/sig'im yo'q), yo'naltirish, Debug Challenge, ingliz tili markazi. M3-D5 hikoyalarni `pm-m3d2-stories` dan o'zicha o'qiydi — bu dars zanjirni **buzmaydi** (u kalitga yozmaydi) |
| 🔴 **m3-01 `ReactIntroLesson` (oldingi texnik) dan** | m3-01: sahifani komponentlarga ajratish (nima KO'RINADI). M3-D3: har komponent qaysi VAZIFA uchun (nima uchun TURADI) — 87b bo'shlig'i. `DebugChallenge` primitivi o'sha darsdan tanish — o'quvchi mexanikani biladi, mazmun yangi |

### 14-B. `PmJtbdLesson.jsx` dan QAYTA ISHLATILADIGAN yaxshi qismlar

| Qism | Holat |
|---|---|
| `JOB_TYPES` uch tur + qisqa savol-gloss (:782) | ✅ olinadi — savollar yangilanadi: «Boshqalar ko'zida qanday ko'rinaman» → «Boshqalar oldida qanday bo'laman?» (tegishlilikni ham qamraydi) |
| K18 slaydlari + 2 bashorat (:867–880) | ✅ olinadi — 3-slayd («ichimlikka emas») olib tashlanadi, «Uch vazifa birga» kuchaytiriladi, ko'prik markazga |
| `Screen3` joylash-mantig'i (`placed`/`sel`/`miss`, F-0914-10 himoyasi) | ✅ s4 saralash uchun (3 → 6 gap) |
| 46-qonun `opened`/`seen` toggle juftligi | ✅ s2, s8 |
| Jonli-ball skeleti, `AchCtx`, `ccProgress`, `AchCounter`, podium/arena/summary tuzilmasi | ✅ o'zgarmaydi (1-B umumiy relslar) |
| Artefakt-strip naqshi (custom event) | ✅ nomi «Vazifalarim», kalit `pm-m3d3-jobs` |
| `DEMO_JTBD`, drel/formada RECAPS, `JtbdCard` koding, `peer`, `clinic`, `priority`, MatchPairs, `MVP_KEY`, yollash-shtampi | ❌ o'chiriladi (o'lik kod qoldirilmaydi — 26) |

---

## 15. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3** ✓
4. Blok 8: EKRAN + QISQA_VARIANT ✓
5. Bosh keys K18 — 3-Modulda band emas ✓
6. TEKSHIRUV (yo'naltirish) M3-D2 mexanikasidan (Hotspot/peer/klinika) farq qiladi ✓
7. «Sen» — **0** ✓
8. SOFT **aynan bitta blokda** (5) ✓

**PM_DARS_ETALON / DARS_ETALON darvozalari:**
- 91/108 bitta ip: markaz — s0…s16; keys freym bilan kiradi, ko'prik bilan qaytadi ✓
- 95: o'smir o'quv markaziga o'zi boradi ✓ · 96c: ip — o'quvchining hikoyalari (kirish) va `pm-m3d3-jobs` (chiqish); demo yangi ✓
- 26/87: koding-mexanika uchinchi tur; faqat m3-01 teglari + m2-06 massiv-obyekt ✓
- 73: «keyingi darsda» ekranlarda 0 ✓ · 29: kelajak-atama (props, state, prioritet) 0 ✓
- 5.8: personaj/ism 0 — gaplar ismsiz, vazifani Mentor beradi ✓
- 109/111: mentor ≤2 gap (interaktivda 1) · har ekran ≤4 blok · olib-tashlash testi qurishda ✓
- 151: 3 amaliy nishon — birinchi urinish; `AchRule` qatori oldindan ✓
- 159: stripe/kesik chiziq/bo'sh-ramka/ico-emoji/qora tugma YO'Q; bir ma'no bir marta (sarlavha ↔ takeaway) ✓
- 17/159-6 javob sizmasligi: har test yangi misolda; distraktor — qolgan turlar ✓
- 22 sanoq: hook 3 · s2 3 · s4 6 · s8 3 · s9 3+1 · s10 4 mehmon/3 komponent · koding 2 xato/3 qator · flashcard 10 · arena 12 ✓
- Ekran-matni ≤400 proza: eng zich — s2 (~390 proza); qurishda Intl.Segmenter ✓

---

## 16. [GATE S] — FOYDALANUVCHI QARORLARI (ochiq)

| # | Qaror | Tavsiya |
|---|---|---|
| 1 | 🔴 **Koding = Debug Challenge (qo'lda qiymat yozish), kompilyator/VS Code EMAS.** 3-qonun «har darsda real kompilyator» deydi; 26-qonun VS Code'ni qo'shgan. Ketma-ketlik P0 kompilyator → **?** → M3-D5 VS Code — ikkalasi ham qo'shni bo'lib qoladi. Muqobillar: (a) Debug Challenge (tavsiya — o'quvchi haqiqiy kodni o'qiydi, xatoni topadi, qiymatni teradi); (b) to'liq-ekran kompilyator + massivni to'ldirish (P0 bilan ketma-ket kompilyator); (c) VS Code (M3-D5 bilan ketma-ket) | **(a)** |
| 2 | 🔴 **Misol-olam: yangi «ingliz tili markazi», o'yin-klub EMAS.** O'yin-klub JTBD'ga juda mos (uchinchi joy!), lekin M3-D5 ning bosh-misoli — ikki dars keyin takrorlanadi (96c(b/e)). Muqobil: o'yin-klubni olish va M3-D5 ni «shu klub uchun nimani birinchi qilamiz» deb ulash (96a modul-ipi) | **Markaz** |
| 3 | 🟡 **TUR = ARALASH, ustaxona-yozuv yo'q.** 1-B JTBD ni 2-TUR namunasi deb ko'rsatadi (ustaxona majburiy). Bu senariyda o'quvchi o'z hikoyalarini **ajratadi** va komponent nomlaydi — uzun matn yozmaydi; o'z hikoyasiga tanlangan tur avtomatik tekshirilmaydi (faqat echo-qator). Muqobil: s9 ga «nega shu tur?» sabab-maydoni qo'shish (yozuv +3) | ARALASH |
| 4 | 🟡 **App.jsx joylashuvi:** yangi dars `m3-02` va `m3-03` orasiga tushadi — kalit (`m3-02b` yoki keyingi darslar raqami siljishi) va `m7-02` o'rnining taqdiri; M3-D5 senariysidagi «O'tgan darsda yozgan uchta hikoyangiz» gapi endi ikki dars oldingi darsga ishora qiladi (M3-D5 EKRAN-matni tahriri kerakmi?) | foydalanuvchi |
| 5 | 🟡 **Sarlavha:** title «Bitta natija, uch xil sabab» · sub «funksional, ijtimoiy, emotsional vazifa» (v9 sarlavhasi inglizcha atama — korpus §20 bo'yicha sarlavhaga chiqmaydi) | taklif |
| 6 | 🟡 **Bashorat-2 ↔ arena Q9** bir xil fikr («uchalasini») — 76-qonun mustahkamlash deb qoldirildi | qoladi |

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–111) · DARS_ETALON (108/109/111/151/159, 5.8) · MATN_KORPUS · PM_KEYS_MEXANIKA_REGISTRI bo'yicha yozildi. Keyingi qadam: `pm-metodist` SENARIY-KORREKTURA → **[GATE S]** → registrga qator (5-bo'lim: imzo «UCH NUR» · TEKSHIRUV «mehmonni yo'naltirish» · koding «Debug Challenge» · olam «ingliz tili markazi»).*

---

## METODIST KORREKTURASI (2026-09-28)

**Nima o'zgardi (oldin → keyin):**
- s2 mentor: «…deb bilasiz. Bugun shu natijani vazifa deb ataymiz» (natija ↔ vazifa aralashgan, «deb bilasiz» kalka) → «Oldingi darsda ko'rdingiz: … natijani oladi — bu JTBD g'oyasi. Bugun mahsulot odam uchun bajaradigan shu narsani vazifa deb ataymiz.»
- s2 xulosa: 3-gap qisqardi («…shuning uchun unga pul to'lashadi» ketdi) → ekran 433 → **396 grapheme**.
- s1 EKRAN: «har natija qaysi turga kirishini ajratamiz» (g'aliz, «tur» hali tanishtirilmagan) → «odamlar nima uchun kelishini uch turga ajratamiz». Preview «sinfdoshlardan qolmaslik» → «…orqada qolmaslik».
- s9 YORDAM + RECAPS-2: «Qaysi biriga «ha» desangiz» — uch savol «ha/yo'q» savoli EMAS, mantiq buzuq edi → «u amalda nima bajarilishi, boshqalar oldida qanday bo'lish yoki qanday his qilish haqidami?». RO'YXAT 3-band 6 → 4 so'z.
- s4 xato-hint mazmunli qilindi; s8 sarlavha «blok» → «komponent» (bir tushuncha, bir atama); s11 «Preview» jargoni → «Saytni tekshiring»/«Saytda»; s11 sarlavhasi tavtologiyasiz.
- K18: «qurgan … kofe nuqtasi» (kalka, fakt noaniq) → «rivojlantirgan Govard Shuls … kofe do'koni»; bank fe'li «ishlash» tiklandi («ishlash yoki dars qilish»); «uydagidek erkin his qilish» → «o'zini uydagidek…» (to'ldiruvchisiz fe'l); «odamga … bajaradi» → «odam uchun».
- TEST-1 A uzunligi (tell 1.48× → 1.16×). TEST-3: variantlar 3-slayddan so'zma-so'z edi (javob sizishi 159/6) → qayta ifodalandi. TEST-4: natija s8/s11 dagi «birinchi darsdan qo'rqmaslik» bilan bir xil edi → yangi misol «dars qoldirsam ham xavotir olmaslik». Indekslar o'zgarmagan.
- Arena Q10 («vazifa nimani oladi») → «har vazifani nima bajaradi?»; Q12 «hech narsa» → «hech narsa qilinmaydi». Flashcard-7 va RECAPS-3 bank bilan moslandi.

**Ochiq savollar:**
1. 🔧 «Amalda nima bajariladi?» — qolgan ikkitasi 1-shaxsda, bu majhul nisbatda; 13 yoshga quruqroq. Taklif: **«Menga amalda nima beradi?»** (kaskad: s2, testlar, arena, flashcard). 👥 va 💗 tushunarli — qoladi.
2. Uy-vazifa: oila a'zosiga «Bu sizga qaysi savolga javob beradi?» deyish — u uch savolni bilmaydi. Taklif: uch savolni o'qib berib, qaysi biri mos kelishini so'rash (paket alohida — tegilmadi).
3. TEST-2 kartochkasidagi «tinchlanib olish» javobga juda yaqin — tanib olish uchun ataylab qoldirildi.

---
## ✅ GATE S — TASDIQLANDI (2026-09-28 10:33, foydalanuvchi; hamma javob tavsiya bo'yicha)
Javoblar: `PM_PIPELINE_STATE.md` F-0928-06 yozuvi. Quruvchi shu senariyni metodist korrekturasi bilan birga qo'llaydi.
