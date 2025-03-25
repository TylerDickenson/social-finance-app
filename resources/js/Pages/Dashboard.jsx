import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function Dashboard({ posts: initialPosts, auth }) {
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState(10); // Number of posts to display initially

    useEffect(() => {
        // Sort all posts from newest to oldest
        const sortedPosts = initialPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedPosts);
    }, [initialPosts]);

    const handleLoadMore = () => {
        setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 10); // Load 4 more posts
    };

    return (
        <AuthenticatedLayout header="All Posts">
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {posts && posts.length > 0 ? (
                                posts.slice(0, visiblePosts).map((post) => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                        currentUserId={auth.user.id}
                                        onFollowChange={(userId, isFollowing) => {
                                            setPosts((prevPosts) =>
                                                prevPosts.map((p) =>
                                                    p.user.id === userId
                                                        ? { ...p, user: { ...p.user, is_following: isFollowing } }
                                                        : p
                                                )
                                            );
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="text-lg">No posts available.</p>
                            )}
                        </div>
                        {visiblePosts < posts.length && (
                            <div className="p-6 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}