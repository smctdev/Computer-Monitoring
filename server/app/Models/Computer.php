<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Computer extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
    public function computerUser()
    {
        return $this->belongsTo(ComputerUser::class);
    }
    public function units()
    {
        return $this->belongsToMany(Unit::class, 'computer_unit')->withTimestamps();
    }
    public function installedApplications()
    {
        return $this->hasMany(InstalledApplication::class);
    }

    public function remarks()
    {
        return $this->hasMany(Remark::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($computer) {
            $computer->installedApplications()->delete();

            $computer->remarks()->delete();
        });
    }
}
