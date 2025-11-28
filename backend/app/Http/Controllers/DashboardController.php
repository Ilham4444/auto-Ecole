<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Paiement;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 🔹 Historique des réservations
        $reservations = Reservation::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        // 🔹 Historique des paiements
        $paiements = Paiement::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // 🔹 Calcul progression (exemple simple)
        $total_cours = 20;
        $total_conduite = 30;

        $progress_cours = $user->cours_completes ?? 0;
        $progress_conduite = $user->conduite_completes ?? 0;

        // 🔹 Vérification certificat
        $certificat_disponible =
            ($user->cours_completes >= $total_cours) &&
            ($user->paiements_completes == 1) &&
            ($user->examen_reussi == 1);

        return response()->json([
            'status' => true,
            'message' => 'Bienvenue sur votre dashboard',

            // 👤 Infos utilisateur
            'user' => $user,

            // 📘 Cours / Conduite
            'progression' => [
                'cours' => [
                    'fait' => $progress_cours,
                    'total' => $total_cours
                ],
                'conduite' => [
                    'fait' => $progress_conduite,
                    'total' => $total_conduite
                ]
            ],

            // 📅 Réservations
            'reservations' => $reservations,

            // 💳 Paiements
            'paiements' => $paiements,

            // 🎓 Certificat
            'certificat_disponible' => $certificat_disponible
        ]);
    }
}

