-- Mentor sinovi (A sxemasi). Odatiy yozuvlar:
INSERT INTO users (username, password_hash) VALUES ('ali', 'x'), ('vali', 'x');
INSERT INTO conversations (title) VALUES (NULL);
INSERT INTO conversation_members (conversation_id, user_id) VALUES (1, 1), (1, 2);
INSERT INTO messages (conversation_id, sender_id, body) VALUES (1, 1, 'Salom!');
-- Kutilmagan 1: yo'q foydalanuvchidan xabar
INSERT INTO messages (conversation_id, sender_id, body) VALUES (1, 99, 'Men kimman?');
-- Kutilmagan 2: bo'sh matn — NULL va ''
INSERT INTO messages (conversation_id, sender_id, body) VALUES (1, 1, NULL);
INSERT INTO messages (conversation_id, sender_id, body) VALUES (1, 1, '');
-- Kutilmagan 3: takror username
INSERT INTO users (username, password_hash) VALUES ('ali', 'y');
-- Kutilmagan 4: suhbatda yo'q foydalanuvchi o'sha suhbatga yozadi (sardor a'zo emas)
INSERT INTO users (username, password_hash) VALUES ('sardor', 'x');
INSERT INTO messages (conversation_id, sender_id, body) VALUES (1, 4, 'Men bu suhbatda yo''qman');
-- Kutilmagan 5: xabari bor foydalanuvchini o'chirish
DELETE FROM users WHERE username = 'ali';
SELECT m.id, u.username, m.body FROM messages m JOIN users u ON u.id = m.sender_id ORDER BY m.id;
