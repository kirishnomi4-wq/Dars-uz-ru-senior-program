1) Ha, bog'langan: har bir xabar yuboruvchi va qabul qiluvchi foydalanuvchiga tegishli.
2) Ha, shakl qat'iy: barcha foydalanuvchilar va barcha xabarlar bir xil maydonlarga ega.
3) Yo'q, to'g'ridan-to'g'ri pul yoki buyurtmaga zarar yetmaydi, lekin xabar yo'qolishi yoki noto'g'ri bog'lanishi nojo'ya bo'ladi.
4) Hajm oshishi mumkin, ammo indekslar bilan PostgreSQL bunday yuklamani yaxshi ko'taradi.

**Tanlov: PostgreSQL.** Sabab: ma'lumotlar o'zaro bog'langan va shakli qat'iy, shuning uchun bog'lanishlarni chet kalitlar (REFERENCES) bilan majburlash mumkin.

```sql
CREATE TABLE users (
    id            BIGSERIAL    PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE messages (
    id          BIGSERIAL   PRIMARY KEY,
    sender_id   BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_sender   ON messages (sender_id);
CREATE INDEX idx_messages_receiver ON messages (receiver_id);
```
