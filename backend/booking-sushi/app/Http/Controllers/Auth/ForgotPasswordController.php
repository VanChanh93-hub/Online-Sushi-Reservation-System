<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\Customer;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = Customer::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại trong hệ thống.'], 404);
        }

        $code = rand(100000, 999999);

        // Lưu mã vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => bcrypt($code),
                'created_at' => now()
            ]
        );

        Mail::raw("Mã xác thực đặt lại mật khẩu của bạn là: $code", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Mã xác thực đặt lại mật khẩu');
        });
        return response()->json(['message' => 'Mã xác thực đã được gửi tới email của bạn!'], 200);
    }

}
