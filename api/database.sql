DROP TABLE IF EXISTS calendar;
DROP TABLE IF EXISTS shopping_list;
DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    meal VARCHAR(255) NOT NULL,
    recipe_id INT NULL,
    CONSTRAINT calendar_recipe_fk
        FOREIGN KEY (recipe_id) REFERENCES recipes(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE shopping_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    KEY shopping_list_position_idx (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
