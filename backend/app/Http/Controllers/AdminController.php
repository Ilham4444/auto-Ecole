<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Récupérer tous les candidats inscrits
     */
    public function getCandidates()
    {
        // Vérifier que l'utilisateur est bien admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $candidates = User::where('role', 'candidate')
            ->select('id', 'nom', 'prenom', 'email', 'telephone', 'categorie_permis', 'created_at')
            ->with(['moniteur' => function($query) {
                $query->select('users.id', 'users.nom', 'users.prenom', 'users.categorie_permis');
            }])
            ->get();

        return response()->json([
            'status' => true,
            'candidates' => $candidates
        ]);
    }

    /**
     * Récupérer tous les moniteurs avec leur spécialité
     */
    public function getMonitors()
    {
        // Vérifier que l'utilisateur est bien admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitors = User::where('role', 'moniteur')
            ->select('id', 'nom', 'prenom', 'email', 'telephone', 'specialite_permis')
            ->withCount('eleves')
            ->with(['eleves' => function($query) {
                $query->select('users.id', 'users.nom', 'users.prenom', 'users.categorie_permis');
            }])
            ->get();

        return response()->json([
            'status' => true,
            'monitors' => $monitors
        ]);
    }

    /**
     * Assigner un candidat à un moniteur
     */
    public function assignCandidate(Request $request)
    {
        // Vérifier que l'utilisateur est bien admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $request->validate([
            'candidat_id' => 'required|exists:users,id',
            'monitor_id' => 'required|exists:users,id'
        ]);

        $candidat = User::findOrFail($request->candidat_id);
        $monitor = User::findOrFail($request->monitor_id);

        // Vérifier que le candidat est bien un candidat
        if ($candidat->role !== 'candidate') {
            return response()->json(['status' => false, 'message' => 'Utilisateur sélectionné non candidat'], 400);
        }

        // Vérifier que le moniteur est bien un moniteur
        if ($monitor->role !== 'moniteur') {
            return response()->json(['status' => false, 'message' => 'Utilisateur sélectionné non moniteur'], 400);
        }

        // Vérifier la compatibilité des spécialités
        if ($monitor->specialite_permis && $candidat->categorie_permis) {
            $monitorPermis = strtoupper(trim($monitor->specialite_permis));
            $candidatPermis = strtoupper(trim($candidat->categorie_permis));
            
            // Vérification souple: égalité ou inclusion (ex: "B" dans "PERMIS B")
            $compatible = ($monitorPermis === $candidatPermis) || 
                          (str_contains($monitorPermis, $candidatPermis)) || 
                          (str_contains($candidatPermis, $monitorPermis));

            if (!$compatible) {
                return response()->json([
                    'status' => false,
                    'message' => "Incompatibilité: moniteur spécialité {$monitor->specialite_permis}, candidat permis {$candidat->categorie_permis}"
                ], 400);
            }
        }

        // Vérifier si l'assignation existe déjà
        if ($monitor->eleves()->where('candidat_id', $candidat->id)->exists()) {
            return response()->json(['status' => false, 'message' => 'Candidat déjà assigné à ce moniteur'], 400);
        }

        // Créer l'assignation
        $monitor->eleves()->attach($candidat->id, ['assigned_at' => now()]);

        return response()->json([
            'status' => true,
            'message' => "Candidat {$candidat->nom} {$candidat->prenom} assigné au moniteur {$monitor->nom} {$monitor->prenom}",
            'assignment' => [
                'monitor' => $monitor->only('id', 'nom', 'prenom'),
                'candidat' => $candidat->only('id', 'nom', 'prenom', 'categorie_permis'),
                'assigned_at' => now()
            ]
        ]);
    }

    /**
     * Retirer une assignation
     */
    public function unassignCandidate($monitorId, $candidatId)
    {
        // Vérifier que l'utilisateur est bien admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $monitor = User::findOrFail($monitorId);
        $candidat = User::findOrFail($candidatId);

        // Supprimer l'assignation
        $removed = $monitor->eleves()->detach($candidatId);

        if ($removed) {
            return response()->json([
                'status' => true,
                'message' => 'Assignation retirée avec succès'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Aucune assignation trouvée'
        ], 404);
    }

    /**
     * Récupérer toutes les assignations
     */
    public function getAssignments()
    {
        // Vérifier que l'utilisateur est bien admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Accès refusé'], 403);
        }

        $assignments = DB::table('monitor_candidat')
            ->join('users as monitor', 'monitor_candidat.monitor_id', '=', 'monitor.id')
            ->join('users as candidat', 'monitor_candidat.candidat_id', '=', 'candidat.id')
            ->select(
                'monitor_candidat.id as assignment_id',
                'monitor.id as monitor_id',
                'monitor.nom as monitor_nom',
                'monitor.prenom as monitor_prenom',
                'monitor.specialite_permis as monitor_specialite',
                'candidat.id as candidat_id',
                'candidat.nom as candidat_nom',
                'candidat.prenom as candidat_prenom',
                'candidat.categorie_permis as candidat_permis',
                'monitor_candidat.assigned_at',
                'monitor_candidat.created_at'
            )
            ->orderBy('monitor_candidat.created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'assignments' => $assignments
        ]);
    }
}
