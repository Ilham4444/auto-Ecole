<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // LOGIN
   
    public function login(Request $request)
    {
        config(['auth.defaults.guard' => 'web']);
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                 'status' => false,
                'errors' => $validator->errors()
            ],422);
        }

        // Vérification email/mdp
       
        if (!Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            return response()->json([
                'status' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user
        ],200);
    }

    // ---------------------------------------------------
    // REGISTER
    // ---------------------------------------------------
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:-18 years',
            'telephone' => 'required|string|max:10',
            'carte_nationale' => 'required|string|unique:users',
            'adresse' => 'required|string|max:500',
            'email' => 'required|email|unique:users',
            'password' => [
                'required',
                'confirmed',
                Password::min(6)
            ],
            'methode_paiement' => 'required|in:carte,virement',
            'categorie_permis' => 'required|in:A,A1,B,C,D,EC',
            'photo_identite' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'recto_carte' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'verso_carte' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'certificat_medical' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
        ], [
            'date_naissance.before' => 'Vous devez avoir au moins 18 ans pour vous inscrire.',
            'carte_nationale.unique' => 'Ce numéro de carte nationale est déjà utilisé.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'telephone.max' => 'Le numéro de téléphone ne doit pas dépasser 10 caractères.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Traitement des fichiers uploadés
        $photoIdentitePath = null;
        $rectoCartePath = null;
        $versoCartePath = null;
        $certificatMedicalPath = null;

        try {
            if ($request->hasFile('photo_identite')) {
                $photoIdentitePath = $request->file('photo_identite')->store('documents/users', 'public');
            }

            if ($request->hasFile('recto_carte')) {
                $rectoCartePath = $request->file('recto_carte')->store('documents/users', 'public');
            }

            if ($request->hasFile('verso_carte')) {
                $versoCartePath = $request->file('verso_carte')->store('documents/users', 'public');
            }

            if ($request->hasFile('certificat_medical')) {
                $certificatMedicalPath = $request->file('certificat_medical')->store('documents/users', 'public');
            }

            // Création de l'utilisateur
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
                'recto_carte' => $rectoCartePath,
                'verso_carte' => $versoCartePath,
                'certificat_medical' => $certificatMedicalPath
            ]);

            // Génération du token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Compte créé avec succès',
                'token' => $token,
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            // Nettoyage des fichiers en cas d'erreur
            if ($photoIdentitePath) Storage::disk('public')->delete($photoIdentitePath);
            if ($rectoCartePath) Storage::disk('public')->delete($rectoCartePath);
            if ($versoCartePath) Storage::disk('public')->delete($versoCartePath);
            if ($certificatMedicalPath) Storage::disk('public')->delete($certificatMedicalPath);

            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de la création du compte: ' . $e->getMessage()
            ], 500);
        }
    }

    // ---------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    // ---------------------------------------------------
    // USER CONNECTÉ
    // ---------------------------------------------------
    public function user(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()
        ]);
    }
}
