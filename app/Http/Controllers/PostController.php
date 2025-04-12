<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function create()
    {
        return Inertia::render('Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validatePost($request);

        $imagePath = $this->handleImageUpload($request);

        Post::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'image' => $imagePath,
        ]));

        return redirect()->route('dashboard')->with('status', 'Post created successfully.');
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $this->authorizePost($post);

        $validated = $this->validatePost($request);

        $imagePath = $this->handleImageUpload($request, $post->image);

        $post->update(array_merge($validated, ['image' => $imagePath]));

        return response()->json(['success' => 'Post updated successfully.']);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        // Ensure the user is authorized to delete the post
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $post->delete();

        return response()->json(['success' => true]);
    }

    public function like($id)
    {
        $post = Post::findOrFail($id);

        if ($post->likes()->where('user_id', auth()->id())->exists()) {
            return response()->json(['success' => false, 'message' => 'You have already liked this post.'], 400);
        }

        $post->likes()->create(['user_id' => auth()->id()]);

        $likedCollection = auth()->user()->collections()->firstOrCreate(
            ['name' => 'Liked Posts'],
            ['description' => 'A collection of all the posts you have liked.']
        );

        $likedCollection->posts()->syncWithoutDetaching([$post->id]);

        return response()->json(['success' => true, 'message' => 'Post liked successfully.']);
    }

    public function unlike($id)
    {
        $post = Post::findOrFail($id);

        $post->likes()->where('user_id', auth()->id())->delete();


        $likedCollection = auth()->user()->collections()->where('name', 'Liked Posts')->first();

        if ($likedCollection) {
            $likedCollection->posts()->detach($post->id);
        }

        return response()->json(['success' => true, 'message' => 'Post unliked successfully.']);
    }

    private function validatePost(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    }

    private function handleImageUpload(Request $request, $existingImagePath = null)
    {
        if ($request->hasFile('image')) {
            if ($existingImagePath) {
                \Storage::disk('public')->delete($existingImagePath);
            }

            return $request->file('image')->store('images', 'public');
        }

        return $existingImagePath;
    }

    private function authorizePost(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}