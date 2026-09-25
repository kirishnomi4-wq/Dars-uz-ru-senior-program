# Bridge darslar — to'liq reja (tasdiq uchun)

> 2026-09-23 · Asos: `BRIDGE_DARSLAR.md` (taqsimot tasdiqlangan) · v9 dastur
> Qarorlar (foydalanuvchi, 2026-09-23): AI qadami **bor** · lavash **yo'q** — real mahsulot misollari · o'quvchi g'oyasi darsdan darsga **o'tadi** · jonli ball **eski Supabase** orqali (2026-09-23, foydalanuvchi: «eskicha mentor kod yozadi»)

---

## 1. Hamma bridge darslar uchun umumiy qolip

| | |
|---|---|
| Hajm | 19–21 ekran · mentor bilan jonli dars · 90 daqiqa |
| Yo'q | uyga vazifa · koding (kompilyator) · LMS · analitika |
| Bor | jonli ball (PIN) · 4 ta ballik test (har biri o'z nazariyasidan keyin) · podium · flashcard · 12 savollik arena · 4 ta nishon |
| Misol-ip | **har dars — bitta real mahsulot** (o'quvchi o'zi ishlatadigan), hook'dan yakungacha |
| Keys | **har dars — bittadan bank keysi** (K1–K19), bitta o'tish yo'lida takrorlanmaydi |
| O'z g'oyasi | o'quvchi birinchi bridge darsda o'z g'oyasiga karta yozadi (KIM · MUAMMO · YECHIM); keyingi darslarda shu karta ochiladi va to'ldirib boriladi. Boshqa kompyuterda ochsa — kartani qaytadan yozish shakli chiqadi |
| AI qadami | har darsning oxirida: o'quvchining o'z kartasidan tayyor so'rov yig'iladi → gemini.google.com → natijani o'z ishiga qo'yadi. Qaror doim o'quvchiniki, AI faqat yordam beradi |
| Yakun | «AI Startup kursida bu …» — keyingi modulga ko'prik bitta gapda |
| Til | UZ + RU (dastur hammasi ikki tilli) |

## 2. Yetti dars

| Dars | Mavzular | Misol-ip (real mahsulot) | Keys | Kim o'tadi |
|---|---|---|---|---|
| **B1** Kim uchun qilyapmiz? | Auditoriya · Struktura | **OLX** — ortiqcha buyumini sotadigan va arzon narsa izlaydigan odamlar; OLX sahifasi | K8 Facebook | 1 · 2 |
| **B2** Muammoni topamiz | Muammoni izlash · Muammo → yechim | **Yandex Go** — ko'chada taksi kutish, narxni kelishish → ilovada chaqirish, narx oldindan | K4 Airbnb | 2 |
| **B3** Birinchi versiya va uni ko'rsatish | Dekompozitsiya (MVP) · Sistemani pitch qilish | **Kundalik.com** — agar uni noldan qursak, birinchi versiyada nima bo'lardi? Buvimga qanday tushuntiraman? | K3 Instagram | 2 |
| **B4** Kim uchun va qanday muammo? | Auditoriya + Struktura · Muammoni izlash · Muammo → yechim · JTBD | **Uzum Market** — kim kiradi, qaysi muammo, odam aslida nimani «sotib oladi» | K1 Uzum | 3 · 4 |
| **B5** Nima quramiz va qachon tayyor? | User Story · Dekompozitsiya · Prioritet · Acceptance Criteria | **Yandex Go** — hikoya → bo'laklar → qaysi biri birinchi → «buyurtma tayyor» shartlari | K3 Instagram | 3 · 4 |
| **B6** Qanday ko'rsatamiz? | Sistemani pitch qilish · Frontend pitchi | **Kundalik.com** — texnik bo'lmagan odamga tushuntirish, jonli demo 3 kadrda | K12 Airbnb pitch | 3 |
| **B7** Ma'lumot, ishonch va «Qanday ishlaydi?» | Ma'lumot · Xavfsizlik · Sxema · Fullstack pitch | **YouTube** — nimani eslab qoladi, nima ochiq/yopiq, sxemasi, 3 qavat | K6 Netflix | 4 |

Keys takrori tekshiruvi: 2-o'tish K8 · K4 · K3 ✓ · 3-o'tish K1 · K3 · K12 ✓ · 4-o'tish K1 · K3 · K6 ✓

🔴 Real mahsulot haqida faqat ko'rinadigan narsa aytiladi (sahifada nima bor, u nima qiladi). Kompaniya tarixi, raqamlar va ichki qarorlar to'qilmaydi — ular faqat bank keysidan keladi. «Agar noldan qursak» kabi mashqlar ochiq aytiladi, soxta tarix sifatida emas.

## 3. Har darsning tuzilishi (qisqa)

**B1 · OLX** — hook: «OLX'ga kim kiradi?» → «hamma uchun» sahifa almashtirgichi → test → Facebook keysi → OLX kartasini yig'ish → test → o'z g'oyasi kartasi ‖ ikki OLX sahifasini solishtirish → kartadan sahifaga (muammo «Muammo» bo'limiga kiradi) → test → bo'limlarni tartiblash + sotuvchi sahifani o'qiydi → test → o'z sahifasining tartibi → AI: sahifa matni → yakun
*(Qoralama allaqachon bor: `pm-senariylar/BRIDGE-B1-KimUchun.md` — lavash o'rniga OLX bilan qayta yoziladi)*

**B2 · Yandex Go** — hook: taksi ilovasi yo'q kun → muammoning 4 belgisi (odam o'zi aylanma yo'l topadi — eng kuchli belgi) → test → «bir kunim» o'yini (maktab o'quvchisining kunidan muammolarni ajratish) → Airbnb keysi → test ‖ har yechim bitta muammoga javob → ortiqcha «yechim»ni chiqarish → test → o'z kartasiga muammo va yechimni aniqlashtirish → test → AI: «muammomni kimdan so'rasam bo'ladi?» savollari → yakun

**B3 · Kundalik.com** — hook: «Kundalikni noldan qursangiz, birinchi kuni nima ishlashi kerak?» → funksiyalar ro'yxati → hozir / keyin → test → Instagram keysi → test ‖ texnik bo'lmagan odamga tushuntirish (buvim tushunadimi?) → 3 gapli tushuntirish yig'ish → test → o'z g'oyasining birinchi versiyasi + 30 soniyalik tushuntirish → test → AI: tushuntirishni soddalashtirish → yakun

**B4 · Uzum Market** — auditoriya va birinchi ekran (bitta blok) → test → muammo qayerda (Instagram'dan buyurtma, yetkazib berish yo'q) → Uzum keysi → test ‖ muammo → yechim → test ‖ JTBD: odam telefon emas, «ertaga eshigigacha yetib kelishini» sotib oladi → test → o'z g'oyasi kartasi (4 qator: kim · muammo · yechim · aslida nima uchun) → AI → yakun

**B5 · Yandex Go** — User Story (kim · nima · nega) → test → hikoyani bo'laklarga bo'lish → Instagram keysi → test ‖ qaysi bo'lak birinchi (foyda × vaqt) → test → «buyurtma tayyor» uchun 3 shart → test → o'z g'oyasiga 1 hikoya + birinchi bo'lak + 3 shart → AI → yakun

**B6 · Kundalik.com** — texnik bo'lmagan odamga tushuntirish → test → Airbnb pitch keysi → test ‖ jonli demo 3 kadrda (gap + harakat) → test → o'z g'oyasiga 3 kadrli ko'rsatuv → juftlikda 30 soniya → test → AI → yakun

**B7 · YouTube** — ilova nimani eslab qoladi → Netflix keysi → test ‖ ochiq va yopiq ma'lumot → test ‖ sxema: har ustun odamning savoliga javob → test ‖ «Qanday ishlaydi?» — texnik so'zsiz 3 qavat (sistema va frontend pitchi ham shu yerda) → test → o'z g'oyasiga 3 maydon + 3 qavat gapi → AI → yakun

Har dars GATE S ga to'liq senariy bo'lib keladi (ekranlar, matnlar, test variantlari), shu bo'lim faqat skelet.

## 4. Texnik tomoni

| | |
|---|---|
| Fayllar | `src/bridge/B1…B7` · lessonId `bridge-b1-v1` … `bridge-b7-v1` |
| Sayt | alohida Vercel loyihasi `dist-bridge` (mentor saytiga tegilmaydi). Bosh sahifa: 4 ta o'tish → darslar |
| Jonli ball | **eski Supabase** (`dwoubexcexzsinogojiu`, tirik — 2026-09-23 tekshirildi: `create_session` bor, mentor kodi so'raladi). `src/live/` ga Supabase-adapter (build-flag): `rpc` → `/rest/v1/rpc`, sessiya/o'yinchi/javob o'qish → jadval-select. `record_attempt` Supabase'da yo'q — mijoz xatoni jim yutadi (analitika kerak emas). Kristinaga hech narsa kerak emas |
| Natijalar | LMS'ga ham, `dars-api` bazasiga ham tushmaydi — faqat Supabase'dagi jonli jadvallarda (podium/arena uchun) |
| Darvozalar | har dars: `npm run gates -- <fayl>` (esbuild · jsx · dark · til · prompt) + render-sinov + jonli sinov (2 o'quvchi, podium 0 emas) |

## 5. Parallel ish — asosiy kursga 2 dars

| Dars | Holat | Nima qilinadi |
|---|---|---|
| **Muammoni qanday izlash** (JS moduli, 3-dars) | `PmLesson28` moslashtirishga yaroqsiz: jonli ball yo'q, RU yo'q, keyslar bankdan tashqarida (Uber, Dropbox), 9-oy darajasi | **Yangi dars** A retsepti bo'yicha. Olinadigan g'oyalar: muammoning 4 belgisi, «bir kunim» o'yini, KIM + QACHON + OG'RIQ. Keys K4 Airbnb. Uyga vazifa + RU + LMS |
| **Jobs-to-be-Done** (React moduli, 3-dars) | `PmJtbdLesson` sog'lom (qabulchi PASS 20/20), lekin M7 darajasida yozilgan | C retsepti: audit → darajani 4-oyga tushirish → yangi lessonId → uyga vazifa → RU → LMS. `PmUserStoryLesson` dagi milkshake ekrani JTBD'ga ilgak bo'lib qoladimi — auditda taklif beriladi |

B2 va B4 dagi «muammoni izlash» qismi yangi JS darsi bilan bir xil g'oyalarga tayanadi — shuning uchun u B2 bilan birga yoziladi.

## 6. Ish tartibi

| Bosqich | Nima | Sizning darvozangiz |
|---|---|---|
| 0 | Infra: `src/bridge/`, Vercel sayt qobig'i, Supabase-adapter + jonli sinov (2 o'quvchi, podium) | — |
| 1 | **B1 — pilot** (to'liq zanjir, har rolda ko'rsatiladi). Bridge qolipi shu darsda qotadi | GATE S · GATE 2 · GATE 3 |
| 2 | B2 + B3 → 2-o'tish to'liq tayyor | GATE S (ikkalasi birga) · GATE 3 |
| 3 | B4 + B5 + B6 → 3-o'tish tayyor | GATE S · GATE 3 |
| 4 | B7 → 4-o'tish tayyor | GATE S · GATE 3 |
| ‖ | Parallel: «Muammoni qanday izlash» (2-bosqich bilan) · JTBD auditi (3-bosqich bilan) | o'z GATE'lari |

Har dars zanjiri: senariy → metodist → **GATE S** → quruvchi → dizayn → jonli → 👦 1-o'qish → metodist → 👦 2-o'qish → **GATE 2** → tekshiruvchi → verifikator → qabulchi → **GATE 3**.
Commit va deploy — faqat sizning buyrug'ingiz bilan.

**Muddat (halol taxmin):** bir dars zanjiri ≈ 1 ish kuni + sizning ko'rigingiz. 7 bridge + 2 asosiy dars + infra ≈ **10–12 ish kuni**. Tezligi GATE'lardagi javoblarga bog'liq. B1 pilotdan keyin aniqroq aytaman.

## 7. Tasdiqlashingiz kerak bo'lgan narsalar

1. **Misol-iplar** (2-bo'lim jadvali): OLX · Yandex Go · Kundalik.com · Uzum Market · YouTube. Boshqasini xohlasangiz — ayting.
2. **Keyslar**: K8 · K4 · K3 · K1 · K3 · K12 · K6.
3. **RU** bridge'da ham bo'lsinmi? (Men «ha» deb yozdim.)
4. **Ish tartibi**: B1 pilot → B2+B3 → B4–B6 → B7, parallel ikki dars.
