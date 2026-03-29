<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class TestGamificationSeeder extends Seeder
{
    public function run()
    {
        // Créer 3 utilisateurs de test
        $user1 = User::create([
            'name' => 'Alice Dupont',
            'email' => 'alice@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'points' => 0
        ]);

        $user2 = User::create([
            'name' => 'Bob Martin',
            'email' => 'bob@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'points' => 0
        ]);

        $user3 = User::create([
            'name' => 'Charlie Brown',
            'email' => 'charlie@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'points' => 0
        ]);

        // User1 crée un post
        $post = Post::create([
            'user_id' => $user1->id,
            'title' => 'Comment optimiser les performances Laravel ?',
            'content' => 'Je cherche des conseils pour améliorer les performances de mon application Laravel. Voici ce que j\'ai déjà essayé...',
            'category' => 'development'
        ]);

        // User2 commente sur le post
        $comment1 = Comment::create([
            'user_id' => $user2->id,
            'post_id' => $post->id,
            'content' => 'Utilisez le cache ! Laravel a d\'excellents outils de cache intégrés.'
        ]);

        // User3 commente aussi
        $comment2 = Comment::create([
            'user_id' => $user3->id,
            'post_id' => $post->id,
            'content' => 'N\'oubliez pas d\'optimiser vos requêtes N+1 avec eager loading.'
        ]);

        // User1 vote positivement sur le commentaire de User2 (+5 points pour User2)
        Vote::create([
            'user_id' => $user1->id,
            'votable_id' => $comment1->id,
            'votable_type' => Comment::class,
            'type' => 1
        ]);
        $user2->rewardForUpvote();

        // User3 vote positivement sur le commentaire de User2 (+5 points pour User2)
        Vote::create([
            'user_id' => $user3->id,
            'votable_id' => $comment1->id,
            'votable_type' => Comment::class,
            'type' => 1
        ]);
        $user2->rewardForUpvote();

        // User1 vote positivement sur le commentaire de User3 (+5 points pour User3)
        Vote::create([
            'user_id' => $user1->id,
            'votable_id' => $comment2->id,
            'votable_type' => Comment::class,
            'type' => 1
        ]);
        $user3->rewardForUpvote();

        // User1 marque le commentaire de User2 comme best answer (+20 points pour User2)
        $comment1->update(['is_best_answer' => true]);
        $user2->rewardForBestAnswer();

        // Afficher les résultats
        echo "=== RÉSULTATS DE LA SIMULATION ===\n";
        echo "User1 (Alice): {$user1->fresh()->points} points - Niveau: {$user1->fresh()->level}\n";
        echo "User2 (Bob): {$user2->fresh()->points} points - Niveau: {$user2->fresh()->level}\n";
        echo "User3 (Charlie): {$user3->fresh()->points} points - Niveau: {$user3->fresh()->level}\n";
        echo "\n=== DÉTAIL DES ACTIONS ===\n";
        echo "- User2 a reçu 2 upvotes (+10 points) + Best Answer (+20 points) = 30 points\n";
        echo "- User3 a reçu 1 upvote (+5 points) = 5 points\n";
        echo "- User1 a créé le post et voté (0 points)\n";
    }
}
