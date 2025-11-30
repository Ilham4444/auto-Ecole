<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Paiement;
use App\Models\User;  // Ajouté pour les requêtes sur les utilisateurs

class DashboardController extends Controller
{
    /**
     * Dashboard générique : retourne directement les données selon le rôle
     */
    public function index(Request $request)
    {
        $user = $request->user();

        switch ($user->role) {
            case 'candidate':
                return $this->candidate($request);
            case 'moniteur':
                return $this->moniteur($request);
            case 'admin':
                return $this->admin($request);
            default:
                return response()->json(['status' => false, 'message' => 'Rôle non reconnu'], 403);
        }
    }

    /**
     * Dashboard pour candidat (intègre votre logique existante)
     */
    public function candidate(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'candidate') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        // 🔹 Historique des réservations (utilise la relation du modèle User)
        $reservations = $user->reservations()->orderBy('date', 'desc')->get();

        // 🔹 Historique des paiements (utilise la relation du modèle User)
        $paiements = $user->paiements()->orderBy('created_at', 'desc')->get();

        // 🔹 Calcul progression (votre logique existante)
        $total_cours = 20;
        $total_conduite = 30;
        $progress_cours = $user->cours_completes ?? 0;
        $progress_conduite = $user->conduite_completes ?? 0;

        // 🔹 Vérification certificat (votre logique existante)
        $certificat_disponible =
            ($user->cours_completes >= $total_cours) &&
            ($user->paiements_completes == 1) &&
            ($user->examen_reussi == 1);

        return response()->json([
            'status' => true,
            'message' => 'Bienvenue sur votre dashboard candidat',

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

    /**
     * Dashboard pour moniteur
     */
    public function moniteur(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        // 🔹 Liste des candidats assignés au moniteur (et non tous les candidats)
        $candidates = $user->eleves()
            ->select('users.id', 'users.nom', 'users.prenom', 'users.email', 'users.telephone', 'users.categorie_permis', 'monitor_candidat.assigned_at')
            ->get();

        // 🔹 Réservations gérées par le moniteur (utilise la relation du modèle User)
        $reservations = $user->reservations()->orderBy('date', 'desc')->get();

        // 🔹 Statistiques simples (adaptez selon vos besoins)
        $totalCandidates = $candidates->count();
        $totalReservations = $reservations->count();

        return response()->json([
            'status' => true,
            'message' => 'Bienvenue sur votre dashboard moniteur',

            // 👤 Infos utilisateur
            'user' => $user,

            // 👥 Liste des candidats
            'candidates' => $candidates,

            // 📅 Réservations gérées
            'reservations' => $reservations,

            // 📊 Statistiques
            'stats' => [
                'total_candidates' => $totalCandidates,
                'total_reservations' => $totalReservations
            ]
        ]);
    }

    /**
     * Dashboard pour admin (optionnel)
     */
    public function admin(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        // 🔹 Statistiques globales (adaptez selon vos besoins)
        $totalUsers = User::count();
        $totalReservations = Reservation::count();
        $totalPaiements = Paiement::count();

        return response()->json([
            'status' => true,
            'message' => 'Bienvenue sur votre dashboard admin',

            // 👤 Infos utilisateur
            'user' => $user,

            // 📊 Statistiques globales
            'stats' => [
                'total_users' => $totalUsers,
                'total_reservations' => $totalReservations,
                'total_paiements' => $totalPaiements
            ]
        ]);
    }
}