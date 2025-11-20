<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'categorie_permis' => $user->categorie_permis
                ],
                'token' => $token
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email ou mot de passe incorrect'
        ], 401);
    }

    // Register
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
            'categorie_permis' => 'required|in:A,A1,B,C,D,EC'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

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
            'categorie_permis' => $request->categorie_permis
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'categorie_permis' => $user->categorie_permis
            ],
            'token' => $token,
            'message' => 'Compte créé avec succès'
        ], 201);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    // Get current user
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}