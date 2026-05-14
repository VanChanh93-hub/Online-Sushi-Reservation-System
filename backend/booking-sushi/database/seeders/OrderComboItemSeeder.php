<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderComboItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_combo_items')->insert([
            ['order_id' => 1, 'combo_id' => 1, 'price' => 120000, 'quantity' => 1],
            ['order_id' => 2, 'combo_id' => 2, 'price' => 300000, 'quantity' => 1],
            ['order_id' => 3, 'combo_id' => 3, 'price' => 80000, 'quantity' => 1],
        ]);
    }
}
