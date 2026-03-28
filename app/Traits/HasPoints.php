<?php

namespace App\Traits;

use App\Traits\PointsConfig;

/**
 * Trait HasPoints
 * 
 * Gère la logique de réputation/gamification pour les utilisateurs.
 * Usage : ajouter `use HasPoints;` dans le modèle User.php
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
     * +10 points : Nouveau post sur le forum
     */
    public function rewardForForumPost(): void
    {
        $this->addPoints(PointsConfig::FORUM_POST);
    }

    /**
     * +20 points : Partage d'un projet
     */
    public function rewardForProjectShare(): void
    {
        $this->addPoints(PointsConfig::PROJECT_SHARE);
    }

    /**
     * +5 points : Interaction avec l'Assistant IA
     */
    public function rewardForAiInteraction(): void
    {
        $this->addPoints(PointsConfig::AI_INTERACTION);
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
