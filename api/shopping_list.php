<?php

require_once 'db.php';

// Get the shopping list
function getShoppingList() {
    $sql = "SELECT * FROM shopping_list ORDER BY position ASC";
    $stmt = queryDatabase($sql);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['shopping_list' => array_map(fn($item) => [
        'id' => $item['id'],
        'item' => $item['item']
    ], $items)]);
}

// Add an item to the shopping list
function addItemToShoppingList($item) {
    // Get max position
    $sql = "SELECT COALESCE(MAX(position), 0) + 1 as next_pos FROM shopping_list";
    $stmt = queryDatabase($sql);
    $nextPos = $stmt->fetch(PDO::FETCH_ASSOC)['next_pos'];
    
    $sql = "INSERT INTO shopping_list (item, position) VALUES (:item, :position)";
    queryDatabase($sql, ['item' => $item, 'position' => $nextPos]);
    getShoppingList();
}

function updateItemInShoppingList($id, $item) {
    $sql = "UPDATE shopping_list SET item = :item WHERE id = :id";
    queryDatabase($sql, ['item' => $item, 'id' => $id]);
    getShoppingList();
}

// Remove an item from the shopping list
function removeItemFromShoppingList($item_id) {
    $sql = "DELETE FROM shopping_list WHERE id = :id";
    queryDatabase($sql, ['id' => $item_id]);
    getShoppingList();
}

function removeAllItemsFromShoppingList() {
    $sql = "DELETE FROM shopping_list";
    queryDatabase($sql);
    getShoppingList();
}

function reorderShoppingList($items) {
    if (!is_array($items)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid payload']);
        exit;
    }

    $ids = [];
    $caseParts = [];
    $params = [];

    foreach ($items as $index => $it) {
        $id = (int)($it['id'] ?? 0);
        if ($id <= 0) continue;
        $ids[] = $id;
        $caseParts[] = "WHEN id = ? THEN ?";
        $params[] = $id;
        $params[] = $index + 1;
    }

    if (empty($ids)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid item ids provided']);
        exit;
    }

    $caseSql = implode(' ', $caseParts);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $params = array_merge($params, $ids);

    $sql = "UPDATE shopping_list
            SET position = CASE $caseSql END
            WHERE id IN ($placeholders)";

    queryDatabase($sql, $params);

    getShoppingList();
}

?>
