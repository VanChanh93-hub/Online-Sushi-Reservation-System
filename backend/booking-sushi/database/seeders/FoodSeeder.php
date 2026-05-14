<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('foods')->insert([
            [
                'category_id' => 1,
                'group_id' => null,
                'name' => 'Edamame',
                'jpName' => '枝豆',
                'image' => null,
                'description' => 'Đậu nành Nhật Bản hấp với muối biển',
                'price' => 500000, // 5 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'group_id' => null,
                'name' => 'Agedashi Tofu',
                'jpName' => '揚げ出し豆腐',
                'image' => null,
                'description' => 'Đậu phụ chiên giòn phục vụ với nước tương dashi và hành lá',
                'price' => 600000, // 6 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'group_id' => null,
                'name' => 'Gyoza',
                'jpName' => '餃子',
                'image' => null,
                'description' => 'Bánh xếp Nhật Bản nhân thịt lợn và rau, chiên giòn đáy',
                'price' => 700000, // 7 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'group_id' => null,
                'name' => 'Takoyaki',
                'jpName' => 'たこ焼き',
                'image' => null,
                'description' => 'Bánh bạch tuộc kiểu Osaka với sốt takoyaki, mayonnaise và bông cá ngừ',
                'price' => 700000, // 7 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'group_id' => null,
                'name' => 'Miso Soup',
                'jpName' => '味噌汁',
                'image' => null,
                'description' => 'Súp miso truyền thống với đậu phụ, rong biển và hành lá',
                'price' => 400000, // 4 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'group_id' => null,
                'name' => 'Seaweed Salad',
                'jpName' => '海藻サラダ',
                'image' => null,
                'description' => 'Salad rong biển tươi với dầu mè',
                'price' => 600000, // 6 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // --- Sashimi items ---
            [
                'category_id' => 2,
                'group_id' => 1,
                'name' => 'Maguro (Cá ngừ)',
                'jpName' => '鮪',
                'image' => null,
                'description' => '5 miếng',
                'price' => 1200000, // 12 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 2,
                'name' => 'Sake (Cá hồi)',
                'jpName' => '鮭',
                'image' => null,
                'description' => '5 miếng',
                'price' => 1100000, // 11 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 1,
                'name' => 'Hamachi (Cá buri)',
                'jpName' => 'はまち',
                'image' => null,
                'description' => '5 miếng',
                'price' => 1200000, // 12 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 2,
                'name' => 'Tai (Cá tráp đỏ)',
                'jpName' => '鯛',
                'image' => null,
                'description' => '5 miếng',
                'price' => 1300000, // 13 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 1,
                'name' => 'Hotate (Sò điệp)',
                'jpName' => '帆立',
                'image' => null,
                'description' => '5 miếng',
                'price' => 1400000, // 14 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 2,
                'name' => 'Amaebi (Tôm ngọt)',
                'jpName' => '甘海老',
                'image' => null,
                'description' => '5 miếng',
                'price' => 1500000, // 15 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // --- Sashimi sets ---
            [
                'category_id' => 2,
                'group_id' => 1,
                'name' => 'Moriawase Nhỏ',
                'jpName' => '刺身盛り合わせ小',
                'image' => 'https://i.pinimg.com/736x/f7/c8/38/f7c83832cb63a737e33df7552a5ec5a6.jpg',
                'description' => 'Bộ sưu tập 3 loại cá (12 miếng)',
                'price' => 2800000, // 28 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 2,
                'name' => 'Moriawase Vừa',
                'jpName' => '刺身盛り合わせ中',
                'image' => 'https://i.pinimg.com/736x/99/a5/88/99a588d49d24d58ac9f0a3a4531146bb.jpg',
                'description' => 'Bộ sưu tập 5 loại cá (20 miếng)',
                'price' => 4200000, // 42 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 1,
                'name' => 'Moriawase Lớn',
                'jpName' => '刺身盛り合わせ大',
                'image' => 'https://i.pinimg.com/736x/64/77/c2/6477c29df6d33f09ffb5bb21a916d1c0.jpg',
                'description' => 'Bộ sưu tập 7 loại cá (30 miếng)',
                'price' => 6800000, // 68 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'group_id' => 2,
                'name' => 'Sashimi Đặc biệt',
                'jpName' => '特上刺身',
                'image' => 'https://i.pinimg.com/736x/be/d8/6f/bed86fc74d63d840f49ecf035f713ea6.jpg',
                'description' => 'Bộ sưu tập cao cấp với các loại cá hiếm (25 miếng)',
                'price' => 8800000, // 8800 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // --- Nigiri cơ bản ---
            [
                'category_id' => 5,
                'group_id' => 5,
                'name' => 'Maguro (Cá ngừ)',
                'jpName' => '鮪',
                'image' => null,
                'description' => null,
                'price' => 700000, // 7 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 6,
                'name' => 'Sake (Cá hồi)',
                'jpName' => '鮭',
                'image' => null,
                'description' => null,
                'price' => 700000, // 7 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 7,
                'name' => 'Ebi (Tôm)',
                'jpName' => '海老',
                'image' => null,
                'description' => null,
                'price' => 600000, // 6 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 5,
                'name' => 'Tamago (Trứng)',
                'jpName' => '玉子',
                'image' => null,
                'description' => null,
                'price' => 500000, // 5 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 6,
                'name' => 'Ika (Mực)',
                'jpName' => '烏賊',
                'image' => null,
                'description' => null,
                'price' => 600000, // 6 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 7,
                'name' => 'Unagi (Lươn)',
                'jpName' => '鰻',
                'image' => null,
                'description' => null,
                'price' => 800000, // 8 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // --- Nigiri cao cấp ---
            [
                'category_id' => 5,
                'group_id' => 5,
                'name' => 'Otoro (Bụng cá ngừ)',
                'jpName' => '大トロ',
                'image' => null,
                'description' => null,
                'price' => 1200000, // 12 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 6,
                'name' => 'Uni (Cầu gai)',
                'jpName' => '雲丹',
                'image' => null,
                'description' => null,
                'price' => 1500000, // 15 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 7,
                'name' => 'Amaebi (Tôm ngọt)',
                'jpName' => '甘海老',
                'image' => null,
                'description' => null,
                'price' => 900000, // 9 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 5,
                'name' => 'Hotate (Sò điệp)',
                'jpName' => '帆立',
                'image' => null,
                'description' => null,
                'price' => 800000, // 8 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 6,
                'name' => 'Ikura (Trứng cá hồi)',
                'jpName' => 'いくら',
                'image' => null,
                'description' => null,
                'price' => 900000, // 9 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 7,
                'name' => 'Anago (Lươn biển)',
                'jpName' => '穴子',
                'image' => null,
                'description' => null,
                'price' => 900000, // 9 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // --- Nigiri sets ---
            [
                'category_id' => 5,
                'group_id' => 5,
                'name' => 'Nigiri 6 miếng',
                'jpName' => '握り6貫',
                'image' => null,
                'description' => 'Lựa chọn của đầu bếp',
                'price' => 2400000, // 24 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 6,
                'name' => 'Nigiri 8 miếng',
                'jpName' => '握り8貫',
                'image' => null,
                'description' => 'Lựa chọn của đầu bếp',
                'price' => 3200000, // 32 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 7,
                'name' => 'Nigiri 10 miếng',
                'jpName' => '握り10貫',
                'image' => null,
                'description' => 'Lựa chọn của đầu bếp',
                'price' => 4000000, // 40 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 5,
                'name' => 'Nigiri 12 miếng',
                'jpName' => '握り12貫',
                'image' => null,
                'description' => 'Lựa chọn của đầu bếp',
                'price' => 4800000, // 48 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 5,
                'group_id' => 6,
                'name' => 'Nigiri Đặc biệt',
                'jpName' => '特上握り',
                'image' => null,
                'description' => '8 miếng cao cấp',
                'price' => 5800000, // 58 * 100000
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
