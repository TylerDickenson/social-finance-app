<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments.user', 'comments.likes'])
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Transform the paginated collection without losing pagination metadata.
        $posts->getCollection()->transform(function ($post) {
            // Add a flag to indicate if the post is liked by the current user.
            $post->is_liked_by_user = $post->likes->contains('user_id', auth()->id());

            // Add a flag to indicate if the current user is following the post's author.
            if (auth()->check()) {
                $post->user->is_following = auth()->user()->isFollowing($post->user->id);
            }

            // Transform each comment on the post.
            $post->comments->transform(function ($comment) {
                $comment->likes_count = $comment->likes->count();
                $comment->is_liked_by_user = $comment->likes->contains('user_id', auth()->id());
                return $comment;
            });

            return $post;
        });

        return Inertia::render('Dashboard', [
            'posts' => $posts,
            
        ]);
    }
}