# ТЗ: детальная аналитика результата урока — ответы по вопросам, попытки, достижения

**Дата:** 2026-09-07 · **Кому:** Ахадулла (интеграция LMS / School API) · **От кого:** команда Dars-platforma
**Статус:** предложение к согласованию. Расширяет контракт `lesson-results` (PARTNER_IMPLEMENTATION v1.2, §7) — текущий контракт не ломает.

---

## 1. Цель

Сейчас по каждому ученику уходит итог: сколько правильных, ранг, бейджи, длительность. Вы попросили добавить детализацию: по каждому вопросу теста — какие ответы ученик давал по попыткам и какой ответ правильный, а также достижения, которые ученик получил в уроке. Ниже — что фиксируется сейчас, что будем фиксировать, и в каком формате предлагаем передавать.

## 2. Что есть сейчас (факты)

| Режим | Попытки на вопрос | Что хранится на сервере |
|---|---|---|
| Живой урок (с наставником) | **Одна.** Это правило продукта: ответ фиксируется первым нажатием, чтобы результат был честным для подиума. На экране написано «одна попытка» | По каждому вопросу одна строка: номер выбранного варианта, правильно/нет (считает сервер по ключу, клиенту не доверяем), время ответа |
| Самостоятельный режим | Несколько, пока не найдёт правильный | Только сводка прогресса: последний выбранный вариант и флаг «первая попытка была верной». Историю попыток сервер не хранит |

Тексты вопросов и вариантов на сервере не хранятся — только номера. Тексты лежат в файле урока. Итоговый балл (`correct_answers`) в обоих режимах считается по **первой попытке**.

## 3. Что будем фиксировать после доработки

1. **Каждое нажатие** на вариант ответа в тестовом вопросе — отдельное событие: вопрос, номер попытки, выбранный вариант и его текст, правильно/нет (считает сервер), время от показа вопроса, момент ответа. В обоих режимах.
2. Правило балла не меняется: `correct_answers` = число вопросов, отвеченных верно **с первой попытки**. Дополнительно передаём `solved` — дошёл ли ученик до правильного ответа в итоге (в самостоятельном режиме).
3. Тексты вопроса и вариантов передаёт урок вместе с ответом, на языке, на котором ученик проходил урок (`uz` или `ru`). Балл по-прежнему считается сервером по номеру варианта.
4. **Достижения урока.** В каждом уроке есть свой набор достижений (обычно 4): стабильный `id`, короткое название, описание на uz и ru. Пример из урока «Интернет»: `firstwin` — «Bullseye!» — «Вы правильно ответили на первый вопрос теста». Они выдаются учеником за конкретные действия в уроке. Будем передавать список полученных с моментом получения. Ваши бейджи (`first_try`, `speedster`, `top_1`… — §7 контракта) остаются как есть, это другой слой.
5. Вопросы «боя на закрепление» (арена, только живой урок) можно передавать тем же форматом с `kind = "arena"`. В балл они не входят (правило согласовано ранее). Нужны ли — вопрос 3 в п. 7.

## 4. Формат — вариант A (рекомендуем): расширить объект ученика

Новые поля добавляются в существующий `StudentResult` как **необязательные**. Старые события без них остаются валидными. Пример одного ученика (самостоятельный режим, вторая попытка во втором вопросе):

```json
{
  "student_id": 34174,
  "id_type": "lms",
  "correct_answers": 7,
  "answered": 8,
  "rank": null,
  "badges": ["graduate"],
  "badges_count": 1,
  "duration_sec": 1910,
  "completed": true,
  "lang": "uz",
  "questions": [
    {
      "question_id": "s4",
      "kind": "test",
      "order": 1,
      "question": "Internet nima?",
      "options": ["Bitta katta kompyuter", "Kompyuterlar tarmog'i", "Brauzer", "Sayt"],
      "correct_option": 1,
      "correct_answer": "Kompyuterlar tarmog'i",
      "correct": true,
      "solved": true,
      "attempts": [
        { "n": 1, "option": 1, "answer": "Kompyuterlar tarmog'i", "correct": true, "elapsed_ms": 4200, "at": "2026-09-07T10:12:03Z" }
      ]
    },
    {
      "question_id": "s7",
      "kind": "test",
      "order": 2,
      "question": "So'rov avval qayerga boradi?",
      "options": ["Serverga", "DNS'ga", "Printerga", "Routerga"],
      "correct_option": 1,
      "correct_answer": "DNS'ga",
      "correct": false,
      "solved": true,
      "attempts": [
        { "n": 1, "option": 0, "answer": "Serverga", "correct": false, "elapsed_ms": 6100, "at": "2026-09-07T10:13:40Z" },
        { "n": 2, "option": 1, "answer": "DNS'ga",   "correct": true,  "elapsed_ms": 9800, "at": "2026-09-07T10:13:52Z" }
      ]
    }
  ],
  "achievements": [
    { "id": "firstwin", "name": "Bullseye!", "title": "Birinchi test savoliga to'g'ri javob berdingiz", "earned_at": "2026-09-07T10:12:03Z" },
    { "id": "graduate", "name": "Level Up!", "title": "Internet darsini to'liq yakunladingiz",            "earned_at": "2026-09-07T10:43:10Z" }
  ]
}
```

В живом уроке у каждого вопроса ровно одна попытка, `solved = correct`.

### Поля

| Поле | Тип | Правило |
|---|---|---|
| `lang` | `uz` \| `ru` | Язык, на котором ученик проходил урок; на нём все тексты ниже |
| `questions[]` | массив, ≤ 200 | Только вопросы, на которые ученик отвечал. Порядок — как в уроке |
| `question_id` | строка ≤ 64 | Стабильный id вопроса внутри урока (`s4`, `quiz-3`) |
| `kind` | `test` \| `arena` | `test` входит в балл, `arena` — нет |
| `order` | целое ≥ 1 | Порядковый номер вопроса в уроке |
| `question`, `options[]`, `correct_answer` | строки ≤ 300, options ≤ 6 | Тексты на языке `lang` |
| `correct_option` | целое 0..5 | Индекс правильного варианта |
| `correct` | boolean | Верно **с первой попытки** — то, что входит в `correct_answers` |
| `solved` | boolean | Дошёл до правильного ответа (после любой попытки) |
| `attempts[]` | массив 1..10 | По порядку. `n` с 1; `option` индекс; `answer` текст; `correct` (сервер); `elapsed_ms` 0..3 600 000 от показа вопроса; `at` ISO UTC. Больше 10 нажатий не храним |
| `achievements[]` | массив ≤ 20 | `id` `[a-z0-9_-]{1,32}`, уникален в уроке; `name` ≤ 40; `title` ≤ 200 на языке `lang`; `earned_at` ISO UTC |

Инварианты: `correct_answers` = число `questions` с `kind = test` и `correct = true`; `answered` = число `questions` с `kind = test`; `attempts[0].correct == correct`; попытки строго по времени.

Размер: 30 учеников × 12 вопросов × до 3 попыток ≈ 100–150 КБ на событие. Просим лимит тела запроса не меньше 1 МБ.

Идемпотентность не меняется: детали — часть того же события с тем же `event_id`; повтор идентичен → `200`, `duplicate: true`. Отправленное событие мы не меняем.

## 5. Вариант B: отдельный запрос

`POST /api/v1/integrations/dars-platform/lesson-results/{event_id}/details` с телом `{ "students": [ { "student_id", "id_type", "lang", "questions": [...], "achievements": [...] } ] }`. Отправляется сразу после `201` основного события, идемпотентен по `event_id`, `GET` по тому же пути возвращает сохранённое.

Плюс: основной контракт не трогается, тело основного события остаётся маленьким. Минус: два запроса, два состояния доставки, детали могут отстать от итога. **Мы рекомендуем вариант A** — одно событие, одна очередь, одна проверка.

## 6. Черновик OpenAPI для варианта A

```yaml
StudentResult:
  properties:
    lang: { type: string, enum: [uz, ru] }
    questions:
      type: array
      maxItems: 200
      items: { $ref: '#/components/schemas/QuestionResult' }
    achievements:
      type: array
      maxItems: 20
      items: { $ref: '#/components/schemas/AchievementResult' }
QuestionResult:
  type: object
  additionalProperties: false
  required: [question_id, kind, order, question, options, correct_option, correct_answer, correct, solved, attempts]
  properties:
    question_id: { type: string, maxLength: 64, pattern: '^[A-Za-z0-9][A-Za-z0-9._:-]*$' }
    kind: { type: string, enum: [test, arena] }
    order: { type: integer, minimum: 1, maximum: 1000 }
    question: { type: string, maxLength: 300 }
    options: { type: array, minItems: 2, maxItems: 6, items: { type: string, maxLength: 300 } }
    correct_option: { type: integer, minimum: 0, maximum: 5 }
    correct_answer: { type: string, maxLength: 300 }
    correct: { type: boolean }
    solved: { type: boolean }
    attempts:
      type: array
      minItems: 1
      maxItems: 10
      items: { $ref: '#/components/schemas/AttemptResult' }
AttemptResult:
  type: object
  additionalProperties: false
  required: [n, option, answer, correct, elapsed_ms, at]
  properties:
    n: { type: integer, minimum: 1, maximum: 10 }
    option: { type: integer, minimum: 0, maximum: 5 }
    answer: { type: string, maxLength: 300 }
    correct: { type: boolean }
    elapsed_ms: { type: integer, minimum: 0, maximum: 3600000 }
    at: { type: string, format: date-time }
AchievementResult:
  type: object
  additionalProperties: false
  required: [id, name, title, earned_at]
  properties:
    id: { type: string, pattern: '^[a-z0-9_-]{1,32}$' }
    name: { type: string, maxLength: 40 }
    title: { type: string, maxLength: 200 }
    earned_at: { type: string, format: date-time }
```

## 7. Что нужно от вас

| № | Вопрос | Ответ |
|---|---|---|
| 1 | Вариант **A** (в событии) или **B** (отдельный запрос) | A / B |
| 2 | Нужны ли тексты (вопрос, варианты, ответ), или достаточно `question_id` и номеров вариантов | да / нет |
| 3 | Нужны ли вопросы арены (`kind = arena`, только живой урок, в балл не входят) | да / нет |
| 4 | Подтверждаете правило: в живом уроке одна попытка на вопрос, балл — по первой попытке в обоих режимах | да / нет |
| 5 | Лимиты приемлемы: ≤ 200 вопросов, ≤ 10 попыток на вопрос, ≤ 20 достижений, тело до 1 МБ | да / иное |
| 6 | Обновлённый `dars-platform-openapi.yaml` и дата, когда School API начнёт принимать новые поля (сначала на вашем тестовом контуре) | дата |
| 7 | Влияют ли детали на начисление coin, или coin по-прежнему от `correct_answers` и `rank` | — |

## 8. Сроки и проверка

После ответов по п. 7: сервер (таблица попыток, сборка `questions`/`achievements`) — 1 день; уроки (фиксация каждой попытки, 101 урок одним скриптом) — 1 день; тесты и проверка отправки на ваш тестовый контур School API — 1 день. Итого 3 рабочих дня. К совместному приёмочному тесту добавляются два пункта: детали по вопросам пришли и совпадают с экраном ученика; достижения пришли.

До согласования формата код не пишем, чтобы не переделывать.

## 9. Решение 2026-09-08 — вариант C: тот же объект через `onFinished`

По ответу Axadulla (School API остаётся без изменений, детали — через `onFinished`, при необходимости позже — отдельный endpoint):

- В payload `onFinished` (то, что урок уже отдаёт LMS-фронту при завершении) добавляются **три поля верхнего уровня**, ровно как в §4:
  `lang` (`uz` | `ru`), `questions[]`, `achievements[]`. Все прежние поля payload (`lessonId`, `correctAnswers`, `totalQuestions`, `answers`, …) остаются без изменений.
- `questions[]`: только вопросы, на которые ученик отвечал; `kind = "test"` — вопросы урока. **С 2026-09-10 также `kind = "arena"`** — вопросы боя на закрепление (CodeStrike): только живой урок, одна попытка на вопрос, идут после тестов (`order` продолжается), в балл не входят — `totalQuestions` / `correctAnswers` считаются только по `kind = "test"`. **Не считайте балл по `questions.length`.** `attempts[]` — каждое нажатие с `elapsed_ms` и `at`;
  `correct` = первая попытка (совпадает с `correctAnswers` в основном событии School API); `solved` — дошёл ли до правильного.
- `achievements[]`: `id` в нижнем регистре, `name`, `title` на языке `lang`, `earned_at`.
- Тексты — на языке, на котором ученик проходил урок. Ограничения те же (≤200 вопросов, ≤10 попыток, ≤6 вариантов, ≤300 символов, ≤20 достижений).
- Событие в School API (`lesson-results`) не меняется; `RESULT_DETAILS` на нашем сервере остаётся выключенным.
- Реализовано в общем модуле уроков (`src/live/resultDetails.js`), подключено во все 97 уроков с живым модулем; проверено в браузере на 5 уроках разных типов.

Пример payload `onFinished` (фрагмент):
```json
{ "lessonId": "internet-01-v18", "correctAnswers": 1, "totalQuestions": 5, "answers": [ … ],
  "lang": "uz",
  "questions": [ { "question_id": "s4", "kind": "test", "order": 1, "question": "…", "options": ["A","B","C","D"], "correct_option": 1, "correct_answer": "B",
                   "correct": true, "solved": true, "attempts": [ { "n": 1, "option": 1, "answer": "B", "correct": true, "elapsed_ms": 4200, "at": "2026-09-08T11:55:00Z" } ] } ],
  "achievements": [ { "id": "firstwin", "name": "Bullseye!", "title": "Birinchi test savoliga to'g'ri javob berdingiz", "earned_at": "2026-09-08T11:55:00Z" } ] }
```
