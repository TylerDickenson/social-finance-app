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

        Comment::create([
            'user_id' => auth()->id(),
            'post_id' => $request->postId,
            'content' => $request->content,
        ]);

        return back()->with('success', 'Comment added successfully.');
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

        return back()->with('success', 'Comment updated successfully.');
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();

        return redirect()->back();
    }
}