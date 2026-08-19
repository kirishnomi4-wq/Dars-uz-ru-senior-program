# 🔁 B4+B5 DAVOM — jonli chekpoint (2026-08-19)

> Bu fayl **har to'lqindan keyin yangilanadi**. Seans uzilsa (tok/qayta yuklash) — yangi seansda
> «davom et» deyilganda BIRINCHI shu fayl o'qiladi, keyin `PM_PIPELINE_STATE.md` oxirgi bo'limi.
> Kechagi uzilish saboqi: fayllar diskda qoladi, lekin **qaysi bosqichda ekani yozilmasa yo'qoladi**.

## 0. BUGUNGI MAQSAD

> 🏁 **BATCH 4 (M5) TO'LIQ YOPILDI — 3/3 PASS 28/28 + verifikator imzo (2026-08-19).** STATE ga yozilgan.

**M5 va M6 ni yopish = 7 dars.** B4 (M5): PmLesson19/20/21 — qurilgan, zanjir qolgan.
B5 (M6): PmLesson22/23/24/25 — noldan (senariy ham yozilmoqda).
Foydalanuvchi qarorlari: GATE S avto (pretsedentsizlar so'raladi) · ikki oqim parallel · **batch yakunida commit**.

## 1. HOLAT JADVALI — B4 (M5)

| Bosqich | PmLesson19 (m5-02) | PmLesson20 (m5-08) | PmLesson21 (m5-11) |
|---|---|---|---|
| quruvchi | ✅ 08-18 | ✅ 08-18 | ✅ 08-18 |
| dizayn | ✅ skroll 0 · s15 360px tuzatildi · reduced-motion | ✅ skroll 0 · elak-vizuali · 3 o'lik qoida | ✅ skroll 0 (4 o'lcham) · s15 −245px · rang+shakl legendasi |
| jonli | ✅ 7 band toza · izoh-dubli olindi | ✅ 1,0,2,1 · elak-hold bug tuzatildi | ✅ turnBusy ×3 tiklandi · arena Q7/Q8 telli |
| 👦 1-o'qish | ✅ niyat 15/16 · 4 tuzilma + arena-tell | ✅ niyat 15/16 · 0 bilmadim | ✅ niyat 15/16 · o'zak-zidligi topildi |
| metodist | ✅ A1–A7 · til-lint 0/0 | ✅ A1–A8 · til-lint 0 | ✅ o'zak-ta'rifi 13 joyda · «hisob» omonimi 24 o'rinda |
| 👦 2-o'qish | ✅ **O'TDI** (2-aylanish: 16/16 · 0 gloss · 2/2) | ✅ **O'TDI** 16/16 | ✅ **O'TDI** |
| tekshiruvchi | 🔄 ishlamoqda | ✅ yopildi | ✅ 2-aylanish: «verifikatorga tayyor» |
| verifikator ∥ qabulchi | ✅ **YOPILDI 28/28 + imzo** | ✅ **YOPILDI 28/28 + imzo** | ✅ **YOPILDI 28/28 + imzo** |

## 2. HOLAT JADVALI — B5 (M6)

| Bosqich | PmLesson22 (m6-02 PRD) | PmLesson23 (m6-06 Etika) | PmLesson24 (m6-12 Roadmap) | PmLesson25 (m6-14 Pitch) |
|---|---|---|---|---|
| pasport | ✅ registrda muhrlangan | ✅ | ✅ | ✅ |
| senariy | ✅ 1013 q | ✅ 988 q | ✅ 911 q | ✅ 878 q |
| korrektura (pm-metodist) | 🔄 | ✅ 21 tuzatish | ✅ 8 topilma · 5 GATE S bandi | ✅ 8 topilma · 3 GATE S bandi |
| [GATE S] | ✅ YOPILDI | ✅ | ✅ | ✅ |
| quruvchi | ✅ 3702 q | ✅ 3655 q | ✅ 3719 q | ✅ 3872 q |
| dizayn → jonli → 👦1 → metodist → 👦2 → tekshiruvchi | 🔄 dizayn | 🔄 👦2 (2-aylanish) | 🔄 metodist | 🔄 👦1 |
| verifikator ∥ qabulchi | ✅ **YOPILDI 28/28 + imzo** | ✅ **YOPILDI 28/28 + imzo** | ✅ **YOPILDI 28/28 + imzo** | ⏳ |

## 3. O'LCHOV BUYRUQLARI (har to'lqindan keyin bosh-agent yuritadi)
```
node pipeline-b3/b2-check.mjs src/5-Modull/PmLesson19.jsx      # 20, 21 va keyin 6-Modull/PmLesson22…25
node _dead20.mjs <fayl>                                        # o'lik CSS xom-nomzodlar (dizayn ikki tomonlama sanaydi)
node _scroll20c.mjs <fayl>                                     # 58/60-qonun skroll (Chrome kerak)
node til-lint.mjs <fayl>                                       # matn tegilgan har roldan keyin — 0 error
npm run lint:jsx                                               # jim-buzilish darvozasi
node prompt-lint.mjs                                           # rol/qonun MD tegilgan seans yakunida
```

## 4. QAT'IY RELSLAR (o'zgartirilmaydi)
Bir fayl — bir muharrir · parallelizm faqat darslar orasida · umumiy fayllar (registr/korpus/STATE/App.jsx)
faqat bosh-agentda · har roldan keyin `b2-check` · matn tegilsa `lint:til` 0 error · GATE 2 avto-shartlari
`OQUVCHI_DARVOZA.md` da · yangi sinf topilsa darhol opa-singil fayllarda grep (F-0813-09) · **commit faqat
batch yakunida** (bugungi qaror).

## 5. OCHIQ BANDLAR (bugundan oldin)
- **GATE 3 to'liq imzosi** ⇦ jonli PIN-sinovi (MENTOR-2026, ≥2 o'quvchi, podium/arena ≠ 0) — 10 dars kutmoqda.
- **Platforma-sweeplar** (B4/B5 dan keyingi alohida seans): kompilyator `zoom` bekori 25 fayl · koding-darvoza
  `|| isMentor || done` 11 dars · `StudentPracticePulse` koding-ekranida 20 fayl · F-0818-03 matn-sweepi
  («bu kodni kiriting» ×93 · `-ku` ×49 · registr-warn ×197).
- `m34-demo` registri 4a/4b/4c modullarini olmaydi (PmLesson15…18 demo-URL'da ochilmaydi).

## 6. TO'LQIN JURNALI (yangi qator har to'lqinda)
- **10:2x** — FAZA 0 yopildi: STATE tiklandi · B5 pasporti muhrlandi · brif yozildi. Uchirildi: B4 dizayn ×3 ∥ B5 senariy ×4.
- **10:5x** — 🔴 HODISA: m6-06 va m6-12 yozuvchilari «Connection lost mid-response» bilan yiqildi — aynan ~900 qatorli
  faylni BITTA Write bilan yozish payti. Ikkalasi ham kontekstlari bilan qayta uchirildi, endi bo'lak-bo'lak yozadi
  (0…4 → 5…9 → 10…14). Qolgan ikki yozuvchiga ham profilaktik ko'rsatma yuborildi. Qoida `SENARIY_BRIF_B5.md` D8
  bandiga muhrlandi — keyingi batchlarga ham amal qiladi.
- **11:3x** — 🔴 TARMOQ BEQAROR: 5 agent «Connection lost mid-response» bilan yiqildi (3 senariy-yozuvchi ×2 marta,
  1 dizayn). Fayllar butun qoldi (esbuild uchala M5 faylida toza). Chora: yozuvchilar KICHIK bo'laklarda yozadi
  (0–1 → 2 → bloklar 1-3/4-6/7-9 → 4 → 5-7 → 8-9 → 10-12 → 13-14, heredoc append), muharrirlar kichik Edit +
  har 2–3 tahrirda esbuild. Transkripti yo'qolgan dizayn (PmLesson21) yangi agent bilan «davom ettirish» rejimida
  qayta uchirildi.
- **11:4x** — ✅ PmLesson20 DIZAYN YOPILDI (skroll 0 · s10 +41px tuzatildi · `elak-t` chin yetim olindi ·
  `.delay-3` va `.hrow` bazasi o'chirildi). → jonli bosqichiga uzatildi.
- **11:5x** — ✅ PmLesson20 JONLI YOPILDI: `INLINE_KEYS` 1,1,1,1 → **1,0,2,1** (s5 → 0, s7 → 2; faqat variant tartibi,
  matn o'zgarmadi, `explainWrong` kalitlari remap qilindi; 16-ov uzunliklari tekshirildi) · jonli-relslar 12 band ✅ ·
  **yangi bug-sinf topildi va tuzatildi:** s9 elak kartasi holatni o'quvchi TANLOVIGA bog'lagan edi (xato bosganda ham
  «savol o'tdi» ko'rinishi), endi haqiqatga (`cur.yol`) bog'landi. F-0813-09 grepi: opa-singil fayllarda bu sinf YO'Q
  (PmLesson18:1731 to'g'ri naqshda — `cur.yol` bilan). → 👦 1-o'qishga uzatildi.
- **12:0x** — ✅ PmLesson20 👦 1-O'QISH: **niyat 15/16 · 0 «bilmadim»**. Topilmalar: s9 niyat-mos emas (uchinchi tugma
  «O'tdi — varaqqa» to'siq emas) · 6 joyda qayta o'qish · 9 gloss'siz so'z · «eshitgan javob» gloss-tartibi teskari ·
  **🔴 ARENA TELL: Q1–Q4 to'g'ri javobi «bo'lib o'tgan ish» kalit-so'zi bilan topilib qolyapti** · s10 darvoza-savoli
  so'z-solishtirish bilan yechiladi · s14 oxirgi flashcard ikki narsani qo'shgan · s1542 ⭐ yozish joyi yo'q.
  → metodistga uzatildi (A1–A8 bandma-band + til-lint 0 error darvozasi).
- **ARENA-TELL SINFI (yangi, F-0813-09 tekshiruvi):** PmLesson19/21 arena savollari xom-dump bilan ko'zdan kechirildi —
  ketma-ket takrorlanadigan kalit-so'z ko'rinmadi, lekin dump apostroflarda uzilgani uchun **yakuniy hukm tekshiruvchi
  roliga** o'tkazildi: har uch B4 darsida «to'g'ri javoblar ketma-ket bitta ibora bilan ajralib turmasin» bandi
  majburiy tekshiriladi. Metodist tasdiqlagach — korpusga F-ID bilan muhrlanadi.
- **12:2x** — ✅ **B5 SENARIYLARI 4/4 YOZILDI** (3790 qator, hammasi til-lint 0 error): m6-02 «BIR VARAQ»/katak-tekshiruv
  (basseyn) · m6-06 «OQIBAT-KO'ZGUSI»/oqibat-juftlash (mini-do'kon) · m6-12 «UCH UFQ YO'LI»/ufq-joylash (sartaroshxona) ·
  m6-14 «GAPIRADIGAN SLAYD»/«IKKI RAQAM — BIR JOY» (Demo Day sahnasi). Mexanika-nomlari va olam-taqsimoti registrga
  muhrlandi. To'rtovi ham korrekturaga uzatildi. **Pasport tuzatildi:** m6-06 da o'quvchi tizimi hali AI bilan javob
  qaytarmaydi (AI m6-08 da) — «quradigan» shakli.
- **12:2x** — ✅ PmLesson19 DIZAYN YOPILDI (skroll 0; s15 yakun 360px → 0; reduced-motion nur-animatsiyasi yopildi;
  `.delay-3` o'lik qoidasi olindi). → jonli bosqichiga uzatildi. 🟡 **Yangi sweep-bandi:** `PmLesson18` s15 da hamon
  457px skroll (oila-darajasidagi qoldiq) · `HtmlCompiler` sof-JS topshiriqda bo'sh «Natija» panelini chizadi.
- **12:5x** — ✅ PmLesson20 METODIST YOPILDI: A1–A8 bandma-band tuzatildi · til-lint 🔴3 → **0** · arena Q1–Q4 kalit-so'z
  telli yopildi (indeks tegilmasdan) · `custdev` 29-qonun bo'yicha butunlay olindi. 3 tuzilmaviy band (s2 444 · s9 426 ·
  s4 400+) quruvchi-mikroga qaytdi. `registr-zor-qoyil` ×7 OQLANDI (darsning o'zi o'rgatayotgan bo'sh-maqtov namunasi).
- **KORPUS §138 muhrlandi (F-0819-08…10):** (A) kelajak-modulning bosh atamasi flashcard javobida ham yashamaydi ·
  (B) gloss-tartibi bashorat-slaydiga ham taalluqli · (C) arena ketma-ket savollarda bitta kalit-so'z bilan yechilmaydi.
  ⚠️ Korpusni bugun boshqa seans ham tahrirlagan (§137, F-0819-01…07 — M3-D1 React darsi): umumiy fayllarga faqat
  QO'SHIB yoziladi, qayta yozilmaydi.
- **12:5x** — ✅ PmLesson19 JONLI YOPILDI (7 band toza · kalit-sadoqat senariy bilan tasdiqlandi · arena-tell YO'Q ·
  izoh-dubli olindi). → 👦 1-o'qishga uzatildi.
- **13:1x** — ✅ PmLesson21 DIZAYN YOPILDI (4 o'lchamda skroll 0; s15 uy-vazifa ochiq holati −245px; rang-legendasi
  rangdan tashqari SHAKL bilan ham) → jonliga uzatildi.
- **13:1x** — ✅ PmLesson19 👦 1-O'QISH: **niyat 15/16**. To'rt tuzilmaviy nuqson quruvchi-mikroga ketdi: ① s9 yakun-xulosasi
  o'quvchi tanlagan joylardan emas, ssenariydan chiqadi (23 odam tanladi — «ikkita joy 13+7» deb yozildi) ② :1577 «yana bitta
  joy qo'shing» — 4-katak yo'q ③ s10 `console.log` topshiriqdan oldin ko'rinmaydi (faqat xato-matnida) ④ «halqa» ikki ma'noda
  (odamlar doirasi ↔ kod sikli). Metodistga qoladi: 3 ta ichki test kalit-ibora bilan yechiladi (§129) · arena-tellda
  «har kuni ko'rishadi» 3 to'g'ri javobda (§138-C) · nishon nomlari 4 tasi ham inglizcha, o'zbekcha izoh faqat olingandan
  keyin ko'rinadi.
- **KORPUS §139 muhrlandi (F-0819-11):** «ekran holati o'quvchining harakatini ko'rsatsin, oldindan yozilgan ssenariyni
  emas» — bir kunda ikki darsda chiqdi (PmLesson20 elak-hold · PmLesson19 s9 yakun-xulosasi). Tekshiruv usuli: har
  interaktiv ekranni to'g'ri / xato / kutilganidan boshqacha tanlov holatlarida solishtirish.
- **13:4x** — ✅ PmLesson19 QURUVCHI-MIKRO (4/4): yakun-xulosasi endi o'quvchi bosgan joylardan yig'iladi (§139) ·
  «yana bitta joy qo'shing» maslahati mavjud harakatga to'g'rilandi · `console.log` topshiriqdan oldin ko'rinadi ·
  «halqa» atama-to'qnashuvi koding tomonida yopildi. → metodistga uzatildi.
- **13:4x** — ✅ PmLesson21 JONLI (8 band): 88(d) `turnBusy` **3 joyda yetishmasdi** — tiklandi (s0/s2/s6) · sonli
  mantiq to'liq qayta hisoblandi, zid yo'q · 🔴 arena Q7/Q8 (:2161–2162) «ikki kun» iborasi bilan telli → metodistga.
  → 👦 1-o'qishga uzatildi.
- **13:4x** — ✅ M6-D14 KORREKTURA: 8 topilma. Eng qimmatlilari: duel savolining mutlaq shakli 3-raundda ikkinchi rost
  javob tug'dirardi · starter `return []` uchtadan ikkita tekshiruvni bepul o'tkazardi · «qator» ildiz-omonimi (slayd
  qatori ↔ kod qatori) · 5 testda ham kalit-so'z faqat to'g'ri javobda edi. 3 yangi GATE S bandi (13–15).
- **KORPUS §140 muhrlandi (F-0819-12…13):** (A) duel-mashqida savol nisbiy bo'lsin, mutlaq emas · (B) starter bo'sh
  qiymat qaytarsa, birorta kutilgan natija bo'sh bo'lmasin (18-ov bandining hisob-kitobli ko'rinishi).
- **14:1x** — 🔴 PmLesson21 👦 1-O'QISH: **niyat 15/16**, lekin DARS O'ZAGIDA ZIDLIK topildi — «qaytgan» so'zi ikki
  qarama-qarshi yo'nalishda ishlatilgan (s1/s8 «ulardan ERTASIGA nechtasi keldi» ↔ s2/s4/s11/kod «ulardan KECHA HAM
  kelgani»). Bu ikki xil son; 👦 s8 da qaysi sonni yozishini bilmay qoldi. Kanonik shakl = ORQAGA QARAB (artefakt va
  `KOD_DATA` shunga qurilgan). Yana: yashil rang s4 va s9 da turli ma'noda (§134) · «e'lon 23 odam olib keldi» sonli
  yolg'oni · arena 12 tadan **8 tasi** kalit-so'z bilan yechiladi. → metodistga uzatildi.
- **14:1x** — ✅ M6-D12 va M6-D6 KORREKTURALARI yopildi (21 + 8 tuzatish). Eng qimmatlilari: T3 darsning O'Z mashqida
  ruxsat berilgan qarorni jazolardi · legenda darsning kalit fe'lini teskari ma'noda ishlatardi · ikki testning kaliti
  bitta ibora bilan belgilanardi · sahna vaqti mexanikaning sababiga zid edi.
- **KORPUS §141 muhrlandi (F-0819-14…21) — 8 sinf:** vizual-so'z atama dublyori · kalit-ibora ikki test bo'ylab ·
  savol o'zagi variant yorlig'ini qaytarishi · sahna vaqti zidligi · starter izohi nomlanmagan o'zgaruvchi · test
  o'quvchining ruxsat etilgan qarorini jazolashi · legenda kalit fe'lni teskari ishlatishi · senariyning o'z taqiq-so'zi
  markaziy ekranda qolishi. **Bugun korpus jami 12 yangi sinf bilan o'sdi (§138–§141).**
- **15:0x** — ✅ **[GATE S] YOPILDI (B5, 62 qaror).** Pretsedent bilan avto-yopildi: s4 ikki bosqichli qo'shimchalari ·
  demo-olamlar · artefakt-shakllari · keys raqamsiz siyosati · atama tug'ilishi · ekran-so'zi↔JSON-kaliti ajratmasi ·
  metodist-korrektura bandlari. **Foydalanuvchi hukmi (3 band):** ① 4 karta-sarlavhasi tasdiqlandi va `src/App.jsx` ga
  kiritildi ② m6-06 ohang-darajasi o'zgarmaydi (jabr-misollari yengil qoladi) ③ m6-02 s9 da uch varaqdan **bittasi
  butunlay to'g'ri** bo'ladi (naqsh-xavfi yopiladi, M4-D12 pretsedenti). Yopilish yozuvi to'rt senariyga qo'shildi.
  ⚠️ Karta yozishda apostrof qochirilmay qolgan edi — esbuild tutdi, tuzatildi (jim-buzilish darvozasi ishladi).
- **15:0x** — 🏗 **B5 QURUVCHI TO'LQINI UCHIRILDI (4 dars parallel):** PmLesson22 (m6-02) · PmLesson23 (m6-06) ·
  PmLesson24 (m6-12) · PmLesson25 (m6-14). Har brifda bugungi yangi sinflar (§138–§141) oldini olish bandlari bor.
- **15:0x** — ✅ PmLesson19 METODIST: til-lint **0 error / 0 warn** · uch ichki test va arena teli yopildi (uzunlik
  nisbati 12/12 savolda ≤1.36) · «halqa» glossi qo'shildi · nishon nomlari dars-so'zlaridan tiklandi (Map Pro! · My Plan! ·
  20 Done! · Code Master!). Nishon tavsifining ko'rinishi quruvchi-mikroga ketdi.
- **16:0x** — ✅ PmLesson20 QURUVCHI-MIKRO: s2/s4/s9 bosqichlarga bo'lindi (s4 yakuni **1005 → 335** grapheme), skroll
  4 o'lchamda 0. → 👦 2-O'QISH **O'TDI** (niyat 16/16 · 0 «bilmadim» · qayta-o'qish 2/2). → tekshiruvchiga.
- **16:0x** — ✅ PmLesson21 METODIST: o'zak-zidligi **13 joyda** yopildi (kanonik: «kecha kelgan odam bugun ham kelsa —
  u BUGUN qaytgan») · rang-kalitlari obyektni nomlaydi · «hisob» ildiz-omonimi 24 o'rinda «raqam» ga o'tdi · arena
  Q7/Q8 telli yopildi (uzunlik nisbati ≤1.31) · til-lint 0 error. → 👦 2-o'qishga.
- **KORPUS §142 muhrlandi (F-0819-22…24):** ikki kunlik munosabatda yo'nalish bitta bo'lsin va ta'rif katakning qaysi
  kunga yozilishini aytsin (tekshiruv: 1-yozuv nega 0 ekani ta'rifdan chiqadimi) · bitta rang ikki obyektni bo'yasa
  legenda obyektni nomlasin · keys-sanog'i darsning o'z artefakti bilan bir so'zda atalmasin.
  **Bugungi jami: 15 yangi sinf (§138–§142).**
- **17:0x** — ✅ PmLesson21 yakuniy mikrolar: «funksiya» glossi · «hafta↔uch kun» zidligi · eskirgan `Q_LABELS` atamasi ·
  1-kun qoidasi · bashorat fe'l-telli — beshovi yopildi; s8 bosqichlarga bo'lindi (cho'qqi **492 → 382** grapheme,
  skroll 4 o'lchamda 0). → tekshiruvchiga.
- **17:0x** — 🏗 B5: **PmLesson22 (3702 q)** va **PmLesson23 (3637 q)** qurildi, ikkalasi ham dizaynda. Quruvchilar bugungi
  sinflarni oldindan yopdi: §140-B (starter bilan 0 tekshiruv — dasturiy tasdiqlandi) · §139 (yakun-qatori o'quvchining
  o'z natijasidan) · klon-residue 0 · `previewUrl` 0. PmLesson22 da foydalanuvchi qarori bajarildi (3-varaq butunlay
  to'g'ri + «javobsiz katak yo'q» tugmasi).
- **18:0x** — 🏗 **B5 QURUVCHI 4/4 TUGADI:** PmLesson22 3702 q · PmLesson23 3655 q · PmLesson24 3719 q · PmLesson25 3872 q.
  Hammasida esbuild/lint:jsx/til-lint 0, SSR-smoke 16/16, klon-residue 0, 18-ov **dasturiy** tasdiqlangan (starter 0/3).
  To'rtovi ham dizaynga uzatildi.
- **18:0x** — 🔴 PmLesson19 👦 2-O'QISH **O'TMADI**: oltala qizil topilma yopilgan, niyat 16/16, «bilmadim» 0 — lekin
  qayta-o'qish **4** (chegara 2) va 1 gloss'siz so'z. Qoqilishlarning uchtasi s10 koding matnida (bitta gapda uchta ish ·
  «yetmasa» tarmog'i yozilgan, «yetgan» tarmog'i yozilmagan · `console.log` faqat yopiq Yordamda). → metodist-mikro
  (1-aylanish; chegara 2).
- **18:0x** — 🔍 PmLesson20 TEKSHIRUVCHI: hamma darvoza toza (senariy-sadoqat · jonli relslar · 16 bug-sinfi · skroll 16/16
  × 2 o'lcham · uzunlik-telli · CSS-qoplama 0/0 · §138-C tasdiqlangan), **bitta bloklovchi band**: s9 da tuzatish-qatori
  asl javobni olib yuradi va 4 s dan keyin butunlay o'chadi (56-qonun) + kutish-belgisi yo'q. → quruvchi-mikro.
  🟡 Yangi sweep-bandi: mentor rejimida reveal'dan keyin `MentorTestStats` 136–239px skroll — PmLesson18/19/20 da
  **bayt-ma-bayt bir xil** (md5 dbfdf16…), ya'ni platforma-merosi, dars regressiyasi emas.

## 7. OCHIQ TUZILMAVIY BANDLAR (mas'ul rol biriktirilgan — yopilmaguncha o'chirilmaydi)
| # | Fayl | Band | Mas'ul |
|---|---|---|---|
| ~~1~~ ✅ | ~~`PmLesson23.jsx` s15~~ | uy-vazifa OCHIQ holatida skroll 226 / 126 / 98px (1280×800 · 1440×900 · 2560×1440). CSS bilan yopilmaydi. Dizayn taklifi: `hwOpen` da HwCard `.hw-big` kapsulasining O'RNIGA render qilinsin (−113px), yoki RecapOverlay kabi overlay. Hozircha 77-qonun `scrollIntoView` mitigatsiyasi kuchda. | pm-quruvchi (👦1 dan keyingi mikro-raundda) |
| 2 | **YANGI B5 darslari** | 🔴 **88(d) `turnBusy` takroriy sinfi:** `optionalLive` freeRide NavNext larda `turnBusy` yetishmaydi — jonli o'quvchida topshiriq bajarilmasdan «Davom etish» pulsi yonadi. Bugun **ikki darsda aynan bir xil uch joyda** topildi (PmLesson21 s0/s2/s6 · PmLesson23 s0/s2/s6). PmLesson22/24/25 da ham tekshirilsin (jonli bosqichida). Quruvchi brifiga band sifatida qo'shilsin. | darslik-jonli (har B5 darsida) |
| 3 | oila-darajasida | `PmLesson18` s15 da 457px skroll (B3 dan qolgan) · mentor rejimida `MentorTestStats` reveal'dan keyin 136–239px (PmLesson18/19/20 da bayt-ma-bayt bir xil — platforma-merosi) | sweep-seansi |
- **19:0x** — 🎉 **PmLesson20 (M5-D8) QABULCHI PASS 28/28** — prod-tayyor. Alohida tasdiqlangan: §138-C (arena kalit-so'zi
  har savolda distraktorga tarqatilgan) · §139 (`elak-body` holati HAQIQATGA bog'langan) · tekshiruvchi bloklovchisi
  yopilgan · `vite build` 2.6 s toza, 254 kB (oila 253–258 oralig'ida) · CSS 552 klassdan 0 o'lik · 31 reduced-motion
  fallback. Qolgani: verifikator brauzer-raundi + jonli PIN-sinovi + GATE 3 imzosi.
- **19:0x** — 🔴 PmLesson21 TEKSHIRUVCHI 7 band bilan qaytardi (2 bloklovchi): ① s8 izohi «1-kunda ham qaytganlar
  bo'lishi mumkin» darsning 4 joyidagi «birinchi kunning qaytgani 0» qoidasiga zid — **arena Q3 ballanadi**, ya'ni
  o'quvchi o'z to'g'ri ishi uchun jazolanardi ⑤ s9 da har xato uchun bitta matn — kam belgilash va «qaytmagan»
  holatlarida YOLG'ON. Metodist 1–4 ni oldi, quruvchi 5–7 ni oladi.
- **KORPUS §143 muhrlandi (F-0819-25) — birinchi JARAYON sinfi:** aniqlashtiruvchi izoh qo'shishdan oldin o'sha
  tushuncha darsda nechta joyda qatiy belgilanganini grep qilish, ayniqsa **ballanadigan qatlamda** (`QUIZ_BANK`,
  `INLINE_KEYS`, flashcard). Sabab: bosh-agentning tuzatish-ko'rsatmasi yangi zidlik yaratdi.
  **Bugungi jami: 16 yangi sinf (§138–§143).**
- **20:0x** — 🎉 **PmLesson20 TO'LIQ YOPILDI** (qabulchi 28/28 + verifikator imzo; STATE ga yozildi). Verifikator brauzerda:
  48 yuklash, konsol 0, jonli o'tish s0→s15, arena **+948 ball**, podium 4/4 va 1/4 (nol emas), artefakt localStorage'dan
  tasdiqlandi, 65 skrinshot.
- **20:0x** — 🎉 **PmLesson21 QABULCHI PASS 28/28** (verifikator ketmoqda). Bugungi sinflar alohida tasdiqlandi:
  §142-A (kanonik ta'rif 4 yuzada so'zma-so'z bir xil) · §142-B · §142-C · §143 (qoida **7 joyda** bir xil,
  ballanadigan qatlam bilan zidsiz) · §139 (s9 uch xato-shoxi) · **§144 (arena↔ekran 5-gramm kesishmasi 0)**.
- **20:0x** — ✅ PmLesson19 👦 2-o'qish **O'TDI** (2-aylanish: niyat 16/16 · 0 gloss'siz · qayta-o'qish 2/2) → tekshiruvda.
- **20:0x** — 🔴 PmLesson23 👦 2-o'qish o'tmadi (qayta-o'qish 3/2): dars YAKUNIDA zidlik — «chegarani jabr ko'rgan odam
  belgilaydi» ↔ «mahsulotni o'ylaydigan odam qiladi». Metodist yopdi (himoya qiladi / qo'yadi — ya'ni siz) + §144
  bo'yicha uch arena-nusxasi yangi sahnaga ko'chdi. Ikki tuzilmaviy band quruvchida (s15 skroll · s2 506 grapheme).
- **20:0x** — 🔴 PmLesson24 👦 1-o'qish: **koding topshirig'ini bajarib bo'lmaydi** — ichki sikl berilmagan (`j` qayerdan?),
  3-shart uchun kerakli solishtirish (`r.ufq` ↔ ufq) hech qayerda aytilmagan. Quruvchida. Yana: 4 test ham kalit-so'z
  bilan yechiladi, arena ~9/12 nusxa/tell (§144), «roadmap» faqat flashcard javobida (16 ekranda yo'q). Metodistga navbat.
  ✅ Ijobiy: uch hudud rang-ko'rlikda ham ajraladi («rangni ko'rmasam ham ajrata olaman»), «ufq» so'zining tanlanish
  sababi aytilgani yoqdi.
- **21:0x** — ✅ PmLesson23 ikki tuzilmaviy bandi yopildi: **s15 uy-vazifasi overlay bo'ldi** (sahifa uzunligi o'zgarmaydi:
  eng og'ir holat +397/+297/+280 → **+17/0/0**; P0 normasi +238/+138/0 — ya'ni endi etalondan toza) · s2 ikki bosqichga
  bo'lindi (523 → 172/233/298/369). 🟡 **Oila uchun foydali naqsh:** overlay yechimi PmLesson24 da ham qo'l keladi
  (u yerda uy-vazifa ochilganda +483/+383/+199).
- **21:0x** — ✅ PmLesson24 koding topshirig'i yopildi va **uch sinov bilan tasdiqlandi**: starter **0/3** · to'g'ri yechim
  **3/3** · 👦 tushib qolgan tuzoq («hamma ishni har sarlavha ostiga») **2/3**. Quruvchi yana bir nuqson topdi: topshiruq
  matni panelda ko'rinmasdi (~12 qator sig'adi) — VAZIFA bloki faylning boshiga chiqarildi.
- **21:0x** — ✅ PmLesson25 jonli: `turnBusy` 7/7 toza · §140-B qayta tasdiqlandi (starter 0/3) · 🔧 **dizayn topgan band
  tuzatildi:** «Slide Talker!» bayram-oynasi duel ustiga tushardi — trigger duel yakuniga bog'landi. §144 bo'yicha bitta
  arena-nusxa (`:2121` = s5 testi) va §138-C bo'yicha ikki so'z metodistga.
- **21:0x** — ✅ PmLesson19 sariq bandlari yopildi; metodist tekshiruvchi ko'rmagan **ikkinchi to'qnashuvni** ham topdi
  (🏀 To'garak s1 da 6, s9 da 11). Dars verifikator ∥ qabulchiga uzatildi.
- **22:0x** — 🏁 **BATCH 4 YAKUNI: 3/3.** PmLesson19 verifikator imzosi bilan yopildi (48/48 render, konsol 0, skroll 0,
  arena +957, s9 §139 uch holatda tasdiqlangan, artefakt localStorage'dan o'qildi). M5 moduli PM darslari bilan to'liq;
  artefakt-zanjiri uchdan-uchigacha ishlaydi.
- **22:0x** — 🔴 PmLesson24 👦 GATE 2 (2-aylanish): oltala topilma yopilgan, arena **~9 → 3**, to'rt test endi kalit-so'z
  bilan yechilmaydi — lekin qayta-o'qish **3/2** bo'lgani uchun o'tmadi. Uch mayda nuqta: `u` o'zgaruvchisi VAZIFA
  blokida tug'ilishidan oldin ishlatilgan · arena Q9 «Kichigi» (darsda «qimmat») · RECAP-11 dagi referentsiz «u».
  Ikki aylanish chegarasi tugagani uchun to'liq uchinchi o'qish o'rniga **nuqtali tekshiruv** qilinadi.
- **22:0x** — 🔴 PmLesson23 tekshiruvchi 2 bloklovchi band bilan qaytardi: ① arena Q9 distraktori («bot har o'n daqiqada
  qayta yozdi») o'sha odam uchun ham ROST — to'g'ri o'ylagan o'quvchi «Adashdingiz» olardi ② s15 da 4 nishon olingach
  skroll +47 (oldingi o'lchov faqat nishonsiz holatni ko'rgan). Metodist ishlamoqda, keyin dizayn.
- **⚠️ BOSH-AGENT XATOSI (qayd):** bir vaqtda ikki rolni bitta faylga (PmLesson24) yubordim — «bir fayl — bir muharrir»
  buzilishi. Darhol to'xtatildi, metodist tahrir qilmagan (faqat taklif-matn tayyorladi), zarar yo'q. Saboq: rol
  uchirishdan oldin faylning band-holatini tekshirish.
- **23:0x** — 🔴 PmLesson23 QABULCHI **PASS 26/28 — QAYTARISH.** Ildiz bitta (23+28 bandlar): `:1476-1481` s8
  topshiriq-paneli shartlarni **bitta proza qatoriga** yig'gan (`.wsp-task-req`, 8 so'z, statik). Etalon —
  PASS olgan uch M5 darsi: `PmLesson21:1519-1523` har shart alohida jonli chip (`wsp-chk-i` ○/✓),
  `PmLesson19/20` `wsp-task-row.done`. Ya'ni bu faylda **o'z-variant tug'ilgan** (ETALON 32 + band 23 buzilgan).
  Mas'ul: quruvchi (uch chipga bo'lish) + dizayn (CSS). ⏸ Verifikator shu faylni brauzerda o'lchayotgani uchun
  tuzatish u tugagandan keyin boshlanadi.
  ✅ Qabulchi ochiq sariq bandlarni yopdi: s6 `predict:` 1 ta — OQLANADI (109-qonun TMI, GATE S qarori kuchida) ·
  s4 mentor tugmalari — bloklovchi emas (`tanla()` `isMentor` da qaytadi).
- **KORPUS §147 va §148 muhrlandi (F-0819-31…35):** 3-vs-1 shakl-telli (tuzatish paytida tug'ilgan) · o'lchov
  kirish-artefakti bilan qilinadi · sarlavha mexanikaning istisnosini aytsin · tasdiq-matn hali bo'lmagan holatni
  aytmasin · qisqartma birinchi ko'rinishida yechilsin.
- **§144 O'LCHOVI ANIQLASHTIRILDI (F-0819-36):** mavzu-takrori nuqson emas (muqarrar), nuqson — **kalit-aks-sadosi**
  (kalit karta-javobini so'zma-so'z takrorlaydi, distraktorlar uzoq). Raqamli mezon: `E_kalit ≥ 0.75` va
  `E_kalit − E_distr ≥ 0.35`. Batch-normasi: L23 1/12 · L24 1/12 · L22 2/10 · **L25 5/12 → qaytarildi**.
  **Bugungi jami: 27 yangi sinf (§138–§148 + kengaytmalar).**

## 8. B5 YAKUNIY HOLAT (2026-08-19, kech)
| Dars | 👦2 | Tekshiruvchi | Qabulchi | Verifikator |
|---|---|---|---|---|
| m6-02 `PmLesson22` | ✅ o'tdi | ✅ tayyor | 🟡 **27/28** (band 20 = verifikator imzosi) | 🔄 |
| m6-06 `PmLesson23` | ✅ o'tdi | ✅ tayyor | ✅ **28/28** | ✅ **imzo** |
| m6-12 `PmLesson24` | 🟡 3/2 qayta-o'qish (qolgan 3 shart ✅) | ✅ tayyor | ✅ **28/28** | ✅ **imzo** |
| m6-14 `PmLesson25` | ✅ o'tdi | ✅ tayyor | 🟡 **25/28** (chip + imzo) | 🔄 |

- **🔴 TARMOQ BUTUNLAY UZILDI (DNS/ENOTFOUND)** — bir vaqtda 4 agent yiqildi. **Zarar yo'q:** to'rtala B5 fayli
  esbuild+til-lint toza; `PmLesson22` metodisti tahrirni yetkazib ulgurgan (arena Q1/Q5), faqat hisobot berolmagan.
  Tarmoq tiklangach hammasi kontekst bilan davom ettirildi.
- **Uy-vazifa overlay naqshi bugun uch darsga tarqaldi:** `PmLesson23` (tug'ildi, +397 → +17 → dizayn bilan 0) →
  `PmLesson24` (+439 → 0) → `PmLesson22` (+416 → 0). Uchtasida ham bir xil sinf edi: **bola «Uyga vazifa» ni bosadi,
  ekranda hech nima o'zgarmaydi**.
- **s15 nishon-qatorini yig'ish** naqshi ham ko'chdi: `PmLesson23` → `PmLesson24` (222/251/277 → 0/0/0).
- **Chip-paneli** `PmLesson21` → `PmLesson23` (qabulchi qaytargan band).
- **KECH** — 🎉 **PmLesson24 TO'LIQ YOPILDI** (qabulchi 28/28 + verifikator imzo; STATE ga yozildi). Verifikator DOM bilan
  tasdiqladi: `.road` da `::before/::after = none` — bog'lovchi chiziq yo'q, chiplarda raqam yo'q (mexanika-chegarasi
  Timeline'dan farqli) · s15 overlay 9 o'lchovda 0 · `KD_CODE` Node'da 0/3 · 3/3 · 2/3 · podium seed bilan 3/4.
- **KECH** — PmLesson22 qabulchi **27/28**: yagona ochiq band — **kod nuqsoni emas**, verifikator-imzosi hali
  yo'qligi (u parallel ishlayapti). Qolgan 27 band yopilgan: §144 mustaqil o'lchov **0/12** · §147-A 12/12 ·
  §148-A sarlavha istisnoni aytadi · §148-C PRD harflari ochilgan · `KD_STEPS` **33/33 satr** yo'qotmaydi ·
  artefakt `PmLesson23:1353` o'qiydigan shaklda.
  🟡 Qabulchi ikki senariy-chetlanishni jurnalga yozishni so'radi: (a) `[BLOK 6]` uchinchi natija `[]` → `["yechim"]`
  (§140-B foydasiga oqlanadi) (b) senariy «Altair arenaga kirmaydi» degan edi, hozir Q9/Q10 va s7 da bor — gloss s6 da
  oldin berilgani uchun §21 maqsadi bajarilgan.
- **KECH** — PmLesson25 qabulchi **25/28 → QAYTARISH**, ikki band:
  ① 🔴 **s8 chip-paneli** (`:1539-1540`): yorliqlar **7 va 6 so'z** (ETALON 32(a) ≤4; pretsedent `PmLesson21` 4/5/3,
  `PmLesson23` 3/3/3) VA — muhimrog'i — **chip mazmun-shartiga bog'lanmagan**: `list.length > 1` yonganda «odam yoki
  tizim ishini aytadi» ✅ bo'ladi, hatto o'quvchi «312 kod satri» yozganda ham (`faqatMehnat` faqat 🤔 beradi).
  §130 va M6-D6 qabulchi qarori aynan shu bog'lamni talab qiladi (`PmLesson21`: `done && ikkiSon`, `PmLesson23`:
  `done && bariInkor`). → metodist (yorliq ≤4 so'z) + quruvchi (predikatni chipga ulash).
  ② band 20 — verifikator imzosi (u parallel ishlayapti).
  ✅ Qolgan hammasi mustaqil o'lchovda toza: §144 **0/12** (eng yuqori E=0.60, batch normasidan yaxshi) · §147-A 16/16 ·
  §146 ikkala yarim ta'riflangan · §140-B starter 0/3, for-of 3/3, filter 3/3, obyekt-tuzoq 1/3 · PITCH-OILASI taqiqi 0.
  ⏸ Tuzatish **verifikator tugagach** boshlanadi (uning brauzer-o'lchovlari eskirmasin).
