
// ============================================================
//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/cicd2-*.json, ru/cicd2-sahna.js). M24: UZ bo'laklarga tegilmaydi.
//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.
// ============================================================

// --- sahna (ru/cicd2-sahna.js) ---
// CI/CD-2 · sahna ruschasi (M24): modul darajasidagi ro'yxatlar va ekran obyektlariga qo'shimcha. ru() bitta obyektga bir marta.
var RU_S = {
  S1: { plan: ['Общее понятие', 'Чтение красного и cache', 'matrix', 'Smoke и secret', 'PR и AI', 'Подготовка к классу'] },
};
ru(FOUR18, ['есть `services: postgres` + healthcheck?', 'доходит ли `DATABASE_URL` до шага smoke (где `env`)?', 'Порядок: smoke после `build` (или `needs: test`)?', 'Нужен ли secret: контейнер — нет; внешняя база — да']);
ru(DICT21, [['маршрут · машина ленты · стартовый сигнал', null], ['точка · действие', 'job · step (uses — готовое действие, run — команда)'], ['журнал · найти причину в журнале', 'лог шага · аннотация → красный шаг → лог (экран 4)'], ['параллельные ленты', 'strategy.matrix — каждое значение отдельная job; fail-fast'], ['ближняя полка', null], ['сейф', 'GitHub Secrets — ${{ secrets.NOM }}, в логе ***; контейнер — env'], ['табло', null]]);
ru(SIM21, [['matrix: 3 ленты, все ✓', '22 ✗ (lock), 24 ✓; fail-fast отменил 24 (30, 31)'], ['сейф: ${{ secrets.API_KEY }} → скрыт', 'в логе ***; имя неверное — пусто, ошибки нет (33)'], ['журнал: причина в одной строке', 'аннотация короткая; причина в логе шага (15, 11)'], ['табло: passing', 'badge.svg — последний run в main (37)']]);
ru(ADD23, [['настоящий run на проекторе: job → шаг → лог; аннотация vs лог (экран 4)', '«Найти причину в журнале»'], ['настоящий результат matrix: одна версия может быть красной, fail-fast останавливает остальные (8–9)', 'параллельные ленты'], ['неверное имя secret — ошибки нет, приходит пусто (14); для контейнера secret не нужен', 'сейф'], ['ловушки npm ci и echo ok в образце (22)', '«Нет репозитория?» + домашнее задание']]);
ru(CARDS23, [
  ['npm ci красный, нет lock', null, 'npm install (образец) или lock в commit'],
  ['в matrix одна job «cancelled»', null, 'ошибка в другой job; fail-fast: false'],
  ['«сломал тест, а всё равно зелёный»', null, 'echo ok && exit 0 — не ломается; exit 1 или Jest-проект'],
]);
ru(QA23, [
  ['«Где журнал?»', 'run → job → шаг; нажмите на имя шага — откроется лог.'],
  ['«В matrix всё обязательно должно быть зелёным?»', 'Нет — цель знать, на какой версии работает; красная версия — это ответ.'],
  ['«Можно увидеть ключ в сейфе?»', 'Нет — в логе ***; значение видно только при записи, потом его никто не прочитает.'],
  ['«А если badge красный?»', 'последний run в main красный — откройте Actions и найдите красный шаг.'],
]);
ru(SUM25, [
  { t: 'run → job → step; GitHub добавляет: Set up job (runner, право токена, action), Post Run (cache), Complete job. Внутри uses открыто: checkout — git init + fetch --depth=1; setup-node — «Found in cache», версия Node/npm' },
  { t: 'Красный run: знак → job → шаг → лог. Аннотация — адрес (строки ##[error]), причина — в логе шага. Cache: «saved» → «hit» (npm ci 11 с → 5 с); привязан к ветке («not found» — не ошибка)' },
  { t: 'matrix — одна job, несколько значений, параллельно; fail-fast (по умолчанию): если одна упала, остальные «cancelled»; полный ответ — fail-fast: false. Боту/сайту хватит одного Node' },
  { t: 'Проверка с базой в конвейере: job smoke needs: test, services: postgres:18 (пароль, POSTGRES_DB, порт, healthcheck pg_isready), npm run smoke env: DATABASE_URL → Initialize containers → NATIJA: 5/5 ✓ → Stop containers' },
  { t: 'env — контейнер (не секрет); Secrets — внешний ресурс (Settings → Secrets, ${{ secrets.NOM }}, в логе ***). Неверное имя — ошибки нет, значение пустое, программа падает («topilmadi»)' },
  { t: 'Pull request: ветка → PR → run pull_request → checks → merge → run в main; badge в README. Workflow smoke от AI: если опора (ci.yml) верна, AI тоже верен; четыре вопроса: services + healthcheck · доходит ли env · порядок · нужен ли secret' },
]);
RU_S.TITLE = 'Внутри GitHub Actions: от красного run до PR';
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 4 проверки · самопроверка 8 вопросов. После экрана 11 можно сделать перерыв', 'Нужно: урок для менторов CI/CD-1 (в вашем репозитории на GitHub ci.yml и зелёный run) · Node.js 20+ · VS Code · AI-помощник. База и токен бота не нужны — Postgres поднимается в конвейере контейнером', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега cicd2-start (= cicd1-done); каждый run — из настоящего GitHub Actions'];
RU_S.FIN_INTRO = 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов: job и машина, checkout, чтение красного, cache, fail fast, services, имя secret и pull request. На каждый вопрос одна попытка, после ответа откроются верный ответ и пояснение. Шесть и больше — урок усвоен. Если меньше, вернитесь к указанным экранам и пройдите тест заново.';
RU_S.FIN_PASS = 'Урок усвоен. Теперь, если ученик скажет «у меня конвейер красный», вы вместе спуститесь в job, шаг и лог.';
RU_S.NEXT_T = 'WebSocket: живая панель';
RU_S.NEXT_D = 'Бот получил заказ — панель в браузере показывает его сама, без обновления страницы';
RU_S.FILE = 'github-actions-pamyatka-mentora.md';
RU_S.YAK = {
  b1: ['<b>run → job → step</b>; шаги GitHub; внутри uses открыто', 'Первое: run, job, step. GitHub сам добавляет set up job, post run и complete job. Uses не скрыт: checkout делает git init и fetch depth один, setup node находит готовый Node, в логе версии Node и npm.'],
  b2: ['Чтение красного: <b>знак → job → шаг → лог</b>; cache saved → hit', 'Второе: красный run читайте в порядке знак, job, шаг, лог. Аннотация — адрес, причина — в логе. Cache npm сохраняется в первом run, во втором hit, npm ci вдвое быстрее. В другой ветке not found, это не ошибка.'],
  b3: ['<b>matrix</b> — несколько версий параллельно; fail-fast отменяет остальные', 'Третье: matrix параллельно проверяет один файл на нескольких Node. Fail fast по умолчанию: если одна упала, остальные cancelled. Для полного ответа — fail fast false. Боту или сайту хватит одного Node с вашей машины.'],
  b4: ['Smoke в конвейере: <b>services: postgres</b>, healthcheck, needs: test', 'Четвёртое: проверка с базой в конвейере. Job smoke с needs test, services postgres восемнадцать, пароль, имя базы, порт, healthcheck pg is ready. Initialize containers, npm run smoke, итог пять из пяти, stop containers.'],
  b5: ['<b>env</b> — контейнер, <b>secrets</b> — внешнее; неверное имя — пусто, ошибки нет', 'Пятое: пароль контейнера открыт в env, и это правильно. Настоящая база и токен — в secrets, в логе звёздочки. Если имя secret неверное, GitHub молчит, приходит пустое значение, и программа падает с «не найден».'],
  b6: ['<b>Pull request</b> → checks → merge; badge; четыре вопроса к AI', 'Шестое: новая работа в отдельной ветке, pull request, checks зелёные, merge, run в main. Badge в README. Workflow smoke от AI: если опора верна, AI тоже верен; четыре вопроса: services, env, порядок, нужен ли secret.'],
  hw: ['<b>Домашнее задание</b>: job lint, защита main, красный PR → зелёный PR', 'Домашнее задание: третья job в конвейере — lint, через prettier check. Потом защитите ветку main: required status checks, test, smoke, lint. Откройте pull request с нарочно неверно отформатированным файлом: lint красный, merge закрыт.'],
  hw2: ['Исправьте и push — <b>зелёный, merge</b>; адрес репозитория и PR — на платформу', 'Исправьте и сделайте push: все три зелёные, merge. Badge в README зелёный. Вставьте ссылку на репозиторий и адрес PR в домашнее задание на платформе. Сорок–шестьдесят минут.'],
  c: ['<b>Возьмите памятку</b>: внутри run, cache, matrix, services, secrets, PR — на одной странице', 'Внизу памятка на одну страницу: run, job, step, логи uses, чтение красного, cache, matrix, шаблон job smoke, env и secrets, pull request, badge, четыре вопроса к AI, словарь класса и места, где ошибаются. Скопируйте или скачайте.'],
};
RU_S.CHEAT = `# GitHub Actions — памятка ментора (OrderBotNest, внутри run → PR)
## Проект
git fetch --tags · git checkout cicd2-start (= cicd1-done) → cicd2-done (merge PR #1: job smoke + badge в README) · npm test — 25 тестов · npm run smoke — нужен Postgres (DATABASE_URL)
## run → job → step
run = один push · job = каждое имя под jobs: (отдельная машина; needs — порядок) · step = каждый uses/run · GitHub добавляет: Set up job · Post Run … · Complete job
## Внутри uses (лог)
Set up job: Image: ubuntu-26.04 · GITHUB_TOKEN Permissions: Contents: read · Download action repository · checkout: Deleting the contents → git init → fetch --depth=1 · setup-node: Found in cache @ …/node/24.22.1 · node: v24.22.1 · npm: 11.19.1
## Чтение красного run
знак → красная job → красный шаг (✗) → лог · аннотация = строки ##[error] (коротко, адрес) · ошибка Jest в аннотацию не выходит — только «exit code 1»
## cache: npm
1-й run: npm cache is not found → Post: Cache saved with the key: node-cache-Linux-x64-npm-<hash lock> · 2-й run: Cache hit for: … (npm ci 11 с → 5 с) · другая ветка: not found (не ошибка)
## matrix
strategy: matrix: node-version: [22, 24] · node-version: \${{ matrix.node-version }} → test (22), test (24) параллельно · fail-fast (по умолчанию true): одна упала — остальные cancelled («The strategy configuration was canceled because "test._22" failed») · fail-fast: false — полный ответ · боту/сайту хватит одного Node
## job smoke (services)
smoke: needs: test · services: postgres: image: postgres:18 · env: POSTGRES_PASSWORD: postgres, POSTGRES_DB: shop · ports: - 5432:5432 · options: --health-cmd "pg_isready -U postgres" … · steps: checkout · setup-node · npm ci · npm run smoke (env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop) → Initialize containers → NATIJA: 5/5 ✓ → Stop containers
## env ↔ secrets
контейнер — env: (открыто, умирает с job) · внешний ресурс (боевая база, токен бота) — Settings → Secrets and variables → Actions; в yml: \${{ secrets.NOM }}; в логе *** · неверное имя (DATABSE_URL) — ошибки нет, значение пустое → «DATABASE_URL topilmadi» (код 2)
## Pull request · badge
git checkout -b lenta-smoke → push → PR (lenta-smoke → main) → run on: pull_request → checks: test ✓ smoke ✓ → Merge → run в main · README: [![CI](https://github.com/<вы>/OrderBotNest/actions/workflows/ci.yml/badge.svg)](…)
## Четыре вопроса к workflow smoke от AI
есть ли services + healthcheck · доходит ли DATABASE_URL до шага smoke (где env) · порядок (после build / needs: test) · нужен ли secret (контейнер — нет) · если опорный ci.yml верен, AI тоже верен
## Подготовка к классу (m4c-03, 23 экрана)
маршрут = ci.yml · точка = job · действие = step · журнал = лог · параллельные ленты = matrix · ближняя полка = cache · сейф = secrets · табло = badge · образец: npm ci без lock → красный; echo ok не ломается
## Где ошибаются
can only install with an existing package-lock.json → npm install / lock в commit · cancelled → упала другая job, fail-fast · «сломал, а зелёный» → echo ok · DATABASE_URL topilmadi → env/имя secret · ECONNREFUSED 5432 → services/ports/healthcheck
## Ваше домашнее задание (40–60 минут)
job lint · правило ветки (required checks) · красный PR → зелёный PR · ссылка на репозиторий + адрес PR на платформу`;
ru(HOMEWORK25, [
  { t: 'job lint — ci.yml: jobs.lint — checkout · setup-node · npm ci · npx prettier --check "src/**/*.ts" (три job: test · smoke · lint)' },
  { t: 'Защита — Settings → Branches → правило main → Require status checks: test, smoke, lint' },
  { t: 'Красный PR — ветка lint-sinov, сломайте формат src/api/app.controller.ts (в одну строку), push, PR: lint ✗, Merge закрыт' },
  { t: 'Зелёный PR — prettier --write, push: все три ✓, merge' },
  { t: 'Сдача — ссылка на репозиторий + адрес PR → домашнее задание на платформе' },
]);
// 2-tur (05.11): skaner tuzatilgandan keyin topilgan modul ro'yxati
ru(ORDER4, ['Значок: run красный', 'Слева красный job', 'Красный шаг (✗)', 'Лог шага — причина здесь', 'Строки ##[error] → аннотация (кратко)']);

const RU_MDT = {
 "1": {
  "kicker": "Вступление",
  "eyebrow": "Курс для менторов · CI/CD",
  "title": "Конвейер есть, и он зелёный. Сегодня заходим внутрь: лог, cache, matrix, smoke с Postgres, secret и pull request — всё на настоящих run",
  "seg": {
   "a": [
    "В CI/CD-1 вы написали конвейер — сегодня заходим <b>внутрь Actions</b>, всё на настоящих run",
    "Здравствуйте. На прошлом уроке вы написали конвейер для OrderBotNest: при каждом push четыре шага. Сегодня заходим внутрь этого конвейера. На экране результат в конце урока: две job, test и smoke, smoke с настоящим Postgres, обе зелёные."
   ],
   "b": [
    "Сначала <b>общее понятие</b>: run, job, step и шаги, которые GitHub добавляет сам",
    "Сначала общее понятие: что делает Actions, что такое run, job и step, какие шаги GitHub добавляет сам и что происходит внутри uses. Потом увидите, как правильно читать красный run и что делает cache."
   ],
   "c": [
    "Потом <b>matrix, smoke с сервисом Postgres, secret и pull request</b>",
    "На третьем этапе matrix: один файл, два Node. На четвёртом ставим в конвейер проверку с базой: сервис Postgres и smoke. Что такое secret и что будет, если ошибиться в имени. На пятом — pull request и workflow, написанные AI. В конце подготовка к классу."
   ],
   "d": [
    "Шесть этапов, три практики — <b>в вашем репозитории на GitHub</b>; каждый run настоящий",
    "Урок — шесть этапов, три практики, всё в вашем репозитории с CI/CD-1. Каждый run на экране настоящий: запущен в OrderBotNest в этот день, шаги и секунды те же. Не спешите, каждый экран можно прослушать с начала. Начинаем."
   ]
  }
 },
 "2": {
  "kicker": "Этап 1 · общее понятие",
  "title": "Каждый push — run; в файле каждое имя под jobs: — одна job на отдельной машине; внутри job шаги; три из них GitHub добавляет сам",
  "seg": {
   "a": [
    "Run — один push; <b>job — каждое имя под <code>jobs:</code> в файле</b>, каждая на отдельной машине",
    "Разберёмся в Actions с начала. Каждый push — один run. В файле под jobs одно имя, test, значит одна job. Job — это отдельная машина: напишете два имени — параллельно откроются две машины. Это увидите в matrix и smoke."
   ],
   "b": [
    "Step — шаг внутри job: <b>каждый <code>uses</code> и <code>run</code> — одна строка «Run …»</b>",
    "Внутри job шаги: сколько в файле под steps строк uses и run, столько строк Run в окне run. Checkout, setup node, четыре команды. Рядом с каждой строкой знак и секунды, нажмёте — лог."
   ],
   "c": [
    "Три из них вы не писали: <b><code>Set up job</code>, <code>Post Run …</code>, <code>Complete job</code></b> — их добавляет GitHub",
    "Но в списке есть и строки, которые вы не писали. В начале set up job: подготовка машины. В конце post run, то есть очистка и сохранение cache, и complete job. GitHub добавляет их к каждой job сам. В их логе есть полезное, сейчас посмотрим."
   ],
   "d": [
    "Итог: <b>run → job → step</b>; если красный — какая job, какой шаг, его лог",
    "Итог: run, job, step. Run зелёный или красный. Если красный, спускаетесь вниз: какая job, какой шаг, и читаете лог этого шага. Теперь заглянем внутрь шагов, которые добавил GitHub."
   ]
  }
 },
 "3": {
  "kicker": "Этап 1 · общее понятие",
  "title": "Готовые шаги не скрыты: Set up job называет машину, checkout делает в пустой папке git init и fetch --depth=1, setup-node находит готовый Node",
  "seg": {
   "a": [
    "Лог <code>Set up job</code>: <b>runner <code>ubuntu-26.04</code>, право токена <code>Contents: read</code></b>, скачиваются action",
    "Откройте run, нажмите на шаг set up job. Машина: image ubuntu двадцать шесть ноль четыре. Ubuntu latest теперь это, изменилось с октября. Право GitHub token: contents read, только чтение. Потом download action repository: скачиваются готовые шаги checkout и setup node, с SHA."
   ],
   "b": [
    "Внутри <code>checkout</code>: <b>очищает папку, <code>git init</code>, <code>fetch --depth=1</code></b> — только последний commit",
    "Нажмите на шаг checkout. Syncing repository, потом deleting the contents: папка очищается. Git init: пустой репозиторий. Git fetch depth один: берётся только последний commit, не вся история, чтобы было быстро. Вот почему в CI/CD-1 без checkout папка была пустой."
   ],
   "c": [
    "Внутри <code>setup-node</code>: <b>«Found in cache» — на runner уже есть Node 24.22.1, npm 11.19.1</b>",
    "Setup node: node version двадцать четыре, cache npm. Found in cache: Node двадцать четыре на runner уже есть, не скачивался. Node v двадцать четыре двадцать два один, npm одиннадцать девятнадцать. Здесь видна ловушка из CI/CD-1: номер версии называет лог."
   ],
   "d": [
    "Итог: <b><code>uses</code> — скрипт, написанный другими</b>, лог открыт; машина, версия, право — здесь",
    "Итог: uses — не что-то скрытое, это скрипт, написанный другими, и лог его открыт. Какая машина, какой Node, на что у токена право — всё в логе этих трёх шагов. Если ошибка непонятна, сначала смотрите сюда. Теперь читаем красный run."
   ]
  }
 },
 "4": {
  "kicker": "Этап 2 · читаем красный",
  "title": "Аннотация на странице run — первая строка ошибки; полная причина в логе красного шага: в run с tsc три аннотации, в логе восемь строк",
  "seg": {
   "a": [
    "Верх страницы run — <b>аннотации</b>: строки, начинающиеся с <code>##[error]</code>, короткие",
    "Откройте красный run, run с tsc из CI/CD-1. Вверху annotations: три строки. Process completed with exit code two, no overload matches this call и первая строка ошибки типа. Это строки лога, начинающиеся со знака error, GitHub выносит их наверх."
   ],
   "b": [
    "Полная причина — <b>в логе красного шага</b>: файл, строка, колонка, две ошибки, что чему не соответствует",
    "Но аннотация короткая. Нажмите на красный шаг: npx tsc. В логе всё: user service ts, двадцатая строка, сорок вторая колонка, TS два три два два, number не соответствует string, и в двадцать второй строке вторая ошибка. Причина здесь, а не в аннотации."
   ],
   "c": [
    "В красном run с тестом аннотация <b>только «exit code 1»</b> — ошибка Jest в логе: FAIL, какой тест, какая строка",
    "В run, где покраснел тест, аннотаций ещё меньше: только process completed with exit code one. Jest не пишет со знаком error. Какой тест, что ожидалось, что пришло, тридцать седьмая строка — всё в логе шага npm test. Аннотация говорит вам только, какой это шаг."
   ],
   "d": [
    "Итог: <b>знак → красная job → красный шаг → лог</b>; аннотация показывает путь, причина в логе",
    "Итог: порядок чтения красного run: знак, красная job, красный шаг, его лог. Аннотация — указатель, причина в логе. Если ученик говорит «у меня конвейер красный, что делать», нажмите эти четыре шага вместе. Теперь проверим."
   ]
  }
 },
 "5": {
  "kicker": "Проверка 1",
  "eyebrow": "Проверка · 1 / 4",
  "title": "Run красный. В аннотации только Process completed with exit code 1. — на шаге npm test. Где прочитаете причину?",
  "q": "Вы видели, как читать красный run, теперь проверим. Первая проверка. Run красный, в аннотации только process completed with exit code one, на шаге npm test. Где прочитаете, какой тест упал? Выберите вариант.",
  "ok": "Верно. Нажимаете на красный шаг: npm test. В логе полный вывод Jest: FAIL, какой тест, что ожидалось и что пришло, тридцать седьмая строка. Аннотация показала только шаг, потому что Jest не пишет со знаком error. Значит, аннотация — адрес, а лог — причина; перезапускать локально не нужно.",
  "okShort": "Лог красного шага — полный вывод Jest. Аннотация — только адрес.",
  "hint": "Порядок с экрана 4: знак → job → шаг → ?",
  "demak": "аннотация — адрес (какой шаг); причина — в логе красного шага. Ошибка Jest в аннотацию не выходит.",
  "opts": [
   "Нажать на аннотацию — она откроет полную ошибку",
   "Нажать на шаг npm test — в логе FAIL и имя теста",
   "Из лога Set up job — он собирает все ошибки",
   "Перезапустить commit локально — лог GitHub неполный"
  ],
  "wrong": {
   "0": "Аннотация — короткая строка, не раскрывается — для Jest только «exit code 1».",
   "2": "Set up job — машина и права; ошибок шагов там нет.",
   "3": "Лог GitHub — полный текст как в вашем терминале; перезапускать локально не нужно."
  }
 },
 "6": {
  "kicker": "Этап 2 · cache",
  "title": "Что делает cache: npm: первый run «Cache saved», второй «Cache hit» — npm ci 11 с → 5 с; а в main «not found»: cache привязан к ветке",
  "seg": {
   "a": [
    "<code>setup-node</code> <code>cache: npm</code> — в первом run <b>«npm cache is not found»</b>, в конце «Cache saved with the key»",
    "Что делает строка cache npm в ci yml? В логе setup node первого run: npm cache is not found, кэша нет. В конце, в шаге post run setup node: cache saved with the key, node cache, Linux, npm и длинное число. Npm ci шёл одиннадцать секунд."
   ],
   "b": [
    "Второй run: <b>«Cache hit» — <code>npm ci</code> с 11 секунд упал до 5</b>; ключ — hash lock-файла",
    "Второй run, та же ветка: cache hit for, тот же ключ. Npm ci — пять секунд: пакеты не из интернета, а из сохранённого кэша. Длинное число в ключе — hash package lock json: изменится lock — изменится ключ, кэш соберётся заново. Поэтому lock должен быть в commit."
   ],
   "c": [
    "Первый run в <code>main</code>: снова <b>«not found»</b> — cache привязан к ветке, кэш <code>ci-sinov</code> в <code>main</code> не переходит",
    "Теперь первый run в ветке main: снова npm cache is not found, npm ci снова одиннадцать секунд. Кэш привязан к ветке: сохранённый в ветке ci sinov в main не переходит. Когда main один раз станет зелёным, следующие run и ветки возьмут этот кэш."
   ],
   "d": [
    "Итог: <b>cache — скорость, а не правильность</b>; «not found» — не ошибка, «hit» — значит lock не менялся",
    "Итог: cache — для скорости, не для правильности: и без кэша конвейер работает правильно, только медленнее. Если видите в логе not found, это не ошибка. Если hit — lock не менялся. Теперь прочитаете свой run."
   ]
  }
 },
 "7": {
  "kicker": "Практика 1 / 3",
  "eyebrow": "Сейчас у себя · 12 минут",
  "title": "Откройте в своём репозитории с CI/CD-1 два run: Set up job, checkout, cache «saved» и «hit», секунды npm ci",
  "seg": {
   "a": [
    "Теперь вы: <b>два последних run в вашем репозитории</b>, три лога и cache",
    "Теперь ваша очередь. Откройте на GitHub свой репозиторий с CI/CD-1, раздел Actions. Прочитаете два последних run: логи set up job, checkout, setup node и cache. Push не нужен, только чтение. Займёт двенадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>в <code>Set up job</code> машина и право</b>, в <code>checkout</code> — <code>git init</code> и <code>fetch --depth=1</code>",
    "На первом шаге открываете последний run и находите в логе set up job image и право GITHUB TOKEN. На втором — строки git init и fetch depth один в логе checkout. Сравните с третьим экраном."
   ],
   "c": [
    "Шаги 3–4: <b>cache в двух run: «saved» и «hit»</b>, секунды <code>npm ci</code>; подтверждение — строка hit",
    "На третьем шаге находите cache saved в логе post run setup node старого run и cache hit в логе setup node нового. На четвёртом записываете, сколько секунд шёл npm ci в обоих run. В поле подтверждения скопируйте строку cache hit."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?» внизу. Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы умеете открыть и прочитать каждый шаг run."
   ]
  },
  "steps": [
   {
    "t": "Set up job",
    "exp": "Image: ubuntu-… · GITHUB_TOKEN Permissions · Download action repository",
    "cmds": [
     "GitHub → Actions → последний run → job test → Set up job"
    ]
   },
   {
    "t": "checkout",
    "exp": "Deleting the contents of · git init · fetch … --depth=1",
    "cmds": [
     "лог Run actions/checkout@v4"
    ]
   },
   {
    "t": "Cache",
    "exp": "Cache saved with the key: node-cache-… · Cache hit for: node-cache-…",
    "cmds": [
     "старый run → Post Run actions/setup-node@v4",
     "новый run → Run actions/setup-node@v4"
    ]
   },
   {
    "t": "Секунды",
    "exp": "во втором меньше",
    "cmds": [
     "секунды рядом с Run npm ci в обоих run"
    ]
   }
  ],
  "proof": {
   "label": "Строка «Cache hit» в новом run",
   "placeholder": "например: Cache hit for: node-cache-Linux-x64-npm-…",
   "wrong": "Вставьте строку Cache hit for: node-cache-… из лога Run actions/setup-node@v4."
  },
  "trouble": [
   [
    "В обоих run npm cache is not found",
    "второй run в другой ветке или нет строки cache: npm — нужны два run подряд в одной ветке"
   ],
   [
    "Нет Cache saved",
    "run закончился красным — Post Run сохраняет cache только когда npm ci прошёл; откройте зелёный run"
   ],
   [
    "Лог не открывается (пустой)",
    "run ещё идёт или старше 90 дней — сделайте новый push"
   ],
   [
    "Вышло Image: ubuntu-24.04",
    "образ runner зависит от даты — не ошибка, запишите число"
   ]
  ]
 },
 "8": {
  "kicker": "Этап 3 · matrix",
  "title": "strategy.matrix.node-version: [22, 24] — одно описание job, две машины: test (22) красный, а test (24)… отменён — fail-fast",
  "seg": {
   "a": [
    "Matrix: <b><code>strategy.matrix</code> — одна job, несколько значений</b>; <code>${{ matrix.node-version }}</code> — каждой машине своё число",
    "Начинаем с matrix. В ci yml под job: strategy, matrix, node version, в скобках двадцать два и двадцать четыре. А в setup node вместо числа — matrix node version. Одно описание job, а GitHub открывает из него две машины: test двадцать два и test двадцать четыре, параллельно."
   ],
   "b": [
    "Run: <b><code>test (22)</code> красный — <code>npm ci</code>, та же ловушка с lock</b>; <code>test (24)</code> «cancelled»",
    "Push, run. Слева две job. Test двадцать два красный: npm ci, та же ловушка из CI/CD-1, missing webpack from lock file. А test двадцать четыре ни зелёный, ни красный: cancelled, отменён, на двадцать второй секунде, когда шёл tsc."
   ],
   "c": [
    "Значит, причина: <b>fail-fast — если одна упала, остальные отменяются</b> (настройка по умолчанию)",
    "Значит, причина в аннотации: the strategy configuration was canceled because test двадцать два failed. Это fail fast: если в matrix падает одна машина, GitHub отменяет остальные, экономит время и машины. Это настройка по умолчанию. Но вы так и не узнаете, что было с двадцать четыре."
   ],
   "d": [
    "Итог: <b>matrix проверяет не машину, а версию</b>; нужен полный результат — <code>fail-fast: false</code>",
    "Итог: matrix проверяет один код на нескольких версиях. Fail fast быстрый, но ответ неполный: зелёный ли двадцать четыре, мы не узнали. Если нужен полный ответ — fail fast false. В следующем run поставим именно его."
   ]
  }
 },
 "9": {
  "kicker": "Этап 3 · matrix",
  "title": "fail-fast: false — обе машины до конца: test (22) красный, test (24) зелёный; run красный, но ответ полный: код работает на 24, на 22 lock не читается",
  "seg": {
   "a": [
    "<code>fail-fast: false</code> — <b>обе машины идут до конца</b>, run всё равно красный (22 упал)",
    "Добавляем под strategy fail fast false. Push. Теперь обе job дошли до конца: test двадцать два красный, test двадцать четыре зелёный, все четыре шага. Run в целом красный, потому что одна упала, но ответ полный."
   ],
   "b": [
    "Лог 22 — <b>та же ошибка из CI/CD-1</b>: npm 10 не может прочитать lock; 24 — всё зелёное",
    "Лог npm ci на двадцать два: missing webpack from lock file, ошибка с семнадцатого экрана CI/CD-1. Двадцать четыре: npm ci, tsc, test, build — всё зелёное. Matrix точно сказал вам: этот проект работает на Node двадцать четыре, на двадцать два lock не читается."
   ],
   "c": [
    "Кому нужен matrix: <b>если пишете библиотеку — да</b>, бот или сайт — хватит одного Node с вашей машины",
    "Кому нужен matrix? Если пишете библиотеку, её используют на разных Node, matrix обязателен. Бот или сайт вроде OrderBotNest работают на одном сервере, на одном Node: хватит числа с вашей машины. В уроке ученика matrix нарисован как параллельные ленты, три Node."
   ],
   "d": [
    "Итог: <b>matrix — несколько версий, параллельно</b>; <code>fail-fast</code> быстро, <code>false</code> — полный ответ",
    "Итог: matrix параллельно проверяет один файл на нескольких версиях. Fail fast быстро останавливает, false даёт полный ответ. Нужно проекту — ставьте, нет — один Node, как на вашей машине. Теперь проверим."
   ]
  }
 },
 "10": {
  "kicker": "Проверка 2",
  "eyebrow": "Проверка · 2 / 4",
  "title": "matrix [22, 24], fail-fast не написан. test (22) упал на 10-й секунде, test (24) ещё в tsc. Что будет с test (24)?",
  "q": "Вы видели matrix, теперь проверим. Вторая проверка. Matrix двадцать два и двадцать четыре, fail fast не написан. Test двадцать два упал на десятой секунде, test двадцать четыре ещё в tsc. Что будет с двадцать четыре? Выберите вариант.",
  "ok": "Верно. Если fail fast не написан, он true: как только одна машина упала, GitHub отменяет остальные, cancelled. Двадцать четыре остановлен в tsc, результат неизвестен. Если нужен полный ответ, пишется fail fast false. Значит, если в matrix видите cancelled, это не ошибка этой job, а падение другой.",
  "okShort": "<code>fail-fast</code> по умолчанию <code>true</code> — если одна упала, остальные «cancelled». Полный ответ — <code>fail-fast: false</code>.",
  "hint": "Аннотация с экрана 8: «canceled because … failed» — кто кого остановил?",
  "demak": "«cancelled» в matrix — не ошибка этой job: упала другая job, остановил <code>fail-fast</code>.",
  "opts": [
   "Дойдёт до конца — job в matrix не зависят друг от друга",
   "Дойдёт до конца, но результат не войдёт в run",
   "Будет отменён — fail-fast по умолчанию останавливает остальные",
   "Начнётся заново — GitHub использует 24 вместо 22"
  ],
  "wrong": {
   "0": "job в matrix связаны одной strategy — fail-fast управляет ими вместе.",
   "1": "Не дойдёт: на 22-й секунде «cancelled», tsc не закончился.",
   "3": "GitHub не меняет машину; каждое значение — своя машина."
  }
 },
 "11": {
  "kicker": "Практика 2 / 3",
  "eyebrow": "Сейчас у себя · 15 минут",
  "title": "Добавьте в ci.yml matrix [22, 24], посмотрите на две job, получите полный ответ с fail-fast: false, потом верните один Node",
  "seg": {
   "a": [
    "Теперь вы: <b>matrix в вашем репозитории</b>, две машины, fail-fast в двух состояниях",
    "Теперь ваша очередь. Добавляете в ci yml своего репозитория matrix, двадцать два и двадцать четыре, делаете push и смотрите на две job. Потом полный ответ с fail fast false, в конце возвращаете один Node. Займёт пятнадцать минут."
   ],
   "b": [
    "Шаги 1–2: <b>matrix и push</b> — <code>test (22)</code> красный, <code>test (24)</code> cancelled",
    "На первом шаге пишете strategy matrix и в setup node matrix node version, как на восьмом экране. На втором — push: в Actions две job, двадцать два должен быть красным, двадцать четыре — cancelled."
   ],
   "c": [
    "Шаги 3–4: <b><code>fail-fast: false</code></b> — 24 зелёный; потом убрать matrix, <code>node-version: 24</code>; подтверждение — состояние job 24",
    "На третьем шаге добавляете fail fast false и делаете push: двадцать четыре зелёный, двадцать два красный. На четвёртом убираете matrix и возвращаете node version двадцать четыре, run зелёный. В поле подтверждения напишите состояние job двадцать четыре на третьем шаге."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики вы пишете matrix и знаете, что такое cancelled."
   ]
  },
  "steps": [
   {
    "t": "matrix",
    "exp": "18 строк с экрана 8",
    "cmds": [
     null,
     "в setup-node: node-version: ${{ matrix.node-version }}"
    ]
   },
   {
    "t": "Push",
    "exp": "test (22) ✗ · test (24) cancelled"
   },
   {
    "t": "fail-fast: false",
    "exp": "test (22) ✗ · test (24) ✓",
    "cmds": [
     "под strategy: fail-fast: false",
     null
    ]
   },
   {
    "t": "Возврат",
    "exp": "run ✓ (одна job)",
    "cmds": [
     "уберите matrix, node-version: 24",
     null
    ]
   }
  ],
  "proof": {
   "label": "Состояние job test (24) на шаге 3",
   "placeholder": "например: success / зелёный",
   "wrong": "С fail-fast: false job 24 должна дойти до конца — напишите её состояние."
  },
  "trouble": [
   [
    "Одна job с именем test",
    "strategy не на одной глубине с runs-on или не используется matrix.node-version — yml с экрана 8"
   ],
   [
    "Обе зелёные",
    "у вас Node 22 и lock собран npm 10 — ловушки нет; ожидаемая разница появляется, только если lock собран npm 11 (CI/CD-1, экран 17)"
   ],
   [
    "Обе красные на npm ci",
    "lock не совпадает (CI/CD-1, экран 14) — npm install, lock в commit"
   ],
   [
    "Invalid workflow file",
    "сдвиг YAML — strategy: matrix: на два пробела правее, список [22, 24]"
   ]
  ]
 },
 "12": {
  "kicker": "Этап 4 · smoke и secret",
  "title": "Тесты Jest — без базы (mock). А smoke пишет в настоящий Postgres — в конвейере базы нет. Решение: временный контейнер рядом с job — services",
  "seg": {
   "a": [
    "В конвейере сейчас только <b>Jest — без базы</b>; а smoke с урока TgPg пишет в настоящую базу",
    "Четвёртый этап. В конвейере сейчас только тесты Jest: mock, базы нет, две секунды. Но на уроке Telegraf вы писали smoke: npm run smoke, настоящий код Nest и Telegraf, настоящий Postgres, перезапуск и race. Его нет в конвейере, потому что на runner нет базы."
   ],
   "b": [
    "<code>scripts/smoke.js</code>: <b>сам открывает базу <code>shop_smoke</code> по <code>DATABASE_URL</code></b>, в конце удаляет",
    "Откройте в OrderBotNest smoke js в папке scripts. Base url: из переменной окружения DATABASE URL. Из неё открывается временная база с именем shop smoke, через template zero, в конце удаляется. Значит, smoke нужна всего одна вещь: работающий Postgres и адрес к нему."
   ],
   "c": [
    "Решение: <b><code>services</code> — временный контейнер рядом с машиной job</b>, <code>postgres:18</code>, <code>localhost:5432</code>",
    "В GitHub это называется services: второй контейнер для job, здесь postgres восемнадцать. Он открывается вместе с job, стоит на машине на localhost пять тысяч четыреста тридцать два и выключается, как только job заканчивается. Никакой сервер, никакая внешняя база не нужны."
   ],
   "d": [
    "Итог: <b>unit-тесты без базы, smoke — с services</b>; в конвейере оба: быстро и полно",
    "Итог: unit-тесты без базы, быстрые. Smoke с базой, полный. Пусть в конвейере будут оба: сначала test, потом smoke, рядом с ним контейнер Postgres. На следующем экране напишем эту job и посмотрим на настоящий run."
   ]
  }
 },
 "13": {
  "kicker": "Этап 4 · smoke и secret",
  "title": "Вторая job smoke: needs: test, services: postgres:18 с healthcheck, npm run smoke — в run Initialize containers, потом NATIJA: 5/5 ✓",
  "seg": {
   "a": [
    "Вторая job: <b><code>smoke:</code> <code>needs: test</code></b> — если test красный, smoke не начнётся, Postgres не поднимется",
    "Добавляем в ci yml под jobs второе имя: smoke. Его первая строка — needs test: пусть сначала job test будет зелёной, потом smoke. Если test красный, smoke не начинается, Postgres тоже не поднимается, время не тратится зря."
   ],
   "b": [
    "<code>services: postgres</code>: <b>image, пароль, имя базы, порт и healthcheck</b> — ждёт, пока <code>pg_isready</code> не скажет «готов»",
    "Под services postgres: image postgres восемнадцать. Env: пароль и имя базы shop, из неё smoke открывает shop smoke. Ports: пять тысяч четыреста тридцать два. Options: healthcheck, pg is ready. Пока база не скажет «готов», шаги не начинаются, иначе smoke упал бы, не подключившись."
   ],
   "c": [
    "Шаги: checkout, setup-node, <code>npm ci</code>, <b><code>npm run smoke</code> — <code>env: DATABASE_URL</code> на контейнер</b>; в run «Initialize containers»",
    "Шаги знакомые: checkout, setup node, npm ci. Потом npm run smoke, в его env DATABASE URL: postgres, пароль postgres, localhost, shop. Push. В run две job: test зелёный, потом smoke: первый шаг initialize containers, Postgres поднят, двенадцать секунд."
   ],
   "d": [
    "Итог: в логе smoke <b><code>NATIJA: 5/5 ✓</code></b> — перезапуск и race в конвейере; <code>Stop containers</code> — база выключена",
    "Итог: лог шага npm run smoke: временная база shop smoke, перезапуск — три зелёных, race — два зелёных, итог пять из пяти. В конце stop containers: база выключена, следов не осталось. Теперь настоящая проверка бота — при каждом push. На следующем экране глубже посмотрим, откуда берётся DATABASE URL."
   ]
  }
 },
 "14": {
  "kicker": "Этап 4 · внутри",
  "title": "Пароль контейнера — не секрет, он открыт в env:. Настоящая база или токен бота — в Secrets: в логе звёздочки (маска). Ошибка в имени secret не даёт ошибки — значение пустое, smoke «DATABASE_URL topilmadi»",
  "seg": {
   "a": [
    "Пароль контейнера — <b>открыт в <code>env:</code>, и это правильно</b>: он живёт только внутри job и умирает вместе с ней",
    "На тринадцатом экране мы написали DATABASE URL в yml открыто, пароль postgres. Это правильно: контейнер рождается и умирает внутри job, снаружи к нему никто не подключится. Это не секрет. Оба AI сделали так же, увидите позже."
   ],
   "b": [
    "Настоящая база, токен бота — <b>GitHub Secrets</b>: пишутся в Settings, в yml <code>${{ secrets.NOM }}</code>, в логе <code>***</code>",
    "Но адрес настоящей базы или токен бота в yml не пишутся: репозиторий открыт, история вечна. Их пишут на GitHub в разделе settings репозитория, secrets and variables, actions. В yml только имя: secrets DATABASE URL. В логе значение выходит звёздочками, маской."
   ],
   "c": [
    "Сломано: <b><code>secrets.DATABSE_URL</code> — пропала одна буква</b>; ошибки нет, значение пустое — smoke «DATABASE_URL topilmadi»",
    "Буква выпала: secrets DATABSE URL. Push. GitHub ошибку не даёт: такого secret нет, значит значение пустое. Шаг smoke красный: SMOKE ОШИБКА, DATABASE URL не найден, код выхода два. Посмотрите в лог: пароль в адресе-примере из сообщения — звёздочки, runner сам скрыл пароль URL."
   ],
   "x": [
    "Теперь <b>ломаете вы</b>: нажмите на подсвеченное в <code>ci.yml</code> имя secret",
    "Теперь ломаем. Ломаете вы сами: в сорок первой строке ci yml подсвечен secrets DATABASE URL, нажмите на него: из имени выпадет одна буква.",
    "Нажмите на <b><code>secrets.DATABASE_URL</code></b> в 41-й строке <b>ci.yml</b> — из имени выпадет одна буква."
   ],
   "d": [
    "Итог: <b>env — контейнер, secrets — внешнее</b>; видите «topilmadi» — проверьте имя secret в yml",
    "Итог: для контейнера — env, для внешнего ресурса — secrets. Если имя secret неверное, GitHub молчит, приходит пустое значение, и программа падает. Если в логе видите «не найден» или undefined, сначала сравните имя secret в yml с тем, что в Settings. Теперь найдёте эту строку сами."
   ]
  }
 },
 "15": {
  "kicker": "Проверка 3",
  "eyebrow": "Проверка · 3 / 4 — какая строка с ошибкой?",
  "title": "С этим ci.yml job smoke красная: «DATABASE_URL topilmadi». Postgres поднялся, healthcheck прошёл. Найдите строку-виновника",
  "q": "Вы видели имя secret, теперь найдите сами. Третья проверка. С этим ci yml job smoke красная: DATABASE URL не найден. Postgres поднялся, healthcheck прошёл. Одна строка во фрагменте обращается к secret с неверным именем. Нажмите на эту строку.",
  "ok": "Верно. Secrets DATABSE URL: пропала буква E. GitHub такой secret не нашёл, но ошибку не дал, а дал пустое значение. Smoke запустился с пустым адресом и сам остановился: DATABASE URL не найден. На экране исправленная строка. Значит, ошибку, связанную с secret, сначала ищите в имени.",
  "okShort": "<code>DATABSE</code> — нет одной буквы; GitHub молчит, значение пустое, программа падает. Сравните имя с Settings.",
  "hint": "Прочитайте имя внутри ${{ secrets.… }} по буквам: DATABASE_URL полное?",
  "task": "Правило: в <code>${{ secrets.NOM }}</code> NOM должен совпадать с Settings буква в букву; нет такого имени — пустое значение, ошибки нет. В этом фрагменте одна строка обращается к неверному имени. <b>Нажмите на эту строку.</b>"
 },
 "16": {
  "kicker": "Этап 5 · PR и AI",
  "title": "Новая работа — в отдельной ветке; при открытии pull request конвейер снова запускается, и на странице PR стоит проверка; зелёный — merge; badge в README показывает состояние конвейера",
  "seg": {
   "a": [
    "Новая работа — <b>отдельная ветка <code>lenta-smoke</code></b>; push — run и в ветке (<code>on: push</code>)",
    "Job smoke добавляем в main не напрямую, а через pull request, так принято в команде. В терминале git checkout b lenta smoke, меняем ci yml, commit, git push u origin lenta smoke. В Actions run: on push относится к каждой ветке."
   ],
   "b": [
    "Pull request: <b><code>on: pull_request</code> — снова run</b>; на странице PR «checks»: <code>test</code> ✓, <code>smoke</code> ✓",
    "Открываем на GitHub pull request: из lenta smoke в main. Срабатывает on pull request из ci yml: ещё один run, на этот раз событие pull request. Внизу страницы PR checks: test зелёный, smoke зелёный. Кнопка merge открыта. Если бы был красный, он был бы виден здесь и в main не попал бы."
   ],
   "c": [
    "Merge — <b>в main merge commit, снова run</b>: обе job зелёные; теперь в main есть и smoke",
    "Нажимаем merge. В main появляется merge commit, on push, снова run: test и smoke зелёные. Теперь конвейер в main из двух job. И история понятна: видно, какой PR что добавил, — в этом отличие от прямого push в CI/CD-1."
   ],
   "d": [
    "Итог: <b>badge в README</b> — <code>actions/workflows/ci.yml/badge.svg</code>: кто открыл, видит конвейер",
    "Итог: ветка, pull request, checks, merge. И в первую строку README — badge: workflows ci yml badge svg. Любой, кто открыл репозиторий, сразу видит, зелёный конвейер или красный. В уроке ученика это называется табло. Теперь переходим к AI."
   ]
  }
 },
 "17": {
  "kicker": "Этап 5 · AI",
  "title": "Продолжение нового навыка: двум AI один промпт — «добавь и smoke, ему нужен PostgreSQL»; оба написали services: postgres и в конвейере зелёные с первой попытки",
  "seg": {
   "a": [
    "Снова этап AI: <b>промпт — «добавь и smoke, ему нужен PostgreSQL»</b>, слова services нет",
    "Как в CI/CD-1, последний этап — с AI. Промпт: в OrderBotNest есть npm run smoke, ему нужен PostgreSQL, DATABASE URL. Добавь в workflow и этот smoke. Services, контейнер, healthcheck, secret — этих слов в промпте нет. Каждый AI — в отдельной копии проекта, с существующим ci yml."
   ],
   "b": [
    "Оба написали <b><code>services: postgres:18</code>, healthcheck, <code>POSTGRES_DB: shop</code></b> — по версии из README",
    "Оба написали services postgres восемнадцать, по версии из README. Пароль, имя базы shop, порт и healthcheck pg is ready. Шаг smoke после build, в его env DATABASE URL. Первый дал env только шагу smoke, второй — всей job."
   ],
   "c": [
    "В конвейере: <b>оба зелёные с первой попытки</b> — <code>Initialize containers</code>, <code>NATIJA: 5/5 ✓</code>",
    "Оба мы отправили push в тестовую ветку. Оба зелёные: initialize containers, Postgres поднят, npm run smoke, итог пять из пяти. В отличие от CI/CD-1, на этот раз AI сделал правильно с первой попытки. Почему так, сейчас увидим."
   ],
   "d": [
    "Итог: AI <b>не использовал secret — и это верно</b> («контейнер — не секрет»); зелёный, но проверка ещё впереди",
    "Итог: оба AI не использовали secret, и первый написал причину: пароль контейнера только внутри job, это не секрет. Верная мысль. Оба зелёные. Но зелёный — ещё не приём: на следующем экране прочитаем по четырём вопросам."
   ]
  }
 },
 "18": {
  "kicker": "Этап 5 · внутри",
  "title": "Почему на этот раз зелёный: AI не писал файл с нуля, а изменил ваш ci.yml (node 24) — правильная опора, и AI тоже правильный; приём — четыре вопроса",
  "seg": {
   "a": [
    "Разница: в CI/CD-1 AI <b>писал с нуля</b> (node 22 → красный); на этот раз <b>изменил ваш файл</b> (24 → зелёный)",
    "В CI/CD-1 AI написал workflow с нуля и поставил node двадцать два — красный. На этот раз в репозитории был ваш ci yml, с node двадцать четыре. AI его изменил, а не писал с нуля. Если опора правильная, AI тоже продолжает правильно. Поэтому сначала пишите сами, потом давайте AI."
   ],
   "b": [
    "Две разницы: <b>где <code>env</code></b> — 1-й AI только в шаге smoke (уже, лучше), 2-й AI на всю job; smoke не отдельная job",
    "Сравните оба. Первый AI дал DATABASE URL только шагу smoke, второй — всей job: работают оба, но чем уже, тем лучше. Оба сделали smoke не отдельной job, а последним шагом: работает, но Postgres поднимается, даже если test красный. В рекомендации — отдельная job с needs test."
   ],
   "c": [
    "1-й AI сам заметил: <b>внутри smoke снова <code>nest build</code> — build дважды</b>; читайте пояснения AI",
    "Первый AI сам сказал ещё одну вещь: внутри smoke снова есть nest build, build идёт дважды, несколько лишних секунд. Решаете вы: оставить шаг npm run build или убрать. Читайте пояснения AI, часто самое полезное — именно там."
   ],
   "d": [
    "Итог: workflow smoke от AI — <b>четыре вопроса</b>: services + healthcheck · доходит ли <code>DATABASE_URL</code> · порядок · нужен ли secret",
    "Итог, четыре вопроса. Есть ли services и healthcheck. Доходит ли DATABASE URL до шага smoke, где env. Порядок: smoke после build? Нужен ли secret: для контейнера нет, для внешней базы да. Если на все четыре есть ответ — push и run. Теперь проверим."
   ]
  }
 },
 "19": {
  "kicker": "Проверка 4",
  "eyebrow": "Проверка · 4 / 4",
  "title": "AI написал services: postgres и оставил DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop в yml открыто. Это ошибка?",
  "q": "Вы видели workflow от AI, теперь проверим. Четвёртая проверка. AI написал services postgres и оставил DATABASE URL, с паролем postgres, открытым в yml. Это ошибка? Выберите вариант.",
  "ok": "Верно. Этот контейнер открывается вместе с job и выключается вместе с job, снаружи к нему никто не подключится, пароль ничего не открывает. Secret — для внешнего ресурса: настоящая база, токен бота. Значит, спрашивая, нужен ли secret, спросите: что это значение открывает за пределами job?",
  "okShort": "Контейнер — внутри job, выключается с job → хватит <code>env</code>. Внешний ресурс → Secrets.",
  "hint": "Экран 14: env — контейнер, secrets — внешнее. Есть ли этот контейнер вне job?",
  "demak": "вопрос о secret: что это значение открывает вне job? Контейнер — ничего → <code>env</code>. Боевая база, токен → Secrets.",
  "opts": [
   "Ошибка — любой пароль, даже временный, обязан быть в Secrets",
   "Ошибка — GitHub, увидев открытый пароль, остановит run",
   "Не ошибка — контейнер живёт внутри job, пароль наружу не выходит",
   "Не ошибка — адреса localhost никогда не бывают секретом"
  ],
  "wrong": {
   "0": "Secrets — для внешнего ресурса; пароль контейнера умирает вместе с job.",
   "1": "GitHub не проверяет текст в yml — run зелёный (40, 41).",
   "3": "localhost тоже может быть секретом (например, настоящая база на self-hosted runner) — дело не в адресе, а в том, что открывает значение."
  }
 },
 "20": {
  "kicker": "Практика 3 / 3",
  "eyebrow": "Сейчас у себя · 25 минут",
  "title": "Поручите своему AI написать job smoke, проверьте по четырём вопросам, откройте PR в отдельной ветке, после зелёного сделайте merge, badge в README",
  "seg": {
   "a": [
    "Теперь вы: <b>job smoke от AI</b> — ветка, PR, merge, badge",
    "Теперь ваша очередь. Поручаете своему AI написать job smoke, промпт копируете кнопкой ниже. Делаете push в отдельную ветку и открываете pull request, после зелёной проверки merge, badge в README. Займёт двадцать пять минут."
   ],
   "b": [
    "Шаги 1–2: <b>ветка и промпт</b>, потом четыре вопроса: services + healthcheck · env · порядок · secret",
    "На первом шаге открываете новую ветку: git checkout b lenta smoke. На втором даёте промпт AI и читаете файл по четырём вопросам: есть ли services и healthcheck, доходит ли DATABASE URL до шага smoke, smoke после build, верно ли, что secret не нужен."
   ],
   "c": [
    "Шаги 3–4: <b>push, PR, checks зелёные, merge</b>, badge в README; подтверждение — адрес PR",
    "На третьем шаге push и pull request на GitHub: когда в checks test и smoke зелёные — merge. На четвёртом ставите badge в первую строку README и делаете push в main: значок passing. В поле подтверждения скопируйте адрес PR, по которому сделан merge."
   ],
   "d": [
    "Если вышло иначе, нажмите кнопку <b>«Вышло иначе?»</b> — откроется окно с решениями",
    "Если вышло иначе, нажмите кнопку «Вышло иначе?». Пока не отмечены все четыре пункта и нет подтверждения, «Далее» не откроется. Значит, после этой практики в вашем конвейере есть настоящая проверка бота, и она пришла через pull request."
   ]
  },
  "steps": [
   {
    "t": "Ветка",
    "exp": "новая ветка"
   },
   {
    "t": "Промпт + четыре вопроса",
    "exp": "4 ✓",
    "cmds": [
     "промпт выше — своему AI",
     null,
     "env: DATABASE_URL в шаге smoke",
     "smoke после build / needs: test",
     "secret нет (контейнер)"
    ]
   },
   {
    "t": "PR и merge",
    "exp": "PR merged · main run ✓ (2 job)"
   },
   {
    "t": "Badge",
    "exp": "в README «CI passing»",
    "cmds": [
     null,
     "1-я строка README: ![CI](https://github.com/<ваш-логин>/OrderBotNest/actions/workflows/ci.yml/badge.svg)",
     null
    ]
   }
  ],
  "proof": {
   "label": "Адрес PR, по которому сделан merge",
   "placeholder": "например: https://github.com/вы/OrderBotNest/pull/1",
   "wrong": "Вставьте адрес страницы PR: …/pull/<номер>."
  },
  "trouble": [
   [
    "smoke красный: DATABASE_URL topilmadi",
    "env: не дошёл до шага smoke (в другом шаге или нет в job) или неверное имя secret (экраны 14–15)"
   ],
   [
    "smoke красный: ECONNREFUSED 127.0.0.1:5432",
    "нет services, или нет ports: 5432:5432, или нет healthcheck (начал, пока база не готова)"
   ],
   [
    "smoke красный: database \"shop\" does not exist",
    "нет POSTGRES_DB: shop — smoke подключается к shop и открывает shop_smoke"
   ],
   [
    "В PR не видно checks",
    "в on: нет pull_request — on: [push, pull_request]"
   ],
   [
    "Badge «no status»",
    "в адресе неверное имя файла workflow — ровно ci.yml; или в main ещё нет run"
   ]
  ]
 },
 "21": {
  "kicker": "Этап 6 · подготовка к классу",
  "eyebrow": "m4c-03 · «GitHub Actions — yo'l xaritasini yozish»",
  "title": "Урок ученика: маршрут, точка, действие, параллельные ленты, ближняя полка, сейф, табло — рисованные имена того, что вы сегодня видели в настоящем run",
  "seg": {
   "a": [
    "m4c-03 — 23 экрана: <b>маршрут, точка, действие</b>; matrix, сейф, табло — в симуляции",
    "Теперь подготовка к классу. Урок ученика m4c-03, двадцать три экрана. Маршрут — это ci yml, точка — job, действие — step. Параллельные ленты — matrix, сейф — secrets, табло — badge. Всё это нарисованная на экране симуляция: нажимается кнопка, лента идёт, всё зелёное."
   ],
   "b": [
    "Словарь: <b>слово ученика → термин</b>; в классе говорите оба вместе",
    "Посмотрите на словарь: слово ученика слева, термин справа. Журнал — это лог шага, ближняя полка — cache, сейф — secrets. В классе говорите слово вместе с термином: параллельные ленты, то есть matrix. Когда ученик потом откроет GitHub, слова будут знакомы."
   ],
   "c": [
    "Симуляция ↔ настоящее: <b>в уроке ученика всё зелёное</b>, в настоящем Actions 22 красный, cancelled, <code>***</code>",
    "Знайте разницу. В уроке ученика matrix зелёный на всех трёх лентах, сейф просто скрыт, в журнале причина одной строкой. В настоящем Actions двадцать два красный, двадцать четыре cancelled, при неверном имени secret молчит, причина внутри лога. Вы это сегодня видели, ученик — нет."
   ],
   "d": [
    "Итог: <b>симуляция даёт понятие, настоящий run — опыт</b>; в классе откройте один на экране",
    "Итог: симуляция даёт понятие, настоящий run — опыт. В классе откройте на проекторе один run из своего репозитория: job, шаг, лог, cache hit. Пусть ученик увидит, что маршрут и настоящий Actions — одно и то же. На следующем экране ловушки в классе."
   ]
  }
 },
 "22": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Образец «Нет репозитория?» из урока ученика: нет lock-файла — npm ci красный; \"test\": \"echo ok && exit 0\" — никогда не бывает красным; «сломайте тест» из домашнего задания здесь застревает",
  "seg": {
   "a": [
    "Образец: <b><code>npm install</code>, тест <code>echo ok</code>, lock нет</b> — с ним ученик пишет свой первый конвейер",
    "В уроке ученика для ученика без репозитория есть образец: в package json test — echo ok, lock-файла нет, конвейер — npm install и npm test. Он работает: npm install ставит, test говорит ok, зелёный. Но есть две ловушки."
   ],
   "b": [
    "Ловушка 1: если ученик нажмёт готовый шаблон GitHub — <b><code>npm ci</code>, lock нет — красный</b>",
    "Первая ловушка: если ученик нажмёт в Actions готовый шаблон Node от GitHub, тот пишет npm ci. Lock-файла нет, npm ci падает: can only install with an existing package lock json. Сообщение с тринадцатого экрана CI/CD-1, с другой причиной. Решение: npm install, или один раз npm install локально и lock в commit."
   ],
   "c": [
    "Ловушка 2: <b><code>echo ok &amp;&amp; exit 0</code> никогда не бывает красным</b> — «сломайте тест» из домашнего задания невозможно",
    "Вторая ловушка: test — echo ok и exit ноль, он никогда не бывает красным. В домашнем задании сказано нарочно сломать тест, а в образце его не сломать. Решение: пусть ученик делает это в своём Jest-проекте, или покажите скрипт с echo ошибка и exit один: красный, потом верните."
   ],
   "d": [
    "Итог: образец <b>хорош для начала, не для поломки</b>; <code>@v4</code> работает, предупреждение — не ошибка",
    "Итог: образец хорош для начала, не для поломки. И checkout v четыре из урока ученика работает и сейчас, в логе выходит предупреждение Node двадцать deprecated, это не ошибка. На последнем экране — что вы добавляете и вопросы учеников."
   ]
  }
 },
 "23": {
  "kicker": "Этап 6 · подготовка к классу",
  "title": "Четыре вещи, которые вы добавляете к уроку, три ситуации и готовые ответы на вопросы учеников",
  "seg": {
   "a": [
    "Вы добавляете: <b>настоящий run на проекторе, настоящий результат matrix, имя secret, ловушки образца</b>",
    "Четыре вещи, которые вы добавляете к уроку. На экране «найти причину в журнале» откройте на проекторе настоящий run. На параллельных лентах скажите: на самом деле одна версия может быть красной. На сейфе: при неверном имени молчит. В домашнем задании заранее скажите о ловушках образца."
   ],
   "b": [
    "Три ситуации: <b>нет lock, cancelled, «сломал, а всё зелёное»</b> — сообщение и решение",
    "Три ситуации. Npm ci красный, нет lock: npm install или lock в commit. В matrix cancelled: ошибка в другой job, fail fast. Сломал тест, а всё равно зелёный: echo ok не ломается, exit один или Jest-проект. Сообщение каждой — на карточке."
   ],
   "c": [
    "Если ученик спросит: <b>где журнал, обязательно ли matrix зелёный, можно ли увидеть сейф, badge красный</b>",
    "Готовые ответы на вопросы учеников внизу, нажмите, чтобы открыть: где журнал, обязательно ли в matrix всё зелёное, можно ли увидеть ключ в сейфе, что если badge красный. На каждый — ответ одним предложением."
   ],
   "d": [
    "Итог: если ученик говорит «конвейер красный» — <b>job → шаг → лог</b>; с этим вы готовы к классу",
    "Итог: если ученик говорит, что конвейер красный, вместе с ним три шага: какая job, какой шаг, его лог. С этим вы готовы к классу. Теперь проверьте себя."
   ]
  }
 },
 "24": {
  "kicker": "Самопроверка",
  "title": "Восемь вопросов. Одна попытка. Шесть — вы прошли",
  "final": [
   {
    "q": "В ci.yml под jobs: есть test: и smoke:. Сколько машин откроется в run?",
    "e": "Каждая job — своя машина; needs задаёт порядок.",
    "o": [
     "Одна — job по очереди на одной машине",
     "Две — каждая job на отдельной машине",
     "Сколько шагов, столько и машин",
     "Три — GitHub берёт отдельную машину для Set up job"
    ]
   },
   {
    "q": "В логе Run actions/checkout@v4 есть git fetch … --depth=1. Что это?",
    "e": "Runner не нужна вся история.",
    "o": [
     "Скачивает всю историю — сжатую для скорости",
     "Скачивается только последний commit — без истории, быстро",
     "Скачивает только изменённые файлы",
     "Останавливает, если не уложилось в минуту"
    ]
   },
   {
    "q": "Run красный, аннотация: Process completed with exit code 1. — в npm test. Где полная причина?",
    "e": "Аннотация — адрес, причина — лог.",
    "o": [
     "В самой аннотации — больше нигде нет",
     "В логе Set up job — ошибки собираются туда",
     "В логе шага npm test — FAIL и имя теста",
     "На странице commit — GitHub пишет ошибку туда"
    ]
   },
   {
    "q": "Во втором run в логе setup-node Cache hit for: node-cache-…. Что делает npm ci?",
    "e": "Cache — скорость, а не правильность.",
    "o": [
     "Не ставит пакеты — просто использует cache",
     "Ставит из сохранённых загрузок — быстрее, результат тот же",
     "Заменяет lock-файл старой копией из cache",
     "Скачивает только изменённые пакеты"
    ]
   },
   {
    "q": "matrix [22, 24], fail-fast не написан; 22 упал. 24?",
    "e": "По умолчанию fail-fast: true.",
    "o": [
     "Дойдёт до конца — результат виден отдельно",
     "Будет отменён — «cancelled», результат неизвестен",
     "Начнётся заново — вместо 22",
     "Дойдёт до конца, но run всё равно отмечен зелёным"
    ]
   },
   {
    "q": "Smoke нужен Postgres. Откуда база в конвейере?",
    "e": "Контейнер рождается и умирает вместе с job.",
    "o": [
     "На runner установлен Postgres — ничего писать не нужно",
     "Подключается к базе на сервере ментора — адрес в Secrets",
     "services: postgres — временный контейнер рядом с job",
     "Smoke переходит в режим без базы — результат зелёный"
    ]
   },
   {
    "q": "В yml ${{ secrets.DATABSE_URL }} (пропала буква). Run?",
    "e": "«DATABASE_URL topilmadi» — код 2.",
    "o": [
     "Ошибка файла — run не откроется",
     "Аннотация: «secret not found» — шаг сразу красный, лог пустой",
     "Приходит пустое значение — программа падает сама, GitHub молчит",
     "Run зелёный — smoke проходит с пустым значением"
    ]
   },
   {
    "q": "Открыт PR, в checks smoke красный. Что будет?",
    "e": "Checks показывают; запрет — через branch protection.",
    "o": [
     "Кнопка merge совсем пропадёт — GitHub запрещает merge с красным check",
     "PR сам закроется — придётся открыть заново",
     "Виден красный — не делать merge решаете вы (защита не настроена)",
     "Конвейер в main тоже станет красным"
    ]
   }
  ]
 },
 "25": {
  "kicker": "Итог",
  "title": "Теперь вы знаете"
 }
};
// RS(k) — darsga xos ruscha (RU_S.k, ru/<dars>-sahna.js); yo'q bo'lsa null → t() o'zbekchani qoldiradi. wrRu — ovoz → «Matn» (RU_S.SPOKEN, keyin wr).
function RS(k) { return typeof RU_S !== 'undefined' && RU_S[k] != null ? RU_S[k] : null; }
function wrRu(s) { return wr((RS('SPOKEN') || []).reduce((a, [x, y]) => a.split(x).join(y), s)); }
function rsY(key, text) { return { key, text, show: wrRu(text) }; }
// Yakun segmentlari (ru-umumiy.py: sNNSegments → yakRu): umumiy a/z + RU_S.YAK (id bo'yicha)
function yakRu(passed, segs) {
  if (LANG !== 'ru') return segs;
  const Y = { a_pass: rsY('<b>Отлично!</b> Вы хорошо прошли урок — соберём сегодняшний урок одним взглядом', 'Отлично! Вы хорошо прошли урок. Теперь соберём всё, что узнали сегодня, одним взглядом.'), a_fail: rsY('Вы дошли до конца урока — советую <b>пройти тест заново</b>', 'Вы дошли до конца урока. В итоговом тесте нужно было шесть баллов, перед завершением советую пройти тест заново. А сейчас соберём сегодняшний урок одним взглядом.'), z: rsY('Спасибо! Нажмите кнопку <b>«Завершить урок»</b>', 'Спасибо. Нажмите кнопку «Завершить урок», урок будет отмечен как пройденный.'), ...Object.fromEntries(Object.entries(RS('YAK') || {}).map(([k, [key, text]]) => [k, rsY(key, text)])) };
  return segs.map((s) => ({ ...s, ...(Y[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) }));
}
(function ruMdtQo() {
  const segRu = (n) => { const r = RU_MDT[n] && RU_MDT[n].seg; if (!r) return undefined; const o = {}; Object.keys(r).forEach((id) => { const [key, text, act] = r[id]; o[id] = { ...(key != null ? { key } : {}), ...(text != null ? { text, show: wrRu(text) } : {}), ...(act != null ? { act } : {}) }; }); return o; };
  const head = (n) => { const r = RU_MDT[n] || {}; const o = {}; ['kicker', 'eyebrow', 'title'].forEach((k) => { if (r[k] != null) o[k] = r[k]; }); const s = segRu(n); if (s) o.segments = s; return o; };
  const mdt = {}; Object.keys(RU_MDT).forEach((n) => { const r = { ...RU_MDT[n] }; if (r.seg) r.seg = MDT[n].seg.map(([id]) => (r.seg[id] ? [null, r.seg[id][0], r.seg[id][1], r.seg[id][2]] : null)); mdt[n] = r; });
  ru(MDT, mdt);
  ru(S1, { ...head(1), ...((typeof RU_S !== 'undefined' && RU_S.S1) || {}) });
  ru(S2, { ...head(2), ...((typeof RU_S !== 'undefined' && RU_S.S2) || {}) });
  ru(S3, { ...head(3), ...((typeof RU_S !== 'undefined' && RU_S.S3) || {}) });
  ru(S4, { ...head(4), ...((typeof RU_S !== 'undefined' && RU_S.S4) || {}) });
  ru(S6, { ...head(6), ...((typeof RU_S !== 'undefined' && RU_S.S6) || {}) });
  ru(S8, { ...head(8), ...((typeof RU_S !== 'undefined' && RU_S.S8) || {}) });
  ru(S9, { ...head(9), ...((typeof RU_S !== 'undefined' && RU_S.S9) || {}) });
  ru(S12, { ...head(12), ...((typeof RU_S !== 'undefined' && RU_S.S12) || {}) });
  ru(S13, { ...head(13), ...((typeof RU_S !== 'undefined' && RU_S.S13) || {}) });
  ru(S14, { ...head(14), ...((typeof RU_S !== 'undefined' && RU_S.S14) || {}) });
  ru(S16, { ...head(16), ...((typeof RU_S !== 'undefined' && RU_S.S16) || {}) });
  ru(S17, { ...head(17), ...((typeof RU_S !== 'undefined' && RU_S.S17) || {}) });
  ru(S18, { ...head(18), ...((typeof RU_S !== 'undefined' && RU_S.S18) || {}) });
  ru(S21, { ...head(21), ...((typeof RU_S !== 'undefined' && RU_S.S21) || {}) });
  ru(S22, { ...head(22), ...((typeof RU_S !== 'undefined' && RU_S.S22) || {}) });
  ru(S23, { ...head(23), ...((typeof RU_S !== 'undefined' && RU_S.S23) || {}) });
  ru(P7.S, { ...head(7), ...((typeof RU_S !== 'undefined' && RU_S.P7_S) || {}) });
  ru(P7.steps, RU_MDT[7].steps);
  ru(P7.trouble, RU_MDT[7].trouble);
  ru(P7.proof, RU_MDT[7].proof);
  ru(P11.S, { ...head(11), ...((typeof RU_S !== 'undefined' && RU_S.P11_S) || {}) });
  ru(P11.steps, RU_MDT[11].steps);
  ru(P11.trouble, RU_MDT[11].trouble);
  ru(P11.proof, RU_MDT[11].proof);
  ru(P20.S, { ...head(20), ...((typeof RU_S !== 'undefined' && RU_S.P20_S) || {}) });
  ru(P20.steps, RU_MDT[20].steps);
  ru(P20.trouble, RU_MDT[20].trouble);
  ru(P20.proof, RU_MDT[20].proof);
  ru(FINAL, RU_MDT[24].final);
})();
