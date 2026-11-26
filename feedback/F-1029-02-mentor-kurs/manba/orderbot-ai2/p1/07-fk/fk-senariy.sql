INSERT INTO users (telegram_id, name) VALUES (5123456789, 'Aziza');
INSERT INTO products (name, price, stock) VALUES ('Kolonka', 50000, 5);
INSERT INTO cart_items (telegram_id, product_id, qty) VALUES (5123456789, 1, 1);
INSERT INTO cart_items (telegram_id, product_id, qty) VALUES (999, 1, 1);
DELETE FROM users WHERE telegram_id = 5123456789;
SELECT telegram_id, product_id, qty FROM cart_items;
