# Mexanizm navbati — modul seanslarining takliflari bir joyda (06.10.2026)

Manba: 9-Modul `feedback/F-1005-9modul/JURNAL.md` (16 band) · 10-Modul `feedback/F-1005-10modul/JURNAL.md` (13) · 11-Modul `feedback/F-1005-11modul/JURNAL.md` (7), «MEXANIZM-TAKLIF» bo'limlari.
Jami 36 taklif; bir mavzudagilar bitta bandga birlashtirildi, shuning uchun band raqami taklif raqamiga mos emas. Qavsda — manba (`9/12` = 9-Modul jurnali, 12-band). To'liq matn, sabab va fayl — o'sha bandda. Bu fayl faqat yig'ma va ustuvorlik; qaror asosiy seansda va foydalanuvchida.
Holat (06.10 10:55): `src/skelet/NamunaDars.jsx` va `src/qolip/` 05.10 00:29 dan beri o'zgarmagan — 36 bandning birortasi hali qo'llanmagan.
Nega hozir: 11-Modul (16 dars) «qur» ga yaqin, 12-Modul MD bosqichini boshlaydi. Skelet tuzatilmasa, har yangi dars bir xil tuzoqni o'z faylida qayta chetlab o'tadi,
keyin hammasini supurish kerak bo'ladi (hozir 9-Modulda 12, 10-Modulda 11 dars shunday qurilgan).

## Asosiy seans uchun prompt (foydalanuvchi nusxalab beradi)

```
Siz ASOSIY (mexanizm) seanssiz. Parallel: 9-Modul (src/7-Modull, QA), 10-Modul (src/8-Modull, qurilmoqda), 11-Modul (src/9-Modull, «qur» ga yaqin), 12-Modul (src/10-Modull, MD bosqichi).
Ish: feedback/MEXANIZM_NAVBAT_2026-10-06.md — modul seanslarining 36 taklifi (guruhlangan). Avval P1 — 11-Modul «qur» idan oldin.
Tartib: har guruh uchun tashxis (bandni manbasida o'qing, kodda tekshiring, platforma standartini grep bilan o'lchang) → BITTA qaror sahifasi (variantlar + tavsiya, javob qatori) →
mening javobimdan keyin qo'llash → `npm run gates` skeletda 12/12 va `npm run karta` → modul jurnallariga «MEXANIZM-JAVOB» qatori (nima qo'llandi, ular o'z darslarida nima qiladi).
Qurilgan darslarga (9, 10-Modul) tegmaysiz — supurish ro'yxatini o'sha seans jurnaliga yozasiz; 8+ fayl — KATTA_TOZALASH.md.
Darvoza o'zgarishi — avval git tarixidagi xatoli versiyada xatoni topishini isbotlang. Agentlar, commit, push — faqat ruxsatim bilan. Hisobot qisqa, o'zbekcha.
```

## P1 — skelet va qolip: har yangi darsga ko'chadigan tuzoqlar (11-Modul «qur» idan oldin)
1. **LiveGate sarlavhasi qattiq yozilgan** — `NamunaDars.jsx:2063` «Tizim arxitekturasi darsi» → `tr(LESSON_META.lessonTitle)` (10/7). 9-Modulda 5 darsda QA saytiga chiqqan edi, 06.10 tuzatildi (F-1006-50).
2. **Bashorat tanlangach yo'qoladi** — `bashorat={!taxmin && …}`; qolip `QBashorat` ixcham holatga o'tsin + «faol element» belgisi (`q-faol`: halqa + puls, reduced-motion da halqa) (9/13). Foydalanuvchi: «qat'iy qonun».
3. **Kartochkalar alohida ekran** — podium → kartochkalar → yakun; P-058 «yakun (kartochkalar ichida)» o'zgaradi; `lint:olchov`/SCREEN_META 11 → 12 (9/14). Foydalanuvchi: «qat'iy».
4. **`QKartochka` ga «bosing» ipuchasi** — karta ostida «Kartani bosing — javob ochiladi» + birinchi bosishgacha halqa; Mentor yo'q (9/15).
5. **Test ustidagi «To'g'ri javobni tanlang» yorlig'i** — skelet `NamunaDars.jsx:642` dan olinsin; mavjud 86 fayl — KATTA (9/12a).
6. **Skelet mayda tuzoqlari** — `practice: ou(title)` → `ou(eyebrow)` · arena `TOK`/`QZ_BG_SHAPES` darsning o'z atamalaridan (hozir «Frontend» va emoji) · `rgba(255,79,40,…)` → `fon(T.accent)` ·
   `MentorPracticeStats` `label` · NavNext puls klassi · `Stage` `scrollSignal` 1280 da ham · `SCREEN_INTENTS` (9/9, 9/11, 9/16d, 10/6).
7. **Skelet ruschasi** — «Дождитесь наставника» va «ментор» birga; bitta «Ментор» (10/11).
8. **`Zoomable` ⛶ telefonda mazmun ustida** — ≤640 da `padding-top: 36px`, tugma burchakda; ekran hisobi `{n} / {jami}` `nowrap` (10/8).
9. **Global `.mentor` klassi** dars ichidagi elementlar bilan to'qnashadi — nomlash yoki skop (10/6).
10. **Qolip takliflari** — `QBlok`: `forma` qadam turi, `ortdaIzoh`, `xato` `<p>`, 5 qadamda ixcham bajarilgan qadamlar, 393 da «Ortda» qatori toshadi (9/9, 9/16c, 10/6) ·
    `QPrompt`: `yordam`, `{…}` yonida «masalan: …», oldindan to'ldirilgan tahrirlanadigan qiymat, `{…}` ni JSON bilan adashtirmaslik (9/9, 10/6, 11/1) ·
    `QM.ortda` yorlig'i «Mentor misolini ochib ko'ring» (11/2) · `QVoqea` `mentor` prop · `QTushuncha` vizual chapda · `QYakun` «Bugungi asosiy fikr», uyga vazifa «kim uchun / muddat», kartochkalarsiz `keyingi` ·
    `QMustaqil` bo'sh ustun · `RecapOverlay` bo'sh `<p>` · PM `HwCard` qolipga · o'chiq ikkinchi darajali tugma oddiy matnga o'xshaydi (9/11, 9/16c).
11. **`HtmlCompiler`** — faqat birinchi JS faylni ulaydi, tekshiruv 50 ms da async ni kutmaydi (10/6).

## P2 — darvozalar: yolg'on topilma va teshiklar
12. `til-lint` «sirini-ochamiz» — so'z chegarasi yo'q, «ta'sirini» ni ushlaydi (9/8).
13. `til-lint` «ekran-nomi-tarjimasi» `QKod` `muharrir` propini ushlaydi → darslarda `QKOD_ONG` `a` yashirish naqshi; Write vositasi `\uXXXX` ni harfga aylantirib uni buzadi (9/10, 9/16b).
14. `til-lint` ga «kompilyator: … oyna» qoidasi (error); namuna MD `feedback/F-0929-QA-6modul/14-PmLesson25-v3.md` va 8-Modul darsi tuzatilsin (9/6).
15. `til-lint` `kelajak-okr` `allowFiles` ga 10-Modul (10/1, warn).
16. `lint-olchov` va `lint-tell` MD bosqichida ham (GATE M dan oldin) — «Aynan!» uzunlikka qo'shiladi, tell arena matnini ushlaydi (9/16a).
17. RU teshiklari: `tr()` siz o'zbekcha satr detektori (ru-gate faqat ogohlantiradi) · o'quvchi matnini tekshiruvchi so'z ro'yxatlari faqat o'zbekcha (10/10).
18. RU sarlavha: `scripts/sarlavha-qator.mjs` 6-RU darvozasiga, «ru sarlavha ≤ 44 belgi» (10/12).
19. `lint-dizayn` D1 holatdagi o'q rangini chiziq deb ushlaydi — QOLIP.md naqshi `--uq` o'zgaruvchisi (10/13).
20. O'quvchi matnida kod raqami («6-Modul m6-09») — `lint:til` nomzodi, avval qo'lda (11/4).

## P3 — qonun va konveyer matni
21. Pilot fidbeki umumiy qonunga: 9-Modul QURUVCHI_SABOQ 1–18 (9/12 b–h) va 10-Modul C 19–30 (10/9) → QOIDALAR + `npm run karta`; brend/maket — quruvchi brifida majburiy band + surat-darvoza.
22. 173.2 «4 qadam» → blokda 5-qadam «O'z g'oyangiz» (9/3).
23. P-060: skelet darsida stack repo README'sida (9/7).
24. `1-MD.md` GATE M ro'yxatiga «oldingi PM darsining kod mexanikasi (modul chegarasida ham)» (10/4).
25. MD/quruvchi agent yordamchi fayllari — scratchpad'dagi o'z papkasida (10/3).
26. «Bir fayl — bir muharrir»: resume qilingan agent ham muharrir (11/7).
27. `0-YANGI-MODUL.md` 1-jadvali hamma modulga (kod 1 → LMS 2 … 10 → 12) + «o'quvchi matnida faqat LMS raqami» (11/4).

## P4 — foydalanuvchi qarori kerak
28. Keys banki: K1 Uzum manba qatori (TechCrunch 25.03.2024) (10/5) · yangi keys nomzodlari — Google OKR, Obama 2008 A/B, Facebook 2021 sizish (10/2).
29. Lug'at: «qahva» / «kofe» (11/6) · «intervyu» / «suhbat» (10-Modul 00-TAQIQLAR 6).
30. `motion` paketi platformada yo'q — `package.json` (9/4, 11/3).
31. Darslararo saqlangan natija kalitlari qoidasi (`pm-m7dN-…`) mexanizm darajasida (9/5).
32. Jonli kanal: Mentor ekranida o'quvchi matni — `p_texts` ≤300 belgi yetadimi (11/5).
33. App.jsx `period` hamma modulda eski hisobda — KATTA nomzodi (9/1).
34. `gatem/sahifa.py` qaror sahifasi uchun `javob_nomi` maydoni (9/2, shart emas).
35. Skelet bilan qurilgan 9 va 10-Modul darslarini P1 tuzatishlariga supurish — qachon va kim (KATTA) (yig'uvchi qo'shdi — jurnallarda alohida band emas).
36. 10-Modul pilot qoidalari 9 va 11-Modulga qo'llanishi (10/9 ikkinchi qismi).
