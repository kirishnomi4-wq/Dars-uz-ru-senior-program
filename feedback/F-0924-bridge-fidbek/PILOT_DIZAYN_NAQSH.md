# Pilot dizayn naqshi — 1-o'tish 1-dars (BridgeKimUchun.jsx), 2026-09-24 ~11:50

Boshqa 6 darsga ko'chiriladi (klon taqiq: hook-imzo metaforasi har darsda o'ziniki).

1. Xato variant — PmLesson2 binafshasi:
   `.option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }`
   `.kp-chip.wrong` / `:hover` → fon `T.accentSoft`, matn `T.accent`, halqa `inset 0 0 0 2px T.accent`.
2. Test qolipi: QuestionScreen o'rami `className={\`screen qs${picked !== null || mReveal ? ' qs-on' : ''}\`}` +
   `.stage-content.narrow:has(> .screen.qs) { max-width: 800px; }` · `.screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }` ·
   `.screen.qs .feedback-block.visible { margin-top: 0; }` · feedback ramkalari padding `clamp(11px,1.6vw,14px) clamp(14px,2vw,18px)`.
3. `.dense` (≥761px): gap 12, padding-bottom 14, `.h-title` `clamp(22px,2.6vw,31px)`, `.head` gap 4, `.col` gap 10, frame padding `11px 16px`, `.mentor-msg` padding `10px 15px`. Mentor-gap qo'shilgan har zich ekranga.
4. ChipCompare: `Verdict` `note` prop (senariy xulosasi faqat tegishli holatda), `.verdict-note` kesik chiziq, `.cc-reader` yorliq, `.me-bub.shrug`.
5. Hook: `narrow` yo'q, `.split.hk-split` (1.1fr/1fr), chapda dars olamining sxemasi + o'z imzo-harakati, o'ngda eyebrow + variantlar; `hvote` faqat `totalVotes > 0`; reduced-motion muqobili; telefonda ortiqcha sxema qatori yashiriladi.
6. Bosiladigan karta: `button.spot:not(.on):hover` ko'tarilish, `:active` cho'kish.
7. Photo emoji-rejimi: `.k-fig > .k-photo.emo { display:flex; align-items:center; justify-content:center; }`.
8. «Tushunmadi/to'xtadi» — qizil emas, AMBER/AMBER_SOFT. Qizil faqat haqiqiy xato va mentor-statistika.
Maqsad: 1280×800 (TopBar bilan) aylantirish 0, UZ + RU, matn qisqartirilmaydi.

## 2-aylanish — VIZUAL BOYLIK (pilot, ~12:35) — har dars majburiy
9. Maket ichida kulrang chiziq YO'Q: qisqa haqiqiy material matn (nom, narx, 1 qatorli mazmun) `{uz,ru}` massivlarda (pilot: `OLX_CATS`, `OLX_ADS`, `ORDER_TXT`); darsning o'z olamidan, senariy faktiga zid emas. Brend — faqat oddiy yozuv, logotip yo'q.
10. `FlowLabel` — har interaktiv ustun tepasida «NIMA — NIMA QILASIZ» yorlig'i (≤6 so'z).
11. `Zoomable` ⛶ — asosiy maket/split'ga (fade-up transform ichiga emas; split uchun `className="zsplit"`).
12. Simulyatsiya-paneli (pilot `ReaderPanel`): mavjud mantiq holatini yuz · pufak · katakli yo'l · n/N shkala bilan chizadi; to'xtash joyi amber.
13. Mentor-avatar zaxirasi (🧑‍🏫 fonda / B2 dagi CSS-yuz) — rasm 1,6 MB, sekin yuklanadi.
14. Bo'sh joy: asosiy maketga o'lcham modifikatori (`roomy`), vertikal markazlash emas.
Yonma-yon solishtirish: `scratchpad/sifat/b1v/` (pilot) ↔ `scratchpad/sifat/b1qa/pm2-*.png` (PmLesson2).

## 3 · HARAKAT — tartiblash/sudrash (F-0925-B01, 25.09 07:34) — sudrash bor har bridge darsiga
15. Tartiblash ro'yxatida brauzerning o'z drag-and-drop'i (`draggable`/`onDrop`) ISHLATILMAYDI: element joyida qoladi, xira «arvoh» yuradi, qo'yilganda bir zumda sakraydi, telefonda esa umuman ishlamaydi. Uning o'rniga pointer (`onPointerDown/Move/Up/Cancel` + `setPointerCapture`) ishlatiladi: olingan bo'lim ko'tarilib (`.lift`, soya, `scale(1.02)`) kursor ortidan yuradi, qolganlari ~0,2 s ichida joy bo'shatib suriladi, qo'yilganda FLIP bilan o'z o'rniga sirg'alib kiradi. Sudrash paytida transformlar DOM'ga to'g'ridan yoziladi (har pikselda qayta render yo'q). Namuna: `BridgeKimUchun.jsx` `ScreenOrder`.
16. Sudrash ma'nosi — **joyiga qo'yish** (qolganlar bir pog'ona suriladi), almashtirish emas. Bosib tanlash (ikkitasini ketma-ket bosish) muqobil sifatida qoladi, u ham FLIP bilan sirg'aladi.
17. Joy almashish chegarasi — qo'shni bo'limning o'rtasi. Yuqoriga sudralganda bo'limning USTKI cheti, pastga sudralganda PASTKI cheti o'lchanadi, markaz emas: aks holda baland (2 qatorli) bo'lim pastroq bo'limdan o'ta olmaydi (sinovda tutildi).
18. Telefonda sudrash faqat ⠿ tutqichdan (`touch-action: none` faqat tutqichda, kattalashtirilgan urilish maydoni bilan): qatorning qolgan joyi sahifani aylantiradi. <6 px siljish sudrash emas, bosish hisoblanadi. Sudrashdan keyingi `click` tanlov bo'lib ketmaydi. `prefers-reduced-motion` yoqilganda FLIP va surilish o'chadi.

## 4 · MANBA va JAVOB ajralishi (F-0925-B02…B04, 25.09) — har bridge darsiga
19. Zich ekranda mentor pufagi pastdagi blokka yopishmaydi: `.lesson-root .screen.dense > .mentor { margin-bottom: 8px; }` (12px oraliq + 8 = 20px). 25.09 da foydalanuvchi roziligi bilan barcha 7 bridge darsiga qo'llandi.
20. **O'qiladigan manba javob-kartasiga o'xshamaydi.** Manba (voqea, keys matni) — krem qog'oz (`#FBF6EA`, ingichka `#EADFC4` chiziq), soyasiz, chap chiziqsiz, o'z yorlig'i bilan («VOQEA — javobni shu yerdan topasiz»). Javob qatorlari — oq karta, ustida yorliq («SIZ TANLAYSIZ — …»). To'g'ri javobdan KEYIN manbadagi mos bo'lak qator rangidagi marker bilan chiziladi (oldindan emas — javobni aytib qo'ymaydi). Namuna: `BridgeMuammoniTopamiz.jsx` `GAP_STORY` + `.gb-story` / `.gb-mk`.
21. **Juftlashda ikki tomon rangdan ajraladi.** Ikki ustun: chapda 💡 takliflar (sariq `#FFF8E1`, «g'oya»), o'ngda 😣 muammolar (shaftoli `#FFF1EC`, «og'riq»), juftlangach yashil. Ikkala tomonga bir xil binafsha chegara berilmaydi. Juftlangan element manbadan nishon ichiga uchib kiradi (Web Animations FLIP), qolganlari silliq suriladi; bo'shagan ustunda «✓ Hammasi juftlandi». Namuna: `BridgeMuammoniTopamiz.jsx` `ScreenMatch`.

## 5 · Tushunarlilik (F-0925-B08…B14, 3/4-o'tish 2-darsi) — keyingi darslarga qo'llash foydalanuvchi qarori bilan
22. **Yozish maydoni ko'rinib tursin.** Bo'sh maydon: kesik chiziqli rangli chegara, o'ngda ✏️ qalamcha, placeholder «…» emas, aniq chorlov («Shu yerga yozing…» · 17-ekranda «Sherigingiz aytgan gapni shu yerga yozing…»). Navbat kelgan bo'sh maydonda miltillovchi kursor — maydonning o'z fonida (`background` qatlami) chiziladi, shuning uchun yorliq tepada ham, yonda ham joyida turadi. Namuna: `BridgeNimaQuramiz.jsx` `.pw-f input:placeholder-shown`, `WRITE_PH`. 25.09 foydalanuvchi roziligi bilan qolgan 6 darsga UMUMIY qoida bo'lib qo'shildi: `.lesson-root :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly])` (maydon turi — `pw-f`, `bfield`, `gf-in`, `reflect-input` — farqi yo'q); `placeholder`siz 9 maydonga `WRITE_PH` qo'yildi.
23. **Tugmalar savolining tagida.** Bir qatorda bir nechta tanlov bo'lsa — jadval: ustun sarlavhasi savolni aytadi («👥 Nechta odamga kerak?»), belgining ma'nosi uzoq burchakda turmaydi. Telefonda sarlavha yashirinadi, savol har guruhning yonida chiqadi (`.bp-head` / `.bp-tg-q`).
24. **Ko'rsatkich joylashuvni surmaydi.** Tanlovdan keyin chiqadigan yordamchi yozuvning joyi doim band (`visibility`), aks holda sudrash boshlanganda nishon barmoq ostidan qochadi (sinovda tutildi: gap 22px surilardi). Sudrash holati (`lift`) React holatida — DOM'ga qo'lda qo'shilgan sinf keyingi renderda o'chadi. Sudralayotgan element qatori `z-index` bilan ko'tariladi (`.qs-pool:has(> .lift)`), aks holda keyingi blok ostida qoladi.
25. **Tugagan mashq bir tomonga og'ib qolmaydi.** Chap ustun bo'shasa, natija ro'yxati gorizontal o'rtaga silliq suriladi (FLIP), «✅ …» belgisi ro'yxat sarlavhasiga o'tadi (`.split.st-solo`).
26. **Bir ma'lumot — bir marta.** O'qda bitta yorliq (sarlavha + yorliq emas), kartada matn (matn + nuqta-o'lchagich emas), kulrang izohlardan faqat halollik uchun zarur bittasi; qolgani mentor eslatmasiga. Qoida («tez = bir haftagacha») o'q yorlig'ida o'qiladi. Aylantirilgan (vertikal) yorliqqa emoji qo'yilmaydi — yon tomonga yotib qoladi.

## 6 · Bittalab kelish, brend-slayd (F-0925-B26…B31, 4-o'tish 3-darsi) — keyingi darslarga foydalanuvchi qarori bilan
27. **Uch karta birdaniga emas — bittalab.** Tepada ① ② ③ qadam-ko'rsatkich (joriy — binafsha halqa, tayyor — ✓ yashil, oldinga faqat erishilgan joygacha, orqaga — erkin); bitta karta; «Keyingisi →» (karta tayyor bo'lganda yoqiladi) — keyingi karta o'ngdan, orqaga qaytilsa chapdan sirg'alib kiradi. Yon panel (Ertangi ekran, Saqlash) joyida qoladi. Namuna: `BridgeMalumotIshonch.jsx` 13/14-ekran (`.mf-steps`, `.mf-slide`, `.mf-next`).
28. **Chorlov ko'rinadigan tugmaga ergashadi.** Joriy karta tayyor, lekin keyingisi hali ekranda yo'q bo'lsa — mentor ham, NavNext ham «Keyingisi →»ni aytadi (ilgari «ikkinchi maydon uchun tanlang» derdi — u maydon hali ko'rinmasdi).
29. **Yozilayotgan maydon o'z-o'zidan yopilmaydi/almashmaydi.** Tayyorlik sharti (masalan ≥3 harf) yozish paytida bajariladi — qator shu zahoti yopilsa, bola yozayotgan joyi ko'zdan g'oyib bo'ladi (16-ekranda sinovda tutildi; `fill` bilan sinov buni ko'rsatmaydi — harfma-harf `keyboard.type` kerak). Yopish — faqat «✓ Tayyor» bosilganda.
30. **Keys brendi ranglari bilan, logotip fayli bilan emas.** Netflix slaydi: #141414 fon, #E50914 urg'u, «NETFLIX» so'zi qalin shriftda; rasmiy logotip fayli ishlatilmaydi (tovar belgisi). Ataylab quyuq fon — inline `style` + `data-dark-ok="…"` (dark-lint `ALLOW` ro'yxati umumiy fayl — bridge'dan tahrirlanmaydi).
31. **Ixcham tahrir-ro'yxat.** Oldingi ekran ma'lumotini qayta ko'rsatish kerak bo'lsa (16-ekran «Sxemangiz») — to'liq forma emas, qatorlar «① nom · 🔓 ochiq · ✏️»; bir vaqtda bitta qator ochiq.

## 7 · Ochiq lenta va juftlab kelish (F-0925-B15…B23, 3-o'tish 3-darsi «Qanday ko'rsatamiz?»)
32. **Kinolenta ochiq rangda.** Fon #E4DEF9, teshikchalar binafsha (rgba(91,61,230,0.32)), kadrlar oq; bo'sh kadr — oq-shaffof + binafsha kesik chiziq. To'q (`T.ink`) lenta og'ir qora dog' bo'lib ko'rinardi. Ustiga yoziladigan bitta blok (`/* F-0925-B15 · OCHIQ KINOLENTA */`) — tuzilma va animatsiya o'zgarmaydi.
33. **Ko'p karta — ikkitadan yoki bittadan, oxirida faqat natija.** 8-ekran: 2+2 (juftlik baholangach 0,75 s dan keyin keyingisi), tugagach — faqat sarlavha savoliga javob beradigan ixcham natija. 14-ekran: A → B → C (0,8 s), oxirida uch qatorli xulosa. 13-ekran: bittalab kadr + ① → ② → ③ ko'rsatkich (naqsh 27).
34. **Asosiy narsa tepada.** 10-ekran: lenta (natija yig'iladigan joy) tepada, tanlanadigan kadrlar ostida, o'z yorlig'i bilan; bosilgan kadr lentadagi joyiga uchib kiradi (joy + o'lcham FLIP).
35. **Variant — tugma ko'rinishida.** 5-ekran: hoshiya, o'ngda «→», hover'da ko'tariladi, bosilganda cho'kadi; to'g'ri javob chapdagi kartaga uchib kiradi, ishlatilgani ✓.
36. **Maydon yorlig'i chegarani kesmaydi.** 12-ekrandagi «notched» yorliq (sig'ish uchun) «xato qurilgandek» ko'rinardi — yorliq tepada alohida qatorda, to'ldirilgan maydon yengil yashil hoshiya (qalin emas).
37. **Kattalashtirish oynasi qatlamdan qochmasin** (F-0925-QA01). `position: fixed` + katta `z-index` ota element opacity/transform animatsiyasida bo'lsa uning ichida qamaladi — keyingi qo'shni ustun ustiga chiqadi. Qoida: `.lesson-root :has(.zoom-on) { z-index: 1000; }`. Tekshiruv usuli: oyna ochilgach uning ichidagi 7×7 nuqtada `elementFromPoint` oynaga tegishli bo'lishi kerak.

## 8 · ASOSIY DARS qoidalari — 1-o'tish 1-darsi etaloni (F-0925-QA01…QA06, tasdiq 25.09 14:26) — qolgan 6 darsga shu bilan
38. **Ikki ustunli ekranda asosiy qutilar bir chiziqdan boshlanadi** (sahifa-oyna ↔ odam-karta, maydon ↔ gap-karta, xulosa ↔ karta). Yorliqlar emas — qutilar tekislanadi.
39. **Qarshi ustunda qo'shimcha qator bo'lsa — ko'rinmas nusxa**, qat'iy piksel emas: tugmalar qatori (`<div className="cc-ghost" aria-hidden><CompareChips … cmp={{...cmp, lit:null, pend:[]}} /></div>`) yoki yorliq (`<p className="flow-label cc-ghost" aria-hidden>·</p>`). `.cc-ghost { visibility:hidden; pointer-events:none }`, telefonda `display:none`. Shrift/til o'zgarsa ham balandlik teng.
40. **Yorliq o'z qutisining ustida turadi**, tepada osilmaydi: o'ng ustunda tartib «ko'rinmas nusxa → yorliq → karta» (chapda «yorliq → tugmalar → sahifa» — yig'indi teng).
41. **Tugmalar boshqaradigan ustunda qoladi** — tugmalarni ikki ustun ustiga, o'rtaga chiqarish foydalanuvchiga YOQMADI (QA07, qaytarildi).
42. **Ortiqcha rang-chiziq yo'q:** karta chap chetidagi qalin binafsha chiziq (`border-left: 5px accent`) — «bekorga rang», «juda baland» — olib tashlanadi (`.gl-card`, `.acard`).
43. **Hook:** variantlar rasm bilan bir chiziqda tepadan (`align-items: start`).
44. **Takror blok yo'q:** ustun ichidagi hukm/izoh aytgan gapni pastdagi to'liq kenglikdagi xulosa qaytarmasin (12-ekran), AI qoidasini ikkinchi marta aytuvchi blok yo'q (17-ekran). Test/keysdagi yo'riq-yorliqlar yo'q (B-41).
45. **Tekshiruv usuli:** ko'z bilan emas — brauzerda `getBoundingClientRect().top` (shriftlar yuklangach, animatsiya tugagach ≥2,5 s); farq ≤1–2px. Yorliq chiziq-o'lchovi (`align.mjs`) ko'rinmas nusxa bor joyda chapdagi tugmani oladi — u yerda sahifa-oyna ↔ karta juftligini alohida o'lchash.
46. **Kesik (siniq) bezak-chiziq yo'q** (F-0925-QA08): taxmin kartasining tepasidagi `repeating-linear-gradient` chiziq olindi, 7 dars.
47. **Keys slaydida tepadagi rang-chiziq yo'q** (F-0925-QA09) — faqat brend slaydida (Netflix qizili) istisno.
48. **Maydon nomi — maydon ichida** (F-0925-QA11): yorliq faqat nom bo'lsa («① 1-savol») — u placeholder bo'ladi, alohida qator yo'q (`aria-label` saqlanadi). Yorliq savol bo'lib, ichida «masalan: …» namunasi tursa — ikkalasi ham qoladi.
49. **Yorliq o'z blokining chetidan boshlanadi** (F-0925-QA13): blok ustunda o'rtada tursa (telefon-maket), yorliq ham shu blok kengligida o'rtada. Kenglik bitta CSS o'zgaruvchisida (`--ta-w`) — blok va yorliq birga o'zgaradi (media/zoom holatlarida ajralib qolmaydi).
50. **Yo'riq bir marta** (F-0925-QA14, QA19): «qanday ishlatiladi» yo'rig'i (fleshkarta: «bosing») faqat har o'tishning 1-darsida va faqat 1-kartada; o'tishning keyingi darslarida umuman yo'q. Placeholder'ga yozilgan matn sig'ishi o'lchanadi (canvas `measureText` ≤ maydon eni), ikki tilda.
51. **Chap rang-chiziq (stripe) umuman yo'q** (F-0925-QA18, «#global … boshqa chiqmasin»): kartaga, qatorga, xulosa/izoh blokiga, maydonga `border-left: Npx solid rang`, `border-left-color` holati yoki `box-shadow: inset Npx 0 0 rang` qo'yilmaydi; holat (to'g'ri/tanlangan) — to'liq kontur-halqa yoki fon bilan. Radius simmetrik. Ruxsat: uchburchak strelka, 1–2px ajratgich. Grep: `border-left:\s*[3-6]px solid|inset [2-6]px 0 0`.
52. **Savol maydon ichida** (F-0925-QA18, 48-bandning kengaytmasi): savol-yorliq + namuna → bitta placeholder «№ Savol? (masalan: …)»; tor maydonda faqat savol. Sig'ish navbat-halqasi yongan holatda o'lchanadi.
53. **Har kartaga «bosing» yozilmaydi** (F-0925-QA18): chorlov mentor-gapda va tugmada bor; kartada faqat holatdan keyingi ma'lumot («↻ yana ochish»).
