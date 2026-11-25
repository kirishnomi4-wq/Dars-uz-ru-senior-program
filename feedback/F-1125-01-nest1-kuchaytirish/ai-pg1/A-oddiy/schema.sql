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
