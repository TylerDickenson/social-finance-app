<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_comment_on_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/comments', [
                'content' => 'This is a test comment',
                'postId' => $post->id,
            ]);
            
        $response->assertStatus(200);
        $this->assertDatabaseHas('comments', [
            'user_id' => $user->id,
            'post_id' => $post->id,
            'content' => 'This is a test comment',
        ]);
    }
    
    public function test_user_can_edit_own_comment()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'post_id' => $post->id,
            'content' => 'Original comment'
        ]);
        
        $response = $this->actingAs($user)
            ->put("/comments/{$comment->id}", [
                'content' => 'Updated comment',
            ]);
            
        $response->assertStatus(200);
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Updated comment',
        ]);
    }
    
    public function test_user_cannot_edit_others_comment()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user1->id,
            'post_id' => $post->id,
        ]);
        
        $response = $this->actingAs($user2)
            ->put("/comments/{$comment->id}", [
                'content' => 'Should not update',
            ]);
            
        $response->assertStatus(403);
    }
    
    public function test_user_can_delete_own_comment()
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)
            ->delete("/comments/{$comment->id}");
            
        $response->assertStatus(200);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }
    
    public function test_tags_are_extracted_from_comment_content()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/comments', [
                'content' => 'I like $AAPL better than $MSFT',
                'postId' => $post->id,
            ]);
            
        $comment = Comment::latest()->first();
        
        $this->assertEquals(2, $comment->tags()->count());
        $this->assertTrue($comment->tags->pluck('name')->contains('AAPL'));
        $this->assertTrue($comment->tags->pluck('name')->contains('MSFT'));
    }
}