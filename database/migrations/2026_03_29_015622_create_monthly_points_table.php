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
        Schema::create('monthly_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('points_earned')->default(0); // Points gagnés ce mois
            $table->integer('total_points')->default(0); // Total des points de l'utilisateur
            $table->year('year');
            $table->tinyInteger('month'); // 1-12
            $table->timestamps();

            $table->unique(['user_id', 'year', 'month']); // Un enregistrement par user/mois
            $table->index(['year', 'month', 'points_earned']); // Pour les classements
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_points');
    }
};
