<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Post::create([
        'title' => 'Comment gérer l\'authentification JWT avec Laravel ?',
        'content' => 'Je cherche la meilleure approche pour mon PFE...',
        'user_id' => 1, // Assurez-vous d'avoir créé un utilisateur via /register d'abord
        'category' => 'Laravel'
    ]);
}
}
