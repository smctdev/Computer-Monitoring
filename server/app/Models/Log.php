<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Log extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function computerUser()
    {
        return $this->belongsTo(ComputerUser::class);
    }
}
