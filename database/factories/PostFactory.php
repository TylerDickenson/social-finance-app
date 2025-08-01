<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), 
            'title' => $this->faker->sentence, 
            'content' => $this->faker->paragraph, 
            'image' => null,
            'is_anonymous' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
