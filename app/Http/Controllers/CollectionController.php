<?php
namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CollectionController extends Controller
{
    public function index(Request $request)
    {

        $user = auth()->user();

        $defaultCollection = $user->collections()->firstOrCreate(
            ['name' => 'Liked Posts'],
            [
                'description' => 'A collection of all the posts you have liked.',
                'is_private' => true
            ]
        );

        $collections = auth()->user()->collections()
            ->with('posts')
            ->withCount('posts') 
            ->get();

        if ($request->wantsJson()) {
            return response()->json(['collections' => $collections]);
        }

        return Inertia::render('Collections', [
            'collections' => $collections,
        ]);
    }

    public function show($id)
    {
        $collection = Collection::with([
            'posts' => function ($query) {
                $query->with([
                        'user', // Eager load the post author
                        'comments.user',
                        'comments.likes',
                        'likes'
                      ])
                      ->withCount('likes', 'comments')
                      ->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        if (($collection->is_private || $collection->name === 'Liked Posts') && $collection->user_id !== auth()->id()) {
            abort(403, 'This collection is private or inaccessible.');
        }

        $posts = $collection->posts->map(function ($post) {
            $post->is_liked_by_user = $post->likes->contains('user_id', auth()->id());

            if (auth()->check() && $post->relationLoaded('user')) {
                $post->user->is_following = auth()->user()->isFollowing($post->user->id);
            } elseif ($post->relationLoaded('user')) {
                $post->user->is_following = false;
            }

            $post->comments->each(function ($comment) {
                 if ($comment->relationLoaded('likes')) {
                    $comment->likes_count = $comment->likes->count();
                    $comment->is_liked_by_user = $comment->likes->contains('user_id', auth()->id());
                 } else {
                    $comment->likes_count = 0;
                    $comment->is_liked_by_user = false;
                 }
            });

            return $post;
        });


        return Inertia::render('CollectionPosts', [
            'collection' => $collection,
            'posts' => $posts,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_private' => 'required|boolean',
        ]);

        $collection = auth()->user()->collections()->create($validated);

        return redirect()->route('collections.index')->with('success', 'Collection created successfully!');
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        if ($collection->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'is_private' => 'required|boolean',
        ]);

        $collection->update($validated);

        return response()->json(['success' => true, 'collection' => $collection]);
    }

    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);

        if ($collection->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $collection->delete();

        return response()->json(['success' => true]);
    }

    public function addPost(Request $request)
    {
        $validated = $request->validate([
            'collection_id' => 'required|exists:collections,id',
            'post_id' => 'required|exists:posts,id',
        ]);

        $collection = Collection::findOrFail($validated['collection_id']);

        if ($collection->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $collection->posts()->syncWithoutDetaching($validated['post_id']);

        return response()->json(['success' => true, 'message' => 'Post added to collection successfully.']);
    }

    public function removePost(Request $request)
    {
        $validated = $request->validate([
            'collection_id' => 'required|exists:collections,id',
            'post_id' => 'required|exists:posts,id',
        ]);

        $collection = Collection::findOrFail($validated['collection_id']);

        if ($collection->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        
        $collection->posts()->detach($validated['post_id']);

        return response()->json(['success' => true, 'message' => 'Post removed from collection successfully.']);
    }

    
    
    
}