<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MonthlyPoint;
use Illuminate\Database\Seeder;

class InitializeMonthlyPointsSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $currentYear = now()->year;
        $currentMonth = now()->month;

        foreach ($users as $user) {
            // Créer l'entrée mensuelle si elle n'existe pas
            MonthlyPoint::getOrCreateForUser($user, $currentYear, $currentMonth);
        }

        echo "Points mensuels initialisés pour " . $users->count() . " utilisateurs.\n";
    }
}
