<?php

require_once 'db.php';

// Get all recipes
function getRecipes() {
    $sql = "SELECT * FROM recipes";
    $stmt = queryDatabase($sql);
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['recipes' => $recipes]);
}

// Add a new recipe
function addRecipe($name, $ingredients, $instructions) {
    $sql = "INSERT INTO recipes (name, ingredients, instructions) VALUES (:name, :ingredients, :instructions)";
    queryDatabase($sql, ['name' => $name, 'ingredients' => $ingredients, 'instructions' => $instructions]);
    getRecipes();
}

function deleteRecipe($id) {
  $sql = "DELETE FROM recipes WHERE id = :id";
  queryDatabase($sql, ['id' => $id]);
  getRecipes(); // Optionally return the updated list of recipes
}

?>
