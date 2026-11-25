CREATE TABLE users (
    id            BIGSERIAL    PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE messages (
    id          BIGSERIAL   PRIMARY KEY,
    sender_id   BIGINT      NOT NULL REFERENCES users(id),
    receiver_id BIGINT      NOT NULL REFERENCES users(id),
    body        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_sender   ON messages (sender_id);
CREATE INDEX idx_messages_receiver ON messages (receiver_id);
