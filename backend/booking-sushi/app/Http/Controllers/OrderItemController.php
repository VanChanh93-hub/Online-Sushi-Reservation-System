<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use App\Models\OrderItem;
use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderItemController extends Controller
{
    public function addItem(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'staff') {
            return response()->json(['message' => 'Bạn không có quyền thêm món ăn'], 403);
        }

        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'food_id' => 'nullable|integer|exists:foods,id',
            'combo_id' => 'nullable|integer|exists:combos,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $order = Order::where('id', $validated['order_id'])
            ->whereIn('status', ['pending', 'preparing', 'serve'])
            ->latest()
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng đang phục vụ cho bàn này.'], 404);
        }

        $validated['order_id'] = $order->id;
        $orderItem = OrderItem::create($validated);

        // Bổ sung: tăng tổng tiền của order
        $order->total_price += $orderItem->quantity * $orderItem->price;
        $order->save();

        $food = Food::find($validated['food_id']);

        return response()->json([
            'message' => 'Thêm món thành công',
            'tên món ăn' => $food ? $food->name : null,
            'combo_id' => $validated['combo_id'] ?? "không có",
            'số lượng' => $validated['quantity'],
            'price' => $orderItem->price,
            'order_item' => $orderItem,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || (!in_array($user->role, ['staff', 'chef']))) {
            return response()->json(['message' => 'Bạn không có quyền cập nhật trạng thái món ăn'], 403);
        }

        $orderItem = OrderItem::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,served,done,cancelled'
        ]);

        // Logic for role-based status transitions
        if ($user->role === 'chef') {
            if ($orderItem->status === 'pending' && $validated['status'] !== 'preparing') {
                return response()->json(['message' => 'Chef chỉ có thể chuyển từ pending sang preparing'], 403);
            }
            if ($orderItem->status === 'preparing' && $validated['status'] !== 'served') {
                return response()->json(['message' => 'Chef chỉ có thể chuyển từ preparing sang served'], 403);
            }
            if (!in_array($orderItem->status, ['pending', 'preparing']) && $validated['status'] !== 'cancelled') {
                return response()->json(['message' => 'Chef chỉ có thể cập nhật món đang chờ hoặc đang chuẩn bị'], 403);
            }
        } elseif ($user->role === 'staff') {
            if ($orderItem->status === 'served' && $validated['status'] !== 'done') {
                return response()->json(['message' => 'Staff chỉ có thể chuyển từ served sang done'], 403);
            }
            if (!in_array($orderItem->status, ['served']) && $validated['status'] !== 'cancelled') {
                return response()->json(['message' => 'Staff chỉ có thể cập nhật món đã phục vụ'], 403);
            }
        }

        $wasCancelled = $orderItem->status === 'cancelled';
        $orderItem->status = $validated['status'];
        $orderItem->save();

        if (!$wasCancelled && $validated['status'] === 'cancelled') {
            $this->decreaseOrderTotalByOrderItem($orderItem);
        }

        // $this->autoUpdateOrderStatusIfDoneOrCancelled($orderItem->order_id);

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'order_item' => $orderItem,
        ]);
    }

    public function removeItem(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'staff') {
            return response()->json(['message' => 'Bạn không có quyền cập nhật trạng thái món ăn'], 403);
        }

        $orderItem = OrderItem::find($id);
        if (!$orderItem) {
            return response()->json(['message' => 'Món ăn không tồn tại'], 404);
        }

        $order = Order::find($orderItem->order_id);
        if (!$order || !in_array($order->status, ['pending', 'serve'])) {
            return response()->json(['message' => 'Không thể xóa món ăn từ đơn hàng đã hoàn thành hoặc hủy'], 400);
        }

        $amount = $orderItem->quantity * $orderItem->price;
        $orderItem->delete();

        $order->total_price = max(0, $order->total_price - $amount);
        $order->save();

        return response()->json(['message' => 'Đã xóa món ăn khỏi đơn hàng'], 200);
    }

    protected function decreaseOrderTotalByOrderItem($orderItem)
    {
        $order = Order::find($orderItem->order_id);
        if (!$order) return;

        $amount = $orderItem->quantity * $orderItem->price;
        $order->total_price = max(0, $order->total_price - $amount);
        $order->save();
    }

    protected function autoUpdateOrderStatusIfDoneOrCancelled($orderId)
    {
        $order = Order::find($orderId);
        if (!$order) return;

        $allDoneOrCancelled = OrderItem::where('order_id', $orderId)
            ->whereNotIn('status', ['done', 'cancelled'])
            ->doesntExist();

        if ($allDoneOrCancelled && $order->status !== 'success') {
            $order->status = 'success';
            $order->payment_method = 'cash';
            $order->payment_status = 'done';
            $order->save();
            $this->autoCreatePaymentCodeIfDone($order);
        }
    }

    protected function autoCreatePaymentCodeIfDone($order)
    {
        if ($order->payment_status === 'done' && empty($order->payment_code)) {
            $order->payment_code = 'PAY' . time() . $order->id;
            $order->save();
        }
    }

    public function getItemsByOrderId($orderId)
    {
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

        $items = OrderItem::where('order_id', $orderId)
            ->with(['food:id,name', 'combo:id,name'])
            ->get()
            ->map(function ($item) {
                return [
                    'food_name' => optional($item->food)->name,
                    'combo_name' => optional($item->combo)->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                ];
            });

        if ($items->isEmpty()) {
            return response()->json(['message' => 'Không có món nào trong đơn hàng này'], 404);
        }

        return response()->json([
            'message' => 'Danh sách món ăn trong đơn hàng',
            'data' => $items
        ]);
    }

    public function bestSellers(Request $request)
    {
        $top = $request->input('top', 10);

        $orderItems = OrderItem::selectRaw('food_id, SUM(quantity) as total_quantity')
            ->whereNotNull('food_id')
            ->groupBy('food_id')
            ->orderByDesc('total_quantity')
            ->take($top)
            ->get();

        if ($orderItems->isEmpty()) {
            return response()->json(['message' => 'Không có món ăn nào được bán'], 404);
        }

        $foodIds = $orderItems->pluck('food_id')->toArray();
        $foods = Food::whereIn('id', $foodIds)->get()->keyBy('id');

        $result = $orderItems->map(function ($item) use ($foods) {
            return [
                'food_id' => $item->food_id,
                'total_quantity' => $item->total_quantity,
                'food' => $foods->get($item->food_id),
            ];
        });

        return response()->json([
            'message' => 'Danh sách món ăn bán chạy',
            'data' => $result
        ]);
    }

    public function GetOrderItemsForChef(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || (!in_array($user->role, ['admin', 'manager', 'chef']))) {
                return response()->json(['message' => 'Bạn không có quyền truy cập vào danh sách món ăn'], 403);
            }

            // Simplified query to avoid GROUP BY issues
            $items = OrderItem::with(['food:id,name', 'combo:id,name'])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->leftJoin('customers', 'orders.customer_id', '=', 'customers.id')
                ->whereIn('order_items.status', ['pending', 'preparing'])
                ->select([
                    'order_items.*',
                    'orders.status as order_status',
                    'orders.created_at as order_date',
                    'customers.name as customer_name'
                ])
                ->orderBy('orders.created_at', 'asc')
                ->get();

            $result = $items->map(function ($item) {
                // Get table numbers for this order
                $tableNumbers = DB::table('order_tables')
                    ->join('tables', 'order_tables.table_id', '=', 'tables.id')
                    ->where('order_tables.order_id', $item->order_id)
                    ->pluck('tables.table_number')
                    ->implode(', ');

                // Get reservation info
                $reservationInfo = DB::table('order_tables')
                    ->where('order_id', $item->order_id)
                    ->first();

                return [
                    'id' => $item->id,
                    'order_id' => $item->order_id,
                    'food_id' => $item->food_id,
                    'combo_id' => $item->combo_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                    'food' => $item->food ? ['id' => $item->food->id, 'name' => $item->food->name] : null,
                    'combo' => $item->combo ? ['id' => $item->combo->id, 'name' => $item->combo->name] : null,
                    'order_info' => [
                        'id' => $item->order_id,
                        'customer_name' => $item->customer_name,
                        'table_numbers' => $tableNumbers,
                        'order_status' => $item->order_status,
                        'order_date' => $item->order_date,
                        'reservation_date' => $reservationInfo->reservation_date ?? null,
                        'reservation_time' => $reservationInfo->reservation_time ?? null,
                    ],
                ];
            });

            return response()->json([
                'message' => 'Danh sách món ăn đang chuẩn bị',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('GetOrderItemsForChef Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách món ăn',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function GetOrderItemsForStaff(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || (!in_array($user->role, ['admin', 'manager', 'staff']))) {
                return response()->json(['message' => 'Bạn không có quyền truy cập vào danh sách món ăn'], 403);
            }

            // Simplified query to avoid GROUP BY issues
            $items = OrderItem::with(['food:id,name', 'combo:id,name'])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->leftJoin('customers', 'orders.customer_id', '=', 'customers.id')
                ->whereIn('order_items.status', ['served', 'done', 'cancelled'])
                ->select([
                    'order_items.*',
                    'orders.status as order_status',
                    'orders.created_at as order_date',
                    'customers.name as customer_name'
                ])
                ->orderBy('orders.created_at', 'asc')
                ->get();

            // Get table information separately to avoid complex GROUP BY
            $result = $items->map(function ($item) {
                // Get table numbers for this order
                $tableNumbers = DB::table('order_tables')
                    ->join('tables', 'order_tables.table_id', '=', 'tables.id')
                    ->where('order_tables.order_id', $item->order_id)
                    ->pluck('tables.table_number')
                    ->implode(', ');

                // Get reservation info
                $reservationInfo = DB::table('order_tables')
                    ->where('order_id', $item->order_id)
                    ->first();

                return [
                    'id' => $item->id,
                    'order_id' => $item->order_id,
                    'food_id' => $item->food_id,
                    'combo_id' => $item->combo_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                    'food' => $item->food ? ['id' => $item->food->id, 'name' => $item->food->name] : null,
                    'combo' => $item->combo ? ['id' => $item->combo->id, 'name' => $item->combo->name] : null,
                    'order_info' => [
                        'id' => $item->order_id,
                        'customer_name' => $item->customer_name,
                        'table_numbers' => $tableNumbers,
                        'order_status' => $item->order_status,
                        'order_date' => $item->order_date,
                        'reservation_date' => $reservationInfo->reservation_date ?? null,
                        'reservation_time' => $reservationInfo->reservation_time ?? null,
                    ],
                ];
            });

            return response()->json([
                'message' => 'Danh sách món đã phục vụ, hoàn thành hoặc huỷ',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('GetOrderItemsForStaff Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách món ăn',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function topFoodOnMonth(Request $request)
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $orderItems = OrderItem::selectRaw('food_id, SUM(quantity) as total_quantity')
            ->where('status', 'done')
            ->whereNotNull('food_id')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('food_id')
            ->orderByDesc('total_quantity')
            ->take(10)
            ->get();

        if ($orderItems->isEmpty()) {
            return response()->json(['message' => 'Không có món ăn nào được bán trong tháng này'], 404);
        }

        $foodIds = $orderItems->pluck('food_id');
        $foods = Food::whereIn('id', $foodIds)->get()->keyBy('id');

        $result = $orderItems->map(fn($item) => [
            'food_id' => $item->food_id,
            'total_quantity' => $item->total_quantity,
            'food' => $foods->get($item->food_id),
        ]);

        return response()->json([
            'message' => 'Top 10 món ăn bán chạy trong tháng',
            'data' => $result
        ]);
    }

    public function bottomFoodOnMonth(Request $request)
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $orderItems = OrderItem::selectRaw('food_id, SUM(quantity) as total_quantity')
            ->whereNotNull('food_id')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('food_id')
            ->orderBy('total_quantity')
            ->take(10)
            ->get();

        if ($orderItems->isEmpty()) {
            return response()->json(['message' => 'Không có món ăn nào được bán trong tháng này'], 404);
        }

        $foodIds = $orderItems->pluck('food_id');
        $foods = Food::whereIn('id', $foodIds)->get()->keyBy('id');

        $result = $orderItems->map(fn($item) => [
            'food_id' => $item->food_id,
            'total_quantity' => $item->total_quantity,
            'food' => $foods->get($item->food_id),
        ]);

        return response()->json([
            'message' => 'Top 10 món ăn bán ít nhất trong tháng',
            'data' => $result
        ]);
    }


    public function addItemToOrderTable(Request $request, $orderId)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.food_id' => 'required|exists:foods,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Lấy order
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng này.'], 404);
        }

        $createdItems = [];

        foreach ($request->items as $item) {
            $orderItem = OrderItem::create([
                'order_id' => $orderId,
                'food_id'  => $item['food_id'],
                'quantity' => $item['quantity'],
                'price'    => $item['price'],
            ]);

            // Cập nhật tổng tiền
            $order->total_price += $orderItem->quantity * $orderItem->price;

            $food = Food::find($item['food_id']);
            $createdItems[] = [
                'tên món ăn' => $food ? $food->name : null,
                'số lượng'  => $orderItem->quantity,
                'price'     => $orderItem->price,
                'order_item' => $orderItem,
            ];
        }

        // Lưu order sau khi cộng tổng tiền
        $order->save();

        return response()->json([
            'message' => 'Thêm món thành công',
            'order_id' => $order->id,
            'items' => $createdItems,
            'total_price' => $order->total_price,
        ], 201);
    }
}
