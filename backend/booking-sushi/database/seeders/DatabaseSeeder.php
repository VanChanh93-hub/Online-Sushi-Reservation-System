<?php

namespace Database\Seeders;

use App\Models\Food;
use App\Models\Voucher;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CustomerSeeder::class,
            TableSeeder::class,
            CategorySeeder::class,
            FoodGroupSeeder::class,
            FoodSeeder::class,
            ComboSeeder::class,
            ComboItemSeeder::class,
            VoucherSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,

        ]);
    }
}
