<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Update Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px;">
    <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e0e0; padding: 32px;">
        <h2 style="color: #333;">Email Updated</h2>
        <p>Hello ${user.firstName?if_exists} ${user.lastName?if_exists},</p>
        <p>Your email address for <b>${realmName}</b> was successfully updated.</p>
        <p>If you did not request this change, please contact support immediately.</p>
        <p style="margin-top: 32px; color: #888; font-size: 13px;">Thank you,<br>${realmName} Team</p>
    </div>
</body>
</html>
