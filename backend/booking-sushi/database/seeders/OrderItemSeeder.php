<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_items')->insert([

            ['order_id' => 1, 'food_id' => 1, 'quantity' => 2, 'price' => 40000, 'status' => 'pending'],
            ['order_id' => 1, 'food_id' => 2, 'quantity' => 1, 'price' => 30000, 'status' => 'pending'],
            ['order_id' => 1, 'food_id' => 3, 'quantity' => 1, 'price' => 150000, 'status' => 'pending'],
        ]);
    }
}
