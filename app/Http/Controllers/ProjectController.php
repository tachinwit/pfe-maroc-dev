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

        $url = $request->github_url ?? $request->url;
        
        if (!$url) {
            return response()->json(['message' => 'L\'URL GitHub est requise.'], 422);
        }

        $user = $request->user();

        // Vérifier les doublons
        $exists = Project::where('user_id', $user->id)
            ->where('github_url', $url)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Ce projet est déjà dans votre portfolio.'], 409);
        }

        try {
            $repoInfo = $this->githubService->getRepoInfo($url);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\RuntimeException $e) {
            Log::warning('GitHub API fetch failed', [
                'url'   => $url,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['message' => "Impossible de récupérer les infos depuis GitHub."], 500);
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

        return response()->json([
            'message' => 'Projet importé avec succès !',
            'project' => $project
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

    /**
     * Ajoute manuellement un projet ou un article.
     *
     * POST /projects/manual
     */
    public function storeManual(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'type'        => 'required|in:github,article',
            'description' => 'required|string',
            'url'         => 'required|url',
            'project_date' => 'nullable|string|max:50',
        ]);

        Project::create([
            'user_id'     => $request->user()->id,
            'name'        => $request->title,
            'description' => $request->description,
            // Pour type "article", on le met dans "language" temporairement ou github_url 
            'github_url'  => $request->url, 
            'language'    => $request->type === 'article' ? 'Article / Contribution' : 'Projet',
            'stars'       => 0,
            'project_date' => $request->project_date,
        ]);

        // $request->user()->rewardForProjectShare();

        return redirect()->back();
    }

    /**
     * Supprime un projet de l'utilisateur.
     */
    public function destroy(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        if ($project->user_id !== $request->user()->id) {
            abort(403, "Vous n'êtes pas autorisé à supprimer ce projet.");
        }

        $project->delete();

        return redirect()->back()->with('success', 'Projet supprimé avec succès.');
    }

    /**
     * API pour l'explorateur GitHub (V2)
     */
    public function preview(Request $request): JsonResponse
    {
        $url = $request->query('url');
        if (!$url) return response()->json(['error' => 'URL requise'], 400);

        try {
            $data = $this->githubService->getPreviewData($url);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
