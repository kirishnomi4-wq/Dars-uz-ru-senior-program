# 7-dars «Loyiha kuni: MVP — birinchi ekran» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 8/10. Hukm: Qabul 13 · Qisman 2 · Rad 2. Tayanchga tegadigan qaror yo'q — qo'llandi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Agent aytilganini quradi» — kafolat | **Qabul** | Asosiy fikr: «Agent talabga tayanib quradi; noaniq yoki aytilmagan joyni taxmin qilishi mumkin — shuning uchun natijani talabning har qatori bo'yicha tekshirasiz.» Kartochka: «joyni boshqacha talqin qilishi mumkin». |
| 2 | «Talab uch qismli» — universal qoida bo'lmasin | **Qabul** | «Bu darsda …» chegarasi: A-bo'lim, 2-ekran xulosasi, yakun, takrorlash sarlavhasi, kartochka. |
| 3 | Hook: «Aynan!» / «Qiziq fikr!» | **Rad** | Qonun talab qiladi (T-028, M5-03) — 1–6-darslardagi bilan bir xil. |
| 3a | «Agent buyruqni bajardi» — qat'iy | **Qabul** | Ikkala javob: «Bu misolda …» / «Muammo agentda ham, uzunlikda ham emas …». |
| 4 | «Nima buzilmasin» buzilmaslikni kafolatlamaydi | **Qabul** | A2 Mentori: «u agentga nimani saqlashni aytadi, tekshiruv esa baribir sizda»; kartochka; A-bo'lim. |
| 5 | A1 namuna bandlari qayta yuborilsa ikki marta yoziladi | **Qabul** | Prompt: «namuna bandlari bo'lmasa — qo'sh; bor bo'lsa, qayta qo'shma». 4-darsdagi `kun + soat` noyobligi bilan birga ikki himoya. |
| 2-ekran | «Har qism faqat o'z joyini tuzatadi» — dars mexanikasi | **Qabul** | Xulosa: «Bu mashqda har qism bitta muammoni yopdi»; KOD izohida chegara. |
| 4-ekran | «Uch qism bilan qayta yozasiz» → «aniq yozib, tuzattirasiz» | **Qabul** | Xulosa, yakun, kartochka. |
| A3 | Backend'ni ataylab to'xtatish izohi | **Qabul** | «Xato holatini ko'rish uchun Backend'ni ataylab to'xtating». |
| CORS | `localhost:5173` — to'g'ri, deployda boshqa manzil | **Qabul** | O'zgarmadi (9-dars deploy). |
| S1 | Reja sarlavhasi → savol | **Rad** | Reja ekrani — natija-gap (1–6-darslar bilan bir xil). |
| S2 | «Agent vazifani qanday aniq tushunadi?» | **Qisman** | Faqat «to'g'ri» yumshatildi (audit ham shuni aytgan): «Promptga nima qo'shsangiz, agent aniqroq quradi?» |
| S7 | «Talab yozildi — natija ham mosmi?» | **Qisman** | Yakun shakliga moslab: «Birinchi ekran tayyor: talab bo'yicha tekshirildi.» |
| A1–A3 | blok sarlavhalari normal | **Qabul** | O'zgarmadi. |
| Arena 10 | «Talabga texnologiya nomi kerakmi? — Yo'q» universal emas | **Qabul** | «Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi? — Yo'q, stack repo'da tanlangan» (P-060 bilan mos). Kartochka ham. |
| Testlar | 3, 5-ekran — yaxshi | **Qabul** | O'zgarmadi. |
