# Junior ekran qonunlari (qoralama, 2026-11-16)

> Bitta joyda: har dars ekrani shu qonunlar bilan quriladi. Manba — etalon sahifasi (`etalon.html`; 19.11 dan muzlatilgan, 4A qarori — yig'uvchisi `arxiv/etalon-yiguvchi/` da)
> va KONSEPSIYA qarorlari. **Holat: qoralama** — foydalanuvchi ko'rigidan o'tgach, KONSEPSIYA 12-bo'limidagi ekran bandlari shu faylga
> havola bilan almashtiriladi (ikki joyda yashamasin). Har qonun yonida: qayerdan keldi va qanday tekshiriladi.
> «Mashina» — `node new-junior/sinov/etalon/setka-tekshiruv.mjs` (raqam — skriptdagi qoida); «ko'z» — suratda odam ko'radi.

## Tuzilish

| № | Qonun | Qoida | Qayerdan | Tekshiruv |
|---|---|---|---|---|
| 1 | Uch qavat | Tepada faqat dars nomi (bekat chizig'i yo'q) · o'rtada ish · pastda tugmalar. Hamma ekranda bir xil joyda | 38-qaror, 74-qaror | mashina (6) |
| 2 | To'rtta shablon | Ikki ustun · Sahna · Studiya (Scratch tartibi: ranglar · bloklar · dastur · sahna) · Kutish. Boshqa tuzilish yo'q | 62, 68-qaror | ko'z |
| 3 | Qat'iy setka | Har shablonda nomlangan zonalar; narsa o'z zonasidan chiqmaydi | 68-qaror | mashina (3) |
| 4 | Yo'l qatlami | Sahnaning pastki 40% i — faqat qahramon, zonachalar (bekat — yorlig'i bilan) va sakrash yoylari. Panel, karta, yozuv tushmaydi. Istisno — tepalik reja ekranlari (23-qonun): u yerda yo'l yuqoriga ko'tariladi va qahramon cho'qqiga chiqadi; panel uni yopmasligi baribir tekshiriladi | 67–68-qaror | mashina (1, 2) |
| 5 | Bo'sh joy — mazmun bilan | Ikki ustunda bo'sh oraliq qolmaydi (≤ 3 cqw). Joy kattaroq yoki boshqacha joylashgan mazmun bilan to'ladi; quti cho'zilmaydi (ichida mazmun ≥ 80%) | 75, 79-qaror (F-1116-07, 13) | mashina (8, 10) |
| 6 | Dunyo doim ko'rinadi | Tekis fonli ekran yo'q: hovli, kosmos, suv osti… | 35-qaror | ko'z |

## Matn

| № | Qonun | Qoida | Qayerdan | Tekshiruv |
|---|---|---|---|---|
| 7 | Sarlavha — bir qator | Faqat huk ekranlari (P2, P2N, P2S, P2C) ikki qatorgacha. Sig'masa — so'z qisqaradi, shrift kichraymaydi. Bitta kalit so'z coral rangda, marker ostida | 71-qaror (F-1116-03) | mashina (4) |
| 8 | Coddy — bitta ma'noli gap | 12 so'zgacha; bola nima qilishini yoki nimani ko'rishini aytadi; huk javobini oldindan aytmaydi | 69-qaror (F-1116-01) | mashina (5) — so'z soni; ma'no — ko'z |
| 9 | Bir ma'no — bir so'z | Buyruq **beramiz**, dastur **tuzamiz**, bloklarni **ulaymiz** — «yozamiz» emas. Bolaga «qadam». Bekat nomlari hamma joyda bir xil | 70, 74-qaror | grep (manba va etalon) |
| 10 | Vaqt so'z bilan | «Keyin …» / «Bugun esa …» — kelajakdagi narsa bugungidek ko'rinmaydi | 81-qaror (F-1116-12) | ko'z |
| 11 | Uch shrift, uch vazifa | Geologica — sarlavha · Onest — matn · JetBrains Mono — kod (blok, raqam, yorliq) | 66, 74-qaror | ko'z |
| 12 | Blok nomi inglizcha | Qolgani o'zbekcha; birinchi chiqqanda ustoz o'zbekcha ma'nosini bir marta aytadi | 60-qaror | ko'z |
| 13 | Yozuv idishidan chiqmaydi | Bir qatorli yozuv kesilmaydi va qo'shnisiga chiqmaydi | 16.11 (setka v3.2) | mashina (7) |

## O'zaro ta'sir

| № | Qonun | Qoida | Qayerdan | Tekshiruv |
|---|---|---|---|---|
| 14 | Bitta asosiy tugma | Doim pastda o'ngda, coral. Bosiladigan narsa bo'lmasa — tugma yo'q. Tanlov ekranlarida tanlashning o'zi — harakat | 46-qaror | ko'z |
| 15 | Tugma — ekranning o'zi bo'lsa | Hukdagi «YUR!» kabi: butun ekranga bitta katta tugma; pastda asosiy tugma bo'lmaydi | v4 (BY) | ko'z |
| 16 | Savol — faqat hukda | Qolgan joyda ustoz ko'rsatadi, bola keyin o'zi bajaradi; tekshiruvni amaliy topshiriq qiladi | 59-qaror | manba |
| 17 | Javob kartasi — rasmli taxmin | Rang + belgi + qisqa gap. Javoblar ochilganda kartada nechta bola tanlagani; sinovdan keyin natija shu kartada (✕ / ✓) | 76, 80-qaror | ko'z |
| 18 | Blok — mozaika bo'lagi | Ustma-ust ulanadi; sudrash ham, bosish ham ishlaydi | 62-qaror; Blockly sinovi | Blockly o'lchovi |
| 19 | Xato — maslahat bilan | Muammocha chiqadi, pufagida faqat bitta gapi; maslahat matni — «Maslahat» tugmasida; «Xato!» yozuvi yo'q | 73-qaror | ko'z |
| 20 | Bayram — qisqa | Hech narsani yopmaydi; ekran o'zi o'tib ketmaydi | 50-qaror | ko'z |
| 27 | Tugma joyi qat'iy | Asosiy tugma («Keyingi ›», «Ishga tushir», «Tayyorman»…) har ekranda pastki qatorning o'ng chetida, aynan bir joyda; «Orqaga» — chap chetda; ikkinchi darajali tugma (ustozdagi «▶ Ishga tushir») — asosiy tugmaning chap yonida. Yozuvning uzunligi yoki pastki qator shabloni tugmani surmaydi | F-1116-25 (16.11, foydalanuvchi: «Keyingi tugmasining joyi o'zgarmasin — qonun qilib qo'yaylik») | mashina — demo sinovi: hamma qadamda asosiy tugmaning o'ng cheti bir xil (farq ≤ 0,5%) |
| 28 | Yo'l qimirlamaydi | Qahramon yurganda faqat qahramon siljiydi; zonachalar, yoylar va yulduz joyida qoladi (yo'l kataklari teng, qahramon eni ularni surmaydi) | F-1116-26 (16.11, foydalanuvchi: «blokdan blokka yurayotganda yerdagi blokchalar o'zgarmasin») | mashina — demo sinovi: yurishdan oldin, yurish paytida va keyin zonachalar koordinatasi bir xil |
| 29 | Qahramon — tanlangandan keyin | Bola qahramon tanlaguncha uning ekranida Coddy turadi (standart qahramon yo'q); tanlagach — darsning oxirigacha bolaning o'z qahramoni, ismi va rangi | F-1116-27 (16.11, foydalanuvchi: «hali tanlamagan — default chiqib turadimi?») | mashina — demo sinovi: tanlashdan oldin kutishda robot, keyin — tanlangan qahramon |
| 30 | Dars nomi — faqat boshida | «1-dars · Tanishuv» yozuvi faqat Kirish va Savol qadamlarida; keyin yashiriladi, lekin qatori joyida qoladi (ekran sakramaydi) | F-1116-28 (16.11, foydalanuvchi: «boshidagi bir nechta sahifada, keyin olib tashlaymiz») | mashina — demo sinovi: 1–2-qadamda ko'rinadi, 3-qadamdan yashirin |
| 31 | Ustoz ekranida — faqat haqiqiy son | Sinf doskalari, taxta va hisoblagichlar (kirdi, javob, tanladi, yulduzga yetdi, pog'onalar, ism, joy, sahnasi tayyor, yordam so'radi) — faqat sinfdagi bolalarning haqiqiy holatidan; namuna raqami jonli darsda chiqmaydi | F-1116-30 (16.11 o'z auditi, foydalanuvchi: «halol tuzat») | mashina — to'liq dars sinovi (1 bola → hamma joyda 1 / 1) |
| 32 | Javob — ko'rsatilgandan keyin | Sarlavha natijani oldindan aytmaydi (say, «Coddy sanaydi»); bola topshirig'i ustoz ko'rsatib bo'lgach ochiladi — bola ustozdan oldin yechmaydi | F-1116-31 | mashina — sinov: ishga tushirishdan oldin sarlavhada javob yo'q, bola avval kutadi |
| 33 | Har tugma ishlaydi | Ekrandagi har tugma bosilsa nimadir qiladi; qiladigan ishi bo'lmasa — tugma yo'q, o'rnida qisqa yozuv («Zo'r! Ustoz keyingisini ko'rsatadi») | F-1116-32 | mashina — sinov: B4 da asosiy tugma yo'q, «Qayta ko'rish» dasturni qayta o'ynatadi |
| 21 | Kutish — tinch | Bola katta ekranni kutganda: kechki hovli, bitta yozuv, qahramon tepaga qaraydi, tugma yo'q. Faqat darsga kirishda (B0) — kunduzgi hovli va bitta asosiy tugma «Tayyorman» | v4 (BK, B0) | ko'z |

## Rang, yo'l, sinf

| № | Qonun | Qoida | Qayerdan | Tekshiruv |
|---|---|---|---|---|
| 22 | Rang — oila | Ko'k — harakat, binafsha — gap (keyin: sariq — hodisa…). Coral — asosiy tugma va kalit so'z. Oltin — yulduz. Yashil — to'g'ri. Bezak uchun rang yo'q | 61-qaror | ko'z |
| 23 | Reja — tepalik | Yo'l pastdan yuqoriga ko'tariladi: start (Coddy) → uch bekat, har biri bir pog'ona baland (bekat rangi — oilasi, yorlig'i bilan) → cho'qqida dars oxiridagi natija (yakunda — keyingi dars). Navbatdagi bekat miltillaydi, o'tilgani ✓ va yoyi oltin. Xarita uch marta chiqadi: reja, 2-bekat boshi, yakun | 77–78-qaror; 16.11 boshliq tanlovi — C «Tepalik» (A «Yo'l» o'rniga) | mashina (setka) + ko'z |
| 24 | Pog'ona — zinapoya | Bola bajaradigan pog'onalar sinf doskasida zinapoya: raqam, kichik rasm, bir qator topshiriq, nechta bola | 72-qaror | ko'z |
| 25 | Ekranda vaqt yo'q | Sahnani ustoz tugatadi; daqiqa — faqat ustozning rejasida | 63-qaror | ko'z |
| 26 | Bolaning ishi proyektorga chiqmaydi | Ism, bola yozgan gap, kim qayerda qolgani — faqat o'z noutbukida; katta ekranda faqat umumiy son va chaqiruv | 64-qaror; 12-bo'lim 2–3-band | ko'z |

## Ziddiyatlar (hal qilinishi kerak)

> 18.11: 1–3 hal qilindi (qarorlar sahifasi javoblari, KONSEPSIYA 84–85-qaror); 4–5 — bolalar bilan sinovda ko'riladi.

1. **«Gap dunyoning ichida, katta oq karta yo'q»** (KONSEPSIYA 12-bo'lim 31-band, 14.11) — etalondagi «Ikki ustun» shabloni esa oq kartalar va chap ustundagi Coddy suhbatiga qurilgan; foydalanuvchi bu ekranlarni qabul qilgan. **Hal qilindi (18.11):** 31-band faqat «Sahna» va «Kutish» shablonlarida kuchda; «Ikki ustun» (tushuntirish) ekranlaridagi oq kartalar va Coddy suhbati — qabul qilingan ko'rinish.
2. **O'quvchining asosiy tugmasi «doim yashil»** (manba, «Ekranlar ko'rinishi») — etalonda hamma asosiy tugma coral (B2–B4 qabul qilingan). **Hal qilindi (18.11, 84-qaror):** coral; manba tuzatildi (ustoz gapida tugma yozuvi bilan ataladi).
3. **Proyektor ustoz noutbukini takrorlaydi** (19-qaror) — shuning uchun pastki qatordagi «Ustozga: … deb ayting» sinfga ham ko'rinadi. **Hal qilindi (18.11, 85-qaror):** ustoz gaplari faqat varaqda; proyektorda «Ustozga» satri yo'q (3 ekrandan olib tashlandi); «Ayting» qatori (65-qaror) qurilmaydi.
4. **C javobining belgisi (strelka)** — «savolning hamma javobi ishonarli» (12-bo'lim 8-band): strelka «buyruq»ga juda o'xshab, javobni sezdirib qo'ymaydimi — bolalarda sinab ko'rish kerak.
5. **Uzun `say` gapi** (30 harfgacha) tor dastur ustuniga sig'maydi: Blockly'da blok kengayadi va ish maydoni suriladi; etalonda gaplar qisqartirildi («Mening kosmosim!»), manbada esa «Bu — mening kosmosim» (tayyor ovoz shu gap bilan). Sinab ko'rib, qaror qilinadi.

## O'lchanmagan

- **Proyektorda o'qilishi:** ko'p yorliq ekran kengligining 1–1,3 foizida (1366 pikselli proyektorda 14–17 px). Eng kichik o'lcham qoidasi va mashina tekshiruvi kerak.
- **Harakat va tovush:** etalonda qisman; qoidasi kodda, odam ko'rib-eshitib baholaydi.
