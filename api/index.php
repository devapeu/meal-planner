<?php

require_once 'calendar.php';
require_once 'shopping_list.php';
require_once 'recipes.php';
require_once 'cors.php';

cors();

$request_method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

header('Content-Type: application/json');

// Calendar routes

if (preg_match('/^\/calendar\/(\d+)$/', $uri, $matches)) {
    $item_id = (int)$matches[1];
    $startDate = $_GET['startDate'];
    if ($request_method == 'DELETE') {
        deleteMeal($item_id, $startDate);
    }
}

if ($uri == '/calendar') {
    if ($request_method == 'GET') {
        $startDate = $_GET['startDate'];
        getMealsForWeek($startDate);
    } elseif ($request_method == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        addMealToDay($data['meal'], $data['startDate'], $data['endDate']);
    }
}

// Shopping list routes
elseif ($uri == '/shopping-list') {
    if ($request_method == 'GET') {
        getShoppingList();
    } elseif ($request_method == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        addItemToShoppingList($data['item']);
    } elseif($request_method = 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        updateItemInShoppingList($data['id'], $data['item']);
    } elseif ($request_method == 'DELETE') {
        removeAllItemsFromShoppingList();
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
    } elseif ($request_method == 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        updateRecipe($recipe_id, $data['name'], $data['ingredients'], $data['instructions']);
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
