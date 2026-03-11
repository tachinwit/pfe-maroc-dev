<?php

namespace App\Http\Controllers;

use App\Models\AiInteraction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    /**
     * Envoie un message à l'IA et enregistre l'interaction.
     *
     * POST /api/ai/chat
     * Body: { "message": "Votre question ici" }
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $userMessage = $request->input('message');
        $user        = $request->user();

        try {
            $aiResponse = $this->callAI($userMessage);
        } catch (\Exception $e) {
            Log::error('AI API error', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Le service IA est temporairement indisponible. Veuillez réessayer.',
            ], 503);
        }

        // Enregistrement en base de données
        AiInteraction::create([
            'user_id'       => $user->id,
            'user_message'  => $userMessage,
            'ai_response'   => $aiResponse,
        ]);

        // Récompense de points (+5 pour interaction IA)
        $user->rewardForAiInteraction();

        return response()->json([
            'response'    => $aiResponse,
            'points_earned' => 5,
            'total_points'  => $user->fresh()->points,
        ]);
    }

    /**
     * Appelle l'API IA configurée dans .env (Anthropic ou OpenAI).
     *
     * @throws \Exception si l'API échoue
     */
    private function callAI(string $message): string
    {
        $provider = config('ai.provider', 'anthropic'); // 'anthropic' ou 'openai'

        return match($provider) {
            'openai'    => $this->callOpenAI($message),
            'anthropic' => $this->callAnthropic($message),
            default     => throw new \InvalidArgumentException("Provider IA inconnu : {$provider}"),
        };
    }

    /**
     * Appel à l'API Claude (Anthropic)
     */
    private function callAnthropic(string $message): string
    {
        $apiKey = config('ai.anthropic_key');

        if (empty($apiKey)) {
            throw new \RuntimeException('Clé API Anthropic manquante dans .env (ANTHROPIC_API_KEY)');
        }

        $response = Http::withHeaders([
            'x-api-key'         => $apiKey,
            'anthropic-version' => '2023-06-01',
            'Content-Type'      => 'application/json',
        ])
        ->withoutVerifying()
        ->timeout(30)
        ->post('https://api.anthropic.com/v1/messages', [
            'model'      => 'claude-opus-4-5',
            'max_tokens' => 1024,
            'messages'   => [
                ['role' => 'user', 'content' => $message],
            ],
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('Anthropic API error: ' . $response->status() . ' - ' . $response->body());
        }

        $data = $response->json();

        return $data['content'][0]['text']
            ?? throw new \RuntimeException('Réponse Anthropic malformée.');
    }

    /**
     * Appel à l'API OpenAI
     */
    private function callOpenAI(string $message): string
    {
        $apiKey = config('ai.openai_key');

        if (empty($apiKey)) {
            throw new \RuntimeException('Clé API OpenAI manquante dans .env (OPENAI_API_KEY)');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type'  => 'application/json',
        ])
        ->withoutVerifying()
        ->timeout(30)
        ->post('https://api.openai.com/v1/chat/completions', [
            'model'    => 'gpt-4o',
            'messages' => [
                ['role' => 'user', 'content' => $message],
            ],
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('OpenAI API error: ' . $response->status() . ' - ' . $response->body());
        }

        $data = $response->json();

        return $data['choices'][0]['message']['content']
            ?? throw new \RuntimeException('Réponse OpenAI malformée.');
    }
}
