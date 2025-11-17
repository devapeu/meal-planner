<?php

require_once 'db.php';

// Get all recipes
function getRecipes() {
    $sql = "SELECT * FROM recipes";
    $stmt = queryDatabase($sql);
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['recipes' => $recipes]);
}

function getRecipe($recipe_id) {
    $sql = "SELECT * FROM recipes WHERE id = :id";
    $stmt = queryDatabase($sql, ['id' => $recipe_id]);
    $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['recipe' => $recipe]);
}

// Add a new recipe
function addRecipe($name, $content) {
    $sql = "INSERT INTO recipes (name, content) VALUES (:name, :content)";
    queryDatabase($sql, ['name' => $name, 'content' => $content]);
    getRecipes();
}

function updateRecipe($id, $name, $content) {
    $sql = "UPDATE recipes SET name = :name, content = :content WHERE id = :id";
    queryDatabase($sql, ['id' => $id, 'name' => $name, 'content' => $content]);
    getRecipes();
}

function deleteRecipe($id) {
  $sql = "DELETE FROM recipes WHERE id = :id";
  queryDatabase($sql, ['id' => $id]);
  getRecipes(); // Optionally return the updated list of recipes
}

?>
