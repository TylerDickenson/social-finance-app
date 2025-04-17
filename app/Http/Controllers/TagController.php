<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class TagController extends Controller
{
    
    public function show(Request $request, string $tagName)
    {
        $tag = Tag::where('name', strtoupper($tagName))->firstOrFail();

        $postsCollection = $tag->posts()
                               ->with([
                                   'user',
                                   'likes',
                                   'comments' => function ($query) {
                                       $query->with('user', 'likes')->withCount('likes')->orderBy('created_at', 'asc');
                                   },
                                   'tags'
                               ])
                               ->withCount(['likes', 'comments'])
                               ->orderBy('created_at', 'desc')
                               ->get(); 

        $posts = $postsCollection->transform(function ($post) {
            $isLoggedIn = auth()->check();
            $userId = $isLoggedIn ? auth()->id() : null;

            $post->is_liked_by_user = $isLoggedIn ? $post->likes->contains('user_id', $userId) : false;

            if ($isLoggedIn && $post->relationLoaded('user')) {
                 $post->user->is_following = auth()->user()->isFollowing($post->user->id);
            } elseif ($post->relationLoaded('user')) {
                 $post->user->is_following = false;
            }

            if ($post->relationLoaded('comments')) {
                $post->comments->each(function ($comment) use ($isLoggedIn, $userId) {
                    $comment->is_liked_by_user = $isLoggedIn ? $comment->likes->contains('user_id', $userId) : false;
                });
            }

            return $post;
        });

        return Inertia::render('TagShow', [
            'tag' => $tag,
            'posts' => $posts, 
        ]);
    }
}