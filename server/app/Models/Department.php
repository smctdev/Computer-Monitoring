<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $guarded = [];
    public function computerUsers()
    {
        return $this->hasMany(ComputerUser::class);
    }

    public function branchCode()
    {
        return $this->belongsTo(BranchCode::class);
    }

    public function branchUnits()
    {
        return $this->hasMany(BranchUnit::class);
    }

    public function branchOldDataUnits()
    {
        return $this->hasMany(BranchOldDataUnit::class);
    }
}
