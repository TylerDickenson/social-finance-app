<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Http\Request; // Import Request

class DashboardController extends Controller
{
    // Inject Request
    public function index(Request $request)
    {
        $posts = Post::with(['user', 'comments.user', 'comments.likes'])
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Adjust pagination size if needed

        // Transform the collection for both Inertia and JSON responses
        $posts->getCollection()->transform(function ($post) {
            // Ensure auth check happens before accessing user id
            $post->is_liked_by_user = auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false;

            // Check if user and auth exist before checking following status
            if (auth()->check() && $post->user) {
                 $post->user->is_following = auth()->user()->following->contains($post->user_id);
            } else if ($post->user) {
                 // Set default if not logged in or post has no user (though unlikely)
                 $post->user->is_following = false;
            }
            return $post;
        });

        // Check if the request wants JSON (AJAX call from manual fetch)
        if ($request->wantsJson()) {
            // Return the paginator object directly, Laravel handles JSON conversion
            return response()->json(['posts' => $posts]);
        }

        // Default Inertia response for initial page load
        return Inertia::render('Dashboard', [
            'posts' => $posts, // Pass the full paginator object
        ]);
    }
}