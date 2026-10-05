# 9-Modul — quruvchi saboqlari (pilotlardan, MAJBURIY)

> Har quruvchi/vizual agent topshirig'iga shu fayl qo'shiladi. Manba — foydalanuvchining pilot fidbeki (F-ID qavsda).
> Umumiy qonunga muhrlash asosiy seansda (JURNAL «MEXANIZM-TAKLIF» 12) — bu fayl 9-Modul ichida darhol ishlaydi.

## 1-dars pilotidan (05.10.2026, F-1005-75…83)

1. **Yonma-yon kartalar bir balandlikda**, pastki cheti bir chiziqda. Bo'sh siluet/katakcha bilan kartani cho'zish yo'q (F-1005-75).
2. **Brend yoki mahsulot aytilsa — sahnada ko'rinadi:** nomi o'z rangida, tanish maketda (telefon ekrani, brauzer oynasi, chat oynasi), birinchi ko'rinishda bir qatorli «bu nima» izohi.
   Faqat nom va KIM qatoridan iborat matnli karta — RAD. Logotip chizilmaydi (PM-028, PM-029, S-018; F-1005-76, 78, 80).
3. **Keys sahnasi jonli:** matnda aytilgan har narsa (fleshka, video, kutish ro'yxati…) sahnada chizilib ko'rinadi va bosqichga qarab o'zgaradi. Bloklardan yasalgan mavhum maket — RAD.
   Sifat namunasi: `src/6-Modull/PmLesson22.jsx` `AltairMock` (m6-02) va m6-14 Airbnb `DeckMock` (F-1005-80).
4. **Ekranga kirganda bo'sh, ma'nosiz element yo'q.** Javobga bog'liq vizual (masalan, savol ustidagi KIM kartasi) javob tanlangandan keyin paydo bo'ladi (F-1005-77).
5. **«Bot» so'zi odamga nisbat berib o'qilmaydi:** «Sinfingizda to'rtta bot bor» → «Sinfingizda 4 ta Telegram bot bor». Gapda sinf/sinfdosh/odam bo'lsa — «Telegram bot» (F-1005-77).
6. **Test savolida «To'g'ri javobni tanlang» yorlig'i yo'q** — skeletdan ko'chirilmaydi (F-1005-82).
7. **Kartada rangli yon chiziq yo'q** — «mahsulot» belgisi faqat yorliqda (qaror 79 A, F-1005-79).
8. **Voqea ekranida bosqich gapini Mentor aytadi:** Mentor gapi har bosqichda almashadi, sahnada faqat bosqich nomi va jonli maket; yakuniy xulosa pastda yashil (qaror 81 A, F-1005-81).
9. **Ko'p elementli mashq ketma-ket:** bir vaqtda bitta element katta karta bo'lib chiqadi, natija ko'rinadigan joyga uchib boradi; bo'sh uzuq qatorlar bilan to'ldirilgan ro'yxat yo'q (F-1005-83).
10. **12/12 darvoza — sifat emas.** Vizual bosqichda har ekran surati 6-Modul namunasi bilan yonma-yon ko'riladi; hisobotda «namuna bilan solishtirildi: ekran N» deb yoziladi.

## 7-dars pilotidan (05.10.2026, F-1005-84…88)

11. 🔴 **QAT'IY: keyingi harakat har doim ko'rinadi.** Ekranga kirgan o'quvchi 3 soniyada nimani bosishni ko'radi: faol element ajralib turadi (yengil puls/halqa, kerak bo'lsa qisqa yorliq), Mentor gapi aynan shu harakatni aytadi.
    Bashorat tanlangach YOPILMAYDI — tanlangan variant ixcham qator bo'lib natijagacha turadi; skelet naqshi `bashorat={!taxmin && …}` ishlatilmaydi (F-1005-85, 87).
12. 🔴 **QAT'IY: kartochkalar — alohida ekran** (podium → kartochkalar → yakun), yakun ichida emas. Loyiha kuni va PM+PRAKT darslari shuning uchun 12 ekran (F-1005-88; P-058 va 9M-PRAKT P-q0 dan farq — foydalanuvchi qarori 05.10).
13. **Bir nechta tanlov birdaniga to'kilmaydi** — bo'laklar ketma-ket ochiladi (SABOQ 9 bilan bir) (F-1005-84).
14. **Namuna: amaliyot bloki (QBlok)** — 7-dars A1 ko'rinishi foydalanuvchiga ma'qul («zo'r»): chapda qadamlar, o'ngda kutilgan natija, pastda zaxira teg. Blok shakli o'zgartirilmaydi (F-1005-86).

## Pilotlar 2-ko'rigidan (05.10.2026, F-1005-89…92)

15. 🔴 **MD matni o'zboshimcha o'zgarmaydi.** Sahnaga qo'yilgan taqiq (masalan «avtobus chizilmaydi») Mentor gapiga yoyilmaydi; GATE M dagi gap aynan qoladi.
    Matnni o'zgartirish kerak tuyulsa — o'zgartirmang, hisobotda «MD ga taklif» deb yozing (F-1005-89).
16. 🔴 **Kartochka ekrani: Mentor yo'q** (KORPUS §61). Karta ostida, birinchi bosishgacha yorliq «Kartani bosing — javob ochiladi» (ru «Нажмите на карточку — откроется ответ»), karta yuzi halqada.
    Naqsh: 1-dars `ScreenFlashcards` (`pp-flash` / `pp-fc-ipucha`) yoki 7-dars (`mf-flash` / `mf-fc-ipucha`) — o'z prefiksingiz bilan. Tugma «Yakunlash →» (platforma shakli) (F-1005-91).
17. **Mashq tugagach yig'ilgan ro'yxat — bitta ixcham qator** (nom · holat · «10 / 10 ✓»), o'qib bo'lmaydigan kulrang chiziqlar emas (SABOQ 4; F-1005-90).
18. **Yakun:** ichki skroll qutisi yo'q; nishonlar sahifa skrolli bilan chiqishi mumkin — platforma shakli, ikki ustunga bo'linmaydi (F-1005-92).

