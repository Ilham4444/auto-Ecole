<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paiement;

class PaiementController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'montant' => 'required|integer',
            'date' => 'required|date',
            'motif' => 'nullable|string'
        ]);

        $paiement = $request->user()->paiements()->create($data);

        // Optionnel : mettre à jour user.paiements_completes si total payé atteint quota
        // Exemple pseudo : if($user->paiements->sum('montant') >= $required) { $user->update(['paiements_completes' => true]); }

        return response()->json($paiement, 201);
    }
}
