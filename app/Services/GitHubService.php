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
     * Récupère les données d'aperçu d'un dépôt ou d'un utilisateur.
     */
    public function getPreviewData(string $url): array
    {
        $url = trim($url, '/');
        
        // Pattern pour User : https://github.com/username
        // Pattern pour Repo : https://github.com/username/repo
        $patternRepo = '/^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/';
        $patternUser = '/^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)$/';

        if (preg_match($patternRepo, $url, $matches)) {
            return [
                'type' => 'repo',
                'data' => $this->getRepoInfo($url)
            ];
        }

        if (preg_match($patternUser, $url, $matches)) {
            return [
                'type' => 'user',
                'data' => $this->getUserInfo($matches[1])
            ];
        }

        throw new \InvalidArgumentException("URL GitHub non supportée pour l'aperçu.");
    }

    public function getUserInfo(string $username): array
    {
        $cacheKey = "github_user_{$username}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($username) {
            $response = Http::withHeaders($this->getHeaders())
                ->withoutVerifying()
                ->get("https://api.github.com/users/{$username}");

            if ($response->failed()) {
                throw new \RuntimeException("Utilisateur GitHub introuvable.");
            }

            $data = $response->json();

            // Récupérer aussi les repos populaires
            $reposResponse = Http::withHeaders($this->getHeaders())
                ->withoutVerifying()
                ->get("https://api.github.com/users/{$username}/repos?sort=updated&per_page=5");
            
            return [
                'login'       => $data['login'],
                'name'        => $data['name'] ?? $data['login'],
                'avatar_url'  => $data['avatar_url'],
                'bio'         => $data['bio'],
                'location'    => $data['location'],
                'public_repos'=> $data['public_repos'],
                'followers'   => $data['followers'],
                'following'   => $data['following'],
                'html_url'    => $data['html_url'],
                'recent_repos'=> $reposResponse->json(),
            ];
        });
    }

    private function getHeaders(): array
    {
        $headers = [
            'Accept'     => 'application/vnd.github.v3+json',
            'User-Agent' => 'Laravel-App',
        ];

        $token = config('services.github.token');
        if ($token) {
            $headers['Authorization'] = "Bearer {$token}";
        }

        return $headers;
    }

    /**
     * Parse une URL GitHub et retourne [owner, repo].
     */
    public function parseGitHubUrl(string $url): array
    {
        $pattern = '/^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(\.git)?(?:\/.*)?$/';

        if (!preg_match($pattern, trim($url), $matches)) {
            throw new \InvalidArgumentException("URL non valide.");
        }

        return [$matches[1], $matches[2]];
    }

    private function fetchFromApi(string $owner, string $repo, string $originalUrl): array
    {
        $response = Http::withHeaders($this->getHeaders())
            ->withoutVerifying()
            ->timeout(10)
            ->get(self::API_BASE . "/{$owner}/{$repo}");

        if ($response->failed()) {
            throw new \RuntimeException('Dépôt introuvable.');
        }

        $data = $response->json();

        // Essayer de récupérer le README (snippet)
        $readme = "";
        try {
            $readmeResponse = Http::withHeaders($this->getHeaders())
                ->withoutVerifying()
                ->get(self::API_BASE . "/{$owner}/{$repo}/readme");
            if ($readmeResponse->successful()) {
                $readme = base64_decode($readmeResponse->json()['content']);
                $readme = mb_substr($readme, 0, 1000) . '...'; // On limite pour l'aperçu
            }
        } catch (\Exception $e) {}

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
            'readme'      => $readme,
        ];
    }
}
