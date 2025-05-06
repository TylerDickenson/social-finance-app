<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        $defaultAvatar = '/images/Backgrounds/Avatar.jpeg'; 

        DB::table('users')->insert([
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'anonymous' => false,
                'avatar' => $defaultAvatar,
                'about' => 'I am a software developer.',
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'anonymous' => false,
                'avatar' => '/images/Chase.png', 
                'about' => 'I am a software developer.',
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Anonymous User',
                'email' => 'anonymous@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'anonymous' => true,
                'avatar' => $defaultAvatar,
                'about' => 'I am a software developer.',
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}