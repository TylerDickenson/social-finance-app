<?php
// filepath: /Users/tylerdickenson/Projects/finance-app-3.0/social-finance-app/app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments.user'])->get(); // Fetch posts with user and comments information
        return Inertia::render('Dashboard', ['posts' => $posts]);
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
            'image' => 'nullable|string',
        ]);

        Post::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'content' => $request->content,
            'image' => $request->image,
        ]);

        return redirect()->route('dashboard');
    }
}