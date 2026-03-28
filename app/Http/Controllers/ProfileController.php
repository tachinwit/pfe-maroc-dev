<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update extra profile details like bio, title, location.
     */
    public function updateDetails(Request $request): RedirectResponse
    {
        $request->validate([
            'bio'      => 'nullable|string',
            'title'    => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'skills'   => 'nullable|array|max:5',
            'skills.*' => 'string|max:50',
            'cv'       => 'nullable|file|mimes:pdf|max:5120', // Max 5MB PDF
            'avatar'   => 'nullable|image|max:2048', // Max 2MB Image
            'cover'    => 'nullable|image|max:5120', // Max 5MB Image
            'github_url'   => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
        ]);

        $user = $request->user();
        $data = $request->only('bio', 'title', 'location', 'skills', 'github_url', 'linkedin_url');

        // Handle CV
        if ($request->hasFile('cv')) {
            if ($user->cv_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->cv_path);
            }
            $data['cv_path'] = $request->file('cv')->store('cvs', 'public');
        }

        // Handle Avatar
        if ($request->hasFile('avatar')) {
            if ($user->avatar_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar_path);
            }
            $data['avatar_path'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Handle Cover
        if ($request->hasFile('cover')) {
            if ($user->cover_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->cover_path);
            }
            $data['cover_path'] = $request->file('cover')->store('covers', 'public');
        }

        $user->update($data);

        return Redirect::back();
    }

    public function toggleFollow(Request $request, $id)
    {
        $userToFollow = \App\Models\User::findOrFail($id);
        $authUser = $request->user();

        if ($authUser->id === $userToFollow->id) {
            return back()->with('message', 'Vous ne pouvez pas vous suivre vous-même.');
        }

        if ($authUser->following()->where('following_id', $userToFollow->id)->exists()) {
            $authUser->following()->detach($userToFollow->id);
            return back()->with('info', 'Désabonnement réussi.');
        } else {
            $authUser->following()->attach($userToFollow->id);
            
            if (method_exists($authUser, 'addPoints')) {
                // Points removed as per user request
            }

            $userToFollow->notify(new \App\Notifications\NewFollowerNotification($authUser));
            
            return back()->with([
                'success' => 'Abonnement réussi !'
            ]);
        }
    }

    public function markNotificationAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }
        return back();
    }

    public function markAllNotificationsAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return back();
    }
}
