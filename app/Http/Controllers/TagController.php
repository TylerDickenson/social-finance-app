<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Services\PostService;
use Illuminate\Support\Collection;

class TagController extends Controller
{
    protected $postService;

    

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index()
    {
        $tags = Tag::whereHas('posts')
                ->withCount('posts')
                ->get()
                ->groupBy(function ($tag) {
                    return strtoupper(substr($tag->name, 0, 1)); 
                })
                ->sortKeys(); 

        return Inertia::render('Discussions', [
            'tags' => $tags
        ]);
    }

    public function show(Request $request, string $tagName)
    {
        $tag = Tag::where('name', strtoupper($tagName))->firstOrFail();

        $directlyTaggedPostIds = $tag->posts()->pluck('posts.id');

        $commentParentPostIds = $tag->comments()
                                    ->select('post_id')
                                    ->distinct()
                                    ->pluck('post_id');

        $allRelevantPostIds = $directlyTaggedPostIds->merge($commentParentPostIds)->unique();

        $postsCollection = Post::whereIn('id', $allRelevantPostIds)
                               ->with([
                                   'user',
                                   'likes',
                                   'tags',
                                   'comments' => function ($query) {
                                       $query->with(['user', 'likes', 'tags'])
                                             ->withCount('likes')
                                             ->orderBy('created_at', 'asc');
                                   }
                               ])
                               ->withCount(['likes', 'comments'])
                               ->orderBy('created_at', 'desc')
                               ->get();

        $posts = $postsCollection->map(fn($post) => $this->postService->transformPost($post));

        return Inertia::render('TagShow', [
            'tag' => $tag,
            'posts' => $posts,
        ]);
    }
}