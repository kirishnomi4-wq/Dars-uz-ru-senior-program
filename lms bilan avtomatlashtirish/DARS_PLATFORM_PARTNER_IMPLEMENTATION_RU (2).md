# Инструкция для Dars-platforma: вход в живой урок и передача результатов

Версия: 1.2  
Дата: 2026-09-03  
Production School API: `https://school-api.coddycamp.uz`  
Машиночитаемый контракт: [dars-platform-openapi.yaml](dars-platform-openapi.yaml)

## 1. Цель интеграции

Интеграция решает две независимые задачи:

1. Основной учитель или назначенный TA открывает динамический JSX-урок из карточки своей группы без повторного ввода кода и имени.
2. Ученик, уже авторизованный в Coddy Camp LMS, входит в Dars-platforma без повторного ввода имени.
3. После урока backend Dars-platforma отправляет в School API результаты учеников для аналитики.

Постоянные API-токены используются только между backend-серверами. В браузер передаётся только короткоживущий JWT `liveToken`.

## 2. Общая схема

```text
Учитель/TA в CRM или ученик в LMS
        |
        | открывает JSX-урок
        v
Backend Coddy Camp LMS
        |
        | sapi-токен с live_tokens.issue
        v
School API ---- проверяет актуальные school DB данные
        |
        | короткоживущий JWT liveToken
        v
LMS frontend -> JSX-компонент -> backend Dars-platforma
                                      |
                                      | проверка JWT и создание/поиск сессии
                                      v
                                Живой урок
                                      |
                                      | sapi-токен результатов
                                      v
                                  School API
```

## 3. Какие значения Coddy Camp передаёт партнёру

Секреты передаются отдельно от документа, только через защищённый канал. Их нельзя отправлять в Git, задачу, обычное сообщение, frontend-код или лог.

### 3.1 Обязательные значения

| Что передать | Рекомендуемое имя в env партнёра | Для чего |
|---|---|---|
| Production URL | `CODDYCAMP_SCHOOL_API_URL` | Базовый URL School API |
| Отдельный `sapi_...` токен клиента результатов | `CODDYCAMP_RESULTS_API_TOKEN` | `POST` результата и защищённый `GET` по `event_id` |
| JWT shared secret | `CODDYCAMP_LIVE_JWT_SECRET` | Проверка подписи входного JWT на backend партнёра; значение совпадает с `DARS_PLATFORM_JWT_SECRET` на стороне Coddy Camp, но партнёр может использовать своё имя env |
| JWT issuer | `CODDYCAMP_LIVE_JWT_ISSUER` | Проверка `iss`; текущее значение передаётся отдельно |
| JWT audience | `CODDYCAMP_LIVE_JWT_AUDIENCE` | Проверка `aud`; текущее значение передаётся отдельно |
| Активный JWT key ID | `CODDYCAMP_LIVE_JWT_KEY_ID` | Выбор ключа по `kid` и безопасная ротация |
| Максимальный TTL | `CODDYCAMP_LIVE_JWT_MAX_TTL_SECONDS` | Дополнительная проверка срока; сейчас не более 43 200 секунд |

Клиент результатов должен иметь только возможности:

- `lesson_results.submit`;
- `lesson_results.read`.

Права на произвольные legacy-таблицы этому клиенту не нужны.

`CODDYCAMP_LIVE_JWT_SECRET` — не готовый JWT и не `sapi_...` токен. Это долгоживущий общий ключ, который хранится только на двух backend-серверах. Конкретный короткоживущий JWT создаёт Coddy Camp для каждого открытия урока и передаёт JSX как `liveToken`.

### 3.2 Токен контекста ученика для автоматического выбора группы

Для живого группового режима backend Dars-platforma должен проверить, что ученик состоит в группе запущенной сессии. Для этого нужен отдельный read-only API-клиент и отдельный токен:

```dotenv
CODDYCAMP_CONTEXT_API_TOKEN=sapi_<секретное значение>
```

Этот клиент вызывает только:

```http
GET /api/v1/lms/students/{lmsStudentId}/integration-context
```

Минимально необходимые разрешённые ресурсы и колонки:

| Ресурс | Колонки |
|---|---|
| `student_list` | `ID`, `ACTIVE` |
| `student_students` | `id`, `user_id` |
| `subscribe_list` | `ID`, `STUDENT_ID`, `ACTIVE`, `STATUS`, `GROUP_ID` |
| `group_list` | `ID`, `STATUS` |

Если у партнёра уже есть отдельный read-only клиент с этими разрешениями, можно использовать его. Нельзя использовать административный, тестовый или чрезмерно широкий токен.

### 3.3 Что партнёру передавать нельзя

Нельзя передавать:

- `SCHOOL_DATA_API_LIVE_TOKEN` — это внутренний токен backend Coddy Camp LMS;
- токен с возможностью `live_tokens.issue`;
- токен администратора School API;
- пароль MariaDB или прямой доступ к production DB;
- пользовательский LMS auth token;
- полный `.env` любого проекта.

Три вида токенов нельзя путать:

| Вид | Пример формата | Где хранится |
|---|---|---|
| Внутренний LMS API-токен | `sapi_...` | Только backend Coddy Camp LMS; партнёру не выдаётся |
| Партнёрские API-токены | `sapi_...` | Только backend Dars-platforma |
| Временный входной JWT | `xxxxx.yyyyy.zzzzz` | Передаётся во время открытия урока и проверяется backend партнёра |

## 4. Контракт JSX-компонента

### 4.1 Как Coddy Camp открывает динамический урок

Обычный клик учителя по любому материалу CRM с типом `jsx` открывает его исходный preview URL. Название темы, имя JSX-файла и числовой ID урока не захардкожены: механизм работает для всех динамических JSX-материалов.

CRM и LMS frontend выполняют защищённый handshake через `postMessage`, получают короткоживущий mentor JWT на backend Coddy Camp и передают его в загруженный компонент как `liveToken`. Сам JWT не помещается в URL, `localStorage` или `sessionStorage`.

Партнёр не должен читать `group_id` или имя наставника из query string. После обязательной серверной проверки JWT эти значения берутся только из подписанных claims:

- `gid` — подтверждённый ID группы;
- `sub` — ID фактически открывшего урок учителя или TA;
- `name` — подтверждённое имя;
- `role` — `mentor`.

### 4.2 Prop `liveToken`

LMS передаёт динамическому уроку новый необязательный prop:

```jsx
<Lesson
  liveToken={liveToken}
  lang="uz"
  onFinished={handleFinished}
/>
```

Корневой компонент партнёра должен принять его:

```jsx
export default function InternetLesson({
  liveToken,
  lang = 'uz',
  onFinished,
}) {
  // Реализация партнёра
}
```

`liveToken` может сначала быть `null`, а затем появиться после асинхронного запроса LMS. Компонент обязан реагировать на изменение prop, а не читать его только один раз при монтировании.

Пример клиентской логики:

```jsx
useEffect(() => {
  if (!liveToken) return;

  const controller = new AbortController();

  fetch('https://PARTNER_BACKEND/api/coddycamp/live/join', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${liveToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lesson_id: LESSON_ID }),
    signal: controller.signal,
  })
    .then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || `HTTP ${response.status}`);
      return body;
    })
    .then((session) => enterLiveSession(session))
    .catch((error) => {
      if (error.name !== 'AbortError') showSafeJoinError();
    });

  return () => controller.abort();
}, [liveToken]);
```

Точный URL backend партнёр выбирает сам. Значение JWT рекомендуется передавать в `Authorization: Bearer`, а не в URL, query string или localStorage.

JSX не должен:

- проверять HS256-подпись в браузере;
- содержать JWT shared secret;
- доверять декодированным claims без серверной проверки;
- отправлять `sapi_...` токены;
- писать JWT в `console.log`, аналитику или crash report.

Старый ручной PIN можно оставить как резервный режим. Ошибка автоматического входа не должна приводить к белому экрану или поломке обычного урока.

## 5. Что делает backend Dars-platforma при входе

### 5.1 Проверка JWT

Backend получает JWT от JSX и обязан проверить все условия:

1. Токен состоит из трёх JWT-сегментов.
2. В header строго `alg = HS256`; алгоритм нельзя брать из токена как разрешение.
3. `typ = JWT`.
4. `kid` известен и соответствует активному или временно разрешённому ключу.
5. HMAC SHA-256 подпись корректна.
6. `iss` точно равен переданному Coddy Camp issuer.
7. `aud` точно равен переданному Coddy Camp audience.
8. Проверены `nbf`, `iat`, `exp`; допустимая погрешность часов — максимум 60 секунд.
9. `exp > nbf`, а `exp - iat` не превышает 43 200 секунд.
10. `jti` — непустой уникальный идентификатор.
11. `role` равен только `student` или `mentor`.
12. `sub` — строка с положительным числовым ID.

Нельзя разрешать `alg=none`, другой HMAC-алгоритм или динамически менять алгоритм по входному JWT.

Если секрет передан в формате `base64:<значение>`, backend партнёра должен удалить префикс `base64:` и декодировать оставшуюся Base64-строку в байты. Использовать всю строку `base64:...` как буквальный HMAC-ключ неправильно. Если секрет передан без префикса, он используется как обычная UTF-8 строка.

Пример проверки на Node.js с библиотекой `jose`:

```js
import { jwtVerify } from 'jose';

function jwtKeyFromEnv(value) {
  if (!value) throw new Error('JWT secret is not configured');
  return value.startsWith('base64:')
    ? Buffer.from(value.slice(7), 'base64')
    : Buffer.from(value, 'utf8');
}

export async function verifyCoddyCampLiveToken(token) {
  const { payload, protectedHeader } = await jwtVerify(
    token,
    jwtKeyFromEnv(process.env.CODDYCAMP_LIVE_JWT_SECRET),
    {
      algorithms: ['HS256'],
      issuer: process.env.CODDYCAMP_LIVE_JWT_ISSUER,
      audience: process.env.CODDYCAMP_LIVE_JWT_AUDIENCE,
      clockTolerance: 60,
      maxTokenAge: '12h',
    },
  );

  if (protectedHeader.typ !== 'JWT') throw new Error('invalid_typ');
  if (protectedHeader.kid !== process.env.CODDYCAMP_LIVE_JWT_KEY_ID) {
    throw new Error('unknown_kid');
  }
  if (!['student', 'mentor'].includes(payload.role)) throw new Error('invalid_role');
  if (!/^[1-9][0-9]*$/.test(String(payload.sub))) throw new Error('invalid_sub');
  if (!payload.jti) throw new Error('missing_jti');
  if (!Number.isInteger(payload.iat) || !Number.isInteger(payload.exp)) {
    throw new Error('invalid_token_time');
  }
  if (payload.exp <= payload.iat || payload.exp - payload.iat > 43_200) {
    throw new Error('invalid_token_ttl');
  }

  return { payload, protectedHeader };
}
```

При ротации ключ сначала выбирают по `kid` из строгого серверного allowlist, после чего обязательно проверяют подпись выбранным ключом. Само значение `kid` не является доказательством подлинности.

### 5.2 Claims ученика

```json
{
  "sub": "34174",
  "role": "student",
  "name": "Student Name",
  "crm_id": 17226,
  "iss": "<issuer>",
  "aud": "<audience>",
  "iat": 1787740000,
  "nbf": 1787740000,
  "exp": 1787783200,
  "jti": "uuid"
}
```

- `sub` — `student_students.id`, то есть LMS ID;
- `crm_id` — `student_list.ID`;
- `name` — официальное имя из актуальной school DB.

Имя для сессии нужно брать из проверенного claim `name`, а не из поля браузерной формы.

### 5.3 Claims наставника

```json
{
  "sub": "145",
  "role": "mentor",
  "name": "Mentor Name",
  "gid": 861,
  "iss": "<issuer>",
  "aud": "<audience>",
  "iat": 1787740000,
  "nbf": 1787740000,
  "exp": 1787783200,
  "jti": "uuid"
}
```

- `sub` — `teacher_list.ID`;
- `gid` — `group_list.ID`, для которой School API подтвердил связь с наставником.

Наставником может быть:

- активный основной учитель, назначенный в `group_list.TEACHER_ID`;
- активный TA, назначенный в `group_list.TA_ID` (в CRM это `role_id = 5`).
- действующий временный ментор из `temporary_group_mentor`, если запись активна и текущая дата входит в `START_DATE..END_DATE` включительно (`END_DATE` может быть `null`).

Во всех случаях партнёр получает одинаковый `role = mentor`. Отдельный `role_id` и тип назначения в JWT не передаются и партнёру не требуются: `sub` всегда содержит `teacher_list.ID` сотрудника, который фактически открыл урок. Куратор, администратор, сотрудник без назначения, а также временный ментор до начала или после окончания своего периода mentor JWT не получают.

Сессия, созданная наставником, должна сохранять `gid`, `teacher_id = sub`, `lesson_id` и `jti`.

### 5.4 Привязка `jti` к сессии

При первом успешном использовании JWT backend партнёра связывает `jti` ровно с одной игровой сессией.

- Повторное использование того же JWT с тем же `jti` в той же сессии разрешено.
- Создать или открыть другую сессию тем же `jti` нельзя.
- Привязка хранится как минимум до `exp` JWT.
- Уникальность обеспечивается ограничением в БД и транзакцией, а не только проверкой в коде.

После F5 frontend может запросить новый JWT, и у него будет новый `jti`. Партнёр должен восстановить уже созданную сессию по своей защищённой backend-сессии и проверенной паре `role + sub`; ожидать повторения старого `jti` нельзя. Новый JWT заново проверяется полностью и не должен позволять пользователю войти в чужую группу или создать параллельную сессию вопреки правилам продукта.

Рекомендуемые уникальные ограничения:

```text
UNIQUE(jwt_jti)
UNIQUE(session_id, role, subject_id)
```

Не храните сам JWT, если достаточно хранить `jti`, проверенные ID и `exp`. Если нужен аудит, сохраняйте SHA-256 JWT, но не исходный токен.

## 6. Как полностью убрать PIN

JWT подтверждает личность, но ученический JWT намеренно не содержит PIN. Безопасный автоматический выбор выполняется по группе и уроку:

1. Наставник открывает живой урок с проверенным mentor JWT.
2. Backend партнёра создаёт сессию с `gid` из mentor JWT и конкретным `lesson_id`.
3. Ученик открывает тот же JSX и отправляет student JWT backend партнёра.
4. Backend берёт LMS ID из проверенного `sub`.
5. Backend server-to-server вызывает:

```http
GET https://school-api.coddycamp.uz/api/v1/lms/students/{sub}/integration-context
Authorization: Bearer <CODDYCAMP_CONTEXT_API_TOKEN>
Accept: application/json
```

6. Из `data.subscriptions` выбираются только подписки со `status = active` или `demo`, `active = true` и активной группой.
7. Backend ищет активную сессию с тем же `lesson_id`, чей `group_id` входит в разрешённые группы ученика.
8. Если найдена одна сессия — ученик входит автоматически под именем из JWT.
9. Если найдено несколько сессий — показывается безопасный выбор без раскрытия чужих групп.
10. Если сессия не найдена — возвращается понятная ошибка «В вашей группе сейчас нет активного урока».

Нельзя выбирать первую активную сессию только по `lesson_id`: одновременно один урок могут проводить разные группы.

JWT подтверждает личность и базовую допустимость пользователя к живым урокам, но не является разрешением на произвольный `lesson_id`. Backend партнёра обязан проверять `lesson_id` по своему серверному каталогу и связывать ученика только с уже разрешённой сессией его группы. Нельзя доверять одному `lesson_id`, пришедшему из браузера.

### Текущий этап внедрения

На стороне Coddy Camp реализованы оба потока:

- student-flow: LMS backend выпускает ученический JWT, frontend передаёт его JSX как `liveToken`;
- mentor-flow: клик основного учителя или назначенного TA по динамическому JSX запускает безопасный обмен и передаёт компоненту mentor JWT с проверенным `gid`.

Чтобы убрать ручной PIN end-to-end, партнёр должен реализовать серверную проверку JWT и создание/поиск сессии по алгоритму этого раздела. До совместной проверки и подтверждения production-релиза старый PIN рекомендуется оставить как fallback. Отсутствие `liveToken` не должно ломать JSX-урок.

## 7. Отправка результатов

Результаты отправляет только backend Dars-platforma:

```http
POST https://school-api.coddycamp.uz/api/v1/integrations/dars-platform/lesson-results
Authorization: Bearer <CODDYCAMP_RESULTS_API_TOKEN>
Accept: application/json
Content-Type: application/json
```

### 7.1 Live-урок

```json
{
  "event_id": "sess_483920_2026-08-26T10:42:00Z",
  "lesson_id": "js-conditions",
  "lesson_title": "JavaScript Conditions",
  "mode": "live",
  "group_id": 861,
  "teacher_id": 145,
  "started_at": "2026-08-26T09:00:12Z",
  "finished_at": "2026-08-26T10:42:00Z",
  "total_questions": 12,
  "students": [
    {
      "student_id": 34174,
      "id_type": "lms",
      "correct_answers": 11,
      "answered": 12,
      "rank": 1,
      "badges": ["first_try", "speedster"],
      "badges_count": 2,
      "duration_sec": 5400,
      "completed": true
    }
  ]
}
```

Для `mode=live` обязательны `group_id` и `teacher_id`. Они должны совпадать с проверенными данными сессии наставника.

### 7.2 Самостоятельный урок

```json
{
  "event_id": "solo_34174_js-conditions_20260826T104200Z",
  "lesson_id": "js-conditions",
  "lesson_title": "JavaScript Conditions",
  "mode": "solo",
  "started_at": "2026-08-26T10:00:12Z",
  "finished_at": "2026-08-26T10:42:00Z",
  "total_questions": 12,
  "students": [
    {
      "student_id": 34174,
      "id_type": "lms",
      "correct_answers": 10,
      "answered": 12,
      "rank": null,
      "badges": ["graduate"],
      "badges_count": 1,
      "duration_sec": 2508,
      "completed": true
    }
  ]
}
```

Для `mode=solo` поля `group_id` и `teacher_id` нужно полностью исключить. Должен быть ровно один ученик, а `rank` должен быть `null`.

### 7.3 Правила payload

- `event_id` уникален в пределах API-клиента, стабилен при повторной отправке и имеет максимум 128 символов;
- разрешённый формат `event_id` и `lesson_id`: `[A-Za-z0-9][A-Za-z0-9._:@-]*`;
- рекомендуемый `student_id` — LMS ID из проверенного JWT `sub`;
- рекомендуемый `id_type` — `lms`;
- допускается от 1 до 100 учеников;
- `correct_answers <= answered <= total_questions`;
- `rank` равен `1`, `2`, `3` или `null`; одно место нельзя назначить двум ученикам;
- `badges` содержит уникальные стабильные ключи `lower_snake_case`;
- `badges_count` строго равен длине `badges`;
- `duration_sec` находится в диапазоне от 0 до 86 400;
- `finished_at >= started_at`;
- даты отправляются в ISO 8601 UTC, например `2026-08-26T10:42:00Z`;
- одного ученика нельзя повторять дважды с одинаковой парой `id_type + student_id`.

## 8. Идемпотентность и надёжная доставка

Первый приём возвращает `201 Created` и `duplicate: false`.

Идентичный повтор с тем же `event_id` возвращает `200 OK` и `duplicate: true`. Повторных строк не создаётся.

Тот же `event_id` с другим содержанием возвращает `409 Conflict`. В этом случае нельзя генерировать новый `event_id` и молча отправлять изменённое событие: требуется расследование.

Backend партнёра должен сначала сохранить событие и payload в своей БД со статусом `pending`, затем отправлять его из очереди. Рекомендуемые статусы:

```text
pending -> delivered
pending -> retry_wait -> delivered
pending -> manual_review
```

Автоматический retry разрешён только при:

- сетевой ошибке;
- `429` с учётом `Retry-After`;
- `500` или `503`.

Рекомендуемые задержки: 1, 3 и 10 секунд, затем фоновая очередь. Нельзя автоматически повторять `401`, `403`, `409` и `422` без исправления причины.

Для проверки уже отправленного события:

```http
GET https://school-api.coddycamp.uz/api/v1/integrations/dars-platform/lesson-results/{event_id}
Authorization: Bearer <CODDYCAMP_RESULTS_API_TOKEN>
Accept: application/json
```

Endpoint показывает только события, созданные тем же API-клиентом.

## 9. Частичное принятие группы

Если часть учеников не найдена или недоступна, корректные ученики сохраняются. Ответ содержит:

```json
{
  "data": {
    "event_id": "example_event_1",
    "accepted": true,
    "duplicate": false,
    "students_received": 2,
    "students_accepted": 1,
    "students_rejected": 1,
    "rejected_students": [
      {
        "student_id": 999999,
        "id_type": "lms",
        "reason": "identity_not_found_or_unavailable"
      }
    ],
    "reward_status": "pending_policy"
  }
}
```

Партнёр сохраняет `rejected_students` для разбирательства. Идентичный повтор вернёт результат первоначальной обработки, даже если связь ученика позже изменилась.

Структурная ошибка payload, неправильная пара `group_id + teacher_id` или конфликт `event_id` отклоняют всё событие.

## 10. Коды ответа

| HTTP | Действие партнёра |
|---:|---|
| `200` | Успех или идентичный дубликат; проверить `data.duplicate` |
| `201` | Новый результат сохранён |
| `401` | Остановить отправку и проверить API-токен |
| `403` | Нет возможности или пользователь не допущен; не обходить проверку |
| `404` | Событие не найдено или недоступно этому клиенту |
| `409` | Тот же `event_id` использован с другим payload; ручное расследование |
| `422` | Исправить структуру/значения payload |
| `429` | Повторить после `Retry-After` |
| `500` | Ограниченный retry; сохранить безопасный `X-Request-ID` |
| `503` | Временная недоступность; ограниченный retry |

Для диагностики сохраняются HTTP-код, тип операции, `event_id` и `X-Request-ID`. Токены, JWT, полные персональные payload и Authorization header не логируются.

## 11. Начисление coin

Текущая версия сохраняет факты прохождения, но не начисляет coin. Успешный ответ содержит:

```json
{
  "reward_status": "pending_policy"
}
```

Это ожидаемое поведение до утверждения бизнес-формулы. Партнёр не должен самостоятельно считать или показывать начисленные Coddy Camp coin как окончательные.

## 12. Ротация секретов

### JWT secret

При смене JWT secret Coddy Camp передаёт новый secret и новый `kid`. Партнёр временно принимает оба `kid`, пока JWT со старым ключом не истекут, затем удаляет старый ключ.

Рекомендуемая серверная структура:

```text
kid v1 -> old secret
kid v2 -> current secret
```

### API-токены `sapi_...`

Новый токен сначала устанавливается на backend партнёра и проверяется, затем старый отзывается в School API. Токен в браузере или JSX не меняется, потому что его там быть не должно.

## 13. Приёмочный тест

Интеграция считается готовой после совместной проверки:

1. Старый JSX-урок без поддержки `liveToken` продолжает работать.
2. Активный ученик получает JWT и входит без ввода имени.
3. Истёкший JWT отклоняется без белого экрана.
4. JWT с неправильным `aud`, `iss`, `kid` или подписью отклоняется.
5. Замороженный ученик не получает live JWT.
6. Наставник может создать сессию только для своей активной группы.
7. Назначенный TA (`role_id = 5`, `group_list.TA_ID`) получает `role=mentor` только для своей активной группы.
8. Действующий временный ментор получает `role=mentor` только в разрешённый период своей активной записи.
9. Неназначенный сотрудник, куратор и временный ментор вне периода не получают mentor JWT.
10. Сессия хранит проверенные `gid`, `teacher_id`, `lesson_id` и `jti`.
11. Ученик своей группы входит автоматически.
12. Ученик другой группы не входит в чужую сессию.
13. Повтор того же JWT не создаёт новую сессию; новый JWT после F5 с новым `jti` возвращает проверенного пользователя в его существующую серверную сессию.
14. Любой JSX-материал открывается независимо от названия темы; старые JSX без `liveToken` не ломаются.
15. Если автоматический вход недоступен, старый PIN fallback работает.
16. Новый результат получает `201`.
17. Идентичный повтор получает `200` и `duplicate: true`.
18. Изменённый повтор получает `409`.
19. Частично неверная группа учеников сохраняет корректных и возвращает отклонённых.
20. `GET` по `event_id` подтверждает сохранённое событие.
21. В frontend, URL и логах отсутствуют `sapi_...` токены, JWT secret и исходные JWT.

## 14. Комплект передачи партнёру

Через Git или обычный документ:

- этот файл;
- `docs/dars-platform-openapi.yaml`;
- production base URL;
- список тестовых ID без реальных персональных данных;
- описание ожидаемых тест-кейсов.

Через защищённый канал отдельными сообщениями/секретами:

1. `CODDYCAMP_RESULTS_API_TOKEN` — токен созданного клиента результатов;
2. `CODDYCAMP_CONTEXT_API_TOKEN` — узкий read-only токен контекста, если нужен live group-flow;
3. `CODDYCAMP_LIVE_JWT_SECRET`;
4. `CODDYCAMP_LIVE_JWT_ISSUER`;
5. `CODDYCAMP_LIVE_JWT_AUDIENCE`;
6. `CODDYCAMP_LIVE_JWT_KEY_ID`;
7. точный rate limit каждого API-клиента.

Не передавать `SCHOOL_DATA_API_LIVE_TOKEN`: он остаётся исключительно внутри Coddy Camp LMS.
