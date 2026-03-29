<?php

namespace App\Traits;

use App\Traits\PointsConfig;

/**
 * Trait HasPoints - Gamification Anti-Spam
 *
 * Nouveau système : Points uniquement pour contenu utile
 * - +5 points par vote positif reçu
 * - +20 points si commentaire marqué comme Best Answer
 * - -2 points par vote négatif reçu
 *
 * Supprimé : Gains automatiques pour posts/comments et IA
 */
trait HasPoints
{
    /**
     * Ajoute des points à l'utilisateur.
     */
    public function addPoints(int $amount): void
    {
        $this->increment('points', $amount);
    }

    /**
     * Retire des points à l'utilisateur (minimum 0).
     */
    public function removePoints(int $amount): void
    {
        $newTotal = max(0, $this->points - $amount);
        $this->update(['points' => $newTotal]);
    }

    /**
     * +5 points : Vote positif reçu sur son contenu
     */
    public function rewardForUpvote(): void
    {
        $this->addPoints(PointsConfig::UPVOTE_RECEIVED);
    }

    /**
     * -2 points : Vote négatif reçu sur son contenu
     */
    public function penalizeForDownvote(): void
    {
        $this->removePoints(PointsConfig::DOWNVOTE_RECEIVED);
    }

    /**
     * +20 points : Commentaire marqué comme Best Answer
     */
    public function rewardForBestAnswer(): void
    {
        $this->addPoints(PointsConfig::BEST_ANSWER);
    }

    /**
     * Retourne le niveau de l'utilisateur basé sur ses points.
     */
    public function getLevel(): string
    {
        return match(true) {
            $this->points >= 1000 => 'Expert',
            $this->points >= 500  => 'Avancé',
            $this->points >= 200  => 'Confirmé',
            $this->points >= 50   => 'Débutant',
            default               => 'Novice',
        };
    }

    /**
     * Accessor pour récupérer le niveau via $user->level
     */
    public function getLevelAttribute(): string
    {
        return $this->getLevel();
    }
}
