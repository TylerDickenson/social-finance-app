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
                'user_id' => 1, 
                'likeable_id' => 1, 
                'likeable_type' => 'App\Models\Post',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2, 
                'likeable_id' => 1, 
                'likeable_type' => 'App\Models\Post',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3, 
                'likeable_id' => 1, 
                'likeable_type' => 'App\Models\Comment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
