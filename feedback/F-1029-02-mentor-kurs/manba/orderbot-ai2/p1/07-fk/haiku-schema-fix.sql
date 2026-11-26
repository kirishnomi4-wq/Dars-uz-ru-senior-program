CREATE TABLE users (
        telegram_id bigint PRIMARY KEY,
        name varchar(255) NOT NULL,
        phone varchar(32),
        role varchar(16) NOT NULL DEFAULT 'customer'
          CHECK (role IN ('customer', 'admin')),
        state varchar(16) NOT NULL DEFAULT 'IDLE'
          CHECK (state IN ('IDLE', 'WAITING_PHONE'))
      );
CREATE TABLE products (
        id serial PRIMARY KEY,
        name varchar(255) NOT NULL,
        price integer NOT NULL CHECK (price >= 0),
        stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0)
      );
CREATE TABLE cart_items (
        id serial PRIMARY KEY,
        telegram_id bigint NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
        product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        qty integer NOT NULL CHECK (qty > 0),
        CONSTRAINT uq_cart_item UNIQUE (telegram_id, product_id)
      );
