<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\orderTable;
use App\Models\Customer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TableController extends Controller
{
    // Lấy danh sách tất cả bàn
    public function index(Request $request)
    {
        $query = Table::query();

        // Nếu có từ khóa tìm kiếm
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('table_number', 'like', "%$search%");
        }

        // Nếu có lọc theo trạng thái
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tables = $query->get();
        return response()->json($tables);
    }

    public function availableTimes(Request $request)

    {
        $request->validate([
            'reservation_date' => 'required|date'
        ]);

        $date = $request->reservation_date;
        $times = [
            '10:00',
            '12:15',
            '14:30',
            '16:45',
            '18:00',
            '20:15',
            '22:30'
        ];

        $availableSlots = [];

        foreach ($times as $time) {
            $reservationDateTime = Carbon::parse("$date $time");
            $startWindow = $reservationDateTime->copy()->subHours(2);
            $endWindow = $reservationDateTime->copy()->addHours(2);

            // Sử dụng quan hệ orderTables thay vì orders
            $availableTables = Table::whereDoesntHave('orderTables', function ($q) use ($date, $startWindow, $endWindow) {
                $q->where('reservation_date', $date)
                    ->whereTime('reservation_time', '>=', $startWindow->format('H:i:s'))
                    ->whereTime('reservation_time', '<=', $endWindow->format('H:i:s'));
            })
                ->get();

            if ($availableTables->count() > 0) {
                $availableSlots[] = [
                    'time' => $time,
                    'tables' => $availableTables->map(function ($table) {
                        return [
                            'table_number' => $table->table_number,
                            'max_guests' => $table->max_guests
                        ];
                    })
                ];
            }
        }
        return response()->json([
            'date' => $date,
            'available_slots' => $availableSlots
        ]);
    }
    public function show(Request $request)
    {
        $request->validate([
            'reservation_date' => 'required|date|after_or_equal:today'
        ]);

        $date = $request->reservation_date;

        // Định nghĩa các khung giờ có thể đặt
        $timeSlots = [
            '10:00:00' => '10:00',
            '12:15:00' => '12:15',
            '14:30:00' => '14:30',
            '16:45:00' => '16:45',
            '18:00:00' => '18:00',
            '20:15:00' => '20:15',
            '22:30:00' => '22:30'
        ];

        // Lấy tất cả bàn có sẵn
        $tables = Table::where('status', 'available')->get();

        // Lấy tất cả đơn đặt trong ngày được chọn
        $bookedSlots = DB::table('order_tables')
            ->where('reservation_date', $date)
            ->select('table_id', 'reservation_time')
            ->get()
            ->groupBy('reservation_time')
            ->map(function ($items) {
                return $items->pluck('table_id')->toArray();
            });

        // Kiểm tra từng khung giờ
        $availableSlots = [];
        foreach ($timeSlots as $dbTime => $displayTime) {
            $tablesAvailable = $tables->filter(function ($table) use ($bookedSlots, $dbTime) {
                return !isset($bookedSlots[$dbTime]) || !in_array($table->id, $bookedSlots[$dbTime]);
            });

            if ($tablesAvailable->isNotEmpty()) {
                $availableSlots[] = [
                    'time' => $displayTime,
                    'tables_count' => $tablesAvailable->count(),
                    'available_tables' => $tablesAvailable->map(function ($table) {
                        return [
                            'table_id' => $table->id,
                            'table_number' => $table->table_number,
                            'max_guests' => $table->max_guests
                        ];
                    })->values()
                ];
            }
        }

        if (empty($availableSlots)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có khung giờ trống nào cho ngày đã chọn',
                'date' => $date
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'date' => $date,
            'available_slots' => $availableSlots
        ]);
    }
    // Tạo mới bàn
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|max:255|unique:tables,table_number',
            'max_guests' => 'required|integer|min:1',
            'status' => 'required|in:available,reserved,occupied',
            "image" => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $table = Table::create($validated);
        return response()->json($table, 201);
    }

    // Cập nhật bàn
    public function update(Request $request, $id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json(['message' => 'Table not found'], 404);
        }

        $validated = $request->validate([
            'table_number' => 'required|string|max:255|unique:tables,table_number,' . $id,
            'max_guests' => 'required|integer|min:1',
            'status' => 'required|in:available,reserved,occupied',
            "image" => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',

        ]);

        $table->update($validated);
        return response()->json($table);
    }

    // Xóa bàn
    public function destroy($id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json(['message' => 'Table not found'], 404);
        }

        $table->delete();
        return response()->json(['message' => 'Table deleted successfully']);
    }
}