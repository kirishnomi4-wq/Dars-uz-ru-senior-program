# 14-dars «Loyiha kuni: 3-asosiy funksiya» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 7/10 (pedagogika 8.5 · bir vaqtdagi so'rov tushuntirishi 8.5 · texnik aniqlik 6.5 · o'z mahsulotiga ko'chirish 5.5 · 90 daqiqa 5). Hukm: **Qabul 12 · Qisman 5 · Rad 5 · Allaqachon / o'zgarishsiz 18**.
Tekshirilgan manbalar: MD o'zi (grep) · tayanch 2 (tugma «O'yindan chiqish»), 4, 9.29, 9.35, 9.74, 9.83, 9.84, 9.86–9.89 · 11-dars MD (Mentor F1 talabi — «bir vaqtda» qatori yo'q) · 11–13-FILTR · `QOIDALAR.md` T-028, T-067.
Zaxira: scratchpad `md11/14-oldin-14filtr.md`, `md11/tayanch-oldin-14filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «8 / 10» = `qoshildi` + `keladi` — 11–14 uchun umumiy qoida bo'lsin | Allaqachon | Tayanch 9.74 (06.10 01:51); 11-FILTR 21 (11-dars REPO tuzatildi), 12-FILTR 1, 17 (9.87 — «qo'shilgan» ruxsati). |
| 2, 19, 20 | «Uch blok — har funksiyaga mos» — yo'q; A1 «yangi yo'l + Database», A2 «bir vaqtda» hamma funksiyada emas | **Qabul** | A-bo'lim: «Mentor misolining uch qatlami (ko'p funksiyaga mos, lekin hammasiga emas)». A1 sarlavhasi **«Uchinchi funksiyaning Backend qismi ishlasin.»** (45); vazifa: «… harakat yangi holatni saqlasa — Database'ga yozilsin»; A1 «Ochish»: «Funksiyangiz Database'ga yozmasa — bu blokda u ishlatadigan Backend yo'lini quring.» A2 «Ochish»: «… umumiy ma'lumotga yozmasa — tez ikki marta bosishda nima buzilishini toping; hech narsa buzilmasa — Mentor bilan mos boshqa tekshiruvni tanlang.» A2 sarlavhasi qoladi (auditor ham qoldirgan). Tayanch 9.94. |
| 3 | Asosiy fikr umumiy emas | **Qabul** | «**Funksiya umumiy ma'lumotni o'zgartirsa,** ikki narsa tekshiriladi: …» — shart bilan to'g'ri gap. |
| 5 | «Ikkinchi so'rov kutadi» — har Backend'ning qoidasi emas | **Qisman** | Joriy qator: «**Bu misolda** Backend … ikkinchi so'rov kutib turadi.» (103). Kutish — Mentor talabining o'zi talab qilgan usul («shu payt boshqa so'rov kutib tursin»), shuning uchun arena 10 va kartochka qoladi; tayanch 9.94. |
| 7, 8 | «Bir vaqtda» tekshiruvi — isbot emas; agent qanday yuborganini aytsin | **Qabul** | A2 prompti: «Birga yuboriladigan so'rovlar bilan tekshir: … beshta so'rovni birga yubor. **Qaysi usul bilan yuborganingni** va har javobni ayt.»; kutilgan natijada `5 so'rov birga (Promise.all)`; izohda «bu tekshiruv, isbot emas — qulfsiz kod ham ba'zan o'tib ketishi mumkin». |
| 9 | `oyin_id = 5 / 6` qattiq yozilgan | **Qisman** | O'quvchi qadamlarida `id` yo'q edi («jadvalingizni oching»); `5`, `6` — faqat «kutilgan natija · namuna»da. Endi u yerda: «Mentor misolida; sizda — agent aytgan `id`»; agent `id` larni o'zi aytadi (10-band). |
| 10 | «Tekshiruv yozuvlarini o'chir» — boshqa qatorlarni ham o'chirib yuborishi mumkin | **Qabul** | Agent tekshiruv yozuvini yaratganda `id` larini aytadi; o'chirish: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» (A1, A2); tayanch 9.92. MD TS 9 yopildi. |
| 13 | «Navbatdasiz» va «Navbatda: N» tayanchga | **Qabul** | Tayanch 9.93 (o'rin raqami ko'rsatilmaydi — javobda yo'q). MD TS 7 yopildi. |
| 18 | «10 kishi kerak edi — 9 kishi keldi» — «bu misolda» | **Qabul** | Yorliq: «bu misolda: 10 kishi kerak edi — 9 kishi keldi». |
| 32, 33 | A2 natijasi «`qoshildi` · 2» — nega 2?; A1 ketma-ketligida kim nima qildi | **Qabul** | «`qoshildi · 2` (oldin 1 + yangi 1)»; A1 agent javobi: «o'yinchi 1, 2 · qoshilish · o'yinchi 3 · navbat · o'yinchi 1 · chiqish · o'yinchi 3 → qoshildi». |
| 39 | Yakun — holatga qarab | **Qabul** | A3 — «Uchinchi funksiya tayyor: oldingilari bilan ishlaydi.» · A2 — «Backend qismi tayyor — telefondagi qismi qoldi.» · A1 — «Backend harakati ishlaydi — bir vaqtda bosish qoldi.» · yo'q — «Uchinchi funksiya boshlandi — qolgan qadamni tugating.»; belgi faqat A3 da (nishon bilan bir). |
| 28 | 5-savol «joy bittaga tegsin» — g'alati | **Qisman** | «joy **bittasiga** tegsin» (53) — «tegmoq» darsdagi so'z (xulosa, recap «bitta odamga tegadi»); auditor taklifi uzunroq va variantlar muvozanatini buzardi. Kalit A o'zgarmadi, to'g'ri variant yolg'iz eng uzun emas (B — 54, D — 55). |
| 37, 38 | 90 daqiqa juda agressiv; A1 uchun tayyor skelet; uyga vazifa yo'q | **Qisman** | Yakun holatga qarab (39) va «Ortda qoldingizmi» — ulgurmagan o'quvchi yo'li. Tayyor Backend skelet — **rad**: Qaror-0 6 (o'quvchi hamma qadamni o'z repo'sida). Real vaqt — 10-dars sinovida (o'sha tuzilma) taymer bilan. |
| 12 | Navbatdagi uchun «Navbatdan chiqish» qulayroq | **Rad** | Tugma nomi tayanch 2 da «O'yindan chiqish» (06.10); yo'l bitta (`…/chiqish`); navbatdagi o'yinchi ham shu o'yin ro'yxatida, tugma yonida «Navbatdasiz» yozuvi turadi — ma'no aniq. Yangi tugma nomi — T-014 ga qarshi ikkinchi so'z. Tayanch 9.93 da qayd etildi. |
| 17 | Hookda «Qiziq fikr!» | **Rad** | QOIDALAR T-028, T-067 (tayanch 9.76). |
| 22 | A3 web — to'liq Yordam prompti | **Rad** | 11-FILTR 25 bilan bir: tayanch 4 — trek farqi «Yordam»da bir gap; talabni o'quvchi o'zi yozadi; web gapi farqlarni aytadi (o'yin sahifasi, «Yangilash», «Rostdan chiqasizmi?» — brauzer oynasida). |
| 35, 36 | Render va Netlify avtomatik yangilanishi — mutlaq gap | **Rad** | Kurs sozlamasi: 10-darsda Render xizmati sukut bilan ochiladi (Auto-Deploy «On Commit» — rasmiy default), 9-darsda Netlify GitHub'dan import qilinadi (har push'da yangilanadi). O'quvchi ularni o'chirmaydi; MD «Shubhali joylar»da qayd bor, «qur»da Render interfeysi ko'z bilan ko'riladi (P-028). |
| 16 | `yaratilgan` qayta yozilganda yangilanadi — aniq bo'lsin | Allaqachon | REPO: «qayta yozilsa holat va `yaratilgan` yangilanadi — navbat oxiriga»; tayanch 9.93 ga ham yozildi. |
| 23 | Ikkinchi akkaunt — asosiy yo'l o'z telefonida | Allaqachon | 12-FILTR 21–22 sinf-supurishi (A3 1-qadam). |
| 34 | «Eng yaqin o'yin» 13-darsdan ko'chgan | Allaqachon | 13-FILTR 15 sinf-supurishi (14-dars 2 joy). |
| 4, 6, 11, 14, 15, 21, 24–27, 29–31, 40 | Bir vaqtdagi bosish sahnasi · `FOR UPDATE` «masalan» · `keladi` ham chiqadi · o'rin raqami yo'q · navbat tartibi · A3 regressiya · real odam yo'q · «9 / 10» bo'lmaydi · navbatdagi `qoshildi` · 1-savol · «tugma 1 soniya» distraktori · qulf `oyinlar` qatorida · A1/A2 ketma-ketligi · nishon | O'zgarishsiz | Auditor tasdiqladi. |

**MD TAYANCHGA SAVOL:** 7 — 9.93 · 9 — 9.92 · 10 — 9.94 · 14 — yopildi (11-dars Mentor talabida «bir vaqtda» qatori yo'q — A2 dagi `…/qoshilish` o'zgarishi haqiqiy) · 13 — ochiq (kalit yo'q bo'lsa funksiya nomi, 15-dars).

Tekshiruv: `lint:til` 14 — 0 error (2 ogohlantirish, avvalgidek) · o'zaro tekshiruv — arena 3/3/3/3.
