# dars-api — техническое задание для серверного разработчика

**Дата:** 2026-09-07 · **Кому:** серверный разработчик Coddy Camp LMS · **От кого:** команда Dars-platforma
**Цель:** запустить сервис `dars-api` на вашем сервере в Docker, обновлять его через CI/CD и дать нам возможность самим видеть ошибки и перезапускать сервис, не дожидаясь вас.

---

## 1. Что это

`dars-api` — backend живых уроков. JSX-урок в LMS отправляет ему из браузера `liveToken` (JWT); сервис открывает сессию, пускает учеников по группе, считает баллы, а в конце урока отправляет результат в School API.

- Стек: Node 22, Fastify 5. База: PostgreSQL 16, только для этого сервиса.
- Состояние хранится в базе, само приложение stateless. Одного контейнера достаточно.
- Внешние соединения: из браузера с `https://lms.coddycamp.uz` (CORS внутри приложения), с сервера на `https://school-api.coddycamp.uz`.
- Нагрузка: группа 30 учеников, один запрос каждые 2,5 с. 10 групп одновременно = 120 запросов/с. На нагрузочном тесте p95 = 99 мс.

## 2. Как это стоит на сервере

```
браузер (lms.coddycamp.uz)
   │ HTTPS
   ▼
ваш reverse-proxy  ──►  127.0.0.1:3001  api (контейнер)  ──►  postgres (контейнер, volume)
                        127.0.0.1:3002  api-staging      ──►  postgres-staging
api ──► https://school-api.coddycamp.uz
```

Каталоги: `/srv/dars-api/prod` и `/srv/dars-api/staging`. В каждом — `docker-compose.deploy.yml` + `.env.deploy`.

Сервисы в compose (даём мы):

| Сервис | Что делает |
|---|---|
| `postgres` | PostgreSQL 16, volume `dars-pgdata`, healthcheck |
| `migrate` | Запускается один раз: обновляет схему и загружает каталог уроков. При ошибке `api` не поднимается |
| `api` | Приложение, порт 3001 только на `127.0.0.1`, healthcheck, логи JSON в stdout, ротация 5×20 МБ |
| `backup` | Каждые 24 ч `pg_dump -Fc` → volume `dars-backups`, хранение 14 дней |

Лимиты ресурсов заданы в compose: api 768 МБ, postgres 512 МБ, backup 128 МБ. Диск ~10 ГБ.

## 3. Что даём мы

В репозитории: `Dockerfile`, `docker-compose.deploy.yml`, `.env.deploy.example`, `.gitlab-ci.yml`, `DOCKER.md`, код, тесты (unit 45, интеграционных 60). Миграции и бэкап автоматические, ручных шагов нет.

## 4. Что нужно от вас

### 4.1 Поддомены и proxy

| | Prod | Staging |
|---|---|---|
| Адрес | `dars-api.coddycamp.uz` | `staging-dars-api.coddycamp.uz` |
| Proxy → | `http://127.0.0.1:3001` | `http://127.0.0.1:3002` |
| TLS | Let's Encrypt | Let's Encrypt |

Требования к proxy: передавать `X-Forwarded-For` и `X-Forwarded-Proto`, `proxy_read_timeout` не меньше 60 с, WebSocket не нужен. Пример для nginx:

```nginx
server {
  listen 443 ssl http2;
  server_name dars-api.coddycamp.uz;
  # ssl_certificate ...; ssl_certificate_key ...;
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
  }
}
```

Если у вас Apache (mod_proxy), эквивалент:

```apache
# a2enmod proxy proxy_http ssl headers
<VirtualHost *:443>
    ServerName dars-api.coddycamp.uz
    SSLEngine on
    # SSLCertificateFile / SSLCertificateKeyFile — certbot --apache
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyTimeout 60
    RequestHeader set X-Forwarded-Proto "https"
    ProxyPass        / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/
</VirtualHost>
```

`X-Forwarded-For` mod_proxy добавляет сам. Для staging — то же самое с `staging-dars-api.coddycamp.uz` и портом `3002`.

Почему нужен поддомен: урок работает в браузере ученика и обращается к API из браузера. Без публичного HTTPS-адреса сервис из браузера недоступен.

### 4.2 Git и CI/CD

1. Проект `dars-api` в GitLab. Наш аккаунт с ролью **Maintainer**: `______` (email или username).
2. Защищённые ветки: `staging` и `main`.
3. Pipeline по нашему `.gitlab-ci.yml`: `test` → `build` (образ в registry, тег = SHA коммита) → `deploy`.
4. Этап `deploy`: ветка `staging` → `/srv/dars-api/staging`, `main` → `/srv/dars-api/prod`. Команды:
   ```
   IMAGE_TAG=<sha> docker compose -f docker-compose.deploy.yml --env-file .env.deploy pull
   IMAGE_TAG=<sha> docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d
   curl -fsS http://127.0.0.1:3001/api/v1/health
   ```
   Если runner стоит на самом сервере (shell executor), этих команд достаточно; при docker executor — через SSH, как вам удобнее.
5. Rollback: перезапуск этапа `deploy` у предыдущего коммита (тег образа = SHA, поэтому старая версия всегда есть).

### 4.3 Чтобы мы сами видели ошибки и могли их исправить

Если во время живого урока что-то ломается, нам нужно посмотреть лог и перезапустить сервис, не дожидаясь вас. Два варианта, достаточно одного:

**Вариант A (предпочтительный):** пользователь `dars` на сервере, SSH только по ключу, sudo только на эти команды:

```
dars ALL=(root) NOPASSWD: /usr/bin/docker compose -f /srv/dars-api/prod/docker-compose.deploy.yml *
dars ALL=(root) NOPASSWD: /usr/bin/docker compose -f /srv/dars-api/staging/docker-compose.deploy.yml *
```

Это затрагивает только два наших compose-стека (`logs`, `ps`, `restart`, `up`), не другие контейнеры и файлы. Наш публичный ключ:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKLB1drihGPMNGUx3gSkql4YRzA1slxrYpnQrFU3GdWB azizbekyutub24@gmail.com
```

**Вариант B:** без SSH. Логи через Dozzle или Portainer (только наши контейнеры, с паролем), перезапуск — право повторно запускать этап `deploy` в CI. Минус: перезапуск занимает 2–3 минуты.

В обоих вариантах: `https://<адрес>/api/v1/health` и `https://<адрес>/admin` (basic auth внутри приложения) должны быть доступны снаружи.

### 4.4 Env-файл и секреты

Файл: `/srv/dars-api/prod/.env.deploy` (и для staging), владелец `root`, права `640`, группа `dars` читает. Список ключей в `.env.deploy.example`. Значения:

| Ключ | Кто задаёт |
|---|---|
| `POSTGRES_PASSWORD` | вы, случайный |
| `CODDYCAMP_RESULTS_API_TOKEN`, `CODDYCAMP_CONTEXT_API_TOKEN` | вы, из School API |
| `CODDYCAMP_LIVE_JWT_SECRET`, `_ISSUER`, `_AUDIENCE`, `_KEY_ID` | вы, те же, что на backend LMS |
| `TOKEN_ENC_KEY` | вы, `openssl rand -base64 32` |
| `LIVE_MENTOR_CODE`, `ADMIN_USER`, `ADMIN_PASSWORD` | мы, по защищённому каналу |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | мы, по защищённому каналу |

Секреты не должны попадать в Git, логи CI и чаты.

### 4.5 Данные и бэкап

- Volume `dars-pgdata` и `dars-backups` должны лежать на постоянном диске.
- Дампы из `dars-backups` включить в общий бэкап сервера или раз в неделю копировать в другое место.
- Восстановление: `docker compose exec -T postgres pg_restore -U dars -d dars_prod --clean --if-exists < <dump>`.

### 4.6 Контакт

Кому и в какой канал писать, если проблема во время урока: `______`. Ожидаемое время ответа: 15 минут.

## 5. Первый запуск, по шагам

1. Каталог `/srv/dars-api/staging`, в нём `docker-compose.deploy.yml` и заполненный `.env.deploy` (`DARS_ENV=staging`, `POSTGRES_DB=dars_staging`, `API_PORT=3002`).
2. `docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d --build`
3. `curl http://127.0.0.1:3002/api/v1/health` → `200`, в ответе `checks.db: ok`.
4. Proxy и TLS: `curl https://staging-dars-api.coddycamp.uz/api/v1/health` → `200`.
5. То же для prod: порт 3001, `DARS_ENV=prod`, `POSTGRES_DB=dars_prod`.

## 6. Критерии приёмки, серверная часть

- [ ] Оба адреса снаружи отвечают `200`, `checks.db = ok`.
- [ ] Push в `staging` → pipeline зелёный → staging обновился.
- [ ] Rollback проверен один раз.
- [ ] Мы видим логи и можем перезапустить `api` (п. 4.3).
- [ ] В `dars-backups` появился первый дамп.
- [ ] `.env.deploy` отсутствует в Git и в логах CI.

Вопросы — по номеру пункта этого документа.
