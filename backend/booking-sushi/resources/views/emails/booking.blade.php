<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Xác nhận đặt bàn - Sushi Restaurant</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');

        body {
            font-family: 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #fdf5f0 0%, #f8ede3 100%);
            margin: 0;
            padding: 20px 0;
            line-height: 1.6;
        }

        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(139, 69, 19, 0.15);
            border: 1px solid #e8d5c4;
        }

        .header {
            background: linear-gradient(135deg, #d2691e 0%, #cd853f 50%, #daa520 100%);
            position: relative;
            padding: 40px 30px;
            text-align: center;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="80" r="2.5" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            animation: float 20s infinite linear;
        }

        @keyframes float {
            0% { transform: translateX(-50px) translateY(-50px); }
            100% { transform: translateX(50px) translateY(50px); }
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }

        .header .subtitle {
            margin: 8px 0 0 0;
            font-size: 16px;
            color: #fff8dc;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
            color: #4a3728;
            background: #fefcfa;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #8b4513;
        }

        .greeting strong {
            color: #d2691e;
            font-weight: 600;
        }

        .content h2 {
            margin: 30px 0 20px 0;
            color: #d2691e;
            font-size: 22px;
            font-weight: 600;
            border-bottom: 2px solid #f4e4d6;
            padding-bottom: 10px;
        }

        .info-card {
            background: linear-gradient(135deg, #fff8f0 0%, #fef5eb 100%);
            border: 1px solid #e8d5c4;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            box-shadow: 0 4px 12px rgba(139, 69, 19, 0.08);
        }

        .info-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .info-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0e6d6;
            font-size: 16px;
        }

        .info-list li:last-child {
            border-bottom: none;
        }

        .info-list .label {
            font-weight: 600;
            color: #8b4513;
            min-width: 140px;
        }

        .info-list .value {
            color: #4a3728;
            font-weight: 500;
            text-align: right;
        }

        .highlight-value {
            background: linear-gradient(135deg, #d2691e, #daa520);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        .message-box {
            background: linear-gradient(135deg, #fff8dc 0%, #f5deb3 100%);
            border-left: 4px solid #d2691e;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
            font-style: italic;
            color: #8b4513;
        }

        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e8d5c4;
            color: #8b4513;
            font-weight: 500;
        }

        .footer {
            background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
            text-align: center;
            padding: 25px 30px;
            color: #f5deb3;
            font-size: 14px;
            position: relative;
        }

        .footer::before {
            content: '🍣';
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }

        .footer::after {
            content: '🍣';
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }

        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #d2691e 50%, transparent 100%);
            margin: 20px 0;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 0 10px;
                border-radius: 12px;
            }

            .header, .content, .footer {
                padding: 25px 20px;
            }

            .header h1 {
                font-size: 24px;
            }

            .info-list li {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }

            .info-list .value {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Xác nhận đặt bàn thành công</h1>
            <p class="subtitle">Cảm ơn bạn đã tin tưởng lựa chọn chúng tôi</p>
        </div>

        <div class="content">
            <p class="greeting">Xin chào <strong>{{ $order->customer->name }}</strong>,</p>

            <p>Chúng tôi rất vui mừng xác nhận rằng việc đặt bàn của bạn tại <strong>{{ config('app.name') }}</strong> đã được thực hiện thành công. Chúng tôi cam kết mang đến cho bạn một trải nghiệm ẩm thực tuyệt vời.</p>

            <div class="divider"></div>

            <h2>Thông tin đặt bàn</h2>

            <div class="info-card">
                <ul class="info-list">
                    <li>
                        <span class="label">Mã đơn hàng:</span>
                        <span class="value highlight-value">#{{ $order->id }}</span>
                    </li>
                    <li>
                        <span class="label">Ngày:</span>
                        <span class="value">{{ \Carbon\Carbon::parse($date)->format('d/m/Y') }}</span>
                    </li>
                    <li>
                        <span class="label">Giờ:</span>
                        <span class="value">{{ $time }}</span>
                    </li>
                    <li>
                        <span class="label">Bàn:</span>
                        <span class="value">{{ implode(', ', $tables) }}</span>
                    </li>
                    <li>
                        <span class="label">Tổng tiền:</span>
                        <span class="value highlight-value">{{ number_format($order->total_price, 0, ',', '.') }} VNĐ</span>
                    </li>
                    <li>
                        <span class="label">Thanh toán:</span>
                        <span class="value">{{ strtoupper($order->payment_method === 'vnpay' ? 'VNPay' : 'Tại nhà hàng') }}</span>
                    </li>
                </ul>
            </div>

            <div class="message-box">
                <strong>Lưu ý quan trọng:</strong> Vui lòng đến đúng giờ đã đặt để đảm bảo trải nghiệm tốt nhất. Nếu có bất kỳ thay đổi nào, xin vui lòng liên hệ với chúng tôi trước 2 giờ.
            </div>

            <p>Chúng tôi rất mong được phục vụ bạn và mang đến những món ăn tuyệt vời nhất!</p>

            <div class="signature">
                <p>Trân trọng,<br>
                <strong>{{ config('app.name') }}</strong><br>
                <em>Đội ngũ phục vụ chuyên nghiệp</em></p>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }} - Nơi hội tụ tinh hoa ẩm thực Nhật Bản</p>
        </div>
    </div>
</body>
</html>
