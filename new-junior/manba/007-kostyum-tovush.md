# 7-dars. Kostyum, animatsiya va tovush

> **Holat (20.11 kech): QURILDI — `../darslar/007-kostyum-tovush/`, oxirida «Filtr qarorlari» va «Qurishdagi qarorlar».** Avvalgi holat: v1 — QORALAMA (2026-11-20; tavsiya bo'yicha yozildi — savollar oxirida («Savollar»), har birida tavsiya A).** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/007-kostyum-tovush/`) shundan quriladi.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–4-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 7-dars («Kostyum, animatsiya va tovush» — natija: yuradigan va ovozli personaj; o'rganadi: rasmlarni almashtirib harakat hosil qiladi, hodisaga tovush bog'laydi; tekshiruv: avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Maydondagi har topshiriq qo'lda simulyatsiya qilindi (natija jadvalda); dvigatel qurilgach dastur bilan tekshiriladi.

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** yuradigan va ovozli qahramon.
- **Bola nimani tushunadi:** qahramonning bir nechta **kostyumi** bor — har biri uning bitta rasmi (xotirjam, xursand, hayron, o'ylanadi); `switch costume to` bloki kostyumni almashtiradi — qahramon joyidan qimirlamaydi, faqat kostyumi o'zgaradi, va keyingi almashtirishgacha shu kostyumda qoladi. Kostyumlar navbat bilan almashsa — qahramon jonlanadi: bu **animatsiya** (multfilm ham shunday yasaladi). `repeat` bilan animatsiyani ko'p marta, har qadamda qilsa bo'ladi — qahramon yurib boradi va jonli ko'rinadi. `play sound` — tovush chaladi; uni hodisa blokiga ulasa, tugma bosilganda qahramon ovoz chiqaradi.
- **Tekshiruv (dasturdan):** avto — qahramon yulduzda kerakli kostyumda (1-bekat); yulduzda va animatsiya soni yetarli, har qadamda (2-bekat); o'yinda kerakli tovush chalindi, yulduzda space bilan xursand bo'lib jiringladi (3-bekat).
- **Vaqt:** reja 66 daqiqa, zaxira 14–24 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi pog'onalarga yoki 16-qadamga.
- **Uch bekat:** 1 · Kostyum — 2 · Animatsiya — 3 · Tovush. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy (o'z kostyumlari bilan); bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror) — o'sha qahramonning kostyumlari.
- **Oldingi darslar bilan bog'lanish:** 4-darsda bola qahramonni strelkalar bilan boshqardi (hodisa); 5-darsda `repeat` bilan bir blokni ko'p marta bajardi; 6-darsda ikkalasini amaliyotda ishlatdi. Bu dars o'sha maydonda va o'sha bloklar bilan: qahramon endi faqat yurmaydi — kostyumini almashtiradi, jonlanadi va ovoz chiqaradi. Animatsiya — `repeat` ning yangi ishi; tovush — hodisaning yangi javobi.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–2 | Kiradi, maydonni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 2–8:30 | Savolga javob beradi: Coddy'ning ikkita kostyumi bor — qanday qilib qo'llarini silkitadi? Sinf uchalasini sinaydi: bitta kostyum qotib qoladi, silkitish qo'lni qimirlatmaydi, kostyumlar navbat bilan almashsa — qo'l silkitadi. Javob va yangi so'z: animatsiya | 2–5 |
| 8:30–9:30 | Bugungi rejani ko'radi | 6 |
| 9:30–11 | Ustoz `switch costume to` blokini ko'rsatadi | 7 |
| 11–20 | Qahramonini yulduzga olib borib, kostyumini almashtiradi: xursand → hayron → ikki kostyum → ★ uch belgi | 8 |
| 20–23 | Ustoz `repeat` bilan animatsiyani ko'rsatadi | 9–10 |
| 23–35 | Animatsiya tuzadi: yulduzda 3 marta → har qadamda → ikki yo'nalish → ★ uzoq yo'l | 11 |
| 35–37 | Xulosa: animatsiya | 12 |
| 37–53 | Ustoz `play sound` ni hodisa bilan ko'rsatadi; bola o'yinda qahramoniga tovush beradi, ★ da o'z qahramonini o'zi jonlantiradi | 13–15 |
| 53–60 | Dasturchalarini sinfga o'qib beradi — ustoz katta ekranda ovoz bilan o'ynaydi | 16 |
| 60–66 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil natijasi — 12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida): 8-qadam 1-pog'onasida dastur tayyor, bola bitta blok qo'shadi.

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| animatsiya | kostyumlar navbat bilan almashsa, qahramon jonlanadi | 5 (va 12, 17) | uch bo'lak birma-bir: Coddy qo'llari pastda («1-kostyum») → Coddy qo'llari tepada («2-kostyum») → ikkalasi navbat bilan almashadi, Coddy qo'l silkitadi («Navbat bilan — jonlandi») |

Blok so'zi (ta'rif yangi so'z ekranisiz, rasm bilan): **kostyum** — qahramonning bitta rasmi. Hukda (2-qadam) Coddy'ning ikkita kostyumi rasm bilan ko'rinadi, ustoz bir marta aytadi: «Kostyum — qahramonning bitta rasmi. Kiyim emas.»; `switch costume to` blokining ma'nosi — 7-qadamda (`go to` va «dasturcha» qanday kirgan bo'lsa, shunday).
Yordamchi so'zlar (ta'rifsiz, tushunarli): kostyum nomlari (xotirjam, xursand, hayron, o'ylanadi), tovush, ovoz, jonlanadi, navbat bilan, belgi. 1–6-darsdan: blok, dastur, dasturcha, buyruq, qahramon, yulduz, qadam, katak, maydon, manzil, hodisa, tugma, strelka, o'yin, takrorlash, pog'ona.
Bir ma'noga bitta so'z: «kostyum» (qahramonning bitta rasmi; 7-qadamdan keyin ekranda «rasm», «ko'rinish», «kiyim», «holat» deyilmaydi; «Ko'rinish» — faqat blok oilasining nomi); «animatsiya» (kostyumlar navbat bilan almashishi; «harakat» deyilmaydi — Harakat oilasi yurish uchun band; bola topshiriqlarida animatsiya — «xursand, xotirjam» juftligi); «tovush» (blok chaladigan narsa; «ovoz» — faqat «ovoz chiqaradi» iborasida va ustozning «Ovoz» tugmasida); «almashtirish» (kostyum uchun; «o'zgartirish» — faqat «kostyumi o'zgaradi» natijasida); «belgi» (katakdagi kostyum belgisi — kichik yuz).
Topshiriq matnlarida tana a'zosi aytilmaydi («qo'l silkitsin» faqat Coddy haqida — hukda va ustoz ko'rsatganda): Yulduz qahramonida qo'l yo'q, uning kostyumlari yuzida farq qiladi.
Bu darsda AYTILMAYDI (keyingi darslarniki): shart va «devorga tegsa» (8-dars), o'zgaruvchi va ball (11-dars), tasodifiy son (13-dars), kutish bloki va soniya (savol 6), «next costume», kadr, FPS, GIF.

## Maydon va bloklar

Maydon — 3-darsdagi bog' (7 × 5, X va Y sonlari, (0, 0) — pastki chap; daraxtlar (1, 1) · (4, 3) · (6, 1) va gullar — bezak, qahramon ustidan o'tadi; qahramon ostida «(x, y)» yorlig'i). Bu darsdagi start, yulduz va belgilar daraxt katagiga tushmaydi (3-darsdagi (1, 1) savoli bu darsga ta'sir qilmaydi). Chetdan chiqish: 1–2-bekatda — 3-darsdagidek, dastur to'xtaydi (Kamvoy «Maydon tugadi!»); 3-bekat o'yinida — 4-darsdagidek, turtilib «tuk», o'yin to'xtamaydi. Bu darsdagi topshiriqlarda chetga chiqish yo'q — faqat bola xato qilsa.

**Kostyumlar** — yangi rasm chizilmaydi: qahramonning mavjud kayfiyatlari (chizma dvigateli `hero({ k, mood })`) va Coddy'ning mavjud pozasi va yuzi (`robot({ pose, yuz })`) kostyum bo'ladi (**KOD**):

| Kostyum | Bolaning qahramoni (`mood`) | Coddy (`pose` · `yuz`) | Ko'zga tashlanadigani |
|---|---|---|---|
| xotirjam | `xotirjam` | `turadi` · `oddiy` | qo'llar pastda, tabassum — **har ishga tushirish boshida shu** |
| xursand | `xursand` | `quvonadi` · `xursand` | qo'llar tepada, og'iz ochiq |
| hayron | `hayron` | `turadi` · `hayron` | ko'zlar katta, og'iz «o», qoshlar baland |
| o'ylanadi | `oylanadi` | `oylaydi` · `oylaydi` | qo'l iyakda, ko'z tepaga, og'iz yonga |

Yulduz qahramonida qo'l va oyoq yo'q — uning to'rt kostyumi yuzida (ko'z, qosh, og'iz) farq qiladi.

**Tovushlar** — yangi tovush yozilmaydi: dvigateldagi (`tovush.js`) to'rt kuy bolaga nom bilan beriladi (**KOD**): «qadam» (`qadam`) · «sakrash» (`sakra`) · «jiring» (`yulduz` kuyi) · «tuk» (`tuk`). Muammo kuyi (`muammo`) bolaga berilmaydi — u muammocha chiqqanini bildiradi.

**Tovush qayerda eshitiladi** (86-qaror, o'zgarmaydi): ustoz ekranida (proyektor) — doim; jonli darsda bola noutbuki — **jim**; solo'da — bola noutbukida. Shuning uchun `play sound` bajarilganda har ekranda qahramon ustida kichik belgi chiqadi: «♪ qadam» (tovush nomi bilan, ~0,7 soniya) — jim noutbukda ham bola tovush chalinganini ko'radi (**KOD**). Sinf tovushlarni katta ekranda eshitadi: 14-qadamda ustoz ko'rsatganda va 16-qadamda bolalar dasturini ustoz o'ynaganda.

**Bloklar** — besh oila: yangi **Ko'rinish** (feruza) va **Tovush** (pushti), avvalgi Harakat (ko'k), Takrorlash (5-darsdagi rang bilan) va Hodisa (to'q sariq, 3-bekatda). Ranglar — savol 4.

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `switch costume to xursand` | kostyumni almashtir: xursand | qahramonning kostyumi bir zumda boshqasiga o'tadi; qahramon joyidan qimirlamaydi; kostyum keyingi `switch costume to` gacha qoladi. Kostyum bosib tanlanadi: xotirjam · xursand · hayron · o'ylanadi — ro'yxatda har biri o'z qahramonining kichik yuzi bilan (**KOD**). Javonda — «xursand» | **yangi**: 7-qadam |
| `play sound qadam` | tovushni chal: qadam | qisqa tovush; qahramon ustida «♪ qadam»; qahramon qimirlamaydi, kostyumi o'zgarmaydi. Tovush bosib tanlanadi: qadam · sakrash · jiring · tuk (**KOD**). Javonda — «qadam» | **yangi**: 14-qadam |
| `repeat 3` | 3 marta takrorla | ichidagi bloklarni aytilgan marta bajaradi | 5-darsdan; 7-qadamdan javonda |
| `move right` · `move left` · `move up` · `move down` | o'ngga · chapga · tepaga · pastga yur | bitta katak | 2-darsdan |
| `when → key pressed` | → tugmasi bosilganda | dasturcha shundan boshlanadi | 4-darsdan; 3-bekatda (14-qadamdan) |

Yangi oilalar rangi — ustoz aytadi: «Ko‘rinish oilasi — feruza. Bu blok kostyumni almashtiradi.» (7-qadam) va «Tovush oilasi — pushti.» (14-qadam).
**Bir blok — bitta ko'rinadigan narsa** (12-bo'lim 13-band): `switch costume to` — kostyum almashadi, qahramon joyida qoladi, tovushsiz (bajarilish vaqti — savol 6); `play sound` — tovush va «♪» belgisi.
**Ikki rejim** (**KOD**, savol 8): 1- va 2-bekat — bitta dastur, asosiy tugma «▶ Ishga tushir» (1–3, 5-darsdagidek). 3-bekat — 4-darsdagi o'yin: bir nechta dasturcha, «▶ Boshlash» / «■ To‘xtatish», strelkalar.
**Animatsiya hisobi** (2-bekat, **KOD**): sahna tepasida kichik yozuv «Animatsiya: 0 / 3» (olma hisobidek). Bitta animatsiya — `switch costume to xursand`, keyin `switch costume to xotirjam` (xursand kostyumi ko'rindi va xotirjamga qaytdi). «Har qadamda» sharti: har `move` blokidan keyin, keyingi `move` gacha (yoki dastur oxirigacha) kamida bitta animatsiya bo'ldi.
**Kostyum belgisi** (1-bekat 3- va ★ pog'onasi, **KOD**): katakda kichik yuz — bolaning qahramoni o'sha kostyumda, ostida nomi («hayron»). Qahramon belgili katakdan chiqayotganda (yoki dastur shu katakda tugasa) kostyumi belgidagidek bo'lishi kerak; yulduzda ham belgi bo'lsa — dastur tugaganda.
**Yulduzda space** (3-bekat 2- va ★ pog'onasi, **KOD**): yulduzga yetganda o'yin to'xtamaydi; ishora «Yulduzdasiz — space bosing». Qahramon yulduzda turib space bosilsa va space dasturchasi tugasa — «Yetib bordi!».

**Topshiriqlar va tekshiruv natijasi** (qo'lda simulyatsiya qilindi; «→ ← ↑ ↓» — `move right/left/up/down`, «c:xu» — `switch costume to xursand` (xo — xotirjam, ha — hayron, oy — o'ylanadi), «s:qadam» — `play sound qadam`, «R3[…]» — `repeat 3` va ichidagi bloklar, «W→[…]» — `when → key pressed` va ostidagi bloklar; kostyum har ishga tushirishda xotirjamdan boshlanadi):

| Joy | Topshiriq | Yechim | Bloklar | Simulyatsiya va natija |
|---|---|---|---|---|
| Huk (2–4) | Coddy (3, 2) da, kostyumlari: xotirjam (qo'llar pastda), xursand (qo'llar tepada) | C | — | A — bir marta xursand, qotdi: «✕ bir marta ko‘tardi»; B — Coddy joyida chapga-o'ngga uch marta silkinadi, kostyum xotirjam: «✕ qo‘li qimirlamadi»; C — xo ⇄ xu 6 marta (0,35 soniyadan): «✓ qo‘l silkitdi» |
| 7 | ustoz: Coddy (0, 0), yulduz (2, 0) | → → c:xu | 3 | (1, 0), (2, 0) — yulduzda; xursand ✓. Ustoz kostyumni hayronga almashtirib yana yurgizadi — yulduzda hayron |
| 8 · 1 | start (0, 0), yulduz (3, 0); dastur tayyor: → → → | + c:xu (oxiriga) | 4 | (1, 0), (2, 0), (3, 0); xursand ✓. c:xu boshiga qo'yilsa ham ✓ (kostyum oxirigacha qoladi — ataylab) |
| 8 · 2 | start (0, 0), yulduz (0, 3) | ↑ ↑ ↑ c:ha | 4 | (0, 1), (0, 2), (0, 3); hayron ✓ |
| 8 · 3 | start (0, 0); belgi «hayron» (2, 0); yulduz (2, 2) — belgi «xursand» | → → c:ha ↑ ↑ c:xu | 6 | (1, 0), (2, 0) — hayron, belgidan hayron bilan chiqdi ✓; (2, 1), (2, 2); xursand ✓ |
| 8 · ★ | start (0, 0); belgilar: «hayron» (0, 2), «o‘ylanadi» (2, 2); yulduz (5, 2) — «xursand» | ↑ ↑ c:ha → → c:oy → → → c:xu (`repeat` bilan: R2[↑] c:ha R2[→] c:oy R3[→] c:xu — 9) | 10 | (0, 1), (0, 2) hayron ✓; (1, 2), (2, 2) o'ylanadi ✓; (3, 2), (4, 2), (5, 2); xursand ✓ |
| 10 | ustoz: Coddy (0, 0), yulduz (3, 0) | R3[→ c:xu c:xo] | 4 | har qadamda qo'llarini ko'taradi va tushiradi; (3, 0); «Animatsiya: 3 / 3» ✓ |
| 11 · 1 | start (0, 0), yulduz (2, 0); «Yulduzda 3 marta: xursand, xotirjam» | → → R3[c:xu c:xo] | 5 | (1, 0), (2, 0); 3 animatsiya ✓ (8 ta blok bilan `repeat` siz ham ✓) |
| 11 · 2 | start (0, 0), yulduz (4, 0); «Har qadamda: xursand, xotirjam» | R4[→ c:xu c:xo] | 4 | (1, 0) … (4, 0); 4 qadam, har birida animatsiya; «4 / 4» ✓. → → → → R4[c:xu c:xo] — yulduzda, 4 animatsiya, lekin har qadamda emas → Kamvoy |
| 11 · 3 | start (0, 0), yulduz (3, 3); har qadamda | R3[↑ c:xu c:xo] R3[→ c:xu c:xo] (yoki R3[↑ c:xu c:xo → c:xu c:xo] — 7) | 8 | (0, 1), (0, 2), (0, 3), (1, 3), (2, 3), (3, 3) — (4, 3) daraxt yonidan; «6 / 6» ✓ |
| 11 · ★ | start (0, 0), yulduz (6, 4); har qadamda; bloklar 12 tagacha | R6[→ c:xu c:xo] R4[↑ c:xu c:xo] | 8 | (1, 0) … (6, 0), (6, 1) … (6, 4) — (6, 1) daraxt ustidan (bezak); «10 / 10» ✓. `repeat` siz — 30 blok, sig'maydi (Ortiqvoy) |
| 14 | ustoz: o'yin; Coddy (0, 0), yulduz (5, 0) | W→[→ s:qadam] · W space[c:xu s:jiring] | 5 | → ×5: har bosishda «♪ qadam»; (5, 0) — «Yulduzdasiz — space bosing»; space: xursand, «♪ jiring» → «Yetib bordi!» ✓ |
| 15 · 1 | o'yin; start (0, 0), yulduz (4, 0) | W→[→ s:qadam] | 3 | → ×4: har bosishda «♪ qadam»; (4, 0) — «Yetib bordi!» ✓ (space shart emas) |
| 15 · 2 | o'yin; start (0, 0), yulduz (3, 2); dastur 15 · 1 dan | + W↑[↑ s:qadam] + W space[c:xu s:jiring] | 9 | → → → ↑ ↑ (tartib ixtiyoriy): (3, 2) — ishora; space: xursand, «♪ jiring» → ✓. Space yulduzdan oldin bosilsa — xursand bo'ladi, jiringlaydi, lekin yutuq yo'q; yulduzda yana bosiladi |
| 15 · ★ | o'yin; start (0, 0), yulduz (6, 4); erkin ijod — har tugmaga o'z kostyumi va tovushi | masalan W→[→ c:xu s:qadam] · W↑[↑ c:ha s:sakrash] · W space[c:oy s:jiring] | 11 | → ×6, ↑ ×4 (yoki aralash) — (6, 4); space ✓. Shart: yulduzda space; o'yinda kamida 2 xil kostyum va 2 xil tovush ishlatildi (namunada 3 va 3) |

Dasturda eng ko'pi 12 ta blok (`repeat` va hodisa bloklari bilan).

## Yordam va xato

1–4-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga «noto'g'ri», «xato qildingiz» deyilmaydi. O'yin paytida chetga urilish — muammochasiz (4-darsdagidek).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | dastur bo'sh, «▶ Ishga tushir» bosildi | «Bu yerda hech narsa yo‘q-ku…» | «Avval blokni bosing — u dasturga qo‘shiladi» |
| Kamvoy | dastur tugadi, qahramon yulduzda emas | «Yulduz bu yerda emas!» | «Qahramon (x, y) da. Yulduz (x, y) da» (haqiqiy manzillar bilan; 3-darsdagidek) |
| Kamvoy | qahramon maydon chetiga keldi (1–2-bekat) | «Maydon tugadi!» | «Qahramon shu blokda to‘xtadi. Boshqa tomonga yuring» |
| Kamvoy | 1-bekat: yulduzda, lekin kostyum boshqa | «Kostyum boshqa!» | «Hozir: xotirjam. Kerak: xursand. Oxiriga switch costume to xursand» (haqiqiy nomlar bilan; **KOD**) |
| Kamvoy | 1-bekat: belgili katakdan boshqa kostyumda chiqdi | «Bu katakda — hayron!» | «(2, 0) da switch costume to hayron qo‘ying» (belgining manzili va nomi bilan; **KOD**) |
| Kamvoy | 2-bekat: animatsiya kam | «Oz qoldi!» | «Animatsiya: 2 / 3. repeat sonini tekshiring» (haqiqiy sonlar bilan; **KOD**) |
| Kamvoy | 2-bekat: qadam bor, undan keyin animatsiya yo'q | «Animatsiya qani?» | «Har move blokidan keyin: switch costume to xursand, switch costume to xotirjam» |
| Ortiqvoy | bloklar 12 tadan oshdi | «Joy qolmadi!» | «Dasturga 12 ta blok sig‘adi. repeat bilan qisqartiring» |
| Bo'shvoy | 3-bekat: «▶ Boshlash», hodisa bloki yo'q | «Men nimani kutaman?» | «Avval hodisa blokini qo‘ying: when … key pressed» (4-darsdagidek) |
| Bo'shvoy | o'yinda tugma bosildi, uning dasturchasi yo'q | «Bu tugma uchun dasturcha yo‘q-ku…» | «space tugmasi uchun when space key pressed bloki kerak» (bosilgan tugma bilan; 4-darsdagidek) |
| Kamvoy | 3-bekat: yulduzga yetdi, kerakli tovush chalinmadi | «Tovush qani?» | «→ dasturchasiga play sound qadam ulang» (kerakli tugma va tovush bilan; **KOD**) |
| — | 3-bekat: yulduzda, space hali bosilmagan — muammocha emas, faqat ishora | — | «Yulduzdasiz — space bosing» |
| Kamvoy | 15 · ★: yulduzda space, lekin kostyum yoki tovush bir xil | «Hammasi bir xil-ku!» | «Yana bitta kostyum yoki tovush qo‘shing — kamida ikki xil» |

---

## 1 · Kirish

- **Vaqt:** 0:00–0:02 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «7-dars · Kostyum va tovush», sarlavha «Bugun qahramonni jonlantiramiz!». Coddy: «Salom! Bugun meni jonlantirasiz — qo‘l silkitaman va ovoz chiqaraman.» O'ngda maydon, Coddy (0, 0) da. Pastda kichik karta «O‘tgan darslarda»: `repeat 4` ichida `move right` — «Takrorlash — bloklarni ko‘p marta bajarish». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darslarda qahramon strelkalar bilan yurdi va repeat bilan ko‘p marta bajardi.»
  2. «Bugun qahramon faqat yurmaydi — jonlanadi va ovoz chiqaradi.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 6-darsdagi amaliyotdan bitta-ikkita topshiriqni eslatadi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «7-dars · Kostyum va tovush», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: Coddy qanday qo'l silkitadi?

- **Vaqt:** 0:02–0:04 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Coddy'ning ikkita kostyumi bor: qo'llari pastda va qo'llari tepada. Ikkalasi ham qotgan rasm — o'zi qimirlamaydi (**KOD**: huk paytida Coddy'ning o'z harakatlari o'chiq). Savol — qanday qilib bu ikki rasmdan qo'l silkitish chiqadi. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Coddy qanday qo‘l silkitadi?». Maydon, Coddy (3, 2) da; Coddy yonida ikkita kichik kostyum kartochkasi: «1-kostyum» (qo'llar pastda) va «2-kostyum» (qo'llar tepada). Coddy: «Mana ikkita kostyumim. Ular bilan qanday qo‘l silkitamiz?» Chapda uchta karta: A «Bitta kostyum qo‘yamiz» (rasm: qo'llari tepada Coddy) · B «Coddy’ni silkitamiz» (rasm: Coddy va ↔) · C «Kostyumlarni almashtiramiz» (rasm: 1 ⇄ 2). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Kostyum — qahramonning bitta rasmi. Kiyim emas. Coddy’ning ikkita kostyumi bor.»
  2. «Har kim noutbukida bitta kartani tanlasin: Coddy qo‘llarini qanday silkitadi?»
- **O'z so'zi bilan:** kartalarni o'qiydi; ikki kostyumni ko'rsatadi («bu yerda qo‘llar pastda, bu yerda — tepada»); sinf javoblarini o'qiydi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol, ikki kostyum va uchta karta; Coddy: «Qaysi yo‘l bilan qo‘l silkitaman?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:04–0:06:30 (2,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; Coddy bir marta 2-kostyumga o'tadi (qo'llar tepada) va shunday qotib qoladi. Kartada: «✕ bir marta ko‘tardi» (**KOD**: huk kartasining kostyum turi).
  2. «Keyingi» — B: Coddy 1-kostyumda, joyida chapga-o'ngga uch marta silkinadi; qo'llari pastda qoladi. Kartada: «✕ qo‘li qimirlamadi».
  3. «Keyingi» — C: kostyumlar navbat bilan olti marta almashadi (1, 2, 1, 2, 1, 2) — Coddy qo'llarini silkitadi, konfeti. Kartada: «✓ qo‘l silkitdi».
- **Tayanch gaplar:**
  1. «Bitta kostyum — bitta rasm: u qotib turadi.»
  2. «Kostyumlar navbat bilan almashsa — Coddy qo‘l silkitadi.»
- **O'z so'zi bilan:** B da «Coddy qimirladi-ku — qo‘li-chi?» deb so'raydi; C da sinf bilan almashishlarni sanaydi («bir, ikki…»).
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: kostyumlar almashsa — jonlanadi

- **Vaqt:** 0:06:30–0:07:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Kostyumlar almashsa — jonlanadi». A va B xira, C oltin; maydonda Coddy qo'l silkitib turadi (kostyumlar navbat bilan almashadi). Coddy: «Kostyum almashdi, yana almashdi — men qo‘l silkitdim.»
- **Tayanch gaplar:**
  1. «Bitta kostyum qimirlamaydi. Kostyumlar navbat bilan almashsa — qahramon jonlanadi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: animatsiya

- **Vaqt:** 0:07:30–0:08:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: animatsiya»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Animatsiya nima?». Coddy: «Animatsiya — kostyumlar navbat bilan almashsa, qahramon jonlanadi.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (3-, 4-darsdagi `raqam` ishi):
     - 1-bosish: Coddy qo'llari pastda, yozuv «1-kostyum»;
     - 2-bosish: Coddy qo'llari tepada, yozuv «2-kostyum»;
     - 3-bosish: ikkalasi navbat bilan almashadi — Coddy qo'l silkitadi, yozuv «Navbat bilan — jonlandi».
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Animatsiya — kostyumlar navbat bilan almashsa, qahramon jonlanadi.»
  2. «Multfilm ham shunday yasaladi.»
- **O'z so'zi bilan:** hayotdan misol: multfilm; telefondagi harakatli stikerlar; kitob chetiga chizilgan odamcha — varaqlarni tez varaqlasa, yuradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08:30–0:09:30 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Kostyum → 2 · Animatsiya → 3 · Tovush (zonachalar oila rangida: feruza · Takrorlash rangi · pushti); cho'qqida kichik karta «Dars oxirida · o‘yin · Ovozli qahramon» (qahramon yurib boradi, kostyumi almashadi, ustida «♪»). Coddy: «Uchta bekat. Birinchisidan boshlaymiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: kostyum, animatsiya, tovush.»
  2. «Dars oxirida qahramoningiz yuradi, jonlanadi va ovoz chiqaradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: switch costume to

- **Vaqt:** 0:09:30–0:11 (1,5 daqiqa)
- **Bekat:** 1 · Kostyum
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz kostyum blokini ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Kostyum almashadi», ostida «switch costume to — kostyumni almashtir.». Javonda yangi oila «Ko‘rinish» (feruza doiracha), unda `switch costume to xursand`; Harakat oilasida to'rt `move`; Takrorlash oilasida `repeat`. Maydonda yulduz (2, 0), Coddy (0, 0), kostyumi xotirjam. Dastur bo'sh.
  2. Ustoz `move right`, `move right` va `switch costume to xursand` ni qo'shadi; «▶ Ishga tushir» — Coddy ikki katak yuradi, yulduzda kostyumi xursandga o'tadi (qo'llar tepada), «Yetib bordi!».
  3. Ustoz blokdagi «xursand» yozuvini bosadi — ro'yxat ochiladi: xotirjam · xursand · hayron · o'ylanadi, har biri Coddy'ning kichik yuzi bilan; «hayron»ni tanlaydi, yana «▶ Ishga tushir» — yulduzda Coddy hayron.
- **Tayanch gaplar:**
  1. «switch costume to — kostyumni almashtir. Qahramon joyidan qimirlamaydi — faqat kostyumi o‘zgaradi.»
  2. «Kostyum keyingi almashtirishgacha qoladi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** rangini aytadi: «Ko‘rinish oilasi — feruza. Bu blok kostyumni almashtiradi.»; to'rt kostyum nomini ro'yxatdan o'qiydi; har ishga tushirishda qahramon xotirjamdan boshlashini ko'rsatadi.
- **Ustoz qiladi:** bloklarni qo'shadi, «▶ Ishga tushir», kostyum nomini almashtiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Kostyum: pog'onalar

- **Vaqt:** 0:11–0:20 (9 daqiqa)
- **Bekat:** 1 · Kostyum
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Kostyumni almashtiring — yulduzda qahramoningiz o‘zgarsin.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Xursand» · 2 «Hayron» · 3 «Ikki kostyum» · ★ «Uch belgi». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Yulduzga boring va kostyumni almashtiring. Kostyum nomini bosib tanlaysiz.»
  2. «Biri tugasa, keyingisi o‘zi ochiladi.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; «Qahramoningiz hozir qaysi kostyumda?» deb so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda Ko'rinish (`switch costume to xursand`), Harakat, Takrorlash; maydon; qahramon xotirjam. Hamma pog'onada ishora boshida: «Dasturni tuzing, keyin ▶ Ishga tushir».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Xursand», ostida «Yulduzda qahramon xursand bo‘lsin.». Dastur tayyor: `move right` ×3. Yulduz (3, 0). «Maslahat»: «Yulduzga yetgach — kostyumni almashtiring».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Hayron», ostida «Yulduz tepada. U yerda — hayron.». Yulduz (0, 3); dastur bo'sh. «Maslahat»: «Blokdagi nomni bosing — ro‘yxatdan tanlang».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Ikki kostyum», ostida «Belgida — hayron, yulduzda — xursand.». Belgi «hayron» (2, 0); yulduz (2, 2), belgisi «xursand». «Maslahat»: «Belgili katakka yetgach — o‘sha kostyumni qo‘ying».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Uch belgi», ostida «Har belgida — o‘sha kostyum.». Belgilar «hayron» (0, 2), «o‘ylanadi» (2, 2); yulduz (5, 2), belgisi «xursand». «Maslahat»: «Belgiga yetgach — switch costume to».
  Yetsa: «Yetib bordi!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** bloklarni qo'shadi, kostyumni tanlaydi, «▶ Ishga tushir».
- **Tekshiruv:** dastur tugaganda qahramon yulduzda va kostyumi kerakli (avto); 3-pog'ona va ★ da — belgili kataklardan kerakli kostyumda chiqdi.
- **Xatoda:** yulduzda emas — Kamvoy «Yulduz bu yerda emas!»; kostyum boshqa — Kamvoy «Kostyum boshqa!»; belgida boshqa kostyum — Kamvoy «Bu katakda — hayron!»; dastur bo'sh — Bo'shvoy.

## 9 · 2-bekat

- **Vaqt:** 0:20–0:21 (1 daqiqa)
- **Bekat:** 2 · Animatsiya
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: animatsiya»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Kostyum ✓; Coddy 2-bekatda. Coddy: «Endi kostyumlar navbat bilan almashadi — animatsiya.»
- **Tayanch gaplar:**
  1. «Kostyumni almashtirishni bildik. Endi ko‘p marta — repeat bilan.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: har qadamda animatsiya

- **Vaqt:** 0:21–0:23 (2 daqiqa)
- **Bekat:** 2 · Animatsiya
- **Ekran:** proyektor — Blok studiya (ustoz) · bola «Ustoz ekraniga qarang» («Ustoz animatsiyani ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Har qadamda animatsiya». Maydonda yulduz (3, 0), Coddy (0, 0); sahna tepasida «Animatsiya: 0 / 3» (**KOD**). Dastur bo'sh.
  2. Ustoz `repeat 3` ni qo'shadi, ichiga `move right`, `switch costume to xursand`, `switch costume to xotirjam` (ikkinchisida nomni «xotirjam»ga almashtiradi).
  3. «▶ Ishga tushir» — har qadamda Coddy qo'llarini ko'taradi va tushiradi, hisob «1 / 3», «2 / 3», «3 / 3»; yulduzda «Yetib bordi!».
- **Tayanch gaplar:**
  1. «Har qadamda ikki kostyum: xursand, keyin xotirjam. Bu — bitta animatsiya.»
  2. «repeat 3 — shuni uch marta. Coddy yuradi va jonlanadi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** sinf bilan birga sanaydi; `repeat` siz bu dastur 9 ta blok bo'lishini aytadi.
- **Ustoz qiladi:** bloklarni qo'shadi, «▶ Ishga tushir».
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Animatsiya: pog'onalar

- **Vaqt:** 0:23–0:35 (12 daqiqa)
- **Bekat:** 2 · Animatsiya
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Jonlantiring!». Coddy: «Har qadamda kostyum almashsin — qahramon jonlanadi.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14»; o'ngda zinapoya: 1 «Uch marta» · 2 «Har qadamda» · 3 «Tepaga, keyin o‘ngga» · ★ «Uzoq yo‘l». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Animatsiya — xursand, keyin xotirjam. Har qadamda — repeat ichida.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; «Hisob nechchi? Har qadamda almashyaptimi?» deb so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; sahna tepasida «Animatsiya: 0 / N». Hamma pog'onada ishora boshida: «Dasturni tuzing, keyin ▶ Ishga tushir».
  1-pog'ona. Sarlavha «Uch marta», ostida «Yulduzda 3 marta: xursand, xotirjam.». Yulduz (2, 0); «Animatsiya: 0 / 3». «Maslahat»: «Avval yulduzga yeting. Keyin animatsiyani takrorlang».
  2-pog'ona. Sarlavha «Har qadamda», ostida «Har qadamda: xursand, xotirjam.». Yulduz (4, 0); «0 / 4». «Maslahat»: «Har qadamdan keyin animatsiya: qadam ham repeat ichida bo‘lsin».
  3-pog'ona. Sarlavha «Tepaga, keyin o‘ngga», ostida «Yulduz (3, 3) da. Har qadamda — animatsiya.». «0 / 6». «Maslahat»: «Yo‘l ikki bo‘lak — har bo‘lakka o‘z repeat».
  ★ qo'shimcha. Sarlavha «Uzoq yo‘l», ostida «Yulduz (6, 4) da. Bloklar — 12 tagacha.». «0 / 10». «Maslahat»: «Kataklarni sanang: avval o‘ngga, keyin tepaga».
  Yetsa: «Yetib bordi!» va konfeti.
- **Bola qiladi:** `repeat` ichiga bloklar qo'yadi, «▶ Ishga tushir», hisobni kuzatadi.
- **Tekshiruv:** dastur tugaganda qahramon yulduzda va animatsiya soni yetdi (avto); 2-pog'onadan — har qadamda.
- **Xatoda:** animatsiya kam — Kamvoy «Oz qoldi!»; qadamdan keyin animatsiya yo'q — Kamvoy «Animatsiya qani?»; 12 tadan ko'p blok — Ortiqvoy «Joy qolmadi!»; yulduzda emas — Kamvoy «Yulduz bu yerda emas!».

## 12 · Xulosa: animatsiya

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Animatsiya
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: animatsiya»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Animatsiya». Coddy: «Kostyumlar almashdi — men jonlandim.» Ikki karta: «Animatsiya — Kostyumlar navbat bilan almashadi» (ikki kostyum rasmi va ⇄) va «switch costume to — Kostyumni almashtir» (blok rasmi); o'ngda maydon, Coddy qo'l silkitib yuradi (10-qadamdagi dastur takrorlanib turadi).
- **Tayanch gaplar:**
  1. «Animatsiya — kostyumlar navbat bilan almashsa, qahramon jonlanadi.»
  2. «repeat bilan animatsiya ko‘p marta bo‘ladi — har qadamda.»
- **O'z so'zi bilan:** «Qaysi o‘yinda qahramon yurganda oyog‘i qimirlaydi?» — o'yinlardagi animatsiyalar haqida.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi; misol aytadi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 3 · Tovush
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: tovush»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓; Coddy 3-bekatda. Coddy: «Oxirgi bekat: tovush — tugma bosilsa, ovoz chiqaraman.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — tovush va o‘yin.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: play sound

- **Vaqt:** 0:38–0:40 (2 daqiqa)
- **Bekat:** 3 · Tovush
- **Ekran:** proyektor — Blok studiya (ustoz, o'yin) · bola «Ustoz ekraniga qarang» («Ustoz tovushni ko‘rsatyapti — tinglang»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Tugma bosilsa — tovush», ostida «play sound — tovushni chal.». Javonda yangi oila «Tovush» (pushti doiracha), unda `play sound qadam`; yana Hodisa, Harakat, Ko'rinish. Maydonda yulduz (5, 0), Coddy (0, 0). Dastur bo'sh; asosiy tugma «▶ Boshlash».
  2. Ustoz `when → key pressed`, ostiga `move right` va `play sound qadam`; keyin ikkinchi dasturcha: `when space key pressed`, ostiga `switch costume to xursand` va `play sound jiring` (tovush nomini bosib tanlaydi: qadam · sakrash · jiring · tuk).
  3. «▶ Boshlash»; ustoz → ni besh marta bosadi — har bosishda Coddy yuradi, ustida «♪ qadam», karnaydan qadam tovushi. Yulduzda ishora: «Yulduzdasiz — space bosing». Ustoz space bosadi — Coddy xursand, «♪ jiring», konfeti, «Yetib bordi!».
- **Tayanch gaplar:**
  1. «play sound — tovushni chal. Tovush hodisaga ulanadi: tugma bosilsa — ovoz.»
  2. «Noutbukingiz jim: tovush chalinsa, qahramon ustida ♪ chiqadi. Ovozni katta ekranda eshitamiz.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** rangini aytadi: «Tovush oilasi — pushti.»; to'rt tovushni birma-bir chalib eshittiradi; o'yin paytida → va ← qadam almashtirmasligini eslatadi.
- **Ustoz qiladi:** dasturchalarni tuzadi, «▶ Boshlash», → va space ni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi va tinglaydi.
- **Tekshiruv:** yo'q.

## 15 · Tovush: pog'onalar

- **Vaqt:** 0:40–0:53 (13 daqiqa)
- **Bekat:** 3 · Tovush
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'yin): 1 → 2 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Tovush bering!». Coddy: «Tugma bosilsa — qadam, yulduzda — jiring.» Chapda katta son «Ikki pog‘onani tugatdi 6 / 14»; o'ngda zinapoya: 1 «Qadam tovushi» · 2 «Yulduzda quvoning» · ★ «O‘z qahramoningiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Dasturcha tuzing, «Boshlash»ni bosing va o‘ynang. Tovush chalinsa — ♪ ni ko‘rasiz.»
  2. «★ da qahramoningizni o‘zingiz jonlantirasiz: har tugmaga o‘z kostyumi va tovushi.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; ★ dagi topilmalarni ovoz chiqarib maqtaydi («Qarang, uning qahramoni tepaga yurganda hayron bo‘ladi»); 16-qadam uchun ikki-uch bolani belgilab qo'yadi (proyektorga ism chiqmaydi).
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda Hodisa, Harakat, Ko'rinish, Tovush; asosiy tugma «▶ Boshlash». Hamma pog'onada ishora boshida: «Dasturcha tuzing, keyin ▶ Boshlash». 2-pog'onadan dastur oldingi pog'onadagi dasturchalar bilan ochiladi (`prog: 'oldingi'`, 4-darsdan).
  1-pog'ona. Sarlavha «Qadam tovushi», ostida «Har qadamda — ♪ qadam.». Yulduz (4, 0). «Maslahat»: «→ dasturchasiga tovush blokini ham ulang».
  2-pog'ona. Sarlavha «Yulduzda quvoning», ostida «Yulduzga yeting va space bosing.». Yulduz (3, 2). «Maslahat»: «space uchun yangi dasturcha: kostyum va tovush».
  ★ qo'shimcha. Sarlavha «O‘z qahramoningiz», ostida «Har tugmaga — o‘z kostyumi va tovushi.». Yulduz (6, 4). «Maslahat»: «Har dasturchaga switch costume to va play sound qo‘shing». Erkin ijod (36-qaror).
  Yetsa: «Yetib bordi!» va konfeti.
- **Bola qiladi:** dasturchalar tuzadi, o'ynaydi; ★ da kostyum va tovushlarni o'zi tanlaydi.
- **Tekshiruv:** avto — 1-pog'ona: yulduzga yetdi va → dasturchasida `play sound qadam` chalindi; 2-pog'ona: yulduzda space bosildi, space dasturchasida `switch costume to xursand` va `play sound jiring` bajarildi; ★: yulduzda space, o'yinda kamida 2 xil kostyum va 2 xil tovush.
- **Xatoda:** 4-darsdagidek (Bo'shvoy — hodisa bloki yo'q, tugma dasturchasi yo'q); tovush chalinmadi — Kamvoy «Tovush qani?»; ★ da hammasi bir xil — Kamvoy «Hammasi bir xil-ku!».

## 16 · Dasturchalaringizni o'qib bering

- **Vaqt:** 0:53–1:00 (7 daqiqa)
- **Bekat:** 3 · Tovush
- **Ekran:** proyektor — Blok studiya (ustoz, o'yin, dastur bo'sh) · bola — oxirgi yechgan pog'onasi o'z dasturchalari bilan (A·1, 20.11); hech narsa yechmagan bolada — «Ustoz ekraniga qarang»
- **Sahna:** 12-bo'lim 3-band: bola o'z dasturchalarini ovoz chiqarib o'qiydi («→ bosilganda — move right, switch costume to xursand, play sound qadam…»), ustoz o'shalarni tuzadi va sinf bilan o'ynaydi. Bu qadamda sinf bolaning tovushlarini birinchi marta eshitadi (noutbuklar jim edi). Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Dasturchalaringizni o‘qib bering». Maydonda yulduz (6, 4); dastur bo'sh. Coddy: «Siz o‘qiysiz — men o‘sha kostyum va tovush bilan o‘ynayman.»
  2. Bola o'qiydi, ustoz tuzadi, «▶ Boshlash» — sinf qaysi tugmani bosishni aytadi, ustoz bosadi; karnaydan bolaning tovushlari.
  3. Ikki-uch bola.
- **Tayanch gaplar:**
  1. «Kim dasturchalarini o‘qib beradi? Qaysi tugma — qaysi kostyum, qaysi tovush?»
  2. «Sinf, qaysi tugmani bosay? Tinglang!»
- **O'z so'zi bilan:** bolani maqtaydi; «Bu qahramon qaysi kostyumda yulduzga yetdi?» deb sinfdan so'raydi.
- **Ustoz qiladi:** tuzadi, o'ynaydi.
- **Parta:** o'z ekrani — o'qib berish uchun.
- **Bola qiladi:** o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 1:00–1:03 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Qahramoningiz jonlandi!». Bugungi so'z: «Animatsiya — Kostyumlar navbat bilan almashadi». Pastda: ✓ Kostyum · ✓ Animatsiya · ✓ Tovush. Kichik karta «Keyingi dars · 8 · Shart».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: kostyum, animatsiya, tovush.»
  2. «Bugungi so‘z — animatsiya: kostyumlar navbat bilan almashsa, qahramon jonlanadi.»
  3. «Keyingi darsda — shart: dastur yurishdan oldin yo‘lni tekshiradi.»
- **O'z so'zi bilan:** «animatsiya» nimaligini bolalardan aytdiradi; ikki-uch boladan qaysi kostyum va tovushni tanlaganini so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Qahramoningiz jonlandi!». Coddy o'rniga qahramon (★ dagi oxirgi kostyumida): «Kostyum almashtirdingiz, jonlantirdingiz va ovoz chiqardingiz.» «Siz bugun»: N marta kostyum almashtirdi · N ta animatsiya tuzdi · N marta tovush chaldi — bolaning o'z muvaffaqiyatli dasturlaridan (haqiqiy son; **KOD**). «Keyingi darsda shart bilan ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:03–1:06 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N marta kostyum almashtirdi · N ta animatsiya tuzdi · N marta tovush chaldi; o'ngda bolalar qahramonlari — har biri o'z kostyumlarini navbat bilan almashtirib turadi. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda shart bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Multfilm ham, o‘yindagi qahramon ham shunday jonlanadi: kostyumlar almashadi.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–4-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 5-qadam: «Keyingi»ni bola o'zi bosadi (bo'laklar birma-bir yonadi).
- 7, 10, 14-qadam (ustoz ko'rsatadi): dastur tayyor turadi — bola o'zi «▶ Ishga tushir» (14-qadamda «▶ Boshlash», keyin → va space) ni bosadi.
- **Tovush:** solo'da bolaning noutbukida chalinadi (86-qaror) — 14-qadamda ishora «Ovozni yoqing — tovush eshitiladi»; «♪» belgisi ham chiqadi.
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-007-kostyum-tovush-v1` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Animator» (`animator`) — 11-qadamda 2-pog'ona bajarildi (har qadamda animatsiya); «Ovozli qahramon» (`ovozli`) — 15-qadamda 2-pog'ona bajarildi (yulduzda xursand bo'lib jiringladi).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk (Coddy qanday qo'l silkitadi). Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating, keyin bolalar o'zi bajaradi.
- **Kostyum — qahramonning bitta rasmi, kiyim emas.** Hukda shunday deb bir marta ayting; keyin butun darsda faqat «kostyum» (rasm, ko'rinish emas). Kostyumlar to'rtta: xotirjam, xursand, hayron, o'ylanadi. Har ishga tushirishda qahramon xotirjamdan boshlaydi.
- Bugungi so'z bitta: **animatsiya — kostyumlar navbat bilan almashsa, qahramon jonlanadi.** Bolaning topshiriqlarida animatsiya — «xursand, keyin xotirjam» juftligi; sahnada hisob «Animatsiya: N / M».
- Yangi bloklar: `switch costume to` — kostyumni almashtir (Ko'rinish oilasi, feruza); `play sound` — tovushni chal (Tovush oilasi, pushti). Kostyum va tovush nomi blokdagi yozuvni bosib tanlanadi — sekin, ikki marta ko'rsating.
- **Tovush:** proyektor karnayi yoqilgan bo'lsin, o'ng tepadagi qatorda «Ovoz yoqiq». Jonli darsda bolalar noutbuki jim — tovush chalinsa, qahramon ustida «♪ qadam» chiqadi; bolalarga buni 14-qadamda ayting. Sinf bolalar tovushini 16-qadamda katta ekranda eshitadi — shuning uchun 16-qadamni qisqartirmang.
- 1–2-bekat — oddiy dastur («▶ Ishga tushir»); 3-bekat — 4-darsdagi o'yin («▶ Boshlash», strelkalar). O'yin paytida proyektorda → va ← qadam almashtirmaydi — keyingi qadamga «Keyingi» bilan o'ting. «To‘xtadik. Qo‘llar klaviaturadan.» kelishuvini eslating.
- Yulduz qahramonini tanlagan bolada qo'l yo'q — uning kostyumlari yuzida farq qiladi. «Qo'l silkitish» deb faqat Coddy haqida ayting; bolaga — «xursand, xotirjam».
- Bolalar o'zi ishlayotganda (8, 11, 15-qadam) proyektorda — nechta bola bajargani va «Yordam so‘radi: N ta noutbuk». Ekranda soat yo'q: qachon to'xtashni siz hal qilasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD — tasdiqdan keyin, qurish rejasiga kiradi)

1. **Ko'rinish oilasi va `switch costume to` bloki** (Blockly, `blockly.js`): rangi — savol 4 (feruza); kostyum ro'yxati (xotirjam · xursand · hayron · o'ylanadi) — 3-darsdagi `JrSon` kabi oq kapsula, ro'yxatda har kostyum yonida kichik yuz (bolada — o'z qahramoni, proyektorda — Coddy; `hero({ k, rang, mood, lite: true })` / `robot({ pose, yuz, lite: true })`). Javondagi HTML blok ham shunday. Yangi rasm chizilmaydi.
2. **Kostyum sahnada** (`sahna.js`, katak/maydon sahnasi): qahramon SVG'si kostyum almashganda qayta chiziladi — bola qahramoni `hero({ k, rang, mood })`, Coddy `robot({ pose, yuz })` (moslik jadvali «Maydon va bloklar»da); joyi va maydon yorlig'i o'zgarmaydi. Har ishga tushirish / o'yin boshida — xotirjam; dastur tugagach oxirgi kostyumda qoladi. Yangi chiziladigan SVG'dagi ichki raqamlar (`UID`) to'qnashmasin — ustoz va bola oynasi yonma-yon ochilganda ham.
3. **Tovush oilasi va `play sound` bloki:** rangi — savol 4 (pushti); tovush ro'yxati: qadam → `qadam`, sakrash → `sakra`, jiring → `yulduz`, tuk → `tuk` (`tovush.js` dagi kuylar; yangi kuy yo'q). Chalish qoidasi o'zgarmaydi (`ovozShumi`: ustoz/yonma — doim, bola — faqat solo'da). Hamma ekranda qahramon ustida «♪ <nom>» belgisi (~0,7 soniya, qahramonni yopmaydi).
4. **Ikki rejim bir darsda:** hozir `DARS.dasturchalar` butun dars uchun. Kerak: 1–2-bekat ekranlarida bitta dastur va «▶ Ishga tushir», 3-bekat ekranlarida (`bosh.oyin`) bir nechta dasturcha va «▶ Boshlash» — ekran bo'yicha bayroq.
5. **`repeat` — 5-dars dvigatelidan** (hali qurilmagan): C-blok, ichiga bloklar; javondan bosilgan blok qayerga tushishi, ichma-ich ijro (`ijrochi.js` `ichki`). Bu dars 5-dars qurilgandan keyin quriladi. Animatsiya hisobi `repeat` ichidagi har ijroni sanaydi.
6. **Yangi tekshiruvlar** (topshiriq e'lonidan): `kostyum` — dastur tugaganda kostyum; `belgi` — kostyum belgili kataklar (katakda kichik yuz va nom; qahramon katakdan chiqayotganda yoki dastur shu katakda tugaganda kostyumi tekshiriladi); `animatsiya: N` — xursand → xotirjam juftlari soni, `harQadam` — har `move` dan keyin kamida bitta juft; sahna tepasida «Animatsiya: N / M»; `tovush: { tugma, nom }` — o'sha tugmaning dasturchasida o'sha tovush o'yinda chalindi; `oxiri: 'space'` — yulduzga yetganda o'yin to'xtamaydi, ishora «Yulduzdasiz — space bosing», yulduzda space dasturchasi tugaganda «Yetib bordi!»; ★ erkin — o'yinda ≥ 2 xil kostyum va ≥ 2 xil tovush. Muammocha gaplari — «Yordam va xato» jadvali (haqiqiy nom va sonlar bilan).
7. **Huk kartalari — kostyum turi:** A — Coddy bir marta 2-kostyumga o'tadi; B — Coddy joyida chapga-o'ngga uch marta silkinadi (kostyum o'zgarmaydi); C — 1 ⇄ 2 olti marta (0,35 soniyadan). Huk va 5-qadamda Coddy'ning o'z CSS harakatlari o'chiq (rasm qotgan) — aks holda `quvonadi` pozasi o'zi sakraydi va A/B sinovi buziladi. Yonidagi «1-kostyum», «2-kostyum» kartochkalari.
8. **Yangi so'z ekrani** (5-qadam): `raqam` ishi bor (3-, 4-darsdan); 3-bo'lakda Coddy kostyumlari navbat bilan almashib turadi. 12-qadam va 18-qadamda ham shu almashish (takrorlanib).
9. **Natija va yutuq turlari** (`DARS.natija`): «marta kostyum almashtirdi» (muvaffaqiyatli dasturlarda bajarilgan `switch costume to`, kostyum haqiqatan o'zgargan marta), «ta animatsiya tuzdi» (2-bekat bajarilgan pog'onalari), «marta tovush chaldi» (muvaffaqiyatli o'yinlarda bajarilgan `play sound`); yutuqlar `animator`, `ovozli`. Yakunda bolaning qahramoni ★ dagi oxirgi kostyumida.

## Savollar (tavsiya — A)

1. **Yangi so'z — «animatsiya»** (5-qadam, rasm bilan: «kostyumlar navbat bilan almashsa, qahramon jonlanadi»); «kostyum» — blok so'zi, hukda rasm bilan va ustozning bitta gapi bilan kiradi (4-darsdagi «dasturcha»dek). Sabab: hukning javobi aynan animatsiya; dastur mavzusidagi asosiy fikr ham shu. B — yangi so'z «kostyum», «animatsiya» faqat bekat nomi va ustozning og'zaki so'zi.
2. **Kostyumlar — 4 ta: xotirjam, xursand, hayron, o'ylanadi** — qahramonlarda ham, Coddy'da ham tayyor (yangi rasm yo'q). B — 6 ta (+ xafa, mudroq — qahramonlarda bor, Coddy'ga yangi yuz chizish kerak; 8-darsdagi «devorga tegdi» uchun xafa foydali bo'lardi).
3. **Blok yozuvi — Scratch'dagidek: `switch costume to xursand`, `play sound qadam`** (qiymat o'zbekcha, kapsulada kichik yuz). B — qisqa: `costume xursand`, `sound qadam` (dastur ustuniga osonroq sig'adi, `repeat` ichida ham). C — A ga qo'shimcha `next costume` (navbatdagi kostyum; ro'yxat tartibini tushunish kerak — 9 yoshliga og'irroq).
4. **Oila va rang — ikki yangi oila: Ko'rinish (feruza, #14B8A6 atrofida) va Tovush (pushti, #D9468F atrofida — Scratch'dagi tovush rangiga yaqin).** Har oila — bitta ish (61-qaror). B — kostyum Gap oilasiga (binafsha; Scratch'da `say` va kostyum bitta oilada), tovush — alohida pushti. Ikkala holatda ham 5-darsdagi Takrorlash rangi bilan to'qnashmasligi tekshiriladi.
5. **Tovush sinfda — 86-qaror o'zgarmaydi:** jonli darsda bola noutbuki jim, qahramon ustida «♪ qadam» belgisi; sinf tovushni katta ekranda eshitadi (14-qadam — ustoz, 16-qadam — bolalar dasturi); solo'da bola noutbukida. B — shu darsda bola noutbuklari ham past ovozda chaladi (ustoz panelida «Bolalar ovozi» tugmasi; 14 noutbuk birdan — shovqin). C — naushnik bo'lgan sinfda B, bo'lmasa A.
6. **Kutish bloki — yo'q:** har blok baribir vaqt oladi; `switch costume to` 0,4 soniya turadi (boshqa bloklar 0,7) — animatsiya tez va ravon ko'rinadi, yangi blok va kasr son kerak emas. B — `wait 1 seconds` bloki (Scratch'dagidek; sonlar 1–3, kostyum bloki ham 0,7 soniya). C — kutish yo'q, kostyum bloki ham 0,7 soniya (hamma blok bir xil, animatsiya sekinroq).
7. **Huk — «Coddy qo‘llarini silkitsin»:** A «Bitta kostyum qo‘yamiz» · B «Coddy’ni silkitamiz» · C «Kostyumlarni almashtiramiz». B — huk tovushdan: «Coddy tugma bosilganda jiringlasin — qanday?» (lekin bolalar noutbuki jim — sinovni his qilish qiyin).
8. **Rejim — 1–2-bekat «▶ Ishga tushir» (bitta dastur), 3-bekat — o'yin (hodisa); 3-bekatda «yulduzda space» sharti** (yulduzga yetganda o'yin to'xtamaydi, yulduzda space bilan tugaydi). B — butun dars o'yin rejimida (har topshiriq hodisa bilan; `repeat` ichidagi animatsiya tugmaga ulanadi); space sharti 4-darsdagidek — oldin bosilgan bo'lsa yetarli (dvigatel o'zgarmaydi, lekin «yulduzda quvoning» ma'nosi yo'qoladi).
9. **Erkin ijod — 15 · ★ «O‘z qahramoningiz»** (har tugmaga o'z kostyumi va tovushi; 16-qadamda sinfga ovoz bilan ko'rsatiladi) **va manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy (sinfda o'lchanmagan).
2. **5- va 6-dars manbalari hali yo'q:** `repeat` blokining yozuvi, oilasi, rangi va javondan blok uning ichiga qanday tushishi 5-darsda hal bo'ladi — bu darsdagi `repeat` gaplari («repeat 3 ichiga…») o'shanga moslanadi. Kirishdagi «O‘tgan darslarda» kartasi va 6-dars yakunidagi «Keyingi dars · 7 · …» nomi («Kostyum va tovush») bir xil bo'lishi tekshiriladi.
3. Maydonda qahramon kichik — kostyumlar orasidagi farq (ayniqsa xotirjam va hayron) proyektorda va noutbukda ko'zga tashlanadimi. Xursand va o'ylanadi — qo'l bilan, ko'rinishi aniq; Yulduz qahramonida faqat yuz.
4. Coddy'ning `quvonadi` pozasi o'zi sakrab turadi — animatsiyada «xursand» kostyumi qimirlab turgani bolani chalg'itadimi (huk va 5-qadamda o'chiriladi, studiyada qoladi).
5. Kostyum bloki 0,4 soniya (savol 6) — 9 yoshli bola har almashishni ko'rib ulguradimi; hisob «Animatsiya: N / M» yordam beradimi.
6. 3-bekat: dasturchaga `play sound` qo'shilsa, u uzoqroq bajariladi — bola strelkani tez bossa, ba'zi bosishlar o'tkazib yuboriladi (4-darsdagi «navbat kutmaydi» qoidasi); sinfda sezilsa, navbat kerak.
7. Bola noutbuki jim — tovush mavzusidagi darsda bola o'z tovushini eshitmaydi; «♪» belgisi va 16-qadam yetarlimi, yoki savol 5-B kerakmi — sinfda ko'riladi.
8. Ranglar (feruza, pushti) 5-darsdagi Takrorlash rangi, Ortiqvoy (#E45BD6) va asosiy tugma (coral) bilan yonma-yon ajraladimi — etalon ranglar bilan solishtiriladi.
9. `switch costume to xursand` uzun blok — `repeat` ichida (ichkariroq) dastur ustuniga sig'adimi; sig'masa dastur kichrayadi (3-darsdagi `go to` kabi), 11 · 3 va ★ da 8 ta blok bilan o'lchanadi.
10. Ruscha matn hali yo'q.

## Filtr qarorlari (20.11 — bosh seans; 5- va 6-dars qurilgandan keyin)

1. **A·2 — maslahatlar yo'nalish beradi** (9 ta almashtirildi): 8 · 1 «Yulduzga yetgach — kostyumni almashtiring» · 8 · 2 «Blokdagi nomni bosing — ro‘yxatdan tanlang» · 8 · 3 «Belgili katakka yetgach — o‘sha kostyumni qo‘ying» · 11 · 1 «Avval yulduzga yeting. Keyin animatsiyani takrorlang» · 11 · 2 «Har qadamdan keyin animatsiya: qadam ham repeat ichida bo‘lsin» · 11 · 3 «Yo‘l ikki bo‘lak — har bo‘lakka o‘z repeat» · 11 · ★ «Kataklarni sanang: avval o‘ngga, keyin tepaga» · 15 · 1 «→ dasturchasiga tovush blokini ham ulang» · 15 · 2 «space uchun yangi dasturcha: kostyum va tovush». Xato ishoralari (muammocha chiqqandan keyin) — manbadagidek.
2. **A·1 — 16-qadam:** bola oxirgi yechgan pog'onasini o'z dasturi/dasturchalari bilan ko'radi.
3. **Bir ma'no — bir so'z (4–6-darsdagi so'zlar):** «Bu tugma uchun dastur yo‘q-ku…» o'rniga 4-darsdagi «Bu tugma uchun dasturcha yo‘q-ku…»; «Bloklar ko‘p!» o'rniga 5–6-darsdagi «Joy qolmadi!» (chegara 12).
4. **17-qadam tayanch gapi** 8-dars loyihasiga moslandi: «Keyingi darsda — shart: dastur yurishdan oldin yo‘lni tekshiradi.» (8-dars — «yo‘l bormi» sharti; tasdiqlansa, so'z o'sha yerdan.)
5. **5-dars `repeat`** qurilgan (manbadagi «5-dars hali yo'q» eslatmasi eskirgan): javondan bosilsa tanlanadi, keyingi bloklar ichiga tushadi.
6. **Kostyum ro'yxatida kichik yuzlar** (KOD 1) — birinchi qurishda yo'q: ro'yxat matn bilan (xotirjam · xursand · hayron · o‘ylanadi). Kostyum belgisi katakda — nomi bilan (yuzsiz). Sabab: Blockly ro'yxatiga rasm qo'yish yangi ish; nom yetarli; keyin qo'shsa bo'ladi.
7. **Tovush belgisi «♪ nom»** — qahramon ustidagi pufak (0,7 soniya).

## Qurishdagi qarorlar (20.11 — dars papkasi `../darslar/007-kostyum-tovush/`)

1. **Dvigatel (KOD 1–4, 6, 9):** Ko'rinish (`costume`, feruza #14B8A6) va Tovush (`sound`, pushti #D9468F) bloklari, qiymat ro'yxatdan (JrSon); maydonda qahramonning to'rt kostyumi oldindan chiziladi (`katak.js` `o.kostyum`), ko'rinadigani almashadi (`sahna.js` kostyumKor); har ishga tushirishda xotirjam; animatsiya hisobi (`xursand → xotirjam`, «Animatsiya: N / M»), har qadamdan keyin animatsiya, kostyum belgisi (katakda nom), o'yinda kerakli tovush, yulduzda space, «kamida ikki xil»; natija `K` (kostyum almashgan marta) va `T` (chalingan tovush). Ikki rejim: `DARS.dasturchalar = 'oyin'` — bir nechta dasturcha faqat o'yin ekranlarida (`BL_DASTURCHA` endi ish maydoni yoki ekranga qaraydi; 4-darsda `true` — o'zgarishsiz).
2. **Javon bekatga qarab:** 1–2-bekatda Hodisa va Tovush yashirin (hodisa bloki bitta dasturga ulanmaydi), 3-bekatda Takrorlash yashirin (o'yin dasturchasi takrorlash ichini bajarmaydi). Dvigatel: studiya `holat: 'yoq'`.
3. **Javonda kostyum/tovush bloki qiymatsiz ko'rinadi** («switch costume to», «play sound») — to'liq yozuv javon ustuniga sig'masdi; qiymat dasturda bosib tanlanadi (dasturga «xursand» / «qadam» bilan tushadi).
4. **Savol sarlavhasi** «Coddy qanday qo‘l silkitadi?» (bo'lim nomidagi gap) — «Coddy qo‘llarini silkitsin — qanday qilamiz?» uch qatorga tushardi.
5. **15-qadam doskasida** «Har belgi — …» izohi yo'q (ish zonasiga sig'masdi).
6. **Huk:** kartalar sinovi `data-dastur` (cxu, w — silkinish), natija kartada oldindan (`data-ok`); kostyumlar qotgan rasm (pozalarning o'z harakatlari o'chiq).
7. **«Tovush qani?» va boshqa o'yin muammochalarida o'yin to'xtamaydi** (4-darsdagidek): bola ■ To'xtatadi, dasturchani tuzatadi, ▶ Boshlaydi.
8. **Sinovlar:** `sinov/dvigatel/kostyum.mjs` 34/34 (mustaqil simulyatsiya), `sinov/demo/007-toliq-dars.mjs` 41/41 (natija qo'lda hisoblangan: 57 · 4 · 21, 7 · 1 · 4, 64 · 5 · 25), `007-solo.mjs` 28/28, `007-tovush.mjs` 5/5, setka toza. Solo sinovi topgan xato: HTML'dagi tayyor dasturda kostyum/tovush qiymati o'qilmasdi (`blockly.js` blMa — `data-q`) — tuzatildi.

