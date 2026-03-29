<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Test de l'intégration du Leaderboard dans DevelopersPage ===\n\n";

// Simuler une requête à la route /developers
$request = Illuminate\Http\Request::create('/developers', 'GET');
$response = app()->handle($request);

// Vérifier que la réponse contient les données du leaderboard
$content = $response->getContent();

if (strpos($content, 'leaderboard') !== false) {
    echo "✅ Les données du leaderboard sont présentes dans la réponse\n";
} else {
    echo "❌ Les données du leaderboard ne sont pas trouvées\n";
}

if (strpos($content, 'monthly') !== false) {
    echo "✅ Données mensuelles trouvées\n";
} else {
    echo "❌ Données mensuelles manquantes\n";
}

if (strpos($content, 'global') !== false) {
    echo "✅ Données globales trouvées\n";
} else {
    echo "❌ Données globales manquantes\n";
}

if (strpos($content, 'top_three') !== false) {
    echo "✅ Top 3 trouvé\n";
} else {
    echo "❌ Top 3 manquant\n";
}

echo "\nTest terminé.\n";