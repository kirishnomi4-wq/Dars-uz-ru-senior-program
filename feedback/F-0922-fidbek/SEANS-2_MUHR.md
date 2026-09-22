# 🔏 MUHRLASH NAVBATI — ikkinchi seans (PracticeLesson2 / VsCodeLesson)

> **Nega alohida fayl:** 22.09 da ikki seans parallel ishladi va ikkalasi ham
> `SEANS-B_MUHR.md` nomini oldi — narigi seans faylni qayta yaratganda bu yerdagi birinchi
> yozuv (F-0922-70) yo'qoldi. Endi har seans **o'z fayliga** yozadi.
> F-ID zaxirasi: narigi seans **F-0922-51…60**, bu seans **F-0922-70+**.
>
> Qonun-fayllar (`MATN_KORPUS.md` · `DARS_ETALON.md` · `PIPELINE_STATE.md`) umumiy —
> ularga «muhrla» buyrug'idan keyin, bir yo'la ko'chiriladi. § va qonun raqamlari o'sha paytda beriladi.

Sana: 2026-09-22 · Darslar: `src/1-Modull/VsCodeLesson.jsx` · `src/2-Modull/PracticeLesson2.jsx`

---

## F-0922-70 · Mentor fidbegi — `VsCodeLesson` s8 «Go Live» testi

**Mentor so'zi:** «html faylni browserda ochadiga o'zgartirish kerak».
**Joy:** `src/1-Modull/VsCodeLesson.jsx:1771` — EKRAN 8 (TEST 2), `correctIdx={2}`.

**Ikki topilma:**
1. To'g'ri javob **manzilni** aytardi, o'quvchi **ko'radigan natijani** emas —
   `127.0.0.1:5500` ni yod olmagan bola o'z javobini tanimaydi.
2. 4 variantdan **faqat to'g'risida kod-chipi** (backtik) bor edi → javobni o'qimasdan,
   shakliga qarab topsa bo'lardi.

**Qilingan (foydalanuvchi tanlovi):**
- ❌ uz `"Sahifa \`127.0.0.1:5500\` da jonli ochiladi"` · ru `'Страница живо открывается на \`127.0.0.1:5500\`'`
- ✅ uz `'HTML fayl brauzerda jonli ochiladi'` · ru `'HTML-файл живо открывается в браузере'`

**Nega «jonli» saqlandi:** o'sha ekranning nazariya kartasi (`:377`) «Fayl shunchaki ochilmaydi —
jonli server orqali ko'rsatiladi» deydi; mentorning so'zma-so'zi o'sha karta rad etgan iborani takrorlardi.

**Tegilmagan:** `correctIdx` · savol · qolgan 3 variant · `explainCorrect`/`explainWrong`
(ular javobdan KEYIN manzilni aytadi) · dizayn · arena-banki.

**Tekshiruv:** darvozalar tahrirdan oldin/keyin bir xil (dark 8=8 · til 🔴1/🟡1 — eski qarz) ·
`smoke-rejim` 4 rejim uz ✓ ru ✓ · skrinshot: uz · ru · javob ochilgan holat.

### KORPUS loyihasi — SHAKL-TELLI TIPOGRAFIK HAM BO'LADI: KOD-CHIPI YOLG'IZ TO'G'RI JAVOBDA

§147-A so'z-qolipini, §129 esa «2 kod-qatori + 1 odam-gap»ni o'lchaydi. Uchinchi ko'rinishi —
**yozuv shakli**: variantlardan bittasida backtik bor, qolgan uchtasida yo'q.

- ❌ A/B/D sodda matn · C `"Sahifa \`127.0.0.1:5500\` da jonli ochiladi"` — kulrang chip yolg'iz
  to'g'ri javobda; ko'z uni matnni o'qishdan oldin tanlaydi.
- ✅ Yo **to'rttasida ham** kod bo'lsin (`VsCodeLesson:1916`), yo **hech qaysisida** (`:1515`, `:1768`).
- **Tekshiruv usuli:** har MC-savolning 4 variantida backtik sonini sanang; 3-vs-1 chiqsa va
  yolg'izi to'g'ri javob bo'lsa — nuqson. Uzunlik-teli (§138-C) va so'z-qolipi (§147-A) toza
  bo'lsa ham bu qolishi mumkin.
- **O'lchov (22.09):** 471 MC-blok, 386 tasi ajratildi (85 tasi boshqacha yozilgan — ko'rilmadi);
  yolg'iz chipli 4 ta, shundan **to'g'ri javobda** — `VsCodeLesson` (tuzatildi) va
  `NestArchPracticeLesson.jsx:1568` (4a-Modul, **tegilmadi**).

---

## F-0922-71 · Mentor fidbeklari — `PracticeLesson2` (AI bilan tez sayt), 10 topilma

**Manba:** mentor, ~2 oy oldingi skrinshotlar (matn hozirgi kodda ham aynan shunday edi).
**Fayl:** `src/2-Modull/PracticeLesson2.jsx` · **Baseline** (tahrirdan oldin o'lchangan):
til 🔴6 · 🟡8 · dark 7 — **yakunda ham aynan shu** (mening tahririm 0 yangi topilma qo'shdi).

| # | Mentor | Qilindi |
|---|---|---|
| 1 | matn soddaroq | buyruq matni: `bir sahifali promo-landing` → **`promo sahifa`** · `3 ta xususiyat kartasi` → **`3 ta karta`** · `«Pixel Quest» video-o'yini` → **`«Pixel Quest» o'yini`**. Bitta manba (`PromptLine`) — 7 ekranga tarqaldi |
| 2 | «o'ynoqi» tushunarsiz | yorliq **«Quvnoq»** (ru «весёлый»); ichki kalit `oynoqi` tegilmadi |
| 3+9 | «loyqa» almashtirilsin | **«noaniq»** — dars 276-qatorda buni allaqachon ishlatardi; ru juftligi `размытый` → **`неточный`** |
| 4 | «Ustabot :)» | ko'rinadigan matnda **«Agent»** — tugma «Agentga yuborish» va flashkarta «Agent (AI yordamchi)» bilan bir nom (ilgari bitta narsaning ikki nomi edi) |
| 5 | «shu slayd ortiqcha» | **rost, lekin o'chirilmadi** — s13 («bitta usul, ko'p sayt») s12 (nashr qilish) dan **oldinga** ko'chirildi; nashr dars cho'qqisi bo'lib qoldi. ID lar o'zgarmadi |
| 6a | — (men topdim) | yakuniy vazifa «maktab konsertiga» derdi, tugmalarda konsert **yo'q** edi → **«kibersport turniriga»** |
| 6b | «primerlar zerikarli» | `shaxmat klubi` → **SKY HAWKS** (basketbol jamoasi) · `Texno Fest` → **CYBER CUP** (kibersport turniri) · `Focusly` → **GAME REVIEW** (blog-kanal); manzillar `TOPIC_URL` bilan brendga mos (`cyber-cup.uz`…) |
| 7 | «vibecoding ishlatilmagan» | **rost:** atama faqat flashkarta + arenada bor edi, dars matnida **0** (§191). 2-ekranga induktiv ildiz: hodisa → nomi |
| 8 | «Uslub» → «Stil» | 19 ko'rinadigan joyda **«Stil»** (ruschasi allaqachon «Стиль» edi — endi ikki til teng). CSS/dev-izohlari va ichki kalitlar tegilmadi |
| 10 | savol tushunarsiz | «Uyda **shu usulda** ishlaydigan…» — referentsiz ko'rsatkich (§129) → «Uyda o'zingiz sinab ko'rasiz — sayt quradigan AI-dastur nomi?» |

**Yo'l-yo'lakay ikki chin nuqson (mentor aytmagan, ko'z bilan topildi):**
`UstaBubble` matni **`tr()` siz** edi (1012 va 1237-qator) — ruscha rejimda o'quvchi **o'zbekcha** ko'rardi. Ikkalasi ham ikki tilli qilindi.

**Bog'liq fayl:** `feedback/F-0918-04/b-tolqin/probe/solo-yozma.json` — spetsifikatsiya `has-text("Tadbir")` bilan bosardi, mavzu nomi o'zgargach sinov jimgina o'chib qolardi → **«Turnir»** ga yangilandi (bu aynan muhrlangan «prob selektori matnga bog'lanmaydi» sinfi — spetsifikatsiya formati hali matnga tayanadi).

**Tekshiruv:** `gates` 6/6 baseline bilan bir xil · `lint:jsx` 157 fayl **0** · `smoke-rejim` 4 rejim **uz ✓ ru ✓** ·
`smoke-arena` **1/1** (T1/T2/T3) · `ach-probe --solo` s15 **1/1 o'tdi** · skrinshot bilan ko'z orqali:
s2 (uz+ru) · s5 · s6 · s12↔s13 almashuvi · s15 · uch yangi mavzu (CYBER CUP · SKY HAWKS · GAME REVIEW).

**Ochiq qolgani (foydalanuvchi qarorini kutadi):** 6c media (rasm kutiladi — 156-qonun: faqat o'z kutubxonangizdan) ·
«yakuniy slayd kuchliroq/promptliroq» — qaysi ma'noda ekani so'raldi.

---
---

# 🔏 Uchinchi dars — `PmLesson1` (M1-D2) · 2026-09-22

## 12. `MATN_KORPUS.md` → yangi bo'lim

```
## <§>. TANISH BREND NOMI UMUMIY NOMGA ALMASHTIRILMAYDI (F-0922-61, mentor topilmasi 22.09)

Misol-kartada o'quvchi har kuni ochadigan mahsulotning O'Z NOMI turadi. Umumiy nom
(«Video sayti», «Xabar ilovasi») tanishlik hissini o'ldiradi: bola «bu meniki» demaydi.

- ❌ 🎬 Video sayti · 💬 Xabar ilovasi · 🚕 Taksi ilovasi  (url: video.uz · xabar.uz · taksi.uz)
- ✅ 🎬 YouTube · 💬 Telegram · 🚕 Yandex Taxi  (url: youtube.com · telegram.org · taxi.yandex.uz)

Ildiz-sabab (takrorlanmasin): bu darsda brend nomlari **UZ-RU ikki tilga o'tkazish**
paytida yo'qolgan (commit c15ed80) — tarjima qilinadigan `{ uz, ru }` obyektiga o'tkazish
oson bo'lsin deb nom umumiylashtirilgan. **Brend nomi tarjima qilinmaydi:** ikkala tilda
ham bir xil lotin yozuvida qoladi (`{ uz: 'YouTube', ru: 'YouTube' }`).

Maket ham brendga ergashadi: logotip harfi va rangi real brendniki bo'lsin
(YouTube #FF0000 · Telegram #29A9EB · taksi sarg'ish) — aks holda karta nomi brend,
ichidagi telefon-maketi begona ko'rinadi.

🔧 Tekshiruv: ikki tilli o'tkazishdan keyin `git log -S "<brend>" -- <fayl>` bilan
nom yo'qolmaganini tasdiqlang. CHEGARA: PM 24-qonun — bir ilova IKKI PM darsida
BOSH-misol bo'lolmaydi; yordamchi karta sifatida uchrashi mumkin.
```

## 13. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · PmLesson1 (M1-D2) — F-0922-61

**Mentor:** «Bu yerda YouTube, Telegram, Yandex taxi yozilgandi — o'shani qo'shib qo'ying,
qaytadan qiziqroq bo'ladi.» Tekshiruv: rost — `git show c15ed80^` da nomlar bor edi;
UZ-RU o'tkazish commitida (c15ed80) umumiy nomga almashgan.

Qilindi (`Screen2` + RECAPS, uz+ru): Video sayti→**YouTube** (youtube.com, logo Y, #FF0000) ·
Xabar ilovasi→**Telegram** (telegram.org, logo T, #29A9EB) · Taksi ilovasi→**Yandex Taxi**
(taxi.yandex.uz, logo Y). `kim`/`nega` matnlari va mexanika tegilmadi.

**PM 24-qonun tekshirildi:** Telegram `PmLesson17` da bosh-misol (23 uchrash), YouTube
`PmUserStoryLesson` da 8 uchrash. `PmLesson1` da bular bosh-misol EMAS — dars ipi «lavash
do'koni», bu uchtasi bitta ekrandagi yordamchi kartalar. Ziddiyat yo'q.

**Darvozalar:** esbuild ✓ jsx ✓ keys ✓ prompt ✓ · dark 🔴3, til 🔴2/🟡7 — **bazada ham
aynan shunday** (tegilmagan nusxada tekshirildi): yangi topilma 0.
**Ko'z bilan:** s2 — YouTube kartasi (qizil maket, youtube.com) va Yandex Taxi kartasi
(sariq maket, taxi.yandex.uz) skrinshot bilan ko'rildi; nom maketga sig'adi.
```

---
---

# 🔏 To'rtinchi dars — `JsIntroLesson` (M2-01) · 2026-09-22

## 14. `DARS_ETALON.md` → yangi raqamli qonun (keyingi bo'sh raqam)

```
### <N>-qonun. YIG'ISH-MASHQIDA XATO ELEMENT YAKKA OLINADI — «HAMMASINI TOZALASH» YAGONA YO'L BO'LMASIN (F-0922-62, mentor topilmasi 22.09)

O'quvchi element QO'SHIB boradigan har qanday mashqda (algoritm-konsol, blok-yig'gich,
ro'yxat-quruvchi) noto'g'ri element **yakka** olib tashlanadi. «↺ Tozalash» — qo'shimcha
yo'l, yagona yo'l emas.

Sabab: 5-blokda adashgan o'quvchi 5 tasini qaytadan yig'adi — jazo mashqqa emas, xatoga
qo'yiladi. Bola shundan keyin umuman urinmay qo'yadi.

Talablar:
- Olib tashlash **ko'rinadigan** bo'lsin (× tugmasi). Faqat «qatorni bosish» yetarli emas —
  o'quvchi bosish mumkinligini bilmaydi (mentor shikoyatining ildizi aynan shu).
- Element INDEKS bo'yicha o'chiriladi, nom bo'yicha emas — takror elementli mashqda
  nom bo'yicha o'chirish noto'g'ri qatorni oladi.
- Bajarilish (RUN/animatsiya) ketayotganda olib tashlash yopiq.
- Ball beriladigan ekranda javob topshirilgandan keyin olib tashlash yopiq
  (ota-komponent handler'ni umuman uzatmaydi).
- Olib tashlangan element manba-ro'yxatda qayta faollashadi; qolganlar qayta raqamlanadi;
  darvoza-hisobi (masalan «kamida 3 blok») qayta hisoblanadi.

🔧 Tekshiruv: 3 element qo'shing → O'RTADAGISINI oling. Aynan o'sha ketishi, raqamlar
1..n bo'lib qayta tizilishi va pastdagi hisob yangilanishi shart.
```

## 15. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · JsIntroLesson (M2-01) — F-0922-62

**Mentor:** «Agar xato qilib qo'ysa, tozalamasdan aynan xato kiritganini olib tashlaydigan
qiling.» Tashxis: `CommandConsole` da qo'shilgan qator umuman bosilmasdi — yagona orqaga
yo'l «↺ Tozalash» (butun algoritmni o'chiradi).

Qilindi: `CommandConsole` ga `onRemove` propi + har qatorda `×` tugmasi (`.cc-x`) va
qatorning o'zi ham bosiladi (× da `stopPropagation` — ikki marta o'chmaydi). Ikkala
ishlatuvchi ekran qamrab olindi: **Screen13** (erkin mashq, takror bloklar bor —
shuning uchun indeks bo'yicha) va **Screen15** (ballik, javob qulflanganda `onRemove`
uzatilmaydi). RUN paytida tugma chiqmaydi. Ball mantig'i tegilmadi: ball RUN bosilganda
hisoblanadi, RUN'gacha tahrir erkin.

**Ko'z bilan tasdiqlandi (skrinshot):** s13 — 3 blok qo'yilib O'RTADAGISI olindi: aynan
o'sha ketdi, raqamlar 1–2 bo'lib qayta tizildi, pastdagi darvoza «(2/3)» ga qaytdi.
s15 — blok olingach u yuqoridagi ro'yxatda qayta faollashdi (kulrangdan oq holatga).

**Darvozalar:** esbuild ✓ jsx ✓ keys ✓ prompt ✓ · dark 🔴3, til 🔴20/🟡7 — **bazada ham
aynan shunday** (tegilmagan nusxada tekshirildi): yangi topilma 0. (Bu darsning til-qarzi
katta — alohida ish.)

**Yo'l-yo'lakay ko'rilgan, TUZATILMAGAN:** s15 da javob topshirilgandan keyin ham
«↺ Tozalash» ko'rinadi; bosilsa doska bo'shaydi, lekin `tap` `passed` bilan qulflangani
uchun bloklarni qayta qo'yib bo'lmaydi (o'quvchi «Davom etish» bilan ketaveradi —
to'siq emas, lekin chalkash). Buyruq kutiladi.
```

---
---

# 🔏 Beshinchi dars — `PmUserStoryLesson` (P0 etalon) · 2026-09-22

## 16. `MATN_KORPUS.md` → yangi bo'lim

```
## <§>. MISOL-OLAM TO'G'RI BO'LSA HAM, ODAMLARI ZERIKARLI BO'LMASIN (F-0922-63, mentor topilmasi 22.09)

95-qonun misol-OLAMni tekshiradi («o'quvchi shu joyga o'zi boradimi?»). Bu bo'lim undan
bir qadam ichkariga kiradi: olam to'g'ri bo'lsa ham, undagi ODAMLAR va SABABLAR
maktab-vazifasiga aylanib qolishi mumkin.

- ❌ Olam: YouTube. Lekin hamma misolda bitta odam — «imtihonga tayyorlanayotgan o'quvchi»,
  harakat — «darsni qayta ko'rish», sabab — «mavzuni tushunib olish». O'smir YouTube'ni
  imtihon uchun ochmaydi: olam tanish, sahna begona.
- ✅ Bir olam, lekin har misolda BOSHQA odam va BOSHQA sabab:
  «avtobusda maktabga boradigan o'quvchi — videoni yuklab olish — yo'lda internetsiz ko'rish» ·
  «o'yinda bir joydan o'tolmayotgan o'yinchi — videoni sekinlashtirish — harakatni takrorlash» ·
  «birinchi videosini joylagan yangi blogger — necha kishi ko'rganini bilish — keyingi videoni
  nima haqida olish».

🔧 Tekshiruv: darsdagi barcha KIM larni bir ustunga yozing. Ikkitasi bir xil kasb/holatda
bo'lsa — misol-ip emas, misol-takror. Har KIM ning SABABi ham boshqa hayotiy ehtiyojdan
kelsin (o'qish · o'yin · ijod · yo'l).

CHEGARA: 91-qonun (bitta misol-ip) buzilmaydi — olam O'ZGARMAYDI (YouTube), faqat
undagi odamlar xilma-xil bo'ladi.
```

## 17. `PIPELINE_STATE.md` → raund-yozuv

```
### 2026-09-22 · Seans B · PmUserStoryLesson (P0 etalon) — F-0922-63

**Mentor:** «osonroq, tushunarliroq, qiziqroq misollardan foydalanish kerak».
Tashxis: olam aybdor emas (YouTube — mentor matnida shunday aytilgan), aybdor —
misollarning hammasi maktab-vazifasiga qarab ketgani. O'lchov: «darsni qayta ko'rish»
6 joyda, «imtihon» 6 joyda (5 dars + 1 uy vazifasi), «matematika» ipida yana 3 ekran.

Qilindi (uz+ru, 30 almashtirish + DEMO_STORIES to'liq qayta yozildi):
- **Ilgak va 3-so'rov:** «imtihonga tayyorlanayotgan o'quvchi / darsni qayta ko'rish /
  mavzuni tushunib olish» → «avtobusda maktabga boradigan o'quvchi / videoni yuklab olish /
  yo'lda internetsiz ham ko'ra olish». Bosqich-natijalari va tugma nomi («Yuklab olish»)
  shu ipga tortildi.
- **Oldindan-ko'rik (3 karta):** uch xil odam — uzun video ko'ruvchi · videoni yo'qotib
  qo'yadigan tomoshabin · birinchi videosini joylagan blogger.
- **Saralash + o'sish-kartasi + konstruktor (3 ekran):** «matematikadan qiynalayotgan
  o'quvchi» ipi → «o'yinda bir joydan o'tolmayotgan o'yinchi / videoni sekinlashtirib
  ko'rish / harakatni aynan takrorlash».
- **Baholash kartalari:** nuqsonlar (mavhum KIM · NATIJA=NIMA takrori) O'ZGARMADI,
  faqat matn jonlandi (9-sinf o'quvchisi → kanalni kuzatadigan tomoshabin; eslatma → obuna).
- **Uy vazifasi** placeholder ham moslandi.

**Etalon-qarori:** foydalanuvchi «etalon degani qolganlariga ta'sir qilsin emas — shu
darsning o'zida to'g'rila» dedi. Shuning uchun boshqa PM darslariga TARQATILMADI.

**Yo'l-yo'lakay tutilgan xato (o'z xatoim):** 885-satrda matn bitta qo'shtirnoq ichida
edi, yangi matndagi apostrof satrni erta yopdi — esbuild qizil bo'ldi. Qo'shtirnoq turi
almashtirilib tuzatildi. **Saboq:** apostrofli matn faqat ikki qo'shtirnoq ichiga yoziladi;
almashtirishdan keyin esbuild MAJBURIY.

**Darvozalar:** 6/6 toza. **Ko'z bilan:** s0 (2-mijoz xabari) · s1 (uch namuna karta) ·
s3 (konstruktor bo'laklari) — skrinshot bilan ko'rildi.
```

---

## F-0922-72 · Mavzu fotolari — natija «haqiqiy saytga» o'xshadi (mentor: «medialar qo'shib»)

**Fayl:** `src/2-Modull/PracticeLesson2.jsx` · foydalanuvchi 4 rasmni media-kutubxonaga yukladi.

| Mavzu | Rasm | Ulanish |
|---|---|---|
| O'yin — PIXEL QUEST | piksel-art platformer | `TOPIC_PHOTO` |
| Jamoa — SKY HAWKS | maktab basketbol maydoni (devorda SKY HAWKS) | `TOPIC_PHOTO` |
| Turnir — CYBER CUP | kibersport zali (ekranda CYBER CUP) | `TOPIC_PHOTO` |
| Blog — GAME REVIEW | bloger stoli (kitobda GAME REVIEW) | `TOPIC_PHOTO` |

**Qoida (yangi, muhrlanishi kerak):** rasm ustiga **tanlangan rang pardasi** tushadi
(`linear-gradient(135deg, ${c}d9, ${c}73)` + foto + zaxira gradient). Sababi — dars «rang»ni
ingredient sifatida o'rgatadi; foto pardasiz qo'yilsa o'sha ingredient ko'rinmay qoladi.
**Minimal** stilida foto YO'Q — «sodda» stil farqini shu ko'rsatadi.
**Zaxira:** rasm yuklanmasa uchinchi qatlam (to'liq gradient) qoladi — dars to'xtamaydi (156-qonun 4-band).

**Ikki chizish yo'li bor edi:** `LandingPreview` ning `draft` tarmog'i alohida kod ekan —
birinchi urinishda quruvchi-ekranlarda foto chiqmadi. Ikkala yo'lga ham qo'yildi.

🔴 **Ochiq:** rasmlar **1.7–2.3 MB** (jami ~8 MB). Brauzerda 15 soniyada ham yuklanib ulgurmadi.
Siqilgan nusxalar tayyor (`1200×600`, **117–152 KB**, jami ~530 KB) — foydalanuvchi yuklagach
4 ta havola almashtiriladi.

---

## F-0922-73 · Yakuniy ekran kuchaydi — 6 band + nusxalash + skroll

**Foydalanuvchi qarori:** «kattaroq, kuchliroq promptli; matn katta bo'lsa nusxalash tugmasi va
quti ichida skroll».

- **5 · Kimga** (o'smirlar · maktab o'quvchilari · ota-onalar) — natijada pastki sarlavhaga qo'shiladi
- **6 · Tugma yozuvi** (Boshlash · Ro'yxatdan o'tish · Batafsil) — natijadagi tugma matnini almashtiradi
- Buyruq endi 4 gap: qo'shimcha «Sahifa … uchun. Tugmada «…» deb yozilsin.»
- **Nusxalash tugmasi** yorliq qatorida; matn **ekrandagi tugundan** olinadi (`innerText`) —
  ikki joyda ikki xil gap qolib ketmaydi. `navigator.clipboard` bo'lmasa `execCommand` zaxirasi;
  **muvaffaqiyatsiz bo'lsa «✓» ko'rsatilmaydi** (rost aytadi)
- Buyruq qutisi `pb-scroll` — skroll + nozik scrollbar

**🔴 Tutilgan xavf (muhrlangan bug-sinf F-0803-19):** 6 band qo'shilgach **1280×720 ekranda
6-band navigatsiya chizig'idan pastga tushib ketdi** — ya'ni majburiy darvoza ko'rinmasdi.
`@media (max-height: 780px)` siqish qoidasi bilan yopildi (ustun bo'shliqlari, chip padding,
quti balandligi). **Har yangi band qo'shilganda 1280×720 da qayta o'lchanadi.**

**Yo'l-yo'lakay ikki xato (o'zim qo'yib, o'zim tutdim):**
1. Bir qatorli JSX ichiga `//` izoh yozdim — qatorning qolgani o'chdi, dars qurilmadi
   (CLAUDE.md dagi aynan o'sha tuzoq). Izoh olib tashlandi.
2. Mentor gapini faqat **o'zbekchada** 6 ga o'zgartirdim — ruschasi «все 4 ингредиента» bo'lib
   qolgandi, ruscha skrinshotda tutildi. **Sabog'i:** juftlikning bir yarmini o'zgartirib qo'ymaslik.

**Tekshiruv:** `gates` — dark 7=7, til 🔴6=6 (🟡 8→10: ruscha `ph="для кого"` joy-egallovchilari,
baseline'da ham aynan shu sinf bor edi) · `lint:jsx` 157 fayl **0** · `lint:prompt` **0** ·
`smoke-rejim` uz ✓ ru ✓ · `smoke-arena` 1/1 · `ach-probe --solo` s15 **1/1** (spetsifikatsiya
6 bosishga yangilandi) · skrinshot: 1280×720 va 1440×900 da uz+ru, foto ikkala chizish yo'lida.

**Tegilmagan (qaroringizni kutadi):** uyga vazifa hali «4-ingredientli buyruq» deydi — yakuniy
ekran 6 ga o'tgani bilan uni ham 6 ga chiqarish kerakmi?

---

## F-0922-74 · Rasmlar siqildi · uyga vazifa 6 bandga chiqdi

**Rasmlar (F-0922-72 ning yakuni).** Birinchi yuklangan PNG'lar 1.7–2.3 MB edi va brauzerda
**15 soniyada ham yuklanib ulgurmadi** (o'lchandi). Siqilgan nusxa tayyorlandi (`1200×600`, JPEG
sifat 82, progressive) — **117–152 KB**, jami 8 MB → **0.5 MB**. Foydalanuvchi qayta yukladi;
to'rtala fayl **md5 bo'yicha aynan** mos ekani tekshirildi, havolalar almashtirildi.
Endi foto **2.5 soniyada** chiziladi (skrinshot bilan tasdiqlandi).

**Saboq:** dars-rasmi uchun 1200 px / 2:1 / ≤200 KB — talab sifatida aytiladi va
**yuklangach qayta o'lchanadi** (hajmni ko'z bilan ko'rib bo'lmaydi, darvoza ham ko'rmaydi).

**Uyga vazifa 6 bandga chiqdi (foydalanuvchi qarori).** Sabab: yakuniy ekran 6 bandga o'tgach,
uyda 4 so'rash orqaga qadam bo'lardi. **Lekin** uyda quruvchi-tugmalar yo'q — bola buyruqni
o'zi yozadi, shuning uchun oltitasi **sanab beriladi**:
«6 bandli buyruq bilan bitta promo sahifa qurdiring: mavzu · stil · rang · qismlar · kimga · tugma yozuvi».

**Yo'l-yo'lakay tuzatilgan ziddiyat:** yakun-ekranidagi xulosa «Yaxshi prompt = **4** ingredient»
deydi, uning ostidagi vazifa esa **6** band so'rardi. Xulosaga ko'prik qatori qo'shildi:
«Kuchliroq buyruq: yana kimga va tugma yozuvi» — 4 asosiy qoida bo'lib qoladi, 6 esa kuchaytirilgani.

**Tekshiruv:** `gates` — dark 7=7 · til 🔴6=6 · `lint:jsx` 157 fayl 0 · `lint:prompt` 0 ·
`smoke-rejim` uz ✓ ru ✓ · `smoke-arena` 1/1 · `ach-probe --solo` 1/1 ·
skrinshot: 2-ekran (foto 2.5 s da) · yakun-ekrani (uyga vazifa bir qatorga sig'di).

---

## F-0922-75 · Mentor fidbegi — `JsLoopsLesson` s10: massiv kodda ko'rinmasdi

**Mentor so'zi:** «Massiv tursin siklni tepasida — kodda tushuntirish uchun; pastdagi rasmchalar
yetarli emas». **Foydalanuvchi:** «kod vizualda massiv tepada ochilganini ham ko'rsataylik».

**Joy:** `src/2-Modull/JsLoopsLesson.jsx` — `Screen10` (12/19), kod bloki `:1264`.

**Tashxis:** kodda faqat `for` sikli turardi; `mevalar` **hech qayerda ochilmagan** edi.
O'quvchi `mevalar.length` va `mevalar[i]` ni ko'radi-yu, `mevalar` qayerdan kelganini bilmaydi —
pastdagi mevali kartalar **rasm**, kod emas.
**O'lchov:** massiv ikki ekran oldin (`Screen8`, `:1185`) kodda ko'rsatilgan — ya'ni bilim berilgan,
lekin aynan shu ekranda ko'z oldida yo'q. Bola ikki ekran orqaga qaytmaydi.

**Qilingan (foydalanuvchi B variantini tanladi):**
1. Kod bloki tepasiga `let mevalar = ["olma", "banan", "uzum", "qulupnay"]` qo'shildi.
2. **Sinxron yoritish:** sikl aylanganda kod ichidagi o'sha element pastdagi karta bilan
   **birga** yonadi (`.arr-lit.scan`, `hi` holatiga ulangan). Ya'ni `mevalar[1]` → kodda
   `"banan"` yonadi, pastda «banan» kartasi yonadi.

**Nega faqat qator emas:** mentorning e'tirozi «kod tushuntirmayapti» edi. Yolg'iz qator qo'shilsa,
kod bilan kartalar hali ham ikki alohida narsa bo'lib qolardi; yoritish ularni bitta narsa qiladi.

**`const` → `let` (foydalanuvchi qarori).** Darsdagi uchala massiv-ochilishi `const` edi,
praktika topshirig'i esa `let mevalar = …` deb yozardi — bola darsda `const` ko'rib, mashqda `let`
yozishi so'ralardi. Endi hamma joyda **`let`** (`:1185` · `:1224` · `:1319` + yangi qator).
Sinov yiqilmasdi (tekshiruv faqat massiv-literalini ko'radi), ya'ni bu **jim nomuvofiqlik** edi.

**Tekshiruv:** `gates` — til 🔴**0=0** 🟡1=1 · dark **5=5** (baseline bilan bir xil) ·
`lint:jsx` 157 fayl **0** · `lint:prompt` **0** · `smoke-rejim` uz ✓ ru ✓ · `smoke-arena` 1/1 ·
`ach-probe` s14 **1/1** · skrinshot 1280×720: s10 (uz — aylanish o'rtasida, ru — yakunda) ·
s8 (`let mevalar`) · s11 (`let dostlar`). Balandlik: tugma 580px, navigatsiya 640px — sig'di.

---

## F-0922-76 · `NestArchPracticeLesson` s15 — shakl-telli yopildi (F-0922-70 sinfi)

**Manba:** mentor emas — F-0922-70 ni yopgandan keyin butun `src/` bo'yicha o'tkazilgan o'lchov
topdi. Foydalanuvchi ruxsat berdi.

**Joy:** `src/4a-Modull/NestArchPracticeLesson.jsx:1568` — `Screen15` (16/23), `correctIdx={1}`.

**Tashxis:** savol «Mijoz buyurtma berolsin desak, **qatorni** qanday tuzatamiz?» — ya'ni javob
kod-tahriri. Lekin 4 variantdan **faqat to'g'risida** kod-chipi bor edi:

```
A  Qo'riqchini butunlay olib tashlaymiz        sodda matn
B  `@Roles('public')` ga o'zgartiramiz         ← CHIP, va bu TO'G'RI javob
C  Har bir mijozni admin qilamiz               sodda matn
D  Tugmani frontend'da yashiramiz              sodda matn
```

**Qilingan — chip to'g'ri javobdan OLINMADI, distraktorlarga qo'shildi** (savol kod haqida
bo'lgani uchun kodni olib tashlash ma'noni buzardi; darsning o'z atamalari ishlatildi:
`@UseGuards()` 3 marta, `@Roles(ADMIN)` 7 marta uchraydi):

- A ✅ «Qo'riqchini (`@UseGuards()`) butunlay olib tashlaymiz» — metafora saqlandi, yoniga kod
- C ✅ «Har bir mijozga `@Roles(ADMIN)` beramiz» — `public ↔ ADMIN` qarama-qarshiligi kuchaydi
- B, D va `correctIdx` **tegilmadi**

**Nega D sodda qoldi:** u frontend haqida, server kodi yo'q; bu darsga CSS/HTML tokeni kiritish
begona shovqin bo'lardi. Yolg'iz sodda variant **xato** javob bo'lgani uchun kalitni oshkor
qilmaydi — §147 nuqsoni faqat yolg'izi TO'G'RI javob bo'lganda tug'iladi.

**Ehtiyot:** fayl 21:16 da narigi seans tomonidan tahrirlangan edi (HEAD'dan 50/41 qator farq).
Yozishdan oldin fayl o'zgarmagani `mtime` bilan tekshirildi; tahrir bitta qator.

**Tekshiruv:** `gates` **6/6 toza** (baseline bilan bir xil: til 🔴0 🟡4, dark toza) ·
`lint:jsx` 157 fayl 0 · `lint:prompt` 0 · `smoke-rejim` uz ✓ ru ✓ · `smoke-arena` 1/1 ·
`ach-probe` **6/6** (P2+Q4 dagi barcha NestArch spetsifikatsiyalari) ·
skrinshot: uz (savol) · ru (javob ochilgan, B yashil, izoh joyida).

**Sinf bo'yicha yakuniy o'lchov:** 471 MC-blok, **386 tasi ajratildi** — to'g'ri javobda yolg'iz
kod-chipi **0 ta qoldi** (`PmLesson7.jsx:714` skanerga tushadi, lekin u JS shablon-satri
`${HERO.kim}`, ekranda chip emas — soxta signal).
🔴 **85 blok boshqacha yozilgani uchun ajratilmadi** — ya'ni «butun loyiha toza» deb ayta olmayman.
