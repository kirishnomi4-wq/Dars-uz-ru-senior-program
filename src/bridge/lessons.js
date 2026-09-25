// O'tish yo'llari va darslar ro'yxati. Dars fayllari src/bridge/lessons/ da; import.meta.glob —
// fayl hali yozilmagan bo'lsa ham sayt yig'iladi (dars kartasi «tayyorlanmoqda» bo'lib turadi).
const FILES = import.meta.glob('./lessons/*.jsx')
export const loaderFor = (file) => FILES[`./lessons/${file}.jsx`] || null

export const LESSONS = {
  kimUchun: { file: 'BridgeKimUchun', title: { uz: 'Kim uchun qilyapmiz?', ru: 'Для кого мы делаем?' }, ip: { uz: 'OLX', ru: 'OLX' } },
  muammo: { file: 'BridgeMuammoniTopamiz', title: { uz: 'Muammoni topamiz', ru: 'Находим проблему' }, ip: { uz: 'Taksi ilovasi', ru: 'Приложение такси' } },
  birinchiVersiya: { file: 'BridgeBirinchiVersiya', title: { uz: 'Birinchi versiya va uni ko\'rsatish', ru: 'Первая версия и как её показать' }, ip: { uz: 'eMaktab', ru: 'eMaktab' } },
  kimMuammo: { file: 'BridgeKimUchunMuammo', title: { uz: 'Kim uchun va qanday muammo?', ru: 'Для кого и какая проблема?' }, ip: { uz: 'Uzum', ru: 'Uzum' } },
  nimaQuramiz: { file: 'BridgeNimaQuramiz', title: { uz: 'Nima quramiz va qachon tayyor?', ru: 'Что строим и когда готово?' }, ip: { uz: 'O\'z taksi ilovamiz', ru: 'Своё приложение такси' } },
  korsatamiz: { file: 'BridgeQandayKorsatamiz', title: { uz: 'Qanday ko\'rsatamiz?', ru: 'Как показать?' }, ip: { uz: 'eMaktab, ota-onalar yig\'ilishi', ru: 'eMaktab, родительское собрание' } },
  malumot: { file: 'BridgeMalumotIshonch', title: { uz: 'Ma\'lumot, ishonch va «Qanday ishlaydi?»', ru: 'Данные, доверие и «Как это работает?»' }, ip: { uz: 'YouTube kabi ilova', ru: 'Приложение как YouTube' } },
}

export const PATHS = [
  { id: 'p1', n: 1, tag: 'JavaScript', lessons: ['kimUchun'] },
  { id: 'p2', n: 2, tag: 'React', lessons: ['kimUchun', 'muammo', 'birinchiVersiya'] },
  { id: 'p3', n: 3, tag: 'Node.js · Express', lessons: ['kimMuammo', 'nimaQuramiz', 'korsatamiz'] },
  { id: 'p4', n: 4, tag: 'NestJS', lessons: ['kimMuammo', 'nimaQuramiz', 'malumot'] },
]
