<?php
header('Content-Type: application/json');
require_once 'db.php';

// Ensure request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed. Use POST."]);
    exit;
}

// Extract and sanitize inputs
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$planType = isset($_POST['planType']) ? trim($_POST['planType']) : '';
$address  = isset($_POST['address']) ? trim($_POST['address']) : '';

// Validation checks
if (empty($fullName) || empty($email) || empty($planType)) {
    http_response_code(400);
    echo json_encode(["error" => "Full name, email, and plan type are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Please provide a valid email address."]);
    exit;
}

// Insert into database using prepared statement
$sql = "INSERT INTO premium_subscribers (full_name, email, plan_type, delivery_address) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("ssss", $fullName, $email, $planType, $address);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Welcome to Siganga Family Farm Premium Membership!",
            "id"      => $stmt->insert_id
        ]);
    } else {
        // Handle duplicate email error (MySQL error code 1062)
        if ($stmt->errno === 1062) {
            http_response_code(400);
            echo json_encode(["error" => "This email is already subscribed to a premium plan!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare query."]);
}

$conn->close();
?>