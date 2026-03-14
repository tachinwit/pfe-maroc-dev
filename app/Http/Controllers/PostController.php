<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Traits\HasPoints;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('user')->latest()->paginate(20);

        return Inertia::render('ForumPage', [
            'posts' => $posts,
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

        return response()->json([
            'message'       => 'Post créé avec succès !',
            'post'          => $post,
            'points_earned' => 10,
            'total_points'  => $request->user()->fresh()->points,
        ], 201);
    }
}
