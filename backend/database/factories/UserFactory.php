<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = \App\Models\User::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->lastName,
            'prenom' => $this->faker->firstName,
            'date_naissance' => $this->faker->date('Y-m-d', '2000-01-01'),
            'telephone' => $this->faker->numerify('06########'),
            'carte_nationale' => $this->faker->unique()->numerify('#########'),
            'adresse' => $this->faker->address,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'),
            'methode_paiement' => $this->faker->randomElement(['carte','virement']),
            'categorie_permis' => $this->faker->randomElement(['A','A1','B','C','D','EC']),
        ];
    }
}
