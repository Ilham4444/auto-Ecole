<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificatController extends Controller
{
    /**
     * Télécharger le certificat de réussite
     */
    public function download(Request $request)
    {
        $user = $request->user();

        // Vérifier si l'utilisateur a rempli toutes les conditions
        if (!$user->cours_completes || !$user->paiements_completes || !$user->examen_reussi) {
            return response()->json([
                'status' => false,
                'message' => 'Vous devez compléter tous les cours, paiements et réussir l\'examen pour télécharger le certificat'
            ], 403);
        }

        // Générer le PDF
        $pdf = Pdf::loadView('certificat.template', [
            'user' => $user,
            'date' => now()->format('d/m/Y')
        ]);

        return $pdf->download('certificat_' . $user->nom . '_' . $user->prenom . '.pdf');
    }
}
