<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paiement;
use Barryvdh\DomPDF\Facade\Pdf;

class PaiementController extends Controller
{
    public function index(Request $request)
    {
        $paiements = $request->user()->paiements()->orderBy('created_at', 'desc')->get();
        return response()->json($paiements);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'montant' => 'required|integer',
            'date' => 'required|date',
            'motif' => 'nullable|string',
            'rib' => 'nullable|string|max:24' // RIB peut avoir jusqu'à 24 caractères
        ]);

        $paiement = $request->user()->paiements()->create($data);

        // Optionnel : mettre à jour user.paiements_completes si total payé atteint quota
        // Exemple pseudo : if($user->paiements->sum('montant') >= $required) { $user->update(['paiements_completes' => true]); }

        return response()->json($paiement, 201);
    }

    public function download($id)
    {
        $paiement = Paiement::findOrFail($id);
        
        // Vérifier que l'utilisateur ne peut télécharger que ses propres reçus
        if ($paiement->user_id !== auth()->id()) {
            abort(403, 'Accès non autorisé');
        }
        
        $pdf = Pdf::loadView('pdfs.recu_paiement', [
            'paiement' => $paiement,
            'user' => $paiement->user
        ]);

        return $pdf->download('recu_paiement_' . $paiement->id . '.pdf');
    }
}