<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('computers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('computer_user_id')->nullable();
            $table->integer('formatted_status')->default(0)->nullable();
            $table->integer('remarks')->default(0)->nullable();
            $table->string('date_cleaning')->nullable();
            $table->timestamps();


            $table->foreign('computer_user_id')->references('id')->on('computer_users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('computers');
    }
};
