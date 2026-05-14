<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vouchers')->insert([
            [
                'code' => 'FREESHIP50',
                'discount_value' => 50000,
                'start_date' => now(),
                'end_date' => now()->addDays(30),
                'status' => 'active',
                'usage_limit' => 100,
                'used' => 0,
                'is_personal' => false,
                'required_total' => 200000,
                'describe' => 'Giảm 50k cho đơn từ 200k',
                'required_points' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'DIEMDOI100',
                'discount_value' => 100000,
                'start_date' => now(),
                'end_date' => now()->addDays(15),
                'status' => 'active',
                'usage_limit' => 50,
                'used' => 0,
                'is_personal' => true,
                'required_total' => null,
                'describe' => 'Đổi bằng điểm, giảm 100k',
                'required_points' => 500,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'NEWUSER10',
                'discount_value' => 10000,
                'start_date' => now(),
                'end_date' => now()->addDays(60),
                'status' => 'active',
                'usage_limit' => 1000,
                'used' => 0,
                'is_personal' => false,
                'required_total' => 0,
                'describe' => 'Voucher 10k cho người mới',
                'required_points' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'VIP50',
                'discount_value' => 50000,
                'start_date' => now(),
                'end_date' => now()->addDays(10),
                'status' => 'active',
                'usage_limit' => 10,
                'used' => 0,
                'is_personal' => true,
                'required_total' => 300000,
                'describe' => 'Dành riêng cho VIP, giảm 50k',
                'required_points' => 300,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}