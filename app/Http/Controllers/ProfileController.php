<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Post;
use App\Models\User;
use App\Services\PostService;


class ProfileController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function show($id)
    {
        $user = User::with('followers', 'following')->findOrFail($id);
        $user->is_following = auth()->check() ? auth()->user()->isFollowing($user->id) : false;

        $posts = $user->posts()
            ->when(!auth()->check() || auth()->id() !== $user->id, function($query) {
                return $query->where('is_anonymous', false);
            })
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
            ->get()
            ->map(fn($post) => $this->postService->transformPost($post));

        return Inertia::render('Profile/Show', [
            'user' => $user,
            'posts' => $posts,

        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'about' => auth()->user()->about,
             'avatarUrl' => auth()->user()->avatar_url,
            'isAnonymous' => (bool)auth()->user()->anonymous, 
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateAbout(Request $request)
    {
        $request->validate([
            'about' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $user->about = $request->input('about');
        $user->save();

        return back()->with('status', 'About section updated successfully.');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();
        if ($user->avatar && $user->avatar !== 'Images/anonymous-avatar.png') {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return back()->with('status', 'avatar-updated');
    }

    public function updateAnonymous(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'anonymous' => 'required|boolean',
        ]);
        
        $user->anonymous = $validated['anonymous'];
        $user->save();
        

        Auth::login($user->fresh());
        
        return back();
    }
}