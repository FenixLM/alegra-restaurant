CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_status VARCHAR(50) NOT NULL CHECK (order_status IN ('pending', 'in_progress', 'completed', 'failed')),
    recipe_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    quantity INT DEFAULT 5 CHECK (quantity >= 0)
);

CREATE TABLE market_purchases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    quantity INT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_id SERIAL REFERENCES orders(id) ON DELETE CASCADE
);

INSERT INTO public.ingredients (name, quantity) VALUES
    ('tomato', 5),
    ('lemon', 5),
    ('potato', 5),
    ('rice', 5),
    ('ketchup', 5),
    ('lettuce', 5),
    ('onion', 5),
    ('cheese', 5),
    ('meat', 5),
    ('chicken', 5);