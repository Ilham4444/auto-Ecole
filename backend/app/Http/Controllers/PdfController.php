<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Paiement;

class PdfController extends Controller
{
    public function recuInscription(Request $request)
    {
        $user = $request->user();
        $data = ['user' => $user];
        $pdf = Pdf::loadView('pdfs.recu_inscription', $data);
        return $pdf->download('recu_inscription_'.$user->id.'.pdf');
    }

    public function recuPaiement($id, Request $request)
    {
        $paiement = Paiement::findOrFail($id);

        // sécurité : vérifier propriétaire
        if ($paiement->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = ['paiement' => $paiement, 'user' => $request->user()];
        $pdf = Pdf::loadView('pdfs.recu_paiement', $data);
        return $pdf->download('recu_paiement_'.$paiement->id.'.pdf');
    }

    public function certificat(Request $request)
    {
        $user = $request->user();

        if (!($user->cours_completes && $user->paiements_completes && $user->examen_reussi)) {
            return response()->json(['message' => 'Conditions non remplies'], 403);
        }

        $data = ['user' => $user];
        $pdf = Pdf::loadView('pdfs.certificat', $data);
        return $pdf->download('certificat_'.$user->id.'.pdf');
    }
}

