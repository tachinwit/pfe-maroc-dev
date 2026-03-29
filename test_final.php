<?php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\MonthlyPoint;
use Illuminate\Foundation\Application;
use Illuminate\Contracts\Console\Kernel;

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

echo "=== Test final du Leaderboard ===\n\n";

// Créer quelques utilisateurs réalistes
$users = [
    ['name' => 'Ahmed Bennani', 'email' => 'ahmed@example.com'],
    ['name' => 'Fatima Alaoui', 'email' => 'fatima@example.com'],
    ['name' => 'Youssef Tazi', 'email' => 'youssef@example.com'],
    ['name' => 'Sara El Amrani', 'email' => 'sara@example.com'],
    ['name' => 'Karim Bouazza', 'email' => 'karim@example.com'],
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
    echo "✓ {$user->name} créé\n";
}

echo "\n=== Simulation d'interactions réalistes ===\n";

// Simuler des interactions réalistes (votes, best answers, etc.)
$interactions = [
    // Ahmed: Actif sur le forum
    0 => [25, 15, 30, 10], // 4 votes positifs + 1 best answer = 80 points

    // Fatima: Bonne contributrice
    1 => [20, 25, 20], // 3 votes positifs = 65 points

    // Youssef: Très actif
    2 => [30, 25, 35, 15, 20], // 5 votes positifs = 125 points

    // Sara: Moderately active
    3 => [15, 20, 10], // 3 votes positifs = 45 points

    // Karim: Nouveau mais prometteur
    4 => [10, 15], // 2 votes positifs = 25 points
];

foreach ($interactions as $userIndex => $pointsList) {
    $user = $createdUsers[$userIndex];
    $totalPoints = array_sum($pointsList);

    foreach ($pointsList as $points) {
        $user->addPoints($points);
    }

    echo "✓ {$user->name}: {$totalPoints} points gagnés\n";
}

echo "\n=== Résultats du mois ===\n";

$currentMonth = now()->format('Y-m');
$monthlyRecords = MonthlyPoint::where('year', now()->year)
    ->where('month', now()->month)
    ->with('user')
    ->orderBy('points_earned', 'desc')
    ->get();

echo "Participants ce mois: " . $monthlyRecords->count() . "\n\n";

echo "🏆 CLASSEMENT MENSUEL 🏆\n";
echo str_repeat("=", 40) . "\n";

$position = 1;
foreach ($monthlyRecords as $record) {
    $medal = match($position) {
        1 => "🥇",
        2 => "🥈",
        3 => "🥉",
        default => "  "
    };

    echo sprintf("%s %-2d. %-15s %3d points\n",
        $medal,
        $position,
        $record->user->name,
        $record->points_earned
    );
    $position++;
}

echo "\n=== Test terminé - Interface prête ! ===\n";
echo "📊 Accédez au leaderboard: http://127.0.0.1:8000/leaderboard\n";