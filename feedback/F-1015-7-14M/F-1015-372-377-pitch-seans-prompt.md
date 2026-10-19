# Pitch-seansga topshiriq: m12-01 «Investor uchun pitch» — QA fidbek F-1015-372…376 (19.10)

Salom. Men 7–14-M QA seansiman. QA m12-01 (`src/12-Modull/PmInvestorPitchLesson.jsx`, sening darsing — 222-qonun, ffd6e14a) bo'yicha fidbek berdi. Men faylga TEGMADIM. Retsept B: avval tashxis+taklifni foydalanuvchiga ayt, tasdiqdan keyin tuzat.

**Kontekst:** QA suratlari ESKI bilddan (16 ekran). Men har topilmani sening YANGI 10-ekranli versiyangda tekshirdim — pastda faqat yangi versiyada QOLGAN muammolar. Rasmlar: `feedback/F-1015-7-14M/F-1015-372…377-*.png` (eski bild). Yangi versiya suratlarim: `feedback/F-1015-7-14M/suratlar/F-1015-372-hozir/` (d-uz-s1…s5, s2/s3-taxmin). QA so'zlari: «darsda ma'lumot ko'p, har gap yoki so'zga bitta karta — overload»; «har so'zga karta qilinsa element ko'p, main divga solish kerak»; «border-line, kichkina alohida elementchalar hamma joyda»; «tepadagi kartani (Investor) birlashtirsak, Muammo chiplari ham shu bitta kartada bo'lsa — sochilib yotmaydi»; «3 ta harf yozdim — badge berdi»; «sahifada 3 ta element progressni ko'rsatyapti».

## 1. F-1015-372 — s1 Reja: har bo'lakka alohida karta
Yangi versiyada «Dars oxirida» ustunida 6 ta chegarali karta (Muammo…Keyingi qadam) + o'ngda 4 karta. Taklif: chapda bitta karta, ichida 6 bo'lak qator (chegarasiz, oraliq bilan) + vaqt chizig'i; DE 213.3 (bitta chegarali quti, ichi chegarasiz).

## 2. F-1015-374/375 — s2, s3: elementlar sochilgan, ichma-ich chegaralar
- s2 (surat `d-uz-s2-taxmin.jpg`): Investor kartasi alohida, ostida 5 ta chegarali bo'lak-qator, alohida stepper-chip «1 Investor savollari». Taklif: Investor + bo'laklar bitta kartada, qatorlar chegarasiz.
- s3 (`d-uz-s3-taxmin.jpg`): Investor kartasi, bo'lak-chiplar qatori, «Bozor» kartasi (ichida bo'sh «1 2 3» uyalar — DE 159 bo'sh-holat ramkasi), o'ngda alohida son-kartasi — to'rt alohida blok. Taklif (QA aytgani): Investor savoli + bo'lak-chiplar + joriy bo'lak bitta kartada; bo'sh uyalar o'rniga to'lgan qatorlar paydo bo'ladi; son-kartasi joriy savol ostida.
- QA: kichik elementlarda chegara hamma joyda — DE 213.3: ichki qatorlar chegarasiz, fon-tint bilan.

## 3. F-1015-376 — bosqich bir necha joyda + 3 harfga nishon
- DE 213.21 (bosqich bitta joyda): s2 — stepper-chip + pastki tugma «(0/3)»; s3 — stepper «1 Bozor · 2 Jamoa · 3 Keyingi qadam» + «(0/3)»; s5 — «Pitchim» + 1…6 stepper + «(0/6)». Stepper bo'lsa — pastki tugmadan son olinadi (men 7–14-M da 15 komponentni shunday tuzatdim, `vositalar/s177/b366.mjs` skaneri).
- s5 mustaqil: «mmm» saqlanadi va «Fresh Numbers!» beriladi — `tekshir()` faqat bo'shlikni qaraydi. Men qolipga umumiy `manoliMatn(s)` yordamchisini qo'shyapman (F-1015-377, `src/qolip/index.jsx` dan import) — `tekshir()` ga `if (!manoliMatn(s)) return { x: 'manosiz', blok: true }` va xabar «Bu javob o'qilmaydi — so'z bilan yozing.» qo'shsang bo'ladi. U chiqqach shu faylda nomi va yo'li yoziladi.

## 4. Passivlik (DE 213.22, yangi)
s2/s3 Mentor «Tugmalarni birma-bir bosing» — o'quvchi faqat bosadi. Yangi qoida 213.22: har qadamda qaror (variant + xatosiga sabab). Pilotlar: m10-01 s2, m11-01 s7, m11-02 s4, m11-05 s2/s5. Foydalanuvchi bu usulni tasdiqladi («xop maqul») — m12-01 da qo'llasang mos keladi.

## Yakun
`npm run gates -- src/12-Modull/PmInvestorPitchLesson.jsx` 13/13 + `lint:jsx`; suratlar; jurnalingga F-ID bilan; 14-M QA sayti: `bash feedback/F-1015-7-14M/vositalar/deploy-qa.sh 12` (`S=` + `$S/kf.txt`). Commit — foydalanuvchi buyrug'i bilan. Men m12-01 ga tegmayman.
