// O'quvchining g'oya-kartasi — darsdan darsga o'tadi (localStorage, bitta qurilma).
// Boshqa kompyuterda karta yo'q bo'ladi — shunda dars READY_IDEAS dan tanlov beradi.
// Hamma o'qish/yozish jim yiqiladi (private rejim, iframe).
const KEY = 'ccBridgeCard'

/** Karta maydonlari (hammasi ixtiyoriy, string):
 *  kim · qachon · ogir (nimasi og'ir) · qiladi (sayt nima qiladi) · erishadi (odam oxirida nimaga erishadi)
 *  bolak (birinchi bo'lak) · shartlar: [{qiladi, boladi}] · hikoya · gaplar: [5 gap] · kadrlar: [3 gap]
 *  maydonlar: [{nom, bolim, ochiq:boolean, sabab}] · qavatlar: [3 gap] · ideaId (tayyor g'oyadan bo'lsa) */
export const cardRead = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || null } catch { return null } }
export const cardWrite = (patch) => {
  try { const cur = cardRead() || {}; localStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch, savedAt: Date.now() })) } catch { /* jim */ }
}

// 2026-09-24 01:23: 1-dars metodisti topgan 4 grammatik aniqlashtirish (qolipga qo'yilganda to'ldiruvchi/ega yo'qolmasin) shu yerga ko'chirildi.
// Kartasiz o'quvchi uchun 4 tayyor g'oya — senariylardagi jadval (3/4-o'tish 1-darsi 14-ekran + qo'shimcha ustunlar).
export const READY_IDEAS = [
  { id: 'futbol', olam: { uz: 'Futbol', ru: 'Футбол' },
    kim: { uz: "hovlida futbol o'ynaydigan o'smirlar", ru: 'подростки, играющие в футбол во дворе' },
    qachon: { uz: 'kechqurun, maktabdan keyin', ru: 'вечером, после школы' },
    ogir: { uz: "maydonga borsa, u yerda boshqalar o'ynayotgan bo'ladi", ru: 'приходят на поле, а там уже играют другие' },
    qiladi: { uz: "maydonning bo'sh vaqtini ko'rsatib, band qilib beradi", ru: 'показывает свободное время на поле и бронирует его' },
    erishadi: { uz: "do'stlari bilan kutmasdan o'ynaydi", ru: 'играют с друзьями без ожидания' },
    bolak: { uz: "bo'sh vaqtni band qilish", ru: 'бронирование свободного времени' },
    shart: { qiladi: { uz: "Bo'sh vaqt bosilsa", ru: 'Нажали на свободное время' }, boladi: { uz: '«Band qilindi» yozuvi chiqadi', ru: 'Появляется надпись «Забронировано»' } } },
  { id: 'oyin', olam: { uz: "O'yin", ru: 'Игра' },
    kim: { uz: "onlayn o'yin o'ynaydigan o'quvchilar", ru: 'школьники, играющие в онлайн-игры' },
    qachon: { uz: "jamoaviy bellashuv o'rtasida", ru: 'посреди командного матча' },
    ogir: { uz: "jamoadoshsiz qolib, yutqazib qo'yadi", ru: 'остаются без напарника и проигрывают' },
    qiladi: { uz: 'darajasi va vaqti mos jamoadosh topib beradi', ru: 'находит напарника подходящего уровня и времени' },
    erishadi: { uz: "o'yinni oxirigacha o'ynab, yutadi", ru: 'доигрывают до конца и побеждают' },
    bolak: { uz: 'mos jamoadosh topish', ru: 'поиск подходящего напарника' },
    shart: { qiladi: { uz: '«Qidirish» bosilsa', ru: 'Нажали «Искать»' }, boladi: { uz: "darajasi mos o'yinchilar ro'yxati chiqadi", ru: 'появляется список игроков подходящего уровня' } } },
  { id: 'sinf', olam: { uz: 'Sinf', ru: 'Класс' },
    kim: { uz: 'sinf sardori', ru: 'староста класса' },
    qachon: { uz: "ustozga sovg'aga pul yig'ilganda", ru: 'когда собирают деньги на подарок учителю' },
    ogir: { uz: 'kim pul bergani, kim bermaganini adashtirib yuboradi', ru: 'путает, кто сдал деньги, а кто нет' },
    qiladi: { uz: 'kim pul berganini belgilab boradi', ru: 'отмечает, кто сдал деньги' },
    erishadi: { uz: "sovg'ani janjalsiz, vaqtida oladi", ru: 'покупает подарок вовремя и без ссор' },
    bolak: { uz: 'pul berganni belgilash', ru: 'отметка сдавших' },
    shart: { qiladi: { uz: 'Ism bosilsa', ru: 'Нажали на имя' }, boladi: { uz: 'yonida ✓ chiqadi', ru: 'рядом появляется ✓' } } },
  { id: 'kiyim', olam: { uz: 'Kiyim', ru: 'Одежда' },
    kim: { uz: "internetdan kiyim oladigan o'smir", ru: 'подросток, покупающий одежду онлайн' },
    qachon: { uz: 'posilkani ochganda', ru: 'когда открывает посылку' },
    ogir: { uz: "olgan kiyimi to'g'ri kelmay, qaytarishga ovora bo'ladi", ru: 'получает неподходящую одежду и вынужден её возвращать' },
    qiladi: { uz: "bo'y va vaznga qarab mos o'lchamni ko'rsatadi", ru: 'подбирает размер по росту и весу' },
    erishadi: { uz: 'birinchi urinishdayoq mos kiyim oladi', ru: 'с первого раза получает подходящую одежду' },
    bolak: { uz: "mos o'lchamni ko'rsatish", ru: 'показ подходящего размера' },
    shart: { qiladi: { uz: "Bo'y va vazn yozilsa", ru: 'Ввели рост и вес' }, boladi: { uz: "bitta mos o'lcham chiqadi", ru: 'появляется один подходящий размер' } } },
]
