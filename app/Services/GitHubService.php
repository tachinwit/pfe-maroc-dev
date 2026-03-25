<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GitHubService
{
    private const API_BASE = 'https://api.github.com/repos';
    private const CACHE_TTL = 3600; // 1 heure

    /**
     * Extrait les informations d'un dépôt GitHub depuis son URL.
     *
     * @param  string $url  Ex: "https://github.com/laravel/laravel"
     * @return array{name: string, description: string|null, language: string|null, stars: int, url: string}
     *
     * @throws \InvalidArgumentException si l'URL n'est pas une URL GitHub valide
     * @throws \RuntimeException si l'API GitHub échoue ou si le repo est introuvable
     */
    public function getRepoInfo(string $url): array
    {
        [$owner, $repo] = $this->parseGitHubUrl($url);

        $cacheKey = "github_repo_{$owner}_{$repo}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($owner, $repo, $url) {
            return $this->fetchFromApi($owner, $repo, $url);
        });
    }

    /**
     * Parse une URL GitHub et retourne [owner, repo].
     *
     * @throws \InvalidArgumentException
     */
    public function parseGitHubUrl(string $url): array
    {
        // Accepte : https://github.com/owner/repo ou https://github.com/owner/repo.git
        $pattern = '/^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(\.git)?(?:\/.*)?$/';

        if (!preg_match($pattern, trim($url), $matches)) {
            throw new \InvalidArgumentException(
                "L'URL fournie n'est pas une URL GitHub valide. Format attendu : https://github.com/owner/repository"
            );
        }

        return [$matches[1], $matches[2]];
    }

    /**
     * Effectue l'appel à l'API GitHub.
     *
     * @throws \RuntimeException
     */
    private function fetchFromApi(string $owner, string $repo, string $originalUrl): array
    {
        $headers = [
            'Accept'     => 'application/vnd.github.v3+json',
            'User-Agent' => 'Laravel-App',
        ];

        // Optionnel : authentification pour éviter les rate limits
        $token = config('services.github.token');
        if ($token) {
            $headers['Authorization'] = "Bearer {$token}";
        }

        $response = Http::withHeaders($headers)
            ->withoutVerifying()
            ->timeout(10)
            ->get(self::API_BASE . "/{$owner}/{$repo}");

        if ($response->status() === 404) {
            throw new \RuntimeException("Le dépôt GitHub \"{$owner}/{$repo}\" est introuvable ou privé.");
        }

        if ($response->failed()) {
            throw new \RuntimeException('Impossible de contacter l\'API GitHub. Code : ' . $response->status());
        }

        $data = $response->json();

        return [
            'name'        => $data['name'],
            'full_name'   => $data['full_name'],
            'description' => $data['description'],
            'language'    => $data['language'],
            'stars'       => $data['stargazers_count'] ?? 0,
            'forks'       => $data['forks_count'] ?? 0,
            'url'         => $data['html_url'],
            'homepage'    => $data['homepage'] ?? null,
            'topics'      => $data['topics'] ?? [],
        ];
    }
}
