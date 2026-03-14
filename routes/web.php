<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/forum', [PostController::class, 'index'])->name('forum');
Route::get('/ai', function () { return Inertia::render('AIAssistantPage'); })->name('ai');
Route::get('/events', function () { return Inertia::render('EventsOpportunitiesPage'); })->name('events');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Auth protected routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/ai/chat', [AIController::class, 'chat'])->name('ai.chat');

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects/from-github', [ProjectController::class, 'storeFromGithub'])->name('projects.store');

    Route::post('/forum/posts', [PostController::class, 'store'])->name('forum.store');
});

require __DIR__.'/auth.php';
