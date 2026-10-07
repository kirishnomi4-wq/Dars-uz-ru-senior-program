# 11-Modul · 9-dars «React Native va Expo: prototip telefonda» — MD v3

Fayl: `src/9-Modull/ExpoPrototypeLesson.jsx` (kalit `m9-09`, App.jsx `type: 'Kod'`) · **19 ekran** (14 dars ekrani + 2 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, keyssiz. Qolip: texnik dars (QKirish, QReja, QTushuncha, QTest, QKod, QTartib) + 2 amaliyot bloki (QBlok, har biri ikki trekda).
Menyu nomi (DE-205, App.jsx 380-qator `m9-09`): «React Native va Expo: prototip telefonda» · osti «Expo, navigatsiya; web-trek — adaptiv sayt va PWA» ·
oldingi `m9-08` «Arxitektura va platforma: web yoki mobil ilova» · keyingi `m9-10` «Loyiha kuni: poydevor — Database, kirish, deploy».
Namuna: 1-to'lqin `07-LivePrototype-v3.md` (TEX tuzilishi, QKod, bloklar) · `10-FoundationDay-v3.md` (trek farqi, Expo Go qadamlari) · 8-Modul (kod `6-Modull`) YAKUNIY `feedback/F-0929-QA-6modul/YAKUNIY/09-ReactNativeBasics.md`, `10-ReactNativeApp.md` (takror qismi).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 3-ekran **B** · 6-ekran **D** · 8-ekran **A** · 12-ekran **C** · 13-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — 0–1 ≈ 4 · 2–8 (mobil trek tushunchalari) ≈ 20 · 9–13 (web-trek va final) ≈ 15 · A1 ≈ 25 · A2 ≈ 20 · podium, kartochkalar, yakun ≈ 6.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9 · tayanch 4):** dars oxirida o'quvchining prototipi **o'z telefonida** ochiladi — mobil trekda Expo ilovasi bo'lib (Expo Go, QR orqali), web-trekda adaptiv sayt va PWA bo'lib
   (Netlify'dan, telefonning bosh ekraniga qo'shilgan). Trek — 8-darsdagi tanlov (`pm-m9d8-platforma.trek`). Mentor misoli — «Maydon Jamoa», mobil trek; repo `maydon-jamoa`,
   teg `m11-dars-09-start` (= `m11-dars-08-done`) → `m11-dars-09-done` (tayanch 3: `mobil/` — Expo Router, Stack, uch ekran prototipdagidek, namuna ma'lumot; `prototip/` adaptiv + `manifest.webmanifest`).
2. **Bugungi asosiy fikr (P-013):** Mobil trekda prototip Expo ilovasiga ko'chadi — har ekran o'z faylida — va QR orqali Expo Go'da ochiladi; web-trekda u adaptiv sayt va PWA bo'lib, telefonning bosh ekraniga qo'shiladi.
3. **Oldingi darslardan keladigan narsa:** 7-darsdagi jonli prototip (`prototip/`, React + Vite + Motion, uch ekran: O'yinlar · O'yin · E'lon berish, namuna ma'lumot — tayanch 9.2, 9.15) va
   o'quvchining wireframe yozuvi `pm-m9d7-wireframe` `{ funksiya, ekranlar: [{ nom, nima, tugma }] }` (A1 promptidagi joylar shundan oldindan yoziladi) · 8-darsdagi platforma `pm-m9d8-platforma` `{ trek, javoblar, asos }`
   (bloklar shu trekda ochiladi). 8-Modul `m6-09` (View, Text, StyleSheet, Pressable, Expo, Expo Go + QR, «odatda bitta Wi-Fi») va `m6-10` (Stack Navigator, `navigation.navigate`) — takror sifatida 2 va 4-ekranlarda.
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim, aynan):**
   - **React Native** · **Expo** · **Expo Go** · **Stack** — 8-Moduldan, qayta ta'riflanmaydi. `View` (quti) · `Text` (matn) · `Pressable` (bosiladigan joy) · `StyleSheet` (ko'rinish) — 8-Modul so'zlari.
   - **Expo Router** — Expo'ning navigatsiyasi: ekranlar fayllar bilan tuziladi; bu misolda har ekran o'z faylida, `_layout.tsx` esa ekran emas — ularni bog'laydi (09-FILTR 1, 2) (4-ekranda, harakatdan keyin; T-011). Sarlavhalarda 4-ekrandan oldin yo'q.
   - **8-Modul ko'prigi (tayanch 1.6, so'zma-so'z, bir marta — 4-ekran Mentori):** «8-Modulda Stack Navigator bilan ekrandan ekranga o'tgansiz — Expo Router'da ham Stack bor, faqat har ekran — alohida fayl.»
   - **ekran** — faqat ilovaning bitta ko'rinishi: **O'yinlar** · **O'yin** · **E'lon berish** (tayanch 1.6, aynan). **bosh ekran** — telefonning ilovalar turadigan asosiy ekrani (PWA ta'rifi so'zi, tayanch 2).
     **sahifa** — faqat brauzer sahifasi («sahifani yangilang»). Dars ekrani «ekran» deb atalmaydi (T-064).
   - **manzil** — sahifa yoki ekran manzili: brauzerda `localhost:5173`, `….netlify.app`; Expo Router'da har ekran faylga mos manzilda ochiladi: `/` · `/elon` · `/oyin/2` (4–5-ekranlar). Bu ma'noda «yo'l» ishlatilmaydi
     («yo'l» — faqat umumiy so'z: «telefonga yo'l», «bosish yo'llari» — 7-dars talabidagidek).
   - **`.tsx`** — Expo shablonidagi fayl turi: TypeScript'dagi React fayli (bir marta, 4-ekran izohida; kodni agent yozadi, o'quvchi o'qiydi). TAYANCHGA SAVOL 4.
   - **tunnel** — telefon kompyuterga internet orqali ulanadigan yo'l (`npx expo start --tunnel`), sekinroq (7-ekran; TAYANCHGA SAVOL 4).
   - **adaptiv sayt** — telefon kengligiga moslashadigan sayt (9-ekran, harakatdan keyin; «responsive» o'quvchi matnida yo'q — T-014, 09-FILTR 24).
   - **PWA** — telefonning bosh ekraniga ilova kabi qo'shiladigan sayt; birinchi marta «PWA (Progressive Web App)» (11-ekran, harakatdan keyin).
   - **manifest** — sayt o'zi haqida yozadigan kichik fayl: nomi, ikonkalari, qaysi sahifadan va qanday ochilishi (`manifest.webmanifest`; 11-ekran; TAYANCHGA SAVOL 4).
   - **trek** · **mobil trek** · **web-trek** — 8-darsdan (tayanch 2). **prototip** · **jonli prototip** · **wireframe** · **namuna ma'lumot** · **talab** · **agent** (Antigravity) · **tekshirish** — 7-darsdan, aynan.
   - **Ishlatilmaydi:** «responsive» · «moslashuvchan» · «Progressive Web App» (birinchi ko'rinishdan keyin) · «server» (prozada) · «sinov» (real odam — 12–13-darslar) · F1/F2/F3.
5. **8-Modul takrori — ikki ekranda:** 2-ekran (prototip kartasi React'dan React Native'ga: `View`, `Pressable`, `Text`, `StyleSheet`) va 4-ekran Mentori (Stack ko'prigi). Expo Go + QR 8-Modulda o'tilgan —
   7-ekranda yangi qismi: bitta Wi-Fi sharti, tunnel, iPhone'da bitta Expo akkaunti.
6. **Web-trek — alohida tushuncha ekranlari (9–12):** adaptiv sayt (9 — tushuncha, 10 — kod oynasi) va PWA (11 — tushuncha, 12 — test). Hamma o'quvchi ikkala yo'lni ham o'tadi (testlar ikkala yo'ldan);
   bloklarda har kim faqat o'z trekida ishlaydi.
7. **RN kodi (Qaror-0 10):** o'qiladigan qisqa bo'lak (3–4 qator, P-065) + chizilgan telefon maketi — harakat → telefon ekrani o'zgaradi. Kod oynasi (QKod) faqat web qismida — 10-ekran, adaptiv CSS.
   Haqiqiy ishga tushirish — A1 da, o'z telefonida Expo Go bilan.
8. **Metafora yo'q.** Qahramon yo'q — vazifani Mentor beradi; odamlar — tashkilotchi, o'yinchi. Keys yo'q (TEX, Qaror-0 17).
9. **Toza yuza (185, D4):** tugma, variant, karta, yorliq va maketlarda emoji yo'q; telefon, terminal, brauzer, QR, Wi-Fi va bulut belgisi chizilgan (CSS/SVG), logotip yo'q; rang — faqat holat foni. O'yin qatlami (arena, nishon, podium) — mustasno.
10. **Manbalar (o'quvchiga ko'rinmaydi; 06.10.2026 tekshirildi):**
    - Expo — docs.expo.dev/get-started/start-developing: «you will see a QR code in your terminal. Scan this QR code to open the app on your device» · «Make sure you are on the same Wi-Fi network on your computer and your device» ·
      iPhone: «Expo Go opens your project only when Expo CLI and Expo Go are signed in to the same Expo account. Run `npx expo login` on your computer, then sign in to Expo Go with the same account» ·
      «To sign in to Expo Go, tap the account icon in the top-right corner» · tunnel: «it may be due to the router configuration — this is common for public networks … choosing the Tunnel connection type» — `npx expo start --tunnel`,
      «considerably slower than on LAN or Local» · birinchi tahrir — `src/app/index.tsx`, `src/app/_layout.tsx`, `src/app/explore.tsx`.
    - Expo — docs.expo.dev/tutorial/create-your-first-app: «On Android, use the Expo Go > **Scan QR code** option. On iOS, use the default camera app.»
    - Expo — docs.expo.dev/more/create-expo: default shablon — «Designed to build multi-screen apps. Includes … Expo CLI, Expo Router library and TypeScript configuration enabled»; `npx create-expo-app@latest <nom>`.
    - Expo Router Stack (tayanch 6): `_layout.tsx` — `import { Stack } from 'expo-router'` → `<Stack />` · `useRouter()` → `router.push('/…')` · `[id].tsx` → `useLocalSearchParams()`.
    - Tunnel uchun avval `npm i -g @expo/ngrok` (tayanch 6, docs.expo.dev/more/expo-cli) · terminalda `r` — «Reload the app on any connected device» (10-dars MD, docs.expo.dev/more/expo-cli).
    - PWA — web.dev/articles/install-criteria: HTTPS; manifest — `short_name` yoki `name`, `icons` (192 px va 512 px), `start_url`, `display` (`fullscreen` · `standalone` · `minimal-ui` · `window-controls-overlay`),
      `prefer_related_applications` yo'q yoki `false`; foydalanuvchi sahifani kamida bir marta bosgan va 30 soniya ko'rgan. Service worker shart sifatida yo'q.
    - Chrome (Android) — support.google.com/chrome/answer/9658361 (Android): «On the right of the address bar, tap More ⋮ › **Install and create shortcut** › **Install**».
    - iPhone Safari'da bosh ekranga qo'shish — **tekshirilmagan** (tayanch 6): matnda tugma nomi yo'q, umumiy so'z (Shubhali 1).
    - Netlify — 9-Modul `09-MvpComplete-v3.md` A3 yo'li: app.netlify.com → yangi loyiha → GitHub'dan import → repo; Base directory, build `npm run build`, publish `dist`; har push'da o'zi yangilanadi. `*.netlify.app` da HTTPS o'zi (tayanch 6 → 10-Modul tayanchi 6).
    - `@media` — 9-Modul `05-Animation-v3.md` (`prefers-reduced-motion`); `flex-direction: column` — 2-Modul (kod `m1-07`) «CSS: layout, flexbox, DevTools» («elementlar ustma-ust, yuqoridan pastga tiziladi»).

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova (tayanch 1). 7-darsda jonli prototip kompyuter brauzerida bosildi, 8-darsda Mentor mobil platformani tanladi.
  Bugun shu prototip telefonga chiqadi: ekranlar React Native'ga ko'chadi → har ekran o'z faylida → QR orqali Expo Go'da ochiladi. Web-trek yo'li ham shu prototipdan: adaptiv → manifest → Netlify → bosh ekran.
  O'quvchi o'z trekida, o'z mahsulotida A1 va A2 da bosib o'tadi.
- **Hook:** prototip kompyuterda `localhost:5173` da ishlayapti; telefonda shu manzil ochilsa — prototip chiqmaydi: telefon uchun `localhost` — telefonning o'zi.
- **Bitta vizual — «Maydon Jamoa» telefoni** (`JamoaTelefon`, bitta manba `JAMOA_EKRANLAR` + `NAMUNA_OYINLAR`, 163/180): telefon ramkasi (191), **doim chapda va bir o'lchamda** (10-Modul SABOQ 21–22), ichida uch ekran;
  «Maydon Jamoa» nomi ekran tepasida o'z rangida (TAQIQLAR 0). Uch holat — bir xil joylashuv:
  - **brauzer** — tepada brauzer manzil qatori (`localhost:5173` yoki `maydon-jamoa-….netlify.app`, qulf belgisi bilan); ichida prototip (React).
  - **expo** — manzil qatori yo'q, ramka ustida kichik yorliq «Expo Go»; ekranlar React Native ko'rinishida (o'sha joylashuv), o'tish — Stack (yangi ekran o'ngdan suriladi, «‹» bilan qaytadi).
  - **pwa** — telefon bosh ekrani (kulrang ikonka kataklari, bitta bo'sh joy uzuq chiziqda — U-041) → «Maydon Jamoa» ikonkasi (accent rangli kvadrat, harfsiz) → bosilsa sayt manzil qatorisiz ochiladi.
  - **O'yinlar:** sarlavha «O'yinlar» · 4 ta o'yin kartasi (kun va soat · maydon · «n / m») · pastda «E'lon berish». **O'yin:** «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · qo'shilganlar — 10 ta joy (8 to'la doira, 2 bo'sh) · «Qo'shilaman».
    **E'lon berish:** «‹ O'yinlar» · Kun · Soat · Maydon · Nechta odam · «Yuborish» (tayanch 9.15, 07 bilan aynan).
  - **`NAMUNA_OYINLAR`** (tayanch 9.2, aynan; `id` — satr, TAYANCHGA SAVOL 7): `'1'` Shanba, 18:00 · Mahalla maydoni · 8 / 10 — `'2'` Shanba, 20:00 · Maktab maydoni · 6 / 10 —
    `'3'` Yakshanba, 10:00 · Park maydoni · 4 / 8 — `'4'` Yakshanba, 17:00 · Mahalla maydoni · 9 / 10.
  - O'ngda — har ekranda **bitta** yordamchi panel (SABOQ 26: ≤ 3 blok): kod bo'lagi · fayl daraxti · terminal va QR · `style.css` · `manifest.webmanifest`.
  - Ishlatilishi: 0 (brauzer, `localhost`) · 1 (expo, tayyor holat) · 2 (brauzer → expo) · 4, 5 (expo, fayllar) · 7 (expo, QR) · 9 (brauzer oynasi torayadi) · 11 (pwa) · A1, A2 kutilgan natija (trekka qarab).
    `prefers-reduced-motion` da maketning o'z harakati to'xtaydi, yakuniy holat ko'rinadi (DE-200).
- **Telefonga yo'l** (bitta manba `TELEFON_YOLI` — mobil trek; 7-ekran holatlari, 13-ekran finali va A1 qadamlari shundan, P-063): Expo loyihasini yaratish · QR'ni telefonda Expo Go bilan ochish ·
  Ekranlarni `src/app/` fayllariga ko'chirish · Uch ekranni telefonda bosib tekshirish.
- **Yakun:** prototip o'z telefonida · keyingi dars — uning ortiga poydevor (Database, kirish, deploy).

---

## 0 · Kirish — telefonda `localhost`  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Telefonda `localhost:5173` ni ochsangiz, nima chiqadi?** (52)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Jonli prototipingiz kompyuterda `localhost:5173` da ishlayapti, endi uni telefonda ochmoqchisiz — avval javobni tanlang.
  - javobdan keyin: Endi telefon ostidagi «Ochib ko'rish»ni bosing.
  - natijadan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Maket (chap): **telefon** (brauzer holati) — manzil qatorida `localhost:5173` yozilgan, ekran hali bo'sh (sokin skelet); orqaroqda, kichikroq — **kompyuter brauzeri** `localhost:5173`, ichida «Maydon Jamoa» O'yinlar (prototip).
  Telefon ostida tugma «Ochib ko'rish» — variant tanlanguncha xira, tanlangach halqada (faol element).
- Variantlar (radio, ballsiz):
  - Prototip chiqadi — manzil kompyuterdagi bilan bir xil
  - ✔ Prototip chiqmaydi — telefon manzilni o'zidan qidiradi
  - Prototip chiqadi — ikkalasi bitta Wi-Fi'da bo'lsa
- **Harakat → Vizual o'zgarish:** variant tanlanadi (ixcham qator bo'lib qoladi) → «Ochib ko'rish» → telefondan so'rov konverti chiqadi, telefon ramkasi atrofida aylanib, telefonning o'ziga qaytadi — kompyuterga bormaydi;
  telefon ekrani kulrang bo'sh qoladi, ostida kulrang yorliq: «`localhost` — telefonning o'zi: bu yerda prototip yo'q». Kompyuterdagi prototip o'zgarmay turadi. Shundan keyin javob matni chiqadi.
- Javob — 2-variant: **Aynan!** Telefon uchun `localhost` — telefonning o'zi. Prototip kompyuterda, telefon unga boshqa yo'l bilan yetadi. (111)
- Javob — 1-variant: **Qiziq fikr!** Manzil bir xil, lekin `localhost` har qurilmada o'zini bildiradi: telefon prototipni o'zidan qidiradi. (112)
- Javob — 3-variant: **Qiziq fikr!** Bitta Wi-Fi'da ham `localhost` telefonning o'zi bo'lib qoladi — kompyuter boshqa manzil bilan topiladi. (113)
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): prototipni telefonga yetkazish. 3-variant qisman rost (bitta Wi-Fi kerak bo'ladi — 7-ekran), javobi uni uyaltirmaydi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun prototipingizni o'z telefoningizda ochasiz.** (49)
- Mentor: Mobil trekda prototip Expo ilovasiga aylanadi, web-trekda — telefonga moslashgan saytga. Avval Maydon Jamoa misolida ko'rasiz, keyin o'z trekingizda, o'z repo'ngizda qilasiz.
- Chap — «Dars oxirida»: telefon (**expo** holati) bir marta o'zi o'ynaydi (DE-200): O'yinlar → Shanba 18:00 kartasi bosiladi va kichrayib qaytadi → O'yin ekrani o'ngdan suriladi →
  «Qo'shilaman» → «8 / 10» → «9 / 10», son bir lahza kattalashib qaytadi. Ramka ustida yorliq «Expo Go».
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` bilan — P-015):
  - 01 · Ekranlarni React Native'ga ko'chirish · `Expo`
  - 02 · Har ekranni alohida faylga qo'yish · `navigatsiya`
  - 03 · QR orqali telefonda ochish · `Expo Go`
  - 04 · Web-trekda: telefonga moslashgan sayt · `adaptiv sayt · PWA`
- Pastki qator (mono, kichik): trekingiz — `pm-m9d8-platforma` dan («Trekingiz: mobil» / «Trekingiz: web»; saqlanmagan bo'lsa — «Trekni amaliyotda tanlaysiz») · Mentor misoli `maydon-jamoa` · tayyor holat `m11-dars-09-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: hamma o'quvchi 2–12-ekranlarning hammasini o'tadi; bloklarda har kim o'z trekida. Darsdan oldin: telefonlarda Expo Go o'rnatilgan va yangilangan, iPhone'larda Expo akkauntiga kirilgan (dastur eslatmasi);
  maktab Wi-Fi'ida QR bir marta tekshirilgan; ochilmasa — o'qituvchi kompyuterida `npm i -g @expo/ngrok` va `npx expo start --tunnel` tayyor.

## 2 · Karta React Native'da  ← QTushuncha (juftlash)
- Eyebrow: Takror · React Native
- Sarlavha: **Prototipdagi karta React Native'da qanday yoziladi?** (51)
- Mentor: 8-Modulda `View` va `Text` bilan tanishgansiz — avval kodda bo'lakni tanlang, so'ng uning React Native juftini bosing.
- Chap — telefon (**brauzer** holati, O'yinlar ekrani); ramka ustida yorliq «prototip · React».
- O'ng — kod kartasi `OyinKarta` (prototip, React; 4 bo'lak navbat bilan halqada):
  ```jsx
  <div className="oyinlar">
    <div className="karta" onClick={ochish}>
      <p>Shanba, 18:00</p>
    </div>
  </div>
  ```
  ostida to'rt tugma (React Native): `View` · `Pressable` · `Text` · `StyleSheet`. Hisoblagich: «Almashdi: 0 / 4».
  Bo'laklar: 1) ro'yxat qutisi `<div className="oyinlar">` 2) bosiladigan karta `<div … onClick>` 3) matn `<p>` 4) ko'rinish `className="…"`.
- **Harakat → Vizual o'zgarish:** bo'lakni tanlash → bo'lak ajraladi; React Native tugmasini bosish →
  - to'g'ri juftlik → kod qatori o'sha zahoti React Native yozuviga almashadi (eski so'z o'chib, yangisi suriladi): `<View style={s.oyinlar}>` · `<Pressable style={s.karta} onPress={ochish}>` · `<Text>` · `style={s.…}` + pastda `const s = StyleSheet.create({ … })`;
    telefonda o'sha qism ilova ko'rinishiga o'tadi (ro'yxat → karta → yozuv → ranglar), hisoblagich oshadi;
  - boshqa tugma → tugma silkinadi, bir qator (`QXato`, ≤60):
    - `View` matnga: «`View` — quti: matn uchun boshqa komponent kerak.»
    - `Text` qutiga: «`Text` faqat matnni o'raydi — bu yerda quti kerak.»
    - `Pressable` ro'yxatga: «Ro'yxat qutisi bosilmaydi — bosiladigani karta.»
    - `StyleSheet` tegga: «`StyleSheet` ko'rinish beradi — u teg o'rnida turmaydi.»
  4/4 da telefon ramkasidagi brauzer manzil qatori yo'qoladi, yorliq «prototip · React» → «Expo Go · React Native»; kod kartasi:
  ```tsx
  <View style={s.oyinlar}>
    <Pressable style={s.karta} onPress={ochish}>
      <Text>Shanba, 18:00</Text>
    </Pressable>
  </View>
  ```
- Xulosa: Bu misolda karta o'sha, faqat komponentlari `View`, `Pressable` va `Text`, ko'rinishi — `StyleSheet` da. (96)
- Tugadi (199): tugmalar paneli yopiladi, telefon va kod butun enga; vizual ⛶ ichida (q17). Tugma (pastki): Juftlarni toping (N/4) → Davom etish
✎ `onClick` → `onPress` 2-juftlik ichida (8-Modul `m6-10`: «onPress — bosilganda ishlaydi (web'dagi onClick)»). `Pressable` — 8-Modul `m6-09` 12-ekranda o'tilgan.

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **Bu karta telefonda xato beradi. Nimani tuzatasiz?** (7 so'z) — savol ustida kod bo'lagi:
  ```tsx
  <View style={s.karta}>
    Shanba, 18:00
  </View>
  ```
  - `View` ni `div` bilan almashtiraman
  - ✔ Matnni `<Text>` ichiga olaman
  - `style` ni `className` qilaman
  - Matnni `<p>` ichiga olaman
- Kalit: **B** (index 1). B va D bir shaklda («Matnni … ichiga olaman»), A va C — almashtirish; uzunlik — o'lchov pastda (GATE M).
- To'g'ri izohi: React Native'da matn `<Text>` ichida turadi — `View` faqat quti. (60)
- Xato izohlari (≤60):
  - A: `div` — web tegi: telefondagi ilovada u yo'q. (43)
  - C: `className` — web'niki; React Native'da ko'rinish `style` da. (57)
  - D: `<p>` ham web tegi — React Native uni tanimaydi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Ekranlar fayllarda  ← QTushuncha (fayl → ekran)
- Eyebrow: Tushuncha · navigatsiya
- Sarlavha: **Ilovaning har ekrani qaysi faylda turadi?** (41)
- Mentor (bosqichga qarab):
  - boshida: `src/app/` papkasidagi fayllarni birma-bir bosing — telefonda qaysi ekran ochilishini ko'rasiz.
  - 4/4 dan keyin (tayanch 1.6, so'zma-so'z): 8-Modulda Stack Navigator bilan ekrandan ekranga o'tgansiz — Expo Router'da ham Stack bor, faqat har ekran — alohida fayl.
- Chap — telefon (**expo** holati), boshida ekran bo'sh (sokin skelet).
- O'ng — fayl daraxti (har qator bosiladi, navbat bilan halqada; ostida kichik izoh: «`.tsx` — TypeScript'dagi React fayli: kodni agent yozadi, siz o'qiysiz»):
  ```
  mobil/
    src/app/
      index.tsx
      elon.tsx
      oyin/
        [id].tsx
      _layout.tsx
  ```
  Hisoblagich: «Ochildi: 0 / 4».
- **Harakat → Vizual o'zgarish:**
  - `index.tsx` → telefonda O'yinlar ekrani chiziladi (4 karta); fayl qatori ✓, yonida kulrang manzil `/`;
  - `elon.tsx` → E'lon berish ekrani O'yinlar ustiga o'ngdan suriladi; yonida `/elon`;
  - `oyin/[id].tsx` → O'yin ekrani (Shanba, 18:00) ustiga suriladi; yonida `/oyin/1`;
  - `_layout.tsx` → yonida kod pufagi `<Stack />`; telefon yonida uch ekran bir lahza ustma-ust, sal qiya ko'rinadi (O'yinlar pastda), keyin «‹ O'yinlar» bosilgandek ustki ekran chapga chiqib ketadi.
- Nom qatori (4/4 dan keyin, bitta): Ekranlarni fayllar bilan tuzadigan bu navigatsiya Expo Router deyiladi: bu misolda har ekran o'z faylida. (105) · `_layout.tsx` qatorida kulrang yorliq «ekran emas — ularni bog'laydi» (uch ekran fayli + bitta bog'lovchi fayl, 09-FILTR 2)
- Xulosa: Bu misolda uch ekran — uch fayl; `_layout.tsx` ularni Stack qilib ustma-ust qo'yadi. (82)
- Tugadi (199): daraxt va telefon butun enga, manzillar ko'rinib turadi; vizual ⛶ ichida. Tugma (pastki): Fayllarni oching (N/4) → Davom etish
✎ Daraxtda shablondagi `explore.tsx` yo'q — Mentor misolida u olib tashlangan (A1 talabi). `_layout.tsx` oxirida turadi: avval ekranlar, keyin ularni birlashtiruvchi Stack.

## 5 · Bitta fayl, to'rt o'yin  ← QTushuncha (bashorat + harakat)
- Eyebrow: Tushuncha · `[id]`
- Sarlavha: **To'rt o'yin uchun nechta O'yin fayli kerak?** (43)
- Mentor: Avval javobni belgilang, keyin O'yinlar ekranidagi to'rt kartani birma-bir bosing.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator bo'lib natijagacha turadi — SABOQ 11): «1 ta» · «2 ta» · «4 ta»
- Chap — telefon (**expo**, O'yinlar: 4 karta, birinchisi halqada; bashorat tanlanmaguncha xira).
- O'ng — ikki kod kartasi ustma-ust (o'qiladi, ishga tushirilmaydi):
  `src/app/index.tsx`
  ```tsx
  const router = useRouter();
  <Pressable onPress={() => router.push(`/oyin/${o.id}`)}>
    <Text>{o.kun}, {o.soat}</Text>
  </Pressable>
  ```
  `src/app/oyin/[id].tsx`
  ```tsx
  const { id } = useLocalSearchParams();
  const oyin = oyinlar.find((o) => o.id === id);
  ```
  Kartalar orasida manzil yorlig'i: `/oyin/…` (bo'sh).
- **Harakat → Vizual o'zgarish:** kartani bosish → `router.push` qatori yonadi, manzil yorlig'ida `/oyin/2` paydo bo'ladi → `oyin/[id].tsx` yorlig'i yonadi (har safar o'sha bitta fayl) →
  ikkinchi kartada `id` yonida kulrang `= '2'` → telefonda O'yin ekrani o'sha o'yin bilan suriladi (Shanba, 20:00 · Maktab maydoni · 6 / 10) → «‹ O'yinlar» → qaytadi, keyingi karta halqada.
  Hisoblagich «Ochildi: N / 4». 4/4 da to'rt manzil yorlig'i (`/oyin/1` … `/oyin/4`) bitta fayl yorlig'iga chiziq bilan ulanadi.
- Natija qatori (xulosaning birinchi qatori, SABOQ 25): «Taxminingiz: … · haqiqatda: 1 ta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda to'rt o'yin bitta `oyin/[id].tsx` faylidan ochiladi: `router.push` manzilga o'yin raqamini qo'yadi. (106)
- Tugadi (199) · Tugma (pastki): To'rt o'yinni oching (N/4) → Davom etish
✎ `[id]` ning ma'nosi alohida ta'riflanmaydi — harakat ko'rsatadi (P-036). `o.id === id` — `id` lar satr (`'1'`…`'4'`), TAYANCHGA SAVOL 7.

## 6 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Ilovaga «Kirish» ekrani kerak. Expo Router'da nima qilasiz?** (8 so'z)
  - `_layout.tsx` fayliga ekran kodini yozaman
  - `index.tsx` faylining oxiriga qo'shaman
  - `App.js` da yangi Stack ekranini e'lon qilaman
  - ✔ `src/app/` da `kirish.tsx` faylini ochaman
- Kalit: **D** (index 3). «fayl» so'zi uch variantda (kalit so'z faqat to'g'rida emas); C — 8-Moduldagi Stack Navigator yo'li (ishonarli, lekin bugungi qoida bo'yicha emas — S-004).
- To'g'ri izohi: Expo Router'da ekran fayli o'z manzilida ochiladi: `kirish.tsx` — `/kirish`. (76)
- Xato izohlari (≤60):
  - A: `_layout.tsx` ekranlarni Stack qiladi — o'zi ekran emas. (54)
  - B: `index.tsx` — bitta ekran: O'yinlar ro'yxati. (43)
  - C: Bu — 8-Moduldagi yo'l; Expo Router boshqacha ishlaydi. (54)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 7 · Telefon kompyuterni qanday topadi?  ← QTushuncha (uch holat, ketma-ket)
- Eyebrow: Tushuncha · Expo Go
- Sarlavha: **Telefon kompyuterdagi ilovani qanday topadi?** (44)
- Mentor (holatga qarab, SABOQ 8):
  - 1-holat: Telefon va kompyuter bitta Wi-Fi'da — telefonda «QR'ni skanerlash»ni bosing.
  - 2-holat: Endi ikkalasi maktab Wi-Fi'ida, lekin QR ochilmadi — yechimni tanlang.
  - 3-holat: Endi telefon iPhone, Expo Go esa akkaunt so'radi — yechimni tanlang.
- Chap — telefon (**expo**; ramka ustida yorliq «Android» yoki «iPhone» — holatga qarab), boshida Expo Go'ning bo'sh oynasi.
- O'ng — kompyuter terminali: `$ npx expo start` va ostida QR; terminal bilan telefon orasida tarmoq chizig'i va chizilgan Wi-Fi belgisi. Holat qatori: «1-holat · bitta Wi-Fi» → «2-holat · maktab Wi-Fi'i» → «3-holat · iPhone».
  Hisoblagich: «Ulandi: 0 / 3».
- **Harakat → Vizual o'zgarish:**
  - 1: «QR'ni skanerlash» → telefon kamerasi ramkasi QR ustiga tushadi → so'rov konverti telefon → Wi-Fi → kompyuter yo'lidan o'tib qaytadi → telefonda «Maydon Jamoa» O'yinlar ochiladi; holat yorlig'i «Ulandi ✓».
  - 2: «QR'ni skanerlash» → konvert Wi-Fi belgisida to'xtaydi (qizil uzuq chiziq), telefonda kulrang «ulanmadi»; ikki yechim tugmasi: «Kompyuterni qayta yoqish» · «`npx expo start --tunnel`».
    Tunnel → terminal qatori `$ npx expo start --tunnel` ga almashadi, yangi QR chiziladi, konvert chizilgan bulut (internet) orqali aylanib o'tadi → ulandi; holat yorlig'ida «Ulandi ✓ · sekinroq».
    Boshqa tugma → silkinadi, `QXato`: «Kompyuter joyida — umumiy tarmoq ulanishni to'sib qo'ydi.»
  - 3: «QR'ni skanerlash» → Expo Go oynasining o'ng yuqorisidagi akkaunt belgisi qizil yonadi; ikki yechim tugmasi: «Expo Go'ni qayta o'rnatish» · «Ikkalasida bitta Expo akkaunti».
    To'g'ri → terminalda `$ npx expo login` qatori, telefondagi akkaunt belgisi yashil → ulandi.
    Boshqa tugma → silkinadi, `QXato`: «Ilova joyida — u kompyuter bilan bitta akkaunt kutadi.»
- Nom qatori (2-holatdan keyin, bitta): Tunnel — telefon kompyuterga internet orqali ulanadigan yo'l: sekinroq, lekin umumiy tarmoqda yordam berishi mumkin.
- Xulosa: Bu darsda QR odatda bitta Wi-Fi'da ochiladi; ochilmasa — `--tunnel`, iPhone'da — bitta Expo akkaunti. (101)
- Tugadi (199) · Tugma (pastki): Uch holatni tekshiring (N/3) → Davom etish
- O'qituvchi eslatmasi: tunnel uchun kompyuterda avval `npm i -g @expo/ngrok` (tayanch 6). Tunnel sekinroq — maktab tarmog'i QR'ni o'tkazsa, oddiy `npx expo start` yaxshiroq.
✎ 2-holat — rasmiy hujjatdagi holat («router configuration — common for public networks»). Telefon kompyuterni tarmoqdagi manzili orqali topishi (QR ichida) — umumiy bilim (Shubhali 4); matnda faqat «bitta Wi-Fi» sharti.

## 8 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **Telefonni Wi-Fi'ga ulab bo'lmaydi, u mobil internetda. QR'ni qanday ochasiz?** (11 so'z) — 7-ekran holatining nusxasi emas: o'sha qoida, boshqa vaziyat
  - ✔ `npx expo start --tunnel` bilan qayta ochaman
  - Expo Go'ni o'chirib, qaytadan o'rnataman
  - Loyihani boshqa nom bilan qayta yarataman
  - QR'ni kompyuter kamerasi bilan skanerlayman
- Kalit: **A** (index 0). To'rttalasi «… -aman» harakat shaklida; «qayta» ikki variantda.
- To'g'ri izohi: Tunnel telefonni kompyuterga internet orqali ulaydi — bitta Wi-Fi shart emas. (77)
- Xato izohlari (≤60):
  - B: Expo Go joyida: telefon kompyuterga yetib bormayapti. (53)
  - C: Loyiha nomi ulanishga ta'sir qilmaydi. (38)
  - D: QR'ni telefon skanerlaydi, kompyuter uni faqat ko'rsatadi. (58)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 9 · Telefon kengligida  ← QTushuncha (bashorat + kenglik)
- Eyebrow: Tushuncha · web-trek
- Sarlavha: **Telefon kengligida o'yin kartalari qanday turadi?** (49)
- Mentor (bosqichga qarab):
  - boshida: Web-trekda prototip telefon brauzerida ochiladi — avval javobni belgilang, keyin surgich bilan sahifani telefon kengligigacha toraytiring.
  - toraytirgandan keyin: Endi «Telefon uchun qoida» kalitini yoqing.
- Bashorat (ballsiz; «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): «Yonma-yon qisilib qoladi» · «O'zi ustma-ust tushadi»
- Chap — brauzer oynasi `localhost:5173` (prototip, O'yinlar): 4 ta o'yin kartasi bir qatorda yonma-yon; ostida surgich «Kenglik: 1200 px» (halqada, bashoratdan keyin faol).
- O'ng — `style.css` kartasi:
  ```css
  .oyinlar { display: flex; gap: 12px; }
  ```
- **Harakat → Vizual o'zgarish:**
  - surgich chapga → brauzer oynasi torayadi, yorliq «… px» o'zgaradi; 600 px dan pastda kartalar yonma-yon qisiladi: «Mahalla maydoni» ikki qatorga uziladi, «8 / 10» karta chetiga yopishadi; yorliq «390 px · telefon»;
  - «Telefon uchun qoida» kaliti (halqada) → `style.css` kartasiga yangi blok suriladi va bir lahza yonadi:
    ```css
    @media (max-width: 600px) {
      .oyinlar { flex-direction: column; }
    }
    ```
    → kartalar bitta ustunga tushadi, har biri to'liq enida, yozuvlar bir qatorda; surgich yana o'ngga surilsa (ixtiyoriy) — 600 px dan yuqorida kartalar yana yonma-yon.
- Natija qatori: «Taxminingiz: … · haqiqatda: yonma-yon qisiladi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Nom qatori (kalitdan keyin, bitta): Telefon kengligiga moslashadigan sayt adaptiv sayt deyiladi.
- Xulosa: Bu misolda `@media` oyna kengligini so'raydi: 600 px dan tor oynada kartalar ustma-ust turadi. (92)
- Tugadi (199) · Tugma (pastki): Toraytiring va qoidani yoqing (N/2) → Davom etish

## 10 · Telefonda ustma-ust  ← QKod
- Eyebrow: Kod yozish · adaptiv sayt
- Sarlavha: **Telefonda kartalarni ustma-ust qo'yadigan kod yozamiz.** (54) — §19 sarlavha oilasi
- Mentor: 9-Modulda `@media` bilan harakatni o'chirgansiz, bugun u oyna kengligini so'raydi — kodni o'zingiz terib yozasiz, nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. Faylning oxiriga yozing: `@media (max-width: 600px) { }`
  2. Qavslar ichiga: `.oyinlar { flex-direction: column; }`
  3. Natija oynasida «Telefon» kengligini tanlang — kartalar ustma-ust tursin.
- Yordam: Kartalar o'zgarmasa, `max-width` dan keyin ikki nuqta borligini va `.oyinlar` qoidasi `@media` qavslari ichida turganini tekshiring.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi.
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <div class="oyinlar">
      <div class="karta">Shanba, 18:00 · Mahalla maydoni · 8 / 10</div>
      <div class="karta">Shanba, 20:00 · Maktab maydoni · 6 / 10</div>
      <div class="karta">Yakshanba, 10:00 · Park maydoni · 4 / 8</div>
      <div class="karta">Yakshanba, 17:00 · Mahalla maydoni · 9 / 10</div>
    </div>
    ```
  - `style.css` — o'quvchi yozadi (boshlang'ich holat):
    ```css
    .oyinlar {
      display: flex;
      gap: 12px;
    }
    .karta {
      flex: 1;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 12px;
    }
    /* telefon uchun qoida shu yerga */
    ```
  - Natija oynasi ustida ikki tugma: «Kompyuter» (900 px) · «Telefon» (390 px) — KOD 12.
- Kod oynasi sarlavhasi: `style.css — telefonda kartalar ustma-ust`
- Shart xabarlari (≤60):
  - 1 — `@media` da `max-width` va px bilan kenglik bo'lsin.
  - 2 — `@media` ichida `.oyinlar` ga `flex-direction: column` bo'lsin.
- **Harakat → Vizual o'zgarish:** o'quvchi yozadi → natija oynasida to'rt karta; har shart bajarilganda ✓; «Telefon» → kartalar ustma-ust, «Kompyuter» → yonma-yon. «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Bitta `@media` qoidasi bilan o'sha sahifa telefonda ustma-ust, kompyuterda yonma-yon turadi. (90)

## 11 · Bosh ekranga qo'shish  ← QTushuncha (to'rt maydon + HTTPS, ketma-ket)
- Eyebrow: Tushuncha · PWA
- Sarlavha: **Sayt telefonning bosh ekraniga qanday qo'shiladi?** (49)
- Mentor (bosqichga qarab):
  - boshida: Chrome saytni o'rnatishni taklif qilishi uchun sayt o'zi haqida kichik fayl beradi — uning maydonlarini birma-bir qo'shing.
  - 4/4 dan keyin: Endi «Netlify'ga chiqarish»ni bosing — telefon saytni HTTPS manzilda ochadi.
- Chap — telefon (**pwa** holati): bosh ekran, kulrang ikonka kataklari, bitta bo'sh joy uzuq chiziqda.
- O'ng — fayl kartasi `manifest.webmanifest` (sarlavha ostida kulrang: «sayt o'zi haqida yozgan fayl»), ichi bo'sh; to'rt maydon bittadan chiqadi, joriysi halqada, har birida «Qo'shish»:
  1. `"name": "Maydon Jamoa"` 2. `"icons": [192 px, 512 px]` 3. `"start_url": "/"` 4. `"display": "standalone"` · 5-shart — tugma «Netlify'ga chiqarish».
  Hisoblagich: «Shart: 0 / 5».
- **Harakat → Vizual o'zgarish:**
  - `name` → bo'sh joy ostida «Maydon Jamoa» yozuvi (o'z rangida);
  - `icons` → bo'sh joyda ikonka chiziladi (accent rangli kvadrat), yonida kichik yorliqlar «192» · «512»;
  - `start_url` → ikonka yonida kichik ko'rinish: ochiladigan sahifa — O'yinlar;
  - `display` → o'sha kichik ko'rinishdan manzil qatori yo'qoladi — sahifa ilova kabi;
  - «Netlify'ga chiqarish» → telefon tepasida manzil `https://maydon-jamoa-….netlify.app` va qulf belgisi → ikonka bosh ekrandagi joyiga tushadi → bir lahzadan keyin ikonka bosiladi va O'yinlar manzil qatorisiz ochiladi.
  Joriy bo'lmagan maydonlar xira; tartib — ketma-ket (SABOQ 13).
- Nom qatori (5/5 dan keyin, bitta): Bosh ekranga ilova kabi qo'shiladigan sayt PWA (Progressive Web App) deyiladi.
- Xulosa: Bu misolda manifestdagi to'rt maydon va HTTPS manzil saytni telefonga o'rnatiladigan qildi. (91)
- Tugadi (199) · Tugma (pastki): Shartlarni qo'shing (N/5) → Davom etish
- O'qituvchi eslatmasi: Chrome o'rnatishni sahifa kamida bir marta bosilgan va yarim daqiqa ko'rilgandan keyin taklif qiladi (web.dev). Bu darsda offline ishlash va'da qilinmaydi — service worker yo'q.
✎ «Telefon `localhost` ni ocholmaydi» (hook) — shuning uchun HTTPS sharti Netlify bilan ko'rsatiladi. Logotip chizilmaydi: ikonka — harfsiz rangli kvadrat.

## 12 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **Bugungi web-trekda saytni bosh ekranga qo'shish uchun nima tayyorlaysiz?** (10 so'z; brauzerlar shartlari farq qiladi — umumiy qoida emas, 09-FILTR 4)
  - Sayt kompyuterdagi `localhost:5173` da ishlab tursin
  - Telefonga Expo Go ilovasi o'rnatilgan bo'lsin
  - ✔ Sayt manifesti bilan HTTPS manzilda tursin
  - Sayt Play Market'ga ilova bo'lib yuklansin
- Kalit: **C** (index 2). «Sayt … tursin» shakli A va C da; «ilova» B va D da.
- To'g'ri izohi: Bugun manifest va HTTPS manzil tayyorlanadi — telefon saytni bosh ekranga shundan qo'shadi. (91)
- Xato izohlari (≤60):
  - A: `localhost` — telefonning o'zi: sayt u yerda yo'q. (48)
  - B: Expo Go — React Native ilovasi uchun, sayt uchun emas. (54)
  - D: PWA do'kondan emas, brauzerdan qo'shiladi. (42)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 13 · Telefonga yo'l (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Prototipni telefonga qaysi tartibda olib borasiz?** (49)
- Mentor: Mobil trekdagi bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda, `TELEFON_YOLI` — A1 qadamlari bilan bitta manba): Expo loyihasini yaratish · QR'ni telefonda Expo Go bilan ochish · Ekranlarni `src/app/` fayllariga ko'chirish · Uch ekranni telefonda bosib tekshirish
- Uyalar: 4 ta, har birida «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib xato — bo'lakni bosib qaytaring.
- Xulosa (yechilgach, bir marta): Avval loyiha va ulanish, keyin ekranlar: telefonda shablon ochilsa, ulanish joyida ekanini bilasiz. (99)
✎ 2 va 3-bo'lak tartibi darsning o'z yo'li (A1: shablon telefonda ochiladi → keyin ekranlar ko'chadi); sababi xulosada va 5-takrorlash oynasida aytiladi (S-008).

## 14 · Amaliyot 1 — prototip telefonda  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈25 daq; ikki trek)
- Eyebrow: Amaliyot 1 · o'z trekingiz
- Sarlavha (trekka qarab):
  - mobil: **Prototip ekranlarini Expo ilovasiga ko'chiring.** (47)
  - web: **Prototipingizni telefon kengligiga moslang.** (43)
- Mentor: Hamma qadamni o'z trekingizda, o'z mahsulotingiz bilan qilasiz; Maydon Jamoa — namuna. «1 · Ochish»dan boshlang.
- Trek: blok tepasida ikki tugma «Mobil trek» · «Web-trek» — `pm-m9d8-platforma.trek` bo'yicha tanlangan; saqlanmagan bo'lsa ikkalasi bo'sh va halqada (o'quvchi bittasini bosadi; tanlov `pm-m9d8-platforma.trek` ga yoziladi — yagona manba, 10–14-darslar shuni o'qiydi; 09-FILTR 30).
- Model (tayanch 4, 9.12): 4 qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da to'liq talab). 5-qadam yo'q.
  Talab zinapoyasi: tayyor talab + 2 joy (joylar 7-darsdagi wireframe yozuvidan oldindan yoziladi, tahrirlanadi).
- **Mobil trek** — qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — telefoningizda Expo Go bo'lsin (iPhone'da — Expo akkauntingizga kirilgan). Antigravity'da o'z repo'ngizni oching, terminalda repo papkasida:
     `npx create-expo-app@latest mobil` (terminal «Skip initializing a new git repository?» deb so'rasa — Enter: yangi git ochilmaydi, `mobil/` repo'ingiz ichida qoladi), keyin `cd mobil` va `npx expo start`. Terminaldagi QR'ni skanerlang: Android'da — Expo Go'dagi «Scan QR code» bilan, iPhone'da — standart kamera ilovasi bilan.
     Telefonda shablon ilovasi ochiladi. Ochilmasa: telefon va kompyuter bitta Wi-Fi'dami? Bitta bo'lsa ham ochilmasa — tunnel bilan urinib ko'ring: `npm i -g @expo/ngrok`, keyin `npx expo start --tunnel`.
     iPhone'da akkaunt so'rasa — kompyuterda `npx expo login`, Expo Go'da o'ng yuqoridagi akkaunt belgisi orqali o'sha akkauntga kiring.
  2. **Prompt** — qavslar 7-darsdagi wireframe yozuvingizdan to'ldirilgan; tekshiring, bo'sh qavsni yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     (`pm-m9d7-wireframe` yo'q bo'lsa:) qavslarga o'z ekranlaringizni yozing (7-darsdagi qog'oz chizmangizdan), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     ✎ F-1006-281: kalit yo'q holatda birinchi gap yolg'on edi; «06.10 da sinab ko'rilgan» va «support.apple.com, 06.10» o'quvchi matnidan olindi (manba — 10-band); arena 9 ✔ — backtiksiz (lint-tell)
     > Qayerda: `mobil/` — Expo Router, ekranlar `src/app/` da. `prototip/` ni faqat o'qi.
     > Nima qilsin: `prototip/` dagi ekranlarni React Native'ga ko'chir: {ekranlar va ularning fayllari}. `src/app/_layout.tsx` da `<Stack />` bo'lsin; shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin.
     > Ma'lumot `prototip/src/namuna.js` dagidek, `mobil/` ichida. Bosish yo'llari prototipdagidek: {qaysi tugma qaysi ekranni ochadi}.
     > Nima buzilmasin: `prototip/` o'zgarmasin; haqiqiy ma'lumot va Backend yo'q. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ekranlar va ularning fayllari} — «masalan: O'yinlar — `index.tsx`, O'yin — `oyin/[id].tsx`, E'lon berish — `elon.tsx`»
     - {qaysi tugma qaysi ekranni ochadi} — «masalan: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `mobil/` — Expo Router, ekranlar `src/app/` da. `prototip/` ni faqat o'qi.
     > Nima qilsin: `prototip/` dagi ekranlarni React Native'ga ko'chir: O'yinlar — `src/app/index.tsx`, O'yin — `src/app/oyin/[id].tsx`, E'lon berish — `src/app/elon.tsx`.
     > `src/app/_layout.tsx` da `<Stack />` bo'lsin; shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin.
     > Ma'lumot `prototip/src/namuna.js` dagidek (4 ta o'yin, har biriga `id`), `mobil/` ichida. Bosish yo'llari prototipdagidek: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar; «Qo'shilaman» sonni bittaga oshirsin.
     > Nima buzilmasin: `prototip/` o'zgarmasin; haqiqiy ma'lumot va Backend yo'q. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — `npx expo start` ishlab tursa, saqlangan o'zgarish telefonda o'zi ko'rinadi; ko'rinmasa — terminalda `r` ni bosing. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     qayerda — ekranlaringiz `mobil/src/app/` da, `git status` da `prototip/` o'zgarmagan · nima qilsin — ekranlar prototipdagidek, har tugma kerakli ekranni ochadi, «‹» orqaga qaytaradi ·
     nima buzilmasin — Backend yo'q: terminalda `r` bosilsa, namuna boshidan ochiladi. Farq bo'lsa, agentga: «{nima} prototipdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- **Web-trek** — qadamlar:
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching, terminalda `cd prototip` va `npm run dev`. Chrome'da terminal ko'rsatgan manzilni oching va telefon ko'rinishini yoqing:
     F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M). Qaysi ekranda nima qisilib qolganini ko'ring.
  2. **Prompt** — qavslarni tekshiring (birinchisi wireframe yozuvingizdan), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `prototip/` — CSS fayllari.
     > Nima qilsin: {ekranlar} telefon kengligiga moslashsin: 600 px dan tor oynada {ustma-ust turadigan qismlar} bitta ustunda, har biri to'liq enida tursin. Kompyuterda ko'rinish o'zgarmasin.
     > Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna: {ekranlar} — «masalan: O'yinlar, O'yin va E'lon berish ekranlari» · {ustma-ust turadigan qismlar} — «masalan: O'yinlar ekranidagi o'yin kartalari».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab: o'sha talab, qavslar o'rnida «O'yinlar, O'yin va E'lon berish ekranlari» va «O'yinlar ekranidagi o'yin kartalari».
  3. **Ishga tushirish** — sahifa o'zi yangilanadi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefon ko'rinishida (390 px) va oddiy oynada: qayerda — o'zgarish faqat `prototip/` da · nima qilsin — telefon kengligida kartalar bitta ustunda, yozuvlar uzilmagan; kompyuterda — avvalgidek ·
     nima buzilmasin — har tugma kerakli ekranni ochadi, animatsiyalar ishlaydi. Farq bo'lsa, agentga: «{nima} telefon kengligida {qanday}: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (o'quvchi o'zinikini shunga solishtiradi):
  - mobil: telefon (**expo**, uch ekran navbat bilan o'zi almashadi): O'yinlar (4 o'yin, «E'lon berish») → O'yin (Shanba, 18:00 · Mahalla maydoni · 8 / 10 · qo'shilganlar · «Qo'shilaman») → E'lon berish (forma);
    ostida kichik daraxt: `mobil/src/app/` › `_layout.tsx` · `index.tsx` · `elon.tsx` · `oyin/[id].tsx`.
  - web: ikki kenglikdagi brauzer oynasi `localhost:5173` — kompyuter (kartalar yonma-yon) va telefon 390 px (kartalar ustma-ust).
- Hammasi bajarilgach (yashil):
  - mobil: Prototip telefonda ilova bo'lib ochiladi: uch ekran — uch fayl, bosish yo'llari o'sha.
  - web: Prototip telefon kengligiga moslashdi: kartalar ustma-ust, kompyuterda — avvalgidek.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-09-done`;
  mobil trekda `cd mobil`, `npm install`, `npx expo start`; web-trekda `cd prototip`, `npm install`, `npm run dev`. Qanday ishlashini ko'rasiz va o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{ekranlar va ularning fayllari}` — `pm-m9d7-wireframe.ekranlar[].nom` dan oldindan yoziladi («O'yinlar — , O'yin — , …» — fayl nomlari bo'sh, o'quvchi yozadi); `{qaysi tugma qaysi ekranni ochadi}` — `ekranlar[].tugma` dan;
  web-trekda `{ekranlar}` — `ekranlar[].nom` dan. Yozuv saqlanmagan bo'lsa — qavslar bo'sh, faqat kulrang «masalan». A1 mobil tartibi — avval shablon telefonda ochiladi (ulanish), keyin ekranlar ko'chadi (13-ekran finali bilan bir manba).

## 15 · Amaliyot 2 — telefonda jonli  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq; ikki trek)
- Eyebrow: Amaliyot 2 · o'z trekingiz
- Sarlavha (trekka qarab):
  - mobil: **Telefondagi ilovangiz ham jonli bo'lsin.** (40)
  - web: **Saytingizni telefonga ilova kabi o'rnating.** (43)
- Mentor: Talab tayyor — bir-ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi: tayyor talab + 2 joy (tayanch 9.12).
- **Mobil trek** — qadamlar:
  1. **Ochish** — `npx expo start` ishlab tursin, ilova telefoningizda ochiq.
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `mobil/src/app/` — mavjud ekranlar.
     > Nima qilsin: {bosiladigan karta yoki tugma} bosilganda kichrayib qaytsin — 0,15 soniya. {o'zgaradigan son yoki yozuv} o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin. Ekrandan ekranga o'tish Stack'nikidek silliq qolsin.
     > Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; telefonda harakatni kamaytirish yoqilgan bo'lsa, kichrayish va kattalashish bo'lmasin. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna: {bosiladigan karta yoki tugma} — «masalan: o'yin kartasi» · {o'zgaradigan son yoki yozuv} — «masalan: «8 / 10» dagi son».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab: o'sha talab, qavslar o'rnida «o'yin kartasi» va ««8 / 10» dagi son». Ostida bir gap: «Motion — web uchun; ilovada animatsiyani agent React Native vositasi bilan yozadi.»
  3. **Ishga tushirish** — ilova telefonda o'zi yangilanadi; yangilanmasa — terminalda `r`. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatori: karta kichrayib qaytadimi · son kattalashib qaytadimi · ekranlar silliq almashadimi · ekranlar va bosish yo'llari o'sha-o'shami.
     Hammasi mos bo'lsa — GitHub'ga: repo papkasida `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil, `mobil/` fayllari ko'rinsin; `git add mobil`, `git commit -m "telefonda prototip"`, `git push`.
     `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»
- **Web-trek** — qadamlar:
  1. **Ochish** — `prototip/` ishlab tursin (`npm run dev`); app.netlify.com da akkauntingizga kiring (2-Modulda ochgansiz).
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `prototip/` — `public/manifest.webmanifest`, ikonkalar `public/` da, `index.html` da manifestga havola.
     > Nima qilsin: manifestda `name` va `short_name` — {mahsulot nomi}, `start_url` — `/`, `display` — `standalone`, `icons` — 192 va 512 piksel PNG ({ikonka rangi}, matnsiz oddiy shakl). Ikonka faylini yarata olmasang — bitta kvadrat rasmdan shu ikki o'lchamni qanday tayyorlashni menga ayt.
     > Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna: {mahsulot nomi} — «masalan: Maydon Jamoa» · {ikonka rangi} — «masalan: yashil».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab: o'sha talab, qavslar o'rnida «Maydon Jamoa» va «yashil».
  3. **Ishga tushirish** — GitHub'ga: `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil; `git add prototip`, `git commit -m "PWA"`, `git push`.
     Keyin app.netlify.com → yangi loyiha → GitHub'dan import → o'z repo'ngiz. Base directory `prototip`, build `npm run build`, publish `dist`. Havola chiqadi: `….netlify.app`; keyingi har push'da sayt o'zi yangilanadi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — telefonda `….netlify.app` ni oching.
     Android'da Chrome: manzil qatori o'ngidagi «⋮» → «Install and create shortcut» → «Install» (telefon tili boshqa bo'lsa — o'sha tildagi nomi). iPhone'da Safari: «Share» → «Add to Home Screen»; ro'yxatda bo'lmasa — pastdagi «Edit Actions» dan qo'shing (telefon tili boshqa bo'lsa — o'sha tildagi nomi).
     Bosh ekrandagi ikonkani bosing: sayt manzil qatorisiz ochiladi, har tugma kerakli ekranni ochadi.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»:
  - mobil: telefon (**expo**, jonli, o'zi aylanadi): karta bosiladi va kichrayib qaytadi → O'yin ekrani o'ngdan suriladi → «Qo'shilaman» → «8» → «9» kattalashib qaytadi → «‹» → ro'yxat.
    Ostida GitHub sahifasining kichik ko'rinishi: `maydon-jamoa` · `mobil/` papkasi.
  - web: telefon (**pwa**): manzil `maydon-jamoa-….netlify.app` (qulf) → bosh ekranda «Maydon Jamoa» ikonkasi → bosilsa O'yinlar manzil qatorisiz. Ostida fayl kartasi `prototip/public/manifest.webmanifest`:
    ```json
    { "name": "Maydon Jamoa", "short_name": "Maydon Jamoa", "start_url": "/", "display": "standalone",
      "icons": [{ "src": "/ikonka-192.png", "sizes": "192x192" }, { "src": "/ikonka-512.png", "sizes": "512x512" }] }
    ```
- Hammasi bajarilgach (yashil):
  - mobil: Ilova telefonda jonli: karta, son va ekranlar bosishga javob beradi; `mobil/` GitHub'da.
  - web: Sayt telefonda ilova kabi o'rnatildi: bosh ekrandan manzil qatorisiz ochiladi.
- Qator (`QIzoh`, natija ostida, faqat mobil trekda): Expo Go'da ilova kompyuteringizdan keladi: `npx expo start` to'xtasa, telefonda ham ochilmaydi.
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Nishon (bonus): Pocket Prototype — oxirgi «Bajardim»da (ikkala trekda).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: mobil trekda animatsiya talabi 7-dars A2 bilan bir (0,15 s, 0,3 s; harakat kamaytirilsa — yo'q); 10-dars A3 «animatsiyalar o'zgarmasin» deb shunga tayanadi (TAYANCHGA SAVOL 3).
  Web-trekda Netlify shu blokda ulanadi — PWA uchun HTTPS kerak; 10-dars A3 «push — Netlify o'zi yangilanadi» shunga tayanadi (TAYANCHGA SAVOL 5).

## 16 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Matn qayerda» · 6 — «2 — Yangi ekran» · 8 — «3 — Wi-Fi'siz QR» · 12 — «4 — PWA uchun nima kerak» · 13 — «Yakuniy — telefonga yo'l»

## 17 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi halqada.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 18 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Prototip telefonda · {N}/5 to'g'ri (A1/A2 holatiga qarab — 7-dars naqshi)
- Sarlavha (holatga qarab, P-046; 09-FILTR 34): A2 bajarilgan — **Prototipingiz endi o'z telefoningizda ochiladi.** (47) · A1 bajarilgan, A2 yo'q — **Prototip telefonda ochildi — oxirgi qadam uyda.** (47) ·
  A1 bajarilmagan — **Telefonga chiqarish boshlandi — qolgani uyda.** (45)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Mobil trekda prototip Expo ilovasiga ko'chadi — har ekran o'z faylida — va QR orqali Expo Go'da ochiladi; web-trekda u adaptiv sayt va PWA bo'lib, telefonning bosh ekraniga qo'shiladi.
- Endi siz bilasiz (5):
  - React Native'da quti `View` bilan, matn `Text` bilan, bosiladigan joy `Pressable` bilan yoziladi.
  - Expo Router'da ekranlar fayllar bilan tuziladi: bu misolda har ekran o'z faylida, `_layout.tsx` ularni Stack qiladi.
  - Bitta `oyin/[id].tsx` fayli har o'yinni manzildagi raqami bilan ochadi.
  - QR odatda bitta Wi-Fi'da ochiladi, ochilmasa `--tunnel` bilan urinib ko'rasiz; iPhone'da ikkalasida bitta Expo akkaunti kerak.
  - Adaptiv sayt telefon kengligiga moslashadi, PWA esa bosh ekranga ilova kabi qo'shiladi.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z mahsulotingiz · muddat — keyingi darsgacha):
  1. **Tugatish** — darsda ulgurmagan qadamlarni o'z trekingizda bajaring: prototip telefoningizda ochilsin.
  2. **Tekshirish** — telefonda bosib chiqing: wireframe'dagi har tugma kerakli ekranni ochadimi? Farq bo'lsa — agentga bitta tuzatish talabi.
  3. **GitHub** — o'zgarishlar GitHub'da tursin: mobil trekda `mobil/`, web-trekda `prototip/` va `README.md` da Netlify havolasi.
- Keyingi dars — «Loyiha kuni: poydevor — Database, kirish, deploy»: prototip telefonda ochiladi, endi uning ortidagi umumiy Database va kirish navbati.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Native Card** — matn `<Text>` ichida turishini topdingiz (3-ekran, 1-savol)
- **File Router** — yangi ekran uchun yangi fayl ochishni bildingiz (6-ekran, 2-savol)
- **Tunnel Fix** — Wi-Fi'siz QR'ni tunnel bilan ochishni bildingiz (8-ekran, 3-savol)
- **Pocket Prototype** — ikkala amaliyot blokini oxirigacha bajardingiz (15-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Matn — `Text` ichida»
   - Quti — `View` · `<View style={s.karta}>`
   - Matn — `Text` · `<Text>Shanba, 18:00</Text>`
   - Bosiladigan joy — `Pressable` · `<Pressable onPress={ochish}>`
   - Sinfga savol: `View` ichiga to'g'ridan matn yozilsa, telefonda nima bo'ladi?
2. 2-savol (6-ekran) — «Ekran fayli va manzil»
   - O'yinlar — `src/app/index.tsx` · manzil `/`
   - E'lon berish — `src/app/elon.tsx` · manzil `/elon`
   - Ekranlar Stack'da — `src/app/_layout.tsx` · `<Stack />`
   - Sinfga savol: «Kirish» ekrani qaysi manzilda ochiladi?
3. 3-savol (8-ekran) — «QR ochilmasa»
   - Bitta Wi-Fi — telefon kompyuterni tarmoqda topadi · `npx expo start`
   - Bitta tarmoq yo'q yoki u to'sadi — internet orqali · `npx expo start --tunnel`
   - iPhone — ikkalasida bitta Expo akkaunti · `npx expo login`
   - Sinfga savol: Tunnel bilan ilova nega sekinroq yangilanadi?
4. 4-savol (12-ekran) — «PWA uchun nima kerak»
   - Manifest — nom, ikonkalar, ochiladigan sahifa · `"start_url": "/"`
   - Ilova kabi ochilish · `"display": "standalone"`
   - HTTPS manzil — Netlify'da o'zi bor · `….netlify.app`
   - Sinfga savol: Nega telefon `localhost` dagi saytni o'rnata olmaydi?
5. Final (13-ekran) — «Telefonga yo'l»
   - 1 · Expo loyihasini yaratish · 2 · QR'ni telefonda Expo Go bilan ochish
   - 3 · Ekranlarni `src/app/` fayllariga ko'chirish
   - 4 · Uch ekranni telefonda bosib tekshirish
   - Sinfga savol: Nega ulanish ekranlarni ko'chirishdan oldin tekshiriladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| React Native'da ekrandagi matn qayerda turadi? | `<Text>` ichida | `View` — faqat quti |
| Prototipdagi bosiladigan `div` React Native'da nima bo'ladi? | `Pressable` | `onClick` o'rniga — `onPress` |
| Expo Router nima? | Expo'ning navigatsiyasi: ekranlar fayllar bilan tuziladi | Bu misolda har ekran o'z faylida, `src/app/` da |
| `_layout.tsx` dagi `<Stack />` nima qiladi? | Ekranlarni ustma-ust qo'yadi | «‹» ustki ekranni olib tashlaydi |
| To'rt o'yin uchun nechta O'yin fayli kerak? | Bitta — `oyin/[id].tsx` | `id` manzildan keladi: `/oyin/2` |
| Boshqa ekranga qaysi qator o'tkazadi? | `router.push('/elon')` | `router` — `useRouter()` dan |
| QR ochilishi uchun telefon va kompyuter qayerda bo'ladi? | Bitta Wi-Fi'da | Ochilmasa — `npx expo start --tunnel` |
| iPhone'da Expo Go loyihani ochishi uchun nima kerak? | Kompyuterda va Expo Go'da bitta Expo akkaunti | Kompyuterda — `npx expo login` |
| Expo Go'dagi ilova kodi qayerdan keladi? | Kompyuterdagi `npx expo start` dan | U to'xtasa, ilova ham ochilmaydi |
| Adaptiv sayt nima? | Telefon kengligiga moslashadigan sayt | Bu darsda 600 px dan tor oynada bitta ustun |
| PWA nima? | Telefonning bosh ekraniga ilova kabi qo'shiladigan sayt | Do'kondan emas, brauzerdan qo'shiladi |
| Sayt telefonda manzil qatorisiz ochilishi uchun manifestda nima yoziladi? | `"display": "standalone"` | Yana kerak: nom, ikonkalar, `start_url` |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. React Native'da ekrandagi matn qayerga yoziladi? ✔ `<Text>` ichiga · `<View>` ichiga · `<div>` ichiga · `<span>` ichiga
2. Prototipdagi `onClick` React Native'da nimaga almashadi? `onChange` · ✔ `onPress` · `onSubmit` · `onInput`
3. Ilova `/oyin/3` manzilini ochdi. Qaysi fayl ishlaydi? `src/app/oyin/index.tsx` · `src/app/oyin/3.tsx` · ✔ `src/app/oyin/[id].tsx` · `src/app/oyinlar.tsx`
4. `_layout.tsx` dagi `<Stack />` nima qiladi? Ekranlarni pastdagi tablarga joylaydi · Har ekranga o'z rangi va shriftini beradi · `src/app/` da yangi fayllar yaratadi · ✔ Ekranlarni ustma-ust qo'yib boshqaradi
5. `router.push('/elon')` ishlaganda nima bo'ladi? ✔ E'lon berish ekrani ustiga ochiladi · Ilova butunlay boshidan qayta yuklanadi · `elon.tsx` fayli yangidan yaratiladi · O'yinlar ro'yxati qaytadan chiziladi
6. Telefonda QR ochilishi uchun odatda nima kerak? Telefonda Chrome brauzeri ochiq tursin · ✔ Telefon va kompyuter bitta Wi-Fi'da tursin · Kompyuterga ham Expo Go o'rnatilsin · Telefonda mobil internet ham yoqilgan bo'lsin
7. `--tunnel` bilan ulanish qanday ishlaydi? Faqat bitta Wi-Fi ichida, tezroq ulanadi · Faqat iPhone telefonlarida ulanadi · ✔ Internet orqali ulanadi, lekin sekinroq · Kompyutersiz, to'g'ridan telefonda ishlaydi
8. iPhone'da Expo Go akkaunt so'radi. Nima qilasiz? Expo Go ilovasini o'chirib, qayta o'rnataman · Loyihani boshqa nom bilan yarataman · QR'ni boshqa telefon bilan ochaman · ✔ Ikkalasida bitta Expo akkauntiga kiraman
9. Expo Go'dagi ilova kodi qayerdan keladi? ✔ Kompyuterdagi npx expo start dan · Play Market'dagi ilova sahifasidan · Netlify'dagi sayt manzilidan · Telefon xotirasidagi papkadan
10. Adaptiv sayt nima? Faqat telefonda ochiladigan sayt · ✔ Telefon kengligiga moslashadigan sayt · Telefonga o'rnatiladigan do'kon ilovasi · Animatsiyalari bor, bosiladigan sayt
11. PWA telefonga qayerdan qo'shiladi? Play Market do'konidan yuklab · Expo Go ilovasidagi QR orqali · ✔ Brauzerdan, saytning o'zidan · App Store do'konidan yuklab
12. Telefon saytni o'rnatishi uchun manzil qanday bo'ladi? Kompyuterdagi `localhost` manzil · Uydagi Wi-Fi tarmog'idagi manzil · `http://` bilan boshlanadigan manzil · ✔ HTTPS manzil, masalan Netlify'da

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): React Native · Expo · Expo Go · Expo Router · `src/app/` · `<Stack />` · `[id].tsx` · QR · Wi-Fi · `--tunnel` · `@media` · PWA · manifest · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 19 ekran: hook · rule · exploration · test · exploration ×2 · test · exploration · test · exploration · practice(kod) · exploration · test ·
   test(final, `scope: 'final'`) · practice(blok) ×2 · stats · flashcards · summary. `INLINE_KEYS`: s3 **1 (B)** · s6 **3 (D)** · s8 **0 (A)** · s12 **2 (C)** · s13 sentinel **0**;
   QKod (10) va bloklar (14, 15) — `practice: -1`. `LESSON_META.lessonId` — `m9-09-v1`.
2. **Bitta manba (180):** `JAMOA_EKRANLAR` (uch ekran), `NAMUNA_OYINLAR` (4 o'yin, `id` `'1'`…`'4'`), `TELEFON_YOLI` (4 bo'lak — 13-ekran finali, 5-takrorlash, A1 mobil qadamlari tartibi), `DARS_YOLI` (1-ekran reja qadamlari).
   0, 1, 2, 4, 5, 7, 9, 11, 14, 15-ekranlar shundan o'qiydi. 7-dars `JamoaTelefon` bilan ko'rinish bir xil bo'lsin (boshqa fayl — nusxa emas, o'sha dizayn).
3. **`JamoaTelefon`** — holatlar `brauzer` (manzil qatori: `localhost:5173` yoki `…netlify.app` + qulf) · `expo` (manzil qatorisiz, ramka ustida «Expo Go»; Stack o'tishi — o'ngdan surilish, «‹» bilan qaytish) ·
   `pwa` (bosh ekran kataklari, uzuq chiziqli bo'sh joy, ikonka → manzil qatorisiz sayt). O'lchami barqaror (≈170×272 dan kichraymaydi — SABOQ 22), doim chapda (SABOQ 21).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: jt-karta jt-orqaga jt-ochib jt-qr jt-ikonka`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **2-ekran:** bo'lak → tugma (avval tanlash, so'ng bosish — §16); to'g'ri juftlik jadvali; har qadamda kod qatori almashadi va telefon qismi `brauzer` → `expo` ko'rinishiga o'tadi; 4/4 da ramka holati `expo`.
5. **4-ekran:** fayl daraxti — bosish → `JamoaTelefon` ekrani (`index` → O'yinlar, `elon` → E'lon berish, `oyin/[id]` → O'yin, `_layout` → uch ekran ustma-ust qiya ko'rinish va «‹» bilan chiqish); yo'l yorliqlari.
6. **5-ekran:** bashorat (yopilmaydi — ixcham qator); karta bosilganda manzil yorlig'i, `[id]` kartasidagi `id` qiymati, fayl yorlig'i yonishi; 4/4 da to'rt manzil yorlig'idan bitta fayl yorlig'iga chiziqlar.
   ⚠️ Kod bo'lagida backtik va `${…}` bor (`router.push(\`/oyin/${o.id}\`)`) — `.jsx` ichida oddiy qo'shtirnoqli satr yoki JSX matni bo'lib yozilsin, shablon-satr emas (CLAUDE.md: backtik satrni erta yopadi).
7. **7-ekran:** uch holat ketma-ket (`QQadamlar` uslubida holat qatori); konvert yo'li: telefon → Wi-Fi → terminal (1), Wi-Fi da to'xtash + bulut orqali aylanish (2), akkaunt belgisi qizil → yashil (3); yechim tugmalari + `QXato`.
   QR — chizilgan (tasodifiy kataklar, haqiqiy havola emas).
8. **9-ekran:** surgich (1200 → 390 px), brauzer oynasi kengligi surgichga bog'liq; 600 px chegarasida kartalar qisiladi; «Telefon uchun qoida» kaliti `style.css` kartasiga `@media` blokini qo'shadi va kartalarni `column` qiladi.
9. **11-ekran:** to'rt maydon ketma-ket + «Netlify'ga chiqarish»; har maydon `JamoaTelefon` `pwa` holatining bir qismini ochadi; 5/5 da ikonka joyiga tushadi va o'zi bir marta bosiladi.
10. **13-ekran (QTartib)** — `TELEFON_YOLI` dan; uya izohi «bu yerga qo'ying».
11. **14, 15-ekran (bloklar)** — `ScreenBlok` (skelet ulagichi) + `QPrompt` (2-qadam; `{…}` joylari). **Ikki trek:** `pm-m9d8-platforma.trek` (`'mobil'` | `'web'`) bo'yicha sarlavha, qadamlar matni, prompt, kutilgan natija va yashil yakun almashadi;
    kalit yo'q bo'lsa — blok tepasida ikki tugma (tanlanmaguncha qadamlar qulf); tanlov dars holatida saqlanadi, boshqa darsning kaliti yozilmaydi (TAYANCHGA SAVOL 1).
    A1 2-qadam: `{ekranlar va ularning fayllari}` — `pm-m9d7-wireframe.ekranlar[].nom` + « — » (fayl nomi bo'sh) · `{qaysi tugma qaysi ekranni ochadi}` — `ekranlar[].tugma` · web `{ekranlar}` — `ekranlar[].nom`.
    Har `{…}` yonida kulrang «masalan: …»; «Yordam» — Mentor misolidagi to'liq talab (ochiladigan). 4 qadam, 5-qadam yo'q.
    ⚠️ Qolipda yo'q (11-Modul MEXANIZM-TAKLIF 1–2): `QPrompt` da «masalan» va oldindan yozilgan qiymat · qadam ichidagi «Yordam» · `QM.ortda` yorlig'i. 15-ekran mobil `QIzoh` — faqat mobil trekda.
    `ACH_TRIGGERS`: A2 oxirgi «Bajardim» → Pocket Prototype.
12. **10-ekran (QKod) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `style.css` o'quvchi). Tekshiruvlar (stylesheet parse, regex emas): `@media` qoidasi, shartida `max-width` va px birligi (320–768 oralig'i);
    uning ichida `.oyinlar` selektori va `flex-direction: column`. «Bajardim» shartlar ✓ bo'lgach ochiladi (§19). Qoralama kaliti `pm-m9d9-code`.
    ⚠️ **Natija oynasi kengligi tugmalari («Kompyuter» 900 px · «Telefon» 390 px) `HtmlCompiler` da yo'q** (umumiy modul — asosiy seans qarori; TAYANCHGA SAVOL 8). Bo'lmasa: vazifaning 3-bandi
    «Natija oynasida kartalar ustma-ust tursin» ga o'zgaradi va natija oynasi tor bo'lsa ham `@media` tekshiruvi parse bilan qoladi.
    ⚠️ `style.css` starter `.jsx` ichida shablon-satr bo'lsa — CSS izohida backtik yo'q (starter izohi backtiksiz yozildi).
13. `RECAPS` 5 (kalit = 3, 6, 8, 12, 13) · `Q_LABELS` {3, 6, 8, 12, 13} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) ·
    `HW_TOKENS` fon so'zlari {uz, ru}.
14. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). 3-ekran savoli ustida kod bo'lagi (mono, 3 qator).
15. **Darvozalar:** `npm run gates -- src/9-Modull/ExpoPrototypeLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366/390 · surat 1280 + 393 · `stilsiz.py` (SABOQ 31).

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m11-dars-09-start` = `m11-dars-08-done` → `m11-dars-09-done`)
1. `mobil/` — `npx create-expo-app@latest mobil` (default shablon: Expo Router, TypeScript). `src/app/_layout.tsx` — `<Stack />` (tablar va `explore.tsx` olib tashlangan) · `src/app/index.tsx` — O'yinlar ·
   `src/app/oyin/[id].tsx` — O'yin (`useLocalSearchParams`) · `src/app/elon.tsx` — E'lon berish (tayanch 1.6, aynan). Namuna ma'lumot — 4 o'yin (`NAMUNA_OYINLAR`, `id` satr), `mobil/` ichida.
   Animatsiyalar: karta bosilganda kichrayib qaytadi (0,15 s) · son kattalashib qaytadi (0,3 s) · harakat kamaytirilsa — yo'q; paketlar faqat `npx expo install` bilan. Backend yo'q.
2. `prototip/` (web-trek namunasi): O'yinlar ro'yxati `@media (max-width: 600px)` da bitta ustun · `public/manifest.webmanifest` (`name`, `short_name` — «Maydon Jamoa», `start_url` `/`, `display` `standalone`, ikonkalar 192 va 512 PNG) ·
   `index.html` da `<link rel="manifest" href="/manifest.webmanifest">`. Netlify: base `prototip`, build `npm run build`, publish `dist`.
3. `README.md` — «Telefonda ochish» bo'limi: mobil (`cd mobil` · `npm install` · `npx expo start`, QR, bitta Wi-Fi yoki `--tunnel`) va web (Netlify havolasi) · «Darslar va teglar» jadvaliga `m11-dars-09-done`.
4. **Muhrdan oldin haqiqiy sinov (P-028):** toza papkada `git clone` → `git checkout -f m11-dars-09-done` → `cd mobil` → `npm install` → `npx expo start` → Android (Expo Go «Scan QR code») va iPhone (kamera, bitta akkaunt) da uch ekran va animatsiyalar;
   maktab tarmog'ida `--tunnel`; `create-expo-app` repo ichida alohida `.git` ochmaganini tekshirish (Shubhali 3). Web: Netlify'dagi sayt Android Chrome'da o'rnatiladi (menyu nomlari ko'riladi), iPhone Safari'da bosh ekranga qo'shish yo'li yoziladi (Shubhali 1).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 09-FILTR):** 1 — qabul, trek `pm-m9d8-platforma` ga yoziladi · 2, 3, 5, 6, 10 — qabul · 4 — tayanch 2 ga yozildi (manifest, tunnel) · 7 — tayanch 9.2 (`id`) · 8 — ochiq (mexanizm: QKod kengligi) · 9 — yopildi.
1. **Bloklar ikki trekda:** tayanch 4 «trek farqi — prompt qatorida yoki «Yordam»da bir gap» deydi; 9-darsda farq butun blok (mobil — Expo, QR; web — adaptiv, manifest, Netlify). Shuning uchun A1 va A2 har biri
   ikki variantda (sarlavha, qadamlar, prompt, kutilgan natija), trek `pm-m9d8-platforma` dan. Kalit yo'q bo'lsa — blok tepasida ikki tugma; tanlov `pm-m9d8-platforma.trek` ga yoziladi (yangi kalit yo'q — 09-FILTR 30).
2. **A1 mobil tartibi:** avval shablon telefonda ochiladi (ulanish), keyin agent ekranlarni ko'chiradi — ulanish muammosi ekran xatosi bilan aralashmaydi. Final QTartib (13) shu tartibni tekshiradi.
3. **A2 mobil — animatsiyalar RN'da:** tayanch 3 teg 09 da animatsiya yozilmagan, lekin 10-dars A3 «animatsiyalar o'zgarmasin» deydi va 16-dars «jonli demo telefonda» kutadi. Shuning uchun A2 mobil — 7-dars A2 dagi uch animatsiya RN'da.
4. **Tayanch 2 da yo'q atamalar:** **manifest** («sayt o'zi haqida yozgan kichik fayl: nomi, ikonkalari, qaysi sahifadan va qanday ochilishi») · **tunnel** («telefon kompyuterga internet orqali ulanadigan yo'l; sekinroq») ·
   **`.tsx` / TypeScript** (bir qatorli izoh: «TypeScript'dagi React fayli: kodni agent yozadi, siz o'qiysiz») · **bosh ekran** · **manzil** (Expo Router'da ekran manzili `/elon` — brauzerdagi manzil bilan bir so'z; «yo'l» bu ma'noda ishlatilmadi).
5. **Web-trekda Netlify — 9-darsda** (PWA uchun HTTPS kerak; telefon `localhost` ni ocholmaydi). Netlify yo'li 9-Modul `09-MvpComplete` dagidek, base `prototip`. 10-dars A3 «push — Netlify o'zi yangilanadi» shunga tayanadi.
6. **Adaptiv qoida:** `@media (max-width: 600px)` + `flex-direction: column` (2-Modul flexbox + 9-Modul `@media`); 600 px — tanlangan qiymat. Grid bu kursda o'tilmagan — ishlatilmadi.
7. **Namuna o'yinlarda `id`** — **yopildi (09-FILTR 17):** tayanch 9.2 ga `id` `'1'`…`'4'` qo'shildi, 7-dars `namuna.js` dan boshlab.
8. **QKod natija oynasi kengligi** («Kompyuter» / «Telefon») — `HtmlCompiler` da yo'q (umumiy modul). Qo'shilmasa — KOD 12 dagi muqobil.
9. **Web-trek ikonka — yopildi (09-FILTR 25, 26):** «matnsiz oddiy shakl» + agent yarata olmasa — tayyorlash yo'li. Eski izoh: talabda agentdan «bosh harf bilan oddiy PNG» so'raldi (o'quvchida rasm bo'lmasligi mumkin). Agent PNG yasay olishi — Shubhali 5.
10. **Uyga vazifa 3-band:** web-trekda Netlify havolasi `README.md` ga (16-dars pitchida telefonda ochish uchun) — tayanchda yo'q, o'zim qo'shdim.

## Shubhali joylar (ishonchim komil emas)
1. ~~**iPhone Safari'da bosh ekranga qo'shish**~~ — **yopildi (09-FILTR 7):** support.apple.com — «Share» → «Add to Home Screen» / «Edit Actions». Qurilmada ko'rish — pilotda. Eski izoh: tayanch 6 bo'yicha tekshirilmagan; A2 web 4-qadamida tugma nomi yo'q («saytni Safari'da oching va bosh ekranga qo'shing»). «Qur» da iPhone'da ko'rib, aniq yo'l yoziladi.
2. **Android Chrome menyu nomlari** «⋮» → «Install and create shortcut» → «Install» — support.google.com (Android, inglizcha, 06.10). Telefon tili o'zbekcha yoki ruscha bo'lsa nomlar boshqacha; Chrome versiyasi bilan o'zgarishi mumkin.
3. ~~**`create-expo-app` mavjud git repo ichida**~~ — **yopildi (06.10 sinov, 09-FILTR 19):** CLI «Skip initializing a new git repository? (Y/n)» deb so'raydi, sukut — Y; ichma-ich `.git` yo'q, `git status` da `?? mobil/`. Eski izoh: alohida `.git` ochmasligini rasmiy hujjatda ko'rmadim (create-expo sahifasida faqat `AGENTS.md` yaratilishi yozilgan). Ochsa, `git add mobil` fayllarni emas, havolani qo'shadi;
   A2 mobil 4-qadamida `git status` da `mobil/` fayllari ko'rinishi tekshiriladi. «Qur» da sinab ko'riladi (REPO 4).
4. **QR telefonga kompyuterning tarmoqdagi manzilini beradi** — umumiy bilim (Expo LAN rejimi); rasmiy hujjat faqat «same Wi-Fi network» deydi. O'quvchi matnida manzil haqida gap yo'q (hookda faqat «kompyuter boshqa manzil bilan topiladi»).
5. **Web-trek ikonkalari** — agent 192/512 PNG yasay olishi tekshirilmagan; yasay olmasa, o'quvchi bitta kvadrat rasm qo'yadi (Yordam'ga gap qo'shish mumkin).
6. **RN animatsiyalari Expo Go'da** — agent tanlagan vosita Expo Go'da ishlashi kerak (`npx expo install` sharti bilan); sinab ko'rilmagan.
7. **`--tunnel` va `@expo/ngrok`** — tayanch 6 bo'yicha avval global o'rnatiladi; yangi Expo CLI o'zi taklif qilishi ham mumkin. Tunnel ishonchliligi maktab tarmog'iga bog'liq.
8. **Default shablon tuzilishi** (`src/app/`, tablar, `explore.tsx`) — 06.10 hujjat bo'yicha; Expo versiyasi bilan o'zgarsa, A1 talabidagi «`explore` ekrani va pastki tablar» qatori yangilanadi.
9. **Chrome «bosish + 30 soniya» sharti** — o'quvchi matnidan olindi (09-FILTR 5): menyu orqali o'rnatishda shartligi aniq emas.
10. **Expo Go versiyasi** — telefondagi Expo Go loyiha SDK siga mos bo'lishi kerak (joriy SDK 57); eski Expo Go bo'lsa, loyiha ochilmasligi mumkin. Xabar matni tekshirilmagan — A1 da yozilmadi (O'qituvchi eslatmasi: darsdan oldin yangilash).
11. **2-ekran juftlashi** `className` → `style` + `StyleSheet` — bitta tugma bilan soddalashtirildi (8-Modul: «Alohida CSS fayl emas, JS obyekt: StyleSheet.create»). Haqiqiy ko'chirishda ko'rinish qoidalari ham qayta yoziladi — buni agent qiladi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): 379–381-qatorlar — `m9-08` «Arxitektura va platforma: web yoki mobil ilova» → **`m9-09` «React Native va Expo: prototip telefonda»**
      (osti «Expo, navigatsiya; web-trek — adaptiv sayt va PWA») → `m9-10` «Loyiha kuni: poydevor — Database, kirish, deploy»; reja teglari `sub` so'zlari bilan (`Expo` · `navigatsiya` · `Expo Go` · `adaptiv sayt · PWA`).
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — `JamoaTelefon` uch holatda (brauzer · expo · pwa), doim chapda; o'quvchining o'z mahsuloti — A1, A2 (o'z trekida).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 5, 7, 9, 11 (va 0, 10, 13, 14, 15) — matn-karta yo'q; bashoratlar (5, 9) tanlangach ixcham qator bo'lib qoladi.
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — o'lchov skripti (scratchpad `md09/olchov.py`): natija pastda («O'lchov»).
- [x] Atamalar tayanch 2-bo'lim va 7-dars bilan aynan (prototip, jonli prototip, wireframe, talab, namuna ma'lumot, trek, Expo Router, adaptiv sayt, PWA); 8-Modul so'zlari (`View`, `Text`, `Pressable`, `StyleSheet`, Stack);
      8-Modul ko'prigi so'zma-so'z (4-ekran); siz-forma; agent promptlari — T-002 istisnosi. Tayanchda yo'q 5 atama — TAYANCHGA SAVOL 4.
- [x] Testlar: variantlar bir shaklda, uzunligi o'rtachadan ±15% ichida, to'g'ri javob hech qayerda yolg'iz eng uzun emas (o'lchov pastda; arena ham); kalit so'z/tire faqat to'g'rida emas · ✔: s3 B · s6 D · s8 A · s12 C · arena A·B·C·D ×3.
- [x] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi; tartib `TELEFON_YOLI` — A1 qadamlari bilan bitta manba (P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol», «albatta» — yo'q; «odatda» — faqat arena 6 savolida, 8-Modul so'zi).
- [x] Ichki kodlar o'quvchi matnida yo'q (F1–F3, `m9-09`, modul kod raqami); modul raqami LMS bo'yicha («8-Modulda» — React Native darslari, kod `m6-09…11`; «9-Modulda» — `@media`; «2-Modulda» — Netlify; kod raqamlari faqat MD izohida, tayanch 2 moslik jadvali); tarixiy voqea yo'q; tashqi xizmat nomlari rasmiy hujjatdan (A-10) yoki umumiy so'z + Shubhali 1–2 · «KOD» (15) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 (promptlar) · T-008 (agent talablari) · T-011 (Expo Router, adaptiv sayt, PWA — harakatdan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 («ekran» — faqat ilova ekrani; «bosh ekran» — PWA ta'rifi so'zi; «sahifa» — brauzer) ·
      T-016/017 (metafora yo'q) · T-024 · T-029 · T-039 («prototipingiz» — 7-darsda yaratilgan) · T-043 («bu misolda», «bu darsda», «mumkin») · T-045 (Expo Go — kompyuterdan keladi, sinash uchun; PWA — do'kondan emas; Stack — Expo Router'da) ·
      T-052 (8-Modul ko'prigi) · T-064 · P-001/002/004 · P-008 · P-013 · P-015 · P-016 · P-025 · P-026 (har tashqi qadamda xato yo'li bitta gap: Wi-Fi/tunnel/akkaunt, «Shu xato chiqdi…») · P-028 · P-036 · P-046 · P-052 · P-059 · P-062 · P-063 · P-064 (5, 9) · P-065 (2, 5) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-018 (brend yo'q) · S-020 · S-026 · S-040 (2-ekran tuzoqlari bir xato-sinf: web odati) · SABOQ 6, 8, 11, 12, 13, 16, 21, 22, 25, 26.

### O'lchov (scratchpad `md09/olchov.py`, 06.10; backtik va `**` sanalmaydi, «Aynan!» / «Qiziq fikr!» javobga qo'shilgan)
- Sarlavhalar 25–54 (≤55) · xulosalar 82–106 (≤110) · hook javoblari 111–113 (≤120) · test xato izohlari 38–58 (≤60) · `QXato` qatorlari 47–57 (≤60) · QKod shart xabarlari 48, 57 (≤60) ·
  to'g'ri izohlar 60–81 · nom qatorlari 60–108 · yashil yakunlar 78–86 · Mentor hamma ekranda 1–2 gap (interaktivda 1).
- Test variantlari (o'rtachadan og'ish): s3 +15 / 0 / −4 / −11 · s6 +1 / −7 / +11 / −4 · s8 +3 / −4 / −2 / +3 · s12 +12 / +1 / −6 / −6 — to'g'ri javob hech qayerda yolg'iz eng uzun emas.
- Arena: 12 savol, savollar 3–7 so'z, variantlar ±15% ichida, to'g'ri javob yolg'iz eng uzun emas; ✔ A·B·C·D ×3.
- `npm run lint:til` — 0 error, 0 warn.
