<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Tag;

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

        $comment->load('user', 'tags');
        $comment->likes_count = 0;
        $comment->is_liked_by_user = false;

        $this->syncTags($comment, $request->content);
        $comment->load('user', 'tags');

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

        $this->syncTags($comment, $request->content);

        $comment->load('user', 'tags');

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


    private function syncTags(Comment $comment, string $textToScan): void
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

        $comment->tags()->sync($tagIds);
    }


}