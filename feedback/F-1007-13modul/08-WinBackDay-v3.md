# 13-Modul · 8-dars «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» — MD v3 (yangi dars, loyiha kuni)

Fayl: `src/11-Modull/WinBackDayLesson.jsx` (kalit `m11-08`, App.jsx `type: 'Proyekt'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar; podium umumiy shablon) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni, keyssiz (Qaror-0 21). Qolip: QKirish · QReja · QTushuncha ×2 · QTest ×2 · QBlok ×3 · podium · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, `00-NOMLAR.md` 8-qator): «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» · osti «nega ketishadi va bitta qaytarish mexanikasi» ·
oldingi `m11-07` «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» · keyingi `m11-09` «Kim haqiqatan to'lashga tayyor?» (osti «Mentor tekshiruvi: uchta yozma tasdiq»).
Namuna (tuzilish, hajm): 12-Modul `09-RetentionDay-v3.md` + `09-FILTR.md` (loyiha kuni, eslatma, sanoq yozuvi, haftalik chegara) · 12-Modul `04-LiveNotifyDay-v3.md` + `04-FILTR.md` (uch blok, «Bajardim» qoidasi) ·
7-Modul YAKUNIY `01-BotIntro.md` va `07-BotFullProject.md` (@BotFather, token `.env` da, webhook) · pilot `03-PaymentWebhook-v3.md` (webhook, takror xabar, maxfiy kalit odati) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · ko'p elementli mashq ketma-ket (E 53) ·
odamlar — rol va tartib raqami bilan («1-o'yinchi»), chizilgan ko'rinishi bo'lsa — real ko'rinishda (SABOQ 36) · «Ortda qoldingizmi» — darsda bir marta, 1-amaliyotda (SABOQ 39).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** · 7-ekran **B** · final tartib-mashqi yo'q (loyiha kuni, 172) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2 ≈ 6 · Amaliyot 1 ≈ 24 · 4 ≈ 2 · 5 ≈ 6 · Amaliyot 2 ≈ 19 · 7 ≈ 2 · Amaliyot 3 ≈ 17 · podium, kartochkalar, yakun, arena ≈ 9 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (uch blokda uch marta Render kutishi bor); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 10-band.
⚠️ **Xavfsizlik chegarasi (TAQIQLAR 3, Qaror-0 14) — har ekranga tegadi:** bot faqat o'zi «Start» ni bosgan odamga yozadi · o'chirish bir bosishda · Telegram xabari haftasiga ko'pi bilan ikkita · Telegram chat raqami va Telegram nomi hech qayerda ko'rinmaydi
(maketda, sahnada, promptda, saqlash kalitida, logda, skrinshotda; Database'da faqat chat raqami, ism va Telegram nomi umuman saqlanmaydi) · `TELEGRAM_BOT_TOKEN` va `TELEGRAM_SIR` qiymati faqat `backend/.env` da va Render sozlamasida · Telegram yosh chegarasi aytilmaydi.
Pul (TAQIQLAR 1): bu darsda to'lov yo'q; «Doimiy o'yin» — Mentorning Pro qulayligi (4-dars) faqat xabar sababi sifatida; Telegram xabarida to'lov taklifi yo'q.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.8):** dars oxirida o'quvchining o'z repo'sida, o'z mahsuloti va trekida **Telegram xabari ishlaydi, o'chiriladi va sanaladi**: foydalanuvchi ilovada tugmani bosib botda «Start» ni bosadi (bir martalik kod bilan) —
   Backend uning Telegram chat raqamini saqlaydi · Backend biladigan haqiqiy o'zgarishda bot xabar yozadi (haftasiga ko'pi bilan ikkita) · «Telegram xabarlarini o'chirish» bir bosishda · xabardagi havola bilan ochilgani sanoq yozuvi `telegramdan-ochdi` · maxfiylik siyosatida bitta qator.
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m13-dars-08-start` (= `m13-dars-07-done`) → `m13-dars-08-done` (tayanch 3, aynan). Uyga vazifa yo'q (loyiha kuni). Yangi saqlash kaliti yo'q (tayanch 8: 8-dars faqat `pm-m9d8-platforma` ni o'qiydi).
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** O'yinchining ilovasi yopiq bo'lsa ham, yangi o'yin yaratilganini Backend biladi; Telegram xabari uni yetkazadi — lekin faqat botni o'zi boshlagan odamga, haftasiga ko'pi bilan ikkita va bir bosishda o'chiriladigan qilib.
3. **Oldingi darslardan keladigan narsa (aynan):**
   - 7-Modul (kod `5`): bot — @BotFather'da `/newbot`, nom va foydalanuvchi nomi (oxiri «bot»), **token** — botni boshqarish kaliti, `.env` da turadi (`01-BotIntro.md` 6, 16-ekranlar) ·
     «Webhook — yangi xabar kelganda Telegram uni o'zi botning internetdagi manziliga (URL) yuboradi. Buning uchun botga internetda ochiq manzil kerak.» · «Bepul server uxlaydi; webhook xabari uni uyg'otadi.» · kartochka «Bitta tokenni laptop va serverda birga ishlatsa?» — «Ishlamaydi» (`07-BotFullProject.md`).
   - 12-Modul (tayanch 1.4, 1.9, 9.41): **eslatma** — telefon ekraniga ilova chiqaradigan xabar; rejalashtirilgan eslatma ilova oldindan bilgan narsani aytadi, **yopiq ilova yangi e'lon bor-yo'qligini bilmaydi** (halol chegara) ·
     «haftasiga ko'pi bilan ikkita» (hafta — dushanbadan yakshanbagacha) · «Eslatmalar» o'chirgichi · sanoq yozuvi `eslatmadan-ochdi`, sanoq sahifasi `lending/sanoq.html` (`SANOQ_KALITI`) · `POST /hodisalar` (ruxsat etilgan nomlar) · qurilma ID ·
     brauzer ko'rinishi — Netlify, yangi versiyada `npx expo export -p web` → `netlify deploy --prod --dir dist` (9.28) · APK o'zi yangilanmaydi · sinfdagi tekshiruv yozuvlari `id` bo'yicha o'chiriladi (9.41 i) · qaytganlar foizi — 61 qurilmadan 26 tasi (43%, 1.13).
   - 13-Modul: «Doimiy o'yin» — tashkilotchining Pro qulayligi, keyingi haftaning o'yini `GET /oyinlar` so'ralganda yaratiladi (oldingisining vaqti o'tgan bo'lsa; tayanch 1.4, 4-dars) · 3-dars: webhook, maxfiy kalit `.env` da, **takror xabar** (xizmat javob olmasa qayta yuboradi) ·
     `GET /men` (4-dars) · 7-dars: `lending/maxfiylik.html` ga to'lov bandi. Hisob raqamini topish — Neon'da `SELECT id FROM oyinchilar WHERE login = '…';` (3-dars A2 naqshi).
4. **Mazmun (tayanch 1.8 — aynan; tafsilotlar — TAYANCHGA SAVOL):**
   - **12-Modul 9-darsidan farqi (0–2-ekranlar):** u yerda ilova o'zi oldindan qo'ygan eslatma — ilova yopiq paytda yangi e'lon bor-yo'qligini bilmaydi. Bugun — **Backend** biladigan haqiqiy o'zgarish haqida, ilova yopiq bo'lsa ham, **Telegram bot** orqali (Qaror-0 14).
   - **Nega ketishadi (Mentor misoli, 0-ekran):** 12-Modul soni — birinchi haftada ilovani ochgan 61 qurilmadan 26 tasi ikkinchi haftada ham ochdi, 35 tasi ochmadi. Mentor ilovani yana ochmagan **5** tanish o'yinchiga yozdi (sinfdosh va guruh, ruxsat bilan):
     **3** — «yangi o'yin chiqqanini bilmadim» · **1** — «telefonda joy qolmadi, ilovani o'chirdim» · **1** — javob bermadi. Halol gap (so'zma-so'z): «5 kishi — kichik son: sabab haqida dalil, isbot emas.»
     Birliklar: 61 · 26 · 35 — **qurilma**; 5 · 3 · 1 · 1 — **odam (yozuv)**; bir-biridan ayirilmaydi (tayanch 1.13).
   - **Mexanika (Mentor misoli; umumiy qolip emas):**
     A1 — **ulanish:** ilovada **«Telegram'da xabar olish»** → Backend bir martalik kod beradi → ilova havolani ochadi `t.me/<bot>?start=<kod>` → odam botda «Start» ni bosadi → Telegram so'rovni Backend'ning webhook manziliga yuboradi (7-Modul naqshi) →
     Backend sarlavhadagi maxfiy kalitni tekshiradi, kodni topadi va `oyinchilar.telegram_chat_id` ni yozadi → bot javobi chatda. Telegram'dan **faqat chat raqami** saqlanadi.
     A2 — **xabar va haftalik chegara:** odam ilgari qatnashgan **«Doimiy o'yin»** keyingi haftaga e'lon qilinganda — Telegram xabari: «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» + havola `?kanal=telegram` bilan
     (son yozilmaydi — Telegram xabari keyin o'zgarmaydi, son esa eskiradi; joriy sonni havola ko'rsatadi — F-1007-466, tayanch 1.8, 9.38). Bir odamga haftasiga ko'pi bilan ikkita; bitta o'yin haqida bir marta; Telegram xabarlarini Backend sanaydi.
     A3 — **o'chirish, sanoq, siyosat:** **«Telegram xabarlarini o'chirish»** — bir bosishda chat raqami o'chiriladi, xabar to'xtaydi · xabardagi havola bilan ochilganda sanoq yozuvi **`telegramdan-ochdi`** · `lending/maxfiylik.html` ga bitta qator.
   - **Rasmiy faktlar (tayanch 6, 07.10.2026 — aynan; Manbalar):** «Bots can't start conversations with users. A user must either add them to a group or send them a message first.» · `start` parametri — `A-Z`, `a-z`, `0-9`, `_`, `-`, 64 belgigacha ·
     webhook so'roviga `X-Telegram-Bot-Api-Secret-Token` sarlavhasi (setWebhook `secret_token`) · javob `2XY` bo'lmasa, Telegram so'rovni qayta yuboradi · bitta chatga sekundiga bittadan ko'p xabar yo'q.
     O'quvchi matnida: «Bot odamga birinchi bo'lib yozolmaydi: odam botni o'zi boshlashi kerak.» (2-ekran, recap, kartochka, arena 2). Telegram yosh chegarasi — **aytilmaydi**.
   - **Xabar yo'li va havola (Mentor misoli):** xabardagi havola — ilovaning **brauzer ko'rinishi** manzili `?kanal=telegram` bilan (web-trekda — sayt manzili). Telefonda havola brauzerda ochiladi: o'rnatilgan APK'ni havoladan ochish uchun alohida sozlash kerak
     (Android App Links — Expo hujjati, Manbalar 5), bu darsda yo'q — O'qituvchi eslatmasida. Brauzer ko'rinishi manzilda `kanal=telegram` ni ko'rsa, `telegramdan-ochdi` yozadi (bitta ochilishga bitta; `ochdi` ham yoziladi — 12-Modul qoidasi).
   - **Halol gaplar:** «Botni ulamagan odamga Telegram xabari yetmaydi: ilovani allaqachon tashlab ketgan va botni ulamagan odamga bugungi mexanika yetmaydi.» (1-ekran O'qituvchi eslatmasi; o'quvchi matnida — 2-ekran joriy qatori va kartochka 3 izohi) ·
     «`telegramdan-ochdi` havola bilan ochilganini sanaydi — xabar odamni qaytardimi, buni aytmaydi.» (3-amaliyot, kartochka) · «APK o'zi yangilanmaydi» (3-amaliyot QIzoh) ·
     «Yangi o'yin kimdir ilovani ochganda yaratiladi: hech kim ochmasa, xabar ham ketmaydi.» (2-ekran joriy qatori; F-1007-466: keyingi «Doimiy o'yin» `GET /oyinlar` so'ralganda yaratiladi — tayanch 1.4 Mentor qarori, vaqt bo'yicha yaratish yo'q).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **Telegram xabari** — Backend Telegram bot orqali yuboradigan xabar (2-ekranda harakatdan keyin tug'iladi). **eslatma** — telefon ekraniga ilova chiqaradigan xabar (12-Modul) — ikkalasi **aralashmaydi** (arena 12, kartochka 7).
     «xabar» bu darsda: Telegram xabari · **bot javobi** (odam «Start» ni bosganda bot yozadigan javob) · Mentorga yozilgan javoblar (0-ekran — «javob»). Birinchi uchrashganda to'liq nomi bilan.
   - **Telegram bot** · **bot tokeni** (7-Modul) · **Telegram chat raqami** — Telegram bitta chatni ajratadigan raqam; Backend bot xabarini shu raqamga yuboradi; o'quvchi matnida qisqasi «chat raqami». Ishlatilmaydi: chat ID (prozada), «Telegram ID».
   - **bir martalik kod** — havoladagi qisqa harf-raqam qatori: faqat bir marta ishlaydi va tez eskiradi; Telegram chatini aynan shu hisob bilan bog'laydi (2-ekran). Doim to'liq — «bir martalik kod» («kod» yolg'iz — faqat dastur kodi; 10-darsdagi «taklif kodi» bilan aralashmaydi).
   - **Telegram'ni ulash** — foydalanuvchining o'zi «Telegram'da xabar olish» va «Start» ni bosishi; holat yozuvi «Telegram ulangan». (12-Modul ulanish belgisi «Ulangan» bu darsning maketlarida chizilmaydi — T-015.)
   - **Telegram so'rovi** — Telegram Backend'ning webhook manziliga yuboradigan so'rov (`POST /telegram/webhook`); **webhook** — 7-Modul va 3-dars so'zi, qayta ta'riflanmaydi.
   - **maxfiy kalit** (`TELEGRAM_SIR`) — Telegram har so'rov sarlavhasida yuboradigan tasodifiy uzun kalit (terminalda yaratiladi — F-1007-461); Backend uni `.env` dagisi bilan solishtiradi. 3-darsdagi imzodan farqi — kalitning o'zi keladi (faqat O'qituvchi eslatmasida).
   - **haftalik chegara** — bir odamga haftasiga (dushanbadan yakshanbagacha) ko'pi bilan ikkita Telegram xabari; ilova eslatmalari bu sanoqqa kirmaydi (ular telefonda, o'z chegarasi bilan — 12-Modul).
   - **sanoq yozuvi** `telegramdan-ochdi` · **sanoq sahifasi** · **qurilma** (sanoq birligi). «hodisa» — bu darsda **ishlatilmaydi** (7-Moduldagi bot «hodisa»si bilan aralashmasin; kod nomlari `hodisaYoz`, `hodisalar`, `POST /hodisalar` — faqat prompt va kod qatorida).
   - **«Doimiy o'yin»** · **Pro** — 4-dars so'zlari, qayta ta'riflanmaydi; «obuna» bu darsda yo'q. **tashkilotchi · o'yinchi** (ismsiz; «1-o'yinchi» — tartib raqami).
   - **tekshirish · tekshiruv** — o'z ishini ko'rish; «sinov» va «test» (ballik savoldan tashqari) bu darsda yo'q. **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **APK** · **o'rnatish fayli** · **brauzer ko'rinishi**.
   - Tugmalar va yozuvlar: «Telegram'da xabar olish» · «Telegram ulangan» · «Telegram xabarlarini o'chirish» · «Start» (Telegram'dagi bot tugmasi) · «Nusxalash» · «Bajardim» · «Davom etish».
   - **Ishlatilmaydi:** push (faqat `git push`), rassilka, bildirishnoma, spam-xabar, retention, «win-back», server (prozada; Backend haqida), hodisa (prozada), «Ulangan» (yolg'iz), A1/A2/A3, `m11-08`, «Modul 13», «keys».
6. **Mentor misolidagi sonlar (tayanch 1.8, 1.13 — aynan):** 61 · 26 · 35 qurilma (12-Modul, 43%) · 5 · 3 · 1 · 1 odam · haftasiga **2** · o'yin «Shanba, 18:00 · Mahalla maydoni», kerak **10** (`id` 1) ·
   `start` 64 belgigacha · sekundiga bitta (rasmiy). Mentor misolida Telegram'ni ulaganlar soni va xabar olganlar soni **yo'q** — sahnada ham, yakunda ham to'qilmaydi (tayanch 1.13). Statistika yoki tadqiqot deyilmaydi (T-043).
   Mentorning yangi tafsilotlari (TAYANCHGA SAVOL): bir martalik kod — 16 belgi, 10 daqiqa · havoladagi kod namunasi `k7Q…` (qisqartirilgan, hech qanday hisobga tegishli emas) · bot foydalanuvchi nomi maketda `…_bot` (to'liq nom yozilmaydi — begona botga to'g'ri kelib qolmasin).
7. **Metafora yo'q. Keyssiz** (loyiha kuni). Telegram — asbob (TAQIQLAR 8: K2 dan keyin keys sifatida tilga olinmaydi). Qahramon yo'q — odamlar roli bilan: o'yinchi, tashkilotchi, sinfdosh, sherik; sahna yorliqlari «1-telefon · o'yinchi», «1-o'yinchi»…«5-o'yinchi».
8. **Amaliyot bloki (tayanch 4, 12-Modul 9.36 h):** to'rt qadamning hammasi o'quvchining **o'z repo'sida, o'z mahsuloti va trekida** (Ochish → Prompt → Ishga tushirish → Tekshirish); 5-qadam yo'q. Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», `{…}` yonida kulrang «masalan: …», «Yordam»da to'liq talab).
   **Talab zinapoyasi:** uchala blokda tayyor talab + o'quvchi to'ldiradigan joylar — A1 uch joy (texnik qism tayyor: maxfiy kalit, kod, chat raqami), A2 to'rt joy (qaysi o'zgarish, kimga, matn, havola — mahsulot qarori o'quvchida), A3 uch joy (TAYANCHGA SAVOL 15).
   Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Xato yo'li (har blok 3-qadamida, bitta gap): «Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»»
   Push odati: `git status` → `git add <fayl>` (`git add .` emas). Qaytarib bo'lmaydigan o'zgarish (tekshiruv yozuvlarini o'chirish) — agent avval ro'yxat ko'rsatadi, o'quvchi «Davom et» deydi (12-Modul 9.39 b).
   **Trek:** `pm-m9d8-platforma.trek` (yo'q bo'lsa — 1-amaliyot tepasida ikki tugma «Mobil trek» · «Web-trek», tanlov kalitga yoziladi — 11-Modul 9.77). Bot trekka bog'liq emas — Backend ikkala trekda bir; farq — tugma joyi va havola (sayt yoki brauzer ko'rinishi), «Ochish» va «Yordam» ostida bir gap.
   **«Davom etish»:** 1-amaliyot — faqat 4-qadam «Bajardim»idan keyin (2-amaliyot tekshiruvi shu ulanishga tayanadi — 12-Modul 9.41 i, 09-FILTR 39) · 2-amaliyot — 3-qadamdan keyin (tekshiruvni dars oxiriga qoldirish mumkin; 3-amaliyotdagi sanoq tekshiruvining zaxira yo'li bor) · 3-amaliyot — 4-qadamdan keyin.
   Blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h); yakun sarlavhasi shu bayroqlar va 4-qadamdagi tekshiruv kartalaridan («Kutilganidek» / «Boshqacha» — F-1007-466).
9. **Tekshiruv — o'quvchining o'z ko'zi bilan, agent — zaxira (tayanch 7.10):** ulanish, bot javobi, Telegram xabari, o'chirish, sanoq — o'quvchi o'z telefonida, Telegram'ida va Neon'da ko'radi. Agent faqat vaqti o'tgan tekshiruv o'yinlarini tayyorlaydi
   (bir haftani kutib o'tirmaslik uchun) va ularni o'zi aytgan `id` lar bo'yicha o'chiradi; tekshiruv akkaunti — `namuna = true` (12-Modul 9.5, 9.35 a). Neon'da chat raqamining o'zi ko'rsatilmaydi: `telegram_chat_id IS NOT NULL AS ulangan`.
   Telegram akkaunti yo'q o'quvchi: yangi akkaunt ochmaydi — tekshiruv sherigining Telegram'ida, faqat `namuna = true` tekshiruv hisobiga ulanadi (o'quvchining o'z hisobiga emas — F-1007-466); 3-amaliyotda «Telegram xabarlarini o'chirish» bilan uziladi, tekshiruv hisobi `id` bo'yicha o'chiriladi (12-Modul xavfsizlik ro'yxati: «Yangi akkaunt ochish shart emas»).
10. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l:** taqsimot tepada. Har blokda «Ulgurmasangiz» qatori; Render kutishi paytida ish beriladi (agent kodni ko'rsatadigan prompt — SABOQ 52). Yangi o'rnatish fayli bu darsda tayyorlanmaydi — GATE M M-q5 A (faqat 10 va 12-darsda); tekshiruv Expo Go va brauzer ko'rinishida (F-1007-466).
    Yakun sarlavhasi holatga qarab (11-ekran). O'qituvchi eslatmasi — 1-ekranda.
11. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, qulf ekrani, Telegram chati (pufaklar, «Start» tugmasi), Backend tuguni, konvert, chiziq — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida (11-Modul yashili); Telegram nomi — o'z rangida, logotipsiz (TAQIQLAR 0);
    rang — faqat holat foni (D3): ulangan / yuboriladi — `ok`, yuborilmaydi / eskirgan — `err`, kutish — `ink2`, joriy — `accent`. Maket va sahnada chat raqami, Telegram nomi, odam ismi chizilmaydi; bot nomi — `…_bot`.
    Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 («O'lchov» bo'limi, skript bilan).
12. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 07.10.2026; tayanch 6 va o'zim tekshirganlarim); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» ikkinchi haftada ko'p qurilmada yana ochilmadi (12-Modul soni). Mentor tanish o'yinchilardan so'radi: ko'pi yangi o'yin chiqqanini bilmagan. O'yinchining ilovasi yopiq bo'lsa, buni ilova bilmaydi — kimdir «O'yinlar»ni ochib, keyingi o'yin yaratilganda Backend biladi.
  Bot esa odamga birinchi bo'lib yozolmaydi: odam botni o'zi ulaydi, keyin Backend uning o'yini yana e'lon qilinganda Telegram xabarini yuboradi — haftasiga ko'pi bilan ikkita, bir bosishda o'chiriladigan, ochilishi sanaladigan. O'quvchi xuddi shuni o'z mahsulotida qiladi (uch blok).
- **Hook:** «nega yana ochmadi?» → 0-ekranda Mentorning besh javobi → 2-ekranda Backend biladi, lekin bot birinchi yozolmaydi → ulanish → Telegram xabari → 1-blok (ulanish) → 5-ekranda Backend kimga yozadi → 2-blok (xabar va chegara) → 3-blok (o'chirish, sanoq, siyosat).
- **Bitta vizual — «telefon · Backend · Telegram» sahnasi** (bitta manba `TG_SAHNA`, 163/180; TAQIQLAR 6: «xabar konvert bo'lib uchadi»):
  - **chapda «1-telefon · o'yinchi»** (ramka ≈170×272, o'lcham barqaror; yorliq ramka ustida): uch ko'rinish — **qulf ekrani** (ilova yopiq; sana-soat yozilmaydi) · **ilova** («Maydon Jamoa» nomi o'z rangida; sozlamalar qatori: «Telegram'da xabar olish» → «Telegram ulangan» + «Telegram xabarlarini o'chirish») ·
    **Telegram chati** (tepada «Telegram» o'z rangida va bot nomi `…_bot`; pufaklar; pastda «Start» tugmasi; chat raqami va odam nomi yo'q).
  - **o'rtada «Backend» tuguni** — ichida ikki qator: o'yin qatori («Shanba, 18:00 · Mahalla maydoni · N / 10», doimiy belgisi bilan) va **«Telegram: ulanmagan / ulangan»** (raqamsiz); 5-ekranda o'rniga «Backend tekshiradi» kartasi.
  - **o'ngda «Telegram» tuguni** (nomi o'z rangida, ostida kulrang «bot shu yerda»).
  - **chiziq** Backend ↔ Telegram ↔ telefon; ulanmagan holatda Backend → Telegram uzuq va xira. **konvert** — so'rov (`POST /telegram/kod`, `/start …`, `POST /telegram/webhook`) va Telegram xabari; Backend ichiga kelgan Telegram so'rovida qulf belgili qator «maxfiy kalit ✓».
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (ulangan / yuborildi) → qizil (yuborilmaydi / eskirgan). `prefers-reduced-motion` da konvert yurmaydi — holatlar animatsiyasiz almashadi (DE-200).
  - Ishlatilishi: 0 (telefon — javoblar ro'yxati, hisoblagich) · 1 (tayyor holat, bir marta yuradi) · 2 (to'liq sahna) · 5 (Backend kartasi + o'yinchi kartasi) · bloklarning o'ng tomoni (kutilgan natija).
- **Yakun:** Telegram xabari ishlaydi, o'chiriladi va sanaladi · uyga vazifa yo'q · keyingi dars — «Kim haqiqatan to'lashga tayyor?».

---

## 0 · Kirish — ilovani yana ochmagan o'yinchilar  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **O'yinchilar ilovani nega yana ochmay qo'ydi?** (44)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - boshida: Mentor ilovani ochmay qo'ygan beshta tanishidan sababini so'radi — avval o'zingiz javobni tanlang.
  - javobdan keyin: Bugun eng ko'p aytilgan sababga bitta mexanika qurasiz — «Davom etish»ni bosing.
- Maket (chap): «1-telefon · Mentor» — ekranda ro'yxat, yorliq «Mentor so'ragan tanishlar · odam» · besh qator «1-o'yinchi» … «5-o'yinchi», har birida bo'sh kulrang pufak (sokin skelet; ism, rasm, chat nomi yo'q).
  Telefon ustida hisoblagich (bitta, SABOQ 24), ustida kichik yorliq «12-Modul sanog'i · qurilma, ismsiz»: «1-hafta · ilovani ochgan — 61» · «2-hafta · ulardan yana ochgan — 26» · «yana ochmagan — 35» (uch gorizontal ustun: 61 to'liq, 26 va 35 qisqa).
- Variantlar (radio, ballsiz; har birining o'z yengil chegarasi — E 40):
  - Ilova ularga yoqmay qoldi
  - ✔ Yangi o'yin chiqqanini bilmadi
  - Telefonda joy qolmadi
- Javob — 2-variant: **Aynan!** Beshtadan uchtasi shunday dedi: ilova yopiq turganda yangi o'yin haqida bilishmagan.
- Javob — 1-variant: **Qiziq fikr!** Bu misolda hech kim bunday demadi. Lekin besh kishi kichik son — boshqalar aytishi mumkin.
- Javob — 3-variant: **Qiziq fikr!** Bittasi shunday dedi va ilovani o'chirgan. Ko'pi esa yangi o'yin chiqqanini bilmagan.
- **Harakat → Vizual o'zgarish:** javob tanlanadi → besh qatorga javoblar navbat bilan tushadi (60–120 ms oralig'i, SABOQ 19): 1, 2, 3-o'yinchi — «Yangi o'yin chiqqanini bilmadim» · 4-o'yinchi — «Telefonda joy qolmadi, ilovani o'chirdim» ·
  5-o'yinchi — kulrang «javob bermadi». Uch bir xil qator bir lahza accent bilan ajraladi. Telefon ostida kulrang qator chiqadi: «5 kishi — kichik son: sabab haqida dalil, isbot emas.» Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
- ✎ Hook obyekti — darsning o'qitish obyekti (P-001): ilovani yana ochmagan o'yinchi. Uchala variant «nima bo'ldi» shaklida; 1-variant — hech kim aytmagan, payoff uni yolg'onga chiqarmaydi («besh kishi kichik son»), 3-variant — rost (1 kishi) (P-016, §119).
  Sonlar — tayanch 1.8, 1.13 aynan, maketda bir marta; Mentor ularni takrorlamaydi (P-062). 35 — qurilma, 5 — odam: ikkalasi alohida yorliq bilan, bir-biridan ayirilmaydi («5 tasi 35 ning ichidan» deyilmaydi — tayanchda yo'q). F-1007-466: Mentor beshtasini sanoqdan emas, o'zi tanigani uchun bilgan — ular ilovani ochmay qo'yganini o'zlari aytgan; ikki yorliq shuni ko'rsatadi.
  Javoblar — Mentor yozib olgan so'z, qo'shtirnoqda (T-008). «Aynan!» / «Qiziq fikr!» — qonun (T-028, T-067; tayanch 7 — rad etilganlar ro'yxati). «ilova yopiq turganda … bilishmagan» — 12-Modul 9-darsining halol chegarasi bilan bir; sabab da'vosi emas, o'yinchilarning o'z gapi.

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingiz Telegram orqali xabar yuboradi.** (51)
- Mentor: Besh javobda bitta sabab ko'proq uchradi — bugun shunga bitta mexanika qurasiz, namuna «Yordam»da turadi.
- Chap — «Dars oxirida»: `TG_SAHNA` **tayyor** holatda, bir marta o'zi yuradi (DE-200): 1-telefon ilovasida «Telegram'da xabar olish» → telefon Telegram chatiga o'tadi → «Start» → bot javobi pufagi →
  Backend'da qator «Telegram: ulangan» yashil yonadi → o'yin qatori «Shanba, 18:00 · Mahalla maydoni» yangilanadi → konvert Telegram orqali telefonga → chatda Telegram xabari pufagi → havola bosiladi → telefon ostida sanoq qatori «Telegram'dan ochdi · +1» yashil yonadi.
- O'ng — bugungi uch ish (tex-karta «01 · matn», bosilmaydi; teg yo'q — 172):
  - 01 · Ulanish: odam botni o'zi boshlaydi
  - 02 · Xabar: o'z o'yini yana e'lon qilinganda
  - 03 · O'chirish bir bosishda, ochilish sanaladi
- Pastki qator (mono, kichik): o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m13-dars-08-start` · namuna `m13-dars-08-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Bot mobil va web-trekda bir xil ishlaydi.
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: eng og'ir qism — 1-amaliyot (yangi bot, ikki maxfiy qiymat `.env` va Render'da, Render kutishi). Uch blokda uch marta Render'da yangi versiya kutiladi — kutish paytida agentdan kodni ko'rsatishni so'rash ishi bor.
  Bugun o'quvchilar real odamlarga yozmaydi: Mentorning besh o'yinchisi — Mentor misoli (tanishlar, ruxsat bilan). Telegram yosh chegarasi haqida gapirilmaydi. Telegram akkaunti yo'q o'quvchi yangi akkaunt ochmaydi — sherigining Telegram'ida, faqat `namuna = true` tekshiruv hisobi orqali tekshiradi (sherik chati o'quvchining o'z hisobiga ulanmaydi).
  Halol chegara: bot odamga birinchi bo'lib yozolmaydi — ilovani allaqachon tashlab ketgan va botni ulamagan odamga bugungi mexanika yetmaydi; u keyin ketishi mumkin bo'lganlar uchun. Keyingi «Doimiy o'yin» kimdir «O'yinlar»ni ochganda yaratiladi (4-dars; bepul Backend uxlaydi — vaqt bo'yicha ish yo'q): butun hafta hech kim ochmasa, o'yin ham, xabar ham bo'lmaydi. «Telegram xabari» va «eslatma» — ikki narsa: birinchisini Backend yuboradi, ikkinchisini ilova qo'yadi.
  Sinfdagi tekshiruv o'yinlari, Telegram xabarlari yozuvlari va `telegramdan-ochdi` yozuvlari `id` bo'yicha o'chiriladi — aks holda o'quvchining haftalik chegarasi to'lib qoladi va sanoq buziladi. Uyga vazifa yo'q. Yangi o'rnatish fayli bu darsda tayyorlanmaydi (M-q5 A) — APK o'rnatganlarda Telegram tugmasi hozircha yo'q.
- ✎ Mentor gapi App.jsx `sub` ga tayanadi («nega ketishadi va bitta qaytarish mexanikasi»; P-015), lekin sabab isbot emasligini saqlaydi: «ko'proq uchradi» (F-1007-466). Sarlavhada yangi atama yo'q: «Telegram», «xabar» — kundalik so'z (T-011); «mahsulotingiz» — o'quvchida bor (T-039). Uch qator — natija nomi, kashfiyot ochilmaydi (bot birinchi yozolmasligi — 2-ekranda).

## 2 · Bot kimga yoza oladi?  ← QTushuncha (bashorat + 4 harakat)
- Eyebrow: Tushuncha · Backend va bot
- Sarlavha: **Ilova yopiq bo'lsa, yangi o'yin haqida kim yozadi?** (50)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval taxminingizni belgilang, keyin Backend ostidagi «Shanba o'tdi»ni bosing.
  - 1-harakatdan keyin: Endi telefondagi ilovada «Telegram'da xabar olish»ni bosing.
  - 2-harakatdan keyin: Telegram chatida «Start»ni bosing.
  - 3-harakatdan keyin: Endi «Shanba o'tdi»ni yana bir marta bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»; kirishda karta yengil ko'tariladi, variantlar navbat bilan): **Bot o'yinchiga birinchi bo'lib yoza oladimi?** · Ha — Backend bilsa, bot yozadi · Yo'q — o'yinchi botni o'zi boshlashi kerak
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Sahna (`TG_SAHNA`): chapda «1-telefon · o'yinchi» — **qulf ekrani** (ilova yopiq), ustida kichik yorliq «Maydon Jamoa ilovasi yopiq» · o'rtada Backend: qatorlar «Shanba, 18:00 · Mahalla maydoni · doimiy» va «Telegram: ulanmagan» ·
  o'ngda «Telegram» tuguni. Backend ↔ Telegram chizig'i uzuq va xira. Sahna tugmalari (chegarali, ramkadan tashqarida): Backend ostida «Shanba o'tdi» (halqada); telefon ostida — 2-harakatdan oldin xira.
- **Harakat → Vizual o'zgarish:**
  1. «Shanba o'tdi» → Backend chetiga kichik konvert `GET /oyinlar` (yorliq: «kimdir ilovani ochdi») → o'yin qatori ostida yangi qator sirg'alib kiradi va ~1 s yashil yonadi: «keyingi Shanba, 18:00 · 0 / 10 · yana e'lon qilindi» →
     Backend → Telegram chizig'i uzuqligicha qoladi, konvert chiqmaydi; Backend chetida kulrang yorliq «chat raqami yo'q — bot birinchi yozolmaydi»; telefon qulf ekrani o'zgarmaydi, yonida kulrang yorliq «ilova yopiq — yangi o'yinni bilmaydi».
  2. 1-harakatdan keyin telefon ilovaga o'tadi (yorliq «o'yinchi ilovani ochdi»; sozlamalar qatorida «Telegram'da xabar olish» halqada). «Telegram'da xabar olish» → konvert `POST /telegram/kod` telefondan Backend'ga → javob konverti qaytadi, telefonda bir lahza havola qatori: `t.me/…_bot?start=k7Q…` →
     telefon Telegram chatiga o'tadi: tepada «Telegram» (o'z rangida) va `…_bot`, pastda «Start» (halqada).
     Nom qatori (bitta): Havoladagi qisqa qator — bir martalik kod: u Telegram chatini aynan shu hisob bilan bog'laydi.
  3. «Start» → chatda «/start» pufagi → konvert Telegram tugunidan Backend'ga (yorliq `POST /telegram/webhook`; konvert ichida qulf belgili qator «maxfiy kalit») → Backend'da qator «Telegram: ulanmagan» → «Telegram: ulangan» yashil (raqamsiz) →
     konvert Backend → Telegram → chatda bot javobi pufagi: «Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.» Backend ↔ Telegram chizig'i to'liq bo'ladi.
  4. «Shanba o'tdi» (yana) → Backend'da navbatdagi hafta o'yini qatori yashil yonadi «Shanba, 18:00 · 0 / 10 · yana e'lon qilindi» → konvert Backend → Telegram → telefonga → chatda yangi pufak (Telegram xabari):
     «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» va ostida havola qatori `…netlify.app/?kanal=telegram`; qulf ekrani emas — Telegram chati; yorliq «Maydon Jamoa ilovasi hali ham yopiq».
     Nom qatori (bitta): Backend bot orqali yuboradigan bu xabar — Telegram xabari.
  - Holat o'quvchi bosgan tartibdan chiziladi (P-046); noto'g'ri tanlov yo'q — qaror bashoratda, natija harakatda.
- Joriy qator (4/4 dan keyin, bitta): Yangi o'yin kimdir ilovani ochganda yaratiladi: hech kim ochmasa, xabar ham ketmaydi. (85)
- Natija qatori (yashil xulosa qutisining birinchi kichik qatori, E 42): «Taxminingiz ✕ — aslida: yo'q, o'yinchi botni o'zi boshlashi kerak» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda yangi o'yinni Backend biladi; bot esa faqat «Start»ni bosgan odamga yoza oladi.
- Qator (`QIzoh`, qutining oxirgi kichik qatori): Ulanishda faqat chat raqami saqlanadi: ism ham, Telegram nomi ham saqlanmaydi.
- Tugadi (199): harakat paneli va sahna tugmalari yopiladi; telefon (Telegram chati), Backend va Telegram butun enga, oxirgi pufak fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/4) → Davom etish
- ✎ Bitta g'oya (P-008): yangi o'yinni Backend biladi, lekin bot faqat o'zi boshlagan odamga yoza oladi (tayanch 1.8 boshi va rasmiy fakt). 1-harakat — 12-Modul 9-darsining halol chegarasi («ilova yopiq — yangi o'yinni bilmaydi») va yangi to'siq («bot birinchi yozolmaydi»);
  2–3-harakat — 1-blokning o'zi (ulanish); 4-harakat — 2-blok (xabar). T-011: hodisa sahnada → «bir martalik kod», «Telegram xabari» — harakatdan keyin nom qatorida. Bashorat — ha/yo'q, ikki daraja (S-015). «Start» — Telegram'dagi tugma nomi (tayanch 1.8; Shubhali 4).
  Xabarda son yo'q — eskiradi; joriy son havolada (TAYANCHGA SAVOL 1, F-1007-466). «Shanba o'tdi» — sahna tugmasi (vaqt o'tadi va kimdir ilovani ochadi; o'quvchi matnida «sahna» so'zi yo'q). Chat raqami ekranda hech qayerda chizilmaydi — faqat «ulangan / ulanmagan».
  Konvertdagi «maxfiy kalit» qatori izohsiz — 1-amaliyot «Ochish» uni nomlaydi (P-036). 1-savol shu qoidani boshqa tomondan so'raydi (§106): chat raqamini Backend qachon biladi.

## 3 · Amaliyot 1 — bot va ulanish  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈24 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Foydalanuvchi Telegram'ni kodli havola bilan ulasin.** (52)
- Mentor: Talab tayyor — uchta joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Foydalanuvchi ilovada tugmani bosib, botda «Start»ni bosadi — Backend uning Telegram chat raqamini saqlaydi, boshqa hech narsani emas.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching — 7-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; `git ls-files backend/.env` — natija bo'sh bo'lsin (chiqsa — o'qituvchiga ayting: kalitlar almashtiriladi).
     Telegram'da @BotFather'da yangi bot oching — 7-Modulda o'rgangan yo'l: `/newbot`, nom, keyin foydalanuvchi nomi (oxiri «bot» bilan). 7-Moduldagi botingiz o'sha moduldagi Backend'ga ulangan bo'lishi mumkin: botning webhook manzili bitta — ikki Backend bitta botning so'rovlarini birga ololmaydi; shuning uchun yangi bot.
     `backend/.env` ga ikki qator yozing: `TELEGRAM_BOT_TOKEN=` va @BotFather bergan token · `TELEGRAM_SIR=` va tasodifiy uzun kalit — terminalda yarating: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (64 belgili harf-raqam; Telegram talabiga mos); o'zingiz o'ylagan so'z yoki parolingiz emas (F-1007-461).
     Ikkalasini Render'dagi xizmatingizning Environment bo'limiga ham qo'shib saqlang. **Token va kalitni agentga, chatga, README'ga va skrinshotga yozmang** — agent faqat ularning nomini biladi.
     Tekshiruv uchun hisob raqamingizni toping — Neon SQL Editor'da: `SELECT id FROM oyinchilar WHERE login = '{loginingiz}';` → «Run» (jadval va ustun nomi — mahsulotingizdagidek).
     Ikki savolga javob toping: tugma ilovangizning qayerida turadi? Foydalanuvchiga nima haqida yozasiz — bir gapda? (Mentor misolida: «Hisobdan chiqish» yonida; ostida «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita».)
     Telegram akkauntingiz bo'lmasa — yangisini ochmang: agentdan mahsulotingizda `namuna = true` tekshiruv hisobini ochishni so'rang, ilovaga shu hisob bilan kiring; «Start»ni sherigingiz o'z Telegram'ida bosadi. 3-amaliyot oxirida ulanish o'chiriladi, tekshiruv hisobi `id` bo'yicha o'chiriladi. Sherik Telegram'ini o'z hisobingizga ulamang. Mobil trekda `npx expo start` ishlab tursin; web-trekda tugma saytingizda bo'ladi — bot ikkala trekda bir xil.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — yangi Telegram bo'limi va foydalanuvchilar jadvaliga yangi ustunlar; {tugma turadigan joy}.
     > Nima qilsin: Telegram bot orqali foydalanuvchiga xabar yuborish uchun ulanishni qur. Bot tokeni — `.env` dagi `TELEGRAM_BOT_TOKEN`, maxfiy kalit — `.env` dagi `TELEGRAM_SIR`.
     > 1) Foydalanuvchilar jadvaliga: `telegram_chat_id` (bo'sh bo'lishi mumkin; Telegram chat raqami katta son — uni to'liq saqlaydigan tur tanla) va bir martalik kod uchun ikki ustun — kodning o'zi va amal qilish muddati.
     > 2) Backend Render'da ishga tushganda (ochiq manzili bor bo'lsa) Telegram'ga webhook manzilini o'rnatsin: `{ochiq manzil}/telegram/webhook`, `secret_token` — `TELEGRAM_SIR`; laptopda — o'rnatmasin. Botning foydalanuvchi nomini `getMe` bilan olsin. O'rnatish xato bersa — Backend ishlashda davom etsin, xato logga yozilsin (token va kalitsiz).
     > 3) `POST /telegram/kod` — faqat hisobga kirgan foydalanuvchi uchun: yangi bir martalik kod (16 belgi, faqat harf va raqam, `crypto` bilan tasodifiy — `Math.random` emas), 10 daqiqa amal qiladi, logga yozilmaydi; javob — havola `https://t.me/{botning foydalanuvchi nomi}?start={kod}`.
     > 4) `POST /telegram/webhook`: `X-Telegram-Bot-Api-Secret-Token` sarlavhasi `TELEGRAM_SIR` ga teng bo'lmasa — `401`, hech narsa qilma. Faqat shaxsiy chatdan kelgan `/start {kod}` ni ishla: kod topilsa va muddati o'tmagan bo'lsa — o'sha foydalanuvchiga chat raqamini yoz va kodni o'chir — uchalasi bitta Database ishida (bir vaqtdagi ikki so'rovdan faqat bittasi ulaydi); bot shu chatga javob yozsin: «Ulandi. {xabar sababi}, shu yerga yozaman. O'chirish — ilovada.»
     > Kod yo'q, eskirgan yoki ishlatilgan bo'lsa — bot javobi: «Havola eskirgan. Ilovada «Telegram'da xabar olish»ni qayta bosing.» Boshqa har qanday xabarga — «Bu bot ilovadan ulanadi: ilovada «Telegram'da xabar olish»ni bosing.»
     > Telegram'ga javob — `200` (`401` holatidan tashqari). Telegram javob olmasa so'rovni qayta yuboradi: bir xil so'rov (`update_id`) ikkinchi marta kelsa — qayta ishlama; `update_id` ni Database'da noyob qilib eslab qol (Backend qayta ishga tushsa ham).
     > 5) Telegram so'rovidan faqat chat raqami saqlansin; ism, Telegram nomi va xabar matni saqlanmasin va logga yozilmasin. `GET /men` javobiga `telegram` (rost yoki yolg'on) qo'sh — chat raqamining o'zi ilovaga yuborilmasin.
     > 6) {tugma turadigan joy}da tugma «Telegram'da xabar olish», ostida kichik matn: «{xabar sababi} — Telegram'da xabar; haftasiga ko'pi bilan ikkita». Bosilganda `POST /telegram/kod` dan havolani olib Telegram'da ochsin. Ulangan bo'lsa — tugma o'rnida «Telegram ulangan».
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. `TELEGRAM_BOT_TOKEN` va `TELEGRAM_SIR` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomlarini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {tugma turadigan joy} — «masalan: `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori»
     - {xabar sababi} — «masalan: Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — «masalan: kirish, e'lon berish, qo'shilish, eslatmalar va to'lov xabari»
     Tekshiruv («Nusxalash» bosilganda, bloklaydi): bu joyda kamida ikkita ish vergul bilan bo'lmasa yoki «hammasi», «ilova» kabi bitta so'z bo'lsa — Ikkita aniq ish yozing: masalan, kirish, e'lon berish. (54) (F-1007-461 sinfi)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — yangi Telegram bo'limi va `oyinchilar` jadvaliga yangi ustunlar; `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori.
     > Nima qilsin: Telegram bot orqali o'yinchiga xabar yuborish uchun ulanishni qur. Bot tokeni — `.env` dagi `TELEGRAM_BOT_TOKEN`, maxfiy kalit — `.env` dagi `TELEGRAM_SIR`.
     > 1) `oyinchilar` ga: `telegram_chat_id` (bo'sh bo'lishi mumkin; Telegram chat raqami katta son — uni to'liq saqlaydigan tur tanla), `telegram_kod` va `telegram_kod_gacha` (bir martalik kod va uning amal qilish muddati).
     > 2) Backend Render'da ishga tushganda (ochiq manzili bor bo'lsa) Telegram'ga webhook manzilini o'rnatsin: `{ochiq manzil}/telegram/webhook`, `secret_token` — `TELEGRAM_SIR`; laptopda — o'rnatmasin. Botning foydalanuvchi nomini `getMe` bilan olsin. O'rnatish xato bersa — Backend ishlashda davom etsin, xato logga yozilsin (token va kalitsiz).
     > 3) `POST /telegram/kod` — faqat hisobga kirgan o'yinchi uchun: yangi bir martalik kod (16 belgi, faqat harf va raqam, `crypto` bilan tasodifiy — `Math.random` emas), 10 daqiqa amal qiladi, logga yozilmaydi; javob — havola `https://t.me/{botning foydalanuvchi nomi}?start={kod}`.
     > 4) `POST /telegram/webhook`: `X-Telegram-Bot-Api-Secret-Token` sarlavhasi `TELEGRAM_SIR` ga teng bo'lmasa — `401`, hech narsa qilma. Faqat shaxsiy chatdan kelgan `/start {kod}` ni ishla: kod topilsa va muddati o'tmagan bo'lsa — o'sha o'yinchiga chat raqamini yoz va kodni o'chir — uchalasi bitta Database ishida (bir vaqtdagi ikki so'rovdan faqat bittasi ulaydi); bot shu chatga javob yozsin: «Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.»
     > Kod yo'q, eskirgan yoki ishlatilgan bo'lsa — bot javobi: «Havola eskirgan. Ilovada «Telegram'da xabar olish»ni qayta bosing.» Boshqa har qanday xabarga — «Bu bot ilovadan ulanadi: ilovada «Telegram'da xabar olish»ni bosing.»
     > Telegram'ga javob — `200` (`401` holatidan tashqari). Telegram javob olmasa so'rovni qayta yuboradi: bir xil so'rov (`update_id`) ikkinchi marta kelsa — qayta ishlama; `update_id` ni Database'da noyob qilib eslab qol (Backend qayta ishga tushsa ham).
     > 5) Telegram so'rovidan faqat chat raqami saqlansin; ism, Telegram nomi va xabar matni saqlanmasin va logga yozilmasin. `GET /men` javobiga `telegram` (rost yoki yolg'on) qo'sh — chat raqamining o'zi ilovaga yuborilmasin.
     > 6) `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatorida tugma «Telegram'da xabar olish», ostida kichik matn: «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita». Bosilganda `POST /telegram/kod` dan havolani olib Telegram'da ochsin. Ulangan bo'lsa — tugma o'rnida «Telegram ulangan».
     > Nima buzilmasin: kirish, e'lon berish, qo'shilish, eslatmalar va to'lov xabari avvalgidek ishlasin. `TELEGRAM_BOT_TOKEN` va `TELEGRAM_SIR` qiymatini kodga, logga va README'ga yozma — faqat `.env` dan o'qi; `backend/.env.example` va README'dagi o'zgaruvchilar ro'yxatiga nomlarini qiymatsiz qo'sh. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida `mobil/` o'rnida sayt papkangiz (`prototip/`) va undagi sozlamalar joyi turadi; havola yangi oynada ochiladi, qolgani o'sha.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "telegram ulanish"`, `git push`.
     Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agentga («Nusxalash» bilan; SABOQ 52):
     > Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: maxfiy kalit tekshiriladigan qator, bir martalik kod tekshiriladigan qator va chat raqami yoziladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har gapini o'zingiz ko'ring:
     (1) Ilovangizda «Telegram'da xabar olish» → Telegram ochiladi → botda «Start» (tugma nomi Telegram tilingizga qarab boshqacha bo'lishi mumkin). Bot javobi chiqishi kerak — bir daqiqagacha kechikishi mumkin: bepul Backend uxlab qolgan bo'lsa, uyg'onadi. Ilovani yangilang: tugma o'rnida «Telegram ulangan».
     (2) Neon SQL Editor'da: `SELECT id, telegram_chat_id IS NOT NULL AS ulangan FROM oyinchilar WHERE id = {hisob raqamingiz};` → «Run» — `ulangan` ustunida `true`. So'rov ataylab shunday: chat raqamining o'zi ekranga chiqmaydi va hech qayerga yozilmaydi.
     (3) Botga oddiy xabar yozing (masalan, «salom») — bot «Bu bot ilovadan ulanadi: …» javobini yozishi kerak.
     (4) Terminalda `git grep -n "TELEGRAM_"`: natijada faqat nomlar (`process.env.…`, `.env.example`, README qatori). Qiymat chiqsa — agentga «Qiymatni koddan olib tashla, faqat `.env` dan o'qi.» deng, @BotFather'da yangi token oling (7-Modul) va `.env`, Render'da almashtiring.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki kadr bir marta o'zi yuradi): telefon — sozlamalar qatori «Telegram'da xabar olish» va ostidagi kichik matn → Telegram chati (`…_bot`): «/start» pufagi va bot javobi «Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.»;
  ostida Neon natijasi — bitta qator `id 7 · ulangan true`; ostida terminal kartasi — `git grep -n "TELEGRAM_"` natijasi: to'rt qator, hammasida faqat nom. Web-trekda telefon o'rnida brauzer oynasi.
- Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin; dars holatida — 3, 10-darslar naqshi; F-1007-466): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Bot faqat «Start»ni bosgan foydalanuvchini taniydi; Backend'da faqat chat raqami turadi.
- Qator (`QIzoh`, natija ostida, bitta): Kodni agent yozdi — Telegram xabari ishlashini 2-amaliyotdagi tekshiruv ko'rsatadi.
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-08-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` ga o'z qiymatlaringizni yozasiz (`TELEGRAM_BOT_TOKEN` — o'z botingizniki).
- Ulgurmasangiz: (4) `git grep` ni Render kutishi paytida bajaring. «Davom etish» faqat 4-qadam «Bajardim»idan keyin ochiladi: 2-amaliyot tekshiruvi shu ulanishga tayanadi — botni o'zingiz ko'rmasdan o'tmang.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A1 — tayyor talab + 3 joy; texnik qism (maxfiy kalit, bir martalik kod, takror so'rov, faqat chat raqami) tayyor — o'quvchi mahsulot qarorini yozadi: tugma joyi va nima haqida xabar olishi (sinf 13). Bot javobi va tugma ostidagi matn bitta joydan (`{xabar sababi}`) — ikkisi bir gapni aytadi.
  Agentning «tayyor» degani — da'vo (sinf 5); bu blokda o'quvchi bot javobini, Neon'dagi `true` ni va `git grep` ni o'zi ko'radi. Telegram rasmiy faktlari — tayanch 6 va Manbalar 1–3 (`secret_token` — faqat harf, raqam, `_`, `-`; 1–256 belgi; `start` — 64 belgigacha; chat raqami 52 bitgacha).
  Yangi bot (tayanch 1.8, 9.39). `/start` faqat shaxsiy chatdan — guruhga qo'shilgan bot guruhga yozib qolmasin (TAYANCHGA SAVOL 7).
- O'qituvchi eslatmasi: maxfiy kalit sarlavhada — 3-darsdagi imzodan farqi: imzo kalitdan hisoblanardi, bu yerda Telegram kalitning o'zini yuboradi; Backend uni `.env` dagisi bilan solishtiradi (tayanch 6). Telegram javob olmasa so'rovni qayta yuboradi — 3-darsdagi «takror xabar» shu yerda ham (talabning 4-bandi).
  Bir martalik kod 10 daqiqa va bir marta ishlaydi: havolani boshqa odamga yubormang — kim «Start»ni bossa, shu chat ulanadi; adashib ulansa — 3-amaliyotdagi «Telegram xabarlarini o'chirish». Tugma va bot nomlari Telegram til sozlamasiga qarab boshqacha yozilishi mumkin (Shubhali 4).

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Mentor misolida Backend o'yinchining Telegram chatini qachon biladi?**
  - A · O'yinchi «Ro'yxatdan o'tish»ni bosganda
  - B · Bot telefon raqami orqali uni o'zi topganda
  - C · ✔ O'yinchi kodli havolada «Start»ni bosganda
  - D · Tashkilotchi «E'lon berish»ni bosganda
- Kalit: **C** (index 2). A, C, D — «X «Y»ni bosganda» shakli (qo'shtirnoq uchta variantda), B — boshqa shakl (shakl-telli to'g'rida emas, §147); «O'yinchi» A va C da.
- To'g'ri izohi: Chat raqami faqat o'yinchi botni o'zi boshlaganda keladi.
- Xato izohlari (≤60):
  - A: Ro'yxatda Telegram so'ralmaydi — chat qayerdan keladi?
  - B: Mentor ilovasi telefon so'ramaydi, bot ham odam qidirmaydi.
  - D: E'lon — tashkilotchining ishi. O'yinchi botga yozdimi?
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- ✎ Distraktorlar uch turkumdan (sinf 8): ilovadagi boshqa harakat (A) · Telegram'ning yolg'on modeli — bot odamni o'zi topadi (B; rasmiy fakt va 12-Modul «telefon so'ralmaydi» qarori bilan ikki marta noto'g'ri) · Backend'dagi boshqa voqea (D).
  Guruh bilan bog'liq variant ataylab yo'q: rasmiy gapda «add them to a group» bor — haqiqiy hayotda rost bo'lib qolishi mumkin (TAQIQLAR 7). 2-ekran sahnasi savolni bermaydi: u «bot birinchi yoza oladimi?» deydi, bu savol — «Backend qachon biladi?» (§106).

## 5 · Backend kimga yozadi?  ← QTushuncha (bashorat + 5 harakat, bittadan)
- Eyebrow: Tushuncha · kimga xabar ketadi
- Sarlavha: **O'yin yana e'lon qilindi — Backend kimga yozadi?** (48)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor misolida to'rt o'yinchi bor — avval taxminingizni belgilang.
  - harakat paytida: Har kartada «Tekshirish»ni bosing va o'ngdagi uch katakni kuzating.
  - to'rttasidan keyin: Endi 1-o'yinchi kartasida «Telegram xabarlarini o'chirish»ni bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; tanlangach ixcham qator): **To'rt o'yinchidan nechtasiga Telegram xabari ketadi?** · Bittasiga · Ikkitasiga · Uchtasiga
- Chap: Backend kartasi (tepada, ixcham): «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» · ostida o'yinchi kartasi **bittadan** (SABOQ 9, 13; ustida «O'yinchi N / 4»), ichida uch qator:
  «O'tgan Shanba o'yinida: qatnashgan / qatnashmagan» · «Telegram: ulangan / ulanmagan» · «Bu hafta Telegram xabari: N / 2». Harakat tugmasi «Tekshirish» — karta ostida, halqada (SABOQ 21). Odam chizilmaydi — faqat «1-o'yinchi» yorlig'i.
- O'ng: tekshiruv kartasi «Backend tekshiradi» (ostida kichik kulrang yorliq «bu kursda · Mentor misolida») — uch bo'sh katak: «O'tgan hafta shu o'yinda qatnashgan» · «Botni o'zi ulagan» · «Bu hafta ikkitadan kam xabar olgan».
- O'yinchilar (shu tartibda; `KIMGA_OYINCHILAR`, TAYANCHGA SAVOL 10):
  1. 1-o'yinchi — qatnashgan · ulangan · 0 / 2 → ✓ · ✓ · ✓ → yashil «yuboriladi»; kartaning ostida kichik Telegram pufagi (xabar matni, `TG_XABAR`).
  2. 2-o'yinchi — qatnashgan · ulanmagan · 0 / 2 → ✓ · ✗ · ✓ — qizil qator: Botni boshlamagan — bot unga birinchi yozolmaydi.
  3. 3-o'yinchi — qatnashgan · ulangan · 2 / 2 → ✓ · ✓ · ✗ — qizil qator: Bu hafta ikkita xabar oldi — uchinchisi yo'q.
  4. 4-o'yinchi — qatnashmagan · ulangan · 0 / 2 → ✗ · ✓ · ✓ — qizil qator: Shu o'yinda qatnashmagan — xabar unga tegishli emas.
- **Harakat → Vizual o'zgarish:**
  - Har kartada «Tekshirish» → o'ngdagi uch katakka ✓ yoki ✗ navbat bilan «tushadi» (SABOQ 19) → hammasi ✓ bo'lsa karta yashil chegara oladi va «yuboriladi»; ✗ bo'lsa karta qizil chegara bilan so'nadi, ✗ katak yonida qisqa qizil qator. Keyingi karta kirib keladi, kataklar bo'shaydi;
    o'tgan kartalar Backend kartasi ostida ixcham qator bo'lib qoladi («1-o'yinchi · yuboriladi» va h.k.; SABOQ 17).
  - 5) to'rttasidan keyin 1-o'yinchi ixcham qatori qayta ochiladi, unda tugma «Telegram xabarlarini o'chirish» (halqada) → «Telegram: ulangan» → «Telegram: ulanmagan», 2-katak ✗ ga aylanadi, yashil «yuboriladi» → kulrang «yuborilmaydi», Telegram pufagi so'nadi.
  - Holat kartalar tartibidan chiziladi; noto'g'ri tanlov yo'q — qaror bashoratda.
- Joriy qator (5-harakatdan keyin, bitta): O'chirish bir bosishda: chat raqami o'chadi va xabar ketmaydi. (62)
- Natija qatori (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz ✕ — aslida: bittasiga» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu kursda xabar o'z o'yini qayta e'lon qilingan, botni ulagan odamga ketadi — haftasiga ko'pi bilan ikkita.
- Qator (`QIzoh`, qutining oxirgi kichik qatori): Bu kursda xabar matnida faqat o'zgarish bor: kun, soat, joy — bosim ham, to'lov taklifi ham yo'q.
- Tugadi (199): harakat paneli yopiladi; Backend kartasi, to'rt ixcham qator va tekshiruv kartasi butun enga, xulosa fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Kartalarni tekshiring (N/4) → O'chirishni bosing → Davom etish
- ✎ Bitta g'oya (P-008): Backend xabarni kimga yuborishini uch shart hal qiladi (tayanch 1.8: «odam ilgari qo'shilgan «Doimiy o'yin»», «haftasiga ko'pi bilan ikkita», «faqat o'zi «Start» ni bosgan»). «Bu kursda» — kurs qolipi, o'quvchi mahsulotiga majburiy shakl emas (sinf 4); o'quvchi o'z shartini 2-amaliyotda yozadi.
  5-harakat — 3-amaliyotning o'zi (o'chirish). QIzoh — matn qoidasi (12-Modul 9-darsidagi «bosim, qo'rqitish, uyaltirish yo'q» davomi + TAQIQLAR 1: to'lov taklifi yo'q); arena 8 shuni so'raydi.
  Uch katakning ikkinchisi «ulagan» — ilova telefonda bo'lishi shart emas: 2-savol aynan shu yangi vaziyatni so'raydi (§106). Kartadagi sonlar — sahna uchun (tayanchda Telegram'ni ulaganlar soni yo'q; to'rt o'yinchi — mashq kartasi, Mentor sanog'i emas — TAYANCHGA SAVOL 10).

## 6 · Amaliyot 2 — Telegram xabari va haftalik chegara  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈19 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Haqiqiy o'zgarishda Telegram xabari ketsin.** (43)
- Mentor: Qaysi o'zgarish haqida kimga yozishni o'zingiz tanlaysiz, namuna «Yordam» ortida; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Backend biladigan haqiqiy o'zgarishda bot shu o'zgarish tegishli, botni ulagan odamga yozadi — haftasiga ko'pi bilan ikkita, bir narsa haqida bir marta.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — o'z repo'ngiz, 1-amaliyotdan keyingi kod; botingiz ulangan. Savollarga javob toping: qaysi o'zgarishni bilmasa, foydalanuvchingiz ilovani qayta ochmay qo'yishi mumkin — va buni Backend biladimi? Bu o'zgarish kimga tegishli? U foydalanuvchidan biror harakat kutadimi (masalan, qo'shilish)? Harakat kutmasa — Telegram xabari shart emas.
     (Mentor misolida: o'yinchi qatnashgan «Doimiy o'yin» keyingi haftaga yana e'lon qilinganda — o'sha o'yinda qatnashganlarga.) Foydalanuvchilaringizdan so'ramagan bo'lsangiz — bu sizning taxminingiz, shunday deb biling.
     Mahsulotingizda «Doimiy o'yin» yo'q — Backend biladigan va foydalanuvchiga tegishli bitta o'zgarishni tanlang; ilova o'zi oldindan biladigan narsa (vaqt, muddat) — 12-Modulda eslatma bilan qilingan, Telegram shart emas.
     Xabar matni — bu kursda faqat o'zgarish: kun, soat, joy; tez o'zgaradigan son (masalan, qo'shilganlar) yozilmaydi — u havolada ko'rinadi; bosim, qo'rqitish va to'lov taklifi yo'q. Havola — mahsulotingiz manzili `?kanal=telegram` bilan: mobil trekda — ilovangizning brauzer ko'rinishi (telefonda havola brauzerda ochiladi), web-trekda — saytingiz.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — Telegram bo'limi va {qaysi o'zgarishda} ro'y beradigan joy.
     > Nima qilsin: {qaysi o'zgarishda} — {kimga} bot orqali Telegram xabari yuborsin (faqat Telegram'ni ulaganlarga): «{xabar matni}», ostida havola `{mahsulot manzili}?kanal=telegram`.
     > Haftalik chegara: bir odamga haftasiga (dushanbadan yakshanbagacha, `Asia/Tashkent` vaqti) ko'pi bilan ikkita Telegram xabari; bitta narsa haqida bitta odamga bir marta. Buning uchun xabarlarni yangi jadvalga yoz: kimga, nima haqida, qachon — xabar matni va chat raqamisiz; «kimga + nima haqida» jufti noyob.
     > Tartib: avval chegarani sanab, jadvalga yozuv qo'sh — ikkalasi bitta Database ishida (bir vaqtdagi ikki so'rov ham chegaradan oshirmasin, bitta narsa haqida ikki marta yubormasin); faqat yozuv qo'shilgan bo'lsa — xabarni yubor. Telegram xabarni qabul qilmasa (masalan, odam botni to'xtatgan bo'lsa) — o'sha yozuvni o'chir, chat raqamiga tegma, keyingisiga o't. So'rov javobi xabarlar yuborilgach qaytsin. Bitta chatga sekundiga bittadan ko'p xabar yuborma.
     > Nima buzilmasin: 1-amaliyotdagi ulanish avvalgidek; Telegram'ni ulamagan odamga hech narsa yuborilmasin; xabarda to'lov taklifi bo'lmasin; `TELEGRAM_BOT_TOKEN` qiymati logga yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {qaysi o'zgarishda} — «masalan: «Doimiy o'yin»ning keyingi haftadagi o'yini yaratilganda»
     - {kimga} — «masalan: o'tgan haftadagi o'yinida qatnashgan o'yinchilarga»
     - {xabar matni} — «masalan: {kun}, {soat} o'yini yana e'lon qilindi · {maydon}»
     - {mahsulot manzili} — «masalan: brauzer ko'rinishi manzili (Netlify)»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — Telegram bo'limi va «Doimiy o'yin»ning keyingi haftadagi o'yini yaratiladigan joy (`GET /oyinlar`, 4-dars).
     > Nima qilsin: «Doimiy o'yin»ning keyingi haftadagi o'yini yaratilganda — o'tgan haftadagi o'yinida qatnashgan (`qoshildi` yoki `keladi`) va Telegram'ni ulagan o'yinchilarga bot orqali Telegram xabari yuborsin: «{kun}, {soat} o'yini yana e'lon qilindi · {maydon}», ostida havola `{brauzer ko'rinishi manzili}?kanal=telegram`.
     > Haftalik chegara: bir o'yinchiga haftasiga (dushanbadan yakshanbagacha, `Asia/Tashkent` vaqti) ko'pi bilan ikkita Telegram xabari; bitta o'yin haqida bitta o'yinchiga bir marta. Xabarlarni yangi jadvalga yoz: `telegram_xabarlar` — `id`, `oyinchi_id`, `oyin_id`, `yuborilgan`; `oyinchi_id` va `oyin_id` jufti noyob; xabar matni va chat raqami bu jadvalga yozilmasin.
     > Tartib: avval chegarani sanab, `telegram_xabarlar` ga yozuv qo'sh — ikkalasi bitta Database ishida (bir vaqtdagi ikki `GET /oyinlar` ham chegaradan oshirmasin, bitta o'yin haqida ikki marta yubormasin); faqat yozuv qo'shilgan bo'lsa — xabarni yubor. Telegram xabarni qabul qilmasa (masalan, o'yinchi botni to'xtatgan bo'lsa) — o'sha yozuvni o'chir, chat raqamiga tegma, keyingisiga o't. `GET /oyinlar` javobi xabarlar yuborilgach qaytsin. Bitta chatga sekundiga bittadan ko'p xabar yuborma.
     > Nima buzilmasin: keyingi o'yinni yaratish tartibi (4-dars) va 1-amaliyotdagi ulanish avvalgidek; Telegram'ni ulamagan o'yinchiga hech narsa yuborilmasin; xabarda to'lov taklifi bo'lmasin; `TELEGRAM_BOT_TOKEN` qiymati logga yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): havola — saytingiz manzili `?kanal=telegram` bilan; qolgani o'sha (Backend ikkala trekda bir).
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "telegram xabari"` → `git push`. Render'da yangi versiya tugashini kuting. Kutayotganda agentga («Nusxalash» bilan):
     > Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: xabar kimga ketishi tanlanadigan qator, haftalik chegara tekshiriladigan qator va xabar matni yasaladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — o'zgarishni sun'iy chaqirasiz, natijani o'z Telegram'ingizda ko'rasiz:
     (1) Agentga («Nusxalash» bilan): «Tekshiruv uchun {qaysi o'zgarishda} uch marta ro'y beradigan holat tayyorla: yangi tekshiruv akkauntlari — namuna ism va login bilan, haqiqiy emas, `namuna = true`; menga (hisob {hisob raqamim}) tegishli bo'lsin. Hali hech narsa yuborma. Qaysi yozuvlar va qaysi `id` lar ekanini va o'zgarishni men qanday ishga tushirishimni ayt.»
         Mentor misolida (kulrang): «… o'tgan haftadagi Shanba, soat 15:00, 16:00 va 17:00 dagi uchta «Doimiy o'yin» — tekshiruv tashkilotchisi nomidan, Mahalla maydoni, kerak 10; meni har biriga qo'shilgan qilib yoz …» — o'yin vaqti o'tishini bir hafta kutmaslik uchun bu holatni agent tayyorlaydi.
     (2) Agent aytgan ishni qiling — Mentor misolida ilovani ochasiz: ilova `GET /oyinlar` ni so'raydi va keyingi hafta o'yinlari shunda yaratiladi. Telegram'ingizga **ikkita** Telegram xabari kelishi kerak, uchinchisi — yo'q: haftalik chegara. Matn va havolani o'qing — talabingizdagidek bo'lsin.
         Bu hafta boshqa Telegram xabari olgan bo'lsangiz — kamroq keladi: chegara hamma Telegram xabarini sanaydi.
     (3) Xuddi shu ishni yana bir marta qiling (Mentor misolida — ilovani yana oching) — yangi xabar kelmasligi kerak: bitta narsa haqida bir marta.
     (4) Agentga: «Hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chirish ro'yxatini ko'rsat: tekshiruv akkauntlari, o'yinlar va ulardan yaratilgan yangi o'yinlar, qo'shilish yozuvlari va `telegram_xabarlar` dagi qatorlar. Men «Davom et» desam — o'chir.»
         Ro'yxatni o'qing: faqat bugungi tekshiruv yozuvlari bo'lsa — «Davom et». Shunda haftalik chegarangiz tekshiruv xabarlari bilan to'lib qolmaydi. Telegram chatidagi xabarlar qoladi — 3-amaliyotda havolasi kerak.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Telegram chati (`…_bot`) — ikki pufak: «Shanba, 15:00 o'yini yana e'lon qilindi · Mahalla maydoni» va «Shanba, 16:00 o'yini yana e'lon qilindi · Mahalla maydoni», har birining ostida havola qatori `…netlify.app/?kanal=telegram`;
  ostida kulrang yorliq «17:00 o'yini haqida xabar yuborilmadi — haftalik chegara» va «tekshiruv o'yinlari; keyin o'chiriladi». Web-trekda — o'sha chat, havola sayt manzili bilan.
- Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin; dars holatida — 3, 10-darslar naqshi; F-1007-466): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Telegram xabari faqat tegishli, botni ulagan odamga ketdi; uchinchisi yuborilmadi.
- Qator (`QIzoh`, natija ostida, bitta): Xabarni Backend yubordi: o'yinchining ilovasi yopiq bo'lsa ham, yangi o'yinni u biladi.
- Ulgurmasangiz: 4-qadamni dars oxirida bajaring — «Davom etish» 3-qadamdan keyin ochiladi; 3-amaliyotdagi sanoq tekshiruvini havolani brauzerda o'zingiz ochib qilasiz. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Weekly Two — 4-qadam «Bajardim»ida.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A2 — tayyor talab + 4 joy; mahsulot qarori (qaysi o'zgarish, kimga, matn) o'quvchida (sinf 13). Tekshiruv natijasini o'quvchi o'z Telegram'ida ko'radi; agent faqat vaqti o'tgan tekshiruv holatini tayyorlaydi va `id` bo'yicha o'chiradi (sinf 10; 12-Modul 9.35 a, 9.39 b).
  Uch tekshiruv o'yini — bitta yurishda ham xabar, ham chegara ko'rinadi. Tekshiruv yozuvlari o'chirilmasa, o'quvchining shu haftadagi haqiqiy xabarlari chegaraga urilardi (12-Modul 9.41 i). Xabarda son yo'q (TAYANCHGA SAVOL 1, F-1007-466).
  Xabarlar yuborilgach `GET /oyinlar` javobi qaytadi (bepul Backend javobdan keyin uxlab qolsa, xabar yo'qolmasin); yozuv avval band qilinadi, Telegram xato bersa o'chiriladi (F-1007-466). Bloklangan botga yuborilganda Telegram nima qaytarishi — tayanch 6 «tekshirilmagan» (Shubhali 5).
- O'qituvchi eslatmasi: «Telegram xabari» haftalik sanog'ini Backend yuritadi; ilova eslatmalari telefonda, o'z chegarasi bilan (12-Modul) — ikkisi bitta sanoqqa qo'shilmaydi (TAYANCHGA SAVOL 11). Xabar matnida «Pro oling» kabi taklif bo'lmaydi: bu dars — o'yinchini o'yinga qaytarish, pul emas.

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (yorliqsiz — SABOQ 6)
- Savol: **Mentor misolida Telegram xabari kelishi uchun telefonda ilova turishi shartmi?**
  - A · Ha — Telegram xabari ilova orqali keladi
  - B · ✔ Yo'q — xabarni Telegram'dagi bot yozadi
  - C · Ha — Backend avval ilovaga so'rov yuboradi
  - D · Yo'q — Backend uni SMS bo'lib yuboradi
- Kalit: **B** (index 1). To'rttalasi «Ha / Yo'q — sabab» shaklida, ikkitadan (S-006, §107); «Telegram» A va B da, «Backend» C va D da; «ilova» savolda va A, C da (S-003: kalit so'z faqat to'g'rida emas); to'g'ri variant yolg'iz eng uzun emas (O'lchov).
- To'g'ri izohi: Telegram xabari ilovaga emas, Telegram chatiga keladi.
- Xato izohlari (≤60):
  - A: Xabar Telegram chatiga keladi — ilova bu yerda kerakmi?
  - C: Backend Telegram'ga yozadi — ilovaga so'rov shart emas.
  - D: Mentor ilovasi telefon raqamini umuman so'ramaydi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- ✎ Yangi vaziyat (§106): savol 2-shart («botni o'zi ulagan») ilova telefonda turmasa ham bajarilishini so'raydi; 0-ekrandagi «ilovani o'chirdim» javobiga ulanadi (ip). F-1007-466: savol shartsiz qilindi — «xabar keladimi» emas, «ilova shartmi»: haftalik chegara, to'xtatilgan bot yoki o'chirish B ni yolg'onga chiqarmaydi.
  Distraktorlar uch xil (sinf 8): Telegram xabari ilovaga bog'liq deb o'ylash (A) · Backend ilovaga yozadi deb o'ylash (C) · yolg'on kanal (D — 12-Modulda telefon so'ralmaydi).

## 8 · Amaliyot 3 — o'chirish, sanoq va siyosat  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈17 daq)
- Eyebrow: Amaliyot 3 · o'lchov va nazorat
- Sarlavha: **Xabar bir bosishda o'chsin, ochilishlar sanalsin.** (49)
- Mentor: Foydalanuvchi Telegram xabaridan bir bosishda chiqa olishi kerak; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Foydalanuvchi Telegram xabarlarini bir bosishda o'chiradi; xabardagi havola bilan ochilganlar sanaladi; maxfiylik siyosatida chat raqami haqida qator bor.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — sanoq sahifangizni oching (12-Modul 8-darsi, kalit bilan): qadamlar va «eslatmadan ochdi» qatorlari turibdi. Bugun ularning ostiga yangi qator qo'shiladi — Telegram xabaridagi havola bilan ochilgan qurilmalar soni.
     Bu son havola bosilganini aytadi; xabar odamni qaytardimi — buni aytmaydi.
     Ikki savolga javob toping: o'chirish tugmasi qayerda turadi? (Mentor misolida — «Telegram ulangan» yonida «Telegram xabarlarini o'chirish»; so'rov oynasisiz, bir bosishda.) Maxfiylik siyosatingizdagi to'rt savoldan qaysi biriga qator qo'shasiz? (10-Modul: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi.)
     Web-trekda: havola saytingizni ochadi, sanoq yozuvi o'sha nom bilan.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — Telegram bo'limi, `POST /hodisalar` va `GET /hodisalar/sanoq`; {o'chirish tugmasi joyi}; {havolani ochadigan qism}; `lending/sanoq.html` va `lending/maxfiylik.html`.
     > Nima qilsin: 1) «Telegram ulangan» yonida tugma «Telegram xabarlarini o'chirish» — so'rov oynasisiz, bir bosishda: Backend shu foydalanuvchining chat raqamini va kutayotgan bir martalik kodini o'chirsin, ilova yana «Telegram'da xabar olish»ni ko'rsatsin. Bu yo'l faqat hisobga kirgan foydalanuvchi uchun, faqat o'zining yozuviga.
     > 2) «Hisobni o'chirish»da chat raqami va Telegram xabarlari jadvalidagi yozuvlari ham o'chsin.
     > 3) {havolani ochadigan qism} manzilida `kanal=telegram` bo'lsa — `hodisaYoz('telegramdan-ochdi')`, bitta ochilishga bitta yozuv — sahifa yuklanganda bir marta, qayta chizilganda emas. `POST /hodisalar` qabul qiladigan nomlarga `telegramdan-ochdi` qo'sh; `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «Telegram'dan ochdi» — turli qurilmalar soni.
     > 4) `lending/maxfiylik.html` dagi «Qaysi ma'lumot?», «Nima uchun?» va «Qancha saqlanadi?» javoblariga qo'sh: «{siyosat qatori}» Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.
     > Nima buzilmasin: sanoq sahifasi faqat kalit bilan ochilsin; sanoq yozuvida ism, login va chat raqami bo'lmasin; 1–2-amaliyotdagi ulanish va xabar avvalgidek. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {o'chirish tugmasi joyi} — «masalan: `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori»
     - {havolani ochadigan qism} — «masalan: `mobil/` — ilovaning brauzer ko'rinishi»
     - {siyosat qatori} — «masalan: Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz …» (to'liq matni «Yordam»da)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — Telegram bo'limi, `POST /hodisalar` va `GET /hodisalar/sanoq`; `mobil/` — «Hisobdan chiqish» yonidagi sozlamalar qatori va ilovaning brauzer ko'rinishi; `lending/sanoq.html` va `lending/maxfiylik.html`.
     > Nima qilsin: 1) «Telegram ulangan» yonida tugma «Telegram xabarlarini o'chirish» — so'rov oynasisiz, bir bosishda: Backend shu o'yinchining `telegram_chat_id`, `telegram_kod` va `telegram_kod_gacha` ni bo'shatsin, ilova yana «Telegram'da xabar olish»ni ko'rsatsin. Bu yo'l faqat hisobga kirgan o'yinchi uchun, faqat o'zining yozuviga.
     > 2) «Hisobni o'chirish»da `telegram_chat_id` va `telegram_xabarlar` dagi yozuvlari ham o'chsin.
     > 3) Ilovaning brauzer ko'rinishi manzilida `kanal=telegram` bo'lsa — `hodisaYoz('telegramdan-ochdi')`, bitta ochilishga bitta yozuv — sahifa yuklanganda bir marta, qayta chizilganda emas (`ochdi` avvalgidek yoziladi). `POST /hodisalar` qabul qiladigan nomlarga `telegramdan-ochdi` qo'sh; `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «Telegram'dan ochdi» — turli qurilmalar soni.
     > 4) `lending/maxfiylik.html` dagi «Qaysi ma'lumot?», «Nima uchun?» va «Qancha saqlanadi?» javoblariga qo'sh: «Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz va qaysi o'yin haqida xabar yuborilgani saqlanadi: siz qatnashgan «Doimiy o'yin» yana e'lon qilinganini yozish va haftasiga ikkitadan oshirmaslik uchun. Ismingiz va Telegram nomingiz saqlanmaydi. «Telegram xabarlarini o'chirish»ni bossangiz, chat raqami o'chiriladi; qaysi o'yin haqida xabar yuborilgani yozuvi hisobingiz o'chirilguncha qoladi.» Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.
     > Nima buzilmasin: sanoq sahifasi faqat kalit bilan ochilsin; sanoq yozuvida ism, login va chat raqami bo'lmasin; 1–2-amaliyotdagi ulanish va xabar avvalgidek. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida `mobil/` o'rnida saytingiz (`prototip/`) — tugma va `kanal=telegram` o'qish o'sha yerda; qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "telegram o'chirish va sanoq"` → `git push`. Backend o'zgardi — Render'da yangi versiya tugashini kuting; lending sahifalari push'dan keyin odatda o'zi yangilanadi.
     Mobil trekda brauzer ko'rinishini yangilang (12-Modul buyruqlari): `npx expo export -p web` → `netlify deploy --prod --dir dist`. Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Kutayotganda agentga («Nusxalash» bilan):
     > Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: o'chirish tugmasi chat raqamini o'chiradigan qator va `kanal=telegram` o'qiladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabingizning har qatorini ko'ring:
     (1) Ilovangizda «Telegram xabarlarini o'chirish» → tugma o'rnida yana «Telegram'da xabar olish». Neon SQL Editor'da: `SELECT id, telegram_chat_id IS NOT NULL AS ulangan FROM oyinchilar WHERE id = {hisob raqamingiz};` → `ulangan` — `false`. Chat raqami yo'q — Backend'da xabar yuboradigan joy qolmadi.
     (2) Telegram'da 2-amaliyotdagi xabarning havolasini bosing (xabar bo'lmasa — brauzerda `{mahsulot manzili}?kanal=telegram` ni o'zingiz oching). Telefonda brauzer ko'rinishi ochiladi (web-trekda — saytingiz).
         Sanoq sahifangizda «Telegram'dan ochdi» qatorida 1 qurilma chiqishi kerak. Bitta ochilish ikki yozuv beradi: `ochdi` (har ochilishda) va `telegramdan-ochdi` (havola orqali) — bu xato emas.
     (3) Tekshiruv yozuvini haqiqiy sanoqdan chiqaring. Neon SQL Editor'da: `SELECT id, yaratilgan FROM hodisalar WHERE nom = 'telegramdan-ochdi' ORDER BY yaratilgan;` → «Run» — faqat bugun o'zingiz bosgan vaqtdagi qatorlar bo'lishi kerak; boshqa qator bo'lsa — unga tegmang.
         Agentga: «`hodisalar` jadvalidan faqat shu `id` li tekshiruv yozuvlarini o'chir: {id lar}.» Sanoq sahifasida qator 0 ga qaytadi.
     (4) Telefoningizda `lending/maxfiylik.html` ni oching — yangi qatoringiz turibdi. Telegram xabarini o'zingiz olmoqchi bo'lsangiz — «Telegram'da xabar olish» bilan qayta ulang; bu majburiy emas.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki maket bir marta o'zi yuradi):
  - telefon: sozlamalar qatori «Telegram ulangan» va tugma «Telegram xabarlarini o'chirish» → bosilgach qator «Telegram'da xabar olish» bo'lib qaytadi (sozlama qatori ko'rinishida, chiqish tugmasiga o'xshamaydi)
  - sanoq sahifasi (brauzer oynasi `…/sanoq.html`): qadamlar va «eslatmadan ochdi» qatorlari (kulrang, sonsiz) · ostida yangi qator yashil yonadi: «Telegram'dan ochdi · 1 qurilma» · yorliq «Mentorning o'z telefoni — tekshiruv; keyin o'chiriladi»
  - pastda maxfiylik sahifasidan bitta qator (Yordamdagi gapning boshi). Web-trekda telefon o'rnida brauzer oynasi.
- Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin; dars holatida — 3, 10-darslar naqshi; F-1007-466): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): O'chirish bir bosishda ishlaydi; Telegram xabaridan ochilganlar sanaladi.
- Qator (`QIzoh`, natija ostida; faqat mobil trekda): APK o'zi yangilanmaydi: o'rnatilgan faylda Telegram tugmasi yo'q — bugun Expo Go va brauzerda tekshirasiz. (106)
- Ulgurmasangiz: o'chirish va sanoq qatori birinchi; siyosat qatorini dars oxirida bajaring. Tekshiruv yozuvlarini o'chirishni o'tkazib yubormang.
- Nishon (bonus): Easy Off — 4-qadam «Bajardim»ida.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A3 — tayyor talab + 3 joy. `telegramdan-ochdi` — «sanoq yozuvi» (tayanch 1.8, 2; T-015): havola bilan ochilganini sanaydi, sababni emas (sinf 5); «xabar qaytardi» deyilmaydi.
  O'chirish — so'rov oynasisiz, bir bosishda (tayanch 1.8, TAQIQLAR 3); «Hisobni o'chirish» bilan ham chat raqami o'chadi (TAYANCHGA SAVOL 13). Tekshiruv yozuvi o'chiriladi (12-Modul 9.41 i); o'quvchi `SELECT` bilan ko'radi, agent `id` bo'yicha o'chiradi — o'quvchi `DELETE` yozmaydi (sinf 10).
  Neon so'rovi chat raqamini ekranga chiqarmaydi (`IS NOT NULL`) — chat raqami hech qayerda ko'rinmaydi (TAQIQLAR 3). Siyosat qatori — Mentor gapi (TAYANCHGA SAVOL 14); o'quvchi o'z qatorini o'zi yozadi.
  Brauzer ko'rinishi yangilanishi — 12-Modul 9.28 buyruqlari (Netlify'ga chiqish; menyu nomlari yo'q). Yangi o'rnatish fayli bu darsda yo'q — GATE M M-q5 A (F-1007-466).
- O'qituvchi eslatmasi: telefonda Telegram xabaridagi havola brauzerda ochiladi — o'rnatilgan APK'ni havoladan ochish uchun alohida sozlash kerak (Android App Links: ilova sozlamasi va saytdagi tasdiq fayli — Expo hujjati), bu darsda yo'q.
  Shuning uchun Mentor misolida havola brauzer ko'rinishiga olib boradi; u yerda hisobga kirmagan odam o'yinlarni mehmon sifatida ko'radi (12-Modul 8-darsi). Ilovani o'chirib yuborgan odam ham havola orqali o'yinni ko'ra oladi.

## 9 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Chat raqami qachon keladi» · 7 — «2 — Ilova shartmi»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ Uch blok bajarildi (faqat 3-amaliyot 4-qadami bajarilganda; aks holda yorliq yo'q) · {N}/2 to'g'ri
- Sarlavha (bloklar va tekshiruv kartalari holatiga qarab, P-046; sinf 6 — o'quvchi qilgan va ko'rgan ishni aytadi, har holat rost — E 54; F-1007-466):
  - uchala blok, hammasi «Kutilganidek»: **Telegram xabari ishlaydi, o'chiriladi va sanaladi.** (50)
  - bajarilgan blokda «Boshqacha» bor: **Telegram xabari qurildi — bitta joyni tuzatish qoldi.** (53)
  - 1 va 2-blok («Kutilganidek»): **Telegram xabari ishlaydi — o'chirish va sanoq qoldi.** (52)
  - faqat 1-blok («Kutilganidek»): **Bot ulandi — Telegram xabari va o'chirish qoldi.** (48)
  - boshqa holat: **Telegram xabari hali tugamagan — bloklarni bajaring.** (52)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5):
  - O'yinchining ilovasi yopiq bo'lsa ham, yangi o'yin yaratilganini Backend biladi — Telegram xabarini u yuboradi.
  - Bot odamga birinchi bo'lib yozolmaydi: odam botni o'zi boshlashi kerak.
  - Bir martalik kod Telegram chatini aynan shu hisob bilan bog'laydi; Backend faqat chat raqamini saqlaydi.
  - Bu kursda Telegram xabari faqat odamning o'z o'yini haqida va haftasiga ko'pi bilan ikkita.
  - O'chirish bir bosishda; sanoq havola bilan ochilganini ko'rsatadi, xabar qaytardimi — buni emas.
- Uyga vazifa — yo'q (loyiha kuni; tayanch 4). `uyga: null`.
- Keyingi dars — «Kim haqiqatan to'lashga tayyor?»: Mentor tekshiruvi: uchta yozma tasdiq.
- Nishonlaringiz — N/4
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- ✎ «ishlaydi» — o'quvchi o'z Telegram'ida xabarni ko'rgan va «Kutilganidek» ni tanlagan (2-amaliyot 4-qadami; «Bajardim» — ish fakti, natija emas — F-1007-466); «sanaladi» — o'lchov tayyor, «foydalanuvchi qaytdi» deyilmaydi (sinf 5, 6). «Boshqa holat» — hech biri yoki tartibsiz holat: har holatda rost («hali tugamagan»).
  Sarlavhalar ikkala trekka to'g'ri (bot trekka bog'liq emas). «Keyingi dars» qatori — App.jsx `m11-09` nomi va osti (T-038: boshqa joyda va'da yo'q).

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Start First** — Telegram chati faqat «Start»dan keyin kelishini topdingiz (4-ekran, 1-savol)
- **Still Reaches** — Ilovasiz ham Telegram xabari yetishini topdingiz (7-ekran, 2-savol)
- **Weekly Two** — Telegram xabarini va haftalik chegarani o'z Telegram'ingizda tekshirdingiz (2-amaliyot, 4-qadam «Bajardim») — bonus, birinchi urinish sharti yo'q
- **Easy Off** — O'chirish va sanoq qatorini o'zingiz tekshirdingiz (3-amaliyot, 4-qadam «Bajardim») — bonus, birinchi urinish sharti yo'q; tavsif — qilingan ish, «foydalanuvchini qaytardingiz» emas
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 07.10: Start First · Still Reaches · Weekly Two · Easy Off — 0). Ikki blok nishoni — ish uchun (P-048), tekin emas.

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: PM qismi — raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Bot faqat «Start»ni bosgan odamga yozadi»
   - 1 · Ilovada «Telegram'da xabar olish» — havolada bir martalik kod.
   - 2 · Botda «Start» — Backend chat raqamini oladi.
   - 3 · Shundan keyingina bot xabar yoza oladi.
   - Sinfga savol: Bot odamni o'zi qidirib topib, unga yoza oladimi?
2. 2-savol (7-ekran) — «Telegram xabari kimga ketadi»
   - 1 · O'tgan hafta shu o'yinda qatnashgan.
   - 2 · Botni o'zi ulagan — ilova telefonda bo'lishi shart emas.
   - 3 · Bu hafta ikkitadan kam Telegram xabari olgan.
   - Sinfga savol: Telegram xabarlarini o'chirgan odamga xabar ketadimi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Mentor misolida yana ochmagan besh o'yinchi nima dedi? | Uchtasi — yangi o'yin chiqqanini bilmadim; bittasi — ilovani o'chirdim; bittasi javob bermadi | 5 kishi — kichik son: sabab haqida dalil, isbot emas |
| Ilova yopiq bo'lsa, yangi o'yin haqida kim biladi? | Backend | Yopiq ilova yangi e'lonni bilmaydi (12-Modul); o'yin kimdir ilovani ochganda yaratiladi |
| Bot odamga birinchi bo'lib yoza oladimi? | Yo'q | Odam botni o'zi boshlashi kerak; botni ulamagan odamga Telegram xabari yetmaydi |
| Bir martalik kod nima uchun kerak? | Telegram chatini aynan shu hisob bilan bog'lash uchun | Mentor misolida — 10 daqiqa va bir marta ishlaydi |
| Telegram so'rovini Backend qanday taniydi? | Sarlavhadagi maxfiy kalit bilan | Kalit `.env` da: `TELEGRAM_SIR` |
| Ulanishda Backend Telegram'dan nimani saqlaydi? | Faqat chat raqamini | Ism va Telegram nomi saqlanmaydi |
| Telegram xabari bilan eslatmaning farqi nima? | Telegram xabarini Backend bot orqali yuboradi, eslatmani ilova qo'yadi | Ikkalasi aralashmaydi: biri Telegram chatida, biri telefon ekranida |
| Mentor misolida Telegram xabari kimga ketadi? | O'tgan hafta shu o'yinda qatnashgan, botni ulagan o'yinchiga | Haftasiga ko'pi bilan ikkita |
| «Telegram xabarlarini o'chirish» nima qiladi? | Chat raqamini o'chiradi — xabar to'xtaydi | Bir bosishda, so'rov oynasisiz |
| `telegramdan-ochdi` nimani sanaydi? | Xabardagi havola bilan ochilgan qurilmalarni | Xabar odamni qaytardimi — buni aytmaydi |
| Bot tokeni qayerda turadi? | `backend/.env` da va Render sozlamasida | Agentga, chatga, skrinshotga yozilmaydi |
| APK o'rnatganlar Telegram tugmasini qachon ko'radi? | Yangi o'rnatish faylini o'rnatgach | APK o'zi yangilanmaydi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Mentor misolida yana ochmagan beshtadan ko'pi nima dedi? ✔ «Yangi o'yin chiqqanini bilmadim» · «Ilova menga umuman yoqmadi» · «Telefonimda joy qolmay qoldi» · «O'yinlar menga juda qimmat tuyuldi»
2. Bot odamga birinchi bo'lib yoza oladimi? Ha — Backend chat raqamini o'zi topadi · ✔ Yo'q — odam avval botni o'zi boshlaydi · Ha — bot istalgan odamga yoza oladi · Yo'q — buning uchun telefon raqami kerak
3. Ulanish havolasidagi bir martalik kod nima uchun kerak? Botni Telegram qidiruvida tezroq topish uchun · Xabarni tezroq yetkazib berish uchun · ✔ Chatni aynan shu hisob bilan bog'lash uchun · Bot tokenini odamga ko'rsatish uchun
4. Telegram so'rovi kelganda Mentor Backend'i avval nimani tekshiradi? Odamning Telegram nomini · Xabardagi chat raqamini · Botning foydalanuvchi nomini · ✔ Sarlavhadagi maxfiy kalitni
5. Bot tokeni qayerda turadi? ✔ `backend/.env` da va Render sozlamasida · Ilova kodida, tugma bosiladigan joy yonida · `README.md` dagi ro'yxatda, qiymati bilan · Bot javobi matnida, eng oxirgi qatorda
6. Ulanganda Backend Telegram'dan nimani saqlaydi? Odamning ismi va Telegram nomini · ✔ Faqat chat raqamini, boshqasini emas · Telefon raqami va chat raqamini birga · Botga yozilgan hamma xabarlarni
7. Shu hafta o'yinchiga ikkita Telegram xabari ketdi. Uchinchisi-chi? Baribir yuboriladi — o'yin yangi · Ilovada eslatma bo'lib chiqadi · ✔ Bu hafta umuman yuborilmaydi · Ertasiga ikki marta yuboriladi
8. Qaysi Telegram xabari darsdagi qoidaga mos? «Pro oling — aks holda o'yiningiz to'lmaydi» · «Hamma qaytdi, faqat siz yo'qsiz!» · «Yangi o'yinlar bor, ilovani oching!» · ✔ «Shanba, 18:00 o'yini yana e'lon qilindi»
9. «Telegram xabarlarini o'chirish» bosilsa, nima bo'ladi? ✔ Chat raqami o'chadi, xabar to'xtaydi · Hisob butunlay o'chib ketadi · Bot Telegram'dan butunlay o'chib ketadi · Xabarlar faqat kechqurun keladi
10. Mentor misolida `telegramdan-ochdi` qachon yoziladi? Telegram xabari yuborilganda · ✔ Xabardagi havola bilan ochilganda · Bot «Start»ni qabul qilganda · Ilova telefonga yangidan o'rnatilganda
11. Sinfdagi tekshiruv o'yinlari va yozuvlari nima bo'ladi? `hodisalar` da shundayicha qoladi · Bir haftadan keyin o'zi o'chadi · ✔ Tekshirgach, `id` bo'yicha o'chiriladi · Mentor misoliga namuna qilib ko'chiriladi
12. Mentor misolida Telegram xabari bilan eslatmaning farqi nima? Ikkalasini ham ilovaning o'zi oldindan qo'yadi · Ikkalasini ham Backend'ning o'zi yuborib turadi · Eslatmani bot yozadi, Telegram xabarini ilova qo'yadi · ✔ Xabarni Backend yuboradi, eslatmani ilova qo'yadi

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Ha/Yo'q savoli — 2: ikkitadan (S-006). Kod belgisi faqat to'g'rida emas: 5 — A va C da; 11 — A va C da; 10 — savolda. 8 — A: to'lov taklifi va qo'rqitish, B: uyaltirish, C: o'z o'yini emas, umumiy (5-ekran QIzohi — «faqat o'zgarish»).
7 — haftalik chegara (5-ekran 3-o'yinchi — boshqa shaklda: savol variantlari chegaradan keyin nima bo'lishini so'raydi). 12 — T-015 (ikki so'z aralashmaydi). Arena 2 — 2-ekran bashorati bilan bir g'oya, lekin ballik va boshqa variantlar bilan (bashorat ballanmaydi).
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari ru'da ham o'sha; R-008): Telegram xabari · bot · «Start» · bir martalik kod · chat raqami · `TELEGRAM_SIR` · haftasiga ikkita · `telegramdan-ochdi` · «Doimiy o'yin» · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **2 (C)** · s7 **1 (B)**; bloklar (3, 6, 8) — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m11-08-v1`, `lessonTitle` — «Loyiha kuni: ketayotgan foydalanuvchini qaytarish». App.jsx `m11-08` ga `comp: WinBackDayLesson` — «qur» bosqichida (asosiy seans).
2. **Bitta manba (180):** `TG_SAHNA` (telefon ko'rinishlari `qulf` · `ilova` · `telegram`; Backend qatorlari; Telegram tuguni; chiziq holatlari `uzuq` · `toliq`; konvert turlari) · `QAYTISH_SONLAR` (61 · 26 · 35 — qurilma, 12-Modul) ·
   `QAYTMAGAN_JAVOBLAR` (besh qator: 3 × «Yangi o'yin chiqqanini bilmadim» · «Telefonda joy qolmadi, ilovani o'chirdim» · «javob bermadi») · `TG_XABAR` (shablon `{kun}, {soat} o'yini yana e'lon qilindi · {maydon}` + havola qatori; son yo'q — F-1007-466) ·
   `BOT_JAVOBLARI` (uch matn — A1 talabi) · `KIMGA_OYINCHILAR` (5-ekran, to'rt karta) · `KATAKLAR` (5-ekran va recap 2) · `TEKSHIRUV_OYINLARI` (2-amaliyot kutilgan natijasi: 15:00 · 16:00 · 17:00) · `SIYOSAT_QATORI` · `YORDAM_A1` · `YORDAM_A2` · `YORDAM_A3` — ekranlar, bloklar o'ngi va kartochka shundan o'qiydi.
3. **`TgSahna`** komponenti — 12-Modul 9-darsidagi ikki telefonli sahna naqshida (nusxa, import emas — darslar mustaqil): `telefon` (`qulf` · `ilova` · `telegram`), `backend` (qatorlar, «Telegram: ulanmagan / ulangan»), `telegramTugun`, `chiziq`, `konvertlar`, `pufaklar` (Telegram chati), `startTugma`, `yorliqlar`.
   Telegram chati — chizilgan: tepada «Telegram» o'z rangida va `…_bot`, pufaklar, pastda «Start». **Chat raqami, Telegram nomi, odam ismi hech bir holatda chizilmaydi.** Logotip yo'q (D4). Bosiladigan qismlar faylda e'lon qilinadi
   (`// qolip-maket: tg-shanba tg-ulash tg-start tg-tekshir tg-ochir`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200).
4. **0-ekran `QKirish`:** maket — telefon (javoblar ro'yxati, besh bo'sh qator) + uch ustunli hisoblagich (61 · 26 · 35, yorliq «12-Modul sanog'i · qurilma, ismsiz»; javoblar ro'yxati — «Mentor so'ragan tanishlar · odam»); javobdan keyin qatorlarga javoblar navbat bilan yoziladi, kulrang qator chiqadi (kirish animatsiyasi, SABOQ 19).
5. **2-ekran `QTushuncha`:** `QBashorat`/`QTaxmin` (yopilmaydi — ixcham qator), to'rt harakat navbat bilan (faol tugma halqada, qolganlari xira), konvertlar, telefon ko'rinishlari almashishi, ikki nom qatori (harakatdan keyin), joriy qator, `zoom`, `tugadi`. Holat bosishlar ro'yxatidan (P-046).
6. **5-ekran `QTushuncha`:** `KIMGA_OYINCHILAR` bittadan («O'yinchi N / 4»), «Tekshirish» → `KATAKLAR` ga ✓/✗ navbat bilan (60–120 ms), yashil / qizil karta, qizil qator (`QXato` ≤60), o'tganlar ixcham qator; 5-harakat — 1-o'yinchi qatorida «Telegram xabarlarini o'chirish»; joriy qator, `QIzoh`, `zoom`, `tugadi`.
   Tekshiruv kartasi ostida yorliq «bu kursda · Mentor misolida».
7. **4 va 7-ekran `QTest`** — matn yuqoridagidek; to'g'ri izoh bitta qisqa gap, xato izohlari ≤60.
8. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (12-Modul 9-darsi naqshi): har blok **4 qadam**, hammasi o'quvchining o'z repo'sida; 5-qadam yo'q. `{…}` joylari — A1: 3, A2: 4, A3: 3 (bo'sh, yonida kulrang «masalan»); «Yordam» — Mentor misolidagi to'liq talab (`YORDAM_A1…A3`); web gapi — «Yordam» ostida, trek `pm-m9d8-platforma` dan.
   - Tekshirish qadamlaridagi agentga matnlar va Neon so'rovlari — «Nusxalash» bilan (prompt qutisi kabi). A2 4-qadamida «Mentor misolida» satri kulrang.
   - «Davom etish»: A1 — faqat 4-qadam «Bajardim»idan keyin · A2 — 3-qadamdan keyin (E 55) · A3 — 4-qadamdan keyin. Blok bayrog'i — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h); yakun sarlavhasi shu bayroqlar va 4-qadamdagi tekshiruv kartalaridan («Kutilganidek» / «Boshqacha» — F-1007-466).
   - O'ng: A1 — telefon (ikki kadr) + Neon qatori + terminal kartasi · A2 — Telegram chati (ikki pufak + kulrang yorliq) · A3 — telefon + sanoq sahifasi (brauzer oynasi) + siyosat qatori. Web-trekda telefon o'rnida brauzer oynasi.
   - Har blok 4-qadamida tekshiruv kartasi «Kutilganidek» · «Boshqacha» — dars holatida (`ccProgress`; 3, 10-darslar naqshi), yangi `pm-…` kaliti yo'q; yashil qator va yakun sarlavhasi shundan (F-1007-466). «Ortda qoldingizmi» — faqat A1 da (SABOQ 39), teg `m13-dars-08-done`.
   - `ACH_TRIGGERS`: 4 → Start First · 7 → Still Reaches · A2 4-qadam «Bajardim» → Weekly Two · A3 4-qadam «Bajardim» → Easy Off.
   - ⚠️ Qolipda yo'q (12-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, O'qituvchi eslatmasi, ikki tugmali tanlov — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
9. `RECAPS` 2 (kalit = 4 va 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 0·1·2·3 ×3) · flashcard 12 (`sflash`, Mentor yo'q, «Kartani bosing — javob ochiladi»; SABOQ 12, 16) · `QZ_BG_SHAPES` fon so'zlari {uz, ru}, emoji yo'q.
10. **11-ekran `QYakun`:** sarlavha — blok bayroqlari va tekshiruv kartalaridan (besh holat); ✓ yorliq faqat A3 bajarilganda; `recap` 5 qator; `uyga: null`; `keyingi` — yuqoridagi matn. «Bugungi asosiy fikr» qutisi yo'q (E 50).
11. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). `narrow` faqat 4, 7, 9-ekranlarda (171). Skelet tuzoqlari — 12-Modul SABOQ C («Skelet tuzoqlari» bandi).
12. **Darvozalar:** `npm run gates -- src/11-Modull/WinBackDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.
13. ru — uz tasdiqlangach, bir yo'la (6-RU; tayanch 10 lug'ati — «Telegram bot», «Yordam»; «Telegram xabari», «bir martalik kod», «chat raqami» — RU bosqichida o'lchanadi).

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-08-start` = `m13-dars-07-done` → `m13-dars-08-done`, tayanch 3)
1. `backend/` — `oyinchilar`: `telegram_chat_id` (bo'sh bo'lishi mumkin; 52 bitgacha butun son — Manbalar 2), `telegram_kod`, `telegram_kod_gacha`. Yangi bo'lim `backend/src/telegram/`:
   ishga tushganda `RENDER_EXTERNAL_URL` bo'lsa — `setWebhook` (`url` = `…/telegram/webhook`, `secret_token` = `TELEGRAM_SIR`) va `getMe` (botning foydalanuvchi nomi) · `POST /telegram/kod` (token bilan; 16 belgili harf-raqam kod, 10 daqiqa; javob — havola) ·
   `POST /telegram/webhook` — `X-Telegram-Bot-Api-Secret-Token` `TELEGRAM_SIR` ga teng bo'lmasa — `401`; faqat `chat.type = 'private'` dagi `/start <kod>`; kod amal qilsa — `telegram_chat_id` yoziladi, kod bo'shatiladi, bot javobi (A1 matni); aks holda ikki javobdan biri; ishlangan `update_id` qayta ishlanmaydi; Telegram'ga `200`.
   Telegram so'rovidan faqat `chat.id` olinadi; `from.first_name`, `username`, xabar matni saqlanmaydi va logga yozilmaydi. `GET /men` ga `telegram: boolean`.
2. `backend/` — `telegram_xabarlar` (`id` · `oyinchi_id` · `oyin_id` · `yuborilgan`; UNIQUE (`oyinchi_id`, `oyin_id`)). «Doimiy o'yin»ning keyingi haftadagi o'yini `GET /oyinlar` da yaratilganda — oldingi o'yinning `qoshildi`/`keladi` qatnashchilaridan `telegram_chat_id` bo'lgan va shu hafta
   (dushanba–yakshanba) `telegram_xabarlar` da 2 tadan kam qatori borlarga `sendMessage`: `TG_XABAR` matni + `{brauzer ko'rinishi manzili}?kanal=telegram`. Tartib (F-1007-466): haftalik sanoq va `telegram_xabarlar` ga yozuv — bitta Database ishida (UNIQUE band qilinadi) → faqat yozuv qo'shilgan bo'lsa `sendMessage` → Telegram xato bersa yozuv o'chiriladi (chat raqami qoladi) · `GET /oyinlar` javobi yuborishdan keyin qaytadi. Pro tugagan tashkilotchining keyingi o'yini yaratilmaydi (5-dars, 9.26) — xabar ham yo'q; takror yaratilish — 12-dars topilmasi (M-q4 A).
3. `backend/` — o'chirish yo'li (token bilan; o'z yozuvi): `telegram_chat_id`, `telegram_kod`, `telegram_kod_gacha` bo'shatiladi · «Hisobni o'chirish» — `telegram_xabarlar` qatorlari ham · `POST /hodisalar` nomlariga `telegramdan-ochdi` · `GET /hodisalar/sanoq` — yangi maydon (turli `qurilma_id`).
4. `mobil/` — «Hisobdan chiqish» yonida sozlama qatori: «Telegram'da xabar olish» (ostida matn) / «Telegram ulangan» + «Telegram xabarlarini o'chirish»; `Linking.openURL(havola)`; brauzer ko'rinishida manzilda `kanal=telegram` bo'lsa — `hodisaYoz('telegramdan-ochdi')` (bitta ochilishga bitta).
   `lending/sanoq.html` — qator «Telegram'dan ochdi». `lending/maxfiylik.html` — `SIYOSAT_QATORI`. `backend/.env.example` — `TELEGRAM_BOT_TOKEN=`, `TELEGRAM_SIR=` (qiymatsiz). `README.md` — o'zgaruvchilar ro'yxati; yangi «Telegram» bo'limi (ulanish, xabar, chegara, o'chirish, sanoq); «Darslar va teglar» jadvaliga `m13-dars-08-done`.
5. ⛔ Muhrdan oldin («qur» darvozasi): Render'da `setWebhook` (uxlagan xizmat uyg'onganda ham) · haqiqiy Telegram'da «Start» → ulanish va bot javobi (Android va iPhone, Expo Go va brauzer ko'rinishi) · tekshiruv o'yinlari bilan ikki xabar va chegara · o'chirish · `telegramdan-ochdi` brauzer ko'rinishida ·
   uxlagan Backend'ga kelgan Telegram so'rovi qayta yuborilganda bitta ulanish va bitta javob · uch blokning vaqti (taymer). Natija boshqacha chiqsa — MD haqiqiy natijaga moslanadi. Yangi APK bu darsda yo'q (M-q5 A); Mentor tekshiruv yozuvlari muhrdan oldin `id` bo'yicha o'chiriladi.

## Manbalar (o'zim tekshirdim yoki tayanch 6 orqali, 07.10.2026; o'quvchiga ko'rinmaydi)
1. Telegram — `core.telegram.org/bots/features` (o'zim, 07.10.2026), «Deep linking»: «https://t.me/your_bot?start=airplane» → bot «/start airplane» oladi · «A-Z, a-z, 0-9, _ and - are allowed. … The parameter can be up to 64 characters long.» ·
   hujjatda hisoblarni ulash misoli bor (account connection). «BotFather»: `/newbot` — yangi bot; `/token` — yangi token (7-Modulda `/revoke` o'tilgan — darsda buyruq nomi aytilmaydi, «@BotFather'da yangisini oling»). → A1 1-qadam, 2-ekran.
2. Telegram — `core.telegram.org/bots/api` (o'zim, 07.10.2026): `setWebhook` `secret_token` — «1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed», sarlavha `X-Telegram-Bot-Api-Secret-Token` · unsuccessful (2XY bo'lmagan) so'rovda «we will repeat the request and give up after a reasonable amount of attempts» ·
   «You will not be able to receive updates using getUpdates for as long as an outgoing webhook is set up.» · `sendMessage` — `chat_id`, `text` · Chat `id` — «at most 52 significant bits … a signed 64-bit integer or double-precision float type are safe». → A1 talabi, REPO 1, O'qituvchi eslatmasi.
3. Telegram — tayanch 6 (`core.telegram.org/bots`, 07.10.2026): «Bots can't start conversations with users. A user must either add them to a group or send them a message first.» · `core.telegram.org/bots/faq` (o'zim, 07.10.2026): bitta chatga sekundiga bittadan ko'p emas; guruhga daqiqasiga 20; ommaviy — sekundiga ≈30.
   FAQ da botni bloklagan foydalanuvchi haqida gap **yo'q** (Shubhali 5). → 2-ekran, A2 talabi, arena 2.
4. 7-Modul YAKUNIY (`feedback/F-0928-QA-5modul/YAKUNIY/`): `01-BotIntro.md` 6-ekran (token — `.env`), 11-ekran (webhook ta'rifi), 16-ekran (`/newbot`, foydalanuvchi nomi «bot» bilan tugaydi) · `07-BotFullProject.md` (`BOT_TOKEN` Render Environment'da, `setWebhook(WEBHOOK_URL + '/telegram')`, `RENDER_EXTERNAL_URL`, «bitta token ikki joyda ishlamaydi»). → A-bo'lim 3, A1.
5. Expo — `docs.expo.dev/linking/android-app-links/` (o'zim, 07.10.2026; sahifa sanasi 25.09.2026): https havola o'rnatilgan ilovani ochishi uchun ilova sozlamasida `intentFilters` (`autoVerify`) va saytda `assetlinks.json` (ikki tomonlama tasdiq) kerak. → A-bo'lim 4, A3 O'qituvchi eslatmasi (havola brauzer ko'rinishini ochadi).
6. 12-Modul tayanchi (grep, 07.10): 1.4 va 1.9 (eslatma, halol chegara), 1.7 (maxfiylik to'rt savoli, «Hisobni o'chirish»), 1.8 (sanoq sahifasi), 1.13 (61 · 26 · 43%), 9.28 (brauzer ko'rinishi buyruqlari), 9.35 a, 9.39 b, 9.41 b, h, i (tekshiruv akkaunti, «Davom et», haftalik chegara, «uyda» yo'q, tekshiruv yozuvlari). → A-bo'lim 3, bloklar.
7. 11-Modul tayanchi (grep, 07.10): `ishtirokchilar.holat` — `qoshildi` / `keladi` / `navbatda` / `chiqdi`; `qoshilgan` — `qoshildi` yoki `keladi` (9.86); e'lon formasi — kun · soat · maydon · nechta odam (qo'shilganlar maydoni yo'q — yangi o'yin noldan boshlanadi; tashkilotchi o'zi qo'shiladimi — tayanchda yo'q, «qur»da ko'riladi) → TAYANCHGA SAVOL 1, 12.
8. Pilot `03-PaymentWebhook-v3.md` (07.10): maxfiy kalit odati (`.env` + Render Environment, `git grep` — faqat nom), hisob raqamini Neon'da topish, «takror xabar», REPO 3 dagi `RENDER_EXTERNAL_URL`. → A1.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ✅ (F-1007-466 — **B**: son olib tashlandi; tayanch 1.8, 9.38) **Xabardagi son: tayanch 1.8 «— 3 / 10», MD da «— 0 / 10».** Tayanch: xabar «Doimiy o'yin» keyingi haftaga e'lon qilinganda ketadi (1.8; 1.12 da ham «yana e'lon qilindi va Telegram xabari ketdi»), keyingi o'yin `GET /oyinlar` da yaratiladi (1.4).
   Yangi yaratilgan o'yinda hali hech kim qo'shilmagan — xabar ketgan paytda son **0** (11-Modul e'lon formasida qo'shilganlar maydoni yo'q). «3 / 10» faqat xabar keyinroq ketsa chiqadi — bu esa tayanchdagi vaqtga ham, «Backend uxlaydi — vaqtga bog'langan ish yo'q» qaroriga (1.4) ham zid.
   MD qarori: matn tayanch so'zi bilan, son — xabar yuborilgan paytdagi «qo'shilganlar / kerak» (2, 5-ekran, 2-amaliyot: «— 0 / 10»). Variantlar: **(A)** MD dagidek — tavsiya · **(B)** sonni olib tashlash: «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» (Telegram xabari keyin o'zgarmaydi, son esa eskiradi) ·
   **(C)** «3 / 10» qoladi — xabar yaratilgandan keyin, kechiktirib yuboriladi (yangi mexanizm, sinfda tekshirib bo'lmaydi). Javobga qarab 2, 5-ekran, `TG_XABAR`, 2-amaliyot kutilgan natijasi va arena 8 yangilanadi.
2. **Hook** — maket: Mentor telefonidagi besh javob ro'yxati («1-o'yinchi»…«5-o'yinchi», ismsiz) va hisoblagich 61 · 26 · 35 (qurilma); variantlar «Ilova ularga yoqmay qoldi» · ✔ «Yangi o'yin chiqqanini bilmadi» · «Telefonda joy qolmadi»; javoblar matni — tayanch 1.8 dan, bosh harf bilan.
3. **Sahna** — «telefon · Backend · Telegram» (12-Modul ikki telefonli sahnasi o'rnida; ikkinchi telefon kerak emas); sahna tugmasi «Shanba o'tdi» (vaqt o'tadi va kimdir ilovani ochadi); telefonning uch ko'rinishi (qulf · ilova · Telegram chati).
4. ✅ (07.10 qabul — tayanch 1.8, 9.39: faqat yangi bot) **Bot — yangi bot** (tayanch: «7-Moduldagi bot yoki yangisi»): 7-Modul boti tokeni o'quvchining 7-Modul Backend'ida webhook bilan ishlaydi; uni bu Backend'ga ulasa, eski bot to'xtaydi («bitta token ikki joyda ishlamaydi» — 7-Modul). MD faqat yangi botni aytadi; eski bot kerak bo'lmasa uni ham ishlatish mumkin — O'qituvchi bilsa yetadi.
5. **Bir martalik kod** — 16 belgi (harf va raqam), 10 daqiqa, bir marta; ustunlar `telegram_kod`, `telegram_kod_gacha`; yo'l `POST /telegram/kod`; havola `https://t.me/{botning foydalanuvchi nomi}?start={kod}`; bot nomi — `getMe` (yangi `.env` o'zgaruvchisi qo'shilmasin deb; tayanch 3 dagi ro'yxat o'zgarmaydi).
6. **Webhook o'rnatish** — Backend ishga tushganda, ochiq manzil (`RENDER_EXTERNAL_URL`) bo'lsa; yo'l `POST /telegram/webhook` (7-Modulda `/telegram` edi — mahsulot Backend'ida boshqa yo'llar bilan to'qnashmasin deb); laptopda o'rnatilmaydi.
7. **Faqat shaxsiy chat** (`chat.type = 'private'`) — guruhga qo'shilgan bot guruhga yozib qolmasin; **takror so'rov** (`update_id`) qayta ishlanmaydi — 3-darsdagi «takror xabar» shu yerda ham; Telegram'ga `200` (`401` dan tashqari).
8. **Bot javoblarining uch matni** (olam ichidagi matn, T-008): «Ulandi. Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa, shu yerga yozaman. O'chirish — ilovada.» · «Havola eskirgan. Ilovada «Telegram'da xabar olish»ni qayta bosing.» · «Bu bot ilovadan ulanadi: ilovada «Telegram'da xabar olish»ni bosing.»
9. **Tugma joyi va matni** — «Hisobdan chiqish» yonidagi sozlama qatori (12-Modul «Eslatmalar» o'chirgichi yonida); ostida «Siz qatnashgan «Doimiy o'yin» yana e'lon qilinsa — Telegram'da xabar; haftasiga ko'pi bilan ikkita» (ochiq aytish — 10-Modul); holat yozuvi «Telegram ulangan»; `GET /men` ga `telegram: boolean` (chat raqami ilovaga bormaydi).
10. **5-ekrandagi to'rt o'yinchi** — mashq kartasi (Mentor sanog'i emas; tayanchda Telegram'ni ulaganlar soni yo'q): 1 — yuboriladi, 2 — ulanmagan, 3 — bu hafta 2 / 2, 4 — qatnashmagan; javob «bittasiga».
11. **Haftalik chegara faqat Telegram xabarlari uchun** — Backend `telegram_xabarlar` dan sanaydi; ilova eslatmalari telefonda, o'z chegarasi bilan (12-Modul) — bitta sanoqqa qo'shilmaydi. Natijada bir odam bir haftada ilovadan ham, Telegram'dan ham xabar olishi mumkin. Hafta — dushanba–yakshanba (12-Modul 9.41 b).
12. **Kimga** — oldingi haftadagi o'yinning `qoshildi` / `keladi` qatnashchilari (navbatdagilar va chiqqanlar — yo'q); tashkilotchi — faqat o'zi qatnashgan bo'lsa. Bitta o'yin haqida bitta odamga bir marta — UNIQUE (`oyinchi_id`, `oyin_id`).
13. **O'chirish** — so'rov oynasisiz, bir bosishda; chat raqami va kutayotgan bir martalik kod bo'shatiladi; «Hisobni o'chirish» — `telegram_xabarlar` qatorlari ham. O'chirgandan keyin bot «o'chirildi» deb yozmaydi (ortiqcha xabar).
14. **Siyosat qatori** (Mentor; `lending/maxfiylik.html`, «Qaysi ma'lumot?», «Nima uchun?» va «Qancha saqlanadi?» — F-1007-466): «Telegram'da xabar olishni yoqsangiz — Telegram chat raqamingiz va qaysi o'yin haqida xabar yuborilgani saqlanadi: siz qatnashgan «Doimiy o'yin» yana e'lon qilinganini yozish va haftasiga ikkitadan oshirmaslik uchun. Ismingiz va Telegram nomingiz saqlanmaydi. «Telegram xabarlarini o'chirish»ni bossangiz, chat raqami o'chiriladi; qaysi o'yin haqida xabar yuborilgani yozuvi hisobingiz o'chirilguncha qoladi.»
15. **Talab zinapoyasi** — A1: tayyor talab + 3 joy · A2: + 4 joy · A3: + 3 joy (12-Modul 9-darsida uchala blokda uch qator o'quvchidan edi; bu yerda texnik qism — maxfiy kalit, kod, takror so'rov — o'quvchi yoza olmaydigan darajada, shuning uchun tayyor).
16. **Havola** — mobil trekda ilovaning brauzer ko'rinishi `?kanal=telegram` (APK havoladan ochilmaydi — Manbalar 5), web-trekda sayt; `telegramdan-ochdi` brauzer ko'rinishida yoziladi; mobil trekda 3-amaliyotda brauzer ko'rinishi qayta chiqariladi (12-Modul 9.28). Tayanch «ilova ochilsa» — MD da «havola bilan ochilganda».
17. **Sanoq sahifasi qatori nomi** — «Telegram'dan ochdi» (12-Modul «eslatmadan ochdi» naqshi).
18. **2-amaliyot tekshiruvi** — agent tayyorlaydigan uchta tekshiruv o'yini (Mentor: o'tgan haftadagi Shanba, 15:00 · 16:00 · 17:00, Mahalla maydoni, kerak 10; tekshiruv tashkilotchisi `namuna = true`); kutilgan natija — 15:00 va 16:00 haqida xabar, 17:00 — yo'q;
    keyin tekshiruv akkauntlari, o'yinlar, qo'shilish yozuvlari va `telegram_xabarlar` qatorlari `id` bo'yicha, ro'yxat va «Davom et» bilan o'chiriladi.
19. **Xabar matni qoidasi** («bu kursda»): faqat o'zgarish — kun, soat, joy, son; bosim, qo'rqitish va to'lov taklifi yo'q (12-Modul 9-darsi qoidasi + TAQIQLAR 1).
20. **Nishonlar:** Start First · Still Reaches · Weekly Two · Easy Off (grep 0).
21. **Yakun sarlavhalari** — besh holat (uchala «Kutilganidek» · «Boshqacha» bor · 1–2 · faqat 1 · boshqa; F-1007-466).
22. **«Davom etish»** — A1 faqat 4-qadamdan keyin (A2 tekshiruvi ulanishga tayanadi; 12-Modul 9.41 i), A2 — 3-qadamdan keyin (A3 sanoq tekshiruvining zaxira yo'li bor), A3 — 4-qadamdan keyin.
23. ✅ **Telegram akkaunti yo'q o'quvchi** (F-1007-466) — sherigining Telegram'ida, faqat `namuna = true` tekshiruv hisobi orqali; sherik chati o'quvchining o'z hisobiga hech qachon ulanmaydi; 3-amaliyot oxirida ulanish va tekshiruv hisobi `id` bo'yicha o'chiriladi (tayanch 9.40 «sherigining Telegram'ida» shu ma'noda).
24. **Maketdagi namunalar** — bot nomi `…_bot`, kod `k7Q…` (qisqartirilgan; haqiqiy botga mos kelib qolmasin); Mentor hisobi `id 7` (tayanch 9.1).
25. **1-ekran** — sarlavha «Bugun mahsulotingiz Telegram orqali xabar yuboradi.» va uch qator; Mentor gapi — App.jsx `sub` ga tayanadi, «ko'proq uchradi» shaklida (F-1007-466).
26. **2-savol** — F-1007-466: «Telegram xabari kelishi uchun telefonda ilova turishi shartmi?» (avvalgi «o'yini yana e'lon qilinsa-chi?» — chegara va to'xtatilgan botsiz B yagona emas edi).

## Shubhali joylar (ishonchim komil emas)
1. ✅ **Xabardagi son** — olib tashlandi (F-1007-466; TAYANCHGA SAVOL 1).
2. ⛔ **Uxlagan Render va Telegram so'rovi** — rasmiy hujjatda Telegram qancha kutishi va necha marta qayta yuborishi aniq emas («a reasonable amount of attempts»); bot javobi bir daqiqagacha kechikishi va takror so'rov ikki marta ishlanmasligi — Mentor repo'sida «qur» da sinaladi.
3. ⛔ **`setWebhook` Backend ishga tushganda** — mahsulot Backend'i (NestJS) Telegraf'siz bo'lishi mumkin; `RENDER_EXTERNAL_URL` va so'rov yuborish usuli — agentning tanloviga qoladi; Render'da sinalmagan.
4. **«Start» tugmasining yozuvi** — tayanch 1.8 so'zi; Telegram interfeysi tiliga qarab boshqacha yozilishi mumkin (o'zbekcha interfeysda — tekshirilmagan). Havolani ikkinchi marta ochganda Telegram «Start»ni yana ko'rsatadimi — tekshirilmagan; shuning uchun 1-amaliyot tekshiruvida havolani qayta ochish yo'q.
5. **Botni bloklagan odamga yuborish** — Telegram qaytaradigan javob rasmiy sahifalarda topilmadi (tayanch 6 «tekshirilmagan»); talab umumiy («xato bilan to'xtama, keyingisiga o't»); bunday odamning chat raqamini o'chirish kerakmi — qaror yo'q.
6. ✅ **Hafta va vaqt mintaqasi** — F-1007-466: talabda `Asia/Tashkent` (tayanch 9.40; 4, 10-darslar bilan bir).
7. ✅ **Xabar va `GET /oyinlar` javobi** — F-1007-466: xabarlar yuborilgach javob qaytadi; javob biroz kechikadi — «qur» da o'lchanadi.
8. **Expo Go'da `t.me` havolasi** Telegram ilovasini ochishi va brauzer ko'rinishida (iPhone) `Linking.openURL` — sinalmagan; web-trekda yangi oynada Telegram Web yoki ilova ochiladi.
9. **Brauzer ko'rinishida `kanal=telegram`** — Expo web eksportida manzil parametri o'qilishi (12-Modul 9.39 k darvozasi bilan bir) — sinalmagan.
10. **Agent vaqti o'tgan «Doimiy o'yin» yarata olishi** va 4-dars mantig'i ulardan keyingi haftani yaratishi; tekshiruv tashkilotchisining Pro holati — Mentor repo'sida «qur» da. F-1007-466: Pro tugagan tashkilotchining keyingi o'yini 5-darsdan yaratilmaydi (9.26; ⛔ 7-dars pilotida ilovada tekshiriladi); 12-darsning topilmasi — takror yaratilish (M-q4 A): bir vaqtdagi ikki ochilishda ikki o'yin va ikki xabar.
11. **Yangi o'yinda son 0** — 11-Modul formasidan kelib chiqadi; tashkilotchi o'z o'yiniga avtomatik qo'shiladimi — tayanchda yo'q (bo'lsa, son 1 bo'ladi) — «qur» da.
12. ⛔ **90 daqiqa** — uch blokda uch Render kutishi, 1-amaliyot og'ir (yangi bot, ikki maxfiy qiymat). ChatGPT bahosi — 150–200 daqiqa (o'lchanmagan; F-1007-466); APK bu darsdan olib tashlandi (M-q5 A). Botni darsdan oldin ochib kelish — foydalanuvchi qarori. Sig'masa — 2-amaliyot tekshiruvi dars oxiriga, siyosat qatori 3-amaliyot oxiriga (Ulgurmasangiz); pilotda taymer.
13. **Neon so'rovi `IS NOT NULL`** — o'quvchi chat raqamini ko'rmaydi; agent tekshiruvda `SELECT *` qilib chat raqamini chatga chiqarishi mumkin — promptlarda «chat raqami logga yozilmasin» bor, agent javobi uchun alohida taqiq yo'q.
14. **Telegram yo'q o'quvchi va sherik** — TAYANCHGA SAVOL 23.
15. ✅ **2-savol** — F-1007-466: savol «ilova shartmi?» ga o'zgardi — B shartlarsiz rost.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔ pilot taymeri; A-bo'lim 10; har blokda «Ulgurmasangiz»; Render kutishi paytida ish (uchala blok 3-qadami — kodni ko'rsatadigan prompt); o'rnatish fayli navbati kutilmaydi, «uyda» yo'q; «sig'adi» deyilmagan (Shubhali 12).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Shubhali 2, 3, 12 ⛔; Telegram faktlari — tayanch 6 va Manbalar 1–3 (iqtibos, sana); `/newbot` — 7-Modul va rasmiy sahifa; Render, Netlify, Neon, BotFather menyu nomlari taxmin qilinmagan (Environment bo'limi — oldingi modullar so'zi);
   «Start» yozuvi, havolani qayta ochish, bloklangan bot javobi, vaqt mintaqasi — Shubhali 4–6; kutish vaqtlari «bir daqiqagacha», «bir necha daqiqa cho'zilishi mumkin» (12-Modul 9.19).
3. [x] **Saqlash kaliti — shartnoma** — yangi kalit yozilmaydi (tayanch 8); o'qiydi faqat `pm-m9d8-platforma.trek`; blok holati va «Fayl navbatda» tanlovi — dars holatida (`ccProgress`); chat raqami, ism, login hech bir kalitga yozilmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (0, 4, 5, 7-ekran, testlar, bloklar «Ochish»), «Bu misolda» (2-ekran xulosa), «Bu kursda» (5-ekran xulosa va QIzoh, «Endi siz bilasiz» 4, A2 «Ochish»); har blok «Ochish»ida mahsulotda mos qism bo'lmasa nima qilish yozilgan («Doimiy o'yin» yo'q bo'lsa — A2).
5. [x] **Kafolat va sabab da'vosi yo'q** — «bot javobi chiqishi kerak … kechikishi mumkin», «odatda o'zi yangilaydi»; agentning «tayyor» degani — da'vo (A1 QIzoh, ✎); «xabar qaytardi» yo'q — `telegramdan-ochdi` havola bosilganini sanaydi (A3 «Ochish», kartochka 10, «Endi siz bilasiz» 5);
   «5 kishi — kichik son: sabab haqida dalil, isbot emas» (0-ekran, kartochka 1) — nimaning isboti emasligi aytilgan; «Tuzatish qilindi» bu darsda kerak emas (buzish yo'q); kafolat so'zlari o'quvchi matnida 0 (O'lchov — grep).
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — 11-ekran to'rt sarlavha, har biri rost («boshqa holat» — «hali tugamagan»); ✓ yorliq faqat A3 bajarilganda; blok bayrog'i faqat 4-qadamdan; yashil qatorlar o'quvchi ko'rgan natijani aytadi; Weekly Two, Easy Off tavsifi — qilingan ish.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — haftalik chegara: «bir odamga, dushanbadan yakshanbagacha, Telegram xabari» — Backend `telegram_xabarlar` dan sanaydi; sanoq — turli qurilmalar; 61 · 26 · 35 — qurilma, 5 · 3 · 1 · 1 — odam (alohida yorliq, ayirilmaydi); «eng» so'zli ta'rif yo'q.
8. [x] **Test: bitta himoyalanadigan javob** — 1-savol: guruh varianti ataylab yo'q (rasmiy gapda guruh bor); 2-savol: B haqiqatda ham rost (Shubhali 15 chegarasi), C va D 12-Modul qarorlari bilan noto'g'ri; distraktorlar uch turkumdan (4, 7-ekran ✎); arena 12 «Mentor misolida» bilan (Backend yuboradigan eslatma haqiqatda bor);
   uzunlik ±15% (O'lchov); ✔ yolg'iz eng uzun emas; «Farqi yo'q» tipidagi variant yo'q.
9. [x] **Real odamlar xavfsizligi** — bot faqat o'zi «Start»ni bosgan odamga (2-ekran, A1); o'chirish bir bosishda (5-ekran, A3); haftasiga ≤2 (5-ekran, A2); faqat shaxsiy chat (A1 talabi); chat raqami va Telegram nomi hech qayerda ko'rinmaydi (maketlar, Neon `IS NOT NULL`, promptlar, kalit, log);
   Telegram yosh chegarasi aytilmaydi; Telegram yo'q o'quvchi yangi akkaunt ochmaydi; bugun real odamlarga yozilmaydi (Mentorning besh o'yinchisi — Mentor misoli, ruxsat bilan); xabarda bosim va to'lov taklifi yo'q; spam (bir xabarni ko'p odamga ketma-ket) — chegara va «bir narsa haqida bir marta».
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bot javobi, Telegram xabari, o'chirish, sanoq — o'quvchi o'z telefonida, Telegram'ida va Neon'da ko'radi; agent faqat vaqti o'tgan tekshiruv o'yinlarini tayyorlaydi va `id` bo'yicha o'chiradi (ro'yxat → «Davom et»); `telegramdan-ochdi` tekshiruv yozuvi — `SELECT` o'quvchida, o'chirish agentda.
11. [x] **Web-trek teng yo'l** — bot va Backend trekka bog'liq emas (A-bo'lim 8); har blokda web gapi: tugma saytda, havola sayt manzili, `kanal=telegram` saytda o'qiladi; kutilgan natijada brauzer oynasi; yakun sarlavhalari ikkala trekka to'g'ri; APK va brauzer ko'rinishi qadamlari — faqat mobil trekda.
12. [x] **Mentor misoli ichki izchil** — sonlar tayanch 1.8, 1.13 aynan; «Doimiy o'yin» va keyingi o'yin yaratilishi — tayanch 1.4; xabar matni tayanch so'zi bilan, son — yuborilgan paytdagi (ziddiyat ochiq — TAYANCHGA SAVOL 1); yangi tafsilotlar — TAYANCHGA SAVOL 2–26;
   9-darsning sonlari (tasdiqlar) va 10, 12-darsning topilmalari ochilmagan (12-darsdagi Pro tekshiruvi — faqat Shubhali 10 va REPO 2 da, o'quvchiga aytilmaydi).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — A1: tugma joyi va `{xabar sababi}`; A2: qaysi o'zgarish, kimga, matn, havola; A3: tugma joyi, havolani ochadigan qism, siyosat qatori — hammasi `{…}` da; qaytarib bo'lmaydigan o'zgarish (tekshiruv yozuvlarini o'chirish) — ro'yxat va «Davom et».
14. [—] **Uyga vazifa yengil va aniq** — loyiha kuni, uyga vazifa yo'q (tayanch 4); ulgurmagan ish — yakun sarlavhasida, o'rnatish fayli — keyingi dars boshida («uyda» yo'q).
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …»; «sizda emas», «xatongiz emas» — 0.
16. [x] **Kelajak va'dasi yo'q** — tugma ostidagi matn va siyosat qatori faqat hozir ishlaydigan narsani aytadi; 13-Modulning keyingi darslari, 14-Modul tilga olinmaydi; kelajak — faqat yakundagi «Keyingi dars» qatori; o'rnatish fayli — «keyingi dars boshida» (ish rejasi, va'da emas).
+ **12-Modul tayanchi 7 (11-Modul sinflari)** — holatga qarab yakun [x] · da'vo isbot emas [x] · maxfiy qiymat agentga va ochiq joyga chiqmaydi [x] (A1 1, 4-qadam; har blok xato yo'li; `git grep`; arena 5, kartochka 11) · tashqi xizmat haqida faqat rasmiy hujjat [x] (Manbalar 1–5) ·
  har sonning manbasi [x] (A-bo'lim 6) · tayanchda yo'q narsa to'qilmagan [x] (TAYANCHGA SAVOL 1–26) · saqlash kaliti o'qiydigan darsdan [x] · test: bitta javob [x] · keys [—] (keyssiz, Qaror-0 21) · 90 daqiqa [x] ·
  bir ma'no — bir so'z [x] («Telegram xabari» / «eslatma»; «bir martalik kod» doim to'liq; «hodisa» yo'q; «Ulangan» yolg'iz yo'q — A-bo'lim 5) · web-trek [x] · agent va o'quvchi ishi ajratilgan [x] · o'smir xavfsizligi [x].
+ **13-Modulga xos (pul):** real pul yo'q [x] (bu darsda to'lov yo'q; tepada qayd) · karta ma'lumoti hech qayerda [—] (bu darsda to'lov sahifasi va karta yo'q) · «mashq to'lov» Payme/Click ko'rinishini taqlid qilmaydi [—] (mashq to'lov ishlatilmaydi) ·
  «test rejim» belgisi har to'lov ekranida [—] (to'lov ekrani yo'q) · narx — «Mentorning taxmini» [—] (narx aytilmaydi) · suhbat va tasdiqda bosim yo'q [x] (Telegram xabarida bosim va to'lov taklifi yo'q — 5-ekran QIzoh, A2 talabi, arena 8) · oferta — shablon [—] (7-dars).

## O'lchov (scratchpad `md08/olchov.py`, 07.10.2026; yakuniy fayl bo'yicha)
Belgilar — oddiy `len` (`**` va ✔ siz). `!!!` — chegaradan oshgan joy: yakuniy yurishda **0** (oldingi yurishlarda topilganlari tuzatildi: 1 QIzoh 111 belgi · 1-savolda va arenaning 9 savolida to'g'ri variant yolg'iz eng uzun edi · arena 5 da ±20% — distraktorlar uzaytirildi; 8 sarlavhaning qavsdagi soni skript bilan tenglashtirildi).
Ballik testlar ±15%, arena ±20% (o'rtachadan). Mentor gaplari — «…» ichidagi nuqta sanalmaydi; interaktiv ekranlarda bitta gap. Kafolat va taqiq so'zlari — KOD bo'limidan oldingi butun matnda (o'quvchi matni + MD izohlari).

```
## Sarlavhalar (≤55)
   44     O'yinchilar ilovani nega yana ochmay qo'ydi?
   51     Bugun mahsulotingiz Telegram orqali xabar yuboradi.
   50     Ilova yopiq bo'lsa, yangi o'yin haqida kim yozadi?
   52     Foydalanuvchi Telegram'ni kodli havola bilan ulasin.
   48     O'yin yana e'lon qilindi — Backend kimga yozadi?
   43     Haqiqiy o'zgarishda Telegram xabari ketsin.
   49     Xabar bir bosishda o'chsin, ochilishlar sanalsin.
   25     O'zingizni sinab ko'ring.
   50     Telegram xabari ishlaydi, o'chiriladi va sanaladi.
   52     Telegram xabari ishlaydi — o'chirish va sanoq qoldi.
   48     Bot ulandi — Telegram xabari va o'chirish qoldi.
   52     Telegram xabari hali tugamagan — bloklarni bajaring.
## Xulosalar (≤110)
   90     Bu misolda yangi o'yinni Backend biladi; bot esa faqat «Start»ni bosgan odamga yoza oladi.
  107     Bu kursda xabar o'z o'yini qayta e'lon qilingan, botni ulagan odamga ketadi — haftasiga ko'pi bilan ikkita.
## Hook javoblari (≤120)
   91     Aynan! Beshtadan uchtasi shunday dedi: ilova yopiq turganda yangi o'yin haqida bilishmagan.
  102     Qiziq fikr! Bu misolda hech kim bunday demadi. Lekin besh kishi kichik son — boshqalar aytishi mumkin.
   97     Qiziq fikr! Bittasi shunday dedi va ilovani o'chirgan. Ko'pi esa yangi o'yin chiqqanini bilmagan.
## To'g'ri izohlar
   57     Chat raqami faqat o'yinchi botni o'zi boshlaganda keladi.
   54     Telegram xabari ilovaga emas, Telegram chatiga keladi.
## Xato izohlari va qizil qatorlar (≤60)
   54     A: Ro'yxatda Telegram so'ralmaydi — chat qayerdan keladi?
   59     B: Mentor ilovasi telefon so'ramaydi, bot ham odam qidirmaydi.
   54     D: E'lon — tashkilotchining ishi. O'yinchi botga yozdimi?
   49     QXato: Botni boshlamagan — bot unga birinchi yozolmaydi.
   45     QXato: Bu hafta ikkita xabar oldi — uchinchisi yo'q.
   52     QXato: Shu o'yinda qatnashmagan — xabar unga tegishli emas.
   55     A: Xabar Telegram chatiga keladi — ilova bu yerda kerakmi?
   55     C: Backend Telegram'ga yozadi — ilovaga so'rov shart emas.
   50     D: Mentor ilovasi telefon raqamini umuman so'ramaydi.
## Yashil, joriy, QIzoh qatorlari (≤110)
   85     joriy: Yangi o'yin kimdir ilovani ochganda yaratiladi: hech kim ochmasa, xabar ham ketmaydi.
   78     QIzoh: Ulanishda faqat chat raqami saqlanadi: ism ham, Telegram nomi ham saqlanmaydi.
   88     yashil: Bot faqat «Start»ni bosgan foydalanuvchini taniydi; Backend'da faqat chat raqami turadi.
   83     QIzoh: Kodni agent yozdi — Telegram xabari ishlashini 2-amaliyotdagi tekshiruv ko'rsatadi.
   62     joriy: O'chirish bir bosishda: chat raqami o'chadi va xabar ketmaydi.
  97     QIzoh: Bu kursda xabar matnida faqat o'zgarish bor: kun, soat, joy — bosim ham, to'lov taklifi ham yo'q.
   82     yashil: Telegram xabari faqat tegishli, botni ulagan odamga ketdi; uchinchisi yuborilmadi.
   87     QIzoh: Xabarni Backend yubordi: o'yinchining ilovasi yopiq bo'lsa ham, yangi o'yinni u biladi.
   73     yashil: O'chirish bir bosishda ishlaydi; Telegram xabaridan ochilganlar sanaladi.
  106     QIzoh: APK o'zi yangilanmaydi: o'rnatilgan faylda Telegram tugmasi yo'q — bugun Expo Go va brauzerda tekshirasiz.
## Reja qatorlari
   34     Ulanish: odam botni o'zi boshlaydi
   39     Xabar: o'z o'yini yana e'lon qilinganda
   41     O'chirish bir bosishda, ochilish sanaladi
## Mentor gaplari (gap soni · belgi)
  1 gap · 98  Mentor ilovani ochmay qo'ygan beshta tanishidan sababini so'radi — avval o'zingiz javobni tanlang.
  1 gap ·  80  Bugun eng ko'p aytilgan sababga bitta mexanika qurasiz — «Davom etish»ni bosing.
  1 gap · 105  Besh javobda bitta sabab ko'proq uchradi — bugun shunga bitta mexanika qurasiz, namuna «Yordam»da turadi.
  1 gap ·  78  Avval taxminingizni belgilang, keyin Backend ostidagi «Shanba o'tdi»ni bosing.
  1 gap ·  60  Endi telefondagi ilovada «Telegram'da xabar olish»ni bosing.
  1 gap ·  34  Telegram chatida «Start»ni bosing.
  1 gap ·  44  Endi «Shanba o'tdi»ni yana bir marta bosing.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap ·  89  Talab tayyor — uchta joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
  1 gap ·  67  Mentor misolida to'rt o'yinchi bor — avval taxminingizni belgilang.
  1 gap ·  67  Har kartada «Tekshirish»ni bosing va o'ngdagi uch katakni kuzating.
  1 gap ·  68  Endi 1-o'yinchi kartasida «Telegram xabarlarini o'chirish»ni bosing.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap · 107  Qaysi o'zgarish haqida kimga yozishni o'zingiz tanlaysiz, namuna «Yordam» ortida; «1 · Ochish»dan boshlang.
  1 gap ·  91  Foydalanuvchi Telegram xabaridan bir bosishda chiqa olishi kerak; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  Mentor misolida Backend o'yinchining Telegram chatini qachon biladi? · 8 so'z · [39, 43, 42, 38] · eng uzun 43 / eng qisqa 38 · ✔C · OK
      A   39  O'yinchi «Ro'yxatdan o'tish»ni bosganda
      B   43  Bot telefon raqami orqali uni o'zi topganda
      C✔  42  O'yinchi kodli havolada «Start»ni bosganda
      D   38  Tashkilotchi «E'lon berish»ni bosganda
  Mentor misolida Telegram xabari kelishi uchun telefonda ilova turishi shartmi? · 10 so'z · [40, 39, 42, 38] · eng uzun 42 / eng qisqa 38 · ✔B · OK
      A   40  Ha — Telegram xabari ilova orqali keladi
      B✔  39  Yo'q — xabarni Telegram'dagi bot yozadi
      C   42  Ha — Backend avval ilovaga so'rov yuboradi
      D   38  Yo'q — Backend uni SMS bo'lib yuboradi
## Arena (12) — ✔ o'rni va variant uzunliklari (±20%)
   1. ✔A · 8 so'z · [33, 28, 30, 36] · OK  Mentor misolida yana ochmagan beshtadan ko'pi nima dedi?
   2. ✔B · 6 so'z · [38, 38, 35, 40] · OK  Bot odamga birinchi bo'lib yoza oladimi?
   3. ✔C · 8 so'z · [45, 36, 43, 36] · OK  Ulanish havolasidagi bir martalik kod nima uchun kerak?
   4. ✔D · 8 so'z · [24, 23, 28, 27] · OK  Telegram so'rovi kelganda Mentor Backend'i avval nimani tekshiradi?
   5. ✔A · 4 so'z · [39, 42, 41, 38] · OK  Bot tokeni qayerda turadi?
   6. ✔B · 5 so'z · [32, 36, 37, 31] · OK  Ulanganda Backend Telegram'dan nimani saqlaydi?
   7. ✔C · 8 so'z · [32, 30, 28, 30] · OK  Shu hafta o'yinchiga ikkita Telegram xabari ketdi. Uchinchisi-chi?
   8. ✔D · 6 so'z · [44, 34, 37, 41] · OK  Qaysi Telegram xabari darsdagi qoidaga mos?
   9. ✔A · 6 so'z · [36, 28, 39, 31] · OK  «Telegram xabarlarini o'chirish» bosilsa, nima bo'ladi?
  10. ✔B · 5 so'z · [28, 33, 28, 38] · OK  Mentor misolida `telegramdan-ochdi` qachon yoziladi?
  11. ✔C · 7 so'z · [33, 31, 38, 41] · OK  Sinfdagi tekshiruv o'yinlari va yozuvlari nima bo'ladi?
  12. ✔D · 8 so'z · [46, 47, 53, 49] · OK  Mentor misolida Telegram xabari bilan eslatmaning farqi nima?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Kafolat so'zlari (o'quvchi matni, KOD dan oldin)
  'har doim': 0 []
  'hech qachon': 0 []
  'darhol': 0 []
  'darrov': 0 []
  'albatta': 0 []
  '100%': 0 []
  'bir zumda': 0 []
  'kafolat': 0 []
  TAQIQLAR 5 taqiq so'zlari (8 ta — kantselyarit va lint ro'yxati; skriptda): 0 []
## Ekranlar
  12 ekran: 0 · Kirish — ilovani yana ochmagan o'yinchilar  ← QKirish | 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari) | 2 · Bot kimga yoza oladi?  ← QTushuncha (bashorat + 4 harakat) | 3 · Amaliyot 1 — bot va ulanish  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈24 daq) | 4 · 1-savol ✔ (jonli ball)  ← QTest | 5 · Backend kimga yozadi?  ← QTushuncha (bashorat + 5 harakat, bittadan) | 6 · Amaliyot 2 — Telegram xabari va haftalik chegara  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈19 daq) | 7 · 2-savol ✔ (jonli ball)  ← QTest | 8 · Amaliyot 3 — o'chirish, sanoq va siyosat  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈17 daq) | 9 · Natijalar (podium) — umumiy shablon | 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16) | 11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50)
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi — `00-NOMLAR.md` va App.jsx `id: '11'` bloki bilan mos (205): `m11-07` «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» → **`m11-08` «Loyiha kuni: ketayotgan foydalanuvchini qaytarish»** (osti «nega ketishadi va bitta qaytarish mexanikasi» — 1-ekran Mentori) →
  `m11-09` «Kim haqiqatan to'lashga tayyor?» (yakundagi «Keyingi dars» shu nom va osti). `comp` — «qur» da.
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`); metafora yo'q; keyssiz; bitta vizual — `TgSahna` («telefon · Backend · Telegram»; 0-ekranda telefon, 5-ekranda Backend kartasi — o'sha manba); o'quvchining o'z mahsuloti — uch blok.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (to'rt harakat: «Shanba o'tdi» → bot yozolmaydi · «Telegram'da xabar olish» → bir martalik kod · «Start» → ulangan · «Shanba o'tdi» → Telegram xabari), 5 (to'rt karta → kataklar ✓/✗; o'chirish); 0-ekran javobdan keyin o'zgaradi.
  Bashoratlar tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi (SABOQ 11, 19–30; E 40).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 — «O'lchov» bo'limi (hammasi chegarada; eng uzun sarlavha 52, xulosa 107, hook javobi 102, xato izohi 59).
- [x] Atamalar tayanch 2 va oldingi darslar bilan bir xil (Telegram xabari / eslatma — tayanch 2; webhook, token, `/newbot` — 7-Modul YAKUNIY grep; sanoq yozuvi, sanoq sahifasi, qurilma, brauzer ko'rinishi, «Hisobni o'chirish» — 12-Modul tayanchi); siz-forma;
  tugma va yorliqlar ot-shaklda («Telegram'da xabar olish», «Telegram xabarlarini o'chirish», «Tekshirish», «Davom etish»); agent promptlari — T-002 istisnosi (lint ogohlantirishi kutilgan); bot javoblari, xabar matni, siyosat qatori, Mentorga yozilgan javoblar — olam ichidagi matn (T-008).
- [x] Testlar: variantlar bir shaklda, uzunligi yaqin (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z / tire / qavs / qo'shtirnoq faqat to'g'rida emas; Keladi / Kelmaydi 2/2 · ✔: s4 C · s7 B · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [—] Final: tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (skript grep: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «bir zumda», «kafolat» — KOD dan oldingi matnda 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — o'quvchiga «1-amaliyot»; `m11-08`, kod raqami, «pilot», «keys» yo'q); modul raqami LMS bo'yicha («7-Modulda», «12-Modul»); tarixiy voqea yo'q; T-038 — kelajak faqat «Keyingi dars» qatorida · «KOD» (13) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S (+ PM) ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 («bir martalik kod», «Telegram xabari» — harakatdan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 («hodisa» yo'q, «kod» yolg'iz — faqat dastur kodi, «Ulangan» yolg'iz yo'q) ·
  T-016/017 (metafora yo'q) · T-024 · T-029 (Mentor «Bu…» bilan boshlanmaydi) · T-034 · T-039 («mahsulotingiz», «ilovangiz» — bor) · T-042 · T-043 («Mentor misolida», «Bu misolda», «Bu kursda») · T-044 · T-045 (bot birinchi yozolmaydi; havola APK'ni ochmaydi — ochiq) ·
  T-047 · T-048 · T-049 · T-052 · T-064 · T-066 · T-070 · P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-021 · P-026 (xato yo'li har blokda, ayb o'quvchida emas) · P-028 (Telegram, Render, Netlify, Neon — rasmiy yoki oldingi modul so'zi) ·
  P-036 · P-046 · P-048 · P-052 · P-055 · P-059 · P-062 · P-063 (`TG_SAHNA`, `KATAKLAR`, `TG_XABAR`) · P-064 · P-067 · S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-018 (brend sifatida faqat Telegram — asbob, izohsiz kundalik nom, KORPUS §189) · S-019 · S-020 · S-026 · S-040 ·
  PM-030 · SABOQ 6, 9, 11, 12, 13, 16, 17, 19–31, 36, 39, E 40–55.
- [x] Tekshiruv: `npm run lint:til feedback/F-1007-13modul/08-WinBackDay-v3.md` — **0 error**, 3 warn (74, 205, 221-qatorlar — 74 da prompt qoidasining o'zi tilga olingan, 205 va 221 — prompt matni: agentga yoziladigan prompt matnidagi murojaat shakli — T-002 istisnosi; 12-Modul SABOQ C: lint ogohlantirishi kutilgan, error emas).
- [x] Ochiq savollar yopildi: TAYANCHGA SAVOL 1 (son yo'q — F-1007-466), 4 (faqat yangi bot — 9.39), 23 (sherik Telegram'i faqat `namuna = true` tekshiruv hisobiga — F-1007-466).
