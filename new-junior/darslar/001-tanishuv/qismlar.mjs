// 1-darsning o'z ekran bo'laklari (dvigatel 3c, 19.11; avval dvigatel/qismlar.mjs da edi — matni o'zgarmagan, baytma-bayt ko'chirildi).
// yigish.mjs ulaydi: dvigatel/qismlar.mjs dan keyin (u yerdagi rasmlar va shablonlardan foydalanadi), dars ekranlaridan oldin.
// Shablonlar (zina, xarita, tepalik, shartlar, sinfNatija) bu ro'yxatlarni chaqirilganda o'qiydi.
const oyinlar = () => `<div class="kurs">
  <div class="gl kr"><div class="kr-r lb">${labirint()}</div><div class="kr-t"><b>Labirint</b><small>2-darsda</small></div></div>
  <div class="gl kr"><div class="kr-r ol">${world('hovli', true)}<i class="olma o1">${OLMA}</i><i class="olma o2">${OLMA}</i><i class="olma o3">${OLMA}</i><span class="savat">${hero({ k: 'jele', mood: 'xursand', lite: true })}</span><span class="ball">${BALL}3</span></div><div class="kr-t"><b>Olma yig‘amiz</b><small>11-darsda</small></div></div>
  <div class="gl kr"><div class="kr-r ks">${world('kosmos', true)}<i class="dush d1">${dushman('#9A7BFF')}</i><i class="dush d2">${dushman('#38C793')}</i><i class="dush d3">${dushman('#FF7A59')}</i><span class="raketa"><i class="oq"></i><i class="oq o2"></i>${RAKETA}</span></div><div class="kr-t"><b>Kosmik o‘yin</b><small>17-darsda</small></div></div>
</div>`
const POGONA = [
  ['1', 4, miniYol({ q: 0, y: 3, yo: [[0, 5]] }), 'Yulduzda to‘xtang'],
  ['2', 4, miniYol({ q: 3, y: 1, yo: [[3, 1, '#E8A90C']] }), 'Orqaga qayting'],
  ['3', 3, miniYol({ q: 0, y: 3, yo: [[0, 4, '#2F8FF0'], [4, 3, '#2F8FF0']] }), 'Olma, keyin yulduz'],
  ['★', 3, bloklar9(), 'Aniq 9 ta blok'],
]
const SONI = { A: 3, B: 7, C: 4 }
const JAVOBLAR = [['A', '«YUR!» deb aytamiz'], ['B', 'Sichqoncha bilan ko‘chiramiz'], ['C', 'Unga buyruq beramiz']]
const BEKATLAR = [['h', 'Harakatlantirish', IKON.r], ['g', 'Gapirtirish', IKON.s], ['y', 'Sahna yaratish', YULDUZ_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida</small><div class="kd3-r">${world('kosmos', true)}<span class="kd3-q">${hero({ k: 'yulduz', mood: 'xursand', mv: 'sakraydi', lite: true })}</span><span class="kd3-p">Bu — mening sahnam!</span></div><b>O‘z sahnangiz</b></div>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb">${labirint()}</div><b>2 · Labirint</b></div>`
const SHART = [['joy', 'Joy tanlang', 'Joy'], ['blok', 'Kamida 2 ta harakat bloki', '2 ta harakat'], ['gap', 'O‘zingiz yozgan gap', 'O‘z gapingiz'], ['jump', '★ Qo‘shimcha: jump', '★ jump']]
// 16.11 F-1116-33: yakundan keyin ustoz ekranida — butun sinfning natijasi (faqat umumiy son; bolaning ismi va ishi chiqmaydi — 26-qonun)
const SINF_T = [['h', IKON.r, 'qadam', 210], ['h', IKON.j, 'sakrash', 28], ['g', IKON.s, 'gap', 54], ['y', YULDUZ_OQ, 'sahna', 12]]
// 17.11: bolaning noutbukida — o'zining shu to'rt soni (namuna: move right ×14 + move left ×3 = 17 qadam, jump ×2, say ×5, 1 sahna); demoda haqiqiy son yoziladi. Sinf soni = bolalar sonlarining yig'indisi
const BOLA_T = [['h', IKON.r, 'qadam', 17], ['h', IKON.j, 'sakrash', 2], ['g', IKON.s, 'gap', 5], ['y', YULDUZ_OQ, 'sahna', 1]]
