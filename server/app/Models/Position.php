<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Position extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    public function computerUsers()
    {
        return $this->hasMany(ComputerUser::class);
    }
}
