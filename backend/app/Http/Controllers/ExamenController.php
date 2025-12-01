<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Permis;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ExamenController extends Controller
{
    /**
     * Obtenir les créneaux disponibles pour les examens
     */
    public function disponibles(Request $request)
    {
        $type = $request->query('type', 'code'); // 'code' ou 'conduite'
        $user = Auth::user();

        // Vérifier l'éligibilité
        $eligible = $this->verifierEligibilite($user, $type);

        if (!$eligible['eligible']) {
            return response()->json([
                'success' => false,
                'message' => $eligible['message'],
                'eligible' => false
            ], 403);
        }

        // Générer les créneaux disponibles pour les 30 prochains jours
        $creneaux = $this->genererCreneaux($type);

        return response()->json([
            'success' => true,
            'eligible' => true,
            'creneaux' => $creneaux,
            'type' => $type
        ]);
    }

    /**
     * Réserver un examen
     */
    public function reserver(Request $request)
    {
        $request->validate([
            'type' => 'required|in:code,conduite',
            'date' => 'required|date|after:today',
            'time' => 'required',
            'permis_id' => 'required|exists:permis,id'
        ]);

        $user = Auth::user();
        $type = $request->type;

        // Vérifier l'éligibilité
        $eligible = $this->verifierEligibilite($user, $type);
        if (!$eligible['eligible']) {
            return response()->json([
                'success' => false,
                'message' => $eligible['message']
            ], 403);
        }

        // Vérifier si le candidat n'a pas déjà une réservation active pour ce type
        $reservationExistante = Reservation::where('user_id', $user->id)
            ->where('type', 'examen_' . $type)
            ->whereIn('status', ['en_attente', 'confirmé'])
            ->first();

        if ($reservationExistante) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà une réservation active pour cet examen.'
            ], 400);
        }

        // Vérifier la disponibilité du créneau
        $nombreReservations = Reservation::where('date', $request->date)
            ->where('time', $request->time)
            ->where('type', 'examen_' . $type)
            ->count();

        if ($nombreReservations >= 10) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau est complet. Veuillez choisir un autre horaire.'
            ], 400);
        }

        // Créer la réservation
        $reservation = Reservation::create([
            'user_id' => $user->id,
            'permis_id' => $request->permis_id,
            'type' => 'examen_' . $type,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'en_attente',
            'monitor' => 'Examen ' . ucfirst($type)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre demande de réservation a été enregistrée. Elle est en attente de validation par l\'administrateur.',
            'reservation' => $reservation
        ], 201);
    }

    /**
     * Obtenir les réservations d'examens de l'utilisateur
     */
    public function mesReservations()
    {
        $user = Auth::user();

        $reservations = Reservation::where('user_id', $user->id)
            ->whereIn('type', ['examen_code', 'examen_conduite'])
            ->with('permis')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'reservations' => $reservations
        ]);
    }

    /**
     * Annuler une réservation d'examen
     */
    public function annuler($id)
    {
        $user = Auth::user();

        $reservation = Reservation::where('id', $id)
            ->where('user_id', $user->id)
            ->whereIn('type', ['examen_code', 'examen_conduite'])
            ->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée.'
            ], 404);
        }

        // Vérifier que l'examen est dans au moins 48h
        $dateExamen = Carbon::parse($reservation->date . ' ' . $reservation->time);
        $maintenant = Carbon::now();

        if ($dateExamen->diffInHours($maintenant) < 48) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas annuler un examen moins de 48h avant la date prévue.'
            ], 400);
        }

        $reservation->update(['status' => 'annulé']);

        return response()->json([
            'success' => true,
            'message' => 'Votre réservation a été annulée avec succès.'
        ]);
    }

    /**
     * Vérifier l'éligibilité d'un candidat pour un examen
     */
    private function verifierEligibilite($user, $type)
    {
        if ($type === 'code') {
            // Pour l'examen code : au moins 15 heures de code
            $heuresCode = $user->cours_code ?? 0;
            if ($heuresCode < 15) {
                return [
                    'eligible' => false,
                    'message' => "Vous devez compléter au moins 15 heures de code pour passer l'examen. Vous avez actuellement {$heuresCode} heures."
                ];
            }
        } elseif ($type === 'conduite') {
            // Pour l'examen conduite : au moins 25 heures de conduite + examen code réussi
            $heuresConduite = $user->cours_conduite ?? 0;
            $examenCodeReussi = $user->examen_code ?? false;

            if (!$examenCodeReussi) {
                return [
                    'eligible' => false,
                    'message' => "Vous devez d'abord réussir l'examen du code de la route."
                ];
            }

            if ($heuresConduite < 25) {
                return [
                    'eligible' => false,
                    'message' => "Vous devez compléter au moins 25 heures de conduite pour passer l'examen. Vous avez actuellement {$heuresConduite} heures."
                ];
            }
        }

        return ['eligible' => true];
    }

    /**
     * Générer les créneaux disponibles
     */
    private function genererCreneaux($type)
    {
        $creneaux = [];
        $joursDisponibles = [];
        $horaires = [];

        // Définir les jours et horaires selon le type
        if ($type === 'code') {
            $joursDisponibles = [1, 3, 5]; // Lundi, Mercredi, Vendredi
            $horaires = ['09:00', '11:00', '14:00', '16:00'];
        } else {
            $joursDisponibles = [2, 4, 6]; // Mardi, Jeudi, Samedi
            $horaires = ['08:00', '10:00', '13:00', '15:00'];
        }

        // Générer pour les 30 prochains jours
        $dateDebut = Carbon::now()->addDay();
        $dateFin = Carbon::now()->addDays(30);

        for ($date = $dateDebut->copy(); $date->lte($dateFin); $date->addDay()) {
            // Vérifier si c'est un jour disponible
            if (in_array($date->dayOfWeek, $joursDisponibles)) {
                $dateStr = $date->format('Y-m-d');
                $creneauxJour = [];

                foreach ($horaires as $heure) {
                    // Compter les réservations existantes
                    $nombreReservations = Reservation::where('date', $dateStr)
                        ->where('time', $heure)
                        ->where('type', 'examen_' . $type)
                        ->count();

                    $placesRestantes = 10 - $nombreReservations;

                    $creneauxJour[] = [
                        'time' => $heure,
                        'disponible' => $placesRestantes > 0,
                        'places_restantes' => $placesRestantes
                    ];
                }

                $creneaux[] = [
                    'date' => $dateStr,
                    'date_formatted' => $date->locale('fr')->isoFormat('dddd D MMMM YYYY'),
                    'horaires' => $creneauxJour
                ];
            }
        }

        return $creneaux;
    }
}
