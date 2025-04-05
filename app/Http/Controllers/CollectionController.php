<?php
namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CollectionController extends Controller
{
    public function index()
    {
        $collections = auth()->user()->collections()
            ->withCount('posts') // Include the count of posts in each collection
            ->get();

        return Inertia::render('Collections', [
            'collections' => $collections,
        ]);
    }

    public function show($id)
{
    $collection = Collection::with('posts')->findOrFail($id);

    // Load posts with necessary relationships and count likes
    $posts = Post::whereHas('collections', function ($query) use ($id) {
        $query->where('collections.id', $id);
    })
        ->with(['user', 'comments.user', 'comments.likes'])
        ->withCount('likes') // Count likes for each post
        ->orderBy('created_at', 'desc')
        ->get();

    // Transform posts to add additional flags
    $posts->transform(function ($post) {
        $post->is_liked_by_user = $post->likes->contains('user_id', auth()->id());

        if (auth()->check()) {
            $post->user->is_following = auth()->user()->isFollowing($post->user->id);
        }

        $post->comments->transform(function ($comment) {
            $comment->likes_count = $comment->likes->count();
            $comment->is_liked_by_user = $comment->likes->contains('user_id', auth()->id());
            return $comment;
        });

        return $post;
    });

    return Inertia::render('CollectionPosts', [
        'collection' => $collection,
        'posts' => $posts,
    ]);
}

    
}