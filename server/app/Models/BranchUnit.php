<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchUnit extends Model
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
}
