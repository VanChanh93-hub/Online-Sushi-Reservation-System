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
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('group_id')->nullable()->constrained('food_groups')->cascadeOnDelete();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->string('jpName')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->text('description_en')->nullable();
            $table->decimal('price', 10, 2);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('foods');
    }
};
