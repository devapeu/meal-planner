<?php

require_once 'db.php';

// Get meals for a specific day
function getCalendarDay($date) {
    $sql = "SELECT meal FROM calendar WHERE date = :date";
    $stmt = queryDatabase($sql, ['date' => $date]);
    $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([$date => array_map(fn($meal) => $meal['meal'], $meals)]);
}

// Add a meal to a day in the calendar
function addMealToDay($date, $meal) {
    $sql = "INSERT INTO calendar (date, meal) VALUES (:date, :meal)";
    queryDatabase($sql, ['date' => $date, 'meal' => $meal]);
    getCalendarDay($date);
}
?>
