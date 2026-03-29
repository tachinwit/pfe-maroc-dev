<?php

namespace App\Traits;

/**
 * Configuration des points - Système Anti-Spam
 *
 * Points uniquement pour contenu utile et engagement positif
 */
class PointsConfig
{
    const UPVOTE_RECEIVED = 5;   // Vote positif reçu
    const DOWNVOTE_RECEIVED = 2; // Pénalité pour vote négatif reçu
    const BEST_ANSWER = 20;      // Commentaire marqué comme meilleure réponse

    // Anciens gains désactivés pour prévention du farming
    const FORUM_POST = 0;        // Plus de points automatiques pour posts
    const PROJECT_SHARE = 0;     // Plus de points automatiques pour projets
    const AI_INTERACTION = 0;    // Plus de points pour IA (prévention farming)
}
