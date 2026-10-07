# 10-Modul — quruvchi saboqlari (MAJBURIY)

> Har quruvchi/vizual agent topshirig'iga shu fayl qo'shiladi. Ikki qism: (A) 9-Modul pilotlaridan — foydalanuvchining qat'iy qoidalari;
> (B) 10-Modul tashqi audit Filtrlaridan (`NN-FILTR.md`) quruvchiga tegishli kelishuvlar. Umumiy qonunga muhrlash — asosiy seansda.

## A. 9-Modul pilotlaridan (05.10.2026) — manba: `feedback/F-1005-9modul/QURUVCHI_SABOQ.md`, 1–18-bandlar

O'sha faylni yuborilgan paytdagi holatida TO'LIQ o'qing. Qisqasi:
1. Yonma-yon kartalar bir balandlikda; bo'sh siluet bilan cho'zish yo'q.
2. Brend/mahsulot aytilsa — sahnada: nomi o'z rangida, tanish maketda (telefon, brauzer, chat), birinchi ko'rinishda bir qatorli izoh. Matnli karta — RAD. Logotip chizilmaydi.
3. Keys sahnasi jonli: matnda aytilgan har narsa chizilib ko'rinadi va bosqichga qarab o'zgaradi. Namuna: `src/6-Modull/PmLesson22.jsx` `AltairMock` (m6-02), `src/6-Modull/PmLesson25.jsx` `DeckMock` (m6-14).
4. Ekranga kirganda bo'sh, ma'nosiz element yo'q; javobga bog'liq vizual — javobdan keyin.
5. «Bot» odamga nisbat berilmaydi — gapda sinf/odam bo'lsa «Telegram bot».
6. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i YO'Q (skeletdan ko'chirilmaydi).
7. Kartada rangli yon chiziq yo'q — to'liq holat yashil ✓ bilan.
8. Voqea ekranida bosqich gapini Mentor aytadi (har bosqichda almashadi); sahnada — bosqich nomi va jonli maket; yakuniy xulosa pastda yashil.
9. Ko'p elementli mashq ketma-ket: bir vaqtda bitta element katta karta, natija joyiga uchib boradi.
10. 12/12 darvoza — sifat emas: har ekran surati ko'z bilan ko'riladi, brend/keys ekranlari m6-02 / m6-14 bilan yonma-yon.
11. 🔴 Navbatdagi harakat har doim ko'rinadi (faol element halqa + yengil pulsatsiya, Mentor shu harakatni aytadi). Bashorat tanlangach YOPILMAYDI — ixcham qator natijagacha turadi;
    skelet naqshi `bashorat={!taxmin && …}` ishlatilmaydi.
12. 🔴 Kartochkalar — alohida ekran (podium → kartochkalar → yakun).
13. Bir nechta tanlov birdaniga to'kilmaydi — bo'laklar ketma-ket.
14. Amaliyot bloki (QBlok) shakli o'zgartirilmaydi (9-Modul 7-dars A1 — namuna).
15. 🔴 MD matni o'zboshimcha o'zgarmaydi — kerak tuyulsa, hisobotda «MD ga taklif».
16. 🔴 Kartochka ekranida Mentor yo'q; karta ostida birinchi bosishgacha «Kartani bosing — javob ochiladi», karta yuzi halqada. Tugma «Yakunlash →».
17. Mashq tugagach yig'ilgan ro'yxat — bitta ixcham qator.
18. Yakunda ichki skroll qutisi yo'q.

Skelet tuzoqlari (9-Modul `QURUVCHI_TOPSHIRIQ_2.md`): `practice: ou(title)` → `ou(eyebrow)` · arena foni `QZ_BG_SHAPES` — darsning o'z atamalaridan, «Frontend/Backend» va emoji yo'q ·
skeletdagi `rgba(255,79,40,…)` → `fon(T.accent)` · `QKod` o'ng ustun propi til-lint ga tushadi — 9-Modul 1-darsdagi `QKOD_ONG` yechimi (MEXANIZM-TAKLIF 10) ·
juftlik ekranida yakka rejim uchun Mentor gapining qisqa varianti.

## B. 10-Modul kelishuvlari (tayanch 9-bo'lim, `NN-FILTR.md`) — quruvchiga tegishlisi

- Matn MD dan so'zma-so'z; MD dagi «✎», «Izoh (MD)», «O'qituvchi eslatmasi» — ko'rsatma yoki mentor matni (o'quvchi yuzasiga faqat MD aytgan joyda).
- Atamalar: «maxfiy kalit» («sir» yo'q) · «foiz» («ulush» yo'q) · «brauzer» (sanoq birligi; «kishi» emas) · «Oxirgi 5 daqiqada» (kodda `hozir`) · «kutish holati» («Backend uyg'onmoqda» yo'q) ·
  «inkognito oyna» · «Backend» (prozada «server» yo'q) · «dashboard (holat paneli)» birinchi marta.
- Saqlanadigan natija kalitlari — tayanch 8 jadvali aynan (`pm-m8dN-…`); kod oynasi qoralamasi `pm-m8dN-code`.
- Tashqi xizmat maketlari (Netlify, Render, Neon, UptimeRobot, GitHub, Umami, Antigravity) — chizilgan, logotipsiz, tanish ko'rinishda (brauzer oynasi/dashboard).
  Nom yorlig'ining rangi: PM keys brendlari (Booking, Uzum, Airbnb) — o'z rangida (A-2); TEX darsdagi xizmatlar uchun — MD qanday desa (ochiq savol hisobotga).
- Xavfsizlik darsi (5): hujum qatori, payload, boshqa saytni tekshirish yo'rig'i — YO'Q.
- Kafolat so'zlari («har doim», «darrov», «100%», «hech qachon») o'quvchi yuzasida yo'q; xulosalar «Bu misolda…», «Bu darsda…» bilan chegaralangan.

## C. 10-Modul pilot ko'rigidan (06.10.2026, F-1005-174 · 2-dars, F-1005-175 · 10-dars) — foydalanuvchining 22 rasmli fidbeki, QAT'IY

Rasmlar: `feedback/F-1005-10modul/rasm/F-1005-174-*` va `F-1005-175-*` — quruvchi O'QIYDI (Read bilan ko'radi), ayniqsa o'z ekran turiga o'xshashini.
Foydalanuvchi so'zi: «mehr ber, jonsiz qilma» · «minimalizm yaxshi, ammo juda jonsiz — bu general» · «elementlar slishkom mehrsiz, yaxshi tartiblash kerak» · «oyoqni qo'ymaylik».

19. 🔴 **Jonli ekran.** Har kirish / reja / tushuncha / voqea ekranida kamida bitta MA'NOLI harakat bor:
    kirishda elementlar navbat bilan chiqadi (60–120 ms oraliq) · bosish → narsa joyidan joyiga uchadi (so'rov konverti telefondan Backend'ga, karta chiziqdagi joyiga) ·
    holat o'zgarishi animatsiya bilan (yangi qator sirg'alib kirib ~1 s yashil yonadi, son sanab o'sadi, chiziq chizilib boradi, ✓ belgi «tushadi»).
    Bashorat kartasi kirishda yengil ko'tariladi, variantlar navbat bilan chiqadi, tanlanganda ixcham qatorga «yig'iladi».
    Statik «ro'yxat + jadval» ekran — RAD. Bezak-animatsiya (aylanib turgan nuqtalar, tinimsiz miltillash) — RAD. `prefers-reduced-motion` da harakat o'chadi, yakuniy holat ko'rinadi.
20. 🔴 **Bo'sh ustun yo'q.** Ustunning yarmidan ko'pi bo'sh qolsa — joylashuv o'zgaradi (bitta ustun yoki vizual kattalashadi). Karta qo'shni ustun balandligiga cho'zilmaydi (`align-items: start`).
    Bo'sh joyni ma'noli jonli vizual to'ldiradi (masalan, kod ekranida chaqiruvlar qayerda «yonishini» ko'rsatadigan mini-telefon), «to'ldiruvchi» karta emas.
21. 🔴 **Joylashuv izchil:** telefon/sayt maketi doim CHAPDA, chizma/jadval O'NGDA — butun dars bo'yi. Qadamlar ro'yxati alohida bo'sh ustun bo'lmaydi: harakat tugmasi maketning o'zida yoki ostida,
    qadam raqami Mentor gapida yoki tugma yonida.
22. 🔴 **Telefon maketi o'lchami barqaror** (2-dars 0-ekran band holatidagi o'lcham, ≈170×272 px): bosh ekran holatida ham, ikki telefonli ekranda ham kichraymaydi.
23. 🔴 **Telefon = sayt:** texnologiya yorlig'i («Sayt · React», `hodisaYoz`) telefon ramkasining ustida; alohida «Sayt» qutisi YO'Q; so'rov chizig'i telefondan chiqadi.
24. 🔴 **Faqat ekran mavzusiga oid ma'lumot.** Ekran nima haqida bo'lsa, shu jadval/karta. Yordamchi ma'lumot (`bandlar` jadvali, «Umami» hisobot kartasi) dalil sifatida kerak bo'lsa —
    bitta jonli hisoblagich yoki belgi («+1 band ✓» / «Umami: 0»), to'liq jadval emas.
25. 🔴 **Yakuniy holat ixcham:** izoh + «Taxminingiz» + xulosa + qo'shimcha qator ustma-ust to'planmaydi — bitta natija bloki (taxmin qatori xulosaning birinchi qatori),
    hammasi 1280×800 da bitta ekranga sig'adi, ichki skroll yo'q. Yakunda jarayon elementlari (qadamlar ro'yxati, bajarilgan tugmalar, yordamchi yorliqlar) yig'iladi yoki yo'qoladi.
26. 🔴 **Ko'p element — RAD.** Bir vaqtda ekranda ≤ 3 blok (maket · chizma · harakat yoki natija). Voqea (keys) ekranida: sahna + bitta vaqt qatori + bashorat;
    sahna yorliqlari, chiziq ostidagi izoh-pufaklar, ikki marta aytilgan ma'lumot — olib tashlanadi.
27. 🔴 **Vizual katta va o'qiladigan:** asosiy vizual ekran kengligining ≥ 60% i; matn ≥ 12 px (yorliqlar ≥ 11 px). 10 ta mayda nuqta + 10 ta mayda yozuv bir qatorda — RAD.
    Bir qatorga 6 tadan ko'p kichik karta sig'dirilmaydi — ko'p bo'lsa ikki qator yoki navbat bilan. Doira/pufak ichiga matn tiqilmaydi: matn hech qachon chegaradan chiqmaydi (tugma ham).
28. 🔴 **«Oyoq» / ko'prik yoylari yo'q** (o'tkazilgan modul ustidagi ︵ yoy, bridge uslubi) — «oyoqni qo'ymaylik, bridge'da juda g'alati». O'tkazilgan joy — kulrang chip «o'tkazildi».
29. 🔴 **Mustaqil ish formasi — bitta element bilan:** bir vaqtda bitta katta karta tahrirlanadi (yuqorida ixcham chiziq, joriy element ajralgan, qolganlari — holat belgisi).
    10 ta mayda kartani birdan tahrirlash — RAD. Foydalanuvchi matni uzun bo'lsa ixcham ko'rinishda qisqartiriladi (…), karta cho'zilmaydi.
30. **Har ekranni topshirishdan oldin 4 savol** (hisobotda har ekran uchun «4/4»): (1) bo'sh ustun yo'qmi? (2) ekranda 3 tadan ko'p blok yo'qmi?
    (3) bosganda biror narsa harakatlanadimi? (4) 13 yoshli o'quvchi 3 soniyada nimaga qarashni biladimi? Bittasi «yo'q» bo'lsa — ekran tayyor emas.
31. 🔴 **Stilsiz element ekranga chiqmaydi** (F-1005-177: foydalanuvchi 10-dars 11-ekranda xom `<ol>` raqamlarini «1. 0 · 2. 1 · 3. 2 · 4. 3?» ko'rdi — «qanaqa bag, e'tiborli bo'lmasang bo'lmaydi»).
    Lokal server har saqlashda yangilanadi — yangi element JSX va CSS bilan BITTA tahrirda yoziladi. Ro'yxatlar `list-style: none`. Topshirishdan oldin:
    `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` — «stilsiz» ro'yxatida faqat skelet klasslari (d1 fade-step fade-up italic mono mstats-verdict p pod- qz-auto).
