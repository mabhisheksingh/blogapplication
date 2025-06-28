<html>
<head>
  <link rel="stylesheet" type="text/css" href="../resources/email.css" />
</head>
<body>
  <div class="container" style="background: #fffbe9; border-radius: 12px; box-shadow: 0 2px 8px #e0e0e0; padding: 32px; max-width: 520px; margin: 40px auto;">
    <img src="../img/blog-logo.jpg" alt="Blog Logo" style="display: block; margin: 0 auto 24px; width: 120px; border-radius: 8px;" />
    <h2 style="color: #2d3a4a;">Welcome to BlogFusion!</h2>
    <p style="font-size: 17px; color: #444;">Hi ${user.firstName?if_exists},</p>
    <p style="font-size: 16px; color: #555;">We're excited to have you join <b>BlogFusion</b> — the place where stories come alive and voices are heard!</p>
    <div style="margin: 28px 0; text-align: center;">
      <a href="${link}" class="btn" style="background: #ffb347; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 18px;">Verify Your Email</a>
    </div>
    <p style="color: #666;">Share your first post, discover trending topics, and connect with fellow bloggers from around the world.</p>
    <div style="margin: 20px 0; text-align: center;">
      <img src="../img/blog-community.jpg" alt="Blog Community" style="width: 90%; border-radius: 8px; box-shadow: 0 1px 4px #eee;" />
    </div>
    <p style="color: #888; font-size: 13px;">If you did not create this account, you can safely ignore this email.<br>This link will expire within 12 hours.</p>
    <div class="footer" style="margin-top: 32px; color: #aaa; font-size: 13px;">
      <p>BlogFusion Team<br />Contact: support@blogfusion.com</p>
    </div>
  </div>
</body>
</html>
