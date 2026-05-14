<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            ['customer_id' => 1, 'total_price' => 150000, 'payment_method' => "cash", 'status' => 'pending'],
            ['customer_id' => 2, 'total_price' => 200000, 'payment_method' => "cash", 'status' => 'pending'],
            ['customer_id' => 3, 'total_price' => 100000, 'payment_method' => "cash", 'status' => 'cancelled'],
        ]);
    }
}