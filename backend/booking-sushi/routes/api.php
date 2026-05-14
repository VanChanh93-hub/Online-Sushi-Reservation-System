<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TableController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderTableController;
use App\Http\Controllers\CustomerVoucherController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\ComboController;
use App\Http\Controllers\FoodgroupController;
use App\Http\Controllers\VNPayController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FeedbackController;

use App\Http\Controllers\ItemFeedbackController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/tables', [TableController::class, 'index']);        // List
Route::get('/tables/{id}', [TableController::class, 'show']);    // Detail
Route::post('/tables', [TableController::class, 'store']);       // Create
Route::put('/tables/{id}', [TableController::class, 'update']);  // Update
Route::delete('/tables/{id}', [TableController::class, 'destroy']); // Delete
Route::post('/tables/DateTime', [TableController::class, 'availableTimes']); // lấy ra g iờ trống của bàn theo ngày và số lượng người
Route::get('/tables/token/{token}', [TableController::class, 'getTableInfo']);



// order
Route::get('/orders', [OrderController::class, 'index']);              // Lấy danh sách đơn đặt
Route::get('/orders/{id}', [OrderController::class, 'show']);          // Lấy chi tiết đơn
// Route::put('/order/update-status/{id}', [OrderController::class, 'updateStatus']); // Cập nhật trạng thái
Route::delete('/order/delete/{id}', [OrderController::class, 'destroy']);    // Xoá đơn đặt
Route::post('/orders/bookTables', [OrderController::class, 'bookTables']);
Route::get('/statsDashbroad', [OrderController::class, 'statsDashbroad']);
Route::get('/orders/history/{id}', [OrderController::class, 'orderHistory']);
Route::post('/orders/cancel/{id}', [OrderController::class, 'cancelOrder']);




// combo
Route::get('/combos', [ComboController::class, 'index']); // Lấy danh sách combo
Route::get('/combos/{id}', [ComboController::class, 'show']); // Lấy chi tiết combo
Route::post('/combo/insert-combos', [ComboController::class, 'store']); // Tạo mới combo
Route::put('/combo/update-combo/{id}', [ComboController::class, 'update']); // Cập nhật combo
Route::put('/combo/update-status/{id}', [ComboController::class, 'updateStatus']); // Cập nhật trạng thái combo



// food
Route::get('/foods', [FoodController::class, 'index']);
Route::get('foods/category/{categoryId}/groups', [FoodController::class, 'foodsByCategoryWithGroups']);
Route::post('/food/insert-food', [FoodController::class, 'store']);
Route::put('food-update/{id}', [FoodController::class, 'update']);
Route::get('/food/category/{id}', [FoodController::class, 'getFoodsByCategory']);
Route::put('/food/update-status/{id}', [FoodController::class, 'updateStatus']);


// foodgroup
Route::get('/foodgroups', [\App\Http\Controllers\FoodgroupController::class, 'index']);
Route::post('/foodgroup/insert-foodgroup', [\App\Http\Controllers\FoodgroupController::class, 'store']);
Route::put('/foodgroup/update-foodgroup/{id}', [\App\Http\Controllers\FoodgroupController::class, 'update']);
route::put('/foodgroup/update-status/{id}', [\App\Http\Controllers\FoodgroupController::class, 'updateStatus']);



// category
Route::get('/category', [CategoryController::class, 'index']);
Route::post('insert-category', [CategoryController::class, 'store']);
Route::put('category-update/{id}', [CategoryController::class, 'update']);
Route::put('category/update-status/{id}', [CategoryController::class, 'updateStatus']);
// customer

Route::post('/login', [CustomerController::class, "login"]);
Route::post('/register', [CustomerController::class, "store"]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [CustomerController::class, 'index']);
    Route::get('/logout', [CustomerController::class, 'destroy']);
    Route::put('/customers/{id}/role', [CustomerController::class, 'updateRole'])->name('customers.updateRole');

    Route::get('admin/customers', [CustomerController::class, 'listAll']);
    Route::put('customers/{id}/status', [CustomerController::class, 'lockUnlock']);

    Route::get('/getOrderChef', [OrderItemController::class, 'GetOrderItemsForChef']);
    Route::get('/getOrderStaff', [OrderItemController::class, 'GetOrderItemsForStaff']);
    Route::put('/orderitems/update-status/{id}', [OrderItemController::class, 'updateStatus']);
    Route::put('/orderTable/update/{order_table_id}', [OrderTableController::class, 'staffUpdateOrderTable']);
    Route::post('/orderTable/add', [OrderTableController::class, 'staffAddTable_id']);
    Route::post('/orderItem/add', [OrderItemController::class, 'addItem']);
    Route::delete('/orderItem/remove/{id}', [OrderItemController::class, 'removeItem']);
});
    Route::put('/order/update-status/{id}', [OrderController::class, 'updateStatus']);

// google auth
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);
Route::get('auth/google/redirect', [GoogleController::class, 'redirect']);
Route::get('auth/google/callback', [GoogleController::class, 'callback']);

Route::get('/customers/verify/{token}', [CustomerController::class, 'verifyEmail']);

// voucher
Route::get('/voucher', [VoucherController::class, 'index']); // lấy all
Route::post('/voucher', [VoucherController::class, 'store']); // tạo mới
Route::get('/voucherForCustomer', [VoucherController::class, 'getVoucherforCustomer']); // lấy tất cả voucher cho khách hàng
Route::get('/voucher/{id}', [VoucherController::class, 'show']); // lấy chi tiết
Route::put('/voucher/{id}', [VoucherController::class, 'update']); // cập nhật
Route::delete('/voucher/{id}', [VoucherController::class, 'destroy']); // xoá

// Route::post('/exchangePoints', [CustomerVoucherController::class, 'exchangePoints']);
Route::post('/applyVoucher', [CustomerVoucherController::class, 'applyVoucher']);
Route::post('/themVoucherWheel', [CustomerVoucherController::class, 'store']);
Route::get('/getAllVoucherByUser/{id}', [CustomerVoucherController::class, 'index']);
Route::post('/table/info/{token}', [OrderTableController::class, 'getTableInfo']); // kiểm tra bàn

// order table
Route::get('/orderTable/{id}', [OrderTableController::class, 'show']);

Route::put('/update/{id}', [CustomerController::class, "update"]);



Route::post('/orders/vnpay-url', [VNPayController::class, 'createurlvnpay']);
Route::get('/vnpay-return', [VNPayController::class, 'vnpayReturn'])->name('vnpay.callback');

Route::get('/getItemsByOrderId/{id}', [OrderItemController::class, 'getItemsByOrderId']);


//aiupdateItem

Route::get('/recommendations/{customerId}', [RecommendationController::class, 'tasteProfile']);
Route::post('/chat', [ChatController::class, 'chat']);



// feedback
Route::get('/feedbacks', [FeedbackController::class, 'index']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::get('/feedbacks/order/{orderId}', [FeedbackController::class, 'getFeedbackByOrderId']);
Route::get('/feedbacks/customer/{customerId}', [FeedbackController::class, 'getFeedbackByCustomerId']);
Route::put('/feedbacks/reply/{feedbackId}', [FeedbackController::class, 'adminReply']);
//ai
Route::get('/recommendations/{customerId}', [RecommendationController::class, 'get']);

Route::post('/chat/sessions', function (Request $request) {
    $session = \App\Models\ChatSession::create([
        'customer_id' => $request->customer_id
    ]);

    return response()->json(['session_id' => $session->id]);
});

Route::post('/chat', [ChatController::class, 'chat']);
Route::get('/bestSellers', [OrderItemController::class, 'bestSellers']);
Route::get('/topFoodOnMonth', [OrderItemController::class, 'topFoodOnMonth']);
Route::get('/bottomFoodOnMonth', [OrderItemController::class, 'bottomFoodOnMonth']);



// item_feedback

Route::get('/feedback/{id}', [FeedbackController::class, 'show']); // id của order
    Route::get('/getorderitem/{id}', [FeedbackController::class, 'getorderitem']); // id của order
Route::get('/orderwithfeedback', [FeedbackController::class, 'getAllOrdersWithFeedback']); // id của order
Route::get('/item_feedbacks', [ItemFeedbackController::class, 'index']);
Route::post('/order-items/{id}/feedback', [ItemFeedbackController::class, 'store']);
Route::get('/foods/{id}/rating', [ItemFeedbackController::class, 'getFoodRating']);
Route::get('/combos/{id}/rating', [ItemFeedbackController::class, 'getComboRating']);
// Route::get('/item_feedbacks/order/{orderId}', [ItemFeedbackController::class, 'getFeedbackByOrderId']);
// Route::get('/item_feedbacks/customer/{customerId}', [ItemFeedbackController::class, 'getFeedbackByCustomerId']);
// Route::put('/item_feedbacks/reply/{feedbackId}', [ItemFeedbackController::class, 'adminReply']);

Route::post('/tables/{id}/open', [OrderTableController::class, 'openTable']);
Route::get('/checkqr/{qrToken}', [OrderTableController::class, 'scanQr']);
Route::post('/tables/{id}/close', [OrderTableController::class, 'closeTable']);
Route::post('/addItemToOrderTable/{id}', [OrderItemController::class, 'addItemToOrderTable']);
