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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->float('discount_value');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'expired', 'disabled'])->default("active");
            $table->integer('usage_limit');
            $table->integer('used')->nullable()->default(0);
            $table->boolean('is_personal')->default(false);
            $table->integer('required_total')->nullable()->default(0);
            $table->string('describe')->nullable();
            $table->integer('required_points')->nullable()->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vouchers');
    }
};