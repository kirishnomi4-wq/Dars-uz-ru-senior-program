# ULASH YO'RIQNOMASI — 151-qonunni bitta partiyaning ekranlariga ulash (agent uchun brif)

Bu faylni BOSHIDAN OXIRIGACHA o'qing. Siz bitta partiyaning (P1…P6) egasisiz: faqat shu partiya fayllarini tahrirlaysiz.
Etalon: `src/1-Modull/InternetLesson.jsx` (s13b — o'yin, s13c — tartiblash). Qonunlar: `DARS_ETALON.md` 151- va
152-qonun (`## 11-O`, `## 11-P`), matnlar: `MATN_KORPUS.md` §183. Inventaringiz: `feedback/F-0918-04/b-tolqin/inventar-P<n>.json`.

## 1. Maqsad

Partiyangizdagi har **ishlanadigan** ekranda (inventar hukmi `A-umumiy-komponent`, `A-qol-ishi`, `C-halol`):
1. Birinchi **bilim-xatosi** bo'lgan onda `achMiss.miss(screen)` chaqirilsin → nishon birinchi urinishga qoladi, belgi
   progressga yoziladi (F5 o'chirmaydi). Ildiz (A to'lqin) allaqachon hamma darsda tayyor: `AchMissCtx`, `missTry`,
   `recordAnswer` da `!missedRef.current.has(_m.id)`.
2. Topshiriq ostida `<AchRule screen={screen} />` turadi (shart oldindan aytiladi; xatodan keyin jazosiz matn).
3. Har ekran brauzerda isbotlanadi — `scripts/ach-probe.mjs` (7 holat).

## 2. Foydalanuvchi qarorlari (18.09 — o'zgarmaydi)

- **Ko'p-bandli topshiriq:** bitta bilim-xatosi = nishon yo'q. **Sirpanish urinish EMAS:** bo'lakni zonadan tashqariga
  tashlash, joylangan bo'lakni qaytarib olish, «qator band / katak band» kabi texnik rad, hali ochilmagan joyni bosish,
  bo'sh holatda «Tekshirish». Bitta shartda bilim-xatosi va sirpanish qo'shilgan bo'lsa — ajrating.
- **151-jadval:** tartiblash (avto-tekshiruv) — hamma katak to'lib, tartib xato chiqqan on · «Tekshirish» tugmali —
  bosilib, natija xato chiqqani · tanlov/o'yin — ekran «❌/silkinish/rad» bilan qaytargan har xato qadam.
- **PM «koding» (pickKod / `ScreenCoding` / kompilyator)** — MEHNAT: kodga tegilmaydi.
- **«To'g'ri javobi yo'q, o'z qarori» mashqi** — MEHNAT. **Erkin yozma ish, VS Code «Bajardim»** — MEHNAT.
- **PM darslarda tekin 4-ekran** — darsning BONUSI (kodga tegilmaydi; qayd qilasiz).
- **Q6 — «faqat xato qator bosiladigan» debug ekran** (sizga aniq ro'yxat berilgan bo'lsa): hamma kod qatorlari
  bosiladigan qilinadi; xatosiz qator bosilsa — qisqa javob **«Bu qatorda xato yo'q — yana qarang.»** / ru **«В этой
  строке ошибки нет — посмотрите ещё раз.»** (TASDIQLANGAN matn, boshqasi emas) + `miss`; xato qator — avvalgidek.
  Ko'rinish ekrandagi mavjud xato-fidbek uslubida (mavjud klass/rang), yangi dizayn o'ylab topilmaydi.
- **Qayta urinishi YO'Q ekran** (bir martalik tanlov, tanlov qotadi): `<AchRule screen={screen} once />` — xatodan keyin
  «Nishon birinchi urinish uchun edi.» chiqadi (codemod beradi).

## 3. Taqiqlar (buzilsa — ish qaytariladi)

1. **Commit, push, `vite build`, dev-server — YO'Q.** Faqat bosh agent qiladi.
2. **Faqat o'z partiyangiz fayllari** (inventaringizdagi `file` lar). `src/live/`, boshqa partiyalar, qonun/KORPUS/STATE/
   KATTA/`TUNGI_*` — TEGILMAYDI. Yozadigan joylaringiz: o'z dars-fayllaringiz + `b-tolqin/probe/P<n>.json` +
   `b-tolqin/holat-P<n>.json` + `b-tolqin/matn-P<n>.md` + o'z skretch-papkangiz.
3. **O'quvchi ko'radigan matn O'ZGARMAYDI** (Mentor, audio `text`, maslahat, fidbek, `desc`, sarlavha). Istisno: Q6
   dagi tasdiqlangan qator va `AchRule` matnlari (codemod beradi). Matn kerak bo'lsa — `matn-P<n>.md` ga taklif, ekran ⏸.
4. **CSS izohiga backtik YOZILMAYDI** (`<style>{\`…\`}` ni erta yopadi → oq ekran). **Bir qatorli funksiya ichiga `//`
   izoh YOZILMAYDI** (qatorning qolgani o'chadi). Izoh kerak bo'lsa — alohida qatorda.
5. **Nom:** ekranda kontekst o'zgaruvchisi har doim `achMiss` (`const achMiss = useContext(AchMissCtx);`) — ko'p PM
   ekranlarida mahalliy `miss` / `setMiss` bor. `useContext` import'ini tekshiring.
6. **Ball-mantiqqa tegilmaydi:** `onAnswer` dagi `correct`, `INLINE_KEYS`, `submitAnswer` — o'zgarmaydi. Nishonni
   `missed` to'sadi (ildizda). Istisno yo'q.
7. **Mavjud «allaqachon halol» hisob** (`!wrongEverRef.current`, `mistakes === 0`) — qoladi; faqat xato nuqtasiga `miss`
   qo'shiladi (F5-teshikni yopadi). `restart`/`reset` hisobni nollasa ham `missed` qoladi — shuni bilib qo'ying.
8. **Maks 2 urinish** har ekranga. Ikkinchi marta ham prob o'tmasa — shu ekran uchun qilgan o'zgarishlaringizni QO'LDA
   qaytaring (fayldagi boshqa ekranlar ishi saqlansin), ekran ⏭ + sabab.

## 4. Har ekran uchun ish tartibi

1. Inventar yozuvini va ekran kodini HOZIRGI holatda o'qing (qator raqamlari surilgan bo'lishi mumkin — kod bo'yicha
   toping). Hukmni tasdiqlang. Kod inventardan farq qilsa: halol yo'l aniq bo'lsa — o'zingiz hal qiling va `holat`
   da `qaror` maydoniga yozing; aniq bo'lmasa — ⏭.
2. Faylda hali `AchRule` yo'q bo'lsa: `node scripts/codemod-achrule.mjs --write <fayl>` (bir marta; quruq yurish bilan
   ham ko'rsa bo'ladi). U komponent + CSS ni qo'yadi (rang kontrast bo'yicha tanlanadi).
3. Ulash:
   - **Ekranning o'z kodida xato-tarmoq:** o'sha tarmoq boshida `if (achMiss) achMiss.miss(screen);`. Holat-mashina /
     `setTimeout` ichida bo'lsa — aynan xato ANIQLANGAN joyda (etalon: `InternetLesson.jsx` `bounce`).
   - **Umumiy komponent** (`DragDropOrder`, `DebugChallenge`, `PickLines`, `NightShift` …): komponentga `onWrong` prop
     qo'shing — etalon `DragDropOrder` (`InternetLesson.jsx`): `useEffect(() => { if (wrong) onWrong && onWrong(); }, [wrong]);`
     (`wrong = full && !solved`) yoki xato-tarmoqda `onWrong && onWrong();`. Ekranda: `onWrong={() => achMiss && achMiss.miss(screen)}`.
     Komponent shu faylda boshqa ekranlarda ham ishlatilsa — `onWrong` berilmagan joyda hech narsa o'zgarmasligi shart.
   - `<AchRule screen={screen} />` — topshiriq (interaktiv qism) OSTIDA, natija/muvaffaqiyat blokidan OLDIN. `Col`/
     `split` ichida topshiriq qaysi ustunda bo'lsa — o'sha ustunda.
4. Probga spetsifikatsiya yozing (`b-tolqin/probe/P<n>.json` — massivga qo'shing). Format — `scripts/ach-probe.mjs`
   boshidagi izohda; namuna — `b-tolqin/probe/pilot.json`. `wrong` — bitta aniq bilim-xatosi; `right` — toza holatdan
   to'liq to'g'ri yakunlash (ekran `onAnswer` chaqiradigan nuqtagacha — kerak bo'lsa «Tekshirish»/yakun tugmasi ham);
   `rightAfterWrong` — xatodan keyingi holatdan yakunlash farq qilsa; `slip` — sirpanish sanalmasligini isbotlaydigan
   harakat (bo'lsa, albatta yozing). Animatsiya/taymer bo'lsa — `after` bilan kuting (etalon s13b: 1600 ms).
   Selektor: avval barqaror klass/matn (`button:has-text("…")`); `eval` — oxirgi chora.
5. Yurgizing (faqat shu ekranni — vaqtincha bitta yozuvli spec bilan):
   `CHROME=/usr/bin/google-chrome node scripts/ach-probe.mjs --shots <skretch>/shots --out <skretch>/p.json <spec>`
   Hammasi ✓ bo'lishi shart: S0 S4 S5 S2 S1a S1b (+S3 agar `slip`). Keyin S0 skrinshotini OCHIB KO'RING (Read): qator
   topshiriq ostidami, ustma-ust tushmaganmi, ekranni sig'maydigan qilib qo'ymaganmi.
6. Darvozalar: `npm run gates -- <fayl>` — `esbuild`, `jsx`, `keys`, `prompt` ✓ bo'lishi SHART; `dark`/`til` eski qarz
   bo'lishi mumkin — `S=<skretch> python3 feedback/F-0918-04/lintcmp.py <fayl>` → «farqi: 0» bo'lishi SHART.
   Oxirida (partiya tugagach) `npm run lint:jsx` — 0 topilma.
7. `holat-P<n>.json` ga yozing (har ekran — bitta obyekt, massiv):
   `{ "file", "sid", "ach", "status": "✅"|"⏭"|"⏸"|"—", "tur": "A-umumiy|A-qol|C-halol|Q6|MEHNAT|BONUS|TEKIN|NOANIQ",
      "nima_qilindi": "1–2 jumla", "miss_joyi": "funksiya/holat nomi", "urinish": "nima bitta xato urinish sanaldi",
      "sirpanish": "nima sanalmaydi (bo'lsa)", "prob": {S0…S3 natija}, "gates": "esbuild/jsx/keys/prompt ✓, lintcmp 0",
      "qaror": "inventardan farq qilgan joyda o'zingiz qabul qilgan qaror va sababi", "urinishlar_soni": 1|2,
      "eslatma": "brauzerda ko'rgan narsa, xavf" }`
   Kodga tegilmaydigan (MEHNAT / BONUS / TEKIN / NOANIQ) har trigger ham `status: "—"` bilan qayd etiladi — hisobot to'liq
   bo'lishi uchun. TEKIN ekranning darsida bonus allaqachon bo'lsa (152-qonun 1-band: ko'pi bilan 1 bonus + `graduate`) —
   `status: "⏸"`, `eslatma` da taklif.
8. Matn-topilmalar (Mentor/audio/maslahat javobni urinishdan OLDIN aytadi; `desc` rost emas; ko'chirishda yangi `desc`
   kerak): `matn-P<n>.md` ga jadval qatori: `| dars · ekran | ❌ hozirgi (aynan iqtibos) | ✅ taklif (uz; ru bo'lsa ru) | sabab |`.
   Taklif yozishdan oldin `MATN_KORPUS.md` §63, §133, §183, §184 ni o'qing; adabiy til, siz-forma, sheva/kantselyarit yo'q.

## 5. Hisobot (bosh agentga, 15–25 qator)

- Sonlar: ✅ / ⏭ / ⏸ / — (ishlanadigan ekranlardan nechta ✅).
- ⏭ va ⏸ ro'yxati sabab bilan (ekran o'quvchi ko'radigan sarlavhasi bilan).
- Inventardan farq qilgan va o'zingiz qaror qilgan joylar.
- Umumiy komponentga tegilgan bo'lsa — qaysi, boshqa ekranlarga ta'siri tekshirildimi.
- `lint:jsx` natijasi; o'zgargan fayllar ro'yxati.
- HALOLLIK: probi yo'q yoki qisman bo'lgan ekranni «✅» demang; ko'rmagan narsangizni ko'rdim demang.
