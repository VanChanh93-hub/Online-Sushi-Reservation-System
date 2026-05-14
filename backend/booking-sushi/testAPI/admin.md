lấy ra danh sách food
http://127.0.0.1:8000/api/foods GET

=====================
thêm món ăn 
http://127.0.0.1:8000/api/food/insert-food POST

{
    "category_id": 1,
    "group_id": 2,
    "name": "Sushi 23123 Hồi",
    "jpName": "サーモン寿司",
    "description": "Sushi cá hồi tươi ngon",
    "price": 120000
}
=========================
cập nhập món ăn 
http://127.0.0.1:8000/api/food-update/{id} PUT
{
  "name": "Sushi Cá Hồi",
  "jpName":null,
  "group_id":null,  
  "price": 120000,
  "category_id": 1,
  "description": "Sushi cá hồi tươi ngon",
}

=================
lấy ra danh sách foodgroup GET

http://127.0.0.1:8000/api/foodgroups 

===================
thêm danh sách foodgroup POST
http://127.0.0.1:8000/api/foodgroup/insert-foodgroup 

{
    "category_id": 1,
    "name": "Nhóm Sushi Đặc Biệt"
}
==============================
chỉnh sửa danh sách foodgroup PUT
http://127.0.0.1:8000/api/foodgroup/update-foodgroup/{id} 

{
    "category_id": 4
    "name": "Nhóm Sushi Cao Cấp"

}




=======================
lấy ra tất cả order
http://127.0.0.1:8000/api/orders GET

=======================
lấy ra chi tiết order(orderitem)
http://127.0.0.1:8000/api/orders/{id} GET

=======================
cập nhập trạng thái đơn hàng
http://127.0.0.1:8000/api/order/update-status/{id} PUT


{
   "status":"success"
}

==========================
cập nhập trạng thái chi tiết đơn hàng
http://127.0.0.1:8000/api/orderitems/update-status/{id} PUT

{
   "status":"success"
}
===========================
lấy ra danh sách người dungf
http://127.0.0.1:8000/api/admin/customers GET

===============================
khoá tài khoản người dùng

http://127.0.0.1:8000/api/customers/{id}/status PUT

{
    "status": 0
}
=====================
đổi role admin 
note : chỉ có role admin mới đổi được các role khác
http://127.0.0.1:8000/api/customers/{id}/role  PUT

{
  "role": "admin"
}






=========================
lấy ra tất cả combo
http://127.0.0.1:8000/api/combos GET

======================

lấy chi tiết combo

http://127.0.0.1:8000/api/combos/{id} GET



=========================

Thêm combo


http://127.0.0.1:8000/api/combo/insert-combos POST

// khi muốn thêm luôn combo và food_id cùng lúc


{
    "name": "Combo Sushi Đặc Biệt",
    "description": "Combo sushi tổng hợp cho 2 người",
    "price": 299000,
    "status": true,
    "items": [
        { "food_id": 1, "quantity": 2 },
        { "food_id": 2, "quantity": 1 }
    ]
}

=========================

cập nhập combo

http://127.0.0.1:8000/api/update-combo/{id} PUT


{
    "name": "Combo Sushi Siêu Cấp",
    "description": "Combo sushi cho nhóm bạn",
    "price": 399000,
    "status": false,
    "items": [
        { "food_id": 3, "quantity": 3 },
        { "food_id": 4, "quantity": 2 }
    ]
}

=========================

thêm combo rỗng chưa có food_id

http://127.0.0.1:8000/api/combo/add-comboemp POST


{
    "name": "Combo Sushi Siêu Cấp",
    "description": "Combo sushi cho nhóm bạn",
    "price": 399000,
    "status": false,
}
=========================

http://127.0.0.1:8000/api/combos/add-food-combo/{id} POST

thêm food_id vào combo
{
  "food_id": 5,
  "quantity": 2
}

======================
http://127.0.0.1:8000/api/combos/add-food-combo/{id} POST

thêm food_id vào combo
{
  "food_id": 5,
  "quantity": 2
}






===============
feedback

http://127.0.0.1:8000/api/feedbacks/order/{orderId} GET lấy ra danh sách feedback theo order

===============
http://127.0.0.1:8000/api/feedbacks/customer/{customerId} GET lấy ra danh sách feedback theo khách hàng

===============
http://127.0.0.1:8000/api/feedbacks GET lấy ra tất cả danh sách feedback



===============

http://127.0.0.1:8000/api/feedbacks/reply/{feedbackId} PUT admin trả lời lại feedback của khách hàng

{
    "admin_reply": "Cảm ơn bạn đã phản hồi, hẹn gặp lại bạn lần sau!"
}





==========================

http://127.0.0.1:8000/api/orderTable/{order_id}  GET
lấy ra danh sách ordertable dựa vào order_id


=======================
http://127.0.0.1:8000/api/orderTable/update/{order_table_id} PUT

chỉnh sửa table_id dựa vào order_id 
{
    "table_id": 2
}
=======================
http://127.0.0.1:8000/api/orderTable/add POST
 thêm ordertables vào order_id

{
    "order_id": 1,
    "table_id": 3,
    "reservation_date": "2024-06-10",
    "reservation_time": "18:00:00"
}
=====================
http://127.0.0.1:8000/api/getOrderChef GET
lấy order_item cho chef


=====================
http://127.0.0.1:8000/api/getOrderStaff GET
lấy order_item cho chef


=====================
http://127.0.0.1:8000/api/orderItem/add POST
Nhân viên thêm order_item dựa vào id
{
    "order_id" : 4,
    "food_id":1,
    "combo_id":2,
    "quantity": 4,
    "price":4
}
