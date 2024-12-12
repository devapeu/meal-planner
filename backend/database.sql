CREATE DATABASE meal_planner;

USE meal_planner;

-- Calendar table to store meals for each day
CREATE TABLE calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    recipe_id INT,
    meal VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- Shopping list table to store items
CREATE TABLE shopping_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(255) NOT NULL
);

-- Recipes table to store recipes with ingredients and instructions
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL
);
