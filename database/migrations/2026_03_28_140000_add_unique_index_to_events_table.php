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
        // Ajouter un index unique pour prévenir les doublons d'événements
        // Un événement est considéré comme doublon s'il a le même titre, date et lieu
        Schema::table('events', function (Blueprint $table) {
            $table->unique(['title', 'date', 'location'], 'unique_event_title_date_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique('unique_event_title_date_location');
        });
    }
};