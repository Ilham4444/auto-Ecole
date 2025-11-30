<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('permis')) {
            Schema::create('permis', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('price');
                $table->string('hours');
                $table->text('description');
                $table->json('features'); // tableau JSON
                $table->timestamps();
            });
        }
    }

    public function down() {
        Schema::dropIfExists('permis');
    }
};
