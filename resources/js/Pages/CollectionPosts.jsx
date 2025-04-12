import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function CollectionPosts({ collection, posts: initialPosts, auth }) {
    const [posts, setPosts] = useState(initialPosts);

    const handleLikeToggle = async (postId, isLiked) => {
        try {
            if (isLiked) {
                await axios.post(route('posts.like', { id: postId }));
            } else {
                await axios.delete(route('posts.unlike', { id: postId }));
            }
            
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              is_liked_by_user: isLiked,
                              likes_count: post.likes_count + (isLiked ? 1 : -1),
                          }
                        : post
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handlePostRemove = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    return (
        <AuthenticatedLayout header={collection.name}>
            <Head title={collection.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold">{collection.name}</h1>
                            <p className="mt-2 text-gray-600">{collection.description}</p>
                            <h2 className="mt-6 text-xl font-semibold">Posts</h2>
                            <div className="mt-4">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            currentUserId={auth.user.id}
                                            onLikeToggle={handleLikeToggle}
                                            onPostRemove={handlePostRemove}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-600">No posts in this collection.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}