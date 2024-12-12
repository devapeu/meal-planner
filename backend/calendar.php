<?php

require_once 'db.php';

// Add a meal to a day in the calendar
function addMealToDay($date, $meal) {
    $sql = "INSERT INTO calendar (date, meal) VALUES (:date, :meal)";
    queryDatabase($sql, ['date' => $date, 'meal' => $meal]);
    getCalendarDay($date);
}

function getMealsForWeek($startDate) {
    // Calculate end date (Sunday) by adding 6 days to the start date (Monday)
    $endDate = date('Y-m-d', strtotime($startDate . ' +6 days'));

    $sql = "SELECT date, meal FROM calendar WHERE date >= :startDate AND date <= :endDate ORDER BY date";
    $stmt = queryDatabase($sql, ['startDate' => $startDate, 'endDate' => $endDate]);
    $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['calendar' => $meals]);
}
?>