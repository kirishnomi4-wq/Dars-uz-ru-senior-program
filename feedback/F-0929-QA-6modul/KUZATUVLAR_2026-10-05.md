# 6-Modul · Yakuniy MD agentlari kuzatuvlari (05.10.2026, F-1004-70)

Manba: 14 ta yakuniy MD agentining «shubhali joylar» bo'limi (kodda ko'rilgan, oldindan bor kamchiliklar). Har band asosiy seans tomonidan saralandi:
**A** — aniq matn nomuvofiqligi (Mentor/yorliq aytgan narsa ekranda yo'q, tarjima xato, foydalanuvchi qarori) → avtopilotda tuzatiladi (`KUZATUV_A_TOPSHIRIQ` — shu fayl, A bo'limi).
**B** — mantiq/mazmun qarori → foydalanuvchiga (ertalabki sahifa). **C** — platforma bo'yicha (ko'p modul) → `KATTA_TOZALASH.md`.

## A — avtopilotda tuzatiladi (o'quvchi ko'radigan matn; tuzilma/kalitlar o'zgarmaydi)
| # | Dars · ekran | Kamchilik | Tuzatish |
|---|---|---|---|
| A1 | m6-04 s13 | sarlavhada oxirgi nuqta yo'q («Agentga chegara kerak») | nuqta (boshqa sarlavhalar kabi) |
| A2 | m6-05 s6 | SKILL.md tanasi 1/3/12-ekrandagidan farq qiladi («Iliq, do'stona ohang», «asosiy ustunligini», 5-qadam); karta «Misol» haqida gapiradi, misol yo'q | tana 1/3/12-ekrandagi SKILL.md bilan aynan bir xil; «Misol» ishorasi bor narsaga moslanadi |
| A3 | m6-05 s13 | description «Mini-do'kon mahsuloti» — 1/5-ekranda «mahsulotlari» | «mahsulotlari» |
| A4 | m6-06 s4 | nav yorlig'i va 40-soniya ishorasi «AI o'zi qiladi» tugmasini aytadi — bunday tugma yo'q; «kartada» — aslida qatorlar | ekrandagi haqiqiy tugma/qator nomlari bilan |
| A5 | m6-06 arena Q8 | 4-variant uz/ru har xil («Telefonini yostiq yonida…» ↔ «Клиент, который спит…») | ru uz ma'nosiga |
| A6 | m6-07 s9 | sarlavhada oxirgi nuqta yo'q | nuqta |
| A7 | m6-08 s8 | Mentor «kodni solishtiring» — ekranda kod yo'q, ikki prompt | «promptlarni solishtiring» |
| A8 | m6-10 s12 | Mentor «5 qadamni kuzating» — tugma «(N/4)» | Mentor soni tugmadagi bilan bir xil |
| A9 | m6-10 s15 | yorliq «keyingisi: N/5» — aslida joylashtirilganlar soni | yorliq ma'nosiga mos («joylandi: N/5» kabi) |
| A10 | m6-11 s3 | «Kuniga yetkazib beramiz» (= har kuni) — ru «в тот же день» | «O'sha kuni yetkazib beramiz» |
| A11 | m6-11 s14 | Mentor «Ulash» — tugma «Expo Go'da ulash»; xulosa «Endi o'z rejangizni yozing» — reja yoziladigan joy yo'q | Mentor tugma nomi bilan; xulosa bor harakatga |
| A12 | m6-11 uy vazifasi | «ustoz bergan» — darsda doim «Mentor» | «Mentor bergan» |
| A13 | m6-13 s7 | Mentor «Buyurtma yubor» — tugma «▶ Webdan buyurtma yuboring» | Mentor tugma nomi bilan |
| A14 | m6-13 s2 | «AI (Claude)» — repo va 5-Modul Gemini (GATE M 13-q0 A: «Gemini») | «AI (Gemini)» |
| A15 | m6-14 nishon «Slide Talker!» | tavsif «uch qatorni ochdingiz» — kod: ikki raqamdan biri tanlanganda | tavsif shartga mos |
| A16 | m6-14 s1 | ru demo-slayd «человек воспользовались системой» ≠ uz «odam arizasiga javob oldi» | ru uz ma'nosiga |
| A17 | m6-02 s9 | tugma yorliqlarida ② ① teskari tartibda | raqamlar bosish tartibida |

## B — foydalanuvchi qarori (mantiq yoki mazmun; ertalabki sahifada)
| # | Dars · ekran | Kamchilik | Taklif |
|---|---|---|---|
| B1 | m6-02 s0/s4 | sarlavha «nega uch xil ilova chiqdi?» — ekranda uch ilova yo'q (1-bosqich o'chirilgan); s4 MentorNote eskirgan | sarlavha ekrandagiga moslanadi, MentorNote yangilanadi |
| B2 | m6-12 s9 | ish uzoqroq ufqqa qo'yilsa doim «Bu ish kutmaydi — unga kerak narsa allaqachon bor» — ba'zi ishlar uchun noto'g'ri | izoh ish turiga qarab (2 xil matn) |
| B3 | m6-12 s2 | ufqlar «hozir · keyinroq · uzoqroq» ↔ boshqa joyda «Hozir · Uch oydan keyin · Olti oydan keyin» (bir ma'no — ikki nom) | bitta nom |
| B4 | m6-12 arena 9-savol, kartochka «(2006)» | Tesla javobi noaniq; 2006 — e'lon yili | savol/kartochka aniqlashtiriladi |
| B5 | m6-08 s7 | «Davom etish» 4 ulanishdayoq ochiladi — «Tizim ishladi!» natijasini o'tkazib yuborish mumkin | natija ko'ringach ochilsin |
| B6 | m6-08 | «Node» (xarita, case) ↔ «Node.js» | bitta nom |
| B7 | m6-09 s10 / s7 | «✓ Skanerlandi» holati hech qachon ko'rinmaydi; kod panelida `// View qo'shing` boshidanoq | o'lik holat olinadi / boshlang'ich kod tozalanadi |
| B8 | m6-10 s16, ProductDetail | «8-darsdagi ulanish xatosi qoidasi» (Wi-Fi qoidasi 9-darsda); bo'sh `div` (eski emoji o'rni) | ishora 9-darsga; bo'sh blok olinadi |
| B9 | m6-11 s7 | «Xarid qil» bosilganda savat 0 → 2 sakraydi | qo'shish ko'rinadigan bo'ladi |
| B10 | m6-13 s16 | amaliyot «VS Code + `npm run dev`» ↔ 5-Modul «Antigravity + `npm run start:dev`»; 6-qadam «Bajardim» takror | 5-Modul bilan bir xil |
| B11 | m6-03, 06, 07 | nishon sharti («Birinchi urinishda…») faqat bir ekranda; boshqa nishonlar sharti aytilmaydi (151-qonun) | memory «nishon-bonus-qismaslik» bo'yicha qoldirish tavsiya |
| B12 | m6-08 telefon | ⛶ tugmasi case karta sarlavhasining o'ng burchagini yopadi | joyi suriladi |
| B13 | m6-05, 07, 08, 09, 10, 13 — amaliyot ekrani (s16/s17) | «Yana N qadam» tugmasi 1280×773 va 1366×768 da pastki chiziqdan 20–47 px pastda — o'quvchi aylantiradi (layout E, oldindan bor, umumiy amaliyot ekrani `ScreenLivePractice`) | amaliyot ekrani ixchamlanadi (6 dars bitta naqsh) yoki aylantirish qabul qilinadi |
| B14 | m6-12 s10 (VS Code) | «KOD NIMA CHIQARSIN» paneli 3-qadamdan keyin pastki chiziqdan 12–17 px pastda (layout E, oldindan bor) | panel ixchamlanadi |
| B15 | m6-08 s3 | «▶ Buyurtmani boshlash» / «Keyingi qadam →» tugmalari pastki chiziqdan pastda (layout E, oldindan bor) | tugma yuqoriga yoki maket ixchamlanadi |
| B16 | m6-09 s3, m6-10 s3/s7 | harakatdan keyingi yashil xulosa pastki chiziq ostida (Q4 A dagi «test izohi» sinfiga o'xshash, lekin aynan o'sha emas) | Q4 A kabi qabul (tavsiya) yoki ixchamlash |

## C — platforma (KATTA_TOZALASH)
F-1004-66 `lint:tell` yashirin (36 fayl) · F-1004-67 PM refleksiya solo-rejim (19 fayl) · F-1004-68 `'Georgia, serif'` (14 fayl, 122 joy) ·
podium «Natijalar kelmoqda…» `tr()` siz (4a, 4c) · «Badges» yorlig'i 75 faylda (platforma standarti — o'zgartirilmaydi) · inglizcha nishon nomlari (platforma standarti).
