<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('national_id')->nullable(); // N° Carte Nationale
            $table->text('address')->nullable();
            $table->string('category')->nullable(); // Catégorie de permis (A, B, etc.)
            $table->string('payment_method')->nullable(); // 'card' ou 'transfer'
            $table->json('documents')->nullable(); // JSON pour stocker les chemins des fichiers uploadés
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'birth_date', 'national_id', 'address', 'category', 'payment_method', 'documents']);
        });
    }
};
