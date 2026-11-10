# WebSocket-2 v2 · AI xulosasi (04.11)

| | ai1 (Opus) | ai2 (Haiku) |
|---|---|---|
| O'zgargan fayllar | `public/admin.html`, `README.md` (+22/−3) | `public/admin.html` (+8/−1) |
| Sabab topildimi | ha: «ulanish yo'q paytda yuborilgan hodisa hech kimga yetmaydi» | ha |
| Asosiy tuzatish | `connect` → `holatQoy` + `yukla()` | `connect` → `holatQoy` + `yukla()` |
| Qo'shimcha | so'rov raqami (`soroqRaqami`) — faqat oxirgi javob chiziladi; `try/catch` tarmoq xatosida | so'rov raqami (`sorovSoni`) |
| Tinglovchi `connect` ichiga ko'chirildimi | yo'q | yo'q |
| Alohida `yukla()` (Kirish / ochilish) | qoldi — ochilishda 2 `GET` | qoldi — ochilishda 2 `GET` |
| Server kodi | tegilmadi | tegilmadi |
| O'zi qanday sinagan | headless Chrome + vaqtinchalik server (haqiqiy gateway/controller, baza o'rniga JSON fayl), 4 holat | jsdom + socket.io server; sinov papkasi `scratchpad/ws2-test` — shartdan TASHQARIDA |
| Haqiqiy baza bilan (biz, `drive-ws2v2.sh 10`, `navbat0`) | `#2` sariq — hodisa panelga kelmagan, ro'yxat qayta so'rashdan (`01-qayta-ishga.txt`) | `#2` sariq — xuddi shunday |

Kuzatuv: ai1 nusxasini birinchi sinaganimizda (`navbat` — buyurtma port ochilgach 0,3 s) panel buyurtmadan OLDIN ulanib ulgurdi: `order-changed #2` oddiy yo'l bilan keldi (`ai1/01a-omadli-panel-oldin-ulandi.txt`). O'sha urinish xatoni tekshirmagan — eski kod ham o'tardi. Shundan keyin qat'iy `navbat0` (buyurtma `app.listen` dan oldin) qo'shildi va har natijaga «#2 hodisasi panelga keldimi» qatori yoziladi.

So'rov raqami (eski javob yangisini bosmasin): mantiq to'g'ri, zarari yo'q; bizning tajribalarda javob tartibi buzilmadi (ai1 sekinlashtirilgan server bilan ko'rsatgan). `ws2-done` ga qo'shilmadi — darsda AI'ning qo'shimcha himoyasi sifatida baholanadi.
