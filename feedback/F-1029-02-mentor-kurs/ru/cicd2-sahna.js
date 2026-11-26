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
RU_S.COVER = ['Всего около 1 часа 15–30 минут: озвучка ~25 минут · три практики 50–65 минут · 5 проверок · самопроверка 8 вопросов. После экрана 11 можно сделать перерыв', 'Нужно: урок для менторов CI/CD-1 (в вашем репозитории на GitHub ci.yml и зелёный run) · Node.js 20+ · VS Code · AI-помощник. База и токен бота не нужны — Postgres поднимается в конвейере контейнером', 'Проект: github.com/Azizbekcrypto/OrderBotNest — начинаете с тега cicd2-start (= cicd1-done); каждый run — из настоящего GitHub Actions'];
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
