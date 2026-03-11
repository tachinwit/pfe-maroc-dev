<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ProjectController;

// Route pour afficher le forum
Route::get('/forum', [PostController::class, 'index'])->name('forum.index');

// Route temporaire pour l'Assistant IA
Route::get('/assistant-ia', function () {
    return view('assistant');
})->name('assistant.index');

// Routes protégées (utilisateur connecté requis)
Route::middleware('auth')->group(function () {
    // Assistant IA
    Route::post('/ai/chat', [AIController::class, 'chat'])->name('ai.chat');

    // Vitrine Projets
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects/from-github', [ProjectController::class, 'storeFromGithub'])->name('projects.from-github');
});