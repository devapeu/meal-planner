<?php

require_once 'config.php';

function cors() {
  global $config;
  header('Access-Control-Allow-Origin: ' . $config['FRONTEND_URL']);
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Accept');

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      exit(0);
  }
}

?>
