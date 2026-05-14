<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'code'     => 'required',
            'password' => 'required|min:6',
        ]);

        // Tìm token khớp trong bảng password_reset_tokens
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->first();

        if (!$record || !Hash::check($request->code, $record->token)) {
            return response()->json(['message' => 'Mã xác thực không hợp lệ hoặc đã hết hạn.'], 400);
        }

        $user = Customer::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Đặt lại mật khẩu thành công!'], 200);
    }
}


