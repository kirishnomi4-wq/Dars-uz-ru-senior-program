# 6-dars «Birinchi odam kirganda nimani ko'rasiz?» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7/10 (analitika mantig'i 5.5). Hukm: Qabul 12 · Qisman 3 · Rad 1. Tayanchga tegadigan qaror yo'q (mashq raqamlari 12 · 9 · 2 va qadam nomlari qoladi) — qo'llandi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 12 → 9 → 2 dan «7 odam to'xtadi» — uch son bir xil o'lchov emas (Views · har bosish · Database qatori) | **Qabul** | Eng muhim topilma, rost. Mashq uchun shart aytiladi: «Bu mashqda har odam har qadamda bir marta sanaladi» (2-ekran izoh-qatori, 3-ekran paneli). A-bo'limga 5a: real Umami'da uch son har xil sanaladi, ayirilmaydi — faqat pasayish belgisi. A2 natijasi ostiga izoh-qator. Yakundagi «farqi — to'xtagan odamlar» olindi. |
| 2 | «Saytni ochdi = Visitors» — aniq emas | **Qisman** | Qadam nomlari qoladi (tayanch, M-q3; mashqda odam sanaladi). Real tekshiruv: A1 «Views (sahifa ochilishlari) soni oshdi», natija «Views dan». Auditning «Sayt ochildi» nomi — olinmadi (tayanchdagi uch qadam nomi). |
| 3 | «Analitika qadamni ko'rsatadi, sababni emas» → «qayerda, sababini emas» | **Qabul** | 2-ekran xulosasi: «Bu misolda eng katta pasayish — vaqt tanlashdan keyin. Analitika muammo qayerdaligini aytadi, sababini emas.» |
| 4 | «Birinchi odamdan oldin ulanadi» — mutlaq | **Qabul** | Asosiy fikr, yakun, kartochka: «Bizning MVP da …». |
| 5 | `VITE_UMAMI_ID`: `index.html` da `%VITE_UMAMI_ID%`; `.env` = sir modeli berilmasin | **Qabul** | A1 prompti: `data-website-id="%VITE_UMAMI_ID%"`. 3-qadam: «Bu ID maxfiy emas — `.env` da turishining sababi: u har o'quvchida boshqa.» |
| 6 | `data-umami-event="vaqt-tanladi"`, ≤50 belgi — to'g'ri | **Qabul** | O'zgarmadi. |
| 7 | «Umami o'zi yozadi» → «sahifa ochilishini avtomatik yozadi» | **Qabul** | Yorliq «Avtomatik yoziladi»; xulosa va izohlar — «Sahifa ochilishini Umami avtomatik yozadi». 6-ekran sarlavhasi qoldi (audit ham saqlaydi). |
| 8 | A1 «Visitors — 1» ishonchsiz | **Qabul** | «Views soni oshdi». |
| 9 | Reklama to'sgich: «bu sizning xatongiz emas» shart emas | **Qabul** | «0 qolsa — reklama to'sgich skriptni to'smaganini tekshiring.» Kartochka ham. |
| 7-ekran | «Oxirgisi = bosh raqam» — har mahsulotda emas | **Qabul** | Mentor, xulosa, kartochka: «bu darsda oxirgisi — bosh raqam». |
| Asosiy savol | «Nechta odam qayerda to'xtadi?» → «Qaysi qadamdan keyin son keskin kamaydi?» | **Qisman** | Reja 01, takrorlash va arena savoli — yangi shaklda. 2-ekran sarlavhasi qoldi (audit uni saqlash ro'yxatiga qo'ygan; mashq sharti bilan to'g'ri). |
| S1 | Reja sarlavhasi → savol | **Rad** | Reja ekrani — natija-gap (1–5-darslar bilan bir xil). |
| S7 | «Odam maqsadiga yetguncha nima qiladi?» | **Qisman** | Savol shakli — qabul; «uch qadam» atamasi bilan: «Loyihangizda odam qaysi uch qadamni bosib o'tadi?» |
| S13 | «Birinchi foydalanish ham endi ko'rinadi.» | **Qabul** | Yakun shakliga moslab: «Analitika tayyor: birinchi foydalanish ham yoziladi.» |
| A1/A2 | sarlavhalar normal | **Qabul** | O'zgarmadi. |
| Ko'prik | Analitika — «qayerda?», sinov — «nega?» | **Qabul** | A-5a va 2-ekran O'qituvchi eslatmasida. |
