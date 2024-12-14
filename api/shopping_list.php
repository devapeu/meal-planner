<?php

require_once 'db.php';

// Get the shopping list
function getShoppingList() {
    $sql = "SELECT * FROM shopping_list ORDER BY id ASC";
    $stmt = queryDatabase($sql);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['shopping_list' => array_map(fn($item) => [
        'id' => $item['id'],
        'item' => $item['item']
    ], $items)]);
}

// Add an item to the shopping list
function addItemToShoppingList($item) {
    $sql = "INSERT INTO shopping_list (item) VALUES (:item)";
    queryDatabase($sql, ['item' => $item]);
    getShoppingList();
}

// Remove an item from the shopping list
function removeItemFromShoppingList($item_id) {
    $sql = "DELETE FROM shopping_list WHERE id = :id";
    queryDatabase($sql, ['id' => $item_id]);
    getShoppingList();
}

// Move an item up in the list
function moveItemUpInList($item_id) {
    // Get the current position of the item
    $sql = "SELECT id FROM shopping_list WHERE id = :id";
    $stmt = queryDatabase($sql, ['id' => $item_id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        // Swap with the previous item if not already at the top
        $sql = "UPDATE shopping_list
                SET id = (SELECT id FROM shopping_list WHERE id = :prev_id)
                WHERE id = :id";
        queryDatabase($sql, ['id' => $item_id, 'prev_id' => $item_id - 1]);
    }
    getShoppingList();
}
?>
