# User story: безопасный просмотр JSX перед уроком

Дата: 2026-10-05  
Связанный технический контракт: [jsx_preview_mode_backend_contract.md](jsx_preview_mode_backend_contract.md)

## User story

Как учитель, я хочу полностью просмотреть и пройти JSX-урок из `Bilimlar bazasi`
перед занятием, чтобы подготовиться, не меняя состояние урока, доступность или
результаты учеников.

## Границы задачи

В задачу входят:

- JSX-ссылки из `Bilimlar bazasi`;
- безопасный режим страницы LMS `/preview`;
- передача preview-контекста динамическому JSX;
- изоляция browser/backend-состояния Dars-platforma;
- регрессия mentor live-flow из Davomat и student-flow из LMS.

Не входят:

- изменение правил открытия LMS-уроков;
- новый тип School API result;
- изменение mentor/student JWT;
- сохранение персонального прогресса учителя между открытиями preview.

## Acceptance criteria

### AC-01. Свободное прохождение учителем

**Given** учитель открыл JSX из `Bilimlar bazasi`  
**When** он ответил на вопросы и дошёл до финального экрана  
**Then** preview работает до конца, но не создаёт учебный результат.

### AC-02. Ученик начинает с нуля

**Given** учитель полностью прошёл preview  
**When** ученик открывает тот же JSX через свой LMS  
**Then** ученик видит начальный экран без ответов, достижений и completion учителя.

### AC-03. Изоляция параллельных preview

**Given** один JSX открыт в двух вкладках или двумя сотрудниками  
**When** в первом preview меняется экран или ответ  
**Then** второй preview не изменяется.

### AC-04. Предсказуемое обновление страницы

**Given** preview открыт в одной вкладке  
**When** запрос повторяется из-за сети  
**Then** используется та же preview-сессия; при F5 создаётся новый чистый запуск.

### AC-05. Нет влияния на live

**Given** по тому же уроку уже идёт live-занятие группы  
**When** учитель открывает JSX из `Bilimlar bazasi`  
**Then** preview не входит в live-комнату и не меняет её вопросы, участников или результаты.

### AC-06. Нет LMS side effects

**Given** учитель завершил preview  
**When** проверяются прогресс и доступы тестового ученика  
**Then** у ученика не появился completion, новая попытка или новый открытый урок.

### AC-07. Fail-closed

**Given** JSX backend не может создать изолированную preview-сессию  
**When** учитель открывает материал  
**Then** показывается безопасная ошибка; live, solo и PIN-flow не запускаются.

### AC-08. Mentor live-flow не сломан

**Given** назначенный учитель/TA открывает JSX из Davomat  
**When** CRM передаёт mentor JWT  
**Then** создаётся или восстанавливается live-сессия его группы по текущим правилам.

### AC-09. Student-flow не сломан

**Given** авторизованный ученик проходит JSX через LMS  
**When** JSX вызывает `onFinished`  
**Then** попытка и завершение сохраняются текущим student-flow.

### AC-10. Совместимость уроков

**Given** старый статический JSX не использует backend-состояние  
**When** он открыт в preview  
**Then** он продолжает отображаться; любой stateful JSX обновлён до preview-контракта
до production-релиза.

## Definition of Done

- CRM формирует JSX-ссылку с `visit_mode=preview` только в `Bilimlar bazasi`.
- LMS передаёт `visitMode`, `previewRunId` и `liveToken=null` для preview.
- JSX/backend выполняет все MUST из технического контракта.
- Backend PR содержит contract-тесты и подтверждение, что preview не отправляет results.
- Пройдены автоматические тесты CRM/LMS/backend и совместный E2E AC-01–AC-09.
- QA приложил видео или скриншоты: финал preview учителя и чистый старт ученика.
- Релиз выполнен в порядке backend → JSX client → LMS → CRM.
- Production smoke-test выполнен только на тестовой группе и тестовом ученике.

## Review-чеклист одного цикла

- [ ] В коде нет поиска preview только по `lesson_id`.
- [ ] Preview не использует live cookie, JWT, группу, PIN или identity.
- [ ] `preview_run_id` одинаков на retry и новый после F5.
- [ ] Preview-сессии исключены из student/live query явным условием типа.
- [ ] Завершение preview не ставит result в очередь School API.
- [ ] Ошибка preview не содержит fallback в live/solo/PIN.
- [ ] Davomat и student LMS покрыты regression-тестами.
- [ ] В логах нет токенов и персональных payload.
- [ ] Каждый acceptance criterion имеет тест или приложенное E2E-доказательство.
