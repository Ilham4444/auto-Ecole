<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'nom')) {
                $table->string('nom')->after('id');
            }

            if (!Schema::hasColumn('users', 'prenom')) {
                $table->string('prenom')->after('nom');
            }

            if (!Schema::hasColumn('users', 'date_naissance')) {
                $table->date('date_naissance')->after('prenom');
            }

            if (!Schema::hasColumn('users', 'telephone')) {
                $table->string('telephone')->after('date_naissance');
            }

            if (!Schema::hasColumn('users', 'carte_nationale')) {
                $table->string('carte_nationale')->unique()->after('telephone');
            }

            if (!Schema::hasColumn('users', 'adresse')) {
                $table->text('adresse')->after('carte_nationale');
            }

            if (!Schema::hasColumn('users', 'methode_paiement')) {
                $table->enum('methode_paiement', ['carte', 'virement'])->nullable()->after('password');
            }

            if (!Schema::hasColumn('users', 'categorie_permis')) {
                $table->enum('categorie_permis', ['A', 'A1', 'B', 'C', 'D', 'EC'])->nullable()->after('methode_paiement');
            }

            if (!Schema::hasColumn('users', 'photo_identite')) {
                $table->string('photo_identite')->nullable()->after('categorie_permis');
            }

            if (!Schema::hasColumn('users', 'recto_carte_nationale')) {
                $table->string('recto_carte_nationale')->nullable()->after('photo_identite');
            }

            if (!Schema::hasColumn('users', 'verso_carte_nationale')) {
                $table->string('verso_carte_nationale')->nullable()->after('recto_carte_nationale');
            }

            if (!Schema::hasColumn('users', 'certificat_medical')) {
                $table->string('certificat_medical')->nullable()->after('verso_carte_nationale');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'nom',
                'prenom',
                'date_naissance',
                'telephone',
                'carte_nationale',
                'adresse',
                'methode_paiement',
                'categorie_permis',
                'photo_identite',
                'recto_carte_nationale',
                'verso_carte_nationale',
                'certificat_medical',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
