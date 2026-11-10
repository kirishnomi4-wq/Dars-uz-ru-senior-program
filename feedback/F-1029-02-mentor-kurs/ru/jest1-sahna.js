// Jest-1 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Зачем и где', 'Первый тест', 'Ложные тесты', 'Статусы и граница', 'Тест от AI', 'Подготовка к классу'] },
};
ru(T2_SMOKE, [null, { h: '<span class="cm"># база shop_smoke · каждый шаг в отдельном процессе node · перезапуск · 5 клиентов одновременно</span>' }, { h: '<span class="ok">ИТОГ: 5/5 ✓</span>' }]);
ru(PAGES15, [[null, 'первая'], [null, 'в середине'], [null, 'последняя'], [null, 'единственная']]);
ru(MUT, [[null, 'som: ru-RU → en-US («120,000»)'], [null, 'строка корзины: текущая цена вместо цены заказа'], [null, 'orderKeyboard: кнопки и при CANCELLED'], [null, 'catalogKeyboard: ▶ и на последней странице'], [null, 'изменился текст STATUS_UZ.NEW']]);
ru(MUT_COLS, [['Мы', null], null, null]);
ru(DICT22, [['машина — вход → выход', 'функция'], ['Jestbot — робот-проверяльщик', null], ['папка робота', null], ['лист проверки', null], ['карточка эталона', null], ['ложный тест', 'нет expect или неверный эталон']]);
ru(ADD22, [['чтение настоящего FAIL: ● → Expected / Received → строка >', null], ['«кто ошибся: код или эталон?»', 's13, s16 неверный эталон'], ['эталон вручную — orderTotal в эталоне не вызывается', 's15 тесты от AI'], ['граница: ровно 100 000', 'домашнее задание deliveryFee'], ['если зелёный — пусть один раз сломают', 'конец практики']]);
ru(CARDS23, [
  ['Тест не найден', null, 'внутри src/, имя .spec.ts'],
  ['В репозитории ученика упал npm ci', null, 'npm install — lock-файл не синхронен'],
  ['Ложный зелёный', 'PASS, но нет expect или эталон из кода', 'в каждом it — expect; эталон вручную'],
  ['Выглядит одинаково, но FAIL', 'Expected = Received на вид · serializes to the same string', 'невидимый символ (' + ESC + ') · для массива toEqual'],
  ['Пустой проект не на Nest', null, 'писать в репозитории ученика; в пустом проекте config:init, @types/jest, typescript@5'],
]);
ru(QA23, [
  ['«Тест исправляет код?»', 'Нет, только сообщает; исправлять — вам.'],
  ['«В уроке есть npm i -D jest ts-jest — если установлю, всё сломается?»', 'В репозитории Nest jest уже есть; команда только поднимает минорную версию, тесты зелёные (проверено).'],
  ['«Jest только для Nest?»', 'Нет, любой проект на JavaScript/TypeScript; в Nest он уже настроен.'],
  ['«Можно, чтобы тест написал AI?»', 'Да; потом четыре проверки и хотя бы одна поломка (экран 19).'],
  ['«Чем toBe отличается от ===?»', 'toBe тоже сравнивает через Object.is, но сообщает результат как PASS или FAIL.'],
]);
ru(SUM25, [
  { t: 'Unit-тест — одна функция и одно правило; Telegram, база и .env не нужны — бот и сайт проверяются одинаково. Smoke — «работает ли», unit-тест — «не нарушено ли это правило»' },
  { t: 'Jest: rootDir: src, testRegex: .spec.ts — файл рядом с проверяемым файлом; No tests found — место и имя' },
  { t: 'FAIL: ● → Expected / Received → строка > и номер; выглядит одинаково — невидимый символ (' + ESC + ') или массив сравнили через toBe (toEqual)' },
  { t: 'Ложный тест бывает двух видов: нет expect · эталон взят из кода; toBeTruthy — есть ли, а не верно ли' },
  { t: 'Каждый статус — один тест; на каждое условие тест границы: первая, последняя, единственная' },
  { t: 'Приём теста от AI: diff только .spec.ts · в каждом it — expect · эталон вручную · сломать код и увидеть, как тест краснеет. Класс: m4b-01 — настоящий FAIL, «кто ошибся», граница, один раз сломать' },
]);
ru(STATIONS25, [null, [null, 'Код теста', null], [null, 'Тест от AI', null]]);
ru(HOMEWORK25, [
  { t: 'Своя копия — новая ветка в своём репозитории с урока Telegraf+PG (или от jest1-start)' },
  { t: 'Тесты — в texts.spec.ts: texts.orderPlaced, texts.orderLine, texts.statusChanged, texts.customerStatus; правило цены: заказ, где price и product.price разные' },
  { t: 'Четыре поломки — формат som · i.price ?? i.product.price → i.product.price · текст STATUS_UZ · одно место на ваш выбор; после каждой npm test и git checkout' },
  { t: 'Раздел README «Тесты»: поломка → имя покрасневшего теста (4 строки); если писали с AI — какое условие AI не выполнил и как вы это поймали' },
  { t: 'Сдача — git push → ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.SPOKEN = [['бэкслеш u ноль ноль а ноль', ESC], ['ноль ноль а ноль', '00a0'], ['ноль ноль два ноль', '0020'], ['texts spec ts', 'texts.spec.ts'], ['keyboards spec ts', 'keyboards.spec.ts'], ['texts ts', 'texts.ts'], ['spec ts', '.spec.ts'], ['test ts', '.test.ts'],
  ['to strict equal', 'toStrictEqual'], ['to be undefined', 'toBeUndefined'], ['to be truthy', 'toBeTruthy'], ['to equal', 'toEqual'], ['to be', 'toBe'], ['to locale string', 'toLocaleString'], ['Object is', 'Object.is'], ['console log', 'console.log'], ['no tests found', 'No tests found'],
  ['Root dir src', 'rootDir: src'], ['root dir src', 'rootDir: src'], ['Test regex', 'testRegex'], ['test regex', 'testRegex'], ['transform ts jest', 'transform: ts-jest'], ['ts jest', 'ts-jest'], ['order keyboard', 'orderKeyboard'], ['catalog keyboard', 'catalogKeyboard'],
  ['hide false', 'hide: false'], ['git diff stat', 'git diff --stat'], ['jest один start', 'jest1-start'], ['package json', 'package.json'], ['Describe som', "describe('som')"], ['npm test keyboards', 'npm test -- keyboards'], ['npm test texts', 'npm test -- texts'], ['delivery fee', 'deliveryFee'], ['order total', 'orderTotal']];
RU_S.TITLE = 'Первые тесты для OrderBotNest';
RU_S.EYEBROW = 'Курс для менторов · Jest';
RU_S.COVER = ['Всего около 1 часа 10–25 минут: озвучка ~24 минуты · три практики 45–60 минут · 4 проверки · самопроверка 8 вопросов. После экрана 11 можно сделать перерыв', 'Нужно: урок для менторов Telegraf + PostgreSQL (OrderBotNest на вашем компьютере) · Node.js 20+ · VS Code · AI-помощник (Antigravity, Claude Code, Codex или Copilot). База и токен бота не нужны', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега jest1-start (= tgpg-done); каждый вывод — из настоящего запуска'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: настройка Jest, невидимый символ, ложные тесты, toBe и toEqual, граница и тест от AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к экранам красных вопросов и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет «AI написал тест, всё зелёное», вы знаете, что проверить.';
RU_S.NEXT_T = 'Jest: edge cases и путь ошибки';
RU_S.NEXT_D = 'toThrow, проверка Service через mock и первый HTTP-тест для API сайта';
RU_S.FILE = 'jest-pervye-testy-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['Unit-тест — <b>одна функция и одно правило</b>; бот и сайт проверяются одинаково', 'Первое: unit-тест проверяет одну функцию и одно правило. Telegram, база и env-файл не нужны, поэтому бот и сайт проверяются одинаково. Smoke говорит, работает ли, а unit-тест — не нарушено ли это правило.'],
  b2: ['Jest находит файл <b>внутри src, по имени .spec.ts</b>', 'Второе: Jest находит тестовый файл внутри папки src и по имени spec ts. Если вышло no tests found, проверяйте не код, а место и имя файла.'],
  b3: ['FAIL: <b>Expected, Received, номер строки</b>; выглядит одинаково — невидимый символ или toEqual', 'Третье: FAIL читаете сверху вниз: строка с точкой, expected и received, потом номер строки. Если две строки выглядят одинаково, ищите невидимый символ. Массив и объект сравнивайте через to equal.'],
  b4: ['Ложный тест двух видов: <b>нет expect или эталон из кода</b>', 'Четвёртое: ложный тест бывает двух видов. В одном нет expect, в другом эталон сделан из самого кода. А to be truthy проверяет, что значение есть, а не что оно верное.'],
  b5: ['Каждый статус — <b>один тест</b>; на каждое условие — <b>тест границы</b>', 'Пятое: на каждый статус пишете один тест. На границу каждого условия — отдельный тест: первая, последняя и единственная страница. Разница между «меньше» и «меньше или равно» видна только на границе.'],
  b6: ['Тест от AI принимаете, <b>проверив поломкой</b>; в классе — один раз сломать', 'Шестое: тест от AI принимаете не по количеству, а проверив поломкой. Diff, expect, эталон вручную и хотя бы три поломки. Если в классе тест ученика зелёный, пусть он сам один раз сломает код.'],
  hw: ['<b>Домашнее задание</b>: тесты текстов заказа и правило цены на момент заказа', 'Домашнее задание: в своей копии OrderBotNest напишите тесты для текстов заказа. Важное правило: в сообщении выводится цена на момент заказа, а не текущая цена товара. Напишите на это отдельный тест. Можно писать и с AI.'],
  hw2: ['<b>Четыре поломки</b> и таблица в README; ссылка на репозиторий — на платформу', 'Потом сделайте четыре поломки и для каждой запишите в README таблицей, какой тест покраснел. Выложите на GitHub и вставьте ссылку на репозиторий в своё домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: настройка, чтение FAIL, ложные тесты и проверка AI — на одной странице', 'Внизу памятка на одну страницу: настройка Jest, шаблон теста, чтение FAIL, невидимый символ, ложные тесты, приём теста от AI, ошибки и подготовка к классу. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# Jest — памятка ментора (OrderBotNest, первые тесты)
## Проект
git fetch --tags · git checkout jest1-start (тестов нет) → jest1-done (texts.spec.ts, keyboards.spec.ts) · npm test [-- texts | -- keyboards] · .env и база не нужны
## Где Jest ищет (package.json → jest)
rootDir: "src" · testRegex: ".*\\\\.spec\\\\.ts$" · transform: ts-jest → файл внутри src/, рядом с проверяемым файлом, имя .spec.ts · иначе: No tests found, exiting with code 1
## Шаблон теста
describe('som', () => { it("120000 ni so'mda yozadi", () => { expect(som(120000)).toBe("120${ESC}000 so'm"); }); });
## Чтение FAIL
● describe › it → Expected (эталон) / Received (что вернула функция) → строка > и ^ → at … (texts.spec.ts:5:25)
## Выглядит одинаково, но FAIL
toLocaleString('ru-RU') разделяет тысячи символом U+00A0 (неразрывный пробел) → в эталоне ${ESC} пишется явно, а не сам символ
массив и объект: toBe → «serializes to the same string» → toEqual · Telegraf добавляет кнопке hide: false → выделите нужную часть
## Ложные тесты
нет expect (console.log) → всегда PASS · эталон из кода: \`Jami: \${som(100000)}\` → PASS, даже если som сломана · toBeTruthy → PASS, даже если текст изменился
## Статусы и граница
каждый статус — один it · на каждое условие граница: первая, последняя, единственная страница · разница < и <= только на границе
## Приём теста от AI
git diff --stat — только .spec.ts · в каждом it — expect · в эталоне нет \${som( / \${STATUS_UZ · grep -c 'u00a0' (есть ли escape-запись) · сломайте код в 3–4 местах — каждое должно покраснеть
## Подготовка к классу (m4b-01, 21 экран)
сайт KitobShop · orderTotal · Jestbot = Jest, папка = describe, лист = it, карточка эталона = expect · вы добавляете: настоящий FAIL, «кто ошибся», граница 100 000, один раз сломать
## Ошибки
No tests found → место и имя · npm ci … in sync → npm install · Cannot find module './texts' → место файла · пустой проект: Must use import → npx ts-jest config:init · Cannot find name 'describe' → @types/jest · TypeScript 7 → typescript@5
## Ваше домашнее задание (40–60 минут)
тесты texts.orderPlaced, orderLine, statusChanged, customerStatus + правило цены на момент заказа + 4 поломки в таблице README → GitHub → ссылка на репозиторий на платформу`;
