<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Truncate foods first to avoid foreign key constraint errors


        DB::table('categories')->insert([
            [
                'name' => 'Khai Vị',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sashimi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rolls',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cơm & Mì',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'name' => 'Sushi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Đồ Uống',
                'created_at' => now(),
                'updated_at' => now(),
            ],




        ]);
        /**
         * Run the database seeds.
         */
    }
}
