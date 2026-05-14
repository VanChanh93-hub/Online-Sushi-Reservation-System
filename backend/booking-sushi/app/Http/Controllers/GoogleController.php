<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\Customer;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Nếu Google không trả email -> báo lỗi
        if (!$googleUser->getEmail()) {
            return redirect('http://localhost:3000/login?error=no_email');
        }

        // Tìm hoặc tạo user dựa trên email
        $user = Customer::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'     => $googleUser->getName(),
                'password' => bcrypt(Str::random(16)),
                'is_verified' => true
            ]
        );

        // Tạo Sanctum token
        $token = $user->createToken('google-token')->plainTextToken;

        // Redirect về FE kèm token
        return redirect("http://localhost:3000/google/callback?token={$token}");
    }
}
