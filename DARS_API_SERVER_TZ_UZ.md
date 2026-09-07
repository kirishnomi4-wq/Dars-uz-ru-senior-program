
# dars-api — server-dasturchi uchun texnik topshiriq

**Sana:** 2026-09-07 · **Kimga:** Coddy Camp LMS server-dasturchisi · **Kimdan:** Dars-platforma jamoasi
**Maqsad:** `dars-api` xizmatini sizning serveringizda Docker'da ishga tushirish, CI/CD orqali yangilash, xatolikni biz o'zimiz ko'rib tuzata oladigan qilish.

---

## 1. Bu nima

`dars-api` — jonli darslar uchun backend. LMS'dagi JSX-dars brauzerdan unga `liveToken` (JWT) yuboradi, u sessiya ochadi, o'quvchilarni guruh bo'yicha kiritadi, ballni hisoblaydi, dars oxirida natijani School API'ga yuboradi.

- Til va kutubxona: Node 22, Fastify 5. Baza: PostgreSQL 16, faqat shu xizmatniki.
- Holat bazada, ilova o'zi holatsiz. Bitta konteyner yetadi.
- Tashqi ulanishlar: brauzerdan `https://lms.coddycamp.uz` (CORS ilova ichida), serverdan `https://school-api.coddycamp.uz`.
- Yuk: bir guruh 30 o'quvchi, har 2,5 soniyada bitta so'rov. 10 guruh bir vaqtda = 120 so'rov/soniya. Sinovda p95 99 ms.

## 2. Serverda qanday turadi

```
brauzer (lms.coddycamp.uz)
   │ HTTPS
   ▼
sizning reverse-proxy  ──►  127.0.0.1:3001  api (konteyner)  ──►  postgres (konteyner, volume)
                            127.0.0.1:3002  api-staging      ──►  postgres-staging
api ──► https://school-api.coddycamp.uz
```

Papkalar: `/srv/dars-api/prod` va `/srv/dars-api/staging`. Har birida `docker-compose.deploy.yml` + `.env.deploy`.

Compose'dagi xizmatlar (biz beramiz):

| Xizmat | Nima qiladi |
|---|---|
| `postgres` | PostgreSQL 16, `dars-pgdata` volume, healthcheck |
| `migrate` | Bir marta yuriydi, sxemani yangilaydi. Xato bo'lsa `api` ko'tarilmaydi |
| `api` | Ilova, port 3001 faqat `127.0.0.1` da, healthcheck, log JSON stdout'ga, rotatsiya 5×20 MB |
| `backup` | Har 24 soatda `pg_dump -Fc` → `dars-backups` volume, 14 kun |

Resurs-limitlar compose'da: api 768 MB, postgres 512 MB, backup 128 MB. Disk ~10 GB.

## 3. Biz beramiz

Repo ichida: `Dockerfile`, `docker-compose.deploy.yml`, `.env.deploy.example`, `.gitlab-ci.yml`, `DOCKER.md`, kod, testlar (unit 45, integratsion 60). Migratsiya va zaxira avtomatik, qo'lda hech narsa kerak emas.

## 4. Sizdan kerak

### 4.1 Subdomen va proksi

| | Prod | Staging |
|---|---|---|
| Manzil | `dars-api.coddycamp.uz` | `staging-dars-api.coddycamp.uz` |
| Proksi → | `http://127.0.0.1:3001` | `http://127.0.0.1:3002` |
| TLS | Let's Encrypt | Let's Encrypt |

Proksi talablari: `X-Forwarded-For` va `X-Forwarded-Proto` uzatilsin, `proxy_read_timeout` kamida 60 s, WebSocket kerak emas. Nginx namunasi:

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

Apache (mod_proxy) bo'lsa, xuddi shuning ekvivalenti:

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

`X-Forwarded-For` ni mod_proxy o'zi qo'shadi. Staging uchun xuddi shu, `staging-dars-api.coddycamp.uz` va port `3002` bilan.

Nega subdomen kerak: dars o'quvchining brauzerida ishlaydi va API'ga brauzerdan murojaat qiladi. Ochiq HTTPS manzilsiz xizmat brauzerdan ko'rinmaydi.

### 4.2 Git va CI/CD

1. GitLab'da `dars-api` loyihasi. Bizning akkauntni **Maintainer** qiling: `______` (email yoki username).
2. Himoyalangan shoxlar: `staging` va `main`.
3. Pipeline biz bergan `.gitlab-ci.yml` bilan: `test` → `build` (image registry'ga, teg = commit SHA) → `deploy`.
4. `deploy` bosqichi: `staging` shoxi → `/srv/dars-api/staging`, `main` → `/srv/dars-api/prod`. Buyruq:
   ```
   IMAGE_TAG=<sha> docker compose -f docker-compose.deploy.yml --env-file .env.deploy pull
   IMAGE_TAG=<sha> docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d
   curl -fsS http://127.0.0.1:3001/api/v1/health
   ```
   Runner serverning o'zida (shell executor) bo'lsa shu buyruqlar yetadi; docker executor bo'lsa SSH orqali, sizga qanday qulay.
5. Rollback: oldingi commit'ning `deploy` bosqichini qayta ishga tushirish (image tegi = SHA, shuning uchun eski versiya har doim bor).

### 4.3 Xatolikni biz o'zimiz ko'rishimiz va tuzatishimiz uchun

Jonli dars paytida muammo chiqsa, sizni kutmasdan logni ko'rib, xizmatni qayta ishga tushira olishimiz kerak. Ikkita variant, biri yetadi:

**Variant A (afzal):** serverda `dars` foydalanuvchisi, SSH faqat kalit bilan, sudo faqat shu buyruqlarga:

```
dars ALL=(root) NOPASSWD: /usr/bin/docker compose -f /srv/dars-api/prod/docker-compose.deploy.yml *
dars ALL=(root) NOPASSWD: /usr/bin/docker compose -f /srv/dars-api/staging/docker-compose.deploy.yml *
```

Bu faqat bizning ikki compose-stack'imizga ta'sir qiladi (`logs`, `ps`, `restart`, `up`), boshqa konteynerlar va fayllarga emas. Ochiq kalitimiz:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKLB1drihGPMNGUx3gSkql4YRzA1slxrYpnQrFU3GdWB azizbekyutub24@gmail.com
```

**Variant B:** SSH'siz. Loglar uchun Dozzle yoki Portainer (faqat bizning konteynerlar, parol bilan), qayta ishga tushirish uchun CI'dagi `deploy` bosqichini qayta yurgizish huquqi. Kamchiligi: qayta ishga tushirish 2–3 daqiqa oladi.

Ikkala variantda ham: `https://<manzil>/api/v1/health` va `https://<manzil>/admin` (basic auth, ilova ichida) tashqaridan ochiq bo'lsin.

### 4.4 Env-fayl va sirlar

Fayl: `/srv/dars-api/prod/.env.deploy` (staging'da ham), egasi `root`, rejim `640`, `dars` guruhi o'qiy oladi. Ro'yxat `.env.deploy.example` da. Siz to'ldiradigan qiymatlar:

| Kalit | Kim beradi |
|---|---|
| `POSTGRES_PASSWORD` | siz, tasodifiy |
| `CODDYCAMP_RESULTS_API_TOKEN`, `CODDYCAMP_CONTEXT_API_TOKEN` | siz, School API'dan |
| `CODDYCAMP_LIVE_JWT_SECRET`, `_ISSUER`, `_AUDIENCE`, `_KEY_ID` | siz, LMS backend bilan bir xil |
| `TOKEN_ENC_KEY` | siz, `openssl rand -base64 32` |
| `LIVE_MENTOR_CODE`, `ADMIN_USER`, `ADMIN_PASSWORD` | biz, xavfsiz kanal orqali |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | biz, xavfsiz kanal orqali |

Sirlar Git'ga, CI-logga, chatga tushmasin.

### 4.5 Ma'lumot va zaxira

- `dars-pgdata` va `dars-backups` volume'lari doimiy diskda bo'lsin.
- `dars-backups` ichidagi dump'lar sizning umumiy server-zaxirangizga kirsin, yoki haftada bir marta boshqa joyga nusxalansin.
- Tiklash: `docker compose exec -T postgres pg_restore -U dars -d dars_prod --clean --if-exists < <dump>`.

### 4.6 Kontakt

Dars vaqtida muammo chiqsa yozadigan odam va kanal: `______`. Kutilgan javob vaqti: 15 daqiqa.

## 5. Birinchi ishga tushirish, qadam-baqadam

1. `/srv/dars-api/staging` papkasi, ichida `docker-compose.deploy.yml` va to'ldirilgan `.env.deploy` (`DARS_ENV=staging`, `POSTGRES_DB=dars_staging`, `API_PORT=3002`).
2. `docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d --build`
3. `curl http://127.0.0.1:3002/api/v1/health` → `200`, javobda `checks.db: ok`.
4. Proksi va TLS: `curl https://staging-dars-api.coddycamp.uz/api/v1/health` → `200`.
5. Xuddi shu prod uchun, port 3001, `DARS_ENV=prod`, `POSTGRES_DB=dars_prod`.

## 6. Qabul mezoni, server qismi

- [ ] Ikkala manzil tashqaridan `200` qaytaradi, `checks.db = ok`.
- [ ] `staging` shoxiga push → pipeline yashil → staging yangilandi.
- [ ] Rollback bir marta sinaldi.
- [ ] Biz logni ko'ra olamiz va `api`ni qayta ishga tushira olamiz (4.3).
- [ ] `dars-backups` da birinchi dump paydo bo'ldi.
- [ ] `.env.deploy` Git'da va CI-logda yo'q.

Savollar bo'lsa shu hujjat bo'yicha band raqami bilan yozing.
