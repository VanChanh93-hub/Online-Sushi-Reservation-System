<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tables')->insert([
            [
                'table_number' => 'T01',
                'max_guests' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T02',
                'max_guests' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T03',
                'max_guests' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T04',
                'max_guests' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T05',
                'max_guests' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T06',
                'max_guests' => 4,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T07',
                'max_guests' => 8,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T08',
                'max_guests' => 8,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T09',
                'max_guests' => 12,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'table_number' => 'T10',
                'max_guests' => 12,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}