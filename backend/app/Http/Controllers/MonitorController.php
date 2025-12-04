<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class MonitorController extends Controller
{
    /**
     * Récupérer les réservations assignées au moniteur connecté
     */
    public function getAssignedReservations()
    {
        // Vérifier que l'utilisateur est bien moniteur
        if (auth()->user()->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitorId = auth()->user()->id;

        // Récupérer les réservations assignées à ce moniteur
        $reservations = Reservation::where('monitor_id', $monitorId)
            ->with(['user', 'permis'])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get()
            ->map(function ($reservation) {
                // Ajouter le nom du candidat pour l'affichage
                if ($reservation->user) {
                    $reservation->student_name = "{$reservation->user->nom} {$reservation->user->prenom}";
                    $reservation->student_email = $reservation->user->email;
                    $reservation->student_telephone = $reservation->user->telephone;
                }
                return $reservation;
            });

        return response()->json([
            'status' => true,
            'reservations' => $reservations
        ]);
    }

    /**
     * Moniteur accepte une réservation
     */
    public function acceptReservation($id)
    {
        // Vérifier que l'utilisateur est bien moniteur
        if (auth()->user()->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitorId = auth()->user()->id;
        $reservation = Reservation::where('monitor_id', $monitorId)->findOrFail($id);

        // Vérifier que la réservation a été acceptée par l'admin
        if ($reservation->admin_status !== 'accepted') {
            return response()->json([
                'status' => false,
                'message' => 'Cette réservation n\'a pas encore été validée par l\'admin'
            ], 400);
        }

        // Vérifier que la réservation est en attente de validation moniteur
        if ($reservation->monitor_status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Cette réservation a déjà été traitée'
            ], 400);
        }

        $reservation->update([
            'monitor_status' => 'accepted',
            'status' => 'confirmed' // Confirmé quand admin ET moniteur acceptent
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Réservation confirmée avec succès',
            'reservation' => $reservation
        ]);
    }

    /**
     * Moniteur rejette une réservation
     */
    public function rejectReservation($id)
    {
        // Vérifier que l'utilisateur est bien moniteur
        if (auth()->user()->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitorId = auth()->user()->id;
        $reservation = Reservation::where('monitor_id', $monitorId)->findOrFail($id);

        // Vérifier que la réservation est en attente de validation moniteur
        if ($reservation->monitor_status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Cette réservation a déjà été traitée'
            ], 400);
        }

        $reservation->update([
            'monitor_status' => 'rejected',
            'status' => 'cancelled'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Réservation rejetée',
            'reservation' => $reservation
        ]);
    }
    /**
     * Récupérer les clients assignés avec leur statut
     */
    public function getAssignments()
    {
        // Vérifier que l'utilisateur est bien moniteur
        if (auth()->user()->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitor = auth()->user();
        
        // Récupérer les élèves via la relation définie dans le modèle User
        // La relation 'eleves' inclut déjà les données pivot (assigned_at, status)
        $assignments = $monitor->eleves;

        return response()->json([
            'status' => true,
            'assignments' => $assignments
        ]);
    }

    /**
     * Accepter une assignation de client
     */
    public function acceptAssignment($candidatId)
    {
        // Vérifier que l'utilisateur est bien moniteur
        if (auth()->user()->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitor = auth()->user();

        // Vérifier si l'assignation existe
        if (!$monitor->eleves()->where('candidat_id', $candidatId)->exists()) {
            return response()->json(['status' => false, 'message' => 'Assignation introuvable'], 404);
        }

        // Mettre à jour le statut
        $monitor->eleves()->updateExistingPivot($candidatId, ['status' => 'accepted']);

        return response()->json([
            'status' => true,
            'message' => 'Assignation acceptée avec succès'
        ]);
    }

    /**
     * Rejeter une assignation de client
     */
    public function rejectAssignment($candidatId)
    {
        // Vérifier que l'utilisateur est bien moniteur
        if (auth()->user()->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitor = auth()->user();

        // Vérifier si l'assignation existe
        if (!$monitor->eleves()->where('candidat_id', $candidatId)->exists()) {
            return response()->json(['status' => false, 'message' => 'Assignation introuvable'], 404);
        }

        // Mettre à jour le statut
        $monitor->eleves()->updateExistingPivot($candidatId, ['status' => 'rejected']);

        return response()->json([
            'status' => true,
            'message' => 'Assignation rejetée'
        ]);
    }
}
