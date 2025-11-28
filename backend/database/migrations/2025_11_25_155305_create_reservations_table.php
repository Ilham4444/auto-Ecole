<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('permis_id')->constrained()->onDelete('cascade');
            $table->string('monitor'); // Séance de code ou conduite
            $table->date('date');
            $table->time('time');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('reservations');
    }
};