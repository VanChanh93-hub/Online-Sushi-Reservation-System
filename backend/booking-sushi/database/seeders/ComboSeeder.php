<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComboSeeder extends Seeder
{
    public function run()
    {
        DB::table('combos')->insert([
            [
                'name' => 'Combo Gia Đình',
                'description' => 'Combo dành cho gia đình 4 người, gồm sushi, sashimi và tempura.',
                'price' => 450000,
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Combo Tiết Kiệm',
                'description' => 'Combo tiết kiệm cho 2 người, gồm sushi cá hồi và cơm cuộn.',
                'price' => 220000,
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Combo Đặc Biệt',
                'description' => 'Combo đặc biệt cho 6 người, gồm sashimi, tempura và đồ uống.',
                'price' => 800000,
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Combo Tráng Miệng',
                'description' => 'Combo tráng miệng cho 2 người, gồm kem và bánh ngọt.',
                'price' => 150000,
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        /**
         * Run the database seeds.
         */
    }
}