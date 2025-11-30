<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->string('telephone');
            $table->string('carte_nationale')->unique();
            $table->text('adresse');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('methode_paiement', ['carte', 'virement'])->nullable();
            $table->enum('categorie_permis', ['A', 'A1', 'B', 'C', 'D', 'EC'])->nullable();
            $table->string('photo_identite')->nullable();
            $table->string('recto_carte')->nullable();
            $table->string('verso_carte')->nullable();
            $table->string('certificat_medical')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->enum('role', ['candidate', 'moniteur', 'admin'])->default('candidate');

        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
