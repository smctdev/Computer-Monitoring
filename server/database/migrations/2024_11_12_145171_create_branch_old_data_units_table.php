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
        Schema::create('branch_old_data_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_code_id')->constrained()->onDelete('restrict')->unique();
            $table->foreignId('unit_id')->constrained()->onDelete('restrict')->unique();
            $table->foreignId('department_id')->constrained()->onDelete('restrict')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_old_data_units');
    }
};
