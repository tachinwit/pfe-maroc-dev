<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use App\Models\OpportunityApplication;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'type' => 'required|in:Stage,Freelance,CDI,CDD',
            'description' => 'required|string',
            'salary' => 'nullable|string|max:255',
        ]);

        // Protection contre les doublons : entreprise + titre + type (30 jours)
        $thirtyDaysAgo = now()->subDays(30);
        $exists = Opportunity::where('company', $request->company)
            ->where('title', $request->title)
            ->where('type', $request->type)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Une opportunité similaire (même entreprise, titre et type) a été publiée dans les 30 derniers jours.');
        }

        Opportunity::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'company' => $request->company,
            'location' => $request->location,
            'type' => $request->type,
            'description' => $request->description,
            'salary' => $request->salary,
        ]);

        return redirect()->back()->with('success', 'Opportunité publiée avec succès !');
    }

    public function apply(Request $request, $id)
    {
        $opportunity = Opportunity::findOrFail($id);
        $user = $request->user();

        // Prevent admin from applying
        if ($user->is_admin || $user->role === 'admin') {
            return redirect()->back()->with('error', "Les administrateurs ne peuvent pas postuler aux offres.");
        }

        // Prevent double application
        if (OpportunityApplication::where('user_id', $user->id)->where('opportunity_id', $id)->exists()) {
            return redirect()->back()->with('info', "Vous avez déjà postulé à cette offre.");
        }

        // Record application
        OpportunityApplication::create([
            'user_id' => $user->id,
            'opportunity_id' => $id
        ]);

        if ($opportunity->user) {
            $opportunity->user->notify(new \App\Notifications\NewMessageNotification($user));
        }

        // Points removed as per user request

        return redirect()->back()->with([
            'success' => "Candidature envoyée à {$opportunity->company} !"
        ]);
    }
}
