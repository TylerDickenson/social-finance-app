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
            'likes',
            'tags',
            'comments' => function ($query) {
                // *** Ensure 'tags' is loaded for comments ***
                $query->with(['user', 'likes', 'tags'])
                      ->withCount('likes')
                      ->orderBy('created_at', 'asc');
            }
        ])
        ->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'desc')
            ->paginate(10);

        $posts->getCollection()->transform(function ($post) {
            $isLoggedIn = auth()->check();
            $userId = $isLoggedIn ? auth()->id() : null;

            $post->is_liked_by_user = $isLoggedIn ? $post->likes->contains('user_id', $userId) : false;

            // Anonymize user for anonymous posts (when viewer isn't the author)
            if ($post->is_anonymous && $post->user_id !== $userId) {
                $post->user = $this->anonymizeUser($post->user);
            }

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

    // Add the anonymizeUser method (same as in PostController)
    private function anonymizeUser($user)
    {
        $anonymousUser = clone $user;
        $anonymousUser->name = 'Anonymous';
        $anonymousUser->avatar_url = asset('images/anonymous-avatar.png');
        return $anonymousUser;
    }
}