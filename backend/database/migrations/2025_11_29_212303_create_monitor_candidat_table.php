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
        Schema::create('monitor_candidat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('candidat_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();
            
            // Empêcher les doublons (un candidat ne peut être assigné qu'une fois à un moniteur)
            $table->unique(['monitor_id', 'candidat_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitor_candidat');
    }
};
