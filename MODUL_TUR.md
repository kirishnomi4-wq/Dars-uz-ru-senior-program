# 🖥 MODUL-TUR — ekranda tekshiriladigan bandlar

> **Tur:** HOLAT. Bu ro'yxat — **tuzatish ro'yxati emas**, kuzatuv ro'yxati.
> Har dars sikli yakunida auditning «EKRAN-XAVF» bandlari shu yerga **dars-raqami bilan**
> yoziladi. Dars konveyeri to'xtamaydi; foydalanuvchi **modul oxirida bir yo'la** tekshiradi.
>
> **Nima kiradi:** koddan hukm chiqarib bo'lmaydigan narsa — layout torlik, sensor-muammo,
> rang-his, metafora-tabiiyligi, diqqat qayerga tushishi.
> **Nima KIRMAYDI:** koddan aniq ko'rinadigan nuqson — u audit-hisobotiga tushadi va
> darsning o'z siklida tuzatiladi. Bu faylga «ehtimol muammodir» deb yozib qo'yish —
> tuzatishdan qochish emas: agar kod-fakt bo'lsa, joyi bu yer emas.
>
> **Jarayon (foydalanuvchi qarori, 2026-08-20):** dars sikli **skrinshot-tursiz** yuradi.
> Istisno — birinchi PM dars (m4-02) va yangi mock-ilova birinchi chiqqan dars: ular
> yopilgach konveyer **TO'XTAYDI**, 5–6 skrinshotlik mini-tur bo'ladi, keyin davom etadi.

---

## 📇 KO'RIK-XARITASI (2026-08-21 · ikkala sessiya birlashtirildi)

**21 dars · 147 band.** Ro'yxat **yagona ko'rik-hujjati** — ikkala sessiyaning
EKRAN-XAVF bandlari dars-belgilari bilan shu yerda turadi.

| Modul | Dars | Band | Darslar (band soni) |
|---|---|---|---|
| **4-MODUL** | 11 | **78** | m4-01(7) · m4-03(7) · m4-05(7) · m4-06(7) · m4-04(7) · m4-13(8) · m4-14(7) · m4-09(7) · m4-08(7) · m4-10(7) · m4-11(7) |
| **4A-MODUL** | 3 | **20** | 4a-01(5) · 4a-02(8) · 4a-03(7) |
| **4B-MODUL** | 2 | **14** | 4b-01(7) · 4b-02(7) |
| **4C-MODUL** | 5 | **35** | 4c-01(7) · 4c-02(7) · 4c-03(7) · 4c-04(7) · 4c-05(7) |
| **Jami** | **21** | **147** | |

### Ko'p uchraydigan band-sinflari (ko'rik tartibini rejalash uchun)

| Sinf | Nima so'raladi | Qayerda ko'p |
|---|---|---|
| **layout torlik** | tor ekranda sig'adimi, qirqilmaydimi | 4-MODUL (kod oynalari, input'lar) |
| **sensor** | sudrash sensorli ekranda ishlaydimi; tap-yo'li bormi | m4-01 · m4-05 · 4b-02 · 4a-02 · 4c-02 |
| **rang-his** | ikki issiq rang, xira nishon, kontur yorliq | hamma modulda |
| **metafora-tabiiylik** | obraz o'smirga tabiiy tuyuladimi, **uzilmaganmi** | 4a (restoran) · 4c (lenta) |
| **diqqat** | nima diqqatni tortadi; klapan-ipuchalar ko'paymaydimi | 4a · 4c (klapan zich) |
| **his-tuyg'u** | marosim yetarlimi yoki ortiqchami (141-qonun) | 4a-03 · 4c-01 · 4c-02 |
| **pedagogika** | qiyinlik zinapoyasi tik emasmi | 4a-03 · 4c-02 |

### 🔴 Modul-bo'ylab bitta savol — metafora-uzluksizligi

Ikki olam ikki modulda uzluksiz bo'lishi kerak; o'lchovlar **kodda** olingan, hukm **ekranda**:

- **4a — restoran olami:** «restoran» 25 → 4 → 6, lekin «mijoz» 29 → 23 → **43**.
  Nomi tushdi, aholisi qoldi. Uzilganmi yoki atamaga aylanganmi?
- **4c — uchish lentasi olami:** «lenta» 136 → 60 → 95 → 47 → 72. Lug'at 4c-01 da e'lon
  qilinadi (START SIGNALI · SEYF · LENTA JURNALI), TABLO endi 4c-02 da (F-407).
  Atama-nomlari modul bo'ylab **bir xilmi**?

---

## 4-MODUL

**Holat:** ochiq · tur qilinmagan · commit modul-tur tugagach bitta to'plam bilan.

### m4-01 · `DataIntroLesson` (etalon, 🔒 muhrlangan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `Screen15` sxema-kanvasi **700×392 qattiq o'lchamda** | telefonda `Zoomable` ichida o'qiladimi | layout torlik |
| 2 | 🔁 **TAKRORLANUVCHI** — `.cdrag-*` sudrash (HTML5 `draggable`) | **sensorli ekranda ishlamaydi**; muqobil (bosish-bosish) kerakmi. **Endi ikki darsda** (m4-01 s6b · m4-05 s13) → bu alohida band emas, **modul-mexanika savoli**.<br>✅ **YECHIM-NAMUNA TAYYOR:** `src/4-Modull/RoutingLesson.jsx` → `ScreenDoorMatch` (yangi s15 final ekrani, D1-B). Bosish-bosish: kartani bos → nishonni bos; `draggable` umuman yo'q, har xato juftlik o'z izohini beradi. Naqsh-manba: m4-01 `Screen15` `clickField`.<br>**Turda solishtiring:** s6b/s13 sudrash va yangi s15 bosish — qaysi biri telefonda ishonchli | sensor-muammo |
| 3 | `Screen10` — 3 ta `TableCard` gorizontal | **560px dan tor** ekranda sig'adimi | layout torlik |
| 4 | `.live-badge` endi **xira (0.62)** | sarlavhani bosmayaptimi (130-qonun) | diqqat |
| 5 | `Screen11` — RU rejimda jadval nomi ataylab **lotincha** (`t.uz.split`) | g'alati ko'rinmaydimi | rang-his / tabiiylik |
| 6 | `hw-big` kapsulasidagi **suzuvchi so'zlar** | sarlavhani o'qishga xalaqit bermaydimi | diqqat |
| 7 | `.pick-row` endi **ikki qatorli** (nom + sabab, F-0820-103) | Screen13 da **beshta** qator sig'adimi | layout torlik |

### m4-03 · `DbSqlNosqlLesson` (yopilgan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s0 hook — SQL/NoSQL ikki ko'rinish **almashadi** | almashuv sezilarlimi; o'quvchi ikkalasini ham ko'rganini biladimi | diqqat |
| 2 | `.ai-badge` «Do'st» qora fondan `.peer-badge` (`T.ink2`) ga o'tdi | chat-sahnada AI (ko'k) va odam (neytral) **ajralib turadimi** | rang-his |
| 3 | s11 `cmp-row` taqqoslash (`DbBadge` + matn, ikki qator) | **560px dan tor** ekranda sig'adimi | layout torlik |
| 4 | s7 chat-oqimi — sanoqchi **1 240 489 → 1 240 505** + oqib turgan xabarlar | telefonda o'qiladimi yoki shunchaki shovqinmi | diqqat |
| 5 | `.live-badge` CSS qo'shildi (0.62) | krem fonda (`#F6F4EF`) yetarlicha xiramimi | rang-his |
| 6 | Markaziy metafora **«quti ↔ paket»** (SQL vs NoSQL qadog'i) | o'smirga ikki qadoq farqi tabiiy tuyuladimi | metafora-tabiiylik |
| 7 | `.hint` uzuqdan solid'ga o'tdi | uzuq chiziqsiz ham **maslahat** ekani ajralib turadimi | rang-his |

### m4-05 · `RoutingLesson` (yopilgan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s15-praktika — **6 bandlik** checklist (m4-01 da 5) | telefonda ro'yxat uzun emasmi | layout torlik |
| 2 | `.live-badge` CSS qo'shildi (0.62) | krem fonda sezilarli xiramimi | rang-his |
| 3 | 🔁 **TAKRORLANUVCHI** — s13 `.dd-slots` sudrash (HTML5 `draggable`) | sensorli ekranda ishlamaydi. **Yechim-namuna endi shu darsning o'zida:** yangi s15 final ekrani `ScreenDoorMatch` — bosish-bosish. **Turda yonma-yon solishtiring:** s13 (sudrash) va s15 (bosish) | sensor-muammo |
| 4 | Markaziy metafora **«eshik + shtamp + manzil»** | uch element bir vaqtda — o'smirga tabiiy tuyuladimi yoki ko'pmi | metafora-tabiiylik |
| 5 | s14 «to'rt qoida» ekrani | to'rt band bir ekranga sig'adimi (109-qonun, TMI) | diqqat |
| 6 | `.hint` solid bo'ldi | maslahat ekani ajralib turadimi | rang-his |
| 7 | 🆕 **YANGI s15 `ScreenDoorMatch`** — 3 karta + 3 nishon, xato juftlikda feedback-matn pastda chiqadi | (a) tanlangan karta holati (`.rq-card.sel`) yetarlicha ko'rinadimi · (b) feedback pastda chiqqanda o'quvchi uni **payqaydimi**, yoki skroll ostida qoladimi | diqqat / layout |

### m4-06 · `PostgresCrudLesson` (yopilgan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | SQL kod oynalari (`CODE.bg`, **3 joyda**, endi `data-dark-ok` bilan belgilangan) | krem sahifada uch qora to'rtburchak — diqqatni kontentdan tortmaydimi | diqqat / rang-his |
| 2 | `.live-badge` CSS qo'shildi (0.62) | krem fonda yetarlicha xiramimi | rang-his |
| 3 | 🆕 **«Siz» yorlig'i** qora fondan **`.you-badge`** (accent-kontur) ga o'tdi | suhbatda **AI (ko'k to'liq)** va **o'quvchi (accent kontur)** navbatlari ajralib turadimi; kontur yorlig'i yo'qolib ketmaydimi | rang-his |
| 4 | Markaziy metafora **«do'kon · menejer · smena»** | SQL bilan bog'lanishi o'smirga tabiiy tuyuladimi | metafora-tabiiylik |
| 5 | s15 SQL Editor ekrani | telefonda kod yozish maydoni yetarlimi | layout torlik |
| 6 | `.hint` uzuqdan solid'ga o'tdi | maslahat ekani ajralib turadimi | rang-his |
| 7 | 12 savolli arena + **5 nuqtali** podium | natija ekrani torlikda buzilmaydimi | layout torlik |

### m4-04 · `NodeServerLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s2 `storefront` navbati: 3 emoji + «n/3 xizmat ko'rdi» + tovar-pufak 🛍️ | telefonda bir qatorda sig'adimi, pufak qirqilmaydimi | layout torlik |
| 2 | `.store-sign.open` neon-puls (2.3s cheksiz) — s2 · s10 · s13 · s14 · praktika | bir ekranda tablo + `tap-hint` + `fade-up` birga — sarlavhadan diqqatni tortmaydimi | diqqat |
| 3 | s6 `code-box` `lineHeight: 2`, 5 bosiladigan `span` (endi **5/5** shart, F-0820-155) | sensorda 5 kichik nishon aniq bosiladimi | sensor |
| 4 | s15 `.vsc-input` — bir qatorli input, 60+ belgili javob | mobil/tor ekranda gorizontal siljiydimi, placeholder o'qiladimi | layout torlik |
| 5 | s13 `store-build` (📦 🛒 🚪 → tablo) — kulrang → rangli | bosqich «jonlanishi» sezilarlimi | rang-his |
| 6 | `.live-badge` endi **xira (0.62)** (F-0820-150) | sarlavhani bosmayaptimi (130-qonun) | diqqat |
| 7 | npm obrazi «asboblar do'koni» → «tayyor paketlar to'plami» (F-0820-154); s8 endi bitta karta-bosish | yangi so'z tabiiy eshitiladimi; s8 «bo'sh» tuyulmaydimi | metafora-tabiiyligi |


### m4-13 · `FullstackProjectDayLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `.pgrid` 4 ustun qattiq, `.spot` min 80px — `split` ichida 2-ustunda (s6 · s9 · s11 · s14) | telefonda 8 plitka + hisoblagich sig'adimi | layout torlik |
| 2 | `.spot-tag` **8px**, `.spot-plate` **8.5px** matn | 13 yoshli telefonda «BAND/BO'SH» va raqamni o'qiy oladimi | layout torlik |
| 3 | Band plitka: qizil `T.danger` + tanlanganda `spot-sel` **accent** halqa | ikki «issiq» rang yonma-yon — tanlov ko'rinadimi, accent-raqobat bormi | rang-his |
| 4 | Har ekranda `GuardPanel` mount → 8 plitka `spot-in` stagger + `gst-bump` + `guard-sum-pop` (8 ekran) | qayta-qayta ko'rilganda charchatmaydimi | diqqat |
| 5 | s0 `paper` daftar — `shake` har bosishda, yozuvlar kursiv | «chalkashlik» hissi chiqadimi yoki shunchaki chiroyli ko'rinadimi | metafora-tabiiyligi |
| 6 | s16 `vsc-input` — 30+ belgili javob bir qatorda; placeholder endi «jadval.ustun = jadval.ustun» (B3) | tor ekranda gorizontal siljiydimi; shakl-placeholder tushunarlimi | layout torlik |
| 7 | `OpeningAct` — p4 «Bajardim» ostida oqim ichida, 2.8 s akt (B1, F-0820-174) | tugma ostida ko'rinadimi, skroll kerakmi; shlagbaum ko'tarilishi sezilarlimi | diqqat |
| 8 | s8 aniqlashtiruvchi-beat (B2): AI chala kod → `frame-warn` ko'rsatma → follow-up → tuzatilgan kod | o'quvchi «nima yetishmayotganini» o'zi topadimi yoki ko'rsatmani o'qib o'tadimi | metodika-tabiiyligi |


### m4-14 · `FullstackFeedbackLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s5 pointer-drag — `.vcard`da `touch-action` yo'q (tap-fallback bor) | sensorda sudrash sahifa-skroll bilan to'qnashmaydimi | sensor |
| 2 | `TrackerStrip` s7 dan yakungacha (B2), `trk-rail` +≈30px | telefonda kontent balandligi yetadimi; s7 da «tug'ilishi» sezilarlimi | layout torlik / diqqat |
| 3 | s11 20 joy → `cols = 5`, `.spot-sm` | 5 ustunli kichik plitkalar telefonda o'qiladimi | layout torlik |
| 4 | `.dash` uch karta bir qatorda (s8+) | tor ekranda raqamlar siqilmaydimi | layout torlik |
| 5 | `SettingsDrawer` `absolute` panel ichida | tor panelda drawer chetidan chiqmaydimi | layout torlik |
| 6 | s5 kataklar dashed + chiplar: Q1 yashil · Q2 **binafsha `#7C5CBF`** (B1) · Q3 ko'k · Q4 kulrang; avatarlar Aziz teal / Bek binafsha | 4 katak bir qarashda ajraladimi; binafsha ikki rolda (Bek + Q2) chalg'itmaydimi | rang-his |
| 7 | s0 «Aziz» `frame-warn` + 🟥 joy darrov bo'shashi | «xato bo'ldi» hissi chiqadimi, yoki oddiy chiqarish bo'lib ko'rinadimi | metafora-tabiiyligi |


### m4-09 · `ApiPostmanLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `.pm-bar` bir qatorda: 4 method-tugma + URL + Send (s15 `methodPicker`) | 360px da sig'adimi, URL qisqaradimi | layout torlik |
| 2 | `.status-badge` `rotate(-3.5deg)`, 11.5px uppercase | qiya shtamp matni o'qiladimi | layout torlik |
| 3 | POST ekranlarida accent ×3: `Send` + POST badge + `.pm-app::before` nuqta | «bitta maketda bitta accent» — ko'z qayerga tushadi | rang-his |
| 4 | s11 `jflow` 4 bekat + konvert izi tor ekranda | bekat nomlari va 📨 izi sig'adimi | layout torlik |
| 5 | s3 zonalar pool **ostida** — sudrab pastga tushish | sensorda skroll bilan to'qnashmaydimi (`touch-action: none` bor) | sensor |
| 6 | `.shop-card` 4 karta bir qatorda (s0) | telefonda 2×2 ga o'tadimi | layout torlik |
| 7 | B1 dan keyin DELETE/404 `T.danger` vs accent yonma-yon (s8 badge + Send) | ikki issiq rang ajraladimi | rang-his |


### m4-08 · `BackendCrudPracticeLesson` (yopilgan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | Praktika checklisti **6 band** | telefonda uzun emasmi | layout torlik |
| 2 | `.vbadge` **kontur uslubga** o'tdi (`id` = to'ldirilgan accent) | `id` qolganlaridan ajralib turadimi | rang-his |
| 3 | «Siz» → `.you-badge` | AI/o'quvchi navbatlari farqlanadimi | rang-his |
| 4 | `.rp.full` porlashi o'rovchiga ko'chdi | «to'ldi» signali hamon sezilarlimi | diqqat |
| 5 | Markaziy metafora (**AvtoIjara — mashinalar ro'yxati**) | CRUD bilan bog'lanishi tabiiymi | metafora-tabiiylik |
| 6 | 🆕 **KLAPAN 4 ekranda** (13-band birinchi qo'llanish) | ipucha 40 s/25 s da chiqadi — **erta emasmi yoki kechmi**; rescue 110 s da yo'l ochadi | mexanika |
| 7 | `.hint` solid bo'ldi | maslahat ajralib turadimi | rang-his |

### m4-10 · `FullstackConnectPracticeLesson` (yopilgan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `.bridge.live` va `.gate.open` — kirish o'rovchiga ko'chdi | «ulanish» va «eshik ochilishi» hamon sezilarlimi | diqqat |
| 2 | 3 ta inline qora ketdi (`.you-badge` + ikki `ink3`) | «hali emas» holati endi **xato** kabi ko'rinmaydimi | rang-his |
| 3 | 🆕 **KLAPAN 9 ekranda** — eng katta qamrov | ipucha-shovqin yo'qmi (klapan mustaqil, faqat joriy ekranniki) | diqqat |
| 4 | Markaziy metafora (**ko'prik: front ↔ back**) | o'smirga tabiiymi | metafora-tabiiylik |
| 5 | Ikki dastur bir vaqtda (`:5173` + `:3000`) | ekranda ikkalasi ham ko'rinadimi | layout torlik |
| 6 | 9 ta qulf-yorlig'i (**allaqachon mazmunli edi**) | matnlar tugmaga sig'adimi, telefonda ikki qator bo'lmaydimi | layout torlik |
| 7 | `.hint` solid bo'ldi | maslahat ajralib turadimi | rang-his |

### m4-11 · `AuthEnvLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `.gq-seg` qora tasma (`T.ink`) — s7 da 5 kartada (bilaguzuk obrazi, ataylab) | og'ir tuyulmaydimi, bilaguzuk deb o'qiladimi | rang-his |
| 2 | s7 bir kartada 5 animatsiya (slide · segment-yonish · shlagbaum · 401 muhr · nuqta-puls) | diqqat hukm-tugmalarida qoladimi | diqqat |
| 3 | `.tokencard` JWT 3 segment — telefonda `overflow-x: auto` | nuqtalar bilan bo'lingan token o'qiladimi, siljiydimi | layout torlik |
| 4 | s6 `authtoggle` checkbox 15px | sensorda bir bosishda belgilanadimi | sensor |
| 5 | s11 `aflow` 6 tugun bir qatorda (`flex-wrap`) | tor ekranda qatorga bo'linganda tartib saqlanadimi | layout torlik |
| 6 | `status-badge.err` `rotate(-1.6deg)` + `st-401-punch` | qiya muhr o'qiladimi | layout torlik |
| 7 | 🔴 **HOOK-MEXANIKA SAVOLI** — s0 «😈 Begona: DELETE» tugmasi endi `.btn.danger` (qizil): o'quvchi «xavfli — bosma» deb o'qimaydimi, aslida bosishi **kerak** (hujumni ko'rish uchun) | qizil = taqiq signali hook-mexanikaga zid kelmaydimi; muqobil — tugma accent, natija qizil | metafora / affordance |


## 4A-MODUL

### 4a-01 · `NestArchAliveLesson` (4a-ETALON, 🔒 muhrlangan)

⚠️ **Kech yozildi (2026-08-21).** Bandlar 4a-01 sikli hisobotida aytilgan edi, lekin
o'sha payt bu faylga **ko'chirilmagan** — quyidagilar fayldan qayta o'lchab tiklandi.
Jarayon-saboq: EKRAN-XAVF ro'yxati **hisobotda aytilishi bilan** shu yerga yoziladi.

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `.messy` quyuq kod-paneli (`data-dark-ok`) krem sahifada | «tartibsiz vs tartibli» qarama-qarshiligi ko'zga tashlanadimi, yoki panel shunchaki og'ir dog'mi | rang-his |
| 2 | 5 ta sudrash-mexanikasi (`onDragStart`/`onPointerDown`) | sensorli ekranda sudrash ishlaydimi, tap-yo'li bormi | sensor |
| 3 | **12 ekranda klapan** — ipucha 40 s / rescue 110 s | ipuchalar juda tez chiqmaydimi; ekran almashganda haqiqatan yo'qoladimi | diqqat |
| 4 | Restoran-olami (smena, buyurtma yo'li, bino xaritasi) | metafora tabiiy tuyuladimi yoki majburiy | metafora-tabiiylik |
| 5 | Podium **5 ballik savol** (`SCORED_IDX` = 4, 7, 9, 15, 17) | torlikda 5 qatorli podium sig'adimi | layout torlik |

### 4a-02 · `NestArchResourceLesson` (yopilgan)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | `.editor-tab` (`#1E1E1E`) + kod oynasi — krem sahifada ikki qora zona | ikkovi birga «og'ir» ko'rinmaydimi (dark-lint ALLOW, ataylab quyuq) | diqqat |
| 2 | `.oc-plate-chip` NestJS qizili (`#E0234E`) accent (`#FF4F28`) yonida | ikki issiq rang bir ekranda raqobatlashmaydimi; brend-rangi tanilardimi | rang-his |
| 3 | S10/S12 «eshiklarni / Module'ni yig'ing» (`PickLines`) | sensorli ekranda qator tanlash qulaymi | sensor |
| 4 | 🔴 **Metafora-davomiyligi:** eshik **9** · retsept **8** · restoran **2** | 4a-01 restoran-olami davom etyaptimi yoki **uzilganmi** — 4a-03 da tendensiya kuzatilsin | metafora-tabiiylik |
| 5 | **11 ekranda klapan** (4a-01 dagi 12 bilan birga modulda **23**) | modul bo'ylab ipuchalar ko'payib ketmaydimi | diqqat |
| 6 | Podium **6 ballik savol** (4a-01 da 5) | torlikda 6 qatorli podium sig'adimi | layout torlik |
| 7 | `.hint` `1px solid` bo'lgach (avval `1.5px dashed`) | krem fonda ajralib turadimi | rang-his |
| 8 | S17 rescue-yorlig'i «Qatorlarni birga ko'ramiz →» | ballik ekranda «oralab o'tdim» degani tushunarli bo'ladimi | matn-aniqlik |

### 4a-03 · `NestArchPracticeLesson` (yopilgan, 4a-modul yakuni)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | 🔴 **METAFORA-DAVOMIYLIGI — hukm foydalanuvchiniki** (o'lchov jadvali quyida) | «restoran» **nomi** yo'qolgan, **aholisi** qolgan. Bular hali ham metaforami, yoki endi shunchaki atamami (NestJS'da «mijoz» = API-klient, «buyurtma» = `Order` resursi)? Koddan hal qilib bo'lmaydi | metafora-tabiiylik |
| 2 | `LegacyRail` (s0) — «Uch dars — bitta zanjir» tasmasi | uch darsni bog'lash ko'zga tashlanadimi yoki e'tibordan qochadimi | diqqat |
| 3 | Arena-yakuni → podium ketma-ketligi (F-338 dan **keyin**: arenada konfetti yo'q, podiumda bor) | yakun «yassilashib» qolmaganmi — bayram podiumda yetarlicha kuchlimi | his-tuyg'u |
| 4 | 4 ta nishon-bayrami (`ACH_TRIGGERS` s8·s10·s14·s19), har biri to'liq-ekran overlay 4 s | bitta darsda 4 marta — charchatmaydimi (141-qonun nishon-tizimga tegmaydi, lekin **hajmi** ekranda ko'riladi) | diqqat |
| 5 | **14 klapan** (4a-modulda jami **37**) | ipuchalar modul bo'ylab ko'payib ketmaydimi | diqqat |
| 6 | s10 · s14 · s19 «challenge» ekranlari ketma-ket | qiyinlik zinapoyasi tik emasmi | pedagogika |
| 7 | `.hint` solid bo'lgach (avval `1.5px dashed`) | krem fonda ajralib turadimi | rang-his |

**1-band uchun o'lchov jadvali** (bir xil usul, uchala fayl, 2026-08-21):

| So'z | 4a-01 | 4a-02 | 4a-03 |
|---|---|---|---|
| **restoran** | **25** | 4 | 6 |
| smena | 5 | 0 | 0 |
| eshik | 32 | 15 | **51** |
| retsept | 12 | 9 | 4 |
| **mijoz** | 29 | 23 | **43** |
| **buyurtma** | 20 | 8 | **32** |

🔴 **Kod-tuzatish qilinmadi (foydalanuvchi qarori, F-0820-344).** Ekranda ko'rilganda hukm
chiqariladi: olam **uzilganmi**, yoki **nomi** tushib, aholisi qolganmi.

## 4B-MODUL

**Holat:** to'liq (2 dars) · parallel seans yopgan · tur qilinmagan.

### 4b-01 · `JestUnitTestLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s3 poyga: 5 `race-row` + HUD + 5-qatorli `JestWindow` + `race-vs` karta — bir ekranda | mobil balandlik, skroll tartibi | layout torlik |
| 2 | s9 `dd-slot` `marginLeft: i*14` + pointer-drag | sensorda blok qatorga aniq tushadimi, tap-yo'l (B1) yetarli ko'rinadimi | sensor |
| 3 | s16 `.card-slot "?"` kod-qator ichida | o'quvchi «?» ni bo'sh joy deb o'qiydimi | metafora / affordance |
| 4 | `.jr-lamp` 10px hukm-chirog'i (`term-bar` ichida) | PASS/FAIL «lampa» obrazi ko'zga tashlanadimi | rang-his |
| 5 | `.dd-slot.over #FFD380` (CODE.attr) qora muharrir fonida | modul-palitrasiga «sariq» hissi bermaydimi | rang-his |
| 6 | s1 mobil: «preview ↔ 4 qadam» tugma-almashuvi | o'quvchi ikkalasini ham ko'radimi | diqqat |
| 7 | s0 variantlar `opacity 0.55` `tried` bo'lguncha | «o'chiq/ishlamaydi» deb o'qilmaydimi — «Avval funksiyani hisoblang ←» yetarli ko'rinadimi | affordance |


### 4b-02 · `EdgeCasesTestLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s7 ikki `vcard` ichida uzun kod-satr (`agent-msg`: `expect(() => orderTotal(10000, 0)).toThrow()`) | mobil o'rashda kod o'qiladimi, ikki karta bir xil ko'rinadimi | layout torlik |
| 2 | s9 `dd-slot` `marginLeft 14 + i*8` + pointer-drag | sensorda blok qatorga tushadimi, tap-yo'l (bosib qo'yish) yetarli ko'rinadimi | sensor |
| 3 | s16 `.card-slot "?"` kod-qator ichida | «?» bo'sh joy deb o'qiladimi | metafora / affordance |
| 4 | s0/s3/s5 `gchip` ko'rilgach **qizil** kontur (`T.danger`, ataylab — g'alati buyurtma) | «xato qildim» deb o'qilmaydimi | rang-his |
| 5 | s10 ikki `JestWindow` + 7-qatorli kod bir ekranda | balandlik, skroll tartibi | layout torlik |
| 6 | s13 bitta tugma 3 marta yorliq almashtiradi (happy → edge → ✓) | o'quvchi «yana bosish kerak»ligini sezadimi | affordance |
| 7 | `.jr-lamp` 10px hukm-chirog'i | PASS/FAIL lampa obrazi ko'zga tashlanadimi | rang-his |

---

## 4C-MODUL

### 4c-01 · `CiCdIntroLesson` (yopilgan, olam-manbasi)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | «lenta» **136 marta** — bitta metafora butun darsni ushlab turadi | o'quvchini olib ketadimi yoki charchatadimi; modulda yana 4 dars shu obraz bilan davom etadi | metafora-tabiiylik |
| 2 | `Belt` + siljiydigan chamadon-belgisi (`pipe-suitcase`, `left: %`) | tor ekranda 5 nuqta + harakatlanuvchi belgi sig'adimi | layout torlik |
| 3 | s9 «lenta o'yini» — 5 buyum tanlash + ishga tushirish + natija, bir ekranda | bosqichlar ketma-ketligi tushunarlimi yoki ko'pmi (109-qonun, TMI) | diqqat |
| 4 | s13 «Bo'shliqlarni to'ldiring» — YAML matni ichida tanlov | mobil klaviatura/bosish bilan qulaymi | sensor |
| 5 | Arena-yakuni → podium ketma-ketligi (F-388 dan **keyin**: arenada konfetti yo'q) | yakun «yassilashib» qolmaganmi | his-tuyg'u |
| 6 | **11 klapan** | ipuchalar ko'payib ketmaydimi | diqqat |
| 7 | `.hint` solid bo'lgach (avval `1.5px dashed`) | krem fonda ajralib turadimi | rang-his |

**Olam-lug'ati bu darsda e'lon qilinadi** (`on: push = START SIGNALI · secret = SEYF · logs = LENTA JURNALI · rollback = ESKI YUKNI QAYTARISH · production = yo'lovchi qo'lida`) — modul-ko'rikda **izchilligi** 4c-02…05 bo'ylab tekshiriladi.

### 4c-02 · `GithubActionsLesson` (yopilgan, to'lqin oxirgisi)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | «lenta» **60** + «chamadon» **4** — 4c-01 dagi 136/28 dan keyin | obraz **so'nyaptimi**, yoki texnik atamalar (`ci.yml`, `matrix`) tabiiy ravishda olamni siqib chiqaryaptimi | metafora-tabiiylik |
| 2 | 🆕 **TABLO bloki** (F-407, s14 oxirida) + `ghrun-badge` «YASHIL/QIZIL CHIROQ» | ikki obyekt **farqi tushunarli bo'ldimi** — blok ularni bir gapda ajratadi, lekin bu **yetarlimi** ekranda ko'riladi | tushuncha-aniqlik |
| 3 | s12 «Amallarni tartiblang» | sensorli ekranda tartiblash qulaymi | sensor |
| 4 | s17 «Lentani yashil qiling» — xatoni topib tuzatish sikli | qiyinlik darajasi mos keladimi; o'quvchi qayerdan boshlashini tushunadimi | pedagogika |
| 5 | Arena **12 savol** + podium | natija ekrani torlikda buzilmaydimi | layout torlik |
| 6 | **13 klapan** (4c-modulda 4c-01 bilan birga **24**) | ipuchalar ko'payib ketmaydimi | diqqat |
| 7 | Arena-yakuni → podium (F-402 dan **keyin**: arenada konfetti yo'q) | yakun «yassilashib» qolmaganmi | his-tuyg'u |

**Atama-tutashuvi ✅ toza:** START SIGNALI (7→**14**) · SEYF (4→**7**) · LENTA JURNALI (**6**) — 4c-01 nomlari o'zgarmagan. Yangi obyektlar PARALLEL LENTALAR va YAQIN JAVON shu darsda **e'lon qilinib o'rgatilgan**; **TABLO** endi (F-407) — **o'z darsida**.

### 4c-03 · `FullPipelineProjectLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s6 bir ekranda: 4 vcard + sk-info + DnD (5 slot + pool) + Belt + jurnal + telefon + TABLO — eng baland ekran | mobil skroll-uzunligi, o'quvchi push-tugmasini topadimi | layout torlik |
| 2 | `Belt` 5 nuqta + → `flex-wrap`; `pipe-suitcase` `left: %` | tor ekranda ikki qatorga bo'linsa chamadon noto'g'ri joyga tushadimi | layout torlik |
| 3 | s13 `<input class="code-input inline">` `<pre>` ichida | mobil kenglikda kod-qator sinadimi, input bosiladimi | sensor |
| 4 | `PhoneMock` matnlari 9–10.5px (s6 · endi s10 ham, B2) | «Sayt buzildi / ishlayapti» o'qiladimi | layout torlik |
| 5 | `.dd-chip` gradient (`#FF8A3D → accent`) ustida oq mono 12px | kontrast yetarlimi | rang-his |
| 6 | `pipe-track::after` cheksiz lenta-yugurishi (reduced-motion bor) | diqqatni kontentdan tortmaydimi | diqqat |
| 7 | s0 variantlar `opacity 0.55` `tried` bo'lguncha | «o'chiq» deb o'qilmaydimi — «Avval qo'lda tekshirishni bosing ←» yetarli ko'rinadimi | affordance |


### 4c-04 · `AiPipelineProjectLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s9 ikki ustunli 6-fazali mashina (jurnal → so'rov → taklif → tekshirish → tuzatish → push) | mobilda holat-almashuvda skroll joyi, faol tugma ko'rinadimi | layout torlik |
| 2 | `ai-bubble` uzun matn (s3/s9 yordamchi pufaklari) | tor ekranda pufak o'qiladimi, badge bilan bir qatorda turadimi | layout torlik |
| 3 | s13 `code-box` `____` + 9 chip (3 guruh) + `👉` yorliq | kod-qator sinishi; bo'sh guruh belgisi yetarli ko'rinadimi (tap-hint olib tashlangan) | affordance |
| 4 | s15 DnD 5 slot + pool («1-qadam…5-qadam» neytral) | sensor aniqligi; neytral slot-yozuvi bilan o'quvchi tartibni topa oladimi | sensor |
| 5 | `cj-items` itm-card to'ri (s2 ×5, s5 ×3, s7 ×5) | mobilda 2 ustunga bo'linganda `firstUnseen` pulsi ko'rinadimi | diqqat |
| 6 | s12 ikki `PhoneMock` (broken/new) ramka ichida | balandlik, ikki telefon solishtirma ekanligi o'qiladimi | layout torlik |
| 7 | s0 variantlar `opacity 0.55` `tried` bo'lguncha | «o'chiq» deb o'qilmaydimi — «Avval jurnalni oching ←» yetarli ko'rinadimi | affordance |


### 4c-05 · `FullProPipelineLesson` (yopilgan, parallel seans)

| # | Band | Nega koddan bilib bo'lmaydi | Sinf |
|---|---|---|---|
| 1 | s13 o'ng ustun: 4 `sk-info` («oldin/keyin») + `PhoneMock` (broken→old) ustma-ust | balandlik; rollback'dan keyin telefonning «ishlayapti»ga o'tishi sezilarlimi | layout torlik |
| 2 | s3 `itm-card` holat-yozuvlari (● ✓ ✗) + 900 ms parallel animatsiya | mobilda uch karta bir vaqtda o'zgarishi o'qiladimi; tiklanishda (F-367) kartalar darhol yakuniy holatda | diqqat |
| 3 | s9 `code-box` uzun `--key=…` qatori | tor ekranda sinishi; `${{ secrets.API_KEY }}` o'qiladimi | layout torlik |
| 4 | `timer-chip` «40 s» ↔ «8 s» kontrasti (danger/success) | 5 baravar farq bir qarashda ko'rinadimi | rang-his |
| 5 | s15 DnD 5 slot «1…5-qadam» neytral yozuv bilan | o'quvchi tartibni o'zi topa oladimi (ipuchasiz) | sensor |
| 6 | s12 → s13 `PhoneMock broken` ketma-ket ikki ekranda | takror his bermaydimi; s13 da «old»ga o'tish bilan yechiladimi | diqqat |
| 7 | s0 variantlar `opacity 0.55` `tried` bo'lguncha | «o'chiq» deb o'qilmaydimi — «Avval tugmani bosing ←» yetarli ko'rinadimi | affordance |


---

## Tur yakunlangach

1. Har band → **TASDIQ** / **NUQSON** belgisi oladi.
2. NUQSON bo'lgan bandlar **darsining o'z faylida** tuzatiladi (etalonda topilsa — avval
   etalonda, keyin unga tortilgan darslarda).
3. Takrorlanuvchi sinf → qonunga muhrlanadi (`DARS_ETALON` / `MATN_KORPUS`).
4. Darvozalar qayta → **keyin** commit.

### Ko'rikdan keyin navbatga turgan ishlar

| # | Ish | Joyi | Holat |
|---|---|---|---|
| 1 | **Shablon-manba tozalash** — yetti takror-sinf (hook — faqat karkas) | `KATTA_TOZALASH` **23-band** | ko'rikdan **keyin** |
| 2 | **POINTS shared-manba** — A1 · RU-kanon «Габарит-рамка» · 14 joy | `PIPELINE_STATE` taklif-bandi | foydalanuvchi «boshla» buyrug'i bilan; **birlik-kelishuv jadvali birinchi qadam** |
| 3 | **RU hurmat-kapitali** — 222 ta, 19 fayl | `KATTA_TOZALASH` **22-band** | ko'rikdan keyin |

🔴 **Bu hujjat ko'rik-materiali** — tuzatish ro'yxati emas. Bandlar **ekranda** ko'rilib,
belgi olgandan **keyin** ish boshlanadi.
