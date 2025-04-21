<?php


use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\TagController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/discover', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/following', [FollowController::class, 'following'])->middleware(['auth', 'verified'])->name('following');


Route::post('/posts', [PostController::class, 'store'])->middleware(['auth', 'verified'])->name('posts.store');
Route::get('/posts/create', [PostController::class, 'create'])->middleware(['auth', 'verified'])->name('posts.create');
Route::put('/posts/{id}', [PostController::class, 'update'])->middleware(['auth', 'verified'])->name('posts.update');
Route::delete('/posts/{id}', [PostController::class, 'destroy'])->middleware(['auth', 'verified'])->name('posts.destroy');
route::get('/posts/{id}', [PostController::class, 'show'])->middleware(['auth', 'verified'])->name('posts.show');

Route::post('/comments', [CommentController::class, 'store'])->middleware(['auth', 'verified'])->name('comments.store');
Route::put('/comments/{id}', [CommentController::class, 'update'])->middleware(['auth', 'verified'])->name('comments.update');
Route::delete('/comments/{id}', [CommentController::class, 'destroy'])->middleware(['auth', 'verified'])->name('comments.destroy');
Route::patch('/comments/{id}', [CommentController::class, 'update'])->middleware(['auth', 'verified']);

Route::patch('/profile/about', [ProfileController::class, 'updateAbout'])->middleware(['auth', 'verified'])->name('profile.updateAbout');

Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->middleware(['auth', 'verified'])->name('profile.updateAvatar');

Route::post('/follow/{id}', [FollowController::class, 'follow'])->middleware(['auth', 'verified'])->name('follow');
Route::post('/unfollow/{id}', [FollowController::class, 'unfollow'])->middleware(['auth', 'verified'])->name('unfollow');
Route::post('/posts/{id}/like', [PostController::class, 'like'])->name('posts.like');
Route::delete('/posts/{id}/like', [PostController::class, 'unlike'])->name('posts.unlike');
Route::post('/comments/{id}/like', [CommentController::class, 'like'])->middleware(['auth', 'verified'])->name('comments.like');
Route::delete('/comments/{id}/like', [CommentController::class, 'unlike'])->middleware(['auth', 'verified'])->name('comments.unlike');


Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
    
});

Route::post('/collections/removepost', [CollectionController::class, 'removePost'])
    ->middleware('auth')
    ->name('collections.removePost');

Route::middleware(['auth'])->group(function () {
    Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
    Route::get('/collections/{id}', [CollectionController::class, 'show'])->name('collections.show');
    Route::delete('/collections/{id}', [CollectionController::class, 'destroy'])->name('collections.destroy');
    Route::post('/collections', [CollectionController::class, 'store'])->name('collections.store');
    Route::post('/collections/addpost', [CollectionController::class, 'addPost'])->middleware('auth')->name('collections.addPost');
    Route::patch('/collections/{id}', [CollectionController::class, 'update'])->name('collections.update');
});


Route::get('/tag/{tagName}', [TagController::class, 'show'])->middleware(['auth', 'verified'])->name('tags.show');







require __DIR__.'/auth.php';