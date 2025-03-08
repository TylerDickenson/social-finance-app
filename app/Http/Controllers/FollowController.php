<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function follow($id)
    {
        Auth::user()->following()->attach($id);
        return redirect()->back();
    }

    public function unfollow($id)
    {
        Auth::user()->following()->detach($id);
        return redirect()->back();
    }
}