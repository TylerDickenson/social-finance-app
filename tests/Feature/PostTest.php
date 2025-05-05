<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_post()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->post('/posts', [
            'title' => 'Test Post Title',
            'content' => 'This is the content of my test post',
            'is_anonymous' => false,
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Test Post Title',
            'content' => 'This is the content of my test post',
        ]);
    }
    
    public function test_user_can_create_anonymous_post()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->post('/posts', [
            'title' => 'Anonymous Post',
            'content' => 'This is an anonymous post',
            'is_anonymous' => true,
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Anonymous Post',
            'content' => 'This is an anonymous post',
            'is_anonymous' => 1,
        ]);
    }
    
    public function test_user_can_view_own_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)->get(route('posts.show', $post->id));
        
        $response->assertStatus(200);
    }
    
    public function test_user_can_update_own_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)->put("/posts/{$post->id}", [
            'title' => 'Updated Title',
            'content' => 'Updated content for this post',
            'is_anonymous' => false,
        ]);
        
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated Title',
            'content' => 'Updated content for this post',
        ]);
    }
    
    public function test_user_cannot_update_others_post()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user1->id]);
        
        $response = $this->actingAs($user2)->put("/posts/{$post->id}", [
            'title' => 'Unauthorized Update',
            'content' => 'This should not work',
        ]);
        
        $response->assertStatus(403);
        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
            'title' => 'Unauthorized Update',
        ]);
    }
    
    public function test_user_can_delete_own_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)->delete("/posts/{$post->id}");
        
        $response->assertStatus(200);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
    
    public function test_tags_are_extracted_from_post_content()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->post('/posts', [
            'title' => 'Post with tags',
            'content' => 'Check out these stocks $AAPL $MSFT',
        ]);
        
        $post = Post::latest()->first();
        
        $this->assertEquals(2, $post->tags()->count());
        $this->assertTrue($post->tags->pluck('name')->contains('AAPL'));
        $this->assertTrue($post->tags->pluck('name')->contains('MSFT'));
    }
}