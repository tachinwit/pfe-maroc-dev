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
        // Ajouter un index composite pour optimiser la recherche de doublons d'opportunités
        // Vérification : entreprise + titre + type (avec contrainte temporelle de 30 jours)
        Schema::table('opportunities', function (Blueprint $table) {
            $table->index(['company', 'title', 'type', 'created_at'], 'idx_opportunities_duplicates_check');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->dropIndex('idx_opportunities_duplicates_check');
        });
    }
};