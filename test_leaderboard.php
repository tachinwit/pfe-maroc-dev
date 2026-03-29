<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user1 = App\Models\User::where('email', 'alice@example.com')->first();
$user2 = App\Models\User::where('email', 'bob@example.com')->first();

if ($user1 && $user2) {
    echo "Test des points mensuels:\n";

    $monthly = App\Models\MonthlyPoint::where('user_id', $user2->id)->where('year', 2026)->where('month', 3)->first();
    echo 'Points mensuels pour ' . $user2->name . ': ' . ($monthly ? $monthly->points_earned : 0) . "\n";

    $top3 = App\Models\MonthlyPoint::getTopThree();
    echo "Top 3 du mois:\n";
    foreach ($top3 as $entry) {
        echo '- ' . $entry->user->name . ': ' . $entry->points_earned . ' points' . "\n";
    }
} else {
    echo "Utilisateurs de test non trouvés.\n";
}