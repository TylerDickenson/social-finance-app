<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Tag;

class CommentController extends Controller
{
    /**
     * Anonymize a comment's user information if needed.
     */
    private function anonymizeCommentUser($comment, $currentUser)
    {
        $commentCopy = clone $comment;
                if ($commentCopy->post && $commentCopy->post->is_anonymous && 
            (!$currentUser || $commentCopy->user_id !== $currentUser->id)) {
            $commentCopy->user = (object)[
                'id' => $commentCopy->user_id,
                'name' => 'Anonymous',
                'avatar_url' => '/Images/anonymous-avatar.png',
                'is_anonymous' => true
            ];
        }
        
        return $commentCopy;
    }


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

        $comment->load('user', 'post', 'tags');
        $comment->likes_count = 0;
        $comment->is_liked_by_user = false;
        
        $anonymizedComment = $this->anonymizeCommentUser($comment, $request->user());
        
        $this->syncTags($comment, $request->content);
        
        return response()->json([
            'success' => true,
            'comment' => $anonymizedComment
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
        
        $anonymizedComment = $this->anonymizeCommentUser($comment, $request->user());

        return response()->json([
            'success' => true,
            'comment' => $anonymizedComment
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

    /**
     * Like a comment.
     */
    public function like($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->likes()->create(['user_id' => auth()->id()]);
        return response()->json(['success' => true]);
    }

    /**
     * Unlike a comment.
     */
    public function unlike($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->likes()->where('user_id', auth()->id())->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Sync tags from comment content.
     */
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
