// 1-dars matnlari. Manba-haqiqat: ../../manba/001-tanishuv.md — matn o'zgarsa avval o'sha fayl, keyin shu yer.
// Dars to'liq: 1–15-sahna. Bekat tasmasi ekranda turmaydi (fidbek 13.11): reja xaritasi har yangi ish boshida qaytadi — 9, 12 va 15-sahnaning birinchi qadami.
// 7-versiya (14.11, halol bahodan keyin): huk savoli «qanday olib boramiz?» va ikki sinov (baqirish, sudrash); bolaning birinchi dasturida yulduz;
// 7-sahnadagi takror savol olib tashlandi; mustaqil ishda proyektorda sinf doskasi; yakunda — sinfning bugungi natijasi.

export const BEKATLAR = ['Yurgizamiz', 'Gapirtiramiz', "O'z sahnangiz"]
export const SINF_SONI = 14

// qadamlar — sahna ichidagi bosqichlar soni (ustoz «Keyingi» bilan o'tadi); qism — ustoz panelida ko'rinadigan dars bo'lagi nomi;
// vaqt — rejadagi daqiqa (ustoz panelidagi soat shu bilan solishtiriladi); gaplar — ustozning tayanch gaplari (tayyorgarlik varag'i manbadan o'zi yig'iladi)
export const SAHNALAR = [
  null,
  { nom: 'Kirish', qism: 'Kirish', vaqt: 4, qadamlar: 1, gaplar: ['«Bu — Coddy. U bugun men bilan birga ishlaydi.»', '«Noutbukda yashil tugmani bosing.»'] },
  { nom: "Savol: Coddy'ni qanday yurgizamiz?", qism: 'Savol', vaqt: 6, qadamlar: 5, gaplar: ["«Coddy'ni yulduzga qanday olib boramiz? Noutbukda tanlang.»", "«Sinab ko'ramiz. Hammamiz birga: YUR!»", '«Coddy faqat buyruqni bajaradi. Buyruq — mana shu blok.»'] },
  { nom: 'Reja va qahramon', qism: 'Reja', vaqt: 3, qadamlar: 3, gaplar: ["«Bugun yo'limizda uchta bekat bor: yurgizamiz, gapirtiramiz, o'z sahnangizni yasaysiz.»", '«Dars oxirida har biringizda mana shunday sahna bo\'ladi.»', "«Coddy — meniki. Har biringizga o'z qahramoningiz kerak. Bittasini tanlang.»"] },
  { nom: 'Blok studiya: birinchi dastur', qism: '1-bekat · Yurgizamiz', vaqt: 5, qadamlar: 2, gaplar: ['«Bu joy — Blok studiya. Blokni bosdim — u dasturga tushdi. Endi yashil tugma.»', "«Bitta blok — bitta qadam. Endi o'zingiz: qahramoningizni yulduzga olib boring.»"] },
  { nom: "Taxmin: Coddy qayerda to'xtaydi?", qism: '1-bekat · Yurgizamiz', vaqt: 4, qadamlar: 5, gaplar: ["«Yulduz uchinchi nuqtada. Men to'rtta blok qo'ydim. Coddy qayerda to'xtaydi?»", "«Coddy yulduzni ko'rmaydi. U faqat bloklarni bajaradi.»", "«Blokni bosdim — u olib tashlandi. Endi yulduzda to'xtadi.»"] },
  { nom: "O'zingiz: yulduzga yetkazing", qism: '1-bekat · Yurgizamiz', vaqt: 7, qadamlar: 1, gaplar: ["«Endi o'zingiz. Uch pog'ona bor. Kim nechanchisigacha boradi?»", "«To'xtadik. Qo'llar klaviaturadan.»"] },
  { nom: 'Xulosa: blok va dastur', qism: '1-bekat · Yurgizamiz', vaqt: 2, qadamlar: 2, gaplar: ['«Blok — bitta buyruq.»', "«Dastur — buyruqlar ro'yxati. Siz hozir dastur yozdingiz!»"] },
  { nom: "Harakatli o'yin: «Men robotman»", qism: "O'yin", vaqt: 4, qadamlar: 1, gaplar: ['«Turamiz! Endi men robotman. Menga faqat shu uchta buyruq bilan gapiring.»', "«Bunday blok yo'q. Bor buyruqni ayting.»", '«Robot faqat bor buyruqni bajaradi. Ortiqcha ham emas, kam ham emas.»'] },
  { nom: "Ko'ramiz va taxmin: «de» bloki", qism: '2-bekat · Gapirtiramiz', vaqt: 4, qadamlar: 6, gaplar: ['«Yangi blok — "de" bloki. Ichidagi yozuvni Coddy aytadi.»', '«Endi ichiga "2 qadam yur" deb yozdim. Coddy nima qiladi?»', '«Yurmadi! Nima qilishini yozuv emas, blok hal qiladi.»'] },
  { nom: 'Ism va rang', qism: '2-bekat · Gapirtiramiz', vaqt: 3, qadamlar: 1, gaplar: ['«Qahramoningiz gapirishi uchun unga ism kerak.»', "«Ism qo'ying va rangini tanlang.»"] },
  { nom: "O'zingiz: gapirtiramiz", qism: '2-bekat · Gapirtiramiz', vaqt: 10, qadamlar: 3, gaplar: ['«Yozuvni bosaman va o\'zgartiraman: "Men Coddyman!" Endi o\'zingiz.»', "«Yoningizdagi do'stingizga ko'rsating: qahramoningiz nima deydi?»"] },
  { nom: "Ko'ramiz: ustozning sahnasi", qism: "3-bekat · O'z sahnangiz", vaqt: 2, qadamlar: 2, gaplar: ["«Oxirgi bekat — eng qiziqi: har kim o'z sahnasini yasaydi.»", "«Meniki shunaqa chiqdi. Siznikisi boshqacha bo'lsin.»"] },
  { nom: "O'zingiz: o'z sahnangiz", qism: "3-bekat · O'z sahnangiz", vaqt: 7, qadamlar: 1, gaplar: ["«Joy tanlang va o'z sahnangizni yasang. Uchta shart ekranda yozilgan.»", "«Yana bir daqiqa. Oxirgi marta ishga tushirib ko'ring.»"] },
  { nom: "Ko'rsatish: galereya", qism: "3-bekat · O'z sahnangiz", vaqt: 5, qadamlar: 1, gaplar: ["«Endi turing va ikki do'stingizning sahnasini ko'ring.»", '«Kim sinfga ko\'rsatadi?»', '«Nechta blok ishlatdingiz? Qaysi blok sakratdi?»'] },
  { nom: 'Yakun', qism: 'Yakun', vaqt: 4, qadamlar: 3, gaplar: ["«Uchala bekatdan o'tdik: yurgizdik, gapirtirdik, sahna yasadik.»", '«Kompyuter faqat dasturni bajaradi. Dasturni esa siz yozasiz.»', '«Keyingi darsda Coddy labirintga kirib qoladi. Chiqarib olasizmi?»'] },
]
export const OXIRGI_SAHNA = SAHNALAR.length - 1

// Mustaqil ish: proyektordagi sinf doskasida qolgan vaqt (daqiqa). Kalit — «sahna:qadam»
export const ISH_VAQTI = { '4:1': 3, '6:0': 7, '11:1': 7, '11:2': 2, '13:0': 6, '14:0': 2 }

export const BLOK = {
  yur: { nom: '1 qadam yur' },
  orqaga: { nom: '1 qadam orqaga' },
  de: { nom: '«Salom!» de', rang: 'zar' },
  sakra: { nom: 'sakra', rang: 'bin' },
}

// Muammochalar: xato turi → kim keladi, nima deydi, uch pog'onali maslahat (n — yulduzgacha qadam, b — dasturdagi blok soni, chap — yulduz qahramonning orqasida)
export const MUAMMO = {
  bosh: { kim: 'boshvoy', gap: "Bu yerda hech narsa yo'q-ku…", maslahat: () => ['Chapdagi blokni bosing — u dasturga tushadi.'] },
  kam: { kim: 'kamvoy', gap: 'Oz qoldi!', maslahat: (n, b, chap) => ["Yulduzgacha necha qadam? Nuqtalarni sanang.", `Dasturda ${b} ta blok bor. Yulduzgacha ${n} qadam.`, chap ? 'Yana bitta «1 qadam orqaga» qo\'shing.' : 'Yana bitta «1 qadam yur» qo\'shing.'] },
  ortiq: { kim: 'ortiqvoy', gap: "Ko'payib ketdi!", maslahat: (n, b) => ["Qahramon qayerda to'xtashi kerak edi?", `Dasturda ${b} ta blok bor. Yulduzgacha ${n} qadam.`, 'Bitta blokni bosing — u olib tashlanadi.'] },
  teskari: { kim: 'kamvoy', gap: 'Yulduz boshqa tomonda!', maslahat: () => ['Yulduz qahramonning qaysi tomonida?', 'Yulduz chapda. Chapga yuradigan blok qaysi?', '«1 qadam orqaga» blokini ikki marta qo\'ying.'] },
  orqagasiz: { kim: 'kamvoy', gap: '«Orqaga» bloki qani?', maslahat: () => ["Oldinga ortiqroq yurib, keyin qaytsa bo'ladimi?", "4 qadam oldinga yursa, yulduzdan necha qadam o'tadi?", '4 ta «yur» va 1 ta «orqaga» qo\'ying.'] },
  jim: { kim: 'kamvoy', gap: 'Yurdi, lekin jim…', maslahat: () => ["Zarg'aldoq blokni qo'shing."] },
  salom: { kim: 'kamvoy', gap: 'Hali ham «Salom!» deyapti.', maslahat: () => ['Blok ichidagi yozuvni bosing.', "Yozuvni o'chirib, qahramoningiz ismini yozing."] },
  boshgap: { kim: 'boshvoy', gap: 'Hech narsa demadi…', maslahat: () => ["Blok ichiga so'z yozing."] },
  kamgap: { kim: 'kamvoy', gap: 'Yana bitta gap kerak.', maslahat: () => ["Yana bitta zarg'aldoq blok qo'shing."] },
  birxil: { kim: 'kamvoy', gap: 'Ikkalasi bir xil-ku!', maslahat: () => ["Ikkinchi blokdagi yozuvni o'zgartiring."] },
  orasiz: { kim: 'kamvoy', gap: 'Ikki gap orasida yursin.', maslahat: () => ["Ikki zarg'aldoq blok orasiga «1 qadam yur» qo'ying."] },
  toqqiz: { kim: 'kamvoy', gap: 'Bloklar soni 9 ta emas.', maslahat: () => ["Oldinga nechta, orqaga nechta bo'lsa, jami 9 ta chiqadi?", "Oldinga yurganlar orqaga yurganlardan 3 ta ko'p bo'lishi kerak.", "Oldinga 6 ta, orqaga 3 ta."] },
}

// 4-sahna: bolaning birinchi dasturi — hukdagi vazifaning davomi: o'z qahramonini yulduzga olib boradi (yulduz uch qadam narida)
export const BIRINCHI = { topshiriq: 'Qahramoningizni yulduzga olib boring', bloklar: ['yur'], yulduz: 3, nuqta: 3, yechim: ['yur', 'yur', 'yur'] }

// 6-sahna pog'onalari (ustoz ko'rsatgan masalalar takrorlanmaydi). nuqta — yerdagi sanash nuqtalari (yulduz tomonga)
// 1-pog'ona — tayyor dasturni tuzatish: 5-sahnada ustoz ko'rsatgan fikrni bola o'zi qo'llaydi (blokni olib tashlash yoki «orqaga» qo'shish — ikkalasi ham to'g'ri)
export const POGONALAR = [
  { nom: "1-pog'ona", qisqa: 'Dasturni tuzating', topshiriq: "Yulduzda to'xtasin — dasturni tuzating", bloklar: ['yur'], dastlabki: ['yur', 'yur', 'yur', 'yur', 'yur', 'yur'], yulduz: 4, nuqta: 6, payt: 'kun', yechim: ['yur', 'yur', 'yur', 'yur'] },
  { nom: "2-pog'ona", qisqa: 'Yulduz orqada', topshiriq: 'Yulduz orqada qoldi!', bloklar: ['yur', 'orqaga'], yulduz: -2, nuqta: 2, boshX: 56, payt: 'shom', yechim: ['orqaga', 'orqaga'] },
  { nom: "3-pog'ona", qisqa: '«Orqaga» ham bo\'lsin', topshiriq: "Yulduzda to'xtang. Dasturda {orqaga} ham bo'lsin", bloklar: ['yur', 'orqaga'], yulduz: 3, nuqta: 4, payt: 'tun', shart: 'orqaga', yechim: ['yur', 'yur', 'yur', 'yur', 'orqaga'] },
  { nom: 'Yulduzcha', qisqa: 'Roppa-rosa 9 ta blok', topshiriq: 'Roppa-rosa 9 ta blok bilan', bloklar: ['yur', 'orqaga'], yulduz: 3, nuqta: 6, payt: 'tun', shart: 'toqqiz', limit: 9, yechim: ['yur', 'yur', 'yur', 'yur', 'yur', 'yur', 'orqaga', 'orqaga', 'orqaga'] },
]

// 2-sahna (huk) savoli: bola usulni taxmin qiladi, keyin sinf ikkala «oson» usulni sinab ko'radi (baqirish, sudrash). Baho yo'q
// ochiq — test natijasi proyektorda ochilganda bola noutbukida chiqadigan gap (2-tur, 7-band)
export const TAXMIN2 = { savol: "Coddy'ni yulduzga qanday olib boramiz?", javoblar: ['«YUR!» deb baqiramiz', 'Sichqoncha bilan sudraymiz', 'Unga buyruq yozamiz'], togri: 2, ochiq: 'Coddy buyruq bilan yurdi' }
export const TAXMIN5 = { savol: "Coddy qayerda to'xtaydi?", javoblar: ['2-nuqtada', '3-nuqtada, yulduzda', '4-nuqtada'], togri: 2, ochiq: "Coddy 4-nuqtada to'xtadi" }

// 9-sahna taxmini: «de» bloki ichiga «2 qadam yur» deb yozilgan
export const TAXMIN9 = { savol: 'Coddy nima qiladi?', javoblar: ['2 qadam yuradi', '«2 qadam yur» deb aytadi', 'Hech narsa qilmaydi'], togri: 1, ochiq: "Coddy yurmadi — faqat aytdi" }

// 11-sahna pog'onalari: gapirtiramiz
export const POGONALAR2 = [
  { nom: "1-pog'ona", qisqa: 'Ismini aytsin', topshiriq: 'Qahramon ismini aytsin', bloklar: ['yur', 'orqaga', 'de'], shart: 'ism' },
  { nom: "2-pog'ona", qisqa: 'Yulduzda gapirsin', topshiriq: 'Yulduzgacha borsin va gapirsin', bloklar: ['yur', 'orqaga', 'de'], yulduz: 3, nuqta: 3, shart: 'yulduzgap' },
  { nom: "3-pog'ona", qisqa: 'Ikki xil gap', topshiriq: 'Ikki xil gap aytsin, orasida yursin', bloklar: ['yur', 'orqaga', 'de'], shart: 'ikkigap' },
  { nom: 'Yulduzcha', qisqa: 'Uchta gap', topshiriq: "O'zi haqida uchta gap aytsin", bloklar: ['yur', 'orqaga', 'de'], shart: 'uchgap' },
]

export const JOYLAR = [['hovli', 'Hovli'], ['kosmos', 'Kosmos'], ['suv', 'Suv osti']]
export const RANGLAR = ['#9A7BFF', '#FF6F8F', '#3FA2FF', '#FFC12E', '#58C765', '#22C7B8', '#FF9442', '#E45BD6']
export const TASODIFIY_ISMLAR = ['Zippi', 'Bobo', 'Tiki', 'Lolo', 'Pufak', 'Chaqmoq', 'Momo', 'Yulduzcha', 'Shodon', 'Qirqquloq']
