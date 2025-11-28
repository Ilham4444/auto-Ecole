<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permis extends Model {
    use HasFactory;

    protected $fillable = ['title', 'price', 'hours', 'description', 'features'];
    protected $casts = [
        'features' => 'array', // JSON -> tableau
    ];

    public function reservations() {
        return $this->hasMany(Reservation::class);
    }
}
