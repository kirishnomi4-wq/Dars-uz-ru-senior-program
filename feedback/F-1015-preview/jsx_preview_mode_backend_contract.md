# Контракт изолированного preview для JSX/Dars-platforma

Версия: 1.0  
Дата: 2026-10-05  
Владельцы интеграции: Coddy Camp CRM/LMS и команда JSX/Dars-platforma

## 1. Цель и обязательный инвариант

Учитель может полностью пройти JSX-урок из `Bilimlar bazasi` до занятия. Его ответы,
экран, завершение и backend-сессия не должны быть видны ученикам и не должны менять
live/solo-сессии, результаты или LMS-прогресс.

Query-параметр является только сигналом контекста. Гарантию изоляции обеспечивает
backend Dars-platforma: preview хранится и ищется отдельно от всех учебных сессий.

В этом документе **MUST / ОБЯЗАН** и **MUST NOT / НЕ ДОЛЖЕН** — требования,
блокирующие приёмку.

## 2. Сквозной интерфейс

### 2.1 CRM → LMS Preview

Ссылка из `Bilimlar bazasi`:

```text
https://lms.coddycamp.uz/preview?jsx=<encoded-jsx-url>&visit_mode=preview
```

`visit_mode=preview` ограничивает возможности. Он не является авторизацией и не
может разрешить live/solo-действия.

### 2.2 LMS Preview → динамический JSX-компонент

LMS передаёт два новых необязательных prop:

```jsx
<Lesson
  visitMode="preview"
  previewRunId="7be2c261-5db1-4fb6-9265-b9da22e077e6"
  liveToken={null}
  onFinished={() => {}}
/>
```

Правила:

- `visitMode` равен точной строке `preview`.
- `previewRunId` создаётся заново на каждое открытие страницы и F5, но не меняется
  при React re-render или сетевом retry внутри открытой страницы.
- Допустимый формат: `[A-Za-z0-9_-]{16,128}`.
- В preview LMS не запрашивает mentor JWT и всегда передаёт `liveToken=null`.
- Если JSX не использует backend-сессии, он может игнорировать props. Любой JSX,
  который читает или пишет состояние Dars-platforma, обязан их поддержать.

### 2.3 JSX → backend Dars-platforma

Для preview JSX вызывает существующую операцию создания/входа в сессию со следующим
телом. Физический URL остаётся существующим URL этой операции на Dars-platforma.

```json
{
  "lesson_id": "js-conditions",
  "mode": "preview",
  "preview_run_id": "7be2c261-5db1-4fb6-9265-b9da22e077e6"
}
```

Запрос preview:

- не содержит `Authorization`, JWT, PIN, `group_id`, `teacher_id` или `student_id`;
- может содержать только существующие данные конкретного урока, не меняющие identity;
- должен повторяться с тем же `preview_run_id` при retry.

Успешный ответ расширяет существующий session-response следующими обязательными
полями. Остальные существующие поля можно сохранить без переименования.

```json
{
  "session_id": "preview_01J9YJ8H1JWZ7A7N4D2E0Q1M6E",
  "mode": "preview",
  "preview_run_id": "7be2c261-5db1-4fb6-9265-b9da22e077e6",
  "expires_at": "2026-10-06T09:00:00Z"
}
```

- Первая успешная инициализация может вернуть `201`, повтор того же запуска — `200`.
- Повтор `lesson_id + preview_run_id` обязан вернуть ту же preview-сессию.
- Другой `preview_run_id` обязан создать независимую сессию с чистым состоянием.

## 3. Backend-инварианты

### 3.1 Создание и восстановление

Backend обязан:

- хранить явный тип/namespace `preview`;
- искать preview только по `lesson_id + preview_run_id`;
- игнорировать пользовательские cookies и защищённую live-session при выборе preview;
- не восстанавливать preview по одному `lesson_id`, `role + sub`, группе, учителю,
  ученику, PIN или последней активной сессии;
- атомарно обеспечивать идемпотентность одинакового `preview_run_id`;
- удалять preview-состояние не позднее 24 часов после последней активности.

Внутренняя таблица и имя индекса остаются деталями Dars-platforma, но уникальность
`lesson_id + preview_run_id` и фильтр `session_type=preview` должны обеспечиваться
backend/БД, а не только frontend-проверкой.

### 3.2 Полная изоляция

Preview-сессия не должна:

- иметь `group_id`, `teacher_id`, `student_id` или участника с ролью student/mentor;
- попадать в выборку активных live-сессий по уроку или группе;
- быть доступной через student/mentor JWT, PIN или публичный список комнат;
- читать начальное состояние из live/solo-сессии того же урока;
- писать ответы, экран, completion или достижения в live/solo-сессию;
- создавать результат `mode=live` или `mode=solo`;
- вызывать School API `POST /api/v1/integrations/dars-platform/lesson-results`;
- влиять на рейтинг, статистику группы, посещаемость, coins или LMS lesson access.

Локальное состояние JSX также нельзя хранить под стабильным ключом одного
`lesson_id`. Если browser storage необходим, ключ обязан включать
`preview_run_id`, использовать `sessionStorage` и очищаться при завершении/закрытии.

### 3.3 Сравнение режимов

| Свойство | Preview | Live | Solo/student |
|---|---|---|---|
| Identity | Нет | Проверенный mentor/student JWT | Проверенный student JWT |
| Ключ восстановления | `lesson_id + preview_run_id` | Защищённая session + verified identity/group | Verified student identity |
| Видимость ученикам | Никогда | Только разрешённой группе | Только самому ученику |
| Результат в School API | Никогда | `mode=live` | `mode=solo` |
| Срок хранения | До 24 часов | Текущие правила продукта | Текущие правила продукта |

Live и solo остаются без изменений. Значение `mode=preview` нельзя преобразовывать
в другой режим даже при наличии старой cookie или активной комнаты того же урока.

## 4. Ошибки и fail-closed

| HTTP | `error` | Когда |
|---:|---|---|
| 404 | `lesson_not_found` | Урок отсутствует в серверном каталоге |
| 422 | `invalid_preview_run_id` | ID отсутствует или не соответствует формату |
| 422 | `invalid_preview_context` | Переданы JWT/identity/group/PIN-поля |
| 429 | `preview_rate_limited` | Сработал действующий публичный rate limit |
| 503 | `preview_unavailable` | Изолированную preview-сессию невозможно создать/прочитать |

При любой ошибке клиент показывает безопасную ошибку. Он не должен входить в
live/solo, открывать PIN-flow или повторять запрос без `mode=preview`.

Логи могут содержать request ID, `lesson_id`, `session_id`, режим и код результата.
JWT, Authorization, cookies, имя и персональные данные в лог не пишутся.

## 5. Совместимость и порядок релиза

1. Backend Dars-platforma реализует preview-ветку и contract-тесты.
2. Общий JSX-клиент принимает props и отправляет preview-context backend'у.
3. Coddy Camp LMS передаёт props и делает `/preview` безопасным по умолчанию.
4. CRM добавляет явный `visit_mode=preview` в `Bilimlar bazasi`.
5. Команды выполняют совместный E2E на тестовом уроке и только затем выкатывают prod.

Старые статические JSX продолжают работать. Stateful JSX считается совместимым
только после перехода на этот контракт. Временный fallback в общую live-сессию
запрещён: при несовместимом backend preview должен завершаться безопасной ошибкой.

## 6. Обязательные contract-тесты JSX/backend

1. Первый preview-запрос создаёт `session_type=preview` и не содержит identity.
2. Retry с тем же `lesson_id + preview_run_id` возвращает ту же сессию.
3. Другой `preview_run_id` получает чистую независимую сессию.
4. Старая live-cookie не меняет тип и не подмешивает live-состояние.
5. Завершение preview не создаёт live/solo result и не вызывает School API.
6. Student JWT того же урока не находит и не может открыть preview-сессию.
7. Две группы, одновременно проводящие тот же урок, не затронуты preview.
8. Неверный ID и identity-поля возвращают `422` без создания сессии.
9. Ошибка хранилища возвращает `503 preview_unavailable` без fallback.
10. По истечении TTL preview удаляется и не участвует ни в одной учебной выборке.

Backend PR принимается только вместе с автоматическими тестами пунктов 1–9 и
подтверждением фоновой очистки для пункта 10.
