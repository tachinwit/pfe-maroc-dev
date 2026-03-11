<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\GitHubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function __construct(
        private readonly GitHubService $githubService
    ) {}

    /**
     * Crée un projet automatiquement depuis une URL GitHub.
     *
     * POST /projects/from-github
     * Body: { "github_url": "https://github.com/owner/repo" }
     */
    public function storeFromGithub(Request $request): JsonResponse
    {
        $request->validate([
            'github_url' => [
                'required',
                'string',
                'url',
                // Regex : doit être une URL github.com avec owner/repo
                'regex:/^https?:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\.git)?(\/.*)?$/',
            ],
        ], [
            'github_url.required' => 'L\'URL GitHub est obligatoire.',
            'github_url.url'      => 'Le format de l\'URL est invalide.',
            'github_url.regex'    => 'L\'URL doit pointer vers un dépôt GitHub valide (ex: https://github.com/owner/repo).',
        ]);

        $user = $request->user();

        // Vérifier les doublons
        $existingProject = Project::where('user_id', $user->id)
            ->where('github_url', $request->github_url)
            ->first();

        if ($existingProject) {
            return response()->json([
                'error'   => 'Vous avez déjà ajouté ce projet.',
                'project' => $existingProject,
            ], 409);
        }

        try {
            $repoInfo = $this->githubService->getRepoInfo($request->github_url);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\RuntimeException $e) {
            Log::warning('GitHub API fetch failed', [
                'url'   => $request->github_url,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => $e->getMessage()], 502);
        }

        // Création du projet en base de données
        $project = Project::create([
            'user_id'     => $user->id,
            'name'        => $repoInfo['name'],
            'description' => $repoInfo['description'],
            'language'    => $repoInfo['language'],
            'stars'       => $repoInfo['stars'],
            'github_url'  => $repoInfo['url'],
            'homepage'    => $repoInfo['homepage'],
        ]);

        // Récompense de points (+20 pour partage de projet)
        $user->rewardForProjectShare();

        return response()->json([
            'message'       => 'Projet ajouté avec succès !',
            'project'       => $project,
            'points_earned' => 20,
            'total_points'  => $user->fresh()->points,
        ], 201);
    }

    /**
     * Liste les projets de l'utilisateur connecté.
     */
    public function index(Request $request): JsonResponse
    {
        $projects = Project::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($projects);
    }
}
