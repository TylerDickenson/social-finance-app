<?php

namespace Tests\Feature;

use App\Models\Collection;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollectionTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_create_collection()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/collections', [
                'name' => 'My Test Collection',
                'description' => 'A collection for testing',
                'is_private' => true,
            ]);
            
        $response->assertRedirect(route('collections.index'));
        $this->assertDatabaseHas('collections', [
            'user_id' => $user->id,
            'name' => 'My Test Collection',
            'description' => 'A collection for testing',
            'is_private' => 1,
        ]);
    }
    
    public function test_user_can_update_collection()
    {
        $user = User::factory()->create();
        $collection = Collection::factory()->create([
            'user_id' => $user->id,
            'name' => 'Original Name',
        ]);
        
        $response = $this->actingAs($user)
            ->patch("/collections/{$collection->id}", [
                'name' => 'Updated Collection Name',
                'description' => 'Updated description',
                'is_private' => false,
            ]);
            
        $this->assertDatabaseHas('collections', [
            'id' => $collection->id,
            'name' => 'Updated Collection Name',
            'description' => 'Updated description',
            'is_private' => 0,
        ]);
    }
    
    public function test_user_cannot_update_liked_posts_collection()
    {
        $user = User::factory()->create();
        $collection = Collection::factory()->create([
            'user_id' => $user->id,
            'name' => 'Liked Posts',
        ]);
        
        $response = $this->actingAs($user)
            ->patch("/collections/{$collection->id}", [
                'name' => 'Trying to rename liked posts',
            ]);
            
        $this->assertDatabaseHas('collections', [
            'id' => $collection->id,
            'name' => 'Liked Posts', 
        ]);
    }
    
    public function test_user_can_add_post_to_collection()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $collection = Collection::factory()->create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)
            ->post('/collections/addpost', [
                'collection_id' => $collection->id,
                'post_id' => $post->id,
            ]);
            
        $response->assertStatus(200);
        $this->assertTrue($collection->posts()->where('posts.id', $post->id)->exists());
    }
    
    public function test_user_can_remove_post_from_collection()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $collection = Collection::factory()->create(['user_id' => $user->id]);
        
        $collection->posts()->attach($post->id);
        
        $response = $this->actingAs($user)
            ->post('/collections/removepost', [
                'collection_id' => $collection->id,
                'post_id' => $post->id,
            ]);
            
        $response->assertStatus(200);
        $this->assertFalse($collection->posts()->where('posts.id', $post->id)->exists());
    }
    
    public function test_private_collection_is_not_visible_to_others()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $privateCollection = Collection::factory()->create([
            'user_id' => $user1->id,
            'is_private' => true,
        ]);
        
        $response = $this->actingAs($user2)
            ->get("/collections/{$privateCollection->id}");
            
        $response->assertStatus(403);
    }
}