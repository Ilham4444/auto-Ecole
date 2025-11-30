<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    'is_active',
    'role',
    'specialite_permis'
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];


    /* =======================================================
     |  RELATIONS
     |========================================================*/

    /**
     * Réservations de l’utilisateur
     * (Ex : réservation d’heure de conduite)
     */
    public function reservations()
    {
        return $this->hasMany(\App\Models\Reservation::class);
    }

    /**
     * Paiements effectués par l’utilisateur
     */
    public function paiements()
    {
        return $this->hasMany(\App\Models\Paiement::class);
    }

    /**
     * Historique des cours (code + conduite)
     */
    public function Permis()
    {
        return $this->hasMany(\App\Models\Permis::class);
    }

    /**
     * Tentatives / Résultat d’examen
     */
    public function examen()
    {
        return $this->hasOne(\App\Models\Examen::class);
    }

    /**
     * Certificat de réussite (généré après toutes conditions)
     */
    public function certificat()
    {
        return $this->hasOne(\App\Models\Certificat::class);
    }

    /**
     * Fichiers téléchargeables (reçus, documents PDF…)
     */
    public function fichiers()
    {
        return $this->hasMany(\App\Models\Fichier::class);
    }

    /**
     * Pour les moniteurs : accéder à leurs élèves assignés
     */
    public function eleves()
    {
        return $this->belongsToMany(User::class, 'monitor_candidat', 'monitor_id', 'candidat_id')
            ->withTimestamps()
            ->withPivot('assigned_at');
    }

    /**
     * Pour les candidats : accéder à leur moniteur assigné
     */
    public function moniteur()
    {
        return $this->belongsToMany(User::class, 'monitor_candidat', 'candidat_id', 'monitor_id')
            ->withTimestamps()
            ->withPivot('assigned_at');
    }
}
