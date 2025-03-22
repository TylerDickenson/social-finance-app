<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LikeSeeder extends Seeder
{
   

    public function run(): void
    {
        DB::table('likes')->insert([
            [
                'user_id' => 1, // John Doe
                'likeable_id' => 1, // Post ID
                'likeable_type' => 'App\Models\Post',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2, // Jane Smith
                'likeable_id' => 1, // Post ID
                'likeable_type' => 'App\Models\Post',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3, // Anonymous User
                'likeable_id' => 1, // Comment ID
                'likeable_type' => 'App\Models\Comment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
