<?php

namespace Database\Seeders;

use App\Models\BranchCode;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BranchCode::create([
            'branch_name' => "HO",
        ]);
    }
}
