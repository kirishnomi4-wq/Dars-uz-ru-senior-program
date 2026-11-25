-- Mentor sinovi (B sxemasi). Odatiy yozuvlar:
INSERT INTO users (username, email, password_hash) VALUES ('ali', 'ali@mail.uz', 'x'), ('vali', 'vali@mail.uz', 'x');
INSERT INTO messages (sender_id, receiver_id, body) VALUES (1, 2, 'Salom!'), (2, 1, 'Va alaykum!');
-- Kutilmagan 1: yo'q foydalanuvchiga xabar
INSERT INTO messages (sender_id, receiver_id, body) VALUES (1, 99, 'Kimga ketdi?');
-- Kutilmagan 2: bo'sh matn — NULL va ''
INSERT INTO messages (sender_id, receiver_id, body) VALUES (1, 2, NULL);
INSERT INTO messages (sender_id, receiver_id, body) VALUES (1, 2, '');
-- Kutilmagan 3: takror username
INSERT INTO users (username, email, password_hash) VALUES ('ali', 'boshqa@mail.uz', 'y');
-- Kutilmagan 4: o'ziga o'zi xabar
INSERT INTO messages (sender_id, receiver_id, body) VALUES (1, 1, 'O''zimga');
-- Kutilmagan 5: xabari bor foydalanuvchini o'chirish — vali'ning yozishmasi nima bo'ladi?
SELECT count(*) AS vali_xabarlari_oldin FROM messages WHERE sender_id = 2 OR receiver_id = 2;
DELETE FROM users WHERE username = 'ali';
SELECT count(*) AS vali_xabarlari_keyin FROM messages WHERE sender_id = 2 OR receiver_id = 2;
-- Qo'shimcha (eslatma uchun): bo'sh matnni ham baza to'xtatsin — CHECK
ALTER TABLE messages ADD CHECK (trim(body) <> '');
DELETE FROM messages WHERE trim(body) = '';
ALTER TABLE messages ADD CHECK (trim(body) <> '');
INSERT INTO messages (sender_id, receiver_id, body) VALUES (2, 1, '');
INSERT INTO messages (sender_id, receiver_id, body) VALUES (2, 1, '   ');
