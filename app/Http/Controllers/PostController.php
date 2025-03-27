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

        return response()->json(['success' => true, 'message' => 'Post liked successfully.']);
    }

    public function unlike($id)
    {
        $post = Post::findOrFail($id);

        $post->likes()->where('user_id', auth()->id())->delete();

        return response()->json(['success' => true, 'message' => 'Post unliked successfully.']);
    }

    // Helper Methods
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
            // Delete the old image if it exists
            if ($existingImagePath) {
                \Storage::disk('public')->delete($existingImagePath);
            }

            // Store the new image
            return $request->file('image')->store('images', 'public');
        }

        // Return the existing image path if no new image is uploaded
        return $existingImagePath;
    }

    private function authorizePost(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}