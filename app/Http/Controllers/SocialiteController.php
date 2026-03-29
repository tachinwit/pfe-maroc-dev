<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OtpCode;
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;

/**
 * Contrôleur Socialite - Authentification Google + OTP
 *
 * Sécurité renforcée : Connexion Google suivie d'un code OTP par email
 */
class SocialiteController extends Controller
{
    /**
     * Redirige vers Google OAuth
     */
    public function redirectToGoogle()
    {
        Log::info('=== GOOGLE OAUTH REDIRECT STARTED ===', [
            'session_id' => session()->getId(),
        ]);

        // Utiliser le mode stateful (avec state CSRF stocké en session)
        $redirect = Socialite::driver('google')->redirect();

        Log::info('=== GOOGLE OAUTH REDIRECT COMPLETED ===', [
            'session_id'     => session()->getId(),
            'state_in_session' => session('state') ? 'present' : 'absent',
        ]);

        return $redirect;
    }

    /**
     * Callback Google OAuth - Génère OTP au lieu de connecter directement
     */
    public function handleGoogleCallback()
    {
        Log::info('=== GOOGLE OAUTH CALLBACK STARTED ===', [
            'session_id'    => session()->getId(),
            'has_code'      => request()->has('code'),
            'has_state'     => request()->has('state'),
            'session_state' => session('state') ? 'present' : 'absent',
        ]);

        try {
            // Mode stateful : Socialite valide le state CSRF depuis la session
            $googleUser = Socialite::driver('google')->user();

            Log::info('Google user data received', [
                'email'  => $googleUser->getEmail(),
                'name'   => $googleUser->getName(),
                'id'     => $googleUser->getId(),
            ]);

            // Vérifier si l'utilisateur existe déjà
            $user = User::where('email', $googleUser->getEmail())->first();
            Log::info('User lookup result', ['exists' => $user ? 'YES' : 'NO', 'email' => $googleUser->getEmail()]);

            if (!$user) {
                Log::info('Creating new user from Google...', ['email' => $googleUser->getEmail()]);
                $user = User::create([
                    'name'               => $googleUser->getName() ?: $googleUser->getNickname() ?: 'Utilisateur Google',
                    'email'              => $googleUser->getEmail(),
                    'password'           => bcrypt(Str::random(24)),
                    'google_id'          => $googleUser->getId(),
                    'avatar'             => $googleUser->getAvatar(),
                    'email_verified_at'  => now(),
                ]);
                Log::info('User created successfully', ['user_id' => $user->id]);
            } else {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                ]);
                Log::info('Existing user updated', ['user_id' => $user->id]);
            }

            // Générer et stocker un code OTP en base de données
            $otpRecord = OtpCode::generate($user, $user->email);
            $otpCode = $otpRecord->code;

            // Envoyer le code OTP par email
            try {
                Mail::to($user->email)->send(new OtpMail($user, $otpCode));
                Log::info('OTP email sent successfully', ['to' => $user->email]);
            } catch (\Exception $mailError) {
                Log::error('Failed to send OTP email', ['error' => $mailError->getMessage()]);
            }

            // TEMPORAIRE: code OTP dans les logs pour faciliter les tests (supprimer en production)
            Log::info("OTP Code for {$user->email}: {$otpCode}");

            Log::info('Redirecting to OTP page...', ['user_id' => $user->id]);

            return redirect()->route('auth.verify-otp')->with([
                'email'     => $user->email,
                'message'   => 'Un code de vérification a été envoyé à votre email.',

            ]);

        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('OAuth InvalidStateException — session perdue entre redirect et callback', [
                'session_id'    => session()->getId(),
                'session_state' => session('state'),
                'request_state' => request('state'),
                'hint'          => 'Vérifiez SESSION_DRIVER, SESSION_SECURE_COOKIE et SameSite dans config/session.php',
            ]);
            return redirect()->route('login')
                ->with('error', 'La session OAuth a expiré. Veuillez réessayer la connexion Google.');
        } catch (\Exception $e) {
            Log::error('GOOGLE OAUTH ERROR', [
                'class'   => get_class($e),
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);
            return redirect()->route('login')
                ->with('error', 'Erreur lors de la connexion Google : ' . $e->getMessage());
        }
    }

    /**
     * Vérifier le code OTP et connecter l'utilisateur
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        // Vérifier le code OTP en base de données
        $otpRecord = OtpCode::verify($request->email, $request->otp);

        if (!$otpRecord) {
            Log::warning('OTP verification failed', [
                'email' => $request->email,
                'code_length' => strlen($request->otp),
            ]);
            return back()->with('error', 'Code OTP invalide ou expiré. Veuillez réessayer.');
        }

        // Récupérer l'utilisateur
        $user = $otpRecord->user;
        if (!$user) {
            Log::error('OTP user not found', ['otp_id' => $otpRecord->id]);
            return redirect()->route('login')->with('error', 'Utilisateur introuvable.');
        }

        // Marquer le code OTP comme utilisé
        $otpRecord->markAsUsed();

        Log::info('OTP verified successfully', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        // Connecter l'utilisateur
        Auth::login($user);

        return redirect('/dashboard')->with('success', 'Connexion réussie ! Bienvenue sur MarocDev.');
    }

    /**
     * Renvoyer le code OTP
     */
    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Trouver le code OTP non-utilisé le plus récent
        $latestOtp = OtpCode::where('email', $request->email)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->latest('created_at')
            ->first();

        if (!$latestOtp) {
            return back()->with('error', 'Aucune demande OTP en cours. Veuillez recommencer la connexion.');
        }

        $user = $latestOtp->user;
        if (!$user) {
            return back()->with('error', 'Utilisateur introuvable.');
        }

        // Générer un nouveau code OTP
        $otpRecord = OtpCode::generate($user, $request->email);
        $otpCode = $otpRecord->code;

        // Renvoyer le code par email
        try {
            Mail::raw("Votre nouveau code de vérification MarocDev : {$otpCode}\n\nCe code expire dans 10 minutes.", function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Nouveau code de vérification MarocDev');
            });
            Log::info('OTP resend email sent', ['email' => $user->email]);
        } catch (\Exception $e) {
            Log::error('Failed to send resend OTP email', ['error' => $e->getMessage()]);
        }

        return back()->with('success', 'Un nouveau code a été envoyé à votre email.');
    }
}