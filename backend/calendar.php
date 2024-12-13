<?php

require_once 'db.php';

// Add a meal to a day in the calendar
function addMealToDay($meal, $startDate, $endDate) {
    $sql = "INSERT INTO calendar (start_date, end_date, meal) VALUES (:startDate, :endDate, :meal)";
    queryDatabase($sql, ['startDate' => $startDate, 'endDate' => $endDate, 'meal' => $meal]);
}

function getMealsForWeek($startDate) {
    $monday = date('Y-m-d', strtotime('monday this week', strtotime($startDate)));
    $sunday = date('Y-m-d', strtotime($monday . ' +6 days'));

    $sql = "SELECT id, meal, start_date, end_date FROM calendar 
            WHERE (start_date <= :sunday AND end_date >= :monday)
            ORDER BY start_date";
    $stmt = queryDatabase($sql, ['monday' => $monday, 'sunday' => $sunday]);
    $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['calendar' => $meals]);
}
?>