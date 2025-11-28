<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'permis_id' => 'required|exists:permis,id',
            'monitor' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
        ]);

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            ...$validated
        ]);

        return response()->json($reservation, 201);
    }

    public function userReservations(Request $request) {
        $reservations = $request->user()->reservations()->with('permis')->get();
        return response()->json($reservations);
    }
}