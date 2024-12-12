<?php

require_once 'calendar.php';
require_once 'shopping_list.php';
require_once 'recipes.php';

$request_method = $_SERVER["REQUEST_METHOD"];
$uri = $_SERVER['REQUEST_URI'];

header('Content-Type: application/json');

// Calendar routes
if (preg_match('/^\/calendar\/([\d\-]+)$/', $uri, $matches)) {
    $date = $matches[1];
    if ($request_method == 'GET') {
        getCalendarDay($date);
    } elseif ($request_method == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        addMealToDay($date, $data['meal']);
    }
}

// Shopping list routes
elseif ($uri == '/shopping-list') {
    if ($request_method == 'GET') {
        getShoppingList();
    } elseif ($request_method == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        addItemToShoppingList($data['item']);
    }
}

// Remove or reorder items in the shopping list
elseif (preg_match('/^\/shopping-list\/(\d+)$/', $uri, $matches)) {
    $item_id = (int)$matches[1];
    if ($request_method == 'DELETE') {
        removeItemFromShoppingList($item_id);
    } elseif ($request_method == 'PUT') {
        moveItemUpInList($item_id);
    }
}

// Recipes routes
elseif ($uri == '/recipes') {
    if ($request_method == 'GET') {
        getRecipes();
    } elseif ($request_method == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        addRecipe($data['name'], $data['ingredients'], $data['instructions']);
    }
}

elseif (preg_match('/^\/recipes\/(\d+)$/', $uri, $matches)) {
    $recipe_id = (int)$matches[1];
    if ($request_method == 'GET') {
        getRecipe($recipe_id);
    }
}

// Recipes delete route
elseif (preg_match('/^\/recipes\/(\d+)$/', $uri, $matches)) {
  $recipe_id = (int)$matches[1];
  if ($request_method == 'DELETE') {
      deleteRecipe($recipe_id);
  }
}

// Invalid endpoint
else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
?>
