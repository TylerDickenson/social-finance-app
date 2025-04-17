<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'image',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image && strpos($this->image, 'images/') === 0) {
            return Storage::disk('public')->url($this->image);
        }
        return $this->image ? url($this->image) : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_post');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}