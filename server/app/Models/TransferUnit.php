<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class TransferUnit extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    public function computerUser()
    {
        return $this->belongsTo(ComputerUser::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
