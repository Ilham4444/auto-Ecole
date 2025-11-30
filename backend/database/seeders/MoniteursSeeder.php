<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MoniteursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $moniteurs = [
            [
                'nom' => 'El Amrani',
                'prenom' => 'Youssef',
                'email' => 'youssef@autoecole.com',
                'password' => Hash::make('password123'),
                'role' => 'moniteur',
                'telephone' => '0600000001',
                'adresse' => 'Casablanca',
                'date_naissance' => '1985-01-01',
                'carte_nationale' => 'A100001',
                'recto_carte_nationale' => 'default_recto.jpg',
                'verso_carte_nationale' => 'default_verso.jpg',
            ],
            [
                'nom' => 'Bennani',
                'prenom' => 'Fatima Zahra',
                'email' => 'fatima@autoecole.com',
                'password' => Hash::make('password123'),
                'role' => 'moniteur',
                'telephone' => '0600000002',
                'adresse' => 'Rabat',
                'date_naissance' => '1990-05-15',
                'carte_nationale' => 'A100002',
                'recto_carte_nationale' => 'default_recto.jpg',
                'verso_carte_nationale' => 'default_verso.jpg',
            ],
            [
                'nom' => 'Alaoui',
                'prenom' => 'Mohammed',
                'email' => 'mohammed@autoecole.com',
                'password' => Hash::make('password123'),
                'role' => 'moniteur',
                'telephone' => '0600000003',
                'adresse' => 'Fes',
                'date_naissance' => '1982-11-20',
                'carte_nationale' => 'A100003',
                'recto_carte_nationale' => 'default_recto.jpg',
                'verso_carte_nationale' => 'default_verso.jpg',
            ],
            [
                'nom' => 'El Idrissi',
                'prenom' => 'Karima',
                'email' => 'karima@autoecole.com',
                'password' => Hash::make('password123'),
                'role' => 'moniteur',
                'telephone' => '0600000004',
                'adresse' => 'Marrakech',
                'date_naissance' => '1988-03-10',
                'carte_nationale' => 'A100004',
                'recto_carte_nationale' => 'default_recto.jpg',
                'verso_carte_nationale' => 'default_verso.jpg',
            ],
        ];

        foreach ($moniteurs as $moniteur) {
            User::updateOrCreate(
                ['email' => $moniteur['email']], // Vérifie l'unicité par email
                $moniteur
            );
        }
    }
}
