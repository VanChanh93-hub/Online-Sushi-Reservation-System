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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->string('phone', 20)->nullable();
            $table->integer('point')->default(0);
            $table->integer('point_available')->default(0);
            $table->string('password', 255);
            $table->string('membership_level', 50)->nullable();
            $table->enum('role', ['user', 'admin', 'manager','staff','chef'])->default('user');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('customer_vouchers'); // Drop bảng con trước
        Schema::dropIfExists('customers');
    }
};
