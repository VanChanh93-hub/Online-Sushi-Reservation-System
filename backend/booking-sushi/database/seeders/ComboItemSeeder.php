<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComboItemSeeder extends Seeder
{
    public function run()
    {
        DB::table('combo_items')->insert([
            // Combo 1: Gia Đình
            [
                'combo_id' => 1,
                'food_id' => 1, // Sushi Cá Hồi
                'quantity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'combo_id' => 1,
                'food_id' => 2, // Sashimi Bạch Tuộc
                'quantity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'combo_id' => 1,
                'food_id' => 3, // Tempura Tôm
                'quantity' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Combo 2: Tiết Kiệm
            [
                'combo_id' => 2,
                'food_id' => 1, // Sushi Cá Hồi
                'quantity' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'combo_id' => 2,
                'food_id' => 4, // Cơm cuộn California
                'quantity' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
/**
 * Run the database seeds.
 */