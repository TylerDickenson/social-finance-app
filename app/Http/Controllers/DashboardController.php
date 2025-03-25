<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index()
    {
        $posts = Post::with(['user', 'comments.user', 'comments.likes'])
            ->withCount('likes')
            ->get()
            ->map(fn($post) => $this->postService->transformPost($post));

        return Inertia::render('Dashboard', ['posts' => $posts]);
    }

    
}

