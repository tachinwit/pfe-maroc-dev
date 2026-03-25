<?php

// config/ai.php
// Chargé automatiquement par Laravel via config('ai.xxx')

return [
    /*
    |--------------------------------------------------------------------------
    | Provider IA actif
    |--------------------------------------------------------------------------
    | Valeurs possibles : 'anthropic', 'openai', 'groq'
    | Modifiable dans .env via : AI_PROVIDER=anthropic
    */
    'provider' => env('AI_PROVIDER', 'groq'),

    /*
    |--------------------------------------------------------------------------
    | Clés API
    |--------------------------------------------------------------------------
    */
    'anthropic_key' => env('ANTHROPIC_API_KEY'),
    'openai_key'    => env('OPENAI_API_KEY'),
    'groq_key'      => env('GROQ_API_KEY'),
];
