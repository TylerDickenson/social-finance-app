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
        $defaultAvatar = '/images/Backgrounds/Avatar.jpeg'; // Ensure this path is correct

        DB::table('users')->insert([
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'anonymous' => false,
                'avatar' => $defaultAvatar,
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
                'avatar' => '/images/Chase.png', // Ensure this path is correct
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
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}