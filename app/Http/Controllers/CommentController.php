<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'postId' => 'required|exists:posts,id',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'post_id' => $request->postId,
            'content' => $request->content,
        ]);

        // Load the relationships needed for the frontend
        $comment->load('user');
        $comment->likes_count = 0;
        $comment->is_liked_by_user = false;

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();

        return response()->json(['success' => true]);
    }

    public function like($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->likes()->create(['user_id' => auth()->id()]);
        return response()->json(['success' => true]);
    }

    public function unlike($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->likes()->where('user_id', auth()->id())->delete();
        return response()->json(['success' => true]);
    }

}