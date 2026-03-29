<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    protected $table = 'otp_codes';

    protected $fillable = [
        'user_id',
        'email',
        'code',
        'used',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'used' => 'boolean',
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Générer et stocker un code OTP pour un utilisateur
     */
    public static function generate(User $user, string $email): self
    {
        // Supprimer les codes OTP non-utilisés précédents
        self::where('email', $email)
            ->where('used', false)
            ->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        return self::create([
            'user_id' => $user->id,
            'email' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
        ]);
    }

    /**
     * Vérifier un code OTP
     */
    public static function verify(string $email, string $code): ?self
    {
        return self::where('email', $email)
            ->where('code', $code)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();
    }

    /**
     * Marquer le code comme utilisé
     */
    public function markAsUsed(): void
    {
        $this->update([
            'used' => true,
            'used_at' => now(),
        ]);
    }

    /**
     * Nettoyer les codes OTP expirés
     */
    public static function cleanupExpired(): int
    {
        return self::where('expires_at', '<', now())
            ->where('used', false)
            ->delete();
    }
}
