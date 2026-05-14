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
        Schema::create('food_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id'); // Liên kết với bảng `categories`
            $table->string('name'); // Tên nhóm món ăn
            $table->string('name_en')->nullable();
            $table->boolean('status')->default(true); // Trạng thái hoạt động của nhóm món ăn
            $table->timestamps();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
    Schema::dropIfExists('food_groups');
    }
};
