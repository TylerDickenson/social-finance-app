import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function Following({ posts: initialPosts, auth }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const filteredPosts = initialPosts
            .filter(post => post.user.is_following)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(filteredPosts);
    }, [initialPosts]);

    const handleFollowChange = (userId, isFollowing) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.user.id === userId ? { ...post, user: { ...post.user, is_following: isFollowing } } : post
            )
        );
    };

    return (
        <AuthenticatedLayout header="Followed Users">
            <Head title="Following" />

            <div className="">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
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
                                <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8">
                                    <p className="text-gray-500 dark:text-gray-400 text-center">You do not follow anyone yet, follow users to see their posts here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}