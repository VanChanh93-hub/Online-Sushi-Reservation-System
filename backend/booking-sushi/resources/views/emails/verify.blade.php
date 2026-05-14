<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Xác nhận Email - Takumi</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f6f2;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #fff8f3;
            border: 1px solid #e0d3c2;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
            background-color: #8b5e3c;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #5a3e2b;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background-color: #d4a373;
            color: white !important;
            padding: 12px 24px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
        }
        .btn:hover {
            background-color: #b5835a;
        }
        .footer {
            background-color: #f1e4d3;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #7a5c44;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Xác nhận Email của bạn</h1>
        </div>
        <div class="content">
            <p>Xin chào,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Takumi</strong>.</p>
            <p>Vui lòng nhấn vào nút bên dưới để xác nhận email và kích hoạt tài khoản của bạn:</p>
            <p style="text-align: center;">
                <a href="{{ $verifyUrl }}" class="btn">Xác nhận Email</a>
            </p>
            <p>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br>Takumi</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Takumi - Mang đến trải nghiệm ẩm thực ấm áp và sang trọng.
        </div>
    </div>
</body>
</html>
