<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Add monitor assignment
            if (!Schema::hasColumn('reservations', 'monitor_id')) {
                $table->foreignId('monitor_id')->nullable()->constrained('users')->onDelete('set null');
            }
            
            // Add admin status tracking
            if (!Schema::hasColumn('reservations', 'admin_status')) {
                $table->string('admin_status')->default('pending'); // pending, accepted, rejected
            }
            
            // Add monitor status tracking
            if (!Schema::hasColumn('reservations', 'monitor_status')) {
                $table->string('monitor_status')->nullable(); // null, pending, accepted, rejected
            }
            
            // Add index for performance
            $table->index('monitor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['monitor_id']);
            $table->dropColumn(['monitor_id', 'admin_status', 'monitor_status']);
        });
    }
};
