<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Schema\Blueprint;

echo "🔧 Configuration de la base de données...\n\n";

try {
    // Ajouter la colonne specialite_permis si elle n'existe pas
    if (!Schema::hasColumn('users', 'specialite_permis')) {
        echo "📝 Ajout de la colonne specialite_permis...\n";
        Schema::table('users', function (Blueprint $table) {
            $table->string('specialite_permis', 10)->nullable();
        });
        echo "✅ Colonne specialite_permis ajoutée!\n\n";
    }

    // Créer l'admin
    echo "👤 Création de l'admin...\n";
    $adminCount = DB::table('users')->where('email', 'admin@autoecole.com')->count();
    if ($adminCount == 0) {
        DB::statement("INSERT INTO users (nom, prenom, email, password, role, telephone, adresse, date_naissance, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())", [
            'Admin', 'System', 'admin@autoecole.com', Hash::make('password123'), 'admin', '0600000000', 'Siege', '1980-01-01'
        ]);
        echo "✅ Admin créé\n\n";
    } else {
        echo "ℹ️  Admin existe déjà\n\n";
    }

    // Créer les moniteurs
    echo "🚗 Création des moniteurs...\n";
    
    $moniteurs = [
        ['Youssef', 'El Amrani', 'youssef@autoecole.com', 'B', '0600000001', 'Casablanca', '1985-01-01'],
        ['Fatima', 'Bennani', 'fatima@autoecole.com', 'B', '0600000002', 'Rabat', '1990-05-15'],
        ['Mohammed', 'Alaoui', 'mohammed@autoecole.com', 'A', '0600000003', 'Fes', '1982-11-20'],
        ['Karima', 'El Idrissi', 'karima@autoecole.com', 'C', '0600000004', 'Marrakech', '1988-03-10'],
    ];

    foreach ($moniteurs as $m) {
        $exists = DB::table('users')->where('email', $m[2])->exists();
        if (!$exists) {
            DB::statement("INSERT INTO users (prenom, nom, email, password, role, telephone, adresse, date_naissance, specialite_permis, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())", [
                $m[0], $m[1], $m[2], Hash::make('password123'), 'moniteur', $m[4], $m[5], $m[6], $m[3]
            ]);
            echo "✅ {$m[0]} {$m[1]} (Permis {$m[3]})\n";
        } else {
            DB::table('users')->where('email', $m[2])->update(['specialite_permis' => $m[3], 'role' => 'moniteur']);
            echo "ℹ️  {$m[0]} {$m[1]} mis à jour\n";
        }
    }

    echo "\n🎉 Terminé!\n\n";
    echo "📊 Base de données:\n";
    echo "   Admins: " . DB::table('users')->where('role', 'admin')->count() . "\n";
    echo "   Moniteurs: " . DB::table('users')->where('role', 'moniteur')->count() . "\n";
    echo "   Candidats: " . DB::table('users')->where('role', 'candidate')->count() . "\n\n";

    echo "🔑 Identifiants:\n";
    echo "   Admin: admin@autoecole.com / password123\n";
    echo "   Moniteurs: */password123 (youssef, fatima, mohammed, karima)\n";

} catch (\Exception $e) {
    echo "\n❌ Erreur: " . $e->getMessage() . "\n";
}
