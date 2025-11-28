<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // -------------------------
    // LOGIN
    // -------------------------
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérification email / mot de passe
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Vérifier si l'utilisateur est actif
        if (!$user->is_active) {
            return response()->json([
                'status' => false,
                'message' => 'Compte désactivé'
            ], 403);
        }

        // Token Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Logique basée sur le rôle : retourner des infos pour redirection frontend
        $dashboardUrl = '';
        $additionalData = [];
        switch ($user->role) {
            case 'candidate':
                $dashboardUrl = '/dashboard/candidate';  // URL frontend pour candidat
                $additionalData = ['permissions' => ['view_reservations', 'view_exams']];
                break;
            case 'moniteur':
                $dashboardUrl = '/dashboard/moniteur';  // URL frontend pour moniteur
                $additionalData = ['permissions' => ['manage_reservations', 'view_students']];
                break;
            case 'admin':
                $dashboardUrl = '/dashboard/admin';
                $additionalData = ['permissions' => ['full_access']];
                break;
            default:
                return response()->json([
                    'status' => false,
                    'message' => 'Rôle non reconnu'
                ], 403);
        }

        return response()->json([
            'status' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user,
            'dashboard_url' => $dashboardUrl,  // URL pour redirection frontend
            'additional_data' => $additionalData  // Données supplémentaires basées sur le rôle
        ]);
    }

    // -------------------------
    // REGISTER
    // -------------------------
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:' . now()->subYears(18)->format('Y-m-d'),
            'telephone' => 'required|string|max:10',
            'carte_nationale' => 'required|string|unique:users',
            'adresse' => 'required|string|max:500',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(6)],
            'methode_paiement' => 'required|in:carte,virement',
            'categorie_permis' => 'required|in:A,A1,B,C,D,EC',
            'photo_identite' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'recto_carte_nationale' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'verso_carte_nationale' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'certificat_medical' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'role' => 'required|in:candidate,moniteur,admin'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $photoIdentitePath = $request->file('photo_identite')?->store('documents/users', 'public');
            $rectoCartePath = $request->file('recto_carte_nationale')?->store('documents/users', 'public');
            $versoCartePath = $request->file('verso_carte_nationale')?->store('documents/users', 'public');
            $certificatMedicalPath = $request->file('certificat_medical')?->store('documents/users', 'public');

            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'date_naissance' => $request->date_naissance,
                'telephone' => $request->telephone,
                'carte_nationale' => $request->carte_nationale,
                'adresse' => $request->adresse,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'methode_paiement' => $request->methode_paiement,
                'categorie_permis' => $request->categorie_permis,
                'photo_identite' => $photoIdentitePath,
                'recto_carte_nationale' => $rectoCartePath,
                'verso_carte_nationale' => $versoCartePath,
                'certificat_medical' => $certificatMedicalPath,
                'role' => $request->role
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Compte créé avec succès',
                'token' => $token,
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            // Nettoyage des fichiers en cas d'erreur
            if (isset($photoIdentitePath)) Storage::disk('public')->delete($photoIdentitePath);
            if (isset($rectoCartePath)) Storage::disk('public')->delete($rectoCartePath);
            if (isset($versoCartePath)) Storage::disk('public')->delete($versoCartePath);
            if (isset($certificatMedicalPath)) Storage::disk('public')->delete($certificatMedicalPath);

            // Log l'erreur pour debugging
            \Log::error('Erreur lors de l\'inscription: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de la création du compte',
                'error' => $e->getMessage(),  // Affiche l'erreur réelle (à retirer en production)
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }

    // -------------------------
    // LOGOUT
    // -------------------------
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    // -------------------------
    // USER CONNECTÉ
    // -------------------------
    public function user(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()
        ]);
    }

    // -------------------------
    // DASHBOARD CANDIDAT (API endpoint protégé)
    // -------------------------
    public function dashboardCandidate(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'candidate') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        // Retourner des données spécifiques au candidat (ex. : réservations)
        $data = [
            'reservations' => $user->reservations,  // Relation du modèle
            'exams' => $user->examen
        ];

        return response()->json([
            'status' => true,
            'dashboard' => 'candidate',
            'data' => $data
        ]);
    }

    // -------------------------
    // DASHBOARD MONITEUR (API endpoint protégé)
    // -------------------------
    public function dashboardMoniteur(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        // Retourner des données spécifiques au moniteur (ex. : étudiants)
        $data = [
            'students' => User::where('role', 'candidate')->get(),  // Exemple : liste des candidats
            'reservations' => $user->reservations
        ];

        return response()->json([
            'status' => true,
            'dashboard' => 'moniteur',
            'data' => $data
        ]);
    }
}