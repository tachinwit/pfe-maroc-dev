<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\MonthlyPoint;
use Illuminate\Foundation\Application;
use Illuminate\Contracts\Console\Kernel;

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

echo "=== Test du Leaderboard avec données réelles ===\n\n";

// Créer quelques utilisateurs de test
$users = [
    ['name' => 'Alice Dupont', 'email' => 'alice@example.com'],
    ['name' => 'Bob Martin', 'email' => 'bob@example.com'],
    ['name' => 'Charlie Brown', 'email' => 'charlie@example.com'],
    ['name' => 'Diana Prince', 'email' => 'diana@example.com'],
    ['name' => 'Eve Wilson', 'email' => 'eve@example.com'],
];

$createdUsers = [];
foreach ($users as $userData) {
    $user = User::firstOrCreate(
        ['email' => $userData['email']],
        array_merge($userData, [
            'password' => bcrypt('password123'),
            'points' => 0,
            'rank' => 'Débutant'
        ])
    );
    $createdUsers[] = $user;
    echo "Utilisateur créé: {$user->name} (ID: {$user->id})\n";
}

echo "\n=== Simulation d'interactions ===\n";

// Simuler des points gagnés ce mois-ci
$interactions = [
    0 => 150, // Alice: 150 points
    1 => 200, // Bob: 200 points
    2 => 120, // Charlie: 120 points
    3 => 180, // Diana: 180 points
    4 => 90,  // Eve: 90 points
];

foreach ($interactions as $index => $points) {
    $user = $createdUsers[$index];
    // Ajouter les points via le trait HasPoints (qui met à jour MonthlyPoint)
    $user->addPoints($points);
    echo "Ajouté {$points} points à {$user->name}\n";
}

echo "\n=== Vérification des points mensuels ===\n";

$currentMonth = now()->format('Y-m');
foreach ($createdUsers as $user) {
    $monthlyPoint = MonthlyPoint::where('user_id', $user->id)
        ->where('month', $currentMonth)
        ->first();

    $monthlyPoints = $monthlyPoint ? $monthlyPoint->points : 0;
    echo "{$user->name}: {$monthlyPoints} points mensuels\n";
}

echo "\n=== Top 3 du mois ===\n";

$topThree = MonthlyPoint::getTopThree();
foreach ($topThree as $entry) {
    static $position = 1;
    echo "{$position}. {$entry->user->name}: {$entry->points_earned} points\n";
    $position++;
}

echo "\n=== Classement complet ===\n";

$leaderboard = MonthlyPoint::getMonthlyLeaderboard();
foreach ($leaderboard as $entry) {
    static $pos = 1;
    echo "{$pos}. {$entry->user->name}: {$entry->points_earned} points\n";
    $pos++;
}

echo "\n=== Test terminé avec succès ! ===\n";