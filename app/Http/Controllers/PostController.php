<?php

namespace App\Http\Controllers;

use App\Http\Controllers\PostController;

// Route pour afficher le forum
Route::get('/forum', [PostController::class, 'index'])->name('forum.index');

// Route temporaire pour l'Assistant IA
Route::get('/assistant-ia', function () {
    return view('assistant');
})->name('assistant.index');