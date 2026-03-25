<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();
        
        if (!$user) {
            return back()->withErrors(['email' => "Cet utilisateur n'existe pas."]);
        }

        // For PFE Demo: Generate the token ONCE manually
        // This avoids calling Password::sendResetLink() which generates a SECOND token and invalidates the first one.
        $token = Password::createToken($user);
        $demoLink = route('password.reset', ['token' => $token, 'email' => $request->email]);

        // Manually log it for records
        \Illuminate\Support\Facades\Log::info("Demo Password Reset Link: " . $demoLink);

        return back()->with('status', "Un lien de récupération a été généré pour la démo.")
                     ->with('demo_link', $demoLink);
    }
}
