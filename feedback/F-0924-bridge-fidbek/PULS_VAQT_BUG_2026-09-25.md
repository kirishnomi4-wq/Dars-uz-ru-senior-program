# Ikki tizimli puls-bug — B6 tekshiruvchisi topdi (2026-09-25 ~02:00)

> B6 (`BridgeQandayKorsatamiz.jsx`) yakuniy tekshiruvchisi (rol: pm-tekshiruvchi) B6'ni tuzatgandan keyin, **faqat-o'qish rejimida**, qolgan 6 ta bridge darsini ham tekshirdi va xuddi shu ikki xato-sinfini topdi. Hech biriga tegmadi — faqat B6'da tasdiqlangan, ishlaydigan tuzatish naqshini qoldirdi. Bu fayl — o'sha topilmani saqlab qolish uchun (bosh-agent xotirasi yo'qolsa ham).

## 1. Hook qo'sh-pulsi (`turnBusy` yo'qligi)
NavNext'da `turnBusy` sharti yo'q bo'lsa, o'quvchi mentordan orqada qolganda (yoki mustaqil rejimda ~2.6s dan keyin) NavNext tugmasi VA variantlar to'lqini BIR VAQTDA yonadi (pulseMax=2, 1-C/88-qonun buzilishi).

**Bor (tuzatish kerak):**
| Dars | Fayl:qator |
|---|---|
| B1 | `BridgeKimUchun.jsx:695` |
| B2 | `BridgeMuammoniTopamiz.jsx:816` |
| B3 | `BridgeBirinchiVersiya.jsx:784` |
| B5 | `BridgeNimaQuramiz.jsx:792` |
| B7 | `BridgeMalumotIshonch.jsx:699` |

**Ishlaydigan naqsh (nusxa olinadi):** B4 `BridgeKimUchunMuammo.jsx:676` va B6 `BridgeQandayKorsatamiz.jsx:693` — `turnBusy={picked === null && !isMentor}` (aniq shart har faylda o'zgarishi mumkin, lekin g'oya shu).

**Qo'shimcha, B3'ga xos (17-ekran, juftlik):** `BridgeBirinchiVersiya.jsx:1926` — `turnBusy={!(written || p.mark === 0)}` noto'g'ri; avval yozilsa (bosilmasdan oldin) max=2 bo'ladi. B6'ning 16-ekran tuzatishi (`peerBusy = (p.mark === null || !written) && !isMentor`, B6:1949) naqshini qara.

## 2. To'lqin vaqt-ustma-ustligi (wv4/wv5 kadr to'qnashuvi)
Umumiy 30%-li kadrda (`turn-wave4`/`turn-wave5` uchun bitta CSS keyframe ishlatilganda) qadam 0.7s bilan umumiy to'lqin sikli mos kelmay, ~0.23s davomida ikkita halqa birga yonadi.

**Bor:** B1 `:2882` · B2 `:2849` · B3 `:2940/2943` · B4 `:2772` · B5 `:3107/3110` · B7 `:3071`.

**Tuzatish naqshi:** B6 `:2994–:3008` — `turn-wave4` va `turn-wave5` uchun ALOHIDA CSS keyframe (bir xil emas), + reduced-motion qatorini shu ikki klassni ham qamrab oladigan qilib kengaytirish.

## Qachon qo'llanadi
- B1/B2/B3: rejalashtirilgan tozalik-audit bilan BIRGA (bitta agent, ikkala vazifa — kichik va mexanik, alohida aylanish shart emas).
- B4/B5/B7: hozir dizayn-agentlari boshqa band ustida ishlayapti (bir fayl — bir muharrir). Ular tugagach, YAKUNIY tekshiruvdan OLDIN shu ikki fixni alohida qo'shish kerak (yoki keyingi tekshiruvchi buni QAYTARISH sifatida qaytaradi — ammo naqsh allaqachon ma'lum bo'lgani uchun oldindan qo'shish tezroq).
- B6: allaqachon tuzatilgan (bu topilmalar shu fayldan olindi).

## Tekshirish
Har tuzatishdan keyin: 5 xil rejim holatida (mentor bir ekran oldinda / uch ekran oldinda / bir xil ekranda, mustaqil, orqada qolgan) pulseMax=1 ekanini o'lchash. B6'ning skriptlari qayta ishlatilishi mumkin: `scratchpad/qa/{h,walk,sweep,cause,timing}.mjs`.
