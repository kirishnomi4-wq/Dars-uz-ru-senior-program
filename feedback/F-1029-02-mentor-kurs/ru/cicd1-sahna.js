// CI/CD-1 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Конвейер вручную', 'GitHub Actions', 'Четыре ловушки', 'Разница машин и AI', 'CD и подготовка к классу'] },
};
ru(LENTA, [[null, null, 'пакеты установились?'], [null, null, 'типы верны?'], [null, null, 'тесты зелёные?'], [null, null, 'dist собрался?']]);
ru(CODES3, [[null, null, 'зелёный — команда закончилась, ошибки нет', null], [null, null, 'красный — Jest: тест упал', null], [null, null, 'красный — tsc: ошибка типа', null], [null, null, 'красный — команда не найдена', null]]);
ru(MAP8, [[null, 'шаг 1 · пакеты установились?'], [null, 'шаг 2 · типы верны?'], [null, 'шаг 3 · тесты зелёные?'], [null, 'шаг 4 · dist собрался?']]);
ru(MACH13, {
  l: { h: 'Ваша машина', rows: [['папка', 'OrderBotNest/ — полная'], [null, 'есть'], null] },
  r: { h: 'Runner · нет checkout', rows: [['папка', '/home/runner/work/OrderBotNest/OrderBotNest — пустая'], [null, 'нет'], null], note: 'Код на машину приносит actions/checkout. Его нет — папка пустая, а сообщение говорит «создайте lock».' },
});
ru(CAUSE14, ['package.json: telegraf 4.16.0 (вручную), package-lock.json: 4.16.3 (старый)', 'npm ci ставит ТОЧНО по lock-файлу — не меняет ни байта', 'Не совпадает — не угадывает, даёт красный: не «in sync»', 'Локально npm install → lock обновляется → lock тоже в commit']);
ru(MACH17, {
  l: { h: 'Ваша машина', rows: [null, null, [null, '✓ (экран 4)']] },
  r: { note: 'npm 10 иначе читает одну запись lock-файла (peer-пакет) и считает, что её «нет».' },
});
ru(FOUR19, ['есть checkout?', 'node-version — моё число из `node --version`?', 'npm ci (не install)?', 'есть шаги tsc и build?']);
ru(DICT23, [['лента · чемодан', 'pipeline · код (commit)'], ['Сборка · Сканер · Упаковка · Вылет', null], ['Рамка размера', 'eslint . — в OrderBotNest нет, в репозитории ученика есть'], ['стартовый сигнал · маршрут · машина ленты', null], ['красный свет — лента останавливается', 'код выхода не 0 — следующие шаги «skipped»'], ['сейф', 'GitHub Secrets (следующий урок)']]);
ru(ADD23, [['строка actions/checkout — в ci.yml ученика её нет (экран 13): на практике «добавьте одну строку»', 'практика, ci.yml'], ['npm ci vs npm install — ученик пишет install; в классе причина одним предложением (экран 14)', null], ['один раз показать на экране настоящий run Actions: красный шаг, skipped', 'конец практики'], ['«локально зелёный, в конвейере красный» — версия Node (экран 17)', 'когда ученик жалуется']]);
ru(CARDS23, [
  ['В Actions нет run', null, 'файл не в .github/workflows/ или push не дошёл'],
  ['npm install / npm test красный', null, 'нет строки checkout — папка пустая'],
  ['Run красный, job нет', null, 'сдвиг YAML / нет runs-on'],
]);
ru(QA23, [
  ['«Конвейер запускается на моём компьютере?»', 'Нет — на чистой машине GitHub; поэтому нужны checkout и npm install.'],
  ['«Зачем снова npm install? У меня же есть»', 'На чистой машине нет node_modules — каждый run заново.'],
  ['«Если красный, сайт сломается?»', 'Нет — красный код не выходит, конвейер останавливается; это защита.'],
  ['«А deploy куда?»', 'Это CD — на следующих уроках; сейчас конвейер проверяет, а не выпускает.'],
]);
ru(SUM25, [
  { t: 'CI — при каждом push ваши команды на чистой машине: вместо «у меня работает» — один ответ для всех. CD — выпуск проверенного груза (Delivery: подтверждает человек · Deployment: конвейер сам)' },
  { t: 'Конвейер — npm ci → npx tsc --noEmit → npm test → npm run build; у каждого шага код выхода: 0 — зелёный, другое — красный; после первого красного остальное «skipped»' },
  { t: 'ci.yml из трёх частей: on (push, pull_request) · runs-on: ubuntu-latest · steps (uses: actions/checkout@v4, actions/setup-node@v4 + run: команды). Push → Actions → run → job → шаги → лог' },
  { t: 'Четыре ловушки: нет checkout («нет lock» — папка пустая) · lock не совпадает («in sync» — в конвейере npm ci, локально npm install + lock в commit) · без шага tsc ложный зелёный · сдвиг YAML / нет runs-on (нет job)' },
  { t: 'Локально зелёный, в конвейере красный — сначала node-version ↔ node --version: npm на runner читает lock иначе (Missing: webpack… from lock file)' },
  { t: 'Workflow от AI — точка старта: четыре вопроса (checkout · моя версия · npm ci · tsc и build), потом push и run. Граница CD: node dist/main падает без .env — secrets на следующем уроке' },
]);
ru(HOMEWORK25, [
  null,
  { t: 'job lint — jobs.lint: checkout · setup-node · npm ci · npx prettier --check "src/**/*.ts" (две job: test ✓ · lint ✓)' },
  { t: 'Badge — значок конвейера в первую строку README' },
  { t: 'Поломка — в src/api/app.controller.ts соберите строку в одну (сломайте формат) и push: lint ✗, test ✓ · потом prettier --write и push: обе ✓' },
  { t: 'Сдача — ссылка на репозиторий в домашнее задание на платформе' },
]);
RU_S.TITLE = 'Конвейер: тесты OrderBotNest запускаются сами при каждом push';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 4 проверки · самопроверка 8 вопросов. После экрана 12 можно сделать перерыв', 'Нужно: урок для менторов Jest-2 (в OrderBotNest 25 тестов) · Node.js 20+ · VS Code · аккаунт GitHub и свой репозиторий (вы можете делать push) · AI-помощник (Antigravity, Claude Code, Codex или Copilot). База и токен бота не нужны', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега cicd1-start (= jest2-done); каждый run — из настоящего GitHub Actions'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: что делает CI, код выхода, где останавливается конвейер, четыре ловушки, версия Node и workflow от AI. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет «у меня конвейер красный», вы знаете, на какой шаг смотреть.';
RU_S.NEXT_T = 'GitHub Actions: run, лог и образцы';
RU_S.NEXT_D = 'Чтение красного run, secrets, cache, matrix';
RU_S.FILE = 'cicd-konveyer-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['CI — <b>ваши команды на чистой машине</b>; CD — выпуск проверенного груза', 'Первое: CI — при каждом push ваши команды запускаются на чистой машине. Вместо «у меня работает» — один ответ для всех. CD — выпуск проверенного груза: в Delivery подтверждает человек, в Deployment конвейер выпускает сам.'],
  b2: ['Конвейер: <b>четыре шага, код выхода</b>; после первого красного остальное «skipped»', 'Второе: конвейер — четыре шага: npm ci, tsc, test, build. Каждый возвращает код выхода: ноль — зелёный, другое — красный. На первом красном шаге конвейер останавливается, остальное skipped, сломанный код не собирается.'],
  b3: ['<b>ci.yml</b> из трёх частей: on · runs-on · steps; push → run → job → шаг → лог', 'Третье: ci yml из трёх частей. On — когда. Runs on — на какой машине. Steps — шаги: checkout, setup node и ваши команды run. Делаете push, в Actions появляется run, внутри job, шаги и лог каждого шага.'],
  b4: ['<b>Четыре ловушки</b>: нет checkout · lock не совпадает · нет tsc · ошибка YAML', 'Четвёртое: четыре ловушки. Нет checkout — папка пустая. Package json и lock не совпадают — ошибка in sync. Нет шага tsc — ложный зелёный. Сдвиг YAML или нет runs on — run красный, но job нет.'],
  b5: ['Локально зелёный, в конвейере красный — <b>node-version = node --version</b>', 'Пятое: если локально зелёный, а в конвейере красный, сначала сравните версию Node. Npm на runner читает lock-файл иначе: missing webpack from lock file. Пусть node version в ci yml будет числом с вашей машины.'],
  b6: ['Workflow от AI — <b>четыре вопроса</b>; граница CD — secrets на следующем уроке', 'Шестое: workflow от AI — точка старта. Четыре вопроса: есть ли checkout, моя ли версия, npm ci ли, есть ли tsc и build. Потом push и run. Граница CD: dist main падает без env, secrets и сервер — на следующем уроке.'],
  hw: ['<b>Домашнее задание</b>: pull_request, job lint и значок конвейера в README', 'Домашнее задание: расширьте конвейер в своём репозитории. Пусть запускается и на pull request. Вторая job — lint: prettier check. Поставьте в README значок конвейера: любой, кто откроет, увидит, зелёный он или красный.'],
  hw2: ['Один раз <b>lint красный</b>, потом зелёный; ссылка на репозиторий — на платформу', 'Потом нарочно сломайте формат одного файла и сделайте push: lint красный, test зелёный. Исправьте и сделайте push — обе зелёные. Вставьте ссылку на репозиторий в домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: конвейер, ci.yml, четыре ловушки, правило Node и вопросы к AI — на одной странице', 'Внизу памятка на одну страницу: CI и CD, четыре шага конвейера, ci yml, четыре ловушки, правило версии Node, четыре вопроса к workflow от AI, граница CD и места, где ошибаются. Скопируйте или скачайте, пусть будет рядом на уроке.'],
};
RU_S.CHEAT = `# CI/CD — памятка ментора (OrderBotNest, конвейер)
## Проект
git fetch --tags · git checkout cicd1-start (= jest2-done) → cicd1-done (.github/workflows/ci.yml) · npm test — 25 тестов, база и токен не нужны
## CI / CD
CI — при каждом push ваши команды на чистой машине (установка → типы → тест → build): вместо «у меня работает» — один ответ для всех · CD — выпуск проверенного груза: Delivery (подтверждает человек) · Deployment (конвейер сам)
## Конвейер — четыре шага
npm ci → npx tsc --noEmit → npm test → npm run build · код выхода: 0 зелёный, 1 (jest), 2 (tsc), 127 (нет команды) красный · после первого красного остальное «skipped» · локально: npm ci && npx tsc --noEmit && npm test && npm run build
## ci.yml (15 строк)
name: CI · on: [push, pull_request] · jobs: test: runs-on: ubuntu-latest · steps: - uses: actions/checkout@v4 · - uses: actions/setup-node@v4 (with: node-version: 24, cache: npm) · - run: npm ci · - run: npx tsc --noEmit · - run: npm test · - run: npm run build
push → Actions → run → job → шаги (Set up job, checkout, setup-node, run: …) → лог (нажмите на шаг)
## Четыре ловушки
нет checkout → npm ci: «can only install with an existing package-lock.json» (папка пустая) · package.json изменён вручную, lock старый → не «in sync» (локально npm install, lock в commit; в конвейере npm ci) · нет шага tsc → ошибка типа проходит зелёной (ложный зелёный) · сдвиг YAML / нет runs-on → run красный, job нет («workflow file issue»)
## Локально зелёный, в конвейере красный
Missing: webpack@5.112.2 from lock file → Node (npm) на runner другой, чем на машине: node-version = ваше число из node --version (22 → 24 — зелёный)
## Приём workflow от AI — четыре вопроса
есть ли checkout · node-version мой · npm ci (не install) · есть ли шаги tsc и build → push → зелёный ли run · оба AI написали node-version: 22, без tsc/build
## Граница CD
node dist/main → DATABASE_URL topilmadi (нет .env) · нужно: Secrets (DATABASE_URL, BOT_TOKEN) · сервер · команда выпуска — следующие уроки
## Подготовка к классу (m4c-01, 20 экранов)
лента аэропорта: Сборка = npm install · Сканер = npm test · Рамка размера = eslint · Упаковка = build · Вылет = deploy · стартовый сигнал = on: push · маршрут = ci.yml · вы добавляете: строку checkout (её нет в yml ученика), причину npm ci, один настоящий run
## Где ошибаются
нет run → путь файла / push · Could not read package.json (ENOENT) → нет checkout · run красный, job нет → YAML / runs-on · Missing … from lock file → версия Node
## Ваше домашнее задание (40–60 минут)
pull_request · job lint (prettier --check) · badge в README · один раз lint красный → зелёный → ссылка на репозиторий на платформу`;
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxatlari
ru(CAUSE10, ['npm test вернул код выхода 1 (тест границы красный)', 'Конвейер остановился на этом шаге — npm run build «skipped»', 'Сломанный код не собран и никуда не ушёл', 'Восстановите строку и запушьте — run снова зелёный']);
ru(L_ST, { ok: '✓ зелёный', bad: '✗ красный', skip: '— не запускался' });
