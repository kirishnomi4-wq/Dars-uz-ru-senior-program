# 11-Modul — o'z sinovim uchun topilmalar ro'yxati (2-bosqich: hamma dars qurilgach)

> Foydalanuvchi rejasi (06.10 ~19:10): (1) 14 dars qurilib bo'lgach → (2) o'zim sinab, xatolarni (dizayn va boshqa) tuzataman → (3) keyin 9 va 10-Modul ⛶ (`.zoom-on`).
> Bu fayl — to'lqinlar tekshiruvida ko'rilgan, lekin hozir tuzatilmagan narsalar. 2-bosqichda har band: tuzatildi / oqlandi + sabab.

## Sinf-xatolar (hamma darsda bir yo'la)
- 🟡 **S1 holati (07.10, F-1007-289; `lint:layout` 16/16 → har topilma lint qadamida suratda, `scratchpad/lintshot.mjs`):**
  tuzatildi — voqea sahnasi 2, 5, 16 (bashorat tugmalari panel ostida edi) · 13-dars yakuniy test jadvali ixcham (xato javobda «Qisqa takrorlash» ko'rinadi) ·
  KOD 2, 3, 4 (kod tanasi `calc(100vh − 520px)` + ichki skroll — kutilgan natija va chap karta sig'adi) · 6-dars RICE kartasi bir qator (tartib oraliq holatda ko'rinadi) ·
  «Yordam» ochilganda o'zi ko'rinadi (`Korinsin`: 1-dars 8-ekran, 5-dars 11, 7-dars 5) · 3-dars 10-ekran yakka izohi karta ostiga.
  oqlandi — test vizuali (`TestViz` o'zi suradi: 1, 5, 15) · 5-dars 2/8-ekran (faol bo'limga avto-skroll bor) · 4-dars 8-ekran (eski bashorat qatori) ·
  ≤14 px — kartaning pastki bo'shlig'i (1-dars 6, 3-dars 9, 4-dars 4, 6-dars 4, 7-dars 8, 16-dars 10) · edge/cover (9, 11, 13, 14, 16 — animatsiya, ataylab).
  🔴 qolip — prompt qadamida «Bajardim» panel ostida (7–14 bloklar, 10-Modulda ham) → MEXANIZM-TAKLIF 13; «Ortda»ni natija ustuniga ko'chirish sinaldi va qaytarildi (10-darsda boshlang'ich holat yomonlashdi).
- **S1 · 1280×800 da pastki blok panel ostiga kiradi.** Ish jarayonida yoki yakuniy holatda xulosa/natija bloki pastki navigatsiya ostida qoladi (skroll kerak).
  Ko'rildi: 4-dars 6, 8-ekran · 3-dars 4-ekran (xulosa), 7-ekran (773 da), 9, 10-ekran (shablon formadan pastda) · 4-dars 10-ekran (ogohlantirish chiqqanda) · 6-dars 2-ekran (ish jarayonida).
  SABOQ: «yakuniy holat bitta natija bloki, 1280×800 ga sig'adi».
- ✅ **⛶ (07.10, F-1007-289):** `scratchpad/zoomtest.mjs` (detektor 10-Modul m8-03 da 6/7 buzuq — isbot) · boshlang'ich holat 16/16: 112 ta ⛶, nuqson 0 · yakuniy holat (14 bosish, `q-fokus` 1, 2, 3, 4, 7, 8, 16 da): markazda ✓ ·
  **4-dars** `.q-fokus:has(.zoom-on)` yo'q edi → oyna tepaga siljirdi (surat) → qo'shildi ✓ · 5/2, 6/4, 9/4 «ochilmadi» — o'tish paytida bosish (6 s kutilganda ✓) → MEXANIZM-TAKLIF 14.
- **S2 · Jonli juftlik va mentor ko'rinishi suratda sinalmagan** (3, 4, 6-darslar; pilot 01 ham). Sinov: jonli sessiya bilan yoki `live` holatini taqlid qilib.

- ✅ **S3 · Blokda Mentor gapi qadamga qarab o'zgarmaydi** (tuzatildi 21:30, F-1006-287: 7 fayl — 7, 8, 9, 10, 11, 12, 13 `ScreenBlok` da `mGap`; 9-darsda trek tanlanmagan holati ham; 14 — agent; sinov: 10-dars 0/1/4 qadam, 9-dars treksiz) — — 2-qadamda ham, 4/4 dan keyin ham ««1 · Ochish»dan boshlang» turadi (11-dars A1, 9-dars A1 2-qadam — surat; pilot 10, 7, 8, 12, 14 bloklarida ham). Tuzatish — QBlok ga tegmasdan, har dars `mentor` propini qadam holatiga qarab. **Namuna — 14-dars `FeatureThreeLesson.jsx` (`BLOK_TUGADI`, «Keyingi qadam — «N · Nom»…», ~1839–1865).**
  Oraliq holatlarda Mentor: 8-dars 6-ekran 2-qadam (pastga tortishni aytmaydi) · 9-dars 7-ekran yakuni (3-holat gapida qoladi).
- ✅ **S4 · Database `kun` ustuni** (tuzatildi 21:30, F-1006-287: 11-dars `OYINLAR.sana`, jadval va Neon kartasi — sana; telefon formasi — kun nomi; 12, 13 da DB `kun` yo'q): 11-dars Neon kartasida kun nomi («Yakshanba»), tayanch 9.30 — sana (10-darsda sana). Bloklar va 12, 14-darslarda bir xil qilish. 14-dars — sana (`2026-10-09 19:42`) → 11-darsni sanaga.

## Darsga xos
- ✅ **3-dars** (07.10: Telegram — yakuniy holatda chat ko'rinishi, oqlandi; 11-ekran bo'sh joy — qolip QKod ustun cho'zilishi): 4-ekran chapdagi Telegram maketi tepasi kesilgan («uy vazifasi nima edi?» xabari yarim) — qarash kerak · 11-ekran chap kartaning pastida bo'sh joy.
- ✅ **4-dars** (07.10: doska — panel ustida, oqlandi; «Belgi» ru tarjimasi tuzatildi; ⛶ `.q-fokus` qo'shildi): 4-ekran — bashorat tanlanmaguncha doskaning pastki qatori ekran chetiga yaqin.
- **6-dars:** RU 2-ekran «уверенность» qisqaradi (6-RU bosqichi).
- **2-dars:** (07.10: 6-ekran sahna 440 px — bashorat sig'ishi ustun, telefonlar ⛶ bilan kattalashadi; MD TAYANCHGA SAVOL 13 yangilandi) ✅ oxirgi 3 tahrir — gates 12/12 + seed bilan bosib sinaldi (19:20, F-1006-278); 2-kartada «Saqlash» panel ostida (S1) · 6-ekran telefonlari ≈110×192 (SABOQ ≈170×272) ·
  11-ekran kod oynasi + terminal 1280×800 ga sig'maydi · lint:til 8 warn (kod ichidagi ru izohlar — kutilgan) · MD TAYANCHGA SAVOL 13 raqamlari eski (10 g'oya).
- **11-dars:** yangi qoralama kaliti `pm-m9d11-talab` (o'quvchi yozgan uch qator; boshqa dars o'qimaydi) — tayanch 8 ga «qoralama» qatori · 2-ekran va A1 natijasida 5-karta telefonda kesilgan (ataylab) · Mentor avatari headless'da yuklanmagan.
- ✅ **12-dars** (07.10: «↓ torting» sichqoncha — `setPointerCapture`, sinaldi; ⛶ 393): «↓ torting» sichqoncha bilan surish sinalmagan (faqat bosish) · A3 o'ngida `GET /oyinlar` javob kartasi (agent qo'shgan) · «masalan» namunalari MD da yo'q (`{qayerda}` …) — MD ga.
- ✅ **7-dars** (07.10: 393 plitkalar va ⛶ · Comic Neue · kompilyator predikati `all`/`scale(a, b)`): 393 da 10-ekran plitkalari tor («Sh 18:00» ikki qator) · qo'lyozma shrift Linux'da serif · 12-ekran kompilyatori xato yechim bilan sinalmagan.
- 🟡 **8-dars** (07.10: hook «o'ngdagi» olindi; A1/A2 prompt — qolip, MEXANIZM 13; ru tugma nomlari — RU bosqichi): A1/A2 2-qadam (prompt ochiq) 1280×800 da 30–60 px skroll (S1) · hook Mentor «o'ngdagi javoblardan» — 393 da variantlar pastda · ru Mentor gaplarida uz tugma nomlari.
- 🟡 **9-dars** (07.10: 900 px kichik matn — oqlandi, maket ataylab; ru — RU bosqichi): 10-ekran «Kompyuter 900 px» rejimida natija matni ≈9 px · ru A2 web natija yorlig'i 2 qator → JSON kartasi panel ostiga · 2-ekran xato juftliklari MD da 4 qator (12 holat).
- **14-dars:** MD ga: 2-ekran «Navbatda: 1» faqat 2-telefonda · 4-ekran ikkinchi yorliq «talab» · bloklardagi oraliq Mentor gaplari · A2 izohi «oldin 1 + yangi 1» → «oldin bitta, yangi bitta» (T-035) · A3 kutilgan natija 5 kadr.
- **5-dars:** ✅ suratlar qayta olindi 16/16, git — faqat o'z fayli (F-1006-278) · 2, 8-ekran 773 da 20–40 px skroll ·
  8-ekran 2-qadam kartasida faqat «←» — MD ga «Sig'maydigan funksiyani bosing» · Mentor ekranida o'quvchi PRD matni (TAYANCHGA SAVOL 10 — MEXANIZM-TAKLIF 5).

## Darslararo (kalitlar, ip)
- 2 → 3: `pm-m9d2-rice.ikkita` — 3-dars indeks deb oladi, obyekt kelsa ham o'qiydi; 2-dars yozuvi bilan solishtirish.
- 3 → 4: `pm-m9d3-intervyu.yozuvlar[].goya` — 3-dars `0|1` yozadi, 4-dars `0|1`, `'a'|'b'` va nomni o'qiydi ✓. `belgi` — `'ha'` / `YOQ` konstanta (qiymatini tekshirish).
- 6 → 15: 15-dars MD «Hozir» kataklari «11-dars · 12-dars · 14-dars» ↔ 6-dars «1/2/3-asosiy funksiya» — bitta yorliq (15-dars qurilishida).

## MD ga takliflar (agentlardan; MD egasi — men)
- 3-dars: 4-ekran Mahalla chati xabari «Suzish to'garagi qayerda bor?» → tayanch 9.57 · 7-ekran sahna yozuvlari («airbnb.com», «Nyu-York · kvartira / xona») · 1, 2-ekran vizual tavsifi SABOQ 33/36 ga · 11-ekran shartlari SABOQ 37 ga · 10-ekran yakka rejim ta'rifi · 6-ekran «Harakat belgisi» qatori atama tug'ilmasdan ko'rinadi (T-011).
- 4-dars: 0, 1-ekran «kulrang chiziq» o'rniga yorliq/nom (SABOQ 33) · 9-ekran «Darsdagi yozuv» yorlig'i.
- 6-dars: 10-ekran «Avval 8-ekranda ishlaringizga RICE ni hisoblang.» satri · 11-ekran boshlang'ich kod qatorlari ≤57 belgi.

## 2-bosqich vositalari
- `lint:layout` — dev-server kerak (B agentlari yurgiza olmadi): fonda `npx vite --port 5300` → `npm run lint:layout -- --keys m9-01,m9-02,…` (~20 s / dars; `--selftest` bilan detektor tirikligi; `--vp 1280x800`; ru va mentor rejimi — `--lang ru --mode mentor`).
