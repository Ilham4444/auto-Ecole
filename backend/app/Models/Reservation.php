<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model {
    use HasFactory;

    protected $fillable = ['user_id', 'permis_id', 'monitor', 'date', 'time', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function permis() {
        return $this->belongsTo(Permis::class);
    }
}

