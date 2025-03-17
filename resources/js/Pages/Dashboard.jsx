import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function Dashboard({ posts: initialPosts, auth }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Sort all posts from newest to oldest
        const sortedPosts = initialPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedPosts);
    }, [initialPosts]);

    const handleFollowChange = (userId, isFollowing) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.user.id === userId ? { ...post, user: { ...post.user, is_following: isFollowing } } : post
            )
        );
    };

    return (
        <AuthenticatedLayout header="All Posts">
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                        currentUserId={auth.user.id}
                                        onFollowChange={handleFollowChange}
                                    />
                                ))
                            ) : (
                                <p className="text-lg">No posts available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}