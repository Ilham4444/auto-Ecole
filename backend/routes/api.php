<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\CertificatController;
use App\Http\Controllers\Api\PermisController;
use Illuminate\Support\Facades\Route;

/* ============================
|  Test API
============================ */
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Drive UP fonctionne!',
        'timestamp' => now(),
        'status' => 'success'
    ]);
});


/* ============================
|  Authentification
============================ */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);



/* ============================
|  Routes sécurisées
============================ */
Route::middleware('auth:sanctum')->group(function () {

    /* --- Dashboard --- */
    Route::get('/dashboard', [DashboardController::class, 'index']);

    /* --- Déconnexion --- */
    Route::post('/logout', [AuthController::class, 'logout']);

    /* --- Infos utilisateur --- */
    Route::get('/user', [AuthController::class, 'user']);



    /* ============================
    |  Réservations
    ============================ */
    Route::get('/permis', [PermisController::class, 'index']);
    Route::get('/reservations', [ReservationController::class, 'index']);          // Liste historique
    Route::post('/reservations', [ReservationController::class, 'store']);         // Ajouter réservation
    Route::get('/reservations', [ReservationController::class, 'userReservations']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']); // Annuler réservation
    


    /* ============================
    |  Paiements
    ============================ */
    Route::get('/paiements', [PaiementController::class, 'index']);              // Historique paiements
    Route::post('/paiements', [PaiementController::class, 'store']);             // Ajouter paiement
    Route::get('/paiements/{id}/recu', [PaiementController::class, 'download']);  // Télécharger reçu PDF



    /* ============================
    |  Profil
    ============================ */
    Route::get('/profil', [ProfilController::class, 'show']);              // Afficher mes infos
    Route::post('/profil/update', [ProfilController::class, 'update']);    // Modifier mes infos
    Route::post('/profil/photo', [ProfilController::class, 'updatePhoto']); // Modifier photo identité



    /* ============================
    |  Certificat de réussite
    ============================ */
    Route::get('/certificat', [CertificatController::class, 'download']);
});

