<?php

// config/ai.php
// Chargé automatiquement par Laravel via config('ai.xxx')

return [
    /*
    |--------------------------------------------------------------------------
    | Provider IA actif
    |--------------------------------------------------------------------------
    | Valeurs possibles : 'anthropic', 'openai'
    | Modifiable dans .env via : AI_PROVIDER=anthropic
    */
    'provider' => env('AI_PROVIDER', 'anthropic'),

    /*
    |--------------------------------------------------------------------------
    | Clés API
    |--------------------------------------------------------------------------
    */
    'anthropic_key' => env('ANTHROPIC_API_KEY'),
    'openai_key'    => env('OPENAI_API_KEY'),
];
