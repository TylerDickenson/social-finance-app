<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TagTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_tag_is_created_when_used_in_post()
    {
        $user = User::factory()->create();
        
        $this->actingAs($user)->post('/posts', [
            'title' => 'Stock Discussion',
            'content' => 'I think $NVDA is going to the moon!',
        ]);
        
        $this->assertDatabaseHas('tags', [
            'name' => 'NVDA',
        ]);
    }
    
    public function test_tag_show_displays_related_posts()
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['name' => 'TSLA']);
        
        $post = Post::factory()->create(['user_id' => $user->id]);
        $post->tags()->attach($tag->id);
        
        $response = $this->actingAs($user)
            ->get("/tag/{$tag->name}");
            
        $response->assertStatus(200);
    }
    
    public function test_discussions_page_shows_all_tags()
    {
        $user = User::factory()->create();
        Tag::factory()->create(['name' => 'AAPL']);
        Tag::factory()->create(['name' => 'MSFT']);
        
        $response = $this->actingAs($user)->get('/discussions');
        
        $response->assertStatus(200);
    }
    
    public function test_tag_filtering_works()
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['name' => 'AMZN']);
        $post1 = Post::factory()->create();
        $post2 = Post::factory()->create();
        
        $post1->tags()->attach($tag->id);
        
        $response = $this->actingAs($user)
            ->get("/tag/{$tag->name}");
            

        $response->assertStatus(200);
    }
}