# 12-Modul — nima mumkin emas (umumiy qonun fayllaridan, MD yozishdan oldin)

Manbalar: `QOIDALAR.md` (reestr, ID lar) · `konveyer/QURISH_KARTASI.md` · `MATN_ETALONI.md` (lug'at) · `MATN_KORPUS.md` · `PM_Prompt_v8.md` (keys banki) · `PM_DARS_ETALON.md` · `til-lint-rules.json` ·
foydalanuvchining saqlangan qarorlari · 11-Modul `00-TAQIQLAR.md` (asos) va 16 ta `NN-FILTR.md`. 06.10.2026 yig'ildi.
Bu ro'yxat — qisqa eslatma; ziddiyat bo'lsa manba fayl to'g'ri. `npm run lint:til` ko'p so'zni o'zi ushlaydi — lekin bu yerdagi ko'p band skriptga ko'rinmaydi.

## 0. Foydalanuvchining qat'iy qonunlari (05.10) — MD da ham
- Har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi — ixcham qator bo'lib natijagacha turadi. MD da har harakatli ekranga «Harakat → Vizual o'zgarish», Mentor gapi aynan shu harakatni aytadi.
- Kartochkalar — alohida ekran (podium → kartochkalar → yakun): Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi», tugma «Yakunlash →».
- Brend yoki mahsulot nomi — o'z rangida, tanish maketda (telefon, brauzer, chat), jonli sahnada; matnli karta rad. Logotip chizilmaydi. «Maydon Jamoa» — telefon maketida; lending — brauzer maketida; post — chat maketida.
- Agent MD matnini o'zboshimcha o'zgartirmaydi — kerak bo'lsa «MD ga taklif» deb yozadi (bu quruvchiga; MD yozuvchi esa har so'zni o'zi aniq yozadi).
- O'ylab topilgan qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: o'yinchi, tashkilotchi, sinfdosh, sherik, guruh egasi, ota-ona.
- Jonli ekran (10-Modul saboqlari 19–31): telefon maketi chapda, ekranda ≤3 blok, bo'sh ustun yo'q, yakuniy holat ixcham, ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta).

## 1. Mazmun va halollik
- Bankdan tashqari keys, raqam, sana, manba — **yo'q** (PM-016). Keyslar — tayanch 5-bo'lim, faqat o'sha darsga berilgani; Mentor gapida bank so'zi aynan; natija va sabab qo'shilmaydi. Raqam yilsiz aytilmaydi.
- Mentor raqamlari — faqat tayanch 1-bo'limdan (1.13 jadvali) va «Mentor misolida» deb; statistika yoki tadqiqot deb aytilmaydi (T-043). Kutilgan son — «Mentorning taxmini» yorlig'i bilan.
- **Da'vo isbot emas:** «tuzatildi», «ishlaydi», «yetkazadi» — fakt va qayta tekshiruv natijasi bilan («qayta tekshiruvda takrorlanmadi»). Agentning «bajardim» degani — tekshirilmagan da'vo.
- Kichik son umumiy xulosa qilinmaydi: 15 ta qurilma, 3 kunlik son, bitta post — «kam: farq bor, lekin isbot emas». Har xil o'lchovdagi sonlar (qurilma · hisob · tashrif) ayirilmaydi.
- Qat'iy gaplar yo'q: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «bir zumda», «kafolat» (T-020). Real vaqt haqida ham: «o'zi yangilanadi» — «odatda bir necha soniyada», tekshiruv bilan.
- Soddalashtirish yolg'on model yasamaydi (T-045): WebSocket «doim ulangan» emas — uziladi va qayta ulanadi; socket.io uzilish paytidagi hodisani keyin yetkazmaydi; rejalashtirilgan eslatma Backend'dan kelmaydi — ilova o'zi qo'ygan;
  «Hozir ko'ryapti» — ochiq ekranlar soni, odamlar soni emas; APK — do'kondagi ilova emas va o'zi yangilanmaydi; brauzer ko'rinishi — o'rnatilgan ilova emas; Expo Go — sinash vositasi.
- Tashqi xizmat (Expo, EAS, socket.io, Render, Netlify, Neon, Umami, GitHub, Telegram, Instagram, Android, iPhone) imkoniyati, narxi, limiti, tugma va menyu nomlari taxmin qilinmaydi (P-028): tayanch 6-bo'lim yoki rasmiy hujjat (havola va sana MD izohida);
  bo'lmasa — umumiy so'z + «shubhali joylar». Yosh chegarasi (Telegram) aytilmaydi. Har tashqi qadamda xato yo'li bitta gap, aybni o'quvchidan oladi (P-026).
- Real kompaniya ichki qarorini da'vo qilmaydi (PM-018); keysdagi katta son o'quvchiga me'yor qilib qo'yilmaydi («25 000» — maqsad emas).
- **50 foydalanuvchi — baho emas:** yetmagan o'quvchi uyaltirilmaydi; Mentor misoli ham yetmaydi (38). Soxta akkaunt, o'zi bir necha marta ro'yxatdan o'tish, sotib olingan obunachi — yo'q; namuna va tekshiruv akkauntlari sanalmaydi.
- Lendingda va postda faqat hozir ishlaydigan narsa yoziladi; va'da («tez orada», «yaqinda hamma narsa bo'ladi») — yo'q; halol holat aytiladi («ilova shu hafta chiqadi», «iPhone'da eslatma hozircha yo'q»).

## 2. O'smir xavfsizligi va maxfiylik (real odamlar bilan ishlaydigan darslar: 1, 6, 7, 10, 12)
- Kanallar — faqat o'zi a'zo bo'lgan joylar va tanish doira; guruhga post — guruh egasidan ruxsat so'rab; notanish odamga shaxsiy xabar yozilmaydi; yangi akkaunt ochish talab qilinmaydi.
- Postda, lendingda, public repo'da, saqlash kalitlarida va skrinshotda: familiya, maktab raqami, telefon, uy manzili, akkaunt nomi — yo'q. Postni yuborishdan oldin ota-onaga ko'rsatiladi. Uchrashuv taklifi kelsa — faqat kattalar bilan.
- Bir xil xabarni ko'p guruhga tashlash (spam), «do'stingni taklif qil — sovg'a» kabi bosim, qo'rqitadigan yoki uyaltiradigan eslatma — yo'q. Eslatma — haftasiga ko'pi bilan ikkita va o'chirgichi bor (bu kurs qoidasi).
- Ilovada telefon raqami so'ralmaydi (7-darsdan login); «Hozir ko'ryapti» va jonli xabarlarda ism yo'q; Expo akkaunti ma'lumoti boshqaga berilmaydi.
- Agentga xato yuborilganda `.env` qiymatlari, token va kalitlar yuborilmaydi; `.env` — `git status` da ko'rinmasligi tekshiriladi.
- Xavfsizlik chegarasi (5-dars): «buzish» — faqat **o'z ilovasida**, internetni uzish, fonga olish va yangi versiya chiqarish bilan. Boshqa odamning ilovasi yoki sayti tekshirilmaydi; hujum usuli o'rgatilmaydi (10-Modul 5-dars qoidasi).

## 3. Misol-ip va odamlar
- Bir dars — bitta misol-ip «Maydon Jamoa» (P-001); ikkinchi misol faqat qisqa mashq yoki testda (P-002), u ham o'smir tanigan olamdan. Boshqa darsning keysi yoki metaforasi tilga olinmaydi (PM-016).
- O'quvchining o'z mahsuloti — uning ishi; Mentor misoli namuna, umumiy qolip emas: bloklar, hodisa nomlari, qadamlar, kanallar — «Mentor misolida».
- Metafora — ko'pi bilan bitta, bir marta, «…ga o'xshatish mumkin» shaklida (T-016), o'smir har kuni ko'radigan narsadan, mexanikasi haqiqatga mos, farqi ochiq aytiladi (T-017). Taqiq manbalar: inson a'zolari, biologiya, kimyo, mavhum matematika.
  «Voronka», «quvur», «tomir», «miya», «yurak», «sehr», «jon kiritish» obrazlari yo'q. Tayanchda metafora yo'q — MD qo'shmoqchi bo'lsa «TAYANCHGA SAVOL» ga yozadi.
- Misol o'smir oxirgi haftada ko'rgan yuzadan (T-046): Telegram guruhi, sinf chati, mahalla, futbol; gazeta, ofis, rus realiyasi yo'q.

## 4. So'z va ohang
- Siz-forma hamma joyda (tugma, yorliq, zanjir ham — T-071/073). Istisno: agentga beriladigan prompt matni (T-002) va olam ichidagi matn — post, chat xabari, jonli xabar (T-008).
- **Taqiq so'zlar** (T-021, T-022, lint): «sir», «sehr», «mo'jiza», «professional», «mohiyat», «loyqa», «pardoz»; sifatlar «buzuq», «buzilgan», «g'alati», «chalkash», «chala», «shunchaki», «foydasiz», «mezon»; kitobiy «chora», «nolish».
  5-darsda: «buzamiz», «buzildi / buzilmadi», «buzish yozuvi» — dars atamasi (ruxsat); «buzuq ilova», «buzilgan ulanish» — yo'q («ulanish uzildi»).
- Kantselyarit, sheva, registr — 11-Modul TAQIQLAR 3-bo'limidagidek («ushbu», «hisoblanadi», «amalga oshiriladi» · «-votti», «-ku/-da/-a/-ya» · «zo'r», «qoyil»). Maqtov: «Yaxshi!», «To'g'ri!», «Ajoyib!».
- Belgi-formula (≠, =, →, +) o'quvchi izohida va test variantida yo'q — to'liq gap (T-035). Qadamlar yorlig'idagi «→» — vizual (chiplar orasidagi chiziq), matn emas.
- «Daftaringiz» yo'q · «o'z so'zingiz bilan» → «ekranga qaramasdan, yoddan» · «taxmin qiling» → «Avval o'zingiz belgilab ko'ring» · «Xato — 0 ball» → «Adashdingiz — 0 ball» · «Kodda xato» → «Kod ishlamadi» · «kompilyator: … oyna» → «kod oynasi».
- «Keyingi darsda …» va'dasi ekranda yo'q — kelajak faqat uyga vazifa muddatida va yakundagi «Keyingi dars — «…»» qatorida (T-038). 13-Modul, 14-Modul, bitiruv himoyasi, Demo Day — o'quvchi matnida va'da qilinmaydi (faqat O'qituvchi eslatmasida).
- Ichki kodlar o'quvchi matnida yo'q: A1/A2/A3, `m10-04`, «Modul 12», T6, K3, «keys» (ekran yorlig'ida — «Biznes olamidan»), «trek-A», «pilot», «mini-PRD».
- Modul raqami o'quvchi matnida — LMS raqami («11-Modulda», «10-Modulda»); moslik jadvali tayanch boshida. Shubha bo'lsa — raqamsiz («oldingi modulda»).
- Dasturda inglizcha turgan nom tarjima qilinmaydi (T-033): socket.io, WebSocket, Expo Go, Netlify, Render, Umami, GitHub, «Run». Qisqartma birinchi ko'rinishda ochiladi (T-036): APK, CTA (bir marta ko'prik), PRD (o'tilgan — ochilmaydi).
- **Lug'at — shu modul juftliklari** (to'lig'i tayanch 2-bo'lim «Ishlatilmaydi» ustunida): real-time → **real vaqt** · event → **hodisa** · listener → **tinglovchi** · room → **xona** · reconnect → **qayta ulanish** · dublikat → **takror hodisa** ·
  edge case → **chekka holat** · spec, mini-PRD → **real vaqt talabi** · presence, onlayn → **hozir ko'ryapti** · toast → **jonli xabar** · push, push-xabar, bildirishnoma → **eslatma** («push» — faqat `git push`) · landing → **lending** · CTA → **asosiy tugma** ·
  kopirayting → **sahifa matni** · voronka → **qadamlar** · drop-off → **to'xtab qolish qadami** · retention → **qaytganlar foizi** · antikrizis reja → **zaxira reja** · chekpoint → **Mentor tekshiruvi** · user → **foydalanuvchi** ·
  username → **login** · dashboard → **sanoq sahifasi** (bir marta ko'prik) · build → **o'rnatish fayli tayyorlanadi** · web versiya (mobil ilovaniki) → **brauzer ko'rinishi**.
- **Bitta darsda bitta ma'no (T-015):** «hodisa» (2, 3, 4, 5, 9 — ulanish hodisasi · 7, 8, 10 — analitika hodisasi) · «qadam» (faqat foydalanuvchi yo'li; reja bo'lagi — «bosqich», zaxira rejadagi — «ish») · «holat» (3, 5-darslarda faqat ulanish holati) ·
  «e'lon» (faqat o'yin e'loni; post — «yuboriladi») · «kanal» (odamlar eshitadigan joy; Telegram'dagisi — to'liq nomi bilan) · «tekshirish» (o'z ishi) va «sinov» (real odam) · «xabar» (jonli xabar; chatdagisi — «post» yoki «chat xabari»).

## 5. Ekran tuzilishi
- Sarlavha ≤55 belgi, bitta qator; savol yoki harakat; sahna sharti Mentor'ga (P-010); yangi atama PM darsi sarlavhasida yo'q (T-011) — «lending», «kanal», «hodisa», «xona» sarlavhaga o'tilgandan keyin chiqadi.
- Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi (T-072), «Bu…», «Hammasini…» bilan boshlanmaydi, ekranda ko'rinib turganini ta'riflamaydi (T-029, T-047).
- Hook javobi ≤120 belgi, «Aynan!» / «Qiziq fikr!» bilan (kurs qonuni T-028, T-067 — tashqi auditda olib tashlash taklifi rad etiladi; lint «Aynan!» ni ham sanaydi); hook javobi Mentor gapida oldindan aytilmaydi (P-016).
- Reja ekrani — natija va'dasi, savol emas; App.jsx `sub` bilan mos (P-014, P-015).
- Bir ekran — bir ish (P-008); tushuncha-ekranda bitta harakat → vizual o'zgaradi; «bos → matn-karta» taqiq (P-067); bitta kerakli vizual (P-052). Real vaqt darslarida vizual — ikki telefon maketi va ular orasidagi Backend: hodisa uchib boradi, ikkinchi ekranda son o'zgaradi.
- Matn mexanika xulosasini oldindan aytmaydi (P-036); xulosa ≤110 belgi; xato izohi ≤60; yakun fe'li ko'nikmani nomlaydi (T-049). Miqdor ekranda bir marta (P-062).
- Ballik testlar ketma-ket turmaydi (P-012). O'quvchi ko'radigan matnda emoji yo'q (arena, nishon medali, podium — mustasno). Ovoz (audio) matni yozilmaydi.
- Ekran soni: PM ≈15–16 · TEX 18–20 · PM+PRAKT 12 · loyiha kuni 8 + 3 blok + kartochkalar = 12 · 11-dars 12; `.homework.jsx` yo'q.
- **Kod:** React Native va gateway kodi darsda — o'qiladigan qisqa bo'lak + chizilgan telefon maketi; kod oynasida faqat brauzerda ishlaydigan JS (namuna `ulanish` obyekti — «haqiqiy Backend emas» izohi bilan). Kod oynasi sarlavhasi — «…digan kod yozamiz» oilasi (PM-082).

## 6. Testlar, kartochkalar, nishonlar
- Savol ≤12 so'z, o'quvchiga qaratilgan (S-001); bitta himoyalanadigan to'g'ri javob (S-002). Variantlar uzunligi teng (±15%); to'g'ri javob yolg'iz eng uzun emas; kalit so'z, tire, strelka, qavs faqat to'g'rida emas (S-003, S-006). Inkor-savol yo'q.
- Distraktor ishonarli va darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004, S-005). **Haqiqiy hayotda rost bo'lib qolishi mumkin bo'lgan distraktor yo'q** — ayniqsa tashqi xizmat (socket.io, Expo, Render) va keys haqida.
- To'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz (S-009); xato izohi javobni aytmaydi (S-010). Ball beriladigan matnda atama izohsiz qolmaydi (S-020).
- Kartochka `front` — to'liq savol, «?» bilan (S-027); 10–12 ta. Takrorlash oynasi — 3 karta, PM darsida raqam (S-026). Arena 12 savol, to'g'ri javob o'rni A/B/C/D har biri 3 marta; arena savoli ekran testining nusxasi emas (S-021).
- Nishonlar 4 ta, nomi qisqa inglizcha («Built It!»), tavsifi o'zbekcha siz-formada, qilingan ishni aytadi; tekin bonus ko'pi bilan bitta. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q.

## 7. Ma'lum ziddiyatlar va ochiq joylar (foydalanuvchiga ko'rsatiladi, agent o'zi hal qilmaydi)
- **«hodisa» ikki ma'noda** (ulanish · analitika) — Qaror-0 23 bilan qabul qilingan; dars bo'yicha ajratilgan (4-bo'lim oxiri). 9 va 10-darslarda ikkalasi uchrashadigan joyda — «sanoq yozuvi».
- **K1 Uzum** — 9, 10, 11-Modulda ham bosh-keys; mintaqaviy qoida bo'yicha 12-darsda (Qaror-0 22). **K3 Instagram** — 9-Modulda ham bor edi (boshqa ko'prik bilan).
- **Brauzer ko'rinishi (iPhone yo'li)** — hujjatda bor, qurilmada sinalmagan; pilotda tekshiriladi (Qaror-0 10).
- **6-dars uyga vazifasi** (o'rnatish faylini tayyorlash) — terminalda uch buyruq; 7-darsda havola bo'lmasa dars rejadan boshlanadi (Qaror-0 11).
- **11-Modul jadvali** (`telefon`) 12-Modul 7-darsida `login` ga o'zgaradi (Qaror-0 14) — 11-Modul MD lari o'zgarmaydi.
