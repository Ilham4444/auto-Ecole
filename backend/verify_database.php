<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "\n📊 État de la base de données:\n\n";

$admins = DB::table('users')->where('role', 'admin')->get();
echo "👤 Admins (" . $admins->count() . "):\n";
foreach ($admins as $user) {
    echo "   - {$user->prenom} {$user->nom} ({$user->email})\n";
}

echo "\n🚗 Moniteurs (" . DB::table('users')->where('role', 'moniteur')->count() . "):\n";
$moniteurs = DB::table('users')->where('role', 'moniteur')->get();
foreach ($moniteurs as $user) {
    echo "   - {$user->prenom} {$user->nom} - Permis {$user->specialite_permis} ({$user->email})\n";
}

echo "\n👥 Candidats (" . DB::table('users')->where('role', 'candidate')->count() . "):\n";
$candidats = DB::table('users')->where('role', 'candidate')->get();
foreach ($candidats as $user) {
    echo "   - {$user->prenom} {$user->nom} - Permis {$user->categorie_permis} ({$user->email})\n";
}

echo "\n✅ Configuration terminée!\n";
