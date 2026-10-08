# 1 · MD v3 — o'quvchi ko'radigan har so'z (konveyer)

Vazifa: bitta dars uchun `feedback/<modul>/NN-<Nom>-v3.md`. **MD = manba-haqiqat**: kod MD'dan chetga chiqmaydi, chetlashsa — MD yangilanadi.
Namuna: `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md`. Yozishdan oldin: `MATN_KORPUS.md` (taqlid-manba) va `konveyer/QURISH_KARTASI.md`
(T · P · S, PM darsda + PM) — o'qiladi.

## 0. Manba yig'ish (taxmin emas)
- Dasturdagi o'rni va oldingi/keyingi dars — `src/App.jsx` `comp:` qatorlaridan (menyu nomi = dars nomi, DE-205).
- Misol-ip (bitta olam) va uning oldingi darslardagi nomlari; o'tilgan atamalar — grep bilan (bir ma'noga bitta so'z, T-014).
- Test rejasi: ballik ekranlar soni, final turi, arena 12 savol (to'g'ri javob 3/3/3/3).
- Eski dars bo'lsa: hozirgi kod va v2 MD (`NN-Nom-v2.md`) — v3 faqat o'zgargan ekranlarni to'liq yozadi.

## Format
```
# <Modul> · <N>-dars «<Nom>» — MD v3
Fayl: `src/…/<Nom>Lesson.jsx` · <ekranlar soni> ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatga keltiriladi. ⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi.

## A. Darsning tayanchi — tushunchalar, atamalar (bir ma'no — bir so'z), misol-ip, bitta vizual (163/180)
## Darsning ipi va bitta vizual — hook, butun dars ishlatadigan bitta vizual (tugunlar, holatlar)

## <N> · <ekran nomi>  ← <QOLIP TURI>
- Eyebrow: …
- Sarlavha: **…** (belgilar soni)          ← bitta qator, ≤55 (164); iloji bo'lsa savol
- Mentor: …                               ← ≤2 gap; sarlavhani takrorlamaydi (225)
- <tur maydonlari — pastdagi jadval>
- **Harakat → Vizual o'zgarish:** o'quvchi nima qiladi → vizualda nima o'zgaradi (DE-184)
- Xulosa (tugagach): … (≤110)             ← bitta yashil xulosa (202)
✎ eskidan nima o'zgardi (bor ekran bo'lsa)
```
Oxirida: Nishonlar · Qisqa takrorlash oynalari (har ballik test — 3 karta) · Jonli viktorina (12, ✔) · Kartochkalar (10–12) · Yakun
(chip · sarlavha · **«AI bilan davom» kartasi — sherik/juftlik/real suhbat bor darsda majburiy (PM-109): yo'riq 2 gap + tayyor so'rov + nusxalash** · «Endi siz bilasiz» 3–5 · uyga vazifa · «Keyingi dars — …») · «KOD» belgilari ro'yxati (kod o'zgarishi kerak bo'lgan joylar).

## Qolip turlari (har ekran bittasidan — `src/qolip/QOLIP.md`)
| Tur | MD'da yoziladi |
|---|---|
| `QKirish` | savol-sarlavha · Mentor · maket (nima ko'rinadi, nima bosiladi) · radio-variantlar · javob: to'g'riga «**Aynan!** …», boshqasiga «**Qiziq fikr!** …» (≤120) |
| `QReja` | chapda «Dars oxirida …» + bitta vizual · o'ngda «01 · matn · teg» (3–4 qadam) |
| `QTushuncha` | bashorat (ballsiz, 181) → harakat → vizual o'zgaradi → taxmin natijasi → bitta xulosa; tugagach harakat paneli yopiladi, natija fokusga (199) |
| `QTest` | savol · 4 variant (uzunligi teng, kalit so'z/strelka faqat to'g'rida emas) · ✔ · to'g'ri izohi (bitta qisqa gap, «To'g'ri!» so'zisiz) · xato izohlari (≤60) |
| `QTartib` | bo'laklar (to'g'ri tartibda) · uya izohi «bu yerga qo'ying» (tartibni ochmaydi) · yechilgach bitta xulosa |
| `QKod` | chapda vazifa (3 band) + Yordam + «Bajardim» · o'ngda muharrir · bir balandlik (190) |
| `QVoqea` | nuqtalar · slayd-karta + chizilgan maket (emoji emas) · bashorat — PM keys: «Biznes olamidan», «{Brend} · N/M» |
| `QMustaqil` | chiplar 1/2/3 · forma · Yordam · «Saqlash» o'ngda (bitta ustun) |
| `QNatija` | PM natija — bitta karta |
| `QKartochka` · `QYakun` | kartochkalar · yakun (texnik darslar standarti aynan, 204) |
| amaliyot bloki | loyiha kuni (172/173): 4 qadam · prompt qutisi `{…}` · kutilgan natija chati · «Ortda qoldingizmi — `git checkout -f dars-NN-done`» |

## GATE M — tekshiruv ro'yxati (foydalanuvchiga berishdan oldin o'zingiz belgilang)
- [ ] Oldingi/keyingi dars va menyu nomi — App.jsx bilan mos (205)
- [ ] Bitta misol-ip; metafora ko'pi bilan bitta, bir marta · bitta vizual dars bo'yi
- [ ] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor (matn-karta emas)
- [ ] Sarlavha ≤55 bitta qator · Mentor ≤2 gap va sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60
- [ ] Atamalar oldingi darslar bilan bir xil (grep) · siz-forma (zanjir/yorliq ot-shaklda, tugma siz-formada — §222/224)
- [ ] Testlar: uzunlik teng, kalit so'z/strelka/qavs faqat to'g'rida emas · eski darsda ✔ o'rni o'zgarmagan
- [ ] Final: uya izohi tartibni ochmaydi, Mentor tartibni aytmaydi
- [ ] Emoji yo'q (o'yin qatlami — arena, nishon medali, podium — bundan mustasno) · kafolat gaplari yo'q («har doim», «100%», «darrov»)
- [ ] Ichki kodlar yo'q (T6, Modul 9, P1) · tarixiy voqea — manba bilan · «KOD» ro'yxati to'liq
- [ ] Karta (`QURISH_KARTASI.md`) T · P · S (+ PM) — har band ko'rildi

## GATE M sahifasi (foydalanuvchiga)
Modulning hamma MD v3 lari va savollari — **bitta** sahifada: `python3 konveyer/vositalar/gatem/sahifa.py <config.json> feedback/<modul> <scratchpad>/gatem.html`
(config namunasi `konveyer/vositalar/gatem/namuna-6modul.json`: avval «Modul bo'yi» — bir nechta darsga tegadigan savollar, keyin darslar; birinchi variant = tavsiya).
Sahifani asosiy seans Artifact qilib e'lon qiladi; javob qatori («GATE M <kod> / Darslar … / Savollar …») chatga qaytadi → `GATE_M_JAVOB.md` (agentlar uchun majburiy qarorlar).
**GATE M tasdig'i — matnni tasdiqlash, agent yuborishga ruxsat EMAS** (05.10): konveyer 3-bosqichdan oldin alohida qisqa ruxsat — nechta agent, qaysi fayllar.

## Filtr (tashqi audit kelganda)
Har band → darsda bormi (grep) → fakt (App.jsx, oldingi darslar) → qonun → kalit/pozitsiya → auditoriya (Toshkent o'smiri).
Hukm Qabul / Qisman / Rad + sabab — jurnalga. Tashqi audit — kirish, qonun emas.
