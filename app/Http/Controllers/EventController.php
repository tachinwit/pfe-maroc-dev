<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            abort(403, "Seuls les administrateurs peuvent créer des événements.");
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'date' => 'required|date|after_or_equal:today|before_or_equal:' . now()->addYears(2)->format('Y-m-d'),
            'location' => 'required|string|max:255',
        ]);

        // Protection contre les doublons : même titre + date + lieu
        $exists = \App\Models\Event::where('title', $request->title)
            ->where('date', $request->date)
            ->where('location', $request->location)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Un événement avec ce titre, cette date et ce lieu existe déjà.');
        }

        Event::create([
            'title' => $request->title,
            'type' => $request->type,
            'date' => $request->date,
            'location' => $request->location,
            'organizer_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Événement créé avec succès !');
    }
    public function destroy(Request $request, $id)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            abort(403, "Seuls les administrateurs peuvent supprimer des événements.");
        }

        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->back()->with('success', 'Événement supprimé avec succès !');
    }

    public function downloadReceipt(Request $request, $id)
    {
        // Strip prefix if present
        $realId = str_replace('db_', '', $id);
        $event = Event::findOrFail($realId);
        $user = $request->user();

        // Check if user is registered in the database
        $isRegistered = $event->participants()->where('user_id', $user->id)->exists();
        
        if (!$isRegistered && !$user->is_admin) {
            return redirect()->back()->with('error', 'Vous devez être inscrit à cet événement pour télécharger le reçu.');
        }

        return view('events.receipt', compact('event', 'user'));
    }
}
