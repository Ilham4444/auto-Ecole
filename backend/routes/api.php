<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\CertificatController;
use App\Http\Controllers\Api\PermisController;
use Illuminate\Support\Facades\Route;

/* ============================
|  TEST API
============================ */
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Drive UP fonctionne!',
        'timestamp' => now(),
        'status' => 'success'
    ]);
});

Route::get('/test-pdf', function () {
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML('<h1>Test PDF</h1><p>Ceci est un test.</p>');
    return $pdf->download('test.pdf');
});

/* ============================
|  AUTHENTIFICATION
============================ */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/* ============================
|  ROUTES SÉCURISÉES (SANCTUM)
============================ */
Route::middleware('auth:sanctum')->group(function () {

    /* --- Dashboard générique (redirige vers le bon dashboard basé sur le rôle) --- */
    Route::get('/dashboard', [DashboardController::class, 'index']);  // Modifié pour gérer la redirection

    /* --- Dashboards spécifiques par rôle --- */
    Route::get('/dashboard/candidate', [DashboardController::class, 'candidate']);  // Nouveau : pour candidat
    Route::get('/dashboard/moniteur', [DashboardController::class, 'moniteur']);    // Nouveau : pour moniteur
    // Ajoutez /dashboard/admin si nécessaire pour admin

    /* --- Déconnexion --- */
    Route::post('/logout', [AuthController::class, 'logout']);

    /* --- Infos utilisateur connecté --- */
    Route::get('/user', [AuthController::class, 'user']);

    /* ============================
    |  PERMIS
    ============================ */
    Route::get('/permis', [PermisController::class, 'index']);

    /* ============================
    |  RÉSERVATIONS
    ============================ */
    Route::get('/reservations', [ReservationController::class, 'index']);     // Liste des réservations de l'utilisateur
    Route::post('/reservations', [ReservationController::class, 'store']);    // Créer une réservation
    Route::get('/reservations/{id}', [ReservationController::class, 'show']); // Détail d'une réservation
    Route::put('/reservations/{id}/confirm', [ReservationController::class, 'confirm']); // Confirmer une réservation (Moniteur)
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']); // Annuler une réservation

    /* ============================
    |  PAIEMENTS
    ============================ */
    Route::get('/paiements', [PaiementController::class, 'index']);              // Historique paiements
    Route::post('/paiements', [PaiementController::class, 'store']);             // Effectuer un paiement
    Route::get('/paiements/{id}/recu', [PaiementController::class, 'download']);  // Télécharger le reçu PDF

    /* ============================
    |  PROFIL
    ============================ */
    Route::get('/profil', [ProfilController::class, 'show']);          // Afficher profil
    Route::put('/profil', [ProfilController::class, 'update']);        // Modifier infos profil
    Route::post('/profil/photo', [ProfilController::class, 'updatePhoto']); // Modifier photo

    /* ============================
    |  CERTIFICAT
    ============================ */
    Route::get('/certificat', [CertificatController::class, 'download']);
});