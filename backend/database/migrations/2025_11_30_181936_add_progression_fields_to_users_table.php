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
            $table->integer('cours_completes')->default(0);
            $table->integer('conduite_completes')->default(0);
            $table->boolean('paiements_completes')->default(false);
            $table->boolean('examen_reussi')->default(false); // Examen final / conduite
            $table->boolean('examen_code')->default(false);   // Examen code
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'cours_completes',
                'conduite_completes',
                'paiements_completes',
                'examen_reussi',
                'examen_code'
            ]);
        });
    }
};
