<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like(Request $request)
    {
        $request->validate([
            'likeable_id' => 'required|integer',
            'likeable_type' => 'required|string',
        ]);

        $like = Like::firstOrCreate([
            'user_id' => auth()->id(),
            'likeable_id' => $request->likeable_id,
            'likeable_type' => $request->likeable_type,
        ]);

        return response()->json(['success' => true, 'like' => $like]);
    }

    public function unlike(Request $request)
    {
        $request->validate([
            'likeable_id' => 'required|integer',
            'likeable_type' => 'required|string',
        ]);

        Like::where([
            'user_id' => auth()->id(),
            'likeable_id' => $request->likeable_id,
            'likeable_type' => $request->likeable_type,
        ])->delete();

        return response()->json(['success' => true]);
    }
}