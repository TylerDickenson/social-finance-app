import React, { useState, useEffect, useRef, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function Dashboard({ posts: paginatedPosts, auth }) {
    const [allPosts, setAllPosts] = useState(paginatedPosts.data);
    const [currentPage, setCurrentPage] = useState(paginatedPosts.current_page);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);

    const handleLoadMore = () => {
        if (loading || currentPage >= paginatedPosts.last_page) return;

        setLoading(true);
        const nextPage = currentPage + 1;

        router.get(
            route('dashboard', { page: nextPage }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (response) => {
                    setAllPosts((prevPosts) => [...prevPosts, ...response.props.posts.data]);
                    setCurrentPage(nextPage);
                    setLoading(false);
                },
            }
        );
    };

    const handlePostDelete = (postId) => {
        setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    const lastPostRef = useCallback((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (node && currentPage < paginatedPosts.last_page && !loading) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        handleLoadMore();
                    }
                },
                {
                    threshold: 0.5,
                    rootMargin: '100px',
                }
            );

            observerRef.current.observe(node);
        }
    }, [currentPage, paginatedPosts.last_page, loading]);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <AuthenticatedLayout header="All Posts">
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {allPosts && allPosts.length > 0 ? (
                                <>
                                    {allPosts.map((post, index) => (
                                        <div
                                            key={post.id}
                                            ref={index === allPosts.length - 1 ? lastPostRef : null}
                                            className="mb-6"
                                        >
                                            <Post
                                                post={post}
                                                currentUserId={auth.user.id}
                                                onFollowChange={(userId, isFollowing) => {
                                                    setAllPosts((prevPosts) =>
                                                        prevPosts.map((p) =>
                                                            p.user.id === userId
                                                                ? { ...p, user: { ...p.user, is_following: isFollowing } }
                                                                : p
                                                        )
                                                    );
                                                }}
                                                onPostDelete={handlePostDelete} 
                                            />
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex flex-col items-center justify-center p-4 mt-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                                            <p className="mt-2 text-gray-600">Loading more posts...</p>
                                        </div>
                                    )}
                                    {!loading && currentPage < paginatedPosts.last_page && (
                                        <div className="text-center text-gray-600 mt-4">
                                            Scroll for more posts
                                        </div>
                                    )}
                                </>
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