<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
         $this->call([
            // UserSeeder::class, // Commented out to avoid random users for now
            MoniteursSeeder::class,
            PermisSeeder::class,
        ]);

        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@autoecole.com'],
            [
                'nom' => 'Admin',
                'prenom' => 'System',
                'email' => 'admin@autoecole.com',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'telephone' => '0600000000',
                'adresse' => 'Siege',
                'date_naissance' => '1980-01-01',
                'carte_nationale' => 'ADMIN001',
            ]
        );

        // Create 3 Candidates for testing
        User::updateOrCreate(
            ['email' => 'candidat@test.com'],
            [
                'nom' => 'Candidat',
                'prenom' => 'Test',
                'email' => 'candidat@test.com',
                'password' => bcrypt('password123'),
                'role' => 'candidate',
                'telephone' => '0699999999',
                'adresse' => 'Test Address',
                'date_naissance' => '2000-01-01',
                'carte_nationale' => 'CAND001',
                'categorie_permis' => 'B',
            ]
        );

        User::updateOrCreate(
            ['email' => 'candidat2@test.com'],
            [
                'nom' => 'Dupont',
                'prenom' => 'Marie',
                'email' => 'candidat2@test.com',
                'password' => bcrypt('password123'),
                'role' => 'candidate',
                'telephone' => '0688888888',
                'adresse' => '15 Rue de la Liberté',
                'date_naissance' => '1999-05-15',
                'carte_nationale' => 'CAND002',
                'categorie_permis' => 'A',
            ]
        );

        User::updateOrCreate(
            ['email' => 'candidat3@test.com'],
            [
                'nom' => 'Martin',
                'prenom' => 'Ahmed',
                'email' => 'candidat3@test.com',
                'password' => bcrypt('password123'),
                'role' => 'candidate',
                'telephone' => '0677777777',
                'adresse' => '42 Avenue des Écoles',
                'date_naissance' => '2001-11-30',
                'carte_nationale' => 'CAND003',
                'categorie_permis' => 'C',
            ]
        );
    }
   

}
