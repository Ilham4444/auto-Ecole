<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = ['user_id','montant','status','date','motif'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

