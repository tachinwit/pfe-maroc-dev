<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Test rapide de la structure des données du Leaderboard ===\n\n";

// Tester les données du leaderboard mensuel
$monthlyTopThree = \App\Models\MonthlyPoint::getTopThree(2026, 3);
$monthlyLeaderboard = \App\Models\MonthlyPoint::getMonthlyLeaderboard(2026, 3, 5);

echo "Top 3 mensuel: " . $monthlyTopThree->count() . " éléments\n";
echo "Leaderboard mensuel: " . $monthlyLeaderboard->count() . " éléments\n";

// Tester les données du leaderboard global
$globalTopThree = \App\Models\User::orderBy('points', 'desc')->limit(3)->get();
$globalLeaderboard = \App\Models\User::orderBy('points', 'desc')->limit(5)->get();

echo "Top 3 global: " . $globalTopThree->count() . " éléments\n";
echo "Leaderboard global: " . $globalLeaderboard->count() . " éléments\n";

echo "\n✅ Test terminé avec succès!\n";