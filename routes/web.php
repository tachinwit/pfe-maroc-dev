<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/forum', [PostController::class, 'index'])->name('forum');
Route::get('/forum/{id}', [PostController::class, 'show'])->name('forum.show');
Route::get('/ai', function () { return Inertia::render('AIAssistantPage'); })->name('ai');
Route::get('/events', function () { 
    $events = \App\Models\Event::with('organizer')->latest()->get()->map(function($ev) {
        return [
            'id' => 'db_'.$ev->id,
            'title' => $ev->title,
            'type' => $ev->type,
            'date' => $ev->date,
            'location' => $ev->location,
            'attendees_count' => $ev->attendees_count,
            'image' => $ev->image,
            'organizer' => $ev->organizer ? ['name' => $ev->organizer->name] : null,
        ];
    });

    $opportunities = \App\Models\Opportunity::latest()->get();
    
    $appliedOppIds = auth()->check() 
        ? \App\Models\OpportunityApplication::where('user_id', auth()->id())->pluck('opportunity_id')->toArray()
        : [];

    return Inertia::render('EventsOpportunitiesPage', [
        'events_db' => $events,
        'opportunities_db' => $opportunities,
        'applied_opp_ids' => $appliedOppIds,
        'participated_events' => auth()->check() ? auth()->user()->participatedEvents()->pluck('event_id')->map(fn($id) => (string)$id)->toArray() : [],
    ]); 
})->name('events');



Route::get('/dashboard', function () {
    $userId = auth()->id();
    $messages = \App\Models\Message::where('sender_id', $userId)
        ->orWhere('receiver_id', $userId)
        ->get();
    
    $discussionsCount = $messages->map(function ($msg) use ($userId) {
        return $msg->sender_id === $userId ? $msg->receiver_id : $msg->sender_id;
    })->unique()->count();

    $answersCount = \App\Models\Comment::where('user_id', $userId)->count();

    $posts = \App\Models\Post::where('user_id', $userId)->latest()->take(5)->get()->map(function($post) {
        return [
            'id' => 'post_'.$post->id,
            'type' => 'post',
            'content' => 'Nouvelle question: ' . $post->title,
            'time' => $post->created_at->format('d/m/Y H:i'),
            'created_at' => $post->created_at,
            'link' => '/forum/' . $post->id,
        ];
    });

    $comments = \App\Models\Comment::where('user_id', $userId)->with('post')->latest()->take(5)->get()->map(function($comment) {
        return [
            'id' => 'comment_'.$comment->id,
            'type' => 'reply',
            'content' => 'Vous avez répondu à: ' . ($comment->post ? $comment->post->title : 'une question'),
            'time' => $comment->created_at->format('d/m/Y H:i'),
            'created_at' => $comment->created_at,
            'link' => '/forum/' . $comment->post_id,
        ];
    });

    $activities = $posts->concat($comments)->sortByDesc('created_at')->take(5)->values();

    return Inertia::render('Dashboard', [
        'discussionsCount' => $discussionsCount,
        'answersCount' => $answersCount,
        'activities' => $activities
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/my-answers', function (\Illuminate\Http\Request $request) {
    $comments = \App\Models\Comment::where('user_id', $request->user()->id)
        ->with('post')
        ->latest()
        ->get()
        ->map(function($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->format('d M Y H:i'),
                'post' => $comment->post ? [
                    'id' => $comment->post->id,
                    'title' => $comment->post->title,
                ] : null,
            ];
        });

    return Inertia::render('MyAnswersPage', [
        'answers' => $comments
    ]);
})->middleware(['auth', 'verified'])->name('my-answers');

Route::get('/developers', function () {
    // Données des développeurs
    $developers = \App\Models\User::orderBy('points', 'desc')->get();

    // Données du leaderboard mensuel (par défaut mars 2026)
    $year = 2026;
    $month = 3;

    $monthlyTopThree = \App\Models\MonthlyPoint::getTopThree($year, $month);
    $isMonthlyGlobal = $monthlyTopThree->count() === 0;

    // FALLBACK: Si monthly_points vide, utiliser le classement global
    if ($isMonthlyGlobal) {
        $monthlyTopThree = \App\Models\User::orderBy('points', 'desc')
            ->limit(3)
            ->get()
            ->map(function($user, $index) {
                return [
                    'user' => $user,
                    'points_earned' => 0,
                    'total_points' => $user->points,
                    'level' => $user->level,
                    'rank' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉'),
                    'medal' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉')
                ];
            });
    } else {
        $monthlyTopThree = $monthlyTopThree->map(function($monthlyPoint, $index) {
            return [
                'user' => $monthlyPoint->user,
                'points_earned' => $monthlyPoint->points_earned,
                'total_points' => $monthlyPoint->total_points,
                'level' => $monthlyPoint->user->level,
                'rank' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉'),
                'medal' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉')
            ];
        });
    }

    $monthlyLeaderboard = \App\Models\MonthlyPoint::getMonthlyLeaderboard($year, $month, 20);
    
    // FALLBACK: Si leaderboard mensuel vide, utiliser le global
    if ($monthlyLeaderboard->count() === 0) {
        $monthlyLeaderboard = \App\Models\User::orderBy('points', 'desc')
            ->limit(20)
            ->get()
            ->map(function($user, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => $user,
                    'points_earned' => 0,
                    'total_points' => $user->points,
                    'level' => $user->level
                ];
            });
    } else {
        $monthlyLeaderboard = $monthlyLeaderboard->map(function($monthlyPoint, $index) {
            return [
                'rank' => $index + 1,
                'user' => $monthlyPoint->user,
                'points_earned' => $monthlyPoint->points_earned,
                'total_points' => $monthlyPoint->total_points,
                'level' => $monthlyPoint->user->level
            ];
        });
    }

    // Position de l'utilisateur actuel pour le mois
    $currentUserMonthlyRank = null;
    if (auth()->check()) {
        if (!$isMonthlyGlobal) {
            $userMonthly = \App\Models\MonthlyPoint::where('user_id', auth()->id())
                ->where('year', $year)
                ->where('month', $month)
                ->first();

            if ($userMonthly) {
                $rank = \App\Models\MonthlyPoint::where('year', $year)
                    ->where('month', $month)
                    ->where('points_earned', '>', $userMonthly->points_earned)
                    ->orWhere(function($query) use ($userMonthly) {
                        $query->where('points_earned', $userMonthly->points_earned)
                              ->where('total_points', '>', $userMonthly->total_points);
                    })
                    ->count();

                $currentUserMonthlyRank = $rank + 1;
            }
        } else {
            $currentUserMonthlyRank = \App\Models\User::where('points', '>', auth()->user()->points)->count() + 1;
        }
    }

    // Données du leaderboard global
    $globalTopThree = \App\Models\User::orderBy('points', 'desc')->limit(3)->get();
    $globalLeaderboard = \App\Models\User::orderBy('points', 'desc')->limit(20)->get();

    // Position de l'utilisateur actuel global
    $currentUserGlobalRank = null;
    if (auth()->check()) {
        $currentUserGlobalRank = \App\Models\User::where('points', '>', auth()->user()->points)->count() + 1;
    }

    // Statistiques
    $monthlyStats = $isMonthlyGlobal ? [
        'total_participants' => \App\Models\User::count(),
        'total_points_awarded' => \App\Models\User::sum('points'),
        'average_points' => round(\App\Models\User::avg('points') ?? 0, 1)
    ] : [
        'total_participants' => \App\Models\MonthlyPoint::where('year', $year)->where('month', $month)->count(),
        'total_points_awarded' => \App\Models\MonthlyPoint::where('year', $year)->where('month', $month)->sum('points_earned'),
        'average_points' => round(\App\Models\MonthlyPoint::where('year', $year)->where('month', $month)->avg('points_earned') ?? 0, 1)
    ];

    $globalStats = [
        'total_participants' => \App\Models\User::count(),
        'total_points_all_time' => \App\Models\User::sum('points'),
        'average_points' => round(\App\Models\User::avg('points') ?? 0, 1)
    ];

    return Inertia::render('DevelopersPage', [
        'developers' => $developers,
        'leaderboard' => [
            'monthly' => [
                'top_three' => $monthlyTopThree,
                'leaderboard' => $monthlyLeaderboard,
                'current_user_rank' => $currentUserMonthlyRank,
                'stats' => $monthlyStats,
                'current_month' => [
                    'year' => $year,
                    'month' => $month,
                    'name' => now()->setYear($year)->setMonth($month)->format('F Y')
                ]
            ],
            'global' => [
                'top_three' => $globalTopThree->map(function($user, $index) {
                    return [
                        'user' => $user,
                        'total_points' => $user->points,
                        'level' => $user->level,
                        'rank' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉'),
                        'medal' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉')
                    ];
                }),
                'leaderboard' => $globalLeaderboard->map(function($user, $index) {
                    return [
                        'rank' => $index + 1,
                        'user' => $user,
                        'total_points' => $user->points,
                        'level' => $user->level
                    ];
                }),
                'current_user_rank' => $currentUserGlobalRank,
                'stats' => $globalStats
            ]
        ]
    ]);
})->name('developers');

// Auth protected routes
// Route publique pour charger les infos GitHub (avec rate limit backend)
Route::get('/api/github/repo-info', function (\Illuminate\Http\Request $request) {
    $url = $request->query('url');
    
    if (!$url) {
        return response()->json(['error' => 'URL manquante'], 400);
    }

    try {
        $githubService = app(\App\Services\GitHubService::class);
        $repoInfo = $githubService->getRepoInfo($url);
        return response()->json($repoInfo);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
});

Route::middleware('auth')->group(function () {
    Route::post('/events/create', [\App\Http\Controllers\EventController::class, 'store'])->name('events.create');
    Route::delete('/events/{id}', [\App\Http\Controllers\EventController::class, 'destroy'])->name('events.destroy');
    Route::post('/opportunities/create', [\App\Http\Controllers\OpportunityController::class, 'store'])->name('opportunities.store');
    Route::post('/opportunities/{id}/apply', [\App\Http\Controllers\OpportunityController::class, 'apply'])->name('opportunities.apply');
    Route::get('/opportunities/{id}/applicants', function($id) {
        if (!auth()->user()->is_admin) abort(403);
        $opportunity = \App\Models\Opportunity::with('applications.user')->findOrFail($id);
        return Inertia::render('OpportunityApplicantsPage', [
            'opportunity' => $opportunity
        ]);
    })->name('opportunities.applicants');

    Route::post('/events/participate', function (\Illuminate\Http\Request $request) {
        $eventId = $request->input('event_id');
        $user = $request->user();
        
        // Strip prefix if present, otherwise use as is
        $realId = str_replace('db_', '', $eventId);
        $event = \App\Models\Event::findOrFail($realId);

        // Check if already participated in DB
        if ($event->participants()->where('user_id', $user->id)->exists()) {
            return redirect()->back()->with('info', 'Vous êtes déjà inscrit à cet événement.');
        }

        // Record participation and increment count
        $event->participants()->attach($user->id);
        $event->increment('attendees_count');
        
        // Gamification Anti-Spam: Plus de points automatiques pour participation
        // $user->addPoints(20); // Désactivé pour prévenir le farming
        return redirect()->back()->with('success', 'Inscription confirmée !');
    })->name('events.participate');
    
    Route::get('/events/{id}/receipt', [\App\Http\Controllers\EventController::class, 'downloadReceipt'])->name('events.receipt');
    
    Route::get('/events/{id}/participants', function ($id) {
        if (!auth()->user()->is_admin) abort(403);
        $event = \App\Models\Event::with('participants')->findOrFail($id);
        return Inertia::render('EventParticipantsPage', [
            'event' => $event
        ]);
    })->name('events.participants');

    Route::get('/my-profile', function (\Illuminate\Http\Request $request) { 
        $user = clone $request->user();
        $projectsList = \App\Models\Project::where('user_id', $user->id)
            ->where(function($q) {
                $q->where('language', '!=', 'Article / Contribution')->orWhereNull('language');
            })->latest()->get();
        $contributionsList = \App\Models\Project::where('user_id', $user->id)->where('language', 'Article / Contribution')->latest()->get();
        return Inertia::render('ProfilePage', [
            'profileUser' => $user,
            'projectsList' => $projectsList,
            'contributionsList' => $contributionsList,
        ]); 
    })->name('my-profile');

    Route::get('/user/{id}', function ($id) { 
        $user = \App\Models\User::findOrFail($id);
        $projectsList = \App\Models\Project::where('user_id', $id)
            ->where(function($q) {
                $q->where('language', '!=', 'Article / Contribution')->orWhereNull('language');
            })->latest()->get();
        $contributionsList = \App\Models\Project::where('user_id', $id)->where('language', 'Article / Contribution')->latest()->get();
        return Inertia::render('ProfilePage', [
            'profileUser' => $user,
            'projectsList' => $projectsList,
            'contributionsList' => $contributionsList,
        ]); 
    })->name('profile.show');

    // Account settings
    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/ai/chat', [AIController::class, 'chat'])->name('ai.chat');

    Route::post('/my-profile', [ProfileController::class, 'updateDetails'])->name('profile.updateDetails');

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/preview', [ProjectController::class, 'preview'])->name('projects.preview');
    Route::post('/projects/github', [ProjectController::class, 'storeFromGithub'])->name('projects.store');
    Route::post('/projects/manual', [ProjectController::class, 'storeManual'])->name('projects.storeManual');
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    Route::post('/user/{id}/follow', [ProfileController::class, 'toggleFollow'])->name('user.follow');
    Route::post('/notifications/{id}/read', [ProfileController::class, 'markNotificationAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [ProfileController::class, 'markAllNotificationsAsRead'])->name('notifications.readAll');

    Route::post('/forum/posts', [PostController::class, 'store'])->name('forum.store');
    Route::post('/forum/{id}/comments', [PostController::class, 'storeComment'])->name('forum.comments.store');
    
    Route::post('/forum/{type}/{id}/vote', [\App\Http\Controllers\VoteController::class, 'toggleVote'])->middleware('throttle:60,1')->name('fourm.vote');
    Route::post('/forum/comments/{id}/best-answer', [PostController::class, 'markBestAnswer'])->name('forum.comments.bestAnswer');

    Route::get('/messages', [\App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
    Route::post('/messages', [\App\Http\Controllers\MessageController::class, 'store'])->name('messages.store');
    Route::put('/messages/{id}', [\App\Http\Controllers\MessageController::class, 'update'])->name('messages.update');
    Route::delete('/messages/{id}', [\App\Http\Controllers\MessageController::class, 'destroy'])->name('messages.destroy');
    Route::delete('/messages/conversation/{userId}', [\App\Http\Controllers\MessageController::class, 'destroyConversation'])->name('messages.destroyConversation');

    // Leaderboard routes
    Route::get('/leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'index'])->name('leaderboard.index');
    Route::get('/api/leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'api'])->name('leaderboard.api');
});

require __DIR__.'/auth.php';
