<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_like_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        
        $response = $this->actingAs($user)
            ->post("/posts/{$post->id}/like");
            
        $response->assertStatus(200);
        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => 'App\\Models\\Post',
        ]);
    }
    
    public function test_liked_post_is_added_to_liked_posts_collection()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        
        $this->actingAs($user)->post("/posts/{$post->id}/like");
        
        $likedCollection = $user->collections()->where('name', 'Liked Posts')->first();
        $this->assertNotNull($likedCollection);
        $this->assertTrue($likedCollection->posts()->where('posts.id', $post->id)->exists());
    }
    
    public function test_user_can_unlike_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        
        // First like the post
        $this->actingAs($user)->post("/posts/{$post->id}/like");
        
        // Then unlike it
        $response = $this->actingAs($user)
            ->delete("/posts/{$post->id}/like");
            
        $response->assertStatus(200);
        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => 'App\\Models\\Post',
        ]);
    }
    
    public function test_unliked_post_is_removed_from_liked_collection()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        
        // First like the post
        $this->actingAs($user)->post("/posts/{$post->id}/like");
        
        // Then unlike it
        $this->actingAs($user)->delete("/posts/{$post->id}/like");
        
        $likedCollection = $user->collections()->where('name', 'Liked Posts')->first();
        $this->assertFalse($likedCollection->posts()->where('posts.id', $post->id)->exists());
    }
    
    public function test_user_can_follow_another_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $response = $this->actingAs($user1)
            ->post("/follow/{$user2->id}");
            
        $response->assertRedirect();
        $this->assertTrue($user1->following->contains($user2->id));
        $this->assertTrue($user2->followers->contains($user1->id));
    }
    
    public function test_user_can_unfollow_another_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $this->actingAs($user1)->post("/follow/{$user2->id}");
        
        $response = $this->actingAs($user1)
            ->post("/unfollow/{$user2->id}");
            
        $response->assertRedirect();
        $this->assertFalse($user1->following()->where('following_id', $user2->id)->exists());
    }
    
    public function test_following_view_shows_followed_users_posts()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user2->id]);
        
        $this->actingAs($user1)->post("/follow/{$user2->id}");
        
        $response = $this->actingAs($user1)->get('/following');
        
        $response->assertStatus(200);
    }
}