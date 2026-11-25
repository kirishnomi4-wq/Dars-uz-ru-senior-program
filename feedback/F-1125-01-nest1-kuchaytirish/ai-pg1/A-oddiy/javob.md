**Tavsiya: PostgreSQL.** Oddiy chat ilovasi odatda foydalanuvchilar, suhbatlar va xabarlar o'rtasidagi bog'lanishlarga tayanadi. Postgres bunday bog'lanishlarni JOIN va tashqi kalitlar bilan aniq saqlaydi, xabarlarni vaqt bo'yicha tartiblash va o'qilmagan xabarlarni sanash oson bo'ladi, hamda ma'lumot izchilligini (masalan, xabar faqat mavjud suhbatga yozilishini) bazaning o'zi kafolatlaydi.

MongoDB ham ishlaydi, lekin u xabarlarning sxemasi tez-tez o'zgaradigan, hujjatlari bir-biriga kam bog'liq loyihalarda qulayroq. Sizning chat ilovangizda bunday ehtiyoj ko'rinmaydi.

**Jadvallar (PostgreSQL):**

```sql
-- Foydalanuvchilar
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Suhbatlar (shaxsiy yoki guruh)
CREATE TABLE conversations (
  id          BIGSERIAL PRIMARY KEY,
  title       VARCHAR(100),              -- guruh nomi; shaxsiy chatda NULL
  is_group    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Qaysi foydalanuvchi qaysi suhbatda
CREATE TABLE conversation_members (
  conversation_id      BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id              BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_message_id BIGINT,           -- o'qilmagan xabarlar sonini hisoblash uchun
  PRIMARY KEY (conversation_id, user_id)
);

-- Xabarlar
CREATE TABLE messages (
  id              BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       BIGINT NOT NULL REFERENCES users(id),
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at       TIMESTAMPTZ,
  is_deleted      BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indekslar: tez yuklash uchun
CREATE INDEX idx_messages_conv_id ON messages (conversation_id, id DESC);
CREATE INDEX idx_members_user      ON conversation_members (user_id);
```

**Qisqacha tuzilma:**
- `users` 1 — ko'p `conversation_members` — ko'p `conversations` (ko'pdan-ko'pga bog'lanish `conversation_members` orqali)
- `conversations` 1 — ko'p `messages`
- `messages.sender_id` xabar muallifini ko'rsatadi

**Eslatma:** Agar keyinchalik fayl yoki rasm biriktirish kerak bo'lsa, `attachments` jadvalini (`message_id`, `url`, `mime_type`) qo'shish mumkin. Xabar ro'yxatini sahifalab yuklashda `OFFSET` o'rniga `id` bo'yicha kursordan foydalaning.
