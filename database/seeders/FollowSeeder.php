<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('follows')->insert([
            [
                'follower_id' => 9,
                'following_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 1,
                'following_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 9,
                'following_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 2,
                'following_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 9,
                'following_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'follower_id' => 3,
                'following_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}