<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('language')->nullable();
            $table->unsignedInteger('stars')->default(0);
            $table->string('github_url');
            $table->string('homepage')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'github_url']); // Pas de doublons par utilisateur
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
