# 11-Modul — nima mumkin emas (umumiy qonun fayllaridan, MD yozishdan oldin)

Manbalar: `QOIDALAR.md` (reestr, ID lar) · `konveyer/QURISH_KARTASI.md` · `MATN_ETALONI.md` (lug'at) · `MATN_KORPUS.md` · `PM_Prompt_v8.md` (keys banki) · `PM_DARS_ETALON.md` ·
`til-lint-rules.json` · foydalanuvchining saqlangan qarorlari · 10-Modul `00-TAQIQLAR.md` (asos). 06.10.2026 yig'ildi.
Bu ro'yxat — qisqa eslatma; ziddiyat bo'lsa manba fayl to'g'ri. `npm run lint:til` ko'p so'zni o'zi ushlaydi — lekin bu yerdagi ko'p band skriptga ko'rinmaydi.

## 0. Foydalanuvchining qat'iy qonunlari (05.10) — MD da ham
- Har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi — ixcham qator bo'lib natijagacha turadi. MD da har harakatli ekranga «Harakat → Vizual o'zgarish» va Mentor gapi aynan shu harakatni aytadi.
- Kartochkalar — alohida ekran (podium → kartochkalar → yakun): Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi», tugma «Yakunlash →».
- Brend yoki mahsulot nomi — o'z rangida, tanish maketda (telefon, brauzer, chat), jonli sahnada; matnli karta rad. Logotip chizilmaydi. «Maydon Jamoa» — telefon maketida.
- Agent MD matnini o'zboshimcha o'zgartirmaydi — kerak bo'lsa «MD ga taklif» deb yozadi (bu quruvchiga; MD yozuvchi esa har so'zni o'zi aniq yozadi).
- O'ylab topilgan qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: o'yinchi, tashkilotchi, sinfdosh, ota-ona.

## 1. Mazmun va halollik
- Bankdan tashqari keys, raqam, sana, manba — **yo'q** (PM_Prompt_v8, PM-016). Keyslar — tayanch 5-bo'lim, faqat o'sha darsga berilgani. Raqam yilsiz aytilmaydi; «raqamsiz» keysga raqam qo'shilmaydi.
- Mentor raqamlari — faqat tayanch 1-bo'limdan va «Mentor misolida» deb chegaralangan; statistika yoki tadqiqot deb aytilmaydi (T-043). Bitta misol umumiy qonun qilib aytilmaydi.
- RICE, intervyu sanog'i, sinov — **tanlovga yordam, isbot emas**; «RICE to'g'ri g'oyani topib beradi» kabi gap yo'q.
- Qat'iy gaplar yo'q: «har doim», «hech qachon», «minglab», «darhol», «darrov», «albatta», «100%», «aniq ishlaydi» (T-020).
- Agent kafolati yo'q: agent talabga tayanib quradi, taxmin qilishi mumkin; natijani o'quvchi telefonda o'zi tekshiradi. AI — taklif qiladi, qaror o'quvchiniki (T-063).
- Soddalashtirish yolg'on model yasamaydi (T-045): Expo Go — sinash vositasi, do'konga chiqarish emas; PWA — o'rnatiladigan sayt, do'kondagi ilova emas; Expo Router Stack — React Navigation asosida.
- Real kompaniya ichki qarorini da'vo qilmaydi (PM-018); mashhur odamning shaxsiy boyligi aytilmaydi. K19 da bankda yo'q fakt («jonli ko'rsatdi», «sotuv») qo'shilmaydi.
- Tashqi xizmat (Expo, Expo Go, GitHub, Render, Neon, Netlify, Antigravity, Chrome, Safari) tugma va menyu nomlari taxmin qilinmaydi (P-028): rasmiy hujjat (havola MD izohida) yoki umumiy so'z + «shubhali joylar».
  Har tashqi qadamda xato yo'li bitta gap, aybni o'quvchidan oladi (P-026): QR ochilmasa — bitta Wi-Fi yoki `--tunnel`.

## 2. Odamlar va misol-ip
- Bir dars — bitta misol-ip «Maydon Jamoa» (P-001, 108); ikkinchi misol faqat qisqa mashq yoki testda. Boshqa darsning keysi yoki metaforasi tilga olinmaydi (PM-016).
- O'quvchining o'z g'oyasi — uning ishi; Mentor misoli namuna, o'quvchiga «jamoa yig'ish» tavsiya qilinmaydi.
- Misol o'smir oxirgi haftada ko'rgan yuzadan (T-046, 95-qonun): Telegram guruhi, maktab, mahalla, futbol; gazeta, rus realiyasi yo'q.
- Metafora — ko'pi bilan bitta, bir marta, «…ga o'xshatish mumkin» shaklida (T-016); taqiq manbalari: inson a'zolari (miya, yurak, suyak), biologiya, kimyo, mavhum matematika.
  «Sehr», «jon kiritish», «usta», «sandiqcha», «oshxona/masalliq», «poydevor — uy» kabi qo'shimcha obraz yo'q (poydevor — atama, metafora qilib yoyilmaydi).
- «Bot» odamga nisbat berib o'qilmaydi (SABOQ 5).

## 3. So'z va ohang
- Siz-forma hamma joyda (tugma, yorliq, zanjir ham — T-071/073). Istisno: agentga beriladigan prompt matni (T-002).
- **Taqiq so'zlar** (T-021, T-022, lint): «sir», «hozircha sir», «sirini ochamiz», «sehr», «mo'jiza», «professional», «mohiyat», «loyqa», «pardoz»;
  sifatlar «buzuq», «buzilgan», «g'alati», «chalkash», «chala», «shunchaki», «foydasiz», «mezon»; kitobiy «chora», «nolish» (PM-022).
- Kantselyarit yo'q: «ushbu», «mazkur», «hisoblanadi», «amalga oshiriladi», «muhim ahamiyatga ega», «tavsiya etiladi», «quyidagi» (7-C.2).
- Sheva va so'zlashuv yo'q: «-votti», «bo'pti», gap oxiridagi «-ku/-da/-a/-ya», «zo'r», «qoyil», «aka», «brat». Maqtov: «Yaxshi!», «To'g'ri!», «Ajoyib!».
- Belgi-formula (≠, =, →, +) o'quvchi izohida va test variantida yo'q — to'liq gap (T-035). RICE formulasi — faqat formula kartasida (vizual), izohda so'z bilan: «qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz».
- «Daftaringiz» yo'q (T-040) · «o'z so'zingiz bilan» → «ekranga qaramasdan, yoddan» · «taxmin qiling» → «Avval o'zingiz belgilab ko'ring» · «hukm bering» yo'q ·
  «Xato — 0 ball» → «Adashdingiz — 0 ball» · «Kodda xato» → «Kod ishlamadi» · «Endi ochamiz:» yo'q · «kompilyator: … oyna» → «kod oynasi».
- «Keyingi darsda …» va'dasi ekranda yo'q — kelajak faqat uyga vazifa muddatida va yakundagi «Keyingi dars — «…»» qatorida (T-038). Demo Day 7 ham va'da qilib aytilmaydi.
- Ichki kodlar o'quvchi matnida yo'q: F1/F2/F3, T6, P1, «Modul 11», `m9-04`, YADRO, «artefakt», «keys» (ekran yorlig'ida — «Biznes olamidan»), «trek-A».
  Funksiyalar nomi bilan: «o'yin e'loni va qo'shilish», «o'yin kuni tasdiq», «chiqish va navbat».
- Modul raqami o'quvchi matnida — LMS raqami bilan («9-Modulda», React Native va PRD uchun «8-Modulda»), kod raqami emas — moslik jadvali tayanch 2-bo'lim boshida.
- Dasturda inglizcha turgan nom tarjima qilinmaydi (T-033): Expo Go, Expo Router, GitHub tugmalari, «Fork», «Pull Request».
- Qisqartma birinchi ko'rinishda ochiladi (T-036): RICE, PRD, PWA, API (agar kerak bo'lsa).
- **Lug'at — shu modul juftliklari:** fichа → **funksiya** · spec, TZ → **talab** (agentga) · otsev → **saralash** · chekpoint → **Mentor tekshiruvi** · 1-ga-1 → **yakkama-yakka** ·
  real-time → **real vaqt** (o'quvchi matnida; atama «real vaqt nuqtasi») · responsive → **adaptiv sayt** · fundament / skelet → **poydevor** · korrektirovka → **tuzatilgan reja** ·
  custdev → **intervyu** (custdev — kartochkada bir marta) · usability test → **sinov** · commitment → **harakat belgisi** · yo'l xaritasi → **roadmap** (4c-Modulda «yo'l xaritasi» — boshqa ma'no) ·
  ulush → **foiz** · mijoz (umumiy) → **foydalanuvchi** · prioritet → izoh bilan yoki «navbat».

## 4. Ekran tuzilishi
- Sarlavha ≤55 belgi, bitta qator; savol yoki harakat; sahna sharti Mentor'ga (P-010); yangi atama sarlavhada yo'q (T-011) — RICE, PRD, wireframe, PWA sarlavhaga o'tilgandan keyin chiqadi.
- Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi (T-072), «Bu…», «Hammasini…» bilan boshlanmaydi, ekranda ko'rinib turganini ta'riflamaydi (T-029, T-047).
- Hook javobi ≤120 belgi, «Aynan!» / «Qiziq fikr!» dan keyin (lint «Aynan!» ni ham sanaydi); hook javobi Mentor gapida oldindan aytilmaydi (P-016); xato tanlovga uyaltirmaydi.
- Reja ekrani — natija va'dasi, savol emas; ta'rif va keyingi ekran kashfiyotini aytmaydi; App.jsx `sub` bilan mos (P-014, P-015).
- Bir ekran — bir ish (P-008); tushuncha-ekranda bitta harakat → vizual o'zgaradi; «bos → matn-karta» taqiq (P-067); bitta kerakli vizual, bezak yo'q (P-052).
- Matn mexanika xulosasini oldindan aytmaydi (P-036); xulosa ≤110 belgi, bitta yashil xulosa; yakun fe'li ko'nikmani nomlaydi (T-049).
- Ballik testlar ketma-ket turmaydi — har biri o'z nazariyasidan keyin (P-012). Miqdor ekranda bir marta (P-062).
- O'quvchi ko'radigan matnda emoji yo'q (161-qonun; arena, nishon medali, podium — mustasno). Ovoz (audio) matni yozilmaydi.
- PM+PRAKT (13) — 12 ekran; loyiha kuni (10, 11, 12, 14) — 8 + 3 + kartochkalar = 12; 15-dars — 12; `.homework.jsx` yo'q; amaliyot blokida prompt «qayerda · nima qilsin · nima buzilmasin», texnologiya repo'da (P-060).
- **React Native kodi** darsda — o'qiladigan qisqa bo'lak + chizilgan telefon maketi (harakat → telefon ekrani o'zgaradi); kod oynasida RN ishga tushirilmaydi (Qaror-0 10).

## 5. Testlar, kartochkalar, nishonlar
- Savol ≤12 so'z, o'quvchiga qaratilgan (S-001); bitta himoyalanadigan to'g'ri javob (S-002).
- Variantlar uzunligi teng; to'g'ri javob eng uzuni emas; kalit so'z, tire, strelka, qavs faqat to'g'rida emas (S-003, S-006). Inkor-savol yo'q.
- Distraktor ishonarli va darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas, to'g'ri javobning ma'nodoshi emas (S-004, S-005); «Farqi yo'q» kabi o'zini fosh qiladigan variant yo'q.
- To'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz (S-009); xato izohi ≤60 belgi, javobni aytmaydi (S-010).
- Ball beriladigan matnda (savol, variant, arena) atama izohsiz qolmaydi — boshqa modulda o'tilgan bo'lsa ham (S-020).
- Kartochka `front` — to'liq savol, «?» bilan; «ta'rif → atamani top» qolipi yo'q (S-027). Takrorlash oynasi — 3 karta, PM da raqam (S-026).
- Arena 12 savol, to'g'ri javob o'rni A/B/C/D har biri 3 marta. Nishonlar 4 ta, nomi qisqa inglizcha («Built It!»), tavsifi o'zbekcha siz-formada; tekin bonus ko'pi bilan bitta.
- Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6).

## 6. Ma'lum ziddiyatlar (foydalanuvchiga ko'rsatiladi, agent o'zi hal qilmaydi)
- **«intervyu»:** MATN_ETALONI lug'atida «intervyu → suhbat»; 9-Modul tasdiqlangan atamasi — «intervyu» (dastur va 11-Modul nomlari ham). 11-Modulda «intervyu» qoladi (9-Modul bilan bir so'z).
- **K1 Uzum** — 9 va 10-Modulda ham bosh-keys (`m7-01`, `m8-10`); mintaqaviy qoida (har 8-darsda) uni 6-darsga qo'yadi — Qaror-0 17.
- **K15 YouTube** — PM-016 kundalik ilova cheklovi: faqat K15 voqeasi, YouTube kundalik misol sifatida emas.
- **Repo papkasi** `app/` → `mobil/` (tayanch 3) — Qaror-0 4 dan farq, GATE M da ko'rsatiladi.
