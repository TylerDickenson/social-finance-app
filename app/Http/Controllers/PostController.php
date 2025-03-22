<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments.user', 'comments.likes'])
            ->withCount('likes')
            ->get()
            ->map(function ($post) {
                // Add is_liked_by_user for the post
                $post->is_liked_by_user = $post->likes->contains('user_id', auth()->id());

                // Add is_following for the post's user
                $post->user->is_following = auth()->user()->isFollowing($post->user->id);

                // Add likes_count and is_liked_by_user for comments
                $post->comments->map(function ($comment) {
                    $comment->likes_count = $comment->likes->count();
                    $comment->is_liked_by_user = $comment->likes->contains('user_id', auth()->id());
                    return $comment;
                });

                return $post;
            });

        return Inertia::render('Dashboard', ['posts' => $posts]);
    }

    public function following()
    {
        $posts = Post::with(['user', 'comments.user', 'comments.likes'])
            ->withCount('likes')
            ->get()
            ->map(function ($post) {
                // Add is_liked_by_user for the post
                $post->is_liked_by_user = $post->likes->contains('user_id', auth()->id());

                // Add is_following for the post's user
                $post->user->is_following = auth()->user()->isFollowing($post->user->id);

                // Add likes_count and is_liked_by_user for comments
                $post->comments->map(function ($comment) {
                    $comment->likes_count = $comment->likes->count();
                    $comment->is_liked_by_user = $comment->likes->contains('user_id', auth()->id());
                    return $comment;
                });

                return $post;
            });

        return Inertia::render('Following', ['posts' => $posts]);
    }

    public function create()
    {
        return Inertia::render('Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        Post::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imagePath,
        ]);

        return redirect()->route('dashboard');
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = $post->image;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imagePath,
        ]);

        return response()->json(['success' => 'Post updated successfully.']);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $post->delete();

        return redirect()->back();
    }

    public function like($id)
{
    $post = Post::findOrFail($id);

    // Check if the user has already liked the post
    $alreadyLiked = $post->likes()->where('user_id', auth()->id())->exists();

    if ($alreadyLiked) {
        return response()->json(['success' => false, 'message' => 'You have already liked this post.'], 400);
    }

    // Create a new like
    $post->likes()->create(['user_id' => auth()->id()]);

    return response()->json(['success' => true]);
}

    public function unlike($id)
    {
        $post = Post::findOrFail($id);
        $post->likes()->where('user_id', auth()->id())->delete();
        return response()->json(['success' => true]);
    }
}