<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('order_tables')->insert([
            ['order_id' => 1, 'table_id' => 1, 'reservation_date' => '2025-05-25', 'reservation_time' => '18:00:00', 'status' => 'serve'],
            ['order_id' => 2, 'table_id' => 2, 'reservation_date' => '2025-05-26', 'reservation_time' => '19:30:00', 'status' => 'serve'],
            ['order_id' => 3, 'table_id' => 3, 'reservation_date' => '2025-05-27', 'reservation_time' => '17:00:00', 'status' => 'serve'],
        ]);
    }
}