# 📜 PMUSERSTORY (P0) — 2-TUR ETALON-TARIX (2026-07-16 → 2026-07-30)

> **Bu hujjat nima uchun:** `PMLESSON2_ETALON_TARIX.md` (1-TUR) ning jufti. Sof-PM (fikr/g'oya)
> darslar qayta tuzilganda AYNAN shu yo'ldan yuriladi: shu fyuchalar standart, shu so'zlar
> ishlatiladi, taqiqlar buzilmaydi. Qonunlarning o'zi `PM_DARS_ETALON.md` (qonun 14–91,
> 1-B/1-C/1-D) va `PM_Prompt_v8.md`da; bu yerda — yig'ilgan tarix va yo'l-xarita.
> Etalon-fayl: `src/pm/PmUserStoryLesson.jsx` (`pm-m3d2-v3`, M3-D2).

---

## 1. XRONOLOGIYA (qisqa)

| Sana | Nima bo'ldi |
|---|---|
| 07-16 | v3 qurilishi: real iframe-kompilyator, konstruktor, EKRAN-400; 1-ko'rik (8 punkt → qonun 14–20); «formula»→«retsept» |
| 07-22 | TaskSpec/MentorWatchLine/done-mini tug'ildi (32-qonun); 3-audit tozalash |
| 07-24 | **V4 to'liq qayta-qurish:** TestQ, BITTALAB-YOZISH ustaxonasi, kdx-koding, +3 ekran (peer/klinika/prioritet), PairTimer → qonun 48–53; 👦 o'quvchi-darvoza sinovidan O'TDI → **P0 = ETALON** |
| 07-25 | «Tekshiruvchi stoli» (59-qonun), skroll-0 (58), layout-himoya (60), prod-deploy |
| 07-26 | Foydalanuvchi qo'lyozma-daftari: 14 topilma → qonun 61–67; jonli-yadro mustahkamlandi; MATN_KORPUS + lint:til tug'ildi |
| 07-27 | **64 feedback, 82 raund kuni** (F-0727-01…64): abrazets, keys-tili, klinika, lagancha, ustaxona-port → qonun 68–86, korpus 13–19, lint 55 |
| 07-29 | Matn-audit 22 tuzatish (F-0729-08), Zoomable, neon-kapsula, s2 sinf-savoli → har tuzatish coddycamp-etalon-test.vercel.app ga deploy |
| 07-30 | ccProgress sahifa-saqlovi (F-0730-01) |

**Jami: ~90 F-ID/topilma, 78 ta qonunning manbasi (14–91 oralig'i), 17 ekran.**

---

## 2. DARS ANATOMIYASI (17 ekran, scored = 4/6/9)

hook (2 mijoz-so'rovini solishtirish, ovoz) → rule (YouTube 3 namuna-karta preview) →
tap-mashq (harakat/sabab) → konstruktor (3 bo'lakni KIM/NIMA/NATIJA slotlariga) →
**TEST-1** → **KEYS-SLAYD** (K11 milkshake, 5 slayd + 2 bashorat) → **TEST-2** →
**USTAXONA** (3 hikoya bittalab) → tekshiruvchi-stoli (peer) → **TEST-3** →
klinika (so'rov-sinovi) → **koding** (`hikoyaYasa` PmCompiler) → prioritet (🔥⚡🌱) →
yakuniy so'z (PairTimer + 1 qator) → uyga-vazifa (topshiriq-karta) → podium → summary.

**Markaziy retsept:** «Men [KIM] sifatida, [NIMA]ni xohlayman, [NATIJA] uchun» —
slot-ranglar: KIM=ko'k · NIMA=sariq(amber) · NATIJA=yashil (butun dars shu semantikada).

**Artefakt-zanjir (2-TURning yuragi):** ustaxona (3 hikoya yoziladi, localStorage
`pm-m3d2-stories`) → 📒 daftar-strip → koding (O'Z hikoyalari kartaga aylanadi) →
prioritet (O'Z hikoyalari darajalanadi) → reflection (yoddan aytish) → HW-shartnoma
(`HW_KEY` — keyingi dars o'qiydi). Uyda +2 = 5 hikoya.

---

## 3. FYUCHALAR (2-TUR standarti) va evolyutsiyasi

1. **USTAXONA = bittalab-yozish** (48+80-qonunlar, 4 iteratsiya): havodagi 1-2-3
   qadam-indikator (karta emas) · YAGONA muharrir-karta · yozish paytida daftar
   KO'RINMAYDI · saqlash-shartlar yumshoq hint bilan (NATIJA≠NIMA, KIM takror emas) ·
   «✓ Saqlash» doim qisqa matn · 3/3 da avto-done (honor-tugma yo'q) · inputlar
   ma'no-rangida puls (81) · namuna alohida «📋 Namuna» panelida, placeholder emas (85).
2. **KEYS-SLAYD + bashorat** (33/56-qonun): 5 slayd bosqichma-bosqich, kamida 2 slayd
   oldidan mikro-bashorat (ball YO'Q — ochiq aytiladi), yakunda hook-tanlov shaxsiylashadi
   («Dars boshida siz "X" degandingiz…»), bashorat DOIM asl javobni ochadi.
3. **Tekshiruvchi stoli** (59-qonun): 3 TAYYOR namuna-karta, bittalab ✓/✕ hukm, aynan
   bittasi to'g'ri, jazo yo'q — noto'g'rida neytral izoh. (Eski «sherik-tekshiruv» BEKOR —
   server matn tashimaydi, 👦 «hammasiga ✓ bosaman» deb fosh qilgan.)
4. **Klinika** (so'rov-sinovi): so'rov «Ish stoli»da bo'lak-ma-bo'lak o'qiladi, yetishmagan
   joyda qizarib to'xtaydi, oqibat ko'rinadi; tuzoq-chip mavhum-foyda sinfidan, 4 chip.
5. **Koding = o'z matnini koddan o'tkazish** (50+87): «aylantirish-vizual» launch
   (kod-chip ➜ O'Z hikoya-kartalari «📒 Bular — o'z hikoyalaringiz»), PmCompiler
   to'liq-ekran, 3 jonli shart-chip, kod-avtosaqlash, kdx-skip takrorlash-yo'li (89),
   takeaway: «User Story kod yozishdan OLDIN yoziladi».
6. **Prioritet-doska** (52): 3 daraja 🔥⚡🌱, «eng muhim»=1 ta, lagancha `.pd-tray`,
   tanlov keyingi darsga localStorage-ko'prik.
7. **PairTimer** (sherikka aytish 30s+30s halqa-taymer) + yoddan-qolip (F-0727-09).
8. **Navbat-pulsi to'liq** (input-navbati bilan: bo'sh maydonlar bo'ylab yurish, fokus
   to'xtatadi) · **Zoomable ⛶** · **neon-kapsula** «Uyga vazifa» (hwTarget-shaxslash) ·
   **nishonlar** (storyBuilder/hotspotAce/toolMaker/graduate; mentor = sahna, 90-qonun) ·
   **ccProgress saqlov** · jonli-ball rels (INLINE_KEYS + practice:-1 sentinel, QUIZ_BANK
   3/3/3/3 qo'shni-takrorsiz, zonalar <100/100+/500+).

---

## 4. 🏪 KEYS-BIZNES QOIDALARI (foydalanuvchi-tamoyillari, muhrlangan)

1. **Faqat K1–K19 bankidan** (PM_Prompt_v8): bankdan tashqari keys/raqam/sana/manba
   O'YLAB TOPISH TAQIQ. Mosi yo'q bo'lsa — zaxira-hook: O'zbekiston o'smirining maishiy
   vaziyati (maktab, mahalla, bozor, Telegram, taksi) — u yerda ham kompaniya-to'qish taqiq.
2. **Biznes REAL va o'quvchiga QIZIQ bo'ladi** — «luboy biznes» emas: real hayotida
   mohiyati bor voqea (milkshake/McDonald's — nega ertalab ko'p olinadi siri; Uzum,
   Telegram Premium regional keyslar kamida har 8-darsda). Mashhur shaxslar faqat
   mahsulot-qarorlari uchun; shaxsiy boylik aytilmaydi.
3. **Raqam-yil qoidasi:** bankdagi har raqamning yili bor — yilsiz raqam AYTILMAYDI;
   pul %/sifat bilan («uch barobar o'sdi»), dollar faqat keys mohiyati bo'lsa;
   «raqamsiz» belgili keysga raqam qo'shilmaydi (10-qonun).
4. **🔴 KEYS BITTA JOYDA — dars bo'ylab YOYILMAYDI (91-qonun):** keys alohida janr,
   BIR marta kiradi — o'zini voqea deb tanitadi («Biznesdagi mashhur voqea: …») va yakuni
   darsga QAYTADI (ko'prik-gap). P0 isboti: milkshake FAQAT s4 ekranida; qayta murojaat
   faqat arena-savollari + 1 eslatma + dekor-token. Qolgan ekranlar dars-ipida yashaydi
   (mijoz-so'rovi ipi + YouTube abrazetsi + o'quvchining O'Z loyihasi).
   «Misol-zoopark» (har ekran o'z ilovasini tanlashi) TAQIQ — misol DARS darajasida.
5. **Keys takrorlanmaydi:** modul ichida bosh-keys qaytarilmaydi (10) · muhokamada
   ishlatilgan kundalik-ilova boshqa darsda bosh-misol bo'lolmaydi (24) · boshqa darsning
   keysi/metaforasi joriy darsda tilga olinmaydi (38) · ishlatilganlar
   `PM_PIPELINE_STATE.md`ga yozilib, senariy-shapkada `ISHLATILGAN_KEYS` bo'lib o'tadi.
6. **Keys — hikoya emas, HARAKAT:** o'quvchi taxmin qiladi/ovoz beradi (33-qonun
   bashorati); til jonli o'zbekcha («och qoldirmaydi» emas «to'q saqlaydi» — P20 qayta-yozuv,
   korpus 9-bo'lim), rus-realiyasi so'zlar almashadi («bublik»→«bulochka»).

---

## 5. 🔁 MEXANIKA-TAKROR TAQIQI («UserStory'daqa ekran faqat bitta joyda»)

Alohida raqamli qonun emas — TO'RT manba birga ishlaydi:
- **10-qonun:** TEKSHIRUV-mexanikasi oldingi darsni takrorlamaydi (senariy kirish-maydoni majburiy);
- **26-qonun:** ketma-ket darslar bir xil KODING-mexanika ishlatmaydi;
- **1-B KLON-TAQIQ + 23-qonun:** etalon ekran-vizuallari/mexanikalari/CSS-oilalari boshqa
  darsga KO'CHIRILMAYDI — faqat naqsh-qaror olinadi («etalonda shunday edi» — asos EMAS);
- **59-qonun chegarasi:** bir dars ichida ikki tekshiruv farqli mohiyatda bo'lsa (klinika=
  yig'ish · stol=hukm) — takror EMAS; mezon — mexanika mohiyati, sahifa soni emas.

Ya'ni: ustaxona/klinika/tekshiruvchi-stoli KABI ekranlar boshqa darsda o'z mavzusiga
mos YANGI ko'rinish oladi; UserStory'niki aynan qaytarilmaydi.

---

## 6. 🚫/✅ SO'Z-EVOLYUTSIYASI (eng muhim almashuvlar, F-ID bilan)

**Atama-qatlam:** «formula»→«retsept» (uch masalliq) · «sinchi»→«tekshiruvchi» ·
«hukm»→«✓ To'g'ri / ✕ Noto'g'ri» (F-0727-05) · «PM-topshiriq kartasi»→«Topshiriq kartasi» ·
«prioritet» hodisadan keyin: «buni navbat belgilash (prioritet) deyiladi» (F-0726-01) ·
«imkoniyat-so'rovi (feature request)» ta'rif bilan · «mavhum»→«aniq emas» ·
«chala/mezon» TAQIQ · «keys» gloss bilan («real voqea tahlili»).

**Klinika-tibbiyot tozalandi (F-0724-01):** «davolaymiz/sog'aydi/Davolab bo'lganlar» →
«talabni to'ldirish / Hikoya to'liq bo'ldi / Hikoyani yig'ib bo'lganlar».

**Keys-tili (F-0727-03):** «qo'l keladi / sekin-sekin ichiladi / och qolmaslik / sir» →
«bir qo'lda bemalol ushlanadi / tez tugamaydi — yo'l oxirigacha yetadi / to'q saqlaydi /
haqiqiy sabab». «Asl raqibi kim ekan?»→«Milkshake bo'lmasa, nima olardi?».

**Egaliksiz masdar** (F-0727-42/10): chip/ro'yxat-matnlar «videomni ko'ra olishim» emas —
«videoni kim ko'rganini bilish»; HW-target «do'stim»→«do'st».

**Ball-fidbek (F-0726-01):** «Xato — 0 ball 💪»→«Adashdingiz — 0 ball. Keyingisida
olasiz.» (stikersiz); «Kodda xato»→«Kod ishlamadi».

**Aniqlik-sinfi (F-0729-08, 22 tuzatish):** «gap o'z-o'zidan o'qiladi»→«to'liq gap hosil
bo'ladi» · «Bonus:»→«Yana bir kamchilik:» · «chiroq yonadi»→«qadam-belgisi ✓» ·
«To'g'risi masalan»→«To'g'ri varianti, masalan» · «Nimasi?»→«Kamchiligi nimada?» ·
«shoshmasa bo'ladi»→«shoshilinch emas» · «sayqallang»→«yaxshilang» · «qayta ishlash»→
«qayta yechish» · «Muddat: keyingi darsgacha» O'CHDI.

**Slot-sanog'i taqiq (63):** mentor «kimga nima kerak va nima uchun» deb sanamaydi —
vizual o'zi ko'rsatadi. **Savol-sarlavha:** «Hikoya *nimadan* yasaladi?» uslubi (bitta
italic-urg'u); test-izoh: avval tanlangan variantning TO'G'RI joyi tan olinadi, keyin xato.

To'liq ro'yxat: `MATN_KORPUS.md` 1–19 bo'limlar + `til-lint-rules.json` (55 qoida) —
yozishdan oldin korpus, yozilgach lint:til 0 error.

---

## 7. 1-TUR vs 2-TUR + GIBRID (1-B jadval qisqacha)

| | 1-TUR (PmLesson2) | 2-TUR (UserStory) |
|---|---|---|
| Mavzu ochilishi | interfeys — o'quvchi KO'RADI | odam/keys — o'quvchi TASAVVUR qiladi |
| Nazariya | interfeys-namunalar (tap-reveal) | KEYS-SLAYD (K1–K19, bashorat) |
| Asosiy harakat | joylaydi · tartiblaydi · tuzatadi | **YOZADI** (o'z artefaktini) |
| Artefakt | to'g'ri qurilgan tuzilma | **matn — keyingi darsga o'tadi** |
| Ustaxona | majburiy EMAS | 🔴 MAJBURIY (bittalab-yozish) |
| Koding | tuzilmani kod bilan quradi | o'z matnini koddan o'tkazadi |
| Misol darslar | UX/UI · struktura · prototip | User Story · JTBD · Metrika · Pitch |

**Ikkala turda AYNAN bir xil:** identitet-pasport · jonli-ball rels · matn-qonunlar
(EKRAN ≤400 proza · mentor ≤2/interaktivda ≤1 gap) · ekran-ritm · navbat-pulsi ·
mentor-ekran 1-D · ccProgress.

**GIBRID (aralash) dars:** mavzu ikkala tomonga tegsa — nazariya-blok bir turdan,
amaliyot-blok boshqasidan; qaysi qism qaysi turdan — senariyda (GATE S) yozib qo'yiladi.
Klon-taqiq gibridda ham amal qiladi.

---

## 8. 🔗 TEXNIK DARSLAR BILAN KIRISHUV

1. **87-qonun (asosiy ko'prik):** koding loyihalashdan OLDIN majburiy savol — «bu darsgacha
   bola texnikadan aynan nimani o'rgangan?» (`App.jsx` MODULES tartibi grep qilinadi).
   O'tilmagan teg/sintaksis kiritilmaydi; ENG KUCHLI koding — texnik dars QOLDIRGAN
   BO'SHLIQNI yopadigani; PM-atama HTML-teg kabi ko'rsatilmaydi (halol bog'lanish);
   kompilyator har faylda o'zida (import yo'q), dvijok — infra, qobiq — shu darsniki.
2. **Stek-chegara** (v8 koding-jadvali): topshiriq o'tilgan stekdan yuqori emas; tayyor
   start-kod + bitta «to'ldir/tuzat/qo'sh» vazifa, ~10 daqiqa; React o'tilgach VS Code-
   topshiriq varianti ham real koding (26).
3. **Artefakt-oqim:** 2-tur artefakti keyingi darsga o'tadi (HW_KEY/prioritet-tanlov
   localStorage-ko'prik); artefakt o'quvchining JORIY modul-loyihasiga (portfolio/bot/MVP)
   yarashi SHART (v8 kirish-maydonlari).
4. **Atama-chegara:** kelajak-dars atamasi joriyga oqmaydi (29); boshqa modul atamasi ham
   birinchi ko'rinishda gloss oladi (21); texnik-dars KONTENTI (dinozavr/restoran) PM'da
   NUQSON — faqat infra olinadi.

---

## 9. TATBIQ-TARTIBI (yangi 2-TUR dars uchun)

1. Tur aniqlanadi (1-B) → 2-TUR bo'lsa: shu hujjat + PmUserStoryLesson etalon.
2. Senariy (PM_Prompt_v8): induktiv yadro (SAVOL → MISOL → QOIDA → KEYS → O'Z LOYIHA),
   keys K1–K19dan «Temalar» bo'yicha, ISHLATILGAN_KEYS/oldingi-mexanika maydonlari → GATE S.
3. Qurilish: 2-bo'lim blok-standart 2-TUR ustuni bo'yicha; ustaxona 48/80-qolip; koding
   87-savoldan boshlanadi; keys faqat KEYS-SLAYD pozitsiyasida (91).
4. Matn: MATN_KORPUS (ayniqsa 9/13/16–19) → lint:til 0; EKRAN ≤400 proza.
5. Tekshiruv: pm-tekshiruvchi 15 ov-band + navbat-puls 5-band + mentor-ekran 1-D +
   arena-qoplama (65) + keys-ip grep (91d: brend-nomlar ekran-xaritasi).

---

*Yig'ildi: 2026-07-30. Manbalar: PM_PIPELINE_STATE.md (P0…P82 + F-0729/0730) ·
PmUserStoryLesson.jsx (4219 qator) · PM_DARS_ETALON.md (qonun 14–91, 1-B/1-C/1-D) ·
PM_Prompt_v8.md · MATN_KORPUS 1–19.*
