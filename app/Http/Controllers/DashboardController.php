<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with([
                'user',
                'comments' => function ($query) {
                    $query->with('user', 'likes')->withCount('likes')->orderBy('created_at', 'asc');
                },
                'tags',
            ])
            ->withCount('likes') 
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $posts->getCollection()->transform(function ($post) {
            $isLoggedIn = auth()->check();
            $userId = $isLoggedIn ? auth()->id() : null;

            $post->is_liked_by_user = $isLoggedIn ? $post->likes->contains('user_id', $userId) : false;

            if ($isLoggedIn && $post->user) {
                 $post->user->is_following = auth()->user()->following->contains($post->user_id);
            } else if ($post->user) {
                 $post->user->is_following = false;
            }

            if ($post->comments) {
                foreach ($post->comments as $comment) {
                    $comment->is_liked_by_user = $isLoggedIn ? $comment->likes->contains('user_id', $userId) : false;
                }
            }

            return $post;
        });

        if ($request->wantsJson()) {
            return response()->json(['posts' => $posts]);
        }

        return Inertia::render('Dashboard', [
            'posts' => $posts,
        ]);
    }
}