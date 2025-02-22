<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Unit extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($unit) {
            if (is_null($unit->unit_code)) {
                $unit->unit_code = self::generateNextUnitCode();
            }
        });
    }

    private static function generateNextUnitCode()
    {
        $latestUnit = self::latest('id')->first();
        $nextCode = '0000001';

        if ($latestUnit) {
            $lastCode = $latestUnit->unit_code;
            if ($lastCode) {
                $nextCode = str_pad((int) $lastCode + 1, 7, '0', STR_PAD_LEFT);
            }
        }

        return $nextCode;
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }
    public function computer()
    {
        return $this->belongsTo(Computer::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function computers()
    {
        return $this->belongsToMany(Computer::class, 'computer_unit')->withTimestamps();
    }
    public function transferUnits()
    {
        return $this->hasMany(TransferUnit::class)->orderBy('created_at', 'asc');
    }

    public function transferBranchUnits()
    {
        return $this->hasMany(TransferBranchUnit::class)->orderBy('created_at', 'asc');
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
