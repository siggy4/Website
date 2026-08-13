<?php
require_once 'db.php';

$subscribersResult = $conn->query("SELECT * FROM premium_subscribers ORDER BY subscribed_at DESC");
$messagesResult    = $conn->query("SELECT * FROM contact_messages ORDER BY sent_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Siganga Family Farm - Admin Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fcf5ed; color: #2a4736; padding: 30px; }
        h1 { color: #2a4736; border-bottom: 3px solid #fab839; padding-bottom: 10px; }
        h2 { color: #2a4736; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #cbd2cc; }
        th { background-color: #2a4736; color: #ffffff; }
        tr:nth-child(even) { background-color: #fdfbf7; }
        tr:hover { background-color: #f0e6d2; }
    </style>
</head>
<body>
    <h1>Siganga Family Farm - System Records</h1>

    <h2>Premium Subscribers</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Plan Type</th>
                <th>Address</th>
                <th>Subscribed At</th>
            </tr>
        </thead>
        <tbody>
            <?php if ($subscribersResult && $subscribersResult->num_rows > 0): ?>
                <?php while($row = $subscribersResult->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['id']) ?></td>
                        <td><?= htmlspecialchars($row['full_name']) ?></td>
                        <td><?= htmlspecialchars($row['email']) ?></td>
                        <td><?= htmlspecialchars($row['plan_type']) ?></td>
                        <td><?= htmlspecialchars($row['delivery_address']) ?></td>
                        <td><?= htmlspecialchars($row['subscribed_at']) ?></td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="6">No premium subscribers recorded yet.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <h2>Contact Messages</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Sent At</th>
            </tr>
        </thead>
        <tbody>
            <?php if ($messagesResult && $messagesResult->num_rows > 0): ?>
                <?php while($row = $messagesResult->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['id']) ?></td>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= htmlspecialchars($row['email']) ?></td>
                        <td><?= htmlspecialchars($row['subject']) ?></td>
                        <td><?= htmlspecialchars($row['message']) ?></td>
                        <td><?= htmlspecialchars($row['sent_at']) ?></td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="6">No contact messages recorded yet.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>
<?php $conn->close(); ?>