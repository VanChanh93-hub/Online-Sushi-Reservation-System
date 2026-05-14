<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerVoucher;
use App\Models\Customer;
use App\Models\Voucher;

class CustomerVoucherController extends Controller
{
    /**
     * Lấy danh sách voucher chưa dùng và hợp lệ của khách hàng
     */
   public function index($customerId)
{
    try {
        $now = now();

        $voucherList = CustomerVoucher::with('voucher')
            ->where('customer_id', $customerId)
            ->where('is_used', 0)
            ->get()
            ->filter(function ($item) use ($now) {
                return $item->voucher &&
                    $item->voucher->status === 'active' &&
                    $item->voucher->end_date >= $now;
            });

        $uniqueVouchers = $voucherList->unique('voucher_id')->values();

        $data = $uniqueVouchers->map(function ($item) {
            $v = $item->voucher;
            return [
                'id' => $v->id,
                'code' => $v->code,
                'discount_value' => $v->discount_value,
                'start_date' => $v->start_date,
                'end_date' => $v->end_date,
                'status' => $v->status,
            ];
        });

        return response()->json([
            'message' => $data->isEmpty() ? 'Không có voucher khả dụng' : 'Danh sách voucher của khách hàng',
            'data' => $data,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Đã xảy ra lỗi khi lấy danh sách voucher',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Khách hàng đổi điểm để lấy voucher cá nhân
     */
    public function exchangePoints(Request $request)
    {
        $request->validate([
            'voucher_id' => 'required|exists:vouchers,id',
            'customer_id' => 'required|exists:customers,id',
        ]);

        $customer = Customer::findOrFail($request->customer_id);
        $voucher = Voucher::findOrFail($request->voucher_id);

        $exists = CustomerVoucher::where('customer_id', $customer->id)
            ->where('voucher_id', $voucher->id)
            ->exists();

        if ($exists) {
            return response()->json(["message" => "Bạn đã đổi voucher này rồi"], 400);
        }

        if (!$voucher->is_personal) {
            return response()->json(["message" => "Voucher này không phải là voucher cá nhân"], 400);
        }

        if (is_null($voucher->required_points) || $customer->point < $voucher->required_points) {
            $requiredPoints = $voucher->required_points - $customer->point;
            return response()->json(["message" => "Bạn không đủ điểm để đổi voucher, bạn cần thêm " . $requiredPoints], 400);
        }

        if ($voucher->used >= $voucher->usage_limit) {
            return response()->json(["message" => "Voucher này đã hết lượt sử dụng"], 400);
        }
        $customer->point -= $voucher->required_points;
        $customer->save();

        $voucher->used += 1;
        $voucher->save();

        CustomerVoucher::create([
            'customer_id' => $customer->id,
            'voucher_id' => $voucher->id,
            'assigned_at' => now(),
            'date' => $voucher->end_date,
            'is_used' => 0,
        ]);

        return response()->json([
            "message" => "Đổi voucher thành công",
            "voucher_info" => CustomerVoucher::where("customer_id", $customer->id)->get()
        ]);
    }

    /**
     * Áp dụng voucher (chỉ tính toán, không đánh dấu là đã dùng)
     */
    public function applyVoucher(Request $request)
    {
        $request->validate([
            'customer' => 'required|exists:customers,id',
            'total' => 'required|numeric|min:0',
            'code' => 'required|string'
        ]);

        $customerId = $request->customer;
        $total = $request->total;
        $voucherCode = $request->code;

        $voucher = Voucher::where('code', $voucherCode)
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$voucher) {
            return response()->json(['message' => 'Voucher không tồn tại hoặc đã hết hạn'], 404);
        }

        if ($voucher->required_total && $total < $voucher->required_total) {
            return response()->json(['message' => 'Đơn hàng không đủ điều kiện để áp dụng voucher'], 400);
        }

        $customerVoucher = CustomerVoucher::where('customer_id', $customerId)
            ->where('voucher_id', $voucher->id)
            ->where('is_used', 0)
            ->first();

        if (!$customerVoucher && $voucher->usage_limit !== null && $voucher->used >= $voucher->usage_limit) {
            return response()->json(['message' => 'Voucher đã hết lượt sử dụng'], 400);
        }

        $discount = $voucher->discount_value;
        $newTotal = max(0, $total - $discount);

        return response()->json([
            'message' => 'Áp dụng voucher thành công',
            'discount' => $discount,
            'new_total' => $newTotal,
            'voucher' => [
                'id' => $voucher->id,
                'code' => $voucher->code
            ]
        ]);
    }

    /**
     * Lưu lại thông tin quay thưởng và gán voucher (nếu có)
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
        ]);

        $customerId = $request->customer_id;
        $voucherId = $request->voucher_id;
        $customer = Customer::findOrFail($customerId);

        if ($customer->point_available < 50) {
            return response()->json(['message' => 'Khách hàng không đủ điểm để quay thưởng'], 400);
        }

        if (is_null($voucherId)) {
            $customer->point_available -= 50;
            $customer->save();
            return response()->json(['message' => 'Chúc bạn may mắn lần sau'], 200);
        }

        $voucher = Voucher::where('id', $voucherId)
            ->where('is_personal', 1)
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$voucher) {
            return response()->json(['message' => 'Voucher không hợp lệ hoặc không phải voucher cá nhân'], 404);
        }

        if ($voucher->usage_limit <= 0) {
            return response()->json(['message' => 'Voucher đã hết lượt sử dụng'], 400);
        }

        CustomerVoucher::create([
            'customer_id' => $customerId,
            'voucher_id' => $voucherId,
            'assigned_at' => now(),
            'date' => $voucher->end_date,
        ]);

        $customer->point_available -= 50;
        $customer->save();

        $voucher->usage_limit -= 1;
        $voucher->used += 1;
        $voucher->save();

        return response()->json([
            'message' => 'Voucher đã được thêm thành công',
            'customer_id' => $customerId,
            'voucher_id' => $voucherId,
            'assigned_at' => now(),
            'date' => $voucher->end_date,
        ]);
    }
}
