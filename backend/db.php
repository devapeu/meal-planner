<?php

require_once 'config.php';

// Function to query the database
function queryDatabase($sql, $params = []) {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}
?>
