<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Traits\HasPoints;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $posts = Post::with('user')->withCount('comments')->withSum('votes', 'type')->with(['votes' => function($q) use ($userId) {
            if ($userId) $q->where('user_id', $userId);
            else $q->whereRaw('0 = 1');
        }])->latest()->paginate(20);

        return Inertia::render('ForumPage', [
            'posts' => $posts,
        ]);
    }

    public function show($id)
    {
        $userId = auth()->id();
        $post = Post::with(['user', 'comments' => function($q) use ($userId) {
            $q->with('user')->withSum('votes', 'type')->with(['votes' => function($vq) use ($userId) {
                if ($userId) $vq->where('user_id', $userId);
                else $vq->whereRaw('0 = 1');
            }]);
        }])->withSum('votes', 'type')->with(['votes' => function($q) use ($userId) {
            if ($userId) $q->where('user_id', $userId);
            else $q->whereRaw('0 = 1');
        }])->findOrFail($id);
        
        $post->created_at_human = $post->created_at->diffForHumans();
        foreach ($post->comments as $comment) {
            $comment->created_at_human = $comment->created_at->diffForHumans();
        }

        return Inertia::render('PostDetailsPage', [
            'post' => $post,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'category' => 'required|string|max:100',
        ]);

        $post = Post::create([
            'user_id'  => $request->user()->id,
            'title'    => $request->title,
            'content'  => $request->content,
            'category' => $request->category,
        ]);

        $request->user()->rewardForForumPost();

        return redirect()->back()->with([
            'success' => 'Question publiée avec succès !',
            'points' => '+10 pts'
        ]);
    }

    public function storeComment(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $post = Post::findOrFail($id);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        if ($post->user_id !== $request->user()->id) {
            $post->user->notify(new \App\Notifications\NewCommentNotification($post, $request->user()));
        }

        // Reward for comment
        $request->user()->addPoints(5);

        return redirect()->back()->with([
            'success' => 'Réponse publiée !',
            'points' => '+5 pts'
        ]);
    }

    public function markBestAnswer(Request $request, $id)
    {
        $comment = \App\Models\Comment::findOrFail($id);
        $post = $comment->post;

        if ($post->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($post->comments()->where('is_best_answer', true)->exists()) {
            return redirect()->back()->with('error', 'Une meilleure réponse a déjà été choisie.');
        }

        $comment->update(['is_best_answer' => true]);

        if ($comment->user) {
            $comment->user->addPoints(20);
        }

        return redirect()->back()->with([
            'success' => 'Marqué comme meilleure réponse !',
        ]);
    }
}
