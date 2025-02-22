<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchOldDataUnit extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function branchCode()
    {
        return $this->belongsTo(BranchCode::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function transferBranchUnits()
    {
        return $this->hasMany(TransferBranchUnit::class);
    }
}
