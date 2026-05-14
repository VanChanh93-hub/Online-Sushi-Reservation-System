<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->decimal('total_price', 10, 2);
            $table->string('note')->nullable();
            $table->foreignId('voucher_id')->nullable()->constrained('vouchers')->nullOnDelete();
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'success'])->default('pending'); // sửa status
            $table->enum('payment_status', ['pending', 'done'])->default('pending');
            $table->enum('payment_method', ['cash', 'vnpay'])->default('cash');
            //mã thanh toán
            $table->string('payment_code')->nullable();

            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
