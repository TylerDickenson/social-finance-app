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
            ['description' => 'A collection of all the posts you have liked.']
        );

        $collections = auth()->user()->collections()
            ->with('posts') // Include the posts relationship
            ->withCount('posts') // Include the count of posts in each collection
            ->get();

        // Return JSON if the request is an API call
        if ($request->wantsJson()) {
            return response()->json(['collections' => $collections]);
        }

        // Default behavior for Inertia.js rendering
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $collection = auth()->user()->collections()->create($validated);

        return redirect()->route('collections.index')->with('success', 'Collection created successfully!');
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        // Ensure the user is authorized to update the collection
        if ($collection->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $collection->update($validated);

        // Return the updated collection as a JSON response
        return response()->json(['success' => true, 'collection' => $collection]);
    }

    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);

        // Ensure the user is authorized to delete the collection
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

        // Ensure the user owns the collection
        if ($collection->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Attach the post to the collection
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