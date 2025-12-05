<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilController extends Controller
{
    /**
     * Afficher le profil de l'utilisateur connecté
     */
    public function show(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()
        ]);
    }

    /**
     * Mettre à jour les informations du profil
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'adresse' => 'sometimes|string|max:500',
            'date_naissance' => 'sometimes|date',
            'carte_nationale' => 'sometimes|string|max:20',
            'methode_paiement' => 'sometimes|string|in:especes,virement,cheque',
        ]);

        $user->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * Mettre à jour la photo de profil
     */
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|file|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = $request->user();

        // Supprimer l'ancienne photo si elle existe
        if ($user->photo_identite) {
            Storage::disk('public')->delete($user->photo_identite);
        }

        // Sauvegarder la nouvelle photo
        $photoPath = $request->file('photo')->store('documents/users', 'public');

        $user->update(['photo_identite' => $photoPath]);

        return response()->json([
            'status' => true,
            'message' => 'Photo mise à jour avec succès',
            'photo_url' => Storage::url($photoPath)
        ]);
    }
}
