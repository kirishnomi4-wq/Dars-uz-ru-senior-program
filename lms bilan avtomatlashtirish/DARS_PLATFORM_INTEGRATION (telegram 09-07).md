# Coddy Camp LMS ↔ Dars-platforma

Версия: 1.1

Дата: 2026-08-25

Production base URL: `https://school-api.coddycamp.uz`

Формат: HTTPS + JSON

Этот документ описывает отдельную интеграцию входа в живой урок и передачи результатов. Обычный School Data API остаётся read-only и документирован отдельно в [API_INTEGRATION.md](API_INTEGRATION.md).

Машиночитаемый контракт: [dars-platform-openapi.yaml](dars-platform-openapi.yaml).

Отдельная инструкция для реализации на стороне партнёра: [DARS_PLATFORM_PARTNER_IMPLEMENTATION_RU.md](DARS_PLATFORM_PARTNER_IMPLEMENTATION_RU.md).

## 1. Что реализовано на стороне School API

Код и production endpoint-ы School API реализованы. Сквозная интеграция считается принятой только после передачи ключей и тестовых аккаунтов, подключения LMS-страницы и совместного теста с Dars-platforma.

Интеграция содержит два независимых endpoint-а:

| Метод | Endpoint | Кто вызывает |
|---|---|---|
| `POST` | `/api/v1/integrations/dars-platform/live-token` | Только backend Coddy Camp LMS |
| `POST` | `/api/v1/integrations/dars-platform/lesson-results` | Только backend Dars-platforma |
| `GET` | `/api/v1/integrations/dars-platform/lesson-results/{event_id}` | Backend Dars-platforma проверяет ранее отправленный результат |

Оба endpoint-а используют стандартный заголовок:

```http
Authorization: Bearer sapi_<64 hex символа>
Accept: application/json
Content-Type: application/json
```

Токены нельзя помещать в URL, frontend-код, Git, документацию или логи.

## 2. Разделение клиентов и прав

В админке School API нужно создать два новых API-клиента:

1. `Coddy LMS — выпуск live token`:
   - возможность `live_tokens.issue`;
   - права на таблицы не требуются;
   - токен хранится только на backend LMS.
2. `Dars-platforma — результаты`:
   - возможности `lesson_results.submit` и `lesson_results.read`;
   - права на таблицы не требуются;
   - токен хранится только на backend партнёра.

Существующий клиент партнёра для чтения данных можно не менять. Его endpoint-ы, токены и разрешения продолжат работать как раньше.

Не выдавайте одному клиенту обе интеграционные возможности. Не передавайте партнёру токен с `live_tokens.issue`.

## 3. Выпуск токена входа

```http
POST /api/v1/integrations/dars-platform/live-token
```

Backend LMS обязан сначала аутентифицировать текущего пользователя и самостоятельно получить его ID. Нельзя принимать `subject_id` из произвольного browser-запроса без проверки LMS-сессии.

### 3.1 Ученик

`subject_id` — это `student_students.id`, который текущий LMS уже хранит в серверной сессии ученика.

```json
{
  "role": "student",
  "subject_id": 34174
}
```

School API проверяет:

- существование связи `student_students.user_id → student_list.ID`;
- `student_list.ACTIVE = 1`;
- наличие хотя бы одной подписки `ACTIVE = 1` со статусом `active` или `demo`;
- активность соответствующей группы.

У замороженного ученика нет подходящей подписки, поэтому он получает `403` и не может войти в урок.

### 3.2 Наставник

`subject_id` — `teacher_list.ID`, `group_id` — группа, с карточки которой наставник запускает урок.

```json
{
  "role": "mentor",
  "subject_id": 145,
  "group_id": 861
}
```

School API проверяет активность наставника и точную связь:

```text
group_list.ID = group_id
group_list.TEACHER_ID = subject_id
group_list.STATUS = active
```

Запустить урок для чужой или неактивной группы нельзя.

### 3.3 Успешный ответ

```json
{
  "data": {
    "live_token": "eyJ...",
    "token_type": "JWT",
    "expires_at": "2026-08-21T00:00:00Z"
  }
}
```

JWT подписан `HS256` и содержит:

| Claim | Значение |
|---|---|
| `sub` | Строка с LMS ID ученика или `teacher_list.ID` наставника |
| `role` | `student` или `mentor` |
| `name` | актуальное имя из school DB |
| `crm_id` | CRM ID; только для ученика |
| `gid` | ID группы; только для наставника |
| `iss` | `coddycamp-lms` |
| `aud` | `dars-platform` |
| `iat`, `nbf`, `exp` | временные ограничения |
| `jti` | уникальный ID JWT |

Время жизни по контракту партнёра — 12 часов (`exp = iat + 43200`); это также максимальное разрешённое значение. Для каждого открытия урока LMS должна запрашивать новый JWT.

JWT header содержит `alg: HS256`, `typ: JWT` и `kid`, соответствующий `DARS_PLATFORM_JWT_KEY_ID`. При ротации партнёр временно принимает старый и новый `kid`, пока ранее выпущенные JWT не истекут.

Dars-platforma обязана проверить `alg = HS256`, подпись, `iss`, `aud`, `nbf` и `exp` с допустимой погрешностью часов 60 секунд. Один `jti` при первом входе привязывается к одной игровой сессии: повторный вход после F5 в ту же сессию разрешён, создание другой сессии с тем же `jti` запрещено. Значения `sub`, `role`, `gid` и `name` нельзя принимать из неподписанного frontend-состояния.

### 3.4 Передача в компонент

Backend LMS возвращает `live_token` своему frontend, а frontend передаёт его компоненту:

```jsx
<Lesson liveToken={liveToken} lang="uz" onFinished={handleFinished} />
```

API-токен `sapi_...` при этом никогда не передаётся компоненту или Dars-platforma. Компонент получает только короткоживущий JWT.

### 3.5 Пример вызова из LMS на PHP 7.4

Токен внутреннего API-клиента хранится в server-side env. Для ученика `$subjectId` нужно брать из уже проверенной `$_SESSION['student_id']`, а не из тела browser-запроса.

```php
function requestDarsLiveToken(string $role, int $subjectId, ?int $groupId = null): array
{
    $apiToken = getenv('SCHOOL_API_LIVE_TOKEN_ISSUER_TOKEN');
    if (!is_string($apiToken) || $apiToken === '') {
        throw new RuntimeException('Live-token issuer is not configured');
    }

    $body = ['role' => $role, 'subject_id' => $subjectId];
    if ($role === 'mentor') {
        $body['group_id'] = $groupId;
    }

    $curl = curl_init('https://school-api.coddycamp.uz/api/v1/integrations/dars-platform/live-token');
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiToken,
            'Accept: application/json',
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
    ]);

    $raw = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if (!is_string($raw) || $status !== 200) {
        throw new RuntimeException('School API live-token request failed with HTTP ' . $status);
    }

    return json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
}
```

Не записывайте `$apiToken`, ответ `live_token` или исходное тело запроса в журналы.

## 4. Приём результатов

```http
POST /api/v1/integrations/dars-platform/lesson-results
```

Пример группового результата:

```json
{
  "event_id": "sess_483920_2026-08-18T10:42:00Z",
  "lesson_id": "pm-audience",
  "lesson_title": "Auditoriya — kim uchun quramiz",
  "mode": "live",
  "group_id": 861,
  "teacher_id": 145,
  "started_at": "2026-08-18T09:00:12Z",
  "finished_at": "2026-08-18T10:42:00Z",
  "total_questions": 12,
  "students": [
    {
      "student_id": 34174,
      "id_type": "lms",
      "correct_answers": 11,
      "answered": 12,
      "rank": 1,
      "badges": ["first_try", "speedster", "graduate"],
      "badges_count": 3,
      "duration_sec": 5400,
      "completed": true
    }
  ]
}
```

Рекомендуется всегда отправлять `id_type: "lms"` и тот же `student_students.id`, который был в `sub` входного JWT. Значение `crm` также поддерживается.

Основные проверки:

- от 1 до 100 учеников в одном событии;
- `correct_answers ≤ answered ≤ total_questions`;
- места только `1`, `2`, `3` или `null`, каждое призовое место уникально;
- `badges_count` равно длине `badges`;
- badge ID имеет стабильный формат `lower_snake_case` и не повторяется у одного ученика; одинаковый badge у разных учеников разрешён;
- в режиме `solo` ровно один ученик, `group_id` и `teacher_id` отсутствуют, а `rank` передаётся как `null`;
- в режиме `live` обязательны связанные `group_id` и `teacher_id`;
- каждый LMS/CRM ID проверяется по актуальной school DB.

### 4.1 Первый приём

Ответ `201 Created`:

```json
{
  "data": {
    "event_id": "sess_483920_2026-08-18T10:42:00Z",
    "accepted": true,
    "duplicate": false,
    "students_received": 1,
    "students_accepted": 1,
    "students_rejected": 0,
    "rejected_students": [],
    "reward_status": "pending_policy"
  }
}
```

### 4.2 Идемпотентный повтор

Тот же API-клиент может повторить идентичное событие с тем же `event_id`. API вернёт `200 OK`, `duplicate: true` и не создаст повторные строки.

Порядок учеников и badge-ключей не влияет на идемпотентность. Если с тем же `event_id` придёт другое содержание, API вернёт `409 Conflict`.

### 4.3 Частичное принятие

Неизвестный или недоступный LMS/CRM ID не отклоняет результат всей группы. Валидные ученики сохраняются, а проблемные возвращаются и сохраняются отдельно:

```json
{
  "data": {
    "event_id": "sess_483920_2026-08-18T10:42:00Z",
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

Причина намеренно не раскрывает, отсутствует запись или недоступна. Даже если связь появится позже, идентичный повтор того же `event_id` вернёт сохранённый результат первого приёма. Заморозка уже существующего ученика после урока не уничтожает его результат.

Структурные ошибки payload, нарушенные числовые инварианты, неправильная группа/наставник и конфликт `event_id` по-прежнему отклоняют всё событие.

### 4.4 Просмотр принятого результата

```http
GET /api/v1/integrations/dars-platform/lesson-results/{event_id}
```

Endpoint требует `lesson_results.read` и возвращает только события, отправленные этим же API-клиентом. Он содержит принятых и отклонённых учеников, но не возвращает `payload_hash`, имена или другие дополнительные персональные данные. Чужой или неизвестный `event_id` возвращает `404` без раскрытия причины.

Повторять автоматически можно сетевые ошибки, `429` и `5xx`. Рекомендуются три попытки с паузами 1, 3 и 10 секунд. Не повторяйте `401`, `403`, `409` и `422` без исправления причины.

## 5. Хранение и начисление coin

Принятые факты сохраняются в control DB:

- `lesson_result_events` — урок и уникальный `event_id`;
- `lesson_result_students` — ответы, место, badge и оба разрешённых ID ученика.
- `lesson_result_rejections` — ID, которые не удалось связать, и безопасный код причины.

Текущая версия намеренно не изменяет `school.student_list.COINS`: в исходном ТЗ нет утверждённой формулы начисления. Ответ содержит `reward_status: "pending_policy"`.

После согласования формулы добавляется отдельный атомарный обработчик с журналом начислений. Для этого не потребуется менять контракт партнёра или повторно отправлять уже принятые события. Не выдавайте runtime-пользователю School Data API общие права записи в `school`.

## 6. Коды ответа

| Код | Значение |
|---:|---|
| `200` | Идентичный результат уже был принят |
| `201` | Новый результат сохранён |
| `401` | Bearer-токен отсутствует или недействителен |
| `403` | У клиента нет возможности; личность/группа не допущена |
| `404` | Результат не найден или принадлежит другому API-клиенту |
| `409` | `event_id` повторён с другим содержанием |
| `422` | Ошибка структуры, числового инварианта или связи группы с наставником |
| `429` | Превышен лимит клиента |
| `503` | legacy DB или сервис выпуска JWT временно недоступен |

Для диагностики сохраняйте только HTTP-код и `X-Request-ID`. Не логируйте Bearer-токены, JWT и полные тела с персональными данными.

## 7. Настройка production

В `.env.production` задайте отдельный общий JWT-секрет длиной не менее 32 случайных байт:

```dotenv
DARS_PLATFORM_JWT_SECRET=base64:SET_A_RANDOM_BASE64_VALUE_HERE
DARS_PLATFORM_JWT_ISSUER=coddycamp-lms
DARS_PLATFORM_JWT_AUDIENCE=dars-platform
DARS_PLATFORM_JWT_KEY_ID=v1
DARS_PLATFORM_LIVE_TOKEN_TTL_SECONDS=43200
```

Сгенерировать значение на сервере можно командой `openssl rand -base64 48`. Сам секрет передаётся партнёру только через согласованный защищённый канал и не должен появляться в shell history, GitLab variables общего назначения или чатах.

После deploy выполните обычные control-миграции. Текущий additive-релиз добавляет `lesson_result_rejections` в `school_api_control`; существующие таблицы и таблицы `school` не переписываются.

## 8. Совместимость с действующим School Data API

- URL и JSON всех старых GET-endpoint-ов не меняются.
- Существующие API-клиенты после миграции получают пустой список дополнительных возможностей.
- Старые токены остаются действительными.
- Права ресурсов и колонок продолжают определяться отдельно.
- Подключение `legacy` остаётся защищённым `LEGACY_DB_ENFORCE_READ_ONLY=true`.
- Без настройки JWT-секрета не работает только новый `live-token`; обычное чтение продолжает работать.

Поэтому текущим API можно продолжать пользоваться каждый день для актуальных данных, диагностики и поиска ошибок в LMS-коде.

## 9. Приёмочная проверка

1. Старый `GET /api/v1/resources` возвращает прежний каталог.
2. Старый `integration-context` возвращает ученика и активные/demo-подписки.
3. Замороженному ученику `live-token` возвращает `403`.
4. Наставник получает JWT только для своей активной группы.
5. Подпись и claims JWT проверяются на staging Dars-platforma.
6. Новый результат получает `201`.
7. Идентичный повтор получает `200` и `duplicate: true`.
8. Изменённый повтор получает `409`.
9. В control DB существует одна запись события и ожидаемое число учеников.
10. Никакие значения `student_list.COINS` не изменяются до утверждения reward policy.
11. LMS-страница передаёт `liveToken` компоненту ученика и наставника.
12. `jti` после F5 возвращает пользователя в ту же сессию и не создаёт новую.
13. Ученик другой группы не может войти в сессию наставника.
14. Истёкший JWT и JWT с неправильным `aud` дают понятную ошибку.
15. Неизвестный ID одного ученика не мешает сохранить результаты остальных.
16. Партнёр может проверить отправленный `event_id` через защищённый GET endpoint.

## 10. Что передаётся партнёру вне Git

Следующие значения никогда не помещаются в репозиторий или этот документ:

- Bearer-токен клиента с `lesson_results.submit` и `lesson_results.read`;
- общий `DARS_PLATFORM_JWT_SECRET` и активный `kid`;
- список синтетических тестовых LMS/CRM ID;
- подписанные тестовые JWT.

Их передают только через согласованный защищённый канал. Если отдельного staging нет, совместный тест выполняется на production только выделенными API-клиентами и синтетическими аккаунтами. Точный rate limit сообщается вместе с созданным клиентом.
