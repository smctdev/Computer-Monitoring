<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class InstalledApplication extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    public function computer()
    {
        return $this->belongsTo(Computer::class);
    }
}
