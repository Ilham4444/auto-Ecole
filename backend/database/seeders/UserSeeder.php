<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Générer 10 utilisateurs
        User::factory()->count(10)->create();
    }
}

