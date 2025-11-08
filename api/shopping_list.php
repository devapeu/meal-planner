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
    try {
        $pdo = getPDO();        
        $pdo->beginTransaction();

        foreach ($items as $index => $item) {
            $sql = "UPDATE shopping_list SET position = :position WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'position' => $index + 1,
                'id' => $item['id']
            ]);
        }

        $pdo->commit();
        getShoppingList();
    } catch (Exception $e) {
        if ($pdo && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Failed to reorder items: ' . $e->getMessage()]);
        exit;
    }
}

?>
