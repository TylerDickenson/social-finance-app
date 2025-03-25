<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;


class PostService
{
    public function transformPost($post)
    {
        $user = Auth::user();

        // Check if the user is authenticated
        if ($user) {
            $post->is_liked_by_user = $post->likes->contains('user_id', $user->id);
            $post->user->is_following = $user->isFollowing($post->user->id);
        } else {
            $post->is_liked_by_user = false;
            $post->user->is_following = false;
        }

        // Transform comments
        $post->comments->map(function ($comment) use ($user) {
            $comment->likes_count = $comment->likes->count();
            $comment->is_liked_by_user = $user ? $comment->likes->contains('user_id', $user->id) : false;
            return $comment;
        });

        return $post;
    }
}