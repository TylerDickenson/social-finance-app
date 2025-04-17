<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\PostService;
use App\Models\Post;
use Inertia\Inertia;

class FollowController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function following()
    {
        $posts = Post::with(['user', 'comments.user', 'comments.likes', 'tags'])
            ->withCount('likes')
            ->get()
            ->map(fn($post) => $this->postService->transformPost($post));

        return Inertia::render('Following', ['posts' => $posts]);
    }

    public function follow($id)
    {
        Auth::user()->following()->attach($id);
        return redirect()->back();
    }

    public function unfollow($id)
    {
        Auth::user()->following()->detach($id);
        return redirect()->back();
    }
}