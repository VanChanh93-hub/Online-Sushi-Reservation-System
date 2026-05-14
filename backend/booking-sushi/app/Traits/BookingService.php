<?php

namespace App\Traits;

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

trait BookingService
{
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
                'status' => 'close',
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
        $customer = $order->customer; // Quan hệ trong model Order -> belongsTo(Customer::class)

        Mail::to($customer->email)->send(new TableBookingMail(
            $order,
            $selectedTables,
            $date,
            $time
        ));

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
}