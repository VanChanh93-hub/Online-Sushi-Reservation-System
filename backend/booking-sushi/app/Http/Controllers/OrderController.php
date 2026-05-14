<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Table;
use App\Models\Customer;
use App\Models\Voucher;
use App\Models\OrderTable;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use App\Mail\TableBookingMail;
use Illuminate\Support\Facades\Mail;
use App\Models\OrderItem;
class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('keyword')) {
            $keyword = $request->keyword;
            $query->whereHas('customer', function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%");
            })->orWhereHas('tables', function ($q) use ($keyword) {
                $q->where('table_number', 'like', "%$keyword%");
            })->orWhere('status', 'like', "%$keyword%");
        }

        $orders = $query->with(['customer', 'tables'])->latest()->get();

        $orders = $orders->map(function ($order) {
            $orderTableRows = OrderTable::where('order_id', $order->id)->get();
            $reservationDates = $orderTableRows->pluck('reservation_date')->unique()->values();
            $reservationTimes = $orderTableRows->pluck('reservation_time')->unique()->values();
            $orderArray = $order->toArray();
            $orderArray['reservation_dates'] = $reservationDates;
            $orderArray['reservation_times'] = $reservationTimes;
            return $orderArray;
        });
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['customer', 'tables', 'items.food', 'items.combo'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function statsDashbroad()
    {
        $totalOrder = Order::where('status', 'confirmed')->count();
        $totalRevenue = Order::where('status', 'confirmed')->sum('total_price');
        $totalCustomers = Customer::count();

        return response()->json([
            "statOrder" => $totalOrder,
            "statTotal" => $totalRevenue,
            "statCustomer" => $totalCustomers
        ]);
    }

    public function bookTables(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'guest_count' => 'required|integer|min:1',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required|date_format:H:i:s',
            'payment_method' => 'required|in:cash,momo,vnpay',
            'voucher_id' => 'nullable|exists:vouchers,id',
            'note' => 'nullable|string',
            'total_price' => 'required|numeric',
            'foods' => 'sometimes|array',
            'foods.*.food_id' => 'required_with:foods|exists:foods,id',
            'foods.*.quantity' => 'required_with:foods|integer|min:1',
            'foods.*.price' => 'required_with:foods|numeric',
            'combos' => 'sometimes|array',
            'combos.*.combo_id' => 'required_with:combos|exists:combos,id',
            'combos.*.quantity' => 'required_with:combos|integer|min:1',
            'combos.*.price' => 'required_with:combos|numeric',
        ]);
        $date = $request->reservation_date;
        $time = $request->reservation_time;
        $guestCount = $request->guest_count;
        $voucher_id = $request->voucher_id;

        $availableTablesAsc = Table::whereDoesntHave('orderTables', function ($q) use ($date, $time) {

            $q->where('reservation_date', $date)
            ->where('reservation_time', $time);
        })->orderBy('max_guests')->get();

        $availableTablesDesc = $availableTablesAsc->sortByDesc('max_guests')->values();

        if ($guestCount <= 12) {

            $suitableTable = $availableTablesAsc->firstWhere('max_guests', '>=', $guestCount);
            if (!$suitableTable) {
                return response()->json(['message' => 'Không còn bàn nào phù hợp cho số lượng khách này!'], 422);
            }

            $selectedTables = [$suitableTable->id];
            $remainingGuests = 0;
        } else {

            $selectedTables = [];
            $remainingGuests = $guestCount;
            $found = false;

            for ($i = 0; $i < count($availableTablesDesc); $i++) {
                for ($j = $i + 1; $j < count($availableTablesDesc); $j++) {
                    $table1 = $availableTablesDesc[$i];
                    $table2 = $availableTablesDesc[$j];
                    if ($table1->max_guests + $table2->max_guests >= $guestCount) {
                        $selectedTables = [$table1->id, $table2->id];
                        $remainingGuests = 0;
                        $found = true;
                        break 2;
                    }
                }
            }
            if (!$found) {
                return response()->json(['message' => 'Không đủ 2 bàn nào phù hợp để phục vụ số lượng khách này!'], 422);
            }
        }


        // Tạo đơn hàng

        $order = Order::create([
            'customer_id' => $request->customer_id,
            'payment_method' => $request->payment_method,
            'voucher_id' => $request->voucher_id,
            'total_price' => $request->total_price,
            'status' => 'pending',
            'note' => $request->note,
        ]);

        // Nếu sử dụng voucher cá nhân => cập nhật is_used = 1
        if ($request->voucher_id) {
            $voucher = Voucher::find($request->voucher_id);
            if ($voucher && $voucher->is_personal) {
                DB::table('customer_vouchers')
                    ->where('customer_id', $request->customer_id)
                    ->where('voucher_id', $voucher->id)
                    ->where('is_used', 0)
                    ->limit(1)
                    ->update(['is_used' => 1]);
            }
        }

        // Gán bàn
        $orderTableIds = [];
        foreach ($selectedTables as $tableId) {
            $orderTableIds[] = DB::table('order_tables')->insertGetId([
                'order_id' => $order->id,
                'table_id' => $tableId,
                'reservation_date' => $date,
                'reservation_time' => $time,
                'status' => 'serve',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Thêm món ăn
        foreach ($request->foods ?? [] as $food) {
            DB::table('order_items')->insert([
                'order_id' => $order->id,
                'food_id' => $food['food_id'],
                'quantity' => $food['quantity'],
                'price' => $food['price'],
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Thêm combo
        foreach ($request->combos ?? [] as $combo) {
            DB::table('order_items')->insert([
                'order_id' => $order->id,
                'combo_id' => $combo['combo_id'],
                'quantity' => $combo['quantity'],
                'price' => $combo['price'],
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        // Gửi email xác nhận
        $customer = $order->customer;
        if ($order->payment_method === 'cash' || $order->payment_status == 'done') {
            Mail::to($customer->email)->send(new TableBookingMail(
                $order,
                $selectedTables,
                $date,
                $time
            ));
        }

        return response()->json([
            'message' => 'Đặt bàn thành công',
            'order_id' => $order->id,
            'ids_tables' => $orderTableIds,
            'selected_tables' => $selectedTables,
            'ordered_foods' => $request->foods ?? [],
            'payment' => [
                'order_id' => $order->id,
                'amount' => $order->total_price,
                'payment_method' => $order->payment_method,
                'status' => $order->status,
            ],
        ]);
    }

    public function addPoint($order)
    {
        $customer = Customer::find($order->customer_id);
        if (!$customer) {
            return response()->json(['message' => 'Khách hàng không tồn tại'], 404);
        }

        if ($order->total_price >= 200000) {
            $pointsEarned = floor($order->total_price / 200000) * 10;
            $customer->point += $pointsEarned;
            $customer->point_available += $pointsEarned;
            $customer->membership_level = $this->calculateMembershipLevel($customer->point);
            $customer->save();

            return response()->json([
                'message' => 'Điểm thưởng đã được cộng',
                'points' => $customer->point,
            ]);
        }

        return response()->json([
            'message' => 'Hóa đơn chưa đủ điều kiện để cộng điểm',
            'points' => $customer->point,
        ]);
    }

    private function calculateMembershipLevel($points)
    {
        if ($points >= 5000) return 'Kim Cương';
        if ($points >= 1000) return 'Vàng';
        if ($points >= 100) return 'Bạc';
        return 'thành viên';
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || (!in_array(strtolower($user->role), ['manager', 'staff']))) {
            return response()->json(['message' => 'Bạn không có quyền cập nhật trạng thái món ăn'], 403);
        }

        $order = Order::findOrFail($id);

    $validated = $request->validate([
        'status' => 'required|in:pending,confirmed,success,cancelled'
    ]);

    if ($validated['status'] === 'cancelled') {
        $orderItems = OrderItem::where('order_id', $order->id)->get();
        foreach ($orderItems as $orderItem) {
            $orderItem->status = 'cancelled';
            $orderItem->save();
        }
    }

    // Cập nhật trạng thái order
    $order->status = $validated['status'];
    $order->save();

    // Nếu trạng thái là success thì cộng điểm
    if ($order->status === 'success') {
        $this->addPoint($order);
        return response()->json([
            'message' => 'Đã tích điểm',
            'order'   => $order
        ]);
    }

    return response()->json([
        'message' => 'Trạng thái đơn hàng đã được cập nhật',
        'order'   => $order
    ]);
    }

    public function orderHistory($id_customer)
    {
        $orders = Order::where('customer_id', $id_customer)
            ->orderBy('created_at', 'desc')
            ->with(['orderItems.food', 'orderItems.combo'])
            ->get();

        $result = $orders->map(function ($order) {
            return [
                'order_id' => $order->id,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'items' => $order->orderItems->map(function ($item) {
                    return [
                        'food_name' => optional($item->food)->name,
                        'combo_name' => optional($item->combo)->name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                    ];
                }),
            ];
        });

        return response()->json($result);
    }

    public function cancelOrder($order_id)
    {
        $order = Order::find($order_id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->status = 'cancelled';
        $order->save();
        return response()->json(['message' => 'Order cancelled successfully']);
    }

    // Tự động huỷ đơn hàng nếu tới trễ 15 phút so với thời gian đặt bàn
    public function autoCancelLateOrders()
    {
        $now = now();
        // Lấy các order đang chờ hoặc đã xác nhận
        $orders = Order::whereIn('status', ['pending', 'confirmed'])
            ->with('tables')
            ->get();

        foreach ($orders as $order) {
            $orderTable = OrderTable::where('order_id', $order->id)->first();
            if (!$orderTable) continue;

            $reservationDateTime = Carbon::parse($orderTable->reservation_date . ' ' . $orderTable->reservation_time);
            if ($now->greaterThan($reservationDateTime->addMinutes(20))) {
                $order->status = 'cancelled';
                $order->save();
            }
        }
    }
}
