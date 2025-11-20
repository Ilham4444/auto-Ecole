<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'telephone',
        'carte_nationale',
        'adresse',
        'email',
        'password',
        'methode_paiement',
        'categorie_permis',
        'photo_identite',
        'recto_carte_nationale',
        'verso_carte_nationale',
        'certificat_medical',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_naissance' => 'date',
        'is_active' => 'boolean'
    ];
}
