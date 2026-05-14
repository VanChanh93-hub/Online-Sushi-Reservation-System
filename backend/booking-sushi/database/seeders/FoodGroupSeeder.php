<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('food_groups')->insert([
            [
                'category_id' => 2,
                'name' => 'Sashimi đơn lẻ',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'name' => 'Bộ sưu tập Sashimi',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 4,
                'name' => 'Cơm',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 4,
                'name' => 'Mì',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'category_id' => 5,
                'name' => 'Nigiri cơ bản',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'name' => 'Nigiri cao cấp',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'name' => 'Bộ sưu tập Nigiri',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'category_id' => 6,
                'name' => 'Đồ uống không có cồn',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 6,
                'name' => 'Bia & Rượu',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'category_id' => 6,
                'name' => 'Rượu sake',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
