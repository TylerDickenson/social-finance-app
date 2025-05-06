<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('comments')->insert([
            [
                'post_id' => 1,
                'user_id' => 1,
                'content' => 'This is a comment on the first post.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'post_id' => 1,
                'user_id' => 2,
                'content' => 'This is another comment on the first post.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'post_id' => 2,
                'user_id' => 3,
                'content' => 'This is a comment on the second post.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'post_id' => 3,
                'user_id' => 1,
                'content' => 'This is a comment on the anonymous post.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'post_id' => 3,
                'user_id' => 1,
                'content' => 'This post is anonymous.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
