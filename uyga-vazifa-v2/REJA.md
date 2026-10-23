# Uyga vazifa v2 — 2–14-modul, PM'dan tashqari hamma darslar (REJA)

> **Doira (19.10):** Kod (58) + Praktika/Proyekt (43) = **101 dars**. PM darslariga hozircha vazifa YO'Q.

> 19.10 da boshlandi. Foydalanuvchi har modul bo'yicha qaror beradi → shu faylga yig'iladi →
> hammasi kelishilgach, vazifalar birma-bir avtomat quriladi (shoshilmasdan).
> Eski `uyga-vazifa/` va `*.homework.jsx` — namuna EMAS (foydalanuvchi: «miyangdan o'chir»).
> Uslub-namuna: mentor exam `~/mentor_exam/bank_v3/RULES.md` (Foundation, Level 1, Level 2).

## 0. Umumiy qoidalar

**Matn (mentor exam'dan):**
- Savol 1–2 oddiy gap, hikoya-kirish yo'q. «Bu kod nima chiqaradi?», «Qaysi kod rasmdagi natijani beradi?» uslubi.
- Faqat bitta to'g'ri javob; fikrga bog'liq savol («eng yaxshi usul») yo'q; hiyla/chekka holat yo'q.
- Noto'g'ri variantlar — yangi o'rganuvchining haqiqiy xatolari; 4 variant uzunligi yaqin.
- Darsda o'tilmagan narsa so'ralmaydi — doira har darsning o'zidan olinadi (quyida «Doira» qatori).
- Texnik atamalar inglizcha (flex, href); UZ lotin, ASCII apostrof; RU tabiiy.

**Turlar:**
| Belgi | Tur | Qayerda | Topshirish |
|---|---|---|---|
| **T** | Test — 5 savol, 4 variant, har variantga hint | LMS test | avtomat ball |
| **C** | Amaliy — LMS compiler (html / css / js / react) | LMS | kod; AI-tekshiruvchi rubrikasi (inglizcha, 10 ball) |
| **C+A** | Amaliy — LMS compiler + **LMS AI-agent** (vazifada aytiladi: agent bor, undan foydalaning) | LMS | kod; rubrika darsdagi mavzuni tekshiradi, agent yozgan dizayn jazolanmaydi |
| **V** | VS Code / GitHub / Netlify — o'quvchi kompyuterida | lokal | skrinshot yoki URL LMS'ga yuklanadi |

**Rasm:** compiler vazifalarda — kutilgan natija rasmi (reference yechimni Chrome'da ochib skrinshot;
o'ylab topilgan/chizilgan rasm yo'q). Foydalanuvchi o'zi beradigan rasm bo'lsa — o'sha ishlatiladi.

**Har vazifa paketi (qurilganda):** `uyga-vazifa-v2/M<N>/<dars-kaliti>.md` — UZ + RU vazifa matni, starter kod,
reference yechim (ishga tushirib tekshirilgan), natija rasmi (`rasm/`), AI-rubrika, test bo'lsa — savollar + hint + `why`.

**Tekshiruv (har vazifa):** reference yechim ishga tushiriladi → rasm undan olinadi → rubrika har punktini
reference qondirishi tekshiriladi → testlar: bitta javob, uzunlik chegaralari (bank_v3 §5) → `npm run lint:til`.

## 1. Ochiq savollar (foydalanuvchi uyg'onganda)
1. RU tarjima ham kerakmi? (taxmin: ha, LMS uz+ru — qurish bosqichida)
2. 2-5 Takrorlash — login sahifa rasmi: ✅ 21.10 namuna yechimdan yasaldi (foydalanuvchi: «o'zing qil»).
3. 7-modul va 9–14-modul vazifalarida Antigravity o'rniga «Gemini yoki Copilot» deb yozildi (18+ cheklovi) — to'g'rimi?
4. 9–10-modul: «darsda Maydon, uyda o'z MVP'ingiz» (MD'dagi «O'z g'oyangiz — uyda yuborasiz» qadami) — shu yondashuv ma'qulmi?
5. LMS nomi va dars mazmuni farqi — LMS'da nomni to'g'rilash kerakmi: 4-8 «fetch va axios», 6-11 «Practice 1: backend + frontend».
6. Test soni: 2-1 = 5 (qaror), 3-1 = 3+1 (qaror), qolgan 14 ta test — 5 savoldan (tushuncha ko'p darslar). 3+1 ga o'tkazish kerak bo'lganlari bormi?

**✅ Qarorlar (19.10 kech, foydalanuvchi — avtopilot oldidan):**
- **Joy:** LMS compiler (+ agent) — faqat **2–3-modul** (HTML, CSS, JS). **4-moduldan (React) boshlab** — o'quvchi o'z
  kompyuterida qiladi, **fayl yuklaydi yoki GitHub'ga qo'yib linkini yuboradi**. LMS terminalida backend yurmaydi (A turi yo'q).
- **Tekshiruv:** AI faqat LMS compiler vazifasini tekshiradi (inglizcha rubrika). Fayl/link/skrinshot vazifalarini
  **mentor va yordamchi mentorlar** tekshiradi → har vazifaga o'zbekcha 3–5 qatorlik tekshiruv ro'yxati.
- **Test:** savollar soni darsga qarab (tushuncha ko'p — 5, kam — 3 + 1 rasmli).
- **Agent yo'q:** vazifalar bittalab, o'zim yozaman.
- Batafsil vazifa kartalari: **`VAZIFALAR.md`** (101 dars, LMS tartibida) — 19.10 avtopilot qoralamasi, foydalanuvchi ko'rigida.

**✅ Qaror (19.10, foydalanuvchi):** eski vazifalar umuman hisobga olinmaydi. Hozir fokus — faqat yangi vazifalar.
Hammasi qurilgach, barcha darslarga bir yo'la qo'yiladi va **bitta upload** qilinadi.

## 2. Tavsiya tamoyili (har dars uchun tur shunday tanlandi)
- **Kod yozilmaydigan, tushuncha darsi** → **T** (5 savol, natija/tartib/kod-o'qish; fikr-savol yo'q).
- **Kodi LMS compiler'da ishlaydigan dars** (HTML, CSS, JS konsol, DOM, React) → **C** + natija rasmi.
- **AI bilan qurish o'rgatilgan praktika** → **C+A** (LMS agenti bilan), rubrika darsdagi mavzuni tekshiradi.
- **Server / bot / CI / mobil / o'z loyihasi** (compiler'da ishlamaydi) → **V**: GitHub/deploy URL yoki skrinshot,
  aniq 3–4 qabul sharti (ustoz ochib tekshira oladigan). 5-savolga «ha» bo'lsa → A.
- Vazifa darsdagi ishni **takrorlamaydi** — bitta qadam oldinga (yangi bo'lim, yangi endpoint, yangi tekshiruv).
- Ip saqlanadi: o'quvchining o'z sayti / do'koni / boti / loyihasi keyingi darsda davom etsa — vazifa ham o'shanda.

---

## M2 «Men internetdaman» — 9 Tex dars ✅ qaror 19.10

> ⚠️ Bu bo'lim — birinchi qoralama. Amaldagi kartalar (2-10, 2-11 qayta yozilgan) — `VAZIFALAR.md`.

| # | Kalit / fayl | Dars | Tur | Qisqa |
|---|---|---|---|---|
| 1 | InternetLesson | Internet qanday ishlaydi | **T** | 5 savol |
| 3 | Htmllesson1 | HTML asoslari | **C** html + rasm | kichik sahifa |
| 4 | Htmllesson2 | HTML: rasm, struktura, forma | **C** html + rasm | struktura + forma |
| 5 | HtmlTakrorlashLesson | Takrorlash: HTML ustaxonasi | **C+A** + rasm (foydalanuvchidan) | login sahifa, animatsiyali |
| 7 | CssLesson1 | CSS asoslari | **C** html+css + rasm | rang, shrift, bo'shliq |
| 8 | CssLesson2 | CSS: layout, flexbox | **C+A** html+css + rasm | dizaynga boy, animatsiyali loyiha |
| 9 | VsCodeLesson | VS Code | **V** skrinshot | o'rnatib, kichik sayt |
| 12 | GitLesson | Git va GitHub | **V** URL | repo + kichik loyiha |
| 13 | DeployLesson | Netlify va deploy | **V** URL | Demo Day saytini tugatib, Netlify linki |
| 10 | HtmlPractice | HTML Praktika — Portfolio | **V** skrinshot ⏳ tavsiya | portfolio'ga 2 bo'lim |
| 11 | CssPractice | CSS Praktika — Demo Day sayti | **V** skrinshot ⏳ tavsiya | bezalgan bosh sahifa + 3 sahifa rejasi |

### M2-10 HTML Praktika — Portfolio — V (skrinshot) ⏳ tavsiya
- **Darsda:** o'z portfoliosi VS Code + gemini.google.com + Live Server'da (o'quvchi kompyuterida).
- **Tavsiya:** o'sha saytga «Loyihalarim» (ro'yxat, har bandda link) va «Aloqa» (email link) bo'limini qo'shadi →
  Live Server skrinshoti. **Nega V:** sayt 11 → 12 → 13-darslarda davom etadi; LMS compiler'ga ko'chsa ip uziladi.

### M2-11 CSS Praktika — Demo Day sayti — V (skrinshot) ⏳ tavsiya
- **Darsda:** portfolio saytiga CSS (rang, shrift, padding/margin + flex); Demo Day g'oyasi (`ccDemoDay`).
- **Tavsiya:** menyu flex bilan bir qatorda + kartochkalar `gap` bilan; bosh sahifa skrinshoti + qolgan 3 sahifa
  nomi (13-darsda qo'shiladi). **Nega:** 13-dars aynan shu saytni tugatib Netlify'ga chiqaradi.

### M2-01 Internet qanday ishlaydi — T
- **Qaror:** 5 ta savol (6–8 emas).
- **Doira (darsdan):** domen (.com/.org/.uz), IP-manzil, DNS (domen → IP), server, brauzer, so'rov → javob (HTML qaytadi).
- **To'ldirish:** savollar natija/tartib bo'yicha: «youtube.com yozilganda birinchi nima bo'ladi?», «DNS nima qaytaradi?»,
  «Qaysi biri IP-manzil?», «Server brauzerga nima yuboradi?», qadamlar tartibi. Rasm faqat kerak bo'lsa (0–1).

### M2-03 HTML asoslari — C (html) + natija rasmi
- **Qaror:** LMS HTML compiler'da; vizual natija rasmi qo'yiladi.
- **Doira:** skelet (`<!DOCTYPE html>`, html/head/body, title), h1–h6, p, ul/ol/li, a href, strong/em.
- **To'ldirish:** bitta mavzuli sahifa (masalan sevimli o'yin/joy haqida): sarlavha, 2 abzats, ro'yxat, bitta link.
  Aniq matn/teg talablari 4–6 punkt; rasm = reference sahifa skrinshoti. Starter — bo'sh skelet.

### M2-04 HTML: rasm, struktura, forma — C (html) + natija rasmi
- **Qaror:** LMS compiler; vizual natija rasmda.
- **Doira:** header/main/footer, img (src, alt), form, label, input (type), button, div.
- **To'ldirish:** header (sarlavha) + main (rasm alt bilan + ro'yxatdan o'tish formasi: label+input×2–3, button) + footer.
  Rubrika: struktura teglari, alt bor, har input'ning label'i, type to'g'ri (email/password).

### M2-05 Takrorlash: HTML ustaxonasi — C+A + rasm (foydalanuvchidan)
- **Qaror:** loyiha — masalan login sahifa; vazifada «LMS compiler'da AI-agent bor» deb aytiladi → o'quvchi
  zo'r, animatsiyali qiladi; rasmni foydalanuvchi beradi.
- **To'ldirish:** HTML qismi o'quvchining o'zidan (darsda o'tilgan: form, label, input, button, img, a, h1, p);
  dizayn va animatsiya — agent bilan. Rubrika HTML tuzilmasini tekshiradi (forma, label↔input, type=email/password,
  «Parolni unutdingizmi?» link, logo img alt), dizayn/animatsiya bor bo'lsa — bonus, agent ishlatgani jazolanmaydi.
- **Ochiq:** rasm (1-bo'lim, 2-savol).

### M2-07 CSS asoslari — C (html+css) + natija rasmi
- **Qaror:** HTML va CSS vazifa, LMS HTML compiler'da.
- **Doira:** selektor (teg, `.class`, `#id`), color, background-color, font-size, font-family, font-weight, text-align,
  margin, padding, rang `#FF4D26` ko'rinishida, tashqi `style.css`.
- **To'ldirish:** profil/afisha kartasi: HTML tayyor (class/id bilan), o'quvchi style.css yozadi; aniq qiymatlar
  (masalan sarlavha 32px markazda, fon rangi aniq hex) — rasm bilan solishtiriladi.

### M2-08 CSS: layout, flexbox — C+A (html+css) + natija rasmi
- **Qaror:** compiler'da, animatsiyali va dizaynga boy loyiha, LMS compiler agentidan foydalanib.
- **Doira (majburiy tekshiriladi):** display: flex konteynerda, flex-direction row/column, justify-content
  (center / space-between), align-items: center, gap.
- **To'ldirish:** mini-landing: menyu (logo chapda, linklar o'ngda — space-between), 3 kartochka qatorda (gap),
  pastda ustun (column). Flex qismi rubrikada majburiy; animatsiya/hover/soya — agent bilan, bonus.

### M2-09 VS Code — V (skrinshot)
- **Qaror:** VS Code'ni o'rnatib, kichik HTML+CSS saytcha qiladi, rasmga olib LMS'ga yuklaydi.
- **Doira:** Explorer/Editor/Extensions, Live Server «Go Live», `127.0.0.1:5500`, index.html + style.css, `<link>`, `.card`.
- **To'ldirish:** papka → index.html + style.css (link bilan ulangan) → card (div.card, h2, p) → Go Live.
  Skrinshotda ko'rinishi shart: Explorer'da ikkala fayl + brauzerda `127.0.0.1:5500` manzili va card.

### M2-12 Git va GitHub — V (URL)
- **Qaror:** GitHub'da repo ochib, biror kichik loyihasini joylaydi, URL'ni yuklaydi.
- **Doira:** git add / add . / commit / push / pull, github.com/<nom>/<loyiha>, README, index.html.
- **To'ldirish:** loyiha = M2-09 saytchasi (yoki boshqasi); talab: repo ochiq (public), ichida index.html + README,
  kamida 2 ta commit. Topshirish: `https://github.com/<nom>/<repo>`.

### M2-13 Netlify va deploy — V (URL)
- **Qaror:** Demo Day uchun saytining chala joylarini to'ldiradi va URL'ni LMS'ga yuklaydi.
- **Doira:** darsning o'zi shunday tugaydi: «uyda saytni tugatasiz va jonli linkingizni (https://...netlify.app)
  platformadagi vazifaga yozib yuborasiz»; GitHub'dan Import.
- **To'ldirish:** talab: sayt `https://<nom>.netlify.app` da ochiladi, telefonda ham; Demo Day g'oyasi (nom, muammo,
  yechim) sahifada bor; GitHub repo bilan ulangan.

---

## 3–14-modul — MENING TAVSIYAM — ⚠️ ESKIRGAN (19.10 kech qarorlaridan oldingi tavsiya; amaldagisi — `VAZIFALAR.md`)

Ustunlar: **Darsda** — darsning o'zidan (fayl sarlavhasi, kod atamalari, MD v3) · **Tavsiya** — tur + nima qilinadi ·
**Nega** — bir gap. «Qabul» — ustoz/AI ochib tekshiradigan shartlar.

**# = LMS'dagi tartib** va dars nomi — LMS'dagidek (go.coddycamp.uz, foydalanuvchi skrinshotlari 19.10). Bizdagi fayl tartibi
3–4-modulda bittaga farq qiladi (reestrda bo'sh raqam bor) — hamma joyda LMS raqami ishlatiladi.

### M3 «Sistemalar qanday o'ylaydi» — 10 dars (6 Kod + 4 Praktika). JS bu modulda **konsolda** (DOM — faqat Praktika 1 dan)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 1 | Sistema va Algoritm | kodsiz: sistema (qism + bog'lanish), algoritm (ketma-ketlik, shart, sikl) | ✅ **T**: 3 savol — qadamlar tartibi va shart + 1 savol blok-sxema rasmi bilan | ✅ qaror 19.10 |
| 3 | JS: O'zgaruvchilar | let/const/var, string/number/boolean, `=` | **C** js: o'yinchi profili — 4 o'zgaruvchi, ball yangilanadi, konsolga aniq qatorlar | natija konsolda aniq tekshiriladi |
| 4 | JS: Shart operatorlari | `> < >= <= == != ===`, else if | **C** js: ball → baho (5 oraliq), PIN tekshiruvi; kutilgan konsol chiqishi beriladi | har shoxni rubrika sinaydi |
| 5 | JS: Sikllar | for, while, massiv `[i]`, `.length` | **C** js: narxlar massivi — for bilan har birini chiqarish, jami, while bilan «1000 dan oshguncha» | darsdagi uch qolip bitta vazifada |
| 6 | JS: Funksiya va Massiv | function, parametr, return, console.log vs return | **C** js: `zarar(kuch, bonus)` + `jon(qoldi, urilgan)` return bilan, 3 chaqiruv | darsning o'yin ipi davom etadi |
| 8 | Practice: HTML-CSS-JS | o'z Demo Day saytiga JS: tungi rejim, like, 10 like tabrik (if) | **C** html+js + rasm: darsda qilinmagan 2 vosita — ko'rsat/yashir tugma + forma tekshiruvi (bo'sh → xato matni) | 5 vositadan qolgan ikkitasi; DOM'ni compiler aniq sinaydi |
| 9 | Practice: AI-Agent 1 | 4 qismli prompt (mavzu·uslub·rang·bo'limlar), iteratsiya | **C+A**: LMS agentiga 4 qismli prompt yozib o'z mavzusida promo sahifa; prompt HTML boshida izohda | darsning yuragi — prompt; rubrika promptga moslikni tekshiradi |
| 10 | Frontend va Backend | React · Express · Node · PostgreSQL, so'rov sayohati (restoran) | **T** 5, 1–2 tasi sxema rasmi bilan: «izoh qayerda saqlanadi?», so'rov tartibi | kod o'rgatilmagan obzor |
| 11 | Practice: AI-Agent 2 | massiv + for kartochkalar, if toifa tugmalari, qidiruv | **C+A** html+css+js: katalogga «Sevimli ♥» — bosilsa sanagich va «Sevimlilar» ro'yxati | dars faylida «Sevimli — uyga vazifa» deb rejalangan |
| 12 | Practice: MVP tayyor | savat (push) + jami (for), «03000» bug, Netlify | **V** URL: do'kon Netlify'da; qabul — savatga qo'shish, jami to'g'ri, **yangi:** savatdan o'chirish | darsning natijasi — jonli link |

### M4 «Frontend — React» — 10 dars (6 Kod + 4 Praktika). Ip: robo-games → AvtoIjara
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 1 | React intro | komponent (bloklar), Virtual DOM, oddiy sayt vs ilova; kodsiz | **T** 5, 1 rasm (sahifa → komponentlarga bo'lingan) | kod yozdirilmagan |
| 3 | React: 1-komponent | Vite, JSX qoidalari (className, bitta tashqi teg), `<GameCard name=… />` | **C** react + rasm: `GameCard` (name, emoji, players) 3 marta chaqiriladi | compiler `react` turi bor (L1-CMP-05) |
| 4 | useState va useEffect | useState, set → qayta chizish, useEffect [] va [dep], document.title | **C** react: like tugmasi + `document.title` likes bilan yangilanadi | ikkala hook bitta kichik vazifada |
| 6 | Props orqali ma'lumot uzatish | massiv + `games.map`, bir tomonlama oqim | **C** react + rasm: 6 o'yinli massivdan katalog `map` bilan, `key` | darsning yakuniy natijasi kattaroq ma'lumotda |
| 7 | CRUD | `[...games, yangi]`, map bilan update, filter bilan delete; push xatosi | **C+A** react: «Mening o'yinlarim» — qo'shish/o'chirish/tahrirlash; rubrika: mutatsiya yo'q | darsdagi klassik xato rubrikada ushlanadi |
| 8 | fetch va axios | fetch, `.json()`, loading, useEffect+fetch, 404 | **C** react: jsonplaceholder `/posts` — loading, ro'yxat, xato holati (1-bo'lim 4-savol) | tarmoq bo'lsa — haqiqiy so'rov |
| 9 | POST, PUT, DELETE | method, body + JSON.stringify, 201, `/games/2` | **C** react: forma → POST, javobdagi `id` ko'rsatiladi; o'chirish DELETE | jsonplaceholder POST'ga 201 qaytaradi |
| 11 | React Router | Routes/Route, Link vs a, `/game/:id`, useNavigate | **V** URL (GitHub yoki Netlify): 3 sahifa — `/`, `/game/:id`, `/add`; qo'shgandan keyin Bosh'ga qaytadi | compiler'da router importi noaniq (4-savol); ha bo'lsa → C |
| 12 | React practice 1 | katalog, `/car/:id`, ijaralarim, jami = kun × narx | **V** URL: AvtoIjara'ga **yangi:** narx bo'yicha saralash + ijaralar jami summasi | bitta qadam oldinga, ip saqlanadi |
| 13 | React practice 2 | o'z saytini bo'laklash + aniq prompt (qaysi bo'lim · nima ko'rsatadi · uslub) | **V** URL + README: bo'laklar ro'yxati va 2 bo'lim uchun yozilgan aniq promptlar, ikkalasi qurilgan | darsning «transfer» qadami uyda tugaydi |

### M5 «Ma'lumot va bog'lanishlar» — 11 dars (7 Kod + 4 Praktika). Ip: Instagram-sxema → products → AvtoIjara/AvtoStoyanka
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 1 | Ma'lumotlar qayerda saqlanadi? | key:value, jadval, id, bog'lovchi (`user_id`), one-to-many | **T** 5, jadval rasmlari bilan: «qaysi ustun bog'laydi?», «bu JSON'da nechta post?» | tushuncha + o'qish |
| 3 | SQL va NoSQL | jadval vs hujjat, JOIN, tranzaksiya, 4 mezon | **T** 5: faqat faktli savol (qaysida JOIN bor, hujjat shakli qaysi) — fikr-savol yo'q | qaror darsi, lekin test faktga tayanadi |
| 4 | Server yaratish | npm, Express, `app.get('/salom')`, `app.listen(3000)`, ECONNREFUSED | **V** skrinshot (5-savolga «ha» bo'lsa **A**): 2 endpoint `/salom`, `/vaqt` — brauzerda `localhost:3000/vaqt` | server compiler'da yurmaydi |
| 5 | Routing | METHOD + PATH, `/games/:id`, 404, Nest `@Get/@Post/@Param` | **T** 5 kod-o'qish: «`GET /games/7` qaysi metodga tushadi?», «nega 404?» | Nest compiler'da yurmaydi; kod-o'qish aniq |
| 6 | PostgreSQL so'rovlari | CREATE TABLE, INSERT, SELECT+WHERE, UPDATE, DELETE | **T** 5 jadval rasmi bilan: «bu so'rov nechta qator qaytaradi?», «WHERE'siz UPDATE nima qiladi?» | SQL natijasini rasm bilan aniq tekshirsa bo'ladi |
| 8 | CRUD: Express + PostgreSQL | Express + `pool.query`, `$1`, 4 endpoint, Postman | **V** GitHub URL + Postman skrinshot: **yangi** `GET /api/cars?max=…` (narx filtri) | darsdagi CRUD'dan bir qadam |
| 9 | API va Postman | request/response, status 200/201/404, GET=SELECT … | **V** skrinshot: Postman'da o'z API'iga 4 so'rov (GET, POST 201, PUT, DELETE), status ko'rinadi | Postman — darsning asosiy vositasi |
| 10 | Frontendni backendga ulash | fetch ↔ API, 5173+3000, loading/error, CORS | **V** URL/skrinshot: forma → POST → refresh'dan keyin ham ro'yxatda turadi | darsdagi «to'liq aylana» isboti |
| 11 | JWT va autentifikatsiya | JWT (header.payload.signature), Bearer, 401, guard, .env, .gitignore | **T** 5 kod-o'qish: «tokensiz so'rov nima qaytaradi?», «.env qayerda turmasligi kerak?» | xavfsizlik faktlari — aniq javobli |
| 13 | Fullstack practice 1 | joylar ◄ sessiyalar (FK + JOIN), qorovul paneli | **V** GitHub URL: **yangi** endpoint — bugungi tushum (JOIN + SUM), panelda ko'rinadi | JOIN amalda yana bir marta |
| 14 | Fidbek asosida yaxshilash | fikr → Impact/Effort → upgrade (4 tadan) | **V** URL + README «oldin/keyin»: sinfdosh fikridan 1 upgrade | darsdagi sikl uyda yopiladi |

### M6 «NestJS + Test + CI/CD» — 10 dars (6 Kod + 4 Praktika). Repo: IntroNestArxitechture → KitobShop
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 1 | NestJS va arxitektura | clone, Swagger, Guard → Pipe → Controller → Service → Repository | **T** 5, 1 Swagger rasmi bilan: so'rov tartibi, qaysi fayl nima qiladi | o'qish-tushunish darsi |
| 3 | Nest arxitekturasi | Entity → DTO → Service → Controller → Module → AppModule | **V** GitHub URL + Swagger skrinshot: **yangi** resurs `Brand` (o'sha 6 qadam) | darsdagi «WE-DO» → uyda «YOU-DO» |
| 4 | NestJS practice | Category/Book/Order, `@ManyToOne`, `@Roles` | **V** GitHub URL: **yangi** `Review` resursi (kitobga bog'langan) + faqat ADMIN o'chiradi | bog'lanish + rol bitta vazifada |
| 5 | Loyihani sinovdan o'tkazish | describe/it/expect/toBe, yolg'on test (expect yo'q) | **T** 5 kod-o'qish: «bu test yashilmi yoki qizilmi?», «bu test nega doim yashil?» | darsning yadrosi — testni o'qish |
| 7 | Edge case va error path | 0, manfiy, NaN, `throw`, `toThrow()` | **V** skrinshot: `orderTotal` uchun 3 yangi test (0, −5, NaN) + guard; `npm test` yashil | test yozish — qo'l ishi |
| 8 | CI/CD nima va nega kerak? | lenta: install → test → lint → build → deploy, on: push | **T** 5, 1 rasm (qizil nuqtali lenta): «qaysi bosqichda to'xtadi, keyingilari nima bo'ladi?» | tushuncha darsi |
| 10 | GitHub Actions | `.github/workflows/ci.yml`, on/runs-on/steps, uses/run | **V** repo URL: o'z repo'sida ci.yml (install + test), Actions'da yashil run | haqiqiy lenta — haqiqiy repo |
| 11 | Practice 1: backend + frontend | 5 nuqta, secret, rollback, badge | **V** repo URL: README'da status badge + deploy bosqichi ishlagan run | darsning natijasi |
| 12 | Practice 2 | qizil jurnalni o'qish, Copilot taklifini tekshirish | **V** 2 ta run linki: qizil (sabab izohda) → yashil (tuzatish commit'i) | «oldin/keyin» — isbot aniq |
| 14 | Pre Demo Day: test + lint + deploy | matrix, cache, secrets | **V** repo URL: matrix (2 Node versiya) + `cache: npm` + secret ishlatilgan | uchala tushuncha ci.yml'da ko'rinadi |

### M7 «Botlar va avtomatlashtirish» — 8 dars (3 Kod + 5 Praktika). Ip: AvtoPizza, repo TelegramBotNest
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 1 | Event-driven: bot qanday «o'ylaydi»? | hodisa → handler → javob, token, fallback, polling/webhook | **T** 5, 1 chat rasmi bilan: «bu xabarga qaysi handler javob beradi?» | kodsiz model |
| 3 | Telegram Bot API: menyu va tugmali bot | `/start`, `bot.command`, inline tugma (`bot.action`), reply (`bot.hears`), `bot.on('text')` | **V** skrinshot + @username: **yangi** `/aloqa` buyrug'i + 2 inline tugma | bot Telegram'da yashaydi |
| 4 | Stateful logika: bot foydalanuvchini eslab qoladi | holat, chat.id, SELECT → UPDATE, INSERT | **V** skrinshot: bot ismni so'raydi, qayta ishga tushirgandan keyin ham ismni aytadi | holat + baza isboti |
| 5 | Loyiha kuni: prompt orqali istalgan Telegram bot | o'z g'oyasidagi bot, reja (hodisa → javob) | **V** @username + skrinshot: o'z botida 3 hodisa ishlaydi | darsdagi bot uyda tugaydi |
| 6 | AI API botning ichida | system prompt, suhbat tarixi, temperature, hallutsinatsiya | **V** skrinshot + system prompt matni: 3 savol — biri doiradan tashqari (bot rad etadi) | system prompt sifati ko'rinadi |
| 7 | Loyiha kuni: bot + baza + AI + xosting | Render, webhook, buyurtmalar jadvali | **V** @username + Render URL: laptop yopiq — bot javob beradi | darsning natijasi |
| 9 | Iteratsiya: fidbekni kodga aylantiraman | FIKRLAR.md, chastota × ta'sir, v2 | **V** repo URL: FIKRLAR.md + v2 commit + o'sha odamning qayta javobi | sikl uyda yopiladi |
| 10 | AI-agent: idrok et → qaror qil → harakat qil | maqsad, tool'lar, guardrail; `agent.service.ts` | **V** repo URL + chat skrinshot: **yangi** tool `cancelOrder` + tasdiqsiz ishlamaydi | tool + chegara bitta vazifada |

### M8 «Tizimni to'liq yig'aman» — 10 dars (7 Kod + 3 Praktika)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 1 | Front + back + baza + AI + bot: hammasi bir tizimda | Frontend → Backend → Database, + AI, Bot; so'rov yo'li | **T** 5, sxema rasmlari bilan: yo'l tartibi, «qism o'chsa nima bo'ladi?» | tushuncha darsi |
| 3 | MVC va mikroservislar | MVC (baza Model emas), monolit ↔ mikroservis | **T** 5 kod-o'qish: «bu fayl MVC'ning qaysi qismi?» | aniq javobli; fikr-savol yo'q |
| 4 | AI-agent vs oddiy AI | oddiy AI ↔ agent, Idrok → Qaror → Amal, tool, guardrail | **T** 5: «qaysi biri tool?», «qaysi amalga tasdiq kerak?» | tushuncha darsi |
| 5 | Claude Skills: AI'ning xulqini o'zgartiraman | SKILL.md: frontmatter (name, description) + body | **T** 5, 1 tasi SKILL.md o'qish: «Claude oldindan nimani ko'radi?» | tuzilma — aniq faktlar |
| 7 | O'z Skill'imni yozaman | name + description + body, 2–3 sinov, tuzatish | **V** SKILL.md fayli (yoki matn) + 2 sinov skrinshoti | o'z Skill'i — haqiqiy natija |
| 8 | Pipeline: React + Node + PostgreSQL + Telegram + AI | React → Nest → PostgreSQL + Telegram + AI | **V** repo URL + skrinshot: forma yuborilsa adminga Telegram xabari keladi | uch tarmoqning biri isbotlanadi |
| 9 | React Native: loyiham telefonga chiqadi | View, Text, Image, StyleSheet, Expo Go | **V** Expo Snack linki (snack.expo.dev): profil ekrani — View/Text/Image/StyleSheet | RN compiler'da yurmaydi; Snack — ochiladigan link |
| 10 | Navigation va AsyncStorage | FlatList, navigate/goBack, route.params, fetch, AsyncStorage | **V** Snack linki: Menyu (FlatList) → Tafsilot (params) + 1 element AsyncStorage'da | darsdagi 4 tushuncha |
| 11 | Loyiha kuni: mobil versiyani yig'aman | Menyu/Tafsilot/Savat/Buyurtma, reduce, Expo Go QR | **V** Snack/Expo linki: savat jami `reduce` bilan, buyurtma ekrani | darsning natijasi |
| 13 | Loyiha kuni: to'liq tizim end-to-end | web + bot + mobil → bitta backend | **V** repo URL + README sxema: uchala kirish yo'li linki | 1-bosqich yakuni |

### M9 «Loyiham kim uchun» — 5 dars (2 Kod + 3 Praktika). Ip: o'quvchining O'Z MVP'si («Maydon» — ustoz namunasi)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 4 | Mini-MVP arxitekturasi | uch qism, jadval `bandlar`, ega kirishi, stack, deploy joyi | **V** README (repo URL): o'z MVP'i — jadval ustunlari, 3 endpoint, har qism qayerda turadi | o'z loyihasiga ko'chirish |
| 5 | Animatsiya va mikrointeraksiyalar | transform, transition, rang, Motion, ortiqcha harakat | **C** html+css + rasm: tugma (hover: scale + rang, transition 0.2s) va kartochka kirishi | compiler'da aniq ko'rinadi (darsda ham HtmlCompiler) |
| 7 | MVP ishlab chiqish — 1-qism | talabning 3 qismi, agent | **V** URL/skrinshot: birinchi ekran ishlaydi (telefon o'lchamida) | darsning natijasi |
| 9 | MVP ishlab chiqish — 2-qism | ikki telefon (409), ega sahifasi, token, deploy | **V** URL: deploy + ega sahifasi faqat token bilan ochiladi | darsning natijasi |
| 11 | Fidbek bo'yicha iteratsiya | SINOV.md, eng muhim muammo → talab → tuzatish | **V** repo URL: SINOV.md + tuzatish commit'i + qayta sinov qatori | sikl uyda yopiladi |

### M10 «Gipotezani tekshirish» — 6 dars (3 Kod + 3 Praktika)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 2 | O'z event-tracking tizimim | har harakat → hodisa → jadval; `saqla(...)` | **C** html+js + rasm: 3 tugma bosilsa hodisa (nom, vaqt) massivga yoziladi, jadval va sanoq yangilanadi | mantiq compiler'da to'liq sinaladi |
| 3 | Jonli mini-dashboard | sanoq, yangilanish, dashboard | **V** URL/skrinshot: o'z loyihasida 3 raqamli dashboard | darsning natijasi |
| 5 | Kiberxavfsizlik asoslari: 2FA, SQL injection, XSS | SQL injection, XSS, kodda maxfiy kalit, parametrli so'rov, 2FA | **T** 5 kod-o'qish: «qaysi qator zaif?», «qaysi tuzatish to'g'ri?» (uch zaiflik + parametr + 2FA) | SQL qismi compiler'da yurmaydi; kod-o'qish hammasini qamraydi |
| 7 | Production-deploy: domen, SSL va monitoring | domen, SSL, Render, Neon, UptimeRobot | **V** skrinshot: `https://` sayt + UptimeRobot monitori «Up» | real prod belgilari |
| 8 | Production darajasiga — 1-qism | so'rovlar chegarasi (429), kutish/xato holatlari | **V** repo URL + skrinshot: chegaradan oshganda 429 va ilovada tushunarli xabar | darsning natijasi |
| 9 | Production darajasiga — 2-qism va code review | PR, izoh va javob | **V** PR linki: ochilgan PR + 1 izohga javob commit'i | GitHub PR — o'zi isbot |

### M11 «Final loyiha» — 7 dars (3 Kod + 4 Praktika). Ip: o'quvchining final loyihasi (PRD → roadmap)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 7 | Figma o'rniga jonli prototip | ekranlar, wireframe, prototip, talab; HtmlCompiler | **C** html + rasm: o'z ilovasining 3 ekranli bosiladigan prototipi (link bilan ekran almashadi) | darsdagi QKod'ning davomi |
| 8 | Arxitektura, stek va platforma tanlovi | trek tanlovi, Backend/Database chizmasi | **T** 5 faktli: «kamera/push/offline kerak → qaysi?» + **qaror** README'da | trek keyingi darslarni belgilaydi |
| 9 | React Native'ni yangilash va Expo | Expo, telefonda prototip (390/900 px) | **V** Expo Go/Snack linki: prototip telefonda ochiladi | darsning natijasi |
| 10 | Vibe-coding: poydevor — baza, avtorizatsiya, deploy | Database, kirish (token), deploy | **V** URL: ilova manzili ochiladi, kirish ishlaydi | darsning natijasi |
| 11 | Vibe-coding: 1-funksiya | roadmap'dagi 1-funksiya | **V** URL + skrinshot: 1-funksiya ishlaydi | har funksiya — alohida isbot |
| 12 | Vibe-coding: 2-funksiya | ruxsat, tashkilotchi ekrani | **V** URL + skrinshot: 2-funksiya | ↑ |
| 14 | Vibe-coding: 3-funksiya | o'yin to'ldi (409) | **V** URL + skrinshot: 3-funksiya + chekka holat xabari | ↑ |

### M12 «Real vaqt» — 4 dars (2 Kod + 2 Praktika)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 2 | WebSocket: real vaqt asoslari | so'rov/javob vs ochiq ulanish, konvert, tinglovchi (QKod), ulanish belgisi | **V** repo URL: A2 «sxema README'da» (MD: «vaqt qolmasa — uyga vazifa») + ikki oynada son o'zi yangilanadi skrinshoti | MD'ning o'zi shuni uyga vazifa deb belgilagan |
| 4 | Jonli bildirishnomalar va presence | ikki telefon, xona | **V** skrinshot/video: 2 qurilmada jonli xabar | darsning natijasi |
| 5 | «Buz va tuzat»: ulanish uzilishi va reconnect | buzamiz → qayta ulanish, buzish yozuvi | **V** repo URL: buzish yozuvi + qayta ulanish commit'i | sikl uyda yopiladi |
| 9 | Real vaqt retention-mexanikasi | eslatma, qulf ekrani | **V** skrinshot: eslatma keladi va bosilsa ilova ochiladi | darsning natijasi |

### M13 «O'sish va monetizatsiya» — 5 dars (1 Kod + 4 Praktika)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 3 | Webhook va to'lovning ichki tuzilishi | to'lov xizmati → `POST /tolov/webhook`, Pro muddati; real pul yo'q | **C** js: `handleWebhook(event)` — takroriy xabar ikki marta yozilmaydi, status tekshiriladi; kutilgan konsol chiqishi | mantiq compiler'da sinaladi |
| 5 | To'lov integratsiyasi + «to'lovni buz» | mashq to'lov, buzish yozuvi | **V** skrinshot: test to'lovdan keyin Pro ochildi + buzish yozuvi | darsning natijasi |
| 8 | Retention-mexanikalar | Telegram eslatma, Backend | **V** skrinshot: eslatma keladi | ↑ |
| 10 | Growth: referal tizim | havola → lending → Backend `oyinchilar` → mukofot | **V** URL: taklif havolasi + mukofot qo'shilgan skrinshot | ↑ |
| 12 | Sayqallash va barqarorlashtirish | besh tekshiruv, faqat topilma | **V** repo URL: 5 tekshiruv natijasi README'da + 1 tuzatish | ↑ |

### M14 «Bitiruvchi va mahsulot tezligi» — 4 dars (3 Kod + 1 Praktika)
| # | Dars | Darsda | Tavsiya | Nega |
|---|---|---|---|---|
| 3 | Performance: mahsulot tezligi | Lighthouse, chegaralar, tuzatish tanlash | **V** 2 skrinshot: o'z saytida Lighthouse oldin/keyin + qaysi tuzatish | haqiqiy o'lchov |
| 4 | Final sayqal: demo uchun animatsiyalar | oldin/keyin, harakatni kamaytirish | **V** URL: demo yo'li 3 bosishda | darsning natijasi |
| 6 | Mahsulot demosiga tayyorgarlik | ssenariy, risklar, namuna akkaunt, uyg'otish, B reja, teg | **V**: B reja — zaxira video linki + namuna akkaunt bilan kirish ishlaydi + repo teg | demo kuni buzilmasligi uchun |
| 9 | Video-portfolio | ssenariy, yozish, tekshirish, havola | **V** video linki (3 daqiqagacha) | darsning natijasi — link |

### Jami tavsiya (3–14-M, 90 dars; skript bilan sanaldi)
**T** — 18 · **C** — 14 · **C+A** — 3 · **V** — 55. (M2 — foydalanuvchi qarori: T 1 · C 3 · C+A 2 · V 3 + 2 tavsiya V.)
V ko'p — chunki 6-moduldan keyin ish server/bot/mobil/o'z loyihasida; 1-bo'lim 5-savolga «ha» bo'lsa, ularning
bir qismi **A** (LMS terminal) ga o'tadi.

## ✅ Ko'rik javoblari (19.10 kech, foydalanuvchi) — 6 ochiq savol yopildi
1. RU tarjima — **ha**, qurishda uz + ru.
2. 2-5 Takrorlash login rasmi — **o'zim tanlayman**: haqiqiy login sahifa skrinshoti.
3. Antigravity o'rniga «Gemini / Copilot» — **ha**.
4. 9–10-modul «darsda Maydon, uyda o'z MVP» — **ha**.
5. LMS nomi — **LMS'da nomni darsga moslaymiz** (4-8, 6-11); dars mazmuni o'zgarmaydi.
6. Test soni — **5 savol qolsin** (3+1 ga o'tkazilmaydi).
