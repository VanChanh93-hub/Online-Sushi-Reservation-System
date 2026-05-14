<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Voucher::query();

        if ($request->has('code')) {
            $query->where('code', 'like', '%' . $request->code . '%');
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        return response()->json($query->get());
    }



    public function store(Request $request)
    {
        $vailidated = $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code',
            'discount_value' => 'required|numeric|min:0',
            'usage_limit' => 'required|integer|min:1',
            'used' => 'nullable|integer|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'required_points' => 'nullable|integer|min:0',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:active,expired,disabled',
            'is_personal' => 'sometimes|boolean',
            'required_total' => 'nullable|integer|min:0',
            'required_points' => 'nullable|integer|min:0',
            'describe' => 'nullable|string|max:255',
        ]);

        $voucher = Voucher::create($vailidated);
        return response()->json([
            'message' => 'tạo thành công',
            'data' => $voucher
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['message' => 'không tồn tại'], 404);
        }
        return response()->json($voucher, 200);
    }
    public function update(Request $request,  $id)
    {
        $voucher = Voucher::find($id);
        if (!$voucher) {
            return response()->json(['message' => 'không tồn tại'], 404);
        }
        $vailidated = $request->validate([
            'code' => 'required|string|max:255|unique:vouchers,code,',
            'usage_limit' => 'required|integer|min:1',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'required_points' => 'nullable|integer',
            "status" => 'required|in:active,expired,disabled',
            'is_personal' => 'sometimes|boolean',
            'required_total' => 'nullable|integer|min:0',
            'describe' => 'nullable|string|max:255',
        ]);
        $voucher->update($vailidated);
        return response()->json([
            'message' => 'cập nhật thành công',
        ], 200);
    }


    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return response()->json([
            'message' => 'Xóa thành công',
        ], 200);
    }
    public function getVoucherforCustomer()
    {

        $vouchers = Voucher::where('is_personal', 1)
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get(['id', 'code', 'discount_value']);

        return response()->json($vouchers);
    }
}