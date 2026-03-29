<?php

namespace App\Http\Controllers;

use App\Models\MonthlyPoint;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    /**
     * Afficher le leaderboard mensuel
     */
    public function index(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);

        // Top 3 du mois
        $topThree = MonthlyPoint::getTopThree($year, $month);
        $isGlobal = $topThree->count() === 0;

        // Fallback: si monthly_points vide, utiliser le classement global
        if ($isGlobal) {
            $topThree = User::orderBy('points', 'desc')
                ->limit(3)
                ->get()
                ->map(function($user, $index) {
                    return [
                        'user' => $user,
                        'points_earned' => 0,
                        'total_points' => $user->points,
                        'level' => $user->level,
                        'rank' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉')
                    ];
                });
        } else {
            $topThree = $topThree->map(function($monthlyPoint) {
                return [
                    'user' => $monthlyPoint->user,
                    'points_earned' => $monthlyPoint->points_earned,
                    'total_points' => $monthlyPoint->total_points,
                    'level' => $monthlyPoint->user->level,
                    'rank' => $monthlyPoint->user->level === 'Expert' ? '🥇' :
                             ($monthlyPoint->user->level === 'Avancé' ? '🥈' : '🥉')
                ];
            });
        }

        // Classement complet (top 20)
        $leaderboard = MonthlyPoint::getMonthlyLeaderboard($year, $month, 20);

        // Fallback: si leaderboard mensuel vide, utiliser global
        if ($leaderboard->count() === 0) {
            $leaderboard = User::orderBy('points', 'desc')
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
            $leaderboard = $leaderboard->map(function($monthlyPoint, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => $monthlyPoint->user,
                    'points_earned' => $monthlyPoint->points_earned,
                    'total_points' => $monthlyPoint->total_points,
                    'level' => $monthlyPoint->user->level
                ];
            });
        }

        // Position de l'utilisateur actuel
        $currentUserRank = null;
        if (auth()->check()) {
            if (!$isGlobal) {
                $userMonthly = MonthlyPoint::where('user_id', auth()->id())
                    ->where('year', $year)
                    ->where('month', $month)
                    ->first();

                if ($userMonthly) {
                    $rank = MonthlyPoint::where('year', $year)
                        ->where('month', $month)
                        ->where('points_earned', '>', $userMonthly->points_earned)
                        ->orWhere(function($query) use ($userMonthly) {
                            $query->where('points_earned', $userMonthly->points_earned)
                                  ->where('total_points', '>', $userMonthly->total_points);
                        })
                        ->count();

                    $currentUserRank = $rank + 1;
                }
            } else {
                $currentUserRank = User::where('points', '>', auth()->user()->points)->count() + 1;
            }
        }

        // Statistiques du mois
        $monthlyStats = $isGlobal ? [
            'total_participants' => User::count(),
            'total_points_awarded' => User::sum('points'),
            'average_points' => round(User::avg('points') ?? 0, 1)
        ] : [
            'total_participants' => MonthlyPoint::where('year', $year)->where('month', $month)->count(),
            'total_points_awarded' => MonthlyPoint::where('year', $year)->where('month', $month)->sum('points_earned'),
            'average_points' => round(MonthlyPoint::where('year', $year)->where('month', $month)->avg('points_earned') ?? 0, 1)
        ];

        return Inertia::render('Leaderboard/Index', [
            'topThree' => $topThree,
            'leaderboard' => $leaderboard,
            'currentUserRank' => $currentUserRank,
            'monthlyStats' => $monthlyStats,
            'isGlobal' => $isGlobal,
            'currentMonth' => [
                'year' => $year,
                'month' => $month,
                'name' => now()->setYear($year)->setMonth($month)->format('F Y')
            ]
        ]);
    }

    /**
     * API pour obtenir les données du leaderboard (pour AJAX si besoin)
     */
    public function api(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);
        $type = $request->get('type', 'monthly'); // 'monthly' or 'global'

        if ($type === 'global') {
            return $this->getGlobalLeaderboardData($request);
        }

        return response()->json([
            'top_three' => MonthlyPoint::getTopThree($year, $month),
            'leaderboard' => MonthlyPoint::getMonthlyLeaderboard($year, $month, 20)
        ]);
    }

    /**
     * Obtenir les données du leaderboard global
     */
    private function getGlobalLeaderboardData(Request $request)
    {
        $limit = $request->get('limit', 20);

        // Top 3 global
        $topThree = User::with('monthlyPoints')
            ->orderBy('points', 'desc')
            ->limit(3)
            ->get()
            ->map(function($user, $index) {
                return [
                    'user' => $user,
                    'total_points' => $user->points,
                    'level' => $user->level,
                    'rank' => $index === 0 ? '🥇' : ($index === 1 ? '🥈' : '🥉')
                ];
            });

        // Classement global complet
        $leaderboard = User::orderBy('points', 'desc')
            ->limit($limit)
            ->get()
            ->map(function($user, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => $user,
                    'total_points' => $user->points,
                    'level' => $user->level
                ];
            });

        // Position de l'utilisateur actuel
        $currentUserRank = null;
        if (auth()->check()) {
            $currentUserRank = User::where('points', '>', auth()->user()->points)->count() + 1;
        }

        // Statistiques globales
        $globalStats = [
            'total_participants' => User::count(),
            'total_points_all_time' => User::sum('points'),
            'average_points' => round(User::avg('points') ?? 0, 1),
            'top_level_distribution' => User::selectRaw('level, COUNT(*) as count')
                ->groupBy('level')
                ->orderBy('count', 'desc')
                ->get()
                ->pluck('count', 'level')
                ->toArray()
        ];

        return response()->json([
            'top_three' => $topThree,
            'leaderboard' => $leaderboard,
            'current_user_rank' => $currentUserRank,
            'stats' => $globalStats
        ]);
    }
}
