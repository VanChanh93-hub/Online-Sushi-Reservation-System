lấy ra danh sách món ăn GET
http://127.0.0.1:8000/api/food

==============================

đăng nhập bằng mail GET
http://127.0.0.1:8000/api/auth/google/redirect
http://127.0.0.1:8000/api/auth/google/callback

=======================

Quên mật khẩu POST
http://127.0.0.1:8000/api/forgot-password // gửi mail
{
"email": "nhapmail"
}

http://127.0.0.1:8000/api/reset-password POST
{
"email": "user@example.com",
"code": "codemail",
"password": "newpassword"
}

====================
Đặt bàn không kèm món
http://127.0.0.1:8000/api/orders/bookTables POST
{
"customer_id": 1,
"guest_count": 4,
"reservation_date": "2024-01-25",
"reservation_time": "18:00:00",
"payment_method": "cash",
"total_price": 500000,
"note": "bàn sinh nhật"
}

Đặt bàn kèm món và combo
http://127.0.0.1:8000/api/orders/bookTables POST

{
"customer_id": 1,
"guest_count": 6,
"reservation_date": "2025-01-25",
"reservation_time": "19:00:00",
"payment_method": "momo",
"total_price": 850000,
"note": "bàn sinh nhật",
"foods": [
{
"food_id": 1,
"quantity": 2,
"price": 150000
},
{
"food_id": 2,
"quantity": 1,
"price": 200000
}
],
"combos": [
{
"combo_id": 1,
"quantity": 1,
"price": 500000
}
]
}

==================
lấy danh sách giờ và bàn trống dựa vào số ngày GET

http://127.0.0.1:8000/api/tables/available-times?reservation_date=2025-07-02

===========================================

lấy danh sách món ăn theo category và food_group của food GET
http://127.0.0.1:8000/api/foods/category/{id_cate}/groups

======================
Đăng nhập POST
http://127.0.0.1:8000/api/login

{
"name": "Test User",
"email": "test@example.com",
"password": "password123",
"phone": "0123456789"
}
======================
Đăng Ký POST
{
"email": "test@example.com",
"password": "password123"
}

=====================
xem lịch sử dơn hàng
http://127.0.0.1:8000/api/orders/history/{id_customer} GET

huỷ đơn hàng
http://127.0.0.1:8000/api/orders/cancel/{id_order} POST

flow dùng tích điểm
update status của order
http://127.0.0.1:8000/api/order/update-status/{id}
{
"status":"success"
}
khi đơn hàng thành công => tự động tích điểm, check rank dựa vào điểm

flow dùng voucher khi quay vòng may mắn
khi quay xong thì client gửi id (customer và voucher) để lưu
http://127.0.0.1:8000/api/themVoucherWheel POST
{
"customer_id": 1,
"voucher_id": 1
}

flow sử dung voucher
trong lúc đặt hàng nhập voucher click sử dụng gửi về BE check mã voucher trả về kq (thành công thì trả về số tiền dc giảm)
http://127.0.0.1:8000/api/applyVoucher POST
{
"code": "SUMMER2025",
"customer": 4,
"total":300000
}
lấy ra voucher của user
http://127.0.0.1:8000/api/getAllVoucherByUser/{id} get

lấy all voucher dành cho khách hàng
http://127.0.0.1:8000/api/voucherForCustomer get


==================
Feedback

http://localhost:8000/api/feedbacks  GET lấy ra tất cả feedback


http://localhost:8000/api/feedbacks POST feedback khi đơn hàng thành công

{
    "order_id": 1,
    "rating": 5,
    "comment": "Đồ ăn ngon, giao nhanh",
}
note phải chỉnh status của orders thành  success

