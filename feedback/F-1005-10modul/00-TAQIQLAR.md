# 10-Modul — nima mumkin emas (umumiy qonun fayllaridan, MD yozishdan oldin)

Manbalar: `QOIDALAR.md` (reestr, ID lar) · `konveyer/QURISH_KARTASI.md` · `MATN_ETALONI.md` (1, 4, 4.1, 7, 7-C, 3-bo'lim lug'ati) · `MATN_KORPUS.md` ·
`PM_Prompt_v8.md` (keys banki) · `PM_DARS_ETALON.md` · `til-lint-rules.json` (64 error) · foydalanuvchining saqlangan qarorlari. 05.10.2026 yig'ildi.
Bu ro'yxat — qisqa eslatma; ziddiyat bo'lsa manba fayl to'g'ri. `npm run lint:til` ko'p so'zni o'zi ushlaydi — lekin bu yerdagi ko'p band skriptga ko'rinmaydi.

## 1. Mazmun va halollik
- Bankdan tashqari keys, raqam, sana, manba — **yo'q** (PM_Prompt_v8, PM-016). Keyslar — tayanch 5-bo'lim. Raqam yilsiz aytilmaydi; «raqamsiz» keysga raqam qo'shilmaydi; pul — foizda yoki so'z bilan.
- Manbasiz son sarlavhaga chiqmaydi; bitta misol umumiy qonun qilib aytilmaydi — «bu misolda», «bizning MVP da» (T-043). Mentor raqamlari — faqat tayanch 1-bo'limdagi.
- Qat'iy gaplar yo'q: «har doim», «hech qachon», «24/7», «minglab», «darhol», «darrov», «faqat», «albatta», «100%» (T-020).
- Agent kafolati yo'q: agent talabga tayanib quradi, taxmin qilishi mumkin; natijani o'quvchi tekshiradi. AI — taklif qiladi, qaror o'quvchiniki (T-063).
- Soddalashtirish yolg'on model yasamaydi (T-045). Atamaning so'zma-so'z ma'nosi dars ma'nosiga zid emas (T-044).
- Real kompaniya ichki qarorini da'vo qilmaydi (PM-018); mashhur odamning shaxsiy boyligi aytilmaydi (PM_Prompt_v8).
- **Xavfsizlik (5, 6):** faqat himoya — zaiflik turi, nega xavfli, qanday topiladi, qanday yopiladi. Hujum qatorlari, boshqa saytni tekshirish yo'riqlari yo'q. Faqat o'z saytingizda.
- Tashqi xizmat (Netlify, Render, UptimeRobot, GitHub) tugma va menyu nomlari taxmin qilinmaydi (P-028): ishonch bo'lmasa — «TAYANCHGA SAVOL». Har tashqi qadamda xato yo'li bitta gap (P-026).

## 2. Odamlar va misol-ip
- O'ylab topilgan qahramon, ism, personaj yo'q — vazifani Mentor beradi; odam roli bilan: o'yinchi, maydon egasi, sinfdosh (DARS_ETALON 5.8). Ekrandagi odamga yalang'och «o'quvchi» deyilmaydi (T-057).
- Bir dars — bitta misol-ip «Maydon» (P-001, 108); ikkinchi misol faqat qisqa mashq yoki testda. Boshqa darsning keysi yoki metaforasi tilga olinmaydi (PM-016).
- Misol o'smir oxirgi haftada ko'rgan yuzadan (T-046, 95-qonun); gazeta, rus realiyasi («bublik») yo'q.
- Metafora — ko'pi bilan bitta, bir marta, «…ga o'xshatish mumkin» shaklida (T-016); taqiq manbalari: inson a'zolari (miya, yurak, suyak), biologiya, kimyo, mavhum matematika (4.1).
  «Sehr», «jon kiritish» (CSS uchun), «usta», «sandiqcha», «oshxona/masalliq» metaforasi yo'q.

## 3. So'z va ohang
- Siz-forma hamma joyda (tugma, yorliq, zanjir ham — T-071/073). Istisno: agentga beriladigan prompt matni (T-002).
- **Taqiq so'zlar** (T-021, T-022, lint): «sir», «hozircha sir», «sirini ochamiz», «sehr», «mo'jiza», «professional», «mohiyat», «loyqa», «pardoz»;
  sifatlar «buzuq», «buzilgan», «g'alati», «chalkash», «chala», «shunchaki», «foydasiz», «mezon». (Xavfsizlikda «buzilgan» o'rniga — «begona qo'lga o'tdi».)
- Kantselyarit yo'q: «ushbu», «mazkur», «hisoblanadi», «amalga oshiriladi», «muhim ahamiyatga ega», «tavsiya etiladi», «quyidagi» (har abzatsda) (7-C.2).
- Sheva va so'zlashuv yo'q: «-votti», «bo'pti», gap oxiridagi «-ku/-da/-a/-ya», «zo'r», «qoyil», «aka», «brat» (7-C.3). Maqtov: «Yaxshi!», «To'g'ri!», «Ajoyib!».
- Belgi-formula (≠, =, →, +) o'quvchi izohida va test variantida yo'q — to'liq gap (T-035). Uch qadam zanjiri yorliqda «ochdi → vaqtni tanladi → band qildi» — yorliq, izoh emas.
- «Daftaringiz» yo'q (T-040) · «o'z so'zingiz bilan» → «ekranga qaramasdan, yoddan» · «taxmin qiling» → «Avval o'zingiz belgilab ko'ring» (S-014) · «hukm bering» yo'q ·
  «Xato — 0 ball» → «Adashdingiz — 0 ball» · «Kodda xato» → «Kod ishlamadi» · «Endi ochamiz:» yo'q · «kompilyator: … oyna» → «kod oynasi».
- «Keyingi darsda …» va'dasi ekranda yo'q — kelajak faqat uyga vazifa muddatida va yakundagi «Keyingi dars — «…»» qatorida (T-038, P-023).
- Ichki kodlar o'quvchi matnida yo'q: T6, P1, K9, «Modul 10», `m8-04`, YADRO, «artefakt», «keys» (ekran yorlig'ida — «Haqiqiy misol» / «Biznes olamidan») (T-036).
- Dasturda inglizcha turgan nom tarjima qilinmaydi (T-033): Netlify, Render, UptimeRobot, GitHub menyulari, «Pull Request», «Merge».
- Qisqartma birinchi ko'rinishda ochiladi (T-036): OKR, PR, 2FA, SSL, XSS, DNS.
- **Lug'at — shu modulga tegishli juftliklar** (MATN_ETALONI 3): secret → **maxfiy kalit** · ulush (metrikada) → **foiz** · dashboard → birinchi marta «dashboard (holat paneli)» ·
  o'lchanadigan → sanaladigan · metrikani ko'taradi → oshiradi · kuzatadigan raqam → ochib ko'radigan raqam · faol foydalanuvchi → izoh bilan («bir kunda ilovani ochib ishlatgan odam») ·
  auth → autentifikatsiya / himoya · endpoint → izoh bilan («so'rov yuboriladigan manzil») · ariza (so'rov ma'nosida) → so'rov · sessiya → (ishlatilmaydi) · mijoz (umumiy) → foydalanuvchi ·
  sotuv-nutq → ishontiruvchi nutq · general (repetitsiya ma'nosida) → repetitsiya · minimal (uslub) → sodda · tashxis → baho · prioritet → izoh bilan.

## 4. Ekran tuzilishi
- Sarlavha ≤55 belgi, bitta qator; savol yoki harakat; sahna sharti Mentor'ga (P-010, T-069); yangi atama sarlavhada yo'q (T-011).
- Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi (T-072), «Bu…», «Hammasini…» bilan boshlanmaydi, ekranda ko'rinib turganini ta'riflamaydi (T-029, T-047).
- Hook javobi ≤120 belgi, «Aynan!» / «Qiziq fikr!» dan keyin; hook javobi Mentor gapida oldindan aytilmaydi (P-016); xato tanlovga uyaltirmaydi (T-028).
- Reja ekrani — natija va'dasi, savol emas; ta'rif va keyingi ekran kashfiyotini aytmaydi; App.jsx `sub` bilan mos (P-014, P-015).
- Bir ekran — bir ish (P-008); tushuncha-ekranda bitta harakat → vizual o'zgaradi; «bos → matn-karta» taqiq (P-067); bitta kerakli vizual, bezak yo'q (P-052, 109-qonun).
- Matn mexanika xulosasini oldindan aytmaydi (P-036); xulosa ≤110 belgi, bitta yashil xulosa; yakun fe'li ko'nikmani nomlaydi, «Ajratdingiz!» kabi harakat takrori yo'q (T-049).
- Ballik testlar ketma-ket turmaydi — har biri o'z nazariyasidan keyin (P-012). Miqdor ekranda bir marta (P-062).
- O'quvchi ko'radigan matnda emoji yo'q (161-qonun; o'yin qatlami — arena, nishon medali, podium — mustasno). Ovoz (audio) matni yozilmaydi.
- PM+PRAKT — 12 ekran; loyiha kuni — 8 + 3 + kartochkalar = 12 (kartochkalar alohida ekran — 9-Modul pilot qoidasi, SABOQ 12; P-058 dan farq); `.homework.jsx` yo'q; amaliyot blokida prompt «qayerda · nima qilsin · nima buzilmasin», texnologiya repo'da (P-060).

## 5. Testlar, kartochkalar, nishonlar
- Savol ≤12 so'z, o'quvchiga qaratilgan (S-001); bitta himoyalanadigan to'g'ri javob (S-002).
- Variantlar uzunligi teng; to'g'ri javob eng uzuni emas; kalit so'z, tire, strelka, qavs faqat to'g'rida emas (S-003, S-006). Inkor-savol yo'q.
- Distraktor ishonarli va darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas, to'g'ri javobning ma'nodoshi emas (S-004, S-005); «Farqi yo'q» kabi o'zini fosh qiladigan variant yo'q.
- To'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz (S-009); xato izohi ≤60 belgi, javobni aytmaydi (S-010, S-048).
- Ball beriladigan matnda (savol, variant, arena) atama izohsiz qolmaydi — boshqa modulda o'tilgan bo'lsa ham (S-020).
- Kartochka `front` — to'liq savol, «?» bilan; «ta'rif → atamani top» qolipi yo'q (S-027). Takrorlash oynasi — 3 karta, PM da raqam (S-026).
- Arena 12 savol, to'g'ri javob o'rni A/B/C/D har biri 3 marta. Nishonlar 4 ta, nomi qisqa inglizcha («Built It!»), tavsifi o'zbekcha siz-formada; tekin bonus ko'pi bilan bitta (S-031, S-034).

## 6. Ma'lum ziddiyatlar (foydalanuvchiga ko'rsatiladi, agent o'zi hal qilmaydi)
- **Keyslar:** 9-Modul tayanchida bankdan tashqari keyslar bor (Dropbox, «The Mom Test», Tweetie, «300 million dollarlik tugma», Canva) — qonun (PM-016) faqat K1–K19 ni ruxsat beradi. 10-Modul qonunga amal qiladi.
- **«intervyu»:** MATN_ETALONI lug'atida «intervyu → suhbat»; 9-Modul tasdiqlangan atamasi — «intervyu». 10-Modulda bu so'z faqat 11-darsda (9-Modul yozuviga ishora) — 9-Modul atamasi bilan.
