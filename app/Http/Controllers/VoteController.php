<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Vote;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function toggleVote(Request $request, $type, $id)
    {
        $request->validate([
            'vote_type' => 'required|in:1,-1',
        ]);

        $modelClass = $type === 'comment' ? Comment::class : Post::class;
        $model = $modelClass::findOrFail($id);

        // Prevent self-voting
        if ($model->user_id === $request->user()->id) {
            return redirect()->back()->with('error', "Vous ne pouvez pas voter pour votre propre contenu.");
        }

        $vote = Vote::where('user_id', $request->user()->id)
                    ->where('votable_id', $id)
                    ->where('votable_type', $modelClass)
                    ->first();

        // LOGIC: Every click only changes the score by 1.
        // If they click the SAME vote type they have, remove it.
        if ($vote && $vote->type == $request->vote_type) {
            $vote->delete();
            return redirect()->back()->with('info', 'Vote retiré.');
        }

        // If they click the OPPOSITE vote type, also remove it (goes back to 0).
        if ($vote && $vote->type != $request->vote_type) {
            $vote->delete();
            return redirect()->back()->with('info', 'Vote réinitialisé.');
        }

        // If they have NO vote, create the new one.
        Vote::create([
            'user_id' => $request->user()->id,
            'votable_id' => $id,
            'votable_type' => $modelClass,
            'type' => $request->vote_type,
        ]);

        // No points awarded for participation to prevent abuse
        // $request->user()->addPoints(2);

        // Notify author if upvoted
        if ($request->vote_type == 1 && $model->user) {
            return redirect()->back()->with([
                'success' => 'Vote enregistré !',
            ]);
        }

        return redirect()->back()->with([
            'success' => 'Vote enregistré !',
        ]);
    }
}
