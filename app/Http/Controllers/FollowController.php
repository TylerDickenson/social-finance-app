<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    // Follow a user
    public function follow($id)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($id);

        // Attach the user to the following relationship
        if (!$user->following()->where('followed_id', $id)->exists()) {
            $user->following()->attach($id);
        }

        // Return a success response
        return response()->json([
            'message' => 'Followed successfully',
            'isFollowing' => true, // This tells the frontend that the user is now following
        ]);
    }

    // Unfollow a user
    public function unfollow($id)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($id);

        // Detach the user from the following relationship
        if ($user->following()->where('followed_id', $id)->exists()) {
            $user->following()->detach($id);
        }

        // Return a success response
        return response()->json([
            'message' => 'Unfollowed successfully',
            'isFollowing' => false, // This tells the frontend that the user is no longer following
        ]);
    }
}
