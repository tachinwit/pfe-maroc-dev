<?php

namespace App\Traits;

/**
 * Centralise les valeurs de points pour faciliter la maintenance.
 * Modifiez ces constantes pour ajuster la balance du jeu.
 */
class PointsConfig
{
    const FORUM_POST     = 0;   // Nouveau post sur le forum
    const PROJECT_SHARE  = 5;   // Partage d'un projet
    const AI_INTERACTION = 0;   // Interaction avec l'Assistant IA
    const BEST_ANSWER    = 10;  // Meilleure réponse choisie
}
