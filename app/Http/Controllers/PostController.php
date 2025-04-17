<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $post = Post::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'image' => $imagePath,
        ]));

        $this->syncTags($post, $validated['title'] . ' ' . $validated['content']);

        return redirect()->route('dashboard')->with('status', 'Post created successfully.');
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

    private function syncTags(Post $post, string $textToScan): void
    {
  
        preg_match_all('/\$([A-Za-z0-9]+)/', $textToScan, $matches);

        $tagNames = array_unique(array_map('strtoupper', $matches[1]));

        $tagIds = [];
        foreach ($tagNames as $tagName) {
            if (!empty($tagName)) { 
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
        }

        $post->tags()->sync($tagIds);
    }
}