<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use App\Models\User;

echo "🔧 Création de la table monitor_candidat...\n";

// Créer la table monitor_candidat si elle n'existe pas
if (!Schema::hasTable('monitor_candidat')) {
    Schema::create('monitor_candidat', function (Blueprint $table) {
        $table->id();
        $table->foreignId('monitor_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('candidat_id')->constrained('users')->onDelete('cascade');
        $table->timestamp('assigned_at')->useCurrent();
        $table->timestamps();
        
        // Empêcher les doublons (un candidat ne peut être assigné qu'une fois à un moniteur)
        $table->unique(['monitor_id', 'candidat_id']);
    });
    echo "✅ Table monitor_candidat créée avec succès!\n";
} else {
    echo "ℹ️  Table monitor_candidat existe déjà.\n";
}

echo "\n🔧 Insertion des candidats de test...\n";

// Créer les 3 candidats
$candidats = [
    [
        'email' => 'candidat@test.com',
        'nom' => 'Candidat',
        'prenom' => 'Test',
        'password' => bcrypt('password123'),
        'role' => 'candidate',
        'telephone' => '0699999999',
        'adresse' => 'Test Address',
        'date_naissance' => '2000-01-01',
        'carte_nationale' => 'CAND001',
        'categorie_permis' => 'B',
    ],
    [
        'email' => 'candidat2@test.com',
        'nom' => 'Dupont',
        'prenom' => 'Marie',
        'password' => bcrypt('password123'),
        'role' => 'candidate',
        'telephone' => '0688888888',
        'adresse' => '15 Rue de la Liberté',
        'date_naissance' => '1999-05-15',
        'carte_nationale' => 'CAND002',
        'categorie_permis' => 'A',
    ],
    [
        'email' => 'candidat3@test.com',
        'nom' => 'Martin',
        'prenom' => 'Ahmed',
        'password' => bcrypt('password123'),
        'role' => 'candidate',
        'telephone' => '0677777777',
        'adresse' => '42 Avenue des Écoles',
        'date_naissance' => '2001-11-30',
        'carte_nationale' => 'CAND003',
        'categorie_permis' => 'C',
    ]
];

foreach ($candidats as $candidatData) {
    $candidat = User::updateOrCreate(
        ['email' => $candidatData['email']],
        $candidatData
    );
    echo "✅ Candidat créé/mis à jour: {$candidat->nom} {$candidat->prenom} (Permis {$candidat->categorie_permis})\n";
}

echo "\n🎉 Opération terminée avec succès!\n";
echo "\n📊 Résumé:\n";
echo "   - Table monitor_candidat: " . (Schema::hasTable('monitor_candidat') ? "Existe" : "N'existe pas") . "\n";
echo "   - Nombre de candidats: " . User::where('role', 'candidate')->count() . "\n";
echo "   - Nombre de moniteurs: " . User::where('role', 'moniteur')->count() . "\n";
