<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        // Récupère les posts avec les infos de l'auteur
        $posts = Post::with('user')->latest()->get();
        return view('forum', compact('posts'));
    }
}