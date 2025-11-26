<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New contact message</title>
</head>
<body>
    <p>You received a new contact message from your portfolio landing page.</p>

    <p><strong>Name:</strong> {{ $messageModel->name }}</p>
    <p><strong>Email:</strong> {{ $messageModel->email }}</p>

    <p><strong>Message:</strong></p>
    <p>{{ $messageModel->message }}</p>
</body>
</html>
