# 12-Modul · 5-dars «Ulanish uzilsa: buzamiz va tuzatamiz» — MD v3 (yangi dars, TEX)

Fayl: `src/10-Modull/BreakAndFixLesson.jsx` (kalit `m10-05`, App.jsx `type: 'Kod'`) · **19 ekran** (14 dars ekrani + 2 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, keyssiz (Qaror-0 22). Qolip: texnik dars (QKirish, QReja, QTushuncha, QTest, QKod, QMustaqil, QTartib) + 2 amaliyot bloki (QBlok). Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx `m10-05`): «Ulanish uzilsa: buzamiz va tuzatamiz» · osti «uzilish, takror hodisa, qayta ulanish — uchta muammo» ·
oldingi `m10-04` «Loyiha kuni: jonli xabar va eslatma» · keyingi `m10-06` «Birinchi foydalanuvchilar sizni qayerdan topadi?».
Namuna (tuzilish, hajm): pilot `02-WebSocketBasics-v3.md` (TEX tuzilishi, sahna, ulanish belgisi, kod oynasi `ulanish`) · 10-Modul `05-SecurityBasics-v3.md` + `05-FILTR.md` (o'z ishini tekshirish darsi, himoya chegarasi) · 11-Modul `09-ExpoPrototype-v3.md` + `09-FILTR.md` (kafolatsiz so'zlar, holatga qarab yakun) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul «C» 19–31, majburiy): kartochkalar alohida ekran · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · telefon maketi chapda, o'lchami barqaror · ≤3 blok · bo'sh ustun yo'q · yakuniy holat ixcham · ko'p elementli mashq ketma-ket · stilsiz element yo'q.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 3-ekran **C** · 5-ekran **A** · 7-ekran **D** · 10-ekran **B** · 13-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — 0–1 ≈ 6 · 2–7 ≈ 20 · 8 (kod oynasi) ≈ 8 · 9–13 ≈ 14 · A1 ≈ 20 · A2 ≈ 17 · podium, kartochkalar, yakun ≈ 5. Ulgurmagan o'quvchi yo'li — A-bo'lim 11-band. 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas (05-FILTR 36; tayanch 9.34 i).
⚠️ **GATE M da birinchi ko'riladigan savol — TAYANCHGA SAVOL 1** (3-usul: Render Root Directory `backend` bo'lgani uchun `backend/` dan tashqaridagi push Backend'ni qayta chiqarmaydi).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.5):** dars oxirida o'quvchi o'z ilovasini (web-trekda — saytini) **uch usul bilan buzib** ko'rgan va har urinishni **buzish yozuvi** bilan yozgan; «buzildi» chiqqan urinishlar agentga **yozuv bilan** berilgan,
   tuzatilgan va **o'sha usul bilan qayta tekshirilgan**; repo'da `BUZISH.md`. «Buzilmadi» ham natija — yakun sarlavhasi holatga qarab (18-ekran).
   Saqlanadi: `pm-m10d5-buzish` = `{ urinishlar: [{ usul: 'internet' | 'fon' | 'versiya', qildim, kutdim, boldi, buzildi: bool | null, tuzatildi: bool, qayta: 'takrorlanmadi' | 'takrorlandi' | null }] }` (tayanch 8; `buzildi` A1 dan oldin `null` — TAYANCHGA SAVOL 8).
   O'qiladi: `pm-m10d3-talab` (`chekka` — «nima kutaman» uchun, `buzilmasin` — A2 qavsi uchun) · `pm-m9d8-platforma.trek`.
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`: `m12-dars-05-start` (= `m12-dars-04-done`; README'da eslatma «bu holatda uch muammo bor — 5-darsda topiladi», tayanch 3) → `m12-dars-05-done`.
2. **Bugungi asosiy fikr (P-013):** Agentning «bajardim» degani — da'vo: chekka holatni o'zingiz buzib ko'rasiz, tuzatilgach o'sha usul bilan qayta tekshirasiz.
3. **Oldingi darslardan keladigan narsa (tayanch 1.2–1.4, 9-bo'lim; pilot 02):**
   - 2-dars: **doimiy ulanish** (WebSocket, socket.io), **ulanish belgisi** «Ulangan» · «Ulanmoqda…» · «Ulanmagan», **tinglovchi** (`ulanish.on(…)`), kod oynasidagi `korsat()` va `sora()`; uzilish paytida bo'lgan hodisa kelmasligi (2-dars 10, 11-ekranlar).
   - 3-dars: **real vaqt talabi**; `oyin-ozgardi` — `{ oyinId, sabab }`, ilova `GET /oyinlar` ni qayta so'raydi; **Mentor talabining uch chekka holati (so'zma-so'z, tayanch 1.3):**
     1) «Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.» · 2) «Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.» · 3) «Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.»
     3-darsdagi tekshirish usuli: agent o'zi ochgan tekshiruv akkauntidan `POST /oyinlar/1/qoshilish` so'rovini yuboradi va qaysi akkaunt, qaysi `id` ekanini aytadi; agent yaratgan akkaunt va yozuvlar aytgan `id` lari bo'yicha o'chiriladi (11-Modul 9.92, tayanch 9.35).
     3-dars qoidasi: «Yozilgan talab — bajarilgan ish emas» — chekka holatlarni buzib tekshirish bugungi darsning ishi (tayanch 1.3 oxiri).
   - 4-dars: **xona** `oyin-{id}` — ilova «O'yin» ochilganda kiradi (`oyin-ochildi`), yopilganda chiqadi (`oyin-yopildi`); Backend xonaga `korayotganlar-ozgardi` (`{ oyinId, soni }`) yuboradi; **«Hozir ko'ryapti: N»** — ochiq ekranlar (ulanishlar) soni, odamlar emas;
     **jonli xabar** — o'ziga tegishli o'yin uchun, o'z harakati uchun chiqmaydi; matn (so'zma-so'z): «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10».
   - 11-Modul: Render (Root Directory `backend` — 11-Modul tayanchi 9.6, 10-dars), Expo Go, `npx expo start`, terminalda `r`, pastga tortib yangilash (web-trekda «Yangilash» tugmasi), token, `.env`, Antigravity.
4. **Mazmun (tayanch 1.5 — aynan):**
   - **Dars g'oyasi:** talabda yozilgan uch chekka holat endi **buzib tekshiriladi**: agentning «bajardim» degani — da'vo; isbot — o'quvchi o'zi buzib ko'rgani va tuzatishdan keyin **o'sha usul bilan qayta tekshirgani**.
   - **Uch buzish usuli** (hamma o'quvchi uchun bir xil; o'z ilovasida): 1) **internetni uzish** — telefonda uchish rejimi yoqiladi; belgi «Ulanmoqda…» bo'lgach boshqa akkaunt (sherik, web-trekda — o'quvchi kompyuterdagi yashirin oynada, yoki agent) o'zgarish qiladi; keyin uchish rejimi o'chiriladi (qat'iy soniya yo'q — 05-FILTR 6) ·
     2) **ilovani fonga olib qaytarish** — boshqa ilovaga o'tib, bir daqiqadan keyin qaytish · 3) **Backend'ning yangi versiyasi** — Render yangi versiyani ishga tushirganda ulanish uziladi
     (⚠️ darsda Render'da qo'lda qayta chiqarish bilan — `backend/` ga push bo'lmagani uchun; TAYANCHGA SAVOL 1).
   - **Buzish yozuvi** (har urinishga uch qator): nima qildim · nima kutdim · nima bo'ldi → belgi **buzildi** / **buzilmadi**. Repo'da `BUZISH.md` (agent o'quvchi yozuvidan ko'chiradi).
   - **Mentor misolida topilgan uch muammo** (sabab va tuzatish — aynan):
     1) **Uzilish paytidagi o'zgarish ko'rinmaydi** — internet qaytgach belgi «Ulangan», lekin «8 / 10» eski (haqiqatda 9 / 10). Sabab: uzilish paytida yuborilgan hodisa keyin kelmaydi. Tuzatish: qayta ulanganda ro'yxat qayta so'raladi.
     2) **Qayta ulangandan keyin jonli xabar ikki marta chiqadi** — sabab: tinglovchi har ulanishda qayta qo'shilgan. Tuzatish: tinglovchi bir marta qo'shiladi.
     3) **Qayta ulangandan keyin «Hozir ko'ryapti» o'zini sanamaydi** — sabab: ulanish uzilganda Backend uni xonadan chiqaradi, yangi ulanish xonaga qayta kirmagan. Tuzatish: qayta ulanganda ochiq turgan o'yin xonasiga qayta kiradi.
   - **Qayta ulanish:** kutilmagan uzilishda (tarmoq, Backend'ning yangi versiyasi) socket.io ulanishni o'zi qayta tiklashga urinadi (birinchi urinish ≈1 soniyadan keyin, oraliq o'sib boradi, 5 soniyadan oshmaydi — rasmiy sukut qiymatlari); o'quvchi matnida — «odatda bir necha soniyada». **Takror hodisa** — bitta o'zgarish ilovaga ikki marta ta'sir qilishi.
   - **Natija so'zi:** «tuzatish qilindi» — kodda o'zgartirish qilindi (ish fakti; 05-FILTR 11 — «tuzatildi» belgisi o'rniga); isbot so'zi yo'q: «qayta tekshiruvda takrorlanmadi» / «qayta tekshiruvda yana buzildi». Uch muammo topilmasa — halol yozuv: «buzilmadi» ham natija; kamida uch usul bajarib ko'riladi.
   - **Mentor misolining buzish yozuvi** (bitta manba `MENTOR_YOZUV`; 9, 11-ekranlar, A1 va A2 kutilgan natijasi, A2 Yordami; qaysi usul qaysi muammoni ko'rsatgani — TAYANCHGA SAVOL 2):

   | Urinish | Nima qildim | Nima kutdim | Nima bo'ldi | Belgi | Tuzatishdan keyin |
   |---|---|---|---|---|---|
   | 1 · Internetni uzish | Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim. | Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi. | Belgi «Ulangan», lekin «8 / 10» qoldi. | buzildi | tuzatish qilindi · qayta tekshiruvda takrorlanmadi |
   | 2 · Fonga olib qaytarish | Boshqa ilovaga o'tdim; shu payt agent tekshiruv akkauntidan qo'shildi; bir daqiqadan keyin qaytdim. | Qaytganimda «9 / 10» ko'rinadi. | Qaytganimda «9 / 10», belgi «Ulangan». | buzilmadi | — |
   | 3 · Backend'ning yangi versiyasi | Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi. | Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2». | Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1». | buzildi | tuzatish qilindi · qayta tekshiruvda takrorlanmadi |

   Yozuv — Mentorning o'z matni (T-008: olam ichidagi matn, birinchi shaxsda). ⛔ Yozuv «qur» pilotida haqiqiy telefonda `m12-dars-05-start` bilan olinadi; natija boshqacha chiqsa (masalan, fonga olish ham buzsa) — yozuv, sahnalar va testlar haqiqiy natijaga moslanadi; o'quv muvozanati uchun natija tanlanmaydi (05-FILTR 1, 5; tayanch 9.37). Har urinishdan keyin agent o'z yozuvini `id` bo'yicha o'chiradi — keyingi urinish yana «8 / 10» dan boshlanadi (TAYANCHGA SAVOL 11).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **buzish** — ilovaning chekka holatini ataylab yuzaga keltirib tekshirish (2-ekran, harakatdan keyin). Dars atamasi: «buzamiz», «buzib ko'rasiz», «buzildi» / «buzilmadi», «buzish yozuvi» (TAQIQLAR 4 — ruxsat). Ishlatilmaydi: xaker, sindirish, «buzuq», «buzilgan» (sifat sifatida — o'rniga «buzildi» belgili urinish), «buzilgan ulanish» (→ «ulanish uzildi»).
   - **buzish yozuvi** — uch qator: nima qildim, nima kutdim, nima bo'ldi (9-ekran, harakatdan keyin). O'z ishini tekshirish — «tekshirish»; «sinov» bu darsda yo'q (real odam yo'q).
   - **usul** — buzish usuli (uchtasi: internetni uzish · fonga olib qaytarish · Backend'ning yangi versiyasi); **urinish** — bitta usulni bir marta bajarish va yozish.
   - **qayta ulanish** — uzilgan ulanishni qayta tiklash (4-ekran nom qatori). Ishlatilmaydi: reconnect.
   - **takror hodisa** — bitta o'zgarish ilovaga ikki marta ta'sir qilishi (4-ekran nom qatori). Ishlatilmaydi: dublikat, dubl.
   - **tuzatish qilindi** — kodda o'zgartirish qilindi (ish fakti) · **qayta tekshiruvda takrorlanmadi** / **qayta tekshiruvda yana buzildi** — o'sha usul bilan qaytarilgan urinish natijasi (11-ekran). «Isbotlandi», «endi ishlaydi» — yo'q.
   - **hodisa** — bu darsda faqat ulanish orqali yuboriladigan nomli xabar (`oyin-ozgardi`, `oyin-ochildi`, `korayotganlar-ozgardi`) (T-015). **`connect`** — socket.io'ning o'z nomi: ulanish ochilganda (birinchi marta va har qayta ulanishda) ishlaydigan joy;
     o'quvchi matnida «`connect` ichida», «`connect` ichidagi kod» deyiladi — «hodisa» deyilmaydi (Backend yubormaydi; TAYANCHGA SAVOL 4).
   - **tinglovchi** — hodisa kelganda ishlaydigan kod (`ulanish.on('oyin-ozgardi', …)`). **xona** — Backend'dagi ulanishlar guruhi (4-darsdan). **jonli xabar** — 4-darsdan; «xabar» bu darsda faqat shu birikmada (agentga — «yozing»).
   - **ulanish holatlari · ulanish belgisi** — 2-darsdan, yozuvlar «Ulangan» · «Ulanmoqda…» · «Ulanmagan». **chekka holat** — 3-darsdan. «holat» bu darsda faqat shu ikki birikmada va chekka holat matnidagi «yangi holat» da (tayanch 1.3 so'zma-so'z; TAYANCHGA SAVOL 15).
   - **yangi versiya** — Backend'ning Render'da qayta ishga tushirilgan nusxasi; **qo'lda qayta chiqarish** — Render sahifasida «Manual Deploy» → «Deploy latest commit» (render.com/docs/deploys, 06.10).
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **tekshiruv akkaunti** (agent tekshiruv uchun o'zi ochadi, namuna ma'lumot bilan; haqiqiy odamniki emas — tayanch 9.35) · **tekshirish** (o'z ishi).
   - **Ishlatilmaydi:** server (prozada), real-time, reconnect, event, listener, room, «status», «offline», «sinov» / «sinab ko'ring» (bu darsda real odam yo'q), «isbot» (natija ma'nosida — faqat «isbot emas» chegarasida), «Modul 12», A1/A2, `m10-05`.
6. **Mentor misolidagi raqamlar (tayanch 1.0, 1.4, 1.5 — aynan):** namuna o'yin **Shanba, 18:00 · Mahalla maydoni · 8 / 10** → «9 / 10» (kod oynasida «10 / 10» gacha); «Hozir ko'ryapti: 2» / «1»; fon — bir daqiqa (uchish rejimi — soniya bilan emas, belgi «Ulanmoqda…» bilan).
   Kutish vaqtlari (tayanch 9.19): uzilishni payqash — «bir daqiqagacha» · qayta ulanish — «odatda bir necha soniyada» · Render'da yangi versiya — «bir necha daqiqa cho'zilishi mumkin». Boshqa son yo'q; statistika deyilmaydi (T-043). Namuna o'yin `oyinId: 1` (tayanch 9.20, `NAMUNA_OYIN`).
7. **Metafora yo'q. Keyssiz** (TEX, Qaror-0 22). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: o'yinchi, tashkilotchi, sherik («1-telefon · siz» / «2-telefon · boshqa o'yinchi» — sahna yorliqlari).
8. **Xavfsizlik chegarasi (TAQIQLAR 2, 10-Modul 5-dars qoidasi):** «buzish» — faqat **o'z ilovasida**, faqat uch usul bilan (internetni uzish, fonga olish, yangi versiya). Boshqa odamning ilovasi yoki sayti tekshirilmaydi; hujum usuli, ortiqcha so'rovlar bilan «bosish», begona akkaunt — yo'q.
   O'zgarishni faqat **tekshiruv akkaunti** (agent) yoki sherik o'z akkauntida qiladi; haqiqiy foydalanuvchi akkauntidan foydalanilmaydi. Darsda ikki marta ko'rinadi: 9-ekran `QIzoh` va A1 1-qadam (qalin).
9. **Kod — kim nima yozadi:** A1 da **kod yozilmaydi** — agentga faqat boshqa akkaunt nomidan so'rov yuborish topshiriladi (tayanch 1.5). A2 da tuzatishni **agent** yozadi (talab + o'quvchining buzish yozuvi). **Tinglovchini `connect` dan tashqariga chiqarishni o'quvchi qo'lda yozadi** — kod oynasida (8-ekran), namuna `ulanish` obyekti bilan («haqiqiy Backend emas» — oynadagi izohda).
   React Native kodi darsda — o'qiladigan qisqa bo'lak (4-ekran kod kartasi) + telefon maketi; kod oynasida faqat brauzerda ishlaydigan JS. Har blokda mobil va web yo'li.
10. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, Backend tuguni, konvert, chiziq, yozuv kartasi — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida (pilot 02 bilan bir); logotip yo'q.
    Rang — faqat holat foni (D3): «Ulangan» — `ok`, «Ulanmoqda…» — `accent`, «Ulanmagan» — `ink2`; yozuvdagi «buzildi» — `err`, «buzilmadi» — `ink2`, «tuzatish qilindi» — `accent`, «qayta tekshiruvda takrorlanmadi» — `ok`, «qayta tekshiruvda yana buzildi» — `err`.
11. **Vaqt (90 daqiqa) va ulgurmagan yo'l:** taqsimot tepada. A1 3-usulda (Render qayta chiqarishi, bir necha daqiqa) kutish dars oqimini to'xtatmaydi: kutayotganda 1 va 2-urinish yozuvi o'qiladi (A1 3-qadam).
    Ulgurmasa: A1 dagi 3-usul — uyga vazifaning 1-bandi, 1 va 2-urinish bilan A2 ga o'tiladi; A2 dagi 3-usul qayta tekshiruvi — uyga; yozuv darsda saqlanadi. Yakun sarlavhasi holatga qarab (18-ekran). O'qituvchi eslatmasi 1-ekranda.
12. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 06.10.2026); o'quvchiga ko'rinmaydi. Qisqasi: `connect` birinchi ulanishda **va** qayta ulanishda ishlaydi; tinglovchini `connect` ichida qo'shmaslik kerak — har qayta ulanishda yangisi qo'shiladi;
    ulanish `id` si har qayta ulanishda yangilanadi; uzilganda ulanish hamma xonadan o'zi chiqadi, xona — faqat Backend tushunchasi; uzilishdagi hodisa qayta ulanganda kelmaydi («ko'pi bilan bir marta», Backend'da kutib turadigan xotira yo'q);
    qayta ulanish sukutda yoqilgan (1000 ms, ×2, ko'pi bilan 5000 ms, urinishlar soni cheksiz); Render: yangi versiya chiqqanda ulanishlar uziladi; Root Directory o'rnatilgan xizmat faqat shu papka ichidagi o'zgarishda qayta chiqadi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0). 4-dars oxirida ilova o'zi yangilanadi, «Hozir ko'ryapti» va jonli xabar bor; agent talabdagi uch chekka holatni «bajardim» degan.
  Bugun Mentor ilovani uch usul bilan buzadi, uch muammoni topadi, sababini ko'radi, tuzattiradi va o'sha usul bilan qayta tekshiradi. O'quvchi xuddi shuni o'z ilovasida qiladi (12-ekran, A1, A2).
- **Hook:** oddiy paytda hammasi ishlaydi (son o'zi yangilanadi, jonli xabar bir marta) → «uzilishda ham ishlashini qanday bilasiz?» → 2-ekranda internet uziladi va son eski qoladi → 4-ekranda qayta ulanish va ikki jonli xabar → 6-ekranda xonaga qaytmagan ulanish →
  8-ekranda tinglovchi qo'lda tuzatiladi → 9-ekranda uch usul va buzish yozuvi → 11-ekranda «tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» → 12-ekranda o'z kutishingiz → A1 (buzish) → A2 (tuzatish va qayta tekshirish).
- **Bitta vizual — real vaqt sahnasi (tayanch 9.16; bitta manba `SAHNA` + `NAMUNA_OYIN` + `MENTOR_YOZUV`, 163/180):**
  - **chapda «1-telefon · siz»** (ramka ≈170×272, o'lcham barqaror — SABOQ 22; yorliq ramka ustida — SABOQ 23): «Maydon Jamoa» nomi o'z rangida; «O'yin» ekrani — tepada **ulanish belgisi** (nuqta + yozuv) · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Hozir ko'ryapti: N» · «Qo'shildingiz» (siz qo'shilgansiz);
    tepada **jonli xabar** joyi (ilova ekrani ustida, bir necha soniya). Holat qatorida samolyot belgisi (uchish rejimi).
  - **o'rtada Backend tuguni** — «Backend»; ichida «Database: 8» va (6-ekranda) «Xona `oyin-1`: N»; 4, 6-ekranlarda ichida sahna tugmasi **«Yangi versiya»**.
  - **o'ngda «2-telefon · boshqa o'yinchi»** — o'sha «O'yin» ekrani yoki «O'yinlar» ro'yxati.
  - **chiziq** telefon ↔ Backend: ochiq (sekin yonadi) · uzilgan (uzuq, kulrang, boshida ↻) · tiklangan. **konvert** — hodisa (`oyin-ozgardi`, `oyin-ochildi`, `korayotganlar-ozgardi` yorlig'i); uzilgan joyda so'nsa — yorliq «kelmadi».
  - **buzish yozuvi kartasi** (9, 11-ekranlar, bloklarning o'ng tomoni) — uch qator yorlig'i «Nima qildim» · «Nima kutdim» · «Nima bo'ldi» va belgi joyi; bitta telefonli ekranda telefon chapda, karta o'ngda (≤3 blok).
  - Son almashganda bir lahza kattalashib qaytadi; eski son yonida kulrang yorliq «eski». `prefers-reduced-motion` da konvert yurmaydi, chiziq miltillamaydi — holatlar bir zumda almashadi (DE-200).
  - Ishlatilishi: 0 (ikki telefon + agent pufagi) · 1 (bo'sh yozuv kartasi) · 2 · 4 (+ kod kartasi) · 6 (+ xona qatori) · 9, 11 (bitta telefon + yozuv kartasi) · A1, A2 kutilgan natija.
- **Yakun:** ilovangiz uch usul bilan buzib ko'rilgan, yozuv `BUZISH.md` da, topilgan muammolar tuzatilgan va qayta tekshirilgan · keyingi dars — birinchi foydalanuvchilar qayerdan keladi.

---

## 0 · Kirish — agent «bajardim» dedi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Ulanish uzilsa ham ishlashini qanday bilasiz?** (45)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida agent talabdagi uch chekka holatni «bajardim» dedi — ikkinchi telefonda «Qo'shilaman» ni bosing.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket (chap): ikki telefon yonma-yon, bir balandlikda — «1-telefon · siz» va «2-telefon · boshqa o'yinchi»; ikkalasida «O'yin» ekrani: belgi «Ulangan» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Hozir ko'ryapti: 2»;
  1-telefonda tugma o'rnida «Qo'shildingiz», 2-telefonda «Qo'shilaman» (halqada). Telefonlar ustida bitta chat pufagi (Antigravity, T-008): «Tayyor! Talabdagi uchala chekka holatni bajardim.»
- **Harakat → Vizual o'zgarish:** «Qo'shilaman» (2-telefon) → 2-telefonda «9 / 10», «Qo'shildingiz»; konvert Backend tomondan 1-telefonga keladi → 1-telefonda «8 / 10» → «9 / 10» (bir lahza kattalashib qaytadi) va tepada jonli xabar **bir marta**:
  «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» (bir necha soniyadan keyin yo'qoladi). Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz):
  - Hozir ishladi — uzilishda ham ishlaydi (38)
  - ✔ Internetni o'zim uzib, natijaga qarayman (40)
  - Agent «bajardim» dedi — shuning o'zi yetadi (43)
- Javob — 2-variant: **Aynan!** Chekka holat oddiy paytda ko'rinmaydi. Uni o'zingiz yuzaga keltirasiz va nima bo'lganiga qaraysiz. (105)
- Javob — 1-variant: **Qiziq fikr!** Hozir internet bor edi. Talabdagi chekka holat esa uzilishda bo'ladi — uni hali hech kim ko'rmadi. (110)
- Javob — 3-variant: **Qiziq fikr!** Agentning «bajardim» degani — da'vo. Natijani o'zingiz ko'rmaguningizcha, u tekshirilmagan. (103)
- Javobdan keyin: agent pufagi ostida kulrang yorliq «da'vo · tekshirilmagan» paydo bo'ladi. Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): talabdagi chekka holat va agentning «bajardim» degani. Oddiy holat ataylab ishlaydi (10-Modul 5-dars hook naqshi: «oddiy ma'lumot bilan ishlaydi»). Uch variant 38–43 belgi; hook javobi Mentor gapida aytilmagan (P-016).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun ilovangizni buzib ko'rasiz va tuzatasiz.** (46)
- Mentor: Avval Maydon Jamoa'da uch muammoni topib, sababini ko'rasiz. Keyin xuddi shuni o'z ilovangizda qilasiz.
- Chap — «Dars oxirida»: buzish yozuvi kartasi — uch qator, har birida usul nomi («Internetni uzish» · «Fonga olib qaytarish» · «Backend'ning yangi versiyasi») va belgi joyi (uzuq chiziqli, bo'sh — U-041: bugun to'ladigan joy);
  ostida kichik qator «`BUZISH.md`». Bir marta o'zi yuradi (DE-200): qatorlar navbat bilan chiqadi.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` so'zlari bilan — P-015):
  - 01 · Internet uzilganda nima ko'rinmay qolishini topish · `uzilish`
  - 02 · Bitta o'zgarish nega ikki marta chiqishini bilish · `takror hodisa`
  - 03 · Qayta ulangan ilova o'yin xonasiga qaytishi · `qayta ulanish`
  - 04 · O'z ilovangizni buzish, tuzatish va qayta tekshirish · `uchta muammo`
- Pastki qator (mono, kichik): o'z repo'ngiz — `BUZISH.md` va tuzatishlar · Mentor misoli `maydon-jamoa` · boshlanish `m12-dars-05-start` · namuna `m12-dars-05-done`
- Qator (`QIzoh`, pastki qator ostida, bitta): Mentor misolida `m12-dars-05-start` — agent «bajardim» deganidan keyingi kod; muammolar shu darsda topiladi. (108)
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: og'ir qismlar — 8-ekran (kod oynasi) va ikki blok (Render'da qayta chiqarish bir necha daqiqa olishi mumkin). 2, 4, 6-ekranlarga ortiqcha vaqt bermang. Juftlikda ishlash qulay: sherik telefonida ham shu ekran ochiq tursa, «Hozir ko'ryapti» tekshiriladi.
  Qayta ulanish raqamlari (o'quvchi so'rasa): socket.io birinchi urinishni ≈1 soniyadan keyin qiladi, har urinishda kutish ikki barobar o'sadi, lekin 5 soniyadan oshmaydi; urinishlar soni sukutda cheklanmagan (Manbalar 4). Darsda — «odatda bir necha soniyada».

## 2 · Internet uzilsa  ← QTushuncha (bashorat + 3 qadam)
- Eyebrow: Tushuncha · uzilish
- Sarlavha: **Internet qaytgach, ekranda qaysi son turadi?** (44)
- Mentor: Birinchi telefonda uchish rejimini yoqing va qadamlarni tartib bilan bajaring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **Belgi yana «Ulangan» bo'lgach, birinchi telefonda qaysi son turadi?** · «8 / 10» · «9 / 10»
- Sahna: 1-telefon — «O'yin»: belgi «Ulangan», «8 / 10», holat qatorida samolyot (halqada) · Backend («Database: 8») · 2-telefon — «O'yin», «8 / 10», «Qo'shilaman».
  Qadam belgilari (tugma yonida, SABOQ 21): 1 Uchish rejimini yoqing · 2 Ikkinchi telefonda qo'shiling · 3 Uchish rejimini o'chiring.
- **Harakat → Vizual o'zgarish:**
  1. Samolyot (1-telefon) → chiziq uziladi (uzuq, kulrang), belgi «Ulanmoqda…» (accent nuqta, yengil pulsatsiya), uzilgan chiziq boshida ↻. 2-telefondagi «Qo'shilaman» halqaga o'tadi.
  2. «Qo'shilaman» (2-telefon) → 2-telefonda «9 / 10», «Database: 8» → «9»; Backend'dan konvert `oyin-ozgardi` uzuq chiziqqa chiqadi va uzilgan joyda so'nadi — yonida yorliq «kelmadi». 1-telefonda «8 / 10». Samolyot yana halqada.
  3. Samolyot (o'chirish) → ↻ chiziqni tiklaydi (sahnada ≈2 s) → belgi «Ulangan»; 1-telefonda «8 / 10» qoladi, yonida kulrang yorliq «eski», Backend ichidagi «Database: 9» bir lahza yonadi — farq ko'rinadi.
- Nom qatori (3/3 dan keyin, bitta): Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish — buzish.
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: «8 / 10» — eski son» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda uzilish paytida yuborilgan hodisa keyin kelmadi: belgi «Ulangan», son esa eski. (90)
- Qator (`QIzoh`, xulosadan keyin, bitta): Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi. (62)
- Tugadi (199): qadam belgilari yopiladi, sahna butun enga; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
✎ 2-darsda (10-ekran) uzilishdagi hodisa kelmasligi ko'rilgan; bugungi yangilik — talabdagi 1-chekka holat bajarilmagani (belgi «Ulangan», son eski) va tuzatishi. T-011: buzish sahnada → atama «buzish».
  Tuzatish qatori — tayanch 1.5 so'zi («qayta ulanganda ro'yxat qayta so'raladi»), «Backend'dan» aniqlik uchun qo'shildi. Mentor 1-muammoni internetni uzib topgan — 9-ekran yozuvi bilan bir.

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **Internet qaytdi, belgi «Ulangan», son esa eski. Nega?** (8 so'z)
  - Backend qo'shilishni hali yozmagan edi
  - Ilova hodisani ikki marta sanagan edi
  - ✔ Uzilishdagi hodisa keyin kelmagan edi
  - Belgi ulanishni xato ko'rsatgan edi
- Kalit: **C** (index 2). To'rttalasi «… edi» shaklida; uzunlik — skript o'lchovi (O'lchov bo'limi).
- To'g'ri izohi: Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi — qayta ulangach ham u kelmaydi.
- Xato izohlari (≤60):
  - A: Sahnada «Database: 9» edi — qo'shilish yozilgan. (48)
  - B: Ikki marta sanash uchun hodisa avval kelishi kerak. (51)
  - D: Ulanish haqiqatan tiklangan — belgi to'g'ri edi. (48)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Qayta ulanish  ← QTushuncha (bashorat + 2 qadam; kod kartasi)
- Eyebrow: Tushuncha · qayta ulanish
- Sarlavha: **Qayta ulanganda qaysi kod yana ishlaydi?** (40)
- Mentor: Backend tugunidagi «Yangi versiya» ni bosing va telefon ostidagi kodning yonadigan qatorlariga qarang.
- Bashorat (ballsiz; tanlangach ixcham qator): **Qayta ulangach, bitta qo'shilishga nechta jonli xabar chiqadi?** · Bitta · Ikkita · Uchta (S-015: bir o'lchov, o'sish tartibida)
- Chap — 1-telefon («O'yin»: belgi «Ulangan», «8 / 10»). Telefon **ostida** kod kartasi (o'qish uchun, qisqartirilgan — P-065), yorlig'i «Mentor ilovasi · `m12-dars-05-start`»:
  ```ts
  ulanish.on('connect', () => {
    ulanish.on('oyin-ozgardi', () => {
      korsat();
      jonliXabar();
    });
  });
  ```
  Karta ostida kichik hisoblagich: «Tinglovchilar: 1».
- O'rtada Backend («Database: 8»; ichida tugma «Yangi versiya» — halqada) · o'ngda 2-telefon («O'yin», «Qo'shilaman»). Qadam belgilari: 1 Yangi versiya · 2 Ikkinchi telefonda qo'shiling.
- **Harakat → Vizual o'zgarish:**
  1. «Yangi versiya» → Backend tugunida bir qator «yangi versiya ishga tushmoqda…» → ikkala chiziq uziladi; 1-telefonda belgi «Ulanmoqda…», chiziq boshida ↻ va urinish nuqtalari — har biri oldingisidan biroz kechroq yonadi →
     yangi versiya tayyor → chiziq tiklanadi, belgi «Ulangan»; kod kartasida `ulanish.on('connect', …)` qatori yonadi → ichidagi `ulanish.on('oyin-ozgardi', …)` qatori yonadi → hisoblagich «Tinglovchilar: 1» → «2» (kattalashib qaytadi).
     Nom qatori 1 (bitta): Uzilgan ulanishni qayta tiklash — qayta ulanish: socket.io bunga o'zi urinadi, odatda bir necha soniyada.
  2. «Qo'shilaman» (2-telefon) → konvert `oyin-ozgardi` 1-telefonga keladi → kod kartasida ichki tinglovchi ikki marta yonadi → 1-telefon tepasida jonli xabar **ikki marta**, ustma-ust: «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10».
     Nom qatori 2 (bitta): Bitta o'zgarish ilovaga ikki marta ta'sir qilishi — takror hodisa.
- Natija qatori: «Taxminingiz: … · haqiqatda: ikkita» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: `connect` ichidagi kod qayta ulanishda ham ishlaydi: tinglovchi uning ichida bo'lsa, yana bittasi qo'shiladi. (109)
- Qator (`QIzoh`, xulosadan keyin, bitta): Tuzatish: tinglovchi bir marta qo'shiladi — `connect` dan tashqarida. (69)
- Tugadi (199): qadam belgilari va «Yangi versiya» yopiladi, telefon (ikki jonli xabar) va kod kartasi fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ «Yangi versiya» — sahna tugmasi (Render yangi versiyani ishga tushirganda ulanish uziladi — render.com/docs/websocket); haqiqiy Backend'da bunday tugma yo'q. Urinish nuqtalarida son yozilmaydi (aniq soniyalar O'qituvchi eslatmasida, 1-ekran).
  Kod kartasi — Mentor ilovasining qisqartirilgan bo'lagi: `korsat()`, `jonliXabar()` — o'qish uchun nomlar (kod oynasidagi nomlar bilan bir; TAYANCHGA SAVOL 6). 2-telefon ham qayta ulanadi, lekin u o'z harakati — unda jonli xabar chiqmaydi (tayanch 1.4).
  Mentor 2-muammoni yangi versiya bilan topgan — 9-ekran yozuvi bilan bir. Kod kartasi uchinchi blok emas — telefon bilan bitta ustun (pilot 02 7-ekran naqshi).

## 5 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Mentor misolida qayta ulangach jonli xabar ikki marta chiqdi. Nega?** (10 so'z)
  - ✔ Tinglovchi har ulanishda yana qo'shilgan
  - Backend bitta hodisani ikki marta yuborgan
  - Ikkinchi telefon tugmani ikki marta bosgan
  - Ilova ikkita alohida ulanish ochib qo'ygan
- Kalit: **A** (index 0). To'rttalasi «… -gan» shaklida, «ikki» so'zi uch variantda (shakl-telli yo'q).
- To'g'ri izohi: `connect` qayta ulanishda ham ishlaydi — ichidagi tinglovchi har safar yana qo'shiladi.
- Xato izohlari (≤60):
  - B: Sahnada Backend'dan nechta konvert chiqdi? (42)
  - C: Ikkinchi telefonda bitta bosish bo'ldi — konvert ham bitta. (59)
  - D: Muammo ulanishlar sonida emas — tinglovchi qayta qo'shilgan. (60)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 6 · Xonaga qaytish  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · xona
- Sarlavha: **Qayta ulangan ilova o'yin xonasida bormi?** (41)
- Mentor: Avval «Yangi versiya» ni bosing, keyin ikkinchi telefonda o'yinni oching.
- Bashorat (ballsiz; tanlangach ixcham qator): **Ikkinchi telefon o'yinni ochganda «Hozir ko'ryapti» nechani ko'rsatadi?** · 0 · 1 · 2
- Sahna: 1-telefon — «O'yin» ochiq: belgi «Ulangan», «8 / 10», «Hozir ko'ryapti: 1» · Backend: «Database: 8» va ikkinchi qator «Xona `oyin-1`: 1» (ichida bitta nuqta — 1-telefon ulanishi) · 2-telefon — «O'yinlar» ro'yxati («Shanba, 18:00» kartasi).
  Qadam belgilari: 1 Yangi versiya · 2 Ikkinchi telefonda o'yinni oching.
- **Harakat → Vizual o'zgarish:**
  1. «Yangi versiya» → chiziqlar uziladi; Backend xona qatoridagi nuqta xonadan chiqib ketadi: «Xona `oyin-1`: 0»; 1-telefon belgisi «Ulanmoqda…» → ↻ → «Ulangan» — yangi ulanish Backend tuguniga keladi, lekin xonadan **tashqarida** turadi (xona qatori «0» qoladi).
     1-telefonda «Hozir ko'ryapti: 1» qoladi. «Shanba, 18:00» kartasi (2-telefon) halqaga o'tadi.
  2. «Shanba, 18:00» (2-telefon) → «O'yin» ekrani ochiladi → konvert `oyin-ochildi` Backend'ga → xona qatori «1» (faqat 2-telefon nuqtasi) → konvert `korayotganlar-ozgardi` faqat xonaga → 2-telefonda «Hozir ko'ryapti: 1» — ikkala telefonda o'yin ochiq bo'lsa ham.
     1-telefondagi «Hozir ko'ryapti: 1» yonida kulrang yorliq «eski» — u xonada yo'q, yangi son unga kelmaydi.
- Natija qatori: «Taxminingiz: … · haqiqatda: 1» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Uzilganda ulanish xonadan chiqdi; bu misolda qayta ulangan ilova xonaga o'zi qaytib kirmadi. (92)
- Qator (`QIzoh`, xulosadan keyin, bitta): Tuzatish: qayta ulanganda ilova ochiq turgan o'yin xonasiga qayta kiradi. (73)
- Tugadi (199): qadam belgilari yopiladi, ikki telefon va xona qatori fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ socket.io: «Upon disconnection, sockets leave all the channels they were part of automatically»; xona — «server-only concept» (Manbalar 3). Bu misolda ilova xonaga faqat «O'yin» ochilganda (`oyin-ochildi`) kiradi (tayanch 1.4) — qayta ulanishda bu xabar ketmagan.
  «Hozir ko'ryapti» — ochiq ekranlar (ulanishlar) soni; 1-telefonniki eski — u xonada yo'q. Mentor 3-muammoni yangi versiya bilan topgan (9-ekran yozuvi). Uch blok: 1-telefon · Backend · 2-telefon (xona qatori Backend ichida).

## 7 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **Qayta ulangach «Hozir ko'ryapti» ekraningizni sanamadi. Nega?** (7 so'z)
  - Backend uzilgan ulanishni xonada qoldirgan
  - Ilova qayta ulangach o'yin ekranini yopgan
  - Ikkinchi telefon o'yin xonasidan chiqqan
  - ✔ Yangi ulanish o'yin xonasiga kirmagan
- Kalit: **D** (index 3). To'rttalasi «… -gan» shaklida; «xona» so'zi uch variantda.
- To'g'ri izohi: Uzilganda ulanish xonadan chiqadi; bu misolda yangi ulanish xonaga o'zi kirmaydi.
- Xato izohlari (≤60):
  - A: Uzilganda ulanish xonadan o'zi chiqadi. (39)
  - B: Sahnada o'yin ekrani ochiq turgan edi. (38)
  - C: Ikkinchi telefon xonaga endi kirdi — u sanaldi. (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · Tinglovchi bir marta  ← QKod
- Eyebrow: Kod yozish · tinglovchi
- Sarlavha: **Tinglovchini bir marta qo'shadigan kod yozamiz.** (47) — §19 sarlavha oilasi
- Mentor: Agent tinglovchini `connect` ichiga yozgan. Uni tashqariga chiqaring — `connect` ichida faqat qayta so'rash qolsin.
- Chap — vazifa (3 band):
  1. `ulanish.on('oyin-ozgardi', …)` ni `connect` ichidan tashqariga chiqaring — u bir marta qo'shilsin.
  2. `connect` ichida faqat `korsat()` tursin — qayta ulanganda son qayta so'ralsin.
  3. Natija oynasida: «Internetni uzish» → «Boshqa o'yinchi qo'shildi» → «Internetni qaytarish». Son «9 / 10» bo'lsin; yana «Boshqa o'yinchi qo'shildi» — bitta jonli xabar.
- Yordam: Ikki `ulanish.on` bir-birining ichida turmaydi: ikkalasi ham qatorning eng chap chetidan boshlanadi. Jonli xabar ikki marta chiqsa — `oyin-ozgardi` tinglovchisi hali `connect` ichida.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <p class="belgi">Ulanmoqda…</p>
    <div class="oyin">
      <p>Shanba, 18:00 · Mahalla maydoni</p>
      <p class="hisob"><span class="son">…</span> / 10</p>
    </div>
    <div class="xabarlar"></div>
    <button class="uzish">Internetni uzish</button>
    <button class="qaytar">Internetni qaytarish</button>
    <button class="boshqa">Boshqa o'yinchi qo'shildi</button>
    ```
  - `namuna.js` — tayyor, o'zgarmaydi (tepasida izoh ochiq):
    ```js
    // Backend va ulanish o'rnida NAMUNA (haqiqiy Backend emas):
    // son shu faylda turadi; uchta tugma internetni uzadi, qaytaradi va hodisa yuboradi.
    let qoshilgan = 8;
    let ulangan = false;
    function sora() {
      return qoshilgan;
    }

    const tinglovchilar = [];
    const ulanish = {
      on: function (nom, kod) {
        tinglovchilar.push({ nom: nom, kod: kod });
      },
    };
    function yubor(nom, malumot) {
      tinglovchilar.forEach(function (t) {
        if (t.nom === nom) t.kod(malumot);
      });
    }
    function ulan() {
      ulangan = true;
      document.querySelector('.belgi').textContent = 'Ulangan';
      yubor('connect');
    }

    document.querySelector('.uzish').addEventListener('click', function () {
      ulangan = false;
      document.querySelector('.belgi').textContent = 'Ulanmoqda…';
    });
    document.querySelector('.qaytar').addEventListener('click', function () {
      if (!ulangan) setTimeout(ulan, 1000);
    });
    document.querySelector('.boshqa').addEventListener('click', function () {
      if (qoshilgan >= 10) return;
      qoshilgan = qoshilgan + 1;
      if (ulangan) yubor('oyin-ozgardi', { oyinId: 1, sabab: 'qoshildi' });
    });

    setTimeout(ulan, 500);
    ```
  - `app.js` — boshlang'ich holat (agent yozgan kod; o'quvchi tuzatadi):
    ```js
    const son = document.querySelector('.son');
    const xabarlar = document.querySelector('.xabarlar');
    function korsat() {
      son.textContent = sora();
    }
    function jonliXabar() {
      const p = document.createElement('p');
      p.textContent = "Shanba, 18:00 — yana bir o'yinchi qo'shildi: " + sora() + ' / 10';
      xabarlar.appendChild(p);
    }
    korsat();

    // Agent yozgan kod: tinglovchi connect ichida qo'shilgan.
    ulanish.on('connect', function () {
      ulanish.on('oyin-ozgardi', function () {
        korsat();
        jonliXabar();
      });
    });
    ```
- Kod oynasi sarlavhasi: `app.js — tinglovchi bir marta, connect ichida qayta so'rash`
- Shart xabarlari (≤60):
  - 1 — `'oyin-ozgardi'` tinglovchisi bir marta qo'shilsin. (51)
  - 2 — Qayta ulangach son o'zi «9 / 10» bo'lsin. (41)
- **Harakat → Vizual o'zgarish:** boshlang'ich kodda: «Internetni uzish» → belgi «Ulanmoqda…»; «Boshqa o'yinchi qo'shildi» → ekranda hech narsa o'zgarmaydi (hodisa kelmadi); «Internetni qaytarish» → ≈1 s dan keyin «Ulangan», son «8 / 10» qoladi;
  yana «Boshqa o'yinchi qo'shildi» → son «10 / 10» va jonli xabar **ikki marta**. Tuzatilgach: qaytarishda son o'zi «9 / 10», keyingi qo'shilishda — bitta jonli xabar «… 10 / 10». Har shart bajarilganda ✓.
  Kod o'zgarsa natija oynasi boshidan ochiladi (yana «8 / 10»). «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Bu kodda tinglovchi bir marta qo'shiladi; `connect` esa har ulanishda sonni qayta so'raydi. (91)
- Qator (`QIzoh`, xulosadan keyin): Bu oynada `ulanish` — namuna: haqiqiy Backend emas, uzilishni tugma qiladi. (75)
✎ Bitta oynada ikki tuzatish (tayanch 1.5: «2-muammo va 1-muammoning kichik ko'rinishi»). `ulanish.on('connect', korsat)` ham, `function () { korsat(); }` ham qabul qilinadi (KOD 9).
  Boshlang'ich kodda ikkala muammo ham natija oynasida ko'rinadi: son eski qoladi va jonli xabar ikki marta chiqadi — o'quvchi tuzatishdan oldin buzilishni o'zi ko'radi. Xona (3-muammo) bu oynada yo'q — u A2 da agent ishi.

## 9 · Uch usul va buzish yozuvi  ← QTushuncha (bashorat + 3 urinish, bittadan)
- Eyebrow: Tushuncha · buzish yozuvi
- Sarlavha: **Uch usuldan qaysilari Mentor ilovasini buzadi?** (46)
- Mentor (bosqichga qarab):
  - boshida: Har urinishni bosing: kutilgani bilan bo'lganini solishtirib, belgi qo'ying.
  - uchinchi urinishdan keyin: Uch urinish yozildi — pastdagi xulosaga qarang.
- Bashorat (ballsiz; tanlangach ixcham qator): **Uch usuldan nechtasi Mentor ilovasini buzadi?** · Bittasi · Ikkitasi · Uchalasi
- Chap — 1-telefon («O'yin», «8 / 10»): urinishga qarab o'zgaradi — 1: holat qatorida samolyot · 2: telefon ekranini boshqa ilova (nomsiz kulrang chat oynasi) yopadi, keyin «O'yin» qaytadi · 3: belgi «Ulanmoqda…» → «Ulangan», tepada jonli xabar.
- O'ng — buzish yozuvi kartasi (bittadan, SABOQ 9): tepada ixcham chiziq «1 · 2 · 3» (joriy — accent, tayyori ✓); karta: usul nomi, uch qator yorlig'i «Nima qildim» · «Nima kutdim» · «Nima bo'ldi», ostida ikki tugma **«Buzildi»** · **«Buzilmadi»**.
  Urinishlar — A-bo'lim 4-band jadvali (`MENTOR_YOZUV`, aynan): 1 Internetni uzish · 2 Fonga olib qaytarish · 3 Backend'ning yangi versiyasi.
- **Harakat → Vizual o'zgarish:** «Urinishni ko'rish» → telefon o'sha usulni o'ynaydi (≈3 s) → kartada «Nima qildim» va «Nima kutdim» yoziladi → «Nima bo'ldi» yoziladi → «Buzildi» / «Buzilmadi» halqaga o'tadi →
  - to'g'ri belgi → karta ixcham qatorga yig'ilib tepadagi chiziqqa tushadi («1 · Internetni uzish · buzildi»; ~1 s yashil) → keyingi urinish;
  - boshqa belgi → karta silkinadi, bir qator (`QXato`, ≤60): Kutilgani bilan bo'lganini yana bir solishtiring. (49)
  2-urinish kartasi ostida kichik kulrang qator: «Shu telefonda, shu urinishda.»
- Nom qatori (3/3 dan keyin, bitta): Har urinishga uch qator — nima qildim, nima kutdim, nima bo'ldi: buzish yozuvi.
- Natija qatori: «Taxminingiz: … · Mentor misolida: ikkitasi — fonga olish buzmadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Mentor misolida uch urinishdan ikkitasi buzildi; «buzilmadi» ham natija — u ham yoziladi. (89)
- Qator (`QIzoh`, xulosadan keyin, bitta — xavfsizlik chegarasi): Buzib tekshirishni faqat o'z ilovangizda qilasiz. Boshqa odamning ilovasi yoki sayti tekshirilmaydi. (100)
- Tugadi (199): karta yopiladi, uch ixcham qator (usul · belgi) va telefon fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Urinishlarni ko'ring (N/3) → Davom etish
✎ Uch usul — tayanch 1.5 (hamma o'quvchi uchun bir xil). Mentor yozuvi va qaysi usul nimani ko'rsatgani — TAYANCHGA SAVOL 2. «Buzilmadi» — fonda ulanish uzilmagan bo'lishi mumkin; bu telefonga bog'liq (Shubhali 2) — shuning uchun «shu telefonda, shu urinishda» qatori (sinf 2d).
  Bitta urinish bir nechta muammoni ko'rsatishi mumkin (3-urinish — ikkitasi): muammo soni urinish soniga teng bo'lishi shart emas.

## 10 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **Kutganingiz bilan bo'lgani bir xil chiqdi. Yozuvga nima qo'yasiz?** (10 so'z)
  - «Tuzatish qilindi» — muammo yo'q
  - ✔ «Buzilmadi» — bu ham natija
  - Hech narsa — yozuv kerak emas
  - «Buzildi» — chunki tekshirdim
- Kalit: **B** (index 1). To'rttalasi «… — …» shaklida (tire hamma variantda).
- To'g'ri izohi: Kutilgani bo'lsa — «buzilmadi»: qaysi usul ilovani buzmagani ham yoziladi.
- Xato izohlari (≤60):
  - A: «Tuzatish qilindi» faqat kod o'zgarganda qo'yiladi. (51)
  - C: Yozuvsiz qaysi usul bajarilgani unutiladi. (42)
  - D: «Buzildi» kutilgani bo'lmaganda qo'yiladi. (42)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 11 · Tuzatish qilindi va takrorlanmadi  ← QTushuncha (bashorat + 3 qadam)
- Eyebrow: Tushuncha · qayta tekshiruv
- Sarlavha: **Agent «tuzatdim» desa, buni qanday bilasiz?** (43)
- Mentor: Avval yozuvni agentga yuboring, keyin «buzildi» belgili ikki urinishni o'sha usul bilan qaytaring.
- Bashorat (ballsiz; tanlangach ixcham qator): **Tuzatishni qanday tekshirasiz?** · Agentning so'zidan · Koddagi o'zgarishdan · O'sha usul bilan qayta buzib (S-015: dalil kuchi o'sish tartibida)
- Chap — 1-telefon («O'yin», belgi «Ulangan», «8 / 10»). O'ng — buzish yozuvi kartasi (ixcham uch qator: «1 · Internetni uzish · buzildi» · «2 · Fonga olib qaytarish · buzilmadi» · «3 · Backend'ning yangi versiyasi · buzildi») va ustida agent chati (Antigravity).
  Qadam belgilari: 1 Yozuvni yuboring · 2 Qayta: internetni uzish · 3 Qayta: yangi versiya.
- **Harakat → Vizual o'zgarish:**
  1. «Yozuvni yuborish» → chatda ikki pufak (T-008): siz → «1 va 3-urinish talabdagidek emas — yozuvim pastda. Tuzat, har muammoning sababini bir gap bilan ayt.» · Antigravity → «Tuzatdim: qayta ulanganda ro'yxat qayta so'raladi, tinglovchi bir marta qo'shiladi, ilova xonaga qayta kiradi.»
     Yozuvda 1 va 3-qator yonida belgi **«tuzatish qilindi»** (accent). Nom qatori (bitta): «Tuzatish qilindi» — kodda o'zgartirish qilindi: bu ish fakti.
  2. «Qayta: internetni uzish» → telefon 1-urinishni qaytaradi (samolyot, konvert, ↻) → belgi «Ulangan» bo'lgach «8 / 10» → «9 / 10» o'zi → 1-qator yonida yashil **«qayta tekshiruvda takrorlanmadi»**.
  3. «Qayta: yangi versiya» → belgi «Ulanmoqda…» → «Ulangan» → kichik yorliq «ikkinchi telefonda o'yin ochildi · agent qo'shildi» → tepada jonli xabar **bir marta**, «Hozir ko'ryapti: 2» → 3-qator yonida yashil **«qayta tekshiruvda takrorlanmadi»**.
- Natija qatori: «Taxminingiz: … · haqiqatda: o'sha usul bilan qayta buzib» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: «Tuzatish qilindi» — ish qilindi; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija. (104)
- Qator (`QIzoh`, xulosadan keyin, bitta): Qayta tekshiruvda yana buzilsa — shuni yozib, yozuvni agentga qayta berasiz. (76)
- Tugadi (199): qadam belgilari va chat yopiladi, yozuv kartasi (uch qator, yakuniy belgilar) fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
✎ Sinf 2d: «tuzatish qilindi» (ish fakti) va «qayta tekshiruvda takrorlanmadi» (natija) — alohida belgi, alohida qadam. Agent pufagi — da'vo (sinf 2c); yashil belgi faqat qayta urinishdan keyin.
  Bashorat «Koddagi o'zgarishdan» — rost tomoni bor (kodni o'qish foydali), lekin bu darsning qoidasi — o'sha usul bilan qayta buzish; ballsiz. 2-urinish (buzilmadi) qayta tekshirilmaydi — `qayta: null`.

## 12 · Buzish rejangiz  ← QMustaqil (uch karta ketma-ket — SABOQ 29)
- Eyebrow: Mustaqil ish · kutish
- Sarlavha: **Har usuldan oldin nima kutishingizni yozing.** (44)
- Mentor: Talabingizdagi chekka holatlardan boshlang: har usulga bittasini tanlang.
- Tepada ixcham chiziq: 1 Internetni uzish · 2 Fonga olib qaytarish · 3 Backend'ning yangi versiyasi (joriy — accent, tayyori ✓). Bir vaqtda bitta katta karta — uch maydon:
  1. **Nima qilaman** — oldindan yozilgan, tahrirlanadi:
     - internet: «Uchish rejimini yoqaman; belgi «Ulanmoqda…» bo'lgach boshqa akkaunt o'zgarish qiladi; keyin o'chiraman.»
     - fon: «Boshqa ilovaga o'taman; shu payt boshqa akkaunt o'zgarish qiladi; bir daqiqadan keyin qaytaman.»
     - versiya: «Render'da Backend'ni qayta chiqaraman; belgi «Ulangan» bo'lgach, boshqa akkaunt o'zgarish qiladi.»
  2. **Talabingizdagi chekka holat** — tanlov tugmalari: `pm-m10d3-talab.chekka[].matn` (bittasi tanlanadi; «O'zim yozaman» — erkin qator). Kalit yo'q bo'lsa — faqat erkin qator.
  3. **Nima kutaman** — «Ekranda aniq nima ko'rinishi kerak?» (ipucha: masalan: Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi.)
  Karta ostida tugma: «Keyingi usul» (asosiy; uchinchi kartada — «Saqlash»).
- Yordam (ochiladigan): Kutishni ekranda ko'rinadigan narsa bilan yozing: son, belgi, jonli xabar, «Hozir ko'ryapti». «To'g'ri ishlaydi» deb yozilsa, keyin solishtirib bo'lmaydi.
  Mahsulotingizda jonli xabar yoki «Hozir ko'ryapti» bo'lmasa — real vaqt nuqtangizdagi son yoki ro'yxatni yozing. «Hozir ko'ryapti» ni faqat ikkinchi ekran bo'lsa (sherik telefoni) tekshira olasiz.
- Shart xabari («Keyingi usul» bosilganda, ≤60): «Nima kutaman» bo'sh — ekranda nima ko'rinishini yozing. (56)
- **Harakat → Vizual o'zgarish:** «Keyingi usul» → karta ixcham qatorga yig'ilib tepaga tushadi (usul · nima kutaman — uzun matn qisqartiriladi, SABOQ 29); keyingi karta ochiladi; «Saqlash» → hammasi bitta ixcham qator: «Buzish rejasi · 3 usul ✓» (SABOQ 17).
- Saqlash → `pm-m10d5-buzish.urinishlar` — uchta yozuv: `{ usul, qildim, kutdim, boldi: '', buzildi: null, tuzatildi: false, qayta: null }` (tartib o'zgarmaydi: internet · fon · versiya).
- Xulosa (saqlagach): Kutishingiz yozildi — amaliyotda har urinishdan keyin nima bo'lganini yoniga yozasiz. (85)
- Tugma (pastki): Saqlang → Davom etish
✎ Kutish buzishdan **oldin** yoziladi — natijani ko'rgach kutishni moslab qo'yish bo'lmasin (final 1-bo'lak). Kalit oldin bor bo'lsa — kartalar to'ldirilgan holda ochiladi. Shaxsiy ma'lumot kalitga yozilmaydi (rol bilan: «boshqa akkaunt», «o'yinchi»).
  Tanlov tugmalari — tayanch 8 `pm-m10d3-talab.chekka` (3-dars); qaysi chekka holat qaysi usulga — o'quvchi qarori (sinf 13). Mentor rejimida (proyektorda) — `MENTOR_YOZUV` ning «Nima qildim» va «Nima kutdim» qatorlari.

## 13 · Buzishdan qayta tekshiruvgacha (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Buzishdan qayta tekshiruvgacha qaysi tartibda?** (46)
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — 188; bitta manba `TUZATISH_YOLI`):
  1. Talabdagi chekka holatdan nima kutishingizni yozasiz
  2. Ilovani bitta usul bilan buzasiz
  3. Nima bo'lganini yozib, belgi qo'yasiz
  4. Yozuvni agentga berasiz
  5. Agent o'zgartirish qilgach, «tuzatish qilindi» deb belgilaysiz
  6. O'sha usul bilan qayta buzib, natijani yozasiz
- Uyalar: 6 ta, har birida faqat raqam va «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib mos emas — bo'lakni bosib qaytaring. (43)
- Xulosa (yechilgach, bir marta): Bu darsda kutish buzishdan oldin yoziladi — shunda natija bilan solishtirsa bo'ladi. (84)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
✎ O'qitiladigan nuqtalar: 1 — 2 dan oldin (kutish natijadan oldin); 5 va 6 alohida (sinf 2d). Bo'laklar ikkala trekka to'g'ri («ilova» — web-trekda sayt; Shubhali 9).

## 14 · Amaliyot 1 — ilovangizni buzing  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 1 · o'z mahsulotingiz
- Sarlavha: **Mahsulotingizni uch usul bilan buzing va yozib boring.** (54) (05-FILTR 44)
- Mentor: Kod yozilmaydi: agent faqat boshqa akkaunt nomidan o'zgarish qiladi, kuzatish va yozuv — sizda; «1 · Ochish»dan boshlang.
- Model (tayanch 4, 11-Modul 9.1): to'rt qadamning hammasi o'quvchining o'z ilovasida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab). 5-qadam yo'q.
  Talab zinapoyasi A1: tayyor talab + bitta joy. Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — blok tepasida ikki tugma «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi — 11-Modul 9.77).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — ilovangiz telefonda ochiq va kirgan holda bo'lsin (mobil trekda: `cd mobil`, `npx expo start`, Expo Go). Real vaqt nuqtangiz turgan ekranni oching — Mentor misolida «O'yin»: belgi «Ulangan» bo'lishi kerak.
     Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. **Buzish faqat o'z ilovangizda: boshqa odamning ilovasi yoki sayti tekshirilmaydi.**
     Sherik bo'lsa — uning telefonida ham shu ekran ochiq tursin (web havola yoki Android'dagi Expo Go; Expo akkauntingiz ma'lumoti berilmaydi).
     Web-trekda: saytingizni telefon brauzerida oching — uchish rejimi telefonda yoqiladi (kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi); «ilovani yopib qayta ochish» o'rniga — sahifani yangilang.
  2. **Prompt** — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — faqat o'qish uchun, kod va fayllarni o'zgartirma; Database'da — faqat o'zing yaratadigan tekshiruv akkaunti va yozuvi.
     > Nima qilsin: tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan {boshqa akkaunt qiladigan o'zgarish} so'rovini tayyorla, lekin yuborma. «Yubor» desam — yubor va qaysi akkaunt, qaysi `id` ekanini ayt. «O'chir» desam — faqat o'sha `id` dagi yozuvni o'chir.
     > Nima buzilmasin: kod, `.env` va boshqa yozuvlarga tegma; haqiqiy odamning akkauntidan foydalanma.
     Qavs yonida kulrang namuna (Mentor misolidan): {boshqa akkaunt qiladigan o'zgarish} — «masalan: «Shanba, 18:00» o'yiniga qo'shilish (`POST /oyinlar/1/qoshilish`)».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — faqat o'qish uchun, kod va fayllarni o'zgartirma; Database'da — faqat o'zing yaratadigan tekshiruv akkaunti va yozuvi.
     > Nima qilsin: tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan «Shanba, 18:00» o'yiniga qo'shilish (`POST /oyinlar/1/qoshilish`) so'rovini tayyorla, lekin yuborma. «Yubor» desam — yubor va qaysi akkaunt, qaysi `id` ekanini ayt. «O'chir» desam — faqat o'sha `id` dagi yozuvni o'chir.
     > Nima buzilmasin: kod, `.env` va boshqa yozuvlarga tegma; haqiqiy odamning akkauntidan foydalanma.
  3. **Buzish** — uch usul, bittadan; har urinishdan oldin ilovani yopib qayta oching. Har urinishdan keyin yozuv kartasida «Nima bo'ldi» qatorini yozing va **«Buzildi»** yoki **«Buzilmadi»** ni tanlang; keyin agentga «O'chir» deng va ro'yxatni pastga torting — son boshidagidek bo'lishi kerak.
     O'zgarishni boshqa akkaunt qiladi: sherik o'z telefonida yoki web-trekda o'zingiz kompyuterdagi yashirin oynada (11-Moduldagi ikkinchi namuna akkaunt bilan; keyin o'zgarishni o'zingiz qaytarasiz), bo'lmasa — agent («Yubor»).
     (1) **Internetni uzish** — uchish rejimini yoqing va belgi «Ulanmoqda…» bo'lishini kuting (bir daqiqagacha). Keyin o'zgarish qilinsin; bo'lgach uchish rejimini o'chiring. Belgi «Ulangan» bo'lgach, ekranga qarang.
     (2) **Fonga olib qaytarish** — boshqa ilovaga o'ting va o'zgarish qilinsin. Bir daqiqadan keyin ilovaga qayting va ekranga qarang.
     (3) **Backend'ning yangi versiyasi** — ilova ochiq tursin. Render sahifasida Backend xizmatingizni oching: «Manual Deploy» → «Deploy latest commit». Belgi «Ulanmoqda…» ga o'tib, yana «Ulangan» bo'lishi kerak — bu bir necha daqiqa cho'zilishi mumkin; kutayotganda 1 va 2-urinish yozuvini qayta o'qing.
         «Ulangan» bo'lgach, o'zgarish qilinsin va ekranga qarang (sherik bo'lsa — uning telefonidagi «Hozir ko'ryapti» ga ham).
     Bugun Backend kodi o'zgarmaydi, shuning uchun Render'da qo'lda qayta chiqarasiz. 11-Moduldagi sozlamada `backend/` ichidagi o'zgarish push qilinsa, Render yangi versiyani odatda o'zi ishga tushiradi (05-FILTR 4).
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt.»
  4. **Tekshirish** — uch yozuvni o'qing: «Nima bo'ldi» — ekranda ko'rganingiz, taxmin emas; har belgi «Nima kutdim» bilan solishtirilgan. Agentga yozing: «Tekshiruv akkauntini ham `id` si bo'yicha o'chir. Yaratgan akkaunt va yozuvlaringning `id` larini ayt: hammasi o'chdimi?»
     Agent javobi — uning so'zi; ilovada son boshidagidek bo'lishi kerak — buni o'zingiz ko'rasiz.
- Yozuv kartasi (chapda, 3-qadam ichida; har usulga bittadan): «Nima qildim» va «Nima kutdim» — 12-ekrandan (tahrirlanadi; bo'sh bo'lsa — shu yerda yoziladi) · «Nima bo'ldi» (ipucha: masalan: Belgi «Ulangan», lekin «8 / 10» qoldi.) · tugmalar «Buzildi» · «Buzilmadi».
  Saqlanadi: `pm-m10d5-buzish.urinishlar[i].boldi`, `.buzildi` — har tugma bosilganda.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Mentor buzish yozuvining uch kartasi (A-bo'lim jadvali, «Tuzatishdan keyin» ustunisiz), har biri uch qator va belgi («buzildi» — qizil, «buzilmadi» — kulrang); kartalar ustida kichik telefon (belgi «Ulangan»).
  Web-trekda: o'sha kartalar, telefon o'rnida telefon brauzeri oynasi `….netlify.app`.
- Hammasi bajarilgach (yashil, holatga qarab): kamida bitta «buzildi» — Uch usul bajarildi va yozildi: topilgan muammolar keyingi blokda tuzatiladi. (76) ·
  hammasi «buzilmadi» — Uch usul bajarildi: mahsulotingiz buzilmadi — bu ham natija. (60)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-05-start` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) —
  agent «bajardim» deganidan keyingi kod; qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Ulgurmasangiz: Render'da qayta chiqarish cho'zilsa — 3-usul uyga vazifaning 1-bandi; 1 va 2-urinishdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting. Blok uchala usul va 4-qadamdan keyin bajarilgan sanaladi (04-FILTR 38).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{boshqa akkaunt qiladigan o'zgarish}` — oldindan bo'sh, kulrang «masalan». Agentga faqat so'rov va o'chirish topshiriladi (tayanch 1.5: «kod yozilmaydi»); `id` bo'yicha o'chirish — 11-Modul 9.92 (sinf 13). «Yubor» — oldindan tayyorlatilgan so'rov; vaqt agentga bog'liq emas: uchish rejimi belgi «Ulanmoqda…» bo'lgandan keyin o'zgarish qilinguncha turadi (05-FILTR 6, 21; TAYANCHGA SAVOL 12). Agent — sherik va web-trekdagi o'z yo'lidan keyingi yo'l.
  Har urinishdan oldin ilovani yopib ochish — tinglovchilar soni har urinishda boshidan (TAYANCHGA SAVOL 10). Agent «o'chirdim» degani — da'vo (sinf 2c); son — o'quvchining o'z tekshiruvi.
- O'qituvchi eslatmasi: Expo Go uchish rejimidan keyin ilovani qayta yuklasa (ekran boshidan ochilsa), 1-urinishda muammo ko'rinmay qolishi mumkin — pilotda tekshiriladi (Shubhali 3). Uzilishni payqash 45 soniyagacha cho'zilishi mumkin (Manbalar 5) — shuning uchun o'zgarish belgi «Ulanmoqda…» bo'lgandan keyin qilinadi; bir daqiqada o'tmasa ham urinish yoziladi.
  Render'da «Manual Deploy» nomi — rasmiy hujjatdan (Manbalar 7); interfeys boshqacha ko'rinsa, o'quvchiga xizmatni qayta chiqaradigan tugmani ko'rsating.

## 15 · Amaliyot 2 — tuzating va qayta tekshiring  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈17 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Topilgan muammolarni tuzating va qayta tekshiring.** (50)
- Mentor: Yozuvingizni agentga so'zma-so'z berasiz: tuzatishni u qiladi, natijani esa siz tekshirasiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi A2: tayyor talab + 2 joy (bittasi — buzish yozuvi, oldindan to'ldirilgan; ikkinchisi — o'quvchi tekshiradi yoki yozadi).
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — 1-amaliyotdagi yozuvingiz pastdagi talabga o'zi qo'yilgan — «buzildi» belgili urinishlarni o'qib chiqing. Ilovangiz telefonda ochiq tursin (mobil trekda `npx expo start` ishlab tursin).
     Hech biri «buzildi» bo'lmasa — 2 va 3-qadamni o'tkazib yuboring: 4-qadamda faqat `BUZISH.md` yoziladi.
  2. **Prompt** — qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring (mobil trek ko'rinishi; web-trek qatorlari pastda):
     > Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.
     > Nima qilsin: pastdagi buzish yozuvida «buzildi» belgili har urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
     > {buzish yozuvi}
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: {buzish yozuvi} — `pm-m10d5-buzish` dan oldindan yoziladi (faqat «buzildi» urinishlar; har biri uch qator: «Nima qildim: … · Nima kutdim: … · Nima bo'ldi: …») ·
     {avvalgidek ishlashi kerak bo'lgan ishlar} — `pm-m10d3-talab.buzilmasin` dan (tahrirlanadi); bo'lmasa — bo'sh, kulrang «masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat; «Hozir ko'ryapti» va jonli xabar».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `mobil/` — ulanish fayli va real vaqt ekranlari. Backend'ga tegma.
     > Nima qilsin: pastdagi buzish yozuvida «buzildi» belgili har urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt.
     > 1 · Internetni uzish. Nima qildim: Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim. Nima kutdim: Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi. Nima bo'ldi: Belgi «Ulangan», lekin «8 / 10» qoldi.
     > 3 · Backend'ning yangi versiyasi. Nima qildim: Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi. Nima kutdim: Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2». Nima bo'ldi: Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1».
     > Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida; trek kalitidan o'zi almashadi): «Qayerda» — `prototip/` — ulanish fayli va real vaqt sahifalari · «Nima buzilmasin» — … «Yangilash» tugmasi qolsin …
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q. Agent aytgan sabablarni o'qing — ular uning so'zi; natijani 4-qadam ko'rsatadi.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda: `git add <fayl>` → `git commit -m "qayta ulanish tuzatishi"` → `git push` — Netlify saytni odatda o'zi yangilaydi.
     Agent `backend/` ni ham o'zgartirgan bo'lsa — ikkala trekda shu fayllarni `git push` qiling va Render'da yangi versiya tugashini kuting.
     Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa, o'sha urinishga **«Tuzatish qilindi»** ni belgilang — bu ish fakti: kodda o'zgartirish qilindi; to'g'riligini 4-qadam ko'rsatadi (05-FILTR 12).
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Qayta tekshirish va GitHub** — «buzildi» belgili har urinishni **o'sha usul bilan** qaytaring (ilovani yopib oching, agentga «Yubor», keyin «O'chir»). Tanlang: **«Qayta tekshiruvda takrorlanmadi»** · **«Qayta tekshiruvda yana buzildi»**.
     Yana buzilsa — agentga: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat.» va o'sha usulni yana bir marta qaytaring; qolgani — uyda.
     Keyin agentga: «`BUZISH.md` yarat: pastdagi yozuvimni so'zma-so'z ko'chir — har urinishning uch qatori, belgisi, tuzatish va qayta tekshiruv natijasi. Boshqa faylga tegma. {to'liq yozuv}»
     `BUZISH.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git status` → `git add BUZISH.md` va tuzatilgan fayllar (`git add .` emas) → `git commit -m "buzish va tuzatish"` → `git push`.
     `git push` xato bersa — xato qatorini agentga yuboring (token va kalitlarni emas).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Mentor buzish yozuvi (uch karta, A-bo'lim jadvali to'liq): 1 · buzildi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi · 2 · buzilmadi · 3 · buzildi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi;
  ostida fayl kartasi: `mobil/src/ulanish.ts` (o'zgardi) · `mobil/src/app/index.tsx` va `mobil/src/app/oyin/[id].tsx` (o'zgardi) · `BUZISH.md` (yangi); pastda GitHub sahifasining kichik ko'rinishi: `maydon-jamoa` · `BUZISH.md`.
- Hammasi bajarilgach (yashil, holatga qarab): hammasi takrorlanmadi — Tuzatish qilindi va qayta tekshirildi: yozuvingiz `BUZISH.md` da. (65) ·
  yana buzilgani bor — Tuzatish qilindi, bitta urinish yana buzildi — uyda davom etasiz. (65) · hech biri buzilmagan — Yozuvingiz `BUZISH.md` da: uch usul ilovangizni buzmadi. (56)
- Saqlanadi: `pm-m10d5-buzish.urinishlar[i].tuzatildi` (3-qadam), `.qayta` (4-qadam: «takrorlanmadi» → `'takrorlanmadi'`, «yana buzildi» → `'takrorlandi'`).
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-05-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — tuzatishlar va `BUZISH.md`.
- Ulgurmasangiz: 3-usulning qayta tekshiruvi — uyda; `BUZISH.md` bugun yozilsa, shu urinish qatorida «qayta tekshiruv — hali yo'q» turadi.
- Nishon (bonus): Break & Fix — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tuzatishni agent qiladi, sababni u aytadi — o'quvchi sababni darsda ko'rgan (2, 4, 6-ekranlar) va agent javobi bilan solishtiradi (sinf 13). Talabda texnologiya nomi yo'q — yangi kutubxona kiritilmaydi (tayanch 4).
  «Tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» — ikki alohida tugma, ikki alohida qadam (sinf 2d). Mentor misolida push faqat `mobil/` va `BUZISH.md` — Render qayta chiqmaydi (Root Directory `backend`; Manbalar 8).
  O'quvchi promptida «Backend'ga tegma» yo'q — muammo qayerda bo'lsa, o'sha joy o'zgaradi (05-FILTR 32, 33); Mentor Yordamida qoladi (uch muammo ham ilovada).

## 16 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 2 blok «Bajardim» (`PRACTICE_BASE`). QKod (8) va QMustaqil (12) — `practice: -1`.
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Uzilishdagi hodisa» · 5 — «2 — Ikki jonli xabar» · 7 — «3 — Xonaga qaytish» · 10 — «4 — Buzilmadi ham natija» · 13 — «Yakuniy — buzishdan qayta tekshiruvgacha»

## 17 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi halqada.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 18 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ `BUZISH.md` tayyor (faqat yakun sarlavhasining birinchi yoki ikkinchi holatida; aks holda yorliq yo'q) · {N}/5 to'g'ri
- Sarlavha (holatga qarab, P-046; sinf 1 — o'quvchi qilgan ishni aytadi, Mentor natijasini emas):
  - A1 va A2 to'liq, hamma tuzatilgan urinish «qayta tekshiruvda takrorlanmadi» — **Topilgan muammolar tuzatildi va qayta tekshirildi.** (50)
  - A1 to'liq, hammasi «buzilmadi», `BUZISH.md` yozilgan — **Uch usul bajarildi — mahsulotingiz buzilmadi.** (45)
  - «tuzatish qilindi», lekin qayta tekshiruv to'liq emas yoki «yana buzildi» bor — **Tuzatish qilindi — qayta tekshirish qoldi.** (42)
  - A1 to'liq, «buzildi» bor, A2 bajarilmagan — **Muammolar yozildi — tuzatish qoldi.** (35)
  - A1 to'liq emas — **Buzish boshlandi — qolgan usullarni uyda bajaring.** (50)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- **[07.10: yakunda KO'RSATILMAYDI — SABOQ E 50 (foydalanuvchi tasdig'i); fikr darsning ichki o'qi bo'lib qoladi]** Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Agentning «bajardim» degani — da'vo: chekka holatni o'zingiz buzib ko'rasiz, tuzatilgach o'sha usul bilan qayta tekshirasiz.
- Endi siz bilasiz (5):
  - Chekka holat oddiy paytda ko'rinmaydi — uni ataylab yuzaga keltirib tekshirasiz.
  - Bu misolda uzilish paytida yuborilgan hodisa keyin kelmaydi, shuning uchun qayta ulanganda ro'yxat qayta so'raladi.
  - `connect` ichidagi kod har qayta ulanishda ishlaydi, shuning uchun tinglovchi uning tashqarisida bir marta qo'shiladi.
  - Uzilganda ulanish xonadan chiqadi; Mentor misolida tuzatishdan keyin qayta ulangan ilova o'yin xonasiga qayta kiradi.
  - «Tuzatish qilindi» — ish fakti; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z ilovangiz · nechta — uch usul · muddat — keyingi darsgacha):
  1. **Tugatish** — darsda ulgurmagan usulni bajaring va yozing (ko'pincha — Render'da qayta chiqarish); «buzildi» bo'lsa — yozuvni agentga bering va o'sha usul bilan qayta tekshiring.
  2. **Yana bir marta** — bugun natijasi kutganingizdan boshqacha chiqqan yoki qayta tekshiruvi tugamagan usulni ertaga yana bajaring: natija o'shandaymi? Farq bo'lsa, `BUZISH.md` ga yangi urinish qo'shing (05-FILTR 37).
  3. **Talab** — bugun topilgan har muammo talabingizdagi chekka holatlar ro'yxatida bormi? Yo'q bo'lsa — README'dagi «Real vaqt» bo'limiga bitta chekka holat qo'shing.
- Keyingi dars — «Birinchi foydalanuvchilar sizni qayerdan topadi?»
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Lost Event** — Uzilish paytidagi hodisa nega kelmasligini topdingiz (3-ekran, 1-savol)
- **Once Only** — Ikki jonli xabarning sababini topdingiz (5-ekran, 2-savol)
- **Room Return** — Qayta ulangan ilova xonaga nega qaytmaganini bildingiz (7-ekran, 3-savol)
- **Break & Fix** — Ikkala amaliyot blokini oxirigacha bajardingiz (15-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 06.10: Lost Event · Once Only · Room Return · Break & Fix — 0).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod, qolganida raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Uzilishdagi hodisa keyin kelmaydi»
   - 1 · Uchish rejimida ulanish uziladi.
   - 2 · Shu payt yuborilgan hodisa bu misolda keyin ham kelmaydi.
   - 3 · Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi.
   - Sinfga savol: Belgi «Ulangan» — ekrandagi son yangi ekanini qanday bilasiz?
2. 2-savol (5-ekran) — «`connect` har qayta ulanishda ishlaydi»
   - Birinchi ulanishda ishlaydi · `ulanish.on('connect', …)`
   - Qayta ulanishda ham ishlaydi · ichidagi tinglovchi yana qo'shiladi
   - Tinglovchi tashqarida — bir marta · `ulanish.on('oyin-ozgardi', …)`
   - Sinfga savol: Ilova uch marta qayta ulansa, bitta qo'shilishga nechta jonli xabar chiqardi?
3. 3-savol (7-ekran) — «Xonaga qaytish»
   - Uzilganda ulanish xonadan chiqadi · `Xona oyin-1: 0`
   - Qayta ulanish — yangi ulanish: xonaga o'zi kirmaydi
   - Tuzatish: ochiq o'yin xonasiga qayta kiradi · `oyin-ochildi`
   - Sinfga savol: Xonaga qaytmagan ilova qaysi sonni olmay qoladi?
4. 4-savol (10-ekran) — «Buzish yozuvi»
   - 1 · Nima qildim
   - 2 · Nima kutdim
   - 3 · Nima bo'ldi → belgi: buzildi yoki buzilmadi
   - Sinfga savol: Nega «Nima kutdim» buzishdan oldin yoziladi?
5. Final (13-ekran) — «Buzishdan qayta tekshiruvgacha»
   - 1 · Kutish yoziladi, keyin ilova buziladi
   - 2 · Yozuv agentga beriladi — o'zgartirish qilingach «tuzatish qilindi»
   - 3 · O'sha usul bilan qayta — «qayta tekshiruvda takrorlanmadi»
   - Sinfga savol: Agent «tuzatdim» dedi, siz qayta tekshirmadingiz. Yozuvda nima turadi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Buzish nima? | Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish | Bu darsda — faqat o'z ilovangizda, uch usul bilan |
| Uch buzish usuli qaysilar? | Internetni uzish, fonga olib qaytarish, Backend'ning yangi versiyasi | Mentor misolida ikkitasi ilovani buzdi |
| Buzish yozuvida qaysi uch qator bor? | Nima qildim, nima kutdim, nima bo'ldi | Oxirida belgi: buzildi yoki buzilmadi |
| «Nima kutdim» qachon yoziladi? | Buzishdan oldin | Shunda natija bilan solishtirsa bo'ladi |
| Uzilish paytida yuborilgan hodisa nima bo'ladi? | Bu misolda keyin ham kelmaydi | Tuzatish: qayta ulanganda ro'yxat qayta so'raladi |
| Qayta ulanish nima? | Uzilgan ulanishni qayta tiklash | socket.io bunga o'zi urinadi — odatda bir necha soniyada |
| `connect` ichidagi kod qachon ishlaydi? | Birinchi ulanishda va har qayta ulanishda | Shuning uchun tinglovchi uning tashqarisida qo'shiladi |
| Takror hodisa nima? | Bitta o'zgarish ilovaga ikki marta ta'sir qilishi | Mentor misolida — jonli xabar ikki marta chiqdi |
| Ulanish uzilsa, xonada nima bo'ladi? | Ulanish xonadan chiqadi | Mentor misolida qayta ulangach ilova o'yin xonasiga qayta kiradi |
| «Tuzatish qilindi» nimani bildiradi? | Kodda o'zgartirish qilingani — bu ish fakti | Natijani qayta tekshiruv ko'rsatadi |
| «Qayta tekshiruvda takrorlanmadi» qachon yoziladi? | O'sha usul bilan qayta buzib ko'rilganda muammo chiqmasa | Shu telefonda, shu urinishda — hamma telefon uchun isbot emas |
| Agentning «bajardim» degani nima? | Da'vo — hali tekshirilmagan | Natijani o'zingiz buzib ko'rib bilasiz |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Uchish rejimi yoqilsa, ulanish nima bo'ladi? ✔ Uziladi, ilova qayta urinadi · Ochiq qoladi, hodisa kutadi · Yopiladi, ilova urinmaydi · Tiklanadi, son o'zi yangilanadi
2. Tarmoq uzilsa, socket.io sukutda necha marta urinadi? Bir marta, keyin to'xtaydi · ✔ Ulanguncha urinaveradi · Uch marta, keyin to'xtaydi · Faqat tugma bosilganda
3. `connect` ichidagi kod qachon ishlaydi? Faqat ilova eng birinchi ulanganda · Faqat Backend hodisa yuborganda · ✔ Har ulanishda, qayta ulanganda ham · Faqat ilova yopilib qolganda
4. Takror hodisa nima? Ikki o'yinda bir vaqtdagi o'zgarish · Ikki telefondagi bir xil son · Bir o'yinchining ikki akkaunti · ✔ Bitta o'zgarishning ikki ta'siri
5. Qayta ulanganda Mentor ilovasi ro'yxatni nega qayta so'raydi? ✔ Uzilishda kelmagan o'zgarish uchun · Belgini «Ulangan» qilish uchun · Tinglovchini yana qo'shish uchun · Hodisani Backend'dan qayta olish uchun
6. Buzish yozuvida qaysi uch qator bor? Kim bosdi, qachon va qayerda · ✔ Nima qildim, kutdim, bo'ldi · Usul, telefon, versiya · Muammo, sabab, tuzatish
7. Agent «tuzatdim» dedi, qayta tekshirmadingiz. Yozuvda nima turadi? «Takrorlanmadi» — agent aytdi · «Buzilmadi» — endi hammasi ishlaydi · ✔ «Tuzatish qilindi» — tekshirilmagan · Hech narsa — agent o'zi biladi
8. Tuzatishni qaysi usul bilan qayta tekshirasiz? Hali bajarilmagan yangi usul bilan · Agent yozgan javobni o'qib chiqib · Faqat koddagi o'zgarishni o'qib · ✔ Muammo chiqqan usulning o'zi bilan
9. Render yangi versiyani ishga tushirsa, ochiq ulanishlar nima bo'ladi? ✔ Uziladi, ilovalar qayta urinadi · Ochiq qoladi, hech narsa sezilmaydi · Faqat yangi ilovalar uziladi · Database ularni saqlab turadi
10. socket.io'dagi xona qayerda turadi? Ilovaning o'zida · ✔ Backend'ning o'zida · Database jadvalida · Telefon sozlamasida
11. Mentor misolida fonga olish urinishi nima ko'rsatdi? Son eskicha qolib ketdi · Jonli xabar ikki marta chiqdi · ✔ Buzilmadi, son yangi edi · Ilova yopilib, qayta ochildi
12. Kimning ilovasini buzib tekshirasiz? Sinfdoshingizning ilovasini · Mashhur ilovalardan birini · Istalgan ochiq saytni · ✔ O'zingizning ilovangizni

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
- 2-savol: sukutda `reconnectionAttempts: Infinity` (Manbalar 4) — «Ulanguncha urinaveradi» rost; savolda «tarmoq uzilsa» va «sukutda» — 05-FILTR 16; Backend yopgan ulanish (`io server disconnect`) savolda yo'q — savol tarmoq uzilishi haqida.
- 9-savol: «qayta urinadi» — kafolat emas, urinish (sinf 2c); Render iqtibosi — Manbalar 6.
- 12-savol: distraktorlar — xavfsizlik chegarasiga zid ishlar (bitta xato-sinf: boshqa odamning ilovasi); to'g'ri variant «faqat» so'zisiz (kalit so'z faqat to'g'rida emas).
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): buzish · buzish yozuvi · uchish rejimi · qayta ulanish · takror hodisa · `connect` · `ulanish.on` · tinglovchi · xona · «Hozir ko'ryapti» · «Ulangan» · «Ulanmoqda…» · tuzatish qilindi · takrorlanmadi · `BUZISH.md` · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 19 ekran: hook · rule · exploration · test · exploration · test · exploration · test · practice(kod) · exploration · test · exploration · practice(mustaqil) · test(final, `scope: 'final'`) · practice(blok) ×2 · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **2 (C)** · s5 **0 (A)** · s7 **3 (D)** · s10 **1 (B)** · s13 sentinel **0**; QKod (8), QMustaqil (12) va bloklar (14, 15) — `practice: -1`. `LESSON_META.lessonId` — `m10-05-v1`, `lessonTitle` — «Ulanish uzilsa: buzamiz va tuzatamiz».
2. **Bitta manba (180):** `SAHNA` (ikki telefon, Backend tuguni, chiziq holatlari, konvert turlari, xona qatori), `NAMUNA_OYIN` (Shanba, 18:00 · Mahalla maydoni · 8 / 10; `oyinId: 1`; jonli xabar matni — tayanch 1.4), `USULLAR` (uch usul: kalit `internet` · `fon` · `versiya`, nomi, 12-ekrandagi oldindan yozilgan «Nima qilaman»),
   `MENTOR_YOZUV` (A-bo'lim 4-band jadvali — 9, 11-ekranlar, A1/A2 kutilgan natija, A2 Yordami, 12-ekran Mentor rejimi), `TUZATISH_YOLI` (6 bo'lak — 13-ekran), `BELGILAR` (ulanish belgisi uch holat va yozuv belgilari — yozuv, rang tokeni) — hamma ekran va kartochka shundan o'qiydi.
3. **`IkkiTelefonSahna`** komponenti (pilot 02 dagi sahna bilan bir xil ko'rinish; nusxa, import emas — darslar mustaqil): chapda «1-telefon · siz» (≈170×272 — SABOQ 22; yorliq ramka ustida — SABOQ 23), o'rtada Backend tuguni, o'ngda «2-telefon · boshqa o'yinchi».
   Propslar: `telefonlar` (1 yoki 2), `chiziq` (`ochiq` · `uzilgan` · `tiklangan`), `belgi`, `konvertlar` (`oyin-ozgardi` · `oyin-ochildi` · `korayotganlar-ozgardi`; `kelmadi` holati), `jonliXabar` (0, 1 yoki 2 ta, ustma-ust), `xona` (`null` yoki son + nuqtalar), `ekran` (`oyin` · `oyinlar` · `boshqa-ilova`), `koryapti`, `eski` (son/«Hozir ko'ryapti» yonida kulrang yorliq).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: bf-qoshil bf-samolyot bf-versiya bf-kartaoch bf-urinish bf-belgi bf-yubor bf-qayta`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **`BuzishYozuvi`** komponenti (9, 11, 14, 15-ekranlar): karta — usul nomi, uch qator (yorliq + matn), belgi joyi; holatlar: `bosh` (uzuq chiziqli joy) · `buzildi` (`err`) · `buzilmadi` (`ink2`) · `tuzatildi` (`accent`) · `takrorlanmadi` (`ok`) · `takrorlandi` («yana buzildi», `err`); ixcham qator ko'rinishi (usul · belgi).
   14-ekranda tahrirlanadigan rejim: «Nima bo'ldi» maydoni + «Buzildi» / «Buzilmadi»; 15-ekranda «Tuzatish qilindi» (3-qadam) va «Qayta tekshiruvda takrorlanmadi» / «Qayta tekshiruvda yana buzildi» (4-qadam). ⚠️ Qolipda yo'q — `QBlok` ichida forma (07 pilot A2 «Tanlang» naqshi; MEXANIZM-TAKLIF).
5. **0-ekran:** ikki telefon + chat pufagi (bitta); «Qo'shilaman» (2-telefon) → konvert → 1-telefonda son animatsiyasi va bitta jonli xabar; variantlar shundan keyin faol; javobdan keyin pufak ostida «da'vo · tekshirilmagan» yorlig'i (kirish animatsiyasi, SABOQ 19).
6. **2-ekran:** uch qadam: samolyot (`uzilgan` + ↻) → 2-telefon qo'shilishi (konvert `kelmadi`, «Database: 9») → samolyot o'chirilsa ≈2 s dan keyin `tiklangan`, «8 / 10» + «eski»; `QTaxmin`, nom qatori 3/3 dan keyin.
7. **4-ekran:** «Yangi versiya» sahna tugmasi → ikkala chiziq `uzilgan`, urinish nuqtalari (kechikishlar o'sib boradi, son yozilmaydi) → `tiklangan`; kod kartasi (mono, 5 qator, sintaksis rangi yo'q — faqat yonadigan qator: `connect` · `oyin-ozgardi`), hisoblagich «Tinglovchilar: 1 → 2»;
   2-telefon qo'shilishi → ichki qator ikki marta yonadi, ikki jonli xabar. Nom qatorlari: 1-qadamdan keyin «qayta ulanish», 2-qadamdan keyin «takror hodisa».
8. **6-ekran:** Backend ichida «Xona `oyin-1`: N» qatori (nuqtalar bilan); «Yangi versiya» → nuqta chiqadi, yangi ulanish xonadan tashqarida; 2-telefon `oyinlar` → `oyin` → `oyin-ochildi` konverti → xona 1 → `korayotganlar-ozgardi` → «Hozir ko'ryapti: 1»; 1-telefonda «Hozir ko'ryapti: 1» + «eski».
9. **8-ekran (QKod) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `namuna.js` tayyor · `app.js` — boshlang'ich holat, o'quvchi tuzatadi). Tekshiruvlar (runtime, AST shart emas):
   (1) natija oynasida avtomatik ketma-ketlik — yuklash (`ulan`) → `uzish` → `qaytar` (1 s) → `oyin-ozgardi` tinglovchilari soni **1** (namuna `tinglovchilar` ro'yxatidan);
   (2) yuklash → `uzish` → `boshqa` → `qaytar` → 1 s dan keyin `.son` matni **9**; keyin `boshqa` → `.xabarlar` da **bitta** yangi `p`. `connect` ga `korsat` to'g'ridan-to'g'ri ham, `function`/arrow o'rami ham qabul. «Bajardim» shartlar ✓ bo'lgach (§19). Qoralama kaliti `pm-m10d5-code`.
   ⚠️ Starter fayllar `.jsx` ichida shablon-satr — izohlarda backtik yo'q (CLAUDE.md); apostrofli matn (`o'yinchi qo'shildi`) JS da qo'shtirnoq ichida — ataylab. `namuna.js` dagi `setTimeout(ulan, 500)` — `app.js` tinglovchilari qo'shilgandan keyin birinchi ulanish uchun.
10. **9-ekran:** ketma-ket uch karta (SABOQ 9, 13); telefon urinishga qarab (`samolyot` · `boshqa-ilova` · `versiya`) ≈3 s o'ynaydi; belgi tugmalari — to'g'risi `MENTOR_YOZUV[i].belgi` dan; noto'g'ri → silkinish + `QXato`; to'g'ri → ixcham qatorga uchadi. 2-kartada kichik qator «Shu telefonda, shu urinishda.».
11. **11-ekran:** chat (ikki pufak, T-008) + yozuv kartasi + telefon (≤3 blok); uch qadam; belgilar `tuzatildi` → `takrorlanmadi` ketma-ket, rang o'tishi bilan.
12. **12-ekran (QMustaqil):** bitta katta karta, ixcham chiziq (SABOQ 29); «Nima qilaman» oldindan (`USULLAR`), tanlov tugmalari `pm-m10d3-talab.chekka[].matn` (+ «O'zim yozaman»), «Nima kutaman» majburiy; saqlash `pm-m10d5-buzish` (uch yozuv, tartib o'zgarmaydi, `usul` — barqaror kalit); kalit bor bo'lsa — to'ldirilgan holda ochiladi.
13. **14, 15-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2-qadam; `{…}` joylari) + `BuzishYozuvi` (KOD 4). A1: `{boshqa akkaunt qiladigan o'zgarish}` — bo'sh, kulrang «masalan». A2: `{buzish yozuvi}` ← `pm-m10d5-buzish` (faqat `buzildi: true`; format «N · usul. Nima qildim: … Nima kutdim: … Nima bo'ldi: …»),
    `{avvalgidek ishlashi kerak bo'lgan ishlar}` ← `pm-m10d3-talab.buzilmasin`; trek qatorlari (`mobil/` · `prototip/`, «pastga tortib yangilash» · ««Yangilash» tugmasi», Expo Go `r` · `git push` → Netlify) — `pm-m9d8-platforma.trek` dan; kalit yo'q bo'lsa — trek tugmalari (11-Modul 9.77).
    A2 4-qadamdagi `BUZISH.md` prompti — `{to'liq yozuv}` hamma urinishlar bilan (tuzatish va qayta tekshiruv natijasi bilan). Yakun matni («Hammasi bajarilgach») holatga qarab — `pm-m10d5-buzish` dan.
    ⚠️ Qolipda yo'q (11-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, «O'qituvchi eslatmasi» (o'quvchi yuzasida yo'q). `ACH_TRIGGERS`: A2 oxirgi «Bajardim» → Break & Fix.
14. **18-ekran (yakun):** sarlavha va ✓ yorlig'i — `pm-m10d5-buzish` dan hisoblanadi (beshta holat; P-046). Uyga vazifa — `uyga` (3 band).
15. `RECAPS` 5 (kalit = 3, 5, 7, 10, 13) · `Q_LABELS` {3, 5, 7, 10, 13} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 3 → Lost Event, 5 → Once Only, 7 → Room Return, A2 → Break & Fix) · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) · `HW_TOKENS` fon so'zlari {uz, ru}.
16. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067).
17. **Darvozalar:** `npm run gates -- src/10-Modull/BreakAndFixLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran 4 savol (SABOQ 30) hisobotda.

**REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m12-dars-05-start` = `m12-dars-04-done` + README eslatmasi → `m12-dars-05-done`):**
1. `m12-dars-05-start`: `README.md` ga eslatma «Bu holatda uch muammo bor — 5-darsda topiladi.» (tayanch 3). Kod — 4-dars holati: ilovada `oyin-ozgardi` tinglovchisi `connect` ichida; `connect` da ro'yxat qayta so'ralmaydi; qayta ulanishda `oyin-ochildi` qayta yuborilmaydi.
   ⚠️ Muhrdan oldin uch muammo telefonda haqiqatan ko'rinishi tekshiriladi (1-usul, 3-usul); ko'rinmasa — tayanch 1.5 matni bilan solishtirib foydalanuvchiga aytiladi.
2. `m12-dars-05-done` (`mobil/`): `ulanish.ts` — `oyin-ozgardi` tinglovchisi bir marta (modul darajasida yoki `useEffect` tozalash bilan); `connect` ichida — ro'yxatni qayta so'rash va ochiq «O'yin» bo'lsa `oyin-ochildi { oyinId }` qayta yuborish (ochiq o'yin `id` si ulanish faylida saqlanadi). Backend o'zgarmaydi.
3. `BUZISH.md` — A-bo'lim 4-band jadvali (uch urinish, belgilar, tuzatish va qayta tekshiruv natijasi). «Darslar va teglar» jadvaliga `m12-dars-05-done` qatori.
4. Muhrdan oldin: uch usul Mentor telefonida bajariladi (Render'da «Manual Deploy» → «Deploy latest commit» bilan), yozuv natijasi `MENTOR_YOZUV` ga mos kelishi tekshiriladi; fonga olish (2-usul) haqiqatda nima ko'rsatgani jurnalga — mos kelmasa MD yangilanadi (Shubhali 2).
   Agent yaratgan tekshiruv yozuvlari `id` bo'yicha o'chiriladi; `oyinchilar` va `oyinlar` o'zgarmaydi.

## Manbalar (o'zim tekshirdim, 06.10.2026; o'quvchiga ko'rinmaydi)
1. socket.io — `socket.io/docs/v4/client-socket-instance/` (06.10): «This event is fired by the Socket instance upon connection **and** reconnection.» (`connect`) ·
   «Event handlers shouldn't be registered in the `connect` handler itself, as a new handler will be registered every time the socket instance reconnects» (BAD namuna: `socket.on("connect", () => { socket.on("data", …) })`) ·
   ID — «regenerated after each reconnection» · uzilish sabablari: `io server disconnect`, `io client disconnect` — o'zi qayta ulanmaydi; `ping timeout`, `transport close`, `transport error` — qayta ulanadi.
2. socket.io — `socket.io/docs/v4/delivery-guarantees/` (06.10): «Socket.IO does guarantee message ordering» · «By default, Socket.IO provides an **at most once** guarantee of delivery» ·
   «there is no such buffer on the server, which means that any event that was missed by a disconnected client will not be transmitted to that client upon reconnection» · mijoz `retries` — «at least once» (takror hodisa bo'lishi mumkin; bu darsda ishlatilmaydi).
3. socket.io — `socket.io/docs/v4/rooms/` (06.10): «A room is an arbitrary channel that sockets can `join` and `leave`» · «Upon disconnection, sockets `leave` all the channels they were part of automatically» · «rooms are a **server-only** concept».
   Qayta ulanganda xonaga qayta kirish haqida sahifada gap yo'q — «xonaga o'zi kirmaydi» xulosasi: ulanish xonadan chiqadi + ID yangilanadi + Mentor ilovasi xonaga faqat `oyin-ochildi` bilan kiradi (tayanch 1.4).
4. socket.io — `socket.io/docs/v4/client-options/` (06.10): `reconnection` `true` · `reconnectionAttempts` `Infinity` · `reconnectionDelay` `1000` («affected by the randomizationFactor») · `reconnectionDelayMax` `5000` («Each attempt increases the reconnection delay by 2x») · `randomizationFactor` `0.5`.
5. socket.io — `socket.io/docs/v4/server-options/` (pilot 02 Manbalar 5 orqali): `pingInterval` 25000 + `pingTimeout` 20000 → uzilishni payqash 45 s gacha; `connectionStateRecovery` sukutda yoqilmagan.
6. Render — `render.com/docs/websocket` (06.10): «they close automatically when the instance is replaced (for example, during a deploy)» · «This occurs most commonly when you deploy a new version of your service, and it also happens as part of standard platform maintenance» · «Reconnection logic should use exponential backoff».
7. Render — `render.com/docs/deploys` (06.10): «Whenever you push or merge a change to that branch, by default Render automatically rebuilds and redeploys your service.» · «Your original instance continues to receive all incoming traffic while the new instance is spinning up» ·
   qo'lda: «Manual Deploy» menyusi — «Deploy latest commit», «Deploy a specific commit», «Clear build cache & deploy», «Restart service».
8. Render — `render.com/docs/monorepo-support` (06.10): «If you set a root directory for your service, Render only triggers an autodeploy if your changes affect files anywhere under that directory.» — 11-Modulda Root Directory `backend` (11-Modul tayanchi 9.6; `10-FoundationDay-v3.md`) → TAYANCHGA SAVOL 1.
9. Kursdagi so'zlar (grep, 06.10): «Ulanmoqda…», `korsat()`, `sora()`, `ulanish` namunasi — pilot `02-WebSocketBasics-v3.md` · «real vaqt sahnasi» — tayanch 9.16 · agent tekshiruv yozuvlari `id` bo'yicha — 11-Modul tayanchi 9.92 · `oyinchilar`, namuna akkauntlar — 11-Modul tayanchi 9.88 · Render Root Directory — 11-Modul tayanchi 9.6.
10. Tekshirilmagan (rasmiy hujjat topilmadi): ilova fonda turganda telefon ulanishni uzadimi (React Native / Expo Go, Android va iPhone) — Shubhali 2; qidiruvda faqat uchinchi tomon sahifalari chiqdi (rasmiy emas — ishlatilmadi).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ⚠️ **3-usul va Render Root Directory (eng muhim).** Tayanch 1.5: «o'zgarish `git push` qilinadi; Render yangi versiyani ishga tushirganda ulanish uziladi». Lekin 11-Modulda Render xizmati Root Directory `backend` bilan (11-Modul tayanchi 9.6), Render esa bunday xizmatni **faqat `backend/` ichidagi o'zgarishda** qayta chiqaradi (Manbalar 8).
   Bugun A1 da kod yozilmaydi, A2 tuzatishlari — `mobil/` da: `git push` Backend'ni qayta chiqarmaydi va 3-usul jim «buzilmadi» bo'lib qoladi. **Qarorim:** 3-usul — Render sahifasida «Manual Deploy» → «Deploy latest commit» (Manbalar 7, rasmiy nom);
   darsda bir gap: «`backend/` ga `git push` qilinganda ham Render yangi versiyani shunday ishga tushiradi». Muqobil: A1 da `backend/` ichida kichik o'zgarish (masalan, agent `backend/` dagi izohni yangilaydi) — «kod yozilmaydi» qoidasiga zid, shuning uchun tanlamadim.
2. **Mentor buzish yozuvi** (A-bo'lim 4-band jadvali; 05-FILTR 1, 5: auditor shartli qabul qildi — ⛔ «qur» pilotida haqiqiy natija ustun, tayanch 9.37) — tayanchda uch muammo bor, qaysi urinish nimani ko'rsatgani va urinish matni yo'q. Qarorim: 1 · internet → 1-muammo · 2 · fon → **buzilmadi** · 3 · yangi versiya → 2 va 3-muammo.
   Sabab: 1-muammo uzilishda bo'lgan o'zgarishdan; 2 va 3-muammo — qayta ulangandan keyingi o'zgarish va ikkinchi ekrandan ko'rinadi; fonda ulanish uzilishi telefonga bog'liq (Shubhali 2) — «buzilmadi ham natija» Mentor misolida ham ko'rinadi. Muqobil: 2 · fon → 3-muammo (faqat telefon fonda ulanishni uzsa rost).
3. **Hook** — «Ulanish uzilsa ham ishlashini qanday bilasiz?», ✔ «Internetni o'zim uzib, natijaga qarayman»; oddiy holatda hammasi ishlaydi (10-Modul 5-dars hook naqshi); agent pufagi matni «Tayyor! Talabdagi uchala chekka holatni bajardim.» (tayanch 1.5: agent «uchala chekka holatni bajardim» degan).
4. **`connect` — «hodisa» deyilmaydi.** Tayanch 2: hodisa — «ulanish orqali yuboriladigan nomli xabar»; `connect` ni Backend yubormaydi (socket.io'ning o'z nomi). O'quvchi matnida: «`connect` ichida», «`connect` ichidagi kod».
5. **Sahna tugmasi «Yangi versiya»** (Backend tugunida; 4, 6-ekranlar) — Render deploy'ini sahnada ko'rsatish uchun; haqiqiy Backend'da yo'q (✎ da ochiq).
6. **4-ekran kod kartasi** — `korsat()`, `jonliXabar()` nomlari kod oynasi bilan bir (o'qish uchun); yorlig'i «Mentor ilovasi · `m12-dars-05-start`». Haqiqiy fayl va nomlar — agent tanlaydi (REPO 2).
7. **Kod oynasi namunasi** — uch tugma («Internetni uzish» · «Internetni qaytarish» · «Boshqa o'yinchi qo'shildi»), qaytarish 1 s dan keyin, son 10 da to'xtaydi, jonli xabar `.xabarlar` ga `p` bo'lib qo'shiladi. Xona (3-muammo) kod oynasida yo'q.
   Tayanch 1.5: o'quvchi tinglovchini tashqariga chiqaradi «va `connect` ichida «qayta so'rash»ni qoldiradi». Men boshlang'ich kodda `connect` ichida qayta so'rash **yo'q** qildim — 1-muammo ham natija oynasida ko'rinsin va o'quvchi `korsat()` ni o'zi qo'ysin (2-shart).
   Muqobil (so'zma-so'z o'qish): boshlang'ich `connect` da `korsat()` bor, o'quvchi faqat tinglovchini chiqaradi — unda 2-shart boshidan bajarilgan bo'ladi. ✅ 05-FILTR 14: auditor qabul qildi — tayanch 9.37 ga kiritildi.
8. ✅ **`pm-m10d5-buzish`:** 12-ekranda saqlanganda `boldi: ''`, **`buzildi: null`** (tayanch 8 endi `bool | null` — 05-FILTR 29) — urinish hali bajarilmagan; A1 da `true`/`false`. Bitta usulga bitta urinish (`usul` — barqaror kalit, tartib o'zgarmaydi); qayta tekshiruv — o'sha yozuvning `qayta` maydonida.
   UI «Qayta tekshiruvda yana buzildi» → kalitda `'takrorlandi'` (tayanch 8 qiymati).
9. **12-ekran «Buzish rejangiz»** (QMustaqil) — «Nima kutaman» buzishdan oldin; tanlov tugmalari `pm-m10d3-talab.chekka` dan; «Nima qilaman» oldindan yozilgan (`USULLAR`). Tayanchda bu ekran yo'q — tayanch 4 TEX tuzilishiga (pilot 02 13-ekran) mos.
10. **Har urinishdan oldin ilovani yopib qayta ochish** (A1, A2) — tinglovchilar soni har urinishda boshidan bo'lsin: aks holda 3-urinishda jonli xabar ikki emas, uch marta chiqishi mumkin (Mentor yozuvidagi «ikki marta» shunda rost).
11. **Har urinishdan keyin agentga «O'chir»** (05-FILTR 23: o'chirish usuli — tayanch 9.37: faqat aytilgan `id` bo'yicha `WHERE` bilan, 7-darsdan keyin «Hisobni o'chirish» yo'li bilan) — tekshiruv yozuvi `id` bo'yicha o'chadi, keyingi urinish yana «8 / 10» dan; o'yin to'lib qolmaydi (11-Modul 9.92 qoidasining bugungi qo'llanishi).
12. **Agent so'rovni oldindan tayyorlaydi, «Yubor» bilan yuboradi** — 05-FILTR 6, 21 dan keyin vaqt agentga bog'liq emas: uchish rejimi belgi «Ulanmoqda…» bo'lgandan keyin o'zgarish qilinguncha turadi; sherik va web-trekdagi o'z yo'li — agentdan oldin.
13. **«Hozir ko'ryapti» ni tekshirish ikkinchi ekranni talab qiladi** (sherik telefoni yoki ikkinchi qurilma). Yakka o'quvchi bu qatorni «Nima kutaman» ga yozmaydi; 12-ekran Yordami shuni aytadi.
14. **Tugma va belgi nomlari:** «Buzildi» · «Buzilmadi» · «Tuzatish qilindi» (05-FILTR 11: «Tuzatildi» edi; kalit `tuzatildi` o'zgarmaydi) · «Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi» (tayanch 1.5 so'zlari); yozuv qatorlari «Nima qildim» · «Nima kutdim» · «Nima bo'ldi»; 12-ekranda kelasi zamonda — «Nima qilaman» · «Nima kutaman».
15. **«holat» va «takror»:** «holat» — «ulanish holati», «chekka holat» va chekka holat matnidagi «yangi holat» (tayanch 1.3 so'zma-so'z); boshqa ma'noda yo'q. «takror hodisa» (atama) va «qayta tekshiruvda takrorlanmadi» (tayanch natija so'zi) — **bir ildiz, ikki ma'no** (T-015 xavfi); darsda ikkalasi tayanchdan — ko'rib chiqing.
16. **Yakun sarlavhalari** — besh holat (18-ekran); ✓ yorlig'i faqat to'liq bajarilganda.
17. **Uyga vazifa** — uch band (tugatish · natijasi boshqacha chiqqan yoki tugamagan usulni ertaga yana · talabga chekka holat qo'shish; 05-FILTR 37); tayanch 4 «yakun kartasida, o'z mahsuloti bo'yicha»; mazmuni mening qarorim.
18. **Nishon nomlari** — Lost Event · Once Only · Room Return · Break & Fix (grep 0).
19. **Reja** — sarlavha «Bugun ilovangizni buzib ko'rasiz va tuzatasiz.» va to'rt qadam (teglar `sub` so'zlaridan); `05-start` haqidagi `QIzoh`.
20. **A2 talabi** — o'quvchi promptida «Qayerda» — muammoga tegishli fayllar, «Backend'ga tegma» yo'q (05-FILTR 32, 33); `{buzish yozuvi}` faqat «buzildi» urinishlar; agentdan sabab so'raladi (o'quvchi darsdagi sabab bilan solishtiradi); `BUZISH.md` — alohida prompt, yozuv so'zma-so'z. Talabda texnologiya nomi yo'q.
21. **Mentor tuzatishining fayllari** (A2 kutilgan natija, REPO 2): `mobil/src/ulanish.ts` · `mobil/src/app/index.tsx` · `mobil/src/app/oyin/[id].tsx` — 4-dars kodiga bog'liq; «qur» da aniqlanadi.
22. **Final** — 6 bo'lak (`TUZATISH_YOLI`), 1-bo'lak «kutish avval», 5 va 6 alohida.
23. **9-ekran QIzoh** — xavfsizlik chegarasi (10-Modul 5-dars etika qatori naqshi), A1 1-qadamda qalin takror.
24. **Arena 2** — «Ulanguncha urinaveradi» (sukut `Infinity`; savol «Tarmoq uzilsa … sukutda» bilan chegaralandi — 05-FILTR 16); **arena 10** — «socket.io'dagi xona» (savolda kutubxona nomi — xona so'zi Telegram guruhi bilan aralashmasin).

## Shubhali joylar (ishonchim komil emas)
1. **Render «Manual Deploy» → «Deploy latest commit»** — rasmiy hujjat nomi (Manbalar 7); interfeysda ko'rilmagan, bepul xizmatda shu ko'rinishda ekani — pilotda (REPO 4). Qayta chiqarish vaqti («bir necha daqiqa») — o'lchanmagan.
2. **Fonga olish (2-usul):** telefon ilovani fonda qancha vaqt ushlab turishi va ulanishni uzishi Android va iPhone'da, Expo Go'da qanday — rasmiy manba topilmadi, qurilmada sinalmagan. Mentor yozuvidagi «buzilmadi» — yozilgan holat; REPO 4 da haqiqiy natija jurnalga, mos kelmasa MD yangilanadi.
3. **Expo Go + uchish rejimi:** uchish rejimi Metro (`npx expo start`) bilan aloqani ham uzadi; Expo Go qayta bog'langanda ilovani qayta yuklasa, 1-muammo ko'rinmay qolishi mumkin — sinalmagan (O'qituvchi eslatmasi, A1).
4. **Uzilishni payqash** — hujjat bo'yicha 45 s gacha. 05-FILTR 6 dan keyin o'zgarish belgi «Ulanmoqda…» bo'lgandan keyin qilinadi — shunda ilova ulanishni o'zi yopgan, hodisa eski ulanishga yetmaydi. Belgi o'tishidan oldin qilingan o'zgarish TCP orqali keyin yetib kelishi mumkin edi (sinalmagan) — shuning uchun qat'iy soniya olib tashlandi.
5. **Agent tekshiruv so'rovini yuborishi** — parol masalasi hal qilindi (03-FILTR 15, tayanch 9.35: agent akkauntni o'zi ochadi, seed akkauntlar ishlatilmaydi). `id` bo'yicha o'chirishni qanday qilishi (Backend yoki SQL; `DELETE … WHERE id = …`) — agent tanlaydi; Render'ga so'rov yubora olishi — «qur» pilotida.
6. **2 va 3-muammo 4-darsning yakuniy qurilgan kodiga bog'liq** (05-FILTR 2): `m12-dars-04-done` muhrlanishidan oldin 5-darsdagi uch muammo aynan takrorlanishi tekshiriladi (04-FILTR dan keyingi talablar bilan: uzilganda son yuboriladi, bitta hodisa — bitta `GET`); mos kelmasa — 5-dars sahnalari, `MENTOR_YOZUV` va testlar yangilanadi (tayanch 9.37).
7. **1-telefondagi eski «Hozir ko'ryapti»** (6-ekran) — xonada bo'lmagan ilova yangi sonni olmaydi, shuning uchun eski son turadi; haqiqiy ilovada nima ko'rinishi 4-dars kodiga bog'liq.
8. **Web-trek:** telefon brauzeri fonda sahifani to'xtatishi yoki ulanishni uzishi — sinalmagan; web-trekda «Hozir ko'ryapti» va jonli xabar 4-darsdagidek (tayanch 1.4) deb olindi.
9. **Final va testlarda «ilova»** — web-trekda «sayt»; pilot 02 kabi alohida so'z qo'yilmadi.
10. **Vaqt:** 14 dars ekrani + ikki blok (har birida Render'da qayta chiqarish) ≈ 90 daqiqaga zich; A2 dagi 3-usul qayta tekshiruvi uyga o'tishi ehtimoli katta (A-bo'lim 11).
11. **Jadval kataklaridagi va ekrandagi «→»** (qadam belgilari, «Manual Deploy» → «Deploy latest commit») — menyu yo'li, izoh emas; GATE M da ko'rsatiladi (T-035).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 18-ekran: besh sarlavha (to'liq · hammasi buzilmadi · qayta tekshirish qoldi · tuzatish qoldi · buzish boshlandi); ✓ yorlig'i faqat to'liq bajarilganda; A1 va A2 «Hammasi bajarilgach» ham holatga qarab (2 va 3 variant). Sarlavha o'quvchi ishini aytadi.
2. [x] **Da'vo isbot emas** — a) «Bu darsda kutish buzishdan oldin yoziladi» (13), uch usul — tayanch qoidasi, umumiy ta'rif emas · b) «Mentor misolida», «bu misolda» (2, 4, 6, 9-ekran xulosalari, kartochka, yakun 4-band), Mentor yozuvi — namuna (A1/A2 o'ng tomoni) ·
   c) «odatda bir necha soniyada», «bo'lishi kerak», «bir necha daqiqa cho'zilishi mumkin», «odatda o'zi qayta yuklaydi», arena 9 «qayta urinadi»; agent «bajardim» / «tuzatdim» / «o'chirdim» — da'vo (0, 11-ekran, A1 4-qadam, A2 3-qadam) ·
   d) «tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» — alohida tugma, alohida qadam (11-ekran, A2 3 va 4-qadam, final 5 va 6); «Shu telefonda, shu urinishda» (9-ekran, kartochka).
3. [x] **Maxfiy qiymat chiqmaydi** — A1 1-qadam: `git status` da `.env` yo'q; A1 3-qadam, A2 3 va 4-qadam: «`.env` qiymatlari, token va kalitlarni emas»; promptlar: «`.env` ga tegma»; `BUZISH.md` va kalitda shaxsiy ma'lumot yo'q (rol bilan).
4. [x] **Tashqi xizmat faqat rasmiy hujjat** — socket.io (Manbalar 1–5), Render (6–8): «Manual Deploy» → «Deploy latest commit» nomi rasmiy sahifadan, sana bilan; interfeysda ko'rilmagani — Shubhali 1; fonda uzilish — rasmiy manba topilmadi (Shubhali 2), o'quvchi matnida da'vo qilinmadi.
5. [x] **Har sonning manbasi va o'lchovi** — sonlar faqat Mentor misolidan («8 / 10», «9 / 10», «Hozir ko'ryapti: 1 / 2», bir daqiqa); «Hozir ko'ryapti» — ochiq ekranlar (ulanishlar) soni (6-ekran ✎, 3-savol «ekraningizni»); kutish vaqtlari — tayanch 9.19 va Manbalar 4–5; statistika yo'q.
6. [x] **Tayanchda yo'q narsa to'qilmagan** — o'zim qaror qilgan har tafsilot TAYANCHGA SAVOL 1–24 da (Mentor yozuvi, 3-usul yo'li, hook, sahna tugmasi, kod kartasi nomlari, kalit `null`, 12-ekran, nishonlar, uyga vazifa).
7. [x] **Saqlash kaliti o'qiydigan darsning ehtiyojidan** — `pm-m10d5-buzish` tayanch 8 sxemasi aynan (`buzildi: null` — TAYANCHGA SAVOL 8); `usul` barqaror, tartib o'zgarmaydi; ish fakti (`tuzatildi`) va natija (`qayta`) — alohida maydon; `pm-m10d3-talab` yo'q bo'lsa — o'quvchi o'zi yozadi (12-ekran, A2 qavsi).
8. [x] **Test: bitta himoyalanadigan javob** — 4 test + final + arena 12: variantlar bir shaklda, uzunlik skript bilan (O'lchov); distraktorlar darsning o'z sahnasiga zid (A: «Database: 9» · B: konvert bitta · D: bitta ulanish); tashqi xizmat haqida — sukut qiymatlariga mos (arena 2, 9, 10); «o'zini fosh qiladigan» variant yo'q; savoldagi son javobda takrorlanmaydi.
9. [—] **Keys: bank so'zi aynan** — dars keyssiz (Qaror-0 22), brend va real kompaniya keysi yo'q.
10. [x] **90 daqiqa** — vaqt taqsimoti tepada va A-bo'lim 11; A1 3-usulda Render kutishi paytida ish (yozuvni qayta o'qish); «Ulgurmasangiz» ikkala blokda; «Ortda qoldingizmi» (`05-start`, `05-done`); O'qituvchi eslatmasi 1-ekran va A1.
11. [x] **Bir ma'no — bir so'z** — «hodisa» faqat ulanish hodisasi (`connect` — hodisa deyilmaydi); «xabar» — faqat «jonli xabar» (agentga — «yozing»); «tekshirish» — o'z ishi, «sinov» yo'q; «holat» — uch birikmada (TAYANCHGA SAVOL 15); «e'lon» — faqat o'yin e'loni; «push» — faqat `git push`; «takror» ildizi — ochiq savol (TAYANCHGA SAVOL 15).
12. [x] **Web-trek teng yo'l** — A1: saytni telefon brauzerida ochish, uchish rejimi telefonda, kutilgan natija — brauzer oynasi; A2: `prototip/`, «Yangilash» tugmasi, `git push` → Netlify; uch usul ikkala trekda bir xil; test va final ikkala trekka to'g'ri (Shubhali 8, 9).
13. [x] **Agent va o'quvchi ishi ajratilgan** — qaror o'quvchida: kutish (12), belgi (A1), «tuzatildi» va qayta tekshiruv natijasi (A2); agent faqat so'rov yuboradi va tuzatadi; tekshiruv yozuvlari aytgan `id` lari bo'yicha o'chiriladi (A1 3, 4-qadam); `DELETE` faqat `id` bo'yicha (REPO 4).
14. [x] **O'smir xavfsizligi** — buzish faqat o'z ilovasida (9-ekran `QIzoh`, A1 1-qadam qalin, arena 12, kartochka 1); o'zgarishni tekshiruv akkaunti (agent) yoki sherik o'z akkauntida qiladi, haqiqiy odamning akkaunti ishlatilmaydi (A1 prompti); Expo akkaunti ma'lumoti berilmaydi; shaxsiy ma'lumot yozilmaydi.

## O'lchov (scratchpad `md05/olchov.py`, 06.10.2026)
Skript natijasi (oxirgi tahrirdan keyin; `!!!` — chegaradan oshgan joy: yo'q). Belgilar — oddiy `len`, «**» va ✔ siz. Qavsdagi sonlar MD ichida skript bilan tekshirildi (farq — 0).
Hook javoblari «Aynan!» / «Qiziq fikr!» bilan sanaldi (lint ham shunday sanaydi). Test variantlari ±15% ichida; to'g'ri javob hech bir testda yolg'iz eng uzun emas. QIzoh qatorlariga chegara yo'q (bitta qator); eng uzuni — 1-ekran `05-start` qatori, 108.
Mentor gaplari: interaktiv ekranlarda 1 gap (8-ekran QKod — 2 gap, pilot 02 9-ekran naqshi), Reja — 2 gap.

```
## Sarlavhalar (≤55)
   45  Ulanish uzilsa ham ishlashini qanday bilasiz?
   46  Bugun ilovangizni buzib ko'rasiz va tuzatasiz.
   44  Internet qaytgach, ekranda qaysi son turadi?
   40  Qayta ulanganda qaysi kod yana ishlaydi?
   41  Qayta ulangan ilova o'yin xonasida bormi?
   47  Tinglovchini bir marta qo'shadigan kod yozamiz.
   46  Uch usuldan qaysilari Mentor ilovasini buzadi?
   43  Agent «tuzatdim» desa, buni qanday bilasiz?
   44  Har usuldan oldin nima kutishingizni yozing.
   46  Buzishdan qayta tekshiruvgacha qaysi tartibda?
   50  Ilovangizni uch usul bilan buzing va yozib boring.
   50  Topilgan muammolarni tuzating va qayta tekshiring.
   25  O'zingizni sinab ko'ring.
   50  Topilgan muammolar tuzatildi va qayta tekshirildi.   [yakun]
   41  Uch usul bajarildi — ilovangiz buzilmadi.   [yakun]
   42  Tuzatish qilindi — qayta tekshirish qoldi.   [yakun]
   35  Muammolar yozildi — tuzatish qoldi.   [yakun]
   50  Buzish boshlandi — qolgan usullarni uyda bajaring.   [yakun]
## Xulosalar (≤110)
   90  Bu misolda uzilish paytida yuborilgan hodisa keyin kelmadi: belgi «Ulangan», son esa eski.
  109  `connect` ichidagi kod qayta ulanishda ham ishlaydi: tinglovchi uning ichida bo'lsa, yana bittasi qo'shiladi.
   92  Uzilganda ulanish xonadan chiqdi; bu misolda qayta ulangan ilova xonaga o'zi qaytib kirmadi.
   91  Bu kodda tinglovchi bir marta qo'shiladi; `connect` esa har ulanishda sonni qayta so'raydi.
   89  Mentor misolida uch urinishdan ikkitasi buzildi; «buzilmadi» ham natija — u ham yoziladi.
   104  «Tuzatish qilindi» — ish qilindi; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija.
   85  Kutishingiz yozildi — amaliyotda har urinishdan keyin nima bo'lganini yoniga yozasiz.
   84  Bu darsda kutish buzishdan oldin yoziladi — shunda natija bilan solishtirsa bo'ladi.
## Hook javoblari (≤120)
  105  Aynan! Chekka holat oddiy paytda ko'rinmaydi. Uni o'zingiz yuzaga keltirasiz va nima bo'lganiga qaraysiz.
  110  Qiziq fikr! Hozir internet bor edi. Talabdagi chekka holat esa uzilishda bo'ladi — uni hali hech kim ko'rmadi.
  103  Qiziq fikr! Agentning «bajardim» degani — da'vo. Natijani o'zingiz ko'rmaguningizcha, u tekshirilmagan.
## Hook variantlari
   38  Hozir ishladi — uzilishda ham ishlaydi
   40  Internetni o'zim uzib, natijaga qarayman
   43  Agent «bajardim» dedi — shuning o'zi yetadi
## Xato izohlari / QXato / shart (≤60)
   48  Sahnada «Database: 9» edi — qo'shilish yozilgan.
   51  Ikki marta sanash uchun hodisa avval kelishi kerak.
   48  Ulanish haqiqatan tiklangan — belgi to'g'ri edi.
   42  Sahnada Backend'dan nechta konvert chiqdi?
   59  Ikkinchi telefonda bitta bosish bo'ldi — konvert ham bitta.
   60  Muammo ulanishlar sonida emas — tinglovchi qayta qo'shilgan.
   39  Uzilganda ulanish xonadan o'zi chiqadi.
   38  Sahnada o'yin ekrani ochiq turgan edi.
   47  Ikkinchi telefon xonaga endi kirdi — u sanaldi.
   51  `'oyin-ozgardi'` tinglovchisi bir marta qo'shilsin.
   41  Qayta ulangach son o'zi «9 / 10» bo'lsin.
   49  Kutilgani bilan bo'lganini yana bir solishtiring.
   51  «Tuzatish qilindi» faqat kod o'zgarganda qo'yiladi.
   42  Yozuvsiz qaysi usul bajarilgani unutiladi.
   42  «Buzildi» kutilgani bo'lmaganda qo'yiladi.
   56  «Nima kutaman» bo'sh — ekranda nima ko'rinishini yozing.
   43  Tartib mos emas — bo'lakni bosib qaytaring.
## QIzoh qatorlari
  108  Mentor misolida `m12-dars-05-start` — agent «bajardim» deganidan keyingi kod; muammolar shu darsda topiladi.
   62  Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi.
   69  Tuzatish: tinglovchi bir marta qo'shiladi — `connect` dan tashqarida.
   73  Tuzatish: qayta ulanganda ilova ochiq turgan o'yin xonasiga qayta kiradi.
   75  Bu oynada `ulanish` — namuna: haqiqiy Backend emas, uzilishni tugma qiladi.
  100  Buzib tekshirishni faqat o'z ilovangizda qilasiz. Boshqa odamning ilovasi yoki sayti tekshirilmaydi.
   76  Qayta tekshiruvda yana buzilsa — shuni yozib, yozuvni agentga qayta berasiz.
## Nom qatorlari
   70  Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish — buzish.
  105  Uzilgan ulanishni qayta tiklash — qayta ulanish: socket.io bunga o'zi urinadi, odatda bir necha soniyada.
   66  Bitta o'zgarish ilovaga ikki marta ta'sir qilishi — takror hodisa.
   79  Har urinishga uch qator — nima qildim, nima kutdim, nima bo'ldi: buzish yozuvi.
   62  «Tuzatish qilindi» — kodda o'zgartirish qilindi: bu ish fakti.
## Bloklar «Hammasi bajarilgach»
   76  Uch usul bajarildi va yozildi: topilgan muammolar keyingi blokda tuzatiladi.
   56  Uch usul bajarildi: ilovangiz buzilmadi — bu ham natija.
   65  Tuzatish qilindi va qayta tekshirildi: yozuvingiz `BUZISH.md` da.
   65  Tuzatish qilindi, bitta urinish yana buzildi — uyda davom etasiz.
   56  Yozuvingiz `BUZISH.md` da: uch usul ilovangizni buzmadi.
## Mentor gaplari (gap soni)
  1 gap · 112  Mentor misolida agent talabdagi uch chekka holatni «bajardim» dedi — ikkinchi telefonda «Qo'shilaman» ni bosing.
  1 gap · 41  Endi o'ngdagi javoblardan birini tanlang.
  2 gap · 103  Avval Maydon Jamoa'da uch muammoni topib, sababini ko'rasiz. Keyin xuddi shuni o'z ilovangizda qilasiz.
  1 gap · 78  Birinchi telefonda uchish rejimini yoqing va qadamlarni tartib bilan bajaring.
  1 gap · 102  Backend tugunidagi «Yangi versiya» ni bosing va telefon ostidagi kodning yonadigan qatorlariga qarang.
  1 gap · 73  Avval «Yangi versiya» ni bosing, keyin ikkinchi telefonda o'yinni oching.
  2 gap · 115  Agent tinglovchini `connect` ichiga yozgan. Uni tashqariga chiqaring — `connect` ichida faqat qayta so'rash qolsin.
  1 gap · 76  Har urinishni bosing: kutilgani bilan bo'lganini solishtirib, belgi qo'ying.
  1 gap · 47  Uch urinish yozildi — pastdagi xulosaga qarang.
  1 gap · 98  Avval yozuvni agentga yuboring, keyin «buzildi» belgili ikki urinishni o'sha usul bilan qaytaring.
  1 gap · 73  Talabingizdagi chekka holatlardan boshlang: har usulga bittasini tanlang.
  1 gap · 43  Bo'laklarni bajariladigan tartibda joylang.
  1 gap · 121  Kod yozilmaydi: agent faqat boshqa akkaunt nomidan o'zgarish qiladi, kuzatish va yozuv — sizda; «1 · Ochish»dan boshlang.
  1 gap · 118  Yozuvingizni agentga so'zma-so'z berasiz: tuzatishni u qiladi, natijani esa siz tekshirasiz; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  ## 3 · 1-savol ✔ (jonli ball)  · savol 8 so'z · variantlar [38, 37, 37, 35] · eng uzun 38 / eng qisqa 35 · OK
      A   38  Backend qo'shilishni hali yozmagan edi
      B   37  Ilova hodisani ikki marta sanagan edi
      C✔  37  Uzilishdagi hodisa keyin kelmagan edi
      D   35  Belgi ulanishni xato ko'rsatgan edi
  ## 5 · 2-savol ✔ (jonli ball)  · savol 10 so'z · variantlar [40, 42, 42, 42] · eng uzun 42 / eng qisqa 40 · OK
      A✔  40  Tinglovchi har ulanishda yana qo'shilgan
      B   42  Backend bitta hodisani ikki marta yuborgan
      C   42  Ikkinchi telefon tugmani ikki marta bosgan
      D   42  Ilova ikkita alohida ulanish ochib qo'ygan
  ## 7 · 3-savol ✔ (jonli ball)  · savol 7 so'z · variantlar [42, 42, 40, 37] · eng uzun 42 / eng qisqa 37 · OK
      A   42  Backend uzilgan ulanishni xonada qoldirgan
      B   42  Ilova qayta ulangach o'yin ekranini yopgan
      C   40  Ikkinchi telefon o'yin xonasidan chiqqan
      D✔  37  Yangi ulanish o'yin xonasiga kirmagan
  ## 10 · 4-savol ✔ (jonli ball) · savol 9 so'z · variantlar [33, 27, 29, 29] · eng uzun 33 / eng qisqa 27 · ±15% ichida (05-FILTR dan keyin) · OK
      A   33  «Tuzatish qilindi» — muammo yo'q
      B✔  27  «Buzilmadi» — bu ham natija
      C   29  Hech narsa — yozuv kerak emas
      D   29  «Buzildi» — chunki tekshirdim
## Arena (12) — ✔ o'rni va variant uzunliklari
   1. ✔A · 6 so'z · [28, 27, 25, 31] · OK  Uchish rejimi yoqilsa, ulanish nima bo'ladi?
   2. ✔B · 7 so'z · [26, 22, 26, 22] · OK  Tarmoq uzilsa, socket.io sukutda necha marta urinadi? (05-FILTR 16)
   3. ✔C · 5 so'z · [34, 31, 34, 28] · OK  `connect` ichidagi kod qachon ishlaydi?
   4. ✔D · 3 so'z · [35, 28, 30, 32] · OK  Takror hodisa nima?
   5. ✔A · 8 so'z · [34, 30, 32, 38] · OK  Qayta ulanganda Mentor ilovasi ro'yxatni nega qayta so'raydi?
   6. ✔B · 6 so'z · [28, 27, 22, 23] · OK  Buzish yozuvida qaysi uch qator bor?
   7. ✔C · 8 so'z · [29, 35, 35, 30] · OK  Agent «tuzatdim» dedi, qayta tekshirmadingiz. Yozuvda nima turadi? (05-FILTR 11)
   8. ✔D · 6 so'z · [34, 33, 31, 34] · OK  Tuzatishni qaysi usul bilan qayta tekshirasiz?
   9. ✔A · 9 so'z · [31, 35, 28, 29] · OK  Render yangi versiyani ishga tushirsa, ochiq ulanishlar nima bo'ladi?
  10. ✔B · 4 so'z · [16, 19, 18, 19] · OK  socket.io'dagi xona qayerda turadi?
  11. ✔C · 7 so'z · [23, 29, 24, 28] · OK  Mentor misolida fonga olish urinishi nima ko'rsatdi?
  12. ✔D · 4 so'z · [27, 26, 21, 24] · OK  Kimning ilovasini buzib tekshirasiz?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Ekranlar
  19 ekran: 0 Kirish — agent «bajardim» dedi | 1 Reja | 2 Internet uzilsa | 3 1-savol ✔ (jonli ball) | 4 Qayta ulanish | 5 2-savol ✔ (jonli ball) | 6 Xonaga qaytish | 7 3-savol ✔ (jonli ball) | 8 Tinglovchi bir marta | 9 Uch usul va buzish yozuvi | 10 4-savol ✔ (jonli ball) | 11 Tuzatildi va takrorlanmadi | 12 Buzish rejangiz | 13 Buzishdan qayta tekshiruvgacha (f | 14 Amaliyot 1 — ilovangizni buzing | 15 Amaliyot 2 — tuzating va qayta te | 16 Natijalar (podium) — umumiy shabl | 17 Takrorlash | 18 Yakun
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-04` «Loyiha kuni: jonli xabar va eslatma» → **`m10-05` «Ulanish uzilsa: buzamiz va tuzatamiz»** (osti «uzilish, takror hodisa, qayta ulanish — uchta muammo») → `m10-06` «Birinchi foydalanuvchilar sizni qayerdan topadi?»; reja teglari `sub` so'zlari bilan; yakundagi «Keyingi dars» — `00-NOMLAR.md` 6-qator. App.jsx 401–403-qatorlar (grep 06.10): `m10-04` · `m10-05` (`type: 'Kod'`, `comp` siz) · `m10-06` — title va `sub` aynan shu MD dagidek.
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — real vaqt sahnasi (`IkkiTelefonSahna`) + buzish yozuvi kartasi (bitta manba `MENTOR_YOZUV`); o'quvchining o'z ilovasi — 12-ekran va bloklar. Keyssiz.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 6, 9, 11 (va 0, 8, 12, 13, 14, 15) — matn-karta yo'q; bashoratlar (2, 4, 6, 9, 11) tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi.
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1; QKod — 2) va sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — o'lchov skripti (O'lchov bo'limi).
- [x] Atamalar tayanch 2, pilot 02 va 11-Modul bilan bir xil (ulanish belgisi «Ulangan» · «Ulanmoqda…» · «Ulanmagan», tinglovchi, hodisa, xona, «Hozir ko'ryapti», jonli xabar, chekka holat, qayta ulanish, takror hodisa, buzish, buzish yozuvi, talab, agent, `korsat()`, `sora()`, `ulanish`);
      siz-forma; tugma ot-shaklda yoki natija nomi («Buzildi», «Buzilmadi», «Tuzatish qilindi», «Yangi versiya», «Nusxalash», «Bajardim»); agent promptlari va chat pufaklari — T-002 / T-008 istisnosi; Mentor yozuvi — olam matni (T-008). «takror» ildizi — TAYANCHGA SAVOL 15.
- [x] Testlar: variantlar bir shaklda, uzunligi ±15% (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z/kod/tire faqat to'g'rida emas (4-savolda tire hammasida; 2-savolda «ikki» uch variantda) · ✔: s3 C · s5 A · s7 D · s10 B · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (3, 5, 7, 10, 13).
- [x] Final: uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «kafolat», «bir zumda» — o'quvchi matnida 0; grep 06.10 — topilganlari faqat MD izohlarida).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2, `m10-05`, kod raqami, «pilot»); modul raqami LMS bo'yicha («11-Modul» faqat MD izohlarida); tarixiy voqea yo'q; tashqi xizmat tugmasi — faqat Render «Manual Deploy» → «Deploy latest commit» (rasmiy nom, Manbalar 7); T-038 va'da-qatori yo'q — kelajak faqat yakun qatorida · «KOD» (17) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (buzish, qayta ulanish, takror hodisa, buzish yozuvi — harakatdan keyin nom qatorida; sarlavhalarda yangi atama yo'q — «buzamiz» faqat dars nomida, TEX qoidasi) · T-014/015 (TAYANCHGA SAVOL 4, 15) · T-016/017 (metafora yo'q) · T-024 · T-029 (Mentor «Bu…» bilan boshlanmaydi) ·
      T-034 · T-039 («ilovangiz», «talabingiz» — oldingi darslardan bor) · T-042 · T-043 («Mentor misolida», «bu misolda») · T-044 · T-045 (`connect` — hodisa emas; uzilishdagi hodisa «bu misolda» kelmaydi; «Hozir ko'ryapti» — ekranlar soni) · T-047 · T-048 · T-049 (yakun — o'quvchi ishi) · T-052 · T-064 · T-066 · T-070 ·
      P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-025 · P-026 (xato yo'li, ayb o'quvchida emas) · P-028 (Render tugmasi — rasmiy nom; Shubhali 1) · P-036 · P-046 (yakun va blok natijasi o'quvchi yozuvidan) · P-052 · P-055 · P-059 · P-062 · P-063 (`MENTOR_YOZUV`, `TUZATISH_YOLI`, `USULLAR`) · P-064 · P-065 (4-ekran kod kartasi) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 (bashoratlar o'sish tartibida) · S-018 (brend yo'q) · S-019 · S-020 · S-026 · S-040 · SABOQ 6, 9, 11, 12, 13, 16, 17, 19–31.
- [ ] **Tayanch bilan to'liq moslik — ochiq:** TAYANCHGA SAVOL 1 (3-usul `git push` o'rniga Render'da qo'lda qayta chiqarish) va 2 (Mentor yozuvi, fonga olish — «buzilmadi») foydalanuvchi qarorini kutadi; tasdiqlanmaguncha bu band belgilanmaydi.
