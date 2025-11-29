<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller {
    
    public function index(Request $request) {
        $reservations = $request->user()->reservations()->with('permis')->get();
        return response()->json($reservations);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'permis_id' => 'required|exists:permis,id',
            'monitor' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'type' => 'nullable|string', // Type de séance: code ou conduite
        ]);

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'status' => 'pending', // Statut par défaut
            ...$validated
        ]);

        // Charger les relations pour la réponse
        $reservation->load('permis', 'user');

        return response()->json([
            'status' => true,
            'message' => 'Réservation créée avec succès',
            'reservation' => $reservation
        ], 201);
    }

    public function show(Request $request, $id) {
        $reservation = Reservation::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();
        
        return response()->json($reservation);
    }

    public function destroy(Request $request, $id) {
        $reservation = Reservation::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();
        
        $reservation->delete();
        
        return response()->json([
            'status' => true,
            'message' => 'Réservation annulée avec succès'
        ]);
    }

    public function userReservations(Request $request) {
        $reservations = $request->user()->reservations()->with('permis')->get();
        return response()->json($reservations);
    }

    public function confirm(Request $request, $id) {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => 'confirmed']);
        
        return response()->json([
            'status' => true,
            'message' => 'Réservation confirmée',
            'reservation' => $reservation
        ]);
    }
}