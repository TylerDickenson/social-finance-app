<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Collection;
use App\Models\Post;
use App\Models\User;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user with ID 4 exists
        $user = User::find(6);

        if (!$user) {
            $this->command->error('User with ID 4 does not exist. Please create the user first.');
            return;
        }

        // Create a new collection for user ID 4
        $collection = Collection::create([
            'name' => 'User 4 Collection',
            'description' => 'A collection of posts for user 4.',
            'user_id' => $user->id,
        ]);

        // Attach the first 3 posts to the collection
        $posts = Post::take(3)->pluck('id');
        $collection->posts()->attach($posts);

        $this->command->info('Collection seeded for user ID 4.');
    }
}