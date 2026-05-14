<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\orderTable;
use App\Models\Table;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class OrderTableController extends Controller
{
    public function index()
    {
        //
    }

    public function getTableInfo($token)
    {
        $table = Table::where('qr_token', $token)->first();

        if (!$table) {
            return response()->json(['message' => 'Mã bàn không toàn tại'], 403);
        }

        $orderTable = orderTable::where('table_id', $table->id)
            ->where('status', 'serve')
            ->first();
        if (!$orderTable) {
            return response()->json(['message' => 'Bàn chưa có hoá đơn'], 404);
        }
        return response()->json([
            'số bàn' => $table->id,
            'hoá đơn' => $orderTable,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */

    public function staffUpdateOrderTable(Request $request, $order_table)
    {
        // Validate đầu vào
        $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        // Tìm order_table theo id
        $orderTable = orderTable::find($order_table);
        if (!$orderTable) {
            return response()->json(['message' => 'Không tìm thấy order_table'], 404);
        }

        // Cập nhật table_id
        $orderTable->table_id = $request->table_id;
        $orderTable->save();

        return response()->json([
            'message' => 'Cập nhật bàn thành công',
            'order_table' => $orderTable,
        ]);
    }
    public function staffAddTable_id(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'table_id' => 'required|exists:tables,id',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required|date_format:H:i:s',
        ]);

        // Kiểm tra xem bàn đã được đặt vào thời điểm này chưa
        $exists = OrderTable::where('table_id', $request->table_id)
            ->where('reservation_date', $request->reservation_date)
            ->where('reservation_time', $request->reservation_time)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Bàn đã được đặt vào thời điểm này!'], 422);
        }

        // Thêm mới order_table
        $orderTable = OrderTable::create([
            'order_id' => $request->order_id,
            'table_id' => $request->table_id,
            'reservation_date' => $request->reservation_date,
            'reservation_time' => $request->reservation_time,
            'status' => 'serve',
        ]);

        return response()->json([
            'message' => 'Thêm bàn vào đơn hàng thành công',
            'order_table' => $orderTable,
        ]);
    }

    public function show($order_id)
    {
        $orderTables = OrderTable::where('order_id', $order_id)->get();

        if ($orderTables->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy order_table cho đơn hàng này'], 404);
        }

        return response()->json([
            'order_id' => $order_id,
            'order_tables' => $orderTables,
        ]);
    }
    public function openTable($id)
    {
        $table = orderTable::findOrFail($id);

        if ($table->status === 'open') {
            return response()->json(['message' => 'bàn này đã mở'], 400);
        }

        $qrToken = Str::random(32);

        $table->update([
            'status' => 'open',
            'qr_token' => $qrToken,
            'qr_expires_at' => Carbon::now()->addHours(3)->toDateTimeString(),
        ]);

        $qrUrl = url("http://localhost:5173/{$qrToken}");

        // $qrImage = QrCode::format('png')
        //     ->size(300)
        //     ->errorCorrection('H')
        //     ->generate($qrUrl);

        return response()->json(['ủrl', $qrUrl], 200);
    }
    public function scanQr($qrToken)
    {
        $table = orderTable::where('qr_token', $qrToken)->first();

        if (!$table) {
            return response()->json(['message' => 'không toàn tại qr'], 404);
        }

        if ($table->status !== 'open') {
            return response()->json(['message' => 'bàn này đã đóng'], 400);
        }

        if (Carbon::now()->greaterThan($table->qr_expires_at)) {
            return response()->json(['message' => 'qr đã hết hạn'], 400);
        }

        return response()->json([
            'message' => 'qr hợp lệ',
            'order_id' => $table->order_id,
        ]);
    }

    public function closeTable($id)
    {
        $table = orderTable::findOrFail($id);
        $table->status = 'closed';
        $table->qr_token = null;
        $table->qr_expires_at = null;
        $table->save();

        return response()->json([
            'message' => 'Bàn đã đóng và QR code đã bị huỷ'
        ]);
    }
}
