<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonthlyPoint extends Model
{
    protected $fillable = [
        'user_id',
        'points_earned',
        'total_points',
        'year',
        'month'
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'points_earned' => 'integer',
        'total_points' => 'integer'
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir ou créer l'enregistrement mensuel pour un utilisateur
     */
    public static function getOrCreateForUser(User $user, int $year = null, int $month = null): self
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;

        return self::firstOrCreate(
            [
                'user_id' => $user->id,
                'year' => $year,
                'month' => $month
            ],
            [
                'points_earned' => 0,
                'total_points' => $user->points
            ]
        );
    }

    /**
     * Ajouter des points pour le mois en cours
     */
    public static function addPointsForUser(User $user, int $points): void
    {
        $monthlyPoint = self::getOrCreateForUser($user);
        $monthlyPoint->increment('points_earned', $points);
        $monthlyPoint->update(['total_points' => $user->fresh()->points]);
    }

    /**
     * Obtenir le classement mensuel
     */
    public static function getMonthlyLeaderboard(int $year = null, int $month = null, int $limit = 10)
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;

        return self::with('user')
            ->where('year', $year)
            ->where('month', $month)
            ->orderBy('points_earned', 'desc')
            ->orderBy('total_points', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Obtenir le top 3 du mois
     */
    public static function getTopThree(int $year = null, int $month = null)
    {
        return self::getMonthlyLeaderboard($year, $month, 3);
    }
}
