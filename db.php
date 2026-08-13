<?php
$host     = "localhost";
$username = "siganga_user";
$password = "FarmPassword123!";
$dbname   = "siganga_farm";

// Create MySQLi connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Set charset to utf8mb4 for proper character encoding
$conn->set_charset("utf8mb4");
?>