<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class CustomerSeeder extends Seeder
{
public function run()
{
    // Xóa dữ liệu thay vì truncate để tránh lỗi khóa ngoại
    DB::table('customers')->delete();

    DB::table('customers')->insert([
        [
            'name' => 'John Smith',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'point' => 150,
            'password' => Hash::make('password'),
            'membership_level' => 'gold',

            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'name' => 'Alice Brown',
            'email' => 'alice@example.com',
            'phone' => '9876543210',
            'point' => 75,
            'password' => Hash::make('password'),
            'membership_level' => 'silver',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'name' => 'Bob White',
            'email' => 'bob@example.com',
            'phone' => '5647382910',
            'point' => 200,
            'password' => Hash::make('password'),
            'membership_level' => 'platinum',
            'created_at' => now(),
            'updated_at' => now()
        ],
    ]);
}
}
