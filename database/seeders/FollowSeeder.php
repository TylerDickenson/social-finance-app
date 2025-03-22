<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('follows')->insert([
            [
                'follower_id' => 1, // Valid user ID
                'following_id' => 2, // Valid user ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 2, // Valid user ID
                'following_id' => 1, // Valid user ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 3, // Valid user ID
                'following_id' => 1, // Valid user ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}